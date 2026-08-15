# Content gaps

Exactly what Mohammed needs to supply, why it matters, and where it goes. Everything here is
currently handled by an honest, clearly-labelled stand-in — nothing is faked and no layout is
left unfinished.

Ordered by impact.

---

## 1. Product screenshots — highest impact

**Current state:** every product surface is a *coded interface composition* built in
`src/components/home/FanCardArt.tsx` from each platform's real module names. Each one
is captioned "Interface concept — … not a captured screenshot" wherever it appears, and the
case-study hero carries a standing notice explaining why.

**Why it matters:** this is the single biggest lever on perceived credibility. Real product
screens are what convince a client that the thing exists.

**What to supply**

| Project | Screens needed | Aspect ratio | Notes |
|---|---|---|---|
| Sendy | Order workspace / list with statuses | 16:10 | The flagship image. Real data may be blurred or replaced with realistic sample records. |
| Sendy | Storefront (customer-facing) | 16:10 | Shows the contrast with the operational dashboard. |
| Sendy | Inventory or warehouse reconciliation | 16:10 | |
| Sendy | Driver application | 9:19.5 | Phone screenshot. |
| IMMAR | Teacher/admin dashboard — assessments or attendance | 16:10 | Must **not** show a student account using the dashboard. |
| IMMAR | Student mobile app — lesson or course view | 9:19.5 | |
| IMMAR | Roles & permissions screen | 16:10 | |
| NANO | Extraction result view (source + output) | 16:10 | If any hackathon capture survives. |

**Format:** PNG or WebP, at least 2560px wide for desktop shots, 2× device pixel ratio.
**Where they go:** `public/media/<project>/`, then swap the `showcase` block `id` in the
project file for an image reference.

The homepage **hero fan** is the highest-value place for these. Its seven cards currently
carry abstract per-project art (`FanCardArt` in `src/components/home/FanCardArt.tsx`);
dropping real screenshots into those cards is the single biggest visual upgrade available,
because the fan is the first thing anyone sees — and it is the one place this portfolio is
measurably behind the reference (`reference-analysis.md`).

**Redaction:** replace real merchant names, phone numbers, addresses and order values with
plausible sample data before sharing. Do not blur so heavily that the UI becomes unreadable —
an unreadable screenshot is worse than the current composition.

---

## 2. Professional portrait

**Current state:** the **nav-pill avatar** uses the pixel monogram. That is the only place a
portrait would go today — the restyle removed the About page's framed 4:5 panel and the
homepage `AboutPreview` panel, and both pages read fine without them. No portrait is generated
or implied anywhere.

The reference site puts a real photograph in the pill and a cropped portrait peeking over the
hero's sawtooth. The pill avatar is the cheaper and higher-return of the two.

**Why it matters:** a real face adds warmth and trust. The prompt is explicit that a fake or
AI-generated portrait must never be presented as real, so none was created.

**What to supply:** one portrait, 4:5 portrait crop, at least 1600×2000, natural light,
uncluttered background, looking at or slightly away from camera. Dark or neutral clothing
suits the site's palette.
**Where it goes:** `public/media/portrait.jpg`, then swap the `<Monogram>` in the nav pill
(`src/components/layout/SiteHeader.tsx`) for a `next/image` square crop. Adding it to the hero
as a sawtooth-cropped portrait is a separate, larger piece of art direction.

---

## 3. A single canonical CV

**Current state:** **no CV link exists anywhere on the site.** `Desktop/cv/` holds seven PDF
variants targeted at different roles, and none is identifiable as current. The prompt requires
a CV button only if a real current CV exists, so the button was omitted rather than pointed at
a guess.

**What to supply:** one PDF, confirmed current.
**Where it goes:** `public/mohammed-nafia-cv.pdf`, then add a link in the About page contact
block and the footer.

---

## 4. The client platform named only descriptively

**Current state:** `cv_data.py` describes "a client's digital page and educational platform"
without naming it. The original brief referred to "Waqar's platform", but **no source in the
repository confirms that name, its scope, or its outcome**, so it is not on the site at all.

**What to supply:** the product's real name, what it does, Mohammed's role, its status, and
whether it may be named publicly at all (it may be under NDA).
**Where it goes:** a new entry in `src/content/projects/archive.ts` following the existing
shape. It needs at least 3 chapters to pass build validation.

---

## 5. Live or public links

**Current state:** every project has an empty `links: []`. No project card or case study offers
an external link, because no verified public URL exists for any of them.

**What to supply:** for each project, either a public URL (marketing site, app store listing,
public repository) or explicit confirmation that it is private. Private is a perfectly good
answer — the case studies already label these as private client and commercial platforms.

---

## 6. Production domain

**Current state:** `src/lib/site.ts` uses `https://mohammednafia.com` as a placeholder, and
`NEXT_PUBLIC_SITE_URL` overrides it. This value feeds canonical URLs, `sitemap.xml`,
`robots.txt`, Open Graph URLs and the `Person` structured data.

**What to supply:** the real domain, set as `NEXT_PUBLIC_SITE_URL` in the deployment
environment. **Must be set before launch** or search engines will index canonical URLs
pointing at a domain Mohammed may not own.

---

## 7. Contact form delivery provider

**Current state:** the API route is fully implemented and tested. With no `RESEND_API_KEY`
configured it returns `unavailable`, and the form tells the visitor plainly that the message
was **not** delivered and shows the direct email address instead.

**What to supply:** a Resend API key (or a swap to another provider in
`src/app/api/contact/route.ts`), set as `RESEND_API_KEY`. Optionally `CONTACT_TO_EMAIL` and
`CONTACT_FROM_EMAIL`. See `.env.example`.

---

## 8. Availability statement accuracy

**Current state:** the contact page states "Available for select projects". The header badge was
removed with the restyle — the nav pill has no room for it and the system has no such component
— so the claim now appears **once**, on the page where someone is about to act on it.

**What to confirm:** that this is true at launch. It is the one claim on the site that changes
over time. It lives in `src/i18n/dictionaries/{en,ar}.ts` under `contact.availabilityText`
(`common.availableForWork` is still defined but no longer rendered).

---

## Not gaps — deliberate omissions

These are absent on purpose and need nothing:

- Metrics, user counts, revenue, uptime, model accuracy — none is documented anywhere.
- Testimonials and client logos — no client has given permission or provided a quote.
- Any "Iraq's #1 / best developer" claim — unverifiable, and explicitly excluded.
- Sendy's mascot and logo — Sendy's marks, not Mohammed's portfolio identity.
