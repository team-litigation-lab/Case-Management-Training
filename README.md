# LSH Case Management Training (5-Day)

## 🔐 Sign in on the Main Portal only

Trainees sign in once, on the LSH Training Portal, and open this program from there. Admins always type the admin password on this site (`MASTER_ADMIN_PASSWORD`). The Portal sends them here with a signed, short-lived ticket (`?ticket=…`); `js/portal-gate.js` posts it to `/api/auth/portal`, and the Worker signs a trainee in (same `trainee:<id>` records, so every current registration, progress and approval is kept) (an administrator's ticket `{r: "a", exp}` never signs anyone in: the Worker answers 403 `admin-password`). Someone who opens this site's link directly sees a note with a **Go to the LSH Training Portal** button instead of the form, and the Worker refuses a name + batch typed here (403 `portal-required`), except to renew the session of a trainee already signed in on that device. Someone who opens the link directly gets the *Admin Portal* tab, where an admin types the admin password.

- **Turning it on:** set `PORTAL_SSO_SECRET` (same value as the Portal) as a Worker secret. The admin password (`MASTER_ADMIN_PASSWORD`, the Portal's master admin password) must be set too. Until both are set, `/api/auth/status` reports `portalOnly: false` and the old name + batch form stays. A space or line break around the secret is ignored.
- **If a Portal launch fails:** the message says why: `bad-signature` means the Portal's and this Worker's `PORTAL_SSO_SECRET` differ; "expired" means the link is old (open the program again from the Portal).
- **Ticket format and engine hooks:** see EA-PA-TRAINING's README (*Sign in on the Main Portal only*). `js/portal-gate.js` is the same file in every LSH course repo; the page is built from the EA-PA-TRAINING engine, which carries the hooks.

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
- **🧭 The top bar, organized (every course):** buttons that do the same kind of thing share one menu, the way the Training Portal keeps everything else under ⚙ System Management. **📁 Case File** is one tab for the Case File (or Claim File), 📁 Documents and 🗂 Workspace, which share a row of tabs at the top of their pages; **📚 Guides ▾** holds Notes, Handouts, 🧭 Orientation, Facilitator Guide and the Platform Blueprint (whichever the page has); **📋 My Sheets ▾** holds the Task Tracker and Monitoring Sheet; **⛶ View ▾** holds ⧉ Open in a new tab and ⛶ Full screen. A menu is made only when two or more of its buttons are on the bar. It's `js/lsh-topbar.js`, loaded last, the same file in every LSH course repo; change it in all of them.
- **The slides are the decks' own pages:** each day's lesson is its *Revised Case Management Training Day N* deck, one slide per page (217 pages), rendered from Canva's PDF by `build/decks.py` into `decks/dayN/NN.webp` and `js/cm-decks-data.js`. The deck's title and agenda open the day and its Thank You page closes it. Each topic is a run of pages that follows the deck's sections (20 / 21 / 17 / 12 / 11 topics) and opens with its divider. The Task Overview, Meet the Case, Video Recap, Skill Builders and Knowledge Check stay as they were. **No process questions on the slides:** the Quick Check slides (and the objectives page's Quick Check warm-up) are gone, since the Knowledge Check covers them; the questions stay in the day data, so saved places moved once to the same slides (`moveNoQc` in `js/cm-decks.js`, mark `_cmNoQc` inside the saved places), and the SOP's run of show no longer lists them. The topics written for the course before are matched to the pages that cover them, so each page's Presenter view shows the trainer note and read-aloud script written for that content (`js/cm-decks.js`). Saved places and Quick Check answers moved once to the same content (marked `_cmDecks` inside the saved places). To change a topic's pages or title, edit `DECKS` in `build/decks.py` and run it on the five PDFs.
- **Topic dividers:** every topic opens with a divider slide, as in the EA/PA course. It shows *Day N · section*, *Topic N of M* and the topic's title (`renderTopicDivider`); Presenter view's cue names the topic. Saved places are slide positions, so when the dividers arrived each trainee's "resume here" and "furthest reached" moved once to the same slide (`migrateDayOrder`, flag `dividers-migrated`).
- **Every slide on one screen:** each slide shows whole on one screen, on the lesson page, in full screen and in the shared slides window: the frame takes the room left on the screen, and a slide too long for it is scaled to fit (down to half size, like the deck pages, which always fit), instead of continuing on a second page (`fitSlideZoom` / `paginateLessonSlide` in `js/cm-updates.js`). Only a slide that would have to shrink further still splits.
- **Other features:** standard-size centred slides, Skill Builder pages in the platform page style, and the task log with archiving.
- **Day 1 · Meet the Training Team:** the team members' sub-headers (each name and title) show without a trailing period. The section is added content (not in `build/day1.js`), so `trimTeamHeaders` (`js/cm-updates.js`) tidies any section headed *Meet the (Training) Team* wherever it's drawn: the lesson page, full screen, the shared slides window and other pages. Paragraphs keep their periods.
- **Knowledge Check from full screen:** **Continue to Knowledge Check** on a day's last slide leaves full screen (⛶ Full screen / Present full screen) first and then opens the Knowledge Check, on every day. Before, in full screen it only redrew the slide, so the button seemed to do nothing.

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
    - **Numbering:** the cover is the Cover (★), then slides 1 to 12, the same everywhere: the contents buttons, the counter under the slides ("Cover · 12 slides", then "1 / 12" to "12 / 12"), each slide's header and footer, and the PDF's page footers.
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
| **Day 1** | Intake Decision Challenge · Treatment Phase | Call Simulator (reception, intake) · roleplay: Transportation Wall, MIA client | Build John Doe's case in the CMS · **Front Desk Case Lookup** *(new)* |
| **Day 2** | Pre-Demand & Demand Audit · Negotiation Math & BI Pincer | roleplay: first call on the demand, low-ball & stalls · Email Replies · Call Simulator (adjusters) | **Treatment Phase · Medical Records Requests** (John's prior 2021 and 2018 records, moved from Day 1) · **Demand Package Builder** *(new)* · Medical Records Requests (missing bills) |
| **Day 3** | UM & Lien Reduction · Disbursement & Closing (with the **Net Sheet Ledger**) | **Drafting a Closing Letter** *(new)* · roleplay: hospital lien, ERISA, "why is my check so small?" · Call Simulator (providers) | **Trust Ledger & Disbursement** *(new)* · **Settlement Documents: BI and UM** *(new)* · CMS liens and finance |
| **Day 4** | Mediation Binder · Arbitration Audit | **ADR Communication Lab** *(new)* · roleplay: mediation scheduling, the arbitrator's question | Calendar Conflict Resolver · Calendaring Simulator · Docket System |
| **Day 5** | Litigation Deadlines · Jordan Davies | roleplay: deposition nerves, adjuster called the client, extension by phone · Email Workspace | Court E-Filing · Docket System · Jordan Davies's file in the CMS |

Filters narrow the page to one day or one category, each item shows where it runs (this portal, the LSH Training Portal, the CMS or live roleplay) and whether it's done, and a day's items open when that day unlocks. An "Any day" row links the case documents, quick roleplay, the full Call Simulator, the CMS Training Library, the CMS's scored Front Desk Drill and 🧰 Tools.

### 🧪 Practice Lab in the CMS: done in the tool, submitted for review (`js/cm-lab.js`)

Every Practice Lab activity on Days 1–5 sends the trainee to do the work in the CMS on the matching case (or in the Training Portal tool it runs on, then logged in the CMS), and takes the result back here for review. The tool frame keeps its design: the activity's steps and its Submit for review are on the activity's own page.

- **The steps:** an activity (a Practice card, or a Skill Builder's "Do this in the …" step) opens its tool in the in-portal frame, as before; its steps are listed on the activity's page. Each step can open its own tool or line: the CMS's 📝 New intake (`intake=1`), a Training Library case (`mock=MC-xx`), a Call Simulator line's graded calls (`line=…&mode=graded`), the Medical Records, Docket, E-Filing, Email tools. A roleplay card's first step starts the live call; its second logs the call (a GIRP note, a Lien entry, a Task) in the CMS. The activity names the trainee's own John Doe (or Jordan Davies) Case ID, from what they submitted on Day 1 (Day 5).
- **Submit for review:** the ID the tool gave (CMS Case ID, request number, score), what was done, and the steps ticked. It's saved in the trainee's progress (`lab-subs`, a personal key synced with the rest; the ID also goes into the tool work log), and it marks the activity ✓ Submitted.
- **Automatic review**, straight away: the ID's format, the steps confirmed, and whether the summary names the items the activity names (rule-based, out of 100, with what's missing).
- **Trainer review (every Practice Lab activity):** on 🧪 Practice an admin gets a *For Trainers* card (the Case File's pattern): Load trainees → pick one → every activity with something to review, day by day: Skill Builder scores and written answers, each submission with its automatic review, roleplay results. Each activity (and each submission inside a Skill Builder) takes a score (0–100), a rating (Exceeds expectations / Meets expectations / Needs work / Redo it) and a comment. Reviews are saved in `labreview:<trainee id>`: admins write it, the trainee can only read it (`worker.js`, `canRead`; `traineeWrite` refuses it). The trainee sees the review under their submission (beside the tool and on the Skill Builder), at the top of the activity's page, and as 💬 Reviewed on its card. It's read when a Practice page opens, at most every 2 minutes.
- **"Return to …"** (e.g. 📞 Return to Call Simulator) shows only on the Practice pages, and only while the activity the tool was opened from isn't submitted yet. A tool opened from 🧰 Tools has none (the menu reopens it). Reopening a tool keeps its session and page.


The four new tools (`js/cm-practice.js`):
- **Front Desk Case Lookup** (Day 1 · Systems): eight calls answered from the CMS **Training Library** mock cases (each button opens that case in the CMS with `?mock=MC-xx`): verify the caller, check who is authorized, find the appointment or check status, route urgent calls. Then an AI-reviewed phone message for a time-limited offer, logged as a Note in a practice copy of MC-04.
- **Demand Package Builder** (Day 2 · Systems): mark each bill Include / Request the bill first / Leave out, total the verified specials ($21,660), build the exhibit index, then the send steps and the 30-day clock with reminders.
- **Trust Ledger & Disbursement** (Day 3 · Systems): ten disbursement requests on the cleared $150,000; release or hold each (expired payoff, verbal-only reduction, suspicious wire instructions) with live trust totals ($134,600 released, $15,400 held), trust-account rules, and an AI-reviewed hold memo.
- **Net Sheet Ledger** (Day 3 · Disbursement & Closing a Case, part A, replacing its calculator): the real LSH Net Sheet on the platform, the rows and columns of `documents/templates/LSH_Net_Sheet_v2_FIXED.xlsx`: 1. the gross settlement and its reference; 2. the attorney fee (the % and whether it's on the gross or on the gross minus case costs, as the retainer's §4 says) and the eight advanced case expense lines (Filing fees & Summons … File Storage fee) with Total Attorney Costs and Total Fees & Costs; 3. the medical provider ledger (Provider Type, Provider Name, Total Charges, PIP, Health, Med Pay, Adjustments, Balance Owed, Max Offer, Low Offer, Reduced Bill; Pre-Settlement Funding and Prior Attorney rows; totals); 4. the final client disbursement. Everything adds up as the trainee types. **Save and submit for review** saves it to their record (`lab-subs`) with an automatic check of the math and the required lines (the $150,000 gross, the 40% post-suit tier on gross minus costs, the $2,090 of costs, every lienholder at its final payoff, the $60,746 net) and counts as that part's score; the trainer reviews it on 🧪 Practice like any Practice Lab work (it shows there as a net-sheet summary). **Review** next to it sends the ledger to the same AI rubric as the writing parts.
- **Drafting a Closing Letter** (Day 3 · Communication): starts from the trainee's own saved Net Sheet (its figures are shown), then the letter to John. **Submit for review** checks it against those figures (the gross, fee, costs, liens total and net are stated; every lienholder is named; what happens next; who to contact; no promises); **Review** gives the written AI feedback (the net sheet goes to the reviewer). Trainer review as above.
- **Settlement Documents: BI and UM** (Day 3 · Systems): the trainee completes the settlement paperwork field by field, as the sample forms in Templates lay it out: the **BI release** (amount in words and figures, releasor, releasees, carrier, date of loss, bodily injury only, UM preserved, notarized) and the **BI disbursement statement** for the $150,000 settlement; the **UM waiver of subrogation & consent to settle** (a Day 3 practice variation: Apex's carrier tenders $100,000, Local Farm Mutual UIM claim LFM-UM-0214-JD, consent before the BI release) and the **UM disbursement statement** ($60,000 UIM, 33⅓% pre-suit on gross minus $300 costs, $39,800 net). Each form is checked field by field on submit (right and wrong rows marked, with the reason), saved for the trainer's review.
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

Auto-graded parts check the trainee's answers against keys drawn from the documents. The written parts use the same 100-point AI rubric as the EA/PA portal; their button is **Review** (it shows "Reviewing…" while the reviewer works).

### Case documents

- The original document set, renamed by phase and numbered `JD_01` to `JD_33`.
- **Added to complete the exercises** (every page marked *TRAINING — SIMULATED DOCUMENT*):
  - `JD_34`–`JD_41`: pleadings and ADR documents (original and amended complaints, the Answer, the Arbitration/Scheduling Order, the AAA fee statement, RFAs, a grayscale fax exhibit, and a draft brief).
  - `JD_42`: the post-closing radiology bill.
  - The Jordan Davies packet (`JDV_01`–`JDV_08`).
- `templates/LSH_Net_Sheet_v2_FIXED.xlsx`: the original Net Sheet calculated the attorney fee from an empty cell (`L11 = L7*I11`), so the fee was always **$0**. Fixed to `L7*C11`, with a John Doe practice tab added. Trainees now fill the same net sheet on the platform (the **Net Sheet Ledger**, Day 3); the file stays as the reference.
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
| 📞 Call Simulator (LSH CMS) | Live | `https://lshcasemanagementtraining-trainingcrm.pages.dev/?calls=1` |
| ✉️ Email Workspace (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/email.html` |
| 📨 Email Replies (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/email-replies.html` |
| 🗓 Calendaring Simulator (LSH Training Portal) | Live | `https://cm-training-activity.pages.dev/simulators/calendar.html` |

- **🧰 Tools** in the course's top bar lists every live tool (CMS, Docket, Records, E-Filing, Call Simulator, Email Workspace, Email Replies, Calendaring). Picking one opens it inside the course, under the course's own top bar, so the course navigation and the Tools menu stay on screen and switch tools. The frame lives outside the portal's page renders, so the tool keeps its session and unsaved work while the trainee goes back to a lesson; on the Practice pages a "Return to …" button brings it back while its activity isn't submitted. **New tab ↗** opens the tool on its own.
- Skill Builders include "Do this in the …" steps for each tool. The trainee opens the tool beside the steps, does the work, then submits the ID it gives them (e.g. the CMS Case ID `LSH-2026-PI-000123`) with what they did, for the automatic and the trainer review (see *Practice Lab in the CMS* above). The IDs appear under 🧰 Tools → *My tool work log*.
  - CMS steps: every Skill Builder.
  - Docket steps: Litigation Deadlines (Part A) and the Calendar tool (Part D). The Docket System's John Doe assignment has the same deadlines, counted the same way.
  - Records-request steps: the Day 2 Practice Lab's **Treatment Phase · Medical Records Requests** (John's prior 2021 migraine and 2018 records, with the signed claim-specific HIPAA authorization and the correct DOB, 08/14/1980; it was a step of Day 1's Intake Decision Challenge) and Pre-Demand Audit (every missing bill). A request logged on Day 1 before the move still counts as done.
- **Shared simulators:** Email Workspace, Email Replies, Calendaring, Docket System, Medical Records Requests and Court E-Filing live on the LSH Training Portal (Training-Portal repo), so every program uses the same ones (the Call Simulator is the CMS's, see below). The CM course opens them with `?program=CM&name=…&batch=…`, so they start on the Case Management calls and results carry the trainee's name and batch. The Case Management calls are in the portal's `simulators/call-pack-cm.js`. Trainers see results on the portal's Simulators page when signed in there as admin. The embedded frame allows the microphone, so trainees can answer calls by voice.
- While a tool is *coming soon*, its steps tell the trainee to log the work as a Task in the CMS, so no exercise is blocked.
- **Admin → 🧰 Tools → Admin: tool addresses** sets each tool's address and switches it between Live and Coming soon, for everyone (shared key `settings:tools`).
- **Training tools open without a log-in page:** a trainee signed in here opens the CMS (cases, the Training Library, the Call Simulator, the Front Desk Drill) already signed in. `js/lsh-tool-links.js` is the same file in every LSH course repo (copy it from Foundational-Training when it changes); it loads last in `index.html` (and `build/build.py` adds it last). It asks this Worker's `/api/auth/tool-ticket` for a Portal-style ticket for the signed-in trainee (`{first, last, b, exp}` signed with `PORTAL_SSO_SECRET`, good for 5 minutes, reused for 3) and adds it as `?ticket=` to every CMS link, every link to the Training Portal's simulator pages (`cm-training-activity.pages.dev/simulators…`, which the Portal signs the trainee in from) and `window.open` on the way out; the in-portal frame gets its address from `LSHToolLinks.ticketed(url)`. The CMS signs the trainee in through its existing Portal-ticket sign-in. Admins and the 👁 Trainee view are left alone (an admin's ticket never signs anyone in), and without the secret (or if the request fails) the link opens as it is, with the CMS's own sign-in.
  - **The Call Simulator opens in the CMS directly:** `https://lshcasemanagementtraining-trainingcrm.pages.dev/?calls=1&program=CM&from=cm` (plus `&line=…&mode=graded` for a line's graded calls, e.g. from 🛠 Simulators or a Practice activity), not through the Portal's `simulators/call.html`, so the ticket applies. A saved tool address that still points at the Portal's Call Simulator page (or its `/api/launch` link) is read as the CMS's. The Portal's other simulator pages (`cm-training-activity.pages.dev/simulators/*.html`) keep their addresses; they open signed in too.
- **Sign-in inside the portal:** the CMS (CaseManagementTraining) sets its `lsh_session` cookie with `SameSite=None; Secure; Partitioned`, so trainees stay signed in to the CMS inside the portal frame. The CMS also refuses cross-site write requests (`functions/_middleware.js`). Safari blocks sign-in inside another site's frame whatever the cookie says, so Safari users use **New tab ↗**.

## 📞 Graded calls (the CMS Call Simulator)

The main Call Simulator is the CMS's: every Call Simulator link opens it, signed in through the Portal, with this program's lines (Case Management: Nguyen Case Calls, Reception & Front Desk, Intake Calls, Client Communication, Attorney Reporting, Adjusters & Carriers, Providers & Records), each with Practice and Graded calls. A **graded** call (Graded call 1, 2… on the line, the same for everyone; the caller is unknown until the debrief) counts here: the Training Portal (its `/api/call-results`) keeps the trainee's graded calls in this program's store as `callsim:<trainee id>`, by line, and the Worker lets the trainee read it but never write it. The dashboard band's **Graded calls** card (`js/graded-calls.js`) shows the best graded call on each line, averaged, with the lines and calls taken; each line's best is in its tooltip. It's read once a page load and again when the trainee comes back to the tab (at most every two minutes).

**The dashboard band (trainees):** the five numbers (Program complete, Graded calls, Best Competency, Average quiz score, Days completed), then **💬 Your feedback** and **Ranking** side by side on the same line (a laptop or desktop: one row; a tablet: the numbers, then Feedback and Ranking on the next line). The certificate notice (the same 🎓 pill) sits right under them, inside the band, instead of on its own under it; once it's unlocked, **Download my Certificate** stays with the dashboard's buttons. It's the `renderDashboard` wrapper at the end of `js/cm-updates.js` (it marks the band `cm-band`).

**Training Portal simulator results:** the Portal writes each signed-in trainee's simulator results into this course's store as `simresults:<trainee id>` (`{traineeId, updatedAt, results:[{simulator, scenario, score, at}], best:{<simulator>:{score, count, at}}}`, under the Worker's `cm:` prefix). The trainee reads their own and never writes it (`worker.js`). Each Practice card for a Portal simulator (Medical Records Requests, Docket, E-Filing, Email Workspace, Email Replies, Calendaring) shows the best result as a **Best NN%** tag, and the trainer's Practice Lab review lists it. It's read with the trainer reviews, in the same request, when a Practice page opens (at most every 2 minutes).

## 🕘 Attendance

Trainers take each day's attendance in **Admin → 🕘 Attendance** (`js/attendance.js`). Trainees don't see it. It's the same file in every LSH course repo (EA-PA-TRAINING, Case-Management-Training, propertydamageclaimstraining, Foundational-Training); change it in all of them. The LSH Training Portal's admin **🕘 Attendance** page shows and edits the same records, for every program.

- **By batch:** one section per batch (newest first), listing its approved, active trainees, with a count of each status.
- **The day:** today's date in Eastern time (EST, or EDT in summer). ◀ ▶ step through the training days, and the date picker opens any day. The batch's **Day N** counts its days already logged; the trainer can change it.
- **Each trainee's row:** Name; **Training** (the lesson, "Day N: title": for the batch it starts as the day most of the batch is on, from their progress, and it can be changed for the batch or one trainee); **Time In / Time Out** in Eastern time (typed, or ⏱ Now; **Time In fills in on its own** the first time a trainee opens the course each day, marked "auto" until a trainer sets one, and saved when a trainer tags that trainee; trainers always tag the status); **Status**, tagged from the attendance sheet's dropdown in its colors (Present, Late, Late with Notif, Early Out - POC Approved, Undertime - POC Approved, Undertime - No Approval, NCNS, Sick Leave, RL, EOP, Absent with Notif; **✓ Mark the rest Present** tags everyone not yet tagged); and Notes.
- **Saving:** each change saves as you go. A save re-reads the day and writes only the rows changed on that screen, so two trainers can take one batch's attendance at the same time.
- **📊 Summary** (per batch): each trainee's count of every status over the batch's logged days, with the last 10 days as colored squares. **⬇ CSV** downloads a day (every batch) or a batch's history.
- **Google Sheet:** the LSH Training Portal keeps the attendance Google Sheet's **Platform Attendance** tab in step, both ways: everything here (automatic Time Ins included) goes to the sheet every 15 minutes, and edits made in the sheet to Training, Time In, Time Out, Status or Notes come back here straight away. See the Training Portal's README.
- **Storage:** `attendance:<batch key>:<YYYY-MM-DD>` (`_none` for no batch) = `{batch, date, day, training, rows:{<trainee id>:{name, training, timeIn, timeOut, status, note, at, by}}}`, under the Worker's `cm:` prefix. The Worker's `/api/checkin` records the automatic Time In: `checkin:<YYYY-MM-DD>:<trainee id>` = `{timeIn, at, name, batch, training}` is the automatic Time In (each trainee's own key, so a room signing in at once never overwrites one another; its KV metadata carries the same for the portal; kept 40 days). Only admins can read or write these records.

## 📉 Staying under Cloudflare's monthly request allowance

The Cloudflare account is on Workers Paid: **10 million requests a month for the whole account**, shared by every LSH site (the courses, the CMS, the Training Portal and the rest). This course's Worker counts for everything under `/api/` and `/version`; static files (the page, `js/`, `decks/`, `documents/`) are free and don't count. Past the allowance, Cloudflare charges for every extra million requests. Usage is under **Workers & Pages** in the Cloudflare dashboard.

So an open page asks the server sparingly (`POLL` in `index.html`), and not at all while its tab is in the background. When it's back, whatever came due runs then; a quick look at another tab (Google Meet) asks nothing:

| What | How often | Before |
|---|---|---|
| A trainee's access and new tasks (`startApprovalPolling`) | every minute: their record, and the tasks for every unlocked day in one request | every 45 s: their record twice and one request per day, also in the background |
| A Skill Builders attempt reset (`liveTick`) | every minute (the minute check above counts) | every 10 s |
| Trainer feedback and Focus items | every 2 minutes | every 45 s |
| Waiting for approval | every 15 s | every 8 s |
| Admin: Trainee Audit, Rankings, Trainee Feedback | every minute, every trainee in one request | every 30 s, one request per trainee |
| Admin: the Trainee Audit's progress, feedback and Focus columns | one request for up to 33 trainees | three requests per trainee |
| A new version (`/version`) | every 3 minutes (a change is confirmed 20 s later) | every 45 s, also in the background |
| Opening the page: lesson add-ons and Daily Activities | one request each | 15 and 6 requests |

A trainee's page in view now asks about 3 times a minute (it was about 17) and nothing in the background (about 11). An admin on the Trainee Audit with 30 trainees: about 3 a minute (60 to 150).

Lists of records (the Trainee Audit, attendance, trainee feedback, activity submissions, tasks) are read with `/api/storage/get-many` (up to 100 keys, the same rules and `cm:` prefix as `/api/storage/get` for each key), not one request per record. A trainee is signed out as revoked only when the server answers that their record is gone or not approved: a server that doesn't answer (offline, or switched off for the month) no longer signs anyone out or clears their notes.


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
  - A long slide's next and previous pages change in place (slides are scaled to fit before they split, so the test shrinks the slides window to make one split).
  - A resize lays the slide out again without animation.
  - The slides window never reloads itself for an update.
- **Topic dividers** (`.github/scripts/dividers.cjs`):
  - every day has one divider per topic, just before its Part 1;
  - all 192 fit on one page at 1280×720 and show their number and section;
- **Every slide fits on one screen** (`.github/scripts/fit.cjs`): every slide of every day ends inside the window with its Previous / Next bar at 1366×768 and 1920×1080, nothing in it scrolls, and none is split onto a second page.
  - Presenter view's cue names the topic;
  - a trainee's saved place from before the deck pages reopens on the page that covers the same topic; "furthest reached" and Quick Check answers move with it, once.
- **Server requests** (`.github/scripts/requests.cjs`):
  - `get-many` gives a trainee only their own and public records and an Admin every one, refuses more than 100 keys, and reads under the `cm:` prefix like `get` (never an EA/PA record);
  - with the checks sped up, a trainee's page reads the tasks for every day in one request and their record about once per check, checks for a new version rarely, and asks nothing while the tab is in the background (catching up when it's back) or on a quick switch to another tab and back;
  - a server that doesn't answer doesn't sign the trainee out; a revoke does;
  - the Trainee Audit reads every trainee in two requests, and its progress columns in one.

To run them locally: `node .github/scripts/check-site.mjs`, `node .github/scripts/check-data.mjs`, then `node .github/scripts/server.mjs 8787 &` and `node .github/scripts/smoke.cjs http://localhost:8787/` and `node .github/scripts/presenter.cjs http://localhost:8787/` and `node .github/scripts/dividers.cjs http://localhost:8787/` and `node .github/scripts/requests.cjs http://localhost:8787/` and (needs Playwright).

**About the "Workers Builds: case-management-training" check on pull requests:** Cloudflare's preview build for non-`main` branches fails instantly and posts no log. The code builds (the dry run above passes) and `main` deploys normally. Fix or turn it off in the Cloudflare dashboard → Workers & Pages → case-management-training → Settings → Build:
- open the failed build's log to see the reason;
- or turn off **Builds for non-production branches**.

Until then, go by **Checks**.

## Deploy (Cloudflare Workers)

This repository is its own Worker, separate from the EA/PA portal (EA-PA-TRAINING).

1. In Cloudflare → Workers & Pages → Create → import this repository (leave the root directory as the repository root). The Worker is `case-management-training` (the name in `wrangler.json` must match the Worker name in Cloudflare), so the course is at `https://case-management-training.legalsupporthelp.workers.dev`.
2. KV: the Worker binds the same `LSH_KV` namespace as EA/PA. **All CM keys are stored under a `cm:` prefix**, so CM trainees, progress and settings never mix with EA/PA data. To use a separate namespace instead, change the `id` in `wrangler.json`.
3. Secrets (Settings → Variables and Secrets), the same as EA/PA:
   - `MASTER_ADMIN_PASSWORD`: admin sign-in (the LSH Training Portal's master admin password: one password on every platform); setting it switches on secure mode. Set it as a Secret.
  - `AI_GATEWAY_SECRET`: optional (a Secret; the same value as on the Portal). When set, every AI call goes to the Main Portal's shared AI gateway (`/api/ai-gateway`): one master key pool and one shared budget for every call flow, counted per program. Without it this Worker uses its own `GEMINI_API_KEY` pool.
   - `GEMINI_API_KEY`: AI grading and roleplays (Gemini is the only AI provider, as in EA/PA).
   - `SESSION_SECRET`: optional.
   - `PORTAL_SSO_SECRET`: the Portal sign-in secret (see the top of this README); it also signs the tickets that open the CMS without a log-in page (`/api/auth/tool-ticket`).
4. After the first deploy, sign in as admin → **🧰 Tools** to check the CMS address (default `https://lshcasemanagementtraining-trainingcrm.pages.dev`, the CaseManagementTraining app). The Docket System, Medical Records Requests and Court E-Filing are Live by default and point at the LSH Training Portal. If an admin saved tool addresses before they went live, open **Admin: tool addresses** once and set them to Live with their portal addresses.

`.assetsignore` keeps `worker.js`, `wrangler.json`, the Markdown files and `build/` out of the published site.

## Daily Activities and the facilitator's feedback style

`js/daily-activities.js` is the same file as in EA-PA-TRAINING (copy it over when it changes there): trainers publish each day's activities and review submissions in Admin → 📋 Activities (in this course the trainees' top bar has no **📋 Activities** button: their practice is all on 🧪 Practice; the button is left out in `renderTopbar`, `js/cm-updates.js`), and **Admin → 🗣 Feedback Style**, which learns the facilitator's feedback voice and applies it to all AI feedback (Skill Builder grading, daily reviews, activity drafts). The storage rules for its keys (`activities:dayN`, `actfile:*`, `actsub:<trainee>`, `actup:<trainee>:*`, `actadmin:rubrics`, `settings:feedback-style`, `admin:fbstyle-samples`) are in `worker.js`; see the EA-PA-TRAINING README for details.
