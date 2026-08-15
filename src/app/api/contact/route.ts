import { NextResponse } from 'next/server';
import { contactSchema, type ContactFieldError, type ContactResponse } from '@/lib/contact-schema';
import { site } from '@/lib/site';

export const runtime = 'nodejs';

/**
 * Contact inquiry endpoint.
 *
 * Honesty contract: when no delivery provider is configured, this returns
 * `unavailable` rather than `ok`. The form then tells the visitor plainly that
 * the message was NOT delivered and points them at the direct email address.
 * It never fakes a successful submission.
 *
 * To enable delivery, set RESEND_API_KEY (and optionally CONTACT_TO_EMAIL) —
 * see `.env.example`.
 */
export async function POST(request: Request): Promise<NextResponse<ContactResponse>> {
  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 400 });
  }

  const parsed = contactSchema.safeParse(payload);
  if (!parsed.success) {
    const errors: ContactFieldError[] = parsed.error.issues.map((issue) => ({
      field: (issue.path[0] ?? 'name') as ContactFieldError['field'],
      messageKey: issue.message,
    }));
    return NextResponse.json({ status: 'invalid', errors }, { status: 422 });
  }

  const apiKey = process.env['RESEND_API_KEY'];
  const to = process.env['CONTACT_TO_EMAIL'] ?? site.email;

  if (!apiKey) {
    // No provider configured: say so rather than pretending.
    return NextResponse.json({ status: 'unavailable' }, { status: 503 });
  }

  const data = parsed.data;

  try {
    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: process.env['CONTACT_FROM_EMAIL'] ?? 'Portfolio <onboarding@resend.dev>',
        to: [to],
        reply_to: data.email,
        subject: `New project inquiry — ${data.name}${data.company ? ` (${data.company})` : ''}`,
        text: [
          `Name: ${data.name}`,
          `Email: ${data.email}`,
          data.company ? `Company: ${data.company}` : null,
          `Service: ${data.service}`,
          data.timeline ? `Timeline: ${data.timeline}` : null,
          data.budget ? `Budget: ${data.budget}` : null,
          data.contactMethod ? `Preferred contact: ${data.contactMethod}` : null,
          data.language ? `Preferred language: ${data.language}` : null,
          '',
          'Summary:',
          data.summary,
        ]
          .filter(Boolean)
          .join('\n'),
      }),
    });

    if (!response.ok) {
      return NextResponse.json({ status: 'error' }, { status: 502 });
    }

    return NextResponse.json({ status: 'ok' });
  } catch {
    return NextResponse.json({ status: 'error' }, { status: 502 });
  }
}
