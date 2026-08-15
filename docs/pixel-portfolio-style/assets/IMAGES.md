# Image manifest

Drop files into `/assets/img/` using these exact names, or tell Claude the new names.
Until a real file exists, use a `--surface` block with the same aspect ratio as a placeholder —
never a stretched or low-res stand-in.

| Slot | File | Ratio / size | Notes |
|---|---|---|---|
| Nav avatar | `avatar.png` | 1:1, ≥160px | Hand-drawn or illustrated portrait reads best, transparent bg |
| Hero fan 1–7 | `fan-1.png` … `fan-7.png` | 3:4, ≥840×1120 | App screenshots / mockups. `fan-4` is the strongest one (center) |
| Cutout photo | `me-cutout.png` | free, ~600px tall | Person with background removed, PNG transparency required |
| Gallery | `work-01.jpg` … `work-NN.jpg` | mixed: 4:3, 1:1, 9:16 | Real screenshots; keep ≥1400px on the long edge |
| Feature icons | `icon-1.png` … `icon-3.png` | 1:1, ≥256px | App-style rounded-square icons |
| Client logos | `logo-1.svg` … `logo-N.svg` | height-normalised to 26px | SVG preferred, single color, transparent bg |
| Case-study covers | `case-1.jpg` … `case-N.jpg` | 4:3, ≥1600px | Hero shot of the project |
| Resume | `resume.pdf` | — | Linked by the Download Resume button |
| OG image | `og.png` | 1200×630 | Social preview |
| Favicon | `favicon.png` | 512×512 | — |

Delivery rules:
- Export at 2× and serve with `width`/`height` attributes to avoid layout shift.
- `loading="lazy"` on everything below the fold, `fetchpriority="high"` on `fan-4`.
- Prefer `.webp` with a `.jpg` fallback for photos; `.png` where transparency is needed.
- Every image needs meaningful `alt` text; only the grain, squiggles and sawtooth are decorative.
