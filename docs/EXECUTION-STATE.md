# Execution state

Persistent progress record for the autonomous build of Mohammed Nafia's portfolio.
Update after every major phase so work can resume cleanly after a context reset.

**Last updated:** 2026-08-14
**Current phase:** Complete — restyled into `pixel-portfolio-style`, verified, committed
**Branch:** `portfolio/pixel-restyle` · base commit `c1b4e09`
**Working directory:** `c:\Users\Administrator\Desktop\PORTFULIE`

---

## Status summary

| Check | Command | Result |
|---|---|---|
| Lint | `npm run lint` | Pass — 0 errors, 0 warnings |
| Type-check (strict) | `npm run typecheck` | Pass — 0 errors |
| Unit tests | `npm test` | Pass — 17/17 |
| End-to-end | `npm run test:e2e` | Pass — 82/82 across Chromium, Firefox and WebKit |
| Production build | `npm run build` | Pass — 36 static pages, **verified from a deleted `.next`** |
| Screenshots | `node scripts/shoot.mjs` | 132 captured (6 viewports × 2 locales × 11 routes) |

---

## Completed phases

### 1. Audit and recovery plan
- Repository was empty apart from the prompt file. Git root is `C:\Users\Administrator`
  (the whole home directory is a repo) — **no git commands were run beyond `git status`**,
  and nothing was committed, staged, reset or cleaned.
- `create-next-app` refused the directory name (`PORTFULIE` contains capitals, which npm
  rejects), so the project was scaffolded manually with an explicit `package.json`.
- Source material inventoried from the Desktop (see `content-inventory.md`).

### 2. Foundations
- Design tokens in `src/app/globals.css` as the single source of truth.
- Motion vocabulary centralised in `src/lib/motion.ts`. *(Superseded in phase 10 — the file is gone; motion is CSS custom properties.)*
- Locale routing (`/en`, `/ar`) via `src/middleware.ts` + `src/app/[locale]/`.
- Typed, zod-validated content model in `src/content/`.

