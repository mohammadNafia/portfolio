# Gallery zoom-out reveal — standalone spec

Self-contained. Everything needed for this one effect is in this file: measurements, markup, CSS,
JS, tuning, edge cases, and the QA checklist. It slots into the `pixel-portfolio-style` system but
does not depend on any other reference file.

---

## What the effect is

One **featured** item in the work gallery does not simply fade in with its neighbours. It enters the
viewport oversized, heavily blurred, floating over the grid — and as you scroll it **shrinks,
sharpens, and lands in its own grid cell**. Every other tile does the normal blur-up reveal around it.

The effect is entirely **scroll-linked**. There is no duration and no easing curve; scroll position
drives it frame by frame, and scrolling back up reverses it exactly.

## Measured from the reference (1913px viewport)

| Stage | Card width | Blur | Position |
|---|---|---|---|
| Entering, below the fold | `≈800px` | heavy | viewport-centred, floating over everything |
| Mid-transition | `≈620px` | clearing | still overlapping the grid rows |
| Landed | `≈400px` (its grid cell) | `0` | in flow, indistinguishable from a normal tile |

So the travel is **2.0× → 1.0× scale** and **~12px → 0 blur**, with the element drifting from
viewport centre back into its own slot. The grid scrolls at normal speed underneath the whole time.

## The one thing that is easy to get wrong

The reference gallery has **two different blurs** and they must not be conflated:

1. **This effect's blur** — scroll-linked, no caption, happens once on entry.
2. **The hover blur** — `blur(6px) brightness(.82)` plus a centred white caption
   ("Vaulted. Framer Template"), triggered by the pointer, reversible at any time.

They look similar in a still frame and are completely different behaviours. **Suppress hover
entirely while the zoom is in progress** (`pointer-events: none` until progress hits 1), or a
mouse resting over the area produces a caption on a half-zoomed card and the whole thing reads
as a bug.

---

## Markup

The wrapper holds the layout slot. The inner element is what transforms — so the grid never
reflows, no matter how large the card is drawn.

```html
<div class="grid">
  …normal tiles…

  <figure class="grid__item grid__item--featured" data-zoom>
    <div class="zoom__inner">
      <img src="/assets/img/work-vaulted.jpg" alt="Vaulted — Framer template landing page" />
      <figcaption class="grid__cap">Vaulted. Framer Template</figcaption>
    </div>
  </figure>

  …normal tiles…
</div>
```

## CSS

```css
.grid{ isolation:isolate; }                 /* contains the z-index bump */

.grid__item--featured{
  position:relative;
  z-index:5;                                /* floats over neighbouring tiles */
}

.zoom__inner{
  transform-origin:center center;
  will-change:transform, filter;
  transform:translate3d(0, var(--zoom-dy, 0px), 0) scale(var(--zoom-s, 1));
  filter:blur(var(--zoom-blur, 0px));
  border-radius:14px;
  overflow:hidden;
}

/* hover belongs to the landed state only */
.grid__item--featured[data-zoom-active] .zoom__inner{ pointer-events:none; }
.grid__item--featured[data-zoom-active] .grid__cap{ opacity:0 !important; }

@media (prefers-reduced-motion: reduce){
  .zoom__inner{ transform:none; filter:none; }
}
```

## JS

```js
const MAX_SCALE   = 2.0;   // 1.4 on narrow viewports — see Mobile below
const MAX_BLUR    = 12;    // px
const TRAVEL      = 0.5;   // fraction of viewport height the transition spans

const clamp = (v, a, b) => Math.min(Math.max(v, a), b);
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

document.querySelectorAll('[data-zoom]').forEach(slot => {
  const inner = slot.querySelector('.zoom__inner');
  if (!inner || reduce) return;

  const maxScale = innerWidth < 760 ? 1.4 : MAX_SCALE;
  let queued = false, visible = false;

  const paint = () => {
    const r  = slot.getBoundingClientRect();
    const vh = innerHeight;
    const slotCentre = r.top + r.height / 2;

    // 0 while the slot centre sits at the bottom edge, 1 once it reaches viewport centre
    const p = clamp((vh - slotCentre) / (vh * TRAVEL), 0, 1);
    const k = 1 - p;                                  // 1 → 0

    // CRITICAL: the lift is a BOUNDED constant derived from viewport and slot height —
    // never from the live slot position. See "The runaway lift" below.
    const lift = (vh + r.height) / 2;                 // centres the card at the window start

    inner.style.setProperty('--zoom-s',    (1 + (maxScale - 1) * k).toFixed(4));
    inner.style.setProperty('--zoom-dy',   (-lift * k).toFixed(2) + 'px');
    inner.style.setProperty('--zoom-blur', (MAX_BLUR * k).toFixed(2) + 'px');

    slot.toggleAttribute('data-zoom-active', p < 1);  // gates hover
    queued = false;
  };

  const onScroll = () => {
    if (queued || !visible) return;
    queued = true;
    requestAnimationFrame(paint);
  };

  // only run the loop while the slot is anywhere near the viewport
  new IntersectionObserver(([e]) => {
    visible = e.isIntersecting;
    if (visible) paint();
  }, { rootMargin: '60% 0px' }).observe(slot);   // was 120% — too eager, see the runaway lift

  addEventListener('scroll', onScroll, { passive:true });
  addEventListener('resize', paint);
  paint();
});
```

