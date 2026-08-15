# Launch plan

A practical four-week sequence. **Nothing in this document has been executed.** No post has
been published, no submission made, no account touched, no payment authorised. Every item
needs Mohammed's explicit approval.

The narrative is confident and honest: *Engineered in Baghdad. Built for the real world.*
Not "Iraq's #1 portfolio" — let recognition come from the work.

---

## Week 0 — Pre-launch (blocking)

Do not publish until all of these are true.

### Content
- [ ] Set `NEXT_PUBLIC_SITE_URL` to the real domain. **Hard blocker** — canonical URLs,
      sitemap, robots and Open Graph all point at a placeholder until this is set.
- [ ] Replace product compositions with real screenshots, or consciously decide to launch with
      them (they are honest, just less persuasive). See `content-gaps.md` §1.
- [ ] Decide on a portrait, or launch with the monogram.
- [ ] Confirm one canonical CV, or confirm there is none and leave the link absent.
- [ ] Confirm the availability statement is accurate.
- [ ] Confirm which projects may be publicly named and linked, and which are under NDA.
- [ ] Ask a native Arabic reader to proofread every Arabic page. The copy was written, not
      machine-translated, but a second pair of eyes on a client-facing site is worth it.

### Technical
- [ ] `npm run verify` passes.
- [ ] `npm run test:e2e` passes.
- [ ] Configure `RESEND_API_KEY`, then **send yourself a real test inquiry** and confirm it
      arrives. Until this is done the form correctly reports non-delivery.
- [ ] Run Lighthouse against the deployed URL. No score is claimed anywhere in this repo —
      generate real ones.
- [ ] Verify `https://<domain>/sitemap.xml` and `/robots.txt` resolve.
- [ ] Check the Open Graph card renders in a real preview tool.
- [ ] Submit the sitemap to Google Search Console.
- [ ] Test on a real mid-range Android phone on mobile data, not just an emulator.

### Assets
- [ ] Select six screenshots from `docs/screenshots/` — suggested: 1440 home, 1440 Sendy case
      study, 1440 work index, 390 home (AR), 390 Sendy case study, 1024 about.
- [ ] Record a **10–15 second silent teaser** of the hero fan: arrival, settle, idle float,
      hover the centre card, open Sendy, cut to Arabic. Reload rather than scroll back — the
      arrival runs once per load and it is the shot. No captions; it should read in silence.
- [ ] Record a **30–45 second launch reel**: hero → Sendy case study scroll → IMMAR → NANO →
      Arabic mode switch → mobile scroll.
- [ ] Write a short founder story: why an Iraqi engineer built this, in Mohammed's own voice.

Full asset specs in `launch-assets.md`. Copy drafts in `launch-copy.md`.

---

## Week 1 — Launch

Sequence over the week rather than posting everything at once.

| Day | Action |
|---|---|
| Mon | LinkedIn launch post (English), with the teaser video. Highest-value audience for freelance work. |
| Tue | LinkedIn launch post (Arabic) — a separate post, not a translation appended to the first. |
| Wed | Update the GitHub profile README and pin the relevant repositories. |
| Thu | Instagram Reel (teaser) + carousel outline. X post/thread. |
| Fri | Direct messages to 5–10 trusted reviewers asking for *specific* feedback. |

**Ask reviewers specific questions.** "What do you think?" produces "looks great". Ask instead:
- Within 5 seconds, what do you think I do?
- Which project would you hire me for, and why that one?
- Where did you stop reading?
- Anything that felt exaggerated or untrustworthy?

Then: Iraqi tech, design and startup communities; university networks; the ITS / HUB200 /
Computiq communities Mohammed already belongs to. Post as a person sharing work, not as an ad.

---

## Weeks 2–4 — Post-launch

**One detailed case-study breakdown per week** beats reposting the homepage:

| Week | Topic |
|---|---|
| 2 | Sendy — why operational software is judged on the day something breaks. Order lifecycle, multi-tenancy, the 70-table audit. |
| 3 | Building Arabic-first — why RTL is structural, not a translation task. Logical properties, LTR islands, per-glyph font resolution. |
| 4 | IMMAR — why a student app and an admin dashboard must never be the same product. Permission boundaries. |

Each becomes a LinkedIn post + a section of the site's own case study. Publish in both
languages.

### What to measure

Track outcomes, not vanity traffic:
- Qualified project inquiries (the actual goal)
- Case-study opens, and which project wins
- Contact-form completion rate vs. starts
- Where visitors stop scrolling on the homepage
- Real Core Web Vitals from the field

If analytics are added, note that **`privacy.md` currently states the site has none**. Update
that page in the same deploy — it is the one page that would become untrue.

### Version 1.1

After 3–4 weeks of real feedback, plan one focused refinement pass. Likely candidates:
real screenshots, a portrait, sharpening whichever case study converts worst, and any copy that
reviewers consistently misread.

---

## Editorial and award submissions

See `submission-checklist.md`. Nothing is submitted automatically, no award is claimed before
it is won, and no award logo is used without permission.

## Standing rules

- Never claim a ranking that cannot be independently verified.
- Never present a concept composition as a screenshot.
- Never add a metric that is not documented.
- If a project is under NDA, say "private platform" — that is honest and clients respect it.
