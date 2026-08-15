import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, localeHref, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { projects, activeCategories } from '@/content';
import { Section, SecHead, Sawtooth } from '@/components/ui/Section';
import { WorkIndex } from '@/components/work/WorkIndex';

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
    title: dict.work.title,
    description: dict.work.support,
    alternates: {
      canonical: localeHref(locale, 'work'),
      languages: { en: '/en/work', ar: '/ar/work', 'x-default': '/en/work' },
    },
  };
}

export default async function WorkPage({
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
        <SecHead title={dict.work.eyebrow} intro={dict.work.support} />
      </Section>
      <Sawtooth tone="bg" />

      <Section tone="bg" wide>
        <WorkIndex
          projects={projects}
          categories={activeCategories()}
          locale={locale}
          dict={dict}
        />
      </Section>
    </>
  );
}
