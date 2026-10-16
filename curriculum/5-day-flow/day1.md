# Case Flow Day 1 — Opening the File & the Case Strategy

**Phase:** File opening & case strategy · **Focus case:** John Doe v. Robert Smith · **Lead Counsel:** Atty. Elijah Thorne

**Objective.** Know the Case Manager's role and John Doe's case, open the file correctly in the CMS (intake and Property Damage), put all three carriers on notice and verify the $40,000 stack in writing, clear the Regulatory Triple-Check with the Health Plan's reimbursement right flagged, and turn it into an attorney-ready Case Plan that names the 14-Day Gap.

**Gate to the next day.** Matter opened in the CMS · PD onboarding tracked · LORs out and the Policy Stack verified at $40,000 · Regulatory Triple-Check cleared · Case Plan routed to Atty. Thorne

**The file as this day opens.**

- A raw file from “On the Records”: date of loss 02/06/2026, statute of limitations 02/06/2028, John Doe a front-seat passenger in the host vehicle.
- Three coverage layers to verify: $10,000 BI (Keystone Mutual), $20,000 Host UM (Harbor Point), $10,000 Relative UM (Cardinal State Mutual).
- Peach State Health Plan has asserted a reimbursement right on first notice.
- John Doe has not started treatment; the 14-Day Gap is forming.

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

## This day's Case Phases

Each Case Phase is taught as one uninterrupted discussion of its lessons, then its Skill Activities and real-time practice on John Doe's file in the CMS, then its Learning Check.

**Case Phase 1 — Intake & Property Damage**

1. *Lesson* — The Case Manager's Role
2. *Lesson* — Meet Your Case: John Doe v. Robert Smith
3. *Lesson* — Ingesting the Raw File
4. *Lesson* — The Acceptance Decision & the Three-Pillar Case Plan
5. *Lesson* — Client Do's and Don'ts & Rental Authorization
6. *Lesson* — Repair Estimates, Total Loss & Loss of Use
7. *Skill Activity* — Opening John Doe's File in the CMS
8. *Skill Activity* — Client Onboarding Direction Packet
9. *Skill Activity* — Onboarding Direction Assignment in System
10. *Knowledge Check* — PD & Onboarding Knowledge Audit

**Case Phase 2 — Claim Set Up**

1. *Lesson* — Coverages & the Payer-First Principle
2. *Lesson* — LOR Drafting Mechanics & Three-Carrier Notification
3. *Lesson* — Coverage Verification Tracking & Follow-Up Deadlines
4. *Lesson* — Health Subrogation, Payer Order & the Regulatory Triple-Check
5. *Lesson* — The Action Plan Editor & Attorney Review Routing
6. *Skill Activity* — Generating Formal LORs to BI, Host UM, and Relative UM Carriers
7. *Skill Activity* — Policy Stack & Coverage Verification
8. *Skill Activity* — CMS Coverage Matrix Audit
9. *Skill Activity* — Subrogation Lien Flagging in the CMS
10. *Skill Activity* — Identifying & Flagging the 14-Day Gap
11. *Skill Activity* — Live Case Plan Draft — John Doe v. Robert Smith
12. *Knowledge Check* — Policy Stack Knowledge Check
13. *Knowledge Check* — Coverage Setup Verification Check
14. *Knowledge Check* — Case Plan Audit & Day 1 Gate

**End-of-day discussion (trainer):** Robert Smith's carrier has already called John Doe, Keystone hasn't confirmed its limit in writing, and Peach State has asserted a reimbursement right. Which three actions do you take today, in what order, and what goes in the Case Plan's risks band?

---

## Case Phase 1 — Intake & Property Damage

**Order:** Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Knowledge Check

### 1.1.1 The Case Manager's Role

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with Policy Stack Knowledge Check (`d1m1`)  
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

Verified in Policy Stack Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

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

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with Policy Stack Knowledge Check (`d1m1`)  
> **Topic:** The one file you will work for five days  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · curriculum/5-day-flow/case-file.md §1–2: the file at intake, people and vehicles, the collision

#### 1 · Visual Layout Description

A case card filling the slide like a file folder: top-left the style JOHN DOE v. ROBERT SMITH in Fraunces with the matter number LSH-2026-MVA-770412 in mono beneath. Left column: a small diagram of the all-way stop at Maple Hollow Rd & Birch Ave, the pickup's arrow running the stop into the Escape's passenger door. Right column: three stacked navy-to-orange bars for the $40,000 stack (BI $10,000, Host UM $20,000, Relative UM $10,000). Along the bottom, an orange timeline strip from DOL 02/06/2026 to first treatment 02/20/2026, labelled 14-DAY TREATMENT GAP.

#### 2 · Slide Body — Tell Them

*Why:* Every lesson, activity and Learning Check in this course works one file: John Doe v. Robert Smith. Knowing its facts cold (who, when, which policies, what is at risk) is what makes every step you take in the CMS make sense.

1. The collision: 02/06/2026, about 7:10 a.m., at the all-way stop at Maple Hollow Rd & Birch Ave. Robert Smith ran the stop and struck the passenger door of Kevin Alvarez's 2020 Ford Escape; Riverton PD cited him (RPD-26-018842).
2. Your client: John Doe, 34, a warehouse shift lead at Northgate Distribution, the front-seat passenger. Lead Counsel: Atty. Elijah Thorne. Case Manager: you.
3. The Recovery Stack is $40,000, worked in order: $10,000 BI (Keystone Mutual) → $20,000 Host UM (Harbor Point) → $10,000 Relative UM (Cardinal State Mutual).
4. John Doe reaches both UM layers because he was a passenger. Driving his own Civic he would reach $10,000: he rejected UM on his own policy.
5. Health: Peach State Health Plan asserted a reimbursement right on first notice; Harbor Point carries $5,000 MedPay on the Escape.
6. The critical fact: EMS found neck stiffness and he declined transport. His first treatment was 02/20/2026, a 14-Day Treatment Gap the defense will use.
7. The statute of limitations is docketed for 02/06/2028. Every deadline on the file counts from the date of loss.

> ⚠️ **UPL boundary.** You may share facts and explain the process to John Doe. You may not tell him what his case is worth or how the gap will play. That is Atty. Thorne's call.

#### 2 · Slide Body — Show Them

*John Doe's file at a glance*

|  | On this file |
|---|---|
| Case | John Doe v. Robert Smith · LSH-2026-MVA-770412 · MVA, passenger injury |
| Date of loss / SOL | 02/06/2026 · SOL 02/06/2028 |
| Client | John Doe, front-seat passenger in the host vehicle |
| Defendant | Robert Smith, cited for failure to stop (RPD-26-018842) |
| Lead Counsel | Atty. Elijah Thorne |
| Recovery Stack | $10,000 BI → $20,000 Host UM → $10,000 Relative UM = $40,000 |
| Health Plan | Peach State · reimbursement right asserted |
| Critical fact | 14-Day Treatment Gap: first treatment 02/20/2026 |

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
- ⚠️ Pitfall: treating the 14-day gap as the client's fault rather than a fact to document.

#### 3 · Knowledge Check & CM Summary

Verified in Policy Stack Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Case facts | DOL, SOL, parties and John Doe's position stated correctly |
| 🤖 AI | **20%** | Recovery Stack | $40,000 in the order BI → Host UM → Relative UM |
| 🤖 AI | **15%** | Critical fact | Names the 14-Day Treatment Gap and why it matters |
| 🧑‍🏫 Trainer | **25%** | Fact discipline | Traces facts to documents rather than memory |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Shares facts, never value or merits |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Hand out nothing yet. Ask the room what they would want to know about a new file in the first five minutes, then show the case card.
- Say the stack out loud in order, twice: BI, Host UM, Relative UM. It is the spine of Days 1 to 3.
- Land the critical fact without blame: a 14-day gap is ordinary life (work, waiting it out), and the Case Manager's job is to document it, not judge it.
- Close: “From the next slide on, every fact you use comes from a document in the file, not from this card.”

---

### 1.1.3 Ingesting the Raw File

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with Policy Stack Knowledge Check (`d1m1`)  
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
| Client / Plaintiff | John Doe | Front-seat passenger, not a driver. This field opens two UM layers. |
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
| Parties identified | Map all six roles and record the client's position in the vehicle | CMS → Parties | No party left “unknown”; position = passenger |
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

Verified in Policy Stack Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

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
- The passenger fact is the whole lesson. Driving his own car on this loss, John Doe would reach $10,000: he rejected UM on his own policy, and the relative policy excludes a car he owns. As a passenger in the host vehicle he reaches $40,000. Same crash, same injuries, four times the recovery, decided by one field.
- Stress that “On the Records” files arrive unverified. A trainee who treats the intake note as fact carries its errors into the demand.
- Name the UPL line now. It comes back every day of this program.

---

### 1.1.4 The Acceptance Decision & the Three-Pillar Case Plan

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with Case Plan Audit & Day 1 Gate (`d1m4`)  
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
6. Clear the Regulatory Triple-Check before the clinical plan: HIPAA, Medicare/Medicaid reporting, Payer Order.
7. File the Three-Pillar Case Plan within the state's window, often 30 to 60 days, and docket the date.
8. Clinical: the acute interventions that stabilise the client (PT, specialty consults). Functional: activities of daily living and return-to-work status. Financial: the Payer Order, subrogation management and MMSEA compliance.
9. Give every pillar measurable goals, and every action item an owner and a date.
10. Flag adverse facts prominently. A risk buried in prose has not been disclosed to counsel.
11. The plan proposes operational steps. It does not set legal strategy; route it to Atty. Thorne before acting on anything that commits the firm's position.

> ⚠️ **UPL boundary.** The plan may state facts, flag risks and propose operational steps. It may not state legal conclusions, case value or settlement posture. Those are Atty. Thorne's to set, which is why the plan is routed to him.

#### 2 · Slide Body — Show Them

*The five bands, and what belongs in each*

1. **Snapshot & acceptance** — Parties, DOL, SOL, client position, phase; Accepted / Escalated / Declined with the reason.
2. **Coverage · Liability · Projection** — The three-layer stack and its order; who is responsible; a preliminary projection.
3. **Regulatory Triple-Check** — HIPAA authorization, BCRC answer, Payer Order.
4. **Three-Pillar Plan** — Clinical, Functional, Financial goals, each with an owner and a date.
5. **Risks & flags** — Adverse facts stated plainly: here, the 14-Day Treatment Gap. Routed to Atty. Thorne.

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Verification call complete | Record the acceptance decision with its reason | CMS → Case Notes | Accepted / Escalated / Declined, with a reason a colleague can follow |
| Coverage verified and triple-check cleared | Draft the plan across all five bands | Action Plan Editor | All five bands present; risks band populated |
| Plan drafted | Docket the filing window and route to Atty. Thorne | Action Plan Editor → Route for review · CMS → Calendar | Routed before any position-committing action; due date on the calendar |

**Best practices & pitfalls**

- Each pillar should have measurable goals.
- Every decision needs a documented reason someone else can follow.
- When intake stalls: name where it slowed, find the root cause, act to move the file, then fix what let it happen.
- ⚠️ Pitfall: a plan that only covers clinical care.
- ⚠️ Pitfall: gathering more information at the acceptance stage instead of making the determination.
- ⚠️ Pitfall: letting an uncertain file sit in limbo instead of escalating.

#### 3 · Knowledge Check & CM Summary

Verified in Case Plan Audit & Day 1 Gate (taught on Case Flow Day 1) and that day's auto-graded questions.

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

### 1.1.5 Client Do's and Don'ts & Rental Authorization

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Protecting the claim from the client's own good intentions  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#28` Treatment Phase: Essential Client Communication Strategies · `D1#44` Handling Treatment Gaps During the Treatment Phase · LSH Claims Specialist: LOR Property Damage carve-out, rental coverage hierarchy, documents to support the claim

#### 1 · Visual Layout Description

A balanced two-column DO / DON'T board on the upper two-thirds, green-bordered left and red-bordered right, with matched pairs on the same line so each DON'T sits opposite the DO it replaces. Each row carries a small icon in the gutter. Lower third: a rental authorization flow of four connected chips — WHOSE POLICY IS PRIMARY? → WHO AUTHORIZES? → DAILY RATE CAP → DURATION LIMIT — with an orange tag under the last two: “uncovered days are the client's cost.”

#### 2 · Slide Body — Tell Them

*Why:* Most self-inflicted damage to an injury claim happens in the first two weeks, before the client has been told what not to do. A casual Recorded Statement, a gap in treatment or a social-media post can cost more than any negotiation will recover.

