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
