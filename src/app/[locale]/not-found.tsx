import Link from 'next/link';
import { defaultLocale, localeHref } from '@/i18n/config';
import { getDictionary } from '@/i18n';
import { featuredProjects } from '@/content';
import { Section, SecHead, Tag } from '@/components/ui/Section';
import { Reveal } from '@/components/ui/Reveal';
import { Button } from '@/components/ui/Button';

/**
 * Locale-scoped 404. `not-found.tsx` cannot read route params, so it renders in
 * the default locale — the surrounding shell (nav pill, footer, direction)
 * still comes from the matched `[locale]` layout.
 */
export default function NotFound() {
  const locale = defaultLocale;
  const dict = getDictionary(locale);

  return (
    <>
      <div className="pt-[clamp(120px,15vh,168px)]" />

      <Section tone="alt" grain>
        <SecHead title={dict.notFound.code} intro={dict.notFound.text} />

        <Reveal className="mt-10 flex flex-wrap justify-center gap-3" delay={160}>
          <Button variant="dark" href={localeHref(locale, 'work')}>
            {dict.notFound.ctaWork}
          </Button>
          <Button variant="primary" href={localeHref(locale)}>
            {dict.notFound.ctaHome}
          </Button>
        </Reveal>

        <ul role="list" className="mx-auto mt-14 flex max-w-[700px] flex-col gap-3">
          {featuredProjects.map((project, index) => (
            <Reveal key={project.slug} as="li" delay={200 + index * 80}>
              <Link href={localeHref(locale, `work/${project.slug}`)} className="archive-row !bg-bg">
                <span className="flex flex-wrap items-center gap-3">
                  <Tag brand={project.accent}>{dict.classification[project.classification]}</Tag>
                  <span className="text-[17px] font-semibold text-ink">
                    {project.titleLocalized[locale]}
                  </span>
                </span>
                <span className="text-[13px] font-semibold text-accent">
                  {dict.common.readCaseStudy}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Section>
    </>
  );
}