1. The client gives no Recorded Statement to the adverse carrier. All adverse contact routes through the firm.
2. The client starts treatment and keeps every appointment. Explain why consistent treatment matters; gaps become causation arguments against them.
3. The client posts nothing about the collision, the injuries or their activities.
4. The client signs no release, authorization or settlement document from any carrier until the firm has reviewed it.
5. The client keeps every receipt and out-of-pocket expense, including mileage to appointments and household help. Only what is documented can be recovered.
6. Property Damage is the one carve-out from the no-direct-contact rule. The LOR lets the adverse carrier talk to the client about the Property Damage claim only.
7. On a rental, the renter's own personal auto policy is usually primary. The rental company is usually self-insured and steps in only after the personal policy denies, in a formal written denial.
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

### 1.1.6 Repair Estimates, Total Loss & Loss of Use

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
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
- Loss of Use is the most often forgotten item, and on this file it matters: John Doe needs to get to treatment he hasn't started.
- Day 5 reopens this with Diminished Value and the Property Damage dispute lab. Today is the threshold; Day 5 is the fight.

---

### 1.1.7 Opening John Doe's File in the CMS

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with Policy Stack Knowledge Check (`d1m1`)  
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

Verified in Policy Stack Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

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

### 1.1.8 Client Onboarding Direction Packet

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Skill Activity 1 — assemble what the client gets on day one  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#28` Treatment Phase: Essential Client Communication Strategies · `D1#44` Handling Treatment Gaps During the Treatment Phase · LSH Claims Specialist: client communication protocol

#### 1 · Visual Layout Description

An exploded packet: a central navy folder with six document cards fanned around it in a semicircle, each numbered with an orange badge — ① Do's and Don'ts ② Treatment directions ③ Property Damage and rental ④ Communication protocol ⑤ Document retention ⑥ Firm contacts and escalation path — each showing two or three bullet previews in small type. Beneath the fan, a delivery bar of three chips: PREPARED → DELIVERED → LOGGED, the third noting the required date and method.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe's retainer is signed and the matter is open in the CMS. Nothing has been sent to him yet, and he has already had one call from Robert Smith's carrier.

**Execution prompt.** Assemble John Doe's onboarding direction packet. Build all six sections, populate each with the firm's standing instructions, and make the Property Damage section specific to this file. Given that the adverse carrier has already called him, state which instruction is now most urgent and how you will confirm he has understood it. Then log delivery.

| | |
|---|---|
| **Tool / interface** | CMS → Onboarding → Direction Packet |
| **Expected output** | A complete, delivered and logged onboarding packet specific to John Doe's file. |

**Verification checkpoints**

- [ ] All six packet sections present and populated
- [ ] The standing instructions all appear in the Do's and Don'ts
- [ ] Treatment direction stated, given that treatment has not begun
- [ ] Property Damage section names the rental parameters to confirm
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

### 1.1.9 Onboarding Direction Assignment in System

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
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
- The treatment follow-up is the hinge into Module 4. John Doe's gap becomes undeniable there; this task is what would have caught it.

---

### 1.1.10 PD & Onboarding Knowledge Audit

