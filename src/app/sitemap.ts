import type { MetadataRoute } from 'next';
import { locales, type Locale } from '@/i18n/config';
import { projects } from '@/content';
import { site } from '@/lib/site';
import lastmod from '@/content/lastmod.generated.json';

const STATIC_PATHS = ['', 'work', 'services', 'about', 'contact', 'privacy'] as const;

/**
 * Relative weight of each route within this site. Absolute values mean nothing
 * to a crawler — only the ordering does, which is why the two commercial pages
 * outrank the archive and the privacy notice sits at the floor rather than
 * sharing 0.7 with `/services` as it used to.
 */
const PRIORITY: Record<(typeof STATIC_PATHS)[number], number> = {
  '': 1,
  work: 0.9,
  services: 0.9,
  about: 0.7,
  contact: 0.7,
  privacy: 0.2,
};

/**
 * `x-default` has to be in the same annotation set as `en` and `ar`.
 *
 * It was previously declared in the HTML `<head>` but omitted here, so the two
 * hreflang sets Google saw for every URL disagreed: the page claimed three
 * alternates, the sitemap claimed two. Google treats a hreflang cluster as
 * invalid when the members do not describe the same set, and the usual symptom
 * is the whole cluster being dropped — on a bilingual site that means the AR
 * pages stop being recognised as alternates of the EN ones and start competing
 * with them instead.
 */
function alternates(path: string) {
  const languages: Record<string, string> = {};
  for (const locale of locales) languages[locale] = `${site.url}/${locale}${path}`;
  languages['x-default'] = `${site.url}/en${path}`;
  return { languages };
}

export default function sitemap(): MetadataRoute.Sitemap {
  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales as readonly Locale[]) {
    for (const path of STATIC_PATHS) {
      const suffix = path ? `/${path}` : '';
      entries.push({
        url: `${site.url}/${locale}${suffix}`,
        lastModified: new Date(lastmod.routes[path === '' ? '' : path]),
        changeFrequency: path === '' || path === 'work' ? 'monthly' : 'yearly',
        priority: PRIORITY[path],
        alternates: alternates(suffix),
      });
    }

    for (const project of projects) {
      const suffix = `/work/${project.slug}`;
      const projectLastmod = lastmod.projects[project.slug as keyof typeof lastmod.projects];

      entries.push({
        url: `${site.url}/${locale}${suffix}`,
        lastModified: new Date(projectLastmod ?? lastmod.routes.work),
        changeFrequency: 'yearly',
        priority: project.featured ? 0.85 : 0.6,
        alternates: alternates(suffix),
      });
    }
  }

  return entries;
}
