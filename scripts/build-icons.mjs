/**
 * Derive the favicon / home-screen icon set from the illustrated avatar.
 *
 *   node scripts/build-icons.mjs [--sheet]
 *
 * The mark is the same face as the nav pill, not the M monogram — but it is not
 * the avatar downscaled. A straight resize of `avatar.png` to 16px is unusable:
 * the hair highlights, the brow hatching and the stippled beard are all drawn at
 * a weight that survives 256px and nothing smaller, so at 16 they average out to
 * three grey values and the face reads as a smudge under a dark cap.
 *
 * So this builds a *simplified* master first and resamples that. Four steps:
 *
 *   1. SEGMENT the illustration into head silhouette and ink.
 *   2. SIMPLIFY the ink — see `simplify`, which is where the work happens.
 *   3. SEAT the result on a disc with a ring, cropped like an avatar.
 *   4. EMIT six sizes, with the small end corrected separately.
 *
 * ---------------------------------------------------------------------------
 * The master it reads was flattened against a transparency checkerboard, so the
 * "background" is a neutral 245/254 alternation rather than a flat colour. The
 * face fill sits in the same luminance band but is a warm cream, ~13 points of
 * saturation off neutral. Luminance alone cannot separate them; luminance AND
 * neutrality can, and a flood fill from the border does the rest.
 */
import sharp from 'sharp';
import { mkdir, writeFile } from 'node:fs/promises';

const SRC = 'docs/pixel-portfolio-style/assets/img/avatar.png';
const PUBLIC_ICONS = 'public/icons';
const APP = 'src/app';
const REVIEW = 'docs/screenshots/icons';

/* Site tokens. The disc is `--color-surface` because that is exactly what the
 * nav pill puts behind this face; the ring is `--color-ink`. */
const INK = [0x11, 0x11, 0x11];
const PAPER = [0xf7, 0xf3, 0xee];
const DISC = [0xf2, 0xf2, 0xf2];

/* Simplification. See `simplify` for what each of these actually controls.
 * SMALL and FILL are env-overridable because they are the two that were worth
 * sweeping to settle, and will be again if the source illustration changes. */
const SMALL = Number(process.env.ICON_SMALL ?? 64);
const THRESH = 140;
const BEARD_THRESH = 20;
const BEARD_AT = 0.5;
const SMOOTH_SIGMA = 9;

/* ---------- mask primitives ----------------------------------------------- */

/** Everything the border cannot reach through `!mask`. */
function fillHoles(mask, w, h) {
  const outside = new Uint8Array(w * h);
  const stack = [];
  const push = (i) => { if (!mask[i] && !outside[i]) { outside[i] = 1; stack.push(i); } };
  for (let x = 0; x < w; x++) { push(x); push((h - 1) * w + x); }
  for (let y = 0; y < h; y++) { push(y * w); push(y * w + w - 1); }
  while (stack.length) {
    const p = stack.pop();
    const x = p % w, y = (p / w) | 0;
    if (x > 0) push(p - 1);
    if (x < w - 1) push(p + 1);
    if (y > 0) push(p - w);
    if (y < h - 1) push(p + w);
  }
  const out = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) out[i] = outside[i] ? 0 : 1;
  return out;
}

/* ---------- ICO container -------------------------------------------------- */

/**
 * PNG-in-ICO. Every browser since IE11 and every Windows since Vista reads it,
 * and it keeps the 48px entry from bloating the file the way a BMP payload
 * would. Header is 6 bytes, each directory entry 16, payloads follow.
 */
function buildIco(entries) {
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(entries.length, 4);

  let offset = 6 + entries.length * 16;
  const dir = [];
  for (const { size, png } of entries) {
    const e = Buffer.alloc(16);
    e.writeUInt8(size >= 256 ? 0 : size, 0); // 0 means 256
    e.writeUInt8(size >= 256 ? 0 : size, 1);
    e.writeUInt8(0, 2); // palette count
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(png.length, 8);
    e.writeUInt32LE(offset, 12);
    offset += png.length;
    dir.push(e);
  }
  return Buffer.concat([header, ...dir, ...entries.map((e) => e.png)]);
}

/* ---------- segment -------------------------------------------------------- */

const { data, info } = await sharp(SRC).raw().toBuffer({ resolveWithObject: true });
const W = info.width, H = info.height, C = info.channels;
const N = W * H;

const bgish = new Uint8Array(N);
const inkRaw = new Uint8Array(N);
for (let i = 0; i < N; i++) {
  const r = data[i * C], g = data[i * C + 1], b = data[i * C + 2];
  const lum = r * 0.299 + g * 0.587 + b * 0.114;
  const sat = Math.max(r, g, b) - Math.min(r, g, b);
  bgish[i] = lum > 235 && sat < 6 ? 1 : 0;
  inkRaw[i] = lum < 128 ? 1 : 0;
}

