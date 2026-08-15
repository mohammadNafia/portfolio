import { notFound } from 'next/navigation';
import { isLocale } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { projects } from '@/content';
import { Hero } from '@/components/home/Hero';
import { Sawtooth } from '@/components/ui/Section';
import {
  SelectedWork,
  Background,
  HowIWork,
  Results,
  Technologies,
  CaseStudies,
  ArchiveStrip,
  WorkWithMe,
} from '@/components/home/sections';

/**
 * Section order is the copy document's order, not a layout preference:
 *   nav pill · hero · SELECTED WORK · BACKGROUND (+ résumé) · HOW I WORK ·
 *   RESULTS & MILESTONES · TECHNOLOGIES · CASE STUDIES · ARCHIVE ·
 *   WORK WITH ME · footer
 *
 * The tone alternates bg → alt at every step so no two neighbouring sections
 * share a ground, and a sawtooth sits at every one of those changes — never a
 * straight line. The tone passed to each `Sawtooth` is the colour of the
 * section *below* it.
 *
 * The hero → work seam is the exception: there the divider is the selected-work
 * section's own first child, because that section has to climb over a hero that
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
      <SelectedWork projects={projects} locale={locale} dict={dict} />
      <Sawtooth tone="alt" />

      <Background dict={dict} />
      <Sawtooth tone="bg" />

      <HowIWork dict={dict} />
      <Sawtooth tone="alt" />

      <Results dict={dict} />
      <Sawtooth tone="bg" />

      <Technologies dict={dict} />
      <Sawtooth tone="alt" />

      <CaseStudies projects={projects} locale={locale} dict={dict} />
      <Sawtooth tone="bg" />

      <ArchiveStrip projects={projects} locale={locale} dict={dict} />
      <Sawtooth tone="alt" />

      <WorkWithMe locale={locale} dict={dict} />
      {/* The footer sits on `--bg`, so the last alt section needs its own cut. */}
      <Sawtooth tone="bg" />
    </>
  );
}
