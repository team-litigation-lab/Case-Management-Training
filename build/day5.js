const DAY5 = {
  id: 5,
  title: "Litigation, Property Damage, Liability Disputes & MIA Clients",
  theme: "The CM's Tactical Role in Litigation · Pleadings, Discovery & Trial Prep · Litigation Traps & KPIs · Deposition Preparation & the 7 Golden Rules · The Litigation Toolkit · Deadline Calculation · Evading Defendants & Subpoenas · File Architecture · Jordan Davies Case Study · Property Damage in Litigation",
  objective: "Manage a litigated file phase by phase, prepare a client for deposition operationally and psychologically, run the core litigation documents and processes on strict deadlines, handle liability disputes and MIA clients, and explain how property damage is valued and used in litigation.",
  lessons: [
    { h: "Welcome to Day 5: Stepping into Litigation",
      layout: "THREEBOX",
      boxes: [
        { label: "01 Litigation", desc: "Map the process and where the CM fits." },
        { label: "02 Property Damage", desc: "How physical damage impacts an injury claim in court." },
        { label: "03 Liability Disputes & MIA Clients", desc: "Coverage, disputes and uncooperative clients." }
      ],
      fourPart: {
        corePrinciples: [
          "Today we step into the courtroom — or at least the preparation side of it — covering Litigation, Property Damage, and tricky situations like liability disputes and clients who go missing in action.",
          "By the end of the session you should feel confident guiding clients through every step of a lawsuit."
        ],
        howTo: [
          "Case Phase: Litigation",
          "Property Damage and how it affects a case in litigation",
          "Liability Disputes; MIA Clients"
        ],
        bestPractices: [
          "Litigation is the path when negotiations with the insurer fail.",
          "Pitfall: treating a lawsuit like a longer negotiation."
        ],
        discussionCase: "When negotiations with an insurer fail, what is our very next legal step?"
      },
      trainerCue: "Quick question for the group before the next slide: when negotiations fail, what is our very next legal step?"
    },
    { h: "The Case Manager's Tactical Role in Litigation: The Litigation Lifecycle",
      layout: "PROCESS",
      processSteps: [
        { label: "Pleadings Phase", desc: "File complaint · serve defendant · receive the Answer. Your role: track service timelines & draft initial files." },
        { label: "Discovery Phase", desc: "Interrogatories · RFPs · depositions. Your role: gather discovery data & prep the client for questions." },
        { label: "Trial Prep Phase", desc: "Expert disclosures · motion practice · trial/settlement. Your role: coordinate schedules & update final medicals." }
      ],
      fourPart: {
        corePrinciples: [
          "When negotiations break down and a case moves into formal litigation, the dynamics change entirely.",
          "It is essential to grasp how Property Damage (PD) relates to litigation — it can be the definitive evidence of injury or the defense's most formidable tool.",
          "A lawsuit is a highly structured, court-mandated process. If you miss a deadline or misfile a document, the court can dismiss the client's case entirely."
        ],
        howTo: [
          "Pleadings — file the lawsuit and legally notify the defendant; get documents filed fast and the defendant served.",
          "Discovery — both sides trade evidence and sit for depositions; this is where 80% of your time goes.",
          "Trial Prep — update final bills, issue subpoenas, organize trial binders."
        ],
        bestPractices: [
          "Pre-litigation is like an email negotiation; litigation is a strict, court-ordered process with non-negotiable rules.",
          "Pitfall: missing a court deadline the way you might let an adjuster deadline slide."
        ],
        discussionCase: "Which phase will take most of your time, and why?"
      },
      trainerCue: "Think of a lawsuit in three simple phases — then we break each down in detail."
    },
    { h: "Phase 1: The Pleadings & Service Stage",
      fourPart: {
        corePrinciples: [
          "Your primary job is to ensure the lawsuit is successfully kicked off and that the defendant cannot claim they “never knew” about it."
        ],
        howTo: [
          "Tracking the Statute of Limitations (SOL) — the most critical deadline in the firm. Ensure the Complaint is filed well before the SOL expires.",
          "Managing Process Servers — once the attorney drafts the Complaint, coordinate with process servers or the local sheriff to have the defendant personally served.",
          "The “Proof of Service” Check — get the signed Affidavit of Service and file it with the court immediately. If the defendant evades service, alert your attorney to file for alternative service (publication or certified mail)."
        ],
        bestPractices: [
          "Miss the SOL by one day and the client loses the right to sue forever.",
          "Pitfall: an unfiled Affidavit of Service sitting in email."
        ],
        discussionCase: "What happens if the defendant dodges the process server?"
      },
      trainerCue: "In Phase 1, our primary job is to kick off the legal engine."
    },
    { h: "Phase 2: Discovery — A. Interrogatories & Requests for Production",
      fourPart: {
        corePrinciples: [
          "Discovery is the formal process where both sides must lay their cards on the table. Case managers spend 80% of their litigation time here.",
          "The defense will send a long list of written questions (Interrogatories) and demands for physical documents (RFPs)."
        ],
        howTo: [
          "Your Strategy — do not just mail these to the client. Schedule a dedicated “Discovery Intake Meeting” (in person or via Zoom).",
          "The Execution — walk the client through every question, draft their answers into the formal legal template, and compile all requested documents (tax returns, employment records, past medical history).",
          "The Verification — ensure the client signs a “Verification Page” under oath swearing the answers are true."
        ],
        bestPractices: [
          "A 20-page legal questionnaire mailed to a client working two jobs ends up in a drawer — schedule the 60-minute meeting.",
          "Pitfall: sending responses without a signed verification page."
        ],
        discussionCase: "How would you prepare a client for the Discovery Intake Meeting?"
      },
      trainerCue: "Strategy: never just mail discovery to a client — walk them through it."
    },
    { h: "Phase 2: Discovery — B. Deposition Coordination & Preparation",
      fourPart: {
        corePrinciples: [
          "A deposition is an oral interview under oath, recorded by a court reporter. The defense attorney will cross-examine the client for hours to try to trip them up."
        ],
        howTo: [
          "Logistics Management — schedule the court reporter and videographer, book the conference room or set up the Zoom link, and coordinate calendars between your attorney, the defense attorney, and the client.",
          "Client Hand-Holding — clients are terrified of depositions. Send a preparation packet one week prior.",
          "Remind them of the core rules: listen carefully, pause before answering, never guess, and tell the absolute truth."
        ],
        bestPractices: [
          "Clients expect a dramatic movie trial — reset that expectation early.",
          "Pitfall: sending the prep packet the day before."
        ],
        discussionCase: "What goes in the one-week-out prep packet?"
      },
      trainerCue: "As a case manager you handle both sides of this: logistics and client hand-holding."
    },
    { h: "Phase 3: The Trial & Mediation Preparation Stage",
      fourPart: {
        corePrinciples: [
          "As the case nears its end, compile the final puzzle pieces so the attorney walks into court fully armed."
        ],
        howTo: [
          "Updating Medical Records & Bills (The Final Run) — litigation can take 1 to 3 years; the client may have new doctors, surgery, or new bills. Update all records so the jury sees the total cost.",
          "Subpoena Management — draft and issue trial subpoenas to witnesses, treating physicians, and police officers so they legally show up to testify.",
          "Trial Binder Organization — assemble trial binders with all exhibits (medical records, scene photos, PD estimates), indexed and tabbed for the counsel table."
        ],
        bestPractices: [
          "If a $50,000 surgery bill from six months ago isn't requested, the jury won't see it and the client won't be reimbursed.",
          "Pitfall: trial binders built from pre-litigation records only."
        ],
        discussionCase: "How often should you run the “final run” on records during litigation?"
      },
      trainerCue: "Phase 3 is all about crossing t's and dotting i's."
    },
    { h: "The Litigation Mindset: Critical Traps & KPIs",
      fourPart: {
        corePrinciples: [
          "Trap 1: treating court deadlines like insurance deadlines. In pre-lit you can usually ask for an extension; in litigation, court deadlines are absolute. Missing a discovery deadline can bar critical medical evidence at trial.",
          "Trap 2: letting the client talk directly to the adjuster. Once a lawsuit is filed, all communication with the defense must go through counsel. If an adjuster or defense investigator calls the client, step in, cease the communication, and notify your attorney."
        ],
        howTo: [
          "KPI — Service Check: every new lawsuit has a confirmed process server assigned within 48 hours of filing.",
          "KPI — Discovery Countdown: initial discovery responses drafted and sent to the attorney at least 7 days before the court-mandated deadline.",
          "KPI — The 30-Day Client Pulse: call every litigation client at least once every 30 days with a status update, even if nothing new happened in court."
        ],
        bestPractices: [
          "Audit your litigation docket weekly against these KPIs.",
          "Pitfall: clients feeling forgotten during slow litigation."
        ],
        discussionCase: "How often should we call litigation clients even when nothing is new?"
      },
      trainerCue: "Quick check: every 30 days — to keep the client's mind at ease."
    },
    { h: "Preparing Your Client for a Deposition: The Pre-Deposition Audit",
      fourPart: {
        corePrinciples: [
          "A client's deposition can significantly influence the outcome of a litigated case.",
          "While the attorney focuses on legal strategy, your responsibility is preparing the client operationally and psychologically.",
          "Before scheduling a prep meeting, review the file thoroughly to pinpoint any “landmines” the defense may exploit."
        ],
        howTo: [
          "Examine Previous Medical History — find prior injuries (e.g., a 2018 lower-back injury). The defense will ask; the client must answer truthfully without appearing to conceal.",
          "Audit Discovery Responses — oral testimony must align with the written interrogatories the client already signed.",
          "Review Social Media — if the client claims a severe knee injury but posted hiking or dancing photos last month, inform the attorney right away."
        ],
        bestPractices: [
          "Consistency is key to establishing credibility.",
          "Pitfall: letting the client be surprised by their own prior records."
        ],
        discussionCase: "What landmines exist in John Doe's file for his deposition?"
      },
      trainerCue: "The defense will search insurance databases to check if the client is hiding prior injuries."
    },
    { h: "Discovery Intake Meeting — Pillar 1: De-escalating Anxiety",
      fourPart: {
        corePrinciples: [
          "When hosting the prep meeting (in person or Zoom), organize it around three essential pillars.",
          "Pillar 1: clients often feel anxious because their understanding of legal matters is shaped by television."
        ],
        howTo: [
          "Explain the setting early and plainly.",
          "Use the script: “Mr. Jones, this is not a courtroom drama. There are no judges, no juries, and no shouting involved. It's simply a business meeting in a conference room where the other party will hear your perspective. While you cannot lose your case today, you can safeguard it by maintaining your composure.”"
        ],
        bestPractices: [
          "Calm clients give shorter, more accurate answers.",
          "Pitfall: over-coaching until the client sounds rehearsed."
        ],
        discussionCase: "Why does explaining this early help during the actual questioning?"
      },
      trainerCue: "Start by calming their nerves."
    },
    { h: "Discovery Intake Meeting — Pillar 2: The Essential Testimony Guidelines",
      fourPart: {
        corePrinciples: [
          "Devote the majority of prep time to practicing these behaviors with the client, using mock questions to assess readiness."
        ],
        howTo: [
          "The 2-Second Pause — count “1, 2” after every question; it breaks the defense lawyer's speed and gives our attorney time to object.",
          "The Liar's Trap — defense attorneys rarely ask about past injuries to learn something new; they already know and are testing whether the client will lie.",
          "Stop Talking — answer strictly what was asked. “Do you know what time it was?” → “Yes” or “No,” not “Yes, it was 3 PM and I was rushing home.”"
        ],
        bestPractices: [
          "Run mock questions until the pause is automatic.",
          "Pitfall: a client who volunteers extra detail."
        ],
        discussionCase: "Run three mock questions with a partner."
      },
      trainerCue: "Drill these three core rules into your client."
    },
    { h: "Discovery Intake Meeting — Pillar 3: Dress Code & Professional Demeanor",
      fourPart: {
        corePrinciples: [
          "The insurance adjuster decides settlement value partly from the defense attorney's “Evaluation Report” of the client."
        ],
        howTo: [
          "The Standard — dress as if attending a job interview or a funeral: neat, clean, respectful (business casual).",
          "The Warning — no flashy jewelry, high-end watches, or clothing with political or graphic slogans. Designer labels undermine claims of financial difficulty or significant distress.",
          "Tone — stay polite; anger or sarcasm makes the client look bad in the final report."
        ],
        bestPractices: [
          "A client claiming financial hardship in $1,000 designer shoes destroys their credibility.",
          "Pitfall: not mentioning dress code because it feels awkward."
        ],
        discussionCase: "How do you raise dress code without offending the client?"
      },
      trainerCue: "How a client looks and acts matters as much as what they say."
    },
    { h: "Navigating the Silent Traps — Drill A: The “Is That All?” Trap",
      fourPart: {
        corePrinciples: [
          "During prep, conduct targeted mock drills to equip the client with effective defense tactics."
        ],
        howTo: [
          "The Strategy — the defense lists injuries and asks, “So, you only hurt your neck — correct?” If the client says “Yes,” they may be barred from raising back or shoulder complaints later.",
          "The Solution — teach the client to respond: “These are the primary injuries that come to mind at the moment, but my complete medical record thoroughly details everything I've discussed with my doctors.”"
        ],
        bestPractices: [
          "Practice the answer until it feels natural.",
          "Pitfall: a “yes” that narrows the case forever."
        ],
        discussionCase: "Role-play the trap with a partner."
      },
      trainerCue: "Defense attorneys love psychological traps — run these drills."
    },
    { h: "Navigating the Silent Traps — Drill B: The Thoughtful Silence",
      fourPart: {
        corePrinciples: [
          "The defense attorney creates a prolonged silence after the client's answer, expecting the client to fill it."
        ],
        howTo: [
          "The Solution — “After you answer the question, make eye contact with the attorney and remain silent. Embrace the awkwardness; that's their issue, not yours.”",
          "Never Guess or Speculate — “I don't know” or “I don't recall” are the smartest answers when unsure.",
          "Don't try to “win” the case at the deposition — answer politely and let our attorney handle the legal battles."
        ],
        bestPractices: [
          "Silence is safe; rambling is not.",
          "Pitfall: filling silence with speculation."
        ],
        discussionCase: "Practice 10 seconds of silence after an answer."
      },
      trainerCue: "Human nature makes us fill awkward silence — teach the client not to."
    },
    { h: "Case Manager Checklist: The Day Before the Deposition",
      fourPart: {
        corePrinciples: [
          "Complete this checklist one day before the deposition."
        ],
        howTo: [
          "Logistics Confirmation — verify date, time, and location (or Zoom link) with the client, the attorney, and the court reporter.",
          "Exhibit Preparation — finalized medical records, invoices, and property damage photographs organized and accessible for your attorney.",
          "Emergency Contact Verification — a backup phone number for the client in case of traffic delays or technical difficulties."
        ],
        bestPractices: [
          "Warn the client about objections: the moment our lawyer speaks, stop talking; usually they'll say “You can answer”; if they say “I instruct the witness not to answer,” stay quiet.",
          "Pitfall: no backup contact when the client's Zoom fails."
        ],
        discussionCase: "What's your plan if the client is 20 minutes late?"
      },
      trainerCue: "Warn the client about objections so they don't panic."
    },
    { h: "What Will the Defense Attorney Ask Me? The Four Categories",
      layout: "QUADRANT",
      quadrants: [
        { label: "1. Your Personal Background", desc: "Work history, residential history, and whether you've ever been involved in a lawsuit before." },
        { label: "2. Mechanics of the Crash", desc: "Lane, speed, weather, and how the impact felt." },
        { label: "3. Medical History", desc: "Injuries from this accident and any health issues or injuries before it." },
        { label: "4. Impact on Daily Life", desc: "How the pain affects work, hobbies, family responsibilities and routine." }
      ],
      fourPart: {
        corePrinciples: [
          "The defense attorney may ask a very broad range of questions to discover the facts of the case. Generally they fall into four main categories."
        ],
        howTo: [
          "Personal Background",
          "Mechanics of the Crash",
          "Medical History",
          "Impact on Daily Life"
        ],
        bestPractices: [
          "Clients most often hide or underreport #3 — past medical history.",
          "Pitfall: prepping only on the crash mechanics."
        ],
        discussionCase: "Which area are clients most likely to underreport if we don't prep them?"
      },
      trainerCue: "Hint: it's usually #3, past medical history."
    },
    { h: "The 7 Golden Rules for Testifying (Rules 1–3)",
      fourPart: {
        corePrinciples: [
          "The defense attorney's goal is to get you to contradict yourself, lose your temper, or exaggerate your injuries so they can damage your credibility. These rules protect the case."
        ],
        howTo: [
          "Rule 1: Always Tell the Absolute Truth — a damaged case can be saved; a lied-about case cannot. Lies about prior accidents or injuries will be found through insurance databases, and once a jury catches a plaintiff in a lie, the case is effectively over.",
          "Rule 2: Pause Before You Answer — pause two full seconds; it gives time to think, clean audio for the court reporter, and a window for your attorney to object.",
          "Rule 3: Answer Vocally (No Gestures or Grunts) — the court reporter can't type a nod, a shrug, or “uh-huh.” Say “Yes” or “No.”"
        ],
        bestPractices: [
          "Rule 2 matters most when questions come fast.",
          "Pitfall: nodding instead of answering."
        ],
        discussionCase: "Why is pausing two seconds so important with fast-paced questions?"
      },
      trainerCue: "Walk through the first three of the 7 Golden Rules."
    },
    { h: "The 7 Golden Rules for Testifying (Rules 4–5)",
      fourPart: {
        corePrinciples: [
          "Estimating and guessing are very different — and short answers give the defense the smallest possible target."
        ],
        howTo: [
          "Rule 4: Never Guess or Speculate — Good estimate: “I was traveling roughly 35 to 40 miles per hour.” Bad guess: “He must have been going 90 because of how hard it felt!” If you don't know: “I don't know” or “I don't recall.”",
          "Rule 5: Keep Answers Short and Concise — answer only the question, then stop. “What day of the week did this happen?” → “Tuesday.” Not: “It was a Tuesday, and I remember because I was running late to pick up my daughter from soccer practice…”"
        ],
        bestPractices: [
          "Give them a target as small as possible.",
          "Pitfall: volunteering extra information."
        ],
        discussionCase: "Why does volunteering extra information usually hurt a claim?"
      },
      trainerCue: "Quick check: why does volunteering information hurt the client?"
    },
    { h: "The 7 Golden Rules for Testifying (Rules 6–7)",
      fourPart: {
        corePrinciples: [
          "The final two rules protect the client from psychological tactics and from trying to “win.”"
        ],
        howTo: [
          "Rule 6: Beware of the “Silent Trap” — after a short answer, some attorneys just stare in silence. Don't fill it. Sit in silence and wait for the next question.",
          "Rule 7: Do Not Try to Win the Case in the Deposition — you won't convince the defense attorney their driver is a bad person, and you won't get an apology. Be polite, stay calm, and leave the legal battling to your attorney."
        ],
        bestPractices: [
          "A deposition is strictly information gathering.",
          "Pitfall: a client who argues with defense counsel."
        ],
        discussionCase: "If a client argues with the defense attorney, how does that affect the evaluation report?"
      },
      trainerCue: "Remind clients the deposition is for information gathering only."
    },
    { h: "Professional Presentation: Dress Code & Demeanor",
      layout: "COMPARE",
      compareLeft: { label: "What to Wear", items: ["Goal: “Business Casual” — respectful, clean, serious.", "Men: collared shirt, slacks or neat jeans with no holes, closed-toe shoes.", "Women: professional blouse, slacks, modest dress, or neat skirt.", "Avoid: sweatpants, graphic tees, heavy jewelry, hats, athletic wear."] },
      compareRight: { label: "Body Language & Tone", items: ["Stay calm — if you get angry, the report says “easily rattled and will look aggressive to a jury.”", "Do not minimize your pain — be honest, don't exaggerate.", "Use a matter-of-fact, descriptive tone about physical limitations."] },
      fourPart: {
        corePrinciples: [
          "How you present yourself matters as much as what you say — the insurance company uses the deposition to judge how a real jury will react to you."
        ],
        howTo: [
          "Confirm the outfit plan in the prep meeting.",
          "For virtual depositions, check background, lighting and seating.",
          "Rehearse describing limitations in a matter-of-fact tone."
        ],
        bestPractices: [
          "Scenario: a client on a virtual deposition in a t-shirt, flashy jewelry, sitting on their bed — that tells the adjuster the claim isn't serious.",
          "Pitfall: ignoring virtual-deposition presentation."
        ],
        discussionCase: "What impression does a client on their bed in a t-shirt give?"
      },
      trainerCue: "Break it into what to wear and body language & tone."
    },
    { h: "What Happens When Your Lawyer Objects?",
      fourPart: {
        corePrinciples: [
          "During the deposition, the attorney may interrupt with “Objection!” followed by a legal term (“Objection, form” or “Objection, speculation”)."
        ],
        howTo: [
          "Do Not Panic — it's standard procedure; the lawyer is placing a formal flag on the record to protect you.",
          "Stop Talking Immediately — the moment your attorney speaks, close your mouth; don't finish the sentence.",
          "Listen for Instructions — in 95% of cases the lawyer states the objection and says “You can answer the question.” If they say “I instruct the witness not to answer,” sit tight and wait for the next question."
        ],
        bestPractices: [
          "Explain objections ahead of time so the client doesn't freeze.",
          "Pitfall: a client who keeps talking over an objection."
        ],
        discussionCase: "Why is it dangerous for a client to keep talking during an objection?"
      },
      trainerCue: "Clients often freeze up when our lawyer interrupts — explain it ahead of time."
    },
    { h: "The Litigation Toolkit: The Litigation Document Index",
      layout: "TABLE",
      tableHeaders: ["Document Name", "What It Is", "Why It Matters to the Case Manager"],
      tableRows: [
        ["The Complaint / Petition", "The formal document drafted by the attorney stating the facts, alleging negligence, and demanding damages.", "Kickoff Document: track the filing date to ensure the SOL is met."],
        ["The Answer", "The defense's formal response — usually denying liability and listing “affirmative defenses” (e.g., claiming our client was at fault).", "The Roadmap: tells you exactly what the defense disputes so you know what evidence to hunt for."],
        ["Interrogatories", "Written questions that must be answered under oath within a strict deadline (usually 30 days).", "The Deadline Clock: schedule the client to help draft responses immediately upon receipt."],
        ["Requests for Production (RFP)", "A formal demand for physical evidence: medical records, payroll logs, photos, social media downloads.", "Evidence Gathering: you compile every item requested for attorney review/redaction."],
        ["Requests for Admission (RFA)", "Statements the other side must explicitly “admit” or “deny” (e.g., “Admit that you were speeding”).", "The Danger Zone: unanswered by the deadline = automatically ADMITTED, which can instantly kill a case."]
      ],
      fourPart: {
        corePrinciples: [
          "When litigation begins, documents transition from “administrative tracking” to evidence. Missing, misfiled, or disorganized documents can jeopardize a trial.",
          "You must be able to open a litigation file and instantly identify these five foundational documents — the backbone of any lawsuit."
        ],
        howTo: [
          "The Complaint / Petition",
          "The Answer",
          "Interrogatories",
          "Requests for Production (RFP)",
          "Requests for Admission (RFA)"
        ],
        bestPractices: [
          "Treat every RFA as an immediate fire and notify the attorney.",
          "Pitfall: a perfect Complaint filed one day after the SOL — the case is gone."
        ],
        discussionCase: "What's the risk of missing the 30-day deadline on an RFA asking to admit “no permanent injuries”?"
      },
      trainerCue: "Five foundational documents: Complaint, Answer, Interrogatories, RFPs, RFAs."
    },
    { h: "Critical Litigation Processes: Service of Process & E-Filing/Docketing",
      layout: "PROCESS",
      processSteps: [
        { label: "Issue Summons", desc: "Draft; court clerk signs." },
        { label: "Assign Process Server", desc: "Send Complaint, Summons, defendant details." },
        { label: "Monitor the Timeline", desc: "Follow up every 5 days; watch for evasion." },
        { label: "File Proof of Service", desc: "Signed affidavit filed with the court." }
      ],
      fourPart: {
        corePrinciples: [
          "Litigation is governed by rigid court procedures. These are processes you execute weekly.",
          "Process 1: The Service of Process (SOP) Pipeline — filing a lawsuit means nothing if the defendant isn't legally notified.",
          "Process 2: The E-Filing and Docketing System — every document filed by either side generates a “Docket Entry.”"
        ],
        howTo: [
          "Issue the Summons.",
          "Assign the process server.",
          "Monitor the timeline every 5 days.",
          "File Proof of Service.",
          "Check the court docket weekly — don't rely solely on email notifications."
        ],
        bestPractices: [
          "If a Motion to Dismiss notification lands in spam, the clock is still ticking against you.",
          "Pitfall: relying on email alerts instead of the docket."
        ],
        discussionCase: "How would you build a weekly docket-check routine?"
      },
      trainerCue: "Follow the 4-step flowchart for service; check the docket weekly."
    },
    { h: "Critical Litigation Process 3: Third-Party Evidence Subpoenas",
      layout: "PROCESS",
      processSteps: [
        { label: "Draft the Subpoena", desc: "Court-approved Subpoena Duces Tecum." },
        { label: "Notice Opposing Counsel", desc: "Usually 5–10 days before serving the third party." },
        { label: "Formal Service", desc: "Process server → facility's Registered Agent." },
        { label: "Track Compliance", desc: "Call records dept 5 days before the deadline." }
      ],
      fourPart: {
        corePrinciples: [
          "When a hospital, cell phone provider, or employer refuses to hand over records voluntarily, initiate the subpoena process."
        ],
        howTo: [
          "Draft the Subpoena — fill out the court-approved Subpoena Duces Tecum (a command to produce documents).",
          "Notice to Opposing Counsel — serve a copy on the defense first (most states require 5–10 days' notice before serving the third party).",
          "Formal Service — a process server delivers the subpoena to the facility's Registered Agent.",
          "Track Compliance — call the facility's legal/records department 5 days before the deadline."
        ],
        bestPractices: [
          "Don't just send it and pray — follow up.",
          "Pitfall: serving the third party before noticing opposing counsel."
        ],
        discussionCase: "What's the risk of skipping notice to opposing counsel?"
      },
      trainerCue: "Follow the 4-step subpoena flow."
    },
    { h: "The 3 Golden Rules of Litigation File Maintenance",
      fourPart: {
        corePrinciples: [
          "Keeping a file organized during litigation prevents operational chaos."
        ],
        howTo: [
          "Rule 1: Separate Pre-Lit from Lit — the moment a lawsuit is filed, create sub-folders for Pleadings, Discovery (Sent & Received), Motions, and Subpoenas. Mixing pre-lit correspondence with pleadings creates chaos.",
          "Rule 2: Read the “Scheduling Order” Like the Bible — the judge's order lists absolute deadlines (discovery cutoff, expert designations, motions). Put it on the front of the file and enter every date on the master calendar with 30-, 14-, and 7-day alerts.",
          "Rule 3: Document All Extensions in Writing — a verbal agreement doesn't exist in the eyes of the court. Send: “Per our phone call, we agree to extend your discovery deadline to [Date].”"
        ],
        bestPractices: [
          "Every Scheduling Order date gets three alerts.",
          "Pitfall: a phone-only extension."
        ],
        discussionCase: "Write the extension confirmation email."
      },
      trainerCue: "Three golden rules to prevent operational chaos."
    },
    { h: "Key Performance Indicators (KPIs) for Document Management",
      layout: "THREEBOX",
      boxes: [
        { label: "The 48-Hour Docket Rule", desc: "Anything received from the court or opposing counsel is filed and docketed within 48 hours." },
        { label: "RFA Priority Check", desc: "Treat RFAs as a structural fire — alert the attorney the hour they land." },
        { label: "Subpoena Audit", desc: "Review all outstanding subpoenas every 10 days for compliance." }
      ],
      fourPart: {
        corePrinciples: [
          "Measure document management against three KPIs to keep files clean, compliant, and trial-ready."
        ],
        howTo: [
          "Upload and docket every incoming document within 48 hours.",
          "Alert the attorney the exact hour an RFA arrives.",
          "Set a recurring 10-day subpoena review."
        ],
        bestPractices: [
          "Put the subpoena audit on a recurring calendar reminder.",
          "Pitfall: RFAs waiting in an inbox overnight."
        ],
        discussionCase: "Which KPI is hardest to hit on a busy week?"
      },
      trainerCue: "These three KPIs keep litigation files clean, compliant, and trial-ready."
    },
    { h: "Advanced Workflow Deep-Dive: The Complaint / Petition",
      layout: "PROCESS",
      processSteps: [
        { label: "The Caption", desc: "Court name, parties, case number." },
        { label: "Jurisdiction", desc: "Why this court has authority." },
        { label: "Factual Allegations", desc: "Date, location, crash mechanics." },
        { label: "Causes of Action", desc: "Negligence, vicarious liability." },
        { label: "Prayer for Relief", desc: "Demand for compensation and remedies." }
      ],
      fourPart: {
        corePrinciples: [
          "To excel as a litigation case manager, understand document structure, drafting components, and legal timelines — not just names.",
          "The Complaint formally initiates the lawsuit. The attorney dictates legal arguments; the case manager verifies the factual foundation."
        ],
        howTo: [
          "[ ] The “Statute Date” — is the filing date safely before the Statute of Limitations?",
          "[ ] Entity Verification — did you verify the defendant's legal name via the Secretary of State or property records? (John Doe, or John Doe Enterprises, LLC?)",
          "[ ] The Registered Agent — if the defendant is a business, did you locate the exact name and address of its Registered Agent for service?"
        ],
        bestPractices: [
          "Run all three checks before the Complaint goes for signature.",
          "Pitfall: suing the wrong entity name."
        ],
        discussionCase: "How would you verify Apex Delivery Services' legal entity name?"
      },
      trainerCue: "The Complaint has 5 core sections; your 3-point pre-signature checklist protects the filing."
    },
    { h: "Written Discovery: Interrogatories, RFPs & RFAs",
      layout: "PROCESS",
      processSteps: [
        { label: "Dial the Calendar", desc: "Due date — typically 30 days from service." },
        { label: "Compile the Data", desc: "Pull what pre-lit already collected." },
        { label: "Discovery Intake Conference", desc: "60-minute live session with the client." }
      ],
      fourPart: {
        corePrinciples: [
          "When the defense sends a discovery packet, it must be dissected and calendar-tracked immediately."
        ],
        howTo: [
          "Drafting our own Interrogatories — Insurance Coverage: request all primary, excess, and umbrella policy limits.",
          "Course and Scope — ask whether the defendant driver was working or running an errand for an employer at the moment of the crash.",
          "Surveillance — formally ask whether they hired a private investigator to follow or film our client.",
          "Discovery received: calendar the due date, compile existing data, hold the client conference."
        ],
        bestPractices: [
          "Course-and-scope answers can open the employer's policy.",
          "Pitfall: forgetting to ask about excess/umbrella limits."
        ],
        discussionCase: "Why ask about surveillance?"
      },
      trainerCue: "Include the three baseline categories in every interrogatory set we send."
    },
    { h: "Master Timeline & Deadline Calculations",
      layout: "TABLE",
      tableHeaders: ["Triggering Event", "Next Legal Action Required", "Standard Deadline"],
      tableRows: [
        ["Complaint Filed", "Serve the Defendant", "90 to 120 Days (varies by local rule)"],
        ["Defendant Served", "Defendant must file an Answer", "20 to 30 Days (Federal is 21 days)"],
        ["Discovery Served", "Written Responses due", "30 Days (+3 for mail/e-service if applicable)"],
        ["Motion Filed", "File a Response/Opposition", "14 to 21 Days (strictly governed by local rules)"]
      ],
      fourPart: {
        corePrinciples: [
          "In litigation, missing a deadline by one day can get a case dismissed with prejudice (never refiled). Master how to calculate legal time."
        ],
        howTo: [
          "The Federal/State Calculation Rule — exclude the day of the triggering event; include the last day of the period.",
          "The “Mail Box” Trap — if served by mail or electronic portal instead of hand delivery, many states add 3 days. Confirm your local rules on e-service extensions.",
          "Use the Critical Timeline Matrix for standard deadlines."
        ],
        bestPractices: [
          "Calendar the conservative date when rules are unclear.",
          "Pitfall: counting the trigger day as day one."
        ],
        discussionCase: "Discovery served by mail on the 1st — when are responses due?"
      },
      trainerCue: "Mastering legal time calculation is non-negotiable."
    },
    { h: "The Process Server & Evading Defendant Protocol",
      layout: "PROCESS",
      processSteps: [
        { label: "Step 1: Skip Trace", desc: "Background check for utilities and active addresses." },
        { label: "Step 2: Vary Shifts", desc: "6:00 AM, 9:00 PM and weekend windows." },
        { label: "Step 3: Motion for Alternative Service", desc: "Social media, front-door posting, or mail." }
      ],
      fourPart: {
        corePrinciples: [
          "When defendants realize they're being sued, they often hide, refuse to answer the door, or quit their jobs to evade service.",
          "If you don't serve them before the court's deadline, the judge will dismiss the file for Want of Prosecution."
        ],
        howTo: [
          "Step 1: Skip Trace — run a comprehensive background check for updated utility records, employment details, and active addresses.",
          "Step 2: Vary Shifts — instruct the server to try outside standard hours: early morning (6:00 AM), late evening (up to 9:00 PM), and weekends.",
          "Step 3: Motion for Alternative Service — the attorney asks the court to permit service by social media, certified mail, or posting on the front door."
        ],
        bestPractices: [
          "Start the protocol early — don't wait until the service deadline.",
          "Pitfall: repeated attempts at the same time of day."
        ],
        discussionCase: "After 14 days of failed service, what do you do?"
      },
      trainerCue: "Follow the 3-Step Evading Defendant Protocol."
    },
    { h: "Subpoena Duces Tecum: Execution Strategy",
      layout: "PROCESS",
      processSteps: [
        { label: "Draft the Form", desc: "Case style, target entity, precise Exhibit A." },
        { label: "Notice Opposing Counsel", desc: "Before the third party." },
        { label: "Personal Service", desc: "To the custodian of records / Registered Agent." },
        { label: "The Invoice Check", desc: "Track and pay copy fees promptly." }
      ],
      fourPart: {
        corePrinciples: [
          "A Subpoena Duces Tecum compels hostile or uncooperative third parties to turn over evidence."
        ],
        howTo: [
          "The Scope Warning — never send a blanket subpoena for “all records of any kind”; it triggers a Motion to Quash as an overly broad fishing expedition.",
          "Keep it specific: “Any and all emergency room records, triage notes, and radiological imaging regarding [Client] for the treatment date of [Accident Date] only.”",
          "Follow the 4-step execution workflow."
        ],
        bestPractices: [
          "Pay copy invoices immediately to avoid delays.",
          "Pitfall: an overbroad Exhibit A."
        ],
        discussionCase: "Rewrite an overbroad subpoena request to be specific."
      },
      trainerCue: "Narrow, precise requests avoid a Motion to Quash."
    },
    { h: "Litigation File Architecture",
      layout: "TABLE",
      tableHeaders: ["Sub-folder", "Contents (examples)"],
      tableRows: [
        ["[CLIENT LAST NAME, FIRST NAME - CASE FILE] (Master Directory)", "All sub-folders below"],
        ["01_PLEADINGS", "Complaint_Filed_Stamped.pdf · Summons_Issued.pdf · Answer_and_Affirmative_Defenses.pdf"],
        ["02_SERVICE_DOCS", "Affidavit_of_Service_Executed.pdf"],
        ["03_DISCOVERY_PLAINTIFF_TO_DEFENDANT", "ROGS_Sent.pdf · RFP_Sent.pdf"],
        ["04_DISCOVERY_DEFENDANT_TO_PLAINTIFF", "Def_ROGS_Received.pdf · Final_Verified_Responses_Served.pdf"],
        ["05_SUBPOENAS", "Subpoena_Hospital_Records.pdf · Proof_of_Subpoena_Service.pdf"]
      ],
      fourPart: {
        corePrinciples: [
          "To keep files uniform across the firm, every digital file must match this sub-folder structure the moment a lawsuit is filed."
        ],
        howTo: [
          "Create the master directory named [CLIENT LAST NAME, FIRST NAME - CASE FILE].",
          "Create the five numbered sub-folders.",
          "Name every PDF with the standard convention.",
          "File each incoming document within 48 hours."
        ],
        bestPractices: [
          "Consistent names make any file searchable by anyone.",
          "Pitfall: “scan001.pdf” file names."
        ],
        discussionCase: "Where does an incoming Request for Admission go?"
      },
      trainerCue: "Data Flow: Organized & Compliant — five standardized sub-folders."
    },
    { h: "Advanced KPIs for Litigation Case Managers",
      fourPart: {
        corePrinciples: [
          "Three advanced KPIs keep litigation files compliant and audit-ready."
        ],
        howTo: [
          "[ ] The Zero-Default Policy — never let a discovery or motion deadline pass without a filed response or a written, signed extension from opposing counsel.",
          "[ ] The 14-Day Service Milestone — if the server hasn't served the defendant within 14 days of receiving the packet, run an interactive skip-trace and send the attorney a status update.",
          "[ ] The “Clean” Discovery Check — before handing drafted discovery to the attorney, verify every blank is filled and a signature-ready verification page is attached."
        ],
        bestPractices: [
          "A missed deadline risks sanctions or default.",
          "Pitfall: handing the attorney discovery with blanks."
        ],
        discussionCase: "Which KPI would have prevented the worst litigation mistake you've seen?"
      },
      trainerCue: "Three Advanced KPIs every litigation case manager should live by."
    },
    { h: "Skill Building: The Ultimate Case Management — Jordan Davies",
      skill: { tool: "cmJordan5", cms: true },
      fourPart: {
        corePrinciples: [
          "Case Overview — Client: Jordan Davies · DOA: March 12, 2026 · Case Type: MVA – Personal Injury · Property Damage: Total Loss (towed from the scene) · Status: Pre-Litigation / Active Treatment · Key Issues: Liability Dispute (defendant claims Jordan ran a yellow/red light), Client Refusing Treatment.",
          "Objective: assess critical thinking, client communication, and investigative ability on a file with high medical bills, low coverage, a liability dispute, and a worried client. Review all documents, create the file in the Training Interface (CMS), and complete the required phases."
        ],
        howTo: [
          "Phase 1 — $50,000 in medical bills vs. the at-fault driver's $10,000 BI policy. Review all Declarations Pages; identify the total actual available coverage, checking household addresses and resident-relative rules for hidden UM/UIM coverage that can be stacked.",
          "Phase 2 — Jordan stopped PT because he's terrified of medical debt (a dangerous gap). Roleplay a phone call: validate his fears, explain how a Letter of Protection (medical lien) works, and explain why stopping treatment against the pain-management doctor's orders damages his claim.",
          "Phase 3 — State General Auto issued a 50/50 liability split, claiming Jordan ran a red light. Build an action plan: document in the CRM the evidence to request immediately (police reports, dashcam, witness statements), and identify which carriers to formally place on notice to protect the UM/UIM claims."
        ],
        bestPractices: [
          "Look beyond the obvious policies — resident relatives often hold stackable UM.",
          "Pitfall: accepting the 50/50 split without requesting evidence."
        ],
        discussionCase: "What hidden coverage did you find, and how does it change Jordan's net?"
      },
      trainerCue: "This real-world scenario tests critical thinking, investigative mindset, and client communication. Three phases: finding coverage, addressing treatment gaps, fighting liability denials."
    },
    { h: "Property Damage in Litigation: Types of Damages You Can Recover",
      layout: "THREEBOX",
      boxes: [
        { label: "Economic Compensatory (Special)", desc: "Quantifiable losses — medical bills, lost wages, earning capacity, repairs." },
        { label: "Non-Economic Compensatory (General)", desc: "Pain and suffering, emotional distress, PTSD, loss of consortium." },
        { label: "Punitive (Exemplary)", desc: "Punish egregious, reckless or intentional conduct — e.g., DUI." }
      ],
      fourPart: {
        corePrinciples: [
          "Property damage is a cornerstone of civil litigation. When negligence or an intentional act harms property — real (a house) or personal (a car) — the law provides a mechanism to make the owner “whole” again financially.",
          "The goal is not a windfall, but to restore the plaintiff to the financial position they were in before the incident."
        ],
        howTo: [
          "Economic Compensatory (Special Damages) — e.g., hospital bills for surgery after a crash; lost paychecks from missing two months of work.",
          "Non-Economic Compensatory (General Damages) — e.g., chronic back pain or trauma that prevents enjoying favorite hobbies.",
          "Punitive (Exemplary Damages) — awarded to punish and deter, e.g., the at-fault driver was driving under the influence."
        ],
        bestPractices: [
          "PD is also physical evidence of impact severity for the injury claim.",
          "Pitfall: treating PD as “just the car.”"
        ],
        discussionCase: "Which damage type does property damage evidence support most?"
      },
      trainerCue: "Three primary types of damages you can recover."
    },
    { h: "Property Damage: Calculating the Value of the Claim",
      layout: "COMPARE",
      compareLeft: { label: "The “Lesser Of” Rule", items: ["Courts award the lesser of: the cost to repair, OR the diminution of value (FMV before − value after).", "Car worth $5,000, repairs cost $7,000 → capped at $5,000 (total loss)."] },
      compareRight: { label: "Sentimental or Special Value", items: ["Standard law focuses strictly on Fair Market Value.", "Some jurisdictions allow more for unique value — only if the defendant had notice of it beforehand or acted intentionally."] },
      fourPart: {
        corePrinciples: [
          "One of the most heavily litigated aspects of a property damage case is calculating exactly how much the defendant owes. Courts apply specific formulas."
        ],
        howTo: [
          "Get the repair estimate.",
          "Get the pre-accident fair market value and post-accident/salvage value.",
          "Apply the “Lesser Of” rule.",
          "Assess whether any special-value exception applies (notice or intent)."
        ],
        bestPractices: [
          "Verify CCC One/valuation reports so the client isn't lowballed.",
          "Pitfall: promising emotional-value recovery the law won't award."
        ],
        discussionCase: "FMV $12,000, salvage $2,000, repairs $11,500 — what's the award?"
      },
      trainerCue: "Standard law strictly focuses on market value rather than personal emotional attachment."
    }
  ],
  quickChecks: [
    { afterIndex: 6, q: "An adjuster calls your client directly after suit is filed. You:", opts: ["Let them talk", "Step in, cease the communication, and notify the attorney", "Ignore it", "Schedule a meeting"], a: 1, r: "All communication must go through counsel once suit is filed." },
    { afterIndex: 11, q: "The defense asks, “So you only hurt your neck — correct?” The client should say:", opts: ["“Yes.”", "“These are the primary injuries that come to mind, but my complete medical record details everything I've discussed with my doctors.”", "“I don't know.”", "Nothing"], a: 1, r: "Avoid the “Is That All?” trap." },
    { afterIndex: 27, q: "Discovery is served by mail. In many states the 30-day response period becomes:", opts: ["30 days", "33 days", "21 days", "60 days"], a: 1, r: "The “Mail Box” trap adds 3 days in many states." }
  ],
  quiz: [
    { q: "Case managers spend about what share of litigation time in discovery?", opts: ["10%", "50%", "80%", "100%"], a: 2, r: "Discovery is the heavy lifting." },
    { q: "The most critical deadline in the firm is:", opts: ["The mediation date", "The Statute of Limitations", "The W-9", "Lunch"], a: 1, r: "Miss it and the client loses the right to sue." },
    { q: "Instead of mailing interrogatories to the client you should:", opts: ["Answer them yourself", "Schedule a Discovery Intake Meeting and walk them through it", "Ignore them", "Send them to the adjuster"], a: 1, r: "Then have the client sign the Verification Page." },
    { q: "The 30-Day Client Pulse means:", opts: ["Call every litigation client at least every 30 days", "Settle within 30 days", "File within 30 days", "Bill every 30 days"], a: 0, r: "Clients feel forgotten in slow litigation." },
    { q: "The 2-Second Pause helps because:", opts: ["It looks thoughtful", "It gives time to think, clean audio, and a window to object", "It annoys the defense", "It's required by law"], a: 1, r: "Rule 2 of the 7 Golden Rules." },
    { q: "Which is a good estimate rather than a guess?", opts: ["“He must have been going 90!”", "“I was traveling roughly 35 to 40 miles per hour.”", "“Probably fast.”", "“No idea but maybe 100.”"], a: 1, r: "Never guess or speculate." },
    { q: "If the attorney says “I instruct the witness not to answer,” the client:", opts: ["Answers anyway", "Stays silent and waits for the next question", "Leaves", "Argues"], a: 1, r: "Listen for instructions." },
    { q: "Unanswered Requests for Admission by the deadline are:", opts: ["Ignored", "Automatically treated as ADMITTED", "Extended automatically", "Denied"], a: 1, r: "The Danger Zone." },
    { q: "When counting legal deadlines you:", opts: ["Include the trigger day", "Exclude the trigger day and include the last day", "Count business days only", "Guess"], a: 1, r: "The Federal/State Calculation Rule." },
    { q: "After service, a federal-court defendant must answer within:", opts: ["7 days", "21 days", "60 days", "1 year"], a: 1, r: "State courts are often 20–30 days." },
    { q: "Step 1 of the Evading Defendant Protocol is:", opts: ["Motion for alternative service", "Skip trace", "Vary shifts", "Dismiss"], a: 1, r: "Skip trace → vary shifts → motion for alternative service." },
    { q: "A blanket subpoena for “all records of any kind” will likely trigger:", opts: ["Faster records", "A Motion to Quash", "A settlement", "Nothing"], a: 1, r: "Keep Exhibit A specific." },
    { q: "Which folder holds the executed Affidavit of Service?", opts: ["01_PLEADINGS", "02_SERVICE_DOCS", "05_SUBPOENAS", "04_DISCOVERY_DEFENDANT_TO_PLAINTIFF"], a: 1, r: "Litigation File Architecture." },
    { q: "The 14-Day Service Milestone requires:", opts: ["Filing the complaint", "A skip-trace and attorney status update if not served within 14 days", "A deposition", "Nothing"], a: 1, r: "Advanced KPI." },
    { q: "A car worth $5,000 needs $7,000 of repairs. Under the “Lesser Of” rule the award is capped at:", opts: ["$7,000", "$5,000", "$12,000", "$2,000"], a: 1, r: "It's declared a total loss." },
    { q: "Punitive damages are awarded to:", opts: ["Pay medical bills", "Punish egregious conduct and deter it (e.g., DUI)", "Cover lost wages", "Pay the attorney"], a: 1, r: "Exemplary damages." }
  ],
  discussionQuestion: "Jordan Davies has $50,000 in bills, a $10,000 at-fault BI policy, a 50/50 liability split, and he stopped PT. What are your first three actions today, and which carriers get a notice letter?"
};
