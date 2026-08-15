'use client';

import Link from 'next/link';
import { useRef, type ButtonHTMLAttributes, type ReactNode } from 'react';

/**
 * The four button variants from the system. Every one is a pill.
 * Hover lifts 2px and darkens; press scales to .96.
 */

const base =
  'btn inline-flex items-center justify-center gap-2 rounded-pill font-semibold text-[15px] leading-none cursor-pointer border-0 ' +
  'transition-[transform,background-color,box-shadow] duration-[var(--dur-btn)] ease-[var(--ease-hover)] ' +
  'active:scale-[.96] disabled:pointer-events-none disabled:opacity-60';

const variants = {
  primary: 'bg-accent text-on-accent px-[22px] py-3 shadow-[var(--shadow-btn)] hover:bg-accent-press hover:-translate-y-0.5',
  dark: 'bg-ink text-bg px-[26px] py-3.5 shadow-[var(--shadow-btn-dark)] hover:-translate-y-0.5',
  quiet: 'bg-transparent text-accent px-0 py-2.5 hover:text-accent-press',
  disabled: 'bg-surface text-ink-3 px-[22px] py-3 pointer-events-none',
} as const;

type Variant = keyof typeof variants;

type NativeButtonProps = Omit<
  ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDragStart' | 'onDragEnd' | 'onDrag' | 'style'
>;

/**
 * Dark buttons emit a short radial "pop" on click — a ring scaling 0.6 → 1.6
 * while fading out over 400ms. It is in the reference, and it is skipped
 * entirely under reduced motion.
 */
function usePop() {
  const ref = useRef<HTMLElement | null>(null);

  function pop(event: { clientX: number; clientY: number }) {
    const host = ref.current;
    if (!host) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rect = host.getBoundingClientRect();
    const ring = document.createElement('span');
    ring.setAttribute('aria-hidden', 'true');
    ring.style.cssText = [
      'position:fixed',
      `left:${event.clientX}px`,
      `top:${event.clientY}px`,
      'width:48px',
      'height:48px',
      'margin:-24px 0 0 -24px',
      'border-radius:999px',
      'border:1px solid currentColor',
      'color:var(--color-ink)',
      'pointer-events:none',
      'z-index:var(--z-dialog)',
      'opacity:.55',
      'transform:scale(.6)',
      'transition:transform 400ms var(--ease-out),opacity 400ms var(--ease-out)',
    ].join(';');
    document.body.appendChild(ring);
    requestAnimationFrame(() => {
      ring.style.transform = 'scale(1.6)';
      ring.style.opacity = '0';
    });
    window.setTimeout(() => ring.remove(), 480);
    void rect;
  }

  return { ref, pop };
}

type ButtonProps = {
  children: ReactNode;
  variant?: Variant;
  href?: string;
  external?: boolean;
  className?: string;
} & NativeButtonProps;

export function Button({
  children,
  variant = 'primary',
  href,
  external,
  className = '',
  ...rest
}: ButtonProps) {
  const { ref, pop } = usePop();
  const classes = `${base} ${variants[variant]} ${className}`;

  if (href) {
    const shared = {
      className: classes,
      ref: ref as never,
      onClick: variant === 'dark' ? pop : undefined,
    };
    return external ? (
      <a href={href} target="_blank" rel="noopener noreferrer" {...shared}>
        {children}
      </a>
    ) : (
      <Link href={href} {...shared}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type="button"
      className={classes}
      ref={ref as never}
      onClick={(event) => {
        if (variant === 'dark') pop(event);
        rest.onClick?.(event);
      }}
      {...rest}
    >
      {children}
    </button>
  );
}

/** Inline "Read Case Study"-style link. */
export function QuietLink({
  children,
  href,
  external,
  className = '',
}: {
  children: ReactNode;
  href: string;
  external?: boolean;
  className?: string;
}) {
  const classes = `inline-flex items-center gap-2 font-semibold text-[15px] text-accent transition-colors duration-[var(--dur-link)] hover:text-accent-press ${className}`;
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {children}
    </Link>
  );
}

/** Wavy-underline inline link, used inside prose. */
export function WavyLink({
  children,
  href,
  external,
}: {
  children: ReactNode;
  href: string;
  external?: boolean;
}) {
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className="wavy">
      {children}
    </a>
  ) : (
    <Link href={href} className="wavy">
      {children}
    </Link>
  );
}
