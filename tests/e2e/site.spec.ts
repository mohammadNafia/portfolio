import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

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

const ROUTES = ['', '/work', '/about', '/services', '/contact', '/privacy'];
const CASE_STUDIES = ['sendy', 'immar', 'nano-ocr'];

/** Fail the test if the page logged an error or a hydration warning. */
function watchConsole(page: Page) {
  const errors: string[] = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(String(error)));
  return errors;
}

/**
 * Identity strings live in `src/lib/site.ts`, outside the typed dictionary, so
 * the compiler cannot enforce that the Arabic variant is the one rendered on an
 * Arabic page. The About page read `site.location` directly and printed
 * "Baghdad, Iraq" in Arabic — while the dictionary carried an unused
 * `common.baghdad` holding the correct string. Two sources of truth, and the
 * wrong one won.
 */
test.describe('non-dictionary strings are localised too', () => {
  for (const path of ['/ar/about', '/ar/contact']) {
    test(`${path} shows the Arabic location, not the Latin one`, async ({ page }) => {
      await page.goto(path);
      const main = page.locator('main');
      await expect(main).toContainText('بغداد');
      await expect(main).not.toContainText('Baghdad, Iraq');
    });
  }

  for (const path of ['/en/about', '/en/contact']) {
    test(`${path} shows the Latin location`, async ({ page }) => {
      await page.goto(path);
      await expect(page.locator('main')).toContainText('Baghdad, Iraq');
    });
  }
});

test.describe('locale routing', () => {
  test('redirects a locale-less URL into a locale', async ({ page }) => {
    await page.goto('/');
    await expect(page).toHaveURL(/\/(en|ar)$/);
  });

  test('redirects a locale-less deep link and preserves the path', async ({ page }) => {
    await page.goto('/work/sendy');
    await expect(page).toHaveURL(/\/(en|ar)\/work\/sendy$/);
  });

  for (const locale of ['en', 'ar'] as const) {
    test(`renders ${locale} homepage with correct lang and dir`, async ({ page }) => {
      const errors = watchConsole(page);
      await page.goto(`/${locale}`);

      const html = page.locator('html');
      await expect(html).toHaveAttribute('lang', locale);
      await expect(html).toHaveAttribute('dir', locale === 'ar' ? 'rtl' : 'ltr');
      await expect(page.locator('h1')).toBeVisible();

      expect(errors, `console errors on /${locale}`).toEqual([]);
    });
  }

  test('switches locale, preserves the route, and persists the choice', async ({ page }) => {
    await page.goto('/en/work/sendy');
    await page.waitForLoadState('networkidle');
    await page.getByRole('link', { name: /التبديل إلى العربية/ }).click();
    await expect(page).toHaveURL(/\/ar\/work\/sendy$/);
    await expect(page.locator('html')).toHaveAttribute('dir', 'rtl');

    // The preference must survive a locale-less visit.
    await page.goto('/');
    await expect(page).toHaveURL(/\/ar$/);
  });
});

