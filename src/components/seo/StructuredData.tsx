import { site } from '@/lib/site';
import { getDictionary } from '@/i18n';
import { localeHref, type Locale } from '@/i18n/config';
import type { Project } from '@/content/schema';

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from local, typed content — never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

export function PersonSchema({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'Person',
        name: site.fullName,
        alternateName: locale === 'ar' ? site.nameAr : site.name,
        url: site.url,
        email: `mailto:${site.email}`,
        jobTitle: dict.meta.role,
        description: dict.meta.defaultDescription,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Baghdad',
          addressCountry: 'IQ',
        },
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: 'Al-Nahrain University — College of Engineering',
        },
        knowsLanguage: ['ar', 'en'],
        knowsAbout: [
          'Full-stack software engineering',
          'SaaS product engineering',
          'REST API architecture',
          'Arabic/English bilingual product implementation',
        ],
        sameAs: [site.linkedin, site.github],
      }}
    />
  );
}

export function CreativeWorkSchema({
  project,
  locale,
}: {
  project: Project;
  locale: Locale;
}) {
  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        name: project.title,
        headline: project.seo.title[locale],
        description: project.seo.description[locale],
        url: `${site.url}${localeHref(locale, `work/${project.slug}`)}`,
        inLanguage: locale,
        dateCreated: project.year,
        creator: {
          '@type': 'Person',
          name: site.fullName,
          url: site.url,
        },
        about: project.categoryLabel[locale],
        keywords: project.stack.join(', '),
      }}
    />
  );
}
