import { notFound } from 'next/navigation';

/**
 * Any unmatched path inside a locale renders the locale-scoped 404 rather than
 * an unstyled default document. Middleware normalises locale-less URLs into this
 * segment, so every wrong URL on the site lands here.
 */
export default function CatchAllNotFound() {
  notFound();
}
