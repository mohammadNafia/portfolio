'use client';

import { useEffect, useRef, type ReactNode } from 'react';

/**
 * Hero overlay scroll — motion.md → "Hero overlay scroll".
 *
 * Leaving the hero is not a normal scroll. Measured off the reference: over the
 * same scroll distance the white section travels -429px (1×) while the hero
 * content travels -89px (0.21×). So the hero lags at ~0.2× while the white panel
 * climbs at full speed and progressively covers it — no fade, no scale, no blur.
 * The sawtooth teeth do all the cutting, slicing through the wordmark, then the
 * subtitle, then the fan, then the cutout photo, in that order.
 *
 * Scroll-linked, so there is no duration and no easing curve. The lag is applied
 * as a downward push of `1 - 0.2`, which nets out to 0.2× travel against the page.
 */
const LAG = 0.8;

export function HeroInner({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const inner = ref.current;
    const hero = inner?.closest<HTMLElement>('.hero');
    if (!inner || !hero) return;

    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    let queued = false;

    const apply = () => {
      queued = false;
      /*
       * Clamped at the hero's own height. Past that the hero is fully covered,
       * and without the clamp it keeps drifting and resurfaces at the foot of
       * long pages.
       */
      const y = Math.min(window.scrollY, hero.offsetHeight) * LAG;
      inner.style.setProperty('--hero-y', `${y}px`);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(apply);
    };

    /* Reduced motion: drop the transform, keep the cut. */
    const sync = () => {
      window.removeEventListener('scroll', onScroll);
      if (query.matches) {
        inner.style.removeProperty('--hero-y');
        return;
      }
      window.addEventListener('scroll', onScroll, { passive: true });
      apply();
    };

    sync();
    query.addEventListener('change', sync);
    return () => {
      query.removeEventListener('change', sync);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div className="hero__inner" ref={ref}>
      {children}
    </div>
  );
}
