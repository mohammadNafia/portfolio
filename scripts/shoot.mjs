/**
 * Visual review harness.
 *
 * Captures every route at every supported viewport, in both locales, into
 * `docs/screenshots/`. Used for the deliberate refinement passes rather than as
 * an automated assertion — the point is to look at them.
 *
 *   node scripts/shoot.mjs             # all viewports, both locales
 *   node scripts/shoot.mjs 1440x900 en # one viewport, one locale
 */
import { chromium } from '@playwright/test';
import { mkdir } from 'node:fs/promises';
import path from 'node:path';

// Point at the production server for final captures — dev overlays and the
// route indicator are not part of the design.
const BASE = process.env.SHOOT_BASE_URL ?? 'http://localhost:3210';
const OUT = path.join(process.cwd(), 'docs', 'screenshots');

const VIEWPORTS = [
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1024x1366', width: 1024, height: 1366 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '430x932', width: 430, height: 932 },
  { name: '390x844', width: 390, height: 844 },
];

const ROUTES = [
  { name: 'home', path: '' },
  { name: 'work', path: '/work' },
  { name: 'case-sendy', path: '/work/sendy' },
  { name: 'case-immar', path: '/work/immar' },
  { name: 'case-nano', path: '/work/nano-ocr' },
  { name: 'case-banking', path: '/work/virtual-banking' },
  { name: 'about', path: '/about' },
  { name: 'services', path: '/services' },
  { name: 'contact', path: '/contact' },
  { name: 'privacy', path: '/privacy' },
  { name: 'notfound', path: '/this-route-does-not-exist' },
];

const [viewportArg, localeArg] = process.argv.slice(2);
const viewports = viewportArg ? VIEWPORTS.filter((v) => v.name === viewportArg) : VIEWPORTS;
const locales = localeArg ? [localeArg] : ['en', 'ar'];

const browser = await chromium.launch();
let count = 0;

for (const viewport of viewports) {
  const context = await browser.newContext({
    viewport: { width: viewport.width, height: viewport.height },
    deviceScaleFactor: 2,
    reducedMotion: 'reduce', // deterministic captures; motion is reviewed live
  });
  const page = await context.newPage();

  for (const locale of locales) {
    const dir = path.join(OUT, viewport.name, locale);
    await mkdir(dir, { recursive: true });

    for (const route of ROUTES) {
      const url = `${BASE}/${locale}${route.path}`;
      const response = await page.goto(url, { waitUntil: 'networkidle', timeout: 45_000 });

      // Chromium's full-page capture does not fire IntersectionObserver for
      // content below the fold, so scroll the whole document first to trigger
      // every section reveal, then return to the top.
      // Half-viewport steps with enough dwell for IntersectionObserver to fire;
      // stepping faster than this silently photographs un-revealed sections.
      // Walk the document until scrolling stops making progress — reading a
      // height up front is unreliable while sections are still revealing and
      // changing the page length.
      await page.evaluate(async () => {
        // The site sets `scroll-behavior: smooth`, which makes programmatic
        // scrolls animate — `window.scrollY` then lags the target and the
        // progress check below exits before the page has moved at all.
        const previousBehavior = document.documentElement.style.scrollBehavior;
        document.documentElement.style.scrollBehavior = 'auto';

        // Let hydration finish before moving: Motion attaches its viewport
        // observers on mount, and anything scrolled past beforehand is simply
        // never observed.
        await new Promise((resolve) => setTimeout(resolve, 700));

        const step = window.innerHeight * 0.5;
        const pause = () => new Promise((resolve) => setTimeout(resolve, 110));

        let previous = -1;
        for (let guard = 0; guard < 400; guard += 1) {
          const current = window.scrollY;
          if (current === previous) break;
          previous = current;
          window.scrollTo(0, current + step);
          await pause();
        }

        // Return pass — catches anything the downward pass raced through.
        previous = -1;
        for (let guard = 0; guard < 400; guard += 1) {
          const current = window.scrollY;
          if (current === previous || current === 0) break;
          previous = current;
          window.scrollTo(0, Math.max(0, current - step));
          await pause();
        }

        window.scrollTo(0, 0);
        await new Promise((resolve) => setTimeout(resolve, 300));
        document.documentElement.style.scrollBehavior = previousBehavior;
      });
      await page.waitForTimeout(500);
      await page.screenshot({
        path: path.join(dir, `${route.name}.png`),
        fullPage: true,
      });
      count += 1;

      /*
       * Abort on a wrong status instead of warning.
       *
       * This used to log `WARN(500)` and carry on, so two full 132-shot runs
       * completed "successfully" against a server that was returning 500 for
       * every route. Nothing looked wrong until the files turned out to be
       * byte-identical. A capture run is long; failing on the first bad
       * response costs seconds instead of half an hour.
       */
      const status = response?.status() ?? 0;
      const expected = route.name === 'notfound' ? 404 : 200;
      if (status !== expected) {
        throw new Error(
          `${viewport.name}/${locale}/${route.name} returned ${status}, expected ${expected}. ` +
            'The server is serving a broken build — rebuild before capturing.',
        );
      }
      console.log(`${viewport.name}/${locale}/${route.name} — ${status}`);
    }
  }

  await context.close();
}

await browser.close();
console.log(`\nCaptured ${count} screenshots into docs/screenshots/`);
