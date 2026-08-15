import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, LOCALE_COOKIE, isLocale, type Locale } from '@/i18n/config';

const PUBLIC_FILE = /\.[^/]+$/;

/**
 * Every URL is normalised into a locale segment, so `/work` lands on
 * `/en/work` and an unknown path still renders the localised 404 rather than an
 * unstyled default document.
 *
 * Preference order: an explicit locale in the URL, then the stored cookie, then
 * Accept-Language, then the default.
 */
function resolveLocale(request: NextRequest): Locale {
  const cookieValue = request.cookies.get(LOCALE_COOKIE)?.value;
  if (isLocale(cookieValue)) return cookieValue;

  const header = request.headers.get('accept-language');
  if (header) {
    const preferred = header
      .split(',')
      .map((part) => {
        const [tag = '', q = 'q=1'] = part.trim().split(';');
        return { tag: tag.toLowerCase(), q: Number.parseFloat(q.replace('q=', '')) || 0 };
      })
      .sort((a, b) => b.q - a.q);

    for (const { tag } of preferred) {
      const base = tag.split('-')[0];
      if (isLocale(base)) return base;
    }
  }

  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname === '/favicon.ico' ||
    PUBLIC_FILE.test(pathname)
  ) {
    return NextResponse.next();
  }

  const segments = pathname.split('/').filter(Boolean);
  const first = segments[0];

  if (isLocale(first)) {
    const response = NextResponse.next();
    // Persist the choice so a returning visitor lands in their language.
    if (request.cookies.get(LOCALE_COOKIE)?.value !== first) {
      response.cookies.set(LOCALE_COOKIE, first, {
        path: '/',
        maxAge: 60 * 60 * 24 * 365,
        sameSite: 'lax',
      });
    }
    return response;
  }

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;
  return NextResponse.redirect(url);
}

/**
 * `icon` and `opengraph-image` must be excluded by name.
 *
 * The old pattern excluded `_next`, `api` and anything containing a dot, which
 * covered `/robots.txt` and `/sitemap.xml` — but Next's generated metadata
 * routes have no extension. So the document linked `/icon?…`, middleware
 * redirected it to `/en/icon`, and that 404'd: **the favicon and every social
 * card preview were broken on every page**, silently, because a missing favicon
 * degrades quietly and nothing requests the OG image during a test run.
 *
 * `apple-icon` and `manifest.webmanifest` are listed pre-emptively — they are
 * the same convention and would fail the same way if added later.
 */
export const config = {
  matcher: ['/((?!_next|api|icon|apple-icon|opengraph-image|twitter-image|manifest|.*\\..*).*)'],
};

export { locales };
