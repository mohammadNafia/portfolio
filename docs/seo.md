# SEO

Audited and partly implemented 2026-08-15 against the live production domain.

The keyword map in §1 is **proposed, not implemented**. No page copy, title tag or
meta description has been rewritten. Everything in §2–§4 is structural and is
already in the working tree.

---

## 1. Keyword map — proposed, awaiting approval

### 1.1 The honest starting position

| Fact | Consequence |
| --- | --- |
| Domain first deployed August 2026 | No history, no trust. Nothing ranks for months except the name. |
| Zero external backlinks | Caps everything competitive. This is the binding constraint, not the copy. |
| 14 indexable pages per locale, no articles | Nothing to rank for a topic — only for entities (a person, four products). |
| Not in Google Search Console yet | Indexing is unmonitored and unaccelerated. |

None of the fixes in §2 change these. They remove ceilings; they do not create
demand. Ranking follows links and time, and neither is a code change.

### 1.2 English

Search intent that plausibly reaches this site splits three ways: someone
looking up **the person**, someone shopping for **a supplier**, and a developer
searching **a technical problem**. Only the first and third are winnable soon.

#### Winnable in 3–6 months

| Term | Target page | Why it is winnable |
| --- | --- | --- |
| `Mohammed Nafia` | `/en` | Exact-match domain, no competing public figure of the same name. |
| `Mohammed Nafia developer` / `engineer` / `Baghdad` | `/en`, `/en/about` | Same, more specific. |
| `Mohammed Nafia Nadhim` | `/en/about` | Full legal name, almost no competition. |
| `IMMAR education platform` | `/en/work/immar` | Named product, near-zero competition. |
| `NANO OCR ITS Hackathon` | `/en/work/nano-ocr` | Named event + product. Very low volume, essentially uncontested. |
| `Al-Tafawuq school management system` | `/en/work/al-tafawuq` | Named product. |
| `Arabic RTL Next.js implementation` | needs an article | Genuinely thin SERP. See gap A. |
| `bilingual Arabic English web application developer` | `/en/services` | Low volume, low competition, exactly what he does. |
| `multi-tenant SaaS developer Iraq` | `/en/services`, `/en/work/sendy` | Low volume, almost no supply. |
| `ASP.NET Core developer Baghdad` | `/en/services` | Low volume, low supply. |

#### Contested — flag before targeting

`Sendy` is an established Kenyan logistics company with far more authority.
Ranking for the bare word is not happening. Target `Sendy Iraq`,
`Sendy merchant platform` or `Sendy commerce logistics Baghdad` instead, and
expect the case study to rank for the qualified phrase only.

#### Aspirational — 12 months minimum, and only with links

`web development Iraq`, `software company Baghdad`, `freelance web developer`,
`hire React developer`, `SaaS development company`, `AI automation consultant`.

These are agency and marketplace territory. Competitors are 5–20-year-old
domains with hundreds of referring domains. Copy changes move nothing here.
Listed so the plan is explicit about *not* spending effort on them.

### 1.3 Arabic — and why it is not a translation of the English list

Three findings that change the strategy, all checked against live Iraqi SERPs:

