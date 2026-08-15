# Master checklist

Every requirement from the brief. **Items are checked only where implemented and verified.**
Unchecked items say why.

---

## Routes — every one built, both locales

| Route | EN | AR | Static | Notes |
|---|---|---|---|---|
| `/` → locale | ✅ | ✅ | middleware | Cookie → `Accept-Language` → default |
| Home | ✅ | ✅ | ✅ | All 12 sections |
| Work index | ✅ | ✅ | ✅ | Accessible filter, live count |
| Sendy | ✅ | ✅ | ✅ | 7 chapters |
| IMMAR | ✅ | ✅ | ✅ | 6 chapters |
| NANO | ✅ | ✅ | ✅ | 6 chapters |
| Al-Tafawuq | ✅ | ✅ | ✅ | 3 chapters |
| Virtual Banking | ✅ | ✅ | ✅ | 3 chapters |
| Form Builder | ✅ | ✅ | ✅ | 3 chapters |
| Invoice Mini App | ✅ | ✅ | ✅ | 3 chapters |
| MedicHub | ✅ | ✅ | ✅ | 3 chapters |
| About | ✅ | ✅ | ✅ | |
| Services | ✅ | ✅ | ✅ | All 7 services |
| Contact | ✅ | ✅ | ✅ | All form states |
| Privacy | ✅ | ✅ | ✅ | Reflects actual providers |
| 404 | ✅ | ✅ | ✅ | Real HTTP 404 + full shell |

**No route is an empty shell. No `Coming soon` exists anywhere — enforced at build time.**

## Homepage sections

The system's canonical order, in `src/app/[locale]/page.tsx`:

✅ Nav pill · ✅ Hero + seven-card fan · ✅ Work gallery · ✅ BACKGROUND · ✅ Proof stats ·
✅ Stack marquee · ✅ CASE STUDIES carousel · ✅ Archive strip · ✅ WORK WITH ME · ✅ Footer

✅ A **sawtooth at every background change** — seven on the homepage, never a straight line.

⬜ **RESUME** — the reference has one; ours does not, because no current CV exists to link.
Omitted rather than stubbed. Ships when the PDF does.

Story arc: identity → work → who → proof → tools → depth → breadth → contact. ✅

## Design system

✅ Semantic tokens for every role · ✅ 4/8 spacing · ✅ Container widths + fluid gutters ·
✅ Typography roles · ✅ Radius roles · ✅ Shadow roles · ✅ Z-index roles ·
✅ Motion tokens · ✅ CSS custom properties as source of truth ·
✅ `clamp()` section spacing · ✅ Prose capped ~62–70ch ·
✅ **No component class named after a Tailwind utility** (enforced by test)

⚠️ **Raw colour values do still appear in two places**, both deliberate: `--shadow-btn` bakes
the accent into a shadow (a shadow cannot take a `var()` alpha cleanly), and `FanCardArt` uses
neutral `rgba(17,17,17,…)` washes for the abstract product faces. Everything a user reads or
acts on comes from a token.

## Components

Every exported component, checked against the source:

✅ **Layout** — `SiteHeader` (nav pill, scroll-spy, focus-within expansion) · `Monogram` ·
`LocalTime` · `FooterLine`
✅ **UI** — `Section` · `SecHead` · `Squiggle` · `Sawtooth` · `Tag` · `StackList` ·
`MetaItem` / `MetaList` · `Button` (`primary` / `dark` / `quiet`) · `QuietLink` ·
`WavyLink` · `Reveal` / `RevealList`
✅ **Home** — `Hero` · `HeroFan` · `FanCardArt` (ten distinct faces) · `WorkGallery` ·
`Background` · `Proof` · `StackMarquee` · `CaseStudies` (carousel) · `ArchiveStrip` ·
`WorkWithMe`
✅ **Case study** — `BlockRenderer` (showcase, flow, matrix, layers, decisions) · `ChapterNav`
✅ **Work** — `WorkIndex` with accessible filtering and a live count
✅ **Contact** — `ContactForm`: validation, success, recoverable error, network error,
honest-unavailable
✅ **SEO** — `StructuredData` (`Person`, `CreativeWork`)
✅ Skip link · status regions · error and empty states

