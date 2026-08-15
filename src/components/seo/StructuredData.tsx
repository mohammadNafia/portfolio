import { site } from '@/lib/site';
import { getDictionary } from '@/i18n';
import { localeHref, type Locale } from '@/i18n/config';
import type { Project } from '@/content/schema';
import lastmod from '@/content/lastmod.generated.json';

/*
 * Stable `@id` values so the graph is linked rather than repeated. Every schema
 * on the site points at the same Person and the same WebSite node instead of
 * inlining a fresh copy, which is what lets a crawler merge them into one
 * entity instead of treating each page's Person as a separate individual.
 */
const PERSON_ID = `${site.url}/#person`;
const WEBSITE_ID = `${site.url}/#website`;

function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      // Structured data is generated from local, typed content — never user input.
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}

/**
 * `project.year` is display copy, not a date: it holds values like `2025—2026`.
 * The old markup fed that string straight to `dateCreated`, which is not a
 * parseable date at all.
 *
 * The replacement is `copyrightYear`, which takes a plain Number and is exactly
 * what we know. It is deliberately not `datePublished`: a bare `2026` is a
 * partial date that validators flag, and widening it to `2026-01-01` would be
 * inventing a day nobody recorded.
 */
function projectYear(year: string): number | undefined {
  const match = /(\d{4})/.exec(year)?.[1];
  return match ? Number(match) : undefined;
}

/**
 * Site-wide graph: the Person and the WebSite.
 *
 * Rendered once per page from the locale layout. Only `Person` existed before,
 * so the site published no site-level entity at all — nothing tied the pages
 * together as one property, and the Person node carried no skills, no
 * languages as language objects, and no location beyond a bare locality.
 *
 * There is deliberately no `SearchAction`: the site has no search endpoint, and
 * declaring a sitelinks searchbox that resolves to nothing is a claim about a
 * feature that does not exist.
 */
export function SiteSchema({ locale }: { locale: Locale }) {
  const dict = getDictionary(locale);

  const graph: Record<string, unknown>[] = [
    {
      '@type': 'Person',
      '@id': PERSON_ID,
      name: site.fullName,
      alternateName: [site.name, site.nameAr],
      url: site.url,
      email: `mailto:${site.email}`,
      telephone: site.phone,
      jobTitle: dict.meta.role,
      description: dict.meta.defaultDescription,
      image: `${site.url}/img/avatar-256.webp`,
      /*
       * Location is stated three ways because they answer different questions:
       * `address` is the postal fact, `homeLocation` is where he is, and
       * `workLocation` is where he takes work from — which is wider than the
       * city and is the honest answer for a remote freelancer.
       */
      address: {
        '@type': 'PostalAddress',
        addressLocality: 'Baghdad',
        addressRegion: 'Baghdad Governorate',
        addressCountry: 'IQ',
      },
      homeLocation: {
        '@type': 'Place',
        name: site.location,
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Baghdad',
          addressCountry: 'IQ',
        },
      },
      workLocation: [
        { '@type': 'Place', name: 'Baghdad, Iraq' },
        { '@type': 'Place', name: 'Remote' },
      ],
      alumniOf: {
        '@type': 'CollegeOrUniversity',
        name: 'Al-Nahrain University — College of Engineering',
        address: {
          '@type': 'PostalAddress',
          addressLocality: 'Baghdad',
          addressCountry: 'IQ',
        },
      },
      knowsLanguage: [
        { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
        { '@type': 'Language', name: 'English', alternateName: 'en' },
      ],
      /*
       * Skills, as things this person knows about. Every entry here is backed by
       * a case study or the CV — nothing is added because it is a good keyword.
       */
      knowsAbout: [
        'Full-stack web development',
        'SaaS product engineering',
        'Multi-tenant architecture',
        'REST API design',
        'ASP.NET Core',
        'C#',
        'React',
        'Next.js',
        'TypeScript',
        'FastAPI',
        'Python',
        'PostgreSQL',
        'Entity Framework Core',
        'Clean Architecture',
        'Role-based access control',
        'JWT authentication',
        'Operational dashboards',
        'AI integration and OCR pipelines',
        'Workflow automation',
        'Arabic/English bilingual product implementation',
        'RTL interface engineering',
        'Docker',
        'Deployment and production hardening',
      ],
      /*
       * Only awards that are stated on the site and traceable to a named event.
       * No invented placements, no unnamed "recognition".
       */
      award: [
        '1st place — ITS Hackathon 2025 (NANO, AI-powered OCR platform)',
        '2nd place — HUB200 Hackathon 2025 (Dynamic Form Builder, Global Entrepreneurship Week)',
        'Selected — Iraqi Young Leaders Exchange Program (IYLEP), United States',
      ],
      sameAs: [site.linkedin, site.github],
    },
    {
      '@type': 'WebSite',
      '@id': WEBSITE_ID,
      url: site.url,
      name: dict.meta.siteName,
      alternateName: [site.name, site.nameAr],
      description: dict.meta.defaultDescription,
      inLanguage: ['en', 'ar'],
      publisher: { '@id': PERSON_ID },
      author: { '@id': PERSON_ID },
      copyrightHolder: { '@id': PERSON_ID },
    },
  ];

  return <JsonLd data={{ '@context': 'https://schema.org', '@graph': graph }} />;
}