const head = fillHoles(Uint8Array.from(bgish, (v) => (v ? 0 : 1)), W, H);

/* Head extent, needed before simplification to place the beard line. */
let hMinY = H, hMaxY = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (head[y * W + x]) { if (y < hMinY) hMinY = y; if (y > hMaxY) hMaxY = y; break; }
  }
}
const headH = hMaxY - hMinY + 1;

/* ---------- simplify ------------------------------------------------------- */

/**
 * Simplify by throwing the mask down to a small raster and back up.
 *
 * This replaced a morphological pass (close → despeckle → dilate), which could
 * not do the job. Morphology only knows radius, and radius is the wrong
 * question: the beard stipple and the cheek flecks are drawn at the same dot
 * size, so any radius that welds the beard shut also welds the flecks into
 * blotches, and any radius that spares the flecks leaves the beard as loose
 * dots. Resampling asks about ink coverage per cell instead, which separates
 * them cleanly — the beard is dense and survives, the flecks are sparse and go.
 *
 * `SMALL` is the real simplification control. It is the resolution at which the
 * decision "does this detail exist" gets made, so it sets how much face is left:
 * at 96 the ear cartilage and the nose ridge still come through and the 16px
 * render is noise again; at 48 the brows go and it stops being a face.
 *
 * The threshold splits at the mouth because the two halves need opposite
 * treatment. Above it the ink is line work — brows, eyes, the nose — drawn dark
 * and thin, so it clears a high threshold. Below it the ink is texture, and the
 * beard's coverage is low enough that it needs a threshold near the floor to
 * register at all. One threshold for both either fuses the upper face into a bar
 * or loses the beard; measured on this master, there is no value that does
 * neither.
 */
async function simplify(mask, thresh, beardThresh = thresh, beardAt = 1) {
  const gray = Buffer.alloc(N);
  for (let i = 0; i < N; i++) gray[i] = mask[i] ? 255 : 0;

  const down = await sharp(gray, { raw: { width: W, height: H, channels: 1 } })
    .resize(SMALL, SMALL, { fit: 'fill', kernel: 'lanczos3' })
    .raw()
    .toBuffer({ resolveWithObject: true });

  const bin = Buffer.alloc(SMALL * SMALL);
  const split = ((hMinY + headH * beardAt) / H) * SMALL;
  for (let i = 0; i < SMALL * SMALL; i++) {
    const t = ((i / SMALL) | 0) >= split ? beardThresh : thresh;
    bin[i] = down.data[i * down.info.channels] >= t ? 255 : 0;
  }

  /* Back up, with a blur wide enough to round off the cell corners. Without it
   * the mark carries a visible 20px staircase at 512, which reads as an artefact
   * rather than as the pixel idiom the rest of the site uses deliberately. */
  const up = await sharp(bin, { raw: { width: SMALL, height: SMALL, channels: 1 } })
    .resize(W, H, { fit: 'fill', kernel: 'lanczos3' })
    .blur(SMOOTH_SIGMA)
    .raw()
    .toBuffer({ resolveWithObject: true });

  const out = new Uint8Array(N);
  for (let i = 0; i < N; i++) out[i] = up.data[i * up.info.channels] > 127 ? 1 : 0;
  return out;
}

const ink = await simplify(inkRaw, THRESH, BEARD_THRESH, BEARD_AT);
const silhouette = await simplify(head, 128);
/* The outline must not leak past the silhouette it outlines. */
for (let i = 0; i < N; i++) if (ink[i]) silhouette[i] = 1;

/* ---------- compose the master --------------------------------------------- */

/*
 * The face is trimmed to its own bounding box and re-seated on the disc, rather
 * than inheriting the avatar's framing. The avatar is a square illustration with
 * generous air around it — air an icon cannot afford, since the disc already
 * supplies the breathing room and every pixel spent on margin is a pixel the
 * face does not get. At 16px that is the difference between a readable head and
 * a four-pixel one.
 */
let minX = W, minY = H, maxX = -1, maxY = -1;
for (let y = 0; y < H; y++) {
  for (let x = 0; x < W; x++) {
    if (silhouette[y * W + x]) {
      if (x < minX) minX = x;
      if (x > maxX) maxX = x;
      if (y < minY) minY = y;
      if (y > maxY) maxY = y;
    }
  }
}

