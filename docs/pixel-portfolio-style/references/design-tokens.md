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

### Handjet's Arabic failed QA — the fallback is in force, do not revert it

Confirmed on device, not in a desktop viewport: at 390px the Arabic hero line
`ومؤسس منتجات` rendered with disconnected letterforms, overlapping glyphs and a detached
hamza on the `ؤ`. Illegible to a reader of Arabic.

**It is not a size problem, and raising the clamp does not fix it.** The obvious reading is
that the responsive clamp had dropped below the `≥26px` floor above. It had not:

| viewport | computed size | multiple of the 26px floor | result |
|---|---|---|---|
| 390px | 46px | 1.8× | broken |
| 430px | 46px | 1.8× | broken |
| 768px | 57.6px | 2.2× | broken, identically |

The variation settings were correct too — `ELGR 1, ELSH 0` at weight 700, exactly as specified
above — so all three plausible misconfigurations were ruled out before changing the face. The
defects are the same shape at 2.2× the floor as at 1.8×; size is not the variable.

Measured on WebKit (Playwright), which is the engine Safari ships. A Chromium "mobile viewport"
is not a valid test here: Handjet's Arabic is grid-fitted, the failure is joining and mark
placement, and that is decided by the platform shaper — CoreText on iOS, not Skia/HarfBuzz.

**In force now** (`src/app/globals.css`):

- `[dir='rtl'] .pixel-title` and `[dir='rtl'] .hero__line2` → `var(--font-arabic)`,
  with `font-variation-settings: normal` (`ELGR`/`ELSH` are Handjet axes; Plex inherits garbage).
- Size ramp, centring, squiggle and reveal are untouched — only the face swaps.
- Latin keeps Handjet. The pixel identity is intact on `/en`.
- `.pixel-num` keeps Handjet even under RTL: `01`/`02`/`03` are Latin digits, which Handjet
  renders correctly, so the pixel identity survives on `/ar` too. Deliberately not applied to
  the credibility values — those are Arabic words in `ar`, not numerals.

Guarded by `tests/e2e/cross-browser.spec.ts` → *"Arabic display headings do not use Handjet"*
and *"Latin display headings still use Handjet"*, because this breakage is only visible to
someone who reads Arabic and would otherwise be reverted by anyone who found the pixel Arabic
prettier in a screenshot.

### The search for a replacement Arabic pixel face — six candidates, none shippable

Plex is a fallback, not a design choice, so the market was searched properly rather than
assumed away. Recorded here so the next person does not repeat it.

**Google Fonts has no alternative, and this is now a checked fact, not an impression.** Of the
1,942 families in the catalogue, 56 carry an `arabic` subset; Handjet is the only pixel/bitmap
face among them. Any candidate must therefore be self-hosted.

Six faces were downloaded, inspected with `fontTools`, and rendered on **WebKit at 390px** —
the same engine and width that condemned Handjet:

| Face | Licence | Joining | Marks / hamza | Verdict |
|---|---|---|---|---|
| **Plain Pixel** 0.009 | CC BY 4.0 | correct bare | **marks break the join** | reject |
| **Unixel** 1.0 | OFL 1.1 | correct | **marks detach, land wrong** | reject |
| **Solar 6** 1.1 | "free", no terms | correct | **marks silently dropped** | reject |
| **Arabixel Basic** | CC BY 4.0 | **none — no GSUB** | n/a | reject |
| **Arabixel Antique** | CC BY 4.0 | **none — no GSUB** | n/a | reject |
| **29LT Arapix** | €25+, commercial | untested | untested | not bought |

What each failure actually is:

- **Arabixel Basic / Antique** have *no `GSUB` or `GPOS` tables at all*. They address
  Presentation Forms-B directly, which works in a game engine that pre-shapes its text and
  cannot work in a browser: HarfBuzz has no `init`/`medi`/`fina` lookups to apply, so every
  letter renders isolated. Both also carry `fsType 4` (preview & print only), which contradicts
  their stated CC BY 4.0 grant.
- **Solar 6** shapes correctly but has no `mark` feature in `GPOS`, and in practice drops
  combining marks entirely — `الحدّ` renders with no shadda at all. At 6 pixels of letter height
  it is also not legible at hero size; `م` and `ه` are the same shape.
- **Unixel** is the closest miss, and on the unmarked hero line it is genuinely good. But it too
  has no `GPOS` `mark`, and its mark glyphs carry positive advance widths, so a damma or shadda
  is thrown clear of its letter and floats past the right edge of the word. That is the same
  defect class as Handjet's detached hamza, restated.
- **Plain Pixel** is the only candidate with real `mark`/`mkmk` positioning and full Arabic
  coverage (256/256, plus Supplement and Extended-A). It still fails: inserting a diacritic
  *breaks the cursive connection*. `مسلم` joins; `مُسلَّم` renders as `مُسلَّ` + gap + detached `م`.
  Isolated with and without marks to confirm the marks are the cause, not the letters.

**Why marks decide this and the hero line does not.** 42 of the 186 Arabic strings that reach
the display face carry diacritics — roughly a quarter of every Arabic heading on the site
(`الحدّ الفاصل`, `نظام مدرسة التفوّق`, `التسليم والتحقّق`). A face that renders `ومؤسس منتجات`
beautifully and mangles a shadda is not a face that ships; it just moves the breakage somewhere
less likely to be screenshotted.

The one paid option, **29LT Arapix**, was not purchased. Worth noting that its own designer
states it is "technically impossible to fit combinations like Alef-Hamza-above-shadda-damma
into 12 pixels" — the constraint is the medium, not the execution.

**Conclusion: Plex stays.** A legible fallback beats a broken identity. Reopen this only with a
face that survives the mark test above, not just the hero line.

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
