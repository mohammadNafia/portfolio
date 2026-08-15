import { test, expect } from '@playwright/test';

/**
 * Reduced motion is a designed alternative, not a switch-off. The failure mode
 * that matters is content that never becomes visible because an entrance never
 * ran — so these tests assert the page is fully readable, not that nothing moved.
 *
 * Each test emulates the media query itself and asserts the emulation took
 * effect. Playwright's context-level `reducedMotion` option silently did not
 * reach `matchMedia` in this browser build, which had made an earlier version of
 * this suite pass while testing normal motion.
 */
test.beforeEach(async ({ page }) => {
  await page.emulateMedia({ reducedMotion: 'reduce' });
});

test('the media query is actually active', async ({ page }) => {
  await page.goto('/en');
  const reduced = await page.evaluate(
    () => window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  expect(reduced, 'reduced-motion emulation is not reaching the page').toBe(true);
});

test('homepage content is fully visible', async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');

  const headings = page.locator('main h2');
  const count = await headings.count();
  expect(count).toBeGreaterThan(4);

  for (let i = 0; i < count; i += 1) {
    const heading = headings.nth(i);
    await heading.scrollIntoViewIfNeeded();

    // Any ancestor still holding a hidden reveal state would hide this heading.
    await expect
      .poll(
        () =>
          heading.evaluate((node) => {
            let element: HTMLElement | null = node as HTMLElement;
            let min = 1;
            while (element && element !== document.body) {
              min = Math.min(min, Number.parseFloat(getComputedStyle(element).opacity));
              element = element.parentElement;
            }
            return min;
          }),
        { message: `heading ${i} stayed hidden under reduced motion`, timeout: 5000 },
      )
      .toBeGreaterThan(0.95);
  }
});

test('the hero fan lands settled, with no stagger and no float', async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');

  const slots = page.locator('.hero-fan__slot');
  await expect(slots).toHaveCount(7);

  // Every card is already at full opacity — no animation-delay ladder.
  for (let i = 0; i < 7; i += 1) {
    const state = await slots.nth(i).evaluate((node) => {
      const styles = getComputedStyle(node);
      return { opacity: styles.opacity, animation: styles.animationName };
    });
    expect(Number.parseFloat(state.opacity), `card ${i} is not visible`).toBeGreaterThan(0.95);
    expect(state.animation, `card ${i} is still animating`).toBe('none');
  }
});

test('the featured gallery tile renders sharp, at its natural size', async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');

  const slot = page.locator('.gallery__item--featured');
  await slot.scrollIntoViewIfNeeded();

  const state = await slot.evaluate((node) => {
    const inner = node.querySelector('.zoom__inner');
    if (!inner) throw new Error('the featured tile has no inner element');
    const styles = getComputedStyle(inner);
    return {
      transform: styles.transform,
      filter: styles.filter,
      active: node.hasAttribute('data-zoom-active'),
    };
  });

  expect(state.transform, 'the tile is still being scaled').toBe('none');
  expect(state.filter, 'the tile is still being blurred').toBe('none');
  // The gate is lifted too, so the tile is clickable and captions on hover.
  expect(state.active, 'the zoom is still gating hover and clicks').toBe(false);
});

test('case study is fully readable', async ({ page }) => {
  await page.goto('/en/work/sendy');
  await expect(page.locator('h1')).toBeVisible();

  const chapters = page.locator('main section[id]');
  const count = await chapters.count();
  expect(count).toBeGreaterThanOrEqual(6);

  for (let i = 0; i < count; i += 1) {
    const chapter = chapters.nth(i);
    await chapter.scrollIntoViewIfNeeded();
    await expect(chapter.locator('h2').first()).toBeVisible();
  }
});

test('navigation and locale switching still work', async ({ page }) => {
  await page.goto('/en');
  await page.locator('footer').getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/work$/);

  await page.getByRole('link', { name: /التبديل إلى العربية/ }).click();
  await expect(page).toHaveURL(/\/ar\/work$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('the marquee is not looping', async ({ page }) => {
  await page.goto('/en');
  const track = page.locator('.marquee__track').first();
  await track.scrollIntoViewIfNeeded();
  const duration = await track.evaluate((node) => getComputedStyle(node).animationDuration);
  // The global reduced-motion rule collapses every animation to ~0ms.
  expect(Number.parseFloat(duration)).toBeLessThan(0.05);
});
