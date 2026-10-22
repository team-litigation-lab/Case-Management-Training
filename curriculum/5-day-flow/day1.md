# Case Flow Day 1 — Intake, Claims & Property Damage

**Phase:** Intake, claims & Property Damage · **Focus case:** John Doe v. Robert Smith · **Lead Counsel:** Atty. Elijah Thorne

**Objective.** Know the Case Manager's role and the six stages of a file; meet John Doe and his case; hold the UPL line; read the raw file, make the acceptance decision and see which claims the file will carry; open the matter correctly in the CMS with the Conflict Check first; and set up the Property Damage side (the client's do's and don'ts, the rental, the repair or total-loss path).

**Gate to the next day.** Matter opened in the CMS with the Conflict Check documented · acceptance decision recorded · the claims the file carries identified · PD onboarding directions delivered and assigned in the system

**The file as this day opens.**

- A raw file from “On the Records”: date of loss 02/06/2026, statute of limitations 02/06/2028; the client's position and the facts of loss are in the Police Report, to be read, not assumed.
- Nothing is in the CMS yet: no Conflict Check, no matter, no parties.
- A parked Civic was damaged in the crash; whose Property Damage claim and rental it is has yet to be worked out from the records.
- John Doe has not started treatment.

> Generated from `js/cm-case-flow-data.js` by `build/case-flow/curriculum.cjs`. Edit the data and regenerate; never edit this file by hand. Spec: `00-architecture.md`. Theory map: `traceability.md`.

## Case continuity anchors

