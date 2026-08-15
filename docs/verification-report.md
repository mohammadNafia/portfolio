# Verification report

Every result below was produced by running the stated command. Nothing is estimated.

**Date:** 2026-08-14 (re-verified after the `pixel-portfolio-style` restyle)
**Node** v24.11.0 · **npm** 10.9.6
**Tests run against the production build** (`next start`, port 3211), not the dev server.

---

## 1. Commands and actual results

| Command | Result |
|---|---|
| `npm install` | Success. **3 high-severity advisories** — see §9. |
| `npm run lint` (`eslint .`) | **Pass** — 0 errors, 0 warnings. |
| `npm run typecheck` (`tsc --noEmit`, strict + `noUncheckedIndexedAccess`) | **Pass** — 0 errors. |
| `npm test` (`vitest run`) | **Pass** — 17/17 tests, 1 file. |
| `npm run test:e2e` (`playwright test`) | **Pass** — 82/82 across 5 browser projects, green on two consecutive full runs. |
| `npm run build` (`next build`) | **Pass** — 36 pages generated, 0 errors, 0 warnings. Verified twice from a **deleted `.next`** (see §6.18). |
| `node scripts/shoot.mjs` | 132 screenshots captured. |

### Build output

```text
Route (app)                                 Size  First Load JS
┌ ○ /_not-found                            991 B         104 kB
├ ● /[locale]                              944 B         126 kB
├ ● /[locale]/about                      1.67 kB         108 kB
├ ● /[locale]/contact                      589 B         123 kB
├ ● /[locale]/privacy                    1.66 kB         108 kB
├ ● /[locale]/services                   1.66 kB         108 kB
├ ● /[locale]/work                          3 kB         109 kB
├ ● /[locale]/work/[slug]                2.12 kB         108 kB   (16 paths)
├ ƒ /[locale]/[...rest]                    138 B         103 kB
├ ƒ /api/contact                           138 B         103 kB
├ ○ /icon, /opengraph-image, /robots.txt, /sitemap.xml
+ First Load JS shared by all             103 kB
ƒ Middleware                             34.3 kB
```

All content routes are statically generated for both locales. Only the contact API and the
catch-all are dynamic.

**Removing the Motion library cut First Load JS by roughly 30%** — 152 kB → 126 kB on the
homepage, and 149–154 kB → 108–109 kB on every other route. That was not the reason for
removing it, but it is the largest single performance change in the project.

---

## 2. Routes tested

16 case-study pages (8 projects × 2 locales) plus 12 static route/locale pairs.

| Route | EN | AR | Notes |
|---|---|---|---|
| `/` | ✅ redirect | ✅ redirect | Middleware honours cookie, then `Accept-Language` |
| `/[locale]` | ✅ | ✅ | |
| `/[locale]/work` | ✅ | ✅ | Filter announces count via `role="status"` |
| `/[locale]/work/sendy` | ✅ | ✅ | 7 chapters |
| `/[locale]/work/immar` | ✅ | ✅ | 6 chapters |
| `/[locale]/work/nano-ocr` | ✅ | ✅ | 6 chapters |
| `/[locale]/work/al-tafawuq` · `virtual-banking` · `form-builder` · `invoice-mini-app` · `medichub` | ✅ | ✅ | 3 chapters each |
| `/[locale]/about` · `/services` · `/contact` · `/privacy` | ✅ | ✅ | |
| unknown path | ✅ 404 | ✅ 404 | Returns HTTP 404 **and** keeps header, footer, locale |

An e2e test fetches every `/en/work/*` link found on the work index and asserts HTTP 200 —
there are no dead internal links.

---

## 3. Accessibility findings

`@axe-core/playwright`, tags `wcag2a wcag2aa wcag21a wcag21aa`, across **12 route/locale
combinations**.

**Result: 0 serious or critical violations.**

### Issues found during the earlier light-studio pass and fixed

Historical — some reference tokens and components the restyle has since removed. Kept because
the reasoning still applies to whatever replaces them.