const faceRgba = Buffer.alloc(N * 4);
for (let i = 0; i < N; i++) {
  const o = i * 4;
  const c = ink[i] ? INK : PAPER;
  faceRgba[o] = c[0];
  faceRgba[o + 1] = c[1];
  faceRgba[o + 2] = c[2];
  faceRgba[o + 3] = silhouette[i] ? 255 : 0;
}

const faceW = maxX - minX + 1;
const faceH = maxY - minY + 1;
const face = sharp(faceRgba, { raw: { width: W, height: H, channels: 4 } })
  .extract({ left: minX, top: minY, width: faceW, height: faceH });

console.log(`  face bbox ${faceW}×${faceH} at ${minX},${minY}`);

/*
 * Master canvas.
 *
 * Sized off the head's HEIGHT. Sizing off its width instead fills the disc more
 * — a head is much taller than it is wide, so width-fitting leaves side air —
 * but it pushes the crown into the ring, and hair and ring are both solid ink,
 * so they fuse into one black cap and the head loses its top edge. Height-fitting
 * at 0.9 keeps a hair's clearance inside the ring on both axes.
 */
const M = 1024;
const FILL = Number(process.env.ICON_FILL ?? 0.9);
const RING = Math.round(M * 0.022);

const scale = (M * FILL) / faceH;
const drawW = Math.round(faceW * scale);
const drawH = Math.round(faceH * scale);
const wantX = Math.round((M - drawW) / 2);
/* Seated high: the beard carries more mass low than the hair does high, so a
 * geometric centre reads as sitting too low in the disc. */
const wantY = Math.round((M - drawH) / 2 - M * 0.03);

/*
 * Whatever hangs outside the canvas is cut here rather than at composite time —
 * sharp refuses an overlay larger than its base, and at this fill ratio the head
 * is deliberately taller than the disc.
 */
const cropX = Math.max(0, -wantX);
const cropY = Math.max(0, -wantY);
const cropW = Math.min(drawW - cropX, M - Math.max(0, wantX));
const cropH = Math.min(drawH - cropY, M - Math.max(0, wantY));
const drawX = Math.max(0, wantX);
const drawY = Math.max(0, wantY);

const faceScaled = await face
  .resize(drawW, drawH)
  .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
  .png()
  .toBuffer();

console.log(`  face drawn ${cropW}×${cropH} at ${drawX},${drawY} on ${M}px disc`);

const hex = (c) => '#' + c.map((v) => v.toString(16).padStart(2, '0')).join('');
const discSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${M}" height="${M}">
     <circle cx="${M / 2}" cy="${M / 2}" r="${M / 2 - RING / 2}"
             fill="${hex(DISC)}" stroke="${hex(INK)}" stroke-width="${RING}"/>
   </svg>`,
);

/*
 * Clip to the disc after compositing. The face is wider than the disc at this
 * fill ratio — the hair and the beard both cross the edge — and letting them
 * run gives the mark a bitten silhouette instead of a circle.
 */
const clipSvg = Buffer.from(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${M}" height="${M}">
     <circle cx="${M / 2}" cy="${M / 2}" r="${M / 2}" fill="#fff"/>
   </svg>`,
);

const flat = await sharp(discSvg)
  .composite([{ input: faceScaled, left: drawX, top: drawY }])
  .png()
  .toBuffer();

const masterBuf = await sharp(flat)
  .composite([{ input: clipSvg, blend: 'dest-in' }])
  /* Re-strike the ring on top: the clip cuts the outer half of a centred
   * stroke, so without this the edge comes back at half weight. */
  .composite([
    { input: clipSvg, blend: 'dest-in' },
    {
      input: Buffer.from(
        `<svg xmlns="http://www.w3.org/2000/svg" width="${M}" height="${M}">
           <circle cx="${M / 2}" cy="${M / 2}" r="${M / 2 - RING / 2}"
                   fill="none" stroke="${hex(INK)}" stroke-width="${RING}"/>
         </svg>`,
      ),
      blend: 'over',
    },
  ])
  .png()
  .toBuffer();

await mkdir(REVIEW, { recursive: true });
await mkdir(PUBLIC_ICONS, { recursive: true });
await writeFile(`${REVIEW}/master.png`, masterBuf);

/* ---------- emit ----------------------------------------------------------- */

const SIZES = [16, 32, 48, 180, 192, 512];
const rendered = {};

