import type { Metadata } from 'next';
import { locales, localeHref, type Locale } from '@/i18n/config';
import { site } from '@/lib/site';

/**
 * Per-route metadata: canonical, the full hreflang set, and locale-correct
 * social cards.
 *
 * Two bugs made this worth centralising.
 *
 * 1. Every page hand-wrote its own `languages` map as a string literal —
 *    `{ en: '/en/about', ar: '/ar/about', 'x-default': '/en/about' }`. Six
 *    copies of the same shape, each one a place for a typo to sit undetected;
 *    a single wrong path silently breaks the reciprocity Google requires and
 *    there is nothing in the type system to catch it. Deriving it from one
 *    `path` argument makes a mismatch impossible to express.
 *
 * 2. Next.js *replaces* the parent `openGraph` object rather than merging into
 *    it, but only when the child declares one. Every route except home and the
 *    case studies declared none — so `/en/about`, `/ar/services` and the rest
 *    inherited the site-wide card wholesale and announced `og:title` of the
 *    homepage with `og:url` of `https://mohammednafia.com/en`. Six routes ×
 *    two locales all claiming to be the same URL when shared.
 */
export function pageMetadata({
  locale,
  path,
  title,
  description,
}: {
  locale: Locale;
  /** Locale-less route, e.g. `work` or `work/sendy`. Empty string for home. */
  path: string;
  title: string;
  description: string;
}): Metadata {
  const suffix = path ? `/${path}` : '';
  const canonical = localeHref(locale, path);
  const url = `${site.url}${canonical}`;

  const languages: Record<string, string> = {};
  for (const alt of locales) languages[alt] = `/${alt}${suffix}`;
  /*
   * `x-default` points at the English URL rather than the bare `/` root.
   * `/` is a locale-detecting 307 — pointing an hreflang annotation at a
   * redirect asks Google to resolve a hop before it can cluster the pages, and
   * the destination varies by request header, so the target is not stable.
   * An English page that always returns 200 is the honest default.
   */
  languages['x-default'] = `/en${suffix}`;

  return {
    title,
    description,
    alternates: { canonical, languages },
    openGraph: {
      type: path.startsWith('work/') ? 'article' : 'website',
      siteName: site.name,
      title,
      description,
      url,
      locale: locale === 'ar' ? 'ar_IQ' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_IQ',
      images: [{ url: '/img/og.png', width: 1200, height: 630, alt: title }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [{ url: '/img/og.png', width: 1200, height: 630, alt: title }],
    },
  };
}
