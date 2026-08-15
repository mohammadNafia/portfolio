'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { localeHref, type Locale } from '@/i18n/config';
import type { Project } from '@/content/schema';
import type { Dictionary } from '@/i18n/dictionaries/en';
import { FanCardArt } from './FanCardArt';
import { Tag } from '../ui/Section';

/**
 * Case-study carousel.
 *
 * The focused card sits at full scale and opacity; neighbours are at .94 / .85.
 * A round accent arrow hangs on the trailing edge, and dot pagination sits in a
 * surface pill below. Slide is 520ms.
 *
 * Every card links to a real case study — none of these is unwritten, so the
 * disabled "Coming soon..." variant never appears here. The system forbids it
 * where content exists.
 *
 * Keyboard: arrows move focus through the dots and the arrow button; each card
 * is a normal link, so tabbing through them works regardless of which is
 * focused. Touch: horizontal swipe.
 */
export function CaseCarousel({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [index, setIndex] = useState(0);
  const rtl = locale === 'ar';
  const touchStart = useRef<number | null>(null);

  const go = (next: number) => setIndex((next + projects.length) % projects.length);

  const mounted = useRef(false);

  useEffect(() => {
    // Bring the focused card into view when the *user* changes it. Skipped on
    // mount, or the page would scroll itself down to the carousel on load.
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const node = document.getElementById(`case-card-${index}`);
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
      aria-label={dict.home.cases.title}
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
      <ul role="list" className="carousel__track">
        {projects.map((project, cardIndex) => {
          const focused = cardIndex === index;
          return (
            <li
              key={project.slug}
              id={`case-card-${cardIndex}`}
              className="carousel__card"
              data-focused={focused}
              aria-current={focused ? 'true' : undefined}
            >
              <article className="case-card">
                <div className="case-card__cover" aria-hidden="true">
                  <FanCardArt project={project} />
                </div>

                <div className="case-card__body">
                  <Tag brand={project.accent}>{dict.classification[project.classification]}</Tag>

                  <h3 className="case-card__title">{project.titleLocalized[locale]}</h3>
                  <p className="case-card__text">{project.headline[locale]}</p>

                  <Link
                    href={localeHref(locale, `work/${project.slug}`)}
                    className="case-card__cta"
                  >
                    {dict.common.readCaseStudy}
                    <span aria-hidden="true" className="rtl:-scale-x-100">
                      →
                    </span>
                  </Link>
                </div>
              </article>
            </li>
          );
        })}
      </ul>

      <button
        type="button"
        className="carousel__arrow"
        onClick={() => go(index + 1)}
        aria-label={dict.home.cases.next}
      >
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

      <div className="carousel__dots" role="tablist" aria-label={dict.home.cases.title}>
        {projects.map((project, dotIndex) => (
          <button
            key={project.slug}
            type="button"
            role="tab"
            aria-selected={dotIndex === index}
            aria-label={project.title}
            className="carousel__dot"
            data-active={dotIndex === index}
            onClick={() => go(dotIndex)}
          />
        ))}
      </div>
    </div>
  );
}
