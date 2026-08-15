# Assets manifest

Every asset the site ships, its status, and what would replace it.

## Summary

**The site ships zero image files.** Every visual is generated: rendered DOM, inline SVG, or an
image generated at build time from code. That is why there is no `public/media/` directory and
no image weight in the performance figures.

---

## Generated at build time

| Asset | Source | Output | Status |
|---|---|---|---|
| Favicon | `src/app/icon.tsx` | 32×32 PNG | **Final** — the pixel monogram in `--accent` on `--bg-alt` |
| Open Graph image | `src/app/opengraph-image.tsx` | 1200×630 PNG | **Final** — white surface, sawtooth seam, pixel monogram, headline |
| `sitemap.xml` | `src/app/sitemap.ts` | XML, 28 URLs with `hreflang` alternates | **Final** |
| `robots.txt` | `src/app/robots.ts` | Text | **Final** |

Both images draw the monogram from the **same exported bitmap** the nav pill uses
(`MONOGRAM_BITMAP` in `src/components/layout/Monogram.tsx`), so the mark is literally identical
in all three places rather than three drawings that resemble each other. The favicon's cell size
(6px) is chosen so the mark lands on whole device pixels at 32px — a pixel mark that resamples
to mush would be arguing against itself.

The OG card's prose is set in the renderer's default face, **not Handjet**. Loading the display
font into Satori means fetching a font file during the build, and a social card is not worth
making the build depend on the network. The identity carries through the palette and the
sawtooth, which is the part that survives thumbnail size anyway.

## Inline SVG

| Asset | File | Status |
|---|---|---|
| Squiggle (under every section title) | `src/components/ui/Section.tsx` → `Squiggle` | **Final** |
| Pixel monogram | `src/components/layout/Monogram.tsx` | **Final** — stands in for a portrait in the nav pill |
| Product faces | `src/components/home/FanCardArt.tsx` | **Placeholder** — ten distinct abstract faces, keyed by `variant ?? slug`. Drives the fan, gallery, carousel, work index **and** case studies |
| Arrow / chevron marks | inline in `Button.tsx`, `WorkIndex.tsx`, `CaseCarousel.tsx` | **Final** |
| Success check | `ContactForm.tsx` | **Final** |

The **sawtooth seam** is not SVG — it is a CSS `mask-image` on a 50×36px triangle, applied by
`Sawtooth` in `Section.tsx`. It appears at every background change on every route.

## Coded product compositions — placeholders

All in `src/components/home/FanCardArt.tsx`, keyed by `variant ?? project.slug`. The separate
`showcase/ProductShowcase.tsx` was folded into it during the restyle — one component now draws
the hero fan, the work gallery, the carousel, the work index and every case-study composition,
so a project looks like itself everywhere it appears.

Rendered DOM built from each product's real, verified module names. **Captioned as concepts
everywhere they appear**, and each case-study hero carries a standing notice explaining that
these are not screenshots.

**Every id in use must have its own `case`.** Three of them briefly fell through to a shared
face, so IMMAR showed one identical picture under three different captions — a caption that
describes a screen the image is not is exactly the kind of quiet untruth this project is built
to avoid. `immar-mobile`, `immar-roles` and `nano-output` now draw distinct faces.

| Composition id | Represents | Replace with |
|---|---|---|
| `sendy-orders` | Merchant dashboard — order workspace with status pills | Real order-list screenshot, 16:10, ≥2560px |
| `sendy-storefront` | Public storefront + checkout | Storefront screenshot, 16:10 |
| `sendy-inventory` | Inventory / warehouse reconciliation | Inventory screenshot, 16:10 |
| `immar-dashboard` | Teacher/admin assessment submissions | Dashboard screenshot, 16:10 — **must not show a student account** |
| `immar-mobile` | Student app lesson view, in a phone frame | Phone screenshot, 9:19.5 |
| `immar-roles` | Roles & permissions matrix | Permissions screen, 16:10 |
| `nano-pipeline` | Four-stage extraction pipeline, blur resolving to sharp | Real pipeline/demo capture if one survives |
| `nano-output` | Source document beside structured output | Real extraction result, 16:10 |
| `generic-api` | Request lifecycle + transaction states | Keep — this is the right presentation for a backend project |
| `generic-dashboard` | Operational dashboard | Real screenshot where one exists |

