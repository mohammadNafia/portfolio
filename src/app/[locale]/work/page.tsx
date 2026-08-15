import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { isLocale, locales } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { pageMetadata } from '@/lib/metadata';
import { projects, activeCategories } from '@/content';
import { Section, SecHead, Sawtooth } from '@/components/ui/Section';
import { WorkIndex } from '@/components/work/WorkIndex';
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
    path: 'work',
    title: dict.work.title,
    description: dict.work.support,
  });
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
      <BreadcrumbSchema locale={locale} trail={[{ name: dict.nav.work, path: 'work' }]} />

      <div className="pt-[clamp(120px,15vh,168px)]" />
      <Section tone="alt" grain>
        <SecHead as="h1" title={dict.work.eyebrow} intro={dict.work.support} />
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
