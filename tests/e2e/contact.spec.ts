import { test, expect, type Page } from '@playwright/test';

/**
 * Contact form — the phone field and the success state.
 *
 * The success path is driven with an intercepted `/api/contact` rather than a
 * real submission. Locally there is no `RESEND_API_KEY`, so a genuine POST
 * returns `unavailable` and the success branch would never render; and on any
 * deployment where the key IS set, running this suite would send real mail to a
 * real inbox on every commit. Intercepting is what makes the success UI
 * testable at all — the delivery path itself is covered by the schema unit
 * tests and by a live check at deploy time.
 */

const FIELDS: Record<string, string> = {
  name: 'Test Person',
  email: 'test@example.com',
  phone: '+964 770 123 4567',
  summary: 'A description of the project that is comfortably past the minimum length.',
};

async function fill(page: Page, overrides: Partial<Record<string, string>> = {}) {
  const values = { ...FIELDS, ...overrides };
  for (const [name, value] of Object.entries(values)) {
    const field = page.locator(`[name="${name}"]`);
    await field.fill(value);
  }
  await page.locator('[name="service"]').selectOption({ index: 1 });
}

test.describe('phone number field', () => {
  test('is present and required on both locales', async ({ page }) => {
    for (const locale of ['en', 'ar'] as const) {
      await page.goto(`/${locale}/contact`);
      const phone = page.locator('[name="phone"]');
      await expect(phone, `${locale} has no phone field`).toBeVisible();
      await expect(phone).toHaveAttribute('aria-required', 'true');
      await expect(phone).toHaveAttribute('type', 'tel');
    }
  });

  /**
   * The bidi problem this guards is specific: a number typed as
   * "+964 770 …" in an RTL document has its leading `+` reordered to the
   * visual right, so the field displays a number that reads as a different
   * one. The class handles rendering; the attribute is what fixes the caret
   * and the order characters land in as they are typed.
   */
  test('is pinned LTR on the Arabic page', async ({ page }) => {
    await page.goto('/ar/contact');
    const phone = page.locator('[name="phone"]');
    await expect(phone).toHaveAttribute('dir', 'ltr');
    await expect(phone).toHaveClass(/ltr-island/);
  });

  test('blocks submission when empty, and says why', async ({ page }) => {
    await page.goto('/en/contact');
    await fill(page, { phone: '' });

    let posted = false;
    page.on('request', (request) => {
      if (request.url().includes('/api/contact')) posted = true;
    });

    await page.getByRole('button', { name: /Send me a message/i }).click();

    await expect(page.getByText('Please enter a phone number.')).toBeVisible();
    expect(posted, 'an invalid form was sent to the server anyway').toBe(false);
    await expect(page.locator('[name="phone"]')).toHaveAttribute('aria-invalid', 'true');
  });

  test('rejects something that is not a number, in Arabic too', async ({ page }) => {
    await page.goto('/ar/contact');
    await fill(page, { phone: 'اتصل بي' });
    await page.getByRole('button', { name: /أرسل لي رسالة/ }).click();

    await expect(page.getByText('لا يبدو هذا رقم هاتف صالحاً.', { exact: false })).toBeVisible();
  });

  test('accepts an Iraqi number and an international one', async ({ page }) => {
    for (const number of ['07701234567', '+44 7911 123456']) {
      await page.goto('/en/contact');

      let sent: Record<string, unknown> | null = null;
      await page.route('**/api/contact', async (route) => {
        sent = route.request().postDataJSON();
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({ status: 'ok' }),
        });
      });

      await fill(page, { phone: number });
      await page.getByRole('button', { name: /Send me a message/i }).click();

      await expect(page.getByRole('status')).toBeVisible();
      expect(sent, `${number} never reached the request`).not.toBeNull();
      // The number is carried through to the payload verbatim, not reformatted.
      expect((sent as unknown as Record<string, unknown>)['phone']).toBe(number);
    }
  });
});

test.describe('success state', () => {
  async function succeed(page: Page, locale: 'en' | 'ar') {
    await page.goto(`/${locale}/contact`);
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'ok' }),
      }),
    );
    await fill(page);
    const label = locale === 'en' ? /Send me a message/i : /أرسل لي رسالة/;
    await page.getByRole('button', { name: label }).click();
    await expect(page.getByRole('status')).toBeVisible();
  }

  for (const locale of ['en', 'ar'] as const) {
    test(`renders in the accent blue and centred on /${locale}`, async ({ page }) => {
      await succeed(page, locale);

      const panel = page.getByRole('status');
      const style = await panel.evaluate((node) => {
        const heading = node.querySelector('h3')!;
        const root = getComputedStyle(document.documentElement);
        return {
          headingColor: getComputedStyle(heading).color,
          textAlign: getComputedStyle(node).textAlign,
          accent: root.getPropertyValue('--color-accent').trim(),
          background: getComputedStyle(node).backgroundColor,
          hasTick: !!node.querySelector('svg'),
        };
      });

      // #0a6dc4
      expect(style.headingColor, 'the success heading is not the accent').toBe('rgb(10, 109, 196)');
      expect(style.textAlign).toBe('center');
      expect(style.background, 'the success panel has no tint').not.toBe('rgba(0, 0, 0, 0)');
      // Not colour alone: a mark as well as a hue.
      expect(style.hasTick, 'the success state has no icon').toBe(true);
    });
  }

  /**
   * The success panel is the ONLY state that gained colour. The honest-failure
   * behaviour is load-bearing — when delivery fails the visitor is told plainly
   * that the message was not delivered and shown the direct address — and it
   * must not start looking like a success, or read as a warning in red that the
   * system has no token for.
   */
  test('the unavailable state is unchanged and still colourless', async ({ page }) => {
    await page.goto('/en/contact');
    await page.route('**/api/contact', (route) =>
      route.fulfill({
        status: 503,
        contentType: 'application/json',
        body: JSON.stringify({ status: 'unavailable' }),
      }),
    );

    await fill(page);
    await page.getByRole('button', { name: /Send me a message/i }).click();

    const alert = page.getByRole('alert').first();
    await expect(alert).toBeVisible();
    await expect(alert).toContainText('not connected');
    // The direct address is still offered, which is the whole point of the state.
    await expect(alert.locator('a[href^="mailto:"]')).toBeVisible();

    const colour = await alert.evaluate((node) => ({
      heading: getComputedStyle(node.querySelector('h3')!).color,
      background: getComputedStyle(node).backgroundColor,
    }));
    // Ink on surface — no accent, no invented red.
    expect(colour.heading).toBe('rgb(17, 17, 17)');
    expect(colour.background).toBe('rgb(242, 242, 242)');
  });
});
