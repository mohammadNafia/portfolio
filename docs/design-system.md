# Design system — pixel-portfolio-style

The visual and motion system is defined by the skill in
[`docs/pixel-portfolio-style/`](./pixel-portfolio-style/). That is the source of truth; this
file records how it is applied here and every place the implementation departs from it.

**Read `pixel-portfolio-style/SKILL.md` before adding anything.** The point of the system is
that a section added in six months looks like it was designed on the same day as the rest.

## How it was applied

Per `SKILL.md` rule #0 — *"never rewrite a working, tested app just to adopt this look"* — the
system was applied **in place** to the existing Next.js app. The tokens map onto the Tailwind
theme, the components were restyled, and the motion layer was added. Routes, the typed content
model, the bilingual system, build-time content validation and the test suite all survived.

## Deviations from the token table

The skill's token table was sampled from a screen recording rather than measured, so it carries
the reference site's own contrast failures. `SKILL.md`'s accessibility floor takes precedence
over the table, and every departure below is measured and commented in `globals.css`.

| Token | Skill | Measured | Shipped | Why |
|---|---|---|---|---|
| `--ink-3` | `#9A9A9A` | 2.8:1 on white | `#6E6E6E` (5.1:1) | The table reserves it for decorative text, but captions, card bodies and the footer all use it. |
| `--accent` | `#0B8DF8` | 3.4:1 as fill **and** as text | `#0A6DC4` | Fails AA in both directions at the 15px the CTA and links use. |
| `--accent-bright` | — | 3.4:1 | `#0B8DF8` | **New token.** The recognisable brand blue, kept for text-free graphics only, where the 3:1 non-text threshold applies. |
| Brand tag text | brand bg + white | 2.07:1 on Sendy amber | computed from the brand's luminance | White only works on dark brands. Mid-luminance brands are mixed toward ink until white clears 4.5:1. |
| Carousel neighbour | `opacity .85` | blended body text to 4.29:1 | `.92` | The `.94` scale already carries the recession. |
| Form error | no error token exists | — | ink + ring, never colour alone | The system has no red; the message carries the meaning. |

### The accent split — the rule to remember

- **`--accent` (#0A6DC4)** carries anything with a **label**: buttons, links, the nav CTA.
- **`--accent-bright` (#0B8DF8)** is for **text-free graphics**: the carousel chevron's disc,
  glows, bullet marks.

Never put text on `--accent-bright`.

**Focus rings use `--accent`, not `--accent-bright`** — the one place the "graphics get the
bright one" rule does not hold. `--accent-bright` measures 3.4:1 on `--bg` but only **2.90:1**
on `--bg-alt`, and half the sections sit on `--bg-alt`. `--accent` clears 3:1 everywhere with
margin (5.25 / 4.69 / 4.49).

This shipped as a hard-coded `rgba(11,141,248,.45)`, which composites to **1.73:1** on white —
far under the 3:1 that WCAG 1.4.11 requires of a focus indicator. **axe cannot test focus-ring
contrast**, so zero violations said nothing about it. There is now an e2e test that asserts the
ring is opaque and clears 3:1 on both grounds.

## Cascade layers — read before editing CSS

Tailwind v4 establishes `@layer theme, base, components, utilities`. **Unlayered declarations
beat layered ones regardless of specificity.** This has caused three separate production bugs
in this project (see `EXECUTION-STATE.md`), so the structure below is deliberate:

| Region | Layer | Why |
|---|---|---|
| `@theme` colour/font/radius/shadow tokens | `theme` | Generates the Tailwind utilities. |
| `:root` spacing, type, z-index, motion tokens | **unlayered** | Plain custom properties; nothing needs to override them. |
| `[dir='rtl']` token overrides | **unlayered** | Must beat the `:root` Latin defaults. Putting these in a layer silently loses. |
| Element resets, focus, `.ltr-island` | `base` | So Tailwind utilities can override them — `a { color: inherit }` in an unlayered block breaks every text-colour utility on links. |
| `.section`, `.shell`, `.pixel-title`, `.sawtooth`, `.reveal`, `.nav-pill`, `.hero-fan`, `.gallery`, `.carousel`, `.field` | `components` | So a Tailwind utility on the same element wins — `pixel-title text-accent` works as written. **Never name one after a utility** — see below. |
| `.sr-only`, `.no-js` fallback | **unlayered** | Must always win. |

**Never write `text-[var(--color-x)]`.** Tailwind v4 cannot tell a colour from a font size in
an arbitrary bare `var()`. Use the generated utility (`text-ink-2`) or, for runtime values like
a project's brand colour, the explicit form `text-[color:var(--brand)]`.

## Type

| Role | Face | Notes |
|---|---|---|
| Display (pixel) | **Handjet** | `font-variation-settings: 'ELGR' 1, 'ELSH' 0` for square elements. Only the hero's second line, section titles, and pixel numerals. Never below 26px. |
| UI / body (Latin) | **Poppins** | |
| UI / body (Arabic) | **IBM Plex Sans Arabic** | Swapped via `[dir='rtl']` |

Handjet ships Latin *and* Arabic, which is why the pixel identity survives in both locales
instead of splitting into two visual systems. Verified visually in Chromium, Firefox and WebKit
at hero scale.

### Arabic
Never tracked (it breaks joining), never uppercased (Arabic has no case). The "shouty" section
title comes from the display face, the size and the squiggle. Leading is looser throughout:
`1.35` on pixel titles, `1.8` on body.

## Structural rules

- Every section header is pixel title + squiggle, centred. No exceptions.
- Every background change is a **sawtooth**, never a line, never a curve.
- Every block reveals with the blur-up transition.
- Radii are pill / 20 / 16 / 14. Nothing else.
- **No borders.** Separation comes from `--surface` fills and soft shadows.
- One accent per screen; brand tag pills are the single sanctioned exception.

## Naming: never shadow a Tailwind utility

Two component classes were named `.container` and `.grid`. Tailwind generates utilities with
both names, and `utilities` beats `components`, so the collision ran in **both directions** and
neither side errored:

- Tailwind's `container` overrode the site's measure. `--container` is 1080px; pages actually
  rendered at 1280px on desktop and 768px at 900px wide — every route, both locales.
- The site's `.grid` leaked into all 15 elements using Tailwind's `grid`, forcing three columns
  wherever their own `md:`/`lg:grid-cols-*` had not yet applied.

They are now `.shell` and `.gallery`, and a unit test fails the build if any class in
`@layer components` is ever named after a core Tailwind utility again.

## What was removed

The custom cursor, the Motion library, and the multi-column footer — the system has none of
them. Removing Motion also removed the class of viewport-trigger bug that had left reveals
permanently invisible; the reveal is now a plain IntersectionObserver toggling `.is-in`. It also
cut First Load JS by about 30%.
