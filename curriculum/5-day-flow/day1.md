# Case Flow Day 1 — Fundamentals & Intake

**Phase:** File opening · **Focus case:** John Doe v. Robert Smith · **Lead Counsel:** Atty. Elijah Thone

**Objective.** Open John Doe's file correctly: every party mapped, all three coverage layers verified to $40,000, the Regulatory Triple-Check cleared with the health plan's reimbursement right flagged before any demand, and an attorney-ready case plan that names the 14-Day Gap.

**Gate to the next day.** CMS initialized · policy stack verified at $40,000 · Regulatory Triple-Check cleared · case plan routed to Atty. Thone

> Generated from `js/cm-case-flow-data.js` by `build/case-flow/curriculum.cjs`. Edit the data and regenerate; never edit this file by hand. Spec: `00-architecture.md`. Theory map: `traceability.md`.

## Case continuity anchors

| | |
|---|---|
| **Case** | John Doe v. Robert Smith (LSH-2026-MVA-770412) — MVA — passenger injury |
| **Lead Counsel** | Atty. Elijah Thone |
| **Date of loss** | 02/06/2026 · **SOL** 02/06/2028 (Docketed on a two-year limitation for this training file. Confirm the governing state's statute before relying on it.) |
| **Client** | John Doe — Front-seat passenger in the host vehicle |
| **Policy stack** | $10,000 BI / $20,000 HOST UM / $10,000 REL UM = **$40,000** |
| **Health plan** | Peach State Health Plan · PSH-55017742 · GRP-41208 |
| **Critical fact** | Initial 14-Day Treatment Gap, then disrupted care mid-treatment. |

## This day's modules

**Module 1 — CM Fundamentals & CMS Initialization**  
From a raw file to a correctly structured matter: party roles, the three-layer policy stack, and the Regulatory Triple-Check.

1. *Lesson* — Ingesting the Raw File
2. *Skill Activity* — Policy Stack & Coverage Verification
3. *Lesson* — Health Subrogation, Payer Order & the Regulatory Triple-Check
4. *Skill Activity* — Subrogation Lien Flagging in the CMS
5. *Knowledge Check* — Policy Stack Knowledge Check

**Module 2 — Handling MIA Clients — Early Retention Phase**  
The client who stops answering: the No Contact Protocol, a defensible outreach log, the Final Warning Letter and the skip-trace trigger.

1. *Lesson* — The No Contact Protocol — Steps 1 to 3
2. *Skill Activity* — Multi-Channel Outreach Logging
3. *Lesson* — Final Warning Letter & the Skip-Trace Trigger
4. *Skill Activity* — Final Warning Letter Drafting
5. *Knowledge Check* — MIA Escalation Knowledge Check

**Module 3 — Property Damage Handling & Onboarding Directions**  
The client's standing instructions, rental authorization, repair estimates and the total-loss question, and the packet that sets expectations on day one.

1. *Lesson* — Client Do's and Don'ts & Rental Authorization
2. *Skill Activity* — Client Onboarding Direction Packet
3. *Lesson* — Repair Estimates, Total Loss & Loss of Use
4. *Skill Activity* — Onboarding Direction Assignment in System
5. *Knowledge Check* — PD & Onboarding Knowledge Audit

**Module 4 — Intake Operations & Action Plan Editor**  
The acceptance decision and the Three-Pillar Case Plan: structuring it, flagging the 14-Day Gap, and routing it for attorney review.

1. *Lesson* — The Acceptance Decision & the Three-Pillar Case Plan
2. *Skill Activity* — Identifying & Flagging the 14-Day Gap
3. *Lesson* — The Action Plan Editor & Attorney Review Routing
4. *Skill Activity* — Live Case Plan Draft — John Doe v. Robert Smith
5. *Knowledge Check* — Case Plan Audit & Day 1 Gate

**End-of-day discussion (trainer):** John Doe has gone quiet for eleven days, has not started treatment, and Robert Smith's carrier has already called him. Which three actions do you take today, in what order, and what goes in the case plan's risks band?

---

## Module 1 — CM Fundamentals & CMS Initialization

From a raw file to a correctly structured matter: party roles, the three-layer policy stack, and the Regulatory Triple-Check.

**Rhythm:** Lesson ➔ Skill Activity ➔ Lesson ➔ Skill Activity ➔ Knowledge Check

### 1.1.1 Ingesting the Raw File

> **Lesson** · Day 1 — File opening · Module 1: CM Fundamentals & CMS Initialization  
> **Topic:** From “On the Records” to a structured matter  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#1` Training Agenda & What Case Management Is · `D1#3` Key Duties of a Case Manager · `D1#4` Understanding Case Phases · `D1#5` Case Phase: Intake — Establishing Control · `D1#6` The Real Intake Workflow · `D1#7` Intake & Initial Client Contact — Gatekeepers of Case Quality · `D1#10` Bottleneck: Incomplete Client Information · `D1#12` Bottleneck: Conflict Check Delays · `D1#13` Bottleneck: Intake Form Errors · `D1#15` Bottleneck: Communication Gaps · `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy · `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · LSH Claims Specialist: pre-claim data set, declarations page, coverage asymmetry

#### 1 · Visual Layout Description

Left-to-right intake pipeline across the full slide width. Left third: a muted grey stack of unsorted documents labelled RAW INTAKE, deliberately untidy. Centre: three orange-numbered gates in a row — ① Verify ② Map ③ Structure — each a navy card with the orange circle badge top-centre and a thin navy → connector between them. Right third: a clean white CMS matter card with six filled role rows, each with a green ✓. The argument is made by the contrast between the grey untidy left edge and the crisp white right edge. Beneath the pipeline, a full-width orange-bordered strip holds the case's four continuity anchors as mono pills.

#### 2 · Slide Body — Tell Them

*Why:* The Intake Phase is where the Case Manager establishes control, structure and clarity. It is not just data collection: a file opened wrong stays wrong, because every later deadline, demand and lien check reads from the fields set in the first hour. A mis-mapped party is not a typo. It is a lost coverage layer.

1. Case management is the end-to-end coordination, tracking and handling of a case from intake to resolution: timely progression, proper documentation and compliance, and effective communication between all parties. It is ownership, not data entry.
2. You are the gatekeeper of case quality. Confirm the intake work is complete, accurate, properly documented and ready for activation. Incomplete intake goes back, not forward.
3. Run the conflict check before the file is created, on the full legal name of every party (Robert Smith, the host driver, the resident relative), and record its date and result. Nothing else moves until it is done.
4. Confirm the date of loss against the police report, not the intake note. The statute of limitations, every carrier deadline and the treatment timeline count from it.
5. Compare the intake narrative with the police report and the client's statement, and check every signature and authorization before activation. Confirm and document any correction; never fix an inconsistency silently.
6. Docket the statute of limitations on day one. On this file: 02/06/2028.
7. Map every party to a role. Six roles exist on this file, and a party left as “unknown” is a coverage layer you have not found yet.
8. Record the client's position in the vehicle. Driver, passenger or pedestrian decides which policies can be reached.
9. Collect the full pre-claim data set (client basics, every driver and vehicle, insurance from the police report or the client, witnesses) and the emergency contact. Clients go quiet, and the emergency contact is the channel that still reaches them.
10. Read coverage off the declarations page, not a summary, and record the source of every coverage fact: dec page, adjuster letter or police report.
11. Expect asymmetry. First-party carriers disclose limits readily; a third-party BI carrier usually asks for documents first and runs its own investigation.
12. Name every document to the firm's convention on ingest, and keep the CMS as the single source of truth, not side emails.

> ⚠️ **UPL boundary.** You may confirm facts and explain the process. You may not tell the client what the case is worth or whether they have a claim. That is Atty. Thone's call.

#### 2 · Slide Body — Show Them

*The six roles on John Doe's file, and what each one unlocks*

| Role | Party | Why this field matters |
|---|---|---|
| Client / Plaintiff | John Doe | Front-seat passenger, not a driver. This field opens two UM layers. |
| Defendant | Robert Smith | At-fault driver. His BI carrier pays first. |
| Lead Counsel | Atty. Elijah Thone | Every demand and filing routes through him. |
| Case Manager | You | Owns the file's movement; does not own legal judgment. |
| Host driver | Operator of John Doe's vehicle | Source of the $20,000 Host UM layer. |
| Resident relative | John Doe's household relative | Source of the $10,000 Relative UM layer. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Raw file received from “On the Records” | Run and document the conflict check, then verify DOL, parties and signatures against the source documents | CMS → New Case | Conflict check logged before the file exists; DOL matches the police report |
| Matter created | Docket the SOL and log the retainer and the claim-specific HIPAA authorization | CMS → Calendar · Documents | SOL 02/06/2028 on the calendar; both signatures logged |
| Parties identified | Map all six roles and record the client's position in the vehicle | CMS → Parties | No party left “unknown”; position = passenger |
| Documents arrive | Name each to the firm's convention and file it under its CMS category | CMS → Documents | Every document findable by its convention name |

**Best practices & pitfalls**

- Record the source of every coverage fact (dec page, adjuster letter, police report).
- Docket the statute of limitations on day one.
- Request missing documents in one consolidated message, with a deadline.
- Use the CMS as the single source of truth, not side emails.
- ⚠️ Pitfall: creating the file before the conflict check is documented.
- ⚠️ Pitfall: running the conflict check on a nickname or partial name.
- ⚠️ Pitfall: rewriting a vague summary from memory instead of confirming the facts with the client.
- ⚠️ Pitfall: accepting a case because intake “mostly” looks fine.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.1.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Conflict check first | Conflict check documented before the file is created |
| 🤖 AI | **20%** | DOL and SOL | DOL 02/06/2026 matched to the police report; SOL 02/06/2028 docketed |
| 🤖 AI | **25%** | Role completeness | All six roles populated, none left blank or “unknown”, client recorded as a passenger |
| 🧑‍🏫 Trainer | **25%** | Verification discipline | Cross-checked the sources rather than accepting the intake note |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | No valuation or merits opinion offered to the client |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Open by asking the room: “What is the single most expensive mistake you can make in the first hour of a file?” Let them answer, then show the passenger field.
- The passenger fact is the whole lesson. As a driver on this loss John Doe reaches $10,000. As a passenger he reaches $40,000. Same crash, same injuries, four times the recovery, decided by one field.
- Stress that “On the Records” files arrive unverified. A trainee who treats the intake note as fact carries its errors into the demand.
- Name the UPL line now. It comes back every day of this program.

---

### 1.1.2 Policy Stack & Coverage Verification

> **Skill Activity** · Day 1 — File opening · Module 1: CM Fundamentals & CMS Initialization  
> **Topic:** Skill Activity 1 — build the ladder to $40,000  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#20` Case Study: John Doe v. Apex — Coverage Analysis · LSH Claims Specialist: CMS Insurance tab SOP, first- and third-party coverage

#### 1 · Visual Layout Description

A vertical three-rung ladder in the centre of the slide, built bottom-up so the stacking order reads physically. Rung 1 (bottom, navy): BI $10,000. Rung 2 (navy-soft): HOST UM $20,000. Rung 3 (top, orange): RELATIVE UM $10,000. Each rung is a rounded bar carrying its carrier, claim number and adjuster in small mono type on the right. To the right, a vertical orange brace spans all three rungs with the total, $40,000, set large in Fraunces. Below, one empty verification checkbox per layer in an orange-bordered card headed VERIFY EACH LAYER. The rungs are numbered 1-2-3 bottom to top and never reordered.

#### 2 · Slide Body — Let Them

**Scenario.** The declarations pages for all three policies have landed in John Doe's file. Nothing has been entered in the CMS Insurance tab yet.

**Execution prompt.** Build the complete policy stack for John Doe v. Robert Smith. Enter all three layers in the CMS in their order of operations, with carrier, policy number, claim number, limit and adjuster for each. Classify each layer as first-party or third-party. In the Comments box record the carrier's actual name, the driver's name where it differs from the owner, and the adjuster's details, or state expressly that none is assigned yet. Then verify the total, record the order the layers must be pursued in, and mark the projection preliminary until each limit is confirmed in writing.

| | |
|---|---|
| **Tool / interface** | CMS → Insurance tab |
| **Expected output** | A three-layer coverage matrix totalling $40,000, each layer classified, ordered and fully attributed. |

**Show Them — reference model**

*The stack, and the order it must be worked in*

| # | Layer | Party | Limit | Carrier | Claim | Adjuster |
|---|---|---|---|---|---|---|
| 1 | **BI** — Bodily Injury — Robert Smith's liability | third-party | $10,000 | Keystone Mutual Insurance | KM-26-440871 | Dana Whitfield |
| 2 | **HOST UM** — Underinsured Motorist — host vehicle policy | first-party | $20,000 | Harbor Point Insurance | HP-26-7741 | Marcus Bell |
| 3 | **REL UM** — Underinsured Motorist — resident relative policy | first-party | $10,000 | Cardinal State Mutual | CS-26-20355 | Not yet assigned |
| | | | **$40,000** | | | |

**Order of operations:** BI → HOST UM → REL UM. Demanding out of order forfeits the stack.

**Verification checkpoints**

- [ ] All three layers present: BI, Host UM, Relative UM
- [ ] Limits entered as $10,000 / $20,000 / $10,000
- [ ] Total computes to $40,000
- [ ] Order of operations recorded: BI → Host UM → Relative UM
- [ ] BI classified as third-party; both UM layers as first-party
- [ ] Policy number and claim number completed for every layer
- [ ] Relative UM adjuster recorded as “No adjuster assigned yet”, not left blank
- [ ] Source of each limit recorded (dec page)
- [ ] Projection marked preliminary until each limit is confirmed in writing

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Declarations pages received | Enter each layer with its limits and identifiers | CMS → Insurance tab | Three layers, each with policy number, claim number and adjuster (or “none yet”) |
| All layers entered | Verify the total and record the order of operations | CMS → Insurance tab → Comments | $40,000; BI → Host UM → Relative UM |
| A limit is unconfirmed | Hold the projection as preliminary | CMS → Case Notes | No limit quoted to the client before written confirmation |

**Best practices & pitfalls**

- Record where each limit came from, so anyone can check it.
- Re-project whenever coverage, liability or treatment changes.
- ⚠️ Pitfall: projecting value before coverage is confirmed.
- ⚠️ Pitfall: quoting a likely limit to the client before it is confirmed in writing.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.1.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Limit accuracy | $10,000 BI / $20,000 Host UM / $10,000 Relative UM, each on the right layer |
| 🤖 AI | **15%** | Total | Exactly $40,000 |
| 🤖 AI | **15%** | Order of operations | BI → Host UM → Relative UM |
| 🤖 AI | **10%** | Field completeness | Policy number, claim number and adjuster (or “none yet”) on every layer |
| 🧑‍🏫 Trainer | **25%** | Understands stacking | Can explain why the passenger fact opens two UM layers, not just that it does |
| 🧑‍🏫 Trainer | **15%** | Verification habit | Checked limits against the declarations pages, and held the projection until confirmed |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Walk the ladder bottom-up out loud: “BI pays first, and only once it is exhausted does Host UM open.”
- The common error is entering the layers as three equal parallel claims. Stop it at once: demanding UM before documenting the BI tender forfeits the stack.
- Ask: “Whose policy is the Host UM?” Trainees often say John Doe's. It is the host driver's; John Doe reaches it because he was riding in that car.
- Have two trainees read their total aloud. Anything other than $40,000 means a layer is on the wrong rung.

---

### 1.1.3 Health Subrogation, Payer Order & the Regulatory Triple-Check

> **Lesson** · Day 1 — File opening · Module 1: CM Fundamentals & CMS Initialization  
> **Topic:** Who pays the bills now, and who gets paid back later  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#23` Case Planning Framework: The Three-Pillar Case Plan · D1 Task Overview: Billing, Resolution & Closing

#### 1 · Visual Layout Description

A two-lane swimlane running left to right. Upper lane, navy, labelled PAYS THE BILLS NOW — PAYER ORDER: an arrow through PIP/MedPay → Peach State Health Plan → LOP/provider liens. Lower lane, orange, labelled PAYS THE CLAIM LATER — RECOVERY STACK: an arrow through BI → Host UM → Relative UM ending at a SETTLEMENT node. A bold orange return arrow curves from the health plan in the upper lane down into the settlement node, labelled REIMBURSEMENT CLAIM. The curve is the heaviest line on the slide. Top-right, three stacked chips form the Regulatory Triple-Check: HIPAA · BCRC · PAYER ORDER, each with a tick box. Bottom-left, a danger-bordered callout: “Flagged late = paid twice.”

#### 2 · Slide Body — Tell Them

*Why:* Two different questions get confused on every new file: who pays John Doe's medical bills while the claim is open, and who pays the claim itself at the end. The health plan answers the first and then asks to be repaid out of the second. A reimbursement claim found after the demand goes out comes out of the client's net.

1. Clear the Regulatory Triple-Check before any clinical planning begins, so the claim is properly established and you are authorized to act.
2. Check 1, HIPAA: obtain a claim-specific Authorization to Release Medical Information. It names the incident date and permits communication with legal and insurance parties; a generic release may not be adequate.
3. Check 2, Medicare/Medicaid: if the client is 65+ or on SSDI, report the case to the Benefits Coordination & Recovery Center (BCRC) under MMSEA (2007). Skipping it risks federal penalties and a frozen settlement. John Doe is 34, so the check is his SSDI status: verify it and record the answer.
4. Check 3, payer order: PIP/MedPay first, then private health insurance, then LOP/provider liens. Verify whether any PIP/MedPay applies on this loss; do not assume it.
5. The payer order is not the recovery stack. The $40,000 in BI and UM pays the claim; the payer order pays the bills while it is open.
6. A health plan that pays accident-related bills asserts a reimbursement right against the settlement. Identify it early so it doesn't surprise you at settlement: flag it on first notice, before the first demand.
7. Record the plan's carrier, member ID and group number in the CMS lien register the day they are known, and log the BCRC answer in the file.
8. Never promise a provider or a plan a payment amount. Verify now, negotiate at the lien stage, with authority from Atty. Thone.

> ⚠️ **UPL boundary.** You may gather lien documentation and report what a plan asserts. You may not advise the client on whether a lien is enforceable, or negotiate a compromise without counsel's authority.

#### 2 · Slide Body — Show Them

*Pays the bills now vs. pays the claim later*

| PAYER ORDER — pays the bills now | RECOVERY STACK — pays the claim later |
|---|---|
| 1. PIP/MedPay, if any applies (verify it). | 1. BI — $10,000 (Robert Smith's liability). |
| 2. Private health insurance: Peach State Health Plan · PSH-55017742 · GRP-41208. | 2. Host UM — $20,000. |
| 3. LOP/provider liens. | 3. Relative UM — $10,000. |
| The health plan then asserts a reimbursement right against the settlement. | $40,000 total. Our demands are built against these layers. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Retainer signed | Obtain the claim-specific HIPAA authorization naming the incident date | CMS → Documents | Authorization names 02/06/2026 and permits legal and insurance contact |
| Client's age and benefits known | Verify SSDI status; report to the BCRC if 65+ or on SSDI | CMS → Case Notes | BCRC answer logged with its date |
| Health plan identified | Record carrier, member ID and group; record the payer order | CMS → Liens | Lien record exists and is dated; payer order noted |
| Plan pays an accident-related bill | Flag the reimbursement right against the matter | CMS → Liens → Flag | Flag set before any demand is drafted |

**Best practices & pitfalls**

- Clear the triple-check before any clinical planning.
- Log the BCRC report date (or the verified “not required”) in the file.
- Identify subrogation interests early so they don't surprise you at settlement.
- ⚠️ Pitfall: using a generic medical release that doesn't name the incident date.
- ⚠️ Pitfall: reassuring the client that “insurance will cover it.”

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.1.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Triple-check complete | HIPAA authorization, BCRC answer and payer order all recorded |
| 🤖 AI | **20%** | Payer order | PIP/MedPay → private health insurance → LOP/provider liens, kept separate from the recovery stack |
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

### 1.1.4 Subrogation Lien Flagging in the CMS

> **Skill Activity** · Day 1 — File opening · Module 1: CM Fundamentals & CMS Initialization  
> **Topic:** Skill Activity 2 — register the claim before it can hurt you  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#24` Case Planning Framework: Mandatory Disclosure & Compliance Tracking

#### 1 · Visual Layout Description

A single annotated CMS Liens screen filling two-thirds of the slide, a white card with a navy header bar. Five fields are called out with orange numbered badges and leader lines to short labels in the right margin: ① Plan carrier ② Member ID ③ Group number ④ Payer order position ⑤ Reimbursement flag. Below the screen, a slim two-state timeline: a green node, FLAGGED NOW · before demand, and a red node, FOUND AT DISBURSEMENT · client's net is hit, crossed out. Keep the red state on the slide: trainees need to see the failure they are avoiding.

#### 2 · Slide Body — Let Them

**Scenario.** Peach State Health Plan has begun paying John Doe's accident-related treatment. No lien record exists on the matter yet, and the pre-demand audit is still ahead.

**Execution prompt.** Register Peach State Health Plan's reimbursement claim in John Doe's lien register and flag it against the matter. Record the carrier, member ID and group number, its position in the payer order, the basis on which reimbursement is asserted, and the date of the flag. Record the Regulatory Triple-Check results alongside it. Then state in one line what must happen before this lien can be compromised.

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
- [ ] Triple-Check recorded: HIPAA authorization, BCRC answer, payer order
- [ ] Escalation noted: compromise requires Atty. Thone's authority

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Plan's first payment posts | Create and flag the lien record | CMS → Liens | Record dated; flag set |
| Lien record created | Attach the Triple-Check results | CMS → Case Notes | HIPAA, BCRC and payer order all recorded |
| Any request to compromise | Route to Atty. Thone | CMS → Tasks → Escalate | No compromise discussed without counsel's authority |

**Best practices & pitfalls**

- Registering a lien is not conceding it; Day 3 is where it gets reduced.
- Keep the LOP provider list current with balances, so no bill surprises the policy limits.
- ⚠️ Pitfall: finding the lien at disbursement, when there is no time to negotiate from strength.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.1.5) and the day's auto-graded questions.

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

### 1.1.5 Policy Stack Knowledge Check

> **Knowledge Check** · Day 1 — File opening · Module 1: CM Fundamentals & CMS Initialization  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#20` Case Study: John Doe v. Apex — Coverage Analysis · `D1#22` Case Planning Framework: Regulatory Intake & Verification

#### 1 · Visual Layout Description

Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SKILL SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar, to show it is not part of the weighting.

#### 2 · Slide Body — Knowledge verification

1. List the three coverage layers on John Doe v. Robert Smith in the order they must be pursued, with each layer's limit and the total available.
2. John Doe was a front-seat passenger. Explain how that single fact changes the available recovery, and what it would have been had he been the driver of the host vehicle.
3. Why must the Host UM layer not be demanded before the BI layer is exhausted or tendered? State the consequence of getting the order wrong.
4. Set out the payer order for John Doe's medical bills, and explain why it is a different question from the recovery stack.
5. Name the three parts of the Regulatory Triple-Check and what each requires on this file, including what you verify for the BCRC.
6. You discover an unregistered health lien on the morning the demand package is due to be served. Describe what you do, in what order, and whose authority you need.

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
| Building and verifying a multi-layer policy stack | ○ | ○ | ○ | ○ | ○ |
| Stating the order of operations across coverage layers | ○ | ○ | ○ | ○ | ○ |
| Running the Regulatory Triple-Check and the payer order | ○ | ○ | ○ | ○ | ○ |
| Registering and flagging a subrogation claim in the CMS | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary in client contact | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (4 questions):

1. On John Doe v. Robert Smith, in what order must the coverage layers be pursued?  
   Host UM → BI → Relative UM · **✓ BI → Host UM → Relative UM** · Relative UM → Host UM → BI · All three at once, in parallel  
   *BI pays first. Host UM opens once BI is exhausted or tendered, and Relative UM stacks behind Host UM.*
2. Why can John Doe reach the $20,000 Host UM layer?  
   He owns the host vehicle · **✓ He was a passenger in the host vehicle** · Robert Smith has no insurance · His health plan assigns it to him  
   *He reaches the host vehicle's UM because he was riding in that car. As a driver he would have reached $10,000.*
3. The correct payer order for John Doe's medical bills is:  
   Health plan → PIP/MedPay → LOP/provider liens · **✓ PIP/MedPay → private health insurance → LOP/provider liens** · LOP/provider liens → health plan → PIP/MedPay · Robert Smith's BI carrier pays each bill as it arrives  
   *The Regulatory Triple-Check payer order: PIP/MedPay, then private health insurance, then LOP/provider liens.*
4. Which of these is NOT part of the Regulatory Triple-Check?  
   A claim-specific HIPAA authorization that names the incident date · Medicare/Medicaid (BCRC) reporting where the client is 65+ or on SSDI · Payer order and subrogation management · **✓ The time-limit demand**  
   *The triple-check is HIPAA, Medicare/Medicaid reporting, and the payer order. Demands come on Day 3.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Stack accuracy | Three layers, correct limits, $40,000 total, correct order |
| 🤖 AI | **15%** | Passenger reasoning | Passenger status opens both UM layers; $10,000 named as the driver counterfactual |
| 🤖 AI | **15%** | Payer order & triple-check | Payer order correct and kept separate from the stack; all three checks named |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | The stated next action is the right one and the reasoning holds |
| 🧑‍🏫 Trainer | **10%** | Self-summary quality | Honest and specific, not a restatement of the slide |
| 🧑‍🏫 Trainer | **10%** | UPL boundary | Escalation to Atty. Thone identified where authority is required |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Self-score is defensible against demonstrated performance |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 2 is the keystone. A trainee who cannot answer it has memorised the numbers without understanding the stack; re-teach before moving on.
- Question 6 is a pressure scenario. The right answer registers the lien, tells Atty. Thone, and does not quietly serve the demand on time.
- Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.
- UPL is a gate: a strong score does not survive an ethics breach.

---

## Module 2 — Handling MIA Clients — Early Retention Phase

The client who stops answering: the No Contact Protocol, a defensible outreach log, the Final Warning Letter and the skip-trace trigger.

**Rhythm:** Lesson ➔ Skill Activity ➔ Lesson ➔ Skill Activity ➔ Knowledge Check

### 1.2.1 The No Contact Protocol — Steps 1 to 3

> **Lesson** · Day 1 — File opening · Module 2: Handling MIA Clients — Early Retention Phase  
> **Topic:** Internal review, escalating contact attempts, team notification  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** LSH Claims Specialist: No Contact Protocol, Steps 1–3 · `D1#11` Bottleneck: Delayed Client Follow-Up · `D1#9` Common Intake Bottlenecks — Overview · D5 agenda: MIA Clients

#### 1 · Visual Layout Description

A six-station vertical protocol spine down the left third, stations numbered 1–6 in orange circles on a navy rail. Stations 1–3 are in full colour (INTERNAL REVIEW · CONTACT ATTEMPTS · TEAM NOTIFICATION); stations 4–6 are greyed back with a small “next lesson” tag, so the whole protocol is visible but this lesson's scope is clear. The right two-thirds expands station 2 as an escalating channel ladder: PHONE (2+ attempts) → EMAIL + SMS → EMERGENCY CONTACT → CERTIFIED MAIL / FORMAL LETTER, each rung a widening bar. Bottom-right, a red-bordered card: “SOL and hearing dates keep running.”

#### 2 · Slide Body — Tell Them

*Why:* The No Contact Protocol does three jobs at once: it tracks unresponsiveness formally, it establishes due diligence before any withdrawal, and it protects the firm from liability. A client who can't be reached is a file that still has deadlines, and the protocol is the proof the firm did its part.

1. Step 1, Internal Review: before you call anyone, check the case status, the live deadlines and the date of last contact, and confirm every earlier attempt used an approved channel.
2. Step 2, Contact Attempts, escalating: at least two phone attempts, then email and text, then the emergency contact, then certified mail or a formal letter.
3. Escalate by channel, not by volume. Two voicemails on one number clears the phone rung and nothing more.
4. Set a follow-up reminder the moment a request goes out, and give the client an easy way to answer: a call window, a text, an upload link.
5. Log every attempt in the CMS when you make it: date, time, channel, outcome. An unlogged attempt did not happen.
6. Step 3, Team Notification: escalate to the attorney or supervisor, document it in the CMS, and assess the case impact, including the statute of limitations and any hearing dates.
7. Deadlines do not pause for silence. Never let an outreach cycle consume a statutory or court date.

> ⚠️ **UPL boundary.** You may tell the client what the firm needs and by when. You may not advise them on what silence does to their legal rights, and you may not say representation will end. Withdrawal is the attorney's decision at Step 5.

#### 2 · Slide Body — Show Them

*The No Contact Protocol: all six steps; this lesson covers 1–3*

1. **Internal Review** — Case status, live deadlines, date of last contact; approved channels confirmed.
2. **Contact Attempts** — 2+ phone attempts → email and text → emergency contact → certified mail or letter.
3. **Team Notification** — Escalate to attorney/supervisor, document in the CMS, assess SOL and hearing dates.
4. **Final Warning Letter** — Certified mail AND email; 7–14 day deadline. (Next lesson.)
5. **Decision Point** — The attorney may file a Notice of Withdrawal or a Motion to Withdraw. (Next lesson.)
6. **File Closure** — “No response – withdrew per protocol”; all proof of attempts retained. (Next lesson.)

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Client misses a scheduled contact or appointment | Step 1: review case status, deadlines and the last contact date | CMS → Case Summary | Live deadlines identified before outreach begins |
| Internal review complete | Step 2: work the channel ladder; log each attempt | CMS → Communications Log | 2+ phone attempts, then email and text, each with date, time, channel, outcome |
| Channel ladder exhausted | Step 3: notify Atty. Thone and assess deadline impact on John Doe's file | CMS → Tasks → Escalate | Escalation documented; SOL (02/06/2028) and any hearing dates assessed |

**Best practices & pitfalls**

- Set follow-up reminders the moment a request goes out.
- Offer the client an easy way to respond: a call window, text, an upload link.
- ⚠️ Pitfall: letting a file sit because “we're waiting on the client” without logging attempts.
- ⚠️ Pitfall: blaming the client for delays that are really process gaps.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.2.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Step sequence | Steps 1–3 in order; internal review before outreach |
| 🤖 AI | **20%** | Channel ladder | 2+ phone attempts, then email and text, not repeats on one channel |
| 🤖 AI | **20%** | Log completeness | Every attempt carries date, time, channel and outcome |
| 🧑‍🏫 Trainer | **20%** | Deadline awareness | The Step 3 impact check names the running SOL, not just “escalated to attorney” |
| 🧑‍🏫 Trainer | **20%** | Boundary discipline | No withdrawal threat; no statement that the case will be closed |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Lead with purpose, not procedure: the protocol protects the client's file and the firm. Trainees who see it as chasing a client miss why the record matters.
- Step 1 is the step everyone skips; they start dialling. Ask: “What deadline is running on this file right now?” If they can't answer, they aren't ready to make the call.
- Channel versus volume is the most often failed point. Two voicemails on the same number clears the phone rung and nothing more. Say it twice.
- The emergency contact was collected at intake for exactly this moment. Intake decisions pay off here.

---

### 1.2.2 Multi-Channel Outreach Logging

> **Skill Activity** · Day 1 — File opening · Module 2: Handling MIA Clients — Early Retention Phase  
> **Topic:** Skill Activity 1 — build a defensible record  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** LSH Claims Specialist: No Contact Protocol, Step 2 · `D1#11` Bottleneck: Delayed Client Follow-Up

#### 1 · Visual Layout Description

A CMS communications log as a table across the full slide width, four rows pre-filled as worked examples and four blank rows outlined in orange for the trainee. Columns: Date · Time · Channel · Outcome · Next action. In the right margin, a vertical coverage tracker of four chips (Phone ×2, Email, SMS, Emergency contact), each grey until its rung is cleared, then orange. Bottom strip, in danger red: a BAD entry, “called client, no answer”, with no date, time or channel, annotated with what is missing.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe has not responded for six days. He missed a scheduled check-in call and his treatment has not begun. Two voicemails have been left on his mobile. Nothing has been logged. An emergency contact was collected at intake.

**Execution prompt.** Run the No Contact Protocol on John Doe's file. Start with the Step 1 internal review: name the deadlines that are live right now. Reconstruct the attempts already made, then carry the Step 2 channel ladder forward. Log every attempt with date, time, channel and outcome, and record the next action with its due date. Finally, state whether Step 3 team notification is warranted and what case impact you would report.

| | |
|---|---|
| **Tool / interface** | CMS → Case Summary · CMS → Communications Log |
| **Expected output** | A completed Step 1 review and an unbroken, contemporaneous Step 2 outreach log. |

**Verification checkpoints**

- [ ] Step 1 done: case status, live deadlines and the date of last contact reviewed before any outreach
- [ ] Earlier voicemails logged with date, time and channel
- [ ] Phone rung cleared with at least two attempts
- [ ] Email and SMS both attempted, not repeats on the phone
- [ ] Emergency contact used as an approved channel
- [ ] Every entry carries date, time, channel and outcome
- [ ] Next action recorded with a due date
- [ ] Step 3 impact names the running SOL (02/06/2028) and the treatment that has not started
- [ ] No entry threatens withdrawal or case closure

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Six days without contact | Step 1 internal review | CMS → Case Summary | Live deadlines listed |
| Review complete | Reconstruct and continue the log | CMS → Communications Log | Unbroken log, distinct channels |
| Ladder cleared, no answer | Step 3 escalation with case impact | CMS → Tasks → Escalate | Atty. Thone notified; impact recorded |

**Best practices & pitfalls**

- Write each entry as if a supervisor will audit it six months from now.
- ⚠️ Pitfall: “called client, no answer” with no date, time or channel.
- ⚠️ Pitfall: three calls to one mobile reported as three channels.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.2.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Field completeness | No entry missing date, time, channel or outcome |
| 🤖 AI | **20%** | Ladder progression | 2+ phone attempts, then email and SMS: genuinely different rungs |
| 🤖 AI | **10%** | Step 1 evidence | Internal review documented before outreach |
| 🤖 AI | **10%** | Impact assessment | SOL correctly identified as 02/06/2028 |
| 🧑‍🏫 Trainer | **25%** | Record defensibility | Would this log hold up if the file were reviewed six months from now? |
| 🧑‍🏫 Trainer | **15%** | Professional tone | Entries are factual and neutral; no editorialising about the client |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Start by having them read the red BAD entry aloud. “Called client, no answer” is what most of them would have written.
- Watch for trainees who skip Step 1 and start dialling. Ask what deadline is running before you let them log anything.
- The emergency contact is the rung most trainees forget. It was collected at intake for this.
- John Doe's treatment still hasn't begun. This silence is also what becomes the 14-Day Gap; plant that now, Module 4 flags it.

---

### 1.2.3 Final Warning Letter & the Skip-Trace Trigger

> **Lesson** · Day 1 — File opening · Module 2: Handling MIA Clients — Early Retention Phase  
> **Topic:** No Contact Protocol Steps 4 to 6, and when the search begins  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** LSH Claims Specialist: No Contact Protocol, Steps 4–6; withdrawal letters · D5 agenda: MIA Clients

#### 1 · Visual Layout Description

Two panels. Left: the Final Warning Letter on white letterhead with a navy band, four required elements called out by orange numbered badges — ① the earlier attempts, itemized ② a response deadline of 7–14 days ③ notice of potential withdrawal ④ how to respond. Above the letter, a chip pair reads CERTIFIED MAIL + EMAIL, joined by a bold AND, because both are required. Right: the Step 5 decision fork on a pale ground. Root, navy: “Response within the deadline?” Yes (green) → RESUME FILE. No (orange) → a three-chip AND gate (ladder exhausted · letter sent · deadline expired) ending in two outcomes: TRIGGER SKIP-TRACE and ATTORNEY DECISION POINT. Draw the gate as a gate, never as a bullet list.

#### 2 · Slide Body — Tell Them

*Why:* The Final Warning Letter is the last low-cost step before the firm either spends money to find someone or moves to withdraw. It has to be specific enough to get an answer, and documented enough to justify whichever comes next.

1. Step 4, the Final Warning Letter, goes by certified mail AND email. Both, not either.
2. It states the earlier attempts, a response deadline of 7 to 14 days, and notice of potential withdrawal.
3. Send it to the client's current and correct address. Confirm the address first; a letter to a stale address proves nothing.
4. Step 5, Decision Point: if the client is still unresponsive, the attorney may file a Notice of Withdrawal or a Motion to Withdraw, under firm and court rules. That is counsel's decision.
5. Step 6, File Closure: mark the file “No response – withdrew per protocol” and keep the communications and the proof of every attempt.
6. Skip-tracing starts only when all three are true: the contact ladder is exhausted, the letter has been sent, and its deadline has passed.
7. Skip-tracing is authorized by counsel. Escalate with the complete log attached.
8. Keep the file moving in parallel. Records requests, coverage verification and deadline tracking do not pause while outreach runs.

> ⚠️ **UPL boundary.** The letter may state the firm's requirements, its deadline and that withdrawal is possible. It may not characterise the strength of the claim or advise the client on what silence does to their legal rights. Only the attorney decides, and tells the client, that representation is ending.

#### 2 · Slide Body — Show Them

*The three-criteria gate: all must be true before the search begins*

1. **Contact ladder exhausted** — 2+ phone attempts, email, text and the emergency contact, all attempted and logged.
2. **Final Warning Letter sent** — Certified mail AND email, to a confirmed address, stating the 7–14 day deadline.
3. **Deadline expired** — The response window has passed with no contact from the client.

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Step 3 escalation made, still no response | Draft the Final Warning Letter with a 7–14 day deadline | Action Plan Editor → Warning letter template | Earlier attempts itemized; deadline and withdrawal notice present |
| Letter ready | Confirm the current address; send by certified mail AND email | CMS → Documents → Outgoing | Both channels used and logged; certified receipt kept |
| Response deadline expires | Verify all three criteria; escalate to Atty. Thone for skip-trace authority and the Step 5 decision | CMS → Tasks → Escalate | All three criteria evidenced in the log first |

**Best practices & pitfalls**

- Itemize the attempts with dates; “we have tried several times” is not evidence.
- Ask your in-house help to confirm an address you can't verify.
- ⚠️ Pitfall: triggering a skip-trace on the first criterion alone.
- ⚠️ Pitfall: writing “we are withdrawing” in a letter the attorney has not approved.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.2.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Letter elements | Attempts itemized, 7–14 day deadline, withdrawal notice, response method |
| 🤖 AI | **15%** | Dual delivery | Certified mail and email both used and logged |
| 🤖 AI | **20%** | Criteria evidence | All three skip-trace criteria shown in the log |
| 🧑‍🏫 Trainer | **20%** | Letter tone | Firm, clear and not threatening; a worried client would respond to it |
| 🧑‍🏫 Trainer | **20%** | Authority discipline | Withdrawal and skip-trace both escalated for counsel's decision |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Hold the room on the AND gate. Trainees reliably trigger the search on the first criterion alone, which spends the firm's money early and weakens the record.
- Both delivery channels are required. Ask why: certified mail proves delivery, email gets a response.
- Draw the Step 5 line hard: the CM assembles the record, the attorney decides to withdraw.
- Day 5 returns to this with advanced skip-tracing, process servers and certified notice. Today is the trigger; Day 5 is the execution.

---

### 1.2.4 Final Warning Letter Drafting

> **Skill Activity** · Day 1 — File opening · Module 2: Handling MIA Clients — Early Retention Phase  
> **Topic:** Skill Activity 2 — write the letter that gets answered  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** LSH Claims Specialist: Final Warning Letter; sample unresponsive-client letters

#### 1 · Visual Layout Description

A split drafting view. Left two-thirds: the live letter draft on white letterhead, the four required elements highlighting in pale orange as they are completed, with a completeness meter above the page from 0/4 to 4/4. A chip pair in the header (CERTIFIED MAIL + EMAIL) must both be ticked before the draft can be sent. Right third: a UPL guard-rail panel on a danger-bordered card listing banned phrases in red strikethrough — “you will lose your case,” “we are withdrawing,” “your claim will be worth less” — each with a compliant navy rewrite directly beneath it.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe has been unreachable for eleven days. The phone rung is cleared, emails and texts have been sent and the emergency contact has been tried, all logged. Step 3 escalation has been made to Atty. Thone. Treatment still has not begun.

**Execution prompt.** Draft the Step 4 Final Warning Letter to John Doe. Itemize the earlier attempts, set a response deadline inside the 7–14 day window, give notice of potential withdrawal, and state how he should respond. Keep every sentence inside the UPL boundary: nothing on the strength of his claim or the legal consequences of silence, and nothing that announces withdrawal as decided. Then record what must be true before skip-tracing can start, and whose authority the Step 5 decision needs.

| | |
|---|---|
| **Tool / interface** | Action Plan Editor → Warning letter template |
| **Expected output** | A send-ready Final Warning Letter with both deliveries logged, and a recorded escalation. |

**Verification checkpoints**

- [ ] Firm identification and the file reference present
- [ ] Date of loss stated as 02/06/2026
- [ ] Earlier attempts itemized with dates
- [ ] Response deadline inside the 7–14 day window, stated as a date
- [ ] Notice of potential withdrawal, as possible, not decided
- [ ] How to respond, with at least two channels
- [ ] Certified mail AND email both recorded
- [ ] Current address confirmed before sending
- [ ] No statement about claim value, legal consequences or settled representation status
- [ ] Skip-trace criteria recorded; Step 5 authority noted as Atty. Thone's

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Eleven days, Step 3 made | Draft the letter | Action Plan Editor | Four elements present |
| Draft complete | Send by certified mail and email | CMS → Documents → Outgoing | Both logged |
| Letter sent | Calendar the response deadline | CMS → Calendar | Deadline date on the calendar |

**Best practices & pitfalls**

- Urgent without threatening: say what is needed and by when.
- ⚠️ Pitfall: a deadline of “as soon as possible.”
- ⚠️ Pitfall: crossing into legal consequence (“you will lose your case”).

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.2.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Element completeness | All four elements; the deadline is a date inside 7–14 days |
| 🤖 AI | **10%** | Case accuracy | File reference and DOL correct |
| 🤖 AI | **15%** | Dual delivery | Certified mail and email both recorded |
| 🤖 AI | **15%** | Banned-phrase scan | No prohibited phrase in the draft |
| 🧑‍🏫 Trainer | **25%** | Tone and clarity | Would a worried client read this and call back? Firm without being cold. |
| 🧑‍🏫 Trainer | **15%** | UPL judgment | Withdrawal framed as possible, not announced; no legal-consequence advice |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The hard part is a letter that is urgent but not threatening. Most first drafts fail one way or the other.
- “Itemize” means list the attempts with dates.
- Read the banned and compliant pairs aloud before they draft. It saves a full rewrite.
- Have two trainees swap drafts and mark each other's against the four elements and the dual delivery before submitting.

---

### 1.2.5 MIA Escalation Knowledge Check

> **Knowledge Check** · Day 1 — File opening · Module 2: Handling MIA Clients — Early Retention Phase  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** LSH Claims Specialist: No Contact Protocol · `D1#11` Bottleneck: Delayed Client Follow-Up

#### 1 · Visual Layout Description

The standard knowledge-check split: cream question panel above, navy CM Self-Summary card below-left with the 1–5 skill ladder below-right, and the 60/40 strip with the separate red UPL gate on the far right. Unique to this module: between the question panel and the summary card, a horizontal NO CONTACT PROTOCOL CHECKLIST strip of all six steps as checkboxes with their required actions beneath, so the trainee self-audits the protocol before answering.

#### 2 · Slide Body — Knowledge verification

1. Set out all six steps of the No Contact Protocol in order, with the required action at each step.
2. State the three purposes the protocol serves, and explain which of them protects the firm rather than the client.
3. A colleague logs three voicemails to the client's mobile on three days and reports the contact ladder exhausted. Explain what is wrong and what the log should show instead.
4. State the three criteria that must all be met before skip-tracing starts, and explain why starting on fewer is a problem for both the firm and the record.
5. John Doe has been unreachable for eleven days and his treatment has not begun. Identify every risk now building on this file and what you do about each.
6. At Step 5 the client is still unresponsive. State precisely what you may do and what only Atty. Thone may do.
7. Rewrite this sentence to bring it inside the UPL boundary: “If you don't call us back this week, you will lose your case and we will have to withdraw.”

**Best practices & pitfalls**

- Use the six-step checklist before you answer.
- ⚠️ Pitfall: an answer that warns the client about their case.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize what you learned about the firm's duty to a client who has gone silent, and what the record has to show.
- Articulate your strategy: John Doe is on day eleven and still not treating. What do you do next, in what order, and why that order?
- Identify the one thing in this module you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Running the No Contact Protocol's channel ladder | ○ | ○ | ○ | ○ | ○ |
| Keeping a contemporaneous, defensible communications log | ○ | ○ | ○ | ○ | ○ |
| Drafting a Final Warning Letter that gets a response | ○ | ○ | ○ | ○ | ○ |
| Applying the three-criteria skip-trace gate | ○ | ○ | ○ | ○ | ○ |
| Keeping the file moving while outreach runs | ○ | ○ | ○ | ○ | ○ |
| Holding the line between my role and the attorney's decision to withdraw | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (4 questions):

1. Under the No Contact Protocol, what comes before any outreach call?  
   The Final Warning Letter · **✓ An internal review of case status, live deadlines and the date of last contact** · A skip-trace · A Motion to Withdraw  
   *Step 1 is the internal review: you check what is running on the file before you dial.*
2. Two voicemails on John Doe's mobile, on two days, show that:  
   The contact ladder is exhausted · **✓ The phone rung is cleared; email, text and the emergency contact still follow** · Skip-tracing can begin · The client has abandoned the case  
   *Escalate by channel, not by volume.*
3. The Final Warning Letter is sent by:  
   Email only · Certified mail only · **✓ Certified mail AND email** · Text message  
   *Both: certified mail proves delivery and email gets a response. It states the prior attempts, a 7–14 day deadline and notice of potential withdrawal.*
4. At Step 5 the client is still unresponsive. Who decides whether the firm withdraws?  
   The Case Manager · **✓ The attorney** · The intake team · The adjuster  
   *The Case Manager builds the record; the attorney decides on a Notice of Withdrawal or a Motion to Withdraw.*

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Protocol accuracy | All six steps in order with the right actions |
| 🤖 AI | **15%** | Criteria accuracy | All three skip-trace criteria stated as an AND gate |
| 🤖 AI | **15%** | Letter requirements | Certified mail and email; 7–14 day window |
| 🤖 AI | **10%** | Completeness | Every question answered substantively |
| 🧑‍🏫 Trainer | **15%** | Risk identification | Names the running SOL, the hardening treatment gap and the stalled claims work |
| 🧑‍🏫 Trainer | **10%** | Role boundary | Reserves the withdrawal decision to counsel |
| 🧑‍🏫 Trainer | **5%** | UPL rewrite quality | The rewrite is compliant and still useful |
| 🧑‍🏫 Trainer | **10%** | Self-summary & calibration | Specific, honest, and defensible against the score |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 2 is easy to answer shallowly. Protection from liability is the purpose trainees omit, and it is why the record is built the way it is.
- Question 5 is the integration question: the running SOL, the hardening treatment gap, and the claims work that must go on anyway.
- Question 7 is the UPL gate in miniature. A trainee who can't rewrite it compliantly isn't ready for client contact.
- The gap they are watching build here is the same 14 days they will defend in deposition on Day 5.

---

## Module 3 — Property Damage Handling & Onboarding Directions

The client's standing instructions, rental authorization, repair estimates and the total-loss question, and the packet that sets expectations on day one.

**Rhythm:** Lesson ➔ Skill Activity ➔ Lesson ➔ Skill Activity ➔ Knowledge Check

### 1.3.1 Client Do's and Don'ts & Rental Authorization

> **Lesson** · Day 1 — File opening · Module 3: Property Damage Handling & Onboarding Directions  
> **Topic:** Protecting the claim from the client's own good intentions  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#28` Treatment Phase: Essential Client Communication Strategies · `D1#44` Handling Treatment Gaps During the Treatment Phase · LSH Claims Specialist: LOR property damage carve-out, rental coverage hierarchy, documents to support the claim

#### 1 · Visual Layout Description

A balanced two-column DO / DON'T board on the upper two-thirds, green-bordered left and red-bordered right, with matched pairs on the same line so each DON'T sits opposite the DO it replaces. Each row carries a small icon in the gutter. Lower third: a rental authorization flow of four connected chips — WHOSE POLICY IS PRIMARY? → WHO AUTHORIZES? → DAILY RATE CAP → DURATION LIMIT — with an orange tag under the last two: “uncovered days are the client's cost.”

#### 2 · Slide Body — Tell Them

*Why:* Most self-inflicted damage to an injury claim happens in the first two weeks, before the client has been told what not to do. A casual recorded statement, a gap in treatment or a social-media post can cost more than any negotiation will recover.

1. The client gives no recorded statement to the adverse carrier. All adverse contact routes through the firm.
2. The client starts treatment and keeps every appointment. Explain why consistent treatment matters; gaps become causation arguments against them.
3. The client posts nothing about the collision, the injuries or their activities.
4. The client signs no release, authorization or settlement document from any carrier until the firm has reviewed it.
5. The client keeps every receipt and out-of-pocket expense, including mileage to appointments and household help. Only what is documented can be recovered.
6. Property damage is the one carve-out from the no-direct-contact rule. The LOR lets the adverse carrier talk to the client about the property damage claim only.
7. On a rental, the renter's own personal auto policy is usually primary. The rental company is usually self-insured and steps in only after the personal policy denies, in a formal written denial.
8. Confirm rental authorization before the client collects a vehicle: who authorizes it, the daily rate cap and the duration limit. Check for a rental reimbursement endorsement on the policy.
9. The client reports any change of address, phone number or treating provider at once.

> ⚠️ **UPL boundary.** You may deliver the firm's standing instructions and explain the process. You may not tell the client what their conduct will do to the value of the claim; give the instruction and route the question to Atty. Thone.

> ⚠️ **UPL boundary.** The carve-out is narrow. If the adverse carrier uses a property damage call to ask about injuries, treatment or the facts of the loss, the call stops and routes to the firm.

#### 2 · Slide Body — Show Them

*Matched pairs: what to do, and the mistake it prevents*

| ✅ Do | ❌ Don't |
|---|---|
| Route every adverse carrier call to the firm. | Give a recorded statement to the other side. |
| Start treatment promptly and attend every appointment. | Let treatment lapse, or stop because you feel better. |
| Keep receipts for every accident-related cost. | Assume an undocumented expense can be claimed later. |
| Confirm rental authorization, rate cap and duration first. | Collect a rental before coverage is confirmed in writing. |
| Report any change of address, phone or provider at once. | Post about the collision, the injuries or your activities. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Retainer signed | Deliver the standing instructions and log delivery | CMS → Onboarding | Delivery logged with date and method |
| Client asks about a rental | Confirm the primary policy, the authorization, the rate cap and the duration | CMS → Property Damage | All rental parameters recorded before collection |
| Adverse carrier calls the client directly | Instruct the client to route it to the firm; log the contact | CMS → Communications Log | No recorded statement; contact logged |

**Best practices & pitfalls**

- Educate the client on why consistent treatment matters, not just that it does.
- Use active listening; a client who feels heard follows instructions.
- ⚠️ Pitfall: explaining why a recorded statement hurts the claim; that is legal advice. Give the instruction.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.3.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Instruction coverage | All standing instructions present, including the property damage carve-out |
| 🤖 AI | **20%** | Rental hierarchy | Personal policy primary; written denial before rental-company self-insurance |
| 🤖 AI | **15%** | Delivery logged | Date and method of delivery recorded |
| 🧑‍🏫 Trainer | **25%** | Client-facing clarity | Delivered so a stressed client would actually follow them |
| 🧑‍🏫 Trainer | **15%** | UPL boundary | Instruction given without opining on claim value or legal effect |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Run the matched pairs as call-and-response: read a DON'T, have the room give you the DO.
- The treatment instruction matters most on this file. John Doe's gap is already forming; say so.
- Rental is where clients get hurt financially. Uncovered days come out of their pocket, and they will blame the firm if nobody told them the limit.
- Watch for trainees explaining why a recorded statement hurts the claim. That slides into legal advice; the instruction is the deliverable.

---

### 1.3.2 Client Onboarding Direction Packet

> **Skill Activity** · Day 1 — File opening · Module 3: Property Damage Handling & Onboarding Directions  
> **Topic:** Skill Activity 1 — assemble what the client gets on day one  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#28` Treatment Phase: Essential Client Communication Strategies · `D1#44` Handling Treatment Gaps During the Treatment Phase · LSH Claims Specialist: client communication protocol

#### 1 · Visual Layout Description

An exploded packet: a central navy folder with six document cards fanned around it in a semicircle, each numbered with an orange badge — ① Do's and Don'ts ② Treatment directions ③ Property damage and rental ④ Communication protocol ⑤ Document retention ⑥ Firm contacts and escalation path — each showing two or three bullet previews in small type. Beneath the fan, a delivery bar of three chips: PREPARED → DELIVERED → LOGGED, the third noting the required date and method.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe's retainer is signed and the matter is open in the CMS. Nothing has been sent to him yet, and he has already had one call from Robert Smith's carrier.

**Execution prompt.** Assemble John Doe's onboarding direction packet. Build all six sections, populate each with the firm's standing instructions, and make the property damage section specific to this file. Given that the adverse carrier has already called him, state which instruction is now most urgent and how you will confirm he has understood it. Then log delivery.

| | |
|---|---|
| **Tool / interface** | CMS → Onboarding → Direction Packet |
| **Expected output** | A complete, delivered and logged onboarding packet specific to John Doe's file. |

**Verification checkpoints**

- [ ] All six packet sections present and populated
- [ ] The standing instructions all appear in the Do's and Don'ts
- [ ] Treatment direction stated, given that treatment has not begun
- [ ] Property damage section names the rental parameters to confirm
- [ ] Communication protocol routes all adverse carrier contact to the firm
- [ ] Firm contacts list Atty. Elijah Thone as lead counsel
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

Verified in this module's Knowledge Check (block 1.3.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **20%** | Section completeness | All six sections present |
| 🤖 AI | **20%** | Instruction completeness | All standing instructions appear |
| 🤖 AI | **10%** | Counsel named correctly | Atty. Elijah Thone as lead counsel |
| 🤖 AI | **10%** | Delivery logged | Date and method recorded |
| 🧑‍🏫 Trainer | **25%** | Prioritisation | Named the adverse-contact instruction as urgent and built a real confirmation step |
| 🧑‍🏫 Trainer | **15%** | Client usability | Usable by a layperson under stress |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The scenario detail, that the carrier has already called, is the graded judgment. A generic packet misses the point.
- Have them read their treatment direction aloud. If it doesn't create urgency about starting care, it won't prevent the gap.
- Role-play receiving one packet as John Doe: confused, in pain, and already contacted by the other side.

---

### 1.3.3 Repair Estimates, Total Loss & Loss of Use

> **Lesson** · Day 1 — File opening · Module 3: Property Damage Handling & Onboarding Directions  
> **Topic:** Repair, or total? And what the client is owed either way  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#6` Master Audit Checklist: Property Damage (PD) Deep Dive · `D5#34` Property Damage in Litigation: Types of Damages You Can Recover · `D5#35` Property Damage: Calculating the Value of the Claim · LSH Claims Specialist: 5-day inspection window, loss of use, tow and storage

#### 1 · Visual Layout Description

A horizontal threshold gauge dominates: a long bar running from pale on the left to orange and then navy on the right, with a bold vertical THRESHOLD marker about three-quarters along. Left of the marker, REPAIR — carrier pays to fix; right of it, TOTAL LOSS — carrier pays ACV. A repair-estimate chip and an ACV chip sit above the bar to show the comparison. Below, a three-step strip: ① Estimate vs. final bill ② Compare against ACV ③ Confirm the carrier's basis in writing. Bottom-right, a navy card lists what is owed either way: storage, towing, loss of use.

#### 2 · Slide Body — Tell Them

*Why:* Property damage settles long before the injury claim, and it is the client's first test of whether the firm is competent. It is also physical evidence of how hard the impact was, so audit it as carefully as the medicals.

1. Get the written repair estimate before discussing any outcome with the client. No estimate, no position.
2. Give the carrier a defined window to inspect the vehicle (the firm's standard is 5 days from the letter) and record the date it opens.
3. Compare the insurance estimate with the final body shop bill. Supplementals are often the best proof of hidden structural damage.
4. Audit the photos for a clear point of impact, including the undercarriage and frame.
5. A vehicle is a total loss when the cost to repair reaches the carrier's threshold measured against its actual cash value. Confirm the threshold basis the carrier is applying, in writing.
6. Actual cash value is the pre-loss market value: not what is owed on the loan, and not the cost of a new replacement. Verify the valuation report (e.g. CCC One) so the client isn't lowballed.
7. Courts value property damage on the “lesser of” rule: the cost of repair, or the drop in market value from before to after the loss.
8. Storage and towing accrue daily. Settle the disposition quickly or the charges eat the recovery.
9. Loss of use is claimable for each day the client is without a vehicle, measured by a comparable rental, separately from the repair or ACV payment. The authority is state law (for example, Nevada: Dugan v. Gotsopoulos); confirm the governing rule for the file.
10. Document and escalate a disputed valuation; don't argue it ad hoc with the adjuster.

> ⚠️ **UPL boundary.** You may gather estimates, report figures and explain the process. You may not advise the client whether to accept a valuation or tell them what their vehicle is legally worth. Asserting the loss-of-use claim is counsel's position.

#### 2 · Slide Body — Show Them

*Repair or total, and what the client is owed either way*

| Question | What you verify | What it changes |
|---|---|---|
| Is there a written estimate? | The estimate exists and is in the file | Without it, nothing is discussed with the client |
| Estimate vs. final bill | Supplementals on the body shop's final bill | Hidden structural damage; impact severity for the injury claim |
| Repair cost vs. ACV | The repair figure against pre-loss market value | Whether the carrier repairs or declares a total loss |
| What basis is the carrier using? | The threshold and the valuation report, in writing | Which side of the line the vehicle falls on |
| How long in storage? | Daily storage and towing | Delay erodes the recovery |
| Is the client without transport? | The dates without a vehicle | Loss of use, claimed separately |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Repair estimate received | Log it; compare with ACV and, later, the final bill | CMS → Property Damage | Estimate on file; comparison recorded |
| Carrier states a disposition | Confirm the threshold basis and the valuation report in writing | CMS → Property Damage → Correspondence | Basis confirmed, not assumed |
| Client is without a vehicle | Record the dates and open the loss-of-use claim | CMS → Property Damage → Loss of use | Dates recorded; claimed separately |

**Best practices & pitfalls**

- Supplementals are often the best proof of hidden structural damage.
- Verify the valuation report so the client isn't lowballed on the vehicle's value.
- ⚠️ Pitfall: working only from the initial estimate.
- ⚠️ Pitfall: treating property damage as “just the car”; it is evidence for the injury claim.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.3.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Estimate logged | Written estimate recorded before any client discussion; inspection window dated |
| 🤖 AI | **25%** | ACV comparison | Repair figure against pre-loss market value, not the loan balance |
| 🤖 AI | **20%** | Loss of use opened | Dates recorded and claimed separately from the repair or ACV payment |
| 🧑‍🏫 Trainer | **25%** | Threshold reasoning | Knows what ACV is and is not, and confirms the basis rather than assuming it |
| 🧑‍🏫 Trainer | **15%** | Client handling | Explained the process without advising on acceptance or legal value |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- The recurring misconception is that ACV equals the loan balance. Correct it the moment it appears.
- Storage is the silent cost. Ask: “Who is paying for every day this car sits?”
- Loss of use is the most often forgotten item, and on this file it matters: John Doe needs to get to treatment he hasn't started.
- Day 5 reopens this with diminished value and the property damage dispute lab. Today is the threshold; Day 5 is the fight.

---

### 1.3.4 Onboarding Direction Assignment in System

> **Skill Activity** · Day 1 — File opening · Module 3: Property Damage Handling & Onboarding Directions  
> **Topic:** Skill Activity 2 — turn directions into tracked tasks  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

Verified in this module's Knowledge Check (block 1.3.5) and the day's auto-graded questions.

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

### 1.3.5 PD & Onboarding Knowledge Audit

> **Knowledge Check** · Day 1 — File opening · Module 3: Property Damage Handling & Onboarding Directions  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D2#6` Master Audit Checklist: Property Damage (PD) Deep Dive · `D5#35` Property Damage: Calculating the Value of the Claim · `D1#44` Handling Treatment Gaps During the Treatment Phase

#### 1 · Visual Layout Description

The standard knowledge-check split (cream question panel, navy self-summary card, 1–5 ladder, 60/40 strip with the separate red UPL gate). Module-specific addition: a PD AUDIT STRIP between the panels, a five-cell horizontal checklist — Estimate · Final bill · ACV comparison · Storage/towing · Loss of use — that the trainee ticks as a self-audit before answering.

#### 2 · Slide Body — Knowledge verification

1. List the firm's standing instructions for a new personal injury client and, for each, the specific harm it prevents.
2. Before John Doe collects a rental, what must be confirmed, and whose policy is usually primary? What happens to days outside the authorization?
3. Explain what actual cash value means, what it does not mean, and why confusing it with the loan balance misleads the client.
4. Robert Smith's carrier calls John Doe directly and asks for a recorded statement. Set out exactly what you instruct him to do, and what you log.
5. Identify everything John Doe may be owed on the property damage side beyond the repair or ACV payment, and what must be documented for each.
6. A direction was delivered to the client but never assigned as a tracked task. Explain why that is a failure and what it costs on this file.

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
| Comparing a repair estimate and final bill against ACV | ○ | ○ | ○ | ○ | ○ |
| Identifying storage, towing and loss-of-use entitlements | ○ | ○ | ○ | ○ | ○ |
| Turning directions into tracked, verifiable tasks | ○ | ○ | ○ | ○ | ○ |
| Holding the UPL boundary while explaining property damage | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (4 questions):

1. The property damage carve-out in the LOR lets the adverse carrier talk to the client about:  
   Injuries and treatment · **✓ The property damage claim only** · Anything except settlement figures · A recorded statement  
   *Only the resolution of the property damage claim. Anything else routes to the firm.*
2. On a rental vehicle, whose policy is usually primary?  
   The rental company's self-insurance · **✓ The renter's own personal auto policy** · The at-fault driver's BI · The client's health plan  
   *The rental company usually steps in only after the personal policy denies, in writing.*
3. Actual cash value (ACV) is:  
   What is still owed on the loan · **✓ The vehicle's pre-loss market value** · The cost of a new replacement · The repair estimate plus storage  
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
| 🤖 AI | **10%** | Entitlement completeness | Storage, towing and loss of use all identified |
| 🧑‍🏫 Trainer | **15%** | Scenario handling | Routes the contact correctly and logs it, without legal explanation to the client |
| 🧑‍🏫 Trainer | **15%** | Strategic articulation | Prioritises treatment, given the forming gap |
| 🧑‍🏫 Trainer | **5%** | Self-summary quality | Specific and honest |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Defensible against the score |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 3 separates trainees who memorised the term from those who understand it. Expect the loan-balance error.
- Question 6 should surface the treatment direction: an untracked treatment instruction is exactly how a 14-day gap happens.
- The strategy prompt has one right priority, treatment. Anyone who leads with the rental has mis-ranked the risks.

---

## Module 4 — Intake Operations & Action Plan Editor

The acceptance decision and the Three-Pillar Case Plan: structuring it, flagging the 14-Day Gap, and routing it for attorney review.

**Rhythm:** Lesson ➔ Skill Activity ➔ Lesson ➔ Skill Activity ➔ Knowledge Check

### 1.4.1 The Acceptance Decision & the Three-Pillar Case Plan

> **Lesson** · Day 1 — File opening · Module 4: Intake Operations & Action Plan Editor  
> **Topic:** The document that makes the file move  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#8` Case Acceptance Determination · `D1#14` Bottleneck: Case Eligibility Uncertainty · `D1#17` Skill Building: Intake Decision Challenge & Applied Case Manager Actions · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#21` Case Study: John Doe v. Apex — Liability Determination · `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#23` Case Planning Framework: The Three-Pillar Case Plan

#### 1 · Visual Layout Description

A five-band vertical architecture, each band a full-width navy or navy-soft bar with an orange index number at its left edge: ① CASE SNAPSHOT & ACCEPTANCE ② COVERAGE · LIABILITY · PROJECTION ③ REGULATORY TRIPLE-CHECK ④ THREE-PILLAR PLAN — the band split into three equal columns, CLINICAL · FUNCTIONAL · FINANCIAL ⑤ RISKS & FLAGS. Band ⑤ is in danger red rather than navy and visibly taller, holding one highlighted chip, 14-DAY TREATMENT GAP; that asymmetry must survive any redesign. To the right, a thin vertical routing rail with an arrow ending in a card: ATTY. ELIJAH THONE · REVIEW, and under it a calendar chip, FILE WITHIN 30–60 DAYS.

#### 2 · Slide Body — Tell Them

*Why:* The case plan is the file's operating instruction. It is what Atty. Thone reads to set strategy and what every later day executes against. A plan that hides a risk produces a strategy built on a false picture.

1. Acceptance comes first. After the verification call confirms the facts of loss, decide: Accepted, Escalated for attorney/senior review, or Declined, and record the reason so someone else can follow it.
2. At acceptance you stop gathering information and make the determination.
3. If eligibility is uncertain (ambiguous facts of loss or liability, or no clear legal assessment), clarify the facts with the client, then escalate to the attorney with a short summary of exactly what is ambiguous. Don't let the file sit in limbo.
4. State coverage, liability and projection together. You can't project a case until coverage and liability are understood, and the projection is preliminary until coverage is confirmed.
5. Liability is not final until it is confirmed by the police report, the driver statements and any dashcam or other evidence. Never tell the client liability is a sure thing.
6. Clear the Regulatory Triple-Check before the clinical plan: HIPAA, Medicare/Medicaid reporting, payer order.
7. File the Three-Pillar Case Plan within the state's window, often 30 to 60 days, and docket the date.
8. Clinical: the acute interventions that stabilise the client (PT, specialty consults). Functional: activities of daily living and return-to-work status. Financial: the payer order, subrogation management and MMSEA compliance.
9. Give every pillar measurable goals, and every action item an owner and a date.
10. Flag adverse facts prominently. A risk buried in prose has not been disclosed to counsel.
11. The plan proposes operational steps. It does not set legal strategy; route it to Atty. Thone before acting on anything that commits the firm's position.

> ⚠️ **UPL boundary.** The plan may state facts, flag risks and propose operational steps. It may not state legal conclusions, case value or settlement posture. Those are Atty. Thone's to set, which is why the plan is routed to him.

#### 2 · Slide Body — Show Them

*The five bands, and what belongs in each*

1. **Snapshot & acceptance** — Parties, DOL, SOL, client position, phase; Accepted / Escalated / Declined with the reason.
2. **Coverage · Liability · Projection** — The three-layer stack and its order; who is responsible; a preliminary projection.
3. **Regulatory Triple-Check** — HIPAA authorization, BCRC answer, payer order.
4. **Three-Pillar Plan** — Clinical, Functional, Financial goals, each with an owner and a date.
5. **Risks & flags** — Adverse facts stated plainly: here, the 14-Day Treatment Gap. Routed to Atty. Thone.

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Verification call complete | Record the acceptance decision with its reason | CMS → Case Notes | Accepted / Escalated / Declined, with a reason a colleague can follow |
| Coverage verified and triple-check cleared | Draft the plan across all five bands | Action Plan Editor | All five bands present; risks band populated |
| Plan drafted | Docket the filing window and route to Atty. Thone | Action Plan Editor → Route for review · CMS → Calendar | Routed before any position-committing action; due date on the calendar |

**Best practices & pitfalls**

- Each pillar should have measurable goals.
- Every decision needs a documented reason someone else can follow.
- When intake stalls: name where it slowed, find the root cause, act to move the file, then fix what let it happen.
- ⚠️ Pitfall: a plan that only covers clinical care.
- ⚠️ Pitfall: gathering more information at the acceptance stage instead of making the determination.
- ⚠️ Pitfall: letting an uncertain file sit in limbo instead of escalating.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.4.5) and the day's auto-graded questions.

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
- Ask: “What happens if Atty. Thone builds a demand strategy without knowing about the gap?” The answer is the whole module.
- Draw the line between operational and legal: “Request the MRI” is operational. “This case is worth policy limits” is not the CM's to write.
- Trainees under-flag because flagging feels like admitting a weak case. Reframe: flagging early is what makes the case defensible later.

---

### 1.4.2 Identifying & Flagging the 14-Day Gap

> **Skill Activity** · Day 1 — File opening · Module 4: Intake Operations & Action Plan Editor  
> **Topic:** Skill Activity 1 — find the fact that will decide this case  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#16` Tools for Case Planning & the PI Case Lifecycle Strategy · `D1#44` Handling Treatment Gaps During the Treatment Phase · `D2#13` Treatment Gaps in the Demand Phase

#### 1 · Visual Layout Description

A horizontal treatment timeline is the whole slide. Far left, a navy node: DOL · 02/06/2026. From it runs a conspicuous empty span, a hatched hollow orange band with no event markers, fourteen day-ticks wide, labelled NO TREATMENT · 14 DAYS. At its right end a node, FIRST TREATMENT · 02/20/2026, after which markers resume and then thin out again at a second, smaller hollow span labelled DISRUPTED CARE. Beneath, three consequence cards fan out from the hollow band on orange leader lines: CAUSATION CHALLENGE · VALUATION PRESSURE · CREDIBILITY ATTACK. The emptiness of the band is the message; never fill it with decoration.

#### 2 · Slide Body — Let Them

**Scenario.** John Doe's treatment records have arrived. The date of loss is 02/06/2026. The first treatment record is dated 02/20/2026. Treatment thins out again partway through the course of care.

**Execution prompt.** Identify and flag the treatment gap in John Doe's file. Compute it exactly, record both the initial gap and the later disruption, and state in the risks band what each will be used for against the claim. List the likely causes you will investigate, and the steps needed before the gap can be explained. Then route the flag to Atty. Thone.

| | |
|---|---|
| **Tool / interface** | CMS → Case File → Risk Flags · Action Plan Editor → Risks |
| **Expected output** | A precisely computed, prominently flagged and routed treatment-gap record. |

**Verification checkpoints**

- [ ] Gap computed as 14 days, 02/06/2026 to 02/20/2026
- [ ] Both the initial gap and the later disrupted care recorded
- [ ] Defense uses stated: injuries not serious; recovered earlier than claimed; treatment unnecessary; other causes
- [ ] Likely causes listed to investigate: missed appointments, transportation, cost or co-pays, work schedule, stopping after temporary relief, delayed referrals, imaging or authorizations
- [ ] Investigation steps recorded: the client's own explanation, supporting documents, provider confirmation
- [ ] Flag placed prominently in the case plan's risks band
- [ ] Flag routed to Atty. Thone

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Treatment records received | Compute the gap from DOL to first treatment | CMS → Case File → Treatment timeline | 14 days, both dates recorded |
| Gap confirmed | Flag it with its defense uses and likely causes | Action Plan Editor → Risks | Prominent flag with consequences |
| Flag recorded | Route to Atty. Thone; schedule the Day 2 investigation | CMS → Tasks | Routed and scheduled |

**Best practices & pitfalls**

- Identify gaps early during record review, and document the reason for every interruption.
- A well-explained gap is less damaging than an unexplained one.
- ⚠️ Pitfall: “about two weeks” instead of the exact dates.
- ⚠️ Pitfall: recording the first gap but not the later disruption.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.4.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **25%** | Gap computation | Exactly 14 days, dates correct |
| 🤖 AI | **15%** | Both events recorded | Initial gap and later disruption both captured |
| 🤖 AI | **10%** | Defense uses and causes | The adjuster's arguments and the likely causes both named |
| 🤖 AI | **10%** | Routed | Flag routed to Atty. Thone |
| 🧑‍🏫 Trainer | **25%** | Flag prominence | A reviewer sees it within seconds of opening the plan |
| 🧑‍🏫 Trainer | **15%** | Investigative thinking | The steps would actually produce a defensible explanation |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- This is Day 1's most consequential activity. Everything on Days 2 to 5 turns on this flag existing and being accurate.
- Insist on the exact count. “About two weeks” is not a flag; 02/06 to 02/20 is.
- Ask the room what the adjuster will say when they see this. Their answers become the Day 3 negotiation.
- Trainees often record the gap but not the later disruption. Both matter; the second undercuts the “he got better” explanation for the first.

---

### 1.4.3 The Action Plan Editor & Attorney Review Routing

> **Lesson** · Day 1 — File opening · Module 4: Intake Operations & Action Plan Editor  
> **Topic:** Drafting, routing, and the review loop  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
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

> ⚠️ **UPL boundary.** Routing exists because legal strategy is counsel's. Where a review comment asks for a legal judgment, the answer comes from Atty. Thone, not from the case manager drafting the plan.

#### 2 · Slide Body — Show Them

*The review loop, and what each state allows*

| State | What it means | What you may do |
|---|---|---|
| Draft | Being written; not yet seen by counsel | Edit freely. Execute nothing that commits the firm externally. |
| Routed | Sent to Atty. Thone, awaiting review | Continue internal preparation. Do not act on the plan's positions. |
| Returned with comment | Counsel wants changes | Address every comment, then re-route. Do not part-execute. |
| Approved | Counsel has authorized the plan | Execute against this version and record it as the operative plan. |
| Superseded | A material fact changed after approval | Re-route. The earlier approval no longer covers the new picture. |

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Plan drafted across all five bands | Route to Atty. Thone | Action Plan Editor → Route for review | Routing recorded with timestamp |
| Plan returned with comments | Address every comment and re-route | Action Plan Editor → Revisions | No comment left unaddressed |
| Material fact changes after approval | Mark the plan superseded and re-route | Action Plan Editor → Version | Approved version kept; new version routed |

**Best practices & pitfalls**

- Assume every note will be read by defense counsel.
- Keep medical notes factual and clinical.
- ⚠️ Pitfall: editing records in a way that breaks the audit trail.
- ⚠️ Pitfall: writing “this will help the case” in a treatment note.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.4.5) and the day's auto-graded questions.

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
- Read the Golden Rule pitfall aloud. Defense counsel uses opinions in medical notes to impeach the case manager's neutrality.