test.describe('navigation', () => {
  test('reaches every primary route from the header', async ({ page }) => {
    // The nav pill's links are in-page anchors on the home page. The full routes
    // live in the footer, which is also how a phone reaches them — the pill drops
    // its links below 760px by design.
    for (const [label, path] of [
      ['Work', '/en/work'],
      ['About', '/en/about'],
      ['Services', '/en/services'],
      ['Contact', '/en/contact'],
    ] as const) {
      await page.goto('/en');
      await page.locator('footer').getByRole('link', { name: label, exact: true }).click();
      await expect(page).toHaveURL(new RegExp(path.replace(/\//g, '\\/') + '$'));
      await expect(page.locator('h1, h2').first()).toBeVisible();
    }
  });

  test('supports browser back and forward', async ({ page }) => {
    await page.goto('/en');
    await page.locator('footer').getByRole('link', { name: 'Work', exact: true }).click();
    await expect(page).toHaveURL(/\/en\/work$/);
    await page.goBack();
    await expect(page).toHaveURL(/\/en$/);
    await page.goForward();
    await expect(page).toHaveURL(/\/en\/work$/);
  });
});

test.describe('case studies', () => {
  for (const slug of CASE_STUDIES) {
    test(`${slug} is complete and has no placeholder copy`, async ({ page }) => {
      const errors = watchConsole(page);
      await page.goto(`/en/work/${slug}`);

      await expect(page.locator('h1')).toBeVisible();
      // At least six chapters, each with a heading.
      const chapterHeadings = page.locator('main section[id] h2');
      expect(await chapterHeadings.count()).toBeGreaterThanOrEqual(6);

      const body = (await page.locator('body').innerText()).toLowerCase();
      for (const forbidden of ['coming soon', 'lorem ipsum', 'todo:', 'tbd']) {
        expect(body, `${slug} contains "${forbidden}"`).not.toContain(forbidden);
      }

      // The prev/next pair at the foot must offer two real destinations.
      expect(await page.locator('a.archive-row').count()).toBe(2);
      expect(errors).toEqual([]);
    });
  }

  test('chapter navigation scrolls to the chapter', async ({ page }) => {
    await page.goto('/en/work/sendy');
    const navLink = page.locator('nav[aria-label="Case study chapters"]').first().getByRole('link').nth(2);
    const href = await navLink.getAttribute('href');
    await navLink.click();
    await expect(page).toHaveURL(new RegExp(`${href?.replace('#', '\\#')}$`));
  });
});

test.describe('work index', () => {
  test('filters projects accessibly and announces the count', async ({ page }) => {
    await page.goto('/en/work');
    const status = page.getByRole('status');
    const initial = await status.innerText();

    // The radio itself is visually hidden by design (the styled label is the
    // control surface), so click the label the way a sighted user would.
    await page.locator('label').filter({ hasText: /^Backend$/ }).click();
    await expect(page.getByRole('radio', { name: 'Backend' })).toBeChecked();
    await expect(status).not.toHaveText(initial);

    // Every visible project link must resolve to a real page.
    const links = page.locator('main a[href*="/work/"]');
    const count = await links.count();
    expect(count).toBeGreaterThan(0);
  });

  test('every project link resolves to a 200 page', async ({ page, request }) => {
    await page.goto('/en/work');
    const hrefs = await page.locator('main a[href*="/en/work/"]').evaluateAll((nodes) =>
      [...new Set(nodes.map((n) => (n as HTMLAnchorElement).getAttribute('href')!))],
    );
    expect(hrefs.length).toBeGreaterThanOrEqual(8);
    for (const href of hrefs) {
      const response = await request.get(href);
      expect(response.status(), `${href} status`).toBe(200);
    }
  });
});

test.describe('contact form', () => {
  test('shows localized validation and does not submit an invalid form', async ({ page }) => {
    await page.goto('/en/contact');
    let posted = false;
    page.on('request', (req) => {
      if (req.url().includes('/api/contact')) posted = true;
    });

    await page.getByRole('button', { name: /Send me a message/i }).click();
    await expect(page.getByText('Please enter your name.')).toBeVisible();
    expect(posted, 'invalid form must not reach the API').toBe(false);
  });

  test('reports honestly when no delivery provider is configured', async ({ page }) => {
    await page.goto('/en/contact');
    await page.getByLabel(/^Your name/).fill('Test Person');
    await page.getByLabel(/^Email/).fill('test@example.com');
    await page.getByLabel(/^What do you need/).selectOption({ index: 1 });
    await page
      .getByLabel(/^Project summary/)
      .fill('A reasonably detailed description of a project idea for testing.');

    await page.getByRole('button', { name: /Send me a message/i }).click();

    // With no RESEND_API_KEY it must say the message was NOT delivered —
    // never a fake success.
    const alert = page.getByRole('alert').first();
    await expect(alert).toBeVisible();
    await expect(alert).toContainText(/not connected|not been delivered/i);
    await expect(page.getByText('Message sent.')).toHaveCount(0);
  });

  test('validates email format', async ({ page }) => {
    await page.goto('/en/contact');
    await page.getByLabel(/^Your name/).fill('Test');
    await page.getByLabel(/^Email/).fill('not-an-email');
    await page.getByLabel(/^What do you need/).selectOption({ index: 1 });
    await page.getByLabel(/^Project summary/).fill('Another sufficiently long project description.');
    await page.getByRole('button', { name: /Send me a message/i }).click();
    await expect(page.getByText(/valid email address/i)).toBeVisible();
  });
});

test.describe('404', () => {
  test('returns 404 and keeps the portfolio shell', async ({ page }) => {
    const response = await page.goto('/en/definitely-not-a-real-route');
    expect(response?.status()).toBe(404);
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.getByRole('link', { name: /See selected work/i })).toBeVisible();
  });
});

/**
 * Next generates these from `icon.tsx` / `opengraph-image.tsx` at paths with no
 * file extension, so a locale middleware that only skips dotted paths will
 * redirect them into a locale — where they do not exist.
 *
 * That is exactly what happened: the document linked `/icon?…`, middleware sent
 * it to `/en/icon`, and it 404'd. The favicon and every social-card preview were
 * broken on every page. Nothing caught it, because a missing favicon degrades
 * silently and no test had ever requested the OG image.
 */
test.describe('generated metadata routes', () => {
  for (const [path, type] of [
    ['/icon', /image\/png/],
    ['/robots.txt', /text\/plain/],
    ['/sitemap.xml', /xml/],
  ] as const) {
    test(`${path} resolves without a locale redirect`, async ({ request }) => {
      const response = await request.get(path, { maxRedirects: 0 });
      expect(response.status(), `${path} was redirected or failed`).toBe(200);
      expect(response.headers()['content-type']).toMatch(type);
    });
  }

  test('the linked favicon href actually resolves', async ({ page, request }) => {
    await page.goto('/en');
    const href = await page.locator('link[rel="icon"]').first().getAttribute('href');
    expect(href, 'no icon link in the document').toBeTruthy();

    const response = await request.get(href!, { maxRedirects: 0 });
    expect(response.status(), `${href} does not resolve`).toBe(200);
  });

  /*
   * The social card is a static file now rather than a generated route, so it
   * is asserted through the document instead of by path: read whatever the page
   * actually advertises and fetch that. A hard-coded path would still pass if
   * the metadata pointed somewhere else entirely, which is the failure that
   * matters — nobody sees a broken OG image until it has already been shared.
   *
   * Both locales, because the tags are built per locale.
   */
  for (const locale of ['en', 'ar'] as const) {
    test(`the ${locale} og:image and twitter:image resolve`, async ({ page, request }) => {
      await page.goto(`/${locale}`);

      for (const selector of ['meta[property="og:image"]', 'meta[name="twitter:image"]']) {
        const url = await page.locator(selector).first().getAttribute('content');
        expect(url, `no ${selector} in the /${locale} document`).toBeTruthy();

        /*
         * `metadataBase` makes these absolute against the production host, which
         * is correct in the document and useless to fetch from a test run — so
         * the assertion is split: the tag must be absolute, because relative OG
         * URLs are what scrapers choke on, and the path is then requested
         * against this server.
         */
        expect(url, `${selector} is not absolute`).toMatch(/^https?:\/\//);
        const { pathname } = new URL(url!);

        const response = await request.get(pathname, { maxRedirects: 0 });
        expect(response.status(), `${pathname} was redirected or failed`).toBe(200);
        expect(response.headers()['content-type']).toMatch(/image\/png/);
      }
    });
  }
});

test.describe('keyboard and accessibility', () => {
  test('skip link is the first focusable element and works', async ({ page }) => {
    await page.goto('/en');
    await page.keyboard.press('Tab');
    const focused = page.locator(':focus');
    await expect(focused).toHaveText(/Skip to content/i);
    await focused.press('Enter');
    await expect(page.locator('#main')).toBeFocused();
  });

  test('keyboard reaches the primary CTA and a case study', async ({ page }) => {
    await page.goto('/en');
    for (let i = 0; i < 25; i += 1) {
      await page.keyboard.press('Tab');
      const href = await page.locator(':focus').getAttribute('href').catch(() => null);
      if (href?.includes('/work/sendy')) {
        await page.keyboard.press('Enter');
        await expect(page).toHaveURL(/\/work\/sendy$/);
        return;
      }
    }
    throw new Error('Could not reach the Sendy case study by keyboard within 25 tabs');
  });

  for (const locale of ['en', 'ar'] as const) {
    for (const route of ROUTES) {
      test(`no serious a11y violations: /${locale}${route || ' (home)'}`, async ({ page }) => {
        // Reveals animate opacity; auditing mid-transition produces phantom
        // contrast failures. Reduced motion settles them immediately, and it is
        // a state we ship anyway.
        await page.emulateMedia({ reducedMotion: 'reduce' });
        await page.goto(`/${locale}${route}`);
        await page.evaluate(() => document.fonts.ready);

        /*
         * Blocks below the fold sit at opacity 0 until their reveal fires, and
         * axe reads that as a contrast failure on whatever text they contain.
         * Force every block into its revealed state first — that is the state a
         * reader actually sees, and the one worth auditing.
         */
        await page.evaluate(() => {
          for (const element of document.querySelectorAll('.reveal')) {
            element.classList.add('is-in');
          }
        });
        await page.waitForTimeout(300);
        const results = await new AxeBuilder({ page })
          .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
          .analyze();

        const serious = results.violations.filter(
          (v) => v.impact === 'serious' || v.impact === 'critical',
        );
        expect(
          serious.map((v) => `${v.id}: ${v.nodes.length} node(s) — ${v.help}`),
          `a11y violations on /${locale}${route}`,
        ).toEqual([]);
      });
    }
  }

  test('primary buttons have readable contrast', async ({ page }) => {
    // Guards the Tailwind cascade-layer regression that made ivory-on-ivory text.
    // The hero carries no CTA in this system; the nav pill's is the primary one.
    await page.goto('/en');
    const button = page.getByRole('link', { name: /Work with Me/i }).first();
    const { color, background } = await button.evaluate((node) => {
      const styles = getComputedStyle(node);
      return { color: styles.color, background: styles.backgroundColor };
    });
    expect(color).not.toBe(background);
    expect(contrastRatio(color, background)).toBeGreaterThanOrEqual(4.5);
  });

  /**
   * WCAG 1.4.11 requires a focus indicator to reach 3:1 against what surrounds
   * it. axe cannot test this — it has no way to know what a focus ring looks
   * like — so a clean axe run says nothing about it, and this shipped as a
   * translucent `rgba(11,141,248,.45)` that resolved to **1.73:1** on white.
   *
   * Checked on both grounds: half the sections sit on `--bg-alt`, where the
   * bright accent would have measured 2.90:1 and failed.
   */
  test('the focus ring meets the 3:1 non-text threshold on both grounds', async ({ page }) => {
    await page.goto('/en');

    const ring = await page.evaluate(() => {
      const probe = document.createElement('button');
      document.body.append(probe);
      probe.focus();
      // jsdom-free: read what the stylesheet actually resolves for :focus-visible.
      const shadow = getComputedStyle(probe).boxShadow;
      probe.remove();

      const styles = getComputedStyle(document.documentElement);
      return {
        shadow,
        accent: styles.getPropertyValue('--color-accent').trim(),
        bg: styles.getPropertyValue('--color-bg').trim(),
        bgAlt: styles.getPropertyValue('--color-bg-alt').trim(),
      };
    });

    // The ring must be an opaque colour, not a washed-out alpha composite.
    expect(ring.shadow, 'focus ring is translucent').not.toMatch(/rgba\([^)]*,\s*0?\.\d+\s*\)/);

    // Browsers normalise `#ffffff` to `#fff`, and a naive parse of the short
    // form yields rgb(0, 15, 255) — a number that looks like a real failure.
    const hexToRgb = (hex: string) => {
      const raw = hex.replace('#', '');
      const full = raw.length === 3 ? [...raw].map((c) => c + c).join('') : raw;
      const n = Number.parseInt(full, 16);
      return `rgb(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255})`;
    };

    expect(hexToRgb('#fff'), 'hex parser is wrong').toBe('rgb(255, 255, 255)');

    for (const ground of [ring.bg, ring.bgAlt]) {
      expect(
        contrastRatio(hexToRgb(ring.accent), hexToRgb(ground)),
        `focus ring on ${ground}`,
      ).toBeGreaterThanOrEqual(3);
    }
  });
});

test.describe('no horizontal overflow', () => {
  for (const width of [1440, 1280, 1024, 768, 430, 390]) {
    for (const locale of ['en', 'ar'] as const) {
      test(`${width}px ${locale} homepage does not scroll sideways`, async ({ page }) => {
        await page.setViewportSize({ width, height: 900 });
        await page.goto(`/${locale}`);
        await page.waitForLoadState('networkidle');
        await page.waitForTimeout(400);
        const overflow = await page.evaluate(
          () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
        );
        expect(overflow, `${width}px ${locale} overflows by ${overflow}px`).toBeLessThanOrEqual(1);
      });
    }
  }
});
