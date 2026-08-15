import type { MetadataRoute } from 'next';
import { locales } from '@/i18n/config';
import { projects } from '@/content';
import { site } from '@/lib/site';

const STATIC_PATHS = ['', 'work', 'about', 'services', 'contact', 'privacy'] as const;

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date('2026-08-14');

  const entries: MetadataRoute.Sitemap = [];

  for (const locale of locales) {
    for (const path of STATIC_PATHS) {
      const url = `${site.url}/${locale}${path ? `/${path}` : ''}`;
      entries.push({
        url,
        lastModified,
        changeFrequency: path === '' ? 'monthly' : 'yearly',
        priority: path === '' ? 1 : path === 'work' ? 0.9 : 0.7,
        alternates: {
          languages: Object.fromEntries(
            locales.map((alt) => [alt, `${site.url}/${alt}${path ? `/${path}` : ''}`]),
          ),
        },
      });
    }

    for (const project of projects) {
      entries.push({
        url: `${site.url}/${locale}/work/${project.slug}`,
        lastModified,
        changeFrequency: 'yearly',
        priority: project.featured ? 0.85 : 0.6,
        alternates: {
          languages: Object.fromEntries(
            locales.map((alt) => [alt, `${site.url}/${alt}/work/${project.slug}`]),
          ),
        },
      });
    }
  }

  return entries;
}
