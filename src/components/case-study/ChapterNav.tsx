'use client';

import { useEffect, useRef, useState } from 'react';
import type { Chapter } from '@/content/schema';
import type { Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';

/**
 * Sticky chapter rail for multi-chapter sub-pages.
 *
 * A `--surface` pill listing the chapters; active is `--ink`, the rest
 * `--ink-2`. Scroll-spy is identical to the main nav. On narrow screens it
 * becomes a horizontally scrolling strip so it never eats vertical space.
 */
export function ChapterNav({
  chapters,
  locale,
  dict,
}: {
  chapters: Chapter[];
  locale: Locale;
  dict: Dictionary;
}) {
  const [activeId, setActiveId] = useState<string | undefined>(chapters[0]?.id);
  const listRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActiveId(visible[0].target.id);
      },
      { rootMargin: '-104px 0px -60% 0px', threshold: 0 },
    );

    for (const chapter of chapters) {
      const element = document.getElementById(chapter.id);
      if (element) observer.observe(element);
    }
    return () => observer.disconnect();
  }, [chapters]);

  const mounted = useRef(false);

  // Keep the active chip in view as the reader scrolls — but never on mount.
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    const list = listRef.current;
    if (!list || !activeId) return;
    list
      .querySelector<HTMLElement>(`[data-chapter="${activeId}"]`)
      ?.scrollIntoView({ block: 'nearest', inline: 'center', behavior: 'smooth' });
  }, [activeId]);

  return (
    <nav aria-label={dict.caseStudy.chaptersLabel} className="chapter-rail">
      <ul ref={listRef} role="list" className="chapter-rail__list">
        {chapters.map((chapter) => {
          const active = chapter.id === activeId;
          return (
            <li key={chapter.id}>
              <a
                href={`#${chapter.id}`}
                data-chapter={chapter.id}
                data-active={active}
                aria-current={active ? 'true' : undefined}
              >
                {chapter.title[locale]}
              </a>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
