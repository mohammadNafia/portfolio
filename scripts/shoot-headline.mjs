/**
 * Capture and measure the two-tier hero lockup in both locales, at the three
 * widths the headline has to survive: 390 (iPhone 14 Pro), 768 (tablet, the
 * branch above the 420px override) and 1440 (desktop, where both clamps cap).
 *
 *   node scripts/shoot-headline.mjs [baseUrl]
 *
 * The thing this is actually checking is line-box count. The previous headline
 * broke mid-token as "FULL-" / "STACK" on mobile, and a wrap like that is
 * invisible in a computed-style dump — you only see it by counting the rects a
 * Range reports for the span. Two rects on a line that should be one word means
 * the token split.
 *
 * Writes to docs/screenshots/headline/, which is git-ignored.
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';

const BASE = process.argv[2] ?? 'http://localhost:3210';
const OUT = 'docs/screenshots/headline';

const WIDTHS = [390, 768, 1440];
const LOCALES = ['en', 'ar'];

await mkdir(OUT, { recursive: true });

const browser = await chromium.launch();
let failures = 0;

for (const locale of LOCALES) {
  for (const width of WIDTHS) {
    const context = await browser.newContext({
      viewport: { width, height: 900 },
      deviceScaleFactor: 2,
    });
    const page = await context.newPage();

    await page.goto(`${BASE}/${locale}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => document.fonts.ready);
    /* The hero rises in over 700ms; settle before measuring or capturing. */
    await page.waitForTimeout(1200);

    const title = page.locator('.hero__title').first();
    const report = await title.evaluate((h1) => {
      const shell = h1.closest('.shell');
      const shellBox = shell.getBoundingClientRect();

      const read = (sel) => {
        const el = h1.querySelector(sel);
        const c = getComputedStyle(el);
        /* Range rects = one per line box, so >1 means this line wrapped. */
        const range = document.createRange();
        range.selectNodeContents(el);
        const rects = [...range.getClientRects()];
        const box = el.getBoundingClientRect();
        return {
          text: el.textContent,
          font: c.fontFamily.split(',')[0].replace(/['"]/g, ''),
          size: c.fontSize,
          tracking: c.letterSpacing,
          weight: c.fontWeight,
          lines: rects.length,
          width: +box.width.toFixed(1),
          /* +ve = ink sits right of the shell's centre, -ve = left of it. */
          offset: +(
            (box.left + box.right) / 2 -
            (shellBox.left + shellBox.right) / 2
          ).toFixed(1),
        };
      };

      return {
        shell: +shellBox.width.toFixed(1),
        line1: read('.hero__line1'),
        line2: read('.hero__line2'),
      };
    });

    const flag = (l) => (l.lines > 1 ? '  ** WRAPPED **' : '');
    if (report.line1.lines > 1 || report.line2.lines > 1) failures += 1;

    console.log(`\n  ${locale.toUpperCase()} @ ${width}px  (shell ${report.shell}px)`);
    for (const [name, l] of [
      ['line1', report.line1],
      ['line2', report.line2],
    ]) {
      console.log(
        `    ${name}  ${l.size.padStart(6)}  ${l.font.padEnd(22)} w${l.weight}  ` +
          `track ${l.tracking.padStart(8)}  ${String(l.width).padStart(6)}px  ` +
          `off ${String(l.offset).padStart(6)}  "${l.text}"${flag(l)}`,
      );
    }

    await title.screenshot({ path: `${OUT}/title-${locale}-${width}.png` });
    const box = await title.boundingBox();
    if (box) {
      await page.screenshot({
        path: `${OUT}/hero-${locale}-${width}.png`,
        clip: {
          x: 0,
          y: Math.max(0, box.y - 40),
          width,
          height: Math.min(420, box.height + 120),
        },
      });
    }

    await context.close();
  }
}

await browser.close();
console.log(
  failures ? `\n  ${failures} viewport(s) wrapped\n` : '\n  no wraps at any width\n',
);
