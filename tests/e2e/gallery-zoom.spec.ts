import { test, expect, type Page } from '@playwright/test';

/**
 * Gallery zoom-out reveal — `assets/gallery-zoom-reveal.md`.
 *
 * The effect is scroll-linked, so every assertion here drives the scroll
 * position to a measured point and reads the state back out. Nothing waits on a
 * duration, because the effect has none.
 */

const SLOT = '.gallery__item--featured';
const INNER = `${SLOT} .zoom__inner`;

/**
 * Put the featured slot's centre at `fraction` of the viewport height and let
 * the rAF-throttled painter run.
 *
 * `scroll-behavior: smooth` is set globally, so the jump has to opt out of it —
 * otherwise the assertion races an animation.
 */
async function scrollSlotCentreTo(page: Page, fraction: number) {
  await page.evaluate((f) => {
    const slot = document.querySelector('.gallery__item--featured');
    if (!slot) throw new Error('featured gallery slot is missing');
    const rect = slot.getBoundingClientRect();
    const centre = rect.top + rect.height / 2;
    window.scrollTo({ top: window.scrollY + centre - window.innerHeight * f, behavior: 'instant' });
  }, fraction);

  await page.evaluate(
    () =>
      new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

/**
 * The rendered state, read off the computed transform and filter rather than off
 * the custom properties — once the card lands, the script removes those and
 * hands the element back to the stylesheet's identity defaults.
 *
 * `blur` is what was handed to `filter`; `perceived` is what is actually seen.
 * They differ because the filter is applied in the element's own coordinate
 * space and the transform then magnifies the result, so only `perceived` is
 * meaningful to assert a look against.
 */
async function zoomState(page: Page) {
  return page.locator(INNER).evaluate((node) => {
    const styles = getComputedStyle(node);
    const matrix = new DOMMatrixReadOnly(styles.transform === 'none' ? '' : styles.transform);
    const blur = /blur\(([\d.]+)px\)/.exec(styles.filter);
    const applied = blur ? Number.parseFloat(blur[1]!) : 0;
    return {
      scale: matrix.a,
      blur: applied,
      perceived: applied * matrix.a,
      width: node.getBoundingClientRect().width,
      active: (node.parentElement as HTMLElement).hasAttribute('data-zoom-active'),
    };
  });
}

test.beforeEach(async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');
});

/**
 * The runaway lift — spec §"The runaway lift".
 *
 * A lift derived from the live slot position runs away, because `progress`
 * clamps at 0 but the slot's distance below the fold does not: with the gallery
 * 2000px down it evaluates to about -1550px and the oversized, blurred card is
 * drawn over the hero and through the nav at scroll position zero.
 *
 * The suite had a hole exactly here — 91 tests passed with the bug live,
 * because nothing asserted what is *painted* at the top of the page. Hit-testing
 * across the top of the viewport is what closes it. A z-index change would make
 * this pass while leaving the bug in place, so the assertion is deliberately
 * about the card's position, not its stacking.
 */
for (const width of [1440, 1024, 768, 390]) {
  for (const locale of ['en', 'ar'] as const) {
    test(`nothing from the zoom is painted at the top of /${locale} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await page.waitForLoadState('networkidle');

      expect(await page.evaluate(() => window.scrollY), 'the page is not at the top').toBe(0);

      const hits = await page.evaluate(() => {
        const zoom = document.querySelector('.gallery__item--featured');
        if (!zoom) throw new Error('featured gallery slot is missing');

        const found: string[] = [];
        for (const fraction of [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95]) {
          for (const y of [100, 200, 400]) {
            const x = Math.round(window.innerWidth * fraction);
            const element = document.elementFromPoint(x, y);
            // `contains` is true for the element itself as well as any child.
            if (element && zoom.contains(element)) {
              found.push(`(${x}, ${y}) hit ${element.tagName.toLowerCase()}`);
            }
          }
        }
        return found;
      });

      expect(hits, 'the zoom card is being painted at the top of the page').toEqual([]);
    });
  }
}

/**
 * The bound itself, asserted as arithmetic rather than as a symptom.
 *
 * The lift may only be derived from viewport and slot height, and the drift only
 * from viewport width — so neither offset may exceed its ceiling at any scroll
 * position, however far down the page the gallery sits. This is the assertion
 * that fails immediately if a future edit reintroduces a position-derived
 * offset, without waiting for it to become visible at some particular width.
 */
test('neither offset can run away, at any scroll position', async ({ page }) => {
  const height = await page.evaluate(() => document.body.scrollHeight);

  for (const fraction of [0, 0.1, 0.25, 0.5, 0.75, 1]) {
    await page.evaluate((y) => window.scrollTo({ top: y, behavior: 'instant' }), height * fraction);
    await page.evaluate(
      () => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))),
    );

    const reading = await page.locator(SLOT).evaluate((slot) => {
      const inner = slot.querySelector('.zoom__inner');
      if (!inner) throw new Error('the featured tile has no inner element');
      const styles = getComputedStyle(inner);
      const px = (name: string) => Number.parseFloat(styles.getPropertyValue(name)) || 0;
      return {
        dx: px('--zoom-dx'),
        dy: px('--zoom-dy'),
        limitX: window.innerWidth / 2,
        limitY: (window.innerHeight + slot.getBoundingClientRect().height) / 2,
      };
    });

    expect(Math.abs(reading.dx), `drift ran away at ${fraction} of the page`).toBeLessThanOrEqual(
      reading.limitX + 1,
    );
    expect(Math.abs(reading.dy), `lift ran away at ${fraction} of the page`).toBeLessThanOrEqual(
      reading.limitY + 1,
    );
  }
});

test('exactly one tile zooms', async ({ page }) => {
  // Two of these fight for z-index and read as a glitch.
  await expect(page.locator(SLOT)).toHaveCount(1);
});

/**
 * The zoom's cell must not distort the tracks it sits in.
 *
 * `.gallery__item--featured` carries `overflow: visible` so the oversized card
 * can escape, and that is exactly what un-does the automatic minimum size: a
 * grid item that is not a scroll container resolves `min-width: auto` to its
 * min-content width, and the tile's `aspect-ratio` transfers that minimum from
 * its content *height*, which is far wider than a column.
 *
 * This is not hypothetical and it is not the animation — at scroll zero, before
 * anything moves, every two-column width resolved to a single fat track and a
 * sliver: `107px 855px` at 1080, `101px 805px` at 1024, `74px 595px` at 768.
 * The three-column widths were always equal, which is why it survived the
 * desktop screenshots.
 *
 * Asserted at both column counts, since only one of them was ever broken.
 */
for (const [width, columns] of [
  [1440, 3],
  [1280, 3],
  [1080, 2],
  [1024, 2],
  [768, 2],
] as const) {
  test(`the featured cell does not distort the ${columns} column tracks at ${width}px`, async ({
    page,
  }) => {
    await page.setViewportSize({ width, height: 900 });

    const tracks = await page
      .locator('.gallery')
      .evaluate((node) =>
        getComputedStyle(node)
          .gridTemplateColumns.split(' ')
          .map((track) => Number.parseFloat(track)),
      );

    expect(tracks, `${width}px did not resolve to ${columns} columns`).toHaveLength(columns);
    // Sub-pixel only: the container width rarely divides evenly and the browser
    // distributes the remainder. Anything past that is a blowout.
    expect(
      Math.max(...tracks) - Math.min(...tracks),
      `${width}px columns are unequal: ${tracks.join(' ')}`,
    ).toBeLessThan(1);
  });
}

test('it enters oversized and blurred, then lands sharp in its cell', async ({ page }) => {
  // Slot centre at the bottom edge: the start of the transition.
  await scrollSlotCentreTo(page, 1);
  const entering = await zoomState(page);
  expect(entering.scale, 'the card did not enter oversized').toBeGreaterThan(1.5);
  expect(entering.perceived, 'the card did not enter blurred').toBeCloseTo(8, 0);
  expect(entering.active, 'the zoom did not report itself as running').toBe(true);

  // Slot centre at the viewport middle: landed.
  await scrollSlotCentreTo(page, 0.5);
  const landed = await zoomState(page);
  expect(landed.scale, 'the card did not land at its natural size').toBeCloseTo(1, 2);
  expect(landed.blur, 'the card did not land sharp').toBeCloseTo(0, 2);
  expect(landed.active, 'the zoom is still reported as running').toBe(false);
});

test('scrolling back up reverses it', async ({ page }) => {
  await scrollSlotCentreTo(page, 0.5);
  expect((await zoomState(page)).scale).toBeCloseTo(1, 2);

  await scrollSlotCentreTo(page, 1);
  expect((await zoomState(page)).scale, 'the effect did not reverse').toBeGreaterThan(1.5);
});

test('the grid does not reflow as the card scales', async ({ page }) => {
  const slotWidth = async () =>
    page.locator(SLOT).evaluate((node) => node.getBoundingClientRect().width);

  await scrollSlotCentreTo(page, 1);
  const during = await slotWidth();

  await scrollSlotCentreTo(page, 0.5);
  const after = await slotWidth();

  // The wrapper reserves the cell at natural size; only the inner transforms.
  expect(during, 'the layout slot moved with the transform').toBeCloseTo(after, 1);
});

test('the hover caption never appears mid-zoom', async ({ page }) => {
  await scrollSlotCentreTo(page, 1);
  await page.mouse.move(page.viewportSize()!.width / 2, page.viewportSize()!.height / 2);

  const caption = page.locator(`${SLOT} .gallery__cap`);
  await expect(caption, 'a half-zoomed card was captioned').toHaveCSS('opacity', '0');

  // ...and it works again once the card has landed.
  await scrollSlotCentreTo(page, 0.5);
  await page.locator(`${SLOT} .gallery__link`).hover();
  await expect(caption).toHaveCSS('opacity', '1');
});

/**
 * Where the grid re-flows to two and three columns the featured cell is off to
 * one side, so the card has to drift horizontally as well as vertically to reach
 * the centre — otherwise it is drawn half outside the viewport.
 *
 * This is also the assertion that caught `min-width: auto` returning when the
 * cell was given `overflow: visible`: the column blew out to the card's
 * min-content width and the two-column grid resolved to `100px 805px`.
 */
test('the oversized card stays inside the viewport at desktop widths', async ({ page }) => {
  for (const width of [1440, 1024, 768]) {
    await page.setViewportSize({ width, height: 900 });

    for (const fraction of [1, 0.85, 0.7, 0.5]) {
      await scrollSlotCentreTo(page, fraction);
      const box = await page.locator(INNER).evaluate((node) => {
        const rect = node.getBoundingClientRect();
        return { left: rect.left, right: rect.right, client: document.documentElement.clientWidth };
      });

      expect(box.left, `${width}px overflowed left at ${fraction}`).toBeGreaterThan(-1);
      expect(box.right, `${width}px overflowed right at ${fraction}`).toBeLessThan(box.client + 1);
    }
  }
});

/**
 * A phone tile is already viewport-wide, so the spec's narrow-viewport scale of
 * 1.4 can only bleed off both edges — that is the intended look, not a bug. What
 * must not happen is a horizontal scrollbar, which is why the bleed has to stay
 * centred and the viewport has to clip it.
 */
test('a narrow viewport bleeds symmetrically and cannot scroll sideways', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 900 });
  await scrollSlotCentreTo(page, 1);

  const box = await page.locator(INNER).evaluate((node) => {
    const rect = node.getBoundingClientRect();
    return {
      left: rect.left,
      right: rect.right,
      client: document.documentElement.clientWidth,
      clipped: getComputedStyle(document.body).overflowX,
    };
  });

  expect(box.clipped, 'nothing is clipping the bleed').toBe('hidden');
  expect(box.left, 'the bleed is not centred').toBeCloseTo(box.client - box.right, 0);
});

/**
 * `paint()` runs once at init rather than waiting for a scroll event, so a deep
 * link or a reload part-way down the gallery renders the state its position
 * calls for. Asserted at the top of a fresh page, where no scroll event has
 * fired at all: the tile is far below the fold, so it must already be drawn at
 * full size and full blur.
 */
test('the first paint happens without a scroll event', async ({ page }) => {
  expect(await page.evaluate(() => window.scrollY)).toBe(0);

  const state = await zoomState(page);
  expect(state.scale, 'the card was not painted before the first scroll').toBeCloseTo(2, 1);
  expect(state.perceived).toBeCloseTo(8, 0);
});

/**
 * The scale cap is derived from the viewport, not fixed — spec §"Tuning".
 *
 * A fixed multiplier draws a card whose width depends on whatever the grid cell
 * happens to measure: `2.0` came from the reference's 400px cell, and on a wider
 * cell it blankets the grid. The cap is therefore `viewportW * 0.62 / cellW`,
 * bounded by the ceiling, so the drawn width tracks the screen instead.
 *
 * Asserted as the drawn width rather than as the multiplier, because the width
 * is the thing that was wrong and the multiplier is only how it is reached.
 */
test('the drawn width is capped against the viewport, not the cell', async ({ page }) => {
  for (const width of [1440, 1024]) {
    await page.setViewportSize({ width, height: 900 });
    await scrollSlotCentreTo(page, 1);

    const { drawn, cell } = await page.locator(SLOT).evaluate((slot) => ({
      drawn: slot.querySelector('.zoom__inner')!.getBoundingClientRect().width,
      cell: slot.getBoundingClientRect().width,
    }));

    // The ceiling still binds where 0.62 of the viewport would need more than 2×.
    const cap = Math.min(2, (width * 0.62) / cell);
    expect(drawn, `${width}px drew the card at the wrong width`).toBeCloseTo(cell * cap, 0);
    expect(drawn, `${width}px drew a card wider than the cap`).toBeLessThanOrEqual(width * 0.62 + 1);
  }
});

/**
 * ...and recomputed on resize rather than cached at init.
 *
 * A cap read once at mount keeps drawing the card at the width the *first*
 * viewport called for. This drives the resize directly instead of reloading, so
 * a cached cap is the only thing that can fail it: it starts at 1440, where the
 * ceiling binds at 2×, and resizes to 1024, where 0.62 of the viewport binds
 * first — the two disagree, so a stale cap is visible as a too-wide card.
 */
test('the cap is recomputed on resize', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await scrollSlotCentreTo(page, 1);
  const wide = await zoomState(page);

  await page.setViewportSize({ width: 1024, height: 900 });
  await scrollSlotCentreTo(page, 1);
  const narrow = await zoomState(page);

  expect(narrow.width, 'the card kept 1440’s width after resizing to 1024').toBeLessThan(
    wide.width,
  );
  expect(narrow.width, 'the resized card is wider than the cap allows').toBeLessThanOrEqual(
    1024 * 0.62 + 1,
  );
});
