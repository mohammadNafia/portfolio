# Mohammed Nafia — Portfolio

Bilingual (English / Arabic) portfolio for **Mohammed Nafia**, Full-Stack Software Engineer and
Product Founder, Baghdad, Iraq.

**Engineered in Baghdad. Built for the real world.**

Built on **`pixel-portfolio-style`** — the design system in [docs/pixel-portfolio-style/](docs/pixel-portfolio-style/),
which is the authority on how anything here should look. Warm light ground, a pixel display face
that ships **Arabic as well as Latin**, a floating pill nav, a sawtooth at every background
change, and a seven-card hero fan as the signature.

**Read `docs/pixel-portfolio-style/SKILL.md` before adding a section.** The point of the system
is that a section added in six months looks like it was designed on the same day as the rest.

---

## Quick start

```bash
npm install
npm run dev          # http://localhost:3210
```

Copy `.env.example` to `.env.local` if you want a production domain or working contact-form
delivery. **The site builds and runs with no environment variables set.**

## Scripts

| Script | What it does |
|---|---|
| `npm run dev` | Dev server on port 3210 |
| `npm run build` | Production build (validates all project content at build time) |
| `npm start` | Serve the production build on port 3210 |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit`, strict |
| `npm test` | Vitest unit tests |
| `npm run test:e2e` | Playwright — needs a production server on port 3211 (it starts one) |
| `npm run test:e2e:ui` | Playwright UI mode |
| `npm run verify` | lint → typecheck → unit → **clean** → build |
| `npm run clean` | Delete `.next`. Incremental builds hide module-resolution failures |
| `npm run shots` | Restart the production server and capture all 132 review screenshots |
| `node scripts/restart-prod.mjs` | Rebuild-safe restart of the production server on 3211 |
| `node scripts/shoot.mjs [viewport] [locale]` | Capture a subset of the review screenshots |

> **Note on `next start`:** it keeps serving the previous build's CSS hash after a rebuild,
> which silently produces unstyled screenshots. Always use `scripts/restart-prod.mjs`, which
> verifies **every** served stylesheet resolves before returning — checking only the first one
> checks the font CSS, whose hash never changes.
>
> **Note on builds:** never run two `next build` processes at once, and never delete `.next`
> while one is running — on Windows that yields an artefact that starts and serves 200s but
> throws `TypeError: a[d] is not a function` from the webpack runtime on any dynamic route.
> `npm run verify` cleans first so a real module-resolution failure cannot hide behind cached
> chunks either.

## Environment variables

All optional. See `.env.example`.

| Variable | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public origin. Feeds canonical URLs, sitemap, robots, Open Graph, structured data. **Set before launch.** |
| `RESEND_API_KEY` | Enables contact-form delivery. Without it the form honestly reports that the message was not delivered. |
| `CONTACT_TO_EMAIL` | Inbox for inquiries. Defaults to the address in `src/lib/site.ts`. |
| `CONTACT_FROM_EMAIL` | Verified sender address. |

## Stack

Next.js 15 (App Router) · TypeScript strict · Tailwind CSS v4 · Zod · Playwright + axe · Vitest.

No i18n library, no UI kit, no 3D runtime, and **no animation library** — motion is CSS custom
properties plus one IntersectionObserver. See `docs/design-system.md` and
`docs/motion-system.md` for why.

Fonts: **Handjet** (pixel display, Latin + Arabic) · **Poppins** (Latin UI) ·
**IBM Plex Sans Arabic** (Arabic UI).

## Project structure

```
src/
  app/
    [locale]/            # every route lives under /en or /ar
      layout.tsx         # root layout: fonts, lang/dir, header, footer
      page.tsx           # homepage
      work/page.tsx      # work index
      work/[slug]/       # case studies (16 static pages)
      about|services|contact|privacy/
      not-found.tsx      # locale-scoped 404
      [...rest]/         # sends unknown paths to the 404
    api/contact/         # inquiry endpoint
    globals.css          # ALL design tokens — the single source of truth
    opengraph-image.tsx  # generated OG image
    icon.tsx             # generated favicon
    sitemap.ts, robots.ts
  content/
    schema.ts            # zod schemas + build-time validation
    projects/            # sendy, immar, nano, archive
    index.ts             # validated registry
  i18n/
    config.ts            # locales, direction, path helpers
    dictionaries/en.ts   # source of truth for UI copy AND the Dictionary type
    dictionaries/ar.ts   # must satisfy Dictionary — missing keys are compile errors
  components/            # layout · ui · home · work · case-study · showcase · contact · seo
  lib/                   # site identity · contact schema
  middleware.ts          # locale detection, persistence, URL normalisation
tests/
  unit/                  # content + i18n integrity
  e2e/                   # site, reduced-motion, mobile, cross-browser
docs/
  pixel-portfolio-style/ # THE DESIGN SYSTEM — read before changing anything visual
  …                      # audit, design, identity, motion, verification, launch package
