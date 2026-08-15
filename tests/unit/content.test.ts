import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import path from 'node:path';
import { projects, featuredProjects, archiveProjects, getProject, getNextProject } from '@/content';
import { locales } from '@/i18n/config';
import { showcaseSchema } from '@/content/schema';
import { en } from '@/i18n/dictionaries/en';
import { ar } from '@/i18n/dictionaries/ar';

describe('project registry', () => {
  it('validates every project against the schema at load', () => {
    expect(projects.length).toBeGreaterThan(0);
  });

  it('has exactly three featured flagship case studies', () => {
    expect(featuredProjects.map((p) => p.slug)).toEqual(['sendy', 'immar', 'nano-ocr']);
  });

  it('gives every featured project a complete case study', () => {
    for (const project of featuredProjects) {
      expect(project.chapters.length, `${project.slug} chapters`).toBeGreaterThanOrEqual(6);
      expect(project.tier).toBe(1);
    }
  });

  it('gives every archive project a real presentation, never a stub', () => {
    for (const project of archiveProjects) {
      expect(project.chapters.length, `${project.slug} chapters`).toBeGreaterThanOrEqual(3);
    }
  });

  it('resolves each slug and wraps around for next-project', () => {
    for (const project of projects) {
      expect(getProject(project.slug)?.slug).toBe(project.slug);
      const next = getNextProject(project.slug);
      expect(next.slug).not.toBe(project.slug);
    }
  });

  it('gives every project a distinct accent colour', () => {
    const accents = projects.map((p) => p.accent.toLowerCase());
    expect(new Set(accents).size).toBe(accents.length);
  });

  it('never ships placeholder or "coming soon" copy', () => {
    const forbidden = /coming soon|lorem ipsum|tbd|todo|placeholder text/i;
    const serialised = JSON.stringify(projects);
    expect(serialised).not.toMatch(forbidden);
  });

  it('provides both locales for every localised field', () => {
    for (const project of projects) {
      for (const locale of locales) {
        expect(project.headline[locale], `${project.slug}.headline.${locale}`).toBeTruthy();
        expect(project.summary[locale]).toBeTruthy();
        expect(project.problem[locale]).toBeTruthy();
        expect(project.outcome[locale]).toBeTruthy();
        expect(project.seo.title[locale]).toBeTruthy();
        expect(project.seo.description[locale]).toBeTruthy();
        for (const chapter of project.chapters) {
          expect(chapter.title[locale], `${project.slug}/${chapter.id}`).toBeTruthy();
        }
      }
    }
  });

  it('keeps every external link absolute and https', () => {
    for (const project of projects) {
      for (const link of project.links) {
        expect(link.href).toMatch(/^https:\/\//);
        expect(link.external).toBe(true);
      }
    }
  });
});

describe('honesty constraints', () => {
  /**
   * The portfolio must never carry an unverifiable metric. These are the shapes
   * a fabricated claim would most likely take.
   */
  it('states no user counts, revenue or percentage metrics', () => {
    const serialised = JSON.stringify(projects);
    // e.g. "10,000 users", "40% faster", "$50k revenue", "99.9% uptime"
    expect(serialised).not.toMatch(/\d[\d,.]*\s*(users|customers|merchants|downloads)\b/i);
    expect(serialised).not.toMatch(/\d+(\.\d+)?%\s*(faster|uptime|accuracy|increase|growth)/i);
    expect(serialised).not.toMatch(/\$\s?\d/);
  });

  it('never claims an unverifiable ranking', () => {
    const serialised = JSON.stringify({ projects, en, ar });
    expect(serialised).not.toMatch(/(iraq'?s|the)\s+#?1\s+(portfolio|developer|engineer)/i);
    expect(serialised).not.toMatch(/best\s+(developer|engineer)\s+in\s+iraq/i);
  });

  it('only claims the two awards that are documented', () => {
    const serialised = JSON.stringify(projects).toLowerCase();
    const awardMentions = serialised.match(/\d(st|nd|rd|th) place/g) ?? [];
    for (const mention of awardMentions) {
      expect(['1st place', '2nd place']).toContain(mention);
    }
  });
});

describe('dictionary completeness', () => {
  /**
   * Prose arrays whose two locales are allowed to hold a different number of
   * paragraphs.
   *
   * Everywhere else, a length mismatch is a missing translation and the test
   * below is what catches it. These are the exception: the home page was
   * authored twice rather than translated once, and the same argument is split
   * into a different number of paragraphs on each side — the Arabic Background
   * runs five where the English runs six, and the Arabic results section
   * deliberately carries no support line at all.
   *
   * Structure is still enforced inside them: every element is compared for
   * shape, only the count is exempt. Anything nested under a listed path — the
   * `items` array of a section, say — is *not* exempt, because these are exact
   * paths, not prefixes.
   */
  const PROSE_LENGTH_MAY_DIFFER = new Set([
    'dict.home.background.paragraphs',
    'dict.home.results.note',
    'dict.home.process.steps[3].text',
    'dict.home.cases.items[0].paragraphs',
    'dict.home.cases.items[2].paragraphs',
  ]);

  /**
   * The Arabic dictionary is type-checked for shape, but array *lengths* are
   * widened by the type. This asserts they match item for item.
   */
  it('matches the English dictionary structure exactly', () => {
    const problems: string[] = [];

    function compare(a: unknown, b: unknown, path: string) {
      if (Array.isArray(a) || Array.isArray(b)) {
        if (!Array.isArray(a) || !Array.isArray(b)) {
          problems.push(`${path}: array/non-array mismatch`);
          return;
        }
        if (a.length !== b.length && !PROSE_LENGTH_MAY_DIFFER.has(path)) {
          problems.push(`${path}: length ${a.length} (en) vs ${b.length} (ar)`);
          return;
        }
        if (a.length !== b.length) {
          /* Exempt: nothing to pair up, and every element is a bare string. */
          for (const [index, item] of [...a, ...b].entries()) {
            if (typeof item !== 'string') {
              problems.push(`${path}[${index}]: exempt paths may only hold strings`);
            }
          }
          return;
        }
        a.forEach((item, index) => compare(item, b[index], `${path}[${index}]`));
        return;
      }
      if (typeof a === 'object' && a !== null) {
        if (typeof b !== 'object' || b === null) {
          problems.push(`${path}: object/non-object mismatch`);
          return;
        }
        const aKeys = Object.keys(a).sort();
        const bKeys = Object.keys(b as object).sort();
        if (aKeys.join(',') !== bKeys.join(',')) {
          problems.push(`${path}: keys differ — en[${aKeys}] vs ar[${bKeys}]`);
          return;
        }
        for (const key of aKeys) {
          compare(
            (a as Record<string, unknown>)[key],
            (b as Record<string, unknown>)[key],
            `${path}.${key}`,
          );
        }
        return;
      }
      if (typeof a !== typeof b) problems.push(`${path}: type ${typeof a} vs ${typeof b}`);
    }

    compare(en, ar, 'dict');
    expect(problems).toEqual([]);
  });

  it('leaves no Arabic string empty or untranslated-by-copy', () => {
    const untranslated: string[] = [];

    /**
     * Language-switch labels are deliberately identical across locales: each is
     * written in the language it switches *to*, which is the accessible way to
     * label a language switch.
     */
    const intentionallyIdentical = new Set([
      'dict.common.switchToArabic',
      'dict.common.switchToEnglish',
    ]);

    function walk(enNode: unknown, arNode: unknown, path: string) {
      if (typeof enNode === 'string' && typeof arNode === 'string') {
        expect(arNode.trim(), `${path} is empty`).not.toBe('');
        // Technical tokens and Latin brand names are legitimately identical.
        const isTechnical =
          /^[\x20-\x7E]+$/.test(enNode) &&
          (enNode.length < 30 || /API|SQL|Core|CSS|JS|RTL|LTR/.test(enNode));
        if (enNode === arNode && !isTechnical && !intentionallyIdentical.has(path)) {
          untranslated.push(path);
        }
        return;
      }
      if (Array.isArray(enNode) && Array.isArray(arNode)) {
        enNode.forEach((item, index) => walk(item, arNode[index], `${path}[${index}]`));
        return;
      }
      if (typeof enNode === 'object' && enNode !== null && typeof arNode === 'object' && arNode !== null) {
        for (const key of Object.keys(enNode)) {
          walk(
            (enNode as Record<string, unknown>)[key],
            (arNode as Record<string, unknown>)[key],
            `${path}.${key}`,
          );
        }
      }
    }

    walk(en, ar, 'dict');
    expect(untranslated).toEqual([]);
  });
});

describe('stylesheet hygiene', () => {
  const css = readFileSync(new URL('../../src/app/globals.css', import.meta.url), 'utf8');

  /**
   * Component classes must never be named after a Tailwind utility.
   *
   * `utilities` beats `components` in Tailwind v4's layer order, so a shared
   * name collides in both directions and neither side errors. `.container` and
   * `.grid` shipped like this: Tailwind's `container` silently replaced the
   * site's 1080px measure with its own breakpoint ladder, and the site's
   * `.grid` imposed three columns on all fifteen elements that only wanted
   * `display: grid`. Both were invisible until someone measured a tablet.
   */
  it('does not name a component class after a core Tailwind utility', () => {
    const reserved = new Set([
      'container', 'grid', 'flex', 'block', 'inline', 'table', 'hidden', 'contents',
      'isolate', 'static', 'fixed', 'absolute', 'relative', 'sticky', 'visible',
      'invisible', 'collapse', 'truncate', 'italic', 'underline', 'overline',
      'uppercase', 'lowercase', 'capitalize', 'antialiased', 'border', 'outline',
      'ring', 'shadow', 'blur', 'grayscale', 'invert', 'sepia', 'transform',
      'filter', 'transition', 'resize', 'group', 'peer', 'dark',
    ]);

    const components = css.slice(css.indexOf('@layer components {'));
    const declared = new Set(
      [...components.matchAll(/^\s*\.([a-z][\w-]*)/gm)].map((match) => match[1]!),
    );

    // Guard the guard: a regex that matched nothing would pass this silently.
    expect(declared.size, 'no component classes were parsed — the test is vacuous').toBeGreaterThan(20);
    expect(declared.has('shell'), 'expected .shell to be parsed').toBe(true);

    expect([...declared].filter((name) => reserved.has(name))).toEqual([]);
  });

  /**
   * Every showcase id must draw its own face.
   *
   * `FanCardArt` keys on `variant ?? slug` and falls through to the project's
   * single face when an id has no `case`. Three of them did, so IMMAR's case
   * study showed one identical picture under three captions describing three
   * different screens — a caption over an image of something else, which no
   * rendering test can see and which the honesty rules forbid.
   *
   * `generic-api` is the one deliberate exception: the `default` branch draws a
   * request lifecycle, which is what that id means.
   */
  it('gives every showcase id its own face', () => {
    const art = readFileSync(
      new URL('../../src/components/home/FanCardArt.tsx', import.meta.url),
      'utf8',
    );
    const cases = new Set(
      [...art.matchAll(/case '([a-z0-9-]+)':/g)].map((match) => match[1]!),
    );

    expect(cases.size, 'no cases parsed — the test is vacuous').toBeGreaterThan(8);

    const missing = showcaseSchema.options.filter(
      (id) => id !== 'generic-api' && !cases.has(id),
    );
    expect(missing, 'these showcase ids fall through to another face').toEqual([]);
  });

  /**
   * `text-[var(--x)]` is ambiguous in Tailwind v4 — it cannot tell a colour from
   * a font size in a bare `var()`, and silently drops the declaration.
   */
  it('never uses a bare var() in an arbitrary text utility', () => {
    /*
     * `readdirSync({ recursive })` rather than `fs.globSync`, which only
     * arrived in Node 22 — this package supports >=20.9.0, and CI runs 20, so
     * globSync passed locally and threw there.
     */
    const sources = readdirSync('src', { recursive: true, encoding: 'utf8' })
      .filter((entry) => entry.endsWith('.tsx'))
      .map((entry) => path.join('src', entry));
    const offenders = sources.filter((file) =>
      /text-\[var\(/.test(readFileSync(file, 'utf8')),
    );
    expect(offenders).toEqual([]);
  });
});