---

### 1.4.4 Live Case Plan Draft — John Doe v. Robert Smith

> **Skill Activity** · Day 1 — File opening · Module 4: Intake Operations & Action Plan Editor  
> **Topic:** Skill Activity 2 — the full plan, routed for review  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#8` Case Acceptance Determination · `D1#18` Claim Set-Up: Coverage Determination & Liability Assessment · `D1#19` Claim Set-Up: Case Projection — Why the Three Work Together · `D1#22` Case Planning Framework: Regulatory Intake & Verification · `D1#23` Case Planning Framework: The Three-Pillar Case Plan · `D1#44` Handling Treatment Gaps During the Treatment Phase

#### 1 · Visual Layout Description

A full-slide editor canvas showing the live plan with all five bands stubbed and their required fields outlined in orange. A completion meter runs across the top in five segments that fill as each band is completed. The risks band carries a red required marker so it can't be skipped silently. Bottom-right, the ROUTE FOR REVIEW control is greyed out and locked until all five segments are filled, with a label: “all five bands required.” The lock is the argument: the tool won't let an incomplete plan reach counsel.

#### 2 · Slide Body — Let Them

**Scenario.** Everything from Day 1 is in the file: parties mapped, the $40,000 stack verified, the Regulatory Triple-Check cleared with the health plan's reimbursement right flagged, the onboarding packet delivered and tracked, and the 14-Day Treatment Gap identified. Atty. Thone is waiting on the case plan.

