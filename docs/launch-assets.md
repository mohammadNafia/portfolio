# Launch assets

Every asset needed for launch: what exists, what must be produced, and exact specifications.

## Already captured

`docs/screenshots/` — 132 full-page PNGs at 2× DPR.

```
docs/screenshots/<viewport>/<locale>/<route>.png
  viewports: 1440x900 · 1280x800 · 1024x1366 · 768x1024 · 430x932 · 390x844
  locales:   en · ar
  routes:    home · work · case-sendy · case-immar · case-nano · case-banking
             about · services · contact · privacy · notfound
```

Regenerate with `node scripts/restart-prod.mjs && node scripts/shoot.mjs`.

### The six to lead with

| # | File | Why |
|---|---|---|
| 1 | `1440x900/en/home.png` | The pixel lockup and the seven-card fan — the first impression |
| 2 | `1440x900/en/case-sendy.png` | Depth: the flagship case study in full |
| 3 | `1440x900/en/work.png` | Breadth: eight projects, one system |
| 4 | `390x844/ar/home.png` | Bilingual proof, and mobile quality in one image |
| 5 | `390x844/en/case-sendy.png` | Long-form reading on a phone |
| 6 | `1024x1366/en/about.png` | The human layer |

Crop the top ~1200px of the full-page images for social; full-page shots are for review.

---

## To produce

### 1. Teaser — the hero fan (10–15 s, silent)

The single most important launch asset. The fan must be recognisable in three seconds.

| Spec | Value |
|---|---|
| Duration | 10–15 s |
| Aspect | 16:9 (LinkedIn/X) **and** 9:16 (Reels/Stories) |
| Resolution | 1920×1080 / 1080×1920, 60 fps |
| Audio | None. It must read in silence. |
| Captions | None |

**Beats:** load with the page already scrolled to top so the **fan's arrival plays in full** —
stacked, then spreading outward in pairs, settling at ~2.4 s (3 s) → hold on the settled fan and
let the idle float breathe (2 s) → hover the centre card so it lifts (2 s) → click and let the
Sendy case study open, catching the sawtooth seam on the way (4 s) → cut to the Arabic homepage
so the pixel face reads in both scripts (3 s).

Record at 1440×900 in a clean browser (no bookmarks bar, no extensions). **Reload rather than
scroll back** — the arrival choreography only runs once per load, and it is the shot.

### 2. Launch reel (30–45 s)

| Spec | Value |
|---|---|
| Duration | 30–45 s |
| Aspect | 16:9 and 9:16 |
| Audio | Optional light bed; must work muted |
| Captions | Burned in — most feeds autoplay muted |

**Beats:** hero and fan arrival (4 s) → work gallery scroll through two sawtooth seams (5 s) →
Sendy case study scroll, pausing on
the order lifecycle diagram (8 s) → IMMAR role matrix (5 s) → NANO pipeline (4 s) → switch to
Arabic and show the layout mirror (6 s) → mobile scroll (6 s) → final CTA (3 s).

The Arabic switch is the moment most viewers will remember. Give it room.

### 3. Founder story (200–300 words)

Mohammed's own voice, not marketing copy. Why an Iraqi engineer built this: what he kept seeing
merchants and teachers do by hand, why he decided operational software was worth specialising
in, and what he wants to build next. Used in the LinkedIn launch post and as the About page's
opening if he prefers it to the current copy.

### 4. Open Graph image — **already done**

Generated from `src/app/opengraph-image.tsx`, 1200×630, at `/opengraph-image`. Verify it
renders in a preview tool after deploying. No manual asset needed.

### 5. Favicon / monogram system — **already done**

Generated from `src/app/icon.tsx`. If Mohammed wants a full set (Apple touch icon, maskable
Android icon), add `apple-icon.tsx` and a web manifest.

---

## Optional: existing material worth reusing

`Desktop/sendy video/sendy-launch-video-images/` holds 13 scene renders produced for a Sendy
launch video.

**Do not use these as product screenshots** — they are marketing renders and presenting them as
UI would misrepresent them. They are, however, legitimate for a *Sendy* narrative video, where
their purpose is clear. If any appear in launch material, describe them as concept/brand art.

---

## Recording checklist

- [ ] Clean browser profile — no bookmarks bar, no extension icons, no notifications
- [ ] Production build, not `next dev` (the dev overlay will appear otherwise)
- [ ] `NEXT_PUBLIC_SITE_URL` set, so the URL bar shows the real domain
- [ ] Reduced motion **off** — the whole point is the motion
- [ ] 60 fps capture; deliberate, slow cursor movement
- [ ] Record 16:9 and 9:16 separately rather than cropping — the layout differs meaningfully
- [ ] Watch every clip muted before publishing

## Specification summary

| Asset | Aspect | Resolution | Status |
|---|---|---|---|
| Six launch screenshots | Various | 2× DPR | ✅ Captured |
| Open Graph image | 1.91:1 | 1200×630 | ✅ Generated |
| Favicon | 1:1 | 32×32 | ✅ Generated |
| Teaser video | 16:9 + 9:16 | 1920×1080 / 1080×1920 | ⬜ To record |
| Launch reel | 16:9 + 9:16 | 1920×1080 / 1080×1920 | ⬜ To record |
| Founder story | Text | 200–300 words | ⬜ To write |
| Product screenshots | 16:10 / 9:19.5 | ≥2560px wide | ⬜ See `content-gaps.md` |
| Portrait | 4:5 | ≥1600×2000 | ⬜ See `content-gaps.md` |
