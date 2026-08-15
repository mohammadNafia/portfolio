import { NextResponse, type NextRequest } from 'next/server';
import { locales, defaultLocale, LOCALE_COOKIE, isLocale, type Locale } from '@/i18n/config';

const PUBLIC_FILE = /\.[^/]+$/;

/**
 * The one host allowed to be indexed.
 *
 * `wrangler.jsonc` deliberately keeps `workers_dev: true` on production so a
 * deploy stays verifiable while DNS settles, which means the whole site is also
 * live at `portfolio-production.…workers.dev`. Canonical tags alone are a hint,
 * not a directive — Google is free to ignore one and index the duplicate — so
 * any host that is not the canonical one gets a hard `noindex` header instead.
 * The apex is unaffected and the fallback URL stays usable for humans.
 */
const CANONICAL_HOST = new URL(
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://mohammednafia.com',
).host;

/** `noindex` for every host but the canonical one. Mutates and returns `response`. */
function guardHost(request: NextRequest, response: NextResponse): NextResponse {
  const host = request.headers.get('host');
  if (host && host !== CANONICAL_HOST) {
    response.headers.set('x-robots-tag', 'noindex, nofollow');
  }
  return response;
}

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
    return guardHost(request, NextResponse.next());
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
    /*
     * The locale is chosen per request from a cookie and Accept-Language, so
     * the response body varies by both. Without this, a shared cache — the
     * Cloudflare edge included — can serve an Arabic document to an English
     * visitor, or hand a crawler whichever copy happened to be cached first.
     */
    response.headers.append('vary', 'accept-language, cookie');
    return guardHost(request, response);
  }

  const locale = resolveLocale(request);
  const url = request.nextUrl.clone();
  url.pathname = `/${locale}${pathname === '/' ? '' : pathname}`;

  /*
   * 307 rather than 308: which locale `/` resolves to genuinely depends on the
   * visitor, so the redirect is not permanent and must not be cached as though
   * it were. `Vary` is what stops the edge caching one visitor's answer for
   * everyone.
   */
  const redirect = NextResponse.redirect(url, 307);
  redirect.headers.append('vary', 'accept-language, cookie');
  return guardHost(request, redirect);
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
