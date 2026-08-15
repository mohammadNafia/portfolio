import { ImageResponse } from 'next/og';
import { MONOGRAM_BITMAP } from '@/lib/monogram';

export const runtime = 'nodejs';
export const size = { width: 32, height: 32 };
export const contentType = 'image/png';

const CELL = 6; // 5 cells → 30px, centred in 32 with a 1px margin.

/**
 * Favicon: the pixel monogram on the site's own ground.
 *
 * Drawn from the same bitmap as the nav-pill mark, at a cell size that lands on
 * whole device pixels — a pixel mark that resamples to mush at 32px would be
 * arguing against itself.
 */
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#EDEDED',
        }}
      >
        {MONOGRAM_BITMAP.map((row, y) => (
          <div key={y} style={{ display: 'flex' }}>
            {row.map((on, x) => (
              <div
                key={x}
                style={{
                  width: CELL,
                  height: CELL,
                  backgroundColor: on ? '#0A6DC4' : 'transparent',
                }}
              />
            ))}
          </div>
        ))}
      </div>
    ),
    size,
  );
}
