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

/**
 * The selected-work grid has no exception in it any more.
 *
 * One tile used to carry a scroll-linked zoom, which meant a second reduced-
 * motion path to hold correct alongside the `.reveal` one. Now every cell is an
 * ordinary blur-up, so what has to be true is what is true of every other
 * section: nothing is transformed, nothing is blurred, and every card is
 * clickable from the first paint.
 */
test('every selected-work tile renders sharp, at its natural size', async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');

  const items = page.locator('.gallery--work .gallery__item');
  await expect(items).toHaveCount(4);

  for (let i = 0; i < 4; i += 1) {
    const item = items.nth(i);
    await item.scrollIntoViewIfNeeded();

    /*
     * Polled, not read once. Reduced motion collapses the reveal to ~200ms
     * rather than to nothing, and the observer that starts it fires after the
     * scroll — so a synchronous read here catches tile 0 at opacity 0 and
     * reports a working entrance as content that never appeared.
     */
    await expect
      .poll(() => item.evaluate((node) => Number.parseFloat(getComputedStyle(node).opacity)), {
        message: `tile ${i} never became visible`,
        timeout: 5000,
      })
      .toBeGreaterThan(0.95);

    const state = await item.evaluate((node) => {
      const styles = getComputedStyle(node);
      return {
        transform: styles.transform,
        filter: styles.filter,
        events: getComputedStyle(node.querySelector('a')!).pointerEvents,
      };
    });

    expect(state.transform, `tile ${i} is still being transformed`).toBe('none');
    expect(state.filter, `tile ${i} is still being blurred`).toBe('none');
    expect(state.events, `tile ${i} is not clickable`).not.toBe('none');
  }
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

test('the marquees are not looping', async ({ page }) => {
  await page.goto('/en');
  const tracks = page.locator('.marquee__track');
  // One per stack category.
  await expect(tracks).toHaveCount(4);

  const track = tracks.first();
  await track.scrollIntoViewIfNeeded();
  const duration = await track.evaluate((node) => getComputedStyle(node).animationDuration);
  // The global reduced-motion rule collapses every animation to ~0ms.
  expect(Number.parseFloat(duration)).toBeLessThan(0.05);
});
