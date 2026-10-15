# 5-Day Legal Case Management Flow — Architecture & Continuity Spine

**Focus case:** *John Doe v. Robert Smith* · **Lead Counsel:** Attorney Elijah Thone
**Course:** LSH Case Management Training (5-Day) — a new track beside the existing *John Doe v. Apex Delivery Services* days, which are unchanged.
**Status:** the spec every Case Flow block conforms to. Day 1 is written; Days 2–5 follow the same pattern.

| File | What it is |
|---|---|
| `js/cm-case-flow-data.js` | **The source of truth.** Case file, days, modules, blocks, quizzes, the theory plan. |
| `js/cm-case-flow.js` | Turns the data into this course's own day and lesson objects and wires them in. |
| `build/case-flow/curriculum.cjs` | Writes `dayN.md` and `traceability.md` from the data, and validates the curriculum's rules. |
| `curriculum/5-day-flow/day1.md` | The per-block curriculum spec (generated). |
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
| Lead Counsel | Atty. Elijah Thone — approves all strategy, demands and filings |
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

### The critical fact — the 14-Day Treatment Gap

First treatment 02/20/2026, fourteen days after the loss, then disrupted care mid-treatment. Every day engages it:

| Day | How the gap appears |
|---|---|
| 1 | Flagged during intake and in the case plan's risks band |
| 2 | Probed with the client; justified with medical documentation |
| 3 | Used by the adjuster as a causation defense; countered with the MRI |
| 4 | The adjuster's stonewall on it triggers the litigation fork |
| 5 | Defended in deposition prep |

Every block's card carries a **continuity strip**: case · counsel · stack · critical fact.

---

## 3. Sequential integrity

Case Flow Day N opens when the Day N-1 Knowledge Check is passed (70%), for trainees; admins and Trainee view see every day. Each day states its gate:

| Day | Gate to the next |
|---|---|
| 1 Fundamentals & Intake | CMS initialized · stack verified at $40,000 · Regulatory Triple-Check cleared · case plan routed |
| 2 Claims & Pre-Demand | LORs to all three carriers · treatment documented · specials totaled |
| 3 Demands & Settlements | demands served · negotiation exhausted · liens resolved · net sheet closed |
| 4 Litigation Fork | impasse documented · file in litigation status |
| 5 Dispute Resolution & Litigation | — |

Day 3's pre-litigation settlement always comes before Day 4's litigation fork: the fork is legitimate only because the negotiation was genuinely attempted.

---

## 4. The rhythm and the block

Every module, every day: **Lesson → Skill Activity → Lesson → Skill Activity → Knowledge Check.** Five blocks, four modules, 20 blocks a day. The build rejects a module that breaks it.

Each block is one topic in this course's own lesson shape, drawn over two slides:

| Block | Slide 1 | Slide 2 |
|---|---|---|
| Lesson | **Tell Them** (why + rules + UPL boundary) · **Show Them** (the visual) | Trigger ➔ Task ➔ Tool ➔ Checkpoint · Best Practices & Pitfalls · rubric |
| Skill Activity | **Let Them** (scenario, prompt, tool, expected output) · reference model | Verification checkpoints · operational mapping · Best Practices & Pitfalls · rubric |
| Knowledge Check | Knowledge verification questions | **Self-Summary & Skill Scale** (saved, AI-reviewed) · rubric |

The same block also fills the course's native fields (`fourPart`, `layout`, `trainerCue`), so search, the SOP and Presenter view read it like any other topic.

### The six components, and where each lives

| Component | On the trainee's slide | Elsewhere |
|---|---|---|
| Slide Title & Topic | Header, separator (day · module · block · part) | Curriculum spec |
| Visual Layout Description | — | Curriculum spec, for whoever designs the slide |
| Slide Body: Tell / Show / Let | ✓ | Curriculum spec |
| Knowledge Check & CM Summary | ✓ (module's check block + the day's quiz) | Curriculum spec |
| Assessment Criteria (AI + Trainer) | ✓ (collapsed) | Curriculum spec |
| Speaker Notes | — (never on the shared screen) | **Presenter view** (`SLIDE_SCRIPTS`) and the curriculum spec |

### Operational mapping

`Trigger Event ➔ Case Manager Task ➔ Tool/Interface ➔ Verification Checkpoint` on every lesson and activity. The checkpoint is the gradeable field.

---

## 5. Scoring — 60% automated, 40% trainer

| Channel | What feeds it | Where it is stored |
|---|---|---|
| **Automated (60%)** | The module's share of the day's Knowledge Check (multiple choice, auto-scored; the day needs 70%) and the AI evaluator's score of the Self-Summary against the module's rubric (`runRubricEvaluation`) | `case-flow` personal key, synced to the cloud with the trainee's progress |
| **Trainer (40%)** | Qualitative performance, strategy, tone, UPL, the self-summary | The same record (`trainer: {score, comment}`) — **an admin screen to enter it is not built yet** |

**Composite** = automated × 0.60 + trainer × 0.40, shown once both are in. **UPL is a gate, not a weighting:** legal advice fails the UPL criterion whatever the composite, and the AI evaluator is told to score Risk Mitigation 0 when it sees it.

The **Skill Scale** (1 Not yet — 5 Can explain it to a peer) is compared with the scores; a wide gap either way is a coaching signal.

---

## 6. How it attaches to the course

- **Days 11–15**, found by `DAYS.find` / `DAYS.some` but not in `DAYS`: everything that counts the program — "x of 5 days", the certificate, attendance, the SOP — still counts Days 1–5. `completedCount()` and `avgScore()` are scoped to Days 1–5 so a Case Flow pass can't push the program past 100%.
- **Dashboard:** the track's own row under Days 1–5, with the upcoming days shown as "In development".
- **Load order:** `cm-case-flow-data.js`, then `cm-case-flow.js`, right after `graded-calls.js` (its dashboard wrapper must run on the finished page; it wraps `renderLessonCard` after `cm-skillbuilders.js`). Both are in `build/build.py`, so a rebuild from the EA/PA engine keeps them, and in its list of required scripts.
- **The universal layout:** the cards are built from the engine's own pieces and the page's tokens (`--font-ui`, the navy/orange palette), and add nothing to the top bar.

---

## 7. Legacy extraction

| Source | Used for |
|---|---|
| This course, `build/day1.js`–`day5.js` | Most of the theory. Cited on each block as `D<day>#<topic>`. |
| LSH firm curriculum (Claims Specialist) | The No Contact Protocol (MIA clients), rental coverage hierarchy, LOR property-damage carve-out, pre-claim data set — doctrine this course doesn't carry. Cited by name. |
| Newly authored | The $40,000 host-passenger stack, the recovery-stack-vs-payer-order distinction, the skip-trace trigger, the five-band plan. Listed in `traceability.md`. |
