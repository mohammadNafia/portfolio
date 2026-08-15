import { validateProjects, type Project, type Category } from './schema';
import { sendy } from './projects/sendy';
import { immar } from './projects/immar';
import { nano } from './projects/nano';
import { altafawuq, securebank, formBuilder, invoiceApp, medichub } from './projects/archive';

/**
 * The registry is validated at module load. A malformed or incomplete project —
 * including a featured project without a real case study — fails the build
 * rather than shipping a "Coming soon" page.
 */
export const projects: Project[] = validateProjects([
  sendy,
  immar,
  nano,
  altafawuq,
  securebank,
  formBuilder,
  invoiceApp,
  medichub,
]);

export const featuredProjects: Project[] = projects.filter((p) => p.featured);
export const archiveProjects: Project[] = projects.filter((p) => !p.featured);

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}

export function projectSlugs(): string[] {
  return projects.map((p) => p.slug);
}

/** Next project in the registry order, wrapping around. Used by NextProject. */
export function getNextProject(slug: string): Project {
  const index = projects.findIndex((p) => p.slug === slug);
  const next = projects[(index + 1) % projects.length];
  if (!next) throw new Error(`Cannot resolve next project for slug: ${slug}`);
  return next;
}

export const categories: Category[] = [
  'saas',
  'product',
  'backend',
  'ai',
  'dashboard',
  'experiment',
];

/** Only categories that actually have projects — no empty filter chips. */
export function activeCategories(): Category[] {
  const used = new Set(projects.map((p) => p.category));
  return categories.filter((c) => used.has(c));
}

export * from './schema';