⬜ Removed with the restyle: `CustomCursor`, `MobileNav` dialog, `ProductOrbit`, `WedgeMark`,
`MagneticAction`, `TiltSurface`, `ReadingProgress`, `AvailabilityBadge`, and the whole
`showcase/` directory — its compositions were folded into `FanCardArt`. Also gone: the About
page's framed 4:5 monogram panel and the homepage `AboutPreview`. The system has none of them;
the nav pill drops its links below 760px rather than opening a dialog, the footer carries the
routes, and About opens straight onto BACKGROUND.

⬜ `VideoPreview`, `ImageCompare`, skeleton loaders — **deliberately not built.** There is no
video and no async surface; the brief scopes these to "only where useful".

## Motion

✅ Single vocabulary as CSS custom properties in `globals.css` · ✅ Three easing curves ·
✅ Seven duration tokens, nothing over 600ms except the hero's one-time load ·
✅ Blur-up reveal (opacity + 30px + `blur(10px)`, 600ms, 80ms stagger) ·
✅ Fan choreography at the specified rotations, paired outward spread, idle float ·
✅ Nav pill 260 → 560 at 70% of the hero, and on focus-within ·
✅ Seamless marquee, paused on hover, direction-aware · ✅ Hover lift · ✅ Focus parity ·
✅ Scroll restoration · ✅ Back/forward · ✅ Locale switch preserves route ·
✅ Diagrams readable static

✅ **No JavaScript animation library.** `src/lib/motion.ts` was deleted; the reveal is a plain
IntersectionObserver on `threshold: [0, 0.2]` with an above-the-fold early return — which is
what permanently closed the "reveals stuck invisible" class of bug.

**Reduced motion:** ✅ durations **and delays** zeroed · ✅ reveal keeps opacity only, drops
transform and blur · ✅ fan renders settled, complete and linked · ✅ marquee stops ·
✅ smooth scrolling off · ✅ nothing depends on movement ·
✅ **tested, with the emulation asserted active first**

## Bilingual

✅ Full EN/AR · ✅ `lang` + `dir` at document level · ✅ Directional mirroring ·
✅ Brand marks, screenshots, code, URLs, emails **not** mirrored · ✅ LTR islands for technical
tokens · ✅ Localised nav, buttons, labels, validation, metadata, 404, SEO, ARIA ·
✅ Natural professional Arabic, not machine-literal · ✅ No untranslated English in AR ·
✅ Expansion and wrapping tested at 6 viewports · ✅ Arabic art-directed independently ·
✅ Locale persisted in a cookie · ✅ Completeness enforced by types **and** tests ·
✅ **Identity strings outside the dictionary** (`site.ts`) asserted per locale — the compiler
cannot reach them, and the Arabic About page printed "Baghdad, Iraq" until it did

## Accessibility

✅ Complete keyboard navigation · ✅ Visible art-directed focus · ✅ Skip link ·
✅ Semantic landmarks · ✅ Contrast verified and corrected · ✅ Reduced motion ·
✅ Form labels + error association · ✅ No horizontal overflow at any width ·
✅ No console errors or hydration warnings (asserted) · ✅ 0 serious axe violations ×12 ·
✅ **Focus ring measured at 3:1 on both grounds** — axe cannot test this, so an e2e test does

There is no mobile menu dialog to trap focus in: below 760px the nav pill drops its links and
the footer carries the routes, which `mobile.spec.ts` asserts. The custom cursor is gone, so it
can no longer override browser behaviour.

## Performance

✅ Server components by default · ✅ Client components only for real interaction ·
✅ Static generation for all content routes · ✅ No layout shift (CLS ~0 measured) ·
✅ Listeners/observers cleaned up · ✅ No hydration mismatch from time/locale/pointer ·
✅ No image weight (all compositions are DOM) ·
✅ **No JavaScript animation library** — First Load JS 126 kB on the homepage, 108–109 kB
elsewhere, down from 152/149–154 kB before Motion was dropped

⬜ **Lighthouse scores** — CLI unavailable here. Real Core Web Vitals measured and reported
instead; no score is claimed anywhere. Mohammed must run it on the deployed site.

⬜ **3 high-severity npm advisories** (`next`, `postcss`, `sharp`) — all resolved only by a
semver-major Next.js 16 upgrade. Reported in `verification-report.md` §9 and §10; not attempted
unprompted.

