import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeHref, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { site } from '@/lib/site';
import { Section, SecHead, Sawtooth } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { WavyLink } from '@/components/ui/Button';

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

  return {
    title: dict.privacy.title,
    description: dict.privacy.sections[0]?.text ?? '',
    alternates: {
      canonical: localeHref(locale, 'privacy'),
      languages: { en: '/en/privacy', ar: '/ar/privacy', 'x-default': '/en/privacy' },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  return (
    <>
      <div className="pt-[clamp(120px,15vh,168px)]" />

      <Section tone="alt" grain>
        <SecHead title={dict.privacy.title} />
        <Reveal className="mt-6 text-center" delay={80}>
          <p className="text-[13px] text-ink-3">
            {dict.privacy.updated}: <span className="ltr-island">2026-08-14</span>
          </p>
        </Reveal>
      </Section>
      <Sawtooth tone="bg" />

      <Section tone="bg">
        <ol className="shell--read flex flex-col gap-4">
          {dict.privacy.sections.map((section, index) => (
            <Reveal
              key={section.title}
              as="li"
              delay={index * 80}
              className="rounded-card bg-surface p-6"
            >
              <h2 className="text-[17px] font-bold text-ink">{section.title}</h2>
              <p className="mt-2 text-[15px] leading-relaxed text-ink-2">{section.text}</p>
            </Reveal>
          ))}
        </ol>

        <Reveal className="shell--read mt-10" delay={200}>
          <p className="text-[15px] text-ink-2">
            <WavyLink href={`mailto:${site.email}`}>{site.email}</WavyLink>
          </p>
        </Reveal>
      </Section>
    </>
  );
}
