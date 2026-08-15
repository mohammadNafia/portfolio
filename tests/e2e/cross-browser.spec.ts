import { test, expect } from '@playwright/test';

/** WCAG relative luminance + contrast ratio, from computed `rgb()` strings. */
function contrastRatio(a: string, b: string): number {
  const parse = (value: string) =>
    (value.match(/\d+(\.\d+)?/g) ?? []).slice(0, 3).map(Number) as [number, number, number];
  const luminance = (rgb: [number, number, number]) => {
    const [r, g, bl] = rgb.map((channel) => {
      const c = channel / 255;
      return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
    }) as [number, number, number];
    return 0.2126 * r + 0.7152 * g + 0.0722 * bl;
  };
  const l1 = luminance(parse(a));
  const l2 = luminance(parse(b));
  return (Math.max(l1, l2) + 0.05) / (Math.min(l1, l2) + 0.05);
}

/**
 * Cross-browser smoke suite — runs under Firefox and WebKit.
 *
 * Deliberately narrow: it checks that the layout system, bidirectional text,
 * fonts and the core navigation/contact flows behave, rather than duplicating
 * the whole Chromium matrix in three browsers.
 */

for (const locale of ['en', 'ar'] as const) {
  test(`${locale} homepage renders with correct direction and no overflow`, async ({ page }) => {
    await page.goto(`/${locale}`);

    await expect(page.locator('html')).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
    await expect(page.locator('h1')).toBeVisible();

    // The hero arc springs into place on mount; measure once it has settled.
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(400);

    const overflow = await page.evaluate(
      () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
    );
    expect(overflow, `horizontal overflow of ${overflow}px`).toBeLessThanOrEqual(1);
  });
}

test('primary button keeps readable contrast', async ({ page }) => {
  await page.goto('/en');
  const button = page.getByRole('link', { name: /Work with Me/i }).first();
  const { color, background } = await button.evaluate((node) => {
    const styles = getComputedStyle(node);
    return { color: styles.color, background: styles.backgroundColor };
  });
  expect(color).not.toBe(background);
  expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(4.5);
});

test('Arabic display type uses its own leading, not the Latin metric', async ({ page }) => {
  await page.goto('/ar');
  const ratio = await page.locator('h1').evaluate((node) => {
    const styles = getComputedStyle(node);
    return Number.parseFloat(styles.lineHeight) / Number.parseFloat(styles.fontSize);
  });
  // Latin pixel-title leading is 1.05; Arabic must be looser or diacritics collide.
  expect(ratio).toBeGreaterThan(1.25);
});

/*
 * Handjet ships an Arabic and the pixel identity was meant to carry across both
 * scripts, but it failed QA on device: disconnected letterforms, overlapping
 * glyphs and a detached hamza, reproducing identically at 46px and 57.6px —
 * far above Handjet's documented 26px floor, so raising the size fixes nothing.
 * design-tokens.md records the failure; this keeps it from being undone
 * silently, since the breakage is only visible to someone who reads Arabic.
 *
 * Latin must keep Handjet: the swap is per-script, not a retreat from the
 * pixel identity.
 */
test('Arabic display headings do not use Handjet', async ({ page }) => {
  await page.goto('/ar');

  const families = await page
    .locator('.pixel-title')
    .evaluateAll((nodes) =>
      nodes.map((node) => ({
        family: getComputedStyle(node).fontFamily,
        text: (node.textContent ?? '').trim(),
      })),
    );

  expect(families.length).toBeGreaterThan(0);

  for (const { family, text } of families) {
    /* Latin digits keep the pixel face — Handjet renders numerals correctly,
     * and the swap is about joined script. See `.pixel-num`. */
    if (/^\d+$/.test(text)) continue;

    expect(family, `"${text}" fell back to Handjet, which cannot shape Arabic`).not.toMatch(
      /Handjet/i,
    );
    expect(family, `"${text}" is not using the approved Arabic display face`).toMatch(/Plex/i);
  }
});

test('Latin display headings still use Handjet', async ({ page }) => {
  await page.goto('/en');
  const family = await page
    .locator('.pixel-title')
    .first()
    .evaluate((node) => getComputedStyle(node).fontFamily);
  expect(family, 'the Arabic fallback leaked into Latin').toMatch(/Handjet/i);
});

test('navigation and locale switching work', async ({ page }) => {
  await page.goto('/en');
  await page.locator('footer').getByRole('link', { name: 'Work', exact: true }).click();
  await expect(page).toHaveURL(/\/en\/work$/);

  await page.getByRole('link', { name: /التبديل إلى العربية/ }).click();
  await expect(page).toHaveURL(/\/ar\/work$/);
  await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');
});

test('a case study renders all of its chapters', async ({ page }) => {
  await page.goto('/en/work/sendy');
  await expect(page.locator('h1')).toBeVisible();
  expect(await page.locator('main section[id]').count()).toBeGreaterThanOrEqual(6);
});

test('contact form validates without submitting', async ({ page }) => {
  await page.goto('/en/contact');
  await page.getByRole('button', { name: /Send me a message/i }).click();
  await expect(page.getByText('Please enter your name.')).toBeVisible();
});

test('404 returns a real 404 and keeps the shell', async ({ page }) => {
  const response = await page.goto('/en/no-such-route');
  expect(response?.status()).toBe(404);
  await expect(page.locator('header')).toBeVisible();
  await expect(page.locator('footer')).toBeVisible();
});
