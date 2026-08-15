# pixel-portfolio-style — full source handoff

Everything below is the complete skill, inlined so it can be pasted or committed directly.
File tree:

```
pixel-portfolio-style/
├── SKILL.md
├── references/
│   ├── design-tokens.md
│   ├── components.md
│   ├── motion.md
│   ├── section-recipes.md
│   └── rtl-and-locales.md
└── assets/
    ├── base.css
    └── IMAGES.md
```

## The two font names (the detail that was missing)

- **Display / pixel:** `Handjet` (Google Fonts, variable, by Rosetta). Chosen over Silkscreen
  because it ships **Arabic** as well as Latin — which dissolves conflict #1. Set
  `font-variation-settings: "ELGR" 1, "ELSH" 0` for square elements rather than dots.
  Fallbacks: `Silkscreen`, `Pixelify Sans` (Latin only).
- **UI / body:** `Poppins` for Latin, `IBM Plex Sans Arabic` for Arabic — swapped via
  `[dir="rtl"]`, both weights 400–700.

Both are free on Google Fonts and both are already wired into `assets/base.css`.

---


## `SKILL.md`

```markdown
---
name: pixel-portfolio-style
description: Design system and build rules for a light-gray "pixel-display" personal portfolio site (floating pill nav, pixel-font section titles with hand-drawn squiggle underlines, sawtooth/torn-paper section dividers, fanned card hero, blur-up scroll reveals, logo marquee, case-study carousel). ALWAYS use this skill when building, editing, extending, or adding ANY new section, component, or page to this portfolio site — including when the user says "add a section", "add testimonials", "add a blog/pricing/FAQ/about section", "make a new page", "style this like the site", "same vibe", "نفس النمط", "ضيف قسم", or uploads images to place into the site. Also use it when reviewing existing markup for style drift. The whole point is that anything added later looks like it was designed by the same person on the same day.
---

# Pixel Portfolio Style

A complete visual + motion system. Follow it literally. When something is not covered here,
choose the option that is **quieter, rounder, and more geometric** — never introduce a new
color, a new font, a new radius, or a new easing curve.

## Non-negotiables (read every time)

0. **This system is framework-agnostic.** It is a visual + motion layer, not a stack choice. If an
   app already exists (Next.js, Astro, plain HTML), apply the system **in place** — map the tokens
   onto the existing theme, restyle the existing components, add the motion layer. Never rewrite a
   working, tested app just to adopt this look.
1. **Two fonts only** — one display (pixel), one UI — and **one face per script**. Pixel display
   for section titles + the hero word; geometric sans for everything else. See
   `references/rtl-and-locales.md` before touching Arabic.
2. **One accent color only.** Blue `#0B8DF8`. Black `#111` for secondary buttons. Nothing else.
3. **Every section title** is: uppercase pixel font + hand-drawn squiggle SVG underline, centered.
4. **Every section** reveals on scroll with the same blur-up transition (see `references/motion.md`).
5. **Radii are pill or 20px.** Never 4px, never 8px, never sharp corners (except the sawtooth divider).
6. **No borders.** Separation comes from `#F2F2F2` fills and soft shadows, not from 1px lines.
7. **Centered, max 1080px content column.** Generous vertical rhythm (120–160px between sections).
8. **Copy is lowercase-friendly and self-deprecating/human**, never corporate. Short sentences.
9. **Single page ≠ single route.** The home page is one scrolling page, but deep content (case
   studies, chapters) lives on its own static routes in the same visual language. A card whose
   content exists always links somewhere real — the disabled `Coming soon...` variant exists only
   for genuinely unwritten work, and is forbidden where content already exists.

## Workflow when adding anything new

1. Read `references/design-tokens.md` → use the CSS variables, never raw hex.
2. Read `references/components.md` → check whether the thing already exists as a pattern
   (pill, tag, card, section header, marquee, carousel, form field). Reuse it. Do not invent a
   second card style.
3. Read `references/motion.md` → attach the standard reveal + hover behavior.
4. If it is a whole new section, read `references/section-recipes.md` and follow the
   "new section template" exactly (spacing, header, reveal, container).
5. Alternate section backgrounds `--bg` / `--bg-hero`. If two adjacent sections have
   different backgrounds, put a **sawtooth divider** between them (never a straight line).
6. Register the section id in the nav pill links only if it is a top-level destination
   (max 4 nav links; if adding a 5th, ask the user which one to drop).
7. Add any new image slot to `assets/IMAGES.md` with the exact aspect ratio needed, so the
   user knows what to supply.

## Self-check before finishing

- [ ] Does every new heading use the pixel font + squiggle underline?
- [ ] Any hex code outside the token list? Remove it.
- [ ] Any radius that is not `999px` or `20px` / `16px` / `14px`? Fix it.
- [ ] Does the new block fade in with `blur(10px) → 0` and `y: 30px → 0`?
- [ ] Do hover states use `scale(1.03)` + shadow lift + `250ms`?
- [ ] Mobile: does the fan/carousel/grid collapse per the mobile rules in `references/components.md`?
- [ ] Did I keep the section vertical padding at `clamp(80px, 10vw, 160px)`?

## Reference files

| File | Read when |
|---|---|
| `references/design-tokens.md` | Always — colors, type scale, spacing, shadows, fonts |
| `references/components.md` | Building any UI element (nav, cards, tags, form, marquee, carousel, divider) |
| `references/motion.md` | Any animation, reveal, hover, or page-load choreography |
| `references/section-recipes.md` | Adding a brand-new section or page |
| `references/rtl-and-locales.md` | Anything bilingual, Arabic, or RTL — read before writing headings |
| `assets/base.css` | Drop-in stylesheet with all tokens + primitives already implemented |
| `assets/IMAGES.md` | What images the site needs and at what ratio |
```


## `references/design-tokens.md`

```markdown
# Design Tokens

All values sampled from the reference site. Use the CSS variables, never raw hex.

## Color

