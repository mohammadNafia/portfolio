import { test, expect, type Page } from '@playwright/test';

/**
 * Scroll behaviour: where an anchor lands, and what the nav claims you are
 * looking at once you get there.
 *
 * The nav pill is fixed at the top of every page, so an anchor that lands its
 * target at scroll position zero puts the heading underneath it. `section`
 * carries `scroll-margin-top: 96px` to prevent that, and this measures the
 * result rather than the declaration — the margin being present in the
 * stylesheet says nothing about whether the pill actually clears at a given
 * width, because the pill's height changes with the viewport.
 */

const SECTION_LINKS = ['work', 'background', 'case-studies'];

async function jumpTo(page: Page, id: string) {
  await page.evaluate((target) => {
    /* Cleared first so re-selecting the same hash still moves. */
    location.hash = '';
    location.hash = target;
  }, id);
  /*
   * `scroll-behavior: smooth` is global, and the distances here run to several
   * thousand pixels. Waiting for the scroll position to settle is the only
   * reliable signal — a fixed timeout either flakes on the long jumps or wastes
   * seconds on the short ones.
   */
  await page.waitForFunction(
    () =>
      new Promise<boolean>((resolve) => {
        const start = window.scrollY;
        setTimeout(() => resolve(Math.abs(window.scrollY - start) < 1), 120);
      }),
    undefined,
    { timeout: 10_000 },
  );
}

for (const locale of ['en', 'ar'] as const) {
  for (const width of [390, 1440]) {
    test(`anchors land clear of the nav pill on /${locale} at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await page.waitForLoadState('networkidle');

      for (const id of SECTION_LINKS) {
        await jumpTo(page, id);

        const gap = await page.evaluate((target) => {
          const section = document.getElementById(target);
          const nav = document.querySelector('.nav-pill');
          if (!section || !nav) throw new Error(`missing section or nav for ${target}`);
          const heading = section.querySelector('h1, h2');
          if (!heading) throw new Error(`no heading in ${target}`);
          return heading.getBoundingClientRect().top - nav.getBoundingClientRect().bottom;
        }, id);

        expect(gap, `#${id} landed under the nav pill`).toBeGreaterThan(0);
      }
    });
  }
}

/**
 * The nav must not claim you are in a section you have scrolled past.
 *
 * This is the regression test for a stale highlight: an IntersectionObserver
 * callback carries only the entries that CHANGED, so reading the active
 * section out of one batch answers "what just changed" rather than "what is on
 * screen". Leaving the last observed section delivered a single
 * `isIntersecting: false` entry, the old code found nothing to select and set
 * nothing — so "Case Studies" stayed lit through the archive, the contact
 * section and the footer.
 */
for (const locale of ['en', 'ar'] as const) {
  test(`the nav does not report a stale section on /${locale}`, async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto(`/${locale}`);
    await page.waitForLoadState('networkidle');

    const activeId = () =>
      page.evaluate(() => {
        const current = document.querySelector('.nav-pill a[aria-current="true"]');
        return current?.getAttribute('href')?.split('#')[1] ?? null;
      });

    for (const id of SECTION_LINKS) {
      await jumpTo(page, id);
      await expect
        .poll(activeId, { message: `#${id} did not become the active nav link`, timeout: 4000 })
        .toBe(id);
    }

    /* Past every observed section: the contact form at the foot of the page. */
    await page.evaluate(() => window.scrollTo({ top: document.body.scrollHeight, behavior: 'instant' }));
    await expect
      .poll(activeId, {
        message: 'the nav still highlights a section the reader has left',
        timeout: 4000,
      })
      .toBeNull();
  });
}
