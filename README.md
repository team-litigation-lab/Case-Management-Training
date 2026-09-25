# LSH Case Management Training (5-Day)

The Case Management version of the LSH EA/PA Upskill portal. It runs on the same engine as the EA/PA portal (sign-in and approvals, lessons as slides, Knowledge Checks, the random Task simulator, AI-graded practice, Live Roleplay, feedback, rankings, certificates and admin tools), but all the content is Case Management.

## What's in it

| Area | Source |
|---|---|
| **Days 1–5 lessons** (192 topics, 78 Knowledge Check questions) | Every slide of *Revised Case Management Training Day 1–5*: slide text, the tables and flowcharts inside slide images, and speaker notes (as trainer cues) |
| **Skill Builders** (11 tools) | The *Skill Building* slides, built on the real case documents |
| **Calendar** (retained) | Rebuilt as a Case Manager docket: conflicts, attorney docket briefing, proactive tasks, and the arbitration Scheduling Order dates |
| **Random Tasks** (retained) | Admin → Surprise Task, generated from the day's CM lessons and the John Doe case file |
| **📁 Case Documents** | `documents/`: the John Doe v. Apex file, the Jordan Davies file (Day 5), templates, and the handout repository |
| **🗂 CMS Simulator** | Links out to the LSH Case Management System (CaseManagementTraining repo). Trainees do the file work there and log the CMS Case ID back here |

### Skill Builders

| Day | Skill Builder |
|---|---|
| 1 | Intake Decision Challenge · Treatment Phase: Red Flags, Aggravation & the Transportation Wall |
| 2 | Pre-Demand & Real-Time Demand Audit · Negotiation Math Check & the BI Settlement Pincer |
| 3 | UM & Lien Reduction: The Final Net Challenge · Disbursement & Closing a Case |
| 4 | Mediation Binder Builder & Pre-Mediation Audit · Arbitration Audit & 6-Tab Binder Build · Case Docket & Calendar Conflict Resolver |
| 5 | Litigation Deadlines, File Architecture & Deposition Prep · The Ultimate Case Management: Jordan Davies |

Auto-graded parts check the trainee's answers against keys drawn from the documents. The written parts use the same 100-point AI rubric as the EA/PA portal.

### Case documents

- The original document set, renamed by phase and numbered `JD_01` to `JD_33`.
- **Added to complete the exercises** (every page marked *TRAINING — SIMULATED DOCUMENT*):
  - `JD_34`–`JD_41`: pleadings and ADR documents (original and amended complaints, the Answer, the Arbitration/Scheduling Order, the AAA fee statement, RFAs, a grayscale fax exhibit, and a draft brief).
  - `JD_42`: the post-closing radiology bill.
  - The Jordan Davies packet (`JDV_01`–`JDV_08`).
- `templates/LSH_Net_Sheet_v2_FIXED.xlsx`: the original Net Sheet calculated the attorney fee from an empty cell (`L11 = L7*I11`), so the fee was always **$0**. Fixed to `L7*C11`, with a John Doe practice tab added.
- **Trainer audit key:** signed in as admin, every document shows a red 🔑 note listing its planted discrepancies. Trainees never see these notes.

Document metadata lives in `js/cm-documents.js`. The Skill Builders are in `js/cm-skillbuilders.js`.

## Deploy (Cloudflare Workers)

This folder is a **separate Worker** from the EA/PA portal.

1. In Cloudflare → Workers & Pages → Create → import this repository and set the **root directory to `cm-training`**. The Worker name comes from `wrangler.json` (`cm-training`).
2. KV: the Worker binds the same `LSH_KV` namespace as EA/PA. **All CM keys are stored under a `cm:` prefix**, so CM trainees, progress and settings never mix with EA/PA data. To use a separate namespace instead, change the `id` in `wrangler.json`.
3. Secrets (Settings → Variables and Secrets), the same as EA/PA:
   - `ADMIN_PASSPHRASE`: admin sign-in; switches on secure mode.
   - `GEMINI_API_KEY` (or `ANTHROPIC_API_KEY`): AI grading and roleplays.
   - `SESSION_SECRET`: optional.
4. After the first deploy, sign in as admin → **🗂 CMS** → set the CMS address. The default is `https://case-management-training.pages.dev`; change it if your CMS lives elsewhere.

The EA/PA site deploys the repository root, so a root `.assetsignore` now excludes `cm-training/`. Without it, the EA/PA Worker would also publish a copy of this portal wired to EA/PA storage.
