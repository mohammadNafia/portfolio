import Link from 'next/link';
import { localeHref, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Project } from '@/content/schema';
import { site, socialLinks } from '@/lib/site';
import { Section, SecHead, Tag } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import { Button, WavyLink } from '../ui/Button';
import { FanCardArt } from './FanCardArt';
import { GalleryZoom } from './GalleryZoom';
import { CaseCarousel } from './CaseCarousel';
import { ContactForm } from '../contact/ContactForm';

/* ------------------------------------------------------------ Work gallery */

/**
 * Mixed-ratio gallery. Hover blurs and dims the face, scales the tile, and
 * fades in a centred caption. On touch there is no hover, so the caption
 * becomes a permanent label beneath the tile instead.
 *
 * This is also the panel that climbs over the hero, so it owns its own sawtooth
 * and carries `.after-hero` — see motion.md → "Hero overlay scroll".
 *
 * One tile does the scroll-linked zoom-out reveal instead of the blur-up — see
 * `GalleryZoom` and `assets/gallery-zoom-reveal.md`.
 */

/**
 * Which tile zooms. Exactly one per grid: two of them fight for z-index and read
 * as a glitch.
 *
 * Index 3 rather than the flagship at index 0, because index 0 is in the first
 * row at every breakpoint. Its oversized state would be drawn over a hero that
 * is still on screen, lagging at 0.2× while the sawtooth cuts through it — two
 * signature moves colliding in the same 400px of scroll. From row two down, the
 * hero is already covered and the zoom has the screen to itself.
 */
const ZOOM_INDEX = 3;

