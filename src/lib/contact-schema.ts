import { z } from 'zod';

/**
 * One schema, used by the client form and the API route, so validation cannot
 * drift between them. Messages are keys resolved against the dictionary rather
 * than English strings, keeping validation feedback localised.
 */
/**
 * Characters a phone number is allowed to be written with. Digits, plus the
 * punctuation people actually type: a leading `+`, spaces, dashes, dots and
 * brackets around an area code.
 *
 * Deliberately no letters — this is what separates "+964 770 123 4567" from a
 * sentence, and it is checked before the digit count so a visitor who typed
 * prose into the wrong field gets told the field is wrong rather than that
 * their number is too short.
 */
const PHONE_SHAPE = /^[+()\-.\s\d]+$/;

/** Digits only, for counting. Formatting is the visitor's business, not ours. */
const digitsIn = (value: string) => value.replace(/\D/g, '');

/**
 * 7 to 15 digits.
 *
 * The upper bound is E.164's own maximum, so no real number in any country
 * exceeds it. The lower bound is loose on purpose: the brief is that Iraqi
 * numbers are the primary case and a visitor from outside Iraq must still be
 * able to submit, which rules out validating against an Iraqi pattern. So the
 * rule is "could this be a phone number anywhere" rather than "is this the
 * shape I expect".
 *
 * Both Iraqi forms pass: 0770 123 4567 is 11 digits, +964 770 123 4567 is 13.
 * So do +1 212 555 1234 (11) and +44 7911 123456 (12).
 */
const MIN_DIGITS = 7;
const MAX_DIGITS = 15;

export const contactSchema = z.object({
  name: z.string().trim().min(1, 'nameRequired'),
  email: z.string().trim().min(1, 'emailRequired').email('emailInvalid'),
  phone: z
    .string()
    .trim()
    .min(1, 'phoneRequired')
    .refine((value) => PHONE_SHAPE.test(value), 'phoneInvalid')
    .refine((value) => {
      const digits = digitsIn(value);
      return digits.length >= MIN_DIGITS && digits.length <= MAX_DIGITS;
    }, 'phoneInvalid'),
  company: z.string().trim().max(120).optional().or(z.literal('')),
  service: z.string().trim().min(1, 'serviceRequired'),
  summary: z.string().trim().min(1, 'summaryRequired').min(20, 'summaryShort').max(4000),
  timeline: z.string().trim().optional().or(z.literal('')),
  budget: z.string().trim().optional().or(z.literal('')),
  contactMethod: z.string().trim().optional().or(z.literal('')),
  language: z.string().trim().optional().or(z.literal('')),
});

export type ContactInput = z.infer<typeof contactSchema>;

export type ContactFieldError = {
  field: keyof ContactInput;
  messageKey: string;
};

/** Response contract shared by the route and the form. */
export type ContactResponse =
  | { status: 'ok' }
  | { status: 'invalid'; errors: ContactFieldError[] }
  | { status: 'unavailable' }
  | { status: 'error' };