> **Knowledge Check** · Day 1 — File opening & case strategy · Case Phase 1: Intake & Property Damage · scored with PD & Onboarding Knowledge Audit (`d1m3`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#6` Master Audit Checklist: Property Damage (PD) Deep Dive · `D5#35` Property Damage: Calculating the Value of the Claim · `D1#44` Handling Treatment Gaps During the Treatment Phase

#### 1 · Visual Layout Description

The standard knowledge-check split (cream question panel, navy Self-Summary card, 1–5 ladder, 60/40 strip with the separate red UPL gate). Module-specific addition: a PD AUDIT STRIP between the panels, a five-cell horizontal checklist — Estimate · Final bill · ACV comparison · Storage/towing · Loss of Use — that the trainee ticks as a self-audit before answering.

#### 2 · Slide Body — Knowledge verification

1. List the firm's standing instructions for a new personal injury client and, for each, the specific harm it prevents.
2. Before John Doe collects a rental, what must be confirmed, and whose policy is usually primary? What happens to days outside the authorization?
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

**Auto-graded share of the day's Knowledge Check** (4 questions):

1. The Property Damage carve-out in the LOR lets the adverse carrier talk to the client about:  
   Injuries and treatment · **✓ The Property Damage claim only** · Anything except settlement figures · A Recorded Statement  
   *Only the resolution of the Property Damage claim. Anything else routes to the firm.*
2. On a rental vehicle, whose policy is usually primary?  
   The rental company's self-insurance · **✓ The renter's own personal auto policy** · The at-fault driver's BI · The client's Health Plan  
   *The rental company usually steps in only after the personal policy denies, in writing.*
3. Actual cash value (ACV) is:  
   What is still owed on the loan · **✓ The vehicle's pre-loss market value** · The cost of a new replacement · The Repair Estimate plus storage  
   *Pre-loss market value, not the loan balance and not replacement with new.*
4. Which document best proves hidden structural damage?  
   The initial insurance estimate · **✓ The body shop's supplementals on the final bill** · The client's photos of the interior · The tow receipt  
   *Compare the estimate with the final bill: supplementals are often the best proof of hidden structural damage.*

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

## Case Phase 2 — Claim Set Up

**Order:** Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Lesson ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Skill Activity ➔ Knowledge Check ➔ Knowledge Check ➔ Knowledge Check

### 1.2.1 Coverages & the Payer-First Principle

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Coverage Setup Verification Check (`d2m1`)  
> **Topic:** Every policy on John Doe's file, what it pays, and who pays first  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D2#20` The Valuation Baseline: PIP Set-Off (The Credit) · `D2#23` The Valuation Baseline: Subrogation vs. Non-Subrogation · `D2#24` The Valuation Baseline: Strategic PIP “Exhaustion” · D1 Task Overview: Billing, Resolution & Closing

#### 1 · Visual Layout Description

A two-tier slide. The top tier is a coverage map: eight cards in three colour groups. Navy, THIRD-PARTY: Keystone BI $10,000 · Keystone PD $25,000. Orange, FIRST-PARTY: Harbor Point Host UM $20,000 · Cardinal State Relative UM $10,000 · Harbor Point MedPay $5,000 · Bluewater collision ($500 deductible). Green, HEALTH: Peach State Health Plan. A crossed-out grey card: Bluewater UM, rejected 03/14/2024. Each card carries a small tag for what it pays: THE CLAIM, THE BILLS or THE CAR, and only the three THE CLAIM cards are joined by a bracket labelled RECOVERY STACK $40,000. The bottom tier is a staircase running down left to right, titled THE PAYER-FIRST PRINCIPLE: MedPay/PIP → Health Plan → Letter of Protection, each step lower than the last, labelled pays regardless of fault · contract rate, reimbursement right · paid from the recovery. Bottom-right, an orange callout: “Out of order = a lien that didn't have to exist.”

#### 2 · Slide Body — Tell Them

*Why:* Every policy on a file pays a different thing, and only some of them pay the Medical Bills while the claim is open. The Payer-First Principle sends each bill to the payer that must pay it first: the no-fault medical coverage, then the Health Plan, and a Letter of Protection only last. In that order a bill is paid once, at the lowest cost, with as little as possible to repay; out of order, the same bill comes back as a lien against John Doe's recovery.

1. Sort every coverage by whose it is. Third-party coverage is the at-fault driver's: Robert Smith's Keystone BI and PD. First-party coverage answers to John Doe's side: Host UM, Relative UM, MedPay and collision. The Health Plan is his own benefit plan, through Northgate Distribution.
2. Sort it again by what it pays. BI and UM pay the claim at the end; MedPay, PIP and the Health Plan pay the Medical Bills while it is open; PD and collision pay for the car. Only BI and UM are the $40,000 Recovery Stack.
3. MedPay pays reasonable accident medical bills regardless of fault, up to its limit, and never wages. PIP, where a state requires it, also pays a share of lost wages and replacement services. This file has Harbor Point MedPay, $5,000, and no PIP: verify PIP on every file; never assume it.
4. UM/UIM is reached by status, not ownership. John Doe reaches Host UM as an occupant of Kevin Alvarez's 2020 Ford Escape, and Relative UM as a resident relative of Margaret Doe. His own Bluewater policy adds nothing: UM/UIM was rejected in writing on 03/14/2024.
5. The Payer-First Principle: MedPay (or PIP) first, the Health Plan next, a Letter of Protection last, and only for care the earlier payers can't carry.
6. MedPay goes first because it pays regardless of fault, and Harbor Point confirmed in writing (03/02/2026) that it has no reimbursement right against John Doe's recovery: every MedPay dollar is a bill that never becomes a lien.
7. The Health Plan comes next because an in-network provider is paid at the contract rate and cannot balance-bill. Crescent Pain & Spine billed $3,400.00; Peach State paid $1,860.00. Only what the plan paid can come back as its reimbursement claim.
8. A Letter of Protection comes last. Riverton Spine & Rehab is out of network for Peach State, so its care runs under an LOP; Summit Imaging's LOP request (03/11/2026) was declined, because MedPay applies first.
9. Medicare and Medicaid pay after no-fault and liability coverage. A client on Medicare, Medicaid or SSDI is reported to the BCRC; John Doe is 34, so the file records his verified SSDI status.
10. The order is a default: providers bill whom they bill. Track each payer's ledger, what it paid on which bill, and never re-route a claim another payer has paid. Who is primary when policies conflict is Atty. Thorne's call.

> ⚠️ **UPL boundary.** You may identify the coverages, explain what each one pays and route bills in the default order. Whether a policy applies, which is primary when two conflict, and whether a lien is enforceable are Atty. Thorne's calls.

#### 2 · Slide Body — Show Them

*Every coverage on John Doe's file, and where it sits*

| Coverage | Carrier · limit | Pays | Where it sits |
|---|---|---|---|
| BI liability (third-party) | Keystone Mutual · $10,000 per person | The claim | Recovery Stack, layer 1 |
| Host UM (first-party) | Harbor Point · $20,000, add-on | The claim, once BI is exhausted | Recovery Stack, layer 2 |
| Relative UM (first-party) | Cardinal State Mutual · $10,000 | The claim, behind Host UM | Recovery Stack, layer 3 |
| MedPay (first-party, no-fault) | Harbor Point · $5,000 | Medical Bills, regardless of fault | Payer Order 1st; no payback |
| Health Plan | Peach State Health Plan | Medical Bills, at the contract rate | Payer Order 2nd; reimbursement right |
| PD liability (third-party) | Keystone Mutual · $25,000 | The Civic, the rental, Loss of Use | Outside the stack |
| Collision (first-party) | Bluewater · $500 deductible | The Civic, regardless of fault | Outside the stack (his UM: rejected 03/14/2024) |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Each claim is opened | List every coverage, its carrier and what it pays | CMS → Insurance tab | Each tagged third-party, first-party or health |
| Coverage confirmed in writing | Place it: Recovery Stack, Payer Order or outside both | CMS → Insurance tab → Coverage Matrix | Stack $40,000; MedPay, PD and collision outside it |
| A provider asks whom to bill | Route it by the Payer-First order | CMS → Insurance tab → MedPay ledger | MedPay first, Peach State next, an LOP last |
| A provider asks for an LOP | Check MedPay and network status first | CMS → Liens → LOP register | Payer check recorded; Atty. Thorne approves any LOP |
| A payer pays a bill | Post payer, bill and amount on its ledger | CMS → Insurance tab → MedPay ledger · CMS → Liens | Every ledger current; no paid claim re-routed |

**Best practices & pitfalls**

- Verify every coverage in writing: a dated Declaration Page or Coverage Letter.
- Confirm the Health Plan was active on the date of loss: Peach State began 02/01/2026.
- Ask each new provider whether it bills MedPay or the Health Plan before the first visit.
- Keep the Payer Order and the Recovery Stack on separate lines of the Coverage Matrix.
- ⚠️ Pitfall: issuing an LOP to a provider MedPay or the Health Plan would have paid.
- ⚠️ Pitfall: adding MedPay, PD or collision coverage to the $40,000 stack.
- ⚠️ Pitfall: assuming PIP, or assuming the client's own policy carries UM.

#### 3 · Knowledge Check & CM Summary

Verified in Coverage Setup Verification Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Coverages sorted | Each coverage named by whose it is and what it pays: the claim, the bills or the car |
| 🤖 AI | **20%** | Payer-First order | MedPay → Peach State → LOP, with the reason for each step |
| 🤖 AI | **20%** | Stack kept clean | $40,000 is BI + Host UM + Relative UM only; MedPay, PD and collision tracked outside it |
| 🧑‍🏫 Trainer | **25%** | Grasps the consequence | Explains how an out-of-order LOP becomes a lien against the client's net |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Applicability, primacy and lien enforceability left to Atty. Thorne |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with the question the room always merges: “Who pays the bills now?” is not “Who pays the claim later?” Put the two columns on the board before the slide.
- Walk the table row by row: whose policy, what does it pay, where does it sit? Let the room place MedPay before you do.
- Summit Imaging is the lesson in one fact: $2,395.00 paid by MedPay with nothing to repay, instead of a $2,395.00 LOP balance against John Doe's net.
- Crescent is the Health Plan step: $3,400.00 billed, $1,860.00 paid, $1,540.00 written off for good. Peach State's reimbursement claim can only start from what it paid.
- Ask why John Doe reaches $30,000 of UM at all. He was a passenger: had he been driving his own Civic, his rejected Bluewater UM would leave only the $10,000 BI.
- Close on the boundary: you route bills in the default order; when two policies both claim to pay second, that is Atty. Thorne's call.

---

### 1.2.2 LOR Drafting Mechanics & Three-Carrier Notification

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Coverage Setup Verification Check (`d2m1`)  
> **Topic:** One template, five letters, and the rules that make each one different  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#21` Case Study: John Doe v. Apex — Liability Determination · LSH Claims Specialist: LOR purpose, recipients, drafting components and delivery · LSH Claims Specialist: claim set-up call, information protection on third-party claims, LOR acknowledgement and limits disclosure · Newly authored: UM notice at set-up (notice, not demand)

#### 1 · Visual Layout Description

A distribution fan reads left to right. Left: a white LOR page on navy firm letterhead, its fields marked by orange numbered badges — ① Attn line ② Subject: claim no. + DOL ③ Client and insured ④ Requests ⑤ Signature, ATTY. ELIJAH THORNE. From it, five orange arrows fan right to five cream recipient cards stacked vertically: KEYSTONE (BI + PD carve-out), HARBOR POINT (Host UM + MedPay), CARDINAL STATE (Attn: Claims Department); then, below a thin grey divider labelled OUTSIDE THE STACK, BLUEWATER and PEACH STATE in muted grey. Each card carries its claim or member number in a mono pill. A red danger callout on the Keystone card: “Name only.” A second on both UM cards: “Notice, not demand.” The argument: one template, five different letters.

#### 2 · Slide Body — Tell Them

*Why:* The LOR is the moment every carrier conversation moves off John Doe and onto the firm. One letter wrong (the wrong insured, a UM carrier never noticed, a notice that reads as a demand) follows the claim to the demand table, where it can put $30,000 of UM coverage at risk.

1. Send the LOR once the retainer is signed, and early: it moves all communication onto the firm. Here the claims were opened by phone 02/16–02/17/2026 and the formal LORs went out 02/17/2026.
2. Draft on the firm's template and letterhead. Address the adjuster by name (“Attn: Dana Whitfield”); with no adjuster assigned, “Attn: Claims Department”. On 02/17/2026 that is Cardinal State.
3. Every LOR names the client, the date of loss, the claim number and the carrier's insured, and the insured differs on each policy: Robert Smith (Keystone), Kevin Alvarez (Harbor Point), Margaret Doe (Cardinal State).
4. State that the client was injured, that a Demand Package with records and bills will follow, and that all contact goes to the firm. Nothing more: anything written now is quoted back later.
5. Request the limits and any additional coverage, the Declaration Page for every applicable policy, and preservation of photos, statements, video, the insured vehicle and its event data recorder (airbag control module) data: liability is not final until the Police Report, statements and video confirm it.
6. Notify all three stack carriers now. UM policies carry notice conditions, and late notice hands a carrier a defense. Notice is not a demand: no UM letter asks for payment before the BI tender is documented.
7. The third-party letter gives Keystone nothing that reaches the client: his name, never his phone, address, date of birth or employer. First-party carriers (Harbor Point, Cardinal State) may verify his details.
8. The Property Damage carve-out goes only in Keystone's letter: its PD adjuster, Leah Moran, may discuss the Civic's damage claim with John Doe, nothing else, and gets 5 business days from the date of the letter to inspect the Civic.
9. Send by each entity's preferred method, with the claim number (without one, the policy number) and the date of loss in the subject line. Atty. Thorne signs; you log the delivery.
10. Expect an acknowledgement in 24–48 hours; it may state coverage and the limit. None by the third business day: follow up. Keystone may withhold written confirmation of its limits until it has a written request with the authorizations Atty. Thorne approves.

> ⚠️ **UPL boundary.** You draft, assemble and send; Atty. Thorne signs. Never sign an LOR for him, and never tell an adjuster what the claim is worth, argue who caused the collision, or say what a UM policy owes.

#### 2 · Slide Body — Show Them

*Five letters on 02/17/2026: who gets what*

| Letter to | Coverage | Insured named | Attn line |
|---|---|---|---|
| Keystone Mutual | BI KM-26-440871 · PD carve-out for the Civic | Robert Smith | Dana Whitfield (PD copy: Leah Moran) |
| Harbor Point | Host UM HP-26-7741 · MedPay | Kevin Alvarez | Marcus Bell |
| Cardinal State | Relative UM CS-26-20355 | Margaret Doe | Claims Department (no adjuster yet) |
| Bluewater (notice) | Own policy: collision option; UM rejection form | John Doe | Claims Department (policy no. in subject) |
| Peach State (notice) | Reimbursement right · PSH-55017742 · GRP-41208 | John Doe (member) | Recovery unit |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Claims opened by phone 02/16–02/17/2026 | Log each claim number, adjuster (or “none yet”) and preferred delivery method | CMS → Insurance tab · Communications Log | Every claim has a number, an adjuster or “none yet”, and a method |
| LOR set drafted | Route all five letters for Atty. Thorne's signature | CMS → Documents → Outgoing · Tasks | Signed by counsel before sending; none signed by the CM |
| Letters served 02/17/2026 | Log method and time; calendar the acknowledgement check | CMS → Communications Log · Calendar | Follow-up dated 02/20/2026 for any carrier still silent |
| Acknowledgement arrives | File it; record any disclosure, coverage statement or limit with its source | CMS → Documents · Insurance tab | Source and date on every coverage fact |

**Best practices & pitfalls**

- Confirm on every claim call: claim number, the adjuster's name and spelling, direct phone, fax, email and preferred method. A claim not opened on the call gets a follow-up within 24–48 hours.
- LORs go beyond carriers as each becomes relevant: providers, the employer, rental, tow and storage, lien holders, law enforcement.
- Keep claim-opening facts general and verifiable: date, time, place, type of collision, parties.
- Open the claims in the order Atty. Thorne and the firm's protocol direct; when in doubt, ask.
- A reply that mentions other coverage is a coverage question for Atty. Thorne, not a new layer.
- ⚠️ Pitfall: a UM letter that reads as a demand before the BI tender is documented.
- ⚠️ Pitfall: the client's phone, address or date of birth in the letter to Keystone.
- ⚠️ Pitfall: guessing an adjuster's name for Cardinal State instead of “Attn: Claims Department”.

#### 3 · Knowledge Check & CM Summary

Verified in Coverage Setup Verification Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Component accuracy | Attn line, insured, claim number and DOL correct for each carrier |
| 🤖 AI | **15%** | Request set | Limits, additional coverage, Declaration Pages and preservation requested |
| 🤖 AI | **15%** | Information protection | Third-party letter limited to the client's name; client details only to first-party carriers |
| 🤖 AI | **10%** | Follow-up timing | Acknowledgement expected by 02/19/2026; follow-up dated 02/20/2026 |
| 🧑‍🏫 Trainer | **25%** | Notice vs. demand | Explains why the UM carriers are noticed now and not asked for payment |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Letters signed by Atty. Thorne; no value, liability or coverage opinion offered to a carrier |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open with five envelopes on the table: “Five letters leave this file on 02/17/2026. Which one, written wrong, costs John Doe the most?” Let the room argue, then turn to the two UM letters.
- Ask: “Why does Cardinal State get a letter today, when it pays nothing until BI and Host UM are done?” The answer is notice: late notice can hand a UM carrier a defense. A UM payment demand now would simply be premature. What can actually cost John Doe a UM layer comes later: settling with or releasing Robert Smith without the UM carriers' written consent, or a release broader than Smith and Keystone. Confirm the governing rule.
- Watch for the Keystone letter that over-shares: phone, address, employer, treatment. On 02/17/2026 John Doe has not treated; the 14-Day Gap is still forming, and nothing in a letter should describe it.
- The signature line is the UPL line on this slide: the CM drafts and sends; Atty. Thorne signs.

---

### 1.2.3 Coverage Verification Tracking & Follow-Up Deadlines

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Coverage Setup Verification Check (`d2m1`)  
> **Topic:** From “reported” to “confirmed in writing”, with a date on every open item  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#20` Case Study: John Doe v. Apex — Coverage Analysis · LSH Claims Specialist: Declaration Pages, certified copy of policy, policy limits and limit types · LSH Claims Specialist: follow-up cadence, LOR acknowledgement, statement of insurance disclosure · Newly authored: verifying the UM form and MedPay terms at set-up; the regulatory and policy deadline backstop

#### 1 · Visual Layout Description

A horizontal five-stage status track across the upper half — REPORTED → NOTICED → ACKNOWLEDGED → DISCLOSED → CONFIRMED IN WRITING — each stage a navy chip with an orange numbered badge, the last edged in green. Beneath it, three swim rows, one per stack layer, each with a marker where that layer stood on 03/11/2026: Host UM and Relative UM at the green end with their dates in mono pills (03/02, 03/09); BI held short in orange, labelled WRITTEN REQUEST PENDING, with a dashed line to a future pill, 03/20. Bottom strip: a calendar band with the firm cadence (24–48 h · third business day · dated next follow-up) and behind it, in red outline, REGULATORY BACKSTOP · CONFIRM THE RULE. The argument: a layer is verified only at the green end.

#### 2 · Slide Body — Tell Them

*Why:* An unverified coverage fact is a guess the file is built on. Both UM carriers confirmed coverage in writing by 03/09/2026; Keystone held its BI limit until 03/20/2026. The matrix shows it: a source behind every “confirmed”, a date on every open item.

1. The Coverage Matrix is the single record of coverage: one row each: carrier, insured, claim number, adjuster and contact, limit and type, status, source and date, next follow-up.
2. A limit is preliminary until a Declaration Page or Coverage Letter confirms it, and so is the projection; re-project when coverage changes. A phone figure, Police Report or client's memory is a lead: record its source; never quote it to John Doe.
3. Read the Declaration Page line by line: named insured, policy number, a policy period covering 02/06/2026, the insured vehicle and VIN, coverages and limits, deductibles, listed or excluded drivers, endorsements.
4. Record the limit type: Keystone's Declaration Page shows BI $10,000 per person, the cap on one injured person's claim. Per-accident, aggregate and combined single limits read differently; ask when unclear.
5. Ask each UM carrier for its form in writing: add-on, or reduced by the BI payment. Harbor Point confirmed on 03/02/2026: add-on (excess), no MedPay non-duplication, no reimbursement right on MedPay.
6. Track everything; stack only three layers: $10,000 BI + $20,000 Host UM + $10,000 Relative UM = $40,000. MedPay ($5,000), Keystone's PD coverage ($25,000) and Bluewater's collision coverage are tracked, never added.
7. Verify exclusions and gaps as carefully as limits. John Doe rejected UM on his Bluewater policy in writing (03/14/2024): the signed form goes in the file, so the zero is verified, not assumed.
8. Firm cadence: a claim not opened on the call, follow up in 24–48 hours; an LOR not acknowledged, by the third business day; any other open request, a dated next follow-up within two business days. A past date with nothing logged is an audit failure.
9. Regulatory backstop: many states set deadlines for a carrier to acknowledge a claim and answer written communications; some require limits disclosure on a qualifying written request. Confirm the governing rule; docket it.
10. The policies set John Doe's duties too: prompt notice, proof of loss for MedPay, and any UM notice or limitation rule separate from the 02/06/2028 SOL. Atty. Thorne confirms each; you docket it.

> ⚠️ **UPL boundary.** You record, chase and calendar coverage facts. Whether a policy form, exclusion or rejection applies, whether a carrier has missed a regulatory deadline, and whether to complain to a regulator or allege bad faith are Atty. Thorne's calls.

#### 2 · Slide Body — Show Them

*Five statuses, and where each layer stood*

| Status | What proves it | On John Doe's file |
|---|---|---|
| Reported | Claim number and adjuster (or “none yet”) logged | Opened by phone 02/16–02/17/2026 |
| Noticed | LOR served by preferred method, delivery logged | Five letters out 02/17/2026 |
| Acknowledged | Written receipt; if none, follow up by business day 3 | Cardinal State assigns Teresa Okafor 03/03/2026 |
| Disclosed | A limit stated by phone or letter; still preliminary | Keystone: verbal at set-up only; nothing in writing before a written request |
| Confirmed in writing | Dec Page or Coverage Letter, with source and date | Harbor Point 03/02 · Cardinal State 03/09 · Keystone 03/20/2026 |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Written coverage confirmation arrives | Enter limit, form and terms with source and date; update the status | CMS → Insurance tab → Coverage Matrix | “Confirmed in writing” only with the document attached |
| Adjuster assigned (Teresa Okafor, 03/03/2026) | Replace “not yet assigned” with name and direct contact; re-address correspondence | CMS → Insurance tab · Parties | No “not yet assigned” entry after the assignment date |
| A follow-up date arrives with the item still open | Follow up, log the result, set the next date | CMS → Calendar · Communications Log | No open item carries a past follow-up date |
| Regulatory or policy deadline identified | Have Atty. Thorne confirm the rule, then docket it | CMS → Tasks → Escalate · Calendar | Each deadline docketed with its source, marked confirmed by counsel |

**Best practices & pitfalls**

- Record a verbal limit the moment it is given, marked verbal: an early baseline, not a confirmation.
- Keep a paper trail on every request to Keystone: it wants formal written requests, proof of representation and supporting documents.
- Check that each Declaration Page's policy period covers 02/06/2026 and that its vehicle is the one in the collision.
- ⚠️ Pitfall: adding MedPay or PD coverage to the stack total.
- ⚠️ Pitfall: marking a limit confirmed from a Police Report or a phone call.
- ⚠️ Pitfall: an open request with no next date. It stays open forever.

#### 3 · Knowledge Check & CM Summary

Verified in Coverage Setup Verification Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Status discipline | Each layer's status matches its source; nothing confirmed without a written document |
| 🤖 AI | **15%** | Stack integrity | $40,000; MedPay, Keystone PD and Bluewater tracked outside it |
| 🤖 AI | **10%** | UM terms recorded | Harbor Point add-on, no MedPay non-duplication, no MedPay reimbursement right, sourced 03/02/2026 |
| 🤖 AI | **15%** | Follow-up hygiene | Every open item has a future follow-up date; the firm cadence applied |
| 🧑‍🏫 Trainer | **20%** | Deadline judgment | Treats regulatory and policy deadlines as rules to confirm with counsel and docket, not to quote |
| 🧑‍🏫 Trainer | **20%** | UPL boundary | No coverage interpretation or regulatory threat offered to a carrier or the client |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Put the five statuses on the board and ask where Keystone's BI stood on 03/11/2026. The right answer is “not confirmed”: nobody on the file has seen its Declaration Page until 03/20/2026.
- Ask the room: “What is the difference between a follow-up you made and one you scheduled?” A date in the past with nothing logged is the second kind.
- Keep regulatory deadlines generic. The rule differs by state; the CM's job is to have Atty. Thorne confirm it and to docket it, never to quote it at an adjuster.
- Spend a minute on Harbor Point's add-on confirmation. Had its UM been reduced by the BI payment, Host UM would have shown $20,000 minus $10,000 = $10,000, and the stack $30,000, not $40,000, assuming Cardinal State's form is add-on, which is verified the same way. That is why the form is verified, not assumed.

---

### 1.2.4 Health Subrogation, Payer Order & the Regulatory Triple-Check

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Policy Stack Knowledge Check (`d1m1`)  
> **Topic:** Who pays the bills now, and who gets paid back later  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#23` Case Planning Framework: The Three-Pillar Case Plan · D1 Task Overview: Billing, Resolution & Closing

#### 1 · Visual Layout Description

A two-lane swimlane running left to right. Upper lane, navy, labelled PAYS THE BILLS NOW — PAYER ORDER: an arrow through PIP/MedPay → Peach State Health Plan → LOP/provider liens. Lower lane, orange, labelled PAYS THE CLAIM LATER — RECOVERY STACK: an arrow through BI → Host UM → Relative UM ending at a SETTLEMENT node. A bold orange return arrow curves from the Health Plan in the upper lane down into the settlement node, labelled REIMBURSEMENT CLAIM. The curve is the heaviest line on the slide. Top-right, three stacked chips form the Regulatory Triple-Check: HIPAA · BCRC · PAYER ORDER, each with a tick box. Bottom-left, a danger-bordered callout: “Flagged late = paid twice.”

#### 2 · Slide Body — Tell Them

*Why:* Two different questions get confused on every new file: who pays John Doe's Medical Bills while the claim is open, and who pays the claim itself at the end. The Health Plan answers the first and then asks to be repaid out of the second. A reimbursement claim found after the demand goes out comes out of the client's net.

1. Clear the Regulatory Triple-Check before any clinical planning begins, so the claim is properly established and you are authorized to act.
2. Check 1, HIPAA: obtain a claim-specific Authorization to Release Medical Information. It names the incident date and permits communication with legal and insurance parties; a generic release may not be adequate.
3. Check 2, Medicare/Medicaid: if the client is 65+ or on SSDI, report the case to the Benefits Coordination & Recovery Center (BCRC) under MMSEA (2007). Skipping it risks federal penalties and a frozen settlement. John Doe is 34, so the check is his SSDI status: verify it and record the answer.
4. Check 3, payer order: PIP/MedPay first, then private health insurance, then LOP/provider liens. Verify whether any PIP/MedPay applies on this loss; do not assume it.
5. The Payer Order is not the Recovery Stack. The $40,000 in BI and UM pays the claim; the Payer Order pays the bills while it is open.
6. A Health Plan that pays accident-related bills asserts a reimbursement right against the settlement. Identify it early so it doesn't surprise you at settlement: flag it on first notice, before the first demand.
7. Record the plan's carrier, member ID and group number in the CMS lien register the day they are known, and log the BCRC answer in the file.
8. Never promise a provider or a plan a payment amount. Verify now, negotiate at the lien stage, with authority from Atty. Thorne.

> ⚠️ **UPL boundary.** You may gather lien documentation and report what a plan asserts. You may not advise the client on whether a lien is enforceable, or negotiate a compromise without counsel's authority.

#### 2 · Slide Body — Show Them

*Pays the bills now vs. pays the claim later*

| PAYER ORDER — pays the bills now | RECOVERY STACK — pays the claim later |
|---|---|
| 1. PIP/MedPay, if any applies (verify it). | 1. BI — $10,000 (Robert Smith's liability). |
| 2. Private health insurance: Peach State Health Plan · PSH-55017742 · GRP-41208. | 2. Host UM — $20,000. |
| 3. LOP/provider liens. | 3. Relative UM — $10,000. |
| The Health Plan then asserts a reimbursement right against the settlement. | $40,000 total. Our demands are built against these layers. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Retainer signed | Obtain the claim-specific HIPAA authorization naming the incident date | CMS → Documents | Authorization names 02/06/2026 and permits legal and insurance contact |
| Client's age and benefits known | Verify SSDI status; report to the BCRC if 65+ or on SSDI | CMS → Case Notes | BCRC answer logged with its date |
| Health Plan identified | Record carrier, member ID and group; record the Payer Order | CMS → Liens | Lien record exists and is dated; Payer Order noted |
| Plan pays an accident-related bill | Flag the reimbursement right against the matter | CMS → Liens → Flag | Flag set before any demand is drafted |

**Best practices & pitfalls**

- Clear the triple-check before any clinical planning.
- Log the BCRC report date (or the verified “not required”) in the file.
- Identify subrogation interests early so they don't surprise you at settlement.
- ⚠️ Pitfall: using a generic medical release that doesn't name the incident date.
- ⚠️ Pitfall: reassuring the client that “insurance will cover it.”

#### 3 · Knowledge Check & CM Summary

Verified in Policy Stack Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Triple-check complete | HIPAA authorization, BCRC answer and Payer Order all recorded |
| 🤖 AI | **20%** | Payer order | PIP/MedPay → private health insurance → LOP/provider liens, kept separate from the Recovery Stack |
| 🤖 AI | **20%** | Lien fields and timing | Carrier, member ID and group recorded; flag placed before the first demand |
| 🧑‍🏫 Trainer | **25%** | Grasps the consequence | Explains how a late-flagged reimbursement claim damages the client's net, not just the paperwork |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | No opinion on enforceability; no payment promised |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Draw the two lanes on the board before you show the slide. Most confusion on this topic is two different questions treated as one.
- The curving return arrow is the lesson: money goes out to providers early and comes back out of the settlement at the end.
- On the BCRC check, John Doe's age rules out the 65+ trigger, so ask the room what is left to verify. The answer is SSDI, and the file must record that it was checked.
- Tie it forward: “On Day 3 you will negotiate this lien down. What you can reduce depends on what you register today.”

---

### 1.2.5 The Action Plan Editor & Attorney Review Routing

> **Lesson** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Case Plan Audit & Day 1 Gate (`d1m4`)  
> **Topic:** Drafting, routing, and the review loop  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#24` Case Planning Framework: Mandatory Disclosure & Compliance Tracking · `D1#25` The “Golden Rule” of US Claim Set-Up · `D1#2` The General Case Management Process

#### 1 · Visual Layout Description

Two parts. Left: the Word-style editor as a document page with its toolbar, annotated with four orange numbered callouts — ① section templates ② the risks band ③ owner and date fields on action items ④ the route-for-review control. Right: the routing loop as a closed circuit — DRAFT → ROUTE → COUNSEL REVIEW → APPROVED → EXECUTE, with a RETURNED WITH COMMENT branch back to DRAFT. The return branch is orange and as prominent as the approval branch, so the loop reads as iterative, not a one-way submission. A thin grey bar under the whole loop is labelled AUDIT TRAIL — every version kept.

#### 2 · Slide Body — Tell Them

*Why:* The plan is only useful once counsel has seen it and the file is running against an approved version. Routing is not overhead: it is where operational work becomes authorized work.

1. Draft in the editor's section templates. Ad hoc structure produces plans reviewers can't scan.
2. Put each action item's owner and date in their own fields, not in a sentence.
3. Route for review before executing anything that commits the firm's position externally.
4. A returned plan is normal. Address every comment and re-route; never execute a partly addressed plan.
5. Record the approved version. The file runs against the approved plan, not the latest draft.
6. Re-route when a material fact changes. A plan approved on a false picture is not approved.
7. Keep a clean, discoverable file: the CMS keeps an unalterable audit trail, and every note may be read by defense counsel.
8. Coordinate, don't commingle. The medical plan and the legal claim are parallel tracks: keep treatment notes factual and clinical, and legal strategy in the legal track only.

> ⚠️ **UPL boundary.** Routing exists because legal strategy is counsel's. Where a review comment asks for a legal judgment, the answer comes from Atty. Thorne, not from the Case Manager drafting the plan.

#### 2 · Slide Body — Show Them

*The review loop, and what each state allows*

| State | What it means | What you may do |
|---|---|---|
| Draft | Being written; not yet seen by counsel | Edit freely. Execute nothing that commits the firm externally. |
| Routed | Sent to Atty. Thorne, awaiting review | Continue internal preparation. Do not act on the plan's positions. |
| Returned with comment | Counsel wants changes | Address every comment, then re-route. Do not part-execute. |
| Approved | Counsel has authorized the plan | Execute against this version and record it as the operative plan. |
| Superseded | A material fact changed after approval | Re-route. The earlier approval no longer covers the new picture. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Plan drafted across all five bands | Route to Atty. Thorne | Action Plan Editor → Route for review | Routing recorded with timestamp |
| Plan returned with comments | Address every comment and re-route | Action Plan Editor → Revisions | No comment left unaddressed |
| Material fact changes after approval | Mark the plan superseded and re-route | Action Plan Editor → Version | Approved version kept; new version routed |

**Best practices & pitfalls**

- Assume every note will be read by defense counsel.
- Keep medical notes factual and clinical.
- ⚠️ Pitfall: editing records in a way that breaks the audit trail.
- ⚠️ Pitfall: writing “this will help the case” in a treatment note.

#### 3 · Knowledge Check & CM Summary

Verified in Case Plan Audit & Day 1 Gate (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Template use | Plan drafted in the editor's section templates |
| 🤖 AI | **20%** | Field discipline | Owner and date in their own fields on every action item |
| 🤖 AI | **25%** | Routing recorded | Routed with timestamp before external execution |
| 🧑‍🏫 Trainer | **25%** | Version discipline | Executes against the approved version, not the latest draft |
| 🧑‍🏫 Trainer | **15%** | Golden Rule | Keeps legal opinion out of the medical track |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The orange return branch is the point: being sent back is the system working. Trainees who fear it under-flag risks to avoid it.
- Ask: “Which version is the file running against right now?” It should always have an answer.
- The superseded state matters on this file: the gap investigation on Day 2 will change the picture and force a re-route.
- Read the Golden Rule pitfall aloud. Defense counsel uses opinions in medical notes to impeach the Case Manager's neutrality.

---

### 1.2.6 Generating Formal LORs to BI, Host UM, and Relative UM Carriers

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Coverage Setup Verification Check (`d2m1`)  
> **Topic:** Skill Activity 1 — five letters, each one right  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#21` Case Study: John Doe v. Apex — Liability Determination · LSH Claims Specialist: LOR drafting, contents, recipients and delivery · LSH Claims Specialist: information protection on third-party claims, LOR acknowledgement · Newly authored: UM notice at set-up (notice, not demand)

#### 1 · Visual Layout Description

A letter-assembly workbench. Centre: the firm-letterhead LOR template as a white page with six orange-badged slots — ① Attn ② Subject line ③ Client and insured ④ Injury notice and demand-to-follow ⑤ Requests: limits, Dec Pages, additional coverage, preservation ⑥ Signature, ATTY. ELIJAH THORNE. Left margin: five tabs, one per letter, the three stack carriers in navy and the two notices in grey. Right margin: a delivery rail of three chips — ROUTED FOR SIGNATURE → SENT BY PREFERRED METHOD → ACK DUE 02/19 · FOLLOW UP 02/20. Two red danger callouts: over slot ③ on the Keystone tab, “Name only”; over slot ④ on both UM tabs, “Notice, not demand.”

#### 2 · Slide Body — Let Them

**Scenario.** File date 02/17/2026. Claims were opened by phone 02/16–02/17/2026: Keystone Mutual BI KM-26-440871 (Dana Whitfield) and PD (Leah Moran; PD liability accepted today), Harbor Point HP-26-7741 (Marcus Bell; Host UM and MedPay), Cardinal State Mutual CS-26-20355 (no adjuster assigned). Each carrier's preferred delivery method is in the Communications Log. John Doe has not started treatment.

**Execution prompt.** Generate John Doe's letter set on the firm template: LORs to Keystone (BI, with the PD carve-out), Harbor Point (Host UM and MedPay) and Cardinal State (Relative UM), and notices to Bluewater and Peach State Health Plan. Give each the right Attn line, insured, claim, policy or member number and date of loss, and the requests for limits, Declaration Pages, additional coverage and preservation. Route the set to Atty. Thorne for signature, send each by its preferred method, and calendar the acknowledgement checks. Graded judgment: what Keystone's letter leaves out, and why no UM letter asks for payment.

| | |
|---|---|
| **Tool / interface** | CMS → Documents → Outgoing · Email Workspace · CMS → Calendar |
| **Expected output** | Five signed, sent and logged letters, each correctly addressed, with the acknowledgement follow-ups on the calendar. |

**Verification checkpoints**

- [ ] Five letters: LORs to Keystone, Harbor Point and Cardinal State; notices to Bluewater and Peach State
- [ ] Attn lines: Dana Whitfield (KM-26-440871), Marcus Bell (HP-26-7741), and “Attn: Claims Department” for Cardinal State (CS-26-20355), not a guessed name
- [ ] Insured named correctly on each: Robert Smith, Kevin Alvarez, Margaret Doe; John Doe on Bluewater
- [ ] Subject lines carry the claim number and DOL 02/06/2026; Bluewater's carries the policy number; Peach State's carries PSH-55017742 and GRP-41208
- [ ] Keystone's letter gives John Doe's name only (no DOB, phone, address, employer or treatment detail) and confines the PD carve-out to the Civic, with 5 business days from the date of the letter to inspect the Civic
- [ ] Every LOR requests limits, any additional coverage, Declaration Pages and preservation; Keystone's names the photos, statements, the Silverado and its EDR data, and any video; Harbor Point's asks that the Escape and its EDR data be preserved before any repair or salvage
- [ ] Neither UM letter asks for payment: each gives notice and asks for written confirmation of coverage and limits
- [ ] Harbor Point's letter covers the MedPay claim as well as Host UM; MedPay recorded in the Payer Order, not the stack, and its claim details given to John Doe the same day for his first provider, with no promise of what it pays
- [ ] Bluewater notice requests the Declaration Page and the signed UM rejection form (03/14/2024), and records the collision option ($500 deductible) for the Civic
- [ ] Same day: John Doe told to preserve the doorbell-camera video from 2214 Maple Hollow Rd
- [ ] All five routed for Atty. Thorne's signature and sent 02/17/2026 by preferred method; acknowledgement due by 02/19/2026, follow-up calendared for 02/20/2026 if none

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Claim numbers and delivery methods logged | Generate the five letters from the template | CMS → Documents → Outgoing | Five drafts, each with Attn line, insured, number and DOL |
| Drafts complete | Route the set for signature | CMS → Tasks | Atty. Thorne's signature on all five before any is sent |
| Letters sent 02/17/2026 | Log method and time; calendar the acknowledgement checks | CMS → Communications Log · Calendar | Acknowledgement due 02/19/2026; follow-up 02/20/2026 for any carrier still silent |

**Best practices & pitfalls**

- Read each letter against the claim-call log before it goes for signature.
- Tell the client what the carve-out allows: the PD adjuster may call him about the Civic, and about nothing else.
- ⚠️ Pitfall: one letter copied five times with the insured left as Robert Smith.
- ⚠️ Pitfall: sending before signature because a carrier asked for the LOR “today”.

#### 3 · Knowledge Check & CM Summary

Verified in Coverage Setup Verification Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Letter set complete | Five letters: three LORs and two notices |
| 🤖 AI | **20%** | Addressing and identifiers | Attn lines, insureds, claim, policy and member numbers and DOL all correct |
| 🤖 AI | **15%** | Requests and carve-out | Limits, additional coverage, Declaration Pages and preservation (including EDR data) requested; PD carve-out with 5 business days from the letter date to inspect, in Keystone's letter only |
| 🤖 AI | **10%** | Delivery and follow-up | Sent 02/17/2026 by preferred method; acknowledgement due 02/19/2026; follow-up 02/20/2026 |
| 🧑‍🏫 Trainer | **25%** | Judgment | Keystone's letter limited to the client's name; no UM letter asks for payment; MedPay tied to the treatment start without a promise |
| 🧑‍🏫 Trainer | **15%** | Authority boundary | Routed for Atty. Thorne's signature; nothing signed or sent on the CM's own authority |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Hand out the claim numbers and the call log and nothing else, and let them build the set. The graded judgment is in two places: what Keystone's letter leaves out, and what the UM letters don't ask for.
- Ask: “What goes in the Attn line for Cardinal State?” A trainee who writes a name has invented a fact. “Attn: Claims Department” is the rule until an adjuster is assigned.
- Check every insured line. Kevin Alvarez (Harbor Point) and Margaret Doe (Cardinal State) are the two most often swapped, or left as John Doe.
- Any letter not routed to Atty. Thorne for signature fails the UPL gate, however good it is.

---

### 1.2.7 Policy Stack & Coverage Verification

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Policy Stack Knowledge Check (`d1m1`)  
> **Topic:** Skill Activity 1 — build the ladder to $40,000  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#20` Case Study: John Doe v. Apex — Coverage Analysis · LSH Claims Specialist: CMS Insurance tab SOP, first- and third-party coverage

#### 1 · Visual Layout Description

A vertical three-rung ladder in the centre of the slide, built bottom-up so the stacking order reads physically. Rung 1 (bottom, navy): BI $10,000. Rung 2 (navy-soft): HOST UM $20,000. Rung 3 (top, orange): RELATIVE UM $10,000. Each rung is a rounded bar carrying its carrier, claim number and adjuster in small mono type on the right. To the right, a vertical orange brace spans all three rungs with the total, $40,000, set large in Fraunces. Below, one empty verification checkbox per layer in an orange-bordered card headed VERIFY EACH LAYER. The rungs are numbered 1-2-3 bottom to top and never reordered.

#### 2 · Slide Body — Let Them

**Scenario.** All three carriers have opened claims and reported their limits on the set-up calls. The Declaration Pages have been requested in writing and none has arrived yet; Keystone, the third-party carrier, wants authorizations first. Nothing has been entered in the CMS Insurance tab.

**Execution prompt.** Build the complete Policy Stack for John Doe v. Robert Smith. Enter all three layers in the CMS in their order of operations, with carrier, policy number, claim number, limit and adjuster for each. Classify each layer as first-party or third-party. In the Comments box record the carrier's actual name, the driver's name where it differs from the owner, and the adjuster's details, or state expressly that none is assigned yet. Then verify the total, record the order the layers must be pursued in, and mark the projection preliminary until each limit is confirmed in writing.

| | |
|---|---|
| **Tool / interface** | CMS → Insurance tab |
| **Expected output** | A three-layer Coverage Matrix totalling $40,000, each layer classified, ordered and fully attributed. |

**Show Them — reference model**

*The stack, and the order it must be worked in*

| # | Layer | Party | Limit | Carrier | Claim | Adjuster |
|---|---|---|---|---|---|---|
| 1 | **BI** — Bodily Injury — Robert Smith's liability | third-party | $10,000 | Keystone Mutual Insurance | KM-26-440871 | Dana Whitfield |
| 2 | **HOST UM** — Underinsured Motorist — host vehicle policy | first-party | $20,000 | Harbor Point Insurance | HP-26-7741 | Marcus Bell |
| 3 | **REL UM** — Underinsured Motorist — resident relative policy | first-party | $10,000 | Cardinal State Mutual | CS-26-20355 | Not yet assigned |
| | | | **$40,000** | | | |

**Order of operations:** BI → HOST UM → REL UM. UM pays only after BI is exhausted, and releasing BI without the UM carriers' consent can forfeit the stack.

**Verification checkpoints**

- [ ] All three layers present: BI, Host UM, Relative UM
- [ ] Limits entered as $10,000 / $20,000 / $10,000
- [ ] Total computes to $40,000
- [ ] Order of operations recorded: BI → Host UM → Relative UM
- [ ] BI classified as third-party; both UM layers as first-party
- [ ] Policy number and claim number completed for every layer
- [ ] Relative UM adjuster recorded as “No adjuster assigned yet”, not left blank
- [ ] Source of each limit recorded (set-up call for now; Declaration Page requested)
- [ ] Projection marked preliminary until each limit is confirmed in writing

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Limits reported on the set-up calls | Enter each layer with its limits and identifiers | CMS → Insurance tab | Three layers, each with policy number, claim number and adjuster (or “none yet”) |
| All layers entered | Verify the total and record the order of operations | CMS → Insurance tab → Comments | $40,000; BI → Host UM → Relative UM |
| A limit is unconfirmed | Hold the projection as preliminary | CMS → Case Notes | No limit quoted to the client before written confirmation |

**Best practices & pitfalls**

- Record where each limit came from, so anyone can check it.
- Re-project whenever coverage, liability or treatment changes.
- ⚠️ Pitfall: projecting value before coverage is confirmed.
- ⚠️ Pitfall: quoting a likely limit to the client before it is confirmed in writing.

#### 3 · Knowledge Check & CM Summary

Verified in Policy Stack Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Limit accuracy | $10,000 BI / $20,000 Host UM / $10,000 Relative UM, each on the right layer |
| 🤖 AI | **15%** | Total | Exactly $40,000 |
| 🤖 AI | **15%** | Order of operations | BI → Host UM → Relative UM |
| 🤖 AI | **10%** | Field completeness | Policy number, claim number and adjuster (or “none yet”) on every layer |
| 🧑‍🏫 Trainer | **25%** | Understands stacking | Can explain why the passenger fact opens two UM layers, not just that it does |
| 🧑‍🏫 Trainer | **15%** | Verification habit | Recorded where each limit came from, and held the projection until each is confirmed by its Declaration Page |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Walk the ladder bottom-up out loud: “BI pays first, and only once it is exhausted does Host UM open.”
- The common error is entering the layers as three equal parallel claims. Stop it at once: UM owes nothing until BI is exhausted, so a UM demand before the BI tender is premature, and settling or releasing BI without the UM carriers' written consent can forfeit the stack.
- Ask: “Whose policy is the Host UM?” Trainees often say John Doe's. It is the host driver's; John Doe reaches it because he was riding in that car.
- Have two trainees read their total aloud. Anything other than $40,000 means a layer is on the wrong rung.

---

### 1.2.8 CMS Coverage Matrix Audit

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Coverage Setup Verification Check (`d2m1`)  
> **Topic:** Skill Activity 2 — find what the matrix gets wrong  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#20` Case Study: John Doe v. Apex — Coverage Analysis · LSH Claims Specialist: Declaration Pages, coverage verification and follow-up · Newly authored: verifying the UM form and MedPay terms at set-up

#### 1 · Visual Layout Description

A full-width CMS Coverage Matrix in a white card with a navy header bar: six rows, deliberately imperfect. A navy rail on the left marks the stack rows; MedPay sits wrongly inside it as row 4. A thin grey divider separates the outside-the-stack rows on a grey rail. The footer total, $45,000, is set large. On the answer reveal only, hollow red audit rings appear on the planted errors, the footer is struck through in red with $40,000 beside it, and the MedPay row drops below the divider. Right margin: an audit-note card addressed to ATTY. ELIJAH THORNE with three headed lines — CONFIRMED IN WRITING · PRELIMINARY · ESCALATED. The argument: the matrix is only as good as the document behind each cell.

#### 2 · Slide Body — Let Them

**Scenario.** File date 03/11/2026. A colleague kept John Doe's Coverage Matrix. In the file: Harbor Point's written confirmation (03/02/2026), Cardinal State's assignment of Teresa Okafor (03/03/2026) and Coverage Letter (03/09/2026), and Keystone's written request with authorizations, sent, with no Declaration Page yet. This morning Summit Imaging asked for an LOP; declined, because MedPay applies first.

**Execution prompt.** Audit the staged Coverage Matrix against the documents in the file. Find every error, correct it, and cite the document and date that prove each correction. Restore the stack total, clear every past-due follow-up by acting on it and setting a new date, and leave correct rows alone. Then route a three-line audit note to Atty. Thorne: confirmed in writing, still preliminary, escalated. Graded judgment: the BI status, and what you may and may not mark confirmed today.

| | |
|---|---|
| **Tool / interface** | CMS → Insurance tab → Coverage Matrix · CMS → Documents · Call Simulator → AI Adjuster: Dana Whitfield, Keystone Mutual |
| **Expected output** | A corrected Coverage Matrix totalling $40,000, every status sourced and every open item dated, with an audit note routed to Atty. Thorne. |

**Show Them — reference model**

*The staged matrix as found on 03/11/2026 · footer: “Stack total $45,000”*

| Row | Carrier · claim · adjuster | Limit · status · source | Next follow-up |
|---|---|---|---|
| 1 · BI | Keystone · KM-26-440871 · Dana Whitfield | $10,000 · Confirmed · Police Report | 03/05/2026 (limits request) |
| 2 · Host UM | Harbor Point · HP-26-7741 · Marcus Bell | $20,000 · Confirmed 03/02/2026 · UM form: — | None |
| 3 · Relative UM | Cardinal State · CS-26-20355 · Not yet assigned | $10,000 · Confirmed 03/09/2026 | None |
| 4 · MedPay | Harbor Point · MedPay | $5,000 · Confirmed 03/02/2026 | None |
| Outside · PD | Keystone · Leah Moran | $25,000 · PD liability accepted 02/17/2026 | Per PD file |
| Outside · Bluewater | Bluewater Auto · John Doe's policy | UM: none · source: — | None |

**Verification checkpoints**

- [ ] BI: “Confirmed · Police Report” corrected to “Preliminary · verbal, set-up call; written request with authorizations sent”; Keystone has confirmed nothing in writing, and its Declaration Page does not arrive until 03/20/2026
- [ ] BI follow-up 03/05/2026 is past due with nothing logged: followed up with Dana Whitfield on 03/11/2026, the call logged, the next date set within the firm's cadence (by 03/13/2026, two business days)
- [ ] Host UM form recorded: add-on (excess), not reduced by the BI payment, no MedPay non-duplication; source Harbor Point's letter of 03/02/2026
- [ ] Relative UM adjuster “Not yet assigned” replaced with Teresa Okafor, assigned 03/03/2026
- [ ] MedPay moved out of the stack into the Payer Order (Harbor Point, $5,000, no reimbursement right per 03/02/2026)
- [ ] Stack total corrected from $45,000 ($40,000 + $5,000 MedPay) to $40,000 ($10,000 + $20,000 + $10,000)
- [ ] Bluewater: “UM: none” has no source; the signed UM rejection form (03/14/2024) chased from Bluewater, filed as the source when it arrives, with a dated follow-up until then
- [ ] Keystone PD row kept outside the stack, neither moved in nor deleted: Leah Moran, PD liability accepted 02/17/2026; its $25,000 limit marked preliminary until Keystone's Declaration Page (03/20/2026)
- [ ] Every correction cites its document and date; no row reads “confirmed” without one
- [ ] Relative UM: coverage confirmed 03/09/2026 (resident relative, non-owned vehicle); the letter does not state its UM form or the other-insurance clause that places it behind Host UM. Written request to Teresa Okafor for both and for a certified copy of the policy, with a dated follow-up (credited, not a false positive)
- [ ] Audit note to Atty. Thorne: confirmed in writing (Host UM; Relative UM coverage), preliminary (BI; Relative UM form and excess clause), escalated (the missing Bluewater form; any coverage question)

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Coverage Matrix audit (03/11/2026) | Check every row against the document that should prove it | CMS → Insurance tab → Coverage Matrix · Documents | Each correction cites a document and its date |
| Past-due follow-up found | Follow up with Dana Whitfield today; log it; set the next date | Call Simulator → AI Adjuster: Dana Whitfield, Keystone Mutual · CMS → Calendar | Logged 03/11/2026; next date by 03/13/2026 |
| Audit complete | Route the audit note | CMS → Tasks → Escalate | Note separates confirmed, preliminary and escalated items |

**Best practices & pitfalls**

- Audit against documents, not memory: open the letter before you change the cell.
- A correct row left alone is part of the grade.
- ⚠️ Pitfall: fixing the total without finding why it was wrong.
- ⚠️ Pitfall: marking BI confirmed because $10,000 is what everyone expects.

#### 3 · Knowledge Check & CM Summary

Verified in Coverage Setup Verification Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **30%** | Errors found | All six planted errors identified (5 points each) |
| 🤖 AI | **15%** | Corrections sourced | Each correction cites the document and date that proves it |
| 🤖 AI | **10%** | Stack total | $40,000 restored; MedPay moved to the Payer Order |
| 🤖 AI | **5%** | Follow-up dates | No past follow-up remains; BI follow-up made and re-set by 03/13/2026 |
| 🧑‍🏫 Trainer | **20%** | Audit judgment | BI held preliminary; no false positives on the correct rows |
| 🧑‍🏫 Trainer | **10%** | Audit note quality | Atty. Thorne can act on it in ten seconds |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Coverage questions (UM form, the rejection) escalated, not decided |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Give them the staged matrix and the file documents and nothing else. Don't say how many errors there are; finding all six is the grade. The six: BI marked confirmed; the past-due BI follow-up; the blank Host UM form; Cardinal State's adjuster; MedPay in the stack ($45,000); the missing Bluewater rejection form. A seventh, unplanted finding, Cardinal State's unstated UM form and excess clause, is correct: credit it outside the six.
- The BI row is the graded judgment. On 03/11/2026 the only defensible status is preliminary: Keystone's Declaration Page arrives 03/20/2026.
- Watch for false positives. The Keystone PD row belongs outside the stack: marking its $25,000 preliminary is correct; moving it into the stack or deleting it is the false positive, and confuses “tracked” with “stacked”.
- Read one audit note aloud as Atty. Thorne would. In ten seconds he should know what is confirmed, what is not, and what he must decide.

---

### 1.2.9 Subrogation Lien Flagging in the CMS

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Policy Stack Knowledge Check (`d1m1`)  
> **Topic:** Skill Activity 2 — register the claim before it can hurt you  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#24` Case Planning Framework: Mandatory Disclosure & Compliance Tracking

#### 1 · Visual Layout Description

A single annotated CMS Liens screen filling two-thirds of the slide, a white card with a navy header bar. Five fields are called out with orange numbered badges and leader lines to short labels in the right margin: ① Plan carrier ② Member ID ③ Group number ④ Payer Order position ⑤ Reimbursement flag. Below the screen, a slim two-state timeline: a green node, FLAGGED NOW · before demand, and a red node, FOUND AT DISBURSEMENT · client's net is hit, crossed out. Keep the red state on the slide: trainees need to see the failure they are avoiding.

#### 2 · Slide Body — Let Them

**Scenario.** Peach State Health Plan has begun paying John Doe's accident-related treatment. No lien record exists on the matter yet, and the pre-demand audit is still ahead.

**Execution prompt.** Register Peach State Health Plan's reimbursement claim in John Doe's lien register and flag it against the matter. Record the carrier, member ID and group number, its position in the Payer Order, the basis on which reimbursement is asserted, and the date of the flag. Record the Regulatory Triple-Check results alongside it. Then state in one line what must happen before this lien can be compromised.

| | |
|---|---|
| **Tool / interface** | CMS → Liens |
| **Expected output** | A dated, flagged lien record complete enough to negotiate from on Day 3. |

**Verification checkpoints**

- [ ] Lien record created against the John Doe matter
- [ ] Carrier recorded as Peach State Health Plan
- [ ] Member ID PSH-55017742 and group GRP-41208 both entered
- [ ] Payer-order position recorded: after PIP/MedPay, before LOP/provider liens
- [ ] Reimbursement basis noted
- [ ] Flag dated before any demand is drafted
- [ ] Triple-Check recorded: HIPAA authorization, BCRC answer, Payer Order
- [ ] Escalation noted: compromise requires Atty. Thorne's authority

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Plan's first payment posts | Create and flag the lien record | CMS → Liens | Record dated; flag set |
| Lien record created | Attach the Triple-Check results | CMS → Case Notes | HIPAA, BCRC and Payer Order all recorded |
| Any request to compromise | Route to Atty. Thorne | CMS → Tasks → Escalate | No compromise discussed without counsel's authority |

**Best practices & pitfalls**

- Registering a lien is not conceding it; Day 3 is where it gets reduced.
- Keep the LOP provider list current with balances, so no bill surprises the policy limits.
- ⚠️ Pitfall: finding the lien at disbursement, when there is no time to negotiate from strength.

#### 3 · Knowledge Check & CM Summary

Verified in Policy Stack Knowledge Check (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Record created | Lien exists against the correct matter |
| 🤖 AI | **25%** | Identifier accuracy | Member ID and group number entered exactly |
| 🤖 AI | **20%** | Flag timing | Dated and placed pre-demand |
| 🧑‍🏫 Trainer | **25%** | Documentation quality | A lien negotiator could work from the record cold |
| 🧑‍🏫 Trainer | **15%** | Authority boundary | Recognised that compromise needs counsel's authority |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Have trainees say the date aloud as they set the flag. Timing is the graded element, and it is the one they will be tempted to defer.
- Point at the crossed-out red node: a lien found at disbursement is found too late to negotiate from strength.
- Read one trainee's record to the room as if you were the lien negotiator receiving it on Day 3. Gaps show at once.
- Remind them that registering a lien is not conceding it.

---

### 1.2.10 Identifying & Flagging the 14-Day Gap

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Case Plan Audit & Day 1 Gate (`d1m4`)  
> **Topic:** Skill Activity 1 — find the fact that will decide this case  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy · `D1#44` Handling Treatment Gaps During the Treatment Phase · `D2#13` Treatment Gaps in the Demand Phase

#### 1 · Visual Layout Description

A horizontal treatment timeline is the whole slide. Far left, a navy node: DOL · 02/06/2026. From it runs a conspicuous empty span, a hatched hollow orange band with no event markers, fourteen day-ticks wide, labelled NO TREATMENT · 14 DAYS. At its right end a node, FIRST TREATMENT · 02/20/2026, after which visit markers begin, running into a dashed span ahead labelled WATCH: ANY LATER BREAK IN CARE. Beneath, three consequence cards fan out from the hollow band on orange leader lines: CAUSATION CHALLENGE · VALUATION PRESSURE · CREDIBILITY ATTACK. The emptiness of the band is the message; never fill it with decoration.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe's first treatment records have arrived. The date of loss is 02/06/2026. The first treatment record is dated 02/20/2026; chiropractic care at Riverton Spine & Rehab began on 02/24/2026.

**Execution prompt.** Identify and flag the Treatment Gap in John Doe's file. Compute it exactly, record the initial gap, set the file to catch any later break in care, and state in the risks band what the gap will be used for against the claim. List the likely causes you will investigate, and the steps needed before the gap can be explained. Then route the flag to Atty. Thorne.

| | |
|---|---|
| **Tool / interface** | CMS → Case File → Risk Flags · Action Plan Editor → Risks |
| **Expected output** | A precisely computed, prominently flagged and routed treatment-gap record. |

**Verification checkpoints**

- [ ] Gap computed as 14 days, 02/06/2026 to 02/20/2026
- [ ] Initial gap recorded, and a watch set for any later break in care
- [ ] Defense uses stated: injuries not serious; recovered earlier than claimed; treatment unnecessary; other causes
- [ ] Likely causes listed to investigate: missed appointments, transportation, cost or co-pays, work schedule, stopping after temporary relief, delayed referrals, imaging or authorizations
- [ ] Investigation steps recorded: the client's own explanation, supporting documents, provider confirmation
- [ ] Flag placed prominently in the Case Plan's risks band
- [ ] Flag routed to Atty. Thorne

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Treatment records received | Compute the gap from DOL to first treatment | CMS → Case File → Treatment timeline | 14 days, both dates recorded |
| Gap confirmed | Flag it with its defense uses and likely causes | Action Plan Editor → Risks | Prominent flag with consequences |
| Flag recorded | Route to Atty. Thorne; schedule the Day 2 investigation | CMS → Tasks | Routed and scheduled |

**Best practices & pitfalls**

- Identify gaps early during record review, and document the reason for every interruption.
- A well-explained gap is less damaging than an unexplained one.
- ⚠️ Pitfall: “about two weeks” instead of the exact dates.
- ⚠️ Pitfall: recording the gap but setting no watch for a later break in care.

#### 3 · Knowledge Check & CM Summary

Verified in Case Plan Audit & Day 1 Gate (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Gap computation | Exactly 14 days, dates correct |
| 🤖 AI | **15%** | Gap and watch | Initial gap captured and a later break in care watched for |
| 🤖 AI | **10%** | Defense uses and causes | The adjuster's arguments and the likely causes both named |
| 🤖 AI | **10%** | Routed | Flag routed to Atty. Thorne |
| 🧑‍🏫 Trainer | **25%** | Flag prominence | A reviewer sees it within seconds of opening the plan |
| 🧑‍🏫 Trainer | **15%** | Investigative thinking | The steps would actually produce a defensible explanation |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- This is Day 1's most consequential activity. Everything on Days 2 to 5 turns on this flag existing and being accurate.
- Insist on the exact count. “About two weeks” is not a flag; 02/06 to 02/20 is.
- Ask the room what the adjuster will say when they see this. Their answers become the Day 3 negotiation.
- Trainees often record the gap but set no watch for the next break in care. It comes in April (Case Flow Day 2), and a second break undercuts the “he got better” explanation for the first.

---

### 1.2.11 Live Case Plan Draft — John Doe v. Robert Smith

> **Skill Activity** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Case Plan Audit & Day 1 Gate (`d1m4`)  
> **Topic:** Skill Activity 2 — the full plan, routed for review  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#8` Case Acceptance Determination · `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#23` Case Planning Framework: The Three-Pillar Case Plan · `D1#44` Handling Treatment Gaps During the Treatment Phase

#### 1 · Visual Layout Description

A full-slide editor canvas showing the live plan with all five bands stubbed and their required fields outlined in orange. A completion meter runs across the top in five segments that fill as each band is completed. The risks band carries a red required marker so it can't be skipped silently. Bottom-right, the ROUTE FOR REVIEW control is greyed out and locked until all five segments are filled, with a label: “all five bands required.” The lock is the argument: the tool won't let an incomplete plan reach counsel.

#### 2 · Slide Body — Let Them

**Scenario.** Everything from Day 1 is in the file: parties mapped, the $40,000 stack verified, the Regulatory Triple-Check cleared with the Health Plan's reimbursement right flagged, the onboarding packet delivered and tracked, and the 14-Day Treatment Gap identified. Atty. Thorne is waiting on the Case Plan.

**Execution prompt.** Draft the complete Case Plan for John Doe v. Robert Smith. Fill all five bands from today's work: the acceptance decision with its reason; coverage as a stack with its order of operations, liability, and a preliminary projection; the triple-check results; Clinical, Functional and Financial pillars with measurable goals, each action item with an owner and a date; and the risks band with the 14-Day Gap and the risk of a later break in care, prominently, with their consequences. Docket the filing window, then route the plan to Atty. Thorne.

| | |
|---|---|
| **Tool / interface** | Action Plan Editor |
| **Expected output** | A complete, routed Case Plan that counsel could set strategy from without asking a follow-up question. |

**Verification checkpoints**

- [ ] Snapshot: parties, DOL 02/06/2026, SOL 02/06/2028, client recorded as a passenger
- [ ] Acceptance decision recorded with its reason
- [ ] Coverage: $10,000 BI / $20,000 Host UM / $10,000 Relative UM, total $40,000
- [ ] Order of operations: BI → Host UM → Relative UM; projection marked preliminary
- [ ] Liability recorded as preliminary until confirmed by the Police Report and driver statements
- [ ] Triple-check: HIPAA authorization, BCRC answer, Payer Order
- [ ] Clinical, Functional and Financial pillars each with a measurable goal
- [ ] Every action item has an owner and a date
- [ ] Risks band: 14-Day Gap and the risk of a later break in care, prominent, with consequences
- [ ] Filing window docketed
- [ ] Plan routed to Atty. Elijah Thorne with a timestamp

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Day 1 work complete | Draft all five bands | Action Plan Editor | Meter at five of five |
| Plan complete | Docket the filing window | CMS → Calendar | Due date on the calendar |
| Plan docketed | Route to Atty. Thorne | Action Plan Editor → Route for review | Routed with timestamp |

**Best practices & pitfalls**

- Grade your own plan as Atty. Thorne will read it: if you need to ask a question to set strategy, it isn't finished.
- ⚠️ Pitfall: a projection stated as a number before coverage is confirmed.

#### 3 · Knowledge Check & CM Summary

Verified in Case Plan Audit & Day 1 Gate (taught on Case Flow Day 1) and that day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Snapshot accuracy | Parties, DOL, SOL and client position all correct |
| 🤖 AI | **15%** | Coverage accuracy | Correct limits, total and order of operations |
| 🤖 AI | **15%** | Risk flagging | The 14-day gap and the risk of a later break recorded with consequences |
| 🤖 AI | **10%** | Item discipline | No action item without an owner and a date |
| 🤖 AI | **5%** | Routing | Routed to Atty. Thorne with timestamp |
| 🧑‍🏫 Trainer | **25%** | Reviewer readiness | Counsel could set strategy from it without a follow-up question |
| 🧑‍🏫 Trainer | **15%** | Boundary discipline | No legal conclusion or case valuation written into the plan |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- This is Day 1's capstone. Give it real time; it is the gate, not a wrap-up.
- The locked route control is deliberate. If a trainee can't route, ask which band is incomplete.
- Grade it as Atty. Thorne would read it. If you need to ask a question to set strategy, the plan isn't finished.
- Close Day 1 by stating the gate: CMS initialized, stack verified at $40,000, triple-check cleared, plan routed. Day 2 doesn't begin until all four are true.

---

### 1.2.12 Policy Stack Knowledge Check

> **Knowledge Check** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Policy Stack Knowledge Check (`d1m1`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#20` Case Study: John Doe v. Apex — Coverage Analysis · `D1#22` Case Planning Framework: Regulatory Intake & Verification

#### 1 · Visual Layout Description

Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SKILL SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar, to show it is not part of the weighting.

#### 2 · Slide Body — Knowledge verification

1. List the three coverage layers on John Doe v. Robert Smith in the order they must be pursued, with each layer's limit and the total available.
2. John Doe was a front-seat passenger. Explain how that single fact changes the available recovery, and what it would have been had he been driving his own car.
3. Why must the Host UM layer not be demanded before the BI layer is exhausted or tendered? State the consequence of getting the order wrong.

**Best practices & pitfalls**

- Answer with the file's own numbers and names, not general rules.
- ⚠️ Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize, in your own words, what you learned opening John Doe's file: the principles, not the clicks.
- Articulate your strategy: what is the next action you would take on this file, and why is it the right next action rather than something else?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Mapping party roles from a raw intake file | ○ | ○ | ○ | ○ | ○ |
| Building and verifying a multi-layer Policy Stack | ○ | ○ | ○ | ○ | ○ |
| Stating the order of operations across coverage layers | ○ | ○ | ○ | ○ | ○ |
| Running the Regulatory Triple-Check and the Payer Order | ○ | ○ | ○ | ○ | ○ |
| Registering and flagging a subrogation claim in the CMS | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary in client contact | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (6 questions):

1. On John Doe v. Robert Smith, in what order must the coverage layers be pursued?  
   Host UM → BI → Relative UM · **✓ BI → Host UM → Relative UM** · Relative UM → Host UM → BI · All three at once, in parallel  
   *BI pays first. Host UM opens once BI is exhausted or tendered, and Relative UM stacks behind Host UM.*
2. Why can John Doe reach the $20,000 Host UM layer?  
   He owns the host vehicle · **✓ He was a passenger in the host vehicle** · Robert Smith has no insurance · His Health Plan assigns it to him  
   *He reaches the host vehicle's UM because he was riding in that car. Had he been driving his own car he would have reached $10,000: he rejected UM on his own policy, and the relative policy excludes a car he owns.*
3. The correct Payer Order for John Doe's Medical Bills is:  
   Health Plan → PIP/MedPay → LOP/provider liens · **✓ PIP/MedPay → private health insurance → LOP/provider liens** · LOP/provider liens → Health Plan → PIP/MedPay · Robert Smith's BI carrier pays each bill as it arrives  
   *The Regulatory Triple-Check payer order: PIP/MedPay, then private health insurance, then LOP/provider liens.*
4. Which of these is NOT part of the Regulatory Triple-Check?  
   A claim-specific HIPAA authorization that names the incident date · Medicare/Medicaid (BCRC) reporting where the client is 65+ or on SSDI · Payer Order and subrogation management · **✓ The Time-Limit Demand**  
   *The triple-check is HIPAA, Medicare/Medicaid reporting, and the Payer Order. Demands come on Day 3.*
5. John Doe asks what his case is worth. Who answers?  
   The Case Manager, from the Specials · **✓ Atty. Thorne** · Dana Whitfield, the BI adjuster · Nobody until the demand  
   *Value, merits and strategy are Atty. Thorne's calls. The Case Manager logs the question and routes it the same day.*
6. Opening John Doe's matter in the CMS, what comes first?  
   Docketing the SOL · Creating the matter · **✓ The Conflict Check on every party's full legal name** · Calling Keystone Mutual  
   *Nothing moves until the Conflict Check is documented, on full legal names.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Stack accuracy | Three layers, correct limits, $40,000 total, correct order |
| 🤖 AI | **15%** | Passenger reasoning | Passenger status opens both UM layers; $10,000 named as the counterfactual had he driven his own car |
| 🤖 AI | **15%** | Payer Order & triple-check | Payer Order correct and kept separate from the stack; all three checks named |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Escalation to Atty. Thorne identified where authority is required |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 2 is the keystone. A trainee who cannot answer it has memorised the numbers without understanding the stack; re-teach before moving on.
- Question 6 is a pressure scenario. The right answer registers the lien, tells Atty. Thorne, and does not quietly serve the demand on time.
- Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.
- UPL is a gate: a strong score does not survive an ethics breach.

---

### 1.2.13 Coverage Setup Verification Check

> **Knowledge Check** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Coverage Setup Verification Check (`d2m1`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#20` Case Study: John Doe v. Apex — Coverage Analysis · LSH Claims Specialist: LOR components, information protection, acknowledgement and limits disclosure

#### 1 · Visual Layout Description

The standard knowledge-check split: the cream question panel with orange-numbered questions, the navy Self-Summary card, the 1–5 skill ladder, and the 60/40 strip with the separate red UPL gate. Module-specific addition: a COVERAGE STATUS STRIP between the panels, five carrier chips in a row — KEYSTONE · HARBOR POINT · CARDINAL STATE · BLUEWATER · PEACH STATE — each with an empty mono status pill the trainee fills (confirmed in writing, preliminary, or notice only) as a self-audit before answering. The three stack chips sit on a navy rail; the two notice chips on grey.

#### 2 · Slide Body — Knowledge verification

1. Name every coverage on John Doe's file, whose it is and what it pays. Which three are the $40,000 Recovery Stack, and why do the others stay out of it?
2. State the Payer-First Principle and apply it to Summit Imaging's 03/11/2026 LOP request. What would an LOP there have cost John Doe, and why?
3. List the five letters that left John Doe's file on 02/17/2026. For each, give the insured it named and how it was addressed.

**Best practices & pitfalls**

- Answer with the file's own carriers, claim numbers and dates, not general rules.
- ⚠️ Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize, in your own words, what you learned setting up and verifying John Doe's coverage: the principles, not the clicks.
- Articulate your strategy: on 03/11/2026 Keystone's limit is still unconfirmed. What is your next action on the coverage file, and why is it the right one rather than something else?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Sorting each coverage by whose it is and what it pays | ○ | ○ | ○ | ○ | ○ |
| Routing Medical Bills by the Payer-First order | ○ | ○ | ○ | ○ | ○ |
| Drafting an LOR with every required component | ○ | ○ | ○ | ○ | ○ |
| Addressing each letter to the right carrier, insured and adjuster | ○ | ○ | ○ | ○ | ○ |
| Protecting client information in third-party correspondence | ○ | ○ | ○ | ○ | ○ |
| Tracking each coverage from reported to confirmed in writing | ○ | ○ | ○ | ○ | ○ |
| Keeping follow-ups and regulatory deadlines dated and current | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary with adjusters | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (7 questions):

1. Which coverages make up John Doe's $40,000 Recovery Stack?  
   **✓ Keystone BI, Harbor Point Host UM and Cardinal State Relative UM** · Keystone BI, Host UM, Relative UM and Harbor Point MedPay · Keystone BI, Keystone PD and Host UM · Host UM, Relative UM and his own Bluewater UM  
   *Only the coverages that pay the claim stack: $10,000 BI + $20,000 Host UM + $10,000 Relative UM. MedPay pays bills now (Payer Order), PD pays for the car, and John Doe rejected UM on his Bluewater policy in writing on 03/14/2024.*
2. On 03/11/2026 Summit Imaging asks for an LOP for John Doe's $2,395.00 MRI. Harbor Point MedPay has $3,675.00 left. What do you do?  
   Prepare the LOP for Atty. Thorne's approval, since the provider asked for one · **✓ Decline the LOP and route the bill to MedPay, which applies first** · Send the bill to Peach State first, to save MedPay for later · Tell Summit it will be paid in full at settlement  
   *The Payer-First Principle: MedPay pays regardless of fault, and Harbor Point confirmed it has no reimbursement right, so the MRI is paid with nothing to repay. An LOP would have turned it into a $2,395.00 lien against John Doe's net. Never promise a provider payment at settlement.*
3. Crescent Pain & Spine billed $3,400.00 for the 05/15/2026 injection, and Peach State paid $1,860.00. Why does Peach State's reimbursement claim start at $1,860.00?  
   Peach State always discounts its claims by about 45% · **✓ Crescent is in network: the plan paid its contract rate, Crescent wrote off the rest and cannot balance-bill, so the plan can only claim what it paid** · The other $1,540.00 is owed by MedPay · John Doe still owes Crescent the $1,540.00, so it is left out of the plan's claim  
   *A Health Plan's reimbursement claim is what it paid, not what was billed. In network, the $1,540.00 difference is written off for good. That is why the Health Plan comes before an LOP, which carries the full billed amount into the recovery.*
4. Cardinal State Mutual has no adjuster assigned when John Doe's LOR goes out on 02/17/2026. How is the letter addressed?  
   “Attn: Teresa Okafor”, to save re-addressing it later · **✓ “Attn: Claims Department”, with the claim number in the subject line** · To Margaret Doe, the insured, to forward to her carrier · Held back until Cardinal State assigns an adjuster  
   *With no adjuster assigned, the address line reads “Attn: Claims Department”. Teresa Okafor is not assigned until 03/03/2026, and holding the letter delays the UM notice.*
5. Harbor Point's LOR goes out on 02/17/2026, long before BI can be exhausted. What should it do?  
   Demand the $20,000 Host UM limits now, so the response clock starts running · Wait until Keystone tenders its $10,000 before writing to Harbor Point at all · Ask Harbor Point to pay the BI layer too, since Keystone is slow · **✓ Give notice of the Host UM claim, open the MedPay claim and ask for its claim forms and proof-of-loss requirements, and ask for written confirmation of coverage, with no UM payment demand**  
   *UM policies carry notice conditions, so the carrier is noticed at set-up. Notice is not a demand: the UM layers owe nothing until BI is exhausted, so a UM payment demand now is premature. What puts the stack at risk is settling or releasing BI without the UM carriers' consent. MedPay is different: it pays bills as they are submitted.*
6. Keystone Mutual gave a figure on the set-up call but will not confirm Robert Smith's limits in writing or release its Declaration Page without a written request and authorizations. What do you do?  
   **✓ Send the written limits request Atty. Thorne signs, with only the documents or limited authorization he approves, keep BI preliminary, and calendar the follow-up** · Mark BI $10,000 confirmed from the set-up call, so the projection can be finished · Demand Host UM now, so that Harbor Point puts pressure on Keystone · Tell John Doe the limit is probably $10,000, and revisit it later  
   *Expect asymmetry: a third-party BI carrier often wants a written request and documents first. Until its Declaration Page arrives (03/20/2026 on this file), the set-up-call figure is a lead: BI stays preliminary and no limit is quoted to the client. What goes with the request is counsel's call: never a blanket Medical Authorization to an adverse carrier. Some states set what a limits request must contain; confirm the governing rule.*
7. The Coverage Matrix lists Harbor Point MedPay, $5,000, as stack layer 4 and totals the stack at $45,000. What is the correct treatment?  
   Leave it: MedPay is first-party coverage from a stack carrier · Fold MedPay into the Host UM limit, making it $25,000 · **✓ Move MedPay to the Payer Order and restore the stack to $40,000** · Delete MedPay from the file, since it is not part of the stack  
   *MedPay pays bills now; it is Payer Order, not Recovery Stack. It stays tracked (Harbor Point confirmed no reimbursement right on 03/02/2026), and the stack is $10,000 + $20,000 + $10,000 = $40,000.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | LOR mechanics | Five letters, insureds and Attn lines correct; third-party letter limited to the client's name |
| 🤖 AI | **20%** | Verification status | Host UM 03/02/2026 and Relative UM 03/09/2026 confirmed in writing; BI preliminary until 03/20/2026 |
| 🤖 AI | **15%** | Stack discipline | $40,000 stack; MedPay and Keystone PD tracked outside it; add-on effect stated correctly |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Gives the adjuster nothing on the gap; escalates to Atty. Thorne where authority is required |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 6 is the pressure scenario. The right answer gives Dana Whitfield nothing on the gap, holds the written limits request as it stands, logs the call and tells Atty. Thorne. The gap is explained once, in the demand he approves, through the Medical Records and the documents the client call identified; the recorded call itself is privileged and never goes to a carrier.
- Question 4 separates trainees who know the dates from those who know the sources. Push for the document behind each “confirmed”.
- Compare each self-rating with the score. A 5 next to a $45,000 stack is a coaching conversation.
- UPL is a gate: a strong score does not survive a letter signed for the attorney or a coverage opinion given to a carrier or the client.

---

### 1.2.14 Case Plan Audit & Day 1 Gate

> **Knowledge Check** · Day 1 — File opening & case strategy · Case Phase 2: Claim Set Up · scored with Case Plan Audit & Day 1 Gate (`d1m4`)  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thorne · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#8` Case Acceptance Determination · `D1#23` Case Planning Framework: The Three-Pillar Case Plan · `D1#24` Case Planning Framework: Mandatory Disclosure & Compliance Tracking · `D1#25` The “Golden Rule” of US Claim Set-Up · `D1#44` Handling Treatment Gaps During the Treatment Phase · `D2#13` Treatment Gaps in the Demand Phase

#### 1 · Visual Layout Description

The standard knowledge-check split, with one Day-1-specific addition above the question panel: a full-width DAY 1 GATE bar of four connected checkpoint chips — CMS INITIALIZED · STACK VERIFIED $40,000 · TRIPLE-CHECK CLEARED · PLAN ROUTED — each with a tick state, and a closed navy barrier at the right end labelled DAY 2 with a small note: “opens when all four are green.” The barrier makes the sequential-integrity rule visible rather than merely stated.

#### 2 · Slide Body — Knowledge verification

1. Set out the five bands of the Case Plan and what belongs in each, including the three pillars.
2. Explain why an adverse fact buried in the body of a plan has not, in any meaningful sense, been disclosed to counsel.
3. State John Doe's coverage position exactly as it should appear in the plan: layers, limits, total, order of operations, and the status of the projection.

**Best practices & pitfalls**

- Check all four gate conditions before you move to Day 2.
- ⚠️ Pitfall: quietly editing an approved plan instead of re-routing it.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize what you learned about turning a raw intake into a file an attorney can set strategy from.
- Articulate your strategy: the plan is with Atty. Thorne. What is your next action, and what are you waiting on before the one after that?
- Identify the one thing across all of Day 1 you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Recording an acceptance decision with its reason | ○ | ○ | ○ | ○ | ○ |
| Structuring a complete five-band, three-pillar Case Plan | ○ | ○ | ○ | ○ | ○ |
| Stating a coverage position as an ordered stack | ○ | ○ | ○ | ○ | ○ |
| Computing and documenting a Treatment Gap precisely | ○ | ○ | ○ | ○ | ○ |
| Routing for attorney review and keeping version discipline | ○ | ○ | ○ | ○ | ○ |
| Keeping operational proposals apart from legal strategy | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (4 questions):

1. The three pillars of the Case Plan are:  
   Coverage, Liability, Projection · **✓ Clinical, Functional, Financial** · Intake, Treatment, Demand · HIPAA, BCRC, Payer Order  
   *Clinical (acute interventions), Functional (ADLs and return to work), Financial (Payer Order, subrogation, MMSEA).*
2. Once the claim is set up, the Case Plan is typically filed within:  
   7 days · **✓ 30–60 days, depending on the state** · 6 months · After maximum medical improvement  
   *Often 30–60 days depending on the state. Docket the date.*
3. John Doe's date of loss is 02/06/2026 and his first treatment is 02/20/2026. The gap is:  
   7 days · 10 days · **✓ 14 days** · 20 days  
   *14 days, and it goes in the plan's risks band with its consequences.*
4. Under the Golden Rule of US claim set-up, what belongs in a treatment note?  
   “This will help the case.” · **✓ Factual, clinical observations only** · The attorney's valuation · Settlement strategy  
   *Coordinate, don't commingle: the medical track and the legal track never cross.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Band recall | All five bands and all three pillars named with correct contents |
| 🤖 AI | **15%** | Coverage accuracy | Limits, total, order of operations; projection preliminary |
| 🤖 AI | **15%** | Gap computation | 14 days, correct dates, the adjuster's arguments named |
| 🤖 AI | **10%** | Gate conditions | All four Day 1 gate conditions listed |
| 🤖 AI | **5%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Version reasoning | Recognises the approval is superseded and the plan must be re-routed |
| 🧑‍🏫 Trainer | **10%** | Boundary judgment | The examples are genuinely on the right sides of the line |
| 🧑‍🏫 Trainer | **10%** | Self-Summary quality | Specific and honest across the whole day |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Defensible against the score |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 5 tests version discipline and is the most often failed: the approval is superseded, and the plan must be re-routed, not quietly edited.
- Question 7 enforces sequential integrity: with an unverified stack, Day 2's Letters of Representation go to the wrong carriers in the wrong order.
- This check closes Day 1. Confirm the gate aloud with the room before releasing anyone to Day 2.
- Compare scores with self-ratings across all four modules, not just this one.

---