### 3. Homepage and signature interaction
- All 12 required sections built. *(Re-ordered in phase 10 to the system's canonical order.)*
- Product Orbit implemented with pointer tilt, drag, keyboard, touch tabs and a static
  reduced-motion composition. *(Superseded in phase 10 by the seven-card hero fan.)*

### 4. Case studies
- Sendy (7 chapters), IMMAR (6), NANO (6) — all complete, no placeholders.
- Build-time validation refuses to compile a featured project with fewer than 6 chapters.

### 5. Remaining routes
- Work index with accessible filtering, About, Services, Contact, Privacy, 404.
- 5 archive projects each with a real 3-chapter presentation.

### 6. Bilingual and responsive
- Full EN/AR dictionaries; Arabic completeness enforced by the type system and a unit test.
- RTL verified at all six viewports.

### 7. Motion and interaction
- One vocabulary across all routes; reduced-motion designed alternatives.

### 8. QA
- All checks above green. Details in `verification-report.md`.

### 9. Light-studio redesign (after review)
Mohammed reviewed the dark cinematic direction and said he preferred Dilan Omer's portfolio.
The reference was then inspected properly in a real browser (an earlier text-fetch had returned
403 and the first analysis wrongly recorded it as unreachable — see `reference-analysis.md`),
and the site was re-art-directed toward it:

- **Light studio palette** — warm light-grey ground, white raised surfaces, one signature blue.
- **Foreground tint tokens** replacing 23 hard-coded `rgba(244,241,232,…)` overlays, so the
  theme is swappable from one place.
- **Floating pill navigation**, centred, expanding in place on scroll — and on keyboard focus,
  so the links are never scroll-gated.
- **Centred two-tier display lockup** with explicit `titleTop`/`titleMain` dictionary keys.
- **Product Arc** — the three-card orbit widened to a seven-card fanned arc with per-project
  card art, an adaptive visible-card count, and a live caption naming the centred product.
- **Sawtooth seam** drawn from the wedge mark, joining the hero to the first white section.
- **Retuned project accents** for a light ground, plus `--accent-ink` for accent-as-text.
- **Generated OG image, favicon and theme-colour** updated to match.

Structure, content model, bilingual system, case studies and the accessibility contract were
unchanged. That the swap was mostly a token edit is what the token layer was for.

### 10. Restyle into `pixel-portfolio-style` (current)

Mohammed supplied a formal design system — the `pixel-portfolio-style` skill, now on disk at
`docs/pixel-portfolio-style/` — derived from the same reference and asked for the site to adopt
it. He also chose, when asked, to **restyle in place rather than rebuild**, which is what
`SKILL.md` rule #0 demands: never rewrite a working, tested app just to adopt a look.

What changed:

- **Pixel display face — Handjet**, reversing the earlier decision to reject a bitmap face.
  Handjet ships Arabic as well as Latin, so the pixel identity survives the locale switch
  instead of splitting the site into two display voices. Poppins for Latin UI, IBM Plex Sans
  Arabic for Arabic UI. Space Grotesk and JetBrains Mono removed.
- **Token layer replaced** with the system's palette, radii (pill/20/16/14), four shadows and
  three easing curves.
- **All borders removed** (rule #6) — separation is surface fills and shadows only.
- **Sawtooth at every background change**, on every route, not only under the hero.
- **Section header = pixel title + squiggle**, centred, with no exceptions.
- **Hero fan** — the seven-card arc re-choreographed to the system's spec: stacked arrival,
  outward spread in pairs at 90ms, settle at ~2.4s, idle float, three cards below 760px.
- **Nav pill** to spec: 260 → 560px at 70% of the hero, avatar, scroll-spy — plus the
  focus-within expansion this project had already added.
- **Motion library removed.** `src/lib/motion.ts` is gone; the reveal is a plain
  IntersectionObserver on `threshold: [0, 0.2]`, which also permanently closed bug 10 below.
- **Custom cursor removed** — the system has no such component.
- **The Motion dependency uninstalled.** Dropping the imports is what cut First Load JS by
  roughly 30% — 152 kB → 126 kB on the homepage, 149–154 kB → 108–109 kB elsewhere — since the
  bundle already tree-shook it. The `npm uninstall` was housekeeping after the fact: the package
  was still in `package.json` with nothing importing it. Either way it is the largest single
  performance change in the project, and it was a side effect rather than the goal.
- **Favicon, OG card and nav-pill mark** rebuilt as one shared pixel bitmap
  (`MONOGRAM_BITMAP`), replacing the retired wedge mark.

#### Deviations from the system, and why

The system's token table was sampled from a screen recording rather than measured, so it carries
the reference site's own contrast failures. Mohammed confirmed this directly and ruled that the
accessibility floor wins. Five deviations, each documented inline in `globals.css` with its
measured ratio — see `design-system.md` for the table.

The most consequential is the **accent split**, which was Mohammed's refinement rather than a
flat swap: `--accent` `#0A6DC4` for anything carrying text, `--accent-bright` `#0B8DF8` for
text-free graphics where the 3:1 threshold applies. It keeps the recognisable blue legal instead
of losing it everywhere.

#### Two content substitutions, both approved

- **Tools marquee instead of a client logo wall.** No client has given permission to be named,
  and inventing logos would be a fabrication.
- **RESUME omitted, not stubbed.** There is no current CV to link. Mohammed is supplying one
  PDF; the section ships when the file does. An empty section or a dead link is exactly the
  weakness this portfolio exists to avoid.

#### Test-suite reconciliation

The count moved 71 → 82. **Nothing was dropped.** The 71 was always e2e only (44 chromium + 5
reduced-motion + 6 mobile + 8 firefox + 8 webkit); the 14 unit tests are a separate `vitest`
run and were never in that number. The restyle broke 27 tests by changing markup — not the ~11
first reported here, which was wrong — and all 27 were repaired rather than deleted.
`mobile.spec.ts` and `reduced-motion.spec.ts` were rewritten for the components that no longer
exist; the net +1 is a new contrast assertion on the accent split.

---

## Significant bugs found and fixed

These were real defects caught during verification, not cosmetic tweaks:

1. **Tailwind v4 cascade layers — invisible button text.**
   `globals.css` base styles were unlayered. Unlayered declarations beat layered ones
   regardless of specificity, so `a { color: inherit }` overrode every Tailwind text-colour
   utility on links. Primary CTAs rendered ivory-on-ivory (contrast 1:1). Fixed by moving
   base resets into `@layer base` and primitives into `@layer components`.
   Guarded by `tests/e2e/site.spec.ts` → "primary buttons have readable contrast".

2. **Arabic rendered with Latin typography.**
   The `[dir='rtl']` token overrides had been wrapped into `@layer base` by the fix above,
   so the unlayered `:root` Latin defaults won: Arabic display type used `line-height: 0.94`
   and diacritics collided with the line above. Additionally `--font-display` contained no
   Arabic family, so Arabic headings fell back to a system font. Fixed by keeping the RTL
   token block unlayered and adding the Arabic family to every font stack (per-glyph
   resolution, which also fixes mixed-script headings).

3. **`text-[var(--x)]` is ambiguous in Tailwind v4.**
   Replaced across 24 files with real theme utilities (`text-primary`, `bg-inverse`, …).

4. **Reduced-motion tests were passing vacuously.**
   Playwright's context-level `reducedMotion` option did not reach `matchMedia` in this
   Chromium build. The suite now calls `page.emulateMedia()` in `beforeEach` and asserts the
   media query is actually active before testing anything.

5. **Custom cursor hid the native cursor under reduced motion.**
   It trusted a hook that resolves after first render. It now reads
   `prefers-reduced-motion` and `pointer: fine` directly and reacts to changes.

6. **Colour contrast below WCAG AA.**
   `--color-tertiary` was `#6e6c67` = 3.8:1 on ink. Raised to `#87857e` = 5.4:1, and the
   smallest metadata size lifted from 9px to 11px. 121 axe nodes resolved.

7. **Accessible-name pollution on form fields.**
   The visible "Required" marker was part of each field's label text. It is now
   `aria-hidden` (redundant with `aria-required`); "Optional" is kept, as it has no ARIA
   equivalent.

8. **Mobile menu button renamed itself when toggled.**
   Now a stable name with `aria-expanded` carrying the state.

9. **Content invisible without JavaScript.**
   Reveal components render their hidden state into the HTML. A `no-js` class on `<html>`,
   removed by an inline script, forces revealed content visible when scripts do not run.

10. **Section reveals could stay invisible permanently.**
    `whileInView` used `amount: 0.18`. A section taller than the viewport can never reach that
    ratio, and a fast scroll can carry an element past the observer between frames — with
    `once: true` the content then stays hidden for good. 26 of 40 reveals were reproducibly
    stuck. Replaced with a fixed negative bottom margin. (The capture harness was also fighting
    `scroll-behavior: smooth`, which made programmatic scrolls animate; it now disables smooth
    scrolling, waits for hydration, and makes a return pass.)

11. **Accent used as text failed contrast on the light ground.**
    Five axe violations at 1.67–3.72:1. Accents are brand *fills*; `--accent-ink` mixes them
    62% toward ink for any accent-coloured type.

12. **Reduced motion left the hero fan invisible.**
    The global reduced-motion block zeroed animation *durations* but not *delays*. The fan
    staggers via `animation-delay`, so cards sat at `opacity: 0` for up to a second and popped
    in one at a time — precisely the effect the setting exists to prevent. It also failed axe,
    which scanned while they were still invisible. Fixed by zeroing `animation-delay` and
    `transition-delay` and giving the fan an explicit settled-state rule.

13. **The restart script verified the wrong stylesheet.**
    `restart-prod.mjs` checked only the *first* `<link rel=stylesheet>` — the font file, which
    never changes — so it reported a fresh build while `next start` served the previous app
    CSS. That is the exact failure the script exists to catch. It now verifies every stylesheet
    and prints all of them.

14. **Two component classes were named after Tailwind utilities.**
    `.container` and `.grid`. `utilities` beats `components`, so the collision ran in both
    directions and neither side errored:

    - Tailwind's `container` **overrode the site's measure.** `--container` is 1080px; pages
      actually rendered at 1280px on desktop, 768px at 900px wide, 640px at 700px. Every route
      was laid out at the wrong width, in both locales, at every viewport.
    - The site's `.grid` **leaked into all 15 elements** using Tailwind's `grid` utility,
      forcing `grid-template-columns: repeat(3, 1fr)` wherever their own `md:`/`lg:grid-cols-*`
      had not yet applied. Services and the case-study layer diagram rendered two columns
      between 760 and 1024px instead of stacking.

    Renamed `.shell` and `.gallery`. This was the **third** cascade-layer defect in this
    project, so it is now guarded: a unit test fails the build if a class in `@layer components`
    is ever named after a core Tailwind utility, and it asserts it parsed a plausible number of
    class names first so it cannot pass vacuously.

15. **The work gallery rendered as eight near-empty tiles — and so did every case study.**
    `FanCardArt` filled its slot with `flex-1`, which needs a flex parent. The hero fan and the
    case-card cover both provide one; `.gallery__face` and the two fixed-aspect blocks (the
    case-study hero cover, and every in-chapter showcase) did not. The art collapsed to its
    content height, leaving a thin strip of interface above a tall blank rectangle.

    Fixed once, in the component — `h-full w-full` alongside `flex-1`, which is inert in a flex
    parent (`flex-basis: 0%` is definite) and load-bearing in a block one. Patching the call
    sites would have left the next one to fail the same way. The faces were also designed for a
    210×280 fan card and read as sparse at 16:10, so rows now share the plate's height.

    Every automated check passed with all of it in that state. It was caught by **looking at the
    recaptured screenshots**, which is the argument for keeping that step in the loop.

16. **The focus ring failed WCAG 1.4.11 at 1.73:1.**
    A hard-coded `rgba(11, 141, 248, .45)` composites to `#91CBFC` on white, against the 3:1 a
    focus indicator must reach. It was the single affordance keyboard users depend on, and axe
    cannot test focus-ring contrast — so a run with zero violations said nothing about it.

    All three rules carrying it (`:focus-visible`, form fields, filter chips) now use
    `var(--color-accent)` at full opacity. Note this is the one place the accent split's rule
    inverts: rings are graphics, so `--accent-bright` looks correct — but it measures only
    2.90:1 on `--bg-alt`, and half the sections sit there. An e2e test now asserts the ring is
    opaque and clears 3:1 on both grounds.

17. **Three case-study captions sat over one identical image.**
    `FanCardArt` keys on `variant ?? slug`, but `immar-mobile`, `immar-roles` and `nano-output`
    all fell through to their project's single face. So IMMAR's case study showed the same
    picture three times, captioned "student app", "roles and permissions" and "dashboard".

    A caption describing a screen the image is not is the quiet kind of untruth this project
    exists to avoid, and no test could see it — the captions were correct, the images were
    rendered, everything passed. The three now draw distinct faces.

    The same review found the faces were designed for a 210×280 fan card and left a 16:10
    case-study showcase almost entirely empty; rows now share the plate's height.

18. **A 404 capture rendered as a bare "500 Internal Server Error".**
    The served build was genuinely broken — `next start` returned 500 for every unknown path,
    on both locales, with `TypeError: a[d] is not a function` from the webpack runtime.

    **My first diagnosis was wrong.** I attributed it to `MONOGRAM_BITMAP` being exported from
    `Monogram.tsx` (client graph, via the nav pill) while `icon.tsx` and `opengraph-image.tsx`
    imported it into the Satori/Node graph. Two controlled trials afterwards — a clean build
    with no server running, and a clean build with `next start` holding `.next` — both passed,
    so that was not the cause.

    What the failures actually correlated with was **my own process management**. Stray
    background jobs from earlier steps were still alive, each running its own `next start` or
    `next build` against the same `.next` and the same port. Killing every `node` process and
    running one clean build made every route correct — 200 on both locales, 404 on unknown
    paths, 200 on `/icon` and `/opengraph-image` — and it has stayed correct since.

    No controlled trial reproduced the failure otherwise: a clean build with no server running
    and a clean build with `next start` holding `.next` both passed. The root cause was mine,
    not the source's.

    The cost was real: two full 132-screenshot runs were captured against a 500-ing server
    before the byte-identical file sizes gave it away. **Check the served output before a long
    capture**, not after.

    Two things were kept because they are right on their own merits, not because they fixed
    anything: the bitmap now lives in `src/lib/monogram.ts` (shared data with no JSX belongs in
    a data module, whatever the graph), and `npm run verify` cleans `.next` before building so
    a genuine module-resolution failure cannot hide behind cached chunks.

19. **The favicon and every social-card preview were broken on every page.**
    The middleware matcher skipped `_next`, `api` and anything with a dot — enough for
    `/robots.txt` and `/sitemap.xml`, but Next's generated metadata routes have no extension.
    So the document linked `/icon?…`, middleware redirected to `/en/icon`, and it 404'd. Same
    for `/opengraph-image` — the asset the whole launch package relies on for link previews.

    A missing favicon degrades silently and nothing had ever requested the OG image, so nothing
    caught it. Five e2e tests now assert those routes return 200 **without a redirect**, and
    that the `href` in the document's own icon link resolves.

20. **The Arabic About page printed "Baghdad, Iraq" in Latin.**
    It read `site.location` directly. Identity strings live in `src/lib/site.ts`, outside the
    typed dictionary, so the compiler cannot enforce that an Arabic page renders the Arabic
    variant — and the dictionary meanwhile carried an unused `common.baghdad` holding the
    correct `بغداد، العراق`.

    Two sources of truth for one string, and the wrong one won. Contact had already been written
    correctly, which is exactly why nobody looked at About. Fixed by branching on locale as
    Contact does, deleting the duplicate key, and adding four e2e tests that assert each
    locale's pages carry that locale's location.

21. **A flaky mobile test.**
    Four full navigations in one test, asserted with the 5s expect timeout; it failed roughly
    once in five parallel runs. Now `waitForURL`, so a navigation gets the navigation timeout.
    The assertion is unchanged — the test was not weakened to make it pass.

---

## Decisions and rationale

| Decision | Rationale |
|---|---|
| Hand-rolled typed i18n instead of a library | Zero version-drift risk during a long unattended run; Arabic completeness becomes a compile error. Documented in `design-system.md`. |
| Coded product compositions instead of screenshots | No production screenshots of Sendy/IMMAR exist in the repository, and they are private platforms. Compositions are built from each product's real module names and captioned as concepts everywhere they appear. |
| No portrait | No professional photograph exists in the source material. The monogram brand device stands in. A fake or generated portrait was not acceptable. |
| Middleware normalises every URL into a locale | Guarantees the localised 404 renders for unknown paths instead of an unstyled default document. |
| Contact form returns `unavailable`, not `ok`, with no provider | Never fake a successful send. The UI states plainly that the message was not delivered and offers the direct email. |
| Playwright runs against `next start`, not `next dev` | Dev overlays are not part of the design, and the production build is what ships. |
| Restyle in place rather than rebuild | `SKILL.md` rule #0. The app was working and tested; a rewrite would have thrown away the typed content model, the bilingual system, build-time validation and 71 passing tests to obtain a look that a token swap and a component pass could deliver. Mohammed chose this explicitly when asked. |
| Handjet over Silkscreen for the pixel face | It ships Arabic. A Latin-only bitmap face would have forced the Arabic site into a different display voice — two visual systems under one name, with the Arabic one visibly the afterthought. |
| The accessibility floor beats the system's token table | The table was sampled from a screen recording, so it inherited the reference site's own contrast failures. Mohammed confirmed this and ruled the floor wins. Five deviations, each measured and commented in `globals.css`. |
| The accent is split by function, not lightened | `--accent` where text sits on it, `--accent-bright` for text-free graphics. A flat swap to the darker blue would have lost the recognisable colour everywhere; the split keeps it wherever it is legal. |
| Tools marquee instead of a client logo wall | No client has given permission to be named, and invented logos would be a fabrication. The marquee makes the same structural point truthfully. |
| RESUME omitted rather than stubbed | No current CV exists to link. An empty section, a dead link or a "coming soon" is the exact weakness this portfolio is built to avoid. It ships when the PDF does. |
| The OG card is not set in Handjet | Loading the display font into Satori means fetching a font file during the build. A social card is not worth making the build depend on the network; the palette and the sawtooth carry the identity at thumbnail size anyway. |

---

## Known content placeholders

Tracked in full in `content-gaps.md`. Summary: real product screenshots, a professional
portrait, a current CV PDF, and the correct product name for the client platform referred to
in the CV only as "a client's digital page and educational platform".

---

## Git state

Committed **locally, on a branch, with Mohammed's explicit permission** — nothing more.

| | |
|---|---|
| Branch | `portfolio/pixel-restyle` |
| Base commit | `c1b4e09` — "Add Mohammed Nafia portfolio in the pixel-portfolio-style system" |
| Scope | 89 files, all under `Desktop/PORTFULIE`, verified to be 0 files outside it |
| Pushed | **No** |

The git root is `C:\Users\Administrator` — the entire home directory is a repository, with ~583
unrelated dirty entries. Staging was therefore path-scoped and the file list was checked before
committing. A 13-day-old zero-byte `index.lock` with no running git process was removed as
stale. **No destructive git command has been run at any point.**

## Nothing was pushed, deployed or submitted

No remote was touched. No deployments, no third-party submissions, no purchases, no DNS or
remote-service changes. `.env.example` documents the one optional variable; no secrets exist
in the repository.

`docs/screenshots/` (build output) and `docs/reference/` (captures of someone else's site) are
gitignored and are not in the history.