---

## Tuning

| Knob | Default | Effect |
|---|---|---|
| `MAX_SCALE` | `2.0` | How oversized it starts. Above `2.4` it overflows on 1440 and clips |
| `MAX_BLUR` | `12px` | Below `8` the effect barely registers; above `16` it looks like a loading state |
| `TRAVEL` | `0.5` | Fraction of viewport height the transition spans. Lower = snappier, higher = lazier |

Change one at a time and re-check on a 1440 screen — these three interact, and over-tuning
produces a card that lands late and jumps.

## The runaway lift — the failure this spec originally caused

An earlier version of this file computed the vertical offset from the live slot position:

```js
// WRONG — do not use
inner.style.setProperty('--zoom-dy', ((vh / 2 - slotCentre) * k) + 'px');
```

`p` clamps at `0`, but `slotCentre` does not. With the gallery 2000px below the fold, that
expression evaluates to roughly `-1550px` — so at scroll position zero the card is lifted a
screen and a half **above its own section** and painted, oversized and blurred, on top of the
hero and through the nav. The further down the page the gallery sits, the worse it gets.

The corrected form derives the lift from viewport and slot height only:

```js
const lift = (vh + r.height) / 2;      // bounded, independent of scroll position
// --zoom-dy = -lift * k
```

At the window start (slot top level with the viewport bottom) this centres the card exactly as
intended; when the slot is far below the fold the card is lifted by the same bounded amount and
therefore still sits below the fold, invisible, which is correct.

**Symptom to recognise:** a huge blurred card covering the hero at page top, or bleeding over the
nav. That is always this bug, never a z-index problem — do not "fix" it by lowering z-index.

**Regression test:** at `scrollY === 0`, `document.elementFromPoint(cx, 100)` must not return the
zoom element or any of its children, at every breakpoint.

## Edge cases

- **One featured item per grid.** Two of these running simultaneously fight for z-index and read as
  a glitch. If a second one is wanted, put it in a different section.
- **Scroll up.** The effect must reverse cleanly. Because it is derived from `getBoundingClientRect`
  every frame rather than from a one-shot trigger, it does this for free — do not "optimise" it into
  a run-once IntersectionObserver.
- **Deep link / page reload mid-page.** `paint()` runs once on init, so an anchor landing halfway
  down the gallery renders the correct state instead of a full-size card.
- **Short viewports** (`< 620px` tall): the slot centre may never reach viewport centre. Clamp
  handles it — the card lands at `p = 1` regardless.
- **Layout shift.** The wrapper reserves the slot at natural size, so nothing reflows. Never apply
  the transform to the grid cell itself.
- **`overflow: hidden` on any ancestor** will clip the oversized card. The gallery section needs
  `overflow: visible` (or `clip` only on the axis you actually need).

## Performance

- A large `filter: blur()` is the expensive part, not the transform. Cap at `12px`, keep the image
  under 1600px on the long edge, and let the IntersectionObserver stop the loop when out of view.
- `will-change: transform, filter` is set on the inner element only — never on the grid.
- One rAF-throttled listener per featured item, `{passive: true}`. No scroll libraries.
- On a 60Hz laptop this should hold frame budget; if it drops, lower `MAX_BLUR` before anything else.

## Accessibility

- `prefers-reduced-motion: reduce` → the script returns early and the card renders at its natural
  size and position, sharp, from the first paint. Nothing is lost but the motion.
- The blur is decorative only — never blur an element whose text is the sole carrier of meaning.
  The image needs real `alt` text either way.
- The card is not focusable during the zoom (`pointer-events: none` while `data-zoom-active`), so
  keyboard users reach it in its landed state. Verify tab order still passes through it.
- Do not couple the effect to a link's hover styles; the link target must be reachable without
  triggering any of this.

## RTL

The effect is vertical and horizontally centred, so it is direction-neutral — no mirroring needed.
The only RTL consideration is the caption inside `.grid__cap`, which inherits the page direction.

## QA checklist

- [ ] Card starts oversized and blurred, lands sharp in its cell — no jump at the end
- [ ] Scrolling back up reverses it smoothly
- [ ] Hover caption never appears mid-zoom
- [ ] No horizontal scrollbar at any point on 1440, 1024, 768, 375
- [ ] No layout shift in the grid as the card scales (check with CLS in DevTools)
- [ ] Reload with the gallery mid-viewport renders the correct intermediate state
- [ ] `prefers-reduced-motion` disables it entirely
- [ ] Only one item in the grid does this
- [ ] **At `scrollY === 0` nothing from the zoom element is painted** — check `elementFromPoint`
      across the top of the viewport at 1440, 1024, 768, 390, in both locales
