import { test, expect, type Page } from '@playwright/test';

/**
 * Settling-weight entrance — `src/components/home/SettleGrid.tsx`.
 *
 * The effect this replaced was fixed four times and broke a new way each time,
 * so these assertions are deliberately about the STRUCTURE rather than about
 * the look: that both magnitudes are bounded, that no cell can leave its own
 * layout slot, and that the grid tracks are unaffected. Those are the three
 * properties every previous failure violated, and they hold independently of
 * whatever the constants are tuned to later.
 *
 * Nothing here waits on a duration. The effect is scroll-linked and has none.
 */

const GRID = '.gallery--work';
const CELL = `${GRID} .gallery__item`;
const INNER = `${GRID} .settle__inner`;

/** The component's own constants. Asserted as bounds, never as expected values. */
const LIFT = 8;
const SCALE_FROM = 0.985;

async function nudge(page: Page, fraction: number) {
  await page.evaluate((f) => {
    window.scrollTo({ top: document.body.scrollHeight * f, behavior: 'instant' });
  }, fraction);
  await page.evaluate(
    () => new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve))),
  );
}

test.beforeEach(async ({ page }) => {
  await page.goto('/en');
  await page.waitForLoadState('networkidle');
});

/**
 * The bound itself, as arithmetic rather than as a symptom.
 *
 * This is the assertion that fails the moment anyone reintroduces a magnitude
 * derived from a live position — without waiting for it to become visible at
 * some particular width, which is how the last one survived 91 passing tests.
 */
test('neither magnitude can run away, at any scroll position', async ({ page }) => {
  for (const fraction of [0, 0.1, 0.25, 0.4, 0.5, 0.75, 1]) {
    await nudge(page, fraction);

    const readings = await page.locator(INNER).evaluateAll((nodes) =>
      nodes.map((node) => {
        const styles = getComputedStyle(node);
        const matrix = new DOMMatrixReadOnly(
          styles.transform === 'none' ? '' : styles.transform,
        );
        return { y: matrix.f, scale: matrix.a };
      }),
    );

    expect(readings.length, 'no cells were measured — the test is vacuous').toBe(4);

    for (const [index, reading] of readings.entries()) {
      expect(
        reading.y,
        `cell ${index} lifted past its bound at ${fraction} of the page`,
      ).toBeGreaterThanOrEqual(-0.5);
      expect(reading.y, `cell ${index} ran away at ${fraction} of the page`).toBeLessThanOrEqual(
        LIFT + 0.5,
      );
      // Inward only, and never past the floor.
      expect(reading.scale, `cell ${index} scaled up at ${fraction}`).toBeLessThanOrEqual(1.001);
      expect(
        reading.scale,
        `cell ${index} shrank past its bound at ${fraction}`,
      ).toBeGreaterThanOrEqual(SCALE_FROM - 0.001);
    }
  }
});

/**
 * Nothing may leave its own cell — the property that makes every overflow
 * rule, z-index and isolation hack unnecessary.
 *
 * Checked against each cell's OWN layout box rather than against the viewport,
 * because "inside the viewport" was true of the old effect at some widths and
 * still let it blanket the grid.
 */
test('no cell is ever drawn outside its own layout slot', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });

    for (const fraction of [0.1, 0.2, 0.3, 0.4, 0.5]) {
      await nudge(page, fraction);

      const boxes = await page.locator(CELL).evaluateAll((cells) =>
        cells.map((cell) => {
          const slot = cell.getBoundingClientRect();
          const drawn = cell.querySelector('.settle__inner')!.getBoundingClientRect();
          return {
            overLeft: slot.left - drawn.left,
            overRight: drawn.right - slot.right,
            overTop: slot.top - drawn.top,
            overBottom: drawn.bottom - slot.bottom,
          };
        }),
      );

      for (const [index, box] of boxes.entries()) {
        const where = `cell ${index} at ${width}px, ${fraction} down`;
        // Scale is inward, so the drawn box is never wider than its slot.
        expect(box.overLeft, `${where} escaped left`).toBeLessThanOrEqual(0.5);
        expect(box.overRight, `${where} escaped right`).toBeLessThanOrEqual(0.5);
        expect(box.overTop, `${where} escaped upward`).toBeLessThanOrEqual(0.5);
        // Downward is the only direction with any travel, and it is the lift.
        expect(box.overBottom, `${where} escaped below its slot`).toBeLessThanOrEqual(LIFT + 0.5);
      }
    }
  }
});

/**
 * The grid tracks are measured off the cells, and the cells never transform —
 * only the element inside them does. This is the assertion that caught the last
 * effect resolving a two-column grid to `107px 855px`.
 */
