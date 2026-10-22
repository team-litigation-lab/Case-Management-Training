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
| **Calendar Conflict Resolver** (Case Flow Day 4; `PRACTICE_TOOLS` in `build/cm_practice_tools.js`, wired in `js/cm-skillbuilders.js`) | The one practice tool kept beside the Case Flow's Skill Activities: a Case Manager's week across John Doe v. Robert Smith and three other matters, in four parts: Calendar Conflict Resolver, Docket Briefing for the Attorney, Proactive CM Tasks, and Part D, **Hard-Code the Scheduling Order Dates** from the Court's Scheduling Order (RS55), then entered on the Docket System |
| **Random Tasks** (retained) | Admin → Surprise Task, generated from the day's CM lessons and the John Doe case file |
| **🔥 Live Roleplay** | The Case Flow's calls (`build/cm_roleplay.js`), one category per day (`cfday1`–`cfday5`); the personas are Dana Whitfield of Keystone Mutual, John Doe, and defense counsel Atty. Grant Mercer |
| **📁 Case Documents** | `documents/`: the Case Flow's case documents (`documents/case-flow`), the templates, and the handout repository (by Case Flow day) |
| **🧰 Training Tools** | The hub for the LSH training platforms, built into the portal (see below) |
| **🛠 Simulators** | Opens the LSH Training Portal's shared **Call Simulator** (Case Management pack: 27 calls on the John Doe file), **Email Workspace** (a practice inbox to triage and file), **Email Replies** (John Doe correspondence, answered on the portal or from the trainee's own inbox) and **Calendaring** (see below) |
| **🗂 5-Day Legal Case Management Flow** (the course) | One file, *John Doe v. Robert Smith* (Atty. Elijah Thorne; $10k BI / $20k Host UM / $10k Relative UM; a 14-day treatment gap), from intake to the close. **Five modules, one a day, every one Lectures → Practice → Knowledge Check, inside four hours and a balanced deck:** Day 1 **Intake, Claims & Property Damage** (the Case Manager's introduction first, then the client, Meet Your Case (its slides name where each fact is found, not the fact: trainees read the Police Report and the records in the CMS to learn where John Doe sat and how long the gap ran), then **Fact Sharing vs. Legal Advice: the UPL Line** (`d1m1-upl`: share facts and the process, never value, strategy, settlement or what a fact like the gap does to the claim; hear it, log it, route it to Atty. Thorne the same day), then the lessons proper: the raw file, the acceptance decision, Property Damage, and opening the file in the CMS); Day 2 **Claim Set Up & Treatment**: Claim Set Up first (CMS case file setup → draft the LORs and notices in LOR Drafting → transmit and log them → receive the carriers' claim correspondence, then the Case Strategy and the Case Plan), then the Treatment Phase with Client Communications, opening on **Coverages & the Payer-First Principle** (`d2m1-cov`: every policy on the file, whose it is and what it pays, which three are the $40,000 Recovery Stack, and why each Medical Bill goes to PIP first, the Health Plan next and a Letter of Protection last), then LOPs and **Explanation of Benefits (EOB) & PIP** (`d2m2-eob`: reading Peach State's EOB line by line with its CO-45 and AC1 remarks, catching Crescent's $1,540.00 balance bill of the write-off, a plan's lien starting at what it paid, and Harbor Point's PIP payment history to exhaustion on 06/26/2026), Health Subrogation, the Payer Order and the Regulatory Triple-Check (taught here, where the bills and liens arrive, not at set-up), treatment monitoring and the No Contact Protocol; Day 3 **Pre-Demand Audit, the Demand & Settlement Negotiation**, opening on the 14-Day Gap (interviewing John Doe inside the UPL line and the gap doctrine: the only gap explanation that holds up against adjusters is John Doe's own factual explanation, supported by verifiable written documentation such as work schedules, doctor availability notes, travel logs or illness records; the Case Manager records it in the **Gap Explanation Record** without interpreting, defending or judging what it does to claim value), then the audit, the demand and the settlement negotiation; Day 4 **Reductions, Lien Negotiation & ADR**: Track A is brought to a close (the liens reduced, the file disbursed), then the alternative dispute resolution side of Track B, opening on **UM/UIM Coverage Disputes** (`d4m2-um`, with its Skill Activity `d4m2-a3`: a UM claim is a first-party claim against John Doe's own coverage, not a third-party claim against Robert Smith's carrier, so an impasse is not simply taken to court — the three-step dispute flow (UM Demand Package → impasse → resolution route) and the route read off the governing state law and each layer's own clause, Harbor Point's binding arbitration clause against a civil suit where that clause does not bind, with an Insurance Bad Faith action kept off the fork as a separate suit above the policy limit and reserved to Atty. Thorne; his own Bluewater Auto policy is no route at all, its UM/UIM rejected in writing 03/14/2024), then mediation and arbitration, their hard dates and the UPL line at hearings, and the binders; Day 5 **Litigation & Dropped Cases**: Track B's litigation (the fork, bottlenecks, pleadings and discovery, the Property Damage dispute, the deposition, comparative negligence and the skip-trace), taught as condensed overviews (`brief` lessons; the fork and the deposition `compact`), ending in the award's disbursement, and a dropped practice matter closed out. **A balanced deck:** every day stays within 100 slides and within half to one and a half times the median day (`curriculum.cjs --check` prints and enforces the counts, today 65 / 90 / 89 / 82 / 90); a heavy day condenses its blocks instead of carrying more slides: a `compact` lesson keeps its full discussion time on fewer slides (Why It Matters, The Roadmap, one Theory slide, The Rules, On the Job) and a `compact` Skill Activity has no See It slide (the worked model stays in 📖 Full text); every block keeps its full scripts in the JSON, so it can be taught in full again. Every block is Tell Them / Show Them / Let Them, every practice is done on John Doe's file in the CMS, and each module (the unit of scoring) has its Knowledge Check, Self-Summary & Skill Scale (AI-reviewed) and a 60% automated / 40% trainer rubric. **It is the whole program**: its five days are the engine's `DAYS` (`index.html` has `const DAYS = [];` and `js/cm-case-flow.js` fills it, ids 11–15, each shown as "Case Flow Day 1–5"), so they are the dashboard's day cards, banner circles, stats and certificate; the Case File is its client profile; the Admin page's Trainee Audit, progress and Day-by-Day Feedback follow its days. A saved place or a link to any other day id goes to the dashboard; older progress records stay in storage but are not shown or counted. 🧪 Practice is the Case Flow's 46 Skill Activities, a page per day (a tab for each, opening on the trainee's current day), step by step in the order the work happens (each with its tool, its expected output and its documents, opening straight on its slide). The Trainee blueprint (`js/blueprint-content.js`, /blueprint.pdf) describes the Case Flow. **The Case File fills in as the trainee works the file.** Its header is one card (the page title, the client, matter and lead counsel, and the buttons), and The Case So Far runs top to bottom (a dot, the date, what happened), with the two workstreams side by side. A new trainee sees only who the client is (name, matter, lead counsel): no summary, no locked previews, nothing to work out given away. Each section opens once the Skill Activity that establishes it is done (`after` in `profile` in the data file; `curriculum.cjs --check` requires it to be an activity, and nothing opens before the first one), and the timeline shows only what has happened by the newest date on the file they've opened, in their workstream and track, with one "you are here". How far they got on each block is kept on their record (`reached`), so it follows them across devices; trainers see the whole file. **Each day is one module, taught as Lectures → Practice → Knowledge Check:** its lessons back to back, then its Skill Activities in the order the work happens on the file, then its Knowledge Check. The order is `sequence` in the data file (each day's module, its blocks and each block's heading); `curriculum.cjs --check` holds every day to one module, Day 1 to its opening order and every day to four hours; the modules stay the units of scoring, so a block keeps its id, rubric, documents and saved work wherever it is taught, and each document opens on the first day an activity works from it. Every Knowledge Check question has an answer box: answers save as they're typed, are required before *Submit for review*, go to the AI reviewer with the Self-Summary, and show on the trainer's panel. **A realistic simulation of the Case Manager's participation on the case.** Each Skill Activity opens on what just landed on John Doe's file (an email, a call, a letter, a CMS alert, dated on the case's own timeline; its attachments are the document thumbnails, not repeated on the card), and its documents get the rest of the slide (the case's milestones and "you are here" are on the Case File, not the slide). The case runs on **two parallel workstreams**, Claims & Coverage and Client & Treatment (a module's `workstream` in the sequence, or a block's own in `lanes` on a day that runs both, and a milestone's `lane` in the timeline): the Case File shows the shared file, then the two workstreams side by side, each with its own "you are here", then the shared file again. Every module has live calls ("📞 Take the call" on the Your Task slide): the course's own voiced roleplay plays the client, his mother, the adjuster, a provider's billing office, defense counsel's paralegal or Atty. Thorne, on John Doe v. Robert Smith's facts, then returns to the slide. "Check Your Work" ticks are kept, and a skipped check comes back on a later activity as fallout (an undocketed deadline, an unflagged lien, a missing payoff letter). Content: `build/case-flow/sim/days12.json` and `days345.json`, written to `build/case-flow/sim/SIMSPEC.md` and assembled into `js/cm-case-flow-sim.js` by `build/case-flow/sim/assemble.cjs` (`--check` in CI: an event for every activity, a call in every module, fallout that comes later, the timeline in order). **The tools and simulators connect at every step.** **One Practice Lab slide per module:** the day's tools open from it, once (the CMS and every other platform its Skill Activities use: the Docket System, Medical Records Requests, Court E-Filing, the Net Sheet, LOR Drafting, the Case Documents), and it lists the module's Skill Activities in order (📞 marks a live call; each goes to its slides). It comes just before the first Skill Activity; the activity slides that follow name where each step is done without repeating the buttons, and a live call is taken from its own Your Task (`practiceLab()` in `js/cm-case-flow.js`); the course's own pages (the Action Plan, the Case Documents, the Calendar Conflict Resolver) open with a "← Back" to the same slide. The training platforms open in the course's tool frame, which keeps their session while the trainee moves between slides. Check Your Work logs the reference of the work done in the tool (a CMS Case ID, a docket or request number) on the trainee's record, and the trainer sees it with the module's Learning Check; each trainee has one CMS Case ID, so 🧾 Log Your Work asks for it only once, on their first CMS activity; the Practice page opens each activity's tools. **LOR Drafting** opens on John Doe v. Robert Smith with no case assignment (the 1P letter to Harbor Point and Cardinal State, the 3P letter to Keystone Mutual, from the Declaration Pages) and is the Claim Set Up step's tool (`d2m1-a1`, Generating Formal LORs); a trainer can still assign one of the 18 practice cases instead. The other Drafting Tools (HIPAA, Med Provider) stay standalone exercises on their own assigned cases. `TOOLKIT` in `js/cm-case-flow.js` maps the tool names the content uses to what opens, and `WORKED_IN` adds the records, docket and court-filing platforms at the steps where that work happens: **ChartSwap** (the Medical Records Requests platform) for the records and itemized bills behind treatment, specials, liens and discovery, the **Docket System** for every court date the litigation track sets, and **Court E-Filing** for the complaint, the First Amended Complaint and alternative service. **The LSH Net Sheet, in the course** (`net-sheet.html`, `js/cm-net-sheet.js`): the firm's own template (`documents/templates/LSH_Net_Sheet_v2_FIXED.xlsx`) with its four sections, rows and formulas, filled from its John Doe v. Robert Smith practice tab. It is where the money is worked and nowhere else: every block of Day 4's **Settlement Negotiations**, **Lien Negotiations & Reduction** and **Disbursement & Closing a Case** (Track A, settled before suit), and of its **Case Won: Award & Disbursement** (Track B), carries 📊 Net Sheet, which opens it beside the slide at that phase's stage. The trainee types in the yellow cells, the template's formulas do the rest, and **Check my sheet** tests it against the file: the gross and 33⅓% fee; the audited ($7,965.00) and reduced ($5,820.00) liens; Track A's net $20,359.92 (catching a 33.33% fee for 33⅓%); and Track B's net $14,713.75 at the 40% tier (catching 33⅓% carried into a litigated file). Each track is its own sheet, kept on the trainee's record (`net-sheet`, a personal key, so it syncs and the trainer sees each stage's check with its module), and it downloads as an .xlsx with the formulas, for Excel or Google Sheets. **Track B now ends in a disbursement:** Day 5's fifth module (`d5m5`) has the 07/06/2027 arbitration award (Harbor Point $20,000 + Cardinal State $10,000, with Keystone's $10,000 from mediation), the liens reduced at the fee actually charged, and John Doe's call about the $14,713.75 (`curriculum/5-day-flow/case-file.md` §4). **Dual screen.** A step's tool and the case documents open *side by side* with the slide (⧉ Side by side in the tool's bar; drag the orange edge to resize): the slide, its steps and the Next button keep working on the left while the trainee works the CMS, the Docket System or a document on the right, and the top bar is never covered. **🖥 Second screen** opens the tool or document in its own window, placed on the trainee's other monitor when the browser can tell where it is (the Window Management API, once allowed), else beside this one. Under 900 px wide the tool takes the page as before. The choice is remembered on the device; Ctrl/⌘-click still opens a document in a new tab. **A voicemail is heard, not read.** A voicemail on the file (`spoken` and `listen` on the event, `build/case-flow/sim/SIMSPEC.md`) plays like a voicemail box (the system voice with the time and caller ID, the beep, then the caller in their own voice over line hiss, through the browser's speech voices); the slide shows only what a phone shows, and the trainee takes the message down in the 🎧 Listening Check, checks it against what was said (John calls from his work line but asks for a call back on his cell), and only then sees the transcript. The check needs at least one play; plays and the check are kept on the record and shown to the trainer. A browser that can't speak (no speech engine, or no English voice) shows the trainee the steps to turn speech on for their device (Windows, Mac, ChromeOS, Linux, iPhone, Android) and a "try again"; the transcript stays closed until they've listened. **The case's dates stay current** (`js/cm-case-dates.js`): written in 2026, the case rolls forward by whole weeks to the trainee's case year, so in 2029 the collision is Fri 02/02/2029 and the SOL Sun 02/02/2031. Weekdays, weekend roll-forwards, business-day counts, holidays and the two-year SOL stay exact; to keep the SOL exact the case only moves to years where DOL + 2 years doesn't cross a 02/29 (2026, 2029, 2030, 2033, 2034, …). A trainee keeps the case year they started on (`caseYear` on their record) until they finish; every case document opens in `case-doc.html`, in the page beside the slide and never as a download, with the trainee's year's dates (print or save as PDF there; RS03 also offers an editable Word copy, on its own button), from the HTML sources in `documents/case-flow/html/`; trainers preview a year with `?caseYear=2029`. `.github/scripts/check-case-dates.mjs` (CI) proves it across future years. **Slides are executed like the original Case Management Canva decks**, as one card: the slide's design sits directly on the lesson stage (no second card inside it), so the slide has the stage's whole width and the deck's orange corner is the stage's own, clear of the dots and buttons, and the slide's top row (the dots, the kicker, the 🛠 tools and 📖 Full text) is one aligned line. A navy slide with the LSH logo and the outlined phase title (a lesson shows its part of the module, "Intake" or "Claim Set Up"; an activity its step, "Skill Building: Draft, Transmit & Log the LORs"), the topic on a full-width bar under it (in capitals and quotes, on a lighter navy with an orange rule), content on white orange-bordered cards, centred on a lesson slide; each day opens on its Training Agenda (the module's lecture parts, its Practice and its Knowledge Check, with their minutes); and each Skill Activity opens like the deck's Skill Building slide, with the case documents it works from (up to four first-page thumbnails in one row, `decks/cf-docs/`, rendered 600 px wide so they stay legible and drawn as large as the screen allows; each opens the document beside the slide) and the situation. A module's name is its `title` in the sequence; each block's heading is in `headings`. A `brief` lesson (Day 5's condensed litigation) is three slides: Why It Matters, The Rules and On the Job. **Slides: one idea per slide, in big type.** Each block is a short run of slides — a lesson is Why It Matters (a one-line hook beside an illustration) · **The Theory** (the original Canva decks' definitions, frameworks and principles for the topic, as concept cards; a deep topic, the coverages and the treatment phase with the Standard Treatment Map and MMI, takes a second slide, The Theory, Continued; `build/case-flow/slides/theory-dN.json`, validated by the assembler: limits, highlights, real deck pages, never a page showing another case's facts) · **The Framework** (each deck page's own table, flowchart or checklist, such as the Standard Treatment Map, the Payer Order, the A-C-T protocol, the binders and the lien tiers, extracted and rebuilt in the course's own design; `framework` in `theory-dN.json`; the slides never show the decks' page images) · The Rules (3–4 numbered points, the UPL boundary boxed) · See It · On the Job (Trigger ➔ Task ➔ Tool ➔ Checkpoint) · **3 Clues, 1 Rule** (the Do & Don't as a game, adapted from Foundational Training's "3 Clues, 1 Claim": each round hides one of the lesson's Dos or Don'ts behind three clues revealed one at a time; the class calls ✅ Do or ⚠️ Don't and names the rule, and a right call scores 3, 2 or 1 by the clues used; the rounds are mixed in a fixed order per lesson, and 📋 and the game's end show the full list; the clues are `build/case-flow/slides/clues-d1.json`–`clues-d5.json`, merged by the assembler, which requires 3 per item, 5–14 words each, no highlight, no verdict words and never the rule's key words); a Skill Activity is Your Case · Your Task (steps, where each is done, its documents, what to deliver) · See It · Check Your Work (a tick list); the Learning Checks are not slides: **each module's Learning Check (its 3 written questions, Self-Summary and Skill Scale) is on the day's Knowledge Check page**, step ② after the quiz (step ①). The page fits one screen: a compact header (← Lessons, 📑 Lessons in a new tab), a tab per module instead of an accordion, the questions on the left and the Self-Summary & Skill Scale on the right, scaled down to fit; and **the quiz is a game show**, a different one each day and only that day's: 💼 Who Wants to Be a Case Manager? on Day 1 (climb seven career ranks, Trainee to Lead Case Manager, with a 30-second clock, 50:50 and Ask the Audience), 🟦 Jeopardy on Day 2 (a compact board, the day's questions in columns of five headed by their module, × point values, a Daily Double), 💣 Countdown Bomb on Day 3 (a fuse; answer before 💥 for the time bonus), 🎡 Wheel of Fortune on Day 4 (spin for a multiplier) and 🚪 Mystery Doors on Day 5 (pick a door for its reward). A pick locks in and shows at once whether it was right, never which option is (the answer key still waits for a pass), and no clock ever forces an answer. The rewards are a Case Manager's, not a prize fund: points, a streak, sound cues (🔇 to mute), badges (Perfect Run, On Fire, Quick Draw, Comeback, No Lifelines, Bomb Squad), the career rank, and **🤝 Ask a Friend tokens**: one for every 5 right answers (up to 3 a round), banked on Submit (`friendTokens` on the record) and spent in a later round on a hint from the AI colleague, who names the principle or the fact on the file that decides the question, never the answer (a reply that gives it away is replaced by a pointer to the module's lesson). The best score is kept on the record. One Submit scores the quiz and sends every module to the AI reviewer against its rubric automatically (no separate "Submit for review"; a module is re-reviewed only when its answers changed). The results fit one screen: the score, the next step, each module's Automated / Trainer / Composite, the buttons and the attempt history. **The 4-hour day:** every topic (lesson) gets a 15–20 minute discussion (a condensed one 4), the day's Skill Activities about 10 minutes each (30–60 in all), the Knowledge Check 10–15 minutes (longer the more topics the day has), and 20 minutes stay free for the welcome, a break and the close; `curriculum.cjs --check` fails a day over 240 minutes, and every day's Knowledge Check asks 20 questions (a day with more takes them in turn from each module it checks); the day's Training Agenda lists the module's lecture parts, its Practice and its Knowledge Check with their minutes, and each lesson and activity slide carries its minutes as a chip that starts a countdown (`daySchedule()` in `js/cm-case-flow.js`). The key phrase of each line is highlighted, headings are in Title Case, and "📖 Full text" (and Presenter view) keep the whole block one tap away. The slide copy is a distillation of the block, written to `build/case-flow/slides/SLIDESPEC.md` in `build/case-flow/slides/dN.json` and assembled into `js/cm-case-flow-slides.js` (`node build/case-flow/slides/assemble.cjs`; `--check` validates the limits and that the file is in step, in CI); the 38 illustrations are inline SVGs in `js/cm-case-flow-art.js`. Content: `js/cm-case-flow-data.js` (the source of truth); wiring: `js/cm-case-flow.js`; the per-block curriculum spec, the architecture and the map of every topic of the earlier course (`build/day1.js`–`day5.js`, kept only as the source the lessons cite, never served): `curriculum/5-day-flow/` (`node build/case-flow/curriculum.cjs` regenerates them, and `--check` validates them in CI; nothing there is shown in the program). |

### Trainer tools (from the EA/PA portal)

The CM course has the same trainer features as the EA/PA portal. They live in `js/cm-updates.js`, a CM copy of EA/PA's `js/eapa-updates.js` with the EA/PA-only exercises left out and the text adapted.

- **SOP Reference** (Admin → SOP Reference):
  - **🧭 Program flow:** kick-off, the daily rhythm, between sessions, program close, an "I want to… → go here" map and the 5 days at a glance.
  - **For each day:** a timed **Run of show** (Do / Say / Watch for; printable), the day's Training Agenda as the trainer runs it: before trainees join, the welcome, the module's lectures part by part (minutes from the slides' chips), then its Practice with the live calls, a break and the end-of-day discussion when the agenda's spare minutes allow, the day's Knowledge Check game and the close, inside the 4-hour day. The **Say** lines are spoken, in the trainer's voice (`sopRunOfShow` in `js/cm-case-flow.js`).
  - **Detailed script:** follows the run of show, with a **🎤 Present** mode for the room.
  - The SOP is generated from the lessons, so it stays in step with Content Studio edits.
- **🖥 Presenter view:** share only the slides in Google Meet while the trainer reads a script for each slide, written as the trainer speaks it: first person to the room, the slide's points woven together with John Doe v. Robert Smith's facts, then one question for the room. Every slide of every Case Flow block (528) has its own script in `build/case-flow/scripts/dN.json`, written to `build/case-flow/scripts/SCRIPTSPEC.md` and assembled into `js/cm-case-flow-scripts.js` by `node build/case-flow/scripts/assemble.cjs` (`--check` in CI: every slide covered, 45–150 words, no lists, labels, arrows or stage directions, one question at most); the case's dates roll forward in them like the slides'. `js/cm-case-flow.js` puts them in `window.SLIDE_SCRIPTS["<day>::<topic title>"].p1` … `.pN`, falling back to a script built from the block's notes for a slide without one. **Admin → Trainer Cues** lists every block's slides by module, each under its slide's name, and the day's **Speaker Notes PDF** prints them all. The shared slides window never flickers: slides and pages cut straight in (no slide-in or fade animation), the slide on screen isn't drawn again when the console re-draws, and the window never reloads itself for a new version mid-class. The console's **Update now** banner is there instead; after updating, press ↗ Re-open slides window.
- **Next into the Action Plan Editor:** on the last slide of a Skill Activity worked in the Action Plan Editor (the Live Case Plan Draft, the warning letter, the BI and UM demands, the litigation memo, the ADR matrix, the trial-prep checklist), Next opens the editor, where **Next: …** (bottom right) carries on to the next activity, or to the Knowledge Check at the day's end; ← Back returns to the slide. In Presenter view the console does this on the day's last slide (it ends the presentation, since the day's slides are done); when the last slide has no draft, Next there goes on to the Knowledge Check instead (`planStop` in `js/cm-case-flow.js`).
- **👁 Trainee view:** an admin switches to the trainee experience (every day unlocked) and back without signing out.
- **🏠 Main Portal (admins):** while an admin is signed in, the top bar has **🏠 Main Portal** and the Admin screen has **← Back to Main Portal** (next to Log out). Both open the LSH Training Portal's Training Directory (`https://cm-training-activity.pages.dev/programs.html`), where admins open each program. Trainees and the 👁 Trainee view don't show them. It's `js/portal-link.js`, the same file in every LSH course repo (EA-PA-TRAINING, Case-Management-Training, propertydamageclaimstraining, Foundational-Training); change it in all of them.
- **🧭 The top bar, organized (every course):** buttons that do the same kind of thing share one menu, the way the Training Portal keeps everything else under ⚙ System Management. **📁 Case File** is one tab for the Case File (or Claim File), 📁 Documents and 🗂 Workspace, which share a row of tabs at the top of their pages; **📚 Guides ▾** holds Notes, Handouts, 🧭 Orientation, Facilitator Guide and the Platform Blueprint (whichever the page has); **📋 My Sheets ▾** holds the Task Tracker and Monitoring Sheet; **⛶ View ▾** holds ⧉ Open in a new tab and ⛶ Full screen. A menu is made only when two or more of its buttons are on the bar. It's `js/lsh-topbar.js`, loaded last, the same file in every LSH course repo; change it in all of them.
- **Every page on one screen:** the window never scrolls. The top bar and the footer line keep their place, and the page's body takes the height between them, so a page is always exactly one screen tall and nothing jumps as you move between pages. A page with more in it than fits — Case Documents, 🧪 Practice, the Training Tools, a handout, the Facilitator Guide — scrolls inside its body, and the lesson pages don't scroll at all: the slide is sized to the room left above the footer line (`fitSlideFrame` in `js/cm-updates.js`), so the slide and its Previous / Next bar always end on the screen. The layout is `js/lsh-one-screen.js`, which also points the page's own `window.scrollTo()` and `window.scrollY` at the page body, so every caller keeps working. Under 1001 x 480 (a phone, a tiny window) the page scrolls as it always did. New in this course: copy the file, and the footer line in `fitSlideFrame`, into the other LSH course repos to give them the same layout.
- **Every slide on one screen:** each slide shows whole on one screen, on the lesson page, in full screen and in the shared slides window: the frame takes the room left on the screen, and a slide too long for it is scaled to fit (down to half size), instead of continuing on a second page (`fitSlideZoom` / `paginateLessonSlide` in `js/cm-updates.js`). Only a slide that would have to shrink further still splits.
- **Other features:** standard-size centred slides and the task log with archiving.
- **Knowledge Check from full screen:** **Continue to Knowledge Check** on a day's last slide leaves full screen (⛶ Full screen / Present full screen) first and then opens the Knowledge Check, on every day. Before, in full screen it only redrew the slide, so the button seemed to do nothing.

`index.html` is generated from the EA/PA portal's `index.html` (EA-PA-TRAINING, last built from its `main` after #19 plus the new-tab fix) by `build/build.py`, and `js/cm-updates.js` is a CM copy of EA/PA's `js/eapa-updates.js`. When EA/PA ships new portal features, rebuild so the CM course picks them up:

```
python3 build/build.py ../EA-PA-TRAINING/index.html
```

The script applies the CM edits to the EA/PA page and inserts the CM content from `build/` (the `cm_*.js` files for the case file, calendar, roleplays and the practice tool). `DAYS` is left empty (`const DAYS = [];`) for `js/cm-case-flow.js` to fill; `build/day1.js`–`day5.js` are not inserted. Every edit checks that its anchor exists, so it stops with an error if EA/PA changed that part; update the anchor in `build.py` and run it again. Carry new features from `js/eapa-updates.js` into `js/cm-updates.js` by hand.

- **🧭 Orientation and the Blueprints:** Orientation has two tabs.
  - **No blueprint opens inside this portal.** Every blueprint is read on the **Main Portal's 🧭 Blueprint page**; the old `#/blueprint` and `#/orientation` addresses forward there, and the top bar carries neither. `/blueprint.pdf` (in trainees' Handouts) is still built here, from this course's trainee slides (`trainee` in `js/blueprint-content.js`) through `LSHBlueprint.doc('trainee')` — the standard navy cover, numbered contents and points / where / tip layout, as real text — for the Portal's Blueprint page to link to.
    - **It republishes itself after every deploy.** The published copy is matched against `APP_BUILD` and the Worker's deployment id (`/version`). The first admin page open after a deploy rebuilds it.
  - **🛠 Trainer blueprint** (admins only, never at a public address): a cover and 12 slides on running the course. It covers signing in, the Trainee Audit, day feedback, surprise tasks, the Case File and the 40% trainer assessment, the documents' 🔑 audit key, Practice and the simulators, SOP Reference, Presenter view, Batch Folders, Rankings and Content Studio, Activities and the feedback style, Attendance and Trainee view.
    - **⬇ Download PDF:** a landscape PDF, one page per slide, stamped with the build and the deployment.
    - **Numbering:** the cover is the Cover (★), then slides 1 to 12, the same everywhere: the contents buttons, the counter under the slides ("Cover · 12 slides", then "1 / 12" to "12 / 12"), each slide's header and footer, and the PDF's page footers.
    - **Files:** the slides are in `js/blueprint-content.js`. `js/lsh-blueprint.js` is the same file on every LSH platform, and `js/lsh-blueprint-course.js` is the same on every LSH course: copy them from EA-PA-TRAINING when they change there.
    - **Test:** `.github/scripts/blueprint.cjs`.

### One tools access per session on the Practice page

This is the 🧪 **Practice page**, not the Practice Lab slide in the deck (that one is above: one slide
per module, which the day's tools open from). The same rule, on the other surface.

🧪 Practice lists each day's Skill Activities. Every activity row used to carry its own row of tool
buttons, which on a single day was the same two or three platforms repeated down the page (Day 3 showed
19 of them), and opening one from the wrong row took the trainee to the wrong step.

The day now offers its tools **once**, in a **🛠 Tools for this session** row at the top of the day: each
distinct platform the day's activities are worked in, once, each opening on the **first activity of that
day worked in it**. Every activity row still names the tool it is worked in, in words, and still has its
**Open** button for the activity itself. A locked day offers no tools. The per-step buttons stay where
they belong — on the activity's own slide, in its 🛠 Where box — so a step still opens exactly the tool
that step needs.

`.github/scripts/practice-tools.cjs` (CI) checks every day: one row, each tool in it once, every tool the
day's activities use and nothing else, each opening on the day's first activity worked in it, no tool
buttons left on the activity rows, and nothing offered on a locked day.

### The admin side is not the trainee's

A signed-in trainee is never offered an admin log-in, an admin view, or a trainer's notes: they see
their own record and nothing else. This is now a **rule**, `traineeSide()` in `index.html` (a trainee is
signed in and isn't an admin), not a configuration:

- the 🛡 **Admin** button is off the top bar — `index.html`'s copy by this rule, and the course's own
  (`js/cm-updates.js`) because it now shows the button to admins only — and so is **🛡 Sign In as
  Trainer** on the Facilitator Guide;
- `openAdmin()` does nothing for them, so the admin password box can't be reached;
- `goto('admin')` lands them on their **own dashboard**. It used to show "Admin access required — use
  the Admin button to sign in", which is an admin log-in on the trainee side;
- the Facilitator Guide isn't in their navigation, and speaker notes, scripts and answer keys stay in
  Presenter view and the Speaker Notes PDF as before.

**Why a rule and not a setting.** The buttons used to be hidden on `state.portalOnly`, which comes from
`/api/auth/status` — so a trainee whose status call didn't land (offline, or the account's daily request
limit) was shown the 🛡 Admin button and its password box. An admin is signed in as an admin and never
as a trainee, so nothing changes for them; neither does the log-in screen, which still offers an admin
their way in.

Trainees see **their own** score and no one else's (there is no cohort leaderboard): 👁 Review Score on a
day they've passed, their score on the day card, and 🎯 Focus. Score cards across programs are consolidated on the Main Portal, whose
`/progress.html` is admin-only both in the page and on the server (`requireSession(..., {adminOnly:
true})`).

`.github/scripts/trainee-side.cjs` (CI) signs in as a trainee **with `portalOnly` false** — the case this
guards — and checks every one of their pages for an admin or trainer sign-in, that `openAdmin()` opens
no box, that the admin view sends them to their dashboard without inviting a sign-in, that the
Facilitator Guide isn't in their navigation, and that their own score is theirs to see; then that an
admin still has the button and the view.

### Practice at negotiating and communicating, by the need

A Case Manager's day is negotiating and communicating in writing, so each activity that is practice at
one of those opens the **Email Replies** scenario for that need — the adjuster, the lienholder, the
provider's billing desk, the client, the attorney — instead of a list of eleven to pick from. The
mapping is `EMAIL_NEED` in `js/cm-case-flow.js`, keyed by block id; a block listed there is also offered
Email Replies among its tools, and a block that isn't listed is unaffected.

| Need | Activities | Opens |
| --- | --- | --- |
| Negotiating | the BI time-limit demand, MRI against the 14-day gap, diminished value | the adjuster's reply |
| | statutory lien reduction | the hospital's $45,000 lien notice |
| | provider balance negotiation, transmitting LOPs | the provider's balance question |
| | pleadings and discovery | opposing counsel's extension request |
| Communicating | multi-channel outreach | a prospective client's inquiry |
| | onboarding directions | what a spouse may be told |
| | the A-C-T crisis protocol, probing the treatment gap | the client whose bills keep coming |
| | the gap justification record | a records request refused |
| | the pre-demand strategy session | the attorney's "where are we?" |
| | closing the gross recovery | the client's "where is my money" |
| | release and disbursement | fraudulent wire instructions |

**Which scenario belongs to which activity is a curriculum decision**, so the table is meant to be
edited in `EMAIL_NEED` as the Case Flow changes; a scenario is reused where the need is the same skill.
The ✉ Email Workspace, separately, opens the inbox the trainee's program starts on (`inbox=1`).

Both need the Training Portal's side of it (`simulators/email-replies.html` reads `?email=`,
`simulators/email.js` reads `?inbox=`); without it the parameters are simply ignored and the trainee
gets the list as before. `.github/scripts/practice-tools.cjs` (CI) checks that every activity named
still exists in the Case Flow, that every scenario named is one the Portal serves, that a named activity
is offered Email Replies and opens it on its own scenario, and that an activity with no entry is
untouched.

### The Knowledge Check doesn't flicker

The Knowledge Check is repainted on every answer, every pick and every move between questions. It used
to write the whole page back with `innerHTML`, which threw away and rebuilt every node each time: the
page visibly flickered. It showed worst on **Day 3**, whose Countdown Bomb repaints while a CSS fuse
animation is running and whose rebuilt page is measured and scaled again by `kcFit`.

The page is still built exactly as before and then **morphed** in (`paintInto` in `js/cm-case-flow.js`):
a node whose markup hasn't changed is left alone, and only what really differs is written. The result is
the DOM `innerHTML` would have produced — the morph replaces a node whenever it can't patch it — so no
game mode's markup has to be known there, and nothing flickers because almost nothing is touched. A live
`<select>`, `<input>` or `<textarea>` keeps what the trainee has typed or chosen, and the bomb's fuse
keeps its own `animation-delay` while it is running (that delay is worked out from the clock on every
render, so writing it back would restart the animation).

**One other thing this fixed.** A game's timers hold the day they were started on (the bomb's 20-second
fuse, the wheel's 2.5-second spin), so one left running while the trainee opened another day painted
*that* day's quiz over the new one — a Countdown Bomb fuse turning up on Day 4. `gamePaint` now paints
only the day that is open.

`.github/scripts/kc-morph.cjs` (CI) plays every day, so every game mode (millionaire, jeopardy, bomb,
wheel, doors): the morphed page is exactly what `innerHTML` would have produced, the card, question and
unpicked options are the same nodes after an answer, the answer still lands, and the bomb's running fuse
survives with its delay intact. Against the old `innerHTML` it fails on exactly the Day 3 symptom.

### Day cards say where the trainee is

A day card's button is the trainee's next step, from their own record:

| Their record | The card says |
| --- | --- |
| Nothing yet | **Start** |
| Slides worked, or a Knowledge Check taken | **Continue**, with how far the slides got and the Knowledge Check score beside the **70% to pass** |
| Passed (70%) | **Review** · "Completed" |

`moduleCard` in `index.html` draws Start and Review; the wrapper in `js/cm-updates.js` rewrites a day
that is started but not passed as **Continue** and adds the progress line.

**A Knowledge Check under the pass mark is recorded.** 70% is what marks a day complete — so 13 of 20
(65%) does not — but the attempt is kept either way: `progress[day].score` is the best of every attempt
and `.history` holds them all, and a worse retake never lowers the best. The card showing only "Start"
with nothing about the score is what read as the day not having been recorded at all. 🎯 Focus still
lists any day under 70%.

`.github/scripts/day-progress.cjs` (CI) checks each state of a day, and that a failing attempt is kept
and never lowers the best score.

### 📂 Case File

The Case File page is the Case Flow's John Doe v. Robert Smith profile (`CLIENT_PROFILE_DOC` in `build/cm_casefile.js`, from `CM_CASE_FLOW.case` and `.profile`), which is also the case dossier inside every AI prompt. How it fills in and what trainers see: above, and under *Training Tools hub*.

### ✅ Check Your Work, Full text and the Action Plan
- **Check Your Work** holds the activity's answers (the highlighted parts). A trainee sees each answer as a blank until they finish the activity and press **✓ I've finished: show the answers** (saved as `revealed` on their Case Flow record); the trainer always sees them, except on the shared slides window, which shows what trainees see. The **📖 Full text** checkpoints follow the same rule.
- **📖 Full text** opens in its own browser tab, so the slides and the tool beside them stay in view (the old pop-up only when the browser blocks the tab). It carries no tool buttons: the day's tools open once, from its **🧪 Practice Lab** slide, which also opens the Call Simulator when the day has a live call.
- **Knowledge Check bonus round:** one key takeaway for the whole day, graded with the day's last Knowledge Check block.
- **The Action Plan** starts as a fill-in template (situation, goal and deadline, action items with owner, due date and tool, risks, UPL check, who is told, follow-up); **📝 Use the template** adds it again.
- **Lessons before practice:** `build/case-flow/curriculum.cjs` fails if a lesson comes after the Practice Lab has opened in a phase, or if a Skill Activity has no lesson of its module (or of its `prereq` list) before it in teaching order.
- **Readiness gate:** the Practice Lab slide opens with three key-concept questions, one from each of the day's first three modules (their Knowledge Check pools). A trainee answers each correctly to open the day's tools; a wrong answer shows the reason and can be tried again. Trainers and the shared slides window skip it (`labGate` in `js/cm-case-flow.js`).
- **John Doe is a passenger and owns no car.** The parked 2019 Honda Civic is his mother Margaret Doe's, on her Bluewater policy (UM rejected by her). The Civic's Property Damage claim and rental are hers: the firm assists her under a separate PD-only engagement, and John's complaint, discovery, settlement papers and demands carry no property damage. `build/case-flow/documents/audit.cjs` fails any document that gives John the Civic or a PD or rental claim. Day 1's *Whose Rental Is It?* activity (d1m3-a3) has the trainee prove it from the records.
- **Drafts for QC, not blank pages:** when the pre-demand audit closes, Atty. Thorne assigns the drafting to the firm's desks (RS64, CMS Task Log 07/15/2026) and every draft comes back to the CM for QC: the BI demand (RS33), the Host UM and Relative UM demands (RS61), the Mediation Binder (RS62) and the Arbitration Binder (RS63), each with planted errors listed in its manifest key. The BI demand's enclosure set comes back for QC too (RS66, the exhibit packet), and the QC of the demand and of both binders is now worked item by item, with the finished set revealed at the end — 🔍 Exhibit audits, below.
- **PIP:** Riverton is an add-on PIP state ($5,000; 100% of medical, 80% of lost income; no set-off against BI or UM; no reimbursement from the recovery). John owns no car and his household rejected PIP in writing, so he claims PIP as a passenger on the Escape, at Harbor Point: application and acknowledgement RS65 (Day 2 Claim Set Up), payment ledger RS31. The pre-demand audit opens on that ledger: five payments, $5,000.00 exhausted 06/26/2026, the 80% wage benefit never paid, so the full $1,584.00 stays in the Specials. `audit.cjs` fails any document that still calls the coverage MedPay. Day 4 adds *Lien Negotiation Calls* (d3m3-l3): the Reduction Request, the authorized ask and the Payoff Letter.
- **The passenger fact:** `build/case-flow/documents/audit.cjs` fails any document that makes John Doe a driver or operator, or the Escape his, and checks the Police Report keeps him in the front passenger seat.

### 🧪 Practice

The top bar has a single **🧪 Practice** item; 🛠 Simulators, 🧰 Tools, 🔥 Roleplay and the Calendar Conflict Resolver are reached from it (`PRACTICE_SUBVIEWS` in `js/cm-updates.js`). The page is the Case Flow's Skill Activities (see above), with an "Any day" row: 📁 Case Documents, a quick roleplay call, the CMS Training Library and the CMS.

The CMS opens with `?program=cm`, so its Training Library lists the Case Management cases and saved cases are tagged with the program. The link also sends `from=cm` and the trainee's name and batch, so the CMS signs them in with just their name (no CMS account); a CMS opened on its own asks them to register.

### Calendar Conflict Resolver

The one practice tool left beside the Skill Activities (Case Flow Day 4; `js/cm-skillbuilders.js`), opened from the Day 4 slides with a "← Back". Part A resolves the week's overlapping commitments; Part B is the docket briefing for the handling attorney; Part C generates proactive CM tasks; Part D, **Hard-Code the Scheduling Order Dates**, has the trainee read the Court's Scheduling Order (RS55) and enter its six deadlines, checked in the trainee's case year (`js/cm-case-dates.js`), then put them on the Docket System. Auto-graded parts check the answers against keys drawn from the documents. The written parts use the same 100-point AI rubric as the EA/PA portal; their button is **Review** (it shows "Reviewing…" while the reviewer works). Every button that sends written work to the reviewer says the same thing, the Notes page's included (it said "✨ Get Review", then "✨ Get Feedback" once a review came back); `build/build.py` renames the Notes one, so a rebuild from the EA/PA page keeps it.

### Case documents

**📅 The dates follow the CMS's Date of Loss (`js/cm-case-dates.js`).** The case documents and the course roll to the trainee's case year, and on top of that they follow John Doe's Date of Loss in the CMS, the same way the CMS's own date updater moves the SOL (the CMS's `case-dates.js`). When the trainee's John Doe case in the CMS has another DOL, every date on or after it in the course and the documents moves by the same number of days: the SOL, visits, letters, deadlines. Dates of birth and earlier dates stay, and a weekday name in the text is not changed (as in the CMS).
- **Where the DOL comes from:** the CMS's course bridge already tells the course which case is open; it now also sends that case's DOL (`dol`, MM/DD/YYYY; the CMS's `course-bridge.js`). Only a case whose client is John Doe counts (`followCmsDol` in `js/cm-case-flow.js`).
- **Kept:** on the trainee's Case Flow record (`dolOffset` in days, `dolYear`, `dolFrom` = the CMS DOL) and on this device (`lsh_case-dol`), for the year it was taken in. A page built with another offset reloads once on the record's. A case document gets it as `case-doc.html?…&dol=N`.
- **The trainee sees it** on 📂 Case File: "Dates follow your CMS Date of Loss (moved +N days)", with **Reset to the course's dates** (that CMS DOL is then not followed again until it changes). A new CMS DOL shows a toast and **Update the dates now**.
- A trainer's case-year preview (`?caseYear=`) shows the course's own dates, with no offset. `check-case-dates.mjs` checks the offset: DOL-and-later dates move by exactly N days, earlier dates and DOBs don't.

**John Doe v. Robert Smith (the Case Flow's document set, `documents/case-flow/`).** 70 simulated documents, `RS01`–`RS70`, in nine folders: intake & retainer, police / witness / video, medical records, bills, insurance and the demands, liens, wages & costs, the Civic's property damage, and the Track B lawsuit and ADR. Every page carries the *SIMULATED DOCUMENT — FICTIONAL PARTIES* footer.
- **What trainees see:** the 📁 Documents page lists them by folder with the CMS upload category; each opens with its Case Flow day (trainers see all), and every Case Flow Skill Activity names the documents it works from ("📁 Work from" on its slide).
- **Planted discrepancies:** a transposed police report number on the intake sheet, "Driver" and a wrong DOB in the CMS record, a duplicate ledger line, a wrong date of injury on the MRI report, an in-network provider billing the patient, a draft demand with four errors, releases that reach too far, a discovery deadline and a brief date that are wrong, and the Demand Package's own exhibit packet built to be audited (`RS66`), with ten faults in the enclosure set. The three finished sets the audits reveal (`RS67`, `RS69`, `RS70`) carry no plants: they are the completed packages the trainee is shown once the audit is handed in. Signed in as admin, each document's red 🔑 note says what is planted and what to catch; trainees never see these notes.
- **Source and rebuild:** `build/case-flow/documents/` — `SPEC.md` (what each document holds and plants, written against `curriculum/5-day-flow/case-file.md`), `src/RSNN.html` (each document), `doc.css`, `render.cjs` (HTML → PDF with headless Chromium; the CMS record also to .docx with LibreOffice) and `audit.cjs` (reads every PDF back and checks the footer, the identifiers, each document's facts and that each plant is where it belongs and nowhere else). Metadata: `js/cm-case-flow-docs.js` (also each activity's documents). CI checks every file exists and every activity's documents are real and open by its day (`.github/scripts/check-data.mjs`).

### 🔍 Exhibit audits, the completed package, and the service confirmation

A Case Manager does not read a document set and leave it in a folder: they audit it before it leaves the office,
and the difference between an audited set and a draft one is money out of the client's pocket. Three Skill
Activities now work the set itself, and each one ends with the finished article.

- **The audit.** The activity's slide **🔍 Audit & the Finished Set** opens a workbench listing every item of the
  draft set, with the call to make on each one — **keep · replace · pull · add · flag for Atty. Thorne** — and a
  note to write. The loophole each item hides is not shown while the audit is open. The three sets: the Demand
  Package's exhibit packet (`d3m1-a1`, 16 items, `RS66`), the Litigation Desk's draft Mediation Binder
  (`d4m3-a1`, 17 items, `RS62`) and its draft Arbitration Binder index (`d4m3-a2`, 17 items, `RS63`). A hand-in
  with an item uncalled is refused.
- **The completed package.** Handed in, the audit is scored, each item says what it would have cost and what the
  fix was, and the finished set is revealed: the **Demand Package as served** (81 pages, Exhibits A–J), the
  **Mediation Binder as delivered** (six sections, 141 pages, with the defense map) or the **Arbitration Binder as
  exchanged** (six tabs, C-1 to C-18, 174 pages, with the withheld-items list).
- **Case continuity.** The completed Demand Package (`RS67`) and the memorandum of its service (`RS68`) are in the
  "📁 Work from" packet of every activity that comes after it, and the finished Mediation Binder (`RS69`) and
  Arbitration Binder (`RS70`) in the activities that follow them. One Demand Package and one binder run through
  all five days, with one set of figures.
- **The service confirmation (`✉ Service Confirmation`,** on the demand's Your Task slide; not to be confused with the Portal's ✉ Email Workspace simulator above). Certified mail proves the
  demand left the office; it does not prove when the carrier got it. So the trainee writes the confirmation email
  that goes out with the mailing — it has to name the certified number, the package and its page count, say that
  the thirty days run from *receipt*, ask her to confirm the date and the set, and route every question about the
  terms to Atty. Thorne. An email that leaves any of that out is refused with what is missing, and nothing is
  sent. A complete one brings **Dana Whitfield's written acknowledgment**, which fixes 07/22/2026 from the
  carrier's own words and confirms the set is complete at 81 pages. Then she asks for two more weeks: the answer
  that grants it, the answer that refuses it and saying nothing all fail; only recording it and routing it to
  Atty. Thorne goes on.
- **Converted, filed and backed up.** The trainee then **converts the exchange into a memorandum** (built as a
  real PDF in the browser from their own email, her reply and what it establishes), **files it into the open case
  in the CMS** under the firm's naming convention — the CMS refuses any other name, exactly as it does for a
  catalogue document — and that same filing **keeps it on their Backup Drive**, under *Insurance, Demands &
  Negotiation*, where the firm keeps every demand document on the case. A document the trainee wrote is a
  document on the case like any other, so it goes down both roads a case document does. The firm's own version
  of the same memorandum (`RS68`) is there to read theirs against.
- **The trainer sees all of it** with the module's Learning Check: every call and note of the audit with its
  score, the email they sent and how many attempts were refused, the answer they gave to the follow-up, what they
  filed and whether it was backed up.
- **The audits follow the lessons and the case, and the build says so.** Nothing in an audit is a fact of its own: every figure, date and name in one is a restatement of `case-file.md`, the lesson data, the document manifest or the documents that item works from. The assembler requires each one to be found in a source that item actually draws on, so a change to a lesson or to the practice case that leaves an audit behind is a red check naming the item — not an audit that teaches a figure the file no longer carries. It checks the audits against the sources, not the sources against each other; keeping those agreeing is `build/case-flow/documents/audit.cjs`'s job and `terms.cjs`'s.
- **Source and rebuild:** `build/case-flow/exhibits/` — `EXHIBITSPEC.md` (the shape and the word limits),
  `d3.json` and `d4.json` (the content), `assemble.cjs` → `js/cm-case-flow-exhibits.js`. The UI is in
  `js/cm-case-flow.js`; the filing is `js/cm-doc-filing.js` (`send`, the same road the drafting activities file
  through, which keeps the Backup Drive copy too). CI checks the content against the spec and runs the whole
  workflow in a browser (`.github/scripts/exhibit-audit.cjs`).

**Templates** (`js/cm-documents.js`): the blank forms and sample releases in `documents/templates/`.

**📚 Knowledge Base (no Handouts page).** The handouts are in the LSH Knowledge Base's **Case Management** collection, one section per day (`CM Training · Day 1 · Intake, Claims & Property Damage` … `Day 5 · Litigation & Dropped Cases`). The top bar's **📚 Knowledge Base** (view `handouts`) shows the link and the templates; the link (`CM_KB_URL`) goes through the Portal's `/api/launch?tool=kb&to=cmkb`, which signs the reader in and opens that collection. Trainers add documents there with **+ Add to Case Management** (the page tells admins how).
- `templates/LSH_Net_Sheet_v2_FIXED.xlsx`: the original Net Sheet calculated the attorney fee from an empty cell (`L11 = L7*I11`), so the fee was always **$0**. Fixed to `L7*C11`, with a John Doe v. Robert Smith practice tab. Trainees fill the same net sheet in the course (`net-sheet.html`); the file stays as the reference.

The Training Tools hub, the tool frame, 🛠 Simulators, the 📚 Knowledge Base page and the Calendar Conflict Resolver are in `js/cm-skillbuilders.js`.

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

- **🧰 Tools** in the course's top bar lists every live tool (CMS, Docket, Records, E-Filing, Call Simulator, Email Workspace, Email Replies, Calendaring). Picking one opens it inside the course, under the course's own top bar, so the course navigation and the Tools menu stay on screen and switch tools. The frame lives outside the portal's page renders, so the tool keeps its session and unsaved work while the trainee goes back to a lesson. **New tab ↗** opens the tool on its own.
- The Calendar Conflict Resolver's Part D ends in a "Do this in the Docket System" step: the trainee enters the Scheduling Order's deadlines on the firm docket and logs the reference it gives, shown under 🧰 Tools → *My tool work log*. The Case Flow's own steps log their work with 🧾 Log Your Work (see above).
- **Shared simulators:** Email Workspace, Email Replies, Calendaring, Docket System, Medical Records Requests and Court E-Filing live on the LSH Training Portal (Training-Portal repo), so every program uses the same ones (the Call Simulator is the CMS's, see below). The CM course opens them with `?program=CM&name=…&batch=…`, so they start on the Case Management calls and results carry the trainee's name and batch. The Case Management calls are in the portal's `simulators/call-pack-cm.js`. Trainers see results on the portal's Simulators page when signed in there as admin. The embedded frame allows the microphone, so trainees can answer calls by voice.
- While a tool is *coming soon*, its steps tell the trainee to log the work as a Task in the CMS, so no exercise is blocked.
- **Admin → 🧰 Tools → Admin: tool addresses** sets each tool's address and switches it between Live and Coming soon, for everyone (shared key `settings:tools`).
- **Training tools open without a log-in page:** a trainee signed in here opens the CMS (cases, the Training Library, the Call Simulator, the Front Desk Drill) already signed in. `js/lsh-tool-links.js` is the same file in every LSH course repo (copy it from Foundational-Training when it changes); it loads last in `index.html` (and `build/build.py` adds it last). It asks this Worker's `/api/auth/tool-ticket` for a Portal-style ticket for the signed-in trainee (`{first, last, b, exp}` signed with `PORTAL_SSO_SECRET`, good for 5 minutes, reused for 3) and adds it as `?ticket=` to every CMS link, every link to the Training Portal's simulator pages (`cm-training-activity.pages.dev/simulators…`, which the Portal signs the trainee in from) and `window.open` on the way out; the in-portal frame gets its address from `LSHToolLinks.ticketed(url)`. The CMS signs the trainee in through its existing Portal-ticket sign-in. Admins and the 👁 Trainee view are left alone (an admin's ticket never signs anyone in), and without the secret (or if the request fails) the link opens as it is, with the CMS's own sign-in.
  - **The Call Simulator opens in the CMS directly:** `https://lshcasemanagementtraining-trainingcrm.pages.dev/?calls=1&program=CM&from=cm` (plus `&line=…&mode=graded` for a line's graded calls, e.g. from 🛠 Simulators or a Practice activity), not through the Portal's `simulators/call.html`, so the ticket applies. A saved tool address that still points at the Portal's Call Simulator page (or its `/api/launch` link) is read as the CMS's. The Portal's other simulator pages (`cm-training-activity.pages.dev/simulators/*.html`) keep their addresses; they open signed in too.
- **The CMS Case ID comes from the CMS, not from typing:** 🧾 **Log Your Work** on a step whose work is done in the CMS, and a Skill Activity's evidence box, start with the Case ID of the case open in the CMS. `js/cm-cms-case.js` asks the framed CMS which case is open (`{lsh:"cms-case?"}`); the CMS answers from its own `course-bridge.js` with the case header (`caseId`, `client`, `phase`) and says so again whenever the open case changes, so saving a new case in the CMS fills the box the moment it is given its ID. The box is marked *from the CMS*, what a trainee types over it is never overwritten, and **Log it** with an empty box logs the open case. Only a CMS frame on the page, at a CMS address, is believed — a message from anywhere else is ignored. With no CMS open and nothing remembered, the box is empty and typed as before. Checked by `.github/scripts/cms-case.cjs` (the CMS answered by the test).
- **📤 Filing the case documents into the CMS, named the firm's way:** every Case Flow block's 📁 **Work from** documents are filed into the trainee's own case in the CMS, from the lesson. For each document the trainee picks the **CMS category** and writes the file name in the firm's convention (`<Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.<ext>`), and **File it in the CMS** sends the document itself to the CMS open beside the lesson, which files it into the case under that category through its own upload. It is strict on purpose: a document put in the wrong category is refused with where the firm files it (nothing is even sent), and a wrong name is refused by the CMS with what is wrong with each part — nothing is corrected quietly, because the convention is what is being learned. The Case ID comes from the CMS, the panel counts what is filed and what was filed first time right, and the attempts stay on the trainee's record for their trainer. With no case open in the CMS the panel says to open one and files nothing. `js/cm-doc-filing.js`, the CMS's `course-bridge.js`; checked by `.github/scripts/doc-filing.cjs`.
- **📂 The Case File page is the trainer's answer key, and it fits one screen:** the fact cards (the audited specials, the fork, Track A's net sheet, how the suit ends) are shown to **trainers only** — a trainee builds the file from 📁 Case Documents and their own work in the CMS, and sees their own 📅 **The Case So Far** timeline here, nothing else. The page is tabs rather than a column to scroll: the hero keeps its size and the open tab takes the rest of the screen, so at 1280×720, 1366×768 and 1920×1080 neither the window nor the page body scrolls. Each fact belongs to a tab through `group` in `CM_CASE_FLOW.profile` (`file`, `cover`, `care`, `money`, `suit`, `won`); the facts are laid out as newspaper columns, so a long one runs on into the next column instead of leaving half a column empty. Checked by `.github/scripts/case-file.cjs`.
- **Sign-in inside the portal:** the CMS (CaseManagementTraining) sets its `lsh_session` cookie with `SameSite=None; Secure; Partitioned`, so trainees stay signed in to the CMS inside the portal frame. The CMS also refuses cross-site write requests (`functions/_middleware.js`). Safari blocks sign-in inside another site's frame whatever the cookie says, so Safari users use **New tab ↗**.

## 📂 The trainee's Backup Drive (Day 1, graded)

A firm keeps a backup drive of every case document in one folder structure everybody knows by heart: a Case Manager covering someone else's file still finds the executed retainer, the demand package and the lien correspondence where they always are. Trainees practise that on **their own Google Drive**, and they build it **on Day 1** — file management is a habit, not a module, and a trainee who builds their drive on Day 4 has spent three days putting documents nowhere.

**The structure is the case file this course already teaches.** `CM_CF_DOC_FOLDERS` in `js/cm-case-flow-docs.js` is the file the Case Flow works from, intake through litigation; the firm's drive is that same file as folders, numbered in the order the case runs — because on a backup drive the numbering is what teaches the lifecycle. So a document filed in the CMS already knows its folder and the copy needs no second decision from the trainee.

`js/cm-drive.js` is the page, `/api/drive` in `worker.js` the server, and the dashboard's first card under the day cards is the way in — it stays there until the drive is built.

1. **Connect** their own Google account once (a personal Gmail address is fine). The platform asks Google for **`drive.file` only**: it can see and change the folders and files it makes and nothing else in their Drive.
2. **Lay the structure out themselves.** Nothing is prefilled: they add each folder, name it, nest it and put it in order. The structure is the thing being learned, so it is typed, not accepted.
3. **Submit it, and it is graded** against the firm's standard folder by folder: what is missing, what is spelled differently, what they invented and what is out of order, each with the rule behind that folder (*records are kept apart from bills, because liability reads the records and damages read the bills*). A layout that is right is then **made in their Drive exactly as they laid it out**. The score and the number of attempts are kept.
4. **Keep it.** **↻ Check my drive** asks Google whether every folder is still there and names any that someone deleted; **🔁 Put the missing folders back** makes them again. Every document filed in the CMS is also saved into its folder here, so the drive is in use for the whole programme rather than set up and forgotten.

- **The standard lives in one place:** `FOLDER_STANDARD` in `worker.js` — 16 folders: `01 Clients` first (a drive is read top to bottom under pressure), the client folder named last name first, the case's nine folders inside it in the order the case runs, then `02 Firm Administration` apart from client work, `03 Templates` and `04 Closed Files`. `FOLDER_WHY` holds the rule for each one and `DRIVE_HOMES` maps each of the case file's folders to its folder on the drive. The page draws the structure from what the Worker sends and never carries a copy; the test fails if it starts to.
- **The numbers are the point.** A layout with the right folders in the wrong order is refused: every drive in the firm reads the same way, intake to close. Stray spaces and a leading slash are not held against anyone.
- **Where it is kept:** `drive:<trainee id>` in KV — the Google account's email, the folder ids, the Day 1 grade and the list of documents saved. The refresh and access tokens are sealed with AES-GCM under a key derived from `SESSION_SECRET` and never leave the Worker. **Disconnect** gives the access back to Google and drops the link; the copies already in their Drive stay there, and the Day 1 grade is kept. A trainer can read a trainee's status to grade it and can change nothing.
- **Everything filed reaches it, not just the case documents.** The letters a trainee drafts (`js/cm-cms-upload.js`) and the Service Confirmation's memorandum (`js/cm-case-flow.js`) are filed through `cmDocFiling.send`, which keeps the Drive copy the same way `file()` does — each in the folder its kind belongs in (`FOLDER` in `js/cm-cms-upload.js`, `convert.folder` in `build/case-flow/exhibits/`). Without that a trainee's drive held every case document and none of the ones they wrote themselves.
- **The CMS is the file of record.** A Drive copy that can't be made — not connected, not set up yet, a folder deleted — never undoes a filing. The trainee is told what didn't reach their Drive.
- **What a trainer sees:** the trainee's row in the Trainee Audit has **Document Filing & Backup Drive** — which documents reached the case file, under which category, how many goes each took, **first time right** as its own number, how many are on the drive, and the Day 1 Drive score. Both records ride the trainee's progress to their account (`doc-filing` and `drive-setup` in `PERSONAL_KEYS`), so it needs no extra request. **`doc-filing` was missing from that list**, so the filing grades had only ever lived in the trainee's browser: lost on another device, and never visible to a trainer. Fixed with the Drive, and the test now checks for both.
- **Setting it up (an admin, once):** `GOOGLE_CLIENT_ID` (a plain variable) and `GOOGLE_CLIENT_SECRET` (a secret) on this Worker. In that Google Cloud project: turn the **Google Drive API** on, add the `…/auth/drive.file` scope to the OAuth consent screen, and put this site's address among the OAuth client's **Authorized JavaScript origins**. Until both are set, `/api/drive` says the Backup Drive isn't switched on, the dashboard card stays away and nothing else is blocked. It is the same Google set-up the CMS's Doc Hub backup uses; a separate OAuth client is fine.
- **Test:** `.github/scripts/cm-drive.cjs` (no browser needed) checks the structure is a tree with a rule for every folder, that every one of the case file's folders has a home on the drive, that the scopes stay at `drive.file`, that the Day 1 grading passes the firm's own structure while refusing a missing, misspelled, invented or misordered folder, and that both grades reach the trainee's account.

## 📞 Graded calls (the Call Simulator on ☎ LSH Ring Channel)

The Call Simulator is **☎ LSH Ring Channel's** — the training phone itself (the lshringchannel repo). Every Call Simulator link here opens it through the Main Portal, signed in and in its own tab: `https://cm-training-activity.pages.dev/simulators/call.html?program=CM&line=<line>` (`&mode=graded` for the line's graded call) → `/api/launch?tool=ringchannel&to=calls` → the phone's 🎧 Practice. The phone rings, the trainee answers with a headset and works the call with the phone's own keys (mute, hold, transfer) and 🔎 Case lookup; a trainer can ring the same phone for a live mock call. A **graded** call (a caller unknown until the debrief) counts here: the Training Portal (its `/api/call-results`) keeps the trainee's graded calls in this program's store as `callsim:<trainee id>`, by line, and the Worker lets the trainee read it but never write it. The dashboard band's **Graded calls** card (`js/graded-calls.js`) shows the best graded call on each line, averaged, with the lines and calls taken; each line's best is in its tooltip. **Note on the call packs:** Ring Channel's scenario library is the Foundational pack on three lines (Reception and Calendar Management on the Main Line, Intake on the Intake Line), so a CM step that names a line Ring Channel doesn't have (Nguyen Case Calls, Client Communication, Attorney Reporting, Adjusters & Carriers, Providers & Records) lands the trainee on the phone's line picker. Those calls are added on Ring Channel itself — a trainer writes them in its **📚 Scenarios**, or they are ported into its `src/scenarios.js`. It's read once a page load and again when the trainee comes back to the tab (at most every two minutes).

**The dashboard band (trainees):** the five numbers (Program complete, Graded calls, Best Competency, Average quiz score, Days completed), then **💬 Your feedback** and **Ranking** side by side on the same line (a laptop or desktop: one row; a tablet: the numbers, then Feedback and Ranking on the next line). The certificate notice (the same 🎓 pill) sits right under them, inside the band, instead of on its own under it; once it's unlocked, **Download my Certificate** stays with the dashboard's buttons. It's the `renderDashboard` wrapper at the end of `js/cm-updates.js` (it marks the band `cm-band`).

**Training Portal simulator results:** the Portal writes each signed-in trainee's simulator results into this course's store as `simresults:<trainee id>` (`{traineeId, updatedAt, results:[{simulator, scenario, score, at}], best:{<simulator>:{score, count, at}}}`, under the Worker's `cm:` prefix). The trainee reads their own and never writes it (`worker.js`). Trainers see the results on the Portal's Simulators page.

## 🕘 Attendance

Attendance is taken on the **Main Portal**, not in this course: the LSH Training Portal's **Master Control → 🕘 Attendance** (`/attendance.html`) takes and reviews it for every program, batch by batch, and keeps the attendance Google Sheet's **Platform Attendance** tab in step both ways. This course has no Admin → 🕘 Attendance tab (removed as in EA-PA-TRAINING; an admin whose saved tab was Attendance lands on the Trainee Audit).

What stays here is the trainee's side, `js/checkin.js`: a trainee's first visit each day (Eastern time: EST, or EDT in summer) records their **Time In** on the Worker (`/api/checkin`, which keeps the first one: `checkin:<YYYY-MM-DD>:<id>`, kept 40 days), sent when the page opens, when they come back to the tab, and on their first click or key press if the page was left open overnight, with the Case Flow day they're on ("Case Flow Day N: title") for the sheet. The portal's page shows it (marked "auto") until a trainer sets one. Admins and the 👁 Trainee view never check in. The `attendance:<batch key>:<YYYY-MM-DD>` records the portal writes stay in this course's store under the Worker's rules (admins only).

## 📉 Staying under Cloudflare's monthly request allowance

The Cloudflare account is on Workers Paid: **10 million requests a month for the whole account**, shared by every LSH site (the courses, the CMS, the Training Portal and the rest). This course's Worker counts for everything under `/api/` and `/version`; static files (the page, `js/`) are free and don't count. `decks/` and `documents/` now come from R2 through the Worker, so each of those files a browser loads (or re-checks) counts too: see *Documents in R2*. Past the allowance, Cloudflare charges for every extra million requests. Usage is under **Workers & Pages** in the Cloudflare dashboard.

So an open page asks the server sparingly (`POLL` in `index.html`), and not at all while its tab is in the background. When it's back, whatever came due runs then; a quick look at another tab (Google Meet) asks nothing:

| What | How often | Before |
|---|---|---|
| A trainee's access and new tasks (`startApprovalPolling`) | every minute: their record, and the tasks for every unlocked day in one request | every 45 s: their record twice and one request per day, also in the background |
| An attempt reset (`liveTick`) | every minute (the minute check above counts) | every 10 s |
| Trainer feedback and Focus items | every 2 minutes | every 45 s |
| Waiting for approval | every 15 s | every 8 s |
| Admin: Trainee Audit, Rankings, Trainee Feedback | every minute, every trainee in one request | every 30 s, one request per trainee |
| Admin: the Trainee Audit's progress, feedback and Focus columns | one request for up to 33 trainees | three requests per trainee |
| A new version (`/version`) | every 3 minutes (a change is confirmed 20 s later) | every 45 s, also in the background |
| Opening the page: lesson add-ons and Daily Activities | one request each | 15 and 6 requests |

A trainee's page in view now asks about 3 times a minute (it was about 17) and nothing in the background (about 11). An admin on the Trainee Audit with 30 trainees: about 3 a minute (60 to 150).

Lists of records (the Trainee Audit, attendance, trainee feedback, activity submissions, tasks) are read with `/api/storage/get-many` (up to 100 keys, the same rules and `cm:` prefix as `/api/storage/get` for each key), not one request per record. A trainee is signed out as revoked only when the server answers that their record is gone or not approved: a server that doesn't answer (offline, or switched off for the month) no longer signs anyone out or clears their notes.


## 🗄 Documents in R2

The document-heavy folders (`decks/`, `documents/`) are kept in **Cloudflare R2**, the `DOCUMENTS` binding (bucket `lshtraining`, the same bucket the EA/PA course and the CMS use), under `courses/cm/` (e.g. `courses/cm/decks/cf-docs/...`). `wrangler.json`'s `assets.run_worker_first` sends those paths to `worker.js`, and `docFromR2` answers from R2, with byte ranges (PDF viewers) and 304s for a file the browser already has.

- **Uploading:** `.github/workflows/r2-docs.yml` runs on every push to `main` that changes those folders: it uploads the files that changed and removes deleted ones (`.github/scripts/r2-sync.mjs`). **Actions → R2 documents → Run workflow** uploads every file (do this once, after setting the secret). It needs the repository secret `CLOUDFLARE_API_TOKEN` (a Cloudflare API token with *Workers R2 Storage: Edit*); until it's set, the run only prints a notice.
- **Fallback:** a file that isn't in R2 yet (the upload still running, or the token not set) comes from the Worker's static assets as before, and so does everything if the binding is missing or R2 fails. The files stay in the repository and in the deploy, so nothing breaks while R2 fills; once R2 has them all, the folders can be added to `.assetsignore` to leave them out of the deploy.
- **Requests:** these files now go through the Worker, so each one a browser loads or re-checks counts toward the account's 10 million Worker requests a month (and is one R2 read; 10 million a month are free). A class of 30 opening a few hundred documents and thumbnails a day is roughly 100–200 thousand a month.
- **Checks:** `.github/scripts/r2-docs.mjs` (in *Checks*) serves a document from an in-memory R2: from R2 when it's there, byte ranges, 304s, HEAD, the static assets when it's missing or R2 fails, nothing else read from R2, and the `run_worker_first` list matching the folders.

## Checks (GitHub Actions)

`.github/workflows/checks.yml` runs on every pull request and every push to `main`. A red **Checks** status means something is broken, and the log says what:

- **Syntax, files and build:**
  - every JavaScript file and inline `<script>` must parse;
  - every local file `index.html` loads must exist;
  - every case document and handout in `js/cm-documents.js` must exist in `documents/`, and every `docPacket([...])` id must be a real document (`.github/scripts/check-data.mjs`);
  - the Worker must build (`wrangler deploy --dry-run`; nothing is deployed).
- **The trainee's Backup Drive** (`.github/scripts/cm-drive.cjs`): the firm's folder structure is a tree with a rule written down for every folder, every one of the case file's folders has a home on the drive, Google is asked for `drive.file` only, the Day 1 grading passes the firm's own structure and refuses a missing, misspelled, invented or misordered folder, and both grades reach the trainee's account.
- **Training tools open signed in** (`.github/scripts/tool-links.cjs`): the Worker signs a Portal-style ticket for a signed-in trainee (verified against `PORTAL_SSO_SECRET`, carrying their name and batch and good for 5 minutes) and never for an admin or a trainee whose access was taken away; without the secret it refuses rather than signing something unusable; and every address in the Training Tools hub is recognized by `js/lsh-tool-links.js` and comes back with `?ticket=` (keeping the query it already had), asked for once and reused, while an admin, the 👁 Trainee view and anything that isn't a tool are left alone.
- **Smoke test in a browser:** serves the site through `worker.js` with an in-memory KV store, signs in as a trainee, and renders every lesson slide, knowledge check, page and practice tool (every part) at desktop and phone width. It fails on any page error or a page that scrolls sideways.
- **Presenter view** (`.github/scripts/presenter.cjs`): opens Presenter view as a trainer and watches the slides window.
  - Next draws the slide once, with no entrance animation.
  - The console re-drawing (its live copy reconnecting) doesn't draw the slides window again.
  - A long slide's next and previous pages change in place. Case Flow slides are scaled to fit one screen and never split, so on CI's day (12, Case Flow Day 2) this part is reported as skipped.
  - A resize lays the slide out again without animation.
  - The slides window never reloads itself for an update.
- **The exhibit audit, the completed package and the Service Confirmation** (`.github/scripts/exhibit-audit.cjs`): the audit is one of the day's slides and gives nothing away; the workbench lists every item with a call to make; a hand-in with an item uncalled is refused; a complete one is scored, marks the wrong call and reveals the completed package; the finished set is carried into the activities that follow; an email that does not do the job is refused with what is missing; a complete one brings the acknowledgment; the answer that moves the attorney's deadline stops the work and the one that routes it does not; and the memorandum is built, refused under a wrong name, filed under the convention and backed up — with all of it on the trainee's record for their trainer. The CMS is answered by the test.
- **Every slide fits on one screen** (`.github/scripts/fit.cjs`): every slide of every day ends inside the window with its Previous / Next bar at 1366×768 and 1920×1080, nothing in it scrolls, and none is split onto a second page.
- **Every page fits on one screen** (`.github/scripts/one-screen.cjs`): at 1366×768, 1920×1080 and 1280×720 the window never scrolls on any page or lesson, the footer line stays on the screen, a lesson page needs no scrolling at all, and on a page that does scroll inside its body the bottom is reachable and `window.scrollY` / `window.scrollTo()` work on it. At 900×800, under the one-screen layout, nothing is cut off.
- **Server requests** (`.github/scripts/requests.cjs`):
  - `get-many` gives a trainee only their own and public records and an Admin every one, refuses more than 100 keys, and reads under the `cm:` prefix like `get` (never an EA/PA record);
  - with the checks sped up, a trainee's page reads the tasks for every day in one request and their record about once per check, checks for a new version rarely, and asks nothing while the tab is in the background (catching up when it's back) or on a quick switch to another tab and back;
  - a server that doesn't answer doesn't sign the trainee out; a revoke does;
  - the Trainee Audit reads every trainee in two requests, and its progress columns in one.

To run them locally: `node .github/scripts/check-site.mjs`, `node .github/scripts/tool-links.cjs`, `node .github/scripts/check-data.mjs`, then `node .github/scripts/server.mjs 8787 &` and `node .github/scripts/smoke.cjs http://localhost:8787/` and `node .github/scripts/presenter.cjs http://localhost:8787/ 12` and `node .github/scripts/requests.cjs http://localhost:8787/` and `node .github/scripts/exhibit-audit.cjs http://localhost:8787/` (needs Playwright).

## Checks: Builds from the EA/PA portal

`.github/workflows/build-from-eapa.yml` runs `build/build.py` against EA-PA-TRAINING's current `main` (`.github/scripts/build-from-eapa.mjs`), writing the page to a temp file — `index.html` is never touched. It fails when an anchor the script edits has moved, and also when the build finishes but the output isn't this course: a missing or extra `/js/` script against the committed page, a day object inlined or `DAYS` not the empty list `js/cm-case-flow.js` fills, no John Doe content, or a size more than 15% off.

That last part matters, because this is exactly how the build rotted unnoticed: EA/PA moved each day's lessons into `js/days/dayN/lessons.js`, six anchors stopped resolving, and with the failures suppressed the script still emitted a plausible 1.79 MB page — EA/PA's ten-day course in CM styling, missing twelve of this course's own scripts.

It runs daily, on `workflow_dispatch`, and on pull requests that touch `build/`; it is deliberately **not** part of **Checks**, so EA/PA drifting doesn't turn an unrelated pull request red. A red run here breaks nothing for trainees on its own — the deployed page is the committed `index.html`, not a fresh build — but the course can't pick up EA/PA's new features until the edit named in the log is updated. `CM_BUILD_OUT` is what lets the build write somewhere other than `index.html`.

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
   - `GEMINI_API_KEY`: AI grading and roleplays (Gemini is the only AI provider, as in EA/PA). More keys join the pool by name: `GEMINI_API_KEY1`, `GEMINI_API_KEY2` … `GEMINI_API_KEY14`, `GEMINI_API_KEY15`, `GEMINI_API_KEY16` (any number). They take turns, one request each; a key that hits its limit or runs out of credits rests (a minute for a per-minute limit, an hour for a daily one or no credits, 10 minutes if Google rejects it) and the next key answers, so a class never stops when one key's credits run out. Add each as a Secret on this Worker; no code change is needed. `/version` shows how many keys are in the pool. Same rules as the CMS (`functions/_ai.js`) and the Portal's AI gateway. `.github/scripts/ai-keys.mjs` (CI, with Gemini faked) holds the pool to it: every numbered key is used (above 9 too), keys take turns, a key out of credits rests while the next answers, a rejected key is never asked twice, and with every key resting the Worker still tries rather than refusing.
   - `SESSION_SECRET`: optional.
   - `PORTAL_SSO_SECRET`: the Portal sign-in secret (see the top of this README); it also signs the tickets that open the CMS without a log-in page (`/api/auth/tool-ticket`).
4. After the first deploy, sign in as admin → **🧰 Tools** to check the CMS address (default `https://lshcasemanagementtraining-trainingcrm.pages.dev`, the CaseManagementTraining app). The Docket System, Medical Records Requests and Court E-Filing are Live by default and point at the LSH Training Portal. If an admin saved tool addresses before they went live, open **Admin: tool addresses** once and set them to Live with their portal addresses.

`.assetsignore` keeps `worker.js`, `wrangler.json`, the Markdown files and `build/` out of the published site.

## Daily Activities and the facilitator's feedback style

`js/daily-activities.js` is the same file as in EA-PA-TRAINING (copy it over when it changes there): trainers publish each day's activities and review submissions in Admin → 📋 Activities (in this course the trainees' top bar has no **📋 Activities** button: their practice is all on 🧪 Practice; the button is left out in `renderTopbar`, `js/cm-updates.js`), and **Admin → 🗣 Feedback Style**, which learns the facilitator's feedback voice and applies it to all AI feedback (AI grading, daily reviews, activity drafts). The storage rules for its keys (`activities:dayN`, `actfile:*`, `actsub:<trainee>`, `actup:<trainee>:*`, `actadmin:rubrics`, `settings:feedback-style`, `admin:fbstyle-samples`) are in `worker.js`; see the EA-PA-TRAINING README for details.

## 🎨 The standard page style

This program's look is the LSH standard, shared with the Training Portal and
the other four programs. The block that carries it sits at the end of the
`<style>` in `index.html`, marked **"The LSH standard page style"**, and is
byte-identical in all five programs.

**It is a vendored copy, not a link.** The Portal's `theme.css` — and the
"The standard page style" section of the Portal's README — is the source of
truth. Change it there first, then copy the block down into each program. The
copy is deliberate: every program deploys on its own, and no other site's
deploy can restyle this one.

What it does:

- The page sits on a photo behind a wash. Each program keeps **its own image**,
  pointed at by its own `body::before`; only the strength is shared (`.40`).
- The panels on top of it are translucent (`--surface-glass`, `--surface-blur`),
  so the backdrop carries on underneath instead of stopping at every card.
- The colour rules in the block are what the backdrop costs, not decoration.
  Text must clear WCAG AA (4.5:1, or 3:1 at 24px / 18.7px bold) against the
  **photo**, not against a white card that is no longer white. That is why
  `--ink-soft` is `#2B2F3E` rather than the `#5B6178` tuned for white, why
  orange is never used as lettering on the photo, and why a label on an orange
  fill is dark rather than white.

Changing any surface here means re-checking contrast against the photo. The
audit that produced these numbers screenshots each view twice — normally and
with every glyph transparent — and scores each text run against the pixels
actually behind its own lettering.

**Roadmaps and plain English (Case Flow slides).** A complex lesson opens with **🗺 The Roadmap** right after Why It Matters: its steps, in order, before any of them is taught or tested (`roadmap` in `build/case-flow/slides/dN.json`, 3–6 steps, checked by the slides assembler; its spoken script is the `map` slide in `build/case-flow/scripts/dN.json`). Eleven lessons carry one, from Opening the File to From Release to $0.00. Every legal term and abbreviation in `CF.plain` (`js/cm-case-flow-data.js`) is explained in plain English, in a **📖 In plain English** box, on the first block that uses it in the order the course teaches: on a lesson's Rules slide, or on an activity's Your Task slide, so no task asks for a term before it has been explained.
