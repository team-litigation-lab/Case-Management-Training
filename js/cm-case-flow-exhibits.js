/* The Case Flow's exhibit audits, completed-package reveals and service-confirmation emails.
   Assembled from build/case-flow/exhibits/*.json by build/case-flow/exhibits/assemble.cjs, written to EXHIBITSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_EXHIBITS = {
 "audits": {
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
  "d3m2-rel": {
   "title": "Release Clause Audit — Keystone's draft release",
   "kicker": "Call every clause before John Doe sees a word of it.",
   "source": "RS37",
   "reveal": "RS80",
   "due": "08/14/2026",
   "intro": "Keystone tendered its $10,000 limits on 08/12/2026 and sent its own release form today, with a cover letter holding the check until both UM carriers consent and waive subrogation. Measure every clause against the demand's terms and the claims still open on this file, propose the fix, and leave every decision to Atty. Thorne.",
   "columns": {
    "ref": "Clause",
    "as": "As Keystone drafted it"
   },
   "items": [
    {
     "ref": "Cover",
     "what": "Keystone's payment condition: each UM carrier's consent and subrogation waiver",
     "as": "No check issues until Harbor Point's and Cardinal State's written consents and waivers arrive with the executed release and the W-9.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "A fair condition: a UM carrier that keeps its subrogation right could later pursue Robert Smith. It also matches what John Doe needs before signing, so the two tasks run together.",
     "fix": "Log it as a payment condition, tie the signing task to both consents (requested 08/13/2026), and send the waivers with the executed release.",
     "proof": [
      "RS37",
      "RS36"
     ]
    },
    {
     "ref": "Caption",
     "what": "Claimant, insured, policy and date of accident",
     "as": "John Doe; Robert Smith; policy KMI-PA-7731045; claim KM-26-440871; accident 02/06/2026 at Maple Hollow Road and Birch Avenue.",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Every identifier matches Keystone's Declaration Page and the tender letter, so the release attaches to the right claim and nothing has to be reissued for a typo.",
     "fix": "Confirm each number against the Declaration Page and the tender letter before the release is routed.",
     "proof": [
      "RS36",
      "RS32"
     ]
    },
    {
     "ref": "Recital",
     "what": "Consideration: $10,000.00",
     "as": "Ten thousand and 00/100 dollars ($10,000.00), the sole consideration.",
     "verdict": "keep",
     "kind": "qc",
     "issue": "The figure is Keystone's full BI limit as tendered on 08/12/2026 and as the demand asked; a release for less would be a different settlement.",
     "fix": "Confirm the amount against the tender letter; any change is Atty. Thorne's.",
     "proof": [
      "RS36",
      "RS67"
     ]
    },
    {
     "ref": "Recital",
     "what": "Parties released: Robert Smith and Keystone Mutual",
     "as": "Robert Smith and Keystone Mutual Insurance, and their agents, employees, heirs, successors and assigns.",
     "verdict": "keep",
     "kind": "qc",
     "issue": "These are the parties the demand offered to release, and the parties both UM carriers consented to John Doe releasing.",
     "fix": "Keep the named parties exactly as written; confirm against the demand's Limited Release term.",
     "proof": [
      "RS67",
      "RS37"
     ]
    },
    {
     "ref": "Recital",
     "what": "Catch-all discharge of every other person and insurer",
     "as": "“and all other persons, firms, corporations and insurers, whether herein named or not”.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "Harbor Point and Cardinal State are insurers. Signed as drafted, the release would discharge both UM claims: $30,000 of John Doe's $40,000 stack, gone for a $10,000 check.",
     "fix": "Propose: Robert Smith and Keystone only, “and no other person, firm, corporation or insurer”. Quote the words exactly in the review to Atty. Thorne.",
     "proof": [
      "RS37",
      "RS28",
      "RS29"
     ]
    },
    {
     "ref": "Recital",
     "what": "Claims released: bodily injury, Property Damage and Loss of Use",
     "as": "“including all claims for bodily injury, Property Damage and Loss of Use”.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "The Civic's Property Damage and loss-of-use claim is Margaret Doe's, open with Leah Moran on KM-26-440871-PD. John Doe cannot release it, and Keystone PD would cite the wording against it.",
     "fix": "Propose: the bodily injury claim only, with the Civic's claim expressly reserved. Route to Atty. Thorne.",
     "proof": [
      "RS32",
      "RS37"
     ]
    },
    {
     "ref": "—",
     "what": "Reservation of the UM/UIM claims",
     "as": "Nothing in the release preserves John Doe's claims against Harbor Point or Cardinal State.",
     "verdict": "add",
     "kind": "gap",
     "issue": "Even with the catch-all struck, a silent release invites Harbor Point or Cardinal State to argue the UM claims were compromised. The protection should sit on the face of the document.",
     "fix": "Propose a clause reserving the UM/UIM claims by carrier, policy and claim number: HP-26-7741 and CS-26-20355. Atty. Thorne approves the wording.",
     "proof": [
      "RS28",
      "RS29"
     ]
    },
    {
     "ref": "§1",
     "what": "No admission of liability",
     "as": "The payment compromises a disputed claim and is not an admission of liability by the released parties.",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Standard: Keystone pays to end the claim, not to admit fault. It costs John Doe nothing and is in every release of this kind.",
     "fix": "Keep as drafted.",
     "proof": [
      "RS37"
     ]
    },
    {
     "ref": "§2",
     "what": "Unknown injuries",
     "as": "Injuries may be permanent and progressive; the releasor relies on his own judgment of their nature and extent.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "Dr. Reyes noted possible repeat injections ($3,400–$6,800). Whether this clause stands, and how it is explained to John Doe, is legal advice.",
     "fix": "Flag it for Atty. Thorne with the future-care note attached; he decides and goes through it with John Doe before signing.",
     "proof": [
      "RS37",
      "RS67"
     ]
    },
    {
     "ref": "§3",
     "what": "Confidentiality of the settlement and the release",
     "as": "Terms, amount and the release itself not to be disclosed to any person, firm or insurer, with narrow exceptions.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "Confidentiality was never a term of the demand, and the UM carriers need the signed release as proof of exhaustion. Signed, it would put the UM demands of 08/31/2026 in breach.",
     "fix": "Propose striking the clause; route to Atty. Thorne with the demand's terms beside it.",
     "proof": [
      "RS67",
      "RS37"
     ]
    },
    {
     "ref": "§4",
     "what": "Liens: indemnify, defend and hold harmless",
     "as": "Releasor warrants every lien is paid and will indemnify, defend and hold harmless, including attorney's fees and costs.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "An open-ended duty to defend and pay fees on any lien, unlimited in amount, when the file's liens are known: Peach State and Riverton Spine & Rehab.",
     "fix": "Propose: the liens on the file paid from the firm's trust account; hold harmless limited to the settlement proceeds; no duty to defend, no fees. Atty. Thorne decides.",
     "proof": [
      "RS37",
      "RS67"
     ]
    },
    {
     "ref": "§5",
     "what": "Medicare representation",
     "as": "Releasor is not and has never been a Medicare beneficiary; no conditional payments.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "John Doe signs it as a statement of fact. The facts must come from the file, not from assumption: born 08/14/1991, employed at Northgate, no Medicare.",
     "fix": "Verify the facts from the intake and the Day 2 check, attach them, and flag the clause for Atty. Thorne's approval.",
     "proof": [
      "RS01",
      "RS37"
     ]
    },
    {
     "ref": "—",
     "what": "Payment date",
     "as": "The release says nothing about when Keystone must pay after it is signed.",
     "verdict": "add",
     "kind": "calendar",
     "issue": "Without a date the check can drift while John Doe's release is already signed, and the UM demands wait on proof of payment.",
     "fix": "Propose a payment term for Atty. Thorne to set; docket it once Keystone agrees.",
     "proof": [
      "RS67",
      "RS37"
     ]
    },
    {
     "ref": "§6",
     "what": "Entire agreement; governing law",
     "as": "Governed by “the laws of the state in which it is signed”.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "Which law governs a release is a legal question, and a vague choice-of-law line can matter if the release is ever disputed.",
     "fix": "Flag for Atty. Thorne; record his decision on the redline.",
     "proof": [
      "RS37"
     ]
    },
    {
     "ref": "Execution",
     "what": "Signature, witness and notary block",
     "as": "John Doe, Releasor; witness; notary jurat; approved as to form by Atty. Thorne.",
     "verdict": "keep",
     "kind": "qc",
     "issue": "Keystone requires a notarized wet-ink original, and the block provides for it. Nothing is signed until the amended release and both consents are in.",
     "fix": "Keep. Plan the signing: notary, photo ID in the name John Doe, Atty. Thorne's review first.",
     "proof": [
      "RS37"
     ]
    }
   ],
   "revealNote": "The release as Atty. Thorne approved it on 08/17/2026 and Keystone reissued it on 08/19/2026, ready for John Doe's signature. Every later step on this file works from it, and the executed copy follows.",
   "revealPoints": [
    "Robert Smith and Keystone only, “and no other person, firm, corporation or insurer”: the UM claims are safe.",
    "The bodily injury claim only; HP-26-7741, CS-26-20355 and the Civic's claim KM-26-440871-PD reserved.",
    "Confidentiality struck; the lien clause limited to the liens on the file, paid from trust, no defense or fees.",
    "Payment within 14 days of Keystone's receipt of the executed release and the W-9.",
    "Unknown injuries kept, Medicare kept as verified, State of Riverton law: Atty. Thorne's decisions."
   ]
  },
  "d3m4-pal": {
   "title": "Lien Investigation — Vance & Kettering's charging lien",
   "kicker": "Test every claim in the notice against the file; leave every conclusion to Atty. Thorne.",
   "source": "RS84",
   "reveal": "RS85",
   "due": "10/15/2026",
   "intro": "Six days before disbursement an outside firm claims a charging lien and $6,666.67 of the fee, on an agreement dated 07/27/2026. Work its notice, agreement and time record item by item against the file, decide what goes into the evidentiary packet for Atty. Thorne, and what is his alone to decide.",
   "columns": {
    "ref": "Claim",
    "as": "As Vance & Kettering puts it"
   },
   "items": [
    {
     "ref": "Notice",
     "what": "Notice of charging lien, dated 10/13/2026",
     "as": "Emailed to Atty. Thorne and the case manager; received 10/14/2026.",
     "verdict": "keep",
     "kind": "calendar",
     "issue": "The notice itself is the trigger: its receipt date starts the file's response and sets what is held before the 10/22/2026 disbursement.",
     "fix": "Log it on receipt in the Communications Log, route it to Atty. Thorne the same day, and send nothing to the firm.",
     "proof": [
      "RS84"
     ]
    },
    {
     "ref": "Agreement",
     "what": "The Contingency Fee Agreement of 07/27/2026",
     "as": "33⅓% of any gross recovery; binding when signed by the client or the client's representative.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The firm's own document is the core exhibit: it shows exactly who signed, when, and with what authority attached.",
     "fix": "Keep the complete copy as received, every page, in the packet and the CMS.",
     "proof": [
      "RS84"
     ]
    },
    {
     "ref": "Client",
     "what": "Who the client is said to be",
     "as": "“John Doe (by Margaret Doe, mother)”.",
     "verdict": "replace",
     "kind": "gap",
     "issue": "John Doe is an adult, born 08/14/1991. The agreement attaches no power of attorney or other authority for his mother to act for him; the framing assumes what it must prove.",
     "fix": "State the facts in the packet instead: adult client, signer Margaret Doe, no authority attached. No conclusion.",
     "proof": [
      "RS84",
      "RS01"
     ]
    },
    {
     "ref": "Signatures",
     "what": "Signature lines on the agreement",
     "as": "Margaret Doe signed as “mother”; the line for John Doe is blank.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The blank client line is the single most important fact in the dispute, and the copy shows it plainly.",
     "fix": "Keep it, and put it beside John Doe's own signatures for comparison.",
     "proof": [
      "RS84"
     ]
    },
    {
     "ref": "—",
     "what": "John Doe's signature exemplars",
     "as": "The notice offers nothing to compare the agreement against.",
     "verdict": "add",
     "kind": "gap",
     "issue": "Without exemplars the packet asserts rather than shows. John Doe signed the firm's fee agreement and HIPAA authorization on 02/09/2026.",
     "fix": "Add both 02/09/2026 documents to a signature comparison table in the packet.",
     "proof": [
      "RS05",
      "RS06"
     ]
    },
    {
     "ref": "—",
     "what": "The representation timeline",
     "as": "The notice gives only its own date of retention, 07/27/2026.",
     "verdict": "add",
     "kind": "calendar",
     "issue": "LSH Law Group was engaged 02/09/2026 and served the demand 07/20/2026, before the agreement existed, with no discharge or substitution anywhere on the file.",
     "fix": "Add a dated timeline cross-referencing the agreement against the firm's engagement milestones, each line sourced.",
     "proof": [
      "RS05",
      "RS34"
     ]
    },
    {
     "ref": "Services",
     "what": "“Substantial services”: investigation, consultation, evaluation",
     "as": "The firm says it performed substantial services and helped obtain the $40,000.00.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "Its own time record shows 0.6 hours: an intake with Margaret Doe and a welcome letter to her. Nothing on the claim, and no document on the file is theirs.",
     "fix": "Replace the claim in the packet with the work-product audit: the time record's entries quoted, against the file's own work.",
     "proof": [
      "RS84",
      "RS44"
     ]
    },
    {
     "ref": "Carriers",
     "what": "“Placed the responsible carriers on notice”",
     "as": "Asserted in the notice, with no letter or date given.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "Every carrier letter on the file is addressed to LSH Law Group; Keystone, Harbor Point and Cardinal State show no notice from Vance & Kettering.",
     "fix": "Replace with what the carrier correspondence shows, each letter cited by date.",
     "proof": [
      "RS32",
      "RS38",
      "RS39"
     ]
    },
    {
     "ref": "Time record",
     "what": "Enclosure 2: the firm's time record",
     "as": "0.4 hours on 07/27/2026 and 0.2 hours on 07/29/2026, both with Margaret Doe; no other entries.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The firm's own record of what it did. It is the best evidence of the work actually done, in its own words.",
     "fix": "Keep it whole in the packet; quote it, never characterize it.",
     "proof": [
      "RS84"
     ]
    },
    {
     "ref": "—",
     "what": "John Doe's own account",
     "as": "The notice speaks for the client without his word.",
     "verdict": "add",
     "kind": "gap",
     "issue": "Only John Doe can say whether he ever retained the firm. Without his account the packet rests on documents alone.",
     "fix": "On Atty. Thorne's instruction, ask him neutrally on a recorded call, log his words, and give no view on the lien.",
     "proof": [
      "RS05"
     ]
    },
    {
     "ref": "—",
     "what": "The settlement hold and the Action Plan",
     "as": "The notice asks the firm to hold the entire settlement.",
     "verdict": "add",
     "kind": "calendar",
     "issue": "The 10/22/2026 disbursement depends on this dispute. A hold no one recorded is a hold no one releases.",
     "fix": "Place the hold Atty. Thorne directs, $6,666.67, in the CMS Trust Ledger; update the Action Plan; record who may release it.",
     "proof": [
      "RS84",
      "RS44"
     ]
    },
    {
     "ref": "Demand",
     "what": "One-half of the fee: $6,666.67",
     "as": "Half of the one-third fee on a $40,000.00 gross.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "Whether any fee is owed, and how much, is a legal determination between lawyers.",
     "fix": "Flag for Atty. Thorne. The Case Manager never discusses, accepts or counters a fee division.",
     "proof": [
      "RS84"
     ]
    },
    {
     "ref": "Lien",
     "what": "The charging lien and any quantum meruit claim",
     "as": "A charging lien against the settlement proceeds.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "Validity, and whether quantum meruit applies at all where no engagement may exist, are Atty. Thorne's calls.",
     "fix": "List them in the packet as questions for Atty. Thorne, beside the facts that bear on them.",
     "proof": [
      "RS84"
     ]
    },
    {
     "ref": "Ask",
     "what": "“Your case manager” to confirm the fee division by 10/16",
     "as": "The notice asks the case manager to confirm the split in writing.",
     "verdict": "flag",
     "kind": "loophole",
     "issue": "Any reply from the Case Manager, even a refusal, is the firm speaking on a fee dispute, and could be quoted back.",
     "fix": "No reply. Flag the request to Atty. Thorne; he answers the lawyer.",
     "proof": [
      "RS84"
     ]
    }
   ],
   "revealNote": "The evidentiary packet as delivered to Atty. Thorne on 10/15/2026: facts only, each sourced. He repudiated the lien on 10/16; Vance & Kettering withdrew it on 10/19/2026, and he released the hold.",
   "revealPoints": [
    "The agreement of 07/27/2026 is signed only by Margaret Doe; John Doe's line is blank and no authority is attached.",
    "LSH Law Group was engaged 02/09/2026 and served the demand 07/20/2026, before that agreement.",
    "The firm's time record shows 0.6 hours with Margaret Doe; no carrier received notice from it.",
    "John Doe's account of 10/15: he never contacted or signed with the firm.",
    "$6,666.67 held in trust on Atty. Thorne's instruction; validity and any response left to him."
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
  },
  "d3m2-rel": {
   "title": "Release Review — the clause audit routed to Atty. Thorne",
   "kicker": "You propose the amendments. Atty. Thorne approves them, in writing, before anyone signs.",
   "words": {
    "label": "Release Review to Atty. Thorne",
    "write": "Your clause review and amendments",
    "send": "Send it to Atty. Thorne",
    "reply": "Atty. Thorne's written approval"
   },
   "model": "RS82",
   "sent": "08/14/2026",
   "to": "Elijah Thorne <ethorne@lshlawgroup.example>",
   "cc": "",
   "subject": "For your review and approval: Keystone draft release — John Doe — KM-26-440871",
   "attachment": "LSH-2026-MVA-770412_Doe-John_Release-Clause-Review_2026-08-14.pdf",
   "brief": "Write the email that routes your clause review to Atty. Thorne. Say what the catch-all would release, what else the draft reaches or adds, list your proposed amendments, flag the clauses that are his to decide, and confirm nothing has gone to John Doe.",
   "required": [
    {
     "id": "catchall",
     "label": "Names the catch-all and the UM claims it would release",
     "hint": "Quote the insurers line and say it would release Harbor Point and Cardinal State.",
     "match": [
      "insurer",
      "harbor point|cardinal|\\bUM\\b|uninsured"
     ]
    },
    {
     "id": "property",
     "label": "Says the release reaches the Civic's open Property Damage claim",
     "hint": "The draft releases Property Damage and Loss of Use: the Civic's claim is Margaret's and still open.",
     "match": [
      "Property Damage|Loss of Use|civic"
     ]
    },
    {
     "id": "confidential",
     "label": "Raises the confidentiality clause",
     "hint": "Confidentiality was never a demand term, and the UM carriers need the release.",
     "match": [
      "confidential"
     ]
    },
    {
     "id": "amend",
     "label": "Proposes the amendments for his approval",
     "hint": "Say what you propose for each clause, and that the decision is his.",
     "match": [
      "amend|propos|redline|revis",
      "approv|review|decid"
     ]
    },
    {
     "id": "flags",
     "label": "Flags the clauses that are his to decide",
     "hint": "Unknown injuries, Medicare and governing law: name them as his call.",
     "match": [
      "medicare|unknown injur|governing law"
     ]
    },
    {
     "id": "client",
     "label": "Confirms nothing has gone to John Doe for signature",
     "hint": "Say the draft has not been sent to the client and won't be until he approves.",
     "match": [
      "john|client|mr\\.? doe",
      "not (been )?sent|haven't sent|have not sent|not gone|nothing (has )?(gone|been sent)|withheld|will not send|won't send|not (be )?(sent|shown)"
     ]
    }
   ],
   "reply": {
    "from": "Elijah Thorne <ethorne@lshlawgroup.example>",
    "date": "08/17/2026",
    "time": "9:40 a.m.",
    "subject": "RE: For your review and approval: Keystone draft release — John Doe — KM-26-440871",
    "body": "Approved as you proposed. Payment within 14 days of Keystone's receipt of the executed release and our W-9. Keep the unknown-injuries clause; I will go through it with John. Keep the Medicare representation as verified. Riverton law.\n\nI have sent the redline to Dana Whitfield this morning. Do not send anything to John until Keystone issues the revised release and both consents are in."
   },
   "press": {
    "from": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
    "date": "08/18/2026",
    "subject": "RE: Doe release — side letter?",
    "body": "Mr. Thorne's redline is with my unit manager and could take a while. To keep things moving, could your client sign our standard form now? We can paper the changes in a side letter afterwards, and I could get the check out next week.",
    "choices": [
     {
      "label": "Send John Doe the standard form now so the check is not delayed.",
      "ok": false,
      "why": "John Doe would sign a release that discharges both UM carriers. A side letter promised later protects nothing he has already signed."
     },
     {
      "label": "Agree to the side letter if she confirms it by email.",
      "ok": false,
      "why": "That is agreeing release terms with the adjuster, which is Atty. Thorne's alone, and on terms he has just rejected."
     },
     {
      "label": "Reply that nothing goes to the client except the release Atty. Thorne approves, and forward her email to him the same day.",
      "ok": true,
      "why": "Correct. Nothing is agreed or argued; the request is logged and routed, and John Doe signs only the approved Limited Release."
     },
     {
      "label": "Tell her the catch-all clause would be unenforceable anyway.",
      "ok": false,
      "why": "That is a legal opinion given to the other side. It is not the Case Manager's to give, and it invites her to say signing is harmless."
     }
    ]
   },
   "convert": {
    "title": "Release Clause Review & Attorney Approval — memorandum to file",
    "category": "Others",
    "type": "Release-Review",
    "folder": "insurance",
    "sections": [
     {
      "h": "1 · What the review found",
      "lines": [
       "Keystone's Release of All Claims, Form KM-REL-100, received 08/14/2026 with Dana Whitfield's cover letter.",
       "Catch-all: would release Harbor Point and Cardinal State, $30,000 of the stack. Property Damage and Loss of Use: the Civic's claim is Margaret Doe's.",
       "No UM reservation; a confidentiality clause; an unlimited indemnify-and-defend clause; no payment date.",
       "Unknown injuries, Medicare and governing law flagged for Atty. Thorne."
      ]
     },
     {
      "h": "2 · The confirmation email routing the review",
      "lines": []
     },
     {
      "h": "3 · Atty. Thorne's written approval",
      "lines": [
       "Approved 08/17/2026, 9:40 a.m.: amendments as proposed; payment within 14 days; Riverton law.",
       "Redline sent to Dana Whitfield by Atty. Thorne the same morning."
      ]
     },
     {
      "h": "4 · What the approval establishes",
      "lines": []
     },
     {
      "h": "5 · Where this memorandum is filed",
      "lines": [
       "CMS → Doc Hub → Others, named the firm's way.",
       "CMS → Tasks: signing held until both UM consents are in writing.",
       "Your Backup Drive → Insurance, Demands & Negotiation — the same copy, kept with the filing."
      ]
     }
    ],
    "establishes": [
     "Every amendment was Atty. Thorne's decision, in writing, before any term reached the adjuster or John Doe.",
     "The UM claims and the Civic's claim are protected on the face of the release.",
     "The request to sign the standard form first was routed, not answered by the Case Manager.",
     "Keystone accepted the changes and issued its Limited Release on 08/19/2026."
    ]
   }
  },
  "d3m2-exec": {
   "title": "Executed Release — the transmittal to Keystone and the check",
   "kicker": "A complete packet once: release, both waivers, W-9. Then the check, in writing.",
   "words": {
    "label": "Executed Release to Keystone",
    "write": "The email that transmits the release",
    "send": "Send it to the adjuster",
    "reply": "The adjuster's acknowledgment and check date"
   },
   "model": "RS81",
   "sent": "08/28/2026",
   "to": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
   "cc": "Elijah Thorne <ethorne@lshlawgroup.example>",
   "subject": "Executed Limited Release, UM consents and W-9 — John Doe / Robert Smith — Claim KM-26-440871",
   "attachment": "LSH-2026-MVA-770412_Doe-John_Executed-Limited-Release_2026-08-28.pdf (with both UM consents and the W-9)",
   "brief": "Write the email that sends the executed packet to the adjuster. List what is attached, say the original follows by courier, point to the payment term, and ask her to confirm receipt and the check date in writing. Terms and payee questions go to Atty. Thorne.",
   "required": [
    {
     "id": "release",
     "label": "Says the Limited Release is attached, signed and notarized",
     "hint": "Name the executed Limited Release and that it was signed before a notary on 08/28.",
     "match": [
      "release",
      "sign|execut",
      "notar"
     ]
    },
    {
     "id": "waivers",
     "label": "Encloses both UM consents and subrogation waivers",
     "hint": "Keystone made both waivers a payment condition: name Harbor Point and Cardinal State.",
     "match": [
      "harbor point",
      "cardinal",
      "waiver|consent"
     ]
    },
    {
     "id": "w9",
     "label": "Encloses the firm's W-9",
     "hint": "Keystone asked for the W-9 with the release.",
     "match": [
      "w-?9"
     ]
    },
    {
     "id": "original",
     "label": "Says the wet-ink original follows by courier",
     "hint": "Keystone requires the original; say how and when it is coming.",
     "match": [
      "original",
      "courier|overnight|mail"
     ]
    },
    {
     "id": "ask",
     "label": "Asks her to confirm receipt and the check date in writing",
     "hint": "Ask for written confirmation of receipt and when the check issues.",
     "match": [
      "confirm",
      "check",
      "date|when|issue"
     ]
    },
    {
     "id": "upl",
     "label": "Routes terms and payee questions to Atty. Thorne",
     "hint": "Point any question about terms or the payee to Atty. Thorne, by name.",
     "match": [
      "thorne",
      "term|payee|question"
     ]
    }
   ],
   "reply": {
    "from": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
    "date": "08/31/2026",
    "time": "9:12 a.m.",
    "subject": "RE: Executed Limited Release, UM consents and W-9 — John Doe / Robert Smith — Claim KM-26-440871",
    "body": "Received your email of August 28 with the executed Limited Release, both UM consents and waivers, and the W-9. The original release arrived by courier this morning, August 31. The file is complete for payment.\n\nThe $10,000.00 check will issue tomorrow, 09/01, payable to John Doe and LSH Law Group, by mail to your office."
   },
   "press": {
    "from": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
    "date": "09/01/2026",
    "subject": "RE: Doe settlement check 0048213",
    "body": "Check no. 0048213 issued this morning. One thing from our payment unit: Peach State's reimbursement notice is in our file. Should we have added Peach State as a payee, or can you just confirm in writing that your firm will protect Keystone on that lien? Either way I'd like to close this out today.",
    "choices": [
     {
      "label": "Confirm in writing that the firm will protect Keystone on the Peach State lien.",
      "ok": false,
      "why": "That is a new term of the settlement, given by the Case Manager. The lien terms are in §4 of the release, and only Atty. Thorne speaks to them."
     },
     {
      "label": "Ask her to reissue the check with Peach State as a co-payee.",
      "ok": false,
      "why": "Changing the payee changes the settlement and can stall John Doe's money for weeks. It is Atty. Thorne's decision."
     },
     {
      "label": "Reply that payee and lien questions are Atty. Thorne's, forward her email to him the same day, and log it.",
      "ok": true,
      "why": "Correct. Nothing is promised or changed; the question reaches the person who can answer it, and the check stays as issued until he says otherwise."
     }
    ]
   },
   "convert": {
    "title": "BI Settlement Record — executed release, transmittal and check",
    "category": "Others",
    "type": "BI-Settlement-Record",
    "folder": "insurance",
    "sections": [
     {
      "h": "1 · The settlement packet, as executed and sent",
      "lines": [
       "Limited Release, Form KM-REL-100-L, signed by John Doe 08/28/2026 before notary Renee Castillo, after Atty. Thorne went through it with him.",
       "Harbor Point consent and waiver 08/24/2026; Cardinal State consent and waiver 08/26/2026; the firm's W-9.",
       "Original by overnight courier, received by Keystone 08/31/2026."
      ]
     },
     {
      "h": "2 · The confirmation email that transmitted the release",
      "lines": []
     },
     {
      "h": "3 · The adjuster's acknowledgment and check confirmation",
      "lines": []
     },
     {
      "h": "4 · What the exchange establishes",
      "lines": []
     },
     {
      "h": "5 · The money and where the record is filed",
      "lines": [
       "Keystone check no. 0048213, $10,000.00, issued 09/01/2026; received and deposited to IOLTA 09/04/2026.",
       "Check copy to Marcus Bell and Teresa Okafor, 09/04/2026.",
       "CMS → Doc Hub → Others, named the firm's way; your Backup Drive → Insurance, Demands & Negotiation."
      ]
     }
    ],
    "establishes": [
     "Keystone received the executed release, both UM waivers and the W-9 on 08/31/2026, in its adjuster's own words.",
     "Keystone's payment condition, each UM carrier's consent and waiver, was met in full.",
     "Check no. 0048213 issued 09/01/2026, inside the 14 days of §6, and reached trust 09/04/2026.",
     "The payee question went to Atty. Thorne; the Case Manager gave no lien assurance."
    ]
   }
  }
 }
};
