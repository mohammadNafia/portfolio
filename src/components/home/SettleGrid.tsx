'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Settling-weight entrance for the selected-work grid.
 *
 * Each cell is drawn a few pixels below its resting position and a hair
 * under-scaled, and rises into place as the grid crosses the viewport. The four
 * are offset against each other, so the grid resolves as a loose diagonal
 * rather than as four things arriving together.
 *
 * ---------------------------------------------------------------------------
 * Why this is shaped the way it is
 *
 * This replaces a scroll-linked zoom that was fixed four times and broke a new
 * way each time — it covered the hero, then blew out the grid tracks, then
 * covered the section. Every one of those failures had the same root: a
 * magnitude derived from a live position that could grow without bound, on an
 * element lifted out of its own cell. So the rules here are structural, not
 * tuned, and each one closes off a specific way that went wrong:
 *
 *   1. BOTH MAGNITUDES ARE CONSTANTS. `LIFT` and `SCALE_FROM` are fixed
 *      numbers, scaled only by a progress value that is clamped to [0, 1].
 *      Nothing multiplies a distance by anything. The old lift was derived
 *      from the slot's distance below the fold, which does not clamp — at
 *      scroll zero with the gallery 2000px down it evaluated to about -1550px
 *      and drew the card over the hero.
 *
 *   2. PROGRESS COMES FROM THE GRID'S BOX, NOT THE TILE'S. One rect is read
 *      per frame, for the whole grid, and each cell takes a phase offset of
 *      it. A per-tile measurement is what made the effect depend on where the
 *      tile happened to sit in a grid that reflows 2 → 1 columns.
 *
 *   3. NOTHING LEAVES ITS CELL. The transform is at most 8px down and 0.985
 *      scale — inward and downward only, into a 22px grid gap. There is
 *      nothing to clip, so the section needs no `overflow` override; nothing
 *      overlaps, so it needs no `z-index` and no `isolation`; and the cell
 *      itself never transforms, so the tracks cannot be distorted.
 *
 *   4. IT SETTLES. Once every cell has landed, the custom properties are
 *      removed and the elements are handed back to the stylesheet — no
 *      residual composited layer on a grid that has finished moving.
 *
 * Entirely scroll-linked: every frame is a pure function of scroll position, so
 * scrolling back up reverses it exactly and a reload half-way down the grid
 * renders the correct intermediate state. Under `prefers-reduced-motion` the
 * loop never starts and the cells are simply where they belong.
 *
 * The blur-up is untouched. `Reveal` still owns opacity and blur on the `<li>`;
 * this owns transform on an inner element, so the two compose instead of
 * fighting over one `transform` property.
 */

/** Drawn this far below the resting position at the start. Never scaled by anything. */
const LIFT = 8;
/** Drawn at this fraction of natural size at the start. Inward only. */
const SCALE_FROM = 0.985;
/**
 * Fraction of viewport height the whole grid's travel spans, measured from the
 * moment its top edge reaches the bottom of the viewport.
 */
const SPAN = 0.9;
/** Phase offset per cell, as a fraction of that span. This is the diagonal. */
const STEP = 0.1;
/** How much of the span any single cell's own move occupies. */
const WINDOW = 0.55;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

export function SettleGrid({
  children,
  className = '',
  label,
}: {
  children: ReactNode;
  className?: string;
  label?: string;
}) {
  const rootRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const cells = [...root.querySelectorAll<HTMLElement>('[data-settle]')];
    if (!cells.length) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    let queued = false;

    /* Landed — hand the cells back to the stylesheet's identity defaults. */
    const settle = () => {
      for (const cell of cells) {
        cell.style.removeProperty('--settle-y');
        cell.style.removeProperty('--settle-s');
      }
      root.removeAttribute('data-settling');
    };

    const paint = () => {
      queued = false;

      /*
       * One measurement, for the grid — see rule 2. `rect.top` is the only
       * live number in the whole function, and it is immediately divided into
       * a progress value that clamps at both ends, so nothing downstream of it
       * can grow with distance.
       */
      const rect = root.getBoundingClientRect();
      const viewportH = window.innerHeight;
      const travelled = (viewportH - rect.top) / (viewportH * SPAN);

      /*
       * Cheap exit once there is provably nothing left to do: every cell has
       * finished and the properties are already off. One rect read per frame
       * is what this costs while scrolling anywhere else on the page.
       */
      const finished = travelled > 1 + (cells.length - 1) * STEP + WINDOW;
      if (finished && !root.hasAttribute('data-settling')) return;

      let moving = false;

      cells.forEach((cell, index) => {
        const progress = clamp((travelled - index * STEP) / WINDOW, 0, 1);
        const k = 1 - progress;
        if (k > 0) moving = true;

        cell.style.setProperty('--settle-y', `${(LIFT * k).toFixed(2)}px`);
        cell.style.setProperty('--settle-s', (1 - (1 - SCALE_FROM) * k).toFixed(4));
      });

      /*
       * Only while something is actually moving. `will-change` is gated on this
       * attribute, so a finished grid is not holding four composited layers.
       */
      if (moving) root.toggleAttribute('data-settling', true);
      else settle();
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    const stop = () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', paint);
    };

    const sync = () => {
      stop();
      /* Reduced motion: resting position, from the first paint. */
      if (query.matches) {
        settle();
        return;
      }

      /*
       * No IntersectionObserver gate, deliberately.
       *
       * The obvious optimisation is to only run this while the grid is near
       * the viewport, and it is how the effect this replaced was written. It
       * is also a correctness hole: an observer reports intersection CHANGES,
       * and going from "below the fold" to "above the fold" in one instant
       * jump — a restored scroll position, an anchor link, a programmatic
       * scroll — is not a change it will ever report. The cells then hold
       * whatever the last painted frame left them at, mid-move, with four
       * composited layers open, and nothing will ever come along to release
       * them. Measured: still un-settled five seconds after the jump.
       *
       * So the loop is unconditional and `paint` returns early instead, which
       * costs one `getBoundingClientRect` per animation frame while scrolling
       * and cannot go stale. The gate was never worth a state machine that has
       * a way to get permanently stuck.
       */
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
    <ul ref={rootRef} role="list" className={className} aria-label={label}>
      {children}
    </ul>
  );
}
