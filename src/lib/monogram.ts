/**
 * The M monogram as a 5×5 bitmap — data only, no JSX.
 *
 * Three consumers read it: `Monogram.tsx` (pulled into the client graph by the
 * nav pill), and `icon.tsx` / `opengraph-image.tsx` (Node, via Satori). Shared
 * data with no JSX belongs in its own module rather than being exported from a
 * component that one of those graphs would drag along wholesale.
 */
export const MONOGRAM_BITMAP = [
  [1, 0, 0, 0, 1],
  [1, 1, 0, 1, 1],
  [1, 0, 1, 0, 1],
  [1, 0, 0, 0, 1],
  [1, 0, 0, 0, 1],
] as const;
