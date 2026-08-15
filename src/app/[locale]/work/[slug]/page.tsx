import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, localeHref, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';
import { getProject, getNextProject, projects } from '@/content';
import { Section, SecHead, Sawtooth, Tag, Squiggle } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { FanCardArt } from '@/components/home/FanCardArt';
import { BlockRenderer } from '@/components/case-study/Blocks';
import { ChapterNav } from '@/components/case-study/ChapterNav';
import { CaseStudySchema, BreadcrumbSchema } from '@/components/seo/StructuredData';

export function generateStaticParams() {
  return locales.flatMap((locale) => projects.map((project) => ({ locale, slug: project.slug })));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const project = getProject(slug);
  if (!project) return {};

  /*
   * `pageMetadata` carries the openGraph and twitter blocks that used to be
   * spelled out here. They cannot be omitted: Next.js replaces the parent's
   * `openGraph` object wholesale instead of merging into it, so a case study
   * with no block of its own loses og:image entirely and announces the generic
   * portfolio title when shared. That is also why the other five routes now go
   * through the same helper — they were still inheriting the homepage's card.
   */
  return pageMetadata({
    locale,
    path: `work/${slug}`,
    title: project.seo.title[locale],
    description: project.seo.description[locale],
  });
}

/**
 * Case-study sub-page, per the sub-page skeleton:
 *   page hero (--bg-alt + grain, tag, UI-font title, deck, cover → sawtooth)
 *   chapter rail · body at 720px · prev/next pair · same footer
 *
 * The title is set in the UI face, not the pixel face — long titles in pixel
 * are unreadable. Chapter openers still use the pixel title + squiggle, exactly
 * like a home section.
 */
