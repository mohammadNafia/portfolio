import Link from 'next/link';
import { localeHref, type Locale } from '@/i18n/config';
import type { Dictionary } from '@/i18n/dictionaries/en';
import type { Project } from '@/content/schema';
import { site } from '@/lib/site';
import { Section, SecHead, Tag } from '../ui/Section';
import { Reveal } from '../ui/Reveal';
import { Button } from '../ui/Button';
import { FanCardArt } from './FanCardArt';
import { SettleGrid } from './SettleGrid';
import { Carousel, type CarouselItem } from './Carousel';
import { ContactForm } from '../contact/ContactForm';

/**
 * The home page is one authored document (see the note over `home` in
 * `dictionaries/en.ts`). Every section below renders a block of that copy
 * verbatim; the slug lists are the only thing the components add, because the
 * copy names products and the router needs routes.
 *
 * Each list is index-aligned with its dictionary array. Reorder one and you must
 * reorder the other — `tests/unit/content.test.ts` asserts the lengths match.
 */
/*
 * NANO left this list for Virtual Banking API. It is not gone from the site:
 * it keeps its tier-1 case study, its slot in the hero fan and its card in the
 * archive carousel below — only the selected-work grid changed.
 */
const WORK_SLUGS = ['sendy', 'immar', 'virtual-banking', 'al-tafawuq'] as const;
const CASE_SLUGS = ['sendy', 'immar', 'virtual-banking'] as const;
const ARCHIVE_SLUGS = [
  'al-tafawuq',
  'nano-ocr',
  'form-builder',
  'invoice-mini-app',
  'medichub',
] as const;

/** The trailing arrow in every "→" call to action, mirrored for RTL. */
function Arrow() {
  return (
    <span aria-hidden="true" className="rtl:-scale-x-100">
      →
    </span>
  );
}

/* ------------------------------------------------------------ Selected work */

/**
 * Four products, each with its own paragraph — so the copy sits under the tile
 * rather than behind a hover state that a phone never gets.
 *
 * This is also the panel that climbs over the hero, so it owns its own sawtooth
 * and carries `.after-hero` — see motion.md → "Hero overlay scroll".
 *
 * Every tile keeps the site's one entrance, the `Reveal` blur-up, and the grid
 * adds the settling-weight move on top of it — see `SettleGrid` for what that
 * is and, more to the point, for why it is built out of bounded constants
 * rather than tuned magnitudes. The two compose because they touch different
 * properties on different elements: `Reveal` owns opacity and blur on the
 * `<li>`, the settle owns transform on the element inside it.
 *
 * This slot previously held a scroll-linked zoom-out, which was removed rather
 * than tuned a fifth time.
 */
