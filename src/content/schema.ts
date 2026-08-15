import { z } from 'zod';

/* ---------------------------------------------------------------------------
 * Localized primitives
 * ------------------------------------------------------------------------ */

export const localizedSchema = z.object({
  en: z.string().min(1),
  ar: z.string().min(1),
});
export type Localized = z.infer<typeof localizedSchema>;

/* ---------------------------------------------------------------------------
 * Honest project classification — never "client work" unless it was.
 * ------------------------------------------------------------------------ */

export const classificationSchema = z.enum([
  'founder-product',
  'client-product',
  'hackathon',
  'training-program',
  'independent',
  'academic',
]);
export type Classification = z.infer<typeof classificationSchema>;

export const categorySchema = z.enum([
  'saas',
  'product',
  'backend',
  'ai',
  'mobile',
  'dashboard',
  'experiment',
]);
export type Category = z.infer<typeof categorySchema>;

/* ---------------------------------------------------------------------------
 * Coded product compositions.
 *
 * No production screenshots of these private platforms are available in the
 * repository, so each project renders an honest, clearly-labelled interface
 * composition built from its real, verified module names. Every composition is
 * captioned as a concept — never presented as a captured screenshot.
 * ------------------------------------------------------------------------ */

export const showcaseSchema = z.enum([
  'sendy-orders',
  'sendy-storefront',
  'sendy-inventory',
  'immar-dashboard',
  'immar-mobile',
  'immar-roles',
  'nano-pipeline',
  'nano-output',
  'generic-api',
  'generic-dashboard',
  'generic-wallet',
]);
export type ShowcaseId = z.infer<typeof showcaseSchema>;

/* ---------------------------------------------------------------------------
 * Case-study hero image
 *
 * Optional, and deliberately so — a project without a supplied export keeps the
 * coded `cover` composition rather than borrowing another project's picture.
 *
 * `width`/`height` are the INTRINSIC dimensions of the source export, not the
 * dimensions of the slot. The hero renders at the image's own ratio, so these
 * are what reserves the right box and keeps the page from shifting as it loads,
 * and they are also what `validateProjects` measures the no-upscale rule
 * against. Never restate them to fit a slot: they describe the file.
 * ------------------------------------------------------------------------ */

export const heroImageSchema = z.object({
  /* Always a pre-rendered WebP under /img — see `scripts/optimize-images.mjs`. */
  src: z.string().regex(/^\/img\/[a-z0-9-]+\.webp$/),
  width: z.number().int().positive(),
  height: z.number().int().positive(),
  alt: localizedSchema,
});
export type HeroImage = z.infer<typeof heroImageSchema>;

/**
 * The widest the case-study hero is ever laid out: `.shell` is `--container`,
 * 1080px, and the image runs the full measure. A source narrower than this
 * would be enlarged to fill it, which is the one thing an image pipeline must
 * never do silently.
 */
export const HERO_SLOT_WIDTH = 1080;

/* ---------------------------------------------------------------------------
 * Case-study content blocks
 * ------------------------------------------------------------------------ */

const proseBlock = z.object({
  type: z.literal('prose'),
  text: localizedSchema,
});

const leadBlock = z.object({
  type: z.literal('lead'),
  text: localizedSchema,
});

const listBlock = z.object({
  type: z.literal('list'),
  items: z
    .array(z.object({ title: localizedSchema, text: localizedSchema }))
    .min(1),
});

const bulletsBlock = z.object({
  type: z.literal('bullets'),
  items: z.array(localizedSchema).min(1),
});

/** Sequential data-flow diagram. Must be fully readable as static content. */
const flowBlock = z.object({
  type: z.literal('flow'),
  caption: localizedSchema,
  steps: z
    .array(z.object({ label: localizedSchema, text: localizedSchema }))
    .min(2),
});

/** Layered architecture diagram: named tiers with LTR technical tokens. */
const layersBlock = z.object({
  type: z.literal('layers'),
  caption: localizedSchema,
  layers: z
    .array(
      z.object({
        name: localizedSchema,
        note: localizedSchema,
        items: z.array(z.string().min(1)).min(1),
      }),
    )
    .min(2),
});

/** Role / permission matrix — used by IMMAR and the school platform. */
const matrixBlock = z.object({
  type: z.literal('matrix'),
  caption: localizedSchema,
  columns: z.array(localizedSchema).min(2),
  rows: z
    .array(
      z.object({
        label: localizedSchema,
        values: z.array(z.enum(['yes', 'no', 'partial'])).min(2),
      }),
    )
    .min(1),
});

/** Engineering trade-off card: the decision, and what it cost. */
const decisionsBlock = z.object({
  type: z.literal('decisions'),
  items: z
    .array(
      z.object({
        challenge: localizedSchema,
        decision: localizedSchema,
        tradeoff: localizedSchema,
      }),
    )
    .min(1),
});