| Issue | Detail | Fix |
|---|---|---|
| `color-contrast` — 121 nodes | `--color-tertiary` `#6e6c67` measured **3.8:1** on ink; AA requires 4.5:1 for the 12px metadata it was used on. | Raised to `#87857e` (**5.4:1** on ink, 4.8:1 on the raised surface). |
| Unreadable metadata size | Some metadata rendered at 9px. | Floor raised to 11px across all components. |
| Accessible-name pollution | The visible "Required" marker was part of every field's label text, so fields were named "Email Required". | Marker is now `aria-hidden` (redundant with `aria-required`); "Optional" retained, as it has no ARIA equivalent. |
| Control renamed itself | The mobile menu button's accessible name flipped between "Open menu" and "Close menu". | Stable name (`Menu`); `aria-expanded` carries the state. |
| Accent-as-text after the redesign | Five nodes at 1.67–3.72:1 — project accents are brand fills and several are too light for type on a light ground. | Added `--accent-ink` (accent mixed 62% toward ink) and routed every accent-coloured text through it. |
| Nav links keyboard-unreachable | The redesigned pill collapses at the top of the homepage; the links were `tabIndex={-1}` while collapsed. | The pill now also expands on focus-within, so the links are never scroll-gated. |

### Found during the restyle and fixed

| Issue | Detail | Fix |
|---|---|---|
| The system's own token table fails AA | `--ink-3` `#9A9A9A` = **2.8:1**; `--accent` `#0B8DF8` = **3.4:1** as text; brand tag pills as low as **2.07:1**. The table was sampled from a screen recording, not measured. | Five documented deviations. `--ink-3` → `#6E6E6E` (5.1:1); the accent **split by function**; tag text computed from the brand's luminance. Each is commented inline in `globals.css` with its measured ratio. |
| Hero fan invisible under reduced motion | The global block zeroed animation *durations* but not *delays*. The fan staggers via `animation-delay`, so cards sat at `opacity: 0` while axe scanned — and a reduced-motion visitor watched them pop in one at a time. | `animation-delay` and `transition-delay` zeroed; the fan given an explicit settled-state rule. |
| `POST /` label at 3.1:1 | Accent-coloured 11px text on a card face. | Routed to `--ink-2`. |
| **Focus ring at 1.73:1** | A hard-coded `rgba(11, 141, 248, .45)` composites to `#91CBFC` on white. WCAG 1.4.11 requires 3:1 of a focus indicator. **axe cannot test focus-ring contrast**, so a clean axe run said nothing about it. | Every focus ring — `:focus-visible`, form fields, filter chips — now uses `var(--color-accent)` at full opacity: 5.25:1 on `--bg`, 4.49:1 on `--bg-alt`. Guarded by a new e2e test that also asserts the ring is opaque. |

### Manually verified

- **Keyboard**: the skip link is the first focusable element and moves focus to `#main`; a case
  study is reachable and openable by keyboard within 25 tabs (asserted in tests). The nav pill
  expands on `focus-within`, so its links are never gated behind a scroll position.
- **Focus**: every interactive element has a visible `:focus-visible` ring — 3px
  `var(--color-accent)`, measured at 5.25:1 on `--bg` and 4.49:1 on `--bg-alt`. Focus is never
  removed. There is no mobile menu dialog to trap focus in: below 760px the pill drops its links
  and the footer carries the routes, which `mobile.spec.ts` asserts.
- **Landmarks**: `header` / `main` / `footer` / `nav` with labels; one `h1` per page; heading
  order is sequential.
- **Forms**: every field has a `<label for>`; errors are associated via `aria-describedby`;
  `aria-invalid` is set; the error summary is `role="alert"`. The error state uses ink and a
  ring, never colour alone — the system has no red token.
- **Touch**: gallery captions are pinned open under `@media (hover: none)`, so a project's name
  is never hidden behind an interaction that does not exist on the device.
- **Reduced motion**: asserted to actually change `matchMedia` before testing (see §6.3).
- **No horizontal overflow** at 1440/1280/1024/768/430/390 in both locales — asserted for all
  12 combinations.
- **Arabic**: the pixel display face renders Arabic with correct joining at hero scale in
  Chromium, Firefox and WebKit; leading is asserted to differ from the Latin metric.

