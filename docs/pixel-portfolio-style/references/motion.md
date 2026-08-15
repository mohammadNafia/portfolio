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
