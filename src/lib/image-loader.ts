import { IMAGE_VARIANTS } from './image-variants';

/**
 * Image loader for Cloudflare Workers.
 *
 * `next/image`'s default loader calls Vercel's Image Optimization API, which
 * does not exist on a Worker. The two documented replacements both cost
 * something: `images.unoptimized` serves the full-resolution source into every
 * slot, and a Cloudflare Images loader is a paid add-on.
 *
 * This is the third option — resolve to a variant that was rendered at build
 * time by `scripts/optimize-images.mjs`. The slots in this design are fixed and
 * known, so the set of widths the browser can ask for is finite and can simply
 * be written to disk ahead of time. Static assets are served from the Workers
 * asset store, so none of it counts against the Worker bundle.
 *
 * The trade against the Vercel optimizer is AVIF: a single URL cannot vary on
 * `Accept`, so these are WebP for everyone rather than AVIF for the browsers
 * that take it. Widths are preserved exactly, which is where the bytes were.
 */
export default function cloudflareImageLoader({
  src,
  width,
}: {
  src: string;
  width: number;
  quality?: number;
}): string {
  const widths = IMAGE_VARIANTS[src];

  /*
   * Anything without a pre-rendered ladder — a remote URL, or an asset added
   * without re-running the script — is passed through untouched. Serving the
   * original is a bytes regression, never a broken image.
   */
  if (!widths?.length) return src;

  /*
   * Round up, so a slot never receives fewer pixels than it asked for, and
   * clamp to the widest rung for requests beyond the source resolution.
   */
  const match = widths.find((candidate) => candidate >= width) ?? widths[widths.length - 1];

  return src.replace(/\.webp$/, `-${match}.webp`);
}