## SEO

✅ Localised titles/descriptions · ✅ Canonical + `hreflang` alternates + `x-default` ·
✅ `sitemap.xml` (28 URLs with alternates) · ✅ `robots.txt` · ✅ Open Graph + Twitter card ·
✅ Generated OG image — **and an e2e test that it actually resolves**, which it did not until
the middleware matcher was fixed · ✅ `Person` structured data · ✅ `CreativeWork` per case study ·
✅ Semantic heading order · ✅ External links `rel="noopener noreferrer"` ·
✅ Honest project classification labels

⬜ **CV download** — omitted because no confirmed-current CV exists. This is the correct
behaviour per the brief.

## Content integrity

✅ No invented clients, testimonials, employment, metrics, user counts, revenue, performance
results, awards or integrations
✅ Only the two documented awards appear, both described as team awards
✅ No unverifiable ranking claim
✅ Concept imagery labelled as concept imagery everywhere
✅ Honest classification: founder product / client product / hackathon / programme / independent
✅ Enforced by unit tests that fail the build on violation

## Testing

✅ Dependency install · ✅ Lint · ✅ Strict type-check · ✅ 17 unit tests · ✅ Production build ·
✅ 82 Playwright e2e · ✅ axe accessibility · ✅ Internal dead-link check ·
✅ Localisation completeness check · ✅ **Stylesheet hygiene guards** (no component class named
after a Tailwind utility; no bare `var()` in an arbitrary text utility; every showcase id draws
its own face)

Playwright coverage: ✅ both locale homepages · ✅ locale switching + persistence ·
✅ navigation, nav-pill collapse and footer route reachability · ✅ every featured case study opens · ✅ project media behaviour ·
✅ contact validation, success contract, failure state · ✅ keyboard flows ·
✅ reduced motion · ✅ 404

## Visual verification

✅ 1440×900 · ✅ 1280×800 · ✅ 1024×1366 · ✅ 768×1024 · ✅ 430×932 · ✅ 390×844,
both locales — 132 screenshots, recaptured against the pixel build and reviewed.

**This step is not ceremonial.** Six defects survived lint, strict types and the entire test
suite, and were caught by looking at the captures: two component classes shadowing Tailwind
utilities (every page at the wrong measure), the work gallery rendering as eight near-empty
tiles, the same collapse on every case-study composition, and three IMMAR/NANO captions sitting
over one identical image — and, from a single 404 capture that rendered as a bare "500 Internal
Server Error", **a served build that returned 500 for every unknown path**, and behind it
**a broken favicon and social card on every page**. Recapture and *look* after any visual
change; the captures found things nothing automated did.

**Art direction:** the site was re-art-directed twice — first to a light studio after review,
then into the `pixel-portfolio-style` system Mohammed supplied. Both times the structure,
content model, bilingual system and accessibility contract were unchanged; the token layer is
what made that possible.

**Refinement passes performed:**

1. ✅ **Structure** — hero column balance, section rhythm, archive as index not grid.
2. ✅ **Art direction** — display scale reduced from 6.5rem (six-line wrap) to 5rem; Arabic
   given its own scale, leading and font; metadata floor raised to 11px.
3. ✅ **Interaction** — orbit spread made container-relative so cards never clip; cursor
   corrected for reduced motion; magnetic range capped; contrast regression guarded by a test.
4. ✅ **Recognition** — removed template patterns, verified every public claim traces to a
   source, confirmed the Product Arc reads in three seconds.
5. ✅ **Light-studio pass** — palette flip via tokens, floating pill nav, centred two-tier
   lockup, seven-card arc with per-project card art, sawtooth seam, retuned accents.
6. ✅ **`pixel-portfolio-style` pass** — Handjet display face in both scripts, all borders
   removed, sawtooth at every background change, squiggle under every section title, fan
   choreography to spec, Motion library and custom cursor removed, favicon/OG/nav mark unified
   on one pixel bitmap, and the five measured accessibility deviations from the system's own
   token table.
