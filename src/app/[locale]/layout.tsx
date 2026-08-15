import type { Metadata, Viewport } from 'next';
import { Handjet, Poppins, IBM_Plex_Sans_Arabic } from 'next/font/google';
import { notFound } from 'next/navigation';
import '../globals.css';

import { locales, localeDirection, isLocale, localeHref, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { site } from '@/lib/site';
import { SiteHeader } from '@/components/layout/SiteHeader';
import { FooterLine } from '@/components/home/sections';
import { SiteSchema } from '@/components/seo/StructuredData';

/**
 * Handjet is the pixel display face. It ships Latin *and* Arabic, which is why
 * the pixel identity survives in both locales instead of splitting into two
 * visual systems. Square elements are selected in CSS via
 * `font-variation-settings: 'ELGR' 1, 'ELSH' 0`.
 */
const handjet = Handjet({
  subsets: ['latin', 'arabic'],
  weight: ['400', '700'],
  variable: '--font-handjet',
  display: 'swap',
});

const plexArabic = IBM_Plex_Sans_Arabic({
  subsets: ['arabic', 'latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-plex-arabic',
  display: 'swap',
});

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins',
  display: 'swap',
});

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const viewport: Viewport = {
  themeColor: '#EDEDED',
  colorScheme: 'light',
  width: 'device-width',
  initialScale: 1,
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return {
    metadataBase: new URL(site.url),
    title: {
      default: dict.meta.defaultTitle,
      template: `%s — ${dict.meta.siteName}`,
    },
    description: dict.meta.defaultDescription,
    applicationName: dict.meta.siteName,
    authors: [{ name: site.fullName, url: site.url }],
    creator: site.fullName,
    keywords: [
      'Full-Stack Engineer',
      'Product Founder',
      'Baghdad',
      'Iraq',
      'React',
      'TypeScript',
      'ASP.NET Core',
      'SaaS',
      'Arabic RTL',
    ],
    alternates: {
      canonical: localeHref(locale),
      languages: {
        en: '/en',
        ar: '/ar',
        'x-default': '/en',
      },
    },
    openGraph: {
      type: 'website',
      siteName: dict.meta.siteName,
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      locale: locale === 'ar' ? 'ar_IQ' : 'en_US',
      alternateLocale: locale === 'ar' ? 'en_US' : 'ar_IQ',
      url: localeHref(locale),
      /*
       * The designed card, not the generated one — `og.png` is a real 1200×630
       * asset. Both locales point at the same file: it carries the pixel
       * wordmark and one line of Latin type, which reads the same either way,
       * and a second render would only be a translation of that line.
       */
      images: [{ url: '/img/og.png', width: 1200, height: 630, alt: dict.meta.defaultTitle }],
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.meta.defaultTitle,
      description: dict.meta.defaultDescription,
      images: [{ url: '/img/og.png', width: 1200, height: 630, alt: dict.meta.defaultTitle }],
    },
    robots: { index: true, follow: true },
  };
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const dict = getDictionary(locale);

  return (
    <html
      lang={locale}
      dir={localeDirection[locale]}
      className={`no-js ${handjet.variable} ${poppins.variable} ${plexArabic.variable}`}
    >
      <head>
        {/*
          Removed synchronously by the first script that runs, so the no-JS
          reveal fallback in globals.css applies only when scripts really are
          unavailable — never as a flash for normal visitors.
        */}
        <script
          dangerouslySetInnerHTML={{
            __html: `document.documentElement.classList.remove('no-js')`,
          }}
        />
      </head>
      <body>
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:inset-inline-start-4 focus:top-4 focus:z-[var(--z-dialog)] focus:rounded-input focus:bg-ink focus:px-4 focus:py-2 focus:text-bg"
        >
          {dict.common.skipToContent}
        </a>

        <SiteHeader locale={locale} dict={dict} />

        <main id="main" tabIndex={-1}>
          {children}
        </main>

        <FooterLine locale={locale} dict={dict} />
        <SiteSchema locale={locale} />
      </body>
    </html>
  );
}