| Token | Value | Use |
|---|---|---|
| `--bg` | `#FFFFFF` | Default page/section background |
| `--bg-alt` | `#EDEDED` | Hero + alternating sections (very light warm gray) |
| `--surface` | `#F2F2F2` | Inputs, tag pills, soft cards, image placeholders |
| `--surface-2` | `#FAFAFA` | Nav pill background (near-white, slightly translucent) |
| `--ink` | `#111111` | Headings, primary text, black buttons |
| `--ink-2` | `#626262` | Nav links, body paragraphs |
| `--ink-3` | `#9A9A9A` | Placeholders, captions, "coming soon" text |
| `--accent` | `#0B8DF8` | Primary CTA, active dots, arrows, links |
| `--accent-press` | `#0A7EDC` | Accent hover/active |
| `--on-accent` | `#FFFFFF` | Text on accent |

Tag pills on project cards use the **client's own brand color** as background with white text
(e.g. deep green, indigo). That is the single exception to the one-accent rule. Neutral tags fall
back to `--surface` + `--ink`.

## Typography

Two roles — display and UI. Each role gets **one face per script**, never more.

```css
/* display (pixel) — Handjet covers Latin AND Arabic, so the pixel identity survives in both */
--font-display: "Handjet", "Silkscreen", "Pixelify Sans", monospace;

/* UI / body */
--font-ui: "Poppins", "IBM Plex Sans Arabic", system-ui, sans-serif;  /* Latin-first pages */
[dir="rtl"] { --font-ui: "IBM Plex Sans Arabic", "Poppins", system-ui, sans-serif; }
```

All three display candidates and both UI faces are free on Google Fonts.

**Handjet is the decision.** It is a variable, element-based pixel font by Rosetta that ships
Latin, Arabic, Hebrew, Armenian, Cyrillic and Greek — so `HERO_LINE_2` and every section heading
can stay pixel in **both** locales instead of splitting into two visual identities. Set it up as:

```css
.pixel-title{
  font-family:var(--font-display);
  font-weight:700;
  font-variation-settings:"ELGR" 1, "ELSH" 0;  /* ELSH 0 = square elements (blocky, not dotty) */
}
```

`ELSH` (element shape) `0` gives hard squares, matching the reference. `ELGR` (element grid)
`1` = single element per cell; `2` gets finer and lighter — don't go above `1` at heading sizes.

Two known caveats, both worth a visual QA pass before committing:
1. Handjet's Arabic is a **grid-fitted** script — joining is handled, but at small sizes the
   连 forms get muddy. Only use it at `≥26px`. Never for body copy.
2. Rosetta warns about rendering artifacts in some Adobe apps and older macOS text stacks. Browsers
   are fine, but check Safari on macOS before shipping.

**If Handjet's Arabic fails that QA pass**, the fallback is exactly the split proposed in the
handoff: `IBM Plex Sans Arabic 700` for Arabic headings, keeping the centred layout, the size
ramp, the squiggle, and the reveal identical. Same identity, different face per script.

The display font is **only** used for: the hero's second line, section titles, and pixel numerals
in stats/process sections. Nothing else, ever.

| Role | Font | Size | Weight | Tracking | Case |
|---|---|---|---|---|---|
| Hero line 1 | ui | `clamp(28px, 3.4vw, 46px)` | 700 | `0.14em` | UPPER |
| Hero line 2 (pixel) | display | `clamp(46px, 7.5vw, 104px)` | 400/700 | `0.02em` | UPPER |
| Hero subtitle | ui | `17px` | 400 | normal | sentence |
| Section title | display | `clamp(26px, 3vw, 34px)` | 400/700 | `0.04em` | UPPER |
| Section intro paragraph | ui | `17px / 1.75` | 400 | normal | sentence |
| Card title | ui | `clamp(20px, 2vw, 27px) / 1.28` | 600 | `-0.01em` | sentence |
| Card body | ui | `15px / 1.6` | 400 | normal | sentence |
| Feature card title | ui | `17px / 1.3` | 700 | normal | sentence |
| Nav link | ui | `15px` | 500 | normal | sentence |
| Button label | ui | `15px` | 600 | normal | sentence |
| Form label | ui | `15px` | 700 | normal | sentence |
| Tag pill | ui | `13px` | 600 | normal | as written |
| Footer | ui | `13px` | 400 | normal | sentence |

Text color: headings `--ink`, paragraphs `--ink-2`, secondary `--ink-3`.
Paragraphs are **centered** in intro sections, **left-aligned** inside cards.

## Radius

```css
--r-pill: 999px;   /* nav, buttons, tags, dots */
--r-card: 20px;    /* project cards, case-study cards */
--r-input: 16px;   /* inputs, textareas */
--r-image: 14px;   /* gallery images, hero fan cards */
```

## Shadow

```css
--sh-nav:   0 6px 24px rgba(0,0,0,.08);
--sh-card:  0 10px 30px rgba(0,0,0,.08);
--sh-hover: 0 20px 45px rgba(0,0,0,.14);
--sh-btn:   0 6px 16px rgba(11,141,248,.28);   /* accent button */
--sh-btn-dark: 0 6px 16px rgba(0,0,0,.22);     /* black button */
```

## Spacing & layout

```css
--container: 1080px;        /* content column */
--container-wide: 1240px;   /* gallery grid + carousel */
--pad-x: clamp(20px, 5vw, 48px);
--section-y: clamp(80px, 10vw, 160px);
--gap-grid: 22px;
--stack-sm: 12px; --stack-md: 24px; --stack-lg: 48px;
```

Nav pill is `position: fixed; top: 18px;` centered, `z-index: 100`.

## Texture

The `--bg-alt` hero carries a subtle film grain: an SVG `feTurbulence` overlay at
`opacity: .045`, `mix-blend-mode: multiply`, `pointer-events: none`. Keep it faint — it should
read as paper, not noise.

## Breakpoints

`1080px` (grid 3→2 cols), `760px` (grid →1 col, nav links hide behind the pill, hero fan
collapses to 3 cards), `420px` (hero display font drops to `clamp(34px,12vw,46px)`).
```


## `references/components.md`

```markdown
# Component Patterns

