/* The Case Flow simulation: what lands on John Doe's file to start each Skill Activity (events), the live call
   in every Case Phase (calls), what a skipped step costs later (fallout) and the case's milestones (timeline).
   Assembled from build/case-flow/sim/*.json by build/case-flow/sim/assemble.cjs, written to SIMSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SIM = {
 "events": {
  "d1m1-open": {
   "date": "02/09/2026",
   "time": "1:12 p.m.",
   "channel": "email",
   "from": "On the Records Intake (intake@ontherecords.example)",
   "to": "Case Manager",
   "subject": "New matter: John Doe — MVA 02/06/2026 (passenger)",
   "body": "New file for LSH Law Group: John Doe, front-seat passenger, collision 02/06/2026 at Maple Hollow Rd and Birch Ave. Attached: the New Client Intake Sheet, intake supplement, the retainer and HIPAA authorization he signed here this morning, and the Riverton PD crash report. A colleague keyed a draft intake record into the CMS. Atty. Thorne wants the matter active today.",
   "attachments": [
    "RS01",
    "RS02",
    "RS05",
    "RS06",
    "RS07"
   ]
  },
  "d1m3-a1": {
   "date": "02/10/2026",
   "time": "8:47 a.m.",
   "channel": "voicemail",
   "from": "Northgate Distribution (555) 010-3950",
   "to": "Case Manager, ext. 214",
   "subject": "Voicemail: John Doe — call from the other driver's insurance",
   "body": "Hey, it's John Doe. I signed with Mr. Thorne yesterday. Last night Dana from Keystone Mutual, the other guy's insurance, asked what happened and if she could record it. I said I'd think about it; she's calling back today. I haven't gotten anything from you guys. My neck's still stiff. I'm at work, so call my cell: 555-010-2288.",
   "spoken": "Hey, uh... this is John Doe. I signed with Mr. Thorne yesterday, for the car accident. So, last night, somebody from Keystone Mutual called me. That's the other guy's insurance. A lady... Dana, I think. She was asking what happened, and if she could record it. I didn't know what to tell her, so I said I'd think about it, and she said she'd call me back today. And, um, I haven't gotten anything from you guys yet. No paperwork, nothing. My neck's still stiff. It's worse in the morning. Can you call me back? I'm calling from work, but call my cell. It's five five five, oh one oh, two two eight eight. Okay. Thanks. Bye.",
   "listen": [
    {
     "q": "Who left the message, and which number does he want you to call back?",
     "a": "John Doe, on his cell: (555) 010-2288. The caller ID is his work line at Northgate, not the number to call.",
     "match": [
      "john",
      "2288"
     ]
    },
    {
     "q": "Who contacted him, and what did they ask for?",
     "a": "Dana, from Keystone Mutual (the other driver's insurance): what happened, and to record it.",
     "match": [
      "keystone",
      "record"
     ]
    },
    {
     "q": "What did he tell her, and when will she try again?",
     "a": "He said he'd think about it, and she said she'd call him back today.",
     "match": [
      "think|today|call(s|ing|ed)? (him )?back|again"
     ]
    },
    {
     "q": "How is he feeling?",
     "a": "His neck is still stiff, and it's worse in the morning.",
     "match": [
      "neck",
      "stiff|sore|pain|hurt"
     ]
    },
    {
     "q": "What hasn't he received from the firm?",
     "a": "Anything at all yet: no paperwork from the firm.",
     "match": [
      "nothing|anything|paperwork|packet|letter|welcome|onboarding|documents?"
     ]
    }
   ]
  },
  "d1m3-a2": {
   "date": "02/11/2026",
   "time": "8:05 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Onboarding directions staged as task cards: review before activation",
   "body": "LSH-2026-MVA-770412. John Doe's Direction Packet was delivered and logged 02/10/2026. Its directions are staged as draft task cards; a card cannot activate without an owner, a due date and a verification method. No treatment start is recorded, and no follow-up is on the calendar."
  },
  "d1m3-a3": {
   "date": "02/11/2026",
   "time": "9:40 a.m.",
   "channel": "email",
   "from": "Leah Moran, Keystone Mutual PD (lmoran@keystonemutual.example)",
   "to": "LSH Law Group",
   "subject": "KM-26-440871-PD: claimant and rental contact, 2019 Honda Civic LX",
   "body": "We are opening the property-damage claim for the 2019 Honda Civic LX struck on 02/06/2026. Please confirm the vehicle owner and claimant, and a contact number for the rental, so that a rental can be set up with Rivergate Rentals once our liability decision is made."
  },
  "d2m1-a1": {
   "date": "02/17/2026",
   "time": "8:20 a.m.",
   "channel": "email",
   "from": "Atty. Elijah Thorne (ethorne@lshlawgroup.example)",
   "to": "Case Manager",
   "subject": "John Doe: letters of representation go out today",
   "body": "Claims are open: Keystone BI KM-26-440871 (Dana Whitfield) and PD (Leah Moran, who accepted PD liability this morning), Harbor Point HP-26-7741 (Marcus Bell, Host UM and PIP), Cardinal State CS-26-20355, no adjuster yet. I want the three LORs, plus notices to Bluewater and Peach State, on my desk for signature today. Preferred delivery methods are in the Communications Log.",
   "attachments": [
    "RS01",
    "RS07"
   ]
  },
  "d1m1-a1": {
   "date": "02/17/2026",
   "time": "7:55 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Insurance tab empty: three claims opened by phone",
   "body": "LSH-2026-MVA-770412. Set-up calls logged 02/16–02/17/2026: Keystone Mutual BI KM-26-440871, Harbor Point HP-26-7741 (Host UM), Cardinal State Mutual CS-26-20355 (no adjuster assigned). Limits were reported by phone; none is confirmed in writing. The Insurance tab has no layers, so today's letter set cannot merge carrier details until it does.",
   "attachments": [
    "RS01",
    "RS07"
   ]
  },
  "d2m1-a2": {
   "date": "03/11/2026",
   "time": "8:02 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Past due: Keystone BI follow-up (03/05/2026) · Coverage Matrix flags",
   "body": "LSH-2026-MVA-770412. Follow-up “Keystone BI: Declaration Page” was due 03/05/2026; nothing logged. The Coverage Matrix total reads $45,000; the Case Plan target is $40,000. New in Documents since the matrix was last edited: Harbor Point letter 03/02/2026, Cardinal State assignment 03/03/2026 and Coverage Letter 03/09/2026.",
   "attachments": [
    "RS28",
    "RS29",
    "RS32"
   ]
  },
  "d1m1-a2": {
   "date": "03/12/2026",
   "time": "9:40 a.m.",
   "channel": "email",
   "from": "Dion Carver, Peach State Health Plan (dcarver@peachstatehealth.example)",
   "to": "Case Manager",
   "subject": "Member PSH-55017742 / GRP-41208 — accident-related claims",
   "body": "Following our 02/27/2026 notice of reimbursement rights: Peach State Health Plan is processing accident-related claims for John Doe under the plan and will assert reimbursement from any recovery. Please confirm our claim is noted on your file, return the accident questionnaire, and notify this office before any settlement. Recovery file SRU-26-03318.",
   "attachments": [
    "RS40"
   ]
  },
  "d1m4-a1": {
   "date": "03/13/2026",
   "time": "2:15 p.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Records indexed: Riverton Urgent Care and first Riverton Spine & Rehab visits",
   "body": "LSH-2026-MVA-770412. Riverton Urgent Care's 02/20/2026 note and Riverton Spine & Rehab's visits since 02/24/2026 are indexed to the treatment timeline beside the 02/06/2026 EMS Run Report. First treatment falls 14 days after the date of loss. Risk Flags: none recorded.",
   "attachments": [
    "RS12",
    "RS11"
   ]
  },
  "d1m4-a2": {
   "date": "03/16/2026",
   "time": "8:30 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Doe v. Smith: Case Plan to me today",
   "body": "I need the full Case Plan on John Doe, all five bands, routed to me by end of day: the acceptance decision and why, the stack in order with a preliminary projection, liability, the triple-check, the three pillars with owners and dates, and the risks band. Docket the filing window. If I have to ask a question, it isn't finished.",
   "attachments": [
    "RS04",
    "RS40"
   ]
  },
  "d1m2-a1": {
   "date": "02/16/2026",
   "time": "9:00 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "No client contact: John Doe, 6 days",
   "body": "LSH-2026-MVA-770412. Last logged contact with John Doe: 02/10/2026. Check-in call scheduled 02/13/2026: missed. Phone system shows two calls to his mobile ending in voicemail, neither in the Communications Log. No treatment start recorded. Emergency contact on file: Margaret Doe, (555) 010-2291. No Contact Protocol Step 1 due today."
  },
  "d1m2-a2": {
   "date": "02/21/2026",
   "time": "10:14 a.m.",
   "channel": "email",
   "from": "Atty. Elijah Thorne (ethorne@lshlawgroup.example)",
   "to": "Case Manager",
   "subject": "RE: Step 3 — John Doe, no contact",
   "body": "Read your Step 3 note. Eleven days and no word from John, and no treatment that we know of. Draft the Final Warning Letter for my review Monday morning: every attempt with its date, a response date, how to reach us. Certified mail and email. Withdrawal is possible, not decided, and the letter says nothing about his claim.",
   "attachments": [
    "RS05"
   ]
  },
  "d2m2-a1": {
   "date": "02/23/2026",
   "time": "8:52 a.m.",
   "channel": "email",
   "from": "Tammy Greer, Riverton Spine & Rehab (tgreer@rivertonspine.example)",
   "to": "Case Manager",
   "subject": "New patient John Doe, evaluation 02/24 — LOP needed",
   "body": "John Doe is booked for his chiropractic and PT evaluation tomorrow, 02/24. We're out of network with Peach State, so before we see him we'll need a signed Letter of Protection and your HIPAA authorization. Can you get them to me today? Tammy Greer, Office Manager"
  },
  "d2m3-a1": {
   "date": "03/04/2026",
   "time": "8:15 a.m.",
   "channel": "email",
   "from": "Atty. Elijah Thorne (ethorne@lshlawgroup.example)",
   "to": "Case Manager",
   "subject": "John Doe: why 14 days?",
   "body": "Urgent care's 02/20 note is in: onset at the MVA, numbness to the right hand since 02/18. EMS has neck stiffness on 02/06. Nobody has asked John why he waited 14 days. Get him on a recorded call today. Open questions, nothing suggested, and no opinions on what it means. GIRP note to me when you're done.",
   "attachments": [
    "RS12",
    "RS11"
   ]
  },
  "d2m2-a2": {
   "date": "04/08/2026",
   "time": "10:52 a.m.",
   "channel": "email",
   "from": "Tammy Greer, Riverton Spine & Rehab (tgreer@rivertonspine.example)",
   "to": "Case Manager",
   "subject": "Missed-visit alert: John Doe, LOP account RSR-26-0412",
   "body": "Per your LOP dated 02/23/2026: John Doe missed 04/03 (no call) and 04/07. He told our front desk his mother's rental ended and his ride is no longer available. He's booked 04/09 and 04/14 at 4:15 PM. Our 6:00 PM evening schedule is full until the week of 04/20; he's on the wait list. Please contact your client.",
   "attachments": [
    "RS14"
   ]
  },
  "d2m2-a3": {
   "date": "04/22/2026",
   "time": "12:18 p.m.",
   "channel": "voicemail",
   "from": "John Doe (555) 010-2288",
   "to": "Case Manager, ext. 214",
   "subject": "Voicemail: John Doe — won't go to Millbrook for the injection",
   "body": "It's John Doe. Lakeside booked my injection at Millbrook Interventional Pain Center, in Millbrook, May 14 at 9:00 a.m. I'm not going. It's way out there and I've got no ride; my car's in the shop and my mom works days. And I heard it's out of network with Peach State. I still want the shot. Call my cell.",
   "spoken": "Hey, it's John Doe... the car accident. So, uh, Lakeside called me yesterday about the shot. The injection Dr. Reyes wants me to get. They booked me at some place called Millbrook Interventional Pain Center. In Millbrook. May fourteenth, nine in the morning. And... I'm not going there. It's way out in Millbrook, my car's still in the shop, and my mom works days, so I've got no ride out there. And a guy at work said that place isn't in network with Peach State, so I'd get stuck with a bill. I still want to get the shot, okay? Just... not there. Can you help me sort it out? Call me on my cell, it's five five five, oh one oh, two two eight eight. I'm on lunch till one, then I'm on the floor till three thirty. Thanks.",
   "listen": [
    {
     "q": "Who called, and which number does he want you to call back?",
     "a": "John Doe, on his cell: (555) 010-2288.",
     "match": [
      "john",
      "2288"
     ]
    },
    {
     "q": "Where did Lakeside book him, and when?",
     "a": "Millbrook Interventional Pain Center, in Millbrook, on May 14 at 9:00 a.m.",
     "match": [
      "millbrook",
      "nine|9|morning|a\\.?m|may|0?5/\\d|fourteen|14"
     ]
    },
    {
     "q": "What are his two reasons for not going?",
     "a": "It's too far, with no ride: his mother's Civic is in the shop and his mother works days. And he heard it's out of network with Peach State.",
     "match": [
      "far|ride|car|drive|transport|distance|shop",
      "network|peach|bill|insur|cover"
     ]
    },
    {
     "q": "Does he still want the injection?",
     "a": "Yes: he still wants it, just not at that facility.",
     "match": [
      "yes|still|wants?"
     ]
    },
    {
     "q": "When can you reach him today?",
     "a": "On his lunch until 1:00; after that he's on the floor until 3:30.",
     "match": [
      "lunch|1|one|3|three"
     ]
    }
   ]
  },
  "d2m3-a2": {
   "date": "06/22/2026",
   "time": "9:05 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Gap Explanation Record before the pre-demand session",
   "body": "Dr. Reyes's Causation Letter of 06/19 is in, and John reached MMI on 06/12. Before our pre-demand session I want the Gap Explanation Record: both interruptions with exact dates, every reason beside the dated document that proves it, “account only” where there isn't one. Facts and citations, no argument. Run your defense-eye pass first.",
   "attachments": [
    "RS19",
    "RS11",
    "RS12",
    "RS21"
   ]
  },
  "d2m4-a1": {
   "date": "07/01/2026",
   "time": "8:40 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Billing complete: Special Damages Audit due",
   "body": "LSH-2026-MVA-770412. All billing indexed: Riverton Urgent Care, Riverton Spine & Rehab (34 lines), Lakeside Orthopedics, Summit Imaging, Crescent Pain & Spine with Peach State's EOB, Riverton Drug. Northgate HR's wage-and-attendance letter (06/30/2026) received. Task “Special Damages Audit and lien list” is due before the pre-demand session.",
   "attachments": [
    "RS22",
    "RS23",
    "RS24",
    "RS25",
    "RS26",
    "RS21",
    "RS43"
   ]
  },
  "d2m4-a2": {
   "date": "07/08/2026",
   "time": "9:10 a.m.",
   "channel": "email",
   "from": "Atty. Elijah Thorne (ethorne@lshlawgroup.example)",
   "to": "Case Manager",
   "subject": "Doe v. Smith: pre-demand strategy session, 2:00 p.m. today",
   "body": "I've read your audit. Strategy session on John Doe today at 2:00 p.m., my office. Bottom line first. Expect me to push the way Keystone will: low speed, the 14 days, the “degenerative” read. Bring the facts, the documents and the operational options. The decisions on the demand are mine.",
   "attachments": [
    "RS04",
    "RS16",
    "RS19",
    "RS18"
   ]
  },
  "d3m1-a1": {
   "date": "07/20/2026",
   "time": "8:05 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Keystone BI demand: final audit, then serve today",
   "body": "Terms are approved for Dana Whitfield: the $10,000 limits, a Limited Release of Robert Smith and Keystone only, Smith's affidavit of no other insurance, 30 days from receipt. The specialist's draft is attached. Audit it against the Big Four and the Final Scrub, log every deficiency as a task, and bring it back for my signature. It goes out today.",
   "attachments": [
    "RS33",
    "RS16",
    "RS19"
   ]
  },
  "d3m1-a2": {
   "date": "08/31/2026",
   "time": "8:20 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Host UM and Relative UM demands: drafts for my review",
   "body": "BI is done: Keystone tendered $10,000 on 08/12, both consents are in, and the Limited Release was signed 08/28. The check isn't here yet. Draft the Host UM demand to Harbor Point for $20,000 and the Relative UM demand to Cardinal State for $10,000, as excess. Exhaustion on page one of each. Leave the response deadline blank for me.",
   "attachments": [
    "RS36",
    "RS38",
    "RS28",
    "RS29",
    "RS35"
   ]
  },
  "d3m2-a1": {
   "date": "08/05/2026",
   "time": "10:12 a.m.",
   "channel": "email",
   "from": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
   "to": "Case Manager, LSH Law Group",
   "subject": "KM-26-440871 / John Doe: settlement offer",
   "body": "Following review of your Time-Limited Demand, Keystone offers $3,500.00 to resolve the bodily injury claim. Your client waited two weeks before seeking any treatment, and the MRI findings are degenerative in nature. Our letter is attached. I'll call you this afternoon to discuss.",
   "attachments": [
    "RS35"
   ]
  },
  "d3m2-a2": {
   "date": "09/14/2026",
   "time": "11:40 a.m.",
   "channel": "email",
   "from": "Marcus Bell <marcus.bell@harborpointins.example>",
   "to": "Case Manager, LSH Law Group",
   "subject": "HP-26-7741 / John Doe: Host UM offer",
   "body": "We have reviewed your Host UM demand. Harbor Point offers $8,000.00. Your client did not treat for two weeks after the accident, and the BI payment has already compensated him for much of this loss. Offer letter attached. Please let me know your client's position.",
   "attachments": [
    "RS39"
   ]
  },
  "d3m3-a1": {
   "date": "10/06/2026",
   "time": "9:15 a.m.",
   "channel": "email",
   "from": "Dion Carver <dcarver@peachstatehealth.example>",
   "to": "Case Manager, LSH Law Group",
   "subject": "PSH-55017742 / John Doe: reimbursement claim status",
   "body": "Peach State Health Plan asserts its reimbursement right of $1,860.00, paid for the 05/15/2026 epidural injection at Crescent Pain & Spine. Please advise the status of any settlement and confirm our claim will be protected from the proceeds. Our notice of rights and the EOB are attached.",
   "attachments": [
    "RS40",
    "RS26"
   ]
  },
  "d3m3-a2": {
   "date": "10/09/2026",
   "time": "2:30 p.m.",
   "channel": "email",
   "from": "Tammy Greer <tgreer@rivertonspinerehab.example>",
   "to": "Case Manager, LSH Law Group",
   "subject": "John Doe: final LOP ledger and balance due",
   "body": "Attached is John Doe's Final Itemized Ledger under the 02/23/2026 Letter of Protection: 34 visits at $185.00, balance $6,290.00. We understand the case is settling. Please confirm when we can expect payment in full. Visit notes are attached for your records.",
   "attachments": [
    "RS23",
    "RS14"
   ]
  },
  "d3m4-a1": {
   "date": "10/13/2026",
   "time": "4:02 p.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Trust deposit posted: Cardinal State Mutual $10,000.00",
   "body": "IOLTA deposit logged: Cardinal State Mutual, CS-26-20355, $10,000.00, not yet cleared. Trust received to date: $40,000.00. Net Sheet: Recovery Ledger incomplete; Lien Tracker incomplete. Written acceptances on file: Peach State $1,240.00 (10/09), Riverton Spine & Rehab $3,470.00 (10/12). Complete both tabs before the Settlement Statement is drafted.",
   "attachments": [
    "RS41",
    "RS42",
    "RS44"
   ]
  },
  "d3m4-a2": {
   "date": "08/14/2026",
   "time": "3:18 p.m.",
   "channel": "email",
   "from": "Dana Whitfield <dana.whitfield@keystonemutual.example>",
   "to": "Case Manager, LSH Law Group",
   "subject": "KM-26-440871 / John Doe: release for signature",
   "body": "Attached is the release to conclude the bodily injury claim on Keystone's $10,000.00 tender. Please have Mr. Doe sign before a notary and return the original to me. The check will be issued once we receive the executed release.",
   "attachments": [
    "RS37"
   ]
  },
  "d4m1-a1": {
   "date": "09/08/2026",
   "time": "8:10 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Keystone impasse: full memo today",
   "body": "Got your 09/04 escalation task. Keystone has said nothing since the 09/02 supervisor escalation. Before I decide anything, send me the full impasse memo today: every event since the 07/20 demand with its proof, Keystone's grounds, the stack as it stands, the SOL and our internal dates, and the questions you need me to answer.",
   "attachments": [
    "RS49",
    "RS35",
    "RS04"
   ]
  },
  "d4m1-a2": {
   "date": "09/10/2026",
   "time": "8:00 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "John Doe: suit authorized; move the file to Litigation",
   "body": "Yesterday I authorized suit against Robert Smith in the State Court of Riverton County, filing target 09/24/2026, and went over the fee tier with John. Transition the file today. Draft impasse notices to Harbor Point and Cardinal State, and preservation requests for the doorbell video and the Escape's data recorder, for my signature.",
   "attachments": [
    "RS05",
    "RS28",
    "RS09"
   ]
  },
  "d4m2-a1": {
   "date": "12/10/2026",
   "time": "3:45 p.m.",
   "channel": "email",
   "from": "Atty. Elijah Thorne <ethorne@lshlawgroup.example>",
   "to": "Case Manager",
   "subject": "26-CV-04417: Scheduling Order entered; audit the calendar",
   "body": "The Scheduling Order was entered today; it's attached with the discovery Mercer mailed us on 12/01. While you were out, the calendar was re-keyed from the paper file: nothing verified, no alerts. Audit every entry against the order, the discovery and the SOL, correct what's wrong, and send me the correction log.",
   "attachments": [
    "RS55",
    "RS54",
    "RS04"
   ]
  },
  "d4m2-a2": {
   "date": "04/05/2027",
   "time": "4:30 p.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "UM arbitration invoked: rules matrix and your role",
   "body": "Harbor Point and Cardinal State dispute damages, citing the gap. Harbor Point has invoked its UM arbitration clause and Cardinal State joins: one binding arbitration before Laura Whitcomb, Esq., hearing 06/22/2027. Build me the ADR rules matrix, mediation against arbitration, docket the exhibit and brief dates today, and map what you do at the hearing.",
   "attachments": [
    "RS58",
    "RS59",
    "RS57",
    "RS28"
   ]
  },
  "d4m3-a1": {
   "date": "03/04/2027",
   "time": "9:05 a.m.",
   "channel": "email",
   "from": "Atty. Elijah Thorne <ethorne@lshlawgroup.example>",
   "to": "Case Manager",
   "subject": "Mediation Binder: due to Hon. Carla Benton (Ret.) 03/11",
   "body": "Mercer writes that Keystone “will not put a real number on the table” while our medical ledger is unverified. The draft binder carries Riverton at $6,290.00 and Crescent as an open balance. Rebuild it from the master index and audit it. Statement and binder go to Hon. Carla Benton (Ret.) by 03/11/2027; route everything to me first.",
   "attachments": [
    "RS57",
    "RS23",
    "RS26",
    "RS53"
   ]
  },
  "d4m3-a2": {
   "date": "05/17/2027",
   "time": "7:30 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Exhibit exchange in 16 days: Arbitration Binder not started",
   "body": "Hard date: exhibit exchange 06/02/2027 (Laura Whitcomb, Esq.; HP-26-7741, CS-26-20355). Arbitration Binder: 0 of 6 tabs built. Unsorted exhibit folder holds a Complaint draft, doorbell stills, the 09/08/2026 impasse memo and a Lien Sheet. Crescent Pain & Spine certified records: requested 05/05/2027, not received.",
   "attachments": [
    "RS58",
    "RS50",
    "RS09",
    "RS31",
    "RS25"
   ]
  },
  "d4m4-a1": {
   "date": "02/22/2027",
   "time": "8:00 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Record overdue 14 days: Riverton Spine & Rehab Final Ledger",
   "body": "Riverton Spine & Rehab's Final Itemized Ledger, requested 02/08/2027, has not been received. It is a dependency for the Mediation Binder due 03/11/2027 (Hon. Carla Benton (Ret.), session 03/18/2027). Keystone's session attendee and authority: unconfirmed. No countermeasure rules are configured on this file.",
   "attachments": [
    "RS23",
    "RS57",
    "RS49",
    "RS26"
   ]
  },
  "d4m4-a2": {
   "date": "05/24/2027",
   "time": "7:45 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Bottleneck Log: 5 open items against the 06/02/2027 exchange",
   "body": "Open: (1) Crescent certified records, second request 05/19, not received. (2) Dr. Reyes's declaration: Lakeside says she is away until 06/01. (3) Cardinal State: hearing format and exchange method unconfirmed; supervisor escalation 05/21 unanswered. (4) Riverton's refreshed ledger shows $6,290.00. (5) Copy set: grayscale stills, no OCR.",
   "attachments": [
    "RS58",
    "RS26",
    "RS23",
    "RS09",
    "RS20"
   ]
  },
  "d5m1-a1": {
   "date": "01/05/2027",
   "time": "7:30 a.m.",
   "channel": "alert",
   "from": "CMS",
   "to": "Case Manager",
   "subject": "Pleadings Log does not match the docket: 26-CV-04417",
   "body": "Reconciliation check, Pleadings Log against Docket Calendar: 5 mismatches. Unlogged: Affidavit of Service (Allied Process Services email, 10/16/2026); Certificate of Service (01/04/2027). Unfiled scan: scan_1210.pdf. Row “Interrogatories/RFPs” shows due 12/31/2026; calendar shows 01/04/2027. No row for Requests for Admission.",
   "attachments": [
    "RS60",
    "RS52",
    "RS55",
    "RS54"
   ]
  },
  "d5m1-a2": {
   "date": "01/20/2027",
   "time": "11:20 a.m.",
   "channel": "email",
   "from": "Atty. Grant Mercer <gmercer@mercerhale.example>",
   "to": "Atty. Elijah Thorne; cc: Case Manager",
   "subject": "Doe v. Smith, 26-CV-04417: Notice of Deposition of Plaintiff",
   "body": "Please see the attached Notice of Videoconference Deposition of Plaintiff John Doe, set for 02/18/2027 at 10:00 a.m. with Riverton Court Reporting. The link will issue from the reporter. Please confirm your client's attendance.",
   "attachments": [
    "RS56"
   ]
  },
  "d5m2-a1": {
   "date": "12/03/2026",
   "time": "9:40 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "RFPs ask for every PD document: audit the Civic first",
   "body": "Mercer's requests came in the mail today; responses are due 01/04/2027. They ask for every document supporting the Property Damage claim, and the PD screen hasn't been touched since April. Audit the Civic's numbers before anything is produced, and flag what Keystone will argue about the unpaid days. Nothing goes out without my review.",
   "attachments": [
    "RS54",
    "RS45",
    "RS46"
   ]
  },
  "d5m2-a2": {
   "date": "12/10/2026",
   "time": "10:05 a.m.",
   "channel": "email",
   "from": "Leah Moran <leah.moran@keystonemutual.example>",
   "to": "Case Manager, LSH Law Group",
   "subject": "KM-26-440871-PD / John Doe: final Property Damage position",
   "body": "Keystone's position is final: $792.00 for Diminished Value under our valuation formula and $0 for Loss of Use. The attached release covers all claims arising from the 02/06/2026 accident; please have Mr. Doe sign and return it and I'll issue payment. I'll call this afternoon to see if he'll take it.",
   "attachments": [
    "RS48"
   ]
  },
  "d5m3-a1": {
   "date": "02/04/2027",
   "time": "8:30 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "John Doe prep session 1 today: you open",
   "body": "John's first prep session is at 1:00 p.m. You take the first segment: his new number, the 02/18 logistics, the test call, the three pillars and the room rules. I'll listen, then take the substance. Have my gap set ready to share on screen. He's nervous; calm him with the process, not predictions.",
   "attachments": [
    "RS56",
    "RS11",
    "RS12",
    "RS43",
    "RS19"
   ]
  },
  "d5m3-a2": {
   "date": "02/16/2027",
   "time": "9:00 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Mock cross at 2:00 p.m.: keep the Trap Log",
   "body": "Second prep session today. I'm running a mock cross: AI Mercer questions John, I defend and object. Your microphone stays muted. Log every trap with its time, Mercer's exact words and the record fact beside any mischaracterisation, plus each objection. I debrief John from your log, so route it to me before we finish.",
   "attachments": [
    "RS53",
    "RS16",
    "RS20",
    "RS12",
    "RS10",
    "RS11"
   ]
  },
  "d5m4-a1": {
   "date": "11/12/2026",
   "time": "4:15 p.m.",
   "channel": "email",
   "from": "Atty. Elijah Thorne <ethorne@lshlawgroup.example>",
   "to": "Case Manager",
   "subject": "Smith's Answer filed: build the liability counter-package",
   "body": "Mercer filed Smith's Answer today (attached). It denies liability and pleads comparative negligence (out of turn, unbelted), causation (the gap, a “degenerative” MRI) and failure to mitigate. For each allegation, give me the evidence that answers it, its source, its authenticating witness and its chain of custody. Then list the questions only I can answer.",
   "attachments": [
    "RS53",
    "RS07",
    "RS08",
    "RS09",
    "RS10",
    "RS11",
    "RS14"
   ]
  },
  "d5m4-a2": {
   "date": "10/08/2026",
   "time": "7:52 p.m.",
   "channel": "email",
   "from": "Miguel Santos, Allied Process Services <msantos@alliedprocess.example>",
   "to": "Case Manager, LSH Law Group",
   "subject": "Doe v. Smith, 26-CV-04417: non-service at 118 Larkspur Ln",
   "body": "Third attempt at 118 Larkspur Ln, Riverton, tonight at 6:40 p.m.: no answer, no vehicle. Prior attempts 10/01 and 10/05. A neighbor says Robert Smith moved out in August and left no forwarding address. Affidavit of non-service attached. Please advise how you want to proceed.",
   "attachments": [
    "RS52"
   ]
  },
  "d5m6-a1": {
   "date": "12/09/2026",
   "time": "8:50 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Practice matter: the Harlow drop, Withdrawal Letters today",
   "body": "Practice matter, not the Doe file. I've dropped Denise Harlow's case: no Health Plan, no care since 10/29/2026. I told her yesterday; my note is on her file and the status is Pending Drop. Draft her letter, Granite Shield's and Brookside's for my signature, send each the way the CRM says, and log everything. Only hers gives the reason."
  },
  "d5m5-a1": {
   "date": "07/22/2027",
   "time": "9:05 a.m.",
   "channel": "memo",
   "from": "Atty. Elijah Thorne",
   "to": "Case Manager",
   "subject": "Doe award: both UM checks in, draft the Net Sheet",
   "body": "Cardinal State's check came in this morning, so all $40,000.00 is in trust. Suit was filed, so the fee is the 40% tier under John's retainer. Use the receipted litigation costs and the two Payoff Letters, Peach State and Riverton Spine & Rehab. Draft the Net Sheet and the Settlement Statement for my review before John sees anything."
  }
 },
 "calls": {
  "d1m3-a1": {
   "who": "John Doe",
   "role": "client",
   "persona": "Polite, tired and sore; rattled by the Keystone call. Wants plain answers. Will ask whether to talk to Keystone, whose fault it was, and what his case is worth.",
   "context": "02/10/2026. Retainer signed 02/09; the matter is open; no onboarding packet has reached him. John, 34, a Northgate warehouse shift lead, was the front-seat passenger in coworker Kevin Alvarez's Escape on 02/06. Last night a Keystone Mutual caller asked to record his account; he said he'd think about it, and she said she'd call back. His neck is stiff; he hasn't seen anyone. Margaret's Civic was towed from the scene and he has no car. Calms with clear steps; repeats instructions back if asked.",
   "opening": "Hey, it's John Doe, returning your call. So the other guy's insurance called me last night, a lady from Keystone, wanting to record what happened. She said she'd call back. What do I tell her?",
   "goals": [
    "Route all Keystone contact to the firm; no Recorded Statement",
    "Confirm he understood by having him repeat the instruction",
    "State the packet's treatment direction, since treatment hasn't begun",
    "Confirm Property Damage details and the packet's delivery method"
   ],
   "line": "Give the firm's instructions only; fault, claim value and legal effect go to Atty. Thorne."
  },
  "d2m1-a2": {
   "who": "Dana Whitfield",
   "role": "adjuster",
   "persona": "Seasoned BI adjuster, brisk and guarded. Considers the limit question answered. Fishes for treatment details and a demand number; commits to nothing in writing without being pinned.",
   "context": "03/11/2026. Keystone BI claim KM-26-440871, insured Robert Smith, policy KMI-PA-7731045, DOL 02/06/2026. She gave the $10,000 per-person limit by phone at set-up, and her 02/24/2026 letter promised the declarations page once the firm's written request and signed authorizations arrived. They have been sent; nothing has come back. She says it is with underwriting. Asked for a specific date, she commits to sending it by 03/20/2026. She asks how John is treating and what the firm will demand.",
   "opening": "Dana Whitfield. I've got about five minutes. If this is the Dec Page again, I gave your office the limit on the first call. Ten thousand per person. What else do you need?",
   "goals": [
    "Confirm Keystone received the written request and signed authorizations",
    "Get a firm date for the Declaration Page in writing",
    "Share no treatment detail or demand figure",
    "Log the call and set the next follow-up by 03/13/2026"
   ],
   "line": "Verify coverage only: no demand figure, liability argument or treatment detail without Atty. Thorne's approval."
  },
  "d1m2-a1": {
   "who": "Margaret Doe",
   "role": "family",
   "persona": "Warm, protective mother, wary of a law office calling. Worried about John. Will ask what is going on with his case and whether her own insurance is involved.",
   "context": "02/16/2026. Margaret Doe, John's mother, is the emergency contact collected at intake; John lives with her at 2214 Maple Hollow Rd. The firm has not reached John since 02/10: a missed check-in call and two voicemails. He called out of work last week with his neck and has been texting her about the pain; as far as she knows he hasn't seen a doctor. She doesn't know why he hasn't called back. Her Cardinal State policy is on the file. She'll pass a message.",
   "opening": "Hello? This is Margaret. You said you're with a law office, calling about John? Is he all right? He's not in some kind of trouble, is he?",
   "goals": [
    "Identify yourself and confirm she is the emergency contact on file",
    "Ask her to have John call the firm by a set date",
    "Confirm John's best phone number and current address",
    "Disclose no case details; log date, time, channel and outcome"
   ],
   "line": "Share nothing about John's case and no advice on her policy; refer her questions to Atty. Thorne."
  },
  "d2m2-a2": {
   "who": "John Doe",
   "role": "client",
   "persona": "Embarrassed and frustrated; short answers at first. In pain and defensive about the missed visits. Will ask if this ruins his case. Opens up when not judged.",
   "context": "04/08/2026. Riverton Spine & Rehab reports John missed 04/03 and 04/07; last visit 04/02. Keystone ended Margaret's rental on 03/19 at its 30-day cap; Margaret's Civic is still waiting on parts; Kevin Alvarez's shift changed 04/01, ending the carpool. He has no ride to his 4:15 PM appointments. His neck and right arm still bother him. His mother Margaret works a day shift and could drive him in the evenings, but he only says so if asked who could help.",
   "opening": "Yeah, I know, I missed a couple. I'm not blowing it off, I swear. I just don't have a way to get there anymore. Is this going to mess up my case?",
   "goals": [
    "Find the barrier and ask about his current symptoms",
    "Build a transport plan from the options, saying why",
    "Book evening slots with the clinic while John is on the line",
    "No treatment advice and nothing on what missed visits mean"
   ],
   "line": "No advice to add, skip or stop care; questions about his claim go to Atty. Thorne."
  },
  "d2m3-a1": {
   "who": "John Doe",
   "role": "client",
   "persona": "Guarded and expecting blame for the delay. Clipped answers to yes-or-no questions; talks freely to open ones. Agrees with any reason suggested to him. Asks if the gap hurts.",
   "context": "03/04/2026, recorded call. John first treated 02/20/2026, 14 days after the collision. Asked openly, he gives four reasons in his own words: no car (Civic towed, Kevin's Escape in the shop, no rental until 02/18); thought it was soreness, took ibuprofen and lidocaine patches; unsure his new Peach State plan was active, never heard of PIP; right-hand numbness from 02/18, worked 02/18–02/19, went in on his first day off. He texted his mother about it 02/07–02/15, called out of work 02/09–02/13, kept the 02/07 pharmacy receipt.",
   "opening": "Hey, it's John. I'm on my break, sitting in the rental, so I've got about twenty minutes. What did you need to go over?",
   "goals": [
    "Open on record: date, parties, role, his consent, privacy confirmed",
    "Draw out all four reasons with open, non-leading questions",
    "Ask for the paper: the texts, the call-outs, the 02/07 receipt",
    "Read back his account; confirm 03/05 consult and post-03/19 transport"
   ],
   "line": "Never suggest a reason, interpret it or say what the gap does to his case; route that to Atty. Thorne."
  },
  "d2m4-a2": {
   "who": "Atty. Elijah Thorne",
   "role": "attorney",
   "persona": "Exacting senior trial lawyer, short on time. Plays the adjuster to test you. Wants facts, not adjectives; bristles at any valuation from staff.",
   "context": "07/08/2026, before any demand. MMI 06/12; Specials $16,401.40 ($14,817.40 medical after the 05/04 duplicate came out, plus $1,584.00 wages); liens $1,860.00 Peach State and $4,625.00 LOP; targets $10,000 BI, $20,000 Host UM, $10,000 Relative UM. He pushes: low-speed impact, the 14-day gap, the “degenerative” MRI, and asks what the case is worth. Briefed well, he decides: a time-limited BI demand served 07/20/2026, the gap addressed up front, no UM demand before a documented BI tender, billed-vs-paid his call.",
   "opening": "I've got twenty minutes. Bottom line first. Then tell me why Keystone shouldn't call this a low-speed bump with a guy who waited two weeks to see a doctor.",
   "goals": [
    "Lead with the bottom line: MMI, $16,401.40 Specials, $10,000 BI limit",
    "Meet each challenge with dated documents, not adjectives",
    "Get his decisions: demand, the gap, UM consents, billed-vs-paid",
    "Read back each decision; task it with an owner and date"
   ],
   "line": "Recommend operations only; propose no demand figure and leave every legal decision to Atty. Thorne."
  },
  "d3m1-a1": {
   "who": "Dana Whitfield",
   "role": "adjuster",
   "persona": "Courteous BI adjuster with a heavy desk; wants more time and more records; tests whether the Case Manager will agree to anything on the phone.",
   "context": "07/23/2026. Keystone received the $10,000 time-limited BI demand (KM-26-440871) by certified mail on 07/22/2026; the email copy came 07/20. Acceptance window: 30 days from receipt, 08/21/2026. Dana says the 14-day gap needs a closer look, asks whether the 30 days run from the email, asks for 30 more days and the full Riverton Spine & Rehab chart. She stays polite but presses for a yes. She offers no number.",
   "opening": "Hi, Dana Whitfield at Keystone, on the Doe claim. I've got your demand here. Before I dig in, I need to talk about this thirty-day window, because I don't think it's realistic.",
   "goals": [
    "Confirm receipt 07/22/2026 and the 08/21/2026 deadline as written",
    "Agree to no extension; route her request to Atty. Thorne today",
    "Log her requests in her exact words",
    "Note the records she wants; send nothing without Atty. Thorne's approval"
   ],
   "line": "The CM never extends the deadline, changes a term or discusses value; Atty. Thorne decides."
  },
  "d3m2-a1": {
   "who": "Dana Whitfield",
   "role": "adjuster",
   "persona": "Firm, friendly, practiced; opens at $3,500, leans on “waited two weeks” and “degenerative”; stalls with “my hands are tied” and “I'll call you back.”",
   "context": "08/05/2026. Demand received 07/22; acceptance runs to 08/21/2026. Dana offers $3,500, citing the 14-day gap (DOL 02/06, first treatment 02/20/2026) and a “degenerative” MRI. She has the EMS report and the Causation Letter but has not weighed them. Asked what supports $3,500, she says “our evaluation.” She may call the April break non-compliance. She will not move today and wants a counter. Atty. Thorne's authority: restate the Limits Demand, no counter.",
   "opening": "Dana Whitfield, Keystone. I've finished my evaluation on Doe. I can offer thirty-five hundred. Honestly, he waited two weeks to see anybody, and that MRI reads degenerative to me.",
   "goals": [
    "Pause, then ask what data supports $3,500",
    "Answer the gap and “degenerative” with dated records and Dr. Park's words",
    "Restate the $10,000 Limits Demand and 08/21/2026 deadline; no counter",
    "Log her exact words; report the offer to Atty. Thorne today"
   ],
   "line": "The CM never accepts, rejects, counters or values; the offer goes to Atty. Thorne to convey."
  },
  "d3m3-a2": {
   "who": "Tammy Greer, Riverton Spine & Rehab",
   "role": "lienholder",
   "persona": "Office manager who runs billing and LOPs; protective of the practice's money; brisk; will deal if the math is fair and in writing.",
   "context": "10/09/2026. Riverton Spine & Rehab treated John Doe under an LOP signed 02/23/2026. Tammy's ledger shows 34 lines × $185.00 = $6,290.00; the 05/04/2026 line is a duplicate (33 visits, $6,105.00). The firm's approved Reduction Request is in her inbox. Recovery is capped at $40,000 of coverage. She defends the ledger first, concedes the duplicate when shown the dates, then agrees to $3,470.00 and asks, “So we have a deal?”",
   "opening": "Tammy Greer, Riverton Spine and Rehab. I got your reduction letter. We treated him four months on a promise. Why would we take less than the sixty-two ninety we're owed?",
   "goals": [
    "State the audited balance: 05/04/2026 duplicate removed, $6,105.00",
    "Explain the coverage-capped recovery as facts; ask for reduced payment in full",
    "Accept nothing on the call; $3,470.00 goes to Atty. Thorne",
    "Request a signed Payoff Letter: full satisfaction, no balance billing"
   ],
   "line": "The CM negotiates only inside Atty. Thorne's written authority and never accepts a figure on the call."
  },
  "d3m4-a2": {
   "who": "John Doe",
   "role": "client",
   "persona": "Warehouse shift lead, tired and wary; did his own math on $40,000 and feels shorted; wants a straight answer, not a lecture.",
   "context": "10/22/2026, disbursement day. John signed the Settlement Statement 10/21. Gross $40,000.00; fee $13,333.33 (33⅓% pre-suit, per the retainer); costs $486.75; Peach State $1,240.00 (asserted $1,860.00); Riverton Spine & Rehab $3,470.00 ($6,290.00 billed); net $21,469.92. He expected two-thirds, about $26,667. He asks why the chiropractor gets paid at all, and who pays if he needs more injections.",
   "opening": "Hey, it's John. This check says twenty thousand three-fifty-nine. Forty grand, lawyers take a third, I figured twenty-six something. Where'd the rest go?",
   "goals": [
    "Walk each Settlement Statement line to $21,469.92 as plain facts",
    "Show both lien reductions and the signed Payoff Letters",
    "Route fee and future-injection questions to Atty. Thorne",
    "Obtain his signed acknowledgment of receipt"
   ],
   "line": "The CM explains the signed statement's numbers; never advises, renegotiates the fee or predicts future coverage."
  },
  "d4m1-a1": {
   "who": "Atty. Elijah Thorne",
   "role": "attorney",
   "persona": "Lead counsel, sharp and short on time; wants the chronology cold; will test whether the Case Manager tries to recommend suit.",
   "context": "09/08/2026, Track B. Keystone offered $3,500 on 08/05 and called it “final” 08/12; the demand lapsed 08/21; follow-ups 08/24 and 08/31 and the 09/02 supervisor escalation went unanswered through 09/04. Unexhausted BI freezes $20,000 Host UM and $10,000 Relative UM. Specials $16,401.40. SOL 02/06/2028 (Sunday); hard date 02/04/2028; cutoff 11/05/2027. Thorne asks “So, do we sue?” and “What's Smith worth above his limits?” He wants facts and questions, not advice.",
   "opening": "Okay, I've got ten minutes. Walk me through Keystone from the demand to today, and then tell me: do we file?",
   "goals": [
    "Give the dated chronology, 07/20 to 09/04, each event with its proof",
    "Show $30,000 of the $40,000 stack frozen behind BI",
    "State SOL 02/06/2028, hard date 02/04/2028, cutoff 11/05/2027",
    "Frame the decisions as questions for him; recommend nothing"
   ],
   "line": "Filing, exposure and value are Atty. Thorne's calls; the CM documents and asks."
  },
  "d4m2-a1": {
   "who": "Jenna Price, Atty. Mercer's paralegal",
   "role": "paralegal",
   "persona": "Friendly, informal defense paralegal; trades favors; offers an extension “off the record” and hopes for one back.",
   "context": "12/10/2026, Track B, No. 26-CV-04417. Defendant's Interrogatories (25), RFPs (30) and RFAs (15) were mailed to Atty. Thorne 12/01/2026; responses due 01/04/2027 (30 days, plus 3 for mail, Sunday rolls to Monday). Unanswered RFAs may be deemed admitted. Jenna says Grant is fine with mid-January, “no need to put it in writing,” and asks the firm to return the favor on Smith's responses. She bristles at a written stipulation, then agrees to pass the request along.",
   "opening": "Hi, Jenna with Grant Mercer's office on Doe versus Smith. Quick one: Grant says no rush on your client's discovery, mid-January's fine. No need to put it in writing.",
   "goals": [
    "Agree to nothing; keep 01/04/2027 docketed, RFAs flagged",
    "Log her words verbatim, including “no need to put it in writing”",
    "Route to Atty. Thorne today; any extension only in writing",
    "Offer no favor in return on Smith's responses"
   ],
   "line": "The CM never agrees an extension with opposing counsel; only Atty. Thorne, and only in writing."
  },
  "d4m3-a2": {
   "who": "Lori Banks, records coordinator, Crescent Pain & Spine",
   "role": "provider",
   "persona": "Overloaded records coordinator; follows the queue; vague on dates until pressed; needs the copy fee paid before release.",
   "context": "05/17/2027, Track B. On 05/05/2027 the firm requested Crescent Pain & Spine's certified records and bill for John Doe's 05/15/2026 epidural injection (Dr. Omar Haddad) for the UM arbitration; exhibit exchange 06/02/2027. Lori has the request, but a copy-fee invoice is unpaid and the custodian certification needs the practice manager's signature. Her queue runs three to four weeks. She commits to a date only once the fee is paid and the certification form is in hand.",
   "opening": "Crescent Pain and Spine records, this is Lori. I've got your request from the fifth on Doe. It's in the queue, but there's an invoice out, and our manager signs the certifications.",
   "goals": [
    "Identify each blocker: the unpaid invoice and the custodian's signature",
    "Get the invoice today and route it for same-day payment",
    "Get a firm delivery date and method, confirmed in writing",
    "Log it; set the 05/19/2027 second request and subpoena flag"
   ],
   "line": "The CM requests records; a subpoena is Atty. Thorne's decision, never threatened by the CM."
  },
  "d4m4-a2": {
   "who": "Teresa Okafor",
   "role": "adjuster",
   "persona": "Cardinal State UM adjuster, defensive about the supervisor escalation; defers to Harbor Point; vague about whether counsel is involved.",
   "context": "05/24/2027, Track B. Consolidated UM arbitration before Laura Whitcomb, Esq.: exhibit exchange 06/02/2027, hearing 06/22/2027. Harbor Point confirmed format and exchange method 05/20; Cardinal State (CS-26-20355) never answered. The CM escalated to Teresa's supervisor in writing 05/21; the item reached Atty. Thorne today. CMS shows no counsel appeared. Teresa finally calls back, resents the escalation, says “we'll do whatever Harbor Point does,” mentions “our lawyer” vaguely, and tries to argue the gap.",
   "opening": "This is Teresa Okafor at Cardinal State. My supervisor forwarded your email. You didn't need to go over my head. What exactly do you need from me?",
   "goals": [
    "Ask whether Cardinal State has counsel; if so, logistics go there",
    "Get the hearing format and exchange method confirmed in writing",
    "Confirm the 06/02/2027 exchange and 06/22/2027 hearing",
    "Decline any talk of the gap or value; update Atty. Thorne"
   ],
   "line": "The CM handles logistics only; damages, the gap and value are Atty. Thorne's."
  },
  "d5m1-a1": {
   "who": "Jenna Price, Atty. Mercer's paralegal",
   "role": "paralegal",
   "persona": "Polite but pointed defense paralegal; fishing for a concession that the Requests for Admission are deemed admitted.",
   "context": "01/05/2027, No. 26-CV-04417. Defendant's discovery, including 15 Requests for Admission, was mailed 12/01/2026; responses were due 01/04/2027. The firm's Certificate of Service shows John Doe's verified responses mailed to Atty. Mercer 01/04/2027; they have not arrived there yet. Jenna says nothing came in, calls the RFAs “deemed admitted,” and asks the CM to “just confirm” they were late. She accepts being told Atty. Thorne will respond today.",
   "opening": "Hi, Jenna again at Mercer and Hale. We have nothing from you on our discovery, and the admissions were due yesterday. Grant asked me to confirm they're deemed admitted.",
   "goals": [
    "Log her words verbatim, with the time of the call",
    "Take no position on timeliness or deemed admissions",
    "Route to Atty. Thorne today with the 01/04/2027 Certificate of Service",
    "Tell her only that Atty. Thorne will respond"
   ],
   "line": "The CM never argues the rules or concedes anything to opposing counsel; Atty. Thorne answers."
  },
  "d5m2-a2": {
   "who": "Leah Moran",
   "role": "adjuster",
   "persona": "Cheerful, efficient PD adjuster closing files before year-end; calls the formula “company standard”; wants a yes today.",
   "context": "12/10/2026. KM-26-440871-PD, Margaret Doe's 2019 Honda Civic LX: repair $9,255.00; ACV $17,600.00. Keystone offers $792.00 Diminished Value (10% × $17,600.00 × 0.75 × 0.60) and $0 Loss of Use (claimed 48 days × $42.00 = $2,016.00). Independent appraisal: $3,600.00 (05/06/2026). Her emailed release covers “all claims arising from the 02/06/2026 accident.” She asks whether John will take it and insists it is final.",
   "opening": "Hi, Leah Moran with Keystone, Property Damage, following up my email. Seven ninety-two on the Diminished Value is final. Will Mr. Doe sign so I can get his check out before the holidays?",
   "goals": [
    "Tell her the offer is with Atty. Thorne; nothing accepted or rejected",
    "Make no counter and quote no figure",
    "Note the “all claims” release scope; route it to Atty. Thorne",
    "Log the call and her exact words"
   ],
   "line": "The CM never accepts, rejects or counters; a release goes to Atty. Thorne, never to John to sign."
  },
  "d5m3-a1": {
   "who": "John Doe",
   "role": "client",
   "persona": "Anxious and earnest; expects a TV cross-examination; wants to be told what to say; worried about his job and the outcome.",
   "context": "02/04/2027, Track B. John was unreachable 01/22–02/03 after losing his phone; Margaret reached him 02/03; he has a new number. Deposition 02/18/2027, 10:00 a.m., by videoconference, Riverton Court Reporting; test call 02/16. Atty. Thorne listens and takes the substance after the CM's segment. John asks what to say about the 14-day gap, the missed April therapy, the seatbelt, his 2021 chiropractor visits and the “degenerative” MRI, and whether he will win.",
   "opening": "Hey, sorry about the phone thing. This is my new number. So, the deposition. Are they going to yell at me like on TV? And what do I say about the two weeks?",
   "goals": [
    "Confirm his new number, with Margaret as backup contact",
    "State the logistics exactly; set the 02/16/2027 test call",
    "Explain the setting and the pause; drill neutral questions only",
    "Route each substantive question to Atty. Thorne in John's words"
   ],
   "line": "The CM never scripts testimony, answers substance or predicts the outcome; Atty. Thorne handles the substance."
  },
  "d5m3-a2": {
   "who": "Atty. Grant Mercer",
   "role": "counsel",
   "persona": "Polished, patient defense counsel in a mock cross; friendly tone, sharp traps; uses silence; aims at the gap, prior care and the seatbelt.",
   "context": "02/16/2027, mock cross-examination led by Atty. Thorne. AI Mercer questions AI John Doe; Thorne defends and objects; the CM is muted and keeps the Trap Log. Traps: “Is that all?”, compound questions, “degenerative” (MRI 03/13/2026: no significant degenerative change at the adjacent levels), the gap mischaracterised (14 days, 02/06–02/20/2026), the seatbelt (EMS “restrained”; EDR buckled), the 2021 low-back visits, the silent stare. He never addresses the CM.",
   "opening": "Mr. Doe, good afternoon. You understand you're under oath, just as if we were in a courtroom? Let's start easy. Tell me everything you did the morning of February sixth.",
   "goals": [
    "Log each trap with its timestamp and Mercer's exact words",
    "Set the record fact and source beside each mischaracterisation",
    "Log every objection and whether John stopped talking",
    "Route the Trap Log to Atty. Thorne before the debrief"
   ],
   "line": "The CM observes and logs; no signal, message or coaching to John, during or after."
  },
  "d5m4-a2": {
   "who": "Margaret Doe",
   "role": "family",
   "persona": "Worried mother and emergency contact; protective; asks what happens if John misses the deposition; wants to help but has no authority.",
   "context": "02/03/2027, Track B. John has been unreachable since 01/22 (lost his phone; new number). His deposition is 02/18/2027, with prep sessions 02/04 and 02/16; a certified warning letter went to 2214 Maple Hollow Rd. The CM left Margaret a voicemail; she calls back, says John is fine and working, and gives his new number if asked. She asks whether he will “lose the case” and what the letter means. She is not the client.",
   "opening": "This is Margaret Doe, John's mom. You left me a message. Is everything alright? He lost his phone, he's got a new number. Is he in trouble over this deposition?",
   "goals": [
    "Verify her identity against the emergency-contact record",
    "Say only that the firm needs John to call, and how",
    "Share no case details or consequences of missing the deposition",
    "Log the call and any new number, to verify with John"
   ],
   "line": "Margaret is not the client: the CM shares nothing on the case and never advises."
  },
  "d5m6-a1": {
   "who": "Denise Harlow",
   "role": "client",
   "persona": "Hurt and embarrassed more than angry; feels the firm gave up because she couldn't pay for therapy. Pushes for an answer on whether her case was worthless.",
   "context": "12/10/2026, a practice matter, not the Doe file. Denise Harlow was rear-ended 09/19/2026 and treated at Brookside Physical Therapy until 10/29/2026; she has no Health Plan, and Brookside declined a Letter of Protection. Atty. Thorne dropped the case and told her 12/08. Her Withdrawal Letter came by text and email 12/09; Certified Mail is on its way. She asks whether the case was worthless, whether restarting therapy would change things, and what to do now. She calms when she is heard and given a clear next step.",
   "opening": "Hi, it's Denise Harlow. I got your text with the letter. So that's it? Because I couldn't pay for therapy, my case was just... worthless?",
   "goals": [
    "Listen, acknowledge her frustration and confirm the letter reached her",
    "Give no view on the claim's worth or on restarting treatment",
    "Point her only to Atty. Thorne's call and the letter's next step",
    "Log the call and route her questions to Atty. Thorne"
   ],
   "line": "No view on the claim's worth, no explanation of the drop, no advice: Atty. Thorne's call."
  },
  "d5m5-a1": {
   "who": "John Doe",
   "role": "client",
   "persona": "Relieved it's over but upset at the number; a friend kept more from his settlement. Wants to know where his money went.",
   "context": "07/27/2027. The arbitration award came in 07/06; both UM checks and Keystone's are in trust: $40,000.00. John has the draft Settlement Statement: $15,748.75 to him. He remembers Atty. Thorne mentioning the 40% tier when suit was filed, not the amount. He thinks the arbitrator cut his award for the gap, and asks whether suing was a mistake and whether the fee is fair. He calms with plain arithmetic and a clear next step.",
   "opening": "Hey, it's John. I got the statement. Forty thousand, and I get fourteen-seven? My buddy settled his case and kept way more than that. Where did it all go?",
   "goals": [
    "Walk the deductions in order: fee, costs, liens, net",
    "Show the 40% tier from his own retainer",
    "Give the reduced lien figures and their written acceptances",
    "Route whether suing was worth it to Atty. Thorne"
   ],
   "line": "Explain the arithmetic only; no opinion on the lawsuit, the fee or the award."
  }
 },
 "fallout": [
  {
   "if": {
    "activity": "d1m1-open",
    "check": 1
   },
   "then": {
    "activity": "d2m1-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Letter merge blocked: client role reads “Driver”",
     "body": "The Harbor Point and Cardinal State LORs will not generate: the matter record still lists John Doe as the driver. A driver listing points at the wrong coverage. Correct it from the Police Report before today's letters go."
    }
   }
  },
  {
   "if": {
    "activity": "d1m3-a1",
    "check": 4
   },
   "then": {
    "activity": "d2m1-a2",
    "event": {
     "channel": "email",
     "from": "Dana Whitfield (dana.whitfield@keystonemutual.example)",
     "subject": "RE: KM-26-440871 — your client's statement",
     "body": "For your file: before your letter reached us, Mr. Doe told our caller on 02/11 that he “felt fine, just sore” and had no plans to see a doctor. That is in our claim notes and will be weighed against the treatment you are presenting."
    }
   }
  },
  {
   "if": {
    "activity": "d1m1-a1",
    "check": 4
   },
   "then": {
    "activity": "d1m4-a2",
    "event": {
     "channel": "memo",
     "from": "Atty. Elijah Thorne",
     "subject": "Case Plan returned: coverage band",
     "body": "Your coverage band carries $40,000 with no source for any limit and no “preliminary” mark. I can't set strategy on numbers I can't trace. Put the document and date behind each limit, mark the projection preliminary where one is missing, and route it again."
    }
   }
  },
  {
   "if": {
    "activity": "d1m1-open",
    "check": 3
   },
   "then": {
    "activity": "d1m2-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Calendar audit: no statute of limitations docketed",
     "body": "Step 1 review cannot list live deadlines: LSH-2026-MVA-770412 has no SOL on the calendar and two roles still read “unknown”. SOL 02/06/2028 must be docketed with reminders before outreach continues; the gap is reported to Atty. Thorne."
    }
   }
  },
  {
   "if": {
    "activity": "d1m3-a2",
    "check": 4
   },
   "then": {
    "activity": "d1m2-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Task audit: no treatment-start follow-up",
     "body": "No task tracks whether John Doe has started treatment. His silence since 02/10/2026 surfaced only through today's no-contact flag, and six days have run with no provider, no first visit and no date to check against."
    }
   }
  },
  {
   "if": {
    "activity": "d2m2-a1",
    "check": 2
   },
   "then": {
    "activity": "d2m2-a2",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Treatment risk missed: rental end never calendared",
     "body": "The rental's 03/19/2026 end date was recorded in John Doe's assessment but never calendared as a treatment risk. He lost his transport three weeks ago with no plan in place, and the firm is learning of it from the clinic's missed-visit alert."
    }
   }
  },
  {
   "if": {
    "activity": "d2m3-a1",
    "check": 2
   },
   "then": {
    "activity": "d2m3-a2",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Gap record: corroboration never requested",
     "body": "No tasks exist for John Doe's texts to his mother, the 02/07/2026 Riverton Drug receipt or Northgate's call-out records. Those gap reasons stand as “account only” until the documents are chased, with the pre-demand session days away."
    }
   }
  },
  {
   "if": {
    "activity": "d1m1-a2",
    "check": 3
   },
   "then": {
    "activity": "d2m4-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Lien Tracker: Peach State missing from the pre-demand list",
     "body": "The pre-demand lien list pulls only dated, flagged liens. Peach State's $1,860.00 reimbursement claim, asserted 02/27/2026, never got a dated flag and is missing. The Net Sheet projection overstates John Doe's share by $1,860.00 until the record is fixed."
    }
   }
  },
  {
   "if": {
    "activity": "d3m1-a1",
    "check": 3
   },
   "then": {
    "activity": "d3m2-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Calendar audit: no acceptance deadline on the BI demand",
     "body": "Keystone KM-26-440871: no service log, no return receipt filed and no 08/21/2026 deadline docketed. Dana Whitfield is calling with an offer, and the file cannot prove when her 30 days started. Atty. Thorne must be told before the call."
    }
   }
  },
  {
   "if": {
    "activity": "d3m2-a2",
    "check": 4
   },
   "then": {
    "activity": "d3m4-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Trust reconciliation exception: Harbor Point check",
     "body": "Harbor Point's $20,000.00 check (received 10/05/2026) has no signed UM release filed before receipt and no same-day deposit entry. The Recovery Ledger cannot tie to the Trust Ledger; the Net Sheet is held for Atty. Thorne's review."
    }
   }
  },
  {
   "if": {
    "activity": "d3m3-a2",
    "check": 3
   },
   "then": {
    "activity": "d3m4-a2",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Disbursement hold: Riverton Spine & Rehab payoff unsigned",
     "body": "The $3,470.00 command to Riverton Spine & Rehab rests on a phone note, with no signed Payoff Letter. It cannot be queued, the 10/22/2026 disbursement waits, and nothing yet stops Riverton from balance-billing John Doe."
    }
   }
  },
  {
   "if": {
    "activity": "d3m4-a1",
    "check": 4
   },
   "then": {
    "activity": "d3m4-a2",
    "event": {
     "channel": "call",
     "from": "John Doe",
     "subject": "Client call before disbursement: future injections",
     "body": "John Doe: “Dr. Reyes said I might need more shots. Who pays for those after this?” No flag on the $3,400–$6,800 future care reached Atty. Thorne before John signed a full-and-final statement. Atty. Thorne must speak with him before funds move."
    }
   }
  },
  {
   "if": {
    "activity": "d4m2-a1",
    "check": 1
   },
   "then": {
    "activity": "d5m1-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Discovery Countdown: no RFA entry ever existed",
     "body": "The 15 Requests for Admission never had a calendar entry, so no warning fired before 01/04/2027. Whether they were answered in time now rests on one unlogged Certificate of Service; unanswered RFAs may be deemed admitted."
    }
   }
  },
  {
   "if": {
    "activity": "d4m3-a1",
    "check": 0
   },
   "then": {
    "activity": "d4m4-a1",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Binder audit: Riverton Spine & Rehab still at $6,290.00",
     "body": "Mediation Binder Section 4 still carries Riverton Spine & Rehab at $6,290.00, the 05/04/2026 duplicate included: medical $15,002.40 against the audited $14,817.40. The binder is due 03/11/2027, and Keystone already calls the ledger unverified."
    }
   }
  },
  {
   "if": {
    "activity": "d4m3-a2",
    "check": 3
   },
   "then": {
    "activity": "d4m4-a2",
    "event": {
     "channel": "alert",
     "from": "CMS",
     "subject": "Exchange set audit: Lien Sheet overstated",
     "body": "The attorney's-set Lien Sheet still lists Harbor Point PIP $5,000.00 and Summit Imaging $2,395.00, and Crescent as open. Liens actually owed: $6,485.00. A $7,395.00 overstatement sits nine days before the 06/02/2027 exchange."
    }
   }
  },
  {
   "if": {
    "activity": "d5m3-a1",
    "check": 4
   },
   "then": {
    "activity": "d5m3-a2",
    "event": {
     "channel": "memo",
     "from": "Atty. Elijah Thorne",
     "subject": "Mock stopped: what did John review?",
     "body": "AI Mercer asked what John reviewed to prepare. John: “The notes the Case Manager gave me.” I stopped the mock. Anything you handed him may have to be disclosed. Send me every word you gave him before we resume."
    }
   }
  }
 ],
 "timeline": [
  {
   "date": "02/06/2026",
   "label": "Collision · date of loss",
   "track": "",
   "lane": ""
  },
  {
   "date": "02/09/2026",
   "label": "Intake · retainer and HIPAA signed",
   "track": "",
   "lane": ""
  },
  {
   "date": "02/16/2026",
   "label": "John goes quiet · No Contact Protocol",
   "track": "",
   "lane": "care"
  },
  {
   "date": "02/17/2026",
   "label": "LORs out · PD liability accepted",
   "track": "",
   "lane": "claims"
  },
  {
   "date": "02/20/2026",
   "label": "First treatment · urgent care",
   "track": "",
   "lane": "care"
  },
  {
   "date": "02/23/2026",
   "label": "LOP · Riverton Spine & Rehab",
   "track": "",
   "lane": "care"
  },
  {
   "date": "02/27/2026",
   "label": "Peach State reimbursement notice",
   "track": "",
   "lane": "claims"
  },
  {
   "date": "03/02/2026",
   "label": "Harbor Point confirms coverage in writing",
   "track": "",
   "lane": "claims"
  },
  {
   "date": "03/13/2026",
   "label": "Cervical MRI · C5-C6 herniation",
   "track": "",
   "lane": "care"
  },
  {
   "date": "03/20/2026",
   "label": "BI limit confirmed in writing",
   "track": "",
   "lane": "claims"
  },
  {
   "date": "04/02/2026",
   "label": "Care disrupted · 19 days",
   "track": "",
   "lane": "care"
  },
  {
   "date": "04/22/2026",
   "label": "Injection redirected to Crescent",
   "track": "",
   "lane": "care"
  },
  {
   "date": "05/15/2026",
   "label": "Cervical epidural steroid injection",
   "track": "",
   "lane": "care"
  },
  {
   "date": "06/12/2026",
   "label": "MMI · Lakeside Orthopedics",
   "track": "",
   "lane": "care"
  },
  {
   "date": "06/19/2026",
   "label": "Causation Letter · Dr. Reyes",
   "track": "",
   "lane": "care"
  },
  {
   "date": "07/20/2026",
   "label": "BI Time-Limited Demand served",
   "track": "",
   "lane": ""
  },
  {
   "date": "08/05/2026",
   "label": "Keystone offers $3,500 · the fork",
   "track": "",
   "lane": ""
  },
  {
   "date": "08/12/2026",
   "label": "Keystone tenders $10,000 BI limits",
   "track": "A",
   "lane": ""
  },
  {
   "date": "08/21/2026",
   "label": "Demand lapses unaccepted",
   "track": "B",
   "lane": ""
  },
  {
   "date": "09/08/2026",
   "label": "Impasse memo to Atty. Thorne",
   "track": "B",
   "lane": ""
  },
  {
   "date": "09/24/2026",
   "label": "Complaint filed · 26-CV-04417",
   "track": "B",
   "lane": ""
  },
  {
   "date": "09/29/2026",
   "label": "Harbor Point pays $20,000",
   "track": "A",
   "lane": ""
  },
  {
   "date": "10/06/2026",
   "label": "Cardinal State tenders $10,000",
   "track": "A",
   "lane": ""
  },
  {
   "date": "10/14/2026",
   "label": "Smith served after skip-trace",
   "track": "B",
   "lane": ""
  },
  {
   "date": "10/22/2026",
   "label": "Disbursement to John Doe",
   "track": "A",
   "lane": ""
  },
  {
   "date": "10/30/2026",
   "label": "Closing memo · file closed",
   "track": "A",
   "lane": ""
  },
  {
   "date": "11/12/2026",
   "label": "Answer filed · Mercer & Hale",
   "track": "B",
   "lane": ""
  },
  {
   "date": "01/04/2027",
   "label": "Discovery responses due",
   "track": "B",
   "lane": ""
  },
  {
   "date": "02/18/2027",
   "label": "John Doe deposed",
   "track": "B",
   "lane": ""
  },
  {
   "date": "03/18/2027",
   "label": "Mediation · BI limits tendered",
   "track": "B",
   "lane": ""
  },
  {
   "date": "06/22/2027",
   "label": "UM arbitration hearing",
   "track": "B",
   "lane": ""
  },
  {
   "date": "07/06/2027",
   "label": "Arbitration award · case won",
   "track": "B",
   "lane": ""
  },
  {
   "date": "07/30/2027",
   "label": "Track B disbursement",
   "track": "B",
   "lane": ""
  },
  {
   "date": "02/06/2028",
   "label": "Statute of limitations",
   "track": "",
   "lane": ""
  }
 ]
};
