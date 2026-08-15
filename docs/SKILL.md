---
name: pixel-portfolio-style
description: Design system and build rules for a light-gray "pixel-display" personal portfolio site (floating pill nav, pixel-font section titles with hand-drawn squiggle underlines, sawtooth/torn-paper section dividers, fanned card hero, blur-up scroll reveals, logo marquee, case-study carousel). ALWAYS use this skill when building, editing, extending, or adding ANY new section, component, or page to this portfolio site — including when the user says "add a section", "add testimonials", "add a blog/pricing/FAQ/about section", "make a new page", "style this like the site", "same vibe", "نفس النمط", "ضيف قسم", or uploads images to place into the site. Also use it when reviewing existing markup for style drift. The whole point is that anything added later looks like it was designed by the same person on the same day.
---

> **This is the original paste, kept for provenance. It is not the working copy.**
>
> The authoritative system lives at [`docs/pixel-portfolio-style/`](./pixel-portfolio-style/),
> with its four reference files and `assets/base.css`. Read that one.
>
> This file predates two additions that the build depends on: **rule #0** (apply the system in
> place; never rewrite a working, tested app to adopt a look — the rule that decided the whole
> restyle) and **rule #9** plus the `references/rtl-and-locales.md` pointer. Following this copy
> instead would miss both.

# Pixel Portfolio Style

A complete visual + motion system. Follow it literally. When something is not covered here,
choose the option that is **quieter, rounder, and more geometric** — never introduce a new
color, a new font, a new radius, or a new easing curve.

## Non-negotiables (read every time)

1. **Two fonts only.** Pixel display font for section titles + hero word. Geometric sans for everything else.
2. **One accent color only.** Blue `#0B8DF8`. Black `#111` for secondary buttons. Nothing else.
3. **Every section title** is: uppercase pixel font + hand-drawn squiggle SVG underline, centered.
4. **Every section** reveals on scroll with the same blur-up transition (see `references/motion.md`).
5. **Radii are pill or 20px.** Never 4px, never 8px, never sharp corners (except the sawtooth divider).
6. **No borders.** Separation comes from `#F2F2F2` fills and soft shadows, not from 1px lines.
7. **Centered, max 1080px content column.** Generous vertical rhythm (120–160px between sections).
8. **Copy is lowercase-friendly and self-deprecating/human**, never corporate. Short sentences.

## Workflow when adding anything new

1. Read `references/design-tokens.md` → use the CSS variables, never raw hex.
2. Read `references/components.md` → check whether the thing already exists as a pattern
   (pill, tag, card, section header, marquee, carousel, form field). Reuse it. Do not invent a
   second card style.
3. Read `references/motion.md` → attach the standard reveal + hover behavior.
4. If it is a whole new section, read `references/section-recipes.md` and follow the
   "new section template" exactly (spacing, header, reveal, container).
5. Alternate section backgrounds `--bg` / `--bg-hero`. If two adjacent sections have
   different backgrounds, put a **sawtooth divider** between them (never a straight line).
6. Register the section id in the nav pill links only if it is a top-level destination
   (max 4 nav links; if adding a 5th, ask the user which one to drop).
7. Add any new image slot to `assets/IMAGES.md` with the exact aspect ratio needed, so the
   user knows what to supply.

## Self-check before finishing

- [ ] Does every new heading use the pixel font + squiggle underline?
- [ ] Any hex code outside the token list? Remove it.
- [ ] Any radius that is not `999px` or `20px` / `16px` / `14px`? Fix it.
- [ ] Does the new block fade in with `blur(10px) → 0` and `y: 30px → 0`?
- [ ] Do hover states use `scale(1.03)` + shadow lift + `250ms`?
- [ ] Mobile: does the fan/carousel/grid collapse per the mobile rules in `references/components.md`?
- [ ] Did I keep the section vertical padding at `clamp(80px, 10vw, 160px)`?

## Reference files

| File | Read when |
|---|---|
| `references/design-tokens.md` | Always — colors, type scale, spacing, shadows, fonts |
| `references/components.md` | Building any UI element (nav, cards, tags, form, marquee, carousel, divider) |
| `references/motion.md` | Any animation, reveal, hover, or page-load choreography |
| `references/section-recipes.md` | Adding a brand-new section or page |
| `assets/base.css` | Drop-in stylesheet with all tokens + primitives already implemented |
| `assets/IMAGES.md` | What images the site needs and at what ratio |