---

## 4. Performance findings

Measured in Chromium at 1440×900 against the production build, with `PerformanceObserver`
registered **before first paint** — `getEntriesByType('largest-contentful-paint')` returns
nothing without a buffered observer, and an earlier version of this measurement reported `null`
for every route because of it. Transfer is the sum of `transferSize` across all resources;
`content-length` is absent on compressed responses and undercounts badly.

| Route | LCP | CLS | Transfer |
|---|---|---|---|
| `/en` | 1712 ms | **0** | 318 KB |
| `/en/work` | 832 ms | 0.0019 | 317 KB |
| `/en/work/sendy` | 892 ms | 0.0020 | 257 KB |
| `/en/services` | 884 ms | 0.0019 | 264 KB |
| `/ar` | 316 ms | **0** | 501 KB |
| `/ar/work/sendy` | 964 ms | 0.0004 | 429 KB |

- **CLS is effectively zero on every route** — the worst is 0.002, against a 0.1 "good"
  threshold. Nothing on the site loads late enough to move anything.
- **LCP is inside the 2.5 s threshold everywhere.** `/en` is the slowest at 1.7 s because it
  ran first, cold; `/ar` at 316 ms ran with the shared chunks already cached. Treat the spread
  as measurement order, not as a real difference between locales, and re-measure on the deployed
  site where the CDN changes the picture entirely.
- **Arabic pages transfer ~180 KB more.** Both Arabic faces — Handjet's Arabic subset and IBM
  Plex Sans Arabic — are larger than their Latin counterparts. Both use `display: swap` and are
  self-hosted by `next/font`, so this does not delay first paint. It is the price of the pixel
  identity surviving the locale switch, and it is worth it.
- **First Load JS is 103 KB shared + 0.6–3 kB per route**, down from 149–154 kB before the
  Motion library was dropped.
- **No images are shipped at all** — every product surface is rendered DOM, so there is no image
  weight, no layout shift from late media, and no upscaled screenshots.

These figures replace a stale table measured before the redesign, which carried the note "weight
is unchanged". That note was wrong by the time it was read: the restyle removed an animation
library and added a third font.

### Not run — stated honestly

**Lighthouse was not executed.** The Lighthouse CLI is not installed in this environment and
installing it was not attempted, so no Performance/Accessibility/Best-Practices/SEO scores are
claimed anywhere in this repository. The Core Web Vitals above are real measurements and are
what the numbers in this report rest on. Mohammed should run Lighthouse against the deployed
site before quoting any score.

---

## 5. Test suite composition

**Unit — 17 tests** (`tests/unit/content.test.ts`)
Registry validation · exactly three featured projects · chapter-count minimums · slug
resolution and next-project wraparound · distinct accents · no placeholder copy · both locales
present on every localised field · external links absolute+https · **no fabricated metrics**
(user counts, percentages, currency) · **no unverifiable ranking claim** · only the two
documented awards appear · Arabic dictionary structurally identical to English · no empty or
copy-pasted Arabic string · **no component class named after a Tailwind utility** ·
**no bare `var()` in an arbitrary text utility** · **every showcase id draws its own face**.

The last three are source-level guards added after the defects the screenshot review turned up
(§6.14 and §6.17). Each asserts it parsed a plausible number of names **before** checking them —
a regex that silently matched nothing would otherwise pass forever, which is how the
reduced-motion suite once passed while testing normal motion.

**E2E — 82 tests** across `chromium` (54), `reduced-motion` (6), `mobile` (6, WebKit /
iPhone 14 Pro), `firefox` (8) and `webkit` (8).
Locale routing and persistence · deep-link redirects · navigation · browser back/forward ·
case-study completeness and absence of placeholder text · chapter navigation · work filtering ·
every project link resolves 200 · contact validation, honest-unavailable behaviour, email
format · 404 status and shell · skip link · keyboard reach · axe on 12 route/locale pairs ·
button contrast, **accent** contrast and **focus-ring** contrast regression guards · horizontal-overflow at 6 widths × 2 locales ·
reduced-motion content visibility, settled fan, stopped marquee, readable case study, working
navigation · mobile nav-pill collapse, footer route reachability, fan card count, touch
captions, chapter rail, carousel dots.

