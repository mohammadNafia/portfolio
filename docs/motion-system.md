# Motion system

Every value lives in `globals.css` as a custom property. There is no JavaScript animation
library — `src/lib/motion.ts` was deleted with the rest of the Motion layer. What remains is CSS
transitions, CSS keyframes, and one IntersectionObserver.

That is not a simplification for its own sake. The previous library-driven reveal used a
visible-ratio viewport trigger, which is unreliable twice over: a section taller than the
viewport can never reach the ratio, and a fast scroll can carry an element past the observer
between frames. With `once: true` either failure left content **permanently invisible**. The
observer below fires on `threshold: [0, 0.2]` and has an above-the-fold early return, so neither
case can recur.

## Principles

1. Motion reveals hierarchy and causality.
2. Text stays readable during transitions — nothing shears type.
3. Similar actions use similar timing everywhere.
4. Reduced motion is a designed alternative, not a switch-off.
5. Nothing is gated behind an animation. If motion never runs, everything is still reachable.

## Tokens

### Easing

| Token | Curve | Used for |
|---|---|---|
| `--ease-out` | `cubic-bezier(.16, 1, .3, 1)` | Reveals, the fan spread, the nav pill |
| `--ease-soft` | `cubic-bezier(.22, 1, .36, 1)` | Carousel slides, layout shifts |
| `--ease-hover` | `cubic-bezier(.2, .8, .2, 1)` | Hover, focus, press |

### Duration

| Token | Value | Used for |
|---|---|---|
| `--dur-press` | 120ms | Active/pressed |
| `--dur-link` | 160ms | Link colour and underline |
| `--dur-btn` | 180ms | Button surface and shadow |
| `--dur-hover` | 250ms | Card lift, tag, grid face |
| `--dur-nav` | 420ms | Nav pill collapse/expand |
| `--dur-slide` | 520ms | Carousel |
| `--dur-reveal` | 600ms | Section reveal |

Nothing exceeds 600ms except the hero's one-time load choreography.

## The four movements

### 1. Blur-up reveal

The system's signature transition, on every block that enters the viewport:

```text
opacity     0 → 1
translateY  30px → 0
filter      blur(10px) → blur(0)
600ms cubic-bezier(.16, 1, .3, 1), 80ms stagger between siblings
```

`Reveal` (`src/components/ui/Reveal.tsx`) is a plain IntersectionObserver that adds `.is-in`.
It unobserves after firing — reveals never replay on scroll-up.

### 2. Hero fan load choreography

Seven cards, stacked and rotated at `-16 / -11 / -6 / 0 / +6 / +11 / +16°` with x offsets
`∓330 / 220 / 110 / 0`. They arrive stacked, then spread **outward in pairs** — (3,5), then
(2,6), then (1,7) — 90ms apart, settling at roughly 2.4s. Each card then picks up an idle float
on its own offset delay, so the fan never breathes in unison.

Geometry is passed down as CSS custom properties (`--fan-x`, `--fan-y`, `--fan-rot`,
`--fan-delay`, `--fan-float-delay`), which is what lets the settled state be expressed as a
single rule the reduced-motion block can override.

Below 760px the outer four cards are hidden (`--wide-only`) and only 3, 4, 5 remain — the fan
narrows rather than clipping or shrinking to illegibility.

### 3. Nav pill

Collapsed at **260px** — identity and CTA only. It expands to **560px** once the hero is 70%
scrolled, revealing the links, with scroll-spy marking the current section.

It also expands on `focus-within`. Without that, a keyboard user at the top of the page could
tab into links that were still visually collapsed — navigation must never be scroll-gated.

Below 760px it stays collapsed permanently; the footer carries the routes. `tests/e2e/mobile.spec.ts`
asserts that every route is reachable from there.

### 4. Marquee

The tools strip duplicates its content and translates the track by exactly `-50%`, so the loop
is seamless. It pauses on hover, and runs with the reading direction — RTL uses a separate
`marquee-rtl` keyframe rather than mirroring the element.

There is deliberately nothing focusable inside it: the items are plain text, and the duplicated
half is `aria-hidden`, so a screen reader hears each tool once. That is why there is no
focus-within pause — there is no focus to catch.

## Reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  animation-duration: 0.01ms !important;
  animation-delay:    0ms    !important;   /* ← the one that mattered */
  transition-duration: 200ms !important;
  transition-delay:    0ms   !important;
}
```

**Zeroing delays is not optional.** Durations alone left the hero fan staggered by
`animation-delay`, so cards sat at `opacity: 0` for up to a second and popped in one at a time —
precisely the effect a reduced-motion visitor asked not to have. It also failed axe, which
scanned while the cards were still invisible.

Beyond the global collapse:

- `.reveal` drops its transform and blur; only the opacity change remains.
- The hero fan renders straight into its settled position — `translate(var(--fan-x), var(--fan-y))
  rotate(var(--fan-rot))`, `animation: none` — all seven cards present and linked.
- `scroll-behavior` returns to `auto`.
- The marquee stops. The strip is static and fully readable.

`tests/e2e/reduced-motion.spec.ts` asserts every `main h2` reaches full opacity including
through ancestors, all seven fan slots are visible with `animation-name: none`, every case-study
chapter is readable, the marquee is not looping, and navigation and locale switching still work.

The suite emulates the media query with `page.emulateMedia()` **and asserts the emulation is
active** before testing anything. Playwright's context-level `reducedMotion` option silently did
not reach `matchMedia` in this browser build, which had made an earlier version of these tests
pass while quietly testing normal motion.

## No-JavaScript safety net

`.reveal` renders its hidden state into the HTML. `<html class="no-js">` is stripped by an
inline script; if scripts never run, the unlayered `.no-js` rules force opacity 1 and clear the
transform and blur, so the page is fully readable. The hero fan's settled position is likewise
its CSS default, not a state JavaScript has to reach.