export function WorkGallery({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const ratios = ['4/3', '1/1', '9/16', '1/1', '4/3', '4/3', '9/16', '1/1'];

  return (
    <Section id="work" tone="bg" wide sawtooth="bg" className="after-hero gallery-panel">
      <SecHead title={dict.home.work.title} intro={dict.home.work.intro} />

      <ul role="list" className="gallery mt-16">
        {projects.map((project, index) => {
          const style = { aspectRatio: ratios[index % ratios.length] };
          const face = (
            <Link
              href={localeHref(locale, `work/${project.slug}`)}
              className="gallery__link"
              aria-label={`${project.title} — ${dict.common.readCaseStudy}`}
            >
              <span className="gallery__face">
                <FanCardArt project={project} />
              </span>
              <span className="gallery__cap">
                <span className="block text-[15px] font-semibold">
                  {project.titleLocalized[locale]}
                </span>
                <span className="mt-1 block text-[13px] opacity-80">
                  {project.categoryLabel[locale]}
                </span>
              </span>
            </Link>
          );

          /* The zoom is this tile's entrance, so it does not also blur up. */
          return index === ZOOM_INDEX ? (
            <GalleryZoom key={project.slug} style={style}>
              {face}
            </GalleryZoom>
          ) : (
            <Reveal
              key={project.slug}
              as="li"
              delay={index * 80}
              className="gallery__item"
              style={style}
            >
              {face}
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* --------------------------------------------------------------- BACKGROUND */

export function Background({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const { background } = dict.home;

  return (
    <Section id="background" tone="alt" grain>
      <SecHead title={background.title} />

      <div className="mx-auto mt-7 max-w-[700px]">
        {background.paragraphs.map((paragraph, index) => (
          <Reveal key={index} as="p" delay={160 + index * 80} className="sec-intro">
            {paragraph}
          </Reveal>
        ))}
      </div>

      <ul role="list" className="features">
        {background.features.map((feature, index) => (
          <Reveal key={feature.title} as="li" delay={index * 80} className="feature">
            <span className="feature__icon" aria-hidden="true">
              <span className="pixel-title !text-[26px] leading-none">
                {String(index + 1).padStart(2, '0')}
              </span>
            </span>
            <h3>{feature.title}</h3>
            <p>{feature.text}</p>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-14 flex justify-center" delay={280}>
        <Button variant="dark" href={localeHref(locale, 'about')}>
          {background.cta}
        </Button>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------------- Proof */

/**
 * Awards and the founder claim, as pixel-numeral stats.
 *
 * This occupies the slot the reference gave to a "Notable Clients" logo wall.
 * No client has given permission to be named, so a logo wall here would be
 * invented — verified proof goes in its place.
 */
export function Proof({ dict }: { dict: Dictionary }) {
  const { credibility } = dict.home;

  return (
    <Section tone="bg">
      <SecHead title={credibility.title} intro={credibility.note} />

      <ul role="list" className="features">
        {credibility.items.map((item, index) => (
          <Reveal key={item.value} as="li" delay={index * 80} className="feature">
            <span className="pixel-title block !text-[clamp(26px,3.4vw,38px)]">{item.value}</span>
            <p className="mt-3">{item.label}</p>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------------ Marquee */

/**
 * Tools marquee. The reference ran client logos here; this runs the stack,
 * which is the honest version — the tools are verifiable, the clients are not
 * mine to name.
 */
export function StackMarquee({ dict }: { dict: Dictionary }) {
  const items = dict.home.stack.items;
  const track = [...items, ...items];

  return (
    <Section tone="alt" grain className="!py-[clamp(56px,7vw,96px)]">
      <Reveal className="text-center">
        <p className="text-[13px] font-semibold uppercase tracking-wide text-ink-3">
          {dict.home.stack.label}
        </p>
      </Reveal>

      <div className="marquee mt-8">
        <ul role="list" className="marquee__track">
          {track.map((item, index) => (
            <li
              key={`${item}-${index}`}
              className="ltr-island whitespace-nowrap text-[17px] font-semibold text-ink opacity-75"
              aria-hidden={index >= items.length ? 'true' : undefined}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------- Case studies */

export function CaseStudies({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section id="case-studies" tone="bg" wide>
      <SecHead title={dict.home.cases.title} intro={dict.home.cases.intro} />
      <CaseCarousel projects={projects} locale={locale} dict={dict} />
    </Section>
  );
}

/* ------------------------------------------------------------- Archive strip */

export function ArchiveStrip({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  return (
    <Section tone="alt" grain>
      <SecHead title={dict.home.archive.title} intro={dict.home.archive.support} />

      <ul role="list" className="mt-14 flex flex-col gap-3">
        {projects.map((project, index) => (
          <Reveal key={project.slug} as="li" delay={index * 80}>
            <Link
              href={localeHref(locale, `work/${project.slug}`)}
              className="archive-row"
              aria-label={`${project.title} — ${dict.common.readCaseStudy}`}
            >
              <span className="flex flex-wrap items-center gap-3">
                <Tag brand={project.accent}>{dict.classification[project.classification]}</Tag>
                <span className="text-[17px] font-semibold text-ink">
                  {project.titleLocalized[locale]}
                </span>
              </span>
              <span className="text-[15px] text-ink-2">{project.headline[locale]}</span>
              <span className="text-[13px] font-semibold text-accent">
                {dict.common.readCaseStudy}
              </span>
            </Link>
          </Reveal>
        ))}
      </ul>

      <Reveal className="mt-12 flex justify-center" delay={200}>
        <Button variant="dark" href={localeHref(locale, 'work')}>
          {dict.home.archive.cta}
        </Button>
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------- Work with me */

export function WorkWithMe({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const services = dict.services.items.map((item) => item.title);

  return (
    <Section id="work-with-me" tone="bg">
      <SecHead title={dict.home.contact.title} />

      <Reveal className="mx-auto mt-7 max-w-[700px]" delay={80}>
        <p className="sec-intro !mt-0">
          {dict.home.contact.lead}{' '}
          <WavyLink href={`mailto:${site.email}`}>{site.email}</WavyLink>
          {', '}
          <WavyLink href={site.linkedin} external>
            {dict.common.linkedin}
          </WavyLink>{' '}
          {dict.home.contact.or}{' '}
          <WavyLink href={site.github} external>
            {dict.common.github}
          </WavyLink>
          .
        </p>
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-[700px]" delay={160}>
        <ContactForm locale={locale} dict={dict} services={services} />
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------------- Footer */

export function FooterLine({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const navLinks = [
    { href: localeHref(locale, 'work'), label: dict.nav.work },
    { href: localeHref(locale, 'about'), label: dict.nav.about },
    { href: localeHref(locale, 'services'), label: dict.nav.services },
    { href: localeHref(locale, 'contact'), label: dict.nav.contact },
    { href: localeHref(locale, 'privacy'), label: dict.privacy.title },
  ];

  return (
    <footer className="px-[var(--pad-x)] py-10 pb-14 text-center">
      {/*
        The nav pill drops its links below 760px, so the footer carries the
        routes — otherwise they would be unreachable on a phone.
      */}
      <nav aria-label={dict.footer.navTitle}>
        <ul role="list" className="flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-[13px] text-ink-2 underline-offset-4 hover:text-ink hover:underline"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <ul role="list" className="mt-3 flex flex-wrap items-center justify-center gap-x-5 gap-y-2">
        {socialLinks.map((link) => (
          <li key={link.key}>
            <a
              href={link.href}
              {...(link.key === 'email' ? {} : { target: '_blank', rel: 'noopener noreferrer' })}
              className="ltr-island text-[13px] text-ink-3 underline-offset-4 hover:text-ink hover:underline"
            >
              {link.handle}
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-6 text-[13px] text-ink-3">{dict.footer.tagline}</p>
    </footer>
  );
}
