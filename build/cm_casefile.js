/* The client profile (the Case File, and the case dossier inside every AI prompt): John Doe v. Robert Smith, from
   js/cm-case-flow-data.js (CM_CASE_FLOW.case and .profile). */
const CLIENT_PROFILE_DOC = [
  {section:"Case Snapshot", items:[
    "Case: John Doe v. Robert Smith · LSH file LSH-2026-MVA-770412 · MVA — passenger injury",
    "Client: John Doe · DOB 08/14/1991 · 2214 Maple Hollow Rd, Riverton · (555) 010-2288 · john.doe@example.com",
    "Client position: Front-seat passenger in the host vehicle",
    "Date of loss: 02/06/2026 · Statute of Limitations docketed 02/06/2028 (Docketed on a two-year limitation for this training file. Confirm the governing state's statute before relying on it.)",
    "Lead Counsel: Atty. Elijah Thorne · file source: On the Records",
    "Critical fact: Initial 14-Day Treatment Gap, then disrupted care mid-treatment."
  ]},
  {section:"Parties", items:[
    "Client / Plaintiff: John Doe. Front-seat passenger, not a driver. This is what opens two UM layers.",
    "Defendant / Tortfeasor: Robert Smith. At-fault driver. His liability carrier pays first.",
    "Lead Counsel: Atty. Elijah Thorne. Approves all strategy, demands and filings.",
    "Case Manager: the trainee. Owns the file's day-to-day movement.",
    "Host driver: operator of the vehicle John Doe occupied. Source of the $20,000 Host UM layer.",
    "Resident relative: John Doe's household relative. Source of the $10,000 Relative UM layer."
  ]},
  {section:"Coverage: the Recovery Stack and the Health Plan", items:[
    "1. BI: Bodily Injury — Robert Smith's liability · Keystone Mutual Insurance · claim KM-26-440871 · adjuster Dana Whitfield · $10,000 (Primary. Pays first. Tendered against liability.)",
    "2. HOST UM: Underinsured Motorist — host vehicle policy · Harbor Point Insurance · claim HP-26-7741 · adjuster Marcus Bell · $20,000 (Secondary. Opens once BI is exhausted or tendered.)",
    "3. REL UM: Underinsured Motorist — resident relative policy · Cardinal State Mutual · claim CS-26-20355 · adjuster Not yet assigned · $10,000 (Tertiary. Stacks behind Host UM.)",
    "Recovery Stack total: $40,000",
    "Health Plan: Peach State Health Plan · member PSH-55017742 · group GRP-41208 · Reimbursement right asserted on first notice"
  ]},
  {section:"The Recovery Stack: $40,000", items:[
    "1 · BI, Robert Smith's liability: Keystone Mutual Insurance · claim KM-26-440871 · adjuster Dana Whitfield · $10,000",
    "2 · Host UM, the host vehicle's policy: Harbor Point Insurance · claim HP-26-7741 · adjuster Marcus Bell · $20,000",
    "3 · Relative UM, the resident relative's policy: Cardinal State Mutual · claim CS-26-20355 · adjuster not yet assigned at set-up · $10,000",
    "Order of operations: BI → Host UM → Relative UM. Host UM opens only once BI is exhausted (paid or tendered at limits); Relative UM stacks behind Host UM.",
    "A UM demand before the BI tender is premature. Settling or releasing BI without the UM carriers' written consent can forfeit the stack."
  ]},
  {section:"Health Plan and Payer Order", items:[
    "Peach State Health Plan · member PSH-55017742 · group GRP-41208 · reimbursement right asserted on first notice",
    "Payer Order (who pays the Medical Bills while the claim is open) is a different question from the stack: PIP/MedPay → private health insurance → LOP/provider liens"
  ]},
  {section:"People and Vehicles", items:[
    "Host driver: Kevin Alvarez, John's coworker (separate household); they carpool on alternate weeks and 02/06/2026 was Kevin's week. He owns the host vehicle, a 2020 Ford Escape, insured by Harbor Point (Host UM $20,000; MedPay $5,000).",
    "Resident relative: Margaret Doe, John's mother; John lives with her at 2214 Maple Hollow Rd. Her car is insured by Cardinal State Mutual (UM $10,000). Emergency contact on the file."
  ]},
  {section:"The Vehicles and Who Insures Them", items:[
    "The parked car: Margaret's 2019 Honda Civic LX, 52,300 miles, owned outright, insured by Bluewater Auto Insurance on her policy (liability + collision, $500 deductible); UM/UIM rejected in writing by Margaret (03/14/2024). John owns no car and has no auto policy.",
    "Why passenger status matters: as a passenger in a car he doesn't own, John reaches Host UM and Relative UM. He owns no car, so no policy of his own applies, and Margaret's Bluewater policy on the Civic carries no UM (rejected), so it adds no layer.",
    "Defendant: Robert Smith, driving a 2017 Chevrolet Silverado · Keystone Mutual BI $10,000 per person; PD liability $25,000 (separate, outside the $40,000 stack) · address on the Police Report: 118 Larkspur Ln, Riverton",
    "Employer: Northgate Distribution · warehouse shift lead since 01/12/2026 · $22.00/hour, 8-hour shifts · Peach State coverage through Northgate, effective 02/01/2026"
  ]},
  {section:"The Collision: 02/06/2026, about 7:10 a.m.", items:[
    "All-way stop at Maple Hollow Rd & Birch Ave. Kevin stopped eastbound and proceeded; Robert Smith, northbound on Birch Ave, didn't stop and struck the Escape's front passenger door at about 28 mph, pushing it into Margaret's parked Civic.",
    "Riverton PD report RPD-26-018842: Smith cited for failure to stop at a stop sign",
    "Independent witness: Ruth Calloway, 2209 Maple Hollow Rd",
    "Doorbell-camera video (Margaret's camera at 2214 Maple Hollow Rd) shows the Escape stopped and Smith rolling through · preservation told to John 02/17, copy secured 02/19/2026",
    "Riverton Fire EMS run report: \"restrained front-seat passenger, complains of neck stiffness, declined transport\""
  ]},
  {section:"Injury and Treatment", items:[
    "Injury: cervical strain; C5-C6 right paracentral disc herniation with mild right foraminal narrowing · prior: three chiropractic visits in 2021 for low-back stiffness, resolved; no prior neck complaints",
    "02/20/2026 Riverton Urgent Care: first treatment, \"onset at MVA 02/06/2026, progressively worsening; numbness to right hand since 02/18\" · $685.00 (MedPay)"
  ]},
  {section:"The Treatment Record", items:[
    "02/24–04/02/2026 Riverton Spine & Rehab (chiro + PT, out of network for Peach State): 16 visits under an LOP signed 02/23/2026",
    "03/05/2026 Lakeside Orthopedics, Dr. Alana Reyes: initial consult, orders MRI · $640.00 (MedPay)",
    "03/13/2026 Summit Imaging Center, cervical MRI (Dr. Helen Park): C5-C6 herniation, \"no significant degenerative change at the adjacent levels\" · $2,395.00 (MedPay)",
    "03/27/2026 Lakeside Orthopedics follow-up, referral to pain management · $640.00 (MedPay)",
    "04/02 → 04/21/2026: disrupted care, 19 days with no visits (missed 04/03, 04/07, 04/09, 04/14)",
    "04/21–06/05/2026 Riverton Spine & Rehab: 17 visits, care resumed (LOP)",
    "05/15/2026 Crescent Pain & Spine, Dr. Omar Haddad: cervical epidural steroid injection · billed $3,400.00, Peach State paid $1,860.00 at contract rate (no balance billing)",
    "06/12/2026 Lakeside Orthopedics: MMI · residual intermittent right-arm paresthesia · possible 1–2 repeat ESIs within 24 months ($3,400–$6,800 future medical) · $640.00 (MedPay, now exhausted)",
    "02/07–06/2026 Riverton Drug: prescriptions and OTC · $312.40, John out of pocket"
  ]},
  {section:"Coverage Confirmations", items:[
    "Harbor Point (03/02/2026, in writing): no reimbursement right on MedPay; its UM is add-on (excess), not reduced by the BI payment, with no MedPay non-duplication reduction",
    "Cardinal State: Teresa Okafor assigned as adjuster 03/03/2026; John confirmed in writing (03/09/2026) as a resident relative occupying a non-owned vehicle",
    "Keystone disclosed nothing before a written request with authorizations; BI $10,000 confirmed by its Declaration Page 03/20/2026"
  ]},
  {section:"The Disruption", items:[
    "Keystone ended Margaret's rental 03/19/2026 (30-day cap) while the Civic waited for parts; Kevin's shift changed 04/01/2026, ending the carpool.",
    "John missed PT visits from 04/03; the CM learned of it 04/08/2026 from Riverton Spine & Rehab's missed-visit alert."
  ]},
  {section:"Property Damage: Margaret's Civic", items:[
    "A separate claim with Keystone PD (adjuster Leah Moran), outside the $40,000 stack · PD liability accepted 02/17/2026",
    "Tow $185.00 + 6 days' storage at $45.00 = $455.00 (Keystone paid)",
    "Estimate $6,940.00 (Riverton Collision Center, 02/16) + teardown supplement $2,315.00 (03/02) = $9,255.00 repair, paid to the shop 04/24/2026 · ACV $17,600.00, so repair is 52.6% of ACV: repairable, not a Total Loss",
    "Rental 02/18–03/19/2026 at $42.00/day, 30-day cap = $1,260.00 paid; extension refused (\"shop delay\")",
    "Disputed: Loss of Use for 48 days without a car or a paid rental (02/06–02/17 and 03/20–04/24) × $42.00 = $2,016.00; Keystone offers $0",
    "Disputed: Diminished Value · independent appraisal $3,600.00 (05/06/2026) vs Keystone's \"17c\" offer $792.00"
  ]},
  {section:"Retainer and Costs", items:[
    "Contingency fee: 33⅓% pre-suit; 40% once suit is filed"
  ]},
  {section:"Treatment & Pre-Demand: Specials and the A-C-T Response", items:[
    "Riverton Spine & Rehab billed 34 lines × $185.00 = $6,290.00, but 05/04/2026 is a duplicate: 33 visits = $6,105.00 after audit",
    "MedPay paid in date order $685.00 + $640.00 + $2,395.00 + $640.00 + $640.00 = $5,000.00 (exhausted 06/2026)",
    "Medical specials: $15,002.40 billed → $14,817.40 after the audit · lost wages: 9 shifts × 8 h × $22.00 = $1,584.00 (Northgate HR letter) · total Specials $16,401.40",
    "A-C-T: Assess, called John 04/08 · Coordinate, asked Keystone PD to extend the rental (refused 04/10), then moved John to evening slots so Margaret could drive him (first open slot 04/21) · Track, attendance confirmed 04/21 and 04/23 · the Civic came back 04/24"
  ]},
  {section:"Why the 14-Day Gap Happened", items:[
    "No transportation: the Civic was towed from the scene, Kevin's Escape was in the shop, and no rental was authorized until 02/18/2026",
    "He thought it was soreness that would pass; took OTC ibuprofen and lidocaine patches (receipt 02/07/2026)",
    "Cost worry: unsure his new Peach State coverage (effective 02/01/2026) was active; didn't know MedPay existed",
    "Symptoms escalated: numbness into his right hand from 02/18; he worked 02/18–02/19 and went to urgent care on his first day off, 02/20/2026",
    "Corroboration: EMS report (neck complaint on the DOL) · Northgate attendance (called out 02/09–02/13 citing neck pain) · texts to his mother 02/07–02/15 · the pharmacy receipt · the urgent-care history · Dr. Reyes's Causation Letter (06/19/2026)"
  ]},
  {section:"The BI Demand and the Fork", items:[
    "07/20/2026 time-limited BI demand to Keystone for the $10,000 limits, by certified mail and email · received 07/22 · 30-day window → 08/21/2026",
    "Conditions: payment of limits, a Limited Release of Robert Smith and Keystone only, and Smith's affidavit of no other insurance",
    "08/05/2026 Keystone offers $3,500, citing the gap and calling the MRI degenerative · 08/06 rebuttal (Atty. Thorne approved): the radiologist's finding, the Causation Letter, the EMS report, the Gap Explanation Record",
    "This is the fork. Track A (Case Flow Day 4): the file settles. Track B (Day 4's ADR, then Day 5's litigation): Keystone stonewalls and the case goes to suit."
  ]},
  {section:"Track A: The File Settles", items:[
    "08/12/2026 Keystone tenders $10,000 · UM consents 08/24 (Harbor Point) and 08/26 (Cardinal State) · Keystone's General Release (08/14) revised to a Limited Release, signed 08/28 · check into IOLTA 09/04",
    "08/31 Host UM and Relative UM demands · Harbor Point offers $8,000 (09/14), pays $20,000 limits 09/29 · Cardinal State offers $6,000 (10/01), tenders $10,000 limits 10/06",
    "Gross recovery $40,000.00",
    "Liens: Peach State (fully insured plan) $1,860.00 → $1,240.00 (10/09) · Riverton Spine & Rehab $6,290.00 billed → $6,105.00 audited → $4,580.00 (10/12)",
    "Net sheet: fee $13,333.33 · costs $486.75 · liens $5,820.00 · net to John Doe $20,359.92 (BI stream $5,089.98, UM stream $15,269.94)",
    "John signs the Settlement Statement 10/21 · disbursement 10/22/2026 · Trust Ledger to $0.00 · closing memo 10/30/2026"
  ]},
  {section:"Track B: The Stonewall", items:[
    "Back at 08/05/2026: Keystone holds at $3,500 (\"final\", 08/12); the Time-Limited Demand lapses unaccepted 08/21/2026",
    "Follow-ups 08/24 and 08/31 unanswered · 48-Hour Mandate escalation to Keystone's claims supervisor 09/02 · nothing by 09/04",
    "BI isn't exhausted, so Host UM and Relative UM can't open: the whole $40,000 stack is frozen behind a $10,000 carrier"
  ]},
  {section:"Track B: From Impasse to Suit", items:[
    "09/08 impasse memo to Atty. Thorne · 09/09 suit authorized, 40% fee tier discussed with John · 09/10 CMS status → Litigation; Harbor Point and Cardinal State notified",
    "09/24/2026 complaint filed: John Doe v. Robert Smith, State Court of Riverton County, Civil Action No. 26-CV-04417 (medical Specials, wages, future medical, pain and suffering, the Civic's Loss of Use and Diminished Value)",
    "Mediation 03/18/2027, Hon. Carla Benton (Ret.) · statement and binder due 03/11 · consolidated binding UM arbitration 06/22/2027, Laura Whitcomb, Esq. (exhibits 06/02, brief docketed 06/11)",
    "SOL: 02/06/2028 is a Sunday; never rely on a weekend roll-forward. Internal hard date 02/04/2028; internal filing cutoff 11/05/2027"
  ]},
  {section:"Track B: In Suit", items:[
    "Service failed at 118 Larkspur Ln (10/01, 10/05, 10/08); a neighbor says Smith moved in August",
    "11/12/2026 Answer by Atty. Grant Mercer, Mercer & Hale LLP: comparative negligence (the Escape out of turn; John unbelted), causation (the gap; \"degenerative\" MRI), failure to mitigate (the disrupted care)"
  ]},
  {section:"Track B: Discovery and the Deposition", items:[
    "12/01/2026 defendant's Interrogatories (25), Requests for Production (30) and Requests for Admission (15), served on John by mail · unanswered admissions may be deemed admitted",
    "12/10/2026 scheduling order: plaintiff's experts 03/15/2027 · defense experts 04/15 · mediation by 03/31 · discovery closes 05/28 · pretrial 08/12 · trial calendar 09/13/2027",
    "John's deposition noticed 01/20/2027 for 02/18/2027, 10:00 a.m., by videoconference (Riverton Court Reporting)",
    "John unreachable from 01/22/2027 (lost phone, new number) · Margaret Doe is the emergency contact",
    "Property Damage still disputed: Loss of Use $2,016.00 vs $0; Diminished Value $3,600.00 vs $792.00; any proposal needs Atty. Thorne's authority"
  ]},
  {section:"Track B: Where the Suit Stands", items:[
    "Skip-Trace 10/09 → 4410 Quarry Ridge Ct, Millbrook · served 10/14/2026 by Allied Process Services · affidavit filed 10/16 · answer was due 11/13",
    "John's discovery responses due 01/04/2027 (30 days + 3 for mail = 01/03, a Sunday) · Smith's responses due 01/13/2027 (e-served 12/14)",
    "Escape's event data recorder (downloaded 10/2026): front-passenger belt buckled; Escape at 11 mph at impact",
    "John reached through Margaret 02/03/2027 (the No Contact Protocol) · prep sessions 02/04 and 02/16 (Atty. Thorne leads; the CM never coaches testimony) · deposed 02/18/2027"
  ]},
  {section:"Track B: Case Won", items:[
    "07/06/2027 award, Laura Whitcomb, Esq.: damages exceed the UM limits · Harbor Point $20,000 + Cardinal State $10,000, with Keystone's $10,000 from the 03/18/2027 mediation: gross $40,000.00",
    "Fee at the 40% tier (suit filed 09/24/2026): $16,000.00 · receipted costs $3,895.25 (pre-suit $486.75 + filing, service, mediation, arbitration, court reporter, certified records)",
    "Liens at the fee actually charged: Peach State $1,860.00 → $1,116.00 (07/14/2027) · Riverton Spine & Rehab $6,105.00 audited → $4,275.00 (07/16/2027)",
    "Net to John Doe $14,713.75 · Settlement Statement signed 07/29 · disbursed 07/30/2027 ($5,646.17 less than Track A's $20,359.92)"
  ]}
];
