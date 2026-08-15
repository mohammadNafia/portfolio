import Image from 'next/image';
import type { Project } from '@/content/schema';
import type { Locale } from '@/i18n/config';
import { getFanArt } from '@/content/fan-art';
import { FanCardArt } from './FanCardArt';

/**
 * The face of a `.case-card`, wherever one is drawn — the selected-work grid,
 * the archive carousel, the work index.
 *
 * Three sources, in order of how much they actually say about the project:
 *
 *   1. `heroImage` — the export the case study leads with. Landscape, and the
 *      card slot is 4:3, so these sit in it with little or no crop.
 *   2. `fanArt` — the hero-fan artwork. Real product compositions, already
 *      optimised, but 3:4 PORTRAIT. See the note on `--tall` below.
 *   3. `FanCardArt` — the coded composition. Not a placeholder in the sense of
 *      being unfinished: it is an honest abstract face built from the project's
 *      own module names, and it stays the answer for projects with no
 *      photograph rather than borrowing one from a different product.
 *
 * The point of the order is that a card never shows generated bars when a real
 * picture of that same project exists somewhere in the repository. Reuse across
 * surfaces is deliberate — the same image doing two jobs beats a grey rectangle
 * doing one.
 */
export function CardCover({
  project,
  locale,
  /**
   * Widths the browser may request. The default describes the selected-work
   * grid: two columns of a 1240px shell on a desktop, full width on a phone.
   */
  sizes = '(max-width: 760px) 100vw, (max-width: 1240px) 50vw, 600px',
  priority = false,
  prefer = 'hero',
}: {
  project: Project;
  locale: Locale;
  sizes?: string;
  priority?: boolean;
  /**
   * Which real image to reach for first when a project has both.
   *
   * Sendy, IMMAR and Virtual Banking each appear twice on the home page — once
   * as a card in Selected Work and again as a row in Case Studies — and every
   * one of them has two genuine photographs: the case-study hero export and the
   * hero-fan composition. Pointing the two sections at different ones means the
   * repetition is a second look at the product rather than the same picture
   * scrolled past twice.
   *
   * This is a preference, not a requirement: a project with only one image gets
   * that one in both places, which is still better than a coded face in either.
   */
  prefer?: 'hero' | 'fan';
}) {
  const hero = project.heroImage;
  const fan = getFanArt(project.slug);

  if (prefer === 'fan' && fan) {
    return (
      <Image
        src={fan.src}
        alt={fan.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    );
  }

  if (hero) {
    return (
      <Image
        src={hero.src}
        alt={hero.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover"
      />
    );
  }

  if (fan) {
    /*
     * `object-position: top` rather than centre, and this is the whole reason
     * fan art needs its own branch.
     *
     * These are 3:4 portrait compositions dropped into a 4:3 landscape slot, so
     * `cover` discards well over half the height whatever anchor it uses. The
     * compositions are stacked screens with the most legible one at the top —
     * a dashboard header, an invoice — so anchoring to the top keeps the part
     * that identifies the product and throws away the overlapping cards below
     * it. Centred, every one of them cropped to an ambiguous middle band.
     */
    return (
      <Image
        src={fan.src}
        alt={fan.alt[locale]}
        fill
        sizes={sizes}
        priority={priority}
        className="object-cover object-top"
      />
    );
  }

  return <FanCardArt project={project} />;
}
