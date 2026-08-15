'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { localeHref, switchLocalePath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';

/**
 * Floating nav pill.
 *
 * Two states, per the component spec:
 *   collapsed  — avatar + CTA only, ≈260px, at the top of the home page
 *   expanded   — avatar + links + CTA, ≈560px, after ~70% of the hero
 *
 * On sub-pages it starts expanded: there is no hero to collapse against, and
 * orientation matters more than the reveal.
 *
 * The links stay in the DOM and remain tabbable in both states — the collapsed
 * pill expands on focus-within, so navigation is never gated behind scrolling.
 */
export function SiteHeader({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState<string>('');
  const navRef = useRef<HTMLElement>(null);

  const isHome = pathname === localeHref(locale);

  /* Home page anchors; sub-pages route back to the home sections. */
  const links = [
    { id: 'work', label: dict.nav.work },
    { id: 'background', label: dict.nav.about },
    { id: 'case-studies', label: dict.nav.caseStudies },
  ];

  function hrefFor(id: string) {
    return isHome ? `#${id}` : `${localeHref(locale)}#${id}`;
  }

  useEffect(() => {
    if (!isHome) {
      setScrolled(true);
      return;
    }
    function onScroll() {
      setScrolled(window.scrollY > window.innerHeight * 0.7);
    }
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [isHome]);

  /* Scroll-spy: the visible section's link goes --ink + weight 600. */
  useEffect(() => {
    if (!isHome) return;
    const sections = links
      .map((link) => document.getElementById(link.id))
      .filter((element): element is HTMLElement => element !== null);
    if (sections.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]?.target.id) setActive(visible[0].target.id);
      },
      { rootMargin: '-96px 0px -55% 0px', threshold: 0 },
    );

    for (const section of sections) observer.observe(section);
    return () => observer.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome, pathname]);

  const expanded = scrolled || focused;
  const otherLocale: Locale = locale === 'en' ? 'ar' : 'en';

  return (
    <nav
      ref={navRef}
      aria-label={dict.nav.home}
      data-expanded={expanded}
      className="nav-pill"
      onFocus={() => setFocused(true)}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) setFocused(false);
      }}
    >
      {/*
        The portrait. `priority` because the pill is fixed at the top of every
        page and therefore always in the first viewport — left lazy it pops in
        after paint. 40px at 2× needs 80px and the widest variant Next emits
        here is 96px; the served file is 256² so the disc stays sharp well past
        that.
      */}
      <Link
        href={localeHref(locale)}
        aria-label={dict.meta.siteName}
        className="nav-pill__avatar"
      >
        <Image
          src="/img/avatar.webp"
          alt={dict.alt.avatar}
          width={40}
          height={40}
          priority
        />
      </Link>

      <div className="nav-pill__links">
        {links.map((link) => (
          <a
            key={link.id}
            href={hrefFor(link.id)}
            className={active === link.id ? 'is-active' : ''}
            aria-current={active === link.id ? 'true' : undefined}
          >
            {link.label}
          </a>
        ))}
        <Link
          href={switchLocalePath(pathname, otherLocale)}
          lang={otherLocale}
          hrefLang={otherLocale}
          aria-label={
            otherLocale === 'ar' ? dict.common.switchToArabic : dict.common.switchToEnglish
          }
        >
          {otherLocale === 'ar' ? 'ع' : 'EN'}
        </Link>
      </div>

      <a href={hrefFor('work-with-me')} className="nav-pill__cta">
        {dict.common.workWithMe}
      </a>
    </nav>
  );
}
