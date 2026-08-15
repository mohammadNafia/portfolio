'use client';

import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';

/**
 * The one scroll reveal, used by every block with no exceptions.
 *
 *   opacity 0 → 1 · translateY 30px → 0 · blur(10px) → 0
 *   600ms · cubic-bezier(.16,1,.3,1) · trigger at 20% visible · once
 *
 * The blur is what makes the site feel like the reference — it is not optional.
 *
 * Implemented with a plain IntersectionObserver toggling `.is-in`, rather than
 * an animation library's viewport helper. That is deliberate: the library's
 * ratio-based trigger could never fire for a section taller than the viewport,
 * and a fast scroll could carry an element past it entirely — leaving content
 * permanently invisible. A `threshold` array with a `0` entry cannot miss.
 */
export function Reveal({
  children,
  className = '',
  delay = 0,
  as: Tag = 'div',
  style,
  id,
}: {
  children: ReactNode;
  className?: string;
  /** Sibling stagger, in ms. The system uses 80ms steps. */
  delay?: number;
  as?: 'div' | 'section' | 'article' | 'li' | 'ul' | 'ol' | 'header' | 'figure' | 'p';
  style?: CSSProperties;
  id?: string;
}) {
  const ref = useRef<HTMLElement | null>(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // Already on screen at mount (above the fold) — show without waiting.
    const rect = element.getBoundingClientRect();
    if (rect.top < window.innerHeight * 0.8) {
      setShown(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting || entry.intersectionRatio > 0) {
            setShown(true);
            observer.disconnect();
          }
        }
      },
      { threshold: [0, 0.2] },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as never}
      id={id}
      className={`reveal ${shown ? 'is-in' : ''} ${className}`}
      style={delay ? { ...style, transitionDelay: `${delay}ms` } : style}
    >
      {children}
    </Tag>
  );
}

/**
 * Convenience wrapper: staggers its children by 80ms each, the system default.
 * Children must be an array of elements — each is wrapped in its own `Reveal`.
 */
export function RevealList({
  items,
  className = '',
  itemClassName = '',
  as = 'div',
  itemAs = 'div',
  step = 80,
}: {
  items: ReactNode[];
  className?: string;
  itemClassName?: string;
  as?: 'div' | 'ul' | 'ol';
  itemAs?: 'div' | 'li' | 'article';
  step?: number;
}) {
  const Wrapper = as;
  return (
    <Wrapper className={className}>
      {items.map((item, index) => (
        <Reveal key={index} as={itemAs} className={itemClassName} delay={index * step}>
          {item}
        </Reveal>
      ))}
    </Wrapper>
  );
}
