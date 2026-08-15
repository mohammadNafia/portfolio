# Reference analysis — Dilan Omer

## Verification status

**Dilan Omer's portfolio was inspected directly**, at `https://dilanomer.com/`, in a real
Chromium browser at 1440×900, on 2026-08-14. Captures are in `docs/reference/` (gitignored —
they are someone else's work and do not belong in this repository's history).

An earlier revision of this document recorded that the site could not be reached — a plain
text-fetch of the URL returned **HTTP 403**. Driving an actual browser returned **HTTP 200**
and rendered the page normally. The earlier conclusion was wrong and this document supersedes
it.

| Target | Method | Result |
|---|---|---|
| `https://dilanomer.com/` | Playwright / Chromium | ✅ 200 — full page + eight scrolled section captures |
| `https://www.framer.com/community/gallery/dilan-s-portfolio/` | Playwright / Chromium | ✅ 200, but the gallery page carries no descriptive copy |
| RedFolio marketplace page | Text fetch + browser | Navigation chrome only; the template description is client-rendered and never resolved. **Not analysed.** |
| `references/` directory | Filesystem | Does not exist; no user-supplied material |

**RedFolio was never successfully inspected**, so nothing in this portfolio derives from it.
After review, Mohammed said he preferred Dilan's direction, so the site was re-art-directed
toward it and the RedFolio half of the original brief was dropped.

The observation above was later formalised into a reusable design system —
`docs/pixel-portfolio-style/` — which is now the authority. This document records where the
system came from and how far the implementation goes; `design-system.md` records how it is
applied.

---

## What Dilan's portfolio actually does

Observed, not inferred:

1. **Light ground.** A warm light grey (~`#EAEAEA`) with a fine noise texture. Not dark.
2. **Floating pill navigation.** A white rounded lozenge centred at the top, holding a small
   avatar and a blue "Work with Me" button. On scroll it **expands in place** to reveal
   Background / Case Studies / Resume. It never spans the viewport.
3. **Two-tier centred display lockup.** A bold, wide-tracked line (`FRAMER & PRODUCT`) sitting
   above a very large second line (`DESIGNER`) set in a **pixel/bitmap face**. One short
   friendly subtitle beneath.
4. **A fanned card arc.** Seven product cards in a shallow arc, heavily overlapped, rotation
   increasing outward, each holding a real product screenshot. This is the signature.
5. **A sawtooth seam.** The white section below the hero meets the grey ground along a
   zigzag/triangular edge.
6. **A peeking portrait.** A cropped photograph of him appears at the bottom-left of the hero,
   cut off by the sawtooth, as if looking over it.
7. **A soft three-column media gallery.** Generous gaps, large radii, angled device mockups
   and browser windows on pale backgrounds.
8. **Playful voice.** The footer reads "I had no idea what to include in the footer."
9. **Blue as the single action colour**; black for the secondary "Download Resume" pill.

## What this portfolio took, and what it did instead

| Dilan | This site | Why |
|---|---|---|
| Light warm-grey ground | ✅ Adopted (`#EDEDED`, alternating with white) with a faint grain | This was the change Mohammed asked for. |
| Floating pill nav that expands on scroll | ✅ Adopted, 260 → 560px at 70% of the hero | Distinctive, compact, keeps the first screen for the work. **Extended:** it also expands on `focus-within`, so links are never scroll-gated for keyboard users. |
| Two-tier centred display lockup | ✅ Adopted | Reads instantly, and it puts the role — not a slogan — at the top. |
| **Pixel/bitmap display face** | ✅ Adopted — **Handjet** | Reversed from an earlier decision; see below. |
| Fanned card arc | ✅ Adopted, re-choreographed | Seven real projects at fixed rotations. Ours arrives stacked and spreads outward in pairs, then floats, drops to three cards below 760px, and has an authored static composition under reduced motion. |
| Sawtooth seam | ✅ Adopted as a **system rule** | Not only under the hero — at *every* background change, on every route. |
| Blue as the action colour | ⚠️ Adopted, split | `#0A6DC4` where text sits on it, `#0B8DF8` for text-free graphics. The reference's single blue fails AA as text. |
| Black secondary "Download Resume" pill | ➖ Deferred | No current CV exists yet. The section is **omitted**, not stubbed — see below. |
| Cartoon avatar, peeking portrait | ❌ Not used | No portrait exists (`content-gaps.md` §2), and the illustration is his. |
| "Notable Clients" logo wall | ❌ Substituted | No client has given permission to be named, and inventing logos would be a fabrication. A marquee of tools actually used does the same structural job truthfully. |
| Media gallery grid | ✅ Adopted | The homepage work gallery, with captions pinned open on touch. |