export function SelectedWork({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const { work } = dict.home;

  return (
    <Section id="work" tone="bg" wide sawtooth="bg" className="after-hero">
      <SecHead title={work.title} intro={work.intro} />

      <SettleGrid className="gallery gallery--work mt-16">
        {work.items.map((item, index) => {
          const slug = WORK_SLUGS[index]!;
          const project = projects.find((candidate) => candidate.slug === slug)!;

          return (
            <Reveal key={slug} as="li" delay={index * 80} className="gallery__item">
              {/*
                The settle's transform goes here, not on the `<li>` — the cell
                itself must never transform, or the grid tracks resolve off a
                moving box. `data-settle` is what `SettleGrid` collects.
              */}
              <div className="settle__inner" data-settle>
                <Link
                  href={localeHref(locale, `work/${slug}`)}
                  className="case-card block h-full"
                  aria-label={`${item.title} — ${item.cta}`}
                >
                  <span className="case-card__cover" aria-hidden="true">
                    <FanCardArt project={project} />
                  </span>
                  <span className="case-card__body">
                    <span className="case-card__title">{item.title}</span>
                    <span className="case-card__sub">{item.subtitle}</span>
                    <span className="case-card__text">{item.text}</span>
                    <span className="case-card__cta">
                      {item.cta}
                      <Arrow />
                    </span>
                  </span>
                </Link>
              </div>
            </Reveal>
          );
        })}
      </SettleGrid>
    </Section>
  );
}

/* --------------------------------------------------------------- Background */

/**
 * The longest prose on the page, centred on a single axis — no side column, no
 * offset measure, nothing asymmetric.
 *
 * The empty portrait slot that used to sit beside it is gone rather than
 * waiting. It was a 3:4 `--surface` rectangle standing in for a photograph
 * nobody had supplied, and an empty grey block beside a paragraph does not read
 * as a reserved space — it reads as an image that failed to load. Dropping it
 * also removes the one place on the page where the copy ran to one side. If a
 * portrait ever arrives it belongs above the prose, on the same axis as
 * everything else here, not in a column of its own.
 *
 * The résumé download closes the section: its own line, centred, a dark pill.
 * A plain `<a download>` at a static path — one click, straight to the file.
 */
export function Background({ dict }: { dict: Dictionary }) {
  const { background } = dict.home;

  return (
    <Section id="background" tone="alt" grain>
      <SecHead title={background.title} />

      <div className="prose-block prose-block--centred mt-12">
        <Reveal as="p" className="prose-block__lead" delay={80}>
          {background.lead}
        </Reveal>

        {background.paragraphs.map((paragraph, index) => (
          <Reveal key={index} as="p" className="prose-block__p" delay={140 + index * 60}>
            {paragraph}
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-14 flex justify-center" delay={240}>
        <Button variant="dark" href="/Mohammed-nafia-cv.pdf" download>
          {background.cv}
        </Button>
      </Reveal>
    </Section>
  );
}

/* -------------------------------------------------------------- How I work */

export function HowIWork({ dict }: { dict: Dictionary }) {
  const { process } = dict.home;

  return (
    <Section id="process" tone="bg">
      <SecHead title={process.title} />

      <ol role="list" className="steps mt-14">
        {process.steps.map((step, index) => (
          <Reveal key={step.number} as="li" delay={index * 80} className="step">
            <h3 className="step__title">
              {/*
                `pixel-num` keeps Handjet on Arabic pages. Arabic display type
                falls back to IBM Plex Sans Arabic (see globals.css), but that
                swap exists for joined script — these are Latin digits, which
                Handjet renders correctly, so the pixel identity survives here.
                The em dash is the copy's own, not a separator we invented.
              */}
              <span className="step__num pixel-num">{step.number}</span>
              {' — '}
              {step.title}
            </h3>

            {step.text.map((paragraph, textIndex) => (
              <p key={textIndex} className="step__text">
                {paragraph}
              </p>
            ))}
          </Reveal>
        ))}
      </ol>
    </Section>
  );
}

/* ------------------------------------------------------- Results & milestones */

/**
 * Awards and the founder claim, as pixel-numeral rows.
 *
 * This occupies the slot the reference gave to a "Notable Clients" logo wall.
 * No client has given permission to be named, so a logo wall here would be
 * invented — verified results go in its place.
 *
 * `note` is an array because the Arabic section deliberately carries no support
 * line: it opens straight on the first result.
 */
export function Results({ dict }: { dict: Dictionary }) {
  const { results } = dict.home;

  return (
    <Section id="results" tone="alt" grain>
      <SecHead title={results.title} />

      {results.note.map((line, index) => (
        <Reveal key={index} as="p" className="sec-intro" delay={80}>
          {line}
        </Reveal>
      ))}

      <ul role="list" className="results mt-14">
        {results.items.map((item, index) => (
          <Reveal key={`${item.value}-${index}`} as="li" delay={index * 80} className="result">
            <span className="result__value pixel-title">{item.value}</span>

            <div className="result__body">
              {'event' in item ? <span className="result__event ltr-island">{item.event}</span> : null}
              <p className="result__text">{item.text}</p>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------- Technologies */

/**
 * The stack, grouped as the copy groups it, one marquee per group — see the
 * note over `.tech-rows` for why it is a row each rather than one long track.
 *
 * The loop is a 50% translate over a track duplicated end to end, so the second
 * half is the first half again and is hidden from assistive technology. A short
 * group is repeated until it is long enough to fill half a track: with three
 * items the "duplicate" would be less than a screen wide and the row would run
 * with a hole in it.
 */
/**
 * Half a track has to be at least as wide as the widest container it runs in —
 * the 1240px wide shell — or the loop shows daylight at the seam. Twelve tokens
 * clears that with margin at every size in the four groups; the smallest group
 * has three, so it repeats four times.
 */
const MARQUEE_MIN_ITEMS = 12;

export function Technologies({ dict }: { dict: Dictionary }) {
  const { tech } = dict.home;

  return (
    <Section id="tech" tone="bg" wide>
      <SecHead title={tech.title} intro={tech.intro} />

      <ul role="list" className="tech-rows mt-14">
        {tech.groups.map((group, index) => {
          const half = [...group.items];
          while (half.length < MARQUEE_MIN_ITEMS) half.push(...group.items);
          const track = [...half, ...half];

          return (
            <Reveal key={group.title} as="li" delay={index * 80}>
              <p className="tech-row__label">{group.title}</p>

              <div className="marquee">
                <ul role="list" className="marquee__track">
                  {track.map((item, itemIndex) => (
                    <li
                      key={`${item}-${itemIndex}`}
                      className="tech-row__item ltr-island"
                      aria-hidden={itemIndex >= half.length ? 'true' : undefined}
                    >
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}

/* ------------------------------------------------------------- Case studies */

/**
 * Three studies, as full-width rows that alternate side. The prose here is the
 * densest on the page — two or three paragraphs each — and a row gives it a
 * measure to run in while keeping an image slot beside every one of them.
 */
export function CaseStudies({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const { cases } = dict.home;

  return (
    <Section id="case-studies" tone="alt" grain wide>
      <SecHead title={cases.title} />

      {cases.intro.map((paragraph, index) => (
        <Reveal key={index} as="p" className="sec-intro" delay={80 + index * 60}>
          {paragraph}
        </Reveal>
      ))}

      <div className="cases mt-16">
        {cases.items.map((item, index) => {
          const slug = CASE_SLUGS[index]!;
          const project = projects.find((candidate) => candidate.slug === slug)!;

          return (
            <Reveal key={slug} as="article" className="case-row" delay={80}>
              <div className="case-row__media" data-flip={index % 2 === 1 ? 'true' : undefined}>
                <FanCardArt project={project} />
              </div>

              <div className="case-row__body">
                <h3 className="case-row__title">{item.title}</h3>
                <p className="case-row__sub">{item.subtitle}</p>

                {item.paragraphs.map((paragraph, textIndex) => (
                  <p key={textIndex} className="case-row__text">
                    {paragraph}
                  </p>
                ))}

                <Link href={localeHref(locale, `work/${slug}`)} className="case-card__cta">
                  {item.cta}
                  <Arrow />
                </Link>
              </div>
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}

/* ------------------------------------------------------------ Archive strip */

/**
 * The archive rides the shared `Carousel` — the same one any section can use,
 * not a second implementation of it.
 *
 * Two things this section forces:
 *
 * The description is CLAMPED. In a grid an uneven paragraph just made an uneven
 * card; in a carousel the focused card is the one being read, and NANO's two
 * paragraphs against Form Builder's one line meant the whole band changed
 * height on every slide. The flex track already equalises the cards to the
 * tallest one, so the clamp is what stops that tallest one being three times
 * the others. The full text is one click away in the case study.
 *
 * The paragraphs are joined by a space rather than stacked, because
 * `-webkit-line-clamp` counts lines in one block and does not see block
 * children. No word changes, and the break survives where it matters — on the
 * case-study page.
 *
 * The whole carousel is ONE `Reveal`, not one per card. Revealing the cards
 * individually inside a track that also slides read as a band of cards moving
 * on their own, which is the thing the section is not.
 */
export function ArchiveStrip({
  projects,
  locale,
  dict,
}: {
  projects: Project[];
  locale: Locale;
  dict: Dictionary;
}) {
  const { archive } = dict.home;

  const items: CarouselItem[] = archive.items.map((item, index) => {
    const slug = ARCHIVE_SLUGS[index]!;
    const project = projects.find((candidate) => candidate.slug === slug)!;

    return {
      key: slug,
      label: item.title,
      card: (
        <Link
          href={localeHref(locale, `work/${slug}`)}
          className="case-card block h-full"
          aria-label={`${item.title} — ${item.cta}`}
        >
          <span className="case-card__cover" aria-hidden="true">
            <FanCardArt project={project} />
          </span>

          <span className="case-card__body">
            <Tag brand={project.accent}>{dict.classification[project.classification]}</Tag>
            <span className="case-card__title">{item.title}</span>
            <span className="case-card__sub">{item.subtitle}</span>
            <span className="case-card__text case-card__text--clamp">
              {item.paragraphs.join(' ')}
            </span>

            <span className="case-card__cta">
              {item.cta}
              <Arrow />
            </span>
          </span>
        </Link>
      ),
    };
  });

  return (
    <Section id="archive" tone="bg" wide>
      <SecHead title={archive.title} intro={archive.support} />

      <Reveal delay={120}>
        <Carousel
          items={items}
          locale={locale}
          label={archive.title}
          nextLabel={dict.common.nextCard}
        />
      </Reveal>
    </Section>
  );
}

/* ------------------------------------------------------------- Work with me */

export function WorkWithMe({ locale, dict }: { locale: Locale; dict: Dictionary }) {
  const services = dict.services.items.map((item) => item.title);
  const { contact } = dict.home;

  /* Dialled, not displayed: the copy's spacing is for reading, `tel:` is not. */
  const dial = `tel:${site.phone.replace(/[^\d+]/g, '')}`;

  return (
    <Section id="work-with-me" tone="alt" grain>
      <SecHead title={contact.title} />

      <div className="prose-block prose-block--centred mt-10">
        {contact.paragraphs.map((paragraph, index) => (
          <Reveal key={index} as="p" className="prose-block__p" delay={80 + index * 60}>
            {paragraph}
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-10" delay={200}>
        <ul role="list" className="contact-lines" aria-label={contact.directLabel}>
          <li>
            <a className="wavy ltr-island" href={`mailto:${site.email}`}>
              {site.email}
            </a>
          </li>
          <li>
            <a className="wavy ltr-island" href={dial}>
              {site.phone}
            </a>
          </li>
          <li>
            <a className="wavy" href={site.linkedin} target="_blank" rel="noopener noreferrer">
              {contact.linkedin}
            </a>
          </li>
          <li>
            <a className="wavy" href={site.github} target="_blank" rel="noopener noreferrer">
              {contact.github}
            </a>
          </li>
        </ul>
      </Reveal>

      <Reveal className="mx-auto mt-14 max-w-[700px]" delay={240}>
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
    /* The case studies are a home-page section, not a route of their own. */
    { href: `${localeHref(locale)}#case-studies`, label: dict.nav.caseStudies },
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

      <p className="mt-6 text-[13px] text-ink-3">{dict.footer.tagline}</p>
    </footer>
  );
}
