/**
 * Build the served image set from the source-of-truth exports.
 *
 *   node scripts/optimize-images.mjs          # write public/img/
 *   node scripts/optimize-images.mjs --check  # report only, change nothing
 *
 * `docs/pixel-portfolio-style/assets/img/` holds the full-resolution PNG
 * exports and is documentation — it is never served. This writes the shipped
 * copies into `public/img/`, right-sized and re-encoded.
 *
 * Two rules decide the output:
 *
 * 1. WIDTH is twice the widest variant `next/image` will ever request, floored
 *    at the target in `IMAGES.md`. The slots are fixed-size, so that number is
 *    knowable rather than a guess — a 210px fan slot resolves to a 640px
 *    variant at 2x, so an 840px source covers every device pixel ratio up to 4
 *    and anything beyond it is bytes the pipeline can never use. Each entry
 *    records its own arithmetic.
 *
 * 2. FORMAT is WebP, because `next/image` re-encodes to AVIF/WebP on request
 *    and only ever reads these as input. The one exception is the social card:
 *    it is referenced as a bare URL in `og:image`, never passed through the
 *    optimizer, and scraper support for WebP is uneven — so it stays a PNG and
 *    is merely recompressed. Note that alpha is *not* a reason to keep a PNG
 *    anywhere; WebP carries an alpha channel perfectly well.
 *
 * Quality 90: measured against the current 1086px PNGs at the 640px variant
 * the browser actually receives, q90 differs by 1.7/255 mean and q95 by
 * 1.6/255 — the residual is the intermediate resample, not the codec, so
 * paying for q95 buys nothing. These are re-encoded to AVIF at q75 downstream
 * regardless.
 */
import sharp from 'sharp';
import { readdir, mkdir, stat, unlink, writeFile } from 'node:fs/promises';
import path from 'node:path';

const SRC = path.join(process.cwd(), 'docs', 'pixel-portfolio-style', 'assets', 'img');
const OUT = path.join(process.cwd(), 'public', 'img');
const CHECK = process.argv.includes('--check');

const QUALITY = 90;

/**
 * Width ladder for the pre-rendered variants.
 *
 * On Cloudflare there is no request-time optimizer: `next/image`'s default
 * loader is the Vercel Image Optimization API, which does not exist on a
 * Worker. Rather than surrender the sizing with `images.unoptimized` — which
 * would ship the full 840px source into a 210px slot — every width the site
 * can request is rendered here, ahead of time, and `src/lib/image-loader.ts`
 * points at them.
 *
 * The rungs are not generic: they are the fixed slots this design actually
 * uses (40px avatar, 168/210px fan, 260/338px cutout) at 1x/2x/3x, snapped to
 * the `imageSizes`/`deviceSizes` arrays declared in `next.config.ts`. Both
 * lists must stay in sync with this one — the loader can only return a file
 * that exists, so a width Next requests but this never wrote would 404.
 *
 * The top three rungs are the case-study hero, which is a different order of
 * slot from everything above it: it runs the full 1080px `.shell` measure
 * rather than a 210px card, so 1080 is its 1x, 1920 is as close to 2x as any
 * supplied export reaches, and 1440 is the rung in between that keeps a
 * mid-DPR screen from jumping straight to the largest file.
 *
 * Variants wider than the source are skipped rather than upscaled. That is the
 * mechanism the no-upscale rule rests on: a 1125px export simply has no 1440
 * or 1920 rung, and the loader clamps a request for one down to the widest
 * file that genuinely exists.
 */
const LADDER = [64, 128, 168, 210, 256, 338, 420, 640, 750, 840, 1080, 1440, 1920];

/**
 * Everything the site actually references. A file in `SRC` that is not listed
 * here is deliberately not shipped — `fan-3.png` is a second Sendy composition
 * with no slot of its own, because a project cannot appear twice in the fan
 * without duplicating its link.
 *
 * The two `fan-*` entries with no file yet are pre-registered so a dropped-in
 * export is picked up by re-running this, with no edit here.
 */
const MANIFEST = [
  {
    file: 'avatar.png',
    out: 'avatar.webp',
    width: 256,
    // 40px disc -> 96px at 2x is the widest variant emitted. IMAGES.md floors it at 160.
    why: '40px slot, 96px widest variant, 160px manifest floor',
  },
  ...['fan-1', 'fan-2', 'fan-4', 'fan-5', 'fan-6', 'fan-form-builder', 'fan-nano-ocr'].map(
    (name) => ({
      file: `${name}.png`,
      out: `${name}.webp`,
      width: 840,
      // 210px slot -> 640px at 2x. 840 is the IMAGES.md target and covers 4x.
      why: '210px slot, 640px widest variant, 840px manifest target',
      optional: name.startsWith('fan-form') || name.startsWith('fan-nano'),
    }),
  ),
  {
    file: 'me-cutout.png',
    out: 'me-cutout.webp',
    width: 800,
    // 338px display width -> 750px variant at 2x.
    why: '338px display, 750px widest variant',
  },
  /*
   * Case-study heroes.
   *
   * These break the arithmetic every entry above them follows, and the break is
   * deliberate rather than an oversight. Rule 1 asks for twice the widest
   * requested variant — 2160px for a 1080px slot — and not one of the four
   * supplied exports reaches it. So each `width` is the SOURCE width instead:
   * `withoutEnlargement` means a larger number would be a no-op that merely
   * misreports the intent, and a smaller one would throw away pixels that were
   * supplied. Each entry records how far short of 2x it actually lands.
   *
   * They are also the only entries here that are not full-bleed art: all four
   * are presentation renders that carry their own background and their own
   * drop shadow, baked in. That is why the hero drops the card chrome when one
   * is present — see the `heroImage` branch in `work/[slug]/page.tsx`.
   */
  {
    file: 'sendy-dashboard.png',
    out: 'hero-sendy.webp',
    width: 1125,
    why: '1080px hero slot — 1125px source is 1.04x, short of 2x',
  },
  {
    file: 'Immar-dashboard.png',
    out: 'hero-immar.webp',
    width: 1920,
    why: '1080px hero slot — 1920px source is 1.78x, short of 2x',
  },
  {
    file: 'al-tafawuq-dashboard.png',
    out: 'hero-al-tafawuq.webp',
    width: 1254,
    why: '1080px hero slot — 1254px source is 1.16x, short of 2x',
  },
  {
    file: 'bank.png',
    out: 'hero-virtual-banking.webp',
    width: 1920,
    why: '1080px hero slot — 1920px source is 1.78x, short of 2x',
  },
  {
    file: 'og.png',
    out: 'og.png',
    width: 1200,
    format: 'png',
    why: 'social card — bare URL in og:image, never passed through next/image',
  },
];

