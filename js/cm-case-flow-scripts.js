/* The trainer's scripts: what the trainer says on each Case Flow slide (Presenter view's "Script — read aloud",
   and the day's Trainer Speaker Notes), assembled from build/case-flow/scripts/dN.json by
   build/case-flow/scripts/assemble.cjs. Written to build/case-flow/scripts/SCRIPTSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SCRIPTS = {
 "d1m1-role": {
  "theory": {
   "say": "• You own the file's movement; Atty. Thorne owns every legal judgment\n• Case Management: the end-to-end coordination, tracking and handling of a case, from intake to resolution\n• It ensures three things: timely progression, proper documentation and compliance, effective communication between all parties\n• First duties: case updates and summaries Atty. Thorne can decide from in one read\n• Research the relevant laws and rules, and draft and file every document to the firm's standard"
  },
  "theory2": {
   "say": "• Watch task compliance and case progress: every task owned and dated, every phase moving\n• Client communication: John Doe kept informed, every contact logged the same day\n• Case health analysis: read the whole file for risk, like a missed deadline, a silent client or a gap in treatment\n• Allocate resources and recommend next steps; strategy itself stays with Atty. Thorne"
  },
  "frame": {
   "say": "• The General Process runs in seven steps, from intake and case opening to resolution and closing\n• Intake includes the Conflict Check; planning means you draft, Atty. Thorne sets strategy\n• Documentation and communication: the CMS is the single source of truth, every contact logged\n• Monitoring: every deadline docketed; billing support keeps bills, liens and costs current for the demand\n• Each case phase, Intake to Litigation, has its own goals, responsibilities and deliverables"
  },
  "rules": {
   "say": "• Case Manager owns deadlines, documents, insurers, doctors and client updates\n• Atty. Thorne owns every legal judgment: value, strength, strategy, whether to settle\n• Log every contact, document and deadline in the CMS the same day; if it isn't in the CMS, it didn't happen\n• Allowed: explain the process, confirm facts; never: tell a client the case value or whether to take an offer\n• Red flag: a note to Atty. Thorne headed \"Update\": the ask waits, the SOL, 02/06/2028, doesn't; rewrite it as the decision and its deadline",
   "ask": "A client asks whether to take the offer. What do you say?"
  },
  "model": {
   "say": "• Case lifecycle, eight stations: Intake, Claim Set-Up, Treatment, Pre-Demand, Demand, Settlement and Liens, Disbursement, Litigation\n• Liens: bills paid out of the settlement before the client gets their share\n• Litigation is dashed: the path only taken if the case doesn't settle\n• Navy band: Case Manager owns the movement; orange band: Atty. Thorne owns every legal judgment\n• The CMS sits under station one because the whole track runs on it"
  }
 },
 "d1m1-upl": {
  "theory": {
   "say": "• UPL: unauthorized practice of law, giving legal advice without a law license\n• It usually happens by accident, when a Case Manager tries to help a worried client\n• Fact sharing: telling John Doe what a record says, like a date, an amount, an appointment time, when a letter was sent\n• Process explanation: what happens next, what a form is for, who decides, never how it ends\n• Legal advice: any opinion on what his facts mean for rights, money or choices; Atty. Thorne only\n• Hear, log, route: write his question word for word, send to Atty. Thorne same day, give a time frame"
  },
  "rules": {
   "say": "• Legal advice: any opinion on what his facts mean: value, strategy, settling, a Treatment Gap's effect on the money; facts and process are free\n• Test before speaking: what is, or what it means; a guessed number anchors him, and fair offers feel like insults\n• A question crosses the line: hear him out, log his exact words in Case Notes, route it to Atty. Thorne that day, set his expectation\n• Asked case value: open a task, no number; asked what happens next: the next step, plainly, no prediction\n• Adjuster or doctor's office asks your view: decline, approved facts only, log it; nothing is off the record",
   "ask": "John Doe asks if his case is any good. What is your answer?"
  },
  "model": {
   "say": "• Same questions answered two ways: fact sharing on the left, crossing the line on the right\n• Left examples: date of loss 02/06/2026 from the Police Report; next step is a letter to each insurer\n• Left routing line: that's for Atty. Thorne, logged, he'll call by Friday\n• Right examples: probably worth policy limits, take the offer, the gap will hurt, don't worry\n• Kind words about the outcome are still advice"
  },
  "dodont": {
   "say": "• Do: answer from the record, like reading 02/06/2026 from the Police Report; route what it means\n• Do: use one routing line every time and give a time frame for the answer\n• Don't: reassure about the outcome, guess a value off the record, or coach what to tell an adjuster\n• Safe kindness is a clear next step and time frame, not a guess\n• Red flag: \"Don't worry, you'll be fine\" sounds kind but is advice, because it predicts his outcome\n• Stop, log his question word for word, and route it today",
   "ask": "What sentence will you use every time a client asks what their case is worth?"
  }
 },
 "d1m1-l1": {
  "map": {
   "say": "• Opening a file runs in six steps, in order, on day one\n• 1 Conflict Check: every party's full legal name, before the file exists; 2 verify date of loss against the Police Report\n• 3 Calendar the statute of limitations, the legal deadline to sue, on day one\n• 4 Map every role and client seating; 5 insurance from the Dec Page; 6 name and file every document"
  },
  "theory": {
   "say": "• The Intake Phase is where you establish control, structure and clarity from the very first day\n• It is not just data collection: it is the first chance to get accuracy, compliance and direction right\n• Your role: verify and organize the essential facts while making sure the case meets acceptance standards\n• Initial client contact gathers the basic facts, assesses urgency and decides whether the case can move forward"
  },
  "theory2": {
   "say": "• You are the gatekeeper of quality: intake work complete, accurate, documented and ready for activation\n• Run the Conflict Check in the system before anything else, on every party's full legal name\n• Review every document for completeness and relevance; name the file and enter it in the system properly\n• Work independently: spot missing or inconsistent information, decide on basic acceptance, and tell the client or team the next steps"
  },
  "frame": {
   "say": "• The intake workflow in five steps, as on John Doe's file\n• The raw file arrives from On the Records; check date of loss, parties and signatures against the Police Report\n• Run the Conflict Check on every full legal name and log its date and result\n• Complete intake moves to acceptance; uncertain eligibility goes to Atty. Thorne\n• Then the file is created and logged: roles mapped, statute of limitations docketed, documents named\n• This phase decides whether the case moves forward or is declined"
  },
  "rules": {
   "say": "• Gatekeeper: the raw file comes from On the Records; incomplete intake goes back\n• Conflict Check first, in CMS 📝 New Intake: Robert Smith, host driver, resident relative; record date and result\n• SOL docket: date of loss 02/06/2026 matches the Police Report; two years gives 02/06/2028, a Sunday, so the hard date is Friday 02/04/2028\n• Filing cutoff 90 days earlier: Saturday 11/06/2027 moves back to Friday 11/05/2027; all four dates on the Calendar, day one\n• Check story, parties and signatures; never quietly fix a mismatch; all six roles in Parties, seating position, emergency contact\n• Retainer and HIPAA authorization logged in Documents, firm naming; insurance from the Dec Page; never case value"
  },
  "model": {
   "say": "• Raw intake passes three gates, verify, map, structure, into a clean CMS matter card with six roles\n• A driver in his own car may only reach his own policy\n• A passenger can reach the host car's coverage too, sometimes a relative's\n• Same crash, but available money can be four times larger, decided by one field\n• Confirm John Doe's position from the Police Report and record it"
  },
  "dodont": {
   "say": "• Do: record the source of every coverage fact, e.g. Harbor Point Host UM $20,000 with its Dec Page or letter\n• Do: docket the statute of limitations day one; date of loss 02/06/2026, deadline 02/06/2028; CMS is the single source of truth\n• Don't: create the file before the Conflict Check, or run it on a partial name like \"R. Smith\"\n• Don't: accept a case because intake mostly looks fine; On the Records files arrive unverified\n• Red flag: counting the SOL from the intake date, 02/09/2026, dockets 02/09/2028, three days past the limit\n• Recount from the date of loss on the Police Report, and put all three dates on the calendar",
   "ask": "Why must the Conflict Check happen before the file is created?"
  }
 },
 "d1m1-open": {
  "task": {
   "say": "• Start the matter in New Case; run and record the Conflict Check on every party's full legal name first\n• Check the draft field by field against the documents: date of loss, names, roles, position, date of birth, report number\n• Fix each error and note its source; never fix silently\n• Calendar the 02/06/2028 deadline with reminders; map six roles; log retainer and HIPAA; file documents named the firm's way\n• Insurance checkpoint: each layer in order, first- or third-party, every field or its gap, each limit's source, PIP outside the stack\n• Send Atty. Thorne a correction note in Case Notes"
  },
  "case": {
   "say": "• 02/09/2026: email from On the Records; new client John Doe, front-seat passenger, collision 02/06/2026 at Maple Hollow Rd and Birch Ave\n• Attached: New Client Intake Sheet, intake supplement, retainer, signed HIPAA authorization, Riverton PD crash report\n• A colleague's draft intake record is already in the CMS, and it has mistakes\n• Atty. Thorne wants the matter active today"
  },
  "check": {
   "say": "• Conflict Check done before the matter existed, on full legal names\n• Date of loss 02/06/2026 confirmed against the Police Report; deadline 02/06/2028 calendared with reminders\n• Position corrected to front-seat passenger; date of birth and swapped report number fixed, each with its source\n• Six roles mapped; retainer and HIPAA logged with signing date 02/09/2026; documents named before filing",
   "ask": "Where in Case Notes would Atty. Thorne see why the date of birth changed?"
  }
 },
 "d1m1-drive": {
  "task": {
   "say": "• Required every day, straight after the Skill Building: today it builds John Doe's backup drive\n• Press Launch CMS & Google Drive; not linked yet, paste your shared folder's link in the Backup Drive panel\n• Build 01 Clients with Doe-John inside and its nine numbered folders, intake and retainer through litigation\n• Add the firm folders: administration, templates, closed files\n• Submit in My Backup Drive, fix what it returns, then run Check my drive until clean\n• In Case Notes, place the signed retainer, Police Report and HIPAA authorization, with reasons"
  },
  "case": {
   "say": "• 02/09/2026, 4:30 p.m.: John Doe's matter is active in the CMS, nothing on the backup drive yet\n• Every file is built to one standard so a covering colleague finds any document in seconds\n• Standard: 01 Clients, client folder last name first, nine numbered folders intake to litigation, then firm folders\n• It is graded twice: Submit grades their Case Notes, and the drive itself is checked folder by folder"
  },
  "check": {
   "say": "• Drive folder shared as Editor and linked\n• Every folder named and numbered exactly to the standard, nothing invented or renamed\n• Doe-John under 01 Clients with all nine folders in order; Check my drive shows nothing missing\n• Case Notes: retainer and HIPAA authorization in Intake and Retainer, Police Report in Police, Witness and Video",
   "ask": "If a folder goes missing next week, how will you know and what do you do?"
  }
 },
 "d1m1-kc": {
  "questions": {
   "say": "• Answer from John Doe's file, in your own words, typed under each question\n• Q1: the seven stages in order, and what the Case Manager owns at Intake and Case Opening\n• Q2: John asks his case's worth and if waiting hurt it: exact words, who answers, what to record and route\n• Q3: what must happen before the matter is created in the CMS, on whose names, and why order matters"
  },
  "summary": {
   "say": "• Write the principles in your own words, not the clicks\n• Scenario: Robert Smith's insurer called John Doe, and he needs a car for work\n• Cover what to tell him today, in what order, and what must be on file before claim set-up\n• Recorded Statement: a taped interview the adjuster can quote forever\n• Strong answers put things on the record and send value or fault questions to Atty. Thorne"
  },
  "scale": {
   "say": "• Rate yourself 1 to 5 on each skill, then submit for review\n• Self-rating is compared with your score; big gaps get discussed\n• If it isn't in the CMS, it didn't happen\n• UPL (unauthorized practice of law) is a gate: a strong score does not survive an ethics breach",
   "ask": "If a client stops answering the phone, what is the first thing you do?"
  }
 },
 "d1m2-l1": {
  "theory": {
   "say": "• Clients go quiet for ordinary reasons: pain, overwhelm, a changed phone; the case and its deadlines keep running\n• No Contact Protocol, the step-by-step plan for a silent client: track the silence officially, prove the firm tried, protect the firm if questioned later\n• Look inside the file first: case status, deadlines, last contact\n• Then the ladder: two calls, email and text, emergency contact, certified letter (mail with proof of delivery); then tell Atty. Thorne what the silence risks\n• Due diligence: written proof of a real, reasonable effort; approved channels: the contact ways agreed at intake\n• Emergency contact on this file: Margaret Doe, his mother"
  },
  "frame": {
   "say": "• Silence usually starts with a bottleneck: a spot where the work slows or gets stuck\n• Missing information like a wrong number, slow follow-up, a Conflict Check stuck in backlog\n• Intake forms with wrong dates or missing signatures, facts needing attorney review, gaps between departments\n• Check the firm's own bottlenecks before blaming the client; a gap on the firm's side weakens the demand"
  },
  "rules": {
   "say": "• A missed appointment: Step 1, internal review in the Case Summary first: status, deadlines, last contact, here 02/10\n• Step 2, the ladder: two calls at least, email and text, emergency contact, certified mail; by channel, not volume\n• Here: calls 02/11, 02/13, 02/16; email and text 02/16; Margaret Doe that day, never the case; second email 02/18\n• Red flag: voicemails 02/11 and 02/13 never logged; unlogged means not made. Log date, time, channel, outcome\n• Step 3, 02/20/2026: Atty. Thorne through Tasks, with the impact: SOL 02/06/2028 and any hearing dates\n• Tell the client what is needed and by when, never that the case is dropped; the log answers \"minor injuries\""
  },
  "model": {
   "say": "• Six stations: internal review, contact attempts, team notification in colour; Steps 4 to 6 greyed for the next lesson\n• Station two opens into the ladder: phone, email and text, emergency contact, certified mail\n• Each rung is wider: it reaches further and costs more; don't skip rungs or stay on one\n• Red card: the statute of limitations, the legal deadline to file suit, keeps running throughout"
  },
  "dodont": {
   "say": "• Do: set a follow-up reminder the moment each request goes out\n• Do: make answering easy; as a Northgate shift lead he can't take calls on the floor, so text or upload link\n• Don't: let a file sit unlogged while waiting on the client, or blame the client for a process gap\n• Strong: log every attempt and switch channel instead of a third call to the same phone\n• Red flag: voicemails of 02/11 and 02/13 never reached Case Notes; an unlogged attempt didn't happen; log each now with date, time, channel, outcome",
   "ask": "Why does calling Margaret count as a new channel when a third call to John's mobile doesn't?"
  }
 },
 "d1m2-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log it in CMS › Notes › Case Notes: the two earlier voicemails, then an email\n• A text and the emergency contact, each with date, time, channel and outcome\n• Step 2: Record the next action and its due date in Case Notes"
  },
  "case": {
   "say": "• Assuming John Doe has been silent six days and the Step 1 review is done, his outreach attempts now need logging in order\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: an unbroken, contemporaneous outreach log, the next action dated"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Every entry: date, time, channel, outcome; Email and SMS attempted, not repeat calls; No entry threatens withdrawal or closure\n• The one thing to watch for: Logging “called client, no answer” with no details"
  }
 },
 "d1m2-l2": {
  "theory": {
   "say": "• Final Warning Letter: the last written notice and last cheap step before paying to find the client or the attorney ending the case\n• Two jobs: specific enough that the client answers, documented enough to back up what comes next\n• Sent two ways: certified mail proves delivery; email is what people read\n• Three-criteria gate: ladder done, letter sent, letter's deadline passed; all three before acting, the cheap letter before the expensive search\n• Skip-trace: a paid search for a current address and phone; it costs money, so the attorney approves\n• Withdrawal: the firm stops representing the client; only the attorney decides, under firm and court rules"
  },
  "frame": {
   "say": "• Step 4, Final Warning Letter: earlier attempts listed, 7 to 14 days to respond, warning the firm may withdraw\n• Step 5, no answer: the attorney decides on a Notice or Motion to Withdraw, telling the court the firm is leaving\n• Step 6: close the file \"No response, withdrew per protocol,\" keeping every proof\n• The Case Manager drives the letter and builds the record behind Steps 5 and 6"
  },
  "rules": {
   "say": "• Step 4 goes by certified mail and email, both: attempts listed, 7 to 14 day deadline, possible withdrawal\n• Confirm the current address first; a letter to a stale address proves nothing\n• Skip-trace only with all three conditions met and counsel's approval, full log attached\n• Real dates, like \"Called 02/10, voicemail 02/13,\" not \"tried several times\"\n• Withdrawal may be called possible; never judge the claim or announce the case is over"
  },
  "model": {
   "say": "• Left: the letter on letterhead, four required parts: attempts listed, 7 to 14 day deadline, withdrawal possible, how to respond\n• Above it: certified mail AND email, not either\n• Right: the Step 5 fork: response by the deadline? Yes, the file picks back up\n• No: a gate of three chips, ladder done, letter sent, deadline passed, before skip-trace and the attorney's decision"
  },
  "dodont": {
   "say": "• Do: itemize every attempt by date; have in-house help confirm the address, 2214 Maple Hollow Rd, first\n• Don't: start a skip-trace on one condition alone, or announce withdrawal in a letter the attorney never approved\n• Weak: a vague please-call note; strong: every attempt by date, a clear deadline, withdrawal possible\n• The Case Manager builds the record; only the attorney ends representation\n• Red flag: a draft that says the firm is withdrawing or \"you will lose your case\"; strike it, that decision is Atty. Thorne's alone\n• The draft goes to Atty. Thorne before it goes anywhere",
   "ask": "Who decides that representation is ending, and who tells the client?"
  }
 },
 "d1m2-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Doc Hub\n• Fill in the Final Warning Letter template: list the earlier attempts with their dates and set a reply date 7 to 14 days from today\n• Step 2: Log it in CMS Case Notes: the letter went by certified mail and by email, and Atty. Thorne decides any next step"
  },
  "case": {
   "say": "• Assuming the No Contact Protocol has been maxed (phone, email\n• Texts and emergency contact all tried and logged), John Doe's Step 4 Final Warning Letter is due today\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a send-ready Final Warning Letter, both deliveries logged, escalation recorded"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: DOL 02/06/2026 and file reference present; Deadline is a date inside 7–14 days\n• Withdrawal noted as possible, not decided; Certified mail AND email both recorded; No statement on value or legal consequences\n• The one thing to watch for: a deadline of “as soon as possible”"
  }
 },
 "d1m2-kc": {
  "questions": {
   "say": "• Learning Check: written answers from the file, in own words\n• Set out the six No Contact Protocol steps and what each requires\n• State the three purposes and which protects the firm: protection from liability, the one most often left out\n• A colleague logged three voicemails on three days and called the ladder done: what's wrong, what should the log show"
  },
  "summary": {
   "say": "• Self-Summary: the principles in own words\n• Scenario 04/08/2026: Riverton Spine & Rehab reports two missed visits, John Doe answers no one\n• Dana Whitfield has asked John for a Recorded Statement\n• Write the first, second and third steps and what each protects: the running SOL, a hardening gap, ongoing claims work"
  },
  "scale": {
   "say": "• Skill Scale: rate each competency 1 to 5 and submit\n• A snapshot, not a grade; ratings are compared with the Knowledge Check score\n• A wide gap either way means a short coaching conversation\n• Looking ahead: his transport fell apart 04/01 and visits slipped; note what could have been done that day",
   "ask": "Which competency is hardest to rate honestly, and why?"
  }
 },
 "d1m3-l1": {
  "theory": {
   "say": "• Most self-inflicted claim damage happens in the first two weeks, before the client is told: a gym selfie, chatting with the other insurer, skipped therapy\n• Case Manager gives the instructions; Atty. Thorne explains what they mean for the claim\n• Four topics: standing instructions, keeping treatment going, keeping receipts, the car exception; anything he says, posts, signs or skips can become evidence\n• Recorded Statement: the insurer taping the client's version of the crash, usable later\n• Letter of Representation: tells the other side to contact the firm, not the client\n• Medical danger threatens health, call the doctor's office; legal danger threatens the claim, tell Atty. Thorne"
  },
  "rules": {
   "say": "• No Recorded Statement to the other driver's insurer; all contact goes through the firm\n• Start treatment, keep every appointment, report barriers like rides, money or work before a visit is missed\n• Post nothing about the crash, injuries or activities; sign nothing until the firm reviews it\n• Keep every receipt, including mileage\n• Go through each rule by phone, have the client repeat it back, and log that they understood"
  },
  "model": {
   "say": "• Board layout: green Do column on the left, red Don't column on the right\n• Each Don't lines up with the Do that replaces it\n• Examples: no Recorded Statement, no posts, bring any insurer release to the firm instead of signing it\n• Ask family not to tag the client in posts either\n• Three orange tags most broken in week one: no Recorded Statement, keep every receipt, car only"
  },
  "dodont": {
   "say": "• Do: ask about barriers to care at every check-in; John Doe owns no car, so rides matter\n• Do: listen actively, for example when he worries about missed shifts at Northgate Distribution\n• Don't: explain why a Keystone Mutual Recorded Statement could hurt him; that is legal advice for Atty. Thorne\n• Don't: let a Property Damage call drift into questions about his injuries\n• Social media rule covers vacations and activities too\n• Red flag: Keystone's Dana Whitfield asked John to record his account (voicemail, 02/09/2026, 8:47 a.m.); written notice today, statements through the firm; Atty. Thorne's call",
   "ask": "Which of these rules is John Doe closest to breaking right now?"
  }
 },
 "d1m3-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In the Email Workspace, tell Dana Whitfield the firm represents John Doe: no direct contact, and any Recorded Statement goes through the firm\n• Step 2: Log it in CMS › Notes › Case Notes, with a task in CMS › Tasks to set up his first visit at Riverton Urgent Care"
  },
  "case": {
   "say": "• Assuming John Doe's voicemail is transcribed and Keystone has asked to record him, the firm's instruction and his first visit now need logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Keystone told in writing, every contact logged, the first visit tasked"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Dana told in writing: no direct contact; Recorded Statement routed through the firm; First visit tasked with a date\n• The one thing to watch for: Telling Dana anything about his injuries"
  }
 },
 "d1m3-l2": {
  "theory": {
   "say": "• John Doe was the front-seat passenger in Kevin's Escape and owns no car\n• The damaged car is Margaret Doe's 2019 Honda Civic, with Leah Moran at Keystone under $25,000 PD coverage\n• That claim sits outside John's $40,000 stack; PD touches the case only as impact evidence and where its dates reach his care\n• Property Damage (PD): the car side of a crash; the claim follows the vehicle and belongs to the owner\n• The damage is evidence: photos, estimates and supplements show how hard the hit was\n• Where the owner's claim touches the client's care, coordinate; everything else about it goes to the attorney"
  },
  "frame": {
   "say": "• Intake: a tow from the scene and crush photos flag a serious injury early; keep them\n• Treatment: structural damage matches the injuries providers record\n• Demand: estimates and supplements answer the low-impact fender-bender argument\n• Negotiation and litigation: photos keep the injury from being called minor and support experts\n• Rental, Loss of Use and the repair argument never appear in John Doe's column"
  },
  "rules": {
   "say": "• Read the Police Report unit boxes first: who rode in which car, who owns which car\n• Index photos, Repair Estimate, supplements and the tow on John's file as evidence\n• Margaret's rental, Loss of Use, Diminished Value and repair negotiation: leave on her claim, refer\n• Keystone accepted PD liability on 02/17/2026: record the fact; its meaning is Atty. Thorne's\n• If a car call turns to John's neck, it stops and comes to us\n• Red flag: a rental, PD or Loss of Use claim opened in John's name; keep PD under Margaret Doe, refer her claim"
  },
  "model": {
   "say": "• Walk the six-row sort table\n• Point-of-impact photos, Repair Estimate and supplements: evidence of force, on John's file\n• Police Report units: cite in the Case Note for who rode and who owns\n• Margaret's rental: hers, but its last covered day removes John's ride to treatment; calendar it, plan rides\n• Loss of Use, Diminished Value, repair argument: Margaret's, referred, never negotiated",
   "ask": "Why is the rental row partly ours and partly Margaret's?"
  },
  "dodont": {
   "say": "• Do: ask of every PD fact whether it touches our case\n• Do: index photos and estimates the day they arrive, e.g. the Escape's crushed front passenger door\n• Don't: open a rental claim in John's name; the Civic's claim and rental are Margaret's\n• Don't: treat PD as just the car; keep repair photos where the demand can use them\n• Red flag: never open a rental, PD or Loss of Use claim in John Doe's name\n• He doesn't own a car; the Civic is Margaret's, and her claim gets referred to Atty. Thorne",
   "ask": "Does Property Damage touch John Doe's case, and how?"
  }
 },
 "d1m3-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Tasks, add one task for each direction, with an owner\n• A due date and how it will be checked. Give the firm any task that was wrongly assigned to John\n• Step 2: Log a follow-up task that confirms he has started treatment"
  },
  "case": {
   "say": "• Assuming John Doe's onboarding packet is delivered and logged, his directions now need to become tracked tasks in the CMS\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a tracked task set with correct owners, dates and verification"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Every task has an owner and due date; Verification method recorded for each task\n• Mis-assigned card reassigned to the firm; Reason for reassignment recorded; Treatment-start follow-up scheduled\n• The one thing to watch for: Tracking tasks without confirming they were done"
  }
 },
 "d1m3-a3": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Doc Hub, index the Police Report as evidence for John Doe's injury claim, and request the photos and the tow record\n• Step 2: Log one Case Note in CMS › Notes › Case Notes: the rental and Loss of Use stay on Margaret's claim\n• Referred to Atty. Thorne. Does PD touch our case?"
  },
  "case": {
   "say": "• Assuming the Police Report shows Margaret Doe owns the Civic and John Doe rode as a passenger\n• Keystone PD's six items need sorting on the file\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: BI evidence indexed and the one-line PD answer logged"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Police Report indexed as BI evidence; photos and tow record requested\n• Rental, Loss of Use left on Margaret's claim; Note ends with the one-line answer\n• The one thing to watch for: Handling Margaret's Loss of Use on John Doe's file"
  }
 },
 "d1m3-kc": {
  "questions": {
   "say": "• Knowledge Check for onboarding and Property Damage; answers come from John Doe's file, in own words\n• Question 1: the firm's standing instructions for a new client and the harm each prevents\n• Question 2: two Property Damage items that feed John's injury claim, two that stay on Margaret Doe's claim, and why\n• Question 3: John asks if Margaret's rental can be his; what the records show and what to coordinate"
  },
  "summary": {
   "say": "• Self-Summary: the module's principles in own words\n• One line first: does Property Damage touch John Doe's case, and how?\n• Key idea: Property Damage is evidence for his case and reaches his care, never his own claim\n• Then: what to do next time Margaret calls about her car, and the one thing least sure of"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Ratings are compared with scores; big differences get discussed\n• Key skill: sorting Property Damage items, which keeps Margaret's claim off John's file",
   "ask": "Which skill might your self-rating and score disagree on?"
  }
 },
 "d1m4-l1": {
  "theory": {
   "say": "• The Case Plan is the file's instruction manual; Atty. Thorne sets strategy from it, and a hidden risk builds it on a false picture\n• Example: John Doe's 14-day Treatment Gap belongs in the plan; opinions about him or case value do not\n• Early evaluation answers three questions: is there money, who is responsible, how will the case move\n• Coverage determination: which policies apply, their benefits, limits and exclusions; liability assessment: who caused the crash, clear, shared or disputed, on what evidence\n• Case projection: early read on risk and direction; case value always stays with the attorney\n• Strict compliance: every plan deadline goes on the calendar"
  },
  "frame": {
   "say": "• Coverage: is there money? Valid policies, coverage type, limits, exclusions, gaps\n• Liability: who is responsible and how much? Includes comparative negligence: the client sharing some blame\n• Projection: how will the case move? Draws on coverage, liability, injury, expected treatment, paperwork quality\n• Projection comes last because it depends on the other two"
  },
  "rules": {
   "say": "• Decide acceptance: Accepted, Escalated or Declined, with a reason others can follow; no file left in limbo\n• Projection stays preliminary until coverage is confirmed; liability needs the Police Report, statements, any video\n• Hold a place for the Regulatory Triple-Check, cleared in the Treatment Phase\n• File the plan within the state's window, often 30 to 60 days, and calendar it\n• Every goal gets a measure, owner, date; flag bad facts loudly; value is Atty. Thorne's"
  },
  "model": {
   "say": "• Band 1: Case Snapshot and acceptance decision\n• Band 2: coverage, liability and projection\n• Band 3: Regulatory Triple-Check, held open until the Treatment Phase\n• Band 4: Three-Pillar Plan in Clinical, Functional and Subrogation Management columns\n• Band 5: Risks and Flags, red and largest, holding the 14-Day Treatment Gap; plan routed to Atty. Elijah Thorne"
  },
  "dodont": {
   "say": "• Do: give each pillar measurable goals, e.g. return to work at Northgate Distribution with a number and date\n• Do: give every decision a reason a colleague can follow in one read\n• Don't: write a plan covering only clinical care, keep gathering information at acceptance, or let an uncertain file sit for weeks\n• Flagging a risk early makes the case defensible later\n• Red flag: a Risks band that says \"none\" for a client nobody has examined isn't clean, it's buried\n• No treatment yet means the days keep counting; every open risk gets its source and its date",
   "ask": "Why does the risks band get more room than the plan itself?"
  }
 },
 "d1m4-tplan": {
  "theory": {
   "say": "• Assessment is more than medical records: at intake on 02/09/2026 there were none, only the EMS Run Report and John himself\n• A chart-only plan misses real barriers: no ride, a new job, worry about who pays; they create Treatment Gaps, treat the person, not the chart\n• Clinical Evaluation: physical, cognitive and emotional problems, in his words and the records'; never diagnose\n• Social Determinants: life outside the clinic; lives with mother Margaret Doe, no car, her Civic damaged; the area most often skipped\n• Pre-Morbid Status: how he was before the crash; nothing on file yet\n• Vocational Outlook: warehouse shift lead at Northgate Distribution, 8-hour shifts, $22.00 an hour"
  },
  "rules": {
   "say": "• Assess the whole person from the intake call and Run Report, in Case Notes: four areas, each dated, unknowns as open questions; never your diagnosis\n• Ask living situation, transport, cost, his job's physical demands, every prior injury, claim and doctor; request those records\n• Action Plan Editor: doctor-confirmed SMART goals, each with measure, date and owner; draft goal: full 8-hour shifts at Northgate\n• Coordinate: map the four care groups, every line filled; calendar every risk and life barrier, like no ride; never prescribe\n• Red flag: a blank field, or a goal like \"reduce pain\" with nothing to measure; write \"none ordered\" or \"not yet on file\", dated"
  }
 },
 "d1m4-tmap": {
  "theory": {
   "say": "• Adjusters, IME doctors (examiners the insurer hires) and defense lawyers compare John Doe's records to a standard map of recovery\n• Care drifting off the map is the top reason insurers deny treatment and order an IME\n• Standard Treatment Map: ambulance and ER, imaging, chiropractic and therapy, orthopedics and pain management, surgery only if serious\n• A skipped or out-of-order stop needs a medical reason on file\n• Clinical Pathway: is he improving? If not, variance loop, figuring out why; next steps are the doctor's decision\n• Reasonable and Necessary: the insurer's payment test; normal care for the injury, and is he actually doing more"
  },
  "rules": {
   "say": "• John's route: urgent care 02/20/2026, Riverton Spine & Rehab from 02/24; Dr. Reyes 03/05; MRI 03/13, C5-C6 herniation; ESI 05/15; MMI 06/12\n• Every check-in, on the CMS treatment timeline: phase and week from the date of loss, week of care, improving or not\n• Not improving, or a stop skipped: name it clinical, psychosocial or systemic, never his fault; call the doctor's office; the doctor decides care\n• Get the doctor's measurements at week 6 and every 30 days after; raise concerns at the 12-week plateau\n• Red flag: no visit 04/02 to 04/21/2026, nineteen days, no reason on file: A-C-T that day, a same-day Risk Flag, facts only, to Atty. Thorne"
  }
 },
 "d1m4-tcare": {
  "map": {
   "say": "• Read records for red flags, warning signs, by specialty: physical therapy, surgery, medication, mental health\n• Listen on calls for yellow flags: life and mood problems blocking recovery, written in his words\n• Talk using OARS: open questions, affirmations, reflections, summaries\n• At the plateau, when progress and interest drop, bring him back to his own goal\n• Route it: medical danger to the doctor, legal to Atty. Thorne; then A-C-T: Assess, Clarify, Track"
  },
  "theory": {
   "say": "• A silent client is a risk; at intake John Doe had no treatment, only the 02/06/2026 EMS report: neck stiffness, declined transport\n• Once care begins, you read every record and hear from him between visits; missed flags or stalls pull him off plan, leaving Atty. Thorne factless\n• Know standard treatment patterns; a red flag is a departure signaling medical danger, a stuck case, or billing-driven over-treatment\n• Physical therapy flags show stalling or over-treatment; surgery flags concern safety and standard of care\n• Pain management and medication get the most scrutiny, due to opioid rules and necessity audits\n• Medical danger goes to the doctor same day; legal danger to Atty. Thorne"
  },
  "rules": {
   "say": "• Read each record, prescription and bill against the watch-list; flags into Risk Flags with source and date\n• Therapy: no gain after 12 sessions, passive-only care, two missed visits; surgery: skipped simpler care, left/right mix-ups, unaddressed post-surgery symptoms\n• Medication: opioid-relaxant-sedative combo, rising doses, test mismatches, as facts; medical danger: doctor's office that day, A-C-T, Atty. Thorne\n• Check-ins on OARS: yellow flags and dated mental health symptoms in his words; same-day GIRP note\n• Bridge the gap: rental ends 03/19/2026, calendared; warm handoff 02/23, LOP before 02/24; PIP first; ask what's in the way\n• Red flag: \"Missing visits will hurt your case\" is advice; talk logistics and his reasons; meaning is Atty. Thorne's"
  }
 },
 "d1m4-emc": {
  "why": {
   "say": "• PIP: the client's own insurance paying Medical Bills regardless of fault, written state by state\n• The Emergency Medical Condition (EMC) rule decides whether PIP pays $2,500 or $10,000; Florida's version can also mean no medical\n• John Doe's file is in Riverton, which uses the rule: Dr. Sarah Spine's EMC finding (02/20/2026) opened Harbor Point's full $10,000 PIP\n• The finding is the physician's; you check the record and log the bucket\n• His finding is in Riverton General's emergency department record, 02/20/2026; without it PIP stops at $2,500\n• Red flag: John's PIP logged at $10,000 with no EMC record behind it; keep Dr. Spine's finding with the PIP Log"
  },
  "rules": {
   "say": "• Riverton PIP: $10,000, 100% of medical at the fee schedule, 80% of lost income; Florida pays 80% and 60%\n• Florida only: initial care within 14 days or PIP pays no medical; calendar day 14 at intake; Riverton has no 14-day condition\n• Full $10,000 only if an MD, DO, dentist, PA or APRN finds an EMC, else $2,500; chiropractors can't; log each provider's credential\n• EMC: going without care could seriously harm health; check the first record's date, provider and written EMC, request it if missing\n• Track the bucket in the PIP Log; a missing EMC goes to Atty. Thorne that day",
   "ask": "Without Dr. Spine's EMC finding, how much of John's emergency bills would PIP have paid, and where would the rest go?"
  }
 },
 "d1m4-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Notes › Case Notes, record the exact gap in days from the date of loss\n• And set a watch for later breaks in care\n• Step 2: Log the facts only in the Action Plan's risks band, and route the flag to Atty. Thorne in the CMS"
  },
  "case": {
   "say": "• Assuming John Doe's first treatment record is in the CMS, dated 02/20/2026, the gap from the date of loss now needs flagging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a precisely computed gap flag, routed to Atty. Thorne"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Gap: 14 days, 02/06/2026 to 02/20/2026; Risks band: facts only, explanation pending; Flag routed to Atty. Thorne\n• The one thing to watch for: Writing “about two weeks” instead of exact dates"
  }
 },
 "d1m4-l2": {
  "why": {
   "say": "• A plan in draft does nothing; it works only once Atty. Thorne reviews it and the file runs on the approved version\n• Routing turns your work into approved work; comments back are normal\n• Never leave a risk off the plan to avoid comments\n• A clean version history shows what the firm knew and when\n• Red flag: \"This will help the case\" in a treatment note, or a plan run before every comment is answered\n• Every note is discoverable; facts only, and nothing runs until Atty. Thorne approves the version"
  },
  "rules": {
   "say": "• The loop: draft, routed, returned with comment, approved, execute; the file runs on the approved version only\n• Draft all five bands in the section templates, risks with source and date, each task's owner and date in their own fields\n• Route in the Action Plan Editor before anything speaks for the firm outside\n• Returned: answer every comment under Revisions and re-route; never run a half-fixed plan; record the approval and its date\n• A big fact changes: never type over the approved plan; mark it superseded under Version, route a new one\n• Red flag: 'this will help the case' in a note, or an unapproved plan run; write facts only",
   "ask": "A fact changes after approval: what is the first step?"
  }
 },
 "d1m4-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: three steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In the Action Plan Editor, record the stack in order with a preliminary projection\n• And put the Treatment Gap, counted from the records, at the top of the risks band\n• Step 2: Under the gap, list the causes to investigate as questions for John Doe\n• Step 3: Log the filing window on the CMS Calendar, then route the plan to Atty. Thorne"
  },
  "case": {
   "say": "• Assuming the set-up is in, the $40,000 stack verified and the first treatment records on file, Atty. Thorne now needs the Case Plan\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a Case Plan routed to Atty. Thorne, the filing window docketed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the three steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Order BI › Host UM › Relative UM; projection preliminary; Risks band: the gap, counted from the records, first\n• And: Causes to investigate listed as questions; Plan routed to Atty. Elijah Thorne\n• The one thing to watch for: a projection stated as a number before coverage is confirmed"
  }
 },
 "d1m4-kc": {
  "questions": {
   "say": "• Knowledge Check for Claim Set Up; answer from the file in own words under each question\n• Question 1: the Case Plan's five bands and contents, including Clinical, Functional and Subrogation Management pillars\n• Question 2: why a bad fact buried in the plan hasn't really been disclosed to Atty. Thorne\n• Question 3: John Doe's coverage as the plan states it: layers, limits, total, paying order, projection status"
  },
  "summary": {
   "say": "• Self-Summary in own words, plus one scenario\n• 03/11/2026: Keystone hasn't confirmed its limit in writing; John Doe started treatment 14 days after the crash\n• Cover: three actions for today, in order, and what goes in the risks band\n• Every bill and lien check in the Treatment Phase reads from the stack verified now"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 and submit; ratings compared with scores across Intake and Claim Set Up\n• Gate before the Treatment Phase: LORs sent and logged\n• Three-layer stack of BI, Host UM and Relative UM verified at $40,000\n• Treatment Gap flagged; Case Plan routed to Atty. Thorne",
   "ask": "Which of the four gate items are you least confident you've cleared?"
  }
 },
 "d2m1-l1": {
  "map": {
   "say": "• Draft one LOR per insurer on the firm template, each naming that insurer's own insured\n• Request limits and the Declaration Page, the policy's one-page summary, plus preservation of photos, statements, video, vehicle data\n• Protect the client: the other driver's insurer gets his name only\n• Send by each insurer's preferred method, signed by Atty. Thorne, logged by the Case Manager\n• No acknowledgement by the third business day: follow up"
  },
  "theory": {
   "say": "• On 02/17/2026 five letters leave John Doe's file: the LOR moves every carrier onto the firm; one wrong letter risks $30,000 of UM coverage\n• LOR, Letter of Representation: tells an insurer to deal with the firm; common errors: wrong insured, missed UM carrier, a notice reading like a demand\n• Claim set-up is coverage determination: which policies apply, how much they pay, what they exclude\n• Four coverage questions: is it valid, what type applies, what are the limits, any exclusions\n• Liability assessment: who is legally responsible and how much; Atty. Thorne weighs it, you secure proof\n• Third-party insurer is Robert Smith's, on the other side; first-party policies cover the client"
  },
  "rules": {
   "say": "• Send LORs early, once the retainer is signed; claims opened 02/16 to 02/17/2026, LORs sent 02/17/2026\n• Address the adjuster by name, like Attn: Dana Whitfield; Cardinal State gets Attn: Claims Department\n• Name each insurer's insured: Robert Smith for Keystone, Kevin Alvarez for Harbor Point, Margaret Doe for Cardinal State\n• Notify all three stack carriers now; notice is not a demand\n• Keystone: name only, plus Property Damage carve-out for Leah Moran, 5 business days; Atty. Thorne signs\n• Red flag: a UM notice asking for payment before any BI tender is a demand, risking $30,000; send notice only; payment waits, Atty. Thorne's call",
   "ask": "Why does Cardinal State get a letter now, before it owes anything?"
  }
 },
 "d1m1-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Insurance, enter the three layers in pursuit order, BI, Host UM, Relative UM, each marked first-party or third-party\n• Step 2: Log the $40,000 total in the Comments box and mark the projection preliminary until every limit is confirmed in writing"
  },
  "case": {
   "say": "• Assuming all three carriers reported their limits on the set-up calls and no Declaration Page has arrived, the stack now needs entering in the CMS\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a three-layer matrix totalling $40,000, ordered and marked preliminary"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Limits $10,000 / $20,000 / $10,000; total $40,000; Order recorded: BI › Host UM › Relative UM\n• BI third-party; both UM layers first-party; Projection marked preliminary until confirmed in writing\n• The one thing to watch for: Quoting a likely limit before written confirmation"
  }
 },
 "d2m1-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Doc Hub › Others, draft three letters of representation and two notices\n• Each with its Attn line, insured, claim number and date of loss, asking for limits and Declaration Pages\n• Step 2: Route the set to Atty. Thorne for signature, send each by the carrier's preferred method, and calendar a check for each acknowledgement"
  },
  "case": {
   "say": "• Assuming claims are open with Keystone (BI and PD), Harbor Point (Host UM, PIP) and Cardinal State, no adjuster assigned\n• Five letters must go out on 02/17/2026\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: five letters signed, sent and logged, follow-ups calendared"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Cardinal State: “Attn: Claims Department”; Correct insured on each; Keystone: John Doe's name only\n• And: No UM letter asks for payment; All signed and sent 02/17/2026\n• The one thing to watch for: One letter copied five times, insured left as Robert Smith"
  }
 },
 "d2m1-l2": {
  "theory": {
   "say": "• An unverified coverage fact is a guess; statuses: reported (02/16, 02/17/2026), noticed (02/17), acknowledged (03/03), disclosed, confirmed in writing (03/20); only the last is proof\n• A phone figure is not proof: both UM carriers confirmed in writing by 03/09/2026; Keystone's Dec Page arrived 03/20/2026\n• Coverage verification: turning \"someone told me\" into a document for every limit, form and exclusion\n• Coverage Stack: one row per insurer, the file's single coverage record, with status, source and date\n• Dec Page: the policy's own summary of who and what it covers, and for how much\n• Limits: per person caps one injured person, per accident caps everyone, combined single is one number"
  },
  "rules": {
   "say": "• Matrix fields: carrier, insured, claim number, adjuster, limit, status, source, date, next follow-up; no past-dated open items\n• Preliminary until a Dec Page or Coverage Letter confirms it; then enter limit, form, terms, source, date\n• Period covers 02/06/2026; Keystone BI $10,000; Harbor Point add-on confirmed 03/02/2026; the demand quotes a verified $40,000\n• Timing: 24 to 48 hours unopened claim, third business day on an LOR, follow-up within two; Atty. Thorne confirms deadlines\n• 03/03/2026: Teresa Okafor assigned at Cardinal State: update Insurance tab, Parties, letters; file the 03/14/2024 Bluewater rejection\n• Red flag: 03/11/2026, BI read confirmed off the Police Report, a lead, never a limit; mark it disclosed, request the Dec Page"
  }
 },
 "d2m1-afd": {
  "theory": {
   "say": "• A Keystone letter saying Robert Smith has no other insurance won't settle the $10,000 limit; Harbor Point and Cardinal State won't accept it either\n• It takes a word under oath from the person who knows: Smith himself, sworn 08/10/2026\n• Affidavit: written facts sworn before a notary by someone with first-hand knowledge; ends in a jurat; a false one is perjury, which makes it proof\n• Coverage: Smith swears no other insurance; John, if asked, swears he lives with Margaret and owns no car\n• Damages: records custodians swear bills and records are true copies; Northgate verifies wages\n• Court: the process server swears Smith was served, starting his answer clock"
  },
  "rules": {
   "say": "• Smith swears no other insurance, a condition of settling at the limit: request it through Keystone, docket it; sworn 08/10/2026\n• John swears residency and no owned vehicle only if a carrier asks, on Atty. Thorne's reviewed draft\n• Records requests include the custodian's affidavit, so bills enter evidence without calling each provider\n• Northgate's wage letter proves $1,584.00; file each where it's used: demand conditions, UM packages, trial binder\n• Jurat check: affiant as named, LSH-2026-MVA-770412 and claim number, dates and figures, signature, jurat and seal; defects routed with a task\n• Red flag: unsigned or un-notarized is only say-so; back it goes; never sign, notarize or reword it",
   "ask": "An affidavit arrives signed but with no notary seal. What happens, and who is told?"
  }
 },
 "d2m1-liab": {
  "why": {
   "say": "• Coverage shows there's money; liability decides whether anyone must pay it\n• None of John Doe's three coverage layers pays unless Robert Smith is legally responsible\n• Evidence is freshest now: Ruth Calloway's memory fades, Margaret's doorbell camera records over, the Escape's data recorder moves\n• Red flag: writing Ruth Calloway's statement for her to sign; it isn't her account, and the defense gets a gift\n• Keep her signed on-scene statement exactly as she gave it"
  },
  "rules": {
   "say": "• Read Police Report RPD-26-018842 field by field: Officer Garner cited Smith for failure to stop\n• Witness Ruth Calloway signed a statement on scene\n• Report lists the Escape as 2021, Harbor Point's Declaration Page says 2020: record both, correct from the policy\n• Doorbell copy secured 02/19/2026, hash (digital fingerprint) logged; the data recorder needs a preservation request Atty. Thorne signs\n• Keystone accepting PD liability on Margaret's Civic doesn't bind its BI adjuster on John's claim"
  }
 },
 "d2m1-first": {
  "why": {
   "say": "• Atty. Thorne reads between hearings with forty emails open; a story-first note gets answered last\n• Every note, email and brief opens with the decision or action needed, and its deadline\n• Then why, then the facts, then what happens after each answer\n• Red flag: subject line \"Update,\" story first, question at the very bottom; he reads to the end to find the ask, and the deadline slips\n• Decision and deadline go first"
  },
  "rules": {
   "say": "• First line, and the subject line: the decision and its deadline\n• Example: decision needed by 03/12/2026, approve declining Summit Imaging's LOP; the MRI goes to Harbor Point MedPay\n• Why: MedPay applies first, $3,675.00 left; then sourced facts, then options\n• If yes, send the decline and route the bill today; if no, draft the LOP for his signature\n• One decision per note; log the note and his answer in the CMS the same day\n• Red flag: a subject line of 'Update', the story first and the ask last; lead with the decision, deadline and both options",
   "ask": "A note holds two decisions with different deadlines. How should it be sent?"
  }
 },
 "d2m1-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Insurance, take PIP out of the stack and correct the total to $40,000, citing the document behind each fix\n• Step 2: Log a three-line audit note to Atty. Thorne in CMS › Notes › Case Notes: what is confirmed in writing\n• What is still preliminary, and what you escalated"
  },
  "case": {
   "say": "• Assuming a colleague's Coverage Stack totals $50,000 and the file holds Harbor Point's and Cardinal State's letters but no Keystone Declaration Page\n• The matrix needs correcting\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a corrected matrix totalling $40,000, its audit note routed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: PIP out of the stack: it pays bills; Stack total $50,000 corrected to $40,000; BI still preliminary until the Declaration Page\n• The one thing to watch for: Marking BI confirmed because $10,000 is expected"
  }
 },
 "d2m1-kc": {
  "questions": {
   "say": "• Learning Check: three written questions, answered from John Doe's file\n• Q1: every coverage, whose it is, what it pays; which three make the $40,000 Recovery Stack and why others stay out\n• Q2: each Policy Stack layer built in the CMS: insurer, claim number, limit, first- or third-party, order pursued\n• Q3: the five letters sent 02/17/2026, insured named and how each was addressed\n• Every \"confirmed\" needs the document behind it, not a phone statement"
  },
  "summary": {
   "say": "• Self-Summary: write the principles in your own words\n• Scenario 03/11/2026: Keystone hasn't confirmed its limit in writing; John Doe started treatment fourteen days after the crash\n• Answer: which three actions today, in what order, and what goes in the Case Plan's risks section\n• Tell insurers facts only, and only what they are entitled to"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 and submit for review\n• Self-ratings are compared with scores; a 5 beside a wrong $50,000 stack means coaching\n• The legal line is a gate: signing for the attorney or giving coverage opinions fails regardless of score\n• An honest rating helps more than a hopeful one",
   "ask": "Besides coverage, what on this file could make every insurer offer less?"
  }
 },
 "d2m1-cov": {
  "theory": {
   "say": "• No such thing as full coverage: every policy pays a different thing; ask whose it is and what it pays\n• Two separate questions: who pays the bills now, who pays the claim later\n• Payer-First Principle: each bill goes to the payer that must pay it first, or it returns as a lien on John Doe's settlement\n• Third-party coverage is the at-fault driver's, Robert Smith's; first-party is the client's side, and UM follows the person: John Doe has no car policy\n• Recovery Stack: only coverage that pays the claim: BI (bodily injury on the at-fault driver), then UM/UIM\n• MedPay and PIP pay Medical Bills regardless of fault; Riverton's PIP is add-on"
  },
  "theory2": {
   "say": "• Set-off and non-duplication: some policies subtract what PIP or MedPay paid; verify in writing\n• Subrogation: a payer's right to be repaid from the settlement\n• Contract rate and write-off: in-network providers accept the Health Plan's price, so the lien is smaller\n• Medicare Secondary Payer: Medicare pays last, is repaid by law, case reported to the BCRC\n• Bill first the payer with no right to be repaid\n• Claim numbers: Keystone KM-26-440871, Harbor Point HP-26-7741, Cardinal State CS-26-20355"
  },
  "frame": {
   "say": "• BI liability: at-fault driver's, third-party, pays the injury claim\n• UM/UIM: client's side, through vehicle or household, pays when BI is too small; consent rules apply\n• PIP: from the vehicle the client rode in, pays Medical Bills without proving fault; verify repayment terms in writing\n• Health insurance: client's plan, contract rate, right to be repaid\n• Medicare and Medicaid: last, repaid by law, BCRC report"
  },
  "rules": {
   "say": "• By whose: Keystone BI and PD are Robert Smith's; Host UM, Relative UM, PIP John's side; Peach State his Health Plan\n• The stack, in order: Keystone BI $10,000, exhausted first; Harbor Point Host UM $20,000, Kevin Alvarez's Escape, add-on; Cardinal State Relative UM $10,000, Margaret Doe's\n• Outside the $40,000: Harbor Point PIP $10,000 and MedPay $5,000 for bills; Keystone PD $25,000; Bluewater collision\n• Each claim opened: coverage, carrier, what it pays in the Insurance tab; then stack, bill order, or neither\n• Who to bill: PIP Log; PIP and MedPay (no repayment right, confirmed 03/02/2026), Peach State, then an LOP Atty. Thorne approves\n• Post each payment on its ledger"
  },
  "model": {
   "say": "• Navy, third-party: Keystone BI $10,000, Keystone PD $25,000\n• Orange, first-party: Harbor Point Host UM $20,000, Cardinal State Relative UM $10,000, Harbor Point PIP $10,000 and MedPay $5,000, Bluewater collision\n• Green: Peach State Health Plan; grey, crossed out: Bluewater UM, rejected 03/14/2024\n• Only the three claim cards form the $40,000 stack; PD's $25,000 is not in it\n• Bill order staircase: MedPay or PIP, Health Plan, Letter of Protection"
  },
  "dodont": {
   "say": "• Do: verify every coverage with a dated Declaration Page; confirm Peach State was active (began 02/01/2026)\n• Do: keep the Payer Order and the Recovery Stack separate\n• Don't: send an LOP where PIP or MedPay pays; MedPay paid Summit Imaging's $2,395.00 with nothing to repay\n• Don't: assume PIP or UM on any policy without its Declaration Page; John has no auto policy, and Margaret rejected Bluewater UM 03/14/2024\n• Red flag: a stack that adds up to $50,000 means PIP slipped in; never add PIP, PD or collision: PIP pays bills, not the claim\n• The stack is BI $10,000, Host UM $20,000 and Relative UM $10,000: $40,000, every time",
   "ask": "How does John Doe reach $30,000 of UM without an auto policy of his own?"
  }
 },
 "d2m2-l1": {
  "why": {
   "say": "• PIP: coverage on the car he rode in that pays Medical Bills regardless of fault\n• PIP's $10,000 went to the ER and EMS; MedPay paid $685.00, $640.00, $2,395.00, then $640.00 for 03/27/2026, of $5,000; $640.00 left\n• Payers in line: Harbor Point PIP, Harbor Point MedPay, Peach State Health Plan, then a Letter of Protection\n• Wrong order turns a payable bill into a lien: a debt paid from John Doe's settlement\n• Red flag: at the LOP desk, a provider wants your word they'll be paid in full at settlement; you can't give it\n• No amount, no reduction, no date: the LOP's terms are Atty. Thorne's"
  },
  "rules": {
   "say": "• Order: Harbor Point PIP, then MedPay, Peach State, then LOP; John claims PIP and MedPay as a passenger in Kevin Alvarez's 2020 Ford Escape\n• No policy in his household carries PIP; PIP pays in date order\n• Crescent's 05/15/2026 injection went to Peach State with $640.00 MedPay left; track both ledgers, never re-route a paid claim\n• Riverton got an LOP as out of network; Summit's 03/11/2026 request was declined and its MRI went to MedPay\n• LOP terms are Atty. Thorne's; never promise a provider an amount, reduction or date"
  }
 },
 "d2m2-eob": {
  "theory": {
   "say": "• EOB, Explanation of Benefits: the Health Plan's account of one processed claim, proof of who paid what; not a bill\n• Each payer reports back: Peach State by EOB, Harbor Point by its PIP and MedPay payment history; read every report before touching a lien\n• RS26, Peach State's EOB: John Doe owes Crescent $0.00 for the injection\n• Line by line, the proof behind demand and lien numbers: billed is the provider's charge, allowed the plan's contract amount, the in-network difference written off\n• Remark codes explain each line: CO-45 is the write-off, AC1 flags a possible accident\n• Member responsibility, deductible, copay, coinsurance: the most an in-network provider may bill the patient"
  },
  "theory2": {
   "say": "• Balance billing: billing the patient for the written-off part; in network it's an error, not a lien or debt\n• PIP payment history: every check, with date of service, amount paid, limit remaining\n• Exhaustion: once the limit is spent, later bills return unpaid and go to the next payer\n• Reconciliation: match every provider balance to each payer's EOB or check, so no paid bill becomes a lien\n• Red flag: a lien logged at the billed amount, or a bill sent to MedPay after 06/26/2026; log what the plan paid"
  },
  "frame": {
   "say": "• Match the claim: member ID, claim number, provider, date of service against the CMS treatment record\n• Billed to allowed: charge, allowed amount, write-off; then the patient's share\n• What the plan paid, with date and check or electronic payment number; any payback claim starts there\n• Remark codes: CO-45 explains the write-off; AC1 flags an accident and the plan's payback right\n• Reconcile against the provider's statement and lien register, flag balance billing; the step most often skipped"
  },
  "rules": {
   "say": "• Peach State EOB 06/03/2026, claim PS-2605-449021: Crescent's 05/15/2026 epidural injection, a pain shot near the spine\n• Billed $3,400.00, allowed $1,860.00, $1,540.00 written off, paid $1,860.00, member responsibility $0.00\n• Crescent's 07/01/2026 statement asks John for $1,540.00: a balance bill; document it, route to Atty. Thorne that day\n• Draft a correction request and tell John what's happening; whether he owes anything is counsel's call\n• Peach State's claim starts at $1,860.00; Harbor Point's PIP paid $10,000.00 (03/04/2026) and its five MedPay checks total $5,000.00, exhausted 06/26/2026\n• Red flag: a lien logged at the billed amount, or a bill sent to MedPay after 06/26/2026; log plan-paid $1,860.00"
  },
  "model": {
   "say": "• Left: Peach State EOB, claim PS-2605-449021, stamped THIS IS NOT A BILL\n• Rows: billed $3,400.00, allowed $1,860.00, adjustment $1,540.00, deductible $0.00, paid $1,860.00, member responsibility $0.00\n• Right: Harbor Point's two PIP checks emptying $10,000.00 on 03/04/2026, then five MedPay checks, limit falling from $5,000.00 to nothing, exhausted 06/26/2026\n• Below: Crescent's 07/01/2026 statement for $1,540.00, linked to the $0.00 row; the EOB beats the statement"
  }
 },
 "d2m2-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Liens › Outstanding Case Liens, record Riverton's LOP signed by John Doe and Atty. Thorne\n• And send it with the HIPAA authorization from the Email Workspace\n• Step 2: Log Summit Imaging's declined LOP request in CMS › Notes › Case Notes, naming Harbor Point MedPay as payer, and calendar the rental's 03/19/2026 end"
  },
  "case": {
   "say": "• Assuming Riverton Spine & Rehab is out of network for Peach State and Atty. Thorne has approved its LOP, the LOP now needs sending and logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: One counsel-approved LOP sent, one declined, both logged"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Signed by John Doe and Atty. Thorne before 02/24/2026; Decline names Harbor Point MedPay as payer\n• No payment promised to any provider; Rental end 03/19/2026 calendared\n• The one thing to watch for: an LOP to a provider PIP would have paid"
  }
 },
 "d2m2-lop": {
  "why": {
   "say": "• John Doe needs chiropractic care next week, and nothing he has will pay for it\n• Letter of Protection: a written promise the provider is paid from the settlement, so treatment happens now\n• Not free money: a balance against his recovery that he still owes, tracked from signing\n• Red flag: recommending a provider \"for the case,\" or telling John the LOP makes care free; he still owes the balance\n• Give options and logistics; Atty. Thorne explains the LOP before he signs"
  },
  "doc": {
   "say": "• LOP: the firm's signed promise that a provider's reasonable charges are paid from any recovery; not insurance\n• Legal purpose: keep care going when no payer applies; the provider defers collection, its charges protected\n• Evidence role: fixes the lien; Riverton's letter, acknowledged 02/23/2026, keeps John Doe responsible either way\n• Handling: check every payer, sign before visit one, request the ledger every 30 days; its meaning is Atty. Thorne's"
  },
  "rules": {
   "say": "• Signed before the first visit and filed; Riverton's was signed 02/23/2026\n• Request the itemized ledger every 30 days and update the Liens tab\n• John asks where to go: give options with facts, book his pick, log his choice in his words\n• Red flag: recommending a provider 'for the case', or calling the LOP free care; options only, Atty. Thorne explains the LOP"
  }
 },
 "d2m2-cost": {
  "why": {
   "say": "• After the rental ends, John Doe still has therapy three times a week, plus rides, prescriptions, maybe a brace\n• None of it is on a provider's bill, but every dollar is a cost of the crash\n• Recoverable only if written down when it happened; the Case Manager keeps the log\n• Red flag: \"You'll get every penny back\" sounds like comfort but promises a result\n• What the demand claims, and at what rate, is Atty. Thorne's; log each receipt with who paid it"
  },
  "rules": {
   "say": "• Out-of-pocket costs are Specials; each needs a receipt or log entry\n• Start the trip log at the first visit; the rate is confirmed by Atty. Thorne\n• A rental the carrier didn't pay is the owner's cost: keep the receipt, send it with the PD claim\n• When the rental ends, plan rides before a visit is missed; check payers so nothing is claimed twice\n• Enter costs the day receipts arrive, total and route before the demand; never promise repayment\n• Red flag: 'You'll get every penny back' promises a result; log each receipt with its payer, route recovery questions to Atty. Thorne"
  }
 },
 "d2m2-l2": {
  "map": {
   "say": "• Check in on visits, pain, function and barriers: anything stopping him getting to care\n• Name the variance: clinical (medical), psychosocial (life or mood), or systemic (the system stuck)\n• Assess: medical danger to the provider, legal danger to Atty. Thorne; Clarify: ask the office directly and remove the barrier\n• Track: every fix in a GIRP note, Goal, Intervention, Response, Plan; facts only\n• On his file: week-6 measures due 04/07/2026; missed visits from 04/03 classified psychosocial; No Contact Protocol 04/08 to 04/17\n• 04/20, with consent: Dr. Reyes by telephone, evening LOP slots; 04/21: GIRP note, attendance 04/21 and 04/23"
  },
  "theory": {
   "say": "• On an LOP nobody denies visits in real time; Keystone challenges the care at the demand\n• Week-6 mark, 04/07/2026, six weeks after first therapy on 02/24/2026: doctors check therapy is working; John missed it\n• Care off the Standard Treatment Map triggers denials and IMEs, exams by the insurer's doctor\n• Acute, days 1 to 14: ER, imaging, first therapy, proving the crash caused the injury; sub-acute, weeks 2 to 8: active therapy, specialists, measured gains\n• Restorative, weeks 9 to 24: injections, work hardening; then maintenance; MMI, Maximum Medical Improvement, opens pre-demand\n• You are the only real-time check: off the map, act that day, ask and record why, not \"missed visits\""
  },
  "rules": {
   "say": "• Monitor outcomes, not attendance: visits, pain, limits at work and home, barriers\n• 04/08/2026 is day 61, week 9; week 6 was 04/07/2026: request range of motion, pain score, disability index\n• Name the variance; A-C-T on every red flag; adjust the plan first, with his consent; coordinate, never direct; never say missed visits cut his claim\n• Rung by rung: clinical, administrative, legal; unfixed barrier: written notice to the causing carrier, copy Atty. Thorne\n• Mood screens: the provider's call; mental health on record: Atty. Thorne; Keystone PD: property facts only\n• Red flag: the plan runs unchanged through a crisis, or someone labels John; his distress in his words, never a diagnosis"
  }
 },
 "d2m2-pip": {
  "why": {
   "say": "• PIP is spent once: Harbor Point's $10,000 paid his ER and EMS bills in 48 hours, on Dr. Sarah Spine's EMC\n• ER $8,850.00, EMS $1,150.00, exhausted 03/04/2026; MedPay's $5,000 then paid urgent care, Lakeside and the MRI\n• Where it landed decided what was left for Peach State, the LOP and his net take-home\n• The emergency bills used the whole limit first, so the $1,267.20 wage benefit was never paid\n• Red flag: a PIP-paid bill counted as unpaid, or the injury sized up from PIP's $10,000 instead of the $41,400.00 of bills\n• Severity: the audited Specials, $41,400.00; PIP is a payment source on the tracker"
  },
  "rules": {
   "say": "• PIP does most good on fixed costs: ER, imaging, specialists; LOP providers reduce more readily\n• Here PIP paid ER and EMS; MedPay urgent care, Lakeside, the MRI; the LOP chiro and PT\n• PIP check clears: post it in the PIP Log with what's left, what's coming, the wage claim\n• Bill could go PIP or LOP: email Atty. Thorne both routes with figures, log his decision; never re-route a paid claim\n• EMC states cap PIP without a doctor's EMC finding: check the first records, never request it; if missing, Atty. Thorne that day\n• Set-off credits the defendant for PIP; Riverton is add-on: no BI or UM reduction",
   "ask": "What is recorded first when a PIP check clears, and why?"
  }
 },
 "d2m2-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log the call in CMS › Notes › Case Notes in his own words, with no diagnosis or advice\n• Step 2: In CMS › Calendar, book his 04/21 and 04/23 visits, then restore the file's status in CMS › Case Status"
  },
  "case": {
   "say": "• Assuming the No Contact Protocol has been maxed and John Doe calls back on 04/17, his re-engagement now needs logging before the letter's date\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: His words logged, visits booked, the file restored"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: His words quoted; no label, no counseling advice; Visits 04/21 and 04/23 on the calendar; Drop Warning cleared; 14-day trigger reset\n• The one thing to watch for: Telling him “that sounds like PTSD”"
  }
 },
 "d2m2-a3": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log it in the CMS: cancel the Millbrook slot on the Calendar\n• Add Crescent under Parties, and open one task for each follow-up with an owner and a due date\n• Step 2: Write a short Case Note for Atty. Thorne saying what changed and why, with no medical advice"
  },
  "case": {
   "say": "• Assuming John Doe has refused Millbrook and Crescent Pain & Spine is booked for 05/15/2026, the follow-up tasks still need logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a CMS task list: every task Done by me or Delegated, owner and date"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Crescent verified in network with Peach State, not hearsay; Crescent's 05/15/2026 slot: no new Treatment Gap; Millbrook cancelled\n• Calendar and reminders updated; Records request delegated with an owner and due date; No medical advice; no talk of claim value\n• The one thing to watch for: Telling John Doe which facility is better medically"
  }
 },
 "d1m1-l2": {
  "why": {
   "say": "• Two separate questions: who pays John Doe's Medical Bills now, and who pays the claim at the end\n• Most confusion comes from treating them as one\n• The Health Plan pays bills now, then asks to be repaid from the settlement\n• Red flag: Peach State's notice landed 02/27/2026; flag it that day, before any demand\n• Flagged late means paid twice, out of the client's money"
  },
  "rules": {
   "say": "• HIPAA: Authorization to Release Medical Information naming the crash date, allowing legal and insurance contact\n• John Doe is 34: verify his SSDI status and record the answer\n• Verify whether PIP or MedPay applies; never assume\n• Payer Order pays the bills; the Recovery Stack pays the claim\n• Flag a Health Plan's repayment right on first notice; log carrier, member ID, group number that day; never promise amounts"
  }
 },
 "d2m2-sum": {
  "theory": {
   "say": "• Three money questions at once: who pays each bill now, who wants repayment, what to flag in the CMS today\n• A lien found at disbursement or an unrecorded gap loses money; flag it the day it's known\n• Sort each coverage twice: whose it is, what it pays; only BI, Host UM and Relative UM make the $40,000 stack\n• Payer-First Principle: Harbor Point PIP, then MedPay, then Peach State, then an LOP last\n• Health subrogation: the plan claims back only what it paid for the collision's care; Peach State asserted $3,618.00 on 06/10/2026, confirmed $1,860.00 in writing 06/24/2026\n• Two CMS flags, facts only, routed to Atty. Thorne"
  },
  "rules": {
   "say": "• Only BI and UM stack, $40,000; PIP, MedPay and PD sit outside; bills go PIP, then MedPay, then Peach State, then an LOP\n• Lien flagged in CMS Liens on first notice, Peach State's letter of 02/27/2026, always before any demand draft\n• Gap flagged the day records show it: 02/06/2026 to 02/20/2026, 14 days, facts only, routed, watched\n• Neither flag is a judgment; enforceability and effect on value are Atty. Thorne's\n• Red flag: a CMS flag that says what the gap does to the claim is a legal conclusion in a discoverable record\n• Flags hold facts only: dates, counts, and \"explanation pending\""
  }
 },
 "d1m1-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Liens, register Peach State's claim with the member number, its Payer Order position and today's date\n• Step 2: Log your email asking Dion Carver for an itemized ledger, sent from the Email Workspace, and file it in the CMS"
  },
  "case": {
   "say": "• Assuming Peach State has written that claims are in process and no lien record exists yet, its reimbursement claim now needs registering\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a flagged lien record and the itemized ledger requested"
  },
  "audit": {
   "say": "• The finished set, for reference: the side exercise asks only for the two steps, not the whole audit\n• Have them check theirs for this: Position: after PIP/MedPay, before LOP"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: PSH-55017742 and GRP-41208 entered for Peach State; Position: after PIP/MedPay, before LOP; Flag dated before any demand is drafted\n• The one thing to watch for: Finding the lien at disbursement"
  }
 },
 "d2-drive": {
  "task": {
   "say": "• File the four documents in the CMS from Work From, so each copy lands in its backup folder\n• Notes, evaluations, consults go to 03 Medical Records; invoices to 04 Bills & Invoices\n• In Google Drive, move, not copy, the Summit invoice into 04 Bills & Invoices, and rename it by the naming convention on the slide\n• Open My Backup Drive and run Check my drive\n• Write the records-versus-bills rule in two sentences in Case Notes"
  },
  "case": {
   "say": "• 04/24/2026, 3:30 p.m.: John is back in care; two months of treatment paper filed in the CMS\n• Urgent Care first-visit note, Spine and Rehab evaluation with the LOP, Lakeside consult, Summit Imaging MRI invoice\n• A colleague's backup put the Summit invoice in 03 Medical Records\n• July's pre-demand audit totals bills from the bills folder, so the $2,395.00 would be missed"
  },
  "check": {
   "say": "• Urgent Care note, evaluation and Lakeside consult in 03 Medical Records\n• Summit invoice in 04 Bills & Invoices, once only\n• Dashboard backed-up count matches what was filed; Check my drive shows nothing missing\n• Records say what was done to John; bills say what it cost; kept apart, the Specials add up",
   "ask": "A bill turns up in the records folder the week before the demand. What else gets checked?"
  }
 },
 "d2m2-kc": {
  "questions": {
   "say": "• Knowledge Check: written answers from the file, in own words\n• Read Peach State's 06/03/2026 EOB, claim PS-2605-449021, line by line; say where each amount goes\n• Handle Crescent's 07/01/2026 statement asking John Doe for $1,540.00\n• Explain from the Payer Order why Riverton got an LOP 02/23/2026 and Summit's 03/11/2026 request was declined\n• Pressure round: an office manager wants a promise; promise nothing new, cite the 02/23/2026 LOP, involve Atty. Thorne"
  },
  "summary": {
   "say": "• Self-Summary scenario 04/08/2026: two missed visits at Riverton, John answers no one, Dana Whitfield wants a Recorded Statement\n• Write the first, second and third steps and what each protects\n• 2021 visits: document low back versus neck, resolved, no prior neck complaints; that's proof, \"don't matter\" is arguing\n• Medication red flags: provider hears the safety issue, Atty. Thorne the legal one; document the conversation"
  },
  "scale": {
   "say": "• Skill Scale: rate each competency 1 to 5, honestly, and submit\n• Self-ratings are compared with scores; a wide gap means a conversation\n• The legal-advice line is a gate: one payment promise to a provider outweighs a strong score\n• Next: what the other side thinks the 19 days mean, and whether the notes hold up",
   "ask": "Which note on this file should an adjuster read first?"
  }
 },
 "d2m3-l1": {
  "theory": {
   "say": "• The only gap explanation that holds up is John Doe's own, in his words, backed by documents\n• Compare \"Was it because you had no car?\" with \"What, if anything, made it hard to get seen sooner?\"\n• The job: draw it out, write it down exactly, never explain, defend or judge it; plan questions, never expected answers\n• Open on the record: date, who is on, role, his consent to record, privacy\n• Ask open, follow his words, ask for the paper, read it back, open a dated task per document\n• Coordinate, don't commingle: medical and legal tracks stay separate in notes; facts, never conclusions: the defense can use an opinion"
  },
  "rules": {
   "say": "• Investigate, don't advocate: read the EMS report, 02/20/2026 urgent-care history and timeline; questions-only plan in Case Notes first\n• Privilege needs privacy, not an audience; record only with his spoken consent\n• Funnel: open questions, his words, yes-or-no last to pin a date or document\n• Red flag: \"Was it because you had no car?\" Leading buys a yes, not information; never offer rides, co-pays or work schedules\n• Confirm the 03/05/2026 Dr. Reyes consult and rides past 03/19/2026; GIRP note to Atty. Thorne that day; Keystone's Recorded Statement request: to the firm\n• Asked what the gap does to his case: no opinion, \"it won't matter\" is legal advice; log and route it today"
  }
 },
 "d2m3-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Take the recorded call below: state the date and his consent, ask open questions only, and read his account back to him\n• Step 2: Log a privileged GIRP note in CMS › Notes › Case Notes the same day, with a dated task for each corroborating document"
  },
  "case": {
   "say": "• Assuming John Doe has agreed to a recorded call about why he waited 14 days, his four reasons now need capturing in his own words\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: All four reasons in his words, the GIRP note filed"
  },
  "model": {
   "say": "• See It: the finished work, for reference only; this side exercise asks for the logged entry\n• Point to it on the model: Zero leading questions; no reason introduced first"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Zero leading questions; no reason introduced first; Four reasons in his words: transport, soreness, coverage, numbness\n• GIRP note filed 03/04/2026, labelled privileged; Corroboration requested with a dated task\n• The one thing to watch for: Rescuing a hesitant client with a suggested reason"
  }
 },
 "d2m3-l2": {
  "theory": {
   "say": "• The adjuster argues the gap proves John Doe healed; a Treatment Gap is any break, read as minor, healed or unrelated\n• Records made at the time by EMS, doctors and employers carry the weight, because nobody wrote them for the claim\n• Examples: the 02/07/2026 Riverton Drug receipt for pain relief, notes placing pain at the collision, the EMS report, work records, later a causation opinion\n• A record made to order destroys the case; the record proves continuity, not anyone's explanation of it\n• Continuity of care: an unbroken path of treatment, each step following the last; adjusters test it\n• Consistent histories: the same how, when and where across every chart"
  },
  "theory2": {
   "say": "• Causation opinion: a treating doctor linking injury to collision, the bridge across a gap; Atty. Thorne requests it\n• Record integrity: changed only by the author's dated addendum; altering a record can be tampering or fraud\n• Excuse notes prove only what the author saw or ordered; unexamined days need other proof\n• Generic notes not tied to the collision weaken causation; flag them to Atty. Thorne, never fix them"
  },
  "frame": {
   "say": "• Therapy past 12 sessions with no gain and no specialist or imaging reads as stalled or over-treatment\n• Passive care only, heat, TENS (electrical pulses), massage with no exercise: adjusters discount it\n• Two or more missed appointments: the defense says the injury wasn't serious; the most common flag\n• Surgery before therapy or injections outside an emergency; opioid, muscle relaxant and sedative together with rising doses\n• Records with left and right switched, or life stress instead of the crash"
  },
  "rules": {
   "say": "• Read every history for how (the collision), when (02/06/2026), where (neck and right arm; 2021 was low back)\n• Therapy notes and Dr. Reyes disagree: flag to Atty. Thorne that day\n• 02/09 to 02/13: Northgate's Attendance Record; EMS \"declined transport\" recorded exactly; keep the receipt and Margaret texts\n• Atty. Thorne requests a causation opinion; the Case Manager assembles and tracks, never drafts\n• Red flag: never ask a provider to change, back-date or add to a record, and never order an excuse note\n• A record wrong at its source gets its author's dated addendum, like Summit's on 07/15/2026, and the original stays put"
  },
  "model": {
   "say": "• Compare board: made at the time versus made to order\n• Left, green: 02/06 EMS report, 02/07 receipt, 02/09 to 02/13 call-outs, 02/20 urgent care note, 06/19 Causation Letter\n• Right, red: what never happens, every item struck through\n• Timeline 02/06 to 06/19: proof laid down while the gap was happening; timing makes it believable"
  }
 },
 "d2m3-cause": {
  "theory": {
   "say": "• Smith's failure-to-stop citation and witness Ruth Calloway prove negligence (duty and breach), only half the case\n• Other half: causation and damages; this crash caused his C5-C6 herniation, a disc bulging between neck bones\n• Keystone has two other causes ready: the 14-day gap and his 2021 chiropractic visits\n• The Causation Letter, 06/19/2026, from treating spine surgeon Dr. Alana Reyes (authors are treating doctors or independent experts): demand, rebuttal and binders lean on it\n• Reasonable medical probability: more likely than not; \"possibly\" falls short; Atty. Thorne confirms the exact standard\n• Prior injury in the same region raises aggravation, an old problem made worse; his 2021 care was low back"
  },
  "doc": {
   "say": "• Causation Letter: a medical professional's formal opinion linking the accident to the specific injuries\n• Legal purpose: prove the defendant's conduct caused the harm, the expenses and ongoing limitations\n• Dr. Reyes: more likely than not; ties the herniation to 02/06/2026; answers the gap and the 2021 visits\n• Atty. Thorne requests it; the Case Manager assembles records, dockets follow-up, checks it on arrival, files and cites it\n• Handle the letter's path, never its words; read it the same day"
  },
  "rules": {
   "say": "• In order: Atty. Thorne requests it, with John Doe's written authorization; calendar the follow-up\n• Send everything: EMS report, urgent-care note, Riverton notes, MRI, Crescent's procedure note, 2021 Birch Avenue records\n• Arrival 06/19/2026: check date of loss 02/06/2026, right C5-C6, visits 03/05, 03/27, 06/12, records listed; log the match or quote the mismatch to Atty. Thorne\n• File under Medical; cite it on the Gap Explanation Record, the audit's risks, the 07/20/2026 Demand Package, the 08/06 rebuttal\n• Never draft, edit or ask her to strengthen it; withholding the 2021 records exposes her at deposition\n• Red flag: \"possibly\" or \"could be\" is short of more likely than not; flag it to Atty. Thorne",
   "ask": "What happens if the letter lists the wrong date of loss?"
  },
  "model": {
   "say": "• Table: her four opinions, the defense each answers, the records behind each\n• Delay clinically consistent, answering \"he waited two weeks\": EMS report and 02/20 urgent-care note\n• Herniation more likely than not from the collision, answering \"degenerative\" (age wear): MRI shows no significant adjacent degeneration\n• 2021 care unrelated, answering pre-existing; treatment reasonable and necessary, future injections in the 06/12 MMI note\n• Pull one record and its opinion weakens"
  }
 },
 "d2m3-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Treatment › Other Treatment Notes\n• Enter the 14-day gap and the 19-day disruption with exact dates, each reason beside its dated document\n• Step 2: Log it as routed to Atty. Thorne, and file the non-economic damages records in the CMS"
  },
  "case": {
   "say": "• Assuming Dr. Reyes's 06/19/2026 Causation Letter and her 04/20 note are in, Atty. Thorne needs the Gap Explanation Record before the pre-demand session\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a routed record of both interruptions, every reason sourced"
  },
  "model": {
   "say": "• See It: the finished work, for reference only; this side exercise asks for the logged entry\n• Point to it on the model: 14 days, 02/06/2026 to 02/20/2026; 19 days, 04/02 to 04/21/2026"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: 14 days, 02/06/2026 to 02/20/2026; 19 days, 04/02 to 04/21/2026\n• Continuity: EMS report, call-outs, 06/19/2026 Causation Letter; Nothing argues or values the claim\n• The one thing to watch for: Documenting the 14-day gap and forgetting the 19-day disruption"
  }
 },
 "d2m3-kc": {
  "questions": {
   "say": "• Learning Check: written answers from the file, in own words\n• Name the four reasons for the 14-day gap, each with its document and date\n• Rewrite \"Was it because you had no car?\" to surface the reason without suggesting it; explain what leading costs\n• Robert Smith's citation proves fault: what else must the file prove, with which document, and the Case Manager's part\n• \"See attached\" is not an answer"
  },
  "summary": {
   "say": "• Self-Summary scenario 04/08/2026: two missed visits, John answers no one, Dana Whitfield wants a Recorded Statement\n• Write the first, second and third steps and what each protects\n• A provider's offer to add a line to a chart is more dangerous than a missing note\n• A missing note is a weakness; an altered one is a credibility collapse, possibly fraud"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 and submit for review\n• Ratings are compared with scores; big gaps get talked through\n• UPL is a gate: a coached answer or a requested record change fails regardless of score\n• Can't yet rewrite the leading question cleanly? Rate it that way; it means another simulator round",
   "ask": "Which skill from today needs another run in the simulator?"
  }
 },
 "d2m4-l1": {
  "theory": {
   "say": "• $10,000 BI less fee and costs is $6,179.92, against $7,965.00 of liens: on BI alone he nets $0.00\n• Lien: a bill paid from the settlement before his share; BI: the at-fault driver's bodily injury coverage\n• What the demand can claim is decided in this pre-demand audit, the final stress test; one duplicate gives Keystone an out\n• Trinity of case alignment: story, physical evidence and medical records agree; MMI: as good as he'll get, bills complete, the audit begins\n• Specials: provable dollar loss, Medical Bills plus lost wages plus Property Damage; every line needs a document\n• Three audit passes: dates for gaps, codes for duplicates, prior history for old injuries"
  },
  "theory2": {
   "say": "• Subrogation: a payer's right to repayment from the recovery; Health Plans, government payers, LOP providers; each lien shrinks his net\n• Property Damage deep dive: impact photos, estimate versus final bill, supplements; the car proves the force\n• Defense-eye audit: read the file as the adjuster will, social media, minor-impact label, venue (where it'd be tried)\n• Policy-limits targets: verified limits in opening order; what a policy can pay isn't what the claim is worth\n• This file: chronology, both gaps reasoned, 14 and 19 days; coding, one line per date; prior history, three resolved 2021 low-back visits, no neck complaint"
  },
  "frame": {
   "say": "• Master Audit Checklist: tick it from the file, never from memory\n• Money: Specials documented line by line; lost wages need the employer's wage letter plus a doctor's work note\n• Lien resolution: every payer wanting repayment\n• Liability: final Police Report, witness drift, crash physics; Property Damage point of impact and supplements\n• Medical and billing: every gap explained, no duplicate codes, five to ten years of history"
  },
  "rules": {
   "say": "• MMI is Lakeside Orthopedics' call: its 06/12/2026 note and future care go on the timeline; open the audit task; SOL 02/06/2028 calendared\n• Specials ledger until every billed date matches a visit: Riverton's 34 lines against 33 visits; medical $41,400.00\n• Red flag: Riverton's 05/04/2026 line has no visit note; claiming it inflates the Specials: remove it, $6,105.00, and send the correction in writing\n• The Civic is Keystone PD's; BI Specials are medical plus wages: 9 Northgate shifts, 8 hours, $22.00, $1,584.00; flag five with no note\n• Future injections stay out; PIP paid $10,000.00, MedPay $5,000.00; register every lien, billed beside paid"
  },
  "model": {
   "say": "• Gate first: MMI 06/12/2026, ticked; nothing enters the ledger before it\n• Riverton Spine & Rehab: $6,290.00 struck, $6,105.00 instead; a $185.00 duplicate on 05/04/2026\n• $41,400.00 medicals plus $1,584.00 wages, $42,984.00; future medical sits outside the total\n• Targets in order: $10,000 BI, $20,000 Host UM, $10,000 Relative UM, each with its source\n• UM covers when at-fault insurance falls short: Host UM on the car he rode in, Relative UM via a relative\n• Before the ask, re-verify each sourced limit on the Coverage Stack, $40,000 total; billed versus paid to Atty. Thorne; never value it",
   "ask": "Why re-verify the limits now, when the Coverage Stack was confirmed weeks ago?"
  }
 },
 "d2m4-wage": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Treatment › Total Medical Specials, correct the draft worksheet from $1,760.00 to the verified $1,584.00\n• Step 2: Log it by filing Northgate's letters in CMS › Doc Hub\n• Flag the 02/09–02/13 shifts to Atty. Thorne, and send no medical records to the employer"
  },
  "case": {
   "say": "• Assuming Northgate HR has sent the employer's verification and every missed shift matches a provider's note, the wage loss now needs entering\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: $1,584.00 verified in the Specials, Northgate's letters filed"
  },
  "audit": {
   "say": "• The finished set, for reference: the side exercise asks only for the two steps, not the whole audit\n• Have them check theirs for this: Northgate's verification filed in the CMS"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Draft corrected: $1,760.00 › $1,584.00; Northgate's verification filed in the CMS\n• No medical records sent to the employer; 02/09–02/13 shifts flagged to Atty. Thorne\n• The one thing to watch for: Dropping shifts with no doctor's note"
  }
 },
 "d2m4-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Treatment › Total Medical Specials, remove the duplicate and total the medical at $41,400.00 plus the wages, showing billed beside paid\n• Step 2: Log the liens in CMS › Liens and flag the billed-versus-paid choice to Atty. Thorne"
  },
  "case": {
   "say": "• Assuming Riverton Spine & Rehab's 05/04/2026 duplicate line is confirmed and Northgate verified $1,584.00 in wages, the Specials now need totalling\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: an audited ledger at $42,984.00, liens listed, choice routed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: 05/04/2026 duplicate removed: $6,290.00 › $6,105.00; Specials $42,984.00: medical plus wages; Billed-vs-paid choice routed to Atty. Thorne\n• The one thing to watch for: Totaling the statement instead of auditing it"
  }
 },
 "d2m4-l2": {
  "theory": {
   "say": "• Atty. Thorne makes the strategy calls from the brief, before any demand draft, so its shape matters: it carries audit findings, not conclusions\n• Weak opening: the story of 02/06/2026; strong: MMI, $42,984.00 audited Specials against $10,000 BI, decisions needed\n• Story first buries the decision; hiding a risk misleads; making the call for him crosses the line\n• It reports on the four core audit objectives and flags statement drift: a witness whose story changes between tellings\n• Names value killers: social media, a minor-impact label, venue\n• Always carries lien totals; bad math or a missed lien means a short-funded settlement, little or nothing for the client"
  },
  "rules": {
   "say": "• Audit done: one-page memo and exhibit index in the Action Plan Editor, emailed before the session\n• Bottom line first: MMI 06/12/2026, $42,984.00 Specials against $10,000 BI; then the trinity: narrative, physicality, medicals\n• Facts: RPD-26-018842, Smith cited, Ruth Calloway checked for drift, doorbell video; door struck at 28 mph; Civic $6,940.00 to $9,255.00, $2,315.00 A-pillar supplement\n• Each risk with its answering document, 2021 low-back visits included; decisions as questions: figure, terms, time limit, billed versus paid, UM consents\n• Options with consequences; each decision read back, recorded in his words, tasked; Case Plan superseded and re-routed that day\n• Red flag: \"What's it worth?\" Value is Atty. Thorne's; answer with Specials, limits, liens"
  }
 },
 "d2m4-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log each decision in CMS › Notes › Case Notes, attributed to Atty. Thorne, with the date it was made\n• Step 2: In CMS › Tasks, open a task with an owner for each decision, and propose no demand figure"
  },
  "case": {
   "say": "• Assuming Atty. Thorne has decided on a time-limited BI demand, served 07/20/2026, his strategy decisions now need recording on the file\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a dated decision record, attributed to Atty. Thorne, tasked"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Decision recorded: time-limited BI demand, 07/20/2026; UM plan: no UM demand before the BI tender; No demand figure proposed\n• The one thing to watch for: Apologizing for the gap instead of explaining it"
  }
 },
 "d2m4-kc": {
  "questions": {
   "say": "• Gate bar: this module turns two chips green, Specials audited at $42,984.00 and strategy approved by Atty. Thorne\n• The demand waits until all six chips are green\n• Total the Specials from the bills: Riverton corrected to $6,105.00, medical total, wage math, final figure\n• Who decides MMI, when John Doe's was, why the demand waits, where the $3,400 to $6,800 future medical goes\n• Name the four audit objectives, with one finding each on this file"
  },
  "summary": {
   "say": "• Scenario 04/08/2026: two missed visits; Keystone ended Margaret's rental 03/19; carpool ended 04/01; Dana Whitfield wants a Recorded Statement\n• Write the first, second and third steps and what each protects\n• An exhibit error found the day before 07/20/2026 service: stop the package, fix every total citing it, tell Atty. Thorne\n• A late right answer beats an on-time wrong one"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 and submit for review\n• Self-ratings sit beside scores; big gaps get talked through\n• Billed versus paid: picking a column for the demand loses the UPL marks\n• The demand's number is Atty. Thorne's decision; know where on the file it's recorded",
   "ask": "Which pre-demand skill feels most solid now, and how would you prove it?"
  }
 },
 "d3m1-l1": {
  "theory": {
   "say": "• John Doe's Specials total $42,984.00; Robert Smith carries only $10,000 with Keystone; goal: its full limit within 30 days\n• Time-Limited Demand: a letter asking for the full policy limit, with set days to accept; miss a part, Keystone refuses at no risk\n• Five stops: confirm the foundation, demand within limits on clear terms, reasonable window, complete package, serve and docket\n• Foundation: deadline to sue, fault, coverage, each from its own document; Atty. Thorne decides every term\n• A demand presents a debt owed and forces a decision on the record; its first pages set the tone\n• Final Scrub: last line-by-line clean-up; Why Factor: each bill shows why treatment was needed"
  },
  "frame": {
   "say": "• MMI, Maximum Medical Improvement: the doctor says the client has healed as much as he will\n• 30-Day Rule: send the demand within 30 days of MMI; John's MMI 06/12/2026, target 07/12/2026\n• Served 07/20/2026; a later date is Atty. Thorne's decision, with his reason recorded\n• Photo impact: lead with the most graphic Property Damage or injury image\n• Why Factor: every bill carries why the treatment was necessary"
  },
  "doc": {
   "say": "• Affidavit of No Other Insurance: Robert Smith's sworn, notarized statement that Keystone is his only liability coverage\n• No umbrella, business or employer's policy; Atty. Thorne makes it a condition of the demand\n• Smith swore it 08/10/2026; Keystone sent it with its tender, its offer to pay the full limit\n• Both UM carriers reviewed it before consenting\n• Case Manager: record it in the approved terms, check it is notarized and matches the file, cite it in each UM demand"
  },
  "rules": {
   "say": "• Statute of limitations, the deadline to sue, docketed for 02/06/2028\n• Liability: Smith's citation, Ruth Calloway, the doorbell video; coverage: Keystone's $10,000 Dec Page, the policy's limits summary\n• Terms: release Smith and Keystone for the BI claim only, plus Smith's affidavit; 30 days from Dana Whitfield's written acknowledgement\n• Gap answered on page one; causation leads with the 03/13/2026 MRI\n• Case Manager builds, audits, serves, proves delivery; terms, extensions, value and bad faith are Atty. Thorne's"
  },
  "model": {
   "say": "• John Doe's demand with its five elements pinned on as badges\n• Within limits: $10,000; clear: release and affidavit terms; reasonable: conditions and 30 days\n• Documented: list of everything enclosed; timed: deadline and delivery lines\n• Clock bar: emailed 07/20/2026, receipt confirmed in writing 07/22/2026, window closes 08/21/2026\n• Red warning: an unclear term is an escape hatch for Keystone"
  },
  "dodont": {
   "say": "• Do: docket from the adjuster's written acknowledgement, never the send date\n• Do: lead with the MRI herniation, a disc pushed out of place, and the injection\n• The window is for Keystone to accept, not to pay\n• Don't: omit the deadline or clock trigger, leave the gap out, or demand before MMI or a future-care plan\n• Bad faith is Atty. Thorne's conclusion, never the Case Manager's label\n• Red flag: “Thirty days from the date of this letter” is wrong; the window closes 08/21/2026, from Keystone's written acknowledgement. Fix it; tell Atty. Thorne.",
   "ask": "What makes a gap explanation hold up with an adjuster, and who supplies it?"
  }
 },
 "d3m1-a1": {
  "task": {
   "say": "• First the Specials audit: PIP and MedPay bill by bill, billed beside paid, wages once verified; then the Gap Record from filed notes\n• Audit the draft against the Big Four and Final Scrub in the Action Plan Editor\n• Log each deficiency as an assigned CMS task; don't fix it quietly\n• Assemble with the gap on page one; once signed, email Dana Whitfield from the Email Workspace and log it\n• Docket the deadline from her written acknowledgement dated 07/22/2026, with reminders\n• Live call: confirm receipt and 08/21/2026, no extension, log her requests in her exact words"
  },
  "case": {
   "say": "• Monday 07/20/2026: Atty. Thorne wants the Keystone BI demand audited and sent today\n• Dana Whitfield, Keystone Mutual, claim KM-26-440871\n• Approved terms: $10,000 limits, Limited Release of Smith and Keystone only, Smith's affidavit, 30 days from receipt\n• On file: MMI 06/12/2026, Dr. Reyes's Causation Letter, the Gap Explanation Record; Specials $42,984.00\n• The demand specialist's draft has problems; audit it and log every deficiency as a task"
  },
  "grade": {
   "say": "• Five tests: within limits, clear, reasonable, documented, timed\n• Terms exactly as Atty. Thorne approved them; the gap answered on page one\n• Package: $10,000 cover letter, liability proof, itemized bills with reasons, gap proof, Northgate's wage letter, narrative\n• Build it from the case documents in the training Drive, then upload the served set to the CMS\n• An A leaves the adjuster no loose thread to pull"
  },
  "audit": {
   "say": "• The enclosure set as the demand specialist built it: keep, replace, pull, add, or flag each item for Atty. Thorne\n• Exhibit E: Riverton Spine & Rehab at $6,290.00, with 05/04 billed twice\n• Crescent's statement bills John $1,540.00 an in-network provider, one that accepted the insurer's prices, can't charge him\n• Two documents the letter relies on are missing\n• After submitting, compare your calls with the package Atty. Thorne signed and served 07/20"
  },
  "check": {
   "say": "• $10,000, Keystone's BI limit per its 03/20/2026 Dec Page; terms match Atty. Thorne's approval word for word\n• Big Four complete: Specials $42,984.00, Riverton Drug receipts counted once\n• 05/04/2026 duplicate removed: Riverton Spine & Rehab $6,290.00 down to $6,105.00\n• Gap on page one; 2021 low-back visits disclosed as resolved, no neck history\n• Each deficiency a dated, assigned task; emailed 07/20; 08/21/2026 docketed from Dana's 07/22 acknowledgement",
   "ask": "Why is docketing from the 07/20 send date wrong?"
  }
 },
 "d3m1-l2": {
  "theory": {
   "say": "• Keystone's $10,000 minus fee and costs leaves $6,179.92; liens total $7,965.00 unreduced: BI alone nets John nothing\n• Gross is a headline, net is what John lives on: what's left after fees and unreduced liens\n• UM: his own coverage, the safety net once the at-fault policy is used up, up to its limits\n• BI exhaustion: the at-fault carrier paid its full limit; that opens the UM claim\n• Technicalities can lose UM: an early release, a premature demand, a missing consent; before releasing Smith, the UM carrier consents and waives subrogation, or substitutes\n• Front-load the proof: at-fault Dec Page, signed release and consents up front"
  },
  "doc": {
   "say": "• UM Consent to Settle: the UM carrier's written answer to the 30-Day Letter\n• Consents to the BI settlement, waives subrogation, its right to chase Smith for what it pays, and won't substitute its own check\n• Trap: release Smith without it and John Doe can lose the UM coverage\n• Harbor Point consented 08/24/2026, Cardinal State 08/26/2026; release of Smith and Keystone only, UM claims open\n• Prepare both for Atty. Thorne's signature, docket, file; John signs nothing until both are in"
  },
  "rules": {
   "say": "• Keystone's documented 08/12/2026 tender of its $10,000 opens Host UM; proof it's all there is: Dec Page, Smith's 08/10/2026 affidavit\n• 08/13: 30-Day Letters to both UM carriers, Atty. Thorne signing, with tender, Dec Page, affidavit; windows docketed\n• 08/14: Keystone's draft release against approved terms; \"all other insurers\" escalates to Atty. Thorne; John signs nothing\n• Limited Release signed 08/28, after consents of 08/24 and 08/26: Smith, Keystone, BI only\n• 08/31: UM demands, each showing damages above the layers before it; Cardinal State's add-on in writing, like Harbor Point's 03/02/2026\n• Red flag: a UM demand before the documented tender, or a release without both consents, can lose UM; stop, tell Atty. Thorne"
  }
 },
 "d3m1-pkg": {
  "theory": {
   "say": "• 08/05/2026: Keystone offered $3,500 against $42,984.00 in Specials, citing the 14-day gap and a “degenerative” MRI, wear and tear from age\n• A missing part is a discount: a Demand Package is proof sorted by what each piece proves\n• Big Four: Medical Specials, Narrative, Liability Proof, Special Damages; flawless before Atty. Thorne reviews\n• Human Story: how the injury changed his work and daily life, from his words and the records\n• 300 pages of raw charts get a lowball; a two-page summary and a strict clock make refusal risky\n• Built for the BI demand served 07/20/2026, rebuilt by function for the 08/31/2026 UM demands: coverage, exhaustion, liability, special and general damages, release"
  },
  "doc": {
   "say": "• Time-Limited Demand: the firm's offer to settle John Doe's BI claim for Keystone's $10,000 per-person limit, open for a fixed time\n• Makes Keystone decide on the record; Atty. Thorne sets every term: payment, Limited Release of Smith and Keystone, Smith's affidavit\n• Emailed to Dana Whitfield 07/20/2026: 81 pages, Exhibits A through J\n• 30 days run from her written acknowledgement of receipt, 07/22/2026; window closes 08/21/2026\n• No certified mail; the sent email and her reply are the proof; log, docket 08/21/2026, change no term"
  },
  "rules": {
   "say": "• Medical Specials from line-item bills, reconciled to the audit: $41,400.00, 05/04/2026 duplicate gone, every line with its why\n• Two-page treatment summary in front; Human Story: five Northgate shifts missed, right-hand numbness from 02/18, paresthesia at MMI\n• Liability: Police Report, Ruth Calloway, doorbell clip, Property Damage photos; Special Damages: Northgate's $1,584.00 letter; $42,984.00 total\n• Final Scrub: no overlaps, 2021 low-back visits disclosed, every balance confirmed by phone\n• For UM, rebuild by function with exhaustion proof, not proof of uninsured status\n• Red flag: Exhibit A cites RPD-26-018824, transposed, one of ten faults in the draft. Run the final scrub; fix all ten before Atty. Thorne signs."
  }
 },
 "d3m1-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In the Action Plan Editor's UM demand templates\n• Put the exhaustion proof on page one of each draft, and claim only damages above what was collected\n• Step 2: Log both drafts in CMS › Tasks › + Add Task for Atty. Thorne, with the response deadline left blank"
  },
  "case": {
   "say": "• Assuming Keystone's $10,000 tender, both consents and the signed Limited Release are on file, the desk's two UM demand drafts need a quick QC\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Two QC'd UM drafts, exhaustion proof first, routed"
  },
  "grade": {
   "say": "• The Grade-A standard, for this side exercise: Two packages, HP-26-7741 and CS-26-20355\n• And Exhaustion on page one of each\n• Only the logged entry is graded, under the assumption on the slide"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Two packages, HP-26-7741 and CS-26-20355; Exhaustion on page one of each; Response deadline left blank; nothing served\n• The one thing to watch for: Re-sending the BI demand with new addressees"
  }
 },
 "d3-drive": {
  "task": {
   "say": "• Open My Backup Drive; compare the backed-up count with the CMS; back up any gap from Work From\n• Corrected documents: current version in its folder; old version beside it, renamed SUPERSEDED with the replacing version's date; nothing deleted\n• MRI addendum in Medical Records, Crescent's statement in Bills, final wage record in Wages and Costs\n• Draft demand and exhibit packet in Insurance, Demands and Negotiation, labeled DRAFT\n• Run Check my drive; record the audit in Case Notes; work down the CMS list one document at a time"
  },
  "case": {
   "say": "• 07/17/2026, 3:00 p.m.: pre-demand audit closed Wednesday; the Keystone demand goes out Monday\n• Three documents corrected in two weeks: MRI addendum fixing the history, Crescent's corrected statement to zero, final wage record\n• The specialist's draft demand and exhibit packet are on file for audit\n• Test: if the CMS went down Monday, could every page of the demand come from the backup?"
  },
  "check": {
   "say": "• X of Y count: both numbers the same\n• Three current versions in Medical Records, Bills, Wages and Costs; every old version kept, labeled SUPERSEDED with a date\n• Draft demand and packet in Insurance, Demands and Negotiation, marked DRAFT; Check my drive clean\n• Case Note: the count, what was replaced and labeled, readable by Atty. Thorne in ten seconds",
   "ask": "If Keystone says it never saw the corrected Crescent statement, where do we prove which version was current?"
  }
 },
 "d3m1-kc": {
  "questions": {
   "say": "• Learning Check: answer from John Doe's file, in your own words, under each question\n• The BI demand's terms, how it was served, the date its window closed, and how that was counted\n• The five elements with this file's example of each, and who decides bad faith\n• Answer Keystone's degenerative and gap arguments with documents, and where each goes in the package\n• Pressure questions: explain the process, not the law, with the file's own dates and figures"
  },
  "summary": {
   "say": "• Self-Summary: the principles that make a demand hold, in your own words, not the clicks\n• Strategy: both UM drafts on Atty. Thorne's desk 08/31/2026; your next action and why\n• Name the one thing you're least confident about\n• Scenario: Keystone's 08/14/2026 release frees all other insurers, Harbor Point hasn't answered, Atty. Thorne out until Monday\n• Under pressure: hold, flag, escalate"
  },
  "scale": {
   "say": "• Skill Scale: rate each competency 1 to 5, from docketing a Time-Limited Demand to holding the UPL line, then submit\n• UPL, the unauthorized practice of law: giving legal advice without being a lawyer\n• Ratings are compared with scores; a 5 on a block scored 60 gets discussed\n• UPL is a gate: a strong score doesn't survive an ethics breach",
   "ask": "Where is the widest gap between your self-rating and your score?"
  }
 },
 "d3m2-l1": {
  "theory": {
   "say": "• Keystone won't argue the crash: Smith was cited and the doorbell camera caught him\n• It will argue the 14-Day Gap, call the MRI degenerative, stall toward 08/21/2026; expect Dana Whitfield's “Why did he wait two weeks?”\n• Anticipate: map both attacks, your top two weak spots, and their answering documents before the first call; documents, never adjectives\n• The demand letter is the opening move; adjusters protect the carrier by valuing claims low\n• A template demand gets template treatment, a tailored one a real evaluation; value drivers, the few facts that would scare a jury, lead every call\n• Professional pause: after a low number, stay quiet so she justifies it with data"
  },
  "rules": {
   "say": "• Net floor: liens $7,965.00 plus costs $486.75 is $8,451.75; grossed up for the one-third fee, $12,677.63\n• Gross up: the settlement size that leaves that amount after the fee; above Keystone's $10,000 limit\n• Drivers: Smith on video, an independent witness, C5-C6 herniation and injection, right-arm paresthesia (numbness, tingling) at MMI\n• Anchor on $42,984.00 Specials, never PIP's $10,000; restate the demand and 08/21/2026, pause, ask for her data\n• Log Keystone's $3,500 counteroffer word for word; never counter or move the number or deadline\n• Red flag: Whitfield presses for a number. Accept, reject, counter or value can change the demand's terms. Log her exact words; tell Atty. Thorne today."
  }
 },
 "d3m2-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log her exact words in CMS › Notes › Case Notes, and report the offer to Atty. Thorne the same day\n• Step 2: In the Email Workspace, draft the 08/06/2026 rebuttal for his approval, answering the gap from the record"
  },
  "case": {
   "say": "• Assuming Dana Whitfield has offered $3,500 citing the gap and a degenerative MRI, and Atty. Thorne's authority is no counter, the offer needs logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a logged offer, a same-day report, a drafted rebuttal"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: $3,500 nets John Doe $0.00; Offer logged in her exact words; No counter; 08/21/2026 deadline unchanged\n• The one thing to watch for: Answering “degenerative” with an opinion, not the radiologist's sentence"
  }
 },
 "d3m2-bins": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In the LSH Net Sheet, enter the $10,000.00 gross, the 33⅓% fee\n• The receipted costs and both liens, with the 25% projection labelled as a projection\n• Step 2: Log it to Atty. Thorne in CMS › Tasks › + Add Task, flagging that the money stays in trust"
  },
  "case": {
   "say": "• Assuming Keystone tendered the $10,000 BI limits today and the liens are still unreduced, Atty. Thorne needs Stream 1's Net Sheet\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a Stream 1 Net Sheet, the projection labelled, routed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Fee $3,333.33, not $3,333.00; Projection labelled: Stream 1 net $4,553.73; Trust-hold flag routed to Atty. Thorne\n• The one thing to watch for: Quoting John Doe a BI figure before Atty. Thorne"
  }
 },
 "d3m2-umw": {
  "theory": {
   "say": "• Subrogation: when Harbor Point or Cardinal State pays John, it steps into his shoes to recover from the at-fault driver, Robert Smith\n• If John releases Smith first, that right is gone and the policy may let the carrier refuse to pay\n• $30,000 of the $40,000 stack rides on two letters\n• Consent to settle: the UM carrier's written permission for John to settle with and release Smith\n• Each carrier chooses: waive subrogation, or pay the $10,000 itself to keep its claim; both waived here\n• Keystone won't pay and John won't sign until both consent in writing; Whitfield's 08/14 cover letter holds the check pending both waivers and executed release",
   "ask": "What would have happened to the timeline if Harbor Point had substituted its own check?"
  },
  "doc": {
   "say": "• Waiver of Subrogation: a separate instrument from the consent letter, on the carrier's own form, signed and notarized\n• Waives recovery from Robert Smith and Keystone only; UM claim stays open; no substitute check\n• Notarized, so it can be filed or offered as an exhibit without testimony\n• Harbor Point signed 08/24, Cardinal State 08/26/2026\n• Check carrier, policy, claim, scope and notary block; what it means for John is Atty. Thorne's to explain"
  },
  "rules": {
   "say": "• Tender 08/12/2026; 30-Day Letter 08/13, Atty. Thorne signing, with tender letter and Smith's affidavit; docket windows\n• Ask Harbor Point and Cardinal State only; record why Bluewater isn't asked\n• 08/14: Keystone's cover letter conditions payment on both consents, waivers and the W-9; log it; the signing task waits\n• Consents 08/24 and 08/26: match each scope to the release: Smith and Keystone only, subrogation waived, no substitution; wider: Atty. Thorne\n• Notarized waivers front each UM package and the transmittal packet; John signs 08/28, once Atty. Thorne approves and reviews it\n• Red flag: a consent request to Bluewater Auto: Margaret rejected UM in writing 03/14/2024; request, docket, chase, match; never explain it",
   "ask": "Why does the signing task wait on those two letters?"
  }
 },
 "d3m2-rel": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Doc Hub › Case Files, replace the catch-all insurers clause, reserve the UM claims, and flag the rest for Atty. Thorne\n• Step 2: Log your review by email to Atty. Thorne for approval, and send nothing to John Doe"
  },
  "case": {
   "say": "• Assuming Keystone's Release of All Claims has arrived for John Doe's signature, its clauses need checking against the approved terms\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: an audited release sent for Atty. Thorne's approval"
  },
  "audit": {
   "say": "• The finished set, for reference: the side exercise asks only for the two steps, not the whole audit\n• Have them check theirs for this: Property Damage cut; UM claims reserved"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Catch-all “all other … insurers” replaced; Property Damage cut; UM claims reserved; Nothing sent to John Doe\n• The one thing to watch for: Agreeing release wording with the adjuster"
  }
 },
 "d3m2-exec": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In the Email Workspace, send Dana Whitfield the executed release with both waivers and the W-9, asking for the check date\n• Step 2: Log the check into trust in CMS › Settlement (BI/UM) › Check Received / Disbursed, and route any payee question to Atty. Thorne"
  },
  "case": {
   "say": "• Assuming John Doe signed the Limited Release before the notary on 08/28/2026 and both UM waivers are in, the packet needs sending\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: an executed release sent and the check in trust"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Packet sent 08/28 with both waivers and W-9; Payee question routed; no lien assurance; Check 0048213 into IOLTA 09/04/2026\n• The one thing to watch for: Explaining what a paragraph means to John Doe"
  }
 },
 "d3m2-l2": {
  "theory": {
   "say": "• Harbor Point's 03/02/2026 letter is add-on: it pays on top of Keystone; a reduction policy would deduct the $10,000\n• After the tender, two first-party carriers insure John yet argue against him; reach $40,000 by proving the gap above each layer, reductions closed in writing\n• A UM settlement is won on paper: fault, and damages above what's collected; a clear summary on a clock raises the risk\n• Sort documents by coverage, liability, damages; diagnostics and a causation narrative answer “he had this before”\n• Bracketing: paired ranges closing toward the middle; every move is Atty. Thorne's\n• PIP: no-fault states pay it first and limit suits; at-fault states, BI pays; John's is add-on"
  },
  "rules": {
   "say": "• UM pays the gap: Atty. Thorne's damages figure, less BI, to its limit; Cardinal State needs above $30,000\n• 09/14/2026: log Harbor Point's offer; counter 09/16: its 03/02/2026 letter, MRI, Causation Letter, MMI residuals, future care\n• Red flag: \"BI already compensated him\": wrong on add-on UM; answer with that letter and medical proof; log it\n• Bracketing is Atty. Thorne's; never accept, reject, counter; add-on PIP: no lien, no UM cut\n• Limits offer: confirm coverage, release scope, liens, payee, check date; report that day; accept only on John's logged decision and approval\n• To net: scoped release; check to John and LSH Law Group; trust same day, 10/05, 10/13/2026; Payoff Letters; ledger ties"
  }
 },
 "d3m2-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log each acceptance in CMS › Settlement (BI/UM) › Offer & Counter History, with a confirming email drafted for Atty. Thorne's approval\n• Step 2: Show $40,000.00 gross on the Net Sheet's Recovery Ledger, each check deposited only after its release is signed"
  },
  "case": {
   "say": "• Assuming John Doe has accepted through Atty. Thorne and both UM layers settled at their limits, the recovery now needs logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a complete Negotiation Log and $40,000.00 gross recorded"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Each confirming email: coverage, release, liens, payee; Recovery Ledger $40,000.00 gross\n• PIP and Keystone PD excluded from the gross; Each UM release signed before its check\n• The one thing to watch for: Adding PIP or property-damage payments to the gross"
  }
 },
 "d3m2-umns": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: On the Net Sheet's Recovery Ledger, post the $30,000.00 UM gross to Stream 2\n• Apply the 33⅓% fee, costs and liens, and mark the net as a projection\n• Step 2: Log it to Atty. Thorne in CMS › Tasks › + Add Task"
  },
  "case": {
   "say": "• Assuming Cardinal State has tendered its $10,000 limits and Harbor Point's $20,000 is in trust, Stream 2's Net Sheet is due\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a Stream 2 Net Sheet projecting $13,661.19, routed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Fee: $30,000.00 ÷ 3 = $10,000.00; Projected net $13,661.19, labelled projection; Streams tie: $18,214.92 in total\n• The one thing to watch for: Charging all costs and liens to the UM stream"
  }
 },
 "d3m2-kc": {
  "questions": {
   "say": "• Learning Check on negotiation: answer from John Doe's file, in your own words\n• Q1: math check on Keystone's $3,500: fee, costs, unreduced liens, net $0.00; what it shows Atty. Thorne, who tells John\n• Q2: answer Dana Whitfield's gap and degenerative arguments with four documents and the radiologist's words\n• Q3: PIP's $10,000, exhausted in 48 hours and non-subrogated (no right to repayment): effect on valuation, and the no-fault contrast\n• “No set-off here” is not the same as “no reduction anywhere”"
  },
  "summary": {
   "say": "• Self-Summary: the principles of negotiating John Doe's file, not the clicks\n• Strategy: a carrier offer lands today; your next action and why it isn't a counter\n• Name the one thing you're least confident about\n• Pressure question: the offer dies at 5:00 p.m. and Atty. Thorne is unreachable; talk it through, then write\n• Escalate the deadline in writing; never decide it yourself"
  },
  "scale": {
   "say": "• Skill Scale: rate six competencies 1 to 5, from the battle map and net floor to holding the authority line\n• Self-ratings are compared with scores; big gaps mean coaching, not a penalty\n• UPL is a gate: a strong score can't rescue an ethics breach; submit for review\n• Liens still sit at $7,965.00 unreduced; negotiating them comes next",
   "ask": "Which of the six competencies would you most want to practice again?"
  }
 },
 "d3m3-l1": {
  "theory": {
   "say": "• Lien: a bill with a legal right to payment from the settlement before the client's share\n• John Doe's $40,000: two liens asserted, five checked and found absent, each sourced; not his until all are found, sorted, resolved in writing\n• Legal basis decides how far a lien bends: sort one wrong and you overpay or freeze the payout\n• Top: providers on an LOP, a Letter of Protection promising payment from the settlement; very negotiable\n• Next: health insurance subrogation; made whole means repaid only once the client is fully compensated, common fund that the lienholder shares recovery costs\n• Lower: Medicare and Medicaid, strict formulas; bottom: ERISA self-funded employer plans, hardest to reduce"
  },
  "frame": {
   "say": "• Providers on an LOP sit high: they often reduce to get paid now\n• Private health insurance sits moderate, subject to made whole or common fund\n• Medicare and Medicaid sit low; ERISA self-funded plans very low, under federal law\n• Riverton Spine & Rehab is the LOP provider, top of the ladder; Peach State is fully insured, not ERISA\n• Fully insured: the employer bought a policy, so state law generally governs reduction; Atty. Thorne confirms\n• Triple-check each lien: timeliness, Peach State's 02/27/2026 notice; perfection, Riverton has an LOP only, no recorded or served notice; scope, strike lines outside the collision"
  },
  "rules": {
   "say": "• Gross reaches $40,000.00 on 10/06/2026: final inventory in the Lien Tracker; re-verify the Day 2 register; each claim statutory or contractual\n• Statutory liens (Medicare, Medicaid, hospital, workers' comp) come from law and bend least; contractual claims rest on an agreement\n• Every claimant, absent ones too: \"none\" with where and when you checked; prior attorney: \"none known to John Doe\"\n• Two asserted: Peach State and Riverton; PIP has no reimbursement right; Crescent can't balance-bill; Health Plan: plan documents, funding status escalated, fully insured on file\n• Draft the request naming the doctrine, $1,860.00 minus $620.00 is $1,240.00, held for approval; name doctrines, never choose; never compromise or call a lien invalid"
  },
  "model": {
   "say": "• Every claim on the $40,000, on a ladder from provider LOP down to ERISA self-funded\n• Two solid bars: Riverton Spine & Rehab $6,290.00 and Peach State $1,860.00\n• Hollow bars with green checks: none, verified\n• Outlined prior-attorney bar tagged quantum meruit, a lawyer's claim for work already done\n• Doctrine cards: common fund, made whole, comparative fault greyed out; unclassified means overpaid or frozen"
  },
  "dodont": {
   "say": "• Do: record a verified “none” like a lien, with source and date\n• Do: name the doctrine and show the math in every Reduction Request; resolve every lien in writing before disbursement\n• Don't: treat an ERISA plan, a federally governed job-based plan, like a provider LOP\n• Don't: ask for a “courtesy discount” with no legal basis\n• Kevin Alvarez's carpool and workers' comp is Atty. Thorne's coverage question; record no claim filed, no lien asserted\n• Red flag: an unclassified lien gets paid at the wrong number. Classify every claimant first.",
   "ask": "John Doe knows of no other lawyer; why does quantum meruit still get a line?"
  }
 },
 "d3m3-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Settlement (BI/UM) › Medical Liens / Payoffs, show the math, $1,860.00 – $620.00 = $1,240.00, and record each absent claimant as a verified none\n• Step 2: Log the 10/09/2026 acceptance only once Peach State confirms it in writing"
  },
  "case": {
   "say": "• Assuming Peach State asserts $1,860.00 and Atty. Thorne has signed off on the one-third reduction, the lien needs recording\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: $1,240.00 recorded once confirmed in writing"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Lien is what the plan paid: $1,860.00; Math shown: $1,860.00 – $620.00 = $1,240.00; Acceptance logged only with written confirmation\n• The one thing to watch for: Arguing a doctrine Atty. Thorne hasn't chosen"
  }
 },
 "d3m3-l2": {
  "theory": {
   "say": "• On Keystone's $10,000 BI alone, John Doe nets $0.00; every dollar a lien gives up lands in his net\n• Half the job is collecting from carriers, half keeping money from lienholders; providers move on an honest audit and checkable math\n• Road: audit each bill line by line; an error earns a correction, not a favor; then the pro-rata math\n• Ask with Atty. Thorne's written request and target; pay only on a full-and-final Payoff Letter; update the ledger that day\n• Upcoding: billing a bigger visit than records show; unbundling: one service split into several bills\n• Pro rata: each lien shares in proportion to its size; common fund: lienholders share recovery costs"
  },
  "frame": {
   "say": "• Step 1: cross-reference records against the bill; a Level 3 visit billed as Level 5 gets corrected, not discounted\n• Step 2: hunt for duplicate charges, especially overlapping dates across hospitals and doctor groups\n• Step 3: common fund, the lienholder reducing by its share of fees and costs; Atty. Thorne's argument\n• Step 4: never pay without a signed Payoff Letter stating full and final satisfaction\n• Start at step 1: every error found is money not negotiated for"
  },
  "rules": {
   "say": "• Audit before asking: corrections first, reductions second\n• Final Ledger in: audit each line against the visit records: Riverton's 34 lines at $185.00, $6,290.00, against 33 visits; 05/04/2026 duplicate out: $6,105.00\n• Each code matched to that day's note; no lines 04/02 to 04/21/2026; errors corrected in writing first\n• BI alone: $6,179.92 pro rata, Peach State $1,443.15, Riverton $4,736.77, John nets nothing; Track A covers both: $7,965.00 audited, $5,820.00 paid\n• Reduction Request with math the lienholder can check, on Atty. Thorne's written target, logged first; true facts only; common fund is his\n• Agreed: signed Payoff Letter, or no payment; update Lien Tracker and Net Sheet, recompute the net that day",
   "ask": "Riverton billed $6,290.00; what number do you negotiate from, and why?"
  },
  "model": {
   "say": "• Pro-rata picture on BI alone: $6,179.92 left after fee and costs\n• Split 23.35% to Peach State, $1,443.15, and 76.65% to Riverton Spine & Rehab, $4,736.77\n• $7,965.00 of liens overhang in red hatching; John Doe nets $0.00\n• Order of work: audit, correct, calculate, ask with authority, confirm in writing, update the Net Sheet\n• Red flag: asking for a percentage off an inflated bill. Starting from $6,290.00 hands back the $185.00 the audit removes. Corrections first, reductions second."
  }
 },
 "d3m3-l3": {
  "why": {
   "say": "• Riverton Spine & Rehab agreed to take less; the finish line is the signed Payoff Letter, not the agreement\n• Won on paper first: show the audited balance, recovery, fee and costs, and the other liens\n• The lienholder needs a letter it can sign that closes the bill for good\n• Skip the paper and money is left on the table or the bill reopens\n• Red flag: a phone yes isn't a reduction until it's in a signed Payoff Letter. Take it to Atty. Thorne; confirm in writing."
  },
  "doc": {
   "say": "• Payoff Letter: the lienholder's signed agreed payoff in full satisfaction\n• No balance billing (billing the client for the rest), no collections, lien released\n• Puts the phone reduction in writing so the account closes at $0.00\n• Riverton Spine & Rehab, 10/12/2026: $6,105.00 audited, $4,580.00 accepted if paid within 30 days\n• No Payoff Letter, no payment; check figures, docket the 30-day condition, update Lien Tracker and Net Sheet same day"
  },
  "rules": {
   "say": "• Negotiate from audited balances: Riverton $6,105.00, Peach State $1,860.00, $7,965.00 in all\n• Written Reduction Request first, with Atty. Thorne's written authority on file\n• On the call, make only his ask; log name, date, every figure; counters outside authority go to him same day\n• A useful note names the person, such as Tammy Greer, billing manager, the figure, date and routing time\n• No Payoff Letter, no payment: full and final, no balance billing or collections; update both tabs that day"
  }
 },
 "d3m3-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Settlement (BI/UM) › Medical Liens / Payoffs, enter $4,580.00 with the signed Payoff Letter as its source\n• Step 2: Log the call and the letter in CMS › Doc Hub, and recompute the Net Sheet"
  },
  "case": {
   "say": "• Assuming Riverton's ledger is corrected to $6,105.00 and its billing manager agreed to $4,580.00 in a signed Payoff Letter, the Net Sheet needs updating\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a signed $4,580.00 Payoff Letter logged, the Net Sheet recomputed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Correction first: $6,290.00 – $185.00 = $6,105.00; Signed Payoff Letter: full and final; Net Sheet recomputed: net $20,359.92\n• The one thing to watch for: Agreeing on the phone because it sounds good"
  }
 },
 "d3m3-kc": {
  "questions": {
   "say": "• Lien Reduction Verification: answer from the file, in your own words\n• Q1: classify Peach State, Riverton Spine & Rehab, PIP, Medicare, Medicaid, prior attorney; rank liens by how far they bend\n• Q2: why Peach State being a fully insured group plan matters, and who decides what follows\n• Concluding “state law applies, so argue made whole” makes Atty. Thorne's decision for him\n• Q3: the math from $1,860.00 to $1,240.00, the doctrine, and its link to beating the 14-Day Gap with the MRI"
  },
  "summary": {
   "say": "• Self-Summary: the principles of lien reduction, in your own words, not the clicks\n• Strategy: both liens resolved; next action before the 10/22/2026 disbursement, and why\n• Name the one thing you're least confident about and what would fix it\n• Scenario: Keystone's 08/14/2026 release, Harbor Point's consent still out, Atty. Thorne away\n• Under pressure: stop, document, escalate"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5, from classifying liens to holding the authority line, then submit\n• Ratings compared with scores; a 5 scored 60, or a 2 aced, gets discussed\n• UPL, practicing law without a license, is a gate; no score survives an ethics breach\n• Coming up: a $1,540.00 balance, the gap between Crescent's bill and Peach State's payment",
   "ask": "Which lien skill felt strongest, and does your score agree?"
  }
 },
 "d3m4-l1": {
  "theory": {
   "say": "• BI stream alone: $6,179.92 against $7,965.00 in liens, John Doe takes home nothing; he actually nets $20,359.92\n• Net Sheet: one page, every dollar in and out: $40,000 from three carriers in two streams, out as five checks\n• A dollar that can't be traced on the sheet doesn't leave trust\n• Stream 1, third-party BI: the at-fault driver's insurer; usually exhausted to its limit first as a legal step\n• Stream 2, first-party UM: the client's or a resident relative's policy; opens once BI is used up or the driver is uninsured\n• Double-dipping: the same dollar counted twice; trace each dollar's source so liens are paid right; the total shows both streams"
  },
  "frame": {
   "say": "• Stream 1, third-party BI: Keystone, $10,000, used up first\n• Stream 2, first-party UM or UIM: host vehicle or resident relative; opens after BI is exhausted\n• On this file: Harbor Point $20,000 plus Cardinal State $10,000\n• Three carriers feed two columns; keep them separate from the first entry to the last"
  },
  "rules": {
   "say": "• One Net Sheet, two tabs: Recovery Ledger for money in and deductions, Lien Tracker proving each lien; must tie out\n• Streams apart: BI $10,000.00, UM $30,000.00; PIP's $10,000.00 and MedPay's $5,000.00 are payment sources on the Lien Tracker, never recovery\n• Fee per stream at 33⅓% pre-suit: $3,333.33 plus $10,000.00 is $13,333.33\n• Costs $486.75 with receipts, split 25% and 75%: $121.69 and $365.06; reduce liens globally, allocate pro rata\n• Net both ways: $5,089.98 plus $15,269.94 is $20,359.92; flag future ESIs (injections) of $3,400 to $6,800"
  },
  "model": {
   "say": "• Recovery Ledger in front: columns for total, Stream 1 BI, Stream 2 UM\n• Rows: gross, 33⅓% fee, costs, Peach State, Riverton Spine & Rehab\n• Orange net row: $20,359.92, which is $5,089.98 plus $15,269.94\n• Lines from each lien row to the Lien Tracker tab: proved by Payoff Letter\n• Corner reminder: BI alone meant $0.00 to John Doe"
  }
 },
 "d3m4-a1": {
  "task": {
   "say": "• Post each check by stream on the Recovery Ledger with the 33⅓% fee\n• Split the costs and liens 25% and 75% between the streams, the UM share as the remainder\n• Log each lien's figures and payoff status in the Lien Tracker\n• Tie both tabs to the BI/UM Master Financial Ledger and the Trust Ledger; route it to Atty. Thorne before John Doe signs\n• Stage 3, the disbursement gate: each condition proved by its document, then one approval-ready line per Net Sheet line"
  },
  "case": {
   "say": "• 10/13/2026: $40,000.00 is received in two streams, the $10,000 BI and the $30,000 UM stack\n• Peach State accepted $1,240.00; Riverton Spine & Rehab accepted $4,580.00; case costs are $486.75\n• The final Net Sheet must tie to the Trust Ledger before John Doe signs it\n• Atty. Thorne approves it; future ESIs are flagged to him"
  },
  "check": {
   "say": "• Pre-suit fee: $13,333.33\n• Costs: $486.75, charged once\n• Net: $5,089.98 + $15,269.94 = $20,359.92, both ways\n• Future ESIs flagged to Atty. Thorne\n• Never mark a lien final from an email or a phone call",
   "ask": "Why is the UM share of each split worked out as the remainder?"
  }
 },
 "d3m4-l2": {
  "theory": {
   "say": "• Keystone's 08/14 draft released “all other persons, firms, corporations and insurers”: unread, both UM carriers, $30,000\n• A release gives up the right to sue for payment; settled means signed, every check cleared, every lien paid off in writing, ledger $0.00\n• Road to zero: audit the release; both UM consents written before the BI release; show John how $40,000.00 becomes his net\n• Each check to IOLTA, the client trust account, once its release is signed; disburse on Payoff Letters and Atty. Thorne's signature\n• Closing documents: Release of All Claims; Settlement Disclosure Statement, gross to net\n• Satisfaction of Lien, the provider's signed paid letter; Dismissal With Prejudice if suit was filed"
  },
  "doc": {
   "say": "• Limited Release: John Doe ends his BI claim, releasing Robert Smith and Keystone only, for the $10,000\n• Preserves the UM claims against Harbor Point and Cardinal State\n• Signed 08/28/2026, it is exhaustion proof in each UM demand\n• Keystone's 08/14 draft released all other insurers, $30,000 of UM coverage\n• Audit every line, quote overbroad words in a redline memo to Atty. Thorne, hold signature until both consents arrive"
  },
  "rules": {
   "say": "• Read each release line by line before John sees it: parties, claims, indemnity, Medicare, confidentiality; redline each bad line\n• A BI release can't reach the Civic's Property Damage claim, nor Harbor Point's Cardinal State; UM consents first; pay off every lien\n• On settlement: payee's W-9 that day, returned with the signed release; Settlement Statement: $40,000.00 to $20,359.92\n• Each check, 09/04, 10/05, 10/13: release signed, IOLTA that day, clearance logged; all cleared 10/20/2026\n• Four gates: verification; documentation: Payoff Letters, W-9s, receipts; authorization: Atty. Thorne signs; reconciliation: ledger $0.00, 10/22/2026\n• Red flag: disbursing on uncleared funds or an open lien notice; hold: disputed shares stay in trust until Atty. Thorne clears them"
  }
 },
 "d3m4-close": {
  "theory": {
   "say": "• The Trust Ledger hit $0.00 on 10/22/2026: $40,000.00 in, five checks out; zero is where closing starts, not ends\n• The file must show where every dollar went, who signed, why each figure moved, matching the Net Sheet\n• Before a case is marked Archived, check four sets: money trail, proof of delivery, compliance and identity, closing memo\n• Closing memo, most often skipped: one page on how the file started and ended, every gap and exception explained\n• Retention policy, how long the file is kept: every document tagged by type, destroy-by date calendared\n• A late bill after the closing letter is checked, classified, routed, and John Doe called, the same day",
   "ask": "A statement for Crescent's $1,540.00 lands after the closing letter. What's the first document you pull?"
  },
  "rules": {
   "say": "• Nothing archived until all four sets are in; test: could an outside auditor trace every dollar from the file\n• Money trail, 10/22/2026: three deposits, five checks, confirmation numbers, zero-balance report\n• Zero counts only when bank statement, trust journal and client ledger agree, every check cleared; a second reviewer each disbursement\n• Satisfactions and John's receipt filed with his payer disclosure (PIP $10,000.00, MedPay $5,000.00, Peach State $1,860.00, John $312.40) and current W-9\n• Closing memo, 10/30/2026, explains every figure that moved; Atty. Thorne signs the closing letter; dispose after 7 years\n• Red flag: \"We've changed our wiring instructions.\" Stop payment; verify by phone to a number on file, not the email's",
   "ask": "Riverton Spine & Rehab's $6,290.00 became $4,580.00. What does the closing memo say about that?"
  }
 },
 "d3m4-pal": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log the notice in CMS › Notes › Case Notes, routed to Atty. Thorne, and send nothing to Vance & Kettering\n• Step 2: In CMS › Settlement (BI/UM) › Check Received / Disbursed, hold $6,666.67 on his instruction"
  },
  "case": {
   "say": "• Assuming Vance & Kettering's charging lien notice for $6,666.67 has arrived and Atty. Thorne has ordered a hold, the file needs securing\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: the notice logged and $6,666.67 held"
  },
  "audit": {
   "say": "• The finished set, for reference: the side exercise asks only for the two steps, not the whole audit\n• Have them check theirs for this: $6,666.67 held on Atty. Thorne's instruction"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Logged and routed 10/14; nothing sent to the firm; $6,666.67 held on Atty. Thorne's instruction; Validity left to Atty. Thorne\n• The one thing to watch for: Replying to the claiming lawyer yourself"
  }
 },
 "d3m4-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Settlement (BI/UM) › Check Received / Disbursed, queue one disbursement per Net Sheet line for Atty. Thorne's approval, taking the ledger to $0.00\n• Step 2: Log your requests for the lien satisfactions and John Doe's receipt in CMS › Doc Hub"
  },
  "case": {
   "say": "• Assuming every condition is met, the funds cleared and the lien hold released by Atty. Thorne, the 10/22 disbursement needs queuing\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Five commands to $0.00, queued for approval"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Five commands match the Net Sheet exactly; None released by the CM; Lien satisfactions requested in writing\n• The one thing to watch for: Queuing a command before the funds clear"
  }
 },
 "d4-drive": {
  "task": {
   "say": "• In own Google Drive, delete Liens and Reimbursement from John's folder, on purpose\n• Open My Backup Drive, run Check my drive, read what's missing and why it matters\n• Use Put the missing folders back; re-run the check until nothing is missing\n• File in the CMS from Work From: Peach State's acceptance, Riverton's Payoff Letter, three prior-attorney lien documents to Liens and Reimbursement\n• Cost ledger and closing letter to Wages and Costs; Case Note on what was missing and restored"
  },
  "case": {
   "say": "• 10/23/2026, 2:00 p.m.: Track A's money went out yesterday; the closing letter goes to John today\n• Lien file finished: Peach State accepted $1,240.00 in writing; Riverton Spine & Rehab sent its Payoff Letter\n• Vance and Kettering's charging lien came in, was repudiated and withdrawn\n• This week a colleague tidying shared folders deleted a lien folder from a case backup; nobody noticed"
  },
  "check": {
   "say": "• First check named Liens and Reimbursement missing; folder put back; second check clean\n• All five lien documents in Liens and Reimbursement\n• Cost ledger and closing letter in Wages and Costs; backed-up count matches what was filed\n• Case Note: what was lost, how it was found, what was restored\n• A lien is closed only when its written answer is on the file and the backup",
   "ask": "A colleague recreates a deleted folder by hand, one letter off. What will Check my drive say?"
  }
 },
 "d3m4-kc": {
  "questions": {
   "say": "• Final Accounting Check: answer from the file, in your own words\n• Q1: John Doe's $40,000.00 to $20,359.92 stream by stream, with fee, costs, liens and the 25%/75% split, without notes\n• Q2: the four document sets needed before archiving, this file's item for each, and the retention period\n• Q3: after the 10/22/2026 disbursement the Trust Ledger reads $0.00; which records prove it, what a leftover would mean\n• Every dollar in has a dollar out and a document proving it"
  },
  "summary": {
   "say": "• Self-Summary: the principles behind the Net Sheet, the release audit and the Trust Ledger\n• Next action between the $0.00 ledger on 10/22/2026 and the 10/30/2026 closing memo, and why\n• A $1,540.00 balance appears: the gap between $3,400.00 billed and $1,860.00 paid on Crescent's injection\n• Lien missed, or a bill nobody owes? Read Peach State's EOB first\n• A deadline is never a reason to sign a release reaching $30,000 of UM coverage"
  },
  "scale": {
   "say": "• Skill Scale: rate each competency 1 to 5, from a dual-stream Net Sheet tied to trust to the UPL line\n• Ratings set beside scores; any wide gap gets talked through\n• UPL is a gate; a strong score doesn't survive an ethics breach; submit for review\n• Track A, the settled version of John Doe's case, is complete; settled means paper signed and ledger at zero\n• Next: the case that doesn't settle, if Keystone had refused its limit",
   "ask": "Which competency grew most for you across Track A?"
  }
 },
 "d4m1-l1": {
  "why": {
   "say": "• Track B: same file, same 08/05/2026 offer of $3,500, but this time Keystone doesn't move\n• Track A is where the case settles; Track B is where the insurer won't budge and suit is filed\n• Keystone rests on the 14-Day Gap; BI must be used up before John Doe's UM coverage opens\n• So one $10,000 carrier freezes the whole $40,000 stack; every date matters\n• Red flag: impasse is five dated triggers, never frustration; call it an impasse only when all five are logged with dates"
  },
  "rules": {
   "say": "• Keystone holds at $3,500, calls it \"final\" on 08/12, lets the demand lapse 08/21\n• Work the dispute path first: evidence, new findings, the 09/02 supervisor escalation; by 09/04/2026 all five triggers are met\n• Never bid against yourself: never lower the number because the carrier went quiet\n• Filing is Atty. Thorne's decision; inputs are yours: RPD-26-018842, Ruth Calloway, doorbell video, MRI, $42,984.00 Specials\n• Calendar SOL 02/06/2028, cutoff 11/05/2027; never recommend suit, value the claim or advise John on $3,500"
  }
 },
 "d4m1-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Doc Hub › Case Files, log a dated chronology from the 07/20/2026 demand, each event tied to its proof\n• Step 2: End the memo with the decision you need, as questions, and route it in CMS › Tasks › + Add Task"
  },
  "case": {
   "say": "• Assuming Keystone called $3,500 “final” and the demand lapsed 08/21 with no answer since, the impasse needs logging for Atty. Thorne\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a sourced memo that asks for a decision, recommends none"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Events 07/20 to 09/04, each tied to proof; SOL 02/06/2028, cutoff 11/05/2027; Questions only; no sentence recommends suit\n• The one thing to watch for: Waiting another follow-up cycle instead of escalating"
  }
 },
 "d4m1-l2": {
  "why": {
   "say": "• Keystone never said no; it went silent, and that dated, logged silence proved the impasse\n• On 09/10/2026, before filing, the case-number field reads \"Pending\"; anything else is a guess\n• Once suit is authorized, a court clock replaces the adjuster's: status, fields, folders, calendar change together\n• Red flag: pre-litigation habits in a court file cost deadlines; update status, court fields, folders and calendar in one sitting, citing Atty. Thorne's 09/09/2026 authorization"
  },
  "rules": {
   "say": "• Status changes to Litigation only on Atty. Thorne's dated authorization, and cites it\n• Fee: 33⅓% before suit, 40% once suit is filed; court fields only from the record, number \"Pending\" until filing\n• Name every PDF to the convention, never scan001.pdf\n• Calendar SOL 02/06/2028, hard date 02/04/2028, cutoff 11/05/2027, 48-hour audits; notify UM carriers in writing, no number\n• Keep the doorbell video unaltered; preservation requests go out on Atty. Thorne's signature"
  }
 },
 "d4m1-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Case Status, set the status to Litigation, citing the 09/09 authorization, with the case number reading “Pending — assigned on filing”\n• Step 2: Log the 40% fee tier from the filing date, and the 48-hour audit on 09/22/2026 in CMS › Calendar"
  },
  "case": {
   "say": "• Assuming Atty. Thorne authorized suit on 09/09 with a filing target of 09/24/2026, the file needs switching to Litigation\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Litigation status set on Atty. Thorne's authority"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Status cites the 09/09/2026 authorization; Case number reads “Pending — assigned on filing”; Filing target 09/24/2026, 48-hour audit 09/22/2026\n• The one thing to watch for: Recording the 40% tier from the status date"
  }
 },
 "d4m1-efile": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log it in the CMS: record 26-CV-04417 in the Discovery & Filing Tracker\n• File the stamped Complaint and summons, and add the $218.00 fee to costs\n• Step 2: On the CMS Calendar, enter the service deadline with alerts and the Case Management Conference, and hold the answer date until service"
  },
  "case": {
   "say": "• Assuming Atty. Thorne signed the Complaint on 09/23/2026 and the court accepted it on 09/24 as 26-CV-04417, the filing must be logged\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a signed set filed as 26-CV-04417, recorded and calendared"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: 26-CV-04417 in the Discovery & Filing Tracker; stamped set filed; Costs $486.75 + $218.00 = $704.75\n• Service deadline 01/22/2027 (Fri) with alerts; CMC 12/10/2026, 9:00 a.m., Atty. Thorne attending\n• The one thing to watch for: Docketing an answer date before service"
  }
 },
 "d4m1-kc": {
  "questions": {
   "say": "• Learning Check: answer from John Doe's file, in own words, under each question\n• Q1: what's the same on Track B as Track A, what changes 08/12/2026, why one $10,000 carrier freezes $40,000\n• Q2: John Doe's impasse triggers by 09/04/2026, each with its date and proof\n• Q3: Keystone calls $3,500 \"final\": using the \"Never\" rule, what's next and what needs Atty. Thorne's authority\n• If the freeze can't be explained in plain words, review Day 1's order of operations"
  },
  "summary": {
   "say": "• Self-Summary: the principles of recognizing an impasse and moving a file into litigation, in own words, not the clicks\n• Strategy: the file is in Litigation status with a 09/24/2026 filing target; name the next action and why\n• Then the one thing least sure of, and what would build confidence\n• Strong answers cite the file's own dates; any client question on the $3,500 or the fee goes to Atty. Thorne"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Self-ratings are compared with scores; wide gaps get talked through\n• UPL, giving legal advice without being a lawyer, is a gate: a strong score doesn't survive an ethics slip\n• The impasse memo is now the first page of a lawsuit file; read it like the defense would",
   "ask": "Where do you expect your self-rating and your score to disagree most?"
  }
 },
 "d4m2-l1": {
  "theory": {
   "say": "• John Doe's statute of limitations, the last day the law allows filing, is 02/06/2028, a Sunday\n• Keystone's stonewall on the 14-Day Gap put the file on court time: from 09/24/2026 statute, rule and order set the dates, whatever a carrier does\n• Documents stop being paperwork and become evidence; a missing or misfiled page can hurt a trial\n• Court processes repeat weekly, each driven by the calendar\n• Built-in waits, like notice to opposing counsel before a third-party subpoena, go on the calendar like deadlines\n• A third party's missed date becomes the Case Manager's problem; follow up ahead"
  },
  "doc": {
   "say": "• The Complaint turns a claim into a lawsuit; Atty. Thorne drafts and signs it\n• Parts: caption, jurisdiction, facts, causes of action (legal reasons for suing), prayer for relief (what is asked)\n• Filed before the SOL, it preserves negligence and negligence per se claims against Robert Smith\n• Filed 09/24/2026, No. 26-CV-04417: bodily injury only, $41,400.00 medical, $1,584.00 wages; no Property Damage, John owns no vehicle\n• Verify filing date and Smith's exact name; stamped copy in 01_PLEADINGS; use only the filed version"
  },
  "rules": {
   "say": "• Hard rule: a date fixed by statute, court rule, order or forum rules; miss one and the claim can go\n• Leave out the trigger day, count the last: Robert Smith served 10/14/2026, answer due 11/13/2026\n• Add 3 days for mail, none for e-service; forward counts roll later, backward counts roll earlier\n• Red flag: fifteen RFAs, requests to admit facts, inside the general discovery entry; unanswered, they may be deemed admitted: own entry, alerts, tell Atty. Thorne\n• Sunday SOL becomes hard date 02/04/2028, cutoff 11/05/2027; unsure, docket earlier and flag"
  }
 },
 "d4m2-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Calendar, correct the responses to 01/04/2027 (Mon): 30 days plus 3 mail days from the trigger, moved to a business day\n• Step 2: Log the RFA entry, “deemed admitted if unanswered”, and route the change to Atty. Thorne in Case Notes"
  },
  "case": {
   "say": "• Assuming the Scheduling Order in No. 26-CV-04417 was entered 12/10/2026 and 15 RFAs were mailed 12/01/2026, the calendar needs two fixes\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a corrected calendar and the RFA entry logged"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Responses corrected to 01/04/2027 (Mon); RFA entry added: “deemed admitted if unanswered”; Correction routed to Atty. Thorne\n• The one thing to watch for: Missing what isn't on the screen, like the RFAs"
  }
 },
 "d4m2-medcal": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log it in the CMS Calendar: the session with its attendees\n• The statement and binder due 03/11/2027, and the mediator's report watch on 03/25/2027\n• Step 2: Open a task for the $1,200.00 fee as a case cost and flag the UM consent question to Atty. Thorne"
  },
  "case": {
   "say": "• Assuming the mediation is set for 03/18/2027 at 9:30 a.m. and the binder is due 7 days before, the dates must be logged\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a trigger-counted mediation calendar and a same-day summary to Atty. Thorne"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Statement and binder due 03/11/2027 (Thu); Mediator's report watched on 03/25/2027\n• Fee $1,200.00, half of $2,400.00; Fee task opened; UM consent question flagged to Atty. Thorne\n• The one thing to watch for: Contacting the UM carriers without Atty. Thorne"
  }
 },
 "d4m2-um": {
  "theory": {
   "say": "• Three carriers. Third-party claim: against the at-fault driver's insurer, Keystone for Robert Smith, who ran the stop sign\n• First-party claim: coverage John claims as an insured: Harbor Point Host UM (Kevin's Escape) and Cardinal State Relative UM (Margaret's policy)\n• UM: uninsured or underinsured motorist coverage, paying when the other driver's insurance isn't enough; Harbor Point offered $8,000 against a $20,000 limit\n• One paragraph in Harbor Point's policy decides where this fight happens; read it before calendaring anything\n• Mandatory arbitration clause sends the dispute to a private decision-maker; the firm files a Demand for Arbitration\n• Bad faith: a separate suit over unfair handling, can exceed the limit; Atty. Thorne's alone"
  },
  "frame": {
   "say": "• Step one, claim submission: UM Demand Package with proof the at-fault limits were used up, sent 03/22/2027\n• Step two, dispute: Harbor Point offered $8,000, Cardinal State $6,000; $14,000 against $30,000 in limits\n• Step three, resolution route: Demand for Arbitration where the clause binds\n• Or a lawsuit against the carrier where state law bars the clause or lets the client opt out\n• Bad faith is not on this flow; separate action, Atty. Thorne's call"
  },
  "rules": {
   "say": "• Know which claim it is: same evidence, different relationship\n• John owns no car; Margaret's Bluewater policy on the Civic had UM rejected in writing 03/14/2024\n• He reaches UM by status: passenger in Kevin Alvarez's Escape, relative living with Margaret\n• The route is read, never chosen; read each layer on its own, Harbor Point's clause doesn't speak for Cardinal State\n• Red flag: a UM route docketed off the 02/06/2028 SOL; each route has its own clock: ask Atty. Thorne in writing, docket his answer"
  },
  "model": {
   "say": "• Claim submission, 03/22/2027: injuries, records, $42,984.00 in Specials, wage letter, proof Keystone's $10,000 was tendered and consented to\n• Tendered: offered up in full\n• Dispute: $8,000 on 03/31, $6,000 on 04/02; $14,000 against $30,000 of limits\n• Route: Harbor Point invoked its arbitration clause in April 2027; hearing 06/22 before Laura Whitcomb\n• Margaret's Bluewater policy is not a route: UM rejected in writing; John owns no car"
  },
  "dodont": {
   "say": "• Do: say first party or third party before anything else about a claim\n• Do: quote the clause in the memo, then stop; a paraphrase is already an interpretation\n• Don't: file or announce a lawsuit when the policy sends the dispute to arbitration\n• Don't read Harbor Point's clause onto Cardinal State's policy\n• Don't tell John a carrier is acting in bad faith or that he can recover above limits\n• Red flag: UM routes docketed off the tort SOL can be missed; each has its own clock, docketed only from Atty. Thorne's written answer",
   "ask": "Until Cardinal State's certified policy arrives, what can be said about how its dispute is decided?"
  }
 },
 "d4m2-l2": {
  "theory": {
   "say": "• Two neutrals: Hon. Carla Benton (Ret.) helps parties agree; Laura Whitcomb, Esq. decides, with almost no appeal\n• Judge Benton, the mediator, can't decide anything; brackets, ranges and authority belong to Atty. Thorne and John\n• Pre-suit: mediation usually follows treatment and the demand; arbitration only where a signed clause forces it\n• After filing, courts often order mediation during discovery, when both sides swap evidence; both of John Doe's sessions sit on the filed side\n• Non-binding (mediation): both sides must agree; nobody is forced to settle\n• Binding (arbitration): the award is final, enforced like a court order, reviewed only on narrow grounds; meaning for John is Atty. Thorne's to explain"
  },
  "frame": {
   "say": "• Role: the mediator facilitates and negotiates; the arbitrator is a private judge and finder of fact\n• Decision power: mediator none; arbitrator issues a binding Arbitration Award\n• Outcome: parties control it at mediation; the arbitrator decides liability and damages and can exclude evidence\n• Review: none needed for mediation; narrow court review for arbitration\n• Common mistake: preparing for both the same way; compromise focus versus trial-ready\n• In the room: joint session if the mediator sets one; private caucus; shuttle moves, each logged; brackets only from counsel; term sheet in writing 03/18/2027"
  },
  "rules": {
   "say": "• Mediation: non-binding, confidential; court-ordered, by 03/31/2027, means John Doe must attend, not agree\n• Logistics: 3 to 4 windows from Atty. Thorne, John Doe, opposing counsel; private room, interpreter check, 2-hour buffer; all rejected: log, escalate that day\n• Harbor Point's binding clause makes the arbitrator the judge; BI settled at mediation 03/18/2027, the UM gap went to decision\n• Damages less the $10,000 BI: Harbor Point pays above that to $20,000, Cardinal State's $10,000 behind\n• Arbitrator's office only as directed: fee schedule and retainer confirmed, payment in writing; a bench directive: logged as given, calendared, memo that day\n• Never argue, speak on the record or represent John Doe; defer to Atty. Thorne"
  },
  "model": {
   "say": "• Left, lighter card: mediation, 03/18/2027, Hon. Carla Benton (Ret.): non-binding, confidential, facilitates\n• Right, navy card: binding arbitration, 06/22/2027, Laura Whitcomb, Esq.: acts as judge, binding award, appeal limited\n• Hard dates underneath: 06/02, 06/11, 06/22/2027; an orange arrow joins compromise to trial-ready\n• Red UPL bar across both: unauthorized practice of law, doing a lawyer's job without being one\n• Can: observe, log directives, update the CMS; never: argue, speak on record, speak for John, negotiate"
  },
  "dodont": {
   "say": "• Do: treat hearing notes as Atty. Thorne's roadmap; write every directive the moment it's given\n• Do: confirm the neutral's retainer payment in writing\n• Don't: bring a mediation-quality binder to arbitration, or \"helpfully\" answer the arbitrator\n• Don't log bench directives the next day from memory\n• If the arbitrator turns to the Case Manager: say it goes to Atty. Thorne right away, nothing more\n• Red flag: any number the Case Manager speaks in caucus is an offer; log every move (time, who, what); keep the draft release ready",
   "ask": "The arbitrator asks you about a bill. What do you actually say?"
  }
 },
 "d4m2-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In the Action Plan Editor's ADR rules matrix\n• Count back from the hearing: exhibits 20 days before, the brief 10, each on a business day\n• Step 2: Log both dates with alerts on the CMS Calendar, and route the matrix to Atty. Thorne"
  },
  "case": {
   "say": "• Assuming Harbor Point has invoked arbitration and the hearing is set for 06/22/2027 (Tue), the arbitration dates need hard-coding\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Arbitration dates hard-coded with alerts, routed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Exhibits 06/02/2027; Brief 06/11/2027 (Fri), never 06/14/2027; Matrix routed to Atty. Thorne\n• The one thing to watch for: a brief deadline that lives only in an email"
  }
 },
 "d4m2-arbcal": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log it in the CMS Calendar: the hearing, exhibits 06/02/2027, the brief 06/11/2027, and records requests out by 05/03/2027\n• Step 2: Route the $900.00 fee share to accounting as a case cost, and ask Atty. Thorne in writing which old court dates stay"
  },
  "case": {
   "say": "• Assuming Laura Whitcomb's letter sets the hearing for 06/22/2027 at 9:00 a.m\n• With exhibits due 20 days before and the brief 10, the dates must be logged\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a letter-anchored calendar, every date with its rule, questions to Atty. Thorne"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Brief 06/11/2027 (Fri), exhibits 06/02/2027, from the letter; Records requests out by 05/03/2027 (Mon)\n• Hearing 06/22/2027, 9:00 a.m. on the Calendar; $900.00 fee share logged as a case cost; Court dates kept, flagged for Atty. Thorne; SOL dates unchanged\n• The one thing to watch for: Deleting a court date without Atty. Thorne's answer"
  }
 },
 "d4m2-a3": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log the impasse memo to Atty. Thorne in CMS › Notes › Case Notes, with each layer's dispute clause quoted word for word\n• Step 2: Ask him in writing for the route and the deadline, and docket nothing before his answer"
  },
  "case": {
   "say": "• Assuming Harbor Point offers $8,000 of $20,000, Cardinal State $6,000 of $10,000, and neither will move, the impasse needs routing\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: an impasse memo routed to Atty. Thorne, nothing docketed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: $8,000 / $20,000 and $6,000 / $10,000; Harbor Point's clause quoted, not paraphrased; Nothing docketed before his written answer\n• The one thing to watch for: Docketing an arbitration deadline from the tort SOL"
  }
 },
 "d4m2-kc": {
  "questions": {
   "say": "• Learning Check: three questions, answered from the file, in own words\n• Q1: discovery mailed 12/01/2026 and the Sunday SOL 02/06/2028: each date with arithmetic, both weekend directions, the RFA risk\n• Q2: the two UM resolution routes, what decides which governs, where bad faith sits, why Margaret's Bluewater policy isn't a route\n• Q3: each forum before or after filing, where John Doe's landed, non-binding and binding in plain words\n• Show the math, not just the date"
  },
  "summary": {
   "say": "• Self-Summary: what was learned about hard rules and the two forums, the principles, not the clicks\n• Strategy: 04/05/2027, arbitration just invoked; name the next action and why it comes first\n• Then the one thing least sure of, and what would build confidence\n• Key idea: every computed date shows its trigger, rule and direction"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Self-ratings are compared with scores; wide gaps get talked through\n• UPL is a gate: speaking for John Doe at the hearing or telling him whether to take a number fails it\n• Every skill here comes down to dates and documents that can be proved",
   "ask": "Which skill are you least sure you could perform under pressure at a live hearing?"
  }
 },
 "d4m3-l1": {
  "theory": {
   "say": "• A disorganized file the morning of mediation costs Atty. Thorne momentum and can cost a point\n• At the 03/18/2027 mediation he has minutes to answer Keystone's 14-Day Gap argument; every record, figure and quote must sit in a known place\n• The Mediation Binder: the case's critical documents, organized so counsel never fumbles in a fast compromise session\n• Section one, executive summary and administration: a one-page snapshot of the parties, the order and the schedule\n• Section two, mediation briefs: both sides' arguments side by side; section three, core pleadings: the filed documents that say what the lawsuit is about\n• Six sections in all; these first three set the stage"
  },
  "theory2": {
   "say": "• The back half of the binder proves the case\n• Section four, key evidence and liability: reports, video stills, highlighted deposition pages (sworn testimony taken outside court)\n• Section five, damages, financials and experts: records, bills, wage proof, expert reports behind counsel's figure\n• Section six, settlement history and drafts, so Atty. Thorne can finalize a deal before anyone leaves\n• Key evidence on this file: RPD-26-018842, Ruth Calloway, doorbell stills, EMS, EDR"
  },
  "frame": {
   "say": "• Six sections, fixed order\n• One: snapshot sheet, mediation order or agreement, session schedule; two: confidential statement and defense brief if exchanged\n• Three: operative complaint and the answer with affirmative defenses, the defense's reasons not to pay\n• Four: Police Report, photos and video stills, deposition summaries; five: medical chart, bills ledger, wage-loss proof, expert reports\n• Six: the Negotiation Log of every demand and offer, plus a draft release"
  },
  "doc": {
   "say": "• The Answer and Affirmative Defenses: the defendant's response to the Complaint, admitting or denying each allegation\n• It tells the court and Atty. Thorne what Robert Smith disputes; it is the defense roadmap\n• Filed 11/12/2026 by Atty. Grant Mercer: comparative negligence (John partly to blame), causation (the gap, \"degenerative\" MRI), failure to mitigate\n• Log it, file it in 01_PLEADINGS, keep Section 3 to operative pleadings\n• Map each pleaded defense to an exhibit or a flag; what it means is Atty. Thorne's"
  },
  "rules": {
   "say": "• Mediation 03/18/2027: master index under Documents; six numbered sections, each document in one; the binder prints from it\n• Each entry: section, exhibit number, Bates range, source; exhibit numbers belong to the proceeding, Bates to the page\n• One, summary and admin; two, briefs, ours to the mediator only; three, only the 09/24/2026 complaint and 11/12/2026 answer\n• Five: ledger tied to certified invoices, Riverton $6,290.00 down to $6,105.00, $42,984.00 total; six: Keystone's $3,500 baseline, draft Limited Release\n• Discovery & Filing Tracker: each pleaded defense needs an answering exhibit in four or five, or a flag\n• OCR, bookmark, check against the index; approved, searchable, delivered by 03/11/2027, audited 48 hours out; never discuss value"
  },
  "model": {
   "say": "• John Doe's binder from above: six navy tabs down the right edge, each with an orange number and name\n• Beside each, a card of this file's documents: RPD-26-018842, the EDR, the 03/13/2026 MRI, the $42,984.00 in Specials\n• Across the top, the master index: exhibit, Bates, source, status\n• Orange lines run one way only, index to binder\n• Right side: a five-second stopwatch and a red warning: drafts and old pleadings never enter the binder"
  },
  "dodont": {
   "say": "• Do: start from the 07/20/2026 Demand Package; most of the binder already lives there\n• Do: bookmark to the page Atty. Thorne will quote, like Dr. Reyes's causation opinion, not the cover\n• Don't: an unorganized file on 03/18/2027, or a snapshot sheet with stale opposing-counsel contacts\n• Don't send the confidential statement late: due 03/11/2027, to the mediator, not the other side\n• Dr. Reyes's causation opinion may need disclosure by 03/15/2027; how is Atty. Thorne's call\n• Red flag: Riverton still at $6,290.00 makes medical read $41,585.00, and Keystone already says the ledger is unverified; use the audited $6,105.00 and re-run totals",
   "ask": "Why does the 03/15/2027 expert disclosure date matter before the mediation, and who is told today?"
  }
 },
 "d4m3-a1": {
  "task": {
   "say": "• Assemble the six-section Mediation Binder in the CMS from the master index, starting with the 07/20/2026 Demand Package\n• Seat each document once with exhibit number and Bates range; map each defense in the 11/12/2026 answer to its exhibit\n• Rebuild the ledger from certified bills to $42,984.00; cross-check balances against what PIP and Peach State paid\n• PIP: add-on medical coverage paying regardless of fault, Harbor Point's $10,000 on Kevin's Escape; add the Negotiation Log, draft Limited Release, UM consent requests\n• Limited Release: ends only the claim against Robert Smith and Keystone\n• Dates and delivery: calendar the mediation from the verified notice, every date counted and conflict-checked, the fee as a cost"
  },
  "case": {
   "say": "• 03/04/2027, from Atty. Thorne: Mercer says Keystone won't put a real number up while the medical ledger is unverified\n• Draft binder carries Riverton at $6,290.00 and Crescent as an open balance; rebuild from the master index and audit\n• Statement and binder to Hon. Carla Benton (Ret.) by 03/11/2027, through Atty. Thorne first, for the 03/18/2027 mediation\n• John Doe deposed 02/18/2027; certified transcript on file\n• Riverton Spine & Rehab's Final Itemized Ledger: requested 02/08/2027, followed up 02/22, red-flagged 03/01, not arrived"
  },
  "grade": {
   "say": "• The Grade-A Mediation Binder prints from the master index, never the reverse\n• Any document found in five seconds: tabbed, bookmarked, searchable; operative pleadings only, no drafts\n• Order: cover letter to Hon. Carla Benton, master index, then the six sections\n• Download case documents to the training Drive; build the index first; rebuild the ledger from certified bills\n• Write the cover letter and audit memo; upload the binder to the CMS for the audit"
  },
  "audit": {
   "say": "• The Litigation Desk's index from 03/02/2027; on this draft, Atty. Mercer's complaint is right\n• Section five was typed from the providers' original bills: Riverton Spine & Rehab at $6,290.00 on 34 lines\n• Medical total reads $41,585.00, against the $41,400.00 served in July\n• Crescent shows as an open balance Peach State already paid\n• Call every section: what's missing as well as what's wrong",
   "ask": "Two medical totals for one file. Which one holds up, and what proves it?"
  },
  "check": {
   "say": "• Section one: LSH-2026-MVA-770412, No. 26-CV-04417, Atty. Mercer's verified contacts, fee split read from the order\n• Section three: only the filed complaint and answer; every defense mapped to an exhibit number, not \"See Medical Records\"\n• Landmine one: Riverton audited to 33 visits at $185.00, $6,105.00, duplicate removed, pending final verification; total $42,984.00\n• Landmine two: Crescent's $3,400.00 satisfied by Peach State's $1,860.00; open liens $7,965.00\n• Section six log runs 07/20/2026 demand to suit; release and consents stay drafts"
  }
 },
 "d4m3-l2": {
  "theory": {
   "say": "• The Mediation Binder persuaded; the Arbitration Binder is evidence: a trial-ready record for a private judge who decides\n• On 04/05/2027 Harbor Point and Cardinal State took up Keystone's gap argument; Laura Whitcomb, Esq. decides damages, bindingly\n• Everything counts back from the 06/02/2027 exchange: a page missing, unreadable, grayscale or not exchanged by then can be excluded, with no second chance\n• The Case Manager's role is operational: timelines, scheduling, documents, with precision\n• The brief deadline is the cutoff for claims, exhibit indexes and witness lists, to the arbitrator and opposing counsel\n• Arbitration submissions set the ground rules, so they lead the binder"
  },
  "frame": {
   "say": "• Tab one, submissions: snapshot sheet, final brief, governing order or agreement, fee disclosures; tab two: current demand and written positions only\n• Tab three, liability and biomechanics (the physics of the crash): certified Police Report, diagrams, color photos and stills\n• Tab four, medical damages: consolidated ledger, provider records and bills, imaging, the causation opinion\n• Tab five, prior medical shield: prior injury records and work history with a medical opinion\n• Tab six, economic losses: wage-loss proof only; no miscellaneous tab"
  },
  "rules": {
   "say": "• The threshold leads: prove BI used up with Keystone's $10,000 tender, consents, Limited Release, Robert Smith's dismissal, never the Mediation Statement\n• Authenticate, prove it's real, with business-records certifications from each provider, Riverton Fire, Riverton PD, Northgate HR\n• Video in its original file with the 02/19/2026 chain of custody, the record of who held it; stills in color\n• Build to the strict standard even if rules are relaxed; number exhibits C-1 onward, freeze once exchanged\n• Nothing crosses from mediation; Lien Sheet stays in Atty. Thorne's set\n• Red flag: Lien Sheet lists Harbor Point PIP at $10,000.00, never owed; strike it and re-total, $17,965.00 to $7,965.00"
  },
  "model": {
   "say": "• Left, small and gray: the Mediation Binder, persuades, non-binding; an orange arrow carries the gap dispute over\n• Right, larger: six arbitration tabs, each card stating its quality rule\n• Threshold chip over tab one: BI exhausted, $10,000 tendered 03/18/2027\n• Authentication rail below: custodian certification, original file, chain of custody\n• Red warning: not exchanged by 06/02/2027 may not count; confirm the forum's rules"
  },
  "dodont": {
   "say": "• Do: build to the strict evidence standard even when the forum relaxes it\n• Do: request certifications the week arbitration is invoked, the week of 04/05/2027, not before the 06/22 hearing\n• Don't: grayscale crash stills, or a draft brief or superseded complaint in the exchanged set\n• Don't: the Confidential Mediation Statement in the Arbitration Binder; once exchanged, it can't be unsent\n• Strong set: color, certified, current, screened; privileged items flagged for Atty. Thorne",
   "ask": "The forum relaxes the evidence rules. Can the custodian certification be skipped, and why?"
  }
 },
 "d4m3-prior": {
  "theory": {
   "say": "• Defense line since Keystone's 08/05/2026 offer: already there, a degenerative MRI (wear and tear), the old injury continuing; often no pre-crash imaging\n• Atty. Grant Mercer's 11/12/2026 Answer pleaded causation on it; the 02/18/2027 deposition pressed John's three 2021 chiropractic visits, low back, not neck\n• Harbor Point and Cardinal State dispute damages; Laura Whitcomb, Esq. decides 06/22/2027, bindingly\n• Tab 5 of the Arbitration Binder, the Prior Medical Shield, answers priors before the defense raises them\n• It starts from the pre-morbid baseline: John's condition before 02/06/2026, from records, not memory\n• Eggshell idea: generally the at-fault driver takes the injured person as found; worsening an old problem still counts; Atty. Thorne's argument"
  },
  "rules": {
   "say": "• Disclose the prior, never hide it; build the shield in five pieces\n• Birch Avenue Chiropractic's complete chart for 05/04, 05/11, 05/18/2021, certified; resolution in the record's words: low-back stiffness resolved, full activity\n• Body region side by side: low back then, neck and right arm now\n• The gap between, by records: the release, his Northgate job from 01/12/2026, histories with no prior neck complaint\n• Dr. Park's sentence and Dr. Reyes's Causation Letter in the same tab; mismatches go to Atty. Thorne"
  }
 },
 "d4m3-tx": {
  "why": {
   "say": "• A carrier starts valuing John Doe's injury the day he walks into urgent care, not at the demand\n• Everything paid is argued from the treatment record: how he was treated, how steadily, what doctors found\n• Every visit documented and every gap answered, or the gaps surface in the adjuster's offer letter\n• Red flag: a claimed harm with no dated record behind it can't be shown in the binder; flag it to Atty. Thorne, never argue it"
  },
  "rules": {
   "say": "• MMI 06/12/2026, Dr. Reyes's Causation Letter 06/19, BI demand 07/20\n• The 03/13 MRI: C5-C6 herniation with no significant degeneration next to it; that line is quoted\n• The fourteen-day gap and the April disruption were answered on file before Keystone's offer cited them\n• Specials $42,984.00, billed and audited\n• Repeat injections Dr. Reyes mentioned go in the narrative, note quoted, never in the Specials"
  }
 },
 "d4m3-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Litigation › Discovery & Filing Tracker, number the exhibits C-1 onward with their Bates ranges, leading with the BI exhaustion record\n• Step 2: Log the audited Lien Sheet at $7,965.00, and route the binder to Atty. Thorne"
  },
  "case": {
   "say": "• Assuming the Mediation Binder is built and the 06/02/2027 exchange is close, the Arbitration Binder's exhibits need numbering\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a C-numbered binder and an audited Lien Sheet, routed"
  },
  "grade": {
   "say": "• The Grade-A standard, for this side exercise: Threshold exhibits first, nothing from the Mediation Statement\n• And Liens: $1,860.00 + $6,105.00 = $7,965.00\n• Only the logged entry is graded, under the assumption on the slide"
  },
  "audit": {
   "say": "• The finished set, for reference: the side exercise asks only for the two steps, not the whole audit\n• Have them check theirs for this: Liens: $1,860.00 + $6,105.00 = $7,965.00"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Threshold exhibits first, nothing from the Mediation Statement; Liens: $1,860.00 + $6,105.00 = $7,965.00; Draft removed; impasse memo flagged\n• The one thing to watch for: Conceding a reimbursement right the carrier gave up"
  }
 },
 "d4m3-kc": {
  "questions": {
   "say": "• Learning Check on the binders actually built; answer from the file, in own words, under each question\n• Q1: the six Mediation Binder sections in order, with one document from this file for each\n• Q2: what the master index records per exhibit, and why it outranks the printed binder\n• Q3: the 11/12/2026 answer pleads John Doe was unbelted; which section shows it, which exhibits answer it\n• A document not found in ten seconds signals an index problem"
  },
  "summary": {
   "say": "• Self-Summary: building a binder an attorney can work from at speed, the principles, not the clicks\n• Strategy: the exchange set is with Atty. Thorne for approval; name the next action and why\n• Then the one thing least sure of, and what would build confidence\n• Never exchange a ledger its records don't support; build it so nothing on the night can break it"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Ratings sit next to scores; far-apart ones get discussed\n• UPL is a gate here too: a privileged memo in an exchanged set fails it\n• Takeaway: a Mediation Binder persuades, an Arbitration Binder proves",
   "ask": "Which binder skill would you rate lowest right now, and what would move it up a point?"
  }
 },
 "d4m4-l1": {
  "why": {
   "say": "• The Statute of Limitations, 02/06/2028, is the date that makes a tidy file useless if wrong\n• Quiet problems cost more than obvious ones: Keystone's silence locked all $40,000 behind $10,000\n• Bottleneck: anything stuck and holding the rest of the file up\n• They look like a quiet inbox, a record \"on its way\", a date nobody confirmed"
  },
  "rules": {
   "say": "• Bottleneck: anything that can stop the file reaching a hard date; log it the day it starts, with its threatened date\n• Follow up a silent adjuster every 5 business days: Keystone left 08/24 and 08/31/2026 unanswered, then 09/02 escalation\n• Record silence as dated facts: what, since when, what date at risk; never \"adjuster busy\"\n• Record unanswered 14 days is a bottleneck; ledger $42,984.00, Riverton $6,105.00, Peach State $1,860.00\n• Brief to Hon. Carla Benton by 03/11/2027; chase, document, flag; remedies and value are Atty. Thorne's"
  }
 },
 "d4m4-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Tasks › Action Item Log\n• Set a second request for the late record and the 48-hour audit, each with a date and an owner\n• Step 2: Log the red flags for 03/01/2027 and 03/08/2027 in CMS › Notes › Case Notes"
  },
  "case": {
   "say": "• Assuming the binder is due 03/11/2027 and Riverton's ledger, requested 02/08/2027, hasn't arrived, the countermeasure rules need setting\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Countermeasures set, every firing dated and owned"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Rule 2 fires 02/22/2027: Notice of Delay to the adjuster and Atty. Thorne; Red flags 03/01/2027 and 03/08/2027; Audits 03/09/2027 and 03/16/2027\n• The one thing to watch for: Waiting for the perfect ledger instead of escalating"
  }
 },
 "d4m4-l2": {
  "why": {
   "say": "• Keystone sent someone with real authority because verified ledgers went early and attendance and authority were confirmed\n• Weak escalation: \"Keystone still not responding, please advise\"\n• Missing: last contact, deadline at risk, what was tried, what decision is needed\n• The ladder decides who hears about a problem and when; the report decides whether they can act in one read"
  },
  "rules": {
   "say": "• Climb one step at a time, logging each; the Notice of Delay states facts only, never accuses bad faith\n• 48-Hour Mandate: each rung gets 48 hours of silence, then the file moves up\n• Keystone: second follow-up 08/31, supervisor 09/02, silence 09/04 to Atty. Thorne, impasse memo 09/08/2026\n• Also audit ledgers, binders and OCR-searchable scans 48 hours before every hard date\n• Five fields: blocker, start date, hard date, what was tried, the ask; zero defaults; report weekly"
  }
 },
 "d4m4-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log one bottleneck report in CMS › Notes › Case Notes, nearest hard date first, with one ask per item\n• Step 2: Send it in CMS › Tasks › + Add Task, and date the 48-hour audit"
  },
  "case": {
   "say": "• Assuming five problems threaten the 06/02/2027 exhibit exchange and Atty. Thorne must decide three of them, one report needs sending\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: One five-field report, sent 05/24/2027"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Items 1–3 in one report, nearest date first; Audit Fri 05/28/2027: Memorial Day moves it; Nothing decided that is Atty. Thorne's\n• The one thing to watch for: Escalating the grayscale reprint while sitting on the certification"
  }
 },
 "d4m4-kc": {
  "questions": {
   "say": "• Learning Check: answer from this file, in own words, under each question\n• Q1: the three bottleneck families, this file's example of each and the hard date threatened\n• Q2: Rule 1 on Keystone: follow-ups, the 48-Hour Mandate escalation, the hand-off to Atty. Thorne, every date\n• Q3: Keystone's representative arrives 03/18/2027 without authority to pay $10,000: what failed earlier, and the countermeasure\n• A full answer names the rule, the date and what gets sent"
  },
  "summary": {
   "say": "• Self-Summary: seeing a bottleneck before it bites, the principles, not the clicks\n• Strategy: 05/24/2027, five problems open; name the first action and why it beats the easiest\n• Then the one thing least sure of, and what would build confidence\n• A carrier call about the gap: take the message, say Atty. Thorne will respond, log it"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Ratings are compared with scores; big gaps get talked through\n• UPL is a gate: a value conversation with a carrier fails it, however well the rest went\n• Key idea: a silent file is a file in trouble",
   "ask": "Which escalation skill do you most want to practice again before your next file?"
  }
 },
 "d5m1-l1": {
  "why": {
   "say": "• Track B: the 07/20/2026 Time-Limited Demand to Keystone lapsed unaccepted on 08/21/2026; the 48-Hour Mandate got no answer\n• Atty. Thorne filed suit 09/24/2026, Civil Action No. 26-CV-04417; now a judge sets the pace, not an adjuster\n• Discovery & Filing Tracker: the running list of everything filed and served\n• Discovery Calendar: every date either side owes the other something\n• Red flag: fifteen RFAs lack their own row. An unanswered RFA may be deemed admitted. Give each a row; tell Atty. Thorne within the hour"
  },
  "rules": {
   "say": "• From the 09/24/2026 filing the court sets the pace; litigation is not a longer negotiation\n• Before Atty. Thorne signs: check the filing date against the SOL (deadline to sue) and the defendant's exact legal name\n• Log every service attempt; unserved at day 14 (10/08/2026), escalate for Skip-Trace authority; Smith served 10/14/2026\n• An RFA unanswered past its deadline may be deemed admitted, treated as true; calendar it the day it lands\n• Hold a Discovery Intake Meeting with John Doe, never mail him the 70 requests; never tell him how to answer"
  }
 },
 "d5m1-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Litigation › Discovery & Filing Tracker, add the RFA row with a deemed-admission flag, and log the Certificate of Service with its date\n• Step 2: Report any miss to Atty. Thorne today in CMS › Tasks › + Add Task, without back-dating"
  },
  "case": {
   "say": "• Assuming the 15 RFAs have no row in the Discovery & Filing Tracker and their 01/04/2027 Certificate of Service sits unlogged, the log needs fixing\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a corrected, source-linked log, misses reported the same day"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: RFA row (15) added with a deemed-admission flag; Certificate of Service logged; Late filings logged as misses, not back-dated\n• The one thing to watch for: Quietly fixing a passed deadline instead of telling Atty. Thorne"
  }
 },
 "d5m1-l2": {
  "why": {
   "say": "• Scheduling Order entered 12/10/2026: the judge's calendar for the case, running to a 09/13/2027 trial calendar\n• Every date in it is absolute\n• Trial-prep checklist: turns each date into a task someone owns\n• KPIs: measurable scores proving each task is ahead of its deadline"
  },
  "rules": {
   "say": "• The Scheduling Order controls: pin it to the file front, 30-, 14- and 7-day alerts on every date\n• Experts 03/15/2027, defense experts 04/15/2027, mediation by 03/31/2027, discovery closes 05/28/2027, pretrial 08/12/2027, trial 09/13/2027\n• Every extension in writing: once Atty. Thorne agrees, draft the same-day confirmation for his signature\n• Keystone or a defense investigator reaches John Doe: step in, tell Atty. Thorne that day\n• Deposition 02/18/2027: reporter, link, tech check, packet by 02/11/2027; prepare the process, never testimony"
  }
 },
 "d5m1-subp": {
  "why": {
   "say": "• Robert Smith is a party, so he must answer; the records custodian and witness Ruth Calloway don't, unless the court commands it\n• That court command is a subpoena\n• Serve it out of order, write it too broadly, or get records after discovery closes 05/28/2027, and evidence can be lost\n• Red flag: \"all records of any kind\" invites a Motion to Quash. One subject, an exact date range, named record types; Atty. Thorne signs"
  },
  "rules": {
   "say": "• Trigger: a refused request, or a record Atty. Thorne needs from its custodian; he decides, signs and issues\n• Court-approved form: Civil Action No. 26-CV-04417, named custodian, narrow Exhibit A, the list of records sought\n• Copy to Atty. Grant Mercer first; after the notice period, Allied Process Services serves the custodian\n• Compliance call five days before production; pay the copy invoice promptly; records back before 05/28/2027\n• Trial subpoenas only for witnesses Atty. Thorne names, tasked against 08/12/2027 and 09/13/2027"
  }
 },
 "d5m1-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Calendar, correct our expert disclosure to 03/15/2027, and record mediation as completed by 03/31/2027\n• Step 2: Log both changes in CMS › Litigation › Discovery & Filing Tracker"
  },
  "case": {
   "say": "• Assuming John Doe's deposition notice for 02/18/2027 has arrived and the checklist was never reconciled to the order, two dates need fixing\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a checklist matching the order date for date"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Expert disclosure corrected to 03/15/2027; Mediation completed by 03/31/2027; KPI tracker updated with both changes\n• The one thing to watch for: Scheduling discovery work after the discovery cutoff"
  }
 },
 "d5m1-kc": {
  "questions": {
   "say": "• Learning Check: answers from John Doe's file, in own words\n• Question 1, the gate: the response date for discovery mailed 12/01/2026; 12/31/2026 or 01/03/2027 means rework the count\n• Also: how the count changes for a set e-served by consent, and why the court's rule is confirmed\n• Then: the Answer's three defenses with evidence against each; where and under what names the affidavit, RFAs and Scheduling Order go"
  },
  "summary": {
   "say": "• Self-Summary: what was learned supporting John Doe's lawsuit, the principles, not the clicks\n• Strategy: the next action on the file as of 01/20/2027, and why that one\n• Then the one thing least sure of, and what would build confidence\n• Reminder: only Atty. Thorne agrees an extension, in writing, the same day"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Skills include computing court deadlines, the Discovery & Filing Tracker and Discovery Calendar, the trial-prep audit and KPIs\n• Ratings are compared with scores; wide gaps get discussed\n• UPL, legal advice from a non-lawyer, is a gate: a strong score doesn't survive an ethics breach",
   "ask": "Which skill might your self-rating and score disagree on?"
  }
 },
 "d5m2-l1": {
  "why": {
   "say": "• Day 1's question returns: does Property Damage touch John Doe's case, now with money on the table\n• Keystone's $792.00 offer on Margaret's Civic does not lower John's settlement\n• Her Loss of Use and Diminished Value come from Keystone's $25,000 Property Damage limit, outside John's $40,000 stack\n• Three things can reach John: a too-wide release, the photos and estimates in his severity set, the rental dates behind his gap\n• Red flag: Keystone's release, \"all claims arising from\" the 02/06/2026 accident, can reach John's BI suit. Accept, reject, counter nothing; Atty. Thorne gets it"
  },
  "rules": {
   "say": "• Read the release before the numbers: Keystone's 12/10/2026 release covers all claims from the 02/06/2026 accident, for Margaret Doe to sign\n• A Property Damage release must be limited to Property Damage\n• Check the claim number: KM-26-440871-PD for the car, KM-26-440871 for John; hold it, route to Atty. Thorne same day\n• John signs nothing; photos, estimate, $2,315.00 supplement and rental dates stay identical on both files\n• Never accept, reject, counter or value a car figure"
  }
 },
 "d5m2-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log the release in CMS › Doc Hub as held, and route it to Atty. Thorne in CMS › Tasks › + Add Task the same day\n• Step 2: Log one Case Note: Diminished Value and Loss of Use stay on Margaret's file. Does this touch John Doe's case?"
  },
  "case": {
   "say": "• Assuming Keystone PD's final position is $792.00 and $0 with an all-claims release for Margaret Doe, the release needs holding\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: the release routed, each PD outcome sorted"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: “All claims” release routed the same day\n• Nobody asked to sign before Atty. Thorne's review; Diminished Value and Loss of Use on Margaret's file\n• The one thing to watch for: Telling Leah Moran “we'd probably take” any figure"
  }
 },
 "d5m2-kc": {
  "questions": {
   "say": "• Property Damage Transition Check; answers from John Doe's file, in own words\n• Question 1: why Keystone's all-claims release must never reach John, and what to do with it\n• Question 2: sort Keystone's final position: what reaches John's settlement, what stays on Margaret's file, and why\n• Question 3: which car documents already serve John's case, and what must match on both files"
  },
  "summary": {
   "say": "• Self-Summary: how Property Damage touches John Doe's case at settlement, and how it doesn't\n• Strategy: Leah Moran wants an answer today and her release is on the desk; the next action, and why that one\n• Then the one thing least sure of\n• Key idea: hold the release, route it, Atty. Thorne decides"
  },
  "scale": {
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Ratings sit beside scores; a 5 on a block scored 60, or a 2 on one aced, both get a conversation\n• Key skill: reading a release for its scope and claim number, which protects John's whole case",
   "ask": "Which skill did you rate lowest, and what would raise it a point?"
  }
 },
 "d5m3-l1": {
  "why": {
   "say": "• John Doe resurfaced 02/03/2027, fifteen days before his 02/18/2027 video deposition, from a room the firm doesn't control\n• Deposition: the other side's lawyer questions John under oath while a court reporter records every word\n• Before calming anyone, audit the file for anything the defense might use, so Atty. Thorne sees it first\n• The split: Atty. Thorne prepares the substance; the Case Manager prepares the person and the setting"
  },
  "rules": {
   "say": "• Finish the audit before 02/04/2027; route the 14-Day Gap, 19-day disruption, three 2021 low-back chiropractic visits, seatbelt, degenerative MRI\n• Check signed answers and public social media; mismatches go up same day; never tell John to delete a post\n• His account matches the records because he reviewed them with Atty. Thorne, not a memorised script\n• Test the setup with him 02/16/2027; confirm with all three parties 02/17/2027; nobody in the room, no notes, no messages"
  }
 },
 "d5m3-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: Log his new number, the 02/16/2027 test call and the 10:00 a.m. deposition at Riverton Court Reporting in CMS › Tasks\n• Step 2: Route each question he asked about his case to Atty. Thorne in his own words, answering none and giving him no script"
  },
  "case": {
   "say": "• Assuming John Doe has a new number and his video deposition is 02/18/2027, the prep logistics and his questions need logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Logistics logged and his questions routed in his words"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Logistics exact: 02/18/2027, 10:00 a.m; All questions routed, not answered; No outcome predicted to John; No script or wording given to John\n• The one thing to watch for: the helpful half-answer; it is a script"
  }
 },
 "d5m3-l2": {
  "why": {
   "say": "• \"So it was just the neck stiffness. Is that all?\" A hurried yes fences off the 02/20/2026 urgent-care note's hand numbness\n• Atty. Mercer doesn't need John to lie: a hurried yes, a guess or an argument does the damage\n• Expect digging on the gap, the disruption, the 2021 visits, the seatbelt, and \"degenerative\" as the defense's other cause\n• Seven general rules and Atty. Thorne's objections protect John; a script doesn't\n• Red flag: Atty. Mercer springs a trap; any signal or message to John coaches the witness. Log the trap, time, his exact words, record fact"
  },
  "rules": {
   "say": "• Four categories of defense questions: personal background, crash mechanics, medical history, daily life\n• Medical history is underreported most; here, the 2021 low-back visits, which counsel usually already has\n• \"Is that all\" can fence off the hand numbness; the complete record, not memory, is the full list\n• Compound questions fold two facts into one yes; John can say a question is unclear\n• On an objection John stops, then answers unless told not to; explain rules, never coach answers"
  }
 },
 "d5m3-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Litigation › Discovery & Filing Tracker\n• Put the record fact and its source beside each trap, such as the gap: 14 days, 02/06 to 02/20/2026\n• Step 2: Route the log to Atty. Thorne before his debrief"
  },
  "case": {
   "say": "• Assuming Atty. Thorne's mock cross-examination ran on 02/16/2027 with your microphone muted, the Trap Log needs finishing for his debrief\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a timestamped Trap Log, routed before the debrief"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Gap entry: 14 days, 02/06/2026 to 02/20/2026; “Degenerative” entry cites the 03/13/2026 MRI; No coaching: no signal to John\n• The one thing to watch for: Telling John afterwards “you should have said…”"
  }
 },
 "d5m3-kc": {
  "questions": {
   "say": "• Deposition Readiness Audit; strip: audit routed, pillars delivered, tech check passed, day-before confirmed, Trap Log debriefed\n• Hardest chip to turn green honestly: the routing, because it is tested under pressure\n• Question 1: the landmines the audit must surface before 02/04/2027, with each record\n• Question 2: the 02/17/2027 day-before checklist; Question 3: four question categories, the underreported one, where it sits here"
  },
  "summary": {
   "say": "• Self-Summary: what was learned preparing a client to testify; principles, not clicks\n• Warm-up: John resurfaces 02/03/2027, fifteen days out; his new number into the CMS, the audit to Atty. Thorne\n• Strategy: John testifies 02/18/2027; the next action on the file, and why that one\n• Then the one thing least sure of"
  },
  "scale": {
   "say": "• Skill Scale: rate each competency 1 to 5, then submit; wide gaps with scores get discussed\n• Question 5 is the UPL gate: the unauthorized practice of law, a non-lawyer giving legal advice\n• Any reply giving John content about the gap fails the module; the right reply routes and logs his question in his words",
   "ask": "Where would you honestly rate your routing under pressure right now?"
  }
 },
 "d5m4-l1": {
  "why": {
   "say": "• After suit, Robert Smith's Answer attacks fault and mitigation\n• \"Entered the all-way stop out of turn\" is about Kevin Alvarez's driving, not John\n• Seatbelt is comparative fault: blaming John for part of his own injuries\n• Missed visits are failure to mitigate: claiming he didn't do enough to get better\n• Fault can reduce or wipe out recovery; mitigation cuts only damages the missed care caused"
  },
  "rules": {
   "say": "• Pure: damages fall by John's share; modified: barred at 50% or 51%, by state; contributory: any fault bars recovery\n• Confirm the governing rule with Atty. Thorne\n• Liability status with source: Keystone accepted PD liability 02/17/2026; the Answer now pleads comparative fault\n• Whatever the defense says about Kevin Alvarez, the stack stays $40,000\n• Evidence counts only if admissible: record source, witness and custody, who held it and when"
  }
 },
 "d5m4-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Litigation › Discovery & Filing Tracker, give each allegation its own row with the evidence, its source and chain of custody\n• Step 2: Log the questions only Atty. Thorne can answer at the end"
  },
  "case": {
   "say": "• Assuming Atty. Mercer's Answer pleads comparative negligence and failure to mitigate, the counter-package needs its evidence logged\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: an allegation-by-allegation counter-package, questions routed"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Three separate rows: out of turn, unbelted, mitigate; EDR's 11 mph used as corroboration only; Video chain: native file unaltered\n• The one thing to watch for: an Exhibit A asking for “all records of any kind”"
  }
 },
 "d5m4-l2": {
  "why": {
   "say": "• Two people went missing: Robert Smith moved before service; John Doe went silent 27 days before his deposition\n• Shared problem: no working contact point; difference: opponent versus client, so who may do what differs\n• Skip-Trace: a records search for a current address; process server: the person who hands over court papers\n• Certified proof of notice also applies; the record kept proves the work was done\n• Red flag: Robert Smith unserved fourteen days after filing, 10/08/2026. A fourth knock burns time to the 01/22/2027 deadline; ask Atty. Thorne for skip-trace authority"
  },
  "rules": {
   "say": "• Summons: the court's notice of the suit and time to answer; filed 09/24, served 10/14, affidavit 10/16/2026\n• Three failed attempts at 118 Larkspur Ln, neighbor says Smith moved: Skip-Trace; 10/09 found 4410 Quarry Ridge Ct, Millbrook\n• Service starts his clock: answer due 11/13/2026; check the docket weekly\n• John, silent since 01/22/2027: No Contact Protocol; Step 4 letter by certified mail and email over Atty. Thorne's signature, by 01/27/2027\n• Withdrawal only if Atty. Thorne directs it; Margaret hears only that the firm needs John to call"
  }
 },
 "d5m4-a2": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Notes › Case Notes, log service at 4410 Quarry Ridge Ct, Millbrook, and docket the answer date in CMS › Calendar\n• Step 2: Log why John Doe's Skip-Trace gate is not met yet in CMS › Notes › Case Notes"
  },
  "case": {
   "say": "• Assuming Robert Smith's new address is confirmed on two sources, his service and the answer date need logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a service record through the answer date"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: 4410 Quarry Ridge Ct on two current sources; Answer due 11/13/2026 docketed; Gate not met: no Skip-Trace for John\n• The one thing to watch for: a response date after the first prep session"
  }
 },
 "d5m4-kc": {
  "questions": {
   "say": "• Final Comprehensive Knowledge Check, spanning all five days; answers from John Doe's file: names, dates, figures\n• The Recovery Stack, the order insurance money is tapped, with limits and total; three coverages outside it; the Payer Order\n• When the 07/20/2026 BI demand's window closed, and why; on Track A, what UM carriers must give before BI release\n• Track A: reconcile $40,000.00 to $20,359.92, deduction by deduction, with costs and liens split by stream"
  },
  "summary": {
   "say": "• Question 7: John asks how to explain the gap; listen, say Atty. Thorne will go through it, escalate, log\n• Question 4: $40,000.00 less $13,333.33 fee, $486.75 costs, $1,240.00 and $4,580.00 liens: $20,359.92\n• Self-Summary: the principles across all five days; strategy: counter-package with Atty. Thorne, mediation set 03/18/2027, next action\n• Then the one thing least sure of across the Case Flow"
  },
  "scale": {
   "say": "• Skill Scale: rate each competency across all five days 1 to 5, then submit for review\n• Ratings are compared with scores; honest ratings are where coaching starts\n• UPL is a gate, not a weight: a 5 on UPL from someone who coached John in Question 7 doesn't pass",
   "ask": "Across all five days, which competency rating surprised you most?"
  }
 },
 "d5m5-l1": {
  "why": {
   "say": "• Same $40,000.00 gross on both tracks; on Track A, Keystone settled and John Doe netted $20,359.92\n• Track B: suit, mediation and arbitration; Laura Whitcomb's award came 07/06/2027\n• Track B net: $14,713.75, $5,646.17 less; three things moved it\n• John should understand every dollar before signing anything; that is the Net Sheet's job"
  },
  "rules": {
   "say": "• 07/06/2027 award: Harbor Point $20,000.00, Cardinal State $10,000.00; plus Keystone's $10,000.00 BI from 03/18/2027 mediation: $40,000.00\n• Fee 40%, $16,000.00: suit filed 09/24/2026; confirmed by Atty. Thorne\n• Receipted costs: filing $218.00, service $285.00, mediation $1,200.00, arbitration $900.00, reporter $645.50, records $160.00, pre-suit $486.75: $3,895.25\n• Liens: Peach State reduced $744.00, to $1,116.00; Riverton Spine & Rehab $4,275.00; net $14,713.75\n• Nothing leaves trust until checks clear, Payoff Letters are in and John signs"
  }
 },
 "d5m5-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In the LSH Net Sheet, enter the gross by carrier, the 40% fee after suit, the receipted costs and each reduced lien\n• Step 2: Log the Settlement Statement to Atty. Thorne in CMS › Tasks › + Add Task"
  },
  "case": {
   "say": "• Assuming $40,000.00 is in trust after the award, with Peach State at $1,116.00 and Riverton at $4,275.00, the Litigation Net Sheet is due\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: a Net Sheet reaching $14,713.75"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Fee at 40%: $16,000.00; Liens: $1,116.00 + $4,275.00; Net: $14,713.75, tied to trust\n• The one thing to watch for: Paying a lien from a phone call"
  }
 },
 "d5-drive": {
  "task": {
   "say": "• File the litigation and ADR documents from Work From so each lands in 09 Litigation & ADR on the Backup Drive\n• Final audit: My Backup Drive, run Check my drive; backed up equals filed in the CMS across all nine folders\n• Superseded versions labeled, drafts marked\n• Closing checklist in Case Notes: folders complete, Payoff Letters and Settlement Statement on the drive, closing letter backed up, clean check\n• After sign-off the folder moves under 04 Closed Files, closing date logged; don't move it in the training drive"
  },
  "case": {
   "say": "• 07/30/2027, 3:00 p.m.: John Doe's case is won; the award was disbursed today, every lien paid on its Payoff Letter\n• Litigation file in the CMS: Complaint, service papers, Answer, Scheduling Order, mediation term sheet, both binders\n• One job left before the file closes: the final backup\n• Goal: anyone opening the file years later finds any document in seconds"
  },
  "check": {
   "say": "• Complaint, service papers, Answer, Scheduling Order and term sheet in 09 Litigation & ADR\n• Backed up equals filed; drafts marked, old versions labeled; Check my drive clean\n• Closing checklist ends with Atty. Thorne's sign-off and the move to 04 Closed Files\n• Test: open the Day 1 HIPAA authorization and the November Answer in seconds",
   "ask": "Why does the folder move to Closed Files only after Atty. Thorne signs off?"
  }
 },
 "d5m5-kc": {
  "questions": {
   "say": "• Track B Close-Out Check: John Doe's file is closed, intake to award; answers from the file, in own words\n• Question 1: take the $40,000.00 award to $14,713.75, every deduction with figure and source\n• Question 2: why the fee is 40%, which document says so, who confirms it\n• Question 3: Peach State $1,240.00 on Track A, $1,116.00 on Track B; show both reductions and why they differ"
  },
  "summary": {
   "say": "• Self-Summary: the principles behind a litigated Net Sheet, not the clicks\n• Strategy: the award is in and both UM checks are in trust; next action before the 07/30/2027 disbursement, and why\n• Then the one thing least sure of\n• Question 5 is the UPL gate: arithmetic yes, opinion no; saying the suit was or wasn't worth it crosses the line"
  },
  "scale": {
   "say": "• Skill Scale: rate each competency 1 to 5, then submit for review; wide gaps with scores get discussed\n• Skills: the retainer's fee tier, costs with receipts, reducing liens, explaining a Net Sheet without advice\n• The award doesn't grade the work; the Net Sheet does\n• One more file to close next: Denise Harlow's Dropped Case",
   "ask": "Which skill feels strongest now across John Doe's file, and what proves it?"
  }
 },
 "d5m6-l1": {
  "why": {
   "say": "• Dropped Case: a claim the firm stops pursuing before it resolves; John Doe's file never gets here\n• Atty. Thorne talks to the client first; the letter only confirms it\n• Withdrawal Letter: formal notice the lawyer-client relationship has ended\n• Done carelessly, a drop confuses the client and exposes the firm; done right, the file proves everyone was told\n• Red flag: a carrier letter saying Denise stopped treating. Only the client's letter carries the reason, in Atty. Thorne's words; elsewhere it's a defect"
  },
  "rules": {
   "say": "• Six steps in order; 1, the gate: status Pending Drop and a note the client was told; either missing, nothing goes out\n• 2: a Withdrawal Letter for every party over Atty. Thorne's signature, saved in Word and PDF; 3: send each by its method\n• 4: annotate party, method, date, save the sent letter; 5: follow up on receipt\n• 6: switch the status to Dropped and keep the proof\n• An unresponsive client reaches this only through the No Contact Protocol"
  }
 },
 "d5m6-a1": {
  "task": {
   "say": "• Skill activity, a few minutes: two steps, one entry logged; the assumption it starts from is on the next slide\n• Step 1: In CMS › Doc Hub › Others, draft the three letters for his signature, with his reason only in Denise's\n• Step 2: Log each send and the 12/16/2026 follow-up, then switch the case to Dropped"
  },
  "case": {
   "say": "• Assuming Atty. Thorne dropped Denise Harlow's case and told her on 12/08, with the status at Pending Drop, the close-out needs logging\n• Everything before that is taken as done: nobody rebuilds the file to get here\n• What they hand in: Three letters for signature and a close-out log"
  },
  "check": {
   "say": "• Submit: they submit the entry they logged; graded on the two steps under the assumption, not on work the exercise didn't ask for\n• It looks for: Gate confirmed before any letter goes out; the reason only in Denise's letter; Dropped only after the follow-up\n• The one thing to watch for: Offering Denise a way to save the case"
  }
 },
 "d5m6-kc": {
  "questions": {
   "say": "• Knowledge Check from the practice matter, in own words; each answer needs a name, date or method from the file\n• Question 1: the two things confirmed before any Withdrawal Letter goes out, and why both matter\n• Question 2: what goes in Denise Harlow's letter but not Granite Shield's or Brookside's, and why\n• Question 3: letters out 12/09/2026; what must be true before Dropped, and what proof stays"
  },
  "summary": {
   "say": "• Self-Summary: the principles behind closing a Dropped Case, not the clicks\n• Strategy: Denise's return receipt isn't back by 12/16/2026; the next action, and why that one\n• Then the one thing least sure of\n• Explaining the drop, or advising Denise beyond what Atty. Thorne approved, crosses into his territory"
  },
  "scale": {
   "say": "• Last Skill Scale of the course: rate each skill 1 to 5, then submit for review\n• Skills: the Pending Drop gate, a letter for each party, choosing and logging send methods, closing with proof and no advice\n• Ratings are compared with answers; a wide gap is a conversation, not a grade\n• First real file: find the detail that could cost the client money, document it, take it to the attorney same day",
   "ask": "What's the first thing to check on a first real file, and why?"
  }
 },
 "_days": {
  "1": {
   "agenda": {
    "say": "• Welcome; today starts John Doe's case from the beginning, on the Day 1 deck\n• Part 1, the lessons: fundamentals, intake, claim set-up and the Case Plan, the car, client communications, who pays the bills, treatment\n• Part 2, the daily loop: meet John Doe on his Case Profile and do his Intake, our Skill Building\n• Then 📁 Backup File Maintenance, required: the firm's folders on his Backup Drive; then write the Action Plan\n• Then 5 short skill activities in a 25-minute Practice Lab: every trainee works all 5\n• Knowledge Check: 70% opens Day 2"
   },
   "lab": {
    "say": "• Practice Lab: 5 short skill activities, each one an assumption and one entry to log in the CMS\n• Intake and claim set-up: John Doe's voicemail and his Direction Packet, the LORs to every carrier\n• Care and the client: the Payer Order and the LOPs, the Case Plan with the gap in its risks, the near-drop\n• About 25 minutes: time for all 5, about five minutes each; then the Ready check"
   },
   "plan": {
    "say": "• Step 4 of the loop, guided: the Action Plan template, section by section, on the shared screen\n• Every fact from the Intake with the document it comes from; every action item with an owner, a date and a tool\n• Anything only Atty. Thorne decides is routed to him, with the date"
   },
   "wrap": {
    "say": "• Robert Smith's insurer has already called John Doe, and he needs a car for work\n• Discuss what to tell him today, in what order\n• Cover: the do's and don'ts in plain words and the rental path\n• Log every step the same day; route anything legal to Atty. Thorne\n• What John says this week stays in the adjuster's notes for the life of the case",
    "ask": "What would you tell John Doe first, and why first?"
   },
   "lifemap": {
    "say": "• The whole of John Doe's file on one slide, in the order we work it this week\n• Across the top: the seven stages you carry on every file\n• Day 1 it's raw: the loss, the SOL docketed, the matter opened in the CMS\n• Then claims and care, the demand, liens and ADR, and litigation to the close\n• Each day picks the file up where the last one left it",
    "ask": "Which one date on this track would you protect first, and why?"
   },
   "coverage": {
    "say": "• Three layers pay in order: BI $10,000, Host UM $20,000, Relative UM $10,000\n• $40,000 is the cap, so the care and records must prove value through all three\n• Before any BI release: the UM consent to settle and the subrogation waiver\n• The Health Plan pays care now and recovers from the settlement, so plan the reduction early\n• The gap before treatment is the weak point: name it on Day 1, with its reason documented",
    "ask": "If the BI adjuster offered the full $10,000 tomorrow, what must be on the file before anyone says yes?"
   }
  },
  "2": {
   "agenda": {
    "say": "• Welcome back; today is the Day 2 deck: pre-demand, the BI demand and the BI settlement\n• Lessons: the pre-demand audit, the gap record and causation, the demand, negotiations, the UM/UIM safety check, the settlement documents\n• Part 2, the daily loop: the Case Profile, then one Skill Building: the Specials, wages and gap record, then the BI demand served\n• Then 📁 Backup File Maintenance, required: today's documents filed the firm's way; then update the Action Plan\n• Then 4 short skill activities in a 20-minute Practice Lab: every trainee works all 4\n• Knowledge Check: 70% opens Day 3"
   },
   "profile": {
    "say": "• Step 2 of the loop: John Doe's Case Profile, The Case So Far\n• Treatment is complete: MMI 06/12/2026, Specials $42,984.00, the gap still to be explained from his documents\n• Then straight into the Skill Building: the BI demand"
   },
   "lab": {
    "say": "• Practice Lab: 4 short skill activities, each one an assumption and one entry to log in the CMS\n• The gap call with John Doe, the strategy session with Atty. Thorne\n• The offer, the release\n• About 20 minutes: time for all 4, about five minutes each; then the Ready check"
   },
   "plan": {
    "say": "• Step 4: update the Action Plan: where the demand stands and the next deadline\n• A lighter touch today: the trainees write it, you spot-check two plans"
   },
   "wrap": {
    "say": "• 07/20/2026: Specials audited; Atty. Thorne approved a policy-limits demand to Keystone\n• Discuss what must be true before the Time-Limited Demand goes out\n• Cover: every record and bill included, numbers matching the audit, a clear reasonable deadline, proof of receipt, Atty. Thorne's sign-off\n• One missing page lets Keystone argue it never had a fair chance to settle\n• Next: the $40,000 gross meets the bills, and how it gets split",
    "ask": "What must be true before the Time-Limited Demand goes out to Keystone?"
   }
  },
  "3": {
   "agenda": {
    "say": "• Welcome back; today is the Day 3 deck: lien negotiation and disbursement\n• Lessons: the lien doctrines and prior-attorney liens, increasing the client's net, the Net Sheet, disbursement, final reconciliation\n• Part 2, the daily loop: the Case Profile, then one Skill Building, the final Net Sheet: liens, ledger, then the disbursement\n• Then 📁 Backup File Maintenance, required; then update the Action Plan\n• Then 4 short skill activities in a 26-minute Practice Lab: time for all 4\n• Knowledge Check: 70% opens Day 4"
   },
   "profile": {
    "say": "• Step 2 of the loop: John Doe's Case Profile, The Case So Far\n• Track A settled at $40,000 gross; the liens and the provider balance still to resolve\n• Then straight into the Skill Building: the final Net Sheet"
   },
   "lab": {
    "say": "• Practice Lab: 4 short skill activities, each one an assumption and one entry to log in the CMS\n• The two lien reductions, the prior-attorney lien, the BI-alone Net Sheet\n• About 26 minutes: time for all 4, about six minutes each; then the Ready check"
   },
   "plan": {
    "say": "• Step 4: update the Action Plan: each lien's status, the Net Sheet and the disbursement date\n• A lighter touch today: the trainees write it, you spot-check two plans"
   },
   "wrap": {
    "say": "• 10/21/2026: John Doe's check reads $20,359.92; he expected about $26,000\n• Discuss how you walk him through his Net Sheet, line by line\n• Cover: the 33⅓% fee, the $486.75 in costs, both liens after their reductions, the two streams\n• You explain the figures; the fee and any change to them are Atty. Thorne's call\n• Nothing leaves trust before the release is signed and the funds clear",
    "ask": "How do you walk John through his Net Sheet, and what is Atty. Thorne's call, not yours?"
   }
  },
  "4": {
   "agenda": {
    "say": "• Welcome back; today is the Day 4 deck: mediation and arbitration, on Track B, where the file doesn't settle\n• Lessons: the neutral, mediation logistics, the hearing and its UPL line, court rules and UM disputes, both binders\n• Part 2, the daily loop: the Case Profile, then one Skill Building, the Mediation Binder, its calendaring included\n• Then 📁 Backup File Maintenance, required; then update the Action Plan\n• Then 4 short skill activities in a 20-minute Practice Lab: every trainee works all 4\n• Knowledge Check: 70% opens Day 5"
   },
   "profile": {
    "say": "• Step 2 of the loop: John Doe's Case Profile, The Case So Far\n• Track B: the same file, where Keystone let the demand lapse; mediation and UM arbitration ahead\n• Then straight into the Skill Building: the Mediation Binder"
   },
   "lab": {
    "say": "• Practice Lab: 4 short skill activities, each one an assumption and one entry to log in the CMS\n• The impasse routes, the court cutoffs, the arbitration calendar, a bottleneck\n• About 20 minutes: time for all 4, about five minutes each; then the Ready check"
   },
   "plan": {
    "say": "• Step 4: update the Action Plan: the binder's exchange date and what Atty. Thorne still decides\n• The trainees work alone; spot-check that every item has an owner and a date"
   },
   "wrap": {
    "say": "• Track B: the mediation is set for 03/18/2027\n• Opposing counsel's paralegal calls to ask what number John Doe will take\n• Discuss what you may say and what goes to Atty. Thorne\n• Cover: no settlement position and no legal advice from you; log the call; route it the same day\n• Every binder exhibit indexed and numbered before the exchange",
    "ask": "What may you say to the paralegal, and what goes to Atty. Thorne the same day?"
   }
  },
  "5": {
   "agenda": {
    "say": "• Welcome back to the last day: Litigation and Dropped Cases on John Doe's file\n• Lessons, about 30 minutes: the litigation fork and filing, litigation tracking, trial prep, depositions, the award, Dropped Cases\n• Part 2, the daily loop: the Case Profile, then the Full Application Practice: about 150 minutes on the assigned companion case, graded on Days 1–4\n• Then 📁 Backup File Maintenance, required: the final backup audit; then close out the Action Plan\n• John's 3 other Skill Activities are extra practice, each a rehearsal of a companion case's own problem\n• Knowledge Check: 70% finishes the Case Flow"
   },
   "profile": {
    "say": "• Step 2 of the loop: John Doe's Case Profile, The Case So Far\n• Track B: the demand lapsed, suit filed 09/24/2026, discovery and the deposition ahead\n• Then straight into the Full Application Practice"
   },
   "lab": {
    "say": "• Practice Lab: 3 Skill Activities on John Doe's file in the CMS, extra practice today\n• Each rehearses a problem the companion cases raise: pleadings and discovery calendaring, deposition prep, skip-tracing and the certified notice\n• Point each trainee to the one that matches their own case's problem (the final backup audit is the required Backup File Maintenance)\n• Calendar everything each task starts; in litigation a missed date can end the claim"
   },
   "plan": {
    "say": "• Step 4: close out the Action Plan: the litigation handoff, what is still open, the sign-off\n• A few minutes, on their own"
   },
   "wrap": {
    "say": "• 01/05/2027: opposing counsel's paralegal says discovery responses are late; John Doe changed his number; deposition set 02/18/2027\n• Confirm the real discovery deadline on the calendar; tell Atty. Thorne today\n• Start outreach on every approved channel and log it; if John stays silent, begin the skip-trace steps\n• Protect the deposition date; more time, or what to tell the other side, is Atty. Thorne's call\n• Late discovery can cost the client evidence and money",
    "ask": "What do you do today, in what order, and what is Atty. Thorne's call, not yours?"
   },
   "build": {
    "say": "• Full Application Practice: the rest of the day, about 150 minutes, building the assigned companion case, worked like John Doe's file\n• Step 1, read the file; step 2, open it in the CMS, Conflict Check first on every party's full legal name\n• Step 3, the folder by the SOP: [Your Full Name] - [Case Name], nine subfolders, connected, intake documents uploaded\n• Step 4, the claims: every carrier in the stack, Letters of Representation, verification status, coverage matrix\n• Time is called at each step; each case has its own problem to find",
    "ask": "What is the first fact on your case to confirm, and where?"
   },
   "build2": {
    "say": "• Second half: steps 5 to 7\n• Step 5, plan the care: treatment map, 14-day rule and any gap, who pays first, whether an LOP is needed\n• LOP, Letter of Protection: the firm's written promise to pay a provider from the settlement\n• Step 6, the Case Notes entry for Atty. Thorne: decision first, then the deadline it hangs on\n• Step 7, check the work: every document in the CMS and case folder, CMS Case ID logged",
    "ask": "What decision does the note to Atty. Thorne lead with?"
   },
   "extra": {
    "say": "• Extra practice: John Doe's 3 other Day 5 Skill Activities, untimed (the final backup audit was the required Backup File Maintenance)\n• Today's practical was the companion case\n• Worth coming back to soon: the one that matches your own case's problem, calendaring, deposition prep or the skip-trace\n• Most rooms skip these: the skip button goes to the Ready check, then the Knowledge Check"
   }
  }
 }
};