**Cross-browser (16 tests)** — Firefox and WebKit each run the same 8-test smoke suite: both
locales render with correct direction and zero horizontal overflow, the primary button keeps its
measured contrast, **Arabic display leading is asserted to differ from the Latin metric**,
navigation and locale switching work, a case study renders all its chapters, contact validation
fires, and the 404 returns a real 404 with the shell intact. All 16 pass in both engines.

### On the count moving from 71 to 82

**Nothing was dropped.** The 71 was always e2e only; the unit tests are a separate `vitest` run
and were never in that number. The restyle broke 27 tests by changing markup, and all 27 were
repaired against the new markup rather than deleted. `mobile.spec.ts` and
`reduced-motion.spec.ts` were rewritten for components that no longer exist.

The net +11 is regression guards, one per defect the review surfaced: the accent split, the
focus ring, five covering the generated metadata routes and the favicon the document actually
links, and four asserting the Arabic pages render Arabic identity strings. Unit went 14 → 17 for
the two stylesheet-hygiene guards and the showcase-face guard.

---

## 6. Bugs found by verification and fixed

Ordered by severity. Full detail in `EXECUTION-STATE.md`.

1. **Primary CTA text was invisible** (ivory on ivory, contrast 1:1) on every page. Cause:
   unlayered base CSS beating Tailwind's layered utilities, so `a { color: inherit }` overrode
   every text-colour utility on links. Now guarded by an e2e assertion.
2. **Arabic rendered with Latin typography** — `line-height: 0.94` on Arabic display type, with
   diacritics colliding into the line above, and Arabic headings falling back to a system font
   because no Arabic family was in the display stack.
3. **Reduced-motion tests were passing vacuously** — Playwright's context-level `reducedMotion`
   option never reached `matchMedia`. The suite now asserts the emulation is active first.
4. **Custom cursor hid the native cursor under reduced motion.**
5. **121 colour-contrast violations** from `--color-tertiary`.
6. `text-[var(--x)]` ambiguity across 24 files.
7. Form fields named "Email Required"; menu button renamed itself when toggled.
8. Content invisible without JavaScript (reveal components render their hidden state).
9. **Section reveals could stay permanently invisible** — `amount: 0.18` is unreachable for a
   section taller than the viewport, and a fast scroll can skip the observer entirely. 26 of 40
   reveals were reproducibly stuck. Now triggered by a fixed negative bottom margin.
10. Accent-as-text contrast, and keyboard-unreachable nav links — both introduced by the
    redesign and both caught before it shipped.

Found during the `pixel-portfolio-style` restyle:

11. **The design system's own token table fails WCAG in five places.** It was sampled from a
    screen recording rather than measured, so it inherited the reference site's contrast
    failures. Five documented deviations; see §3 and `design-system.md`.
12. **Reduced motion left the hero fan at `opacity: 0`.** Animation *delays* were not zeroed,
    only durations.
13. **`restart-prod.mjs` verified the wrong stylesheet.** The page links two — the font CSS
    first, whose hash never changes — and the script checked only `match()[0]`. It reported a
    fresh build while `next start` served the previous app CSS, which is the exact failure the
    script exists to catch. It now verifies every stylesheet and prints all of them.
14. **Two component classes were named after Tailwind utilities.** `.container` and `.grid`.
    `utilities` beats `components`, so the collision ran both ways and neither side errored:

    - Tailwind's `container` **overrode the site's measure**. `--container` is 1080px; pages
      actually rendered at 1280px on desktop, 1024px at 1024, 768px at 900 and 640px at 700.
      Every route was laid out at the wrong width, in both locales, at every viewport.
    - The site's `.grid` **leaked into the 15 elements using Tailwind's `grid`**, forcing
      `grid-template-columns: repeat(3, 1fr)` wherever their own `md:`/`lg:grid-cols-*` had
      not yet applied. Services and the layer diagram rendered two columns between 760 and
      1024px instead of stacking.

    Renamed to `.shell` and `.gallery`, with a unit test that fails the build if a component
    class is ever named after a core utility again. This was the **third** cascade-layer defect
    in this project; the guard exists so it is the last.