const kb = (bytes) => `${(bytes / 1024).toFixed(0)}K`;

async function sizeOf(file) {
  try {
    return (await stat(file)).size;
  } catch {
    return 0;
  }
}

await mkdir(OUT, { recursive: true });

/* Measured across the whole directory, so removed files count toward the saving. */
const existing = await readdir(OUT).catch(() => []);
let before = 0;
for (const file of existing) before += await sizeOf(path.join(OUT, file));

let after = 0;
const written = new Set();
const missing = [];
const rows = [];
/* `public/img/fan-1.webp` -> [210, 420, 640, 840]; consumed by the loader module. */
const variants = new Map();

for (const entry of MANIFEST) {
  const from = path.join(SRC, entry.file);
  const to = path.join(OUT, entry.out);

  if ((await sizeOf(from)) === 0) {
    if (!entry.optional) missing.push(entry.file);
    continue;
  }

  const source = sharp(from);
  const meta = await source.metadata();
  const pipeline = source.resize({ width: entry.width, withoutEnlargement: true });
  const buffer =
    entry.format === 'png'
      ? await pipeline.png({ compressionLevel: 9, effort: 10 }).toBuffer()
      : await pipeline.webp({ quality: QUALITY, effort: 6 }).toBuffer();

  const out = await sharp(buffer).metadata();
  const previous = await sizeOf(to);
  after += buffer.length;
  written.add(entry.out);

  if (!CHECK) await writeFile(to, buffer);

  /*
   * The social card is referenced as a bare URL and never reaches the loader,
   * so it gets no ladder — the one entry that opts out.
   */
  if (entry.format !== 'png') {
    const stem = entry.out.replace(/\.webp$/, '');
    const rungs = LADDER.filter((w) => w <= out.width);

    /*
     * The source width is always a rung, even when the ladder stops short of
     * it. Without it the widest variant Next can request would resolve to a
     * narrower file than the one the design was measured against.
     */
    if (!rungs.includes(out.width)) rungs.push(out.width);

    for (const width of rungs) {
      const name = `${stem}-${width}.webp`;
      const variant = await sharp(buffer)
        .resize({ width, withoutEnlargement: true })
        .webp({ quality: QUALITY, effort: 6 })
        .toBuffer();

      if (!CHECK) await writeFile(path.join(OUT, name), variant);
      written.add(name);
      after += variant.length;
    }

    variants.set(entry.out, rungs);
  }

  rows.push(
    `  ${entry.out.padEnd(22)} ${String(meta.width).padStart(4)}x${String(meta.height).padEnd(5)} -> ` +
      `${String(out.width).padStart(4)}x${String(out.height).padEnd(5)} ` +
      `${kb(previous || 0).padStart(6)} -> ${kb(buffer.length).padStart(6)}   ${entry.why}`,
  );
}

/*
 * Emit the width table the loader resolves against.
 *
 * Generated rather than hand-kept: the loader must never name a file this
 * script did not write, and the only way to guarantee that is to derive one
 * from the other.
 */
if (!CHECK && variants.size) {
  const entries = [...variants.entries()]
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([file, widths]) => `  '/img/${file}': [${widths.join(', ')}],`)
    .join('\n');

  await writeFile(
    path.join(process.cwd(), 'src', 'lib', 'image-variants.ts'),
    `/* Generated by scripts/optimize-images.mjs — do not edit by hand. */\n\n` +
      `export const IMAGE_VARIANTS: Record<string, number[]> = {\n${entries}\n};\n`,
    'utf8',
  );
}

/*
 * Anything in public/img that the manifest no longer produces is stale.
 *
 * Guarded on having written something first: this directory is script-owned and
 * the sweep is unconditional, so a missing or renamed source folder would
 * otherwise resolve to "nothing belongs here" and quietly empty the served set.
 */
const stale = written.size ? (await readdir(OUT)).filter((f) => !written.has(f)) : [];
if (!written.size) {
  console.error(`\n  Refusing to sweep public/img — nothing was generated. Is ${SRC} present?\n`);
  process.exitCode = 1;
}
for (const file of stale) {
  if (!CHECK) await unlink(path.join(OUT, file));
}

console.log(`\n${CHECK ? 'Would write' : 'Wrote'} ${written.size} files to public/img/\n`);
console.log(rows.join('\n'));
if (stale.length) console.log(`\n  ${CHECK ? 'stale' : 'removed'}: ${stale.join(', ')}`);
if (missing.length) console.log(`\n  MISSING from ${path.relative(process.cwd(), SRC)}: ${missing.join(', ')}`);
console.log(
  `\n  public/img total: ${kb(before)} -> ${kb(after)}` +
    (before ? ` (${(100 - (after / before) * 100).toFixed(1)}% smaller)` : '') +
    '\n',
);
