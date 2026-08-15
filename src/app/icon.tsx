import { ImageResponse } from 'next/og';
import { MONOGRAM_BITMAP } from '@/lib/monogram';

export const runtime = 'nodejs';
export const contentType = 'image/png';

/**
 * Favicon: the pixel monogram on the site's own ground.
 *
 * Drawn from the same bitmap as the nav-pill mark, at a cell size that lands on
 * whole device pixels — a pixel mark that resamples to mush at 32px would be
 * arguing against itself.
 *
 * ---------------------------------------------------------------------------
 * Two sizes, not one. A single 32px icon is what the tab strip *asks* for on a
 * 2x display, but on a 1x display, and in the bookmark and history lists, the
 * browser downscales it to 16 and the resample undoes the whole point of a
 * pixel mark. 16 is authored rather than derived.
 *
 * Measured against the alternatives at actual size before choosing:
 *
 *   - A 16px crop of the illustrated avatar reads as a dark cap over a pale
 *     blob. Nothing identifies it; the line work, the brows and the beard all
 *     collapse into three grey values.
 *   - Handjet's own "M" set as type at 16px renders its stems at roughly half
 *     alpha, so the mark reads soft and washed out next to a solid favicon.
 *   - This bitmap at a 3px cell is full-contrast and unambiguous. It wins
 *     because it is the only candidate authored *at* the size it is shown at.
 *
 * `cell` and `pad` must both stay whole numbers, and `5 * cell + 2 * pad` must
 * not exceed `size` — that arithmetic is the only thing keeping the mark on
 * the pixel grid. 16 takes a 1px inset on two sides rather than a half-pixel
 * one on four, because 15 does not centre in 16.
 */
const VARIANTS = [
  { id: '16', size: 16, cell: 3, pad: 1 },
  { id: '32', size: 32, cell: 6, pad: 1 },
] as const;

export function generateImageMetadata() {
  return VARIANTS.map(({ id, size }) => ({
    id,
    contentType,
    size: { width: size, height: size },
  }));
}

export default function Icon({ id }: { id: string }) {
  const variant = VARIANTS.find((candidate) => candidate.id === id) ?? VARIANTS[1];

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          /*
           * Explicit padding rather than `alignItems: center`: centring a 15px
           * mark in a 16px box resolves to a half-pixel offset, and a pixel
           * mark drawn off the grid is exactly the failure this file exists to
           * avoid.
           */
          paddingTop: variant.pad,
          paddingLeft: variant.pad,
          backgroundColor: '#EDEDED',
        }}
      >
        {MONOGRAM_BITMAP.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((on, x) => (
              <div
                key={x}
                style={{
                  width: variant.cell,
                  height: variant.cell,
                  backgroundColor: on ? '#0A6DC4' : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    { width: variant.size, height: variant.size },
  );
}
