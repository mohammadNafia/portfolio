# Content inventory

Everything used to build this portfolio, and where it came from. **No fact on the site
originates anywhere other than this list.**

## Primary sources

| Source | Location | What it established |
|---|---|---|
| CV data module | `Desktop/cv/cv_data.py` | Contact details, education, awards, languages, all role descriptions and project bullets. The single most authoritative source. |
| Sendy role notes | `Desktop/cv/sendy.md` | Founder status, responsibilities, deployment targets, module list, 70+ table audit. |
| Sendy dashboard repo | `Desktop/sendy-dashboard/README.md`, `CLAUDE.md` | Stack (React 19, TS 5.9, Vite 8, TanStack Query, Zustand, i18next, SignalR), Arabic-first RTL design, seven role types. |
| IMMAR backend repo | `Desktop/IMMAR-backend/README.md`, `docs/` | ASP.NET Core 8 modular monolith, one-way dependency flow, PostgreSQL, permission/role seeding, gated development seed accounts. |
| IMMAR mobile repo | `Desktop/immar/mobile/` | Flutter student application — confirms the mobile/web product split. |
| School system docs | `Desktop/school-system/project-docs/PROJECT-OVERVIEW.md` | Four-repository structure, .NET 8 + Next.js 15 + PostgreSQL 16 + Redis, Arabic-first, "all business rules live in the backend", RBAC matrix, QA and deployment guides. |
| MedicHub | `Desktop/MedicHub/MedicHub/README.md` | FastAPI backend unifying several PyTorch imaging pipelines, local and auto-downloaded weights. |

## Verified facts used

- **Identity** — Mohammed Nafia Nadhim, Baghdad, Iraq.
- **Education** — B.Sc. Artificial Intelligence & Robotics Engineering, Al-Nahrain University,
  College of Engineering.
- **Contact** — `mohammadnafia1@gmail.com`,
  `linkedin.com/in/mohammed-nafia-7b58141ba`, `github.com/mohammadNafia`.
- **Awards** — 1st place, ITS Hackathon 2025 (team award, NANO AI OCR platform);
  2nd place, HUB200 Hackathon 2025, Global Entrepreneurship Week (Dynamic Form Builder);
  selected for the Iraqi Young Leaders Exchange Program (IYLEP), United States.
- **Training** — Iraq TechSchool, six-month software engineering programme, in collaboration
  with Qi Card, Digital Zone, Computiq and HUB200.
- **Employment** — Sendy, Mid-Level Full-Stack Developer (part-time), March 2026–present,
  and founder of the project. Freelance full-stack developer and technical project
  coordinator since 2024.
- **Languages** — Arabic native; English B2–C1, professional working proficiency.

## Assets available but not used

| Asset | Why not used |
|---|---|
| `Desktop/SENDY-BRAND GUIDLINE/` (Sendy logo, icon, mascot, profile art) | Sendy's brand marks belong to Sendy, not to this portfolio. The case study uses Sendy's accent colour only. Embedding the mascot would make the portfolio look like Sendy's own site — the prompt explicitly warns against letting one project's identity take over. |
| `Desktop/sendy video/sendy-launch-video-images/` (13 scene renders) | These are marketing renders produced for a launch video, not product screenshots. Presenting them as product UI would misrepresent them. They are listed in `launch-assets.md` as candidates for the launch reel, where they are honest. |
| `Desktop/cv/*.pdf` (the role-targeted variants) | Superseded. `Mohammed-Nafia-cv.pdf` was confirmed current and is published at `public/Mohammed-Nafia-CV.pdf`, linked by the résumé button in both locales. The remaining variants target different roles and stay unpublished — the site links exactly one CV, by design. See `content-gaps.md` §3. |
| `Desktop/immar/mobile/**/ic_launcher.png` | App launcher icons only — no product screens. |

## What does not exist in any source

Deliberately absent from the site because no evidence supports it:

- Any user, merchant, download or revenue figure.
- Any model accuracy, benchmark or uptime percentage.
- Any client name, testimonial or logo.
- Any employment history beyond Sendy, freelance work and the ITS programme.
- Any professional portrait photograph.
- Any live public URL for Sendy, IMMAR or the school system.

`https://mohammed-opal.vercel.app` appears in `cv_data.py` as a portfolio URL. It is **not**
linked from this site: it is the previous portfolio this project replaces, and linking it
would send visitors to superseded work.