**Execution prompt.** Draft the complete case plan for John Doe v. Robert Smith. Fill all five bands from today's work: the acceptance decision with its reason; coverage as a stack with its order of operations, liability, and a preliminary projection; the triple-check results; Clinical, Functional and Financial pillars with measurable goals, each action item with an owner and a date; and the risks band with the 14-Day Gap and the later disruption, prominently, with their consequences. Docket the filing window, then route the plan to Atty. Thone.

| | |
|---|---|
| **Tool / interface** | Action Plan Editor |
| **Expected output** | A complete, routed case plan that counsel could set strategy from without asking a follow-up question. |

**Verification checkpoints**

- [ ] Snapshot: parties, DOL 02/06/2026, SOL 02/06/2028, client recorded as a passenger
- [ ] Acceptance decision recorded with its reason
- [ ] Coverage: $10,000 BI / $20,000 Host UM / $10,000 Relative UM, total $40,000
- [ ] Order of operations: BI → Host UM → Relative UM; projection marked preliminary
- [ ] Liability recorded as preliminary until confirmed by the police report and driver statements
- [ ] Triple-check: HIPAA authorization, BCRC answer, payer order
- [ ] Clinical, Functional and Financial pillars each with a measurable goal
- [ ] Every action item has an owner and a date
- [ ] Risks band: 14-Day Gap and later disrupted care, prominent, with consequences
- [ ] Filing window docketed
- [ ] Plan routed to Atty. Elijah Thone with a timestamp