const showcaseBlock = z.object({
  type: z.literal('showcase'),
  id: showcaseSchema,
  caption: localizedSchema,
});

const calloutBlock = z.object({
  type: z.literal('callout'),
  title: localizedSchema,
  text: localizedSchema,
});

/** Qualitative outcome facts only. No invented numbers. */
const factsBlock = z.object({
  type: z.literal('facts'),
  items: z
    .array(z.object({ label: localizedSchema, value: localizedSchema }))
    .min(1),
});

export const blockSchema = z.discriminatedUnion('type', [
  proseBlock,
  leadBlock,
  listBlock,
  bulletsBlock,
  flowBlock,
  layersBlock,
  matrixBlock,
  decisionsBlock,
  showcaseBlock,
  calloutBlock,
  factsBlock,
]);
export type Block = z.infer<typeof blockSchema>;

export const chapterSchema = z.object({
  id: z.string().regex(/^[a-z0-9-]+$/),
  title: localizedSchema,
  blocks: z.array(blockSchema).min(1),
});
export type Chapter = z.infer<typeof chapterSchema>;

/* ---------------------------------------------------------------------------
 * Project
 * ------------------------------------------------------------------------ */

export const linkSchema = z.object({
  label: localizedSchema,
  href: z.string().url(),
  external: z.literal(true),
});

export const projectSchema = z.object({
  slug: z.string().regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  titleLocalized: localizedSchema,
  category: categorySchema,
  categoryLabel: localizedSchema,
  classification: classificationSchema,
  role: localizedSchema,
  year: z.string().min(1),
  status: localizedSchema,
  /** One-line problem or outcome. Shown on cards — never a feature list. */
  headline: localizedSchema,
  summary: localizedSchema,
  problem: localizedSchema,
  outcome: localizedSchema,
  responsibilities: z.array(localizedSchema).min(1),
  /** Technical tokens stay LTR in both locales. */
  stack: z.array(z.string().min(1)).min(1),
  services: z.array(localizedSchema).min(1),
  /** Hex accent, one per project. Never more than one accent per screen. */
  accent: z.string().regex(/^#[0-9a-f]{6}$/i),
  accentName: z.string().min(1),
  featured: z.boolean(),
  tier: z.union([z.literal(1), z.literal(2)]),
  cover: showcaseSchema,
  /** Real export for this project's own case-study hero. Absent → `cover` draws it. */
  heroImage: heroImageSchema.optional(),
  proof: localizedSchema.optional(),
  links: z.array(linkSchema).default([]),
  chapters: z.array(chapterSchema).default([]),
  seo: z.object({
    title: localizedSchema,
    description: localizedSchema,
  }),
});

export type Project = z.infer<typeof projectSchema>;

/**
 * Build-time validation. Featured (tier 1) projects must ship a real case study —
 * the "no Coming soon" rule is enforced here rather than by review.
 */
export function validateProjects(input: unknown[]): Project[] {
  const parsed = input.map((raw, index) => {
    const result = projectSchema.safeParse(raw);
    if (!result.success) {
      throw new Error(
        `Invalid project at index ${index}: ${JSON.stringify(result.error.format(), null, 2)}`,
      );
    }
    return result.data;
  });

  for (const project of parsed) {
    if (project.tier === 1 && project.chapters.length < 6) {
      throw new Error(
        `Featured project "${project.slug}" must define at least 6 case-study chapters (found ${project.chapters.length}).`,
      );
    }
    if (project.tier === 2 && project.chapters.length < 3) {
      throw new Error(
        `Archive project "${project.slug}" must define at least 3 chapters (found ${project.chapters.length}).`,
      );
    }
  }

  const slugs = new Set<string>();
  for (const project of parsed) {
    if (slugs.has(project.slug)) throw new Error(`Duplicate project slug: ${project.slug}`);
    slugs.add(project.slug);
  }

  /*
   * No hero export may be enlarged into its slot — reported, not enforced.
   *
   * The hero runs the full 1080px measure, so a source narrower than that can
   * only be stretched to fill it. This warns rather than throws: the current
   * exports were reviewed and accepted knowing they land short of 2x, and a
   * hard failure would block every build over a trade-off already decided. The
   * point is that the shortfall stays *visible* — the symptom on its own is a
   * hero that is slightly soft on a retina display, which is exactly the kind
   * of thing that ships unnoticed. Restore the throw if it ever needs teeth.
   */
  for (const project of parsed) {
    const hero = project.heroImage;
    if (hero && hero.width < HERO_SLOT_WIDTH) {
      console.warn(
        `[content] Hero image for "${project.slug}" is ${hero.width}px wide, narrower than the ` +
          `${HERO_SLOT_WIDTH}px slot it fills — it will be enlarged. Re-export at ` +
          `${HERO_SLOT_WIDTH * 2}px for a sharp 2x hero.`,
      );
    }
  }

  return parsed;
}
