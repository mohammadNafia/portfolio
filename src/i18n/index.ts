import { en, type Dictionary } from './dictionaries/en';
import { ar } from './dictionaries/ar';
import type { Locale } from './config';

const dictionaries: Record<Locale, Dictionary> = { en, ar };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale];
}

/** Pick the correct side of a `{ en, ar }` content value. */
export function pick(value: { en: string; ar: string }, locale: Locale): string {
  return value[locale];
}

export type { Dictionary };
export * from './config';
