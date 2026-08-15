# RTL, Arabic, and bilingual rules

This system is bilingual by default (Arabic / English). Every rule in the other reference files
still applies; this file only covers what changes.

## Direction

- Set `dir="rtl"` on `<html>` for the Arabic locale, `dir="ltr"` for English. Never mix at the
  section level unless a block is genuinely one-script (a code sample, a Latin brand name).
- Use **logical properties everywhere**: `margin-inline-start`, `padding-inline`, `inset-inline-end`,
  `text-align: start`. No `left`/`right` in layout CSS. This is what makes one stylesheet serve both.
- Elements that must **not** flip: the sawtooth divider (symmetric anyway), the grain, the hero fan
  arc (symmetric), logo marquee direction (keep it moving toward the reading direction: `-50%`
  in LTR, `+50%` in RTL).
- Elements that **must** flip: carousel arrow chevron, carousel slide direction, form label
  alignment, the `Read Case Study` arrow, any icon with a direction.

## Type per script

See `design-tokens.md` for the font decision. In short: **Handjet** carries the pixel display face
in both scripts; `IBM Plex Sans Arabic 700` is the approved fallback for Arabic headings if
Handjet's Arabic fails visual QA.

Arabic adjustments to the type scale:

| Property | Latin | Arabic |
|---|---|---|
| Heading line-height | `1.05` | `1.35` (Arabic needs the leading — never reuse the Latin value) |
| Body line-height | `1.6` | `1.8` |
| Letter-spacing | tracked `0.04em`–`0.14em` on display | **`0` always** — never track Arabic, it breaks joining |
| Text transform | `uppercase` on titles | **none** — Arabic has no case; the weight carries the emphasis |
| Body size | `16px` | `17px` (Arabic reads smaller at the same px) |

Because Arabic has no uppercase, the "shouty section title" effect comes from: display face +
size + the squiggle underline, not from casing. Don't fake it with letter-spacing.

## Strings

- Every user-facing string exists in both locales. No English fallback rendering inside an Arabic
  page — a missing translation is a build error, not a silent fallback.
- Keep numerals consistent per locale (Western Arabic numerals `0–9` are the safe default for
  Iraqi audiences; don't switch to Eastern Arabic numerals halfway).
- Dates, currency, and phone numbers follow the locale, not the source content.

## Layout consequences

- Arabic text runs ~15–25% longer than English for the same content. Section headers, buttons and
  tag pills must not be fixed-width — size to content with a `min-width`.
- The nav pill's expanded width is defined by content in both locales; set the expanded state with
  `width: max-content` plus a `max-width`, not a hard `560px`, when running bilingual.
- Two-line card titles in English are often three in Arabic. Reserve the space with `min-height`
  rather than clamping, so cards in a row stay aligned.

## Testing floor

- Snapshot both locales for every section at 375 / 768 / 1440.
- Assert `dir` is correct on `<html>` and that no `left:`/`right:` positional CSS leaks into a
  component.
- Assert no untranslated key renders (the "missing translation is a build error" rule above).