**a. Arabic commercial search is agency-dominated, and the searcher is looking
for a company, not a person.** The first page for
`تصميم مواقع بغداد` and `شركة برمجة العراق` is entirely firms —
[إبداع البغدادية](https://albaghdadiyait.iq/) (founded 2002),
[أورنت](https://www.orinetiq.com/), [بغداد هوست](https://www.baghdad-host.com/),
[أرابخا](https://arabkha.com/), [ويب العراق](https://webiq1.com/),
[أسس تكنولوجي](https://www.osoustech.com/). A one-person portfolio does not
displace these, and the query intent is a mismatch anyway: someone typing
`شركة` wants a company.

**b. The vertical-product terms are owned by regional SaaS vendors, not local
freelancers.** `نظام إدارة مدارس` returns [دفترة](https://www.daftra.com/),
[Zoho](https://www.zoho.com/ar/creator/apps/school-management-system-software.html),
[سكوليرا](https://skolera.com/) and
[الخبير](https://khsites.com/). Same for
`تصميم متجر الكتروني` — [إبداع البغدادية](https://albaghdadiyait.iq/) and
[لبيب](https://iq.labeb.com/) hold it. These are product companies buying the term.

**c. A large share of Iraqi SMB supplier discovery happens on Facebook and
Instagram, not Google.** This is the single biggest reason not to over-invest in
Arabic organic. The Arabic pages' realistic job is **credibility and conversion
for people who arrive from a referral, a WhatsApp link or a social profile** —
not organic acquisition. That inverts the naive assumption that a bilingual
Iraqi site should bet on Arabic search.

#### Iraqi register vs Modern Standard Arabic — what people actually type

Iraqi *dialect* barely appears in commercial search queries. Nobody types
`شلون` or `اشلون` when shopping for software; dialect lives in speech and
social. What differs is **register**, not dialect:

| People type | Not | Note |
| --- | --- | --- |
| `برمجة` | `تطوير` | `تطوير` is corporate/CV register. `برمجة` is what a buyer types. |
| `مبرمج` | `مهندس برمجيات` | `مهندس برمجيات` is a job title on a CV, not a hiring query. |
| `موقع الكتروني` | `موقع إلكتروني` | Hamza routinely dropped in typing. Google normalises it, but write it the way it is read. |
| `نظام` + noun | `منصة` | `نظام مبيعات`, `نظام إدارة`, `نظام حسابات`. `منصة` is marketing language. |
| `تطبيق` | `تطبيقة` | For mobile. `برنامج` for a desktop or back-office system. |
| `كاشير`, `برنامج محاسبة`, `مندوب توصيل` | — | Loanwords and local nouns that genuinely get typed in Iraq. |

**The site's current Arabic is high-register MSA** — `مهندس برمجيات متكامل ومؤسس منتجات`.
That is well written and correct for an about page. It does not match the
language of a commercial query, and no amount of it will capture one.

#### Winnable in 3–6 months (Arabic)

| Term | Target page |
| --- | --- |
| `محمد نافع` + `مبرمج` / `مهندس برمجيات` | `/ar`, `/ar/about` |
| `محمد نافع ساندي` | `/ar/work/sendy` |
| `إعمار منصة تعليمية` | `/ar/work/immar` |
| `برمجة نظام متعدد المستأجرين` | `/ar/services` — very low volume |
| `تنفيذ واجهات عربية RTL` | needs an article |
| `استخراج نص من صورة بالعربية` | `/ar/work/nano-ocr` — genuinely thin SERP |

#### Not winnable

`تصميم مواقع`, `تصميم موقع الكتروني العراق`, `شركة برمجة في بغداد`,
`برمجة تطبيقات بغداد`, `نظام إدارة مدارس`, `تصميم متجر الكتروني`.

### 1.4 Long-tail the case studies already answer

These need no new pages — the content exists and answers a real question. They
need the title tag and opening paragraph to match how the question is asked.

| Case study | Question it already answers |
| --- | --- |
| Sendy | How do you keep tenants isolated in a multi-tenant commerce platform? How do you integrate delivery companies that fail? How do you build a dense RTL dashboard? |
| IMMAR | How do you split a student mobile app and an operations dashboard over one permission model? |
| NANO | How do you make OCR output verifiable by a non-technical user? |
| Al-Tafawuq | How do you structure a school system across a .NET API and a Next.js dashboard? |
| Virtual Banking API | How do idempotency keys, fund reservation and multi-step KYC fit together? |
| Invoice Mini App | How do you build a mini app inside a host fintech platform (SuperQi)? |

### 1.5 Content gaps — things that are missing, not things to invent

**A. There are no articles at all.** The developer-problem lane in §1.2 is the
most winnable non-brand English space, and it is entirely unaddressed. Three
articles drawn from work already done would cover it. Nothing here needs
inventing — it is all documented in the case studies:

1. RTL/LTR parity as a structural decision (from Sendy and IMMAR).
2. Making AI output verifiable rather than more accurate (from NANO).
3. Multi-tenancy without leaks (from Sendy).

**B. `/services` is one URL carrying seven services.** Each service targets a
different query and they compete with each other for one page's signal. Seven
service pages, each linking to the case study that proves it, is the single
highest-value structural change left. The copy for all seven already exists in
the dictionaries.

**C. No Arabic content written in query register.** Covered above. A decision,
not an oversight — worth making deliberately.

**D. Name transliteration is inconsistent across properties.** The site says
`Mohammed Nafia`, GitHub is `mohammadNafia`, email is `mohammadnafia1`. Search
engines consolidate an entity from matching signals; three spellings split it.
Pick one and align the profiles.

---

## 2. What changed

All verified against a production build (`npm run build`, `NEXT_PUBLIC_SITE_URL=https://mohammednafia.com`).

### 2.1 Missing `h1` on five of seven route types

`SecHead` — the component every page opens with — always emitted `<h2>`.
`/work`, `/services`, `/about`, `/contact` and `/privacy` therefore shipped
**no `h1` at all**, in both locales. Ten URLs, each with its strongest on-page
heading signal absent and an outline starting at level two.

`SecHead` now takes `as`, defaulting to `h2`; exactly one caller per page passes
`as="h1"`. The service cards moved `h3`→`h2` and their sub-labels `h4`→`h3` so
the page does not skip a level under the new `h1`.

| | Before | After |
| --- | --- | --- |
| URLs with exactly one `h1` | 18 / 28 | 28 / 28 |
| URLs with a skipped heading level | 12 | 0 |

The `h1` *text* is unchanged and is still weak — `WORK`, `Services`,
`Background`. Improving it is a copy change and is held for approval.

### 2.2 Every non-home page shared the homepage's social card

Next.js replaces the parent `openGraph` object rather than merging into it, but
only when the child declares one. Only home and the case studies did. The other
six routes inherited the site-wide card, so `/en/about`, `/ar/services` and ten
other URLs each advertised **`og:url` of `https://mohammednafia.com/en`** with
the homepage's title.

All routes now go through `pageMetadata()` in `src/lib/metadata.ts`.

| | Before | After |
| --- | --- | --- |
| URLs where `og:url` ≠ canonical | 12 | 0 |
| URLs with a locale-correct `og:locale` | 16 | 28 |

### 2.3 hreflang — the HTML and the sitemap disagreed

This is the one the brief called out, and it was subtly wrong in exactly the way
predicted. The `<head>` declared three alternates (`en`, `ar`, `x-default`); the
sitemap declared two, omitting `x-default` entirely. Google treats a hreflang
cluster as invalid when its members do not describe the same set, and drops it —
on a bilingual site that means the AR pages stop being recognised as alternates
and start competing with the EN ones.

The reciprocity itself was already correct, and canonicals were already clean:
**no canonical anywhere points at workers.dev**, confirmed on all 28 URLs.

| | Before | After |
| --- | --- | --- |
| Sitemap URLs carrying `x-default` | 0 / 28 | 28 / 28 |
| HTML/sitemap alternate sets agreeing | no | yes |
| Hand-written `languages` literals (drift risk) | 6 copies | 0 — derived from one `path` |

`x-default` points at the English URL rather than `/`. `/` is a locale-detecting
307 whose destination varies by request header; an hreflang annotation should
not target a redirect with an unstable destination.

### 2.4 Sitemap `lastmod` was a hardcoded constant

All 28 URLs declared `2026-08-14`, written into the source by hand. A sitemap
that claims every page changed on the same day gets its `lastmod` ignored
wholesale.

`scripts/content-lastmod.mjs` now resolves real dates from git at build time and
writes `src/content/lastmod.generated.json`. Per-route attribution uses
`git log -L` on the route's own key block inside the dictionaries, so a copy edit
to `services` does not reset the date on all 28 URLs. Runs from `prebuild` and
explicitly from `scripts/deploy.mjs` (which invokes `opennextjs-cloudflare`
directly, where npm lifecycle hooks never fire).

Priorities were also flattened at 0.7 for everything below `/work`. `/services`
is now 0.9 and `/privacy` 0.2.

| | Before | After |
| --- | --- | --- |
| Distinct `lastmod` values | 1 (hardcoded) | 3 (from git) |
| `/privacy` priority | 0.7 — equal to `/services` | 0.2 |

### 2.5 Structured data

Only `Person` and a thin `CreativeWork` existed. No site-level entity, nothing
declaring page hierarchy, and `dateCreated` was fed `project.year` — a display
string holding values like `2025—2026`, which is not a parseable date.

Now emitted, as a linked `@graph` with stable `@id`s so every page references
one Person rather than declaring a new one:

- **Person** — plus `knowsAbout` (23 skills, each backed by a case study or the
  CV), `knowsLanguage` as Language objects, `address` + `homeLocation` +
  `workLocation`, `alumniOf` with address, `image`, `telephone`, and `award`
  (the three verifiable placements only).
- **WebSite** — `inLanguage: ['en','ar']`, publisher/author/copyrightHolder all
  pointing at the Person. **No `SearchAction`** — there is no site search, and
  declaring a searchbox that resolves to nothing is a false claim.
- **BreadcrumbList** — on all 24 sub-pages, both locales.
- **CreativeWork** per case study, with the product as a nested
  **SoftwareApplication** (`applicationCategory`, `operatingSystem`,
  `softwareRequirements` from the real stack). `copyrightYear` as a Number
  replaces the unparseable `dateCreated`; `dateModified` comes from git.

| | Before | After |
| --- | --- | --- |
| Schema types per case study | 2 | 4 |
| Schema types per content page | 1 | 3 |
| Unparseable date values | 8 | 0 |

**Validation.** The [Schema Markup Validator](https://validator.schema.org)
reports **0 errors and 0 warnings** on `/en`, `/en/services`, `/en/work/sendy`
and `/ar/work/immar`.

Google's Rich Results Test **has not been run**, and cannot be: it fetches the
live URL, and these changes are not deployed. Run it after deploy — §4, item 3.

**Expect exactly one rich result: Breadcrumbs.** No other type is attainable
honestly. Article requires a publisher and publication date; Software App
requires `offers` or `aggregateRating`; Review requires reviews. Every one of
those would have to be invented. The markup is valid and complete — it simply
will not produce a rich snippet, and any claim otherwise would be wrong.

### 2.6 Internal linking

Every project carried a `services` array in its content that **nothing
rendered**. A visitor could read a detailed write-up of exactly the work they
wanted to buy and find no path to the page that sells it — only prev/next and
the footer.

Case studies now render their services as links to `/services`, plus a
back-to-index link.

| | Before | After |
| --- | --- | --- |
| Case study → `/services` links | 0 | 2–5 per study |
| Case study → `/work` links | 0 | 1 |

### 2.7 The workers.dev duplicate

`wrangler.jsonc` deliberately keeps `workers_dev: true` on production, so the
whole site is also live at `portfolio-production.…workers.dev`, serving a
crawlable `robots.txt`. A canonical tag is a hint, not a directive.

Middleware now sets `X-Robots-Tag: noindex, nofollow` on any host that is not
`NEXT_PUBLIC_SITE_URL`. The apex is unaffected; the fallback URL stays usable.

Middleware also now appends `Vary: accept-language, cookie` to locale responses
and the root redirect. Locale is chosen per request from a cookie and
`Accept-Language`, and without `Vary` a shared cache can serve an Arabic
document to an English visitor — or hand a crawler whichever copy was cached
first.

---

## 3. Measured, not assumed

### 3.1 Core Web Vitals — mobile, live domain

Lab measurement via Playwright against `https://mohammednafia.com`: Pixel-7
viewport (412×915, DPR 2.625), Slow-4G throttling (1.6 Mbps down, 150 ms RTT),
4× CPU slowdown. Median of 3 runs, with scroll to full depth and real tap
interactions to generate INP samples.

| Metric | `/en` | `/ar` | Threshold | Verdict |
| --- | --- | --- | --- | --- |
| LCP | **2196 ms** | 2240 ms | < 2500 ms | Good, with little headroom |
| CLS | **0.0025** | 0.0046 | < 0.1 | Excellent |
| INP (worst event) | **128 ms** | 168 ms | < 200 ms | Good |
| TTFB | 304 ms | 280 ms | < 800 ms | Good |
| FCP | 1256 ms | 1084 ms | < 1800 ms | Good |

LCP element on `/en` is `IMG.hero-fan__img`, already preloaded with a correct
`imageSrcSet`. Transfer is 226 KB over 37 requests (152 KB JS, 46 KB CSS,
52 KB images).

**Nothing here needs fixing.** CLS and INP have wide margins. LCP is inside the
threshold but not by much on a slow connection — worth re-measuring after any
change to the hero, not worth optimising now.

**There is no field data.** CrUX has no dataset for this origin — insufficient
real-user traffic. The numbers above are lab, and lab and field diverge. Real
CWV becomes visible in Search Console once traffic exists.

### 3.2 Crawlability

Verified against the live domain:

| Check | Result |
| --- | --- |
| `/en/does-not-exist` | 404, correct status (not a soft 404) |
| `/nope` (no locale) | 307 → `/en/nope` → 404. One hop. |
| `/fr/work` (bad locale) | 307 → `/en/fr/work` → 404. Correct. |
| `/en/work/` (trailing slash) | 307 → `/en/work`. One hop. |
| Redirect chains | None longer than one hop anywhere. |
| `robots.txt` | Valid, sitemap declared, only `/api/` disallowed. Correct. |
| Canonicals on workers.dev | None. All 28 point at the apex. |
| Images missing `alt` | 0. Every `<img>` on every route, both locales, has descriptive non-empty alt. |

**Image alt text needs no work.** Six images on the homepage, one elsewhere;
everything else is inline SVG correctly marked `aria-hidden`. Per-image
descriptions live with the artwork in `src/content/fan-art.ts`. Nothing is
keyword-stuffed and nothing is missing.

### 3.3 Availability

One transient failure in 12 paced requests across four URLs; the other 11
returned 200 in 110–309 ms. An earlier unpaced burst produced many timeouts,
but one URL was 6/6 clean in the same window, which points at client-side
connection limits rather than the origin. **Not treated as a defect.** Watch
Search Console → Settings → Crawl stats once verified; if Googlebot reports
5xx or timeouts there, it is real.

---

## 4. What you have to do yourself — in priority order

Everything above is code. None of it earns a link, and links are the binding
constraint. This list matters more than §2 does.

### 1. Google Search Console — do this first, today

Nothing else can be measured until this exists.

1. `search.google.com/search-console` → add property → **Domain** property
   (`mohammednafia.com`, not the URL prefix — a domain property covers http,
   https and any subdomain).
2. Verify by DNS TXT record in the Cloudflare dashboard.
3. Submit `https://mohammednafia.com/sitemap.xml`.
4. Use **URL Inspection → Request indexing** on `/en`, `/ar`, `/en/services`,
   `/ar/services` and the three featured case studies. Do not request all 28 —
   the quota is limited and the sitemap covers the rest.
5. Set the international targeting only if it offers it; do not set a country
   target. The site serves clients outside Iraq too.

### 2. Fix HTTP → HTTPS. This is a live defect

`http://mohammednafia.com/en` currently returns **200 over plain HTTP**, with no
redirect to HTTPS and no HSTS header. That is an indexable duplicate of every
page on an insecure scheme, and a security problem independent of SEO.

In the Cloudflare dashboard for the zone:
- **SSL/TLS → Edge Certificates → Always Use HTTPS: on**
- **SSL/TLS → Edge Certificates → HSTS: enable**, max-age 6 months to start.
  Read the warning first — HSTS is hard to undo.

This is dashboard configuration, not repository configuration, which is why it
is here rather than in §2.

### 3. Run the Rich Results Test after deploying

`search.google.com/test/rich-results` on `/en`, `/ar`, `/en/work/sendy` and
`/ar/work/sendy`. Expect **Breadcrumbs, valid** and nothing else — see §2.5. If
it reports anything for Person or WebSite, that is informational, not a failure.

### 4. Bing Webmaster Tools

`bing.com/webmasters` — import directly from Search Console once §1 is done.
Bing also feeds DuckDuckGo and, increasingly, ChatGPT's browsing results, which
is not a negligible share of how people find a developer now.

### 5. Align the profiles — the highest-value hour you will spend

Three transliterations of the same name currently split the entity. Pick
`Mohammed Nafia` and make every property agree.

- **LinkedIn**: headline should carry the terms from §1.2, not just a job title.
  Add `mohammednafia.com` to Contact Info **and** to the Featured section — the
  Featured link is followed by more crawlers. Add Sendy, IMMAR and NANO as
  Projects with links to the case studies.
- **GitHub**: set the profile website to `mohammednafia.com`. Write a profile
  README. Pin repositories that correspond to the case studies. `mohammadNafia`
  as a handle is fine to keep — the *display name* is what should change.
- Same display name and same link on every other profile you hold.

### 6. Google Business Profile — read this before doing it

The brief asked for this and it needs a caveat rather than a checkbox.

GBP requires a verified **business** presence, and service-area businesses in
Iraq have inconsistent verification support. Video verification is often the
only route and it is frequently rejected for a sole trader working from home. A
rejected or suspended profile is worse than no profile.

**Recommendation: attempt it, but do not build the plan on it.** If verification
succeeds, it is a strong local signal for the Arabic terms in §1.3 that are
otherwise unreachable. If it fails after two attempts, drop it and move on —
this is not the bottleneck.

Do **not** publish a home address publicly. Set it as a service-area business
covering Baghdad.

### 7. Directories that actually matter for Iraq

In order of value:

1. **[مستقل](https://mostaql.com)** — the dominant Arabic freelance marketplace,
   real traffic from Iraq and the Gulf. Complete profile, link the site.
2. **[خمسات](https://khamsat.com)** — same operator, smaller engagements, still
   a real referral source and a followed link.
3. **[Upwork](https://upwork.com)** — for the English/international lane in
   §1.2. A portfolio link there converts even when it does not rank.
4. **Facebook business page** — per §1.3(c), this is where Iraqi SMB discovery
   actually happens. Not a link that helps ranking, but plausibly a larger
   direct source of Arabic-speaking clients than Google organic will be in year
   one. Treat it as its own channel, not as SEO.
5. **[LinkedIn](https://linkedin.com)** — already covered in item 5.

Skip generic "web design directory" submissions. They are spam links now and
carry a real risk.

### 8. Set up DNS for `www`

`www.mohammednafia.com` does not resolve at all — NXDOMAIN. `wrangler.jsonc`
documents an intended Redirect Rule to the apex, but the DNS record backing it
does not exist. Anyone typing `www.` gets a browser error.

Add a proxied CNAME `www` → `mohammednafia.com` in Cloudflare DNS, then a
Redirect Rule (`www.mohammednafia.com/*` → `https://mohammednafia.com/$1`, 301).
Low SEO impact, real usability impact.

### 9. Earn three links, deliberately, over three months

This is the whole game and there is no shortcut. Realistic sources:

- A write-up of the ITS Hackathon win that links to `/en/work/nano-ocr`.
  Organisers publish these; ask.
- Al-Nahrain University or Iraq TechSchool alumni/graduate pages.
- A guest article for an Iraqi or regional tech publication drawn from gap A.

Three genuine editorial links beat three hundred directory submissions.

---

## 5. Honest expectations

| Horizon | What actually happens |
| --- | --- |
| Weeks 1–2 | Indexing only, and only after Search Console is set up. No rankings. |
| Weeks 3–8 | `Mohammed Nafia` and `محمد نافع` + qualifier reach position 1–3. Named products (`IMMAR`, `NANO OCR ITS`, `Al-Tafawuq`) start ranking. Traffic in single digits per day. |
| Months 3–6 | Five-plus-word technical long-tail lands **if** the articles in gap A exist. Without them, this window produces almost nothing new. Perhaps 20–60 visits/month. |
| Months 6–12 | Mid-tail (`bilingual Arabic English developer`, `multi-tenant SaaS developer Iraq`) becomes reachable **with** the service pages from gap B and two or three real links. Still low volume — these terms have tens of searches per month, not thousands. |
| Beyond 12 months | Competitive commercial terms in either language. Only with sustained content and links, and honestly they may never come. |

**The uncomfortable part.** The terms that would bring volume are not winnable,
and the terms that are winnable have little volume. That is the real shape of
this market for one person, and no amount of on-page work changes it.

What SEO can realistically do here: make sure that when somebody hears the name,
gets a referral, or searches a very specific technical problem this site has
already solved, they find it and it looks credible. That is worth doing, and
it is now largely done.

What will bring more work than SEO, in this specific market: the LinkedIn
profile in item 5, the مستقل profile in item 7, the Facebook channel in item 7,
and referrals. The brief asked for a real plan rather than an optimistic one —
this is it.