**Operational mapping**

| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |
|---|---|---|---|
| Day 1 work complete | Draft all five bands | Action Plan Editor | Meter at five of five |
| Plan complete | Docket the filing window | CMS → Calendar | Due date on the calendar |
| Plan docketed | Route to Atty. Thone | Action Plan Editor → Route for review | Routed with timestamp |

**Best practices & pitfalls**

- Grade your own plan as Atty. Thone will read it: if you need to ask a question to set strategy, it isn't finished.
- ⚠️ Pitfall: a projection stated as a number before coverage is confirmed.

#### 3 · Knowledge Check & CM Summary

Verified in this module's Knowledge Check (block 1.4.5) and the day's auto-graded questions.

#### 4 · Assessment Criteria (AI + Trainer Rubric)

| Channel | Weight | Dimension | What is graded |
|---|---|---|---|
| 🤖 AI | **15%** | Snapshot accuracy | Parties, DOL, SOL and client position all correct |
| 🤖 AI | **15%** | Coverage accuracy | Correct limits, total and order of operations |
| 🤖 AI | **15%** | Risk flagging | The 14-day gap and the disruption both recorded with consequences |
| 🤖 AI | **10%** | Item discipline | No action item without an owner and a date |
| 🤖 AI | **5%** | Routing | Routed to Atty. Thone with timestamp |
| 🧑‍🏫 Trainer | **25%** | Reviewer readiness | Counsel could set strategy from it without a follow-up question |
| 🧑‍🏫 Trainer | **15%** | Boundary discipline | No legal conclusion or case valuation written into the plan |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- This is Day 1's capstone. Give it real time; it is the gate, not a wrap-up.
- The locked route control is deliberate. If a trainee can't route, ask which band is incomplete.
- Grade it as Atty. Thone would read it. If you need to ask a question to set strategy, the plan isn't finished.
- Close Day 1 by stating the gate: CMS initialized, stack verified at $40,000, triple-check cleared, plan routed. Day 2 doesn't begin until all four are true.

