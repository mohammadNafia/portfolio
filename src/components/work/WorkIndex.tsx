'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { localeHref, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Category, Project } from '@/content/schema';
import { Reveal } from '../ui/Reveal';
import { Tag } from '../ui/Section';
import { FanCardArt } from '../home/FanCardArt';

/**
 * Work index. Filtering is client-side because the project count is small
 * enough that a round trip would be slower than the interaction.
 *
 * The filter is a real radio group — keyboard and screen readers get correct
 * semantics — styled as the system's pill row. The result count is announced
 * politely.
 */
export function WorkIndex({
  projects,
  categories,
  locale,
  dict,
}: {
  projects: Project[];
  categories: Category[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [filter, setFilter] = useState<Category | 'all'>('all');

  const visible = useMemo(
    () => (filter === 'all' ? projects : projects.filter((p) => p.category === filter)),
    [projects, filter],
  );

  return (
    <>
      <fieldset className="mt-12 border-0 p-0">
        <legend className="mb-4 w-full text-[13px] font-semibold uppercase tracking-wide text-ink-3">
          {dict.work.filterLabel}
        </legend>

        <div className="flex flex-wrap items-center gap-2">
          <Chip
            label={dict.work.filterAll}
            checked={filter === 'all'}
            onChange={() => setFilter('all')}
          />
          {categories.map((category) => (
            <Chip
              key={category}
              label={dict.category[category]}
              checked={filter === category}
              onChange={() => setFilter(category)}
            />
          ))}
        </div>

        <p className="mt-4 text-[13px] text-ink-3" role="status" aria-live="polite">
          {visible.length} {dict.work.resultsCount}
        </p>
      </fieldset>

      {visible.length === 0 ? (
        <p className="mt-14 text-ink-2">{dict.work.empty}</p>
      ) : (
        <ul role="list" className="mt-12 grid gap-6 md:grid-cols-2">
          {visible.map((project, index) => (
            <Reveal key={project.slug} as="li" delay={index * 80}>
              <Link
                href={localeHref(locale, `work/${project.slug}`)}
                className="case-card block h-full"
                aria-label={`${project.title} — ${dict.common.readCaseStudy}`}
              >
                <span className="case-card__cover" aria-hidden="true">
                  <FanCardArt project={project} />
                </span>
                <span className="case-card__body">
                  <Tag brand={project.accent}>{dict.classification[project.classification]}</Tag>
                  <span className="case-card__title">{project.titleLocalized[locale]}</span>
                  <span className="case-card__text">{project.headline[locale]}</span>
                  <span className="case-card__cta">
                    {dict.common.readCaseStudy}
                    <span aria-hidden="true" className="rtl:-scale-x-100">
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      )}
    </>
  );
}

function Chip({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <label className="cursor-pointer">
      <input
        type="radio"
        name="work-filter"
        checked={checked}
        onChange={onChange}
        className="peer sr-only"
      />
      <span
        className={`block rounded-pill px-4 py-2.5 text-[15px] font-semibold transition-colors duration-[var(--dur-link)] peer-focus-visible:shadow-[0_0_0_3px_var(--color-accent)] ${
          checked ? 'bg-ink text-bg' : 'bg-surface text-ink-2 hover:text-ink'
        }`}
      >
        {label}
      </span>
    </label>
  );
}
