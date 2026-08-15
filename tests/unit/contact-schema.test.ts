import { describe, it, expect } from 'vitest';
import { contactSchema } from '@/lib/contact-schema';
import { en } from '@/i18n/dictionaries/en';
import { ar } from '@/i18n/dictionaries/ar';

/**
 * The contact schema is shared by the client form and the API route, so a hole
 * here is a hole in both. These cover the phone rule in particular, because it
 * has a requirement that pulls in two directions: Iraqi numbers are the primary
 * case, and a visitor from anywhere else must still be able to submit.
 *
 * That rules out validating against an Iraqi pattern, which is the obvious
 * implementation and the wrong one — so what is asserted below is that real
 * numbers from several countries pass while things that are not phone numbers
 * do not.
 */

const valid = {
  name: 'Mohammed Nafia',
  email: 'someone@example.com',
  phone: '+964 770 123 4567',
  service: 'Backend systems & API architecture',
  summary: 'A long enough description of the project to clear the minimum.',
};

const errorFor = (input: Record<string, unknown>, field: string) => {
  const result = contactSchema.safeParse(input);
  if (result.success) return undefined;
  return result.error.issues.find((issue) => issue.path[0] === field)?.message;
};

describe('contact schema — phone', () => {
  it('requires a phone number', () => {
    expect(errorFor({ ...valid, phone: '' }, 'phone')).toBe('phoneRequired');
    expect(errorFor({ ...valid, phone: '   ' }, 'phone')).toBe('phoneRequired');
  });

  it('accepts a submission once a valid number is supplied', () => {
    const result = contactSchema.safeParse(valid);
    expect(result.success, JSON.stringify(result.success ? {} : result.error.format())).toBe(true);
  });

  /**
   * Iraqi numbers in the forms people actually write them, local and
   * international, spaced and unspaced.
   */
  it.each([
    '07701234567',
    '0770 123 4567',
    '+9647701234567',
    '+964 770 123 4567',
    '00964 770 123 4567',
    '(0770) 123-4567',
  ])('accepts the Iraqi number %s', (phone) => {
    expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(true);
  });

  /**
   * ...and the rest of the world, which is the half an Iraqi-only pattern
   * would have silently broken.
   */
  it.each([
    '+1 212 555 1234',
    '+44 7911 123456',
    '+49 30 123456',
    '+971 50 123 4567',
    '+81 90 1234 5678',
    '+61 412 345 678',
  ])('accepts the international number %s', (phone) => {
    expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(true);
  });

  /**
   * The failure this guards would have been invisible to every test above,
   * because every one of them is written in ASCII.
   *
   * `\d` and `\D` match ASCII digits only, so an Arabic speaker entering their
   * own number in their own numerals — on the Arabic half of a bilingual site
   * built primarily for Iraq — had it rejected as not a valid phone number.
   */
  it.each([
    '٠٧٧٠١٢٣٤٥٦٧',
    '+٩٦٤ ٧٧٠ ١٢٣ ٤٥٦٧',
    '۰۷۷۰۱۲۳۴۵۶۷',
  ])('accepts the Arabic-Indic number %s', (phone) => {
    expect(contactSchema.safeParse({ ...valid, phone }).success).toBe(true);
  });

  it('does not rewrite what the visitor typed', () => {
    const phone = '+٩٦٤ ٧٧٠ ١٢٣ ٤٥٦٧';
    const result = contactSchema.safeParse({ ...valid, phone });
    expect(result.success).toBe(true);
    // Folded for counting only — the delivered value is theirs, in their script.
    if (result.success) expect(result.data.phone).toBe(phone);
  });

  it('still counts Arabic-Indic digits against the same bounds', () => {
    expect(errorFor({ ...valid, phone: '١٢٣٤٥' }, 'phone')).toBe('phoneInvalid');
  });

  it.each([
    ['call me maybe', 'letters are not a phone number'],
    ['12345', 'too few digits to be a phone number anywhere'],
    ['+9647701234567890123', 'more digits than E.164 allows'],
    ['+964-770-ABC-4567', 'letters mixed into a plausible shape'],
    ['<script>alert(1)</script>', 'markup'],
  ])('rejects %s (%s)', (phone) => {
    expect(errorFor({ ...valid, phone }, 'phone')).toBe('phoneInvalid');
  });

  /**
   * A message key with no dictionary entry renders as the raw key — the form
   * falls back to showing `messageKey` itself. Both locales must carry both.
   */
  it('has a localised message for every phone error it can raise', () => {
    for (const [name, dict] of [
      ['en', en],
      ['ar', ar],
    ] as const) {
      expect(dict.contact.validation.phoneRequired, `${name}.phoneRequired`).toBeTruthy();
      expect(dict.contact.validation.phoneInvalid, `${name}.phoneInvalid`).toBeTruthy();
      expect(dict.contact.form.phone, `${name}.form.phone`).toBeTruthy();
      expect(dict.contact.form.phonePlaceholder, `${name}.form.phonePlaceholder`).toBeTruthy();
    }
  });
});

describe('contact schema — the fields that were already there', () => {
  it('still requires name, email, service and a substantial summary', () => {
    expect(errorFor({ ...valid, name: '' }, 'name')).toBe('nameRequired');
    expect(errorFor({ ...valid, email: 'not-an-email' }, 'email')).toBe('emailInvalid');
    expect(errorFor({ ...valid, service: '' }, 'service')).toBe('serviceRequired');
    expect(errorFor({ ...valid, summary: 'too short' }, 'summary')).toBe('summaryShort');
  });

  it('leaves the optional fields optional', () => {
    const result = contactSchema.safeParse({ ...valid, company: '', timeline: '', budget: '' });
    expect(result.success).toBe(true);
  });
});