Every component here already exists. Reuse, never re-invent.

---

## 1. Floating nav pill

A fixed, horizontally centered white pill. **It has two states.**

- **Collapsed (at page top):** avatar circle on the left + accent CTA button on the right only.
  Width ≈ `260px`.
- **Expanded (after scrolling past ~70% of the hero):** the pill grows and the nav links fade in
  between avatar and CTA. Width ≈ `560px`.

```
[ (avatar) ······················ (Work with Me) ]      → collapsed
[ (avatar)  Background  Case Studies  Resume  (Work with Me) ]  → expanded
```

Specs: `height 56px`, `radius var(--r-pill)`, `background rgba(255,255,255,.92)`,
`backdrop-filter: blur(14px)`, `box-shadow var(--sh-nav)`, inner padding `6px 6px 6px 10px`,
link gap `34px`. Avatar = `40px` circle, hand-drawn portrait, `object-fit: cover`.
Links `--ink-2`, hover `--ink`, active link `--ink` + 600 weight.
Width transition: `420ms cubic-bezier(.16,1,.3,1)`; links fade `opacity/translateY(-4px)` `250ms`.

Mobile (<760px): stays collapsed; CTA remains; links move into a tap-to-open sheet or are dropped.

---

## 2. Buttons

| Variant | Fill | Text | Shadow | Padding | Use |
|---|---|---|---|---|---|
| Primary | `--accent` | white 600 | `--sh-btn` | `12px 22px` | "Work with Me" |
| Dark | `--ink` | white 600 | `--sh-btn-dark` | `14px 26px` | "Download Resume", "Send me a message" |
| Quiet | transparent | `--accent` 600 | none | `10px 0` | "Read Case Study" inline |
| Disabled | `--surface` | `--ink-3` | none | same | "Coming soon..." |

All buttons are pills. Hover `translateY(-2px)` + darker fill, `180ms`. Active `scale(.96)`.
Icon (if any) sits left of the label at `16px`, `gap 8px`.

---

## 3. Section header (mandatory for every section)

```html
<header class="sec-head">
  <h2 class="pixel-title">BACKGROUND</h2>
  <svg class="squiggle" viewBox="0 0 240 12" preserveAspectRatio="none" aria-hidden="true">
    <path d="M2 6 Q8 1 14 6 T26 6 T38 6 T50 6 T62 6 T74 6 T86 6 T98 6 T110 6 T122 6
             T134 6 T146 6 T158 6 T170 6 T182 6 T194 6 T206 6 T218 6 T230 6 T238 6"
          fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round"/>
  </svg>
</header>
```

- Title: display font, uppercase, centered, `--ink`.
- Squiggle: width = ~92% of the title's width, height `12px`, sits `8px` below the title,
  `stroke-width 3`, rounded caps, same color as the title. It is a **sine wave**, not a zigzag.
- Optional intro paragraph below: centered, `max-width 700px`, `--ink-2`, `margin-top 28px`.

---

## 4. Sawtooth divider (torn-paper edge) + the overlay scroll

Sits at the boundary between the gray hero and the white section below. White triangles pointing
**up**, teeth `≈50px` wide and `≈36px` tall, tiled edge-to-edge, full bleed.

**Critical: the sawtooth belongs to the section *below*, not to the hero.** It is the first child
of the white section, pulled up by `-36px`, and the white section sits at `z-index: 1` over a hero
at `z-index: 0`. This is what makes the teeth *cut across* the hero's headline, cards and photo as
the page scrolls — the single most recognisable move on the whole site. If the sawtooth is built
as a strip inside the hero, the effect is lost and the divider reads as a static decoration.

See `motion.md → Hero overlay scroll` for the parallax factor that goes with it (measured: the
hero drifts at **0.2×** scroll speed while the white panel climbs at 1×).

```css
.sawtooth{
  height:36px; background:var(--bg);
  -webkit-mask-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='36'><polygon points='25,0 50,36 0,36' fill='black'/></svg>");
  mask-image:same; mask-size:50px 36px; mask-repeat:repeat-x;
}
```
Simplest robust implementation: an absolutely positioned SVG with a repeating polygon path,
`width:100%; bottom:0;` on the upper section. Never replace it with a straight line or a curve.

A cutout photo (person, background removed) peeks from **behind** the sawtooth at the lower-left of
the hero — only the top ~60% of the head is visible above the teeth.

---

## 5. Hero fan of cards

7 rounded image cards (`--r-image`, `--sh-card`) arranged in a shallow arc, overlapping ~45%.

| index | rotate | x offset | y offset | z |
|---|---|---|---|---|
| 1 | `-16deg` | `-330px` | `26px` | 1 |
| 2 | `-11deg` | `-220px` | `10px` | 2 |
| 3 | `-6deg`  | `-110px` | `2px`  | 3 |
| 4 | `0deg`   | `0`      | `0`    | 4 |
| 5 | `6deg`   | `110px`  | `2px`  | 3 |
| 6 | `11deg`  | `220px`  | `10px` | 2 |
| 7 | `16deg`  | `330px`  | `26px` | 1 |

Card size `210×280px` (scale down proportionally under 900px). The center card is the "hero"
screenshot. On mobile keep only indexes 3, 4, 5. Entrance animation: see `motion.md`.

---

## 6. Work gallery grid

3 equal columns, `gap var(--gap-grid)`, `--container-wide`, items `--r-image`, `object-fit: cover`,
mixed aspect ratios allowed (4:3, 1:1, 9:16) — masonry-ish feel, not forced equal heights.

**Hover state (important):** the image blurs `blur(6px)` + `brightness(.82)`, the card scales
`1.02`, and a centered white caption (`ui`, `15px`, `600`) fades in over it, e.g.
"Vaulted. Framer Template". `250ms ease-out`, reversed on leave.

2 columns under `1080px`, 1 column under `760px`. Captions become always-visible labels below the
image on touch devices.

---