15. **The work gallery rendered as empty tiles — and so did every case-study composition.**
    `FanCardArt` filled its slot with `flex-1`, which needs a flex parent. The hero fan and the
    case-card cover provided one; `.gallery__face` and the two fixed-aspect blocks (case-study
    hero cover, in-chapter showcases) did not, so the art collapsed to its content height and
    left a thin strip of interface above a tall blank rectangle.

    Fixed once in the component — `h-full w-full` alongside `flex-1`, inert in a flex parent and
    load-bearing in a block one — rather than at each call site, which would have left the next
    one to fail identically. Caught by reviewing the recaptured screenshots; every automated
    check passed with all of it in that state.
16. **The focus ring failed WCAG 1.4.11 at 1.73:1.** A translucent hard-coded blue, on the one
    affordance keyboard users depend on. Three separate rules carried it (`:focus-visible`,
    form fields, filter chips), all now on `var(--color-accent)`. axe cannot test this, which
    is why the e2e suite now does.
17. **Three case-study captions sat over one identical image.** `FanCardArt` keys on
    `variant ?? slug`, but `immar-mobile`, `immar-roles` and `nano-output` fell through to
    their project's single face — so IMMAR's case study showed one picture three times, under
    three captions describing three different screens. Nothing automated could see it: the
    captions were correct, the images rendered, the whole suite passed. The three now draw
    distinct faces, and `assets-manifest.md` records the rule.
18. **The served build returned 500 for every unknown path** — both locales — with
    `TypeError: a[d] is not a function` from the webpack runtime. Found by looking at a 404
    screenshot that rendered as a bare "500 Internal Server Error".

    **The first root cause given here was wrong** and is corrected: it was attributed to a module
    shared between the client and Satori graphs, but two controlled trials afterwards — clean
    build with no server, and clean build with `next start` holding `.next` — both passed. The
    failures correlated with concurrent `next build` runs and with `.next` being deleted under
    a build in progress, which was a process-management error on my side rather than a defect in
    the source. `npm run verify` now cleans before building regardless.

19. **The favicon and every social-card preview were broken on every page.** The middleware
    matcher skipped `_next`, `api` and anything containing a dot — which covered `/robots.txt`
    and `/sitemap.xml`, but Next's generated metadata routes have no extension. The document
    linked `/icon?…`, middleware redirected it to `/en/icon`, and that 404'd.

    Nothing caught it: a missing favicon degrades silently, and no test had ever requested the
    OG image — the asset the entire launch package depends on for link previews. Five new e2e
    tests now assert `/icon`, `/opengraph-image`, `/robots.txt` and `/sitemap.xml` return 200
    **without a redirect**, and that the `href` in the document's own icon link resolves.
20. **The Arabic About page printed "Baghdad, Iraq" in Latin.** It read `site.location`
    directly — an identity string that lives outside the typed dictionary, so nothing could
    enforce the Arabic variant. Worse, the dictionary carried an unused `common.baghdad` with
    the correct `بغداد، العراق`: two sources of truth, and the wrong one rendered. Contact had
    already been written correctly, which is why it read as fine at a glance.

    The About page now branches on locale like Contact does, the duplicate dictionary key is
    deleted, and four e2e tests assert each locale's pages show that locale's location string.
21. **A flaky mobile test.** Four full navigations in one test, asserted with the 5s expect
    timeout; it failed roughly once in five parallel runs. Now uses `waitForURL`, so a
    navigation gets the navigation timeout. The assertion is unchanged.

---

## 7. Screenshots

`docs/screenshots/<viewport>/<locale>/<route>.png` — 132 files, full-page, 2× DPR.

Viewports: 1440×900 · 1280×800 · 1024×1366 · 768×1024 · 430×932 · 390×844
Locales: `en`, `ar`
Routes: home · work · 4 case studies · about · services · contact · privacy · 404

Captured with reduced motion for determinism. Three things the harness has to get right, all
learned by getting them wrong:

