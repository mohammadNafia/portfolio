import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { isLocale, localeHref, locales, type Locale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { getProject, getNextProject, projects } from '@/content';
import { site } from '@/lib/site';
import { Section, SecHead, Sawtooth, Tag, Squiggle } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';
import { FanCardArt } from '@/components/home/FanCardArt';
import { BlockRenderer } from '@/components/case-study/Blocks';
import { ChapterNav } from '@/components/case-study/ChapterNav';
import { CreativeWorkSchema } from '@/components/seo/StructuredData';

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

  return {
    title: project.seo.title[locale],
    description: project.seo.description[locale],
    alternates: {
      canonical: localeHref(locale, `work/${slug}`),
      languages: {
        en: `/en/work/${slug}`,
        ar: `/ar/work/${slug}`,
        'x-default': `/en/work/${slug}`,
      },
    },
    /*
     * `images` is repeated here rather than inherited: Next.js replaces the
     * parent's `openGraph` object wholesale instead of merging into it, so
     * omitting it drops og:image from every case study. Facebook, LinkedIn,
     * WhatsApp and Slack all read og:image — those shares rendered with no
     * card image at all until this was set.
     */
    openGraph: {
      type: 'article',
      title: project.seo.title[locale],
      description: project.seo.description[locale],
      url: `${site.url}${localeHref(locale, `work/${slug}`)}`,
      locale: locale === 'ar' ? 'ar_IQ' : 'en_US',
      images: [
        { url: '/img/og.png', width: 1200, height: 630, alt: project.seo.title[locale] },
      ],
    },
    /*
     * Same reason, and the same trap in the other direction: with no `twitter`
     * block the page inherited the site-wide default, so a shared case study
     * announced the generic portfolio title instead of its own.
     */
    twitter: {
      card: 'summary_large_image',
      title: project.seo.title[locale],
      description: project.seo.description[locale],
      images: [
        { url: '/img/og.png', width: 1200, height: 630, alt: project.seo.title[locale] },
      ],
    },
  };
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
      <CreativeWorkSchema project={project} locale={locale} />

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
