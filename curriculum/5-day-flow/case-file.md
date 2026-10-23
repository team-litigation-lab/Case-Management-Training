# John Doe v. Robert Smith — the Case File

The canonical facts every Case Flow day is written against: parties, coverage, the collision, treatment and
bills, the gap and the disruption, Property Damage, the retainer, the settlement (Track A) and the suit
(Track B). Every number, date and name on a Case Flow slide comes from here; a change to a fact starts here
and is carried into `js/cm-case-flow-data.js`.

Dates are MM/DD/YYYY. Weekdays given are computed. Deadlines are configured for this training file; the
governing court rules and statutes must always be confirmed.

## 1. The file at intake (Day 1)

| | |
|---|---|
| Case | *John Doe v. Robert Smith* · LSH-2026-MVA-770412 · MVA, passenger injury |
| Lead Counsel | Atty. Elijah Thorne — approves all strategy, demands, filings, lien compromises, settlement authority |
| Case Manager | the trainee |
| Client | John Doe, DOB 08/14/1991 (age 34), 2214 Maple Hollow Rd, Riverton · (555) 010-2288 · john.doe@example.com |
| Position | Front-seat passenger in the host vehicle |
| DOL / SOL | 02/06/2026 (Fri) · SOL docketed 02/06/2028 (a Sunday; two-year limitation assumed for training; confirm the governing statute) |
| Source of the file | "On the Records" |
| Critical fact | Initial 14-Day Treatment Gap (DOL 02/06/2026 → first treatment 02/20/2026), then disrupted care mid-treatment |
| Health Plan | Peach State Health Plan · member PSH-55017742 · group GRP-41208 · reimbursement right asserted on first notice |

### The Recovery Stack — $40,000 (order of operations: BI → Host UM → Relative UM)

| # | Layer | Carrier | Claim | Adjuster | Limit |
|---|---|---|---|---|---|
| 1 | BI — Robert Smith's liability (third-party) | Keystone Mutual Insurance | KM-26-440871 | Dana Whitfield | $10,000 |
| 2 | Host UM — the host vehicle's policy (first-party) | Harbor Point Insurance | HP-26-7741 | Marcus Bell | $20,000 |
| 3 | Relative UM — the resident relative's policy (first-party) | Cardinal State Mutual | CS-26-20355 | Teresa Okafor (assigned 03/03/2026; "not yet assigned" on Day 1) | $10,000 |

BI must be exhausted (paid or tendered at limits) before Host UM opens; Relative UM stacks behind Host UM.
A UM demand before the BI tender is premature; settling or releasing BI without the UM carriers' written consent can forfeit the stack. **Payer Order** (who pays the Medical Bills
while the claim is open) is a different question: PIP/MedPay → private health insurance → LOP/provider liens.