---

### 1.4.5 Case Plan Audit & Day 1 Gate

> **Knowledge Check** · Day 1 — File opening · Module 4: Intake Operations & Action Plan Editor  
> **Topic:** Knowledge Check + Case Manager Self-Summary & Skill Scale  
> **Continuity:** John Doe v. Robert Smith · Atty. Elijah Thone · $10,000 BI / $20,000 HOST UM / $10,000 REL UM · 14-Day Gap  
> **Theory extracted from:** `D1#8` Case Acceptance Determination · `D1#23` Case Planning Framework: The Three-Pillar Case Plan · `D1#24` Case Planning Framework: Mandatory Disclosure & Compliance Tracking · `D1#25` The “Golden Rule” of US Claim Set-Up · `D1#44` Handling Treatment Gaps During the Treatment Phase · `D2#13` Treatment Gaps in the Demand Phase

#### 1 · Visual Layout Description

The standard knowledge-check split, with one Day-1-specific addition above the question panel: a full-width DAY 1 GATE bar of four connected checkpoint chips — CMS INITIALIZED · STACK VERIFIED $40,000 · TRIPLE-CHECK CLEARED · PLAN ROUTED — each with a tick state, and a closed navy barrier at the right end labelled DAY 2 with a small note: “opens when all four are green.” The barrier makes the sequential-integrity rule visible rather than merely stated.

