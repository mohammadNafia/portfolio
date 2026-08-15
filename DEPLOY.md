# Deploying

The site runs on **Cloudflare Workers** via [`@opennextjs/cloudflare`](https://opennext.js.org/cloudflare).
There is no Vercel, no Node server, and no `output: "export"` — OpenNext needs a
full `.next` build and export mode breaks it.

| | branch | Worker | URL |
|---|---|---|---|
| **production** | `main` | `portfolio-production` | `portfolio-production.<subdomain>.workers.dev` |
| **staging** | `develop` | `portfolio-staging` | `portfolio-staging.<subdomain>.workers.dev` |

Everything lands on `develop` first. `main` takes pull requests only, gated on
the `verify` check in [`.github/workflows/e2e.yml`](.github/workflows/e2e.yml).

---

## Deploy

```bash
npm run deploy:staging      # develop -> portfolio-staging
npm run deploy:production   # main    -> portfolio-production
npm run deploy:check        # build staging + report size, upload nothing
```

These go through [`scripts/deploy.mjs`](scripts/deploy.mjs), which sets
`NEXT_PUBLIC_SITE_URL` for the target environment before running
`opennextjs-cloudflare deploy`. It refuses to run if the URL is missing,
malformed, trailing-slashed, or still the placeholder — see
[Environment variables](#environment-variables) for why that matters.

First-time setup on a new machine:

```bash
npx wrangler login
npx wrangler subdomain get     # then fill deploy.config.json, see below
```

### Before deploying, if images changed

`public/img/**` holds pre-rendered width variants, not just the base images.
Regenerate them from the source PNGs in `docs/pixel-portfolio-style/assets/img/`:

```bash
npm run images    # rewrites public/img/ and src/lib/image-variants.ts
```

Commit the result. CI fails the build if the committed variants are stale,
because the loader can only return a file that was actually written.

### Check the Worker size

```bash
npm run cf:build && npm run cf:size
```

Cloudflare caps a Worker at **3 MiB compressed** on the free plan, 10 MiB on
paid, and rejects the upload above it. Static assets are served from the asset
store and are *not* counted.

Last measured: **1.76 MiB gzip — 58.6% of the free ceiling**, 7.36 MiB raw.
`cf:size` exits non-zero if a build ever crosses the limit and warns from 80%.

### Preview locally on the real runtime

```bash
npm run cf:build
npx wrangler dev --env staging --local
```

This is workerd, not `next start` — worth using before any deploy that touches
server code, because Node APIs that work in `next dev` may not exist here.

> `wrangler dev` gets unstable under heavy parallel load. If you point the
> Playwright suite at it, run `npx playwright test --workers=1`; at the default
> 2 workers the dev server can die mid-run. This is a local-tooling limit, not
> a site defect — the same suite passes 108/108 serialized.

---

## Roll back

Cloudflare keeps prior versions of every Worker.

```bash
npx wrangler versions list --env production          # find the last good version ID
npx wrangler rollback <version-id> --env production
```

`wrangler rollback` with no version ID goes to the immediately previous one.
This is near-instant and does not need a rebuild — reach for it first, and fix
forward afterwards.

To roll back via git instead (slower, but keeps the branch honest):

```bash
git revert <bad-commit>
git push origin main    # via PR — main does not take direct pushes
```

---

## Environment variables

There are two kinds here, and the distinction matters — getting it wrong is
silent rather than loud.

### Build-time — baked into the bundle

| variable | environment | secret? | notes |
|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | both | no | Canonical URLs, `sitemap.xml`, `robots.txt`, `og:image`. |

Next.js inlines `NEXT_PUBLIC_*` at build time and the SEO tags are baked during
prerender, so **setting this as a Worker secret or var does nothing.** It has to
be present when `opennextjs-cloudflare build` runs.

Unset, it falls back to `https://mohammednafia.com` (see
[`src/lib/site.ts`](src/lib/site.ts)) — which means a staging deploy would
advertise production canonical URLs and an `og:image` on a domain that may not
resolve yet. Search engines and link scrapers would believe it.

Rather than rely on remembering an inline prefix, the value lives in
[`deploy.config.json`](deploy.config.json) and is applied by
`scripts/deploy.mjs`:

```json
{
  "staging":    { "siteUrl": "https://portfolio-staging.<subdomain>.workers.dev" },
  "production": { "siteUrl": "https://mohammednafia.com" }
}
```

`npm run deploy:staging` and `deploy:production` each build with their own
value. The script exits non-zero — before building — if the URL is absent,
unparseable, ends in a slash, or still contains the `WORKERS_SUBDOMAIN`
placeholder. `NEXT_PUBLIC_SITE_URL` in the environment overrides the file for
one-off builds.

Update `production.siteUrl` to the custom domain once DNS is pointed; until
then it should be the `.workers.dev` URL.

> These are public URLs, not secrets — which is why this file is committed
> while `wrangler.jsonc` still carries no `vars` block.

In the Cloudflare dashboard build settings, set `NEXT_PUBLIC_SITE_URL` as a
build environment variable per environment to match.

### Runtime — read by the Worker on each request

All three are read in [`src/app/api/contact/route.ts`](src/app/api/contact/route.ts).

| variable | environment | secret? | notes |
|---|---|---|---|
| `RESEND_API_KEY` | production (staging to test) | **yes** | Without it, `POST /api/contact` returns `503 unavailable`. |
| `CONTACT_TO_EMAIL` | both | no, but set as a secret | Inbox for inquiries. Defaults to the address in `src/lib/site.ts`. |
| `CONTACT_FROM_EMAIL` | both | no, but set as a secret | Must be a domain verified with Resend. |

Set them as secrets — **never** in `wrangler.jsonc`, which is committed and public.

`wrangler secret put` prompts for the value on stdin and sends it straight to
Cloudflare. **That prompt is the only place the key should ever be typed** — not
into a file, not into a commit, not into a chat window, and not as a shell
argument (which would land in shell history). The terminal does not echo it, and
`wrangler secret list` shows names only, never values.

```bash
npx wrangler secret put RESEND_API_KEY     --env production
npx wrangler secret put CONTACT_TO_EMAIL   --env production
npx wrangler secret put CONTACT_FROM_EMAIL --env production

npx wrangler secret list --env production   # verify, without revealing values
```

Repeat with `--env staging`. Secrets are per-Worker, so the two environments do
not share them.

For local runtime testing, put them in `.dev.vars` (git-ignored, same
`KEY=value` format as `.env`). `wrangler dev` does not read Worker secrets.

**The contact form fails honestly.** With no key configured it returns
`unavailable` and the UI tells the visitor the message was *not* delivered,
showing the direct email address instead. It never reports a fake success — so
an unset key degrades visibly rather than silently dropping inquiries.

---

## How images work here

There is no request-time image optimizer on Workers — `next/image`'s default
loader is the Vercel Image Optimization API, which does not exist.

Rather than `images.unoptimized` (which would ship the 840px source into a
210px slot), [`scripts/optimize-images.mjs`](scripts/optimize-images.mjs)
renders every width the site can request ahead of time, and
[`src/lib/image-loader.ts`](src/lib/image-loader.ts) resolves to them.

The width ladder in that script and the `imageSizes`/`deviceSizes` arrays in
[`next.config.ts`](next.config.ts) **must stay in sync** — the loader can only
return a file that exists, so a width listed in the config but missing from the
ladder resolves to a 404.

The one thing this gives up is AVIF: a single URL cannot vary on `Accept`, so
these are WebP for everyone. Widths are preserved exactly, which is where the
bytes were — measured at **34% smaller** than the 640px AVIF the Vercel
optimizer had been serving into 420px slots.

---

## Dashboard setup (one-time)

Workers & Pages → Create → Connect to Git → `mohammadNafia/portfolio`:

- **Production branch:** `main` → `portfolio-production`
- **Preview/staging branch:** `develop` → `portfolio-staging`
- **Build command:** `npx opennextjs-cloudflare build`
- **Deploy command:** `npx wrangler deploy --env production` (or `--env staging`)
- **Build env vars:** `NEXT_PUBLIC_SITE_URL` per environment (see above)

---

## Known: this directory is tracked by a second git repo

`C:\Users\Administrator\.git` is a repository rooted at the **home directory**.
It tracks 525 files — these 118, plus nine unrelated projects (Baghdad AI
Summit, FLOW-FRONT, BreastCancer, coursework, and others). Its remotes are
`nawa-ai-iq/nawa-frontend` and `sendy-its/sendy-frontend`.

This project's own repo was initialised later, so **every file here is tracked
twice**: once by `PORTFULIE/.git` (correct, pushed to `mohammadNafia/portfolio`)
and once by the home repo (incidental).

Nothing here depends on that, and it is deliberately left alone. But it is
worth knowing before it surprises someone:

- `git status` run from a parent directory reports on the *home* repo, and will
  list thousands of unrelated files.
- Committing from a parent directory commits to the home repo, not this one.
  Always confirm with `git rev-parse --show-toplevel` — it must print the
  PORTFULIE path.
- A `git push` from the home repo would publish nine other projects to whichever
  of its remotes is targeted.

Resolving it — untracking `Desktop/PORTFULIE` from the home repo, or retiring
that repo entirely — is a separate piece of work, to be done deliberately
rather than discovered mid-incident.

---

## Branch protection on `main` (one-time)

Settings → Branches → Add rule for `main`:

- Require a pull request before merging
- Require status checks to pass → **`verify`**
- Require branches to be up to date before merging
- Do not allow bypassing the above settings
- Block force pushes and deletions
