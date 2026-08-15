import type { CSSProperties, ReactNode } from 'react';
import { Reveal } from './Reveal';

/**
 * The hand-drawn squiggle underline. A sine wave, never a zigzag.
 * Decorative — hidden from assistive technology.
 */
export function Squiggle({ className = '' }: { className?: string }) {
  return (
    <svg
      className={`squiggle ${className}`}
      viewBox="0 0 240 12"
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      <path
        d="M2 6 Q8 1 14 6 T26 6 T38 6 T50 6 T62 6 T74 6 T86 6 T98 6 T110 6 T122 6
           T134 6 T146 6 T158 6 T170 6 T182 6 T194 6 T206 6 T218 6 T230 6 T238 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Mandatory section header: pixel title + squiggle, centred.
 * Every section on the site uses this — no exceptions.
 *
 * `as` exists only so the *first* header on a sub-page can be the document's
 * `h1`. Sub-pages had no `h1` at all: they opened with this component, which
 * always emitted `h2`, so /work, /services, /about, /contact and /privacy each
 * shipped a document whose outline started at level two and whose strongest
 * on-page heading signal was missing entirely. Home and the case studies were
 * unaffected — they author their own `h1`.
 *
 * Default stays `h2`; exactly one caller per page passes `as="h1"`.
 */
export function SecHead({
  title,
  intro,
  delay = 0,
  as: Heading = 'h2',
}: {
  title: string;
  intro?: string;
  delay?: number;
  as?: 'h1' | 'h2';
}) {
  return (
    <>
      <Reveal as="header" className="sec-head" delay={delay}>
        <Heading className="pixel-title">{title}</Heading>
        <Squiggle />
      </Reveal>
      {intro ? (
        <Reveal as="p" className="sec-intro" delay={delay + 80}>
          {intro}
        </Reveal>
      ) : null}
    </>
  );
}

/**
 * The sawtooth divider. Goes at every background change — never a straight
 * line, never a curve. Teeth point up into the section above.
 *
 * `tone` is the colour of the section *below*, since the teeth are cut out of
 * that colour and overlap upward.
 *
 * Between two static sections it can ride as a sibling. Where the section below
 * has to travel over the one above — the hero — it has to be that section's own
 * first child instead, via `Section`'s `sawtooth` prop. See `.after-hero`.
 */
export function Sawtooth({ tone = 'bg' }: { tone?: 'bg' | 'alt' }) {
  return <div className={`sawtooth ${tone === 'alt' ? 'sawtooth--alt' : ''}`} aria-hidden="true" />;
}

type SectionProps = {
  children: ReactNode;
  id?: string;
  className?: string;
  /** Alternating background creates the page's rhythm. */
  tone?: 'bg' | 'alt';
  /** Paper grain — only on `alt` sections, per the token spec. */
  grain?: boolean;
  wide?: boolean;
  style?: CSSProperties;
  /**
   * Renders the divider as this section's own first child rather than as a
   * sibling, so it travels with the section and can cut across whatever the
   * section climbs over. Required on `.after-hero`; unnecessary between two
   * static sections.
   */
  sawtooth?: 'bg' | 'alt';
};

export function Section({
  children,
  id,
  className = '',
  tone = 'bg',
  grain = false,
  wide = false,
  style,
  sawtooth,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`section ${tone === 'alt' ? 'section--alt' : ''} ${
        grain ? 'grain relative' : ''
      } ${className}`}
      style={style}
    >
      {sawtooth ? <Sawtooth tone={sawtooth} /> : null}
      <div className={`shell ${wide ? 'shell--wide' : ''} relative`}>{children}</div>
    </section>
  );
}

/**
 * WCAG relative luminance of a `#rrggbb` colour.
 * Used to decide what a brand tag's text colour has to be.
 */
function luminance(hex: string): number {
  const value = hex.replace('#', '');
  const channels = [0, 2, 4].map((offset) => {
    const c = Number.parseInt(value.slice(offset, offset + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  }) as [number, number, number];
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

/**
 * Tag pill. Neutral by default; pass a project's brand colour for the branded
 * variant, which is the single sanctioned exception to the one-accent rule.
 *
 * The spec pairs brand backgrounds with white text, but that only works for dark
 * brands — white on Sendy's amber measures 2.07:1. The text colour is therefore
 * chosen from the brand's own luminance: white on dark brands, ink on light
 * ones. The brand colour survives, and the label stays readable either way.
 */
export function Tag({
  children,
  brand,
  className = '',
}: {
  children: ReactNode;
  brand?: string;
  className?: string;
}) {
  if (brand) {
    /*
     * At 13px the label needs 4.5:1. Ink clears that on any brand lighter than
     * L≈0.198; white clears it on any brand darker than L≈0.183. Brands landing
     * between the two — NANO's copper, for one — fail both, so those get mixed
     * toward ink until white passes. The hue survives in every case.
     */
    const l = luminance(brand);
    const background = l >= 0.198 || l <= 0.183 ? brand : `color-mix(in srgb, ${brand} 75%, #111111)`;
    const color = l >= 0.198 ? 'var(--color-ink)' : '#fff';

    return (
      <span className={`tag tag--brand ${className}`} style={{ backgroundColor: background, color }}>
        {children}
      </span>
    );
  }
  return <span className={`tag ${className}`}>{children}</span>;
}

/**
 * Technical tokens (stack names, identifiers) stay left-to-right in both
 * locales, and read as quiet surface chips rather than bordered badges.
 */
export function StackList({ items, className = '' }: { items: string[]; className?: string }) {
  return (
    <ul role="list" className={`ltr-island flex flex-wrap gap-2 ${className}`}>
      {items.map((item) => (
        <li
          key={item}
          className="rounded-pill bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2"
        >
          {item}
        </li>
      ))}
    </ul>
  );
}

/** Label/value metadata pair — surface-filled, no borders. */
export function MetaItem({
  label,
  value,
  ltrValue = false,
}: {
  label: string;
  value: string;
  ltrValue?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <dt className="text-[13px] font-semibold text-ink-3">{label}</dt>
      <dd className={`text-[15px] text-ink ${ltrValue ? 'ltr-island' : ''}`}>{value}</dd>
    </div>
  );
}

export function MetaList({
  children,
  className = '',
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <dl className={`grid grid-cols-2 gap-x-6 gap-y-6 sm:grid-cols-4 ${className}`}>{children}</dl>
  );
}
