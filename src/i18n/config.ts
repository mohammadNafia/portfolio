export const locales = ['en', 'ar'] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = 'en';

export const localeDirection: Record<Locale, 'ltr' | 'rtl'> = {
  en: 'ltr',
  ar: 'rtl',
};

export const localeHtmlLang: Record<Locale, string> = {
  en: 'en',
  ar: 'ar',
};

/** Native label used in the language switch — never translated. */
export const localeLabel: Record<Locale, string> = {
  en: 'EN',
  ar: 'ع',
};

export const localeFullLabel: Record<Locale, string> = {
  en: 'English',
  ar: 'العربية',
};

export const LOCALE_COOKIE = 'mn_locale';

export function isLocale(value: string | undefined): value is Locale {
  return typeof value === 'string' && (locales as readonly string[]).includes(value);
}

/**
 * Swap the locale segment of a pathname, preserving the equivalent route.
 * `/ar/work/sendy` → `/en/work/sendy`.
 */
export function switchLocalePath(pathname: string, next: Locale): string {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length === 0) return `/${next}`;
  if (isLocale(segments[0])) {
    segments[0] = next;
    return `/${segments.join('/')}`;
  }
  return `/${next}/${segments.join('/')}`;
}

/** Build a locale-prefixed href from a locale-less path such as `work/sendy`. */
export function localeHref(locale: Locale, path = ''): string {
  const clean = path.replace(/^\/+|\/+$/g, '');
  return clean ? `/${locale}/${clean}` : `/${locale}`;
}