### The pixel face — a reversed decision

An earlier revision of this document rejected the pixel display face, reasoning that it
"undercuts *engineer you can trust with production systems*". That judgement was overruled by
Mohammed, who supplied the `pixel-portfolio-style` system and asked for the pixel direction
explicitly.

It was the right call, and the reasoning that made it safe is one the original rejection missed:
**Handjet ships Arabic as well as Latin.** A pixel face with no Arabic would have split the site
into two display voices. With Handjet the pixel identity survives the locale switch intact,
which turns the riskiest part of the direction into its strongest.

### Resume — omitted rather than stubbed

Dilan's nav has a Resume item. Ours does not, because there is no current CV to link. Shipping
an empty section, a dead link or a "coming soon" would be exactly the weakness this portfolio is
built to avoid. Mohammed is supplying a single current CV as PDF; the section lands when the
file does, not before.

## Weaknesses not inherited

| Weakness | Response |
|---|---|
| Incomplete "Coming soon" case studies | Enforced at **build time**: a featured project with fewer than six chapters fails the build. Unit and e2e tests both assert no placeholder copy exists anywhere. |
| Thin case-study depth | Sendy has 7 chapters, IMMAR and NANO 6 each, with architecture diagrams, role matrices and trade-off cards. |
| Monolingual | Full English/Arabic with independently art-directed Arabic typography and RTL parity. |
| Heavy scroll-reveal with no fallback | Reveals have a no-JS fallback and a designed reduced-motion mode, both tested. |
| Accent blue that fails AA as text | Split into `--accent` / `--accent-bright` by function. Asserted by an e2e contrast test. |

## What is original here

- **Bilingual as a first-class material** — a pixel identity that survives RTL, with Arabic
  never tracked, never uppercased, and given its own leading throughout.
- **The fan's load choreography** — stacked arrival spreading outward in pairs, and a
  reduced-motion composition that is complete and linked rather than merely still.
- **Coded product compositions** — an honest answer to "no screenshots exist yet", captioned as
  concepts everywhere they appear.
- **Honesty enforced as code** — the build fails on a thin featured case study; tests fail on
  fabricated metrics or unverifiable ranking claims.
- **The accessibility floor beating the reference** — five measured deviations from the sampled
  token table, each documented inline in `globals.css`.

## Comparison matrix

Dilan's column is based on **observation**. Self-assessment for this site.

| Dimension | Dilan (observed) | This site | Evidence |
|---|---|---|---|
| First-screen impact | Very strong | Strong | Centred pixel lockup + seven-card fan inside 900px |
| Immediate product visibility | Very strong (real screenshots) | Moderate | Coded compositions until real screenshots land |
| Signature interaction | Static fanned arc | Choreographed fan | Stacked arrival, paired spread, idle float, responsive card count |
| Case-study depth | Weak (Coming soon) | Strong | 7/6/6 chapters, enforced at build |
| Project differentiation | Moderate | Strong | Seven distinct card faces, one accent each |
| Bilingual quality | None | Strong | Full EN/AR, pixel face in both scripts |
| Accessibility | Fails AA on its accent | Strong | 0 serious axe violations across 12 route/locale pairs; contrast asserted in e2e |
| Technical credibility | Moderate | Strong | Real architecture diagrams and trade-off cards |
| Personality / warmth | Very strong | Moderate | Dilan's photo and jokes carry his; ours is more reserved |
| Honesty | Good | Enforced | Build and tests fail on fabricated claims |

**Where Dilan still wins:** real product screenshots, and a human face. Both are content gaps
on Mohammed's side, not design decisions — see `content-gaps.md` §1 and §2. Supplying those two
things would close most of the remaining distance.