**PIP (Riverton's rule).** Riverton is an **add-on PIP state**: every auto policy carries $5,000 of Personal Injury Protection unless the named insured rejects it in writing. PIP pays **100% of reasonable accident medical expenses and 80% of lost income**, regardless of fault, with no deductible. It is add-on, not no-fault: it does not reduce BI or UM, and Riverton bars a PIP carrier from recovering what it paid out of its insured's settlement. **Whose PIP:** John owns no car, so he claims PIP as a passenger on the vehicle he rode in: **Harbor Point's PIP on Kevin Alvarez's Escape, $5,000** (claim HP-26-7741). PIP application signed 02/17/2026 and sent with the Harbor Point LOR; Harbor Point acknowledged it and opened PIP on 02/24/2026 (RS65).
**Riverton has no Emergency Medical Condition (EMC) rule**: no treat-within-14-days condition and no EMC
determination caps John's PIP. EMC is a Florida PIP rule (Fla. Stat. § 627.736(1)(a)); the course teaches it as
the contrast a Case Manager on a Florida file must work to.

### No contact, then back in touch (Day 1 Module 2 — the No Contact Protocol, 02/10–02/23/2026)

Last logged contact with John Doe: **02/10/2026**. The Communications Log the protocol leaves behind (three phone
attempts on three different days, then the written warnings, then the emergency contact):

| Date | Time | Channel | Outcome |
|---|---|---|---|
| 02/11/2026 (Wed) | 3:40 p.m. | Phone, mobile (555) 010-2288 | Attempt 1: no answer; voicemail left |
| 02/13/2026 (Fri) | 10:00 a.m. | Phone, mobile (the scheduled check-in) | Attempt 2: no answer; voicemail left |
| 02/16/2026 (Mon) | 9:10 a.m. | Phone, mobile (after the Step 1 review) | Attempt 3: no answer; voicemail left |
| 02/16/2026 (Mon) | 9:30 a.m. | Email, john.doe@example.com | Warning 1: please call the firm by 02/18/2026; no reply |
| 02/16/2026 (Mon) | 9:35 a.m. | Text, (555) 010-2288 | Delivered; no reply |
| 02/16/2026 (Mon) | 11:05 a.m. | Phone, Margaret Doe (emergency contact) | Reached; message passed; no case details shared |
| 02/18/2026 (Wed) | 9:00 a.m. | Email, john.doe@example.com | Warning 2: please call the firm by 02/20/2026; no reply |
| 02/20/2026 (Fri) | 4:30 p.m. | Internal note to Atty. Thorne | Step 3 team notification |

The two early voicemails (02/11, 02/13) were left but never logged; the CMS flags it on 02/16 (Day 1 Module 2,
Skill Activity 1). On **02/21/2026** Atty. Thorne asks for the Final Warning Letter for his review on Monday.
**02/23/2026 (Mon)**: he approves it and it goes out at 8:10 a.m. by email and certified mail, response date
**03/05/2026**. **John Doe calls back at 8:31 a.m.**: he read the email; he went to Riverton Urgent Care on
02/20/2026 and is booked at Riverton Spine & Rehab for 02/24/2026. The No Contact Protocol closes; treatment
continues. (Why he waited is asked on the recorded call of 03/04/2026, not on this one.)

## 2. The file from Day 2 on

### People and vehicles

| | |
|---|---|
| Host driver | **Kevin Alvarez**, John's coworker (separate household). They carpool to work on alternate weeks; 02/06/2026 was Kevin's week. Owns the host vehicle, a **2020 Ford Escape**, insured by Harbor Point (Host UM $20,000; **PIP $5,000**). |
| Resident relative | **Margaret Doe**, John's mother. John lives with her at 2214 Maple Hollow Rd. Her own car is insured by Cardinal State Mutual (UM $10,000). Emergency contact on the file. |
| The parked car | **Margaret Doe's 2019 Honda Civic LX**, 52,300 miles, owned outright, insured on her policy by **Bluewater Auto Insurance** (liability + collision, $500 deductible). **UM/UIM rejected in writing by Margaret** (signed rejection form, 03/14/2024). **John owns no car and has no auto policy.** |
| Why passenger status matters | As a passenger in a car he does not own, John reaches Host UM (occupant of the host vehicle) and Relative UM (resident relative in a non-owned vehicle). He owns no car, so no policy of his own applies; Margaret's Bluewater policy on the Civic has no UM, so it adds no layer. The Civic, its PD claim and its rental are Margaret's, never John's: the firm handles her PD under a separate PD-only engagement. |
| Defendant | **Robert Smith**, driving a 2017 Chevrolet Silverado; Keystone Mutual BI $10,000 per person; Keystone **PD liability $25,000** (separate from BI and **outside** the $40,000 stack). Address on the Police Report: 118 Larkspur Ln, Riverton. |
| Employer | **Northgate Distribution** — John is a warehouse shift lead, started 01/12/2026, $22.00/hour, 8-hour shifts. Peach State coverage through Northgate, effective 02/01/2026. |

### The collision (02/06/2026, about 7:10 a.m.)

All-way stop at **Maple Hollow Rd & Birch Ave** (John's house is the corner lot). Kevin stopped eastbound on
Maple Hollow and proceeded. Robert Smith, northbound on Birch Ave, did not stop, and struck the Escape's front
passenger door at about 28 mph; the Escape was pushed into Margaret's Civic, parked at the curb on Birch Ave.
- Riverton PD report **RPD-26-018842**: Smith cited for failure to stop at a stop sign.
- Independent witness: **Ruth Calloway**, 2209 Maple Hollow Rd.
- **Doorbell-camera video** from 2214 Maple Hollow Rd (Margaret's camera) shows the Escape stopped and Smith
  rolling through; John was told to preserve it on 02/17/2026 (copy secured 02/19/2026).
- Riverton Fire **EMS Run Report**: "restrained front-seat passenger, complains of neck stiffness, declined transport."
- The Escape's **event data recorder** (downloaded 10/2026 in litigation): front-passenger belt *buckled*; Escape at 11 mph at impact.

### Injury and treatment

- Injury: cervical strain; **C5-C6 right paracentral disc herniation** with mild right foraminal narrowing.
- Prior: three chiropractic visits in 2021 for **low-back** stiffness, resolved. No prior neck complaints.

| Date | Provider | Event | Billed | Paid by |
|---|---|---|---|---|
| 02/20/2026 | Riverton Urgent Care | First treatment. Note: "onset at MVA 02/06/2026, progressively worsening; numbness to right hand since 02/18." | $685.00 | Harbor Point PIP |
| 02/24–04/02/2026 | **Riverton Spine & Rehab** (chiropractic + PT; out of network for Peach State) | 16 visits under an **LOP signed 02/23/2026** | — | LOP |
| 03/05/2026 | **Lakeside Orthopedics, Dr. Alana Reyes** | Initial consult; orders MRI | $640.00 | PIP |
| 03/13/2026 | **Summit Imaging Center** | Cervical MRI (read by Dr. Helen Park): C5-C6 herniation; "no significant degenerative change at the adjacent levels" | $2,395.00 | PIP (Summit asked for an LOP on 03/11; declined because PIP applies first) |
| 03/27/2026 | Lakeside Orthopedics | Follow-up; refers to pain management | $640.00 | PIP |
| 04/02 → 04/21/2026 | — | **Disrupted care: 19 days with no visits** (missed 04/03, 04/07, 04/09, 04/14) | — | — |
| 04/21–06/05/2026 | Riverton Spine & Rehab | 17 visits; care resumed | — | LOP |
| 05/15/2026 | **Crescent Pain & Spine, Dr. Omar Haddad** | Cervical epidural steroid injection | $3,400.00 | **Peach State paid $1,860.00** (contract rate; provider wrote off the rest and cannot balance-bill) |
| 06/12/2026 | Lakeside Orthopedics | **MMI** declared; residual intermittent right-arm paresthesia; future care: possibly 1–2 repeat ESIs within 24 months at $3,400 each (future medical $3,400–$6,800; narrative, not Specials) | $640.00 | PIP (PIP exhausted at $5,000.00) |
| 02/07–06/2026 | Riverton Drug | Prescriptions and OTC (receipt 02/07/2026 for ibuprofen and lidocaine patches) | $312.40 | John, out of pocket |

- Riverton Spine & Rehab bills **34 lines × $185.00 = $6,290.00**, but one is a **duplicate (05/04/2026)**:
  33 real visits = **$6,105.00** after audit.
- PIP paid in date order: $685.00 + $640.00 + $2,395.00 + $640.00 + $640.00 = **$5,000.00** (exhausted 06/2026).
  Crescent Pain & Spine is in network with Peach State and billed the plan directly at its contract rate; PIP pays
  the bills submitted to it, and its last $640.00 paid Lakeside's 06/12/2026 visit. The Payer Order is the default;
  providers bill whom they bill, and the CM tracks both ledgers rather than re-routing a paid claim.
  Harbor Point confirmed in writing (03/02/2026): **no reimbursement right** on PIP against John's recovery;
  its UM is **add-on (excess)** — not reduced by the BI payment — and has **no PIP non-duplication reduction**.
- PIP's 80% wage benefit (9 shifts, $1,584.00 × 80% = $1,267.20) was never paid: the Medical Bills used the $5,000 limit by 06/26/2026, and Northgate's wage-and-attendance letter came 06/30/2026. The full $1,584.00 stays in the Specials.
- Cardinal State confirmed in writing (03/09/2026) that John is covered as a resident relative occupying a non-owned vehicle.
- Keystone gave its $10,000 BI limit verbally on the set-up call but would not confirm it in writing (no Declaration Page) before a written request with signed authorizations; BI limit $10,000 confirmed in writing by Keystone's Declaration Page on 03/20/2026.

**Medical Specials** billed: $15,002.40 before audit → **$14,817.40** after removing the duplicate.
**Lost wages**: 9 missed shifts (02/09–02/13, 03/05, 03/13, 05/15, 05/18) × 8 h × $22.00 = **$1,584.00**,
verified by Northgate HR wage-and-attendance letter. **Total specials: $16,401.40.**

### Why the 14-day gap happened (surfaces only when probed properly — Day 2 Module 3)

1. **No transportation.** Margaret's Civic was towed from the scene, Kevin's Escape was in the shop, and no rental
   was authorized until 02/18/2026.
2. He thought it was soreness that would pass; took OTC ibuprofen and lidocaine patches (receipt 02/07/2026).
3. Cost worry: he wasn't sure his new Peach State coverage (effective 02/01/2026) was active, and didn't know PIP existed.
4. Symptoms escalated: numbness into his right hand from 02/18/2026. He worked 02/18–02/19 and went to urgent care on his first day off, 02/20/2026.

Corroboration: EMS report (neck complaint on the DOL), Northgate Attendance Record (called out 02/09–02/13
citing neck pain), texts to his mother 02/07–02/15 about neck pain, the pharmacy receipt, the urgent-care
history, and Dr. Reyes's **Causation Letter (06/19/2026)**: delayed presentation is clinically consistent with
a disc injury whose radicular symptoms evolve over days to weeks; injury more likely than not caused by the collision.

### Why the disruption happened (Day 2 Module 2 — the A-C-T protocol)

Keystone ended the rental on 03/19/2026 (30-day cap) while the Civic sat waiting for parts; Kevin's shift
changed on 04/01/2026, ending the carpool. John missed four PT visits. The CM learned of it on **04/08/2026**
from the provider's missed-visit alert. **A-C-T:** *Assess* — called John 04/08; *Coordinate* — asked Keystone
PD to extend the rental (refused 04/10), then moved John to evening slots so Margaret could drive him after
her shift (first open evening slot 04/21); *Track* — confirmed attendance 04/21 and 04/23. The Civic came back 04/24.

### Property Damage (Margaret's Civic — a separate claim with Keystone PD, adjuster **Leah Moran**; outside the $40,000 stack)

- Towed 02/06; storage 6 days at $45.00 + tow $185.00 = **$455.00** (paid by Keystone).
- Initial estimate (Riverton Collision Center, 02/16/2026) **$6,940.00**; teardown supplement (03/02/2026)
  **$2,315.00** (A-pillar, structural) → final repair **$9,255.00**; paid by Keystone to the shop 04/24/2026.
- **ACV $17,600.00** (Keystone's Valuation Report). Total-loss threshold used: 75% of ACV = $13,200.00.
  Repair = 52.6% of ACV → **repairable, not a Total Loss.**
- Keystone accepted PD liability 02/17/2026; **rental** authorized 02/18/2026 at $42.00/day, capped at 30 days
  (02/18–03/19/2026) = **$1,260.00** paid. Extension refused ("shop delay").
- Repair complete **04/24/2026** (parts backorder).
- **Disputed:** Loss of Use for days without a vehicle and without a paid rental — 02/06–02/17 (12 days) and
  03/20–04/24 (36 days) = 48 days × $42.00 = **$2,016.00**; Keystone offers $0.
- **Disputed:** Diminished Value — independent appraisal (Riverton Auto Appraisal, 05/06/2026) **$3,600.00**;
  Keystone's "17c" formula offer **$792.00** (10% of $17,600.00 = $1,760.00 × damage multiplier 0.75 × mileage multiplier 0.60).
- Track A (Day 3) does not resolve the PD dispute (it runs on its own claim). Track B (Days 4–5) does not plead
  them in John Doe's suit (he owns no vehicle; the Civic is Margaret's): the dispute stays on her own Keystone PD claim, and Day 5 Module 2 works it. **The outcome is left
  open** (whatever a trainee proposes needs Atty. Thorne's authority).

### Retainer and costs

- Contingency fee: **33⅓% pre-suit; 40% once suit is filed** (per the retainer).
- Case costs through settlement: **$486.75** (Police Report $25.00; Medical Records and billing $214.75;
  certified mail $72.00; MRI images on disc $25.00; postage and copies $150.00).

## 3. Day 3 — the demands, and Track A: the file settles

- **07/20/2026 (Mon)** BI **Time-Limited Demand** to Keystone (Dana Whitfield) for the $10,000 limits,
  emailed to Dana Whitfield from the Email Workspace with the 81-page Demand Package (Exhibits A–J) attached,
  and logged. Dana Whitfield confirms receipt in writing by reply email on 07/22/2026 (9:06 a.m.); the letter
  states the 30 days run from her written acknowledgement of receipt, so the **acceptance window runs to
  08/21/2026 (Fri)**. Proof of delivery is the sent email plus her written acknowledgement; no
  certified mail. A state's statute can require a specific delivery method for a Time-Limited Demand;
  Atty. Thorne confirms whether one governs. With no written acknowledgement, the CM follows up with the
  adjuster the same day and escalates to Atty. Thorne; the deadline is never docketed from the send date.
  Conditions: payment of limits, a **Limited Release** of Robert Smith and Keystone only, and Robert Smith's
  **affidavit of no other insurance**. Atty. Thorne settles the terms; the CM builds and
  serves the package and proves delivery. The package addresses the gap up front (EMS report, Causation Letter).
- **08/05/2026** Keystone offers **$3,500**, citing the 14-day gap and calling the MRI findings degenerative.
- **08/06/2026** CM sends the rebuttal Atty. Thorne approved: the radiologist's "no degenerative change at the
  adjacent levels", Dr. Reyes's Causation Letter, the EMS report and the Gap Justification Record.
- ↳ **This is the fork.** Day 3 follows Track A. Day 4 returns to this moment and follows Track B.
- **Track A** — 08/10 Smith's affidavit of no other insurance; **08/12/2026 Keystone tenders $10,000**.
  08/13 consent-to-settle requests to Harbor Point and Cardinal State (each may substitute its own check to
  preserve subrogation; 30-day windows); consents 08/24 (Harbor Point) and 08/26 (Cardinal State).
  Keystone's draft release (08/14) released "all other persons, firms, corporations and insurers" — which
  would have released the UM claims — and was revised to a Limited Release, **signed 08/28/2026**.
  Keystone's check received **09/04/2026** into the IOLTA trust account.
- **08/31/2026** Host UM demand to Harbor Point ($20,000) and Relative UM demand to Cardinal State ($10,000, as
  excess over Host UM), each emailed to its adjuster (Marcus Bell; Teresa Okafor), logged, with written
  acknowledgement of receipt requested.
- Harbor Point offers $8,000 (09/14; cites the gap and "BI already compensated him"); the CM's counter-package
  goes 09/16; **Harbor Point pays $20,000 limits 09/29/2026** (check received 10/05).
- Cardinal State offers $6,000 (10/01); **tenders $10,000 limits 10/06/2026** (check received 10/13).
- **Gross recovery $40,000.00.**
- **Liens:** Peach State (a **fully insured** group plan, so state law governs reduction, not ERISA preemption —
  Atty. Thorne's call) asserts **$1,860.00** → accepts **$1,240.00** (a one-third procurement-cost reduction) on 10/09/2026.
  Riverton Spine & Rehab: billed $6,290.00 → audited **$6,105.00** (duplicate removed) → accepts **$4,580.00** on 10/12/2026.
- Funds cleared 10/20; John signs the Settlement Statement 10/21; **disbursement 10/22/2026**; Trust Ledger to
  $0.00; **closing memo 10/30/2026**; closed-file retention per the firm's schedule (training file: 7 years from closing).

**Net Sheet (Track A)**

| Line | Total | Stream 1 — BI | Stream 2 — UM (Host + Relative) |
|---|---|---|---|
| Gross | $40,000.00 | $10,000.00 | $30,000.00 |
| Fee 33⅓% | $13,333.33 | $3,333.33 | $10,000.00 |
| Case costs | $486.75 | $121.69 (25%) | $365.06 (75%) |
| Peach State (reduced) | $1,240.00 | $310.00 | $930.00 |
| Riverton Spine & Rehab (reduced) | $4,580.00 | $1,145.00 | $3,435.00 |
| **Net to John Doe** | **$20,359.92** | **$5,089.98** | **$15,269.94** |

(Costs and liens are allocated to the streams pro rata to gross, 25% / 75%.)

**Pro-rata illustration** (for the lien lesson): had only the $10,000 BI been recovered, $10,000.00 − $3,333.33 fee
− $486.75 costs = **$6,179.92** would be left against $7,965.00 of unreduced liens ($1,860.00 + $6,105.00). Shared
pro rata: Peach State 23.35% → **$1,443.15**; Riverton Spine & Rehab 76.65% → **$4,736.77** (total $6,179.92),
before any negotiated reduction, leaving John Doe nothing — which is why the lien lesson matters.

## 4. Days 4–5 — Track B: the litigation fork (same file, back at 08/05/2026)

- 08/06 rebuttal sent; Keystone holds at $3,500 ("final", 08/12). The Time-Limited Demand **lapses 08/21/2026**
  unaccepted (Atty. Thorne notes Robert Smith's possible exposure above his limits — counsel's analysis, never the CM's).
- Follow-ups 08/24 and 08/31 go unanswered; **48-Hour Mandate** escalation to Keystone's claims supervisor
  09/02; still no response 09/04. Because BI is not exhausted, **Host UM and Relative UM cannot open: the whole
  $40,000 stack is frozen behind a $10,000 carrier.**
- **09/08/2026** impasse memo to Atty. Thorne; 09/09 he authorizes suit and discusses the fee tier (40% on filing) with John.
- **09/10/2026** CMS status → Litigation. Harbor Point and Cardinal State notified of the impasse and the intended suit
  (the notice their policies require — Atty. Thorne confirms what is required).
- **09/22/2026 (Tue)** The CM tags the Litigation Desk paralegal, **Nadia Brooks**, in the CMS to prepare the
  filing set around the complaint Atty. Thorne has drafted and approved: the civil cover sheet and the summons.
  Atty. Thorne reviews and signs the set on 09/23.
- **09/24/2026** complaint e-filed through the Riverton County e-filing portal (envelope accepted the same day;
  filing fee and summons $218.00); the clerk issues the summons and a **Notice of Case Management Conference:
  12/10/2026 (Thu), 9:00 a.m., by videoconference**. Service deadline under the rule set configured for this
  training file: 120 days from filing → **01/22/2027 (Fri)**. Complaint filed: *John Doe v. Robert Smith*, **State Court of Riverton County, Civil Action No. 26-CV-04417**.
  Damages pleaded: medical Specials, lost wages, future medical, pain and suffering. No Property Damage is pleaded: John owns no vehicle.
- **Service:** attempts at 118 Larkspur Ln on 10/01, 10/05, 10/08 fail (a neighbor says Smith moved in August).
  Skip-Trace 10/09 → **4410 Quarry Ridge Ct, Millbrook**. Personal service **10/14/2026** by **Allied Process
  Services**; affidavit of service filed 10/16. Answer due **11/13/2026**.
- **11/12/2026** Answer by **Atty. Grant Mercer, Mercer & Hale LLP** (retained by Keystone): denies; pleads
  comparative negligence (the Escape entered the all-way stop out of turn; John was unbelted), causation (the
  gap; "degenerative" MRI) and failure to mitigate (the disrupted care).
- **12/01/2026** Defendant's First Interrogatories (25), Requests for Production (30) and Requests for Admission
  (15) served on John **by U.S. mail** → 30 days + 3 for mail = 01/03/2027, a Sunday → **due 01/04/2027 (Mon)**.
  Unanswered Requests for Admission may be deemed admitted. (Rule set configured for this training file;
  confirm the court's rules.)
- **12/10/2026** Case Management Conference held (Atty. Thorne attends); Scheduling Order entered: plaintiff's expert disclosure 03/15/2027; defense expert disclosure 04/15/2027;
  mediation completed by 03/31/2027; discovery closes 05/28/2027; pretrial conference 08/12/2027; trial calendar 09/13/2027.
- **12/14/2026** Plaintiff's discovery served on Smith by email (e-service by consent) → his responses due **01/13/2027**.
- **12/17/2026** Four mediation windows collected from Atty. Thorne, John Doe and defense counsel; Atty. Thorne
  selects **Hon. Carla Benton (Ret.)**. **01/08/2027 (Fri)** Notice of Mediation: **03/18/2027 (Thu), 9:30 a.m.**,
  at Hon. Carla Benton's office; statement and binder due 7 days before → **03/11/2027 (Thu)**; client attendance required.
- **01/20/2027** Notice of John's deposition: **02/18/2027, 10:00 a.m., by videoconference**, Riverton Court Reporting.
- **01/22–02/03/2027** John goes unreachable (lost his phone, new number). The No Contact Protocol runs; he is
  reached through Margaret (emergency contact) on **02/03/2027**.
- **02/04 and 02/16/2027** deposition preparation sessions (Atty. Thorne leads; the CM runs logistics, the
  technology check and the document set, and never coaches testimony).
- **02/18/2027** John deposed. Defense counsel works the gap, the disruption, the 2021 low-back visits and the seatbelt.
- **03/11/2027** Confidential Mediation Statement and binder due to the mediator (7 days before).
- **03/18/2027** court-ordered mediation, **Hon. Carla Benton (Ret.)**. Keystone tenders the **$10,000 BI limits**
  at mediation. BI is exhausted; UM consents obtained; Limited Release; Robert Smith dismissed.
- **03/22/2027 (Mon)** UM demands to Harbor Point (Host UM $20,000) and Cardinal State (Relative UM $10,000), with the proof of
  exhaustion. Harbor Point offers **$8,000** (03/31/2027); Cardinal State **$6,000** (04/02/2027).
- **04/05/2027** Harbor Point and Cardinal State hold, disputing damages (the gap). Harbor Point's UM arbitration clause
  is invoked; Cardinal State joins one consolidated **binding arbitration**, arbitrator **Laura Whitcomb, Esq.**
  **04/26/2027 (Mon)** Laura Whitcomb's Notice of Hearing (after the 04/23 scheduling call) sets the hearing: **06/22/2027 (Tue), 9:00 a.m.**; exhibit exchange 20 days before → **06/02/2027**; arbitration brief 10 days
  before → 06/12/2027 is a Saturday → **docket 06/11/2027 (Fri)** (counting backward, move to the earlier business day).
- **07/06/2027 (Tue) award (case won):** Laura Whitcomb finds John Doe's damages exceed the UM limits and awards
  **Harbor Point $20,000** (host UM) and **Cardinal State $10,000** (relative UM, excess). Keystone's $10,000 BI
  (tendered 03/18/2027) has been in trust since **03/29/2027 (Mon)**, held until the liens resolve. Gross **$40,000.00**.
- **Fee:** suit was filed, so the retainer's **40% tier** applies: **$16,000.00** (Atty. Thorne confirms from the retainer).
- **Costs (receipted) $3,895.25:** pre-suit $486.75 + filing fee & summons $218.00 (09/24/2026) + Allied Process
  Services $285.00 (three attempts, skip-trace, personal service) + mediation, plaintiff's half of Hon. Carla Benton's
  fee $1,200.00 + arbitration, plaintiff's share of Laura Whitcomb's fee $900.00 + Riverton Court Reporting
  (John's deposition, videoconference) $645.50 + certified records for the arbitration binder $160.00.
- **Liens:** Peach State $1,860.00 reduced at the fee actually charged (40% = $744.00) → **$1,116.00**, accepted in
  writing **07/14/2027 (Wed)**; Riverton Spine & Rehab audited $6,105.00 → **$4,275.00**, signed Payoff Letter
  **07/16/2027 (Fri)**; total **$5,391.00**. PIP, Crescent's write-off and the PIP-paid providers stay at $0.00.
- Harbor Point's check **07/20/2027 (Tue)**, Cardinal State's **07/22/2027 (Thu)**; John signs the Settlement
  Statement **07/29/2027 (Thu)**; **disbursement 07/30/2027 (Fri)**.
- **Net to John Doe: $40,000.00 – $16,000.00 – $3,895.25 – $5,391.00 = $14,713.75** (Track A: $20,359.92; the
  difference, $5,646.17, is what the stonewall cost him in fee tier, litigation costs and lien math).
- **SOL calendar:** 02/06/2028 is a Sunday. Firm rule: never rely on a weekend roll-forward — the internal hard
  date is **02/04/2028 (Fri)**, with an internal filing cutoff 90 days before → 11/06/2027 is a Saturday → **11/05/2027 (Fri)**.

## 5. How each day uses the gap

| Day | How the gap appears |
|---|---|
| 1 | Flagged during intake and in the Case Plan's risks band |
| 2 | Probed with the client on a recorded call and justified with medical documentation |
| 3 | Used by the adjuster as a causation defense; countered with the MRI |
| 4 | The adjuster's stonewall on it triggers the litigation fork |
| 5 | Defended in deposition prep against opposing counsel's causation trap |

## 6. Document details (the case documents)

The details the case documents (`documents/case-flow/`, spec in `build/case-flow/documents/SPEC.md`) need beyond
the facts above. Fictional throughout; no real carrier, provider or firm.

| | |
|---|---|
| Firm | **LSH Law Group**, 500 Commerce St, Suite 1200, Riverton · (555) 010-4000 · Case Manager line ext. 214 · file LSH-2026-MVA-770412 |
| Intake | Intake call **02/09/2026 (Mon)**; retainer and HIPAA authorization signed in the office the same day |
| Keystone Mutual Insurance | Claims, P.O. Box 4100, Riverton · Robert Smith's policy **KMI-PA-7731045** · BI claim KM-26-440871 (Dana Whitfield, BI adjuster; **Greg Holloway**, claims supervisor) · PD claim KM-26-440871-PD (Leah Moran) |
| Harbor Point Insurance | 77 Harbor Point Blvd, Riverton · Kevin Alvarez's policy **HPA-4402917** (2020 Ford Escape) · claim HP-26-7741 (Marcus Bell) · UM $20,000 / $40,000; PIP $5,000 |
| Cardinal State Mutual | 1200 Cardinal Way, Millbrook · Margaret Doe's policy **CSM-AU-5580213** (2018 Toyota Camry) · claim CS-26-20355 (Teresa Okafor) · UM $10,000 / $20,000 |
| Bluewater Auto Insurance | Margaret Doe's policy **BWA-209-66184** (2019 Honda Civic LX) · liability 25/50/25 + collision ($500 deductible) · UM/UIM rejected in writing by Margaret 03/14/2024 |
| Peach State Health Plan | Subrogation & Recovery Unit, P.O. Box 2210, Riverton · member PSH-55017742 · group GRP-41208 (Northgate Distribution; **fully insured** group plan) · recovery analyst **Dion Carver** · first notice of reimbursement rights **02/27/2026** |
| Riverton PD | Officer **Thomas Garner #2217** · report RPD-26-018842 |
| Riverton Fire EMS | Medic 7 · run RF-26-0206-114 · paramedic **J. Ortiz** · on scene 07:18 |
| Riverton Urgent Care | 1450 Birch Ave · **Nina Patel, PA-C** |
| Riverton Spine & Rehab | 300 Mill St · **Dr. Mark Ellison, DC** (chiropractic) · **Sara Lin, DPT** (PT) · billing and LOP: **Tammy Greer**, office manager · $185.00 per visit (chiro + PT, one line per visit date) |
| Lakeside Orthopedics | 2 Lakeside Dr · **Dr. Alana Reyes, MD** · $640.00 per visit (03/05, 03/27, 06/12/2026) |
| Summit Imaging Center | 88 Summit Pkwy · radiologist **Dr. Helen Park, MD** · $2,395.00 cervical MRI without contrast |
| Crescent Pain & Spine | 41 Crescent Ct · **Dr. Omar Haddad, MD** · in network with Peach State |
| Prior care (2021) | **Birch Avenue Chiropractic**, Dr. Lena Ford, DC · three visits 05/04, 05/11, 05/18/2021 · low-back stiffness, resolved, released to full activity |
| Riverton Drug | 1500 Birch Ave · total $312.40 (OTC receipt 02/07/2026 $38.60; prescriptions and OTC through 06/2026) |
| Northgate Distribution | 900 Industrial Pkwy, Riverton · HR: **Angela Ruiz**, HR manager · wage-and-attendance letter 06/30/2026 |
| Witness | **Ruth Calloway**, 2209 Maple Hollow Rd · signed statement to Officer Garner on scene |
| Doorbell video | Margaret Doe's camera at 2214 Maple Hollow Rd · clip 07:09:41–07:10:26 · copy secured 02/19/2026 (USB, SHA-256 logged) |
| Property Damage | **Riverton Collision Center** (estimator Paul Diaz) · tow and storage **Riverton Towing** · rental **Rivergate Rentals** · DV appraisal **Riverton Auto Appraisal** (Carl Benning) |
| Litigation | Process server **Allied Process Services** (Miguel Santos) · Skip-Trace **TraceLine Investigations** · defense **Atty. Grant Mercer, Mercer & Hale LLP**, 10 Court Sq, Riverton · court reporter **Riverton Court Reporting** |
