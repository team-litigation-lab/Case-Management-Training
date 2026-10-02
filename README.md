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
| **🧰 Training Tools** | The hub for the LSH training platforms, built into the portal (see below) |
| **🛠 Simulators** | Opens the LSH Training Portal's shared **Call Simulator** (Case Management pack: 27 calls on the John Doe file), **Email Workspace** (a practice inbox to triage and file), **Email Replies** (John Doe correspondence, answered on the portal or from the trainee's own inbox) and **Calendaring** (see below) |

### Trainer tools (from the EA/PA portal)

The CM course has the same trainer features as the EA/PA portal. They live in `js/cm-updates.js`, a CM copy of EA/PA's `js/eapa-updates.js` with the EA/PA-only exercises left out and the text adapted.

- **SOP Reference** (Admin → SOP Reference):
  - **🧭 Program flow:** kick-off, the daily rhythm, between sessions, program close, an "I want to… → go here" map and the 5 days at a glance.
  - **For each day:** a timed **Run of show** (Do / Say / Watch for; printable), built from that day's live content: topics, Quick Checks, every Skill Builder and its parts, the discussion question and the Knowledge Check.
  - **Detailed script:** follows the run of show, with a **🎤 Present** mode for the room.
  - The SOP is generated from the lessons, so it stays in step with Content Studio edits.
