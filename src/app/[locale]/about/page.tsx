import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeHref, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';
import { site, socialLinks } from '@/lib/site';
import { Section, SecHead, Sawtooth } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button, WavyLink } from '@/components/ui/Button';
import { BreadcrumbSchema } from '@/components/seo/StructuredData';

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  if (!isLocale(locale)) return {};
  const dict = getDictionary(locale);

  return pageMetadata({
    locale,
    path: 'about',
    title: dict.about.title,
    description: dict.about.lead,
  });
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);
  const { about } = dict;

  return (
    <>
      <BreadcrumbSchema locale={locale} trail={[{ name: dict.nav.about, path: 'about' }]} />

      <div className="pt-[clamp(120px,15vh,168px)]" />

      <Section tone="alt" grain>
        <SecHead as="h1" title={dict.nav.background} intro={about.lead} />
      </Section>
      <Sawtooth tone="bg" />

      <Section tone="bg">
        <div className="shell--read">
          {about.narrative.map((paragraph, index) => (
            <Reveal
              key={index}
              as="p"
              delay={index * 80}
              className="mb-6 text-[17px] leading-[1.8] text-ink-2"
            >
              {paragraph}
            </Reveal>
          ))}
        </div>
      </Section>
      <Sawtooth tone="alt" />

      <Section tone="alt" grain>
        <SecHead title={about.timelineTitle} />
        <ol className="mx-auto mt-14 flex max-w-[840px] flex-col gap-3">
          {about.timeline.map((entry, index) => (
            <Reveal key={index} as="li" delay={index * 80}>
              <div className="grid gap-2 rounded-card bg-bg p-6 md:grid-cols-[minmax(0,0.4fr)_minmax(0,1fr)] md:gap-6">
                <span className="ltr-island text-[13px] font-semibold text-ink-3">
                  {entry.period}
                </span>
                <div>
                  <h3 className="text-[17px] font-bold leading-snug text-ink">{entry.title}</h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{entry.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </ol>
      </Section>
      <Sawtooth tone="bg" />

      <Section tone="bg">
        <SecHead title={about.valuesTitle} />
        <ul role="list" className="features">
          {about.values.map((value, index) => (
            <Reveal key={value.title} as="li" delay={index * 80} className="feature">
              <span className="feature__icon" aria-hidden="true">
                <span className="pixel-title !text-[24px] leading-none">
                  {String(index + 1).padStart(2, '0')}
                </span>
              </span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </Reveal>
          ))}
        </ul>
      </Section>
      <Sawtooth tone="alt" />

      <Section tone="alt" grain>
        <SecHead title={about.stackTitle} />
        <ul role="list" className="mx-auto mt-14 grid max-w-[900px] gap-5 sm:grid-cols-2">
          {about.stackGroups.map((group, index) => (
            <Reveal
              key={group.title}
              as="li"
              delay={index * 80}
              className="rounded-card bg-bg p-6"
            >
              <h3 className="text-[15px] font-bold text-ink">{group.title}</h3>
              <ul role="list" className="ltr-island mt-4 flex flex-wrap gap-2">
                {group.items.map((item) => (
                  <li
                    key={item}
                    className="rounded-pill bg-surface px-3 py-1.5 text-[13px] font-medium text-ink-2"
                  >
                    {item}
                  </li>
                ))}
              </ul>
            </Reveal>
          ))}
        </ul>
      </Section>
      <Sawtooth tone="bg" />

      <Section tone="bg">
        <SecHead title={about.workingStyleTitle} />
        <ul role="list" className="shell--read mt-12 flex flex-col gap-4">
          {about.workingStyle.map((item, index) => (
            <Reveal
              key={index}
              as="li"
              delay={index * 80}
              className="flex gap-3 text-[17px] leading-[1.8] text-ink-2"
            >
              <span
                aria-hidden="true"
                className="mt-[13px] h-2 w-2 shrink-0 rounded-pill bg-accent-bright"
              />
              <span>{item}</span>
            </Reveal>
          ))}
        </ul>

        <Reveal className="shell--read mt-12" delay={200}>
          <h3 className="text-[15px] font-bold text-ink">{about.languagesTitle}</h3>
          <p className="mt-2 text-[17px] leading-[1.8] text-ink-2">{about.languages}</p>

          <p className="mt-8 text-[17px] leading-[1.8] text-ink-2">
            {socialLinks.map((link, index) => (
              <span key={link.key}>
                {index > 0 ? ' · ' : ''}
                <WavyLink href={link.href} external={link.key !== 'email'}>
                  {link.handle}
                </WavyLink>
              </span>
            ))}
          </p>

          <div className="mt-10">
            <Button variant="dark" href={localeHref(locale, 'contact')}>
              {about.cta}
            </Button>
          </div>
          {/* Contact does the same. `site.location` alone renders Latin on the Arabic page. */}
          <p className="mt-4 text-[13px] text-ink-3">
            {locale === 'ar' ? site.locationAr : site.location}
          </p>
        </Reveal>
      </Section>
    </>
  );
}
