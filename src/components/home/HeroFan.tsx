'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { localeHref, type Locale } from '@/i18n/config';
import type { Project } from '@/content/schema';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { getFanArt } from '@/content/fan-art';
import { FanCardArt } from './FanCardArt';

/**
 * Hero fan — 7 rounded cards in a shallow arc, overlapping ~45%.
 *
 * Geometry is fixed by the component spec:
 *   rotate  -16 -11  -6   0   6  11  16   (deg)
 *   x      -330 -220 -110  0 110 220 330  (px)
 *   y        26   10    2  0   2  10  26  (px)
 *   z         1    2    3  4   3   2   1
 *
 * Load choreography (motion.md): the centre card lands at 0.20s, then the pairs
 * spread outward — (3,5) → (2,6) → (1,7) — 90ms apart, settling by ≈2.4s. After
 * that each card takes a slow idle float, desynchronised by index.
 *
 * Mobile keeps only indexes 3, 4, 5.
 *
 * The seven-slot geometry above is the spec and stays exactly as written, even
 * though only five of the seven projects have photography. Art is resolved per
 * project through `@/content/fan-art`; the two without a file yet (form-builder,
 * nano-ocr) keep the generated `FanCardArt` face, per the image manifest's rule
 * that a missing file gets a placeholder at the right ratio rather than a
 * stand-in borrowed from somewhere else.
 */

/** Slot index of the true centre card — the flagship, and the only preloaded one. */
const CENTRE = 3;

const LAYOUT = [
  { rotate: -16, x: -330, y: 26, z: 1 },
  { rotate: -11, x: -220, y: 10, z: 2 },
  { rotate: -6, x: -110, y: 2, z: 3 },
  { rotate: 0, x: 0, y: 0, z: 4 },
  { rotate: 6, x: 110, y: 2, z: 3 },
  { rotate: 11, x: 220, y: 10, z: 2 },
  { rotate: 16, x: 330, y: 26, z: 1 },
] as const;

/** Spread order: centre first, then outward in pairs. */
const SPREAD_STEP = [3, 2, 2, 0, 1, 2, 3] as const;

export function HeroFan({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [settled, setSettled] = useState(false);
  const [scale, setScale] = useState(1);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    setReduced(window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }, []);

  /* The arc is authored at 1080px of spread; shrink it proportionally below that. */
  useEffect(() => {
    function measure() {
      const width = window.innerWidth;
      setScale(Math.min(1, Math.max(0.42, (width - 40) / 980)));
    }
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  /* Idle float only starts once the fan has finished assembling. */
  useEffect(() => {
    const id = window.setTimeout(() => setSettled(true), reduced ? 0 : 2400);
    return () => window.clearTimeout(id);
  }, [reduced]);

  return (
    <div className="hero-fan" role="list" aria-label={dict.home.hero.orbitLabel}>
      {LAYOUT.map((position, index) => {
        const project = projects[index];
        if (!project) return null;

        const isMobileHidden = index < 2 || index > 4;
        const delay = reduced ? 0 : 200 + SPREAD_STEP[index]! * 90 + (index === CENTRE ? 0 : 350);
        const art = getFanArt(project.slug);

        return (
          <div
            key={project.slug}
            role="listitem"
            className={`hero-fan__slot ${isMobileHidden ? 'hero-fan__slot--wide-only' : ''}`}
            style={{
              zIndex: position.z,
              // Custom properties drive both the entrance and the resting state,
              // so one keyframe set can serve every card.
              ['--fan-x' as string]: `${position.x * scale}px`,
              ['--fan-y' as string]: `${position.y}px`,
              ['--fan-rot' as string]: `${position.rotate}deg`,
              ['--fan-delay' as string]: `${delay}ms`,
              ['--fan-float-delay' as string]: `${index * 0.4}s`,
            }}
            data-settled={settled}
          >
            <Link
              href={localeHref(locale, `work/${project.slug}`)}
              className="hero-fan__card"
              aria-label={`${project.title} — ${dict.common.readCaseStudy}`}
            >
              {art ? (
                /*
                 * Sized to the slot rather than to the file: the box is fixed by
                 * `.hero-fan__slot` at 210×280 (168×224 under 760px), and both
                 * are the file's own 3:4, so the reserved space and the painted
                 * space are identical and the fan never reflows.
                 *
                 * Only the centre card is preloaded — `priority` also emits
                 * `fetchpriority="high"`. The other six stay lazy: they are the
                 * same weight, and preloading all seven would push ~9MB of PNG
                 * ahead of the fonts.
                 */
                <Image
                  src={art.src}
                  alt={art.alt[locale]}
                  width={210}
                  height={280}
                  sizes="(max-width: 760px) 168px, 210px"
                  priority={index === CENTRE}
                  className="hero-fan__img"
                />
              ) : (
                <FanCardArt project={project} />
              )}
            </Link>
          </div>
        );
      })}
    </div>
  );
}
