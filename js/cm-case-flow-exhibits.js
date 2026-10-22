/* The Case Flow's exhibit audits, completed-package reveals and service-confirmation emails.
   Assembled from build/case-flow/exhibits/*.json by build/case-flow/exhibits/assemble.cjs, written to EXHIBITSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_EXHIBITS = {
 "audits": {
  "d3m1-a1": {
   "title": "Exhibit Packet Audit — the Demand Package as drafted",
   "kicker": "Audit the enclosure set before Atty. Thorne signs anything.",
   "source": "RS61",
   "reveal": "RS62",
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
     "what": "Civic Repair Estimate, supplement and Diminished Value report",
     "as": "Fourteen pages from the Property Damage sub-file.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "Property Damage is a separate claim, KM-26-440871-PD, handled by a different adjuster. Putting it inside a bodily injury demand invites a release that reaches the Civic, and the Diminished Value fight has nothing to do with the $10,000 limit.",
     "fix": "Pull it. Keep the Civic's claim in its own file and make sure the demand says in terms that Property Damage is not part of the offer or any release under it.",
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
    "Acceptance runs 30 days from Keystone's receipt of the certified mailing, not from the date of the letter.",
    "A Limited Release of Robert Smith and Keystone Mutual only, preserving every UM/UIM claim and the Property Damage claim.",
    "Robert Smith's affidavit of no other insurance added as condition 3.",
    "Exhibits A–J, 81 pages, Bates LSH-DEM-000001–000081, each exhibit mapped to the section it proves.",
    "Received 07/22/2026, so the acceptance window closes 08/21/2026, docketed with reminders."
   ]
  },
  "d4m3-a1": {
   "title": "Section Audit — the Mediation Binder as drafted",
   "kicker": "Audit all six sections before Atty. Thorne approves delivery.",
   "source": "RS64",
   "reveal": "RS65",
   "due": "03/11/2027",
   "intro": "Atty. Grant Mercer says Keystone will not put a real number on the table while the medical ledger is unverified, and on this draft he is right: it was built from the providers' original bills. Two landmines are in the numbers; the rest are in what the set carries and what it leaves out.",
   "columns": {
    "ref": "Section",
    "as": "As drafted"
   },
   "items": [
    {
     "ref": "§1",
     "what": "Case snapshot sheet",
     "as": "Parties, counsel and mediator only; no start time, location or video link, and no fee split.",
     "verdict": "replace",
     "kind": "gap",
     "issue": "On the morning of 03/18/2027 nobody can tell from the binder where to be, when, or who pays the mediator. Atty. Mercer's contact was copied from the answer of 11/12/2026 and has not been verified since.",
     "fix": "Take the start time, location and the carrier's video link from the mediator's confirmation and the fee split from the mediation order; verify every contact and date it.",
     "proof": [
      "RS57"
     ]
    },
    {
     "ref": "§2",
     "what": "Confidential mediation statement",
     "as": "Nine pages, unmarked, with three copies tabbed for the mediator, defense counsel and the carrier.",
     "verdict": "replace",
     "kind": "privilege",
     "issue": "A confidential statement is for the mediator alone. Three tabbed copies hand our position, our concessions and our read of the gap straight to Atty. Mercer and to Keystone, and it cannot be undone.",
     "fix": "Mark every page for the mediator only, cut it to one copy, route it to Atty. Thorne for approval, and calendar its delivery with the binder.",
     "proof": [
      "RS57"
     ]
    },
    {
     "ref": "§2",
     "what": "Master Case Summary (internal)",
     "as": "Four pages of Atty. Thorne's internal summary, filed behind the statement \"for context\".",
     "verdict": "pull",
     "kind": "privilege",
     "issue": "It sets out our own gap risk, our own valuation and our internal dates. In a binder that three other people will hold, it is the single most damaging page in the set.",
     "fix": "Pull it to the attorney's set and tell Atty. Thorne it was in the draft. It never goes in a Demand Package, a Mediation Binder or an exhibit set.",
     "proof": [
      "RS04"
     ]
    },
    {
     "ref": "§3",
     "what": "The Complaint",
     "as": "The pre-filing draft: unsigned, no case number, Property Damage not pleaded.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "A superseded draft is not the operative pleading. It also omits the Property Damage count, so the binder understates what is actually in suit and invites an argument about what was pleaded at all.",
     "fix": "Replace it with the Complaint filed 09/24/2026, No. 26-CV-04417, and take the draft out of the binder set entirely.",
     "proof": [
      "RS50",
      "RS51"
     ]
    },
    {
     "ref": "§3",
     "what": "The defense map",
     "as": "Not in the set. The pleaded allegations sit in the answer with nothing opposite them.",
     "verdict": "add",
     "kind": "gap",
     "issue": "Every allegation in the answer of 11/12/2026 is already answerable from documents on this file. Without the map the mediator hears each one answered by a sentence instead of a page, and Atty. Thorne has to find the exhibit himself.",
     "fix": "Add the map: each pleaded allegation against the exhibit that answers it, by exhibit number. Flag the two legal questions for Atty. Thorne rather than answering them.",
     "proof": [
      "RS51",
      "RS09",
      "RS11"
     ]
    },
    {
     "ref": "§4",
     "what": "Doorbell-camera stills",
     "as": "Four stills, grayscale export of the 02/19/2026 working copy.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "The same grayscale export that failed QC in the Demand Package. It is the exhibit that answers \"the Escape entered out of turn\", and in grayscale the stop line is hard to read.",
     "fix": "Re-export the stills in color from the native file, hash unchanged, and enclose the preservation and chain-of-custody log.",
     "proof": [
      "RS09"
     ]
    },
    {
     "ref": "§4",
     "what": "Riverton Fire EMS Run Report and the event data recorder",
     "as": "Certified Run Report, and the vendor's download with its chain of custody attached.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "Together they answer the unbelted defense with data rather than testimony: \"restrained front-seat passenger\" on the date of loss, and the belt buckled at 11 mph.",
     "fix": "Confirm each chain of custody travels with its record, and that both are paired against the unbelted allegation in the defense map.",
     "proof": [
      "RS11"
     ]
    },
    {
     "ref": "§4",
     "what": "Keystone's acceptance of Property Damage liability and the deposition summary",
     "as": "Neither is in the set.",
     "verdict": "add",
     "kind": "gap",
     "issue": "Keystone accepted Property Damage liability in writing on 02/17/2026, and John Doe was deposed on 02/18/2027 with the certified transcript already on the file. The binder goes into the room without either.",
     "fix": "Add the 02/17/2026 letter behind §4, and a deposition summary with the transcript pages on the gap, the April break, the 2021 visits and the seatbelt. Its weight is Atty. Thorne's call.",
     "proof": [
      "RS32"
     ]
    },
    {
     "ref": "§5",
     "what": "The medical ledger",
     "as": "Typed from the bills in the file: Riverton Spine & Rehab $6,290.00, total $16,586.40.",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "The Demand Package served 07/20/2026 put the same damages at $16,401.40. Two numbers for one file is exactly the unverified ledger Atty. Mercer named, and the difference is the 05/04/2026 duplicate.",
     "fix": "Rebuild the ledger line by line from the certified bills in hand: 33 visits × $185.00 = $6,105.00, medical $14,817.40 plus wages $1,584.00 = $16,401.40.",
     "proof": [
      "RS23",
      "RS14",
      "RS62"
     ]
    },
    {
     "ref": "§5",
     "what": "Crescent Pain & Spine",
     "as": "Shown as a $3,400.00 open balance, and again as a $3,400.00 lien in the lien summary.",
     "verdict": "replace",
     "kind": "loophole",
     "issue": "Peach State paid Crescent $1,860.00 at the contract rate and the provider cannot bill the member the adjustment. Carried into the binder it concedes $3,400.00 that nobody is owed, straight out of John Doe's net.",
     "fix": "Show the charge satisfied by the plan's contract payment, proved by Peach State's EOB and the corrected $0.00 statement; open liens are Peach State $1,860.00 plus Riverton Spine & Rehab $6,105.00 = $7,965.00.",
     "proof": [
      "RS26",
      "RS41"
     ]
    },
    {
     "ref": "§5",
     "what": "Riverton Spine & Rehab's Final Itemized Ledger",
     "as": "Requested 02/08/2027, chased 02/22, red-flagged 03/01; still outstanding, and the line is not marked.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "An unqualified figure for a record we do not yet hold is how a ledger becomes unverifiable. The chase is the Case Manager's; whether to go further than a second request is not.",
     "fix": "Mark the line \"Pending Final Verification\", keep chasing the certified ledger, and put the subpoena question to Atty. Thorne with the request history.",
     "proof": [
      "RS23",
      "RS64"
     ]
    },
    {
     "ref": "§5",
     "what": "Property Damage",
     "as": "Loss of Use and Diminished Value folded into the same damages ledger.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "Property Damage sits outside the $40,000 stack and is contested separately. Mixed into the bodily injury ledger it inflates the Specials and lets the carrier attack the whole ledger through the Diminished Value dispute.",
     "fix": "Set Property Damage out in its own schedule: Loss of Use 48 days × $42.00 = $2,016.00; Diminished Value $3,600.00 on the appraisal against Keystone's $792.00.",
     "proof": [
      "RS62"
     ]
    },
    {
     "ref": "§5",
     "what": "Northgate wage-and-attendance letter",
     "as": "Signed original of 06/30/2026, with the 02/09–02/13/2026 call-out record attached.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "It proves the $1,584.00 wage claim and, separately, that John Doe was calling out of work with neck pain before he ever saw a provider.",
     "fix": "Confirm the call-out record stays attached to it, so the wage proof and the gap corroboration are read together.",
     "proof": [
      "RS43"
     ]
    },
    {
     "ref": "§6",
     "what": "Keystone's offer letter of 08/05/2026",
     "as": "The adjuster's own letter with her stated reasons for $3,500.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "The carrier's reasons in its own words are what the mediator needs to see, and they are the reasons the record already answers.",
     "fix": "Confirm it sits with the Negotiation Log so the offer and its answer are read together.",
     "proof": [
      "RS35"
     ]
    },
    {
     "ref": "§6",
     "what": "Negotiation Log, draft release and the UM consent requests",
     "as": "None of the three is in the set.",
     "verdict": "add",
     "kind": "gap",
     "issue": "Nobody in the room is sure of Keystone's last number, and if the file settles on the day there is no release to sign and no consent on the way to the UM carriers, so the money stops anyway.",
     "fix": "Add the Negotiation Log from the 07/20/2026 demand to the suit filed 09/24/2026, the draft Limited Release of Robert Smith and Keystone only, and both drafted consent requests.",
     "proof": [
      "RS62",
      "RS38"
     ]
    },
    {
     "ref": "—",
     "what": "The delivery date",
     "as": "Diaried 03/31/2027, the date read off the Scheduling Order.",
     "verdict": "replace",
     "kind": "calendar",
     "issue": "03/31/2027 is the court's deadline for the mediation to be completed, not the session date. The session is 03/18/2027 and the mediator's confirmation requires the statement and binder seven days before, so 03/31 is twenty days too late.",
     "fix": "Docket delivery for 03/11/2027 with the approval step ahead of it, and keep 03/31/2027 on the calendar as the court's completion deadline.",
     "proof": [
      "RS57",
      "RS55"
     ]
    },
    {
     "ref": "—",
     "what": "The master index",
     "as": "No exhibit numbers, no Bates ranges; the printed binder is the only copy of the order.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "Without numbers and ranges nobody can be sent to a page, and a printed binder that is the only index cannot be corrected once three people hold copies.",
     "fix": "Build the index in the CMS exhibit index, where it governs: every document in exactly one section with its number and Bates range, the PDF OCR-searchable and bookmarked.",
     "proof": [
      "RS64"
     ]
    }
   ],
   "revealNote": "The Mediation Binder as Atty. Thorne approved it on 03/10/2027 and the firm delivered it on 03/11/2027: six sections, 141 pages, with the defense map and the rebuilt ledger. The arbitration exhibits and Day 5 both start from it.",
   "revealPoints": [
    "Specials rebuilt to $16,401.40, the same figure the Demand Package served on 07/20/2026.",
    "Open liens $7,965.00: Peach State $1,860.00 and Riverton Spine & Rehab $6,105.00; Crescent $0.00.",
    "Riverton Spine & Rehab marked \"Pending Final Verification\" until its certified ledger arrives.",
    "All five pleaded allegations mapped to answering exhibits; two legal questions flagged, not answered.",
    "Section 2 marked for the mediator only, one copy; the Master Case Summary withdrawn to the attorney's set.",
    "Delivered 03/11/2027, seven days before the 03/18/2027 session; 03/31/2027 kept as the court's deadline."
   ]
  },
  "d4m3-a2": {
   "title": "Sorting & QC Audit — the arbitration exhibit folder",
   "kicker": "Sort into six tabs and apply each tab's QC rule as the record lands.",
   "source": "RS66",
   "reveal": "RS67",
   "due": "06/02/2027",
   "intro": "Harbor Point and Cardinal State are on the other side of this hearing now, and the folder still holds everything the litigation sub-file collected. Decide for each record which tab it belongs in, or that it is withheld — and apply the QC as you sort, not after.",
   "columns": {
    "ref": "Record",
    "as": "As it came out of the sub-file"
   },
   "items": [
    {
     "ref": "#1–3",
     "what": "BI tender, Limited Release and the dismissal of Robert Smith",
     "as": "Keystone's 08/12/2026 tender, the release signed 03/18/2027, and the term sheet.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "UM opens only once the bodily injury layer is exhausted. These are the threshold exhibits, and they lead the set: nothing about damages matters until exhaustion is proved.",
     "fix": "Place them at Tab 1 as the first exhibits, C-1 onward, with both Coverage Letters; hold the term sheet itself for Atty. Thorne's decision as a settlement document.",
     "proof": [
      "RS36",
      "RS38"
     ]
    },
    {
     "ref": "#4",
     "what": "Confidential Mediation Statement, 11 pages",
     "as": "In the pile, still marked for the mediator only.",
     "verdict": "pull",
     "kind": "privilege",
     "issue": "It was delivered to the mediator alone, and the carriers it was written about are now the opposing parties. Exchanging it hands Harbor Point and Cardinal State our position and our concessions in our own words.",
     "fix": "Withhold it from the exchange set and record why. A document marked for the mediator does not travel to the next forum.",
     "proof": [
      "RS65"
     ]
    },
    {
     "ref": "#10",
     "what": "Complaint — pre-filing draft",
     "as": "Unsigned, no case number, Property Damage not pleaded.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "A superseded draft offered as a pleading is an invitation to argue about what was actually pleaded, in a forum where the tort case is no longer the claim at all.",
     "fix": "Take it out of the set. The filed pleadings go to the attorney's set for Atty. Thorne's decision on whether the tort pleadings are exchanged here.",
     "proof": [
      "RS50"
     ]
    },
    {
     "ref": "#12",
     "what": "Riverton PD Traffic Crash Report",
     "as": "Public redacted portal copy: witness and party identifiers blacked out.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "The redactions remove the independent witness and the citation — the two things the report is in the set to prove. Offered this way it proves almost nothing.",
     "fix": "Order the certified complete report, redact only what this forum requires, and flag the citation's admissibility to Atty. Thorne rather than arguing it.",
     "proof": [
      "RS07"
     ]
    },
    {
     "ref": "#13",
     "what": "Doorbell-camera stills",
     "as": "Grayscale export, with the preservation log.",
     "verdict": "replace",
     "kind": "qc",
     "issue": "Third forum, same grayscale export. The carriers dispute damages, not liability, but the mechanism is what makes the injury credible, and an illegible still does not show it.",
     "fix": "Re-export in color from the native file, hash unchanged, and log the chain of custody with the exhibit.",
     "proof": [
      "RS09"
     ]
    },
    {
     "ref": "#14",
     "what": "Event data recorder download",
     "as": "Vendor report with chain of custody attached.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "Belt buckled, 11 mph: objective data on the mechanism, with a foundation already logged. It belongs in the liability tab as it stands.",
     "fix": "Log its authentication in the exhibit index with the rest of Tab 3, and keep the vendor's chain of custody with it.",
     "proof": [
      "RS66",
      "RS11"
     ]
    },
    {
     "ref": "#17",
     "what": "Provider bills and records, six providers",
     "as": "As received from portals and mailings; no certification from any provider, and none requested.",
     "verdict": "replace",
     "kind": "gap",
     "issue": "An uncertified record is a record a carrier can object to, and the whole $14,817.40 ledger rests on them. Thirty-six days before the exchange, nothing has been asked for.",
     "fix": "Request a certification from every provider and from Riverton Fire, Riverton PD and Northgate HR, and log each receipt. Nothing back in 14 days means a second request and a subpoena flag for Atty. Thorne.",
     "proof": [
      "RS66"
     ]
    },
    {
     "ref": "#18",
     "what": "Dr. Reyes — Causation Letter",
     "as": "Signed original of 06/19/2026, silent on the 2021 low-back visits.",
     "verdict": "flag",
     "kind": "gap",
     "issue": "Defense counsel pressed the prior-injury line at the 02/18/2027 deposition, and these carriers are citing the gap. The letter answers the gap and the degenerative reading, but says nothing about 2021.",
     "fix": "Pair it with the 2021 records, the providers' own histories and the deposition testimony, and flag to Atty. Thorne whether to seek a supplemental declaration from Dr. Reyes. That is his decision, not the Case Manager's.",
     "proof": [
      "RS19",
      "RS20"
     ]
    },
    {
     "ref": "#21",
     "what": "LSH intake questionnaire in the client's hand",
     "as": "The firm's own intake form, completed 02/09/2026.",
     "verdict": "pull",
     "kind": "privilege",
     "issue": "It is a source the firm works from, not evidence, and it carries the client's own rough first account — including the prior-history note our file had to correct. Exchanged, it becomes an impeachment exhibit against him.",
     "fix": "Withhold it. The records it pointed us to are the exhibits; the questionnaire itself stays in the file.",
     "proof": [
      "RS01",
      "RS02"
     ]
    },
    {
     "ref": "#22",
     "what": "John Doe's deposition transcript",
     "as": "Certified by the reporter, 02/18/2027.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "Certified sworn testimony that he had no prior neck complaint: the human half of the prior medical shield, alongside the 2021 records.",
     "fix": "Place it at Tab 5 with the pages on the gap, the April break, the 2021 visits and the seatbelt marked in the index.",
     "proof": [
      "RS66"
     ]
    },
    {
     "ref": "#23",
     "what": "Northgate wage-and-attendance letter",
     "as": "Signed original of 06/30/2026.",
     "verdict": "keep",
     "kind": "gap",
     "issue": "Nine shifts × 8 hours × $22.00 = $1,584.00, proved by the employer. Tab 6 takes wage proof and nothing else.",
     "fix": "Place it alone at Tab 6, with the 02/09–02/13/2026 call-out record attached to it.",
     "proof": [
      "RS43"
     ]
    },
    {
     "ref": "#24",
     "what": "Impasse memorandum and the Negotiation Log",
     "as": "Internal memorandum of 09/08/2026 setting out our own strategy, with the log of every offer.",
     "verdict": "flag",
     "kind": "privilege",
     "issue": "Work product and a record of settlement communications. A trainee who files it because it explains the history has put our strategy, and every number we discussed, in front of the carriers.",
     "fix": "Hold both in the attorney's set and put the privilege and exchange question to Atty. Thorne. Nothing is exchanged, and nothing is withheld, on the Case Manager's own decision.",
     "proof": [
      "RS66"
     ]
    },
    {
     "ref": "Lien",
     "what": "Harbor Point MedPay, $5,000.00",
     "as": "Listed on the attorney's-set Lien Sheet because MedPay paid $5,000.00 of the bills.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "Harbor Point gave up any reimbursement right in writing on 03/02/2026, and it is the carrier on the other side of this hearing. Working John Doe's net from a lien it does not hold costs him $5,000.00 it would never have asked for.",
     "fix": "Strike it, citing the 03/02/2026 letter in the threshold record. MedPay paying a bill does not create a lien.",
     "proof": [
      "RS28",
      "RS31"
     ]
    },
    {
     "ref": "Lien",
     "what": "Summit Imaging Center, $2,395.00",
     "as": "Listed at its invoice amount.",
     "verdict": "pull",
     "kind": "loophole",
     "issue": "MedPay paid Summit's invoice in full on 03/25/2026. The provider has no claim left to assert, so the line is $2,395.00 of John Doe's recovery given away to nobody.",
     "fix": "Strike it against the MedPay payment ledger. A bill that appears in the Specials is not a lien unless someone is still owed it.",
     "proof": [
      "RS25",
      "RS31"
     ]
    },
    {
     "ref": "Lien",
     "what": "Riverton Spine & Rehab, $6,290.00",
     "as": "Listed from the itemized ledger as received, 34 lines.",
     "verdict": "replace",
     "kind": "arithmetic",
     "issue": "The same 05/04/2026 duplicate, now inside the figure the attorney would negotiate the client's net from. Audited liens are $1,860.00 plus $6,105.00 = $7,965.00, not the $15,545.00 the sheet shows.",
     "fix": "Correct it to $6,105.00 against the Final Itemized Ledger and the attendance log, and reconcile the sheet to $7,965.00 before it goes to Atty. Thorne.",
     "proof": [
      "RS23",
      "RS14"
     ]
    },
    {
     "ref": "—",
     "what": "The arbitration brief's due date",
     "as": "Diaried 06/12/2027, ten days before the hearing.",
     "verdict": "replace",
     "kind": "calendar",
     "issue": "Ten days before the hearing lands on a Saturday. A brief diaried for a day the forum is not open is a brief filed late, in the one filing that frames the whole hearing.",
     "fix": "Count backward and docket the earlier business day, 06/11/2027, as configured for this training file; confirm the forum's rules with Atty. Thorne. Hold the Tab 1 slot for the final brief, never a draft.",
     "proof": [
      "RS58"
     ]
    },
    {
     "ref": "—",
     "what": "Exhibit numbering and the authentication log",
     "as": "The folder is unsorted and unnumbered: no C-numbers, no Bates ranges, no authentication column.",
     "verdict": "add",
     "kind": "qc",
     "issue": "At the hearing an exhibit nobody can cite is an exhibit nobody uses, and a record with no logged foundation is one the carriers can object to before it is read.",
     "fix": "Number C-1 onward in the order the tabs run, give each exhibit its Bates range matching its page count, and complete the authentication column before the 06/02/2027 exchange.",
     "proof": [
      "RS66"
     ]
    }
   ],
   "revealNote": "The Arbitration Binder as Atty. Thorne approved it on 05/29/2027 and the firm exchanged it on 06/02/2027: six tabs, exhibits C-1 to C-18, 174 pages, with the withheld-items list and the audited Lien Sheet.",
   "revealPoints": [
    "Threshold exhibits lead: the BI tender, both UM consents, the Limited Release and the dismissal.",
    "Every record certified and authenticated; Crescent's certification chased with a subpoena flag.",
    "Tab 5 pairs the 2021 low-back records and the deposition testimony with the MRI read and the Causation Letter.",
    "Lien Sheet audited from $15,545.00 to $7,965.00: MedPay, Summit and Crescent all at $0.00.",
    "Brief docketed 06/11/2027; exchange 06/02/2027; hearing 06/22/2027.",
    "Six items withheld on Atty. Thorne's recorded decision, each with its reason on the file."
   ]
  }
 },
 "emails": {
  "d3m1-a1": {
   "title": "Service Confirmation — the email the adjuster has to answer",
   "kicker": "Mail proves it left. The email makes the carrier admit when it landed.",
   "model": "RS63",
   "mail": {
    "channel": "Certified mail, return receipt requested",
    "sent": "07/20/2026",
    "proof": "USPS No. 9589 0710 5270 0412 7731 58",
    "receipt": "07/22/2026"
   },
   "to": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
   "cc": "Elijah Thorne <ethorne@lshlawgroup.example>",
   "subject": "Time-Limited Demand served today — John Doe / Robert Smith — Claim KM-26-440871",
   "attachment": "LSH-2026-MVA-770412_Doe-John_Demand-Package_2026-07-20.pdf (81 pp.)",
   "brief": "Write the email that goes out with the certified mailing. It must say what was served and how, say the clock runs from Keystone's receipt, and ask her to confirm the receipt date and that the set is complete. Terms and extensions go to Atty. Thorne.",
   "required": [
    {
     "id": "certified",
     "label": "Names the certified mailing and its tracking number",
     "hint": "Say it went by certified mail, return receipt requested, and give the number.",
     "match": [
      "certif",
      "9589\\s*0710\\s*5270\\s*0412\\s*7731\\s*58|958907105270041277315 8|9589071052700412773158"
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
     "label": "States that the 30 days run from receipt, not the date of the letter",
     "hint": "The window runs from receipt of the certified mailing. Say so in terms.",
     "match": [
      "30 day|thirty day",
      "receipt|receiv"
     ]
    },
    {
     "id": "ask",
     "label": "Asks her to confirm the receipt date and that the set is complete",
     "hint": "Ask for the date Keystone received the mailing and for confirmation the package is complete.",
     "match": [
      "confirm",
      "date"
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
    "body": "Confirming receipt. The certified envelope was delivered to our Riverton claims office this morning, July 22, and I signed for it. Your email of July 20 with the attachment is in the file as well; the PDF opens at 81 pages and the index runs A through J, so I show it complete.\n\nI have logged the demand as received 07/22/2026 and diaried it for evaluation. I will need to review the imaging and the treatment records before I can respond to the number. I may come back to you about the time frame."
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
    "type": "Others",
    "sections": [
     {
      "h": "1 · What was served, and how",
      "lines": [
       "BI Time-Limited Demand, signed by Atty. Elijah Thorne 07/20/2026, served the same day.",
       "Certified mail, return receipt requested, USPS No. 9589 0710 5270 0412 7731 58; green card returned bearing 07/22/2026.",
       "Email of 07/20/2026, 4:21 p.m., with the full Demand Package as one bookmarked PDF, 81 pages, Exhibits A–J."
      ]
     },
     {
      "h": "2 · The confirmation email the Case Manager sent",
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
       "Docket entry 08/21/2026 created from the receipt date, not the mailing date, with reminders at 14 and 7 days and on the day.",
       "No reply sent on the time frame."
      ]
     },
     {
      "h": "6 · Where this memorandum is filed",
      "lines": [
       "CMS → Doc Hub → Others, named the firm's way, with the return receipt appended.",
       "CMS → Insurance tab → Demand: Time-Limited Demand yes, served 07/20/2026, received 07/22/2026, acceptance 08/21/2026.",
       "Google Drive: LSH CMS Backups / <Case ID> <Client>, backed up from the case's Doc Hub."
      ]
     }
    ],
    "establishes": [
     "Keystone received the certified mailing on 07/22/2026, in the adjuster's own writing, matching the signed return receipt.",
     "The acceptance window therefore closes 08/21/2026, counted from receipt and not from the date of the letter.",
     "The package is complete at 81 pages, Exhibits A–J, so \"we never got all of it\" is answered by her own email.",
     "The time frame was raised, flagged and routed to Atty. Thorne. It was not an extension and was not granted.",
     "No valuation, no view of the offer and no agreement to any term was given by the Case Manager."
    ]
   }
  }
 }
};