| | |
|---|---|
| **Case** | John Doe v. Robert Smith (LSH-2026-MVA-770412) — MVA — passenger injury |
| **Lead Counsel** | Atty. Elijah Thorne |
| **Date of loss** | 02/06/2026 · **SOL** 02/06/2028 (Docketed on a two-year limitation for this training file. Confirm the governing state's statute before relying on it.) |
| **Client** | John Doe — Front-seat passenger in the host vehicle |
| **Policy stack** | $10,000 BI / $20,000 HOST UM / $10,000 REL UM = **$40,000** |
| **Health plan** | Peach State Health Plan · PSH-55017742 · GRP-41208 |
| **Critical fact** | Initial 14-Day Treatment Gap, then disrupted care mid-treatment. |

## This day's module

The day is one module, on John Doe's one file: Lectures (its lessons, one uninterrupted discussion) → Practice (its Skill Activities on the file in the CMS, in the order the work happens) → Knowledge Check. A lesson marked (condensed) is a short overview.

**Module 1 — Intake, Claims & Property Damage**

1. *Lesson* — The Case Manager's Role
2. *Lesson* — Meet Your Case: John Doe v. Robert Smith
3. *Lesson* — Fact Sharing vs. Legal Advice: the UPL Line
4. *Lesson* — Ingesting the Raw File
5. *Lesson* — The Acceptance Decision & the Three-Pillar Case Plan
6. *Lesson* — Client Do's and Don'ts & Rental Authorization
7. *Lesson* — Repair Estimates, Total Loss & Loss of Use
8. *Skill Activity* — Opening John Doe's File in the CMS
9. *Skill Activity* — Client Onboarding Direction Packet
10. *Skill Activity* — Onboarding Direction Assignment in System
11. *Skill Activity* — Whose Rental Is It? The Civic Investigation
12. *Knowledge Check* — CM Fundamentals Knowledge Check
13. *Knowledge Check* — PD & Onboarding Knowledge Audit

**End-of-day discussion (trainer):** Robert Smith's carrier has already called John Doe, and he needs a car to get to work. What do you tell him today, in what order, and what has to be on the file before tomorrow's claim set-up?

---

## Module 1 — Intake, Claims & Property Damage

**Order:** Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Knowledge Check ➔ Knowledge Check

### 1.1.1 The Case Manager's Role

> **Lesson** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with CM Fundamentals Knowledge Check (`d1m1`)  
> **Topic:** Owning the file from intake to resolution  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#1` Training Agenda & What Case Management Is · `D1#2` The General Case Management Process · `D1#3` Key Duties of a Case Manager · `D1#4` Understanding Case Phases

#### 1 · Visual Layout Description

A single horizontal case-lifecycle track across the slide: eight rounded stations left to right — Intake, Claim Set-Up, Treatment, Pre-Demand, Demand, Settlement & Liens, Disbursement, Litigation (the last drawn dashed, as the fork). Above the track a navy band, THE CASE MANAGER OWNS THE MOVEMENT, runs the full width; below it a thinner orange band, ATTY. THORNE OWNS EVERY LEGAL JUDGMENT. A small CMS monitor icon sits under the first station, captioned: if it isn't in the CMS, it didn't happen.

#### 2 · Slide Body — Tell Them

*Why:* Every phase of this course runs through one person: you, the Case Manager. Knowing exactly what the role owns, and where it stops, is what lets you move John Doe's file fast without crossing into legal advice.

1. Case Management is the end-to-end coordination, tracking and handling of a case from intake to resolution: timely progression, proper documentation and compliance, and effective communication between all parties.
2. You own the file's movement: deadlines, documents, carriers, providers and the client's updates. Atty. Thorne owns every legal judgment: value, merits, strategy and settlement authority.
3. A case moves through phases (intake, claim set-up, treatment, pre-demand, demand, settlement and liens, disbursement, and litigation if it forks), and each phase has its own goals and deliverables.
4. Your key duties: client communication, case progress monitoring, task compliance, case updates and summaries, document drafting and filing, case health analysis, and planning recommendations to counsel.
5. The CMS is the single source of truth. Every contact, document, deadline and decision is logged there the same day; if it isn't in the CMS, it didn't happen.
6. Flag risk early. A missed deadline, a silent client or a gap in treatment goes to Atty. Thorne the day you see it, with the facts and a recommended next step.

> ⚠️ **UPL boundary.** You may explain the process and confirm facts. You may not tell a client what the case is worth, whether to settle, or what the law means for them. Those are Atty. Thorne's calls.

#### 2 · Slide Body — Show Them

*Who owns what on John Doe's file*

| The Case Manager owns | Atty. Thorne owns |
|---|---|
| Opening and structuring the file in the CMS | Accepting the case |
| Every deadline, docketed with reminders | Case value and merits |
| Carrier, provider and client communication, logged | Demand strategy and amounts |
| Documents requested, named and filed | Settlement authority |
| The Case Plan draft and its risk flags | Lien compromises |
| Recommendations to counsel | Every filing and court decision |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| A new matter is assigned | Read the raw file end to end before contacting anyone | CMS → Case File | Every party, date and carrier noted before the first call |
| The client asks a legal question | Log it and route it to Atty. Thorne the same day | CMS → Communications Log · Tasks | Question routed with the facts; no opinion given |
| A deadline or risk appears | Docket it, flag it and recommend a next step | CMS → Calendar · Case File → Risk Flags | Nothing lives only in an email or in memory |

**Best practices & pitfalls**

- Own the next step: no file sits without a dated task.
- Log every client contact in the CMS the same day.
- Answer process questions yourself; route legal questions to the attorney.
- ⚠️ Pitfall: answering “what's my case worth?”, even as a guess.
- ⚠️ Pitfall: keeping the file's real status in your inbox instead of the CMS.
- ⚠️ Pitfall: waiting to flag a risk until you have fixed it yourself.

#### 3 · Knowledge Check & CM Summary

Verified in CM Fundamentals Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Role definition | Defines Case Management as end-to-end ownership of the file's movement, not data entry |
| 🤖 AI | **25%** | Ownership split | Separates the Case Manager's work from Atty. Thorne's legal judgments correctly |
| 🤖 AI | **15%** | System discipline | Treats the CMS as the single source of truth for every contact and deadline |
| 🧑‍🏫 Trainer | **25%** | Professional judgment | Knows when to act and when to route to counsel |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | No value, merits or strategy opinion offered, even informally |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with: “Whose file is it?” Let the room argue, then land it: the client's case, the attorney's judgment, your movement.
- Walk the lifecycle track once, left to right. Every day of this course sits on one or two of these stations.
- Name the UPL line now and keep naming it. The fastest way to hurt a case is a well-meant guess about its value.
- Point at the CMS icon: from today, everything the trainees do on John Doe's file happens in the CMS.

---

### 1.1.2 Meet Your Case: John Doe v. Robert Smith

> **Lesson** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with CM Fundamentals Knowledge Check (`d1m1`)  
> **Topic:** The one file you will work for five days  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · curriculum/5-day-flow/case-file.md §1–2: the file at intake, people and vehicles, the collision

#### 1 · Visual Layout Description

A case card filling the slide like a file folder: top-left the style JOHN DOE v. ROBERT SMITH in Fraunces with the matter number LSH-2026-MVA-770412 in mono beneath. Left column: a small diagram of the all-way stop at Maple Hollow Rd & Birch Ave, the pickup's arrow running the stop into the Escape's passenger door. Right column: three stacked navy-to-orange bars for the $40,000 stack (BI $10,000, Host UM $20,000, Relative UM $10,000). Along the bottom, an orange timeline strip from DOL 02/06/2026 to first treatment 02/20/2026, labelled 14-DAY TREATMENT GAP.

#### 2 · Slide Body — Tell Them

*Why:* Every lesson, activity and Learning Check in this course works one file: John Doe v. Robert Smith. Knowing its facts cold (who, when, which policies, what is at risk) is what makes every step you take in the CMS make sense.

1. The collision: 02/06/2026, about 7:10 a.m., at the all-way stop at Maple Hollow Rd & Birch Ave. Who ran the stop, which vehicles were involved and who was cited are in the Police Report: read it, don't assume.
2. Your client: John Doe, 34, a warehouse shift lead at Northgate Distribution. Lead Counsel: Atty. Elijah Thorne. Case Manager: you. Where John Doe was sitting is a fact you find in the records, not one you are given.
3. The Recovery Stack is $40,000, worked in order: $10,000 BI (Keystone Mutual) → $20,000 Host UM (Harbor Point) → $10,000 Relative UM (Cardinal State Mutual).
4. His position in the vehicle decides which of those layers he can reach. Work it out from the Police Report and the policies before you name a single carrier.
5. Health: Peach State Health Plan asserted a reimbursement right on first notice; Harbor Point carries $5,000 PIP on the Escape.
6. The critical fact: compare the EMS Run Report's date with the first treatment record. The days between them are a Treatment Gap: you record its dates and, later, John Doe's own documented explanation. You never judge it.
7. The statute of limitations is docketed for 02/06/2028. Every deadline on the file counts from the date of loss.

> ⚠️ **UPL boundary.** You may share facts and explain the process to John Doe. You may not tell him what his case is worth or what the gap does to his claim. That is Atty. Thorne's call.

#### 2 · Slide Body — Show Them

*John Doe's file at a glance*

|  | On this file |
|---|---|
| Case | John Doe v. Robert Smith · LSH-2026-MVA-770412 · motor vehicle collision |
| Date of loss / SOL | 02/06/2026 · SOL 02/06/2028 |
| Client | John Doe, 34 · his position in the vehicle: find it in the Police Report |
| Defendant | Robert Smith · what happened, and any citation: the Police Report |
| Lead Counsel | Atty. Elijah Thorne |
| Recovery Stack | $10,000 BI → $20,000 Host UM → $10,000 Relative UM = $40,000 |
| Health Plan | Peach State · reimbursement right asserted |
| Critical fact | A Treatment Gap: compare the EMS Run Report with the first treatment record |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| The course begins | Read the Case File profile and the intake documents | Case File · Case Documents | Can state the DOL, the stack and the critical fact from memory |
| The matter opens in the CMS | Check every case fact against its source document | CMS → Case File · Documents | Each fact traced to a document, none to memory |
| A fact changes | Update the CMS and tell the team the same day | CMS → Case Notes | The CMS matches the file, always |

**Best practices & pitfalls**

- Know the stack, the dates and the critical fact before the first call.
- Trace every fact to its document: Police Report, Declaration Page, medical record.
- ⚠️ Pitfall: repeating a fact from memory that the documents don't support.
- ⚠️ Pitfall: treating a gap in treatment as the client's fault rather than a fact to document.

#### 3 · Knowledge Check & CM Summary

Verified in CM Fundamentals Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Case facts | DOL, SOL, parties and John Doe's position stated correctly |
| 🤖 AI | **20%** | Recovery Stack | $40,000 in the order BI → Host UM → Relative UM |
| 🤖 AI | **15%** | Critical fact | Finds the Treatment Gap in the records and states its dates, without judging it |
| 🧑‍🏫 Trainer | **25%** | Fact discipline | Traces facts to documents rather than memory |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Shares facts, never value or merits |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Hand out nothing yet. Ask the room what they would want to know about a new file in the first five minutes, then show the case card.
- Say the stack out loud in order, twice: BI, Host UM, Relative UM. It is the spine of Days 1 to 3.
- Land the critical fact without blame: a 14-day gap is ordinary life (work, waiting it out), and the Case Manager's job is to document it, not judge it.
- Close: “From the next slide on, every fact you use comes from a document in the file, not from this card.”

---

### 1.1.3 Fact Sharing vs. Legal Advice: the UPL Line

> **Lesson** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with CM Fundamentals Knowledge Check (`d1m1`)  
> **Topic:** What you may say, and what only Atty. Thorne says  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D4#20` Ethics & Boundaries: What You Can and Cannot Do at Hearings (UPL) · LSH Claims Specialist: communication skills and professionalism — clarity without jargon, calm reassurance · Newly authored: a dedicated, practical UPL lesson: fact sharing vs. legal advice, and the hear-log-route habit

#### 1 · Visual Layout Description

A two-column board split by a red vertical line labelled THE UPL LINE. Left, a green-bordered column headed FACT SHARING · YOU, five speech bubbles in plain words: a date read from a document, the next step in the process, who decides, when an answer is due, what was sent and when. Right, a red-bordered column headed LEGAL ADVICE · ATTY. THORNE, five struck-through bubbles: what the case is worth, whether to settle, what the gap does to the claim, what the law means for him, what to tell an adjuster. Along the bottom, three mono pills: HEAR IT · LOG IT · ROUTE IT TO ATTY. THORNE, THE SAME DAY.

#### 2 · Slide Body — Tell Them

*Why:* Unauthorized Practice of Law (UPL) means giving legal advice without a law license. A Case Manager who crosses that line, even kindly, can hurt John Doe's case and put the firm at risk. The line itself is simple: you share facts and explain processes; Atty. Thorne gives every opinion on the case.

1. In plain English, legal advice is any opinion about what John Doe's facts mean for his rights, his money or his choices. Only a licensed attorney gives it.
2. You share facts: a date, an amount on a document, what a record says, who has the file, what was sent and when.
3. You explain processes: what happens next, what a form is for, how long a step usually takes, and who decides.
4. You never advise on case value, legal strategy, whether to settle, or how a fact (a gap in treatment, a prior injury, a missed visit) changes the outcome or the money.
5. When John Doe asks an opinion question, hear it, log it word for word in the CMS and route it to Atty. Thorne the same day. Then tell him when to expect an answer.
6. Reassure him about the process, never the outcome: “Atty. Thorne will go over this with you” is support; “Don't worry, you'll be fine” is advice.
7. The test before you speak: am I telling him what is, or what he should do and what it means? The first is yours; the second is Atty. Thorne's.

> ⚠️ **UPL boundary.** You share facts and explain the process. You never give an opinion on value, strategy, settlement or what a fact does to the case: log the question and route it to Atty. Thorne.

#### 2 · Slide Body — Show Them

*The same questions, answered both ways*

| ✅ Do | ❌ Don't |
|---|---|
| “The Police Report lists the date of loss as 02/06/2026.” | “Your case is probably worth the policy limits.” |
| “The next step is a letter to each insurance carrier saying we represent you.” | “I'd take the offer if I were you.” |
| “That's a question for Atty. Thorne. I've logged it, and he'll call you by Friday.” | “The gap in your treatment will hurt your case.” |
| “Carriers usually answer within a few weeks; I'll follow up and update you.” | “Don't worry, that won't matter.” |
| “I'll write down exactly what you told me, and the document that shows it.” | “Tell the adjuster it was the other driver's fault.” |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| John Doe asks what his case is worth | Say it is Atty. Thorne's question; log his words exactly | CMS → Case Notes · Tasks | Routed the same day; no figure given |
| John Doe asks what happens next | Explain the next step of the process in plain words | CMS → Case Notes | Process explained; no prediction of the outcome |
| An adjuster or provider asks your view of the case | Decline politely; share only facts the firm has approved | CMS → Communications Log | Nothing said beyond the record; contact logged |

**Best practices & pitfalls**

- Answer what is on the record; route what it means.
- Use the same routing line every time: “That's Atty. Thorne's call; I'll get it to him today.”
- Give the client a time frame for the answer, so routing never feels like a brush-off.
- ⚠️ Pitfall: a kind reassurance about the outcome (“you'll be fine”); it is still legal advice.
- ⚠️ Pitfall: guessing a value, or what a gap does to the claim, even “off the record”.
- ⚠️ Pitfall: coaching the client on what to tell an adjuster.

#### 3 · Knowledge Check & CM Summary

Verified in CM Fundamentals Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Fact vs. advice | Sorts statements into fact sharing and legal advice correctly |
| 🤖 AI | **20%** | Routing | Logs opinion questions word for word and routes them to Atty. Thorne the same day |
| 🤖 AI | **15%** | Plain words | Explains the process in plain English, without jargon |
| 🧑‍🏫 Trainer | **25%** | UPL boundary | No opinion on value, strategy, settlement or what a fact does to the case, even kindly |
| 🧑‍🏫 Trainer | **15%** | Client care | Routing comes with a time frame and a warm tone |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Ask the room: “John Doe says, ‘Just tell me honestly, is my case any good?’ What do you say?” Collect the answers before showing the board.
- Sort each answer onto the board: fact sharing or legal advice. Most rooms find at least one kind reassurance that is really advice.
- Drill the routing line until everyone can say it without notes: “That's Atty. Thorne's call; I've logged it, and he'll get back to you by …”
- Close: every later lesson carries a UPL Line box. It is this lesson, applied to that step.

---

### 1.1.4 Ingesting the Raw File

> **Lesson** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with CM Fundamentals Knowledge Check (`d1m1`)  
> **Topic:** From “On the Records” to a structured matter  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#1` Training Agenda & What Case Management Is · `D1#3` Key Duties of a Case Manager · `D1#4` Understanding Case Phases · `D1#5` Case Phase: Intake — Establishing Control · `D1#6` The Real Intake Workflow · `D1#7` Intake & Initial Client Contact — Gatekeepers of Case Quality · `D1#10` Bottleneck: Incomplete Client Information · `D1#12` Bottleneck: Conflict Check Delays · `D1#13` Bottleneck: Intake Form Errors · `D1#15` Bottleneck: Communication Gaps · `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy · `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · LSH Claims Specialist: pre-claim data set, Declaration Page, coverage asymmetry

#### 1 · Visual Layout Description

Left-to-right intake pipeline across the full slide width. Left third: a muted grey stack of unsorted documents labelled RAW INTAKE, deliberately untidy. Centre: three orange-numbered gates in a row — ① Verify ② Map ③ Structure — each a navy card with the orange circle badge top-centre and a thin navy → connector between them. Right third: a clean white CMS matter card with six filled role rows, each with a green ✓. The argument is made by the contrast between the grey untidy left edge and the crisp white right edge. Beneath the pipeline, a full-width orange-bordered strip holds the case's four continuity anchors as mono pills.

#### 2 · Slide Body — Tell Them

*Why:* The Intake Phase is where the Case Manager establishes control, structure and clarity. It is not just data collection: a file opened wrong stays wrong, because every later deadline, demand and lien check reads from the fields set in the first hour. A mis-mapped party is not a typo. It is a lost coverage layer.

1. Case Management is the end-to-end coordination, tracking and handling of a case from intake to resolution: timely progression, proper documentation and compliance, and effective communication between all parties. It is ownership, not data entry.
2. You are the gatekeeper of case quality. Confirm the intake work is complete, accurate, properly documented and ready for activation. Incomplete intake goes back, not forward.
3. Run the Conflict Check before the file is created, on the full legal name of every party (Robert Smith, the host driver, the resident relative), and record its date and result. Nothing else moves until it is done.
4. Confirm the date of loss against the Police Report, not the intake note. The statute of limitations, every carrier deadline and the treatment timeline count from it.
5. Compare the intake narrative with the Police Report and the client's statement, and check every signature and authorization before activation. Confirm and document any correction; never fix an inconsistency silently.
6. Docket the statute of limitations on day one. On this file: 02/06/2028.
7. Map every party to a role. Six roles exist on this file, and a party left as “unknown” is a coverage layer you have not found yet.
8. Record the client's position in the vehicle. Driver, passenger or pedestrian decides which policies can be reached.
9. Collect the full pre-claim data set (client basics, every driver and vehicle, insurance from the Police Report or the client, witnesses) and the emergency contact. Clients go quiet, and the emergency contact is the channel that still reaches them.
10. Read coverage off the Declaration Page, not a summary, and record the source of every coverage fact: Dec Page, adjuster letter or Police Report.
11. Expect asymmetry. First-party carriers disclose limits readily; a third-party BI carrier usually asks for documents first and runs its own investigation.
12. Name every document to the firm's convention on ingest, and keep the CMS as the single source of truth, not side emails.

> ⚠️ **UPL boundary.** You may confirm facts and explain the process. You may not tell the client what the case is worth or whether they have a claim. That is Atty. Thorne's call.

#### 2 · Slide Body — Show Them

*The six roles on John Doe's file, and what each one unlocks*

| Role | Party | Why this field matters |
|---|---|---|
| Client / Plaintiff | John Doe | Position in the vehicle, read from the Police Report. This field decides which UM layers open. |
| Defendant | Robert Smith | At-fault driver. His BI carrier pays first. |
| Lead Counsel | Atty. Elijah Thorne | Every demand and filing routes through him. |
| Case Manager | You | Owns the file's movement; does not own legal judgment. |
| Host driver | Operator of John Doe's vehicle | Source of the $20,000 Host UM layer. |
| Resident relative | John Doe's household relative | Source of the $10,000 Relative UM layer. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Raw file received from “On the Records” | Run and document the Conflict Check, then verify DOL, parties and signatures against the source documents | CMS → New Case | Conflict Check logged before the file exists; DOL matches the Police Report |
| Matter created | Docket the SOL and log the retainer and the claim-specific HIPAA authorization | CMS → Calendar · Documents | SOL 02/06/2028 on the calendar; both signatures logged |
| Parties identified | Map all six roles and record the client's position in the vehicle | CMS → Parties | No party left “unknown”; position recorded from the Police Report |
| Documents arrive | Name each to the firm's convention and file it under its CMS category | CMS → Documents | Every document findable by its convention name |

**Best practices & pitfalls**

- Record the source of every coverage fact (Dec Page, adjuster letter, Police Report).
- Docket the statute of limitations on day one.
- Request missing documents in one consolidated message, with a deadline.
- Use the CMS as the single source of truth, not side emails.
- ⚠️ Pitfall: creating the file before the Conflict Check is documented.
- ⚠️ Pitfall: running the Conflict Check on a nickname or partial name.
- ⚠️ Pitfall: rewriting a vague summary from memory instead of confirming the facts with the client.
- ⚠️ Pitfall: accepting a case because intake “mostly” looks fine.

#### 3 · Knowledge Check & CM Summary

Verified in CM Fundamentals Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Conflict Check first | Conflict Check documented before the file is created |
| 🤖 AI | **20%** | DOL and SOL | DOL 02/06/2026 matched to the Police Report; SOL 02/06/2028 docketed |
| 🤖 AI | **25%** | Role completeness | All six roles populated, none left blank or “unknown”, client recorded as a passenger |
| 🧑‍🏫 Trainer | **25%** | Verification discipline | Cross-checked the sources rather than accepting the intake note |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | No valuation or merits opinion offered to the client |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open by asking the room: “What is the single most expensive mistake you can make in the first hour of a file?” Let them answer, then show the passenger field.
- The passenger fact is the whole lesson. John Doe owns no car and has no auto policy of his own, so every UM dollar comes through someone else's policy. As a passenger in the host vehicle he reaches $40,000. Same crash, same injuries, four times the recovery, decided by one field.
- Stress that “On the Records” files arrive unverified. A trainee who treats the intake note as fact carries its errors into the demand.
- Name the UPL line now. It comes back every day of this program.

---

### 1.1.5 The Acceptance Decision & the Three-Pillar Case Plan

> **Lesson** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with Case Plan Audit & the Claim Set Up Gate (`d1m4`)  
> **Topic:** The document that makes the file move  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#8` Case Acceptance Determination · `D1#14` Bottleneck: Case Eligibility Uncertainty · `D1#17` Skill Building: Intake Decision Challenge & Applied Case Manager Actions · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#21` Case Study: John Doe v. Apex — Liability Determination · `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#23` Case Planning Framework: The Three-Pillar Case Plan

#### 1 · Visual Layout Description

A five-band vertical architecture, each band a full-width navy or navy-soft bar with an orange index number at its left edge: ① CASE SNAPSHOT & ACCEPTANCE ② COVERAGE · LIABILITY · PROJECTION ③ REGULATORY TRIPLE-CHECK ④ THREE-PILLAR PLAN — the band split into three equal columns, CLINICAL · FUNCTIONAL · FINANCIAL ⑤ RISKS & FLAGS. Band ⑤ is in danger red rather than navy and visibly taller, holding one highlighted chip, 14-DAY TREATMENT GAP; that asymmetry must survive any redesign. To the right, a thin vertical routing rail with an arrow ending in a card: ATTY. ELIJAH THORNE · REVIEW, and under it a calendar chip, FILE WITHIN 30–60 DAYS.

#### 2 · Slide Body — Tell Them

*Why:* The Case Plan is the file's operating instruction. It is what Atty. Thorne reads to set strategy and what every later day executes against. A plan that hides a risk produces a strategy built on a false picture.

1. Acceptance comes first. After the verification call confirms the facts of loss, decide: Accepted, Escalated for attorney/senior review, or Declined, and record the reason so someone else can follow it.
2. At acceptance you stop gathering information and make the determination.
3. If eligibility is uncertain (ambiguous facts of loss or liability, or no clear legal assessment), clarify the facts with the client, then escalate to the attorney with a short summary of exactly what is ambiguous. Don't let the file sit in limbo.
4. State coverage, liability and projection together. You can't project a case until coverage and liability are understood, and the projection is preliminary until coverage is confirmed.
5. Liability is not final until it is confirmed by the Police Report, the driver statements and any dashcam or other evidence. Never tell the client liability is a sure thing.
6. Hold a place in the plan for the Regulatory Triple-Check (HIPAA, Medicare/Medicaid reporting, the Payer Order): it is cleared in the Treatment Phase, before the first bill is routed.
7. File the Three-Pillar Case Plan within the state's window, often 30 to 60 days, and docket the date.
8. Clinical: the acute interventions that stabilise the client (PT, specialty consults). Functional: activities of daily living and return-to-work status. Financial: how the Medical Bills get paid and what may be owed back from the recovery, worked out in the Treatment Phase.
9. Give every pillar measurable goals, and every action item an owner and a date.
10. Flag adverse facts prominently. A risk buried in prose has not been disclosed to counsel.
11. The plan proposes operational steps. It does not set legal strategy; route it to Atty. Thorne before acting on anything that commits the firm's position.

> ⚠️ **UPL boundary.** The plan may state facts, flag risks and propose operational steps. It may not state legal conclusions, case value or settlement posture. Those are Atty. Thorne's to set, which is why the plan is routed to him.

#### 2 · Slide Body — Show Them

*The five bands, and what belongs in each*

1. **Snapshot & acceptance** — Parties, DOL, SOL, client position, phase; Accepted / Escalated / Declined with the reason.
2. **Coverage · Liability · Projection** — The three-layer stack and its order; who is responsible; a preliminary projection.
3. **Regulatory Triple-Check** — Held open: cleared in the Treatment Phase, before the first bill is routed.
4. **Three-Pillar Plan** — Clinical, Functional, Financial goals, each with an owner and a date.
5. **Risks & flags** — Adverse facts stated plainly: here, the 14-Day Treatment Gap. Routed to Atty. Thorne.

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Verification call complete | Record the acceptance decision with its reason | CMS → Case Notes | Accepted / Escalated / Declined, with a reason a colleague can follow |
| Coverage verified in writing | Draft the plan across all five bands | Action Plan Editor | All five bands present; risks band populated |
| Plan drafted | Docket the filing window and route to Atty. Thorne | Action Plan Editor → Route for review · CMS → Calendar | Routed before any position-committing action; due date on the calendar |

**Best practices & pitfalls**

- Each pillar should have measurable goals.
- Every decision needs a documented reason someone else can follow.
- When intake stalls: name where it slowed, find the root cause, act to move the file, then fix what let it happen.
- ⚠️ Pitfall: a plan that only covers clinical care.
- ⚠️ Pitfall: gathering more information at the acceptance stage instead of making the determination.
- ⚠️ Pitfall: letting an uncertain file sit in limbo instead of escalating.

#### 3 · Knowledge Check & CM Summary

Verified in Case Plan Audit & the Claim Set Up Gate (taught on Case Flow Day 2) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Band completeness | All five bands present and populated |
| 🤖 AI | **15%** | Acceptance and pillars | Decision with reason; Clinical, Functional and Financial pillars each with goals |
| 🤖 AI | **20%** | Risk flagged | The 14-Day Gap appears in the risks band |
| 🧑‍🏫 Trainer | **20%** | Risk prominence | The gap is genuinely prominent, not technically mentioned |
| 🧑‍🏫 Trainer | **20%** | Strategy/operations boundary | Proposes operational steps without setting legal strategy |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The tall red band is the design argument: risks get more room than comfort. Point at it.
- Ask: “What happens if Atty. Thorne builds a demand strategy without knowing about the gap?” The answer is the whole module.
- Draw the line between operational and legal: “Request the MRI” is operational. “This case is worth policy limits” is not the CM's to write.
- Trainees under-flag because flagging feels like admitting a weak case. Reframe: flagging early is what makes the case defensible later.

---

### 1.1.6 Client Do's and Don'ts & Rental Authorization

> **Lesson** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Protecting the claim from the client's own good intentions  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#28` Treatment Phase: Essential Client Communication Strategies · `D1#44` Handling Treatment Gaps During the Treatment Phase · LSH Claims Specialist: LOR Property Damage carve-out, rental coverage hierarchy, documents to support the claim

#### 1 · Visual Layout Description

A balanced two-column DO / DON'T board on the upper two-thirds, green-bordered left and red-bordered right, with matched pairs on the same line so each DON'T sits opposite the DO it replaces. Each row carries a small icon in the gutter. Lower third: a rental authorization flow of four connected chips — WHOSE POLICY IS PRIMARY? → WHO AUTHORIZES? → DAILY RATE CAP → DURATION LIMIT — with an orange tag under the last two: “uncovered days are the client's cost.”

#### 2 · Slide Body — Tell Them

*Why:* Most self-inflicted damage to an injury claim happens in the first two weeks, before the client has been told what not to do: a casual Recorded Statement, a missed appointment or a social-media post becomes part of the record. The Case Manager gives the instructions; what any of it means for the claim is Atty. Thorne's to explain.

1. The client gives no Recorded Statement to the adverse carrier. All adverse contact routes through the firm.
2. The client starts treatment, keeps every appointment and tells you about any barrier (transport, cost, work) before a visit is missed. Explain the process, not the stakes: what a missed visit means for the claim is Atty. Thorne's to explain.
3. The client posts nothing about the collision, the injuries or their activities.
4. The client signs no release, authorization or settlement document from any carrier until the firm has reviewed it.
5. The client keeps every receipt and out-of-pocket expense, including mileage to appointments and household help. Only what is documented can be recovered.
6. Property Damage is the one carve-out from the no-direct-contact rule. The LOR lets the adverse carrier talk to the client about the Property Damage claim only.
7. On a rental, the third-party rental is provided by the adverse carrier's Property Damage coverage. The client's own policy, or the rental company's self-insurance, is used only where there is no 3P coverage — for example a liability denial or an unresolved dispute over fault.
8. Confirm rental authorization before the client collects a vehicle: who authorizes it, the daily rate cap and the duration limit. Check for a rental reimbursement endorsement on the policy.
9. The client reports any change of address, phone number or treating provider at once.

> ⚠️ **UPL boundary.** You may deliver the firm's standing instructions and explain the process. You may not tell the client what their conduct will do to the value of the claim; give the instruction and route the question to Atty. Thorne.

> ⚠️ **UPL boundary.** The carve-out is narrow. If the adverse carrier uses a Property Damage call to ask about injuries, treatment or the facts of the loss, the call stops and routes to the firm.

#### 2 · Slide Body — Show Them

*Matched pairs: what to do, and the mistake it prevents*

| ✅ Do | ❌ Don't |
|---|---|
| Route every adverse carrier call to the firm. | Give a Recorded Statement to the other side. |
| Start treatment promptly and attend every appointment. | Let treatment lapse, or stop because you feel better. |
| Keep receipts for every accident-related cost. | Assume an undocumented expense can be claimed later. |
| Confirm rental authorization, rate cap and duration first. | Collect a rental before coverage is confirmed in writing. |
| Report any change of address, phone or provider at once. | Post about the collision, the injuries or your activities. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Retainer signed | Deliver the standing instructions and log delivery | CMS → Onboarding | Delivery logged with date and method |
| Client asks about a rental | Confirm the primary policy, the authorization, the rate cap and the duration | CMS → Property Damage | All rental parameters recorded before collection |
| Adverse carrier calls the client directly | Instruct the client to route it to the firm; log the contact | CMS → Communications Log | No Recorded Statement; contact logged |

**Best practices & pitfalls**

- Educate the client on why consistent treatment matters, not just that it does.
- Use active listening; a client who feels heard follows instructions.
- ⚠️ Pitfall: explaining why a Recorded Statement hurts the claim; that is legal advice. Give the instruction.

#### 3 · Knowledge Check & CM Summary

Verified in PD & Onboarding Knowledge Audit (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Instruction coverage | All standing instructions present, including the Property Damage carve-out |
| 🤖 AI | **20%** | Rental hierarchy | Personal policy primary; written denial before rental-company self-insurance |
| 🤖 AI | **15%** | Delivery logged | Date and method of delivery recorded |
| 🧑‍🏫 Trainer | **25%** | Client-facing clarity | Delivered so a stressed client would actually follow them |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Instruction given without opining on claim value or legal effect |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Run the matched pairs as call-and-response: read a DON'T, have the room give you the DO.
- The treatment instruction matters most on this file. John Doe's gap is already forming; say so.
- Rental is where clients get hurt financially. Uncovered days come out of their pocket, and they will blame the firm if nobody told them the limit.
- Watch for trainees explaining why a Recorded Statement hurts the claim. That slides into legal advice; the instruction is the deliverable.

---

### 1.1.7 Repair Estimates, Total Loss & Loss of Use

> **Lesson** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Repair, or total? And what the client is owed either way  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#6` Master Audit Checklist: Property Damage (PD) Deep Dive · `D5#34` Property Damage in Litigation: Types of Damages You Can Recover · `D5#35` Property Damage: Calculating the Value of the Claim · LSH Claims Specialist: 5-day inspection window, Loss of Use, tow and storage

#### 1 · Visual Layout Description

A horizontal threshold gauge dominates: a long bar running from pale on the left to orange and then navy on the right, with a bold vertical THRESHOLD marker about three-quarters along. Left of the marker, REPAIR — carrier pays to fix; right of it, TOTAL LOSS — carrier pays ACV. A repair-estimate chip and an ACV chip sit above the bar to show the comparison. Below, a three-step strip: ① Estimate vs. final bill ② Compare against ACV ③ Confirm the carrier's basis in writing. Bottom-right, a navy card lists what is owed either way: storage, towing, Loss of Use.

#### 2 · Slide Body — Tell Them

*Why:* Property Damage settles long before the injury claim, and it is the client's first test of whether the firm is competent. It is also physical evidence of how hard the impact was, so audit it as carefully as the medicals.

1. Get the written Repair Estimate before discussing any outcome with the client. No estimate, no position.
2. Give the carrier a defined window to inspect the vehicle (the firm's standard is 5 days from the letter) and record the date it opens.
3. Compare the insurance estimate with the final body shop bill. Supplementals are often the best proof of hidden structural damage.
4. Audit the photos for a clear point of impact, including the undercarriage and frame.
5. A vehicle is a Total Loss when the cost to repair reaches the carrier's threshold measured against its actual cash value. Confirm the threshold basis the carrier is applying, in writing.
6. Actual cash value is the pre-loss market value: not what is owed on the loan, and not the cost of a new replacement. Verify the Valuation Report (e.g. CCC One) so the client isn't lowballed.
7. Courts value Property Damage on the “lesser of” rule: the cost of repair, or the drop in market value from before to after the loss.
8. Storage and towing accrue daily. Settle the disposition quickly or the charges eat the recovery.
9. Loss of Use is claimable for each day the client is without a vehicle, measured by a comparable rental, separately from the repair or ACV payment. The authority is state law (for example, Nevada: Dugan v. Gotsopoulos, 117 Nev. 285 (2001), cited in the firm's own LOR template); confirm the governing rule for the file.
10. Document and escalate a disputed valuation; don't argue it ad hoc with the adjuster.

> ⚠️ **UPL boundary.** You may gather estimates, report figures and explain the process. You may not advise the client whether to accept a valuation or tell them what their vehicle is legally worth. Asserting the loss-of-use claim is counsel's position.

#### 2 · Slide Body — Show Them

*Repair or total, and what the client is owed either way*

| Question | What you verify | What it changes |
|---|---|---|
| Is there a written estimate? | The estimate exists and is in the file | Without it, nothing is discussed with the client |
| Estimate vs. final bill | Supplementals on the body shop's final bill | Hidden structural damage; impact severity for the injury claim |
| Repair cost vs. ACV | The repair figure against pre-loss market value | Whether the carrier repairs or declares a Total Loss |
| What basis is the carrier using? | The threshold and the Valuation Report, in writing | Which side of the line the vehicle falls on |
| How long in storage? | Daily storage and towing | Delay erodes the recovery |
| Is the client without transport? | The dates without a vehicle | Loss of Use, claimed separately |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Repair Estimate received | Log it; compare with ACV and, later, the final bill | CMS → Property Damage | Estimate on file; comparison recorded |
| Carrier states a disposition | Confirm the threshold basis and the Valuation Report in writing | CMS → Property Damage → Correspondence | Basis confirmed, not assumed |
| Client is without a vehicle | Record the dates and open the loss-of-use claim | CMS → Property Damage → Loss of Use | Dates recorded; claimed separately |

**Best practices & pitfalls**

- Supplementals are often the best proof of hidden structural damage.
- Verify the Valuation Report so the client isn't lowballed on the vehicle's value.
- ⚠️ Pitfall: working only from the initial estimate.
- ⚠️ Pitfall: treating Property Damage as “just the car”; it is evidence for the injury claim.

#### 3 · Knowledge Check & CM Summary

Verified in PD & Onboarding Knowledge Audit (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Estimate logged | Written estimate recorded before any client discussion; inspection window dated |
| 🤖 AI | **25%** | ACV comparison | Repair figure against pre-loss market value, not the loan balance |
| 🤖 AI | **20%** | Loss of Use opened | Dates recorded and claimed separately from the repair or ACV payment |
| 🧑‍🏫 Trainer | **25%** | Threshold reasoning | Knows what ACV is and is not, and confirms the basis rather than assuming it |
| 🧑‍🏫 Trainer | **15%** | Client handling | Explained the process without advising on acceptance or legal value |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The recurring misconception is that ACV equals the loan balance. Correct it the moment it appears.
- Storage is the silent cost. Ask: “Who is paying for every day this car sits?”
- Loss of Use is the most often forgotten item. On this file it is not John Doe's to claim: ask the room whose car the Civic is, and make them prove it from the Police Report and the intake. His own need is a ride to treatment he hasn't started.
- Day 5 reopens this with Diminished Value and the Property Damage dispute lab. Today is the threshold; Day 5 is the fight.

---

### 1.1.8 Opening John Doe's File in the CMS

> **Skill Activity** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with CM Fundamentals Knowledge Check (`d1m1`)  
> **Topic:** Skill Activity — from raw file to an active matter  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#5` Case Phase: Intake — Establishing Control · `D1#6` The Real Intake Workflow · `D1#7` Intake & Initial Client Contact — Gatekeepers of Case Quality · `D1#12` Bottleneck: Conflict Check Delays · `D1#13` Bottleneck: Intake Form Errors

#### 1 · Visual Layout Description

The CMS New Case screen as a large mock-up on the left two-thirds: a Conflict Check panel at the top with a green LOGGED stamp, then the matter fields (DOL, SOL, client position) with two fields outlined in orange where the draft was wrong. On the right, a vertical checklist of the intake documents (intake sheet, supplement, CMS record, retainer, HIPAA, Police Report), each with a filed tick and its CMS category in mono type.

#### 2 · Slide Body — Let Them

**Scenario.** 02/09/2026. The raw file from “On the Records” is in: the New Client Intake Sheet, the intake supplement, the signed retainer and claim-specific HIPAA authorization, and the Riverton PD crash report. A colleague keyed a draft intake record into the CMS. Atty. Thorne wants the matter active today.

**Execution prompt.** Open John Doe's matter in the CMS. Run and document the Conflict Check on every party's full legal name before anything else. Verify the draft intake record field by field against the source documents (date of loss, names and roles, John Doe's position, date of birth, report number) and correct each error with its source, never silently. Docket the SOL (02/06/2028) with reminders, map all six roles, log the retainer and the HIPAA authorization, and file every intake document under its CMS category, named to the firm's convention. Route a short note of what you corrected to Atty. Thorne.

| | |
|---|---|
| **Tool / interface** | CMS → New Case · Parties · Calendar · Documents · Case Notes |
| **Expected output** | An active matter: Conflict Check logged first, every field verified against its source, six roles mapped, SOL docketed, intake documents filed, corrections noted to Atty. Thorne. |

**Verification checkpoints**

- [ ] Conflict Check documented before the matter was created, on full legal names
- [ ] Date of loss 02/06/2026 confirmed against the Police Report; SOL 02/06/2028 docketed with reminders
- [ ] John Doe recorded as the front-seat passenger, not the driver
- [ ] Errors caught and corrected with their source: the position and the date of birth in the draft record, the transposed report number on the intake sheet
- [ ] All six roles mapped; none left “unknown”
- [ ] Retainer and HIPAA authorization logged with their signing date (02/09/2026)
- [ ] Every intake document filed under its CMS category and named to convention
- [ ] Corrections summarized to Atty. Thorne in Case Notes

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Raw file received | Run and document the Conflict Check on full legal names | CMS → New Case | Conflict Check logged before the matter exists |
| Draft record keyed | Verify every field against its source document and correct with the source | CMS → Case File · Documents | No field accepted from the draft unchecked |
| Matter active | Docket the SOL, map the parties, file the intake documents | CMS → Calendar · Parties · Documents | SOL 02/06/2028 with reminders; six roles; every document filed |

**Best practices & pitfalls**

- Verify against the Police Report and signed documents, not the draft.
- Note every correction and its source in Case Notes.
- ⚠️ Pitfall: accepting “Driver” in the position field because it was pre-filled.
- ⚠️ Pitfall: filing documents before naming them to the convention.

#### 3 · Knowledge Check & CM Summary

Verified in CM Fundamentals Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Conflict Check first | Documented before the matter was created, on full legal names |
| 🤖 AI | **25%** | Field verification | Position, date of birth and report number corrected with their sources |
| 🤖 AI | **20%** | Matter set-up | SOL docketed with reminders, six roles mapped, intake documents filed by category |
| 🧑‍🏫 Trainer | **25%** | Verification discipline | Checked every field against a document rather than the draft |
| 🧑‍🏫 Trainer | **15%** | Communication | Corrections routed to Atty. Thorne in a short, factual note |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Give the room ten minutes in the CMS before you say anything about the planted errors.
- Ask who changed the position field and on what evidence. The answer must be a document: the Police Report and the intake sheet.
- If someone corrects the date of birth without noting the source, stop them: an unexplained change is a new error.
- Close by opening the Case Notes: the note to Atty. Thorne is part of the work, not an extra.

---

### 1.1.9 Client Onboarding Direction Packet

> **Skill Activity** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Skill Activity 1 — assemble what the client gets on day one  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#28` Treatment Phase: Essential Client Communication Strategies · `D1#44` Handling Treatment Gaps During the Treatment Phase · LSH Claims Specialist: client communication protocol

#### 1 · Visual Layout Description

An exploded packet: a central navy folder with six document cards fanned around it in a semicircle, each numbered with an orange badge — ① Do's and Don'ts ② Treatment directions ③ Property Damage and rental ④ Communication protocol ⑤ Document retention ⑥ Firm contacts and escalation path — each showing two or three bullet previews in small type. Beneath the fan, a delivery bar of three chips: PREPARED → DELIVERED → LOGGED, the third noting the required date and method.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe's retainer is signed and the matter is open in the CMS. Nothing has been sent to him yet, and he has already had one call from Robert Smith's carrier.

**Execution prompt.** Assemble John Doe's onboarding Direction Packet. Build all six sections, populate each with the firm's standing instructions, and make the Property Damage section specific to this file: from the records, state whose vehicle and claim it is. Given that the adverse carrier has already called him, state which instruction is now most urgent and how you will confirm he has understood it. Then log delivery.

| | |
|---|---|
| **Tool / interface** | CMS → Onboarding → Direction Packet |
| **Expected output** | A complete, delivered and logged onboarding packet specific to John Doe's file. |

**Verification checkpoints**

- [ ] All six packet sections present and populated
- [ ] The standing instructions all appear in the Do's and Don'ts
- [ ] Treatment direction stated, given that treatment has not begun
- [ ] Property Damage section states, from the records, that the PD and rental claim belong to the Civic's owner, not the client
- [ ] Communication protocol routes all adverse carrier contact to the firm
- [ ] Firm contacts list Atty. Elijah Thorne as Lead Counsel
- [ ] Delivery logged with date and method
- [ ] The adverse-contact instruction named as the urgent one, with a confirmation step

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Retainer signed | Assemble the six sections | CMS → Onboarding | All six present |
| Adverse carrier has called | Prioritise the communication instruction | Phone · CMS → Communications Log | Client confirms he understood |
| Packet ready | Deliver and log | CMS → Onboarding | Date and method recorded |

**Best practices & pitfalls**

- A confirmation step means more than sending: ask how you will know he read it.
- ⚠️ Pitfall: a generic packet that ignores what has already happened on the file.

#### 3 · Knowledge Check & CM Summary

Verified in PD & Onboarding Knowledge Audit (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Section completeness | All six sections present |
| 🤖 AI | **20%** | Instruction completeness | All standing instructions appear |
| 🤖 AI | **10%** | Counsel named correctly | Atty. Elijah Thorne as Lead Counsel |
| 🤖 AI | **10%** | Delivery logged | Date and method recorded |
| 🧑‍🏫 Trainer | **25%** | Prioritisation | Named the adverse-contact instruction as urgent and built a real confirmation step |
| 🧑‍🏫 Trainer | **15%** | Client usability | Usable by a layperson under stress |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The scenario detail, that the carrier has already called, is the graded judgment. A generic packet misses the point.
- Have them read their treatment direction aloud. If it doesn't create urgency about starting care, it won't prevent the gap.
- Role-play receiving one packet as John Doe: confused, in pain, and already contacted by the other side.

---

### 1.1.10 Onboarding Direction Assignment in System

> **Skill Activity** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Skill Activity 2 — turn directions into tracked tasks  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#3` Key Duties of a Case Manager · `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy · `D1#44` Handling Treatment Gaps During the Treatment Phase

#### 1 · Visual Layout Description

A CMS task board in three columns — ASSIGNED · DUE · VERIFIED — with direction cards moving across them. Each card carries an owner chip (Client or CM), a due date and a small verification icon. Four cards are placed as examples; four wait in the left column for the trainee's owners and dates. One card is deliberately mis-assigned, with the client as owner of a task only the firm can do, and carries a red overdue flag; trainees must catch and reassign it. A slim legend in the right margin maps chip colour to owner.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe's onboarding packet has been delivered and logged. The directions now need to become tracked obligations, not a document he was sent once.

**Execution prompt.** Assign John Doe's onboarding directions in the system as tracked tasks. For each, set the owner, the due date and how it will be verified. One staged card has the wrong owner: find it, reassign it, and record why it could never have been the client's task. Then schedule the follow-up that confirms he has started treatment.

| | |
|---|---|
| **Tool / interface** | CMS → Tasks |
| **Expected output** | A tracked task set with correct owners, dates and verification methods. |

**Verification checkpoints**

- [ ] Every direction has an owner
- [ ] Every task has a due date
- [ ] A verification method recorded for each task
- [ ] The mis-assigned card found and reassigned to the firm
- [ ] The reason for reassignment recorded
- [ ] Treatment-start follow-up scheduled
- [ ] No task left without a date

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Packet delivered | Turn each direction into a task | CMS → Tasks | Owner, date, verification on each |
| Mis-assigned task found | Reassign to the firm with the reason | CMS → Tasks | Reason recorded |
| Treatment not yet started | Schedule the treatment-start follow-up | CMS → Tasks · Calendar | Follow-up dated |

**Best practices & pitfalls**

- Use task trackers so a gap in treatment is visible the day it starts.
- Ask of every task: how will you know this happened?
- ⚠️ Pitfall: tracking tasks without confirming they were done correctly.

#### 3 · Knowledge Check & CM Summary

Verified in PD & Onboarding Knowledge Audit (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Assignment completeness | Owner, due date and verification method on every task |
| 🤖 AI | **25%** | Mis-assignment caught | The wrongly owned card found and reassigned |
| 🤖 AI | **15%** | Follow-up scheduled | Treatment-start confirmation task with a date |
| 🧑‍🏫 Trainer | **25%** | Ownership judgment | Knows which obligations can never be handed to the client |
| 🧑‍🏫 Trainer | **15%** | Tracking discipline | Dates are realistic and verification methods are actually verifiable |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The planted mis-assignment is the graded element. Don't hint at which card it is.
- Press on verification: “How will you know this happened?” A task with no verification is a hope, not a task.
- The treatment follow-up is the hinge into Day 2. John Doe's gap becomes undeniable there; this task is what would have caught it.

---

### 1.1.11 Whose Rental Is It? The Civic Investigation

> **Skill Activity** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Skill Activity 3 — investigate the PD and rental claim from the records  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#28` Treatment Phase: Essential Client Communication Strategies · `D1#44` Handling Treatment Gaps During the Treatment Phase · LSH Claims Specialist: LOR Property Damage carve-out, rental coverage hierarchy, documents to support the claim

#### 1 · Visual Layout Description

An evidence board: four document cards (Police Report, Intake Sheet, Intake Supplement, Keystone PD letter) pinned in a row, each with one highlighted field and a red string running to a central card that reads OWNER · CLAIMANT · OUR CLIENT? with three blank lines.

#### 2 · Slide Body — Let Them

**Scenario.** 02/11/2026. Keystone PD (Leah Moran) emails the firm to confirm the claimant on the 2019 Honda Civic so a rental can be set up once liability is decided. John Doe calls: he needs a car to get to his first appointment and asks whether the rental is his. Nobody has yet written down whose claim it is.

**Execution prompt.** Before anyone answers John Doe, investigate. From the Police Report, the Intake Sheet, the Intake Supplement and the CMS Intake Record, establish where John Doe was in the collision, who owns the Civic and who the PD and rental claimant is. Write the finding as a CMS Case Note that cites each source, decide whether John Doe has a Property Damage or rental claim of his own, and report it to Atty. Thorne. Then answer John Doe's call within the UPL line and solve his real problem: a ride to treatment.

| | |
|---|---|
| **Tool / interface** | CMS → Case Notes · CMS → Property Damage · Call Simulator |
| **Expected output** | A sourced Case Note naming the Civic's owner and the PD and rental claimant, a report to Atty. Thorne, and a logged call with John Doe that arranges his transportation without advising anyone on the claim. |

**Verification checkpoints**

- [ ] John Doe's position in the collision taken from the Police Report, not assumed
- [ ] The Civic's owner named from the Police Report and the Intake Supplement
- [ ] The PD and rental claimant named from the owner, with the Intake Record's carrier line
- [ ] Conclusion recorded: John Doe has no PD or rental claim of his own
- [ ] Each finding cites its source document and page
- [ ] Atty. Thorne told the same day; the owner's claim left to the owner and the attorney
- [ ] No advice to John Doe or the owner about the PD claim or its value
- [ ] John Doe's transportation to treatment arranged or escalated

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Rental authorization arrives | Read the records before answering anyone | CMS → Documents | Owner and claimant found in the file |
| Ownership established | Write the sourced Case Note | CMS → Case Notes | Each fact cites its document |
| Client asks about the rental | State the fact, route the claim question to Atty. Thorne, arrange his rides to care under the LOP or reimbursed, not on the PD rental | Call Simulator · CMS → Tasks | Call logged; transportation task dated |

**Best practices & pitfalls**

- Read the Police Report's vehicle and occupant boxes before you set up any PD claim.
- Ask of every claim: who owns it, and is that person our client?
- ⚠️ Pitfall: setting up a rental in the client's name because he is the one who called.

#### 3 · Knowledge Check & CM Summary

Verified in PD & Onboarding Knowledge Audit (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Evidence | Position, owner and claimant each taken from a named record |
| 🤖 AI | **20%** | Conclusion | No PD or rental claim for John Doe; whose claim it is, stated |
| 🤖 AI | **15%** | UPL boundary | Nothing said to John Doe or the owner about the claim's merits or value |
| 🧑‍🏫 Trainer | **25%** | Investigative reasoning | Reconciles the records and notices what the client's call assumes |
| 🧑‍🏫 Trainer | **15%** | Client care | Solves the real need, a ride to treatment, the same day |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Don't tell the room whose car it is. The Police Report's Unit 3 box and the Intake Supplement settle it; make them find both.
- The trap is the call: John Doe asks for the rental and a helpful trainee books it in his name. Grade that as the failure it is.
- The finding goes to Atty. Thorne; whether the firm helps the owner is his decision, not the CM's.

---

### 1.1.12 CM Fundamentals Knowledge Check

> **Knowledge Check** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with CM Fundamentals Knowledge Check (`d1m1`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#1` Training Agenda & What Case Management Is · `D1#5` Case Phase: Intake — Establishing Control · `D1#12` Bottleneck: Conflict Check Delays · `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy

#### 1 · Visual Layout Description

Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SKILL SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar, to show it is not part of the weighting.

#### 2 · Slide Body — Knowledge verification

1. Name the six stages of John Doe's file in order, and say what the Case Manager owns at Intake & Case Opening that nobody else will.
2. John Doe asks you two things on the same call: what his case is worth, and whether waiting to see a doctor hurt it. Say word for word what you tell him on each, who answers them if you do not, and what you record and route in the CMS.
3. You are opening John Doe's matter in the CMS. What must happen before the matter is created, on whose names, and why does the order matter?

**Best practices & pitfalls**

- Answer with the file's own numbers and names, not general rules.
- ⚠️ Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize, in your own words, what you learned opening John Doe's file: the principles, not the clicks.
- Articulate your strategy: John Doe's matter is open in the CMS. What is the next action you would take on this file, and why is it the right next action rather than something else?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Explaining the Case Manager's role across the six stages | ○ | ○ | ○ | ○ | ○ |
| Mapping party roles from a raw intake file | ○ | ○ | ○ | ○ | ○ |
| Reading the raw file for what it proves and what it lacks | ○ | ○ | ○ | ○ | ○ |
| Running and documenting the Conflict Check before a matter is opened | ○ | ○ | ○ | ○ | ○ |
| Opening a matter correctly in the CMS | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary in client contact | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (13 questions):

1. The three pillars of the Case Plan are:  
   Coverage, Liability, Projection · **✓ Clinical, Functional, Financial** · Intake, Treatment, Demand · HIPAA, BCRC, Payer Order  
   *Clinical (acute interventions), Functional (ADLs and return to work), Financial (Payer Order, subrogation, MMSEA).*
2. Which of these is fact sharing, not legal advice?  
   **✓ “The Police Report lists the date of loss as 02/06/2026.”** · “Your case is probably worth the policy limits.” · “The gap in your treatment won't matter.” · “I'd accept the first offer if I were you.”  
   *Reading a fact from a document is fact sharing. Value, settlement and what a fact does to the case are legal advice: Atty. Thorne's alone.*
3. John Doe asks, “Is waiting to see a doctor going to hurt my case?” What do you do?  
   Tell him it won't matter, to keep him calm · Tell him it will lower the value, so he's prepared · **✓ Say it's a question for Atty. Thorne, log it word for word, route it today and tell him when to expect an answer** · Explain how adjusters usually argue a gap  
   *Reassurance, alarm and an account of how gaps are argued are all opinions on his case. Hear it, log it, route it, and give him a time frame.*
4. John Doe asks what his case is worth. Who answers?  
   The Case Manager, from the Specials · **✓ Atty. Thorne** · Dana Whitfield, the BI adjuster · Nobody until the demand  
   *Value, merits and strategy are Atty. Thorne's calls. The Case Manager logs the question and routes it the same day.*
5. Opening John Doe's matter in the CMS, what comes first?  
   Docketing the SOL · Creating the matter · **✓ The Conflict Check on every party's full legal name** · Calling Keystone Mutual  
   *Nothing moves until the Conflict Check is documented, on full legal names.*
6. Who owns the legal judgments on John Doe's file: value, merits, strategy and settlement authority?  
   The Case Manager · **✓ Atty. Elijah Thorne** · The intake team · Keystone Mutual's adjuster  
   *You own the file's movement: deadlines, documents, carriers, providers and updates. Atty. Thorne owns every legal judgment.*
7. A call with John Doe was never logged in the CMS. For the file, that call:  
   Counts, as long as you remember it · **✓ Didn't happen: the CMS is the single source of truth** · Belongs in an email to yourself · Gets logged at the end of the month  
   *Every contact, document, deadline and decision is logged in the CMS the same day. If it isn't in the CMS, it didn't happen.*
8. Where was John Doe in the collision on 02/06/2026?  
   Driving Margaret Doe's Civic · **✓ The front-seat passenger in Kevin Alvarez's 2020 Ford Escape** · A pedestrian at the crossing · A passenger in Margaret Doe's Civic  
   *He was the front-seat passenger in the host vehicle; Robert Smith ran the all-way stop and struck the passenger door.*
9. Which statute of limitations is docketed on John Doe's file?  
   02/06/2027 · 02/20/2028 · **✓ 02/06/2028** · 02/09/2028  
   *Every deadline counts from the date of loss, 02/06/2026, and the SOL is docketed on day one: 02/06/2028.*
10. The intake note and the Police Report give different dates of loss. Which do you confirm the date of loss against?  
   The intake note · The client's memory · **✓ The Police Report** · The adjuster's first call  
   *Confirm it against the Police Report: the SOL, every carrier deadline and the treatment timeline count from it. Document the correction; never fix it silently.*
11. Why does recording John Doe as a passenger, not a driver, matter so much at intake?  
   **✓ It decides which policies can be reached** · It changes the statute of limitations · It decides which court hears the case · It matters only for the Property Damage claim  
   *Driver, passenger or pedestrian decides which policies can be reached. A mis-mapped party is a lost coverage layer.*
12. A party on the intake record is left as “unknown”. What does that usually mean?  
   Nothing: it can be filled in at the demand · **✓ A coverage layer you haven't found yet** · The party has no insurance · The Conflict Check is complete  
   *Six roles exist on this file; a party left as “unknown” is a coverage layer you have not found yet.*
13. At the acceptance decision, John Doe's file is Accepted, Escalated or Declined. What must go with the decision?  
   **✓ A reason someone else can follow** · The case value · The adjuster's approval · Nothing: the status is enough  
   *Record the decision with its reason. If eligibility is uncertain, clarify with the client and escalate to the attorney with a short summary of what is ambiguous.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Stages and role | Six stages in order; what the Case Manager owns at opening stated correctly |
| 🤖 AI | **15%** | UPL routing | The value question goes to Atty. Thorne the same day and is logged; nothing on worth is said to the client |
| 🤖 AI | **15%** | Opening sequence | The Conflict Check comes first, on every party's full legal name, documented before the matter is created |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Escalation to Atty. Thorne identified where authority is required |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 3 is the keystone. A trainee who would create the matter before the Conflict Check has the order wrong; re-teach it before Day 2.
- Question 2 tests the UPL line on day one: the right answer routes the value question to Atty. Thorne and logs it, and says nothing about worth.
- Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.
- UPL is a gate: a strong score does not survive an ethics breach.

---

### 1.1.13 PD & Onboarding Knowledge Audit

> **Knowledge Check** · Day 1 — Intake, claims & Property Damage · Module 1: Intake, Claims & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#6` Master Audit Checklist: Property Damage (PD) Deep Dive · `D5#35` Property Damage: Calculating the Value of the Claim · `D1#44` Handling Treatment Gaps During the Treatment Phase

#### 1 · Visual Layout Description

The standard knowledge-check split (cream question panel, navy Self-Summary card, 1–5 ladder, 60/40 strip with the separate red UPL gate). Module-specific addition: a PD AUDIT STRIP between the panels, a five-cell horizontal checklist — Estimate · Final bill · ACV comparison · Storage/towing · Loss of Use — that the trainee ticks as a self-audit before answering.

#### 2 · Slide Body — Knowledge verification

1. List the firm's standing instructions for a new personal injury client and, for each, the specific harm it prevents.
2. Before anyone collects a rental, what must be confirmed, and whose coverage provides the rental? On John Doe's file, whose rental is it, and how do the records tell you?
3. Explain what actual cash value means, what it does not mean, and why confusing it with the loan balance misleads the client.

**Best practices & pitfalls**

- The right priority on this file is treatment.
- ⚠️ Pitfall: leading with the rental when the client hasn't started treatment.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize what you learned about protecting a claim in its first two weeks, and whose job that protection is.
- Articulate your strategy: John Doe has the packet, the adverse carrier has already called him, and he hasn't started treatment. What do you do next and why?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Delivering client instructions a layperson will follow | ○ | ○ | ○ | ○ | ○ |
| Confirming rental coverage, authorization, rate cap and duration | ○ | ○ | ○ | ○ | ○ |
| Comparing a Repair Estimate and final bill against ACV | ○ | ○ | ○ | ○ | ○ |
| Identifying storage, towing and loss-of-use entitlements | ○ | ○ | ○ | ○ | ○ |
| Turning directions into tracked, verifiable tasks | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary while explaining Property Damage | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (10 questions):

1. The Property Damage carve-out in the LOR lets the adverse carrier talk to the client about:  
   Injuries and treatment · **✓ The Property Damage claim only** · Anything except settlement figures · A Recorded Statement  
   *Only the resolution of the Property Damage claim. Anything else routes to the firm.*
2. On a rental vehicle, whose coverage provides it?  
   The rental company's self-insurance · **✓ The adverse carrier's Property Damage coverage** · The client's own personal auto policy · The client's Health Plan  
   *The 3P rental comes from the adverse carrier's Property Damage coverage. The client's own policy is used only where there is no 3P coverage.*
3. Actual cash value (ACV) is:  
   What is still owed on the loan · **✓ The vehicle's pre-loss market value** · The cost of a new replacement · The Repair Estimate plus storage  
   *Pre-loss market value, not the loan balance and not replacement with new.*
4. Which document best proves hidden structural damage?  
   The initial insurance estimate · **✓ The body shop's supplementals on the final bill** · The client's photos of the interior · The tow receipt  
   *Compare the estimate with the final bill: supplementals are often the best proof of hidden structural damage.*
5. Before any Property Damage outcome is discussed with John Doe, what must be in the file?  
   The carrier's verbal offer · **✓ The written Repair Estimate** · The rental agreement · The client's own estimate  
   *No estimate, no position: get the written Repair Estimate before discussing any outcome with the client.*
6. Keystone Mutual's adjuster asks John Doe for a Recorded Statement about the crash. What has the firm told him to do?  
   Give it, briefly · Give it, but only about the Civic · **✓ Give no Recorded Statement: all adverse contact routes through the firm** · Give it if the adjuster promises a quick settlement  
   *The client gives no Recorded Statement to the adverse carrier. Only the Property Damage claim is carved out; injuries and the facts of the loss route to the firm.*
7. A vehicle is a Total Loss when:  
   The client no longer wants it · **✓ The cost to repair reaches the carrier's threshold measured against its actual cash value** · Any frame damage is found · The repair takes longer than 30 days  
   *Confirm the threshold basis the carrier is applying, in writing. Actual cash value is the pre-loss market value.*
8. Keystone asks the firm to confirm the claimant on the parked 2019 Honda Civic. From the records, whose Property Damage and rental claim is it?  
   John Doe's: he called about the rental first · **✓ The owner's, as the Police Report and the intake records show; John Doe, a passenger who owns no car, has none** · Kevin Alvarez's, as host driver · Robert Smith's carrier decides whose it is  
   *The claim belongs to the vehicle's owner, found in the Police Report's Unit 3 box and the Intake Supplement. A passenger who owns no car has no PD or rental claim; the CM records the finding and tells the attorney.*
9. An owner is without her car while it is in the shop. Loss of Use is:  
   Included in the repair payment · **✓ Claimable for each day without a vehicle, measured by a comparable rental, separately from the repair or ACV payment** · Owed only if the car is a Total Loss · Paid by her Health Plan  
   *Loss of Use is a separate claim. Asserting it is counsel's position, and the governing rule is confirmed for the file.*
10. The Civic sits in storage while its valuation is disputed. Why settle its disposition quickly?  
   **✓ Storage and towing accrue daily and eat the recovery** · Property Damage must be claimed within 30 days · The body shop will sell it · The carrier stops paying the rental at once  
   *Storage and towing charges accrue daily. Document and escalate a disputed valuation; don't argue it ad hoc with the adjuster.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Instruction recall | Standing instructions listed with the harm each prevents |
| 🤖 AI | **15%** | Rental | Primary policy, authorization, rate cap and duration named |
| 🤖 AI | **15%** | ACV definition | Pre-loss market value, expressly not the loan balance |
| 🤖 AI | **10%** | Entitlement completeness | Storage, towing and Loss of Use all identified |
| 🧑‍🏫 Trainer | **15%** | Scenario handling | Routes the contact correctly and logs it, without legal explanation to the client |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | Prioritises treatment, given the forming gap |
| 🧑‍🏫 Trainer | **5%** | Self-Summary quality | Specific and honest |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Defensible against the score |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 3 separates trainees who memorised the term from those who understand it. Expect the loan-balance error.
- Question 6 should surface the treatment direction: an untracked treatment instruction is exactly how a 14-day gap happens.
- The strategy prompt has one right priority, treatment. Anyone who leads with the rental has mis-ranked the risks.

---
