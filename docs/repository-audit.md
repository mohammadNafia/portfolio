# Repository audit

Performed before any code was written.

## Starting state

`c:\Users\Administrator\Desktop\PORTFULIE` contained exactly one file:
`CLAUDE_PORTFOLIO_REDFOLIO_PROMPT.md`. No package manager, no lockfile, no source, no assets.

**There was no existing stack to preserve or improve** — the "reuse a viable foundation" rule
did not apply, so the implementation stack from the brief was used.

## Git state — handled with care

`git rev-parse --show-toplevel` returns `C:/Users/Administrator`: **the entire user home
directory is a git repository**, and `git status` showed a large number of unrelated deleted
and modified files across other Desktop projects.

Consequences, all observed:

- No `git add`, `commit`, `push`, `reset`, `checkout`, `clean` or `stash` was run. The only git
  commands executed were the read-only `git status`, `git branch --show-current` and
  `git rev-parse`.
- A project-scoped `.gitignore` was added inside `PORTFULIE/` so `node_modules/`, `.next/`,
  screenshots and env files cannot pollute the parent repository's status.
- `outputFileTracingRoot` is pinned to this project in `next.config.ts`, because Next.js
  otherwise inferred the home directory as the workspace root (it found
  `C:\Users\Administrator\package-lock.json`).

## Toolchain

Node v24.11.0 · npm 10.9.6 · pnpm 8.15.5 available · git 2.54.0.

npm was chosen: no lockfile existed to indicate a preference, and npm is the default for the
Next.js toolchain.

## Scaffolding obstacle

`npx create-next-app@latest .` **failed**:

```
Could not create a project called "PORTFULIE" because of npm naming restrictions:
  * name can no longer contain capital letters
```

The directory name is fixed by the user. Rather than rename their folder, the project was
scaffolded manually: `package.json` declares `"name": "mohammed-nafia-portfolio"`, and
`tsconfig.json`, `next.config.ts`, `postcss.config.mjs`, `eslint.config.mjs` and
`globals.css` were authored directly. This also gave exact control over dependency versions.

## Stack chosen

| Layer | Choice | Version |
|---|---|---|
| Framework | Next.js App Router | 15.5 |
| Language | TypeScript, `strict` + `noUncheckedIndexedAccess` | 5.9 |
| Styling | Tailwind CSS v4 with a tokenised theme | 4.1 |
| Motion | ~~`motion`~~ — removed; CSS only | — |
| Validation | Zod | 3.25 |
| E2E | Playwright + `@axe-core/playwright` | 1.55 / 4.10 |
| Unit | Vitest | 3.2 |
| i18n | Typed local dictionaries (no package) | — |

Deliberately **not** installed: Lenis (native scrolling is not hijacked), React Three Fiber (a
CSS transform is sufficient for the hero fan and far cheaper on mobile), any i18n package (see
`design-system.md` for the rationale), any UI component library.

**Motion was removed** during the `pixel-portfolio-style` restyle. There is now no JavaScript
animation library at all — motion is CSS custom properties plus one IntersectionObserver, which
cut First Load JS by about 30%.

## Content and asset inventory

No assets existed in `PORTFULIE/`. Source material was located across the Desktop and is
catalogued in `content-inventory.md`. The critical finding: **no production screenshots of any
project exist anywhere**, which drove the coded-composition media strategy.

## Technical risks identified up front

| Risk | Mitigation |
|---|---|
| Parent git repo is dirty with unrelated work | Read-only git usage; scoped `.gitignore` |
| No product screenshots | Coded compositions, captioned honestly; gaps documented |
| Long unattended run, dependency drift | No i18n/UI library; pinned major versions; build-time content validation |
| Google Fonts fetch could fail at build | It succeeded; if it had not, the fallback was a system stack |
| Arabic RTL across dense layouts | Logical properties throughout; RTL tested at all six viewports |
| Tailwind v4 is new and its cascade-layer behaviour is unforgiving | Caught two real bugs (see `EXECUTION-STATE.md`); documented in `design-system.md` |

## Baseline checks

None could be run before implementation — there was no code. Every check reported in
`verification-report.md` therefore reflects code written during this session; there are no
pre-existing failures to distinguish from introduced ones.

## Accessibility, localisation, performance, SEO gaps at start

All of them: nothing existed. Each is addressed in `verification-report.md`.
