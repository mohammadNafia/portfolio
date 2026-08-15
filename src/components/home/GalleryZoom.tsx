'use client';

import { useEffect, useRef, type CSSProperties, type ReactNode } from 'react';

/**
 * Gallery zoom-out reveal — `assets/gallery-zoom-reveal.md`.
 *
 * One tile does not fade in with its neighbours. It enters oversized, softly
 * blurred and floating over the grid, then shrinks, sharpens and lands in its
 * own cell. It is drawn at 62% of the viewport at the window start, under a
 * perceived 8px of blur, and falls to natural size and sharp.
 *
 * Both magnitudes are derived rather than fixed — the scale from the viewport so
 * the card covers the same fraction of any screen, the blur from the scale so
 * the transform cannot magnify it. See the two comments in `paint`.
 *
 * Entirely scroll-linked — no duration, no easing curve. Because every frame is
 * derived from `getBoundingClientRect` rather than from a one-shot trigger,
 * scrolling back up reverses it exactly, and a reload halfway down the gallery
 * renders the correct intermediate state instead of a full-size card.
 *
 * The wrapper is the layout slot and never transforms; only `.zoom__inner`
 * does. That is what keeps the grid from reflowing however large the card is
 * drawn.
 */

/**
 * Ceiling only — the working cap is derived per paint from the viewport, below.
 *
 * A fixed multiplier is the wrong model: `2.0` came from the reference's 400px
 * grid cell, so the drawn width follows whatever this grid's cell happens to
 * measure rather than the screen. Measured at 1440×900, the cell is 398.66px and
 * the ceiling still binds — 0.62 of the viewport would need 2.24× — so the card
 * is drawn at 797px, 55% of the viewport. The derived cap is what takes over at
 * every width where the cell is wider relative to the screen.
 */
const MAX_SCALE = 2.0;
const MAX_SCALE_NARROW = 1.4;
const NARROW = 760;
/** Drawn width at the window start, as a fraction of the viewport. */
const TARGET_WIDTH = 0.62;
/**
 * Perceived blur at the window start. `filter` is applied before `transform`, so
 * the scale magnifies it — the compensation in `paint` is what makes this the
 * number actually seen on screen rather than the number handed to `blur()`.
 */
const MAX_BLUR = 8;
/**
 * Fraction of viewport height the transition spans. Lower = snappier.
 *
 * Reduced from `0.5` because the oversized state occupied 1.63 viewport heights
 * of scroll at 1440×900. Note what this knob can and cannot do: the span is
 * `lift + drawnHeight / 2 + viewportH * TRAVEL`, and only the last term is
 * TRAVEL's. At 1440×900 the first two are 649px and 399px, so the span cannot go
 * below 1.16 viewport heights however far this is lowered — the lift is the
 * binding term, not this.
 */
const TRAVEL = 0.35;
/**
 * Progress counts as landed a hair before 1. Sub-pixel scroll positions mean the
 * slot centre can sit at 450.02px of a 900px viewport and never resolve to
 * exactly 1 — which would leave a visually landed card still gated behind
 * `pointer-events: none`, and unclickable.
 *
 * A `progress < 1` test on the attribute is not a substitute. It clears the
 * gate but leaves `--zoom-s`/`--zoom-blur` set at their landed values, so the
 * tile keeps a `scale(1)` transform and a `blur(0px)` filter forever — which
 * is a composited layer and a filter chain on a tile that is finished moving.
 * Handing the element back to the stylesheet is the point of settling.
 */
