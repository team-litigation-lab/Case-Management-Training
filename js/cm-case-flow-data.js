/* ============================================================
   5-DAY LEGAL CASE MANAGEMENT FLOW — curriculum data
   Focus case: John Doe v. Robert Smith · Lead Counsel: Atty. Elijah Thone

   The SINGLE SOURCE OF TRUTH for the Case Flow track. Generated from it,
   never written separately:
     • the slides, in this course's own lesson format    js/cm-case-flow.js
     • the per-block curriculum spec and the theory map  curriculum/5-day-flow/
                                                           (build/case-flow/curriculum.cjs)
   Spec: curriculum/5-day-flow/00-architecture.md

   A separate training file from "John Doe v. Apex Delivery Services" (Days 1–5),
   which stays exactly as it is. The theory here is extracted from that course's
   lessons (build/day1.js–day5.js) and re-aligned onto this case; `sources` on
   every block names where each one came from ("D1#18" = Day 1, topic 18).

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
   Each day carries `fileState` — where the file stands as the day opens (the AI
   reviewer reads it, and the curriculum spec prints it). Day 3 is Track A (the file
   settles); Days 4–5 are Track B (the same file from 08/05/2026, where the BI
   carrier stonewalls and the case goes to suit). Those days carry `track`, which
   each block's header line shows.

   SHOW TYPES: process {steps:[[label, desc]]} · table {head, rows} ·
   threebox {items:[[label, desc]]} · compare {boxes:[{head, items}]} ·
   split {do, dont} · stack {} (the policy-stack ladder, from `case.stack`)
   ============================================================ */