/**
 * 16px is drawn, not derived.
 *
 * Everything else on this page is generated, and it should be — but 16 was
 * tried by generation first and it does not work at any setting. The reason is
 * arithmetic rather than craft: a stroke has to be about a pixel wide to
 * register, a pixel is 6% of a 16px tile, and once the ring and the disc have
 * taken their share there are roughly twelve pixels of face left. Twelve pixels
 * hold three shapes. Resampling a portrait into them — at every simplification
 * level from 96 cells down to 18, with both soft and hard thresholds — lands the
 * shapes wherever the grid happens to fall, and the result reads as a smudge
 * behind a ring. Choosing which three shapes survive is a decision, and it has
 * to be made by hand.
 *
 * The three are the ones that carry this face: the black swept hair as a cap,
 * the beard as a mass closing the bottom, and the brows over the light band
 * between them. The nose and the moustache are a bonus that happens to fit.
 *
 * Two departures from the larger sizes, both deliberate. The face runs to the
 * disc edge instead of sitting inside it, because a 1px inset costs 12% of the
 * width here. And the ring is not drawn: the hair supplies the top edge, the
 * beard the bottom, and single ink pixels at cols 0 and 15 the sides — which is
 * the ring, spent on the face instead of around it.
 */
const FACE_16 = [
  '     ######     ',
  '   ##########   ',
  '  ############  ',
  ' ############## ',
  ' ###........### ',
  '##............##',
  '#..##.....##...#',
  '#...#......#...#',
  '#..............#',
  '#......##......#',
  '##...######...##',
  ' ####......#### ',
  ' #####....##### ',
  '  ############  ',
  '   ##########   ',
  '     ######     ',
];

async function drawFace16() {
  const px = Buffer.alloc(16 * 16 * 4);
  FACE_16.forEach((row, y) =>
    [...row].forEach((ch, x) => {
      if (ch === ' ') return; // outside the disc
      const o = (y * 16 + x) * 4;
      const c = ch === '#' ? INK : PAPER;
      px[o] = c[0];
      px[o + 1] = c[1];
      px[o + 2] = c[2];
      px[o + 3] = 255;
    }),
  );
  return sharp(px, { raw: { width: 16, height: 16, channels: 4 } })
    .png({ compressionLevel: 9, palette: true })
    .toBuffer();
}

for (const size of SIZES) {
  if (size === 16) {
    rendered[16] = await drawFace16();
    await writeFile(`${REVIEW}/icon-16.png`, rendered[16]);
    continue;
  }

  /*
   * Lanczos down to 16 turns the ring into a grey halo — the kernel's negative
   * lobes ring against a 1px feature. Mitchell has no negative lobes worth
   * speaking of at this ratio, so the small end stays crisp; the large end is
   * downscaling far less and Lanczos is the better kernel there.
   */
  const small = size <= 48;
  let pipe = sharp(masterBuf).resize(size, size, {
    kernel: small ? 'mitchell' : 'lanczos3',
  });

  if (small) {
    /*
     * Two corrections that only 32 and 48 need.
     *
     * The contrast stretch: downscaling 1024 → 32 averages every edge in the
     * mark into the mid-greys, and a face built out of mid-greys reads as a
     * smudge however well-drawn the master is. Pushing the ends apart puts the
     * hair and beard back into ink and the face back into paper.
     *
     * The re-struck ring: at 32px the master's ring resamples to well under a
     * pixel, which paints as a faint grey haze rather than an edge — and the
     * edge is the entire reason the disc survives a light tab bar. Drawing it at
     * the target size instead gives a whole pixel of ink.
     */
    const ringPx = Math.max(1, Math.round(size / 24));
    pipe = sharp(
      await pipe.linear(1.35, -0.35 * 128).png().toBuffer(),
    ).composite([
      {
        input: Buffer.from(
          `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
             <circle cx="${size / 2}" cy="${size / 2}" r="${(size - ringPx) / 2}"
                     fill="none" stroke="${hex(INK)}" stroke-width="${ringPx}"/>
           </svg>`,
        ),
        blend: 'over',
      },
    ]);
  }

  rendered[size] = await pipe.png({ compressionLevel: 9, palette: small }).toBuffer();
  await writeFile(`${REVIEW}/icon-${size}.png`, rendered[size]);
}

await writeFile(
  `${APP}/favicon.ico`,
  buildIco([16, 32, 48].map((size) => ({ size, png: rendered[size] }))),
);
await writeFile(`${APP}/icon.png`, rendered[192]);
await writeFile(`${APP}/apple-icon.png`, rendered[180]);
await writeFile(`${PUBLIC_ICONS}/icon-192.png`, rendered[192]);
await writeFile(`${PUBLIC_ICONS}/icon-512.png`, rendered[512]);

for (const size of SIZES) {
  console.log(`  ${String(size).padStart(3)}px  ${String(rendered[size].length).padStart(6)} B`);
}
console.log(`\n  favicon.ico ${(await sharp(masterBuf).metadata()).width}px master → 16/32/48`);
console.log('  wrote src/app/{favicon.ico,icon.png,apple-icon.png}, public/icons/, docs/screenshots/icons/\n');