export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  if (!isLocale(raw)) notFound();
  const locale: Locale = raw;
  const project = getProject(slug);
  if (!project) notFound();

  const dict = getDictionary(locale);
  const next = getNextProject(slug);
  const previousIndex =
    (projects.findIndex((p) => p.slug === slug) - 1 + projects.length) % projects.length;
  const previous = projects[previousIndex]!;

  return (
    <div style={{ ['--accent' as string]: project.accent }}>
      <CaseStudySchema project={project} locale={locale} />
      <BreadcrumbSchema
        locale={locale}
        trail={[
          { name: dict.nav.work, path: 'work' },
          { name: project.titleLocalized[locale], path: `work/${project.slug}` },
        ]}
      />

      {/* --------------------------------------------------------- Hero */}
      <header className="relative grain bg-bg-alt px-[var(--pad-x)] pb-0 pt-[clamp(120px,15vh,168px)]">
        <div className="shell relative text-center">
          <Reveal className="flex flex-col items-center gap-4">
            <Tag brand={project.accent}>{dict.classification[project.classification]}</Tag>

            <h1 className="max-w-[18ch] text-[clamp(32px,5vw,58px)] font-bold leading-[1.1] tracking-tight text-ink rtl:tracking-normal rtl:leading-[1.35]">
              {project.titleLocalized[locale]}
            </h1>

            <p className="max-w-[56ch] text-[17px] leading-[1.75] text-ink-2">
              {project.headline[locale]}
            </p>
          </Reveal>

          <Reveal className="mt-10" delay={80}>
            <div className="overflow-hidden rounded-image bg-surface shadow-[var(--shadow-card)]">
              <div className="aspect-[16/9]">
                <FanCardArt project={project} variant={project.cover} />
              </div>
            </div>
            <p className="mx-auto mt-4 max-w-[68ch] text-[13px] leading-relaxed text-ink-3">
              {dict.caseStudy.conceptNotice}
            </p>
          </Reveal>

          <div className="h-[clamp(56px,8vw,96px)]" />
        </div>
      </header>
      <Sawtooth tone="bg" />

      {/* ----------------------------------------------------- Overview */}
      <Section tone="bg">
        <div className="shell--read">
          <Reveal>
            <dl className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <Meta label={dict.common.role} value={project.role[locale]} />
              <Meta label={dict.common.year} value={project.year} ltr />
              <Meta label={dict.common.status} value={project.status[locale]} />
              <Meta label={dict.common.category} value={dict.category[project.category]} />
            </dl>
          </Reveal>

          <Reveal as="p" delay={80} className="mt-10 text-[clamp(19px,2vw,23px)] leading-[1.55] text-ink">
            {project.summary[locale]}
          </Reveal>

          <Reveal delay={160} className="mt-8 grid gap-4 sm:grid-cols-2">
            <div className="rounded-card bg-surface p-6">
              <h2 className="text-[13px] font-semibold text-ink-3">{dict.caseStudy.problem}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">
                {project.problem[locale]}
              </p>
            </div>
            <div className="rounded-card bg-surface p-6">
              <h2 className="text-[13px] font-semibold" style={{ color: project.accent }}>
                {dict.caseStudy.outcome}
              </h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink">
                {project.outcome[locale]}
              </p>
            </div>
          </Reveal>

          <Reveal delay={240} className="mt-8">
            <h2 className="text-[13px] font-semibold text-ink-3">{dict.common.stack}</h2>
            <ul role="list" className="ltr-island mt-3 flex flex-wrap gap-2">
              {project.stack.map((item) => (
                <li
                  key={item}
                  className="rounded-pill bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2"
                >
                  {item}
                </li>
              ))}
            </ul>
          </Reveal>

          {/*
            Every project already carried a `services` array in its content and
            nothing rendered it, so the case studies — by far the most
            substantial pages on the site — had no link to /services at all.
            Traffic could arrive at a detailed write-up of the exact work
            somebody wanted to buy and find no path to the page that sells it,
            only prev/next and the footer. This is that path, and it is also
            what tells a crawler which studies support which service.
          */}
          <Reveal delay={280} className="mt-8">
            <h2 className="text-[13px] font-semibold text-ink-3">{dict.caseStudy.services}</h2>
            <ul role="list" className="mt-3 flex flex-wrap gap-2">
              {project.services.map((service) => (
                <li key={service.en}>
                  <Link
                    href={localeHref(locale, 'services')}
                    className="block rounded-pill bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2 transition-colors duration-[var(--dur-link)] hover:bg-ink hover:text-bg"
                  >
                    {service[locale]}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={320} className="mt-8">
            <Link
              href={localeHref(locale, 'work')}
              className="text-[13px] font-semibold text-accent underline-offset-4 hover:underline"
            >
              <span aria-hidden="true" className="rtl:-scale-x-100">
                ←
              </span>{' '}
              {dict.common.backToWork}
            </Link>
          </Reveal>
        </div>
      </Section>

      {/* ----------------------------------------------------- Chapters */}
      <ChapterNav chapters={project.chapters} locale={locale} dict={dict} />

      <Section tone="bg" className="!pt-6">
        <div className="shell--read flex flex-col gap-[clamp(64px,8vw,110px)]">
          {project.chapters.map((chapter) => (
            <section key={chapter.id} id={chapter.id} className="scroll-mt-[132px]">
              <Reveal as="header" className="sec-head !items-start">
                <h2 className="pixel-title !text-start">{chapter.title[locale]}</h2>
                <Squiggle className="!w-[min(92%,260px)]" />
              </Reveal>

              <div className="mt-8 flex flex-col gap-7">
                {chapter.blocks.map((block, index) => (
                  <BlockRenderer
                    key={index}
                    block={block}
                    locale={locale}
                    dict={dict}
                    project={project}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      </Section>
      <Sawtooth tone="alt" />

      {/* ------------------------------------------------------- Prev/next */}
      <Section tone="alt" grain>
        <SecHead title={dict.caseStudy.nextLabel} />
        <ul role="list" className="mt-12 grid gap-4 md:grid-cols-2">
          {[previous, next].map((entry, index) => (
            <Reveal key={entry.slug} as="li" delay={index * 80}>
              <Link href={localeHref(locale, `work/${entry.slug}`)} className="archive-row !bg-bg">
                <span className="flex flex-wrap items-center gap-3">
                  <Tag brand={entry.accent}>{dict.classification[entry.classification]}</Tag>
                </span>
                <span className="text-[19px] font-semibold text-ink">
                  {entry.titleLocalized[locale]}
                </span>
                <span className="text-[13px] font-semibold text-accent">
                  {dict.common.readCaseStudy}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>

        <Reveal className="mt-14 text-center" delay={200}>
          <h2 className="pixel-title">{dict.caseStudy.ctaTitle}</h2>
          <p className="sec-intro">{dict.caseStudy.ctaText}</p>
          <div className="mt-8 flex justify-center">
            <Button variant="dark" href={localeHref(locale, 'contact')}>
              {dict.caseStudy.ctaButton}
            </Button>
          </div>
        </Reveal>
      </Section>
    </div>
  );
}

function Meta({ label, value, ltr }: { label: string; value: string; ltr?: boolean }) {
  return (
    <div>
      <dt className="text-[13px] font-semibold text-ink-3">{label}</dt>
      <dd className={`mt-1.5 text-[15px] text-ink ${ltr ? 'ltr-island' : ''}`}>{value}</dd>
    </div>
  );
}
