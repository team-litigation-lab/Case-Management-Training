const DAY2 = {
  id: 2,
  title: "Pre-Demand, BI Demand & BI Settlement",
  theme: "Pre-Demand Case Auditing · Master Audit Checklist · Defense-Eye Audit · BI Demand Phase · Treatment Gaps in Demand · Settlement Negotiations · PIP & the Valuation Baseline · Negotiation Tactics · BI Settlement Execution & Technical Closing",
  objective: "Audit a file before demand so there are zero easy outs for the defense, build a BI demand that presents a debt owed, negotiate from first call to a confirmed settlement, and execute the BI settlement paperwork and technical closing without leaving the client short-funded.",
  lessons: [
    { h: "Training Agenda: From Pre-Demand to Settlement",
      layout: "THREEBOX",
      boxes: [
        { label: "01 Pre-Demand", desc: "Where 80% of settlement value is won or lost." },
        { label: "02 BI Demand", desc: "Documentation translated into a narrative with teeth." },
        { label: "03 BI Settlement", desc: "Closing, lien mitigation and ethical escrow management." }
      ],
      fourPart: {
        corePrinciples: [
          "Today breaks down the mechanics that separate an average case manager from an indispensable case strategist.",
          "Pre-Demand: without certified chart notes, diagnostic imaging, or a clear police report on liability, you will spend months fighting an uphill battle.",
          "BI Demand: adjusters don't read 400-page record dumps out of goodwill; they respond to clear liability, hard-coded injury baselines, and strict policy-limit deadlines.",
          "Settlement Closing & Lien Resolution: if a case settles for $100,000 but bills and statutory subrogation eat $70,000, the client walks away frustrated."
        ],
        howTo: [
          "Case Phase: Pre-Demand",
          "Case Phase: BI Demand",
          "Case Phase: BI Settlement"
        ],
        bestPractices: [
          "Signing the release is only half the battle — our duty at closing is aggressive lien mitigation.",
          "Pitfall: treating the gross settlement as the finish line."
        ],
        discussionCase: "Why is pre-demand where most value is won or lost?"
      },
      trainerCue: "Whether you have managed PI files for three weeks or three years, today we break down the exact mechanics that separate an average case manager from an indispensable case strategist."
    },
    { h: "Pre-Demand Case Auditing: Core Objectives",
      layout: "QUADRANT",
      quadrants: [
        { label: "Verification", desc: "Do the facts in the demand match the physical evidence?" },
        { label: "Valuation", desc: "Are damages (bills, wages, future care) accurate and justified?" },
        { label: "Risk Assessment", desc: "Find weak spots — e.g., comparative negligence arguments." },
        { label: "Compliance", desc: "Statutory requirements (like the SOL) met before the demand." }
      ],
      fourPart: {
        corePrinciples: [
          "Pre-demand Case Auditing (often called a “Forensic Case Audit” or “Pre-Litigation Audit”) is the rigorous process of vetting a legal claim's evidence and value before sending a formal demand letter.",
          "The audit serves as a “sanity check” to ensure the claim is bulletproof."
        ],
        howTo: [
          "Verification — do the facts in the demand letter match the physical evidence (e.g., do the crash photos match the police report)?",
          "Valuation — audit medical bills, lost wages, and future care costs so every expense is justified.",
          "Risk Assessment — identify “weak spots” where the defense may argue comparative negligence (partial fault).",
          "Compliance — ensure the case meets statutory requirements (like the Statute of Limitations) before the demand is issued."
        ],
        bestPractices: [
          "Stress-test the case before the defense gets their hands on it.",
          "Discrepancies destroy credibility — find them first.",
          "Pitfall: sending the demand and hoping nobody checks the math."
        ],
        discussionCase: "Which of the four objectives is most often skipped?"
      },
      trainerCue: "Before we send a demand letter, we conduct a pre-demand audit — our forensic sanity check. We verify factual alignment, financial precision, weak spots, and statutory hurdles."
    },
    { h: "The Auditing Checklist: The Trinity of Case Alignment",
      layout: "THREEBOX",
      boxes: [
        { label: "The Narrative", desc: "The client's story — how the incident happened." },
        { label: "The Physicality", desc: "Property damage and biomechanics — the force of impact." },
        { label: "The Medicals", desc: "The clinical proof of injury." }
      ],
      fourPart: {
        corePrinciples: [
          "The goal of this audit is to ensure that when the demand letter lands on an adjuster's desk, there are zero “easy outs” for the defense.",
          "A successful audit ensures three pillars are perfectly synchronized. If one is out of alignment, the case value collapses.",
          "A Full Pre-Demand Audit is the final “stress test” of a legal file — the transition from collecting information to “weaponizing it.”"
        ],
        howTo: [
          "Confirm the Narrative (client's account).",
          "Confirm the Physicality (PD photos, biomechanics).",
          "Confirm the Medicals (diagnoses, treatment, objective injuries).",
          "Audit Question: do the property damage photos support the mechanism of injury described in the medical records?"
        ],
        bestPractices: [
          "If photos show a minor scratch but medicals claim a severe spinal impact, the defense will pick that apart in seconds.",
          "Pitfall: auditing each pillar separately without cross-checking them."
        ],
        discussionCase: "Give an example where the narrative and physicality don't match."
      },
      trainerCue: "We make sure all three pillars tell the exact same story before we send it out."
    },
    { h: "Master Audit Checklist: Financial & Lien Verification",
      fourPart: {
        corePrinciples: [
          "This is the “math” portion of the audit. Mistakes here lead to “short-funded” settlements where the client takes home $0."
        ],
        howTo: [
          "Special Damages — sum of all medical bills + Property Damage + Lost Wages.",
          "Lost Wage Verification — a signed letter from the employer AND a “disability slip” from the doctor. Without both, adjusters usually reject lost wage claims.",
          "Lien Resolution — Statutory: Medicare, Medicaid, ERISA, VA.",
          "Lien Resolution — Consensual: medical provider liens (LOPs).",
          "Identify all “Subrogation” interests."
        ],
        bestPractices: [
          "Lock in total damages first, then protect them by identifying liens before the demand.",
          "Pitfall: discovering a statutory lien after the settlement is signed."
        ],
        discussionCase: "What two documents make a lost wage claim stick?"
      },
      trainerCue: "By getting the math, the proof, and the liens aligned now, we make sure the settlement actually pays the bills and puts real money in the client's pocket."
    },
    { h: "Master Audit Checklist: Liability & Liability Proof",
      fourPart: {
        corePrinciples: [
          "Lock down Liability & Liability Proof before the demand — this is the stress test of the entire file."
        ],
        howTo: [
          "Police/Incident Report — verify the final version (not just the exchange of info). Check for citations or “contributory negligence” notes.",
          "Witness Statements — confirm contact info is still valid. Audit for “statement drift” (did their story change?).",
          "The “Scene” Audit — review Google Earth or dashcam footage to ensure the physics of the claim are possible."
        ],
        bestPractices: [
          "Official report + solid witness testimony + physical reality = a case the adjuster can't break.",
          "Pitfall: relying on the preliminary exchange-of-information form."
        ],
        discussionCase: "How do you detect statement drift?"
      },
      trainerCue: "When you line up the official report, rock-solid witness testimony, and the physical reality of the scene, you aren't just making an argument — you're handing the adjuster a case they can't break."
    },
    { h: "Master Audit Checklist: Property Damage (PD) Deep Dive",
      fourPart: {
        corePrinciples: [
          "Property damage is physical evidence of impact severity — audit it as carefully as the medicals."
        ],
        howTo: [
          "Photos — audit for “point of impact” clarity. Are there photos of the undercarriage or frame? (Crucial for high-value injury claims.)",
          "Estimates vs. Actuals — compare the insurance estimate with the final body shop bill. Look for “supplementals” that prove hidden structural damage.",
          "Total Loss/Value — if totaled, verify the CCC One or valuation report. Ensure the client isn't being lowballed on the asset value."
        ],
        bestPractices: [
          "Supplementals are often the best proof of hidden structural damage.",
          "Pitfall: only using the initial estimate."
        ],
        discussionCase: "Why do undercarriage/frame photos matter for injury value?"
      },
      trainerCue: "A Full Pre-Demand Audit is the final stress test of a legal file — PD photos and supplementals often decide the low-impact argument."
    },
    { h: "Master Audit Checklist: Medical & Billing Audit",
      fourPart: {
        corePrinciples: [
          "The medical and billing audit makes the damages defensible."
        ],
        howTo: [
          "Chronology — create a timeline. Audit for Gaps in Treatment. A 14-day gap needs a documented reason (e.g., “Client was waiting for MRI authorization”).",
          "Coding Audit — scan bills for “Unbundling” or duplicate CPT codes that make the bill look inflated/fraudulent.",
          "Prior History — review the client's medical history from the past 5–10 years to identify pre-existing conditions before the defense does."
        ],
        bestPractices: [
          "Every gap in the chronology gets a documented reason.",
          "Pitfall: letting the defense be the first to find a prior injury."
        ],
        discussionCase: "What would you write in the chronology for John Doe's 14-day gap?"
      },
      trainerCue: "This process ensures a compelling case and enhances credibility."
    },
    { h: "The “Defense-Eye” Audit (Red Flag Detection)",
      fourPart: {
        corePrinciples: [
          "Before finalizing the demand, audit the file for these “Value Killers.”"
        ],
        howTo: [
          "Social Media Presence — if they claim “loss of enjoyment of life” but posted vacation photos during treatment, adjust the demand or warn the client.",
          "MIST Designation — if PD is under $1,000–$2,000, classify it as “Minor Impact Soft Tissue” and provide stronger medical narratives to counter the “low damage = no injury” bias.",
          "Venue Audit — confirm where suit would be filed and whether the jury pool is “conservative” or “liberal,” as this affects the pain-and-suffering “multiplier.”"
        ],
        bestPractices: [
          "Addressing value killers early keeps the demand realistic and compelling.",
          "Pitfall: ignoring the client's public social media."
        ],
        discussionCase: "A client posted gym photos last week. What now?"
      },
      trainerCue: "Addressing these value killers early enhances our position in negotiations."
    },
    { h: "Pre-Demand: Final Package Readiness",
      layout: "THREEBOX",
      boxes: [
        { label: "Summary Memo", desc: "1-page “cheat sheet” of the audit findings." },
        { label: "Exhibit Index", desc: "All bills, records and PD photos labeled." },
        { label: "The “Ask”", desc: "A demand range from policy limits and Total Specials." }
      ],
      fourPart: {
        corePrinciples: [
          "An audited file should be organized as follows for the attorney's final review."
        ],
        howTo: [
          "Summary Memo — a 1-page “cheat sheet” of the audit findings.",
          "Exhibit Index — all bills, records, and PD photos labeled.",
          "The “Ask” — a calculated demand range based on the policy limits and the “Total Specials.”"
        ],
        bestPractices: [
          "Pro Tip: always audit the Policy Limits one last time. There is nothing worse than sending a $100,000 demand only to realize mid-negotiation that the defendant has a $25,000 “Step-Down” policy.",
          "Pitfall: an exhibit index that doesn't match the page numbers."
        ],
        discussionCase: "What goes in the 1-page summary memo?"
      },
      trainerCue: "These steps improve our negotiation readiness and case presentation."
    },
    { h: "Skill Building: Pre-Demand Audit Challenges (John Doe File)",
      skill: { tool: "cmPreDemand2", cms: true },
      fourPart: {
        corePrinciples: [
          "Scenario 1: the insurance adjuster (Aggressive Casualty) emails: “This was a low-speed impact; your client's injuries are exaggerated.”",
          "Scenario 2: John didn't see a doctor for 14 days after the ER because he was “non-responsive due to mental distress.” The adjuster is moving to deny the claim because of this “Gap in Treatment.”",
          "Brainstorming: you will receive the files for this case. Conduct a Pre-demand Audit and share your findings with the class."
        ],
        howTo: [
          "Challenge 1 — find two specific details on the intake sheet that objectively disprove the “low-speed” argument.",
          "Challenge 2 — reframe the 14-day gap in the demand letter to increase the value instead of losing it.",
          "Run the full pre-demand audit on the John Doe file and record findings in the CMS."
        ],
        bestPractices: [
          "Use objective facts (extrication, total loss, EMS transport) — not adjectives.",
          "Pitfall: apologizing for the gap instead of explaining it with documentation."
        ],
        discussionCase: "Share findings: what did each group find that the others missed?"
      },
      trainerCue: "Have groups present findings. Look for objective PD/extrication facts and a documented, trauma-linked explanation of the gap."
    },
    { h: "Case Phase: Demand — The Legal & Procedural Foundation",
      layout: "THREEBOX",
      boxes: [
        { label: "Statute of Limitations (SOL)", desc: "The deadline that governs every demand." },
        { label: "Liability Framework", desc: "Who is responsible and how we prove it." },
        { label: "Coverage Analysis", desc: "Which policies and limits apply." }
      ],
      fourPart: {
        corePrinciples: [
          "Case Managers must understand the “why” behind the paperwork.",
          "Bodily Injury (BI) Demand workflows integrate legal expertise, medical understanding, and negotiation skills.",
          "Case Managers need to efficiently progress cases from intake to disbursement, meeting deadlines and identifying key “value-drivers.”"
        ],
        howTo: [
          "Confirm the SOL and docket it.",
          "Confirm the liability framework and evidence.",
          "Confirm coverage and limits."
        ],
        bestPractices: [
          "Know which value-drivers your demand leads with.",
          "Pitfall: sending paperwork without understanding why each piece is there."
        ],
        discussionCase: "What is a value-driver in the John Doe file?"
      },
      trainerCue: "SOL, liability framework, and coverage analysis are vital for assessing risks and timelines to build effective cases for clients."
    },
    { h: "Demand: The Policy Limit Mindset",
      fourPart: {
        corePrinciples: [
          "A Case Manager must shift from a reactive mindset to a proactive, strategic one.",
          "This phase is all about identifying needs, quantifying requirements, and setting the stage for resource allocation.",
          "The Policy Limit Mindset: the goal isn't just to send a packet of records; it is to present the case in a way that makes the insurance adjuster afraid of a jury."
        ],
        howTo: [
          "Maximum Medical Improvement (MMI) — ensure the client has completed treatment or has a clear future care plan.",
          "The “Gap” Check — identify and explain any gaps in treatment before the adjuster uses them to devalue the case."
        ],
        bestPractices: [
          "Present, don't just compile.",
          "Pitfall: demanding before MMI or a future care plan exists."
        ],
        discussionCase: "What would make an adjuster afraid of a jury on this file?"
      },
      trainerCue: "This proactive approach reinforces the integrity of the demand."
    },
    { h: "Treatment Gaps in the Demand Phase",
      fourPart: {
        corePrinciples: [
          "Insurance adjusters often use treatment gaps to argue that: the injuries were not serious; the client recovered earlier than claimed; treatment was unnecessary or excessive; other unrelated factors caused the condition.",
          "👉 Unexplained gaps can reduce settlement value."
        ],
        howTo: [
          "🛠 Identify gaps early during record review.",
          "Document the reason for every treatment interruption.",
          "Obtain supporting documents when available.",
          "Include explanations directly in the demand package timeline."
        ],
        bestPractices: [
          "📄 When addressing a gap: acknowledge it clearly; provide context and supporting facts; connect continued symptoms to ongoing treatment; reinforce consistency of complaints before and after the gap.",
          "👉 A well-explained treatment gap is less damaging than an unexplained one.",
          "Pitfall: leaving the gap out of the timeline and hoping it's missed."
        ],
        discussionCase: "Write the demand-timeline entry for a 14-day gap caused by trauma-induced withdrawal."
      },
      trainerCue: "Identify and address any treatment gaps to prevent adjusters from undermining the case's value."
    },
    { h: "The Demand Packet Checklist: The “Big Four”",
      layout: "TABLE",
      tableHeaders: ["Component", "What must be flawless"],
      tableRows: [
        ["Medical Specials", "A clean, itemized ledger of every provider bill with final balances verified."],
        ["The Narrative", "Drafting the client's story — mechanism of injury, pain, and life impact — consistent with the records."],
        ["Liability Proof", "Including the police report, photos, witness statements and any dashcam/scene evidence."],
        ["Special Damages", "Lost wages (employer letter + disability slip), property damage, and out-of-pocket costs."]
      ],
      fourPart: {
        corePrinciples: [
          "A Case Manager must ensure the “Big Four” components are flawless before the attorney reviews the demand letter."
        ],
        howTo: [
          "Medical Specials",
          "The Narrative",
          "Liability Proof",
          "Special Damages"
        ],
        bestPractices: [
          "Precision here prevents setbacks in case progression.",
          "Pitfall: sending the attorney a demand with an unverified ledger."
        ],
        discussionCase: "Which of the Big Four is weakest in the John Doe demand draft?"
      },
      trainerCue: "The Demand Packet Checklist ensures the Big Four are precise before attorney review."
    },
    { h: "Demand: Quality Control — The “Final Scrub”",
      fourPart: {
        corePrinciples: [
          "Before a demand is sent, the CM performs a “Final Scrub” to catch common “adjuster traps.”"
        ],
        howTo: [
          "Billing Overlaps — ensure no double-billing for the same date of service.",
          "Pre-existing Conditions — highlight how the accident aggravated a previous injury rather than trying to hide it.",
          "Balance Verification — call every provider to get the “final balance” so the demand amount is 100% accurate."
        ],
        bestPractices: [
          "Diligence here leads to a strong demand package and favorable negotiations.",
          "Pitfall: using stale balances from months ago."
        ],
        discussionCase: "How do you present a 2018 prior injury in the demand?"
      },
      trainerCue: "Quality control: billing overlaps, pre-existing conditions framed as aggravation, and final balance verification."
    },
    { h: "Negotiating the “First Call” (For Senior CMs)",
      fourPart: {
        corePrinciples: [
          "Senior CMs often handle the first negotiation call — it sets the tone."
        ],
        howTo: [
          "The “Anchor” Technique — never apologize for a high demand. Stay firm on the value drivers.",
          "Note-Taking — document every excuse the adjuster gives (e.g., “low impact,” “delayed treatment”). This is the ammunition the attorney needs for litigation."
        ],
        bestPractices: [
          "Write the adjuster's exact words into the CMS immediately after the call.",
          "Pitfall: softening the demand to seem reasonable."
        ],
        discussionCase: "Practice an anchor statement for a $150,000 demand."
      },
      trainerCue: "Firmly uphold the value drivers; documenting the adjuster's excuses supports litigation later."
    },
    { h: "Demand: Best Practices",
      fourPart: {
        corePrinciples: [
          "CM Pro-Tip: “A demand is not a request for money; it is a presentation of a debt owed. Treat the insurance company like a bank that hasn't paid its bill.”"
        ],
        howTo: [
          "30-Day Rule — once a client is MMI, the demand must be out the door within 30 days.",
          "Photo Impact — always lead the demand with the most “graphic” photo (property damage or injury) to set the tone.",
          "The “Why” Factor — every medical bill added to the demand needs a corresponding “Why”: why was this treatment necessary for recovery?"
        ],
        bestPractices: [
          "Docket the MMI date + 30 days the moment MMI is confirmed.",
          "Pitfall: bills in the demand with no medical-necessity explanation."
        ],
        discussionCase: "Which photo would you lead the John Doe demand with?"
      },
      trainerCue: "A demand presents a debt owed, shifting the power dynamic in your favor."
    },
    { h: "Skill Building: Demand Phase Challenge — Real-Time Demand Audit",
      skill: { tool: "cmPreDemand2", cms: true },
      fourPart: {
        corePrinciples: [
          "Demand Audit: John Doe v. Apex Delivery. Your demand specialist has submitted a draft for your review.",
          "Your goal is to identify and close any potential loopholes, ensuring the presentation is airtight so the adjuster has no grounds to dispute or decline the claim."
        ],
        howTo: [
          "Review the Demand Packet draft against the Big Four and the Final Scrub.",
          "List every deficiency you find.",
          "If deficiencies are found, assign tasks accordingly (in the CMS) to rectify the documentation and finalize the demand."
        ],
        bestPractices: [
          "A thorough audit strengthens the demand and speeds up a favorable settlement.",
          "Pitfall: fixing issues yourself without assigning and tracking them."
        ],
        discussionCase: "What was the single biggest loophole in the draft?"
      },
      trainerCue: "Perform a Real-Time Demand Audit so the packet is strong and defensible; assign tasks promptly in the CMS."
    },
    { h: "Settlement Negotiations: The Pitch & the Negotiation Battle Map",
      layout: "PROCESS",
      processSteps: [
        { label: "Create a Net Sheet", desc: "Liens + costs + fees = the floor." },
        { label: "Identify the Value Drivers", desc: "3 facts that would scare a jury." },
        { label: "Anticipate the Adjuster", desc: "Top two weaknesses + documentation." },
        { label: "Prepare the Rebuttal", desc: "Have it ready before they raise it." }
      ],
      fourPart: {
        corePrinciples: [
          "In PI law, the demand letter is your opening move. If it looks like a template, the adjuster will treat it like one.",
          "Adjusters typically protect insurance companies by undervaluing claims, so it's important to be prepared for negotiations."
        ],
        howTo: [
          "Create a Net Sheet — calculate total medical liens, costs, and attorney fees; anything below this total means the client receives $0. The aim is to maximize the net settlement amount.",
          "Identify the Value Drivers — list 3 facts that would scare a jury (e.g., “The defendant was on his phone” or “The client missed his daughter's wedding due to surgery”).",
          "Anticipate the Adjuster's Response — identify your top two weaknesses and prepare to justify them, ideally with documentation.",
          "Prepare the Rebuttal — have the argument ready before they bring it up."
        ],
        bestPractices: [
          "Personalization is key — a generic letter is undervalued.",
          "Pitfall: negotiating without knowing the client's net floor."
        ],
        discussionCase: "Name three value drivers in John Doe's file."
      },
      trainerCue: "Thorough preparation and anticipation are vital for achieving favorable settlements."
    },
    { h: "The Valuation Baseline: PIP Set-Off (The Credit)",
      fourPart: {
        corePrinciples: [
          "In BI settlements, PIP benefits are paid regardless of fault, complicating compensation claims from the at-fault party.",
          "Case Managers need to understand the relationship between these coverages to ensure successful settlements and prevent clients from getting ZERO compensation.",
          "In most jurisdictions, the defendant's insurance carrier is entitled to a set-off for payments made by PIP."
        ],
        howTo: [
          "The Logic — the law generally prevents “double recovery.” If PIP already paid the hospital $10,000, the defendant shouldn't have to pay that same $10,000 again.",
          "The Calculation — Gross Settlement Value − PIP Paid Amount = Defendant's Remaining Liability."
        ],
        bestPractices: [
          "Always know the PIP paid amount before you calculate the BI ask.",
          "Pitfall: counting PIP-paid bills as unpaid in the BI demand."
        ],
        discussionCase: "Gross value $60,000, PIP paid $10,000 — what is the defendant's remaining liability?"
      },
      trainerCue: "Grasping these financial dynamics enhances advocacy and ensures equitable settlements."
    },
    { h: "The Valuation Baseline: PIP as a Severity Signal",
      fourPart: {
        corePrinciples: [
          "BI Adjusters use PIP payments to gauge the “seriousness” of a claim during the Demand Phase."
        ],
        howTo: [
          "Speed of Exhaustion — if a client exhausts a $10,000 PIP limit in 48 hours (like John Doe did with his ER and EMS bills), it signals a high-severity case.",
          "Special Damages — the total medical bills (“Specials”) are usually much higher than what PIP pays. Argue that although PIP covered $10k, the total value of the bills ($41,400 in John's case) is the true anchor for pain-and-suffering multipliers."
        ],
        bestPractices: [
          "Lead with speed of exhaustion as evidence of severity.",
          "Pitfall: anchoring on the PIP amount instead of total specials."
        ],
        discussionCase: "How would you phrase John's 48-hour PIP exhaustion in the demand?"
      },
      trainerCue: "Focusing on these financial details lets the case manager argue for the client's rightful compensation."
    },
    { h: "The Valuation Baseline: The EMC and the Benefit Ceiling",
      layout: "COMPARE",
      compareLeft: { label: "Without an EMC", items: ["In many states PIP is capped at $2,500.", "More bills are forced onto the BI settlement, often “eating up” the client's net recovery."] },
      compareRight: { label: "With an EMC", items: ["The full $10,000 is available.", "Fewer unpaid medical liens need to be negotiated down at the end of the case."] },
      fourPart: {
        corePrinciples: [
          "As seen in John Doe's file with Dr. Sarah Spine, the Emergency Medical Condition (EMC) finding is a major negotiation lever."
        ],
        howTo: [
          "Confirm whether a treating physician has documented an EMC.",
          "If yes, the full PIP benefit is available — verify the PIP ledger reflects it.",
          "If no, flag that more bills will fall to the BI settlement and plan lien reductions."
        ],
        bestPractices: [
          "Request the EMC determination early in treatment.",
          "Pitfall: assuming the full PIP limit without an EMC."
        ],
        discussionCase: "Why does an EMC protect the client's net?"
      },
      trainerCue: "Emphasize the strategic importance of the EMC in settlements."
    },
    { h: "The Valuation Baseline: Subrogation vs. Non-Subrogation",
      layout: "COMPARE",
      compareLeft: { label: "Non-Subrogation (Common)", items: ["The PIP carrier cannot ask for its $10,000 back from the BI settlement.", "A win for the client — that money stays in their pocket (via paid bills)."] },
      compareRight: { label: "Subrogation", items: ["The PIP carrier places a lien on the BI settlement.", "The CM must negotiate with the PIP adjuster to reduce that lien so the client keeps more."] },
      fourPart: {
        corePrinciples: [
          "This is the most critical technical detail in a BI negotiation."
        ],
        howTo: [
          "Determine whether the PIP policy/state is subrogation or non-subrogation.",
          "If subrogation — log the lien and plan the reduction negotiation.",
          "If non-subrogation — document that no PIP reimbursement is owed."
        ],
        bestPractices: [
          "Confirm subrogation status in writing from the PIP carrier.",
          "Pitfall: finding a PIP lien after disbursement."
        ],
        discussionCase: "How does a PIP lien change the net sheet?"
      },
      trainerCue: "Understanding these differences is vital for effective negotiation and optimal client outcomes."
    },
    { h: "The Valuation Baseline: Strategic PIP “Exhaustion”",
      fourPart: {
        corePrinciples: [
          "A savvy Case Manager often wants PIP exhausted as quickly as possible on the “hard costs” (ER, Imaging)."
        ],
        howTo: [
          "Why? Once PIP is exhausted, you can move the client to Letters of Protection (LOP) for subsequent treatment (Chiro, PT).",
          "Negotiation Leverage — LOP providers are often more willing to reduce their bills at the end of a case than a hospital is.",
          "By “spending” the PIP money on non-negotiable hospital bills, you preserve the BI settlement funds for the client."
        ],
        bestPractices: [
          "Tip: always verify the PIP Ledger before beginning BI negotiations. If you tell an adjuster the specials are $40k but forget PIP already paid $10k of that, your credibility — and your demand — will be cut down instantly.",
          "Pitfall: using PIP on negotiable treatment while hospital bills stay unpaid."
        ],
        discussionCase: "Which of John's bills should PIP have covered first?"
      },
      trainerCue: "These steps are crucial for effective negotiation on behalf of clients."
    },
    { h: "Negotiations Initiated: The “Battle” — First Call to Low-Ball",
      layout: "PROCESS",
      processSteps: [
        { label: "The “Soft Lead” First Call", desc: "Confirm receipt — point to the MRI on page 14." },
        { label: "Set the Tone", desc: "The file is “Litigation Ready.”" },
        { label: "The Ask", desc: "“What is your opening evaluation?”" },
        { label: "Response to the Low-Ball", desc: "The Professional Pause." }
      ],
      fourPart: {
        corePrinciples: [
          "The negotiations officially begin after sending the Demand Packet to the Adjuster."
        ],
        howTo: [
          "The “Soft Lead” First Call — confirm they received the demand and all records: “Hi, I'm calling regarding the John Doe demand. I want to make sure you saw the MRI report on page 14 specifically.”",
          "Set the Tone — state that the file is “Litigation Ready.”",
          "The Ask — if they haven't made an offer: “Based on the clear liability and the $40k in specials, what is your opening evaluation?”",
          "The Response to the Low-Ball — never get angry. Use the “Professional Pause.” Count to five after they give a low number, then: “I'm struggling to see how that number accounts for the permanent nature of the injury. What data are you using to get there?”"
        ],
        bestPractices: [
          "Make them justify their number with data.",
          "Pitfall: reacting emotionally to a low offer."
        ],
        discussionCase: "Practice the Professional Pause in pairs."
      },
      trainerCue: "Effectively managing these elements establishes a strong foundation for negotiations."
    },
    { h: "Settlement Negotiations: The Bracketing Technique",
      layout: "PROCESS",
      processSteps: [
        { label: "Propose the Logic", desc: "“We're $70k apart…”" },
        { label: "Check Authority", desc: "“Who does?”" },
        { label: "Close the Bracket", desc: "Negotiate the middle." }
      ],
      fourPart: {
        corePrinciples: [
          "When you are at $100k and they are at $30k, the gap feels impossible. Bracketing builds a bridge."
        ],
        howTo: [
          "Propose the Logic — “We are $70k apart. If I can move my Attorney into the $80k range, can you get into the $50k range?”",
          "Check Authority — if they say “I don't have that much,” ask: “Who does? Because if we can't get into the $50s, we are wasting each other's time and should just file the complaint.”",
          "Close the Bracket — once you are both in the $50k–$80k range, negotiate the “middle” (e.g., $65k)."
        ],
        bestPractices: [
          "Make sure decision-makers with authority are involved.",
          "Pitfall: moving your bracket without a reciprocal move."
        ],
        discussionCase: "Bracket a $120k demand against a $35k offer."
      },
      trainerCue: "These strategies bridge the gap and conclude negotiations successfully."
    },
    { h: "Common Adjuster “Stall Tactics” and Rebuttals",
      layout: "TABLE",
      tableHeaders: ["The Stall", "The Rebuttal"],
      tableRows: [
        ["“I'm waiting on my manager's authority.”", "“Understood. I'll give you until Thursday at 4:00 PM. If I don't hear back, I've been instructed to send the file to our litigation department.”"],
        ["“We need more records from 5 years ago.”", "“Those aren't relevant to this acute injury. However, if you want them, I expect an ‘In-Good-Faith’ offer on the current undisputed injuries today.”"],
        ["“The property damage was too low for this injury.”", "“Physics doesn't work that way. Low-velocity impacts often cause high-torque injuries to the spine. We have the MRI to prove it.”"]
      ],
      fourPart: {
        corePrinciples: [
          "Adjusters use “stalls” to wear you down so you accept a lower end-of-month settlement."
        ],
        howTo: [
          "Name the stall.",
          "Set a firm, specific deadline.",
          "Answer with facts (MRI, physics) not emotion.",
          "Insist on an in-good-faith offer on the undisputed injuries."
        ],
        bestPractices: [
          "Stay firm, focused on facts, and professional.",
          "Pitfall: accepting an open-ended “I'll get back to you.”"
        ],
        discussionCase: "Which stall have you heard most, and how did you respond?"
      },
      trainerCue: "Stay firm, focused on facts, and maintain professionalism to keep negotiations on track."
    },
    { h: "Close the Deal: The “Final-Final” and the Paper Trail",
      fourPart: {
        corePrinciples: [
          "The last $2,500 is often the hardest to get."
        ],
        howTo: [
          "The “Split the Baby” Move — “We are at $47k, you're at $43k. Let's meet at $45k, and I'll get the release signed within the hour.”",
          "Confirm the Terms before hanging up — is this for “Bodily Injury” only (save Property Damage for later if not settled)? Does this include all liens? When will the check be mailed?",
          "The “Paper Trail” — immediately email the adjuster: “Per our conversation, we have settled the John Doe matter for $45,000. Please send the release.”"
        ],
        bestPractices: [
          "Never end the call without confirming scope, liens and check timing.",
          "Pitfall: a verbal settlement with no confirming email."
        ],
        discussionCase: "Draft the confirming email for a $45,000 BI-only settlement."
      },
      trainerCue: "These steps are crucial for successful negotiations and confirming agreements."
    },
    { h: "Settlement Negotiations: The “Never” Rule",
      fourPart: {
        corePrinciples: [
          "The “Never” Rule is a vital anchor for confident, assertive negotiation."
        ],
        howTo: [
          "Never apologize for a high demand. It's based on the client's suffering.",
          "Never bid against yourself. If you drop your price, the adjuster must raise theirs before you move again.",
          "Never accept “That's all I have” as the final answer on the first day. Every adjuster has a supervisor with a bigger checkbook."
        ],
        bestPractices: [
          "Patience on day one usually yields better results.",
          "Pitfall: making two moves in a row."
        ],
        discussionCase: "What does “bidding against yourself” look like on a call?"
      },
      trainerCue: "These rules help maintain a strong negotiation stance."
    },
    { h: "Skill Building: The Math Check — Your Slam-Dunk Liability Case",
      skill: { tool: "cmNegotiate2", cms: true },
      fourPart: {
        corePrinciples: [
          "The clock is ticking on the John Doe file. Liability is a total slam dunk because the Apex commercial delivery truck ran a red light.",
          "However, the defense adjuster is trying to starve your client out. They have targeted John's 2018 back strain and his 14-day treatment gap to throw out a lowball, “take-it-or-leave-it” pre-suit offer. Refer to the email exchange and the Demand Packet."
        ],
        howTo: [
          "TASK 1: The Integrity Audit (Accept or Reject?) — audit the real medical and legal ledger. Run the net math against Aggressive Casualty's $45,000.00 counteroffer (Email 2, 05/22/2026 — earlier deck versions used $55,000). Is it legally acceptable, or does it leave your client in the red? Prove it with hard numbers.",
          "⚔️ TASK 2: Break the Adjuster (The Rebuttal) — if the offer fails your audit, you cannot accept it. Continue to negotiate.",
          "The Aggressive Casualty adjuster holds a strict $75,000.00 ceiling. Deploy the Eggshell Plaintiff Doctrine and the Trauma-Induced Dissociative Withdrawal argument to crack their defenses and force them toward your true target range ($180,000.00 – $220,000.00)."
        ],
        bestPractices: [
          "Calculate Total Fees and Liens and the client's Net Recovery before saying a word to the adjuster.",
          "Pitfall: accepting a gross number that nets the client below zero."
        ],
        discussionCase: "Everyone calculates the net on the $45,000 counteroffer — count down 3-2-1 and reveal."
      },
      trainerCue: "“Calculate the Total Fees and Liens if we accept this $45,000.00 offer, and the client's final Net Recovery. When I count down to one, everyone hit enter at the same time. 3… 2… 1… GO!”"
    },
    { h: "BI Settlement — Phase II: The UM/UIM “Safety Check”",
      fourPart: {
        corePrinciples: [
          "If the at-fault driver has low or no insurance, you must tap into the client's own Uninsured/Underinsured Motorist (UM/UIM) coverage.",
          "The Subrogation Waiver (The “Green Light”): if you settle with the at-fault driver and sign their release without a waiver from your client's own insurer, you may destroy your client's right to collect UM/UIM benefits."
        ],
        howTo: [
          "The “30-Day Letter” — send a formal notice to the UM carrier notifying them of the offer.",
          "The Waiver Document — secure a written Waiver of Subrogation from the UM carrier. This proves they have given up their right to sue the driver, allowing you to settle the liability claim and proceed with the UM claim."
        ],
        bestPractices: [
          "Never sign the BI release before the UM waiver is in hand.",
          "Pitfall: settling BI and discovering the UM claim is now barred."
        ],
        discussionCase: "Who must receive the 30-Day Letter, and what's in it?"
      },
      trainerCue: "Taking these steps safeguards the client's rights and compensation potential."
    },
    { h: "BI Settlement: Key Laws & Doctrines",
      layout: "THREEBOX",
      boxes: [
        { label: "The Made Whole Doctrine", desc: "No subrogation recovery unless the client is fully compensated." },
        { label: "The Common Fund Doctrine", desc: "Lienholders reduce by the attorney fee % (usually 33.3%)." },
        { label: "Statute of Limitations (SOL)", desc: "The “death date” for a case." }
      ],
      fourPart: {
        corePrinciples: [
          "Before a settlement can be discussed, the “file” must be bulletproof."
        ],
        howTo: [
          "The Made Whole Doctrine — a health insurer (subrogated carrier) cannot seek claims from a settlement unless the client is “fully compensated.” It can help persuade lienholders to waive claims when the settlement is minor relative to significant injuries.",
          "The Common Fund Doctrine — requires lienholders to reduce their bill by the attorney's fee percentage (usually 33.3%). Logic: they shouldn't get a “free ride” on the work the law firm did to recover the money.",
          "Statute of Limitations (SOL) — the “death date” for a case. CMs must track it religiously; missing it is an automatic malpractice event."
        ],
        bestPractices: [
          "Cite the doctrine by name in every lien reduction request.",
          "Pitfall: letting settlement talks run past the SOL without a filed complaint."
        ],
        discussionCase: "Apply the Common Fund Doctrine to a $9,000 lien."
      },
      trainerCue: "Effectively using these doctrines supports clients' interests in settlement negotiations."
    },
    { h: "The Execution: The Release of All Claims (The “Exit” Document)",
      fourPart: {
        corePrinciples: [
          "This is the most critical document in the file. It is the contract that legally ends the dispute."
        ],
        howTo: [
          "Release of Bodily Injury (BI) — ensure the client isn't accidentally signing away Property Damage (PD) or PIP claims still being negotiated separately.",
          "Non-Admission of Liability — standard releases state the insurer is paying to avoid further litigation, not because they admit their driver was at fault.",
          "Indemnity & Hold Harmless Clause — the claimant (and CM/Attorney) is responsible for paying all medical liens. If a hospital later sues the insurer for an unpaid bill, the claimant must “indemnify” (pay back) the insurer."
        ],
        bestPractices: [
          "Read the release scope line by line before it goes to the client.",
          "Pitfall: a general release that wipes out an open PD claim."
        ],
        discussionCase: "What does the indemnity clause mean for lien tracking?"
      },
      trainerCue: "These clauses are vital for protecting both the client and the legal team."
    },
    { h: "The Execution: Settlement Disclosure Statement (The “Truth” Document)",
      fourPart: {
        corePrinciples: [
          "Often required by state law or internal compliance, this document ensures the claimant understands exactly what is happening."
        ],
        howTo: [
          "“Full and Final” — even if the claimant's back starts hurting again next year, they cannot come back for more money.",
          "Cooling-off Period — some states have a “rescission period” (e.g., 2–3 business days) where a claimant can change their mind after signing. The CM must track this date before cutting checks."
        ],
        bestPractices: [
          "Docket the rescission deadline and don't disburse before it passes.",
          "Pitfall: cutting checks during the cooling-off period."
        ],
        discussionCase: "How would you explain “full and final” to a nervous client?"
      },
      trainerCue: "Understanding these elements promotes transparency and trust in the settlement process."
    },
    { h: "The Execution: Lien Payoff Letters (The “Verification” Paperwork)",
      fourPart: {
        corePrinciples: [
          "A CM cannot rely on a medical bill alone; they need a formal “Final Demand” or “Payoff Letter.”"
        ],
        howTo: [
          "Medicare Final Demand — if the claimant is 65+ or on SSDI, CMS (Centers for Medicare & Medicaid Services) issues a final demand. Warning: it can take 60+ days; keep the file “pended” until it is in hand.",
          "Satisfaction of Lien — once a provider (chiropractor, surgeon) is paid, obtain a signed letter stating the lien is “Satisfied.” This prevents the provider from sending the client to collections later."
        ],
        bestPractices: [
          "No payoff letter, no payment.",
          "Pitfall: paying from a statement instead of a final payoff figure."
        ],
        discussionCase: "What language must a Satisfaction of Lien include?"
      },
      trainerCue: "This ensures a smooth settlement process."
    },
    { h: "The Execution: The Settlement Statement (The “Net” Sheet)",
      fourPart: {
        corePrinciples: [
          "This is the ledger that breaks down “Gross to Net.” As a CM, you are auditing it for accuracy."
        ],
        howTo: [
          "Cost Verification — ensure “Case Costs” (e.g., $50 for police reports, $200 for medical records) are backed by receipts.",
          "The “Net to Client” — the final number the client actually receives. Ensure it is sufficient to cover any future medical needs discussed during the treatment phase."
        ],
        bestPractices: [
          "Accurate financial detail builds client trust.",
          "Pitfall: costs on the statement with no receipt."
        ],
        discussionCase: "What would you do if the net doesn't cover future care?"
      },
      trainerCue: "Accurate financial details build client trust and uphold the settlement process's integrity."
    },
    { h: "The Execution: The Dismissal (The “Court” Filing)",
      layout: "COMPARE",
      compareLeft: { label: "Dismissal with Prejudice", items: ["The case is closed and cannot be refiled.", "The language the CM should verify for total file closure."] },
      compareRight: { label: "Dismissal without Prejudice", items: ["Rare in settlements.", "Allows the case to be refiled under specific conditions."] },
      fourPart: {
        corePrinciples: [
          "If the case was already in litigation (a lawsuit was filed), the settlement is not over until the court is notified."
        ],
        howTo: [
          "Confirm whether a lawsuit is pending.",
          "Prepare the Stipulation to Dismiss for the attorneys' signatures.",
          "Verify “With Prejudice” is the language used to ensure total file closure."
        ],
        bestPractices: [
          "Docket the dismissal filing and confirm the court entry.",
          "Pitfall: forgetting to dismiss a pending suit after settlement."
        ],
        discussionCase: "Why does “with prejudice” matter to the defense?"
      },
      trainerCue: "Ensuring the correct dismissal type is crucial for final case closure."
    },
    { h: "The Execution: W-9 & Comparison of Key Post-Settlement Documents",
      layout: "TABLE",
      tableHeaders: ["Document", "Who Signs?", "Why it matters"],
      tableRows: [
        ["Release", "Claimant", "Legally ends the dispute; defines what is released."],
        ["Final Demand", "Lienholder (Medicare/Hospital)", "The verified payoff amount — no guessing."],
        ["W-9", "Payee (Law Firm/Claimant)", "Carriers won't issue the check without it."],
        ["Stipulation to Dismiss", "Attorneys", "Notifies the court the case is over."]
      ],
      fourPart: {
        corePrinciples: [
          "Many insurance carriers will not issue a settlement check until they have a W-9 Form from the law firm or the claimant.",
          "If the CM doesn't request it the moment the verbal agreement is made, the check will be delayed by at least a week."
        ],
        howTo: [
          "Request the W-9 the moment the verbal agreement is made.",
          "Match each post-settlement document to its signer.",
          "Track every document to “received” in the CMS."
        ],
        bestPractices: [
          "Send the W-9 with the signed release to avoid accounting holds.",
          "Pitfall: waiting until the carrier asks for the W-9."
        ],
        discussionCase: "Which post-settlement document is most often late, and why?"
      },
      trainerCue: "Obtaining a W-9 promptly ensures a smooth transition from settlement to payment."
    },
    { h: "Finalized Settlement: Boots-on-the-Ground Tasks — Administrative Document Control",
      fourPart: {
        corePrinciples: [
          "Once the settlement is finalized, the CM enters the “Technical Closing” stage. Your mission: move the file from “Settled” to “Paid & Archived” while ensuring total compliance."
        ],
        howTo: [
          "The Signature Chase — send the Release of All Claims via secure e-signature (like DocuSign) or schedule an in-person signing.",
          "Notary Coordination — if the release requires a notary (common for high-value BI claims), verify the notary's stamp is current and the ID matches the claimant exactly.",
          "W-9 Procurement — immediately collect a W-9 from the claimant or the firm to prevent the carrier's accounting department from “flagging” the payment."
        ],
        bestPractices: [
          "Check name spelling on the release against the claimant's ID.",
          "Pitfall: an expired notary stamp that voids the release."
        ],
        discussionCase: "What could make a notarized release get rejected?"
      },
      trainerCue: "These steps ensure compliance and a smooth settlement process."
    },
    { h: "Finalized Settlement: Final Lien Mitigation (The “Reduction”)",
      fourPart: {
        corePrinciples: [
          "Final lien mitigation directly increases the client's net recovery."
        ],
        howTo: [
          "Provider Negotiation — call the billing departments of all lienholders. The Script: “The settlement was lower than expected. In the interest of global resolution, will you accept 50% of the balance as payment in full?”",
          "Update the Ledger — immediately reflect any “savings” or reductions in the Settlement Statement to show the client their net recovery is increasing.",
          "Medicare/Medicaid Finalization — log into the MSPRP (Medicare Secondary Payer Recovery Portal) to ensure the “Final Demand” matches your internal ledger."
        ],
        bestPractices: [
          "Transparency about savings builds trust and shows your value.",
          "Pitfall: agreeing to a reduction verbally with no written confirmation."
        ],
        discussionCase: "Role-play the 50% reduction script with a hospital billing rep."
      },
      trainerCue: "Negotiate gently but firmly; reflect every saving in the ledger; align MSPRP with the internal ledger."
    },
    { h: "Skill Building: BI Settlement — Caught in an Operational Pincer Movement",
      skill: { tool: "cmNegotiate2", cms: true },
      fourPart: {
        corePrinciples: [
          "Liability for John Doe is clear: Apex Delivery Services' vehicle ran a red light, T-boning John's vehicle and causing significant structural damage that required mechanical extrication.",
          "Aggressive Casualty has been pressuring you, targeting John's 2018 workplace lumbar strain and a 14-day treatment gap to justify a low, “take-it-or-leave-it” offer. The team set a conservative target for basic medical specials.",
          "Prior to client signing, issues emerge — the client is furious. Dr. Spine reports permanent nerve damage: a 5% Whole Person Impairment rating indicating an irreversible neurological deficit.",
          "Adjuster's pressure: “I need the signed release emailed to me in 5 minutes, or I am revoking the $100,000 policy limits tender permanently.” The clock is ticking."
        ],
        howTo: [
          "What is your exact step-by-step action plan right now to save the file, save the client, and save the firm from a malpractice suit?",
          "Provide the specific verbal script for de-escalating John Doe regarding a bankrupt defendant.",
          "Provide the action plan to mitigate a pending malpractice lawsuit.",
          "Provide the precise statutory measure to counter the adjuster's 5-minute revocation threat."
        ],
        bestPractices: [
          "Do not let the client sign under a 5-minute ultimatum with new permanent-injury evidence.",
          "Document every communication and decision.",
          "Pitfall: anchoring to the old conservative target after the WPI rating arrives."
        ],
        discussionCase: "Groups present their action plans; compare the statutory measures chosen."
      },
      trainerCue: "Key facts: John is about to sign a $100,000 release; new evidence shows permanent nerve damage and 5% WPI; Apex has a $1,000,000 commercial policy but the team anchored low; Apex is out of business, leaving only the policy. Plan: calmly explain the new findings, advise against signing, request an extension citing new evidence, prepare to file suit, document everything."
    }
  ],
  quickChecks: [
    { afterIndex: 2, q: "The Trinity of Case Alignment is:", opts: ["Narrative, Physicality, Medicals", "Police, Witness, Photos", "Specials, Generals, Punitives", "PIP, BI, UM"], a: 0, r: "If one pillar is out of alignment, case value collapses." },
    { afterIndex: 19, q: "PIP paid $10,000 of a $60,000 gross value. The defendant's remaining liability is:", opts: ["$60,000", "$50,000", "$70,000", "$10,000"], a: 1, r: "Gross Settlement Value − PIP Paid = Defendant's Remaining Liability." },
    { afterIndex: 28, q: "“Never bid against yourself” means:", opts: ["Never make an offer", "If you drop your price, the adjuster must raise theirs before you move again", "Always accept the first offer", "Only the attorney negotiates"], a: 1, r: "One of the three “Never” rules." }
  ],
  quiz: [
    { q: "Pre-demand auditing is also called:", opts: ["A Forensic Case Audit or Pre-Litigation Audit", "A trial binder", "A net sheet", "A dismissal"], a: 0, r: "It vets evidence and value before the demand letter." },
    { q: "Without both an employer letter and a doctor's disability slip, adjusters usually:", opts: ["Pay the lost wage claim anyway", "Reject the lost wage claim", "Double it", "Ask for tax returns only"], a: 1, r: "Both documents are needed." },
    { q: "“Statement drift” refers to:", opts: ["A witness's story changing over time", "A bank statement error", "A delay in the police report", "A PD supplemental"], a: 0, r: "Audit witness statements for drift." },
    { q: "MIST stands for:", opts: ["Minor Impact Soft Tissue", "Medical Injury Settlement Tracker", "Mandatory Insurance Statement Test", "Motor Impact Severity Table"], a: 0, r: "PD under $1,000–$2,000 often gets a MIST label." },
    { q: "Once a client reaches MMI, the demand should go out within:", opts: ["7 days", "30 days", "90 days", "1 year"], a: 1, r: "The 30-Day Rule." },
    { q: "A demand is best described as:", opts: ["A request for money", "A presentation of a debt owed", "A formality", "A settlement agreement"], a: 1, r: "Treat the insurer like a bank that hasn't paid its bill." },
    { q: "John Doe exhausting $10,000 PIP within 48 hours signals:", opts: ["Fraud", "A high-severity case", "Low value", "Nothing"], a: 1, r: "Speed of exhaustion is a severity signal." },
    { q: "Without an EMC, many states cap PIP at:", opts: ["$2,500", "$10,000", "$25,000", "$100,000"], a: 0, r: "With an EMC the full $10,000 is available." },
    { q: "Under subrogation, the PIP carrier:", opts: ["Cannot recover anything", "Places a lien on the BI settlement", "Pays the client twice", "Pays attorney fees"], a: 1, r: "The CM negotiates that lien down." },
    { q: "The Common Fund Doctrine requires lienholders to:", opts: ["Be paid first in full", "Reduce their bill by the attorney's fee percentage", "Waive all liens", "Sue the defendant"], a: 1, r: "They shouldn't get a free ride on the firm's work." },
    { q: "Before signing a BI release on a low-limits case you must secure:", opts: ["A W-9 only", "A written Waiver of Subrogation from the UM carrier", "A dismissal", "A mediation binder"], a: 1, r: "Otherwise you may destroy the UM/UIM claim." },
    { q: "A cooling-off (rescission) period means:", opts: ["The adjuster can revoke", "The claimant may change their mind for a short period after signing — track it before cutting checks", "The attorney takes a break", "Liens are paused"], a: 1, r: "Often 2–3 business days." },
    { q: "For a 65+ claimant, CMS's Medicare Final Demand can take:", opts: ["1 day", "60+ days — keep the file pended", "1 week", "It isn't needed"], a: 1, r: "Don't disburse until it's in hand." },
    { q: "Which dismissal ensures the case cannot be refiled?", opts: ["Without prejudice", "With prejudice", "Voluntary", "Default"], a: 1, r: "Verify “With Prejudice” language." },
    { q: "The response to “The property damage was too low for this injury” is:", opts: ["Agree and lower the demand", "“Physics doesn't work that way — low-velocity impacts can cause high-torque spinal injuries; we have the MRI.”", "Hang up", "Ask for PD photos from them"], a: 1, r: "Answer with facts and the MRI." }
  ],
  discussionQuestion: "Aggressive Casualty counters at $45,000 “take it or leave it” on John Doe. Walk through the net sheet out loud: does the client net anything? What is your next sentence to the adjuster?"
};
