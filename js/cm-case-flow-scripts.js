/* The trainer's scripts: what the trainer says on each Case Flow slide (Presenter view's "Script — read aloud",
   and the day's Trainer Speaker Notes), assembled from build/case-flow/scripts/dN.json by
   build/case-flow/scripts/assemble.cjs. Written to build/case-flow/scripts/SCRIPTSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SCRIPTS = {
 "d1m1-role": {
  "why": {
   "say": "I want to start with a question, and I want you to argue about it a little: whose file is it? Is it the client's? The attorney's? Yours? Go ahead, make your case. Here's where I land. It's the client's case, it's the attorney's judgment, and it's your movement. Every phase of this course runs through one person, and that person is you, the Case Manager. Once you know exactly what the role owns, and exactly where it stops, you can move John Doe's file fast without ever drifting into legal advice. That balance is what we'll practise all week.",
   "ask": "So, whose file is it: the client's, Atty. Thorne's, or yours?"
  },
  "theory": {
   "say": "Let's put a definition on the table. Case Management is the end-to-end coordination of a case, from intake to resolution: tracking it, handling it and moving it, phase by phase. Every task on the file has to pass three tests. Is it moving on time? Is it properly documented and compliant? Is everyone hearing about it clearly? You'll carry the file through six stages, from Intake and Case Opening all the way to Billing, Resolution and Closing. Along the way you build the Case Plan and recommend next steps, but the strategy itself stays with Atty. Thorne. And you're always doing case health analysis, which just means reading the whole file for risk, not one task at a time, so you spot the weak point before it costs the client.",
   "ask": "Which of these have you met before, and where do you think it'll show up on John Doe's file?"
  },
  "frame": {
   "say": "Here's the general process laid out end to end. It starts with intake and case opening: you verify the facts, run the Conflict Check and open the file in the CMS. Then planning, where you draft the Case Plan and recommend next steps while Atty. Thorne sets strategy. Documentation runs the whole way through; you request, name and file every document, because the CMS is the single source of truth. Communication means keeping the client, the carriers and the providers updated, and logging every contact the same day. Monitoring means every deadline is docketed and every risk goes to counsel the day you see it. And at the end, you support billing and the lien records through resolution, then close a complete file.",
   "ask": "Looking at John Doe's file today, which of these stages is he sitting in right now?"
  },
  "rules": {
   "say": "Now the rules, and where your role ends. You own the file's movement: deadlines, documents, carriers, providers, and keeping the client updated. Atty. Thorne owns every legal judgment: value, merits, strategy and settlement authority. A case moves through phases, intake, claim set-up, treatment, pre-demand, demand, settlement and liens, disbursement, and litigation if it forks, and each phase has its own goals and deliverables. Every contact, document, deadline and decision goes in the CMS the same day; if it isn't in the CMS, it didn't happen. If you see a missed deadline, a silent client or a gap in treatment, it goes to Atty. Thorne that day, with the facts and a recommended next step. You can explain the process and confirm facts. You can't tell a client what the case is worth, whether to settle, or what the law means for them.",
   "ask": "A client asks you, “Should I take what they're offering?” What do you say, and what do you do next?"
  },
  "model": {
   "say": "This is the picture I want you to carry all week. Across the slide is the case lifecycle, eight stations left to right: Intake, Claim Set-Up, Treatment, Pre-Demand, Demand, Settlement and Liens, Disbursement, and Litigation, drawn dashed because it's the fork, the road the case only takes if it doesn't settle. Every day of this course sits on one or two of these stations. Above the track, the navy band reads: the Case Manager owns the movement. Below it, the orange band: Atty. Thorne owns every legal judgment. And see that little CMS monitor under the first station? From today, everything you do on John Doe's file happens in the CMS. If it isn't in the CMS, it didn't happen.",
   "ask": "Which station on this track do you think is the easiest place to lose a client's trust?"
  },
  "job": {
   "say": "Here's how this actually runs on the job. A new matter gets assigned to you. Before you call anyone, you read the raw file end to end in the CMS Case File, and you don't pick up the phone until every party, date and carrier is noted. Then, a week in, the client asks you a legal question. You log it in the Communications Log, create a task, and route it to Atty. Thorne the same day, with the facts and no opinion from you. And when a deadline or a risk shows up, you docket it on the Calendar, flag it under Risk Flags in the Case File, and recommend a next step. The test every time is simple: nothing lives only in an email or in your memory."
  }
 },
 "d1m1-case": {
  "why": {
   "say": "I'm not handing you anything yet. First, imagine a brand-new file just landed on your desk. What would you want to know in the first five minutes? Call them out. Who got hurt? When did it happen? Who's insured, and for how much? What could go wrong? Hold onto that list, because every lesson, activity and Learning Check in this course works one single file: John Doe v. Robert Smith. If you know its facts cold, who, when, which policies and what's at risk, every step you take in the CMS is going to make sense. Let's meet the case.",
   "ask": "What's the first thing you'd want to know about a brand-new file in its first five minutes?"
  },
  "theory": {
   "say": "Every file is worked from its verified facts: who was hurt, how, which policies apply, and what could weaken the claim. Four ideas help here. The Case Snapshot puts the parties, the date of loss, the statute of limitations, the client's position and the coverage on one card, and every task reads from it. The Facts of Loss are how, where and when the collision happened, confirmed by the Police Report and witnesses; if there's ambiguity there, that's a conversation for counsel. Then there's the Critical Case Event, the one fact the defense will build on. You name it early so Atty. Thorne can plan around it. And finally the source documents: the intake sheet, the supplement and the Police Report. You quote the document, never your memory.",
   "ask": "Which of these four have you run into before, and how did it go?"
  },
  "frame": {
   "say": "Let's run the structured intake questions on John Doe, and this time you'll answer them from the documents, not from me. Who? John Doe is our client and Robert Smith is the defendant; who else was involved, and where John Doe was sitting, is in the Police Report. What? A collision, and the Run Report says what EMS found. When? 02/06/2026, at about 7:10 in the morning, and the statute of limitations counts from that date. Where? The all-way stop at Maple Hollow Rd and Birch Ave. And how? That's the Police Report again, including any citation. Five questions, and every answer comes from a document.",
   "ask": "Which of these five answers will you check first in the Police Report, and why?"
  },
  "rules": {
   "say": "Here's what I'll tell you, and what I won't. The collision happened on 02/06/2026, around 7:10 a.m., at the all-way stop at Maple Hollow Rd and Birch Ave. Our client is John Doe, 34, a warehouse shift lead at Northgate Distribution. Atty. Elijah Thorne is Lead Counsel; you're the Case Manager. The Recovery Stack is $40,000 across three layers, in a fixed order: BI, Host UM, Relative UM. Say it with me twice. Now, which of those layers can he actually reach? That depends on where he was sitting, and I'm not going to tell you. It's in the Police Report. Same with the gap: compare the EMS date with his first treatment record, and find it yourself.",
   "ask": "Without looking at your notes, what are the three layers of the stack, in order?"
  },
  "model": {
   "say": "This is John Doe's file at a glance, laid out like a folder. Top left, the style of the case, John Doe v. Robert Smith, with matter number LSH-2026-MVA-770412 underneath. On the left, the all-way stop at Maple Hollow Rd and Birch Ave. On the right, three stacked bars for the $40,000: BI $10,000, Host UM $20,000, Relative UM $10,000. Along the bottom, an orange strip from the date of loss to his first treatment, and its length is yours to work out from the records. Notice what the card doesn't say: where he sat, or who was cited. You'll find those in the documents.",
   "ask": "What will you open first to fill in the blanks on this card?"
  },
  "job": {
   "say": "Here's how this plays out for real. The course begins, and your first job is to read the Case File profile and the intake documents until you can state the date of loss, the stack and the critical fact from memory. Then the matter opens in the CMS, and now memory isn't good enough: you check every case fact against its source document in the Case File and Documents, so each fact traces to a document and none of them to what you think you remember. And when a fact changes later, and it will, you update the CMS Case Notes and tell the team the same day. The CMS has to match the file. Always."
  },
  "dodont": {
   "say": "Let's play 3 Clues, 1 Rule for this lesson. Each round hides a Do or a Don't about knowing your case. Three clues come up one at a time; call it the moment you know it, Do or Don't, and name the rule. First-clue answers score three, second two, third one. One thought while you play: a gap in treatment isn't anybody's failing. People work, they wait it out, they hope it gets better. Your job is to document it, not to judge it. And here's the line I'll leave you with: from the next slide on, every fact you use comes from a document in the file, not from this card."
  }
 },
 "d1m1-upl": {
  "why": {
   "say": "Before we touch a single task on John Doe's file, we need one line clear in our heads, because it runs through every day of this course. It's called UPL, the unauthorized practice of law. In plain English, that means giving legal advice when you don't hold a law license. And here's the thing: it rarely happens on purpose. It happens when a worried client asks a kind Case Manager a question, and the Case Manager tries to help. So let's make the line simple enough to hold under pressure. You share facts and explain the process; Atty. Thorne gives every opinion on the case.",
   "ask": "Has a client or a customer ever asked you for an opinion you weren't sure you were allowed to give?"
  },
  "theory": {
   "say": "Four ideas, and they're all practical. Fact sharing is telling John Doe what a record says: a date, an amount, what was sent and when. Process explanation is telling him what happens next, what a form is for, and who decides, but never how it ends. Legal advice is any opinion on what his facts mean for his rights, his money or his choices, and that belongs to Atty. Thorne alone. And the habit that keeps you safe is hear, log, route: you write the question down word for word and send it to Atty. Thorne the same day.",
   "ask": "Which of these four do you think is hardest to hold on to on a busy day?"
  },
  "rules": {
   "say": "Here are the rules in plain words. Legal advice is any opinion on what John Doe's facts mean. You can share facts: dates, documents, what was sent and when. You can explain the process: what happens next, and who decides. You never give an opinion on what the case is worth, on strategy, on whether to settle, or on what a fact like a gap in treatment does to the outcome or the money. When he asks one of those questions, you hear it, log it word for word and route it to Atty. Thorne the same day, and you tell him when to expect an answer. One test before you speak: am I telling him what is, or what it means? The first one is yours.",
   "ask": "If John Doe says, just tell me honestly, is my case any good, what's your exact answer?"
  },
  "model": {
   "say": "Here's the same set of questions, answered both ways. On the left, fact sharing. The Police Report lists the date of loss as 02/06/2026. The next step is a letter to each carrier saying we represent you. That's a question for Atty. Thorne; I've logged it, and he'll call you by Friday. On the right, the versions that cross the line. Your case is probably worth the policy limits. I'd take the offer. The gap will hurt your case. Don't worry, it won't matter. Notice that the kind ones are on the right too. Comfort about the outcome is still an opinion on his case.",
   "ask": "Which answer on the right sounds the most harmless, and why is it still advice?"
  },
  "job": {
   "say": "Here's how it plays out on a normal day. John Doe calls and asks what his case is worth. You tell him that's Atty. Thorne's question, you log his words exactly in Case Notes and open a task, and it's routed before you go home, with no figure given. He asks what happens next, and that one's yours: you explain the next step in plain words, with no prediction of how it ends. And when an adjuster or a provider asks for your view of the case, you decline politely, share only facts the firm has approved, and log the contact in the Communications Log."
  },
  "dodont": {
   "say": "Let's play 3 Clues, 1 Rule. Each round hides a Do or a Don't about the UPL line. Three clues come up one at a time; call it the moment you know it, Do or Don't, and name the rule. First-clue answers score three, second two, third one. As you play, listen for the kind answers. The ones that sound caring are often the ones that cross the line, because comfort about the outcome is still an opinion on the case. The safe kindness is a clear process, and a time frame for Atty. Thorne's answer."
  }
 },
 "d1m1-l1": {
  "why": {
   "say": "Here's a question for you: what's the single most expensive mistake you can make in the first hour of a file? Think about it for a second, and give me your answers. Now let me show you one field, the client's position in the vehicle. Intake is where you establish control, structure and clarity. It's not just data collection. A file opened wrong stays wrong, because every later deadline, every demand and every lien check reads from the fields you set in that first hour. So a mis-mapped party isn't a typo. It's a lost coverage layer.",
   "ask": "What's the single most expensive mistake you could make in the first hour of a new file?"
  },
  "map": {
   "say": "Before we get into the rules, here's where this lesson is going, so nothing surprises you later. Opening a file runs in six steps. First, the Conflict Check, on every party's full legal name, before the file even exists. Second, you verify the facts, starting with the date of loss against the Police Report. Third, you docket the statute of limitations on day one. Fourth, you map every party to a role and record the client's position. Fifth, you record coverage from the Declaration Page, with its source. And sixth, you name and file every document. We'll take them one at a time.",
   "ask": "Which of these six steps do you think gets skipped most often on a busy day?"
  },
  "theory": {
   "say": "Intake means verifying facts and mapping every party to the policy it unlocks, so let's get the vocabulary straight. The Recovery Stack is every policy that can pay the claim, layered in the order it pays, and you find every layer at intake. Bodily Injury Liability is the at-fault driver's coverage for injuries he causes others; it pays first, and it's a third-party claim. UM and UIM coverage is first-party cover for when that BI is missing or too small, and you reach it through the vehicle or the household. And then exclusions and rejections. A signed UM rejection or an owned-vehicle exclusion closes a layer, and when that happens, you record the document that did it.",
   "ask": "Which of these terms is new to you, and which one have you seen trip people up?"
  },
  "theory2": {
   "say": "A few more terms, and these are the ones people mix up. MedPay and PIP are first-party medical coverage paid regardless of fault; they pay bills first, while the claim's still open. Property Damage liability repairs what the at-fault driver damaged, and collision is the owner's own cover, but neither one joins the injury stack. Next, limits. A split limit caps each injured person at the first figure and the whole accident at the second, so you read both numbers. And the Declaration Page is the carrier's own statement of the named insured, the covered vehicles, the coverages and the limits. That's your written proof of coverage, not someone's summary of it.",
   "ask": "On a split limit, which of the two figures caps one injured person's claim?"
  },
  "frame": {
   "say": "This is the intake workflow, five steps. The raw file comes in from On the Records, and you read it end to end before anything else. Then you review and verify the details, the date of loss, the parties and the signatures, against the Police Report, not the intake note. Next, the Conflict Check, run on every party's full legal name, with its date and result logged. Then a decision: complete intake moves to acceptance, incomplete intake goes back, and uncertain eligibility goes to Atty. Thorne. Only then is the file created and logged in the CMS, with six roles mapped, the SOL docketed, and documents named.",
   "ask": "On John Doe's file right now, which of these five steps has actually been completed?"
  },
  "rules": {
   "say": "You're the gatekeeper of case quality, so intake that's incomplete goes back, not forward. Run the Conflict Check before the file exists, on the full legal name of every party: Robert Smith, the host driver, the resident relative. Record its date and result. Confirm the date of loss against the Police Report, because the SOL and every carrier deadline count from it, and docket the SOL on day one: 02/06/2028. Compare the narrative with the Police Report and the client's statement, check every signature, and never fix an inconsistency silently. Map all six roles; an “unknown” party is a layer you haven't found. Record the client's position in the vehicle. Get the emergency contact. Read coverage off the Declaration Page and note every source, and expect the BI carrier to ask for documents first. Name documents to convention. And you never tell the client what the case is worth.",
   "ask": "Why does the Conflict Check have to happen before the file is created, not just soon after?"
  },
  "model": {
   "say": "Look at the contrast on this slide. On the left, a grey, deliberately messy stack labelled raw intake. In the middle, three numbered gates: verify, map, structure. On the right, a clean CMS matter card with six role rows, each with a green tick. Underneath runs a strip with the case's four continuity anchors. Here's why it matters. A client driving his own car may reach only his own policy; a passenger in someone else's car can reach that car's coverage too, and sometimes a relative's. Same crash, same injuries, and the recovery can be four times larger, decided by one field. Which is John Doe? Read the Police Report and record it yourself.",
   "ask": "What would have happened to John Doe's recovery if someone had left his position as “driver”?"
  },
  "job": {
   "say": "Let's follow it through a real day. The raw file arrives from On the Records. Before the file even exists, you run and document the Conflict Check in CMS New Case, then verify the date of loss, parties and signatures against the source documents, so the date matches the Police Report. Once the matter's created, you docket the SOL on the Calendar and log the retainer and the claim-specific HIPAA authorization in Documents; 02/06/2028 is on the calendar and both signatures are logged. As parties are identified, you map all six roles in Parties and record his position exactly as the Police Report shows it, nobody left “unknown”. And as documents arrive, you name each to the firm's convention and file it, so anyone can find it by name."
  },
  "dodont": {
   "say": "Round time: 3 Clues, 1 Rule. Each round hides one of this lesson's Dos or Don'ts about intake. Clues appear one by one; call Do or Don't and name the rule as soon as you can. Three points on the first clue, two on the second, one on the third. While you play, remember that files from On the Records arrive unverified. If you treat the intake note as fact, you carry its errors straight into the demand. And here's the UPL line, which comes back every single day of this program: you confirm facts and explain the process; you never tell a client what the case is worth or whether they have a claim."
  }
 },
 "d1m1-open": {
  "case": {
   "say": "It's 02/09/2026, and an email just came in from On the Records: a new matter, John Doe, front-seat passenger, collision on 02/06/2026 at Maple Hollow Rd and Birch Ave. Attached you've got the New Client Intake Sheet, the intake supplement, the retainer and the claim-specific HIPAA authorization he signed this morning, and the Riverton PD crash report. A colleague has already keyed a draft intake record into the CMS, and Atty. Thorne wants the matter active today. So it's on you to open this case. Open the CMS from the Practice Lab slide now, start John Doe's matter from New Case, and run the Conflict Check before anything else. Then work through the draft against the documents and get the matter opened properly. You have ten minutes, and I'll hold my questions until you're done.",
   "ask": "Is John Doe's case open in the CMS now, and where didn't the draft match the documents?"
  },
  "task": {
   "say": "Here's your job. With the CMS open from the Practice Lab, start John Doe's matter in New Case, and before anything else, run and document the Conflict Check on every party's full legal name. Then go through the draft intake record field by field against the source documents: the date of loss, the names and roles, John Doe's position, his date of birth, the report number. Correct each error with its source, never silently. Docket the SOL, 02/06/2028, with reminders on the Calendar, map all six roles in Parties, log the retainer and the HIPAA authorization, and file every intake document under its category, named to the firm's convention. Then route a short note in Case Notes telling Atty. Thorne what you corrected.",
   "ask": "If you change the position field, which documents prove you're right?"
  },
  "check": {
   "say": "Before you log it, check yourself. Was the Conflict Check documented before the matter existed, on full legal names? Is the date of loss, 02/06/2026, confirmed against the Police Report, and the SOL, 02/06/2028, docketed with reminders? John Doe should be the front-seat passenger, not the driver, even though “Driver” was pre-filled. Did you catch the position and the date of birth in the draft, and the transposed report number on the intake sheet, each corrected with its source? Remember, an unexplained change is a new error. All six roles mapped, the retainer and HIPAA authorization logged with their signing date, 02/09/2026, and documents named before filing. And open your Case Notes: the note to Atty. Thorne is part of the work, not an extra.",
   "ask": "Where in your Case Notes would Atty. Thorne see why the date of birth changed?"
  }
 },
 "d1m1-kc": {
  "questions": {
   "say": "Here's your Learning Check on today's foundations. Answer from John Doe's file, in your own words, typed under each question. First, name the six stages of John Doe's file in order, and tell me what the Case Manager owns at Intake and Case Opening that nobody else will. Second, John Doe asks you two things on one call: what his case is worth, and whether waiting to see a doctor hurt it. Word for word, what do you tell him on each, who answers them if you don't, and what do you record and route? Third, and this is the one I care most about, you're opening his matter in the CMS: what has to happen before the matter is created, on whose names, and why does the order matter?"
  },
  "summary": {
   "say": "Now your Self-Summary: write the principles in your own words, not the clicks. Then think through this scenario. Robert Smith's carrier has already called John Doe, and he needs a car to get to work. What do you tell him today, in what order, and what has to be on the file before tomorrow's claim set-up? Be honest with yourself here. The right answer puts things on the record and sends anything about value or fault to Atty. Thorne.",
   "ask": "What's the first thing you'd tell John when he mentions the carrier's call?"
  },
  "scale": {
   "say": "Finally, the Skill Scale. Rate yourself 1 to 5 on each competency, then submit for review. I'll put your self-rating beside your score, and where there's a wide gap, we'll have a conversation. A 5 on something you scored 60 on is worth talking about, and so is a 2 on something you aced. One more thing: UPL is a gate. A strong score doesn't survive an ethics breach.",
   "ask": "Where do you honestly think you sit, 1 to 5, on opening a matter correctly in the CMS?"
  }
 },
 "d1m2-l1": {
  "why": {
   "say": "Before we touch a single step, I want you to know what this protocol is for, because it isn't about chasing a client. The No Contact Protocol does three jobs at once. It tracks unresponsiveness formally, it establishes due diligence before anyone ever talks about withdrawal, and it protects the firm from liability. A client who can't be reached is still a file with deadlines running on it. The protocol is the proof that the firm did its part. If you see it as just ringing someone until they pick up, you'll miss why the record matters, and the record is the whole point.",
   "ask": "If John Doe went quiet tomorrow, who gets hurt if nobody can prove what the firm did to reach him?"
  },
  "map": {
   "say": "Here's the protocol from start to finish before we go through it. Step one is an internal review: the case status, the live deadlines, the date of last contact and the channels already used. Step two is the contact attempts, escalating by channel: two calls, then email and text, then the emergency contact, then certified mail. Alongside it, you log every attempt in the CMS: date, time, channel and outcome. And step three is team notification: you escalate to Atty. Thorne and spell out what the silence puts at risk, like the statute of limitations.",
   "ask": "Why do you think the protocol escalates by channel rather than by the number of calls?"
  },
  "theory": {
   "say": "A few terms first. An intake bottleneck is any point where the work slows, stalls or gets inconsistent, and a silent client is one of them, because the case stops progressing. Due diligence is the proof that the firm made reasonable, documented efforts to reach the client, and it's the record that justifies whatever happens next. Approved channels are the contact methods the client and the firm agreed on at intake; only those count as a valid attempt. And the emergency contact is that second person you collected at intake who can still reach the client after they go quiet. On John Doe's file, that's Margaret Doe, his mother.",
   "ask": "Which of these terms have you met before, and where would you find it on John Doe's file?"
  },
  "rules": {
   "say": "Step 1 is internal review, and it's the step everyone skips because they want to start dialling. Before you call anyone, check the case status, the live deadlines and the date of last contact, and confirm every earlier attempt used an approved channel. Step 2 is contact attempts, escalating: at least two phone attempts, then email and text, then the emergency contact, then certified mail or a formal letter. You escalate by channel, not by volume. Two voicemails on one number clears the phone rung and nothing more. I'll say it twice, because it matters: two voicemails, one rung. Set a follow-up reminder when a request goes out and log every attempt with date, time, channel and outcome. Step 3 is team notification and deadline impact; deadlines don't pause for silence. You can tell the client what we need and by when. You can't tell them representation will end.",
   "ask": "What deadline is running on John Doe's file right now, before you pick up the phone?"
  },
  "job": {
   "say": "Let me tell you how this actually plays out. John Doe misses a scheduled contact or an appointment. That's your trigger. You open the Case Summary in the CMS and do Step 1: status, deadlines, last contact date, and you know the live deadlines before any outreach begins. Once that's done, you work the channel ladder in the Communications Log, two or more phone attempts, then email and text, each one logged with date, time, channel and outcome. When the ladder's exhausted, that's Step 3. You notify Atty. Thorne through Tasks, Escalate, and you assess the impact on the file, so the escalation's documented and the SOL of 02/06/2028, plus any hearing dates, are on the record.",
   "ask": "What would Atty. Thorne need to see in that escalation before he could act on it?"
  }
 },
 "d1m2-a1": {
  "case": {
   "say": "Here's what just landed on the file, dated 02/16/2026. It's file LSH-2026-MVA-770412, and there's been no client contact with John Doe for six days. His last logged contact was 02/10/2026. He missed his check-in call scheduled for 02/13/2026. The phone system shows two calls to his mobile, both ending in voicemail, and neither one is in the Communications Log. No treatment start is recorded. His emergency contact on file is Margaret Doe, at (555) 010-2291, and Step 1 of the No Contact Protocol is due today. Before we go on, would someone read the red bad entry aloud for us? \"Called client, no answer.\" Be honest, that's what most of us would have written.",
   "ask": "What's missing from \"called client, no answer\" that a supervisor would need six months from now?"
  },
  "task": {
   "say": "Your job is to run the No Contact Protocol on John Doe's file. Start with the Step 1 internal review in the CMS Case Summary and name the deadlines that are live right now. Don't start dialling first. Then reconstruct the attempts already made and carry the Step 2 ladder forward in the Communications Log, logging every attempt with date, time, channel and outcome, plus the next action and its due date. Part of this is a live call with Margaret Doe. Identify yourself, confirm she's the emergency contact on file, ask her to have John call the firm by a set date, and confirm his best number and current address, without disclosing any case details. What you hand in is a completed Step 1 review, an unbroken Step 2 log, and your call on whether Step 3 is warranted and what impact you'd report.",
   "ask": "Before you log anything, what deadline is running on this file right now?"
  },
  "check": {
   "say": "Before you log your work, check it against these points. Did you do Step 1 first, with the status, live deadlines and last contact reviewed? Are the earlier voicemails logged with date, time and channel? Is the phone rung cleared with at least two attempts, and are email and text both tried, rather than more calls? Did you use the emergency contact? That's the rung people forget most, and we collected it at intake for exactly this. Every entry needs date, time, channel and outcome, and the next action needs a due date. Your Step 3 impact should name the SOL of 02/06/2028 and the treatment that hasn't started. That silence is what becomes the 14-Day Gap later. And nothing threatens withdrawal. Write each entry as if a supervisor will audit it six months from now.",
   "ask": "If you called his mobile three times, how many channels have you actually used?"
  }
 },
 "d1m2-l2": {
  "why": {
   "say": "The Final Warning Letter is the last low-cost step before the firm has to choose between two expensive things: spending money to find somebody, or moving to withdraw. So this letter has two jobs. It has to be specific enough that the client actually answers it, and documented enough to justify whichever of those next steps comes. And I'm going to hold you on one idea all lesson: the search waits until three things are true at the same time, not just the first one. People trigger it early all the time, and that spends the firm's money and weakens the record.",
   "ask": "What's the risk of spending the firm's money on a search before the letter's deadline has even passed?"
  },
  "theory": {
   "say": "This letter closes out the outreach record. It's one last documented notice before the firm searches for the client or counsel moves to withdraw. It goes by dual delivery. Certified mail proves it was delivered, email is what actually gets a response, and each one covers the other's gap. Then there's the three-criteria gate, and I want you to hear the word gate. It's an AND gate, not a checklist, so the search waits until all three are true. The search itself is a skip-trace, a paid search for someone's current address and contacts, and because it spends firm money, counsel authorizes it. And withdrawal, ending representation by notice or motion, is decided only by the attorney, under firm and court rules.",
   "ask": "Which of these have you met before, and where would it show up on John Doe's file?"
  },
  "rules": {
   "say": "Step 4 goes by certified mail and email. Both, not either. The letter states the earlier attempts, gives a response deadline of 7 to 14 days and gives notice of potential withdrawal. And you confirm the address first, because a letter sent to a stale address proves nothing. At Step 5, if the client's still silent, the attorney may file a Notice of Withdrawal or a Motion to Withdraw, and that's counsel's call. Step 6 marks the file closed per protocol and keeps every proof. Skip-tracing starts only when the ladder's exhausted, the letter's gone and its deadline has passed, and counsel authorizes it with the full log attached. Meanwhile records, coverage and deadlines keep moving. The letter can state requirements and say withdrawal is possible. It can't judge the claim, advise on rights, or announce that representation's ending.",
   "ask": "Why do we need both certified mail and email, when either one would technically get the letter there?"
  },
  "job": {
   "say": "Here's the story on the job. You've made your Step 3 escalation and there's still no response. That's when you draft the Final Warning Letter in the Action Plan Editor from the warning letter template, with the earlier attempts itemized and the deadline and withdrawal notice in place. Once it's ready, you confirm the current address and send it from CMS Documents, Outgoing, by certified mail and email, both channels logged and the certified receipt kept. Then the response deadline expires. Now you check that all three criteria are evidenced in the log, and only then do you escalate to Atty. Thorne through Tasks, asking for skip-trace authority and the Step 5 decision.",
   "ask": "What's the first thing you'd check in the log before you escalate to Atty. Thorne?"
  }
 },
 "d1m2-a2": {
  "case": {
   "say": "This note from Atty. Thorne just landed on the file, dated 02/21/2026. He's read your Step 3 note. It's been eleven days with no word from John, and no treatment that we know of. The phone rung is cleared, emails and texts have gone out, Margaret Doe has been tried, and it's all logged. He wants the Final Warning Letter drafted for his review Monday morning: every attempt with its date, a response date, and how to reach us, by certified mail and email. Withdrawal is possible, not decided, and the letter says nothing about John's claim. Here's the hard part. You need a letter that's urgent but not threatening, and most first drafts miss one way or the other.",
   "ask": "What's one sentence that would make this letter sound threatening rather than urgent?"
  },
  "task": {
   "say": "You'll draft the Step 4 Final Warning Letter to John Doe in the Action Plan Editor, using the warning letter template. Itemize the earlier attempts, and by itemize I mean list each one with its date. Set a response deadline inside the 7 to 14 day window, give notice of potential withdrawal, and tell him exactly how to respond. Every sentence stays inside the UPL boundary, so nothing on the strength of his claim, nothing on what silence does legally, and nothing announcing withdrawal as decided. Then record what has to be true before skip-tracing can start, and whose authority Step 5 needs. What you hand in is a send-ready letter with both deliveries logged and the escalation recorded.",
   "ask": "Whose authority does the Step 5 decision need, and where will you record that?"
  },
  "check": {
   "say": "Before you submit, swap drafts with the person next to you and mark each other's. And first, let's read the banned and compliant pairs aloud together; it'll save you a full rewrite. Look for the firm's identification and the file reference, and the date of loss as 02/06/2026. The earlier attempts should be itemized with dates. The deadline should be an actual date inside the 7 to 14 day window, not \"as soon as possible.\" Withdrawal should read as possible, not decided, and there should be at least two ways to respond. Certified mail and email are both recorded, with the address confirmed before sending. There's nothing about claim value or legal consequence, so no \"you will lose your case.\" The skip-trace criteria are recorded, and Step 5 is noted as Atty. Thorne's.",
   "ask": "Does your partner's letter tell John what's needed and by when, without telling him what happens to his case?"
  }
 },
 "d1m2-kc": {
  "questions": {
   "say": "This is your Knowledge Check. Your answers come from this file, in your own words, typed under each question. You'll set out all six steps of the No Contact Protocol in order, with what's required at each one. You'll state the protocol's three purposes and say which one protects the firm rather than the client. A word on that second question: it's easy to answer shallowly. Protection from liability is the purpose people leave out, and it's exactly why the record gets built the way it does. Then there's a colleague who logged three voicemails on three days and called the ladder exhausted. Tell me what's wrong and what the log should show.",
   "ask": "Which of the three purposes do you think is the easiest one to forget?"
  },
  "summary": {
   "say": "Now your Self-Summary, where you put the principles in your own words. Here's the scenario. It's 04/08/2026. Riverton Spine & Rehab reports John Doe has missed two visits. Keystone ended Margaret's rental on 03/19, his carpool ended 04/01, and Dana Whitfield has asked John for a Recorded Statement. Tell me what you do first, second and third, and what each step protects. This one pulls it all together: the running SOL, a Treatment Gap that's hardening, and the claims work that has to keep moving anyway. Keep in mind, too, that the gap you're watching build here is the same 14 days defense counsel will ask John Doe about at his deposition on Day 5.",
   "ask": "Of those three problems, which one protects the most if you deal with it first?"
  },
  "scale": {
   "say": "Last step is your Skill Scale. Rate yourself honestly, one to five, on each competency, then submit it for review. One to five isn't a grade. It's a picture of where you actually are today. When I get these back, I'll compare your self-rating with your Knowledge Check score, and wherever there's a wide gap, either way, you and I will have a short conversation about it. Overrating and underrating both tell me something useful.",
   "ask": "Which competency here are you least sure how to rate, and why?"
  }
 },
 "d1m3-l1": {
  "why": {
   "say": "Here's something that surprises people: most of the self-inflicted damage to an injury claim happens in the first two weeks, before anyone has told the client what not to do. A casual Recorded Statement to the other side's carrier. A missed appointment nobody hears about. One post on social media. Every one of those becomes part of the record. So this lesson is about the instructions that protect the claim from the client's own good intentions. You give the instructions; what any of it means for the claim is Atty. Thorne's to explain. We'll work it as call-and-response: I read you a don't, you give me the do.",
   "ask": "What's one thing a new client might do in week one, meaning well, that could hurt the claim?"
  },
  "map": {
   "say": "Here's the road for this lesson before we walk it. It starts with the standing instructions you give John Doe: no Recorded Statement to the other side, no posts, and nothing signed until we've reviewed it. Then treatment: he keeps every appointment and tells you about any barrier before a visit is missed. Then receipts, because only what's documented can be claimed. Then the Property Damage carve-out, the one topic the adverse carrier may discuss with him. And last, the rental: who authorizes it, the daily cap and how long it runs. Five stops, in order.",
   "ask": "Which of these five do you think a client is most likely to forget?"
  },
  "theory": {
   "say": "Client instructions protect the claim from the client's good intentions, because what a client says, posts, signs or skips can become evidence. First, the difference between a medical danger and a legal danger. A medical danger threatens their health; a legal danger, like a gap in care, threatens the claim. Second, a clean, discoverable file: everything on it can reach defense counsel, so your instructions stay factual and never become legal opinion. Third, the Letter of Representation tells the world the firm represents the client, and from then on adverse contact routes through us. And fourth, on rentals, the rate cap and duration: the authorized daily rate and number of days. Beyond them, it's the client's own cost.",
   "ask": "Can someone give me an example of a legal danger that isn't a medical one?"
  },
  "frame": {
   "say": "Before any client picks up a rental car, you run four checks. First, whose policy is primary? It's usually the renter's own policy, and the rental company only steps in after a written denial. Second, who authorizes the rental? Confirm that, and check whether there's a rental reimbursement endorsement on the policy. Third, the daily rate cap: record the authorized rate before the client collects a vehicle. And fourth, the duration limit, the number of covered days. Days outside that come out of the client's pocket, and if nobody told them, they'll blame the firm.",
   "ask": "Which of these four checks do you think clients most often get burned on?"
  },
  "rules": {
   "say": "These are the firm's standing instructions. The client gives no Recorded Statement to the adverse carrier; all adverse contact goes through us. They start treatment, keep every appointment, and tell you about any barrier, like transport, cost or work, before a visit is missed. You explain the process, not the stakes. They post nothing about the collision, the injuries or their activities, and sign no release or settlement paper until we've reviewed it. They keep every receipt, including mileage to appointments and household help, and report any change of address, phone or provider at once. Property Damage is the one carve-out; the adverse carrier may discuss only that, and if the call drifts into injuries or the facts of the loss, it stops. On rentals, confirm authorization, rate cap and duration first. You give the instruction; what conduct does to claim value is Atty. Thorne's to answer.",
   "ask": "If John Doe asks why he shouldn't give a Recorded Statement, what can you say without giving legal advice?"
  },
  "model": {
   "say": "Here's the board: green Do column on the left, red Don't column on the right, and each Don't sits on the same line as the Do that replaces it. Let's run it the way I promised. I'll read the Don't, you give me the Do. Ready? Don't give the other driver's carrier a Recorded Statement. Good. Don't post about the crash. Right. Down at the bottom is the rental flow, four chips in a row: whose policy is primary, who authorizes, the daily rate cap, the duration limit. And under the last two, an orange tag that says it plainly: uncovered days are the client's cost.",
   "ask": "Here's a Don't: signing a carrier's medical authorization form. What's the Do that replaces it?"
  },
  "job": {
   "say": "Let me tell you how this looks in practice. The retainer's signed, so you deliver the standing instructions and log the delivery in CMS Onboarding, with the date and the method. A few days later the client calls about a rental. Before he collects anything, you confirm the primary policy, who authorizes it, the rate cap and the duration, and you record all of it in the Property Damage section. Then the adverse carrier calls him directly. You tell him to route it to the firm, you log the contact in the Communications Log, and the checkpoint is simple: no Recorded Statement, and the contact's on the record."
  },
  "dodont": {
   "say": "Let's play 3 Clues, 1 Rule on client instructions. Behind each round is a Do or Don't from this lesson. Three clues, revealed one at a time; when you think you've got it, call Do or Don't and tell me the rule. Three points for the first clue, two for the second, one for the third. A couple of things to keep in mind. Rental is where clients get hurt financially, because uncovered days come out of their pocket. And watch yourself on the Recorded Statement. The moment you start explaining why it hurts the claim, you've slid into legal advice. The instruction is the deliverable."
  }
 },
 "d1m3-a1": {
  "case": {
   "say": "John Doe's retainer is signed and his matter is open in the CMS. Nothing has gone out to him yet. And a voicemail just landed on the file, dated 02/10/2026. Before we talk about it, play it, and take notes the way you would at your own desk: who called, what happened, what he needs, which number to call back. Then check your notes against the message before you act. One detail in there changes what this packet has to do, so listen for it.",
   "ask": "From the voicemail alone, what has already happened on this file that the packet now has to deal with?"
  },
  "task": {
   "say": "Now you'll assemble John Doe's onboarding Direction Packet in CMS Onboarding, under Direction Packet. Build all six sections and populate each with the firm's standing instructions, and make the Property Damage section specific to this file. Then, because the adverse carrier has already called him, tell me which instruction is now most urgent and how you'll confirm he understood it. You'll also take a live call from John Doe. Route all Keystone contact to the firm, no Recorded Statement, have him repeat the instruction back, give him the treatment direction, since he hasn't started, and confirm the Property Damage details and how he'll get the packet. Then log delivery. What you hand in is a complete, delivered, logged packet.",
   "ask": "Read your treatment direction out loud. Would it make John Doe book an appointment today?"
  },
  "check": {
   "say": "Let's check the packet before you log it. All six sections should be there and populated, with every standing instruction showing up in the Do's and Don'ts. Is the treatment direction stated with real urgency, given that treatment hasn't begun? Does the Property Damage section name the rental parameters you need to confirm? Your communication protocol should route all adverse carrier contact to the firm, and the contacts list should show Atty. Elijah Thorne as Lead Counsel. Delivery logged, with date and method. And did you name the adverse-contact instruction as the urgent one, with a real confirmation step? Sending isn't confirming. Now I'll play John Doe, confused, in pain, already called by the other side, and receive one of your packets.",
   "ask": "How will you actually know John Doe read the packet, not just received it?"
  }
 },
 "d1m3-l2": {
  "why": {
   "say": "Property Damage settles long before the injury claim does, so it's the client's first real test of whether this firm knows what it's doing. And it's more than the car: the damage is physical evidence of how hard the impact was, so you audit it as carefully as you'd audit the medicals. One misconception I'll correct every time I hear it: actual cash value is not the loan balance. If anyone says those are the same thing, I'm going to stop you, kindly, right there.",
   "ask": "Has anyone here had a car totalled? Did the payout match what you still owed on it?"
  },
  "map": {
   "say": "Property Damage has its own road, and here it is before we walk it. First, the written Repair Estimate, because without it you have no position. Second, the inspection window, five days from the letter, with the date it opens recorded. Third, you audit the estimate against the body shop bill and check the photos. Fourth, repair or Total Loss, measured against actual cash value and confirmed in writing. Fifth, Loss of Use for each day without a vehicle. And sixth, any dispute gets documented and escalated, never argued on the fly with an adjuster."
  },
  "theory": {
   "say": "Property Damage is a separate claim with its own measure: repair it, or total it, set against the vehicle's pre-loss value. Four ideas. The scene audit checks that the photos, video and damage match how the crash happened; the physics has to be possible. A supplemental estimate is written after teardown finds hidden damage, and it's proof of impact severity for the injury claim too. The Total Loss threshold is the repair-to-ACV percentage where the carrier stops repairing and pays the value instead. And the Valuation Report is the carrier's market-based report that sets ACV. You verify it line by line, so the client isn't lowballed.",
   "ask": "Why would a supplemental estimate matter to the injury claim, not just the repair?"
  },
  "frame": {
   "say": "This is the Property Damage deep dive, four things to look at. Photos first: you want point-of-impact clarity, including the undercarriage and the frame, because that's physical proof of the impact behind the injury claim. Then estimates versus actuals: put the insurance estimate next to the final body shop bill, because supplementals prove hidden structural damage. Then Total Loss and value: go through the CCC One or other Valuation Report line by line, so the client isn't lowballed on what the car was worth. And the scene audit: photos, video and damage, checked against how the crash happened. The physics of the claim has to be possible.",
   "ask": "If the final body shop bill comes in well above the first estimate, what does that tell you?"
  },
  "rules": {
   "say": "No written Repair Estimate, no position: get it before discussing any outcome. Give the carrier a defined window to inspect, the firm's standard being 5 days from the letter, and record when it opens. Compare the estimate with the final bill, and audit the photos for a clear point of impact. A Total Loss is when repair cost reaches the carrier's threshold against actual cash value; confirm the basis in writing. ACV is pre-loss market value, not the loan and not a new car, so verify the Valuation Report. Courts use the lesser of repair cost or the drop in market value. Storage and towing accrue daily. Loss of Use is claimed separately for each day without a vehicle, measured by a comparable rental; in Nevada, for example, Dugan v. Gotsopoulos, 117 Nev. 285 (2001). Confirm the rule, escalate disputes, and never advise accepting a valuation.",
   "ask": "Once a car is towed and stored, who is paying for every day it sits there?"
  },
  "model": {
   "say": "This gauge is the decision in one picture. A long bar runs from pale on the left through orange to navy, with a bold threshold marker about three-quarters along. Left of it is repair, where the carrier pays to fix the car. Right of it is Total Loss, where the carrier pays ACV. The repair-estimate chip and the ACV chip sit above the bar so you can see the comparison. Underneath, three steps: compare the estimate with the final bill, compare against ACV, and confirm the carrier's basis in writing. And bottom right, what's owed either way: storage, towing and Loss of Use.",
   "ask": "If the car lands just right of that threshold, what's the client actually owed, and by whom?"
  },
  "job": {
   "say": "Picture the Property Damage section filling in over a couple of weeks. The Repair Estimate arrives, and you log it, then compare it with ACV and, later, with the final bill; the estimate's on file and the comparison's recorded. Then the carrier states a disposition, repair or total. You don't assume anything: you confirm the threshold basis and the Valuation Report in writing, under correspondence. And meanwhile, the client has no vehicle. So you record the dates and open the loss-of-use claim, and you claim it separately from the repair or the ACV payment."
  },
  "dodont": {
   "say": "Here's our 3 Clues, 1 Rule round for Property Damage. Each round hides one Do or one Don't; I reveal clues one at a time, and you call Do or Don't and name the rule. First-clue calls earn three points, then two, then one. While you play, think about Loss of Use. It's the most often forgotten item, and on this file it really matters, because John Doe needs to get to treatment he hasn't started yet, and he has no car. On Day 5 we'll come back to all this with Diminished Value and the Property Damage dispute lab. Today is the threshold. Day 5 is the fight."
  }
 },
 "d1m3-a2": {
  "case": {
   "say": "It's 02/11/2026, and a CMS notice just came in on LSH-2026-MVA-770412. John Doe's Direction Packet was delivered and logged on 02/10/2026, and its directions have been staged as draft task cards for you to review before activation. A card can't activate without an owner, a due date and a verification method. Now, look at what's missing: no treatment start is recorded, and no follow-up is on the calendar. Those directions need to become obligations somebody tracks, not a document he was sent once. Read every card carefully. I won't tell you more than that.",
   "ask": "Before you open the cards, what's the risk of a direction that nobody owns?"
  },
  "task": {
   "say": "Your task is to turn John Doe's onboarding directions into tracked tasks in CMS Tasks. For every one, set the owner, the due date, and how it'll be verified. One of the staged cards has the wrong owner. Find it, reassign it, and record why it could never have been the client's task in the first place. Then schedule the follow-up that confirms he's actually started treatment. What you hand in is a task set with the right owners, real dates and a verification method on each. And for every single card, ask yourself how you'll know it happened. A task with no verification is a hope, not a task.",
   "ask": "For the treatment card, how will you know it actually happened?"
  },
  "check": {
   "say": "Quick self-check before you log it. Every direction has an owner, every task has a due date, and every task has a verification method recorded. Did you find the mis-assigned card, reassign it to the firm, and write down why? Is the treatment-start follow-up scheduled, with nothing left undated? Here's why that last one matters so much. The treatment follow-up is the hinge into Day 2. John Doe's gap becomes undeniable there, and this is the task that would have caught it. Use your tracker so a gap in care is visible the day it starts, and don't stop at tracking; confirm the work was done correctly.",
   "ask": "If his first appointment slipped, which of your tasks would tell you, and on what date?"
  }
 },
 "d1m3-a3": {
  "case": {
   "say": "It's 02/11/2026. Leah Moran at Keystone PD has emailed the firm to confirm the claimant on the 2019 Honda Civic, so a rental can be set up once liability is decided, and ten minutes later John Doe calls. He needs a car for his first appointment, and he wants to know if that rental is his. It's a fair question, and the answer isn't in your memory or in his. It's in the file. Before anyone tells him yes or no, somebody has to work out whose car the Civic is and whose claim the rental belongs to.",
   "ask": "Which document would you open first to answer him, and why that one?"
  },
  "task": {
   "say": "Your task is an investigation. Use the Police Report, the Intake Sheet, the Intake Supplement and the CMS Intake Record. Establish where John Doe was in the collision, who owns the Civic, and who the claimant on the Civic is. Write it as a CMS Case Note that cites each document, decide whether John Doe has a Property Damage or rental claim of his own, and report it to Atty. Thorne the same day. Then take his call. Give him the fact, route the claim question to the attorney, and fix what he actually needs, which is a ride to treatment.",
   "ask": "What will you say when he asks you to just book the rental in his name?"
  },
  "check": {
   "say": "Check your work before you log it. Did you take his position, the owner and the claimant each from a named record, with the page? Did you write down the conclusion about his own claim in plain words? Did Atty. Thorne hear it today? And on the call, did you stay on facts and logistics, with nothing said about the claim's value, and did his ride to treatment get solved or escalated with a date?",
   "ask": "If the owner calls next, what's yours to do and what isn't?"
  }
 },
 "d1m3-kc": {
  "questions": {
   "say": "This is your Learning Check for Property Damage and onboarding. Every answer comes from John Doe's file, in your own words, typed right under each question. First, the firm's standing instructions for a new injury client and the specific harm each one prevents. Second, what has to be confirmed before John Doe collects a rental, whose policy is usually primary, and what happens to days outside the authorization. Third, what actual cash value means, what it doesn't mean, and why confusing it with something else misleads the client. Take your time on that one; I want understanding, not a memorised definition."
  },
  "summary": {
   "say": "Now the Self-Summary: the principles, in your own words, not mine. And there's one scenario to think through. Robert Smith's carrier has already called John Doe, and he needs a car to get to work. What do you tell him today, in what order, and what has to be on the file before tomorrow's claim set-up? Think hard about the order. When everything feels urgent, your job is to decide what actually protects John Doe first, and to be able to say why.",
   "ask": "If you could only do one of those three actions today, which would it be?"
  },
  "scale": {
   "say": "Last step: the Skill Scale. Rate yourself 1 to 5 on each competency, honestly, then submit for review. There's no prize for a high number. Once your scores are in, I'll put your self-rating next to your score, and if there's a wide gap either way, we'll talk it through together. Overconfidence and underconfidence both tell me something useful about where you need support next.",
   "ask": "Which competency do you expect your self-rating and your score to disagree on?"
  }
 },
 "d1m4-l1": {
  "why": {
   "say": "Think of the Case Plan as the file's operating instruction. It's what Atty. Thorne reads to set strategy, and it's what every later day of this course executes against. So if the plan hides a risk, the strategy gets built on a false picture, and nobody finds out until it's expensive. When you see the plan's layout in a minute, notice that the risks band is drawn taller than everything else and in red. That's deliberate. On a Case Plan, the risks get more room than the comfort.",
   "ask": "What happens if Atty. Thorne builds a demand strategy without knowing about the 14-day gap?"
  },
  "theory": {
   "say": "Early evaluation brings three things together: is there money, who's responsible, and how is this case likely to move. Coverage determination asks which policies apply, with what benefits, limits and exclusions; in plain words, is there money to pay the claim? Liability assessment asks who caused the incident and to what degree, clear, shared or disputed, and on what evidence. Case projection is an early read of risk and trajectory, built from coverage, liability, injury, treatment and documents, but the value stays with counsel. And one more idea: in a legal framework, Case Management shifts from best efforts to strict compliance. Every deadline in the plan gets docketed.",
   "ask": "Why do you think a projection can't come before coverage and liability are understood?"
  },
  "frame": {
   "say": "These three pillars only make sense together. Coverage asks, is there money to pay the claim? That's valid policies, coverage type, limits, exclusions and gaps. Liability asks, who's responsible, and to what degree? That means who caused it, whether it's clear, shared or disputed, the evidence behind it, and any comparative negligence. And projection asks, how is this case likely to move? That draws on everything: coverage, liability, how severe the injury is, what treatment to expect, and how good the documentation is. You can see why projection sits last. It leans on the other two.",
   "ask": "On John Doe's file today, which of these three questions can you actually answer with documents?"
  },
  "rules": {
   "say": "Acceptance comes first. After the verification call, you decide: Accepted, Escalated for review, or Declined, with a reason someone else can follow. At that point you stop gathering and make the call; if eligibility is uncertain, clarify with the client, then escalate with a short summary of exactly what's ambiguous. No limbo. State coverage, liability and projection together, and keep the projection preliminary until coverage is confirmed. Liability isn't final until the Police Report, driver statements and any video confirm it, so never tell a client it's a sure thing. Hold a place for the Regulatory Triple-Check, cleared in the Treatment Phase, and file the Three-Pillar plan within the state's window, often 30 to 60 days, and docket it. Clinical, Functional, Financial: measurable goals, an owner and a date on every item. Flag adverse facts prominently. The plan proposes operational steps; legal conclusions, value and settlement posture are Atty. Thorne's.",
   "ask": "Is “request the MRI” something you can write in the plan? What about “worth policy limits”?"
  },
  "model": {
   "say": "Here's the plan's architecture: five bands stacked top to bottom, each with an orange number. One, the Case Snapshot and acceptance. Two, coverage, liability and projection. Three, the Regulatory Triple-Check, held open until the Treatment Phase. Four, the Three-Pillar Plan, split into Clinical, Functional and Financial columns. And five, Risks and Flags, and notice it's red and visibly taller than the rest, holding one highlighted chip: 14-Day Treatment Gap. That asymmetry is the whole design. To the right, a routing rail runs to a card that reads Atty. Elijah Thorne, review, with a calendar chip underneath: file within 30 to 60 days.",
   "ask": "Why do you think the risks band is drawn taller than the band holding the plan itself?"
  },
  "job": {
   "say": "Let me walk you through it as a day on the desk. The verification call is done, so you record the acceptance decision in Case Notes: Accepted, Escalated or Declined, with a reason a colleague could follow. Once the coverage is verified in writing, you open the Action Plan Editor and draft all five bands, and the risks band can't be empty. Then, with the plan drafted, you docket the filing window on the CMS Calendar and route the plan to Atty. Thorne from the editor. It's routed before anything that commits the firm's position, and the due date is on the calendar."
  },
  "dodont": {
   "say": "Let's close with 3 Clues, 1 Rule. Each round hides one Do or Don't about acceptance and the Case Plan. I'll show three clues in turn; call Do or Don't and name the rule. Earlier is better: three points, then two, then one. Keep one line clear while you play. “Request the MRI” is operational, and it's yours. “This case is worth policy limits” is not yours to write. And I know flagging a risk can feel like admitting the case is weak. It isn't. Flagging early is exactly what makes the case defensible later."
  }
 },
 "d1m4-a1": {
  "case": {
   "say": "This is Day 2's most consequential activity. Everything on Days 3 to 5 turns on this flag existing and being accurate. On 03/13/2026, a CMS notice: Riverton Urgent Care's 02/20/2026 note and Riverton Spine & Rehab's visits since 02/24/2026 are now indexed to the treatment timeline, right beside the 02/06/2026 EMS Run Report. The date of loss is 02/06/2026. The first treatment falls 14 days later. And look at the last line of the notice: Risk Flags, none recorded. Nobody has flagged this yet. That's your job.",
   "ask": "Before you call John Doe, what documents could show where he was and what he was doing in those days?"
  },
  "task": {
   "say": "Identify and flag the Treatment Gap in John Doe's file, in the Case File's Risk Flags and the risks band of the Action Plan Editor. Compute it exactly; “about two weeks” isn't a flag, 02/06 to 02/20 is. Record the initial gap, and set the file to catch any later break in care. In the risks band, state what the gap will be used for against the claim. List the likely causes you'll investigate, and the steps you need before the gap can be explained. Then route the flag to Atty. Thorne. What you hand in is a precisely computed, prominently flagged and routed treatment-gap record.",
   "ask": "What are three likely reasons a client goes two weeks before seeing anyone?"
  },
  "check": {
   "say": "Check the flag before you log it. The gap is computed exactly, 14 days, 02/06/2026 to 02/20/2026, not “about two weeks”. The initial gap is recorded, and a watch is set for any later break in care, so each one is documented the same way. The risks band holds facts only: the dates, the length, and a note that John Doe's own explanation and the documents behind it are still to come. Nothing about what the gap will do to the claim; that's Atty. Thorne's to assess. Your investigation steps are listed: his own account, then his work schedules, appointment records and anything else in writing. And the flag is routed to Atty. Thorne.",
   "ask": "Did you set a watch for the next break in care, and where will it show up?"
  }
 },
 "d1m4-l2": {
  "why": {
   "say": "A plan sitting in draft doesn't do anybody any good. It's only useful once counsel has seen it and the file is running against an approved version. So I don't want you thinking of routing as overhead or paperwork. Routing is where operational work becomes authorized work. And here's something I want you to hear early: when a plan comes back to you with comments, that's not failure. Being sent back is the system working. If you're afraid of it, you'll start under-flagging risks just to avoid it, and that's far worse.",
   "ask": "How would you feel if your first plan came back with comments, and what would you do with it?"
  },
  "rules": {
   "say": "Draft in the editor's section templates, because ad hoc structure gives you plans reviewers can't scan. Put each action item's owner and date in their own fields, not buried in a sentence. Route for review before you execute anything that commits the firm's position externally. When a plan comes back, address every comment and re-route; never run a partly addressed plan. Record the approved version, because the file runs against the approved plan, not the latest draft. And when a material fact changes, re-route, because a plan approved on a false picture isn't approved. Keep notes clean, factual and clinical, legal strategy in the legal track only. And where a review comment asks for a legal judgment, the answer comes from Atty. Thorne, not from you.",
   "ask": "Right now, which version of the plan is John Doe's file running against?"
  },
  "job": {
   "say": "Let's follow a plan through its life. You've drafted it across all five bands, so you route it to Atty. Thorne using route for review in the Action Plan Editor, and the routing's recorded with a timestamp. It comes back with comments. You address every one of them in Revisions and re-route, with no comment left unaddressed. Then, after approval, a material fact changes. You don't quietly edit the approved plan. You mark it superseded under Version and re-route a new one, so the approved version is kept and the new version goes to counsel."
  }
 },
 "d1m4-a2": {
  "case": {
   "say": "This is Claim Set Up's capstone, so give it real time. It's the gate, not a wrap-up. Everything from the set-up is in the file: parties mapped, the $40,000 stack verified, the onboarding packet delivered and tracked, and the 14-Day Treatment Gap identified. And on 03/16/2026, this from Atty. Thorne: he needs the full Case Plan on John Doe, all five bands, routed to him by end of day. The acceptance decision and why, the stack in order with a preliminary projection, liability, the triple-check held open for the Treatment Phase, the three pillars with owners and dates, and the risks band. Docket the filing window. If he has to ask a question, it isn't finished.",
   "ask": "What would make Atty. Thorne have to come back to you with a question?"
  },
  "task": {
   "say": "You'll draft the complete Case Plan for John Doe v. Robert Smith in the Action Plan Editor. Fill all five bands from today's work: the acceptance decision with its reason; coverage as a stack with its order of operations, liability, and a preliminary projection; the triple-check, held open until the Treatment Phase; Clinical, Functional and Financial pillars with measurable goals, every action item with an owner and a date; and the risks band, with the 14-Day Gap and the risk of a later break in care, prominently, with their consequences. Docket the filing window, then route the plan to Atty. Thorne. The route control stays locked until every band is complete, so if you can't route, that tells you something.",
   "ask": "If your route button is still locked, which band do you think is incomplete?"
  },
  "check": {
   "say": "Read your plan the way Atty. Thorne will. The snapshot: parties, 02/06/2026, SOL 02/06/2028, client as passenger. The acceptance decision with its reason. Coverage at $10,000, $20,000 and $10,000, total $40,000, in order, BI, Host UM, Relative UM, with the projection marked preliminary and no number stated before coverage is confirmed. Liability preliminary until the Police Report and driver statements confirm it. The triple-check band held open. Each pillar with a measurable goal, every action item with an owner and a date. The risks band with the gap and the risk of a later break, prominent, with consequences. Filing window docketed, plan routed with a timestamp. And here's the Claim Set Up gate: LORs out and logged, stack verified at $40,000, the gap flagged, plan routed. The Treatment Phase doesn't begin until all four are true.",
   "ask": "Could Atty. Thorne set strategy from your plan without asking you a single question?"
  }
 },
 "d1m4-kc": {
  "questions": {
   "say": "This Learning Check closes Claim Set Up, so treat it as the audit it is. Answer from the file, in your own words, typed under each question. First, set out the five bands of the Case Plan and what belongs in each, including the three pillars. Second, explain why an adverse fact buried in the body of a plan hasn't, in any meaningful sense, been disclosed to counsel. Third, state John Doe's coverage position exactly as it should appear in the plan: the layers, limits, total, order of operations, and the status of the projection."
  },
  "summary": {
   "say": "Now the Self-Summary, in your own words. And one last scenario for the day. It's 03/11/2026. Keystone still hasn't confirmed its limit in writing, and John Doe started treatment fourteen days after the crash. Which three actions do you take today, in what order, and what goes in the Case Plan's risks band? Keep in mind that the Treatment Phase builds on this plan: every bill and every lien check reads from the stack you verified today.",
   "ask": "If an approved plan changes after a new fact arrives, do you edit it or re-route it?"
  },
  "scale": {
   "say": "And the Skill Scale to finish. Rate each competency 1 to 5, then submit for review. This time I'll compare your scores with your self-ratings across Day 1 and Claim Set Up, not just this check, and we'll talk through any wide gaps. Before anyone moves on to the Treatment Phase, we're going to confirm the gate together, out loud: LORs out and logged, stack verified at $40,000, the gap flagged, plan routed.",
   "ask": "Looking at the four gate items, which one are you least confident you've truly cleared?"
  }
 },
 "d2m1-l1": {
  "why": {
   "say": "Imagine five envelopes on this table. Five letters leave John Doe's file on 02/17/2026. Which one, written wrong, costs John Doe the most? Go on, argue it. Now let's look hard at the two UM letters. The Letter of Representation is the moment every carrier conversation moves off John Doe and onto the firm. One letter wrong, the wrong insured named, a UM carrier never noticed, a notice that reads like a demand, and it follows the claim all the way to the demand table, where it can put $30,000 of UM coverage at risk.",
   "ask": "Of the five letters going out on 02/17/2026, which one, written wrong, costs John Doe the most?"
  },
  "map": {
   "say": "Before the detail, here's the road. One LOR per carrier, drafted on the firm's template, and each one names that carrier's own insured. Each letter asks for the limits and the Declaration Page, and asks the carrier to preserve photos, statements, video and the vehicle's data. The third-party letter protects John Doe: his name and nothing more. Each letter goes out by that carrier's preferred method, signed by Atty. Thorne and logged by you. And if there's no acknowledgement by the third business day, you follow up. Five steps, three carriers, one day."
  },
  "theory": {
   "say": "Claim set-up is really coverage determination, finding which policies apply and what limits and exclusions they carry, and the LOR is how the firm gets onto each one. The Letter of Representation is formal notice that we represent the client, and it moves all contact onto the firm. Coverage determination comes down to four questions: is coverage valid, what type applies, what are the limits, and are there exclusions? Every request in an LOR chases one of those answers. Liability assessment asks who's legally responsible and how far; Atty. Thorne weighs it, and you secure the proof. And remember first- versus third-party. The third-party carrier is adverse to the client; first-party policies cover him. Each letter differs accordingly.",
   "ask": "Why would a letter to Robert Smith's carrier read differently from one to Harbor Point?"
  },
  "rules": {
   "say": "Send the LOR once the retainer's signed, and early. Claims opened by phone 02/16 to 02/17/2026; the LORs went out 02/17/2026. Use the firm template, address the adjuster by name, like “Attn: Dana Whitfield”, and with no adjuster, “Attn: Claims Department”, which is Cardinal State today. Each letter names the client, the date of loss, the claim number and that carrier's insured: Robert Smith for Keystone, Kevin Alvarez for Harbor Point, Margaret Doe for Cardinal State. Say he was injured, a Demand Package will follow, all contact goes to the firm. Nothing more. Request limits, Declaration Pages and preservation, including the event data recorder. Notify all three stack carriers now, because late notice hands a carrier a defense, but notice isn't a demand. Keystone gets his name only, plus the PD carve-out for Leah Moran with 5 business days to inspect. Atty. Thorne signs; you log delivery.",
   "ask": "Why does Cardinal State get a letter today, when it pays nothing until BI and Host UM are done?"
  },
  "job": {
   "say": "Let's run it as it happened on this file. The claims opened by phone on 02/16 and 02/17/2026, and for each you logged the claim number, the adjuster, or “none yet”, and the preferred delivery method in the Insurance tab and Communications Log. Then the LOR set is drafted, and all five letters go to Atty. Thorne for signature through Documents, Outgoing, with a task. Not one is signed by you. The letters are served on 02/17/2026; you log the method and time and calendar the acknowledgement check, with a follow-up dated 02/20/2026 for anyone still silent. When an acknowledgement arrives, you file it and record any coverage statement or limit with its source and date."
  }
 },
 "d1m1-a1": {
  "case": {
   "say": "It's the morning of 02/17/2026, and the letters haven't gone out yet. All three carriers opened claims by phone on 02/16 and 02/17 and reported their limits on the set-up calls: Keystone Mutual's BI, Harbor Point's Host UM and Cardinal State's Relative UM, with no adjuster assigned there yet. Nothing is confirmed in writing. Today's LORs will ask each carrier for its Declaration Page, and Keystone will want John Doe's authorizations first. Nothing's been entered in the Insurance tab, and the letters can't pull the carrier details until it is. Say the order with me, bottom-up: BI pays first, and only once it's exhausted does Host UM open.",
   "ask": "Before any letter goes out, is the $10,000 BI limit confirmed, or still preliminary?"
  },
  "task": {
   "say": "You're building the complete Policy Stack for John Doe v. Robert Smith in the CMS Insurance tab. Enter all three layers in their order of operations, with the carrier, policy number, claim number, limit and adjuster for each, and classify each as first-party or third-party. In the Comments box, record the carrier's actual name, the driver's name where it differs from the owner, and the adjuster's details, or say plainly that none is assigned yet. Then verify the total, record the order the layers must be pursued in, and mark the projection preliminary until every limit's confirmed in writing. And please don't enter these as three equal claims. UM owes nothing until BI is exhausted.",
   "ask": "What could happen if the BI claim were settled or released without the UM carriers' written consent?"
  },
  "check": {
   "say": "Let's check the stack before you log it. All three layers present, BI, Host UM and Relative UM, with limits of $10,000, $20,000 and $10,000, computing to $40,000. The order recorded as BI, then Host UM, then Relative UM. BI classified third-party, both UM layers first-party. Policy and claim numbers filled in for every layer, and the Relative UM adjuster recorded as “No adjuster assigned yet”, not left blank. The source of each limit noted, the set-up call for now, with the Declaration Page to be requested in the LOR. And the projection marked preliminary. Don't project value before coverage is confirmed, and don't quote a likely limit to the client. I'll ask two of you to read your total aloud.",
   "ask": "If your total isn't $40,000, which rung is in the wrong place?"
  }
 },
 "d2m1-a1": {
  "case": {
   "say": "It's 02/17/2026, and a message from Atty. Thorne just landed: letters of representation go out today. Here's where the claims stand. Keystone BI, KM-26-440871, with Dana Whitfield, and Keystone PD with Leah Moran, who accepted PD liability this morning. Harbor Point, HP-26-7741, with Marcus Bell, for Host UM and PIP. And Cardinal State, CS-26-20355, with no adjuster yet. He wants the three LORs, plus notices to Bluewater and Peach State, on his desk for signature today. The preferred delivery methods are in the Communications Log. John Doe hasn't started treatment. You've got the claim numbers and the call log, and that's all you need to build the set.",
   "ask": "Before you draft a word, which two letters do you think need the most care, and why?"
  },
  "task": {
   "say": "Generate John Doe's full letter set on the firm template in CMS Documents, under Outgoing. That's LORs to Keystone, for BI with the PD carve-out, to Harbor Point for Host UM and PIP, and to Cardinal State for Relative UM, plus notices to Bluewater and Peach State Health Plan. Give each the right Attn line, insured, claim, policy or member number, and the date of loss, with requests for limits, Declaration Pages, additional coverage and preservation. Route the set to Atty. Thorne for signature, send each by its preferred method from the Email Workspace, and calendar the acknowledgement checks. Where I'll grade your judgment: what Keystone's letter leaves out, and why no UM letter asks for payment.",
   "ask": "What goes in the Attn line for Cardinal State, and why not a name?"
  },
  "check": {
   "say": "Check your set before you log it. Five letters: LORs to Keystone, Harbor Point and Cardinal State, notices to Bluewater and Peach State. Attn lines: Dana Whitfield, Marcus Bell, and “Attn: Claims Department” for Cardinal State. Now the insured lines, and look closely, because these get swapped: Robert Smith, Kevin Alvarez, Margaret Doe, and John Doe on Bluewater. Subject lines carry the claim number and 02/06/2026; Peach State's carries PSH-55017742 and GRP-41208. Keystone gets his name only, with the carve-out confined to the Civic and 5 business days to inspect. Neither UM letter asks for payment. Bluewater's requests the signed rejection form from 03/14/2024. John Doe's told to preserve the doorbell-camera video. And every letter went to Atty. Thorne for signature, sent 02/17/2026, with a follow-up on 02/20/2026. A letter he didn't sign fails, however good it is.",
   "ask": "On your Harbor Point and Cardinal State letters, whose name is in the insured line?"
  }
 },
 "d2m1-l2": {
  "why": {
   "say": "An unverified coverage fact is just a guess the file is built on. On this file, both UM carriers confirmed coverage in writing by 03/09/2026, but Keystone held its BI limit until 03/20/2026. So here's my question. I'm putting the five statuses on the board: reported, noticed, acknowledged, disclosed, confirmed in writing. Where did Keystone's BI stand on 03/11/2026? The answer is “not confirmed”, because nobody on the file had seen its Declaration Page until 03/20/2026. The matrix has to show that honestly: a source behind every “confirmed”, and a date on every open item.",
   "ask": "On 03/11/2026, which of the five statuses did Keystone's BI limit really have?"
  },
  "theory": {
   "say": "Coverage verification turns a reported fact into a confirmed one, in writing, with every limit, form and exclusion traced to the document that proves it. The Coverage Matrix is one row per carrier, and it's the file's single coverage record; status, source and date show what's proven. The verification statuses run reported, noticed, acknowledged, disclosed, confirmed in writing, and only the last one is proof; each earlier one is a lead. The Declaration Page is the policy's own summary of who and what it covers, and for how much. And limit types: per person caps one injured person, per accident caps everyone, and a combined single limit is one figure for all of it.",
   "ask": "Keystone's BI is $10,000 per person. Whose claim does that figure cap?"
  },
  "rules": {
   "say": "The Coverage Matrix is the single record: carrier, insured, claim number, adjuster, limit and type, status, source, date, next follow-up. A limit is preliminary until a Declaration Page or Coverage Letter confirms it; a phone figure or a Police Report is a lead, never quoted to John Doe. Read the Dec Page line by line, including a policy period covering 02/06/2026. Keystone's shows BI $10,000 per person. Ask each UM carrier for its form in writing; Harbor Point confirmed add-on on 03/02/2026. Stack only three layers: $10,000 plus $20,000 plus $10,000, $40,000. Verify gaps too: the Bluewater rejection, 03/14/2024, goes in the file. Firm cadence is 24 to 48 hours on an unopened claim, the third business day on an LOR, and a dated next follow-up within two business days. Regulatory deadlines, policy duties and bad-faith questions are Atty. Thorne's to confirm.",
   "ask": "What's the difference between a follow-up you made and one you only scheduled?"
  },
  "job": {
   "say": "Here's the rhythm on the job. A written coverage confirmation arrives, and you enter the limit, form and terms on the Coverage Matrix with source and date, marking it confirmed in writing only with the document attached. On 03/03/2026, Teresa Okafor is assigned at Cardinal State, so you replace “not yet assigned” with her name and direct contact in the Insurance tab and Parties, and re-address correspondence. When a follow-up date arrives and the item's still open, you follow up, log the result and set the next date, so no open item carries a past date. And when you spot a regulatory or policy deadline, you escalate it so Atty. Thorne confirms the rule, then docket it with its source."
  }
 },
 "d2m1-a2": {
  "case": {
   "say": "It's 03/11/2026. A colleague has been keeping John Doe's Coverage Matrix, and the CMS has flagged it. The Keystone BI follow-up for the Declaration Page was due 03/05/2026, and nothing's logged. The matrix total reads $45,000, while the Case Plan target is $40,000. And since the matrix was last edited, new documents arrived: Harbor Point's letter of 03/02/2026, Cardinal State's assignment on 03/03/2026, and its Coverage Letter on 03/09/2026. Keystone's written request with authorizations was sent, but no Declaration Page yet. And this morning, Summit Imaging asked for an LOP, which was declined because PIP applies first. You've got the staged matrix and the file documents. I'm not telling you how many errors there are.",
   "ask": "What's the first thing you'd check when a stack total reads $45,000 instead of $40,000?"
  },
  "task": {
   "say": "Audit the staged Coverage Matrix against the documents in CMS Documents. Find every error, correct it, and cite the document and date that prove each correction. Restore the stack total, clear every past-due follow-up by acting on it and setting a new date, and leave the correct rows alone. You'll also have a live call in the Call Simulator with Dana Whitfield at Keystone. Confirm she has the written request and signed authorizations, get a firm date for the Declaration Page in writing, share no treatment detail or demand figure, then log the call and set the next follow-up by 03/13/2026. Finally, route a three-line audit note to Atty. Thorne: confirmed in writing, still preliminary, escalated.",
   "ask": "On 03/11/2026, what status can you honestly give the BI row, and why?"
  },
  "check": {
   "say": "Check your audit before you log it. BI should read preliminary, verbal from the set-up call, written request sent, because Keystone's Declaration Page doesn't arrive until 03/20/2026. The 03/05/2026 follow-up was past due, so you called Dana Whitfield on 03/11/2026, logged it, and set the next date by 03/13/2026. Host UM's form is add-on, from Harbor Point's 03/02/2026 letter. Teresa Okafor replaces “not yet assigned”. PIP moved out of the stack, and the total corrected from $45,000 to $40,000. Bluewater's “UM: none” needs the signed rejection form from 03/14/2024 chased. Keystone's PD row stays outside the stack, marked preliminary; moving it in or deleting it is a false positive. Finding Cardinal State's unstated form and excess clause earns credit too. Every correction cites a document. Now let's hear an audit note the way Atty. Thorne would read it.",
   "ask": "In ten seconds, does your audit note tell Atty. Thorne what he must decide?"
  }
 },
 "d2m1-kc": {
  "questions": {
   "say": "This is the Learning Check on coverage set-up. Every answer comes from John Doe's file, in your own words, typed under each question. First, name every coverage on the file, whose it is and what it pays, then tell me which three are the $40,000 Recovery Stack and why the others stay out. Second, before the letters went out you built the Policy Stack in the CMS: give each layer's carrier, claim number, limit, whether it's first- or third-party, and the order it must be pursued in. Third, list the five letters that left the file on 02/17/2026, with the insured each one named and how it was addressed. For every “confirmed”, give me the document behind it."
  },
  "summary": {
   "say": "Time for your Self-Summary, the principles in your own words. Then work the scenario. It's 03/11/2026. Keystone still hasn't confirmed its limit in writing, and John Doe started treatment fourteen days after the crash. Which three actions do you take today, in what order, and what goes into the Case Plan's risks band? As you write, think about what you'd say, and not say, to a carrier who calls you about this file today.",
   "ask": "If Dana Whitfield called you today asking about the gap, what would you tell her?"
  },
  "scale": {
   "say": "Last part, the Skill Scale. Rate each competency 1 to 5 and submit it for review. When the scores come back, I'll compare your self-rating with your score. A 5 sitting next to a $45,000 stack is a coaching conversation, and we'll have it. And remember, UPL is a gate: a strong score doesn't survive a letter signed for the attorney, or a coverage opinion given to a carrier or the client.",
   "ask": "Which coverage skill do you feel least sure of right now?"
  }
 },
 "d2m1-cov": {
  "why": {
   "say": "Two questions, and I'm writing them as two columns on the board: “Who pays the bills now?” and “Who pays the claim later?” People merge them all the time, and that's where the money leaks. Every policy on a file pays a different thing, and only some of them pay the Medical Bills while the claim is open. The Payer-First Principle sends each bill to the payer that has to pay it first: the no-fault medical coverage, then the Health Plan, and a Letter of Protection only last. In that order, a bill is paid once, at the lowest cost, with as little as possible to repay. Out of order, that same bill comes back as a lien against John Doe's recovery.",
   "ask": "Who pays John Doe's bills now, and who pays his claim later? Are they the same?"
  },
  "theory": {
   "say": "Every policy answers two questions: whose is it, and what does it pay? Third-party coverage is the at-fault driver's; first-party answers to the client's side, and who you claim against changes how you deal with them. The Recovery Stack is only coverage that pays the claim, so BI, then the UM and UIM layers. Bills and the car stay outside it. No-fault medical coverage, MedPay and PIP, pays accident Medical Bills regardless of fault, fast, even while liability is disputed. And UM follows the person, by status: an occupant reaches the vehicle's policy, a resident relative reaches the household's.",
   "ask": "John Doe reaches two UM policies, and neither is his own. Which status gets him to each one?"
  },
  "theory2": {
   "say": "Four more ideas that shape every bill. Set-off and non-duplication: some policies credit what MedPay or PIP paid against what they owe, so you verify the form in writing. Subrogation versus non-subrogation: a payer with subrogation claims its payments back from the recovery; without it, what it paid stays paid. Contract rate and write-off: an in-network provider takes the plan's rate and writes off the rest, so there's no balance billing and a smaller lien. And Medicare Secondary Payer: Medicare pays only after no-fault and liability coverage, it recovers by statute, and the case gets reported to the BCRC.",
   "ask": "Why is a payer with no subrogation right the best one to bill first?"
  },
  "frame": {
   "say": "Here's what each coverage pays, row by row. BI liability is the at-fault driver's, third-party; it pays the claim for the injuries he caused, and it is the recovery. UM and UIM sit on the client's side, through the vehicle or household, paying the claim when BI is too small, with consent rules guarding its subrogation. PIP comes from the occupied vehicle's policy and pays Medical Bills with no fault needed, but no wages; its repayment terms you verify in writing. PIP, where a state requires it, pays Medical Bills, part of wages and services, with a set-off or lien by state law. Health insurance is the client's own plan at the contract rate, with a reimbursement right on what it paid. Medicare and Medicaid come last, with recovery by statute and a BCRC report.",
   "ask": "Which row on this table pays John Doe's bills fastest, with the least to repay?"
  },
  "rules": {
   "say": "Sort every coverage twice. By whose: Keystone BI and PD are Robert Smith's, third-party; Host UM, Relative UM, PIP and collision answer to John Doe's side; Peach State is his own plan through Northgate Distribution. By what it pays: BI and UM pay the claim, and only they make the $40,000 stack. PIP pays bills, and a share of lost wages, regardless of fault; this file has Harbor Point PIP, $5,000, on the Escape John rode in, which you verify. John Doe reaches Host UM as an occupant of Kevin Alvarez's Escape and Relative UM as Margaret Doe's resident relative; his Bluewater UM was rejected 03/14/2024. The order: PIP first, since Harbor Point confirmed on 03/02/2026 it has no reimbursement right; then the Health Plan, at contract rate; an LOP last. Track each payer's ledger, never re-route a paid claim, and leave conflicts over primacy to Atty. Thorne.",
   "ask": "Before I tell you: where does PIP sit, and why does it go ahead of Peach State?"
  },
  "model": {
   "say": "Two tiers on this slide. On top, a coverage map of eight cards. Navy for third-party: Keystone BI, $10,000, and Keystone PD, $25,000. Orange for first-party: Harbor Point Host UM, $20,000; Cardinal State Relative UM, $10,000; Harbor Point PIP, $5,000; and Bluewater collision with a $500 deductible. Green for health: Peach State Health Plan. And a grey card, crossed out: Bluewater UM, rejected 03/14/2024. Each card is tagged the claim, the bills or the car, and only the three claim cards are bracketed as the $40,000 Recovery Stack. Below, a staircase steps down: MedPay or PIP, then the Health Plan, then the Letter of Protection. The callout says it: out of order means a lien that didn't have to exist.",
   "ask": "Which card on this map would most people wrongly add to the $40,000?"
  },
  "job": {
   "say": "Picture how this works across a normal week. As each claim opens, you list every coverage, its carrier and what it pays in the CMS Insurance tab, and tag each one third-party, first-party or health. When coverage is confirmed in writing, you place it on the Coverage Matrix: in the stack, in the Payer Order, or outside both, so the stack reads $40,000 and PIP, PD and collision sit outside it. A provider asks whom to bill, and you route it Payer-First using the PIP ledger: PIP, then Peach State, then an LOP. If a provider asks for an LOP, you check PIP and network status first in the LOP register, and Atty. Thorne approves any LOP. And when a payer pays, you post it on its ledger, so nothing paid gets re-routed."
  },
  "dodont": {
   "say": "Let's play 3 Clues, 1 Rule with coverages. Each round hides one of this lesson's Dos or Don'ts; clues come one at a time, and you call Do or Don't and name the rule. Three, two or one points, depending on how early you get it. Two facts to carry in. Summit Imaging: $2,395.00 paid by PIP with nothing to repay, instead of a $2,395.00 LOP balance against John Doe's net. And Crescent: $3,400.00 billed, $1,860.00 paid by Peach State, $1,540.00 written off for good, so Peach State's claim can only start from what it paid. Remember, you route bills in the default order, but when two policies both claim to pay second, that's Atty. Thorne's call.",
   "ask": "Why does John Doe reach $30,000 of UM at all, when he has no auto policy of his own?"
  }
 },
 "d2m2-l1": {
  "why": {
   "say": "I've got John Doe's PIP ledger up, with the right-hand column covered. Harbor Point has paid $685.00, $640.00, $2,395.00 and then $640.00 for the 03/27/2026 visit. How much PIP is left? Take a second. It's $640.00. If you can't keep that column straight, you can't decide an LOP request. Treatment is the file's engine room, and somebody has to pay for it while the claim is open. On this file three payers stand in a default order: Harbor Point PIP, then Peach State, then a Letter of Protection. An LOP issued out of order turns a bill an earlier payer would have paid into a lien against John Doe's net.",
   "ask": "How much PIP does John Doe have left after the 03/27/2026 visit?"
  },
  "theory": {
   "say": "Once the claim's set up, the Case Plan runs on three pillars: clinical care, functional status and subrogation management, and that last one decides who pays. The Payer Order is the default sequence. MedPay or PIP pays first, then health insurance, and an LOP comes last. Keeping that order keeps the liens down. PIP is first-party coverage for Medical Bills regardless of fault, up to its limit, and unlike PIP it never pays wages. Health insurance pays covered care at its contract rate, but it may hold a reimbursement right against the recovery. A Letter of Protection is the client's signed agreement that a provider gets paid from any recovery, which makes it a consensual lien on his net.",
   "ask": "Which of these payers have you dealt with before, and which one is first in line on John Doe's file?"
  },
  "rules": {
   "say": "In treatment, the question becomes \"Is the plan working?\" and you're facilitating, coordinating and advocating. Run the Payer Order: Harbor Point PIP, then Peach State, then an LOP. John claims the $5,000 PIP as a passenger in Kevin Alvarez's 2020 Ford Escape, because no policy in his household carries PIP. PIP pays in date order, never wages. When Crescent Pain & Spine billed Peach State on 05/15/2026 with $640.00 of PIP left, you tracked both ledgers and never re-routed a paid claim. Riverton Spine & Rehab got an LOP because it's out of network. Summit Imaging's 03/11/2026 MRI went to PIP, since every needless LOP is a lien on his net. LOP terms are Atty. Thorne's, so you prepare, route, transmit once he approves and confirm receipt. Never promise a provider an amount, a reduction or a date, and never explain John's liability to him.",
   "ask": "Riverton and Summit Imaging both asked for an LOP. Why did only one of them get it?"
  },
  "job": {
   "say": "Picture a normal month on this file. A provider asks for an LOP. You run the Payer Order and prepare one on counsel's template only for care PIP and Peach State can't carry, then route it for approval from CMS Documents, Outgoing. The payer check is recorded first, and nothing goes out without Atty. Thorne. When PIP pays a bill, you post the payment, the running total and the balance on the PIP ledger, and it ties to Harbor Point, hitting $5,000.00 on the 06/12/2026 visit. When an LOP statement arrives, you update the LOP register and check every line, so through 04/02/2026 that's 16 visits at $185.00, or $2,960.00, all attended. For a new referral, you do a warm handoff with John on the line and confirm the payer before the first visit.",
   "ask": "If Riverton bills a date John Doe didn't attend, what do you do with that line?"
  }
 },
 "d2m2-eob": {
  "why": {
   "say": "Before we look at the slide, take out RS26, Peach State's Explanation of Benefits, and let's read it together, column by column. So, what does John Doe owe Crescent? Find the bottom line. The EOB says $0.00. Every payer reports what it did with a bill. Peach State does it in an EOB, and Harbor Point does it in its PIP payment history. Read line by line, they tell you what was billed, what was paid, what was written off and what John Doe may still owe. Those documents are the proof behind the Medical Specials, behind every lien amount, and behind every answer you give a provider or John Doe about a balance.",
   "ask": "Reading RS26, what does John Doe actually owe Crescent Pain & Spine for the injection?"
  },
  "theory": {
   "say": "Every payer reports back on a bill, the Health Plan in an Explanation of Benefits and PIP in its payment history, and you read both before you ever touch a lien. An EOB is the plan's account of one processed claim. It's not a bill; it's proof of who paid what. Billed versus allowed is the first thing to see. Billed is the provider's charge, allowed is the plan's fee schedule, and in network the gap gets written off. Remark codes are the short codes explaining each line. CO-45 is the fee-schedule write-off, and AC1 flags a possible accident. And member responsibility, meaning the deductible, copay and coinsurance, is the most an in-network provider may bill the patient.",
   "ask": "Which of these terms have you seen on your own Medical Bills, and what did it mean there?"
  },
  "theory2": {
   "say": "Four more ideas round this out. Balance billing is when a provider bills the patient for a contractual write-off. In network that isn't allowed, so it's an error, not a lien. The PIP payment history is the carrier's ledger of every check, showing the date of service, the amount paid and the limit remaining. Exhaustion is what happens once that limit's spent. Later bills come back unpaid, and you route them to the next payer. And reconciliation is matching every provider balance to each payer's EOB or check, so that no bill that's already been paid ever turns into a lien against John Doe.",
   "ask": "If a provider bills John Doe for a write-off, is that a lien, a debt or an error?"
  },
  "frame": {
   "say": "Here's how you read an EOB, top to bottom, every time. First, match the claim: the member ID, claim number, provider and date of service against the CMS treatment record. Then go from billed to allowed, which means the charge, the plan's allowed amount and the contractual adjustment it wrote off. Next is the patient's share, the deductible, copay and coinsurance, because member responsibility is the most a provider may bill. After that comes what the plan paid, with its date and its EFT or check number, since that's where any reimbursement claim starts. Read the remark codes: CO-45 explains the write-off, and AC1 flags an accident and the plan's reimbursement right. Finally, reconcile and log it against the provider's statement and the lien register, and flag any balance billing.",
   "ask": "Which step in reading an EOB do you think people skip most often?"
  },
  "rules": {
   "say": "Peach State's EOB of 06/03/2026, claim PS-2605-449021, covers Crescent's 05/15/2026 epidural injection, and it says THIS IS NOT A BILL. Crescent billed $3,400.00 and the plan allowed $1,860.00. The $1,540.00 difference is Crescent's write-off. The plan paid $1,860.00, and member responsibility is $0.00. CO-45 explains that write-off, and AC1 is how Peach State's reimbursement right attaches. Now turn to Crescent's 07/01/2026 statement asking John Doe for $1,540.00. That's a balance bill, not a debt and not a lien. You document it, route it to Atty. Thorne that day, draft a correction request and tell John what's happening. Peach State's claim starts at $1,860.00, never $3,400.00, and you route its accident questionnaire to Atty. Thorne. Harbor Point's five checks total $5,000.00, exhausted 06/26/2026. You read and reconcile; whether he owes anything is counsel's call.",
   "ask": "Crescent's $1,540.00 statement: is it a lien we missed, or a bill nobody owes?"
  },
  "model": {
   "say": "We've got two documents side by side, each read line by line. On the left is Peach State's EOB for claim PS-2605-449021, with that red stamp, THIS IS NOT A BILL. It has six rows: billed $3,400.00, allowed $1,860.00, the $1,540.00 adjustment, $0.00 deductible, $1,860.00 paid, and $0.00 member responsibility. Each orange tag tells you where that number goes on the file. On the right is Harbor Point's payment history, five checks with a limit bar falling from $5,000.00 to nothing, stamped exhausted 06/26/2026. And underneath is Crescent's 07/01/2026 statement for $1,540.00, with a dashed line back to that $0.00 row and a question: balance bill?",
   "ask": "Which row on Peach State's EOB is the most Crescent may bill John Doe?"
  },
  "job": {
   "say": "Let's run this as it happens on the file. An EOB arrives, and you post billed, allowed, adjustment, paid and member share against the visit in CMS Liens and Documents, so the $1,860.00 plan payment is logged and claim PS-2605-449021 is linked to the visit. A PIP check clears, and you post it on the PIP ledger with the date of service and the limit remaining, until it ties to Harbor Point's history with $0.00 left after 06/26/2026. Then a patient statement shows a balance. You compare it with the EOB's member responsibility, flag the $1,540.00, tell Atty. Thorne the same day and draft the correction request. And when Peach State's itemized lien arrives, you match each line to an EOB and to the collision, so only those lines stand.",
   "ask": "What would you do with a line on Peach State's lien that no EOB supports?"
  },
  "dodont": {
   "say": "Here comes 3 Clues, 1 Rule. I'll reveal three clues one by one; call Do or Don't and name the rule. The good habits are reading every EOB down to member responsibility before you answer a balance question, asking each provider for an itemized statement showing every payer's credit, keeping billed and paid on the same CMS line, and telling John what you're doing and when he'll hear back. The traps are logging a lien at the billed amount instead of what the plan paid, treating a write-off as something he owes, and sending a bill to PIP after it was exhausted on 06/26/2026. One number to hold onto: Peach State can claim back $1,860.00, never $3,400.00. You read, reconcile and report. Whether John Doe owes a balance is Atty. Thorne's call.",
   "ask": "After Harbor Point's $0.00 line on 06/26/2026, where does the next bill go?"
  }
 },
 "d2m2-a1": {
  "case": {
   "say": "We'll run this in two passes, one for each date. The first is 02/23/2026, and this email just came in from Tammy Greer, Office Manager at Riverton Spine & Rehab. John Doe is booked for his chiropractic and PT evaluation tomorrow, 02/24, they're out of network with Peach State, and they want a signed Letter of Protection and his HIPAA authorization today. His first treatment was Riverton Urgent Care on 02/20/2026, $685.00, paid by Harbor Point PIP. Atty. Thorne has approved the LOP template, and John had three chiropractic visits in 2021 for low-back stiffness. The second date is 03/11/2026, when Summit Imaging Center, booked for the cervical MRI Dr. Reyes ordered on 03/05/2026, asks for an LOP too.",
   "ask": "Before you open the template, why does Riverton get an LOP?"
  },
  "task": {
   "say": "Work both dates, and start each one by running the Payer Order and recording the result. On 02/23/2026, you prepare Riverton's LOP on the approved template, route it to Atty. Thorne for approval and signature, and transmit it with the claim-specific HIPAA authorization, asking for itemized statements and a missed-visit alert. Confirm receipt and open the entry in the CMS LOP register. Record John's assessment too, with his 2021 care as the pre-morbid baseline. On 03/11/2026, decline Summit's request in writing in the Email Workspace, naming Harbor Point PIP and proving it from the PIP ledger. If Summit still refuses, Atty. Thorne hears before the 03/13/2026 appointment, so the MRI doesn't slip. And you're graded on this: no payment promised to either provider.",
   "ask": "Summit says it won't do the MRI without an LOP. What do you say, and who do you tell?"
  },
  "check": {
   "say": "Check your work before you log it. Did you run the Payer Order for each provider? Is Riverton's LOP justified, out of network and more care than PIP's balance can carry? Was it explained by Atty. Thorne and signed by John Doe and Atty. Thorne on 02/23/2026, before the 02/24 visit, with nothing signed by you? Does your transmittal carry the HIPAA authorization, ask for statements and the missed-visit alert, and is receipt logged? Your assessment should note the rental ending 03/19/2026 as a treatment risk, and the baseline should show the 2021 visits were low back, resolved, a different region. Summit's decline names PIP, proved from the ledger with $3,675.00 left, enough for the $2,395.00 MRI with $1,280.00 left over. And listen to the language. \"Don't worry, you'll be paid in full\" fails, however friendly.",
   "ask": "When a provider asks whether they'll be paid in full, how do you answer them?"
  }
 },
 "d2m2-lop": {
  "why": {
   "say": "John Doe needs chiropractic care next week, and nothing he has will pay for it. That's where a Letter of Protection comes in. In plain English, it's the firm's written promise to pay the provider's bill out of the settlement, so he can be treated now instead of waiting. It keeps care moving, and care that keeps moving keeps the file honest. But it isn't free money. It's a balance against his recovery, and he still owes it. So we track it from the day it's signed.",
   "ask": "If the settlement came in lower than the bills, who would still owe the provider?"
  },
  "theory": {
   "say": "Four ideas carry this lesson. A Letter of Protection is the firm's written promise to pay a provider from the settlement, so it's a claim against John Doe's recovery, not insurance. Payer-first means we check health insurance, MedPay and PIP before we ever reach for one. The LOP balance grows with every visit, so the itemized ledger every thirty days keeps the Liens tab honest. And referrals are options and logistics only: a list, the network status, the booking, and his choice.",
   "ask": "Which of these four would you check first on a new provider bill?"
  },
  "rules": {
   "say": "Here's how we handle it. First, an LOP is the last resort, so we check health insurance, MedPay and PIP before anything else and write down why none of them works. Second, it gets signed before the first visit and filed. Riverton's was signed on 02/23/2026. Third, we ask for the itemized ledger every thirty days and update the Liens tab, so the balance never surprises anyone. And when John Doe asks where to go, we give him options with the facts, book the one he picks, and log his choice in his own words.",
   "ask": "Why does it matter that he picks the provider, and not us?"
  },
  "job": {
   "say": "On the job it looks like this. When no payer covers the care, you document the payer check and route the LOP to Atty. Thorne to approve. When it's signed, you file it and set the recurring ledger task. And when John Doe asks where he should go, you hand him two or three options with their locations, hours and network status, disclose any relationship the firm has with them, and book his choice. What you never say is which one is better for his case. That's the line."
  }
 },
 "d2m2-l2": {
  "why": {
   "say": "Let me start with a date: 04/07/2026. Does anyone know what was due that day on John Doe's file? It was his week-6 mark of care. And John Doe wasn't there. Here's why that matters. On an LOP, nobody denies the next six visits in real time. Keystone does it later, at the demand, by calling the care unnecessary or the injury minor. That leaves you as the only real-time check that John Doe's plan is working, and the person who acts the very day it isn't.",
   "ask": "On an LOP file, who denies unnecessary care, and when, and what does that make you?"
  },
  "map": {
   "say": "Here's the road for monitoring treatment, before we get into it. You check in on visits, pain, function and any barrier. When something's off, you name the variance: clinical, psychosocial or systemic. Then you run A-C-T. Assess, where medical danger goes to the provider and legal danger goes to Atty. Thorne. Coordinate, where you clarify with the office and remove the barrier. And Track, where every fix attempt goes into a GIRP note, facts only. Five steps, and you'll use them on John Doe's file more than once."
  },
  "theory": {
   "say": "Knowing the Standard Treatment Map is what separates a Case Manager who watches a recovery from one who drives it, because deviations are what trigger denials and IMEs. The acute phase is days 1 to 14, with the ER, imaging, initial PT and documenting causation. Sub-acute runs weeks 2 to 8, with active PT, specialists and measured functional gains. Restorative is weeks 9 to 24, with injections, work hardening and barriers to returning to work, and after that comes maintenance, with home exercise and as-needed visits. Maximum Medical Improvement is the provider's finding that more care won't improve things. It closes treatment and opens pre-demand. When a client drifts off the map, variance analysis asks why first: is it clinical, psychosocial or systemic, and you ask before funding stops.",
   "ask": "Which phase do you think John Doe was in when he missed his week-6 mark?"
  },
  "rules": {
   "say": "Monitor outcomes, not just attendance. Ask about visits, pain and what he can't do at work or home, and hunt the barriers, internal ones like fear or mood and external ones like transport or money. On 04/08/2026, day 61, he's in week 9. At every check-in, ask whether he's improving. His week-6 mark fell on 04/07/2026, which is 02/24/2026 plus 42 days, and the next step, whether that's medication, injections or a specialist, is the provider's decision. Name the variance before you fix it. Run A-C-T for every red flag, and adjust the plan first, because it's usually the plan, not the client. Climb the ladder one documented rung at a time: clinical, then administrative, then legal. Write every intervention as a GIRP note. And you coordinate care, you never direct it. Never tell him to skip treatment, or that missed visits cut his claim.",
   "ask": "Why does writing \"this will help the case\" in a GIRP note put the file at risk?"
  },
  "job": {
   "say": "Let's walk through a few weeks of this file. A provider's missed-visit alert comes in. That same day, you call AI John Doe, classify the variance and write the GIRP note in Case Notes, dated the day the alert arrived. At week 6, 04/07/2026, you ask the provider for the re-evaluation measures: range of motion, pain score and disability index. Whether a PHQ-9 or GAD-7 screen is indicated is the provider's call, and anything putting his mental health in the record gets flagged to Atty. Thorne. If the barrier isn't fixed at the clinical rung, you climb one rung with a written notice to the carrier causing it, copied to Atty. Thorne, and only property facts to Keystone PD, with each rung dated. Red flags that can cost the claim go to Atty. Thorne with the fix you attempted.",
   "ask": "Why does the GIRP note need to be dated the day the alert arrives, not the day you finish?"
  }
 },
 "d2m2-a2": {
  "case": {
   "say": "The clock starts at 04/08/2026, with this alert from Riverton Spine & Rehab on LOP account RSR-26-0412. Under the LOP dated 02/23/2026, John Doe missed 04/03 with no call, and he missed 04/07. His last visit was 04/02/2026. He told their front desk his mother's rental ended and his ride's no longer available. He's booked 04/09 and 04/14 at 4:15 PM, but their 6:00 PM evening schedule is full until the week of 04/20, and he's on the wait list. They're asking you to contact your client. As you work, the file will keep moving, and I'll give you each update when you've earned it, not before.",
   "ask": "What's the very first thing you'll do today, on 04/08/2026, with this alert in hand?"
  },
  "task": {
   "say": "You're going to run A-C-T on the Transportation Wall. To assess, call AI John Doe on 04/08/2026, find the barrier, ask about his current symptoms, classify the variance and decide whether it's a medical or a legal danger. To coordinate, clarify with the clinic, request a rental extension from Keystone PD in writing through the Email Workspace, and build a transport plan from one of the three Transportation Wall options, saying why, and book evening slots with the clinic while John's on the line. To track, write the GIRP note in Case Notes, report to Atty. Thorne, and confirm attendance on 04/21 and 04/23/2026. You're graded on exact dates and the 19-day count, with no treatment advice and nothing on what missed visits do to his claim.",
   "ask": "Which option did the file actually use, and why did Option B outlast Option A?"
  },
  "check": {
   "say": "Before you log your work, check it. Is Assess dated 04/08/2026, with the barrier recorded? That's Keystone ending the rental on 03/19/2026 at its 30-day cap, the carpool ending with Kevin Alvarez's shift change on 04/01/2026, and the Civic still waiting on parts. Did you ask about symptoms? Is it classified as a transport barrier, a psychosocial variance and a legal danger? Your request to Leah Moran at Keystone PD should be property facts only, because Keystone also holds the BI claim, and the 04/10/2026 refusal should be logged in full. You need the four missed visits exactly, 19 days from 04/02 to 04/21, a factual GIRP note, and attendance confirmed. And listen back for value talk. \"If you miss more therapy your case is worth less\" fails, however well meant.",
   "ask": "What could you have calendared back on 02/18/2026 that would have warned you about this?"
  }
 },
 "d2m2-a3": {
  "case": {
   "say": "It's 04/22/2026, and there's a voicemail from John Doe, left at 12:18 p.m. Care has just restarted at Riverton Spine & Rehab, on evening slots, with Margaret driving him after her shift, and the Civic is still in the shop. Yesterday Lakeside's scheduling desk booked the injection Dr. Reyes referred him for back on 03/27/2026, but they booked it at Millbrook Interventional Pain Center, out in Millbrook, for 05/14/2026. John says he isn't going. It's too far, he's got no ride out there, and somebody at work told him the place is out of network with Peach State. He still wants the appointment. He just wants it somewhere he can actually get to.",
   "ask": "Before you call him back, which document on the file would you open first, and why?"
  },
  "task": {
   "say": "Here's your job. Call John back and really listen. Where he goes, among the options his doctors find appropriate, is his choice, and what care he gets is Dr. Reyes's and the treating provider's call, so you give no medical advice at all. Check Crescent's network status with Peach State yourself. Then work with Janelle Brooks, Lakeside's referral coordinator, to send the referral to Crescent Pain & Spine, and book Crescent's first opening while John's still on the line. After that, every task that follows is yours to do or to delegate, with an owner and a due date: the cancellation, the calendar, Parties, Peach State and the Lien Tracker, the records request, transport, the GIRP note, the report to Atty. Thorne, and the attendance check after 05/15/2026.",
   "ask": "Who decides where John has the injection, and who decides whether he has it?"
  },
  "check": {
   "say": "Check your work before you log it. Did you return the call on 04/22/2026 and record John's reasons in his own words? Did you verify Crescent's network status with Peach State, instead of repeating what he heard at work? Crescent Pain & Spine, Dr. Omar Haddad, is in network for member PSH-55017742. Is 05/15/2026 booked, one day after the Millbrook slot it replaces, with PT carrying on in the evenings, so there's no new gap? Is the Millbrook slot off the calendar, with a reminder call on 05/13/2026 and an attendance check on 05/18/2026? Does every task have a date or an owner? And read your notes back for advice. Saying one place gives better care than the other fails, however kindly it's meant.",
   "ask": "If Crescent's first opening had been weeks away, who would you tell, and what would you ask them?"
  }
 },
 "d1m1-l2": {
  "why": {
   "say": "I've drawn two lanes on the board, and here's why. Two different questions get confused on every new file: who pays John Doe's Medical Bills while the claim is open, and who pays the claim itself at the end. Most of the confusion on this topic is just those two questions being treated as one. The Health Plan answers the first question, and then it asks to be repaid out of the second. So if a reimbursement claim gets found after the demand goes out, guess where the money comes from? Straight out of the client's net.",
   "ask": "Who pays John Doe's Medical Bills while his claim is open, and who pays the claim itself?"
  },
  "map": {
   "say": "This lesson has a lot of moving parts, so here's the road first. Before any clinical planning, you clear three checks. One, a claim-specific HIPAA authorization. Two, the Medicare and Medicaid check: his age and his SSDI status, verified and recorded. Three, the Payer Order: PIP first, then health insurance, then an LOP or liens. After that, you flag the Health Plan's reimbursement right on first notice, and you put the plan's details in the CMS lien register the same day. Five steps, and every later money question on this file leans on them."
  },
  "theory": {
   "say": "Before any clinical planning, the Regulatory Triple-Check establishes the claim and your authority to act, and then the Payer Order decides who funds care. A few terms. Subrogation is a payer's right to stand in the client's shoes and recover what it paid for accident care. Primary payer determination is deciding which payer gets billed first, so each bill reaches the right payer and nothing's paid twice. A Letter of Protection is the firm's written promise to pay a provider from the settlement, and it's last in the Payer Order. And the client's net is what the client keeps once fees, costs and liens are paid. A lien flagged late comes straight out of it.",
   "ask": "Why do you think a Letter of Protection sits last in the Payer Order?"
  },
  "rules": {
   "say": "Clear the triple-check before clinical planning, so the claim's properly established and you're authorized to act. HIPAA first: a claim-specific Authorization to Release Medical Information that names the incident date and permits contact with legal and insurance parties. Then Medicare and Medicaid: if the client's 65 or older or on SSDI, report to the Benefits Coordination and Recovery Center under MMSEA, 2007. John Doe is 34, so you verify his SSDI status and record the answer. Then the Payer Order, and verify whether MedPay or PIP applies; don't assume it. The Payer Order isn't the Recovery Stack. When a Health Plan pays accident bills, flag its reimbursement right on first notice, and record the carrier, member ID and group number in the lien register that day. Never promise a provider or plan an amount, and leave enforceability and compromise to Atty. Thorne.",
   "ask": "Why flag the Health Plan's reimbursement right on first notice instead of waiting for the demand?"
  },
  "job": {
   "say": "Here's the sequence on a live file. The retainer's signed, so you obtain the claim-specific HIPAA authorization and file it in Documents; it names 02/06/2026 and permits legal and insurance contact. Once you know the client's age and benefits, you verify SSDI status and report to the BCRC if he's 65 or older or on SSDI, logging the answer and its date in Case Notes. When the Health Plan's identified, you record the carrier, member ID and group, and the Payer Order, in Liens, so a dated lien record exists. And the moment the plan pays an accident-related bill, you flag the reimbursement right against the matter, before any demand is drafted."
  }
 },
 "d1m1-a2": {
  "case": {
   "say": "A letter just landed on the file, dated 03/12/2026, from Peach State Health Plan about member PSH-55017742, group GRP-41208. Following its 02/27/2026 notice of reimbursement rights, Peach State says it's processing John Doe's accident-related claims and will assert reimbursement from any recovery. It asks us to confirm the claim's noted on the file, return the accident questionnaire, and notify it before any settlement. The recovery file is SRU-26-03318. Right now, no lien record exists on the matter, and the pre-demand audit is still ahead. Timing is everything on this one.",
   "ask": "If you waited to register this until the demand went out, what would it cost John Doe?"
  },
  "task": {
   "say": "Register Peach State Health Plan's reimbursement claim in John Doe's lien register in CMS Liens, and flag it against the matter. Record the carrier, member ID and group number, its position in the Payer Order, the basis on which reimbursement is asserted, and the date of the flag. Record the Regulatory Triple-Check results right alongside it. Then, in one line, say what has to happen before this lien can be compromised. When you set the flag, say the date out loud; I want to hear it. What you hand in is a dated, flagged lien record complete enough to negotiate from on Day 4. A lien found at disbursement is found too late to negotiate from strength.",
   "ask": "What's the date you're setting on that flag, and why today?"
  },
  "check": {
   "say": "Before you log it, run your record against this. A lien record created against John Doe's matter, with the carrier as Peach State Health Plan, and both member ID PSH-55017742 and group GRP-41208 entered. The Payer Order position recorded: after PIP or MedPay, before LOPs and provider liens. The reimbursement basis noted. The flag dated before any demand's drafted. The triple-check recorded, HIPAA authorization, BCRC answer, Payer Order. And an escalation note saying compromise needs Atty. Thorne's authority. Remember, registering a lien isn't conceding it. Day 4 is where it gets reduced. I'm going to read one of your records aloud as if I were the lien negotiator receiving it on Day 4.",
   "ask": "Reading your record cold on Day 4, what would a lien negotiator still have to go looking for?"
  }
 },
 "d2m2-kc": {
  "questions": {
   "say": "Here's your Knowledge Check. Answer from this file, in your own words, typed under each question. You'll read Peach State's 06/03/2026 EOB for claim PS-2605-449021 line by line and say where each amount goes. You'll handle Crescent's 07/01/2026 statement asking John Doe for $1,540.00. And you'll explain from the Payer Order why Riverton got an LOP on 02/23/2026 and Summit's 03/11/2026 request was declined. Then there's a pressure scenario later in the check. The right answer promises nothing new, points the office manager to the LOP signed on 02/23/2026, and gets Atty. Thorne involved before the appointment.",
   "ask": "What may you tell Summit Imaging when you decline its LOP request, and what may you not?"
  },
  "summary": {
   "say": "Now write your Self-Summary. It's 04/08/2026. Riverton Spine & Rehab reports John Doe has missed two visits, Keystone ended Margaret's rental on 03/19, his carpool ended 04/01, and Dana Whitfield has asked John for a Recorded Statement. Tell me what you do first, second and third, and what each step protects. A couple of things I'll be looking for. On the 2021 visits, documenting low back versus neck, resolved, no prior neck complaints, is proof; saying they \"don't matter\" is arguing. On medication red flags, the provider hears the safety issue, Atty. Thorne hears the legal one, and you document the conversation.",
   "ask": "Which of these three problems would you hand to Atty. Thorne before anything else today?"
  },
  "scale": {
   "say": "Finish with your Skill Scale. Rate each competency from one to five, honestly, and submit it for review. I'll be comparing your self-rating with your score, and if there's a wide gap, we'll talk it through together. One thing to know before you rate yourself: UPL works as a gate. A strong score doesn't survive a single payment promise to a provider, so if you made one anywhere today, rate with that in mind.",
   "ask": "Where do you think your self-rating and your score will be furthest apart?"
  }
 },
 "d2m3-l1": {
  "why": {
   "say": "I've written two questions on the board. The first one is, \"Was it because you had no car?\" The second is, \"What, if anything, made it hard to get seen sooner?\" Here's the rule I want you to remember from today. The only gap explanation that holds up against insurance adjusters is John Doe's own factual explanation, backed by written documents you can check: work schedules, doctor availability notes, travel logs, illness records. Your job is to draw it out with clean questions and write it down as he gives it. You don't interpret it, defend it or judge what it does to the claim. And a reason you suggested isn't his explanation at all.",
   "ask": "Which of those two questions would the defense rather you asked John Doe, and why?"
  },
  "map": {
   "say": "Here's the road for the gap interview, start to finish. You plan the questions from the records, and you write questions only, never the answers you expect. You open on the record: the date, who's on the call, your role, his consent and his privacy. You ask open, follow his words, and keep closed questions for last. Then you ask for the paper: work schedules, doctor availability notes, travel logs, illness records. You read it back so he can correct you. And you record his words as he gave them, with a dated task for every document.",
   "ask": "Which step do you think is easiest to skip when the client is friendly and talkative?"
  },
  "theory": {
   "say": "Everything in this lesson sits on one Golden Rule: coordinate, don't commingle. The medical plan and the legal claim run on two parallel tracks, and they never cross-contaminate, not even in a gap interview. That's why your neutrality matters so much. If a legal opinion turns up in your medical notes or call notes, the defense uses it to impeach you, so you record facts, never conclusions. Under A-C-T, a gap in care is a legal danger rather than a medical one, which means it routes to Atty. Thorne. While you're talking to John, you listen actively: reflect, paraphrase, then summarize, so he feels heard and fixes whatever you got wrong. And remember privilege. Confidential talk between the firm and its client is protected, and a third person in the conversation can put that at risk.",
   "ask": "Which of these ideas have you run into before, and where would it show up on John Doe's file?"
  },
  "frame": {
   "say": "Let's bring back the A-C-T Immediate Action Protocol, because the gap interview lives inside it. Assess comes first. Medical danger, like a fever or hardware failing, goes to the provider today. Legal danger, like a gap or a generic note, goes to Atty. Thorne. Then Coordinate: you clarify with the provider's office, and you remove whatever barrier the client names, whether that's transport, scheduling or a referral. Track means you document the flag and every fix you attempted that same day, and if a provider gets dropped, you write down counsel's reason. And then you're back to monitoring, because Track feeds your next check-in, where the question is simple: is the plan working?",
   "ask": "Looking at John Doe's file right now, which step of A-C-T is his 14-Day Gap sitting in?"
  },
  "rules": {
   "say": "Here are the rules for the gap call. You investigate; you don't advocate. Read the EMS report, the 02/20/2026 urgent-care history and the timeline, then write a plan that holds questions only, never the answers you expect. Run a funnel: broad open questions, follow-ups built on his words, closed questions last to pin a date or a document, one at a time. Never lead, and never judge. You know the ordinary causes, like transport, co-pays and work schedules, but you never offer them. Record only with his spoken consent, and protect privilege. If Keystone wants a Recorded Statement, he declines and sends it to us. Confirm his 03/05/2026 consult with Dr. Reyes, and ask how he'll get to care once the rental ends 03/19/2026. And the line: never tell him the gap won't matter or will hurt. Reassure the process, never the outcome.",
   "ask": "If John Doe's reason is true anyway, why does it matter how you asked for it?"
  },
  "model": {
   "say": "Have a look at this board. On the left, in green, it says ask it open. On the right, in red, never like this. Every open question sits on the same line as the leading or opinion-laden version it replaces, so you can read straight across and hear the difference. That last red row has a little UPL tag on it, and that's the soothing line, the one that sounds kind and is really an opinion on his case. Down below is the funnel: first open, then follow his words, then pin the dates and documents. Notice the pill at its mouth, recorded, consent on the record. The whole point is that the same fact, asked two ways, produces two different cases.",
   "ask": "Reading across the rows, which red question do you think you'd be most tempted to ask on a real call?"
  },
  "job": {
   "say": "Now let's follow this on the job. It starts when the records show the 14-day gap. You read the EMS report, the urgent-care history and the treatment timeline in the CMS, and you save your question plan in Case Notes before the call, with no question in it naming a reason. When the call connects in the Call Simulator with AI John Doe, you state the date, who's on, and that it's recorded, and you get his consent and confirm he's somewhere private before anything substantive. If he asks what the gap does to his case, you give no opinion; you log it and escalate to Atty. Thorne through Tasks the same day. And if a carrier asks him for a Recorded Statement, you remind him it goes through the firm, log it in the Communications Log and tell Atty. Thorne that day.",
   "ask": "Where in that sequence do you think a nervous new Case Manager is most likely to slip?"
  },
  "dodont": {
   "say": "Time for 3 Clues, 1 Rule. I'll reveal three clues one at a time, and as soon as you think you've got it, call out Do or Don't and name the rule behind it. Some of these are the good habits: asking open, following his words and closing last, paraphrasing back so he can correct you, and preventing the next gap now, which is far cheaper than explaining a second one in the demand. Others are traps: a question that names the reason you expect, blaming him for the gap, and soothing. Watch that last one. \"Don't worry\" is the most common UPL slip in this module. It sounds kind, and it's an opinion on the case, the same as saying \"it will hurt the case\".",
   "ask": "What's the difference between telling John consistent care matters and telling him what this gap does to his case?"
  }
 },
 "d2m3-a1": {
  "case": {
   "say": "Here's what landed on the file on 03/04/2026. The first records are in. Riverton Urgent Care's 02/20/2026 note says onset at the MVA on 02/06/2026, progressively worsening, with numbness to the right hand since 02/18. The EMS Run Report records neck stiffness on 02/06/2026. John Doe's been at Riverton Spine & Rehab since 02/24/2026, and Margaret's rental runs to 03/19/2026. And nobody has asked him why he waited 14 days. Atty. Thorne wants him on a recorded call today: open questions, nothing suggested, no opinions on what it means, and a GIRP note when you're done. Before anyone dials, here are the two ways to fail: a leading question or a suggested reason, and any version of \"won't matter\" or \"will hurt the case\".",
   "ask": "Knowing what's on this file, what question will you be most tempted to ask him first?"
  },
  "task": {
   "say": "You'll run a recorded call with AI John Doe in the Call Simulator to find out why he first treated on 02/20/2026, fourteen days after the collision. Open on the record with the date, who's on the call, your role, his consent to recording, and that he can talk privately. Ask open questions, follow his words, and save closed questions for pinning dates and documents. There are four reasons to draw out. Find out who he told and what he kept, like the texts, the call-outs and the 02/07 receipt, then read his account back. Close by confirming his 03/05 consult and his transport after 03/19. Then hand in a privileged GIRP note in Case Notes and a dated task for every corroborating document.",
   "ask": "Which reason was hardest to get, and what question finally got it?"
  },
  "model": {
   "say": "This is your run sheet for the call. The simulator screen across the left shows AI John Doe, recorded call, 03/04/2026, with the red recording dot and a transcript pane below. Under the transcript there's a meter counting your questions: open, closed and leading, and leading is in red. You want that one at zero. Over on the right are four empty reason slots, each with a space for a document beside it, and they only fill in as you actually surface them. Underneath sits a red warning: a suggested reason earns a yes, not a fact. Reasons are earned by questions. You never supply them.",
   "ask": "What happens to the three hidden reasons if you ask \"Was it the car?\" two minutes in?"
  },
  "check": {
   "say": "Check the call and the note before you log. Did the recording start with 03/04/2026, everyone on the call, your role, his spoken consent and privacy confirmed? Was your first question open, covering 02/06 to 02/20, with zero leading questions? You need all four reasons in his words: no transport, with the Civic towed, Kevin Alvarez's Escape in the shop and no rental until 02/18/2026; thinking it was soreness, treated with ibuprofen and lidocaine patches; doubting his Peach State coverage and not knowing PIP existed; and the numbness from 02/18, working two shifts, then urgent care on his first day off. Did you surface the texts, the Northgate call-outs and the receipt? And grade your GIRP note as hard as the call: his words in quotation marks, a dated plan, labelled privileged.",
   "ask": "Does your GIRP note record an intervention and a plan, or only how John Doe felt?"
  }
 },
 "d2m3-l2": {
  "why": {
   "say": "The adjuster says the gap proves John Doe healed. What would you collect? Call it out and I'll write it up. Good. Now let's sort that list into two boxes. Remember the rule: the only gap explanation that holds up against adjusters is John Doe's own factual explanation, backed by written documents you can check. Around it, records made at the time do the rest: provider notes that place onset at the collision, histories that agree, the EMS report and the work records, and later a causation opinion Atty. Thorne requests. Anything in the other box, a record made to order, destroys the very case it was meant to save.",
   "ask": "Which item on our list would an adjuster find hardest to argue with, and why?"
  },
  "theory": {
   "say": "You need to understand the why behind the paperwork, and here it is: continuity is proved by what the record already shows, never by what it's asked to say. Continuity of care is an unbroken path along the Standard Treatment Map, each step following from the last, and that chain is exactly what an adjuster tests. A Treatment Gap is any break in it, before the first treatment or midstream, and adjusters read it as minor, healed or unrelated. Records made at the time, written by EMS, providers and employers as things happened, are your strongest proof, because nobody wrote them for the claim. And consistent histories, repeating the same mechanism, onset and body region across charts, are what make continuity believable.",
   "ask": "Who on John Doe's file wrote something down about his neck before anyone thought about a claim?"
  },
  "theory2": {
   "say": "Four more ideas. A causation opinion is a treating doctor's opinion linking the injury to the collision. It's the bridge across a gap, and Atty. Thorne requests it. Record integrity means a record changes only by its author's dated addendum. Altering one can be evidence tampering or fraud. Excuse notes prove only what their author saw or ordered at a visit, so days nobody examined him need other proof. And generic notes, ones that don't tie the complaints to the collision, weaken causation. Under A-C-T, those get flagged to Atty. Thorne. You don't fix them yourself.",
   "ask": "What proves John Doe couldn't work 02/09 through 02/13, when no doctor saw him?"
  },
  "frame": {
   "say": "These are the treatment red flags, and for each one there's a reason the defense loves it. In physical therapy, watch for more than 12 sessions with no gain and no specialist or imaging suggested, which reads as a stalled plan or over-treatment. Passive care only, heat packs, TENS and massage with no active exercise, is feel-good care adjusters discount. Two or more missed appointments let the defense say the injury wasn't serious enough to treat. Surgery recommended before PT or injections, outside an emergency, invites a reasonable-and-necessary challenge. In pain management, an opioid, a muscle relaxant and a sedative together, with doses rising and the diagnosis unchanged, is a safety risk. And in records, left and right switched, or notes about life stress instead of the collision, weaken both credibility and causation.",
   "ask": "Which of these red flags do you see on John Doe's file right now?"
  },
  "rules": {
   "say": "Continuity is proved by records made at the time, then by a doctor's opinion that reads them, and never by explanations made to order. Read every history for mechanism, the collision, onset on 02/06/2026, and region, the neck and right arm, since the 2021 visits were low back. If the PT notes and Dr. Reyes disagree, flag it to Atty. Thorne that day. Never ask a provider to change, back-date or add to a record, and never order an excuse note. For 02/09 to 02/13, Northgate's Attendance Record is the proof. The EMS report bridges day zero, so record \"declined transport\" exactly as written. Keep the 02/07/2026 Riverton Drug receipt and the full text thread to Margaret Doe. A causation opinion is Atty. Thorne's request; you assemble and track, never draft. Tell providers scheduling facts only, and never hide an interruption.",
   "ask": "Riverton's front desk offers to add a line saying the pain began at the crash. What do you say, and who do you tell?"
  },
  "model": {
   "say": "This is a compare board, and the heading says it all: made at the time versus made to order. On the left, under a green rule, is what counts, each document with its date: the 02/06 EMS report, the 02/07 receipt, the 02/09 to 02/13 call-outs, the 02/20 urgent care note and the 06/19 Causation Letter. On the right, in red, is what never happens, every item struck through. Now look along the bottom. There's a timeline from 02/06 to 06/19 with the left card's documents pinned onto it, so you can see the proof was being laid down while the gap was actually happening. That's the point. Timing is what makes a document believable.",
   "ask": "Why does the 06/19 Causation Letter belong in the left column, even though it came months later?"
  },
  "job": {
   "say": "Here's the rhythm on the job. A provider record arrives, and you compare its mechanism, onset date and body region with the other histories on the treatment timeline. Either it's logged consistent, or it's flagged with the conflicting line quoted. If one history conflicts with another provider's, you flag it to Atty. Thorne through Tasks that same day, and you don't contact the provider about the wording or request a change. When Atty. Thorne decides to seek a causation opinion, you assemble the records for his letter and docket the follow-up, so it goes under his signature with the date on the calendar. And when a work or excuse note arrives, you check the signer, the date and the covered days against the visit record, flagging any mismatch.",
   "ask": "Why shouldn't you call the provider yourself to sort out a conflicting history?"
  },
  "dodont": {
   "say": "Let's play 3 Clues, 1 Rule. One clue at a time, and the moment you know, call Do or Don't and name the rule. The good habits are collecting what already exists before asking for anything new, quoting records exactly, flagging conflicting statements rather than fixing them, and keeping every interruption visible on the timeline with its dates. The traps include asking a provider to \"clarify\" a note in a way that tells them what to write, and leaving the gap off the timeline and hoping nobody notices. And here's one that catches people. A stronger note isn't always better. A note that shows up after the firm asked for it, saying exactly what the firm needed, is the weakest document in the file.",
   "ask": "Why would your fingerprints on Dr. Reyes's wording make her letter worthless?"
  }
 },
 "d2m3-a2": {
  "case": {
   "say": "I'm putting the adjuster's four arguments on the board: not serious, recovered early, treatment unnecessary, another cause. Your record is going to answer each one with a document, not a sentence. Here's what landed on 06/22/2026. John Doe reached MMI on 06/12/2026, and Dr. Alana Reyes's Causation Letter of 06/19/2026 is in. She says delayed presentation is clinically consistent with a disc injury whose radicular symptoms evolve over days to weeks, and that the injury was more likely than not caused by the collision. Atty. Thorne wants the Gap Explanation Record before the pre-demand session, with both interruptions at exact dates, every reason beside its dated document, \"account only\" where there isn't one, and a defense-eye pass first.",
   "ask": "Which of the adjuster's four arguments does Dr. Reyes's letter answer most directly?"
  },
  "task": {
   "say": "You'll build John Doe's Gap Explanation Record in the CMS Case File. It covers both interruptions with exact dates: the 14-day gap, 02/06 to 02/20/2026, and the 19-day disruption, 04/02 to 04/21/2026. Pair every reason with the dated document that backs it up, and mark any reason with no independent document as \"account only\". Cite the complaints before and after each interruption, and the firm's follow-up during the disruption. Write facts and citations only, so no argument, no valuation, and nothing quoted from the privileged call. Run your defense-eye pass, then route it to Atty. Thorne through Tasks. What you hand in is a routed record, ready for him to decide how it's used in the demand.",
   "ask": "Which reason on this file has the weakest document, and what do you do about it?"
  },
  "model": {
   "say": "Here's the shape the record takes. It's one CMS card, Gap Explanation Record, John Doe, split into two bands of equal weight. The top band is the 14-day gap, 02/06 to 02/20/2026. The bottom band is the 19-day disruption, 04/02 to 04/21/2026. Each band has three columns: the reason, the corroborating document and the date. Any row that rests only on John's word gets a grey \"account only\" tag, and down in the corner is the control to route it to Atty. Thorne. Notice that the second interruption gets exactly the same room as the first. Every reason sits beside its proof, in both bands.",
   "ask": "Why do you think the 19-day band is drawn exactly as big as the 14-day one?"
  },
  "check": {
   "say": "Now check your record. The 14-day gap runs 02/06 to 02/20/2026, and the 19-day disruption runs 04/02 to 04/21/2026, with missed visits on 04/03, 04/07, 04/09 and 04/14. For no transportation, you've got the tow record and Keystone's rental from 02/18/2026, with Kevin Alvarez's Escape in the shop marked account only. For expecting it to pass, there's the 02/07/2026 Riverton Drug receipt and the texts to Margaret Doe. The cost worry gets Peach State's 02/01/2026 eligibility, with the worry itself account only. The urgent-care note is quoted exactly. Did you show the firm's follow-up from 04/08? And don't stop at the 14-day gap. The 19-day disruption needs the same record: his reasons, each beside its document. Keep the work-product layer in the CMS, and keep the privileged call out of everything.",
   "ask": "What's the difference between this internal record and a gap timeline that goes to Keystone?"
  }
 },
 "d2m3-kc": {
  "questions": {
   "say": "Before the written check, let's do question 3 out loud. I'll be John Doe, and one of you is the Case Manager. I'm going to ask you, \"Is this gap going to wreck my case?\" and if I hear \"don't worry\", I'm stopping us right there. Then write your answers from this file, in your own words. Name the four reasons for the 14-day gap, each with its corroborating document and date. Rewrite \"Was it because you had no car?\" so it surfaces the same reason without suggesting it, and explain what the leading version costs. Question 2 matters most here, so take your time with it.",
   "ask": "Who wants to be the Case Manager first while I play John Doe?"
  },
  "summary": {
   "say": "Time for your Self-Summary. Same date, 04/08/2026. Riverton Spine & Rehab says John Doe has missed two visits, Keystone ended Margaret's rental on 03/19, his carpool ended 04/01, and Dana Whitfield wants a Recorded Statement from him. What do you do first, second and third, and what does each step protect? While you're thinking about records, here's something to chew on. Why is a provider's offer to add a line to a chart more dangerous than a missing note? A missing note is a weakness. An altered one is a credibility collapse, and possibly a fraud question.",
   "ask": "Why is a provider's offer to change a record more dangerous than a note that's simply missing?"
  },
  "scale": {
   "say": "Last up is the Skill Scale. Give yourself a one to five on each competency and submit it for review. I'll compare each rating with your score and talk through any big gap with you. And remember UPL is a gate here too. A strong score doesn't survive a coached answer or a requested change to a record. If you couldn't rewrite that leading question cleanly, be honest about it; it just means another round in the simulator.",
   "ask": "Which skill from today would you most want another run at in the simulator?"
  }
 },
 "d2m4-l1": {
  "why": {
   "say": "The demand goes out later today, but what it can claim gets decided right here. Pre-demand is where most of a file's value is won or lost, because The demands that follow can only spend what this audit proves. One duplicate line or one unchecked limit is Keystone's easy out. Now try this arithmetic. There's {{openLiens}} in liens waiting behind a $10,000 BI limit. Take a moment and work out what's left before John Doe sees anything from that layer. That's why every dollar in this audit has to be right.",
   "ask": "With {{openLiens}} in liens behind a $10,000 BI limit, how much of that layer is left?"
  },
  "theory": {
   "say": "Think of the full pre-demand audit as the final stress test, the point where we stop collecting information and start using it, leaving the defense zero easy outs. It starts with the trinity of case alignment: narrative, physicality and medicals must all agree, and if one's out of line, the value collapses. Maximum Medical Improvement is the provider's finding that care has plateaued. The incurred Specials are complete, and the audit can begin. Special damages are Medical Bills plus lost wages plus Property Damage, the provable dollar loss, and every line needs a document. And the medical and billing audit runs three passes, chronology for gaps, coding for duplicates and prior history for pre-existing conditions, so we find the weak spots first.",
   "ask": "Which of these audit ideas is new to you, and which part of John Doe's file would it test first?"
  },
  "theory2": {
   "say": "Four more pieces. Liens and subrogation come first. Health Plans, government payers and LOP providers may all claim repayment from the recovery, and every lien shrinks his net. The Property Damage deep dive looks at photos of the point of impact, the estimate against the final bill and any supplements, because Property Damage proves the force behind the injury. The defense-eye audit is reading the file the way the adjuster will, looking at social media, a minor-impact label and the venue, and naming each value killer. And policy-limits targets are the verified limits in the order they open. That's what each policy can pay, which isn't the same thing as what the claim's worth.",
   "ask": "What on John Doe's file would an adjuster point to for a minor-impact argument?"
  },
  "frame": {
   "say": "This is the Master Audit Checklist. On the financial side you've got special damages, meaning Medical Bills, lost wages and Property Damage, every line documented. Lost wages need the employer's wage letter plus a provider's work note, and without both they're usually rejected. Then lien resolution, covering every subrogation interest, whether statutory, Health Plan or a consensual LOP. For liability proof, there's the final report, witness contact and any drift in their statements, and whether the physics is even possible. The Property Damage deep dive checks that the point of impact is clear and that supplements show hidden structural damage. And medical and billing gets the chronology with every gap explained, coding with no duplicates, and five to ten years of history.",
   "ask": "Which line of this checklist do you think is weakest on John Doe's file today?"
  },
  "rules": {
   "say": "Who decides John reached MMI? Not you, and not John. It's Lakeside Orthopedics, recorded from its 06/12/2026 note with the future-care plan. Audit for verification, valuation, risk and compliance, with the SOL of 02/06/2028 docketed. The Civic runs on its own Keystone PD claim, so his BI Specials are medical plus wages. Three passes: chronology for the 14 days and the 19-day disruption, coding for duplicates, and prior history, the 2021 low-back visits. Show billed beside paid, because that choice is Atty. Thorne's. Northgate verifies 9 shifts at 8 hours and $22.00, so $1,584.00, and flag the five shifts with no note. The $3,400 to $6,800 in future injections stays out of the total. Register every lien, including Peach State's $1,860.00. {{specials}} already exceeds the $10,000 limit. You audit, total and flag; you don't value the case.",
   "ask": "Who decides that John Doe reached MMI, and where do you record it from?"
  },
  "model": {
   "say": "Read this one left to right. First there's a gate, MMI on 06/12/2026, with a green tick. Nothing enters the ledger until that's passed. In the centre is the ledger itself. See the Riverton Spine & Rehab row: $6,290.00 is struck through in red and replaced by $6,105.00, with a badge flagging a $185.00 duplicate on 05/04/2026. That's what the coding pass catches. Underneath is the sum, {{medicalAudited}} in medicals plus $1,584.00 in wages, which gives {{specials}}. The future medical card sits deliberately outside the frame, in the narrative. On the right are the targets in the order they open: $10,000 BI, $20,000 Host UM and $10,000 Relative UM, each with its source.",
   "ask": "What would Keystone have done with that $185.00 duplicate if we hadn't caught it?"
  },
  "job": {
   "say": "The story starts on 06/12/2026, when the MMI note arrives. You record MMI and the future-care plan on the treatment timeline and open the pre-demand audit as a task with an owner and a date. As the final bills and records come in, you build the Specials ledger and reconcile it against the chronology until every billed date matches a visit and the medical total is {{medicalAudited}}. Once the ledger's reconciled, you register every lien and record billed beside paid in the Liens and the Net Sheet's Lien Tracker. That means $1,860.00 and {{spineRehabOwed}} are listed and the billed-versus-paid question is routed to Atty. Thorne. Finally, before the ask, you re-verify each limit in the Coverage Matrix: $10,000, then $20,000, then $10,000, $40,000 in all, each with its written source.",
   "ask": "Why re-verify the limits now, when the Coverage Matrix was confirmed weeks ago?"
  },
  "dodont": {
   "say": "Let's play 3 Clues, 1 Rule. I'll reveal the clues one at a time; call Do or Don't and name the rule as soon as you see it. The good habits are stress-testing the file before the defense does, locking in total damages and then protecting them by finding every lien before the demand, and recording the source of every figure so Atty. Thorne can check any line in seconds. The traps are sending the demand and hoping nobody checks the math, padding the Specials with future care, and finding a lien after the release is signed. Watch billed versus paid, too. Picking a column yourself or hiding the paid one are both wrong, so show both and route the choice.",
   "ask": "Why doesn't the Civic's repair ever count toward the $40,000 or the BI Specials?"
  }
 },
 "d2m4-a1": {
  "case": {
   "say": "This landed on the file on 07/01/2026: billing complete, Special Damages Audit due, LSH-2026-MVA-770412. Lakeside Orthopedics declared MMI on 06/12/2026, and Dr. Reyes's Causation Letter arrived 06/19/2026. Every bill's in. There's Riverton Urgent Care at $685.00, Riverton Spine & Rehab's statement of 34 lines at $185.00, or $6,290.00, with its visit notes, three Lakeside Orthopedics visits at $640.00, Summit Imaging at $2,395.00, Crescent Pain & Spine at $3,400.00, which Peach State paid $1,860.00 on, and Riverton Drug at $312.40. Northgate's HR letter of 06/30/2026 verifies 9 missed shifts at 8 hours times $22.00. I'm handing you the bills, not the totals. Go ahead and add them up.",
   "ask": "Before you total Riverton Spine & Rehab's statement, how many visits do its notes actually show?"
  },
  "task": {
   "say": "You'll build John Doe's audited Specials ledger in the CMS Financial Ledger. Enter each provider's charges with dates, the billed amount and who paid. Reconcile Riverton Spine & Rehab's lines against its visit notes, and take out any line no visit supports. Total the medical, add the verified wages and show billed beside paid. Future medical goes in the narrative, not the ledger. List every lien with its amount in Liens and the Lien Tracker, and re-verify the three policy-limits targets in order on the Insurance tab. You'll hand in an audited ledger, a lien list, the targets in order, and a flag list routed to Atty. Thorne, and part of your grade is what you flag rather than decide.",
   "ask": "Peach State paid $1,860.00 on a $3,400.00 bill. Which number goes in the demand?"
  },
  "check": {
   "say": "Check your ledger to the cent. Riverton Spine & Rehab's notes show 33 visits against 34 lines, so the 05/04/2026 duplicate comes out and $6,290.00 becomes $6,105.00, with a corrected statement requested. Your medical total should be {{medicalAudited}}, down from $15,002.40. Wages are 9 shifts at 8 hours and $22.00, so $1,584.00, which gives total Specials of {{specials}}. If you've got any other number, a line is wrong. Here's the subtle one. Five of those nine shifts, 02/09 to 02/13/2026, fall before any provider saw John. Flag them with Northgate's Attendance Record; never drop them. Billed sits beside paid, and the choice goes to Atty. Thorne. Future medical stays in the narrative, and the targets run $10,000, $20,000, $10,000.",
   "ask": "Why flag those five early shifts instead of quietly dropping them from the wage claim?"
  }
 },
 "d2m4-l2": {
  "why": {
   "say": "Let me read you two first lines. One: \"On 02/06/2026 John Doe was a front-seat passenger…\" Two: \"John Doe is at MMI with {{specials}} in audited Specials against a $10,000 BI limit, and I need your decisions.\" Which of those can Atty. Thorne actually act on? Right, the second. He makes the strategy calls from your brief, and that's why its shape matters so much. A brief that opens with the chronology buries the decision. One that hides a risk misleads him. And one that makes the call for him crosses a line that isn't yours to cross.",
   "ask": "Which of those two opening lines could Atty. Thorne act on in the first ten seconds?"
  },
  "theory": {
   "say": "A pre-demand audit is the file's sanity check, and the strategy brief carries its findings, not conclusions, to Atty. Thorne, who makes every call. The brief reports on each of the core audit objectives: verification, valuation, risk and compliance. It flags statement drift, which is a witness whose story changes between tellings, because drift is an opening for the defense. It names the value killers the defense-eye audit turned up, such as social media, a minor-impact label or the venue, and counsel weighs each one. And it always carries the lien totals, because when the math is wrong or a lien gets missed, you end up with a short-funded settlement where the client takes home nothing.",
   "ask": "What would a short-funded settlement mean for John Doe, in plain terms?"
  },
  "frame": {
   "say": "The brief rests on the four core objectives of the pre-demand audit. Verification asks whether the facts match the physical evidence, meaning the photos, the Police Report and the scene. Valuation asks whether the damages are calculated accurately, with the bills, the wages and the future care each justified by a document. Risk assessment covers the weak spots the defense will argue: comparative negligence, social media, a minor-impact label, venue. And compliance means every statutory requirement is met before the demand issues, the Statute of Limitations first. If you can report a finding under each of those four, you're ready to brief.",
   "ask": "Under which of these four objectives does John Doe's file still have an open question?"
  },
  "rules": {
   "say": "Lead with the bottom line in one sentence: MMI 06/12/2026, {{specials}} in audited Specials against a $10,000 BI limit, decisions needed before any demand is drafted. Next come the facts, audited and sourced, with the narrative, physicality and medicals agreeing. That includes report RPD-26-018842, Smith cited for failure to stop, Ruth Calloway checked for drift, and the doorbell video. On force, John's door was struck at about 28 mph, and the Civic went from $6,940.00 to $9,255.00 with a $2,315.00 A-pillar supplement. Then the risks, each paired with its answering document. Which one would you be tempted to leave out? Usually it's the 2021 low-back visits, and Keystone will find them. Then decisions as questions, and options with consequences. Record his decisions the same day. Saying Specials exceed the limit is a finding, but \"we should demand limits\" is his call.",
   "ask": "Which risk would you be tempted to leave out of the brief, and what happens when Keystone finds it first?"
  },
  "model": {
   "say": "Here's the brief, laid out in the order counsel reads it. It's one page with five bands. First is the bottom line, in navy, one line, the biggest type on the page. Second is the audited facts, split into narrative, physicality and medicals, each with a green tick. Third is the risks, in red: the 14-Day Gap, the disruption, the 2021 low back and that \"degenerative\" read, each one tethered to the document that answers it. Fourth is the decisions needed, every item written as a question. Fifth is the options with their consequences. And down the right edge runs a rail that says Atty. Elijah Thorne decides, ending in a dated, tasked decision record.",
   "ask": "Why is every item in the decisions band written as a question rather than a recommendation?"
  },
  "job": {
   "say": "So the audit's complete. You draft the one-page memo and the exhibit index in the Action Plan Editor, five sections in protocol order, with every exhibit label matching its page. Once the brief's ready, you book the strategy session on the CMS calendar and send the memo ahead through the Email Workspace, and the session happens before any demand is drafted. After the session, you record each decision in counsel's own words in Case Notes and open its tasks, each one dated, attributed to Atty. Thorne, with an owner and a due date. And since those decisions change the plan, you mark the Case Plan superseded and re-route the new version the same day, keeping the approved one.",
   "ask": "Why re-route the Case Plan as a new version instead of just editing the old one?"
  },
  "dodont": {
   "say": "Let's play 3 Clues, 1 Rule. Three clues, revealed one at a time. As soon as you know, call Do or Don't and name the rule. On the good side, you bring the bad facts yourself, so counsel never meets a risk first in the adjuster's letter. You find discrepancies before the defense does. You check John's public social media, and you never suggest deleting a post. You use the structural supplement to answer a minor-impact label, and you leave venue to Atty. Thorne. On the trap side, there's a three-page memo, an exhibit index with mismatched page numbers, and briefing the initial PD estimate instead of the final figure. And watch the recommend line. Certified mail with return receipt is operational, but \"we should demand limits\" isn't yours to say.",
   "ask": "Is \"send it certified mail with return receipt and email\" a recommendation you're allowed to make?"
  }
 },
 "d2m4-a2": {
  "case": {
   "say": "It's 07/08/2026, and this is Atty. Thorne's note. He's read your audit, and the strategy session on John Doe is today at 2:00 p.m. in his office. Bottom line first, he says. Expect him to push the way Keystone will, on low speed, the 14 days and the \"degenerative\" read. Bring the facts, the documents and the operational options, and remember the decisions on the demand are his. Your audit's done: MMI 06/12/2026, Specials of {{specials}}, liens of $1,860.00 and {{spineRehabOwed}}, and targets of $10,000 BI, $20,000 Host UM and $10,000 Relative UM. Fair warning, he'll interrupt you inside the first minute.",
   "ask": "If he says \"Keystone will call this low-speed,\" what objective fact do you answer with first?"
  },
  "task": {
   "say": "You'll run the pre-demand strategy session with AI Atty. Elijah Thorne in the Call Simulator. Brief him in protocol order. Start with the bottom line, MMI, {{specials}} in Specials and the $10,000 BI limit, then the audited facts, the risks with their answering documents, the decisions he has to make, and the operational consequences of each option. Meet every challenge with dated documents, not adjectives; \"it was a serious crash\" doesn't answer anything. Recommend only on operations, and get his decisions on the demand, the gap, the UM consents and billed versus paid. Read each decision back before you close. Afterwards, record them in Case Notes, open a task for each in Tasks, and re-route the Case Plan.",
   "ask": "Observers, what did Atty. Thorne decide, in his own words?"
  },
  "check": {
   "say": "Grade your decision record, not the conversation. If a decision isn't dated, attributed and tasked, the session didn't happen. Did you lead with the bottom line, with the figures exact? Did you meet the low-speed challenge with objective facts? That's Smith running the stop sign and getting cited, John's door struck at about 28 mph, the $2,315.00 A-pillar supplement, and the C5-C6 herniation on the 03/13/2026 MRI. Did you meet the gap with documents rather than an apology, and raise the 2021 visits and the \"degenerative\" read unprompted? His decisions should be recorded: the time-limited BI demand to Dana Whitfield, served 07/20/2026, the gap addressed up front, the UM consent plan, and billed versus paid. And when he asked what you think we should demand, did you give him the inputs and hand the figure back?",
   "ask": "When AI Atty. Thorne asked what you'd demand, what exactly did you say back?"
  }
 },
 "d2m4-kc": {
  "questions": {
   "say": "Look at the gate bar. This module turns the last two chips green: Specials audited at {{specials}}, and strategy approved by Atty. Thorne. The demand doesn't go out until all six are green. Now answer from this file, in your own words, under each question. Total John Doe's Specials from the bills, showing the Riverton Spine & Rehab correction, the medical total, the wage arithmetic and the final figure. Say who determines MMI, when John Doe's was, why the demand waits for it, and where the $3,400 to $6,800 in future medical goes. And name the four audit objectives, with one finding each produced on this file.",
   "ask": "Which two chips on the gate bar does this module turn green?"
  },
  "summary": {
   "say": "Now your Self-Summary, in your own words. The scenario takes us back to 04/08/2026. Riverton Spine & Rehab reports two missed visits, Keystone ended Margaret's rental on 03/19, his carpool ended 04/01, and Dana Whitfield has asked him for a Recorded Statement. Tell me what you do first, second and third, and what each one protects. And while you write, think about this. If you found an error in an exhibit right before the 07/20/2026 service date, the right move is to stop the package, fix every total that cites it, and tell Atty. Thorne before anything goes out. Serving a known error to make the date is the failure.",
   "ask": "Which number on this file would you defend line by line to Dana Whitfield, and where does every cent come from?"
  },
  "scale": {
   "say": "And to close out the pre-demand audit, your Skill Scale. Rate each competency from one to five and submit it for review. I'll put your self-rating beside your score, and where they're far apart, we'll sit down and talk it through. Be especially honest on the billed-versus-paid question. If any of your answers today picked a column for the demand, that loses the UPL marks, however good the rest of the work was.",
   "ask": "Looking back over the pre-demand audit, which competency feels most solid to you now?"
  }
 },
 "d3m1-l1": {
  "why": {
   "say": "Let me put two numbers on the board. John Doe's Specials alone come to {{specials}}. Robert Smith carries $10,000 with Keystone. So what makes Keystone pay all of it, inside 30 days? Hold that thought, because the answer is a Time-Limited Demand for the limits, and it forces Keystone to decide on the record. Here's the catch, though. If the demand is vague, over limits, thin or unproven, a refusal costs Keystone nothing. If it's clear, reasonable, within limits, documented and timed, an unreasonable refusal can matter. That's five elements, and we're going to reveal them one at a time today.",
   "ask": "What makes Keystone pay all $10,000 of it, inside 30 days?"
  },
  "map": {
   "say": "Before the mechanics, here's the road for the Time-Limited Demand. First, confirm the foundation: the statute of limitations, liability and coverage, each from its document. Second, a demand within limits, with clear terms: $10,000, who and what is released, and how to accept. Third, a reasonable window, with conditions Keystone can actually meet, and thirty days. Fourth, a package complete enough to evaluate inside that window. And fifth, service by certified mail and email, with the deadline docketed from receipt. Atty. Thorne decides every term; you make sure each step is done and proven."
  },
  "theory": {
   "say": "Before we get to the five elements, I want you to hear this: a demand isn't a request for money. It's the presentation of a debt owed. And it stands on three pillars, the statute of limitations, the liability framework and the coverage analysis. Know why the paperwork exists and you'll build it right. The Time-Limited Demand is a within-limits demand with a stated window, which forces a decision on the record. Then there's the Why Factor: every bill carries the reason the treatment was necessary, so the adjuster evaluates a documented recovery, not a pile of invoices. And before anything goes out, we do the Final Scrub for the usual adjuster traps, like billing overlaps, an unexplained pre-existing condition or an unverified balance.",
   "ask": "Which of these four have you run into before, and where would it turn up on John Doe's file?"
  },
  "frame": {
   "say": "Three best practices sit under every demand we send. First, the 30-Day Rule. Once the client reaches MMI, the demand targets MMI plus 30 days. John Doe reached MMI on 06/12/2026, so the target was 07/12/2026. Any later date belongs to Atty. Thorne, with his reason recorded, and ours went out on 07/20/2026. Second, photo impact. We lead with the most graphic image on file, Property Damage or injury, because it sets the tone before the adjuster reads a word. Third, the Why Factor again: every bill in the demand carries why that treatment was necessary for his recovery.",
   "ask": "Where is John Doe against the 30-Day Rule, and whose call was the 07/20/2026 service date?"
  },
  "rules": {
   "say": "Here are the rules, and where your role stops. Confirm the foundation first: the SOL docketed for 02/06/2028, liability from Smith's stop-sign citation, Ruth Calloway and the doorbell video, and coverage from Keystone's Dec Page showing $10,000 BI. The demand is for exactly that $10,000. Every term has to be acceptable as written: Smith and Keystone released, for the BI claim only, plus Smith's affidavit of no other insurance. Ask only what Keystone can deliver in 30 days, with the Big Four complete. The letter names what starts the clock, delivery of the certified mailing, and we serve certified with return receipt and by email. The gap goes on page one, and causation leads with the 03/13/2026 MRI. Bad faith is a legal conclusion, and it's Atty. Thorne's. You build, audit, serve and prove delivery. You never set terms, grant extensions or value the claim.",
   "ask": "The email reached Dana Whitfield on 07/20 and the certified mail on 07/22. When does the window close, and how would Keystone know?"
  },
  "model": {
   "say": "This is John Doe's demand, with the five elements pinned to it. Badge one is the $10,000 amount, within limits. Two is the release and affidavit terms, which are clear. Three is the conditions and the 30 days to meet them, so it's reasonable. Four is the enclosure list, documented. Five is the deadline and delivery lines, timed. Now look at the clock bar on the right: served 07/20/2026, received 07/22/2026 on the return receipt, and the window closes 08/21/2026. That's your answer from a minute ago, and Keystone knows it because the letter says the clock runs from delivery of the certified mailing. Notice the red warning up top, too: an ambiguous term is an escape hatch. Each badge is a door Keystone could refuse through, and this demand shuts all five.",
   "ask": "Which of the five doors do you think Keystone would try first if we'd left it open?"
  },
  "job": {
   "say": "Let's follow this through on the job. It starts when MMI is declared on 06/12/2026. You docket MMI plus 30 and open the Demand Package task in CMS. That lands on 07/12/2026, a Sunday, and since it's an internal target, we work it early, on Friday 07/10. Legal deadlines counted forward roll to the next business day instead, and a later service date gets recorded as Atty. Thorne's, with his reason. When he approves the terms, you record them exactly in Case Notes before you draft a word. When the return receipt shows delivery on 07/22/2026, you docket 08/21/2026 from that receipt date, with reminders. And if Keystone writes or calls before the deadline, you log it word for word and route it to Atty. Thorne the same day. You change nothing on terms or time."
  },
  "dodont": {
   "say": "Now for a game I call Three Clues, One Rule. I'll reveal three clues about something a Case Manager did on this demand. You call it, Do or Don't, and then you name the rule behind it. Here's what's in play. Docketing from the return receipt date, never the mailing date. Leading with the value-drivers: the MRI herniation, the injection, the residual right-arm paresthesia at MMI, clear liability. Remembering the window is for acceptance, not payment. And the traps: a demand with no stated deadline, a timeline that leaves the gap out, a demand sent before MMI. One more thing. If I hear anybody call this a bad-faith letter, I'm stopping you. It's a Time-Limited Demand, and whether a refusal is bad faith is Atty. Thorne's legal conclusion.",
   "ask": "What makes a gap explanation hold up with an adjuster, and who supplies it?"
  }
 },
 "d3m1-a1": {
  "case": {
   "say": "Here's what just landed on the file. It's Monday, 07/20/2026, and Atty. Thorne writes that the Keystone BI demand gets a final audit and goes out today. The terms are approved for Dana Whitfield at Keystone Mutual, claim KM-26-440871: the $10,000 limits, a Limited Release of Robert Smith and Keystone only, Smith's affidavit of no other insurance, and 30 days from receipt. MMI was 06/12/2026, Dr. Reyes's Causation Letter and the Gap Explanation Record are on file, and the pre-demand audit put the Specials at {{specials}}. I'm handing you the demand specialist's draft. Fair warning, it has problems. Audit it against the Big Four and the Final Scrub, log every deficiency as a task, and bring it back for his signature. Nobody mails anything until the audit is logged.",
   "ask": "Before you open the draft, what are the first three things you'll check?"
  },
  "task": {
   "say": "Here's your job. Audit the draft against the Big Four and the Final Scrub in the Action Plan Editor, and log each deficiency as an assigned CMS task rather than fixing it quietly. Assemble the package with the gap answered on page one of the timeline. Once Atty. Thorne signs, serve Keystone by certified mail with return receipt and by email through the Email Workspace, and log both. When the return receipt comes back dated 07/22/2026, docket the acceptance deadline from it, with reminders. Then you'll take a live call from Dana Whitfield. Confirm receipt and the 08/21/2026 deadline as written, agree to no extension, log her requests in her exact words, and send nothing without approval. You'll hand in an audited, served demand with proof of delivery and 08/21/2026 docketed.",
   "ask": "Suppose Dana Whitfield emails on day 25 asking for two more weeks. Who answers?"
  },
  "audit": {
   "say": "Here's the enclosure set as the demand specialist built it, and here's your job: call every item. Keep it, replace it, pull it, add what's missing, or flag it for Atty. Thorne. Some of these are small and some of them cost John Doe real money. Exhibit E carries Riverton Spine and Rehab at six thousand two hundred and ninety dollars with the fourth of May billed twice, and Crescent's statement bills him fifteen hundred and forty dollars that an in-network provider can't bill him at all. Two things are missing that the letter leans on. When you hand it in you'll see the package as Atty. Thorne actually signed and served it on the twentieth of July, and you can mark your own audit against it.",
   "ask": "Which item in this set would you least want Dana Whitfield to find first?"
  },
  "check": {
   "say": "Before you log anything, check yourself. Is the amount $10,000, Keystone's BI limit per its 03/20/2026 Dec Page? Do the terms match Atty. Thorne's approval word for word? Are the Big Four complete, with Specials of {{specials}} and the Riverton Drug receipts counted once? Did your Final Scrub catch the 05/04/2026 duplicate, taking Riverton Spine & Rehab from $6,290.00 to $6,105.00? Is the gap answered on page one, and are the 2021 low-back visits disclosed as resolved, with no neck history? Disclosed and distinguished, never hidden. Every deficiency should be a dated, assigned task, it should be served 07/20 both ways, and 08/21/2026 docketed from the 07/22 receipt. If you counted from the mailing date, you had the right idea and the wrong day. Any extension request goes to Atty. Thorne the same day.",
   "ask": "If you docketed from the mailing date, what day did you land on, and why is it wrong?"
  }
 },
 "d3m1-l2": {
  "why": {
   "say": "I want to start with the net, not the gross, because BI alone leaves John Doe nothing. Take Keystone's $10,000, pull out the fee and costs, and you're at $6,179.92. His unreduced liens are {{openLiens}}. Do the subtraction and he walks away empty-handed. That's why the UM layers matter so much: they change his net. And here's the uncomfortable part. A technicality can lose them. A release signed too early. A consent nobody obtained. A UM demand sent before BI is exhausted. Any one of those puts a hole in his safety net. This lesson is about locking those escape hatches before Host UM and Relative UM open.",
   "ask": "If BI on its own leaves him nothing, what are the UM layers worth to John Doe?"
  },
  "theory": {
   "say": "Think of UM as the client's financial safety net. Once the at-fault policy is exhausted, first-party coverage makes up the difference, up to its limits. Four ideas hold it together. First, the net check: John Doe doesn't care about the gross, only what's left after fees and unreduced liens. Second, BI exhaustion: the at-fault carrier pays its full limit, and that pulls the contract trigger, so the UM claim becomes a second phase. Third, consent and subrogation waiver: the UM carrier consents and waives subrogation, or substitutes its own check, so the UM claim survives the BI release. And fourth, front-load the proof. The at-fault Dec Page, the signed release and the consents go up front, which strips away the technicality defense on page one.",
   "ask": "Have you seen a consent-to-settle request on a file before, and what happened when it was missing?"
  },
  "theory2": {
   "say": "Let's keep going, because a UM claim is a different animal. The UM carrier insures our client, so the claim shifts from third-party to first-party. It's a contract claim, and it's still adversarial. Don't forget that part. UM also doesn't simply pay its limit. It pays the gap between damages and what's already been collected. Then you need to know the policy's form. An offset policy subtracts the BI from its UM limit, while add-on or stacked coverage pays on top. And Relative UM sits as excess. It answers only above the primary layers, so the gap it pays starts right where BI and Host UM end.",
   "ask": "If Harbor Point were an offset policy, how much room would be left on its $20,000 after Keystone's $10,000?"
  },
  "frame": {
   "say": "Here's how the UM settlement actually gets calculated. Start with total case value, Medical Bills plus pain and suffering, as Atty. Thorne values them. That number is his, not ours. Subtract the BI settlement, the at-fault driver's maximum limit, which here is Keystone's full $10,000. What's left is the gap, and Harbor Point's Host UM covers it up to $20,000. Then comes Relative UM, as excess. Cardinal State answers only above BI and Host UM, so it picks up the gap above $30,000, up to its $10,000 limit. Stack it up and you can see how this file reaches $40,000, but only if the damages are proven above each layer.",
   "ask": "Where does John Doe sit on this ladder right now, and which layer is still waiting to open?"
  },
  "rules": {
   "say": "These are the rules, and here's where you stop. BI exhaustion comes first: Host UM opens once Keystone's $10,000 tender of 08/12/2026 is documented. Prove Keystone is all there is with its Dec Page and Smith's 08/10/2026 affidavit of no other insurance. The day after the tender, 08/13, the 30-Day Letters go to Harbor Point and Cardinal State asking each to consent and waive subrogation, or substitute its own check. Nothing goes to John Doe for signature until both consents are in writing, 08/24 and 08/26, and Atty. Thorne approves the release. Limit that release to Robert Smith, Keystone and the BI claim. Harbor Point confirmed add-on in writing on 03/02/2026; get the same in writing from Cardinal State. You prepare, track, catch and draft. You never interpret a policy or release for John Doe, or tell him to sign.",
   "ask": "Keystone's draft release is in your inbox and Dana Whitfield wants it back today. What's wrong with it?"
  },
  "model": {
   "say": "Picture this as a train line with six stations. One, the tender on 08/12. Two, the consent requests on 08/13. Three, the consents themselves, 08/24 and 08/26. Then comes that heavy orange gate: no release before both consents. Only after it do we reach four, the Limited Release on 08/28. Five, the UM demands on 08/31. Six, Keystone's check on 09/04. Above the rail is the ladder we're protecting: BI $10,000, Host UM $20,000 as add-on, Relative UM $10,000 as excess. And down in the corner, struck through, is the line from Keystone's 08/14 draft, “all other persons, firms, corporations and insurers.” That's the word you just went hunting for. The lesson of this slide is simple. Sequence is protection.",
   "ask": "What would have happened to the stack if station four had come before station three?"
  },
  "job": {
   "say": "Now let's see how that runs at your desk. Keystone tenders the $10,000 on 08/12/2026. That's your trigger to prepare the 30-Day Letters, the consent-to-settle requests, to both UM carriers for Atty. Thorne's signature, using the template in the Action Plan Editor, and to docket each window. Both go out 08/13 with the tender, the Dec Page and the affidavit. On 08/14, Keystone's draft release arrives. You compare who and what it releases against the approved terms, and you flag the overbreadth. That “all other insurers” language goes to Atty. Thorne as an escalated task, and nothing goes to John Doe to sign. Once both consents are in writing and the Limited Release is signed on 08/28, you open two tracked CMS tasks for the UM demands, each with its carrier, claim number and adjuster."
  },
  "dodont": {
   "say": "Time for Three Clues, One Rule. I'll reveal three clues, you call Do or Don't, and then you name the rule. The rules in play: exhaustion proof goes at the front of each UM package. The source of the add-on confirmation, Harbor Point's 03/02/2026 letter, goes on the Coverage Matrix. Cardinal State's form gets confirmed in writing too, so no anti-stacking clause caps John Doe at $20,000. And the traps: treating Harbor Point and Cardinal State as friendly, letting an “all other insurers” release reach the client, promising full limits early, celebrating $40,000 before the liens are reduced. One warning before we play. Consent isn't a courtesy. It protects the UM carrier's subrogation right, which is exactly why releasing Smith without it can cost the coverage.",
   "ask": "John Doe is their insured, so why are Harbor Point and Cardinal State now adversaries?"
  }
 },
 "d3m1-a2": {
  "case": {
   "say": "Look at the date first. It's Monday, 08/31/2026, and Keystone's check isn't here. Here's what landed from Atty. Thorne. BI is done: Keystone tendered $10,000 on 08/12 after Smith's affidavit of 08/10. Harbor Point consented on 08/24, Cardinal State on 08/26, and the Limited Release of Robert Smith and Keystone was signed 08/28. He wants the Host UM demand to Harbor Point for $20,000 and the Relative UM demand to Cardinal State for $10,000, as excess, with exhaustion on page one of each and the response deadline left blank for him. And remember, on 08/05 Keystone leaned on the 14-day gap and called the MRI degenerative. Expect the UM carriers to try the very same thing.",
   "ask": "With no check in hand today, what proves exhaustion?"
  },
  "task": {
   "say": "You're not starting from a blank page. The audit closed on 07/15, and Atty. Thorne assigned the UM demands to the Demand Desk; their drafts are in the file. Your job is QC. Host UM goes to Marcus Bell at Harbor Point, HP-26-7741, for the $20,000 limit; Relative UM goes to Teresa Okafor at Cardinal State, CS-26-20355, for $10,000 as excess over Host UM. Exhaustion is proven by the tender, the consents and the signed Limited Release, with the check copy to follow, and it belongs on page one of each. Check every figure against the audit, answer the gap and “degenerative” with the MRI, and hand in two QC'd drafts routed to Atty. Thorne.",
   "ask": "Why does Cardinal State's demand say excess?"
  },
  "check": {
   "say": "Check your two packages before you route them. Are they truly two, each complete on its own? Cardinal State gets the whole file, not a cross-reference to Harbor Point's. Is Relative UM framed as excess, claimed for damages above $30,000? Is exhaustion on page one of each: the 08/12 tender, Keystone's 03/20 Dec Page, Smith's 08/10 affidavit, the consents, the 08/28 release, and a task for the check copy? Are the 03/02 and 03/09 coverage letters in? Does your gap section answer “degenerative” with the radiologist's own words, “no significant degenerative change at the adjacent levels”? If it doesn't, you haven't learned from the BI round. Is there a two-page treatment summary instead of a record dump? And is the response deadline a marked blank for Atty. Thorne, with nothing served?",
   "ask": "Does Dr. Reyes's MMI note carry an impairment rating, and if not, what do you ask Atty. Thorne?"
  }
 },
 "d3m1-kc": {
  "questions": {
   "say": "This is your Learning Check for the demand module. The questions are on the screen, and your answers come from this file, in your own words, typed right under each question. State the BI demand's terms, how it was served and the date its window closed, and show me how you counted. Name the five elements, with this file's example of each, and tell me who decides bad faith. Then answer Keystone's degenerative and gap arguments with the documents, and say where each goes in the package. When you reach the pressure questions, I want the process, not the law. Use the file's own dates and figures, not general rules.",
   "ask": "Before you start, what does a UM carrier's consent actually protect?"
  },
  "summary": {
   "say": "Now the Self-Summary. In your own words, write what you learned serving John Doe's demands, the principles that make a demand hold, not the clicks. Then your strategy: with both UM drafts on Atty. Thorne's desk on 08/31/2026, what's your next action, and why that one? And name the one thing you're least confident about. Before anyone writes, look at the scenario on screen. Keystone's draft release arrives 08/14/2026 releasing all other insurers, Harbor Point hasn't answered the consent request, and Atty. Thorne is out until Monday. Let's talk it through together first.",
   "ask": "With Atty. Thorne out until Monday, what must not happen to Keystone's release before he's back?"
  },
  "scale": {
   "say": "Last step, the Skill Scale. Rate yourself 1 to 5 on each competency, from docketing a Time-Limited Demand from receipt all the way to holding the UPL boundary on terms, extensions and releases. Be honest with yourself. I'm going to compare your rating with your score, and a 5 on a block scored at 60 is a conversation, just like a 2 on a block you aced. And remember, UPL is a gate. A strong score doesn't survive an ethics breach. When you're done, submit it for review.",
   "ask": "Where's the widest gap between how you rated yourself and how you actually scored?"
  }
 },
 "d3m2-l1": {
  "why": {
   "say": "Let's start with the question Dana Whitfield is going to ask, not the one we'd like her to ask: “Why did he wait two weeks?” Answer me from documents only. No adjectives. Here's the reality of this file. Keystone won't argue the crash. Robert Smith was cited, and the doorbell camera caught him. So it'll argue the 14-Day Gap, it'll call the MRI degenerative, and it'll stall toward 08/21/2026. A Case Manager who has mapped both attacks, and the documents that answer them, before the first call turns every stall into a record. That's what today is about.",
   "ask": "“Why did he wait two weeks?” Which documents answer her, with no adjectives?"
  },
  "theory": {
   "say": "In personal injury, the demand letter is your opening move, and adjusters protect the carrier by undervaluing claims. So negotiation is prepared, never improvised. Four ideas carry it. The pitch: a demand that reads like a template gets treated like one, while a tailored presentation earns a real evaluation. Value drivers: the few facts that would scare a jury, because they create the carrier's risk, so every call leads with them. Anticipate the response: name your top two weaknesses before the adjuster does, and have the documents in hand. And the professional pause. After a low number, stay quiet. Silence shifts the burden back, and the adjuster has to justify the figure with data.",
   "ask": "Who here has used a professional pause on a call, and how long could you hold the silence?"
  },
  "frame": {
   "say": "Here's the battle map, four steps, built before any phone rings. Step one, create a Net Sheet. Total the liens, costs and attorney's fee, because below that line the client receives $0. Step two, identify the value drivers, three facts that would scare a jury, and every call leads with them. Step three, anticipate the adjuster's response: name your top two weaknesses and the documents that justify them. Step four, prepare the rebuttal so it's ready before they ever bring it up. On John Doe's file, the weaknesses aren't a mystery. It's the gap and the degenerative MRI, every single time.",
   "ask": "On John Doe's file, which three facts would scare a jury the most?"
  },
  "rules": {
   "say": "These are the rules, and where your authority ends. The net floor is liens plus costs plus fee. {{openLiens}} plus $486.75 is {{netFloorLiensAndCosts}}, and grossing that up for the one-third fee gives {{netFloor}}, which is above Keystone's whole $10,000 limit. Every layer matters. Lead with the value drivers: Smith on video with an independent witness, the C5-C6 herniation and injection, residual right-arm paresthesia at MMI. Anchor on {{specials}} in total Specials, never PIP's $5,000. Soft lead on the call, restate the demand and its 08/21/2026 deadline, then pause and ask for her data. Name every stall. Keystone's $3,500 is a counteroffer, logged in her exact words, and whether it ended the demand is Atty. Thorne's call. You present, ask, restate and relay. You never counter, move the number or the deadline, or tell John Doe what an offer's worth.",
   "ask": "If this file settled for Keystone's full $10,000 and nothing else, what would John Doe net?"
  },
  "model": {
   "say": "And the answer to that question, on unreduced liens, is $0. This is the battle map for Keystone, finished before the phone rings. Station one is the net floor, {{netFloor}} gross, with that red note reminding you Keystone's limit is only $10,000. Station two holds the value drivers. Station three is their top two attacks in red, the 14-day gap and the “degenerative” MRI. And station four answers each one with a source: the EMS report and the 06/19/2026 Causation Letter for the gap, and the Summit MRI of 03/13/2026 for degenerative. Up in the corner, the demand expires 08/21/2026. Every attack on this file has a document waiting for it before she dials.",
   "ask": "If she opens with the gap, which card on station four do you read from first?"
  },
  "job": {
   "say": "Here's how it plays out on the job. Keystone receives the demand on 07/22/2026, and that's your trigger to build the battle map and compute the net floor on the Net Sheet: {{netFloor}} gross on unreduced liens, with every attack matched to a dated document in Case Notes. When the adjuster calls with an offer, you soft-lead, pause, ask for her data and restate the approved demand. You'll practice exactly that in the Call Simulator against Dana Whitfield. No counter, terms and deadline unchanged. When the call ends, log the offer and her exact words in the Communications Log and report to Atty. Thorne that day. And if she stalls with “waiting on authority,” you name it and send a same-day email citing 08/21/2026. No open-ended callbacks."
  },
  "dodont": {
   "say": "Let's play Three Clues, One Rule. I'll reveal three clues, you call Do or Don't, and you name the rule. Here's the territory. Making the adjuster justify her number with data, and using silence after a low offer. Staying firm, factual and professional, because an angry call is a gift to the carrier. Personalizing every answer to John Doe's record. And the traps: softening the demand to seem reasonable, negotiating without knowing the net floor, anchoring on PIP's $5,000, Specials that don't reconcile to the ledger, accepting “I'll get back to you.” One thing I'll be listening for: nobody apologizes for the gap. It's already explained, by the EMS report, the call-outs, the receipt, the numbness and the Causation Letter. Keep your tone flat and factual.",
   "ask": "What's the difference between holding the demand and softening it to seem reasonable?"
  }
 },
 "d3m2-a1": {
  "case": {
   "say": "Here's what just landed, 08/05/2026, from Dana Whitfield on KM-26-440871. Keystone offers $3,500.00 to resolve the bodily injury claim. Her reasons: John Doe waited two weeks before seeking any treatment, and the MRI findings are degenerative in nature. She's calling this afternoon. Keep the facts in front of you. Keystone received the $10,000 Time-Limited Demand on 07/22, and acceptance runs to 08/21/2026. Atty. Thorne's written authority says restate the Limits Demand and the deadline, present the record, no counter, and report any offer to him the same day. Now imagine she opens like this: “He waited two weeks. That's not a herniation, that's a 34-year-old's spine.” Who wants to answer her?",
   "ask": "She just called it a 34-year-old's spine, not a herniation. What's your first sentence back?"
  },
  "task": {
   "say": "You'll run this call with Dana Whitfield in the Call Simulator, log it in the Communications Log and draft the follow-up in the Email Workspace. Before you dial, do the math check on $3,500: fee, costs, unreduced liens and John Doe's net. On the call, pause after her number and ask what data supports it. Name each stall. On the gap, point only to the record: the EMS report, the Gap Explanation Record and Dr. Reyes's Causation Letter, and answer degenerative with Dr. Park's MRI language. Restate the $10,000 Limits Demand and the 08/21/2026 deadline, with no counter. Then log her exact words, report the offer to Atty. Thorne today for him to convey to John Doe, and draft the 08/06/2026 rebuttal for his approval. That's what you hand in.",
   "ask": "Which sentence will you read to her word for word?"
  },
  "check": {
   "say": "Before you log the call, check yourself. Did you run the math before dialing? $3,500 minus the $1,166.67 fee and $486.75 in costs leaves $1,846.58 against {{openLiens}} of liens, so John Doe nets $0.00. If you dialed without knowing that, you were negotiating blind. Did you pause and ask what data supports $3,500? Did you answer the gap with dated documents, and degenerative with Dr. Park's own sentence? Did you restate $10,000 and 08/21/2026 with no new figure? If you said “let me see what I can do,” or named a number, that's a fail, because the authority was written down so nobody improvises it. Is the offer logged in her exact words, reported on 08/05, with the rebuttal drafted for 08/06?",
   "ask": "If Dana Whitfield raises the April break, which record answers the 19-day disruption?"
  }
 },
 "d3m2-l2": {
  "why": {
   "say": "I've got Harbor Point's 03/02/2026 letter up, and I want you to find the sentence in it that's worth $10,000 to John Doe. Give it a second. It's the add-on clause. On a reduction policy, Keystone's $10,000 would have come straight off the top of the $20,000. Once Keystone tenders, the money that makes John Doe whole sits with two first-party carriers that insure him, and both of them will argue against him. We reach $40,000 by proving the gap above each layer, closing every reduction in writing first, and papering every single move.",
   "ask": "Without that add-on sentence, what would Harbor Point's $20,000 have shrunk to?"
  },
  "theory": {
   "say": "A UM settlement is won on paper. The package shows the other driver's fault, and it shows that damages exceed what's been collected. Compare a weak file with a legal trap. Raw charts and a casual letter carry no risk for the carrier, while a coded summary on a clock raises it. Sort documents by function, coverage, liability and damages, and let the diagnostics and a causation narrative answer any pre-existing-condition defense. You'll hear about bracketing, paired ranges that build a bridge across a gap and then close in the middle, but Atty. Thorne makes every move there. And in no-fault states, PIP set-off generally bars double recovery: value minus PIP paid is what the defendant still owes.",
   "ask": "Has anyone worked a no-fault file, and how did PIP change the ask?"
  },
  "frame": {
   "say": "Here's what goes inside a UM demand packet, in four groups. Evidence of liability: the Police Report, property-damage photos, witness statements, any dashcam or surveillance footage. On our file, that's the citation, Ruth Calloway and the doorbell video. Economic damages: itemized Medical Bills, complete records, lost-wage verification and future medical estimates. Non-economic damages: the demand letter, the client's impact statement and photos of injuries. And proof of exhaustion, which UM carriers look for first: the signed Limited Release, the check copy, the at-fault Dec Page and the consent to settle. Get that last group wrong and the rest barely matters.",
   "ask": "Which of the four groups was still incomplete on John Doe's file on 08/31/2026?"
  },
  "rules": {
   "say": "Here are the rules, and where you stop. UM pays the gap: damages as Atty. Thorne values them, minus the BI, up to its limit. Cardinal State's file has to show damages above $30,000. Check the offset rule first; Harbor Point's 03/02/2026 letter answers the limit half of “BI already compensated him,” and the medical proof answers the damages half. Both carriers turn adversarial at evaluation, so the first offer is rarely the last. Bracketing is Atty. Thorne's tool alone. When a carrier offers limits, confirm coverage, release scope, liens, payee and check date without accepting, and report that day. Never accept verbally under pressure. Riverton's PIP is add-on, and here it creates no lien and no UM cut. You assemble, log, relay and paper John Doe's decision. You never accept, reject, counter, explain offset language to him, or accuse a carrier of bad faith.",
   "ask": "Harbor Point insures Kevin Alvarez's car. Why does it owe John Doe anything, and why will it still fight him?"
  },
  "model": {
   "say": "This slide shows what could shrink the gross, and where this file actually stands. Three rungs build left to right: BI at $10,000, tendered 08/12, then Host UM at $20,000, then Relative UM at $10,000, with the running total going from $10,000 to $30,000 to $40,000 gross. Under the Host UM rung you'll see three reductions struck through in red: a BI offset, PIP non-duplication and a PIP lien. None of them apply, and one document knocks out all three, Harbor Point's letter of 03/02/2026. Off to the side sits a reminder that this PIP is add-on, so there's no set-off. Along the bottom is what we confirm before anything's accepted: scope, release, liens, payee and check date, then a confirming email.",
   "ask": "How does a single 03/02/2026 letter knock out all three of those red chips?"
  },
  "job": {
   "say": "Let's run it on the calendar. On 09/14/2026, Harbor Point's offer comes in. You log the offer and its stated reasons in the Negotiation Log on the Insurance tab and report it to Atty. Thorne that day. Because the offer cites the BI payment and the gap, you assemble a counter-package for his approval: the 03/02/2026 letter, the MRI read, the Causation Letter, the MMI residuals and future care. He approves, and it goes out 09/16. When a carrier offers limits, you confirm the terms without accepting and draft the acceptance email, which goes only after John Doe's decision is logged and Atty. Thorne approves. And when each UM check arrives, you confirm its release is signed and deposit it to trust that day, 10/05 and 10/13/2026."
  },
  "dodont": {
   "say": "Three Clues, One Rule again. I reveal three clues, you call Do or Don't, then name the rule. In play this time: hunting down every stacking and resident-relative policy, because that's why this file reaches $40,000. Getting offset and reimbursement status in writing, the way Harbor Point's 03/02/2026 letter does. Setting John Doe's expectations on the UM timeline without ever promising him a limit. And the traps: taking the first offer because it's his own coverage, promising limits before the offset rule is checked, a bracket move with nothing back from the carrier, a verbal deal with no confirming email, finding a lien after disbursement. And remember, anyone who writes the words “bad faith” to an adjuster has crossed the line. That's Atty. Thorne's conclusion to draw.",
   "ask": "Harbor Point offered $8,000 on 09/14. What does that tell you about first-party carriers being friendly?"
  }
 },
 "d3m2-a2": {
  "case": {
   "say": "Here's today's landing, 09/14/2026, from Marcus Bell on HP-26-7741. Harbor Point offers $8,000.00 on the Host UM claim. His reasons: John Doe didn't treat for two weeks after the accident, and the BI payment has already compensated him for much of this loss. He wants to know your client's position. Now, I've put his reasons on the board right beside Harbor Point's own letter of 03/02/2026. Take a good look before anyone drafts a word. The carrier's argument is answered by its own paper. For context, Keystone's $10,000 has been in trust since 09/04, and both UM demands went out on 08/31.",
   "ask": "Which line in Harbor Point's own 03/02/2026 letter answers “BI already compensated him”?"
  },
  "task": {
   "say": "Your job is to work both UM claims to resolution in the Negotiation Log. Log Harbor Point's $8,000 with its stated reasons and report it to Atty. Thorne the same day. Assemble the 09/16 counter-package for his approval: Harbor Point's 03/02/2026 letter, the MRI read, Dr. Reyes's Causation Letter, the MMI residuals and future care. Log every later move. Whenever a carrier offers or tenders, record John Doe's informed decision through Atty. Thorne, then draft the confirming email in the Email Workspace for his approval, covering coverage, release, liens, payee and check date. You'll finish by proving $40,000.00 gross on the Recovery Ledger in the Net Sheet.",
   "ask": "Cardinal State has offered $6,000. Who decides whether John Doe takes it, and how does that decision reach the log?"
  },
  "check": {
   "say": "Run this check before you log your work. Is Harbor Point's 09/14 offer logged with both reasons quoted and reported the same day? Does the counter-package answer the offset half with the 03/02/2026 letter and the damages half with the medical proof, including the MMI residuals and future care of $3,400 to $6,800? Did it go out 09/16 with no figure below limits from you? For Harbor Point's $20,000 on 09/29 and Cardinal State's $10,000 tender on 10/06, is each acceptance recorded as John Doe's informed decision through Atty. Thorne, with who, on whose advice, and when? “Accepted” alone is incomplete. Your Recovery Ledger should read $40,000.00 and nothing else. Add PIP's $5,000 or Keystone's property-damage payments and you've mixed in money that doesn't belong.",
   "ask": "Was each UM release signed before its check arrived on 10/05 and 10/13?"
  }
 },
 "d3m2-kc": {
  "questions": {
   "say": "Here's the Learning Check for the negotiation module. Answers come from this file, in your own words, typed under each question. First, run the math check on Keystone's $3,500: fee, costs, unreduced liens, net. Tell me what it shows Atty. Thorne and who tells John Doe. That's the keystone question, so show the $0.00 cleanly. Second, answer Dana Whitfield's gap and degenerative arguments with four documents and the radiologist's own words. Third, explain what PIP's $5,000, exhausted and non-subrogated, means for valuation, and what would change in a no-fault state. Careful there, because “no set-off here” isn't the same thing as “no reduction anywhere.”",
   "ask": "Why is this file free of reductions, and which document says so?"
  },
  "summary": {
   "say": "Now your Self-Summary. Write what you learned negotiating John Doe's file, the principles rather than the clicks. Then your strategy: if a carrier's offer landed today, what's your next action, and why is it the right one rather than a counter? Then the one thing you're least confident about. Before anyone writes, here's a pressure question out loud. The offer dies at 5:00 p.m. and Atty. Thorne is unreachable. Turn to your neighbor, talk it through for a minute, and then write. Keep the scenario on screen in mind as well.",
   "ask": "The offer dies at 5:00 p.m. and Atty. Thorne is unreachable. What do you say?"
  },
  "scale": {
   "say": "Okay, the Skill Scale. Give yourself a 1 to 5 on each of the six competencies, from building the battle map and net floor through to holding the authority line, where every number and decision runs through Atty. Thorne. I'll set your self-rating next to your score, and if they're far apart in either direction, we'll talk about it. That's not a penalty, it's coaching. Just keep in mind that UPL is a gate, so a strong score can't rescue an ethics breach. Submit it for review when you're finished.",
   "ask": "Which of the six competencies would you most want to practice again before your next file?"
  }
 },
 "d3m3-l1": {
  "why": {
   "say": "Quick question to start. How many liens are on John Doe's $40,000? Most of you will say two. The right answer is two asserted and five checked, each one recorded with its source. Here's why that matters. That $40,000 isn't John Doe's until every claim on it is found, classified and resolved in writing. And liens aren't created equal. A statutory lien bends to a formula, a Health Plan's reimbursement right bends to a doctrine, and a provider's balance bends to a negotiation. Classify one wrong and you either overpay it or freeze the disbursement. Neither is okay with me.",
   "ask": "How many liens are on John Doe's $40,000, counting the ones we checked and found absent?"
  },
  "theory": {
   "say": "The legal backing behind a lien decides how negotiable it is. At the easy end, medical provider liens. Providers treating on an LOP are highly negotiable, and they'll often take a reduction to get paid now. Health insurance subrogation, a private plan's reimbursement right, is moderate, shaped by the made-whole and common-fund doctrines. Medicare and Medicaid are government payers bound by strict federal or state formulas, so they're low negotiability and slow to process. And ERISA plans, self-funded employer plans governed by federal law, are very low, notoriously hard to reduce. Keep that ladder in your head, because it tells you where your leverage lives before you pick up the phone.",
   "ask": "Which of these lien types have you dealt with, and which one gave you the hardest time?"
  },
  "frame": {
   "say": "This chart puts the common lien types side by side, so you can see who they are and how far they'll bend. Medical providers, doctors or hospitals treating on a Letter of Protection, sit high; they often take a reduction to get paid now. Health insurance, private insurers seeking subrogation, sits moderate, subject to made whole or common fund. Medicare and Medicaid, the government-funded programs, sit low, with strict formulas and slow processing. ERISA plans, self-funded employer Health Plans, sit very low, governed by federal law and notoriously hard to reduce. On John Doe's file, Riverton Spine & Rehab is our LOP provider, and Peach State is a fully insured Health Plan, not ERISA.",
   "ask": "Where do Riverton Spine & Rehab and Peach State land on this chart, and why?"
  },
  "rules": {
   "say": "Here are the rules, and where your role stops. Statutory liens, like Medicare, Medicaid, a hospital lien or workers' comp, arise by law and bend least; contractual claims rest on an agreement. Inventory every claimant, absent ones included. Two liens are asserted, Peach State and Riverton Spine & Rehab, and every “none” gets its source. Not every payer is a lienholder: Harbor Point's PIP has no reimbursement right, and Crescent Pain & Spine can't balance-bill. Peach State is fully insured, and what follows is Atty. Thorne's call. He asked for the one-third common-fund share, so $1,860.00 minus $620.00 is $1,240.00. Made whole, comparative fault and quantum meruit are doctrines you can name, never choose. You classify, gather, audit and draft. You never compromise a lien without his authority, or tell John Doe a lien is invalid.",
   "ask": "Peach State paid $1,860.00 on a $3,400.00 injection. Who can come after John Doe for the other $1,540.00?"
  },
  "model": {
   "say": "Nobody can, by the way, because Crescent took the contract rate. Now, this slide classifies every claim on John Doe's $40,000. The ladder runs from most negotiable at the top, the provider LOP, through fully insured Health Plans and workers' comp, down to Medicare and Medicaid, with ERISA self-funded at the bottom. Only two bars are solid: Riverton Spine & Rehab at $6,290.00 and Peach State at $1,860.00. Every other bar is hollow, with a green check saying none, verified. There's an outlined prior-attorney bar tagged quantum meruit, and three doctrine cards, common fund, made whole and comparative fault, with that last one greyed out. And the warning along the bottom: unclassified means overpaid or frozen.",
   "ask": "Why is the comparative fault card greyed out on John Doe's file?"
  },
  "job": {
   "say": "Let's put it on the job. When the gross reaches $40,000.00 on 10/06/2026, you run the final inventory in the Lien Tracker, re-verifying the Day 2 register, asserted and absent, and classifying each claim as statutory or contractual. Two stay open; Medicare, Medicaid, hospital, workers' comp, prior attorney and PIP each get “none” with a source. Once the Health Plan lien is classified, you get the plan documents and escalate the funding status to Atty. Thorne. Fully insured goes on file, and the governing-law call is recorded as his. When he picks the reduction basis, you draft the request naming the doctrine and showing $1,860.00 minus $620.00 equals $1,240.00, held for his approval. And for the prior-attorney question, ask John Doe, check intake, and log “no prior attorney, verified” with its date."
  },
  "dodont": {
   "say": "Here comes Three Clues, One Rule. I reveal three clues, you call Do or Don't, then name the rule. The rules in play: work the most negotiable lien first to build momentum, but resolve every one in writing before disbursement. Record a verified “none” the way you'd record a lien, with its source and date. Name the doctrine and show the math in every Reduction Request. And the traps: treating an ERISA plan like a provider LOP, asking for a courtesy discount with no legal basis, paying a prior attorney a percentage he's no longer owed. One heads-up. Someone will ask whether riding in Kevin Alvarez's carpool makes this workers' comp. That's a coverage question for Atty. Thorne. We record that no claim was filed and no lien asserted.",
   "ask": "With no prior attorney on this file, why does quantum meruit still get a line in the Lien Tracker?"
  }
 },
 "d3m3-a1": {
  "case": {
   "say": "Here's what just landed, 10/06/2026, on PSH-55017742. Peach State Health Plan asserts its reimbursement right of $1,860.00, paid for the 05/15/2026 epidural injection at Crescent Pain & Spine, and asks us to confirm its claim will be protected from the proceeds. The notice of rights and the EOB are attached. Some context: Cardinal State has just tendered its $10,000 limits, so the gross is $40,000.00. Both liens have been on the Lien Tracker since the pre-demand audit, and Atty. Thorne held the Reduction Requests until the gross was known. Now take a look at the plan documents. They show a fully insured group plan.",
   "ask": "What one fact about Peach State decides which law governs its claim?"
  },
  "task": {
   "say": "Here's what you'll do, all in the Lien Tracker on the Net Sheet. Match the plan's itemized payments to the treatment record, classify the lien, record its funding status, and escalate the governing-law question to Atty. Thorne through CMS Tasks. Then draft the Reduction Request for his signature in Documents, Outgoing. Name the doctrine, show the one-third math down to $1,240.00, cite the work that built the fund, beating the 14-Day Gap defense with the MRI, and flag made whole as his to argue. Record every absent claimant as a verified none with its source. You'll hand in the request ready for his signature, a fully cleared Lien Tracker, and the 10/09/2026 acceptance at $1,240.00 once it's confirmed in writing.",
   "ask": "Who decides whether John Doe was made whole?"
  },
  "check": {
   "say": "Before you log it, check yourself. Is the plan ledger matched to the one accident-related charge, the 05/15/2026 injection, $3,400.00 billed and $1,860.00 paid? The lien is what the plan paid, not what was billed. Is Crescent's $1,540.00 write-off recorded as not owed? Is the lien classified contractual, with fully insured status from the plan documents and the governing law recorded as Atty. Thorne's call? Is the common-fund math shown, citing the MRI and the 06/19/2026 Causation Letter? Are the absences complete, Medicare, Medicaid, hospital, workers' comp and prior attorney, each with date and source, and PIP recorded as not a lien? And did you log $1,240.00 as final only with Peach State's written confirmation and Atty. Thorne's approval attached? That's where people trip.",
   "ask": "Who checked Summit Imaging, which asked for an LOP on 03/11/2026?"
  }
 },
 "d3m3-l2": {
  "why": {
   "say": "Look at this table. It's what would have happened with only Keystone's $10,000 BI, and I've covered the last row. What does John Doe take home? Here it is: $0.00. That's why this lesson exists. Half the job is getting money from the carriers. The other half is keeping it from the lienholders, because every dollar a lien gives up lands in John Doe's net. And what moves a provider isn't a plea for a favor. It's an honest audit and the pro-rata math, laid out so plainly the provider can check it themselves.",
   "ask": "Before I uncover that last row, what do you think John Doe takes home on BI alone?"
  },
  "map": {
   "say": "Here's the road to reducing the liens. You start by auditing the bill line by line against the records, and corrections come before any reduction. Then you run the pro rata math, from the fraction, not a rounded percentage. Then you ask with authority: Atty. Thorne's written request and his target, never a stock number. Nothing gets paid without a Payoff Letter that says full and final, in writing. And the day a reduction is confirmed, you update the ledger and show John Doe what it saved him."
  },
  "theory": {
   "say": "Before you ever ask for a discount, make sure the bill is accurate. An error earns a demand for correction, not a favor. Watch for upcoding, which is billing a higher service level than the records support, like a Level 5 for a Level 3, and the record decides. Watch for unbundling, one service split into separately billed parts to inflate the total. Then pro-rata distribution: when a short fund can't pay everyone, equal-priority liens split it in proportion, each lien's amount over all the liens, times what's left. And the common fund doctrine says the lienholder shouldn't ride free on the work and costs that created the fund it's repaid from.",
   "ask": "Have you ever caught a billing error that the provider fixed without an argument?"
  },
  "frame": {
   "say": "Here's the path from the bill to the payoff. Cross-reference first, records against bill, so a Level 3 visit billed as Level 5 gets corrected, not discounted. Hunt for duplicate charges, especially overlapping dates between hospital stays and individual physician groups. Then leverage the common fund. In many states a lienholder reduces by its share of fees and costs, and Atty. Thorne makes that argument. Finally, the Payoff Letter. Never pay without a signed letter saying it's full and final satisfaction of the lien. On John Doe's file, the duplicate check has already found something on Riverton's ledger.",
   "ask": "What did the duplicate check find on Riverton Spine & Rehab's ledger?"
  },
  "rules": {
   "say": "Here are the rules, and your line. Audit before you ask: corrections first, reductions second. Riverton billed 34 lines at $185.00, $6,290.00, but the records show 33 visits and a duplicate on 05/04/2026, so you negotiate from $6,105.00. Match each code to that day's note; nothing may fall between 04/02 and 04/21/2026. With only the BI, $6,179.92 would split pro rata, Peach State {{proRataHealthPlan}} and Riverton {{proRataSpineRehab}}, and John Doe nets nothing. But on Track A the fund covers both liens, so argue true facts only. Never say a provider would take only a share or that the client will refuse the settlement. Common fund is Atty. Thorne's argument. Send his approved request, call with his target, and remember, no Payoff Letter means no payment. You never offer or accept outside his authority.",
   "ask": "Riverton billed $6,290.00. What number do you negotiate from?"
  },
  "model": {
   "say": "Here's the pro-rata illustration, on BI alone. That long bar is the $6,179.92 left after fee and costs, split 28.68% to Peach State, which is {{proRataHealthPlan}}, and 71.32% to Riverton Spine & Rehab, which is {{proRataSpineRehab}}. Underneath, you can see {{openLiens}} of liens hanging off the end in red hatching, and that little red card on the right says it all: John Doe nets $0.00. Along the bottom is the order of work. Audit, correct, calculate, ask with authority, confirm in writing, and then the Net Sheet gets updated. The math is the leverage, and the audit always comes before the ask.",
   "ask": "Why do we compute each share from the fraction instead of the rounded percentage?"
  },
  "job": {
   "say": "On the job, it runs in three beats. When the provider's Final Ledger arrives, you audit each line against the visit records you requested, and you ask in writing for any error to be corrected. On John Doe's file, that's 33 visits matched, the 05/04/2026 duplicate removed, and $6,105.00 in the Lien Tracker. With the audited balance confirmed, you draft the Reduction Request with the math and get Atty. Thorne's written authority, escalated through CMS. That authority is logged before the request goes out or any call is made. And when a reduction is agreed, you get the signed Payoff Letter, update the Lien Tracker and the Net Sheet, and recompute the net that same day."
  },
  "dodont": {
   "say": "Let's play Three Clues, One Rule. Three clues come up, you call Do or Don't, and you name the rule. In play: corrections first, reductions second. Being transparent with John Doe about the savings, so he sees his net rising. Getting every reduction in writing before disbursement. And the traps: a percentage off an inflated bill, a verbal reduction with nothing in writing, paying from a statement instead of the final payoff figure. Now, a warning about an old script you may hear: “reduce or the client refuses the settlement.” That's a threat, and here it's false. After fee and costs, $26,179.92 remains against {{openLiens}} of liens. Use true facts instead: a coverage-capped recovery, the audited balance, a certain payment now.",
   "ask": "How would you rewrite “reduce or the client refuses the settlement” using only true facts?"
  }
 },
 "d3m3-l3": {
  "why": {
   "say": "Here's a question to start. Riverton Spine & Rehab has agreed to take less. What has to be in the file before a dollar goes out? Most people say the agreement. It's the signed Payoff Letter. A reduction is won on paper first and on the phone second. The lienholder needs to see the audited balance, the recovery, the fee and costs, and the other liens, so it can see why taking less is fair. And it needs a letter it can sign that closes the bill for good. Skip the paper and you either leave money on the table or reopen a bill you thought was closed.",
   "ask": "What goes to the lienholder before you ever pick up the phone?"
  },
  "rules": {
   "say": "Four rules carry this. First, you negotiate from the audited balance, never the billed one: Riverton at {{spineRehabOwed}}, Peach State at $1,860.00, {{openLiens}} in all. Second, the written Reduction Request goes first, with Atty. Thorne's written authority already on file. Third, on the call you make his ask and nothing outside it, and you log the name, the date and every figure. A counter outside his authority goes back to him the same day. Fourth, no Payoff Letter, no payment, and the letter says full and final, with no balance billing or collections. Then you update the Lien Tracker and the Net Sheet that day.",
   "ask": "If the provider counters below Atty. Thorne's floor, what do you say on the call?"
  },
  "job": {
   "say": "Here's the job, start to finish. When the audited balance is confirmed, you draft the Reduction Request with the math and get Atty. Thorne's written authority before it goes. When the lienholder responds, you call with the authorized ask and log who you spoke to, when, and every figure. And when the reduction is agreed, you get the signed Payoff Letter, then update the Lien Tracker and the Net Sheet so John Doe can see his net change the same day.",
   "ask": "Which of these three steps would you check first if a provider later says the bill is still open?"
  }
 },
 "d3m3-a2": {
  "case": {
   "say": "It's 10/09/2026, and Peach State has accepted $1,240.00 in writing. Here's what just landed from Riverton Spine & Rehab: John Doe's Final Itemized Ledger under the 02/23/2026 Letter of Protection, 34 visits at $185.00, balance $6,290.00. They understand the case is settling and want to know when to expect payment in full. Visit notes are attached. Atty. Thorne has set a target for Riverton in writing, and the Reduction Request is yours to draft. We're running this one live. One of you will make the call, and the billing manager is going to push back: “We gave him 33 visits on a promise of payment, and you want a discount?” Your answer is the audit and the true facts, not sympathy.",
   "ask": "She says 33 visits. So how many lines did Riverton actually bill?"
  },
  "task": {
   "say": "First, audit Riverton's ledger against the visit records and request a written correction before you ask for anything. Then draft the Reduction Request for Atty. Thorne's approval, and send it once he approves. Next comes the follow-up call in the Call Simulator with Tammy Greer, the billing manager. State the audited balance, $6,105.00 with the 05/04/2026 duplicate removed. Explain the coverage-capped recovery as facts, and ask for payment in full in the interest of global resolution. She'll agree to {{payoffA}} on the call. Accept nothing; it goes to Atty. Thorne. Ask for a signed Payoff Letter with full satisfaction and no balance billing. You'll hand in the logged call, the Payoff Letter dated 10/12/2026, and a recomputed Net Sheet showing {{netA}}.",
   "ask": "The manager just said yes to {{payoffA}}. What do you say next?"
  },
  "check": {
   "say": "Check yourself before you log it. Did you audit line by line, 34 billed lines against 33 documented visits, 16 before the disruption and 17 after? Did you request the written correction for the 05/04/2026 duplicate before any reduction, taking $6,290.00 down to $6,105.00? No lines between 04/02 and 04/21/2026? Was the request approved and sent before the call? Did you argue only true facts, a recovery capped at $40,000 of coverage, and never claim the client would refuse? When she said {{payoffA}}, did you say it goes to Atty. Thorne and will be confirmed in writing? Is the signed Payoff Letter on file with full-and-final and no-balance-billing language? And does the Net Sheet show {{netA}}? That letter is what lets the 10/22/2026 disbursement go out clean.",
   "ask": "If you opened with a discount on $6,290.00, how much error did you negotiate around?"
  }
 },
 "d3m3-kc": {
  "questions": {
   "say": "This is the Lien Reduction Verification. Answer from the file, in your own words, typed under each question. First, classify each claim on John Doe's $40,000, that's Peach State, Riverton Spine & Rehab, PIP, Medicare and Medicaid, and a prior attorney, as statutory, contractual or none, and rank the liens by reducibility. Second, explain why Peach State being a fully insured group plan matters, and who decides what follows. That's the keystone. If your answer is “state law applies, so we argue made whole,” you've made Atty. Thorne's decision for him. Third, show the math from $1,860.00 to $1,240.00, name the doctrine, and connect it to beating the 14-Day Gap with the MRI.",
   "ask": "On question two, where exactly does your job end and Atty. Thorne's begin?"
  },
  "summary": {
   "say": "Time for the Self-Summary. Put the principles of lien reduction into your own words, not the clicks. Then your strategy: with both liens resolved, what's the next action before the 10/22/2026 disbursement, and why is it the right one? Then name the one thing you're least confident about, and what would get you there. Before you write, glance at the scenario on screen, Keystone's 08/14/2026 release with Harbor Point's consent still out and Atty. Thorne away. Hold onto the same instinct for every pressure question: stop, document, escalate.",
   "ask": "When a deadline and an absent attorney collide, what's the one thing you never do?"
  },
  "scale": {
   "say": "Now the Skill Scale for this module. Rate yourself 1 to 5 on each skill, from classifying liens as statutory or contractual right through to holding the authority line in lien negotiation. I'll compare each rating with your score. If you gave yourself a 5 and scored 60, or a 2 and aced it, we'll sit down and talk about why. And remember, UPL is a gate. No score survives an ethics breach. Submit when you're ready.",
   "ask": "Which lien skill felt strongest today, and does your score agree with you?"
  }
 },
 "d3m4-l1": {
  "why": {
   "say": "Let me write two numbers on the board: $6,179.92 against {{openLiens}}. That's the BI stream alone. What would John Doe have taken home? Nothing at all. Now here's what he actually nets: {{netA}}. The difference is why the Net Sheet matters. His $40,000 came from three carriers in two streams, and it goes out as five checks. The Net Sheet shows where every dollar came from and where it's going before a cent leaves trust. If you can't trace a dollar on the sheet, it doesn't move.",
   "ask": "What turned $0.00 into {{netA}} on this file?"
  },
  "theory": {
   "say": "The Net Sheet is your tool for transparency and case control. Think of it in two streams. The third-party BI stream comes from the at-fault driver's carrier, and exhausting its limit is usually a legal prerequisite to first-party UM. The first-party UM stream comes from the client's own policy or a resident relative's, and it only triggers once BI is exhausted or the driver is uninsured. Then there's the double-dipping trap. Carriers audit files closely, so tracing every dollar's source keeps liens paid correctly without cross-contaminating funds. And the final aggregate net puts both streams side by side, so the client sees what the coverages and the negotiation added.",
   "ask": "Have you seen money double-counted on a settlement before, and how was it caught?"
  },
  "frame": {
   "say": "Here are the two streams on John Doe's Net Sheet. Stream one is third-party BI, the at-fault driver's insurance company. You exhaust its limit first, because that's usually a legal prerequisite, and here it's Keystone, $10,000. Stream two is first-party UM or UIM, a host vehicle's or resident relative's policy that triggers only once BI is exhausted or the tortfeasor is uninsured. On our file that's $20,000 from Harbor Point plus $10,000 from Cardinal State. Keep them in separate columns from the first entry to the last, and you'll never have to untangle them later.",
   "ask": "Why did Stream 2 only open after Keystone paid its full $10,000?"
  },
  "rules": {
   "say": "Here are the rules, and where your role stops. One Net Sheet, two tabs. The Recovery Ledger carries money in and every deduction, and the Lien Tracker proves each lien figure. Neither is final until they tie out. Keep the streams apart, BI $10,000.00 and UM $30,000.00. PIP's $5,000.00 is a payment source on the Lien Tracker, never recovery. Price the fee per stream at 33⅓% pre-suit: $3,333.33 plus $10,000.00 is $13,333.33. Every cost needs a receipt, $486.75 in all, split 25% and 75%, $121.69 and $365.06. Reduce liens globally, then allocate pro rata. Run the net both ways: {{streamBi}} plus {{streamUm}} is {{netA}}. Flag future ESIs of $3,400 to $6,800 for Atty. Thorne. You build and explain the arithmetic. You never tell John Doe whether the net is enough.",
   "ask": "Why does Harbor Point's PIP appear on the Lien Tracker but not in the gross?"
  },
  "model": {
   "say": "Here's John Doe's Net Sheet, both tabs. The Recovery Ledger is in front, with three columns: total, Stream 1 BI and Stream 2 UM. Down the rows you've got the gross, the 33⅓% fee, costs, Peach State and Riverton Spine & Rehab, closing on that heavy orange net row: {{netA}}, which is {{streamBi}} plus {{streamUm}}. See those thin orange lines running from each lien row back to the Lien Tracker tab? They read proved by Payoff Letter. And in the corner, the reminder that BI alone meant $0.00 to John Doe. Every figure on the net row traces back to its source. That's the whole idea.",
   "ask": "If the two stream nets didn't add up to {{netA}}, where would you look first?"
  },
  "job": {
   "say": "On the job, the Net Sheet builds as the file moves. Each settlement check that arrives gets posted to its stream on the Recovery Ledger, with carrier and check reference: BI $10,000.00, UM $20,000.00 plus $10,000.00, $40,000.00 total. Each cost gets its receipt attached and is posted once; five receipts make $486.75, and nothing is charged to both streams in full. When a lien reduction is accepted, the Lien Tracker gets the asserted, audited and reduced figures and the Payoff Letter: Peach State $1,240.00, Riverton Spine & Rehab {{payoffA}}, letters dated. And once both tabs are complete, you tie the Net Sheet to the Trust Ledger, net {{netA}} on both, and route it to Atty. Thorne before John Doe ever sees it."
  },
  "dodont": {
   "say": "Time for Three Clues, One Rule. I reveal three clues, you call Do or Don't, then name the rule. The rules this time: one Net Sheet, two clearly separated streams. Every reduction carries its reason, an audit finding like the 05/04/2026 duplicate or a named basis like the one-third procurement-cost reduction. Show the streams side by side so John Doe sees what the work produced, from Keystone's $3,500 offer to its $10,000, and then $30,000 more from UM. And the traps: BI and UM mixed on one line, one cost charged to both streams, a cost with no receipt or a lien with no Payoff Letter. Watch your rounding too. BI carries $121.69 of the costs, and UM takes the remainder, $365.06.",
   "ask": "Why do we compute the UM share as the remainder instead of rounding it on its own?"
  }
 },
 "d3m4-a1": {
  "case": {
   "say": "Here's what landed today, 10/13/2026. Cardinal State Mutual's $10,000.00 is deposited to IOLTA on CS-26-20355, but it hasn't cleared. That joins Keystone's check, received 09/04, and Harbor Point's, 10/05, each deposited only after its release was signed. Trust has received $40,000.00. Peach State accepted $1,240.00 on 10/09 and Riverton Spine & Rehab accepted {{payoffA}} on 10/12, both in writing. Costs stand at $486.75. Both Net Sheet tabs are half-built, and they need finishing before the Settlement Statement is drafted. Let's start with the zero-balance rows. Why isn't PIP's $5,000.00 being paid back, and why isn't Crescent's write-off owed? Add either to the payables and you've paid John Doe's money away.",
   "ask": "Why isn't Harbor Point's PIP $5,000.00 paid back out of the settlement?"
  },
  "task": {
   "say": "You're completing both tabs of John Doe's Net Sheet. On the Recovery Ledger, post each check by carrier and stream, the 33⅓% fee per stream, the five receipted costs, and costs and liens split 25% and 75%, down to the net per stream and in total. On the Lien Tracker, list every provider and payer with charges, payments, adjustments and balance owed, then each lien's asserted, audited and reduced figure, the basis of each reduction and its payoff-letter status. Tie both tabs to the Trust Ledger. You'll hand in a two-tab Net Sheet reaching {{netA}} down both streams and across the total, with every lien figure proved and routed to Atty. Thorne. And think hard about what you flag before John signs.",
   "ask": "If Riverton Spine & Rehab had accepted {{payoffA}} only on a phone call, could the line be marked final?"
  },
  "check": {
   "say": "Check the arithmetic both ways before you log it. Gross: Keystone's $10,000.00 to Stream 1, Harbor Point and Cardinal State's $30,000.00 to Stream 2. Fee: $3,333.33 plus $10,000.00, $13,333.33. Costs: $486.75, split $121.69 and $365.06, charged once. Liens split 25% and 75%: Peach State $310.00 and $930.00, Riverton $867.50 and $2,602.50. Net: {{streamBi}} plus {{streamUm}} is {{netA}}, and $40,000.00 minus {{deductionsA}} lands in the same place. A one-cent drift means a stream got rounded on its own. Are the zero-balance lines kept off the payables, with their sources? Is each lien's payoff status recorded, none final on a phone call? And the judgment call: did you flag up to $6,800 in possible repeat injections to Atty. Thorne before John Doe signs?",
   "ask": "Why does the future-injection flag go to Atty. Thorne rather than straight to John Doe?"
  }
 },
 "d3m4-l2": {
  "why": {
   "say": "I've got a line from Keystone's 08/14 draft up here, struck through: “all other persons, firms, corporations and insurers.” What would that one line have cost John Doe if nobody had read it? $30,000. It would have released both UM carriers. That's the whole case for auditing every release. A settlement isn't over when a carrier says yes. It's over when the right release is signed, every check has cleared trust, every lien is paid off in writing, and the ledger reads $0.00. Until then, the work isn't done.",
   "ask": "When any release lands on your desk, what's the first thing you read for?"
  },
  "map": {
   "say": "Here's the road from a signed deal to a ledger at zero. First, audit the release line by line: who's released, which claims, and what John Doe promises. Second, both UM consents come in before the BI release is signed. Third, the Settlement Statement shows him how $40,000.00 becomes his net. Fourth, trust: each check goes to IOLTA the same day its release is signed, and nothing is paid against uncleared funds. And fifth, disbursement: Payoff Letters, Atty. Thorne's signature, and a ledger that reads $0.00."
  },
  "theory": {
   "say": "Four documents close a case, and you need to know what each one does. The Release of All Claims is the exit document that ends the right to sue, and its scope decides which claims and carriers survive. The Settlement Disclosure Statement is the truth document: gross to net, and a clear statement that full and final means there's no coming back for more. A Satisfaction of Lien is the provider's signed letter that its lien is paid, which prevents collections against the client later. And where suit was filed, a Dismissal With Prejudice tells the court it's over, and with prejudice means it can't be refiled. After that, disbursement moves money only through verification, documentation, authorization and reconciliation.",
   "ask": "Which of these four documents has John Doe's file not needed, and why?"
  },
  "frame": {
   "say": "Here's the disbursement workflow, four stages, and each one protects accuracy, compliance and the client against fraud. Verification first: you review the Ready for Payment files and confirm every condition precedent is met. Then documentation: you collect the invoices and receipts and make sure each one is legible and matches the claim. Then authorization: Atty. Thorne approves and signs, and the packet goes to accounting. You never sign it. And finally reconciliation: you confirm receipt of the funds and update the case file to show Paid. On John Doe's file, all four stages land between 10/20 and 10/22/2026.",
   "ask": "Which condition precedent on John Doe's file was the last to close before 10/22?"
  },
  "rules": {
   "say": "Here are the rules, and where you stop. Read every release line by line before John Doe sees it: who's released, which claims, what he promises. A BI release can't reach what's still open, like the Civic's property-damage claim with Keystone PD, and both UM consents come before it's signed. The indemnity clause binds John Doe to repay the carrier if a lienholder later pursues it, so every lien must be tracked and paid off in writing. Harbor Point's release must not reach Cardinal State. The Settlement Statement shows $40,000.00 becoming {{netA}}. Log each check on arrival, deposit to IOLTA once its release is signed, and never disburse before funds clear on 10/20. No suit was filed here, so no dismissal. You audit, flag, prepare and verify. Atty. Thorne explains, approves and signs.",
   "ask": "Keystone's check is in. Why can't we pay Riverton Spine & Rehab today?"
  },
  "model": {
   "say": "This is John Doe's money path, and no gate opens before the one to its left has closed. Gate one, the releases signed, 08/28 plus the UM releases. Gate two, the checks into IOLTA on 09/04, 10/05 and 10/13. Gate three, funds clear on 10/20. Gate four, the statement is signed on 10/21. Gate five, Atty. Thorne signs on 10/22. Gate six, reconciled to $0.00. Above gate one is that struck-through line again, with minus $30,000 beside it, and underneath, the Trust Ledger steps down from $40,000.00 to $0.00. So here's your answer: we can't pay Riverton until funds clear, the statement is signed, the Payoff Letter is in hand and Atty. Thorne signs."
  },
  "job": {
   "say": "Here's how it runs on the job. When a settlement is agreed or tendered, request the payee's W-9 the same day and send it back with the signed release, so accounting never holds the check. When a carrier's draft release arrives, audit the parties, claims, indemnity, Medicare and confidentiality terms in the release audit, and route a redline memo; every over-broad line gets quoted and flagged before John Doe sees it. When a check arrives, confirm its release is signed, deposit it to IOLTA that day and log the clearance date: 09/04, 10/05 and 10/13, $40,000.00, all cleared by 10/20. And if a suit is pending, which isn't Track A, you prepare the stipulation of dismissal with prejudice, docket it and confirm the court entry."
  },
  "dodont": {
   "say": "Let's play Three Clues, One Rule. Three clues, you call Do or Don't, then name the rule. In play: matching each document to its signer, the release to John Doe, the Payoff Letter to the lienholder, the W-9 to the payee, a dismissal to the attorneys. Secure e-signature or an in-person signing, with a current notary stamp and ID matching “John Doe” exactly. The Kickback Protocol: say exactly what's missing and give a deadline. Cross-referencing invoice numbers, which is how we caught the 05/04/2026 duplicate. And the traps: a General Release that wipes out UM or the property-damage claim, checks against uncleared funds, payment instructions taken from an email without a phone check. And that indemnity clause? Not boilerplate. It's John Doe's promise that every lien gets paid.",
   "ask": "What makes it safe for John Doe to sign that indemnity promise?"
  }
 },
 "d3m4-a2": {
  "case": {
   "say": "This activity has two dates. Here's the first landing, 08/14/2026, from Keystone on KM-26-440871: the release to conclude the bodily injury claim on its $10,000.00 tender. They want Mr. Doe to sign before a notary and return the original, and the check issues once they have it. The consents requested from Harbor Point and Cardinal State on 08/13 are still pending. Let me read you one line from the draft: “all other persons, firms, corporations and insurers.” Who are those insurers on this file? Then we jump to 10/21/2026. All $40,000.00 had cleared by 10/20, John Doe signed the Settlement Statement this morning, both Payoff Letters are in Documents, and disbursement is set for 10/22.",
   "ask": "On John Doe's file, which carriers are hiding inside “all other … insurers”?"
  },
  "task": {
   "say": "Part one is dated 08/14. Audit Keystone's draft line by line in the release audit log: parties released, claims released, indemnity and hold-harmless, non-admission. Flag every line that reaches past Robert Smith, Keystone or the BI claim, say what it would cost John Doe, and route a redline memo to Atty. Thorne before John Doe sees anything. Part two is 10/21. Confirm every condition precedent, then queue one disbursement command per Net Sheet line in the Trust Ledger for his approval, and show the ledger reaching $0.00. You'll also take a live call with John Doe. Explain each Settlement Statement line down to {{netA}} as plain facts, show both reductions and Payoff Letters, route fee and future-injection questions to Atty. Thorne, and get his signed acknowledgment.",
   "ask": "Keystone wants the signed release back today. Who answers that?"
  },
  "check": {
   "say": "Before you log, check both parts. Part one: is the “all other … insurers” line quoted and flagged as reaching Harbor Point's $20,000 and Cardinal State's $10,000, $30,000 of the stack? Is the release limited to bodily injury, so Leah Moran's property-damage claim survives? Is the indemnity clause tied to the Lien Tracker? Memo routed 08/14, nothing discussed with Dana Whitfield, nothing sent to John Doe? Part two: arithmetic first. Five commands, fee $13,333.33, costs $486.75, Peach State $1,240.00, Riverton {{payoffA}}, John Doe {{netA}}, totaling $40,000.00 and leaving $0.00. Then the conditions precedent. A command queued before 10/20 fails the block, however accurate. Every packet complete, W-9s current, payment details verified by phone, and every command left for Atty. Thorne to sign.",
   "ask": "Under an ultimatum to sign within the hour or lose the tender, what do you do first?"
  }
 },
 "d3m4-kc": {
  "questions": {
   "say": "This is the Final Accounting Check. Your answers come from this file, in your own words, typed under each question. Question one is the keystone: take John Doe's $40,000.00 to his {{netA}}, stream by stream, with fee, costs and liens, and explain the 25% and 75% split. If you can't do that without notes, the Net Sheet isn't finished yet. Question two: name the four document sets needed before the file is archived, the item on this file for each, and the retention period. Question three: after the 10/22/2026 disbursement the Trust Ledger reads $0.00. Which records prove it, and what would a leftover balance tell you?",
   "ask": "Can you carry $40,000.00 to {{netA}} down both streams without looking at your notes?"
  },
  "summary": {
   "say": "Now the Self-Summary, in your own words: the principles behind the Net Sheet, the release audit and the Trust Ledger. Then your next action between the $0.00 ledger on 10/22/2026 and the 10/30/2026 closing memo, and why. Before anyone writes, a pressure question for the whole room. A $1,540.00 balance, the gap between $3,400.00 and $1,860.00 on Crescent's injection, turns up on John Doe's account. Look at Peach State's EOB before you answer. And keep the scenario on screen in mind. A deadline is never a reason to let John Doe sign a release that reaches $30,000 of UM coverage.",
   "ask": "Is this a lien we missed, or a bill nobody owes?"
  },
  "scale": {
   "say": "Here's the last Skill Scale of the day. Score yourself 1 to 5 on each competency, from building a dual-stream Net Sheet that ties to the Trust Ledger, to holding the UPL boundary on releases, money and the client's questions. I'll put your rating next to your score, and any wide gap, high or low, is something we'll talk through together. As always, UPL is a gate, and a strong score doesn't survive an ethics breach. Submit it for review when you're done, and well done on Track A.",
   "ask": "Looking back over Track A, which competency grew the most for you?"
  }
 },
 "d4m1-l1": {
  "why": {
   "say": "Same file, same 08/05/2026 offer. On Track A, Keystone tendered. Here it doesn't. That's Track B, and it's where we live for the rest of the day. Keystone Mutual is sitting on the 14-Day Gap and it won't move. Now, remember the order of operations from Day 2: BI has to be exhausted before UM opens. So one carrier with a $10,000 limit is holding the entire $40,000 stack behind it. That little padlock on the slide is the whole problem. And here's your part in it. You're the engine room. Your job isn't to decide what happens next; it's to prove the impasse with dates and put a decision-ready record in front of Atty. Thorne.",
   "ask": "If one $10,000 carrier can freeze $40,000, what does that tell you about how carefully we have to document every date?"
  },
  "theory": {
   "say": "Let's get our vocabulary straight, because an impasse isn't a feeling. It's a stall the record proves. It starts with the stall itself, the adjuster's delay line, something like \"I'm waiting on authority.\" It's meant to wear you down. You log it; you never accept it. Every stall gets a rebuttal: a factual answer and a firm reply date. And a rebuttal that goes unanswered? That becomes evidence of impasse. Always ask the carrier to put its reasons in writing, because a named ground can be rebutted and a vague one can't. Finally, keep the four elements in your head: duty, breach, causation and damages. Any suit has to prove all four, so each one needs a verified exhibit behind it.",
   "ask": "Which of these have you met before, and where would it show up on John Doe's file?"
  },
  "rules": {
   "say": "Here's where Track B splits. Keystone holds at $3,500, calls it \"final\" on 08/12 and lets the demand lapse 08/21. We work the dispute path first, with evidence, new findings and the 09/02 supervisor escalation, and we document impasse on its triggers, not on frustration. By 09/04/2026 all five are on this file. Never bid against yourself. And know the cost: $40,000 frozen behind a $10,000 carrier, though exhaustion rules vary, so Atty. Thorne confirms. Filing is his decision; the inputs are yours: RPD-26-018842, Ruth Calloway, the doorbell video, the MRI, {{specials}} in Specials, SOL 02/06/2028, cutoff 11/05/2027. Record the lapse, don't interpret it. You document and ask; you never recommend suit, value the claim, assess Robert Smith's exposure, or advise John Doe on the $3,500. A new number from Keystone goes to Atty. Thorne the same day.",
   "ask": "Keystone hasn't said no. It has said nothing. When does silence become an impasse, and who decides that it has?"
  },
  "job": {
   "say": "Let me walk you through how this actually runs on a Tuesday. An offer gets repeated, or a demand deadline passes without acceptance. That's a trigger, so you log it in the CMS Communications Log with its date and its proof; every trigger dated and tied to a document. Then the follow-ups go unanswered. You escalate to the adjuster's supervisor through the Email Workspace, and you send no new number. That escalation asks for Keystone's written position and evidence, and it reopens no deadline unless Atty. Thorne approved the wording. When the escalation window closes in silence, you assemble the impasse record and the filing inputs, and route it to him through Tasks, Escalate, with the SOL and internal dates on it.",
   "ask": "When the supervisor escalation goes unanswered, why do we route the record to counsel instead of trying one more follow-up?"
  }
 },
 "d4m1-a1": {
  "case": {
   "say": "Here's what just landed on the file, dated 09/08/2026. It's from Atty. Thorne: \"Got your 09/04 escalation task. Keystone has said nothing since the 09/02 supervisor escalation. Before I decide anything, send me the full impasse memo today.\" Here's the background. Keystone, Dana Whitfield on claim KM-26-440871, offered $3,500 on 08/05, citing the 14-Day Gap and a \"degenerative\" MRI. Our 08/06 rebuttal sent Dr. Helen Park's read, Dr. Reyes's 06/19/2026 Causation Letter, the EMS report and the Gap Explanation Record. On 08/12 Keystone called $3,500 \"final.\" The demand lapsed 08/21. Follow-ups on 08/24 and 08/31 got nothing, and so did the 09/02 escalation. Before you write a single sentence, build your chronology. The dates are the memo.",
   "ask": "Before you draft anything, which event on this chronology are you least sure you can prove?"
  },
  "task": {
   "say": "You're drafting the impasse memo to Atty. Elijah Thorne in the Action Plan Editor, pulling proof from the Communications Log and routing it through Tasks, Escalate. Start with a dated chronology from the 07/20/2026 demand through 09/04, every event tied to its proof. State Keystone's grounds and the rebuttal evidence it never answered. Show the frozen stack layer by layer, $30,000 of the $40,000 locked behind BI, with the documented Specials. Then the clock: SOL 02/06/2028, hard date 02/04/2028, cutoff 11/05/2027. End with the decisions you need from him, framed as questions. That's the graded judgment here. The memo documents and asks; it recommends nothing, because filing is his call.",
   "ask": "What is the one thing this memo must not contain?"
  },
  "check": {
   "say": "Before you log this, check it hard. Your chronology runs 07/20 through 09/04 in order, and every event has a receipt, sent email or log entry behind it. An attempt with no proof is an assertion, not a record. Quote Keystone's grounds as Keystone gave them, and list the unanswered rebuttal. Show the whole stack: $10,000 BI unexhausted, $20,000 Host UM and $10,000 Relative UM closed. If your memo says \"$10,000 available, UM pending,\" fix it. Specials are {{medicalAudited}} plus $1,584.00, so {{specials}}. Clock dates are right, routed Tuesday 09/08 after Labor Day. Your decisions are questions, with no recommendation and no new number to Keystone. Could he decide from it in five minutes?",
   "ask": "Does any sentence in your memo read like advice instead of a question for Atty. Thorne?"
  }
 },
 "d4m1-l2": {
  "why": {
   "say": "Look at that dashed pill that says PENDING. Here's my question: on 09/10/2026, what goes in the case-number field? Anything but \"Pending\" is a guess, and a guessed number ends up on a pleading. That's why this lesson matters. Once Atty. Thorne authorizes suit, a court clock replaces the adjuster's clock. Status, court fields, folders and calendar all have to change together. If they don't, you get a pre-lit file running on pre-lit habits while real court deadlines tick away. And later on, this file is going to meet two neutrals with very different power, so we'll start building that picture today too.",
   "ask": "On 09/10/2026, before anything is filed, what do you type in the case-number field?"
  },
  "theory": {
   "say": "Filing the Complaint is what formally starts the lawsuit. From that moment the file moves out of negotiation and into court procedure, and later it'll meet a neutral the parties select or a court appoints. Counsel drafts the legal arguments in the Complaint; you verify the factual foundation underneath them. It has five sections you'll check against the file: caption, jurisdiction, factual allegations, causes of action and the prayer for relief. Before counsel signs, you confirm the Statute Date, the defendant's exact legal name, and for a business, its Registered Agent. And when we get to arbitration, AAA or JAMS sends a panel strike list. Each side vets, ranks and strikes names before a docketed cutoff.",
   "ask": "Which of these pre-filing checks have you seen before, and where would John Doe's file need one?"
  },
  "rules": {
   "say": "Status changes to Litigation only on Atty. Thorne's dated authorization, and it cites it. The fee follows the filing: 33⅓% pre-suit, 40% once suit is filed. Fill court fields only from the record; until filing, the number reads \"Pending.\" Build the litigation directory at transition, DOE, JOHN - CASE FILE with folders 01 through 05, ready for the 09/24/2026 filing. Name every PDF properly, never scan001.pdf, and docket deadlines the day a document arrives. Seed the calendar: SOL 02/06/2028, hard date 02/04/2028, cutoff 11/05/2027, 48-hour audits. Notify the UM carriers in writing as Atty. Thorne directs, with no figure. Preserve the doorbell video unaltered and request preservation of what others hold. A binding award generally can't be appealed. You run fields, folders and logistics; what anything means for John Doe is Atty. Thorne's to explain, and at a hearing you never speak for him.",
   "ask": "Which moves John Doe to the 40% tier: the status change or the filing?"
  },
  "job": {
   "say": "So how does this play out at your desk? Atty. Thorne authorizes suit, and that's your trigger. You change the status and open the court fields in Case Summary and Litigation, citing his dated authorization, with the case number still \"Pending.\" Once status changes, you build the master directory and all five sub-folders under Documents, named exactly to the standard. With folders built, you seed the Litigation Calendar, making sure the SOL, the internal hard date, the cutoff and the 48-hour audits are all there. Later, when a panel list or a proposed neutral arrives, you pull resumes and prior-award history for Atty. Thorne and docket any strike deadline the same day. The strikes themselves are his call.",
   "ask": "A panel strike list lands on your desk. What do you do before the end of that day?"
  }
 },
 "d4m1-a2": {
  "case": {
   "say": "This one landed on 09/10/2026, from Atty. Thorne: \"Yesterday I authorized suit against Robert Smith in the State Court of Riverton County, filing target 09/24/2026, and went over the fee tier with John. Transition the file today.\" He wants impasse notices drafted to Harbor Point, that's Marcus Bell on HP-26-7741, and to Cardinal State, Teresa Okafor on CS-26-20355, plus preservation requests for the doorbell video and the Escape's data recorder, all for his signature. Keep in mind Harbor Point's UM policy has an arbitration clause, the video copy was secured 02/19/2026, and the 2020 Ford Escape is Kevin Alvarez's. We'll run this as a live CMS session, and as you make each change, I want to hear the authority behind it out loud.",
   "ask": "When you change the status, what exactly will you say is the authority behind it?"
  },
  "task": {
   "say": "You're working live in the CMS: Case Summary, Litigation, Documents, Outgoing, and the Calendar. Set the status on the 09/09 authorization. Open the court fields without guessing a case number. Record the fee tier exactly as the retainer sets it. Build the five litigation folders to firm standard. Draft both UM notices and the preservation requests for the doorbell video and the Escape's event data recorder, all for his approval. Open the ADR fields and seed the Litigation Calendar with 48-hour audits. When you're done, you hand in a file in Litigation status where every field, folder, notice, preservation step and date rests on Atty. Thorne's authority. The graded part is what those notices may and may not say.",
   "ask": "Marcus Bell calls after reading your notice and asks what you're demanding. What do you say?"
  },
  "check": {
   "say": "Run down your work before you log it. Status is Litigation dated 09/10/2026, citing the 09/09 authorization. The court is the State Court of Riverton County, case number \"Pending, assigned on filing.\" Fee tier: 40% from the filing date, not 09/10, and you note his discussion with John Doe without explaining it. Five folders, named exactly. Both notices state impasse and intended suit, carry their own claim number, have no figure, and go for approval. Now preservation, the step people skip because the video was secured in February. Request that Margaret Doe keep what she still holds, and draft the data recorder request to Kevin Alvarez and Harbor Point. Flag the arbitration clause and UM deadlines as questions. Calendar: 09/24 filing, 09/22 audit, plus the SOL dates.",
   "ask": "What does Margaret Doe still hold today, and who holds the Escape's event data recorder?"
  }
 },
 "d4m1-kc": {
  "questions": {
   "say": "Okay, time for the Learning Check. Answer each question from this file, in your own words, and type your answer right under the question. Start with question 1, because it's the foundation: explain the fork, what's the same on Track B as on Track A, what changes on 08/12/2026, and why a $10,000 carrier freezes all $40,000. If you can't explain that last part in plain words, flag me, and we'll revisit Day 2's order of operations together before moving on.",
   "ask": "Can you explain, in one sentence, why $10,000 freezes $40,000?"
  },
  "summary": {
   "say": "Next is your Self-Summary. Put the principles in your own words, not mine. Then work the scenario. It's 09/04/2026, Keystone has ignored two follow-ups and the 48-hour escalation, and John Doe calls asking why nothing's happening and whether he should just take the $3,500. Tell me what you say, what you don't say, and what goes to Atty. Thorne today. The strong answer takes the question down, tells John it's going to Atty. Thorne today, and gives no view on the $3,500 and no explanation of the fee.",
   "ask": "When John asks if he should take the $3,500, what are the first words out of your mouth?"
  },
  "scale": {
   "say": "Last step: the Skill Scale. Rate yourself on each competency from 1 to 5, honestly, and then submit it for review. I'll be comparing your self-rating against your score, and if there's a wide gap either way, we'll talk it through. One thing to remember, though: UPL is a gate. A strong score doesn't survive an ethics breach.",
   "ask": "Where do you expect your self-rating and your score to disagree most?"
  }
 },
 "d4m2-l1": {
  "why": {
   "say": "I'm writing a date on the board: 02/06/2028. That's John Doe's statute of limitations. Quick, what day of the week is it? It's a Sunday, and that matters more than you'd think. Here's the bigger picture. Keystone's stonewall on the 14-Day Gap pushed this file onto court time. From 09/24/2026 on, its dates are set by rule, order and statute, and they don't move because a carrier goes quiet or a client can't be reached. One miscounted day can concede a fact or end a claim. That's why you'll see two orange pins stepping back from that Sunday. Those are the dates we actually live by.",
   "ask": "What day of the week is 02/06/2028, and why should that make us nervous?"
  },
  "theory": {
   "say": "Once suit is filed, the whole game changes. Statute, rule and order set the dates, and your documents stop being administrative tracking and start being evidence. A missing or misfiled page isn't a clerical slip anymore; it can jeopardize a trial. Litigation runs on recurring court processes you'll execute every single week, each one driven by the calendar. Lots of steps carry a built-in wait, like the notice to opposing counsel before a third-party subpoena, and you docket that wait just like a deadline. And even when the deadline belongs to someone else, say a records office, you still check in days ahead. Their miss becomes your problem.",
   "ask": "Which of these court habits will feel most different from how you ran the file pre-suit?"
  },
  "rules": {
   "say": "A hard rule is a date fixed by statute, court rule, order or a forum's rules; miss one and the claim can go. Every date here is configured for this training file, and Atty. Thorne confirms the real rule. Exclude the trigger day, include the last: Robert Smith was served 10/14/2026, so his answer was due 11/13/2026. Watch the mailbox trap: this file's rules add 3 days for mail, though e-service adds nothing. Forward counts roll to the next business day; backward counts roll earlier. RFAs get their own entry, since unanswered ones may be deemed admitted. The Sunday SOL becomes an internal hard date of 02/04/2028 and a cutoff of 11/05/2027, both live until he releases them. Read every verb in the Scheduling Order. When unsure, docket the conservative date and flag it. You compute and docket; you never pick the rule or agree an extension.",
   "ask": "Discovery was mailed to us on 12/01/2026. Walk me through every step: when are John Doe's responses due?"
  },
  "job": {
   "say": "Picture the week of 12/10/2026. The Scheduling Order gets entered, and that same day you enter every date in the Docket System with its trigger, rule, owner and alerts, reading each verb, so \"completed by\" goes in as a deadline. The discovery that came by mail on 12/01/2026? You count 30 plus 3, see it lands on a Sunday, move it forward, and enter the RFAs separately in the Conflict Resolver, so responses and RFAs both sit at 01/04/2027 with the deemed-admitted flag set. On SOL review, 02/04/2028 and 11/05/2027 go on the CMS Calendar, and nothing relies on 02/06/2028. Then when arbitration is invoked on 04/05/2027, you hard-code 06/02, 06/11 and 06/22/2027 with alerts the same day.",
   "ask": "Why do the RFAs get their own entry instead of riding along with the rest of the discovery?"
  }
 },
 "d4m2-a1": {
  "case": {
   "say": "It's 12/10/2026, and here's what landed from Atty. Thorne: \"The Scheduling Order was entered today; it's attached with the discovery Mercer mailed us on 12/01. While you were out, the calendar was re-keyed from the paper file: nothing verified, no alerts. Audit every entry against the order, the discovery and the SOL, correct what's wrong, and send me the correction log.\" The case is No. 26-CV-04417. The discovery is 25 Interrogatories, 30 Requests for Production and 15 RFAs. The order sets plaintiff's expert disclosure 03/15/2027, defense 04/15/2027, mediation completed by 03/31/2027, discovery closing 05/28/2027, pretrial 08/12/2027, trial 09/13/2027. I'm handing you the staged calendar. Before you recompute anything, initial the entries you'd sign your name to.",
   "ask": "How many errors do you think are hiding on this calendar?"
  },
  "task": {
   "say": "You'll audit John Doe's calendar in the Case Docket and Calendar Conflict Resolver, against the 12/10/2026 order, the discovery mailed 12/01/2026 and the 02/06/2028 SOL. Recompute every entry from its trigger document: trigger day out, 3 mail days in, forward counts to the next business day, backward to the earlier one. Correct the errors, add what's missing, leave correct entries alone. Each entry gets its trigger, rule, arithmetic, owner and alerts, mirrored to the CMS Calendar. Rank errors by risk, log corrections in Case Notes and route them to Atty. Thorne. Heads up: Jenna Price, Atty. Mercer's paralegal, will call. Agree to nothing, log her words verbatim, and route it today.",
   "ask": "12/31/2026 is wrong and 11/08/2027 is wrong. Which one could cost John Doe his claim?"
  },
  "check": {
   "say": "Here's what your audit should show before you log it. Responses corrected to Monday 01/04/2027, since 12/01 plus 30 plus 3 lands on Sunday 01/03. The RFA entry added, all 15 due 01/04/2027, flagged deemed admitted if unanswered. People fix what's on the screen and miss what isn't, and that's the nearest, most severe deadline here. Expert disclosures un-swapped. Mediation entered as completed by 03/31/2027. Internal hard date 02/04/2028 added. Filing cutoff corrected from 11/08/2027 to 11/05/2027, rolled earlier, never forward. Correct entries verified and left alone. Errors ranked, rights ahead of time. Many courts accept a Monday filing after a Sunday deadline, but the firm won't rely on it, and calling opposing counsel about an extension fails the authority row.",
   "ask": "Did you recompute each date from its trigger document, or from the entry you were checking?"
  }
 },
 "d4m2-um": {
  "why": {
   "say": "Before we talk procedure, one question. Whose insurance company are we fighting? Keystone insured Robert Smith, the man who ran the stop sign, so that claim is against somebody else's carrier. Harbor Point and Cardinal State are different. They are John's own coverage, under contracts he can call on, and that changes what this file is. When Harbor Point came back with eight thousand dollars against a twenty thousand dollar limit, we did not simply head for court the way the bodily injury claim would have. Harbor Point's own policy says where a dispute under it is decided, and reading that clause is our job before a single date goes on the calendar.",
   "ask": "What changes about a claim when the insurance company on the other end of it is our own client's?"
  },
  "theory": {
   "say": "Let's name the two shapes. A third-party claim is made against the at-fault driver's carrier: Keystone, for Robert Smith. A first-party claim is made against your own insurance, on the policy you pay the premiums for. Here that is Harbor Point for Host UM and Cardinal State for Relative UM. Plain English for the client: one is a claim against the other driver's insurance, the other is a claim against your own. Then there is the mandatory arbitration clause, a policy term that sends the dispute to an arbitrator, so the firm files a Demand for Arbitration instead of a complaint. And off to one side, insurance bad faith: a separate suit about unreasonable handling, which can reach above the policy limit.",
   "ask": "Why would a carrier rather have a UM dispute heard by an arbitrator than by a jury?"
  },
  "rules": {
   "say": "Start by knowing which claim you are on, because the evidence is the same but the relationship is not. Next, John's own Bluewater policy is not a UM layer at all: he rejected UM in writing in March of twenty twenty-four. He reaches UM by status instead, as an occupant of Kevin Alvarez's Escape and as a resident relative of his mother, Margaret. Third, and say this one back to me later: the route is read, never chosen. State law and the clause in the policy the claim is made under decide it. Fourth, read each layer on its own. Harbor Point's clause does not speak for Cardinal State. And every route carries its own clock, which is not the tort statute of limitations in February of twenty twenty-eight. Ask Atty. Thorne in writing, and docket only from his answer.",
   "ask": "If Harbor Point's policy has an arbitration clause, what do we know about Cardinal State's?"
  },
  "job": {
   "say": "On the job this is four triggers. When the UM offers come back low, you write the impasse memo the same day and you pull both carriers' dispute-resolution clauses from the certified policies, quoted and not interpreted. When the clauses and the statute are in hand, you lay the route options before Atty. Thorne as findings, with each layer's own filing or demand deadline put to him as a question. When he decides in writing, you record it: the ADR entry typed as UM slash UIM arbitration, how it was set as required by the policy or contract, and the case status matching the route. And when arbitration is invoked, you docket the hearing and everything counted back from it, and you tell John what happens procedurally and nothing more.",
   "ask": "Which of those four steps is the one trainees skip, and what does skipping it cost?"
  }
 },
 "d4m2-l2": {
  "why": {
   "say": "Two names, side by side: Hon. Carla Benton (Ret.) and Laura Whitcomb, Esq. Tell me what each one can do to John Doe's case. Judge Benton is our mediator, and she can't decide anything. She can only help the parties agree, and any deal needs John's agreement, through Atty. Thorne. Laura Whitcomb is the arbitrator, and she decides. Her award stands with almost no appeal. These two sessions are three months apart, and here's the danger. If you prepare for both the same way, you'll walk a compromise file into a trial-ready hearing. That's the mistake this lesson is built to prevent.",
   "ask": "What can Hon. Carla Benton do to John Doe's case that Laura Whitcomb can't, and the other way around?"
  },
  "map": {
   "say": "Before we name either neutral, look at where these sessions sit. Treatment ends, the demand goes out, the carrier evaluates it. If both sides want to avoid court costs, legal fees and a public record, they can mediate right there, before a single page is filed. Arbitration can come that early too, but only where the client signed a clause that sends the dispute out of court, like rideshare terms or a treatment consent. When negotiation fails, as it did with Keystone, the complaint is filed and the court's clock starts. Discovery runs, and many courts order mediation before they will give you a trial date. After that, the parties can agree to binding arbitration, or the case is tried. Both of John Doe's sessions sit on the filed side of that line.",
   "ask": "Does mediation happen before a lawsuit is filed or after it?"
  },
  "theory": {
   "say": "Two words, and I want you saying them in plain language. Non-binding, which is mediation: both sides have to agree, so nobody is forced to settle and the parties keep control of the outcome. Binding, which is arbitration: the decision is final and enforced like a court order, and a court will only look at it on very narrow grounds. Then where each one sits. Before filing, mediation usually comes after treatment and the demand, and arbitration comes only where a signed clause compels it. After filing, mediation is often ordered during discovery, and arbitration happens when the parties agree to leave the court system. Those four cards are what you explain to John Doe. What either one does to his claim is Atty. Thorne's to tell him.",
   "ask": "Say it to me as you would to John Doe: what does non-binding mean, and what does binding mean?"
  },
  "rules": {
   "say": "Mediation is facilitated compromise: non-binding and confidential under the governing rule. Court-ordered means John Doe must attend, not agree. Binding arbitration, like Harbor Point's clause, makes the arbitrator the judge, with narrow court review. Here, BI settled at mediation on 03/18/2027, and the UM carriers' dispute over the gap went to a decision. Know the limits: damages are reduced first by the $10,000 BI paid, Harbor Point pays above that up to $20,000, Cardinal State's $10,000 behind it, and how an award applies is Atty. Thorne's analysis. For mediation, collect 3 to 4 windows first, book a private room, check the interpreter, hold his 2-hour buffer. For arbitration, contact the arbitrator's office only as he directs, and confirm the retainer in writing. And the Golden Rule: you never argue, speak on the record or represent John Doe. Asked about a bill, you defer and hand him the document.",
   "ask": "The mediation was court-ordered. Did John Doe have to settle?"
  },
  "job": {
   "say": "Let's run the real sequence. The order requires mediation by 03/31/2027, so before you ever contact the mediator's office, you collect 3 to 4 windows from Atty. Thorne, John Doe and opposing counsel in the Calendaring Simulators, and you make sure the session lands inside 03/31/2027. Opposing counsel rejects every window? You log the pushback and escalate the same day for an attorney-to-attorney call. Later, the arbitrator's fee schedule and retainer request arrive. You confirm the schedule, route the retainer to accounting, send the internal invites, and get payment confirmed in writing before the hearing. And when a directive comes from the bench, you log it as given in Case Notes, calendar it and memo Atty. Thorne that same day.",
   "ask": "Opposing counsel says no to every window you offered. What's your very next move?"
  }
 },
 "d4m2-a2": {
  "case": {
   "say": "Fast-forward to 04/05/2027. The 03/18/2027 mediation before Hon. Carla Benton (Ret.) produced Keystone's $10,000 BI tender. BI is exhausted, the UM consents are in, and Robert Smith is dismissed. Now Atty. Thorne writes: \"Harbor Point and Cardinal State dispute damages, citing the gap. Harbor Point has invoked its UM arbitration clause and Cardinal State joins: one binding arbitration before Laura Whitcomb, Esq., hearing 06/22/2027.\" He wants the rules matrix, the exhibit and brief dates docketed today, and a map of what you do at the hearing. As configured for this file, exhibits are exchanged 20 days before the hearing and the brief is due 10 days before. Before anyone opens the editor, let's build two columns on the board.",
   "ask": "What changes operationally when a file moves from mediation to arbitration?"
  },
  "task": {
   "say": "In the Action Plan Editor, you'll build the ADR rules matrix with two columns, the 03/18/2027 mediation and the 06/22/2027 arbitration. The rows cover the neutral and her power, binding effect and appeal, confidentiality, the opposing parties, the limits in play, the preparation standard, your hard dates and the logistics. Today you'll also hard-code the arbitration dates on the CMS Calendar, counting back from the hearing, with alerts. Then map the UPL boundary for the hearing: what you do, what you never do, and the exact words you'd say if Laura Whitcomb, Esq. asks you about a bill. You'll hand in the matrix, the docketed dates and a one-page boundary map, all routed to Atty. Thorne.",
   "ask": "On 03/18/2027 the other side was Robert Smith. Who is it on 06/22/2027, and what are they disputing?"
  },
  "check": {
   "say": "Check your matrix before you log it. Mediation: Hon. Carla Benton facilitates only, non-binding, held 03/18/2027 inside 03/31/2027. Arbitration: Laura Whitcomb acts as judge, binding award, narrow review, under Harbor Point's clause with Cardinal State joined. Opposing parties went from Robert Smith to the UM carriers, who are now the other side. Limits in play: $20,000 plus $10,000, so $30,000. Exhibits 06/02/2027. The brief is the trap: 10 days back is Saturday 06/12, so it moves to Friday 06/11, never Monday 06/14. Logistics and your UPL map are in. And your deferral: \"I'm the Case Manager providing administrative assistance; Atty. Thorne will address that.\" If you audited the Riverton Spine & Rehab bill, you'll want to answer. Don't.",
   "ask": "Say your deferral line out loud once: what are the exact words you'll use at the hearing?"
  }
 },
 "d4m2-a3": {
  "case": {
   "say": "It is the second of October twenty twenty-six, and we are on Track B. The UM demands went out at the end of August, after Keystone tendered its ten thousand in bodily injury limits on the twelfth with both UM carriers' written consents and a Limited Release signed on the twenty-eighth. Now the answers are in. Marcus Bell at Harbor Point offers eight thousand against a twenty thousand dollar Host UM limit, and he is calling the fourteen-day gap a causation problem. Teresa Okafor at Cardinal State offers six thousand against ten thousand. Harbor Point's policy has a binding arbitration clause. Cardinal State's certified policy was requested and has not arrived.",
   "ask": "Fourteen thousand offered against thirty thousand of limits. What is our first move, and what is not?"
  },
  "task": {
   "say": "Route the impasse. Write the memo to Atty. Thorne: the offers set against the limits, Harbor Point's stated reason, and each layer's dispute-resolution clause quoted word for word, with Cardinal State's marked as outstanding. Lay out both routes and what each would require operationally. Then ask him three things in writing: which route governs on each layer, each layer's own suit or arbitration-demand deadline, and whether the two should be heard together. Set the CMS up to carry his answer, with the ADR entry, the status, and a task per open question. Draft the calendar entries, but do not save them. Then write what you will say to John when he calls to ask what happens now.",
   "ask": "Why do we draft the calendar entries and hold them instead of simply docketing them today?"
  },
  "check": {
   "say": "Check your work against this. Both claims named as first-party claims, distinct from the Keystone claim that closed in August. The figures exact, with their dates. Exhaustion documented rather than assumed. Harbor Point's clause quoted and called binding, with no interpretation. Cardinal State treated as its own layer, its certified policy marked outstanding, with a chase task, and Harbor Point's clause never read onto it. Both routes laid out with their operational consequences. Bad faith raised only as a question, with the handling dates recorded as facts. Three written questions asked. Nothing docketed, and the tort statute of limitations not used as a UM deadline. And the explanation to John procedural only: what a Demand for Arbitration is, that a neutral decides rather than a jury, and that Atty. Thorne will go through what it means.",
   "ask": "Whose work would you rather hand to Atty. Thorne: the memo with an answer in it, or the one with three questions?"
  }
 },
 "d4m2-kc": {
  "questions": {
   "say": "Into the Learning Check, three questions, one for each part of this module. Question 1 is all the date arithmetic in one: the discovery mailed on the first of December, the Sunday statute of limitations, both weekend directions, and what happens to an unanswered Request for Admission. Show me the working, not just the dates. Question 2 is the UM side: the two routes out of an impasse, what decides which one governs, where a bad-faith action sits, and why John’s own Bluewater policy is not a route. Question 3 puts mediation and arbitration on the timeline and asks for non-binding and binding in the words you would use with him.",
   "ask": "Which of those three would you least like Atty. Thorne to find wrong in your answer, and why?"
  },
  "summary": {
   "say": "Now write your Self-Summary: the principles from this module in your own words. Then take the scenario on the slide. It's 09/04/2026, Keystone has ignored two follow-ups and the 48-hour escalation, and John Doe calls asking why nothing's happening and whether he should just take the $3,500. Write what you say, what you don't say, and what goes to Atty. Thorne today. While you're writing, think about one date on this file you'd always check twice.",
   "ask": "Which single date on this file would you check twice, and why?"
  },
  "scale": {
   "say": "To finish, fill in the Skill Scale. Rate each competency from 1 to 5, honestly, and submit it for review. I'll put your self-rating next to your score, and where there's a wide gap, we'll talk it through. Same as every day, UPL is a gate. A strong score doesn't survive an answer that speaks for John Doe at the hearing or tells him whether to take a number.",
   "ask": "Which competency here are you least sure you could perform under pressure at a live hearing?"
  }
 },
 "d4m3-l1": {
  "why": {
   "say": "Let me start with a question. What happens if Atty. Thorne gets an unorganized file the morning of the mediation? Think about it for a second. He loses momentum. He looks unprepared in front of the mediator. And he may concede a point simply because he couldn't find the proof in time. Remember, Keystone's stonewall on the 14-Day Gap is the reason John Doe's file is in suit at all. At the 03/18/2027 mediation, Atty. Thorne will have minutes to answer that argument. So every record, every figure, every quote has to sit in a known place. A binder he has to hunt through costs momentum, and it can cost a concession.",
   "ask": "What happens if Atty. Thorne gets an unorganized file the morning of the mediation?"
  },
  "theory": {
   "say": "Think of the Mediation Binder as the attorney's cheat sheet. It holds the case's most critical documents, compiled so counsel never fumbles during a fast-paced compromise session. It opens with the executive summary and administration, a one-page snapshot that sets the framework: the parties, the order, the schedule. That's the first thing Atty. Thorne sees. Next come the mediation briefs, both sides' arguments read side by side, so he can prepare rebuttals before anyone sits down. Then the core pleadings, the filed documents that define what this suit is actually about. Those first three sections set the stage, and we'll pick up the other three on the next slide.",
   "ask": "Which of these first three sections have you already started building on John Doe's file without realizing it?"
  },
  "rules": {
   "say": "The binder is Atty. Thorne's and the mediator's road map, indexed so any document is found in five seconds. Six numbered sections, fixed order, each tab matching one master index in the CMS, the single source of truth. The binder prints from the index, never the reverse. Exhibit numbers belong to the proceeding, Bates numbers to the page. Section three holds only the 09/24/2026 complaint and 11/12/2026 answer, which pleads comparative negligence, causation and failure to mitigate. Section five's ledger ties to the certified invoices, with the duplicate removed, $6,290.00 down to $6,105.00, for {{specials}} total. Section six fixes Keystone's $3,500 baseline and holds a draft Limited Release. You're the QA auditor: OCR-searchable, statement delivered by 03/11/2027, audited 48 hours out. Arguments, positions and every number are his, and you never discuss value with anyone.",
   "ask": "Where do you find the mediator's fee split, and why can't you just assume it's 50/50?"
  },
  "job": {
   "say": "Here's the flow once the mediation is set for 03/18/2027. You open the master index under Documents and seat each document in exactly one section, so every entry has its section, exhibit number, Bates range and source. Once the pleadings and evidence are indexed, you go to the Pleadings Log and check each defense pleaded in the answer against sections four and five. Every pleaded defense needs an answering exhibit, or a flag to Atty. Thorne. Then, with the binder assembled, you OCR it, bookmark it, QA it against the index and route it for approval. It has to be text-searchable, approved, and delivered by 03/11/2027.",
   "ask": "A pleaded defense has no answering exhibit in sections four or five. What do you do with it?"
  }
 },
 "d4m3-a1": {
  "case": {
   "say": "It's 03/04/2027, and this just came from Atty. Thorne: \"Mercer writes that Keystone will not put a real number on the table while our medical ledger is unverified. The draft binder carries Riverton at $6,290.00 and Crescent as an open balance. Rebuild it from the master index and audit it.\" The statement and binder go to Hon. Carla Benton (Ret.) by 03/11/2027, routed to him first, for the 03/18/2027 mediation. John Doe was deposed 02/18/2027, and the certified transcript's in the file. Riverton Spine & Rehab's Final Itemized Ledger, requested 02/08/2027, followed up 02/22 and red-flagged 03/01, still hasn't arrived. Now, see those two red landmine chips? Who spotted them in the draft before I pointed?",
   "ask": "Who spotted those two landmines in the draft before I pointed them out, and what tipped you off?"
  },
  "task": {
   "say": "You'll assemble the six-section Mediation Binder in the CMS, working from the master index and starting with the 07/20/2026 Demand Package. Seat each document in one section with its exhibit number and Bates range, and map every allegation in the 11/12/2026 answer to the exhibit that answers it. Then run the pre-mediation audit. Rebuild the ledger from the certified bills you have to {{specials}}, and cross-check each provider balance against what PIP and Peach State already paid. Add the Negotiation Log, a draft Limited Release and the UM consent requests. You'll hand in an indexed, searchable binder with an audited ledger, a lien summary and a short memo on both landmines, routed to Atty. Thorne.",
   "ask": "Atty. Mercer says the ledger is unverified. Is he wrong?"
  },
  "audit": {
   "say": "This is the index the Litigation Desk assembled on the second of March, and Atty. Mercer says Keystone won't put a real number on the table while the medical ledger is unverified. On this draft he's right. Section five was typed from the providers' original bills, so Riverton Spine and Rehab comes in at six thousand two hundred and ninety on thirty-four lines and the medical total reads fifteen thousand and two forty, against the fourteen thousand eight hundred and seventeen forty we served in July. Crescent shows as an open balance Peach State already paid. Call every section, and tell me what's missing as well as what's wrong. When you hand it in you'll see the binder as we delivered it on the eleventh of March.",
   "ask": "Two medical totals for one file. Which one would you defend in that room?"
  },
  "check": {
   "say": "Before you log this, run your checks. Section one's snapshot has LSH-2026-MVA-770412, No. 26-CV-04417, Atty. Mercer's verified contacts, and the fee split read from the order. Section three, only the filed complaint and answer. Your defense map gets graded hard: five allegations, five answers, each with an exhibit number, so \"see Medical Records\" isn't a map. Landmine one: Riverton audited to 33 visits at $185.00, $6,105.00, duplicate removed, pending final verification, for {{specials}}. Landmine two: Crescent's $3,400.00 satisfied by Peach State's $1,860.00, with open liens of {{openLiens}}. Section six's log runs from the 07/20/2026 demand to suit. The release and consent requests are drafts, so leave every term to Atty. Thorne. Then swap binders with your partner and QA each other's index.",
   "ask": "When you swap with your partner, which exhibit number in their defense map will you check first?"
  }
 },
 "d4m3-l2": {
  "why": {
   "say": "I'm holding up the Mediation Binder. This one persuaded. The next one is evidence. And I'm writing a date on the board: 06/02/2027. Everything in this lesson counts back from that exchange. Here's why it matters. On 04/05/2027, Harbor Point and Cardinal State picked up Keystone's gap argument, and Laura Whitcomb, Esq. is going to decide damages, bindingly. The Arbitration Binder is the record her award rests on. A page that's missing, illegible or not exchanged by 06/02/2027 may simply not count. No second chances.",
   "ask": "What's the difference between a binder that persuades and a binder that's evidence?"
  },
  "theory": {
   "say": "The Arbitration Binder isn't a reference packet. It's a trial-ready evidentiary record, handed straight to a private judge who decides. Your role here is operational: timelines, scheduling and documents, run with rigid precision. The arbitration brief deadline is the absolute cutoff for claims, exhibit indexes and witness lists, and it goes to the arbitrator and opposing counsel. The arbitration submissions are the foundational paperwork that sets the ground rules for the whole proceeding, which is why they lead the binder. And here's the scary part: a missing page or a grayscale print can be excluded, and with a binding award, there's no second chance to fix it.",
   "ask": "Which of these four ideas feels most different from how we built the Mediation Binder?"
  },
  "rules": {
   "say": "A binding award rests on the exhibits, with very limited review, so apply each tab's QC rule as you sort. The threshold leads: UM opens only because BI is exhausted, so prove it with Keystone's $10,000 tender, the consents, the Limited Release and Robert Smith's dismissal, never the Mediation Statement. Authenticate everything with business-records certifications from each provider, Riverton Fire, Riverton PD and Northgate HR. Keep video native, with the 02/19/2026 chain of custody, and print stills in color. Even if the forum relaxes evidence rules, build to the strict standard; admitted isn't persuasive. Number exhibits C-1 onward and freeze the set once exchanged. Nothing crosses over from mediation, and the Lien Sheet stays in Atty. Thorne's set. He decides what's argued, exchanged or withheld. You never argue an exhibit.",
   "ask": "Who can say the doorbell video is what we say it is?"
  },
  "job": {
   "say": "Here's how it unfolds. Arbitration's invoked on 04/05/2027, so you open the claimant exhibit index and put the 06/02/2027 exchange and the 06/11/2027 brief on the Docket System that day. As the provider records come in, you go through Medical Records Requests and ask each custodian for a business-records certification, one per provider, covering every date you're exhibiting. Custodians are slow, so don't wait. Once the exchange set is assembled, you route the set and every flagged item to Atty. Thorne through Tasks, Escalate. It has to be approved before 06/02/2027, with no privileged item anywhere in it.",
   "ask": "Why do we request certifications the same week the arbitration is invoked rather than once the binder's built?"
  }
 },
 "d4m3-a2": {
  "case": {
   "say": "Here's what landed on 05/17/2027: exhibit exchange in 16 days, and the Arbitration Binder isn't started. Zero of six tabs. The hard date is 06/02/2027, before Laura Whitcomb, Esq., on HP-26-7741 and CS-26-20355. Robert Smith was dismissed after Keystone tendered its $10,000 at the 03/18/2027 mediation, and the carriers are disputing damages over the gap. The unsorted folder holds a pre-filing draft of the Complaint, grayscale doorbell stills, the 09/08/2026 impasse memo, and a Lien Sheet listing Harbor Point PIP at $5,000.00 and Summit Imaging at $2,395.00. Crescent Pain & Spine's certified records, requested 05/05/2027, haven't come in. I'm putting four red traps on the board, then covering them before anyone sorts.",
   "ask": "Before I cover them, which of those four traps do you think you'd have missed on your own?"
  },
  "task": {
   "say": "You'll sort that folder into the six-tab Arbitration Binder using the Exhibit index, Medical Records Requests and the Lien Tracker, applying each tab's QC rule as you go. Lead with the BI exhaustion record, number every exhibit C-1 onward with its Bates range, and log each record's authentication. Then defuse both landmines. Build tab five's prior medical shield against the 2021 low-back visits defense counsel pressed at the 02/18/2027 deposition and the \"degenerative\" MRI reading from 08/05/2026, and strip the Lien Sheet to what's owed. Flag anything privileged for Atty. Thorne. You'll also take a call from Lori Banks at Crescent: identify the blockers, get a firm delivery date in writing, and log it.",
   "ask": "Harbor Point is the other side now. Our attorney's-set Lien Sheet says it is owed $5,000.00. What goes wrong?"
  },
  "audit": {
   "say": "The desk's exhibit index, the fourteenth of May, and Harbor Point is on the other side of this hearing now. Decide for each exhibit which tab it belongs in, or that it's withheld, and apply the QC as you sort rather than after. The Confidential Mediation Statement is sitting at C-2 for background. Nobody has asked a single provider for a certification, the authentication log hasn't been started, and tab one has no exhaustion record at all, so there's nothing proving the bodily injury layer is gone. And the Lien Sheet claims five thousand dollars for Harbor Point MedPay, which gave up any reimbursement right in writing in March. When you hand it in you'll see the set we exchanged on the second of June.",
   "ask": "Harbor Point is the opponent now. What changes about what we send?"
  },
  "check": {
   "say": "Check before you log. Tab one has the snapshot and the 06/11/2027 brief slot, never a draft. Threshold exhibits come first, the $10,000 tender, consents, Limited Release, dismissal and both Coverage Letters. Tab two holds operative versions only, with the pre-filing draft gone. Tab three has the certified RPD-26-018842 and color stills from the native file. Tab four ties {{medicalAudited}} to certified bills, with certifications requested from each provider. On tab five, pull and pair the 2021 records with the MRI read and Causation Letter, but don't argue causation; a supplemental opinion from Dr. Reyes is Atty. Thorne's call. The Lien Sheet drops Harbor Point and Summit, leaving {{openLiens}}. Tab six is wages, $1,584.00. And the impasse memo is the privilege test. It never goes in tab six.",
   "ask": "Where did you put the 09/08/2026 impasse memo, and who decides whether it's ever exchanged?"
  }
 },
 "d4m3-kc": {
  "questions": {
   "say": "Time for the Learning Check, and I want you to put your two master indexes side by side before you start. This check is about the binders you actually built, not your memory of my slides. Answer from the file, in your own words, typed right under each question. You'll name the six mediation sections with a document for each, explain what the master index records and why it's the source of truth, and trace the unbelted defense to the exhibits that answer it.",
   "ask": "Looking at your two indexes side by side, where do they differ most in how they're organized?"
  },
  "summary": {
   "say": "Now your Self-Summary: write the principles in your own words. Then take the scenario on the slide, John Doe on 09/04/2026 asking whether he should just take the $3,500, and write what you'd say, what you wouldn't, and what goes to Atty. Thorne. On question 7, the pressure scenario, the strong answer requests the missing records and a certification covering all 33 visits at once, tells Atty. Thorne that evening, and leaves the exchange to him. Never exchange a ledger its records don't support.",
   "ask": "Which document would hurt John Doe most if it were missing from these binders, and which would hurt most if it were included?"
  },
  "scale": {
   "say": "Last piece: the Skill Scale. Rate each competency from 1 to 5, honestly, then submit it for review. I'll put your rating next to your score, and if they're far apart, we'll talk about why. And remember, UPL is a gate here too. A strong score doesn't survive a privileged memo landing in an exchanged set.",
   "ask": "Which binder skill would you rate yourself lowest on right now, and what would move it up a point?"
  }
 },
 "d4m4-l1": {
  "why": {
   "say": "Put two numbers side by side for me: $10,000 and $40,000. How much of John Doe's coverage did Keystone's silence lock? All of it. That's what one unmanaged bottleneck costs. On Track B, Keystone held at $3,500 on the 14-Day Gap, then went quiet, and a $10,000 carrier froze the whole $40,000 stack and forked the file into suit. Here's the tricky part. Bottlenecks rarely look dramatic. They look like a quiet inbox, a record that's \"on its way,\" a date nobody's confirmed. Our job this module is to anticipate them and clear them before they cost us a deadline or an exhibit.",
   "ask": "How much of John Doe's coverage did Keystone's silence lock?"
  },
  "rules": {
   "say": "A bottleneck is any dependency that can stop the file reaching a hard date. Log it the day it starts, with the date it threatens, and age it daily. Follow up a silent adjuster every 5 business days: Keystone left 08/24 and 08/31/2026 unanswered, then the 09/02 escalation. Silence is a position, so record it as dated facts, never \"adjuster busy.\" A record unanswered after 14 days is a bottleneck, and the biggest mediation one is an unverified ledger: {{specials}}, Riverton at $6,105.00, Peach State at $1,860.00. Get verified ledgers to Keystone in time for an authority raise, the brief to Hon. Carla Benton by 03/11/2027, and stills printed in color. Shield the 2021 low-back visits as Atty. Thorne directs. Sync windows before offering dates. You chase, document and flag; legal remedies and value talk are his.",
   "ask": "When did the Keystone bottleneck start: 08/21, 08/24 or 09/04?"
  },
  "job": {
   "say": "Let's run it like a real week. A follow-up goes unanswered, so you log it in the Communications Log with date, time, method and outcome, and you date the next follow-up five business days out. When the second one goes unanswered, you open an entry in the Bottleneck Log with the blocker, the start date and the hard date it threatens. For Keystone, the start date is the first unanswered request, 08/24/2026. When a proposed ADR date comes in, you run it through the Conflict Resolver against every party's window, so no mediation date after 03/31/2027 ever reaches Atty. Thorne as available. And when a binder dependency is still open 10 days out, you red-flag it, like the 03/01/2027 flag for the 03/11/2027 binder.",
   "ask": "Why does the bottleneck's start date go back to the first unanswered request instead of the day it started hurting?"
  }
 },
 "d4m4-a1": {
  "case": {
   "say": "This landed on 02/22/2027: record overdue 14 days, Riverton Spine & Rehab's Final Ledger. It was requested 02/08/2027 and still isn't here, and it's a dependency for the Mediation Binder due to Hon. Carla Benton (Ret.) on 03/11/2027, ahead of the 03/18/2027 session. Keystone's attendee and their authority are unconfirmed, and there are no countermeasure rules on this file yet. The demand-stage audit holds Riverton at $6,105.00, 33 visits at $185.00, and Peach State's EOB shows $1,860.00 paid on Crescent's $3,400.00 bill. Before we touch the live dates, we'll calibrate. Let's enter the Keystone dates together and watch Rule 1 fire on 09/02 and 09/04. If a rule can't reproduce a known record, we can't trust it on a live one.",
   "ask": "If Rule 1 doesn't fire on 09/02 and 09/04 during calibration, what would that tell you?"
  },
  "task": {
   "say": "You'll configure four countermeasure rules in the CMS under Tasks, Countermeasure rules, with the Calendar and Risk Flags. Rule one handles silence: follow-ups every 5 business days, then 48 hours after the second unanswered one it goes to the supervisor, and 48 more to Atty. Thorne. Rule two: a record not received 14 days after request gets a second request and a subpoena flag for him. Rule three: a hard date 10 days out with an open dependency gets a red flag. Rule four is the 48-Hour Mandate audit before every hard date, with its contents and a fallback. Calibrate rule one on Keystone, then fire all four on the mediation calendar with a date, action and owner each.",
   "ask": "The ledger is still missing at the 03/09/2027 audit. Do you hold the binder?"
  },
  "check": {
   "say": "Let's check your dates, because every firing date is arithmetic from the file. Calibration fires 09/02/2026 and 09/04/2026, with the memo following 09/08. Rule two fires 02/22/2027, 02/08 plus 14, with a second request that day. Your subpoena flag should read as a question for Atty. Thorne, never as if it's decided. Rule three flags 03/01/2027 for the ledger and 03/08/2027 for Keystone's attendee with authority, the one people forget. Rule four audits 03/09 and 03/16/2027. Peach State's $1,860.00 closes Crescent's bill, so the $1,540.00 written off is never a lien. Your fallback includes the $6,105.00 interim ledger. Every firing has a date, action and owner, and no rule messages anyone outside on its own.",
   "ask": "Which of your firing dates would you double-check first, and why that one?"
  }
 },
 "d4m4-l2": {
  "why": {
   "say": "Here's an escalation I see far too often: \"Keystone still not responding, please advise.\" Look at that and tell me what Atty. Thorne has to go look up before he can do anything with it. When was the last contact? What deadline is at risk? What's been tried? What does he need to decide? Every one of your answers is a field that report should have carried. An escalation without the dates, the threatened deadline and a clear ask makes him do your research before he can decide. The ladder decides who hears about a bottleneck and when. The report decides whether they can act on it in one read.",
   "ask": "What does Atty. Thorne have to look up before he can act on \"Keystone still not responding, please advise\"?"
  },
  "rules": {
   "say": "Climb one rung at a time and log each attempt: the source, then its supervisor with a written Notice of Delay, then Atty. Thorne. That notice states facts only and never argues bad faith or exposure. The 48-Hour Mandate times the climb. For Keystone, the second follow-up was 08/31, the supervisor got it 09/02, silence on 09/04 sent it to Atty. Thorne, and the impasse memo followed 09/08/2026. It also audits ledgers, binders and OCR 48 hours before every hard date. Rung three is where the legal tools live; you can name one as a question, but he decides, signs and sends. Don't skip, don't sit. Every report carries five fields: blocker, start date, hard date, what was tried, and the ask. Zero defaults: by the hard date, file what you have marked pending, or he holds a docketed extension. Report up weekly, never out.",
   "ask": "Who should have heard about the Keystone silence first: Dana Whitfield's supervisor or Atty. Thorne?"
  },
  "job": {
   "say": "Here's the rhythm on the job. When rung one goes unanswered on its cadence, you send a written Notice of Delay to the supervisor or office manager from the Email Workspace, naming the item, its start date and the hard date, and you log it. If rung two sits unanswered for 48 hours, you escalate to Atty. Thorne through Tasks, Escalate, with all five fields complete and one ask per blocker. Every week, on reporting day, you send him the Bottleneck Log, each item with its age and days to its hard date. And if a hard date arrives with the blocker still open, you prepare the filing with what you have, marked pending, or you confirm his extension is docketed. Zero defaults.",
   "ask": "A hard date arrives and one record is still missing. What are your only two acceptable options?"
  }
 },
 "d4m4-a2": {
  "case": {
   "say": "It's Monday, 05/24/2027, nine days to the 06/02/2027 exhibit exchange before Laura Whitcomb, Esq. Five open items. One, Crescent Pain & Spine's certified records for the 05/15/2026 injection: requested 05/05, second request 05/19, nothing yet. Two, Dr. Reyes's declaration shielding the 2021 low-back visits, and Lakeside says she's away until 06/01/2027. Three, Cardinal State's Teresa Okafor hasn't confirmed the hearing format or exchange method, and the 05/21 supervisor escalation is unanswered. Four, Riverton's refreshed ledger shows $6,290.00, the old duplicate restored. Five, the copy set prints the doorbell stills in grayscale with no OCR. Show of hands: which do you tackle first? Most people pick the grayscale reprint because it's easy. Easy isn't first.",
   "ask": "Which of these five do you tackle first, and what's your reason?"
  },
  "task": {
   "say": "You'll triage all five in the CMS, using the Conflict Resolver, the Bottleneck Log and Tasks, Escalate. For each one, name the hard date it threatens, the rung it's reached and the countermeasure that applies. Then put them in order: what goes to Atty. Thorne first, what you fix yourself today, and what the 48-hour audit verifies and when. You'll hand in one bottleneck report, sent 05/24/2027, carrying every item that needs his decision, five fields and one ask each. And there's a live call with Teresa Okafor. Ask whether Cardinal State has counsel, get format and exchange method confirmed in writing, and decline any talk of the gap or value.",
   "ask": "Which of these can still hurt John Doe after 06/22/2027?"
  },
  "check": {
   "say": "Check your triage before you log it. Every item maps to the 06/02/2027 exchange, inside the red-flag window. Items one, two and three go to Atty. Thorne first, in one report on 05/24/2027, because each needs his decision. On item three, check CMS Parties for counsel first, and never email the arbitrator. That goes through Atty. Thorne. Its 48 hours ran out on a Sunday, so it's at rung three today. Item four you fix yourself: the set keeps $6,105.00 with the duplicate documented, because $6,290.00 invites the carriers to doubt every number, and Riverton's ledger also records the 19-day disruption. Item five, reprint in color and OCR. The audit lands Friday 05/28/2027, ahead of Memorial Day. And item one's root cause was our own late request.",
   "ask": "Why does the 48-hour audit move to Friday 05/28/2027 instead of the following Tuesday?"
  }
 },
 "d4m4-kc": {
  "questions": {
   "say": "Let's wrap the module with the Learning Check. Answer from this file, in your own words, typed under each question. You'll name the three bottleneck families with this file's examples, walk Rule 1 on the Keystone record with every date, and explain what failed if Keystone's representative shows up without authority. Question 5 is the pressure scenario, and it's really the whole module in one question. If you'd hold the binder there, you've failed the 48-Hour Mandate.",
   "ask": "In question 5, what are the four things you do when the ledger still hasn't arrived?"
  },
  "summary": {
   "say": "Now your Self-Summary, the principles in your own words, plus the scenario on the slide. Before you write, think about question 7: Teresa Okafor calls. The compliant answer takes the message, says Atty. Thorne will respond, and logs it, without touching the gap argument or the offer. And question 6 tests the ladder: 14 days unanswered on 05/19/2027 sends a Notice of Delay to Lakeside's office manager that day, and 48 hours of silence moves it to Atty. Thorne on 05/21/2027.",
   "ask": "Teresa Okafor calls and wants to talk about the gap. What do you say to her?"
  },
  "scale": {
   "say": "Finally, the Skill Scale. Rate each competency from 1 to 5, honestly, then submit it for review. I'll compare your self-rating with your score, and where there's a big gap, we'll sit down and talk it through. And one last reminder: UPL is a gate. A strong score doesn't survive a value conversation with a carrier, no matter how well everything else went.",
   "ask": "Which escalation skill from today do you most want to practice again before your next file?"
  }
 },
 "d5m1-l1": {
  "why": {
   "say": "Let me start with a question. Our 07/20/2026 Time-Limited Demand to Keystone lapsed unaccepted on 08/21/2026, and the 48-Hour Mandate got no answer. What's our very next legal step, and who decides it? Right: we file suit, and Atty. Thorne makes that call. On 09/24/2026 John Doe's file became Civil Action No. 26-CV-04417, and that changes everything about how we work. An adjuster's deadline bends. A court's deadline doesn't. That's why we keep a Pleadings Log and a Discovery Calendar, and their whole job is to prove, every single day, that nothing filed, served or owed has slipped. Here's our day: litigation support first, then the Property Damage dispute, then deposition preparation, and we finish with liability disputes and MIA clients.",
   "ask": "What's the very next legal step on John Doe's file, and who gets to decide it?"
  },
  "rules": {
   "say": "First rule: litigation isn't a longer negotiation. From the 09/24/2026 filing on, the court sets the pace. The Complaint has five parts, caption, jurisdiction, facts, causes of action and prayer for relief; Atty. Thorne drafts it, and before he signs, you verify the filing date against the SOL and the defendant's exact legal name. Service proves the defendant knew, so log every attempt. Still unserved at day 14, that was 10/08/2026, you escalate for Skip-Trace authority. Smith was served 10/14/2026. Read the Answer as a roadmap, and treat RFAs as the danger zone: one unanswered in time may be deemed admitted. When discovery lands, calendar it that day and book a Discovery Intake Meeting; never mail John Doe all 70 requests. And the line: you track, calendar, compile and draft. Atty. Thorne decides and signs, and you never tell John Doe how to answer.",
   "ask": "Which phase will take most of your time, and why?"
  },
  "job": {
   "say": "Let me tell you how this actually runs. Atty. Thorne authorizes suit, and before signature you verify the filing date against the SOL and confirm Robert Smith's exact legal name from an independent record like the Declaration Page or DMV records, not the Police Report alone. It's filed 09/24/2026, well inside our 02/04/2028 internal hard date, and you log it in the Pleadings Log. The stamped complaint goes into 01_PLEADINGS the same day. Then a service attempt fails. You log it, and when he's still unserved at day 14, 10/08/2026, you escalate to Atty. Thorne with the attempt log, run the Skip-Trace on his approval and send him an update. Finally, discovery and RFAs land. You calendar each response with its arithmetic and alert Atty. Thorne within the hour the RFAs arrive, time-stamped."
  }
 },
 "d5m1-a1": {
  "case": {
   "say": "It's 01/05/2027, Track B. Civil Action No. 26-CV-04417 is three months old. The docket calendar was audited and corrected on 12/10/2026, but nobody ever reconciled the CMS Pleadings Log to it, and the reconciliation check now shows five mismatches. The executed Affidavit of Service, filed 10/16/2026, is still sitting in an Allied Process Services email with no row. The Interrogatories and RFPs mailed 12/01/2026 share one row that still says due 12/31/2026, while the calendar shows 01/04/2027. There's no row at all for the 15 RFAs. The Scheduling Order is saved as scan_1210.pdf, and a Certificate of Service dated 01/04/2027 sits in Documents, unlogged. I'm putting the log on screen. You've got 90 seconds to tell me what's wrong before anyone touches it.",
   "ask": "In ninety seconds, how many problems can you find in this log as it stands?"
  },
  "task": {
   "say": "You're going to repair the Pleadings Log and Discovery Calendar for 26-CV-04417, working in CMS under Litigation, Calendar and Documents. Add every missing row, recompute each response date from its trigger and its method of service, and write the arithmetic right into the row. File each document in its numbered sub-folder with a proper name, and calendar the Scheduling Order's six dates. Then the graded call: the RFA deadline never had its own row, and it's passed. Prove compliance from that Certificate of Service, record the misses honestly, and report to Atty. Thorne today. Partway through, Jenna Price, Atty. Mercer's paralegal, will call. Log her words verbatim with the time, take no position, tell her only that Atty. Thorne will respond, and route it to him. Hand in the corrected, source-linked log and your report.",
   "ask": "The log said 12/31/2026, which was too early. Why fix a date that could only have made us early?"
  },
  "check": {
   "say": "Before you log this, check your work row by row. Is there an affidavit row, personal service 10/14/2026 by Allied Process Services, filed 10/16/2026, saved in 02_SERVICE_DOCS? Did you correct the Interrogatories and RFPs to 01/04/2027 with the count written out, 12/01 plus 30, plus 3 for mail, Sunday rolled to Monday? The 15 RFAs need their own row with a red deemed-admission flag. Is the Certificate of Service logged and checked, signed verification attached? Smith's responses go on 01/13/2027, and remember, no extra 3 days for e-service on this file. The Scheduling Order should be renamed, filed in 01_PLEADINGS, with all six dates. And did you record the late rows as misses, not back-dated, and report to Atty. Thorne without calling Atty. Mercer? One row per set, every row linked to its source.",
   "ask": "Did anyone add three mail days to the e-served set out of habit?"
  }
 },
 "d5m1-l2": {
  "why": {
   "say": "I'm holding up the Scheduling Order. This one page now outranks every adjuster letter in the file. Why? Because a judge signed it, and every date in it is absolute. It was entered 12/10/2026, and it now runs John Doe's case to a 09/13/2027 trial calendar. So how do we make sure none of those dates sneaks up on us? Two tools. A trial-prep checklist turns the order's dates into tasks that somebody owns. And the KPIs prove, week by week, that each of those tasks is ahead of its deadline rather than behind it. That's the whole lesson in a sentence: the order sets the dates, the checklist assigns them, and the numbers show we're winning the race.",
   "ask": "Why does a single page signed by a judge outrank every adjuster letter in this file?"
  },
  "rules": {
   "say": "The Scheduling Order controls. Pin it to the front of the file with 30-, 14- and 7-day alerts on every date: our experts 03/15/2027, theirs 04/15/2027, mediation by 03/31/2027, discovery closing 05/28/2027, pretrial 08/12/2027 and trial calendar 09/13/2027. Every extension goes in writing: once Atty. Thorne agrees, you draft the same-day confirmation for his signature, in his name. Watch two traps. One is treating court deadlines like adjuster deadlines. The other is letting the client talk to the other side; if Keystone or a defense investigator reaches John Doe, step in and tell Atty. Thorne that day. For the 02/18/2027 deposition, you handle the reporter, the link, the tech check and the packet by 02/11/2027. Prepare the process, never the testimony. And every KPI gets a formula and a target.",
   "ask": "Defense counsel will spend John Doe's deposition on the 14-Day Gap. What's your job before 02/18/2027, and where does it stop?"
  },
  "job": {
   "say": "Picture a week in the life. The Scheduling Order is entered 12/10/2026. You pin it to the front of the file, calendar all six dates with three alerts each, that's 18 alerts, and file the order in 01_PLEADINGS. Next, Atty. Mercer's office calls and an extension gets agreed by phone. You confirm Atty. Thorne actually approved it, draft the written confirmation for his signature, send it that same day in his name and recalendar; no scheduling-order date moves without a court order. Then the deposition is noticed. You book the reporter, the link and the technology check, and send the attorney-approved packet by 02/11/2027, confirming John Doe got it. And every week you run the docket audit: each KPI shows its formula, its target and a dated reading, and every miss gets routed."
  }
 },
 "d5m1-a2": {
  "case": {
   "say": "It's 01/20/2027, and John Doe's deposition notice just landed: 02/18/2027, 10:00 a.m., by videoconference, with Riverton Court Reporting. The link will come from the reporter, and they want us to confirm attendance. Here's the problem. Our trial-prep checklist was drafted from the calendar as it was first keyed, before the 12/10/2026 audit, and it was never reconciled. It shows our expert disclosure on 04/15/2027, lists mediation 03/31/2027 as if that's the session date, plans records subpoenas for June 2027, and sources the final records run from the pre-lit Demand Package. There are no alerts and no deposition tasks. Smith's responses came in 01/13/2027 and were never docketed, and there's no KPI tracker at all. Put the checklist beside the Scheduling Order and find the first wrong date.",
   "ask": "Who can find the first wrong date in under a minute?"
  },
  "task": {
   "say": "Here's what you'll do. In the Action Plan Editor, audit the checklist line by line against the 12/10/2026 Scheduling Order. Every date has to be right, every task needs an owner, and each gets 30-, 14- and 7-day alerts. Add the 02/18/2027 deposition logistics and the prep document set. Then build the KPI tracker in CMS under Litigation: define all nine KPIs, each with its formula and target, enter this file's reading with its source, and mark it met, missed or open. Close with one task each for the three review lenses: coverage, treatment and liability. What you hand in is a checklist that matches the order date for date, and a complete tracker. And the graded call is choosing which two items go to Atty. Thorne first.",
   "ask": "Which two items go to Atty. Thorne first, and why those two?"
  },
  "check": {
   "say": "Let's check before you log it. Our expert date should now read 03/15/2027, with 04/15/2027 kept as the defense date. Mediation says completed by 03/31/2027. Records subpoenas return before 05/28/2027, and 04/28/2027 is flagged as the last day to e-serve a 30-day request, confirmed with Atty. Thorne. All six dates carry three alerts, 18 in all. The deposition notice is docketed by 01/22/2027, the reporter confirmed, calendars aligned and the packet set for 02/11/2027. Your Gap Record lists the documents, the EMS report, the Northgate attendance, the texts to Margaret, the MRI read, the Causation Letter, and nothing scripted for John Doe. All nine KPIs need a formula, target, sourced reading and status. And Smith's 01/13/2027 responses are logged as a docket miss and routed.",
   "ask": "Is there anything in your Gap Record that tells John Doe what to say?"
  }
 },
 "d5m1-kc": {
  "questions": {
   "say": "Time for the Litigation Support Assessment. Answer every question from John Doe's file, in your own words, typed right under the question. Question 1 is the gate, so take it slowly. Work the 12/01/2026 response date step by step, explain how the count changes for a set e-served by consent, and tell me why you'd confirm the court's rule. If your answer is 12/31/2026 or 01/03/2027, stop and rework the count before you go on. Then name Atty. Mercer's three defenses and the evidence on file you'd pull against each, and tell me where the affidavit, the RFAs and the Scheduling Order get filed and named.",
   "ask": "Before you start, what are the three steps in counting from a mailed trigger?"
  },
  "summary": {
   "say": "Now the self-summary, the principles in your own words. Before anyone writes, think about this one: opposing counsel wants two weeks at 4:45 p.m. and says they'll paper it later. Who can say yes? Only Atty. Thorne, and only in writing, the same day. Then your scenario. It's 01/28/2027. John Doe has been unreachable for six days, his deposition is noticed for 02/18/2027, and defense counsel wants to inspect Margaret's Civic. Write out your next five actions in order, and next to each one, who owns it. Be specific about what's yours and what goes to Atty. Thorne.",
   "ask": "Opposing counsel wants two weeks at 4:45 p.m. and will paper it later. Who can say yes?"
  },
  "scale": {
   "say": "Last step. Rate yourself on each competency from 1 to 5, honestly, then submit it for review. I'll be comparing your self-rating with your score, so if you gave yourself a 5 on deadlines but missed the count in Question 1, we'll talk about that gap. That's not a gotcha; it's how we find what to practice next. One thing to remember: UPL is a gate. A strong score doesn't survive an ethics breach.",
   "ask": "Where do you expect the biggest gap between your self-rating and your score?"
  }
 },
 "d5m2-l1": {
  "why": {
   "say": "Look at this gauge for a second. Which number decides whether Margaret Doe's Civic is totaled? Most of you will say the estimate. It's actually the final bill, $9,255.00, after the supplement. Here's why this matters now. The Civic isn't John Doe's claim. It's Margaret Doe's, on the separate PD file the firm opened for her, and Keystone will test every figure we put forward. The repair-against-ACV arithmetic decides which measure of damages applies. And the loss-of-use calendar does double duty: it's also the transportation record that explains the 14-Day Gap. Get the car's numbers right, and you're quietly strengthening the injury case too.",
   "ask": "Which number decides whether the Civic is totaled: the first estimate or the final bill?"
  },
  "rules": {
   "say": "The goal is to make John Doe whole: his position before 02/06/2026, never a windfall. The $2,315.00 teardown supplement of 03/02/2026 is structural, the A-pillar, so it shows hidden damage and impact force. Courts generally award the lesser of repair cost or the drop in value, so run it on the final bill: $6,940.00 plus $2,315.00 is $9,255.00, 52.6% of the $17,600.00 ACV, under Keystone's 75% line of $13,200.00. Repairable. Loss of Use is claimable for each day without the car or a paid substitute, at Keystone's own $42.00 a day. Allocate the 78 days from 02/06 to 04/24/2026 once, claim only the 48 unpaid, $2,016.00. Keystone's 30-day cap is claims practice, and arguing it is Atty. Thorne's job. You compute and report; you never tell Margaret Doe what her car is worth.",
   "ask": "Keystone paid for 30 days of rental. Why is Margaret Doe still owed anything for the use of her car?"
  },
  "job": {
   "say": "On the job, it goes like this. The final repair bill posts with the supplement, so you re-run the total-loss check on $9,255.00 in the Property Damage screen, record 52.6% of $17,600.00, and get Keystone's 75% basis on file in writing. Then the rental ends while the Civic is still in the shop. You log every day without a vehicle, period by period, and land on 12 plus 36, 48 days, with no paid rental day counted. When the 09/24/2026 complaint pleads Loss of Use and Diminished Value, you reconcile the figures across the PD screen, the damages summary and discovery, so $2,016.00 and $3,600.00 match everywhere, and any mismatch goes to Atty. Thorne. And when the deposition is noticed on 01/20/2027, you index the PD severity set for his deposition documents before the 02/04/2027 prep session."
  }
 },
 "d5m2-a1": {
  "case": {
   "say": "It's December 2026, and the requests mailed 12/01/2026 have arrived. Defendant's First Requests for Production, served on John Doe by U.S. mail, ask for every document supporting the Property Damage claim, with responses due 01/04/2027. Atty. Thorne's message is clear: audit the Civic's numbers before anything is produced, flag what Keystone will argue about the unpaid days, and nothing goes out without his review. Now look at the PD screen, untouched since April. The total-loss check was run on the $6,940.00 estimate, 39.4% of ACV. The loss-of-use line reads 78 days times $42.00, $3,276.00. And Keystone still offers $0 for Loss of Use. Something here isn't right. Your job is to find it.",
   "ask": "What's the first number on that PD screen you'd want to re-run, and why?"
  },
  "task": {
   "say": "You're auditing and correcting the Civic's numbers before anything is produced. Working in CMS under Property Damage, Loss of Use, re-run the total-loss check on the final repair against the $17,600.00 ACV and Keystone's 75% threshold, and list what you'd verify in Keystone's Valuation Report. Then rebuild the loss-of-use ledger day by day from 02/06 to 04/24/2026, allocating each day once, and correct the claim. Attach evidence for each period, and index the severity set, the photos and the estimate against the final bill, in Documents. Finally, use Tasks, Escalate to flag for Atty. Thorne the two arguments Keystone will make against the unpaid days, without answering them, dated ahead of the deadline. Hand in a corrected PD worksheet with every period evidenced.",
   "ask": "If the defense receives a worksheet claiming $3,276.00, what happens to the credibility of the $3,600.00 appraisal?"
  },
  "check": {
   "say": "Run your self-check before you log it. Your final repair should read $6,940.00 plus $2,315.00, $9,255.00, which is 52.6% of $17,600.00, under the $13,200.00 line, so repairable. Did you correct the stale 39.4% with a dated note, not overwrite it? Your valuation-report checks should cover comparables, the LX trim, the 52,300 miles and condition. The 78 days split as 12, 30 and 36, and Loss of Use drops from $3,276.00 to 48 times $42.00, $2,016.00. I'll grade the evidence hardest: the 12 pre-rental days are proved by the tow and storage record and Keystone's 02/17/2026 acceptance, not John Doe's word. Tow and storage, $455.00, and the rental stay out. Keystone's two defenses are flagged, not argued, and your escalation is dated by 12/28/2026.",
   "ask": "What document, besides John Doe's word, proves those first 12 days without a car?"
  }
 },
 "d5m2-l2": {
  "why": {
   "say": "I've written two numbers on the board, far apart: $792.00 and $3,600.00. Same car, same damage. A Civic with an A-pillar repair in its history is worth less than one never hit, and John Doe didn't cause that loss. Keystone's $792.00 comes from a formula. The $3,600.00 comes from a market appraisal. Let me build the $792.00 in front of you, one step at a time: 10% of the $17,600.00 ACV is $1,760.00, times 0.75 is $1,320.00, times 0.60 is $792.00. Each multiplication is a cut, and you can see exactly where. The gap between those two numbers is pleaded on Track B. Our job is to build the evidence. Atty. Thorne makes the argument.",
   "ask": "Watching the formula, which of those three cuts bothers you most, and why?"
  },
  "rules": {
   "say": "Diminished Value is what a car still loses after a proper repair, because buyers pay less for a damage history, and many jurisdictions allow it against the at-fault driver. Many courts add it to the repair, under pre-loss value: $9,255.00 plus $3,600.00 is $12,855.00, under $17,600.00. It's a market loss, not a feeling. Keystone's 17c figure comes from a Georgia class-action settlement, not a legal measure. Critique it: no damage, however severe, gets past $1,760.00 on this car, and the appraisal's 20.5% is more than twice that ceiling. The 0.75 tier sits below the top, severe structural tier, and 0.60 counts the 52,300 miles twice. Test our own appraisal too. PD settles only on a property-damage-only release Atty. Thorne has reviewed. You calculate and critique; you never make, accept or counter a figure.",
   "ask": "If this Civic had the worst structural damage a repairable car can have, what's the most the 17c formula could pay?"
  },
  "job": {
   "say": "Let's run it on the job. Keystone states its diminished-value figure. You don't argue it on the phone. You ask Atty. Thorne how he wants the 17c worksheet and every input obtained, a discovery request or a written request through counsel, and you draft it for his review, so the base, both multipliers and the ACV end up on file in writing. Then the appraisal arrives on 05/06/2026. You audit its method, its data and the appraiser's credentials, write a dated audit note, and index it as our diminished-value evidence. And if Keystone sends a PD release or a check, you hold it and route the release language to Atty. Thorne, so he's reviewed its scope before John Doe ever sees a signature line."
  }
 },
 "d5m2-a2": {
  "case": {
   "say": "It's 12/10/2026, and the Scheduling Order requires mediation by 03/31/2027. Leah Moran at Keystone PD has just emailed. She says $792.00 for Diminished Value and $0 for Loss of Use are final. Attached is a release of all claims arising from the 02/06/2026 accident, which she'd like Mr. Doe to sign and return so she can issue payment. She'll call this afternoon to see if he'll take it. Atty. Thorne wants your recommendation. Now, before anyone touches the math, I've got a question about that attachment. Read the release language carefully, and think about what all claims would mean for a client who's also in a lawsuit over his injuries.",
   "ask": "Who opened Leah Moran's attachment, and what did you do with it?"
  },
  "task": {
   "say": "This is the lab. In CMS under Property Damage, rebuild Keystone's 17c figure from the $17,600.00 ACV, then critique the 10% cap and both multipliers against the 03/02/2026 supplement and the 05/06/2026 appraisal. Lay out the whole PD dispute, claimed against offered, and recommend a negotiating range with a top and a floor, each tied to its evidence and arithmetic. Then take Leah Moran's call in the Call Simulator and answer her email in the Email Workspace. Tell her the offer is with Atty. Thorne, make no counter, quote no figure, note the all-claims release scope and log her exact words. What you hand in is a one-page PD dispute memo, routed to Atty. Thorne through Tasks, Escalate, for authority.",
   "ask": "What's the lowest number you'd put in front of Atty. Thorne, and which document defends it?"
  },
  "check": {
   "say": "Before you log your memo, check it. The 17c rebuilt: $1,760.00, then $1,320.00, then $792.00, with the 10% cap named. Both multipliers challenged: 0.75 against the A-pillar supplement, and 0.60 as a second discount for miles the ACV already priced in. The appraisal compared, 20.5% of ACV against 4.5%, a difference of $2,808.00. The dispute totalled at $5,616.00 against $792.00, with a floor above $792.00 and the weak 36 shop delay days named. Show the make-whole check, $12,855.00 under $17,600.00, and the limit check, $16,586.00 inside the $25,000 limit, with the Escape flagged. The release routed, nothing to John Doe. And when Leah Moran asks, can you just tell me if he'll take it, you told her only that the offer is with Atty. Thorne.",
   "ask": "When Leah Moran asked whether he'd take it, what exactly did you say?"
  }
 },
 "d5m2-kc": {
  "questions": {
   "say": "This is the PD Dispute Evaluation. Answer from John Doe's file, in your own words, right under each question. Show whether the Civic is a Total Loss, with the final repair, the ACV, Keystone's threshold and the percentage, arithmetic included. Allocate the 78 days from 02/06 to 04/24/2026 and say which are claimed, at what rate, for how much, and why the rental days are out. Sort the damages into their three types. And when you hit Question 6, the pressure scenario, slow down. The strong answer agrees to nothing, logs the call, and gets the inspection request and the offer to Atty. Thorne right away.",
   "ask": "In the pressure scenario, who gives John Doe any instruction about preserving the Civic?"
  },
  "summary": {
   "say": "Now the self-summary, in your own words. Here's one to chew on first: why does a parked car's A-pillar matter to a neck injury? Because the supplement measures the force that drove the Escape, with John Doe inside, into the Civic. Atty. Thorne uses that in prep; you put it in the set and never tell John Doe what to say. Then your scenario: it's 01/28/2027, John Doe's been unreachable for six days, his deposition is noticed for 02/18/2027, and defense counsel wants to inspect Margaret's Civic. Write your next five actions in order, and who owns each one.",
   "ask": "Why does a parked car's A-pillar matter to a neck injury?"
  },
  "scale": {
   "say": "Finally, rate yourself on each competency, 1 to 5, and submit it for review. I'll sit your rating next to your score. If you gave yourself a 5 on a block you scored 60 on, we'll talk. If you gave yourself a 2 on something you aced, we'll talk about that too. And remember, UPL is a gate. On this module, the breach I'm watching for is any PD figure accepted, rejected or valued for John Doe. A strong score won't survive that.",
   "ask": "Which competency here did you rate lowest, and what would move it up a point?"
  }
 },
 "d5m3-l1": {
  "why": {
   "say": "Every prep session guide starts with the same line: start by calming their nerves. Good advice. But look at the calendar. John resurfaced on 02/03/2027, fifteen days before he testifies on 02/18/2027, by video, from a room the firm doesn't control. So what has to come before any calming? The audit. Before we sit down with John, we need to know everything in his file the defense might use, so Atty. Thorne meets it first. And here's the division of labor I want you to hold onto all module. Atty. Thorne prepares the substance, what John's testimony covers. You prepare the person and the setting, so John walks in calm, informed and ready.",
   "ask": "John has fifteen days until he testifies. What has to happen before anyone starts calming him down?"
  },
  "theory": {
   "say": "A deposition can shape the whole outcome of a litigated case. Atty. Thorne owns the legal strategy, and you prepare the client operationally and psychologically. That starts with a landmine audit: before any prep meeting, you review the file for what the defense will exploit, so counsel sees it first. Why does that matter so much? Because consistency is credibility. The defense will compare John's testimony with his signed answers and his records, and any mismatch reads as concealment. Then there's the courtroom drama myth. Clients expect TV, and showing them the real, ordinary process calms them without any prediction. And remember, defense counsel writes an evaluation report to the carrier on how John will strike a jury, so how he presents matters.",
   "ask": "Who on John's side of the file reads that defense evaluation report, and why should it worry us?"
  },
  "rules": {
   "say": "Before 02/04/2027, audit for landmines and route them to Atty. Thorne: the 14-Day Gap, the 19-day disruption, the three 2021 low-back chiropractic visits, the seatbelt and the degenerative MRI. Check John's signed answers and public social media too, and route any inconsistency the same day. Never tell him to delete a post. His account matches his records because he's reviewed them with Atty. Thorne, not because he learned a script. Then the pillars: no judge, no jury, calm with the process; pause two seconds, tell the truth, stop talking; business casual and plain about limitations. Test the setup with him on 02/16/2027, confirm everything with all three parties on 02/17/2027, and no one in the room, no notes, no messages, not even to you. You explain process and logistics. Every substantive question goes to Atty. Thorne.",
   "ask": "John asks what he should say about the two weeks before urgent care. What do you tell him?"
  },
  "job": {
   "say": "Let me show you how the two weeks actually run. The notice of deposition is served 01/20/2027. You calendar the deposition, both prep sessions, the 02/11/2027 packet and the day-before checklist, and you start the audit, so 02/04, 02/11, 02/16, 02/17 and 02/18 at 10:00 a.m. are on the calendar for Atty. Thorne and John. When the audit's done, you route the landmine list and any discovery mismatch to Atty. Thorne before 02/04/2027, with every landmine tied to its source record. On 02/16/2027 you run the test call on John's own device, in the room he'll use, and log camera, audio, link, lighting, room and backup number, each pass or fail. And on 02/17/2027 you confirm with all three and get the exhibit set approved by Atty. Thorne."
  }
 },
 "d5m3-a1": {
  "case": {
   "say": "It's 02/04/2027 on Track B. John Doe went dark on 01/22/2027, and yesterday we reached him through Margaret. He has a new phone number. His deposition is noticed for 02/18/2027 at 10:00 a.m., by videoconference with Riverton Court Reporting, and he's anxious; he's expecting a TV cross-examination. Atty. Thorne's note says prep session one is at 1:00 p.m. and you open: the new number, the logistics, the test call, the three pillars and the room rules. He'll listen, then take the substance, and he wants his gap set ready to share on screen. One thing before we start. What decides your grade is the routing. A polished segment that answers even one substantive question fails.",
   "ask": "What's the very first thing you'll update in the CMS before the session starts?"
  },
  "task": {
   "say": "You'll run your segment of John's first prep session in the Call Simulator with AI John Doe. Confirm his new number, with Margaret as backup. State the logistics exactly and set a 02/16/2027 test call on the device and in the room he'll use. Deliver the three pillars and the in-room rules in plain words, and drill the pause on neutral questions only. AI John will ask what to say about the gap, the missed April therapy, the seatbelt, his 2021 chiropractor visits and the MRI. Recognise each as substance, answer none, and log each in his words to Atty. Thorne through Tasks, Escalate. Have the gap set ready to share. You hand in your segment, a logistics record and John's routed questions.",
   "ask": "Which of John's questions can you answer, and which ones can't you?"
  },
  "check": {
   "say": "Before you log your segment, go through this. Is his new number updated in CMS under Parties, with Margaret confirmed as backup? Did you state the logistics exactly, 02/18/2027, 10:00 a.m., videoconference, Riverton Court Reporting, and set the 02/16/2027 test call? Did you explain the setting without predicting any outcome, drill the pause on neutral questions only, and give the dress talk as advice every client gets? Did you cover the room rules, private room, no one else, no notes, no phone, no messaging? And the big one: all five substantive questions met with routing, not content, and each logged in John's words before the segment ended. Watch the helpful half-answer. Always tell the truth is a rule; just say you had no ride is a script.",
   "ask": "Did anything you said today sound like “just say you had no ride”?"
  }
 },
 "d5m3-l2": {
  "why": {
   "say": "Defense attorneys love psychological traps. Let me try one on you. So it was just the neck stiffness. Is that all? Hands up if you'd say yes. Now look at the 02/20/2026 urgent-care note: hand numbness. That one yes just fenced off a symptom. Here's the thing. Atty. Mercer doesn't need John to lie. A hurried yes to a narrowed list, a guess or an argument does the same damage. His Answer and the records tell us exactly where he'll dig: the gap, the disruption, the 2021 visits and the seatbelt. What meets every one of those traps? Seven general rules and Atty. Thorne's objections. A script meets none of them.",
   "ask": "Be honest: how many of you would have answered yes to that question?"
  },
  "theory": {
   "say": "The defense has a simple goal in a deposition: get the client to contradict himself, lose his temper or exaggerate, because each of those damages credibility. General rules protect against that; a script can't. So let's reset some expectations. Defense counsel may ask very broad questions to discover the facts, and wide questions are normal, not attacks. There's a real difference between an estimate and a guess. An estimate rests on what you perceived; a guess claims what you couldn't know, and only the estimate is honest testimony. Remember, a deposition is information gathering, not a battle. Nothing is won there, so the smallest target protects the case. And when Atty. Thorne objects, that's a formal flag on the record protecting the witness, not a sign of trouble.",
   "ask": "Can someone give me an honest estimate about John's crash that wouldn't be a guess?"
  },
  "rules": {
   "say": "Defense questions come in four categories: personal background, crash mechanics, medical history and daily life. Clients underreport medical history most, and here that's the 2021 low-back visits. Rule one is the truth, and the prior-injury question is the Liar's Trap; counsel usually has the records already. Pause two seconds and answer in words, since the reporter can't type a nod. Never guess, answer only what's asked, then hold the silence and don't argue. The Is that all trap can fence off the hand numbness, and the complete record, not memory, is the full list. Compound questions fold two facts into one yes; John can say a question's unclear. On an objection, John stops, then answers unless instructed not to. The EMS report, MRI and EDR are Atty. Thorne's to use. You explain rules; you never coach answers.",
   "ask": "Which of the four categories do clients underreport, and where does that sit on this file?"
  },
  "job": {
   "say": "Let's see it on the job. Atty. Mercer's Answer was served 11/12/2026. You take each pleaded defense, comparative fault, causation and failure to mitigate, and map it to the questions it predicts in the deposition prep log, so each one ties to at least one trap. Once the trap map's done, you check that the record that meets each trap is actually in Atty. Thorne's set: the EMS report, the MRI report of 03/13/2026, the 06/19/2026 Causation Letter, the EDR download and the Northgate Attendance Record. And when John asks you how to answer one of those traps, and he will, you log his question in his own words and route it to Atty. Thorne the same day. No wording offered, not even a little."
  }
 },
 "d5m3-a2": {
  "case": {
   "say": "It's 02/16/2027, the second prep session. At 2:00 p.m., Atty. Thorne is running a mock cross-examination. Let me set the roles out loud, because the boundary matters. Atty. Thorne leads and defends. AI defense counsel, playing Atty. Grant Mercer, asks the questions. AI John Doe answers. And you observe. Your microphone stays muted the whole time. Your job is the Trap Log: every trap with its time, Mercer's exact words, and the record fact beside any mischaracterisation, plus every objection. Atty. Thorne debriefs John from your log when the mock ends, so it has to reach him before we finish.",
   "ask": "Who in this mock is allowed to speak to John, and when?"
  },
  "task": {
   "say": "While the mock runs in the Call Simulator, you keep the Trap Log in CMS under Litigation, Deposition prep log. For each trap, log the timestamp, the question in AI Mercer's exact words, its category, the trap type, and which Golden Rules John kept or broke. Beside every mischaracterisation, put the record fact and its source. Log each objection and whether John stopped talking. Then route the finished log to Atty. Thorne before his debrief. You coach nothing, not during the mock and not after. The log is for Atty. Thorne alone; nothing in it goes to John. Your hand-in is a timestamped Trap Log, scored against the seven rules.",
   "ask": "Why does the log need Mercer's exact words instead of your summary of the question?"
  },
  "check": {
   "say": "Check your log before you route it. Are all six traps there, plus the silent stare if Mercer used it, each with a timestamp, his exact words and one of the four categories? Your gap entry should read 14 days, 02/06/2026 to 02/20/2026, and any disruption question set against 19 days, 04/02/2026 to 04/21/2026. Degenerative should cite the 03/13/2026 MRI: no significant degenerative change at the adjacent levels. The seatbelt entry cites the EMS Run Report and the EDR download, and the 2021 entry notes three resolved low-back visits and no prior neck complaints. Each answer scored on the rules, every objection logged. And honestly: did you nod, type in the chat, or say anything to John? That's coaching, in a mock or on 02/18/2027.",
   "ask": "Which trap worked on John, and which rule would have protected him?"
  }
 },
 "d5m3-kc": {
  "questions": {
   "say": "This is the Deposition Readiness Audit. Look at the readiness strip on screen first. Which chip is hardest to turn green honestly? Most people say the audit. I'd say the routing, because it's the one that gets tested under pressure. Now answer from John's file, in your own words, under each question. List the landmines your audit must surface before 02/04/2027, with the record behind each. Lay out the day-before checklist for 02/17/2027. And name the four categories of defense questions, the one clients underreport, and where that risk sits here.",
   "ask": "Which chip on the readiness strip is hardest to turn green honestly?"
  },
  "summary": {
   "say": "On to your self-summary. Let's warm up with this: it's 02/03/2027, and John has just resurfaced with a new phone, fifteen days before he testifies. What can't wait until tomorrow? His new number in the CMS, and the audit routed to Atty. Thorne. Keep that urgency in mind. Then write your scenario: it's 01/28/2027, John's been unreachable for six days, his deposition is noticed for 02/18/2027, and defense counsel wants to inspect Margaret's Civic. Give me your next five actions in order, with an owner beside each one.",
   "ask": "John just resurfaced fifteen days out. What can't wait until tomorrow?"
  },
  "scale": {
   "say": "Last piece: rate yourself 1 to 5 on each competency, then submit it. I'm going to compare your rating with your score and talk through any wide gaps with you. And let me be straight about Question 5, because it's the UPL gate. Any reply that gives John content about the gap fails the module, however polished it is. The right reply routes his question to Atty. Thorne and logs it in John's words. Rate yourself with that in mind.",
   "ask": "Where would you honestly rate your routing under pressure right now?"
  }
 },
 "d5m4-l1": {
  "why": {
   "say": "Let me read you Robert Smith's Answer. It says the Escape entered the all-way stop out of turn. It says John was unbelted. And it says he failed to mitigate by missing visits. Now, which of those three isn't about John at all? The first one. Entering out of turn is about Kevin Alvarez's driving, not John's. After suit, the defense went after fault and mitigation: the car he rode in and his seatbelt are comparative fault, and his missed visits are failure to mitigate. Here's the difference. Fault can reduce or even bar recovery. Mitigation only cuts the damages the missed care actually caused. Our counter-package answers each one from this file, with evidence that can come in.",
   "ask": "Which of Smith's three allegations isn't about John's own conduct at all?"
  },
  "rules": {
   "say": "Comparative negligence apportions fault. Under pure, damages fall by John's share, however large. Under modified, they fall, but recovery is barred at 50% in some states or 51% in others. Under contributory, any fault bars recovery. Confirm the governing rule. Record liability status with its source; Keystone accepted PD liability on 02/17/2026, and the Answer now pleads comparative fault. The out-of-turn allegation targets Kevin Alvarez, and whatever the defense says about him, the stack stays $40,000. Unbelted is answered by the EDR and the EMS report. Failure to mitigate trims only avoidable damages, and the A-C-T record answers it. Evidence counts only if it can come in, so record source, witness and custody, and don't rest on the citation alone. You gather and index; Atty. Thorne decides fault, admissibility and coverage.",
   "ask": "If a jury finds John 20% at fault, what does he recover under each regime? And at 50%?"
  },
  "job": {
   "say": "Watch how it unfolds. The Answer is filed on 11/12/2026, pleading comparative fault, causation and failure to mitigate. You log each defense as its own line in the Pleadings Log, dated 11/12/2026, and confirm the filing on the docket. Then you map the file's evidence to each allegation in the counter-package, with its source, witness and custody, and nothing goes in without a source document and a named authenticating witness. When an item lacks foundation, or a holder won't produce, you flag it for a Subpoena Duces Tecum and route it to Atty. Thorne, naming the gap and the record holder. And with deposition prep set for 02/04 and 02/16/2027, you deliver the counter-package and the Gap Record into his prep set before 02/04/2027."
  }
 },
 "d5m4-a1": {
  "case": {
   "say": "It's 11/12/2026 on Track B. Atty. Grant Mercer of Mercer & Hale LLP has filed Robert Smith's Answer in Civil Action No. 26-CV-04417. It denies liability and pleads comparative negligence, saying the Escape entered the all-way stop out of turn and John was unbelted. It pleads causation, the gap and a degenerative MRI, and failure to mitigate. Atty. Thorne wants, for each allegation, the evidence that answers it, its source, its authenticating witness and its chain of custody, plus a list of the questions only he can answer. In the file you've got report RPD-26-018842, Ruth Calloway's details, the doorbell video, the 10/2026 EDR download, the EMS Run Report and the A-C-T record. You'll get three blank rows, one per allegation, and I'll grade row by row.",
   "ask": "Is a row finished if it has strong evidence but no authenticating witness?"
  },
  "task": {
   "say": "You're building the liability counter-package for Atty. Thorne in CMS under Litigation. For each of the three allegations, list the evidence that answers it, its source document, the witness who can authenticate it, its chain of custody and any gap in its foundation. Write out the doorbell video's chain from the 02/17/2026 preservation request to the 02/19/2026 copy. Where a record will need a custodian, draft a narrow Exhibit A for a Subpoena Duces Tecum in the Action Plan Editor's template, for his review. Then close with the questions only he can answer: the governing fault rule, seatbelt and citation admissibility, and whether fault on Kevin Alvarez touches coverage. You hand in the allegation-by-allegation package, the draft Exhibit A and those routed questions.",
   "ask": "Which single document answers two defenses?"
  },
  "check": {
   "say": "Check your package against this before you log it. Three separate rows: out of turn, unbelted, failure to mitigate. Out of turn answered by RPD-26-018842, Ruth Calloway of 2209 Maple Hollow Rd, the video and the point of impact, with the EDR's 11 mph as corroboration only, because speed alone doesn't prove right-of-way. Unbelted answered by the EDR and the EMS report. Mitigation answered by the A-C-T record, with the disruption stated exactly: 19 days, 04/02 to 04/21/2026, four missed visits. The video's chain runs from Margaret Doe's camera through 02/17 and 02/19/2026, native file unaltered. Every item has a witness. Your Exhibit A covers only John Doe's 02/06/2026 Riverton Fire EMS run and named record types, never all records. And the stack still reads $40,000.",
   "ask": "Does your Exhibit A name one patient, one date and specific record types?"
  }
 },
 "d5m4-l2": {
  "why": {
   "say": "Two people went missing on this file, and I want you to look at them side by side. Robert Smith moved before he could be served. John Doe went silent 27 days before his deposition. What do they share? Neither one has a working contact point. And what's different? One is the opponent, and one is our client, and the authority lines follow from that. The tools overlap: Skip-Trace, the process server, certified proof of notice. But who can authorize what, and what we're allowed to say, changes completely. In both cases, the record we keep is what proves our diligence.",
   "ask": "Smith and John both went missing. What do they share, and what's different about them?"
  },
  "rules": {
   "say": "The clerk issues the Summons, the process server gets the papers, you follow up every five days, and the affidavit is filed: here 09/24 filed, 10/14 served, 10/16/2026 affidavit. Three failed attempts at 118 Larkspur Ln and a neighbor saying Smith moved means a stale address, so Skip-Trace first, permissible purpose only. On 10/09 it found 4410 Quarry Ridge Ct, Millbrook. Service starts his clock, answer due 11/13/2026, and you check the docket weekly. A Subpoena Duces Tecum needs a narrow Exhibit A, and opposing counsel gets notice first. For John, silent since 01/22/2027, run Day 2's No Contact Protocol. The Step 4 letter goes certified mail and email over Atty. Thorne's signature, by 01/27/2027. Withdrawal goes in only if he directs it. Margaret hears only that the firm needs John to call.",
   "ask": "Three attempts failed at 118 Larkspur Ln. Why is a fourth at 6:00 a.m. the wrong move?"
  },
  "job": {
   "say": "Back to October. On 10/08/2026, the third attempt fails and a neighbor says Smith moved. You escalate for Skip-Trace authority, log the 10/09/2026 result and re-assign the server to 4410 Quarry Ridge Ct. When the affidavit is filed 10/16/2026, you docket the answer date, 11/13/2026, and set a recurring weekly docket check. Later, Atty. Thorne approves a Subpoena Duces Tecum, so you send notice to Atty. Grant Mercer first, dated before service, then have the custodian served and set a compliance call five days before production. And when John goes unreachable from 01/22/2027 with a deposition noticed, you run Steps 1 to 3, then draft the Step 4 notice for Atty. Thorne's signature, response date before 02/04/2027, and log both the certified mail and the email."
  }
 },
 "d5m4-a2": {
  "case": {
   "say": "Two episodes, one file. Part one: it's 10/08/2026, and Allied Process Services reports a third failed attempt at 118 Larkspur Ln, tonight at 6:40 p.m., no answer, no vehicle, after tries on 10/01 and 10/05. A neighbor says Robert Smith moved out in August. The server wants to know how to proceed. Treat this like a race against a stale address. The 10/09 Skip-Trace return will list 118 Larkspur Ln with utilities closed 08/2026, 4410 Quarry Ridge Ct, Millbrook, with a utility opened 08/2026 that matches his registration, and a 2019 address. Part two: it's 01/22/2027, and calls to John go unanswered, two days after his deposition was noticed for 02/18/2027. Prep is set for 02/04 and 02/16/2027.",
   "ask": "After the 10/08 report, what's the graded move: a fourth knock, or something else?"
  },
  "task": {
   "say": "In Part one, escalate for Skip-Trace authority through Tasks, Escalate, then evaluate the 10/09 return, choosing the address on recency and two corroborating sources, and record why. Re-instruct Allied, log service on 10/14 and the affidavit on 10/16, and docket the answer date. In Part two, run Steps 1 to 3 of the No Contact Protocol with the litigation impact, then draft the Step 4 certified notice in the Action Plan Editor for Atty. Thorne's signature: attempts itemized, a 7 to 14 day response date before 02/04/2027, how to respond. Send it certified mail and email to a confirmed address. You'll also call Margaret Doe: verify her identity, say only that the firm needs John to call, and log it. Then assess John's Skip-Trace gate.",
   "ask": "John and Smith both have no working contact point. Why does Smith get a Skip-Trace and John doesn't?"
  },
  "check": {
   "say": "Time for your self-check. Part one: you escalated for Skip-Trace after 10/08/2026, not a fourth knock; chose 4410 Quarry Ridge Ct on two current sources and rejected 118 Larkspur Ln as stale; logged service 10/14/2026, the affidavit 10/16/2026, and docketed the answer for 11/13/2026. Part two: Step 1 names the deposition, 27 days out, the prep dates and the 03/15/2027 expert disclosure. Your ladder is logged, calls, email to john.doe@example.com, text, then Margaret. Now check every response date against 02/04/2027; a 14-day window from 01/22 lands on 02/05, too late, so it's sent by 01/27/2027 for 02/03/2027. Certified mail to 2214 Maple Hollow Rd and email, signed by Atty. Thorne. No withdrawal language from you, anywhere. And the gate isn't met: John was reached 02/03/2027.",
   "ask": "Where does your notice's response date fall against the 02/04/2027 prep session?"
  }
 },
 "d5m4-kc": {
  "questions": {
   "say": "This is the Final Comprehensive Knowledge Check, the last one before Track B's close-out. It spans all five days, and every answer comes from one file: John Doe's names, dates and figures, not general rules. Write in your own words under each question. Lay out the Recovery Stack in its order of operations, with each limit and the total, and name three coverages that aren't part of it, then the Payer Order for his Medical Bills. Tell me when the window on the 07/20/2026 BI demand closed and why. And reconcile the Track A net of {{netA}} from $40,000.00, deduction by deduction.",
   "ask": "Before you start, what's the first layer of John's Recovery Stack?"
  },
  "summary": {
   "say": "Before you write your self-summary, let's do Question 7 out loud. John asks you how to explain the gap. What do you say? The only right answer listens, tells him Atty. Thorne will go through it with him, escalates at once and logs the call. Then Question 4, the arithmetic gate: $40,000.00, less the $13,333.33 fee, $486.75 in costs, and the $1,240.00 and {{payoffA}} liens, leaves {{netA}}, to the cent. Now your scenario: 01/28/2027, John unreachable for six days, deposition noticed for 02/18/2027, defense counsel asking to inspect the Civic. Your next five actions, in order, with owners.",
   "ask": "John asks how to explain the gap. What do you say?"
  },
  "scale": {
   "say": "Last step for the final check. Rate yourself 1 to 5 on each competency across all five days, then submit for review. I'll compare your ratings with your scores. Please be honest with yourself here, because this is what we'll coach from. And know that UPL is a gate, not a weight. A 5 on the UPL competency from someone who coached John in Question 7 doesn't pass, however strong the rest of the paper is.",
   "ask": "Across all five days, which competency surprised you most when you rated it?"
  }
 },
 "d5m5-l1": {
  "why": {
   "say": "Put the two nets side by side. On Track A, John Doe netted {{netA}}. On Track B, the 07/06/2027 award brings in the same $40,000.00 gross, and he nets {{netB}}. So what changed? Not the gross. Keystone's stonewall turned a $40,000.00 settlement into a lawsuit, a mediation and an arbitration, and that moved three things: the fee tier, the costs and the lien math. John's going to notice that difference, and he deserves to understand it. That's what the Net Sheet does. It shows him exactly why, line by line, before he signs anything.",
   "ask": "Same $40,000.00 gross on both tracks. What changed to bring John's net down?"
  },
  "rules": {
   "say": "The award ends the case, not the work. Laura Whitcomb's 07/06/2027 award gives Harbor Point's $20,000.00 and Cardinal State's $10,000.00, and with Keystone's $10,000.00 BI from the 03/18/2027 mediation, the gross is $40,000.00. The fee follows the retainer: suit filed 09/24/2026, so 40%, $16,000.00, confirmed by Atty. Thorne. Litigation costs need receipts too: filing $218.00, service $285.00, mediation $1,200.00, arbitration $900.00, reporter $645.50, records $160.00, plus the pre-suit $486.75, totaling $3,895.25. The fund pays only what's owed. Peach State's reduction follows the fee charged, $744.00, accepted at $1,116.00, and Riverton Spine & Rehab accepts {{payoffB}}. Net: {{netB}}. Nothing leaves trust until checks clear, Payoff Letters are in and John signs. You explain the arithmetic; whether suing was worth it is Atty. Thorne's conversation.",
   "ask": "Peach State's reduction was $620.00 on Track A. Why is it $744.00 now?"
  },
  "job": {
   "say": "Picture the close-out as it actually runs. The award arrives on 07/06/2027. You log it under Litigation and diary each carrier's payment: Harbor Point $20,000.00 and Cardinal State $10,000.00. Once the fund is known, you prepare the Reduction Requests in the LSH Net Sheet and send them for Atty. Thorne's approval, and they come back as Peach State at $1,116.00 and Riverton Spine & Rehab at {{payoffB}}. Then, when the last UM check has cleared, you complete the Net Sheet and route the Settlement Statement through Tasks, Escalate, showing a net of {{netB}}, all before John Doe signs anything. Three steps, and every one of them leaves a record."
  }
 },
 "d5m5-a1": {
  "case": {
   "say": "It's 07/22/2027. Laura Whitcomb's 07/06/2027 award gave Harbor Point's $20,000.00 and Cardinal State's $10,000.00. Harbor Point's check came 07/20, and Cardinal State's arrived this morning, joining Keystone's $10,000.00, held in trust since 03/29/2027. That's all $40,000.00 in trust. Peach State accepted $1,116.00 on 07/14, and Riverton Spine & Rehab accepted {{payoffB}} on 07/16, both in writing, and every litigation cost is receipted. Atty. Thorne's note reminds us suit was filed, so the fee is the 40% tier under John's retainer. He wants the Net Sheet and the Settlement Statement for his review before John sees anything. Open the Net Sheet beside this slide and check it at the Track B stage.",
   "ask": "Before you enter a single number, what fee percentage applies at the Track B stage?"
  },
  "task": {
   "say": "You'll complete John Doe's LSH Net Sheet for the litigated recovery. Section one is the gross by carrier. Section two is the 40% fee and every receipted cost, pre-suit and litigation, each on its own row. Section three lists every provider and payer with charges, payments, adjustments and balance owed, and each lien's reduced figure with its Payoff Letter. Section four is the net to John. Tie it to the Trust Ledger in CMS, then route the Settlement Statement to Atty. Thorne through Tasks, Escalate. You'll also take John's call: walk him through fee, costs, liens and net, show the 40% from his own retainer, and give the reduced liens with their acceptances. Hand in a Net Sheet reaching {{netB}}, every number proved.",
   "ask": "John says a friend kept more from his settlement. What do you say?"
  },
  "check": {
   "say": "Check your Net Sheet before you log it. The gross is Keystone $10,000.00 from mediation, plus Harbor Point $20,000.00 and Cardinal State $10,000.00 from the award, $40,000.00. The fee is the 40% tier, $16,000.00, confirmed from the retainer, not 33⅓% from habit. Costs come to $3,895.25, each on its row with a receipt. Liens: Peach State from $1,860.00 down to $1,116.00, and Riverton Spine & Rehab from $6,290.00 to the audited $6,105.00 to {{payoffB}}, totaling {{liensPaidB}}, each reduction's basis on its line. Zero-balance lines like PIP's $5,000.00 and Crescent's $1,540.00 write-off stay off the payables. Net {{netB}}, tied to the $40,000.00 in trust. Nothing disbursed until John signs on 07/29/2027, disbursement 07/30/2027. And no lien paid from a phone call.",
   "ask": "Does your Trust Ledger tie to the $40,000.00 gross to the cent?"
  }
 },
 "d5m5-kc": {
  "questions": {
   "say": "This is the last check of the Case Flow. John Doe's file is now closed, from intake all the way to the award, so take a moment to appreciate that. Answer from the file, in your own words, under each question. Take the $40,000.00 award down to John's {{netB}}, naming every deduction with its figure and source. Explain why the fee is 40% on this file, which document says so and who confirms it. And show why Peach State accepted $1,240.00 on Track A but $1,116.00 on Track B.",
   "ask": "Which document tells us the fee on this file is 40%?"
  },
  "summary": {
   "say": "Now your self-summary, in your own words. Keep Question 5 in mind as you write, because it's the UPL gate: arithmetic, yes; opinion, no. If you say the lawsuit was or wasn't worth it, you've crossed the line, however good the rest is. Then your scenario: it's 01/28/2027, John's been unreachable for six days, his deposition is noticed for 02/18/2027, and defense counsel wants to inspect Margaret's Civic. Give me your next five actions, in order, and who owns each one.",
   "ask": "Where exactly is the line between explaining John's net and judging whether suing was worth it?"
  },
  "scale": {
   "say": "And here we are, the very last rating of the course. Score yourself 1 to 5 on each competency, then submit it for review. I'll sit down with your rating beside your score, and if there's a wide gap either way, we'll talk it through together. You've carried one file from intake to award. Be as honest about yourself as you've been with John's numbers.",
   "ask": "Looking back across the whole Case Flow, which skill do you feel strongest in now?"
  }
 },
 "d5m6-l1": {
  "why": {
   "say": "Here's a phase John Doe's file never reaches. His case is never dropped: earlier today the Skip-Trace found the people his file needed. But not every case ends in a settlement or an award. Sometimes Atty. Thorne decides the firm can't keep going, and when he does, someone has to close the file properly. That's you. A Dropped Case is a claim the firm stops pursuing before it resolves. The client, every carrier and every provider has to know the representation has ended, and the file has to prove they were told. Done carelessly, a drop leaves a client confused and the firm exposed.",
   "ask": "If a Dropped Case just went quiet in the CMS with no letters, who could be hurt by that?"
  },
  "rules": {
   "say": "Six steps, always in this order. First, the gate: the status reads Pending Drop, and there's a note from Atty. Thorne or the Case Manager that the client was told. If either is missing, nothing goes out, because the letter must never be the client's first news. Second, prepare a Withdrawal Letter for every party on the file, over Atty. Thorne's signature, saved in Word and PDF. Third, send each one by its method. Fourth, annotate each dispatch with party, method and date, and save the sent letter to the file. Fifth, follow up on receipt. Sixth, switch the status to Dropped and keep the proof. An unresponsive client only gets here through the No Contact Protocol from Client Communications. We don't repeat it here; this is where it ends.",
   "ask": "The status says Pending Drop but there's no note. What do you do?"
  },
  "job": {
   "say": "Here's how it runs on the job. The trigger is the status Pending Drop, with Atty. Thorne's note that the client was told. You open the Action Plan Editor and prepare each party's Withdrawal Letter from the template, for his signature, and you save each one in Word and PDF. Once the letters are signed, you send each by its method, by email, text, fax or Certified Mail, and you log the party, the method and the date in the Communications Log. And once the receipts are followed up, you switch the status to Dropped and file the proof in Documents: the receipts, the logs and the attorney's note."
  }
 },
 "d5m6-a1": {
  "case": {
   "say": "This one's a practice matter, not John Doe's file, so don't open it or create it in the CMS. It's 12/09/2026. Denise Harlow was rear-ended at a red light on 09/19/2026. Granite Shield Insurance has the BI claim, GS-26-48213, and the CRM says its adjuster, Paul Ostrander, takes email only. She treated at Brookside Physical Therapy from 09/24 to 10/29/2026, then stopped. She has no Health Plan to pay for care, and Brookside declined a Letter of Protection. Atty. Thorne has decided to drop the case. The status is Pending Drop, and his note from 12/08/2026 says he called Denise, she understood, her address at 87 Alder Creek Dr is confirmed, and she prefers text and email.",
   "ask": "Before you draft a word, which two things on this file do you check?"
  },
  "task": {
   "say": "You'll work in the Action Plan Editor. Record the gate you checked. Then draft three Withdrawal Letters for Atty. Thorne's signature. Denise's carries the date, her name, the date of loss, the reason in his note's words, and the next step he approves: speak to another attorney promptly, because time limits apply. Granite Shield's and Brookside's carry the date, the client, the date of loss and the claim number, and say only that the firm no longer represents her. Name each send method and why. Then write the close-out log: Word and PDF saved, each dispatch annotated, the follow-up, the switch to Dropped and the proof retained. And be ready for Denise's call, because she'll ask whether her case was worthless.",
   "ask": "What will you say when Denise asks whether her case was worthless?"
  },
  "check": {
   "say": "Check your work before you log it. The gate is recorded: Pending Drop and Atty. Thorne's 12/08/2026 note, both confirmed before anything was prepared. Denise's letter is dated 12/09/2026, names the 09/19/2026 date of loss, quotes his reason and gives the approved next step. Granite Shield's letter shows claim GS-26-48213 and the date of loss, Brookside's asks them to update their records, and neither says why. Every letter is saved in Word and PDF. Denise gets text, email and Certified Mail to 87 Alder Creek Dr, Granite Shield gets email, and Brookside gets a fax. Each dispatch is logged, the follow-up is on 12/16/2026, and the status moves to Dropped only after that, with the proof kept.",
   "ask": "Does any letter except Denise's mention treatment or insurance?"
  }
 },
 "d5m6-kc": {
  "questions": {
   "say": "Three questions, answered from the practice matter in your own words, under each one. First, name the two things you confirm before any Withdrawal Letter goes out, and why both matter. Second, tell me what goes in Denise Harlow's letter that doesn't go in Granite Shield's or Brookside's, and why we keep it that way. Third, Denise's letters went out on 12/09/2026: what has to be true before her status becomes Dropped, and what proof stays in the file? Names, dates and methods, please, not general rules.",
   "ask": "Which of the three letters is the only one that explains why?"
  },
  "summary": {
   "say": "Now your self-summary. In your own words, what did you learn closing a Dropped Case? I want the principles behind the close-out, not the clicks. Then your strategy: Denise's letters are out, and on 12/16/2026 her return receipt still hasn't come back. What's your next action, and why is it the right one rather than something else? And be honest about the one thing in this module you're least sure of. Keep the line in mind as you write: if your answer explains the drop to Denise, or tells her what to do next, it has crossed into Atty. Thorne's territory.",
   "ask": "Whose job is it to tell Denise why her case was dropped?"
  },
  "scale": {
   "say": "Last, rate yourself from 1 to 5 on each skill: confirming the Pending Drop gate before anything goes out, drafting a Withdrawal Letter for each party, choosing and logging each send method, and closing the file with proof and without advice. Submit it for review, and I'll compare your rating with your answers. A wide gap either way is worth a conversation, not a grade. Then we move to the last phase of the course, John Doe's award and disbursement.",
   "ask": "Which of these four skills would you most want to practice again?"
  }
 }
};