## 7. Feature / service cards (3-up)

Centered column: `72px` app-style icon (rounded-square, real logo or illustration) → `20px` gap →
bold title on two lines → `10px` gap → `--ink-3` description, max 2 lines. No card background, no
border — they float on the section background. Equal-width thirds, `gap 56px`.

---

## 8. Logo marquee ("Notable Clients")

Small centered label above (`13px`, 600, `--ink-3`, uppercase-ish). Logos are monochrome
`--ink` at `opacity .75`, height `26px`, gap `72px`, moving **right → left**, `linear`,
`32s`, infinite, duplicated track for seamless loop, `pause on hover`. Fade masks on both edges
(`mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)`).

---

## 9. Case-study carousel

Horizontal, one card focused at a time, side cards peeking.

- Card: `--r-card`, white, `--sh-card`, width `min(420px, 78vw)`, cover image on top
  (`ratio 4:3`, image bleeds to the card's top corners), then `24px` padding.
- Inside: tag pill (client brand color, white text, `--r-pill`, `6px 14px`) → title
  (`ui 600`, 2–3 lines) → body (`--ink-3`, 4–5 lines) → CTA (`Read Case Study` accent /
  `Coming soon...` disabled).
- **Focused card** is at `scale(1)` `opacity 1`; neighbours `scale(.94)` `opacity .85`.
- Round accent arrow button (`44px`, `--accent`, white chevron, `--sh-btn`) vertically centered on
  the right edge, overlapping the cards.
- Dot pagination below: `8px` dots, `--surface` inactive / `--ink` active, `10px` gap,
  in a small `--surface` pill container.
- Slide transition `520ms cubic-bezier(.22,1,.36,1)`. Drag/swipe enabled on touch.

---

## 10. Form

Stacked, `--container` narrowed to `700px`.

- Label: `15px/700 --ink`; optional hint appended in `--ink-3` regular, same line
  — e.g. **Message Title** *(For email follow up)*.
- Input: full width, `height 52px`, `background var(--surface)`, **no border**,
  `radius var(--r-input)`, `padding 0 22px`, placeholder `--ink-3`.
- Textarea: same, `min-height 180px`, `padding 18px 22px`, `resize: vertical`.
- Focus: `box-shadow 0 0 0 3px rgba(11,141,248,.18)`, background `#EFEFEF`, `160ms`.
- Field gap `22px`; label→input gap `10px`.
- Submit: **dark pill**, right-aligned under the textarea.
- Inline links in the paragraph above the form use a **wavy underline**
  (`text-decoration: underline wavy` or a repeating SVG background), `--ink`, hover `--accent`.

---

## 11. Footer

One centered line, `13px`, `--ink-3`, `padding 40px 0 56px`. Keep the tone human and slightly
joking. No columns, no link lists, no newsletter.
```


## `references/motion.md`

```markdown
# Motion System

One easing family, one reveal, one hover. Everything else is a variation of these.

```css
--ease-out: cubic-bezier(.16, 1, .3, 1);   /* entrances, nav width, carousel */
--ease-soft: cubic-bezier(.22, 1, .36, 1); /* slides */
--ease-hover: cubic-bezier(.2, .8, .2, 1); /* hover/press */
```

`@media (prefers-reduced-motion: reduce)` → all entrance animations become a plain
`opacity 0→1` in `200ms`, marquee and float loops stop, carousel jumps without sliding.

---

## Page-load choreography (measured from the reference recording)

| t | Element | From → To | Duration | Ease |
|---|---|---|---|---|
| `0.00s` | Hero line 1 + line 2 | `opacity 0, y 24px, blur 8px` → settled | `700ms` | out |
| `0.10s` | Hero subtitle | same | `650ms` | out |
| `0.20s` | Center fan card (index 4) | `opacity 0, scale .9, rotate -14deg` → `scale 1, rotate 0` | `700ms` | out |
| `0.35s` | Nav pill | `y -80px, opacity 0` → `y 0, opacity 1` | `600ms` | out |
| `0.55s` | Fan cards spread outward from the center card, **staggered 90ms** per pair, moving to their final `x/rotate/y` | `900ms` each | out |
| `≈2.4s` | Fan fully settled (last card lands) | — | — | — |

So the hero is fully assembled at about **2.4 seconds**. The spread is outward and symmetric:
pairs (3,5) → (2,6) → (1,7). After settling, each card gets a slow idle float:
`translateY ±4px`, `6s`, `ease-in-out`, `alternate`, desynchronised by `i * .4s`.

---

## Scroll reveal (used by every section, no exceptions)

```
from: opacity 0, translateY 30px, filter blur(10px)
to:   opacity 1, translateY 0,    filter blur(0)
duration: 600ms, ease-out, trigger at 20% visible, run once
stagger: 80ms between siblings (paragraphs, cards, form fields)
```

The blur is what makes the site feel like the reference. Do not drop it. Section titles reveal
first, then their paragraph, then the cards left→right.

---

## Hero overlay scroll (the transition out of the hero)

This is **not** a normal scroll. Measured off the reference recording between `6.0s` and `6.9s`:

| | Movement over the same scroll distance |
|---|---|
| White section + its sawtooth top edge | `-429px` — i.e. **1× scroll**, normal |
| Hero content (headline, subtitle, fan, cutout photo) | `-89px` — i.e. **0.21× scroll** |

So the hero **lags at ~0.2× speed** while the white panel climbs over it at full speed. The hero
never fades, never scales, never blurs — it is progressively *covered*, and the sawtooth teeth
slice through the wordmark, then the subtitle, then the fan, then the photo, in that order.
The whole move is scroll-linked, not time-based: no duration, no easing curve.

```html
<section class="hero"><div class="hero__inner"> …headline, fan, photo… </div></section>
<section class="after-hero">
  <div class="sawtooth" aria-hidden="true"></div>
  …content…
</section>
```

```css
.hero{position:relative; z-index:0; min-height:100svh; overflow:clip}
.hero__inner{transform:translate3d(0,var(--hero-y,0px),0); will-change:transform}
.after-hero{position:relative; z-index:1; background:var(--bg); margin-top:-36px}
.after-hero > .sawtooth{margin-top:0}   /* the -36px pull lives on the section */
```

```js
const inner = document.querySelector('.hero__inner');
const hero  = document.querySelector('.hero');
const LAG   = 0.8;                    // 1 - 0.2 → net 0.2x travel
let queued = false;
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

addEventListener('scroll', () => {
  if (queued || reduce) return;
  queued = true;
  requestAnimationFrame(() => {
    const y = Math.min(scrollY, hero.offsetHeight) * LAG;
    inner.style.setProperty('--hero-y', y + 'px');
    queued = false;
  });
}, {passive:true});
```

Notes:
- Clamp at `hero.offsetHeight` so the hero stops drifting once it is fully covered — without the
  clamp it keeps sliding and reappears at the foot of long pages.
- The white section **must** have an opaque background, or the hero shows through the gap.
- `overflow: clip` (not `hidden`) on the hero keeps the cutout photo from creating a scrollbar
  without breaking the sticky/z-index stack.
- `prefers-reduced-motion`: skip the transform entirely; the sawtooth still cuts, the hero just
  scrolls at 1× like any section.
- If scroll-driven CSS animations are available (`animation-timeline: scroll()`), the same effect
  can be done without JS — but keep the rAF version as the fallback, and never run both.

## Nav pill expand

Triggered when `scrollY > 0.7 × viewportHeight`.
- Pill `width` `260px → 560px`, `420ms var(--ease-out)`.
- Links `opacity 0 → 1`, `translateY(-4px) → 0`, `250ms`, starting `120ms` into the width change.
- Reverses on scroll back to top.
- The active section's link switches to `--ink` + weight 600 via scroll-spy on section ids.

## Anchor navigation

`scroll-behavior: smooth` with `scroll-margin-top: 96px` on every section id so the pill never
covers the heading.

---

## Hover / press

| Element | Hover | Duration |
|---|---|---|
| Card (case study, gallery) | `translateY(-6px) scale(1.03)`, shadow → `--sh-hover` | `250ms ease-hover` |
| Gallery image | `blur(6px) brightness(.82)` + caption fade in | `250ms` |
| Button | `translateY(-2px)`, fill darkens | `180ms` |
| Any clickable, on press | `scale(.96)` | `120ms` |
| Nav link | color `--ink-2 → --ink` | `160ms` |
| Marquee | animation-play-state paused | — |

Clicking a dark button emits a short radial "pop": a `1px` ring scaling `0.6 → 1.6` while fading
out over `400ms`. Optional, but it is in the reference.

---

## Loops

- Logo marquee: `translateX(0 → -50%)`, `32s`, `linear`, `infinite`.
- Hero card idle float: as above.
- Nothing else animates on a loop. No pulsing CTAs, no bouncing arrows.
```


## `references/section-recipes.md`

```markdown
# Section Recipes

## Canonical page order

1. Floating nav pill (fixed)
2. Hero — `--bg-alt`, grain, headline, subtitle, fan of 7 cards, cutout photo bottom-left
3. **Sawtooth divider**
4. Work gallery grid — `--bg`
5. `BACKGROUND` — intro paragraphs + 3 feature cards
6. Notable Clients marquee
7. `RESUME` — one line of copy + dark "Download Resume" button
8. `CASE STUDIES` — carousel
9. `WORK WITH ME` — paragraph with wavy links + contact form
10. Footer line

Section ids are kebab-case and match the nav anchors: `#background`, `#case-studies`,
`#resume`, `#work-with-me`.

---

## New section template

Any section added later must be built from this skeleton. Nothing else.

```html
<section id="{kebab-id}" class="section {optional: section--alt}">
  <div class="container reveal">
    <header class="sec-head">
      <h2 class="pixel-title">{TITLE IN CAPS}</h2>
      <svg class="squiggle">…</svg>
    </header>
    <p class="sec-intro">{one or two short, human sentences}</p>

    <!-- content built ONLY from patterns in components.md -->
  </div>
</section>
```

Rules:
- `padding: var(--section-y) var(--pad-x)`.
- Background alternates with the neighbouring section (`--bg` ↔ `--bg-alt`).
  If it alternates, insert a `.sawtooth` at the boundary.
- Everything inside gets `.reveal` (see `motion.md`), staggered `80ms`.
- Max one new idea per section. If it needs two, it is two sections.

---

## Sub-pages (case studies, chapters, long-form)

The home page is one scroll. Deep content gets its own route — `/case-studies/{slug}` — built from
the same system so it reads as the same site, not a document dump.

Sub-page skeleton:

1. **Same fixed nav pill**, but it starts *expanded* (there is no hero to collapse against), and
   the active link is the section the piece belongs to.
2. **Page hero** — `--bg-alt` + grain, brand tag pill, title in the **UI font at hero scale**
   (not the pixel font: long titles in pixel are unreadable), one-line deck, then the cover image
   at `--r-image` bleeding into a `.sawtooth` at the bottom.
3. **Chapter nav** — for multi-chapter pieces (7 chapters, 6 chapters), a sticky
   `--surface` pill rail listing chapters; active chapter `--ink`, others `--ink-2`.
   Scroll-spy identical to the main nav.
4. **Body** — `--container` narrowed to `720px`, `17px/1.8`, `--ink-2`. Each chapter opens with a
   pixel-title + squiggle exactly like a home section. Images full-width at `--container`,
   `--r-image`, with a `13px --ink-3` caption underneath.
5. **Prev / next** — two `--surface` cards at the foot, `--r-card`, showing the neighbouring case
   study's tag + title. Real links, both directions, wrapping at the ends.
6. **Same footer line.**

Rules:
- No `Coming soon...` anywhere content exists. If the chapters are written, the card links.
- Chapter anchors are stable slugs — they get shared.
- Reveals apply per chapter block, not per paragraph, or long reads flicker.
- A sub-page never introduces a component that the home page doesn't already have, except the
  chapter rail and the prev/next pair defined here.

---

## Mapping common requests onto existing patterns

| User asks for | Build it as |
|---|---|
| Testimonials | Case-study carousel card, tag pill = person's name, body = quote, no CTA |
| Blog / writing list | Work gallery grid, caption on hover = post title, 2 columns |
| Pricing / packages | 3 feature cards; price in `ui 700 27px`; dark pill CTA under each |
| FAQ | Stacked `--surface` blocks, `--r-input`, question `700 17px`, answer `--ink-2`; chevron rotates `180deg` in `250ms` |
| About / bio | `BACKGROUND` layout: title + squiggle + two centered paragraphs |
| Stats / numbers | 3-up like feature cards; number in **display pixel font**, label in `ui 15px --ink-3` |
| Process / steps | 3-up feature cards, icon replaced by a pixel-font numeral `01 02 03` |
| Tools / stack | Logo marquee, second row, opposite direction |
| Newsletter | Single input + dark pill button on one row, `--surface` field, no border |
| Contact details | Wavy-underline inline links in a centered paragraph, no icons grid |
| Gallery / photos | Work gallery grid, ratio-mixed, hover blur + caption |
| Video | Gallery grid item at 16:9 spanning 2 columns, `--r-image`, play affordance = the same hover caption |

If a request maps to nothing above, pick the closest and say so — do not design a new component
type without asking.

---

## Copy voice

- Headline-style titles are single uppercase words when possible: `BACKGROUND`, `RESUME`,
  `CASE STUDIES`, `WORK WITH ME`.
- Body copy: first person, plain, a bit warm, occasionally funny (the footer joke, the
  "any game and manga recommendations" aside). Never "leverage", "solutions", "cutting-edge".
- Buttons say what happens: "Read Case Study", "Download Resume", "Send me a message".
- Empty/unfinished states are honest: "Coming soon...".

---

## Accessibility floor

- Contrast: `--ink-3` on white is for decorative/secondary text only, never for essential
  instructions at small sizes.
- All interactive elements reachable by keyboard, visible focus ring
  (`0 0 0 3px rgba(11,141,248,.35)`).
- Carousel arrows/dots are real `<button>`s with labels; marquee has `aria-hidden` on the
  duplicated track.
- Decorative squiggles, sawtooth, grain: `aria-hidden="true"`.
- Images need real alt text; the fan/gallery are content, not decoration.
```


## `references/rtl-and-locales.md`

```markdown
# RTL, Arabic, and bilingual rules

This system is bilingual by default (Arabic / English). Every rule in the other reference files
still applies; this file only covers what changes.

## Direction

- Set `dir="rtl"` on `<html>` for the Arabic locale, `dir="ltr"` for English. Never mix at the
  section level unless a block is genuinely one-script (a code sample, a Latin brand name).
- Use **logical properties everywhere**: `margin-inline-start`, `padding-inline`, `inset-inline-end`,
  `text-align: start`. No `left`/`right` in layout CSS. This is what makes one stylesheet serve both.
- Elements that must **not** flip: the sawtooth divider (symmetric anyway), the grain, the hero fan
  arc (symmetric), logo marquee direction (keep it moving toward the reading direction: `-50%`
  in LTR, `+50%` in RTL).
- Elements that **must** flip: carousel arrow chevron, carousel slide direction, form label
  alignment, the `Read Case Study` arrow, any icon with a direction.

## Type per script

See `design-tokens.md` for the font decision. In short: **Handjet** carries the pixel display face
in both scripts; `IBM Plex Sans Arabic 700` is the approved fallback for Arabic headings if
Handjet's Arabic fails visual QA.

Arabic adjustments to the type scale:

| Property | Latin | Arabic |
|---|---|---|
| Heading line-height | `1.05` | `1.35` (Arabic needs the leading — never reuse the Latin value) |
| Body line-height | `1.6` | `1.8` |
| Letter-spacing | tracked `0.04em`–`0.14em` on display | **`0` always** — never track Arabic, it breaks joining |
| Text transform | `uppercase` on titles | **none** — Arabic has no case; the weight carries the emphasis |
| Body size | `16px` | `17px` (Arabic reads smaller at the same px) |

Because Arabic has no uppercase, the "shouty section title" effect comes from: display face +
size + the squiggle underline, not from casing. Don't fake it with letter-spacing.

## Strings

- Every user-facing string exists in both locales. No English fallback rendering inside an Arabic
  page — a missing translation is a build error, not a silent fallback.
- Keep numerals consistent per locale (Western Arabic numerals `0–9` are the safe default for
  Iraqi audiences; don't switch to Eastern Arabic numerals halfway).
- Dates, currency, and phone numbers follow the locale, not the source content.

## Layout consequences

- Arabic text runs ~15–25% longer than English for the same content. Section headers, buttons and
  tag pills must not be fixed-width — size to content with a `min-width`.
- The nav pill's expanded width is defined by content in both locales; set the expanded state with
  `width: max-content` plus a `max-width`, not a hard `560px`, when running bilingual.
- Two-line card titles in English are often three in Arabic. Reserve the space with `min-height`
  rather than clamping, so cards in a row stay aligned.

## Testing floor

- Snapshot both locales for every section at 375 / 768 / 1440.
- Assert `dir` is correct on `<html>` and that no `left:`/`right:` positional CSS leaks into a
  component.
- Assert no untranslated key renders (the "missing translation is a build error" rule above).
```


## `assets/base.css`

```css
/* pixel-portfolio-style — base tokens & primitives.
   Drop this in first, then build sections on top. Do not add colors/radii outside these vars. */

@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&family=IBM+Plex+Sans+Arabic:wght@400;500;600;700&family=Handjet:wght@400;700&display=swap');

:root{
  /* color */
  --bg:#FFFFFF; --bg-alt:#EDEDED; --surface:#F2F2F2; --surface-2:#FAFAFA;
  --ink:#111111; --ink-2:#626262; --ink-3:#9A9A9A;
  --accent:#0B8DF8; --accent-press:#0A7EDC; --on-accent:#FFFFFF;

  /* type */
  --font-display:"Handjet","Silkscreen","Pixelify Sans",monospace;
  --font-ui:"Poppins","IBM Plex Sans Arabic",system-ui,sans-serif;

  /* radius */
  --r-pill:999px; --r-card:20px; --r-input:16px; --r-image:14px;

  /* shadow */
  --sh-nav:0 6px 24px rgba(0,0,0,.08);
  --sh-card:0 10px 30px rgba(0,0,0,.08);
  --sh-hover:0 20px 45px rgba(0,0,0,.14);
  --sh-btn:0 6px 16px rgba(11,141,248,.28);
  --sh-btn-dark:0 6px 16px rgba(0,0,0,.22);

  /* layout */
  --container:1080px; --container-wide:1240px;
  --pad-x:clamp(20px,5vw,48px);
  --section-y:clamp(80px,10vw,160px);
  --gap-grid:22px;

  /* motion */
  --ease-out:cubic-bezier(.16,1,.3,1);
  --ease-soft:cubic-bezier(.22,1,.36,1);
  --ease-hover:cubic-bezier(.2,.8,.2,1);
}

*,*::before,*::after{box-sizing:border-box}
html{scroll-behavior:smooth}
body{margin:0;background:var(--bg);color:var(--ink);font-family:var(--font-ui);
     font-size:16px;line-height:1.6;-webkit-font-smoothing:antialiased}
img{max-width:100%;display:block}
section{scroll-margin-top:96px}

/* ---------- layout ---------- */
.section{padding:var(--section-y) var(--pad-x)}
.section--alt{background:var(--bg-alt)}
.container{max-width:var(--container);margin-inline:auto}
.container--wide{max-width:var(--container-wide)}

/* ---------- section header ---------- */
.sec-head{display:flex;flex-direction:column;align-items:center;gap:8px}
.pixel-title{font-family:var(--font-display);font-weight:700;
  font-variation-settings:"ELGR" 1,"ELSH" 0;   /* square elements, not dots */
  font-size:clamp(26px,3vw,34px);letter-spacing:.04em;text-transform:uppercase;
  line-height:1.05;margin:0}
.squiggle{width:min(92%,320px);height:12px;color:var(--ink)}
.sec-intro{max-width:700px;margin:28px auto 0;text-align:center;color:var(--ink-2)}

/* ---------- buttons ---------- */
.btn{display:inline-flex;align-items:center;gap:8px;border:0;cursor:pointer;
  font:600 15px/1 var(--font-ui);border-radius:var(--r-pill);
  transition:transform .18s var(--ease-hover),background .18s,box-shadow .18s}
.btn:active{transform:scale(.96)}
.btn--primary{background:var(--accent);color:var(--on-accent);padding:12px 22px;box-shadow:var(--sh-btn)}
.btn--primary:hover{background:var(--accent-press);transform:translateY(-2px)}
.btn--dark{background:var(--ink);color:#fff;padding:14px 26px;box-shadow:var(--sh-btn-dark)}
.btn--dark:hover{transform:translateY(-2px)}
.btn--quiet{background:none;color:var(--accent);padding:10px 0}
.btn--disabled{background:var(--surface);color:var(--ink-3);padding:12px 22px;pointer-events:none}
:focus-visible{outline:0;box-shadow:0 0 0 3px rgba(11,141,248,.35)}

/* ---------- tags ---------- */
.tag{display:inline-block;padding:6px 14px;border-radius:var(--r-pill);
  font:600 13px/1 var(--font-ui);background:var(--surface);color:var(--ink)}
.tag--brand{color:#fff} /* set background inline to the client's brand color */

/* ---------- nav pill ---------- */
.nav{position:fixed;top:18px;left:50%;translate:-50% 0;z-index:100;
  display:flex;align-items:center;gap:34px;height:56px;padding:6px 6px 6px 10px;
  width:260px;justify-content:space-between;
  background:rgba(255,255,255,.92);backdrop-filter:blur(14px);
  border-radius:var(--r-pill);box-shadow:var(--sh-nav);
  transition:width .42s var(--ease-out)}
.nav.is-expanded{width:560px}
.nav__avatar{width:40px;height:40px;border-radius:50%;object-fit:cover;flex:none}
.nav__links{display:flex;gap:34px;opacity:0;transform:translateY(-4px);pointer-events:none;
  transition:opacity .25s .12s,transform .25s .12s}
.nav.is-expanded .nav__links{opacity:1;transform:none;pointer-events:auto}
.nav__links a{color:var(--ink-2);text-decoration:none;font:500 15px/1 var(--font-ui);
  transition:color .16s}
.nav__links a:hover,.nav__links a.is-active{color:var(--ink);font-weight:600}

/* ---------- sawtooth divider ---------- */
/* the sawtooth is the FIRST CHILD of the section below, so its teeth cut into the hero */
.hero{position:relative;z-index:0;min-height:100svh;overflow:clip}
.hero__inner{transform:translate3d(0,var(--hero-y,0px),0);will-change:transform}
.after-hero{position:relative;z-index:1;background:var(--bg);margin-top:-36px}
.sawtooth{position:relative;height:36px;background:var(--bg);
  -webkit-mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='36'><polygon points='25,0 50,36 0,36'/></svg>") repeat-x;
          mask:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='50' height='36'><polygon points='25,0 50,36 0,36'/></svg>") repeat-x;
  -webkit-mask-size:50px 36px;mask-size:50px 36px}

/* ---------- grain ---------- */
.grain::after{content:"";position:absolute;inset:0;pointer-events:none;opacity:.045;
  mix-blend-mode:multiply;
  background-image:url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'><filter id='n'><feTurbulence baseFrequency='.8'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")}

/* ---------- gallery grid ---------- */
.grid{display:grid;grid-template-columns:repeat(3,1fr);gap:var(--gap-grid)}
.grid__item{position:relative;border-radius:var(--r-image);overflow:hidden;
  transition:transform .25s var(--ease-hover),box-shadow .25s}
.grid__item img{width:100%;height:100%;object-fit:cover;transition:filter .25s}
.grid__item:hover{transform:scale(1.02);box-shadow:var(--sh-hover)}
.grid__item:hover img{filter:blur(6px) brightness(.82)}
.grid__cap{position:absolute;inset:0;display:grid;place-items:center;text-align:center;
  color:#fff;font:600 15px/1.4 var(--font-ui);padding:16px;opacity:0;transition:opacity .25s}
.grid__item:hover .grid__cap{opacity:1}

/* ---------- feature cards ---------- */
.features{display:grid;grid-template-columns:repeat(3,1fr);gap:56px;text-align:center;margin-top:64px}
.feature__icon{width:72px;height:72px;margin-inline:auto;border-radius:18px;object-fit:cover}
.feature h3{margin:20px 0 10px;font:700 17px/1.3 var(--font-ui)}
.feature p{margin:0;color:var(--ink-3);font-size:15px}

/* ---------- marquee ---------- */
.marquee{overflow:hidden;
  -webkit-mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent);
          mask-image:linear-gradient(90deg,transparent,#000 8%,#000 92%,transparent)}
.marquee__track{display:flex;gap:72px;align-items:center;width:max-content;
  animation:marquee 32s linear infinite}
.marquee:hover .marquee__track{animation-play-state:paused}
.marquee img{height:26px;opacity:.75;filter:grayscale(1)}
@keyframes marquee{to{transform:translateX(-50%)}}

/* ---------- form ---------- */
.field{display:flex;flex-direction:column;gap:10px;margin-bottom:22px}
.field label{font:700 15px/1 var(--font-ui)}
.field label span{color:var(--ink-3);font-weight:400}
.field input,.field textarea{border:0;background:var(--surface);border-radius:var(--r-input);
  font:400 15px/1.5 var(--font-ui);color:var(--ink);padding:0 22px;height:52px;
  transition:box-shadow .16s,background .16s}
.field textarea{min-height:180px;padding:18px 22px;resize:vertical;height:auto}
.field ::placeholder{color:var(--ink-3)}
.field input:focus,.field textarea:focus{outline:0;background:#EFEFEF;
  box-shadow:0 0 0 3px rgba(11,141,248,.18)}
.wavy{color:var(--ink);text-decoration:underline wavy;text-underline-offset:5px}
.wavy:hover{color:var(--accent)}

/* ---------- reveal ---------- */
.reveal{opacity:0;transform:translateY(30px);filter:blur(10px);
  transition:opacity .6s var(--ease-out),transform .6s var(--ease-out),filter .6s var(--ease-out)}
.reveal.is-in{opacity:1;transform:none;filter:none}

/* ---------- RTL / Arabic ---------- */
[dir="rtl"]{--font-ui:"IBM Plex Sans Arabic","Poppins",system-ui,sans-serif}
[dir="rtl"] body{font-size:17px;line-height:1.8}
[dir="rtl"] .pixel-title{letter-spacing:0;text-transform:none;line-height:1.35}
[dir="rtl"] .marquee__track{animation-name:marquee-rtl}
@keyframes marquee-rtl{to{transform:translateX(50%)}}
[dir="rtl"] .carousel__arrow svg{transform:scaleX(-1)}
[dir="rtl"] .nav.is-expanded{width:max-content;max-width:calc(100vw - 32px)}
/* use logical properties in new code: margin-inline, padding-inline, inset-inline-*, text-align:start */

/* ---------- responsive ---------- */
@media (max-width:1080px){.grid{grid-template-columns:repeat(2,1fr)}
  .features{grid-template-columns:1fr;gap:44px}}
@media (max-width:760px){.grid{grid-template-columns:1fr}
  .nav{width:auto;gap:12px}.nav.is-expanded{width:auto}.nav__links{display:none}}

@media (prefers-reduced-motion:reduce){
  *{animation-duration:.01ms!important;animation-iteration-count:1!important;
    transition-duration:.2s!important}
  .reveal{transform:none;filter:none}
}
```


## `assets/IMAGES.md`

```markdown
# Image manifest

Drop files into `/assets/img/` using these exact names, or tell Claude the new names.
Until a real file exists, use a `--surface` block with the same aspect ratio as a placeholder —
never a stretched or low-res stand-in.

| Slot | File | Ratio / size | Notes |
|---|---|---|---|
| Nav avatar | `avatar.png` | 1:1, ≥160px | Hand-drawn or illustrated portrait reads best, transparent bg |
| Hero fan 1–7 | `fan-1.png` … `fan-7.png` | 3:4, ≥840×1120 | App screenshots / mockups. `fan-4` is the strongest one (center) |
| Cutout photo | `me-cutout.png` | free, ~600px tall | Person with background removed, PNG transparency required |
| Gallery | `work-01.jpg` … `work-NN.jpg` | mixed: 4:3, 1:1, 9:16 | Real screenshots; keep ≥1400px on the long edge |
| Feature icons | `icon-1.png` … `icon-3.png` | 1:1, ≥256px | App-style rounded-square icons |
| Client logos | `logo-1.svg` … `logo-N.svg` | height-normalised to 26px | SVG preferred, single color, transparent bg |
| Case-study covers | `case-1.jpg` … `case-N.jpg` | 4:3, ≥1600px | Hero shot of the project |
| Resume | `resume.pdf` | — | Linked by the Download Resume button |
| OG image | `og.png` | 1200×630 | Social preview |
| Favicon | `favicon.png` | 512×512 | — |

Delivery rules:
- Export at 2× and serve with `width`/`height` attributes to avoid layout shift.
- `loading="lazy"` on everything below the fold, `fetchpriority="high"` on `fan-4`.
- Prefer `.webp` with a `.jpg` fallback for photos; `.png` where transparency is needed.
- Every image needs meaningful `alt` text; only the grain, squiggles and sawtooth are decorative.
```
