'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { localeHref, localeLabel, switchLocalePath, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';

/**
 * Floating nav pill.
 *
 * Two states, per the component spec:
 *   collapsed  — avatar + locale + CTA, ≈310px, at the top of the home page
 *   expanded   — avatar + links + locale + CTA, ≈600px, after ~70% of the hero
 *
 * Only the link group collapses. The avatar, the locale switch and the CTA are
 * permanent at every breakpoint.
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

    /*
     * Geometry per frame, not an IntersectionObserver — and the swap is a
     * correctness fix rather than a preference.
     *
     * An observer callback carries only the entries that CHANGED, so any rule
     * written over `entries` is answering "what just crossed a boundary"
     * instead of "what am I looking at". Two bugs came out of that. Reading the
     * active section from a single batch meant scrolling out of the last
     * section delivered one `isIntersecting: false` entry, the filter emptied,
     * and nothing was set — so "Case Studies" stayed lit through the archive,
     * the contact form and the footer, a third of the page claiming to be a
     * section the reader had left. Accumulating the entries into a set instead
     * fixed the clearing but left stale members: a section could sit in the set
     * after an anchor jump had carried it off screen without a delivered exit,
     * and the nav would report `work` while `background` filled the viewport.
     *
     * The rule below has no history in it at all. There is one reading line,
     * just under the nav pill, and the active section is whichever one that
     * line is INSIDE. Nothing to accumulate, nothing to go stale, and the
     * answer at any scroll position depends only on that scroll position.
     *
     * The `null` case is deliberate and load-bearing: the archive and contact
     * sections have no nav link, so when the line is in one of them no link is
     * highlighted. An honest blank beats pointing at the wrong section.
     */
    const NAV_CLEARANCE = 120;

    let queued = false;

    const paint = () => {
      queued = false;
      let current = '';
      for (const section of sections) {
        const rect = section.getBoundingClientRect();
        if (rect.top <= NAV_CLEARANCE && rect.bottom > NAV_CLEARANCE) current = section.id;
      }
      setActive(current);
    };

    const onScroll = () => {
      if (queued) return;
      queued = true;
      requestAnimationFrame(paint);
    };

    paint();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
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
      </div>

      {/*
        The locale switch is a permanent part of the pill, not one of the
        collapsible links. On a bilingual site it is the one control that can
        never be hidden: below 760px the link group drops out entirely, and an
        Arabic reader landing on /en would have been left editing the URL by
        hand. It sits between the links and the CTA so the pill still reads
        identity → navigation → locale → action in both directions.
      */}
      <Link
        href={switchLocalePath(pathname, otherLocale)}
        lang={otherLocale}
        hrefLang={otherLocale}
        className="nav-pill__locale"
        aria-label={
          otherLocale === 'ar' ? dict.common.switchToArabic : dict.common.switchToEnglish
        }
      >
        {localeLabel[otherLocale]}
      </Link>

      <a href={hrefFor('work-with-me')} className="nav-pill__cta">
        {dict.common.workWithMe}
      </a>
    </nav>
  );
}