/**
 * Breadcrumb trail for a sub-page.
 *
 * This is the one rich result the site can realistically earn — the others
 * (Article, Software App, Review) each require properties that would have to be
 * invented. The locale home is always position 1; callers supply the rest.
 *
 * Emitted per page rather than from the layout because the layout cannot see the
 * route, and a trail that is wrong is worse than no trail.
 */
export function BreadcrumbSchema({
  locale,
  trail,
}: {
  locale: Locale;
  /** Below the locale home, in order. `path` is locale-less, e.g. `work/sendy`. */
  trail: { name: string; path: string }[];
}) {
  const dict = getDictionary(locale);

  const crumbs = [{ name: dict.nav.home, url: `${site.url}${localeHref(locale)}` }].concat(
    trail.map((crumb) => ({
      name: crumb.name,
      url: `${site.url}${localeHref(locale, crumb.path)}`,
    })),
  );

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        '@id': `${crumbs[crumbs.length - 1]!.url}#breadcrumb`,
        itemListElement: crumbs.map((crumb, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: crumb.name,
          item: crumb.url,
        })),
      }}
    />
  );
}

/**
 * Case-study page.
 *
 * The page is a `CreativeWork` — an article about a product — and the product
 * itself hangs off it as a `SoftwareApplication` via `about`. Splitting them is
 * the accurate description: the thing that has a `datePublished` and an author
 * is the write-up, and the thing that has an `applicationCategory` is the
 * software.
 *
 * No `offers` and no `aggregateRating`: those are required for Google's Software
 * App rich result, and neither a price nor a rating exists for these systems.
 * The markup is valid schema.org and will simply not produce a rich result,
 * which is the correct outcome rather than a fabricated one.
 */
export function CaseStudySchema({ project, locale }: { project: Project; locale: Locale }) {
  const dict = getDictionary(locale);
  const url = `${site.url}${localeHref(locale, `work/${project.slug}`)}`;
  const modified = lastmod.projects[project.slug as keyof typeof lastmod.projects];
  const year = projectYear(project.year);
  const localizedTitle = project.titleLocalized[locale];

  const APPLICATION_CATEGORY: Record<string, string> = {
    saas: 'BusinessApplication',
    product: 'BusinessApplication',
    backend: 'DeveloperApplication',
    ai: 'BusinessApplication',
    mobile: 'MobileApplication',
    dashboard: 'BusinessApplication',
    experiment: 'DeveloperApplication',
  };

  return (
    <JsonLd
      data={{
        '@context': 'https://schema.org',
        '@type': 'CreativeWork',
        '@id': `${url}#case-study`,
        name: project.seo.title[locale],
        headline: project.seo.title[locale],
        description: project.seo.description[locale],
        url,
        inLanguage: locale,
        isPartOf: { '@id': WEBSITE_ID },
        author: { '@id': PERSON_ID },
        creator: { '@id': PERSON_ID },
        ...(modified ? { dateModified: modified } : {}),
        ...(year ? { copyrightYear: year } : {}),
        image: `${site.url}/img/og.png`,
        keywords: project.stack.join(', '),
        about: {
          '@type': 'SoftwareApplication',
          name: project.title,
          /* Only when the localised name is actually different — on `en` it is not. */
          ...(localizedTitle !== project.title ? { alternateName: localizedTitle } : {}),
          description: project.summary[locale],
          applicationCategory: APPLICATION_CATEGORY[project.category] ?? 'BusinessApplication',
          operatingSystem: project.category === 'mobile' ? 'Android, iOS' : 'Web',
          inLanguage: ['ar', 'en'],
          author: { '@id': PERSON_ID },
          /* The real technologies, not a keyword list. */
          softwareRequirements: project.stack.join(', '),
          ...(year ? { copyrightYear: year } : {}),
        },
        mentions: project.stack.map((item) => ({ '@type': 'Thing', name: item })),
        genre: dict.category[project.category],
      }}
    />
  );
}