`generic-api` is **not** a placeholder in the same sense: for Virtual Banking and MedicHub, an
architecture and lifecycle visual is a better presentation than invented UI, and the case study
says so explicitly.

## Standing in for a portrait

| Location | Current | Replace with |
|---|---|---|
| `layout/SiteHeader.tsx` → nav pill avatar | Pixel monogram | Square portrait crop |

**That is the only one.** The restyle removed the framed 4:5 panel from the About page and the
1:1 panel from the homepage `AboutPreview`; neither the panels nor that component exist any
more, and the pages read fine without them — About opens on BACKGROUND text, and the homepage
goes hero → work.

So a portrait has exactly one home today: the pill avatar. The reference site also crops a
portrait peeking over the hero's sawtooth, which is a second option once a photo exists.

## Fonts — self-hosted via `next/font/google`

| Family | Weights | Subsets | Role |
|---|---|---|---|
| **Handjet** | 400, 700 | latin, **arabic** | Pixel display face — hero line 2, section titles, pixel numerals |
| **Poppins** | 400, 500, 600, 700 | latin | UI and body (Latin) |
| **IBM Plex Sans Arabic** | 300–700 | arabic, latin | UI and body (Arabic), swapped via `[dir='rtl']` |

All use `display: swap`. Handjet's Arabic subset is the reason the pixel identity survives the
locale switch — see `identity-system.md`. Square elements are selected in CSS, not at load:
`font-variation-settings: 'ELGR' 1, 'ELSH' 0`.

Space Grotesk and JetBrains Mono were removed with the previous direction. Nothing on the site
is set in a monospace face any more; technical metadata uses the pixel face instead.

## Assets deliberately NOT used

| Asset | Location | Why |
|---|---|---|
| Sendy logo, icon, mascot, profile art | `Desktop/SENDY-BRAND GUIDLINE/` | Sendy's marks, not Mohammed's portfolio identity. Using the mascot would make the portfolio look like Sendy's own site. Only Sendy's accent colour is borrowed. |
| Sendy launch-video scene renders (13 files) | `Desktop/sendy video/` | Marketing renders, not product screenshots. Presenting them as UI would misrepresent them. Listed in `launch-assets.md`, where they are honest. |
| CV PDFs (7 variants) | `Desktop/cv/` | None confirmed current. Mohammed is supplying **one** current CV as PDF; the RESUME section ships when it does. Until then there is no section and no dead link. |
| IMMAR launcher icons | `Desktop/immar/mobile/…/ic_launcher.png` | Launcher icons only, no product screens. |
| Client logos | — | No client has given permission to be named. The tools marquee replaces the reference site's logo wall — it says the same thing and is true. |

## Screenshots of this site

`docs/screenshots/` holds 132 captures — 11 routes × 2 locales × 6 viewports — produced by
`node scripts/restart-prod.mjs && node scripts/shoot.mjs`. They are **gitignored**: they are
build output, the full set is ~310 MB, and a stale set is worse than none.

Regenerate them after any visual change with `npm run shots`.

Two things the harness has to get right, both learned the hard way:

- It disables `scroll-behavior: smooth` before driving the page. A programmatic scroll that
  animates makes the progress check exit immediately and yields half-scrolled captures.
- It **throws on an unexpected status** rather than logging a warning. It used to print
  `WARN(500)` and continue, so two full 132-shot runs completed "successfully" against a server
  returning 500 for every route. Nothing looked wrong until the files turned out to be
  byte-identical.

## To add real images later

1. Put files in `public/media/<project>/`.
2. Use `next/image` with explicit `width`/`height` and a `sizes` attribute — **required**, or
   CLS will regress from its current ~0.
3. Prefer AVIF/WebP (`next.config.ts` already sets `formats: ['image/avif', 'image/webp']`).
4. Give descriptive alt text in **both** locales via the content model.
5. Replace the `showcase` block in the project file, and delete the corresponding
   "Interface concept" caption — it would then be untrue.
6. Re-run `node scripts/shoot.mjs` and re-check CLS.