7. ✅ **Screenshot review pass** — which is where the layout defects surfaced. Two component
   classes were shadowing Tailwind utilities (`.container`, `.grid`), laying every page out at
   the wrong measure and forcing three columns onto elements that only wanted `display: grid`;
   and the work gallery's card art was collapsing to its content height, rendering eight
   near-empty tiles. All three passed lint, types and 88 tests. Renamed to `.shell` and
   `.gallery`, art given a flex parent, and a unit test added so the class collision cannot
   recur. The pass also caught a focus ring at 1.73:1, three IMMAR/NANO showcase captions sitting
   over one identical image, and a `showcase/` directory left empty when its component was folded
   into `FanCardArt`.

✅ **Firefox and WebKit** — an 8-test cross-browser smoke suite runs in both engines and passes:
layout and direction in both locales, zero horizontal overflow, button contrast, Arabic leading,
navigation, locale switching, case-study chapters, contact validation and the 404.

⬜ **200% zoom** — not run as a dedicated pass; the overflow assertions at 390–1440px cover the
same failure mode.

## Documentation

✅ `README.md` · ✅ `EXECUTION-STATE.md` · ✅ `MASTER-CHECKLIST.md` ·
✅ `repository-audit.md` · ✅ `reference-analysis.md` · ✅ `design-system.md` ·
✅ `identity-system.md` · ✅ `motion-system.md` · ✅ `content-inventory.md` ·
✅ `content-gaps.md` · ✅ `assets-manifest.md` · ✅ `verification-report.md` ·
✅ `launch-plan.md` · ✅ `launch-copy.md` · ✅ `launch-assets.md` ·
✅ `submission-checklist.md` · ✅ `.env.example` ·
✅ `pixel-portfolio-style/` — the design system itself, on disk and authoritative

## Reference analysis

✅ **`dilanomer.com` was inspected directly** in a real Chromium browser at 1440×900, with a
full-page capture plus eight scrolled section captures. An earlier revision of this checklist
recorded it as unreachable — a plain text-fetch had returned HTTP 403 where a real browser
returns 200. That entry was wrong and has been corrected; see `reference-analysis.md`.

⬜ **RedFolio was never inspected.** The marketplace description is client-rendered and never
resolved. Nothing in this portfolio derives from it, and the RedFolio half of the original brief
was dropped once Mohammed chose Dilan's direction.

✅ The observation was formalised into `docs/pixel-portfolio-style/` — the design system the
site is now built on, supplied by Mohammed and applied in place per its own rule #0.

## Constraints honoured

✅ Worked inside `Desktop/PORTFULIE` only · ✅ No push, PR, deploy, purchase or remote change ·
✅ No secrets committed; `.env.example` documents variables · ✅ No destructive git commands ·
✅ Unrelated user work in the parent repository untouched — staging was path-scoped and the file
list verified before committing · ✅ No test weakened to pass — all 27 tests the restyle broke
were repaired against the new markup, none deleted · ✅ Nothing posted or submitted

✅ **Committed** to the local branch `portfolio/pixel-restyle` — **with Mohammed's explicit
permission, and only after he asked for it.** Not pushed.

## Definition of done

| # | Criterion | Status |
|---|---|---|
| 1 | Original premium art direction, not a clone | ✅ |
| 2 | Strong first impression for high-value clients | ✅ |
| 3 | Hero fan original, memorable, usable, strong in 3s | ✅ |
| 4 | `Engineered in Baghdad` as subtle credible identity | ✅ |
| 5 | Sendy, IMMAR, NANO complete, distinct, convincing | ✅ |
| 6 | Additional verified projects in a polished archive | ✅ |
| 7 | EN/AR complete with correct LTR/RTL | ✅ |
| 8 | Desktop, tablet, mobile intentionally designed | ✅ |
| 9 | Premium motion with accessible fallbacks | ✅ |
| 10 | Navigation, routes, language switch, contact functional | ✅ |
| 11 | No `Coming soon`, empty content or misleading links | ✅ enforced at build |
| 12 | No fake metrics, testimonials, clients, rankings, awards | ✅ enforced by tests |
| 13 | Lint, type-check, build and tests pass | ✅ 0 errors / 36 pages / 99 tests (17 unit + 82 e2e), build verified from a deleted `.next` |
| 14 | Screenshots and verification report demonstrate quality | ✅ 132 shots + report |
| 15 | Launch package complete, nothing posted | ✅ |
| 16 | No secrets, remote changes, pushes, deploys or submissions | ✅ — one local branch commit, requested by Mohammed |
