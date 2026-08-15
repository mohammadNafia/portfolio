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
