# 5-Day Legal Case Management Flow — Architecture & Continuity Spine

**Focus case:** *John Doe v. Robert Smith* · **Lead Counsel:** Attorney Elijah Thorne
**Course:** LSH Case Management Training (5-Day). The Case Flow is the course; the earlier *John Doe v. Apex Delivery Services* days are archived (kept as they were, off the trainees' dashboard).
**Status:** the spec every Case Flow block conforms to. All five days are written: 20 modules, 100 blocks.

| File | What it is |
|---|---|
| `js/cm-case-flow-data.js` | **The source of truth.** Case file, days, modules, blocks, quizzes, the theory plan. |
| `js/cm-case-flow.js` | Turns the data into this course's own day and lesson objects and wires them in. |
| `build/case-flow/curriculum.cjs` | Writes `dayN.md` and `traceability.md` from the data, and validates the curriculum's rules. |
| `curriculum/5-day-flow/day1.md` … `day5.md` | The per-block curriculum spec, one file a day (generated). |
| `curriculum/5-day-flow/case-file.md` | The canonical case file: every party, date, bill, offer, lien and deadline the five days use. |
| `build/case-flow/documents/` | The case documents (70, `documents/case-flow/`): `SPEC.md` (each document's facts, plants and trainer key), the sources, the renderer and the audit. Metadata and each activity's documents: `js/cm-case-flow-docs.js`. |
| `build/case-flow/exhibits/` | The exhibit audits, the completed-package reveals and the service confirmation: `EXHIBITSPEC.md`, `dN.json`, `assemble.cjs` → `js/cm-case-flow-exhibits.js`. |
| `curriculum/5-day-flow/traceability.md` | Where every existing topic's theory lives now (generated). |

---

## 1. Why this track exists

The existing course teaches the right doctrine on 192 topics, but as slide-by-slide theory followed by detached exercises, on a case (*Apex*) whose facts don't exercise UM stacking or a treatment gap. This track keeps that doctrine and re-seats it on one file, in the order a Case Manager meets it, with practice interjected straight after each piece of theory.

| Existing pattern | This track |
|---|---|
| A topic's Core Principles read off a slide | **Tell Them** — the same principles as enforceable rules, plus the strategic *why* |
| A diagram per topic | **Show Them** — the same layouts (PROCESS, TABLE, COMPARE, THREEBOX), or the stack ladder |
| Skill Builders after the topics | **Let Them** — an activity after every lesson, on this file, with checkpoints |
| One Knowledge Check per day | The same, plus a **Self-Summary & Skill Scale** per module, AI-reviewed |

**The theory is relocated, not removed.** `traceability.md` lists all 192 existing topics with where each one lives now, and the build fails if a topic is neither used nor planned, or is planned for a written day that doesn't carry it.

---

## 2. The case file (persists across all 5 days)

| | |
|---|---|
| Case | *John Doe v. Robert Smith* · LSH-2026-MVA-770412 · MVA, passenger injury |
| Lead Counsel | Atty. Elijah Thorne — approves all strategy, demands and filings |
| Client | John Doe — **front-seat passenger in the host vehicle** |
| Date of loss / SOL | 02/06/2026 · 02/06/2028 (two-year limitation assumed for training; confirm the governing statute) |
| Health plan | Peach State Health Plan · PSH-55017742 · GRP-41208 — asserts reimbursement |

### The policy stack — $40,000

| # | Layer | Party | Limit | Carrier |
|---|---|---|---|---|
| 1 | **BI** — Robert Smith's liability | third-party | $10,000 | Keystone Mutual |
| 2 | **Host UM** — the host vehicle's policy | first-party | $20,000 | Harbor Point |
| 3 | **Relative UM** — resident relative's policy | first-party | $10,000 | Cardinal State Mutual |

**Order of operations:** BI exhausts → Host UM opens → Relative UM stacks. The passenger fact is what opens both UM layers: driving his own car, John Doe would reach $10,000 (he rejected UM on his own policy, and the relative policy excludes a car he owns).

**Not to be confused with the payer order** for medical bills while the claim is open (the Regulatory Triple-Check): PIP/MedPay → private health insurance → LOP/provider liens.

### Who and what else is on the file

| | |
|---|---|
| Host driver | Kevin Alvarez, John's coworker (separate household); owns the host vehicle, insured by Harbor Point (Host UM $20,000 and **MedPay $5,000**) |
| Resident relative | Margaret Doe, John's mother; her Cardinal State policy carries the $10,000 Relative UM; the file's emergency contact |
| Margaret Doe's car | A 2019 Honda Civic, parked at the curb and struck when the host vehicle was pushed into it; insured by Bluewater Auto (UM rejected in writing). That rejection, and the relative policy's owned-vehicle exclusion, are why John would reach only $10,000 had he been driving it |
| Outside the stack | MedPay (pays bills, first in the payer order), Keystone's PD coverage (the Civic's repair, loss of use and diminished value) and John's own policy are never part of the $40,000 |

The full case file the content is written against (providers, bills, dates, the net sheet, the litigation calendar) is `case-file.md`; every figure on a slide comes from it.
**Who sees it.** Every trainee: the Case Flow is the course. Its five days are the dashboard's day cards, banner circles, stats and certificate, and the Admin page's Trainee Audit, progress and Day-by-Day Feedback follow them. John Doe v. Apex is archived: off the trainees' dashboard, in an "Archived version" row for trainers, its days still reachable and its case file behind the Case File page's "Archived" link. On the Admin page, in the trainee's panel, **Course version** can put one trainee on the archived version, or give them both. The choice is stored as `track` in the trainee's `feedback:<id>` (the trainer writes it; the Worker keeps it when the trainee writes their own review receipts).

Trainees read the file on the **📁 Case File page**, which is John Doe v. Robert Smith's client profile for trainers and every trainee assigned the Case Flow (the Apex case file is archived behind a link at its foot, and stays the Case File for trainees on the Apex version), from `profile` in `js/cm-case-flow-data.js`. It grows with the file: `opens: N` sections show once Case Flow Day N is open (the facts the day starts from), `passed: N` sections once Day N's Knowledge Check is passed (what that day's work produces), so the profile never gives away an activity's answer. Trainers see every section. A fact changed in `case-file.md` is changed there too.

### Two tracks: the litigation fork

Day 3 follows **Track A**: Keystone tenders the BI limits, both UM carriers pay theirs, and the file settles for $40,000 gross and $20,359.92 net to John Doe. Day 4 returns to the same moment, 08/05/2026, and follows **Track B**: Keystone holds at $3,500 on the 14-Day Gap and stonewalls, and because BI must be exhausted before UM opens, the whole $40,000 is frozen behind a $10,000 carrier. The file goes to suit, mediation and UM arbitration (Day 4) and through discovery to deposition (Day 5). The same facts run under both tracks; every block's header line names its track on Days 3–5, so a trainee always knows which one they are on.

### The critical fact — the 14-Day Treatment Gap

First treatment 02/20/2026, fourteen days after the loss, then disrupted care mid-treatment. Every day engages it:

| Day | How the gap appears |
|---|---|
| 1 | Flagged during intake and in the case plan's risks band |
| 2 | Probed with the client; justified with medical documentation |
| 3 | Used by the adjuster as a causation defense; countered with the MRI |
| 4 | The adjuster's stonewall on it triggers the litigation fork |
| 5 | Defended in deposition prep |

Every block's card carries a **continuity strip**: case · counsel · stack · critical fact. On Days 3–5 the block's header line also names its track (Track A or Track B).

---

## 3. Sequential integrity

Case Flow Day N opens when the Day N-1 Knowledge Check is passed (70%), for trainees; admins and Trainee view see every day. Each day states its gate:

| Day | Gate to the next |
|---|---|
| 1 Opening the File & the Case Strategy | Matter opened in the CMS · PD onboarding tracked · LORs out and the stack verified at $40,000 · Regulatory Triple-Check cleared · Case Plan routed |
| 2 Client, Treatment & Pre-Demand | No Contact Protocol run and logged · LOPs out and providers coordinated · treatment documented to MMI · Gap Justification Record · Specials audited at $16,401.40 · demand strategy approved |
| 3 Demands & Settlements (Track A) | BI tender, UM consents and limited release · $40,000 gross · liens resolved · net sheet and trust ledger reconciled · closing memo |
| 4 Litigation Fork (Track B) | impasse documented and suit authorized · Litigation status · hard-rule calendar audited · mediation and arbitration binders verified · bottleneck log current |
| 5 Dispute Resolution & Litigation (Track B) | pleadings and discovery log · trial-prep checklist and KPIs · PD recommendation · deposition readiness · liability counter-package |

Day 3's pre-litigation settlement always comes before Day 4's litigation fork: the fork is legitimate only because the negotiation was genuinely attempted, and Track B starts from the very negotiation Track A won.

---

## 4. The rhythm and the block

A module is a unit of scoring: its lessons and Skill Activities, then exactly one Knowledge Check (with its quiz share, Self-Summary, Skill Scale and the trainer's 40%). Four modules a day; the build rejects a module without one Knowledge Check, last.

**The teaching order is the `sequence`** (in `js/cm-case-flow-data.js`): each day is a run of Case Phases, following the case's life. Day 1: the Case Manager's role, the case, the raw file, intake and Property Damage, then opening the file in the CMS; then claims and the CM Case Strategy, then creating the action plan. Day 2: client communications; treatment and provider communications (LOPs); the pre-demand audit. Days 3–5: one Case Phase per module. A block keeps its id, rubric, documents and saved work wherever it is taught; the build checks every block is taught exactly once, each phase runs lessons → activities → Learning Check, and no Knowledge Check is taught before the blocks it checks.

Each block is one topic in this course's own lesson shape, drawn as a short run of slides — **one idea per slide, in big type**, with the key phrase of each line highlighted and an illustration that fits the topic:

| Block | Its slides |
|---|---|
| Lesson | **Why It Matters** (the hook, from Tell Them's why) · **The Rules** (3–4 rules, the UPL boundary boxed) · **See It** (Show Them's visual) · **On the Job** (Trigger ➔ Task ➔ Tool ➔ Checkpoint) · **Do & Don't** (Best Practices & Pitfalls) |
| Skill Activity | **Your Case** (Let Them's scenario) · **Your Task** (the steps, the tool to open, the documents, what to deliver) · **Audit & the Finished Set** (where the activity works a document set) · **See It** (the reference model, if any) · **Check Your Work** (the verification checkpoints, as a tick list) |
| Knowledge Check | **Knowledge Check** (the questions, four to a slide, each with an answer box) · **Self-Summary** (saved, AI-reviewed with the answers) · **Skill Scale** (and Submit for review) |

**On screen, each Case Phase is taught in three parts:** its lessons back to back as one uninterrupted discussion, then its Skill Activities and real-time practice, then its Learning Check. The blocks themselves keep the rhythm above; only the order on screen changes.

The words on these slides are a distillation of the block, never new content: written to `build/case-flow/slides/SLIDESPEC.md` (word limits per field, one highlight per line, an image per block) in `build/case-flow/slides/dN.json`, and assembled into `js/cm-case-flow-slides.js` by `build/case-flow/slides/assemble.cjs` (`--check` in CI). The block's full text — and its rubric — stay behind **📖 Full text** on every slide, and in Presenter view, which carries one script per slide. The illustrations are inline SVGs in `js/cm-case-flow-art.js`.

**A message on the file is worked, not read.** Where an activity opens on a voicemail (Day 1's, from John Doe: Keystone asked to record him), its Your Case slide carries the **Notes & Action Plan** in place of document thumbnails: the trainee transcribes the message and writes an action plan, each graded with its answer key shown once handed in, then works the plan in the Email Simulator (the adjuster told in writing: no direct contact, any Recorded Statement through the firm; the treatment facility asked about status, billing and records) and on the live check-in call. Content: `build/case-flow/exhibits/EXHIBITSPEC.md` (`notes`).

**A new document is taught before it is worked (the New Document Instructional Standard).** Whenever a legal or medical document enters the curriculum or the CMS workflow (a Causation Letter, a Letter of Protection, an affidavit…), the lesson that introduces it carries **The Document** slide, right after Why It Matters: its definition, legal purpose, key evidentiary role and the Case Manager's handling, before any activity asks the trainee to request, draft, audit or file it. Content: `build/case-flow/slides/SLIDESPEC.md` (`document`).

**An activity that works a document set audits it, and then sees the finished one.** Serving the Demand Package and assembling the two binders each carry the draft set as a packet the trainee calls item by item (keep · replace · pull · add · flag), with the loophole or evidentiary gap each item hides held back until the audit is handed in; then the audit is scored and the completed set is revealed — the Demand Package as served, the Mediation Binder as delivered, the Arbitration Binder as exchanged. Those completed sets are in the `CM_CF_DOC_PACKETS` packet of every activity that comes after, so one Demand Package and one binder run through all five days with one set of figures. Serving the demand also carries the **Service Confirmation**: the email that sends the demand to the adjuster from the Email Workspace, the adjuster's written acknowledgement of receipt (which fixes the receipt date, and so the deadline, from the carrier's own words), the extension request that tests the UPL line, and the exchange converted into a memorandum, filed into the open case in the CMS under the firm's naming convention, which keeps it on the trainee's Backup Drive in its folder as well. Content: `build/case-flow/exhibits/EXHIBITSPEC.md`; the trainee's calls, notes, email, answer and filing go on their record and to their trainer with the module's Learning Check.

The same block also fills the course's native fields (`fourPart`, `layout`, `trainerCue`), so search, the SOP and Presenter view read it like any other topic.

### The six components, and where each lives

| Component | On the trainee's slide | Elsewhere |
|---|---|---|
| Slide Title & Topic | Header, separator (day · module · block · slide) | Curriculum spec |
| Visual Layout Description | — | Curriculum spec, for whoever designs the slide |
| Slide Body: Tell / Show / Let | ✓ | Curriculum spec |
| Knowledge Check & CM Summary | ✓ (module's check block + the day's quiz) | Curriculum spec |
| Assessment Criteria (AI + Trainer) | ✓ (behind 📖 Full text) | Curriculum spec |
| Speaker Notes | — (never on the shared screen) | **Presenter view** (`SLIDE_SCRIPTS`) and the curriculum spec |

### Operational mapping

`Trigger Event ➔ Case Manager Task ➔ Tool/Interface ➔ Verification Checkpoint` on every lesson and activity. The checkpoint is the gradeable field.

---

## 5. Scoring — 60% automated, 40% trainer

| Channel | What feeds it | Where it is stored |
|---|---|---|
| **Automated (60%)** | The module's share of the day's Knowledge Check (multiple choice, auto-scored; the day needs 70%) and the AI evaluator's score of the Self-Summary against the module's rubric (`runRubricEvaluation`) | `case-flow` personal key, synced to the cloud with the trainee's progress |
| **Trainer (40%)** | Qualitative performance, strategy, tone, UPL, the self-summary | The trainee's feedback record (`feedback:<id>`, `caseFlow.<module>`), entered on the **Admin page** in each trainee's panel ("Case Flow — trainer assessment"), beside their self-summary, self-ratings, quiz share and AI score; read back into the trainee's composite |

**Composite** = automated × 0.60 + trainer × 0.40, shown once both are in. **UPL is a gate, not a weighting:** legal advice fails the UPL criterion whatever the composite, and the AI evaluator is told to score Risk Mitigation 0 when it sees it.

The **Skill Scale** (1 Not yet — 5 Can explain it to a peer) is compared with the scores; a wide gap either way is a coaching signal.

---

## 6. How it attaches to the course

- **Days 11–15**, found by `DAYS.find` / `DAYS.some` but not in `DAYS`: everything that counts the program — "x of 5 days", the certificate, attendance, the SOP — still counts Days 1–5. `completedCount()` and `avgScore()` are scoped to Days 1–5 so a Case Flow pass can't push the program past 100%.
- **Dashboard:** the track's own row of five day cards under Days 1–5.
- **Load order:** `cm-case-flow-data.js`, then `cm-case-flow.js`, right after `graded-calls.js` (its dashboard wrapper must run on the finished page; it wraps `renderLessonCard` after `cm-skillbuilders.js`).
- **The case's dates roll forward** (`js/cm-case-dates.js`, loaded between the content and `cm-case-flow.js`). The case is written in 2026 (collision Fri 02/06/2026, SOL Sun 02/06/2028). At load, every date in the content, slides, simulation and document list moves by whole weeks to the trainee's case year: the collision lands on the Friday from 01/31 to 02/06, so weekdays, weekend roll-forwards, business-day counts, the 14-day gap and Labor Day/Memorial Day stay true. Only years where the two-year SOL stays exactly DOL + 2 years are used: 2026, 2029, 2030, 2033, 2034, … (neither that year nor the next is a leap year); between them the case keeps its last year. A new trainee gets the newest case year whose Day 1 work (through 03/16) is past; their record keeps it (`caseYear`) until they finish. Once the case has moved, documents open in `case-doc.html`, which shows the HTML source (`documents/case-flow/html/`) with the dates moved and prints or saves it as a PDF; RS03 also downloads as an editable Word copy. Trainers preview a year with `?caseYear=2029` (`?caseYear=off` ends it), and each trainee's panel names their case year. Write dates in the content as the case has them (MM/DD/YYYY, MM/DD, "February 6, 2026", "the 6th day of February, 2026"); `.github/scripts/check-case-dates.mjs` (CI) fails on a date the roll-forward misses, a weekday that no longer matches, or an SOL that isn't DOL + 2 years.
- **The universal layout:** the cards are built from the engine's own pieces and the page's tokens (`--font-ui`, the navy/orange palette), and add nothing to the top bar.

---

## 7. Legacy extraction

| Source | Used for |
|---|---|
| This course, `build/day1.js`–`day5.js` | Most of the theory. Cited on each block as `D<day>#<topic>`. |
| LSH firm curriculum (Claims Specialist) | The No Contact Protocol (MIA clients), rental coverage hierarchy, LOR property-damage carve-out, pre-claim data set — doctrine this course doesn't carry. Cited by name. |
| Newly authored | Theory in neither source, from the $40,000 host-passenger stack to the two-track fork. Kept in the data (`authored`) and listed in `traceability.md` for review. |
