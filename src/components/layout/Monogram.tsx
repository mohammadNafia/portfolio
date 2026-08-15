import { MONOGRAM_BITMAP } from '@/lib/monogram';

/**
 * The M monogram, drawn on the same 5×5 pixel grid the display face is built
 * from.
 *
 * The identity is a pixel face, so the mark is a pixel too — not a smooth
 * letterform that happens to sit next to one. The bitmap lives in
 * `@/lib/monogram` so the favicon and the social card draw from exactly the
 * same data, and the mark is literally identical everywhere it appears rather
 * than three drawings that resemble each other.
 *
 * It stands in for a portrait in the nav pill. When Mohammed supplies a photo
 * (`content-gaps.md` §2) the avatar becomes the photo and this stays as the
 * favicon and OG mark.
 */
export function Monogram({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 5 5" fill="none" aria-hidden="true" className={className} role="presentation">
      {MONOGRAM_BITMAP.map((row, y) =>
        row.map((on, x) =>
          on ? <rect key={`${x}-${y}`} x={x} y={y} width="1" height="1" fill="currentColor" /> : null,
        ),
      )}
    </svg>
  );
}
