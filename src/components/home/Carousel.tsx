'use client';

import { useEffect, useId, useRef, useState, type ReactNode } from 'react';
import type { Locale } from '@/i18n/config';

/**
 * Card carousel.
 *
 * The focused card sits at full scale and opacity; neighbours are at .94 / .92
 * and peek in from both sides. A round accent arrow hangs on the trailing edge,
 * and dot pagination sits in a surface pill below. Slide is 520ms on
 * `--ease-soft`.
 *
 * Keyboard: arrows move the focused card. Touch: horizontal swipe. Every card
 * is a normal link, so tabbing through them works regardless of which is
 * focused.
 *
 * MULTI-INSTANCE. This started as the case-study carousel, which addressed its
 * cards through `document.getElementById('case-card-N')` — fine while there was
 * one on the page, and a collision the moment there are two: both carousels
 * would resolve the same node, so driving either one scrolled whichever
 * rendered first. Everything here is instance-local instead — its own state,
 * its own ref into its own track, and ids namespaced with `useId`. The keyboard
 * handler sits on this element, so arrows only reach the carousel that holds
 * focus.
 */
export type CarouselItem = {
  /** Stable key, also used to namespace the card's DOM id. */
  key: string;
  /** Accessible name for this card's dot. */
  label: string;
  card: ReactNode;
};

export function Carousel({
  items,
  locale,
  label,
  nextLabel,
}: {
  items: CarouselItem[];
  locale: Locale;
  /** Names the carousel and its dot group. */
  label: string;
  /** Accessible name for the advance button. */
  nextLabel: string;
}) {
  const [index, setIndex] = useState(0);
  const rtl = locale === 'ar';
  const touchStart = useRef<number | null>(null);
  const trackRef = useRef<HTMLUListElement>(null);
  const mounted = useRef(false);
  const uid = useId();

  const go = (next: number) => setIndex((next + items.length) % items.length);

  useEffect(() => {
    // Bring the focused card into view when the *user* changes it. Skipped on
    // mount, or the page would scroll itself down to the carousel on load.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    /* Through this instance's own track — never `document`. */
    const node = trackRef.current?.children[index];
    node?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [index]);

  function onKeyDown(event: React.KeyboardEvent) {
    if (event.key === 'ArrowRight') {
      event.preventDefault();
      go(index + (rtl ? -1 : 1));
    } else if (event.key === 'ArrowLeft') {
      event.preventDefault();
      go(index + (rtl ? 1 : -1));
    }
  }

  return (
    <div
      className="carousel"
      role="group"
      aria-roledescription="carousel"
      aria-label={label}
      onKeyDown={onKeyDown}
      onTouchStart={(event) => {
        touchStart.current = event.touches[0]?.clientX ?? null;
      }}
      onTouchEnd={(event) => {
        const start = touchStart.current;
        const end = event.changedTouches[0]?.clientX;
        if (start == null || end == null) return;
        const delta = end - start;
        if (Math.abs(delta) < 45) return;
        go(index + (delta < 0 ? 1 : -1) * (rtl ? -1 : 1));
        touchStart.current = null;
      }}
    >
      <ul role="list" className="carousel__track" ref={trackRef}>
        {items.map((item, cardIndex) => {
          const focused = cardIndex === index;
          return (
            <li
              key={item.key}
              id={`${uid}-${item.key}`}
              className="carousel__card"
              data-focused={focused}
              aria-current={focused ? 'true' : undefined}
            >
              {item.card}
            </li>
          );
        })}
      </ul>

      <button type="button" className="carousel__arrow" onClick={() => go(index + 1)} aria-label={nextLabel}>
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true">
          <path
            d="M6 3l5 5-5 5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div className="carousel__dots" role="tablist" aria-label={label}>
        {items.map((item, dotIndex) => (
          <button
            key={item.key}
            type="button"
            role="tab"
            aria-selected={dotIndex === index}
            aria-controls={`${uid}-${item.key}`}
            aria-label={item.label}
            className="carousel__dot"
            data-active={dotIndex === index}
            onClick={() => go(dotIndex)}
          />
        ))}
      </div>
    </div>
  );
}
