import { test, expect } from '@playwright/test';

/**
 * Runs under the `mobile` project (iPhone 14 Pro, touch, coarse pointer).
 *
 * The nav pill deliberately drops its links below 760px and keeps the identity,
 * the locale switch and the CTA — that is the system's mobile rule, not an
 * omission. The routes stay reachable through the footer, which these tests
 * assert.
 */

test('nav pill stays collapsed and keeps its call to action', async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');

  await expect(page.locator('.nav-pill')).toBeVisible();

  // Links are dropped at this width by design.
  await expect(page.locator('.nav-pill__links')).toBeHidden();

  const cta = page.locator('.nav-pill__cta');
  await expect(cta).toBeVisible();
  const box = await cta.boundingBox();
  expect(box?.height ?? 0).toBeGreaterThanOrEqual(40);
});

/**
 * The locale switch is the one control a bilingual site cannot collapse. It
 * used to live inside `.nav-pill__links`, which is `display: none` below 760px
 * — so an Arabic reader landing on /en had no way back but to edit the URL.
 *
 * 390px is the narrowest mainstream phone width in circulation; if the switch
 * survives here it survives everywhere. Both locales are checked because the
 * pill is mirrored under RTL and the CTA text differs in length.
 */
test.describe('language switch at 390px', () => {
  test.use({ viewport: { width: 390, height: 844 } });

  for (const [from, to, glyph] of [
    ['/en', '/ar', 'ع'],
    ['/ar', '/en', 'EN'],
  ] as const) {
    test(`is visible and switches ${from} → ${to}`, async ({ page }) => {
      await page.goto(from);
      await page.waitForLoadState('networkidle');

      const localeSwitch = page.locator('.nav-pill__locale');
      await expect(localeSwitch).toBeVisible();
      await expect(localeSwitch).toHaveText(glyph);

      /*
       * Visible is not enough: the pill sets `overflow: hidden`, so a switch
       * pushed past the pill's edge would still report as visible while being
       * unreachable. Assert the box is inside the viewport and big enough to
       * hit with a thumb.
       */
      const box = await localeSwitch.boundingBox();
      expect(box).not.toBeNull();
      expect(box!.x).toBeGreaterThanOrEqual(0);
      expect(box!.x + box!.width).toBeLessThanOrEqual(390);
      expect(box!.width).toBeGreaterThanOrEqual(40);
      expect(box!.height).toBeGreaterThanOrEqual(40);

      // And it actually navigates — `tap`, since this project runs with touch.
      await localeSwitch.tap();
      await page.waitForURL(new RegExp(`${to}$`));
      await expect(page.locator('html')).toHaveAttribute(
        'dir',
        to === '/ar' ? 'rtl' : 'ltr',
      );
    });
  }

  test('the switch survives the pill expanding on scroll', async ({ page }) => {
    await page.goto('/en');
    await page.waitForLoadState('networkidle');
    await page.evaluate(() => window.scrollTo(0, window.innerHeight * 1.5));

    const localeSwitch = page.locator('.nav-pill__locale');
    await expect(localeSwitch).toBeVisible();
    const box = await localeSwitch.boundingBox();
    expect(box!.x + box!.width).toBeLessThanOrEqual(390);
  });
});

test('every route is reachable from the footer on a phone', async ({ page }) => {
  for (const [label, path] of [
    ['Work', '/en/work'],
    ['About', '/en/about'],
    ['Services', '/en/services'],
    ['Contact', '/en/contact'],
  ] as const) {
    await page.goto('/en');
    await page.locator('footer').getByRole('link', { name: label, exact: true }).tap();

    /*
     * `waitForURL`, not `expect(page).toHaveURL`. Four full navigations run in
     * this one test, and under a parallel run the expect timeout (5s) is not
     * always enough for a cold route — this flaked roughly once in five. The
     * navigation timeout is the right budget for a navigation; the assertion is
     * unchanged.
     */
    await page.waitForURL(new RegExp(path.replace(/\//g, '\\/') + '$'));
  }
});

test('the hero fan shows its three centre cards and they link out', async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2600);

  // Mobile keeps indexes 3, 4, 5 — the outer four are hidden.
  const visibleCards = page.locator('.hero-fan__slot:not(.hero-fan__slot--wide-only) a');
  await expect(visibleCards).toHaveCount(3);
  expect(await visibleCards.nth(1).getAttribute('href')).toMatch(/\/en\/work\//);
});

test('every selected-work card states its name without a hover', async ({ page }) => {
  await page.goto('/en');
  const card = page.locator('#work .case-card').first();
  await card.scrollIntoViewIfNeeded();
  // The tile-and-caption version hid this behind a hover a phone never gets.
  await expect(card.locator('.case-card__title')).toBeVisible();
  await expect(card.locator('.case-card__text')).toBeVisible();
});

test('case study exposes its chapter rail', async ({ page }) => {
  await page.goto('/en/work/sendy');
  const rail = page.locator('.chapter-rail');
  await expect(rail).toBeVisible();
  expect(await rail.getByRole('link').count()).toBeGreaterThanOrEqual(6);
});

test('the archive carousel can be driven by its dots', async ({ page }) => {
  await page.goto('/en');
  const dots = page.locator('#archive [role="tab"]');
  await dots.first().scrollIntoViewIfNeeded();
  await expect(dots).toHaveCount(5);

  await dots.nth(2).tap();
  await expect(dots.nth(2)).toHaveAttribute('aria-selected', 'true');
});

test('the case-study rows stack and keep their links', async ({ page }) => {
  await page.goto('/en');
  const rows = page.locator('.case-row');
  await expect(rows).toHaveCount(3);
  await rows.first().scrollIntoViewIfNeeded();
  expect(await rows.first().getByRole('link').getAttribute('href')).toMatch(/\/en\/work\//);
});
