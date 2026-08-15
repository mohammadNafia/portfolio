import Image from 'next/image';
import type { Dictionary } from '@/i18n/dictionaries/en';

/**
 * The cutout photo, bottom-left of the hero.
 *
 * It lives inside `.hero__inner`, which is the whole point: the wrapper carries
 * the `--hero-y` transform, so the photo lags at the same 0.2× as the wordmark,
 * the subtitle and the fan. Parked outside the wrapper it would scroll at 1×
 * and slide out from under the teeth. It is also positioned against the hero's
 * bottom edge rather than the wrapper's content box, so its last 36px sit under
 * the `.after-hero` sawtooth and the teeth cut it — the final beat of the
 * sequence described in `HeroInner`.
 *
 * ---------------------------------------------------------------------------
 * Not rendered yet. `me-cutout.png` was delivered without an alpha channel: the
 * export baked the editor's transparency checkerboard in as opaque pixels
 * (alternating #FEFEFE / #F5F5F5 in ~14px cells, confirmed on the raw buffer).
 * On the hero's #EDEDED ground that reads as a light rectangle with a faint
 * grid in it, not a cutout, so shipping it would be worse than shipping
 * nothing. Everything else about the slot — placement, layering, lag, sizing,
 * bilingual alt text — is finished and was verified against a keyed test copy.
 *
 * Flip this to `true` when a transparent re-export lands. Nothing else changes.
 */
const CUTOUT_HAS_ALPHA = false;

/** Served at 800×1421; displayed at 338 wide, anchored bottom-left. */
const DISPLAY = { width: 338, height: 600 } as const;

export function HeroCutout({ dict }: { dict: Dictionary }) {
  if (!CUTOUT_HAS_ALPHA) return null;

  return (
    <div className="hero__cutout">
      <Image
        src="/img/me-cutout.webp"
        alt={dict.alt.cutout}
        width={DISPLAY.width}
        height={DISPLAY.height}
        sizes="(max-width: 1200px) 260px, 338px"
      />
    </div>
  );
}