#### 2 · Slide Body — Knowledge verification

1. Set out the five bands of the case plan and what belongs in each, including the three pillars.
2. Explain why an adverse fact buried in the body of a plan has not, in any meaningful sense, been disclosed to counsel.
3. State John Doe's coverage position exactly as it should appear in the plan: layers, limits, total, order of operations, and the status of the projection.
4. Compute John Doe's treatment gap from the record dates and explain how an adjuster will use it against the claim.
5. A plan was approved last week. Today the gap investigation produces a medical explanation that changes the picture. What is the status of that approval, and what do you do?
6. Draw the line: give one thing the plan may properly state, and one that must come from Atty. Thone instead.
7. All four Day 1 gate conditions must be met before Day 2 begins. List them, and explain what breaks if treatment work starts with the stack unverified.

**Best practices & pitfalls**

- Check all four gate conditions before you move to Day 2.
- ⚠️ Pitfall: quietly editing an approved plan instead of re-routing it.

#### 3 · Knowledge Check & CM Summary

**Case Manager Self-Summary**

- Summarize what you learned about turning a raw intake into a file an attorney can set strategy from.
- Articulate your strategy: the plan is with Atty. Thone. What is your next action, and what are you waiting on before the one after that?
- Identify the one thing across all of Day 1 you are least confident about, and what you would need in order to be confident.