window.CM_CASE_FLOW = {

  /* ---------- the persistent case file ---------- */
  case: {
    style: "John Doe v. Robert Smith",
    no: "LSH-2026-MVA-770412",
    type: "MVA — passenger injury",
    dol: "02/06/2026",
    sol: "02/06/2028",
    solNote: "Docketed on a two-year limitation for this training file. Confirm the governing state's statute before relying on it.",
    counsel: "Atty. Elijah Thone",
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
      ["Lead Counsel", "Atty. Elijah Thone", "Approves all strategy, demands and filings."],
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

  /* ---------- how the gap is engaged each day ---------- */
  gapArc: [
    [1, "Flagged in the file during intake and the case plan"],
    [2, "Probed with the client on a recorded call and justified with medical documentation"],
    [3, "Used by the adjuster as a causation defense, and countered with the MRI findings"],
    [4, "The adjuster's stonewall on the gap is what triggers the litigation fork"],
    [5, "Defended in deposition prep against opposing counsel's causation trap"]
  ],

  /* ---------- the 1–5 self-rating scale on every knowledge check ---------- */
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
    {from: "D1", topics: [44, 44], to: "Day 1 · Module 4 and Day 2 · Module 3", note: "Treatment gaps: flagged on Day 1, investigated on Day 2"},
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
    {from: "D3", topics: [23, 38], to: "Day 3 · Module 4", note: "Net sheet, disbursement, reconciliation"},
    {from: "D4", topics: [1, 4], to: "Day 4 · Module 1", note: "When pre-suit negotiation stalls; the neutral"},
    {from: "D4", topics: [5, 5], to: "Day 4 · Module 2", note: "Mediation logistics and scheduling"},
    {from: "D4", topics: [6, 15], to: "Day 4 · Module 3", note: "Mediation binders"},
    {from: "D4", topics: [16, 20], to: "Day 4 · Module 2", note: "Arbitration, its hard rules, and the UPL line at hearings"},
    {from: "D4", topics: [21, 28], to: "Day 4 · Module 3", note: "Arbitration binders"},
    {from: "D4", topics: [29, 31], to: "Day 4 · Module 4", note: "Bottlenecks and the 48-Hour Mandate"},
    {from: "D5", topics: [1, 7], to: "Day 5 · Module 1", note: "Litigation lifecycle and KPIs"},
    {from: "D5", topics: [8, 20], to: "Day 5 · Module 3", note: "Deposition preparation"},
    {from: "D5", topics: [21, 21], to: "Day 5 · Module 1", note: "The litigation document index"},
    {from: "D5", topics: [22, 23], to: "Day 5 · Module 4", note: "Service of process and third-party subpoenas"},
    {from: "D5", topics: [24, 28], to: "Day 5 · Module 1", note: "File maintenance, document KPIs, the complaint, written discovery, the master timeline"},
    {from: "D5", topics: [29, 30], to: "Day 5 · Module 4", note: "Process servers, evading defendants, subpoenas duces tecum"},
    {from: "D5", topics: [31, 33], to: "Day 5 · Module 1", note: "Litigation file architecture, advanced KPIs, the litigation Skill Builder"},
    {from: "D5", topics: [34, 35], to: "Day 1 · Module 3 and Day 5 · Module 2", note: "Property damage: introduced on Day 1, disputed on Day 5"}
  ],

  /* ---------- theory written for this flow (in neither the course nor the firm curriculum) ----------
     Listed in traceability.md so it can be reviewed: [what, where]. */
  authored: [
    ["The $40,000 host-passenger stack and its order of operations", "Day 1 · Module 1 — the case facts the brief specifies (Host UM and Relative UM behind a $10,000 BI)"],
    ["Recovery stack vs. payer order as two separate questions", "Day 1 · Module 1, Lesson 2 — built on the Regulatory Triple-Check's payer order"],
    ["The three-criteria skip-trace gate", "Day 1 · Module 2 — the No Contact Protocol has the steps; the trigger rule is new"],
    ["The five-band case plan wrapping the Three-Pillar Plan, and the review-loop states", "Day 1 · Module 4"]
  ],

  /* ---------- the days still to be written, in order (the dashboard shows them as upcoming) ---------- */
  upcoming: [
    {n: 2, title: "Claims & Pre-Demand", modules: [
      "Claims Setup & Coverage Verification",
      "Treatment Phase Operations, LOP Issuance & Provider Oversight",
      "Client Investigation & Treatment Gap Analysis",
      "Pre-Demand Auditing & Strategy Session"]},
    {n: 3, title: "Demands & Settlements", modules: [
      "BI & UM Demand Execution",
      "Adjuster Negotiation & Stall Countermeasures",
      "Combined Lien Negotiations & Practice Lab",
      "Net Sheet Completion & Final Case Closing"]},
    {n: 4, title: "Negotiations & Closing — the Litigation Fork", modules: [
      "The Litigation Fork & Contextual Shift",
      "Mediation vs. Arbitration & Calendar Hard Rules",
      "Evidentiary Binder Assembly",
      "Administrative Bottlenecks & CMS Countermeasures"]},
    {n: 5, title: "Dispute Resolution & Litigation", modules: [
      "Tactical Case Manager Support in Litigation",
      "Interactive Property Damage Practice Lab",
      "Deposition Preparation Protocols",
      "Complex Liability Disputes, Comparative Negligence & MIA Client Skip-Tracing"]}
  ],

  days: [

  /* ==========================================================
     DAY 1 — FUNDAMENTALS & INTAKE
     ========================================================== */
  {
    n: 1, id: 11,
    title: "Case Flow Day 1 · Fundamentals & Intake",
    phase: "File opening",
    objective: "Open John Doe's file correctly: every party mapped, all three coverage layers verified to $40,000, the Regulatory Triple-Check cleared with the health plan's reimbursement right flagged before any demand, and an attorney-ready case plan that names the 14-Day Gap.",
    gate: "CMS initialized · policy stack verified at $40,000 · Regulatory Triple-Check cleared · case plan routed to Atty. Thone",
    discussion: "John Doe has gone quiet for eleven days, has not started treatment, and Robert Smith's carrier has already called him. Which three actions do you take today, in what order, and what goes in the case plan's risks band?",
    fileState: [
      "A raw file from “On the Records”: date of loss 02/06/2026, statute of limitations 02/06/2028, John Doe a front-seat passenger in the host vehicle.",
      "Three coverage layers to verify: $10,000 BI (Keystone Mutual), $20,000 Host UM (Harbor Point), $10,000 Relative UM (Cardinal State Mutual).",
      "Peach State Health Plan has asserted a reimbursement right on first notice.",
      "John Doe has not started treatment; the 14-Day Gap is forming."
    ],
    modules: [

    /* ---------- DAY 1 · MODULE 1 ---------- */
    {
      n: 1, id: "d1m1",
      title: "CM Fundamentals & CMS Initialization",
      about: "From a raw file to a correctly structured matter: party roles, the three-layer policy stack, and the Regulatory Triple-Check.",
      quiz: [
        {q: "On John Doe v. Robert Smith, in what order must the coverage layers be pursued?",
         opts: ["Host UM → BI → Relative UM", "BI → Host UM → Relative UM", "Relative UM → Host UM → BI", "All three at once, in parallel"],
         a: 1, r: "BI pays first. Host UM opens once BI is exhausted or tendered, and Relative UM stacks behind Host UM."},
        {q: "Why can John Doe reach the $20,000 Host UM layer?",
         opts: ["He owns the host vehicle", "He was a passenger in the host vehicle", "Robert Smith has no insurance", "His health plan assigns it to him"],
         a: 1, r: "He reaches the host vehicle's UM because he was riding in that car. Had he been driving his own car he would have reached $10,000: he rejected UM on his own policy, and the relative policy excludes a car he owns."},
        {q: "The correct payer order for John Doe's medical bills is:",
         opts: ["Health plan → PIP/MedPay → LOP/provider liens", "PIP/MedPay → private health insurance → LOP/provider liens", "LOP/provider liens → health plan → PIP/MedPay", "Robert Smith's BI carrier pays each bill as it arrives"],
         a: 1, r: "The Regulatory Triple-Check payer order: PIP/MedPay, then private health insurance, then LOP/provider liens."},
        {q: "Which of these is NOT part of the Regulatory Triple-Check?",
         opts: ["A claim-specific HIPAA authorization that names the incident date", "Medicare/Medicaid (BCRC) reporting where the client is 65+ or on SSDI", "Payer order and subrogation management", "The time-limit demand"],
         a: 3, r: "The triple-check is HIPAA, Medicare/Medicaid reporting, and the payer order. Demands come on Day 3."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d1m1-l1",
        title: "Ingesting the Raw File",
        topic: "From “On the Records” to a structured matter",
        visual: "Left-to-right intake pipeline across the full slide width. Left third: a muted grey stack of unsorted documents labelled RAW INTAKE, deliberately untidy. Centre: three orange-numbered gates in a row — ① Verify ② Map ③ Structure — each a navy card with the orange circle badge top-centre and a thin navy → connector between them. Right third: a clean white CMS matter card with six filled role rows, each with a green ✓. The argument is made by the contrast between the grey untidy left edge and the crisp white right edge. Beneath the pipeline, a full-width orange-bordered strip holds the case's four continuity anchors as mono pills.",
        tell: {
          why: "The Intake Phase is where the Case Manager establishes control, structure and clarity. It is not just data collection: a file opened wrong stays wrong, because every later deadline, demand and lien check reads from the fields set in the first hour. A mis-mapped party is not a typo. It is a lost coverage layer.",
          rules: [
            "Case management is the end-to-end coordination, tracking and handling of a case from intake to resolution: timely progression, proper documentation and compliance, and effective communication between all parties. It is ownership, not data entry.",
            "You are the gatekeeper of case quality. Confirm the intake work is complete, accurate, properly documented and ready for activation. Incomplete intake goes back, not forward.",
            "Run the conflict check before the file is created, on the full legal name of every party (Robert Smith, the host driver, the resident relative), and record its date and result. Nothing else moves until it is done.",
            "Confirm the date of loss against the police report, not the intake note. The statute of limitations, every carrier deadline and the treatment timeline count from it.",
            "Compare the intake narrative with the police report and the client's statement, and check every signature and authorization before activation. Confirm and document any correction; never fix an inconsistency silently.",
            "Docket the statute of limitations on day one. On this file: 02/06/2028.",
            "Map every party to a role. Six roles exist on this file, and a party left as “unknown” is a coverage layer you have not found yet.",
            "Record the client's position in the vehicle. Driver, passenger or pedestrian decides which policies can be reached.",
            "Collect the full pre-claim data set (client basics, every driver and vehicle, insurance from the police report or the client, witnesses) and the emergency contact. Clients go quiet, and the emergency contact is the channel that still reaches them.",
            "Read coverage off the declarations page, not a summary, and record the source of every coverage fact: dec page, adjuster letter or police report.",
            "Expect asymmetry. First-party carriers disclose limits readily; a third-party BI carrier usually asks for documents first and runs its own investigation.",
            "Name every document to the firm's convention on ingest, and keep the CMS as the single source of truth, not side emails."
          ],
          upl: [
            "You may confirm facts and explain the process. You may not tell the client what the case is worth or whether they have a claim. That is Atty. Thone's call."
          ]
        },
        show: {
          caption: "The six roles on John Doe's file, and what each one unlocks",
          type: "table",
          head: ["Role", "Party", "Why this field matters"],
          rows: [
            ["Client / Plaintiff", "John Doe", "Front-seat passenger, not a driver. This field opens two UM layers."],
            ["Defendant", "Robert Smith", "At-fault driver. His BI carrier pays first."],
            ["Lead Counsel", "Atty. Elijah Thone", "Every demand and filing routes through him."],
            ["Case Manager", "You", "Owns the file's movement; does not own legal judgment."],
            ["Host driver", "Operator of John Doe's vehicle", "Source of the $20,000 Host UM layer."],
            ["Resident relative", "John Doe's household relative", "Source of the $10,000 Relative UM layer."]
          ]
        },
        ops: [
          ["Raw file received from “On the Records”", "Run and document the conflict check, then verify DOL, parties and signatures against the source documents", "CMS → New Case", "Conflict check logged before the file exists; DOL matches the police report"],
          ["Matter created", "Docket the SOL and log the retainer and the claim-specific HIPAA authorization", "CMS → Calendar · Documents", "SOL 02/06/2028 on the calendar; both signatures logged"],
          ["Parties identified", "Map all six roles and record the client's position in the vehicle", "CMS → Parties", "No party left “unknown”; position = passenger"],
          ["Documents arrive", "Name each to the firm's convention and file it under its CMS category", "CMS → Documents", "Every document findable by its convention name"]
        ],
        best: [
          "Record the source of every coverage fact (dec page, adjuster letter, police report).",
          "Docket the statute of limitations on day one.",
          "Request missing documents in one consolidated message, with a deadline.",
          "Use the CMS as the single source of truth, not side emails.",
          "Pitfall: creating the file before the conflict check is documented.",
          "Pitfall: running the conflict check on a nickname or partial name.",
          "Pitfall: rewriting a vague summary from memory instead of confirming the facts with the client.",
          "Pitfall: accepting a case because intake “mostly” looks fine."
        ],
        sources: ["D1#1", "D1#3", "D1#4", "D1#5", "D1#6", "D1#7", "D1#10", "D1#12", "D1#13", "D1#15", "D1#16", "D1#18", "LSH Claims Specialist: pre-claim data set, declarations page, coverage asymmetry"],
        rubric: {
          ai: [
            ["Conflict check first", 15, "Conflict check documented before the file is created"],
            ["DOL and SOL", 20, "DOL 02/06/2026 matched to the police report; SOL 02/06/2028 docketed"],
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
        kind: "activity", id: "d1m1-a1",
        title: "Policy Stack & Coverage Verification",
        topic: "Skill Activity 1 — build the ladder to $40,000",
        visual: "A vertical three-rung ladder in the centre of the slide, built bottom-up so the stacking order reads physically. Rung 1 (bottom, navy): BI $10,000. Rung 2 (navy-soft): HOST UM $20,000. Rung 3 (top, orange): RELATIVE UM $10,000. Each rung is a rounded bar carrying its carrier, claim number and adjuster in small mono type on the right. To the right, a vertical orange brace spans all three rungs with the total, $40,000, set large in Fraunces. Below, one empty verification checkbox per layer in an orange-bordered card headed VERIFY EACH LAYER. The rungs are numbered 1-2-3 bottom to top and never reordered.",
        act: {
          scenario: "All three carriers have opened claims and reported their limits on the set-up calls. The declarations pages have been requested in writing and none has arrived yet; Keystone, the third-party carrier, wants authorizations first. Nothing has been entered in the CMS Insurance tab.",
          prompt: "Build the complete policy stack for John Doe v. Robert Smith. Enter all three layers in the CMS in their order of operations, with carrier, policy number, claim number, limit and adjuster for each. Classify each layer as first-party or third-party. In the Comments box record the carrier's actual name, the driver's name where it differs from the owner, and the adjuster's details, or state expressly that none is assigned yet. Then verify the total, record the order the layers must be pursued in, and mark the projection preliminary until each limit is confirmed in writing.",
          tool: "CMS → Insurance tab",
          output: "A three-layer coverage matrix totalling $40,000, each layer classified, ordered and fully attributed.",
          checkpoints: [
            "All three layers present: BI, Host UM, Relative UM",
            "Limits entered as $10,000 / $20,000 / $10,000",
            "Total computes to $40,000",
            "Order of operations recorded: BI → Host UM → Relative UM",
            "BI classified as third-party; both UM layers as first-party",
            "Policy number and claim number completed for every layer",
            "Relative UM adjuster recorded as “No adjuster assigned yet”, not left blank",
            "Source of each limit recorded (set-up call for now; declarations page requested)",
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
            ["Verification habit", 15, "Recorded where each limit came from, and held the projection until each is confirmed by its declarations page"]
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
        kind: "lesson", id: "d1m1-l2",
        title: "Health Subrogation, Payer Order & the Regulatory Triple-Check",
        topic: "Who pays the bills now, and who gets paid back later",
        visual: "A two-lane swimlane running left to right. Upper lane, navy, labelled PAYS THE BILLS NOW — PAYER ORDER: an arrow through PIP/MedPay → Peach State Health Plan → LOP/provider liens. Lower lane, orange, labelled PAYS THE CLAIM LATER — RECOVERY STACK: an arrow through BI → Host UM → Relative UM ending at a SETTLEMENT node. A bold orange return arrow curves from the health plan in the upper lane down into the settlement node, labelled REIMBURSEMENT CLAIM. The curve is the heaviest line on the slide. Top-right, three stacked chips form the Regulatory Triple-Check: HIPAA · BCRC · PAYER ORDER, each with a tick box. Bottom-left, a danger-bordered callout: “Flagged late = paid twice.”",
        tell: {
          why: "Two different questions get confused on every new file: who pays John Doe's medical bills while the claim is open, and who pays the claim itself at the end. The health plan answers the first and then asks to be repaid out of the second. A reimbursement claim found after the demand goes out comes out of the client's net.",
          rules: [
            "Clear the Regulatory Triple-Check before any clinical planning begins, so the claim is properly established and you are authorized to act.",
            "Check 1, HIPAA: obtain a claim-specific Authorization to Release Medical Information. It names the incident date and permits communication with legal and insurance parties; a generic release may not be adequate.",
            "Check 2, Medicare/Medicaid: if the client is 65+ or on SSDI, report the case to the Benefits Coordination & Recovery Center (BCRC) under MMSEA (2007). Skipping it risks federal penalties and a frozen settlement. John Doe is 34, so the check is his SSDI status: verify it and record the answer.",
            "Check 3, payer order: PIP/MedPay first, then private health insurance, then LOP/provider liens. Verify whether any PIP/MedPay applies on this loss; do not assume it.",
            "The payer order is not the recovery stack. The $40,000 in BI and UM pays the claim; the payer order pays the bills while it is open.",
            "A health plan that pays accident-related bills asserts a reimbursement right against the settlement. Identify it early so it doesn't surprise you at settlement: flag it on first notice, before the first demand.",
            "Record the plan's carrier, member ID and group number in the CMS lien register the day they are known, and log the BCRC answer in the file.",
            "Never promise a provider or a plan a payment amount. Verify now, negotiate at the lien stage, with authority from Atty. Thone."
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
              "The health plan then asserts a reimbursement right against the settlement."
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
          ["Health plan identified", "Record carrier, member ID and group; record the payer order", "CMS → Liens", "Lien record exists and is dated; payer order noted"],
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
            ["Triple-check complete", 20, "HIPAA authorization, BCRC answer and payer order all recorded"],
            ["Payer order", 20, "PIP/MedPay → private health insurance → LOP/provider liens, kept separate from the recovery stack"],
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
          "Tie it forward: “On Day 3 you will negotiate this lien down. What you can reduce depends on what you register today.”"
        ]
      },

      {
        kind: "activity", id: "d1m1-a2",
        title: "Subrogation Lien Flagging in the CMS",
        topic: "Skill Activity 2 — register the claim before it can hurt you",
        visual: "A single annotated CMS Liens screen filling two-thirds of the slide, a white card with a navy header bar. Five fields are called out with orange numbered badges and leader lines to short labels in the right margin: ① Plan carrier ② Member ID ③ Group number ④ Payer order position ⑤ Reimbursement flag. Below the screen, a slim two-state timeline: a green node, FLAGGED NOW · before demand, and a red node, FOUND AT DISBURSEMENT · client's net is hit, crossed out. Keep the red state on the slide: trainees need to see the failure they are avoiding.",
        act: {
          scenario: "Peach State Health Plan has begun paying John Doe's accident-related treatment. No lien record exists on the matter yet, and the pre-demand audit is still ahead.",
          prompt: "Register Peach State Health Plan's reimbursement claim in John Doe's lien register and flag it against the matter. Record the carrier, member ID and group number, its position in the payer order, the basis on which reimbursement is asserted, and the date of the flag. Record the Regulatory Triple-Check results alongside it. Then state in one line what must happen before this lien can be compromised.",
          tool: "CMS → Liens",
          output: "A dated, flagged lien record complete enough to negotiate from on Day 3.",
          checkpoints: [
            "Lien record created against the John Doe matter",
            "Carrier recorded as Peach State Health Plan",
            "Member ID PSH-55017742 and group GRP-41208 both entered",
            "Payer-order position recorded: after PIP/MedPay, before LOP/provider liens",
            "Reimbursement basis noted",
            "Flag dated before any demand is drafted",
            "Triple-Check recorded: HIPAA authorization, BCRC answer, payer order",
            "Escalation noted: compromise requires Atty. Thone's authority"
          ]
        },
        ops: [
          ["Plan's first payment posts", "Create and flag the lien record", "CMS → Liens", "Record dated; flag set"],
          ["Lien record created", "Attach the Triple-Check results", "CMS → Case Notes", "HIPAA, BCRC and payer order all recorded"],
          ["Any request to compromise", "Route to Atty. Thone", "CMS → Tasks → Escalate", "No compromise discussed without counsel's authority"]
        ],
        best: [
          "Registering a lien is not conceding it; Day 3 is where it gets reduced.",
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
          "Read one trainee's record to the room as if you were the lien negotiator receiving it on Day 3. Gaps show at once.",
          "Remind them that registering a lien is not conceding it."
        ]
      },

      {
        kind: "check", id: "d1m1-kc",
        title: "Policy Stack Knowledge Check",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "Split layout. Upper half: the knowledge-check panel on the warm cream card with the orange ruled border, questions numbered in orange. Lower half, below a full-width orange hairline: the CM SELF-SUMMARY on a navy card with white type holding three prompts, and beside it the 1–5 SKILL SCALE as a five-step horizontal ladder with the competency rows beneath. Far right, a slim vertical strip shows the 60/40 split as a stacked bar, 60% AI in navy and 40% Trainer in orange, with UPL as a separate red gate chip below and outside the bar, to show it is not part of the weighting.",
        check: {
          questions: [
            "List the three coverage layers on John Doe v. Robert Smith in the order they must be pursued, with each layer's limit and the total available.",
            "John Doe was a front-seat passenger. Explain how that single fact changes the available recovery, and what it would have been had he been driving his own car.",
            "Why must the Host UM layer not be demanded before the BI layer is exhausted or tendered? State the consequence of getting the order wrong.",
            "Set out the payer order for John Doe's medical bills, and explain why it is a different question from the recovery stack.",
            "Name the three parts of the Regulatory Triple-Check and what each requires on this file, including what you verify for the BCRC.",
            "You discover an unregistered health lien on the morning the demand package is due to be served. Describe what you do, in what order, and whose authority you need."
          ],
          summary: [
            "Summarize, in your own words, what you learned opening John Doe's file: the principles, not the clicks.",
            "Articulate your strategy: what is the next action you would take on this file, and why is it the right next action rather than something else?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Mapping party roles from a raw intake file",
            "Building and verifying a multi-layer policy stack",
            "Stating the order of operations across coverage layers",
            "Running the Regulatory Triple-Check and the payer order",
            "Registering and flagging a subrogation claim in the CMS",
            "Holding the UPL boundary in client contact"
          ]
        },
        best: [
          "Answer with the file's own numbers and names, not general rules.",
          "Pitfall: a self-rating that doesn't match your answers; your trainer will ask about the gap."
        ],
        sources: ["D1#18", "D1#19", "D1#20", "D1#22"],
        rubric: {
          ai: [
            ["Stack accuracy", 20, "Three layers, correct limits, $40,000 total, correct order"],
            ["Passenger reasoning", 15, "Passenger status opens both UM layers; $10,000 named as the counterfactual had he driven his own car"],
            ["Payer order & triple-check", 15, "Payer order correct and kept separate from the stack; all three checks named"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Strategic articulation", 15, "The stated next action is the right one and the reasoning holds"],
            ["Self-summary quality", 10, "Honest and specific, not a restatement of the slide"],
            ["UPL boundary", 10, "Escalation to Atty. Thone identified where authority is required"],
            ["Self-rating calibration", 5, "Self-score is defensible against demonstrated performance"]
          ]
        },
        notes: [
          "Question 2 is the keystone. A trainee who cannot answer it has memorised the numbers without understanding the stack; re-teach before moving on.",
          "Question 6 is a pressure scenario. The right answer registers the lien, tells Atty. Thone, and does not quietly serve the demand on time.",
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
      about: "The client who stops answering: the No Contact Protocol, a defensible outreach log, the Final Warning Letter and the skip-trace trigger.",
      quiz: [
        {q: "Under the No Contact Protocol, what comes before any outreach call?",
         opts: ["The Final Warning Letter", "An internal review of case status, live deadlines and the date of last contact", "A skip-trace", "A Motion to Withdraw"],
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
        kind: "lesson", id: "d1m2-l1",
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
          ["Channel ladder exhausted", "Step 3: notify Atty. Thone and assess deadline impact on John Doe's file", "CMS → Tasks → Escalate", "Escalation documented; SOL (02/06/2028) and any hearing dates assessed"]
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
        visual: "A CMS communications log as a table across the full slide width, four rows pre-filled as worked examples and four blank rows outlined in orange for the trainee. Columns: Date · Time · Channel · Outcome · Next action. In the right margin, a vertical coverage tracker of four chips (Phone ×2, Email, SMS, Emergency contact), each grey until its rung is cleared, then orange. Bottom strip, in danger red: a BAD entry, “called client, no answer”, with no date, time or channel, annotated with what is missing.",
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
          ["Ladder cleared, no answer", "Step 3 escalation with case impact", "CMS → Tasks → Escalate", "Atty. Thone notified; impact recorded"]
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
          "John Doe's treatment still hasn't begun. This silence is also what becomes the 14-Day Gap; plant that now, Module 4 flags it."
        ]
      },

      {
        kind: "lesson", id: "d1m2-l2",
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
          ["Response deadline expires", "Verify all three criteria; escalate to Atty. Thone for skip-trace authority and the Step 5 decision", "CMS → Tasks → Escalate", "All three criteria evidenced in the log first"]
        ],
        best: [
          "Itemize the attempts with dates; “we have tried several times” is not evidence.",
          "Ask your in-house help to confirm an address you can't verify.",
          "Pitfall: triggering a skip-trace on the first criterion alone.",
          "Pitfall: writing “we are withdrawing” in a letter the attorney has not approved."
        ],
        sources: ["LSH Claims Specialist: No Contact Protocol, Steps 4–6; withdrawal letters", "D5 agenda: MIA Clients"],
        rubric: {
          ai: [
            ["Letter elements", 25, "Attempts itemized, 7–14 day deadline, withdrawal notice, response method"],
            ["Dual delivery", 15, "Certified mail and email both used and logged"],
            ["Criteria evidence", 20, "All three skip-trace criteria shown in the log"]
          ],
          trainer: [
            ["Letter tone", 20, "Firm, clear and not threatening; a worried client would respond to it"],
            ["Authority discipline", 20, "Withdrawal and skip-trace both escalated for counsel's decision"]
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
          scenario: "John Doe has been unreachable for eleven days. The phone rung is cleared, emails and texts have been sent and the emergency contact has been tried, all logged. Step 3 escalation has been made to Atty. Thone. Treatment still has not begun.",
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
            "Skip-trace criteria recorded; Step 5 authority noted as Atty. Thone's"
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
            "A colleague logs three voicemails to the client's mobile on three days and reports the contact ladder exhausted. Explain what is wrong and what the log should show instead.",
            "State the three criteria that must all be met before skip-tracing starts, and explain why starting on fewer is a problem for both the firm and the record.",
            "John Doe has been unreachable for eleven days and his treatment has not begun. Identify every risk now building on this file and what you do about each.",
            "At Step 5 the client is still unresponsive. State precisely what you may do and what only Atty. Thone may do.",
            "Rewrite this sentence to bring it inside the UPL boundary: “If you don't call us back this week, you will lose your case and we will have to withdraw.”"
          ],
          summary: [
            "Summarize what you learned about the firm's duty to a client who has gone silent, and what the record has to show.",
            "Articulate your strategy: John Doe is on day eleven and still not treating. What do you do next, in what order, and why that order?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Running the No Contact Protocol's channel ladder",
            "Keeping a contemporaneous, defensible communications log",
            "Drafting a Final Warning Letter that gets a response",
            "Applying the three-criteria skip-trace gate",
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
            ["Criteria accuracy", 15, "All three skip-trace criteria stated as an AND gate"],
            ["Letter requirements", 15, "Certified mail and email; 7–14 day window"],
            ["Completeness", 10, "Every question answered substantively"]
          ],
          trainer: [
            ["Risk identification", 15, "Names the running SOL, the hardening treatment gap and the stalled claims work"],
            ["Role boundary", 10, "Reserves the withdrawal decision to counsel"],
            ["UPL rewrite quality", 5, "The rewrite is compliant and still useful"],
            ["Self-summary & calibration", 10, "Specific, honest, and defensible against the score"]
          ]
        },
        notes: [
          "Question 2 is easy to answer shallowly. Protection from liability is the purpose trainees omit, and it is why the record is built the way it is.",
          "Question 5 is the integration question: the running SOL, the hardening treatment gap, and the claims work that must go on anyway.",
          "Question 7 is the UPL gate in miniature. A trainee who can't rewrite it compliantly isn't ready for client contact.",
          "The gap they are watching build here is the same 14 days they will defend in deposition on Day 5."
        ]
      }

      ]
    },

    /* ---------- DAY 1 · MODULE 3 ---------- */
    {
      n: 3, id: "d1m3",
      title: "Property Damage Handling & Onboarding Directions",
      about: "The client's standing instructions, rental authorization, repair estimates and the total-loss question, and the packet that sets expectations on day one.",
      quiz: [
        {q: "The property damage carve-out in the LOR lets the adverse carrier talk to the client about:",
         opts: ["Injuries and treatment", "The property damage claim only", "Anything except settlement figures", "A recorded statement"],
         a: 1, r: "Only the resolution of the property damage claim. Anything else routes to the firm."},
        {q: "On a rental vehicle, whose policy is usually primary?",
         opts: ["The rental company's self-insurance", "The renter's own personal auto policy", "The at-fault driver's BI", "The client's health plan"],
         a: 1, r: "The rental company usually steps in only after the personal policy denies, in writing."},
        {q: "Actual cash value (ACV) is:",
         opts: ["What is still owed on the loan", "The vehicle's pre-loss market value", "The cost of a new replacement", "The repair estimate plus storage"],
         a: 1, r: "Pre-loss market value, not the loan balance and not replacement with new."},
        {q: "Which document best proves hidden structural damage?",
         opts: ["The initial insurance estimate", "The body shop's supplementals on the final bill", "The client's photos of the interior", "The tow receipt"],
         a: 1, r: "Compare the estimate with the final bill: supplementals are often the best proof of hidden structural damage."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d1m3-l1",
        title: "Client Do's and Don'ts & Rental Authorization",
        topic: "Protecting the claim from the client's own good intentions",
        visual: "A balanced two-column DO / DON'T board on the upper two-thirds, green-bordered left and red-bordered right, with matched pairs on the same line so each DON'T sits opposite the DO it replaces. Each row carries a small icon in the gutter. Lower third: a rental authorization flow of four connected chips — WHOSE POLICY IS PRIMARY? → WHO AUTHORIZES? → DAILY RATE CAP → DURATION LIMIT — with an orange tag under the last two: “uncovered days are the client's cost.”",
        tell: {
          why: "Most self-inflicted damage to an injury claim happens in the first two weeks, before the client has been told what not to do. A casual recorded statement, a gap in treatment or a social-media post can cost more than any negotiation will recover.",
          rules: [
            "The client gives no recorded statement to the adverse carrier. All adverse contact routes through the firm.",
            "The client starts treatment and keeps every appointment. Explain why consistent treatment matters; gaps become causation arguments against them.",
            "The client posts nothing about the collision, the injuries or their activities.",
            "The client signs no release, authorization or settlement document from any carrier until the firm has reviewed it.",
            "The client keeps every receipt and out-of-pocket expense, including mileage to appointments and household help. Only what is documented can be recovered.",
            "Property damage is the one carve-out from the no-direct-contact rule. The LOR lets the adverse carrier talk to the client about the property damage claim only.",
            "On a rental, the renter's own personal auto policy is usually primary. The rental company is usually self-insured and steps in only after the personal policy denies, in a formal written denial.",
            "Confirm rental authorization before the client collects a vehicle: who authorizes it, the daily rate cap and the duration limit. Check for a rental reimbursement endorsement on the policy.",
            "The client reports any change of address, phone number or treating provider at once."
          ],
          upl: [
            "You may deliver the firm's standing instructions and explain the process. You may not tell the client what their conduct will do to the value of the claim; give the instruction and route the question to Atty. Thone.",
            "The carve-out is narrow. If the adverse carrier uses a property damage call to ask about injuries, treatment or the facts of the loss, the call stops and routes to the firm."
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
            "Give a recorded statement to the other side.",
            "Let treatment lapse, or stop because you feel better.",
            "Assume an undocumented expense can be claimed later.",
            "Collect a rental before coverage is confirmed in writing.",
            "Post about the collision, the injuries or your activities."
          ]
        },
        ops: [
          ["Retainer signed", "Deliver the standing instructions and log delivery", "CMS → Onboarding", "Delivery logged with date and method"],
          ["Client asks about a rental", "Confirm the primary policy, the authorization, the rate cap and the duration", "CMS → Property Damage", "All rental parameters recorded before collection"],
          ["Adverse carrier calls the client directly", "Instruct the client to route it to the firm; log the contact", "CMS → Communications Log", "No recorded statement; contact logged"]
        ],
        best: [
          "Educate the client on why consistent treatment matters, not just that it does.",
          "Use active listening; a client who feels heard follows instructions.",
          "Pitfall: explaining why a recorded statement hurts the claim; that is legal advice. Give the instruction."
        ],
        sources: ["D1#28", "D1#44", "LSH Claims Specialist: LOR property damage carve-out, rental coverage hierarchy, documents to support the claim"],
        rubric: {
          ai: [
            ["Instruction coverage", 25, "All standing instructions present, including the property damage carve-out"],
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
          "Watch for trainees explaining why a recorded statement hurts the claim. That slides into legal advice; the instruction is the deliverable."
        ]
      },

      {
        kind: "activity", id: "d1m3-a1",
        title: "Client Onboarding Direction Packet",
        topic: "Skill Activity 1 — assemble what the client gets on day one",
        visual: "An exploded packet: a central navy folder with six document cards fanned around it in a semicircle, each numbered with an orange badge — ① Do's and Don'ts ② Treatment directions ③ Property damage and rental ④ Communication protocol ⑤ Document retention ⑥ Firm contacts and escalation path — each showing two or three bullet previews in small type. Beneath the fan, a delivery bar of three chips: PREPARED → DELIVERED → LOGGED, the third noting the required date and method.",
        act: {
          scenario: "John Doe's retainer is signed and the matter is open in the CMS. Nothing has been sent to him yet, and he has already had one call from Robert Smith's carrier.",
          prompt: "Assemble John Doe's onboarding direction packet. Build all six sections, populate each with the firm's standing instructions, and make the property damage section specific to this file. Given that the adverse carrier has already called him, state which instruction is now most urgent and how you will confirm he has understood it. Then log delivery.",
          tool: "CMS → Onboarding → Direction Packet",
          output: "A complete, delivered and logged onboarding packet specific to John Doe's file.",
          checkpoints: [
            "All six packet sections present and populated",
            "The standing instructions all appear in the Do's and Don'ts",
            "Treatment direction stated, given that treatment has not begun",
            "Property damage section names the rental parameters to confirm",
            "Communication protocol routes all adverse carrier contact to the firm",
            "Firm contacts list Atty. Elijah Thone as lead counsel",
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
            ["Counsel named correctly", 10, "Atty. Elijah Thone as lead counsel"],
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
        visual: "A horizontal threshold gauge dominates: a long bar running from pale on the left to orange and then navy on the right, with a bold vertical THRESHOLD marker about three-quarters along. Left of the marker, REPAIR — carrier pays to fix; right of it, TOTAL LOSS — carrier pays ACV. A repair-estimate chip and an ACV chip sit above the bar to show the comparison. Below, a three-step strip: ① Estimate vs. final bill ② Compare against ACV ③ Confirm the carrier's basis in writing. Bottom-right, a navy card lists what is owed either way: storage, towing, loss of use.",
        tell: {
          why: "Property damage settles long before the injury claim, and it is the client's first test of whether the firm is competent. It is also physical evidence of how hard the impact was, so audit it as carefully as the medicals.",
          rules: [
            "Get the written repair estimate before discussing any outcome with the client. No estimate, no position.",
            "Give the carrier a defined window to inspect the vehicle (the firm's standard is 5 days from the letter) and record the date it opens.",
            "Compare the insurance estimate with the final body shop bill. Supplementals are often the best proof of hidden structural damage.",
            "Audit the photos for a clear point of impact, including the undercarriage and frame.",
            "A vehicle is a total loss when the cost to repair reaches the carrier's threshold measured against its actual cash value. Confirm the threshold basis the carrier is applying, in writing.",
            "Actual cash value is the pre-loss market value: not what is owed on the loan, and not the cost of a new replacement. Verify the valuation report (e.g. CCC One) so the client isn't lowballed.",
            "Courts value property damage on the “lesser of” rule: the cost of repair, or the drop in market value from before to after the loss.",
            "Storage and towing accrue daily. Settle the disposition quickly or the charges eat the recovery.",
            "Loss of use is claimable for each day the client is without a vehicle, measured by a comparable rental, separately from the repair or ACV payment. The authority is state law (for example, Nevada: Dugan v. Gotsopoulos, 117 Nev. 285 (2001), cited in the firm's own LOR template); confirm the governing rule for the file.",
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
            ["Repair cost vs. ACV", "The repair figure against pre-loss market value", "Whether the carrier repairs or declares a total loss"],
            ["What basis is the carrier using?", "The threshold and the valuation report, in writing", "Which side of the line the vehicle falls on"],
            ["How long in storage?", "Daily storage and towing", "Delay erodes the recovery"],
            ["Is the client without transport?", "The dates without a vehicle", "Loss of use, claimed separately"]
          ]
        },
        ops: [
          ["Repair estimate received", "Log it; compare with ACV and, later, the final bill", "CMS → Property Damage", "Estimate on file; comparison recorded"],
          ["Carrier states a disposition", "Confirm the threshold basis and the valuation report in writing", "CMS → Property Damage → Correspondence", "Basis confirmed, not assumed"],
          ["Client is without a vehicle", "Record the dates and open the loss-of-use claim", "CMS → Property Damage → Loss of use", "Dates recorded; claimed separately"]
        ],
        best: [
          "Supplementals are often the best proof of hidden structural damage.",
          "Verify the valuation report so the client isn't lowballed on the vehicle's value.",
          "Pitfall: working only from the initial estimate.",
          "Pitfall: treating property damage as “just the car”; it is evidence for the injury claim."
        ],
        sources: ["D2#6", "D5#34", "D5#35", "LSH Claims Specialist: 5-day inspection window, loss of use, tow and storage"],
        rubric: {
          ai: [
            ["Estimate logged", 15, "Written estimate recorded before any client discussion; inspection window dated"],
            ["ACV comparison", 25, "Repair figure against pre-loss market value, not the loan balance"],
            ["Loss of use opened", 20, "Dates recorded and claimed separately from the repair or ACV payment"]
          ],
          trainer: [
            ["Threshold reasoning", 25, "Knows what ACV is and is not, and confirms the basis rather than assuming it"],
            ["Client handling", 15, "Explained the process without advising on acceptance or legal value"]
          ]
        },
        notes: [
          "The recurring misconception is that ACV equals the loan balance. Correct it the moment it appears.",
          "Storage is the silent cost. Ask: “Who is paying for every day this car sits?”",
          "Loss of use is the most often forgotten item, and on this file it matters: John Doe needs to get to treatment he hasn't started.",
          "Day 5 reopens this with diminished value and the property damage dispute lab. Today is the threshold; Day 5 is the fight."
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
          "The treatment follow-up is the hinge into Module 4. John Doe's gap becomes undeniable there; this task is what would have caught it."
        ]
      },

      {
        kind: "check", id: "d1m3-kc",
        title: "PD & Onboarding Knowledge Audit",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split (cream question panel, navy self-summary card, 1–5 ladder, 60/40 strip with the separate red UPL gate). Module-specific addition: a PD AUDIT STRIP between the panels, a five-cell horizontal checklist — Estimate · Final bill · ACV comparison · Storage/towing · Loss of use — that the trainee ticks as a self-audit before answering.",
        check: {
          questions: [
            "List the firm's standing instructions for a new personal injury client and, for each, the specific harm it prevents.",
            "Before John Doe collects a rental, what must be confirmed, and whose policy is usually primary? What happens to days outside the authorization?",
            "Explain what actual cash value means, what it does not mean, and why confusing it with the loan balance misleads the client.",
            "Robert Smith's carrier calls John Doe directly and asks for a recorded statement. Set out exactly what you instruct him to do, and what you log.",
            "Identify everything John Doe may be owed on the property damage side beyond the repair or ACV payment, and what must be documented for each.",
            "A direction was delivered to the client but never assigned as a tracked task. Explain why that is a failure and what it costs on this file."
          ],
          summary: [
            "Summarize what you learned about protecting a claim in its first two weeks, and whose job that protection is.",
            "Articulate your strategy: John Doe has the packet, the adverse carrier has already called him, and he hasn't started treatment. What do you do next and why?",
            "Identify the one thing in this module you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Delivering client instructions a layperson will follow",
            "Confirming rental coverage, authorization, rate cap and duration",
            "Comparing a repair estimate and final bill against ACV",
            "Identifying storage, towing and loss-of-use entitlements",
            "Turning directions into tracked, verifiable tasks",
            "Holding the UPL boundary while explaining property damage"
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
            ["Entitlement completeness", 10, "Storage, towing and loss of use all identified"]
          ],
          trainer: [
            ["Scenario handling", 15, "Routes the contact correctly and logs it, without legal explanation to the client"],
            ["Strategic articulation", 15, "Prioritises treatment, given the forming gap"],
            ["Self-summary quality", 5, "Specific and honest"],
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
        {q: "The three pillars of the case plan are:",
         opts: ["Coverage, Liability, Projection", "Clinical, Functional, Financial", "Intake, Treatment, Demand", "HIPAA, BCRC, Payer order"],
         a: 1, r: "Clinical (acute interventions), Functional (ADLs and return to work), Financial (payer order, subrogation, MMSEA)."},
        {q: "Once the claim is set up, the case plan is typically filed within:",
         opts: ["7 days", "30–60 days, depending on the state", "6 months", "After maximum medical improvement"],
         a: 1, r: "Often 30–60 days depending on the state. Docket the date."},
        {q: "John Doe's date of loss is 02/06/2026 and his first treatment is 02/20/2026. The gap is:",
         opts: ["7 days", "10 days", "14 days", "20 days"],
         a: 2, r: "14 days, and it goes in the plan's risks band with its consequences."},
        {q: "Under the Golden Rule of US claim set-up, what belongs in a treatment note?",
         opts: ["“This will help the case.”", "Factual, clinical observations only", "The attorney's valuation", "Settlement strategy"],
         a: 1, r: "Coordinate, don't commingle: the medical track and the legal track never cross."}
      ],
      blocks: [

      {
        kind: "lesson", id: "d1m4-l1",
        title: "The Acceptance Decision & the Three-Pillar Case Plan",
        topic: "The document that makes the file move",
        visual: "A five-band vertical architecture, each band a full-width navy or navy-soft bar with an orange index number at its left edge: ① CASE SNAPSHOT & ACCEPTANCE ② COVERAGE · LIABILITY · PROJECTION ③ REGULATORY TRIPLE-CHECK ④ THREE-PILLAR PLAN — the band split into three equal columns, CLINICAL · FUNCTIONAL · FINANCIAL ⑤ RISKS & FLAGS. Band ⑤ is in danger red rather than navy and visibly taller, holding one highlighted chip, 14-DAY TREATMENT GAP; that asymmetry must survive any redesign. To the right, a thin vertical routing rail with an arrow ending in a card: ATTY. ELIJAH THONE · REVIEW, and under it a calendar chip, FILE WITHIN 30–60 DAYS.",
        tell: {
          why: "The case plan is the file's operating instruction. It is what Atty. Thone reads to set strategy and what every later day executes against. A plan that hides a risk produces a strategy built on a false picture.",
          rules: [
            "Acceptance comes first. After the verification call confirms the facts of loss, decide: Accepted, Escalated for attorney/senior review, or Declined, and record the reason so someone else can follow it.",
            "At acceptance you stop gathering information and make the determination.",
            "If eligibility is uncertain (ambiguous facts of loss or liability, or no clear legal assessment), clarify the facts with the client, then escalate to the attorney with a short summary of exactly what is ambiguous. Don't let the file sit in limbo.",
            "State coverage, liability and projection together. You can't project a case until coverage and liability are understood, and the projection is preliminary until coverage is confirmed.",
            "Liability is not final until it is confirmed by the police report, the driver statements and any dashcam or other evidence. Never tell the client liability is a sure thing.",
            "Clear the Regulatory Triple-Check before the clinical plan: HIPAA, Medicare/Medicaid reporting, payer order.",
            "File the Three-Pillar Case Plan within the state's window, often 30 to 60 days, and docket the date.",
            "Clinical: the acute interventions that stabilise the client (PT, specialty consults). Functional: activities of daily living and return-to-work status. Financial: the payer order, subrogation management and MMSEA compliance.",
            "Give every pillar measurable goals, and every action item an owner and a date.",
            "Flag adverse facts prominently. A risk buried in prose has not been disclosed to counsel.",
            "The plan proposes operational steps. It does not set legal strategy; route it to Atty. Thone before acting on anything that commits the firm's position."
          ],
          upl: [
            "The plan may state facts, flag risks and propose operational steps. It may not state legal conclusions, case value or settlement posture. Those are Atty. Thone's to set, which is why the plan is routed to him."
          ]
        },
        show: {
          caption: "The five bands, and what belongs in each",
          type: "process",
          steps: [
            ["Snapshot & acceptance", "Parties, DOL, SOL, client position, phase; Accepted / Escalated / Declined with the reason."],
            ["Coverage · Liability · Projection", "The three-layer stack and its order; who is responsible; a preliminary projection."],
            ["Regulatory Triple-Check", "HIPAA authorization, BCRC answer, payer order."],
            ["Three-Pillar Plan", "Clinical, Functional, Financial goals, each with an owner and a date."],
            ["Risks & flags", "Adverse facts stated plainly: here, the 14-Day Treatment Gap. Routed to Atty. Thone."]
          ]
        },
        ops: [
          ["Verification call complete", "Record the acceptance decision with its reason", "CMS → Case Notes", "Accepted / Escalated / Declined, with a reason a colleague can follow"],
          ["Coverage verified and triple-check cleared", "Draft the plan across all five bands", "Action Plan Editor", "All five bands present; risks band populated"],
          ["Plan drafted", "Docket the filing window and route to Atty. Thone", "Action Plan Editor → Route for review · CMS → Calendar", "Routed before any position-committing action; due date on the calendar"]
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
          "Ask: “What happens if Atty. Thone builds a demand strategy without knowing about the gap?” The answer is the whole module.",
          "Draw the line between operational and legal: “Request the MRI” is operational. “This case is worth policy limits” is not the CM's to write.",
          "Trainees under-flag because flagging feels like admitting a weak case. Reframe: flagging early is what makes the case defensible later."
        ]
      },

      {
        kind: "activity", id: "d1m4-a1",
        title: "Identifying & Flagging the 14-Day Gap",
        topic: "Skill Activity 1 — find the fact that will decide this case",
        visual: "A horizontal treatment timeline is the whole slide. Far left, a navy node: DOL · 02/06/2026. From it runs a conspicuous empty span, a hatched hollow orange band with no event markers, fourteen day-ticks wide, labelled NO TREATMENT · 14 DAYS. At its right end a node, FIRST TREATMENT · 02/20/2026, after which markers resume and then thin out again at a second, smaller hollow span labelled DISRUPTED CARE. Beneath, three consequence cards fan out from the hollow band on orange leader lines: CAUSATION CHALLENGE · VALUATION PRESSURE · CREDIBILITY ATTACK. The emptiness of the band is the message; never fill it with decoration.",
        act: {
          scenario: "John Doe's treatment records have arrived. The date of loss is 02/06/2026. The first treatment record is dated 02/20/2026. Treatment thins out again partway through the course of care.",
          prompt: "Identify and flag the treatment gap in John Doe's file. Compute it exactly, record both the initial gap and the later disruption, and state in the risks band what each will be used for against the claim. List the likely causes you will investigate, and the steps needed before the gap can be explained. Then route the flag to Atty. Thone.",
          tool: "CMS → Case File → Risk Flags · Action Plan Editor → Risks",
          output: "A precisely computed, prominently flagged and routed treatment-gap record.",
          checkpoints: [
            "Gap computed as 14 days, 02/06/2026 to 02/20/2026",
            "Both the initial gap and the later disrupted care recorded",
            "Defense uses stated: injuries not serious; recovered earlier than claimed; treatment unnecessary; other causes",
            "Likely causes listed to investigate: missed appointments, transportation, cost or co-pays, work schedule, stopping after temporary relief, delayed referrals, imaging or authorizations",
            "Investigation steps recorded: the client's own explanation, supporting documents, provider confirmation",
            "Flag placed prominently in the case plan's risks band",
            "Flag routed to Atty. Thone"
          ]
        },
        ops: [
          ["Treatment records received", "Compute the gap from DOL to first treatment", "CMS → Case File → Treatment timeline", "14 days, both dates recorded"],
          ["Gap confirmed", "Flag it with its defense uses and likely causes", "Action Plan Editor → Risks", "Prominent flag with consequences"],
          ["Flag recorded", "Route to Atty. Thone; schedule the Day 2 investigation", "CMS → Tasks", "Routed and scheduled"]
        ],
        best: [
          "Identify gaps early during record review, and document the reason for every interruption.",
          "A well-explained gap is less damaging than an unexplained one.",
          "Pitfall: “about two weeks” instead of the exact dates.",
          "Pitfall: recording the first gap but not the later disruption."
        ],
        sources: ["D1#16", "D1#44", "D2#13"],
        rubric: {
          ai: [
            ["Gap computation", 25, "Exactly 14 days, dates correct"],
            ["Both events recorded", 15, "Initial gap and later disruption both captured"],
            ["Defense uses and causes", 10, "The adjuster's arguments and the likely causes both named"],
            ["Routed", 10, "Flag routed to Atty. Thone"]
          ],
          trainer: [
            ["Flag prominence", 25, "A reviewer sees it within seconds of opening the plan"],
            ["Investigative thinking", 15, "The steps would actually produce a defensible explanation"]
          ]
        },
        notes: [
          "This is Day 1's most consequential activity. Everything on Days 2 to 5 turns on this flag existing and being accurate.",
          "Insist on the exact count. “About two weeks” is not a flag; 02/06 to 02/20 is.",
          "Ask the room what the adjuster will say when they see this. Their answers become the Day 3 negotiation.",
          "Trainees often record the gap but not the later disruption. Both matter; the second undercuts the “he got better” explanation for the first."
        ]
      },

      {
        kind: "lesson", id: "d1m4-l2",
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
            "Routing exists because legal strategy is counsel's. Where a review comment asks for a legal judgment, the answer comes from Atty. Thone, not from the case manager drafting the plan."
          ]
        },
        show: {
          caption: "The review loop, and what each state allows",
          type: "table",
          head: ["State", "What it means", "What you may do"],
          rows: [
            ["Draft", "Being written; not yet seen by counsel", "Edit freely. Execute nothing that commits the firm externally."],
            ["Routed", "Sent to Atty. Thone, awaiting review", "Continue internal preparation. Do not act on the plan's positions."],
            ["Returned with comment", "Counsel wants changes", "Address every comment, then re-route. Do not part-execute."],
            ["Approved", "Counsel has authorized the plan", "Execute against this version and record it as the operative plan."],
            ["Superseded", "A material fact changed after approval", "Re-route. The earlier approval no longer covers the new picture."]
          ]
        },
        ops: [
          ["Plan drafted across all five bands", "Route to Atty. Thone", "Action Plan Editor → Route for review", "Routing recorded with timestamp"],
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
          "The superseded state matters on this file: the gap investigation on Day 2 will change the picture and force a re-route.",
          "Read the Golden Rule pitfall aloud. Defense counsel uses opinions in medical notes to impeach the case manager's neutrality."
        ]
      },

      {
        kind: "activity", id: "d1m4-a2",
        title: "Live Case Plan Draft — John Doe v. Robert Smith",
        topic: "Skill Activity 2 — the full plan, routed for review",
        visual: "A full-slide editor canvas showing the live plan with all five bands stubbed and their required fields outlined in orange. A completion meter runs across the top in five segments that fill as each band is completed. The risks band carries a red required marker so it can't be skipped silently. Bottom-right, the ROUTE FOR REVIEW control is greyed out and locked until all five segments are filled, with a label: “all five bands required.” The lock is the argument: the tool won't let an incomplete plan reach counsel.",
        act: {
          scenario: "Everything from Day 1 is in the file: parties mapped, the $40,000 stack verified, the Regulatory Triple-Check cleared with the health plan's reimbursement right flagged, the onboarding packet delivered and tracked, and the 14-Day Treatment Gap identified. Atty. Thone is waiting on the case plan.",
          prompt: "Draft the complete case plan for John Doe v. Robert Smith. Fill all five bands from today's work: the acceptance decision with its reason; coverage as a stack with its order of operations, liability, and a preliminary projection; the triple-check results; Clinical, Functional and Financial pillars with measurable goals, each action item with an owner and a date; and the risks band with the 14-Day Gap and the later disruption, prominently, with their consequences. Docket the filing window, then route the plan to Atty. Thone.",
          tool: "Action Plan Editor",
          output: "A complete, routed case plan that counsel could set strategy from without asking a follow-up question.",
          checkpoints: [
            "Snapshot: parties, DOL 02/06/2026, SOL 02/06/2028, client recorded as a passenger",
            "Acceptance decision recorded with its reason",
            "Coverage: $10,000 BI / $20,000 Host UM / $10,000 Relative UM, total $40,000",
            "Order of operations: BI → Host UM → Relative UM; projection marked preliminary",
            "Liability recorded as preliminary until confirmed by the police report and driver statements",
            "Triple-check: HIPAA authorization, BCRC answer, payer order",
            "Clinical, Functional and Financial pillars each with a measurable goal",
            "Every action item has an owner and a date",
            "Risks band: 14-Day Gap and later disrupted care, prominent, with consequences",
            "Filing window docketed",
            "Plan routed to Atty. Elijah Thone with a timestamp"
          ]
        },
        ops: [
          ["Day 1 work complete", "Draft all five bands", "Action Plan Editor", "Meter at five of five"],
          ["Plan complete", "Docket the filing window", "CMS → Calendar", "Due date on the calendar"],
          ["Plan docketed", "Route to Atty. Thone", "Action Plan Editor → Route for review", "Routed with timestamp"]
        ],
        best: [
          "Grade your own plan as Atty. Thone will read it: if you need to ask a question to set strategy, it isn't finished.",
          "Pitfall: a projection stated as a number before coverage is confirmed."
        ],
        sources: ["D1#8", "D1#18", "D1#19", "D1#22", "D1#23", "D1#44"],
        rubric: {
          ai: [
            ["Snapshot accuracy", 15, "Parties, DOL, SOL and client position all correct"],
            ["Coverage accuracy", 15, "Correct limits, total and order of operations"],
            ["Risk flagging", 15, "The 14-day gap and the disruption both recorded with consequences"],
            ["Item discipline", 10, "No action item without an owner and a date"],
            ["Routing", 5, "Routed to Atty. Thone with timestamp"]
          ],
          trainer: [
            ["Reviewer readiness", 25, "Counsel could set strategy from it without a follow-up question"],
            ["Boundary discipline", 15, "No legal conclusion or case valuation written into the plan"]
          ]
        },
        notes: [
          "This is Day 1's capstone. Give it real time; it is the gate, not a wrap-up.",
          "The locked route control is deliberate. If a trainee can't route, ask which band is incomplete.",
          "Grade it as Atty. Thone would read it. If you need to ask a question to set strategy, the plan isn't finished.",
          "Close Day 1 by stating the gate: CMS initialized, stack verified at $40,000, triple-check cleared, plan routed. Day 2 doesn't begin until all four are true."
        ]
      },

      {
        kind: "check", id: "d1m4-kc",
        title: "Case Plan Audit & Day 1 Gate",
        topic: "Knowledge Check + Case Manager Self-Summary & Skill Scale",
        visual: "The standard knowledge-check split, with one Day-1-specific addition above the question panel: a full-width DAY 1 GATE bar of four connected checkpoint chips — CMS INITIALIZED · STACK VERIFIED $40,000 · TRIPLE-CHECK CLEARED · PLAN ROUTED — each with a tick state, and a closed navy barrier at the right end labelled DAY 2 with a small note: “opens when all four are green.” The barrier makes the sequential-integrity rule visible rather than merely stated.",
        check: {
          questions: [
            "Set out the five bands of the case plan and what belongs in each, including the three pillars.",
            "Explain why an adverse fact buried in the body of a plan has not, in any meaningful sense, been disclosed to counsel.",
            "State John Doe's coverage position exactly as it should appear in the plan: layers, limits, total, order of operations, and the status of the projection.",
            "Compute John Doe's treatment gap from the record dates and explain how an adjuster will use it against the claim.",
            "A plan was approved last week. Today the gap investigation produces a medical explanation that changes the picture. What is the status of that approval, and what do you do?",
            "Draw the line: give one thing the plan may properly state, and one that must come from Atty. Thone instead.",
            "All four Day 1 gate conditions must be met before Day 2 begins. List them, and explain what breaks if treatment work starts with the stack unverified."
          ],
          summary: [
            "Summarize what you learned about turning a raw intake into a file an attorney can set strategy from.",
            "Articulate your strategy: the plan is with Atty. Thone. What is your next action, and what are you waiting on before the one after that?",
            "Identify the one thing across all of Day 1 you are least confident about, and what you would need in order to be confident."
          ],
          scale: [
            "Recording an acceptance decision with its reason",
            "Structuring a complete five-band, three-pillar case plan",
            "Stating a coverage position as an ordered stack",
            "Computing and documenting a treatment gap precisely",
            "Routing for attorney review and keeping version discipline",
            "Keeping operational proposals apart from legal strategy"
          ]
        },
        best: [
          "Check all four gate conditions before you move to Day 2.",
          "Pitfall: quietly editing an approved plan instead of re-routing it."
        ],
        sources: ["D1#8", "D1#23", "D1#24", "D1#25", "D1#44", "D2#13"],
        rubric: {
          ai: [
            ["Band recall", 15, "All five bands and all three pillars named with correct contents"],
            ["Coverage accuracy", 15, "Limits, total, order of operations; projection preliminary"],
            ["Gap computation", 15, "14 days, correct dates, the adjuster's arguments named"],
            ["Gate conditions", 10, "All four Day 1 gate conditions listed"],
            ["Completeness", 5, "Every question answered substantively"]
          ],
          trainer: [
            ["Version reasoning", 15, "Recognises the approval is superseded and the plan must be re-routed"],
            ["Boundary judgment", 10, "The examples are genuinely on the right sides of the line"],
            ["Self-summary quality", 10, "Specific and honest across the whole day"],
            ["Self-rating calibration", 5, "Defensible against the score"]
          ]
        },
        notes: [
          "Question 5 tests version discipline and is the most often failed: the approval is superseded, and the plan must be re-routed, not quietly edited.",
          "Question 7 enforces sequential integrity: with an unverified stack, Day 2's letters of representation go to the wrong carriers in the wrong order.",
          "This check closes Day 1. Confirm the gate aloud with the room before releasing anyone to Day 2.",
          "Compare scores with self-ratings across all four modules, not just this one."
        ]
      }

      ]
    }

    ]
  }

  ]
};