- It **scrolls the full document first.** Chromium's full-page capture does not fire
  `IntersectionObserver` for below-the-fold content, so it would otherwise photograph
  un-revealed sections.
- It **disables `scroll-behavior: smooth`.** A programmatic scroll that animates makes the
  progress check exit immediately and yields half-scrolled captures.
- It **throws on an unexpected status** rather than warning. It used to print `WARN(500)` and
  carry on, so two complete 132-shot runs finished "successfully" against a server returning 500
  for every route. The giveaway was that every output file was byte-identical.

**They are gitignored.** They are build output, the full set is ~310 MB, and a stale set is worse
than none. Regenerate with `npm run shots`.

Reviewing them is not ceremonial: six defects in this session passed lint, strict types and the
entire suite, and were caught by looking.

---

## 8. Unresolved content placeholders

Full detail in `content-gaps.md`. Summary, by impact:

1. **Product screenshots** — all product surfaces are coded compositions, captioned as concepts.
2. **Portrait** — the pixel monogram stands in, including in the nav-pill avatar.
3. **CV** — no CV link and no RESUME section; seven variants exist and none is confirmed current. Mohammed is supplying one PDF; the section ships with it.
4. **The unnamed client education platform** — omitted entirely; no source confirms its name.
5. **Public project links** — every `links` array is empty; no verified public URL exists.
6. **Production domain** — `NEXT_PUBLIC_SITE_URL` must be set before launch.
7. **Contact delivery provider** — `RESEND_API_KEY` unset; the form says so honestly.

---

## 9. Known limitations

| Limitation | Why it remains |
|---|---|
| **3 high-severity npm advisories** | `next`, `postcss` and `sharp`, all transitively fixed only by **Next.js 16** — `npm audit fix` reports `isSemVerMajor: true` for each. A major framework upgrade is not a documentation task and was not attempted unprompted. It is item 1 in §10. |
| No Lighthouse scores | CLI not available here; real Core Web Vitals reported instead. |
| Cross-browser coverage is a smoke suite, not the full matrix | Firefox and WebKit run 8 tests each covering layout, bidi, contrast, navigation, forms and 404. The full axe/overflow/reduced-motion matrix runs on Chromium only, to keep the suite fast. |
| No visual regression baselines | Screenshots are for human review, not assertions. Bugs 15 and 17 (empty gallery tiles; three captions over one image) passed lint, types and the entire suite, and were caught only by looking. Both now have source-level guards, but a baseline would have caught them directly. Adding `toHaveScreenshot()` baselines is the highest-value next step in this table. |
| Case studies rely on coded compositions | Blocked on real screenshots from Mohammed. |
| 200% zoom checked only via the overflow tests | The overflow assertions at 390–1440px cover the same failure mode, but a dedicated zoom pass was not performed. |

---

## 10. Exact next actions for Mohammed

1. **Decide on the Next.js 16 upgrade.** Three high-severity advisories (`next`, `postcss`,
   `sharp`) are only resolved by it, and it is a semver-major migration. It should happen before
   launch, with the full suite re-run afterwards — the 99 tests are exactly what makes that
   upgrade safe to attempt.
2. Set `NEXT_PUBLIC_SITE_URL` to the real domain. **Blocking for launch** — canonical URLs,
   sitemap and Open Graph all depend on it.
3. Supply product screenshots (list and specs in `content-gaps.md` §1).
4. Decide on a portrait, and confirm one canonical CV or confirm there is none.
5. Confirm or correct the availability statement.
6. Add `RESEND_API_KEY` if the contact form should deliver email.
7. Confirm which projects may be publicly named and linked.
8. Run Lighthouse against the deployed site before quoting any score.

## 11. External actions still requiring approval

**Nothing has been pushed, deployed, submitted, posted or purchased.** No DNS, remote service or
third-party account was touched, and no secrets exist in the repository.

The work is committed to the **local branch `portfolio/pixel-restyle`**, at Mohammed's explicit
request. No remote exists in that history.

The launch package in `launch-plan.md`, `launch-copy.md` and `submission-checklist.md` is
drafted and ready but **entirely unexecuted** — every item there needs Mohammed's approval.
