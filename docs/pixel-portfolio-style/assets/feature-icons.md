# Feature Icons Specification

## Final decision

Use **Phosphor Icons** for the portfolio feature icons.

- Official library: https://phosphoricons.com/
- React package: `@phosphor-icons/react`
- Do not mix Phosphor with Lucide, Heroicons, Font Awesome, or other icon families in this section.
- Use the `duotone` weight for the three feature icons so they feel more distinctive than ordinary navigation icons while remaining consistent.

## Required assets

| File | Purpose | Phosphor icon | Meaning |
| --- | --- | --- | --- |
| `icon-1.png` | Software engineering | `BracketsCurly` | Full-stack development and production software |
| `icon-2.png` | Product and interface design | `PenNib` | UI systems, product thinking, and visual craft |
| `icon-3.png` | Systems and automation | `FlowArrow` | Connected workflows, integrations, and automation |

## Visual direction

Each file must look like a polished app icon rather than a bare line icon.

- Canvas: `512×512px`, RGBA PNG.
- Aspect ratio: `1:1`.
- Keep transparent padding around the rounded-square tile.
- Tile bounds: approximately `440×440px`, centred on the canvas.
- Corner radius: approximately `112px` (smooth squircle-like corners).
- Icon size: approximately `208px`, optically centred.
- Icon weight: `duotone`.
- No words, initials, labels, borders, watermarks, or extra symbols.
- Use the same lighting, corner radius, shadow softness, and icon scale across all three files.
- Keep strong contrast and verify the icons at `64×64px` as well as full size.

## Colour treatment

Use one cohesive neutral system with a restrained accent for each icon:

| Asset | Tile | Icon | Accent glow |
| --- | --- | --- | --- |
| `icon-1.png` | `#19171F` | `#F8F5EE` | muted violet `#7456A8` |
| `icon-2.png` | `#EEE8DD` | `#18171A` | warm sand `#C99B69` |
| `icon-3.png` | `#193936` | `#F4F6EF` | muted teal `#61A39C` |

The glow must remain subtle. Avoid neon colours, glossy 3D plastic, excessive gradients, and heavy drop shadows.

## React implementation

Install the official package:

```bash
npm install @phosphor-icons/react
```

Import only the selected icons:

```tsx
import {
  BracketsCurly,
  PenNib,
  FlowArrow,
} from "@phosphor-icons/react";
```

Example component:

```tsx
const featureIcons = [
  { Icon: BracketsCurly, label: "Software engineering", className: "feature-icon--engineering" },
  { Icon: PenNib, label: "Product and interface design", className: "feature-icon--design" },
  { Icon: FlowArrow, label: "Systems and automation", className: "feature-icon--systems" },
];

export function FeatureIconGrid() {
  return (
    <div className="feature-icon-grid">
      {featureIcons.map(({ Icon, label, className }) => (
        <div className={`feature-icon ${className}`} key={label}>
          <Icon
            aria-hidden="true"
            size="42%"
            weight="duotone"
            mirrored={false}
          />
          <span className="sr-only">{label}</span>
        </div>
      ))}
    </div>
  );
}
```

Prefer live SVG components in the website for sharp rendering and theme support. Keep `icon-1.png`, `icon-2.png`, and `icon-3.png` as the required exported asset versions.

## Export requirements

- Export at exactly `512×512px`.
- Format: PNG with transparency outside the rounded-square tile.
- Colour profile: sRGB.
- Longest edge: `512px`.
- Final filenames must remain exactly:
  - `icon-1.png`
  - `icon-2.png`
  - `icon-3.png`
- Do not append suffixes such as `final`, `v2`, `new`, or `@2x`.

## Acceptance checklist

- [ ] All three icons come from Phosphor Icons.
- [ ] All three use the `duotone` weight.
- [ ] Rounded-square geometry and padding are identical.
- [ ] Transparent pixels exist outside each tile.
- [ ] No text appears inside the exported graphics.
- [ ] Icons remain clear at `64×64px`.
- [ ] The website uses the SVG components where possible.
- [ ] The three required PNG files are exported with the exact filenames.
