import { test, expect } from '@playwright/test';

/**
 * Runs under the `mobile` project (iPhone 14 Pro, touch, coarse pointer).
 *
 * The nav pill deliberately drops its links below 760px and keeps only the
 * identity and the CTA — that is the system's mobile rule, not an omission. The
 * routes stay reachable through the footer, which these tests assert.
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

test('gallery captions are visible without hover on touch', async ({ page }) => {
  await page.goto('/en');
  const caption = page.locator('.gallery__cap').first();
  await caption.scrollIntoViewIfNeeded();
  // `@media (hover: none)` pins them open; a hover-only caption would be lost.
  expect(await caption.evaluate((node) => getComputedStyle(node).opacity)).toBe('1');
});

test('case study exposes its chapter rail', async ({ page }) => {
  await page.goto('/en/work/sendy');
  const rail = page.locator('.chapter-rail');
  await expect(rail).toBeVisible();
  expect(await rail.getByRole('link').count()).toBeGreaterThanOrEqual(6);
});

test('the carousel can be driven by its dots', async ({ page }) => {
  await page.goto('/en');
  const dots = page.getByRole('tab');
  await dots.first().scrollIntoViewIfNeeded();
  await expect(dots).toHaveCount(3);

  await dots.nth(2).tap();
  await expect(dots.nth(2)).toHaveAttribute('aria-selected', 'true');
});