for (const width of [1440, 1280, 1080, 1024, 768]) {
  test(`the settle does not distort the grid tracks at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    await nudge(page, 0.25);

    const tracks = await page
      .locator(GRID)
      .evaluate((node) =>
        getComputedStyle(node)
          .gridTemplateColumns.split(' ')
          .map((track) => Number.parseFloat(track)),
      );

    expect(tracks, `${width}px did not resolve to 2 columns`).toHaveLength(2);
    expect(
      Math.max(...tracks) - Math.min(...tracks),
      `${width}px columns are unequal: ${tracks.join(' ')}`,
    ).toBeLessThan(1);
  });
}

/**
 * The page must not scroll sideways, at any width, at any scroll position.
 *
 * The previous effect needed `overflow-x: clip` on the section to hold this;
 * this one holds it because nothing is drawn outside a cell in the first place.
 * Asserted without any clipping rule in place to catch it.
 */
test('the page never scrolls sideways while the grid settles', async ({ page }) => {
  for (const width of [1440, 1024, 768, 390]) {
    await page.setViewportSize({ width, height: 900 });

    for (const fraction of [0.1, 0.2, 0.3, 0.5]) {
      await nudge(page, fraction);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      );
      expect(overflow, `${width}px scrolled sideways at ${fraction} down`).toBeLessThanOrEqual(0);
    }
  }
});

/**
 * Nothing from the grid is painted at the top of the page.
 *
 * The direct descendant of the failure this replaced: a lift derived from the
 * slot's distance below the fold drew the card over the hero at scroll zero,
 * and the whole suite passed because nothing asserted what is *painted* up
 * there. Hit-testing across the top of the viewport is what closes it, and it
 * is deliberately about position rather than stacking — a z-index change would
 * make this pass while leaving the bug in place.
 */
for (const width of [1440, 1024, 768, 390]) {
  for (const locale of ['en', 'ar'] as const) {
    test(`nothing from the grid is painted at the top of /${locale} at ${width}px`, async ({
      page,
    }) => {
      await page.setViewportSize({ width, height: 900 });
      await page.goto(`/${locale}`);
      await page.waitForLoadState('networkidle');

      expect(await page.evaluate(() => window.scrollY), 'the page is not at the top').toBe(0);

      const hits = await page.evaluate(() => {
        const grid = document.querySelector('.gallery--work');
        if (!grid) throw new Error('the selected-work grid is missing');

        const found: string[] = [];
        for (const fraction of [0.05, 0.2, 0.35, 0.5, 0.65, 0.8, 0.95]) {
          for (const y of [100, 200, 400]) {
            const x = Math.round(window.innerWidth * fraction);
            const element = document.elementFromPoint(x, y);
            if (element && grid.contains(element)) {
              found.push(`(${x}, ${y}) hit ${element.tagName.toLowerCase()}`);
            }
          }
        }
        return found;
      });

      expect(hits, 'the grid is being painted at the top of the page').toEqual([]);
    });
  }
}

test('it reverses exactly on the way back up', async ({ page }) => {
  const read = () =>
    page
      .locator(INNER)
      .first()
      .evaluate((node) => {
        const matrix = new DOMMatrixReadOnly(
          getComputedStyle(node).transform === 'none' ? '' : getComputedStyle(node).transform,
        );
        return { y: matrix.f, scale: matrix.a };
      });

  await nudge(page, 0.06);
  const entering = await read();

  await nudge(page, 0.4);
  const landed = await read();
  expect(landed.y, 'the cell did not land at its resting position').toBeCloseTo(0, 1);
  expect(landed.scale, 'the cell did not land at its natural size').toBeCloseTo(1, 2);

  await nudge(page, 0.06);
  const again = await read();
  expect(again.y, 'the effect did not reverse').toBeCloseTo(entering.y, 1);
  expect(again.scale, 'the effect did not reverse').toBeCloseTo(entering.scale, 3);
});

/**
 * Landed means handed back to the stylesheet — no residual composited layer on
 * a grid that has finished moving.
 *
 * This is also the regression test for the visibility gate that used to wrap
 * the paint loop. `nudge` jumps straight from the top of the page to well past
 * the grid, which is the one transition an IntersectionObserver never reports —
 * not intersecting before, not intersecting after, no change to fire on. With
 * the gate in place the cells stayed frozen mid-move with four `will-change`
 * layers open, and were still that way five seconds later.
 */
test('it settles rather than holding a layer forever', async ({ page }) => {
  await nudge(page, 0.4);

  await expect
    .poll(
      () =>
        page.locator(GRID).evaluate((grid) => ({
          settling: grid.hasAttribute('data-settling'),
          willChange: getComputedStyle(grid.querySelector('.settle__inner')!).willChange,
        })),
      { message: 'the grid never released its composited layers', timeout: 5000 },
    )
    .toEqual({ settling: false, willChange: 'auto' });
});

test('every card stays clickable throughout', async ({ page }) => {
  for (const fraction of [0.1, 0.2, 0.3, 0.4]) {
    await nudge(page, fraction);
    const gated = await page
      .locator(`${INNER} a`)
      .evaluateAll((nodes) =>
        nodes.filter((node) => getComputedStyle(node).pointerEvents === 'none').length,
      );
    expect(gated, `a card was unclickable at ${fraction} down`).toBe(0);
  }
});