```

## Editing content

### Adding a project

1. Create `src/content/projects/<slug>.ts` following an existing file's shape.
2. Register it in `src/content/index.ts`.
3. `npm run build`.

The build **fails with a useful error** if anything is missing — a featured project needs at
least 6 case-study chapters, an archive project at least 3, every localised field needs both
`en` and `ar`, accents must be valid hex, and slugs must be unique. There is no way to ship a
"Coming soon" page.

### Editing UI copy

Edit `src/i18n/dictionaries/en.ts`. TypeScript will then require the matching key in `ar.ts`.
`npm test` additionally checks array lengths match and that no Arabic string was left as a copy
of the English.

### Adding a product composition

Add a `case` to `renderFace()` in `src/components/home/FanCardArt.tsx` and its id to the
`showcaseSchema` enum in `src/content/schema.ts`.

**Give it its own case.** Falling through to another project's face puts a caption over an image
of something else, which is a quiet untruth — and it has already happened once.

## Design and content rules

These are enforced, not conventions:

- **No invented facts.** No metrics, testimonials, clients, rankings or awards beyond the two
  documented ones. Unit tests fail if a user count, percentage metric, currency figure or
  "#1 in Iraq"-style claim appears.
- **Concept imagery is labelled as concept imagery.** No product screenshots exist yet; the
  compositions are captioned accordingly everywhere they appear.
- **No `text-[var(--color-x)]`.** Tailwind v4 cannot disambiguate colour from font-size in a
  bare `var()`. Use the generated utility (`text-ink-2`), or `text-[color:var(--brand)]` for a
  runtime value.
- **Mind the cascade layers.** Base resets belong in `@layer base`, primitives in
  `@layer components`, and the `[dir='rtl']` token block must stay **unlayered**. This has
  caused three production bugs here. See `docs/design-system.md`.
- **Never name a component class after a Tailwind utility.** `utilities` beats `components`, so
  the collision runs both ways and neither side errors. A unit test enforces this.
- **The accent is split by function.** `--accent` (`#0A6DC4`) for anything carrying text and
  for every focus ring; `--accent-bright` (`#0B8DF8`) for text-free graphics only. Never put
  text on the bright one, and never use it for a focus ring — it fails 3:1 on `--bg-alt`.
- **No borders.** Separation is surface fills and shadows. The system has no 1px rules.
- **A sawtooth at every background change** — never a line, never a fade.
- **Never use the pixel face below 26px**, and never track or uppercase Arabic.
- **Arabic is art-directed, not translated.** It has its own leading and type scale.

The system's own token table fails WCAG in five places — it was sampled from a recording, not
measured. The accessibility floor wins; each deviation is measured and commented in
`globals.css` and tabulated in `docs/design-system.md`.

## Accessibility and performance

0 serious axe violations across 12 route/locale pairs · complete keyboard navigation · skip
link · focus ring measured at 3:1 on both grounds · designed reduced-motion mode · no horizontal
overflow at any supported width in either locale · CLS ≤ 0.002 and LCP < 1.8 s on every measured
route. Evidence in `docs/verification-report.md`.

**Verify the build from a deleted `.next`** (`npm run verify` does). Incremental builds reuse
cached chunks, so a genuine module-resolution failure can hide behind a green build.

## Deployment

Any Node host supporting Next.js 15. Middleware is required (locale routing), so a fully static
export is not appropriate.

1. Set `NEXT_PUBLIC_SITE_URL`.
2. Optionally set the contact-form variables.
3. `npm run build && npm start`.

Nothing here has been **pushed, deployed or submitted**. The work is committed to the local
branch `portfolio/pixel-restyle` at Mohammed's request; no remote has been touched.

## Documentation

| Document | Contents |
|---|---|
| `docs/EXECUTION-STATE.md` | Build log, decisions, every bug found and fixed |
| `docs/MASTER-CHECKLIST.md` | Every requirement, verified |
| `docs/repository-audit.md` | Starting state, stack rationale, risks |
| `docs/pixel-portfolio-style/` | **The design system.** Authoritative — start here |
| `docs/reference-analysis.md` | What was taken from Dilan Omer's portfolio, what was rejected, and why |
| `docs/design-system.md` | How the system is applied here, and the five measured deviations |
| `docs/identity-system.md` | The Iraqi identity layer and its rationale |
| `docs/motion-system.md` | Motion tokens, choreography, reduced motion |
| `docs/content-inventory.md` | Every source used |
| `docs/content-gaps.md` | Exactly what Mohammed must supply |
| `docs/assets-manifest.md` | Every asset, real and placeholder |
| `docs/verification-report.md` | Commands run and actual results |
| `docs/launch-plan.md`, `launch-copy.md`, `launch-assets.md`, `submission-checklist.md` | Launch package — drafted, **nothing posted** |