- **🖥 Presenter view:** share only the slides in Google Meet while the trainer reads a script for each slide, in the EA/PA format: ① the why, ② talk it through, ③ walk through it (the slide's steps or practices in order: first, next, finally), ④ ask the room / your turn. The scripts are hand-written in `js/slide-scripts/day1.js`–`day5.js` (`window.SLIDE_SCRIPTS["<day>::<topic title>"].p1` / `.p2`, one per slide); the Speaker Notes PDF uses the same scripts. Above each script, as in the EA/PA course, the trainer sees **On this slide** (what the room is looking at, from `js/presenter-notes.js`) and, on a topic's first slide, the deck's own speaker note as the **Trainer note** (unless the script already says it). On Day 1, the "Meet the Case" slide has a trainer guide. The shared slides window never flickers: slides and pages cut straight in (no slide-in or fade animation), the slide on screen isn't drawn again when the console re-draws, a long slide's next page shows in place, and the window never reloads itself for a new version mid-class. The console's **Update now** banner is there instead; after updating, press ↗ Re-open slides window.
- **👁 Trainee view:** an admin switches to the trainee experience (every day unlocked) and back without signing out.
- **🏠 Main Portal (admins):** while an admin is signed in, the top bar has **🏠 Main Portal** and the Admin screen has **← Back to Main Portal** (next to Log out). Both open the LSH Training Portal's Training Directory (`https://cm-training-activity.pages.dev/programs.html`), where admins open each program. Trainees and the 👁 Trainee view don't show them. It's `js/portal-link.js`, the same file in every LSH course repo (EA-PA-TRAINING, Case-Management-Training, propertydamageclaimstraining, Foundational-Training); change it in all of them.
- **The slides are the decks' own pages:** each day's lesson is its *Revised Case Management Training Day N* deck, one slide per page (217 pages), rendered from Canva's PDF by `build/decks.py` into `decks/dayN/NN.webp` and `js/cm-decks-data.js`. The deck's title and agenda open the day and its Thank You page closes it. Each topic is a run of pages that follows the deck's sections (20 / 21 / 17 / 12 / 11 topics) and opens with its divider. The Task Overview, Meet the Case, Quick Checks, Video Recap, Skill Builders and Knowledge Check stay as they were. The topics written for the course before are matched to the pages that cover them, so each page's Presenter view shows the trainer note and read-aloud script written for that content (`js/cm-decks.js`). Saved places and Quick Check answers moved once to the same content (marked `_cmDecks` inside the saved places). To change a topic's pages or title, edit `DECKS` in `build/decks.py` and run it on the five PDFs.
- **Topic dividers:** every topic opens with a divider slide, as in the EA/PA course. It shows *Day N · section*, *Topic N of M* and the topic's title (`renderTopicDivider`); Presenter view's cue names the topic. Saved places are slide positions, so when the dividers arrived each trainee's "resume here" and "furthest reached" moved once to the same slide (`migrateDayOrder`, flag `dividers-migrated`).
- **Other features:** standard-size centred slides (long topics continue on a second page), Skill Builder pages in the platform page style, and the task log with archiving.

`index.html` is generated from the EA/PA portal's `index.html` (EA-PA-TRAINING, last built from its `main` after #19 plus the new-tab fix) by `build/build.py`, and `js/cm-updates.js` is a CM copy of EA/PA's `js/eapa-updates.js`. When EA/PA ships new portal features, rebuild so the CM course picks them up:

```
python3 build/build.py ../EA-PA-TRAINING/index.html
```

The script applies the CM edits to the EA/PA page and inserts the CM content from `build/` (`day1.js`–`day5.js` for the lessons, and the `cm_*.js` files for the case file, calendar, roleplays and practice tools). Every edit checks that its anchor exists, so it stops with an error if EA/PA changed that part; update the anchor in `build.py` and run it again. Carry new features from `js/eapa-updates.js` into `js/cm-updates.js` by hand.

- **🧭 Orientation and the Blueprints:** Orientation has two tabs.
  - **🧭 Trainee blueprint:** the Orientation deck. It's also `/blueprint.pdf`, in trainees' Handouts.
    - **It republishes itself after every deploy.** The published copy is matched against `APP_BUILD` and the Worker's deployment id (`/version`). The first admin page open after a deploy rebuilds it.
  - **🛠 Trainer blueprint** (admins only, never at a public address): a cover and 12 slides on running the course. It covers signing in, the Trainee Audit, day feedback, surprise tasks, the Case File's checkpoints and keys, the documents' 🔑 audit key, Practice and the simulators, SOP Reference, Presenter view, Batch Folders, Rankings and Content Studio, Activities and the feedback style, Attendance and Trainee view.
    - **⬇ Download PDF:** a landscape PDF, one page per slide, stamped with the build and the deployment.
    - **Files:** the slides are in `js/blueprint-content.js`. `js/lsh-blueprint.js` is the same file on every LSH platform, and `js/lsh-blueprint-course.js` is the same on every LSH course: copy them from EA-PA-TRAINING when they change there.
    - **Test:** `.github/scripts/blueprint.cjs`.

### Case File: CM Mindset & critical thinking

The Case File page (`js/cm-mindset.js`) trains the Case Manager mindset rather than handing out a finished summary.

- **Case Snapshot only**: parties, file and claim numbers, client contact, case type, date and place of loss, and the retainer date. Injuries, treatment, coverage, deadlines and problems are left for trainees to find in the documents, verify and cite.
- **The CM Mindset**: five questions to ask of every document:
  - What does it prove?
  - What doesn't match?
  - What could hurt the case?
  - What's due and what's missing?
  - What's next, and who needs to know?
- **Build the File in the CMS**: trainees create John Doe's case in the CMS from the documents, correct the planted errors with a note, upload each document to the right folder, calendar every deadline, add parties, carriers and lienholders, and log a task for every next step. They log their CMS Case ID on the page.
- **Critical-thinking checkpoints**: one per day (two on Day 1), each opening with its day. Each has a situation, the source documents and five questions answered in the trainee's own words, citing documents:
  - Intake: what do we really have?
  - Treatment: does the medical story hold together?
  - The demand: would you send this?
  - Liens and the release: protect the client's net.
  - Mediation and arbitration: is the file trial-ready?
  - Jordan Davies: find the money, protect the case.
- **Answer key and feedback**: the key appears after the trainee submits, next to their answers. The AI reviewer (Gemini) marks each key point found or missed and scores each question and the checkpoint. It also names strengths and blind spots, with a note on how the trainee thinks. If the reviewer isn't available, the key still shows for self-checking. Trainees can try again; the best score is kept.
- **For trainers**: admins see the key under every question and the full case summary (`CLIENT_PROFILE_DOC`, which also feeds the AI tasks). They can open any trainee's checkpoint answers, scores and feedback.
- Answers are saved in the trainee's progress (`cm-mindset`), so they follow the trainee across devices.

### 🧪 Practice (one page, three categories)

The top bar has a single **🧪 Practice** item. It replaces the separate Skill Builders, 🛠 Simulators, 🧰 Tools and 🔥 Roleplay items, which are all still reachable from it. Every day has the same three categories:

| | 🧠 Skill Builders | 🗣 Communication | 🗂 Systems |
|---|---|---|---|
| **Day 1** | Intake Decision Challenge · Treatment Phase | Call Simulator (reception, intake) · roleplay: Transportation Wall, MIA client | Build John Doe's case in the CMS · Medical Records Requests · **Front Desk Case Lookup** *(new)* |
| **Day 2** | Pre-Demand & Demand Audit · Negotiation Math & BI Pincer | roleplay: first call on the demand, low-ball & stalls · Email Replies · Call Simulator (adjusters) | **Demand Package Builder** *(new)* · Medical Records Requests (missing bills) |
| **Day 3** | UM & Lien Reduction · Disbursement & Closing | roleplay: hospital lien, ERISA, "why is my check so small?" · Call Simulator (providers) | **Trust Ledger & Disbursement** *(new)* · CMS liens and finance |
| **Day 4** | Mediation Binder · Arbitration Audit | **ADR Communication Lab** *(new)* · roleplay: mediation scheduling, the arbitrator's question | Calendar Conflict Resolver · Calendaring Simulator · Docket System |
| **Day 5** | Litigation Deadlines · Jordan Davies | roleplay: deposition nerves, adjuster called the client, extension by phone · Email Workspace | Court E-Filing · Docket System · Jordan Davies's file in the CMS |

Filters narrow the page to one day or one category, each item shows where it runs (this portal, the LSH Training Portal, the CMS or live roleplay) and whether it's done, and a day's items open when that day unlocks. An "Any day" row links the case documents, quick roleplay, the full Call Simulator, the CMS Training Library, the CMS's scored Front Desk Drill and 🧰 Tools.

The four new tools (`js/cm-practice.js`):
- **Front Desk Case Lookup** (Day 1 · Systems): eight calls answered from the CMS **Training Library** mock cases (each button opens that case in the CMS with `?mock=MC-xx`): verify the caller, check who is authorized, find the appointment or check status, route urgent calls. Then an AI-reviewed phone message for a time-limited offer, logged as a Note in a practice copy of MC-04.
- **Demand Package Builder** (Day 2 · Systems): mark each bill Include / Request the bill first / Leave out, total the verified specials ($21,660), build the exhibit index, then the send steps and the 30-day clock with reminders.
- **Trust Ledger & Disbursement** (Day 3 · Systems): ten disbursement requests on the cleared $150,000; release or hold each (expired payoff, verbal-only reduction, suspicious wire instructions) with live trust totals ($134,600 released, $15,400 held), trust-account rules, and an AI-reviewed hold memo.
- **ADR Communication Lab** (Day 4 · Communication): three live roleplay calls (a mediation date past the court's deadline, the arbitrator's question at the break, John and the mediator's proposal) plus written follow-ups.

**➕ Extra Practice** (a section of the Practice page, after Day 5): optional labs on the course's cases. Each opens with its day and never affects unlocking.
- **Property Damage Claims Lab** (opens with Day 2): John Doe's 2023 Tesla Model Y is a $42,500 total loss and Aggressive Casualty denied property damage (Excl. 4.b), so the car goes through John's Local Farm Mutual collision coverage ($1,000 deductible) while Local Farm Mutual subrogates against Apex. Five parts:
  - *Who pays for what*: route nine losses (the car, tow and storage, the deductible, rental, a laptop, medical bills, MedPay, PIP, diminished value).
  - *Audit the valuation*: accept, dispute or ask for proof on each line of a simulated total-loss valuation (wrong trim, an out-of-market comparable, an unsupported condition adjustment, uncredited tires, short-paid storage).
  - *Run the numbers*: settlement $44,235, $15,475 to John after the $28,760 loan payoff, $3,470 in unpaid losses to recover from Apex, and the Day 5 "lesser of" rule ($10,000).
  - *Work the PD file*: denial letter and exclusion text, color photos, preserving the car before salvage, the storage clock, receipts, and a bodily-injury-only release.
  - *Dispute and update*: an AI-reviewed valuation dispute email to the carrier and an update for John, then the PD documents, Note and Tasks in the CMS.

  The valuation report, settlement letter, loan payoff and receipts are simulated for the lab; the coverage facts come from JD04, JD27 and JD28.

The new tools don't change how days unlock: the next day still opens when the original Skill Builders have been submitted (any score).

The CMS opens with `?program=cm`, so its Training Library lists the Case Management cases and saved cases are tagged with the program. The link also sends `from=cm` and the trainee's name and batch, so the CMS signs them in with just their name (no CMS account); a CMS opened on its own asks them to register.

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

Document metadata lives in `js/cm-documents.js`. The Skill Builders and the Training Tools hub are in `js/cm-skillbuilders.js`.

### Training Tools hub

This portal is the main LSH training portal. The job platforms are embedded in it, and each one can still be opened on its own at its own address.

| Tool | Status | Default address |
|---|---|---|
| 🗂 LSH Case Management System | Live | `https://lshcasemanagementtraining-trainingcrm.pages.dev` |
| ⚖️ Docket System (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/docket.html` |
| 🗂 Medical Records Requests (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/records.html` |
| 🏛 Court E-Filing (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/efiling.html` |
| 📞 Call Simulator (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/call.html` |
| ✉️ Email Workspace (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/email.html` |
| 📨 Email Replies (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/email-replies.html` |
| 🗓 Calendaring Simulator (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/calendar.html` |

- **🧰 Tools** in the course's top bar lists every live tool (CMS, Docket, Records, E-Filing, Call Simulator, Email Workspace, Email Replies, Calendaring). Picking one opens it inside the course, under the course's own top bar, so the course navigation and the Tools menu stay on screen and switch tools. The frame lives outside the portal's page renders, so the tool keeps its session and unsaved work while the trainee goes back to a lesson; a "Return to …" button brings it back. **New tab ↗** opens the tool on its own.
- Skill Builders include "Do this in the …" steps for each tool. The trainee does the work in the tool, then logs the ID it gives them (e.g. the CMS Case ID `LSH-2026-PI-000123`). The log appears under 🧰 Tools → *My tool work log*.
  - CMS steps: every Skill Builder.
  - Docket steps: Litigation Deadlines (Part A) and the Calendar tool (Part D). The Docket System's John Doe assignment has the same deadlines, counted the same way.
  - Records-request steps: Intake Decision Challenge and Pre-Demand Audit. The Medical Records simulator covers both (prior 2018/2021 records, and every missing bill).
- **Shared simulators:** the Call Simulator, Email Workspace, Email Replies, Calendaring, Docket System, Medical Records Requests and Court E-Filing live on the LSH Training Portal (Training-Portal repo), so every program uses the same ones. The CM course opens them with `?program=CM&name=…&batch=…`, so they start on the Case Management calls and results carry the trainee's name and batch. The Case Management calls are in the portal's `simulators/call-pack-cm.js`. Trainers see results on the portal's Simulators page when signed in there as admin. The embedded frame allows the microphone, so trainees can answer calls by voice.
- While a tool is *coming soon*, its steps tell the trainee to log the work as a Task in the CMS, so no exercise is blocked.
- **Admin → 🧰 Tools → Admin: tool addresses** sets each tool's address and switches it between Live and Coming soon, for everyone (shared key `settings:tools`).
- **Sign-in inside the portal:** the CMS (CaseManagementTraining) sets its `lsh_session` cookie with `SameSite=None; Secure; Partitioned`, so trainees stay signed in to the CMS inside the portal frame. The CMS also refuses cross-site write requests (`functions/_middleware.js`). Safari blocks sign-in inside another site's frame whatever the cookie says, so Safari users use **New tab ↗**.

## 🕘 Attendance

Trainers take each day's attendance in **Admin → 🕘 Attendance** (`js/attendance.js`). Trainees don't see it. It's the same file in every LSH course repo (EA-PA-TRAINING, Case-Management-Training, propertydamageclaimstraining, Foundational-Training); change it in all of them. The LSH Training Portal's admin **🕘 Attendance** page shows and edits the same records, for every program.

- **By batch:** one section per batch (newest first), listing its approved, active trainees, with a count of each status.
- **The day:** today's date in Eastern time (EST, or EDT in summer). ◀ ▶ step through the training days, and the date picker opens any day. The batch's **Day N** counts its days already logged; the trainer can change it.
- **Each trainee's row:** Name; **Training** (the lesson, "Day N: title": for the batch it starts as the day most of the batch is on, from their progress, and it can be changed for the batch or one trainee); **Time In / Time Out** in Eastern time (typed, or ⏱ Now; **Time In fills in on its own** the first time a trainee opens the course each day, marked "auto" until a trainer sets one, and saved when a trainer tags that trainee; trainers always tag the status); **Status**, tagged from the attendance sheet's dropdown in its colors (Present, Late, Late with Notif, Early Out - POC Approved, Undertime - POC Approved, Undertime - No Approval, NCNS, Sick Leave, RL, EOP, Absent with Notif; **✓ Mark the rest Present** tags everyone not yet tagged); and Notes.
- **Saving:** each change saves as you go. A save re-reads the day and writes only the rows changed on that screen, so two trainers can take one batch's attendance at the same time.
- **📊 Summary** (per batch): each trainee's count of every status over the batch's logged days, with the last 10 days as colored squares. **⬇ CSV** downloads a day (every batch) or a batch's history.
- **Google Sheet:** the LSH Training Portal keeps the attendance Google Sheet's **Platform Attendance** tab in step, both ways: everything here (automatic Time Ins included) goes to the sheet every 15 minutes, and edits made in the sheet to Training, Time In, Time Out, Status or Notes come back here straight away. See the Training Portal's README.
- **Storage:** `attendance:<batch key>:<YYYY-MM-DD>` (`_none` for no batch) = `{batch, date, day, training, rows:{<trainee id>:{name, training, timeIn, timeOut, status, note, at, by}}}`, under the Worker's `cm:` prefix. The Worker's `/api/checkin` records the automatic Time In: `checkin:<YYYY-MM-DD>:<trainee id>` = `{timeIn, at, name, batch, training}` is the automatic Time In (each trainee's own key, so a room signing in at once never overwrites one another; its KV metadata carries the same for the portal; kept 40 days). Only admins can read or write these records.

## Checks (GitHub Actions)

`.github/workflows/checks.yml` runs on every pull request and every push to `main`. A red **Checks** status means something is broken, and the log says what:

- **Syntax, files and build:**
  - every JavaScript file and inline `<script>` must parse;
  - every local file `index.html` loads must exist;
  - every case document and handout in `js/cm-documents.js` must exist in `documents/`, and every `docPacket([...])` id must be a real document (`.github/scripts/check-data.mjs`);
  - the Worker must build (`wrangler deploy --dry-run`; nothing is deployed).
- **Smoke test in a browser:** serves the site through `worker.js` with an in-memory KV store, signs in as a trainee, and renders every lesson slide, knowledge check, page and practice tool (every part) at desktop and phone width. It fails on any page error or a page that scrolls sideways.
- **Presenter view** (`.github/scripts/presenter.cjs`): opens Presenter view as a trainer and watches the slides window.
  - Next draws the slide once, with no entrance animation.
  - The console re-drawing (its live copy reconnecting) doesn't draw the slides window again.
  - A long slide's next and previous pages change in place.
  - A resize lays the slide out again without animation.
  - The slides window never reloads itself for an update.
- **Topic dividers** (`.github/scripts/dividers.cjs`):
  - every day has one divider per topic, just before its Part 1;
  - all 192 fit on one page at 1280×720 and show their number and section;
  - Presenter view's cue names the topic;
  - a trainee's saved place from before the deck pages reopens on the page that covers the same topic; "furthest reached" and Quick Check answers move with it, once.

To run them locally: `node .github/scripts/check-site.mjs`, `node .github/scripts/check-data.mjs`, then `node .github/scripts/server.mjs 8787 &` and `node .github/scripts/smoke.cjs http://localhost:8787/` and `node .github/scripts/presenter.cjs http://localhost:8787/` and `node .github/scripts/dividers.cjs http://localhost:8787/` (needs Playwright).

**About the "Workers Builds: case-management-training" check on pull requests:** Cloudflare's preview build for non-`main` branches fails instantly and posts no log. The code builds (the dry run above passes) and `main` deploys normally. Fix or turn it off in the Cloudflare dashboard → Workers & Pages → case-management-training → Settings → Build:
- open the failed build's log to see the reason;
- or turn off **Builds for non-production branches**.

Until then, go by **Checks**.

## Deploy (Cloudflare Workers)

This repository is its own Worker, separate from the EA/PA portal (EA-PA-TRAINING).

1. In Cloudflare → Workers & Pages → Create → import this repository (leave the root directory as the repository root). The Worker is `case-management-training` (the name in `wrangler.json` must match the Worker name in Cloudflare), so the course is at `https://case-management-training.legalsupporthelp.workers.dev`.
2. KV: the Worker binds the same `LSH_KV` namespace as EA/PA. **All CM keys are stored under a `cm:` prefix**, so CM trainees, progress and settings never mix with EA/PA data. To use a separate namespace instead, change the `id` in `wrangler.json`.
3. Secrets (Settings → Variables and Secrets), the same as EA/PA:
   - `ADMIN_PASSPHRASE`: admin sign-in; switches on secure mode.
   - `GEMINI_API_KEY`: AI grading and roleplays (Gemini is the only AI provider, as in EA/PA).
   - `SESSION_SECRET`: optional.
4. After the first deploy, sign in as admin → **🧰 Tools** to check the CMS address (default `https://lshcasemanagementtraining-trainingcrm.pages.dev`, the CaseManagementTraining app). The Docket System, Medical Records Requests and Court E-Filing are Live by default and point at the LSH Training Portal. If an admin saved tool addresses before they went live, open **Admin: tool addresses** once and set them to Live with their portal addresses.

`.assetsignore` keeps `worker.js`, `wrangler.json`, the Markdown files and `build/` out of the published site.

## Daily Activities and the facilitator's feedback style

`js/daily-activities.js` is the same file as in EA-PA-TRAINING (copy it over when it changes there): a **📋 Activities** tab where trainers publish each day's activities (Admin → 📋 Activities) and review submissions, and **Admin → 🗣 Feedback Style**, which learns the facilitator's feedback voice and applies it to all AI feedback (Skill Builder grading, daily reviews, activity drafts). The storage rules for its keys (`activities:dayN`, `actfile:*`, `actsub:<trainee>`, `actup:<trainee>:*`, `actadmin:rubrics`, `settings:feedback-style`, `admin:fbstyle-samples`) are in `worker.js`; see the EA-PA-TRAINING README for details.