const LANDED = 0.999;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function GalleryZoom({
  children,
  className = '',
  style,
}: {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}) {
  const slotRef = useRef<HTMLLIElement>(null);
  const innerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const slot = slotRef.current;
    const inner = innerRef.current;
    if (!slot || !inner) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    let observer: IntersectionObserver | null = null;
    let queued = false;
    let visible = true;

    /*
     * Landed: hand the tile back to the stylesheet, so it is an ordinary
     * gallery item again — identity transform, no residual blur layer, hover and
     * clicks restored. Also the reduced-motion state.
     */
    const settle = () => {
      for (const property of ['--zoom-s', '--zoom-dx', '--zoom-dy', '--zoom-blur']) {
        inner.style.removeProperty(property);
      }
      slot.removeAttribute('data-zoom-active');
    };

    const paint = () => {
      queued = false;

      const rect = slot.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const viewportW = window.innerWidth;
      const centreY = rect.top + rect.height / 2;
      const centreX = rect.left + rect.width / 2;

      /* 0 while the slot centre sits at the bottom edge, 1 once it reaches the middle. */
      const progress = clamp((viewportH - centreY) / (viewportH * TRAVEL), 0, 1);
      if (progress >= LANDED) {
        settle();
        return;
      }

      const k = 1 - progress;

      /*
       * The cap is derived from the viewport, not fixed, so the card is drawn at
       * the same fraction of the screen whatever the cell measures. Computed
       * here rather than at init because `paint` already runs on resize, and a
       * cap cached at init would keep drawing 1440's card after a resize to
       * 1024. `rect.width` is the layout width — the slot itself never
       * transforms, which is the invariant the whole effect rests on.
       *
       * Narrow viewports keep the fixed 1.4: the cell is already nearly
       * viewport-wide there, so a 0.62 target resolves to about 0.68 and would
       * draw the card *smaller* than its own cell, inverting the effect. The
       * edge bleed on mobile is deliberate — see the spec's Mobile section.
       */
      const ceiling = viewportW < NARROW ? MAX_SCALE_NARROW : MAX_SCALE;
      const maxScale =
        viewportW < NARROW
          ? ceiling
          : clamp((viewportW * TARGET_WIDTH) / rect.width, 1, ceiling);

      /*
       * CRITICAL — the lift is a bounded constant derived from viewport and slot
       * height, never from the live slot position. `progress` clamps at 0 but
       * the slot's distance below the fold does not, so a position-derived lift
       * runs away: with the gallery 2000px down it evaluated to about -1550px
       * and drew the oversized card over the hero at scroll position zero.
       * See "The runaway lift" in the spec. It is never a z-index problem.
       */
      const lift = (viewportH + rect.height) / 2;

      /*
       * Horizontal drift, re-added on measurement after the revert. The
       * reference featured a centre-column tile; this grid reflows 3 → 2 → 1
       * columns, so the cell is off-centre at every width and the card is drawn
       * partly outside the viewport without it — measured at the start of the
       * transition: 99px cut off the left at 1440, 178px off the right at 1024,
       * 129px at 768. One fifth of the card, gone.
       *
       * Unlike the lift, this cannot run away, and the difference is worth
       * stating: the page does not scroll horizontally, so `centreX` is always
       * inside `[0, viewportW]` and the shift is inherently at most half a
       * viewport. The clamp enforces that bound rather than trusting it — if a
       * future layout ever puts the cell outside the viewport, the card stops
       * drifting instead of taking off.
       */
      const drift = clamp(viewportW / 2 - centreX, -viewportW / 2, viewportW / 2);

      const scale = 1 + (maxScale - 1) * k;

      /*
       * Divided by the scale because the filter is applied in the element's own
       * coordinate space and the transform then magnifies the result: an
       * uncompensated 12px at 2× was perceived as ~24px, which is why the card
       * read as a failed image load rather than as depth of field. Dividing
       * holds the *perceived* blur at MAX_BLUR across the whole travel.
       */
      const blur = (MAX_BLUR * k) / scale;

      inner.style.setProperty('--zoom-s', scale.toFixed(4));
      inner.style.setProperty('--zoom-dx', `${(drift * k).toFixed(2)}px`);
      inner.style.setProperty('--zoom-dy', `${(-lift * k).toFixed(2)}px`);
      inner.style.setProperty('--zoom-blur', `${blur.toFixed(2)}px`);

      /* Gates the pointer blur + caption, which are a different effect entirely. */
      slot.toggleAttribute('data-zoom-active', true);
    };

    const onScroll = () => {
      if (queued || !visible) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', paint);
      observer?.disconnect();
      observer = null;
    };

    const sync = () => {
      stop();
      /* Reduced motion: natural size, sharp, from the first paint. */
      if (query.matches) {
        settle();
        return;
      }

      /* Only run the loop while the slot is anywhere near the viewport. */
      observer = new IntersectionObserver(
        (entries) => {
          visible = entries.some((entry) => entry.isIntersecting);
          if (visible) paint();
        },
        { rootMargin: '60% 0px' },
      );
      observer.observe(slot);

      window.addEventListener('scroll', onScroll, { passive: true });
      window.addEventListener('resize', paint);
      paint();
    };

    sync();
    query.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', sync);
      stop();
    };
  }, []);

  return (
    <li
      ref={slotRef}
      className={`gallery__item gallery__item--featured ${className}`}
      style={style}
      data-zoom
    >
      <div className="zoom__inner" ref={innerRef}>
        {children}
      </div>
    </li>
  );
}
