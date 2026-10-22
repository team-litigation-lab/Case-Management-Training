/* ============================================================
   5-DAY LEGAL CASE MANAGEMENT FLOW — curriculum data
   Focus case: John Doe v. Robert Smith · Lead Counsel: Atty. Elijah Thorne

   The SINGLE SOURCE OF TRUTH for the Case Flow track. Generated from it,
   never written separately:
     • the slides, in this course's own lesson format    js/cm-case-flow.js
     • the per-block curriculum spec and the theory map  curriculum/5-day-flow/
                                                           (build/case-flow/curriculum.cjs)
   Spec: curriculum/5-day-flow/00-architecture.md

   The whole course. Its theory was extracted from the earlier course's lessons (John Doe
   v. Apex, now removed; its text is kept only as build/day1.js–day5.js, never served) and
   re-aligned onto this case; `sources` on every block names where each one came from
   ("D1#18" = Day 1, topic 18).

   Text is plain: the course's renderers escape what they draw.

   ── BLOCK SCHEMA ───────────────────────────────────────────
   Every module is five blocks: lesson → activity → lesson → activity → check.
   { kind, id, title, topic,
     visual:   Visual Layout Description (curriculum spec; for whoever designs the slide)
     tell:     {why, rules[], upl[]}                         lesson
     act:      {scenario, prompt, tool, output, checkpoints[]} activity
     check:    {questions[], summary[], scale[]}             check
     show:     the visual model — see SHOW TYPES
     ops:      [[trigger, task, tool, checkpoint]]
     best:     practices, and pitfalls written "Pitfall: …"
     sources:  where the theory came from
     rubric:   {ai:[[dimension, pts, criteria]], trainer:[…]}  60 / 40
     notes:    speaker notes (Presenter view) }
   Each module also carries `quiz` — its auto-graded share of the day's
   Knowledge Check ({q, opts, a, r}, the course's own quiz shape).
   `profile` is the Case File page's case profile, each section opening with its
   Case Flow day.
   Each day carries `fileState` — where the file stands as the day opens (the AI
   reviewer reads it, and the curriculum spec prints it). Day 4 settles Track A and runs
   its ADR; Day 5 is Track B's litigation (the same file from 08/05/2026, where the BI
   carrier stonewalls and the case goes to suit). Those days carry `track`, which
   each block's header line shows.

   SHOW TYPES: process {steps:[[label, desc]]} · table {head, rows} ·
   threebox {items:[[label, desc]]} · compare {boxes:[{head, items}]} ·
   split {do, dont} · stack {} (the policy-stack ladder, from `case.stack`)
   ============================================================ */

window.CM_CASE_FLOW = {

  /* ---------- the persistent Case File ---------- */
  case: {
    style: "John Doe v. Robert Smith",
    no: "LSH-2026-MVA-770412",
    type: "MVA — passenger injury",
    dol: "02/06/2026",
    sol: "02/06/2028",
    solNote: "Docketed on a two-year limitation for this training file. Confirm the governing state's statute before relying on it.",
    counsel: "Atty. Elijah Thorne",
    source: "On the Records",
    gapDays: 14,
    treatmentStart: "02/20/2026",
    client: {
      name: "John Doe", role: "Client / Plaintiff",
      dob: "08/14/1991", phone: "(555) 010-2288",
      email: "john.doe@example.com",
      address: "2214 Maple Hollow Rd, Riverton",
      position: "Front-seat passenger in the host vehicle"
    },
    parties: [
      ["Client / Plaintiff", "John Doe", "Front-seat passenger, not a driver. This is what opens two UM layers."],
      ["Defendant / Tortfeasor", "Robert Smith", "At-fault driver. His liability carrier pays first."],
      ["Lead Counsel", "Atty. Elijah Thorne", "Approves all strategy, demands and filings."],
      ["Case Manager", "the trainee", "Owns the file's day-to-day movement."],
      ["Host driver", "operator of the vehicle John Doe occupied", "Source of the $20,000 Host UM layer."],
      ["Resident relative", "John Doe's household relative", "Source of the $10,000 Relative UM layer."]
    ],
    stack: [
      {tag: "BI", name: "Bodily Injury — Robert Smith's liability", limit: 10000,
       carrier: "Keystone Mutual Insurance", claim: "KM-26-440871", adjuster: "Dana Whitfield",
       order: 1, party: "third-party", note: "Primary. Pays first. Tendered against liability."},
      {tag: "HOST UM", name: "Underinsured Motorist — host vehicle policy", limit: 20000,
       carrier: "Harbor Point Insurance", claim: "HP-26-7741", adjuster: "Marcus Bell",
       order: 2, party: "first-party", note: "Secondary. Opens once BI is exhausted or tendered."},
      {tag: "REL UM", name: "Underinsured Motorist — resident relative policy", limit: 10000,
       carrier: "Cardinal State Mutual", claim: "CS-26-20355", adjuster: "Not yet assigned",
       order: 3, party: "first-party", note: "Tertiary. Stacks behind Host UM."}
    ],
    total: 40000,
    health: {carrier: "Peach State Health Plan", memberId: "PSH-55017742", group: "GRP-41208",
             subro: "Reimbursement right asserted on first notice"},
    critical: "Initial 14-Day Treatment Gap, then disrupted care mid-treatment."
  },

  /* ---------- the case profile (the Case File page) ----------
     What the Case Manager knows about the file, section by section. It grows with the
     file and never gives away a day's answers: `opens: N` shows a section once Case
     Flow Day N is open (the facts the day starts from); `passed: N` once Day N's
     Knowledge Check is passed (what that day's work produced: the audited Specials,
     the reasons for the gap, the Net Sheet, the calendar). Trainers see all of it.
     Every fact comes from curriculum/5-day-flow/case-file.md. */
  /* The Case File's sections. Each opens once the trainee has done the Skill Activity that establishes it (`after`):
     the file fills in as they work it, so they work each fact out from the documents first. Trainers see them all. */
  /* The case file as the trainer knows it: every fact of John Doe v. Robert Smith, including the outcomes
     (the audited specials, the fork, Track A's Net Sheet, how the suit ends). It is the answer key, so the
     course shows it to trainers only — a trainee builds the file from the documents and their own work.
     `group` is the tab it sits under on the Case File page (js/cm-case-flow.js CF_FILE_TABS), so the page
     fits one screen: "file" the file itself, "care" treatment and coverage, "money" demand, settlement and
     Property Damage, "suit" Track B. `after` is the block it belongs to, kept for the trainer's reading
     order and for anything that wants to know where a fact is established. */
  profile: [
    {after: "d1m1-open", title: "Case Snapshot", group: "file", items: [
      "Case: John Doe v. Robert Smith · LSH-2026-MVA-770412 · motor vehicle collision, passenger injury",
      "Lead Counsel: Atty. Elijah Thorne, who approves all strategy, demands, filings, lien compromises and settlement authority · Case Manager: you",
      "Client: John Doe · DOB 08/14/1991 · 2214 Maple Hollow Rd, Riverton · (555) 010-2288 · john.doe@example.com",
      "Position: front-seat passenger in the host vehicle, not a driver",
      "Date of loss: Friday, 02/06/2026 · SOL docketed 02/06/2028 (two-year limitation assumed for this training file; confirm the governing statute)",
      "Source of the file: \"On the Records\""
    ]},
    {after: "d1m1-a1", title: "The Recovery Stack: $40,000", group: "cover", items: [
      "1 · BI, Robert Smith's liability: Keystone Mutual Insurance · claim KM-26-440871 · adjuster Dana Whitfield · $10,000",
      "2 · Host UM, the host vehicle's policy: Harbor Point Insurance · claim HP-26-7741 · adjuster Marcus Bell · $20,000",
      "3 · Relative UM, the resident relative's policy: Cardinal State Mutual · claim CS-26-20355 · adjuster not yet assigned at set-up · $10,000",
      "Order of operations: BI → Host UM → Relative UM. Host UM opens only once BI is exhausted (paid or tendered at limits); Relative UM stacks behind Host UM.",
      "A UM demand before the BI tender is premature. Settling or releasing BI without the UM carriers' written consent can forfeit the stack."
    ]},
    {after: "d1m1-a2", title: "Health Plan and Payer Order", group: "cover", items: [
      "Peach State Health Plan · member PSH-55017742 · group GRP-41208 · reimbursement right asserted on first notice",
      "Payer Order (who pays the Medical Bills while the claim is open) is a different question from the stack: PIP/MedPay → private health insurance → LOP/provider liens"
    ]},
    {after: "d1m1-open", title: "People and Vehicles", group: "file", items: [
      "Host driver: Kevin Alvarez, John's coworker (separate household); they carpool on alternate weeks and 02/06/2026 was Kevin's week. He owns the host vehicle, a 2020 Ford Escape, insured by Harbor Point (Host UM $20,000; MedPay $5,000).",
      "Resident relative: Margaret Doe, John's mother; John lives with her at 2214 Maple Hollow Rd. Her car is insured by Cardinal State Mutual (UM $10,000). Emergency contact on the file."
    ]},
    {after: 'd1m1-open', title: 'The Vehicles and Who Insures Them', group: 'file', items: [
      "John's own car: 2019 Honda Civic LX, 52,300 miles, owned outright, insured by Bluewater Auto Insurance (liability + collision, $500 deductible). UM/UIM rejected in writing (03/14/2024).",
      "Why passenger status matters: as a passenger in a car he doesn't own, John reaches Host UM and Relative UM. Driving his own Civic, he would reach $10,000: he rejected UM on his own policy, and Cardinal State excludes a resident relative in a vehicle he owns that it doesn't insure.",
      "Defendant: Robert Smith, driving a 2017 Chevrolet Silverado · Keystone Mutual BI $10,000 per person; PD liability $25,000 (separate, outside the $40,000 stack) · address on the Police Report: 118 Larkspur Ln, Riverton",
      "Employer: Northgate Distribution · warehouse shift lead since 01/12/2026 · $22.00/hour, 8-hour shifts · Peach State coverage through Northgate, effective 02/01/2026"]},
    {after: "d1m1-open", title: "The Collision: 02/06/2026, about 7:10 a.m.", group: "file", items: [
      "All-way stop at Maple Hollow Rd & Birch Ave. Kevin stopped eastbound and proceeded; Robert Smith, northbound on Birch Ave, didn't stop and struck the Escape's front passenger door at about 28 mph, pushing it into John's parked Civic.",
      "Riverton PD report RPD-26-018842: Smith cited for failure to stop at a stop sign",
      "Independent witness: Ruth Calloway, 2209 Maple Hollow Rd",
      "Doorbell-camera video (Margaret's camera at 2214 Maple Hollow Rd) shows the Escape stopped and Smith rolling through · preservation told to John 02/17, copy secured 02/19/2026",
      "Riverton Fire EMS Run Report: \"restrained front-seat passenger, complains of neck stiffness, declined transport\""
    ]},
    {after: "d2m4-a1", title: "Injury and Treatment", group: "care", items: [
      "Injury: cervical strain; C5-C6 right paracentral disc herniation with mild right foraminal narrowing · prior: three chiropractic visits in 2021 for low-back stiffness, resolved; no prior neck complaints",
      "02/20/2026 Riverton Urgent Care: first treatment, \"onset at MVA 02/06/2026, progressively worsening; numbness to right hand since 02/18\" · $685.00 (MedPay)"
    ]},
    {after: 'd2m4-a1', title: 'The Treatment Record', group: 'care', items: [
      "02/24–04/02/2026 Riverton Spine & Rehab (chiro + PT, out of network for Peach State): 16 visits under an LOP signed 02/23/2026",
      "03/05/2026 Lakeside Orthopedics, Dr. Alana Reyes: initial consult, orders MRI · $640.00 (MedPay)",
      "03/13/2026 Summit Imaging Center, cervical MRI (Dr. Helen Park): C5-C6 herniation, \"no significant degenerative change at the adjacent levels\" · $2,395.00 (MedPay)",
      "03/27/2026 Lakeside Orthopedics follow-up, referral to pain management · $640.00 (MedPay)",
      "04/02 → 04/21/2026: disrupted care, 19 days with no visits (missed 04/03, 04/07, 04/09, 04/14)",
      "04/21–06/05/2026 Riverton Spine & Rehab: 17 visits, care resumed (LOP)",
      "05/15/2026 Crescent Pain & Spine, Dr. Omar Haddad: cervical epidural steroid injection · billed $3,400.00, Peach State paid $1,860.00 at contract rate (no balance billing)",
      "06/12/2026 Lakeside Orthopedics: MMI · residual intermittent right-arm paresthesia · possible 1–2 repeat ESIs within 24 months ($3,400–$6,800 future medical) · $640.00 (MedPay, now exhausted)",
      "02/07–06/2026 Riverton Drug: prescriptions and OTC · $312.40, John out of pocket"]},
    {after: "d2m1-a2", title: "Coverage Confirmations", group: "cover", items: [
      "Harbor Point (03/02/2026, in writing): no reimbursement right on MedPay; its UM is add-on (excess), not reduced by the BI payment, with no MedPay non-duplication reduction",
      "Cardinal State: Teresa Okafor assigned as adjuster 03/03/2026; John confirmed in writing (03/09/2026) as a resident relative occupying a non-owned vehicle",
      "Keystone disclosed nothing before a written request with authorizations; BI $10,000 confirmed by its Declaration Page 03/20/2026"
    ]},
    {after: "d2m2-a2", title: "The Disruption", group: "care", items: [
      "Keystone ended John's rental 03/19/2026 (30-day cap) while the Civic waited for parts; Kevin's shift changed 04/01/2026, ending the carpool.",
      "John missed PT visits from 04/03; the CM learned of it 04/08/2026 from Riverton Spine & Rehab's missed-visit alert."
    ]},
    {after: "d5m2-a2", title: "Property Damage: John's Civic", group: "cover", items: [
      "A separate claim with Keystone PD (adjuster Leah Moran), outside the $40,000 stack · PD liability accepted 02/17/2026",
      "Tow $185.00 + 6 days' storage at $45.00 = $455.00 (Keystone paid)",
      "Estimate $6,940.00 (Riverton Collision Center, 02/16) + teardown supplement $2,315.00 (03/02) = $9,255.00 repair, paid to the shop 04/24/2026 · ACV $17,600.00, so repair is 52.6% of ACV: repairable, not a Total Loss",
      "Rental 02/18–03/19/2026 at $42.00/day, 30-day cap = $1,260.00 paid; extension refused (\"shop delay\")",
      "Disputed: Loss of Use for 48 days without a car or a paid rental (02/06–02/17 and 03/20–04/24) × $42.00 = $2,016.00; Keystone offers $0",
      "Disputed: Diminished Value · independent appraisal $3,600.00 (05/06/2026) vs Keystone's \"17c\" offer $792.00"
    ]},
    {after: "d1m1-open", title: "Retainer and Costs", group: "cover", items: [
      "Contingency fee: 33⅓% pre-suit; 40% once suit is filed"
    ]},
    {after: "d2m4-a1", title: "Treatment & Pre-Demand: Specials and the A-C-T Response", group: "money", items: [
      "Riverton Spine & Rehab billed 34 lines × $185.00 = $6,290.00, but 05/04/2026 is a duplicate: 33 visits = $6,105.00 after audit",
      "MedPay paid in date order $685.00 + $640.00 + $2,395.00 + $640.00 + $640.00 = $5,000.00 (exhausted 06/2026)",
      "Medical specials: $15,002.40 billed → $14,817.40 after the audit · lost wages: 9 shifts × 8 h × $22.00 = $1,584.00 (Northgate HR letter) · total Specials $16,401.40",
      "A-C-T: Assess, called John 04/08 · Coordinate, asked Keystone PD to extend the rental (refused 04/10), then moved John to evening slots so Margaret could drive him (first open slot 04/21) · Track, attendance confirmed 04/21 and 04/23 · the Civic came back 04/24"
    ]},
    {after: "d2m3-a2", title: "Why the 14-Day Gap Happened", group: "care", items: [
      "No transportation: the Civic was towed from the scene, Kevin's Escape was in the shop, and no rental was authorized until 02/18/2026",
      "He thought it was soreness that would pass; took OTC ibuprofen and lidocaine patches (receipt 02/07/2026)",
      "Cost worry: unsure his new Peach State coverage (effective 02/01/2026) was active; didn't know MedPay existed",
      "Symptoms escalated: numbness into his right hand from 02/18; he worked 02/18–02/19 and went to urgent care on his first day off, 02/20/2026",
      "Corroboration: EMS report (neck complaint on the DOL) · Northgate attendance (called out 02/09–02/13 citing neck pain) · texts to his mother 02/07–02/15 · the pharmacy receipt · the urgent-care history · Dr. Reyes's Causation Letter (06/19/2026)"
    ]},
    {after: "d3m2-a1", title: "The BI Demand and the Fork", group: "money", items: [
      "07/20/2026 time-limited BI demand to Keystone for the $10,000 limits, by certified mail and email · received 07/22 · 30-day window → 08/21/2026",
      "Conditions: payment of limits, a Limited Release of Robert Smith and Keystone only, and Smith's affidavit of no other insurance",
      "08/05/2026 Keystone offers $3,500, citing the gap and calling the MRI degenerative · 08/06 rebuttal (Atty. Thorne approved): the radiologist's finding, the Causation Letter, the EMS report, the Gap Explanation Record",
      "This is the fork. Track A (Case Flow Day 4): the file settles. Track B (Day 4's ADR, then Day 5's litigation): Keystone stonewalls and the case goes to suit."
    ]},
    {after: "d3m4-a2", title: "Track A: The File Settles", group: "money", items: [
      "08/12/2026 Keystone tenders $10,000 · UM consents 08/24 (Harbor Point) and 08/26 (Cardinal State) · Keystone's General Release (08/14) revised to a Limited Release, signed 08/28 · check into IOLTA 09/04",
      "08/31 Host UM and Relative UM demands · Harbor Point offers $8,000 (09/14), pays $20,000 limits 09/29 · Cardinal State offers $6,000 (10/01), tenders $10,000 limits 10/06",
      "Gross recovery $40,000.00",
      "Liens: Peach State (fully insured plan) $1,860.00 → $1,240.00 (10/09) · Riverton Spine & Rehab $6,290.00 billed → $6,105.00 audited → $4,580.00 (10/12)",
      "Net Sheet: fee $13,333.33 · costs $486.75 · liens $5,820.00 · net to John Doe $20,359.92 (BI stream $5,089.98, UM stream $15,269.94)",
      "John signs the Settlement Statement 10/21 · disbursement 10/22/2026 · Trust Ledger to $0.00 · closing memo 10/30/2026"
    ]},
    {after: "d4m1-a1", title: "Track B: The Stonewall", group: "suit", items: [
      "Back at 08/05/2026: Keystone holds at $3,500 (\"final\", 08/12); the Time-Limited Demand lapses unaccepted 08/21/2026",
      "Follow-ups 08/24 and 08/31 unanswered · 48-Hour Mandate escalation to Keystone's claims supervisor 09/02 · nothing by 09/04",
      "BI isn't exhausted, so Host UM and Relative UM can't open: the whole $40,000 stack is frozen behind a $10,000 carrier"
    ]},
    {after: "d4m2-a1", title: "Track B: From Impasse to Suit", group: "suit", items: [
      "09/08 impasse memo to Atty. Thorne · 09/09 suit authorized, 40% fee tier discussed with John · 09/10 CMS status → Litigation; Harbor Point and Cardinal State notified",
      "09/24/2026 complaint filed: John Doe v. Robert Smith, State Court of Riverton County, Civil Action No. 26-CV-04417 (medical Specials, wages, future medical, pain and suffering, the Civic's Loss of Use and Diminished Value)",
      "Mediation 03/18/2027, Hon. Carla Benton (Ret.) · statement and binder due 03/11 · consolidated binding UM arbitration 06/22/2027, Laura Whitcomb, Esq. (exhibits 06/02, brief docketed 06/11)",
      "SOL: 02/06/2028 is a Sunday; never rely on a weekend roll-forward. Internal hard date 02/04/2028; internal filing cutoff 11/05/2027"
    ]},
    {after: "d5m1-a1", title: "Track B: In Suit", group: "suit", items: [
      "Service failed at 118 Larkspur Ln (10/01, 10/05, 10/08); a neighbor says Smith moved in August",
      "11/12/2026 Answer by Atty. Grant Mercer, Mercer & Hale LLP: comparative negligence (the Escape out of turn; John unbelted), causation (the gap; \"degenerative\" MRI), failure to mitigate (the disrupted care)"
    ]},
    {after: 'd5m1-a1', title: 'Track B: Discovery and the Deposition', group: 'suit', items: [
      "12/01/2026 defendant's Interrogatories (25), Requests for Production (30) and Requests for Admission (15), served on John by mail · unanswered admissions may be deemed admitted",
      "12/10/2026 Scheduling Order: plaintiff's experts 03/15/2027 · defense experts 04/15 · mediation by 03/31 · discovery closes 05/28 · pretrial 08/12 · trial calendar 09/13/2027",
      "John's deposition noticed 01/20/2027 for 02/18/2027, 10:00 a.m., by videoconference (Riverton Court Reporting)",
      "John unreachable from 01/22/2027 (lost phone, new number) · Margaret Doe is the emergency contact",
      "Property Damage still disputed: Loss of Use $2,016.00 vs $0; Diminished Value $3,600.00 vs $792.00; any proposal needs Atty. Thorne's authority"]},
    {after: "d5m4-a2", title: "Track B: Where the Suit Stands", group: "won", items: [
      "Skip-Trace 10/09 → 4410 Quarry Ridge Ct, Millbrook · served 10/14/2026 by Allied Process Services · affidavit filed 10/16 · answer was due 11/13",
      "John's discovery responses due 01/04/2027 (30 days + 3 for mail = 01/03, a Sunday) · Smith's responses due 01/13/2027 (e-served 12/14)",
      "Escape's event data recorder (downloaded 10/2026): front-passenger belt buckled; Escape at 11 mph at impact",
      "John reached through Margaret 02/03/2027 (the No Contact Protocol) · prep sessions 02/04 and 02/16 (Atty. Thorne leads; the CM never coaches testimony) · deposed 02/18/2027"
    ]},
    {after: "d5m5-a1", title: "Track B: Case Won", group: "won", items: [
      "07/06/2027 award, Laura Whitcomb, Esq.: damages exceed the UM limits · Harbor Point $20,000 + Cardinal State $10,000, with Keystone's $10,000 from the 03/18/2027 mediation: gross $40,000.00",
      "Fee at the 40% tier (suit filed 09/24/2026): $16,000.00 · receipted costs $3,895.25 (pre-suit $486.75 + filing, service, mediation, arbitration, court reporter, certified records)",
      "Liens at the fee actually charged: Peach State $1,860.00 → $1,116.00 (07/14/2027) · Riverton Spine & Rehab $6,105.00 audited → $4,275.00 (07/16/2027)",
      "Net to John Doe $14,713.75 · Settlement Statement signed 07/29 · disbursed 07/30/2027 ($5,646.17 less than Track A's $20,359.92)"
    ]}
  ],

  /* ---------- how the gap is engaged each day ---------- */
  gapArc: [
    [1, "Flagged in the file during intake and the Case Plan"],
    [2, "Probed with the client on a recorded call and documented from his own explanation and dated records"],
    [3, "Used by the adjuster as a causation defense, and countered with the MRI findings"],
    [4, "The adjuster's stonewall on the gap is what triggers the litigation fork"],
    [5, "Defended in deposition prep against opposing counsel's causation trap"]
  ],

  /* ---------- the 1–5 self-rating scale on every Knowledge Check ---------- */
  scale: [
    [1, "Not yet — I need this re-taught"],
    [2, "I can follow it with step-by-step help"],
    [3, "I can do it with a checklist"],
    [4, "I can do it unaided"],
    [5, "I can do it unaided and explain it to a peer"]
  ],

  /* ---------- where every existing topic lands in the 5-day flow ----------
     The theory traceability map (build/case-flow/curriculum.cjs) checks every one of
     the course's 192 topics against this plan and the blocks' `sources`: a topic is
     BUILT once a block cites it, SCHEDULED while its day is still to be written, and
     UNPLACED only if nothing below names it. Ranges are topic numbers, inclusive. */
  plan: [
    {from: "D1", topics: [1, 25], to: "Day 1", note: "Fundamentals, intake, claim set-up and case planning"},
    {from: "D1", topics: [26, 43], to: "Day 2 · Module 2", note: "Treatment Phase operations, red flags, the Standard Treatment Map, A-C-T"},
    {from: "D1", topics: [44, 44], to: "Day 1 · Module 4 and Day 2 · Module 3", note: "Treatment Gaps: flagged on Day 1, investigated on Day 2"},
    {from: "D1", topics: [45, 47], to: "Day 2 · Module 2", note: "Escalation ladder and the treatment Skill Builders"},
    {from: "D2", topics: [1, 10], to: "Day 2 · Module 4", note: "Pre-demand auditing"},
    {from: "D2", topics: [11, 15], to: "Day 3 · Module 1", note: "The BI demand"},
    {from: "D2", topics: [16, 16], to: "Day 3 · Module 2", note: "Negotiating the first call"},
    {from: "D2", topics: [17, 18], to: "Day 3 · Module 1", note: "Demand best practices and the real-time demand audit"},
    {from: "D2", topics: [19, 30], to: "Day 3 · Module 2", note: "Negotiation, the valuation baseline, stall tactics"},
    {from: "D2", topics: [31, 32], to: "Day 3 · Module 1", note: "The UM/UIM safety check and the key laws before BI closes"},
    {from: "D2", topics: [33, 39], to: "Day 3 · Module 4", note: "BI settlement execution and closing paperwork"},
    {from: "D2", topics: [40, 40], to: "Day 3 · Module 3", note: "Final lien mitigation"},
    {from: "D2", topics: [41, 41], to: "Day 3 · Module 4", note: "The operational-pincer Skill Builder"},
    {from: "D3", topics: [1, 6], to: "Day 3 · Module 1", note: "UM demand strategy, BI exhaustion and consent, the UM package"},
    {from: "D3", topics: [7, 11], to: "Day 3 · Module 2", note: "UM settlement: calculation, negotiation, offsets, payout"},
    {from: "D3", topics: [12, 16], to: "Day 3 · Module 1", note: "The documents that matter"},
    {from: "D3", topics: [17, 17], to: "Day 3 · Module 2", note: "The bad-faith arbitrage and the permanent deficit"},
    {from: "D3", topics: [18, 22], to: "Day 3 · Module 3", note: "Lien reduction"},
    {from: "D3", topics: [23, 38], to: "Day 3 · Module 4", note: "Net Sheet, disbursement, reconciliation"},
    {from: "D4", topics: [1, 4], to: "Day 4 · Module 1", note: "When pre-suit negotiation stalls; the neutral"},
    {from: "D4", topics: [5, 5], to: "Day 4 · Module 2", note: "Mediation logistics and scheduling"},
    {from: "D4", topics: [6, 15], to: "Day 4 · Module 3", note: "Mediation Binders"},
    {from: "D4", topics: [16, 20], to: "Day 4 · Module 2", note: "Arbitration, its hard rules, and the UPL line at hearings"},
    {from: "D4", topics: [21, 28], to: "Day 4 · Module 3", note: "Arbitration binders"},
    {from: "D4", topics: [29, 31], to: "Day 4 · Module 4", note: "Bottlenecks and the 48-Hour Mandate"},
    {from: "D5", topics: [1, 7], to: "Day 5 · Module 1", note: "Litigation lifecycle and KPIs"},
    {from: "D5", topics: [8, 20], to: "Day 5 · Module 3", note: "Deposition preparation"},
    {from: "D5", topics: [21, 21], to: "Day 5 · Module 1", note: "The litigation document index"},
    {from: "D5", topics: [22, 23], to: "Day 5 · Module 4", note: "Service of process and third-party subpoenas"},
    {from: "D5", topics: [24, 28], to: "Day 5 · Module 1", note: "File maintenance, document KPIs, the Complaint, written discovery, the master timeline"},
    {from: "D5", topics: [29, 30], to: "Day 5 · Module 4", note: "Process servers, evading defendants, subpoenas duces tecum"},
    {from: "D5", topics: [31, 33], to: "Day 5 · Module 1", note: "Litigation file architecture, advanced KPIs, the litigation Skill Builder"},
    {from: "D5", topics: [34, 35], to: "Day 1 · Module 3 and Day 5 · Module 2", note: "Property Damage: introduced on Day 1, disputed on Day 5"}
  ],

  /* ---------- plain English: each legal term or abbreviation, explained in plain words on the first block that uses it
     (js/cm-case-flow.js plainBox), before any task asks the trainee to work with it ---------- */
  plain: {
    "UPL": "Unauthorized Practice of Law: giving legal advice without a law license. You share facts and processes; Atty. Thorne gives opinions.",
    "SOL": "Statute of limitations: the last day a lawsuit can be filed. Miss it and the claim is gone for good.",
    "DOL": "Date of loss: the day of the collision. Every deadline on the file counts from it.",
    "CMS": "The firm's case management system: where every contact, document, deadline and decision is logged.",
    "Conflict Check": "A search for any tie between the firm and a party, run before a case is opened.",
    "BI": "Bodily injury coverage: the at-fault driver's insurance that pays for injuries he caused.",
    "UM": "Uninsured/underinsured motorist coverage: insurance that pays when the at-fault driver's coverage isn't enough.",
    "Host UM": "The UM coverage on the vehicle the client was riding in.",
    "Relative UM": "UM coverage on the policy of a relative the client lives with.",
    "Recovery Stack": "The insurance policies that can pay the claim, in the order they pay.",
    "Dec Page": "Declaration Page: a policy's summary sheet showing who is insured, what is covered and the limits.",
    "Declaration Page": "A policy's summary sheet showing who is insured, what is covered and the limits.",
    "MedPay": "Medical payments coverage: pays Medical Bills up to a set amount, no matter who caused the crash.",
    "PIP": "Personal injury protection: no-fault coverage for Medical Bills (and sometimes lost wages) in some states.",
    "LOR": "Letter of Representation: tells an insurance carrier the firm represents the client, so all contact goes to the firm.",
    "LOP": "Letter of Protection: the firm's written promise to pay a provider from the settlement, so the client can be treated now.",
    "HIPAA": "The federal privacy law for medical records: releasing them needs the patient's written authorization.",
    "BCRC": "Medicare's Benefits Coordination & Recovery Center, which must be told about injury claims of Medicare beneficiaries.",
    "SSDI": "Social Security Disability Insurance; people on it can be on Medicare, which has repayment rights.",
    "Payer Order": "Who pays the Medical Bills while the claim is open: MedPay first, then health insurance, then LOP or liens.",
    "Subrogation": "A payer's right to be repaid from the settlement for bills it covered.",
    "Lien": "A claim on part of the settlement money by someone who paid for or provided care.",
    "Reimbursement right": "A Health Plan's right to be paid back from the settlement for the bills it paid.",
    "EOB": "Explanation of Benefits: the Health Plan's statement of what it paid and what the patient owes.",
    "ERISA": "A federal law covering many employer Health Plans; it can give them strong repayment rights.",
    "Treatment Gap": "Days without medical care: before the first treatment, or a break between visits.",
    "Causation": "Whether the collision actually caused the injury.",
    "Recorded Statement": "A recorded interview a carrier asks for; anything said in it can be used later.",
    "Privilege": "Attorney-client privilege: confidential talks between the firm and its client that the other side can't see.",
    "MMI": "Maximum Medical Improvement: the point where more treatment won't improve the condition.",
    "Specials": "Special damages: the injury's countable costs, such as Medical Bills and lost wages.",
    "Demand Package": "The demand letter plus the records and bills that prove the claim.",
    "Time-Limited Demand": "A demand the carrier must accept within a set time, or it lapses.",
    "Bad faith": "A carrier's unreasonable refusal to pay a claim it should have paid.",
    "ACV": "Actual cash value: what the vehicle was worth just before the crash.",
    "Total Loss": "When repairing the vehicle would cost more than the carrier's threshold of its value.",
    "Loss of Use": "Money for the days the client is without a vehicle.",
    "Diminished Value": "The drop in a vehicle's resale value after a crash, even once it's repaired.",
    "Release": "The document the client signs to end a claim in exchange for payment.",
    "Limited Release": "A release that ends only the named claim against the named people.",
    "Pro rata": "Shared in proportion to each amount.",
    "IOLTA": "The lawyer's client trust account, where settlement money is held before it is paid out.",
    "Payoff Letter": "A lienholder's written final amount, accepted as full payment.",
    "Net Sheet": "The worksheet showing how the gross settlement becomes the client's net.",
    "GIRP": "A note format: Goal, Intervention, Response, Plan.",
    "Comparative negligence": "A rule that reduces the recovery by the client's own share of fault.",
    "Deposition": "Sworn questioning out of court, recorded for the lawsuit.",
    "Discovery": "The court process where each side must share its evidence.",
    "Mediation": "A settlement meeting led by a neutral who can't decide the case.",
    "Arbitration": "A hearing where a neutral decides the case.",
    "Withdrawal Letter": "The letter telling the client, carriers and providers that the firm no longer represents the client."
  },

  /* ---------- theory written for this flow (in neither the course nor the firm curriculum) ----------
     Listed in traceability.md so it can be reviewed: [what, where]. */
  authored: [
    ["A dedicated UPL lesson: fact sharing vs. legal advice, the hear-log-route habit, and reassurance about the process, never the outcome", "Day 1 · Module 1 — after Meet Your Case, before the first task"],
    ["The gap doctrine: the only gap explanation that holds up is the client's own factual explanation, supported by verifiable written documentation; the Case Manager records it without interpreting, defending or judging its effect on value", "Day 3 · Pre-Demand Audit & the Demand — the gap interview and the Gap Explanation Record"],
    ["Plain English for every legal term and abbreviation (CF.plain), shown on the first block that uses it", "Every day — the In plain English box on a lesson's Rules slide or an activity's Your Task slide"],
    ["The Case Manager's Role, Meet Your Case, and Opening John Doe's File in the CMS", "Case Flow Day 1 · Case Phase 1 — written for the case-lifecycle sequence, from D1#1–#7, D1#12–#13 and the case file"],
    ["The $40,000 host-passenger stack and its order of operations", "Day 1 · Module 1 — the case facts the brief specifies (Host UM and Relative UM behind a $10,000 BI)"],
    ["Recovery Stack vs. Payer Order as two separate questions", "Day 1 · Module 1, Lesson 2 — built on the Regulatory Triple-Check's Payer Order"],
    ["The three-criteria Skip-Trace gate", "Day 1 · Module 2 — the No Contact Protocol has the steps; the trigger rule is new"],
    ["The five-band Case Plan wrapping the Three-Pillar Plan, and the review-loop states", "Day 1 · Module 4"],
    ["The two-track fork: one file settling on Day 3 (Track A) and going to suit on Days 4–5 (Track B) from the same 08/05/2026 negotiation", "Days 3–5 — the brief's day order, made one coherent file"],
    ["UM notice at claim set-up (notice is not a demand) and verifying each UM form and MedPay's terms in writing", "Day 2 · Module 1"],
    ["LOP issuance guidelines and the MedPay exhaustion ledger", "Day 2 · Module 2"],
    ["Redirecting a referral to the client's choice of facility, and the downstream task list: each task done or delegated with an owner and a due date", "Day 2 · Module 2"],
    ["The non-leading gap interview, recording a client call with consent stated, and the Gap Explanation Record format", "Day 2 · Module 3"],
    ["Billed vs. paid Specials routed to counsel, and the strategy-briefing protocol for Lead Counsel", "Day 2 · Module 4"],
    ["The five elements of a Time-Limited Demand that holds up, and the Limited Release as the guard on the UM claims", "Day 3 · Module 1"],
    ["The net-floor gross-up for a percentage fee, and PIP valuation doctrine carried over to MedPay", "Day 3 · Module 2"],
    ["The 'verified none' lien inventory and pro-rata distribution worked on the BI-only illustration", "Day 3 · Module 3"],
    ["Trust handling (cleared funds, disputed shares held) and the UM release audit points", "Day 3 · Module 4"],
    ["The Track B close-out: the 07/06/2027 arbitration award, liens reduced at the 40% tier and the litigated LSH Net Sheet", "Day 5 · Module 5 — the case file had stopped at the hearing; written so the litigation track ends in a disbursement"],
    ["The five impasse triggers and the decision-only impasse memo", "Day 4 · Module 1"],
    ["Backward-counted deadlines move to the earlier business day; the SOL's internal hard date and cutoff", "Day 4 · Module 2"],
    ["Exhibit numbering, Bates ranges and the master index; authentication and relaxed arbitration evidence rules", "Day 4 · Module 3"],
    ["Three bottleneck families, CMS countermeasure rules and the five-field bottleneck report", "Day 4 · Module 4"],
    ["KPIs as formulas with targets, and the last day to serve written discovery", "Day 5 · Module 1"],
    ["Rental cap vs. reasonable repair time, the 17c critique and the PD-only release", "Day 5 · Module 2"],
    ["The remote-deposition room protocol and compound or loaded-question traps", "Day 5 · Module 3"],
    ["Authentication and chain of custody in the liability counter-package; the No Contact Protocol against a deposition date", "Day 5 · Module 4"],
    ["The Case Manager's close-out of a Dropped Case: the Pending Drop gate, Withdrawal Letters to the client, carriers and providers (the reason only in the client's), each send method, the Dropped status and its proof; no health insurance as a drop reason; the Denise Harlow practice matter", "Day 5 · Module 6 — from the firm's Claims Specialist deck “Dropped Cases”; the No Contact Protocol stays in Client Communications, and John Doe's case is never dropped"]
  ],

  days: [

  /* ==========================================================
     DAY 1 — FUNDAMENTALS & INTAKE
     ========================================================== */
  {
    n: 1, id: 11,
    title: "Case Flow Day 1 · Intake, Claims & Property Damage",
    phase: "Intake, claims & Property Damage",
    objective: "Know the Case Manager's role and the six stages of a file; meet John Doe and his case; hold the UPL line; read the raw file, make the acceptance decision and see which claims the file will carry; open the matter correctly in the CMS with the Conflict Check first; and set up the Property Damage side (the client's do's and don'ts, the rental, the repair or total-loss path).",
    gate: "Matter opened in the CMS with the Conflict Check documented · acceptance decision recorded · the claims the file carries identified · PD onboarding directions delivered and assigned in the system",
    discussion: "Robert Smith's carrier has already called John Doe, and he needs a car to get to work. What do you tell him today, in what order, and what has to be on the file before tomorrow's claim set-up?",
    fileState: [
      "A raw file from “On the Records”: date of loss 02/06/2026, statute of limitations 02/06/2028; the client's position and the facts of loss are in the Police Report, to be read, not assumed.",
      "Nothing is in the CMS yet: no Conflict Check, no matter, no parties.",
      "John Doe's Civic was damaged in the crash; the Property Damage claim and the rental are still to be set up.",
      "John Doe has not started treatment."
    ],
    modules: [

    /* ---------- DAY 1 · MODULE 1 ---------- */
    {
      n: 1, id: "d1m1",
      title: "CM Fundamentals & CMS Initialization",
      about: "Day 1's foundations: the Case Manager's role and the six stages, meeting John Doe and his case, the UPL line between sharing facts and giving legal advice, reading the raw file, and opening the matter in the CMS with the Conflict Check first.",
      quiz: [
        {q: "The three pillars of the Case Plan are:",
         opts: ["Coverage, Liability, Projection", "Clinical, Functional, Financial", "Intake, Treatment, Demand", "HIPAA, BCRC, Payer Order"],
         a: 1, r: "Clinical (acute interventions), Functional (ADLs and return to work), Financial (Payer Order, subrogation, MMSEA)."},
        {q: "Which of these is fact sharing, not legal advice?",
         opts: ["“The Police Report lists the date of loss as 02/06/2026.”", "“Your case is probably worth the policy limits.”", "“The gap in your treatment won't matter.”", "“I'd accept the first offer if I were you.”"],
         a: 0, r: "Reading a fact from a document is fact sharing. Value, settlement and what a fact does to the case are legal advice: Atty. Thorne's alone."},
        {q: "John Doe asks, “Is waiting to see a doctor going to hurt my case?” What do you do?",
         opts: ["Tell him it won't matter, to keep him calm", "Tell him it will lower the value, so he's prepared", "Say it's a question for Atty. Thorne, log it word for word, route it today and tell him when to expect an answer", "Explain how adjusters usually argue a gap"],
         a: 2, r: "Reassurance, alarm and an account of how gaps are argued are all opinions on his case. Hear it, log it, route it, and give him a time frame."},
        {q: "John Doe asks what his case is worth. Who answers?",
         opts: ["The Case Manager, from the Specials", "Atty. Thorne", "Dana Whitfield, the BI adjuster", "Nobody until the demand"],
         a: 1, r: "Value, merits and strategy are Atty. Thorne's calls. The Case Manager logs the question and routes it the same day."},
        {q: "Opening John Doe's matter in the CMS, what comes first?",
         opts: ["Docketing the SOL", "Creating the matter", "The Conflict Check on every party's full legal name", "Calling Keystone Mutual"],
         a: 2, r: "Nothing moves until the Conflict Check is documented, on full legal names."},
        {q: "Who owns the legal judgments on John Doe's file: value, merits, strategy and settlement authority?",
         opts: ["The Case Manager", "Atty. Elijah Thorne", "The intake team", "Keystone Mutual's adjuster"],
         a: 1, r: "You own the file's movement: deadlines, documents, carriers, providers and updates. Atty. Thorne owns every legal judgment."},
        {q: "A call with John Doe was never logged in the CMS. For the file, that call:",
         opts: ["Counts, as long as you remember it", "Didn't happen: the CMS is the single source of truth", "Belongs in an email to yourself", "Gets logged at the end of the month"],
         a: 1, r: "Every contact, document, deadline and decision is logged in the CMS the same day. If it isn't in the CMS, it didn't happen."},
        {q: "Where was John Doe in the collision on 02/06/2026?",
         opts: ["Driving his own Civic", "The front-seat passenger in Kevin Alvarez's 2020 Ford Escape", "A pedestrian at the crossing", "Driving Margaret Doe's car"],
         a: 1, r: "He was the front-seat passenger in the host vehicle; Robert Smith ran the all-way stop and struck the passenger door."},
        {q: "Which statute of limitations is docketed on John Doe's file?",
         opts: ["02/06/2027", "02/20/2028", "02/06/2028", "02/09/2028"],
         a: 2, r: "Every deadline counts from the date of loss, 02/06/2026, and the SOL is docketed on day one: 02/06/2028."},
        {q: "The intake note and the Police Report give different dates of loss. Which do you confirm the date of loss against?",
         opts: ["The intake note", "The client's memory", "The Police Report", "The adjuster's first call"],
         a: 2, r: "Confirm it against the Police Report: the SOL, every carrier deadline and the treatment timeline count from it. Document the correction; never fix it silently."},
        {q: "Why does recording John Doe as a passenger, not a driver, matter so much at intake?",
         opts: ["It decides which policies can be reached", "It changes the statute of limitations", "It decides which court hears the case", "It matters only for the Property Damage claim"],
         a: 0, r: "Driver, passenger or pedestrian decides which policies can be reached. A mis-mapped party is a lost coverage layer."},
        {q: "A party on the intake record is left as “unknown”. What does that usually mean?",
         opts: ["Nothing: it can be filled in at the demand", "A coverage layer you haven't found yet", "The party has no insurance", "The Conflict Check is complete"],
         a: 1, r: "Six roles exist on this file; a party left as “unknown” is a coverage layer you have not found yet."},
        {q: "At the acceptance decision, John Doe's file is Accepted, Escalated or Declined. What must go with the decision?",
         opts: ["A reason someone else can follow", "The case value", "The adjuster's approval", "Nothing: the status is enough"],
         a: 0, r: "Record the decision with its reason. If eligibility is uncertain, clarify with the client and escalate to the attorney with a short summary of what is ambiguous."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d1m1-role", noGame: true,
        title: "The Case Manager's Role",
        topic: "Owning the file from intake to resolution",
        visual: "A single horizontal case-lifecycle track across the slide: eight rounded stations left to right — Intake, Claim Set-Up, Treatment, Pre-Demand, Demand, Settlement & Liens, Disbursement, Litigation (the last drawn dashed, as the fork). Above the track a navy band, THE CASE MANAGER OWNS THE MOVEMENT, runs the full width; below it a thinner orange band, ATTY. THORNE OWNS EVERY LEGAL JUDGMENT. A small CMS monitor icon sits under the first station, captioned: if it isn't in the CMS, it didn't happen.",
        tell: {
          why: "Every phase of this course runs through one person: you, the Case Manager. Knowing exactly what the role owns, and where it stops, is what lets you move John Doe's file fast without crossing into legal advice.",
          rules: [
            "Case Management is the end-to-end coordination, tracking and handling of a case from intake to resolution: timely progression, proper documentation and compliance, and effective communication between all parties.",
            "You own the file's movement: deadlines, documents, carriers, providers and the client's updates. Atty. Thorne owns every legal judgment: value, merits, strategy and settlement authority.",
            "A case moves through phases (intake, claim set-up, treatment, pre-demand, demand, settlement and liens, disbursement, and litigation if it forks), and each phase has its own goals and deliverables.",
            "Your key duties: client communication, case progress monitoring, task compliance, case updates and summaries, document drafting and filing, case health analysis, and planning recommendations to counsel.",
            "The CMS is the single source of truth. Every contact, document, deadline and decision is logged there the same day; if it isn't in the CMS, it didn't happen.",
            "Flag risk early. A missed deadline, a silent client or a gap in treatment goes to Atty. Thorne the day you see it, with the facts and a recommended next step."
          ],
          upl: [
            "You may explain the process and confirm facts. You may not tell a client what the case is worth, whether to settle, or what the law means for them. Those are Atty. Thorne's calls."
          ]
        },
        show: {
          caption: "Who owns what on John Doe's file",
          type: "compare",
          boxes: [
            {head: "The Case Manager owns", items: ["Opening and structuring the file in the CMS", "Every deadline, docketed with reminders", "Carrier, provider and client communication, logged", "Documents requested, named and filed", "The Case Plan draft and its risk flags", "Recommendations to counsel"]},
            {head: "Atty. Thorne owns", items: ["Accepting the case", "Case value and merits", "Demand strategy and amounts", "Settlement authority", "Lien compromises", "Every filing and court decision"]}
          ]
        },
        ops: [
          ["A new matter is assigned", "Read the raw file end to end before contacting anyone", "CMS → Case File", "Every party, date and carrier noted before the first call"],
          ["The client asks a legal question", "Log it and route it to Atty. Thorne the same day", "CMS → Communications Log · Tasks", "Question routed with the facts; no opinion given"],
          ["A deadline or risk appears", "Docket it, flag it and recommend a next step", "CMS → Calendar · Case File → Risk Flags", "Nothing lives only in an email or in memory"]
        ],
        best: [
          "Own the next step: no file sits without a dated task.",
          "Log every client contact in the CMS the same day.",
          "Answer process questions yourself; route legal questions to the attorney.",
          "Pitfall: answering “what's my case worth?”, even as a guess.",
          "Pitfall: keeping the file's real status in your inbox instead of the CMS.",
          "Pitfall: waiting to flag a risk until you have fixed it yourself."
        ],
        sources: ["D1#1", "D1#2", "D1#3", "D1#4"],
        rubric: {
          ai: [
            ["Role definition", 20, "Defines Case Management as end-to-end ownership of the file's movement, not data entry"],
            ["Ownership split", 25, "Separates the Case Manager's work from Atty. Thorne's legal judgments correctly"],
            ["System discipline", 15, "Treats the CMS as the single source of truth for every contact and deadline"]
          ],
          trainer: [
            ["Professional judgment", 25, "Knows when to act and when to route to counsel"],
            ["UPL boundary", 15, "No value, merits or strategy opinion offered, even informally"]
          ]
        },
        notes: [
          "Open with: “Whose file is it?” Let the room argue, then land it: the client's case, the attorney's judgment, your movement.",
          "Walk the lifecycle track once, left to right. Every day of this course sits on one or two of these stations.",
          "Name the UPL line now and keep naming it. The fastest way to hurt a case is a well-meant guess about its value.",
          "Point at the CMS icon: from today, everything the trainees do on John Doe's file happens in the CMS."
        ]
      },

      {
        kind: "lesson", id: "d1m1-case",
        title: "Meet Your Case: John Doe v. Robert Smith",
        topic: "The one file you will work for five days",
        visual: "A case card filling the slide like a file folder: top-left the style JOHN DOE v. ROBERT SMITH in Fraunces with the matter number LSH-2026-MVA-770412 in mono beneath. Left column: a small diagram of the all-way stop at Maple Hollow Rd & Birch Ave, the pickup's arrow running the stop into the Escape's passenger door. Right column: three stacked navy-to-orange bars for the $40,000 stack (BI $10,000, Host UM $20,000, Relative UM $10,000). Along the bottom, an orange timeline strip from DOL 02/06/2026 to first treatment 02/20/2026, labelled 14-DAY TREATMENT GAP.",
        tell: {
          why: "Every lesson, activity and Learning Check in this course works one file: John Doe v. Robert Smith. Knowing its facts cold (who, when, which policies, what is at risk) is what makes every step you take in the CMS make sense.",
          rules: [
            "The collision: 02/06/2026, about 7:10 a.m., at the all-way stop at Maple Hollow Rd & Birch Ave. Who ran the stop, which vehicles were involved and who was cited are in the Police Report: read it, don't assume.",
            "Your client: John Doe, 34, a warehouse shift lead at Northgate Distribution. Lead Counsel: Atty. Elijah Thorne. Case Manager: you. Where John Doe was sitting is a fact you find in the records, not one you are given.",
            "The Recovery Stack is $40,000, worked in order: $10,000 BI (Keystone Mutual) → $20,000 Host UM (Harbor Point) → $10,000 Relative UM (Cardinal State Mutual).",
            "His position in the vehicle decides which of those layers he can reach. Work it out from the Police Report and the policies before you name a single carrier.",
            "Health: Peach State Health Plan asserted a reimbursement right on first notice; Harbor Point carries $5,000 MedPay on the Escape.",
            "The critical fact: compare the EMS Run Report's date with the first treatment record. The days between them are a Treatment Gap: you record its dates and, later, John Doe's own documented explanation. You never judge it.",
            "The statute of limitations is docketed for 02/06/2028. Every deadline on the file counts from the date of loss."
          ],
          upl: [
            "You may share facts and explain the process to John Doe. You may not tell him what his case is worth or what the gap does to his claim. That is Atty. Thorne's call."
          ]
        },
        show: {
          caption: "John Doe's file at a glance",
          type: "table",
          head: ["", "On this file"],
          rows: [
            ["Case", "John Doe v. Robert Smith · LSH-2026-MVA-770412 · motor vehicle collision"],
            ["Date of loss / SOL", "02/06/2026 · SOL 02/06/2028"],
            ["Client", "John Doe, 34 · his position in the vehicle: find it in the Police Report"],
            ["Defendant", "Robert Smith · what happened, and any citation: the Police Report"],
            ["Lead Counsel", "Atty. Elijah Thorne"],
            ["Recovery Stack", "$10,000 BI → $20,000 Host UM → $10,000 Relative UM = $40,000"],
            ["Health Plan", "Peach State · reimbursement right asserted"],
            ["Critical fact", "A Treatment Gap: compare the EMS Run Report with the first treatment record"]
          ]
        },
        ops: [
          ["The course begins", "Read the Case File profile and the intake documents", "Case File · Case Documents", "Can state the DOL, the stack and the critical fact from memory"],
          ["The matter opens in the CMS", "Check every case fact against its source document", "CMS → Case File · Documents", "Each fact traced to a document, none to memory"],
          ["A fact changes", "Update the CMS and tell the team the same day", "CMS → Case Notes", "The CMS matches the file, always"]
        ],
        best: [
          "Know the stack, the dates and the critical fact before the first call.",
          "Trace every fact to its document: Police Report, Declaration Page, medical record.",
          "Pitfall: repeating a fact from memory that the documents don't support.",
          "Pitfall: treating a gap in treatment as the client's fault rather than a fact to document."
        ],
        sources: ["D1#16", "D1#19", "curriculum/5-day-flow/case-file.md §1–2: the file at intake, people and vehicles, the collision"],
        rubric: {
          ai: [
            ["Case facts", 25, "DOL, SOL, parties and John Doe's position stated correctly"],
            ["Recovery Stack", 20, "$40,000 in the order BI → Host UM → Relative UM"],
            ["Critical fact", 15, "Finds the Treatment Gap in the records and states its dates, without judging it"]
          ],
          trainer: [
            ["Fact discipline", 25, "Traces facts to documents rather than memory"],
            ["UPL boundary", 15, "Shares facts, never value or merits"]
          ]
        },
        notes: [
          "Hand out nothing yet. Ask the room what they would want to know about a new file in the first five minutes, then show the case card.",
          "Say the stack out loud in order, twice: BI, Host UM, Relative UM. It is the spine of Days 1 to 3.",
          "Land the critical fact without blame: a 14-day gap is ordinary life (work, waiting it out), and the Case Manager's job is to document it, not judge it.",
          "Close: “From the next slide on, every fact you use comes from a document in the file, not from this card.”"
        ]
      },

      {
        kind: "lesson", id: "d1m1-upl",
        title: "Fact Sharing vs. Legal Advice: the UPL Line",
        topic: "What you may say, and what only Atty. Thorne says",
        visual: "A two-column board split by a red vertical line labelled THE UPL LINE. Left, a green-bordered column headed FACT SHARING · YOU, five speech bubbles in plain words: a date read from a document, the next step in the process, who decides, when an answer is due, what was sent and when. Right, a red-bordered column headed LEGAL ADVICE · ATTY. THORNE, five struck-through bubbles: what the case is worth, whether to settle, what the gap does to the claim, what the law means for him, what to tell an adjuster. Along the bottom, three mono pills: HEAR IT · LOG IT · ROUTE IT TO ATTY. THORNE, THE SAME DAY.",
        tell: {
          why: "Unauthorized Practice of Law (UPL) means giving legal advice without a law license. A Case Manager who crosses that line, even kindly, can hurt John Doe's case and put the firm at risk. The line itself is simple: you share facts and explain processes; Atty. Thorne gives every opinion on the case.",
          rules: [
            "In plain English, legal advice is any opinion about what John Doe's facts mean for his rights, his money or his choices. Only a licensed attorney gives it.",
            "You share facts: a date, an amount on a document, what a record says, who has the file, what was sent and when.",
            "You explain processes: what happens next, what a form is for, how long a step usually takes, and who decides.",
            "You never advise on case value, legal strategy, whether to settle, or how a fact (a gap in treatment, a prior injury, a missed visit) changes the outcome or the money.",
            "When John Doe asks an opinion question, hear it, log it word for word in the CMS and route it to Atty. Thorne the same day. Then tell him when to expect an answer.",
            "Reassure him about the process, never the outcome: “Atty. Thorne will go over this with you” is support; “Don't worry, you'll be fine” is advice.",
            "The test before you speak: am I telling him what is, or what he should do and what it means? The first is yours; the second is Atty. Thorne's."
          ],
          upl: [
            "You share facts and explain the process. You never give an opinion on value, strategy, settlement or what a fact does to the case: log the question and route it to Atty. Thorne."
          ]
        },
        show: {
          caption: "The same questions, answered both ways",
          type: "split",
          do: [
            "“The Police Report lists the date of loss as 02/06/2026.”",
            "“The next step is a letter to each insurance carrier saying we represent you.”",
            "“That's a question for Atty. Thorne. I've logged it, and he'll call you by Friday.”",
            "“Carriers usually answer within a few weeks; I'll follow up and update you.”",
            "“I'll write down exactly what you told me, and the document that shows it.”"
          ],
          dont: [
            "“Your case is probably worth the policy limits.”",
            "“I'd take the offer if I were you.”",
            "“The gap in your treatment will hurt your case.”",
            "“Don't worry, that won't matter.”",
            "“Tell the adjuster it was the other driver's fault.”"
          ]
        },
        ops: [
          [
            "John Doe asks what his case is worth",
            "Say it is Atty. Thorne's question; log his words exactly",
            "CMS → Case Notes · Tasks",
            "Routed the same day; no figure given"
          ],
          [
            "John Doe asks what happens next",
            "Explain the next step of the process in plain words",
            "CMS → Case Notes",
            "Process explained; no prediction of the outcome"
          ],
          [
            "An adjuster or provider asks your view of the case",
            "Decline politely; share only facts the firm has approved",
            "CMS → Communications Log",
            "Nothing said beyond the record; contact logged"
          ]
        ],
        best: [
          "Answer what is on the record; route what it means.",
          "Use the same routing line every time: “That's Atty. Thorne's call; I'll get it to him today.”",
          "Give the client a time frame for the answer, so routing never feels like a brush-off.",
          "Pitfall: a kind reassurance about the outcome (“you'll be fine”); it is still legal advice.",
          "Pitfall: guessing a value, or what a gap does to the claim, even “off the record”.",
          "Pitfall: coaching the client on what to tell an adjuster."
        ],
        sources: [
          "D4#20",
          "LSH Claims Specialist: communication skills and professionalism — clarity without jargon, calm reassurance",
          "Newly authored: a dedicated, practical UPL lesson: fact sharing vs. legal advice, and the hear-log-route habit"
        ],
        rubric: {
          ai: [
            [
              "Fact vs. advice",
              25,
              "Sorts statements into fact sharing and legal advice correctly"
            ],
            [
              "Routing",
              20,
              "Logs opinion questions word for word and routes them to Atty. Thorne the same day"
            ],
            [
              "Plain words",
              15,
              "Explains the process in plain English, without jargon"
            ]
          ],
          trainer: [
            [
              "UPL boundary",
              25,
              "No opinion on value, strategy, settlement or what a fact does to the case, even kindly"
            ],
            ["Client care", 15, "Routing comes with a time frame and a warm tone"]
          ]
        },
        notes: [
          "Ask the room: “John Doe says, ‘Just tell me honestly, is my case any good?’ What do you say?” Collect the answers before showing the board.",
          "Sort each answer onto the board: fact sharing or legal advice. Most rooms find at least one kind reassurance that is really advice.",
          "Drill the routing line until everyone can say it without notes: “That's Atty. Thorne's call; I've logged it, and he'll get back to you by …”",
          "Close: every later lesson carries a UPL Line box. It is this lesson, applied to that step."
        ]
      },

      {
        kind: "lesson", id: "d1m1-l1",
        title: "Ingesting the Raw File",
        topic: "From “On the Records” to a structured matter",
        visual: "Left-to-right intake pipeline across the full slide width. Left third: a muted grey stack of unsorted documents labelled RAW INTAKE, deliberately untidy. Centre: three orange-numbered gates in a row — ① Verify ② Map ③ Structure — each a navy card with the orange circle badge top-centre and a thin navy → connector between them. Right third: a clean white CMS matter card with six filled role rows, each with a green ✓. The argument is made by the contrast between the grey untidy left edge and the crisp white right edge. Beneath the pipeline, a full-width orange-bordered strip holds the case's four continuity anchors as mono pills.",
        tell: {
          why: "The Intake Phase is where the Case Manager establishes control, structure and clarity. It is not just data collection: a file opened wrong stays wrong, because every later deadline, demand and lien check reads from the fields set in the first hour. A mis-mapped party is not a typo. It is a lost coverage layer.",
          rules: [
            "Case Management is the end-to-end coordination, tracking and handling of a case from intake to resolution: timely progression, proper documentation and compliance, and effective communication between all parties. It is ownership, not data entry.",
            "You are the gatekeeper of case quality. Confirm the intake work is complete, accurate, properly documented and ready for activation. Incomplete intake goes back, not forward.",
            "Run the Conflict Check before the file is created, on the full legal name of every party (Robert Smith, the host driver, the resident relative), and record its date and result. Nothing else moves until it is done.",
            "Confirm the date of loss against the Police Report, not the intake note. The statute of limitations, every carrier deadline and the treatment timeline count from it.",
            "Compare the intake narrative with the Police Report and the client's statement, and check every signature and authorization before activation. Confirm and document any correction; never fix an inconsistency silently.",
            "Docket the statute of limitations on day one. On this file: 02/06/2028.",
            "Map every party to a role. Six roles exist on this file, and a party left as “unknown” is a coverage layer you have not found yet.",
            "Record the client's position in the vehicle. Driver, passenger or pedestrian decides which policies can be reached.",
            "Collect the full pre-claim data set (client basics, every driver and vehicle, insurance from the Police Report or the client, witnesses) and the emergency contact. Clients go quiet, and the emergency contact is the channel that still reaches them.",
            "Read coverage off the Declaration Page, not a summary, and record the source of every coverage fact: Dec Page, adjuster letter or Police Report.",
            "Expect asymmetry. First-party carriers disclose limits readily; a third-party BI carrier usually asks for documents first and runs its own investigation.",
            "Name every document to the firm's convention on ingest, and keep the CMS as the single source of truth, not side emails."
          ],
          upl: [
            "You may confirm facts and explain the process. You may not tell the client what the case is worth or whether they have a claim. That is Atty. Thorne's call."
          ]
        },
        show: {
          caption: "The six roles on John Doe's file, and what each one unlocks",
          type: "table",
          head: ["Role", "Party", "Why this field matters"],
          rows: [
            ["Client / Plaintiff", "John Doe", "Position in the vehicle, read from the Police Report. This field decides which UM layers open."],
            ["Defendant", "Robert Smith", "At-fault driver. His BI carrier pays first."],
            ["Lead Counsel", "Atty. Elijah Thorne", "Every demand and filing routes through him."],
            ["Case Manager", "You", "Owns the file's movement; does not own legal judgment."],
            ["Host driver", "Operator of John Doe's vehicle", "Source of the $20,000 Host UM layer."],
            ["Resident relative", "John Doe's household relative", "Source of the $10,000 Relative UM layer."]
          ]
        },
        ops: [
          ["Raw file received from “On the Records”", "Run and document the Conflict Check, then verify DOL, parties and signatures against the source documents", "CMS → New Case", "Conflict Check logged before the file exists; DOL matches the Police Report"],
          ["Matter created", "Docket the SOL and log the retainer and the claim-specific HIPAA authorization", "CMS → Calendar · Documents", "SOL 02/06/2028 on the calendar; both signatures logged"],
          ["Parties identified", "Map all six roles and record the client's position in the vehicle", "CMS → Parties", "No party left “unknown”; position recorded from the Police Report"],
          ["Documents arrive", "Name each to the firm's convention and file it under its CMS category", "CMS → Documents", "Every document findable by its convention name"]
        ],
        best: [
          "Record the source of every coverage fact (Dec Page, adjuster letter, Police Report).",
          "Docket the statute of limitations on day one.",
          "Request missing documents in one consolidated message, with a deadline.",
          "Use the CMS as the single source of truth, not side emails.",
          "Pitfall: creating the file before the Conflict Check is documented.",
          "Pitfall: running the Conflict Check on a nickname or partial name.",
          "Pitfall: rewriting a vague summary from memory instead of confirming the facts with the client.",
          "Pitfall: accepting a case because intake “mostly” looks fine."
        ],
        sources: ["D1#1", "D1#3", "D1#4", "D1#5", "D1#6", "D1#7", "D1#10", "D1#12", "D1#13", "D1#15", "D1#16", "D1#18", "LSH Claims Specialist: pre-claim data set, Declaration Page, coverage asymmetry"],
        rubric: {
          ai: [
            ["Conflict Check first", 15, "Conflict Check documented before the file is created"],
            ["DOL and SOL", 20, "DOL 02/06/2026 matched to the Police Report; SOL 02/06/2028 docketed"],
            ["Role completeness", 25, "All six roles populated, none left blank or “unknown”, client recorded as a passenger"]
          ],
          trainer: [
            ["Verification discipline", 25, "Cross-checked the sources rather than accepting the intake note"],
            ["UPL boundary", 15, "No valuation or merits opinion offered to the client"]
          ]
        },
        notes: [
          "Open by asking the room: “What is the single most expensive mistake you can make in the first hour of a file?” Let them answer, then show the passenger field.",
          "The passenger fact is the whole lesson. Driving his own car on this loss, John Doe would reach $10,000: he rejected UM on his own policy, and the relative policy excludes a car he owns. As a passenger in the host vehicle he reaches $40,000. Same crash, same injuries, four times the recovery, decided by one field.",
          "Stress that “On the Records” files arrive unverified. A trainee who treats the intake note as fact carries its errors into the demand.",
          "Name the UPL line now. It comes back every day of this program."
        ]
      },

      {
        kind: "activity", id: "d1m1-open",
        title: "Opening John Doe's File in the CMS",
        topic: "Skill Activity — from raw file to an active matter",
        visual: "The CMS New Case screen as a large mock-up on the left two-thirds: a Conflict Check panel at the top with a green LOGGED stamp, then the matter fields (DOL, SOL, client position) with two fields outlined in orange where the draft was wrong. On the right, a vertical checklist of the intake documents (intake sheet, supplement, CMS record, retainer, HIPAA, Police Report), each with a filed tick and its CMS category in mono type.",
        act: {
          scenario: "02/09/2026. The raw file from “On the Records” is in: the New Client Intake Sheet, the intake supplement, the signed retainer and claim-specific HIPAA authorization, and the Riverton PD crash report. A colleague keyed a draft intake record into the CMS. Atty. Thorne wants the matter active today.",
          prompt: "Open John Doe's matter in the CMS. Run and document the Conflict Check on every party's full legal name before anything else. Verify the draft intake record field by field against the source documents (date of loss, names and roles, John Doe's position, date of birth, report number) and correct each error with its source, never silently. Docket the SOL (02/06/2028) with reminders, map all six roles, log the retainer and the HIPAA authorization, and file every intake document under its CMS category, named to the firm's convention. Route a short note of what you corrected to Atty. Thorne.",
          tool: "CMS → New Case · Parties · Calendar · Documents · Case Notes",
          output: "An active matter: Conflict Check logged first, every field verified against its source, six roles mapped, SOL docketed, intake documents filed, corrections noted to Atty. Thorne.",
          checkpoints: [
            "Conflict Check documented before the matter was created, on full legal names",
            "Date of loss 02/06/2026 confirmed against the Police Report; SOL 02/06/2028 docketed with reminders",
            "John Doe recorded as the front-seat passenger, not the driver",
            "Errors caught and corrected with their source: the position and the date of birth in the draft record, the transposed report number on the intake sheet",
            "All six roles mapped; none left “unknown”",
            "Retainer and HIPAA authorization logged with their signing date (02/09/2026)",
            "Every intake document filed under its CMS category and named to convention",
            "Corrections summarized to Atty. Thorne in Case Notes"
          ]
        },
        ops: [
          ["Raw file received", "Run and document the Conflict Check on full legal names", "CMS → New Case", "Conflict Check logged before the matter exists"],
          ["Draft record keyed", "Verify every field against its source document and correct with the source", "CMS → Case File · Documents", "No field accepted from the draft unchecked"],
          ["Matter active", "Docket the SOL, map the parties, file the intake documents", "CMS → Calendar · Parties · Documents", "SOL 02/06/2028 with reminders; six roles; every document filed"]
        ],
        best: [
          "Verify against the Police Report and signed documents, not the draft.",
          "Note every correction and its source in Case Notes.",
          "Pitfall: accepting “Driver” in the position field because it was pre-filled.",
          "Pitfall: filing documents before naming them to the convention."
        ],
        sources: ["D1#5", "D1#6", "D1#7", "D1#12", "D1#13"],
        rubric: {
          ai: [
            ["Conflict Check first", 15, "Documented before the matter was created, on full legal names"],
            ["Field verification", 25, "Position, date of birth and report number corrected with their sources"],
            ["Matter set-up", 20, "SOL docketed with reminders, six roles mapped, intake documents filed by category"]
          ],
          trainer: [
            ["Verification discipline", 25, "Checked every field against a document rather than the draft"],
            ["Communication", 15, "Corrections routed to Atty. Thorne in a short, factual note"]
          ]
        },
        notes: [
          "Give the room ten minutes in the CMS before you say anything about the planted errors.",
          "Ask who changed the position field and on what evidence. The answer must be a document: the Police Report and the intake sheet.",
          "If someone corrects the date of birth without noting the source, stop them: an unexplained change is a new error.",
          "Close by opening the Case Notes: the note to Atty. Thorne is part of the work, not an extra."
        ]
      },

      {
        kind: "check", id: "d1m1-kc",
        title: "CM Fundamentals Knowledge Check",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SKILL SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar, to show it is not part of the weighting.",
        check: {
          questions: [
            "Name the six stages of John Doe's file in order, and say what the Case Manager owns at Intake & Case Opening that nobody else will.",
            "John Doe asks what his case is worth. Who answers, what do you tell him, and what do you log?",
            "You are opening John Doe's matter in the CMS. What must happen before the matter is created, on whose names, and why does the order matter?",
            "John Doe asks whether waiting to see a doctor hurt his case. Say word for word what you tell him, and what you record in the CMS."
          ],
          summary: [
            "Summarize, in your own words, what you learned opening John Doe's file: the principles, not the clicks.",
            "Articulate your strategy: John Doe's matter is open in the CMS. What is the next action you would take on this file, and why is it the right next action rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Explaining the Case Manager's role across the six stages",
            "Mapping party roles from a raw intake file",
            "Reading the raw file for what it proves and what it lacks",
            "Running and documenting the Conflict Check before a matter is opened",
            "Opening a matter correctly in the CMS",
            "Holding the UPL boundary in client contact"
          ]
        },
        best: [
          "Answer with the file's own numbers and names, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D1#1", "D1#5", "D1#12", "D1#16"],
        rubric: {
          ai: [
            ["Stages and role", 20, "Six stages in order; what the Case Manager owns at opening stated correctly"],
            ["UPL routing", 15, "The value question goes to Atty. Thorne the same day and is logged; nothing on worth is said to the client"],
            ["Opening sequence", 15, "The Conflict Check comes first, on every party's full legal name, documented before the matter is created"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Escalation to Atty. Thorne identified where authority is required"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 3 is the keystone. A trainee who would create the matter before the Conflict Check has the order wrong; re-teach it before Day 2.",
          "Question 2 tests the UPL line on day one: the right answer routes the value question to Atty. Thorne and logs it, and says nothing about worth.",
          "Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.",
          "UPL is a gate: a strong score does not survive an ethics breach."
        ]
      }

      ]
    },

    /* ---------- DAY 1 · MODULE 2 ---------- */
    {
      n: 2, id: "d1m2",
      title: "Handling MIA Clients — Early Retention Phase",
      about: "The client who stops answering: the No Contact Protocol, a defensible outreach log, the Final Warning Letter and the Skip-Trace trigger.",
      quiz: [
        {q: "Under the No Contact Protocol, what comes before any outreach call?",
         opts: ["The Final Warning Letter", "An internal review of case status, live deadlines and the date of last contact", "A Skip-Trace", "A Motion to Withdraw"],
         a: 1, r: "Step 1 is the internal review: you check what is running on the file before you dial."},
        {q: "Two voicemails on John Doe's mobile, on two days, show that:",
         opts: ["The contact ladder is exhausted", "The phone rung is cleared; email, text and the emergency contact still follow", "Skip-tracing can begin", "The client has abandoned the case"],
         a: 1, r: "Escalate by channel, not by volume."},
        {q: "The Final Warning Letter is sent by:",
         opts: ["Email only", "Certified mail only", "Certified mail AND email", "Text message"],
         a: 2, r: "Both: certified mail proves delivery and email gets a response. It states the prior attempts, a 7–14 day deadline and notice of potential withdrawal."},
        {q: "At Step 5 the client is still unresponsive. Who decides whether the firm withdraws?",
         opts: ["The Case Manager", "The attorney", "The intake team", "The adjuster"],
         a: 1, r: "The Case Manager builds the record; the attorney decides on a Notice of Withdrawal or a Motion to Withdraw."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d1m2-l1", compact: true,
        title: "The No Contact Protocol — Steps 1 to 3",
        topic: "Internal review, escalating contact attempts, team notification",
        visual: "A six-station vertical protocol spine down the left third, stations numbered 1–6 in orange circles on a navy rail. Stations 1–3 are in full colour (INTERNAL REVIEW · CONTACT ATTEMPTS · TEAM NOTIFICATION); stations 4–6 are greyed back with a small “next lesson” tag, so the whole protocol is visible but this lesson's scope is clear. The right two-thirds expands station 2 as an escalating channel ladder: PHONE (2+ attempts) → EMAIL + SMS → EMERGENCY CONTACT → CERTIFIED MAIL / FORMAL LETTER, each rung a widening bar. Bottom-right, a red-bordered card: “SOL and hearing dates keep running.”",
        tell: {
          why: "The No Contact Protocol does three jobs at once: it tracks unresponsiveness formally, it establishes due diligence before any withdrawal, and it protects the firm from liability. A client who can't be reached is a file that still has deadlines, and the protocol is the proof the firm did its part.",
          rules: [
            "Step 1, Internal Review: before you call anyone, check the case status, the live deadlines and the date of last contact, and confirm every earlier attempt used an approved channel.",
            "Step 2, Contact Attempts, escalating: at least two phone attempts, then email and text, then the emergency contact, then certified mail or a formal letter.",
            "Escalate by channel, not by volume. Two voicemails on one number clears the phone rung and nothing more.",
            "Set a follow-up reminder the moment a request goes out, and give the client an easy way to answer: a call window, a text, an upload link.",
            "Log every attempt in the CMS when you make it: date, time, channel, outcome. An unlogged attempt did not happen.",
            "Step 3, Team Notification: escalate to the attorney or supervisor, document it in the CMS, and assess the case impact, including the statute of limitations and any hearing dates.",
            "Deadlines do not pause for silence. Never let an outreach cycle consume a statutory or court date."
          ],
          upl: [
            "You may tell the client what the firm needs and by when. You may not advise them on what silence does to their legal rights, and you may not say representation will end. Withdrawal is the attorney's decision at Step 5."
          ]
        },
        show: {
          caption: "The No Contact Protocol: all six steps; this lesson covers 1–3",
          type: "process",
          steps: [
            ["Internal Review", "Case status, live deadlines, date of last contact; approved channels confirmed."],
            ["Contact Attempts", "2+ phone attempts → email and text → emergency contact → certified mail or letter."],
            ["Team Notification", "Escalate to attorney/supervisor, document in the CMS, assess SOL and hearing dates."],
            ["Final Warning Letter", "Certified mail AND email; 7–14 day deadline. (Next lesson.)"],
            ["Decision Point", "The attorney may file a Notice of Withdrawal or a Motion to Withdraw. (Next lesson.)"],
            ["File Closure", "“No response – withdrew per protocol”; all proof of attempts retained. (Next lesson.)"]
          ]
        },
        ops: [
          ["Client misses a scheduled contact or appointment", "Step 1: review case status, deadlines and the last contact date", "CMS → Case Summary", "Live deadlines identified before outreach begins"],
          ["Internal review complete", "Step 2: work the channel ladder; log each attempt", "CMS → Communications Log", "2+ phone attempts, then email and text, each with date, time, channel, outcome"],
          ["Channel ladder exhausted", "Step 3: notify Atty. Thorne and assess deadline impact on John Doe's file", "CMS → Tasks → Escalate", "Escalation documented; SOL (02/06/2028) and any hearing dates assessed"]
        ],
        best: [
          "Set follow-up reminders the moment a request goes out.",
          "Offer the client an easy way to respond: a call window, text, an upload link.",
          "Pitfall: letting a file sit because “we're waiting on the client” without logging attempts.",
          "Pitfall: blaming the client for delays that are really process gaps."
        ],
        sources: ["LSH Claims Specialist: No Contact Protocol, Steps 1–3", "D1#11", "D1#9", "D5 agenda: MIA Clients"],
        rubric: {
          ai: [
            ["Step sequence", 20, "Steps 1–3 in order; internal review before outreach"],
            ["Channel ladder", 20, "2+ phone attempts, then email and text, not repeats on one channel"],
            ["Log completeness", 20, "Every attempt carries date, time, channel and outcome"]
          ],
          trainer: [
            ["Deadline awareness", 20, "The Step 3 impact check names the running SOL, not just “escalated to attorney”"],
            ["Boundary discipline", 20, "No withdrawal threat; no statement that the case will be closed"]
          ]
        },
        notes: [
          "Lead with purpose, not procedure: the protocol protects the client's file and the firm. Trainees who see it as chasing a client miss why the record matters.",
          "Step 1 is the step everyone skips; they start dialling. Ask: “What deadline is running on this file right now?” If they can't answer, they aren't ready to make the call.",
          "Channel versus volume is the most often failed point. Two voicemails on the same number clears the phone rung and nothing more. Say it twice.",
          "The emergency contact was collected at intake for exactly this moment. Intake decisions pay off here."
        ]
      },

      {
        kind: "activity", id: "d1m2-a1",
        title: "Multi-Channel Outreach Logging",
        topic: "Skill Activity 1 — build a defensible record",
        visual: "A CMS Communications Log as a table across the full slide width, four rows pre-filled as worked examples and four blank rows outlined in orange for the trainee. Columns: Date · Time · Channel · Outcome · Next action. In the right margin, a vertical coverage tracker of four chips (Phone ×2, Email, SMS, Emergency contact), each grey until its rung is cleared, then orange. Bottom strip, in danger red: a BAD entry, “called client, no answer”, with no date, time or channel, annotated with what is missing.",
        act: {
          scenario: "John Doe has not responded for six days. He missed a scheduled check-in call and his treatment has not begun. Two voicemails have been left on his mobile. Nothing has been logged. An emergency contact was collected at intake.",
          prompt: "Run the No Contact Protocol on John Doe's file. Start with the Step 1 internal review: name the deadlines that are live right now. Reconstruct the attempts already made, then carry the Step 2 channel ladder forward. Log every attempt with date, time, channel and outcome, and record the next action with its due date. Finally, state whether Step 3 team notification is warranted and what case impact you would report.",
          tool: "CMS → Case Summary · CMS → Communications Log",
          output: "A completed Step 1 review and an unbroken, contemporaneous Step 2 outreach log.",
          checkpoints: [
            "Step 1 done: case status, live deadlines and the date of last contact reviewed before any outreach",
            "Earlier voicemails logged with date, time and channel",
            "Phone rung cleared with at least two attempts",
            "Email and SMS both attempted, not repeats on the phone",
            "Emergency contact used as an approved channel",
            "Every entry carries date, time, channel and outcome",
            "Next action recorded with a due date",
            "Step 3 impact names the running SOL (02/06/2028) and the treatment that has not started",
            "No entry threatens withdrawal or case closure"
          ]
        },
        ops: [
          ["Six days without contact", "Step 1 internal review", "CMS → Case Summary", "Live deadlines listed"],
          ["Review complete", "Reconstruct and continue the log", "CMS → Communications Log", "Unbroken log, distinct channels"],
          ["Ladder cleared, no answer", "Step 3 escalation with case impact", "CMS → Tasks → Escalate", "Atty. Thorne notified; impact recorded"]
        ],
        best: [
          "Write each entry as if a supervisor will audit it six months from now.",
          "Pitfall: “called client, no answer” with no date, time or channel.",
          "Pitfall: three calls to one mobile reported as three channels."
        ],
        sources: ["LSH Claims Specialist: No Contact Protocol, Step 2", "D1#11"],
        rubric: {
          ai: [
            ["Field completeness", 20, "No entry missing date, time, channel or outcome"],
            ["Ladder progression", 20, "2+ phone attempts, then email and SMS: genuinely different rungs"],
            ["Step 1 evidence", 10, "Internal review documented before outreach"],
            ["Impact assessment", 10, "SOL correctly identified as 02/06/2028"]
          ],
          trainer: [
            ["Record defensibility", 25, "Would this log hold up if the file were reviewed six months from now?"],
            ["Professional tone", 15, "Entries are factual and neutral; no editorialising about the client"]
          ]
        },
        notes: [
          "Start by having them read the red BAD entry aloud. “Called client, no answer” is what most of them would have written.",
          "Watch for trainees who skip Step 1 and start dialling. Ask what deadline is running before you let them log anything.",
          "The emergency contact is the rung most trainees forget. It was collected at intake for this.",
          "John Doe's treatment still hasn't begun. This silence is also what becomes the 14-Day Gap; tie it back to the 14-Day Gap flag set in Claim Set Up."
        ]
      },

      {
        kind: "lesson", id: "d1m2-l2", compact: true,
        title: "Final Warning Letter & the Skip-Trace Trigger",
        topic: "No Contact Protocol Steps 4 to 6, and when the search begins",
        visual: "Two panels. Left: the Final Warning Letter on white letterhead with a navy band, four required elements called out by orange numbered badges — ① the earlier attempts, itemized ② a response deadline of 7–14 days ③ notice of potential withdrawal ④ how to respond. Above the letter, a chip pair reads CERTIFIED MAIL + EMAIL, joined by a bold AND, because both are required. Right: the Step 5 decision fork on a pale ground. Root, navy: “Response within the deadline?” Yes (green) → RESUME FILE. No (orange) → a three-chip AND gate (ladder exhausted · letter sent · deadline expired) ending in two outcomes: TRIGGER SKIP-TRACE and ATTORNEY DECISION POINT. Draw the gate as a gate, never as a bullet list.",
        tell: {
          why: "The Final Warning Letter is the last low-cost step before the firm either spends money to find someone or moves to withdraw. It has to be specific enough to get an answer, and documented enough to justify whichever comes next.",
          rules: [
            "Step 4, the Final Warning Letter, goes by certified mail AND email. Both, not either.",
            "It states the earlier attempts, a response deadline of 7 to 14 days, and notice of potential withdrawal.",
            "Send it to the client's current and correct address. Confirm the address first; a letter to a stale address proves nothing.",
            "Step 5, Decision Point: if the client is still unresponsive, the attorney may file a Notice of Withdrawal or a Motion to Withdraw, under firm and court rules. That is counsel's decision.",
            "Step 6, File Closure: mark the file “No response – withdrew per protocol” and keep the communications and the proof of every attempt.",
            "Skip-tracing starts only when all three are true: the contact ladder is exhausted, the letter has been sent, and its deadline has passed.",
            "Skip-tracing is authorized by counsel. Escalate with the complete log attached.",
            "Keep the file moving in parallel. Records requests, coverage verification and deadline tracking do not pause while outreach runs."
          ],
          upl: [
            "The letter may state the firm's requirements, its deadline and that withdrawal is possible. It may not characterise the strength of the claim or advise the client on what silence does to their legal rights. Only the attorney decides, and tells the client, that representation is ending."
          ]
        },
        show: {
          caption: "The three-criteria gate: all must be true before the search begins",
          type: "threebox",
          items: [
            ["Contact ladder exhausted", "2+ phone attempts, email, text and the emergency contact, all attempted and logged."],
            ["Final Warning Letter sent", "Certified mail AND email, to a confirmed address, stating the 7–14 day deadline."],
            ["Deadline expired", "The response window has passed with no contact from the client."]
          ]
        },
        ops: [
          ["Step 3 escalation made, still no response", "Draft the Final Warning Letter with a 7–14 day deadline", "Action Plan Editor → Warning letter template", "Earlier attempts itemized; deadline and withdrawal notice present"],
          ["Letter ready", "Confirm the current address; send by certified mail AND email", "CMS → Documents → Outgoing", "Both channels used and logged; certified receipt kept"],
          ["Response deadline expires", "Verify all three criteria; escalate to Atty. Thorne for Skip-Trace authority and the Step 5 decision", "CMS → Tasks → Escalate", "All three criteria evidenced in the log first"]
        ],
        best: [
          "Itemize the attempts with dates; “we have tried several times” is not evidence.",
          "Ask your in-house help to confirm an address you can't verify.",
          "Pitfall: triggering a Skip-Trace on the first criterion alone.",
          "Pitfall: writing “we are withdrawing” in a letter the attorney has not approved."
        ],
        sources: ["LSH Claims Specialist: No Contact Protocol, Steps 4–6; Withdrawal Letters", "D5 agenda: MIA Clients"],
        rubric: {
          ai: [
            ["Letter elements", 25, "Attempts itemized, 7–14 day deadline, withdrawal notice, response method"],
            ["Dual delivery", 15, "Certified mail and email both used and logged"],
            ["Criteria evidence", 20, "All three Skip-Trace criteria shown in the log"]
          ],
          trainer: [
            ["Letter tone", 20, "Firm, clear and not threatening; a worried client would respond to it"],
            ["Authority discipline", 20, "Withdrawal and Skip-Trace both escalated for counsel's decision"]
          ]
        },
        notes: [
          "Hold the room on the AND gate. Trainees reliably trigger the search on the first criterion alone, which spends the firm's money early and weakens the record.",
          "Both delivery channels are required. Ask why: certified mail proves delivery, email gets a response.",
          "Draw the Step 5 line hard: the CM assembles the record, the attorney decides to withdraw.",
          "Day 5 returns to this with advanced skip-tracing, process servers and certified notice. Today is the trigger; Day 5 is the execution."
        ]
      },

      {
        kind: "activity", id: "d1m2-a2",
        title: "Final Warning Letter Drafting",
        topic: "Skill Activity 2 — write the letter that gets answered",
        visual: "A split drafting view. Left two-thirds: the live letter draft on white letterhead, the four required elements highlighting in pale orange as they are completed, with a completeness meter above the page from 0/4 to 4/4. A chip pair in the header (CERTIFIED MAIL + EMAIL) must both be ticked before the draft can be sent. Right third: a UPL guard-rail panel on a danger-bordered card listing banned phrases in red strikethrough — “you will lose your case,” “we are withdrawing,” “your claim will be worth less” — each with a compliant navy rewrite directly beneath it.",
        act: {
          scenario: "John Doe has been unreachable for eleven days. The phone rung is cleared, emails and texts have been sent and the emergency contact has been tried, all logged. Step 3 escalation has been made to Atty. Thorne. Treatment still has not begun.",
          prompt: "Draft the Step 4 Final Warning Letter to John Doe. Itemize the earlier attempts, set a response deadline inside the 7–14 day window, give notice of potential withdrawal, and state how he should respond. Keep every sentence inside the UPL boundary: nothing on the strength of his claim or the legal consequences of silence, and nothing that announces withdrawal as decided. Then record what must be true before skip-tracing can start, and whose authority the Step 5 decision needs.",
          tool: "Action Plan Editor → Warning letter template",
          output: "A send-ready Final Warning Letter with both deliveries logged, and a recorded escalation.",
          checkpoints: [
            "Firm identification and the file reference present",
            "Date of loss stated as 02/06/2026",
            "Earlier attempts itemized with dates",
            "Response deadline inside the 7–14 day window, stated as a date",
            "Notice of potential withdrawal, as possible, not decided",
            "How to respond, with at least two channels",
            "Certified mail AND email both recorded",
            "Current address confirmed before sending",
            "No statement about claim value, legal consequences or settled representation status",
            "Skip-Trace criteria recorded; Step 5 authority noted as Atty. Thorne's"
          ]
        },
        ops: [
          ["Eleven days, Step 3 made", "Draft the letter", "Action Plan Editor", "Four elements present"],
          ["Draft complete", "Send by certified mail and email", "CMS → Documents → Outgoing", "Both logged"],
          ["Letter sent", "Calendar the response deadline", "CMS → Calendar", "Deadline date on the calendar"]
        ],
        best: [
          "Urgent without threatening: say what is needed and by when.",
          "Pitfall: a deadline of “as soon as possible.”",
          "Pitfall: crossing into legal consequence (“you will lose your case”)."
        ],
        sources: ["LSH Claims Specialist: Final Warning Letter; sample unresponsive-client letters"],
        rubric: {
          ai: [
            ["Element completeness", 20, "All four elements; the deadline is a date inside 7–14 days"],
            ["Case accuracy", 10, "File reference and DOL correct"],
            ["Dual delivery", 15, "Certified mail and email both recorded"],
            ["Banned-phrase scan", 15, "No prohibited phrase in the draft"]
          ],
          trainer: [
            ["Tone and clarity", 25, "Would a worried client read this and call back? Firm without being cold."],
            ["UPL judgment", 15, "Withdrawal framed as possible, not announced; no legal-consequence advice"]
          ]
        },
        notes: [
          "The hard part is a letter that is urgent but not threatening. Most first drafts fail one way or the other.",
          "“Itemize” means list the attempts with dates.",
          "Read the banned and compliant pairs aloud before they draft. It saves a full rewrite.",
          "Have two trainees swap drafts and mark each other's against the four elements and the dual delivery before submitting."
        ]
      },

      {
        kind: "check", id: "d1m2-kc",
        title: "MIA Escalation Knowledge Check",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split: cream question panel above, navy CM Self-Summary card below-left with the 1–5 skill ladder below-right, and the 60/40 strip with the separate red UPL gate on the far right. Unique to this module: between the question panel and the summary card, a horizontal NO CONTACT PROTOCOL CHECKLIST strip of all six steps as checkboxes with their required actions beneath, so the trainee self-audits the protocol before answering.",
        check: {
          questions: [
            "Set out all six steps of the No Contact Protocol in order, with the required action at each step.",
            "State the three purposes the protocol serves, and explain which of them protects the firm rather than the client.",
            "A colleague logs three voicemails to the client's mobile on three days and reports the contact ladder exhausted. Explain what is wrong and what the log should show instead."
          ],
          summary: [
            "Summarize what you learned about the firm's duty to a client who has gone silent, and what the record has to show.",
            "Articulate your strategy: John Doe is on day eleven and still not treating. What do you do next, in what order, and why that order?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Running the No Contact Protocol's channel ladder",
            "Keeping a contemporaneous, defensible Communications Log",
            "Drafting a Final Warning Letter that gets a response",
            "Applying the three-criteria Skip-Trace gate",
            "Keeping the file moving while outreach runs",
            "Holding the line between my role and the attorney's decision to withdraw"
          ]
        },
        best: [
          "Use the six-step checklist before you answer.",
          "Pitfall: an answer that warns the client about their case."
        ],
        sources: ["LSH Claims Specialist: No Contact Protocol", "D1#11"],
        rubric: {
          ai: [
            ["Protocol accuracy", 20, "All six steps in order with the right actions"],
            ["Criteria accuracy", 15, "All three Skip-Trace criteria stated as an AND gate"],
            ["Letter requirements", 15, "Certified mail and email; 7–14 day window"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Risk identification", 15, "Names the running SOL, the hardening Treatment Gap and the stalled claims work"],
            ["Role boundary", 10, "Reserves the withdrawal decision to counsel"],
            ["UPL rewrite quality", 5, "The rewrite is compliant and still useful"],
            ["Self-Summary & calibration", 10, "Specific, honest, and defensible against the score"]
          ]
        },
        notes: [
          "Question 2 is easy to answer shallowly. Protection from liability is the purpose trainees omit, and it is why the record is built the way it is.",
          "Question 5 is the integration question: the running SOL, the hardening Treatment Gap, and the claims work that must go on anyway.",
          "Question 7 is the UPL gate in miniature. A trainee who can't rewrite it compliantly isn't ready for client contact.",
          "The gap they are watching build here is the same 14 days defense counsel will ask John Doe about in deposition on Day 5."
        ]
      }

      ]
    },

    /* ---------- DAY 1 · MODULE 3 ---------- */
    {
      n: 3, id: "d1m3",
      title: "Property Damage Handling & Onboarding Directions",
      about: "The client's standing instructions, rental authorization, Repair Estimates and the total-loss question, and the packet that sets expectations on day one.",
      quiz: [
        {q: "The Property Damage carve-out in the LOR lets the adverse carrier talk to the client about:",
         opts: ["Injuries and treatment", "The Property Damage claim only", "Anything except settlement figures", "A Recorded Statement"],
         a: 1, r: "Only the resolution of the Property Damage claim. Anything else routes to the firm."},
        {q: "On a rental vehicle, whose policy is usually primary?",
         opts: ["The rental company's self-insurance", "The renter's own personal auto policy", "The at-fault driver's BI", "The client's Health Plan"],
         a: 1, r: "The rental company usually steps in only after the personal policy denies, in writing."},
        {q: "Actual cash value (ACV) is:",
         opts: ["What is still owed on the loan", "The vehicle's pre-loss market value", "The cost of a new replacement", "The Repair Estimate plus storage"],
         a: 1, r: "Pre-loss market value, not the loan balance and not replacement with new."},
        {q: "Which document best proves hidden structural damage?",
         opts: ["The initial insurance estimate", "The body shop's supplementals on the final bill", "The client's photos of the interior", "The tow receipt"],
         a: 1, r: "Compare the estimate with the final bill: supplementals are often the best proof of hidden structural damage."},
        {q: "Before any Property Damage outcome is discussed with John Doe, what must be in the file?",
         opts: ["The carrier's verbal offer", "The written Repair Estimate", "The rental agreement", "The client's own estimate"],
         a: 1, r: "No estimate, no position: get the written Repair Estimate before discussing any outcome with the client."},
        {q: "Keystone Mutual's adjuster asks John Doe for a Recorded Statement about the crash. What has the firm told him to do?",
         opts: ["Give it, briefly", "Give it, but only about the Civic", "Give no Recorded Statement: all adverse contact routes through the firm", "Give it if the adjuster promises a quick settlement"],
         a: 2, r: "The client gives no Recorded Statement to the adverse carrier. Only the Property Damage claim is carved out; injuries and the facts of the loss route to the firm."},
        {q: "A vehicle is a Total Loss when:",
         opts: ["The client no longer wants it", "The cost to repair reaches the carrier's threshold measured against its actual cash value", "Any frame damage is found", "The repair takes longer than 30 days"],
         a: 1, r: "Confirm the threshold basis the carrier is applying, in writing. Actual cash value is the pre-loss market value."},
        {q: "John Doe is without a car while the Civic is in the shop. Loss of Use is:",
         opts: ["Included in the repair payment", "Claimable for each day without a vehicle, measured by a comparable rental, separately from the repair or ACV payment", "Owed only if the car is a Total Loss", "Paid by his Health Plan"],
         a: 1, r: "Loss of Use is a separate claim. Asserting it is counsel's position, and the governing rule is confirmed for the file."},
        {q: "The Civic sits in storage while its valuation is disputed. Why settle its disposition quickly?",
         opts: ["Storage and towing accrue daily and eat the recovery", "Property Damage must be claimed within 30 days", "The body shop will sell it", "The carrier stops paying the rental at once"],
         a: 0, r: "Storage and towing charges accrue daily. Document and escalate a disputed valuation; don't argue it ad hoc with the adjuster."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d1m3-l1",
        title: "Client Do's and Don'ts & Rental Authorization",
        topic: "Protecting the claim from the client's own good intentions",
        visual: "A balanced two-column DO / DON'T board on the upper two-thirds, green-bordered left and red-bordered right, with matched pairs on the same line so each DON'T sits opposite the DO it replaces. Each row carries a small icon in the gutter. Lower third: a rental authorization flow of four connected chips — WHOSE POLICY IS PRIMARY? → WHO AUTHORIZES? → DAILY RATE CAP → DURATION LIMIT — with an orange tag under the last two: “uncovered days are the client's cost.”",
        tell: {
          why: "Most self-inflicted damage to an injury claim happens in the first two weeks, before the client has been told what not to do: a casual Recorded Statement, a missed appointment or a social-media post becomes part of the record. The Case Manager gives the instructions; what any of it means for the claim is Atty. Thorne's to explain.",
          rules: [
            "The client gives no Recorded Statement to the adverse carrier. All adverse contact routes through the firm.",
            "The client starts treatment, keeps every appointment and tells you about any barrier (transport, cost, work) before a visit is missed. Explain the process, not the stakes: what a missed visit means for the claim is Atty. Thorne's to explain.",
            "The client posts nothing about the collision, the injuries or their activities.",
            "The client signs no release, authorization or settlement document from any carrier until the firm has reviewed it.",
            "The client keeps every receipt and out-of-pocket expense, including mileage to appointments and household help. Only what is documented can be recovered.",
            "Property Damage is the one carve-out from the no-direct-contact rule. The LOR lets the adverse carrier talk to the client about the Property Damage claim only.",
            "On a rental, the renter's own personal auto policy is usually primary. The rental company is usually self-insured and steps in only after the personal policy denies, in a formal written denial.",
            "Confirm rental authorization before the client collects a vehicle: who authorizes it, the daily rate cap and the duration limit. Check for a rental reimbursement endorsement on the policy.",
            "The client reports any change of address, phone number or treating provider at once."
          ],
          upl: [
            "You may deliver the firm's standing instructions and explain the process. You may not tell the client what their conduct will do to the value of the claim; give the instruction and route the question to Atty. Thorne.",
            "The carve-out is narrow. If the adverse carrier uses a Property Damage call to ask about injuries, treatment or the facts of the loss, the call stops and routes to the firm."
          ]
        },
        show: {
          caption: "Matched pairs: what to do, and the mistake it prevents",
          type: "split",
          do: [
            "Route every adverse carrier call to the firm.",
            "Start treatment promptly and attend every appointment.",
            "Keep receipts for every accident-related cost.",
            "Confirm rental authorization, rate cap and duration first.",
            "Report any change of address, phone or provider at once."
          ],
          dont: [
            "Give a Recorded Statement to the other side.",
            "Let treatment lapse, or stop because you feel better.",
            "Assume an undocumented expense can be claimed later.",
            "Collect a rental before coverage is confirmed in writing.",
            "Post about the collision, the injuries or your activities."
          ]
        },
        ops: [
          ["Retainer signed", "Deliver the standing instructions and log delivery", "CMS → Onboarding", "Delivery logged with date and method"],
          ["Client asks about a rental", "Confirm the primary policy, the authorization, the rate cap and the duration", "CMS → Property Damage", "All rental parameters recorded before collection"],
          ["Adverse carrier calls the client directly", "Instruct the client to route it to the firm; log the contact", "CMS → Communications Log", "No Recorded Statement; contact logged"]
        ],
        best: [
          "Educate the client on why consistent treatment matters, not just that it does.",
          "Use active listening; a client who feels heard follows instructions.",
          "Pitfall: explaining why a Recorded Statement hurts the claim; that is legal advice. Give the instruction."
        ],
        sources: ["D1#28", "D1#44", "LSH Claims Specialist: LOR Property Damage carve-out, rental coverage hierarchy, documents to support the claim"],
        rubric: {
          ai: [
            ["Instruction coverage", 25, "All standing instructions present, including the Property Damage carve-out"],
            ["Rental hierarchy", 20, "Personal policy primary; written denial before rental-company self-insurance"],
            ["Delivery logged", 15, "Date and method of delivery recorded"]
          ],
          trainer: [
            ["Client-facing clarity", 25, "Delivered so a stressed client would actually follow them"],
            ["UPL boundary", 15, "Instruction given without opining on claim value or legal effect"]
          ]
        },
        notes: [
          "Run the matched pairs as call-and-response: read a DON'T, have the room give you the DO.",
          "The treatment instruction matters most on this file. John Doe's gap is already forming; say so.",
          "Rental is where clients get hurt financially. Uncovered days come out of their pocket, and they will blame the firm if nobody told them the limit.",
          "Watch for trainees explaining why a Recorded Statement hurts the claim. That slides into legal advice; the instruction is the deliverable."
        ]
      },

      {
        kind: "activity", id: "d1m3-a1",
        title: "Client Onboarding Direction Packet",
        topic: "Skill Activity 1 — assemble what the client gets on day one",
        visual: "An exploded packet: a central navy folder with six document cards fanned around it in a semicircle, each numbered with an orange badge — ① Do's and Don'ts ② Treatment directions ③ Property Damage and rental ④ Communication protocol ⑤ Document retention ⑥ Firm contacts and escalation path — each showing two or three bullet previews in small type. Beneath the fan, a delivery bar of three chips: PREPARED → DELIVERED → LOGGED, the third noting the required date and method.",
        act: {
          scenario: "John Doe's retainer is signed and the matter is open in the CMS. Nothing has been sent to him yet, and he has already had one call from Robert Smith's carrier.",
          prompt: "Assemble John Doe's onboarding Direction Packet. Build all six sections, populate each with the firm's standing instructions, and make the Property Damage section specific to this file. Given that the adverse carrier has already called him, state which instruction is now most urgent and how you will confirm he has understood it. Then log delivery.",
          tool: "CMS → Onboarding → Direction Packet",
          output: "A complete, delivered and logged onboarding packet specific to John Doe's file.",
          checkpoints: [
            "All six packet sections present and populated",
            "The standing instructions all appear in the Do's and Don'ts",
            "Treatment direction stated, given that treatment has not begun",
            "Property Damage section names the rental parameters to confirm",
            "Communication protocol routes all adverse carrier contact to the firm",
            "Firm contacts list Atty. Elijah Thorne as Lead Counsel",
            "Delivery logged with date and method",
            "The adverse-contact instruction named as the urgent one, with a confirmation step"
          ]
        },
        ops: [
          ["Retainer signed", "Assemble the six sections", "CMS → Onboarding", "All six present"],
          ["Adverse carrier has called", "Prioritise the communication instruction", "Phone · CMS → Communications Log", "Client confirms he understood"],
          ["Packet ready", "Deliver and log", "CMS → Onboarding", "Date and method recorded"]
        ],
        best: [
          "A confirmation step means more than sending: ask how you will know he read it.",
          "Pitfall: a generic packet that ignores what has already happened on the file."
        ],
        sources: ["D1#28", "D1#44", "LSH Claims Specialist: client communication protocol"],
        rubric: {
          ai: [
            ["Section completeness", 20, "All six sections present"],
            ["Instruction completeness", 20, "All standing instructions appear"],
            ["Counsel named correctly", 10, "Atty. Elijah Thorne as Lead Counsel"],
            ["Delivery logged", 10, "Date and method recorded"]
          ],
          trainer: [
            ["Prioritisation", 25, "Named the adverse-contact instruction as urgent and built a real confirmation step"],
            ["Client usability", 15, "Usable by a layperson under stress"]
          ]
        },
        notes: [
          "The scenario detail, that the carrier has already called, is the graded judgment. A generic packet misses the point.",
          "Have them read their treatment direction aloud. If it doesn't create urgency about starting care, it won't prevent the gap.",
          "Role-play receiving one packet as John Doe: confused, in pain, and already contacted by the other side."
        ]
      },

      {
        kind: "lesson", id: "d1m3-l2",
        title: "Repair Estimates, Total Loss & Loss of Use",
        topic: "Repair, or total? And what the client is owed either way",
        visual: "A horizontal threshold gauge dominates: a long bar running from pale on the left to orange and then navy on the right, with a bold vertical THRESHOLD marker about three-quarters along. Left of the marker, REPAIR — carrier pays to fix; right of it, TOTAL LOSS — carrier pays ACV. A repair-estimate chip and an ACV chip sit above the bar to show the comparison. Below, a three-step strip: ① Estimate vs. final bill ② Compare against ACV ③ Confirm the carrier's basis in writing. Bottom-right, a navy card lists what is owed either way: storage, towing, Loss of Use.",
        tell: {
          why: "Property Damage settles long before the injury claim, and it is the client's first test of whether the firm is competent. It is also physical evidence of how hard the impact was, so audit it as carefully as the medicals.",
          rules: [
            "Get the written Repair Estimate before discussing any outcome with the client. No estimate, no position.",
            "Give the carrier a defined window to inspect the vehicle (the firm's standard is 5 days from the letter) and record the date it opens.",
            "Compare the insurance estimate with the final body shop bill. Supplementals are often the best proof of hidden structural damage.",
            "Audit the photos for a clear point of impact, including the undercarriage and frame.",
            "A vehicle is a Total Loss when the cost to repair reaches the carrier's threshold measured against its actual cash value. Confirm the threshold basis the carrier is applying, in writing.",
            "Actual cash value is the pre-loss market value: not what is owed on the loan, and not the cost of a new replacement. Verify the Valuation Report (e.g. CCC One) so the client isn't lowballed.",
            "Courts value Property Damage on the “lesser of” rule: the cost of repair, or the drop in market value from before to after the loss.",
            "Storage and towing accrue daily. Settle the disposition quickly or the charges eat the recovery.",
            "Loss of Use is claimable for each day the client is without a vehicle, measured by a comparable rental, separately from the repair or ACV payment. The authority is state law (for example, Nevada: Dugan v. Gotsopoulos, 117 Nev. 285 (2001), cited in the firm's own LOR template); confirm the governing rule for the file.",
            "Document and escalate a disputed valuation; don't argue it ad hoc with the adjuster."
          ],
          upl: [
            "You may gather estimates, report figures and explain the process. You may not advise the client whether to accept a valuation or tell them what their vehicle is legally worth. Asserting the loss-of-use claim is counsel's position."
          ]
        },
        show: {
          caption: "Repair or total, and what the client is owed either way",
          type: "table",
          head: ["Question", "What you verify", "What it changes"],
          rows: [
            ["Is there a written estimate?", "The estimate exists and is in the file", "Without it, nothing is discussed with the client"],
            ["Estimate vs. final bill", "Supplementals on the body shop's final bill", "Hidden structural damage; impact severity for the injury claim"],
            ["Repair cost vs. ACV", "The repair figure against pre-loss market value", "Whether the carrier repairs or declares a Total Loss"],
            ["What basis is the carrier using?", "The threshold and the Valuation Report, in writing", "Which side of the line the vehicle falls on"],
            ["How long in storage?", "Daily storage and towing", "Delay erodes the recovery"],
            ["Is the client without transport?", "The dates without a vehicle", "Loss of Use, claimed separately"]
          ]
        },
        ops: [
          ["Repair Estimate received", "Log it; compare with ACV and, later, the final bill", "CMS → Property Damage", "Estimate on file; comparison recorded"],
          ["Carrier states a disposition", "Confirm the threshold basis and the Valuation Report in writing", "CMS → Property Damage → Correspondence", "Basis confirmed, not assumed"],
          ["Client is without a vehicle", "Record the dates and open the loss-of-use claim", "CMS → Property Damage → Loss of Use", "Dates recorded; claimed separately"]
        ],
        best: [
          "Supplementals are often the best proof of hidden structural damage.",
          "Verify the Valuation Report so the client isn't lowballed on the vehicle's value.",
          "Pitfall: working only from the initial estimate.",
          "Pitfall: treating Property Damage as “just the car”; it is evidence for the injury claim."
        ],
        sources: ["D2#6", "D5#34", "D5#35", "LSH Claims Specialist: 5-day inspection window, Loss of Use, tow and storage"],
        rubric: {
          ai: [
            ["Estimate logged", 15, "Written estimate recorded before any client discussion; inspection window dated"],
            ["ACV comparison", 25, "Repair figure against pre-loss market value, not the loan balance"],
            ["Loss of Use opened", 20, "Dates recorded and claimed separately from the repair or ACV payment"]
          ],
          trainer: [
            ["Threshold reasoning", 25, "Knows what ACV is and is not, and confirms the basis rather than assuming it"],
            ["Client handling", 15, "Explained the process without advising on acceptance or legal value"]
          ]
        },
        notes: [
          "The recurring misconception is that ACV equals the loan balance. Correct it the moment it appears.",
          "Storage is the silent cost. Ask: “Who is paying for every day this car sits?”",
          "Loss of Use is the most often forgotten item, and on this file it matters: John Doe needs to get to treatment he hasn't started.",
          "Day 5 reopens this with Diminished Value and the Property Damage dispute lab. Today is the threshold; Day 5 is the fight."
        ]
      },

      {
        kind: "activity", id: "d1m3-a2",
        title: "Onboarding Direction Assignment in System",
        topic: "Skill Activity 2 — turn directions into tracked tasks",
        visual: "A CMS task board in three columns — ASSIGNED · DUE · VERIFIED — with direction cards moving across them. Each card carries an owner chip (Client or CM), a due date and a small verification icon. Four cards are placed as examples; four wait in the left column for the trainee's owners and dates. One card is deliberately mis-assigned, with the client as owner of a task only the firm can do, and carries a red overdue flag; trainees must catch and reassign it. A slim legend in the right margin maps chip colour to owner.",
        act: {
          scenario: "John Doe's onboarding packet has been delivered and logged. The directions now need to become tracked obligations, not a document he was sent once.",
          prompt: "Assign John Doe's onboarding directions in the system as tracked tasks. For each, set the owner, the due date and how it will be verified. One staged card has the wrong owner: find it, reassign it, and record why it could never have been the client's task. Then schedule the follow-up that confirms he has started treatment.",
          tool: "CMS → Tasks",
          output: "A tracked task set with correct owners, dates and verification methods.",
          checkpoints: [
            "Every direction has an owner",
            "Every task has a due date",
            "A verification method recorded for each task",
            "The mis-assigned card found and reassigned to the firm",
            "The reason for reassignment recorded",
            "Treatment-start follow-up scheduled",
            "No task left without a date"
          ]
        },
        ops: [
          ["Packet delivered", "Turn each direction into a task", "CMS → Tasks", "Owner, date, verification on each"],
          ["Mis-assigned task found", "Reassign to the firm with the reason", "CMS → Tasks", "Reason recorded"],
          ["Treatment not yet started", "Schedule the treatment-start follow-up", "CMS → Tasks · Calendar", "Follow-up dated"]
        ],
        best: [
          "Use task trackers so a gap in treatment is visible the day it starts.",
          "Ask of every task: how will you know this happened?",
          "Pitfall: tracking tasks without confirming they were done correctly."
        ],
        sources: ["D1#3", "D1#16", "D1#44"],
        rubric: {
          ai: [
            ["Assignment completeness", 20, "Owner, due date and verification method on every task"],
            ["Mis-assignment caught", 25, "The wrongly owned card found and reassigned"],
            ["Follow-up scheduled", 15, "Treatment-start confirmation task with a date"]
          ],
          trainer: [
            ["Ownership judgment", 25, "Knows which obligations can never be handed to the client"],
            ["Tracking discipline", 15, "Dates are realistic and verification methods are actually verifiable"]
          ]
        },
        notes: [
          "The planted mis-assignment is the graded element. Don't hint at which card it is.",
          "Press on verification: “How will you know this happened?” A task with no verification is a hope, not a task.",
          "The treatment follow-up is the hinge into Day 2. John Doe's gap becomes undeniable there; this task is what would have caught it."
        ]
      },

      {
        kind: "check", id: "d1m3-kc",
        title: "PD & Onboarding Knowledge Audit",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split (cream question panel, navy Self-Summary card, 1–5 ladder, 60/40 strip with the separate red UPL gate). Module-specific addition: a PD AUDIT STRIP between the panels, a five-cell horizontal checklist — Estimate · Final bill · ACV comparison · Storage/towing · Loss of Use — that the trainee ticks as a self-audit before answering.",
        check: {
          questions: [
            "List the firm's standing instructions for a new personal injury client and, for each, the specific harm it prevents.",
            "Before John Doe collects a rental, what must be confirmed, and whose policy is usually primary? What happens to days outside the authorization?",
            "Explain what actual cash value means, what it does not mean, and why confusing it with the loan balance misleads the client."
          ],
          summary: [
            "Summarize what you learned about protecting a claim in its first two weeks, and whose job that protection is.",
            "Articulate your strategy: John Doe has the packet, the adverse carrier has already called him, and he hasn't started treatment. What do you do next and why?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Delivering client instructions a layperson will follow",
            "Confirming rental coverage, authorization, rate cap and duration",
            "Comparing a Repair Estimate and final bill against ACV",
            "Identifying storage, towing and loss-of-use entitlements",
            "Turning directions into tracked, verifiable tasks",
            "Holding the UPL boundary while explaining Property Damage"
          ]
        },
        best: [
          "The right priority on this file is treatment.",
          "Pitfall: leading with the rental when the client hasn't started treatment."
        ],
        sources: ["D2#6", "D5#35", "D1#44"],
        rubric: {
          ai: [
            ["Instruction recall", 20, "Standing instructions listed with the harm each prevents"],
            ["Rental", 15, "Primary policy, authorization, rate cap and duration named"],
            ["ACV definition", 15, "Pre-loss market value, expressly not the loan balance"],
            ["Entitlement completeness", 10, "Storage, towing and Loss of Use all identified"]
          ],
          trainer: [
            ["Scenario handling", 15, "Routes the contact correctly and logs it, without legal explanation to the client"],
            ["Strategic articulation", 15, "Prioritises treatment, given the forming gap"],
            ["Self-Summary quality", 5, "Specific and honest"],
            ["Self-rating calibration", 5, "Defensible against the score"]
          ]
        },
        notes: [
          "Question 3 separates trainees who memorised the term from those who understand it. Expect the loan-balance error.",
          "Question 6 should surface the treatment direction: an untracked treatment instruction is exactly how a 14-day gap happens.",
          "The strategy prompt has one right priority, treatment. Anyone who leads with the rental has mis-ranked the risks."
        ]
      }

      ]
    },

    /* ---------- DAY 1 · MODULE 4 ---------- */
    {
      n: 4, id: "d1m4",
      title: "Intake Operations & Action Plan Editor",
      about: "The acceptance decision and the Three-Pillar Case Plan: structuring it, flagging the 14-Day Gap, and routing it for attorney review.",
      quiz: [
        {q: "Once the claim is set up, the Case Plan is typically filed within:",
         opts: ["7 days", "30–60 days, depending on the state", "6 months", "After Maximum Medical Improvement"],
         a: 1, r: "Often 30–60 days depending on the state. Docket the date."},
        {q: "John Doe's date of loss is 02/06/2026 and his first treatment is 02/20/2026. The gap is:",
         opts: ["7 days", "10 days", "14 days", "20 days"],
         a: 2, r: "14 days, and it goes in the plan's risks band with its consequences."},
        {q: "Under the Golden Rule of US claim set-up, what belongs in a treatment note?",
         opts: ["“This will help the case.”", "Factual, clinical observations only", "The attorney's valuation", "Settlement strategy"],
         a: 1, r: "Coordinate, don't commingle: the medical track and the legal track never cross."},
        {q: "Atty. Thorne returns the Case Plan with comments. What do you do?",
         opts: ["Execute the parts he didn't comment on", "Address every comment, then re-route; never part-execute", "Quietly edit the approved version", "Wait for the next plan"],
         a: 1, r: "A returned plan is normal: address every comment and re-route it."},
        {q: "A material fact changes after the Case Plan is approved. The plan is now:",
         opts: ["Still approved", "Superseded: re-route it", "Deleted", "Approved until the demand"],
         a: 1, r: "A plan approved on a false picture is not approved; the earlier approval no longer covers the new picture."},
        {q: "In the Action Plan Editor, where do an action item's owner and date go?",
         opts: ["In the item's own fields", "In a sentence in the item", "In the risks band", "In a separate email"],
         a: 0, r: "Put each action item's owner and date in their own fields, not in a sentence."},
        {q: "What does the gap flag in the Case Plan's risks band record?",
         opts: ["The gap's dates and length, and that John Doe's own documented explanation is still to be gathered", "How much the gap will lower the value of the case", "The Case Manager's guess at why John Doe waited", "The arguments the Case Manager will make to defend the gap"],
         a: 0, r: "Facts only: 14 days, 02/06/2026 to 02/20/2026, explanation pending. What the gap means for the claim is Atty. Thorne's to assess; the Case Manager never interprets or defends it."},
        {q: "Besides the initial 14-day gap, what must the gap flag set up?",
         opts: ["Nothing more", "A watch for any later break in care", "A demand date", "A call to the adjuster"],
         a: 1, r: "Record the initial gap and set a watch for any later break in care; document each break the same way: its dates, then the client's own explanation and the records that support it."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d1m4-l1",
        title: "The Acceptance Decision & the Three-Pillar Case Plan",
        topic: "The document that makes the file move",
        visual: "A five-band vertical architecture, each band a full-width navy or navy-soft bar with an orange index number at its left edge: ① CASE SNAPSHOT & ACCEPTANCE ② COVERAGE · LIABILITY · PROJECTION ③ REGULATORY TRIPLE-CHECK ④ THREE-PILLAR PLAN — the band split into three equal columns, CLINICAL · FUNCTIONAL · FINANCIAL ⑤ RISKS & FLAGS. Band ⑤ is in danger red rather than navy and visibly taller, holding one highlighted chip, 14-DAY TREATMENT GAP; that asymmetry must survive any redesign. To the right, a thin vertical routing rail with an arrow ending in a card: ATTY. ELIJAH THORNE · REVIEW, and under it a calendar chip, FILE WITHIN 30–60 DAYS.",
        tell: {
          why: "The Case Plan is the file's operating instruction. It is what Atty. Thorne reads to set strategy and what every later day executes against. A plan that hides a risk produces a strategy built on a false picture.",
          rules: [
            "Acceptance comes first. After the verification call confirms the facts of loss, decide: Accepted, Escalated for attorney/senior review, or Declined, and record the reason so someone else can follow it.",
            "At acceptance you stop gathering information and make the determination.",
            "If eligibility is uncertain (ambiguous facts of loss or liability, or no clear legal assessment), clarify the facts with the client, then escalate to the attorney with a short summary of exactly what is ambiguous. Don't let the file sit in limbo.",
            "State coverage, liability and projection together. You can't project a case until coverage and liability are understood, and the projection is preliminary until coverage is confirmed.",
            "Liability is not final until it is confirmed by the Police Report, the driver statements and any dashcam or other evidence. Never tell the client liability is a sure thing.",
            "Hold a place in the plan for the Regulatory Triple-Check (HIPAA, Medicare/Medicaid reporting, the Payer Order): it is cleared in the Treatment Phase, before the first bill is routed.",
            "File the Three-Pillar Case Plan within the state's window, often 30 to 60 days, and docket the date.",
            "Clinical: the acute interventions that stabilise the client (PT, specialty consults). Functional: activities of daily living and return-to-work status. Financial: how the Medical Bills get paid and what may be owed back from the recovery, worked out in the Treatment Phase.",
            "Give every pillar measurable goals, and every action item an owner and a date.",
            "Flag adverse facts prominently. A risk buried in prose has not been disclosed to counsel.",
            "The plan proposes operational steps. It does not set legal strategy; route it to Atty. Thorne before acting on anything that commits the firm's position."
          ],
          upl: [
            "The plan may state facts, flag risks and propose operational steps. It may not state legal conclusions, case value or settlement posture. Those are Atty. Thorne's to set, which is why the plan is routed to him."
          ]
        },
        show: {
          caption: "The five bands, and what belongs in each",
          type: "process",
          steps: [
            ["Snapshot & acceptance", "Parties, DOL, SOL, client position, phase; Accepted / Escalated / Declined with the reason."],
            ["Coverage · Liability · Projection", "The three-layer stack and its order; who is responsible; a preliminary projection."],
            ["Regulatory Triple-Check", "Held open: cleared in the Treatment Phase, before the first bill is routed."],
            ["Three-Pillar Plan", "Clinical, Functional, Financial goals, each with an owner and a date."],
            ["Risks & flags", "Adverse facts stated plainly: here, the 14-Day Treatment Gap. Routed to Atty. Thorne."]
          ]
        },
        ops: [
          ["Verification call complete", "Record the acceptance decision with its reason", "CMS → Case Notes", "Accepted / Escalated / Declined, with a reason a colleague can follow"],
          ["Coverage verified in writing", "Draft the plan across all five bands", "Action Plan Editor", "All five bands present; risks band populated"],
          ["Plan drafted", "Docket the filing window and route to Atty. Thorne", "Action Plan Editor → Route for review · CMS → Calendar", "Routed before any position-committing action; due date on the calendar"]
        ],
        best: [
          "Each pillar should have measurable goals.",
          "Every decision needs a documented reason someone else can follow.",
          "When intake stalls: name where it slowed, find the root cause, act to move the file, then fix what let it happen.",
          "Pitfall: a plan that only covers clinical care.",
          "Pitfall: gathering more information at the acceptance stage instead of making the determination.",
          "Pitfall: letting an uncertain file sit in limbo instead of escalating."
        ],
        sources: ["D1#8", "D1#14", "D1#17", "D1#19", "D1#21", "D1#22", "D1#23"],
        rubric: {
          ai: [
            ["Band completeness", 25, "All five bands present and populated"],
            ["Acceptance and pillars", 15, "Decision with reason; Clinical, Functional and Financial pillars each with goals"],
            ["Risk flagged", 20, "The 14-Day Gap appears in the risks band"]
          ],
          trainer: [
            ["Risk prominence", 20, "The gap is genuinely prominent, not technically mentioned"],
            ["Strategy/operations boundary", 20, "Proposes operational steps without setting legal strategy"]
          ]
        },
        notes: [
          "The tall red band is the design argument: risks get more room than comfort. Point at it.",
          "Ask: “What happens if Atty. Thorne builds a demand strategy without knowing about the gap?” The answer is the whole module.",
          "Draw the line between operational and legal: “Request the MRI” is operational. “This case is worth policy limits” is not the CM's to write.",
          "Trainees under-flag because flagging feels like admitting a weak case. Reframe: flagging early is what makes the case defensible later."
        ]
      },

      {
        kind: "activity", id: "d1m4-a1",
        title: "Identifying & Flagging the 14-Day Gap",
        topic: "Skill Activity 1 — find the fact that will decide this case",
        visual: "A horizontal treatment timeline is the whole slide. Far left, a navy node: DOL · 02/06/2026. From it runs a conspicuous empty span, a hatched hollow orange band with no event markers, fourteen day-ticks wide, labelled NO TREATMENT · 14 DAYS. At its right end a node, FIRST TREATMENT · 02/20/2026, after which visit markers begin, running into a dashed span ahead labelled WATCH: ANY LATER BREAK IN CARE. Beneath, three consequence cards fan out from the hollow band on orange leader lines: CAUSATION CHALLENGE · VALUATION PRESSURE · CREDIBILITY ATTACK. The emptiness of the band is the message; never fill it with decoration.",
        act: {
          scenario: "John Doe's first treatment records have arrived. The date of loss is 02/06/2026. The first treatment record is dated 02/20/2026; chiropractic care at Riverton Spine & Rehab began on 02/24/2026.",
          prompt: "Identify and flag the Treatment Gap in John Doe's file. Compute it exactly, record the initial gap, set the file to catch any later break in care, and record in the risks band the facts only: its dates, its length, and that John Doe's own explanation and its documents are still to be gathered. What the gap means for the claim is Atty. Thorne's to assess. List the documents you will ask John Doe for, and the steps needed before the gap can be explained. Then route the flag to Atty. Thorne.",
          tool: "CMS → Case File → Risk Flags · Action Plan Editor → Risks",
          output: "A precisely computed, prominently flagged and routed treatment-gap record.",
          checkpoints: [
            "Gap computed as 14 days, 02/06/2026 to 02/20/2026",
            "Initial gap recorded, and a watch set for any later break in care",
            "Risks band holds facts only: the dates, the 14 days, and “explanation pending: client's own account and supporting documents”; no view on what the gap does to the claim",
            "Documents to request listed: work schedules, doctor availability notes, travel logs, illness records, receipts and messages",
            "Investigation steps recorded: the client's own explanation, supporting documents, provider confirmation",
            "Flag placed prominently in the Case Plan's risks band",
            "Flag routed to Atty. Thorne"
          ]
        },
        ops: [
          ["Treatment records received", "Compute the gap from DOL to first treatment", "CMS → Case File → Treatment timeline", "14 days, both dates recorded"],
          ["Gap confirmed", "Flag it with its defense uses and likely causes", "Action Plan Editor → Risks", "Prominent flag with consequences"],
          ["Flag recorded", "Route to Atty. Thorne; schedule the Day 3 investigation", "CMS → Tasks", "Routed and scheduled"]
        ],
        best: [
          "Identify gaps early during record review, and document the reason for every interruption.",
          "A well-explained gap is less damaging than an unexplained one.",
          "Pitfall: “about two weeks” instead of the exact dates.",
          "Pitfall: recording the gap but setting no watch for a later break in care."
        ],
        sources: ["D1#16", "D1#44", "D2#13"],
        rubric: {
          ai: [
            ["Gap computation", 25, "Exactly 14 days, dates correct"],
            ["Gap and watch", 15, "Initial gap captured and a later break in care watched for"],
            ["Defense uses and causes", 10, "The adjuster's arguments and the likely causes both named"],
            ["Routed", 10, "Flag routed to Atty. Thorne"]
          ],
          trainer: [
            ["Flag prominence", 25, "A reviewer sees it within seconds of opening the plan"],
            ["Investigative thinking", 15, "The steps would actually produce a defensible explanation"]
          ]
        },
        notes: [
          "This is Day 2's most consequential activity. Everything on Days 3 to 5 turns on this flag existing and being accurate.",
          "Insist on the exact count. “About two weeks” is not a flag; 02/06 to 02/20 is.",
          "Ask the room what the adjuster will say when they see this. Their answers become the Day 4 negotiation.",
          "Trainees often record the gap but set no watch for the next break in care. It comes in April (the Treatment Phase, later on Case Flow Day 2), and a second break undercuts the “he got better” explanation for the first."
        ]
      },

      {
        kind: "lesson", id: "d1m4-l2", brief: true,
        title: "The Action Plan Editor & Attorney Review Routing",
        topic: "Drafting, routing, and the review loop",
        visual: "Two parts. Left: the Word-style editor as a document page with its toolbar, annotated with four orange numbered callouts — ① section templates ② the risks band ③ owner and date fields on action items ④ the route-for-review control. Right: the routing loop as a closed circuit — DRAFT → ROUTE → COUNSEL REVIEW → APPROVED → EXECUTE, with a RETURNED WITH COMMENT branch back to DRAFT. The return branch is orange and as prominent as the approval branch, so the loop reads as iterative, not a one-way submission. A thin grey bar under the whole loop is labelled AUDIT TRAIL — every version kept.",
        tell: {
          why: "The plan is only useful once counsel has seen it and the file is running against an approved version. Routing is not overhead: it is where operational work becomes authorized work.",
          rules: [
            "Draft in the editor's section templates. Ad hoc structure produces plans reviewers can't scan.",
            "Put each action item's owner and date in their own fields, not in a sentence.",
            "Route for review before executing anything that commits the firm's position externally.",
            "A returned plan is normal. Address every comment and re-route; never execute a partly addressed plan.",
            "Record the approved version. The file runs against the approved plan, not the latest draft.",
            "Re-route when a material fact changes. A plan approved on a false picture is not approved.",
            "Keep a clean, discoverable file: the CMS keeps an unalterable audit trail, and every note may be read by defense counsel.",
            "Coordinate, don't commingle. The medical plan and the legal claim are parallel tracks: keep treatment notes factual and clinical, and legal strategy in the legal track only."
          ],
          upl: [
            "Routing exists because legal strategy is counsel's. Where a review comment asks for a legal judgment, the answer comes from Atty. Thorne, not from the Case Manager drafting the plan."
          ]
        },
        show: {
          caption: "The review loop, and what each state allows",
          type: "table",
          head: ["State", "What it means", "What you may do"],
          rows: [
            ["Draft", "Being written; not yet seen by counsel", "Edit freely. Execute nothing that commits the firm externally."],
            ["Routed", "Sent to Atty. Thorne, awaiting review", "Continue internal preparation. Do not act on the plan's positions."],
            ["Returned with comment", "Counsel wants changes", "Address every comment, then re-route. Do not part-execute."],
            ["Approved", "Counsel has authorized the plan", "Execute against this version and record it as the operative plan."],
            ["Superseded", "A material fact changed after approval", "Re-route. The earlier approval no longer covers the new picture."]
          ]
        },
        ops: [
          ["Plan drafted across all five bands", "Route to Atty. Thorne", "Action Plan Editor → Route for review", "Routing recorded with timestamp"],
          ["Plan returned with comments", "Address every comment and re-route", "Action Plan Editor → Revisions", "No comment left unaddressed"],
          ["Material fact changes after approval", "Mark the plan superseded and re-route", "Action Plan Editor → Version", "Approved version kept; new version routed"]
        ],
        best: [
          "Assume every note will be read by defense counsel.",
          "Keep medical notes factual and clinical.",
          "Pitfall: editing records in a way that breaks the audit trail.",
          "Pitfall: writing “this will help the case” in a treatment note."
        ],
        sources: ["D1#24", "D1#25", "D1#2"],
        rubric: {
          ai: [
            ["Template use", 15, "Plan drafted in the editor's section templates"],
            ["Field discipline", 20, "Owner and date in their own fields on every action item"],
            ["Routing recorded", 25, "Routed with timestamp before external execution"]
          ],
          trainer: [
            ["Version discipline", 25, "Executes against the approved version, not the latest draft"],
            ["Golden Rule", 15, "Keeps legal opinion out of the medical track"]
          ]
        },
        notes: [
          "The orange return branch is the point: being sent back is the system working. Trainees who fear it under-flag risks to avoid it.",
          "Ask: “Which version is the file running against right now?” It should always have an answer.",
          "The superseded state matters on this file: the gap investigation on Day 3 will change the picture and force a re-route.",
          "Read the Golden Rule pitfall aloud. Defense counsel uses opinions in medical notes to impeach the Case Manager's neutrality."
        ]
      },

      {
        kind: "activity", id: "d1m4-a2",
        title: "Live Case Plan Draft — John Doe v. Robert Smith",
        topic: "Skill Activity 2 — the full plan, routed for review",
        visual: "A full-slide editor canvas showing the live plan with all five bands stubbed and their required fields outlined in orange. A completion meter runs across the top in five segments that fill as each band is completed. The risks band carries a red required marker so it can't be skipped silently. Bottom-right, the ROUTE FOR REVIEW control is greyed out and locked until all five segments are filled, with a label: “all five bands required.” The lock is the argument: the tool won't let an incomplete plan reach counsel.",
        act: {
          scenario: "Everything from Day 1 and Claim Set Up is in the file: parties mapped, the $40,000 stack verified, the onboarding packet delivered and tracked, and the 14-Day Treatment Gap identified. The Regulatory Triple-Check is still open: it clears in the Treatment Phase, before the first bill is routed. Atty. Thorne is waiting on the Case Plan.",
          prompt: "Draft the complete Case Plan for John Doe v. Robert Smith. Fill all five bands from today's work: the acceptance decision with its reason; coverage as a stack with its order of operations, liability, and a preliminary projection; the Regulatory Triple-Check, held open until the Treatment Phase; Clinical, Functional and Financial pillars with measurable goals, each action item with an owner and a date; and the risks band with the 14-Day Gap and the risk of a later break in care, prominently, with their consequences. Docket the filing window, then route the plan to Atty. Thorne.",
          tool: "Action Plan Editor",
          output: "A complete, routed Case Plan that counsel could set strategy from without asking a follow-up question.",
          checkpoints: [
            "Snapshot: parties, DOL 02/06/2026, SOL 02/06/2028, client recorded as a passenger",
            "Acceptance decision recorded with its reason",
            "Coverage: $10,000 BI / $20,000 Host UM / $10,000 Relative UM, total $40,000",
            "Order of operations: BI → Host UM → Relative UM; projection marked preliminary",
            "Liability recorded as preliminary until confirmed by the Police Report and driver statements",
            "Regulatory Triple-Check band held open, to clear in the Treatment Phase",
            "Clinical, Functional and Financial pillars each with a measurable goal",
            "Every action item has an owner and a date",
            "Risks band: 14-Day Gap and the risk of a later break in care, prominent, with consequences",
            "Filing window docketed",
            "Plan routed to Atty. Elijah Thorne with a timestamp"
          ]
        },
        ops: [
          ["Claim Set Up complete", "Draft all five bands", "Action Plan Editor", "Meter at five of five"],
          ["Plan complete", "Docket the filing window", "CMS → Calendar", "Due date on the calendar"],
          ["Plan docketed", "Route to Atty. Thorne", "Action Plan Editor → Route for review", "Routed with timestamp"]
        ],
        best: [
          "Grade your own plan as Atty. Thorne will read it: if you need to ask a question to set strategy, it isn't finished.",
          "Pitfall: a projection stated as a number before coverage is confirmed."
        ],
        sources: ["D1#8", "D1#18", "D1#19", "D1#22", "D1#23", "D1#44"],
        rubric: {
          ai: [
            ["Snapshot accuracy", 15, "Parties, DOL, SOL and client position all correct"],
            ["Coverage accuracy", 15, "Correct limits, total and order of operations"],
            ["Risk flagging", 15, "The 14-day gap and the risk of a later break recorded with consequences"],
            ["Item discipline", 10, "No action item without an owner and a date"],
            ["Routing", 5, "Routed to Atty. Thorne with timestamp"]
          ],
          trainer: [
            ["Reviewer readiness", 25, "Counsel could set strategy from it without a follow-up question"],
            ["Boundary discipline", 15, "No legal conclusion or case valuation written into the plan"]
          ]
        },
        notes: [
          "This is Claim Set Up's capstone. Give it real time; it is the gate, not a wrap-up.",
          "The locked route control is deliberate. If a trainee can't route, ask which band is incomplete.",
          "Grade it as Atty. Thorne would read it. If you need to ask a question to set strategy, the plan isn't finished.",
          "Close Claim Set Up by stating the gate: LORs out and logged, stack verified at $40,000, the 14-Day Gap flagged, plan routed. The Treatment Phase doesn't begin until all four are true."
        ]
      },

      {
        kind: "check", id: "d1m4-kc",
        title: "Case Plan Audit & the Claim Set Up Gate",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split, with one Day-1-specific addition above the question panel: a full-width DAY 1 GATE bar of four connected checkpoint chips — CMS INITIALIZED · STACK VERIFIED $40,000 · TRIPLE-CHECK CLEARED · PLAN ROUTED — each with a tick state, and a closed navy barrier at the right end labelled DAY 2 with a small note: “opens when all four are green.” The barrier makes the sequential-integrity rule visible rather than merely stated.",
        check: {
          questions: [
            "Set out the five bands of the Case Plan and what belongs in each, including the three pillars.",
            "Explain why an adverse fact buried in the body of a plan has not, in any meaningful sense, been disclosed to counsel.",
            "State John Doe's coverage position exactly as it should appear in the plan: layers, limits, total, order of operations, and the status of the projection."
          ],
          summary: [
            "Summarize what you learned about turning a raw intake into a file an attorney can set strategy from.",
            "Articulate your strategy: the plan is with Atty. Thorne. What is your next action, and what are you waiting on before the one after that?",
            "Identify the one thing across Day 1 and Claim Set Up you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Recording an acceptance decision with its reason",
            "Structuring a complete five-band, three-pillar Case Plan",
            "Stating a coverage position as an ordered stack",
            "Computing and documenting a Treatment Gap precisely",
            "Routing for attorney review and keeping version discipline",
            "Keeping operational proposals apart from legal strategy"
          ]
        },
        best: [
          "Check all four gate conditions before you move on to the Treatment Phase.",
          "Pitfall: quietly editing an approved plan instead of re-routing it."
        ],
        sources: ["D1#8", "D1#23", "D1#24", "D1#25", "D1#44", "D2#13"],
        rubric: {
          ai: [
            ["Band recall", 15, "All five bands and all three pillars named with correct contents"],
            ["Coverage accuracy", 15, "Limits, total, order of operations; projection preliminary"],
            ["Gap computation", 15, "14 days, correct dates, the adjuster's arguments named"],
            ["Gate conditions", 10, "All four Claim Set Up gate conditions listed"],
            ["Completeness", 5, "Every question answered substantively"]
          ],
          trainer: [
            ["Version reasoning", 15, "Recognises the approval is superseded and the plan must be re-routed"],
            ["Boundary judgment", 10, "The examples are genuinely on the right sides of the line"],
            ["Self-Summary quality", 10, "Specific and honest across the whole day"],
            ["Self-rating calibration", 5, "Defensible against the score"]
          ]
        },
        notes: [
          "Question 5 tests version discipline and is the most often failed: the approval is superseded, and the plan must be re-routed, not quietly edited.",
          "Question 3 enforces sequential integrity: with an unverified stack, every later demand and lien check reads the wrong numbers.",
          "This check closes Claim Set Up. Confirm the gate aloud with the room before releasing anyone to the Treatment Phase.",
          "Compare scores with self-ratings across Day 1 and Claim Set Up, not just this check."
        ]
      }

      ]
    }

    ]
  },

  /* ==========================================================
     DAY 2 — CLAIMS & PRE-DEMAND
     ========================================================== */
  {
    n: 2, id: 12,
    title: "Case Flow Day 2 · Claim Set Up & Treatment",
    phase: "Claim set up & treatment",
    objective: "Build John Doe's three-layer Policy Stack in the CMS; draft, transmit and log the LORs and notices; receive the carriers' claim correspondence and verify the $40,000 stack in writing; flag the 14-Day Gap and route the Case Plan; then carry the file through treatment: keep John Doe reachable (the No Contact Protocol), route every bill in Payer Order, flag the Health Plan's reimbursement right and clear the Regulatory Triple-Check, and keep care moving through the disruption, to MMI.",
    gate: "Policy Stack built in the CMS · LORs and notices out and logged · carrier correspondence received and the Coverage Matrix audited · 14-Day Gap flagged · Case Plan routed to Atty. Thorne · bills routed in Payer Order, LOPs out · Peach State's reimbursement right flagged and the Regulatory Triple-Check cleared · treatment documented to MMI",
    discussion: "It is 04/08/2026. Keystone confirmed its limit in writing on 03/20, Riverton Spine & Rehab reports John Doe has missed two visits, and Dana Whitfield has asked John for a Recorded Statement. What do you do first, second and third, and what does each protect?",
    fileState: [
      "Matter open in the CMS with the Conflict Check documented; Property Damage onboarding under way.",
      "Claims opened by phone 02/16–02/17/2026: $10,000 BI (Keystone Mutual), $20,000 Host UM (Harbor Point), $10,000 Relative UM (Cardinal State Mutual), limits reported but nothing confirmed in writing; nothing in the CMS Insurance tab yet.",
      "Peach State Health Plan and Bluewater Auto still to be put on notice.",
      "Treatment ahead: urgent care 02/20/2026, then Riverton Spine & Rehab under an LOP, Lakeside Orthopedics, an MRI, an injection and MMI; the bills, the liens and the gap arrive as you go."
    ],
    modules: [

    /* ---------- DAY 2 · MODULE 1 ---------- */
    {
      n: 1, id: "d2m1",
      title: "Claims Setup & Coverage Verification",
      about: "Setting the claims up in order: the Policy Stack built in the CMS, the LOR set to all three stack carriers and the notices outside the stack, transmitted and logged, then the carriers' correspondence received and every coverage tracked from “reported” to “confirmed in writing” in the CMS Coverage Matrix.",
      quiz: [
        {q: "Which coverages make up John Doe's $40,000 Recovery Stack?",
         opts: ["Keystone BI, Harbor Point Host UM and Cardinal State Relative UM", "Keystone BI, Host UM, Relative UM and Harbor Point MedPay", "Keystone BI, Keystone PD and Host UM", "Host UM, Relative UM and his own Bluewater UM"],
         a: 0, r: "Only the coverages that pay the claim stack: $10,000 BI + $20,000 Host UM + $10,000 Relative UM. MedPay pays bills now (Payer Order), PD pays for the car, and John Doe rejected UM on his Bluewater policy in writing on 03/14/2024."},
        {q: "On John Doe v. Robert Smith, in what order must the coverage layers be pursued?",
         opts: ["Host UM → BI → Relative UM", "BI → Host UM → Relative UM", "Relative UM → Host UM → BI", "All three at once, in parallel"],
         a: 1, r: "BI pays first. Host UM opens once BI is exhausted or tendered, and Relative UM stacks behind Host UM."},
        {q: "Why can John Doe reach the $20,000 Host UM layer?",
         opts: ["He owns the host vehicle", "He was a passenger in the host vehicle", "Robert Smith has no insurance", "His Health Plan assigns it to him"],
         a: 1, r: "He reaches the host vehicle's UM because he was riding in that car. Had he been driving his own car he would have reached $10,000: he rejected UM on his own policy, and the relative policy excludes a car he owns."},
        {q: "Cardinal State Mutual has no adjuster assigned when John Doe's LOR goes out on 02/17/2026. How is the letter addressed?",
         opts: ["“Attn: Teresa Okafor”, to save re-addressing it later", "“Attn: Claims Department”, with the claim number in the subject line", "To Margaret Doe, the insured, to forward to her carrier", "Held back until Cardinal State assigns an adjuster"],
         a: 1, r: "With no adjuster assigned, the address line reads “Attn: Claims Department”. Teresa Okafor is not assigned until 03/03/2026, and holding the letter delays the UM notice."},
        {q: "Harbor Point's LOR goes out on 02/17/2026, long before BI can be exhausted. What should it do?",
         opts: ["Demand the $20,000 Host UM limits now, so the response clock starts running", "Wait until Keystone tenders its $10,000 before writing to Harbor Point at all", "Ask Harbor Point to pay the BI layer too, since Keystone is slow", "Give notice of the Host UM claim, open the MedPay claim and ask for its claim forms and proof-of-loss requirements, and ask for written confirmation of coverage, with no UM payment demand"],
         a: 3, r: "UM policies carry notice conditions, so the carrier is noticed at set-up. Notice is not a demand: the UM layers owe nothing until BI is exhausted, so a UM payment demand now is premature. What puts the stack at risk is settling or releasing BI without the UM carriers' consent. MedPay is different: it pays bills as they are submitted."},
        {q: "Keystone Mutual gave a figure on the set-up call but will not confirm Robert Smith's limits in writing or release its Declaration Page without a written request and authorizations. What do you do?",
         opts: ["Send the written limits request Atty. Thorne signs, with only the documents or limited authorization he approves, keep BI preliminary, and calendar the follow-up", "Mark BI $10,000 confirmed from the set-up call, so the projection can be finished", "Demand Host UM now, so that Harbor Point puts pressure on Keystone", "Tell John Doe the limit is probably $10,000, and revisit it later"],
         a: 0, r: "Expect asymmetry: a third-party BI carrier often wants a written request and documents first. Until its Declaration Page arrives (03/20/2026 on this file), the set-up-call figure is a lead: BI stays preliminary and no limit is quoted to the client. What goes with the request is counsel's call: never a blanket Medical Authorization to an adverse carrier. Some states set what a limits request must contain; confirm the governing rule."},
        {q: "The Coverage Matrix lists Harbor Point MedPay, $5,000, as stack layer 4 and totals the stack at $45,000. What is the correct treatment?",
         opts: ["Leave it: MedPay is first-party coverage from a stack carrier", "Fold MedPay into the Host UM limit, making it $25,000", "Move MedPay out of the stack and restore it to $40,000", "Delete MedPay from the file, since it is not part of the stack"],
         a: 2, r: "MedPay pays bills now; it is not part of the Recovery Stack. It stays tracked (Harbor Point confirmed no reimbursement right on 03/02/2026), and the stack is $10,000 + $20,000 + $10,000 = $40,000."},
        {q: "Which insured does each LOR name?",
         opts: ["John Doe on all three", "Robert Smith on all three", "Robert Smith (Keystone), Kevin Alvarez (Harbor Point), Margaret Doe (Cardinal State)", "Kevin Alvarez on all three"],
         a: 2, r: "The insured differs on each policy, and every LOR names the carrier's own insured."},
        {q: "What may the third-party LOR to Keystone Mutual give about John Doe?",
         opts: ["His name only: never his phone, address, date of birth or employer", "His full contact details, so the adjuster can call him", "His employer, for the wage claim", "His medical providers"],
         a: 0, r: "Third-party correspondence protects the client's information; the first-party carriers may verify his details."},
        {q: "Which LOR carries the Property Damage carve-out?",
         opts: ["All three", "Keystone's only: Leah Moran may discuss the Civic's damage claim with John Doe, nothing else", "Harbor Point's", "None: the client handles Property Damage alone"],
         a: 1, r: "The carve-out goes only in Keystone's letter, which gives the PD adjuster 5 business days from the letter to inspect the Civic."},
        {q: "An LOR has had no acknowledgement. When do you follow up?",
         opts: ["After 30 days", "By the third business day", "Only when the adjuster calls", "At the demand"],
         a: 1, r: "Expect an acknowledgement in 24–48 hours. None by the third business day: follow up, log it and set the next date."},
        {q: "Keystone gave its $10,000 limit by phone at set-up. How does the Coverage Matrix record it?",
         opts: ["Confirmed", "Preliminary, with the set-up call as its source, until a Declaration Page or Coverage Letter confirms it", "Not at all until the demand", "As $40,000"],
         a: 1, r: "A phone figure is a lead: record its source and keep it preliminary, and never quote it to John Doe."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d2m1-l1", compact: true,
        title: "LOR Drafting Mechanics & Three-Carrier Notification",
        topic: "One template, five letters, and the rules that make each one different",
        visual: "A distribution fan reads left to right. Left: a white LOR page on navy firm letterhead, its fields marked by orange numbered badges — ① Attn line ② Subject: claim no. + DOL ③ Client and insured ④ Requests ⑤ Signature, ATTY. ELIJAH THORNE. From it, five orange arrows fan right to five cream recipient cards stacked vertically: KEYSTONE (BI + PD carve-out), HARBOR POINT (Host UM + MedPay), CARDINAL STATE (Attn: Claims Department); then, below a thin grey divider labelled OUTSIDE THE STACK, BLUEWATER and PEACH STATE in muted grey. Each card carries its claim or member number in a mono pill. A red danger callout on the Keystone card: “Name only.” A second on both UM cards: “Notice, not demand.” The argument: one template, five different letters.",
        tell: {
          why: "The LOR is the moment every carrier conversation moves off John Doe and onto the firm. One letter wrong (the wrong insured, a UM carrier never noticed, a notice that reads as a demand) follows the claim to the demand table, where it can put $30,000 of UM coverage at risk.",
          rules: [
            "Send the LOR once the retainer is signed, and early: it moves all communication onto the firm. Here the claims were opened by phone 02/16–02/17/2026 and the formal LORs went out 02/17/2026.",
            "Draft on the firm's template and letterhead. Address the adjuster by name (“Attn: Dana Whitfield”); with no adjuster assigned, “Attn: Claims Department”. On 02/17/2026 that is Cardinal State.",
            "Every LOR names the client, the date of loss, the claim number and the carrier's insured, and the insured differs on each policy: Robert Smith (Keystone), Kevin Alvarez (Harbor Point), Margaret Doe (Cardinal State).",
            "State that the client was injured, that a Demand Package with records and bills will follow, and that all contact goes to the firm. Nothing more: anything written now is quoted back later.",
            "Request the limits and any additional coverage, the Declaration Page for every applicable policy, and preservation of photos, statements, video, the insured vehicle and its event data recorder (airbag control module) data: liability is not final until the Police Report, statements and video confirm it.",
            "Notify all three stack carriers now. UM policies carry notice conditions, and late notice hands a carrier a defense. Notice is not a demand: no UM letter asks for payment before the BI tender is documented.",
            "The third-party letter gives Keystone nothing that reaches the client: his name, never his phone, address, date of birth or employer. First-party carriers (Harbor Point, Cardinal State) may verify his details.",
            "The Property Damage carve-out goes only in Keystone's letter: its PD adjuster, Leah Moran, may discuss the Civic's damage claim with John Doe, nothing else, and gets 5 business days from the date of the letter to inspect the Civic.",
            "Send by each entity's preferred method, with the claim number (without one, the policy number) and the date of loss in the subject line. Atty. Thorne signs; you log the delivery.",
            "Expect an acknowledgement in 24–48 hours; it may state coverage and the limit. None by the third business day: follow up. Keystone may withhold written confirmation of its limits until it has a written request with the authorizations Atty. Thorne approves."
          ],
          upl: [
            "You draft, assemble and send; Atty. Thorne signs. Never sign an LOR for him, and never tell an adjuster what the claim is worth, argue who caused the collision, or say what a UM policy owes."
          ]
        },
        show: {
          caption: "Five letters on 02/17/2026: who gets what",
          type: "table",
          head: ["Letter to", "Coverage", "Insured named", "Attn line"],
          rows: [
            ["Keystone Mutual", "BI KM-26-440871 · PD carve-out for the Civic", "Robert Smith", "Dana Whitfield (PD copy: Leah Moran)"],
            ["Harbor Point", "Host UM HP-26-7741 · MedPay", "Kevin Alvarez", "Marcus Bell"],
            ["Cardinal State", "Relative UM CS-26-20355", "Margaret Doe", "Claims Department (no adjuster yet)"],
            ["Bluewater (notice)", "Own policy: collision option; UM rejection form", "John Doe", "Claims Department (policy no. in subject)"],
            ["Peach State (notice)", "Reimbursement right · PSH-55017742 · GRP-41208", "John Doe (member)", "Recovery unit"]
          ]
        },
        ops: [
          ["Claims opened by phone 02/16–02/17/2026", "Log each claim number, adjuster (or “none yet”) and preferred delivery method", "CMS → Insurance tab · Communications Log", "Every claim has a number, an adjuster or “none yet”, and a method"],
          ["LOR set drafted", "Route all five letters for Atty. Thorne's signature", "CMS → Documents → Outgoing · Tasks", "Signed by counsel before sending; none signed by the CM"],
          ["Letters served 02/17/2026", "Log method and time; calendar the acknowledgement check", "CMS → Communications Log · Calendar", "Follow-up dated 02/20/2026 for any carrier still silent"],
          ["Acknowledgement arrives", "File it; record any disclosure, coverage statement or limit with its source", "CMS → Documents · Insurance tab", "Source and date on every coverage fact"]
        ],
        best: [
          "Confirm on every claim call: claim number, the adjuster's name and spelling, direct phone, fax, email and preferred method. A claim not opened on the call gets a follow-up within 24–48 hours.",
          "LORs go beyond carriers as each becomes relevant: providers, the employer, rental, tow and storage, lien holders, law enforcement.",
          "Keep claim-opening facts general and verifiable: date, time, place, type of collision, parties.",
          "Open the claims in the order Atty. Thorne and the firm's protocol direct; when in doubt, ask.",
          "A reply that mentions other coverage is a coverage question for Atty. Thorne, not a new layer.",
          "Pitfall: a UM letter that reads as a demand before the BI tender is documented.",
          "Pitfall: the client's phone, address or date of birth in the letter to Keystone.",
          "Pitfall: guessing an adjuster's name for Cardinal State instead of “Attn: Claims Department”."
        ],
        sources: ["D1#21", "LSH Claims Specialist: LOR purpose, recipients, drafting components and delivery", "LSH Claims Specialist: claim set-up call, information protection on third-party claims, LOR acknowledgement and limits disclosure", "Newly authored: UM notice at set-up (notice, not demand)"],
        rubric: {
          ai: [
            ["Component accuracy", 20, "Attn line, insured, claim number and DOL correct for each carrier"],
            ["Request set", 15, "Limits, additional coverage, Declaration Pages and preservation requested"],
            ["Information protection", 15, "Third-party letter limited to the client's name; client details only to first-party carriers"],
            ["Follow-up timing", 10, "Acknowledgement expected by 02/19/2026; follow-up dated 02/20/2026"]
          ],
          trainer: [
            ["Notice vs. demand", 25, "Explains why the UM carriers are noticed now and not asked for payment"],
            ["UPL boundary", 15, "Letters signed by Atty. Thorne; no value, liability or coverage opinion offered to a carrier"]
          ]
        },
        notes: [
          "Open with five envelopes on the table: “Five letters leave this file on 02/17/2026. Which one, written wrong, costs John Doe the most?” Let the room argue, then turn to the two UM letters.",
          "Ask: “Why does Cardinal State get a letter today, when it pays nothing until BI and Host UM are done?” The answer is notice: late notice can hand a UM carrier a defense. A UM payment demand now would simply be premature. What can actually cost John Doe a UM layer comes later: settling with or releasing Robert Smith without the UM carriers' written consent, or a release broader than Smith and Keystone. Confirm the governing rule.",
          "Watch for the Keystone letter that over-shares: phone, address, employer, treatment. On 02/17/2026 John Doe has not treated; the 14-Day Gap is still forming, and nothing in a letter should describe it.",
          "The signature line is the UPL line on this slide: the CM drafts and sends; Atty. Thorne signs."
        ]
      },

      {
        kind: "activity", id: "d1m1-a1", compact: true,
        title: "Policy Stack & Coverage Verification",
        topic: "Skill Activity 1 — build the ladder to $40,000",
        visual: "A vertical three-rung ladder in the centre of the slide, built bottom-up so the stacking order reads physically. Rung 1 (bottom, navy): BI $10,000. Rung 2 (navy-soft): HOST UM $20,000. Rung 3 (top, orange): RELATIVE UM $10,000. Each rung is a rounded bar carrying its carrier, claim number and adjuster in small mono type on the right. To the right, a vertical orange brace spans all three rungs with the total, $40,000, set large in Fraunces. Below, one empty verification checkbox per layer in an orange-bordered card headed VERIFY EACH LAYER. The rungs are numbered 1-2-3 bottom to top and never reordered.",
        act: {
          scenario: "File date 02/17/2026, before the letters go out. All three carriers opened claims by phone on 02/16–02/17/2026 and reported their limits on the set-up calls. Nothing is confirmed in writing: today's LORs will request each Declaration Page, and Keystone, the third-party carrier, will want authorizations first. Nothing has been entered in the CMS Insurance tab.",
          prompt: "Build the complete Policy Stack for John Doe v. Robert Smith. Enter all three layers in the CMS in their order of operations, with carrier, policy number, claim number, limit and adjuster for each. Classify each layer as first-party or third-party. In the Comments box record the carrier's actual name, the driver's name where it differs from the owner, and the adjuster's details, or state expressly that none is assigned yet. Then verify the total, record the order the layers must be pursued in, and mark the projection preliminary until each limit is confirmed in writing.",
          tool: "CMS → Insurance tab",
          output: "A three-layer Coverage Matrix totalling $40,000, each layer classified, ordered and fully attributed.",
          checkpoints: [
            "All three layers present: BI, Host UM, Relative UM",
            "Limits entered as $10,000 / $20,000 / $10,000",
            "Total computes to $40,000",
            "Order of operations recorded: BI → Host UM → Relative UM",
            "BI classified as third-party; both UM layers as first-party",
            "Policy number and claim number completed for every layer",
            "Relative UM adjuster recorded as “No adjuster assigned yet”, not left blank",
            "Source of each limit recorded (set-up call for now; Declaration Page to be requested in the LOR)",
            "Projection marked preliminary until each limit is confirmed in writing"
          ]
        },
        show: {caption: "The stack, and the order it must be worked in", type: "stack"},
        ops: [
          ["Limits reported on the set-up calls", "Enter each layer with its limits and identifiers", "CMS → Insurance tab", "Three layers, each with policy number, claim number and adjuster (or “none yet”)"],
          ["All layers entered", "Verify the total and record the order of operations", "CMS → Insurance tab → Comments", "$40,000; BI → Host UM → Relative UM"],
          ["A limit is unconfirmed", "Hold the projection as preliminary", "CMS → Case Notes", "No limit quoted to the client before written confirmation"]
        ],
        best: [
          "Record where each limit came from, so anyone can check it.",
          "Re-project whenever coverage, liability or treatment changes.",
          "Pitfall: projecting value before coverage is confirmed.",
          "Pitfall: quoting a likely limit to the client before it is confirmed in writing."
        ],
        sources: ["D1#18", "D1#19", "D1#20", "LSH Claims Specialist: CMS Insurance tab SOP, first- and third-party coverage"],
        rubric: {
          ai: [
            ["Limit accuracy", 20, "$10,000 BI / $20,000 Host UM / $10,000 Relative UM, each on the right layer"],
            ["Total", 15, "Exactly $40,000"],
            ["Order of operations", 15, "BI → Host UM → Relative UM"],
            ["Field completeness", 10, "Policy number, claim number and adjuster (or “none yet”) on every layer"]
          ],
          trainer: [
            ["Understands stacking", 25, "Can explain why the passenger fact opens two UM layers, not just that it does"],
            ["Verification habit", 15, "Recorded where each limit came from, and held the projection until each is confirmed by its Declaration Page"]
          ]
        },
        notes: [
          "Walk the ladder bottom-up out loud: “BI pays first, and only once it is exhausted does Host UM open.”",
          "The common error is entering the layers as three equal parallel claims. Stop it at once: UM owes nothing until BI is exhausted, so a UM demand before the BI tender is premature, and settling or releasing BI without the UM carriers' written consent can forfeit the stack.",
          "Ask: “Whose policy is the Host UM?” Trainees often say John Doe's. It is the host driver's; John Doe reaches it because he was riding in that car.",
          "Have two trainees read their total aloud. Anything other than $40,000 means a layer is on the wrong rung."
        ]
      },

      {
        kind: "activity", id: "d2m1-a1",
        title: "Generating Formal LORs to BI, Host UM, and Relative UM Carriers",
        topic: "Skill Activity 1 — five letters, each one right",
        visual: "A letter-assembly workbench. Centre: the firm-letterhead LOR template as a white page with six orange-badged slots — ① Attn ② Subject line ③ Client and insured ④ Injury notice and demand-to-follow ⑤ Requests: limits, Dec Pages, additional coverage, preservation ⑥ Signature, ATTY. ELIJAH THORNE. Left margin: five tabs, one per letter, the three stack carriers in navy and the two notices in grey. Right margin: a delivery rail of three chips — ROUTED FOR SIGNATURE → SENT BY PREFERRED METHOD → ACK DUE 02/19 · FOLLOW UP 02/20. Two red danger callouts: over slot ③ on the Keystone tab, “Name only”; over slot ④ on both UM tabs, “Notice, not demand.”",
        act: {
          scenario: "File date 02/17/2026. Claims were opened by phone 02/16–02/17/2026: Keystone Mutual BI KM-26-440871 (Dana Whitfield) and PD (Leah Moran; PD liability accepted today), Harbor Point HP-26-7741 (Marcus Bell; Host UM and MedPay), Cardinal State Mutual CS-26-20355 (no adjuster assigned). Each carrier's preferred delivery method is in the Communications Log. John Doe has not started treatment.",
          prompt: "Generate John Doe's letter set on the firm template: LORs to Keystone (BI, with the PD carve-out), Harbor Point (Host UM and MedPay) and Cardinal State (Relative UM), and notices to Bluewater and Peach State Health Plan. Give each the right Attn line, insured, claim, policy or member number and date of loss, and the requests for limits, Declaration Pages, additional coverage and preservation. Route the set to Atty. Thorne for signature, send each by its preferred method, and calendar the acknowledgement checks. Graded judgment: what Keystone's letter leaves out, and why no UM letter asks for payment.",
          tool: "CMS → Documents → Outgoing · Email Workspace · CMS → Calendar",
          output: "Five signed, sent and logged letters, each correctly addressed, with the acknowledgement follow-ups on the calendar.",
          checkpoints: [
            "Five letters: LORs to Keystone, Harbor Point and Cardinal State; notices to Bluewater and Peach State",
            "Attn lines: Dana Whitfield (KM-26-440871), Marcus Bell (HP-26-7741), and “Attn: Claims Department” for Cardinal State (CS-26-20355), not a guessed name",
            "Insured named correctly on each: Robert Smith, Kevin Alvarez, Margaret Doe; John Doe on Bluewater",
            "Subject lines carry the claim number and DOL 02/06/2026; Bluewater's carries the policy number; Peach State's carries PSH-55017742 and GRP-41208",
            "Keystone's letter gives John Doe's name only (no DOB, phone, address, employer or treatment detail) and confines the PD carve-out to the Civic, with 5 business days from the date of the letter to inspect the Civic",
            "Every LOR requests limits, any additional coverage, Declaration Pages and preservation; Keystone's names the photos, statements, the Silverado and its EDR data, and any video; Harbor Point's asks that the Escape and its EDR data be preserved before any repair or salvage",
            "Neither UM letter asks for payment: each gives notice and asks for written confirmation of coverage and limits",
            "Harbor Point's letter covers the MedPay claim as well as Host UM; MedPay recorded outside the stack, and its claim details given to John Doe the same day for his first provider, with no promise of what it pays",
            "Bluewater notice requests the Declaration Page and the signed UM rejection form (03/14/2024), and records the collision option ($500 deductible) for the Civic",
            "Same day: John Doe told to preserve the doorbell-camera video from 2214 Maple Hollow Rd",
            "All five routed for Atty. Thorne's signature and sent 02/17/2026 by preferred method; acknowledgement due by 02/19/2026, follow-up calendared for 02/20/2026 if none"
          ]
        },
        ops: [
          ["Claim numbers and delivery methods logged", "Generate the five letters from the template", "CMS → Documents → Outgoing", "Five drafts, each with Attn line, insured, number and DOL"],
          ["Drafts complete", "Route the set for signature", "CMS → Tasks", "Atty. Thorne's signature on all five before any is sent"],
          ["Letters sent 02/17/2026", "Log method and time; calendar the acknowledgement checks", "CMS → Communications Log · Calendar", "Acknowledgement due 02/19/2026; follow-up 02/20/2026 for any carrier still silent"]
        ],
        best: [
          "Read each letter against the claim-call log before it goes for signature.",
          "Tell the client what the carve-out allows: the PD adjuster may call him about the Civic, and about nothing else.",
          "Pitfall: one letter copied five times with the insured left as Robert Smith.",
          "Pitfall: sending before signature because a carrier asked for the LOR “today”."
        ],
        sources: ["D1#21", "LSH Claims Specialist: LOR drafting, contents, recipients and delivery", "LSH Claims Specialist: information protection on third-party claims, LOR acknowledgement", "Newly authored: UM notice at set-up (notice, not demand)"],
        rubric: {
          ai: [
            ["Letter set complete", 15, "Five letters: three LORs and two notices"],
            ["Addressing and identifiers", 20, "Attn lines, insureds, claim, policy and member numbers and DOL all correct"],
            ["Requests and carve-out", 15, "Limits, additional coverage, Declaration Pages and preservation (including EDR data) requested; PD carve-out with 5 business days from the letter date to inspect, in Keystone's letter only"],
            ["Delivery and follow-up", 10, "Sent 02/17/2026 by preferred method; acknowledgement due 02/19/2026; follow-up 02/20/2026"]
          ],
          trainer: [
            ["Judgment", 25, "Keystone's letter limited to the client's name; no UM letter asks for payment; MedPay tied to the treatment start without a promise"],
            ["Authority boundary", 15, "Routed for Atty. Thorne's signature; nothing signed or sent on the CM's own authority"]
          ]
        },
        notes: [
          "Hand out the claim numbers and the call log and nothing else, and let them build the set. The graded judgment is in two places: what Keystone's letter leaves out, and what the UM letters don't ask for.",
          "Ask: “What goes in the Attn line for Cardinal State?” A trainee who writes a name has invented a fact. “Attn: Claims Department” is the rule until an adjuster is assigned.",
          "Check every insured line. Kevin Alvarez (Harbor Point) and Margaret Doe (Cardinal State) are the two most often swapped, or left as John Doe.",
          "Any letter not routed to Atty. Thorne for signature fails the UPL gate, however good it is."
        ]
      },

      {
        kind: "lesson", id: "d2m1-l2", compact: true,
        title: "Coverage Verification Tracking & Follow-Up Deadlines",
        topic: "From “reported” to “confirmed in writing”, with a date on every open item",
        visual: "A horizontal five-stage status track across the upper half — REPORTED → NOTICED → ACKNOWLEDGED → DISCLOSED → CONFIRMED IN WRITING — each stage a navy chip with an orange numbered badge, the last edged in green. Beneath it, three swim rows, one per stack layer, each with a marker where that layer stood on 03/11/2026: Host UM and Relative UM at the green end with their dates in mono pills (03/02, 03/09); BI held short in orange, labelled WRITTEN REQUEST PENDING, with a dashed line to a future pill, 03/20. Bottom strip: a calendar band with the firm cadence (24–48 h · third business day · dated next follow-up) and behind it, in red outline, REGULATORY BACKSTOP · CONFIRM THE RULE. The argument: a layer is verified only at the green end.",
        tell: {
          why: "An unverified coverage fact is a guess the file is built on. Both UM carriers confirmed coverage in writing by 03/09/2026; Keystone held its BI limit until 03/20/2026. The matrix shows it: a source behind every “confirmed”, a date on every open item.",
          rules: [
            "The Coverage Matrix is the single record of coverage: one row each: carrier, insured, claim number, adjuster and contact, limit and type, status, source and date, next follow-up.",
            "A limit is preliminary until a Declaration Page or Coverage Letter confirms it, and so is the projection; re-project when coverage changes. A phone figure, Police Report or client's memory is a lead: record its source; never quote it to John Doe.",
            "Read the Declaration Page line by line: named insured, policy number, a policy period covering 02/06/2026, the insured vehicle and VIN, coverages and limits, deductibles, listed or excluded drivers, endorsements.",
            "Record the limit type: Keystone's Declaration Page shows BI $10,000 per person, the cap on one injured person's claim. Per-accident, aggregate and combined single limits read differently; ask when unclear.",
            "Ask each UM carrier for its form in writing: add-on, or reduced by the BI payment. Harbor Point confirmed on 03/02/2026: add-on (excess), no MedPay non-duplication, no reimbursement right on MedPay.",
            "Track everything; stack only three layers: $10,000 BI + $20,000 Host UM + $10,000 Relative UM = $40,000. MedPay ($5,000), Keystone's PD coverage ($25,000) and Bluewater's collision coverage are tracked, never added.",
            "Verify exclusions and gaps as carefully as limits. John Doe rejected UM on his Bluewater policy in writing (03/14/2024): the signed form goes in the file, so the zero is verified, not assumed.",
            "Firm cadence: a claim not opened on the call, follow up in 24–48 hours; an LOR not acknowledged, by the third business day; any other open request, a dated next follow-up within two business days. A past date with nothing logged is an audit failure.",
            "Regulatory backstop: many states set deadlines for a carrier to acknowledge a claim and answer written communications; some require limits disclosure on a qualifying written request. Confirm the governing rule; docket it.",
            "The policies set John Doe's duties too: prompt notice, proof of loss for MedPay, and any UM notice or limitation rule separate from the 02/06/2028 SOL. Atty. Thorne confirms each; you docket it."
          ],
          upl: [
            "You record, chase and calendar coverage facts. Whether a policy form, exclusion or rejection applies, whether a carrier has missed a regulatory deadline, and whether to complain to a regulator or allege bad faith are Atty. Thorne's calls."
          ]
        },
        show: {
          caption: "Five statuses, and where each layer stood",
          type: "table",
          head: ["Status", "What proves it", "On John Doe's file"],
          rows: [
            ["Reported", "Claim number and adjuster (or “none yet”) logged", "Opened by phone 02/16–02/17/2026"],
            ["Noticed", "LOR served by preferred method, delivery logged", "Five letters out 02/17/2026"],
            ["Acknowledged", "Written receipt; if none, follow up by business day 3", "Cardinal State assigns Teresa Okafor 03/03/2026"],
            ["Disclosed", "A limit stated by phone or letter; still preliminary", "Keystone: verbal at set-up only; nothing in writing before a written request"],
            ["Confirmed in writing", "Dec Page or Coverage Letter, with source and date", "Harbor Point 03/02 · Cardinal State 03/09 · Keystone 03/20/2026"]
          ]
        },
        ops: [
          ["Written coverage confirmation arrives", "Enter limit, form and terms with source and date; update the status", "CMS → Insurance tab → Coverage Matrix", "“Confirmed in writing” only with the document attached"],
          ["Adjuster assigned (Teresa Okafor, 03/03/2026)", "Replace “not yet assigned” with name and direct contact; re-address correspondence", "CMS → Insurance tab · Parties", "No “not yet assigned” entry after the assignment date"],
          ["A follow-up date arrives with the item still open", "Follow up, log the result, set the next date", "CMS → Calendar · Communications Log", "No open item carries a past follow-up date"],
          ["Regulatory or policy deadline identified", "Have Atty. Thorne confirm the rule, then docket it", "CMS → Tasks → Escalate · Calendar", "Each deadline docketed with its source, marked confirmed by counsel"]
        ],
        best: [
          "Record a verbal limit the moment it is given, marked verbal: an early baseline, not a confirmation.",
          "Keep a paper trail on every request to Keystone: it wants formal written requests, proof of representation and supporting documents.",
          "Check that each Declaration Page's policy period covers 02/06/2026 and that its vehicle is the one in the collision.",
          "Pitfall: adding MedPay or PD coverage to the stack total.",
          "Pitfall: marking a limit confirmed from a Police Report or a phone call.",
          "Pitfall: an open request with no next date. It stays open forever."
        ],
        sources: ["D1#18", "D1#19", "D1#20", "LSH Claims Specialist: Declaration Pages, certified copy of policy, policy limits and limit types", "LSH Claims Specialist: follow-up cadence, LOR acknowledgement, statement of insurance disclosure", "Newly authored: verifying the UM form and MedPay terms at set-up; the regulatory and policy deadline backstop"],
        rubric: {
          ai: [
            ["Status discipline", 20, "Each layer's status matches its source; nothing confirmed without a written document"],
            ["Stack integrity", 15, "$40,000; MedPay, Keystone PD and Bluewater tracked outside it"],
            ["UM terms recorded", 10, "Harbor Point add-on, no MedPay non-duplication, no MedPay reimbursement right, sourced 03/02/2026"],
            ["Follow-up hygiene", 15, "Every open item has a future follow-up date; the firm cadence applied"]
          ],
          trainer: [
            ["Deadline judgment", 20, "Treats regulatory and policy deadlines as rules to confirm with counsel and docket, not to quote"],
            ["UPL boundary", 20, "No coverage interpretation or regulatory threat offered to a carrier or the client"]
          ]
        },
        notes: [
          "Put the five statuses on the board and ask where Keystone's BI stood on 03/11/2026. The right answer is “not confirmed”: nobody on the file has seen its Declaration Page until 03/20/2026.",
          "Ask the room: “What is the difference between a follow-up you made and one you scheduled?” A date in the past with nothing logged is the second kind.",
          "Keep regulatory deadlines generic. The rule differs by state; the CM's job is to have Atty. Thorne confirm it and to docket it, never to quote it at an adjuster.",
          "Spend a minute on Harbor Point's add-on confirmation. Had its UM been reduced by the BI payment, Host UM would have shown $20,000 minus $10,000 = $10,000, and the stack $30,000, not $40,000, assuming Cardinal State's form is add-on, which is verified the same way. That is why the form is verified, not assumed."
        ]
      },

      {
        kind: "activity", id: "d2m1-a2", compact: true,
        title: "CMS Coverage Matrix Audit",
        topic: "Skill Activity 2 — find what the matrix gets wrong",
        visual: "A full-width CMS Coverage Matrix in a white card with a navy header bar: six rows, deliberately imperfect. A navy rail on the left marks the stack rows; MedPay sits wrongly inside it as row 4. A thin grey divider separates the outside-the-stack rows on a grey rail. The footer total, $45,000, is set large. On the answer reveal only, hollow red audit rings appear on the planted errors, the footer is struck through in red with $40,000 beside it, and the MedPay row drops below the divider. Right margin: an audit-note card addressed to ATTY. ELIJAH THORNE with three headed lines — CONFIRMED IN WRITING · PRELIMINARY · ESCALATED. The argument: the matrix is only as good as the document behind each cell.",
        act: {
          scenario: "File date 03/11/2026. A colleague kept John Doe's Coverage Matrix. In the file: Harbor Point's written confirmation (03/02/2026), Cardinal State's assignment of Teresa Okafor (03/03/2026) and Coverage Letter (03/09/2026), and Keystone's written request with authorizations, sent, with no Declaration Page yet. This morning Summit Imaging asked for an LOP; declined, because MedPay applies first.",
          prompt: "Audit the staged Coverage Matrix against the documents in the file. Find every error, correct it, and cite the document and date that prove each correction. Restore the stack total, clear every past-due follow-up by acting on it and setting a new date, and leave correct rows alone. Then route a three-line audit note to Atty. Thorne: confirmed in writing, still preliminary, escalated. Graded judgment: the BI status, and what you may and may not mark confirmed today.",
          tool: "CMS → Insurance tab → Coverage Matrix · CMS → Documents · Call Simulator → AI Adjuster: Dana Whitfield, Keystone Mutual",
          output: "A corrected Coverage Matrix totalling $40,000, every status sourced and every open item dated, with an audit note routed to Atty. Thorne.",
          checkpoints: [
            "BI: “Confirmed · Police Report” corrected to “Preliminary · verbal, set-up call; written request with authorizations sent”; Keystone has confirmed nothing in writing, and its Declaration Page does not arrive until 03/20/2026",
            "BI follow-up 03/05/2026 is past due with nothing logged: followed up with Dana Whitfield on 03/11/2026, the call logged, the next date set within the firm's cadence (by 03/13/2026, two business days)",
            "Host UM form recorded: add-on (excess), not reduced by the BI payment, no MedPay non-duplication; source Harbor Point's letter of 03/02/2026",
            "Relative UM adjuster “Not yet assigned” replaced with Teresa Okafor, assigned 03/03/2026",
            "MedPay moved out of the stack: it pays Medical Bills, not the claim (Harbor Point, $5,000, no reimbursement right per 03/02/2026)",
            "Stack total corrected from $45,000 ($40,000 + $5,000 MedPay) to $40,000 ($10,000 + $20,000 + $10,000)",
            "Bluewater: “UM: none” has no source; the signed UM rejection form (03/14/2024) chased from Bluewater, filed as the source when it arrives, with a dated follow-up until then",
            "Keystone PD row kept outside the stack, neither moved in nor deleted: Leah Moran, PD liability accepted 02/17/2026; its $25,000 limit marked preliminary until Keystone's Declaration Page (03/20/2026)",
            "Every correction cites its document and date; no row reads “confirmed” without one",
            "Relative UM: coverage confirmed 03/09/2026 (resident relative, non-owned vehicle); the letter does not state its UM form or the other-insurance clause that places it behind Host UM. Written request to Teresa Okafor for both and for a certified copy of the policy, with a dated follow-up (credited, not a false positive)",
            "Audit note to Atty. Thorne: confirmed in writing (Host UM; Relative UM coverage), preliminary (BI; Relative UM form and excess clause), escalated (the missing Bluewater form; any coverage question)"
          ]
        },
        show: {
          caption: "The staged matrix as found on 03/11/2026 · footer: “Stack total $45,000”",
          type: "table",
          head: ["Row", "Carrier · claim · adjuster", "Limit · status · source", "Next follow-up"],
          rows: [
            ["1 · BI", "Keystone · KM-26-440871 · Dana Whitfield", "$10,000 · Confirmed · Police Report", "03/05/2026 (limits request)"],
            ["2 · Host UM", "Harbor Point · HP-26-7741 · Marcus Bell", "$20,000 · Confirmed 03/02/2026 · UM form: —", "None"],
            ["3 · Relative UM", "Cardinal State · CS-26-20355 · Not yet assigned", "$10,000 · Confirmed 03/09/2026", "None"],
            ["4 · MedPay", "Harbor Point · MedPay", "$5,000 · Confirmed 03/02/2026", "None"],
            ["Outside · PD", "Keystone · Leah Moran", "$25,000 · PD liability accepted 02/17/2026", "Per PD file"],
            ["Outside · Bluewater", "Bluewater Auto · John Doe's policy", "UM: none · source: —", "None"]
          ]
        },
        ops: [
          ["Coverage Matrix audit (03/11/2026)", "Check every row against the document that should prove it", "CMS → Insurance tab → Coverage Matrix · Documents", "Each correction cites a document and its date"],
          ["Past-due follow-up found", "Follow up with Dana Whitfield today; log it; set the next date", "Call Simulator → AI Adjuster: Dana Whitfield, Keystone Mutual · CMS → Calendar", "Logged 03/11/2026; next date by 03/13/2026"],
          ["Audit complete", "Route the audit note", "CMS → Tasks → Escalate", "Note separates confirmed, preliminary and escalated items"]
        ],
        best: [
          "Audit against documents, not memory: open the letter before you change the cell.",
          "A correct row left alone is part of the grade.",
          "Pitfall: fixing the total without finding why it was wrong.",
          "Pitfall: marking BI confirmed because $10,000 is what everyone expects."
        ],
        sources: ["D1#18", "D1#20", "LSH Claims Specialist: Declaration Pages, coverage verification and follow-up", "Newly authored: verifying the UM form and MedPay terms at set-up"],
        rubric: {
          ai: [
            ["Errors found", 30, "All six planted errors identified (5 points each)"],
            ["Corrections sourced", 15, "Each correction cites the document and date that proves it"],
            ["Stack total", 10, "$40,000 restored; MedPay moved out of the stack"],
            ["Follow-up dates", 5, "No past follow-up remains; BI follow-up made and re-set by 03/13/2026"]
          ],
          trainer: [
            ["Audit judgment", 20, "BI held preliminary; no false positives on the correct rows"],
            ["Audit note quality", 10, "Atty. Thorne can act on it in ten seconds"],
            ["UPL boundary", 10, "Coverage questions (UM form, the rejection) escalated, not decided"]
          ]
        },
        notes: [
          "Give them the staged matrix and the file documents and nothing else. Don't say how many errors there are; finding all six is the grade. The six: BI marked confirmed; the past-due BI follow-up; the blank Host UM form; Cardinal State's adjuster; MedPay in the stack ($45,000); the missing Bluewater rejection form. A seventh, unplanted finding, Cardinal State's unstated UM form and excess clause, is correct: credit it outside the six.",
          "The BI row is the graded judgment. On 03/11/2026 the only defensible status is preliminary: Keystone's Declaration Page arrives 03/20/2026.",
          "Watch for false positives. The Keystone PD row belongs outside the stack: marking its $25,000 preliminary is correct; moving it into the stack or deleting it is the false positive, and confuses “tracked” with “stacked”.",
          "Read one audit note aloud as Atty. Thorne would. In ten seconds he should know what is confirmed, what is not, and what he must decide."
        ]
      },

      {
        kind: "check", id: "d2m1-kc",
        title: "Coverage Setup Verification Check",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split: the cream question panel with orange-numbered questions, the navy Self-Summary card, the 1–5 skill ladder, and the 60/40 strip with the separate red UPL gate. Module-specific addition: a COVERAGE STATUS STRIP between the panels, five carrier chips in a row — KEYSTONE · HARBOR POINT · CARDINAL STATE · BLUEWATER · PEACH STATE — each with an empty mono status pill the trainee fills (confirmed in writing, preliminary, or notice only) as a self-audit before answering. The three stack chips sit on a navy rail; the two notice chips on grey.",
        check: {
          questions: [
            "Name every coverage on John Doe's file, whose it is and what it pays. Which three are the $40,000 Recovery Stack, and why do the others stay out of it?",
            "Before the letters went out, you built John Doe's Policy Stack in the CMS. Give each layer's carrier, claim number, limit, whether it is first- or third-party, and the order it must be pursued in.",
            "List the five letters that left John Doe's file on 02/17/2026. For each, give the insured it named and how it was addressed."
          ],
          summary: [
            "Summarize, in your own words, what you learned setting up and verifying John Doe's coverage: the principles, not the clicks.",
            "Articulate your strategy: on 03/11/2026 Keystone's limit is still unconfirmed. What is your next action on the coverage file, and why is it the right one rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Sorting each coverage by whose it is and what it pays",
            "Building the Policy Stack in the CMS before the letters go out",
            "Drafting an LOR with every required component",
            "Addressing each letter to the right carrier, insured and adjuster",
            "Protecting client information in third-party correspondence",
            "Tracking each coverage from reported to confirmed in writing",
            "Keeping follow-ups and regulatory deadlines dated and current",
            "Holding the UPL boundary with adjusters"
          ]
        },
        best: [
          "Answer with the file's own carriers, claim numbers and dates, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D1#18", "D1#20", "LSH Claims Specialist: LOR components, information protection, acknowledgement and limits disclosure"],
        rubric: {
          ai: [
            ["LOR mechanics", 15, "Five letters, insureds and Attn lines correct; third-party letter limited to the client's name"],
            ["Verification status", 20, "Host UM 03/02/2026 and Relative UM 03/09/2026 confirmed in writing; BI preliminary until 03/20/2026"],
            ["Stack discipline", 15, "$40,000 stack; MedPay and Keystone PD tracked outside it; add-on effect stated correctly"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Gives the adjuster nothing on the gap; escalates to Atty. Thorne where authority is required"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 6 is the pressure scenario. The right answer gives Dana Whitfield nothing on the gap, holds the written limits request as it stands, logs the call and tells Atty. Thorne. The gap is explained once, in the demand he approves, through the Medical Records and the documents the client call identified; the recorded call itself is privileged and never goes to a carrier.",
          "Question 4 separates trainees who know the dates from those who know the sources. Push for the document behind each “confirmed”.",
          "Compare each self-rating with the score. A 5 next to a $45,000 stack is a coaching conversation.",
          "UPL is a gate: a strong score does not survive a letter signed for the attorney or a coverage opinion given to a carrier or the client."
        ]
      }

      ]
    },

    /* ---------- DAY 2 · MODULE 2 ---------- */
    {
      n: 2, id: "d2m2",
      title: "Treatment Phase Operations, LOP Issuance & Provider Oversight",
      about: "Keeping John Doe's treatment moving and paid for: every coverage and the Payer-First Principle, the Health Plan's reimbursement right and the Regulatory Triple-Check, LOPs on counsel's terms, the MedPay ledger, and the A-C-T protocol the day care breaks down.",
      quiz: [
        {q: "On 03/11/2026 Summit Imaging asks for an LOP for John Doe's $2,395.00 MRI. Harbor Point MedPay has $3,675.00 left. What do you do?",
         opts: ["Prepare the LOP for Atty. Thorne's approval, since the provider asked for one", "Decline the LOP and route the bill to MedPay, which applies first", "Send the bill to Peach State first, to save MedPay for later", "Tell Summit it will be paid in full at settlement"],
         a: 1, r: "The Payer-First Principle: MedPay pays regardless of fault, and Harbor Point confirmed it has no reimbursement right, so the MRI is paid with nothing to repay. An LOP would have turned it into a $2,395.00 lien against John Doe's net. Never promise a provider payment at settlement."},
        {q: "Crescent Pain & Spine billed $3,400.00 for the 05/15/2026 injection, and Peach State paid $1,860.00. Why does Peach State's reimbursement claim start at $1,860.00?",
         opts: ["Peach State always discounts its claims by about 45%", "Crescent is in network: the plan paid its contract rate, Crescent wrote off the rest and cannot balance-bill, so the plan can only claim what it paid", "The other $1,540.00 is owed by MedPay", "John Doe still owes Crescent the $1,540.00, so it is left out of the plan's claim"],
         a: 1, r: "A Health Plan's reimbursement claim is what it paid, not what was billed. In network, the $1,540.00 difference is written off for good. That is why the Health Plan comes before an LOP, which carries the full billed amount into the recovery."},
        {q: "Peach State's 06/03/2026 EOB for Crescent's injection shows billed $3,400.00, plan paid $1,860.00 and member responsibility $0.00. On 07/01/2026 Crescent mails John Doe a statement for $1,540.00. What is it?",
         opts: ["A balance John Doe owes, now that his insurance has processed the claim", "A new lien to add to the Lien Tracker at $1,540.00", "A balance bill of the contractual write-off: document it, route it to Atty. Thorne and ask Crescent in writing to correct the account", "Peach State's reimbursement claim"],
         a: 2, r: "In network, Crescent agreed to accept the allowed $1,860.00 as payment in full (CO-45), and the EOB shows John Doe's share as $0.00. The $1,540.00 is the write-off: not a debt and not a lien. Whether he owes it is Atty. Thorne's call; you document it, route it, request the correction in writing and tell John Doe what you are doing."},
        {q: "Where does Peach State's reimbursement claim on Crescent's bill start?",
         opts: ["$3,400.00, the amount billed", "$1,860.00, what the plan paid", "$1,540.00, the contractual adjustment", "$0.00, because member responsibility is $0.00"],
         a: 1, r: "A plan can claim back only what it paid. The EOB's plan-paid line, $1,860.00 (EFT PSH-EFT-0603-77815), is where its claim starts, and its itemized lien must match its EOBs line by line."},
        {q: "A provider sends Harbor Point a new bill for John Doe on 07/08/2026. What happens, and what do you do?",
         opts: ["Harbor Point pays it from the $20,000 Host UM limit", "It comes back with a notice of exhaustion, because MedPay's $5,000.00 was used up on 06/26/2026; the bill goes to the next payer in the Payer Order", "Harbor Point pays it and asks John Doe to repay it from his recovery", "It is added to the $40,000 stack"],
         a: 1, r: "Harbor Point's payment history (RS31) shows five checks totalling $5,000.00, the last on 06/26/2026, and says bills received after exhaustion are returned with a notice of exhaustion. MedPay payments don't reduce the UM limit, Harbor Point asserts no reimbursement right, and MedPay is never part of the stack."},
        {q: "On 03/11/2026 Summit Imaging Center asks for an LOP before John Doe's cervical MRI. What do you do?",
         opts: ["Issue the LOP on the firm's template so the MRI isn't delayed", "Ask Peach State to pre-authorize the MRI, and issue an LOP for anything it won't pay", "Decline: MedPay pays first, so give Summit the Harbor Point MedPay billing details and log the decline", "Tell Summit the firm will guarantee its bill at settlement"],
         a: 2, r: "Payer Order: MedPay → Peach State → LOP. MedPay had $3,675.00 left, enough for the $2,395.00 MRI. An unnecessary LOP turns a bill an earlier payer would cover into a lien on John Doe's net, and only Atty. Thorne sets LOP terms or commits the firm to anything."},
        {q: "Harbor Point MedPay has paid $685.00, $640.00, $2,395.00 and $640.00 in date order. How much is left for Lakeside Orthopedics' 06/12/2026 MMI visit?",
         opts: ["$640.00", "$1,280.00", "$0.00", "$4,360.00"],
         a: 0, r: "$685.00 + $640.00 + $2,395.00 + $640.00 = $4,360.00; $5,000.00 – $4,360.00 = $640.00. The 06/12/2026 visit uses it, and MedPay is exhausted at exactly $5,000.00."},
        {q: "Riverton Spine & Rehab's missed-visit alert reaches you on 04/08/2026. Under A-C-T, what comes first?",
         opts: ["Ask Keystone PD to extend the rental", "Call John Doe to assess the barrier, and whether it is a medical or a legal danger", "Write the GIRP note and close the alert", "Tell Atty. Thorne that John Doe is non-compliant"],
         a: 1, r: "Assess comes first: the 04/08/2026 call finds the barrier (no transport). Coordinate (the rental request, the evening slots) and Track (attendance on 04/21 and 04/23/2026) follow from what the call finds."},
        {q: "Keystone will point to John Doe's three chiropractic visits in 2021. The Case Manager's job is to:",
         opts: ["Leave them out of the file, since they are unrelated", "Tell John Doe the eggshell rule means they can't hurt his claim", "Argue to the adjuster that a prior injury doesn't matter", "Document the baseline (low back, resolved, no prior neck complaints), distinguish it from the neck injury, and route it to Atty. Thorne"],
         a: 3, r: "Highlight the prior, never hide it. The CM documents the pre-morbid baseline and the difference in body region; whether aggravation or the eggshell rule matters at all is Atty. Thorne's call."},
        {q: "The correct Payer Order for John Doe's Medical Bills is:",
         opts: ["Health Plan → PIP/MedPay → LOP/provider liens", "PIP/MedPay → private health insurance → LOP/provider liens", "LOP/provider liens → Health Plan → PIP/MedPay", "Robert Smith's BI carrier pays each bill as it arrives"],
         a: 1, r: "The Regulatory Triple-Check Payer Order: PIP/MedPay, then private health insurance, then LOP/provider liens."},
        {q: "Which of these is NOT part of the Regulatory Triple-Check?",
         opts: ["A claim-specific HIPAA authorization that names the incident date", "Medicare/Medicaid (BCRC) reporting where the client is 65+ or on SSDI", "Payer Order and subrogation management", "The Time-Limit Demand"],
         a: 3, r: "The triple-check is HIPAA, Medicare/Medicaid reporting, and the Payer Order. Demands come on Day 3."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d2m1-cov",
        title: "Coverages & the Payer-First Principle",
        topic: "Every policy on John Doe's file, what it pays, and who pays first",
        visual: "A two-tier slide. The top tier is a coverage map: eight cards in three colour groups. Navy, THIRD-PARTY: Keystone BI $10,000 · Keystone PD $25,000. Orange, FIRST-PARTY: Harbor Point Host UM $20,000 · Cardinal State Relative UM $10,000 · Harbor Point MedPay $5,000 · Bluewater collision ($500 deductible). Green, HEALTH: Peach State Health Plan. A crossed-out grey card: Bluewater UM, rejected 03/14/2024. Each card carries a small tag for what it pays: THE CLAIM, THE BILLS or THE CAR, and only the three THE CLAIM cards are joined by a bracket labelled RECOVERY STACK $40,000. The bottom tier is a staircase running down left to right, titled THE PAYER-FIRST PRINCIPLE: MedPay/PIP → Health Plan → Letter of Protection, each step lower than the last, labelled pays regardless of fault · contract rate, reimbursement right · paid from the recovery. Bottom-right, an orange callout: “Out of order = a lien that didn't have to exist.”",
        tell: {
          why: "Every policy on a file pays a different thing, and only some of them pay the Medical Bills while the claim is open. The Payer-First Principle sends each bill to the payer that must pay it first: the no-fault medical coverage, then the Health Plan, and a Letter of Protection only last. In that order a bill is paid once, at the lowest cost, with as little as possible to repay; out of order, the same bill comes back as a lien against John Doe's recovery.",
          rules: [
            "Sort every coverage by whose it is. Third-party coverage is the at-fault driver's: Robert Smith's Keystone BI and PD. First-party coverage answers to John Doe's side: Host UM, Relative UM, MedPay and collision. The Health Plan is his own benefit plan, through Northgate Distribution.",
            "Sort it again by what it pays. BI and UM pay the claim at the end; MedPay, PIP and the Health Plan pay the Medical Bills while it is open; PD and collision pay for the car. Only BI and UM are the $40,000 Recovery Stack.",
            "MedPay pays reasonable accident Medical Bills regardless of fault, up to its limit, and never wages. PIP, where a state requires it, also pays a share of lost wages and replacement services. This file has Harbor Point MedPay, $5,000, and no PIP: verify PIP on every file; never assume it.",
            "UM/UIM is reached by status, not ownership. John Doe reaches Host UM as an occupant of Kevin Alvarez's 2020 Ford Escape, and Relative UM as a resident relative of Margaret Doe. His own Bluewater policy adds nothing: UM/UIM was rejected in writing on 03/14/2024.",
            "The Payer-First Principle: MedPay (or PIP) first, the Health Plan next, a Letter of Protection last, and only for care the earlier payers can't carry.",
            "MedPay goes first because it pays regardless of fault, and Harbor Point confirmed in writing (03/02/2026) that it has no reimbursement right against John Doe's recovery: every MedPay dollar is a bill that never becomes a lien.",
            "The Health Plan comes next because an in-network provider is paid at the contract rate and cannot balance-bill. Crescent Pain & Spine billed $3,400.00; Peach State paid $1,860.00. Only what the plan paid can come back as its reimbursement claim.",
            "A Letter of Protection comes last. Riverton Spine & Rehab is out of network for Peach State, so its care runs under an LOP; Summit Imaging's LOP request (03/11/2026) was declined, because MedPay applies first.",
            "Medicare and Medicaid pay after no-fault and liability coverage. A client on Medicare, Medicaid or SSDI is reported to the BCRC; John Doe is 34, so the file records his verified SSDI status.",
            "The order is a default: providers bill whom they bill. Track each payer's ledger, what it paid on which bill, and never re-route a claim another payer has paid. Who is primary when policies conflict is Atty. Thorne's call."
          ],
          upl: [
            "You may identify the coverages, explain what each one pays and route bills in the default order. Whether a policy applies, which is primary when two conflict, and whether a lien is enforceable are Atty. Thorne's calls."
          ]
        },
        show: {
          caption: "Every coverage on John Doe's file, and where it sits",
          type: "table",
          head: ["Coverage", "Carrier · limit", "Pays", "Where it sits"],
          rows: [
            ["BI liability (third-party)", "Keystone Mutual · $10,000 per person", "The claim", "Recovery Stack, layer 1"],
            ["Host UM (first-party)", "Harbor Point · $20,000, add-on", "The claim, once BI is exhausted", "Recovery Stack, layer 2"],
            ["Relative UM (first-party)", "Cardinal State Mutual · $10,000", "The claim, behind Host UM", "Recovery Stack, layer 3"],
            ["MedPay (first-party, no-fault)", "Harbor Point · $5,000", "Medical Bills, regardless of fault", "Payer Order 1st; no payback"],
            ["Health Plan", "Peach State Health Plan", "Medical Bills, at the contract rate", "Payer Order 2nd; reimbursement right"],
            ["PD liability (third-party)", "Keystone Mutual · $25,000", "The Civic, the rental, Loss of Use", "Outside the stack"],
            ["Collision (first-party)", "Bluewater · $500 deductible", "The Civic, regardless of fault", "Outside the stack (his UM: rejected 03/14/2024)"]
          ]
        },
        ops: [
          ["Each claim is opened", "List every coverage, its carrier and what it pays", "CMS → Insurance tab", "Each tagged third-party, first-party or health"],
          ["Coverage confirmed in writing", "Place it: Recovery Stack, Payer Order or outside both", "CMS → Insurance tab → Coverage Matrix", "Stack $40,000; MedPay, PD and collision outside it"],
          ["A provider asks whom to bill", "Route it by the Payer-First order", "CMS → Insurance tab → MedPay ledger", "MedPay first, Peach State next, an LOP last"],
          ["A provider asks for an LOP", "Check MedPay and network status first", "CMS → Liens → LOP register", "Payer check recorded; Atty. Thorne approves any LOP"],
          ["A payer pays a bill", "Post payer, bill and amount on its ledger", "CMS → Insurance tab → MedPay ledger · CMS → Liens", "Every ledger current; no paid claim re-routed"]
        ],
        best: [
          "Verify every coverage in writing: a dated Declaration Page or Coverage Letter.",
          "Confirm the Health Plan was active on the date of loss: Peach State began 02/01/2026.",
          "Ask each new provider whether it bills MedPay or the Health Plan before the first visit.",
          "Keep the Payer Order and the Recovery Stack on separate lines of the Coverage Matrix.",
          "Pitfall: issuing an LOP to a provider MedPay or the Health Plan would have paid.",
          "Pitfall: adding MedPay, PD or collision coverage to the $40,000 stack.",
          "Pitfall: assuming PIP, or assuming the client's own policy carries UM."
        ],
        sources: ["D1#18", "D2#20", "D2#23", "D2#24", "D1 Task Overview: Billing, Resolution & Closing"],
        rubric: {
          ai: [
            ["Coverages sorted", 20, "Each coverage named by whose it is and what it pays: the claim, the bills or the car"],
            ["Payer-First order", 20, "MedPay → Peach State → LOP, with the reason for each step"],
            ["Stack kept clean", 20, "$40,000 is BI + Host UM + Relative UM only; MedPay, PD and collision tracked outside it"]
          ],
          trainer: [
            ["Grasps the consequence", 25, "Explains how an out-of-order LOP becomes a lien against the client's net"],
            ["UPL boundary", 15, "Applicability, primacy and lien enforceability left to Atty. Thorne"]
          ]
        },
        notes: [
          "Open with the question the room always merges: “Who pays the bills now?” is not “Who pays the claim later?” Put the two columns on the board before the slide.",
          "Walk the table row by row: whose policy, what does it pay, where does it sit? Let the room place MedPay before you do.",
          "Summit Imaging is the lesson in one fact: $2,395.00 paid by MedPay with nothing to repay, instead of a $2,395.00 LOP balance against John Doe's net.",
          "Crescent is the Health Plan step: $3,400.00 billed, $1,860.00 paid, $1,540.00 written off for good. Peach State's reimbursement claim can only start from what it paid.",
          "Ask why John Doe reaches $30,000 of UM at all. He was a passenger: had he been driving his own Civic, his rejected Bluewater UM would leave only the $10,000 BI.",
          "Close on the boundary: you route bills in the default order; when two policies both claim to pay second, that is Atty. Thorne's call."
        ]
      },

      {
        kind: "lesson", id: "d2m2-l1", compact: true,
        title: "LOP Issuance Guidelines, Provider Coordination & MedPay Limits",
        topic: "Who pays which bill, and what only counsel may promise",
        visual: "Centre-right, a cream ledger card with a navy header bar, MEDPAY · HARBOR POINT · $5,000, its five rows in mono type. Above it a horizontal fuel gauge drains from navy to empty in five orange-numbered steps, the last landing on $0.00 at 06/12/2026 in a red danger chip. Left third, a vertical payer rail with orange badges ① MEDPAY ② PEACH STATE ③ LOP; the LOP step is a navy card stamped COUNSEL-APPROVED TERMS. Bottom strip, two provider chips side by side: RIVERTON SPINE & REHAB · LOP ✓ and SUMMIT IMAGING · LOP ✗ → MEDPAY. The argument: an LOP is the last rung of the Payer Order, not the first answer to a provider who asks.",
        tell: {
          why: "Treatment is the file's engine room, and someone has to pay for it while the claim is open. On John Doe's file three payers stand in a default order: Harbor Point MedPay, then Peach State, then a Letter of Protection. An LOP issued out of order turns a bill an earlier payer would have paid into a lien against John Doe's net.",
          rules: [
            "The treatment-phase question changes from “What does he need?” to “Is the plan working?” Your three jobs: facilitation (transport, paperwork, scheduling), coordination (every provider on one plan), advocacy (step in when care is denied or stalls).",
            "Run the Payer Order: Harbor Point MedPay → Peach State → LOP. No PIP on this file; John Doe reaches the $5,000 MedPay as an occupant of Kevin Alvarez's 2020 Ford Escape.",
            "The order is a default: providers bill whom they bill. MedPay pays what it gets, in date order, never wages. Crescent Pain & Spine billed Peach State on 05/15/2026 with $640.00 of MedPay left: track both ledgers; never re-route a paid claim. Who is primary (coordination of benefits, governing law) is Atty. Thorne's call.",
            "An LOP is John Doe's signed agreement, acknowledged by the firm on Atty. Thorne's terms, that a provider is paid from any recovery. The firm guarantees nothing; John Doe stays liable whatever the outcome, as Atty. Thorne explains before he signs. Use one only where earlier payers can't: Riverton Spine & Rehab is out of network.",
            "LOP terms are Atty. Thorne's: his approved template, his signature, what happens if there is no recovery. You prepare, route, transmit once approved, and confirm receipt. Never promise a provider a payment amount, a reduction or a date.",
            "Decline an LOP an earlier payer makes unnecessary: Summit Imaging's 03/11/2026 MRI bill goes to MedPay. Every needless LOP is a lien on his net.",
            "Keep the LOP provider list current with balances from each itemized statement, so no bill surprises the $40,000 stack.",
            "Be the hub: warm handoffs (book the provider with him on the line), not phone numbers. Refuse mission creep: does this new problem block the treatment goal?",
            "Keep three loops closed: clinical (Riverton's PT notes match Dr. Reyes's orders), legal (his daily function, reported to Atty. Thorne), financial (the payer updated before a referral or authorization lapses).",
            "Cover all four care groups (restorative care, psychological support, equipment, rehab milestones) and guard each handoff (urgent care → chiropractic/PT → orthopedics → imaging → pain management): clients drop out there."
          ],
          upl: [
            "You may route bills, prepare an LOP on counsel's template, transmit it once Atty. Thorne approves, and tell a provider which payer to bill. You may not set LOP terms, sign for Atty. Thorne, promise any payment or reduction, or explain to John Doe what the LOP makes him liable for: that is counsel's."
          ]
        },
        show: {
          caption: "The MedPay ledger: paid in date order until $5,000.00 is gone",
          type: "table",
          head: ["Date", "Provider", "MedPay paid", "Running total", "Left of $5,000"],
          rows: [
            ["02/20/2026", "Riverton Urgent Care", "$685.00", "$685.00", "$4,315.00"],
            ["03/05/2026", "Lakeside Orthopedics", "$640.00", "$1,325.00", "$3,675.00"],
            ["03/13/2026", "Summit Imaging Center", "$2,395.00", "$3,720.00", "$1,280.00"],
            ["03/27/2026", "Lakeside Orthopedics", "$640.00", "$4,360.00", "$640.00"],
            ["06/12/2026", "Lakeside Orthopedics (MMI)", "$640.00", "$5,000.00", "$0.00 — exhausted"]
          ]
        },
        ops: [
          ["A provider asks for an LOP", "Run the Payer Order; prepare the LOP on counsel's template only for care MedPay and Peach State can't carry", "CMS → Documents → Outgoing → Route for approval", "Payer check recorded before routing; nothing sent without Atty. Thorne's approval"],
          ["MedPay pays a bill", "Post the payment, the running total and the balance left", "CMS → Insurance tab → MedPay ledger", "Running total ties to Harbor Point's payments; $5,000.00 reached on the 06/12/2026 visit, $0.00 left"],
          ["An LOP provider's itemized statement arrives", "Update the balance and check every line against the visits you tracked", "CMS → Liens → LOP register", "Balance current (through 04/02/2026: 16 visits × $185.00 = $2,960.00); every billed date is an attended visit"],
          ["A new referral or provider", "Warm handoff: book it with John Doe on the line and confirm the payer before the first visit", "Call Simulator → AI John Doe · CMS → Case File → Treatment timeline", "Appointment and payer recorded before the visit date"]
        ],
        best: [
          "Ask “Is the plan working?” at every treatment-phase contact.",
          "End every contact with John Doe: “What is the one thing that might get in the way of your treatment this week?”",
          "Reconcile conflicting provider statements at once. A PT note and an orthopedic note that disagree on John Doe's function are a documentation crisis.",
          "Tell John Doe which payer is handling which bill, as fact. Cost worry left unanswered is how a client stops going.",
          "Pitfall: issuing an LOP because a provider asked, before checking whether MedPay or Peach State pays first.",
          "Pitfall: telling a provider “you'll be paid in full at settlement.”",
          "Pitfall: mission creep, taking on every problem John Doe raises instead of the ones that block his treatment.",
          "Pitfall: sending Atty. Thorne raw records with no functional summary."
        ],
        sources: ["D1#24", "D1#26", "D1#30", "D1#35", "D1#39", "LSH Claims Specialist: MedPay vs. PIP (Medical Bills regardless of fault, no lost wages)", "Newly authored: LOP issuance guidelines and the MedPay exhaustion ledger"],
        rubric: {
          ai: [
            ["Payer Order", 20, "MedPay → Peach State → LOP applied to each bill; no PIP on this file"],
            ["MedPay ledger", 20, "Five payments in date order; running total reaches $5,000.00 on the 06/12/2026 visit; $0.00 left"],
            ["LOP decisions", 20, "LOP to Riverton Spine & Rehab (out of network); Summit Imaging's request declined because MedPay applies first"]
          ],
          trainer: [
            ["Coordination judgment", 20, "Sees the hub role (warm handoffs, three closed loops, guarded transitions) and avoids mission creep"],
            ["UPL boundary", 20, "No LOP terms set, no payment promised to a provider, no interpretation of the LOP for John Doe"]
          ]
        },
        notes: [
          "Open on the ledger with the right-hand column covered. Ask how much MedPay is left after the 03/27/2026 visit ($640.00), then uncover it. A trainee who can't keep this column can't decide an LOP request.",
          "Put to the room: “Riverton Spine & Rehab and Summit Imaging both asked for an LOP. Why did one get it and the other not?” The answer is the Payer Order, not the provider's preference.",
          "Watch for trainees who treat an LOP as free. It is a promise the firm keeps out of John Doe's recovery, and every dollar on it is a dollar Day 4 has to negotiate.",
          "Legal nuance: how MedPay's $5,000 is spent across providers, and what Harbor Point's 03/02/2026 confirmation of no reimbursement right means for the UM claim, are Atty. Thorne's calls. You record the facts and run the ledger."
        ]
      },

      {
        kind: "lesson", id: "d2m2-eob",
        title: "Explanation of Benefits (EOB) & MedPay",
        topic: "Reading what each payer paid, and what is still owed",
        visual: "Two documents side by side, each read line by line. Left, Peach State's Explanation of Benefits for claim PS-2605-449021, with a red stamp THIS IS NOT A BILL: six rows (Billed $3,400.00 · Allowed $1,860.00 · Contractual adjustment $1,540.00 · Deductible/copay $0.00 · Plan paid $1,860.00 · Member responsibility $0.00), each with an orange callout tag naming where it goes on the file (Specials · write-off, owed by nobody · Peach State's reimbursement claim · the most Crescent may bill). Right, Harbor Point's MedPay payment history: five checks in date order with a falling limit bar, $5,000.00 → $0.00, stamped EXHAUSTED 06/26/2026. Below, Crescent's 07/01/2026 patient statement for $1,540.00 with a red question mark, joined by a dashed line to the EOB's $0.00 member-responsibility row and labelled BALANCE BILL?",
        tell: {
          why: "Every payer reports what it did with a bill: Peach State in an Explanation of Benefits, Harbor Point in its MedPay payment history. Read line by line, they say what was billed, what was paid, what was written off and what John Doe may still owe. They are the proof behind the Medical Specials, every lien amount, and every answer you give a provider or John Doe about a balance.",
          rules: [
            "An EOB is a Health Plan's statement to its member of how it processed one claim, and it says so: THIS IS NOT A BILL. Peach State's EOB of 06/03/2026 (claim PS-2605-449021) covers Crescent Pain & Spine's 05/15/2026 cervical epidural injection.",
            "Read its columns in order: amount billed ($3,400.00) → plan allowed ($1,860.00) → contractual adjustment ($1,540.00, the provider's write-off) → deductible, copay or coinsurance ($0.00) → plan paid ($1,860.00, EFT PSH-EFT-0603-77815) → member responsibility ($0.00).",
            "Read the remark codes: CO-45 means the charge exceeded the in-network fee schedule and the difference is the provider's contractual obligation; AC1 flags the service as possibly accident-related, which is how the plan's reimbursement right attaches to the claim.",
            "Member responsibility is the most an in-network provider may bill the patient. Crescent's patient statement of 07/01/2026 asks John Doe for $1,540.00, the amount the EOB shows as written off: treat it as a balance bill, not a debt and not a lien.",
            "On a balance bill: document it beside the EOB, route it to Atty. Thorne the same day, draft the written request that Crescent correct its account, and tell John Doe what you are doing and when he will hear back. Whether he owes anything is counsel's call.",
            "A plan's reimbursement claim is what it paid, never what was billed: Peach State's claim on Crescent's bill starts at $1,860.00. When its itemized lien arrives, match every line to an EOB; a line no EOB supports, or one unrelated to the collision, goes to Atty. Thorne.",
            "The EOB's AC1 remark asks for the plan's accident questionnaire. Route it to Atty. Thorne before John Doe returns it: what it says about the accident and the other insurance is a statement on the file.",
            "MedPay sends no EOB, but Harbor Point reports its payments the same way: its payment history (RS31) lists each check by date of service, payee, amount billed, amount paid and the limit remaining. It paid every bill at the amount billed, in the order received.",
            "Harbor Point's five checks: $685.00 (Riverton Urgent Care), $640.00, $640.00 and $640.00 (Lakeside Orthopedics) and $2,395.00 (Summit Imaging) = $5,000.00, exhausted 06/26/2026. Bills it receives after that come back with a notice of exhaustion: send the next one to the next payer in the Payer Order.",
            "Reconcile every provider to its payers: each statement must show the MedPay check or the plan's payment as a credit. A provider still showing a balance on a paid date of service has a billing error, not a lien. Medical Specials keep the billed amounts the audit holds ($14,817.40); the lien register carries only what each payer can claim back."
          ],
          upl: [
            "You may read, reconcile and report what an EOB or a payment history shows, and ask a provider in writing to correct an account. Whether a balance is owed, whether a write-off may be billed, and how to answer the plan's accident questionnaire are Atty. Thorne's calls."
          ]
        },
        show: {
          caption: "Peach State's EOB for Crescent's 05/15/2026 injection, read line by line",
          type: "table",
          head: ["EOB line", "Amount", "What it means", "On the file"],
          rows: [
            ["Amount billed", "$3,400.00", "Crescent's charge for the injection", "Medical Specials"],
            ["Plan allowed", "$1,860.00", "Peach State's in-network fee schedule", "The most the plan pays"],
            ["Contractual adjustment", "$1,540.00", "CO-45: the provider's write-off", "Owed by nobody"],
            ["Deductible · copay · coinsurance", "$0.00", "John Doe's share under his plan", "Nothing to pay"],
            ["Plan paid", "$1,860.00", "EFT PSH-EFT-0603-77815, 06/03/2026", "Peach State's reimbursement claim"],
            ["Member responsibility", "$0.00", "The most Crescent may bill John Doe", "Its $1,540.00 statement is a balance bill"]
          ]
        },
        ops: [
          ["An EOB arrives", "Post billed, allowed, adjustment, paid and member share against the visit", "CMS → Liens · CMS → Documents", "Plan paid $1,860.00 logged; claim PS-2605-449021 linked to the visit"],
          ["A MedPay check clears", "Post the check, the date of service and the limit remaining", "CMS → Insurance tab → MedPay ledger", "Ledger ties to Harbor Point's payment history, $0.00 left after 06/26/2026"],
          ["A patient statement shows a balance", "Compare it with the EOB's member responsibility; route any balance bill", "CMS → Liens · Email Workspace", "$1,540.00 flagged; Atty. Thorne told the same day; correction request drafted"],
          ["The plan's itemized lien arrives", "Match each line to an EOB and to the collision", "CMS → Liens → Peach State", "Only EOB-backed, accident-related lines stand"]
        ],
        best: [
          "Read every EOB down to the member-responsibility line before you answer a balance question.",
          "Ask each provider for an itemized statement that shows every payer's credit.",
          "Keep billed and paid on the same CMS line, so neither number is lost.",
          "Tell John Doe what you are doing about a bill, and when he will hear back.",
          "Pitfall: logging a lien at the billed amount instead of what the plan paid.",
          "Pitfall: treating a contractual write-off as a balance the client owes.",
          "Pitfall: sending a bill to MedPay after its 06/26/2026 exhaustion."
        ],
        sources: ["D4#26", "D4#31", "D3#25", "D1#23"],
        rubric: {
          ai: [
            ["Reads the EOB", 20, "Each line read correctly: billed, allowed, adjustment, member share, plan paid, and the CO-45 and AC1 remarks"],
            ["MedPay reconciled", 20, "Five checks to $5,000.00, exhausted 06/26/2026, each tied to its provider's statement"],
            ["Balance bill handled", 20, "Crescent's $1,540.00 identified as the write-off, routed to Atty. Thorne, correction requested in writing"]
          ],
          trainer: [
            ["Grasps the consequence", 25, "Explains how a misread EOB inflates a lien or leaves the client paying a bill he may not owe"],
            ["UPL boundary", 15, "No answer to whether John Doe owes the balance; the questionnaire goes to counsel"]
          ]
        },
        notes: [
          "Hand out RS26 and read the EOB with the room, column by column, before you show the slide. Ask: “What does John Doe owe Crescent?” The EOB says $0.00.",
          "Then turn the page to Crescent's 07/01/2026 statement for $1,540.00. Ask: “Is this a lien we missed, or a bill nobody owes?” It is the write-off, billed to the patient.",
          "Make the lien point with one number: Peach State can claim back what it paid, $1,860.00, never the $3,400.00 billed.",
          "Walk Harbor Point's RS31 down to the $0.00 line on 06/26/2026, and ask where the next bill goes. The Payer Order answers it.",
          "Close on the boundary: you read, reconcile and report; whether John Doe owes a balance is Atty. Thorne's call."
        ]
      },

      {
        kind: "activity", id: "d2m2-a1",
        title: "Transmitting LOPs to Medical Providers",
        topic: "Skill Activity 1 — one LOP issued, one declined",
        visual: "Two dated envelopes side by side, each a white card with a navy header. Left, 02/23/2026 → RIVERTON SPINE & REHAB: an outgoing LOP with three orange numbered badges, ① payer check: out of network ② Atty. Thorne's approval and signature ③ receipt confirmed, and a green ✓ transmit stamp. Right, 03/11/2026 → SUMMIT IMAGING CENTER: a decline letter carrying a mono pill MEDPAY LEFT $3,675.00 ≥ MRI $2,395.00 and an orange arrow routing the bill to Harbor Point. Beneath both, a slim cream baseline card: 2021 · LOW BACK · RESOLVED beside 2026 · NECK, two separate outlined zones. A red callout bottom-right: “No amount promised.”",
        act: {
          scenario: "02/23/2026: John Doe's first treatment was at Riverton Urgent Care on 02/20/2026 ($685.00, to Harbor Point MedPay). Chiropractic and PT at Riverton Spine & Rehab begin 02/24/2026; it is out of network for Peach State. Atty. Thorne has approved the firm's LOP template. John Doe had three chiropractic visits in 2021, for low-back stiffness. 03/11/2026: Summit Imaging Center, booked for the cervical MRI Dr. Reyes ordered on 03/05/2026, asks for an LOP.",
          prompt: "Work both dates. First run the Payer Order for each provider and record the result. On 02/23/2026, prepare Riverton Spine & Rehab's LOP on the approved template, route it to Atty. Thorne for approval and signature, transmit it with the claim-specific HIPAA authorization, and ask for itemized statements and a missed-visit alert; confirm receipt and open the LOP register entry. Record John Doe's assessment, including his 2021 care as the pre-morbid baseline. On 03/11/2026, decline Summit's request in writing, naming Harbor Point MedPay as the payer, with the ledger to prove it. Graded: no payment promised to either provider.",
          tool: "CMS → Liens → LOP register · CMS → Documents → Outgoing · Email Workspace · CMS → Insurance tab → MedPay ledger",
          output: "One counsel-approved LOP transmitted and confirmed, one LOP request declined with the payer named, a current MedPay ledger, and a documented pre-morbid baseline.",
          checkpoints: [
            "Payer Order run and recorded for each provider: MedPay → Peach State → LOP",
            "Riverton Spine & Rehab's LOP justified: out of network for Peach State, and a full course of care MedPay's balance can't carry",
            "LOP explained to John Doe by Atty. Thorne and signed by John Doe and by Atty. Thorne on 02/23/2026, before the first visit on 02/24/2026, so the handoff from urgent care opens no new gap; nothing signed by the CM on his behalf",
            "Transmittal carries the claim-specific HIPAA authorization and asks for itemized statements and a missed-visit alert; receipt confirmed and logged",
            "LOP register entry: provider, date signed, out-of-network status, a running balance field",
            "Assessment recorded: clinical (neck pain; right-hand numbness since 02/18; the urgent-care note puts onset at the 02/06/2026 MVA), social (rental authorized 02/18/2026, capped at 30 days, so it ends 03/19/2026: calendared as a treatment risk), vocational (Northgate Distribution shift lead)",
            "Pre-morbid baseline: three 2021 chiropractic visits for low-back stiffness, resolved; no prior neck complaints; body region distinguished, records requested",
            "Summit Imaging's 03/11/2026 request declined in writing with the reason stated (MedPay applies first) and Harbor Point MedPay named as the payer",
            "Decline proved from the ledger: $5,000.00 – $685.00 – $640.00 = $3,675.00 left, enough for the $2,395.00 MRI, leaving $1,280.00",
            "No payment amount, reduction or payment date promised to either provider; Atty. Thorne copied on the decline"
          ]
        },
        ops: [
          ["02/23/2026: Riverton Spine & Rehab needs an LOP before the 02/24/2026 visit", "Run the Payer Order, prepare the LOP on the approved template, route it for approval", "CMS → Documents → Outgoing → Route for approval", "Approved and signed before the first visit"],
          ["LOP signed", "Transmit it with the HIPAA authorization; confirm receipt; open the register entry", "Email Workspace · CMS → Liens → LOP register", "Receipt confirmed and dated in the Communications Log"],
          ["03/11/2026: Summit Imaging asks for an LOP", "Decline in writing, naming Harbor Point MedPay as the payer; post the ledger", "Email Workspace · CMS → Insurance tab → MedPay ledger", "Reason stated; ledger shows $3,675.00 left before the MRI"]
        ],
        best: [
          "Run the Payer Order before you open the LOP template, every time.",
          "Ask every LOP provider for itemized statements and a missed-visit alert. The alert is your early warning that care is slipping.",
          "Highlight the prior history, never hide it. The eggshell rule (generally, a defendant takes the plaintiff as he finds him and is liable for the full harm even if John Doe was more susceptible; where a prior condition is aggravated, the aggravation, not the prior condition itself, is compensable. Confirm the governing rule.) is Atty. Thorne's to argue; your job is the record: the 2021 visits were low back, resolved, a different region from the neck.",
          "Pitfall: issuing an LOP to a provider MedPay would have paid. That bill becomes a lien on John Doe's net.",
          "Pitfall: answering a provider's “will we be paid in full?” with anything but the LOP's own terms and a referral to Atty. Thorne."
        ],
        sources: ["D1#24", "D1#33", "D1#35", "D1#46", "Newly authored: LOP issuance guidelines and the MedPay exhaustion ledger"],
        rubric: {
          ai: [
            ["Payer-order decisions", 20, "LOP to Riverton Spine & Rehab (out of network for Peach State); Summit declined because MedPay applies first"],
            ["Ledger arithmetic", 15, "$3,675.00 left on 03/11/2026; $1,280.00 after the $2,395.00 MRI"],
            ["LOP file completeness", 15, "Signed 02/23/2026, transmitted with the HIPAA authorization, receipt confirmed, register entry opened"],
            ["Assessment and baseline", 10, "Clinical, social, vocational and pre-morbid fields recorded; 03/19/2026 rental end calendared; 2021 low back distinguished from the neck"]
          ],
          trainer: [
            ["Provider communication", 15, "A clear, courteous, firm decline that names the payer and invites no dispute"],
            ["UPL boundary", 25, "No payment amount, reduction or date promised; terms and signature left to Atty. Thorne"]
          ]
        },
        notes: [
          "Run it in two passes, one per date. On 02/23/2026 the trainee must say why Riverton gets an LOP before opening the template.",
          "Put to the room: “Summit says it won't do the MRI without an LOP. What do you say, and who do you tell?” Give the MedPay details; if Summit still refuses, Atty. Thorne hears before the 03/13/2026 appointment, so the MRI doesn't slip.",
          "Grade the language. “Your bill is protected on the LOP's terms; for anything beyond them I'll put you in touch with Atty. Thorne” passes. “Don't worry, you'll be paid in full” fails, however friendly.",
          "The baseline checkpoint is the eggshell skill in miniature: the trainee records the prior and the difference in body region. Whether aggravation law matters at all is Atty. Thorne's call."
        ]
      },

      {
        kind: "lesson", id: "d2m2-lop", compact: true,
        title: "Letters of Protection & the Case Manager's Part in Provider Referrals",
        topic: "What an LOP is, when it is used, and how you help John Doe reach care without steering it",
        visual: "A three-party triangle: John Doe at the top, Riverton Spine & Rehab bottom left, LSH Law Group bottom right. The provider-to-firm side is labelled LETTER OF PROTECTION · signed 02/23/2026 · paid from the settlement. A red band across the triangle's centre reads THE UPL LINE: options and logistics, never which care.",
        tell: {
          why: "A Letter of Protection (LOP) is the firm's written promise to pay a provider's bill from the settlement, so a client with no way to pay can be treated now. It keeps care going, but it also creates a balance that comes out of John Doe's recovery and a provider who is waiting to be paid. The Case Manager tracks it from the day it is signed; and when a client needs a provider, the Case Manager helps with options and logistics while the choice of care stays with John Doe and his doctors.",
          rules: [
            "In plain English, an LOP says: treat the client now, and the firm will pay your bill from the settlement. It is a promise against the recovery, not insurance, and the client still owes the balance.",
            "Use one only when the payers are used up or unavailable: check health insurance, MedPay and PIP first (the Payer-First Principle), and record why the LOP is needed.",
            "Get it signed before the first visit and file it: Riverton Spine & Rehab's LOP was signed 02/23/2026; its ledger shows Financial class LOP / attorney.",
            "Track the LOP balance as it grows: request the itemized ledger every 30 days and enter each update in CMS → Liens, so the Net Sheet never meets a surprise.",
            "Provider referrals: you may share a list of providers who accept LOPs or the client's plan, with their locations, hours and network status, and book the appointment he chooses.",
            "You never recommend one provider over another, promise a result, or say a treatment will help the case. Disclose any relationship the firm has with a provider on the list.",
            "Log every referral and the client's own choice in the CMS: who was offered, who he chose, and why, in his words."
          ],
          upl: [
            "Options and logistics only: a list, the network status, the booking. Which care he gets is for John Doe and his doctors; what the LOP means for his recovery is for Atty. Thorne."
          ]
        },
        show: {
          caption: "“Where should I go for my back?” answered both ways",
          type: "split",
          do: [
            "“Here are three providers near you that take an LOP, with their hours and how far each is.”",
            "“Crescent Pain & Spine is in network with Peach State; I checked today.”",
            "“Which one works for you? I'll book it while we're on the phone.”",
            "“The firm does refer clients to Riverton Spine & Rehab; you're free to choose any of them.”"
          ],
          dont: [
            "“Go to Riverton Spine; they write great reports for cases.”",
            "“Chiropractic will make your case worth more.”",
            "“Don't worry about the bill; the LOP means it's free.”",
            "“Skip the injection; it won't help.”"
          ]
        },
        ops: [
          ["No payer will cover a provider John Doe needs", "Check every payer first; record why an LOP is needed; route to Atty. Thorne to approve", "CMS → Insurance · Case Notes", "Payer check on file; attorney approval logged"],
          ["The LOP is signed", "File it; set a 30-day ledger request", "CMS → Documents · Liens · Tasks", "LOP on file; ledger task recurring"],
          ["John Doe asks where he should go for treatment", "Give the list with network status; book his choice; disclose any firm relationship", "CMS → Parties · Calendar · Case Notes", "Options given, his choice recorded, no recommendation"]
        ],
        best: [
          "Check every payer before an LOP: the LOP is the last resort, not the first.",
          "Ask for the itemized ledger every 30 days; never let the LOP balance surprise the Net Sheet.",
          "Offer two or three options with facts (location, hours, network), and let John Doe choose.",
          "Pitfall: telling the client one provider is better for the case.",
          "Pitfall: an LOP signed after treatment started, or never filed.",
          "Pitfall: forgetting that the client still owes the LOP balance."
        ],
        sources: [
          "Case file: Riverton Spine & Rehab, chiro and PT under an LOP signed 02/23/2026 (RS23, the itemized LOP ledger)",
          "Newly authored: Letters of Protection, and the Case Manager's part in client-provider referrals within the UPL line"
        ],
        rubric: {
          ai: [
            ["LOP basics", 25, "Explains what an LOP is, when it is used, and that the client still owes the balance"],
            ["Tracking", 20, "Files the LOP and keeps its balance current in the CMS"],
            ["Referral logistics", 15, "Gives options with facts and books the client's own choice"]
          ],
          trainer: [
            ["UPL boundary", 25, "No recommendation of a provider or a treatment; any firm relationship disclosed"],
            ["Client care", 15, "Plain words; the client's choice recorded in his own words"]
          ]
        },
        notes: [
          "Ask: “John Doe has no health insurance that covers chiropractic. How does he get treated next week?” Let the room reach the LOP.",
          "Open RS23 and point to Financial class: LOP / attorney, and the LOP signed date. That is the document they will reconcile on Day 3.",
          "Role-play the referral: John Doe asks “Where should I go?” Model the answer: options, facts, his choice, logged."
        ]
      },

      {
        kind: "lesson", id: "d2m2-l2", compact: true,
        title: "A-C-T Crisis Protocol & Treatment Monitoring Principles",
        topic: "Is the plan working, and what you do the day it isn't",
        visual: "A closed monitoring loop drawn as a navy ring left of centre, with “IS THE PLAN WORKING?” set in Fraunces inside it. At the ring's four o'clock a red DETECT node breaks out into an orange three-step rail running right: ① ASSESS ② COORDINATE ③ TRACK, each a navy card with an orange badge, the TRACK card's arrow curving back up into the ring. Top-right, a treatment-map strip of mono pills, ACUTE · SUB-ACUTE · RESTORATIVE · MMI, with a marker on RESTORATIVE · WEEK 9 · 04/08/2026. Left margin, three stacked variance chips, CLINICAL · PSYCHOSOCIAL · SYSTEMIC, with PSYCHOSOCIAL highlighted. The argument: A-C-T is not a detour from monitoring; it closes back into it.",
        tell: {
          why: "On an LOP nobody denies the next six visits in real time. Keystone does it later, at the demand, by calling the care unnecessary or the injury minor. That makes you the only real-time check that John Doe's plan is working, and the person who acts the day it isn't.",
          rules: [
            "Monitor outcomes, not attendance alone: ask specific questions (visits, pain, what he can't do at work or home) and hunt barriers: internal (motivation, fear, mood) and external (transport, money, schedule, coverage).",
            "Know where he is on the map: acute (days 1–14: causation and MedPay; on this file, the 14-Day Gap), sub-acute (weeks 2–8: chiropractic/PT, Dr. Reyes, the MRI), restorative (weeks 9–24: injections, return to work), then MMI. On 04/08/2026, day 61, he is in week 9.",
            "Every check-in: “Is he improving?” If not, raise it with the provider: medication, injections, a specialist or a yellow-flag screen is the provider's decision. Record question, answer, date. Six-week rule: 20–30% more range of motion or a lower pain score by week 6; his fell on 04/07/2026 (02/24/2026 + 42 days).",
            "“Reasonable and necessary” is the utilization-review lens (usual for this injury; objective functional gain), not the legal test of what John Doe recovers: confirm that rule. Necessity is the provider's opinion, argued by Atty. Thorne. No disability-index change by week 12 is a plateau: ask the provider about a specialist.",
            "Name the variance before you fix it: clinical (a new complication), psychosocial (yellow flags such as fear-avoidance, catastrophizing, no transport to therapy), systemic (an authorization or referral delay).",
            "A-C-T for every red flag. Assess: medical danger to the provider now, legal danger (missed visits, generic notes) to Atty. Thorne. Coordinate: clarify with the office, remove the barrier. Track: record every fix attempt; that is counsel's why.",
            "In a crisis, adjust the plan first: it is usually the plan, not the client. That is management, not an admission.",
            "Climb the ladder one documented rung at a time: 1 clinical (the office manager), 2 administrative (written notice to the carrier causing the barrier, copied to Atty. Thorne; to Keystone PD, the adverse carrier, property facts only), 3 legal (Atty. Thorne's call, such as an LOP to bypass a stalling payer).",
            "Write every intervention as a GIRP note (Goal, Intervention, Response, Plan): factual, never “this will help the case.” The defense may read it."
          ],
          upl: [
            "You coordinate care; you don't direct it. Never tell John Doe to add, skip or stop treatment or second-guess a provider, and never tell him missed visits will cut what his claim is worth. Medical questions go to the provider, claim questions to Atty. Thorne."
          ]
        },
        show: {
          caption: "A-C-T inside the monitoring loop: Track feeds the next “Is the plan working?”",
          type: "process",
          steps: [
            ["Monitor", "Attendance, pain, function every contact; week-6 measures due 04/07/2026."],
            ["Detect and classify", "Clinical, psychosocial or systemic. Visits missed from 04/03/2026 for want of transport: psychosocial."],
            ["Assess", "Medical danger → the provider today; legal danger → Atty. Thorne. Here: the 04/08/2026 call to John Doe."],
            ["Coordinate", "Clarify with the clinic, remove the barrier, climb the ladder: rental request, evening slots, Margaret Doe driving."],
            ["Track", "GIRP note; attendance confirmed 04/21 and 04/23/2026; the why on file for counsel."]
          ]
        },
        ops: [
          ["Provider's missed-visit alert", "Run A-C-T the same day: call John Doe, classify the variance, record it", "Call Simulator → AI John Doe · CMS → Case Notes", "Call and GIRP note dated the day the alert arrives"],
          ["Week 6 of care (04/07/2026)", "Ask the provider for the re-evaluation measures: range of motion, pain score, disability index. Whether a PHQ-9/GAD-7 screen is indicated is the provider's call; anything putting John Doe's mental health in the record is flagged to Atty. Thorne", "Medical Records Requests · CMS → Case File → Treatment timeline", "Measures on file, or the missed re-evaluation flagged"],
          ["Barrier not fixed at the clinical rung", "Climb one rung: written notice to the carrier causing it, copied to Atty. Thorne (Keystone PD: property facts only)", "Email Workspace · CMS → Tasks → Escalate", "Each rung dated in the Communications Log"],
          ["A red flag that can cost the claim (missed visits, generic notes, passive-only care)", "Report it to Atty. Thorne with the fix attempted", "CMS → Case File → Risk Flags", "Flag routed with the GIRP note attached"]
        ],
        best: [
          "Red flags to raise with the provider: more than 12 sessions with no gain and no specialist or imaging suggested; passive-only care (heat, TENS, massage) with no active exercise; two or more missed visits, which the defense reads as an injury not serious enough to treat.",
          "Yellow flags (catastrophizing, litigation stress, reliance on passive care or medication) are reported with a plan, in the map's language: “John Doe is in the restorative phase. Psychosocial variance: no transport since 04/01/2026, four visits missed. Plan: evening slots from 04/21/2026 with family transport; attendance tracked.”",
          "When progress stalls, re-engage John Doe on his own goal (a full warehouse shift at Northgate without right-arm numbness), with active listening and without pressure.",
          "The 14-Day Gap is documented after the fact, from John Doe's own explanation on a recorded call and the dated records that support it. The disruption must never need that reconstruction: record it the day it happens.",
          "Proofread laterality in every summary: everything on this file is right-sided (right hand, right paracentral herniation). A left/right switch damages credibility.",
          "Pitfall: continuing the plan unchanged through a crisis.",
          "Pitfall: blaming the client, or treating a systemic delay as non-compliance, instead of revising the plan.",
          "Pitfall: jumping to Atty. Thorne before the clinical and administrative rungs, or fixing a problem without documenting it."
        ],
        sources: ["D1#27", "D1#28", "D1#29", "D1#31", "D1#36", "D1#37", "D1#38", "D1#40", "D1#41", "D1#42", "D1#43", "D1#45"],
        rubric: {
          ai: [
            ["Map and six-week rule", 15, "Week 9 on 04/08/2026 (day 61); week 6 of care on 04/07/2026 (02/24/2026 + 42 days); 20–30% expectation stated"],
            ["Variance and red flags", 15, "Clinical, psychosocial and systemic named; lost transport classed psychosocial; the three PT red flags named"],
            ["A-C-T sequence", 20, "Assess → Coordinate → Track, with medical danger to the provider and legal danger to Atty. Thorne"],
            ["Escalation ladder", 10, "Three rungs in order, each documented"]
          ],
          trainer: [
            ["Monitoring mindset", 20, "Treats “Is the plan working?” as an outcomes question and revises the plan, not the client"],
            ["UPL boundary", 20, "No treatment direction to John Doe, no clinical second-guessing, no value talk about missed visits"]
          ]
        },
        notes: [
          "Open with a date: 04/07/2026. Ask what was due that day (John Doe's week-6 mark of care), then tell the room he wasn't there.",
          "Put to the room: “On an LOP file, who denies unnecessary care, and when?” Keystone, at the demand. Let them work out what that makes the Case Manager.",
          "The course's earlier A-C-T names the middle step Clarify. On this file it is Coordinate, and it still opens with the clarifying call to the provider's office. Watch for trainees who skip that call and go straight to fixing.",
          "Legal nuance: the A-C-T record is what later answers a failure-to-mitigate argument. Facts, dates and fix attempts; no adjectives about John Doe."
        ]
      },

      {
        kind: "activity", id: "d2m2-a2", compact: true,
        title: "Executing the A-C-T Crisis Protocol for Disrupted Care",
        topic: "Skill Activity 2 — the Transportation Wall, 04/08/2026",
        visual: "A horizontal treatment timeline across the slide from 04/02/2026 to 04/24/2026. A hollow red band spans 04/02 → 04/21, labelled 19 DAYS · NO VISITS, with four red ✗ markers at 04/03, 04/07, 04/09 and 04/14. Above the band, the A-C-T steps as three orange-badged navy cards pinned to their dates: ① ASSESS 04/08 ② COORDINATE 04/08 → 04/10 rental refused → 04/21 evening slot ③ TRACK 04/21 · 04/23 with green ✓ markers. A grey mono pill at 04/24 reads CIVIC RETURNED. Below, the three Transportation Wall options as cream cards, A · B · C. The empty red band is the argument: every day of it needs a documented reason.",
        act: {
          scenario: "04/08/2026: Riverton Spine & Rehab's missed-visit alert. John Doe missed 04/03 and 04/07; his last visit was 04/02/2026. As you work, the file moves: Keystone PD (Leah Moran) answers your rental request on 04/10/2026, the clinic's first open evening slot is 04/21/2026, John Doe misses 04/09 and 04/14 meanwhile, and the Civic comes back from the shop on 04/24/2026.",
          prompt: "Execute A-C-T on the Transportation Wall. Assess: call John Doe on 04/08/2026, find the barrier, classify the variance, and decide whether it is a medical or a legal danger. Coordinate: clarify with the clinic, request a rental extension from Keystone PD in writing, and build a transport plan from one of the three Transportation Wall options, saying why. Track: write the GIRP note, report to Atty. Thorne, and confirm attendance once care resumes. Graded: exact dates and the 19-day count; no treatment advice; no talk of what missed visits do to the claim.",
          tool: "Call Simulator → AI John Doe · Email Workspace · CMS → Case Notes · CMS → Case File → Treatment timeline",
          output: "A complete A-C-T record: the call, the variance, each coordination attempt and its result, a GIRP note, the report to Atty. Thorne, and attendance confirmed on 04/21 and 04/23/2026.",
          checkpoints: [
            "Assess dated 04/08/2026, the day the alert arrived; barrier recorded: Keystone ended the rental on 03/19/2026 (30-day cap), the carpool ended with Kevin Alvarez's shift change on 04/01/2026, the Civic is awaiting parts",
            "Symptoms asked about on the call; anything new or worse routed to the provider at once",
            "Classified: an external barrier (transport), a psychosocial variance, and a legal danger (missed visits); reported to Atty. Thorne",
            "Rental extension requested in writing from Keystone PD (Leah Moran), property facts only (Civic awaiting parts; repair not complete); nothing about John Doe's treatment or missed visits; the 04/10/2026 refusal (“shop delay”) logged",
            "Transport option chosen and justified; plan: evening slots so Margaret Doe can drive John Doe after her shift, booked with the clinic while John Doe is on the line",
            "Missed visits recorded exactly: 04/03, 04/07, 04/09 and 04/14/2026, four in all",
            "Disruption computed: 04/02/2026 → 04/21/2026 = 19 days without a visit",
            "GIRP note complete (Goal, Intervention, Response, Plan), factual, no opinion on the claim",
            "Ladder documented rung by rung: the clinic, the written request to Keystone PD, Atty. Thorne told of the refusal",
            "Track: attendance confirmed 04/21 and 04/23/2026; the Civic's return on 04/24/2026 noted",
            "No advice to add, skip or stop treatment; nothing said about what missed visits do to the claim's value"
          ]
        },
        show: {
          caption: "The Transportation Wall: three ways through, and their trade-offs",
          type: "threebox",
          items: [
            ["Option A · Problem Solver", "You find the ride: a rental extension from the carrier, bus routes, ride vouchers from a non-profit or community program. Never a ride, rental or voucher paid for by the firm: that is financial assistance to a client, Atty. Thorne's call under the governing ethics rule. Fast, but John Doe depends on you."],
            ["Option B · Empowerer", "John Doe finds it with you: who in his household can drive, and when. Slower to start, but it lasts."],
            ["Option C · Clinical Pivot", "Ask the clinic whether an interim home program fits while transport is fixed. The provider decides."]
          ]
        },
        ops: [
          ["04/08/2026: missed-visit alert", "Assess: call John Doe, classify the variance, write the GIRP note", "Call Simulator → AI John Doe · CMS → Case Notes", "Call and note dated 04/08/2026"],
          ["Barrier is transport", "Coordinate: written rental request to Keystone PD; evening slots with the clinic", "Email Workspace · CMS → Property Damage → Correspondence · CMS → Calendar", "Request dated; 04/10/2026 refusal logged; 04/21/2026 slot on the calendar"],
          ["Care resumes 04/21/2026", "Track: confirm attendance with the clinic; report to Atty. Thorne", "CMS → Case File → Treatment timeline · CMS → Tasks → Escalate", "Attendance on 04/21 and 04/23/2026 confirmed; 19-day disruption recorded with its cause"]
        ],
        best: [
          "Facilitation is the treatment phase's first job: a client who can't reach the clinic isn't in treatment, whatever the plan says.",
          "Act the day the alert lands. Every day without a plan is another missed visit.",
          "Calendar known transport risks: a rental capped at 30 days has an end date (03/19/2026) you could see on 02/18/2026.",
          "Log Keystone PD's 04/10/2026 refusal in full. It is part of why care stopped, and part of the loss-of-use claim Atty. Thorne decides how to pursue.",
          "Pitfall: accepting “I'll just wait until the car's back” without a plan.",
          "Pitfall: telling John Doe that missing therapy “will hurt your case.” It is a value statement, and it pushes treatment for the claim's sake."
        ],
        sources: ["D1#26", "D1#27", "D1#29", "D1#30", "D1#38", "D1#41", "D1#45", "D1#47"],
        rubric: {
          ai: [
            ["Dates exact", 20, "Alert and call 04/08/2026; refusal 04/10/2026; missed 04/03, 04/07, 04/09, 04/14; resumed 04/21/2026; 19 days"],
            ["A-C-T complete", 20, "Assess, Coordinate and Track each recorded with its date and result"],
            ["GIRP structure", 10, "All four parts present, factual and clinical"],
            ["Ladder documented", 10, "Clinic, written request to Keystone PD, report to Atty. Thorne, in that order"]
          ],
          trainer: [
            ["Crisis judgment", 15, "Chooses and justifies a transport option that keeps John Doe in care, balancing empowerment and speed"],
            ["Client communication", 10, "Active listening; motivates without pressure or blame"],
            ["UPL boundary", 15, "No treatment advice, no value talk, no firm-funded transport offered, nothing told to Keystone beyond property facts"]
          ]
        },
        notes: [
          "Start the clock at 04/08/2026 and release each update only when the trainee earns it: Keystone PD's refusal after the written request, the evening slot after they ask the clinic.",
          "Put to the room: “Which option did the file actually use, and why did Option B outlast Option A?” The rental request failed on 04/10/2026; Margaret driving after her shift got John Doe back in care on 04/21/2026, three days before the Civic came back.",
          "Watch the call for value talk. “If you miss more therapy your case is worth less” fails the UPL row, however well meant.",
          "Nuance: Keystone also holds the BI claim. Keep the rental request to the property facts; what Keystone hears about John Doe's treatment is Atty. Thorne's call."
        ]
      },

      {
        kind: "activity", id: "d2m2-a3", compact: true,
        title: "Redirecting a Referral the Client Won't Attend: the Facility Change and Every Task After It",
        topic: "Skill Activity 3 — the Millbrook booking, 04/22/2026",
        visual: "The CMS Tasks board fills the slide as a white card with a navy header, JOHN DOE · PAIN-MANAGEMENT REFERRAL, and ten rows. Each row ends in a status chip: green DONE · 04/22/2026 for the CM's own work, orange DELEGATED with the owner's name and a mono due date, grey OPEN · DUE 05/18/2026 for the attendance check. Above the board, a slim calendar strip from 05/13/2026 to 05/18/2026: the 05/14 slot at Millbrook Interventional Pain Center struck through in red, the 05/15 slot at Crescent Pain & Spine in navy with an IN NETWORK · PEACH STATE pill, a bell at 05/13 (reminder call) and a check at 05/18 (attendance). Bottom-right, a red chip: “His choice of facility. Dr. Reyes's care.”",
        act: {
          scenario: "04/22/2026, 12:18 p.m.: a voicemail from John Doe. Care resumed at Riverton Spine & Rehab on 04/21/2026 on evening slots, with Margaret Doe driving after her shift; the Civic is still in the shop. Yesterday Lakeside Orthopedics' scheduling desk booked the pain-management injection Dr. Alana Reyes referred him for on 03/27/2026 at Millbrook Interventional Pain Center, in Millbrook, for 05/14/2026. John Doe won't go: it is far out in Millbrook, he has no reliable ride there, and he heard it is out of network with Peach State. Dr. Reyes's 03/27/2026 note names Crescent Pain & Spine (Dr. Omar Haddad, 41 Crescent Ct, Riverton). Lakeside's referral coordinator is Janelle Brooks.",
          prompt: "Call John Doe back and listen. Where he goes, among the options his doctors find appropriate, is his choice; what care he gets is for Dr. Reyes and the treating provider to decide, so give no medical advice. Verify Crescent's network status with Peach State yourself. Work with Janelle Brooks to redirect the referral to Crescent Pain & Spine, and book its first opening while John Doe is on the line, so no new gap opens. Then handle every task that follows, or delegate it with an owner and a due date: cancel the Millbrook slot; update the CMS Calendar; add Crescent to Parties with its billing details; set up the Peach State billing and note its reimbursement interest; request Crescent's records and bills under the HIPAA authorization; agree a transport plan; write the GIRP note; report to Atty. Thorne; and confirm attendance after 05/15/2026. Graded: exact names and dates, no treatment advice, nothing said about the claim's value.",
          tool: "Call Simulator → AI John Doe · CMS → Tasks · CMS → Calendar · CMS → Parties · CMS → Liens · ChartSwap · CMS → Case Notes · Email Workspace",
          output: "A CMS task list for the redirect, each task Done by me (dated) or Delegated to a named owner with a due date; the 05/15/2026 Crescent appointment on the calendar; a GIRP note and the report to Atty. Thorne.",
          checkpoints: [
            "Voicemail returned on 04/22/2026; John Doe's reasons recorded in his own words: Millbrook is far, he has no reliable ride there (the Civic in the shop, Margaret Doe working days), and he heard it is out of network",
            "Roles kept straight: John Doe chooses where among appropriate options; Dr. Reyes and the treating provider decide the care; no opinion given on the injection or on either facility's medicine",
            "Dr. Reyes's 03/27/2026 note read first: the referral names Crescent Pain & Spine, Dr. Omar Haddad, 41 Crescent Ct",
            "Network status verified with Peach State, not repeated from what John Doe heard: Crescent Pain & Spine is in network (member PSH-55017742, group GRP-41208)",
            "Referral redirected through Janelle Brooks, Lakeside's referral coordinator; Crescent's first opening, 05/15/2026, booked while John Doe is on the line",
            "No new gap: 05/15/2026 is one day after the 05/14/2026 slot it replaces, and PT at Riverton Spine & Rehab continues on its evening slots",
            "Millbrook's 05/14/2026 slot cancelled: delegated to Janelle Brooks (Lakeside booked it), due 04/23/2026; the cancellation confirmed and logged",
            "CMS Calendar: the Millbrook slot removed; Crescent 05/15/2026 added; reminder call to John Doe on 05/13/2026; attendance check on 05/18/2026",
            "Crescent added to Parties as a treating provider: Dr. Omar Haddad, 41 Crescent Ct, Riverton, (555) 010-6900, billing (555) 010-6912; bills Peach State in network; no LOP",
            "Lien Tracker: Peach State's reimbursement interest (Dion Carver, asserted 02/27/2026) flagged to expect Crescent's claim, at what the plan pays as its EOB shows, never the bill",
            "Crescent's records and itemized bill for 05/15/2026 requested under the HIPAA authorization signed 02/09/2026: delegated to the records team, due 05/29/2026",
            "Transport plan agreed with John Doe and recorded; Crescent's pre-procedure instructions passed on as given, not interpreted",
            "GIRP note and a short report to Atty. Thorne on 04/22/2026; no treatment advice and nothing about the claim's value anywhere on the file"
          ]
        },
        show: {
          caption: "The redirect as a task list: every row Done or Delegated, none without an owner",
          type: "table",
          head: ["Task", "Status"],
          rows: [
            ["Call John Doe back; record his reasons", "Done by me 04/22/2026"],
            ["Read Dr. Reyes's 03/27/2026 referral; verify Crescent's network status with Peach State", "Done by me 04/22/2026"],
            ["Redirect the referral with Janelle Brooks; book Crescent 05/15/2026 with John Doe on the line", "Done by me 04/22/2026"],
            ["Cancel Millbrook's 05/14/2026 slot", "Delegated to Janelle Brooks (Lakeside), due 04/23/2026; cancellation logged by me"],
            ["CMS Calendar: Millbrook off; Crescent 05/15/2026 on; reminder call 05/13/2026", "Done by me 04/22/2026"],
            ["Parties: Crescent Pain & Spine, Dr. Omar Haddad, with its billing details", "Done by me 04/22/2026"],
            ["Peach State billing in network, no LOP; Lien Tracker flagged for Crescent's claim", "Done by me 04/22/2026"],
            ["Crescent's records and itemized bill for 05/15/2026, under the HIPAA authorization", "Delegated to the records team, due 05/29/2026"],
            ["Transport plan; GIRP note; report to Atty. Thorne", "Done by me 04/22/2026; ride reconfirmed on 05/13/2026"],
            ["Confirm attendance with Crescent", "Mine, due 05/18/2026"]
          ]
        },
        ops: [
          ["04/22/2026: John Doe's voicemail refuses Millbrook", "Call back; read Dr. Reyes's referral; verify Crescent with Peach State", "Call Simulator → AI John Doe · CMS → Case Notes", "Reasons logged; Crescent verified in network"],
          ["Facility chosen by John Doe", "Redirect with Janelle Brooks; book 05/15/2026 with him on the line; cancel Millbrook", "CMS → Calendar · CMS → Parties", "Old slot off; new slot, reminder and attendance check on"],
          ["Downstream work", "Do each task or delegate it with an owner and a due date; report to Atty. Thorne", "CMS → Tasks · ChartSwap · CMS → Liens · Email Workspace", "Every task Done or Delegated; none without an owner"]
        ],
        best: [
          "Read the referral before you redirect it: Dr. Reyes's 03/27/2026 note already names Crescent Pain & Spine.",
          "Verify network status with the plan yourself. What John Doe heard at work is a reason to check, not a fact.",
          "Book while the client is on the line. A callback is where a new gap starts.",
          "A delegated task has an owner, a due date and your check that it was done.",
          "Pitfall: telling John Doe which facility or doctor is better, or whether he needs the injection at all. That is Dr. Reyes's and the treating provider's call.",
          "Pitfall: cancelling Millbrook and stopping there. The calendar still shows a no-show, and nobody has asked Crescent for its records."
        ],
        sources: ["D1#26", "D1#29", "D1#30", "D1#35", "D1#39", "D1#44", "Newly authored: redirecting a referral to the client's choice of facility, and the downstream task list (each task done or delegated with an owner and a due date)"],
        rubric: {
          ai: [
            ["Facts exact", 15, "04/22/2026 voicemail; Millbrook 05/14/2026 cancelled; Crescent Pain & Spine, Dr. Omar Haddad, 05/15/2026; Peach State member PSH-55017742"],
            ["Task list complete", 20, "Cancellation, Calendar, Parties, Peach State and the Lien Tracker, records request, transport, GIRP note, report to Atty. Thorne, attendance check"],
            ["Ownership", 15, "Every task Done by me with its date, or Delegated to a named owner with a due date"],
            ["Continuity of care", 10, "Crescent's first opening booked with John Doe on the line; PT continues; no new gap"]
          ],
          trainer: [
            ["Client handling", 10, "Listens, respects John Doe's choice of facility, books with him on the line"],
            ["Coordination judgment", 10, "Works through Lakeside's referral coordinator; verifies network status instead of repeating hearsay"],
            ["UPL boundary", 20, "No treatment advice, no opinion on either facility's care, nothing about the claim's value"]
          ]
        },
        notes: [
          "Play the voicemail and stop. Ask: “Who decides where John Doe has the injection, and who decides whether he has it?” He chooses among appropriate options; Dr. Reyes and Crescent decide the care.",
          "The trap is the hearsay. John heard Millbrook is out of network. A trainee who repeats that to John or to Lakeside has passed on a rumor; one who checks with Peach State has a fact.",
          "Look for the referral note. Dr. Reyes's 03/27/2026 note already names Crescent Pain & Spine, so the trainee who reads it first has a one-call fix.",
          "Grade the task list, not just the call. Every row needs Done with a date, or Delegated with an owner and a due date. A row that reads “records: later” fails the ownership dimension.",
          "Nuance: Crescent bills Peach State as an in-network provider, so there is no LOP. Peach State's reimbursement claim will start at what it pays, which its EOB will show."
        ]
      },

      {
        kind: "lesson", id: "d1m1-l2", compact: true,
        title: "Health Subrogation, Payer Order & the Regulatory Triple-Check",
        topic: "Who pays the bills now, and who gets paid back later",
        visual: "A two-lane swimlane running left to right. Upper lane, navy, labelled PAYS THE BILLS NOW — PAYER ORDER: an arrow through PIP/MedPay → Peach State Health Plan → LOP/provider liens. Lower lane, orange, labelled PAYS THE CLAIM LATER — RECOVERY STACK: an arrow through BI → Host UM → Relative UM ending at a SETTLEMENT node. A bold orange return arrow curves from the Health Plan in the upper lane down into the settlement node, labelled REIMBURSEMENT CLAIM. The curve is the heaviest line on the slide. Top-right, three stacked chips form the Regulatory Triple-Check: HIPAA · BCRC · PAYER ORDER, each with a tick box. Bottom-left, a danger-bordered callout: “Flagged late = paid twice.”",
        tell: {
          why: "Two different questions get confused on every new file: who pays John Doe's Medical Bills while the claim is open, and who pays the claim itself at the end. The Health Plan answers the first and then asks to be repaid out of the second. A reimbursement claim found after the demand goes out comes out of the client's net.",
          rules: [
            "Clear the Regulatory Triple-Check before any clinical planning begins, so the claim is properly established and you are authorized to act.",
            "Check 1, HIPAA: obtain a claim-specific Authorization to Release Medical Information. It names the incident date and permits communication with legal and insurance parties; a generic release may not be adequate.",
            "Check 2, Medicare/Medicaid: if the client is 65+ or on SSDI, report the case to the Benefits Coordination & Recovery Center (BCRC) under MMSEA (2007). Skipping it risks federal penalties and a frozen settlement. John Doe is 34, so the check is his SSDI status: verify it and record the answer.",
            "Check 3, Payer Order: PIP/MedPay first, then private health insurance, then LOP/provider liens. Verify whether any PIP/MedPay applies on this loss; do not assume it.",
            "The Payer Order is not the Recovery Stack. The $40,000 in BI and UM pays the claim; the Payer Order pays the bills while it is open.",
            "A Health Plan that pays accident-related bills asserts a reimbursement right against the settlement. Identify it early so it doesn't surprise you at settlement: flag it on first notice, before the first demand.",
            "Record the plan's carrier, member ID and group number in the CMS lien register the day they are known, and log the BCRC answer in the file.",
            "Never promise a provider or a plan a payment amount. Verify now, negotiate at the lien stage, with authority from Atty. Thorne."
          ],
          upl: [
            "You may gather lien documentation and report what a plan asserts. You may not advise the client on whether a lien is enforceable, or negotiate a compromise without counsel's authority."
          ]
        },
        show: {
          caption: "Pays the bills now vs. pays the claim later",
          type: "compare",
          boxes: [
            {head: "PAYER ORDER — pays the bills now", items: [
              "1. PIP/MedPay, if any applies (verify it).",
              "2. Private health insurance: Peach State Health Plan · PSH-55017742 · GRP-41208.",
              "3. LOP/provider liens.",
              "The Health Plan then asserts a reimbursement right against the settlement."
            ]},
            {head: "RECOVERY STACK — pays the claim later", items: [
              "1. BI — $10,000 (Robert Smith's liability).",
              "2. Host UM — $20,000.",
              "3. Relative UM — $10,000.",
              "$40,000 total. Our demands are built against these layers."
            ]}
          ]
        },
        ops: [
          ["Retainer signed", "Obtain the claim-specific HIPAA authorization naming the incident date", "CMS → Documents", "Authorization names 02/06/2026 and permits legal and insurance contact"],
          ["Client's age and benefits known", "Verify SSDI status; report to the BCRC if 65+ or on SSDI", "CMS → Case Notes", "BCRC answer logged with its date"],
          ["Health Plan identified", "Record carrier, member ID and group; record the Payer Order", "CMS → Liens", "Lien record exists and is dated; Payer Order noted"],
          ["Plan pays an accident-related bill", "Flag the reimbursement right against the matter", "CMS → Liens → Flag", "Flag set before any demand is drafted"]
        ],
        best: [
          "Clear the triple-check before any clinical planning.",
          "Log the BCRC report date (or the verified “not required”) in the file.",
          "Identify subrogation interests early so they don't surprise you at settlement.",
          "Pitfall: using a generic medical release that doesn't name the incident date.",
          "Pitfall: reassuring the client that “insurance will cover it.”"
        ],
        sources: ["D1#22", "D1#23", "D1 Task Overview: Billing, Resolution & Closing"],
        rubric: {
          ai: [
            ["Triple-check complete", 20, "HIPAA authorization, BCRC answer and Payer Order all recorded"],
            ["Payer Order", 20, "PIP/MedPay → private health insurance → LOP/provider liens, kept separate from the Recovery Stack"],
            ["Lien fields and timing", 20, "Carrier, member ID and group recorded; flag placed before the first demand"]
          ],
          trainer: [
            ["Grasps the consequence", 25, "Explains how a late-flagged reimbursement claim damages the client's net, not just the paperwork"],
            ["UPL boundary", 15, "No opinion on enforceability; no payment promised"]
          ]
        },
        notes: [
          "Draw the two lanes on the board before you show the slide. Most confusion on this topic is two different questions treated as one.",
          "The curving return arrow is the lesson: money goes out to providers early and comes back out of the settlement at the end.",
          "On the BCRC check, John Doe's age rules out the 65+ trigger, so ask the room what is left to verify. The answer is SSDI, and the file must record that it was checked.",
          "Tie it forward: “On Day 4 you will negotiate this lien down. What you can reduce depends on what you register today.”"
        ]
      },

      {
        kind: "activity", id: "d1m1-a2",
        title: "Subrogation Lien Flagging in the CMS",
        topic: "Skill Activity 2 — register the claim before it can hurt you",
        visual: "A single annotated CMS Liens screen filling two-thirds of the slide, a white card with a navy header bar. Five fields are called out with orange numbered badges and leader lines to short labels in the right margin: ① Plan carrier ② Member ID ③ Group number ④ Payer Order position ⑤ Reimbursement flag. Below the screen, a slim two-state timeline: a green node, FLAGGED NOW · before demand, and a red node, FOUND AT DISBURSEMENT · client's net is hit, crossed out. Keep the red state on the slide: trainees need to see the failure they are avoiding.",
        act: {
          scenario: "Peach State Health Plan has begun paying John Doe's accident-related treatment. No lien record exists on the matter yet, and the pre-demand audit is still ahead.",
          prompt: "Register Peach State Health Plan's reimbursement claim in John Doe's lien register and flag it against the matter. Record the carrier, member ID and group number, its position in the Payer Order, the basis on which reimbursement is asserted, and the date of the flag. Record the Regulatory Triple-Check results alongside it. Then state in one line what must happen before this lien can be compromised.",
          tool: "CMS → Liens",
          output: "A dated, flagged lien record complete enough to negotiate from on Day 4.",
          checkpoints: [
            "Lien record created against the John Doe matter",
            "Carrier recorded as Peach State Health Plan",
            "Member ID PSH-55017742 and group GRP-41208 both entered",
            "Payer-order position recorded: after PIP/MedPay, before LOP/provider liens",
            "Reimbursement basis noted",
            "Flag dated before any demand is drafted",
            "Triple-Check recorded: HIPAA authorization, BCRC answer, Payer Order",
            "Escalation noted: compromise requires Atty. Thorne's authority"
          ]
        },
        ops: [
          ["Plan's first payment posts", "Create and flag the lien record", "CMS → Liens", "Record dated; flag set"],
          ["Lien record created", "Attach the Triple-Check results", "CMS → Case Notes", "HIPAA, BCRC and Payer Order all recorded"],
          ["Any request to compromise", "Route to Atty. Thorne", "CMS → Tasks → Escalate", "No compromise discussed without counsel's authority"]
        ],
        best: [
          "Registering a lien is not conceding it; Day 4 is where it gets reduced.",
          "Keep the LOP provider list current with balances, so no bill surprises the policy limits.",
          "Pitfall: finding the lien at disbursement, when there is no time to negotiate from strength."
        ],
        sources: ["D1#22", "D1#24"],
        rubric: {
          ai: [
            ["Record created", 15, "Lien exists against the correct matter"],
            ["Identifier accuracy", 25, "Member ID and group number entered exactly"],
            ["Flag timing", 20, "Dated and placed pre-demand"]
          ],
          trainer: [
            ["Documentation quality", 25, "A lien negotiator could work from the record cold"],
            ["Authority boundary", 15, "Recognised that compromise needs counsel's authority"]
          ]
        },
        notes: [
          "Have trainees say the date aloud as they set the flag. Timing is the graded element, and it is the one they will be tempted to defer.",
          "Point at the crossed-out red node: a lien found at disbursement is found too late to negotiate from strength.",
          "Read one trainee's record to the room as if you were the lien negotiator receiving it on Day 4. Gaps show at once.",
          "Remind them that registering a lien is not conceding it."
        ]
      },

      {
        kind: "check", id: "d2m2-kc",
        title: "Treatment Monitoring Review",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split. Upper half: the question panel on the cream card with the orange ruled border, questions numbered in orange. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with three prompts, beside the 1–5 SKILL SCALE ladder with its six competency rows. Module-specific addition across the top: a thin payer rail, MEDPAY → PEACH STATE → LOP, with a small gauge showing MedPay at $0.00 after 06/12/2026. Far right, the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip outside the bar.",
        check: {
          questions: [
            "Read Peach State's 06/03/2026 EOB (claim PS-2605-449021) line by line: what does each amount mean, and where does each one go on John Doe's file?",
            "Crescent's 07/01/2026 statement asks John Doe for $1,540.00. What does the EOB show, what do you do, and what do you tell him?",
            "Riverton Spine & Rehab got an LOP on 02/23/2026; Summit Imaging's 03/11/2026 request was declined. Explain both decisions from the Payer Order, and what you may and may not tell either provider."
          ],
          summary: [
            "Summarize, in your own words, what you learned about keeping John Doe's treatment moving and paid for: the principles, not the clicks.",
            "Articulate your strategy: care resumed on 04/21/2026. What is your next monitoring action, and why is it the right one rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Reading an EOB line by line, remark codes included",
            "Reconciling provider balances to the EOBs and the MedPay ledger",
            "Applying the Payer Order: MedPay, then the Health Plan, then an LOP",
            "Preparing and transmitting an LOP on counsel's terms, and declining one",
            "Keeping a MedPay exhaustion ledger and LOP balances current",
            "Monitoring progress against the treatment map and the six-week rule",
            "Running A-C-T and the escalation ladder when care breaks down",
            "Holding the UPL line with providers and with John Doe"
          ]
        },
        best: [
          "Answer with the file's dates, figures and names, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D1#32", "D1#33", "D1#34", "D1#36", "D1#37", "D1#40", "D1#42", "D1#46"],
        rubric: {
          ai: [
            ["Payer and LOP accuracy", 15, "MedPay → Peach State → LOP; both LOP decisions explained; MedPay exhausted at $5,000.00 on the 06/12/2026 visit"],
            ["Map and monitoring", 15, "Restorative, week 9, on 04/08/2026; MMI on 06/12/2026, with the pre-demand audit next (final records, bills and lien amounts requested, every lien identified and verified; resolution follows the recovery); SMART goal with an objective measure and a date; ROM, pain and disability-index measures named"],
            ["Baseline and red flags", 15, "2021 low back, resolved, distinguished from the C5-C6 neck injury and the MRI's “no significant degenerative change at the adjacent levels”; medication and behavioral-health flags routed to the provider or Atty. Thorne"],
            ["Completeness", 15, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slides"],
            ["UPL boundary", 10, "Pressure scenario: nothing promised beyond the LOP's terms; Atty. Thorne's authority named before the visit"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 6 is the pressure scenario. The right answer promises nothing new, points the office manager to the LOP signed on 02/23/2026, and gets Atty. Thorne on it before the appointment, so the 19-day disruption doesn't grow.",
          "Question 5 tests the eggshell skill. A trainee who says the 2021 visits “don't matter” has argued; one who documents low back vs. neck, resolved, no prior neck complaints, has proved.",
          "Question 7: an opioid with a muscle relaxant and a sedative, a drug screen that doesn't match the prescriptions, doses rising with no change in diagnosis, behavioral notes about general stress rather than the crash, head-injury symptoms first reported months later. The provider hears the safety issue; Atty. Thorne hears the legal one; the conversation is documented.",
          "Compare each self-rating with the score. UPL is a gate: a strong score does not survive a payment promise to a provider."
        ]
      }

      ]
    },

    /* ---------- DAY 2 · MODULE 3 ---------- */
    {
      n: 3, id: "d2m3",
      title: "Client Investigation & Treatment Gap Analysis",
      about: "The 14-Day Gap investigated: a recorded call that gets John Doe's reasons in his own words, the records that prove his care was continuous, and a Gap Explanation Record for both interruptions.",
      quiz: [
        {q: "John Doe first treated on 02/20/2026, 14 days after the collision. Which question should open the investigation on the recorded call?",
         opts: ["“Was it because you had no car?”", "“You were feeling fine at first, weren't you?”", "“Take me through the days after the crash, from that morning up to 02/20.”", "“The adjuster will use this gap against you, so I need the reason.”"],
         a: 2, r: "Broad, open and neutral. The first two suggest an answer, so the reason becomes yours, not his; the last is an opinion on what the gap does to the case, which is Atty. Thorne's to give."},
        {q: "On the recorded call, John Doe asks: “Is this gap going to hurt my case?” The Case Manager should:",
         opts: ["Reassure him that a two-week gap won't matter", "Tell him honestly that it will lower the value", "Tell him cases with a gap like his usually still settle at the limits", "Say that's a question for Atty. Thorne, log it and route it, and carry on gathering the facts"],
         a: 3, r: "Reassurance, alarm and a settlement prediction are all opinions on his case. The Case Manager routes the question; Atty. Thorne answers it."},
        {q: "Which of these is NOT acceptable continuous-care evidence on John Doe's file?",
         opts: ["A note written in June at the firm's request, excusing him from work 02/09–02/13", "The EMS Run Report recording neck stiffness on 02/06/2026", "Northgate's Attendance Record of his call-outs 02/09–02/13 citing neck pain", "The 02/20/2026 urgent-care note recording onset at the MVA"],
         a: 0, r: "Nobody examined him 02/09–02/13, so a note made months later to the firm's order proves nothing and invites a fraud question. The employer's own record is the proof for those days."},
        {q: "John Doe's Gap Explanation Record must cover:",
         opts: ["Only the 14-day initial gap, because that is the one the adjuster will raise", "The 14-day gap (02/06–02/20/2026) and the 19-day disruption (04/02–04/21/2026), every reason paired with its document", "Only the reasons that can be proved from Medical Records", "The 14-day gap, with the firm's argument for why it doesn't matter"],
         a: 1, r: "Both interruptions, each reason beside its dated document. Facts and citations only; the argument is Atty. Thorne's."},
        {q: "A provider's note looks wrong about when John Doe's neck pain began. What do you do?",
         opts: ["Ask the provider to correct it to match the file", "Flag it to Atty. Thorne: a provider corrects its own record only by a dated addendum, and the original stays", "Fix it in the CMS copy", "Leave it: records don't matter until the demand"],
         a: 1, r: "Never ask a provider to change, back-date or add to a record. Altering a record can be evidence tampering or insurance fraud."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d2m3-l1",
        title: "Interview Techniques & UPL Boundaries in Client Investigation",
        topic: "Asking so that the answer is his, not yours",
        visual: "A matched-pairs board fills the upper two-thirds: a green-bordered left column headed ASK IT OPEN and a red-bordered right column headed NEVER LIKE THIS, each open question on the same line as the leading or opinion-laden version it replaces, so the eye reads across. The last red row carries a small red UPL chip. Lower third: a navy funnel narrowing left to right in three orange-numbered stages — ① OPEN ② FOLLOW HIS WORDS ③ PIN DATES & DOCUMENTS — with a mono pill at its mouth: RECORDED · CONSENT ON THE RECORD. The argument: the same fact, asked two ways, produces two different cases.",
        tell: {
          why: "The only gap explanation that holds up against insurance adjusters is John Doe's own factual explanation, supported by verifiable written documentation (e.g., work schedules, doctor availability notes, travel logs, or illness records). Your job is to draw it out with clean questions and record it as he gives it. The Case Manager records the client's documented facts directly, without attempting to interpret, defend, or judge how the gap impacts claim value. A reason the Case Manager suggested is not his explanation at all.",
          rules: [
            "Investigate; don't advocate. Read the EMS report, the 02/20/2026 urgent-care history and the treatment timeline, then write a question plan: questions only, never the answers you expect.",
            "Funnel: broad open questions first, then open follow-ups built on his own words, closed questions last and only to pin a date, a name or a document. One question at a time.",
            "Never lead. A question that names a reason or supplies an answer gets agreement, not information. The account stops being his, and it fails when it meets the records.",
            "Listen as motivational interviewing teaches: open questions, reflections of his own words, then a summary he can correct. Let pauses run; use plain words, not “Treatment Gap” or “causation”.",
            "Don't judge. Gaps have ordinary causes: missed appointments, transport, cost or co-pays, work schedules, stopping after temporary relief, expecting pain to pass, delayed referrals, imaging or authorizations. Know the list; never offer it to him.",
            "Record only with consent: state the date, who is on the call and that you are the Case Manager, not a lawyer, and get John Doe's spoken yes before any substance. Consent laws vary (some require every party's); confirm the governing rule.",
            "Protect privilege: the firm and its own client, in confidence. Confirm he can talk privately, ask Atty. Thorne before anyone joins (a third person can put privilege at risk), and label the recording privileged.",
            "A Recorded Statement to the other side is different: if Keystone asks John Doe for one, he declines and refers it to the firm. A Harbor Point or Cardinal State request goes to Atty. Thorne; their policies may require cooperation.",
            "Ask for the paper. After each reason he gives, ask what shows it in writing: a work schedule, a doctor's availability note, a travel log, an illness record, a text or a receipt. Open a dated task for each one.",
            "Record, don't interpret. Write his explanation in his words, beside the document that supports it: no adjectives, no defense of it, no view on what it does to the claim's value.",
            "Prevent the next gap. A barrier he names changes the plan, not the client: help coordinate transport, scheduling or referrals; confirm his 03/05/2026 consult with Dr. Reyes; ask how he gets to care after the rental ends 03/19/2026.",
            "Restate the standing instruction: keep every appointment; report worsening symptoms and any barrier before a visit is missed.",
            "Document every explanation and follow-up the same day, and escalate a gap that stays unexplained to Atty. Thorne."
          ],
          upl: [
            "You gather and document. You may not tell John Doe the gap “won't matter” or “will hurt the case”, what it does to value, or what to say about it. Log any such question and route it to Atty. Thorne.",
            "Reassure him about the process, never the outcome: “Atty. Thorne will review this” is support; “Don't worry, it won't matter” is an opinion on his case."
          ]
        },
        show: {
          caption: "The open question, and the version that fails the call",
          type: "split",
          do: [
            "“Take me through the days after the crash, up to 02/20.”",
            "“What, if anything, made it hard to get seen sooner?”",
            "“You said you figured it would pass. Tell me more.”",
            "“What made you go in on 02/20?”",
            "“That's one for Atty. Thorne. I'll make sure he gets it.”"
          ],
          dont: [
            "“You were fine at first, weren't you?”",
            "“Was it because you had no car?”",
            "“So you didn't think it was serious?”",
            "“The pain got worse, right?”",
            "“Don't worry, it won't matter.” or “This will hurt your case.”"
          ]
        },
        ops: [
          ["Records show the 14-day gap", "Read the EMS report, the urgent-care history and the timeline; write the question plan", "CMS → Case File → Treatment timeline · Case Notes", "Plan saved before the call; no question in it names a reason"],
          ["Call connects", "State date, participants and recording; get consent; confirm privacy", "Call Simulator → AI John Doe (recorded call)", "Consent and privacy on the recording before the first substantive question"],
          ["John Doe asks what the gap does to his case", "Give no opinion; log the question and route it", "CMS → Tasks → Escalate", "Escalated to Atty. Thorne the same day; no opinion on the recording"],
          ["A carrier asks John Doe for a Recorded Statement", "Remind him to route it to the firm; log it; tell Atty. Thorne", "CMS → Communications Log", "No statement given without Atty. Thorne; request logged and escalated the same day"]
        ],
        best: [
          "Ask open, follow his words, close last.",
          "Paraphrase back and let him correct you: an accurate record beats a fast one.",
          "Prevention now is far cheaper than explaining a second gap in the demand.",
          "Pitfall: a question that names the reason you expect to hear.",
          "Pitfall: reassuring him (“it won't matter”) or alarming him (“it will hurt the case”). Both are opinions on the case.",
          "Pitfall: blaming the client for the gap; he stops telling you the whole story."
        ],
        sources: ["D1#44", "D1#28", "LSH Claims Specialist: communication skills and professionalism — clarity without jargon, empathy, active listening, paraphrasing, calm reassurance", "LSH Claims Specialist: LOR — all carrier communication through the firm", "Newly authored: non-leading investigative interview technique (the funnel); recording consent and privilege on a client call; reassurance about process, never outcome"],
        rubric: {
          ai: [
            ["Question plan", 20, "Open questions only; none names a reason or supplies an answer; closed questions reserved for dates and documents"],
            ["On-the-record opening", 20, "Date, participants, role (not a lawyer), recording consent and privacy, all before substance"],
            ["Doctrine", 20, "Funnel order, the common causes of gaps, and the client-call vs. adverse recorded-statement distinction stated correctly"]
          ],
          trainer: [
            ["Interview judgment", 25, "Non-judgmental, plain-language questioning that would keep a stressed client talking"],
            ["UPL boundary", 15, "No reassurance, alarm or value opinion; effect and value questions routed to Atty. Thorne"]
          ]
        },
        notes: [
          "Write two questions on the board: “Was it because you had no car?” and “What, if anything, made it hard to get seen sooner?” Ask which one the defense would rather you asked. Then show the matched pairs.",
          "Ask the room: “If John Doe's reason is true, why does it matter how you asked for it?” Land it: a suggested reason is the one a stressed client agrees to, whether or not it is the true one or the whole one, and it fails against the records or at a deposition.",
          "Watch for soothing. “Don't worry” is the most common UPL slip in this module; it sounds kind, and it is an opinion on the case. The line is general versus specific: Day 1's instruction that consistent care matters is education; what this gap does to his case is Atty. Thorne's.",
          "Legal nuance: recording laws vary and some require every party's consent, so the firm gets consent on the record every time. The call is privileged because it is the firm and its own client; a third person on the line can put that at risk. A Recorded Statement to Keystone is the opposite case: refused, and routed to the firm."
        ]
      },

      {
        kind: "activity", id: "d2m3-a1",
        title: "Probe the 14-Day Treatment Gap with AI John Doe",
        topic: "Skill Activity 1 — Call Simulator: the 14-Day Gap, in his words",
        visual: "A call-simulator screen across the left two-thirds: a navy header bar reading AI JOHN DOE · RECORDED CALL · 03/04/2026 with a red recording dot, a cream transcript pane, and beneath it a question meter of three mono pills that count OPEN · CLOSED · LEADING, the last in red. Right third: four empty reason slots with orange numbered badges ①–④, each with a document slot beside it, filling only as the trainee surfaces them. Under the slots, a red danger callout: “A suggested reason earns a yes, not a fact.” The argument: reasons are earned by questions, never supplied.",
        act: {
          scenario: "03/04/2026. The first records are in. Riverton Urgent Care's note of 02/20/2026 reads: “onset at MVA 02/06/2026, progressively worsening; numbness to right hand since 02/18.” The EMS Run Report records neck stiffness on 02/06/2026. John Doe has been at Riverton Spine & Rehab since 02/24/2026; his rental runs to 03/19/2026. Nobody has asked him why he waited 14 days.",
          prompt: "Run a recorded call with AI John Doe to learn why he first treated on 02/20/2026, 14 days after the collision. Open on the record: the date, who is on the call, his consent to recording, and that he can talk privately. Ask open questions, follow his words, and keep closed questions for pinning dates and documents. Find out who he told and what he kept; read his account back. Close with the standing instruction and his next appointment, then file a privileged GIRP note. Graded failures: any leading question or suggested reason, and telling him the gap “won't matter” or “will hurt the case”.",
          tool: "Call Simulator → AI John Doe (recorded call) · CMS → Case Notes · Tasks",
          output: "A consented, privileged recording with all four reasons in John Doe's own words, a same-day GIRP note, and a dated task for every corroborating document.",
          checkpoints: [
            "Recording opens with 03/04/2026, everyone on the call, the CM's role, John Doe's spoken consent, and confirmation he can talk privately",
            "First substantive question is open and covers 02/06/2026 to 02/20/2026; zero leading questions, and no reason introduced before John Doe raised it",
            "Reason 1, in his words: no transportation (Civic towed from the scene, Kevin Alvarez's Escape in the shop, no rental until 02/18/2026)",
            "Reason 2, in his words: he thought it was soreness that would pass, and took OTC ibuprofen and lidocaine patches",
            "Reason 3, in his words: unsure his Peach State coverage (effective 02/01/2026) was active; didn't know MedPay existed",
            "Reason 4, in his words: numbness into his right hand from 02/18/2026; worked 02/18–02/19; urgent care on his first day off, 02/20/2026",
            "Corroboration surfaced: texts to Margaret Doe 02/07–02/15, Northgate call-outs 02/09–02/13 citing neck pain, the 02/07/2026 Riverton Drug receipt; texts to be kept unaltered",
            "No statement that the gap “won't matter” or “will hurt the case”; any effect or value question logged and routed to Atty. Thorne",
            "Close: account read back and corrected; standing instruction restated; his 03/05/2026 Lakeside Orthopedics consult confirmed; his transport plan for after 03/19/2026 asked and logged",
            "GIRP note filed 03/04/2026 and labelled privileged: Goal, Intervention, Response (his words, in quotation marks), Plan",
            "One dated task per document: the text thread, the receipt, the Northgate Attendance Record"
          ]
        },
        show: {
          caption: "The call's run sheet",
          type: "process",
          steps: [
            ["On the record", "Date, who is on the call, your role, his consent, privacy, the purpose in one plain sentence."],
            ["Open wide", "“Take me through the days after the crash, up to 02/20.”"],
            ["Follow his words", "Reflect what he raised and ask for more. Never introduce a reason."],
            ["Pin and corroborate", "Closed questions last: dates, who he told, what he kept."],
            ["Read it back", "Paraphrase; he corrects."],
            ["Close", "Standing instruction, the 03/05 consult, transport after 03/19/2026; value questions to Atty. Thorne."]
          ]
        },
        ops: [
          ["Call connects", "Open on the record: role, consent, privacy, purpose", "Call Simulator → AI John Doe (recorded call)", "Consent audible before the first substantive question"],
          ["John Doe raises a reason or names someone he told", "Follow up open, then pin the date and the document", "Call Simulator → AI John Doe (recorded call)", "Each reason tied to a date and a source he named"],
          ["Call ends", "File the GIRP note; open a task per document", "CMS → Case Notes · Tasks", "Note dated 03/04/2026; every task with an owner and a due date"]
        ],
        best: [
          "Let a pause run; clients fill silence with the detail you need.",
          "Put his words in quotation marks under Response. Your summary is yours; don't put it in his mouth.",
          "Pitfall: rescuing a hesitant client with a suggested reason.",
          "Pitfall: a call note that records how John Doe felt but no intervention and no plan.",
          "Pitfall: ending the call without asking who he told and what he kept; reasons need documents."
        ],
        sources: ["D1#44", "D1#28", "D1#29", "LSH Claims Specialist: communication skills and professionalism — clarity without jargon, empathy, active listening, paraphrasing, calm reassurance", "Newly authored: non-leading investigative interview technique (the funnel); recording consent and privilege on a client call"],
        rubric: {
          ai: [
            ["Four reasons elicited", 25, "All four reasons surfaced in John Doe's words, with their dates: rental 02/18/2026, receipt 02/07/2026, coverage effective 02/01/2026, numbness from 02/18/2026, first day off 02/20/2026"],
            ["Question discipline", 15, "Zero leading questions; no reason introduced by the CM"],
            ["On-the-record opening", 10, "Role, consent and privacy captured before substance"],
            ["GIRP note and tasks", 10, "All four GIRP fields; one dated task per corroborating document"]
          ],
          trainer: [
            ["Interview craft", 20, "Rapport, pacing, follow-ups built on his words, an accurate read-back"],
            ["UPL boundary", 20, "No reassurance or alarm about the gap; effect and value questions routed to Atty. Thorne"]
          ]
        },
        notes: [
          "Before the first trainee dials, read the two graded failures aloud: a leading question or suggested reason, and any “won't matter” or “will hurt the case”. Then let the simulator run without coaching.",
          "After the first call, ask the room: “Which reason was hardest to get, and what question finally got it?” Usually it is the cost worry; clients are embarrassed by it, and only a non-judgmental question reaches it.",
          "Watch the rental reason. Trainees who know the file ask “Was it the car?” within two minutes. AI John Doe will say yes, the other reasons stay hidden, and the call fails: a leading question buys agreement, not information.",
          "Grade the note as hard as the call: his words under Response, a dated plan, the privileged label. A strong call with a feelings-only note leaves the demand with nothing to stand on."
        ]
      },

      {
        kind: "lesson", id: "d2m3-l2",
        title: "Medical Excuse Notes & Continuous-Care Documentation Rules",
        topic: "What proves the care was continuous, and what never happens",
        visual: "A two-column compare board. Left: a cream card with a green top rule headed COUNTS — MADE AT THE TIME, each item with a small document icon and its date in a mono pill (02/06 EMS · 02/07 receipt · 02/09–02/13 call-outs · 02/20 urgent care · 06/19 Causation Letter). Right: a red-bordered card headed NEVER — MADE TO ORDER, each item struck through with a thin red line. Along the bottom, a navy timeline from 02/06 to 06/19 with the left card's documents pinned to it, showing the proof was laid down while the gap was happening. The argument: timing is what makes a document believable.",
        tell: {
          why: "The only gap explanation that holds up against insurance adjusters is John Doe's own factual explanation, supported by verifiable written documentation (e.g., work schedules, doctor availability notes, travel logs, or illness records). Around it, continuity is shown by records made at the time (provider notes placing onset at the collision, histories that agree, the EMS report, work records) and later a causation opinion Atty. Thorne requests. A record made to order destroys the case it was meant to save.",
          rules: [
            "Continuity is proved by records made at the time, then by a treating doctor's opinion that reads them; never by explanations made to order.",
            "Read every history for mechanism (the collision), onset (02/06/2026) and body region (neck and right arm; the 2021 visits were low back).",
            "Histories must agree across providers: the PT notes must match Dr. Reyes's findings and orders. Flag a conflict to Atty. Thorne the day you see it; never resolve it yourself.",
            "Never ask a provider to change, back-date or add to a record. A record that looks wrong goes to Atty. Thorne; a provider corrects its own record by a dated addendum, and the original stays. Altering a record can be evidence tampering or insurance fraud.",
            "Never request an excuse note to order. A work note proves only what its author saw or ordered at a visit: check the signer, the visit date and that the days covered follow from it. For 02/09–02/13, before anyone examined him, Northgate's Attendance Record is the proof.",
            "The EMS report bridges day zero: neck stiffness on 02/06/2026, recorded by a neutral responder. Record “declined transport” exactly as written; what it means is Atty. Thorne's to argue.",
            "Dated, unaltered non-medical records count: the 02/07/2026 Riverton Drug receipt, the full text thread to Margaret Doe 02/07–02/15, not chosen screenshots.",
            "A causation opinion is requested by Atty. Thorne, in his letter, with the records the doctor needs. You assemble the set and track the reply; you never draft or suggest its words.",
            "Tell providers scheduling facts only: the missed dates, the rescheduled visit. Why he missed is John Doe's to tell them; nothing he told the firm reaches a chart through you.",
            "Never hide an interruption: show it with its dates and the same complaints before and after. Unexplained reads as healed."
          ],
          upl: [
            "You collect, compare and flag records. You never tell a provider what to write or script what John Doe tells them; the standing instruction to report every symptom is not a script. What a record means for causation is the doctor's opinion and Atty. Thorne's argument."
          ]
        },
        show: {
          caption: "Made at the time vs. made to order",
          type: "compare",
          boxes: [
            {head: "COUNTS — made at the time", items: [
              "EMS Run Report: neck stiffness, 02/06/2026.",
              "Urgent-care note, 02/20/2026: onset at the MVA.",
              "Histories that agree on mechanism, onset and body region.",
              "Northgate call-outs 02/09–02/13; work notes matched to a visit.",
              "Dated, unaltered texts and receipts.",
              "Dr. Reyes's Causation Letter, requested through Atty. Thorne."
            ]},
            {head: "NEVER — made to order", items: [
              "Asking a provider to change, back-date or add to a record.",
              "An excuse note written to order, or for unexamined days.",
              "Drafting or suggesting a doctor's opinion.",
              "Scripting what John Doe tells his providers.",
              "Editing, cropping or deleting texts or posts.",
              "Quietly “fixing” a history that conflicts."
            ]}
          ]
        },
        ops: [
          ["A provider record arrives", "Compare mechanism, onset date and body region with the other histories", "CMS → Case File → Treatment timeline", "Each history logged consistent, or flagged with the conflicting line quoted"],
          ["A history conflicts with another provider's", "Flag it to Atty. Thorne; change and request nothing", "CMS → Tasks → Escalate", "Escalated the day it is found; no contact with the provider about wording"],
          ["Atty. Thorne decides to seek a causation opinion", "Assemble the records for his request letter; docket the follow-up", "Medical Records Requests · CMS → Calendar", "Request goes under his signature; follow-up date on the calendar"],
          ["A work or excuse note arrives", "Check signer, date and covered days against the visit record", "CMS → Documents", "Every covered day matches a visit or a restriction given at one; mismatches flagged"]
        ],
        best: [
          "Collect what already exists before asking anyone for anything new.",
          "Quote records exactly; never paraphrase a history into something stronger.",
          "Reconcile conflicting provider statements at once, by flagging them, not by fixing them.",
          "Maintain the treatment timeline so every interruption is visible with its dates.",
          "Pitfall: asking a provider to “clarify” a note in a way that tells them what to write.",
          "Pitfall: leaving the gap out of the timeline and hoping it's missed."
        ],
        sources: ["D1#44", "D2#13", "D1#39", "LSH Claims Specialist: attention to detail — cross-referencing facts and dates across documents", "Newly authored: continuous-care documentation tests and record integrity (no altered, back-dated or to-order records; excuse notes cover only what the author saw)"],
        rubric: {
          ai: [
            ["Evidence classification", 25, "Each item placed correctly as continuous-care proof or as never acceptable"],
            ["History comparison", 20, "Mechanism, onset date (02/06/2026) and body region checked across providers"],
            ["Excuse-note test", 15, "Signer, date and covered days checked against the visit record; 02/09–02/13 proved by Northgate's record"]
          ],
          trainer: [
            ["Record integrity", 25, "Never proposes altering, back-dating or ordering a record; flags rather than fixes"],
            ["UPL boundary", 15, "Causation opinion requested through Atty. Thorne; no wording suggested to a provider or to John Doe"]
          ]
        },
        notes: [
          "Open with the right-hand box covered. Ask: “The adjuster says the gap proves he healed. What would you collect?” List the answers, then reveal both boxes and sort them.",
          "Ask the room: “Riverton Spine & Rehab's front desk offers to add a line to an intake form saying the pain began at the crash. What do you say, and who do you tell?” The answer is no, nothing is added at the firm's request, and Atty. Thorne hears about it the same day.",
          "Watch for trainees who think a stronger note is always better. A note that appears after the firm asked for it, saying exactly what the firm needed, is the weakest document in the file.",
          "Legal nuance: for 02/09–02/13 the employer's own Attendance Record beats any later doctor's note for days nobody examined him. Dr. Reyes's letter matters because it is her opinion, requested by counsel; the Case Manager's fingerprints on its wording would make it worthless."
        ]
      },

      {
        kind: "activity", id: "d2m3-a2",
        title: "Gap Explanation Record Creation",
        topic: "Skill Activity 2 — every reason beside its proof, for both interruptions",
        visual: "A white CMS record card with a navy header, GAP EXPLANATION RECORD · JOHN DOE, split into two horizontal bands of equal weight: 14-DAY GAP · 02/06–02/20/2026 and 19-DAY DISRUPTION · 04/02–04/21/2026. Each band has three columns, REASON · CORROBORATING DOCUMENT · DATE, with orange numbered badges on the reasons and mono date pills. A grey ACCOUNT ONLY tag marks any row without an independent document. Bottom-right, a ROUTE TO ATTY. THORNE control. The argument: every reason sits beside its proof, and the second interruption gets the same room as the first.",
        act: {
          scenario: "06/22/2026. John Doe reached MMI on 06/12/2026. Dr. Alana Reyes's Causation Letter of 06/19/2026 is in: delayed presentation is clinically consistent with a disc injury whose radicular symptoms evolve over days to weeks, and the injury was more likely than not caused by the collision. The 03/04 call note, the 04/08 A-C-T log and every record are in the CMS. Atty. Thorne wants the record before the pre-demand strategy session.",
          prompt: "Build John Doe's Gap Explanation Record in the CMS. Cover both interruptions, the 14-day gap (02/06–02/20/2026) and the 19-day disruption (04/02–04/21/2026), with exact dates. Pair every reason with the dated document that corroborates it; mark a reason with no independent document “account only”. Cite the complaints before and after each interruption, and the firm's follow-up during the disruption. Write facts and citations only: no argument, no valuation, nothing quoted from the privileged call. Run a defense-eye pass, then route it to Atty. Thorne.",
          tool: "CMS → Case File → Gap Explanation Record · Tasks",
          output: "A routed record covering both interruptions, every reason beside a dated document, ready for Atty. Thorne to decide how it is used in the demand.",
          checkpoints: [
            "Initial gap: 14 days, 02/06/2026 → 02/20/2026. Disruption: 19 days, 04/02/2026 → 04/21/2026, missed visits 04/03, 04/07, 04/09 and 04/14",
            "No transportation → the tow and storage record (Civic towed from the scene 02/06/2026); Keystone's rental authorization, from 02/18/2026; Kevin Alvarez's Escape being in the shop marked “account only”",
            "Expected it to pass → Riverton Drug receipt 02/07/2026 (ibuprofen, lidocaine patches); texts to Margaret Doe 02/07–02/15",
            "Cost worry → Peach State eligibility, effective 02/01/2026 (five days before the collision: 02/01 → 02/06), through a Northgate job begun 01/12/2026; the worry itself marked “account only”",
            "Escalation → urgent-care note 02/20/2026, quoted exactly: “onset at MVA 02/06/2026, progressively worsening; numbness to right hand since 02/18”; Northgate's Attendance Record (worked 02/18–02/19; 02/20 his first day off)",
            "Continuity across the 14 days → EMS report 02/06/2026; Northgate call-outs 02/09–02/13 citing neck pain; Dr. Reyes's Causation Letter 06/19/2026",
            "Disruption → Keystone's rental record (30-day cap, 02/18–03/19/2026, Civic waiting on parts); its refusal of an extension, 04/10/2026; repair completed 04/24/2026; the carpool ending 04/01/2026 marked “account only”, a statement from Kevin Alvarez flagged for Atty. Thorne's decision",
            "Follow-up dated: missed-visit alert and A-C-T call 04/08/2026, extension refused 04/10, evening slots with Margaret driving from 04/21, attendance confirmed 04/21 and 04/23",
            "Complaints before and after each interruption cited from the EMS report and the provider notes, quoted, never strengthened",
            "Facts and citations only; defense-eye pass logged: John Doe's public social media for both windows checked, nothing deleted or advised deleted; record routed to Atty. Thorne with a timestamp",
            "Two layers: the internal record (account-only tags, the Kevin Alvarez flag, the defense-eye and social-media pass) is labelled attorney work product and stays in the CMS. If Atty. Thorne decides the gap goes to Keystone, an outward-facing gap timeline (dates, reasons, documents only) is drafted from it for his approval."
          ]
        },
        show: {
          caption: "The record's shape, one row worked for each interruption",
          type: "table",
          head: ["Interruption", "Reason (his account)", "Corroborating document"],
          rows: [
            ["14 days · 02/06–02/20/2026", "Thought it would pass; self-treated", "Riverton Drug receipt, 02/07/2026"],
            ["19 days · 04/02–04/21/2026", "No car: rental over, Civic awaiting parts", "Keystone rental record, 02/18–03/19/2026; extension refused 04/10/2026"]
          ]
        },
        ops: [
          ["Causation Letter received", "Log it; cite it beside the expected-to-pass and escalation reasons", "CMS → Documents · Case File → Gap Explanation Record", "Letter dated 06/19/2026 cited on the 14-day band"],
          ["Record drafted", "Pair every reason with a dated document; mark account-only reasons", "CMS → Case File → Gap Explanation Record", "No reason without a document or an “account only” tag"],
          ["Record complete", "Run the defense-eye pass and route to Atty. Thorne", "CMS → Tasks", "Routed with a timestamp before the pre-demand strategy session"]
        ],
        best: [
          "One reason per row, one dated document per reason.",
          "Keep the work-product layer in the CMS; anything that leaves the firm is a separate timeline Atty. Thorne approves.",
          "Show the firm's follow-up, not only the client's reasons: the A-C-T steps show the disruption was managed, not ignored.",
          "Record each explanation exactly as John Doe gave it and as the document shows it; what it means for the claim is Atty. Thorne's to judge.",
          "Keep one story across claims: the no-car days 02/06–02/17 are the same 12 days claimed as Loss of Use on the Civic's property-damage claim.",
          "Pitfall: documenting the 14-day gap and forgetting the 19-day disruption.",
          "Pitfall: presenting a reason that rests on the client's word as if it were documented."
        ],
        sources: ["D1#44", "D2#13", "D2#8", "LSH Claims Specialist: attention to detail — cross-referencing facts and dates across documents"],
        rubric: {
          ai: [
            ["Both interruptions", 15, "14 days (02/06–02/20/2026) and 19 days (04/02–04/21/2026), exact dates and the four missed visits"],
            ["Reason–document pairing", 25, "Every reason beside its dated corroborating document; account-only reasons tagged"],
            ["Continuity and follow-up", 10, "Complaints before and after each interruption cited; A-C-T steps dated"],
            ["Defense-eye and routing", 10, "Social-media pass logged; routed to Atty. Thorne with a timestamp"]
          ],
          trainer: [
            ["Evidentiary judgment", 25, "Separates proof from assertion; nothing stated beyond what each record says"],
            ["UPL and privilege boundary", 15, "Facts and citations only; no argument, valuation or quotation from the privileged call"]
          ]
        },
        notes: [
          "Put the adjuster's four arguments on the board first: not serious, recovered early, treatment unnecessary, another cause. Tell the room the record answers each with a document, not a sentence.",
          "Ask the room: “Which reason on this file has the weakest document, and what do you do about it?” The cost worry and the carpool's end rest mostly on John Doe's account. Tag them and flag them to Atty. Thorne; never shore them up with a note made to order.",
          "Watch for trainees who stop at the 14-day gap. The 19-day disruption is the one the defense will call a failure to keep up with care; it needs its own rows and the firm's follow-up beside them.",
          "Disclosure nuance: Atty. Thorne may send a version of this record with the demand or rebuttal. Keep the work-product layer out of anything that leaves the firm, and the privileged call out of all of it."
        ]
      },

      {
        kind: "check", id: "d2m3-kc",
        title: "UPL & Investigation Review",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split (cream question panel, navy Self-Summary card, 1–5 ladder, 60/40 strip with the separate red UPL gate). Module-specific addition: a slim QUESTION AUDIT strip between the panels, three mono chips — OPEN · CLOSED · LEADING, the last in red — that the trainee uses to tag their own rewrite in question 2 before answering. The red chip is the reminder that one leading question fails the call, however good the rest of it was.",
        check: {
          questions: [
            "Name the four reasons for John Doe's 14-day gap and, beside each, the document that corroborates it, with its date.",
            "Rewrite “Was it because you had no car?” so it could surface the same reason without suggesting it. Explain what the leading version costs the file.",
            "On the recorded call John Doe asks, “Is this gap going to wreck my case?” Give your answer word for word, then say what you do with the question."
          ],
          summary: [
            "Summarize, in your own words, what you learned about investigating a client's Treatment Gap: the principles, not the clicks.",
            "Articulate your strategy: the Gap Record is with Atty. Thorne. What is your next action on this file, and why is it the right one rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Opening a recorded client call on the record: role, consent, privacy",
            "Asking open, non-leading questions and following the client's own words",
            "Holding the UPL line when a client asks what a fact does to his case",
            "Writing a GIRP call note with the client's words and a dated plan",
            "Telling records made at the time from records made to order",
            "Building a Gap Explanation Record that pairs every reason with a dated document"
          ]
        },
        best: [
          "Answer with the file's own dates and documents, not general rules.",
          "Pitfall: rating yourself a 5 on non-leading questions after a call that led even once."
        ],
        sources: ["D1#44", "D2#13", "D1#28", "D1#29"],
        rubric: {
          ai: [
            ["Reasons and documents", 20, "All four reasons, each with its corroborating document and date"],
            ["Question discipline", 15, "The rewrite is open and names no reason; the cost of the lead stated"],
            ["Documentation rules", 15, "Five continuous-care records and two prohibited acts; the disruption dated 04/02–04/21/2026 with its four missed visits"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slides"],
            ["UPL boundary", 10, "Question 3 answered without reassurance or alarm; question 6 declined and escalated"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Run question 3 aloud as a role-play before the written check: you are John Doe, a trainee answers. Stop the room on the first “don't worry”.",
          "Ask the room about question 6: “Why is the provider's offer more dangerous than a missing note?” A missing note is a weakness; an altered one is a credibility collapse and possibly a fraud question.",
          "Question 2 matters most. A trainee who cannot rewrite the lead has learned the rule, not the skill; send them back to the simulator.",
          "UPL is a gate: a strong score does not survive a coached answer or a requested change to a record."
        ]
      }

      ]
    },

    /* ---------- DAY 2 · MODULE 4 ---------- */
    {
      n: 4, id: "d2m4",
      title: "Pre-Demand Auditing & Strategy Session",
      about: "AI attorney collaboration: audit John Doe's file to MMI and $16,401.40 in Specials, re-verify the policy-limits targets, and brief Atty. Thorne in a strategy session where he makes the calls.",
      quiz: [
        {q: "Riverton Spine & Rehab billed 34 lines at $185.00, but its treatment notes show 33 visits. After the audit, John Doe's medical Specials are:",
         opts: ["$15,002.40", "$14,817.40", "$16,401.40", "$13,277.40"],
         a: 1, r: "$15,002.40 less the duplicate 05/04/2026 line ($185.00) = $14,817.40. $16,401.40 adds the $1,584.00 in wages; $13,277.40 is the paid-and-owed column, not the billed medical total."},
        {q: "Lakeside Orthopedics declared MMI on 06/12/2026 and noted possibly 1–2 repeat injections within 24 months. Where does that $3,400–$6,800 go?",
         opts: ["Into the Specials ledger at $6,800", "Nowhere: it hasn't been incurred", "Into the demand narrative as future medical, outside the Specials total", "Onto Riverton Spine & Rehab's LOP balance"],
         a: 2, r: "The audited Specials total is charges already incurred. Future care is still economic damage, presented in the narrative with the MMI note behind it, never mixed into the audited total."},
        {q: "Crescent Pain & Spine billed $3,400.00 for the injection; Peach State paid $1,860.00 and Crescent wrote off the rest. Who decides whether the demand claims the billed or the paid amount?",
         opts: ["The Case Manager, who built the ledger", "Dana Whitfield, Keystone's adjuster", "Peach State, as the plan asserting reimbursement", "Atty. Thorne, under the governing collateral-source rule"],
         a: 3, r: "It turns on a collateral-source rule that varies by state. The Case Manager shows both columns; the choice is counsel's."},
        {q: "In the pre-demand strategy session, which of these may the Case Manager recommend?",
         opts: ["Serving the demand by certified mail with return receipt and by email, so receipt can be proved", "Demanding the $10,000 BI limits", "Claiming billed rather than paid amounts", "Sending the Host UM demand now, alongside the BI demand"],
         a: 0, r: "Service method is operational, so you may recommend it, within whatever the governing statute requires for a Time-Limited Demand (Atty. Thorne confirms and approves). The demand figure and billed-vs-paid are his legal calls. A UM demand now would be premature: the UM layers owe nothing until BI is exhausted, and settling BI without their consent is what puts them at risk."},
        {q: "Northgate's HR letter verifies 9 missed shifts at 8 h × $22.00, but five of them (02/09–02/13/2026) fall before John Doe's first treatment and carry no provider work note. In the audited Specials, the Case Manager:",
         opts: ["Drops the five shifts and claims only four: $704.00", "Asks Dr. Reyes for a work note backdated to cover 02/09–02/13/2026", "Keeps $1,584.00, flags the five shifts with Northgate's Attendance Record (called out citing neck pain) as their support, and routes them to Atty. Thorne", "Keeps $1,584.00 and leaves the five shifts unmentioned so Keystone doesn't notice them"],
         a: 2, r: "Flag, never drop, never hide. 9 × 8 h × $22.00 = $1,584.00, verified by Northgate. Five of the shifts fall inside the 14-Day Gap: record them exactly as the Attendance Record shows them, beside John Doe's own explanation of the gap. How they are presented is Atty. Thorne's call."},
        {q: "Who determines MMI on John Doe's file?",
         opts: ["The Case Manager, from the bills", "His treating provider: Lakeside Orthopedics' 06/12/2026 note", "Keystone's adjuster", "Atty. Thorne"],
         a: 1, r: "MMI is a medical determination, never yours: record it from the treating provider's note, with the future-care plan."},
        {q: "Which four objectives does the pre-demand audit test?",
         opts: ["Verification, Valuation, Risk, Compliance", "Speed, Volume, Tone, Format", "Liability, Venue, Jury, Judge", "Clinical, Functional, Financial, Legal"],
         a: 0, r: "Do the facts match the evidence, is every dollar justified, where will the defense attack, and are the SOL and any statutory terms confirmed?"},
        {q: "Why does John Doe's Civic stay out of his BI Specials?",
         opts: ["It runs on its own Keystone PD claim, outside the $40,000", "Property Damage is never recoverable", "Bluewater already paid it", "It is future medical"],
         a: 0, r: "Special damages include Property Damage, but the Civic is on its own PD claim, so the BI Specials are medical plus wages."},
        {q: "Briefing Atty. Thorne for the strategy session, what comes first?",
         opts: ["The full chronology", "The bottom line in one sentence: where the file stands and what you need", "The risks", "Your recommended demand figure"],
         a: 1, r: "Bottom line first. A brief that opens with the chronology buries the decision, and the demand figure is his call."},
        {q: "After the strategy session, how are Atty. Thorne's decisions recorded?",
         opts: ["From memory at the end of the week", "The same day, in his words and dated, with a task for each and the Case Plan re-routed", "Only in an email", "In the demand letter"],
         a: 1, r: "Record the decisions the same day, attributed and dated; a task for each with an owner and a date; the Case Plan marked superseded and re-routed."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d2m4-l1",
        title: "MMI, Special Damages & Policy-Limits Targets",
        topic: "The audit that decides what the demand can claim",
        visual: "A left-to-right audit run across the full slide. Far left, a navy vertical gate labelled MMI · 06/12/2026 with a green ✓; nothing enters the ledger until it is passed. Centre, a cream ledger card with the provider rows in mono; the Riverton Spine & Rehab row shows $6,290.00 struck through in red, replaced by $6,105.00, with an orange badge: –$185.00 · 05/04/2026 DUPLICATE. Under it, the sum in large Fraunces: $14,817.40 + $1,584.00 = $16,401.40. A grey card, FUTURE MEDICAL · NARRATIVE, sits deliberately outside the ledger frame. Right third: three numbered targets bottom-up, ① $10,000 BI ② $20,000 HOST UM ③ $10,000 RELATIVE UM, each with a mono source pill. The argument: an audited number, inside its frame, aimed at limits in order.",
        tell: {
          why: "Pre-demand is where most of a file's value is won or lost: The demands that follow can only spend what this audit proves. A duplicate line or an unchecked limit is Keystone's easy out, and $7,965.00 in liens waits behind a $10,000 BI limit.",
          rules: [
            "Audit against four objectives: Verification (facts match evidence?), Valuation (every dollar justified?), Risk (where will the defense attack?), Compliance (SOL 02/06/2028 docketed; statutory demand terms confirmed by Atty. Thorne).",
            "MMI is a medical determination, never yours: record it from Lakeside Orthopedics' 06/12/2026 note, with the future-care plan. By default, no demand before MMI: the bills are still growing. Demanding earlier (Specials already over the limit, a deadline pressing) is Atty. Thorne's call.",
            "Special damages = Medical Bills + lost wages + Property Damage. The Civic runs on its own Keystone PD claim, outside the $40,000, so John Doe's BI Specials are medical + wages.",
            "Audit the medicals in three passes. Chronology: every gap with its documented reason (the 14 days, the 19-day disruption). Coding: duplicate or unbundled lines. Prior history, 5–10 years back: three 2021 low-back chiropractic visits, resolved; no prior neck complaint.",
            "Test every line as reasonable and necessary: fits the mechanism, clinically ordered (the MRI on Dr. Reyes's 03/05/2026 order; the injection after the 03/27/2026 referral), backed by objective findings.",
            "Show billed beside paid. Which column the demand claims turns on the governing collateral-source rule, which varies by state: Atty. Thorne's call, never the ledger's.",
            "Lost wages need the employer's wage letter and a provider's work note. Northgate verifies 9 shifts × 8 h × $22.00 = $1,584.00; flag the five shifts before first treatment, which have no note.",
            "Future medical is economic damage but not an incurred charge: the possible repeat injections ($3,400–$6,800) stay out of the audited total and go in the narrative, with the MMI note behind them. How they are claimed is Atty. Thorne's call.",
            "Identify every lien and subrogation interest. Plan: Peach State's $1,860.00, funding type recorded. Consensual: the LOP. MedPay: no reimbursement right against John Doe (03/02/2026). Ask Harbor Point in writing whether it reserves MedPay subrogation against Robert Smith; record the answer and route it to Atty. Thorne.",
            "Audit the limits one last time: per person, no step-down, each UM layer's form. Present, don't compile: $16,401.40 already exceeds the $10,000 BI limit, and proving it document by document makes a carrier fear a jury."
          ],
          upl: [
            "You audit, total, flag and lay out options. You do not value the case, choose billed or paid, or set the demand figure: the audit reaches Atty. Thorne as findings, not conclusions."
          ]
        },
        show: {
          caption: "The policy-limits targets, in the order they open",
          type: "table",
          head: ["Order", "Layer", "Limit", "Re-verify before the ask"],
          rows: [
            ["1", "BI — Keystone Mutual", "$10,000", "Per person (03/20/2026 Dec Page); confirm no step-down"],
            ["2", "Host UM — Harbor Point", "$20,000", "Add-on; no MedPay offset (03/02/2026 letter); opens after the BI tender"],
            ["3", "Relative UM — Cardinal State Mutual", "$10,000", "Coverage (03/09/2026 letter); UM form and other-insurance clause from the certified policy; priority is Atty. Thorne's call"],
            ["Not a layer", "MedPay · Keystone PD", "—", "Neither counts toward the $40,000"]
          ]
        },
        ops: [
          ["MMI note received (06/12/2026)", "Record MMI and the future-care plan; open the pre-demand audit", "CMS → Case File → Treatment timeline · CMS → Tasks", "MMI dated from the provider's note; audit task has an owner and a date"],
          ["Final bills and records in", "Build the Specials ledger and reconcile it to the chronology", "CMS → Financial Ledger → Specials", "Every billed date matches a visit; medical total $14,817.40"],
          ["Ledger reconciled", "Register every lien; record billed beside paid", "CMS → Liens · CMS → Financial Ledger → Net Sheet → Lien Tracker", "$1,860.00 and $6,105.00 listed; billed-vs-paid routed to Atty. Thorne"],
          ["Before the ask", "Re-verify each limit and record the targets in order", "CMS → Insurance tab → Coverage Matrix", "$10,000 → $20,000 → $10,000 = $40,000, each with its written source"]
        ],
        best: [
          "Stress-test the file before the defense gets its hands on it.",
          "Lock in total damages first, then protect them by identifying every lien before the demand.",
          "Record the source of every figure, so Atty. Thorne can check any line in seconds.",
          "Pitfall: sending the demand and hoping nobody checks the math.",
          "Pitfall: adding future care to the Specials to make the number bigger.",
          "Pitfall: discovering a lien after the release is signed."
        ],
        sources: ["D2#1", "D2#2", "D2#4", "D2#7", "D2#9", "D2#12", "D1#40", "LSH Claims Specialist: policy limits (per person vs. per accident)", "Newly authored: billed vs. paid and the collateral-source routing; future medical kept out of the Specials total"],
        rubric: {
          ai: [
            ["Specials formula", 20, "Medical + wages = $16,401.40; Property Damage on its own claim; future medical outside the total"],
            ["MMI gate", 10, "MMI 06/12/2026 recorded from the provider's note before any demand step"],
            ["Billed vs paid", 15, "Both columns shown; the choice routed to Atty. Thorne"],
            ["Targets", 15, "$10,000 BI → $20,000 Host UM → $10,000 Relative UM, each re-verified from its written source"]
          ],
          trainer: [
            ["Audit mindset", 20, "Treats the audit as the stress test the defense would run, not a tally"],
            ["UPL boundary", 20, "No valuation offered; billed-vs-paid and the demand figure left to Atty. Thorne"]
          ]
        },
        notes: [
          "Open on the why: “The demand goes out later today, but what it can claim is decided here.” Then put $7,965.00 in liens beside a $10,000 BI limit and let the room do the arithmetic.",
          "Ask the room: “Who decides that John Doe reached MMI?” Anyone who says the Case Manager, or John Doe, gets the rule: it is Lakeside Orthopedics' determination, recorded from its 06/12/2026 note.",
          "Watch the billed-vs-paid rule. Trainees either pick a column themselves or hide the paid column to keep the number high. Both are wrong: show both and route the choice. Collateral-source rules vary by state; confirm the governing rule.",
          "The property-damage carve-out re-seats the classic formula: the Civic's repair runs on Keystone's PD claim, so it never inflates the BI Specials or counts toward the $40,000."
        ]
      },

      {
        kind: "activity", id: "d2m4-a1",
        title: "Calculating Total Specials & the Special Damages Audit",
        topic: "Skill Activity 1 — audit $15,002.40 down to the number that holds",
        visual: "A full-width Specials ledger on a cream card, provider rows in mono under five columns: Date · Provider · Billed · Paid by · Status. The Riverton Spine & Rehab row is expanded into its 34 billed lines as a dense strip of small tiles; one tile, 05/04/2026, is outlined in red with a DUPLICATE tag and an orange badge, –$185.00. Right margin: a vertical totals rail — $15,002.40 struck through in grey, then $14,817.40 medical, + $1,584.00 wages, = $16,401.40 in large Fraunces. Below the ledger, two narrow cards: BILLED vs PAID in two mono columns, and FUTURE MEDICAL · NARRATIVE ONLY, set outside the totals rail. The red tile is the focal point.",
        act: {
          scenario: "File date: early July 2026. Lakeside Orthopedics declared MMI on 06/12/2026; Dr. Reyes's Causation Letter arrived 06/19/2026. Every bill is in: Riverton Urgent Care $685.00; Riverton Spine & Rehab's statement, 34 lines × $185.00 = $6,290.00, with its visit notes; Lakeside Orthopedics three visits at $640.00; Summit Imaging $2,395.00; Crescent Pain & Spine $3,400.00 (Peach State paid $1,860.00); Riverton Drug $312.40. Northgate's HR letter verifies 9 missed shifts at 8 h × $22.00.",
          prompt: "Build John Doe's audited Specials ledger in the CMS. Enter each provider's charges with dates, billed amount and who paid. Reconcile Riverton Spine & Rehab's billed lines against its visit notes and remove any line no visit supports. Total the medical, add the verified wages, and show billed beside paid. Put future medical in the narrative, not the ledger. List every lien with its amount, and re-verify the three policy-limits targets in order. Graded judgment: what you flag for Atty. Thorne instead of deciding it yourself.",
          tool: "CMS → Financial Ledger → Specials · CMS → Liens · CMS → Financial Ledger → Net Sheet → Lien Tracker · CMS → Insurance tab",
          output: "An audited Specials ledger at $16,401.40 with billed and paid side by side, a lien list, the targets in order, and a flag list routed to Atty. Thorne.",
          checkpoints: [
            "Riverton Spine & Rehab reconciled: 33 visits in the notes (16 from 02/24 to 04/02/2026, 17 from 04/21 to 06/05/2026) against 34 lines; the 05/04/2026 duplicate ($185.00) removed: $6,290.00 → $6,105.00. A corrected itemized statement requested from Riverton Spine & Rehab (a billing correction, not a reduction). Until it arrives, the Lien Tracker shows $6,290.00 claimed and $6,105.00 audited; any reduction is Atty. Thorne's to negotiate.",
            "Medical: $685.00 + $6,105.00 + $640.00 + $2,395.00 + $640.00 + $3,400.00 + $640.00 + $312.40 = $14,817.40 (down from $15,002.40)",
            "Wages: 9 shifts × 8 h × $22.00 = $1,584.00, Northgate HR letter attached; total Specials $14,817.40 + $1,584.00 = $16,401.40",
            "Wage proof: each missed shift matched to a visit record or provider work note; the five shifts 02/09–02/13/2026, before first treatment, flagged with Northgate's Attendance Record (called out citing neck pain) as their support",
            "Billed beside paid: MedPay $5,000.00 on its five bills; Peach State $1,860.00 on Crescent's $3,400.00 (write-off $3,400.00 – $1,860.00 = $1,540.00, no balance billing); LOP $6,105.00 owed; $312.40 paid by John Doe; paid-and-owed column $5,000.00 + $1,860.00 + $6,105.00 + $312.40 = $13,277.40 ($14,817.40 – $1,540.00)",
            "Billed-vs-paid choice routed to Atty. Thorne under the governing collateral-source rule, not made in the ledger",
            "Future medical ($3,400–$6,800: 1–2 repeat injections within 24 months) recorded in the narrative, outside the $16,401.40",
            "Liens listed: Peach State $1,860.00 (plan funding type recorded) and Riverton Spine & Rehab $6,105.00 after audit, in the CMS → Liens register, mirrored to the Lien Tracker; MedPay recorded as carrying no reimbursement right against John Doe's recovery (Harbor Point, in writing, 03/02/2026); Harbor Point's position on MedPay subrogation against Robert Smith and Keystone requested in writing and routed to Atty. Thorne, since it would compete for the same $10,000 BI limit",
            "Targets in order: $10,000 BI → $20,000 Host UM → $10,000 Relative UM = $40,000; each target re-checked against its written source: BI per person (03/20/2026 Dec Page), Host UM add-on (03/02/2026 letter), Relative UM coverage (03/09/2026) plus its form and excess clause; MedPay and Keystone PD marked as not in the stack",
            "Liability proof confirmed and listed in the audit: the final Riverton PD report RPD-26-018842 (not the exchange-of-information form), Robert Smith cited for failure to stop, no contributory-negligence note on John Doe; Ruth Calloway's contact re-confirmed and her account checked against her first statement for drift; the 2214 Maple Hollow Rd doorbell-camera video preserved and matched to the Escape being pushed into the parked Civic",
            "Reasonable and necessary: each charge tied to the collision in the provider's own records and to a clinical basis (MRI ordered 03/05/2026; injection after the 03/27/2026 referral); Riverton Drug receipts attached, from 02/07/2026"
          ]
        },
        ops: [
          ["All bills in after MMI", "Enter and reconcile every provider's charges", "CMS → Financial Ledger → Specials", "Medical total $14,817.40; the 05/04/2026 duplicate removed and noted"],
          ["Ledger totals", "Show billed beside paid; route the choice and the wage flag", "CMS → Tasks → Escalate", "Both columns shown; routed to Atty. Thorne with the five pre-treatment shifts named"],
          ["Audit complete", "Register liens and re-verify the targets", "CMS → Liens · CMS → Financial Ledger → Net Sheet → Lien Tracker · CMS → Insurance tab", "$1,860.00 + $6,105.00 = $7,965.00 in liens listed; $40,000 in order"]
        ],
        best: [
          "Count the visits in the notes before you add up a provider's lines.",
          "Keep the duplicate's removal visible, with its date and amount: it reads as rigor, not a write-down.",
          "Double-check every calculation and date against its source document.",
          "Pitfall: totaling the provider's statement instead of auditing it.",
          "Pitfall: dropping the paid column because it makes the number smaller."
        ],
        sources: ["D2#4", "D2#7", "D2#9", "D1#40", "LSH Claims Specialist: attention to detail — cross-reference documents, double-check calculations and dates"],
        rubric: {
          ai: [
            ["Duplicate caught", 15, "05/04/2026 line removed; Riverton Spine & Rehab at $6,105.00"],
            ["Totals", 20, "$14,817.40 medical + $1,584.00 wages = $16,401.40, to the cent"],
            ["Billed vs paid", 15, "MedPay $5,000.00 and Peach State $1,860.00 shown against billed; paid-and-owed $13,277.40"],
            ["Liens and targets", 10, "Both liens listed; $10,000 → $20,000 → $10,000 in order"]
          ],
          trainer: [
            ["Flag judgment", 20, "Routes billed-vs-paid and the pre-treatment wage shifts to Atty. Thorne rather than deciding them"],
            ["Authority boundary", 10, "No figure presented as what the case is worth"],
            ["Ledger defensibility", 10, "An adjuster could test any line and find its source"]
          ]
        },
        notes: [
          "Hand out the bills, not the totals. Trainees who add Riverton Spine & Rehab's statement without counting the visits in its notes will land on $15,002.40; let them, then ask how many visits the notes show.",
          "Ask the room: “Peach State paid $1,860.00 on a $3,400.00 bill. Which number goes in the demand?” The only right answer: both go in front of Atty. Thorne, and he decides.",
          "The wage check is the subtle one. Five of the nine shifts fall inside the 14-Day Gap, before any provider saw John Doe. Record them exactly as the Attendance Record shows them; what they mean is Atty. Thorne's to weigh. Flag them; never drop them.",
          "Grade to the cent. $16,401.40 is the day's gate figure; any other total means a line is wrong."
        ]
      },

      {
        kind: "lesson", id: "d2m4-l2",
        title: "Strategy Briefing Protocols with Lead Counsel",
        topic: "Briefing Atty. Thorne, live or in the AI strategy session",
        visual: "A single brief page fills the centre of the slide, a white card with five horizontal bands in fixed order, each with an orange numbered badge: ① BOTTOM LINE in navy, one line in the largest type; ② FACTS · AUDITED, split into NARRATIVE · PHYSICALITY · MEDICALS with a green ✓ on each; ③ RISKS in danger red, four chips (14-DAY GAP · DISRUPTION · 2021 LOW BACK · “DEGENERATIVE”), each tethered to a small document chip; ④ DECISIONS NEEDED, orange-bordered, each item a question; ⑤ OPTIONS → CONSEQUENCES in two columns. Along the right edge a navy rail, ATTY. ELIJAH THORNE DECIDES, ends in a card: DECISION RECORD · dated · tasked. The page is ordered for the reader who decides.",
        tell: {
          why: "Atty. Thorne makes the strategy calls from your brief. A brief that opens with the chronology buries the decision; one that hides a risk misleads him; one that makes the call for him crosses a line.",
          rules: [
            "Bottom line first, in one sentence: where the file stands and what you need. Here: MMI 06/12/2026; $16,401.40 in audited Specials against a $10,000 BI limit; decisions needed before any demand is drafted.",
            "Facts next, audited and sourced. The trinity must agree: the narrative (John Doe's account), the physicality (the force of the impact), the medicals (the C5-C6 herniation). If one is out of line, say so first: that is the defense's easy out.",
            "Liability proof in final form: the final Riverton PD report RPD-26-018842 (Smith cited for failure to stop), checked for a contributory-negligence note; Ruth Calloway's contact re-confirmed and her account checked for drift; the doorbell video squared with the scene.",
            "Property Damage proves force, in final figures. Lead with John Doe's door, the Escape's, struck at about 28 mph (request photos if not on file). Then the Civic: $6,940.00 → $9,255.00 with a $2,315.00 A-pillar supplement, 52.6% of its $17,600.00 ACV: repairable under this file's 75% threshold (it varies by state).",
            "Risks, through the defense's eyes: the 14-Day Gap, the 19-day disruption, the 2021 low-back visits, a “degenerative” MRI reading, the declined EMS transport, social media, a “minor impact” (MIST) label, venue. Pair each with the document that answers it, or say none does.",
            "Decisions needed, as questions only he can answer: the demand's figure, terms and time limit; billed or paid; how the gap is presented; the UM consent plan, including the consent windows and the substitution right.",
            "Options with their operational consequences: who is served and how, what gets docketed, what must happen before any release is signed. Recommend on operations, never on the legal answer.",
            "Package it: a one-page memo, an exhibit index whose page numbers match, and the inputs to the ask (the limits in order, the Total Specials). Mark “unverified” whatever is.",
            "Record the decisions the same day, in his words and dated; a task for each with an owner and a date; the Case Plan marked superseded and re-routed."
          ],
          upl: [
            "You may recommend operationally: service method, sequencing, what to request and when. The demand figure, its terms and time limit, billed or paid, how the gap is argued and when UM opens are Atty. Thorne's. “Specials exceed the BI limit” is a finding; “we should demand limits” is his call."
          ]
        },
        show: {
          caption: "The briefing protocol, in the order counsel reads it",
          type: "process",
          steps: [
            ["Bottom line", "MMI; $16,401.40 against a $10,000 BI limit; decisions needed."],
            ["Facts, audited", "The trinity aligned; liability proof final; every fact sourced."],
            ["Risks, with answers", "Gap → the Gap Explanation Record and Dr. Reyes's Causation Letter; disruption → the A-C-T record; 2021 low back → a different region, resolved; “degenerative” → “no significant degenerative change at the adjacent levels.”"],
            ["Decisions needed", "Each one a question for Atty. Thorne."],
            ["Options → consequences", "Service, docketing, consents, the release."],
            ["Record & re-route", "Dated, attributed, tasked; the plan re-routed."]
          ]
        },
        ops: [
          ["Audit complete", "Draft the one-page summary memo and the exhibit index", "Action Plan Editor → Pre-demand brief", "Five sections in protocol order; every exhibit label matches its page"],
          ["Brief ready", "Book the strategy session and send the memo ahead", "CMS → Calendar · Email Workspace", "Session held before any demand is drafted; memo and index attached"],
          ["Session held", "Record each decision in counsel's words and open its tasks", "CMS → Case Notes · CMS → Tasks", "Every decision dated, attributed to Atty. Thorne, with an owner and a due date"],
          ["Decisions change the plan", "Mark the Case Plan superseded and re-route it", "Action Plan Editor → Version", "Approved version kept; new version routed the same day"]
        ],
        best: [
          "Bring the bad facts yourself: counsel should never meet a risk first in the adjuster's letter.",
          "Discrepancies destroy credibility; find them before the defense does.",
          "Check John Doe's public social media before the demand. Any instruction to him about it comes from Atty. Thorne; never suggest deleting a post.",
          "A “minor impact” (MIST) label sticks when Property Damage runs under about $1,000–$2,000 and calls for a stronger medical narrative; here the structural supplement is the answer.",
          "Venue is counsel's read: where suit would be filed shapes how a jury values pain and suffering. Supply the facts; leave the assessment to Atty. Thorne.",
          "Pitfall: a summary memo that runs to three pages.",
          "Pitfall: an exhibit index whose page numbers don't match the exhibits.",
          "Pitfall: briefing the initial PD estimate instead of the final repair figure."
        ],
        sources: ["D2#3", "D2#5", "D2#6", "D2#8", "D2#9", "LSH Claims Specialist: communication skills — clear, professional, no jargon; well-organized files for attorneys", "Newly authored: the strategy briefing protocol (bottom line, facts, risks, decisions, options, record)"],
        rubric: {
          ai: [
            ["Protocol order", 20, "Bottom line, facts, risks, decisions, options, record, in that order"],
            ["Risk pairing", 15, "Gap, disruption, 2021 prior and “degenerative” each paired with its answering document"],
            ["Package readiness", 15, "One-page memo; exhibit index that matches; ask inputs (limits in order, $16,401.40)"],
            ["Decision record", 10, "Each decision dated, attributed to Atty. Thorne and tasked"]
          ],
          trainer: [
            ["Candor", 15, "Bad facts surfaced plainly, not softened or left for counsel to find"],
            ["Concision", 10, "Counsel could decide from the first page"],
            ["UPL boundary", 15, "Recommends on operations; leaves every legal answer to Atty. Thorne"]
          ]
        },
        notes: [
          "Open by reading two first lines aloud: “On 02/06/2026 John Doe was a front-seat passenger…” and “John Doe is at MMI with $16,401.40 in audited Specials against a $10,000 BI limit, and I need your decisions.” Ask which one Atty. Thorne can act on.",
          "Ask the room: “Which risk would you be tempted to leave out of the brief?” It is usually the 2021 low-back visits. Then ask what happens when Keystone finds them first.",
          "Police the recommend line hard. “Certified mail with return receipt and email, so we can prove receipt” is operational. “We should demand limits” is not the Case Manager's to say, even when the numbers make it look obvious.",
          "Tie it back to Day 2: the decisions change the picture, so the Case Plan is superseded and re-routed, not quietly edited."
        ]
      },

      {
        kind: "activity", id: "d2m4-a2",
        title: "Pre-Demand Strategy Session with AI Atty. Elijah Thorne",
        topic: "Skill Activity 2 — present the audit; record his decisions",
        visual: "A two-pane Call Simulator screen. Left pane: the session transcript as alternating bubbles, navy for AI ATTY. ELIJAH THORNE and cream for the trainee; two of his bubbles are outlined in orange as challenges: “Keystone will call this low-speed” and “Why should they pay for a gap?” Right pane: a DECISION RECORD card filling as the session runs, rows with orange numbered badges — ① BI DEMAND · TIME-LIMITED · SERVE 07/20/2026 ② GAP · UP FRONT ③ UM · CONSENT PLAN ④ BILLED OR PAID — each stamped DECIDED BY ATTY. THORNE with a task chip. A red strip along the bottom: “The CM recommends operations. Counsel decides.”",
        act: {
          scenario: "File date: early July 2026, before any demand is drafted. Your audit is done: MMI 06/12/2026; Specials $16,401.40 ($14,817.40 medical after the duplicate came out + $1,584.00 wages); liens $1,860.00 (Peach State) and $6,105.00 (the LOP); targets $10,000 BI → $20,000 Host UM → $10,000 Relative UM. The Gap Explanation Record (06/22/2026) and Dr. Reyes's 06/19/2026 Causation Letter are in the file. Atty. Thorne has called the pre-demand strategy session.",
          prompt: "Run the pre-demand strategy session with AI Atty. Elijah Thorne. Brief him in protocol order: bottom line, audited facts, risks with their answering documents, the decisions he must make, and each option's operational consequences. Answer his challenges with objective facts, not adjectives. Recommend only on operations; ask for his decision on everything legal. Read back each decision before you close. Then record the decisions in the CMS, open a task for each, and re-route the Case Plan.",
          tool: "Call Simulator → AI Atty. Elijah Thorne (strategy session) · CMS → Case Notes · CMS → Tasks",
          output: "A recorded strategy session and a dated decision record, each decision attributed to Atty. Thorne with its tasks and owners.",
          checkpoints: [
            "Opens with the bottom line: MMI 06/12/2026, $16,401.40 in Specials against the $10,000 BI limit, decisions needed",
            "Figures exact: $14,817.40 + $1,584.00 = $16,401.40; billed and paid both shown; future medical ($3,400–$6,800) presented as narrative",
            "Low-speed challenge met with the trinity in objective facts: Smith ran the stop sign (cited) and struck the Escape's front passenger door, John Doe's door, at about 28 mph; the Escape was pushed into the parked Civic, which needed a $2,315.00 A-pillar structural supplement; the 03/13/2026 MRI shows a C5-C6 herniation",
            "Gap challenge met with documents, not apology: the EMS neck complaint on 02/06/2026; the reasons from the recorded call (no car until the 02/18/2026 rental; numbness from 02/18/2026); the urgent-care onset note; the Attendance Record; Dr. Reyes's 06/19/2026 Causation Letter; the disruption with its A-C-T record",
            "Risks raised unprompted: the 2021 low-back visits (a different region, resolved) and “degenerative” (the radiologist: “no significant degenerative change at the adjacent levels”)",
            "Decision recorded: a time-limited BI demand to Keystone (Dana Whitfield) for the $10,000 limits, to be served 07/20/2026, on terms Atty. Thorne sets, with his reason for that date recorded in his words",
            "Decision recorded: the gap addressed up front in the package, its documentation leading",
            "Decision recorded: the UM consent plan. No UM demand until the BI tender is documented. On tender, written consent-to-settle requests to Harbor Point and Cardinal State before the BI settlement is accepted or any release is signed. Each may substitute its own payment of the $10,000 to preserve its subrogation against Robert Smith, within the window its policy or the governing statute sets (Atty. Thorne confirms; the CM dockets it). The demand's terms leave room for those windows. The release is limited to Robert Smith and Keystone.",
            "Billed-vs-paid recorded as Atty. Thorne's decision, in his words",
            "Recommendations kept operational (e.g., certified mail with return receipt and email; the acceptance window docketed from proof of receipt); no demand figure proposed",
            "Each decision read back, dated, attributed and tasked with an owner and a date; Case Plan marked superseded and re-routed"
          ]
        },
        ops: [
          ["Strategy session called", "Send the one-page memo and the exhibit index ahead", "Email Workspace", "Memo and index sent before the session"],
          ["Session under way", "Brief in protocol order; answer each challenge with a document", "Call Simulator → AI Atty. Elijah Thorne (strategy session)", "Bottom line first; every challenge met with a sourced fact"],
          ["Decisions made", "Record, read back and task each decision", "CMS → Case Notes · CMS → Tasks", "Each decision dated and attributed; demand-service task due 07/20/2026"],
          ["Plan changed", "Mark the plan superseded and re-route it", "Action Plan Editor → Version", "New version routed the same day"]
        ],
        best: [
          "Read back every decision before the session ends; a decision you can't quote isn't recorded.",
          "Use objective facts, never adjectives: a citation, a speed, a supplement, an MRI finding.",
          "Pitfall: apologizing for the gap instead of explaining it with documentation.",
          "Pitfall: leaving the session with “sounds good” instead of a decision.",
          "Pitfall: proposing a demand figure because the numbers seem to make it obvious."
        ],
        sources: ["D2#3", "D2#6", "D2#8", "D2#9", "D2#10", "D2#12"],
        rubric: {
          ai: [
            ["Protocol order", 15, "Bottom line first; facts, risks, decisions, options in order"],
            ["Figure accuracy", 15, "$16,401.40, the limits in order and every date stated exactly"],
            ["Decisions recorded", 20, "Time-limited $10,000 BI demand to be served 07/20/2026; gap up front; UM consent plan; billed or paid — each dated and attributed"],
            ["Tasks and re-route", 10, "A task per decision with owner and date; plan re-routed"]
          ],
          trainer: [
            ["Challenge handling", 15, "Meets the low-speed and gap challenges calmly, with objective, sourced facts"],
            ["UPL boundary", 15, "Recommends on operations only; asks for every legal decision"],
            ["Professional delivery", 10, "Concise and candid; volunteers the bad facts; no jargon"]
          ]
        },
        notes: [
          "Set the simulator so AI Atty. Thorne interrupts within the first minute: “Keystone will call this low-speed.” A trainee who answers with adjectives (“it was a serious crash”) has missed the point; objective facts only.",
          "Ask the observers: “What did Atty. Thorne decide, in his words?” If they can't quote it, the trainee didn't read it back.",
          "Watch for the trap in the script: AI Atty. Thorne asks, “What do you think we should demand?” The right answer gives him the inputs (the limits in order, $16,401.40, the future medical) and hands the figure back to him.",
          "Grade the decision record, not the conversation: each decision dated, attributed and tasked, or the session didn't happen."
        ]
      },

      {
        kind: "check", id: "d2m4-kc",
        title: "Pre-Demand Audit & Day 3 Gate",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split, with one Day-2-specific addition above the question panel: a full-width DAY 2 GATE bar of six connected chips — LORs ACKNOWLEDGED · COVERAGE VERIFIED · MMI DOCUMENTED · GAP RECORD COMPLETE · SPECIALS $16,401.40 · STRATEGY APPROVED — each with a tick state, and a closed navy barrier at the right end labelled DAY 3 with a small note: “opens when all six are green.” Below, the navy CM SELF-SUMMARY card with three prompts beside the 1–5 SKILL SCALE ladder; far right, the 60/40 bar with UPL as a separate red gate chip.",
        check: {
          questions: [
            "Total John Doe's Specials from the bills: show the Riverton Spine & Rehab correction, the medical total, the wage arithmetic and the final figure.",
            "Who determines MMI, when was John Doe's, and why must the demand wait for it? Where does the $3,400–$6,800 in future medical go?",
            "Name the four objectives of the pre-demand audit, and give one finding each produced on this file."
          ],
          summary: [
            "Summarize, in your own words, what you learned auditing John Doe's file before the demand: the principles, not the clicks.",
            "Articulate your strategy: Atty. Thorne has made his decisions. What is your next action on the file, and why is it the right next action rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Confirming MMI and the future-care plan before a demand",
            "Auditing and totaling special damages to the cent",
            "Separating billed from paid and routing the choice",
            "Re-verifying the policy-limits targets in order",
            "Running a defense-eye audit with documented answers",
            "Briefing Lead Counsel and recording his decisions"
          ]
        },
        best: [
          "Answer with the file's own numbers, dates and documents, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the difference."
        ],
        sources: ["D2#2", "D2#4", "D2#7", "D2#8", "D2#9", "D2#12"],
        rubric: {
          ai: [
            ["Specials accuracy", 20, "$6,290.00 → $6,105.00; $14,817.40 + $1,584.00 = $16,401.40"],
            ["Audit doctrine", 15, "Four objectives; MMI gate; future medical outside the Specials; billed vs paid shown"],
            ["Defense-eye pairing", 15, "Four risks, each with its answering document"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Billed-vs-paid, the demand figure and its time limit left to Atty. Thorne"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Open with the gate bar: this module turns the last two chips green, Specials audited at $16,401.40 and strategy approved by Atty. Thorne. The demand does not go out until all six are.",
          "Ask the room: “Which number on this file would you defend line by line to Dana Whitfield?” It should be $16,401.40, and they should be able to say where every cent comes from.",
          "Question 6 is the pressure scenario. The right answer stops the package, corrects the exhibit and every total that cites it, tells Atty. Thorne before anything is served, and lets him decide whether the 07/20/2026 service holds. Serving a known error to make the date is the failure.",
          "Question 5 separates the trainee who knows the rule from the one who would pick a column. An answer that chooses billed or paid for the demand loses the UPL marks."
        ]
      }

      ]
    }

    ]
  },

  /* ==========================================================
     DAY 3 — DEMANDS & SETTLEMENTS (TRACK A: THE FILE SETTLES)
     ========================================================== */
  {
    n: 3, id: 13,
    title: "Case Flow Day 3 · Pre-Demand Audit, the Demand & Settlement Negotiation",
    phase: "Pre-demand audit, the demand & settlement negotiation",
    objective: "Probe the 14-Day Gap with John Doe on a recorded call, inside the UPL line, and complete the Gap Explanation Record from his own documented facts; audit the file to MMI and $16,401.40 in Specials; brief Atty. Thorne in the pre-demand strategy session; serve a time-limited BI demand that holds up; structure the Host UM and Relative UM demands behind it; then negotiate Track A to a $40,000 gross recovery with both UM consents.",
    gate: "Gap Explanation Record complete, from John Doe's own documented facts · Specials audited at $16,401.40 · demand strategy approved by Atty. Thorne · BI Time-Limited Demand served with proof of delivery · Host UM and Relative UM demands drafted · Track A negotiated to $40,000 gross, both UM consents in hand",
    discussion: "It is 07/20/2026. The Specials are audited and Atty. Thorne has approved a policy-limits demand to Keystone. What must be true before the Time-Limited Demand goes out, and what would let Keystone say it never had a fair chance to settle?",
    fileState: [
      "Treatment complete: MMI 06/12/2026; the 14-day initial gap and the 19-day disruption are on the file, and the Gap Explanation Record is still to be completed from John Doe's own documented facts.",
      "Specials: $14,817.40 medical after the audit + $1,584.00 wages = $16,401.40.",
      "The Recovery Stack: $10,000 BI (Keystone Mutual), $20,000 Host UM (Harbor Point), $10,000 Relative UM (Cardinal State Mutual), $40,000.",
      "Peach State's reimbursement claim and Riverton Spine & Rehab's LOP balance are open on the file."
    ],
    modules: [

    /* ---------- DAY 3 · MODULE 1 ---------- */
    {
      n: 1, id: "d3m1",
      title: "BI & UM Demand Execution",
      about: "From a $10,000 time-limited BI demand that Keystone has to answer, to the Host UM and Relative UM demands behind it: clear terms, proven delivery, BI exhaustion, written consents and a Limited Release.",
      quiz: [
        {q: "Keystone received the certified-mail BI demand on 07/22/2026. Its 30-day acceptance window closes on:",
         opts: ["08/19/2026", "08/21/2026", "08/22/2026", "08/20/2026"],
         a: 1, r: "The window runs 30 days from receipt: 07/22/2026 + 30 = 08/21/2026, a Friday. 08/19/2026 counts from the 07/20 mailing (the wrong trigger), 08/22/2026 adds a calendar month, and 08/20/2026 counts the day of receipt as day one."},
        {q: "Which of these would let Keystone refuse the Time-Limited Demand safely?",
         opts: ["A window of 30 days from receipt", "A release limited to Robert Smith and Keystone", "A demand for $16,401.40, the full Specials", "Service by certified mail and email"],
         a: 2, r: "Keystone's BI limit is $10,000. A demand above the limit is one Keystone cannot accept within its policy, so refusing it generally sets nothing up (confirm the governing rule). The other three are what make the demand hold."},
        {q: "Why can John Doe's file still reach the full $20,000 Host UM limit after Keystone pays $10,000?",
         opts: ["Harbor Point confirmed in writing (03/02/2026) that its UM is add-on, so the BI payment does not reduce it", "UM limits are never reduced by a BI payment", "MedPay's $5,000 covers the BI offset", "Cardinal State pays whatever Harbor Point deducts"],
         a: 0, r: "Add-on UM is not reduced by the BI payment. Under an offset form the $10,000 BI would come off the $20,000 limit, leaving $10,000. Offset rules vary by state and policy, which is why the carrier's written confirmation is the source."},
        {q: "When must Harbor Point's and Cardinal State's consents to settle be in writing?",
         opts: ["Only if a UM carrier asks for one", "Before Keystone's check clears the trust account", "Within 30 days after the BI release is signed", "Before John Doe signs Keystone's release"],
         a: 3, r: "Releasing Robert Smith without the UM carriers' written consent can impair their subrogation rights and cost John Doe the UM coverage. On this file: consents 08/24 and 08/26/2026, Limited Release signed 08/28/2026."},
        {q: "The Relative UM demand to Cardinal State (Teresa Okafor, CS-26-20355) goes out 08/31/2026 framed as excess. What must its package show?",
         opts: ["Damages above the $30,000 already reached through the $10,000 BI and the $20,000 Host UM", "Damages above the $10,000 BI only, the same showing as Harbor Point's package", "Only that John Doe is a resident relative under Margaret Doe's policy (03/09/2026)", "A cross-reference to Harbor Point's package, since the two claims share one file"],
         a: 0, r: "Relative UM is excess: Cardinal State answers only above the $30,000 from BI and Host UM, up to $10,000. Each carrier gets its own complete package with the exhaustion proof on page one; the damages figure itself is Atty. Thorne's valuation."},
        {q: "How is the BI Time-Limited Demand served?",
         opts: ["Email only", "Certified mail with return receipt AND email, both logged", "Regular mail", "By phone to Dana Whitfield"],
         a: 1, r: "The letter names what starts the clock. Serve it both ways, log both and docket from receipt."},
        {q: "Under the BI demand's terms, who is released?",
         opts: ["Everyone, both UM carriers included", "Robert Smith and Keystone only, for the BI claim only", "Keystone only", "Robert Smith, Keystone and Harbor Point"],
         a: 1, r: "A Limited Release: Smith and Keystone, the BI claim only. The Civic's PD claim stays open."},
        {q: "What does the demand lead causation with?",
         opts: ["The 03/13/2026 MRI: a C5-C6 herniation with no significant degenerative change at the adjacent levels", "The police citation", "John Doe's own statement", "The Property Damage photos"],
         a: 0, r: "That MRI line answers “degenerative”. The gap is answered first, with records made at the time."},
        {q: "When may the UM demands go out?",
         opts: ["With the BI demand", "Once Keystone's $10,000 tender is documented and the Limited Release is signed", "Any time after the LORs", "Before the BI demand, to pressure Keystone"],
         a: 1, r: "BI exhaustion first: notice of both UM claims went out in 03/2026, but the demands wait. They went out 08/31/2026."},
        {q: "Keystone's 08/14 draft release frees “all other persons, firms, corporations and insurers.” What do you do?",
         opts: ["Send it to John Doe to sign", "Flag it to Atty. Thorne: it would release both UM carriers", "Sign it for the firm", "Ignore the wording"],
         a: 1, r: "Limit the release to Robert Smith and Keystone, and to the BI claim. The Limited Release was signed 08/28/2026."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d3m1-l1",
        title: "Time-Limit Demand Mechanics & the Statutory Bad-Faith Setup",
        topic: "What makes a $10,000 demand one Keystone has to answer",
        visual: "Left half: a Time-Limited Demand Letter on navy-banded letterhead, five orange numbered badges pinned to its parts: ① the $10,000 amount (within limits), ② the release and affidavit terms (clear), ③ the conditions and the 30 days to meet them (reasonable), ④ the enclosure list (documented), ⑤ the deadline and delivery lines (timed). Right half: a horizontal clock bar running 07/20/2026 SERVED → 07/22/2026 RECEIVED (a navy mono pill with a return-receipt icon) → 08/21/2026 WINDOW CLOSES in orange. Above the bar, a red danger callout: “An ambiguous term is an escape hatch.” Bottom strip, a full-width navy band in white type: CLEAR · REASONABLE · WITHIN LIMITS · DOCUMENTED · TIMED. The argument: each badge is a door Keystone could refuse through, and the demand shuts all five.",
        tell: {
          why: "Robert Smith carries $10,000; John Doe's Specials alone are $16,401.40. A Time-Limited Demand for the limits makes Keystone decide on the record. Vague, over limits, thin or unproven: a refusal costs it nothing. Clear, reasonable, within limits, documented and timed: an unreasonable refusal can matter.",
          rules: [
            "Confirm the foundation first: SOL docketed (02/06/2028); liability (Smith's stop-sign citation, RPD-26-018842; Ruth Calloway; the doorbell video); coverage (BI $10,000, Keystone's Dec Page, 03/20/2026).",
            "Within limits: $10,000, Keystone's full BI limit. A demand above it is one Keystone can't accept within its policy, so refusing it generally sets nothing up.",
            "Clear: every term acceptable as written: $10,000; who is released (Robert Smith and Keystone only) and for what (the BI claim only; the Civic's PD claim stays open); a Limited Release; Smith's affidavit of no other insurance; how to accept and by when; when payment is due after acceptance (Atty. Thorne sets it).",
            "Reasonable: ask only what Keystone can deliver in time. Its limit, a Limited Release and its insured's affidavit qualify; 30 days leaves time to get the affidavit. A condition it can't meet, or a short fuse, is its defense.",
            "Documented: the Big Four complete, enough to evaluate the claim inside the window. A carrier can't be faulted for refusing what it was never shown.",
            "Timed and proven: the letter names what starts the clock (delivery of the certified mailing). Serve by certified mail, return receipt, AND email; log both; docket from receipt: 07/22/2026 + 30 = 08/21/2026 (Fri).",
            "Answer the gap first: name the 14 days (02/06 → 02/20/2026), say why (no car until 02/18, cost worry, hand numbness from 02/18), and prove continuity: the EMS report, the Northgate call-outs (02/09–02/13), the urgent-care onset note, Dr. Reyes's Causation Letter (06/19/2026).",
            "Lead causation with the 03/13/2026 MRI: a C5-C6 herniation with “no significant degenerative change at the adjacent levels.” That line answers “degenerative.”",
            "Present, don't compile. Demand at MMI (06/12/2026), future care narrated; the 30-Day Rule dockets MMI + 30 (07/12/2026). A later date (07/20/2026) is Atty. Thorne's call, reason recorded.",
            "Bad faith is a legal conclusion; the rules vary. Some states set a Time-Limited Demand's required terms by statute; missing one hands Keystone a safe refusal. Atty. Thorne confirms whether one governs this file. Exposure above $10,000 is Atty. Thorne's analysis."
          ],
          upl: [
            "You build, audit, serve and prove delivery of the demand Atty. Thorne approved and signed. You never set or change its terms, grant an extension, call a refusal bad faith to the adjuster, or tell John Doe what the claim is worth or whether to accept."
          ]
        },
        show: {
          caption: "The five elements, on John Doe's demand",
          type: "table",
          head: ["Element", "On this file", "If it's missing"],
          rows: [
            ["Within limits", "$10,000, Keystone's BI limit", "Nothing Keystone can accept"],
            ["Clear", "Release of Smith and Keystone only; Smith's affidavit", "A vague term is a reason to refuse"],
            ["Reasonable", "Conditions it can meet, 30 days to meet them", "An impossible ask is a safe refusal"],
            ["Documented", "Big Four, the gap answered up front", "Never shown the claim"],
            ["Timed", "07/22 → 08/21/2026, return receipt on file", "No proof of receipt, no clock"]
          ]
        },
        ops: [
          ["MMI declared (06/12/2026)", "Docket MMI + 30 and open the Demand Package task", "Docket System · CMS → Tasks", "07/12/2026 falls on a Sunday. It is an internal target, so the firm works it early, on Fri 07/10; legal deadlines counted forward roll to the next business day (Day 4); a later service date recorded as Atty. Thorne's, with the reason"],
          ["Atty. Thorne approves the terms", "Record them exactly before drafting", "CMS → Case Notes", "$10,000; Limited Release of Smith and Keystone only, BI claim only (the PD claim excluded); Smith's affidavit; 30 days from receipt to accept; payment due as he sets it"],
          ["Return receipt comes back showing delivery 07/22/2026", "Compute and docket the acceptance deadline with reminders", "Docket System", "08/21/2026 docketed from the receipt date, not the mailing date"],
          ["Keystone writes or calls before the deadline", "Log it word for word and route it to Atty. Thorne", "CMS → Communications Log · CMS → Tasks → Escalate", "Routed the same day; the CM changes nothing on terms or time, and restates the approved terms only where Atty. Thorne's written authority says so"]
        ],
        best: [
          "Know which value-drivers the demand leads with: the MRI herniation, the injection, the residual right-arm paresthesia at MMI, clear liability.",
          "Docket the deadline from the receipt date on the return receipt, never from the mailing date.",
          "The window is for acceptance, not payment: Keystone accepted by 08/21/2026 and its check arrived 09/04/2026. When payment is due after acceptance is a separate term Atty. Thorne sets.",
          "Adjusters use gaps to argue the injury was minor, healed early, was over-treated or came from something else. The only gap explanation that holds up against them is John Doe's own factual explanation, supported by verifiable written documentation.",
          "Pitfall: a demand with no stated deadline, or one that doesn't say what starts the clock.",
          "Pitfall: leaving the gap out of the timeline and hoping Keystone misses it.",
          "Pitfall: demanding before MMI or a future-care plan exists."
        ],
        sources: ["D2#11", "D2#12", "D2#13", "D2#17", "Newly authored: the elements of a Time-Limited Demand that can support a later failure-to-settle claim (within limits, clear and reasonable terms, sufficient documentation, a stated window with proof of delivery)"],
        rubric: {
          ai: [
            ["Terms accuracy", 20, "$10,000 limits; Limited Release of Robert Smith and Keystone only; Smith's affidavit of no other insurance"],
            ["Deadline computation", 20, "07/22/2026 + 30 days = 08/21/2026, counted from receipt"],
            ["Setup elements", 20, "Within limits, clear, reasonable, documented and timed (with proof of delivery): all five named with this file's example"]
          ],
          trainer: [
            ["Strategic grasp", 25, "Explains why a defective demand lets Keystone refuse safely, and why the gap goes in up front"],
            ["UPL boundary", 15, "Terms, extensions and any bad-faith analysis left to Atty. Thorne; no valuation offered to the client"]
          ]
        },
        notes: [
          "Open with the arithmetic on the board: $16,401.40 in Specials against a $10,000 policy. Ask: “What makes Keystone pay all of it, inside 30 days?” Then reveal the five elements one at a time.",
          "Put this to the room: “The email reached Dana Whitfield on 07/20 and the certified mail on 07/22. When does the window close, and how would Keystone know?” The answer is 08/21/2026, because the letter says the clock runs from delivery of the certified mailing.",
          "Watch for trainees who call it a “bad-faith letter.” It is a Time-Limited Demand. Whether a refusal is bad faith is a legal conclusion under the governing law, and it is Atty. Thorne's.",
          "The gap goes on page one, not in an appendix. Keystone will lean on it anyway (it does, on 08/05); a demand that explained it first has already answered."
        ]
      },

      {
        kind: "activity", id: "d3m1-a1",
        title: "Serving the $10,000 BI Time-Limit Demand Package",
        topic: "Skill Activity 1 — audit it, serve it, prove it",
        visual: "A three-column assembly board. Left: the Demand Package as five tabbed cream folders in reading order — TERMS · THE GAP, ANSWERED · MEDICAL SPECIALS · LIABILITY · SPECIAL DAMAGES — each tab carrying an orange numbered badge. Centre: a navy service card with two chips joined by a bold AND, CERTIFIED MAIL (RETURN RECEIPT) and EMAIL, and beneath it a return-receipt icon stamped 07/22/2026 in a mono pill. Right: a docket card with 08/21/2026 set large in orange and two reminder pills above it. Along the bottom, a red danger strip: “Counted from the mailing date = the wrong deadline.” The eye travels left to right: build, serve, prove.",
        act: {
          scenario: "File date 07/20/2026 (Mon). MMI 06/12/2026; Dr. Reyes's Causation Letter (06/19/2026) and the Gap Explanation Record are on file; the pre-demand audit put the Specials at $16,401.40. Atty. Thorne has approved the terms for Dana Whitfield, Keystone Mutual (KM-26-440871): the $10,000 limits, a Limited Release of Robert Smith and Keystone only, Smith's affidavit of no other insurance, 30 days from receipt. The demand specialist's draft package is on the file for your final audit before Atty. Thorne signs.",
          prompt: "Audit the draft against the Big Four and the Final Scrub, log each deficiency as an assigned CMS task, and assemble the package with the gap answered on page one of the timeline. Once Atty. Thorne has signed, serve it on Keystone by certified mail with return receipt AND by email, and log both. When the return receipt comes back dated 07/22/2026, docket the acceptance deadline from it, with reminders. Graded judgment: what starts the clock, and what you do if Keystone asks for more time.",
          tool: "Action Plan Editor → Demand Package · CMS → Documents → Outgoing · Email Workspace · Docket System",
          output: "An audited, served Time-Limited Demand with proof of delivery on file and 08/21/2026 docketed.",
          checkpoints: [
            "Amount $10,000, Keystone's BI limit per its Dec Page (03/20/2026); nothing demanded above limits",
            "Terms match Atty. Thorne's approval word for word: Limited Release of Robert Smith and Keystone only; Smith's affidavit of no other insurance; 30 days from receipt of the certified mailing",
            "Big Four complete: medical Specials $14,817.40; the narrative (mechanism, pain, work and life impact, consistent with the records); liability proof (RPD-26-018842 citation, Ruth Calloway, doorbell video); special damages $1,584.00 wages (Northgate HR letter), the $312.40 Riverton Drug receipts counted once, inside the medical Specials. Total $16,401.40 (billed figures; whether billed or paid amounts are the measure under the governing collateral-source or paid-versus-incurred rule is Atty. Thorne's call; confirm the governing rule)",
            "Final Scrub: the 05/04/2026 duplicate removed (Riverton Spine & Rehab $6,290.00 → $6,105.00), every final balance re-verified with the provider, the 2021 low-back visits disclosed as resolved and a different region",
            "Gap answered on page one: 02/06 → 02/20/2026 with its reasons, the EMS report, the 02/20 urgent-care onset note and the 06/19/2026 Causation Letter; the 19-day disruption (04/02–04/21/2026) explained too",
            "Every bill paired with its medical-necessity why; future ESIs ($3,400–$6,800) in the narrative, not the Specials; the Civic's PD claim (Leah Moran) kept out",
            "Each deficiency logged as a dated, assigned CMS task, not fixed silently",
            "Signed by Atty. Thorne; served 07/20/2026 by certified mail (return receipt) AND email; both logged",
            "Return receipt filed; deadline docketed 08/21/2026 (07/22 + 30 days) with reminders",
            "Any extension request or response from Keystone routed to Atty. Thorne the same day, never answered by the CM"
          ]
        },
        ops: [
          ["Draft package on file", "Audit against the Big Four and the Final Scrub; assign each fix", "CMS → Tasks", "Every deficiency is a dated, assigned task"],
          ["Atty. Thorne signs", "Serve by certified mail with return receipt and by email", "CMS → Documents → Outgoing · Email Workspace", "Both channels logged 07/20/2026"],
          ["Return receipt dated 07/22/2026", "Docket the acceptance deadline and reminders", "Docket System", "08/21/2026 on the docket, counted from receipt"]
        ],
        best: [
          "Order the package the way the adjuster should read it: the terms, the gap answered, then the proof.",
          "Lead with the strongest image of impact on the file (a still from the doorbell-camera video), as Atty. Thorne chooses.",
          "Re-verify every provider balance in the week of service; a stale balance makes a wrong demand.",
          "Disclose a prior condition, never hide it: in the same region, show aggravation; John Doe's 2021 visits were low back, resolved, with no neck history.",
          "Pitfall: fixing the draft yourself without assigning and tracking the fix.",
          "Pitfall: counting the window from the mailing date instead of the receipt date.",
          "Pitfall: answering Dana Whitfield's request for more time yourself."
        ],
        sources: ["D2#13", "D2#14", "D2#15", "D2#17", "D2#18"],
        rubric: {
          ai: [
            ["Package completeness", 20, "Big Four present; $14,817.40 + $1,584.00 = $16,401.40; the 05/04/2026 duplicate removed"],
            ["Terms fidelity", 15, "Amount, release scope, affidavit and window exactly as approved"],
            ["Service and proof", 15, "Certified mail with return receipt and email, both logged; return receipt filed"],
            ["Deadline", 10, "08/21/2026 docketed from the 07/22/2026 receipt"]
          ],
          trainer: [
            ["Audit judgment", 20, "Found the faults that matter (the gap's placement, the duplicate, stale balances) and assigned each"],
            ["Gap presentation", 10, "Gap acknowledged plainly with its corroboration; not hidden, not over-argued"],
            ["UPL / authority boundary", 10, "Terms, extensions and replies left to Atty. Thorne; nothing signed for him"]
          ]
        },
        notes: [
          "Hand out the draft with three planted faults: the 05/04/2026 duplicate still in the draft's billing exhibit (the CMS ledger was corrected in the pre-demand audit), the gap in an appendix, and a deadline of “30 days from the date of this letter.” Nobody mails anything until the audit is logged.",
          "Ask the room: “Suppose Dana Whitfield emails on day 25 asking for two more weeks. Who answers?” Atty. Thorne. The CM logs it word for word and routes it the same hour.",
          "Grade the deadline from the return receipt. A trainee who docketed from the mailing date has the right idea and the wrong day.",
          "Watch the narrative's prior: three 2021 chiropractic visits for the low back, resolved, and no neck history. Disclosed and distinguished, never hidden."
        ]
      },

      {
        kind: "lesson", id: "d3m1-l2",
        title: "Secondary UM Demand Structuring & Policy Stacking Rules",
        topic: "Locking the escape hatches before Host UM and Relative UM open",
        visual: "A six-station horizontal timeline across the slide, stations numbered in orange circles on a navy rail: ① TENDER 08/12 ② CONSENT REQUESTS 08/13 ③ CONSENTS 08/24 · 08/26 ④ LIMITED RELEASE 08/28 ⑤ UM DEMANDS 08/31 ⑥ CHECK 09/04, each date in a mono pill. Between stations ③ and ④ a heavy orange gate bar labelled NO RELEASE BEFORE BOTH CONSENTS. Above the rail, a small three-rung ladder on a cream card shows BI $10,000 → HOST UM $20,000 (ADD-ON) → RELATIVE UM $10,000 (EXCESS). Bottom-left, a red danger card quotes Keystone's 08/14 draft: “all other persons, firms, corporations and insurers,” struck through. The argument: sequence is protection.",
        tell: {
          why: "BI alone would have left John Doe nothing: $10,000 less fee and costs is $6,179.92 against $7,965.00 in unreduced liens. The UM layers change his net, and a technicality can lose them: a release signed too early, a consent never obtained, a UM demand sent before BI is exhausted.",
          rules: [
            "BI exhaustion first. Here Host UM opens once Keystone's $10,000 tender (08/12/2026) is documented; exhaustion clauses and their effect vary by policy and state (confirm the governing rule). Notice of both UM claims went out in 03/2026; it's the demand that waits.",
            "Prove Keystone is all there is: its Dec Page (03/20/2026) and Smith's affidavit of no other insurance (08/10/2026). An underinsured claim needs proof of exhaustion, not of no insurance.",
            "Send the 30-Day Letter the day after the tender (08/13/2026): notice of Keystone's $10,000 offer to Harbor Point and Cardinal State, asking each to consent and waive subrogation, or substitute its own check to keep its claim against Smith. 30-day windows here; confirm the governing rule.",
            "Nothing goes to John Doe for signature until both consents are in writing (08/24 and 08/26/2026) and Atty. Thorne has approved the release. Releasing Smith without them can cost the UM coverage.",
            "Limit the release to Robert Smith and Keystone, and to the BI claim. Keystone's 08/14 draft freed “all other persons, firms, corporations and insurers,” both UM carriers included. Flag it to Atty. Thorne; the Limited Release was signed 08/28/2026.",
            "Add-on or offset decides the stack. Harbor Point confirmed add-on in writing (03/02/2026); offset would leave $10,000 of room. Cardinal State's 03/09 letter confirms coverage, not form: get in writing that no offset or anti-stacking cap applies. $40,000 needs both.",
            "Relative UM is excess. The Escape's policy answers first; Cardinal State (Margaret Doe's policy; John Doe covered as a resident relative, 03/09/2026) answers only above the $30,000 from BI and Host UM, up to $10,000. Priority between UM policies is Atty. Thorne's call.",
            "Each package proves damages above what is already covered: Atty. Thorne's valuation less the $10,000 BI for Harbor Point, less $30,000 (BI plus Host UM) for Cardinal State. You assemble the proof; the number is his.",
            "Before BI money moves: the tort SOL (02/06/2028) and each UM claim's own deadlines (policy suit and arbitration clauses, any UM statute) docketed as Atty. Thorne confirms them; Peach State's $1,860.00 claim current, flagged for his made-whole and common-fund positions.",
            "Open each UM demand as a tracked CMS task once the release is signed (08/28): a new package, not the BI demand re-addressed."
          ],
          upl: [
            "You prepare the consent requests for Atty. Thorne's signature, track the windows, catch a release naming more than Robert Smith and Keystone, and draft the UM demands for review. You never interpret a policy or release for John Doe or tell him to sign."
          ]
        },
        show: {
          caption: "The sequence that keeps the stack",
          type: "process",
          steps: [
            ["Tender", "08/12/2026: $10,000, after Smith's affidavit (08/10)."],
            ["Consent requests", "08/13/2026: the 30-Day Letter to both UM carriers."],
            ["Consents", "Harbor Point 08/24, Cardinal State 08/26/2026."],
            ["Limited release", "08/14 general draft revised; signed 08/28/2026."],
            ["UM demands", "08/31/2026: Host UM $20,000; Relative UM $10,000, excess."],
            ["Check", "09/04/2026 into trust; copy to both UM files."]
          ]
        },
        ops: [
          ["Keystone tenders the $10,000 (08/12/2026)", "Prepare the 30-Day Letters (consent-to-settle requests) to both UM carriers for Atty. Thorne's signature; docket each window", "Action Plan Editor → Consent-to-settle template · Docket System", "Both sent 08/13/2026 with the tender, Dec Page and affidavit; both 30-day windows docketed"],
          ["Keystone's draft release arrives (08/14/2026)", "Compare who and what it releases with the approved terms; flag overbreadth", "CMS → Documents · CMS → Tasks → Escalate", "“All other … insurers” flagged to Atty. Thorne; nothing sent to John Doe to sign"],
          ["Both consents in writing; Limited Release signed (08/28/2026)", "Open the Host UM and Relative UM demands as tracked tasks", "CMS → Tasks", "Two tasks, each with carrier, claim number and adjuster"]
        ],
        best: [
          "Put the exhaustion proof at the front of each UM package: tender, consent, Limited Release.",
          "Record the source of the add-on confirmation (Harbor Point, 03/02/2026) on the Coverage Matrix.",
          "Cardinal State's form matters too: confirm in writing that its UM is not reduced by the BI and Host UM payments, and that no anti-stacking or “highest single limit” clause caps John Doe at $20,000. Enforceability is a coverage question for Atty. Thorne; the CM records the source.",
          "Your client's own carriers are now adversaries: expect scrutiny of the 2021 low-back visits, a possible IME request and a liability check on Smith.",
          "Pitfall: treating Harbor Point and Cardinal State as friendly because John Doe is their insured.",
          "Pitfall: letting a release that frees “all other … insurers” reach the client for signature.",
          "Pitfall: promising John Doe the full UM limits before coverage and offset are confirmed.",
          "Pitfall: celebrating the $40,000 gross before the liens are reduced; success is John Doe's net."
        ],
        sources: ["D2#31", "D2#32", "D3#1", "D3#2", "D3#3", "D3#4", "D3#5", "D3#9", "D3#12", "Newly authored: the UM carrier's right to substitute its own check for the BI tender; a General Release (“all other … insurers”) as a threat to the UM claims; Relative UM as excess over Host UM"],
        rubric: {
          ai: [
            ["Sequence", 20, "Tender → consent requests → consents → Limited Release → UM demands, with this file's dates"],
            ["Stack mechanics", 20, "Add-on confirmed 03/02/2026; offset would leave $10,000; Relative UM excess above $30,000"],
            ["Release scope", 20, "Robert Smith and Keystone only; the 08/14 overbreadth identified"]
          ],
          trainer: [
            ["Consequence reasoning", 25, "Explains how an early release or a missing consent would cost John Doe the UM layers and his net"],
            ["UPL boundary", 15, "No policy or release interpretation offered to the client; signature advice left to Atty. Thorne"]
          ]
        },
        notes: [
          "Open on the net, not the gross: “BI alone leaves John Doe nothing.” Show $6,179.92 against $7,965.00, then ask what the UM layers are worth to him.",
          "Put this to the room: “Keystone's draft release is in your inbox and Dana Whitfield wants it back today. What's wrong with it?” Make them find “insurers” themselves.",
          "Watch for trainees who think consent is a courtesy. It protects the UM carrier's subrogation right, which is exactly why releasing Smith without it can cost the coverage. And the UM carriers are now adversaries: their bad-faith exposure, where the law allows one, is Atty. Thorne's analysis, built on the record the CM assembles.",
          "Offset and stacking rules vary by state and by policy. Teach the question, and the source that answers it on this file: Harbor Point's 03/02/2026 letter."
        ]
      },

      {
        kind: "activity", id: "d3m1-a2",
        title: "Drafting the $20,000 Host UM and $10,000 Relative UM Demands",
        topic: "Skill Activity 2 — two packages, exhaustion proof on page one",
        visual: "Two demand letters side by side on white letterhead: left HOST UM · HARBOR POINT · $20,000 on a navy header, right RELATIVE UM · CARDINAL STATE · $10,000 (EXCESS) on an orange header. Across the top of both, a shared orange-bordered band labelled PAGE ONE: EXHAUSTION PROOF holding mono pills — TENDER 08/12 · DEC PAGE 03/20 · AFFIDAVIT 08/10 · CONSENTS 08/24 · 08/26 · RELEASE 08/28. Beneath, each letter shows four cream tiles: Liability · Economic · Non-economic · Exhaustion. At the foot of both, a dashed grey pill, CHECK COPY — TO FOLLOW, shows what hasn't arrived. A red chip bottom-right: “Not served until Atty. Thorne signs.”",
        act: {
          scenario: "File date 08/31/2026 (Mon). Keystone tendered the $10,000 limits on 08/12/2026, after Smith's affidavit of no other insurance (08/10). Harbor Point consented 08/24, Cardinal State 08/26; the Limited Release of Robert Smith and Keystone was signed 08/28. Keystone's check has not arrived. On 08/05 Keystone had leaned on the 14-day gap and called the MRI degenerative.",
          prompt: "Draft two demands for Atty. Thorne's review: Host UM to Harbor Point (Marcus Bell, HP-26-7741) for the $20,000 limit, and Relative UM to Cardinal State (Teresa Okafor, CS-26-20355) for the $10,000 limit as excess over Host UM. Put the exhaustion proof on page one of each. Organize the evidence by function, audit each package as you audited the BI demand, show damages above what has been collected, and answer the gap and “degenerative” with the MRI. Leave the response deadline for Atty. Thorne to set. Graded judgment: what proves exhaustion before the check arrives.",
          tool: "Action Plan Editor → UM demand templates · CMS → Tasks → Escalate",
          output: "Two attorney-ready UM demand drafts, exhaustion proof first, routed for review with tracked follow-up tasks.",
          checkpoints: [
            "Two separate packages: Host UM $20,000 (Harbor Point, Marcus Bell, HP-26-7741) and Relative UM $10,000 (Cardinal State, Teresa Okafor, CS-26-20355)",
            "Relative UM framed as excess: claimed for damages above $30,000 ($10,000 BI + $20,000 Host UM)",
            "Exhaustion on page one of each: Keystone's tender (08/12/2026), its Dec Page (03/20/2026), Smith's affidavit (08/10/2026), the consents (08/24 and 08/26/2026), the signed Limited Release (08/28/2026); the check copy listed to follow, with a task",
            "Coverage: each UM Dec Page; Harbor Point's add-on letter (03/02/2026); Cardinal State's resident-relative letter (03/09/2026)",
            "Liability still proven: RPD-26-018842 citation, Ruth Calloway, the doorbell video, and the Civic's $9,255.00 repair, including the $2,315.00 A-pillar structural supplement (03/02/2026), as evidence of force, not a claim",
            "Economic: itemized line-item bills, not balance-forward statements ($14,817.40); Northgate wage letter ($1,584.00); future ESIs ($3,400–$6,800); Peach State's $1,860.00 ledger current",
            "Non-economic: the narrative of pain and life impact, carried by the MRI (03/13/2026), Dr. Reyes's Causation Letter stating causation explicitly (06/19/2026) and the MMI note (06/12/2026: residual right-arm paresthesia)",
            "A two-page treatment summary matching each diagnosis, with its code, to its treatment, not a record dump",
            "Gap and “degenerative” answered up front: “no significant degenerative change at the adjacent levels,” the Causation Letter, the EMS report, the Gap Explanation Record (the 14-day gap and the 19-day disruption)",
            "Response deadline left as a marked blank for Atty. Thorne; both drafts routed to him, nothing served"
          ]
        },
        ops: [
          ["Limited Release signed (08/28/2026)", "Draft both UM demands with exhaustion proof on page one", "Action Plan Editor → UM demand templates", "Tender, Dec Page, affidavit, consents and Limited Release present in each"],
          ["Drafts complete", "Route both to Atty. Thorne for review, deadline and signature", "CMS → Tasks → Escalate · Docket System", "Nothing served before his sign-off; the deadline he sets docketed on service"],
          ["Keystone's check received", "Send its copy to Marcus Bell and Teresa Okafor as a supplemental exhibit", "CMS → Documents → Outgoing", "Check copy logged in both UM files the day it reaches trust"]
        ],
        best: [
          "One complete package per carrier; Cardinal State gets the whole file, not a cross-reference to Harbor Point's.",
          "Lead causation with the MRI line that answered Keystone's “degenerative” claim.",
          "Check whether Dr. Reyes's MMI note carries an impairment rating; if not, ask Atty. Thorne whether to request one.",
          "A package this complete is what makes refusing limits a risk for a first-party carrier, where the governing law allows a bad-faith claim; that analysis is Atty. Thorne's.",
          "Expect each UM carrier's release to come back for Atty. Thorne's review. Both carriers consented to Smith's Limited Release (08/24 and 08/26), so any subrogation or trust-agreement term reserving rights against Smith conflicts with the 08/28 release: quote it and flag it.",
          "Pitfall: re-sending the BI demand with new addressees.",
          "Pitfall: a UM demand with no deadline, or with no check copy to follow."
        ],
        sources: ["D3#4", "D3#5", "D3#6", "D3#12", "D3#13", "D3#14", "D3#15", "D3#16"],
        rubric: {
          ai: [
            ["Layer accuracy", 15, "$20,000 Harbor Point (Marcus Bell, HP-26-7741); $10,000 Cardinal State (Teresa Okafor, CS-26-20355) as excess"],
            ["Exhaustion proof", 20, "Tender 08/12, Dec Page 03/20, affidavit 08/10, consents 08/24 and 08/26, release 08/28 on page one; check copy to follow"],
            ["Document inclusions", 15, "Liability, economic, non-economic and exhaustion evidence all populated with this file's documents"],
            ["Gap rebuttal", 10, "MRI adjacent-level line, Causation Letter, EMS report and Gap Record all cited"]
          ],
          trainer: [
            ["Strategic structure", 20, "Damages shown above what has been collected; Relative UM framed as excess, not a duplicate claim"],
            ["Adversarial readiness", 10, "Anticipates the prior-condition, IME and liability challenges"],
            ["UPL / authority boundary", 10, "Drafted for review; deadline, valuation and service left to Atty. Thorne"]
          ]
        },
        notes: [
          "Start with the date: 08/31/2026, and Keystone's check isn't here. Ask what proves exhaustion today. The tender, the consents and the signed Limited Release do; the check copy follows.",
          "Put this to the room: “Why does Cardinal State's demand say excess?” Because it answers only for damages above the $30,000 reached through BI and Host UM.",
          "Watch for one merged letter to both carriers. Two carriers, two claims, two complete packages.",
          "Grade the gap section against what Keystone said on 08/05. A UM package that doesn't answer “degenerative” with the radiologist's own words hasn't learned from the BI round."
        ]
      },

      {
        kind: "check", id: "d3m1-kc",
        title: "Demand Execution Audit",
        topic: "Demand Execution Audit + CM Learning Summary & Self-Scale",
        visual: "Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange; questions 4 and 6 each carry a small red PRESSURE chip. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SKILL SCALE as a five-step horizontal ladder with the six competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar, to show it is not part of the weighting.",
        check: {
          questions: [
            "State the terms of the BI demand to Keystone, how it was served, and the date its window closed. Show how you counted the deadline.",
            "Name the five elements that make a Time-Limited Demand one a carrier must answer, with this file's example of each. Who decides whether a refusal is bad faith?",
            "Keystone calls John Doe's MRI degenerative and points to the 14-day gap. Which documents answer each point, and where in the package do they go?"
          ],
          summary: [
            "Summarize, in your own words, what you learned serving John Doe's demands: the principles that make a demand hold, not the clicks.",
            "Articulate your strategy: with both UM drafts on Atty. Thorne's desk on 08/31/2026, what is your next action on this file, and why is it the right one rather than something else?",
            "Identify the one thing in this module you are least confident about (the deadline count, consent and substitution, add-on vs offset, the release), and what you would need in order to be confident."
          ],
          scale: [
            "Computing and docketing a Time-Limited Demand's deadline from receipt",
            "Auditing a Demand Package against the Big Four and the Final Scrub",
            "Presenting a Treatment Gap and a causation dispute up front",
            "Securing UM consents and a Limited Release before BI closes",
            "Structuring secondary UM demands with exhaustion proof on page one",
            "Holding the UPL boundary on terms, extensions and releases"
          ]
        },
        best: [
          "Answer with the file's own dates, figures and names, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D2#13", "D2#15", "D2#18", "D2#31", "D3#3", "D3#6", "D3#9", "D3#12", "D3#15"],
        rubric: {
          ai: [
            ["Terms and deadline", 15, "$10,000; Limited Release of Smith and Keystone only; Smith's affidavit; 07/22/2026 + 30 = 08/21/2026"],
            ["Stack and exhaustion", 15, "$40,000 via Harbor Point's add-on form and Cardinal State's stacking terms, each confirmed in writing; offset would leave $10,000 on Host UM; consents before the release; exhibits named"],
            ["Gap rebuttal", 15, "MRI adjacent-level line, Causation Letter and EMS report named and placed up front"],
            ["Completeness", 15, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Terms, extensions, release review and any bad-faith analysis routed to Atty. Thorne"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 4 is the keystone and a pressure test. The right answer explains the process, not the law: nothing is signed until both consents are in and Atty. Thorne has gone through the release with him; log the call and route it the same day. A trainee who can't say what the consent protects has memorised the dates without the reason.",
          "Put Question 6 to the room before anyone writes. The right answer still serves by certified mail as approved, since the clock runs from its receipt; logs the auto-reply; asks Keystone in writing for the covering adjuster; and tells Atty. Thorne. Any change to timing or terms is his, not the CM's.",
          "Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.",
          "UPL is a gate: a strong score does not survive an ethics breach."
        ]
      }

      ]
    },

    /* ---------- DAY 3 · MODULE 2 ---------- */
    {
      n: 2, id: "d3m2",
      title: "Adjuster Negotiation & Stall Countermeasures",
      about: "From a $3,500 low-ball to a $40,000 gross: the battle map and net floor, gap rebuttals and stall countermeasures, the UM gap and the reductions that don't apply, and a paper trail for every offer.",
      quiz: [
        {q: "Keystone offers $3,500 on 08/05/2026. On unreduced liens of $7,965.00, what does John Doe net after the one-third fee and $486.75 in costs?",
         opts: ["$2,333.33", "$3,013.25", "$0.00: the $1,846.58 left cannot cover the liens", "$1,846.58"],
         a: 2, r: "$3,500 – $1,166.67 fee – $486.75 costs = $1,846.58, against $7,965.00 of liens. The offer nets John Doe nothing. That is the math check Atty. Thorne needs before he conveys the offer."},
        {q: "Dana Whitfield calls John Doe's MRI degenerative. Which answer comes straight from the file?",
         opts: ["Dr. Helen Park's read: “no significant degenerative change at the adjacent levels.”", "“John Doe has never had chiropractic care of any kind.”", "“Some degeneration is normal at 34, so it doesn't matter.”", "“If you drop that argument, we can come down from limits.”"],
         a: 0, r: "The radiologist's own sentence answers it. John Doe did have chiropractic care (three 2021 low-back visits, resolved), and only Atty. Thorne can move off the Limits Demand."},
        {q: "Harbor Point offers $8,000 on the Host UM claim, arguing “BI already compensated him.” Which document answers that?",
         opts: ["Keystone's Declaration Page of 03/20/2026", "Cardinal State's Coverage Letter of 03/09/2026", "Peach State's reimbursement notice", "Harbor Point's own letter of 03/02/2026: its UM is add-on (excess), not reduced by the BI payment"],
         a: 3, r: "On a reduction policy Keystone's $10,000 would come off the $20,000 limit. Harbor Point confirmed in writing that its UM is add-on, so the BI payment does not shrink the $20,000 limit; whether damages fill that room is shown with the medical proof."},
        {q: "Cardinal State tenders its $10,000 Relative UM limits on 10/06/2026. Who accepts it?",
         opts: ["The Case Manager, because it is the full limit", "John Doe, on his informed decision, conveyed through Atty. Thorne", "Atty. Thorne alone, without troubling the client", "Harbor Point, as the primary UM carrier"],
         a: 1, r: "Settlement is the client's decision. Atty. Thorne advises him and conveys it; the Case Manager logs the decision and drafts the acceptance email for Atty. Thorne to approve."},
        {q: "Before the first call with Dana Whitfield, the battle map sets John Doe's net floor. With $7,965.00 in unreduced liens, $486.75 in costs and the one-third fee, what gross does he need just to reach $0.00 net?",
         opts: ["$8,451.75", "$12,677.63", "$10,000.00", "$16,401.40"],
         a: 1, r: "Liens + costs = $7,965.00 + $486.75 = $8,451.75; × 1.5 for the one-third fee = $12,677.63 gross. That is above Keystone's $10,000 limit, which is why every UM layer and lien reduction matters. $8,451.75 forgets the fee; $16,401.40 is the Specials."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d3m2-l1",
        title: "Countering Adjuster Delay Tactics & Gap Pushback",
        topic: "The battle map, the first call, and the stall rebuttals",
        visual: "A battle map across the full slide width: four orange-numbered stations on a navy rail, left to right — ① NET FLOOR ② VALUE DRIVERS ③ THEIR TOP TWO ④ REBUTTAL READY. Station ① carries a mono pill, $12,677.63 GROSS, with a small red note: KEYSTONE LIMIT $10,000. Under station ③ hang two red-bordered danger cards, 14-DAY GAP and “DEGENERATIVE” MRI; under station ④, two cream cards answer them, each with mono source pills: EMS REPORT · CAUSATION LETTER 06/19/2026, and SUMMIT MRI 03/13/2026. Top-right, a navy chip: DEMAND EXPIRES 08/21/2026. The argument: every attack on this file is answered before the phone rings.",
        tell: {
          why: "Keystone will not argue the crash: Robert Smith was cited and the doorbell camera caught him. It will argue the 14-Day Gap, call the MRI degenerative, and stall toward 08/21/2026. A Case Manager who has mapped both attacks, and the documents that answer them, before the first call turns every stall into a record.",
          rules: [
            "The battle map comes before the first call: net floor, three value drivers, the adjuster's top two attacks with the documents that answer them, and the rebuttal. Here both attacks are known: the gap and the “degenerative” MRI.",
            "Net floor = liens + costs + fee; below it John Doe receives $0. $7,965.00 + $486.75 = $8,451.75; × 1.5 for the one-third fee = $12,677.63 gross, above Keystone's $10,000 limit. Every layer and lien reduction matters.",
            "Value drivers: Smith ran the stop sign on video, with an independent witness (the citation helps the demand; whether a jury hears of it depends on the evidence rule); an objective C5-C6 herniation and injection; residual right-arm paresthesia at MMI.",
            "Anchor on total Specials, $16,401.40, not MedPay's $5,000; lead with what MedPay bought: urgent care, Lakeside, the MRI that found the herniation. Chiropractic and PT ran under the LOP.",
            "Soft lead: confirm Dana Whitfield has the package, point her to the MRI, restate the demand and its 08/21/2026 deadline as Atty. Thorne approved them, ask for her evaluation. What the firm does if she refuses is his to say. After a low number, pause; ask her data.",
            "Anchor and hold: the demand stands as Atty. Thorne approved it. Never apologise for it; you make no moves (“never bid against yourself” is the rule he negotiates by). “That's all I have” is never final on day one.",
            "Stalls are built to wear you down. Name the stall, answer with facts, ask for a good-faith offer on the undisputed injury. The demand expires 08/21/2026; only Atty. Thorne can move it.",
            "A counteroffer can operate as a rejection of a Time-Limited Demand. Log Keystone's $3,500 as a counteroffer, in her exact words. Whether it ended the demand, and whether restating it keeps 08/21/2026 open, are Atty. Thorne's calls (confirm the governing rule).",
            "On the gap and “degenerative”, present the record, never your own view of what they mean: EMS report, 02/09–02/13 call-outs, 02/07 receipt, numbness from 02/18, Dr. Reyes's 06/19/2026 Causation Letter, and Dr. Park: “no significant degenerative change at the adjacent levels.”",
            "Log the adjuster's exact words as the call ends; report the offer to Atty. Thorne that day. He conveys it to John Doe, whose decision it is."
          ],
          upl: [
            "You may present the record, ask the adjuster to justify her number, restate the demand Atty. Thorne approved, and log and relay offers. You may not counter, move the number or the deadline, or tell John Doe what an offer is worth or whether to take it."
          ]
        },
        show: {
          caption: "The battle map for Keystone, built before the phone rings",
          type: "process",
          steps: [
            ["Net floor", "Liens $7,965.00 + costs $486.75 = $8,451.75; × 1.5 for the fee = $12,677.63 gross."],
            ["Value drivers", "Cited stop-sign violation on video; C5-C6 herniation and an injection; residuals at MMI."],
            ["Their top two", "The 14-Day Gap. The “degenerative” MRI."],
            ["Rebuttal ready", "EMS report, call-outs, receipt, Causation Letter; Dr. Park's MRI read."]
          ]
        },
        ops: [
          ["Keystone receives the demand (07/22/2026)", "Build the battle map and compute the net floor", "CMS → Financial Ledger → Net Sheet · CMS → Case Notes", "Floor $12,677.63 gross on unreduced liens ($12,677.63 – $4,225.88 fee = $8,451.75); each attack matched to a dated document"],
          ["Adjuster calls with an offer", "Soft lead, professional pause, ask for her data; restate the approved demand", "Call Simulator → AI Adjuster: Dana Whitfield, Keystone Mutual", "No counter; terms and the 08/21/2026 deadline unchanged"],
          ["Call ends", "Log the offer and the adjuster's exact words; report to Atty. Thorne", "CMS → Communications Log · CMS → Tasks → Escalate", "Logged and reported the same day, reasons quoted verbatim"],
          ["Adjuster stalls (“waiting on authority”)", "Name it and tie it to the deadline in writing", "Email Workspace", "Same-day email cites 08/21/2026; no open-ended callback accepted"]
        ],
        best: [
          "Make the adjuster justify her number with data; silence after a low offer is a tool.",
          "Stay firm, factual and professional. An angry call is a gift to the carrier.",
          "Personalize every answer to John Doe's record; a template rebuttal gets a template offer.",
          "Pitfall: softening the demand to seem reasonable.",
          "Pitfall: negotiating without knowing the client's net floor.",
          "Pitfall: anchoring on the $5,000 MedPay figure instead of total Specials.",
          "Pitfall: Specials that don't reconcile to the ledger. Know what MedPay paid ($5,000.00) for the Net Sheet; whether payer information goes to Keystone is Atty. Thorne's call.",
          "Pitfall: accepting an open-ended “I'll get back to you.”"
        ],
        sources: ["D2#16", "D2#19", "D2#21", "D2#24", "D2#25", "D2#27", "D2#29"],
        rubric: {
          ai: [
            ["Battle map complete", 20, "Floor, three value drivers, both attacks and a written rebuttal present"],
            ["Floor arithmetic", 15, "$7,965.00 + $486.75 = $8,451.75 × 1.5 = $12,677.63 gross, compared with the $10,000 limit"],
            ["Rebuttal sourcing", 15, "Each attack answered by a named, dated document; Dr. Park's sentence quoted exactly"],
            ["Log discipline", 10, "Offer, date and exact words logged; same-day report to Atty. Thorne"]
          ],
          trainer: [
            ["Strategic grasp", 20, "Explains why the gap and the MRI are Keystone's whole case, and how the record answers each"],
            ["UPL boundary", 20, "No counter, no valuation to the client, no change to the demand's terms; every offer relayed through Atty. Thorne"]
          ]
        },
        notes: [
          "Open with the question Dana Whitfield will ask, not the one we want: “Why did he wait two weeks?” Make the room answer it from documents only, no adjectives.",
          "Ask the room: “If this file settled for Keystone's full $10,000 and nothing else, what would John Doe net?” On unreduced liens the answer is $0, and it reframes the whole day.",
          "Watch for trainees who apologise for the gap. It is already explained: EMS, the call-outs, the receipt, the numbness, the Causation Letter. Their tone should be flat and factual.",
          "Hold the authority line hard. A senior CM may run the first call, but only inside the authority Atty. Thorne set in writing, and never with a number of their own. Keystone's $3,500 is a counteroffer: whether it ended the Time-Limited Demand, and whether restating it keeps 08/21/2026 alive, is Atty. Thorne's legal call, not the CM's."
        ]
      },

      {
        kind: "activity", id: "d3m2-a1", compact: true,
        title: "Negotiate with AI Adjuster: MRI Findings vs. the 14-Day Gap",
        topic: "Skill Activity 1 — hold the Limits Demand on a recorded call",
        visual: "A call-simulator screen across two-thirds of the slide: a navy header bar reading KEYSTONE MUTUAL · DANA WHITFIELD · KM-26-440871 in mono, and a live transcript where her two attacks are highlighted in red, GAP and DEGENERATIVE, each joined by an orange leader line to an evidence card in the right margin: SUMMIT MRI 03/13/2026, CAUSATION LETTER 06/19/2026, EMS RUN REPORT, GAP EXPLANATION RECORD. Above the transcript, a slim orange authority bar: HOLD $10,000 LIMITS · DEADLINE 08/21/2026 · NO COUNTER. Bottom strip: an offer-log row being filled, 08/05/2026 · $3,500 · REASONS QUOTED · REPORTED TO ATTY. THORNE. The argument: every attack meets a document, never a number.",
        act: {
          scenario: "File date 08/05/2026. Keystone received the $10,000 time-limited BI demand on 07/22; acceptance runs to 08/21/2026. Dana Whitfield calls with $3,500: John Doe “waited two weeks,” and the MRI is “degenerative.” Atty. Thorne's written authority: restate the Limits Demand and deadline, present the record, no counter, report any offer to him the same day.",
          prompt: "Run the call with Dana Whitfield in the Call Simulator. Before dialing, do the math check on $3,500: fee, costs, unreduced liens and John Doe's net. On the call, pause after her number and ask what data supports it; name each stall; on the gap, point only to the record: the EMS report, the Gap Explanation Record and Dr. Reyes's Causation Letter, and “degenerative” with Dr. Park's MRI language. Stay inside the written authority. Log the offer with her exact words, report it to Atty. Thorne the same day for him to convey to John Doe, and draft the 08/06 written rebuttal for his approval.",
          tool: "Call Simulator → AI Adjuster: Dana Whitfield, Keystone Mutual · CMS → Communications Log · Email Workspace",
          output: "A recorded call held inside Atty. Thorne's authority, a math check on $3,500, a logged offer in the adjuster's own words, a same-day report to Atty. Thorne, and the 08/06/2026 rebuttal drafted for his approval.",
          checkpoints: [
            "Math check before dialing: $3,500 – $1,166.67 fee – $486.75 costs = $1,846.58 against $7,965.00 of unreduced liens → $0.00 to John Doe",
            "Professional pause used; Dana Whitfield asked what data supports $3,500",
            "Gap answered with the Gap Explanation Record and dated documents: EMS report (02/06/2026), call-outs 02/09–02/13, receipt 02/07, numbness from 02/18, Causation Letter 06/19/2026",
            "“Degenerative” answered with Dr. Park's words, “no significant degenerative change at the adjacent levels,” and the low-back-only 2021 history",
            "$10,000 Limits Demand restated; no counter, no new figure, no change to the terms or the 08/21/2026 deadline",
            "Each stall named and answered with a fact or the deadline; no open-ended callback accepted",
            "No acceptance, rejection or opinion of value given; the offer is to be conveyed through Atty. Thorne",
            "Offer logged: 08/05/2026, $3,500, reasons in Dana Whitfield's exact words",
            "Reported to Atty. Thorne on 08/05/2026; he, not the CM, conveys the offer to John Doe",
            "Written rebuttal drafted for Atty. Thorne's approval, ready to send 08/06/2026",
            "If Dana Whitfield raises the April break, the 19-day disruption (04/02–04/21/2026) is answered from the Gap Explanation Record's A-C-T entry (rental ended 03/19, carpool ended 04/01, evening slots from 04/21, attendance confirmed 04/21 and 04/23), not conceded as non-compliance"
          ]
        },
        show: {
          caption: "Reference model: Dana Whitfield's likely stalls, and the file's answers",
          type: "table",
          head: ["The stall", "The answer from the file"],
          rows: [
            ["“He waited two weeks.”", "Neck stiffness in the EMS report on 02/06; call-outs 02/09–02/13; numbness from 02/18; the 06/19/2026 Causation Letter."],
            ["“The MRI is degenerative.”", "Dr. Park: “no significant degenerative change at the adjacent levels.” Prior care: 2021, low back only."],
            ["“I'm waiting on authority.”", "“Understood. The demand expires 08/21/2026; I'll confirm that in writing today.”"],
            ["“We need five years of records.”", "Prior care is three 2021 low-back visits; release only if Atty. Thorne approves, and ask for a good-faith offer now."]
          ]
        },
        ops: [
          ["Offer made on the call (08/05/2026)", "Log it in the adjuster's words; report to Atty. Thorne", "CMS → Communications Log · CMS → Tasks → Escalate", "Logged and reported 08/05/2026; reasons quoted verbatim"],
          ["Atty. Thorne approves the rebuttal", "Send it with the MRI report, Causation Letter, EMS report and Gap Explanation Record", "Email Workspace · CMS → Documents → Outgoing", "Sent 08/06/2026, inside the 08/21/2026 window; delivery logged"],
          ["Keystone tenders the $10,000 limits (08/12/2026)", "Log the tender and route it to Atty. Thorne the same day; draft, for his signature, the written confirmation that it is BI only (the Civic's property-damage claim stays open), on the demand's terms: Limited Release, Smith's 08/10 affidavit of no other insurance", "CMS → Insurance tab → Negotiation Log · Email Workspace", "Tender dated inside the 08/21/2026 window; no release signed before the UM consent-to-settle requests (08/13/2026) are answered"]
        ],
        best: [
          "Review the case reference sheet before you dial, and never give the BI carrier a way to reach John Doe directly.",
          "Have every document open before the call; read quotes, don't paraphrase them.",
          "Pitfall: answering “degenerative” with an opinion instead of the radiologist's own sentence.",
          "Pitfall: “let me see what I can do,” a promise to move that only Atty. Thorne can make.",
          "Pitfall: letting a gross number that nets the client below zero go unchallenged."
        ],
        sources: ["D2#16", "D2#25", "D2#27", "D2#28", "D2#29", "D2#30", "LSH Claims Specialist: review the case reference sheet before any adjuster call; no backdoor contact with the client"],
        rubric: {
          ai: [
            ["Math check", 15, "$1,166.67 fee, $486.75 costs, $1,846.58 left against $7,965.00, net $0.00, done before dialing"],
            ["Rebuttal accuracy", 20, "Dr. Park's sentence quoted exactly; the gap answered with the Gap Explanation Record and the dated documents"],
            ["Demand integrity", 10, "$10,000 limits and 08/21/2026 restated; no counter or change of terms"],
            ["Log completeness", 15, "Date, amount, exact words, same-day report, rebuttal drafted for approval"]
          ],
          trainer: [
            ["Composure and control", 15, "Professional pause, flat factual tone; makes the adjuster justify her number"],
            ["Authority boundary", 25, "Stays inside the written authority; no acceptance, rejection or valuation; the offer routed through Atty. Thorne"]
          ]
        },
        notes: [
          "If the room is slow to start, voice the adjuster's opening yourself: “He waited two weeks. That's not a herniation, that's a 34-year-old's spine.” Then stop, and let a trainee answer.",
          "Ask: “Which sentence will you read to her word for word?” It is Dr. Park's: “no significant degenerative change at the adjacent levels.”",
          "Grade the math before the call. A trainee who dials without knowing that $3,500 nets John Doe $0.00 is negotiating blind. Fail anyone who says “let me see what I can do” or names a number: the authority was written down so that nobody improvises it.",
          "Track A: after the 08/06 rebuttal and Smith's affidavit of no other insurance on 08/10, Keystone tenders the $10,000 on 08/12/2026. Track B, later today, returns to this call and plays the other ending."
        ]
      },

      {
        kind: "lesson", id: "d3m2-l2",
        title: "Securing Maximum Gross Policy-Limit Settlements",
        topic: "The UM gap, the reductions that don't apply, and closing at limits",
        visual: "Three rungs build left to right: BI $10,000 (navy, ticked TENDERED 08/12), HOST UM $20,000 (navy-soft), RELATIVE UM $10,000 (orange), with a running-total pill above each ($10,000 → $30,000 → $40,000) ending in a large Fraunces $40,000 GROSS. Under the Host UM rung sit three struck-through red chips, the reductions that do not apply here (BI OFFSET · MEDPAY NON-DUPLICATION · MEDPAY LIEN), tied by one mono pill: HARBOR POINT LETTER 03/02/2026. A grey chip, NO PIP ON THIS FILE, sits apart. Bottom strip: a cream card, CONFIRM SCOPE · RELEASE · LIENS · PAYEE · CHECK DATE → CONFIRMING EMAIL. The argument: the gross is protected by documents checked before the negotiation.",
        tell: {
          why: "Once Keystone tenders, the money that makes John Doe whole sits with two first-party carriers that insure him, and both will argue against him. $40,000 is reached by proving the gap above each layer, closing every reduction in writing first, and papering every move.",
          rules: [
            "UM pays the gap: damages, as Atty. Thorne values them, minus the BI, up to its limit. Relative UM is excess over Host UM, so Cardinal State's file must show damages above $30,000. Never demand a limit without showing the gap.",
            "Check the offset rule first: a reduction policy cuts UM by the BI; add-on pays on top. Harbor Point's 03/02/2026 letter answers the limit half of “BI already compensated him.” The damages half needs proof: its full $20,000 needs damages of at least $30,000.",
            "These are first-party contract claims, yet each carrier turns adversarial at evaluation. The first offer is rarely the last.",
            "Expect value, MMI and lien challenges. Answer value with the MRI, the injection, residuals at MMI (06/12/2026) and future care of $3,400–$6,800. MMI is reached; work the liens now.",
            "Bracketing is Atty. Thorne's tool: he sets the range and makes every move; you relay a bracket only on his written, word-for-word instruction. Against a documented gap, he may simply hold.",
            "When a carrier offers limits, confirm its terms (coverage, release scope, liens, payee, check date) without accepting; report to Atty. Thorne that day. Only after John Doe decides, on his advice, does the acceptance go out: you draft it, he approves and sends it.",
            "A first-party carrier owes its insured good faith. Never accept verbally under pressure: log the words, put new evidence in writing under Atty. Thorne's deadline, escalate. Bad faith is his call.",
            "Payout: release → check (to John Doe and the firm; he endorses, never the CM) → IOLTA → liens, fee, costs → net. Log each check the day it arrives; deposit it that day if its release is signed, else secure it and expedite signing under Atty. Thorne.",
            "MedPay is not PIP: in most states a collateral source, not a credit to Keystone (confirm the rule). Exhausted and non-subrogated, it creates no lien and no UM cut here. Where PIP applies, set-off, the EMC ceiling and subrogation change the ask."
          ],
          upl: [
            "You may assemble the evidence, log and relay offers, and paper what John Doe decided through Atty. Thorne. You may not accept, reject or counter, tell John Doe whether to settle, explain a policy's offset or release language to him, or accuse a carrier of bad faith."
          ]
        },
        show: {
          caption: "What can shrink the gross, and where this file stands",
          type: "table",
          head: ["Reduction", "Where it bites", "On this file"],
          rows: [
            ["PIP set-off", "No-fault states: value – PIP paid = what the defendant still owes.", "No PIP. MedPay is not PIP: usually a collateral source, not a credit to Keystone (confirm the rule). Exhausted, non-subrogated: no lien, no UM cut."],
            ["EMC ceiling", "In PIP states, some cap benefits lower without an emergency-medical-condition finding (confirm the rule); this file has no PIP.", "MedPay paid its full $5,000.00; the rest of the care became Peach State and LOP liens."],
            ["Subrogation", "A subrogated carrier liens the settlement: log it, plan the reduction.", "Harbor Point, 03/02/2026: no reimbursement right."],
            ["UM offset", "A reduction policy subtracts the BI from the UM limit.", "Add-on: $20,000 of room, not $20,000 – $10,000 = $10,000."]
          ]
        },
        ops: [
          ["UM offer received (Harbor Point, 09/14/2026)", "Log the offer and its stated reasons; report to Atty. Thorne", "CMS → Insurance tab → Negotiation Log · CMS → Tasks → Escalate", "Offer, date and quoted reasons logged and reported 09/14/2026"],
          ["Offer cites the BI payment or the gap", "Assemble the counter-package for approval: the 03/02/2026 letter, MRI read, Causation Letter, MMI residuals, future care", "Action Plan Editor · CMS → Documents → Outgoing", "Approved by Atty. Thorne and sent 09/16/2026"],
          ["Carrier offers its limits", "Confirm scope, release, liens, payee and check date without accepting; report to Atty. Thorne; draft the acceptance email", "Email Workspace · CMS → Case Notes", "Acceptance email sent only after John Doe's decision is logged and Atty. Thorne approves it"],
          ["UM check arrives", "Confirm its UM release is signed, then deposit to trust the same day; if not, secure the check and route it to Atty. Thorne", "CMS → Financial Ledger → Trust", "Each UM release signed before its check; deposited the day received (10/05 and 10/13/2026)"]
        ],
        best: [
          "Look for every stacking and resident-relative policy; it is why this file reaches $40,000.",
          "Confirm offset and reimbursement status in writing from each carrier, as Harbor Point's 03/02/2026 letter does.",
          "Set John Doe's expectations on the UM timeline (demand, evaluation, possibly an IME, negotiation; usually faster than BI because the records are already collected); never promise him a limit.",
          "Pitfall: accepting the first offer because “it's his own coverage.”",
          "Pitfall: promising a full UM limit before the offset rule is checked.",
          "Pitfall: a bracket move with no reciprocal move from the carrier (a move for Atty. Thorne to make or refuse, never yours).",
          "Pitfall: a verbal settlement with no confirming email.",
          "Pitfall: finding a benefit-carrier lien after disbursement."
        ],
        sources: ["D2#20", "D2#22", "D2#23", "D2#26", "D2#28", "D3#7", "D3#8", "D3#9", "D3#10", "D3#11", "D3#17"],
        rubric: {
          ai: [
            ["Gap and layer logic", 15, "UM pays the gap above BI; Relative UM excess over Host UM; $10,000 + $20,000 + $10,000 = $40,000"],
            ["Reductions closed", 20, "Offset, MedPay non-duplication and MedPay reimbursement each tied to the 03/02/2026 letter; no PIP on the file; PIP rules stated as where they apply"],
            ["Close and paper trail", 15, "Coverage, release, liens, payee and check date confirmed; same-day email"],
            ["Payout sequence", 10, "Release → check → trust → liens, fee and costs → net"]
          ],
          trainer: [
            ["Strategic judgment", 20, "Explains why the gross is protected before the negotiation, and when bracketing does and doesn't fit"],
            ["UPL boundary", 20, "No acceptance, valuation, policy interpretation or bad-faith accusation by the CM; every acceptance John Doe's, through Atty. Thorne"]
          ]
        },
        notes: [
          "Open on Harbor Point's 03/02/2026 letter. Ask which sentence in it is worth $10,000 to John Doe. It is the add-on clause: on a reduction policy, Keystone's $10,000 would have come off the top of the $20,000.",
          "Put to the room: “Harbor Point insures Kevin Alvarez's car. Why does it owe John Doe anything, and why will it still fight him?”",
          "Watch for trainees who treat the UM carriers as friendly because they are first-party. They turn adversarial at evaluation, and Harbor Point's 09/14 offer proves it. Teach PIP as the doctrine where it applies, not as a fact of this file: where PIP applies, the set-off, the EMC ceiling and a subrogation lien each change the BI ask and the net.",
          "Bad faith is a legal conclusion. New medical evidence changes a valuation, and on this file it is the residual paresthesia Dr. Reyes documented at MMI; don't call it permanent unless a physician has. The CM's contribution is a dated record of what each carrier knew and said, and anyone who writes “bad faith” to an adjuster has crossed the line."
        ]
      },

      {
        kind: "activity", id: "d3m2-a2",
        title: "Closing the $40,000 Gross Recovery",
        topic: "Skill Activity 2 — work both UM layers to limits, on the record",
        visual: "A Negotiation Log fills the slide: two carrier swimlanes on a shared date axis from 09/14 to 10/06/2026, HARBOR POINT · HOST UM · HP-26-7741 · MARCUS BELL above and CARDINAL STATE · RELATIVE UM · CS-26-20355 · TERESA OKAFOR below. Offers sit as grey chips, the 09/16 counter-package as an orange chip, limits tenders as navy chips with a green tick, each tender badged CLIENT DECISION · VIA ATTY. THORNE. A red-bordered note under the Harbor Point lane quotes “BI already compensated him” beside the 03/02/2026 letter that answers it. At the right edge a running total climbs $10,000 → $30,000 → $40,000.00 in Fraunces.",
        act: {
          scenario: "File date 09/14/2026. Keystone's $10,000 is in trust (received 09/04). The Host UM ($20,000) and Relative UM ($10,000) demands went out 08/31. Today Marcus Bell offers $8,000 for Harbor Point, citing the gap and “BI already compensated him.” Ahead: counter-package 09/16; Harbor Point pays its $20,000 limits 09/29; Cardinal State (Teresa Okafor) offers $6,000 on 10/01 and tenders its $10,000 limits 10/06.",
          prompt: "Work both UM claims to resolution in the Negotiation Log. Log Harbor Point's $8,000 with its stated reasons and report it to Atty. Thorne the same day. Assemble the 09/16 counter-package for his approval: Harbor Point's 03/02/2026 letter, the MRI read, Dr. Reyes's Causation Letter, the MMI residuals and future care. Log every later move. For each acceptance, record John Doe's informed decision through Atty. Thorne, then draft the acceptance email for his approval, sent that day: coverage, release, liens, payee, check date. Close by proving $40,000 gross.",
          tool: "CMS → Insurance tab → Negotiation Log · Email Workspace · CMS → Financial Ledger → Net Sheet → Recovery Ledger",
          output: "A complete Negotiation Log for both UM layers, an approved counter-package, a confirming email for each acceptance, and a Recovery Ledger at $40,000.00 gross.",
          checkpoints: [
            "Harbor Point's 09/14/2026 offer logged: $8,000, both stated reasons quoted, reported to Atty. Thorne the same day",
            "Counter-package answers “BI already compensated him” answers the offset half with the 03/02/2026 letter (add-on UM) and the damages half with checkpoint 3's proof",
            "Counter-package answers the gap with the MRI read and the 06/19/2026 Causation Letter, and adds the MMI residuals (06/12/2026) and future care of $3,400–$6,800, and the 19-day disruption with its A-C-T record",
            "Counter-package approved by Atty. Thorne and sent 09/16/2026; no figure below the $20,000 limits offered by the CM",
            "Harbor Point's $20,000 (09/29/2026) logged; acceptance recorded as John Doe's informed decision through Atty. Thorne",
            "Cardinal State's $6,000 (10/01/2026) logged and reported the same day; its $10,000 tender (10/06/2026) accepted only on John Doe's decision through Atty. Thorne",
            "Each confirming email states the coverage and claim number, the release scope, how liens are handled (paid from the firm's trust account, not by the carrier), the payee and the check date",
            "Recovery Ledger: $10,000.00 + $20,000.00 + $10,000.00 = $40,000.00 gross; MedPay, Keystone PD and Bluewater excluded",
            "Each UM release signed and returned before its check arrived; checks received and deposited to IOLTA the same day (10/05 and 10/13/2026)",
            "Carrier-conduct entries dated and quoted for Atty. Thorne; no “bad faith” accusation sent by the CM"
          ]
        },
        ops: [
          ["Each carrier offer or tender", "Log date, amount and the carrier's words; report to Atty. Thorne", "CMS → Insurance tab → Negotiation Log", "Four carrier entries (09/14, 09/29, 10/01, 10/06/2026) plus the 09/16 counter-package, each reported the same day"],
          ["John Doe decides, through Atty. Thorne", "Record the decision; draft the acceptance email for his approval", "Email Workspace · CMS → Case Notes", "Decision attributed to John Doe; email sent the same day"],
          ["Last layer closes (10/06/2026)", "Post all three layers to the Recovery Ledger", "CMS → Financial Ledger → Net Sheet → Recovery Ledger", "Gross = $40,000.00 exactly; nothing outside the stack added"]
        ],
        best: [
          "Write each log entry so Atty. Thorne could defend the file from it cold.",
          "Quote the carrier; never paraphrase its reasons.",
          "If an adjuster says the number is above their authority, ask who holds it and get that person involved.",
          "Pitfall: logging a tender without who accepted it, on whose advice, and when.",
          "Pitfall: adding MedPay or the Civic's property-damage payments to the gross.",
          "Pitfall: depositing a UM check before its release is signed, or leaving it unlogged."
        ],
        sources: ["D2#26", "D2#28", "D3#7", "D3#8", "D3#10", "D3#11", "D3#17"],
        rubric: {
          ai: [
            ["Log completeness", 20, "All four carrier moves and the counter-package logged with date, amount, quoted reasons and a same-day report"],
            ["Counter-package content", 15, "03/02/2026 letter, MRI read, Causation Letter, MMI residuals, future care $3,400–$6,800"],
            ["Confirmations", 10, "Each acceptance confirmed in a same-day email carrying all five terms"],
            ["Gross accuracy", 15, "$40,000.00 from $10,000 + $20,000 + $10,000; nothing else added"]
          ],
          trainer: [
            ["Advocacy quality", 15, "The counter-package would move a reasonable adjuster; firm, factual tone"],
            ["Client-decision boundary", 25, "Every acceptance John Doe's, through Atty. Thorne; the CM never accepts, counters or values"]
          ]
        },
        notes: [
          "Put Harbor Point's 09/14 reasons on the board beside its own 03/02/2026 letter. The carrier's argument is answered by its own paper; let the room see that before anyone drafts.",
          "Ask: “Cardinal State has offered $6,000. Who decides whether John Doe takes it, and how does that decision reach the log?”",
          "Grade the attribution on every acceptance. “Accepted” is incomplete; who decided, on whose advice, and when is the entry.",
          "The gross is $40,000.00 and nothing else. A trainee who adds MedPay's $5,000 or Keystone's property-damage payments has mixed the Payer Order or the PD claim into the stack."
        ]
      },

      {
        kind: "check", id: "d3m2-kc",
        title: "Negotiation Mastery Check",
        topic: "Knowledge Check + CM Learning Summary & Self-Scale",
        visual: "Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, seven questions numbered in orange, the pressure question (⑥) set apart on a red-bordered card. Lower half, below a full-width orange hairline: the CM LEARNING SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SELF-SCALE as a five-step horizontal ladder with six competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar.",
        check: {
          questions: [
            "Keystone offered $3,500 on 08/05/2026. Run the math check: fee, costs, unreduced liens and John Doe's net. What does the result tell Atty. Thorne, and who tells John Doe?",
            "Dana Whitfield says the 14-Day Gap proves the crash didn't hurt John Doe and the MRI is degenerative. Answer both from the file, naming four documents and quoting the radiologist.",
            "There is no PIP on this file. Explain what MedPay's $5,000, exhausted and non-subrogated, means for the valuation baseline, and what would change where PIP applies."
          ],
          summary: [
            "Summarize, in your own words, what you learned negotiating John Doe's file: the principles, not the clicks.",
            "Articulate your strategy: if a carrier's offer landed on this file today, what is your next action, and why is it the right next action rather than a counter?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Building the battle map and the net floor before a negotiation",
            "Rebutting a gap-based causation defense with the medical record",
            "Answering adjuster stall tactics with facts and deadlines",
            "Applying the valuation baseline: set-off, subrogation and UM offset",
            "Logging, confirming and papering every offer and acceptance",
            "Holding the authority line: every number and decision through Atty. Thorne"
          ]
        },
        best: [
          "Answer with the file's own numbers, dates and documents, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D2#19", "D2#20", "D2#23", "D2#27", "D2#28", "D2#29", "D2#30", "D3#9", "D3#11", "D3#17"],
        rubric: {
          ai: [
            ["Math accuracy", 15, "$1,166.67 fee, $486.75 costs, $1,846.58 against $7,965.00, net $0.00"],
            ["Gap rebuttal", 15, "Four dated documents; Dr. Park's sentence quoted exactly"],
            ["Baseline and offset", 20, "MedPay exhausted and non-subrogated; add-on UM per the 03/02/2026 letter; Relative UM above $30,000; what PIP would change"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "No verbal acceptance under pressure; every number and decision routed through Atty. Thorne"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 1 is the keystone. A trainee who can't show that $3,500 nets John Doe $0.00 has been negotiating without a floor; re-teach the battle map before moving on.",
          "Put question 6 to the room aloud before anyone writes: “The offer dies at 5:00 p.m. and Atty. Thorne is unreachable. What do you say?” The right answer refuses a verbal yes without rejecting the offer, asks for the offer and its deadline in writing, logs the words, and reaches Atty. Thorne. It never accepts or rejects for John Doe.",
          "On question 3, listen for the difference between “no PIP here” and “no reduction anywhere.” The file is clean because Harbor Point said so in writing on 03/02/2026, not because the doctrine doesn't exist.",
          "UPL is a gate: a strong score does not survive an ethics breach."
        ]
      }

      ]
    },

    /* ---------- DAY 3 · MODULE 3 ---------- */
    {
      n: 3, id: "d3m3",
      title: "Combined Lien Negotiations & Practice Lab",
      about: "Every claim on John Doe's $40,000 found and classified, and both liens audited and reduced on Atty. Thorne's authority: Peach State to $1,240.00, Riverton Spine & Rehab to $4,580.00, each confirmed in writing before disbursement.",
      quiz: [
        {q: "Why can Peach State's $1,860.00 claim be argued down further than a self-funded ERISA plan's usually can?",
         opts: ["Health Plans have no reimbursement right against an injury recovery", "It paid at a contract rate, so it has no lien at all", "It is a fully insured plan, so state law, not ERISA preemption, generally governs its reduction", "MedPay paid first, so the plan's claim is waived"],
         a: 2, r: "A self-funded ERISA plan answers to federal law and its own terms and is very hard to reduce. A fully insured plan is generally subject to state insurance law, where made-whole and common-fund arguments can apply. Which to argue is Atty. Thorne's call."},
        {q: "Riverton Spine & Rehab's LOP ledger shows $6,290.00. Before asking for any reduction, the Case Manager:",
         opts: ["Audits the ledger against the visit records and has the 05/04/2026 duplicate corrected to $6,105.00", "Asks for 50% off the $6,290.00 in the interest of global resolution", "Tells John Doe the bill is inflated and he need not pay it", "Pays the full balance from trust to keep the provider relationship"],
         a: 0, r: "Corrections first, reductions second. 34 lines × $185.00 = $6,290.00, but the records show 33 visits; the reduction is negotiated from the audited $6,105.00, never from an inflated bill."},
        {q: "Had only the $10,000 BI been recovered, $6,179.92 would be left after fee and costs. Shared pro rata, Riverton Spine & Rehab's $6,105.00 lien would receive:",
         opts: ["$6,105.00", "$4,580.00", "$1,443.15", "$4,736.77"],
         a: 3, r: "Riverton holds $6,105.00 of the $7,965.00 in audited liens (about 76.65%), so it takes $6,179.92 × $6,105.00 ÷ $7,965.00 = $4,736.77; Peach State takes $6,179.92 × $1,860.00 ÷ $7,965.00 = $1,443.15. John Doe would net nothing, which is why reductions matter."},
        {q: "Riverton Spine & Rehab's billing manager agrees on a call to accept $4,580.00. The reduction is final when:",
         opts: ["The call ends with a verbal yes", "Atty. Thorne approves it and the provider's signed Payoff Letter accepts $4,580.00 as full and final satisfaction", "The Case Manager logs the call in the Communications Log", "John Doe agrees to the figure"],
         a: 1, r: "A verbal reduction is not a reduction. No Payoff Letter, no payment: the letter must state full and final satisfaction, and the compromise needs Atty. Thorne's approval."},
        {q: "Peach State paid $1,860.00 on Crescent Pain & Spine's $3,400.00 bill for the 05/15/2026 injection. Building the lien inventory, who can pursue John Doe for the other $1,540.00?",
         opts: ["Crescent Pain & Spine, as an unpaid provider balance", "Peach State, as part of its reimbursement claim", "Harbor Point, through MedPay", "Nobody: Crescent took Peach State's contract rate and cannot balance-bill, so the $1,540.00 is recorded as not owed"],
         a: 3, r: "The lien is what the plan paid, not what was billed: Peach State asserts $1,860.00. Crescent's $1,540.00 write-off ($3,400.00 – $1,860.00) is a contract-rate adjustment, recorded as not owed. Harbor Point's MedPay has no reimbursement right (03/02/2026)."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d3m3-l1",
        title: "Statutory Liens, Health Subrogation & Provider Balances",
        topic: "Not all liens are created equal: classify before you negotiate",
        visual: "A reducibility ladder fills the left two-thirds: horizontal bars stacked from MOST NEGOTIABLE at the top (PROVIDER LOP, navy) through HEALTH PLAN · FULLY INSURED and WORKERS' COMP (navy-soft) and MEDICARE/MEDICAID (grey) to ERISA SELF-FUNDED at the bottom (dark grey). The two live liens, Riverton Spine & Rehab and Peach State, are solid bars with mono pills, $6,290.00 and $1,860.00; every other bar is hollow with a green ✓ NONE — VERIFIED chip. Beside the ladder, an outlined PRIOR ATTORNEY bar tagged QUANTUM MERUIT. Right third: three cream doctrine cards with orange numbered badges, ① COMMON FUND ② MADE WHOLE ③ COMPARATIVE FAULT, the third greyed. Bottom: a red danger strip, “Unclassified = overpaid or frozen.” The argument: absent liens are checked as carefully as present ones.",
        tell: {
          why: "$40,000 is not John Doe's until every claim on it is found, classified and resolved in writing. Liens are not created equal: a statutory lien bends to a formula, a Health Plan's reimbursement right to a doctrine, a provider's balance to a negotiation. Classify one wrong and you overpay it or freeze the disbursement.",
          rules: [
            "Statutory liens (Medicare, Medicaid, a statutory hospital lien, workers' comp) arise by law and bend least. Contractual claims (a plan's reimbursement clause, an LOP) rest on an agreement.",
            "Inventory every claimant, absent ones included. Two liens are asserted: Peach State and Riverton Spine & Rehab. Record each “none” with its source: Medicare (the Day 2 SSDI/BCRC check), Medicaid (verified separately: no state-agency interest), hospital (EMS transport declined), workers' comp, prior attorney.",
            "Not every payer is a lienholder. Harbor Point's MedPay has no reimbursement right (03/02/2026); Crescent Pain & Spine took Peach State's contract rate and cannot balance-bill John Doe.",
            "Funding decides the law. A self-funded ERISA plan answers to federal law and its own terms and is very hard to reduce; a fully insured plan is generally subject to state insurance law. Peach State is fully insured: what follows is Atty. Thorne's call.",
            "Common fund: a lienholder repaid from a fund the firm's work and advanced costs created shares the cost of recovery. Atty. Thorne asked for the fee share, one-third: $1,860.00 – $620.00 = $1,240.00 (fee and costs would be $1,860.00 × $13,820.08 ÷ $40,000.00 = $642.63).",
            "That work was real: the carriers used the 14-Day Gap to call the injury unrelated; the MRI and Dr. Reyes's Causation Letter answered it. Peach State did none of it.",
            "Made whole: in many jurisdictions a subrogated insurer takes nothing until the client is fully compensated. John Doe's recovery was capped by coverage; whether he was made whole is Atty. Thorne's analysis.",
            "Comparative fault: if the recovery was cut for the client's fault, the lien takes the same cut (20% at fault, 20% off). On Track A no layer took a fault reduction.",
            "Quantum meruit: a client may fire a lawyer at any time; the lawyer is then generally owed the reasonable value of the work done, not the contingency fee. Get the time records; strip clerical hours. No prior attorney here: verify and record it."
          ],
          upl: [
            "You classify, gather the plan documents, audit and draft the request with its math. The doctrine, the governing law and any figure offered or accepted are Atty. Thorne's: no lien is compromised without his express authority.",
            "You may tell John Doe what each lienholder asserts and where it stands, never that a lien is invalid or unenforceable."
          ]
        },
        show: {
          caption: "Every claim on John Doe's $40,000, classified",
          type: "table",
          head: ["Claimant", "Basis · reducibility", "On this file"],
          rows: [
            ["Riverton Spine & Rehab", "Contract (LOP) · high", "$6,290.00 billed; audit first"],
            ["Peach State Health Plan", "Contract, fully insured · moderate", "$1,860.00 asserted"],
            ["Medicare · Medicaid", "Statute · low, formula-bound", "Medicare: none (Day 2 SSDI/BCRC check); Medicaid: none (verify, record)"],
            ["Hospital · workers' comp", "Statute", "None asserted: verify, record"],
            ["Prior attorney", "Quantum meruit", "None: verify with John Doe"],
            ["Harbor Point MedPay", "Not a lien", "No reimbursement right"]
          ]
        },
        ops: [
          ["Gross recovery reaches $40,000.00 (10/06/2026)", "Run the final inventory, re-verifying the Day 2 lien register, asserted and absent, and classify each as statutory or contractual", "CMS → Financial Ledger → Net Sheet → Lien Tracker", "Two liens open; Medicare, Medicaid, hospital, workers' comp, prior attorney and MedPay each recorded “none” with a source"],
          ["Health Plan lien classified", "Obtain the plan documents and route the funding status to Atty. Thorne", "CMS → Tasks → Escalate", "Fully insured status on file; the governing-law call recorded as his"],
          ["Atty. Thorne chooses the reduction basis", "Draft the request naming the doctrine, with the math", "CMS → Documents → Outgoing", "Doctrine named; $1,860.00 – $620.00 = $1,240.00 shown; held for his approval"],
          ["Prior-attorney question open", "Ask John Doe and check the intake record; record the answer", "CMS → Case Notes", "“No prior attorney — verified” logged with its date"]
        ],
        best: [
          "Work the most negotiable lien first to build momentum, but resolve every one in writing before disbursement.",
          "Record a verified “none” the way you record a lien: with its source and its date.",
          "Name the doctrine and show the math in every Reduction Request.",
          "Pitfall: treating an ERISA plan like a provider LOP, or a fully insured plan like a self-funded one.",
          "Pitfall: asking for a “courtesy discount” with no legal basis.",
          "Pitfall: paying a prior attorney a percentage fee he is no longer entitled to."
        ],
        sources: ["D3#18", "D3#19", "D3#20", "Newly authored: plan funding status (self-funded vs. fully insured) decides the law that governs a health-plan reduction; the verified-none inventory of absent lienholders"],
        rubric: {
          ai: [
            ["Classification", 20, "Each claimant statutory, contractual or not a lien, and ranked by reducibility"],
            ["Inventory of absences", 15, "Medicare, Medicaid (sourced separately), hospital, workers' comp, prior attorney and MedPay each recorded with a source"],
            ["Doctrine accuracy", 15, "Common fund, made whole, comparative fault and quantum meruit each stated correctly"],
            ["Common-fund math", 10, "$1,860.00 – $620.00 = $1,240.00"]
          ],
          trainer: [
            ["Governing-law judgment", 20, "Sees that the plan's funding status decides the law, and leaves the call to Atty. Thorne"],
            ["UPL boundary", 20, "No doctrine chosen, figure offered or validity opinion given without counsel"]
          ]
        },
        notes: [
          "Open with the inventory, not the negotiation: “How many liens are on John Doe's $40,000?” Most trainees say two. The right answer is two asserted and five checked, each recorded with its source.",
          "Ask the room: “Peach State paid $1,860.00 on a $3,400.00 injection. Who can come after John Doe for the other $1,540.00?” Nobody: Crescent Pain & Spine took the contract rate and cannot balance-bill.",
          "Watch for trainees arguing made whole or comparative fault on their own. Naming the doctrines is the Case Manager's job; choosing one is Atty. Thorne's. The same goes for “he was riding to work in Kevin Alvarez's carpool, so is it workers' comp?”: that is a coverage question for him; the Case Manager records that no claim was filed and no lien asserted.",
          "Quantum meruit is taught, not triggered, on this file. Make them say why it still gets a line in the Lien Tracker: a prior attorney found after disbursement is found too late."
        ]
      },

      {
        kind: "activity", id: "d3m3-a1", compact: true,
        title: "Health Subrogation & Statutory Lien Reduction Lab",
        topic: "Skill Activity 1 — reduce Peach State, clear the statutory side",
        visual: "A two-panel lab bench. Left panel: a white CMS Lien Tracker card with a navy header bar and one live row, PEACH STATE · $1,860.00 → $1,240.00, with the arithmetic beneath in mono ($1,860.00 × ⅓ = $620.00), and hollow rows below it each stamped with a green ✓ NONE — VERIFIED and a small source chip (BCRC · MEDICAID VERIFIED · HARBOR POINT 03/02/2026 · INTAKE). Right panel: a draft letter on cream paper headed REDUCTION REQUEST — FOR ATTY. THORNE'S SIGNATURE, a red HOLD tag across its corner. Between the panels an orange arrow labelled ESCALATE runs to a navy chip: ATTY. ELIJAH THORNE · GOVERNING LAW · DOCTRINE. The argument: the Case Manager builds the request; counsel releases it.",
        act: {
          scenario: "File date 10/06/2026. Cardinal State has tendered its $10,000 limits: gross $40,000.00. Both liens have been on the Lien Tracker (the CMS → Liens record from Day 2, shown on the Net Sheet) since the pre-demand audit and were kept current through the UM negotiation; Atty. Thorne held Reduction Requests until the gross was known. Peach State Health Plan asserts $1,860.00, its contract-rate payment for the 05/15/2026 epidural injection at Crescent Pain & Spine. The plan documents show a fully insured group plan.",
          prompt: "Work Peach State's claim and the statutory clearance in the Lien Tracker. Match the plan's itemized payments to the treatment record, classify the lien, record its funding status and escalate the governing-law question to Atty. Thorne. Draft the Reduction Request for his signature: name the doctrine, show the one-third math to $1,240.00, cite the work that built the fund (the 14-Day Gap defense beaten with the MRI) and flag made whole as his to argue. Record every absent claimant as a verified none with its source. The graded call: what you hold until he approves, and what makes the 10/09/2026 acceptance final.",
          tool: "CMS → Financial Ledger → Net Sheet → Lien Tracker · CMS → Documents → Outgoing · CMS → Tasks → Escalate",
          output: "A Peach State Reduction Request ready for Atty. Thorne's signature, a Lien Tracker with every absent claimant cleared and sourced, and the 10/09/2026 acceptance recorded at $1,240.00 once confirmed in writing.",
          checkpoints: [
            "Plan ledger matched to one accident-related charge: the 05/15/2026 injection, $3,400.00 billed, $1,860.00 paid; the lien is what the plan paid, not what was billed",
            "Crescent Pain & Spine's $1,540.00 write-off ($3,400.00 – $1,860.00) recorded as not owed: contract rate, no balance billing",
            "Lien classified as a contractual health-plan reimbursement, not statutory; fully insured status recorded from the plan documents",
            "Governing law (state law, not ERISA preemption) recorded as Atty. Thorne's determination, not the Case Manager's",
            "Common-fund math shown: $1,860.00 × ⅓ = $620.00; $1,860.00 – $620.00 = $1,240.00; the request cites the MRI and Dr. Reyes's 06/19/2026 Causation Letter that beat the gap defense",
            "Made whole flagged for Atty. Thorne; comparative fault recorded as not applicable (no fault reduction on Track A)",
            "Request held in Documents → Outgoing until Atty. Thorne's written approval is logged",
            "Medicare recorded as none, citing the Day 2 check (34, not on SSDI), so no MSPRP final demand to reconcile; Medicaid recorded as none, verified separately with John Doe (the BCRC answers for Medicare only)",
            "Hospital, workers' comp and prior attorney each “none — verified” with date and source; MedPay recorded as not a lien: Harbor Point asserted no reimbursement right against John Doe (03/02/2026); whether it reserves MedPay subrogation against Robert Smith asked in writing and routed to Atty. Thorne, no outcome recorded",
            "MedPay-paid providers (Riverton Urgent Care, Lakeside Orthopedics, Summit Imaging) at a zero balance; Summit's 03/11/2026 LOP request was declined, so it holds no lien",
            "Acceptance logged 10/09/2026 at $1,240.00 only with Peach State's written confirmation and Atty. Thorne's approval attached"
          ]
        },
        show: {
          caption: "The Reduction Request, built for Atty. Thorne",
          type: "process",
          steps: [
            ["Match", "Plan ledger to the treatment record: one charge, 05/15/2026, $1,860.00 paid."],
            ["Classify", "Contractual reimbursement; fully insured plan; governing law to Atty. Thorne."],
            ["Calculate", "$1,860.00 × ⅓ = $620.00 → $1,240.00."],
            ["Clear", "Medicare, Medicaid, hospital, workers' comp, prior attorney, MedPay: none, each sourced."],
            ["Hold, then confirm", "Sent on his approval; final on the plan's written acceptance."]
          ]
        },
        ops: [
          ["Peach State's itemized ledger received", "Match each payment to the treatment record", "Medical Records Requests · CMS → Financial Ledger → Net Sheet → Lien Tracker", "One line, 05/15/2026, $1,860.00, accident-related"],
          ["Reduction Request drafted", "Route to Atty. Thorne for approval and signature", "CMS → Tasks → Escalate", "Nothing sent before his written approval is logged"],
          ["Plan's written acceptance arrives", "Record the reduced figure and attach the confirmation", "CMS → Financial Ledger → Net Sheet → Lien Tracker", "$1,240.00 dated 10/09/2026; confirmation attached"]
        ],
        best: [
          "Audit the Health Plan's claim too: a plan's ledger can carry charges unrelated to the collision.",
          "Record the absent liens with the same care as the present ones. Had Medicare paid, the file would stay pended until its final demand arrived (it can take 60 days or more) and was reconciled to the ledger.",
          "Pitfall: sending a request that argues a doctrine Atty. Thorne has not chosen.",
          "Pitfall: logging a verbal “we'll take a third off” as a final figure."
        ],
        sources: ["D3#18", "D3#19", "D2#40", "D2#35"],
        rubric: {
          ai: [
            ["Reduction math", 20, "$1,860.00 × ⅓ = $620.00; reduced to $1,240.00"],
            ["Clearance of absent claimants", 15, "Medicare, Medicaid (sourced separately), hospital, workers' comp, prior attorney, MedPay and the MedPay-paid providers each recorded with a source"],
            ["Classification and audit", 15, "Contractual and fully insured; one accident-related charge matched; the $1,540.00 write-off not owed"],
            ["Dates and confirmation", 10, "Acceptance dated 10/09/2026 with the written confirmation attached"]
          ],
          trainer: [
            ["Doctrine judgment", 20, "Frames common fund and made whole for Atty. Thorne without choosing between them"],
            ["Authority boundary", 20, "Nothing sent, offered or accepted before Atty. Thorne's written approval"]
          ]
        },
        notes: [
          "Open on the plan documents: “What one fact about Peach State decides which law governs its claim?” Funding. Fully insured, not self-funded.",
          "Ask: “Who decides whether John Doe was made whole?” Atty. Thorne. A request that argues it without him is a UPL problem, not a drafting choice.",
          "Grade the absences. A Lien Tracker that lists two liens and nothing else is incomplete; every absent claimant recorded as a verified “none” with its source is what makes disbursement safe. Ask who checked Summit Imaging, which asked for an LOP on 03/11/2026.",
          "The math is simple on purpose. What trips trainees is logging $1,240.00 as final before the plan's written confirmation and Atty. Thorne's approval."
        ]
      },

      {
        kind: "lesson", id: "d3m3-l2",
        title: "Pro-Rata Distribution & Medical Bill Reduction",
        topic: "Audit first, then show the lienholder the math",
        visual: "Top half: the pro-rata illustration as one long horizontal bar, the $6,179.92 fund, split 23.35% navy (PEACH STATE · $1,443.15) and 76.65% orange (RIVERTON SPINE & REHAB · $4,736.77). A bracket beneath it shows $7,965.00 of liens overhanging the bar's right end in hatched red. At the far right a small card in red: JOHN DOE NETS $0.00. Bottom half: a five-step strip of orange numbered badges, ① Audit ② Correct ③ Calculate ④ Ask with authority ⑤ Confirm in writing, ending in a navy ledger chip, NET SHEET UPDATED. The argument: the math is the leverage, and the audit comes before the ask.",
        tell: {
          why: "Half the job is getting money from the carriers; the other half is keeping it from the lienholders. Every dollar a lien gives up lands in John Doe's net. An honest audit and the pro-rata math move a provider further than any plea for a favor.",
          rules: [
            "Audit before you ask. Compare the records to the bill line by line: corrections first, reductions second. Never negotiate a percentage off an inflated bill.",
            "Riverton Spine & Rehab billed 34 lines × $185.00 = $6,290.00. The records show 33 visits (16 + 17); the 05/04/2026 line is a duplicate. You negotiate from $6,105.00.",
            "Match each line's code to that day's treatment note. Upcoding, unbundling and duplicate dates get a demand for correction, not a request for a favor. No line may fall between 04/02 and 04/21/2026, the disruption.",
            "Pro rata: when a fund cannot pay every lien in full and no statute or agreement sets an order, liens of equal priority share what is left after fee and costs in proportion to their amounts. Medicare, a statutory hospital lien or some Medicaid recoveries may take priority; confirm the governing rule. Here: two contractual claims.",
            "Had only the $10,000 BI been recovered: $10,000.00 – $3,333.33 – $486.75 = $6,179.92 against $7,965.00 of liens. Peach State $1,860.00 ÷ $7,965.00 (23.35%) → $1,443.15; Riverton $6,105.00 ÷ $7,965.00 (76.65%) → $4,736.77. Compute from the fraction, not the rounded percentage. John Doe nets nothing.",
            "Argue on true facts only. On Track A the fund covers both liens: never tell a provider it would take only a share, or that the client will refuse the settlement. The true case: a coverage-capped recovery, fee and costs paid from it, a certain payment now.",
            "Common fund (procurement costs): in many states a lienholder must reduce by its proportional share of the fee and costs that created the fund: the retainer's fee percentage (33⅓% pre-suit, 40% once suit is filed) plus its pro rata share of costs. It binds some and persuades others; confirm the rule. Atty. Thorne argues it.",
            "Ask with authority: send the written request Atty. Thorne approved, then call billing with his target (never a stock 50%), asking for payment in full in the interest of global resolution. A counter outside it goes back to him.",
            "No Payoff Letter, no payment. A signed letter states the payment is full and final satisfaction and that John Doe will not be balance-billed or sent to collections. Pay from the payoff figure, never a statement.",
            "Update the ledger the day a reduction is confirmed and show John Doe the savings: $1,860.00 + $6,105.00 = $7,965.00 audited → $1,240.00 + $4,580.00 = $5,820.00 paid ($2,145.00 negotiated), plus the $185.00 duplicate removed at audit."
          ],
          upl: [
            "You audit, calculate, draft and, inside Atty. Thorne's written authority, make the ask. You never offer or accept a figure outside it, never promise a provider payment, and never tell John Doe a bill is invalid. A reduction is final only on his approval and a signed Payoff Letter."
          ]
        },
        show: {
          caption: "The pro-rata illustration: BI only, $6,179.92 left after fee and costs",
          type: "table",
          head: ["Lienholder", "Audited lien", "Share (lien ÷ $7,965.00)", "Paid pro rata"],
          rows: [
            ["Peach State Health Plan", "$1,860.00", "23.35%", "$1,443.15"],
            ["Riverton Spine & Rehab", "$6,105.00", "76.65%", "$4,736.77"],
            ["Total", "$7,965.00", "100%", "$6,179.92"],
            ["John Doe's net", "—", "—", "$0.00"]
          ]
        },
        ops: [
          ["Provider's Final Ledger received", "Audit each line against the visit records; request a written correction of any error", "Medical Records Requests · CMS → Financial Ledger → Net Sheet → Lien Tracker", "33 visits matched; 05/04/2026 duplicate removed; $6,105.00"],
          ["Audited balance confirmed", "Draft the Reduction Request with the math and obtain Atty. Thorne's written authority", "CMS → Documents → Outgoing · CMS → Tasks → Escalate", "Authority logged before the request goes or any call is made"],
          ["Reduction agreed", "Obtain the signed Payoff Letter; update the Lien Tracker and the Net Sheet", "CMS → Financial Ledger → Net Sheet", "Full-and-final language on file; net recomputed the same day"]
        ],
        best: [
          "Corrections first, reductions second.",
          "Transparency about savings builds trust: show John Doe his net rising.",
          "Get every reduction in writing before disbursement.",
          "Pitfall: negotiating a percentage off an inflated bill.",
          "Pitfall: agreeing to a reduction verbally with no written confirmation.",
          "Pitfall: paying from a statement instead of the final payoff figure, or without the full-and-final language."
        ],
        sources: ["D3#21", "D3#22", "D2#40", "D2#35", "Newly authored: the pro-rata distribution rule worked on the BI-only illustration; the pro-rata argument restated on true facts for a fund that covers every lien"],
        rubric: {
          ai: [
            ["Audit accuracy", 20, "34 lines against 33 visits; the 05/04/2026 duplicate; $6,105.00"],
            ["Pro-rata math", 20, "Shares computed from each lien ÷ $7,965.00; $1,443.15 + $4,736.77 = $6,179.92"],
            ["Payoff-letter terms", 10, "Full and final satisfaction; no balance billing or collections"],
            ["Ledger update", 10, "$7,965.00 audited → $5,820.00 paid ($2,145.00 negotiated); net $20,359.92"]
          ],
          trainer: [
            ["Negotiation ethics", 20, "Argument made on true facts; no bluff about the fund or the client's intentions"],
            ["Authority boundary", 20, "Every ask inside Atty. Thorne's written authority; nothing final without him"]
          ]
        },
        notes: [
          "Open with the BI-only table and cover the last row. Ask: “What does John Doe take home?” Then uncover $0.00. That is why this lesson exists.",
          "Ask the room: “Riverton billed $6,290.00. What number do you negotiate from?” Anyone who says $6,290.00 has skipped the audit.",
          "Watch for the old script, “reduce or the client refuses the settlement.” It is a threat, and on Track A it is false: all three layers have tendered their limits (Cardinal State's check arrives 10/13), and after fee and costs $40,000.00 – $13,333.33 – $486.75 = $26,179.92 remains against $7,965.00 of liens. Make them rewrite it on true facts: a coverage-capped recovery, the audited balance, a certain payment now.",
          "The legal nuance: the common-fund rule binds some lienholders by statute or case law and only persuades others, and an LOP provider is often outside it. Which it is here is Atty. Thorne's call; confirm the governing rule."
        ]
      },

      {
        kind: "activity", id: "d3m3-a2",
        title: "Provider Balance Negotiation Exercises",
        topic: "Skill Activity 2 — the reduction call to the chiropractor",
        visual: "A phone-call storyboard in three frames across the slide, each a cream card with an orange numbered badge. ① THE AUDIT: a mini ledger of 34 lines with the 05/04/2026 line struck through in red, $6,290.00 → $6,105.00 in mono. ② THE CALL: a navy speech-bubble pair, CM and RIVERTON BILLING, with a small written-request chip clipped to the CM's bubble. ③ IN WRITING: a signed Payoff Letter with FULL AND FINAL SATISFACTION highlighted in orange and a green ✓ at $4,580.00 · 10/12/2026. Under frame ② a red danger callout: “A yes on the phone is not a reduction.” Bottom right, the net as a mono pill: $20,359.92.",
        act: {
          scenario: "It is 10/09/2026. Peach State has accepted $1,240.00 in writing. Riverton Spine & Rehab's final LOP ledger shows 34 lines × $185.00 = $6,290.00 for chiropractic and PT 02/24–06/05/2026. Atty. Thorne has set a target for Riverton in writing; the Reduction Request is yours to draft for his approval. No lien can be paid until it is resolved in writing.",
          prompt: "Audit Riverton Spine & Rehab's ledger against the visit records and request a written correction before asking for anything. Draft the Reduction Request for Atty. Thorne's approval, send it once approved, then make the follow-up call to the billing manager in the Call Simulator inside his written authority: state the audited balance, the coverage-capped recovery and the math, and ask for payment in full in the interest of global resolution. The manager agrees to $4,580.00 on the call. The graded call: what you say next, and what must exist before that figure is final and the Net Sheet shows $20,359.92.",
          tool: "Call Simulator → AI Billing Manager: Riverton Spine & Rehab · Email Workspace · CMS → Financial Ledger → Net Sheet → Lien Tracker",
          output: "An audited Riverton balance of $6,105.00, an approved written request and a logged call, a signed Payoff Letter accepting $4,580.00 dated 10/12/2026, and a recomputed Net Sheet.",
          checkpoints: [
            "Ledger audited line by line: 34 billed lines against 33 documented visits (16 from 02/24 to 04/02/2026, 17 from 04/21 to 06/05/2026)",
            "The 05/04/2026 duplicate, removed from the Specials in the pre-demand audit, is still on Riverton's Final Ledger: written correction requested before any reduction: $6,290.00 – $185.00 = $6,105.00",
            "Each line's code matched to that day's note, upcoding and unbundling checked and recorded; no line in the 04/02 → 04/21/2026 disruption (missed 04/03, 04/07, 04/09, 04/14)",
            "Written Reduction Request approved by Atty. Thorne and sent before the call; his target and authority logged",
            "Argument on true facts: a recovery capped at $40,000 of coverage, fee and costs paid from it; no claim that Riverton would take only a share, or that the client will refuse the settlement",
            "Ask framed as payment in full in the interest of global resolution; no payment promised",
            "$4,580.00 not accepted on the call: the trainee says it goes to Atty. Thorne and will be confirmed in writing",
            "Signed Payoff Letter on file: $4,580.00 accepted as full and final satisfaction of the LOP; no balance billing or collections against John Doe",
            "Lien Tracker: $6,290.00 billed → $6,105.00 audited → $4,580.00 accepted 10/12/2026 ($185.00 corrected + $1,525.00 negotiated = $1,710.00 saved)",
            "Net Sheet recomputed: $40,000.00 – $13,333.33 – $486.75 – $1,240.00 – $4,580.00 = $20,359.92",
            "Savings reported to John Doe as facts, with no advice on the settlement"
          ]
        },
        ops: [
          ["Final LOP ledger received", "Audit it and request the written correction", "Medical Records Requests · Email Workspace", "$6,105.00 confirmed in writing before any reduction is asked"],
          ["Request approved and sent", "Make the follow-up call and log it", "Call Simulator → AI Billing Manager: Riverton Spine & Rehab · CMS → Communications Log", "Call logged with the ask and the answer; no figure accepted on the call"],
          ["Provider agrees to a figure", "Route it for approval, obtain the signed Payoff Letter, update both tabs", "CMS → Tasks → Escalate · CMS → Financial Ledger → Net Sheet", "Payoff Letter on file; net $20,359.92"]
        ],
        best: [
          "Script the call before you dial: the audited balance, the recovery, the math, the ask.",
          "Lead with the audit correction; it tells the provider you have read the records.",
          "Pitfall: agreeing to the figure on the phone because it sounds good.",
          "Pitfall: a Payoff Letter without the full-and-final and no-balance-billing language."
        ],
        sources: ["D3#21", "D3#22", "D2#40", "D2#35"],
        rubric: {
          ai: [
            ["Audit result", 20, "05/04/2026 duplicate removed; $6,105.00; nothing billed in the disruption"],
            ["Ledger and net", 20, "$6,290.00 → $6,105.00 → $4,580.00; net $20,359.92"],
            ["Payoff Letter", 10, "Full and final; no balance billing; dated 10/12/2026"],
            ["Request and call record", 10, "Written request approved before it went; the ask and the answer logged"]
          ],
          trainer: [
            ["Negotiation conduct", 15, "Firm, courteous and factual; the argument stated honestly"],
            ["Authority boundary", 25, "Nothing accepted, promised or confirmed outside Atty. Thorne's authority"]
          ]
        },
        notes: [
          "Run it live. One trainee calls; the AI billing manager pushes back: “We gave him 33 visits on a promise of payment, and you want a discount?” The answer is the audit and the true facts of the recovery, not sympathy.",
          "Ask: “The manager just said yes to $4,580.00. What do you say next?” The right answer thanks them and says the figure goes to Atty. Thorne and will be confirmed in writing.",
          "Grade the audit first. A trainee who opens with a discount on $6,290.00 has negotiated around $185.00 of error the provider should have simply corrected.",
          "Tie it forward to the disbursement: the Payoff Letter is what lets the 10/22/2026 disbursement go out clean."
        ]
      },

      {
        kind: "check", id: "d3m3-kc",
        title: "Lien Reduction Verification",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange; question 6 carries a small red PRESSURE chip. Lower half: the CM SELF-SUMMARY on a navy card with white type, three prompts, beside the 1–5 SKILL SCALE as a five-step ladder with six competency rows. A slim right strip: 60/40 stacked bar (AI navy, Trainer orange), UPL a separate red gate chip below it. Between the halves, a LIEN TRACKER STRIP, two rows across four cells headed ASSERTED · AUDITED · REDUCED · IN WRITING: Peach State $1,860.00 · $1,860.00 · $1,240.00 · ✓ and Riverton Spine & Rehab $6,290.00 · $6,105.00 · $4,580.00 · ✓. The trainee checks their own answers against the strip before submitting.",
        check: {
          questions: [
            "Classify each claim against John Doe's $40,000 (Peach State, Riverton Spine & Rehab, Harbor Point MedPay, Medicare/Medicaid, a prior attorney) as statutory, contractual or none, and rank the liens by reducibility.",
            "Peach State is a fully insured group plan. Explain why that matters to reducing its $1,860.00 claim, and who decides what follows from it.",
            "Show the math that takes Peach State from $1,860.00 to $1,240.00, name the doctrine behind it, and explain how beating the 14-Day Gap defense with the MRI supports it."
          ],
          summary: [
            "Summarize, in your own words, what you learned about reducing the liens on John Doe's file: the principles, not the clicks.",
            "Articulate your strategy: with both liens resolved, what is the next action before the 10/22/2026 disbursement, and why is it the right one?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Classifying liens as statutory or contractual and ranking them by reducibility",
            "Matching a reduction doctrine to a lien and showing its math",
            "Auditing a provider ledger before asking for a reduction",
            "Calculating a pro-rata distribution from a limited fund",
            "Securing written Payoff Letters and updating the Lien Tracker and Net Sheet",
            "Holding the authority line in lien negotiation"
          ]
        },
        best: [
          "Answer with this file's figures: $1,860.00, $6,290.00, $6,105.00, $1,240.00, $4,580.00.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D3#18", "D3#19", "D3#20", "D3#21", "D3#22", "D2#40"],
        rubric: {
          ai: [
            ["Classification and doctrine", 15, "Liens classified and ranked; fully insured status tied to state law; doctrines named correctly"],
            ["Lien math", 20, "$1,860.00 – $620.00 = $1,240.00; $1,443.15 + $4,736.77 = $6,179.92; $6,105.00 after the audit"],
            ["Written-confirmation steps", 15, "Atty. Thorne's approval, the signed Payoff Letter and the ledger update all named"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Escalation to Atty. Thorne identified wherever a figure, a doctrine or a validity question arises"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 2 is the keystone. A trainee who answers “state law applies, so we argue made whole” has made Atty. Thorne's decision for him; re-teach the line before moving on.",
          "Question 6 is the pressure scenario. The right answer escalates to Atty. Thorne before any check issues, re-checks how “no prior attorney” was verified, on Atty. Thorne's instruction requests the lawyer's engagement terms and time records in writing, and never treats “one-third” as owed: a discharged lawyer is generally owed the reasonable value of his work, if anything. The disputed amount stays in trust until the claim is resolved (confirm the governing trust rule); the undisputed shares go out only on Atty. Thorne's approval.",
          "Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.",
          "UPL is a gate: a strong score does not survive an ethics breach."
        ]
      }

      ]
    },

    /* ---------- DAY 3 · MODULE 4 ---------- */
    {
      n: 4, id: "d3m4",
      title: "Net Sheet Completion & Final Case Closing",
      about: "From $40,000.00 gross to $20,359.92 in John Doe's hands: the dual-tab Net Sheet, the release audit, trust-account disbursement, and the reconciliation that lets the file close at $0.00.",
      quiz: [
        {q: "Keystone's 08/14 draft release covered Robert Smith, Keystone and “all other persons, firms, corporations and insurers.” What was the danger?",
         opts: ["It left out the non-admission-of-liability clause", "It would also have released Harbor Point and Cardinal State: $30,000 of the stack", "It had no notary block", "It released only the bodily-injury claim"],
         a: 1, r: "Harbor Point and Cardinal State are insurers. The catch-all line would have released both UM claims; flagged to Atty. Thorne, it was revised to a Limited Release of Robert Smith and Keystone, signed 08/28/2026."},
        {q: "Which of these is a payable line on John Doe's Lien Tracker?",
         opts: ["Harbor Point MedPay, $5,000.00", "Crescent Pain & Spine's written-off balance", "Riverton Spine & Rehab, $4,580.00", "Riverton Spine & Rehab's duplicate 05/04/2026 visit"],
         a: 2, r: "MedPay has no reimbursement right (Harbor Point, 03/02/2026); Crescent wrote off its balance and cannot balance-bill; the duplicate was audited out. Only the reduced liens are paid: Riverton Spine & Rehab $4,580.00 and Peach State $1,240.00."},
        {q: "When was the first trust check cut on John Doe's settlement, and why not earlier?",
         opts: ["09/04/2026, when Keystone's check arrived", "10/13/2026, when the last check arrived", "10/30/2026, with the closing memo", "After the last funds cleared (10/20) and John Doe signed the Settlement Statement (10/21): disbursement 10/22/2026"],
         a: 3, r: "Nothing is disbursed against uncleared funds or before the client has signed the statement. All three checks had cleared by 10/20 (the last, Cardinal State's, deposited 10/13), John Doe signed 10/21, and Atty. Thorne signed the checks 10/22."},
        {q: "How are the $486.75 in case costs handled on John Doe's Net Sheet?",
         opts: ["Receipted, then split pro rata 25% / 75%: $121.69 BI and $365.06 UM", "Charged in full to each stream", "Absorbed by the firm because no suit was filed", "Taken out of the lienholders' payments"],
         a: 0, r: "Every cost needs a receipt and is charged once. This file allocates costs to the streams pro rata to gross: 25% of $486.75 = $121.69 on BI, and the remaining $365.06 on UM."},
        {q: "The Net Sheet shows John Doe netting $20,359.92. Lakeside Orthopedics noted possible repeat ESIs ($3,400–$6,800) ahead. Before John Doe signs, the Case Manager:",
         opts: ["Holds $6,800.00 of his net in trust to cover the injections", "Tells John Doe the net is enough to cover future care", "Flags it to Atty. Thorne: the settlement is full and final and no carrier pays more, so he has that conversation with John Doe", "Adds the injections to Peach State's lien so the plan pays them later"],
         a: 2, r: "The CM builds and explains the arithmetic but never says whether the net is enough. Future medical was narrated, never in the Specials; with a full and final settlement nothing more comes from Keystone, Harbor Point or Cardinal State. The flag goes to Atty. Thorne."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d3m4-l1",
        title: "The Dual-Tab Net Sheet: Recovery Ledger + Lien Tracker",
        topic: "One Net Sheet, two streams, every dollar's origin visible",
        visual: "A wide two-tab spreadsheet card fills the slide, cream with a navy header bar carrying two tabs: RECOVERY LEDGER (active, orange underline) and LIEN TRACKER (navy-soft, set behind). The ledger has three mono columns, TOTAL · STREAM 1 BI · STREAM 2 UM, and rows Gross, Fee 33⅓%, Costs, Peach State, Riverton Spine & Rehab, closing on a heavy orange-ruled NET row: $20,359.92 = $5,089.98 + $15,269.94. A thin orange connector runs from each lien row back to the Lien Tracker tab, labelled PROVED BY PAYOFF LETTER. Bottom-right, a red danger callout: “BI alone: $0.00 to John Doe.” The argument: every figure on the net row traces to its source.",
        tell: {
          why: "John Doe's $40,000 came from three carriers in two streams and goes out as five checks. The Net Sheet shows every dollar's origin and destination before a cent leaves trust. Had only the $10,000 BI been recovered, $6,179.92 would have met $7,965.00 of unreduced liens, and John would have received nothing.",
          rules: [
            "One Net Sheet, two tabs. The Recovery Ledger carries the money in and every deduction; the Lien Tracker proves each lien figure the ledger uses. Neither is final until the two tie out.",
            "Keep the streams apart. Stream 1, third-party BI: Keystone, $10,000.00. Stream 2, first-party UM: Harbor Point $20,000.00 + Cardinal State (resident relative) $10,000.00 = $30,000.00. Stream 2 opened only because BI was exhausted first.",
            "Show where every dollar came from: carriers audit settlements, and a payment counted twice is double-counting on the ledger. Harbor Point's MedPay already paid $5,000.00 of the bills: a payment source on the Lien Tracker, never recovery.",
            "Price the fee per stream. The retainer sets 33⅓% pre-suit: $3,333.33 on BI + $10,000.00 on UM = $13,333.33. Separate lines matter: fee terms can differ between BI and UM, and the 40% tier applies only once suit is filed.",
            "Every cost needs a receipt: Police Report $25.00, records and billing $214.75, certified mail $72.00, MRI disc $25.00, postage and copies $150.00 = $486.75. Charge it once, as one line or split pro rata; this file splits 25% / 75%: $121.69 / $365.06.",
            "Reduce liens globally against the combined $40,000.00, not provider by provider per policy, then allocate pro rata: Peach State $310.00 / $930.00; Riverton Spine & Rehab $1,145.00 / $3,435.00.",
            "On the Lien Tracker, Balance Owed = Charges – PIP – Health – MedPay – Adjustments. Each lien shows asserted, audited and reduced amounts and its payoff-letter status. No Payoff Letter, no payment.",
            "Run the aggregate math on both streams at once: $5,089.98 + $15,269.94 = $20,359.92, and Gross – Fees & Costs – Final Medical Balances: $40,000.00 – $13,820.08 – $5,820.00 = $20,359.92.",
            "Test the net against the future care discussed in treatment: possible repeat ESIs ($3,400–$6,800). The settlement is full and final, so no carrier pays more for them. Flag it for Atty. Thorne."
          ],
          upl: [
            "You build, verify and explain the arithmetic. You may not tell John Doe whether the net is enough, whether a lien is enforceable, or what he should do with the money: Atty. Thorne reviews the Net Sheet and explains it to John before he signs."
          ]
        },
        show: {
          caption: "The two tabs of John Doe's Net Sheet, and what each proves",
          type: "compare",
          boxes: [
            {head: "RECOVERY LEDGER — money in, deductions, net", items: [
              "Gross $40,000.00: Stream 1 BI $10,000.00 (Keystone) · Stream 2 UM $30,000.00 (Harbor Point + Cardinal State).",
              "Fee 33⅓%: $3,333.33 + $10,000.00 = $13,333.33.",
              "Costs, receipted: $121.69 + $365.06 = $486.75.",
              "Liens from the Lien Tracker, 25% / 75%: $1,455.00 + $4,365.00 = $5,820.00.",
              "Net to John Doe: $5,089.98 + $15,269.94 = $20,359.92."
            ]},
            {head: "LIEN TRACKER — every figure proved", items: [
              "Peach State: asserted $1,860.00 → reduced $1,240.00 (10/09).",
              "Riverton Spine & Rehab: $6,290.00 → audited $6,105.00 → reduced $4,580.00 (10/12).",
              "Harbor Point MedPay $5,000.00: no reimbursement right (03/02/2026) → $0.00.",
              "Crescent Pain & Spine: balance written off, no balance-billing → $0.00.",
              "Payoff Letter status on every line."
            ]}
          ]
        },
        ops: [
          ["Each settlement check received", "Post it to its stream with carrier and check reference", "CMS → Financial Ledger → Net Sheet → Recovery Ledger", "BI $10,000.00 · UM $20,000.00 + $10,000.00 · total $40,000.00"],
          ["Cost incurred", "Attach the receipt and post it once", "CMS → Financial Ledger → Net Sheet → Recovery Ledger", "Five receipts = $486.75; no cost charged to both streams in full"],
          ["Lien reduction accepted", "Record asserted, audited and reduced figures and the Payoff Letter", "CMS → Financial Ledger → Net Sheet → Lien Tracker", "Peach State $1,240.00 · Riverton Spine & Rehab $4,580.00 · letters dated"],
          ["Both tabs complete", "Tie the Net Sheet to the Trust Ledger and route it to Atty. Thorne", "CMS → Financial Ledger → Trust · CMS → Tasks → Escalate", "Net $20,359.92 on both; routed before John Doe sees it"]
        ],
        best: [
          "One Net Sheet, two clearly separated streams.",
          "Every reduction carries its reason: an audit finding (the 05/04/2026 duplicate) or a named basis (the one-third procurement-cost reduction).",
          "Show the streams side by side so John Doe sees what the work produced: Keystone offered $3,500 on the 14-Day Gap and a “degenerative” MRI; the MRI's own “no significant degenerative change at the adjacent levels” helped turn that into $10,000, and the UM stream added $30,000. Financial engineering, not data entry.",
          "Read the LSH ledger top to bottom in four sections: recovery summary (gross by carrier), fees and advanced costs, the medical provider ledger with its reductions, net to client.",
          "Accurate financial detail builds client trust.",
          "Pitfall: mixing BI and UM money on one undifferentiated line.",
          "Pitfall: charging the same cost to both streams.",
          "Pitfall: a cost with no receipt, or a lien figure with no Payoff Letter."
        ],
        sources: ["D2#35", "D2#36", "D3#23", "D3#24", "D3#25", "D3#26", "D3#27"],
        rubric: {
          ai: [
            ["Stream separation", 15, "BI $10,000.00 and UM $30,000.00 on separate streams; MedPay kept out of the gross"],
            ["Fee and cost lines", 15, "$3,333.33 + $10,000.00 fee; five receipted costs = $486.75, split $121.69 / $365.06, charged once"],
            ["Lien Tracker fields", 15, "Asserted, audited, reduced and payoff status for each lien; Balance Owed formula applied"],
            ["Aggregate math", 15, "$20,359.92 reached both down the streams and across the total"]
          ],
          trainer: [
            ["Double-counting reasoning", 15, "Explains why MedPay and written-off balances never appear as payables"],
            ["Future-care judgment", 10, "Recognises the full-and-final consequence and flags it rather than resolving it"],
            ["UPL boundary", 15, "Explains the arithmetic to John Doe; leaves sufficiency, enforceability and advice to Atty. Thorne"]
          ]
        },
        notes: [
          "Open with the why's counterfactual: write $6,179.92 against $7,965.00 on the board and ask what John Doe would have taken home with the BI stream alone. Nothing. Then show $20,359.92.",
          "Ask the room: “Why does Harbor Point's MedPay appear on the Lien Tracker but not in the gross?” The answer is double-counting on the ledger: it already paid $5,000.00 of the bills, and it has no reimbursement right on this file.",
          "Watch the rounding. 25% of $486.75 is 121.6875, so BI carries $121.69 and UM takes the remainder, $365.06. Compute the second stream as the remainder and the total never drifts by a cent.",
          "Legal nuance: Peach State is a fully insured plan, so its reduction turned on state law, not ERISA preemption. That was Atty. Thorne's call in the lien negotiation; the CM records the basis and never chooses it."
        ]
      },

      {
        kind: "activity", id: "d3m4-a1",
        title: "Completing the Final Dual-Tab Net Sheet",
        topic: "Skill Activity 1 — take $40,000.00 to $20,359.92, and prove every line",
        visual: "Split slide. Left 60%: the Lien Tracker tab as a cream table with mono columns ASSERTED · AUDITED · REDUCED · PAYOFF LETTER. The Riverton Spine & Rehab row reads $6,290.00 → $6,105.00 → $4,580.00, with an orange strike through the 05/04/2026 duplicate; Peach State reads $1,860.00 → $1,860.00 → $1,240.00. Beneath, three grey zero-balance rows (MedPay, Crescent, the MedPay-paid providers), each with a NOT PAYABLE chip. Right 40%: a navy stream card with two stacked bars, BI 25% and UM 75%, feeding a large orange NET $20,359.92. A red callout at the foot: “No Payoff Letter, no payment.”",
        act: {
          scenario: "File date 10/13/2026. Cardinal State's $10,000 check arrived today, joining Keystone's (received 09/04) and Harbor Point's (10/05) in the IOLTA trust account, each deposited only after its release was signed (Keystone 08/28; each UM release before its check): $40,000.00 received; the last check has not cleared. Peach State accepted $1,240.00 on 10/09 and Riverton Spine & Rehab accepted $4,580.00 on 10/12; both written acceptances are in Documents. Costs stand at $486.75. Both Net Sheet tabs are half-built from the demand phase.",
          prompt: "Complete John Doe's Net Sheet in both tabs. Recovery Ledger: each check by carrier and stream, the 33⅓% fee per stream, the five receipted costs, and costs and liens split 25% / 75%, down to the net per stream and in total. Lien Tracker: every provider and payer with charges, payments, adjustments and balance owed, then each lien's asserted, audited and reduced figure, the basis of each reduction and its payoff-letter status. Tie both tabs to the Trust Ledger. Graded judgment: what stays off the payables, and what you flag for Atty. Thorne before John signs.",
          tool: "CMS → Financial Ledger → Net Sheet (Recovery Ledger · Lien Tracker)",
          output: "A two-tab Net Sheet that reaches $20,359.92 down both streams and across the total, with every lien figure proved and routed to Atty. Thorne.",
          checkpoints: [
            "Gross by check: Keystone $10,000.00 to Stream 1; Harbor Point $20,000.00 + Cardinal State $10,000.00 = $30,000.00 to Stream 2",
            "Fee at the pre-suit 33⅓% (no suit filed): $3,333.33 + $10,000.00 = $13,333.33",
            "Costs receipted: $25.00 + $214.75 + $72.00 + $25.00 + $150.00 = $486.75, split $121.69 / $365.06 and charged once",
            "Liens split 25% / 75%: Peach State $310.00 / $930.00; Riverton Spine & Rehab $1,145.00 / $3,435.00",
            "Net both ways: $5,089.98 + $15,269.94 = $20,359.92, and $40,000.00 – $13,333.33 – $486.75 – $1,240.00 – $4,580.00 = $20,359.92",
            "Peach State row: asserted $1,860.00, audited $1,860.00 (matches its payment for Crescent's 05/15/2026 injection), reduced $1,240.00 (one-third procurement-cost reduction, $620.00), accepted 10/09/2026",
            "Riverton Spine & Rehab row: billed $6,290.00, audited $6,105.00 (duplicate 05/04/2026 line, $185.00), reduced $4,580.00, accepted 10/12/2026",
            "Zero-balance lines kept off the payables with their source: MedPay $5,000.00 (no reimbursement right, 03/02/2026); Crescent $3,400.00 – $1,860.00 = $1,540.00 written off; Riverton Urgent Care, Lakeside Orthopedics and Summit Imaging paid in full by MedPay",
            "Payoff status recorded per lien: written figure and date logged, satisfaction of lien marked “to obtain at payment”; no line final on a phone call",
            "Future medical ($3,400–$6,800 in possible repeat ESIs) flagged to Atty. Thorne before John Doe signs: the settlement is full and final, and no carrier pays more",
            "Ties out: trust deposits $40,000.00 = Recovery Ledger gross; liens audited $1,860.00 + $6,105.00 = $7,965.00, paid $1,240.00 + $4,580.00 = $5,820.00 ($2,145.00 negotiated, plus the $185.00 duplicate removed at audit)"
          ]
        },
        ops: [
          ["Last UM check received (10/13/2026)", "Post the deposit and complete the Recovery Ledger by stream", "CMS → Financial Ledger → Net Sheet → Recovery Ledger", "Streams $10,000.00 / $30,000.00; net $20,359.92"],
          ["Lien reduction accepted in writing", "Complete the Lien Tracker row and log the Payoff Letter", "CMS → Financial Ledger → Net Sheet → Lien Tracker · CMS → Documents", "Peach State $1,240.00 (10/09); Riverton Spine & Rehab $4,580.00 (10/12)"],
          ["Both tabs tie to the Trust Ledger", "Route the draft Settlement Statement with the future-medical flag", "CMS → Tasks → Escalate", "Routed to Atty. Thorne before John Doe sees the statement"]
        ],
        best: [
          "Every reduction needs a named basis or an audit finding, written on its line.",
          "Record zero-balance lines with their source document, so no one later pays what isn't owed.",
          "Compute the UM share as the remainder of each split so the streams add back to the cent.",
          "Pitfall: marking a lien final from an email or a phone call instead of a written payoff figure.",
          "Pitfall: adding MedPay's $5,000.00 or Crescent's write-off to the payables and paying John Doe's money away."
        ],
        sources: ["D2#35", "D2#36", "D3#25", "D3#27", "D3#28"],
        rubric: {
          ai: [
            ["Stream arithmetic", 20, "Fee, costs and liens split correctly; $5,089.98 + $15,269.94 = $20,359.92"],
            ["Lien Tracker accuracy", 15, "Asserted, audited and reduced figures and dates for Peach State and Riverton Spine & Rehab"],
            ["Cost verification", 10, "Five receipted costs = $486.75, charged once"],
            ["Zero-balance discipline", 15, "MedPay, Crescent and the MedPay-paid providers kept off the payables with sources"]
          ],
          trainer: [
            ["Judgment on payables", 15, "Can explain why each zero-balance line is not owed, citing the document"],
            ["Future-care flag", 10, "Flags the full-and-final consequence to Atty. Thorne rather than raising it with John Doe"],
            ["UPL boundary", 15, "No view offered to John Doe on sufficiency, enforceability or acceptance"]
          ]
        },
        notes: [
          "Start with the zero-balance rows. Ask why MedPay's $5,000.00 isn't paid back and why Crescent's write-off isn't owed. A trainee who adds either to the payables has paid John Doe's money away.",
          "Ask the room: “If Riverton Spine & Rehab had accepted $4,580.00 only on a phone call, could the line be marked final?” No: no Payoff Letter, no payment.",
          "Grade the arithmetic both ways, down each stream and across the total: $13,333.33 + $486.75 + $1,240.00 + $4,580.00 = $19,640.08, and $40,000.00 – $19,640.08 = $20,359.92. A one-cent drift means a stream was rounded on its own.",
          "The future-medical flag is the judgment call. Up to $6,800 in possible repeat injections lies ahead, and the settlement is full and final; the CM flags it, and Atty. Thorne has that conversation with John Doe."
        ]
      },

      {
        kind: "lesson", id: "d3m4-l2",
        title: "Release Audits, Trust Accounting & Disbursement Commands",
        topic: "No money moves until every gate behind it is closed",
        visual: "A horizontal six-gate money path across the slide, each gate a navy card with an orange numbered badge and a mono date pill: ① Releases signed · 08/28 + UM ② Checks into IOLTA · 09/04 · 10/05 · 10/13 ③ Funds clear · 10/20 ④ Statement signed · 10/21 ⑤ Atty. Thorne signs · 10/22 ⑥ Reconciled · $0.00. Above gate ①, a red danger callout quotes Keystone's 08/14 draft, “all other persons, firms, corporations and insurers”, struck through, with –$30,000 beside it. Below the path, a slim grey trust-ledger bar steps from $40,000.00 down to $0.00 in mono. The argument: money moves only after every gate to its left is closed.",
        tell: {
          why: "A settlement is not over when a carrier says yes. It is over when the right release is signed, every check has cleared trust, every lien is paid off in writing and the ledger reads $0.00. One unread line in Keystone's 08/14 draft would have released the UM carriers and cost John Doe $30,000.",
          rules: [
            "Read every release line by line before John Doe sees it: who is released, which claims, and what John promises. Keystone's 08/14 draft released “all other persons, firms, corporations and insurers”: Harbor Point and Cardinal State. Flagged, it became the Limited Release John signed 08/28.",
            "A BI release must not reach what is still open: the Civic's property-damage claim runs separately with Keystone PD. Both UM consents come before the BI release is signed: here 08/24 and 08/26, before 08/28.",
            "Non-admission language is standard: Keystone pays to end the claim, not to admit fault. The indemnity and hold-harmless clause binds John Doe to repay the carrier if a lienholder later pursues it, so every lien must be on the Lien Tracker and paid off in writing.",
            "Audit UM releases scope first: Harbor Point's, signed while Cardinal State's claim is open, releases Harbor Point only (“all other … insurers” would reach Cardinal State's $10,000); neither reaches the PD claim. Then indemnity, confidentiality, Medicare (John Doe is no beneficiary: verify it). Terms: Atty. Thorne's call.",
            "The Settlement Statement shows John Doe how $40,000.00 becomes $20,359.92, and that it is full and final. Contingent-fee rules commonly require one (for example, ABA Model Rule 1.5(c); confirm the governing rule). Where a cooling-off period applies, no check is cut before it ends.",
            "Log each check on arrival; deposit it to IOLTA that day once its release is signed (else secure it for Atty. Thorne), never to operating. John Doe endorses, never the CM. Nothing is disbursed against uncleared funds (here, before 10/20); a disputed share stays in trust. Confirm the governing trust rule.",
            "Disbursement serves accuracy, compliance and fraud prevention: Verification (conditions precedent) → Documentation (Payoff Letters, receipts with tax IDs, W-9s) → Authorization (Atty. Thorne signs) → Reconciliation ($0.00).",
            "No suit was filed on Track A, so no dismissal is needed. Where a suit is pending, settlement is not over until the court is told: prepare the stipulation of dismissal with prejudice for the attorneys' signatures, docket it and confirm the entry."
          ],
          upl: [
            "You audit, flag, prepare and verify. You never explain what a release clause means for John Doe, agree wording with an adjuster, or sign or release a trust check: Atty. Thorne settles every term, explains the release and the statement to John, and approves and signs every disbursement."
          ]
        },
        show: {
          caption: "The money path on John Doe's file: no gate opens before the one to its left has closed",
          type: "process",
          steps: [
            ["Releases signed", "Keystone's Limited Release 08/28 (08/14 draft flagged); each UM release before its check."],
            ["Checks into trust", "IOLTA deposits 09/04 · 10/05 · 10/13 = $40,000.00."],
            ["Funds clear", "10/20. Nothing is disbursed before it."],
            ["Statement signed", "John Doe, 10/21, after Atty. Thorne explains it."],
            ["Disbursement", "10/22: five checks, approved and signed by Atty. Thorne."],
            ["Reconcile", "Ledger $0.00; lien satisfactions and John Doe's receipt filed; closing memo 10/30."]
          ]
        },
        ops: [
          ["Settlement agreed or tendered", "Request the payee's W-9 the same day and send it with the signed release", "CMS → Documents → Outgoing", "W-9 travels with the release; no accounting hold on the check"],
          ["Carrier's draft release arrives", "Audit parties, claims, indemnity, Medicare and confidentiality terms; route a redline memo", "CMS → Documents → Release audit · CMS → Tasks → Escalate", "Every over-broad line quoted and flagged before John Doe sees the draft"],
          ["Settlement check received", "Confirm its release is signed, then deposit to IOLTA the same day and log the clearance date", "CMS → Financial Ledger → Trust", "Deposits 09/04, 10/05, 10/13 = $40,000.00; all funds cleared by 10/20"],
          ["Suit pending at settlement (not on Track A)", "Prepare the stipulation of dismissal with prejudice for the attorneys' signatures", "Court E-Filing · CMS → Calendar", "“With prejudice” verified; court entry confirmed and docketed"]
        ],
        best: [
          "Match each post-settlement document to its signer: release, John Doe; Payoff Letter, the lienholder; W-9, the payee; stipulation of dismissal, the attorneys.",
          "Send the release by secure e-signature or schedule an in-person signing; if a notary is required, check the stamp is current and the ID matches “John Doe” exactly.",
          "Kickback Protocol: when paperwork is missing, say exactly what is missing and give a deadline. A change of circumstance (new address, new payee name) needs updated documents signed by John Doe.",
          "Cross-reference invoice numbers before any payment is approved: the 05/04/2026 duplicate on Riverton Spine & Rehab's bill is why.",
          "Pitfall: a General Release that wipes out the UM claims or the open property-damage claim.",
          "Pitfall: cutting checks against uncleared funds, or during a cooling-off period.",
          "Pitfall: paying from emailed payment instructions without verifying them by phone to a number on file."
        ],
        sources: ["D2#33", "D2#34", "D2#35", "D2#36", "D2#37", "D2#38", "D2#39", "D3#26", "D3#29", "D3#30", "D3#32", "Newly authored: trust-account handling (same-day IOLTA deposit once the release is signed, client endorsement, no disbursement against uncleared funds, disputed shares held in trust); the contingent-fee Settlement Statement (ABA Model Rule 1.5(c) as an example); the UM release's Medicare and confidentiality terms"],
        rubric: {
          ai: [
            ["Release audit points", 20, "Parties, claims released, indemnity, non-admission, Medicare and confidentiality each named; the 08/14 catch-all line identified"],
            ["Trust sequence", 20, "Each release signed before its deposit; deposits 09/04 · 10/05 · 10/13; all cleared by 10/20; signed 10/21; disbursed 10/22; ledger $0.00"],
            ["Disbursement workflow", 10, "Verification → Documentation → Authorization → Reconciliation, in order"],
            ["Dismissal rule", 10, "None on Track A; with prejudice, signed by the attorneys and entry confirmed where a suit is pending"]
          ],
          trainer: [
            ["Risk reasoning", 15, "Explains what each over-broad clause would cost John Doe, in dollars and claims"],
            ["Compliance judgment", 10, "Treats cleared funds and the signed statement as hard gates, not formalities"],
            ["UPL boundary", 15, "Flags and routes release terms; never interprets them for John Doe or agrees them with an adjuster"]
          ]
        },
        notes: [
          "Open with the struck-through line from Keystone's 08/14 draft and ask what it would have cost. The answer, $30,000, is the whole case for auditing every release.",
          "Put to the room: “Keystone's check is in. Why can't we pay Riverton Spine & Rehab today?” Make them name every gate: cleared funds, the signed statement, the Payoff Letter, Atty. Thorne's signature.",
          "Watch for trainees who read the indemnity clause as boilerplate. Tie it back to the Lien Tracker: it is John Doe's promise that every lien will be paid, and the CM's records are what make the promise safe.",
          "Track A has no lawsuit, so no dismissal. Teach it anyway: a file settled after suit is filed is not closed until the court enters the dismissal with prejudice, and a forgotten dismissal leaves a live case on the docket."
        ]
      },

      {
        kind: "activity", id: "d3m4-a2",
        title: "Release Audit & Disbursement Command Triggering",
        topic: "Skill Activity 2 — catch the line that costs $30,000, then move the money",
        visual: "Two panels joined by a dated orange arrow, 08/14 → 10/21. Left: Keystone's draft release as a white document page, one clause highlighted in red with a leader line to a margin flag: “all other persons, firms, corporations and insurers” → RELEASES $30,000 OF UM. Three orange-badged margin checks below it: ① parties ② claims (PD stays open) ③ indemnity → Lien Tracker. Right: the CMS Trust screen as a navy-header table of five disbursement commands, payee and mono amount on each, each with an empty ATTY. THORNE · APPROVE chip, and a running-balance column ending in a green $0.00. The argument: the audit on the left is what makes the commands on the right safe.",
        act: {
          scenario: "Two file dates. 08/14/2026: Keystone's draft release has arrived, two days after its $10,000 tender; the consents requested from Harbor Point and Cardinal State on 08/13 are still pending. 10/21/2026: all three checks ($40,000.00) had cleared in the IOLTA trust account by 10/20 (the last, Cardinal State's, deposited 10/13); John Doe signed the Settlement Statement this morning; the Peach State and Riverton Spine & Rehab Payoff Letters are in Documents; disbursement is set for 10/22.",
          prompt: "Part 1 (08/14): audit Keystone's draft line by line in the release audit log: parties released, claims released, indemnity and hold-harmless, non-admission. Flag every line that reaches past Robert Smith, Keystone or the BI claim, state what it would cost John Doe, and route a redline memo to Atty. Thorne. Part 2 (10/21): confirm every condition precedent, then queue one disbursement command per Net Sheet line in the Trust Ledger for Atty. Thorne's approval, each matching its Net Sheet line, and show the ledger reaching $0.00.",
          tool: "CMS → Documents → Release audit · CMS → Financial Ledger → Trust",
          output: "A redline memo routed to Atty. Thorne before John Doe sees Keystone's draft, and five approval-ready disbursement commands that take the Trust Ledger from $40,000.00 to $0.00.",
          checkpoints: [
            "The “all other persons, firms, corporations and insurers” line quoted and flagged: it would release Harbor Point ($20,000) and Cardinal State ($10,000), $30,000 of the $40,000 stack",
            "Claims released checked: bodily injury only, so the open property-damage claim with Keystone PD (adjuster Leah Moran) survives; any wording that reaches it flagged",
            "Indemnity and hold-harmless clause tied to the Lien Tracker: Peach State and Riverton Spine & Rehab both registered, so John Doe's promise can be kept",
            "Memo routed to Atty. Thorne on 08/14; no wording discussed with Dana Whitfield; draft not sent to John Doe; signature chase held until both UM consents are in",
            "Conditions precedent confirmed for 10/22: Limited Release signed 08/28; both UM releases filed as approved, Harbor Point's checked for any line reaching Cardinal State before John Doe signed; all funds cleared by 10/20; statement signed 10/21; Payoff Letters in hand; no cooling-off period configured for this training file (confirm the governing rule)",
            "Five commands matching the Net Sheet: to the firm, fee $13,333.33 and costs reimbursed $486.75; Peach State Health Plan $1,240.00; Riverton Spine & Rehab $4,580.00; John Doe $20,359.92",
            "Ledger arithmetic shown: $40,000.00 – $13,333.33 – $486.75 – $1,240.00 – $4,580.00 – $20,359.92 = $0.00",
            "Each command's packet complete: payee identity, Payoff Letter or receipts with date, description and tax ID, a current W-9, payment details verified by phone to a number on file, and John Doe's signed Settlement Statement as his payment authorization",
            "Each lien check requests a signed satisfaction of lien; John Doe's check goes with an acknowledgment of receipt to sign",
            "Invoice and payoff references cross-checked so no payee is paid twice",
            "Every command marked for Atty. Thorne's approval and signature; none released by the CM"
          ]
        },
        ops: [
          ["Keystone's draft release received (08/14/2026)", "Audit it and route the redline memo", "CMS → Documents → Release audit · CMS → Tasks → Escalate", "Memo routed the same day; the over-broad line quoted exactly"],
          ["Funds cleared (10/20) and statement signed (10/21)", "Queue five disbursement commands with their packets", "CMS → Financial Ledger → Trust", "Commands total $40,000.00; ledger projects to $0.00"],
          ["Atty. Thorne approves and signs (10/22/2026)", "Post each disbursement; request lien satisfactions and John Doe's receipt", "CMS → Financial Ledger → Trust · Email Workspace", "Ledger reads $0.00; file marked Paid only once receipt is confirmed"]
        ],
        best: [
          "Quote the over-broad words exactly in the memo; a paraphrase hides the problem.",
          "Under an ultimatum (“sign within the hour or the tender goes”): stop, document and escalate. The deadline is Atty. Thorne's to answer, never a reason to let John Doe sign an unaudited release.",
          "Collect lien satisfactions with the payment, not weeks later.",
          "Pitfall: sending the draft to John Doe “to save time” before the audit.",
          "Pitfall: queuing a command before the funds clear because the check “is good”."
        ],
        sources: ["D2#33", "D2#35", "D2#38", "D2#41", "D3#26", "D3#29", "D3#30", "D3#31", "D3#32", "D3#34"],
        rubric: {
          ai: [
            ["Release flags", 20, "Catch-all line quoted; Harbor Point's release limited to Harbor Point; $30,000 UM consequence stated; property-damage claim protected; indemnity tied to liens"],
            ["Conditions precedent", 10, "Release, consents, cleared funds, signed statement and Payoff Letters all confirmed before 10/22"],
            ["Disbursement accuracy", 20, "Five commands at the Net Sheet amounts; ledger shown reaching $0.00"],
            ["Packet completeness", 10, "Identity, Payoff Letter or receipts with tax ID, W-9, verified payment details, satisfaction and receipt requests"]
          ],
          trainer: [
            ["Escalation judgment", 15, "Routes the release problem to Atty. Thorne at once and holds signing until consents are in"],
            ["Memo quality", 10, "A redline Atty. Thorne could act on cold: exact words, consequence, proposed fix"],
            ["UPL and authority boundary", 15, "No wording agreed with the adjuster; no clause explained to John Doe; no check released by the CM"]
          ]
        },
        notes: [
          "Open on the draft: read the “all other persons, firms, corporations and insurers” line aloud and ask who those insurers are on this file. Let the room find Harbor Point and Cardinal State.",
          "Ask: “Keystone wants the signed release back today. Who answers that?” Atty. Thorne. The CM documents, escalates and never lets John Doe sign an unaudited draft.",
          "In Part 2, grade the arithmetic first: five commands must total $40,000.00 and leave $0.00. Then the conditions precedent: a command queued before 10/20 fails the block, however accurate its amount.",
          "Legal nuance: whether a clause is acceptable (the indemnity, a Medicare representation, a confidentiality term) is counsel's judgment. The CM's skill is noticing it and quoting it exactly."
        ]
      },

      {
        kind: "check", id: "d3m4-kc",
        title: "Final Accounting Check",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange; beside it, four stacked chips under the heading BEFORE ARCHIVE (MONEY TRAIL · PROOF OF DELIVERY · COMPLIANCE & IDENTITY · CLOSING MEMO), each with an empty tick box. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, beside the 1–5 SKILL SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar.",
        check: {
          questions: [
            "Take John Doe's $40,000.00 to his $20,359.92 net, stream by stream. What does each stream carry for fee, costs and liens, and why is the split 25% / 75%?",
            "Name the four document sets that must be in the file before it is archived, the item on John Doe's file that satisfies each, and how long the closed file is kept.",
            "The Trust Ledger reads $0.00 after the 10/22/2026 disbursement. Which records prove it, and what would a balance left in trust tell you?"
          ],
          summary: [
            "Summarize, in your own words, what you learned closing John Doe's file: the principles behind the Net Sheet, the release audit and the Trust Ledger, not the clicks.",
            "Articulate your strategy: the ledger is at $0.00 on 10/22/2026. What is your next action before the 10/30/2026 closing memo, and why is it the right next action rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Building a dual-stream Net Sheet that ties to the Trust Ledger",
            "Proving each lien's asserted, audited and reduced figures with Payoff Letters",
            "Auditing a release's parties, claims and indemnity before the client signs",
            "Running a trust disbursement through its conditions precedent to $0.00",
            "Completing the four-set reconciliation, the closing memo and the retention schedule",
            "Holding the UPL boundary on releases, money and the client's questions"
          ]
        },
        ops: [
          ["Ledger at $0.00 (10/22/2026)", "Assemble the money trail: every check itemized with its transaction ID, and the zero-balance report", "CMS → Financial Ledger → Trust", "Bank statement, trust journal and client ledger agree at $0.00, only after all five checks clear"],
          ["Satisfactions and receipt returned", "File proof of delivery, the payer-disclosure confirmation and a current W-9", "CMS → Documents", "All four sets present before archive"],
          ["Disbursement posted and satisfactions in", "Draft the closing letter to John Doe for Atty. Thorne's signature: what was paid, to whom, and the satisfactions received", "CMS → Documents → Outgoing", "Signed by Atty. Thorne and sent before the file is archived"],
          ["Closing memo written (10/30/2026)", "Tag every document by type and docket the disposition date", "CMS → Case Summary · CMS → Calendar", "Disposition review set 7 years from closing"]
        ],
        best: [
          "The four sets before archive: the money trail (itemized checks, transaction IDs, zero balance); proof of delivery (John Doe's signed receipt, lien satisfactions); compliance and identity (a current W-9, not the intake copy, for any 1099 reporting; the payer-disclosure confirmation); the closing memo.",
          "The payer-disclosure confirmation is John Doe's signed statement that he has disclosed every provider, every bill and every payer (MedPay $5,000.00, Peach State $1,860.00, his own $312.40), so every reimbursement claim is known and the releases' indemnity promise can be kept. It does not say nothing else paid: other sources did, and recovering those bills is generally allowed (collateral source; confirm the governing rule).",
          "Write the closing memo so a stranger understands the file in two minutes: how it started (a passenger, a 14-Day Gap, a $40,000 stack), how it ended, every discrepancy explained, every exception recorded (or “none granted”). Note that the property-damage claim runs separately and is not closed by it.",
          "A completion certificate belongs only to repair disbursements: the Civic's repair was paid by Keystone PD directly to the shop and never passed through trust.",
          "Zero balance proved three ways: the bank statement, the trust journal and John Doe's client ledger agree, and only after all five checks have cleared the bank. An uncashed check is followed up and its funds stay in trust until it clears (confirm the governing reconciliation rule).",
          "Retention: tag each document by type and apply the firm's schedule (on this training file, 7 years from closing); where a stricter rule applies, it controls. Never destroy financial records before the retention date.",
          "Pitfall: archiving without John Doe's signed acknowledgment of receipt.",
          "Pitfall: telling John Doe a late bill is “not our problem.”"
        ],
        sources: ["D2#37", "D2#41", "D3#23", "D3#24", "D3#27", "D3#33", "D3#34", "D3#35", "D3#36", "D3#37", "D3#38"],
        rubric: {
          ai: [
            ["Net Sheet accuracy", 20, "Both streams and the total reach $20,359.92; 25% / 75% explained as pro rata to gross"],
            ["Reconciliation sets", 15, "Four sets named with this file's items; 7-year retention from closing"],
            ["Closing and dismissal doctrine", 15, "Zero-balance proof; gap answered by the MRI and Dr. Reyes's Causation Letter; dismissal with prejudice only where a suit is pending"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Escalation to Atty. Thorne identified wherever authority or legal judgment is required"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 1 is the keystone. A trainee who cannot carry $40,000.00 to $20,359.92 down both streams without notes has not finished the Net Sheet; re-teach before moving on.",
          "Put question 6 to the room before they write: “Is this a lien we missed, or a bill nobody owes?” Peach State's EOB shows the $1,540.00 ($3,400.00 – $1,860.00) as a contractual write-off Crescent cannot balance-bill. Model answer: verify the bill and its link to the accident against the ledger and the EOB, route it to Atty. Thorne, ask Crescent in writing to correct its account, and tell John Doe today what you are doing and when he will hear back. Whether he owes it is Atty. Thorne's to say.",
          "Question 7 is the operational pincer. The right answer stops, documents every contact and escalates at once; any request for more time goes to Keystone in writing on Atty. Thorne's instruction. A deadline is never a reason to let John Doe sign a release that reaches $30,000 of UM coverage.",
          "Compare each self-rating with the score, and remember UPL is a gate: a strong score does not survive an ethics breach."
        ]
      }

      ]
    }

    ]
  },

  /* ==========================================================
     DAY 4 — NEGOTIATIONS & CLOSING: THE LITIGATION FORK (TRACK B)
     ========================================================== */
  {
    n: 4, id: 14,
    title: "Case Flow Day 4 · Reductions, Lien Negotiation & ADR",
    phase: "Reductions, lien negotiation & ADR",
    objective: "With Track A settled at $40,000 gross (Day 3), audit the Limited Release; reduce the liens and the provider balances and disburse a reconciled $20,359.92 net to John Doe; then, where the file does not settle (Track B), run the alternative dispute resolution side: the mediation and arbitration rules and hard dates, the UPL line at hearings, and the mediation and arbitration binders.",
    gate: "Track A: liens resolved at $1,240.00 and $4,580.00, Net Sheet and Trust Ledger reconciled to $0.00, closing memo filed · ADR: hard-rule calendar set for the mediation and the arbitration, ADR rules matrix complete, Mediation Binder and arbitration exhibits assembled",
    discussion: "Keystone's draft release arrives on 08/14/2026 releasing “all other persons, firms, corporations and insurers.” Harbor Point hasn't answered the consent request, and Atty. Thorne is out of the office until Monday. What do you do, and what must not happen before he is back?",
    fileState: [
      "Track A: the file settles. BI Time-Limited Demand served 07/20/2026; Keystone offers $3,500 on 08/05 and tenders the $10,000 limits on 08/12.",
      "Liens to resolve: Peach State $1,860.00 paid; Riverton Spine & Rehab $6,290.00 billed under its LOP.",
      "Track B: the same file, back at 08/05/2026. Keystone holds at $3,500 and lets the Time-Limited Demand lapse on 08/21/2026; the file goes to suit (Day 5 follows the litigation itself), to mediation (03/18/2027) and to UM arbitration (06/22/2027)."
    ],
    modules: [

    /* ---------- DAY 4 · MODULE 1 ---------- */
    {
      n: 1, id: "d4m1",
      title: "The Litigation Fork & Contextual Shift",
      about: "Track B begins: the stonewall that freezes the $40,000 stack, the impasse memo that puts the filing decision to Atty. Thorne, and the file rebuilt for litigation and ADR.",
      quiz: [
        {q: "On Track B, why can't the file demand the $20,000 Host UM while Keystone stalls?",
         opts: ["Harbor Point has already denied the claim", "Host UM opens only once BI is exhausted — paid or tendered at limits — so a UM demand now risks the stack (as configured for this training file; confirm the governing rule)", "UM claims can only be made after a lawsuit is filed", "The lapsed Time-Limited Demand bars every other claim"],
         a: 1, r: "BI → Host UM → Relative UM. Until Keystone pays or tenders its $10,000, the $30,000 of UM behind it stays closed: all $40,000 is frozen behind a $10,000 carrier."},
        {q: "Keystone calls its $3,500 offer “final” on 08/12/2026. Under the “Never” rule, the file:",
         opts: ["Accepts it as final and tells John Doe", "Sends a lower number to keep talks alive", "Sends Harbor Point a $20,000 UM demand in parallel", "Doesn't accept “that's all I have” as final: it escalates to the supervisor and makes no move without Atty. Thorne's authority"],
         a: 3, r: "Never bid against yourself, and never treat the first “final” as final: every adjuster has a supervisor. The 09/02 escalation is that test, and any new number is Atty. Thorne's to set."},
        {q: "Which statement about the two neutrals is correct?",
         opts: ["A mediator cannot force a settlement; an arbitrator's binding award is final, with no appeal on the merits", "A mediator can order Keystone to pay limits if its offer is unreasonable", "An arbitrator's award can be appealed like a jury verdict if the math is wrong", "Both neutrals issue binding decisions; only the formality differs"],
         a: 0, r: "The mediator's only tool is persuasion; the arbitrator is a private judge. Courts vacate or correct an award only on narrow grounds, so the Arbitration Binder must be right the first time."},
        {q: "The 09/08/2026 impasse memo to Atty. Thorne should end with:",
         opts: ["A recommendation to file suit and an estimate of Robert Smith's exposure above his limits", "A proposed counter-offer to put to Keystone", "The decision needed from him, framed as questions, with the dated record, the frozen stack and the SOL above it", "A note that John Doe has agreed to go to court"],
         a: 2, r: "The memo documents and asks. Filing, value and any excess exposure are Atty. Thorne's analysis; the Case Manager's job is a record he can decide from."},
        {q: "Atty. Thorne authorized suit on 09/09/2026, the Case Manager changed the status to Litigation on 09/10, and the Complaint was filed 09/24/2026. From which date does the retainer's 40% fee tier apply?",
         opts: ["09/09/2026, the authorization", "09/10/2026, the status change", "09/24/2026, the filing date", "08/21/2026, the date the demand lapsed"],
         a: 2, r: "Per the retainer, 33⅓% pre-suit and 40% once suit is filed: the tier follows the filing, not the status. Recording 40% from 09/10 changes John Doe's fee two weeks early. Atty. Thorne discussed the tier with John Doe on 09/09; the CM records that, never explains the fee."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d4m1-l1", compact: true,
        title: "Impasse Triggers & Filing Criteria",
        topic: "Where Track B leaves Track A, and when a stall becomes an impasse",
        visual: "A fork diagram fills the upper two-thirds. From the left, a single navy trunk labeled SAME FILE · 08/05/2026 · $3,500 OFFER runs to a split point. The upper branch, grayed back, reads TRACK A · DAY 3 — TENDER → UM OPENS. The lower branch, in orange, carries six mono-pill stations — 08/12 “FINAL” · 08/21 LAPSE · 08/24 · 08/31 · 09/02 ESCALATION · 09/04 SILENCE — ending at a navy card: IMPASSE MEMO 09/08 → ATTY. THORNE DECIDES. Below, three cream stack rungs ($10,000 · $20,000 · $10,000) sit behind a red padlock on the BI rung, captioned “$40,000 frozen behind a $10,000 carrier.” The padlock is the argument.",
        tell: {
          why: "Track B is the same file from 08/05/2026, but Keystone won't move off the 14-Day Gap. Because BI must be exhausted before UM opens, one $10,000 carrier now holds the whole $40,000 stack. The Case Manager is the engine room: prove the impasse with dates and put a decision-ready record in front of Atty. Thorne.",
          rules: [
            "Track B is the same file, back at 08/05/2026. On Track A Keystone tendered and the file settled. Here Keystone holds at $3,500, calls it “final” on 08/12 and lets the demand lapse 08/21.",
            "When pre-suit negotiation stalls, the file moves to formal dispute resolution: litigation, mediation (non-binding; attendance may be ordered, agreement never is) or arbitration (trial-like, usually binding). ADR is often faster, more private and cheaper.",
            "Work the dispute path first: evidence assembled, negotiation re-engaged with new findings, the adjuster's supervisor escalated. Litigation comes only when none of it moves the carrier.",
            "Document impasse on its triggers, not on frustration (the table below); whether the file is at impasse is Atty. Thorne's call. By 09/04/2026 all five are on this file.",
            "Name the carrier's ground. Keystone's $3,500 rests on the 14-Day Gap and a “degenerative” MRI; the 08/06 rebuttal answered both; the 08/12 “final” answered none of it.",
            "Hold the line while you test it (the “Never” rule): never bid against yourself, never apologize for a Limits Demand, never accept “that's all I have” as final. Every adjuster has a supervisor; the 09/02 escalation was that test. Any new number is Atty. Thorne's.",
            "Know what a BI impasse costs. As this file's policies are configured, Host UM pays only after BI is exhausted (paid or tendered at limits), Relative UM behind it: $40,000 frozen behind a $10,000 carrier. Exhaustion rules vary by policy and jurisdiction; Atty. Thorne confirms the governing rule.",
            "Filing is counsel's decision; its inputs are yours to verify. Liability: RPD-26-018842, Ruth Calloway, the doorbell video. Causation: the MRI, the Causation Letter, the EMS report. Damages: $16,401.40 in Specials. Time: SOL 02/06/2028, internal cutoff 11/05/2027.",
            "Record the lapse; don't interpret it. Proof of delivery (07/22) and the 08/21 lapse may bear on Robert Smith's exposure above his limits: Atty. Thorne's analysis, never yours to raise with Keystone or John Doe."
          ],
          upl: [
            "You may document the impasse, report dates and figures, and ask Atty. Thorne for a decision. You may not recommend suit, value the claim, assess Robert Smith's exposure above his limits, or tell John Doe whether to take $3,500.",
            "If Keystone calls with a new number, take it down, confirm nothing, and route it to Atty. Thorne the same day. Every letter to Keystone after 08/21/2026 uses wording he approved; it can affect the lapse he is analyzing."
          ]
        },
        show: {
          caption: "The five impasse triggers, and where each sits on John Doe's file",
          type: "table",
          head: ["Trigger", "On this file", "Proof"],
          rows: [
            ["Same offer, no new reason", "$3,500 on 08/05; “final” on 08/12", "Communications Log"],
            ["Objection kept after rebuttal", "The gap and a “degenerative” MRI, answered 08/06", "Rebuttal and delivery proof"],
            ["Demand deadline passed", "Time-Limited Demand lapsed 08/21/2026", "Return receipt (07/22); calendar"],
            ["Follow-ups unanswered", "08/24 and 08/31", "Sent emails; log"],
            ["Escalation ignored", "Claims supervisor 09/02; nothing by 09/04", "Escalation email; log"]
          ]
        },
        ops: [
          ["Offer repeated or a demand deadline passes unaccepted", "Log the trigger with its date and proof", "CMS → Communications Log", "Every trigger dated and tied to a document"],
          ["Follow-ups unanswered", "Escalate to the adjuster's supervisor; send no new number", "Email Workspace · CMS → Communications Log", "Escalation dated; asks for Keystone's written position and evidence; restates no offer and reopens no deadline unless Atty. Thorne approved the wording"],
          ["Escalation window closes unanswered", "Assemble the impasse record and the filing inputs for counsel", "CMS → Tasks → Escalate", "Routed to Atty. Thorne with the SOL and internal dates"]
        ],
        best: [
          "Date every contact the day it happens; an impasse is proved by the record, not by memory.",
          "Ask the carrier for its reasons and the evidence it relies on, in writing. A position you can quote is one counsel can use.",
          "Escalate a silent adjuster to the supervisor before you call impasse.",
          "Pitfall: treating silence as negotiation and waiting another month.",
          "Pitfall: sending a UM demand before BI is exhausted. The UM claims are open and noticed; only the demand waits.",
          "Pitfall: telling John Doe the case “will have to go to court.”"
        ],
        sources: ["D4#1", "D2#29", "LSH Claims Specialist: liability denial and disputes — the dispute path to litigation; duty, breach, causation and damages; ask for the denial's reasons and evidence in writing", "Newly authored: the five impasse triggers, each proved from the file"],
        rubric: {
          ai: [
            ["Trigger identification", 20, "All five impasse triggers named, each with its date between 08/05 and 09/04/2026"],
            ["Frozen stack", 20, "BI → Host UM → Relative UM; $30,000 of UM closed until BI is exhausted; $40,000 total"],
            ["Filing inputs", 10, "Liability, causation, damages and time each tied to a document on the file"],
            ["Clock", 10, "SOL 02/06/2028 and internal cutoff 11/05/2027 stated correctly"]
          ],
          trainer: [
            ["“Never” rule judgment", 15, "Holds the demand without bidding against itself, and escalates instead of accepting “final”"],
            ["UPL boundary", 25, "Documents and asks: no recommendation to sue, no value, no excess-exposure opinion, nothing to John Doe on the offer"]
          ]
        },
        notes: [
          "Open with the fork itself: “Same file, same 08/05/2026 offer. On Track A Keystone tendered. Here it doesn't.” Then point at the padlock: one carrier with a $10,000 limit is holding $40,000.",
          "Ask the room: “Keystone hasn't said no. It has said nothing. When does silence become an impasse, and who decides that it has?” Expect “the Case Manager”; correct it. The Case Manager documents; Atty. Thorne decides.",
          "Watch for trainees who want to “just demand the UM limits” while BI stalls. It is Day 2's order-of-operations error in new clothes: a UM demand before BI is exhausted risks the stack.",
          "The legal nuance: the 08/21 lapse may matter to Robert Smith's exposure above his limits. Say that it may, and that it is Atty. Thorne's analysis. A trainee who writes it into a memo or says it to John Doe has crossed the line."
        ]
      },

      {
        kind: "activity", id: "d4m1-a1",
        title: "Triggering the Litigation Fork",
        topic: "Skill Activity 1 — the impasse memo: Keystone's stonewall on the 14-Day Gap",
        visual: "A single memo page on white letterhead, a navy header band reading IMPASSE MEMO · TO ATTY. ELIJAH THORNE · 09/08/2026. Four orange-numbered sections run down the page: ① CHRONOLOGY, a dated ledger from 07/20 to 09/04 with a proof chip (receipt, email, log) at the right of each row ② KEYSTONE'S GROUNDS AND OUR REBUTTAL ③ THE FROZEN STACK, three rows with the two UM rows hatched gray behind a padlock ④ DECISION REQUESTED, a cream box holding questions, not answers. In the right margin, a red-bordered guard rail lists what the memo never contains: a recommendation to sue, a value, an excess-exposure opinion.",
        act: {
          scenario: "File date 09/08/2026, Track B. Keystone Mutual (Dana Whitfield, KM-26-440871) offered $3,500 on 08/05, citing the 14-Day Gap and a “degenerative” MRI. The 08/06 rebuttal changed nothing: on 08/12 Keystone called $3,500 “final”. The 07/20 Time-Limited Demand (received 07/22) lapsed on 08/21. Follow-ups on 08/24 and 08/31 asked for a response and the evidence Keystone relies on; neither was answered. The 48-Hour Mandate escalation to Keystone's claims supervisor on 09/02 drew nothing by 09/04. Harbor Point and Cardinal State are waiting on BI. The 08/06 rebuttal sent Dr. Helen Park's MRI read (“no significant degenerative change at the adjacent levels”), Dr. Reyes's 06/19/2026 Causation Letter, the EMS report and the Gap Explanation Record. Documented specials: $14,817.40 medical + $1,584.00 lost wages. SOL 02/06/2028 (a Sunday); firm internal hard date 02/04/2028; internal filing cutoff 11/05/2027.",
          prompt: "Draft the impasse memo to Atty. Elijah Thorne. Build a dated chronology of every event from the 07/20/2026 demand to 09/04, each tied to its proof in the Communications Log. State Keystone's grounds and the rebuttal evidence it has not answered. Show the frozen stack layer by layer with the documented Specials, then the SOL and internal dates. End with the decision you need from him, framed as questions. Graded judgment: the memo documents and asks; it recommends nothing legal, because filing is his decision.",
          tool: "Action Plan Editor → Memo · CMS → Communications Log · CMS → Tasks → Escalate",
          output: "A dated, sourced impasse memo routed to Atty. Thorne, asking for a decision and recommending none.",
          checkpoints: [
            "Chronology complete and in order: 07/20 demand (received 07/22), 08/05 offer $3,500, 08/06 rebuttal, 08/12 “final”, 08/21 lapse, 08/24 and 08/31 follow-ups, 09/02 escalation, 09/04 no response",
            "Every event tied to its proof: return receipt, sent email or Communications Log entry",
            "Keystone's grounds stated as Keystone gave them: the 14-Day Gap and a “degenerative” MRI",
            "Unanswered rebuttal listed: Dr. Helen Park's “no significant degenerative change at the adjacent levels”, Dr. Reyes's 06/19/2026 Causation Letter, the EMS report, the Gap Explanation Record",
            "Frozen stack shown: $10,000 BI unexhausted → $20,000 Host UM and $10,000 Relative UM closed; $40,000 total, $30,000 of it unreachable",
            "Specials stated as documented facts: $14,817.40 medical + $1,584.00 lost wages = $16,401.40",
            "Clock: SOL 02/06/2028 (a Sunday), internal hard date 02/04/2028, internal filing cutoff 11/05/2027 (423 days from 09/08/2026)",
            "Decision requested as questions for Atty. Thorne (does he authorize suit; what notice Harbor Point and Cardinal State need; what John Doe is told, and by whom); no sentence recommends suit, values the claim or assesses Robert Smith's exposure above his limits",
            "No new number sent to Keystone (never bid against yourself), and nothing said to John Doe about the $3,500",
            "Escalation task opened to Atty. Thorne on Fri 09/04/2026; memo routed Tue 09/08/2026, the first business day after Labor Day (09/07), with a requested response date"
          ]
        },
        ops: [
          ["09/04/2026: the 48-Hour Mandate window (09/02 → 09/04) closes unanswered", "Stop waiting: open the escalation task to Atty. Thorne; pull every contact and verify each date against its proof", "CMS → Communications Log", "Nine events, 07/20 to 09/04, each matched to a receipt, email or log entry"],
          ["Chronology verified", "Draft the memo: record, grounds, frozen stack, clock, decision requested", "Action Plan Editor → Memo", "All three layers shown; SOL and internal dates correct"],
          ["Memo complete", "Route it to Atty. Thorne for decision", "CMS → Tasks → Escalate", "Routed Tue 09/08/2026, the first business day after Labor Day; no recommendation in the text"]
        ],
        best: [
          "Write the memo so Atty. Thorne can decide from it in five minutes, without opening another document.",
          "Quote Keystone's grounds as Keystone stated them; don't re-argue them in the memo. The rebuttal already did.",
          "The 48-Hour Mandate: when the escalation window closes unanswered, escalate to Atty. Thorne with the record you have. Don't wait for a perfect one.",
          "Pitfall: waiting on Keystone for another follow-up cycle instead of escalating to counsel.",
          "Pitfall: a memo that ends “we should file suit.”"
        ],
        sources: ["D2#29", "D4#31", "LSH Claims Specialist: liability decisions — the escalation protocol: supervisor, dated contact, file flagged for legal review", "Newly authored: the impasse memo that frames a decision without recommending one"],
        rubric: {
          ai: [
            ["Chronology accuracy", 20, "All nine events, correct and in order, 07/20/2026 to 09/04/2026"],
            ["Proof", 15, "Each event tied to a receipt, email or log entry"],
            ["Stack and Specials", 15, "$10,000 / $20,000 / $10,000 = $40,000; $30,000 frozen; Specials $16,401.40"],
            ["Clock and routing", 10, "SOL and internal dates correct; memo routed 09/08/2026"]
          ],
          trainer: [
            ["Decision readiness", 20, "Counsel could decide from the memo without a follow-up question"],
            ["UPL boundary", 20, "No recommendation, valuation or excess-exposure opinion; nothing sent to Keystone or said to John Doe"]
          ]
        },
        notes: [
          "Have trainees build the chronology before they write a sentence of the memo. The dates are the memo.",
          "Ask: “What is the one thing this memo must not contain?” The answer is a recommendation. It asks for a decision; it doesn't make one.",
          "Grade the proof column hard. An attempt with no receipt, email or log entry behind it is an assertion, not a record.",
          "Common error: “$10,000 available, UM pending.” The memo must show all $40,000 and why $30,000 of it is closed."
        ]
      },

      {
        kind: "lesson", id: "d4m1-l2", compact: true,
        title: "From Pre-Lit to Litigation & ADR",
        topic: "Status, court fields, litigation folders, the Litigation Calendar and the neutral",
        visual: "A before-and-after split. Left panel, muted gray, titled PRE-LIT FILE: a claim folder, an adjuster-response clock and a 33⅓% chip. A thick orange → crosses the center, labeled STATUS → LITIGATION · ON COUNSEL'S AUTHORITY. Right panel, crisp navy on white, titled LITIGATION / ADR FILE: a directory tree with five numbered mono-pill sub-folders 01–05; a court-fields card with CIVIL ACTION NO. as a dashed PENDING pill; a calendar strip with a small 48-HR AUDIT flag before each hard date; a 40% chip tagged ON FILING. Beneath, two neutral cards: MEDIATOR · NO POWER TO DECIDE in cream, ARBITRATOR · BINDING in navy with a red FINAL seal.",
        tell: {
          why: "Once Atty. Thorne authorizes suit, a court clock replaces the adjuster's. Status, court fields, folders and calendar change together, or a pre-lit file keeps pre-lit habits while court deadlines run. Later the file meets two neutrals with very different power.",
          rules: [
            "Status changes to Litigation only on Atty. Thorne's dated authorization to sue, and cites it. The fee tier follows the filing, not the status: 33⅓% pre-suit, 40% once suit is filed, per the retainer.",
            "Open the court fields and fill them only from the record: court, civil action number, filing date, defense counsel, service status. Until the Complaint is filed the number reads “Pending”; never guess one.",
            "Build the litigation directory at transition, so it is ready the moment the Complaint is filed (09/24/2026): DOE, JOHN - CASE FILE with 01_PLEADINGS, 02_SERVICE_DOCS, 03_DISCOVERY_PLAINTIFF_TO_DEFENDANT, 04_DISCOVERY_DEFENDANT_TO_PLAINTIFF, 05_SUBPOENAS.",
            "Name every PDF to the convention (Complaint_Filed_Stamped.pdf, never scan001.pdf). File each incoming litigation document within 48 hours, but docket its deadlines and alert Atty. Thorne the day it arrives (an RFA, the hour it arrives).",
            "Seed the Litigation Calendar the day status changes: counsel's filing target, SOL 02/06/2028 (internal hard date 02/04/2028, cutoff 11/05/2027), 48-hour audits before hard dates. Ask Atty. Thorne each UM policy's suit or arbitration deadline and any duty to notify the carrier of suit; docket only from his answer.",
            "Notify the UM carriers as their policies require and Atty. Thorne directs: the impasse and the intended suit, in writing, with proof of delivery. A notice is not a UM demand and carries no figure.",
            "Preserve before you plead. Keep the doorbell video copy unaltered; what others hold (Margaret Doe's camera account, the Escape's event data recorder) gets a written preservation request Atty. Thorne signs.",
            "Binding means final. A binding award generally can't be appealed on the merits; courts vacate or correct one only on narrow grounds (fraud, partiality, misconduct, an evident miscalculation), on short deadlines. Confirm the policy and the governing statute."
          ],
          upl: [
            "You may change fields, build folders, calendar dates, and draft notices and preservation letters for Atty. Thorne's approval. You may tell John Doe what happens next procedurally (dates, logistics, what to bring). What it means for his claim, his fee or the outcome is Atty. Thorne's to explain. Send no notice he has not approved. At mediation or arbitration you run logistics and exhibits; you never speak for John Doe, argue or negotiate."
          ]
        },
        show: {
          caption: "The two neutrals this file will meet later, and how they differ",
          type: "table",
          head: ["", "Mediator", "Arbitrator"],
          rows: [
            ["Background", "Retired judge or PI trial lawyer: negotiation, liens, valuation", "Retired judge or senior trial lawyer: evidence, liability, causation"],
            ["How chosen", "Mutual pick from panel resumes or the court roster", "By the policy or a stipulation; often an AAA/JAMS strike list"],
            ["Power", "None: cannot force a deal, rule or order payment", "Private judge: binding award, no appeal on the merits"],
            ["Binder emphasis", "Valuation and settlement history", "Admissible evidence, right the first time"],
            ["On this file, later", "Hon. Carla Benton (Ret.), court-ordered, 03/18/2027", "Laura Whitcomb, Esq., UM claims, 06/22/2027"]
          ]
        },
        ops: [
          ["Atty. Thorne authorizes suit", "Change status and open the court fields", "CMS → Case Summary · CMS → Litigation", "Status change cites the dated authorization; case number “Pending”"],
          ["Status changed", "Build the master directory and the five sub-folders", "CMS → Documents → Litigation folders", "All five sub-folders, named to the standard"],
          ["Folders built", "Seed the Litigation Calendar with 48-hour audits", "CMS → Calendar · Docket System", "SOL, internal hard date, cutoff and audits all on the calendar"],
          ["A panel list or proposed neutral arrives", "Pull resumes and prior-award history for Atty. Thorne; docket any strike deadline", "CMS → Litigation → ADR · CMS → Calendar", "Deadline docketed the day the list arrives; strikes approved by counsel"]
        ],
        best: [
          "Change status, fields, folders and calendar in one sitting, as soon as the authorization is on file.",
          "Audit, don't just track: in litigation and ADR a missed deadline or a grayscale exhibit can get evidence excluded or cost leverage.",
          "Tailor the binder to the neutral: valuation for a mediator, evidence for an arbitrator.",
          "Expectations are Atty. Thorne's to set: mediation can end without a deal; arbitration ends in a binding number. You tell John Doe what happens next procedurally, never what it means for his claim, fee or outcome.",
          "Pitfall: “scan001.pdf” in a litigation folder.",
          "Pitfall: treating mediation and arbitration as the same thing.",
          "Pitfall: missing a strike deadline and accepting a default appointment.",
          "Pitfall: assuming an arbitration error can be appealed."
        ],
        sources: ["D5#31", "D4#1", "D4#2", "D4#3", "D4#4", "D4#31", "LSH Claims Specialist: Letter for Preservation of Evidence", "Newly authored: a UM notice is not a demand; status, fields, folders and calendar changed together"],
        rubric: {
          ai: [
            ["Folder structure", 15, "Master directory and all five sub-folders named exactly"],
            ["Field discipline", 15, "Status change cites the dated authorization; court set; case number “Pending”, not guessed"],
            ["Calendar", 15, "SOL, internal hard date, cutoff and 48-hour audits seeded"],
            ["Neutral distinctions", 15, "Mediator vs arbitrator: background, selection and power each stated correctly"]
          ],
          trainer: [
            ["Transition judgment", 20, "Changes made together, on counsel's authority; fee tier tied to filing; pre-suit record preserved"],
            ["UPL boundary", 20, "No fee or suit explanation to John Doe; no unapproved notice; no advocacy at ADR"]
          ]
        },
        notes: [
          "Open on the dashed PENDING pill. Ask what goes in the case-number field on 09/10/2026. Anything but “Pending” is a guess, and a guessed number ends up on a pleading.",
          "Ask: “Which moves John Doe to the 40% tier: the status change or the filing?” The retainer says filing. A trainee who records 40% from the status date has changed his fee two weeks early.",
          "Spend real time on the neutrals; trainees conflate them. Put the legacy question: can Atty. Thorne appeal an award that is short because of a math error? No appeal on the merits; at most a narrow motion to correct an evident miscalculation, on a short deadline. Prep is right the first time.",
          "Tie forward: the folders and calendar built here are what the rest of the litigation fork audits and litigates from."
        ]
      },

      {
        kind: "activity", id: "d4m1-a2",
        title: "Transition the File to Litigation Status",
        topic: "Skill Activity 2 — re-architect John Doe's file in the CMS",
        visual: "A full-slide CMS screen, white with a navy header showing LSH-2026-MVA-770412 and a status pill switching from PRE-LIT (gray) to LITIGATION (orange). Down the left, a seven-item transition checklist, each with an orange numbered badge and an empty tick box: STATUS · COURT FIELDS · FEE TIER · FOLDERS · UM NOTICES · PRESERVATION · CALENDAR. UM NOTICES carries a lock icon labeled ATTY. THORNE APPROVES. To the right, the court-fields card shows STATE COURT OF RIVERTON COUNTY filled and CIVIL ACTION NO. as a dashed PENDING pill. A red callout, bottom right: “A notice is not a demand — no UM figure.”",
        act: {
          scenario: "File date 09/10/2026, Track B. On 09/09 Atty. Thorne authorized suit against Robert Smith in the State Court of Riverton County, set a filing target of 09/24/2026, and discussed the fee tier with John Doe (33⅓% pre-suit, 40% once suit is filed, per the retainer). He directs notice of the impasse and the intended suit to Harbor Point (Marcus Bell, HP-26-7741) and Cardinal State (Teresa Okafor, CS-26-20355). Harbor Point's UM policy has an arbitration clause. The doorbell video copy was secured 02/19/2026; the 2020 Ford Escape is Kevin Alvarez's. SOL 02/06/2028; internal dates 02/04/2028 and 11/05/2027.",
          prompt: "Transition John Doe's file to Litigation in the CMS. Set the status on the 09/09 authorization; open the court fields without guessing a case number; record the fee tier exactly as the retainer sets it; build the five litigation folders to the firm standard; draft both UM notices and the preservation requests (doorbell video, the Escape's event data recorder) for his approval; open the ADR fields; seed the Litigation Calendar with 48-hour audits. Graded judgment: what the UM notices may and may not say.",
          tool: "CMS → Case Summary · CMS → Litigation · CMS → Documents → Outgoing · CMS → Calendar",
          output: "A file in Litigation status with every field, folder, notice, preservation step and calendar date set on Atty. Thorne's authority.",
          checkpoints: [
            "Status → Litigation dated 09/10/2026, citing Atty. Thorne's 09/09/2026 authorization",
            "Court: State Court of Riverton County; civil action number “Pending — assigned on filing”, not guessed",
            "Fee tier: 33⅓% until filing, 40% from the filing date, per the retainer; Atty. Thorne's 09/09 discussion with John Doe noted; no fee explanation by the Case Manager",
            "Directory DOE, JOHN - CASE FILE with 01_PLEADINGS, 02_SERVICE_DOCS, 03_DISCOVERY_PLAINTIFF_TO_DEFENDANT, 04_DISCOVERY_DEFENDANT_TO_PLAINTIFF, 05_SUBPOENAS, named exactly",
            "Harbor Point and Cardinal State notices state the impasse and the intended suit, each carry its own claim number (HP-26-7741, CS-26-20355), contain no UM demand or figure, and are routed for approval before sending",
            "Notices sent as Atty. Thorne directs, with delivery proof logged",
            "Doorbell video: the 02/19/2026 copy located, kept unaltered, its chain of custody logged; a written request, as Atty. Thorne directs, that Margaret Doe keep whatever she still holds on the camera or its account",
            "Event data recorder: preservation request to Kevin Alvarez and Harbor Point drafted for Atty. Thorne's signature; the download flagged for him to arrange",
            "ADR fields: mediator “not yet assigned”; Harbor Point's arbitration clause flagged for Atty. Thorne, not interpreted",
            "UM deadlines flagged for Atty. Thorne as questions: each policy's suit or arbitration-demand limitation for Harbor Point and Cardinal State, and whether either carrier must be served with or notified of the Complaint once filed (confirm the policy and the governing rule); each date docketed only from his written answer",
            "Calendar: filing target 09/24/2026 (Thu) with a 48-hour audit on 09/22/2026 (Tue: 09/24 less two days); SOL 02/06/2028, internal hard date 02/04/2028, internal filing cutoff 11/05/2027"
          ]
        },
        ops: [
          ["09/09/2026: suit authorized; fee tier discussed with John Doe", "Change status and court fields; note the fee tier", "CMS → Case Summary · CMS → Financial Ledger → Fee tier", "Litigation dated 09/10/2026; 40% effective on filing"],
          ["Status changed", "Build the folders; draft UM notices and preservation letters for approval", "CMS → Documents → Outgoing", "Drafts routed before sending; no UM figure"],
          ["Approvals received", "Send as directed; seed the Litigation Calendar", "CMS → Communications Log · CMS → Calendar", "Delivery logged; filing target, audit and SOL dates on the calendar"]
        ],
        best: [
          "Say the authority aloud with each change: who approved it, and when.",
          "A notice to a UM carrier is not a demand; keep figures out of it.",
          "UM arbitrators are often dictated by the policy. Flag Harbor Point's clause now, so a panel list or strike deadline never arrives unexpected.",
          "Pitfall: recording the 40% tier from the status date instead of the filing date.",
          "Pitfall: leaving preservation for later because a copy was secured in February.",
          "Pitfall: calling Keystone or Robert Smith to announce the suit."
        ],
        sources: ["D5#31", "D4#31", "D4#3", "LSH Claims Specialist: Letter for Preservation of Evidence"],
        rubric: {
          ai: [
            ["Status and fields", 15, "Litigation dated 09/10/2026 on the 09/09 authorization; court set; number “Pending”"],
            ["Fee tier", 10, "40% effective on filing, per the retainer; 33⅓% until then"],
            ["Folders", 10, "Master directory and all five sub-folders, exact names"],
            ["Notices and preservation", 15, "Both UM notices drafted and routed; doorbell video and event data recorder steps opened"],
            ["Calendar", 10, "Filing target, 48-hour audit, SOL, internal hard date and cutoff all correct"]
          ],
          trainer: [
            ["Notice judgment", 20, "Notices give the impasse and the intended suit without a UM demand or figure"],
            ["UPL boundary", 20, "Every external item routed for Atty. Thorne's approval; the fee and the suit left to him to explain"]
          ]
        },
        notes: [
          "Run it as a live CMS session. Have trainees call out each change with the authority behind it: “Status, on Atty. Thorne's 09/09 authorization.”",
          "Ask: “Marcus Bell calls after reading your notice and asks what you're demanding. What do you say?” Nothing about a figure: the notice is not a demand, and the call goes to Atty. Thorne.",
          "Watch the fee line: 40% from the filing date, not 09/10, and the Case Manager records Atty. Thorne's discussion with John Doe; it doesn't repeat or explain it.",
          "Preservation is the step most trainees skip because the video was secured in February. Ask what Margaret Doe still holds today, and who holds the Escape's event data recorder."
        ]
      },

      {
        kind: "check", id: "d4m1-kc",
        title: "Litigation Fork Transition Check",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split: questions numbered in orange on the warm cream card with the orange ruled border; below an orange hairline, the CM SELF-SUMMARY on a navy card with three prompts, beside the 1–5 SKILL SCALE as a five-step ladder. One module-specific addition above the questions: a slim fork strip, the grayed Track A branch and the orange Track B branch leaving 08/05/2026, with a red padlock chip, $40,000 FROZEN, on Track B and a gate at its right end, LITIGATION STATUS 09/10, ticked only when the transition is complete. Far right, the 60/40 split bar, with UPL as a separate red gate chip outside it.",
        check: {
          questions: [
            "Explain the fork: what is the same on Track B as on Track A, what changes on 08/12/2026, and why a $10,000 carrier freezes all $40,000.",
            "List the impasse triggers on John Doe's file by 09/04/2026, each with its date and the proof that shows it.",
            "Keystone calls $3,500 “final” on 08/12. Using the “Never” rule, say what the file does next, and what it never does without Atty. Thorne's authority."
          ],
          summary: [
            "Summarize, in your own words, what you learned about recognizing an impasse and moving a file into litigation: the principles, not the clicks.",
            "Articulate your strategy: the file is in Litigation status with a 09/24/2026 filing target. What is your next action, and why is it the right one rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Recognizing impasse triggers and proving them with dates",
            "Explaining why a BI impasse freezes the whole UM stack",
            "Writing an impasse memo that frames a decision without recommending one",
            "Moving a file's status, fields, folders and calendar into litigation",
            "Distinguishing the mediator and the arbitrator by background, selection and power",
            "Holding the UPL boundary when the client asks about the offer or the fee"
          ]
        },
        best: [
          "Answer with the file's own dates and figures, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D4#1", "D4#2", "D4#3", "D4#4", "D2#29", "D5#31"],
        rubric: {
          ai: [
            ["Fork and stack", 20, "Track B from 08/05/2026; BI → Host UM → Relative UM; $40,000 frozen behind $10,000"],
            ["Impasse record", 15, "Triggers named with correct dates and proof"],
            ["Architecture", 10, "Five sub-folders named; Request for Admission to 04_DISCOVERY_DEFENDANT_TO_PLAINTIFF; fee tier on filing"],
            ["Neutrals", 10, "Mediator and arbitrator distinguished by background, selection and power; no appeal on the merits"],
            ["Completeness", 5, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Question 6 answered without a view on the offer or an explanation of the fee; routed to Atty. Thorne"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 1 is the foundation. A trainee who can't explain why $10,000 freezes $40,000 has memorized the stack without understanding it; re-teach Day 2's order of operations before moving on.",
          "Question 6 is the pressure scenario. The right answer takes the question down, tells John Doe it is going to Atty. Thorne today, and routes it: no view on $3,500, no explanation of the fee.",
          "Question 5 separates the neutrals by power, not title. Expect “the mediator decides” from at least one trainee.",
          "Compare each self-rating with the score. UPL is a gate: a strong score does not survive an ethics breach."
        ]
      }

      ]
    },

    /* ---------- DAY 4 · MODULE 2 ---------- */
    {
      n: 2, id: "d4m2",
      title: "Mediation vs. Arbitration & Calendar Hard Rules",
      about: "Court and forum deadlines counted the court's way, the SOL's internal cutoffs, and what changes, and what never does, between a court-ordered mediation and a binding arbitration.",
      quiz: [
        {q: "Defendant's discovery to John Doe was served on his counsel, Atty. Thorne, by U.S. mail on 12/01/2026. As configured for this training file, his responses are due:",
         opts: ["12/31/2026", "01/03/2027", "01/04/2027", "01/13/2027"],
         a: 2, r: "Exclude the trigger day: 30 days → 12/31/2026; add 3 for mail → 01/03/2027, a Sunday; counting forward, it moves to Monday 01/04/2027. 01/13/2027 is when Robert Smith's responses to our e-served discovery are due."},
        {q: "The SOL on John Doe's file is 02/06/2028, a Sunday. The firm's internal filing cutoff is:",
         opts: ["11/05/2027 (Fri)", "11/08/2027 (Mon)", "02/04/2028 (Fri)", "11/06/2027 (Sat)"],
         a: 0, r: "The internal hard date is 02/04/2028, the Friday before the Sunday. Ninety days before it is 11/06/2027, a Saturday; counting backward moves to the earlier business day, 11/05/2027. 11/08/2027 is what you get by counting from the Sunday or rolling forward."},
        {q: "The arbitration brief for the 06/22/2027 hearing is due 10 days before. Ten days before is Saturday 06/12/2027. You docket:",
         opts: ["06/14/2027 (Mon)", "06/12/2027 (Sat)", "06/11/2027 (Fri)", "06/02/2027 (Wed)"],
         a: 2, r: "A backward count that lands on a weekend moves to the earlier business day. Rolling it forward to 06/14 files the brief late; 06/02 is the exhibit exchange."},
        {q: "At the 06/22/2027 hearing, Laura Whitcomb, Esq. asks you directly about a Riverton Spine & Rehab bill. You:",
         opts: ["Answer briefly: you audited that bill and know it best", "Stay silent and wait for Atty. Thorne to notice", "Offer to email her the audit after the hearing", "Say you are the Case Manager providing administrative assistance, defer to Atty. Thorne on the record, and hand him the document"],
         a: 3, r: "Speaking to the merits before the arbitrator is the unauthorized practice of law, even when your answer is right. Defer politely and put the document in counsel's hands."},
        {q: "The Scheduling Order says mediation is to be “completed by 03/31/2027.” The re-keyed calendar shows “Mediation session 03/31/2027.” The correct fix is:",
         opts: ["Leave it: the order names the date", "Re-enter it as a deadline, “completed by 03/31/2027”, with a task to collect 3–4 windows from Atty. Thorne, John Doe and opposing counsel before the mediator's office is contacted", "Call Hon. Carla Benton's office and book 03/31/2027", "Roll it forward to 04/01/2027 to leave time for the session"],
         a: 1, r: "Read each verb in the order: “completed by” sets when the session must be over, not when it is held. Windows are gathered from every party before the neutral hears from you; the session was held 03/18/2027, inside the deadline."},
        {q: "John Doe asks when mediation and arbitration happen in a personal injury case. The accurate answer is:",
         opts: ["Only after a lawsuit is filed", "Only before a lawsuit is filed, as part of the demand", "Either before filing or after it, depending on the process, the court's local rules and how the negotiations go", "Only when the trial date has already been set"],
         a: 2, r: "Neither forum has one fixed place on the timeline. Pre-litigation mediation follows completed treatment and the demand when both sides want to avoid court costs; most personal injury mediations are post-filing and many are court-ordered during discovery. Arbitration comes before filing when a signed clause compels it, and after filing when the parties agree to leave the court system."},
        {q: "Harbor Point and Cardinal State dispute damages and the file goes to binding arbitration on 06/22/2027. Laura Whitcomb, Esq. issues her award. In plain words to John Doe, that award is:",
         opts: ["A recommendation either side may accept or reject", "Non-binding until he signs it, as at mediation", "Final and enforceable like a court order, with court review on narrow grounds only", "Automatically reheard by a jury if he disagrees"],
         a: 2, r: "Binding means the decision is final and enforced like a court order; courts review it on narrow grounds only (some policies or statutes allow a trial de novo — confirm the governing rule). Mediation is the non-binding one: both sides must agree and nobody is forced to settle. What the award means for his recovery is Atty. Thorne's to explain, not yours."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d4m2-l1", compact: true,
        title: "Court Hard Rules, SOL Cutoffs & the Master Calendar",
        topic: "The dates the law sets, and the earlier dates the firm dockets",
        visual: "A horizontal master-calendar ribbon across the full slide width on a cream ground, running 10/2026 to 02/2028. Court hard rules stand above the ribbon as navy pins with mono date pills (11/13/2026 · 01/04/2027 · 03/31/2027 · 05/28/2027); forum dates hang below it as orange pins (03/11 · 03/18 · 06/02 · 06/11 · 06/22/2027). At the far right, a red danger flag on 02/06/2028 reads SUNDAY — NEVER RELY ON IT, and two orange pins step back from it: 02/04/2028 INTERNAL HARD DATE and 11/05/2027 FILING CUTOFF. Under the ribbon, two arrow chips pointing opposite ways: a right-pointing FORWARD COUNT → NEXT BUSINESS DAY and a left-pointing BACKWARD COUNT: EARLIER BUSINESS DAY. The argument: the dates the CM dockets sit earlier than the dates the law allows.",
        tell: {
          why: "Keystone's stonewall on the 14-Day Gap moved John Doe's file onto court time. From 09/24/2026 its dates are set by rule, order and statute, and they do not move because a carrier is silent or a client is unreachable. One mis-counted day can concede a fact or end a claim.",
          rules: [
            "A hard rule is a date fixed by statute, court rule, court order or a forum's rules. Miss one by a day and the claim can go: a complaint filed after the SOL can be dismissed with prejudice. Every date here is configured for this training file; confirm the court's rules.",
            "Count the court's way: exclude the trigger day, include the last. Robert Smith was served 10/14/2026; 30 days → answer due 11/13/2026. Answer periods commonly run 20 to 30 days (21 in federal court).",
            "The mailbox trap: many courts add 3 days when a paper is served by mail, and this file's rule set does. E-service is rule-specific: our 12/14/2026 e-served discovery is due back 01/13/2027, nothing added.",
            "A forward count that lands on a weekend or court holiday moves to the next business day. A backward count from an event moves to the earlier one. Never roll a backward deadline forward.",
            "Unanswered Requests for Admission may be deemed admitted. Docket John Doe's 15 RFAs as their own entry with their own alerts, never folded into “discovery due”.",
            "Docket the SOL to internal dates. The firm never relies on a weekend roll-forward: the Sunday SOL, 02/06/2028, becomes an internal hard date of 02/04/2028 (Fri) and an internal filing cutoff 90 days before that (11/06/2027, a Saturday → 11/05/2027).",
            "Filing on 09/24/2026 doesn't release the SOL. Whether any claim or party still depends on it is Atty. Thorne's analysis; both internal dates stay live until he releases them in writing.",
            "Enter a Scheduling Order the day it arrives and read each verb: mediation “completed by 03/31/2027” is a deadline for the session to be over, not the session date. Plaintiff's expert disclosure (03/15/2027) is ours.",
            "The moment a matter is routed to a forum, hard-code its dates on the master calendar and monitor them. Give each an owner, its trigger document, the arithmetic and warning alerts. A deadline that lives only in an email isn't calendared.",
            "When a rule is unclear, docket the conservative date and flag it to Atty. Thorne. A date pulled earlier costs time; one pushed later, or left off, costs rights."
          ],
          upl: [
            "You compute, docket, verify and flag. You may not decide which rule governs, agree an extension with opposing counsel, or tell John Doe what a missed date would do to his case. Those are Atty. Thorne's."
          ]
        },
        show: {
          caption: "This file's hard rules, counted (as configured for this training file)",
          type: "table",
          head: ["Trigger", "Rule and count", "Docket"],
          rows: [
            ["Smith served 10/14/2026", "Answer: 30 days", "11/13/2026 (Fri)"],
            ["Discovery mailed 12/01/2026", "30 + 3 = 01/03/2027 (Sun) → forward", "01/04/2027 (Mon), RFAs too"],
            ["Mediation 03/18/2027", "Statement and binder 7 days before", "03/11/2027 (Thu)"],
            ["Hearing 06/22/2027", "Exhibits 20 days before; brief 10 days before = 06/12 (Sat) → back", "06/02/2027; 06/11/2027 (Fri)"],
            ["SOL 02/06/2028 (Sun)", "Hard date before the weekend; cutoff 90 days earlier = 11/06/2027 (Sat) → back", "02/04/2028; 11/05/2027 (Fri)"]
          ]
        },
        ops: [
          ["Scheduling Order entered 12/10/2026", "Enter every date with its trigger, rule, owner and alerts; read each verb", "Docket System", "All six order dates entered that day; “completed by” entered as a deadline"],
          ["Discovery served by mail 12/01/2026", "Count 30 + 3, move the Sunday forward, enter the RFAs separately", "Case Docket & Calendar Conflict Resolver", "Responses and RFAs both at 01/04/2027; deemed-admitted flag set"],
          ["SOL review", "Set the internal hard date and the internal filing cutoff", "CMS → Calendar", "02/04/2028 and 11/05/2027 docketed; nothing relies on 02/06/2028"],
          ["Arbitration invoked 04/05/2027", "Hard-code the hearing, exhibit-exchange and brief dates", "CMS → Calendar → Master calendar", "06/02, 06/11 and 06/22/2027 entered with alerts the same day"]
        ],
        best: [
          "Record the trigger, the rule and the arithmetic on every entry, so anyone can re-check it.",
          "Add warning alerts ahead of each hard date.",
          "Calendar the conservative date when a rule is unclear, and flag it.",
          "Pitfall: counting the trigger day as day one.",
          "Pitfall: rolling a backward-counted deadline forward to Monday.",
          "Pitfall: docketing the SOL on its Sunday and relying on the roll-forward."
        ],
        sources: ["D5#28", "D4#18", "Newly authored: weekend roll direction (forward count → next business day; backward count → earlier business day)", "Newly authored: SOL internal hard date and 90-day internal filing cutoff (firm rule configured for this training file), kept live after filing until Atty. Thorne releases them", "Newly authored: scheduling-order entry (read each verb) and RFAs docketed separately for the deemed-admission risk", "Newly authored: calendar-error risk (later or missing costs rights; earlier costs time)"],
        rubric: {
          ai: [
            ["Deadline arithmetic", 20, "Answer 11/13/2026; responses 01/04/2027 with the 3 mail days; brief 06/11/2027"],
            ["SOL cutoffs", 15, "Internal hard date 02/04/2028 and filing cutoff 11/05/2027, arithmetic shown"],
            ["Roll direction", 15, "Forward counts move later, backward counts earlier; none rolled the wrong way"],
            ["Entry completeness", 10, "Trigger, rule, owner and alerts on every hard date; RFAs entered separately"]
          ],
          trainer: [
            ["Risk judgment", 25, "Explains why a late or missing entry is worse than an early one, and dockets the conservative date"],
            ["Authority boundary", 15, "Rule questions and extensions routed to Atty. Thorne; no legal consequence explained to the client"]
          ]
        },
        notes: [
          "Open on the SOL: write 02/06/2028 on the board and ask what day of the week it is. Then show the two orange pins stepping back from it.",
          "Ask the room: “Discovery was mailed to us on 12/01/2026. When are John Doe's responses due?” Make them say every step aloud: trigger day out, 30 days, 3 for mail, Sunday, Monday.",
          "The most often failed point is direction. Forward counts move to the next business day, backward counts to the earlier one; rolling the 06/12/2027 brief to Monday files it late.",
          "Every date on this slide is configured for this training file. Say so, and say who confirms the real rule: Atty. Thorne. The CM computes and dockets; the CM never agrees an extension."
        ]
      },

      {
        kind: "activity", id: "d4m2-a1", compact: true,
        title: "Auditing Court Hard Rules & Setting Calendar Cutoffs",
        topic: "Skill Activity 1 — find the dates that would cost the file",
        visual: "The Case Docket & Calendar Conflict Resolver fills the slide: a white table card with a navy header bar, one row per staged entry, the as-keyed date in a mono pill and a blank status chip at the right of each row (VERIFIED · CORRECTED · ADDED) for the trainee to set. A single dashed-orange ADD ENTRY row sits at the bottom, unlabelled, so the slide reveals neither what is missing nor how much. Down the right edge runs a vertical two-band risk gauge: an upper red band, COSTS RIGHTS — LATER OR MISSING, and a lower grey band, COSTS TIME — EARLIER. The trainee drags each error onto the gauge. The red band sits on top: rights before time.",
        act: {
          scenario: "It is 12/10/2026. The Scheduling Order in No. 26-CV-04417 was entered today. The defendant's Interrogatories (25), Requests for Production (30) and Requests for Admission (15), served on his counsel, Atty. Thorne, by U.S. mail on 12/01/2026, are in the file. The order reads: plaintiff's expert disclosure 03/15/2027; defense expert disclosure 04/15/2027; mediation to be completed by 03/31/2027; discovery closes 05/28/2027; pretrial conference 08/12/2027; trial calendar 09/13/2027. While you were out, a covering colleague re-keyed the calendar from the paper file instead of carrying over the 09/10/2026 transition entries: unverified; no alerts.",
          prompt: "Audit John Doe's calendar in the Case Docket & Calendar Conflict Resolver against the 12/10/2026 Scheduling Order, the discovery mailed 12/01/2026 and the 02/06/2028 SOL. Recompute every entry from its trigger document: trigger day out, 3 mail days in, forward counts to the next business day, backward to the earlier. Correct errors, add missing entries, leave correct ones alone. Give every entry its trigger, rule, arithmetic, owner and alerts. Mirror every corrected entry to John Doe's CMS Calendar. Rank errors by risk; log the corrections in CMS Case Notes and route them to Atty. Thorne.",
          tool: "Case Docket & Calendar Conflict Resolver · Docket System · CMS → Calendar · Case Notes",
          output: "A verified Litigation Calendar with every planted error corrected, the missing entries added, and a ranked correction log routed to Atty. Thorne.",
          checkpoints: [
            "Responses corrected to 01/04/2027 (Mon): 12/01/2026 + 30 = 12/31/2026, + 3 for mail = 01/03/2027, a Sunday → next business day",
            "RFA entry added: all 15 requests due 01/04/2027, flagged “deemed admitted if unanswered”",
            "Expert disclosures un-swapped: plaintiff's 03/15/2027 (ours), defense 04/15/2027",
            "Mediation re-entered as “completed by 03/31/2027”, a deadline, with a task to collect 3–4 windows before the mediator's office is contacted",
            "Internal hard date 02/04/2028 (Fri) added; SOL 02/06/2028 kept, marked a Sunday and never relied on",
            "Filing cutoff corrected from 11/08/2027 to 11/05/2027: 90 days before 02/04/2028 is 11/06/2027 (Sat) → earlier business day",
            "Answer, discovery-close, pretrial and trial-calendar entries verified and left unchanged",
            "Every entry carries its trigger document, rule, arithmetic, owner and warning alerts",
            "Every corrected entry mirrored to the CMS Calendar; the correction log in CMS Case Notes",
            "Errors ranked: the missing and later-than-correct entries ahead of the early 12/31/2026 entry",
            "Correction log routed to Atty. Thorne with rule questions flagged “confirm the court's rules”; no extension discussed with opposing counsel"
          ]
        },
        show: {
          caption: "The staged calendar, as keyed (unverified; no alerts set)",
          type: "table",
          head: ["Entry as keyed", "Date"],
          rows: [
            ["Answer due (Smith served 10/14/2026) · filed 11/12/2026", "11/13/2026"],
            ["Responses to defendant's discovery (mailed 12/01/2026)", "12/31/2026"],
            ["Plaintiff's expert disclosure", "04/15/2027"],
            ["Defense expert disclosure", "03/15/2027"],
            ["Mediation session", "03/31/2027"],
            ["Other order dates, as keyed", "05/28 · 08/12 · 09/13/2027"],
            ["Internal filing cutoff", "11/08/2027"],
            ["Statute of limitations", "02/06/2028"]
          ]
        },
        ops: [
          ["Scheduling Order entered 12/10/2026", "Audit every entry against its trigger document", "Case Docket & Calendar Conflict Resolver", "Every planted error found; correct entries untouched"],
          ["Errors corrected", "Give each entry its trigger, rule, owner and alerts", "Docket System", "No entry without a trigger document and alerts"],
          ["Audit complete", "Route the ranked correction log, rule questions flagged", "CMS → Tasks → Escalate", "Routed to Atty. Thorne the same day"]
        ],
        best: [
          "Recompute from the trigger document, never from the entry you are checking.",
          "Mark correct entries as verified; an audit that changes everything can't be trusted either.",
          "Pitfall: fixing what is on the screen and missing what isn't, such as the RFA entry.",
          "Pitfall: “fixing” 11/06/2027 by rolling it forward to Monday."
        ],
        sources: ["D5#28", "D4#18", "D4#5", "Newly authored: calendar-error risk (later or missing costs rights; earlier costs time)"],
        rubric: {
          ai: [
            ["Error detection", 20, "All six planted errors found: mail days, RFA entry, swapped disclosures, mediation deadline, filing cutoff, SOL internal date"],
            ["Date accuracy", 20, "01/04/2027, 03/15/2027, 04/15/2027, 02/04/2028 and 11/05/2027 exactly, arithmetic shown"],
            ["No false positives", 10, "Answer, discovery-close, pretrial and trial-calendar entries left unchanged"],
            ["Entry completeness", 10, "Trigger, rule, arithmetic, owner and alerts on every entry"]
          ],
          trainer: [
            ["Risk triage", 25, "Missing and later-than-correct entries ranked first, with a reason that holds"],
            ["Authority boundary", 15, "Rule questions routed to Atty. Thorne; no extension or stipulation raised with opposing counsel"]
          ]
        },
        notes: [
          "Hand out the staged calendar with no hint of how many errors it holds. Ask each trainee to initial the entries they would sign their name to before they recompute anything.",
          "Put to the room: “12/31/2026 is wrong and 11/08/2027 is wrong. Which one could cost John Doe his claim?” The early date costs time; the late one costs rights.",
          "Watch for the missing RFA entry. Trainees fix what is on the screen and miss what isn't, and the deemed-admission risk is the nearest deadline on this calendar and one of the most severe.",
          "Legal nuance: many courts accept a Monday filing when a limitation period ends on a Sunday. The firm rule refuses to rely on it, and which rule governs is Atty. Thorne's call. A trainee who calls opposing counsel about an extension fails the authority row."
        ]
      },

      {
        kind: "lesson", id: "d4m2-l2", compact: true,
        title: "Mediation vs. Binding Arbitration & the UPL Line at Hearings",
        topic: "Two neutrals, two standards, one boundary",
        visual: "Two forum cards face each other across the slide, joined by a bold orange arrow labelled COMPROMISE → TRIAL-READY. Left, a navy-soft card: MEDIATION · 03/18/2027 · HON. CARLA BENTON (RET.), with three chips: NON-BINDING · CONFIDENTIAL · FACILITATES. Right, a solid navy card, visibly heavier: BINDING ARBITRATION · 06/22/2027 · LAURA WHITCOMB, ESQ., with three chips: ACTS AS JUDGE · BINDING AWARD · APPEAL LIMITED, and a mono hard-date strip beneath it (06/02 · 06/11 · 06/22/2027). Across the bottom, a full-width red-bordered UPL bar in two halves: CM CAN (observe · log directives · update the CMS) in navy, CM NEVER (argue · speak on the record · speak for John Doe · negotiate) in red. The bar spans both cards: the line is the same at both tables. Above both cards, a slim full-width timeline strip marks where ADR can land: BEFORE FILING (pre-litigation mediation · pre-filing arbitration clause) on the left in navy-soft, a vertical orange COMPLAINT FILED marker in the middle, and AFTER FILING (court-ordered mediation · agreed binding arbitration) on the right, with both of this file's sessions pinned on the right-hand half.",
        tell: {
          why: "Two neutrals, three months apart. Hon. Carla Benton (Ret.) can only help the parties agree; Laura Whitcomb, Esq. decides, and her award stands with almost no appeal. Prepare for both alike and you bring a compromise file to a trial-ready hearing.",
          rules: [
            "ADR is not one fixed step on the timeline. Mediation and arbitration can each come before a lawsuit is filed or after it; which it is depends on the process, the court's local rules and how the negotiations go. Neither is a stop between the demand and a jury trial that every file makes.",
            "Before suit: pre-litigation mediation usually follows the client's completed treatment and the formal demand, when both sides would rather avoid court costs, legal fees and a public record. Pre-filing arbitration comes from a contract the client signed before or during the incident — rideshare user terms, a treatment consent, a nursing-home agreement — and can bar a standard court lawsuit altogether. Whether a clause applies to this file is Atty. Thorne's analysis, never yours.",
            "After suit: most personal injury mediations are post-filing, many of them court-ordered during discovery before a trial date is assigned; parties can also agree to pull a filed case out of court into binding arbitration instead of a long jury trial. On this file Keystone's stonewall sent the matter to suit, then to the court-ordered mediation of 03/18/2027 and, under Harbor Point's UM clause, to binding arbitration on 06/22/2027.",
            "Say both words in plain language before you use them with John Doe. Non-binding (mediation): both sides have to agree, and nobody is forced to settle. Binding (arbitration): the arbitrator's decision is final and enforceable like a court order. You explain which process is scheduled and when; what either one does to his claim is Atty. Thorne's to tell him.",
            "Mediation is facilitated compromise: non-binding, confidential under the governing statute or court rule (exceptions include a signed settlement). Court-ordered means John Doe must attend, not agree. When a deal binds (party signatures, or counsel with authority) varies: confirm the governing rule. Here: 03/18/2027.",
            "Binding arbitration, as Harbor Point's clause provides, is an adversarial hearing: the arbitrator acts as judge; courts review her award only on narrow grounds. Confirm the policy and statute; some allow a trial de novo. Here BI settled at mediation, and the UM carriers' dispute over the gap went to a decision.",
            "Know the limits. Split limits cap BI per person (Keystone: $10,000, PD separate); a combined single limit is one figure for BI and PD. Damages found are reduced first by the $10,000 BI paid; Harbor Point's add-on UM pays above that up to $20,000, Cardinal State's $10,000 behind it. How an award applies is Atty. Thorne's analysis.",
            "Mediation logistics: 3–4 windows from Atty. Thorne, John Doe and opposing counsel before contacting the mediator; a private room (breakouts if virtual); interpreter checked; Atty. Thorne's 2-hour buffer; video open 15 minutes early so he can brief John Doe; you run the technology check only.",
            "Every window rejected? Log the pushback that day and escalate to Atty. Thorne. Never accept “a quick video mediation next Tuesday” unchecked.",
            "Arbitration setup: align 3–4 blocks with opposing staff; messages to the arbitrator's office (scheduling, fees, retainer) go only as Atty. Thorne directs, in writing, all counsel copied, never on the merits. Route the retainer to accounting, payment confirmed in writing; set the room or secure video.",
            "Trial-ready: audit every exhibit, lock every deadline. At the hearing, document testimony and the arbitrator's reactions; log each bench directive as given, calendar it, memo Atty. Thorne that day.",
            "The Golden Rule: a CM never argues, speaks on the record or represents John Doe. Asked about a bill: say you are the Case Manager providing administrative assistance, defer to Atty. Thorne, hand him the document."
          ],
          upl: [
            "At both sessions you run logistics, exhibits, technology and notes. You never speak for John Doe, argue, negotiate or answer a neutral on the merits, or tell John Doe whether to accept a number: that is his call with Atty. Thorne."
          ]
        },
        show: {
          caption: "The two forums on John Doe's file",
          type: "compare",
          boxes: [
            {head: "MEDIATION — compromise · 03/18/2027", items: [
              "Hon. Carla Benton (Ret.) facilitates; she decides nothing.",
              "Attendance ordered, not agreement; when a deal binds varies.",
              "Confidential; statement and binder due 03/11/2027.",
              "Across: Robert Smith, defended by Keystone.",
              "CM: windows, rooms, interpreter, buffer, notes."
            ]},
            {head: "BINDING ARBITRATION — decision · 06/22/2027", items: [
              "Laura Whitcomb, Esq. acts as judge; her award binds.",
              "Court review on narrow grounds only. Trial-ready.",
              "Exhibits 06/02/2027; brief 06/11/2027.",
              "Across: Harbor Point and Cardinal State.",
              "CM: retainer, setup, notes, directives."
            ]}
          ]
        },
        ops: [
          ["Order requires mediation by 03/31/2027", "Collect 3–4 windows from Atty. Thorne, John Doe and opposing counsel, then contact the mediator's office", "Calendaring Simulators", "Windows logged before the mediator is contacted; session inside 03/31/2027"],
          ["Opposing counsel rejects every window", "Log the pushback; escalate for an attorney-to-attorney call", "CMS → Tasks → Escalate", "Logged and escalated the same day"],
          ["Arbitrator's fee schedule and retainer request received", "Confirm the schedule; route the retainer to accounting; send internal invites", "CMS → Tasks → Accounting · CMS → Calendar", "Payment confirmed in writing before the hearing"],
          ["Directive from the bench", "Log it as given; calendar it; memo Atty. Thorne", "CMS → Case Notes · CMS → Calendar", "Directive dated and calendared the same day"]
        ],
        best: [
          "Your hearing notes become Atty. Thorne's post-hearing roadmap.",
          "Collect every party's windows before the neutral's office hears from you.",
          "Confirm the retainer payment in writing; unpaid retainers delay hearings.",
          "Pitfall: bringing a mediation-quality binder to an arbitration.",
          "Pitfall: “helpfully” answering the arbitrator directly.",
          "Pitfall: logging bench directives the next day from memory."
        ],
        sources: ["D4#5", "D4#16", "D4#17", "D4#19", "D4#20", "Newly authored: court-ordered mediation compels attendance, not agreement", "Newly authored: where ADR lands on the timeline — pre-litigation and post-filing mediation, contractual pre-filing arbitration and agreed post-filing arbitration, and the Standard Case Progression Roadmap"],
        rubric: {
          ai: [
            ["Forum distinctions", 20, "Non-binding, confidential compromise vs. binding award with limited appeal, each tied to its neutral; both terms said in plain words"],
            ["ADR timing", 10, "Each forum placed before or after filing, with what puts it there: the demand, the court's rules, a signed arbitration clause, the parties' agreement; this file's two sessions placed post-filing"],
            ["Logistics protocol", 15, "3–4 windows first; rooms or breakouts; interpreter; 2-hour buffer; retainer confirmed in writing"],
            ["Hearing duties", 5, "Observe and document, log directives as given, calendar and memo the same day"],
            ["Limits in play", 10, "Split vs. combined single limit explained; $20,000 and $10,000 UM limits named"]
          ],
          trainer: [
            ["Mindset shift", 15, "Explains what changes operationally from compromise to trial-ready"],
            ["UPL boundary", 25, "Never speaks for John Doe, argues, negotiates or answers a neutral; the bill script defers to Atty. Thorne"]
          ]
        },
        notes: [
          "Start on the roadmap, before either neutral is named. Ask the room where ADR sits between the demand and a trial, and let them argue about it: the answer is that it can sit on either side of the filing. Then put the four boxes up — mediation before suit, mediation after suit, arbitration before suit, arbitration after suit — and ask which two this file used, and why.",
          "Teach non-binding and binding in plain words before any question is asked: both sides must agree, nobody is forced to settle; the decision is final and enforced like a court order. A trainee who can't say those two sentences cleanly will say something worse to John Doe.",
          "Pre-filing arbitration is the one most trainees have never met. Give them the three places it comes from — rideshare terms, a treatment consent, a nursing-home contract — and say plainly that a clause can close the courthouse door, and that whether it applies here is Atty. Thorne's call.",
          "Open with the two neutrals' names side by side and ask what each can do to John Doe's case. Hon. Carla Benton (Ret.) can't decide it; any deal needs his agreement through Atty. Thorne; Laura Whitcomb, Esq. can decide it.",
          "Ask the room: “The mediation was court-ordered. Did John Doe have to settle?” Draw out the answer: ordered to attend, never to agree.",
          "Watch for trainees who treat logistics as clerical. The private room, the 2-hour buffer and the interpreter check are what let Atty. Thorne and John Doe think clearly in a session where nobody else may speak for them.",
          "Read the Golden Rule aloud, then the bill script. Violating UPL rules puts both the Case Manager and the firm at risk; say it in those words."
        ]
      },

      {
        kind: "activity", id: "d4m2-a2", compact: true,
        title: "ADR Rules Matrix & UPL Boundary Mapping",
        topic: "Skill Activity 2 — what changes from compromise to decision",
        visual: "A matrix canvas across two-thirds of the slide: row labels down the left in navy small caps (NEUTRAL & POWER · BINDING & APPEAL · CONFIDENTIALITY · OPPOSING PARTIES · LIMITS IN PLAY · STANDARD · HARD DATES · LOGISTICS), a navy-soft MEDIATION column and a solid navy ARBITRATION column, every cell empty and outlined in orange for the trainee. The right third holds the UPL boundary map as a plan view of the hearing table: Atty. Thorne's seat at the table edge in navy with a speech mark, the CM's seat behind it in orange with a red-struck speech mark and an orange arrow labelled HAND HIM THE DOCUMENT. The struck speech mark is the slide's argument.",
        act: {
          scenario: "It is 04/05/2027. The 03/18/2027 mediation before Hon. Carla Benton (Ret.) produced Keystone's $10,000 BI tender: BI is exhausted, the UM consents are in, and Robert Smith is dismissed. Today Harbor Point and Cardinal State dispute damages, citing the gap. Harbor Point invokes its UM arbitration clause; Cardinal State joins one consolidated binding arbitration before Laura Whitcomb, Esq. Hearing: 06/22/2027 (Tue). The forum's schedule, as configured for this training file: exhibits exchanged 20 days before the hearing; the arbitration brief due 10 days before. Confirm the forum's rules.",
          prompt: "Build the ADR rules matrix for John Doe's file: a column for the 03/18/2027 mediation and one for the 06/22/2027 arbitration, with rows for the neutral and her power, binding effect and appeal, confidentiality, the opposing parties, the limits in play, the preparation standard, the CM's hard dates and the logistics. Hard-code the arbitration dates today, counting back from the hearing. Then map the UPL boundary for the hearing: what you do, what you never do, and your exact words if Laura Whitcomb, Esq. asks you about a bill. Route both to Atty. Thorne.",
          tool: "Action Plan Editor → ADR rules matrix · CMS → Calendar",
          output: "A two-forum rules matrix, the arbitration dates hard-coded with alerts, and a one-page UPL boundary map for the 06/22/2027 hearing, routed to Atty. Thorne.",
          checkpoints: [
            "Mediation column: Hon. Carla Benton (Ret.) facilitates only; non-binding; when a deal binds and what stays confidential follow the governing rule (confirm it); court-ordered and held 03/18/2027, inside 03/31/2027",
            "Arbitration column: Laura Whitcomb, Esq. acts as judge; binding award; court review on narrow grounds only; invoked under Harbor Point's UM clause, Cardinal State joined",
            "Opposing parties: Robert Smith (defended by Keystone's counsel) at mediation → Harbor Point and Cardinal State at arbitration",
            "Limits in play: $20,000 Host UM + $10,000 Relative UM = $30,000; the $10,000 BI tender recorded as the exhaustion that opened them",
            "Exhibit exchange docketed 06/02/2027 (Wed), 20 days before the hearing",
            "Brief docketed 06/11/2027 (Fri): 10 days before is Saturday 06/12, so it moves back to the earlier business day, never forward to 06/14/2027",
            "Selection cutoff recorded as met: the neutral, Laura Whitcomb, Esq., is named",
            "Standard row: compromise-ready for mediation; trial-ready for arbitration, every exhibit audited and every deadline locked",
            "Logistics row: fee schedule confirmed, retainer routed to accounting with written payment confirmation, internal invites, room or secure video with breakouts",
            "UPL map: never argue, speak on the record, speak for John Doe, negotiate or advise him on a number; do observe, log directives and update the CMS",
            "Scripted deferral: “I'm the Case Manager providing administrative assistance; Atty. Thorne will address that,” and the document handed to him"
          ]
        },
        show: {
          caption: "The arbitration track's three hard dates (fill in this file's)",
          type: "threebox",
          items: [
            ["Hearing date", "The trial-like date: argument, cross-examination, evidence. Every other date counts back from it."],
            ["Brief deadline", "The cutoff for factual claims, legal arguments, the exhibit index and the witness list."],
            ["Arbitrator selection cutoff", "The deadline to vet and strike names from a panel such as AAA or JAMS; recorded as met once the neutral is named."]
          ]
        },
        ops: [
          ["Arbitration invoked 04/05/2027", "Hard-code the hearing, exhibit-exchange and brief dates with alerts", "CMS → Calendar → Master calendar", "06/02, 06/11 and 06/22/2027 entered the same day; nothing on 06/14/2027"],
          ["Arbitrator's fee schedule and retainer request received", "Confirm the schedule; route the retainer; file the payment confirmation", "CMS → Tasks → Accounting", "Written payment confirmation filed before the hearing"],
          ["Matrix and UPL map drafted", "Route to Atty. Thorne before the team works from them", "Action Plan Editor → Route for review", "Routed with timestamp; approved version recorded"]
        ],
        best: [
          "Build the matrix for the colleague who staffs the hearing with you, not for yourself.",
          "Write the deferral script before the hearing, and say it aloud once.",
          "Pitfall: a brief deadline that lives only in an email.",
          "Pitfall: treating the UM carriers as friendly because the coverage is first-party; on 06/22/2027 they are the other side."
        ],
        sources: ["D4#16", "D4#17", "D4#18", "D4#19", "D4#20"],
        rubric: {
          ai: [
            ["Forum accuracy", 20, "Neutral, power, binding effect, appeal and confidentiality correct in each column"],
            ["Parties and limits", 10, "Opposing parties change correctly; $20,000 + $10,000 = $30,000 in play; BI exhaustion recorded"],
            ["Hard-date accuracy", 15, "06/02/2027, 06/11/2027 (not 06/14/2027) and 06/22/2027, each with alerts"],
            ["UPL map completeness", 15, "Every never and every do item, plus the scripted deferral"]
          ],
          trainer: [
            ["Mindset shift", 15, "Explains what changes operationally from compromise to trial-ready, not just that it changes"],
            ["UPL boundary", 20, "The deferral is genuinely deferential; nothing on the map lets the CM speak to the merits"],
            ["Team usability", 5, "A colleague could staff the hearing from the matrix cold"]
          ]
        },
        notes: [
          "Open with the question, now on this file: “What changes operationally when a file moves from mediation to arbitration?” Write the answers in two columns on the board before anyone opens the editor.",
          "Ask the room: “On 03/18/2027 the other side was Robert Smith. Who is it on 06/22/2027, and what are they disputing?” The answer is the UM carriers, and the gap.",
          "Watch the brief date. Trainees who learned the forward rule apply it here and land on Monday 06/14/2027, after the deadline.",
          "Grade the scripted deferral hardest. A trainee who audited the Riverton Spine & Rehab bill knows the answer and will want to give it; that is exactly the moment the Golden Rule exists for."
        ]
      },

      {
        kind: "check", id: "d4m2-kc",
        title: "ADR & Calendar Compliance Check",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split: cream question panel above, navy CM Self-Summary card below-left with the 1–5 skill ladder below-right, and the 60/40 strip with the separate red UPL gate on the far right. Unique to this module: between the question panel and the summary card, a slim full-width HARD-DATE RIBBON of the module's computed dates as mono pills (01/04/2027 · 03/11/2027 · 06/02/2027 · 06/11/2027 · 11/05/2027 · 02/04/2028), each rolled date with a small arrow showing its direction (01/04/2027 forward; 06/11/2027, 11/05/2027 and 02/04/2028 back), and 03/11/2027 and 06/02/2027 marked NO ROLL, so the trainee checks direction before answering.",
        check: {
          questions: [
            "Defendant's discovery to John Doe was served on his counsel, Atty. Thorne, by U.S. mail on 12/01/2026. Compute his response date step by step, and state what can happen to a Request for Admission left unanswered.",
            "The SOL is 02/06/2028. Give the internal hard date and the internal filing cutoff with the arithmetic, and explain why the firm never relies on a weekend roll-forward.",
            "Explain forward versus backward counting off a weekend, using the 01/04/2027 discovery deadline and the brief for the 06/22/2027 arbitration hearing.",
            "Place mediation and arbitration on the timeline: name what puts each of them before a filing and what puts each of them after one, then say where John Doe's two sessions landed and why. Finish with the sentence you would say to him to explain non-binding, and the sentence for binding."
          ],
          summary: [
            "Summarize what you learned about hard rules and the two forums on this file: the principles, not the clicks.",
            "Articulate your strategy: it is 04/05/2027 and the arbitration has just been invoked. What is your next action, and why that one before anything else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Computing court deadlines: trigger day, mail days, weekends",
            "Counting backward from a hearing without rolling forward",
            "Setting the SOL's internal hard date and filing cutoff",
            "Auditing a calendar and ranking errors by risk",
            "Distinguishing mediation from binding arbitration on a live file",
            "Placing each forum before or after a filing, and explaining non-binding and binding in plain words",
            "Holding the UPL line at a mediation or a hearing"
          ]
        },
        best: [
          "Show the arithmetic for every date; an answer without it can't be checked.",
          "Pitfall: answering the arbitrator's question correctly, and so answering it at all."
        ],
        sources: ["D5#28", "D4#18", "D4#17", "D4#16", "D4#20", "D4#5"],
        rubric: {
          ai: [
            ["Deadline arithmetic", 20, "01/04/2027 with the mail days and the Sunday; brief 06/11/2027 counted backward"],
            ["SOL cutoffs", 10, "02/04/2028 and 11/05/2027, arithmetic shown"],
            ["Forum logistics", 20, "Windows, fee schedule, retainer and layout owned before 06/22/2027; bench directives logged as given and calendared the same day; each forum placed correctly before or after the filing, with non-binding and binding said in plain words"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "The hearing answer defers to Atty. Thorne on the record; the mediation answer escalates rather than accepts"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Run question 5 live: play Laura Whitcomb, Esq. and put the bill question to a trainee across the table. Grade the first sentence they say.",
          "Ask the room: “Which single date on this file would you check twice, and why?” Expect the RFAs or the SOL cutoffs; push for the reasoning.",
          "Question 3 is the direction test. A trainee who lands on 06/14/2027 has memorised the weekend rule without its direction; re-teach before the binders, which count back from the same hearing.",
          "UPL is a gate, as on every day: a strong score does not survive an answer that speaks for John Doe at the hearing or tells him whether to take a number."
        ]
      }

      ]
    },

    /* ---------- DAY 4 · MODULE 3 ---------- */
    {
      n: 3, id: "d4m3",
      title: "Evidentiary Binder Assembly",
      about: "From one master index to two binders: the six-section Mediation Binder for 03/18/2027 and the six-tab Arbitration Binder for the 06/22/2027 UM hearing, each numbered, Bates-ranged, authenticated and audited.",
      quiz: [
        {q: "The 11/12/2026 answer pleads that John Doe was unbelted. Which exhibits in Section 4 of the Mediation Binder answer it?",
         opts: ["The event data recorder (belt buckled) and the EMS Run Report", "The MRI read and Dr. Reyes's Causation Letter", "The Police Report's citation and Ruth Calloway's statement", "The Northgate Attendance Record and the 02/07/2026 pharmacy receipt"],
         a: 0, r: "The Escape's event data recorder shows the front-passenger belt buckled, and the EMS report records a “restrained front-seat passenger”. Ruth Calloway, the doorbell video and the report answer the out-of-turn allegation; the MRI and the Causation Letter answer causation."},
        {q: "After the 06/02/2027 exhibit exchange, a certified record you requested finally arrives. What is the right indexing move?",
         opts: ["Send it straight to the arbitrator so it still counts", "Slip it into Tab 4 behind the MRI without a number", "Renumber the set in date order and re-send the index to both carriers", "Give it the next exhibit number and Bates range, and route it to Atty. Thorne"],
         a: 3, r: "Exhibit numbers are never reshuffled once a set is in other hands, and the CMS master index changes first. An exhibit not exchanged on time may be excluded, so offering it late is Atty. Thorne's decision under the forum's rules."},
        {q: "Why does Tab 5 of the Arbitration Binder include John Doe's 2021 chiropractic records, which the carriers could use against him?",
         opts: ["Records we include cannot be used by the other side", "So the arbitrator meets them in context: a different region, resolved, paired with the MRI", "Every medical record a client has ever had must be exchanged", "To record the Case Manager's written opinion that the prior low-back visits are irrelevant"],
         a: 1, r: "The prior medical shield answers the “pre-existing degenerative” argument before it is made: three low-back visits (not neck) that resolved, no prior neck complaint, paired with the MRI's “no significant degenerative change at the adjacent levels” and the Causation Letter. What is argued from it is Atty. Thorne's call."},
        {q: "The pre-demand audit left the billed-or-paid choice on Crescent Pain & Spine's $3,400.00 bill to Atty. Thorne; Peach State paid $1,860.00 at its contract rate. Building the Mediation Binder, what does the audited Lien Sheet show?",
         opts: ["Crescent $3,400.00 and Peach State $1,860.00", "Crescent $1,540.00 and Peach State $1,860.00", "Peach State's $1,860.00 reimbursement claim only: Crescent wrote off the rest and cannot balance-bill", "Nothing: the bill is already counted in the Specials"],
         a: 2, r: "Cross-reference every provider balance against what the plan already paid (its EOB). Peach State's contract payment satisfied the bill and Crescent wrote off the other $1,540.00 (the $3,400.00 bill less the $1,860.00 paid), so Crescent holds no lien; listing both counts one bill twice against John Doe's recovery."},
        {q: "Sorting the unsorted folder for the 06/22/2027 Arbitration Binder, you find the 09/08/2026 impasse memo to Atty. Thorne. Where does it go?",
         opts: ["Flagged for Atty. Thorne's privilege and exchange decision, and kept out of the exchange set", "Tab 6, because it explains the negotiation history", "Tab 1 with the submissions, since it shows BI was not paid", "Tab 2 with the arbitration pleadings"],
         a: 0, r: "An internal memo in an exchanged set cannot be unsent. The CM flags; Atty. Thorne decides what is withheld as privileged and what is exchanged. The BI exhaustion threshold is proved with executed documents: Keystone's tender, the UM consents, the Limited Release and Robert Smith's dismissal."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d4m3-l1", compact: true,
        title: "The Mediation Binder & Exhibit Indexing",
        topic: "Six sections, one master index, and the five-second rule",
        visual: "An open binder seen from above fills the left two-thirds: six navy divider tabs stepped down its right edge, each with an orange numbered badge ①–⑥ and its section name, and beside each tab a cream card listing this file's documents as mono pills (RPD-26-018842 · EDR · MRI 03/13/2026 · $16,401.40). Across the top runs a slim navy bar, MASTER INDEX — ONE SOURCE OF TRUTH, with column chips Exhibit · Bates · Source · Status and thin orange leader lines running from index rows down into the tabs. Right third: a large stopwatch chip, 5 SECONDS, above a red danger callout: “Drafts and superseded pleadings never enter the binder.” The leader lines run from the index into the binder, never back: that is the argument.",
        tell: {
          why: "Keystone's stonewall on the 14-Day Gap is why John Doe's file is in suit. At the 03/18/2027 mediation Atty. Thorne will have minutes to answer it, so every record, figure and quote must sit in a known place. A binder he must hunt through costs momentum, and can cost a concession.",
          rules: [
            "The Mediation Binder is Atty. Thorne's and the mediator's road map: critical records, verified Specials and liability exhibits, indexed and bookmarked so any one is found in five seconds.",
            "Six numbered sections in fixed order, each tab matching the master index. Each document sits in one section; others cite its exhibit number.",
            "One master index in the CMS is the single source of truth: section, exhibit number, description, date, source, Bates range and status for each document. The binder prints from the index, never the reverse.",
            "Exhibit numbers belong to the proceeding (4-1, 4-2…): a late document takes the next number; a set others hold is never renumbered. Bates numbers belong to the page: stamped once at production (DOE 000001).",
            "Section 3 holds only the operative pleadings (09/24/2026 complaint, 11/12/2026 answer), no drafts. The answer pleads comparative negligence (out of turn, unbelted), causation (the gap, a “degenerative” MRI) and failure to mitigate; a defense argued but never pleaded is flagged to Atty. Thorne.",
            "Section 5's ledger ties line by line to the certified invoices and HR letter, each correction documented (duplicate removed: $6,290.00 → $6,105.00): $14,817.40 medical + $1,584.00 wages = $16,401.40. Future care ($3,400–$6,800) is narrative.",
            "Section 6's log fixes the baseline (Keystone's $3,500, “final” 08/12/2026). A draft Limited Release lets Atty. Thorne fix terms in writing before anyone leaves, conditioned on both UM carriers' written consent (each may substitute its own check to keep subrogation). Its scope (BI only, or the pleaded PD claim too) is his call.",
            "You are the QA and logistics auditor: sets for Atty. Thorne, the mediator and John Doe (or one digital set), every PDF OCR-searchable, statement delivered by 03/11/2027, binder audited against the index 48 hours out."
          ],
          upl: [
            "You build the binder and draft the confidential statement for Atty. Thorne's approval. Arguments, settlement positions, every number and each set's contents are his. You never discuss value with the mediator, Atty. Mercer or John Doe."
          ]
        },
        show: {
          caption: "John Doe's six-section Mediation Binder, and each section's QA rule",
          type: "table",
          head: ["Section", "On this file", "QA rule"],
          rows: [
            ["1 · Executive summary & administration", "Snapshot sheet; mediation order; 03/18/2027, Hon. Carla Benton (Ret.)", "Fee split from the order; contacts current"],
            ["2 · Briefs", "Our confidential statement; the defense's, if exchanged", "Ours to the mediator only, by 03/11/2027"],
            ["3 · Core pleadings", "Complaint 09/24/2026; answer and defenses 11/12/2026", "Operative versions only"],
            ["4 · Key evidence & liability", "RPD-26-018842, Ruth Calloway, doorbell stills, EMS report, EDR, deposition summary", "Summary + highlighted transcript pages"],
            ["5 · Damages, financials & experts", "Ledger, Northgate HR letter, MRI, Causation Letter, Gap Explanation Record, PD claim", "Ledger = sources: $16,401.40"],
            ["6 · Settlement history & drafts", "Negotiation Log from 07/20/2026; draft release (Smith, Keystone)", "Baseline stated; scope and UM consents flagged for Atty. Thorne"]
          ]
        },
        ops: [
          ["Mediation set for 03/18/2027", "Open the master index and seat each document in one section", "CMS → Documents → Master index", "Every entry has section, exhibit number, Bates range and source"],
          ["Pleadings and evidence indexed", "Check each defense pleaded in the answer against Sections 4 and 5", "CMS → Litigation → Pleadings Log", "Each pleaded defense has an answering exhibit, or a flag to Atty. Thorne"],
          ["Binder assembled", "OCR, bookmark and QA against the index; route for approval", "CMS → Documents → Mediation Binder", "Text-searchable; approved, then delivered by 03/11/2027"]
        ],
        best: [
          "Start from the 07/20/2026 Demand Package: most of Sections 4 and 5 already exist there.",
          "Bookmark to the page Atty. Thorne will quote, not to the document's cover.",
          "Pitfall: handing the attorney an unorganized file the morning of the session.",
          "Pitfall: a snapshot sheet with stale opposing-counsel contacts.",
          "Pitfall: sending the confidential statement ten minutes before the session, or to the wrong recipient."
        ],
        sources: ["D4#6", "D4#7", "D4#8", "D4#9", "D4#10", "D4#11", "D4#12", "D4#13", "Newly authored: exhibit numbering, Bates ranges and the master index as the one source of truth"],
        rubric: {
          ai: [
            ["Section order and contents", 20, "Six sections in order, each with this file's documents"],
            ["Indexing rules", 20, "Exhibit numbers per proceeding, Bates stamped once, master index fields, one source of truth"],
            ["Figures and dates", 20, "$14,817.40 + $1,584.00 = $16,401.40; pleadings 09/24/2026 and 11/12/2026; delivery 03/11/2027; session 03/18/2027"]
          ],
          trainer: [
            ["Purpose over procedure", 25, "Explains how an indexed binder protects Atty. Thorne's position in the room, not just how it is filed"],
            ["UPL boundary", 15, "Arguments, positions and numbers left to Atty. Thorne; the statement kept confidential to the mediator"]
          ]
        },
        notes: [
          "Open with a question: “What happens if Atty. Thorne gets an unorganized file the morning of the mediation?” Let the room answer, then say it plainly: he loses momentum, looks unprepared in front of the mediator, and may concede a point because he couldn't find the proof in time.",
          "Ask the room: “Where do you find the mediator's fee split?” The answer is the mediation order or the parties' stipulation, read, not assumed. Many orders split the fee 50/50; this file's order says what it says.",
          "Spend real time on the index. Trainees treat the binder as the product; the product is the index, and the binder is printed from it. When two copies disagree, the index decides.",
          "Section 3 is a legal check run by an operational person: the CM flags an unpled argument, Atty. Thorne decides whether to object. On this file all three defenses were pleaded, so Sections 4 and 5 must answer each one. In Section 5: Dr. Reyes's causation opinion, and any other treating physician's, may itself have to be disclosed by 03/15/2027 under the court's rules. Flag it to Atty. Thorne now (03/04/2027) with the deadline; whether and how each treating physician is disclosed, and whether a retained expert is added, is his call."
        ]
      },

      {
        kind: "activity", id: "d4m3-a1",
        title: "Assembling the 6-Section Mediation Binder",
        topic: "Skill Activity 1 — build it, audit it, route it before 03/11/2027",
        visual: "A three-column workbench. Left: the draft binder as a grey stack topped by two red landmine chips, LEDGER $15,002.40? and CRESCENT $3,400.00 OPEN?, each struck through once fixed. Centre: six navy section cards ①–⑥ with orange badges, filling with mono pills that carry exhibit numbers and Bates ranges. Right: an orange-bordered DEFENSE MAP card pairing each allegation in the 11/12/2026 answer (out of turn · unbelted · the gap · degenerative · failure to mitigate) with its exhibit by an → arrow. Along the bottom, a delivery strip: ROUTE TO ATTY. THORNE → DELIVER BY 03/11/2027 → SESSION 03/18/2027, with a red CONFIDENTIAL — MEDIATOR ONLY chip on the statement. The argument: every pleaded defense already has its page.",
        act: {
          scenario: "It is 03/04/2027 on Track B. John Doe was deposed on 02/18/2027 and the certified transcript is in the file. The confidential statement and binder are due to Hon. Carla Benton (Ret.) on 03/11/2027 for the 03/18/2027 mediation. The draft binder, built from the providers' original bills instead of the audited demand ledger, carries Riverton Spine & Rehab at $6,290.00 and lists Crescent Pain & Spine's $3,400.00 as an open balance, and Atty. Grant Mercer has written that Keystone “will not put a real number on the table” while the medical ledger is unverified. Riverton Spine & Rehab's Final Itemized Ledger, requested 02/08/2027 (second request 02/22, red-flagged 03/01), is still outstanding.",
          prompt: "Assemble the six-section Mediation Binder from the master index, starting from the 07/20/2026 Demand Package. Seat each document in one section with its exhibit number and Bates range, and map every allegation in the 11/12/2026 answer to the exhibit that answers it. Run the pre-mediation audit: rebuild the ledger from the certified bills in hand to $16,401.40, and cross-check each provider balance against what MedPay and Peach State already paid. Add the Negotiation Log, a draft Limited Release and the UM consent requests, then route it all to Atty. Thorne before delivery.",
          tool: "CMS → Documents → Mediation Binder · CMS → Documents → Master index · Medical Records Requests",
          output: "A six-section, indexed, OCR-searchable Mediation Binder with an audited ledger, a lien summary and a short audit memo on both landmines, routed to Atty. Thorne and ready for delivery to the mediator by 03/11/2027.",
          checkpoints: [
            "Section 1: snapshot sheet with LSH-2026-MVA-770412, No. 26-CV-04417 and Atty. Grant Mercer's verified contacts; session 03/18/2027 before Hon. Carla Benton (Ret.), with start time and location (or video link) taken from the order; fee split read from the mediation order or stipulation, not assumed",
            "Section 2: confidential statement marked for the mediator only, routed to Atty. Thorne, and its delivery calendared by 03/11/2027",
            "Section 3: the Complaint of 09/24/2026 and the answer of 11/12/2026 only, no draft; all three pleaded defenses listed",
            "Defense map: out of turn → RPD-26-018842, Ruth Calloway, doorbell video; unbelted → event data recorder (belt buckled), EMS report (“restrained”); the gap → EMS report (neck stiffness on the DOL), Gap Explanation Record and the 06/19/2026 Causation Letter; “degenerative” → the MRI read; failure to mitigate → the A-C-T record. Two legal questions flagged for Atty. Thorne, not answered: whether seatbelt evidence is admissible or can reduce damages here, and whether the Escape's alleged out-of-turn entry can affect a passenger's recovery; confirm the governing rule",
            "Section 4 also holds the key correspondence (Keystone's 02/17/2026 acceptance of PD liability; what weight it carries is Atty. Thorne's call) and the 02/18/2027 deposition summary with highlighted transcript pages on the gap, the disruption, the 2021 visits and the seatbelt",
            "Landmine 1: ledger rebuilt from the certified bills in hand, with Riverton Spine & Rehab's original 34-line bill audited to 33 visits × $185.00 = $6,105.00 (05/04/2026 duplicate removed) and marked “Pending Final Verification” until its certified ledger arrives; $14,817.40 medical + $1,584.00 wages = $16,401.40",
            "Landmine 2: Crescent's $3,400.00 bill shown as satisfied by Peach State's $1,860.00 contract payment, proved by Peach State's EOB (no balance billing); open liens Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00",
            "Section 5 carries the PD claim separately, outside the $40,000 stack: Loss of Use 48 days × $42.00 = $2,016.00; Diminished Value $3,600.00 (appraisal) vs. $792.00 (Keystone)",
            "Section 6: Negotiation Log 07/20/2026 demand → $3,500 (08/05) → rebuttal (08/06) → $3,500 “final” (08/12) → lapse (08/21) → suit (09/24); draft release limited to Robert Smith and Keystone; consent requests to Harbor Point and Cardinal State drafted",
            "Master index complete: every document in exactly one section with an exhibit number and Bates range; PDF OCR-searchable and bookmarked",
            "Audit memo names both landmines and their fixes; binder, statement and memo routed to Atty. Thorne before delivery; nothing about value said to Atty. Mercer"
          ]
        },
        ops: [
          ["Binder due 03/11/2027", "Build the six sections from the master index", "CMS → Documents → Mediation Binder", "Every document in one section, numbered and Bates-ranged"],
          ["Opposing counsel calls the ledger unverified", "Chase the outstanding certified ledger and rebuild from what is certified", "Medical Records Requests", "Ledger ties to invoices and the Northgate HR letter: $14,817.40 + $1,584.00 = $16,401.40"],
          ["Binder audited", "Route binder and statement to Atty. Thorne; deliver on approval", "CMS → Tasks → Escalate · Email Workspace", "Approved before delivery; delivery to the mediator logged by 03/11/2027"]
        ],
        best: [
          "Answer every pleaded defense with a page, not a sentence.",
          "Pull certified billing records, not portal printouts.",
          "Pitfall: carrying the $6,290.00 bill, duplicate and all, into Section 5.",
          "Pitfall: accepting a provider balance and the plan's payment of the same bill at face value.",
          "Pitfall: no Negotiation Log, so nobody in the room is sure of Keystone's last number."
        ],
        sources: ["D4#14", "D4#15", "D4#7", "D4#8", "D4#9", "D4#10", "D4#11", "D4#12", "D4#13"],
        rubric: {
          ai: [
            ["Section completeness", 15, "All six sections built with this file's documents; each document in exactly one section"],
            ["Ledger audit", 15, "33 visits = $6,105.00; $14,817.40 + $1,584.00 = $16,401.40"],
            ["Lien cross-check", 10, "Crescent's bill satisfied by Peach State's $1,860.00; open liens total $7,965.00"],
            ["Defense map", 10, "All five pleaded allegations mapped to answering exhibits"],
            ["Dates and delivery", 10, "Pleadings, negotiation-log dates and the 03/11/2027 delivery all correct"]
          ],
          trainer: [
            ["Binder usability", 20, "Atty. Thorne could find any page within five seconds from the index"],
            ["Audit judgment", 10, "Both landmines found and fixed from source documents, not from the draft's own figures"],
            ["UPL boundary", 10, "Statement, release and consents routed for approval; no value discussed with opposing counsel or the mediator"]
          ]
        },
        notes: [
          "Start with the two red landmine chips and ask who spotted them in the draft before you pointed. Most trainees fix the formatting and never test the numbers.",
          "Ask the room: “Atty. Mercer says the ledger is unverified. Is he wrong?” Until the duplicate is out and every line ties to a certified bill, he is right, and Section 5 is where that gets fixed.",
          "Grade the defense map hard: five allegations, five answers, each pointing to an exhibit number. A map that says “see Medical Records” is not a map. Then have partners swap binders and QA each other's index.",
          "The release and the consent requests are drafts for Atty. Thorne. Watch for trainees who write terms; the CM prepares the firm's template and the requests, and he settles every term."
        ]
      },

      {
        kind: "lesson", id: "d4m3-l2", compact: true,
        title: "Arbitration Exhibits & Evidentiary Rules",
        topic: "From a binder that persuades to the record a binding award rests on",
        visual: "Two panels joined by a heavy orange arrow labelled THE GAP DISPUTE CARRIES OVER. Left, small and greyed: the Mediation Binder, captioned PERSUADES · NON-BINDING. Right, dominant: six navy tabs ①–⑥ with orange badges, each above a cream card stating its QC rule in one line. Over Tab 1, an orange-outlined THRESHOLD chip: BI EXHAUSTED · $10,000 TENDERED 03/18/2027. Beneath the tabs, an AUTHENTICATION rail of three mono pills: CUSTODIAN CERTIFICATION · NATIVE FILE · CHAIN OF CUSTODY. Bottom-right, a red danger callout: “Not exchanged by 06/02/2027 → may not count.” Beside it, a grey chip: CONFIRM THE FORUM'S RULES. The difference in size between the panels is the argument: this record decides.",
        tell: {
          why: "On 04/05/2027 Harbor Point and Cardinal State took up Keystone's gap argument; Laura Whitcomb, Esq. will decide damages, bindingly. An Arbitration Binder is the record the award rests on: a page missing, illegible or not exchanged by 06/02/2027 may not count.",
          rules: [
            "Mediation is non-binding; its binder persuades. A binding award rests on the exhibits, and court review is very limited (some UM clauses allow a trial de novo; confirm the clause and statute). Apply each tab's QC rule as documents are sorted.",
            "The threshold leads: UM opens only because BI is exhausted. Prove it with the executed documents (Keystone's $10,000 tender, the UM consents, the Limited Release, Robert Smith's dismissal), never the Mediation Statement.",
            "Authenticate every exhibit: show it is what it claims to be. Get each custodian's business-records certification covering every date exhibited: each provider, Riverton Fire (EMS), Riverton PD, Northgate HR. A causation opinion is not a business record. Confirm the forum's rule.",
            "Keep video and data native and unaltered, with a chain-of-custody log (doorbell copy secured 02/19/2026). Print stills in color; QC rejects grayscale.",
            "Many arbitration rules relax the formal rules of evidence: the arbitrator admits what is relevant and weighs it. Confirm the forum's rules, then build to the strict standard anyway. Admitted is not persuasive.",
            "Number claimant exhibits C-1 onward across the tabs, keep the production Bates numbers, and freeze the set once exchanged.",
            "Nothing from the confidential mediation crosses over: not our statement, not its offers. Mediation communications are typically confidential and inadmissible; confirm the governing rule.",
            "Liens and health-plan payments are generally collateral sources kept from the factfinder; whether paid or billed amounts are the measure, and whether either reaches the arbitrator, varies. The Lien Sheet and the negotiation ledger (offers of compromise) stay in Atty. Thorne's set. Confirm the governing rule."
          ],
          upl: [
            "You assemble, index, confirm completeness and audit. Atty. Thorne decides what is argued, what is exchanged, what is withheld as privileged and whether an expert is retained. You never argue an exhibit to Laura Whitcomb, Esq. or the carriers."
          ]
        },
        show: {
          caption: "The UM Arbitration Binder's six tabs, and each tab's QC rule",
          type: "table",
          head: ["Tab", "On John Doe's file", "QC rule"],
          rows: [
            ["1 · Submissions", "BI exhaustion record; snapshot sheet; final brief; fee disclosures", "Retainers paid; final brief"],
            ["2 · Arbitration pleadings", "Demand; Cardinal State's joinder; each carrier's 04/05/2027 position; any Scheduling Order", "Operative versions only"],
            ["3 · Liability & biomechanics", "Certified RPD-26-018842; doorbell stills; event data recorder", "Identifiers redacted per forum; citation's use: Atty. Thorne; color"],
            ["4 · Medical damages", "Treatment chart; ledger $14,817.40; provider records and bills; MRI 03/13/2026; Dr. Reyes's orders and Causation Letter", "Ledger = certified invoices"],
            ["5 · Prior medical shield", "2021 chiropractic: three low-back visits, resolved; no prior neck complaint; work history", "Paired with the MRI read and a medical opinion"],
            ["6 · Economic losses", "Northgate HR letter ($1,584.00)", "Wage proof only"],
            ["Attorney's set — not for exchange", "Audited Lien Sheet; negotiation ledger; tort complaint and answer", "Atty. Thorne decides"]
          ]
        },
        ops: [
          ["Arbitration invoked 04/05/2027", "Open the claimant exhibit index and calendar the exchange and the brief", "CMS → Litigation → Exhibit index · Docket System", "06/02/2027 exchange and 06/11/2027 brief on the calendar"],
          ["Provider records gathered", "Request each custodian's business-records certification", "Medical Records Requests", "One certification per provider covering every date exhibited"],
          ["Exchange set assembled", "Route the set and every flagged item to Atty. Thorne", "CMS → Tasks → Escalate", "Approved before 06/02/2027; no privileged item in the set"]
        ],
        best: [
          "Build to the strict evidence standard even where the forum relaxes it.",
          "Keep native video and data files untouched; work from copies.",
          "Request certifications the week the arbitration is invoked; custodians are slow.",
          "Pitfall: a grayscale print of a crash still.",
          "Pitfall: a draft brief or a superseded complaint in the exchanged set.",
          "Pitfall: the Confidential Mediation Statement carried into the Arbitration Binder."
        ],
        sources: ["D4#21", "D4#22", "D4#23", "D4#24", "D4#25", "D4#26", "Newly authored: authentication, business-records certifications, relaxed evidence rules in arbitration, and mediation confidentiality at the hand-off"],
        rubric: {
          ai: [
            ["Tab order and contents", 20, "Six tabs in order with this file's documents; the BI exhaustion record leads"],
            ["QC rules", 20, "Retainer paid, operative arbitration pleadings, redaction, color, ledger = invoices, prior record paired, wage proof only"],
            ["Evidentiary basics", 20, "Authentication, business-records certification, chain of custody, “confirm the forum's rules”"]
          ],
          trainer: [
            ["Mediation vs. arbitration", 20, "Explains why the arbitration record is less forgiving than the Mediation Binder"],
            ["UPL boundary", 20, "Exchange, privilege and argument left to Atty. Thorne; no argument to the arbitrator or the carriers"]
          ]
        },
        notes: [
          "Open by holding up the Mediation Binder: “This one persuaded. The next one is evidence.” Then write 06/02/2027 on the board; everything in this lesson counts back from the exchange.",
          "Ask the room: “Who can say the doorbell video is what we say it is?” Let them reach Margaret Doe as the camera's owner, the 02/19/2026 copy and the chain of custody. Whether anyone testifies is Atty. Thorne's decision.",
          "Relaxed evidence rules are where trainees get careless. Make them say it back: relaxed admission is not full weight, and the clause may relax nothing at all. Confirm the forum's rules.",
          "Hold the privilege line. The CM flags; Atty. Thorne decides. An internal memo in an exchanged set cannot be unsent."
        ]
      },

      {
        kind: "activity", id: "d4m3-a2",
        title: "Assembling the 6-Tab Arbitration Binder",
        topic: "Skill Activity 2 — sort, QC and defuse two landmines before 06/02/2027",
        visual: "A sorting board. Left column: the unsorted folder as a pile of white document cards, four flagged red: DRAFT COMPLAINT → EXCLUDE · GRAYSCALE STILLS → REPRINT IN COLOR · IMPASSE MEMO → ATTY. THORNE DECIDES · MEDPAY $5,000.00 LIEN → STRIP. Right two-thirds: six navy tab columns ①–⑥, each headed by its QC rule in orange type, with sorted cards carrying C-numbers and Bates ranges as mono pills. Tab 1's first exhibit, C-1 BI EXHAUSTION, carries an orange padlock. A bottom timeline runs 06/02/2027 EXCHANGE → 06/11/2027 BRIEF → 06/22/2027 HEARING. The argument: QC is applied as each card lands, not after the pile is sorted.",
        act: {
          scenario: "It is 05/17/2027. Keystone tendered the $10,000 BI limits at the 03/18/2027 mediation and Robert Smith was dismissed. On 04/05/2027 Harbor Point and Cardinal State disputed damages, citing the gap; Laura Whitcomb, Esq. hears the consolidated arbitration on 06/22/2027, with exhibits exchanged 06/02/2027. The unsorted exhibit folder holds a pre-filing draft of the Complaint, grayscale doorbell stills, the 09/08/2026 impasse memo, and a Lien Sheet listing Harbor Point MedPay at $5,000.00 and Summit Imaging at $2,395.00.",
          prompt: "Sort the folder into the six-tab Arbitration Binder and apply each tab's QC rule as you go. Lead with the BI exhaustion record, number every exhibit C-1 onward with its Bates range, and log each record's authentication. Defuse both landmines: build Tab 5's prior medical shield against the prior-injury line defense counsel pressed at the 02/18/2027 deposition (the 2021 low-back visits) and the “degenerative” MRI reading Keystone first raised on 08/05/2026, and strip the attorney's-set Lien Sheet to what is actually owed. Flag every privileged or settlement item for Atty. Thorne; nothing is exchanged until he approves the set.",
          tool: "CMS → Litigation → Exhibit index · Medical Records Requests · CMS → Financial Ledger → Net Sheet → Lien Tracker",
          output: "A six-tab, C-numbered, Bates-ranged Arbitration Binder with an authentication log, plus an audited Lien Sheet for the attorney's set, routed to Atty. Thorne for the 06/02/2027 exchange.",
          checkpoints: [
            "Tab 1: snapshot sheet (claimant John Doe; Harbor Point HP-26-7741, Cardinal State CS-26-20355, each carrier's current contact verified; arbitrator Laura Whitcomb, Esq.; hearing 06/22/2027); fee disclosures with retainer deposits confirmed paid; slot held for the final brief of 06/11/2027, never a draft",
            "Threshold exhibits first: Keystone's $10,000 tender, the UM consents, the Limited Release and Robert Smith's dismissal, with both carriers' Coverage Letters (03/02/2026 and 03/09/2026); nothing from the Confidential Mediation Statement",
            "Tab 2, arbitration pleadings: the demand under Harbor Point's clause, Cardinal State's joinder, each carrier's 04/05/2027 written position and any Scheduling Order, operative versions only; the tort complaint and answer moved to the attorney's set for Atty. Thorne's exchange decision; the pre-filing draft removed",
            "Tab 3: the full, certified RPD-26-018842 (not the public-redacted copy), identifiers redacted as the forum requires, the citation's admissibility flagged for Atty. Thorne; doorbell stills reprinted in color from the native file, chain of custody logged (copy secured 02/19/2026); event data recorder (belt buckled, 11 mph)",
            "Tab 4: treatment chart and ledger $14,817.40 tied to certified bills; a certification requested from each provider (Riverton Urgent Care, Riverton Spine & Rehab, Lakeside Orthopedics, Summit Imaging Center, Crescent Pain & Spine, Riverton Drug) and from Riverton Fire (EMS), Riverton PD and Northgate HR, receipt logged; none in 14 days → second request and subpoena flag (Crescent's, requested 05/05/2027, due 05/19); Causation Letter 06/19/2026 flagged: an opinion, not a business record, admitted per the forum's rules; the gap proved by its underlying records, the Gap Explanation Record's synthesis left for the brief",
            "Landmine 1, Tab 5: the 2021 records (three low-back chiropractic visits, resolved), the treating providers' own histories and John's 02/18/2027 deposition testimony showing no prior neck complaint, paired with the MRI's “no significant degenerative change at the adjacent levels” and the Causation Letter; if the letter is silent on the 2021 visits, flagged to Atty. Thorne to decide whether to seek a supplemental declaration from Dr. Reyes; the firm's intake questionnaire is privileged: a source, never an exhibit",
            "Landmine 2, attorney's set: Lien Sheet stripped of Harbor Point MedPay and Summit Imaging (MedPay paid Summit's $2,395.00; no MedPay reimbursement right, per the 03/02/2026 letter in the threshold record); liens Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00; Crescent holds none",
            "Tab 6, wage proof only: Northgate HR letter, 9 shifts × 8 h × $22.00 = $1,584.00; the negotiation ledger (07/20/2026 demand to the executed settlement documents, no session offers) kept in the attorney's set",
            "Impasse memo, negotiation ledger and Lien Sheet flagged for Atty. Thorne's privilege and exchange decision, none placed in the exchange set by the CM",
            "Master index: C-numbers sequential, Bates ranges match page counts, authentication column complete, forum's evidence rule noted as “confirm with Atty. Thorne”; set approved before the 06/02/2027 exchange"
          ]
        },
        ops: [
          ["Exchange on 06/02/2027, 16 days out", "Sort into six tabs, apply QC, number and Bates-range", "CMS → Litigation → Exhibit index", "C-1 onward; ranges match page counts; all four traps handled"],
          ["Lien Sheet lists MedPay and Summit Imaging", "Reconcile against the MedPay payment log, Peach State's EOB and Harbor Point's 03/02/2026 letter", "CMS → Financial Ledger → Net Sheet → Lien Tracker", "Liens $1,860.00 + $6,105.00 = $7,965.00"],
          ["Set audited", "Route the set and the flagged items to Atty. Thorne", "CMS → Tasks → Escalate", "Approved, then exchanged by 06/02/2027"]
        ],
        best: [
          "Apply the QC rule the moment a document lands in its tab.",
          "Pair every damaging record with the record that answers it.",
          "Pitfall: sorting the folder first and applying QC later.",
          "Pitfall: conceding a reimbursement right the carrier gave up in writing.",
          "Pitfall: an internal memo in an exchanged set."
        ],
        sources: ["D4#27", "D4#28", "D4#21", "D4#22", "D4#23", "D4#24", "D4#25", "D4#26"],
        rubric: {
          ai: [
            ["Sort accuracy", 15, "Every document in its tab; all four traps handled"],
            ["Threshold and numbering", 15, "Exhaustion record leads; C-numbers sequential; Bates ranges match page counts"],
            ["Prior medical shield", 15, "2021 low-back records paired with the MRI read and the Causation Letter"],
            ["Lien and wage figures", 15, "MedPay and Summit stripped; $1,860.00 + $6,105.00 = $7,965.00; wages $1,584.00"]
          ],
          trainer: [
            ["Landmine reasoning", 20, "Explains how each trap would have hurt John Doe at the hearing"],
            ["UPL boundary", 20, "Privilege, exchange and argument routed to Atty. Thorne; no expert opinion sought without his decision"]
          ]
        },
        notes: [
          "Put the four red traps on the board, then cover them before anyone sorts. The skill is categorizing, ordering and formatting under pressure, and QC applied while sorting is what is graded.",
          "Ask the room: “Harbor Point is the other side now. Our attorney's-set Lien Sheet says it is owed $5,000.00. What goes wrong?” Atty. Thorne would work John Doe's net from a reimbursement right Harbor Point gave up in writing on 03/02/2026. The sheet never goes to the arbitrator; it still has to be right.",
          "On Tab 5, watch for trainees who start arguing causation. The CM pulls and pairs the records; whether to ask Dr. Reyes for a supplemental opinion on the 2021 visits is Atty. Thorne's decision.",
          "The impasse memo is the privilege test. A trainee who files it in Tab 6 because it explains the history has misunderstood who decides what is exchanged."
        ]
      },

      {
        kind: "check", id: "d4m3-kc",
        title: "Binder Assembly Verification",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split: the question panel on the warm cream card with the orange ruled border, questions numbered in orange; below a full-width orange hairline, the CM SELF-SUMMARY on a navy card with its three prompts, beside the 1–5 SKILL SCALE ladder with the competency rows beneath. One addition above the questions: two slim binder spines side by side, SIX SECTIONS · MEDIATION and SIX TABS · ARBITRATION, joined by a single navy bar, MASTER INDEX, with a VERIFIED stamp that turns orange only when both spines are checked. Far right, the 60/40 split as a stacked bar, with UPL as a separate red gate chip below it.",
        check: {
          questions: [
            "Name the six sections of John Doe's Mediation Binder in order, with one document from this file that belongs in each.",
            "What does the master index record for every exhibit, and why is the CMS index, not the printed binder, the one source of truth?",
            "The 11/12/2026 answer pleads that John Doe was unbelted. Which section tells you that defense is in play, and which exhibits answer it?"
          ],
          summary: [
            "Summarize what you learned about building a binder an attorney can work from at speed: the principles, not the clicks.",
            "Articulate your strategy: the exchange set is with Atty. Thorne for approval. What is your next action, and why is it the right one rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Indexing exhibits: numbering, Bates ranges and a master index",
            "Assembling a six-section Mediation Binder",
            "Running a pre-mediation audit of the ledger and the liens",
            "Assembling a six-tab Arbitration Binder with its QC rules",
            "Authenticating records and tracking business-records certifications",
            "Leaving argument, exchange and privilege to Atty. Thorne"
          ]
        },
        best: [
          "Answer with this file's exhibits, dates and figures, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D4#7", "D4#9", "D4#10", "D4#13", "D4#15", "D4#21", "D4#24", "D4#26", "Newly authored: exhibit numbering, Bates ranges and the master index as the one source of truth", "Newly authored: authentication, business-records certifications, relaxed evidence rules in arbitration, and mediation confidentiality at the hand-off"],
        rubric: {
          ai: [
            ["Section and tab recall", 15, "Six mediation sections and six arbitration tabs in order, with this file's documents"],
            ["Indexing and evidence", 15, "Master index fields, one source of truth, business-records certification, “confirm the forum's rules”"],
            ["File accuracy", 20, "Pleaded defenses and their exhibits; the $10,000 tender as the threshold; Peach State's $1,860.00 as the only claim on the Crescent bill"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slides"],
            ["UPL boundary", 10, "Argument, exchange and privilege decisions reserved to Atty. Thorne"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Open by having each trainee put their two master indexes side by side. This check verifies the binders they built, not their memory of the slides.",
          "Ask the room: “Which document would hurt John Doe most if it were missing from these binders, and which would hurt most if it were included?” The usual pair is the Causation Letter and the impasse memo; make them say why.",
          "Question 7 is the pressure scenario. The right answer requests the missing records and a certification covering all 33 visits at once, tells Atty. Thorne that evening, and leaves to him how the exchange is handled. It never exchanges a ledger that its records no longer support.",
          "Compare each self-rating with the score. UPL is a gate: a strong score does not survive a privileged memo in an exchanged set."
        ]
      }

      ]
    },

    /* ---------- DAY 4 · MODULE 4 ---------- */
    {
      n: 4, id: "d4m4",
      title: "Administrative Bottlenecks & CMS Countermeasures",
      about: "Silent adjusters, late records and unconfirmed dates on the Track B file: CMS countermeasure triggers, the 48-Hour Mandate, the escalation ladder, and a bottleneck report Atty. Thorne can act on in one read.",
      quiz: [
        {q: "Keystone left the follow-ups of 08/24 and 08/31/2026 unanswered. Under the 48-Hour Mandate, when did the written escalation to Keystone's claims supervisor go out?",
         opts: ["08/26/2026", "09/02/2026", "09/04/2026", "09/08/2026"],
         a: 1, r: "48 hours after the second unanswered follow-up (08/31): 09/02. The supervisor's silence through 09/04 moved the file to Atty. Thorne, and the impasse memo reached him 09/08."},
        {q: "Keystone's attendee with settlement authority for the 03/18/2027 mediation is still unconfirmed. On what date does Rule 3, the 10-day red flag, fire for the session?",
         opts: ["03/01/2027", "03/08/2027", "03/11/2027", "03/16/2027"],
         a: 1, r: "Ten days before 03/18/2027 is 03/08/2027. 03/01 is the red flag for the 03/11 binder, and 03/16 is the 48-hour audit. The flag goes to Atty. Thorne so he can raise it with defense counsel."},
        {q: "John Doe's UM arbitration is binding. Which bottleneck is hardest to recover from?",
         opts: ["An exhibit excluded because it was missing or unreadable", "Cardinal State confirming the exchange method a week late", "A binder tab out of order, caught at the 48-hour audit", "A hearing-room change made by the arbitrator's office"],
         a: 0, r: "There is no second hearing. An excluded exhibit is gone for good; the other three can be fixed before 06/22/2027."},
        {q: "Which of these does NOT belong in a bottleneck report to Atty. Thorne?",
         opts: ["The date the blocker started", "The hard date it threatens", "What was tried, rung by rung, with dates", "Your view of what the claim is worth if it isn't fixed"],
         a: 3, r: "The five fields are the blocker, the date it started, the hard date it threatens, what was tried, and the ask. Value is Atty. Thorne's call and never goes in a Case Manager's report."},
        {q: "On 05/24/2027, Riverton Spine & Rehab's refreshed ledger (05/21) restores the 05/04/2026 duplicate: $6,290.00 against the audited $6,105.00. With exhibits exchanged 06/02/2027, the Case Manager:",
         opts: ["Escalates it to Atty. Thorne at Rung 3 before anything else", "Exchanges $6,290.00, since it is the provider's latest figure", "Holds the whole exhibit exchange until Riverton issues a corrected ledger", "Fixes it at Rung 1 the same day: returns the audit to Riverton's billing office and keeps $6,105.00 in the set with the duplicate documented, so medical Specials stay $14,817.40"],
         a: 3, r: "Rung 1 problems are solved at Rung 1; the items needing Atty. Thorne's decision (Crescent's certification, Dr. Reyes's declaration, Cardinal State's silence) go to him first. An unverified $6,290.00 invites the carriers to doubt every other number, and holding the exchange for one record is the pitfall."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d4m4-l1", brief: true,
        title: "Identifying Non-Responsive Adjusters, Delayed Records & Scheduling Bottlenecks",
        topic: "Name the bottleneck by the date it threatens",
        visual: "A Track B timeline runs across the full slide on a navy rail, hard dates as mono pills: 08/21/2026 · 03/11/2027 · 03/18/2027 · 03/31/2027 · 06/02/2027 · 06/22/2027. Above it, three cream cards with orange numbered badges: ① NON-RESPONSIVE PARTY ② DELAYED RECORD ③ SCHEDULING, each dropping an orange leader line to the date it threatens. Card ① is the largest, with a red danger callout beneath it: “$10,000 carrier · $40,000 frozen.” Right edge, behind a thin vertical rule, two stacked chips: MEDIATION — a gap costs leverage (navy) and ARBITRATION — a gap costs evidence (red). The argument: a bottleneck is measured by the hard date it threatens, not by how irritating it is.",
        tell: {
          why: "On Track B, Keystone held at $3,500 on the 14-Day Gap, then went silent: a $10,000 carrier froze the whole $40,000 stack and forked the file into suit. Bottlenecks look like a quiet inbox, a record “on its way”, an unconfirmed date. Anticipate them, and clear them before they cost a deadline or an exhibit.",
          rules: [
            "A bottleneck is any dependency that can stop the file reaching a hard date. Log it the day it starts, with the hard date it threatens; age it daily.",
            "Non-responsive adjuster: follow up every 5 business days and log date, time, method and outcome. Keystone left 08/24 and 08/31/2026 unanswered, then the 09/02 escalation.",
            "Silence is a position. Record it as dated facts (“no response to 08/24, 08/31 or 09/02”), never as “adjuster busy”. With BI unexhausted, Host UM and Relative UM cannot open.",
            "Delayed records: a request unanswered after 14 days is a bottleneck, not a wait. The biggest mediation bottleneck is an unverified ledger: Specials $16,401.40, Riverton Spine & Rehab audited to $6,105.00, Peach State asserting $1,860.00.",
            "Missing decision-maker: a representative without authority to pay sinks a mediation. Verified ledgers reach Keystone via defense counsel, as Atty. Thorne directs, in time for an authority raise.",
            "Brief alignment: the confidential statement and binder reach Hon. Carla Benton (Ret.) by 03/11/2027 with every critical exhibit (MRI, Causation Letter, Police Report, doorbell video). A late brief stalls her.",
            "Arbitration is binding: no second hearing. An exhibit not exchanged by 06/02/2027 can be excluded; one that is illegible or not a fair and accurate copy can be excluded or given little weight. Print stills in color from the native file so nothing turns on quality.",
            "Shield the prior: the 2021 low-back chiropractic visits will be used to discount the neck injury. Package them with an expert declaration, as Atty. Thorne directs.",
            "Scheduling: sync the neutral's, the parties' and Atty. Thorne's windows before a date is offered. Mediation is completed by 03/31/2027; the arbitration brief is docketed 06/11/2027. A date outside the order is no date."
          ],
          upl: [
            "You may chase, document, flag and report a bottleneck. You may not choose a legal remedy (a subpoena, a motion, an extension), discuss value with a carrier, or tell John Doe what Keystone's silence means for his claim. Those are Atty. Thorne's."
          ]
        },
        show: {
          caption: "Five bottlenecks on the Track B file, their early signals and the dates they threaten",
          type: "table",
          head: ["Bottleneck", "On this file", "Early signal", "Hard date threatened"],
          rows: [
            ["Non-responsive adjuster", "Keystone (Dana Whitfield) after its “final” $3,500", "Second follow-up unanswered", "UM can't open; SOL cutoff 11/05/2027"],
            ["Delayed record", "Riverton Spine & Rehab's Final Ledger", "No answer 14 days after the request", "Binder to the mediator 03/11/2027"],
            ["Missing decision-maker", "Keystone's mediation attendee", "Authority unconfirmed 10 days out", "Mediation 03/18/2027"],
            ["Scheduling", "A proposed mediation date", "Falls after the order's deadline", "Mediation completed by 03/31/2027"],
            ["Evidentiary exclusion", "Arbitration exhibits, prior-medical shield", "An exhibit incomplete 10 days out", "Exhibit exchange 06/02/2027"]
          ]
        },
        ops: [
          ["A follow-up goes unanswered", "Log it and date the next follow-up on the 5-business-day cadence", "CMS → Communications Log", "Date, time, method and outcome logged; next follow-up dated"],
          ["The second follow-up goes unanswered", "Open a bottleneck entry: blocker, start date, hard date threatened", "CMS → Case File → Bottleneck Log", "Start date is the first unanswered request (Keystone: 08/24/2026)"],
          ["A proposed ADR date arrives", "Check it against every party's window and the hard-date calendar before anyone accepts it", "Case Docket & Calendar Conflict Resolver", "No mediation date after 03/31/2027 reaches Atty. Thorne as available"],
          ["A binder or exhibit dependency is open 10 days out", "Red-flag it and tell Atty. Thorne", "CMS → Case File → Risk Flags", "Flag dated 03/01/2027 for the 03/11/2027 binder"]
        ],
        best: [
          "Anticipate and eliminate: a bottleneck found at the deadline was found too late.",
          "The single biggest mediation bottleneck is an unverified medical ledger.",
          "Follow up in writing as well as by phone; a call alone leaves nothing to prove the silence with.",
          "Pitfall: a confidential statement that reaches the mediator ten minutes before the session.",
          "Pitfall: damage photos or video stills printed in grayscale for a binding hearing.",
          "Pitfall: logging silence as “adjuster busy” instead of the dates that prove it."
        ],
        sources: ["D4#29", "D4#30", "LSH Claims Specialist: BI liability follow-ups (every 5 business days) and the escalation protocol"],
        rubric: {
          ai: [
            ["Bottleneck classification", 20, "Each problem placed in its family (party, record, scheduling) with this file's example"],
            ["Dates and hard dates", 20, "08/24, 08/31, 09/02, 09/04/2026 and 03/11, 03/18, 03/31, 06/02, 06/11/2027 matched to the right bottleneck"],
            ["Mediation and arbitration traps", 20, "Unverified ledger, missing decision-maker, late brief; exclusion, unshielded prior, missed cutoff"]
          ],
          trainer: [
            ["Anticipation", 25, "Names each bottleneck from its early signal, before the hard date makes it obvious"],
            ["UPL boundary", 15, "Chases and reports; never chooses a legal remedy, discusses value or explains Keystone's silence to John Doe"]
          ]
        },
        notes: [
          "Open on the frozen stack: put $10,000 beside $40,000 and ask, “How much of John Doe's coverage did Keystone's silence lock?” All of it. That is what one unmanaged bottleneck costs.",
          "Ask the room: “When did the Keystone bottleneck start: 08/21, 08/24 or 09/04?” The lapse on 08/21 was a negotiating outcome; the silence began with the first unanswered request, 08/24. The log has to show it from that day, not from the day it hurt.",
          "Watch for trainees treating mediation and arbitration bottlenecks alike. A thin Mediation Binder costs leverage; a missing arbitration exhibit can be excluded from a binding hearing. Evidentiary exclusion is the hardest landmine to recover from.",
          "The decision-maker trap: an adjuster who arrives with authority well below the limits means the package and verified ledgers reached the carrier too late for an authority raise. Keystone tendered the $10,000 limits at mediation on 03/18/2027; someone in the room had to be able to pay them."
        ]
      },

      {
        kind: "activity", id: "d4m4-a1",
        title: "Automated Countermeasure Triggering in CMS",
        topic: "Skill Activity 1 — rules that fire before the deadline does",
        visual: "A CMS rules panel fills the left two-thirds: four rule rows on cream cards, each with an orange numbered badge and a mono threshold pill — ① SILENCE · 48 H ② RECORDS · 14 D ③ RED FLAG · 10 D ④ AUDIT · 48 H — and an IF → THEN → OWNER line in navy type. Right third: a vertical firing log for the mediation calendar, one dated row per firing, the 03/11/2027 and 03/18/2027 hard dates as red pills at the foot. Across the top, a slim grey CALIBRATION strip shows the Keystone record with Rule ① firing on 09/02/2026 and 09/04/2026, ticked green. The argument: a rule is trusted on live dates only after it reproduces a known record.",
        act: {
          scenario: "File date 02/22/2027 (Track B, in suit). Mediation with Hon. Carla Benton (Ret.) is 03/18/2027; the confidential statement and binder are due to her 03/11/2027. Riverton Spine & Rehab's Final Itemized Ledger, requested 02/08/2027 for the binder, has not arrived. Keystone's representative and authority for the session are unconfirmed. Calibration record: Keystone follow-ups 08/24 and 08/31/2026 unanswered; supervisor escalation 09/02; silence on 09/04. The demand-stage audit holds Riverton at $6,105.00 (33 visits × $185.00); Peach State's EOB shows $1,860.00 paid on Crescent Pain & Spine's $3,400.00 bill.",
          prompt: "Configure four countermeasure rules in the CMS: (1) silence: follow-ups every 5 business days; 48 h after the second unanswered → supervisor; 48 h more → Atty. Thorne; (2) a record not received 14 days after request → second request and a subpoena flag for Atty. Thorne; (3) a hard date 10 days out with an open dependency → red flag; (4) the 48-Hour Mandate audit before every hard date, with its contents (ledger against EOBs, binder, OCR) and the fallback if a record is still missing. Calibrate Rule 1 on the Keystone record, then fire all four on the mediation calendar: date, action, owner. Graded: the dates, and what you own versus what is his.",
          tool: "CMS → Tasks → Countermeasure rules · CMS → Calendar · CMS → Case File → Risk Flags",
          output: "Four configured rules, calibrated on the Keystone record, with every firing on the mediation calendar dated, actioned and owned.",
          checkpoints: [
            "Rule 1 set: follow-ups every 5 business days; supervisor escalation 48 hours after the second unanswered follow-up; Atty. Thorne 48 hours after an unanswered escalation",
            "Calibration reproduces the file: Rule 1 fires 09/02/2026 (supervisor escalation) and 09/04/2026 (escalation task opened to Atty. Thorne that day; the full impasse memo followed on 09/08/2026, the first business day after the Labor Day weekend)",
            "Rule 2 fires 02/22/2027 (02/08/2027 + 14 days): the Case Manager sends the second request to Riverton Spine & Rehab's office manager that day as a Notice of Delay",
            "Subpoena flagged to Atty. Thorne as a decision for him; any draft is for his review and signature, never served by the Case Manager",
            "Rule 3 red flags dated 03/01/2027 (10 days before 03/11/2027) for the ledger and 03/08/2027 (10 days before 03/18/2027) for Keystone's attendee with settlement authority, for Atty. Thorne to raise with defense counsel",
            "Rule 4 audits set for 03/09/2027 (binder) and 03/16/2027 (session), both weekdays: ledgers verified, binder complete, digital set OCR-searchable",
            "EOB reconciliation run now and re-checked at each audit: Peach State's $1,860.00 is its whole claim on Crescent's $3,400.00 bill; the $1,540.00 written off ($3,400.00 minus $1,860.00) is never carried as a lien",
            "Fallback recorded if the ledger is still missing at the 03/09/2027 audit: escalate, mark the treatment “Pending Final Verification”, include the audited interim ledger ($6,105.00: 33 visits × $185.00), Atty. Thorne sets expectations",
            "Every firing carries a date, an action and an owner",
            "No rule sends an external message on its own; every firing opens a task or a flag for review"
          ]
        },
        ops: [
          ["A request needs an answer", "Stamp it with its rule and response-due date", "CMS → Tasks → Countermeasure rules", "No open request without a rule and a due date"],
          ["A rule fires", "Execute its action the same day and log it", "CMS → Tasks → Escalate · CMS → Communications Log", "Firing logged and its task opened the same day"],
          ["A hard date is docketed", "Attach the 10-day red-flag check and the 48-hour audit to it", "CMS → Calendar", "Both tasks present for 03/11/2027 and 03/18/2027"],
          ["Atty. Thorne issues a records subpoena", "Put it on a recurring 10-day compliance review", "CMS → Calendar", "Review recurs every 10 days until compliance is logged"]
        ],
        best: [
          "Calibrate on a known record before you trust a rule on live dates.",
          "When a 48-hour audit lands on a weekend or holiday, move it earlier, never later.",
          "Inbound runs faster: anything from the court or opposing counsel is docketed, and Atty. Thorne alerted, the day it arrives (an RFA the hour it arrives). Filing and naming it to the convention can follow within 48 hours.",
          "Pitfall: waiting for the perfect ledger instead of escalating.",
          "Pitfall: a trigger that fires into an inbox nobody owns."
        ],
        sources: ["D4#31", "D5#25", "D4#29", "LSH Claims Specialist: BI liability follow-ups and the escalation protocol"],
        rubric: {
          ai: [
            ["Rule configuration", 15, "Four rules with the right thresholds: 5 business days and 48 hours, 14 days, 10 days, 48-hour audit"],
            ["Calibration", 10, "Rule 1 fires on 09/02/2026 and 09/04/2026"],
            ["Firing dates", 25, "02/22, 03/01, 03/08, 03/09 and 03/16/2027, each with an action and an owner"],
            ["Audit and fallback fields", 10, "EOB reconciliation run early and re-checked at the audit; “Pending Final Verification”, interim ledger $6,105.00, escalation to Atty. Thorne"]
          ],
          trainer: [
            ["Ownership judgment", 25, "Separates what the CM fixes from what needs Atty. Thorne's decision"],
            ["Authority boundary", 15, "Subpoena flagged for decision; no rule contacts defense counsel, the mediator or John Doe unreviewed"]
          ]
        },
        notes: [
          "Run the calibration live first: enter the Keystone dates and let the room watch Rule 1 fire on 09/02 and 09/04. A rule that can't reproduce a known record can't be trusted on a live one.",
          "Ask: “The ledger is still missing at the 03/09/2027 audit. Do you hold the binder?” No. Escalate, mark the treatment “Pending Final Verification”, send the interim ledger, and let Atty. Thorne set expectations.",
          "Watch for subpoena flags written as if the subpoena were decided. The flag asks a question; Atty. Thorne answers it. Rules on records subpoenas to non-parties (notice to the other side, time to comply) vary: confirm the court's rules.",
          "Grade the dates hard: every firing date is arithmetic from the file. The authority red flag on 03/08/2027 is the one trainees forget, and it is the missing-decision-maker trap. The EOB line tests whether they know a contract-rate payment closes the bill."
        ]
      },

      {
        kind: "lesson", id: "d4m4-l2", brief: true,
        title: "Escalation Workflows & Supervisory Reporting Guidelines",
        topic: "The ladder decides who hears; the report decides whether they can act",
        visual: "Left third: a three-rung ladder drawn bottom-up, navy rungs with orange numbered badges — ① SOURCE ② SUPERVISOR · NOTICE OF DELAY ③ ATTY. THORNE — a 48 H mono pill on the rail between each pair. Under the ladder, a red danger strip: “Don't skip. Don't sit.” Right two-thirds: the bottleneck report as a white memo card with a navy header bar, five fields called out by orange badges — ① Blocker ② Started ③ Threatens ④ Tried ⑤ The ask — each filled in with Keystone's dates in mono type. The ask is boxed in orange and is the only field in bold. The argument: escalation is a sequence, and the report is what lets counsel act in one read.",
        tell: {
          why: "An escalation without the dates, the threatened deadline and a clear ask makes Atty. Thorne do your research before he can decide. The ladder decides who hears about a bottleneck and when; the report decides whether they can act on it in one read.",
          rules: [
            "Climb one rung at a time and log each attempt. Rung 1: the source, on the follow-up cadence. Rung 2: its supervisor or office manager, with a written Notice of Delay. Rung 3: Atty. Thorne.",
            "The Notice of Delay states facts: what is outstanding, since when, the hard date it threatens, and a request to review the delay. It never argues bad faith or the insured's exposure; that analysis is Atty. Thorne's.",
            "The 48-Hour Mandate times the climb: after the second unanswered follow-up, each step gets 48 hours before silence moves the file up. Keystone: second follow-up 08/31 → supervisor 09/02 → silence 09/04 → Atty. Thorne; impasse memo 09/08/2026.",
            "It also audits: 48 hours before every hard date, check ledgers against EOBs, the binder for completeness, the set for OCR. What it finds is escalated that day.",
            "Rung 3 is where legal tools live: a certified request for a written position, a subpoena, a motion to compel, an extension. You may name it in the ask as a question (“Do you want a records subpoena?”); Atty. Thorne decides, signs and sends.",
            "Don't skip, don't sit. Skipping Rungs 1 and 2 spends his time on a supervisor's problem. With a hard date 10 days out, red-flag and tell him in parallel while the rungs continue.",
            "Every report carries five fields: the blocker; the date it started; the hard date it threatens; what was tried (each rung, date, method, result); the ask: the decision needed and by when. One ask per blocker, nearest hard date first.",
            "Zero defaults: by the hard date, the filing is ready with what you have, marked “Pending Final Verification”, or Atty. Thorne holds the extension in the form the rule requires (a stipulation where court rules allow, a court order, or the arbitrator's written order). Until it is docketed, the date stands.",
            "Report up, not out: Atty. Thorne gets the Bottleneck Log weekly, each open item with its age and days to its hard date. A party with counsel is reached only through counsel, as he directs."
          ],
          upl: [
            "You may escalate, report and ask Atty. Thorne whether to use a legal tool. You may not choose it, sign or send it, contact a represented party, or tell John Doe what a delay means for his claim; you tell him what the firm is doing and route the rest to Atty. Thorne."
          ]
        },
        show: {
          caption: "The five-field report, filled in for Keystone as it reached Atty. Thorne on 09/08/2026",
          type: "table",
          head: ["Field", "Keystone Mutual · KM-26-440871", "Why it is there"],
          rows: [
            ["Blocker", "Dana Whitfield holds at $3,500 (“final”, 08/12) and has stopped responding", "Names who owes what"],
            ["Started", "08/24/2026, the first unanswered follow-up", "Ages the problem honestly"],
            ["Threatens", "BI exhaustion: the $20,000 Host UM and $10,000 Relative UM stay closed; SOL filing cutoff 11/05/2027", "Sets the urgency by date, not tone"],
            ["Tried", "Follow-ups 08/24 and 08/31; supervisor escalation 09/02; no response 09/04", "Proves the rungs were climbed"],
            ["The ask", "Your decision on how the firm proceeds, needed this week; full record attached. No recommendation on filing.", "One decision, ready to make"]
          ]
        },
        ops: [
          ["Rung 1 unanswered on its cadence", "Send a written Notice of Delay to the supervisor or office manager", "Email Workspace · CMS → Communications Log", "Notice names the item, start date and hard date; date, time and method logged"],
          ["Rung 2 unanswered for 48 hours", "Escalate to Atty. Thorne with the five-field report", "CMS → Tasks → Escalate", "All five fields complete; one ask per blocker"],
          ["Weekly reporting day", "Send the Bottleneck Log with each item's age and days to its hard date", "CMS → Case File → Bottleneck Log", "No open item without an owner, an age and a hard date"],
          ["A hard date arrives with the blocker open", "Prepare the filing or exchange with what you have, marked “Pending Final Verification”, for Atty. Thorne's sign-off, or confirm his extension, in the form the rule requires, is docketed", "CMS → Calendar · CMS → Documents → Outgoing", "Zero defaults: every hard date met or covered by an extension in the form the rule requires"]
        ],
        best: [
          "Climb one rung at a time and document each attempt.",
          "Lead the report with the nearest hard date.",
          "Write the ask as one decision and the date it is needed by.",
          "Pitfall: going straight to Atty. Thorne before the source and its supervisor have been tried.",
          "Pitfall: “Keystone still isn't responding, please advise”, with no dates.",
          "Pitfall: letting a deadline pass because a record was late."
        ],
        sources: ["D1#45", "D4#31", "D5#32", "LSH Claims Specialist: escalation protocol (supervisor review, internal flag, certified request for a written position)"],
        rubric: {
          ai: [
            ["Ladder sequence", 20, "Source → supervisor with a Notice of Delay → Atty. Thorne, 48 hours per rung, each attempt logged"],
            ["Report fields", 25, "All five fields, with Keystone's dates 08/24, 08/31, 09/02 and 09/04/2026 correct"],
            ["Mandate and zero defaults", 15, "48-hour audit before every hard date; every hard date met with what is in hand, marked pending, or covered by an extension in the form the rule requires"]
          ],
          trainer: [
            ["Report clarity", 20, "Atty. Thorne can act in one read; facts, not adjectives"],
            ["UPL boundary", 20, "Asks, as a question, without choosing a legal tool; no contact with a represented party; nothing on value to John Doe"]
          ]
        },
        notes: [
          "Open with a bad escalation on screen: “Keystone still not responding, please advise.” Ask what Atty. Thorne has to look up before he can act. Every answer is a field the report should have carried.",
          "Ask: “Who should have heard about the Keystone silence first: Dana Whitfield's supervisor or Atty. Thorne?” The supervisor, on 09/02. Skipping the rung spends counsel's time on a problem a claims supervisor might have solved.",
          "Watch the zero-default rule. Under pressure, trainees hold an exchange to wait for one record. The rule is: send what you have, marked pending, or have Atty. Thorne's extension in the form the rule requires (stipulation, court order or arbitrator's order), docketed. Never neither.",
          "Legal nuance: a certified request for a written position, a subpoena and a motion to compel are counsel's tools, and the rules for each (who may issue it, notice, time to comply) vary by court and forum. The Case Manager may name them in the ask; Atty. Thorne decides, signs and sends."
        ]
      },

      {
        kind: "activity", id: "d4m4-a2",
        title: "Bottleneck Resolution Simulation",
        topic: "Skill Activity 2 — five problems, nine days, one order",
        visual: "A triage board fills the slide: five problem cards in a column on the left, each a cream card with an orange numbered badge and a mono pill for the hard date it threatens. The centre is a three-lane sequencing track — SEND TO ATTY. THORNE · FIX TODAY · VERIFY AT 48-HOUR AUDIT — that the trainee drags cards into, with slot numbers 1–5 along the top. Above the track, a red countdown chip: EXHIBIT EXCHANGE 06/02/2027 · 9 DAYS. Right edge, a slim white memo card titled BOTTLENECK REPORT fills field by field as escalated cards land. The argument: the easiest fix is rarely the first move.",
        act: {
          scenario: "File date 05/24/2027 (Mon). Consolidated UM arbitration, Laura Whitcomb, Esq.: exhibit exchange 06/02/2027, brief 06/11/2027, hearing 06/22/2027. (1) Crescent Pain & Spine's certified records and bill for the 05/15/2026 injection: requested 05/05/2027; second request and subpoena flag 05/19; nothing received. (2) Dr. Reyes's declaration shielding the 2021 low-back visits: Lakeside says she is away until 06/01/2027. (3) Cardinal State (Teresa Okafor) has not confirmed the hearing format or exhibit-exchange method; Harbor Point confirmed 05/20; the Case Manager escalated to Okafor's supervisor in writing 05/21; no answer. CMS → Parties shows neither carrier has appeared through counsel in the arbitration. (4) Riverton Spine & Rehab's refreshed ledger (05/21) restores the 05/04/2026 duplicate: $6,290.00 against the audited $6,105.00. (5) The copy vendor's draft set prints the doorbell-video stills in grayscale; the PDFs are not OCR-searchable.",
          prompt: "Triage all five problems in the CMS. For each, name the hard date it threatens, the rung it has reached and the countermeasure that applies. Sequence them: what goes to Atty. Thorne first, what you fix yourself today, what the 48-hour audit verifies and on which date. Then write one bottleneck report carrying every item that needs his decision, five fields and one ask each. Graded: the order and its reasons, the rung for each item, and keeping every legal choice with Atty. Thorne.",
          tool: "Case Docket & Calendar Conflict Resolver · CMS → Case File → Bottleneck Log · CMS → Tasks → Escalate",
          output: "A sequenced triage of all five problems and one five-field bottleneck report to Atty. Thorne, sent 05/24/2027.",
          checkpoints: [
            "Every item mapped to the 06/02/2027 exchange (05/24 + 9 days, inside the 10-day red-flag window); item 3 also to the 06/22/2027 hearing",
            "Items 1, 2 and 3 escalated first, in one report sent 05/24/2027, nearest hard date first: each needs Atty. Thorne's decision",
            "Item 1's ask leaves the route to him: with the bodily-injury claims against Robert Smith dismissed, a records subpoena for the arbitration would issue under the arbitration's rules, if they allow it; confirm with Atty. Thorne what, if anything, remains pending in No. 26-CV-04417. Item 1 also asks, as a question for his decision, whether to exchange the uncertified copies already on file marked “Pending Final Verification”",
            "Item 2 reported as a gap in the prior-medical shield (Dr. Reyes back 06/01/2027, one day before the 06/02/2027 exchange), with the options framed as questions",
            "Before any rung on item 3, CMS → Parties checked: had either carrier appeared through counsel, logistics would go to that counsel as Atty. Thorne directs, and the ladder would run opposing counsel → Atty. Thorne",
            "Item 3: the 48 hours after the 05/21/2027 (Fri) escalation ran out 05/23/2027, a Sunday, so it reaches Atty. Thorne today at Rung 3; no direct contact with the arbitrator",
            "Item 4 fixed at Rung 1 the same day: audit returned to Riverton's billing office; the exhibit set keeps $6,105.00 with the 05/04/2026 duplicate documented; medical Specials stay $14,817.40",
            "Item 5 fixed without escalation: stills reprinted in color, the digital set OCR-scanned, the index re-checked",
            "48-Hour Mandate audit set for Fri 05/28/2027: 48 hours before 06/02/2027 is 05/31/2027, Memorial Day, so the audit moves earlier, never later",
            "Root cause of item 1 named: Crescent's first request went out 05/05/2027, a month after the 04/05/2027 invocation; the binder rule is to request every certification that week. The bottleneck began with our own delay",
            "Nothing decided that is Atty. Thorne's: no exhibit withheld or substituted, no extension requested, no lien compromised"
          ]
        },
        ops: [
          ["Several bottlenecks open at once", "Triage each by hard date, reversibility and owner", "Case Docket & Calendar Conflict Resolver", "Every item has a hard date, a rung and an owner"],
          ["Items need counsel's decision", "Send one five-field report, nearest hard date first", "CMS → Tasks → Escalate", "Report sent 05/24/2027, the day the cluster is triaged"],
          ["Items the Case Manager owns", "Fix and log them the same day; set the pre-exchange audit", "CMS → Documents · CMS → Calendar", "Ledger and exhibit-set fixes logged 05/24/2027; audit on the calendar for 05/28/2027"]
        ],
        best: [
          "Longest lead first: send what needs someone else's decision before you fix what you own.",
          "Protect the exhibit exchange first; exclusion is the landmine you can't walk back.",
          "An unverified ledger in an exhibit set invites the carriers to doubt every other number.",
          "Pitfall: escalating the grayscale reprint while sitting on the missing certification.",
          "Pitfall: holding the whole exhibit exchange for one late record."
        ],
        sources: ["D4#30", "D4#29", "D4#31", "D1#45"],
        rubric: {
          ai: [
            ["Hard-date mapping", 15, "All five items tied to 06/02/2027; item 3 also to 06/22/2027"],
            ["Sequence", 15, "Items needing Atty. Thorne reported first; items 4 and 5 fixed the same day; audit set for 05/28/2027"],
            ["Rung accuracy", 15, "Item 3 at Rung 3 on 05/24/2027; items 4 and 5 at Rung 1; item 1 past Rung 2"],
            ["Report fields", 15, "Five fields and one ask for every escalated item"]
          ],
          trainer: [
            ["Triage judgment", 20, "The order is justified by reversibility and lead time, not by ease"],
            ["Authority boundary", 20, "Every legal route, exhibit choice and extension left to Atty. Thorne; no contact with the arbitrator"]
          ]
        },
        notes: [
          "Read the five problems aloud and take a show of hands: which one first? Most pick the grayscale reprint because it is easy. Easy is not first.",
          "Ask: “Which of these can still hurt John Doe after 06/22/2027?” A missing certification or an unshielded prior can cost evidence at a binding hearing; a grayscale print fixed today cannot.",
          "Watch for trainees who email the arbitrator about Cardinal State's silence. Communications with the neutral go through Atty. Thorne under the forum's rules. The carriers dispute damages on the 14-Day Gap, which is why every medical exhibit matters here.",
          "Item 4 is the unverified-ledger trap in arbitration dress: $6,290.00 in an exhibit invites the carriers to question every other number, and Riverton's ledger is also the record of the 19-day disruption (04/02 → 04/21/2026). Grade the reasons for the order, not just the order."
        ]
      },

      {
        kind: "check", id: "d4m4-kc",
        title: "Countermeasure Operational Audit",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split: cream question panel above, navy CM Self-Summary card below-left with the 1–5 skill ladder below-right, and the 60/40 strip with the separate red UPL gate on the far right. Unique to this module: between the question panel and the summary card, a horizontal COUNTERMEASURE AUDIT strip of four rule chips — SILENCE 48 H · RECORDS 14 D · RED FLAG 10 D · AUDIT 48 H — each with a tick box, and a fifth chip in orange, REPORT · 5 FIELDS, so the trainee audits the whole system before answering.",
        check: {
          questions: [
            "Name the three bottleneck families and give this file's example of each, with the hard date it threatened.",
            "Walk Rule 1 on the Keystone record: each follow-up, the 48-Hour Mandate escalation and the hand-off to Atty. Thorne, with every date.",
            "Keystone's representative must be able to pay the $10,000 limits at the 03/18/2027 mediation. If they arrive without that authority, what failed earlier, and what was your countermeasure?"
          ],
          summary: [
            "Summarize, in your own words, what you learned about seeing a bottleneck before it bites: the principles, not the clicks.",
            "Articulate your strategy: on 05/24/2027, with five problems open, what is your first action, and why that one rather than the easiest?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Spotting non-responsive parties, delayed records and scheduling conflicts from their early signals",
            "Configuring and calibrating CMS countermeasure triggers",
            "Running the 48-Hour Mandate audit before a hard date",
            "Climbing the escalation ladder one rung at a time",
            "Writing a five-field bottleneck report Atty. Thorne can act on in one read",
            "Keeping legal remedies, value and client advice with Atty. Thorne"
          ]
        },
        best: [
          "Answer with the file's dates; a bottleneck without dates is an opinion.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D4#29", "D4#30", "D4#31", "D1#45"],
        rubric: {
          ai: [
            ["Date accuracy", 20, "08/24, 08/31, 09/02, 09/04/2026; 03/09, 03/11, 03/18/2027; 06/02/2027"],
            ["Doctrine recall", 15, "Unverified ledger, missing decision-maker, late brief; exclusion, unshielded prior, missed cutoff; the missing-ledger protocol"],
            ["Escalation ladder", 15, "Lakeside: Rung 2 Notice of Delay 05/19/2027 (facts only, no bad-faith argument), Rung 3 to Atty. Thorne 05/21/2027 if unanswered"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The first action on 05/24/2027 is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "No value talk or offer response to Teresa Okafor; Atty. Thorne's authority named"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 5 is the pressure scenario and the module in one question: escalate, mark “Pending Final Verification”, include the interim ledger, let Atty. Thorne set expectations. A trainee who holds the binder has failed the 48-Hour Mandate.",
          "Put Question 7 to the room before they write: what do you say to Teresa Okafor? The compliant answer takes the message, says Atty. Thorne will respond, and logs it. It never answers the gap argument or the offer.",
          "Question 6 tests the ladder: 14 days unanswered on 05/19/2027 sends a written Notice of Delay to Lakeside's office manager that day; 48 hours of silence moves it to Atty. Thorne on 05/21/2027. The notice states facts and never argues motive.",
          "Compare each self-rating with the score. UPL is a gate: a strong score does not survive a value conversation with a carrier."
        ]
      }

      ]
    }

    ]
  },

  /* ==========================================================
     DAY 5 — DISPUTE RESOLUTION & LITIGATION (TRACK B)
     ========================================================== */
  {
    n: 5, id: 15,
    title: "Case Flow Day 5 · Litigation & Dropped Cases",
    phase: "Litigation & Dropped Cases",
    objective: "On Track B, document the impasse and move the file into litigation without losing a deadline; keep the pleadings and discovery logs, the trial-prep checklist and the Property Damage dispute moving; prepare John Doe for his deposition; handle a comparative-negligence defense and a client who goes missing; disburse the arbitration award on the Litigation Net Sheet; and close out a dropped practice matter with its Withdrawal Letters.",
    gate: "Track B: impasse documented, file in Litigation status, bottlenecks escalated, pleadings and discovery logs current, deposition prep done, award disbursed on the Litigation Net Sheet · practice drop closed out: Withdrawal Letters sent, status Dropped · Case Flow complete",
    discussion: "It is 01/05/2027. Opposing counsel's paralegal says your client's discovery responses are late, John Doe has changed his phone number, and the deposition is set for 02/18/2027. What do you do today, in what order, and what is Atty. Thorne's call, not yours?",
    fileState: [
      "Track B: Keystone let the Time-Limited Demand lapse on 08/21/2026; the impasse memo goes to Atty. Thorne on 09/08/2026 and the Complaint is filed 09/24/2026 (26-CV-04417).",
      "Robert Smith is served after a skip-trace (10/14/2026); Mercer & Hale answer on 11/12/2026; discovery, John Doe's deposition (02/18/2027), mediation and the UM arbitration follow.",
      "A separate practice matter is pending a drop, to be closed out with its Withdrawal Letters."
    ],
    modules: [

    /* ---------- DAY 5 · MODULE 1 ---------- */
    {
      n: 1, id: "d5m1",
      title: "Tactical Case Manager Support in Litigation",
      about: "From the filed complaint to the trial calendar: the Pleadings Log, the Discovery Calendar, the litigation file, the trial-prep checklist and the KPIs that prove nothing slipped.",
      quiz: [
        {q: "John Doe's responses to the 12/01/2026 set are docketed for 01/04/2027, as computed in the calendar audit. On 01/05/2027 you reconcile the Pleadings Log to the docket calendar. Which entry proves the file met that deadline?",
         opts: ["The 01/04/2027 due date in the calendar row", "A note that John Doe reviewed the drafts with Atty. Thorne", "The Certificate of Service dated 01/04/2027, logged and filed to 04_DISCOVERY_DEFENDANT_TO_PLAINTIFF", "Atty. Mercer's silence since the responses went out"],
         a: 2, r: "A due date proves only that the deadline was known; compliance is proved by the Certificate of Service, its date checked against 01/04/2027 and the PDF filed where the set lives. Re-derive nothing: the count was settled in the calendar audit. Log the proof, then report to Atty. Thorne."},
        {q: "On 01/05/2027 you find that the 15 Requests for Admission served on 12/01/2026 were never given their own log row. What is the danger?",
         opts: ["None; the defense must still prove every fact at trial", "Requests not answered in time may be deemed admitted, which can decide issues such as causation against John Doe", "The court extends discovery deadlines automatically over the holidays", "Only Interrogatories carry a deadline; Requests for Admission are informal"],
         a: 1, r: "An RFA not answered by its deadline may be deemed admitted. It gets its own log row and a red flag, Atty. Thorne is alerted the hour it lands, and if service of the responses can't be proved from the certificate, he hears about it today."},
        {q: "Two months after suit is filed, a Keystone adjuster calls John Doe to “just confirm a few facts.” What does the Case Manager do?",
         opts: ["Let John Doe answer, as long as he sticks to the Police Report", "Answer the adjuster's questions on John Doe's behalf", "Refer the adjuster to Harbor Point, the Host UM carrier", "Step in, end the contact, and notify Atty. Thorne the same day"],
         a: 3, r: "Trap 2 of the litigation mindset: John Doe is represented by the firm, so every contact from the defense side, adjuster or investigator, goes through Atty. Thorne (true since the Letter of Representation, and absolute once suit is filed). The CM stops the contact, logs it and tells Atty. Thorne the same day; what happens next is his call."},
        {q: "Which of these is a litigation KPI, written so it can be measured?",
         opts: ["Discovery Countdown: draft responses reach Atty. Thorne at least 7 days before the court deadline", "Keep a close eye on discovery deadlines", "Call the client whenever there is news from the court", "Review subpoenas when time allows"],
         a: 0, r: "A KPI has a formula and a target. For the 01/04/2027 deadline the Discovery Countdown target is 12/28/2026 (7 days before 01/04/2027). Litigation clients are called at least every 30 days, news or not, and subpoenas are audited every 10 days."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d5m1-l1", brief: true,
        title: "Litigation Tracking: the Pleadings Log & the Discovery Calendar",
        topic: "Managing litigation tracking systems, pleadings logs & discovery calendars",
        visual: "A full-width horizontal court timeline on a navy rail runs from 09/24/2026 to 01/13/2027, with orange numbered badges on each trigger: ① Complaint filed ② Smith served 10/14 ③ Answer 11/12 ④ Discovery mailed 12/01 ⑤ Scheduling Order 12/10 ⑥ Our set e-served 12/14. From each trigger a thin orange arrow drops to its due date in a mono pill below the rail. The 12/01 arrow is drawn in three visible segments, + 30 · + 3 MAIL · SUN → MON, so the count reads physically. Right edge, a red danger callout on a cream card: “15 RFAs · unanswered = deemed admitted.” Bottom strip: the five numbered litigation sub-folders as mono pills. The argument: every date on the calendar is a calculation anyone can re-check.",
        tell: {
          why: "On 09/24/2026 John Doe's file became Civil Action No. 26-CV-04417. An adjuster's deadline bends; a court's does not. The Pleadings Log and Discovery Calendar prove, every day, that nothing filed, served or owed has slipped.",
          rules: [
            "Litigation is not a longer negotiation. Our demand lapsed 08/21/2026; from the 09/24/2026 filing on, the court's rules set the pace.",
            "Three phases: pleadings (filing, service, Answer); discovery (calendar, gather, meet the client; most of your time); trial prep (records, subpoenas, binders).",
            "The Complaint has five parts: caption, jurisdiction, facts, causes of action, prayer for relief. Atty. Thorne drafts it; before signature you verify the filing date against the SOL and the defendant's exact legal name (a business: its registered agent).",
            "Service proves the defendant knew. Log every attempt; unserved at day 14 (10/08/2026, third failed attempt), escalate to Atty. Thorne for Skip-Trace authority, run it on his approval (10/09/2026) and update him; alternative service is his call. Smith was served 10/14/2026; affidavit filed 10/16/2026.",
            "Know the five foundational documents: the Complaint (SOL proof), the Answer (the roadmap), Interrogatories (the deadline clock), RFPs (you compile; Atty. Thorne reviews and redacts), RFAs (the danger zone).",
            "Read the Answer as a roadmap: comparative negligence, causation (the 14-Day Gap, a “degenerative” MRI), failure to mitigate. Each defense is evidence to pull.",
            "An RFA not answered in time may be deemed admitted. The 15 RFAs of 12/01/2026 get their own row and a red flag, and Atty. Thorne hears the hour they land.",
            "Count court time by the hard rules, as docketed in the calendar audit (12/01/2026 by mail → 01/04/2027). The log does not re-derive the date; it carries the arithmetic in the row and the proof of compliance beside it. Unsure? Calendar the conservative date and confirm the rule.",
            "Discovery received: calendar it that day, pull what pre-lit holds, book a 60-minute Discovery Intake Meeting; never mail John Doe 70 requests (25 + 30 + 15). He signs the verification under oath.",
            "DOE, JOHN - CASE FILE (built 09/10/2026) holds 01_PLEADINGS · 02_SERVICE_DOCS · 03_DISCOVERY_PLAINTIFF_TO_DEFENDANT · 04_DISCOVERY_DEFENDANT_TO_PLAINTIFF · 05_SUBPOENAS, apart from pre-lit mail. Name PDFs Document_Status.pdf (Complaint_Filed_Stamped.pdf), never scan001.pdf."
          ],
          upl: [
            "You track, calendar, compile and draft for review. Atty. Thorne decides what is admitted, denied or objected to and signs every filing; you never tell John Doe how to answer."
          ]
        },
        show: {
          caption: "The master timeline: every deadline is a trigger plus a count you can re-check",
          type: "table",
          head: ["Trigger", "Next action", "Standard deadline", "On this file"],
          rows: [
            ["Complaint filed", "Serve defendant", "Often 90–120 days, by rule", "Filed 09/24/2026; served 10/14/2026"],
            ["Defendant served", "Answer", "20–30 days (federal: 21)", "10/14/2026 + 30 = 11/13/2026"],
            ["Discovery mailed", "Responses", "30 days + mail days by rule (3 on this file's rule set; some courts add 5)", "12/01/2026 + 33 = 01/03/2027, Sunday → 01/04/2027"],
            ["Discovery e-served by consent", "Responses", "30 days; added days vary by court", "12/14/2026 + 30 = 01/13/2027"],
            ["Motion filed", "Response", "14–21 days, by local rule", "Calendar on receipt"]
          ]
        },
        ops: [
          ["Atty. Thorne authorizes suit", "Verify the filing date against the SOL and Robert Smith's exact legal name and address before signature", "CMS → Litigation → Pleadings Log", "Filed 09/24/2026, inside the 02/04/2028 internal hard date; Robert Smith's legal name confirmed from an independent record (for example, the Declaration Page or property or DMV records), not the Police Report alone"],
          ["Complaint filed", "File the stamped complaint in 01_PLEADINGS and log the filing", "CMS → Documents", "Filed the same day; no pre-lit correspondence in the sub-folders"],
          ["A service attempt fails", "Log it; still unserved at day 14 (here 10/08/2026, the third failed attempt), escalate to Atty. Thorne for Skip-Trace authority with the attempt log attached, run it on his approval (result 10/09/2026), and send him the status update; alternative service is his call", "CMS → Tasks → Escalate", "Each attempt logged with date and address; status update dated"],
          ["Discovery or RFAs land", "Calendar the response date with its arithmetic; alert Atty. Thorne the hour RFAs arrive", "CMS → Calendar · Docket System", "Due date = trigger + 30 (+ 3 for mail), weekend rolled; RFA alert time-stamped"]
        ],
        best: [
          "Write the trigger, the method of service and the arithmetic into every calendar entry.",
          "Every interrogatory set we send asks the three baseline questions: all insurance (primary, excess, umbrella), course and scope of employment, and surveillance. The file's verified stack is $40,000 (BI → Host UM → Relative UM); what any answer means for coverage is a question for Atty. Thorne.",
          "Property Damage is pleaded too (the Civic's Loss of Use and Diminished Value): physical evidence of the impact, and something the defense will test.",
          "In the Discovery Intake Meeting, walk John Doe through every request and record his own answers, in his words, into the response template for Atty. Thorne's review; flag every request that may call for an objection or privilege (including the scope of the 2021 chiropractic notes) for his decision; never suggest an answer. Then compile what the RFPs ask for: Northgate's wage letter, the Medical Records and bills, the 2021 chiropractic notes.",
          "Pitfall: a perfect Complaint filed one day after the SOL.",
          "Pitfall: missing a court deadline the way you might let an adjuster's deadline slide.",
          "Pitfall: an executed affidavit of service left sitting in email.",
          "Pitfall: counting the trigger day as day one."
        ],
        sources: ["D5#1", "D5#2", "D5#3", "D5#4", "D5#21", "D5#24", "D5#26", "D5#27", "D5#28", "D5#31", "Newly authored: whether e-service adds days (none on this file's rule set; the federal example)"],
        rubric: {
          ai: [
            ["Time computation", 20, "11/13/2026, 01/04/2027 and 01/13/2027 derived with the trigger day excluded, mail days applied only to mail, the weekend rolled"],
            ["Document index", 15, "Complaint, Answer, Interrogatories, RFPs and RFAs each named with its role on this file"],
            ["Answer roadmap", 15, "Comparative negligence, causation and failure to mitigate each tied to evidence on file"],
            ["File architecture", 10, "DOE, JOHN - CASE FILE and the five numbered sub-folders named exactly"]
          ],
          trainer: [
            ["Litigation mindset", 15, "Treats court deadlines as absolute; explains why a lawsuit is not a longer negotiation"],
            ["Client handling", 10, "Discovery Intake Meeting, not a mailed questionnaire; the verification page explained without coaching"],
            ["UPL boundary", 15, "No admit-or-deny call and no advice on answers; strategy and signatures left to Atty. Thorne"]
          ]
        },
        notes: [
          "Open with the question the old course asked, made specific: “Our 07/20/2026 Time-Limited Demand to Keystone lapsed unaccepted on 08/21/2026, and the 48-Hour Mandate got no answer. What is our very next legal step, and who decides it?” Suit, and Atty. Thorne decides. Then name the day: litigation support now, then the Property Damage dispute, deposition preparation, and liability disputes and MIA clients.",
          "Ask the room: “Which phase will take most of your time, and why?” Discovery. Seventy requests landed on 12/01/2026, and every one of them has a clock.",
          "Work the 12/01/2026 count on the board, one step at a time. Watch for trainees who count 12/01 as day one, stop at 12/31, or forget that 01/03/2027 is a Sunday.",
          "Legal nuance: the 30-day periods, the 3 mail days and the weekend roll-forward are configured for this training file. Whether e-service adds days differs by court (the federal rules stopped adding them for electronic service in 2016). Teach the method and the habit of confirming the rule, not a number to memorize."
        ]
      },

      {
        kind: "activity", id: "d5m1-a1",
        title: "Pleadings & Discovery Log Maintenance",
        topic: "Skill Activity 1 — repair the log before it costs the case",
        visual: "A CMS Pleadings Log screen fills the left two-thirds: a white card with a navy header bar and eight rows in mono type (Event · Trigger · Method · Due · Filed · Source). Three rows carry orange numbered badges in the left margin: ① a dashed empty slot where the affidavit-of-service row should be; ② a due date, 12/31/2026, struck through in red with 01/04/2027 in a mono pill beside it and the arithmetic under it; ③ an empty RFA slot carrying a red flag. Right third: the file tree DOE, JOHN - CASE FILE with its five numbered sub-folders, and a scan_1210.pdf chip being renamed and dropped into 01_PLEADINGS. Bottom: a red callout, “Passed and unproven = escalate today.” The argument: the row nobody added is the deadline nobody kept.",
        act: {
          scenario: "01/05/2027 · Track B. Civil Action No. 26-CV-04417 is three months old, and the docket calendar was audited and corrected on 12/10/2026, but the CMS Pleadings Log was never reconciled to it. As found: complaint 09/24/2026; service 10/14/2026, but no affidavit row (the executed affidavit, filed 10/16/2026, sits in an Allied Process Services email); Answer due 11/13/2026, filed 11/12/2026; Defendant's First Interrogatories (25) and RFPs (30), mailed 12/01/2026, logged as one row still carrying the pre-audit “due 12/31/2026”; no separate row for the 15 RFAs served with them; the 12/10/2026 Scheduling Order still saved as scan_1210.pdf with no log rows; our set e-served on Smith 12/14/2026, due 01/13/2027. CMS → Documents holds a Certificate of Service dated 01/04/2027 for John Doe's verified responses to the Interrogatories, RFPs and RFAs, served by mail on Atty. Mercer; no log row was ever made for it.",
          prompt: "Repair the Pleadings Log and Discovery Calendar for 26-CV-04417. Add every missing row, recompute each response date from its trigger and method of service, and write the arithmetic into the row. File each document in its numbered sub-folder under the naming convention, and calendar the Scheduling Order's six dates. Then make the graded call: the RFA deadline never had its own log row and has passed. Prove compliance from that Certificate of Service, record the RFA Priority Check and 48-Hour Docket misses honestly, and report both to Atty. Thorne today. Do not contact opposing counsel.",
          tool: "CMS → Litigation → Pleadings Log · CMS → Calendar · CMS → Documents",
          output: "A corrected, source-linked Pleadings Log and Discovery Calendar, every document in its sub-folder, and RFA compliance proved from the certificate and the misses reported the same day.",
          checkpoints: [
            "Affidavit-of-service row added: personal service 10/14/2026 by Allied Process Services at 4410 Quarry Ridge Ct, Millbrook; affidavit filed 10/16/2026; saved to 02_SERVICE_DOCS as Affidavit_of_Service_Executed.pdf",
            "Answer row confirmed: due 11/13/2026 (10/14/2026 + 30 days), filed 11/12/2026 by Atty. Grant Mercer, Mercer & Hale LLP; its three defenses recorded as the roadmap",
            "Interrogatories (25) and RFPs (30) corrected from 12/31/2026 to 01/04/2027: 12/01/2026 + 30 = 12/31/2026; + 3 for mail = 01/03/2027, a Sunday → Monday 01/04/2027",
            "RFA row (15) added as its own entry with the same 01/04/2027 deadline and a red deemed-admission flag",
            "Certificate of Service for John Doe's responses (dated 01/04/2027, by mail on Atty. Mercer) logged and filed to 04_DISCOVERY_DEFENDANT_TO_PLAINTIFF as Final_Verified_Responses_Served.pdf, its date checked against 01/04/2027 and the signed verification page confirmed attached",
            "Report to Atty. Thorne through CMS → Tasks → Escalate on 01/05/2027: compliance proved by the 01/04/2027 certificate, and the RFA Priority Check and 48-Hour Docket misses named; no call to Atty. Mercer",
            "Smith's responses calendared for 01/13/2027 (12/14/2026 + 30; e-service by consent adds no days on this file's rule set) with a follow-up task for the day after",
            "Scheduling Order renamed Scheduling_Order_Entered.pdf, saved to 01_PLEADINGS, and its six dates logged and reconciled to the audited calendar: 03/15/2027, 04/15/2027, 03/31/2027, 05/28/2027, 08/12/2027, 09/13/2027",
            "No scan names left; every document filed in one of the five numbered sub-folders under DOE, JOHN - CASE FILE",
            "Late filings recorded honestly: the affidavit, the RFA row and the scheduling-order rows logged as misses of the 48-hour docket rule, not back-dated"
          ]
        },
        ops: [
          ["Anything arrives from the court, opposing counsel or the process server", "File it in its numbered sub-folder under the convention and add or update its log row", "CMS → Documents · Pleadings Log", "Filed and docketed within 48 hours; source document linked to the row"],
          ["Discovery served on John Doe", "Log each set as its own row and compute its response date", "CMS → Calendar", "12/01/2026 by mail → 01/04/2027, arithmetic in the row; RFA row flagged red"],
          ["A deadline found passed without proof of compliance", "Escalate to Atty. Thorne the same day; contact no one on the other side", "CMS → Tasks → Escalate", "Escalation dated 01/05/2027 and names the missing document"]
        ],
        best: [
          "One row per discovery set, so no deadline hides inside another.",
          "Link every row to its source document, so the log can be re-checked without you.",
          "Record a late filing as late. A log that hides its own misses can't be audited.",
          "Pitfall: logging three discovery sets as one row, so the RFA deadline disappears.",
          "Pitfall: forgetting the 3 mail days, or adding them to e-service by habit.",
          "Pitfall: quietly fixing a passed deadline instead of telling Atty. Thorne."
        ],
        sources: ["D5#3", "D5#4", "D5#21", "D5#24", "D5#25", "D5#27", "D5#28", "D5#31", "D5#32"],
        rubric: {
          ai: [
            ["Date arithmetic", 20, "01/04/2027 and 01/13/2027 computed with the arithmetic shown; 11/13/2026 confirmed"],
            ["Log completeness", 15, "Affidavit, RFA and scheduling-order rows added; every event from the Complaint to the 12/14/2026 e-service logged"],
            ["File architecture", 15, "Five numbered sub-folders, convention names, no scan names"],
            ["RFA control", 10, "Separate RFA row, red flag, compliance proved from the certificate, report dated 01/05/2027"]
          ],
          trainer: [
            ["Judgment on the passed deadline", 20, "Proved compliance from the certificate and reported the misses the same day; did not paper over them"],
            ["UPL and authority boundary", 10, "No contact with opposing counsel; deemed admissions and any motion left to Atty. Thorne"],
            ["Documentation quality", 10, "Another Case Manager could audit the log cold"]
          ]
        },
        notes: [
          "Put the log as found on screen and give the room 90 seconds to name what is wrong before anyone touches it.",
          "Ask: “The log said 12/31/2026, which was too early. Why fix a date that could only have made us early?” Because the same habit that produced it will one day produce a date that is too late, and every KPI reads from the log.",
          "Watch for trainees who log the 15 RFAs inside the Interrogatories row, or who add 3 days to the e-served set. The arithmetic written into the row is what is graded.",
          "Legal nuance: in many courts a deemed admission can be withdrawn or amended only by motion. Whether to seek that is Atty. Thorne's decision; the Case Manager's job is to make sure he knows today."
        ]
      },

      {
        kind: "lesson", id: "d5m1-l2", brief: true,
        title: "Trial Preparation Checklists & Litigation KPIs",
        topic: "Trial preparation checklists & tracking litigation KPIs",
        visual: "Upper half: a horizontal trial-prep runway on a navy line from 01/20/2027 to 09/13/2027 with seven orange-numbered milestones: ① Deposition 02/18 ② Our experts 03/15 ③ Mediation by 03/31 ④ Defense experts 04/15 ⑤ Discovery closes 05/28 ⑥ Pretrial 08/12 ⑦ Trial calendar 09/13. Before each milestone, three small tick marks labelled 30 · 14 · 7. A red danger band drops from ⑤: nothing that needs an answer is scheduled past it. Lower half: three cream cards in a row, the KPI families, each with mono pills for its targets (48 h · 14 days · 1 hour · 7 days · 30 days · 10 days). The argument: the order sets the dates; the KPIs prove you are ahead of them.",
        tell: {
          why: "The Scheduling Order entered 12/10/2026 now runs John Doe's case to a 09/13/2027 trial calendar, and every date in it is absolute. A trial-prep checklist turns those dates into owned tasks; the KPIs prove, week by week, that each task is ahead of its deadline rather than behind it.",
          rules: [
            "The Scheduling Order controls: pin it to the front of the file, 30-, 14- and 7-day alerts on every date. Our experts 03/15/2027, theirs 04/15/2027, mediation by 03/31/2027, discovery closes 05/28/2027, pretrial 08/12/2027, trial calendar 09/13/2027.",
            "Every extension is in writing: once Atty. Thorne agrees, draft the same-day written confirmation for his signature (“Per our phone call, we agree to extend … to [date]”); it goes out in his name, never the CM's. A scheduling-order date usually moves only by court order.",
            "Trap 1: treating court deadlines like adjuster deadlines. A missed disclosure can keep a causation opinion out of trial.",
            "Trap 2: letting the client talk to the other side. Once the firm represents John Doe, and above all in suit, everything from the other side goes through counsel: if Keystone or a defense investigator reaches John Doe, step in, end it and tell Atty. Thorne that day.",
            "For John Doe's deposition (02/18/2027, 10:00 a.m., videoconference): confirm Riverton Court Reporting, send the link, run a technology check, align three calendars, and send the attorney-approved prep packet a week out, by 02/11/2027.",
            "Prepare the process, never the testimony. The packet carries the ground rules (listen, pause, never guess, tell the truth); what John Doe says is for Atty. Thorne's prep sessions.",
            "Once suit forces the liability proof, defenses often pivot to causation and damages; here the 14-Day Gap is the trap. Assemble the Gap Record Atty. Thorne preps from: EMS report, Attendance Record, texts, receipt, MRI read, Causation Letter.",
            "Run final records from every provider before expert disclosure and again before pretrial; never copy the pre-lit package.",
            "Draft trial subpoenas for the witnesses Atty. Thorne names; build indexed, tabbed binders from the litigation file.",
            "Write every KPI as a formula with a target, read it from the log, and audit the docket weekly. A miss is recorded and routed, never smoothed over."
          ],
          upl: [
            "You schedule, assemble, track and relay. You never agree an extension, choose an expert or witness, discuss the merits with Atty. Mercer's office (logistics only, as Atty. Thorne directs), or coach what John Doe says at his deposition."
          ]
        },
        show: {
          caption: "Nine litigation KPIs in three families, each with a target you can measure",
          type: "threebox",
          items: [
            ["Pleadings & service", "Service Check: a server assigned within 48 hours of filing. 14-Day Service Milestone: unserved at day 14 (10/08/2026) → escalate to Atty. Thorne for Skip-Trace authority, run it on his approval, status update to him."],
            ["Discovery & documents", "48-Hour Docket Rule. RFA Priority Check: Atty. Thorne alerted within the hour. Discovery Countdown: drafts to him 7+ days before the deadline. Clean Discovery Check: no blanks, verification page attached. Zero-Default: no deadline passes without a response or a signed written extension."],
            ["Client & trial", "30-Day Client Pulse: every litigation client called at least every 30 days, news or not. Subpoena Audit: every outstanding subpoena reviewed every 10 days."]
          ]
        },
        ops: [
          ["Scheduling Order entered 12/10/2026", "Pin it to the front of the file; calendar all six dates with three alerts each", "CMS → Calendar · Docket System", "Six dates exact; 18 alerts set; order filed in 01_PLEADINGS"],
          ["An extension is agreed by phone", "Confirm Atty. Thorne's approval, draft the written confirmation for his signature, recalendar", "Email Workspace · CMS → Calendar", "Confirmation sent the same day over Atty. Thorne's name; no scheduling-order date moved without a court order"],
          ["Deposition noticed", "Book the reporter, the link and the technology check; send the attorney-approved packet a week out", "CMS → Calendar · Communications Log", "Packet sent by 02/11/2027; receipt confirmed with John Doe and logged"],
          ["Weekly docket audit", "Take every KPI reading from the log and route each miss", "CMS → Litigation → KPI tracker · Tasks → Escalate", "Each KPI shows its formula, target and a dated reading"]
        ],
        best: [
          "Every scheduling-order date gets three alerts: 30, 14 and 7 days out.",
          "Call every litigation client at least every 30 days, even when nothing has happened in court.",
          "Put the subpoena audit on a recurring 10-day reminder.",
          "Trial subpoenas go only to the witnesses Atty. Thorne names; the candidates on this file are Ruth Calloway, the investigating Riverton PD officer, Dr. Reyes and the other treating physicians.",
          "Reset John Doe's expectations early: a deposition is a long, recorded conversation on a screen, not a courtroom scene.",
          "Pitfall: a phone-only extension.",
          "Pitfall: trial binders built from the pre-lit records.",
          "Pitfall: sending the deposition prep packet the day before."
        ],
        sources: ["D5#2", "D5#5", "D5#6", "D5#7", "D5#24", "D5#25", "D5#32", "LSH Claims Specialist: liability acceptance post-lawsuit (the defense pivots to causation and damages)", "Newly authored: a scheduling-order date moves only by court order"],
        rubric: {
          ai: [
            ["Scheduling-order dates", 20, "All six dates exact, each with 30-, 14- and 7-day alerts"],
            ["KPI definitions", 20, "Each KPI named with its target: 48 hours, 14 days, 1 hour, 7 days, zero defaults, 30 days, 10 days"],
            ["Trial-prep content", 20, "Final records run, subpoenas, binders and deposition logistics each tied to an order date"]
          ],
          trainer: [
            ["Litigation mindset", 15, "Treats court dates as absolute; explains why an extension is written and authorized"],
            ["Deposition boundary", 10, "Prepares documents and logistics, never testimony"],
            ["UPL boundary", 15, "No extension agreed, no expert or witness chosen, no merits discussed with the defense; contact from the other side routed to Atty. Thorne"]
          ]
        },
        notes: [
          "Open by holding up the Scheduling Order: “This one page now outranks every adjuster letter in the file. Why?” Because a judge signed it, and every date in it is absolute.",
          "Ask the room: “Defense counsel will spend John Doe's deposition on the 14-Day Gap. What is your job before 02/18/2027, and where does it stop?” Documents, logistics and the packet; it stops at what John Doe says.",
          "Walk the three KPI families and insist on numbers. A KPI without a target is a wish, and “stay on top of RFAs” is not a KPI.",
          "Legal nuance: whether a late disclosure excludes evidence, and whether counsel can agree an extension without the court, depends on the court and the order. Teach the habit, not the answer: in writing, through Atty. Thorne, rule confirmed."
        ]
      },

      {
        kind: "activity", id: "d5m1-a2", compact: true,
        title: "Trial Prep Checklist Audit & KPI Update",
        topic: "Skill Activity 2 — audit against the order, measure against the target",
        visual: "Split slide. Left 55%: the trial-prep checklist as a cream clipboard card with orange numbered badges ① to ⑤ against its faulty lines: our experts 04/15/2027 struck through to 03/15/2027; “mediation 03/31” corrected to “completed by 03/31”; records subpoenas dragged from June back across a red 05/28/2027 cutoff line; the final records run re-sourced; a blank deposition block filling in. Right 45%: a KPI tracker table in navy with five mono columns (KPI · Formula · Target · Reading · Status) and green, red and amber status chips. A thin orange connector runs from each corrected checklist line to the KPI it moves. Bottom-right, a red callout: “No record = not done.” The argument: a checklist is audited against the order, never against memory.",
        act: {
          scenario: "01/20/2027 · Track B. John Doe's deposition notice just arrived: 02/18/2027, 10:00 a.m., by videoconference, Riverton Court Reporting. The trial-prep checklist was drafted from the calendar as first keyed, before the 12/10/2026 audit, and never reconciled. It shows our expert disclosure on 04/15/2027, “mediation 03/31/2027” as the session date, records subpoenas planned for June 2027, the final records run sourced from the pre-lit Demand Package, no alerts and no deposition tasks. Smith's responses arrived 01/13/2027, never docketed. There is no KPI tracker.",
          prompt: "Audit the checklist line by line against the 12/10/2026 Scheduling Order in the Action Plan Editor: every date right, each with an owner and 30-, 14- and 7-day alerts, and the 02/18/2027 deposition logistics and prep document set added. Then build the KPI tracker: define all nine KPIs, each with its formula and target, enter this file's reading with its source, and mark each met, missed or open. Close with one task each for the three review lenses: coverage, treatment, liability. The graded call: name the two items you route to Atty. Thorne first, and why those two.",
          tool: "Action Plan Editor · CMS → Calendar · CMS → Litigation → KPI tracker",
          output: "A trial-prep checklist that matches the Scheduling Order date for date, and a KPI tracker with a formula, target, sourced reading and status for every KPI.",
          checkpoints: [
            "Our expert disclosure corrected from 04/15/2027 to 03/15/2027; 04/15/2027 kept as the defense date, with a task to docket their disclosure within 48 hours and route it to Atty. Thorne",
            "Mediation recorded as “completed by 03/31/2027”, with tasks to get the session date confirmed and to set the Mediation Statement and binder due 7 days before it",
            "Records subpoenas rescheduled so their returns land before discovery closes 05/28/2027; 04/28/2027 (30 days before 05/28/2027) flagged as the last day to e-serve a 30-day written request on Smith, confirmed with Atty. Thorne against the court's rule",
            "All six order dates carry 30-, 14- and 7-day alerts (18 in all; for example 05/28/2027 → 04/28/2027, 05/14/2027, 05/21/2027), and trial subpoenas and indexed, tabbed binders are tasked against 08/12/2027 and 09/13/2027",
            "Deposition logistics: notice docketed by 01/22/2027 (within 48 hours); Riverton Court Reporting confirmed (and a videographer, if the notice calls for one); link and technology check; Atty. Thorne's, Atty. Mercer's and John Doe's calendars aligned; prep packet by 02/11/2027 (7 days before 02/18/2027)",
            "Gap Record assembled for Atty. Thorne's prep: EMS report, Northgate attendance 02/09–02/13/2026, texts to Margaret 02/07–02/15, receipt 02/07/2026, urgent-care history 02/20/2026, the Summit MRI read, Causation Letter 06/19/2026, the 2021 chiropractic records; nothing scripted for John Doe",
            "Final records run re-sourced from Riverton Urgent Care, Riverton Spine & Rehab, Lakeside Orthopedics, Summit Imaging Center, Crescent Pain & Spine and Riverton Drug, scheduled before 03/15/2027 and again before 08/12/2027",
            "All nine KPIs present, each with a formula, a target, a reading with its source, and a status",
            "Readings from this file right: RFA Priority Check and 48-Hour Docket Rule missed (the 01/05/2027 audit); Discovery Countdown measured against 12/28/2026 (7 days before 01/04/2027); Subpoena Audit: the Riverton Fire EMS records subpoena drafted 11/12/2026, status taken from CMS → Litigation → Subpoena log (served and reviewed every 10 days, or still awaiting Atty. Thorne's approval); records subpoenas for the remaining providers still planned for June, the staged error",
            "Smith's responses (due 01/13/2027) docketed as received 01/13/2027, logged as a 48-Hour Docket miss and routed to Atty. Thorne for review; no extension agreed by the Case Manager",
            "Review lenses applied. Coverage: Smith's insurance answers routed to Atty. Thorne, and a UM consent-to-settle task set before mediation (Harbor Point and Cardinal State, on notice since 09/10/2026). Treatment: the Gap Record and the A-C-T record mapped to causation and failure to mitigate. Liability: doorbell video, Ruth Calloway, the RPD-26-018842 citation, the EMS report and the EDR mapped to comparative negligence"
          ]
        },
        show: {
          caption: "Reference model: two finished rows of the KPI tracker",
          type: "table",
          head: ["KPI", "Formula", "Target", "Reading · source", "Status"],
          rows: [
            ["RFA Priority Check", "Time from RFA receipt to Atty. Thorne's logged alert", "≤ 1 hour", "12/01/2026 RFAs: first alert at the 12/10/2026 audit, not within the hour · Pleadings Log", "Missed"],
            ["Discovery Countdown", "Days from drafts reaching Atty. Thorne to the court deadline", "≥ 7 days, every set", "01/04/2027 set: due to him by 12/28/2026 · task log", "Met if on or before 12/28/2026"]
          ]
        },
        ops: [
          ["Scheduling Order on file", "Load all six dates into the checklist with an owner and three alerts each", "Action Plan Editor · CMS → Calendar", "Dates match the 12/10/2026 order exactly; 18 alerts set"],
          ["Deposition notice received 01/20/2027", "Docket it; book the reporter, the link and the technology check; calendar the packet", "CMS → Calendar · Communications Log", "Docketed by 01/22/2027; packet due 02/11/2027"],
          ["Weekly docket audit", "Update every KPI reading and route each miss", "CMS → Litigation → KPI tracker · Tasks → Escalate", "Nine KPIs with formula, target, sourced reading and status; misses escalated with a date"]
        ],
        best: [
          "Read the checklist against the order line by line, never from memory.",
          "Write every KPI as a formula with a target; “on track” is not a reading.",
          "Run the three review lenses over the file every audit: coverage, treatment, liability.",
          "Prepare the documents, not the testimony.",
          "Pitfall: scheduling discovery work after the discovery cutoff.",
          "Pitfall: a final records run copied from the pre-lit Demand Package.",
          "Pitfall: accepting the Answer's liability story without pulling the evidence against it."
        ],
        sources: ["D5#5", "D5#6", "D5#7", "D5#24", "D5#25", "D5#28", "D5#32", "D5#33", "LSH Claims Specialist: liability acceptance post-lawsuit (the defense pivots to causation and damages)", "Newly authored: the last day to serve written discovery, counted back from the discovery cutoff"],
        rubric: {
          ai: [
            ["Order-date accuracy", 20, "03/15/2027, 04/15/2027, 03/31/2027, 05/28/2027, 08/12/2027 and 09/13/2027 on the right lines; 04/28/2027 derived"],
            ["Alerts and arithmetic", 10, "18 alerts; 02/11/2027, 01/22/2027 and 12/28/2026 derived correctly"],
            ["KPI definitions", 20, "Nine KPIs, each with a formula, a target, a sourced reading and a status"],
            ["Deposition and records tasks", 10, "Reporter, link, technology check, packet date, Gap Record and an every-provider final run all present"]
          ],
          trainer: [
            ["Prioritization judgment", 15, "The two items routed first are the right ones, and the reasoning holds"],
            ["Gap Record, not a script", 10, "Documents assembled and indexed; nothing that tells John Doe what to say"],
            ["UPL and authority boundary", 15, "No extension agreed, expert or witness chosen, or testimony coached; decisions routed to Atty. Thorne"]
          ]
        },
        notes: [
          "Put the checklist and the Scheduling Order side by side and ask the room to find the first wrong date in under a minute. Most find 04/15/2027; fewer catch that June subpoenas fall after discovery closes.",
          "Ask: “Which two items go to Atty. Thorne first, and why those two?” The strongest answer routes the expert date (the earliest order deadline, and who is disclosed is his decision) and the subpoena timing (whether records can still be had before 05/28/2027 is his call). Deposition logistics are the Case Manager's to run, not to route.",
          "Watch the KPI definitions. “Stay on top of RFAs” is not a KPI; “minutes from receipt to logged alert, target 60 or fewer” is.",
          "The Gap Record is this day's gap moment. Grade the line: the trainee assembles and indexes the documents, and Atty. Thorne decides how John Doe is prepared. A note that tells John Doe what to say fails the UPL row."
        ]
      },

      {
        kind: "check", id: "d5m1-kc",
        title: "Litigation Support Assessment",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "Split layout. Upper half: the Litigation Support Assessment on the warm cream card with the orange ruled border, seven questions numbered in orange; the two pressure scenarios, 6 and 7, carry a small red clock chip. Between the panels, a slim LITIGATION DOCKET strip of six mono date pills, 03/15 · 03/31 · 04/15 · 05/28 · 08/12 · 09/13, for the trainee to self-check against. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SELF-SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, the 60/40 stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip outside the bar.",
        check: {
          questions: [
            "Defendant's discovery was mailed to John Doe on 12/01/2026. Compute the response date step by step, say how the count changes for a set e-served by consent, and why you confirm the court's rule.",
            "Atty. Mercer's Answer pleads three defenses. Name each one, and the evidence already on John Doe's file you would pull for Atty. Thorne against it.",
            "Where in the litigation file do the affidavit of service, the 12/01/2026 RFAs and the Scheduling Order go, under what names, and what happens to the order's dates?"
          ],
          summary: [
            "Summarize, in your own words, what you learned about supporting John Doe's lawsuit: the principles, not the clicks.",
            "Articulate your strategy: what is the next action on this file as of 01/20/2027, and why is it the right next action rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Computing court deadlines from a trigger and a method of service",
            "Maintaining a Pleadings Log and Discovery Calendar anyone can re-check",
            "Building the litigation file architecture and naming convention",
            "Auditing a trial-prep checklist against a Scheduling Order",
            "Defining and tracking litigation KPIs as formulas with targets",
            "Holding the UPL line on discovery, extensions and deposition preparation"
          ]
        },
        best: [
          "Answer with the file's own dates, names and arithmetic, not general rules.",
          "Pitfall: answering Question 6 with what you would agree to. You agree to nothing.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D5#7", "D5#21", "D5#24", "D5#25", "D5#28", "D5#31", "D5#32", "D5#33"],
        rubric: {
          ai: [
            ["Deadline accuracy", 20, "01/04/2027 with the arithmetic shown; e-service counted without mail days on this file's rule set; the order's dates exact"],
            ["Litigation doctrine", 15, "Answer roadmap, file architecture and naming, KPIs as formula plus target, extensions in writing"],
            ["File evidence", 15, "Gap and liability evidence named from the file: EMS report, MRI read, Causation Letter, doorbell video, Ruth Calloway, EDR"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "No extension agreed, no testimony scripted; Atty. Thorne named wherever authority is required"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 1 is the gate. A trainee who answers 12/31/2026 or 01/03/2027 has learned the words without the method; re-teach the count on the board before moving on.",
          "Put Question 6 to the room before anyone writes: “Opposing counsel wants two weeks at 4:45 p.m. and will paper it later. Who can say yes?” Only Atty. Thorne, and only in writing, the same day.",
          "Question 7 is Trap 2. The right answer: tell John Doe not to take further calls from the defense side and to refer them to the firm, log what he says was asked and answered, and tell Atty. Thorne the same day; any response to Keystone or Atty. Mercer is his call. Anything that has the CM call the investigator back, or ask John Doe to shade what he said, fails.",
          "Compare each self-rating with the score. UPL is a gate: a strong score does not survive an ethics breach."
        ]
      }

      ]
    },

    /* ---------- DAY 5 · MODULE 2 ---------- */
    {
      n: 2, id: "d5m2",
      title: "Interactive Property Damage Practice Lab",
      about: "John Doe's Civic in suit: the repair against ACV and the total-loss line, Loss of Use allocated day by day, and the diminished-value dispute worked from Keystone's 17c offer to a recommended range for Atty. Thorne.",
      quiz: [
        {q: "John Doe's Civic: final repair $9,255.00, ACV $17,600.00, Keystone's total-loss threshold 75%. The Civic is:",
         opts: ["A Total Loss: the supplement pushed the repair past half the ACV", "Repairable: $9,255.00 is 52.6% of ACV, under the $13,200.00 line", "A Total Loss: structural damage always totals a car", "Repairable only on the $6,940.00 estimate, not on the final bill"],
         a: 1, r: "$9,255.00 is 52.6% of $17,600.00. The line is 75% × $17,600.00 = $13,200.00, so the Civic is repairable with $3,945.00 to spare. Run it on the final bill, never the first estimate."},
        {q: "Keystone paid John Doe's rental for 02/18–03/19/2026. Which days make up the $2,016.00 loss-of-use claim?",
         opts: ["02/06–02/17 and 03/20–04/24/2026: 48 days without a car or a paid rental", "All 78 days from 02/06 to 04/24/2026", "Only the 30 rental days, at a higher daily rate", "Only the 36 days of parts delay"],
         a: 0, r: "12 + 36 = 48 unpaid days × $42.00 = $2,016.00. The 30 paid days are excluded: claiming them again would pay John Doe twice for the same day."},
        {q: "On John Doe's Civic, what holds Keystone's 17c diminished-value formula to $1,760.00 at most, whatever the damage?",
         opts: ["The mileage multiplier of 0.60", "The $25,000 PD limit", "The 10% base: 10% of the $17,600.00 ACV, set before any multiplier", "The date of the appraisal"],
         a: 2, r: "17c starts from 10% of value, $1,760.00 here, and the multipliers can only reduce it. The $3,600.00 appraisal is 20.5% of ACV, a figure the formula can never reach."},
        {q: "Leah Moran tells you Keystone's $792.00 is final and asks you to confirm John Doe will take it. You:",
         opts: ["Accept it, since anything beats $0", "Reject it and counter at $3,600.00", "Tell John Doe it's a fair offer and let him decide", "Log it, tell her it is with Atty. Thorne, and route it to him the same day"],
         a: 3, r: "The CM never makes, accepts, rejects or counters a PD figure, and never values an offer for the client. The CM records and routes; Atty. Thorne decides."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d5m2-l1", brief: true,
        title: "Repair Estimates vs. ACV & Loss-of-Use Allocations",
        topic: "Repairable or total, and what each day without the Civic is worth",
        visual: "A horizontal threshold gauge across the top half, the same instrument as Day 1's, now carrying John Doe's numbers: a bar from $0 to ACV $17,600.00, a bold navy THRESHOLD marker at 75% labelled $13,200.00, a grey chip at $6,940.00 (estimate, 39.4%) and an orange chip at $9,255.00 (final, 52.6%), joined by an orange arrow tagged +$2,315.00 A-PILLAR SUPPLEMENT. Lower half: a 78-day calendar ribbon from 02/06 to 04/24/2026 in three segments: red 12 days, navy 30 days (RENTAL PAID $1,260.00), red 36 days. A brace under the two red segments reads LOSS OF USE 48 × $42.00 = $2,016.00. The argument: Keystone paid for the middle and nothing on either side.",
        tell: {
          why: "On Track B the Civic is no longer a side claim: its Loss of Use and Diminished Value are pleaded in the suit, and every figure will be tested in discovery. The repair-against-ACV arithmetic decides which measure of damages applies, and the loss-of-use calendar is the transportation record that explains the 14-Day Gap.",
          rules: [
            "When negligence damages property, the law aims to make the owner whole: John Doe's position before 02/06/2026, never a windfall. Test every PD figure against it.",
            "Three damage types are recoverable. Economic (special): repair, tow and storage, rental, Loss of Use, Diminished Value. Non-economic (general): pain and suffering, on the injury side. Punitive: to punish egregious conduct such as DUI; none is pleaded here.",
            "PD is also evidence of impact severity: the $2,315.00 teardown supplement (03/02/2026) is structural, the A-pillar, showing hidden damage for the PD claim and force for the injury claim.",
            "Courts generally award the lesser of the repair cost or the drop in market value: a car costing more to fix than it was worth is a Total Loss, capped at its value. Confirm Keystone's threshold basis in writing.",
            "Run it on the final bill: $6,940.00 + $2,315.00 = $9,255.00, 52.6% of the $17,600.00 ACV, under Keystone's 75% line of $13,200.00. Repairable, with $3,945.00 to spare. Verify the Valuation Report: a low ACV moves the line.",
            "Loss of Use is claimable for each day without the car or a paid substitute, measured by a comparable rental; Keystone's own $42.00/day rate is the strongest measure. Authority is state law (for example, Restatement (Second) of Torts § 928(b)); confirm the governing rule.",
            "Allocate each of the 78 days from 02/06 to 04/24/2026 once; claim only the 48 unpaid: 48 × $42.00 = $2,016.00. A paid rental day claimed twice is a windfall.",
            "Keystone's 30-day cap is claims practice; the legal measure generally runs for the reasonable repair time. Keystone blames “shop delay”; the record shows a parts backorder. Arguing the 36 days is for Atty. Thorne.",
            "The loss-of-use dates are gap evidence too: no car until the 02/18/2026 rental is the first reason for the 14-Day Gap, and the 03/19 cut-off fed the disrupted care. Keep both records identical, date for date.",
            "Keystone's PD coverage ($25,000) pays this claim, outside the $40,000 stack. Bluewater's collision went unused: Keystone accepted PD liability on 02/17/2026."
          ],
          upl: [
            "You may compute, allocate, document and report PD figures to Atty. Thorne. You may not tell John Doe what his car or its use is worth, whether to accept a Keystone figure, or how a court will measure his damages.",
            "You may put the PD and rental record in Atty. Thorne's deposition set; you may not rehearse John Doe's answers about the gap or the car."
          ]
        },
        show: {
          caption: "Every day from 02/06 to 04/24/2026, allocated once",
          type: "table",
          head: ["Period", "Days", "What happened", "Loss of Use"],
          rows: [
            ["02/06–02/17/2026", "12", "Towed and stored; no car; liability accepted 02/17", "$504.00 claimed"],
            ["02/18–03/19/2026", "30", "Rental, $42.00/day: $1,260.00 paid by Keystone", "None: already paid"],
            ["03/20–04/24/2026", "36", "Rental capped; parts backorder; extension refused 04/10", "$1,512.00 claimed"],
            ["Total", "78", "48 unpaid days × $42.00; Keystone: $0", "$2,016.00 claimed"]
          ]
        },
        ops: [
          ["Final repair bill posts with the supplement", "Re-run the total-loss check on $9,255.00 and record the basis", "CMS → Property Damage", "52.6% of $17,600.00 recorded; Keystone's 75% basis on file in writing"],
          ["Rental ends with the Civic still in the shop", "Log each day without a vehicle, period by period", "CMS → Property Damage → Loss of Use", "12 + 36 = 48 days; no paid rental day counted"],
          ["Loss of Use and Diminished Value pleaded in the 09/24/2026 complaint", "Reconcile the PD figures across the PD screen, the damages summary and discovery", "CMS → Litigation → Pleadings Log", "$2,016.00 and $3,600.00 match everywhere; any mismatch escalated to Atty. Thorne"],
          ["John Doe's deposition noticed 01/20/2027", "Add the PD severity set (photos, estimate, 03/02/2026 supplement, rental dates) to Atty. Thorne's deposition documents", "CMS → Documents → Deposition set", "Indexed before the 02/04/2027 prep session"]
        ],
        best: [
          "Run the threshold on the final bill, never the first estimate.",
          "Use Keystone's own $42.00 rental rate as the value of a day's use; a carrier struggles to dispute its own number.",
          "Pitfall: claiming the 30 paid rental days again as Loss of Use.",
          "Pitfall: treating Property Damage as “just the car”; the supplement is impact evidence for the injury claim."
        ],
        sources: ["D5#34", "D5#35", "D2#6", "LSH Claims Specialist: Property Damage and collision coverage, Loss of Use, tow and storage", "Newly authored: a carrier's rental cap against the reasonable-repair-time measure of Loss of Use (Restatement (Second) of Torts § 928(b) as an example)"],
        rubric: {
          ai: [
            ["Threshold arithmetic", 20, "$6,940.00 + $2,315.00 = $9,255.00; 52.6% of $17,600.00; the 75% line at $13,200.00"],
            ["Day allocation", 20, "78 days split 12 / 30 / 36, each counted once; 48 × $42.00 = $2,016.00"],
            ["Doctrine", 20, "Make-whole aim, the three damage types and the lesser-of rule stated correctly"]
          ],
          trainer: [
            ["Evidentiary reasoning", 25, "Connects the supplement and the loss-of-use dates to the injury claim and the gap"],
            ["UPL boundary", 15, "No valuation or acceptance advice to John Doe; the 36-day argument left to Atty. Thorne"]
          ]
        },
        notes: [
          "Open with the gauge. Ask which number decides whether the Civic is totaled; most will say the estimate. It is the final bill, $9,255.00, after the supplement.",
          "Put it to the room: “Keystone paid for 30 days of rental. Why is John Doe still owed anything for the use of his car?” Make them find the two red segments on either side.",
          "Tie it to Day 5's gap work: the 12 days without a car are the first of the four reasons for the 14-Day Gap, and the 02/18/2026 rental date is in the PD record, not just John Doe's memory. Expect defense counsel to build a causation trap on that fortnight at deposition; the record answers it, and Atty. Thorne, not the CM, prepares John Doe.",
          "Legal nuance: whether parts-backorder days are recoverable, and how far a carrier's cap binds, vary by jurisdiction. Watch for the 78-day double count; the make-whole principle answers it, and it is not a technicality."
        ]
      },

      {
        kind: "activity", id: "d5m2-a1",
        title: "Evaluating Repair Estimates vs. ACV & Loss-of-Use",
        topic: "Skill Activity 1 — audit the Civic's numbers before discovery does",
        visual: "An annotated CMS Property Damage worksheet fills the left two-thirds: a white card with a navy header bar and two staged entries struck through in red, the 39.4% total-loss check on the $6,940.00 estimate and the 78-day, $3,276.00 loss-of-use line, each with an orange numbered badge pointing to its corrected value in the margin (52.6% on $9,255.00; 48 days, $2,016.00). The right third is an evidence column of three cream cards, one per period (12 · 30 · 36 days), each listing its proof as mono pills. A red-bordered strip along the bottom reads PRODUCED WRONG = IMPEACHED. The argument: fix the record before the defense reads it.",
        act: {
          scenario: "File date 12/2026: the requests mailed 12/01/2026 have arrived. Defendant's First Requests for Production, served on John Doe by U.S. mail, ask for every document supporting the Property Damage claim (responses due 01/04/2027). The total-loss and loss-of-use entries on the CMS Property Damage screen, untouched since April, show a total-loss check run on the $6,940.00 estimate (39.4% of ACV) and a loss-of-use line of 78 days × $42.00 = $3,276.00. Keystone still offers $0 for Loss of Use.",
          prompt: "Audit and correct the Civic's numbers before anything is produced. Re-run the total-loss check on the final repair against the $17,600.00 ACV and Keystone's 75% threshold, and list what you would verify in Keystone's Valuation Report. Rebuild the loss-of-use ledger day by day from 02/06 to 04/24/2026, allocating each day once, and correct the claim. Attach the evidence for each period, and index the severity set: the photos and the estimate against the final bill. Then flag for Atty. Thorne the two arguments Keystone will make against the unpaid days, without answering them, and date the task ahead of the response deadline.",
          tool: "CMS → Property Damage → Loss of Use · CMS → Documents · CMS → Tasks → Escalate",
          output: "A corrected PD worksheet (repairable at 52.6% of ACV; 48 days and $2,016.00 claimed) with each period evidenced and Keystone's defenses flagged for Atty. Thorne.",
          checkpoints: [
            "Final repair recomputed: $6,940.00 + $2,315.00 = $9,255.00",
            "Threshold run on the final repair: $9,255.00 is 52.6% of $17,600.00, under $13,200.00 (75%) → repairable",
            "The stale 39.4% check corrected with a dated note, not silently overwritten",
            "Valuation-report checks listed: comparables, the LX trim, 52,300 miles, condition",
            "Severity set indexed: point-of-impact, frame and A-pillar photos, and the 02/16/2026 estimate set against the final bill",
            "78 days allocated once: 12 (02/06–02/17) + 30 (02/18–03/19) + 36 (03/20–04/24)",
            "Loss of Use corrected from $3,276.00 to 48 × $42.00 = $2,016.00; the 30 paid days ($1,260.00) excluded",
            "Each period evidenced: tow and storage record and Keystone's 02/17/2026 acceptance for the 12; the 02/18/2026 rental authorization for the 30; the 04/10/2026 extension refusal and 04/24/2026 completion for the 36",
            "Tow and storage ($455.00) and the rental recorded as paid by Keystone, not claimed again",
            "Keystone's two defenses flagged, not argued: days before it accepted liability, and “shop delay”",
            "Escalation to Atty. Thorne dated on or before 12/28/2026 (the Discovery Countdown, 7 days before 01/04/2027); nothing produced without his review"
          ]
        },
        ops: [
          ["Requests for Production ask for the PD documents", "Audit the PD screen and correct stale figures with dated notes", "CMS → Property Damage", "Threshold on $9,255.00; Loss of Use $2,016.00; each correction dated"],
          ["Keystone's defenses identified", "Flag them to Atty. Thorne with each period's evidence", "CMS → Tasks → Escalate", "Task dated on or before 12/28/2026"],
          ["Worksheet corrected", "Assemble the PD evidence set for Atty. Thorne's production review", "CMS → Documents", "Every period evidenced; nothing produced before his review"]
        ],
        best: [
          "Correct a wrong figure with a dated note; never overwrite the history.",
          "Evidence each period, not just the total: the defense attacks periods.",
          "Pitfall: producing a worksheet that still says $3,276.00; one double count lets the defense attack every other number.",
          "Pitfall: arguing “shop delay” with the adjuster yourself."
        ],
        sources: ["D5#35", "D2#6", "LSH Claims Specialist: Property Damage coverage, Loss of Use, tow and storage"],
        rubric: {
          ai: [
            ["Threshold", 15, "$9,255.00 = 52.6% of $17,600.00, under $13,200.00; the 39.4% entry corrected"],
            ["Day allocation", 15, "12 + 30 + 36 = 78 days, each counted once"],
            ["Loss-of-use figure", 15, "48 × $42.00 = $2,016.00; $3,276.00 corrected; $1,260.00 and $455.00 not claimed again"],
            ["Evidence and deadline", 15, "Each period evidenced; severity photos and supplement indexed; escalation dated on or before 12/28/2026"]
          ],
          trainer: [
            ["Audit judgment", 20, "Found both staged errors and explained what producing them would cost"],
            ["Record vs. argument", 10, "Flagged Keystone's defenses with the evidence, without arguing them"],
            ["UPL boundary", 10, "Nothing sent to Keystone or produced without Atty. Thorne's review"]
          ]
        },
        notes: [
          "Don't tell them there are two staged errors. The trainee who re-runs the threshold on $9,255.00 and catches the 78-day double count is doing the job; the one who tidies the formatting isn't.",
          "Ask the room: “If the defense receives a worksheet claiming $3,276.00, what happens to the credibility of the $3,600.00 appraisal?” That is why the audit comes before production.",
          "Grade the evidence column hardest. The 12 pre-rental days are proved by the tow and storage record and Keystone's own 02/17/2026 acceptance, not by John Doe's word.",
          "What is produced, and how discovery is answered, is Atty. Thorne's decision. The CM prepares the set; the responses go out over his signature."
        ]
      },

      {
        kind: "lesson", id: "d5m2-l2", brief: true,
        title: "Diminished Value & PD Dispute Resolution",
        topic: "What a repaired car still loses, and how the dispute gets resolved",
        visual: "A balanced two-column face-off. Left, a navy card headed KEYSTONE'S 17c: the formula as a descending staircase of three mono pills, $1,760.00 → × 0.75 → × 0.60, landing on $792.00, each step tagged in red with its flaw (10% CAP · TIER · MILEAGE TWICE). Right, an orange-bordered cream card headed THE MARKET: $3,600.00 set large in Fraunces, with three evidence chips beneath it (appraisal 05/06/2026 · A-pillar supplement · photos). A thin horizontal rule between the cards marks the $1,760.00 ceiling; the $3,600.00 sits visibly above it. Bottom strip, red-bordered: “PD release only. Never all claims.” The argument: the formula cannot reach the market.",
        tell: {
          why: "A Civic with an A-pillar repair in its history is worth less than one never hit, and John Doe didn't cause that loss. Keystone's $792.00 comes from a formula; the $3,600.00 from a market appraisal. The difference is pleaded on Track B: the CM builds the evidence and Atty. Thorne makes the argument.",
          rules: [
            "Diminished Value is the market value a car still loses after a proper repair: buyers pay less for a damage history. Many jurisdictions allow it against the at-fault driver.",
            "It sits beside the lesser-of rule: where a repair leaves a residual loss, many courts add it to the repair cost (for example, Restatement (Second) of Torts § 928), kept under the pre-loss value: $9,255.00 + $3,600.00 = $12,855.00, under $17,600.00. Confirm the governing rule.",
            "It is a market loss, not a feeling. The measure is fair market value. Where an item has no market (an heirloom), some courts use actual value to the owner, still excluding sentimental value; a few allow emotional-distress damages for intentional destruction. Neither fits a 2019 Civic.",
            "Keystone's “17c” figure is a carrier formula from a Georgia class-action settlement, not a legal measure of damages: 10% of $17,600.00 = $1,760.00, × damage 0.75, × mileage 0.60 = $792.00.",
            "Critique the cap: no damage, however severe, yields more than $1,760.00 on this car. The appraisal's $3,600.00 is 20.5% of ACV, more than twice the formula's ceiling.",
            "Critique the multipliers: 0.75 is the formula's ‘major structural’ tier; the A-pillar teardown supports arguing for its top, ‘severe structural’ tier (1.00), Atty. Thorne's argument to make; 0.60 discounts 52,300 miles the $17,600.00 ACV already priced in, counting mileage twice.",
            "Test your own evidence too: the Riverton Auto Appraisal (05/06/2026) post-dates the 04/24/2026 repair, so it valued the repaired car; check its method and credentials.",
            "Resolve on evidence: get Keystone's position and inputs in writing, by the route Atty. Thorne chooses (in suit, usually discovery), assemble the answer (appraisal, supplement, rental record) and escalate to him. Pleaded on Track B, the items resolve where he takes them: negotiation, mediation, or trial.",
            "PD is settled only on a property-damage-only release Atty. Thorne has reviewed. A release reaching “all claims” from 02/06/2026 could end the injury case in suit; John Doe signs nothing from Keystone until the firm has reviewed it."
          ],
          upl: [
            "You may calculate, critique the formula on paper, assemble the evidence and recommend a range to Atty. Thorne. You may not make, accept, reject or counter any PD figure, tell John Doe what his car has lost in value or whether to take Keystone's offer, or explain a release to him."
          ]
        },
        show: {
          caption: "The same Civic, two numbers: a formula against the market",
          type: "compare",
          boxes: [
            {head: "KEYSTONE'S 17c — $792.00", items: [
              "Base: 10% of $17,600.00 = $1,760.00, a ceiling set before any damage is scored.",
              "× 0.75 damage: the A-pillar scored a tier below the top.",
              "× 0.60 mileage: 52,300 miles discounted again, though the ACV priced them.",
              "No market data anywhere in the calculation."
            ]},
            {head: "THE APPRAISAL — $3,600.00", items: [
              "Riverton Auto Appraisal, 05/06/2026, after the 04/24/2026 repair.",
              "20.5% of ACV: more than twice the formula's ceiling.",
              "Corroborated by the $2,315.00 structural supplement and the photos.",
              "Audited for method, data and credentials first."
            ]}
          ]
        },
        ops: [
          ["Keystone states its diminished-value figure", "Ask Atty. Thorne how to obtain the 17c worksheet and every input (a discovery request or a written request through counsel), and draft it for his review", "CMS → Property Damage → Correspondence", "Base, both multipliers and the ACV used on file in writing"],
          ["Appraisal received (05/06/2026)", "Audit its method, data and credentials; index it as the diminished-value evidence", "CMS → Property Damage · CMS → Documents", "Audit note dated; appraisal indexed"],
          ["Keystone sends a PD release or check", "Hold it and route the release language to Atty. Thorne", "CMS → Tasks → Escalate", "Release scope reviewed by Atty. Thorne before John Doe sees a signature line"]
        ],
        best: [
          "Make Keystone show its formula's inputs in writing; a number without its math can't be answered.",
          "Put the critique on paper for Atty. Thorne; an adjuster call is not where it gets argued.",
          "Pitfall: telling John Doe his car “lost $3,600.00”; that is a valuation opinion.",
          "Pitfall: a PD release that reaches the injury claim.",
          "Pitfall: promising sentimental-value recovery the law won't award."
        ],
        sources: ["D5#35", "D5#34", "LSH Claims Specialist: liability disputes — written basis, stronger evidence, escalation to the attorney", "Newly authored: Diminished Value, the repair-plus-residual-loss measure (Restatement (Second) of Torts § 928 as an example), the 17c formula and its critique, the PD-only release"],
        rubric: {
          ai: [
            ["17c arithmetic", 20, "10% × $17,600.00 = $1,760.00 × 0.75 × 0.60 = $792.00"],
            ["Critique", 20, "The 10% cap, the damage tier and the mileage double count each named; 20.5% against 10%"],
            ["Doctrine", 20, "Residual market loss added to the repair beside the lesser-of rule; $12,855.00 under $17,600.00; market value, not sentiment; PD-only release"]
          ],
          trainer: [
            ["Dispute judgment", 25, "Evidence-led; escalates rather than argues; keeps the release risk in view"],
            ["UPL boundary", 15, "No figure made, accepted, rejected or valued for John Doe"]
          ]
        },
        notes: [
          "Write $792.00 and $3,600.00 on the board, far apart. Build the $792.00 from the formula in front of the room, one multiplication at a time, so they see where each cut comes from.",
          "Ask: “If this Civic had the worst structural damage a repairable car can have, what is the most the 17c formula could pay?” The answer, $1,760.00, is the whole critique of the cap.",
          "Watch for trainees who treat the appraisal as gospel. Make them audit it as hard as they audited Keystone's ACV; the defense will.",
          "Legal nuance: Diminished Value against an at-fault driver is recognised in many states but not all, and first-party Diminished Value under one's own collision coverage is a separate, narrower question. How Robert Smith's comparative-negligence defense (his 11/12/2026 Answer) touches a parked car's claim is Atty. Thorne's analysis."
        ]
      },

      {
        kind: "activity", id: "d5m2-a2", compact: true,
        title: "Diminished Value Calculation & Negotiation Lab",
        topic: "Skill Activity 2 — from $792.00 to a recommended range for Atty. Thorne",
        visual: "A negotiation board across the slide. Left: a vertical number line from $0 to $5,616.00, Keystone's $792.00 low in navy and the claimed $5,616.00 at the top in orange; between them an empty orange bracket labelled RECOMMENDED RANGE — FOR ATTY. THORNE'S AUTHORITY, which the trainee fills. Right: the 17c rebuilt as three stacked mono pills ($1,760.00 → × 0.75 → × 0.60 = $792.00), each with a red critique tag. Bottom-right, a red-bordered callout over a release thumbnail: “ALL CLAIMS” — HOLD, ROUTE TO COUNSEL. The argument: the CM builds the range; only counsel can use it.",
        act: {
          scenario: "File date 12/10/2026. The Scheduling Order requires mediation by 03/31/2027. Leah Moran (Keystone PD) emails that $792.00 for Diminished Value and $0 for Loss of Use are final, attaching a release of “all claims arising from the 02/06/2026 accident” for John Doe's signature, then calls to ask whether John Doe will take it. Atty. Thorne wants your recommendation.",
          prompt: "Work the diminished-value dispute to a recommendation. Rebuild Keystone's 17c figure from the $17,600.00 ACV, then critique its 10% cap and both multipliers against the 03/02/2026 supplement and the 05/06/2026 appraisal. Set out the whole PD dispute, claimed against offered, and recommend a negotiating range: a top and a floor, each with its evidence and arithmetic. Take Leah Moran's call and answer her email without accepting, rejecting or countering anything, route the release, and send the range to Atty. Thorne for authority.",
          tool: "CMS → Property Damage · Email Workspace · Call Simulator → AI Adjuster: Leah Moran, Keystone Mutual (PD) · CMS → Tasks → Escalate",
          output: "A one-page PD dispute memo: the 17c rebuilt and critiqued, a recommended range with its evidence, the release flagged, and the call and email logged, routed to Atty. Thorne.",
          checkpoints: [
            "17c rebuilt: 10% × $17,600.00 = $1,760.00; × 0.75 = $1,320.00; × 0.60 = $792.00",
            "The 10% cap named: the formula can never exceed $1,760.00 on this car",
            "Both multipliers challenged: 0.75 against the $2,315.00 A-pillar supplement (03/02/2026); 0.60 as a second discount for 52,300 miles the ACV already priced in",
            "Appraisal compared: $3,600.00 (20.5% of ACV) against $792.00 (4.5%); difference $2,808.00",
            "Dispute totalled: $2,016.00 + $3,600.00 = $5,616.00 claimed against $792.00 offered",
            "Range has a top and a floor, each traced to a document with the arithmetic shown, and the weakest item (the 36 “shop delay” days) named; the floor sits above $792.00",
            "Make-whole check shown: $9,255.00 + $3,600.00 = $12,855.00, below the $17,600.00 pre-loss value",
            "Limit check: $455.00 + $9,255.00 + $1,260.00 = $10,970.00 paid, + $5,616.00 disputed = $16,586.00, inside Keystone's $25,000 PD limit; any other claim on that limit (the Escape) flagged for Atty. Thorne",
            "Release flagged: the “all claims” language routed to Atty. Thorne; nothing sent to John Doe to sign",
            "Call and email logged; Leah Moran told only that the offer is with Atty. Thorne; no figure accepted, rejected or countered",
            "Recommendation routed to Atty. Thorne as a task, evidence attached, marked “for authority”"
          ]
        },
        show: {
          caption: "The dispute on one page",
          type: "table",
          head: ["Item", "Claimed", "Offered", "Evidence"],
          rows: [
            ["Loss of Use, 02/06–02/17 (12 days)", "$504.00", "$0", "Tow and storage record; 02/17 acceptance"],
            ["Loss of Use, 03/20–04/24 (36 days)", "$1,512.00", "$0", "04/10 refusal; 04/24 completion"],
            ["Diminished Value", "$3,600.00", "$792.00", "Appraisal 05/06/2026; A-pillar supplement"],
            ["Total in dispute", "$5,616.00", "$792.00", "Difference $4,824.00"]
          ]
        },
        ops: [
          ["Keystone restates $792.00 and $0 with a release", "Log the email and the call; acknowledge receipt only", "Email Workspace · CMS → Communications Log", "Both logged 12/10/2026; no position taken"],
          ["Release received", "Route the release language to Atty. Thorne and hold it from John Doe", "CMS → Tasks → Escalate", "Escalated the same day; John Doe not asked to sign"],
          ["Range drafted", "Send the memo and the evidence to Atty. Thorne for authority", "CMS → Tasks → Escalate", "His decision recorded before anything goes to Keystone"],
          ["Atty. Thorne sets authority", "Record it in his words and calendar the next step", "CMS → Case Notes · Calendar", "Authority dated; nothing used beyond it"]
        ],
        best: [
          "Recommend with arithmetic: every number in the range traces to a document.",
          "Give Atty. Thorne the weak point too: the 36 “shop delay” days are where Keystone will push hardest.",
          "Pitfall: telling Leah Moran “we'd probably take” any figure; that is an offer made without authority.",
          "Pitfall: forwarding Keystone's release to John Doe “just so he can see it.”"
        ],
        sources: ["D5#35", "D5#34", "LSH Claims Specialist: liability disputes — written basis, stronger evidence, escalation to the attorney", "Newly authored: the 17c critique and the recommended negotiating range"],
        rubric: {
          ai: [
            ["17c arithmetic", 15, "$1,760.00 × 0.75 × 0.60 = $792.00, each step shown"],
            ["Critique", 15, "Cap, damage tier and mileage double count, each tied to the supplement or the ACV"],
            ["Dispute totals", 15, "$5,616.00 against $792.00; $2,808.00 diminished-value difference; $12,855.00 make-whole check; $16,586.00 inside the $25,000 PD limit"],
            ["Range construction", 15, "Top and floor each traced to evidence with arithmetic; floor above $792.00"]
          ],
          trainer: [
            ["Negotiation judgment", 15, "A range Atty. Thorne could use: realistic, with the weak points named"],
            ["Release risk", 10, "Saw that the release could reach the injury claim and held it"],
            ["UPL boundary", 15, "Nothing accepted, rejected or countered; John Doe not asked to sign; the adjuster told only that it is with counsel"]
          ]
        },
        notes: [
          "Start with the release, not the math. Ask who opened Leah Moran's attachment. A trainee who forwards it to John Doe has failed the lab before computing anything.",
          "Ask: “What is the lowest number you'd put in front of Atty. Thorne, and which document defends it?” Grade the reasoning, not the figure; the outcome is his. Keystone's own formula, with the damage tier at the top and the mileage double count removed, reaches its $1,760.00 ceiling; a floor built there defends better than one picked from the air.",
          "In the call, AI Leah Moran presses: “Can you just tell me if he'll take it?” The only right answer is that the offer is with Atty. Thorne and the firm will respond.",
          "Nuance: the range is internal work product for counsel. With the items pleaded and Robert Smith represented by Atty. Grant Mercer, how and with whom PD is negotiated is Atty. Thorne's choice."
        ]
      },

      {
        kind: "check", id: "d5m2-kc",
        title: "PD Dispute Evaluation",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split (cream question panel with orange-numbered questions, navy Self-Summary card, the 1–5 ladder, the 60/40 strip with the separate red UPL gate). Module-specific addition: a PD LEDGER STRIP between the panels, four cells in mono type: Repair $9,255.00 · 52.6% | Loss of Use 48 days · $2,016.00 vs $0 | Diminished Value $3,600.00 vs $792.00 | Recommendation → Atty. Thorne. The last cell is orange-bordered and empty until the trainee states the next action. The strip is the whole dispute at a glance; the questions make them defend each cell.",
        check: {
          questions: [
            "Show whether John Doe's Civic is a Total Loss: the final repair, the ACV, Keystone's threshold and the percentage, with the arithmetic.",
            "Allocate the 78 days from 02/06 to 04/24/2026. Which are claimed as Loss of Use, at what rate and for how much, and why are the rental days excluded?",
            "Name the three types of damages, place the Civic's repair, Loss of Use and Diminished Value among them, and say what conduct a punitive claim requires."
          ],
          summary: [
            "Summarize, in your own words, what you learned about valuing and disputing Property Damage on John Doe's file: the principles, not the clicks.",
            "Articulate your strategy: the PD dispute stands at $5,616.00 claimed against $792.00 offered. What is your next action, and why is it the right one rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Running the total-loss threshold on the final repair figure",
            "Allocating loss-of-use days without double counting",
            "Placing PD items among the damage types and applying the lesser-of rule",
            "Rebuilding and critiquing a 17c diminished-value offer",
            "Building an evidence-backed negotiating range for counsel",
            "Holding the UPL boundary when a carrier or defense counsel presses for an answer"
          ]
        },
        best: [
          "Answer with the file's own numbers and dates, and show the arithmetic.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D5#34", "D5#35", "D2#6"],
        rubric: {
          ai: [
            ["Threshold and allocation", 20, "$9,255.00 = 52.6% of $17,600.00, under $13,200.00; 48 × $42.00 = $2,016.00 with the 30 rental days excluded"],
            ["17c and critique", 15, "$1,760.00 × 0.75 × 0.60 = $792.00; the cap, the tier and the mileage double count"],
            ["Doctrine", 15, "Three damage types, make-whole, the lesser-of rule, the sentimental-value limit"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action fits a $5,616.00 against $792.00 dispute and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Inspection and offer both routed to Atty. Thorne; nothing agreed with defense counsel; no value given to John Doe"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 6 is the pressure scenario. The right answer agrees to nothing, logs the call, and gets both the inspection request and the offer to Atty. Thorne at once; any instruction to John Doe to preserve the Civic is his to give, and the CM relays it.",
          "After Question 7, ask the room: “Why does a parked car's A-pillar matter to a neck injury?” The supplement measures the force that drove the Escape, with John Doe inside, into the Civic. Atty. Thorne uses it in prep; the CM puts it in the set and never tells John Doe what to say.",
          "Compare each self-rating with the score. A 5 on a block scored at 60 is a coaching conversation, and so is a 2 on a block they aced.",
          "UPL is a gate: a strong score does not survive an ethics breach. On this module the breach to watch for is a PD figure accepted, rejected or valued for John Doe."
        ]
      }

      ]
    },

    /* ---------- DAY 5 · MODULE 3 ---------- */
    {
      n: 3, id: "d5m3",
      title: "Deposition Preparation Protocols",
      about: "John Doe's virtual deposition: the pre-deposition audit, the three prep pillars, the seven Golden Rules, opposing counsel's traps, and the substance left to Atty. Thorne.",
      quiz: [
        {q: "On 02/04/2027 John Doe asks you, “What should I say about why I waited two weeks to see a doctor?” What do you do?",
         opts: ["Tell him to say he had no ride and hoped it would pass", "Tell him not to mention the gap unless he is asked about it", "Tell him it is a question for Atty. Thorne, log it in his words and route it", "Send him the Gap Explanation Record to study before 02/18/2027"],
         a: 2, r: "The gap is substance. Atty. Thorne prepares it with John and chooses what John reviews; the Case Manager supplies no wording and no study document on the gap, and routes the question the same day."},
        {q: "At the deposition, defense counsel asks, “So it was just the neck stiffness. Is that all?” This is:",
         opts: ["The “Is that all?” trap: a flat “yes” can be used later against the right-hand numbness and arm symptoms in his records", "A routine personal-background question", "An improper question John may refuse to answer", "The silent trap"],
         a: 0, r: "It narrows the injury list to what John recalls on the spot. His Medical Records are the complete account, and Atty. Thorne drills how John meets the question."},
        {q: "Mid-answer, Atty. Thorne says “Objection, form.” John should:",
         opts: ["Finish his sentence quickly, then pause", "Stop, let the objection finish, then answer unless Atty. Thorne instructs him not to", "Ask the court reporter whether he has to answer", "Treat it as an instruction not to answer"],
         a: 1, r: "An objection is a routine flag on the record. He stops, lets the objection finish, then answers; often he hears “You can answer.” Only “I instruct the witness not to answer” means he does not answer."},
        {q: "Which of the four categories of defense questions do clients most often underreport?",
         opts: ["Personal background, such as work and residences", "The mechanics of the crash at Maple Hollow Rd & Birch Ave", "The impact on work and daily life", "Medical history, including anything before the accident"],
         a: 3, r: "Past medical history: on this file, the three 2021 low-back chiropractic visits. The defense will likely already have them from the records and its database searches, so the question tests honesty (Golden Rule 1)."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d5m3-l1", compact: true,
        title: "Client Prep for a Virtual Deposition & Injury Narrative Alignment",
        topic: "The audit, the three pillars, and the room John testifies from",
        visual: "A two-lane calendar runs left to right across the slide in six date columns, AUDIT → 02/04 → 02/11 → 02/16 → 02/17 → 02/18/2027 · 10:00 A.M., the last column framed in orange. Upper lane, navy, labelled ATTY. THORNE · SUBSTANCE. Lower lane, cream cards with orange numbered badges, labelled CASE MANAGER · THE PERSON AND THE SETTING. A solid red rule divides the lanes the full width; thin orange arrows cross it upward only, each tagged QUESTION ROUTED, and nothing crosses downward. Bottom-right, a laptop mock-up holds the set-up as mono pills: CAMERA AT EYE LEVEL · LIGHT IN FRONT · PRIVATE ROOM · NO NOTES · NO MESSAGING. The argument: the CM's lane is full, and none of it is what John should say.",
        tell: {
          why: "John testifies on 02/18/2027 by video, from a room the firm does not control. Atty. Thorne prepares the substance; you prepare the person and the setting.",
          rules: [
            "Before 02/04/2027, audit for landmines and route them to Atty. Thorne: the 14-Day Gap (02/06→02/20/2026), the 19-day disruption (04/02→04/21/2026), the three 2021 low-back chiropractic visits, the seatbelt, the “degenerative” MRI.",
            "Audit John's signed interrogatory answers and public social media; route any inconsistency with the records to Atty. Thorne the same day. He decides whether an answer is corrected or supplemented; John testifies to the truth, never to match a document. Never tell John to delete or hide a post.",
            "Injury narrative alignment: John's truthful account matches his records because he has reviewed them with Atty. Thorne, never because he learned a script. Atty. Thorne chooses the review set: a document used to refresh memory may have to be produced (confirm the governing rule).",
            "Pillar 1, de-escalate: no judge, no jury, no shouting: questions and answers on a video call, under oath, before a court reporter. Calm him with the process, never a prediction.",
            "Pillar 2, the essential guidelines: pause two seconds; tell the truth about prior treatment (that question tests honesty); stop talking once the question is answered. Drill them on neutral questions only.",
            "Pillar 3, dress and demeanor: business casual, as for a job interview; nothing flashy, no hats or slogans; polite; limitations told plainly, never minimized or exaggerated.",
            "Set-up: a computer, not a hand-held phone; camera at eye level, light in front, a quiet private room. Test it with John on 02/16/2027, on that device in that room.",
            "While he testifies: no one else in the room except Atty. Thorne if he attends in person (anyone present is identified on the record), not Margaret; no notes, phone away, no messages to anyone, you included. Exhibits come by screen-share; he may ask to see the whole page.",
            "The day before, 02/17/2027: confirm date, time and link with John, Atty. Thorne and Riverton Court Reporting; exhibits ready for Atty. Thorne; John's new number and Margaret's as backup."
          ],
          upl: [
            "You may explain the process, run the logistics and deliver the firm's general testimony guidelines under Atty. Thorne's supervision. You may not tell John what to say, or how, about the gap, the disruption, the 2021 visits, the seatbelt or any other fact: every substantive question goes to Atty. Thorne."
          ]
        },
        show: {
          caption: "Two lanes to 02/18/2027: substance stays in Atty. Thorne's",
          type: "table",
          head: ["When", "Atty. Thorne — substance", "Case Manager — person and setting"],
          rows: [
            ["Before 02/04/2027", "Reviews the audit; selects the review set", "Runs the audit; assembles the set"],
            ["02/04/2027 · prep 1", "Reviews the records with John", "Pillars, in-room rules; logs questions"],
            ["02/11/2027", "Approves the prep packet: process and ground rules only", "Sends it; logs receipt"],
            ["02/16/2027 · prep 2", "Mock cross-examination and debrief", "Technology check; keeps the Trap Log"],
            ["02/17/2027", "Approves the exhibit set", "Three confirmations; backup numbers; objection reminder"],
            ["02/18/2027 · 10:00 a.m.", "Defends the deposition", "On standby; never messages John"]
          ]
        },
        ops: [
          ["Notice of deposition served 01/20/2027", "Calendar the deposition, both prep sessions, the 02/11/2027 prep packet and the day-before checklist; start the pre-deposition audit", "Docket System · CMS → Calendar", "02/04, 02/11 (packet), 02/16, 02/17 and 02/18/2027 (10:00 a.m.) on the calendar for Atty. Thorne and John"],
          ["Audit complete", "Route the landmine list and any discovery mismatch to Atty. Thorne", "CMS → Tasks → Escalate", "Routed before 02/04/2027; every landmine tied to its source record"],
          ["Test call, 02/16/2027", "Run the technology check on John's device, in the room he will use", "CMS → Case Notes", "Camera, audio, link, lighting, room and backup number each logged pass or fail"],
          ["Day before, 02/17/2027", "Confirm logistics with all three; finalize the exhibit set", "Email Workspace · CMS → Documents", "Three confirmations logged; exhibit set approved by Atty. Thorne"]
        ],
        best: [
          "Consistency is credibility: the records, the written answers and the testimony agree because all three are true.",
          "Calm clients give shorter, more accurate answers.",
          "Give the dress-code talk to every client, so it never sounds personal.",
          "Pitfall: letting John be surprised by his own 2021 chiropractic records.",
          "Pitfall: calming him with a prediction (“you can't lose your case today”) instead of the process.",
          "Pitfall: a client on video from his bed, in a t-shirt, with someone else in the room.",
          "Pitfall: over-coaching until John sounds rehearsed."
        ],
        sources: ["D5#8", "D5#9", "D5#10", "D5#11", "D5#14", "D5#19", "Newly authored: remote-deposition room protocol; refreshed-memory documents; social-media preservation"],
        rubric: {
          ai: [
            ["Audit completeness", 20, "Gap, disruption, 2021 visits, seatbelt, MRI, written discovery and social media all listed, each with its source record"],
            ["Calendar accuracy", 20, "02/04, 02/16, 02/17 and 02/18/2027 at 10:00 a.m.; videoconference; Riverton Court Reporting; John's new number and Margaret's as backup"],
            ["Pillars and set-up", 20, "All three pillars, the virtual set-up and every in-room rule stated"]
          ],
          trainer: [
            ["UPL boundary", 20, "No wording offered on any substantive area; every such question routed to Atty. Thorne"],
            ["Client care", 20, "Calms through the process, not predictions; raises dress and demeanor without giving offence"]
          ]
        },
        notes: [
          "Open with the line every prep session starts from, “Start by calming their nerves,” then put the calendar up: John resurfaced on 02/03/2027, fifteen days before he testifies. Ask what comes before any calming. The answer is the audit.",
          "Ask the room: “John asks what he should say about the two weeks before urgent care. What do you tell him?” Any answer with content in it crosses the line. The right answer routes the question to Atty. Thorne and logs it in John's words.",
          "Watch for reassurance that is really a prediction. A common prep script promises “you cannot lose your case today”; a deposition can hurt a case badly. Calm him with what will happen, not with how it will end.",
          "Legal nuance: in many courts a document used to refresh a witness's memory can be demanded by the other side, which is why Atty. Thorne chooses what John reviews. And nobody suggests deleting a post: on a file in suit, the duty to preserve evidence is already running. Confirm the governing rules."
        ]
      },

      {
        kind: "activity", id: "d5m3-a1", compact: true,
        title: "Virtual Deposition Prep Roleplay",
        topic: "Skill Activity 1 — client injury & 14-Day Gap defense: your segment, his substance",
        visual: "A video-call frame fills the left two-thirds: AI John Doe's tile large, the trainee's tile beside it, and Atty. Thorne's tile small in the corner with a LISTENING tag. Under the frame, a segment agenda bar of five orange-numbered chips: ① LOGISTICS ② CALM ③ GUIDELINES ④ DRESS & DEMEANOR ⑤ IN-ROOM RULES. Right third: a cream card headed ROUTED TO ATTY. THORNE with five empty lines and mono tags GAP · DISRUPTION · SEATBELT · 2021 VISITS · MRI, which fill as John asks. A red-bordered callout across the bottom: “Answer the process. Route the substance.” The argument: the routing card fills up, and the trainee's answers to it stay empty.",
        act: {
          scenario: "File date 02/04/2027, Track B. John Doe was reached through Margaret yesterday after going dark on 01/22/2027; he has a new phone number. His deposition is noticed for 02/18/2027, 10:00 a.m., by videoconference with Riverton Court Reporting. He is anxious and expects a TV cross-examination. Atty. Thorne opens the prep session, hands you the first segment while he listens, and takes the substance after you.",
          prompt: "Run your segment of John's first prep session in the Call Simulator. Confirm his new number with Margaret as backup, the deposition logistics, and a 02/16/2027 test call on the device and in the room he will use. Deliver the three pillars and the in-room rules in plain words; drill the pause on neutral questions. AI John will ask what to say about the gap, the missed April therapy, the seatbelt, his 2021 chiropractor visits and the MRI: recognise each as substance, answer none, and log each in his words for Atty. Thorne. Have Atty. Thorne's chosen gap set ready to share for his segment. Calm John with the process, never a prediction.",
          tool: "Call Simulator → AI John Doe (deposition prep session) · CMS → Tasks → Escalate",
          output: "A delivered prep segment, a logistics record, and John's substantive questions routed to Atty. Thorne in John's own words.",
          checkpoints: [
            "New phone number updated in CMS → Parties; Margaret Doe confirmed as the backup contact",
            "Logistics stated exactly: 02/18/2027, 10:00 a.m., by videoconference, Riverton Court Reporting",
            "Test call set for 02/16/2027 on the device and in the room John will use on the day",
            "Pillar 1: the setting explained (not a courtroom; no judge or jury; under oath, with a court reporter); no outcome predicted",
            "Pillar 2: the two-second pause, the truth about prior treatment and stop-talking, drilled on neutral questions only",
            "Pillar 3: business casual; no flashy jewelry, hats, slogans or athletic wear; polite tone; raised as advice every client gets",
            "In-room rules: private room, no one else present, no notes, phone set aside, no messaging; exhibits shared on screen",
            "All five substantive questions (gap, missed April therapy, seatbelt, 2021 visits, MRI) recognised and met with a routing, not content",
            "Each routed question logged in John's words to Atty. Thorne before the segment ends",
            "Atty. Thorne's gap set (EMS report, the 02/20/2026 urgent-care note, Northgate Attendance Record, Dr. Reyes's 06/19/2026 Causation Letter) ready to share for his segment; nothing sent to John by you",
            "No script, suggested wording or written summary of substance given to John"
          ]
        },
        show: {
          caption: "When John asks for an answer: what you say, and what you never say",
          type: "split",
          do: [
            "“That's exactly what Atty. Thorne will go through with you. I'm writing it down in your words now.”",
            "“The first rule is always the truth. How the 2021 questions will go is his to prepare with you.”",
            "“If you don't know or don't remember, that is a complete answer.”"
          ],
          dont: [
            "“Just say you had no ride and thought it would pass.”",
            "“Say you always wear your seatbelt.”",
            "“The 2021 visits were your back, so leave them out.”",
            "“Tell them the MRI shows no degeneration.”"
          ]
        },
        ops: [
          ["John reached through Margaret, 02/03/2027", "Update his new number; confirm the 02/04/2027 session", "CMS → Parties · CMS → Calendar", "New number on file before the session; Margaret recorded as backup"],
          ["Substantive question raised", "Log it in John's words and route it", "CMS → Tasks → Escalate", "Every question routed before the segment ends; none answered"],
          ["Segment complete", "Record what was delivered; calendar the test call", "CMS → Case Notes · CMS → Calendar", "Pillars and in-room rules marked delivered; 02/16/2027 test call on the calendar"]
        ],
        best: [
          "Answer the process; route the substance.",
          "Keep client-facing notes factual: what was covered and what was routed. Observations on John's answers go only into the Trap Log Atty. Thorne requested, marked attorney work product at his direction.",
          "Pitfall: the helpful half-answer (“just tell them you had no ride”). It is a script.",
          "Pitfall: promising John an outcome to calm him down."
        ],
        sources: ["D5#9", "D5#10", "D5#11", "D5#14", "D5#19", "Newly authored: remote-deposition room protocol"],
        rubric: {
          ai: [
            ["Logistics accuracy", 15, "02/18/2027, 10:00 a.m., videoconference, Riverton Court Reporting; new number and backup; 02/16/2027 test call"],
            ["Guidelines delivered", 20, "All three pillars and every in-room rule delivered"],
            ["Recognition and routing", 15, "All five substantive questions recognised and routed"],
            ["Record", 10, "Questions logged in John's words; delivery recorded in the CMS; Atty. Thorne's gap set ready"]
          ],
          trainer: [
            ["UPL boundary", 20, "No content, wording or hint on the gap, the disruption, the seatbelt, the 2021 visits or the MRI"],
            ["De-escalation", 12, "John calmer at the end, through the process rather than promises"],
            ["Plain language", 8, "No jargon; John could repeat the rules back"]
          ]
        },
        notes: [
          "Before the run, tell the room what decides the grade: the routing. A polished segment that answers one substantive question fails.",
          "Ask before they start: “Which of John's questions can you answer?” The setting, the logistics, the general rules: yes. The gap, the missed April therapy, the seatbelt, the 2021 visits, the MRI: no.",
          "Watch for the helpful half-answer. “Always tell the truth” is a general rule; “just say you had no ride” is a script. Stop the run when you hear one and replay the do/don't panel.",
          "Grade the logistics hard. A wrong time or link on 02/18/2027 costs as much as a bad answer, and his new number goes in the CMS before anything else."
        ]
      },

      {
        kind: "lesson", id: "d5m3-l2", compact: true,
        title: "Opposing Counsel's Traps & Defending Key Testimony",
        topic: "The four categories, the seven Golden Rules, and what an objection means",
        visual: "A wide trap map in three columns. Left: seven red-bordered trap cards stacked vertically, each with a mono label — IS THAT ALL? · COMPOUND · “DEGENERATIVE” · GAP MISCHARACTERISED · SEATBELT · 2021 PRIOR · SILENT STARE. Centre: seven navy rule chips with orange numbered badges ①–⑦ (TRUTH · PAUSE · SAY IT · NO GUESSING · SHORT · SILENCE · DON'T ARGUE), each trap joined to its rule by a thin orange leader. Right: one tall navy shield, ATTY. THORNE · PREPARES · OBJECTS, that every leader ends in. No card anywhere holds a scripted answer; that empty space is deliberate. Footer strip in red: OBJECTION → STOP TALKING.",
        tell: {
          why: "Atty. Mercer doesn't need John to lie: a hurried “yes” to a narrowed list, a guess or an argument does the same damage. His Answer and the records show where he will dig: the gap, the disruption, the 2021 visits, the seatbelt. Seven general rules and Atty. Thorne's objections meet every trap; a script meets none.",
          rules: [
            "Defense questions fall into four categories: personal background (work, homes, earlier lawsuits), the crash mechanics, medical history (this injury and anything before it), daily life. Clients underreport the third most; here, the 2021 low-back visits.",
            "Rule 1, the absolute truth. A damaged case can be saved; a lied-about one cannot. The prior-injury question is the Liar's Trap: counsel usually already has the records and is testing honesty.",
            "Rules 2 and 3: pause two full seconds (time to think, a clean transcript, a window for Atty. Thorne to object; on video it also absorbs the lag), then answer in words. The reporter cannot type a nod or “uh-huh.”",
            "Rules 4 and 5: never guess or speculate. An honest estimate is fine; a guess dressed as fact is not, and “I don't know” or “I don't recall” is a complete answer. Answer only what was asked, then stop: the smallest target.",
            "Rules 6 and 7: after a short answer, hold the silence and wait for the next question, eyes on the camera. Don't try to win: a deposition is information gathering, and the legal battle is Atty. Thorne's.",
            "The “Is that all?” trap: “So it was just the neck stiffness. Is that all?” A flat “yes” to a list from memory can later fence off the hand numbness and arm symptoms. Atty. Thorne drills it: the complete medical record, not memory, is the full list.",
            "Compound and loaded questions fold two facts, or a false premise, into one “yes”: “You waited three weeks because you felt fine?” General rule: if a question has two parts or is unclear, say so. The record says 14 days.",
            "Objections: “Objection, form” is a routine flag on the record. John stops and lets the objection finish. Then he answers the question unless Atty. Thorne instructs him not to; often he will hear “You can answer.”",
            "The gap and the seatbelt are not won in the deposition. The EMS report, the MRI's “no significant degenerative change at the adjacent levels”, Dr. Reyes's Causation Letter and the EDR are Atty. Thorne's to use: in his set, never a script for John."
          ],
          upl: [
            "You may explain the seven rules, what an objection is and how the day runs. You may not tell John how to answer any trap, rehearse his wording on the gap, the disruption, the 2021 visits or the seatbelt, or signal him while he testifies. Atty. Thorne prepares and defends the testimony."
          ]
        },
        show: {
          caption: "Seven traps on John's file, and what meets each",
          type: "table",
          head: ["Trap", "How it may sound", "Rule it tests · Atty. Thorne's protection"],
          rows: [
            ["“Is that all?”", "“Just neck stiffness. Is that all?”", "4 · the complete medical record"],
            ["Compound", "“You waited, and felt fine?”", "2 · objection to form"],
            ["“Degenerative”", "“Your MRI showed wear and tear?”", "4 · the 03/13/2026 MRI report"],
            ["Gap mischaracterised", "“Three weeks with no doctor?”", "2 · the record: 14 days"],
            ["Seatbelt", "“You weren't buckled, were you?”", "1 · the EMS report and the EDR"],
            ["2021 prior", "“You'd treated your neck before?”", "1 · the 2021 records: low back"],
            ["Silent stare", "A long pause after a short answer", "6 · hold the silence"]
          ]
        },
        ops: [
          ["Answer served 11/12/2026", "Map each pleaded defense to the questions it predicts", "CMS → Litigation → Deposition prep log", "Comparative fault, causation and failure to mitigate each mapped to at least one trap"],
          ["Trap map complete", "Confirm the record that meets each trap is in Atty. Thorne's set", "CMS → Documents", "EMS report, MRI report (03/13/2026), Causation Letter (06/19/2026), EDR download and Northgate Attendance Record all present"],
          ["John asks how to answer a trap", "Log it in his words and route it", "CMS → Tasks → Escalate", "Routed the same day; no wording offered"]
        ],
        best: [
          "A deposition is information gathering; the records win the argument later.",
          "Explain objections ahead of time so John doesn't freeze.",
          "Silence is safe; rambling is not.",
          "Pitfall: a “yes” to a list from memory that narrows the case.",
          "Pitfall: a client who argues with defense counsel or talks over an objection.",
          "Pitfall: preparing only the crash mechanics and missing the medical history."
        ],
        sources: ["D5#10", "D5#12", "D5#13", "D5#15", "D5#16", "D5#17", "D5#18", "D5#20", "Newly authored: compound and loaded-question traps"],
        rubric: {
          ai: [
            ["Golden Rules", 20, "All seven stated correctly, with the reason for each"],
            ["Trap map", 20, "Each trap matched to the rule it tests and the pleaded defense behind it"],
            ["Record anchors", 20, "14 days (02/06–02/20/2026), 19 days (04/02–04/21/2026), the MRI wording, the EMS report and the EDR"]
          ],
          trainer: [
            ["UPL boundary", 20, "No wording offered for any trap; substance routed to Atty. Thorne"],
            ["Strategic grasp", 20, "Explains why the deposition is not where the gap is won"]
          ]
        },
        notes: [
          "Open with “Defense attorneys love psychological traps,” and spring one on the room: “So it was just the neck stiffness. Is that all?” Count the hands that would say yes, then point to the hand numbness in the 02/20/2026 urgent-care note.",
          "Ask: “Which of the four categories do clients underreport?” It is medical history before the accident; on this file, the 2021 low-back visits.",
          "Legal nuance on objections: in many courts, form objections must be made at the deposition or are waived, and the witness then answers. Instructions not to answer are narrow: the federal rule, FRCP 30(c)(2), for example, allows them only to preserve a privilege, enforce a court-ordered limit or present a motion. Confirm the governing rule.",
          "On the seatbelt: whether seatbelt evidence is admissible at all, and for what, varies sharply by state. That is Atty. Thorne's analysis. The CM's part is that the EMS report and the EDR download are in his set."
        ]
      },

      {
        kind: "activity", id: "d5m3-a2", compact: true,
        title: "Mock Deposition Cross-Examination Handling",
        topic: "Skill Activity 2 — observe, log and route; never coach",
        visual: "Split screen. Left 60%: a mock video deposition — AI ATTY. GRANT MERCER questioning, AI JOHN DOE answering, ATTY. THORNE's tile carrying an orange OBJECTION flag, a running timer top-right in mono. Right 40%: the TRAP LOG as a table — Time · Question as asked · Category, trap and record · Rules — with six trap-type chips above it plus one dashed optional SILENT STARE chip that turn from grey to orange as each is logged. The trainee's own tile sits small at the bottom with its microphone icon struck through. Across the foot of the slide, a red band: OBSERVE · LOG · ROUTE — NEVER COACH. The argument: the trainee's only output is the log.",
        act: {
          scenario: "File date 02/16/2027, Track B, the second prep session. Atty. Thorne runs a mock cross-examination: AI defense counsel, playing Atty. Grant Mercer, questions AI John Doe while Atty. Thorne defends and objects. Your microphone is muted. Atty. Thorne debriefs John from your log when the mock ends.",
          prompt: "Keep the Trap Log for Atty. Thorne's debrief while the mock runs. For each trap, log the timestamp, the question in AI Mercer's words, its category (background, crash, medical history, daily life), the trap type (the “Is that all?” trap, a compound question, “degenerative”, the gap mischaracterised, the seatbelt, the 2021 prior, the silent stare) and the Golden Rules John kept or broke. Beside every mischaracterisation, put the record fact and its source. Log each objection and whether John stopped talking. Coach nothing, during the mock or after it: route the log to Atty. Thorne. The log is for Atty. Thorne alone; nothing in it goes to John.",
          tool: "Call Simulator → AI defense counsel: Atty. Grant Mercer (mock cross-examination, led by Atty. Thorne) · CMS → Litigation → Deposition prep log",
          output: "A timestamped Trap Log, scored against the seven Golden Rules, routed to Atty. Thorne before his debrief.",
          checkpoints: [
            "All six assigned traps logged: “Is that all?”, compound, “degenerative”, gap mischaracterised, seatbelt, 2021 prior (and the silent stare, if AI Mercer uses it)",
            "Every entry carries a timestamp and the question in AI Mercer's words",
            "Every entry tagged with one of the four categories: personal background, crash mechanics, medical history, daily life",
            "Gap entry set against the record: 14 days, 02/06/2026 to 02/20/2026; any disruption question against 19 days, 04/02/2026 to 04/21/2026",
            "“Degenerative” entry cites the 03/13/2026 MRI report: “no significant degenerative change at the adjacent levels”",
            "Seatbelt entry cites the EMS Run Report (“restrained front-seat passenger”) and the EDR download (belt buckled) as Atty. Thorne's documents",
            "2021 entry set against the record: three chiropractic visits for low-back stiffness, resolved; no prior neck complaints",
            "Each answer scored for the pause, a spoken answer, no guessing, brevity, silence held and no arguing; any answer at odds with the record flagged for Atty. Thorne (rule 1)",
            "Each objection logged, with whether John stopped talking at once",
            "No coaching: no signal, chat message or comment to John during or after the mock",
            "Log routed to Atty. Thorne before the debrief"
          ]
        },
        show: {
          caption: "Two entries from a model Trap Log",
          type: "table",
          head: ["Time", "Question as asked", "Category · trap · record", "Rules"],
          rows: [
            ["00:06", "“So it was just the neck stiffness. Is that all?”", "Medical history · “Is that all?” · records show right-hand numbness and arm paresthesia", "Paused (2 kept); closed the list from memory (4 broken): flag"],
            ["00:19", "“You went almost three weeks without a doctor because you felt fine?”", "Medical history · gap mischaracterised and compound · 14 days, 02/06–02/20/2026", "Stopped at the objection (kept); then volunteered more (5 broken): flag"]
          ]
        },
        ops: [
          ["Prep session 2 opens, 02/16/2027", "Open the Trap Log and start the clock at the first question", "CMS → Litigation → Deposition prep log", "Log opened before the first question; timestamps run from it"],
          ["Trap or objection observed", "Log the time, the words, the category, the trap type and the rules tested", "CMS → Litigation → Deposition prep log", "All six assigned trap types covered; record fact beside every mischaracterisation"],
          ["Mock ends", "Route the log to Atty. Thorne for the debrief", "CMS → Tasks → Escalate", "Routed before the debrief; no comment made to John"]
        ],
        best: [
          "Log the question in the questioner's exact words; a paraphrase hides the trap.",
          "Put the record fact beside every mischaracterisation, so Atty. Thorne can debrief from the page.",
          "Pitfall: telling John afterwards “you should have said…”. The debrief is Atty. Thorne's.",
          "Pitfall: a nod or a chat message to the witness mid-question. That is coaching."
        ],
        sources: ["D5#12", "D5#13", "D5#15", "D5#16", "D5#17", "D5#18", "D5#20", "Newly authored: compound and loaded-question traps"],
        rubric: {
          ai: [
            ["Trap coverage", 20, "All six assigned trap types logged"],
            ["Record accuracy", 15, "14 days, 19 days, the MRI wording, the EMS report and EDR, and the 2021 visits stated correctly"],
            ["Rule scoring", 15, "Every answer scored against the seven rules; every objection logged"],
            ["Log discipline", 10, "Timestamp, verbatim question and category on every entry; routed before the debrief"]
          ],
          trainer: [
            ["UPL boundary: no coaching", 20, "No signal, suggestion or comment to John, during the mock or after it"],
            ["Observation quality", 20, "Atty. Thorne could debrief from the log without replaying the mock"]
          ]
        },
        notes: [
          "Set the roles out loud before the mock: Atty. Thorne leads and defends, AI Mercer questions, AI John answers, the trainee observes. Mute the trainee's microphone if the platform allows; it makes the boundary physical.",
          "After the mock, ask: “Which trap worked on John, and which rule would have protected him?” Then ask who tells John. The answer is Atty. Thorne, in the debrief.",
          "Grade the log for precision: the question in AI Mercer's words, the timestamp, and the record fact beside every mischaracterisation (14 days, 19 days, the MRI wording).",
          "Watch the trainee's face and the chat window. A nod or a typed message to the witness during questioning is coaching, in a mock or on 02/18/2027."
        ]
      },

      {
        kind: "check", id: "d5m3-kc",
        title: "Deposition Readiness Audit",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split: cream question panel above, navy CM Self-Summary card below-left with the 1–5 skill ladder below-right, and the 60/40 strip with the separate red UPL gate on the far right. Unique to this module: between the question panel and the summary card, a full-width DEPOSITION READINESS strip of five checkpoint chips — AUDIT ROUTED · PILLARS DELIVERED · TECH CHECK PASSED · DAY-BEFORE CONFIRMED · TRAP LOG DEBRIEFED — ending in a closed navy barrier labelled 02/18/2027 · 10:00 A.M., with a small note: “opens when all five are green.”",
        check: {
          questions: [
            "List the landmines the pre-deposition audit must surface on John Doe's file before 02/04/2027, with the record that documents each.",
            "Set out the day-before checklist for 02/17/2027: who you confirm with, what you confirm, the exhibit set and the backup contact.",
            "Name the four categories of defense questions. Which do clients most often underreport, and where does that risk sit on this file?"
          ],
          summary: [
            "Summarize, in your own words, what you learned about preparing a client to testify: the principles, not the clicks.",
            "Articulate your strategy: John testifies on 02/18/2027. What is your next action on this file, and why is it the right one rather than another?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Running a pre-deposition audit that surfaces every landmine",
            "Delivering the three prep pillars and the virtual-deposition rules",
            "Explaining the seven Golden Rules and objections in plain words",
            "Recognising and logging opposing counsel's traps",
            "Running the day-before checklist and the technology check",
            "Routing every substantive question to Atty. Thorne without answering it"
          ]
        },
        best: [
          "Answer with the file's own dates, records and names, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the difference."
        ],
        sources: ["D5#8", "D5#14", "D5#15", "D5#16", "D5#17", "D5#18", "D5#20"],
        rubric: {
          ai: [
            ["Audit accuracy", 20, "Gap 14 days (02/06–02/20/2026), disruption 19 days (04/02–04/21/2026), 2021 visits, seatbelt, MRI wording, written discovery, social media"],
            ["Rules and categories", 15, "Seven Golden Rules, four categories and objection handling stated correctly"],
            ["Logistics accuracy", 15, "02/17/2027 confirmations; 02/18/2027 at 10:00 a.m.; Riverton Court Reporting; John's new number and Margaret as backup"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Question 5 routed with no content; a late start left to Atty. Thorne"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Open with the readiness strip on screen and ask which chip is hardest to turn green honestly. Most say the audit; the honest answer is the routing, because it is the one tested under pressure.",
          "Ask the room: “It is 02/03/2027. John has just resurfaced with a new phone, fifteen days before he testifies. What can't wait until tomorrow?” His new number in the CMS, and the audit routed to Atty. Thorne.",
          "Question 5 is the UPL gate. Any reply with content about the gap fails the module, however polished. The right reply routes the question to Atty. Thorne and logs it in John's words.",
          "Question 6 is the pressure scenario: call the new number, then Margaret's backup number, resend the link, and tell Atty. Thorne at once. What is said to Atty. Mercer and the court reporter, and whether the deposition starts late or is reset, is counsel's call, not the CM's."
        ]
      }

      ]
    },

    /* ---------- DAY 5 · MODULE 4 ---------- */
    {
      n: 4, id: "d5m4",
      title: "Complex Liability Disputes, Comparative Negligence & MIA Client Skip-Tracing",
      about: "The comparative-fault defense answered allegation by allegation from the file's own evidence, a defendant found and served after he moved, a client reached before his deposition, and the final check across all five days.",
      quiz: [
        {q: "(Day 2 · Day 5) John Doe goes unreachable on 01/22/2027, 27 days before his 02/18/2027 deposition. Running Day 2's No Contact Protocol at litigation speed, which of these is the Case Manager's work?",
         opts: ["Tell Margaret Doe that missing the deposition could end John's case", "Decide whether to ask Atty. Mercer to move the deposition", "Run the channel ladder, escalate to Atty. Thorne with the deposition impact, and prepare the certified Final Warning Letter for his signature", "Order a Skip-Trace on John at once, as was done for Robert Smith"],
         a: 2, r: "The ladder, the escalation and the letter are the CM's; moving the deposition and any withdrawal are Atty. Thorne's. Margaret is told only that the firm needs John to call. John's address is known (2214 Maple Hollow Rd), so Day 2's Skip-Trace gate is not met; he was reached through Margaret on 02/03/2027."},
        {q: "(Day 3 · Day 5) At the 02/18/2027 deposition, defense counsel works the 14-Day Gap. Which Day 3 work product lets Atty. Thorne show the gap was explained from the start, not at deposition?",
         opts: ["The Gap Explanation Record from the recorded call, with its corroboration: the EMS report, Northgate's Attendance Record, the texts to Margaret, the 02/07/2026 pharmacy receipt and the urgent-care history", "Dr. Helen Park's MRI read of 03/13/2026", "The A-C-T record for April 2026", "The audited Riverton Spine & Rehab ledger"],
         a: 0, r: "The MRI answers “degenerative,” and A-C-T answers the 19-day disruption in April; neither explains 02/06–02/20/2026. The Gap Explanation Record does, and Dr. Reyes's Causation Letter (06/19/2026) ties it to the injury. Atty. Thorne prepares the testimony; the CM never scripts it."},
        {q: "(Day 2 · Day 5) The 11/12/2026 Answer says Kevin Alvarez's Escape entered the all-way stop out of turn. Which evidence, preserved months before suit, shows the order of entry directly?",
         opts: ["The Escape's event data recorder, downloaded 10/2026", "The Riverton Fire EMS Run Report", "Dr. Reyes's Causation Letter of 06/19/2026", "The doorbell-camera video from 2214 Maple Hollow Rd, preserved on 02/17/2026 and copied 02/19/2026"],
         a: 3, r: "The video shows the Escape stopped and Smith rolling through; Ruth Calloway and Smith's citation on RPD-26-018842 corroborate it. The EDR speaks to the belt and the 11 mph speed, not the order of entry. How fault would be weighed is Atty. Thorne's call."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d5m4-l1", brief: true,
        title: "Comparative Negligence & the Liability Counter-Package",
        topic: "Three allegations in the 11/12/2026 Answer, and the evidence that answers each",
        visual: "Two zones. Left 60%: the four-row regime table on a cream card, regime names in navy, the two outcome columns headed by mono pills JOHN 20% and JOHN 50%; every “Barred” cell is filled danger red, so the eye finds the cliff before reading a label. Right 40%: three stacked danger-bordered allegation cards with orange numbered badges, ① OUT OF TURN ② UNBELTED ③ FAILED TO MITIGATE, each with a navy → to its answering evidence as mono pills: RPD-26-018842 · CALLOWAY · VIDEO; EDR BUCKLED · EMS “RESTRAINED”; A-C-T 04/08 → 04/23. A slim orange strip along the foot reads STACK STAYS $40,000. The argument: every point of fault costs John money, and each point already has its answer in the file.",
        tell: {
          why: "After suit, the defense argued fault and mitigation: the car he rode in and his seatbelt (comparative fault), his missed visits (failure to mitigate). Fault can reduce or bar recovery; mitigation cuts only the damages the missed care caused. The counter-package answers each from this file, with evidence that can come in.",
          rules: [
            "Comparative negligence apportions fault. Pure: damages fall by John's share, however large. Modified: they fall, but recovery is barred once his share reaches 50% in some states or 51% in others. Contributory, in a handful of jurisdictions: any fault bars recovery. Confirm the governing rule.",
            "Record where liability stands, with its source: accepted, partial or denied. Keystone accepted PD liability on 02/17/2026 and argued causation before suit; the Answer now pleads comparative fault. Its weight is Atty. Thorne's call.",
            "Allegation 1, “the Escape entered the all-way stop out of turn,” targets Kevin Alvarez's driving, not John's. Whether a driver's fault can be charged to a passenger, or apportioned to a non-party, is Atty. Thorne's analysis. Your job is the evidence.",
            "Never add anything to the stack because the defense blames Kevin Alvarez. Whether his alleged fault touches coverage is a coverage question for Atty. Thorne; the file's verified stack stays $40,000, BI → Host UM → Relative UM.",
            "Allegation 2, “John was unbelted,” is answered twice: the Escape's event data recorder shows the front-passenger belt buckled, and the EMS Run Report reads “restrained front-seat passenger.” Seatbelt evidence is barred in some states and limited in others: confirm the governing rule.",
            "Defense 3, failure to mitigate, is not crash fault: if proved, it trims only damages reasonable care would have avoided. It targets 19 days without visits (04/02 → 04/21/2026). The A-C-T record answers: the 04/08 call, extension refused 04/10, evening slots, attendance 04/21 and 04/23. Burden: generally the defense's; confirm.",
            "Evidence counts only if it can come in. For every item record its source, who can authenticate it and its chain of custody. The doorbell video: Margaret Doe's camera, preservation asked 02/17/2026, copy secured 02/19/2026, the native file unaltered, every transfer logged.",
            "Don't rest liability on report RPD-26-018842: whether Smith's citation, or his plea or payment of it, is admissible varies by state. Ruth Calloway, the video and the point of impact (the Escape's front passenger door) carry it; the EDR's 11 mph corroborates.",
            "The Answer also pleads causation (the 14-Day Gap; the “degenerative” MRI). The Gap Record joins the package in deposition prep: the four reasons, the EMS neck complaint, Dr. Reyes's 06/19/2026 letter."
          ],
          upl: [
            "You may gather, authenticate and index the evidence against each allegation, and tell John what the Answer says. You may not tell John his share of fault, whether seatbelt evidence comes in, or what Kevin Alvarez's fault means for coverage. Those are Atty. Thorne's."
          ]
        },
        show: {
          caption: "One finding, four outcomes: confirm the governing rule",
          type: "table",
          head: ["Regime", "John 20% at fault", "John 50% at fault"],
          rows: [
            ["Pure comparative", "Recovers 80%", "Recovers 50%"],
            ["Modified, 50% bar", "Recovers 80%", "Barred"],
            ["Modified, 51% bar", "Recovers 80%", "Recovers 50%"],
            ["Contributory", "Barred", "Barred"]
          ]
        },
        ops: [
          ["Answer filed 11/12/2026 pleading comparative fault, causation and failure to mitigate", "Log each defense as its own line and confirm the filing on the docket", "CMS → Litigation → Pleadings Log · Docket System", "Three defenses logged separately, each dated 11/12/2026"],
          ["Defenses logged", "Map the file's evidence to each allegation with source, witness and custody", "CMS → Litigation → Liability counter-package", "No item without a source document and a named authenticating witness"],
          ["An item lacks foundation or a holder won't produce", "Flag it for a Subpoena Duces Tecum and route to Atty. Thorne", "CMS → Tasks → Escalate", "Foundation gap named, with the record holder"],
          ["Deposition prep set for 02/04 and 02/16/2027", "Deliver the counter-package and the Gap Record to Atty. Thorne's prep set", "CMS → Documents · CMS → Tasks", "Both in the prep set before 02/04/2027"]
        ],
        best: [
          "Answer each allegation with a document, not an argument: the record speaks, counsel argues.",
          "Keep the liability position recorded as the claims team does: accepted, partial or denied, with date and source.",
          "Use the damage pattern: point of impact and direction of travel, read with the video and the witness.",
          "Pitfall: building the package on the citation alone.",
          "Pitfall: telling John he “can't be blamed” because he was a passenger.",
          "Pitfall: adding Kevin Alvarez's policy to the stack because the defense blames him."
        ],
        sources: ["LSH Claims Specialist: liability determination — accepted, partial, denied; written confirmation; pure and modified comparative negligence", "LSH Claims Specialist: liability disputes — strengthening the evidence, damage patterns, the post-suit pivot to causation and damages", "Newly authored: seatbelt-evidence and citation admissibility as state-variable questions; authentication and chain of custody in the counter-package"],
        rubric: {
          ai: [
            ["Regime accuracy", 20, "Pure, modified (50% and 51% bars) and contributory stated correctly, with “confirm the governing rule”"],
            ["Allegation mapping", 25, "All three allegations matched to the file's evidence: citation, Calloway, video, EDR, EMS report, A-C-T record"],
            ["Foundation", 15, "Source, authenticating witness and chain of custody named for each item; video dates 02/17 and 02/19/2026"]
          ],
          trainer: [
            ["Legal nuance", 20, "Sees that allegation 1 targets the driver, and that seatbelt and citation evidence are admissibility questions"],
            ["UPL boundary", 20, "No fault share, admissibility or coverage opinion offered; Kevin Alvarez's coverage routed to Atty. Thorne"]
          ]
        },
        notes: [
          "Open with the Answer itself. Read its three allegations aloud, then ask which one is not about John at all. The out-of-turn allegation is about Kevin Alvarez's driving.",
          "Put the table to the room: “If a jury finds John 20% at fault, what does he recover under each regime? And at 50%?” Make them say “Barred” out loud for the modified 50% row.",
          "Watch for trainees who win the seatbelt point by argument. The EDR and the EMS report win it; the Case Manager's job is to make sure both can come in.",
          "Legal nuance: the carpool may tempt the defense to tie Kevin Alvarez's driving to John; whether any theory lets it is Atty. Thorne's analysis. Seatbelt and citation admissibility vary by state. And whatever the defense says about Kevin, the stack stays $40,000."
        ]
      },

      {
        kind: "activity", id: "d5m4-a1",
        title: "Building the Comparative Liability Counter-Package",
        topic: "Skill Activity 1 — answer each allegation from the file",
        visual: "A three-row counter-package matrix across the full slide width on a white card with a navy header bar. Columns: Allegation · Answering evidence · Source · Authenticating witness · Chain of custody. Each row opens with an orange numbered badge and a red allegation chip; evidence cells hold mono pills (EDR, EMS, RPD-26-018842, VIDEO). Cells with an open foundation gap are outlined in orange dashes until filled. Beneath, a slim custody timeline for the doorbell video: 02/06/2026 recorded → 02/17/2026 preservation request → 02/19/2026 copy secured → counter-package. Bottom-right, a navy card headed FOR ATTY. THORNE lists the open legal questions. The argument: a row is finished only when its evidence can come in.",
        act: {
          scenario: "File date 11/12/2026, Track B. Atty. Grant Mercer of Mercer & Hale LLP has filed Robert Smith's Answer in Civil Action No. 26-CV-04417. It denies liability and pleads comparative negligence (the Escape entered the all-way stop out of turn; John was unbelted), causation (the gap; a “degenerative” MRI) and failure to mitigate. In the file: report RPD-26-018842, Ruth Calloway's details, the doorbell video, the 10/2026 EDR download, the EMS Run Report and the A-C-T record.",
          prompt: "Build the liability counter-package for Atty. Thorne. For each of the three allegations, list the file evidence that answers it, its source document, the witness who can authenticate it, its chain of custody, and any gap in its foundation. Write out the doorbell video's chain from the 02/17/2026 preservation request to the 02/19/2026 copy. For any record that will need a custodian, draft a narrow Exhibit A for a Subpoena Duces Tecum, for his review. Close with the questions only he can answer: the governing fault rule, seatbelt and citation admissibility, and whether fault on Kevin Alvarez touches coverage.",
          tool: "CMS → Litigation → Liability counter-package · Action Plan Editor → Subpoena template",
          output: "An allegation-by-allegation counter-package with foundation for every item, a draft Exhibit A, and the open legal questions routed to Atty. Thorne.",
          checkpoints: [
            "Two comparative-fault allegations and the failure-to-mitigate defense listed as separate rows: out of turn, unbelted, failure to mitigate",
            "Out of turn answered by report RPD-26-018842 (Smith cited for failure to stop), Ruth Calloway of 2209 Maple Hollow Rd, the doorbell video and the point of impact, with the EDR's 11 mph as corroboration only",
            "Unbelted answered by the EDR (front-passenger belt buckled) and the EMS Run Report (“restrained front-seat passenger”)",
            "Failure to mitigate answered by the A-C-T record: alert and call 04/08/2026, extension refused 04/10, evening slots from 04/21, attendance confirmed 04/21 and 04/23",
            "Disruption stated exactly: 19 days without visits, 04/02 → 04/21/2026, four missed visits, caused by the rental ending and the carpool ending",
            "Video chain of custody: Margaret Doe's camera, preservation 02/17/2026, copy secured 02/19/2026, native file unaltered, each transfer logged",
            "An authenticating witness named for every item (for example Margaret Doe or Ruth Calloway for the video, a records custodian for the EMS report); whether a signed statement from Ruth Calloway exists is recorded, and taking one is routed to Atty. Thorne",
            "Draft Exhibit A limited to John Doe's 02/06/2026 Riverton Fire EMS run and named record types, never “all records”; routing note: notice to Atty. Grant Mercer before the custodian is served",
            "Open questions routed to Atty. Thorne: fault regime, seatbelt and citation admissibility, Kevin Alvarez and coverage",
            "Stack stated as $40,000 (BI → Host UM → Relative UM); no layer added"
          ]
        },
        ops: [
          ["Answer received 11/12/2026", "Open the counter-package, one row per allegation", "CMS → Litigation → Liability counter-package", "Three rows, each with evidence, source, witness and custody"],
          ["A record will need a custodian", "Draft the Subpoena Duces Tecum with a narrow Exhibit A", "Action Plan Editor → Subpoena template", "Exhibit A names John Doe, 02/06/2026 and specific record types"],
          ["Package complete", "Route to Atty. Thorne with the open legal questions", "CMS → Tasks → Escalate", "Every question listed; no conclusion drafted as advice"]
        ],
        best: [
          "One allegation, one row: a reviewer should find the answer to each in seconds.",
          "Record foundation now; a document no one can authenticate may never reach the jury.",
          "The EMS report does double duty: “restrained” answers the seatbelt, and the neck complaint on 02/06/2026 answers the gap.",
          "Pitfall: an Exhibit A asking for “all records of any kind”; it invites a Motion to Quash as a fishing expedition.",
          "Pitfall: calling the EDR's 11 mph proof of the right-of-way; it corroborates the witness and the video, it doesn't replace them."
        ],
        sources: ["D5#23", "D5#30", "LSH Claims Specialist: handling liability disputes — written basis, stronger evidence, witness statements, escalation to the legal team", "Newly authored: authentication and chain of custody in the counter-package"],
        rubric: {
          ai: [
            ["Allegation coverage", 20, "All three allegations answered with the right file evidence"],
            ["Fact accuracy", 15, "RPD-26-018842, 2209 Maple Hollow Rd, buckled and 11 mph, “restrained”, 04/02 → 04/21/2026 and the A-C-T dates exact"],
            ["Foundation and custody", 15, "Source, witness and chain for every item; video chain 02/17 → 02/19/2026"],
            ["Exhibit A scope", 10, "Narrow: John Doe, the 02/06/2026 run, named record types"]
          ],
          trainer: [
            ["Strategic judgment", 20, "Weights the evidence sensibly; doesn't rest liability on the citation or the EDR's speed"],
            ["UPL boundary", 20, "Fault rule, admissibility and coverage all routed to Atty. Thorne; nothing framed as legal advice"]
          ]
        },
        notes: [
          "Hand out the Answer's three allegations as three blank rows. Tell the room the package is graded row by row, and a row without an authenticating witness is not finished.",
          "Ask: “Which single document answers two defenses?” The EMS Run Report: “restrained” answers the seatbelt, and the neck complaint on the day of the crash answers the causation defense on the gap.",
          "Read the Exhibit A drafts. Anything that says “all records” goes back: one patient, one date, named record types.",
          "Legal nuance: the EDR's 11 mph is consistent with a car pulling away from a stop, but speed alone does not prove who had the right-of-way. Let Ruth Calloway and the video carry that."
        ]
      },

      {
        kind: "lesson", id: "d5m4-l2", brief: true,
        title: "Skip-Tracing, Process Servers & Certified Notice",
        topic: "Finding the defendant who moved and the client who went quiet",
        visual: "Two parallel swimlanes, left to right. Upper lane, navy, ROBERT SMITH — DEFENDANT: three red ✗ attempt dots at 118 LARKSPUR LN (10/01 · 10/05 · 10/08), then an orange SKIP-TRACE node (10/09) bending the lane to 4410 QUARRY RIDGE CT and a green ✓ SERVED 10/14, ending at an AFFIDAVIT 10/16 chip and a mono pill ANSWER DUE 11/13/2026. Lower lane, orange, JOHN DOE — CLIENT: a grey silent stretch from 01/22/2027 with protocol badges ①–④ along it, a CERTIFIED MAIL + EMAIL chip pair, and a green node 02/03 · VIA MARGARET, ending at a navy DEPOSITION 02/18/2027 block. Between the lanes, a red callout: “Withdrawal: never the CM's to raise.” The argument: the same tools, different authority.",
        tell: {
          why: "Two people went missing on this file. Robert Smith moved before he was served; John Doe went silent 27 days before his deposition. The tools overlap (Skip-Trace, process server, certified proof), the authority lines differ, and the record proves diligence.",
          rules: [
            "Service: the clerk issues the Summons; the process server gets complaint, Summons and Smith's details; you follow up every 5 days; the affidavit of service is filed. Here: filed 09/24, served 10/14, affidavit 10/16/2026.",
            "Failed attempts at 118 Larkspur Ln (10/01, 10/05, 10/08) and a neighbor saying Smith moved in August mean a stale address. Skip-Trace first, via the firm's licensed databases, permissible purpose only (no pretext calls): utility, employment, active-address records. 10/09: 4410 Quarry Ridge Ct, Millbrook.",
            "Right address, still dodging: vary the server's windows (early morning, evenings, weekends where the rules allow; some states bar Sunday service). Then Atty. Thorne may move for alternative service. Unserved in time, a case can be dismissed: confirm the court's rule.",
            "Service starts his clock: answer due 11/13/2026 (30 days on this file's configured rules). Check the docket weekly, never only the e-filing emails; a motion lost in spam still runs.",
            "A Subpoena Duces Tecum compels a non-party's records. Narrow Exhibit A (patient, date, record types); “all records” invites a Motion to Quash. Notice opposing counsel first (often 5–10 days; confirm), then serve the custodian by process server.",
            "An unreachable client in suit runs Day 2's No Contact Protocol. John went quiet 01/22/2027; Step 3 names the 02/18/2027 deposition and the 02/04 and 02/16 prep. Moving anything is Atty. Thorne's call.",
            "The Step 4 Final Warning Letter (certified notice) goes by certified mail AND email over Atty. Thorne's signature: attempts itemized, a 7–14 day response date before 02/04/2027, how to respond. For 02/03/2027, send by 01/27/2027.",
            "Day 2's fourth element, notice of potential withdrawal, goes in only if Atty. Thorne directs it, in his words: in a pending suit withdrawal generally needs the court's leave. Never raise withdrawal anywhere else.",
            "Day 2's gate governs a client skip-trace: ladder exhausted, Step 4 letter sent, its deadline passed, and Atty. Thorne authorizes.",
            "The emergency contact is an approved channel: John was reached through Margaret Doe on 02/03/2027. Tell her only that the firm needs John to call, and how."
          ],
          upl: [
            "You may run the Skip-Trace Atty. Thorne authorizes, instruct and track the process server, and draft the notice for his signature. You may not decide on alternative service, threaten or announce withdrawal, or tell John what missing his deposition would do to his case."
          ]
        },
        show: {
          caption: "Same tools, different authority",
          type: "compare",
          boxes: [
            {head: "Robert Smith — the defendant who moved", items: [
              "10/01, 10/05, 10/08: attempts at 118 Larkspur Ln fail.",
              "10/09: Skip-Trace → 4410 Quarry Ridge Ct, Millbrook.",
              "10/14: served by Allied Process Services; 10/16 affidavit.",
              "Answer due 11/13/2026; filed 11/12/2026."
            ]},
            {head: "John Doe — the client who went quiet", items: [
              "01/22/2027: unreachable; deposition 02/18/2027.",
              "Steps 1–3: review, ladder, Atty. Thorne notified.",
              "Step 4: certified mail AND email; reply before 02/04/2027.",
              "02/03/2027: reached through Margaret Doe."
            ]}
          ]
        },
        ops: [
          ["Third failed attempt, 10/08/2026; neighbor says Smith moved", "Escalate for Skip-Trace authority; send the result to the process server", "CMS → Tasks → Escalate · Email Workspace", "Skip-Trace result logged 10/09/2026; server re-assigned to 4410 Quarry Ridge Ct"],
          ["Affidavit of service filed 10/16/2026", "Docket the answer date and set the weekly docket check", "Docket System · CMS → Calendar", "Answer due 11/13/2026 on the calendar; weekly check recurring"],
          ["Subpoena Duces Tecum approved by Atty. Thorne", "Notice opposing counsel, then serve the custodian by process server", "Court E-Filing · CMS → Litigation → Subpoena log", "Notice to Atty. Grant Mercer dated before service; compliance call 5 days before production"],
          ["Client unreachable with a deposition noticed (from 01/22/2027)", "Run Steps 1–3; draft the Step 4 notice for Atty. Thorne's signature", "CMS → Communications Log · Action Plan Editor", "Response date before 02/04/2027; certified mail AND email both logged"]
        ],
        best: [
          "Follow up with the process server every 5 days, and ask for the date and time of each attempt, not just the result.",
          "Pay a records custodian's copy invoice the day it arrives; an unpaid invoice is a delayed production.",
          "Confirm the address before certified mail goes out; a return receipt from a stale address proves nothing.",
          "Pitfall: a fourth attempt at a stale address instead of a Skip-Trace.",
          "Pitfall: serving the non-party before opposing counsel has notice.",
          "Pitfall: telling Margaret Doe why the firm needs John."
        ],
        sources: ["D5#22", "D5#23", "D5#29", "D5#30", "LSH Claims Specialist: No Contact Protocol, Steps 1–6; Final Warning Letter; Withdrawal Letters", "Newly authored: the No Contact Protocol compressed against a deposition date; the emergency contact gets the request, never the case"],
        rubric: {
          ai: [
            ["Service pipeline", 20, "Four steps in order; 10/01, 10/05, 10/08, 10/09, 10/14, 10/16 and the 11/13/2026 answer date exact"],
            ["Evading-defendant protocol", 15, "Skip-Trace → varied windows → alternative service by motion, in that order"],
            ["Subpoena sequence", 10, "Narrow Exhibit A; opposing counsel noticed before the non-party; compliance call 5 days out"],
            ["Certified notice", 15, "Certified mail AND email; a 7–14 day response date landing before 02/04/2027; withdrawal line left to Atty. Thorne"]
          ],
          trainer: [
            ["Diligence judgment", 20, "Tells a stale address from an evasive defendant, and a lost phone from a lost client"],
            ["UPL and authority boundary", 20, "Alternative service and withdrawal reserved to Atty. Thorne; nothing about the case disclosed to Margaret Doe"]
          ]
        },
        notes: [
          "Open with the two missing people side by side. Ask what they share (no working contact point) and what differs (one is the opponent, one is the client, and the authority lines follow from that).",
          "Ask the room: “Three attempts failed at 118 Larkspur Ln. Why is a fourth at 6:00 a.m. the wrong move?” Because the neighbor said he moved: vary the hours only once you have the right address.",
          "Watch for trainees who reuse Day 2's letter unchanged. In suit, the letter goes over Atty. Thorne's signature, withdrawal needs the court's leave, and the deposition date sets the pace.",
          "Legal nuance: service deadlines, alternative-service rules and subpoena notice periods all vary by court. Teach the sequence, and say “confirm the governing rule” every time."
        ]
      },

      {
        kind: "activity", id: "d5m4-a2",
        title: "Skip-Tracing Execution & Certified Notice Dispatch",
        topic: "Skill Activity 2 — find the defendant, reach the client, prove both",
        visual: "Split slide. Left half, PART 1 — SERVICE: a vertical log card (date · time · result) with three failed attempts in red, the Skip-Trace request as an orange escalation chip, the service and affidavit rows in green, ending in a Docket System pill ANSWER DUE 11/13/2026. Right half, PART 2 — CERTIFIED NOTICE: a calendar strip counting backward from 02/18/2027 to 01/22/2027, with 02/04 and 02/16 marked orange as prep sessions and a response-date marker that turns red if it lands after 02/04. Beneath it, the notice draft with a CERTIFIED MAIL + EMAIL chip pair that must both tick, and a navy SKIP-TRACE GATE card with three criteria. The argument: work backward from the date that cannot move.",
        act: {
          scenario: "Two episodes, one file. Part 1, file date 10/08/2026: Allied Process Services reports a third failed attempt at 118 Larkspur Ln (after 10/01 and 10/05), and a neighbor says Robert Smith moved in August. The 10/09 Skip-Trace return (module-local) lists 118 Larkspur Ln (utilities closed 08/2026), 4410 Quarry Ridge Ct, Millbrook (utility opened 08/2026; matches his vehicle registration) and a 2019 address. Part 2, file date 01/22/2027: calls to John Doe go unanswered two days after his deposition was noticed for 02/18/2027, 10:00 a.m., by videoconference. Atty. Thorne has set prep sessions for 02/04 and 02/16/2027.",
          prompt: "Part 1: escalate for Skip-Trace authority; evaluate the 10/09 return, choosing the address on recency and two corroborating sources, and record why; re-instruct Allied Process Services; log service 10/14 and the affidavit 10/16, and docket the answer date. Part 2: run Steps 1–3 of the No Contact Protocol with the litigation impact, then draft the Step 4 certified notice for Atty. Thorne's signature: attempts itemized, a 7–14 day response date before 02/04/2027, how to respond. Send it by certified mail AND email to a confirmed address. Graded call: assess John's Skip-Trace gate on Day 2's three criteria, and say why his case is unlike Smith's.",
          tool: "CMS → Tasks → Escalate · Docket System · CMS → Communications Log · Action Plan Editor → Warning letter template · CMS → Documents → Outgoing",
          output: "A service record from Skip-Trace to answer date, and a dispatched certified notice with both deliveries logged and John's Skip-Trace gate assessed.",
          checkpoints: [
            "Skip-Trace escalated for authority after the 10/08/2026 attempt, not a fourth knock at 118 Larkspur Ln",
            "4410 Quarry Ridge Ct, Millbrook chosen on two corroborating current sources, 118 Larkspur Ln rejected as stale (utilities closed 08/2026), logged 10/09/2026; server told to vary windows (early morning, evening, weekend where the rules allow; some states bar Sunday service) if the first attempt fails",
            "Service 10/14/2026 by Allied Process Services and affidavit filed 10/16/2026 both logged; answer due 11/13/2026 (10/14 + 30 days) docketed",
            "Part 2, Step 1 names the live dates: deposition 02/18/2027 (27 days from 01/22), prep 02/04 and 02/16/2027, plaintiff's expert disclosure 03/15/2027",
            "Channel ladder logged with date, time, channel and outcome: 2+ calls, email to john.doe@example.com and text, then Margaret Doe as emergency contact (her number tried in Step 2, voicemail left, no return call until 02/03/2027)",
            "Step 3 escalation to Atty. Thorne records the deposition impact",
            "Final Warning Letter: attempts itemized, a 7–14 day response date before 02/04/2027 (sent by 01/27/2027 for 02/03/2027), how to respond, and the withdrawal line left to Atty. Thorne (possible, never decided)",
            "Certified mail with return receipt to 2214 Maple Hollow Rd AND email, both logged; signed by Atty. Thorne, not the CM",
            "Withdrawal language present only as Atty. Thorne directed; none from the CM in any other channel, and nothing on what missing the deposition would do to the case",
            "Gate assessed on Day 2's three criteria: ladder exhausted (yes, logged); letter sent by certified mail AND email (by 01/27/2027); deadline expired (no: Margaret reached John on 02/03/2027, the response date). Gate not met; no Skip-Trace. Unlike Smith, John's address is known; only his phone changed",
            "Margaret Doe told only that the firm needs John to call, and how"
          ]
        },
        ops: [
          ["Third failed attempt, 10/08/2026", "Escalate for Skip-Trace authority; re-assign the server to the new address", "CMS → Tasks → Escalate · Email Workspace", "Skip-Trace result 10/09/2026 logged; varied windows instructed"],
          ["Affidavit of service filed 10/16/2026", "Docket the answer date", "Docket System", "11/13/2026 on the calendar with a reminder"],
          ["John unreachable from 01/22/2027", "Run Steps 1–3, then dispatch the Step 4 notice", "CMS → Communications Log · CMS → Documents → Outgoing", "Both deliveries logged; response date before 02/04/2027"]
        ],
        best: [
          "Log the process server's attempts with date, time and result, exactly as you log your own client attempts.",
          "Calendar the notice's response date beside the deposition, so one cannot slip past the other.",
          "A return receipt signed at 2214 Maple Hollow Rd proves delivery to the house, not that John read it: that is why the email goes too.",
          "Pitfall: a response date that lands after the first prep session.",
          "Pitfall: “If you don't call us, the firm will withdraw” in a text to John."
        ],
        sources: ["D5#22", "D5#29", "LSH Claims Specialist: No Contact Protocol; Final Warning Letter; sending Withdrawal Letters (current address, certified mail, dispatch recorded)"],
        rubric: {
          ai: [
            ["Service record", 20, "10/08 → Skip-Trace 10/09 → served 10/14 → affidavit 10/16 → answer due 11/13/2026, each logged"],
            ["Protocol record", 15, "Steps 1–3 logged with date, time, channel and outcome; deposition impact recorded"],
            ["Notice elements and dates", 15, "Attempts itemized, a 7–14 day response date before 02/04/2027, how to respond, and the withdrawal line left to Atty. Thorne (possible, never decided)"],
            ["Dual delivery", 10, "Certified mail and email both logged"]
          ],
          trainer: [
            ["Gate judgment", 15, "Assesses John's Skip-Trace gate correctly and explains why his case differs from Smith's"],
            ["Tone", 10, "Urgent without threatening; a worried client would call back"],
            ["UPL and authority boundary", 15, "Skip-Trace authority, the signature and any withdrawal decision left with Atty. Thorne; Margaret told nothing of the case"]
          ]
        },
        notes: [
          "Run Part 1 as a race against a stale address. The graded move after 10/08 is the Skip-Trace escalation, not a fourth knock.",
          "Ask the room: “John and Smith both have no working contact point. Why does Smith get a Skip-Trace and John does not?” Day 2's gate: ladder exhausted, letter sent, deadline passed. John was reached on 02/03/2027, the response date, so the deadline never expired; and his address is known, only his phone changed.",
          "Check every response date against 02/04/2027. A 14-day window from 01/22 lands on 02/05, after the first prep session: the deposition forces the short end of the window.",
          "UPL gate: no withdrawal language from the Case Manager, in the notice or anywhere else, and Margaret hears only “please have John call us.”"
        ]
      },

      {
        kind: "check", id: "d5m4-kc",
        title: "Final Comprehensive Knowledge Check",
        topic: "Knowledge Check (all five days) + CM Learning Summary & Self-Scale",
        visual: "The standard knowledge-check split, extended for the final check. Above the cream question panel, a full-width five-segment rail, DAY 1 → DAY 5, each segment navy with its day title, and each question's orange number badge tagged with the day it draws from. Below the orange hairline, the navy CM LEARNING SUMMARY card with its three prompts beside the 1–5 skill ladder and six competency rows. Far right, the 60/40 stacked bar (60% AI in navy, 40% Trainer in orange) with UPL as a separate red gate chip below and outside it. At the rail's right end, a closed navy barrier labelled CASE FLOW COMPLETE, opening only when every segment is green.",
        check: {
          questions: [
            "List John Doe's Recovery Stack in its order of operations, with each limit and the total, and name three coverages on this file that are not part of it. Then state the Payer Order for his Medical Bills.",
            "When did the window on the 07/20/2026 BI Time-Limited Demand close, and why that date? On Track A, what had to come from Harbor Point and Cardinal State before the BI release was signed?",
            "Track A nets John Doe $20,359.92 from $40,000.00. Name every deduction with its figure, and explain how costs and liens split between the BI and UM streams."
          ],
          summary: [
            "Summarize what you learned across all five days of John Doe's file: the principles that carried from intake to deposition, not the clicks.",
            "Articulate your strategy: the counter-package is with Atty. Thorne and mediation is set for 03/18/2027. What is your next action on this file, and why is it the right one rather than something else?",
            "Identify the one thing across the whole Case Flow you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Documenting a Treatment Gap and disrupted care so the record answers the defense",
            "Building a multi-layer stack, then executing its demands, consents and a Net Sheet that reconciles to the cent",
            "Supporting litigation: service, docketing, subpoenas and discovery deadlines",
            "Answering a comparative-fault defense with evidence that can come in",
            "Holding the UPL line with the client, the carriers and opposing counsel",
            "Resolving Property Damage and keeping an unresponsive client engaged"
          ]
        },
        best: [
          "Answer from the file: names, dates and figures, not general rules.",
          "Pitfall: answering Question 7 with what John should say. The right answer routes him to Atty. Thorne."
        ],
        sources: ["D1#18", "D1#22", "D1#44", "D3#3", "D3#24", "D4#1", "D5#15", "LSH Claims Specialist: liability determination and disputes"],
        rubric: {
          ai: [
            ["Stack and Payer Order", 15, "$10,000 → $20,000 → $10,000 = $40,000 in order; MedPay, Keystone PD and Bluewater outside it; Payer Order correct"],
            ["Gap and documentation", 10, "14 days (02/06 → 02/20/2026); reasons and corroboration named, including Dr. Reyes's 06/19/2026 letter"],
            ["Settlement mechanics", 15, "08/21/2026 (30 days from receipt on 07/22); written consent before the release; $20,359.92 reconciled with the 25% / 75% allocation"],
            ["Litigation and liability", 10, "The fork explained; mediation non-binding, arbitration binding; each allegation matched to its evidence"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-Summary quality", 10, "Specific and honest across all five days, not a restatement of the slides"],
            ["UPL boundary", 10, "Question 7 routes John to Atty. Thorne; no coaching of testimony anywhere"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "This is the last check before Track B's close-out. Tell the room it spans all five days and is answered from one file: names, dates and figures, not general rules.",
          "Put Question 7 to the room aloud before anyone writes: “John asks how to explain the gap. What do you say?” The only right answer listens, tells him Atty. Thorne will go through it with him, escalates at once and logs the call. The Gap Record is already in counsel's prep set, and the 2021 low-back visits sit in the medical-history category clients most often underreport, which defense counsel already has.",
          "Question 4 is the arithmetic gate: $40,000.00 less the $13,333.33 fee, $486.75 in costs and the $1,240.00 and $4,580.00 liens leaves $20,359.92. A trainee who cannot reconcile it to the cent goes back to Track A's disbursement.",
          "Compare self-ratings with scores across all five days. A 5 on the UPL competency from a trainee who coached John in Question 7 does not pass: UPL is a gate, not a weight."
        ]
      }

      ]
    },
    {
      n: 5, id: "d5m5",
      title: "Case Won: The Arbitration Award, Liens & the Litigation Net Sheet",
      about: "Track B closes: the 07/06/2027 award, the liens reduced against a litigated fund, and the LSH Net Sheet that takes $40,000.00 to John Doe at the 40% tier.",
      quiz: [{"q": "Track B recovers the same $40,000.00 gross as Track A. Why does John Doe net $14,713.75 instead of $20,359.92?", "opts": ["The arbitrator reduced the award for the 14-Day Gap", "Suit was filed: the fee moved to 40% ($16,000.00) and costs rose to $3,895.25", "The UM carriers paid less than their limits", "Peach State's lien grew with interest"], "a": 1, "r": "Same gross, different deductions: 40% once suit was filed ($16,000.00 against $13,333.33), $3,895.25 in receipted costs against $486.75, and liens of $5,391.00 against $5,820.00. $40,000.00 – $16,000.00 – $3,895.25 – $5,391.00 = $14,713.75."}, {"q": "Peach State asserts $1,860.00 against the litigated fund. What does the procurement-cost reduction at this file's fee produce?", "opts": ["$1,240.00", "$1,116.00", "$744.00", "$1,860.00"], "a": 1, "r": "The reduction follows the fee actually charged: 40% of $1,860.00 is $744.00, so $1,860.00 – $744.00 = $1,116.00, accepted in writing 07/14/2027. Track A's $1,240.00 reflected the 33⅓% pre-suit fee."}],
      blocks: [
        {"kind": "lesson", "id": "d5m5-l1", "brief": true, "title": "Disbursing a Litigated Recovery: the 40% Tier, Litigation Costs & the Fund", "topic": "Same $40,000.00, a different net: what suit cost the client, line by line", "visual": "Two tall ledger cards side by side on cream: TRACK A (navy header) and TRACK B (orange header), with the same five rows (Gross, Fee, Costs, Liens, Net). Both gross rows read $40,000.00; on Track B the fee, costs and liens rows are highlighted in orange; the net rows read $20,359.92 and $14,713.75 in large mono type. Between the cards, a slim arrow labelled SUIT FILED 09/24/2026 · 40% TIER. At the foot, a red chip: “No Payoff Letter, no payment.”", "tell": {"why": "Keystone's stonewall turned a $40,000.00 settlement into a lawsuit, a mediation and an arbitration. The 07/06/2027 award brings in the same $40,000.00 gross as Track A, yet John Doe nets $14,713.75, not $20,359.92. The Net Sheet shows him exactly why, line by line, before he signs.", "rules": ["The award ends the case, not the work. Laura Whitcomb's 07/06/2027 award finds John Doe's damages exceed the UM limits and awards Harbor Point's $20,000.00 and Cardinal State's $10,000.00; with Keystone's $10,000.00 BI tendered at the 03/18/2027 mediation, the gross is $40,000.00.", "The fee follows the retainer, not the outcome. Suit was filed 09/24/2026, so the 40% tier applies: $16,000.00. Atty. Thorne confirms the fee on each stream from the retainer before the Net Sheet is drafted.", "Litigation costs need the same receipts as pre-suit costs: filing fee and summons $218.00, Allied Process Services $285.00, mediation (Hon. Carla Benton, plaintiff's half) $1,200.00, arbitration (plaintiff's share of Laura Whitcomb's fee) $900.00, Riverton Court Reporting $645.50 and certified records for the binder $160.00, plus the pre-suit $486.75: $3,895.25.", "A litigated fund still pays only what is owed. The liens are Peach State's $1,860.00 and Riverton Spine & Rehab's audited $6,105.00; MedPay, Crescent's write-off and the MedPay-paid providers stay at zero.", "Reduce against the fund the litigation built. Peach State's procurement-cost reduction follows the fee actually charged: 40% of $1,860.00 is $744.00, accepted at $1,116.00 on 07/14/2027. Riverton Spine & Rehab accepts $4,275.00 in a signed Payoff Letter dated 07/16/2027.", "Net: $40,000.00 – $16,000.00 – $3,895.25 – $5,391.00 = $14,713.75. Nothing leaves trust until both UM checks have cleared, every Payoff Letter is in Documents and John Doe has signed the Settlement Statement."], "upl": ["You build and explain the arithmetic and the documents. Whether suing was worth it, whether the fee tier was fair and whether John should sign are Atty. Thorne's to discuss with him."]}, "show": {"caption": "Same gross, two nets: what the litigation cost John Doe", "type": "compare", "boxes": [{"head": "TRACK A — settled before suit (10/22/2026)", "items": ["Gross $40,000.00", "Fee 33⅓%: $13,333.33", "Costs: $486.75", "Liens: $1,240.00 + $4,580.00 = $5,820.00", "Net to John Doe: $20,359.92"]}, {"head": "TRACK B — won at arbitration (07/30/2027)", "items": ["Gross $40,000.00", "Fee 40% (suit filed 09/24/2026): $16,000.00", "Costs: $3,895.25", "Liens: $1,116.00 + $4,275.00 = $5,391.00", "Net to John Doe: $14,713.75"]}]}, "ops": [["Award received (07/06/2027)", "Log it and diary each carrier's payment", "CMS → Litigation · CMS → Calendar", "Harbor Point $20,000.00 · Cardinal State $10,000.00"], ["The fund is known", "Send the Reduction Requests for Atty. Thorne's approval", "LSH Net Sheet · CMS → Liens", "Peach State $1,116.00 · Riverton Spine & Rehab $4,275.00"], ["Last UM check cleared", "Complete the Net Sheet and route the Settlement Statement", "LSH Net Sheet · CMS → Tasks → Escalate", "Net $14,713.75, routed before John Doe signs"]], "best": ["Show John the fee tier from his own retainer: 40% once suit was filed.", "Attach a receipt to every litigation cost before it reaches the Net Sheet.", "Reduce liens against the litigated fund at the fee actually charged.", "Pitfall: carrying Track A's 33⅓% fee or its $1,240.00 reduction into the litigated file.", "Pitfall: disbursing Keystone's check, held in trust since 03/29/2027, before the liens are resolved."], "sources": ["D3#21", "D3#23", "D3#24", "D3#25", "D3#27", "Newly authored: the Track B close-out (the 07/06/2027 award and the litigated Net Sheet)"], "rubric": {"ai": [["Fee tier", 15, "The 40% tier applied once suit was filed: $16,000.00"], ["Litigation costs", 15, "Seven receipted items = $3,895.25, each with its source"], ["Lien reductions", 15, "Peach State at the 40% rate to $1,116.00; Riverton Spine & Rehab $4,275.00 with its Payoff Letter"], ["Net", 15, "$14,713.75, reconciled to the trust deposits"]], "trainer": [["Client explanation", 20, "Explains the difference from a pre-suit settlement as plain arithmetic, without opinion"], ["UPL boundary", 20, "Leaves the worth of the lawsuit and the fee's fairness to Atty. Thorne"]]}, "notes": ["Open with the two nets side by side and ask the room what changed. Not the gross: the fee tier, the costs and the lien math.", "Ask: “Peach State's reduction was $620.00 on Track A. Why $744.00 now?” The reduction follows the fee actually charged.", "Stop anyone who reaches for an opinion on whether the lawsuit was worth it. That is Atty. Thorne's conversation with John."]},
        {"kind": "activity", "id": "d5m5-a1", "title": "The Litigation Net Sheet: Disbursing the Award", "topic": "Skill Activity — take the award to $14,713.75 on the LSH Net Sheet", "visual": "The LSH Net Sheet fills the slide in its four navy-headed sections. Section 1 reads Gross $40,000.00 with three carrier chips (Keystone, Harbor Point, Cardinal State); Section 2 shows Attorney Fees at 40% = $16,000.00 with an orange SUIT FILED tag and seven receipt rows totalling $3,895.25; Section 3 lists the providers with Peach State reduced to $1,116.00 and Riverton Spine & Rehab to $4,275.00, the zero-balance rows greyed with NOT PAYABLE chips; Section 4 ends on a large orange NET CLIENT DISBURSEMENT $14,713.75.", "act": {"scenario": "File date 07/22/2027. Laura Whitcomb's 07/06/2027 award gave Harbor Point's $20,000.00 and Cardinal State's $10,000.00; their checks arrived 07/20 and today, joining Keystone's $10,000.00 held in trust since 03/29/2027: $40,000.00. Peach State accepted $1,116.00 (07/14) and Riverton Spine & Rehab $4,275.00 (07/16), both in writing. Every litigation cost is receipted.", "prompt": "Complete John Doe's LSH Net Sheet for the litigated recovery. Section 1: the gross by carrier. Section 2: the 40% fee the retainer sets once suit is filed, and every receipted cost, pre-suit and litigation, on its row. Section 3: every provider and payer with charges, payments, adjustments and balance owed, and each lien's reduced figure with its Payoff Letter. Section 4: the net to John Doe. Tie it to the Trust Ledger and route the Settlement Statement to Atty. Thorne. Graded judgment: what you explain to John about the difference from a pre-suit settlement, and what you leave to Atty. Thorne.", "tool": "LSH Net Sheet · CMS → Financial Ledger → Trust · CMS → Tasks → Escalate", "output": "A Net Sheet reaching $14,713.75, every cost and lien proved, routed to Atty. Thorne before John Doe signs.", "checkpoints": ["Gross: Keystone $10,000.00 (mediation, 03/18/2027) + Harbor Point $20,000.00 + Cardinal State $10,000.00 (award, 07/06/2027) = $40,000.00", "Fee at the 40% tier (suit filed 09/24/2026): $16,000.00, confirmed by Atty. Thorne from the retainer", "Costs receipted: $486.75 pre-suit + $218.00 filing + $285.00 service + $1,200.00 mediation + $900.00 arbitration + $645.50 court reporter + $160.00 certified records = $3,895.25", "Liens: Peach State $1,860.00 → $1,116.00 (40% procurement-cost reduction, $744.00, 07/14/2027); Riverton Spine & Rehab $6,290.00 → audited $6,105.00 → $4,275.00 (Payoff Letter 07/16/2027); total $5,391.00", "Zero-balance lines kept off the payables with their source: MedPay $5,000.00, Crescent's $1,540.00 write-off, the MedPay-paid providers", "Net: $40,000.00 – $16,000.00 – $3,895.25 – $5,391.00 = $14,713.75; the trust deposits of $40,000.00 tie to the gross", "Nothing disbursed until both UM checks clear and John Doe signs the Settlement Statement (07/29/2027); disbursement 07/30/2027", "The difference from a pre-suit settlement explained to John Doe as arithmetic; whether suing was worth it routed to Atty. Thorne"]}, "ops": [["Last UM check received (07/22/2027)", "Post it and complete the Net Sheet", "LSH Net Sheet", "Gross $40,000.00 · net $14,713.75"], ["Liens accepted in writing", "Log the reduced figures and Payoff Letters", "LSH Net Sheet · CMS → Documents", "Peach State $1,116.00 · Riverton Spine & Rehab $4,275.00"], ["Net Sheet ties to trust", "Route the Settlement Statement", "CMS → Tasks → Escalate", "Routed before John Doe signs"]], "best": ["Enter every cost from its receipt, on its row.", "Write each reduction's basis on its line.", "Pitfall: carrying Track A's 33⅓% fee into the litigated file.", "Pitfall: paying a lien from a phone call instead of a Payoff Letter."], "sources": ["D3#21", "D3#25", "D3#27", "D3#28", "Newly authored: the Track B close-out"], "rubric": {"ai": [["Gross and fee", 15, "$40,000.00 by carrier; 40% = $16,000.00"], ["Costs", 15, "$3,895.25 from seven receipted items"], ["Liens", 15, "$1,116.00 and $4,275.00 with their Payoff Letters; zero-balance lines off the payables"], ["Net", 15, "$14,713.75, tied to the trust deposits"]], "trainer": [["Explaining the difference", 20, "Plain arithmetic to John Doe: fee tier, costs, liens"], ["UPL boundary", 20, "No opinion on the lawsuit's worth or the fee; routed to Atty. Thorne"]]}, "notes": ["Have each trainee open the Net Sheet beside the slide and check it at the Track B stage. The trap is the fee: 33⅓% from habit instead of 40%.", "Ask: “John says a friend kept more from his settlement. What do you say?” Only arithmetic, and a route to Atty. Thorne."]},
        {"kind": "check", "id": "d5m5-kc", "title": "Track B Close-Out Check", "topic": "Knowledge Check + Case Manager Self-Summary & Skill Scale", "visual": "Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange; beside it, the two nets stacked as chips, TRACK A $20,359.92 and TRACK B $14,713.75. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, beside the 1–5 SKILL SCALE as a five-step horizontal ladder. Far right, the 60/40 split as a stacked bar, with UPL as a separate red gate chip below it.", "check": {"questions": ["Take the $40,000.00 award to John Doe's $14,713.75: name every deduction with its figure and its source.", "Why is the fee 40% on this file, and which document says so? Who confirms it before the Net Sheet is drafted?", "Peach State accepted $1,240.00 on Track A and $1,116.00 on Track B. Show both reductions and why they differ."], "summary": ["Summarize, in your own words, what you learned closing Track B: the principles behind a litigated Net Sheet, not the clicks.", "Articulate your strategy: the award is in and both UM checks are in trust. What is your next action before the 07/30/2027 disbursement, and why is it the right one rather than something else?", "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."], "scale": ["Applying the retainer's fee tier to a litigated recovery", "Proving litigation costs with receipts", "Reducing liens against a litigated fund", "Explaining a Net Sheet to a client without advice"]}, "best": ["Answer from the file: names, dates and figures, not general rules."], "sources": ["D3#23", "D3#24", "D3#27", "Newly authored: the Track B close-out"], "rubric": {"ai": [["Net Sheet arithmetic", 20, "$40,000.00 → $14,713.75 with every deduction and its source"], ["Fee and lien doctrine", 20, "The 40% tier from the retainer; reductions at the fee actually charged"], ["Completeness", 20, "Every question answered substantively"]], "trainer": [["Strategic articulation", 20, "The stated next action is the right one and the reasoning holds"], ["UPL boundary", 20, "No opinion on the worth of the suit, the fee or the award"]]}, "notes": ["This is the last check of the Case Flow: the file is closed from intake to award.", "Question 5 is the UPL gate: arithmetic yes, opinion no. A trainee who says the lawsuit was or wasn't worth it has crossed the line."]}
      ]
    },

    /* ---------- DAY 5 · MODULE 6 — Dropped Cases (an Operational Focus, taught before the Track B close-out) ---------- */
    {
      n: 6, id: "d5m6",
      title: "Dropped Cases: Withdrawal Letters & Closing the File",
      about: "When Atty. Thorne decides the firm will stop representing a client: the Case Manager's six-step close-out, from the Pending Drop gate to the Withdrawal Letters, their dispatch and proof, and the Dropped status. Worked on a practice matter; John Doe's case is never dropped.",
      quiz: [{"q": "A practice file shows status “Pending Drop”, but no note from Atty. Thorne or the Case Manager says the client has been told. What happens before any Withdrawal Letter goes out?", "opts": ["The client's letter goes by Certified Mail, so it serves as the notice", "Every letter is held until Atty. Thorne confirms, in a note on the file, that the client was told", "The Case Manager calls the client to explain why the firm is dropping the case", "The carrier's and provider's letters go now; the client's waits"], "a": 1, "r": "Two gates come first: the status is Pending Drop AND a note shows the client was told, so the letter is never the client's first news. Telling the client is Atty. Thorne's conversation; nothing goes to any party until both gates are met."}, {"q": "Denise Harlow's three Withdrawal Letters are signed. Which dispatch plan follows the firm's close-out?", "opts": ["Denise by text and email, her preferred methods, plus Certified Mail with return receipt; Granite Shield by email and Brookside Physical Therapy by fax, as the CRM notes say; each dispatch logged, every letter saved in Word and PDF", "Everyone by Certified Mail only, and the status switched to “Dropped” the same day", "Denise by text only; Granite Shield and Brookside by phone, logged afterwards", "Denise by email, with Granite Shield and Brookside copied, so everyone sees the reason"], "a": 0, "r": "The client gets her preferred method plus Certified Mail for proof of receipt; carriers and providers get email or fax as the CRM notes say. The reason stays in the client's letter. The status moves to Dropped only once every letter is sent, logged and followed up."}, {"q": "Denise Harlow calls after her letter arrives: “So my case was worthless?” Which answer stays inside the Case Manager's role?", "opts": ["“Without treatment there was nothing to claim, so yes.”", "“If you find a clinic and restart treatment, the firm may take the case back.”", "“I can't speak to the value of your claim. Atty. Thorne made this decision and will call you to talk it through. Your letter also explains that time limits apply and suggests you speak to another attorney promptly.”", "“The firm thinks your case is too weak, but another lawyer might disagree.”"], "a": 2, "r": "The Case Manager never values the claim, never re-argues or explains the decision and never advises on next steps. She points Denise only to what Atty. Thorne approved: his call back and the letter's direction to seek other counsel promptly, then logs the call and routes it."}],
      blocks: [
        {"kind": "lesson", "id": "d5m6-l1", "brief": true, "title": "Dropped Cases: the Case Manager's Close-Out", "topic": "From “Pending Drop” to “Dropped”: the gate, three Withdrawal Letters, their dispatch and the proof", "visual": "A six-step horizontal process rail on cream, each step a navy card with an orange numbered badge: ① GATE (two ticks: PENDING DROP · CLIENT TOLD) → ② PREPARE (three letter icons: CLIENT · CARRIER · PROVIDER, with WORD + PDF chips) → ③ SEND (CLIENT: TEXT/EMAIL + CERTIFIED MAIL; CARRIER: EMAIL; PROVIDER: FAX) → ④ ANNOTATE & SAVE → ⑤ FOLLOW UP (a return-receipt card) → ⑥ CLOSE (a status pill flipping from PENDING DROP to DROPPED). Above the rail, a slim strip lists the six common reasons, the last, NO HEALTH PLAN, in orange. Below it, a red gate chip: “Atty. Thorne decides. You close out.”", "tell": {"why": "A Dropped Case is a claim the firm stops pursuing before it resolves. Atty. Thorne makes that decision; the Case Manager closes it out, so the client, every carrier and every provider knows the representation has ended, and the file proves it. John Doe's case is never dropped: Day 5's Skip-Trace found the people his file needed. This phase covers the cases that end another way.", "rules": ["Common reasons: the client becomes unresponsive or withdraws; liability can't be established; coverage is denied or the limits are insufficient; the client can't complete treatment, for example with no Health Plan to pay for care; fraudulent or conflicting information comes to light. Whether any of them ends a case is Atty. Thorne's decision.", "An unresponsive client reaches this point only through the No Contact Protocol taught in Client Communications: its Final Warning Letter, then Atty. Thorne's choice of a Notice of Withdrawal or, in a filed suit, a Motion to Withdraw (confirm the court's rule). This phase starts where that one ends.", "Step 1, the gate: the status reads “Pending Drop” AND a note from Atty. Thorne or the Case Manager shows the client was told. Missing either, nothing goes out: the letter must never be the client's first news.", "Step 2, prepare: a Withdrawal Letter for the client and for every carrier and provider on the file, from the firm's template, over Atty. Thorne's signature, each with the date, client name, date of loss and claim number, saved in Word and PDF. Only the client's carries the reason, in his words, and the next step he approves: seek other counsel promptly.", "Step 3, send: the client by her preferred method (email, text or both; the active email, a subject such as “Notice of Withdrawal of Representation”, the PDF attached and a brief description) plus Certified Mail with return receipt to a confirmed current address. Carriers and providers by email or fax, as the CRM notes say.", "Step 4, annotate and save: each dispatch logged with party, method and date, and every sent letter saved to the client's file.", "Step 5, follow up: the return receipt, the carrier's acknowledgement, the fax confirmation. A time-sensitive party gets a call.", "Step 6, close: once every party has its letter and the receipts are followed up, switch the status to “Dropped” (or the firm's equivalent) and retain the proof: the letters, receipts, logs and Atty. Thorne's note."], "upl": ["You may prepare, send, log and follow up every Withdrawal Letter. You may not decide or announce a drop, tell the client the case is worthless or weak, advise on deadlines or next steps, or point the client anywhere Atty. Thorne hasn't approved."]}, "show": {"caption": "The close-out: six steps, in order", "type": "process", "steps": [["1 · Gate", "Status “Pending Drop” and a note that the client was told"], ["2 · Prepare", "Client, carrier and provider letters; Word and PDF"], ["3 · Send", "Client: preferred method plus Certified Mail; carriers and providers: email or fax per the CRM"], ["4 · Annotate", "Party, method and date logged; each sent letter in the file"], ["5 · Follow up", "Return receipt, acknowledgement, fax confirmation"], ["6 · Close", "Status “Dropped”; proof retained"]]}, "ops": [["Status “Pending Drop”, with Atty. Thorne's note that the client was told", "Prepare each party's Withdrawal Letter for his signature", "Action Plan Editor → Withdrawal Letter template", "Client, carrier and provider letters, each saved in Word and PDF"], ["Letters signed", "Send each by its method and log the dispatch", "Email Workspace · CMS → Communications Log", "Party, method and date logged for every letter"], ["Receipts followed up", "Switch the status and file the proof", "CMS → Case Status · CMS → Documents", "Status “Dropped”; receipts, logs and the attorney's note filed"]], "best": ["Check the gate before you open the template: no note, no letter.", "Send the client's letter two ways: her preferred method, and Certified Mail for proof.", "Read the CRM notes for each carrier's and provider's preferred method.", "Pitfall: putting the reason for the drop in a carrier's or provider's letter.", "Pitfall: switching to “Dropped” before every letter is sent and logged.", "Pitfall: telling the client the case is worthless, or what to do next."], "sources": ["LSH Claims Specialist: Dropped Cases — definition, common reasons, the Pending Drop check, Withdrawal Letters to clients, carriers and medical providers, annotating and saving them, and switching the status to Dropped", "LSH Claims Specialist: No Contact Protocol — the decision point (Notice of Withdrawal or Motion to Withdraw) and file closure", "Newly authored: no health insurance as a drop reason; the reason kept to the client's letter; the six-step close-out in order"], "rubric": {"ai": [["Close-out sequence", 20, "The six steps in order, from the Pending Drop gate to the Dropped status"], ["Letter contents", 15, "Date, client, date of loss and claim number on every letter; reason and next step only in the client's"], ["Send methods", 15, "Client by preferred method plus Certified Mail; carriers and providers by email or fax per the CRM"], ["Proof", 10, "Word and PDF saved, each dispatch logged, receipts followed up, proof retained"]], "trainer": [["Judgment", 20, "Holds the letters when the gate isn't met; keeps the reason out of third-party letters"], ["UPL boundary", 20, "Leaves the decision and its explanation to Atty. Thorne; no opinion on the claim's worth or the client's next steps"]]}, "notes": ["Start with why this phase exists: John Doe's case is never dropped, but a new Case Manager closes a dropped file early on. Ask the room for the common reasons, then add the one the activity uses: a client with no Health Plan who cannot continue care.", "Ask: “The status says Pending Drop. Can the letters go?” Not until a note shows the client was told.", "Ask which letter carries the reason. Only the client's: a carrier or a provider learns only that the firm no longer represents her.", "UPL gate: the drop is Atty. Thorne's decision and his explanation. A trainee who would tell a client the case is worthless, or suggest restarting treatment to save it, has crossed the line."]},
        {"kind": "activity", "id": "d5m6-a1", "title": "Closing a Dropped Case: Withdrawal Letters & the Close-Out Log", "topic": "Skill Activity — a practice matter: three Withdrawal Letters, their dispatch and the Dropped status", "visual": "A PRACTICE MATTER banner in orange across the top: DENISE CARVER · LSH-2026-MVA-781205 · NOT JOHN DOE'S FILE. Left half, three stacked letter cards, each with a navy header (CLIENT · GRANITE SHIELD · BROOKSIDE PT) and a method chip (TEXT + EMAIL + CERTIFIED MAIL · EMAIL · FAX); only the client card carries an orange REASON line. Right half, the close-out log as a checklist: gate ✓ 12/08/2026, letters saved WORD + PDF, dispatch 12/09/2026, follow-up 12/16/2026, and a status pill turning from PENDING DROP to DROPPED. Bottom-right, a red chip: “Worthless? Not yours to say.”", "act": {"scenario": "A practice matter, not John Doe's file: do not open or create it in the CMS. File date 12/09/2026. Denise Harlow (LSH-2026-MVA-781205) was rear-ended at a red light on 09/19/2026. Granite Shield Insurance holds the BI claim, GS-26-48213 (adjuster Paul Ostrander; CRM note: email only). She treated at Brookside Physical Therapy (CRM note: fax only) from 09/24 to 10/29/2026, then stopped: she has no Health Plan to pay for care, and Brookside declined a Letter of Protection. Atty. Thorne has decided to drop the case. Status: Pending Drop. His note, 12/08/2026, 2:10 p.m.: called Denise, told her the firm will close its representation; she understood; address 87 Alder Creek Dr, Riverton confirmed; she prefers text and email (denise.harlow@mail.example). RS05 shows the firm's standard retainer, with the withdrawal terms every client signs.", "prompt": "Close out the drop in the Action Plan Editor. Record the gate you checked. Draft three Withdrawal Letters for Atty. Thorne's signature: to Denise (date, name, date of loss, the reason in his note's words, and the next step he approves: speak to another attorney promptly, because time limits apply), and one each to Granite Shield and to Brookside (date, client, date of loss, claim number, that the firm no longer represents her; nothing about why). Name each send method and why. Then write the close-out log: Word and PDF saved, each dispatch annotated, the follow-up, the switch to Dropped and the proof retained. Graded judgment: what you say if Denise calls to ask whether her case was worthless.", "tool": "Action Plan Editor → Withdrawal Letter template", "output": "Three Withdrawal Letters ready for Atty. Thorne's signature, a send method for each, and a close-out log from Pending Drop to Dropped.", "checkpoints": ["Gate recorded: status “Pending Drop” and Atty. Thorne's 12/08/2026 note that Denise Harlow was told; nothing prepared to send before both were confirmed", "Client letter: 12/09/2026, Denise Harlow, date of loss 09/19/2026, the reason in Atty. Thorne's words (treatment ended 10/29/2026, so the firm cannot continue the claim), the approved next step (speak to another attorney promptly; time limits apply), signed by Atty. Thorne", "Granite Shield letter: client, claim GS-26-48213, date of loss 09/19/2026, the firm no longer represents her; Brookside letter: patient, date of loss, the firm no longer represents her, please update your records; neither gives the reason", "Every letter saved in Word and PDF", "Methods: Denise by text and email (subject “Notice of Withdrawal of Representation”, PDF attached, a brief description) plus Certified Mail with return receipt to 87 Alder Creek Dr; Granite Shield by email and Brookside by fax, per the CRM notes", "Each dispatch annotated with party, method and date (12/09/2026); each sent letter saved to the file", "Follow-up on 12/16/2026: the return receipt, Granite Shield's acknowledgement and Brookside's fax confirmation", "Status switched to “Dropped” only after all three letters are sent, logged and followed up; proof retained: letters, receipts, logs and Atty. Thorne's note", "If Denise asks whether her case was worthless: no view on its value or on restarting treatment; Atty. Thorne made the decision and will call her; the call logged and routed"]}, "ops": [["Pending Drop with Atty. Thorne's 12/08/2026 note", "Confirm the gate; draft the three letters", "Action Plan Editor → Withdrawal Letter template", "Client, Granite Shield and Brookside letters, Word and PDF"], ["Letters signed, 12/09/2026", "Send each by its method and annotate it", "Action Plan Editor → close-out log", "Text, email and Certified Mail; email; fax"], ["Follow-up, 12/16/2026", "Confirm receipt, then switch the status", "Action Plan Editor → close-out log", "Dropped; proof retained"]], "best": ["Quote Atty. Thorne's reason; never write your own.", "Confirm the mailing address before Certified Mail goes out.", "Pitfall: a carrier letter that says she stopped treating.", "Pitfall: offering Denise a way to “save” the case."], "sources": ["LSH Claims Specialist: Dropped Cases — sending Withdrawal Letters to clients, carriers and medical providers; the sample letters by email, by text, to a carrier and to a provider", "Newly authored: the Denise Harlow practice matter (no health insurance, treatment ended, Pending Drop)"], "rubric": {"ai": [["Gate", 10, "Pending Drop and the 12/08/2026 note both confirmed before anything is prepared to send"], ["Client letter", 15, "12/09/2026, Denise Harlow, 09/19/2026, the reason in Atty. Thorne's words, the approved next step, his signature"], ["Carrier and provider letters", 15, "GS-26-48213 and the date of loss on each; no reason given; “please update your records” to Brookside"], ["Methods and close-out log", 20, "Text, email and Certified Mail; email; fax; Word and PDF; dispatch logged; follow-up 12/16/2026; Dropped with proof"]], "trainer": [["Judgment", 20, "Keeps the reason to the client's letter and the status change behind the follow-up"], ["UPL boundary", 20, "No view on the claim's worth or on restarting treatment; Denise routed to Atty. Thorne"]]}, "notes": ["Say it before anyone starts: this is a practice matter. John Doe's case is never dropped, and nothing here goes into his file or the CMS.", "Read three carrier letters aloud. Any that mentions treatment, insurance or the reason goes back: Granite Shield learns only that the firm no longer represents Denise.", "Ask: “Denise calls and asks if her case was worthless. What do you say?” Only Atty. Thorne's decision, his call back and the letter's direction to seek other counsel."]},
        {"kind": "check", "id": "d5m6-kc", "title": "Dropped Case Close-Out Check", "topic": "Knowledge Check + Case Manager Self-Summary & Skill Scale", "visual": "The standard knowledge-check split. Upper half: the cream question panel with orange numbered badges, beside a status pill rail PENDING DROP → DROPPED with six small step ticks. Lower half, below the orange hairline: the navy CM SELF-SUMMARY card with three prompts beside the 1–5 SKILL SCALE ladder. Far right, the 60/40 stacked bar with UPL as a separate red gate chip below it.", "check": {"questions": ["Name the two things you confirm before any Withdrawal Letter goes out, and why both matter.", "What goes in Denise Harlow's letter that does not go in Granite Shield's or Brookside's, and why?", "Denise's three letters went out 12/09/2026. What must be true before her status becomes “Dropped”, and what proof stays in the file?"], "summary": ["Summarize, in your own words, what you learned closing a Dropped Case: the principles behind the close-out, not the clicks.", "Articulate your strategy: Denise's letters are out and her return receipt hasn't come back by 12/16/2026. What is your next action, and why is it the right one rather than something else?", "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."], "scale": ["Confirming the Pending Drop gate before anything goes out", "Drafting a Withdrawal Letter for each party", "Choosing and logging each send method", "Closing the file with proof, without advice"]}, "best": ["Answer from the practice matter: names, dates and methods, not general rules."], "sources": ["LSH Claims Specialist: Dropped Cases — Withdrawal Letters and closing the file", "Newly authored: the Denise Harlow practice matter"], "rubric": {"ai": [["Close-out sequence", 20, "Gate, letters, methods, log, follow-up and status in order"], ["Letter contents and methods", 20, "The reason only in the client's letter; each party's method correct"], ["Completeness", 20, "Every question answered substantively"]], "trainer": [["Strategic articulation", 20, "The stated next action is the right one and the reasoning holds"], ["UPL boundary", 20, "No view on the claim's worth; the decision left with Atty. Thorne"]]}, "notes": ["Answers come from the practice matter: Denise Harlow, 12/08 and 12/09/2026, Granite Shield by email, Brookside by fax.", "The UPL gate: a trainee who explains the drop to Denise, or tells her what to do next, has crossed the line, whatever the rest of the answer."]}
      ]
    }

    ]
  }

  ],

  /* The order the course teaches the blocks in, day by day. Each day is ONE module of the five (Intake & Property Damage, Claim Set Up, the Treatment Phase, Pre-Demand Audit & the Demand, Closing & Settlement), all on John Doe's
     one file, and every module runs the same lifecycle: Lectures (its lessons, uninterrupted) → Practice (its Skill
     Activities, in the order the work happens on the file) → Knowledge Check. Day 1 opens with the Case Manager's
     introduction, then the client (Meet Your Case), then the lessons proper; Days 2–5 go straight into lessons
     anchored on where the file stands. Claim Set Up runs CMS case file setup → draft the LORs and notices →
     transmit and log them → receive the carriers' claim correspondence. The advanced theory (the Payer-First
     Principle, Health Subrogation, the Payer Order and the Regulatory Triple-Check) is taught in the Treatment
     Phase, where the bills and the liens arrive, not at set-up.
     The modules above stay the units of scoring (each Knowledge Check, its quiz share, the Self-Summary and the
     trainer's 40%); the sequence only sets where each block is taught. Every block appears exactly once.
     A day's phase is its module: `title` its name, `lead` "Module N". `headings` names each block's part of
     the module on its slide (Intake, Property Damage, Practice: …). A lesson marked `brief` is a condensed
     overview (Day 5's litigation): fewer slides and a few minutes of discussion, so the day keeps to four
     hours. A block marked `compact` keeps its full discussion time on fewer slides (no second Theory slide, no
     Framework, See It or Do & Don't), so Days 2, 4 and 5 keep to the slide budget curriculum.cjs checks. `lanes`
     gives a block its own workstream on a day that runs both. `workstream` ("claims" or "care") is the module's lane on the case timeline. */
  sequence: [
    {n: 1, phases: [
      {title: "Intake, Claims & Property Damage", lead: "Module 1", blocks: ["d1m1-role", "d1m1-case", "d1m1-upl", "d1m1-l1", "d1m4-l1", "d1m3-l1", "d1m3-l2", "d1m1-open", "d1m3-a1", "d1m3-a2", "d1m1-kc", "d1m3-kc"],
       headings: {"d1m1-role": "Introduction to Case Management", "d1m1-case": "Meet Your Client: John Doe", "d1m1-upl": "The UPL Line: Fact Sharing vs. Legal Advice", "d1m1-l1": "Intake", "d1m4-l1": "Intake & the Claims", "d1m3-l1": "Property Damage", "d1m3-l2": "Property Damage", "d1m1-open": "Skill Building: Opening the File in the CMS", "d1m3-a1": "Skill Building: Property Damage", "d1m3-a2": "Skill Building: Property Damage"}}
    ]},
    {n: 2, phases: [
      {title: "Claim Set Up & Treatment", lead: "Module 2", lanes: {"d2m1-l1": "claims", "d2m1-l2": "claims", "d1m4-l2": "claims", "d1m1-a1": "claims", "d2m1-a1": "claims", "d2m1-a2": "claims", "d1m4-a1": "claims", "d1m4-a2": "claims", "d2m1-kc": "claims", "d1m4-kc": "claims", "d2m1-cov": "care", "d2m2-l1": "care", "d2m2-eob": "care", "d2m2-lop": "care", "d1m1-l2": "care", "d2m2-l2": "care", "d1m2-l1": "care", "d1m2-l2": "care", "d1m2-a1": "care", "d1m2-a2": "care", "d2m2-a1": "care", "d1m1-a2": "care", "d2m2-a2": "care", "d2m2-a3": "care", "d2m2-kc": "care", "d1m2-kc": "care"}, blocks: ["d2m1-l1", "d2m1-l2", "d1m4-l2", "d2m1-cov", "d2m2-l1", "d2m2-eob", "d2m2-lop", "d1m1-l2", "d2m2-l2", "d1m2-l1", "d1m2-l2", "d1m1-a1", "d2m1-a1", "d2m1-a2", "d1m4-a1", "d1m4-a2", "d1m2-a1", "d1m2-a2", "d2m2-a1", "d1m1-a2", "d2m2-a2", "d2m2-a3", "d2m1-kc", "d1m4-kc", "d2m2-kc", "d1m2-kc"],
       headings: {"d2m1-l1": "Claim Set Up", "d2m1-l2": "Claim Set Up", "d1m4-l2": "Claim Set Up: Case Strategy", "d2m1-cov": "Treatment: Who Pays the Bills", "d2m2-l1": "Treatment: Who Pays the Bills", "d2m2-eob": "Treatment: Who Pays the Bills", "d2m2-lop": "Treatment: Who Pays the Bills", "d1m1-l2": "Treatment: Liens & the Regulatory Triple-Check", "d2m2-l2": "Treatment: Monitoring the Care", "d1m2-l1": "Treatment: Client Communications", "d1m2-l2": "Treatment: Client Communications", "d1m1-a1": "Skill Building: CMS Case File Setup", "d2m1-a1": "Skill Building: Draft, Transmit & Log the LORs", "d2m1-a2": "Skill Building: Receive Carrier Claim Correspondence", "d1m4-a1": "Skill Building: Case Strategy", "d1m4-a2": "Skill Building: Case Strategy", "d1m2-a1": "Skill Building: Client Communications", "d1m2-a2": "Skill Building: Client Communications", "d2m2-a1": "Skill Building: Treatment", "d1m1-a2": "Skill Building: Liens", "d2m2-a2": "Skill Building: Treatment", "d2m2-a3": "Skill Building: Treatment"}}
    ]},
    {n: 3, phases: [
      {title: "Pre-Demand Audit, the Demand & Settlement Negotiation", lead: "Module 3", lanes: {"d2m3-l1": "care", "d2m3-l2": "care", "d2m3-a1": "care", "d2m3-a2": "care", "d2m3-kc": "care"}, blocks: ["d2m3-l1", "d2m3-l2", "d2m4-l1", "d2m4-l2", "d3m1-l1", "d3m1-l2", "d3m2-l1", "d3m2-l2", "d2m3-a1", "d2m3-a2", "d2m4-a1", "d2m4-a2", "d3m1-a1", "d3m1-a2", "d3m2-a1", "d3m2-a2", "d2m3-kc", "d2m4-kc", "d3m1-kc", "d3m2-kc"],
       headings: {"d2m3-l1": "Pre-Demand: the Gap Explanation Record", "d2m3-l2": "Pre-Demand: the Gap Explanation Record", "d2m3-a1": "Skill Building: the Gap Explanation Record", "d2m3-a2": "Skill Building: the Gap Explanation Record", "d2m4-l1": "Pre-Demand Case Auditing", "d2m4-l2": "Pre-Demand Case Auditing", "d3m1-l1": "Demand", "d3m1-l2": "Demand", "d2m4-a1": "Skill Building: Pre-Demand Case Auditing", "d2m4-a2": "Skill Building: Pre-Demand Case Auditing", "d3m1-a1": "Skill Building: Demand", "d3m1-a2": "Skill Building: Demand", "d3m2-l1": "Settlement Negotiations", "d3m2-l2": "Settlement Negotiations", "d3m2-a1": "Skill Building: Settlement Negotiations", "d3m2-a2": "Skill Building: Settlement Negotiations"}}
    ]},
    {n: 4, phases: [
      {title: "Reductions, Lien Negotiation & ADR", lead: "Module 4", blocks: ["d3m3-l1", "d3m3-l2", "d3m4-l1", "d3m4-l2", "d4m2-l1", "d4m2-l2", "d4m3-l1", "d4m3-l2", "d3m3-a1", "d3m3-a2", "d3m4-a1", "d3m4-a2", "d4m2-a1", "d4m2-a2", "d4m3-a1", "d4m3-a2", "d3m3-kc", "d3m4-kc", "d4m2-kc", "d4m3-kc"],
       headings: {"d3m3-l1": "Lien Negotiations & Reduction", "d3m3-l2": "Lien Negotiations & Reduction", "d3m4-l1": "Disbursement & Closing a Case", "d3m4-l2": "Disbursement & Closing a Case", "d4m2-l1": "ADR: Mediation & Arbitration", "d4m2-l2": "ADR: Mediation & Arbitration", "d4m3-l1": "ADR: The Binders", "d4m3-l2": "ADR: The Binders", "d3m3-a1": "Skill Building: Lien Negotiations", "d3m3-a2": "Skill Building: Lien Negotiations", "d3m4-a1": "Skill Building: Disbursement & Closing", "d3m4-a2": "Skill Building: Disbursement & Closing", "d4m2-a1": "Skill Building: ADR", "d4m2-a2": "Skill Building: ADR", "d4m3-a1": "Skill Building: ADR", "d4m3-a2": "Skill Building: ADR"}}
    ]},
    {n: 5, phases: [
      {title: "Litigation & Dropped Cases", lead: "Module 5", blocks: ["d4m1-l1", "d4m1-l2", "d4m4-l1", "d4m4-l2", "d5m1-l1", "d5m1-l2", "d5m2-l1", "d5m2-l2", "d5m3-l1", "d5m3-l2", "d5m4-l1", "d5m4-l2", "d5m5-l1", "d5m6-l1", "d4m1-a1", "d4m1-a2", "d4m4-a1", "d4m4-a2", "d5m1-a1", "d5m1-a2", "d5m2-a1", "d5m2-a2", "d5m3-a1", "d5m3-a2", "d5m4-a1", "d5m4-a2", "d5m5-a1", "d5m6-a1", "d4m1-kc", "d4m4-kc", "d5m1-kc", "d5m2-kc", "d5m3-kc", "d5m4-kc", "d5m5-kc", "d5m6-kc"],
       headings: {"d4m1-l1": "Litigation", "d4m1-l2": "Litigation", "d4m4-l1": "Litigation", "d4m4-l2": "Litigation", "d5m1-l1": "Litigation", "d5m1-l2": "Litigation", "d5m2-l1": "Litigation", "d5m2-l2": "Litigation", "d5m3-l1": "Litigation", "d5m3-l2": "Litigation", "d5m4-l1": "Litigation", "d5m4-l2": "Litigation", "d5m5-l1": "Case Won: Award & Disbursement", "d5m6-l1": "Dropped Cases & Withdrawal Letters", "d4m1-a1": "Skill Building: Litigation", "d4m1-a2": "Skill Building: Litigation", "d4m4-a1": "Skill Building: Litigation", "d4m4-a2": "Skill Building: Litigation", "d5m1-a1": "Skill Building: Litigation", "d5m1-a2": "Skill Building: Litigation", "d5m2-a1": "Skill Building: Litigation", "d5m2-a2": "Skill Building: Litigation", "d5m3-a1": "Skill Building: Litigation", "d5m3-a2": "Skill Building: Litigation", "d5m4-a1": "Skill Building: Litigation", "d5m4-a2": "Skill Building: Litigation", "d5m5-a1": "Skill Building: Case Won", "d5m6-a1": "Skill Building: Dropped Cases"}}
    ]}
  ]
};
