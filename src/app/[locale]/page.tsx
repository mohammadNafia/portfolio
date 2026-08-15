import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { projects, featuredProjects, archiveProjects } from '@/content';
import { Hero } from '@/components/home/Hero';
import { Sawtooth } from '@/components/ui/Section';
import {
  WorkGallery,
  Background,
  Proof,
  StackMarquee,
  CaseStudies,
  ArchiveStrip,
  WorkWithMe,
} from '@/components/home/sections';

/**
 * Canonical page order from the system's section recipes:
 *   nav pill · hero · sawtooth · work gallery · BACKGROUND · proof ·
 *   stack marquee · CASE STUDIES · archive · WORK WITH ME · footer
 *
 * A sawtooth sits at every background change — never a straight line. The
 * tone passed to each `Sawtooth` is the colour of the section *below* it.
 *
 * The hero → work seam is the exception: there the divider is the work
 * gallery's own first child, because that section has to climb over a hero that
 * lags behind it. See `.after-hero` and motion.md → "Hero overlay scroll".
 */
export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const dict = getDictionary(locale);

  const bySlug = (slug: string) => projects.find((project) => project.slug === slug)!;
  const fanOrder = [
    'invoice-mini-app',
    'form-builder',
    'immar',
    'sendy',
    'nano-ocr',
    'virtual-banking',
    'al-tafawuq',
  ].map(bySlug);

  return (
    <>
      {/*
        Fan order is positional, not ranked: index 3 is the centre card and
        gets the flagship, with the other two featured studies either side of
        it. The remaining slots are filled from the archive.
      */}
      <Hero locale={locale} dict={dict} projects={fanOrder} />

      {/* Its sawtooth is inside it — see the note above. */}
      <WorkGallery projects={projects} locale={locale} dict={dict} />
      <Sawtooth tone="alt" />

      <Background locale={locale} dict={dict} />
      <Sawtooth tone="bg" />

      <Proof dict={dict} />
      <Sawtooth tone="alt" />

      <StackMarquee dict={dict} />
      <Sawtooth tone="bg" />

      <CaseStudies projects={featuredProjects} locale={locale} dict={dict} />
      <Sawtooth tone="alt" />

      <ArchiveStrip projects={archiveProjects} locale={locale} dict={dict} />
      <Sawtooth tone="bg" />

      <WorkWithMe locale={locale} dict={dict} />
    </>
  );
}
