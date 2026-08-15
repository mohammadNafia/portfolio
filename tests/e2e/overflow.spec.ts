import { test, expect } from '@playwright/test';

/**
 * "No page scrolls sideways, at any width, in either locale."
 *
 * That rule was previously asserted on two routes — both homepages — with
 * `documentElement.scrollWidth - clientWidth`, and this suite exists because
 * that combination is wrong twice over.
 *
 * WRONG COVERAGE. The homepage is the least likely page to break: it has no
 * table, no chapter rail and no long technical token. The case studies have all
 * three, and nothing looked at them. Every route is checked here, in both
 * locales, at the three widths the layout is designed against.
 *
 * WRONG METRIC, which matters more, because it fails in the direction that
 * wastes a day. `scrollWidth` on the document counts the unclipped content box
 * of a descendant scroll container even when the viewport clips it and no
 * scrolling is possible. `/en/work/immar` at 390px reports 523 against a 390px
 * client — 133px of "overflow" that does not exist: `window.scrollX` cannot
 * move off zero in Chromium, WebKit or Firefox, and the 560px-wide role matrix
 * causing it is sitting inside its own `overflow-x: auto` wrapper, scrolling
 * internally exactly as a responsive table should.
 *
 * So the assertion is behavioural: try to scroll the window sideways and
 * require that it refuses. That is the thing the rule is actually about, it
 * cannot be satisfied by a measurement artifact, and it cannot be broken
 * without a visitor being able to drag the page off-centre.
 *
 * The companion assertion is that intentional inner scrollers stay REACHABLE.
 * The cheapest way to make the metric above go green is to clip the table
 * instead of scrolling it, which trades a phantom bug for a real one: content
 * on the page that a phone can never see.
 */

const ROUTES = [
  '',
  '/about',
  '/work',
  '/services',
  '/contact',
  '/privacy',
  '/work/sendy',
  '/work/immar',
  '/work/nano-ocr',
  '/work/al-tafawuq',
  '/work/virtual-banking',
  '/work/form-builder',
  '/work/invoice-mini-app',
  '/work/medichub',
];

const WIDTHS = [390, 768, 1440];

for (const locale of ['en', 'ar'] as const) {
  test(`no route on /${locale} can be scrolled sideways`, async ({ page }) => {
    const offenders: string[] = [];

    for (const route of ROUTES) {
      await page.goto(`/${locale}${route}`);
      await page.waitForLoadState('networkidle');

      for (const width of WIDTHS) {
        await page.setViewportSize({ width, height: 900 });
        /* The hero arc springs into place on mount; measure once it settles. */
        await page.waitForTimeout(200);

        const moved = await page.evaluate(() => {
          const start = window.scrollX;
          /*
           * Both directions. In RTL the document's scroll origin is the right
           * edge and the overflow that would matter runs negative, so a
           * positive-only probe reports every Arabic page as clean.
           */
          window.scrollTo(2000, window.scrollY);
          const forward = window.scrollX;
          window.scrollTo(-2000, window.scrollY);
          const back = window.scrollX;
          window.scrollTo(start, window.scrollY);
          return Math.max(Math.abs(forward - start), Math.abs(back - start));
        });

        if (moved > 1) offenders.push(`/${locale}${route} @${width}px scrolled ${moved}px`);
      }
    }

    expect(offenders, 'these routes scroll sideways').toEqual([]);
  });
}

/**
 * The role matrix is 560px wide by design and a phone is 390px, so it lives in
 * a horizontal scroller. This asserts the scroller is doing its job rather than
 * clipping — if `scrollWidth` ever equals `clientWidth` here, the table stopped
 * being reachable and half its columns became invisible on mobile.
 */
test('the role matrix stays reachable on a phone', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 900 });

  for (const locale of ['en', 'ar'] as const) {
    await page.goto(`/${locale}/work/immar`);
    await page.waitForLoadState('networkidle');

    const wrapper = page.locator('div.overflow-x-auto').first();
    await expect(wrapper, `${locale} has no scrollable table wrapper`).toBeVisible();

    const reach = await wrapper.evaluate((node) => ({
      client: node.clientWidth,
      scroll: node.scrollWidth,
    }));

    expect(
      reach.scroll,
      `${locale} matrix is clipped rather than scrollable`,
    ).toBeGreaterThan(reach.client);
  }
});
