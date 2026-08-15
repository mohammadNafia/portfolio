/**
 * Capture the Arabic hero display line across the mobile range, on WebKit.
 *
 *   node scripts/shoot-arabic.mjs [baseUrl]
 *
 * WebKit specifically, not a Chromium viewport: Handjet's Arabic is grid-fitted
 * and the reported failure is joining and mark placement, which is decided by
 * the platform shaper. Chromium on Windows uses HarfBuzz via Skia; Safari on
 * iOS uses CoreText. A Chromium "mobile viewport" resizes the window and proves
 * nothing about either. Playwright's WebKit is the engine Safari ships.
 *
 * Writes to docs/screenshots/arabic-hero/, which is git-ignored.
 */
import { webkit, devices } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:3211';
const OUT = 'docs/screenshots/arabic-hero';

/* 390 and 430 are the iPhone 14 Pro / Pro Max logical widths; 768 is the
 * breakpoint above the 420px override, so it exercises the other branch. */
const WIDTHS = [390, 430, 768];

await mkdir(OUT, { recursive: true });

const browser = await webkit.launch();

for (const width of WIDTHS) {
  const context = await browser.newContext({
    ...devices['iPhone 14 Pro'],
    viewport: { width, height: 900 },
    deviceScaleFactor: 3,
  });
  const page = await context.newPage();

  await page.goto(`${BASE}/ar`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.fonts.ready);
  /* The hero animates in; settle before capturing. */
  await page.waitForTimeout(1200);

  const line2 = page.locator('.hero__line2').first();
  const box = await line2.boundingBox();
  const style = await line2.evaluate((el) => {
    const c = getComputedStyle(el);
    return {
      fontSize: c.fontSize,
      fontFamily: c.fontFamily.split(',')[0],
      fontWeight: c.fontWeight,
      lineHeight: c.lineHeight,
    };
  });
  const text = await line2.innerText();

  console.log(
    `  ${String(width).padStart(4)}px  ${style.fontSize.padStart(7)}  ` +
      `${style.fontFamily.padEnd(28)} w${style.fontWeight}  "${text.trim()}"`,
  );

  await line2.screenshot({ path: `${OUT}/line2-${width}.png` });
  if (box) {
    await page.screenshot({
      path: `${OUT}/hero-${width}.png`,
      clip: { x: 0, y: Math.max(0, box.y - 120), width, height: 420 },
    });
  }

  await context.close();
}

await browser.close();
console.log(`\n  wrote ${WIDTHS.length * 2} files to ${OUT}/\n`);
