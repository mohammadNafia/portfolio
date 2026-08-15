/**
 * Generates `src/content/lastmod.generated.json` — the real last-modified date
 * of every indexable route, taken from git.
 *
 * Why this is a build step and not a runtime lookup: `sitemap.ts` is prerendered
 * into the OpenNext bundle and runs on a Worker, where there is no `git` and no
 * filesystem. The dates therefore have to be resolved on the build machine and
 * baked in as data. A JSON module is the cheapest way to do that — it tree-shakes
 * into the prerendered XML and costs nothing at runtime.
 *
 * Why it is generated rather than hand-maintained: the previous sitemap declared
 * a single hardcoded `lastModified` for all 28 URLs. Every page claimed to change
 * on the same day, which is both untrue and useless as a crawl signal — a sitemap
 * that lies about freshness gets its `lastmod` ignored wholesale.
 *
 * Fallback order: git commit date → file mtime → build date. A shallow CI clone
 * with no history degrades to mtime rather than failing the build.
 */
import { execFileSync } from 'node:child_process';
import { statSync, writeFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, relative } from 'node:path';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = join(root, 'src/content/lastmod.generated.json');

/** Last commit date that touched a path, as an ISO date. `null` if unknown. */
function gitDate(paths) {
  const existing = paths.filter((p) => existsSync(join(root, p)));
  if (existing.length === 0) return null;
  try {
    const stdout = execFileSync(
      'git',
      ['log', '-1', '--format=%cI', '--', ...existing],
      { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
    ).trim();
    return stdout || null;
  } catch {
    return null;
  }
}

function mtime(paths) {
  const times = paths
    .filter((p) => existsSync(join(root, p)))
    .map((p) => statSync(join(root, p)).mtime.getTime());
  return times.length ? new Date(Math.max(...times)).toISOString() : null;
}

/** Most recent of a set of ISO strings. */
function newest(...dates) {
  const valid = dates.filter(Boolean).sort();
  return valid[valid.length - 1] ?? new Date().toISOString();
}

function resolve(paths) {
  return gitDate(paths) ?? mtime(paths) ?? new Date().toISOString();
}

/*
 * The shell, which really does change every page when it changes.
 *
 * The dictionaries are deliberately NOT here. All copy for all routes lives in
 * two files, so attributing either file's commit date to all 28 URLs would reset
 * every `lastmod` on any copy edit anywhere — accurate in the narrowest sense,
 * useless as a freshness signal, and exactly the "every page changed today" lie
 * the hardcoded date used to tell. `dictDate()` attributes them per route
 * instead, by asking git when that route's own key block last moved.
 */
const SHARED = [
  'src/app/[locale]/layout.tsx',
  'src/components/layout/SiteHeader.tsx',
];

/**
 * When a specific top-level key in the dictionaries last changed.
 *
 * `git log -L <start>,<end>:<file>` follows a range through history, so
 * `/^  services: {/,/^  },$/` tracks the services block across edits that move
 * it up or down the file. Falls back to the whole-file date where the range
 * cannot be resolved (shallow clone, renamed key).
 */
function dictDate(key) {
  const files = ['src/i18n/dictionaries/en.ts', 'src/i18n/dictionaries/ar.ts'];
  const dates = files.map((file) => {
    if (!existsSync(join(root, file))) return null;
    try {
      const stdout = execFileSync(
        'git',
        ['log', '-1', '--format=%cI', '-L', `/^  ${key}: {/,/^  },$/:${file}`],
        { cwd: root, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] },
      );
      return stdout.split('\n')[0]?.trim() || null;
    } catch {
      return null;
    }
  });
  return newest(...dates, ...(dates.some(Boolean) ? [] : [gitDate(files)]));
}

const CONTENT = [
  'src/content/index.ts',
  'src/content/schema.ts',
  'src/content/projects/sendy.ts',
  'src/content/projects/immar.ts',
  'src/content/projects/nano.ts',
  'src/content/projects/archive.ts',
];

/** Which source file backs which project slug. */
const PROJECT_SOURCES = {
  sendy: ['src/content/projects/sendy.ts'],
  immar: ['src/content/projects/immar.ts'],
  'nano-ocr': ['src/content/projects/nano.ts'],
  'al-tafawuq': ['src/content/projects/archive.ts'],
  'virtual-banking': ['src/content/projects/archive.ts'],
  'form-builder': ['src/content/projects/archive.ts'],
  'invoice-mini-app': ['src/content/projects/archive.ts'],
  medichub: ['src/content/projects/archive.ts'],
};

const shared = resolve(SHARED);

const routes = {
  '': newest(shared, dictDate('home'), resolve([...CONTENT, 'src/app/[locale]/page.tsx', 'src/components/home/Hero.tsx', 'src/components/home/sections.tsx'])),
  work: newest(shared, dictDate('work'), resolve([...CONTENT, 'src/app/[locale]/work/page.tsx', 'src/components/work/WorkIndex.tsx'])),
  about: newest(shared, dictDate('about'), resolve(['src/app/[locale]/about/page.tsx'])),
  services: newest(shared, dictDate('services'), resolve(['src/app/[locale]/services/page.tsx'])),
  contact: newest(shared, dictDate('contact'), resolve(['src/app/[locale]/contact/page.tsx', 'src/components/contact/ContactForm.tsx'])),
  privacy: newest(shared, dictDate('privacy'), resolve(['src/app/[locale]/privacy/page.tsx'])),
};

/*
 * Case studies carry their own copy in their own content file, so they are the
 * one part of the site where `lastmod` is genuinely per-URL. `caseStudy` covers
 * the shared chrome around every study (chapter labels, the CTA, the concept
 * notice) — an edit there does change all eight.
 */
const projects = {};
const caseStudyChrome = dictDate('caseStudy');
for (const [slug, sources] of Object.entries(PROJECT_SOURCES)) {
  projects[slug] = newest(
    shared,
    caseStudyChrome,
    resolve([...sources, 'src/app/[locale]/work/[slug]/page.tsx', 'src/components/case-study/Blocks.tsx']),
  );
}

const payload = { generatedAt: new Date().toISOString(), routes, projects };
writeFileSync(out, JSON.stringify(payload, null, 2) + '\n', 'utf8');

console.log(`  lastmod manifest   ${relative(root, out)}`);
for (const [k, v] of Object.entries(routes)) console.log(`    /${k || '(home)'} → ${v.slice(0, 10)}`);
for (const [k, v] of Object.entries(projects)) console.log(`    /work/${k} → ${v.slice(0, 10)}`);
