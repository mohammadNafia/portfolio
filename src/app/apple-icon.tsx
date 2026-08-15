import { ImageResponse } from 'next/og';
import { MONOGRAM_BITMAP } from '@/lib/monogram';

export const runtime = 'nodejs';
export const size = { width: 180, height: 180 };
export const contentType = 'image/png';

/**
 * Home-screen icon — the same mark as `icon.tsx`, at the size iOS asks for.
 *
 * Two things differ from the favicon, both because of where this one is shown.
 * The margin is wider (10px on a 180px canvas, against 1px on 32) because iOS
 * masks the icon into a rounded square and clips the corners; a mark run to the
 * edge would lose its outer stems. And the ground stays opaque: iOS composites
 * the icon over a white plate rather than honouring alpha, so a transparent
 * background would silently become white and break the `--bg-alt` ground the
 * mark is drawn against everywhere else.
 *
 * 5 × 32 + 2 × 10 = 180. Whole cells, whole margin — same rule as the favicon.
 */
const CELL = 32;
const PAD = 10;

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          paddingTop: PAD,
          paddingLeft: PAD,
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