**Skill Scale — self-rate 1–5**

| Competency | 1 | 2 | 3 | 4 | 5 |
|---|---|---|---|---|---|
| Recording an acceptance decision with its reason | ○ | ○ | ○ | ○ | ○ |
| Structuring a complete five-band, three-pillar case plan | ○ | ○ | ○ | ○ | ○ |
| Stating a coverage position as an ordered stack | ○ | ○ | ○ | ○ | ○ |
| Computing and documenting a treatment gap precisely | ○ | ○ | ○ | ○ | ○ |
| Routing for attorney review and keeping version discipline | ○ | ○ | ○ | ○ | ○ |
| Keeping operational proposals apart from legal strategy | ○ | ○ | ○ | ○ | ○ |

**1** Not yet — I need this re-taught · **2** I can follow it with step-by-step help · **3** I can do it with a checklist · **4** I can do it unaided · **5** I can do it unaided and explain it to a peer

**Auto-graded share of the day's Knowledge Check** (4 questions):

1. The three pillars of the case plan are:  
   Coverage, Liability, Projection · **✓ Clinical, Functional, Financial** · Intake, Treatment, Demand · HIPAA, BCRC, Payer order  
   *Clinical (acute interventions), Functional (ADLs and return to work), Financial (payer order, subrogation, MMSEA).*
2. Once the claim is set up, the case plan is typically filed within:  
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
| 🧑‍🏫 Trainer | **10%** | Self-summary quality | Specific and honest across the whole day |
| 🧑‍🏫 Trainer | **5%** | Self-rating calibration | Defensible against the score |

**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite.

#### 5 · Speaker Notes

- Question 5 tests version discipline and is the most often failed: the approval is superseded, and the plan must be re-routed, not quietly edited.
- Question 7 enforces sequential integrity: with an unverified stack, Day 2's letters of representation go to the wrong carriers in the wrong order.
- This check closes Day 1. Confirm the gate aloud with the room before releasing anyone to Day 2.
- Compare scores with self-ratings across all four modules, not just this one.

---
