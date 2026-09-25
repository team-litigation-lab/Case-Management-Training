const DAY3 = {
  id: 3,
  title: "UM Demand, UM Settlement, Lien Reduction & Disbursement",
  theme: "Why the UM Phase Matters · BI Exhaustion & Consent · The UM Demand Package · UM Settlement & the Offset Rule · Documents that Matter · Types of Liens · Reduction Doctrines · Quantum Meruit · The Net Sheet · Disbursement & Final Case Reconciliation",
  objective: "Pivot from BI exhaustion to a first-party UM/UIM demand, negotiate the UM settlement, reduce every lien with the right doctrine, build a combined BI/UM net sheet, and disburse and reconcile a file to a zero balance before archiving.",
  lessons: [
    { h: "Training Agenda & Why the UM Phase Matters",
      fourPart: {
        corePrinciples: [
          "Agenda: 01 Case Phase — UM · 02 Case Phase — UM Settlement · 03 Lien Negotiations, Reduction Phase.",
          "Many junior case managers think their job is done when a high settlement number is reached. The gross settlement amount doesn't matter to the client — only the net check matters."
        ],
        howTo: [
          "The Reality — a $50,000 settlement with $45,000 in un-reduced medical liens means the client walks away with practically nothing after attorney fees.",
          "The Goal — the case manager's efficiency in this phase directly dictates whether a client leaves happy or files a bar complaint."
        ],
        bestPractices: [
          "Measure your success by the client's net, not the gross.",
          "Pitfall: celebrating a gross number before liens are reduced."
        ],
        discussionCase: "Why would a “big” settlement produce a bar complaint?"
      },
      trainerCue: "When the at-fault insurer reaches its policy limit we enter BI Exhaustion and file a UM demand with the client's own insurer — a new phase in the PI case."
    },
    { h: "Beyond Organization: The UM Demand Strategy",
      layout: "COMPARE",
      compareLeft: { label: "The Old Mindset", items: ["“My job is to gather medical records, staple them to a demand letter, and mail them to the adjuster.”"] },
      compareRight: { label: "The Master Mindset", items: ["In the UM phase you are no longer just organizing paperwork — you are building an undeniable legal trap."] },
      fourPart: {
        corePrinciples: [
          "The UM (Uninsured/Underinsured Motorist) Demand Phase is crucial for clients seeking funds after accidents with underinsured drivers — a financial safety net.",
          "Insurance companies frequently resist full payouts; failure in this phase can mean financial loss for clients and malpractice risk for law firms."
        ],
        howTo: [
          "Shift from organizing paperwork to building the legal trap.",
          "Front-load proof the contract has been triggered.",
          "Present damages that clearly exceed what was collected."
        ],
        bestPractices: [
          "The Bottom Line: if you build this trap correctly, the insurance company is backed into a corner and has no choice but to pay the policy limits.",
          "Pitfall: treating the client's own insurer as friendly."
        ],
        discussionCase: "What is the “trap” in a UM demand?"
      },
      trainerCue: "Key steps: finalize the BI settlement, get written consent to settle from our UM carrier, and verify exhaustion via the dec page or sworn affidavit."
    },
    { h: "BI Exhaustion & Consent — Mechanic 1: Locking the Escape Hatches",
      fourPart: {
        corePrinciples: [
          "When the at-fault party's insurance pays its full policy limit but damages exceed that amount, you “exhaust” their policy and pivot to your own carrier to make up the difference.",
          "Filing a UM/UIM Demand occurs after settling the primary Bodily Injury (BI) claim — a distinct second phase in a PI case.",
          "Insurance adjusters love technicalities. Your job is to kill those excuses on page one."
        ],
        howTo: [
          "Front-Load the Proof — place the third-party declaration sheet, the signed liability release, and the UIM carrier's written Consent to Settle form at the absolute front of your packet.",
          "The Result — you strip the adjuster of their favorite defense (claiming the client breached the contract) and prove the contract trigger has been pulled."
        ],
        bestPractices: [
          "Consent to Settle must be written — and obtained before the BI release is signed.",
          "Pitfall: burying the exhaustion proof at the back of the packet."
        ],
        discussionCase: "Which three documents go on page one of the UM packet?"
      },
      trainerCue: "Verify the at-fault driver's policy limits are exhausted using the declarations page or a sworn affidavit."
    },
    { h: "The UM Demand Package: Turning Risk Management Against the Insurer",
      fourPart: {
        corePrinciples: [
          "You will perform a comprehensive audit similar to the one conducted in BI Demand.",
          "Once the BI case is closed, you assign a task to your Demand Specialist to create a new demand to the client's own insurance company.",
          "When hard medical debt drastically exceeds the available policy limits, the adjuster faces a dangerous business dilemma."
        ],
        howTo: [
          "The Bad-Faith Trap — if they refuse to pay policy limits in the face of undisputed, overwhelming damages, they expose their company to a first-party bad-faith lawsuit.",
          "The Ultimate Leverage — they must choose between paying a capped policy limit today or risking uncapped exposure in front of a jury tomorrow.",
          "Show damages exceed the BI settlement: e.g., total claim $100,000 − BI settlement $25,000 = UM demand seeks the remaining $75,000."
        ],
        bestPractices: [
          "Assign the UM demand as a tracked task in the CMS the day BI closes.",
          "Pitfall: re-sending the BI demand unchanged."
        ],
        discussionCase: "What makes the bad-faith risk real to the adjuster?"
      },
      trainerCue: "Thorough documentation strengthens the claim against insurance challenges."
    },
    { h: "UM Demand: Investigation & Evaluation — The Weak File vs. The Legal Trap",
      layout: "TABLE",
      tableHeaders: ["The Weak File", "The Legal Trap"],
      tableRows: [
        ["Sending 300 pages of raw, messy chiropractic charts.", "Sending a 2-page summary matching clear diagnostic codes to specific treatments."],
        ["A casual cover letter: “Our client hurts, please pay the limits.”", "A formal package detailing a $40,000 surgical recommendation alongside a strict 30-day clock."],
        ["Result: a $3,500 lowball offer because the file carries no legal risk.", "Result: a full policy-limits payout because the insurer's legal risk is too high."]
      ],
      fourPart: {
        corePrinciples: [
          "Even though they are your client's own insurance company, they now become “adversarial.”"
        ],
        howTo: [
          "Expect scrutiny of medical history for pre-existing conditions.",
          "Expect a possible Independent Medical Exam (IME) request.",
          "Expect a liability check verifying the other driver's fault."
        ],
        bestPractices: [
          "Summaries with diagnostic codes beat record dumps.",
          "Pitfall: a cover letter with no deadline."
        ],
        discussionCase: "Convert a weak cover letter into a legal-trap cover letter."
      },
      trainerCue: "Be prepared for challenges — adjusters may adopt an adversarial stance."
    },
    { h: "UM Demand: The Demand Packet — Document Inclusions",
      layout: "QUADRANT",
      quadrants: [
        { label: "Evidence of Liability", desc: "Police/crash report · PD photos · witness statements · dashcam/surveillance (if available)." },
        { label: "Economic Damages", desc: "Itemized medical bills · complete medical records · lost wage verification · future medical estimates." },
        { label: "Non-Economic Damages", desc: "The demand letter · impact statement · photos of injuries." },
        { label: "Proof of Exhaustion", desc: "Settlement release · check copy · at-fault declaration page · consent to settle letter." }
      ],
      fourPart: {
        corePrinciples: [
          "To secure a UM settlement, your demand package must show the other driver's fault and that the damages exceed what you've collected."
        ],
        howTo: [
          "Evidence of Liability",
          "Economic Damages",
          "Non-Economic Damages",
          "Proof of Exhaustion"
        ],
        bestPractices: [
          "A well-structured packet builds a narrative that damages exceed what was collected.",
          "Pitfall: missing the check copy or release — the exhaustion proof."
        ],
        discussionCase: "Which inclusion is most often forgotten?"
      },
      trainerCue: "A well-structured demand packet is crucial for advocating for full compensation."
    },
    { h: "UM Settlement: How the Settlement Is Calculated",
      layout: "TABLE",
      tableHeaders: ["Component", "Example"],
      tableRows: [
        ["Total Case Value", "$100,000"],
        ["BI Settlement Received", "− $25,000"],
        ["UM Settlement Goal (the “gap”)", "$75,000"]
      ],
      fourPart: {
        corePrinciples: [
          "Because you are now negotiating with your client's own insurance company, the dynamic shifts from a third-party claim to a first-party contract claim.",
          "A UM Settlement is the second half of your client's recovery process.",
          "The UM insurer doesn't just pay your client's policy limit; they pay the “gap” between total damages and what was already collected."
        ],
        howTo: [
          "Establish total case value with documentation.",
          "Subtract what was collected from the at-fault driver.",
          "Demand the gap (subject to the UM limit and offset rules)."
        ],
        bestPractices: [
          "Document every dollar of damages so the gap is undeniable.",
          "Pitfall: demanding the UM limit without showing the gap."
        ],
        discussionCase: "Total $80,000, BI $30,000 — what is the UM goal?"
      },
      trainerCue: "Next we'll discuss how the Offset rule impacts calculations and potential recoveries."
    },
    { h: "UM Settlement: Negotiation & Settlement",
      layout: "PROCESS",
      processSteps: [
        { label: "The Offer", desc: "The initial offer is rarely the full demand." },
        { label: "Back-and-Forth", desc: "Negotiate toward the true value of remaining damages." },
        { label: "Resolution", desc: "Most UM claims end with a supplemental settlement check." }
      ],
      fourPart: {
        corePrinciples: [
          "Even though they are your client's own insurance company, they now become “adversarial.”"
        ],
        howTo: [
          "The Offer — the adjuster makes an initial offer; it is rarely the full amount of the demand.",
          "Back-and-Forth — CMs negotiate to move the claim closer to the actual value of the remaining damages.",
          "Resolution — most UM claims end here with a supplemental settlement check."
        ],
        bestPractices: [
          "Patience and documentation win UM negotiations.",
          "Pitfall: accepting the first offer because “it's our own insurer.”"
        ],
        discussionCase: "What evidence moves a UM adjuster most?"
      },
      trainerCue: "This phase highlights the importance of informed negotiation and documentation."
    },
    { h: "UM Settlement: The “Offset” Rule & the Timeline",
      layout: "PROCESS",
      processSteps: [
        { label: "Demand Phase", desc: "Evidence already collected in BI." },
        { label: "Evaluation", desc: "Carrier reviews; may request IME." },
        { label: "Negotiation", desc: "Offer and counter." },
        { label: "Total Time", desc: "Usually faster than BI." }
      ],
      fourPart: {
        corePrinciples: [
          "In many states, the client's insurer may “offset” (subtract) the BI settlement from their UM limits.",
          "Example: a $50,000 UM policy with $25,000 already recovered from BI may leave only $25,000 in “room,” unless the client has “Add-ons” or “Stacked” coverage."
        ],
        howTo: [
          "Check the state's offset rule.",
          "Check the policy for add-on or stacked coverage.",
          "Calculate the realistic room left before demanding.",
          "Set client expectations on the timeline: once BI settles, UM can move quickly because records and police reports are already collected."
        ],
        bestPractices: [
          "Always look for stacking and resident-relative household policies.",
          "Pitfall: promising the client the full UM limit on an offset state."
        ],
        discussionCase: "$100,000 UM limit, $50,000 BI recovered, offset state — what's the room?"
      },
      trainerCue: "The timeline — Demand, Evaluation, Negotiation, Resolution — helps set realistic client expectations."
    },
    { h: "UM Settlement: Challenges",
      fourPart: {
        corePrinciples: [
          "Even though the client is their customer, the insurance company will look for reasons to pay less."
        ],
        howTo: [
          "The “Value” Dispute — they may agree the client is hurt but argue the case is only worth $40,000 total; with $25,000 already from BI, they'll offer only $15,000.",
          "MMI (Maximum Medical Improvement) — they may wait to settle until treatment is finished so no more bills are coming.",
          "Subrogation & Liens — the client's health insurance or a provider may have a lien on the settlement; these must be negotiated down so the client keeps more."
        ],
        bestPractices: [
          "Counter value disputes with objective evidence (MRI, WPI rating, future care costs).",
          "Pitfall: ignoring liens until the UM check arrives."
        ],
        discussionCase: "How do you counter a $40,000 “total value” position?"
      },
      trainerCue: "Understanding these complexities is essential for effective negotiation."
    },
    { h: "UM Settlement: The Final Payout Process",
      layout: "PROCESS",
      processSteps: [
        { label: "The UM Release", desc: "Client releases their own insurer for this accident." },
        { label: "The Check", desc: "Usually payable to the client and the law firm." },
        { label: "Disbursement", desc: "Trust account → liens, fees, net check to client." }
      ],
      fourPart: {
        corePrinciples: [
          "Once CMs agree on a number, the closing steps are the UM Release, the Check, and Disbursement."
        ],
        howTo: [
          "The UM Release — the client signs a document releasing their insurance company from further liability for this specific accident.",
          "The Check — the insurer issues a check, usually made out to both the client and the law firm.",
          "Disbursement — funds go into a trust account to pay medical liens and legal fees, then the final “net” check is issued to the client."
        ],
        bestPractices: [
          "Note: because this is a first-party claim, if the insurer acts unreasonably (ignoring evidence or refusing to communicate), there may be grounds for a Bad Faith claim — sometimes resulting in compensation above policy limits.",
          "Pitfall: depositing the check before the release is fully executed."
        ],
        discussionCase: "What behavior would support a bad-faith claim?"
      },
      trainerCue: "Settlement agreement, check issuance, trust account and bad-faith awareness are the key steps."
    },
    { h: "Documents that Matter: Threshold & Coverage Documents",
      fourPart: {
        corePrinciples: [
          "The UM/UIM Settlement Phase needs documentation on coverage eligibility, the other driver's liability, and damage valuation — organized by function."
        ],
        howTo: [
          "The Insurance Declarations Page (“Dec Page”) — verifies the client actually has UM/UIM coverage and establishes the upper limit of what can be demanded (e.g., John Doe's $100,000 policy limit).",
          "Proof of Uninsured Status — documents establishing the at-fault driver had no insurance: a DMV letter of suspension, an official denial letter from the tortfeasor's supposed carrier, or a police report noting the driver fled (“phantom vehicle”).",
          "Third-Party Policy Exhaustion Ledger (UIM claims only) — a copy of the check or formal release proving you exhausted the at-fault driver's lower liability limits."
        ],
        bestPractices: [
          "Get the dec page before you promise anything about UM.",
          "Pitfall: a UIM claim with no proof of exhaustion."
        ],
        discussionCase: "What proves “uninsured” in a hit-and-run?"
      },
      trainerCue: "Coverage eligibility documents are the threshold — without them there is no UM claim."
    },
    { h: "Documents that Matter: Liability & Causation Documents",
      fourPart: {
        corePrinciples: [
          "Liability and causation must still be proven in a first-party claim."
        ],
        howTo: [
          "Official Police Accident Report — the baseline document establishing crash mechanics, citations issued to the uninsured driver, and initial scene observations.",
          "Scene and Property Damage Photographs — visual evidence of impact severity. High structural damage (frame bending, airbag deployment) defeats the argument that the impact was too minor to cause severe injury.",
          "Witness Statements / Affidavits — neutral third-party accounts supporting your version of liability; highly critical in phantom-vehicle/hit-and-run cases."
        ],
        bestPractices: [
          "Pair PD photos with the injury narrative.",
          "Pitfall: relying on the client's account alone in a hit-and-run."
        ],
        discussionCase: "Why are witness affidavits critical in phantom-vehicle cases?"
      },
      trainerCue: "Liability & causation documents defeat the ‘too minor to cause injury’ argument."
    },
    { h: "Documents that Matter: Special Damages Documents (Economic Hard Costs)",
      fourPart: {
        corePrinciples: [
          "Special damages are the hard, provable costs."
        ],
        howTo: [
          "Itemized Medical Billing Statements — complete, line-item bills from every provider (hospitals, imaging centers, chiropractors, etc.) to calculate the exact total of medical specials.",
          "Wage Loss Verification (WLV) — completed by the employer confirming missed time, hourly pay rates, and total lost earnings resulting directly from the accident.",
          "Prior Lien Ledgers — up-to-date statements from health insurers or subrogation companies (Medicare, private plans) detailing what has already been paid out — necessary for the final net distribution."
        ],
        bestPractices: [
          "Itemized means line-item — not balance-forward statements.",
          "Pitfall: stale lien ledgers."
        ],
        discussionCase: "What's missing if you only have balance-forward statements?"
      },
      trainerCue: "Economic hard costs anchor the valuation."
    },
    { h: "Documents that Matter: General Damages Documents (Non-Economic Value)",
      fourPart: {
        corePrinciples: [
          "General damages need objective support too."
        ],
        howTo: [
          "Diagnostic Medical Reports (MRI, CT, X-Ray) — objective data that conclusively proves internal, physiological injuries (such as an acute disc herniation).",
          "Expert Medical Narrative & Permanency Rating — a definitive summary from the treating physician (e.g., Dr. Spine) outlining future care needs and explicit causation linking the injury to the crash.",
          "A formal Whole Person Impairment (WPI) rating — the single biggest weapon to counter “pre-existing condition” defenses."
        ],
        bestPractices: [
          "Request the WPI rating as soon as the client nears MMI.",
          "Pitfall: a narrative that doesn't state causation explicitly."
        ],
        discussionCase: "Why is a WPI rating so powerful against pre-existing defenses?"
      },
      trainerCue: "The WPI rating is the single biggest weapon against pre-existing condition defenses."
    },
    { h: "Documents that Matter: Final Pleading & Release Documents (Closing Phase)",
      fourPart: {
        corePrinciples: [
          "The closing documents turn negotiation into a binding result."
        ],
        howTo: [
          "The Formal UM Demand Letter — the comprehensive legal argument tying facts, diagnostics, and case law together, concluding with a formal, time-sensitive financial demand (e.g., a 10-day limit to tender policy limits before triggering bad faith).",
          "UM Release and Trust Agreement — the final contract provided once a settlement is reached: in exchange for the funds, the client releases their own insurer and agrees to protect the insurer's rights if the uninsured motorist is ever sued in the future."
        ],
        bestPractices: [
          "Docket the tender deadline in the demand letter.",
          "Pitfall: a demand letter with no time limit."
        ],
        discussionCase: "What does the trust agreement obligate the client to do?"
      },
      trainerCue: "The formal demand with a clock and the release/trust agreement close the UM phase."
    },
    { h: "Skill Building: UM Settlement — The Bad-Faith Arbitrage & the Permanent Deficit",
      skill: { tool: "cmLien3", cms: true },
      fourPart: {
        corePrinciples: [
          "The Scenario (hypothetical variation of the John Doe file): liability is clear, but here John was hit by a completely uninsured motorist and you are pursuing a claim under a $100,000 UM limit. (John's real Local Farm Mutual dec page shows UM/UIM $250,000/$500,000 — always work from the dec page on file.)",
          "Defense Tactics: they leveraged a 2018 lumbar strain and a 14-day treatment gap to offer a low $42,000.",
          "The Pressure: the adjuster demands verbal acceptance of $42,000 right now or they will permanently revoke the offer and force a lengthy arbitration.",
          "The Twist: Dr. Spine's final report just arrived, confirming an acute L4-L5 herniation, a 5% Whole Person Impairment (WPI) rating, and permanent nerve damage caused entirely by the crash."
        ],
        howTo: [
          "Discuss your step-by-step action plan.",
          "Decide what you say to the adjuster right now.",
          "Decide what you send, and by when (time-limited demand).",
          "Decide how you protect the client and the firm (bad-faith posture, documentation)."
        ],
        bestPractices: [
          "New permanent-injury evidence changes the valuation — use it.",
          "Pitfall: accepting verbally under pressure."
        ],
        discussionCase: "Groups present action plans and the exact line they'd say to the adjuster."
      },
      trainerCue: "Guide trainees toward rejecting the pressure, serving the new medical evidence with a time-limited policy-limits demand, and documenting the insurer's conduct for bad faith."
    },
    { h: "Lien Negotiations/Reduction: Common Types of Liens",
      layout: "TABLE",
      tableHeaders: ["Lien Type", "Description", "Reduction difficulty"],
      tableRows: [
        ["Medical Providers", "Doctors or hospitals who treated the client, often under a “letter of protection” (LOP).", "High priority — often willing to settle for less for immediate payment."],
        ["Health Insurance", "Private insurers (BlueCross, Kaiser, etc.) seeking reimbursement through subrogation.", "Moderate — governed by “Made Whole” or “Common Fund” doctrines."],
        ["Medicare/Medicaid", "Government-funded programs with statutory recovery rights.", "Low — strict processing formulas; time-consuming."],
        ["ERISA Plans", "Self-funded employer health plans governed by federal law.", "Very low — federal law makes them hard to reduce."],
        ["Workers' Comp", "If the injury happened while on the job, the WC carrier has a lien on third-party settlements.", "Moderate — affected by the third-party settlement."]
      ],
      fourPart: {
        corePrinciples: [
          "Not all liens are created equal. Some have stronger legal backing (statutory) than others (contractual)."
        ],
        howTo: [
          "Identify every lien type on the file.",
          "Classify statutory vs. contractual.",
          "Prioritize negotiations by how reducible each lien is."
        ],
        bestPractices: [
          "Start with the most negotiable liens to build momentum.",
          "Pitfall: treating an ERISA plan like a provider LOP."
        ],
        discussionCase: "Rank John's liens from most to least reducible."
      },
      trainerCue: "Understanding these distinctions aids effective lien negotiation strategy."
    },
    { h: "Key Legal Doctrines Used for Reduction",
      layout: "THREEBOX",
      boxes: [
        { label: "The Common Fund Doctrine", desc: "The attorney did the work — lienholders share the fee." },
        { label: "The “Made Whole” Doctrine", desc: "No lien recovery unless the plaintiff is fully compensated." },
        { label: "Comparative Fault", desc: "Plaintiff 20% at fault → reduce the lien by 20%." }
      ],
      fourPart: {
        corePrinciples: [
          "Attorneys use specific legal arguments to force lienholders to take less than the full amount."
        ],
        howTo: [
          "The Common Fund Doctrine — since the attorney did all the work to secure the settlement, the lienholder should contribute to the legal fees.",
          "The “Made Whole” Doctrine — in many jurisdictions, a lienholder cannot collect anything unless the plaintiff has been “made whole” (fully compensated for all damages, including pain and suffering).",
          "Comparative Fault — if the settlement was reduced because the plaintiff was 20% at fault, argue the lien should also be reduced by 20%."
        ],
        bestPractices: [
          "Name the doctrine and show the math in every reduction request.",
          "Pitfall: asking for a “courtesy discount” with no legal basis."
        ],
        discussionCase: "Apply comparative fault to a $10,000 lien at 25% fault."
      },
      trainerCue: "These strategies maximize client recovery and ensure fair distribution of settlement funds."
    },
    { h: "Quantum Meruit Principle — Prior Attorney Liens",
      layout: "COMPARE",
      compareLeft: { label: "The Client's Right", items: ["A client has an absolute right to fire their lawyer at any time."] },
      compareRight: { label: "The Lawyer's Right", items: ["A lawyer should be compensated for the benefit they provided to the case before being let go."] },
      fourPart: {
        corePrinciples: [
          "Quantum Meruit (“as much as he has deserved”) assesses the reasonable value of services when no valid contract exists — e.g., when a lawyer is dismissed before a case settles.",
          "Most PI cases use a contingency fee (e.g., 33%). A dismissed attorney cannot claim that fee; instead they file a Quantum Meruit lien for the work completed while on the case."
        ],
        howTo: [
          "Request the prior attorney's time records.",
          "Separate legal work from clerical/overhead work.",
          "Value only the benefit actually provided to the case.",
          "Negotiate the lien from that reasonable value."
        ],
        bestPractices: [
          "Challenge clerical hours billed as legal work.",
          "Pitfall: paying a prior attorney a percentage fee they're no longer entitled to."
        ],
        discussionCase: "A prior attorney bills 8 hours of clerical work. What do you argue?"
      },
      trainerCue: "The doctrine balances a client's right to dismiss their lawyer with the lawyer's right to fair compensation."
    },
    { h: "Increasing the Client's Net",
      fourPart: {
        corePrinciples: [
          "A Case Manager's job is 50% getting money from the insurance and 50% keeping it from the providers."
        ],
        howTo: [
          "The “Pro-Rata” Argument — tell providers: “The total settlement is $X. If you don't reduce your bill by 30%, the client will refuse the settlement, and no one — including you — gets paid for years.”",
          "The “Made Whole” Doctrine (if applicable in your state) — argue that because the client wasn't made whole, the subrogated health insurer must reduce significantly.",
          "The Final Payoff Letter — never send a check without a signed letter stating: “Acceptance of this check constitutes full and final satisfaction of all liens.”"
        ],
        bestPractices: [
          "Get every reduction in writing before disbursement.",
          "Pitfall: sending payment without the full-and-final language."
        ],
        discussionCase: "Script the pro-rata call to a chiropractor."
      },
      trainerCue: "These strategies are vital for increasing the client's net settlement."
    },
    { h: "Auditing the Billing Before Asking for a Discount",
      fourPart: {
        corePrinciples: [
          "Before you ask for a discount, make sure the bill is accurate. Many providers engage in “Upcoding” or “Unbundling.”"
        ],
        howTo: [
          "Cross-Reference — compare the medical records to the billing statement. If the records show a “Level 3” office visit but they billed a “Level 5,” don't ask for a favor — demand a correction.",
          "Duplicate Charges — look for overlapping dates, especially between hospital stays and individual physician groups.",
          "Leverage the “Common Fund” Doctrine — the attorney undertook the legal effort and costs; under the 1/3 Rule, lienholders in many states must reduce their claims by their proportional share of attorney's fees and litigation costs."
        ],
        bestPractices: [
          "Corrections first, reductions second.",
          "Pitfall: negotiating a percentage off an inflated bill."
        ],
        discussionCase: "What records do you need to prove upcoding?"
      },
      trainerCue: "These strategies help you negotiate effectively and advocate for fairness and accuracy."
    },
    { h: "The Net Sheet: Purpose of a Combined BI/UM Net Sheet",
      fourPart: {
        corePrinciples: [
          "The Net Sheet is the ultimate tool for transparency, case control, and maximizing client recovery."
        ],
        howTo: [
          "Avoiding the Double-Dipping Trap — insurers audit our files closely; show where every dollar originated so liens are paid correctly without cross-contaminating funds.",
          "Maximizing Fee Structure Transparency — attorney fee structures can differ for third-party BI vs. first-party UM/UIM; track them separately so ledgers stay ironclad.",
          "Protecting the Final Aggregate Net — show both recovery streams side by side so the client sees the compounding power of their coverages and how negotiation amplified their take-home."
        ],
        bestPractices: [
          "One net sheet, two clearly separated streams.",
          "Pitfall: mixing BI and UM funds on one undifferentiated line."
        ],
        discussionCase: "Why might fees differ between BI and UM?"
      },
      trainerCue: "Every dollar's origin must be visible on the net sheet."
    },
    { h: "The Net Sheet: Stream 1 (BI) and Stream 2 (UM/UIM)",
      layout: "COMPARE",
      compareLeft: { label: "Stream 1: Third-Party Bodily Injury (BI)", items: ["Source: the at-fault driver's insurance company (e.g., GEICO, Progressive).", "CM Focus: exhausting these limits first is usually a legal prerequisite before you can touch the first-party policy."] },
      compareRight: { label: "Stream 2: First-Party UM/UIM", items: ["Source: our client's own policy (or a qualifying resident relative's household policy).", "CM Focus: triggers only when the BI policy is completely exhausted or the tortfeasor is entirely uninsured."] },
      fourPart: {
        corePrinciples: [
          "Two recovery streams, tracked separately, combined on one net sheet."
        ],
        howTo: [
          "Record the BI gross and its fee/cost allocation.",
          "Record the UM gross and its fee/cost allocation.",
          "Combine for the aggregate net."
        ],
        bestPractices: [
          "Check resident-relative household policies for extra UM.",
          "Pitfall: opening UM before BI is exhausted."
        ],
        discussionCase: "When does Stream 2 trigger?"
      },
      trainerCue: "Exhaust BI first; UM triggers on exhaustion or no insurance."
    },
    { h: "The Net Sheet: The LSH Corporate Net Sheet Ledger",
      layout: "TABLE",
      tableHeaders: ["Section", "Lines"],
      tableRows: [
        ["1. Settlement Recovery Summary", "Gross Settlement (with carrier reference, e.g., Progressive Corporation)"],
        ["2. Attorney Fees & Advanced Case Expenses", "Attorney Fees (33.33%) · Filing fees & Summons · Process Server · Mediation · CME Videographer · Deposition · Postage · Medical records/bills requests · File Storage fee · Total Attorney Costs · Total Fees & Costs"],
        ["3. Medical Provider Ledger & Lien Reductions", "Provider Type (Chiro, PT, MRI, Orthopedic…) · Provider Name · Total Charges · PIP Payments · Health Payments · Med Pay · Adjustments · Balance Owed · Max Offer"],
        ["4. Net to Client", "Gross − Total Fees & Costs − Final Medical Balances = Net"]
      ],
      fourPart: {
        corePrinciples: [
          "The BI/UM Master Financial Ledger is the firm's net sheet format."
        ],
        howTo: [
          "Fill the recovery summary.",
          "List every fee and advanced cost with a receipt.",
          "List every provider with charges, payments, adjustments and balance.",
          "Calculate the net and check it against the CMS ledger."
        ],
        bestPractices: [
          "Balance Owed = Total Charges − PIP − Health − MedPay − Adjustments.",
          "Pitfall: a provider line with no PIP/health payments recorded."
        ],
        discussionCase: "Which net sheet line is most often wrong?"
      },
      trainerCue: "Walk through the ledger sections top to bottom."
    },
    { h: "The Net Sheet: Case Manager Protocols for Dual Settlements",
      layout: "PROCESS",
      processSteps: [
        { label: "Secure the BI Tender First", desc: "Formal written limits tender." },
        { label: "UIM Consent Protocol", desc: "Consent to Settle before the BI release." },
        { label: "Consolidate Medical Reductions", desc: "Negotiate globally, not piecemeal." },
        { label: "Run the Aggregate Math", desc: "Both sides at once; match the CMS ledger." }
      ],
      fourPart: {
        corePrinciples: [
          "Dual settlements (BI + UM) follow a strict protocol."
        ],
        howTo: [
          "Secure the BI Tender First — obtain the formal, written policy limits tender from the third-party carrier.",
          "Execute the UIM Consent Protocol — before signing the BI release, issue a formal Consent to Settle notice to the UM/UIM carrier to protect subrogation rights.",
          "Consolidate the Medical Reductions — negotiate medical bills globally against the combined $50,000.00 global value, rather than provider by provider for each policy.",
          "Run the Aggregate Math — fill out both sides of the net sheet simultaneously to verify the final client net matches the software ledger perfectly."
        ],
        bestPractices: [
          "Global negotiation gets bigger reductions than piecemeal.",
          "Pitfall: signing the BI release before the UIM consent."
        ],
        discussionCase: "Why negotiate liens against the combined value?"
      },
      trainerCue: "Follow the four steps in order — the consent step protects the UM claim."
    },
    { h: "Key Takeaway — The Value of a Case Manager",
      fourPart: {
        corePrinciples: [
          "THE CORE RULE: your job as a Case Manager isn't just data entry; it is financial engineering.",
          "When you combine a third-party BI recovery with a first-party UM household policy, you double the client's recovery pool."
        ],
        howTo: [
          "Track both streams cleanly on a dual net sheet.",
          "The Concept — firm costs (police report fees, records retrieval, expert retainers) must be deducted accurately.",
          "Sum costs globally and either deduct them as a single line item or split them proportionally across both accounts."
        ],
        bestPractices: [
          "Clean tracking protects the firm, keeps medical lines clear, and gets the client every dollar they legally deserve.",
          "Pitfall: charging costs twice across BI and UM."
        ],
        discussionCase: "Single-line vs. proportional cost split — pros and cons?"
      },
      trainerCue: "Financial engineering is the value a Case Manager adds."
    },
    { h: "Skill Building: The “Doe v. Apex” Final Net Challenge",
      skill: { tool: "cmLien3", cms: true },
      layout: "TABLE",
      tableHeaders: ["Bucket", "Starting balance", "Target reduction"],
      tableRows: [
        ["A: Prior Attorney Lien (quantum meruit)", "$1,200", "−$600"],
        ["B: BlueCross Subrogation", "$6,200", "−$3,100"],
        ["C: Metro General Hospital", "$18,500", "−$2,500"]
      ],
      fourPart: {
        corePrinciples: [
          "Scenario: the “Gross” settlement is $50,000.00 (a hypothetical settlement for Apex's commercial van). No UM settlement."
        ],
        howTo: [
          "You have 15 minutes to “find” an extra $3,000 for the client using the existing case data.",
          "Draft a “Zero-Recovery” letter to BlueCross, using lien doctrines.",
          "Create a Net Sheet for the client showing: reduced expenses amount; final take-home after reduction; reasoning for each reduction (e.g., doctrines used)."
        ],
        bestPractices: [
          "Every reduction needs a named doctrine or audit finding.",
          "Pitfall: reducing without a written payoff confirmation."
        ],
        discussionCase: "Which bucket gave the biggest gain, and which argument got it?"
      },
      trainerCue: "SOP: Zero-Recovery letter argues Made Whole (client not compensated for pain & suffering). Bucket A: challenge 8 hours of clerical work as overhead → settle $600 (+$600). Bucket B: Common Fund (1/3) + Made Whole due to the $50k limit → settle $3,100 (+$3,100). Bucket C: audit for hidden charges, else pro-rata → settle $16,000 (+$2,500)."
    },
    { h: "Case Phase: Disbursement — Core Objectives",
      layout: "THREEBOX",
      boxes: [
        { label: "Accuracy", desc: "Verify payment amounts against approved budgets." },
        { label: "Compliance", desc: "Local, state and federal rules met — statutory requirements satisfied." },
        { label: "Fraud Prevention", desc: "Identify red flags before funds leave the account." }
      ],
      fourPart: {
        corePrinciples: [
          "Disbursement is where accuracy, compliance, and fraud prevention matter most — money is leaving the account."
        ],
        howTo: [
          "Accuracy — verify payment amounts against approved budgets.",
          "Compliance — ensure all local, state, and federal regulations are met (including statutory requirements).",
          "Fraud Prevention — identify red flags before funds leave the account."
        ],
        bestPractices: [
          "Two-person review on every disbursement.",
          "Pitfall: paying from an unverified wiring instruction."
        ],
        discussionCase: "What's a disbursement red flag?"
      },
      trainerCue: "These objectives are vital for accurate fund management and regulatory compliance."
    },
    { h: "Disbursement: The Workflow",
      layout: "PROCESS",
      processSteps: [
        { label: "Verification", desc: "Review “Ready for Payment” files; confirm Conditions Precedent." },
        { label: "Documentation", desc: "Collect invoices/receipts; legible and matching the claim." },
        { label: "Authorization", desc: "Sign-off for release; submit packet to finance." },
        { label: "Reconciliation", desc: "Confirm receipt of funds; update file to “Paid.”" }
      ],
      fourPart: {
        corePrinciples: [
          "Keep disbursement documentation organized and verified at every step."
        ],
        howTo: [
          "Verification — review “Ready for Payment” files and confirm all “Conditions Precedent” are met.",
          "Documentation — collect invoices/receipts and ensure documents are legible and match the claim.",
          "Authorization — sign-off for release and submit the packet to the finance/accounting team.",
          "Reconciliation — confirm receipt of funds and update the case file to “Paid” status."
        ],
        bestPractices: [
          "Don't mark “Paid” until receipt is confirmed.",
          "Pitfall: submitting an incomplete packet to finance."
        ],
        discussionCase: "What is a “condition precedent” in a PI disbursement?"
      },
      trainerCue: "These steps ensure a smooth and compliant disbursement process."
    },
    { h: "Disbursement: Documentation Checklist",
      fourPart: {
        corePrinciples: [
          "Every payment request needs a complete documentation set."
        ],
        howTo: [
          "Proof of Identity — valid ID of the payee.",
          "Payment Request Form — signed by the beneficiary or authorized representative.",
          "Verified Invoices — must include dates, service descriptions, and tax IDs.",
          "Banking Information — accurate, to avoid delays.",
          "W-9/Tax Forms — if applicable for vendor payments."
        ],
        bestPractices: [
          "Update the case file to reflect “Paid” status after these steps.",
          "Pitfall: invoices with no tax ID."
        ],
        discussionCase: "Which item most often delays disbursement?"
      },
      trainerCue: "This checklist helps streamline the process and minimize errors."
    },
    { h: "Disbursement: Common Challenges & Mitigation",
      layout: "TABLE",
      tableHeaders: ["Challenge", "Mitigation"],
      tableRows: [
        ["Incomplete Paperwork", "Use a “Kickback Protocol” — tell the client exactly what is missing and give a deadline."],
        ["Change of Circumstance", "Require updated documents signed by the beneficiary or authorized representative."],
        ["Duplicate Payments", "Cross-reference invoice numbers in the system before hitting “Approve.”"]
      ],
      fourPart: {
        corePrinciples: [
          "Managing financial transactions has predictable challenges — plan for them."
        ],
        howTo: [
          "Kickback Protocol for missing paperwork.",
          "Signed updates for any change of circumstance.",
          "Invoice-number cross-checks to prevent duplicates."
        ],
        bestPractices: [
          "Give specific deadlines in every kickback.",
          "Pitfall: approving a payment without checking for a prior identical invoice."
        ],
        discussionCase: "Write a kickback message for a missing W-9."
      },
      trainerCue: "These steps streamline disbursement and reduce common issues."
    },
    { h: "Final Case Reconciliation Checklist: Net Sheet (The “Money Trail”)",
      fourPart: {
        corePrinciples: [
          "Before a case is marked “Archived,” the Case Manager must verify the presence of four critical document sets.",
          "Set 1 — the Net Sheet: a finalized accounting of every dollar that moved."
        ],
        howTo: [
          "Itemized List — every check, ACH, or wire transfer.",
          "Transaction IDs — bank confirmation numbers for each payment.",
          "Zero-Balance Confirmation — a report showing “Approved Budget” − “Total Disbursed” = 0, indicating a de-obligated remaining balance."
        ],
        bestPractices: [
          "No archive without a zero balance.",
          "Pitfall: a net sheet with no transaction IDs."
        ],
        discussionCase: "What would a non-zero balance tell you?"
      },
      trainerCue: "Ensure accurate accounting of every financial transaction."
    },
    { h: "Final Case Reconciliation Checklist: Proof of Delivery/Completion",
      fourPart: {
        corePrinciples: [
          "Set 2 — evidence that the funds were used for their intended purpose."
        ],
        howTo: [
          "Signed Acknowledgment of Receipt — the client's signature confirming they received the funds.",
          "Final Inspection/Affidavits — if the disbursement was for construction or repairs, a signed “Certificate of Completion” or final inspection report.",
          "Provider Lien Waivers — if paying providers, a signed document stating they have been paid in full and waive any future claims against the client or the claim."
        ],
        bestPractices: [
          "Collect lien waivers at the same time as payment.",
          "Pitfall: archiving without the client's acknowledgment of receipt."
        ],
        discussionCase: "Why do provider lien waivers protect the client?"
      },
      trainerCue: "Proper documentation is vital for smooth disbursement and protecting all parties."
    },
    { h: "Final Case Reconciliation Checklist: Compliance & Identity Verification",
      fourPart: {
        corePrinciples: [
          "Set 3 — compliance and identity verification."
        ],
        howTo: [
          "Updated W-9/Tax Documents — the most recent tax info on file for any 1099 reporting.",
          "Duplication of Benefits Final Review — a signed statement from the beneficiary confirming they didn't receive “double-funding” from another source (like insurance) after the case started."
        ],
        bestPractices: [
          "Verify the W-9 is current, not from intake.",
          "Pitfall: skipping the duplication-of-benefits statement."
        ],
        discussionCase: "What counts as double-funding?"
      },
      trainerCue: "The Case Manager verifies these documents before archiving for a compliant disbursement."
    },
    { h: "Final Case Reconciliation Checklist: The Internal “Closing Memo”",
      fourPart: {
        corePrinciples: [
          "Set 4 — often overlooked: a one-page summary written by the Case Manager for the internal file."
        ],
        howTo: [
          "Case Summary — a brief “How it started vs. How it ended.”",
          "Discrepancy Notes — if the final payout differed from the initial estimate, explain why (e.g., “Change order approved on March 12th due to unforeseen site conditions”).",
          "Exception Reports — documentation of any policy waivers granted during the process."
        ],
        bestPractices: [
          "Write the memo so someone new can understand the file in two minutes.",
          "Pitfall: no explanation for a payout that differs from the estimate."
        ],
        discussionCase: "Draft the “how it started vs. how it ended” line for John Doe."
      },
      trainerCue: "The closing memo offers a snapshot for continuity and future reference."
    },
    { h: "Final Case Reconciliation: Retention & Disposition Schedule",
      layout: "TABLE",
      tableHeaders: ["Document Type", "Retention Period"],
      tableRows: [
        ["Financial Records", "7 Years (Standard)"],
        ["Eligibility Docs", "3–5 Years"],
        ["Correspondence", "3 Years"]
      ],
      fourPart: {
        corePrinciples: [
          "Closing paperwork must be organized according to a Retention Policy."
        ],
        howTo: [
          "Tag each document with its type.",
          "Apply the retention period.",
          "Schedule disposition dates in the system."
        ],
        bestPractices: [
          "Follow the firm policy and any stricter state rule.",
          "Pitfall: destroying financial records early."
        ],
        discussionCase: "Which documents in John's file must be kept 7 years?"
      },
      trainerCue: "Ask for any questions about the Retention & Disposition Schedule before moving to the real-world application."
    },
    { h: "Skill Building: Closing a Case — John Doe v. Apex Delivery Final Tasks",
      skill: { tool: "cmClosing3", cms: true },
      fourPart: {
        corePrinciples: [
          "Using the John Doe v. Apex Delivery case file, apply the closing concepts.",
          "Scenario: John Doe was injured by an Apex Delivery vehicle. The case settled for $150,000 and is moving through final disbursement and closing paperwork."
        ],
        howTo: [
          "Reconcile the gross settlement against all liens and costs.",
          "Ensure that the case is “Audit Ready.”",
          "Create a closing letter.",
          "Plot Twist: after sending the closing letter, a new $1,200 bill arrives from a “Radiology Imaging Center,” linked to the Apex accident and not in your ledger. The client is very frustrated. What steps do you take next? Who is accountable for settling this bill?"
        ],
        bestPractices: [
          "Verify the bill's legitimacy and connection to the accident before anything else.",
          "Remember the indemnity & hold-harmless clause in the release.",
          "Pitfall: telling the client “it's not our problem.”"
        ],
        discussionCase: "Who pays the $1,200 — and how do you tell the client?"
      },
      trainerCue: "Address the new bill by verifying legitimacy, determining responsibility, and negotiating as needed while keeping John informed and reassured."
    }
  ],
  quickChecks: [
    { afterIndex: 8, q: "UM limit $50,000, BI recovered $25,000, offset state, no stacking. The room left is:", opts: ["$50,000", "$25,000", "$75,000", "$0"], a: 1, r: "The insurer may offset the BI settlement from the UM limit." },
    { afterIndex: 18, q: "The plaintiff was 20% at fault and the settlement was reduced accordingly. Under comparative fault the lien should be:", opts: ["Unchanged", "Reduced by 20%", "Doubled", "Waived entirely"], a: 1, r: "Argue a proportional reduction." },
    { afterIndex: 32, q: "A case can be archived when:", opts: ["The client is paid", "Approved Budget − Total Disbursed = 0 and all four document sets are present", "The attorney says so", "The release is signed"], a: 1, r: "Zero-balance confirmation plus the four document sets." }
  ],
  quiz: [
    { q: "What matters most to the client at the end of a case?", opts: ["The gross settlement", "The net check", "The attorney fee", "The number of providers"], a: 1, r: "Only the net check matters to the client." },
    { q: "BI Exhaustion means:", opts: ["The client is tired", "The at-fault insurer paid its full limit but damages exceed it", "PIP is used up", "The case is closed"], a: 1, r: "You then pivot to the client's own UM/UIM carrier." },
    { q: "Which documents should be front-loaded in the UM packet?", opts: ["Chiropractic notes", "Third-party dec sheet, signed liability release, and the UIM carrier's written Consent to Settle", "Invoices only", "The closing memo"], a: 1, r: "This locks the escape hatches." },
    { q: "The “Bad-Faith Trap” means the insurer:", opts: ["Always pays", "Risks uncapped exposure if it refuses to pay limits on undisputed, overwhelming damages", "Can ignore the demand", "Must sue the client"], a: 1, r: "They choose between capped limits today or uncapped exposure tomorrow." },
    { q: "A UM insurer pays:", opts: ["The policy limit automatically", "The gap between total damages and what was already collected", "Only medical bills", "The attorney fee"], a: 1, r: "They pay the gap." },
    { q: "Which proves uninsured status?", opts: ["A DMV suspension letter, a carrier denial letter, or a police report noting a phantom vehicle", "A W-9", "A PT note", "The net sheet"], a: 0, r: "Proof of Uninsured Status documents." },
    { q: "The single biggest weapon against “pre-existing condition” defenses is:", opts: ["A WPI rating", "A W-9", "A cover letter", "A retention schedule"], a: 0, r: "A formal Whole Person Impairment rating." },
    { q: "ERISA plan liens are typically:", opts: ["Easy to reduce", "Very difficult to reduce because they're governed by federal law", "Not enforceable", "Paid by the defendant"], a: 1, r: "Very low reduction priority." },
    { q: "The Made Whole Doctrine says a lienholder:", opts: ["Is paid first", "Cannot collect unless the plaintiff has been fully compensated", "Gets double", "Reduces by the attorney fee"], a: 1, r: "Common Fund is the attorney-fee reduction." },
    { q: "Quantum Meruit applies when:", opts: ["A prior attorney was dismissed before settlement and seeks the reasonable value of work done", "Medicare pays", "The client is at fault", "A W-9 is missing"], a: 0, r: "The dismissed attorney files a quantum meruit lien." },
    { q: "Before asking a provider for a discount you should:", opts: ["Pay the bill", "Audit the bill for upcoding, unbundling and duplicates", "Call the adjuster", "Close the file"], a: 1, r: "Corrections before reductions." },
    { q: "In a dual settlement, medical reductions should be negotiated:", opts: ["Piecemeal per policy", "Globally against the combined value", "Never", "After disbursement"], a: 1, r: "Consolidate the medical reductions." },
    { q: "A “Kickback Protocol” is used for:", opts: ["Duplicate payments", "Incomplete paperwork — tell the client exactly what is missing with a deadline", "Fraud", "Retention"], a: 1, r: "Clear, specific, time-limited." },
    { q: "Standard retention for financial records is:", opts: ["1 year", "3 years", "7 years", "Forever"], a: 2, r: "Financial 7 years; eligibility 3–5; correspondence 3." },
    { q: "Provider lien waivers confirm:", opts: ["The provider will treat again", "The provider was paid in full and waives future claims against the client", "The client is insured", "The attorney fee"], a: 1, r: "Protects the client from later collections." }
  ],
  discussionQuestion: "John's $150,000 settlement is disbursed and a $1,200 radiology bill surfaces. Using the indemnity clause, your ledger, and lien doctrines — who is accountable, what do you do first, and how do you keep the client's trust?"
};
