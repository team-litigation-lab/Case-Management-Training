/* The Case Flow's exhibit audits, completed-package reveals and service-confirmation emails.
   Assembled from build/case-flow/exhibits/*.json by build/case-flow/exhibits/assemble.cjs, written to EXHIBITSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_EXHIBITS = {
 "audits": {
  "d1m1-a2": {
   "title": "Peach State Lien Ledger Audit",
   "kicker": "Call every line: the collision's care, unrelated, pre-existing, or claimed above what was paid",
   "source": "RS90",
   "reveal": "RS91",
   "due": "06/12/2026",
   "intro": "06/10/2026. Peach State's interim itemization asserts $3,618.00 against John Doe's recovery. Before any figure goes into the lien register or the demand, every line is checked against the treatment record, the PIP Log and what the plan actually paid.",
   "columns": {
    "ref": "Line",
    "as": "As the plan itemized it"
   },
   "items": [
    {
     "ref": "Header",
     "what": "Member ID, group and recovery file",
     "as": "PSH-55017742 · GRP-41208 · SRU-26-03318; member John Doe; date of incident 02/06/2026",
     "verdict": "keep",
     "kind": "qc",
     "issue": "The identifiers match the plan's 02/27/2026 notice and the lien register, so every later letter, the reduction request and the final payoff tie to one recovery file.",
     "fix": "Confirm the three numbers against the notice and the lien register before the dispute goes out; no change.",
     "proof": [
      "RS40"
     ]
    },
    {
     "ref": "Header",
     "what": "Plan funding",
     "as": "Fully insured group policy issued to Northgate Distribution",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Funding status decides which law governs any reduction later. It matches the plan's notice, so the lien register records it as stated.",
     "fix": "Record fully insured in the lien register; which law governs a reduction is Atty. Thorne's call, at the lien stage.",
     "proof": [
      "RS40"
     ]
    },
    {
     "ref": "Header",
     "what": "Status of the itemization",
     "as": "INTERIM ITEMIZATION — subject to change as claims are processed",
     "verdict": "replace",
     "kind": "gap",
     "issue": "An interim figure is not a lien amount. Carried into the lien register or the demand, it lets Peach State move the number at disbursement, and the Net Sheet will not tie.",
     "fix": "Ask in the dispute for a corrected itemization confirmed in writing, stating that no other accident-related claims are in process; Case Manager, by email.",
     "proof": [
      "RS90"
     ]
    },
    {
     "ref": "#1",
     "what": "Riverton Vision Center, 02/03/2026, Z01.00",
     "as": "Routine eye exam; paid $95.00 on 02/17/2026; claimed $95.00",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "The date of service is before the 02/06/2026 collision. Left in, Peach State recovers from John Doe's settlement for care that has nothing to do with the claim.",
     "fix": "Dispute the line in writing as before the loss and unrelated; Case Manager, in the dispute email.",
     "proof": [
      "RS90",
      "RS40"
     ]
    },
    {
     "ref": "#2",
     "what": "Summit Imaging Center MRI, 03/13/2026",
     "as": "Billed $2,395.00; denied 03/27/2026, other coverage primary (PIP); claimed $0.00",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Correct as stated: Harbor Point PIP paid the MRI in full on 03/25/2026, so the plan paid nothing and claims nothing.",
     "fix": "Confirm against the PIP Log and Summit's invoice; note in the register that the line stays at $0.00.",
     "proof": [
      "RS31",
      "RS25"
     ]
    },
    {
     "ref": "#3",
     "what": "Peach State Virtual Care, 03/18/2026, J01.90",
     "as": "Telehealth visit for acute sinusitis; paid $49.00; claimed $49.00",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "A sinus infection is not a collision injury. Left in, the plan's claim against the settlement grows for care the treatment record never ties to the crash.",
     "fix": "Dispute the line as unrelated by its diagnosis code; Case Manager, in writing.",
     "proof": [
      "RS90"
     ]
    },
    {
     "ref": "#4",
     "what": "Riverton Allergy & Asthma Clinic, 05/06/2026, J30.2",
     "as": "Established-patient visit for allergic rhinitis; paid $74.00; claimed $74.00",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "An established-patient visit for a condition he had before the collision: pre-existing, and unrelated to the neck injury the claim is built on.",
     "fix": "Dispute the line as a pre-existing, unrelated condition; Case Manager, in writing.",
     "proof": [
      "RS90"
     ]
    },
    {
     "ref": "#5",
     "what": "Crescent Pain & Spine ESI, 05/15/2026, PS-2605-449021",
     "as": "Billed $3,400.00; allowed and paid $1,860.00 on 06/03/2026; claimed $3,400.00",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "The ledger's own paid column shows $1,860.00. Claiming the billed $3,400.00 would take the $1,540.00 in-network write-off, which the plan never paid, out of John Doe's net.",
     "fix": "Ask Peach State to correct the line to the $1,860.00 it paid: a plan's reimbursement claim is what it paid.",
     "proof": [
      "RS90",
      "RS15"
     ]
    },
    {
     "ref": "Total",
     "what": "Reimbursement claim asserted",
     "as": "$3,618.00, interim, as of 06/10/2026",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "With the three unrelated lines out and Crescent at what was paid, the related claim is $1,860.00. Carried at $3,618.00, the lien register and the Net Sheet overstate what John Doe owes the plan.",
     "fix": "Show $3,618.00 asserted and under dispute; change the register only when Peach State confirms the corrected figure in writing.",
     "proof": [
      "RS90"
     ]
    },
    {
     "ref": "Cover letter",
     "what": "Repayment term",
     "as": "Reimbursed first, in full, without reduction for attorney fees or costs; remit within 30 days of any settlement",
     "verdict": "flag",
     "kind": "loophole",
     "issue": "Agreeing, or answering as if agreed, could give up a reduction for procurement costs that state law may allow on a fully insured plan. That is a legal position, not a filing task.",
     "fix": "Flag to Atty. Thorne with the plan's notice and, once received, the certificate's provision; commit to nothing on repayment, amount or timing.",
     "proof": [
      "RS90",
      "RS40"
     ]
    },
    {
     "ref": "Cover letter",
     "what": "Notice before settlement",
     "as": "Notify the plan in writing before any settlement is reached",
     "verdict": "keep",
     "kind": "qc",
     "issue": "The same condition as the plan's 02/27/2026 notice. Honoring it costs nothing and keeps the plan from claiming its rights were prejudiced.",
     "fix": "Calendar it against the settlement steps; the notice is sent, never a promise of payment.",
     "proof": [
      "RS40"
     ]
    },
    {
     "ref": "—",
     "what": "The plan's reimbursement provision",
     "as": "Not enclosed: plan documents available on written request",
     "verdict": "add",
     "kind": "gap",
     "issue": "Without the certificate's own language no one can test what the plan may claim or how it can be reduced, and Atty. Thorne needs it before the lien stage.",
     "fix": "Request the certificate's reimbursement provision in the dispute email; Case Manager.",
     "proof": [
      "RS90",
      "RS40"
     ]
    },
    {
     "ref": "—",
     "what": "Riverton Spine & Rehab",
     "as": "Not on the itemization",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Correctly absent: Riverton Spine & Rehab is out of network and treats under the LOP signed 02/23/2026, so the plan paid nothing and has nothing to claim.",
     "fix": "Confirm that the LOP balance is tracked in its own register entry, never on Peach State's lien.",
     "proof": [
      "RS13"
     ]
    }
   ],
   "revealNote": "Peach State's corrected itemization of 06/24/2026: the reimbursement claim confirmed in writing at $1,860.00. The pre-demand audit, the demand and the lien stage all work from this figure.",
   "revealPoints": [
    "Reimbursement claim confirmed in writing: $1,860.00 as of 06/24/2026",
    "Three lines removed: 02/03/2026 before the loss; 03/18/2026 and 05/06/2026 unrelated",
    "Crescent Pain & Spine corrected from the billed $3,400.00 to the $1,860.00 paid",
    "Summit Imaging stays at $0.00: denied, PIP primary",
    "No other accident-related claims in process; the certificate's Section 11 enclosed",
    "Any reduction is Atty. Thorne's, at the lien stage"
   ]
  },
  "d2m4-wage": {
   "title": "Lost Wage Worksheet Audit",
   "kicker": "Match every missed shift to the employer's record and the treating provider's note",
   "source": "RS94",
   "reveal": "RS95",
   "due": "07/01/2026",
   "intro": "07/01/2026, the day the Specials audit is due. Northgate's records came on 06/30/2026; the draft worksheet was built from John Doe's memory a week earlier. Call every row against the employer's records and the treating providers' notes, so no absence is left unexcused.",
   "columns": {
    "ref": "Row",
    "as": "As the draft has it"
   },
   "items": [
    {
     "ref": "Header",
     "what": "Employer and rate",
     "as": "Northgate Distribution, $22.00 per hour",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Matches Northgate's letter and its Wage Loss Verification Form: the rate the whole wage claim multiplies.",
     "fix": "Confirm against the employer's letter and form; no change.",
     "proof": [
      "RS43",
      "RS93"
     ]
    },
    {
     "ref": "Header",
     "what": "Shift length",
     "as": "8 hours",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Northgate records 8-hour day shifts, 40 hours a week, so each missed shift is 8 hours at $22.00, $176.00.",
     "fix": "Confirm against the payroll records; no change.",
     "proof": [
      "RS93"
     ]
    },
    {
     "ref": "Excluded",
     "what": "02/09–02/13/2026, five shifts",
     "as": "Excluded: before first treatment, no doctor's note",
     "verdict": "flag",
     "kind": "gap",
     "issue": "Northgate records all five unpaid as call-outs for neck pain. Dropped, the claim loses $880.00 and the file hides the gap's best corroboration; Keystone will find the call-outs anyway.",
     "fix": "Restore the five shifts and flag them to Atty. Thorne with the call-out record, the EMS report and the 02/07/2026 receipt; how they are presented is his call.",
     "proof": [
      "RS43",
      "RS11",
      "RS21",
      "RS12"
     ]
    },
    {
     "ref": "1–2",
     "what": "02/18 and 02/19/2026",
     "as": "Missed, neck pain; client's account; $176.00 each",
     "verdict": "pull",
     "kind": "gap",
     "issue": "He worked both shifts, as the urgent-care history and Northgate's records show. An adjuster who checks payroll would discredit the whole wage claim on these two rows.",
     "fix": "Remove both rows, noting the record that disproves them; Case Manager.",
     "proof": [
      "RS12",
      "RS43"
     ]
    },
    {
     "ref": "3",
     "what": "03/05/2026",
     "as": "Orthopedic consult, Lakeside Orthopedics",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Northgate records a medical appointment, and Dr. Reyes's consult note dates the visit: the absence is excused by the record.",
     "fix": "Attach the consult note as the shift's support.",
     "proof": [
      "RS15",
      "RS43"
     ]
    },
    {
     "ref": "4",
     "what": "03/12/2026",
     "as": "MRI; client's account",
     "verdict": "replace",
     "kind": "calendar",
     "issue": "The MRI was 03/13/2026, and Northgate's unpaid shift is 03/13. A date that matches neither record invites the adjuster to call the shift unsupported.",
     "fix": "Correct the row to 03/13/2026 and attach Summit's MRI report.",
     "proof": [
      "RS16",
      "RS43"
     ]
    },
    {
     "ref": "5",
     "what": "05/15/2026",
     "as": "Injection, Crescent Pain & Spine",
     "verdict": "keep",
     "kind": "qc",
     "issue": "The procedure note and Northgate's record agree on the date: the injection excuses the shift.",
     "fix": "Attach the procedure note as the shift's support.",
     "proof": [
      "RS17",
      "RS43"
     ]
    },
    {
     "ref": "6",
     "what": "05/18/2026",
     "as": "Doctor said rest; client's account; no note attached",
     "verdict": "replace",
     "kind": "gap",
     "issue": "A recollection is not support. Crescent's work note puts him off work 05/15–05/18/2026, and Northgate holds it on file; without it the shift reads as unexcused.",
     "fix": "Replace the support with Crescent's work note; Case Manager.",
     "proof": [
      "RS17",
      "RS43"
     ]
    },
    {
     "ref": "Other",
     "what": "Light duty, 02/20/2026–03/06/2026",
     "as": "Reduced hours under the urgent-care restrictions, about 20 hours, $440.00",
     "verdict": "pull",
     "kind": "arithmetic",
     "issue": "Northgate accommodated the restrictions at full shifts and full pay; no hours were lost. Claimed, it is a figure the employer's own form contradicts.",
     "fix": "Strike the line and note that the restrictions were worked at full shifts.",
     "proof": [
      "RS93",
      "RS12"
     ]
    },
    {
     "ref": "Other",
     "what": "Overtime lost",
     "as": "4 hours a week for 2 weeks: 8 hours at $33.00, $264.00",
     "verdict": "pull",
     "kind": "arithmetic",
     "issue": "No overtime was scheduled on any missed shift. Overtime is claimed only when the employer confirms it was scheduled and lost.",
     "fix": "Strike the line, citing Northgate's form.",
     "proof": [
      "RS93"
     ]
    },
    {
     "ref": "Total",
     "what": "Lost wages claimed",
     "as": "$1,760.00",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "Nine verified shifts at 8 hours and $22.00 come to $1,584.00. Any other total puts a figure in the Specials the employer will not support.",
     "fix": "Replace with $1,584.00 and carry it to the Specials and the Net Sheet.",
     "proof": [
      "RS43",
      "RS93"
     ]
    },
    {
     "ref": "Note",
     "what": "PIP lost-income benefit",
     "as": "80% of $1,760.00 = $1,408.00, to be claimed from Harbor Point",
     "verdict": "replace",
     "kind": "gap",
     "issue": "PIP was exhausted on 06/26/2026, so the 80% benefit was never payable. Recording a pending PIP payment would net money out of the Specials that will never come.",
     "fix": "Record the benefit as not payable; the full $1,584.00 stays in the Specials.",
     "proof": [
      "RS31"
     ]
    },
    {
     "ref": "Note",
     "what": "2025 W-2",
     "as": "Request from Northgate",
     "verdict": "replace",
     "kind": "gap",
     "issue": "Northgate hired him on 01/12/2026 and has no 2025 W-2. The request would stall: his 2025 earnings were with Riverton Freight Services.",
     "fix": "Ask John Doe for his 2025 W-2 from Riverton Freight Services.",
     "proof": [
      "RS93",
      "RS02"
     ]
    },
    {
     "ref": "Note",
     "what": "Loss of earning capacity",
     "as": "Yes, permanent: residual arm numbness (client)",
     "verdict": "flag",
     "kind": "loophole",
     "issue": "Dr. Reyes released him to full duty at MMI on 06/12/2026. Earning capacity is a medical and legal opinion; asserted by staff, it is the first line defense counsel tests.",
     "fix": "Flag to Atty. Thorne with the MMI note; the Case Manager records facts only.",
     "proof": [
      "RS18"
     ]
    },
    {
     "ref": "—",
     "what": "Employer verification and job demands",
     "as": "Requested 06/22/2026, pending: no employer form, payroll records or job description behind any row",
     "verdict": "add",
     "kind": "gap",
     "issue": "Without the employer's form and payroll records every row rests on memory, and the physical demands (lifting to 50 lb, forklift) are what tie the restrictions to the job.",
     "fix": "Add Northgate's Wage Loss Verification Form, payroll records and letter as the worksheet's sources; Case Manager.",
     "proof": [
      "RS93",
      "RS43"
     ]
    }
   ],
   "revealNote": "The Lost Wage Verification Record of 07/01/2026: nine shifts, each matched to Northgate's record and, after 02/20/2026, a provider's note: $1,584.00. The Specials audit and the demand work from it.",
   "revealPoints": [
    "Lost wages verified: 9 shifts × 8 h × $22.00 = $1,584.00",
    "02/09–02/13/2026 kept and flagged to Atty. Thorne, with the call-out record",
    "03/05, 03/13, 05/15 and 05/18/2026 each matched to a provider record",
    "No overtime and no light-duty hours lost; the draft's $1,760.00 struck",
    "PIP's 80% wage benefit not payable: exhausted 06/26/2026"
   ]
  },
  "d3m1-a1": {
   "title": "Exhibit Packet Audit — the Demand Package as drafted",
   "kicker": "Audit the enclosure set before Atty. Thorne signs anything.",
   "source": "RS66",
   "reveal": "RS67",
   "due": "07/20/2026",
   "intro": "The demand specialist built the enclosure set and typed the Specials from it. Nothing has been re-verified since the pre-demand audit and no corrected record has been chased. Work the set item by item: every loophole here is one Dana Whitfield can use, and every gap is one she will find.",
   "columns": {
    "ref": "Exhibit",
    "as": "As drafted"
   },
   "items": [
    {
     "ref": "A",
     "what": "Riverton PD Traffic Crash Report",
     "as": "Cited as RPD-26-018824; portal download of 02/26/2026.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "The report is RPD-26-018842. A demand that cites a report number that does not exist invites the adjuster to say our liability proof cannot be located, and the transposition is already in our own intake sheet.",
     "fix": "Order the certified complete report under the correct number, correct the intake record with a note citing the report, and assign both as dated CMS tasks.",
     "proof": [
      "RS07",
      "RS01"
     ]
    },
    {
     "ref": "B",
     "what": "Signed witness statement — Ruth Calloway",
     "as": "Scene original, scanned; signed and dated 02/06/2026.",
     "verdict": "keep",
     "kind": "qc",
     "issue": "An independent witness who signed at the scene is the answer to the comparative-negligence line defense counsel pressed later. The copy is the signed original.",
     "fix": "Confirm the signature and date are legible on the scan, and that a signed follow-up statement has been requested before memories fade.",
     "proof": [
      "RS08"
     ]
    },
    {
     "ref": "C",
     "what": "Doorbell-camera stills and video",
     "as": "Four stills, grayscale export of the 02/19/2026 working copy.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "The clearest liability proof on the file, and in grayscale the stop line and the signal are hard to read. An exhibit the adjuster cannot see is an exhibit she can ignore.",
     "fix": "Re-export the four stills in color from the native file, hash unchanged, and enclose the preservation and chain-of-custody log with them.",
     "proof": [
      "RS09"
     ]
    },
    {
     "ref": "D",
     "what": "Riverton Fire EMS Run Report",
     "as": "Certified copy, run RF-26-0206-114, from Riverton Fire records.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "This is the document that answers the fourteen days: a neck complaint recorded at the scene on the date of loss, and \"restrained front-seat passenger\" against the later unbelted defense.",
     "fix": "Confirm it is the certified copy and that the demand's section 3 quotes it, not paraphrases it.",
     "proof": [
      "RS11"
     ]
    },
    {
     "ref": "E",
     "what": "Riverton Spine & Rehab itemized LOP ledger",
     "as": "34 lines, $6,290.00, as the provider's portal produced it.",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "05/04/2026 is billed twice. The attendance log shows 33 attended visits, so the audited figure is 33 × $185.00 = $6,105.00. A demand built on a duplicate is a demand the carrier can discredit line by line.",
     "fix": "Request the Final Itemized Ledger with the duplicate removed, re-verify the balance with the provider in the week of service, and update the Specials.",
     "proof": [
      "RS23",
      "RS14"
     ]
    },
    {
     "ref": "E",
     "what": "Crescent Pain & Spine patient statement",
     "as": "Bills John Doe $1,540.00 as due from the patient.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "The $1,540.00 is the contractual adjustment. Crescent is in network, was paid $1,860.00 at the contract rate, and cannot balance-bill the member. Enclosing it asserts a balance that does not exist and invites a lien that does not exist.",
     "fix": "Ask Crescent for a corrected $0.00 patient statement, enclose it with Peach State's EOB, and never list Crescent as an open balance.",
     "proof": [
      "RS26"
     ]
    },
    {
     "ref": "F",
     "what": "Summit Imaging cervical MRI report",
     "as": "Dr. Helen Park's read; the history line gives the date of injury as 02/16/2026.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "The date of loss is 02/06/2026. A ten-day error inside our own causation exhibit is exactly what an adjuster uses to argue the herniation came from something else, and it sits on the one document that answers \"degenerative\".",
     "fix": "Request a corrected history addendum from Summit Imaging and enclose the report with it; keep Dr. Park's impression quoted word for word in the letter.",
     "proof": [
      "RS16"
     ]
    },
    {
     "ref": "G",
     "what": "Dr. Alana Reyes — Causation Letter",
     "as": "Signed original of 06/19/2026 from Lakeside Orthopedics.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The centrepiece: it ties the delayed presentation and the C5-C6 herniation to the collision to a reasonable degree of medical probability, and puts the 2021 low-back care outside the claim.",
     "fix": "Confirm it is the signed original and that the letter's section 3 cites it by date rather than summarising its opinion in our own words.",
     "proof": [
      "RS19"
     ]
    },
    {
     "ref": "H",
     "what": "Northgate Distribution wage-and-attendance letter",
     "as": "Signed original of 06/30/2026 from Northgate HR.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "It proves the $1,584.00 twice over: nine missed shifts for the wage claim, and the 02/09–02/13/2026 call-outs that show symptoms before first treatment.",
     "fix": "Confirm the call-out record is attached to it, so the wage proof and the gap corroboration travel together.",
     "proof": [
      "RS43"
     ]
    },
    {
     "ref": "I",
     "what": "Margaret Doe's Civic: estimate, supplement and Diminished Value report",
     "as": "Fourteen pages from the Property Damage sub-file, enclosed with the medical exhibits.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "It is not even Mr. Doe's claim. The parked Civic is his mother Margaret's, her claim is KM-26-440871-PD with a different adjuster, and putting it inside his bodily injury demand invites a release that reaches her car.",
     "fix": "Pull it. Keep her claim in its own file, and make sure the demand says in terms that Mr. Doe makes no Property Damage claim and that nothing in it releases hers.",
     "proof": [
      "RS33"
     ]
    },
    {
     "ref": "J",
     "what": "Master Case Summary (internal)",
     "as": "Four pages of Atty. Thorne's internal summary, enclosed \"for context\".",
     "verdict": "pull",
     "kind": "privilege",
     "issue": "It names our own gap risk, our own valuation and our internal dates. Sent to the adverse carrier it hands Keystone our weaknesses and our number, and it can never be taken back.",
     "fix": "Pull it. It never goes in a Demand Package, a Mediation Binder or an arbitration exhibit set; flag to Atty. Thorne that it was in the draft.",
     "proof": [
      "RS04"
     ]
    },
    {
     "ref": "J",
     "what": "Claim-specific HIPAA authorization",
     "as": "The client's signed authorization, enclosed with the internal summary.",
     "verdict": "pull",
     "kind": "privilege",
     "issue": "An authorization is how the firm gets records from providers. Handing it to the adverse carrier gives Keystone a route to John Doe's medical file that we do not control and did not have to give.",
     "fix": "Pull it. Keystone receives the records we choose to enclose; calendar the authorization's renewal before it expires on 02/06/2027.",
     "proof": [
      "RS06"
     ]
    },
    {
     "ref": "—",
     "what": "The exhibit index's own Bates ranges",
     "as": "Exhibit E runs LSH-DEM-000016–66 and Exhibit F runs LSH-DEM-000064–66.",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "The two ranges overlap, so three pages belong to two exhibits at once. Once the carrier cites a Bates number, nobody can be sure which document was meant — and the index is the one thing both sides rely on.",
     "fix": "Re-number the set once the pulls and replacements are done, so every page sits in exactly one exhibit and the ranges match the page counts.",
     "proof": [
      "RS61"
     ]
    },
    {
     "ref": "—",
     "what": "Gap Explanation Record",
     "as": "Not in the set. The nineteen-day April disruption has no exhibit at all.",
     "verdict": "add",
     "kind": "gap",
     "issue": "The letter explains the fourteen days, then leaves the April break to be discovered. Keystone will call it failure to mitigate, and the answer — the rental ending 03/19, the carpool ending 04/01, evening visits from 04/21 — is nowhere in the enclosures.",
     "fix": "Add the Gap Explanation Record: every entry with its underlying record, both intervals, and the A-C-T account of the April break with the attendance log behind it.",
     "proof": [
      "RS14",
      "RS21",
      "RS43",
      "RS11"
     ]
    },
    {
     "ref": "—",
     "what": "Keystone's declarations page and limits letter",
     "as": "Not in the set, though the letter's opening relies on it.",
     "verdict": "add",
     "kind": "gap",
     "issue": "The whole demand rests on $10,000 being the per-person bodily injury limit. The proof is Keystone's own letter of 03/20/2026. Without it the demand asserts the limit instead of showing it.",
     "fix": "Add the declarations page and the 03/20/2026 cover letter as the last exhibit, and cite it in the letter's opening and in section 5.",
     "proof": [
      "RS27"
     ]
    },
    {
     "ref": "—",
     "what": "Each deficiency as a dated, assigned CMS task",
     "as": "The draft asks the Case Manager to tell the specialist what to change.",
     "verdict": "flag",
     "kind": "privilege",
     "issue": "Fixing a draft quietly leaves no record of who found what, and no way to prove the set was audited before it went out. The terms, the amount and the deadline are Atty. Thorne's and are not the Case Manager's to change at all.",
     "fix": "Log every finding above as a dated, assigned task; route the corrected set and the audit note to Atty. Thorne for signature. Change no term.",
     "proof": [
      "RS33",
      "RS04"
     ]
    }
   ],
   "revealNote": "The Demand Package as Atty. Thorne signed and served it on 07/20/2026: the letter with its four faults corrected and the Exhibit Index as served, 81 pages. Every later activity on this file works from this set.",
   "revealPoints": [
    "Specials $14,817.40 medical + $1,584.00 wages = $16,401.40, every line tied to a certified bill.",
    "Acceptance runs 30 days from the adjuster's written acknowledgement of receipt, not from the date of the letter.",
    "A Limited Release of Robert Smith and Keystone Mutual only, preserving every UM/UIM claim and the Property Damage claim.",
    "Robert Smith's affidavit of no other insurance added as condition 3.",
    "Exhibits A–J, 81 pages, Bates LSH-DEM-000001–000081, each exhibit mapped to the section it proves.",
    "Receipt acknowledged in writing 07/22/2026, so the acceptance window closes 08/21/2026, docketed with reminders."
   ]
  },
  "d4m3-a1": {
   "title": "Section Audit — the Mediation Binder as drafted",
   "kicker": "Audit all six sections before Atty. Thorne approves delivery.",
   "source": "RS62",
   "reveal": "RS69",
   "due": "03/11/2027",
   "intro": "The Litigation Desk assembled the binder on 03/02/2027 from the providers' original bills, and Atty. Grant Mercer says Keystone will not put a real number on the table while the medical ledger is unverified. On this draft he is right. Work the six sections.",
   "columns": {
    "ref": "Section",
    "as": "As assembled"
   },
   "items": [
    {
     "ref": "§1",
     "what": "Snapshot sheet",
     "as": "Parties, counsel and the session date; start time and location \"to be confirmed\"; mediator's fee \"split 50/50 (assumed)\".",
     "verdict": "replace",
     "kind": "gap",
     "issue": "On the morning of 03/18/2027 nobody can tell from the binder where to be or when. And a fee split the firm never agreed to is a bill it did not expect: the order says how the mediator is paid.",
     "fix": "Take the start time, location and the carrier's video link from the mediator's confirmation and the fee split from the mediation order; verify every contact and date it.",
     "proof": [
      "RS57"
     ]
    },
    {
     "ref": "§2",
     "what": "Confidential Mediation Statement",
     "as": "Draft 1, eight pages, in the binder; not yet routed to Atty. Thorne.",
     "verdict": "flag",
     "kind": "privilege",
     "issue": "It is our own position and our own concessions, for the mediator alone. A draft of it going out, or going out unapproved, is not the Case Manager's call to make either way.",
     "fix": "Route it to Atty. Thorne for approval, mark every page for the mediator only, keep it to one copy, and calendar its delivery with the binder.",
     "proof": [
      "RS57"
     ]
    },
    {
     "ref": "§3",
     "what": "The Complaint",
     "as": "The pre-filing draft: unsigned, no case number, the Property Damage counts missing.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "A superseded draft is not the operative pleading, and it leaves out counts that are actually in suit. In front of the mediator it invites an argument about what was pleaded at all.",
     "fix": "Replace it with the Complaint filed 09/24/2026, No. 26-CV-04417, and take the draft out of the binder set entirely.",
     "proof": [
      "RS50",
      "RS51"
     ]
    },
    {
     "ref": "§3",
     "what": "Answer & Affirmative Defenses, 11/12/2026",
     "as": "The served copy, with the Complaint, as exhibits M-3 and M-4.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The operative answer is what the mediator needs: it is the list of everything the other side intends to argue, and this file can answer all of it.",
     "fix": "Confirm it is the served copy, and that every allegation in it appears in the defense map below.",
     "proof": [
      "RS51"
     ]
    },
    {
     "ref": "§3",
     "what": "The defense map",
     "as": "Not in the set. The pleaded allegations sit in the answer with nothing opposite them.",
     "verdict": "add",
     "kind": "gap",
     "issue": "Every allegation in the answer is already answerable from documents on this file. Without the map the mediator hears each one answered by a sentence instead of a page, and Atty. Thorne has to find the exhibit himself.",
     "fix": "Add the map: each pleaded allegation against the exhibit that answers it, by exhibit number. Flag the two legal questions for Atty. Thorne rather than answering them.",
     "proof": [
      "RS51",
      "RS09",
      "RS11"
     ]
    },
    {
     "ref": "§4",
     "what": "Police Report RPD-26-018842 and Ruth Calloway's statement",
     "as": "Exhibits M-5 and M-6, the certified report and the signed scene statement.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The citation and an independent witness who signed at the scene: the answer to the out-of-turn allegation, in the operative copies.",
     "fix": "Confirm the report is the certified copy and the witness signature and date are legible, and seat both against the out-of-turn allegation in the defense map.",
     "proof": [
      "RS07",
      "RS08"
     ]
    },
    {
     "ref": "§4",
     "what": "Doorbell-camera stills",
     "as": "Filed with the liability exhibits; the stills on this file are the grayscale export of the 02/19/2026 working copy.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "The clearest liability proof on the file, and in grayscale the stop line is hard to read. An exhibit the mediator cannot see is an exhibit that argues nothing.",
     "fix": "Re-export the stills in color from the native file, hash unchanged, and enclose the preservation and chain-of-custody log with them.",
     "proof": [
      "RS09"
     ]
    },
    {
     "ref": "§4",
     "what": "Keystone correspondence",
     "as": "The carrier's letters, February to April 2026, as exhibits M-7 to M-9.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "Among them is Keystone's acceptance of Property Damage liability on 02/17/2026, and the rental cutoff that begins the April disruption. Both are the carrier's own writing.",
     "fix": "Confirm the 02/17/2026 letter and the rental cutoff are in the set; what weight the liability acceptance carries is Atty. Thorne's call, not the binder's.",
     "proof": [
      "RS32"
     ]
    },
    {
     "ref": "§4",
     "what": "The 02/18/2027 deposition summary",
     "as": "The desk note says the transcript is received and the summary is not yet added.",
     "verdict": "add",
     "kind": "gap",
     "issue": "The one record of what John Doe said under oath about the gap, the April break, the 2021 visits and the seatbelt, and it is not in the room.",
     "fix": "Add a summary with the certified transcript pages on each of those four points, marked in the index so Atty. Thorne can reach any of them in seconds.",
     "proof": [
      "RS62"
     ]
    },
    {
     "ref": "§5",
     "what": "The medical ledger",
     "as": "Assembled from the providers' original bills: Riverton Spine & Rehab 34 lines at $6,290.00, medical total $15,002.40.",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "The Demand Package served 07/20/2026 put the medical specials at $14,817.40. Two numbers for one file is exactly the unverified ledger Atty. Mercer named, and the difference is the 05/04/2026 duplicate.",
     "fix": "Rebuild the ledger line by line from the certified bills in hand: 33 attended visits × $185.00 = $6,105.00, medical $14,817.40, with wages $1,584.00 the same $16,401.40 that was served.",
     "proof": [
      "RS23",
      "RS14",
      "RS67"
     ]
    },
    {
     "ref": "§5",
     "what": "Crescent Pain & Spine",
     "as": "Shown at $3,400.00, status \"open balance\", and listed to the mediator among the open balances.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "Peach State paid Crescent $1,860.00 at the contract rate and the in-network provider cannot bill the member the adjustment. Carried into the binder it concedes $3,400.00 that nobody is owed, out of John Doe's net.",
     "fix": "Show the charge satisfied by the plan's contract payment, proved by Peach State's EOB and the corrected $0.00 statement; the open claims are Peach State $1,860.00 and Riverton Spine & Rehab $6,105.00 = $7,965.00.",
     "proof": [
      "RS26",
      "RS41"
     ]
    },
    {
     "ref": "§5",
     "what": "Riverton Spine & Rehab's Final Itemized Ledger",
     "as": "Not in hand. The line is carried at the billed figure with nothing said about it.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "An unqualified figure for a record we do not yet hold is how a ledger becomes unverifiable a second time. The chase is the Case Manager's; going further than a second request is not.",
     "fix": "Mark the line \"Pending Final Verification\", keep chasing the certified ledger, and put the subpoena question to Atty. Thorne with the request history.",
     "proof": [
      "RS23",
      "RS62"
     ]
    },
    {
     "ref": "§5",
     "what": "Northgate wage-and-attendance letter",
     "as": "The signed original of 06/30/2026, with the medical ledger and the Causation Letter.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "It proves the $1,584.00 wage claim and, separately, that John Doe was calling out of work with neck pain before he ever saw a provider.",
     "fix": "Confirm the 02/09–02/13/2026 call-out record stays attached to it, so the wage proof and the gap corroboration are read together.",
     "proof": [
      "RS43"
     ]
    },
    {
     "ref": "§5",
     "what": "Margaret Doe's Property Damage claim",
     "as": "Nowhere in the binder, though the filed Complaint pleads its counts.",
     "verdict": "add",
     "kind": "gap",
     "issue": "A pleaded count the mediator never sees. And once it is added, it has to sit apart: Loss of Use and Diminished Value are not John Doe's bodily injury specials and must never drift into that ledger.",
     "fix": "Add it as its own schedule, marked as Margaret Doe's claim and outside the $40,000 stack: Loss of Use 48 days × $42.00 = $2,016.00, Diminished Value $3,600.00 against Keystone's $792.00.",
     "proof": [
      "RS51",
      "RS46"
     ]
    },
    {
     "ref": "§6",
     "what": "Negotiation Log",
     "as": "The demand of 07/20/2026 through the suit filed 09/24/2026, with each offer and its date.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "Without it nobody in the room is sure of Keystone's last number. With it, every attempt and every silence is dated.",
     "fix": "Confirm it sits with Keystone's own offer letter of 08/05/2026, so the number and the reasons for it are read together.",
     "proof": [
      "RS35"
     ]
    },
    {
     "ref": "§6",
     "what": "The draft release and the UM consent requests",
     "as": "Neither is in Section 6.",
     "verdict": "add",
     "kind": "gap",
     "issue": "If the file settles on the day there is nothing to sign, and no consent on its way to Harbor Point or Cardinal State, so the money stops anyway.",
     "fix": "Add the draft Limited Release of Robert Smith and Keystone only, and the drafted consent requests to both UM carriers. Atty. Thorne settles every term in them.",
     "proof": [
      "RS67",
      "RS38"
     ]
    },
    {
     "ref": "—",
     "what": "The delivery date",
     "as": "Read off the Scheduling Order as 03/31/2027.",
     "verdict": "replace",
     "kind": "calendar",
     "issue": "03/31/2027 is the court's deadline for the mediation to be completed, not the session date. The session is 03/18/2027 and the mediator's confirmation requires the statement and binder seven days before, so 03/31 is twenty days too late.",
     "fix": "Docket delivery for 03/11/2027 with the approval step ahead of it, and keep 03/31/2027 on the calendar as the court's completion deadline.",
     "proof": [
      "RS57",
      "RS55"
     ]
    }
   ],
   "revealNote": "The Mediation Binder as Atty. Thorne approved it on 03/10/2027 and the firm delivered it on 03/11/2027: six sections, 141 pages, with the defense map and the rebuilt ledger. The arbitration exhibits and Day 5 both start from it.",
   "revealPoints": [
    "Medical specials rebuilt to $14,817.40, with wages the $16,401.40 that was served on 07/20/2026.",
    "Open liens $7,965.00: Peach State $1,860.00 and Riverton Spine & Rehab $6,105.00; Crescent $0.00.",
    "Riverton Spine & Rehab marked \"Pending Final Verification\" until its certified ledger arrives.",
    "All five pleaded allegations mapped to answering exhibits; two legal questions flagged, not answered.",
    "Section 2 approved, marked for the mediator only, one copy; the deposition summary added at Section 4.",
    "Delivered 03/11/2027, seven days before the 03/18/2027 session; 03/31/2027 kept as the court's deadline."
   ]
  },
  "d4m3-a2": {
   "title": "Sorting & QC Audit — the arbitration exhibit index",
   "kicker": "Apply each tab's QC rule before the 06/02/2027 exchange.",
   "source": "RS63",
   "reveal": "RS70",
   "due": "06/02/2027",
   "intro": "The Litigation Desk's index of 05/14/2027. Keystone tendered at the 03/18/2027 mediation and Robert Smith was dismissed; Harbor Point and Cardinal State now dispute damages and sit on the other side of this hearing. Work it exhibit by exhibit.",
   "columns": {
    "ref": "Ex.",
    "as": "As assembled"
   },
   "items": [
    {
     "ref": "C-1",
     "what": "Snapshot sheet and the arbitrator's fee disclosure",
     "as": "Tab 1: the parties, the arbitrator and the hearing date, with the fee disclosure.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The sheet the hearing is run from. The fee disclosure belongs with it, and both carriers' claim numbers and contacts are on it.",
     "fix": "Confirm each carrier's contact against the file and date the check, and hold a slot for the final brief, never a draft.",
     "proof": [
      "RS58",
      "RS28"
     ]
    },
    {
     "ref": "C-2",
     "what": "Confidential Mediation Statement, 03/11/2027",
     "as": "Tab 1, \"for background\", inside the exchange set.",
     "verdict": "pull",
     "kind": "privilege",
     "issue": "It was delivered to the mediator alone and marked for the mediator only, and it is about the very carriers that are now the opposing parties. Exchanging it hands Harbor Point and Cardinal State our position in our own words.",
     "fix": "Withhold it from the exchange set and record why. A document marked for the mediator does not travel to the next forum.",
     "proof": [
      "RS57",
      "RS62"
     ]
    },
    {
     "ref": "C-3",
     "what": "Complaint (pre-filing draft) and the Answer",
     "as": "Tab 2, the superseded draft together with the served answer.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "The draft is unsigned, carries no case number and omits pleaded counts. And the tort pleadings belong to a case that has been dismissed as to Robert Smith: whether they are exchanged here at all is not the Case Manager's call.",
     "fix": "Take the draft out of the file set, move the filed pleadings to the attorney's set, and put the exchange question to Atty. Thorne.",
     "proof": [
      "RS50",
      "RS51"
     ]
    },
    {
     "ref": "—",
     "what": "The threshold exhaustion record",
     "as": "Not in the binder: no Keystone tender, no UM consents, no Limited Release, no order dismissing Robert Smith.",
     "verdict": "add",
     "kind": "gap",
     "issue": "UM opens only once the bodily injury layer is exhausted. Without that record the arbitrator has no reason to reach the damages tabs at all, and both carriers can say so on the first morning.",
     "fix": "Add them as the first exhibits of Tab 1, with both Coverage Letters: Keystone's 08/12/2026 tender, the UM consents of 08/24 and 08/26/2026, the Limited Release and the dismissal.",
     "proof": [
      "RS36",
      "RS38",
      "RS37"
     ]
    },
    {
     "ref": "C-4",
     "what": "Police Report RPD-26-018842",
     "as": "Tab 3, the public-redacted portal copy.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "The redactions remove the independent witness and the citation — the two things the report is in the set to prove. Offered this way it proves almost nothing.",
     "fix": "Order the certified complete report, redact only what this forum requires, and flag the citation's admissibility to Atty. Thorne rather than arguing it.",
     "proof": [
      "RS07"
     ]
    },
    {
     "ref": "C-5",
     "what": "Doorbell-camera stills",
     "as": "Tab 3, grayscale photocopies.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "Third forum, same grayscale stills. These carriers dispute damages rather than liability, but the mechanism is what makes the injury credible, and a photocopy does not show it.",
     "fix": "Re-export in color from the native file, hash unchanged, and log the chain of custody with the exhibit.",
     "proof": [
      "RS09"
     ]
    },
    {
     "ref": "C-6",
     "what": "The medical ledger at $14,817.40",
     "as": "Tab 4, with the records and bills, at the audited figure.",
     "verdict": "keep",
     "kind": "arithmetic",
     "issue": "This is the figure the Demand Package served and the Mediation Binder was rebuilt to: 33 attended visits, the 05/04/2026 duplicate out. It ties.",
     "fix": "Confirm every line still ties to the bill behind it, and that Riverton Spine & Rehab's certified Final Itemized Ledger is the copy in the set.",
     "proof": [
      "RS23",
      "RS14"
     ]
    },
    {
     "ref": "C-6",
     "what": "Provider certifications",
     "as": "None requested from any provider or record-holder.",
     "verdict": "add",
     "kind": "gap",
     "issue": "An uncertified record is a record a carrier can object to, and the whole ledger rests on them. Nineteen days before the exchange, nothing has been asked for.",
     "fix": "Request a certification from every provider and from Riverton Fire, Riverton PD and Northgate HR, and log each receipt. Nothing back in 14 days means a second request and a subpoena flag for Atty. Thorne.",
     "proof": [
      "RS63"
     ]
    },
    {
     "ref": "C-7",
     "what": "MRI report and the Causation Letter",
     "as": "Tab 5, Dr. Park's read of 03/13/2026 and Dr. Reyes's letter of 06/19/2026.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "Together they answer the gap and the \"degenerative\" reading. Neither says anything about the 2021 low-back visits, which is the line defence counsel pressed at the 02/18/2027 deposition.",
     "fix": "Pair them with the 2021 records and the deposition testimony, and flag to Atty. Thorne whether to seek a supplemental declaration from Dr. Reyes. That is his decision, not the Case Manager's.",
     "proof": [
      "RS19",
      "RS16"
     ]
    },
    {
     "ref": "—",
     "what": "The 2021 chiropractic records",
     "as": "Not in the binder at all.",
     "verdict": "add",
     "kind": "gap",
     "issue": "The prior-injury line is answered by what the 2021 records actually say — three visits, low back only, resolved, no cervical complaint. Asserting it without them leaves the carriers' version standing.",
     "fix": "Add them at Tab 5 with the treating providers' own histories, so the damaging record and the record that answers it are read together.",
     "proof": [
      "RS20",
      "RS02"
     ]
    },
    {
     "ref": "C-8",
     "what": "Northgate wage letter and the impasse memorandum",
     "as": "Tab 6, the employer's letter filed together with the internal memo to Atty. Thorne.",
     "verdict": "pull",
     "kind": "privilege",
     "issue": "The memo is work product and a record of settlement communications. Filed because it explains the history, it puts our strategy and every number we discussed in front of the carriers.",
     "fix": "Pull the memo to the attorney's set for Atty. Thorne's privilege decision and leave Tab 6 to wage proof alone. Nothing is exchanged, and nothing withheld, on the Case Manager's own decision.",
     "proof": [
      "RS63"
     ]
    },
    {
     "ref": "C-8",
     "what": "The wage proof itself",
     "as": "Northgate's signed letter of 06/30/2026.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "Nine shifts × 8 hours × $22.00 = $1,584.00, proved by the employer. Tab 6 takes wage proof and nothing else.",
     "fix": "Leave it at Tab 6 on its own, with the 02/09–02/13/2026 call-out record attached to it.",
     "proof": [
      "RS43"
     ]
    },
    {
     "ref": "C-9",
     "what": "Lien Sheet — Harbor Point PIP, $5,000.00",
     "as": "Listed as a lien because PIP paid $5,000.00 of the bills.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "Riverton's add-on PIP carries no reimbursement from the recovery, as Harbor Point's own letter of 03/02/2026 confirms, and Harbor Point is the carrier on the other side of this hearing. Working John Doe's net from a lien it does not hold costs him $5,000.00.",
     "fix": "Strike it, citing the 03/02/2026 letter in the threshold record. PIP paying a bill does not create a lien.",
     "proof": [
      "RS28",
      "RS31"
     ]
    },
    {
     "ref": "C-9",
     "what": "Lien Sheet — Peach State and Riverton Spine & Rehab",
     "as": "Peach State $1,860.00 and Riverton Spine & Rehab $6,105.00.",
     "verdict": "keep",
     "kind": "arithmetic",
     "issue": "Both are right: the plan's itemized reimbursement claim, and the LOP account at the audited 33 visits. Together they are the $7,965.00 the net is actually worked from.",
     "fix": "Confirm Crescent and Summit Imaging are shown at $0.00 as well, and reconcile the sheet to $7,965.00 before it goes to Atty. Thorne.",
     "proof": [
      "RS41",
      "RS25"
     ]
    },
    {
     "ref": "—",
     "what": "The authentication log",
     "as": "Not started. No exhibit records how it would be authenticated.",
     "verdict": "add",
     "kind": "qc",
     "issue": "A record with no logged foundation is one the carriers can object to before it is read, and at a hearing that is the same as not having it.",
     "fix": "Complete the column for every exhibit before the 06/02/2027 exchange, with the forum's evidence rule noted as a question for Atty. Thorne.",
     "proof": [
      "RS63"
     ]
    },
    {
     "ref": "—",
     "what": "The arbitration brief's due date",
     "as": "Docketed 06/12/2027, ten days before the hearing.",
     "verdict": "replace",
     "kind": "calendar",
     "issue": "Ten days before the hearing lands on a Saturday. A brief diaried for a day the forum is not open is a brief filed late, in the one filing that frames the whole hearing.",
     "fix": "Count backward and docket the earlier business day, 06/11/2027, as configured for this training file; confirm the forum's rules with Atty. Thorne.",
     "proof": [
      "RS58"
     ]
    },
    {
     "ref": "—",
     "what": "The exchange date",
     "as": "06/02/2027, twenty days before the hearing, as the notice sets it.",
     "verdict": "keep",
     "kind": "calendar",
     "issue": "This one is right, and it is the date every fix above has to be finished by. Everything in the set is approved before it, or it is not exchanged.",
     "fix": "Keep it, and work backward from it: the certifications, the colour stills and the certified report all have to land before it.",
     "proof": [
      "RS58"
     ]
    }
   ],
   "revealNote": "The Arbitration Binder as Atty. Thorne approved it on 05/29/2027 and the firm exchanged it on 06/02/2027: six tabs, exhibits C-1 to C-18, 174 pages, with the withheld-items list and the audited Lien Sheet.",
   "revealPoints": [
    "Threshold exhibits lead: the BI tender, both UM consents, the Limited Release and the dismissal.",
    "Every record certified and authenticated; Crescent's certification chased with a subpoena flag.",
    "Tab 5 pairs the 2021 low-back records and the deposition testimony with the MRI read and the Causation Letter.",
    "Lien Sheet audited from $12,965.00 to $7,965.00: PIP, Summit and Crescent all at $0.00.",
    "Brief docketed 06/11/2027; exchange 06/02/2027; hearing 06/22/2027.",
    "Six items withheld on Atty. Thorne's recorded decision, each with its reason on the file."
   ]
  }
 },
 "emails": {
  "d1m1-a2": {
   "title": "Lien Dispute & Written Confirmation — Peach State",
   "kicker": "Send the line-by-line dispute, get the corrected balance in writing, and file the exchange",
   "model": "RS92",
   "sent": "06/12/2026",
   "to": "Dion Carver, Peach State Health Plan (dcarver@peachstatehealth.example)",
   "cc": "Atty. Elijah Thorne (ethorne@lshlawgroup.example)",
   "subject": "Member PSH-55017742 · Recovery file SRU-26-03318 — itemized lien dispute",
   "attachment": "Peach State's interim itemization of 06/10/2026, marked line by line",
   "brief": "Dispute the interim itemization in writing, line by line: the three lines that are not the collision's, and Crescent claimed above what the plan paid. Ask for a corrected itemization confirmed in writing and the plan's reimbursement provision. Commit to nothing on repayment or reduction: that is Atty. Thorne's.",
   "required": [
    {
     "id": "ids",
     "label": "Names the member ID or the recovery file",
     "hint": "Name PSH-55017742 or SRU-26-03318 so the plan finds the file.",
     "match": [
      "PSH-55017742|SRU-26-03318"
     ]
    },
    {
     "id": "unrelated",
     "label": "Names the three unrelated lines by date",
     "hint": "Name 02/03, 03/18 and 05/06, and say why each is not the collision's care.",
     "match": [
      "02/03",
      "03/18",
      "05/06"
     ]
    },
    {
     "id": "paid",
     "label": "Puts Crescent at what the plan paid",
     "hint": "The plan's claim is what it paid: $1,860.00, not the $3,400.00 billed.",
     "match": [
      "1,?860"
     ]
    },
    {
     "id": "writing",
     "label": "Asks for a corrected itemization, confirmed in writing",
     "hint": "Ask for the corrected balance in writing, not by phone.",
     "match": [
      "writ",
      "correct|revis|confirm"
     ]
    },
    {
     "id": "counsel",
     "label": "Routes repayment and terms to Atty. Thorne",
     "hint": "Questions on what the plan will accept go to Atty. Thorne, by name.",
     "match": [
      "thorne"
     ]
    }
   ],
   "reply": {
    "from": "Dion Carver, Peach State Health Plan (dcarver@peachstatehealth.example)",
    "date": "06/24/2026",
    "time": "10:15 a.m.",
    "subject": "RE: Member PSH-55017742 · Recovery file SRU-26-03318 — itemized lien dispute",
    "body": "Thank you for your email of June 12. We have reviewed the claim records and agree with your findings. The Riverton Vision Center, Peach State Virtual Care and Riverton Allergy & Asthma Clinic claims are removed as unrelated, and the Crescent Pain & Spine line is corrected to the $1,860.00 the Plan paid. Summit Imaging remains at $0.00.\n\nThe Plan's reimbursement claim is $1,860.00 as of today, and no other accident-related claims are in process. Our corrected itemization and Section 11 of the certificate are attached. Please notify us before any settlement and request a final amount before disbursement.\n\nDion Carver · Recovery Analyst · Peach State Health Plan · SRU-26-03318"
   },
   "press": {
    "from": "Dion Carver, Peach State Health Plan",
    "date": "06/24/2026",
    "subject": "RE: RE: Member PSH-55017742 — one more thing",
    "body": "One more thing so I can close my review. Can you confirm in writing that Mr. Doe will repay the $1,860.00 in full from his settlement, without reduction? And what are the liability carrier's limits, and when do you expect the case to settle? It would help us plan.",
    "choices": [
     {
      "label": "Confirm full repayment: the figure is now right, so agreeing costs nothing",
      "ok": false,
      "why": "A written promise of full repayment can waive a reduction Atty. Thorne may seek at the lien stage. Repayment terms are his."
     },
     {
      "label": "Acknowledge the $1,860.00, confirm notice before any settlement, and route the repayment and limits questions to Atty. Thorne",
      "ok": true,
      "why": "The facts are acknowledged, the plan's notice condition is honored, and every legal position and disclosure stays with the attorney, routed the same day."
     },
     {
      "label": "Give him Keystone's $10,000 limit and a likely settlement month so he can plan",
      "ok": false,
      "why": "What a lienholder is told is counsel's call, and a settlement date is a prediction the Case Manager never makes."
     }
    ]
   },
   "convert": {
    "title": "Peach State Lien Audit & Confirmation — memorandum to file",
    "category": "Others",
    "type": "Others",
    "folder": "liens",
    "sections": [
     {
      "h": "1 · The audit and the dispute",
      "lines": [
       "Interim itemization of 06/10/2026 audited line by line: $3,618.00 asserted.",
       "Three lines disputed as unrelated (02/03, 03/18, 05/06/2026); Crescent Pain & Spine corrected to the $1,860.00 paid; Summit Imaging at $0.00."
      ]
     },
     {
      "h": "2 · The confirmation email as sent",
      "lines": []
     },
     {
      "h": "3 · The reply as received",
      "lines": []
     },
     {
      "h": "4 · What the confirmation establishes",
      "lines": []
     },
     {
      "h": "5 · Filed and updated",
      "lines": [
       "CMS → Liens: $3,618.00 asserted → $1,860.00 confirmed 06/24/2026; flag kept.",
       "CMS → Doc Hub → Others under the firm's naming convention; Communications Log; a copy on the Backup Drive in Liens & Reimbursement.",
       "Repayment and limits questions routed to Atty. Thorne 06/24/2026. Task: request the final amount before disbursement."
      ]
     }
    ],
    "establishes": [
     "The reimbursement claim is $1,860.00, in the plan's own writing, before the demand is drafted",
     "The plan claims only what it paid, for the collision's care; the three unrelated lines are gone",
     "No other accident-related claim is in process as of 06/24/2026",
     "Nothing is compromised: any reduction is Atty. Thorne's, at the lien stage"
    ]
   },
   "labels": {
    "write": "The dispute email to Peach State",
    "reply": "Peach State's written confirmation",
    "send": "Send it to Dion Carver",
    "who": "Dion Carver",
    "sentTime": "9:30 a.m.",
    "sentToast": "Sent. His written confirmation is in the thread.",
    "warn": "Audit the itemization first: the dispute is built from your calls.",
    "why": "A thread in a mailbox is not on the case file: a colleague covering the file cannot find it, and it is not in the backup. Converted, filed and backed up, the plan's own confirmation of its lien is part of the case.",
    "folderNote": "every lien and reimbursement document on the case",
    "aria": "Your dispute email to Peach State",
    "original": "Peach-State-Lien-Confirmation.pdf",
    "rightToast": "Right: acknowledged, routed, and nothing agreed for Atty. Thorne."
   }
  },
  "d2m4-wage": {
   "title": "Employer Wage Verification — Northgate Distribution",
   "kicker": "Request the employer's own verification, answer its follow-up, and file the exchange",
   "model": "RS96",
   "sent": "06/22/2026",
   "to": "Angela Ruiz, HR Manager, Northgate Distribution (aruiz@northgatedistribution.example)",
   "cc": "",
   "subject": "John Doe (Employee ID NGD-20417) — wage and attendance verification request",
   "attachment": "Employee authorization signed by John Doe 06/22/2026",
   "brief": "Ask Northgate for its own records: the Wage Loss Verification Form, payroll records and his W-2, and confirmation of his rate, shift hours, each missed date, any overtime lost and the job's physical demands. Share no medical records and nothing about the claim's value.",
   "required": [
    {
     "id": "dates",
     "label": "Lists the missed dates to verify",
     "hint": "Name 02/09 through 02/13, 03/05, 03/13, 05/15 and 05/18 so each is confirmed or corrected.",
     "match": [
      "02/09",
      "03/05",
      "03/13",
      "05/15",
      "05/18"
     ]
    },
    {
     "id": "rate",
     "label": "Asks for his hourly rate and shift hours",
     "hint": "The claim multiplies the rate by the hours: ask for both.",
     "match": [
      "rate|hourly",
      "hours|shift"
     ]
    },
    {
     "id": "overtime",
     "label": "Asks whether any overtime was lost",
     "hint": "Overtime is claimed only if the employer confirms it was scheduled and lost.",
     "match": [
      "overtime"
     ]
    },
    {
     "id": "payroll",
     "label": "Asks for payroll records or paystubs, and the W-2",
     "hint": "Ask for paystubs or payroll records for the affected pay periods, and his W-2.",
     "match": [
      "paystub|pay stub|payroll",
      "w-?2"
     ]
    },
    {
     "id": "demands",
     "label": "Asks for the physical demands of his job",
     "hint": "The job's physical demands tie the doctors' restrictions to the work.",
     "match": [
      "physical|job duties|job description|demands"
     ]
    },
    {
     "id": "form",
     "label": "Asks for the Wage Loss Verification Form",
     "hint": "Ask the employer to complete the verification form, not just to write back.",
     "match": [
      "verification form|wage loss.{0,20}form"
     ]
    }
   ],
   "reply": {
    "from": "Angela Ruiz, Northgate Distribution (aruiz@northgatedistribution.example)",
    "date": "06/30/2026",
    "time": "2:40 p.m.",
    "subject": "RE: John Doe (NGD-20417) — wage and attendance verification",
    "body": "Attached are our wage and attendance letter and the completed Wage Loss Verification Form with payroll records for the three pay periods. To summarize: Mr. Doe is paid $22.00 an hour on 8-hour day shifts. Payroll shows nine unpaid shifts, 72 hours, $1,584.00: 02/09 through 02/13, 03/05, 03/13, 05/15 and 05/18/2026. No overtime was scheduled on any of them. The restrictions from 02/20 and 03/05/2026 were handled within his role at full shifts, with no hours lost. The job requires lifting to 50 lb, forklift work and being on his feet all shift. We have no 2025 W-2 for him; he started 01/12/2026.\n\nAngela Ruiz · HR Manager · Northgate Distribution · (555) 010-6600"
   },
   "press": {
    "from": "Angela Ruiz, Northgate Distribution",
    "date": "06/30/2026",
    "subject": "RE: one more question",
    "body": "One more question from our benefits coordinator. Will John's settlement pay him back for those days, so we know how to code them? And could you send us his MRI and his doctors' notes so we can update his restrictions file?",
    "choices": [
     {
      "label": "Send the MRI and the notes: Northgate has cooperated, and the records are already on file",
      "ok": false,
      "why": "His authorization lets Northgate give records to the firm, not the reverse. Sending his medical records to his employer breaches his privacy."
     },
     {
      "label": "Tell her yes: lost wages are part of the claim, so he will be repaid at settlement",
      "ok": false,
      "why": "That predicts a recovery and discusses his claim with a third party. What the claim recovers is Atty. Thorne's to discuss, with John Doe."
     },
     {
      "label": "Thank her, send no records, say work-status notes come from John and his providers, and route the claim question to Atty. Thorne",
      "ok": true,
      "why": "His privacy is kept, Northgate still gets restrictions from the proper source, and the claim question reaches the attorney the same day."
     }
    ]
   },
   "convert": {
    "title": "Employer Wage Verification — memorandum to file",
    "category": "Others",
    "type": "Others",
    "folder": "settlement",
    "sections": [
     {
      "h": "1 · What was asked, and of whom",
      "lines": [
       "Angela Ruiz, HR Manager, Northgate Distribution, 06/22/2026, with John Doe's signed authorization."
      ]
     },
     {
      "h": "2 · The confirmation email as sent",
      "lines": []
     },
     {
      "h": "3 · The reply as received",
      "lines": []
     },
     {
      "h": "4 · What the confirmation establishes",
      "lines": []
     },
     {
      "h": "5 · Filed and updated",
      "lines": [
       "CMS → Doc Hub → Others under the firm's naming convention; Communications Log; a copy on the Backup Drive in Wages & Costs.",
       "Claim question routed to Atty. Thorne 06/30/2026; no medical records sent.",
       "Tasks: audit the draft wage worksheet (due 07/01/2026); ask John Doe for his 2025 W-2."
      ]
     }
    ],
    "establishes": [
     "The rate, hours and nine unpaid shifts come from Northgate's own business records: $1,584.00",
     "No overtime and no light-duty hours were lost",
     "The 02/09–02/13/2026 call-outs for neck pain are on the employer's record, flagged to Atty. Thorne",
     "The 2025 W-2 must come from John Doe (Riverton Freight Services)"
    ]
   },
   "labels": {
    "write": "The verification request to Northgate HR",
    "reply": "Northgate's written verification",
    "send": "Send it to Angela Ruiz",
    "who": "Angela Ruiz",
    "sentTime": "9:05 a.m.",
    "sentToast": "Sent. Her reply and records are in the thread.",
    "warn": "",
    "why": "A reply in a mailbox is not on the case file: a colleague covering the file cannot find it, and it is not in the backup. Converted, filed and backed up, the employer's own verification is part of the case.",
    "folderNote": "every wage and cost document on the case",
    "aria": "Your verification request to Northgate",
    "original": "Employer-Wage-Verification.pdf",
    "rightToast": "Right: no records out, nothing said about the claim, and the question routed."
   }
  },
  "d3m1-a1": {
   "title": "Service Confirmation — the email the adjuster has to answer",
   "kicker": "Sending proves it left. Her written acknowledgement proves when it landed.",
   "model": "RS68",
   "sent": "07/20/2026",
   "to": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
   "cc": "Elijah Thorne <ethorne@lshlawgroup.example>",
   "subject": "Time-Limited Demand served today — John Doe / Robert Smith — Claim KM-26-440871",
   "attachment": "LSH-2026-MVA-770412_Doe-John_Demand-Package_2026-07-20.pdf (81 pp.)",
   "brief": "Write the email that serves the demand on the adjuster. Say it is served by this email, list what is attached, say the clock runs from her written acknowledgement of receipt, and ask her to confirm the receipt date and a complete set. Terms go to Atty. Thorne.",
   "required": [
    {
     "id": "served",
     "label": "Says the demand is served on her by this email",
     "hint": "Say in terms that the signed demand is served on her with this email.",
     "match": [
      "serv",
      "this email|attached|enclosed"
     ]
    },
    {
     "id": "package",
     "label": "Says what is attached: the Demand Package, 81 pages, Exhibits A–J",
     "hint": "Name the package, the page count and the exhibit range, so she cannot say part was missing.",
     "match": [
      "81",
      "exhibit",
      "\\bA\\b.{0,12}\\bJ\\b|A through J|A-J|A–J"
     ]
    },
    {
     "id": "clock",
     "label": "States that the 30 days run from her written acknowledgement of receipt",
     "hint": "The window runs from her written acknowledgement of receipt, not the letter date or send date. Say so.",
     "match": [
      "30 day|thirty day",
      "acknowledg"
     ]
    },
    {
     "id": "ask",
     "label": "Asks her to confirm the receipt date and that the set is complete",
     "hint": "Ask her to confirm in writing the date she received the email and that the package is complete.",
     "match": [
      "confirm",
      "date|receipt|receiv"
     ]
    },
    {
     "id": "upl",
     "label": "Routes terms, amount and any extension to Atty. Thorne",
     "hint": "Point every question about the terms or the deadline to Atty. Thorne, by name.",
     "match": [
      "thorne",
      "term|extension|deadline|time frame|amount"
     ]
    }
   ],
   "reply": {
    "from": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
    "date": "07/22/2026",
    "time": "9:06 a.m.",
    "subject": "RE: Time-Limited Demand served today — John Doe / Robert Smith — Claim KM-26-440871",
    "body": "Confirming receipt. Your email of July 20 with the demand and its attachment is in the file, received and opened this morning, July 22; the PDF opens at 81 pages and the index runs A through J, so I show it complete.\n\nI have logged the demand as received 07/22/2026 and diaried it for evaluation. I will need to review the imaging and the treatment records before I can respond to the number. I may come back to you about the time frame."
   },
   "press": {
    "from": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
    "date": "07/23/2026",
    "subject": "RE: Time-Limited Demand — extension request",
    "body": "One more thing. Our medical review is backed up and I will not have an evaluation inside thirty days. Can we agree to two more weeks on the acceptance date? If you can just confirm by reply I will note the file at September 4 and we can skip the paperwork.",
    "choices": [
     {
      "label": "Reply that two weeks is fine and note it on the file.",
      "ok": false,
      "why": "The Case Manager has just moved a deadline Atty. Thorne set. It is his term to change, and a reply like this can be held against the demand later."
     },
     {
      "label": "Reply that the demand stands as written and any request must go in writing to Atty. Thorne; forward it the same day.",
      "ok": true,
      "why": "Correct. Nothing is granted and nothing is refused: the request is recorded, routed the same day, and the 08/21/2026 date stays on the docket until he says otherwise."
     },
     {
      "label": "Say nothing and let the deadline run.",
      "ok": false,
      "why": "An unanswered request is still a request on the file. If Keystone later says it asked and got no response, silence is the record we are left with."
     },
     {
      "label": "Reply that no extensions are granted on a Time-Limited Demand.",
      "ok": false,
      "why": "That is a decision on the terms, and a refusal is as much the attorney's call as an agreement. The Case Manager does not answer it either way."
     }
    ]
   },
   "convert": {
    "title": "Demand Service & Adjuster Acknowledgment — memorandum to file",
    "category": "Others",
    "folder": "insurance",
    "type": "Others",
    "sections": [
     {
      "h": "1 · What was served, and how",
      "lines": [
       "BI Time-Limited Demand, signed by Atty. Elijah Thorne 07/20/2026, served the same day.",
       "Served by email to the adjuster, 07/20/2026, 4:21 p.m., with the full Demand Package as one bookmarked PDF, 81 pages, Exhibits A–J.",
       "Receipt acknowledged in writing by Dana Whitfield, 07/22/2026, 9:06 a.m."
      ]
     },
     {
      "h": "2 · The email that served the demand",
      "lines": []
     },
     {
      "h": "3 · The adjuster's acknowledgment",
      "lines": []
     },
     {
      "h": "4 · What the acknowledgment establishes",
      "lines": []
     },
     {
      "h": "5 · Action taken the same day",
      "lines": [
       "Acknowledgment forwarded to Atty. Thorne 07/22/2026, flagged \"adjuster raises time frame — your call\".",
       "Communications Log updated with both emails, quoted in the adjuster's own words.",
       "Docket entry 08/21/2026 created from the written acknowledgement, not the send date, with reminders at 14 and 7 days and on the day.",
       "No reply sent on the time frame."
      ]
     },
     {
      "h": "6 · Where this memorandum is filed",
      "lines": [
       "CMS → Doc Hub → Others, named the firm's way, with both emails reproduced in full.",
       "CMS → Insurance tab → Demand: Time-Limited Demand yes, served 07/20/2026, received 07/22/2026, acceptance 08/21/2026.",
       "Your Backup Drive → 05 Insurance, Demands & Negotiation — the same copy, kept with the filing."
      ]
     }
    ],
    "establishes": [
     "Keystone acknowledged receipt in writing on 07/22/2026, in the adjuster's own words, so the start date comes from the carrier and not from us.",
     "The acceptance window therefore closes 08/21/2026, counted from her written acknowledgement and not from the send date.",
     "The package is complete at 81 pages, Exhibits A–J, so \"we never got all of it\" is answered by her own email.",
     "The time frame was raised, flagged and routed to Atty. Thorne. It was not an extension and was not granted.",
     "No valuation, no view of the offer and no agreement to any term was given by the Case Manager."
    ]
   }
  }
 }
};
