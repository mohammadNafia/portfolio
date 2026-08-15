import { z } from 'zod';

/**
 * One schema, used by the client form and the API route, so validation cannot
 * drift between them. Messages are keys resolved against the dictionary rather
 * than English strings, keeping validation feedback localised.
 */
export const contactSchema = z.object({
  name: z.string().trim().min(1, 'nameRequired'),
  email: z.string().trim().min(1, 'emailRequired').email('emailInvalid'),
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
