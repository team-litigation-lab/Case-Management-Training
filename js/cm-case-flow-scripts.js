/* The trainer's scripts: what the trainer says on each Case Flow slide (Presenter view's "Script — read aloud",
   and the day's Trainer Speaker Notes), assembled from build/case-flow/scripts/dN.json by
   build/case-flow/scripts/assemble.cjs. Written to build/case-flow/scripts/SCRIPTSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SCRIPTS = {
 "d1m1-role": {
  "theory": {
   "say": "• Three owners: the client owns the case, Atty. Thorne the judgment, the Case Manager the movement; the job shapes how well a case settles\n• Example split: deciding to settle is the attorney's; getting the MRI report into the file is yours; no legal advice, ever\n• Case Management: keeping the case moving from first call to final check, phase by phase\n• Three tests for every task: on time, documented in the file, everyone who needs to know is told\n• Case health analysis: reading the whole file for risk, not one task at a time\n• Spot weak points early, like a missed deadline, a silent client or a gap in treatment"
  },
  "frame": {
   "say": "• Six stages: intake and case opening, planning, documentation, communication, monitoring, billing and resolution\n• Intake includes the Conflict Check: making sure the firm doesn't already represent the other side\n• Planning: Case Manager drafts the Case Plan; Atty. Thorne sets strategy\n• Communication: update client, insurers and doctors, log every contact the same day; monitoring: every deadline calendared\n• Documentation is where cases most often stall; missing records delay the demand"
  },
  "rules": {
   "say": "• Case Manager owns deadlines, documents, insurers, doctors and client updates\n• Atty. Thorne owns every legal judgment: value, strength, strategy, whether to settle\n• Log every contact, document and deadline in the CMS the same day; if it isn't in the CMS, it didn't happen\n• Allowed: explain the process, confirm facts; never: tell a client the case value or whether to take an offer\n• Red flag: a note to Atty. Thorne headed \"Update\": the ask waits, the SOL, 02/06/2028, doesn't; rewrite it as the decision and its deadline",
   "ask": "A client asks whether to take the offer. What do you say?"
  },
  "model": {
   "say": "• Case lifecycle, eight stations: Intake, Claim Set-Up, Treatment, Pre-Demand, Demand, Settlement and Liens, Disbursement, Litigation\n• Liens: bills paid out of the settlement before the client gets their share\n• Litigation is dashed: the path only taken if the case doesn't settle\n• Navy band: Case Manager owns the movement; orange band: Atty. Thorne owns every legal judgment\n• The CMS sits under station one because the whole track runs on it"
  }
 },
 "d1m1-case": {
  "theory": {
   "say": "• Every new file raises the same questions: who was hurt, when, who is insured, for how much, what could go wrong\n• All week every lesson works one file, John Doe v. Robert Smith: know its facts cold; one detail changes how much money he can reach\n• Case Snapshot: the file's ID card with parties, date of loss, statute of limitations (the legal deadline to sue), client position and insurance\n• Facts of Loss: how, where and when, backed by the Police Report and witnesses\n• Critical Case Event: the one fact the defense builds on; spot it early for Atty. Thorne\n• Sources: intake sheet, supplement, Police Report; quote the document, never memory"
  },
  "frame": {
   "say": "• Answer the five intake questions from the documents, not from memory\n• Who: John Doe, client; Robert Smith, defendant (the person the claim is against); seating is in the Police Report\n• What: a collision; the Run Report (ambulance crew's report) shows what EMS found\n• When and where: 02/06/2026, about 7:10 a.m., all-way stop at Maple Hollow Rd and Birch Ave\n• How, and any ticket: Police Report"
  },
  "rules": {
   "say": "• Crash: 02/06/2026, about 7:10 a.m., all-way stop at Maple Hollow Rd and Birch Ave\n• Client: John Doe, 34, warehouse shift lead at Northgate Distribution; Atty. Elijah Thorne is Lead Counsel\n• Recovery Stack: every policy that could pay, in payment order; $40,000 across BI, Host UM, Relative UM\n• Where he sat decides which layers he reaches; trainees find it in the Police Report\n• Trainees also find the gap between the ambulance date and first doctor visit",
   "ask": "What are the three layers of the stack, in order?"
  },
  "model": {
   "say": "• Walk the file at a glance: John Doe v. Robert Smith, matter LSH-2026-MVA-770412\n• Scene: all-way stop at Maple Hollow Rd and Birch Ave\n• Stack bars: BI $10,000, Host UM $20,000, Relative UM $10,000 = $40,000\n• Orange strip: date of loss to first treatment; trainees work out its length\n• Missing on purpose: where he sat and who got the ticket; passenger status can open an extra layer"
  },
  "dodont": {
   "say": "• Do: trace every fact to its document, e.g. date of loss 02/06/2026 is on the Police Report\n• Do: say the stack in order: Keystone Mutual BI, Harbor Point Host UM, Cardinal State Mutual Relative UM, $40,000\n• Don't: repeat facts from memory alone\n• Don't: treat the gap as the client's fault; record the dates, 02/06/2026 to 02/20/2026, for Atty. Thorne\n• Red flag: any snapshot field with no document behind it isn't verified, even John's seat; name the document or mark it not yet verified",
   "ask": "Which document tells you where John Doe was sitting, and why does it matter?"
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
   "say": "• Intake is control of the file, not data entry; opened wrong it stays wrong: deadlines, demand letters and lien checks read from intake fields\n• Lien: a bill paid out of the settlement before the client gets money\n• Recovery Stack: every policy that can pay the claim, in the order it pays; find every layer at intake\n• Bodily Injury Liability (BI): the at-fault driver's coverage for injuries to others; pays first, a third-party claim\n• UM/UIM: coverage when the at-fault driver has no or not enough insurance; first-party, from the client's car or household\n• Exclusions and signed UM rejections can close a layer; record the exact document that did it"
  },
  "theory2": {
   "say": "• MedPay and PIP: medical coverage from the client's side that pays regardless of fault, early in the claim\n• Property Damage liability and collision cover cars only; neither joins the injury stack\n• Split limit, e.g. 25/50: first number caps each injured person, second caps the whole accident; read both\n• Declaration Page (Dec Page): the insurer's own statement of insureds, cars, coverage and limits; the only proof"
  },
  "frame": {
   "say": "• Raw file arrives from On the Records; read it end to end first\n• Check date of loss, parties and signatures against the Police Report, not the intake note\n• Run the Conflict Check on every full legal name; record date and result\n• Complete intake moves to acceptance; incomplete goes back; unsure if it qualifies goes to Atty. Thorne\n• Only then create the file in the CMS: six roles mapped, deadline calendared, documents named"
  },
  "rules": {
   "say": "• Gatekeeper: the raw file comes from On the Records; incomplete intake goes back\n• Conflict Check first, in CMS New Case: Robert Smith, host driver, resident relative; record date and result\n• SOL docket: date of loss 02/06/2026 matches the Police Report; two years gives 02/06/2028, a Sunday, so the hard date is Friday 02/04/2028\n• Filing cutoff 90 days earlier: Saturday 11/06/2027 moves back to Friday 11/05/2027; all four dates on the Calendar, day one\n• Check story, parties and signatures; never quietly fix a mismatch; all six roles in Parties, seating position, emergency contact\n• Retainer and HIPAA authorization logged in Documents, firm naming; insurance from the Dec Page; never case value"
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
   "say": "• Start the matter in New Case; run and record the Conflict Check on every party's full legal name first\n• Check the draft field by field against the documents: date of loss, names, roles, position, date of birth, report number\n• Fix each error and note its source; never fix silently\n• Calendar the 02/06/2028 deadline with reminders; map six roles; log retainer and HIPAA; file documents named the firm's way\n• Send Atty. Thorne a correction note in Case Notes"
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
   "say": "• On the Backup File Maintenance slide, press Link my Google Drive in step one; it only sees folders and files it creates\n• Build 01 Clients with Doe-John inside and its nine numbered folders, intake and retainer through litigation\n• Add the firm folders: administration, templates, closed files\n• Submit; read each graded problem as a firm rule; then run Check my drive\n• In Case Notes, place the signed retainer, Police Report and HIPAA authorization, with reasons"
  },
  "case": {
   "say": "• 02/09/2026, 4:30 p.m.: John Doe's matter is active in the CMS, nothing on the backup drive yet\n• Every file is built to one standard so a covering colleague finds any document in seconds\n• Four steps: link your Google Drive here in step one, build the folders by hand (graded), run Check my drive, file documents as they arrive\n• Standard: 01 Clients, client folder last name first, nine numbered folders intake to litigation, then firm folders"
  },
  "check": {
   "say": "• Drive linked with the one narrow permission\n• Every folder named and numbered exactly to the standard, nothing invented or renamed\n• Doe-John under 01 Clients with all nine folders in order; Check my drive shows nothing missing\n• Case Notes: retainer and HIPAA authorization in Intake and Retainer, Police Report in Police, Witness and Video",
   "ask": "If a folder goes missing next week, how will you know and what do you do?"
  }
 },
 "d1m1-kc": {
  "questions": {
   "say": "• Answer from John Doe's file, in your own words, typed under each question\n• Q1: the six stages in order, and what the Case Manager owns at Intake and Case Opening\n• Q2: John asks his case's worth and if waiting hurt it: exact words, who answers, what to record and route\n• Q3: what must happen before the matter is created in the CMS, on whose names, and why order matters"
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
   "say": "• A missed appointment: Step 1, internal review in the Case Summary first: status, deadlines, last contact, here 02/10\n• Step 2, the ladder: two calls at least, email and text, emergency contact, certified mail or formal letter; by channel, not volume\n• Here: calls 02/11, 02/13, 02/16; email and text 02/16; Margaret Doe that day, a message, never the case; second email 02/18\n• Log each attempt in the Communications Log: date, time, channel, outcome, follow-up reminder\n• Step 3, 02/20/2026: Atty. Thorne through Tasks, with the impact: SOL 02/06/2028 and any hearing dates\n• Tell the client what is needed and by when, never that the case is dropped; the log answers \"minor injuries\""
  },
  "model": {
   "say": "• Six stations: internal review, contact attempts, team notification in colour; Steps 4 to 6 greyed for the next lesson\n• Station two opens into the ladder: phone, email and text, emergency contact, certified mail\n• Each rung is wider: it reaches further and costs more; don't skip rungs or stay on one\n• Red card: the statute of limitations, the legal deadline to file suit, keeps running throughout"
  },
  "dodont": {
   "say": "• Do: set a follow-up reminder the moment each request goes out\n• Do: make answering easy; as a Northgate shift lead he can't take calls on the floor, so text or upload link\n• Don't: let a file sit unlogged while waiting on the client, or blame the client for a process gap\n• Strong: log every attempt and switch channel instead of a third call to the same phone\n• Red flag: voicemails of 02/11 and 02/13 never reached the Communications Log; an unlogged attempt didn't happen; log each now with date, time, channel, outcome",
   "ask": "Why does calling Margaret count as a new channel when a third call to John's mobile doesn't?"
  }
 },
 "d1m2-a1": {
  "task": {
   "say": "• Step 1 first: internal review in the CMS Case Summary, naming the live deadlines\n• Log the two missing voicemails, then carry the Step 2 ladder forward in the Communications Log\n• Every attempt: date, time, channel, outcome, next action and due date\n• Live call with Margaret Doe: confirm she's the emergency contact, ask John to call by a set date\n• Confirm his best number and address, share no case details; hand in Step 1, the log and a Step 3 call"
  },
  "case": {
   "say": "• 02/16/2026, file LSH-2026-MVA-770412: six days with no contact from John Doe\n• Last logged contact 02/10/2026; missed check-in call 02/13/2026; no treatment start recorded\n• Phone system shows two voicemails to his mobile, neither in the Communications Log\n• Emergency contact Margaret Doe, (555) 010-2291; Step 1 of the No Contact Protocol is due today\n• \"Called client, no answer\" fails: no time, no number, no next step"
  },
  "check": {
   "say": "• Step 1 done first: status, live deadlines, last contact reviewed\n• Both earlier voicemails logged; phone rung cleared with two attempts, then email and text, then Margaret\n• Every entry has date, time, channel, outcome, and a next action with due date\n• Step 3 impact names the SOL of 02/06/2028 and treatment not started; nothing threatens to drop the case\n• The missing treatment start is the seed of the 14-Day Gap",
   "ask": "If his mobile was called three times, how many channels were used?"
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
   "say": "• Draft the Step 4 letter in the Action Plan Editor on the warning letter template\n• List every attempt by date; deadline inside 7 to 14 days; withdrawal possible; exactly how to respond\n• Stay inside the UPL line: nothing on claim strength, what silence does legally, or dropping the case\n• Write what must be true before a skip-trace, and whose approval Step 5 needs\n• Hand in a ready-to-send letter, both deliveries logged, escalation recorded"
  },
  "case": {
   "say": "• 02/21/2026: eleven days with no word from John Doe and no known treatment\n• Phone rung cleared, emails and texts sent, Margaret Doe tried, all logged\n• Atty. Thorne wants the Final Warning Letter drafted for review Monday morning\n• Every attempt dated, a response date, how to reach the firm; certified mail and email\n• Withdrawal possible, not decided; nothing about his claim; urgent but not threatening"
  },
  "check": {
   "say": "• A real response date inside 7 to 14 days, not \"as soon as possible\"\n• Firm name, file reference, date of loss 02/06/2026, earlier attempts by date\n• Withdrawal possible, not decided; at least two ways to respond\n• Certified mail and email recorded, address confirmed; nothing on claim value or legal consequence\n• Skip-trace conditions written down; Step 5 noted as Atty. Thorne's",
   "ask": "Does the letter say what's needed and by when, without saying what happens to his case?"
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
   "say": "• Do: ask about barriers to care at every check-in; John Doe owns no car, so rides matter\n• Do: listen actively, for example when he worries about missed shifts at Northgate Distribution\n• Don't: explain why a Keystone Mutual Recorded Statement could hurt him; that is legal advice for Atty. Thorne\n• Don't: let a Property Damage call drift into questions about his injuries\n• Social media rule covers vacations and activities too\n• Red flag: Keystone's Dana Whitfield asked John to record his account (voicemail, 02/10/2026, 8:47 a.m.); written notice today, statements through the firm; Atty. Thorne's call",
   "ask": "Which of these rules is John Doe closest to breaking right now?"
  }
 },
 "d1m3-a1": {
  "task": {
   "say": "• First, email Dana Whitfield at Keystone, the other driver's adjuster: firm represents John Doe, no direct contact\n• Any Recorded Statement request, the insurer taping his version, comes through the firm; nothing about his injuries\n• Call John: ask about his neck and treatment; give next steps; have him repeat the instruction back\n• Coordinate his first visit with Riverton Urgent Care\n• Deliver the six-section Direction Packet; log every contact"
  },
  "case": {
   "say": "• John Doe's retainer is signed and matter open, but nothing from the firm has reached him yet\n• Voicemail dated 02/10/2026: Keystone asked to record his account; his neck is stiff; he hasn't seen anyone\n• Transcribe the voicemail word for word, not a summary\n• Then write the action plan in the order to work it today; both are graded against an answer key"
  },
  "check": {
   "say": "• Dana told in writing: firm represents him, no direct contact, statements through the firm, nothing about injuries\n• Call covered his neck, treatment status, next steps; he repeated the instruction back\n• Riverton Urgent Care knows he is coming and where records go\n• Packet has all six sections; Property Damage section names the Civic's owner; every contact logged\n• Atty. Thorne told today that Keystone contacted a represented client",
   "ask": "How will you know John Doe understood the instruction, not just heard it?"
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
   "say": "• Read the Police Report unit boxes first: who rode in which car, who owns which car\n• Index photos, Repair Estimate, supplements and the tow on John's file as evidence\n• Margaret's rental, Loss of Use, Diminished Value and repair negotiation: leave on her claim, refer\n• Keystone accepted PD liability on 02/17/2026: record the fact; its meaning is Atty. Thorne's\n• If a car call turns to John's neck, it stops and comes to us"
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
   "say": "• Turn each onboarding direction into a tracked task in CMS Tasks\n• Set owner, due date and verification method for every task\n• Find the card wrongly assigned to the client, reassign it to the firm, and record why\n• Schedule the follow-up that confirms treatment has started\n• Strong example: confirm first therapy visit, owner Case Manager, due in three days, verify by calling the clinic"
  },
  "case": {
   "say": "• Date: 02/11/2026, CMS notice on file LSH-2026-MVA-770412\n• John Doe's Direction Packet was delivered and logged on 02/10/2026\n• Its directions are now draft task cards to review before they go live\n• Task card: a to-do that needs an owner, a due date and a way to verify it\n• Gaps: no treatment start recorded, no follow-up on the calendar; one card has the wrong owner"
  },
  "check": {
   "say": "• Every direction has an owner, every task a due date and a verification method\n• Mis-assigned card reassigned to the firm, with the reason recorded\n• Treatment-start follow-up scheduled; nothing left undated\n• This follow-up is what catches a Treatment Gap early, which Day 2 picks up",
   "ask": "If his first appointment slipped, which task would tell you, and when?"
  }
 },
 "d1m3-a3": {
  "task": {
   "say": "• Read the Police Report's unit boxes before sorting anything\n• Sort each tray item into three lanes: John's injury evidence, coordinate for his care, or Margaret's Property Damage claim\n• Index evidence in CMS Documents; refer Margaret's and Leah Moran's questions to Atty. Thorne in Tasks\n• Set a follow-up for the rental's last day and take John's call\n• End the Case Note with one line: does Property Damage touch our case, and how"
  },
  "case": {
   "say": "• 02/11/2026: six Property Damage items wait in the tray\n• Leah Moran at Keystone asks who the Civic's claimant is, to set up a rental once liability is decided\n• Items: scene and damage photos, tow record, Police Report, Margaret's Loss of Use question, Margaret's request for a higher repair figure\n• John calls needing a ride to his first appointment, asking if the rental can be his"
  },
  "check": {
   "say": "• Who rode and who owns comes from the Police Report\n• Photos, tow record and Police Report indexed on John's file as evidence\n• Rental, Loss of Use and repair figure left on Margaret's claim and referred, no advice\n• Rental's last day set as a treatment risk with rides planned; John told kindly the rental isn't his\n• Case Note ends with the answer, not \"sorted\"",
   "ask": "If Margaret calls about her repair figure, what is yours to do and what isn't?"
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
   "say": "• Band 1: Case Snapshot and acceptance decision\n• Band 2: coverage, liability and projection\n• Band 3: Regulatory Triple-Check, held open until the Treatment Phase\n• Band 4: Three-Pillar Plan in Clinical, Functional and Financial columns\n• Band 5: Risks and Flags, red and largest, holding the 14-Day Treatment Gap; plan routed to Atty. Elijah Thorne"
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
   "say": "• Read records for red flags, warning signs, by specialty: physical therapy, surgery, medication, mental health\n• Listen on calls for yellow flags: life and mood problems blocking recovery, written in his words\n• Talk using OARS: open questions, affirmations, reflections, summaries\n• At the plateau, when progress and interest drop, bring him back to his own goal\n• Route it: medical danger to the doctor, legal to Atty. Thorne; then A-C-T: Assess, Coordinate, Track"
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
   "say": "• PIP: the client's own insurance paying Medical Bills regardless of fault, written state by state\n• Florida's Emergency Medical Condition (EMC) rule decides early whether PIP pays $2,500, $10,000, or no medical\n• John Doe's file is in Riverton: add-on PIP, no EMC rule, so Harbor Point's $5,000 PIP isn't capped\n• On a Florida file, the clock starts at the date of loss; the Case Manager calendars it\n• Had this file been in Florida, day 14 was 02/20/2026, his first treatment\n• Red flag: telling a Riverton client his PIP is capped over the 14 days; Riverton has no EMC rule"
  },
  "rules": {
   "say": "• Florida PIP, Fla. Stat. 627.736, always confirm the current statute: $10,000, paying 80% of reasonable medical and 60% of lost income\n• Initial care within 14 days or PIP pays no medical: calendar day 14 at intake; tell the client the deadline and where care is available\n• Full $10,000 only if an MD, DO, dentist, PA or APRN finds an EMC, else $2,500; chiropractors can't; log each provider's credential\n• EMC: going without care could seriously harm health; check the first record's date, provider and written EMC, request it if missing\n• Track the bucket in the PIP Log; a missing EMC or late first visit goes to Atty. Thorne that day",
   "ask": "A Florida client is first seen on day 14 by a PA. What does PIP pay?"
  }
 },
 "d1m4-a1": {
  "task": {
   "say": "• Flag the gap in two places: Risk Flags in the Case File and the Action Plan Editor's risks band\n• Use exact dates: 02/06/2026 to 02/20/2026, 14 days, not \"about two weeks\"\n• Set a watch for any later break in care\n• List likely causes to look into and the documents needed to explain the gap\n• Route the flag to Atty. Thorne"
  },
  "case": {
   "say": "• 03/13/2026 CMS notice: Riverton Urgent Care's 02/20/2026 note and Riverton Spine & Rehab visits since 02/24/2026 added\n• Compare with the crash date, 02/06/2026, and the EMS Run Report\n• First seen 14 days later: a Treatment Gap, meaning days an injured person got no care\n• Notice shows Risk Flags: none recorded; nobody has caught it\n• Days 3 to 5 depend on this flag being right"
  },
  "check": {
   "say": "• Gap reads 14 days, 02/06/2026 to 02/20/2026; watch set for the next break in care\n• Risks band holds facts only: dates, length, explanation still pending; impact on the claim is Atty. Thorne's call\n• Investigation steps listed: John Doe's own account, then work schedules, appointment records, documents\n• Flag routed to Atty. Thorne\n• A gap flagged and explained early hurts less than one the adjuster finds",
   "ask": "Did you set a watch for the next break in care, and where will it show?"
  }
 },
 "d1m4-l2": {
  "why": {
   "say": "• A plan in draft does nothing; it works only once Atty. Thorne reviews it and the file runs on the approved version\n• Routing turns your work into approved work; comments back are normal\n• Never leave a risk off the plan to avoid comments\n• A clean version history shows what the firm knew and when\n• Red flag: \"This will help the case\" in a treatment note, or a plan run before every comment is answered\n• Every note is discoverable; facts only, and nothing runs until Atty. Thorne approves the version"
  },
  "rules": {
   "say": "• The loop: draft, routed, returned with comment, approved, execute; the file runs on the approved version only\n• Draft all five bands in the section templates, risks with source and date, each task's owner and date in their own fields\n• Route in the Action Plan Editor before anything speaks for the firm outside; the CMS stamps the time\n• Returned: answer every comment under Revisions and re-route; never run a half-fixed plan; record the approval and its date\n• A big fact changes: never type over the approved plan; mark it superseded under Version, route a new one\n• Notes factual; legal strategy only in the legal track; legal questions to Atty. Thorne",
   "ask": "A fact changes after approval: what is the first step?"
  }
 },
 "d1m4-a2": {
  "task": {
   "say": "• Draft the Case Plan for John Doe v. Robert Smith in the Action Plan Editor, all five bands\n• Acceptance decision and reason; coverage stack in payment order; liability, meaning who's at fault; early projection\n• Triple-check on privacy, Medicare and who pays first, held open until the Treatment Phase\n• Clinical, Functional and Financial pillars with measurable goals; every task has an owner and date\n• Risks band leads with the 14-day gap; docket the filing window, then route"
  },
  "case": {
   "say": "• This activity is the gate out of Claim Set Up\n• In the file: parties mapped, $40,000 stack verified, onboarding packet tracked, 14-day Treatment Gap flagged\n• Stack: the layers of insurance that pay this claim, in order\n• On 03/16/2026 Atty. Thorne asks for the full five-band Case Plan by end of day\n• Goal: a plan he can act on without asking a single question"
  },
  "check": {
   "say": "• Snapshot: date of loss 02/06/2026, statute of limitations 02/06/2028, client a passenger\n• Coverage $10,000, $20,000, $10,000, total $40,000, in order: BI, Host UM, Relative UM\n• Projection and liability preliminary until coverage, Police Report and driver statements confirm\n• Triple-check held open; every task owned and dated; gap up front; plan routed with timestamp\n• Gate: LORs logged, stack verified, gap flagged, plan routed, or Treatment Phase doesn't start",
   "ask": "What question could Atty. Thorne still have after reading your plan?"
  }
 },
 "d1m4-kc": {
  "questions": {
   "say": "• Knowledge Check for Claim Set Up; answer from the file in own words under each question\n• Question 1: the Case Plan's five bands and contents, including Clinical, Functional and Financial pillars\n• Question 2: why a bad fact buried in the plan hasn't really been disclosed to Atty. Thorne\n• Question 3: John Doe's coverage as the plan states it: layers, limits, total, paying order, projection status"
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
   "say": "• Build the Policy Stack for John Doe v. Robert Smith in the CMS Insurance tab\n• Enter three layers in paying order: insurer, policy number, claim number, limit, adjuster; mark first- or third-party\n• Comments: insurer's real name, driver if different from owner, adjuster details or \"none assigned yet\"\n• Check the total, record pursuit order, mark projection preliminary: a forecast until limits confirmed in writing\n• Not three equal claims: UM owes nothing until BI is used up"
  },
  "case": {
   "say": "• Morning of 02/17/2026; letters not sent yet\n• Keystone Mutual BI, Harbor Point Host UM, Cardinal State Relative UM gave limits on 02/16 and 02/17 set-up calls\n• Nothing confirmed in writing; Cardinal State has no adjuster yet; Keystone wants signed authorizations first\n• Insurance tab is empty; letters can't pull details until it's filled\n• BI pays first; Host UM opens only once BI is used up"
  },
  "check": {
   "say": "• All three layers: $10,000, $20,000, $10,000, total $40,000\n• Order recorded: BI, then Host UM, then Relative UM; BI third-party, both UM layers first-party\n• Policy and claim numbers for every layer; Relative UM adjuster \"No adjuster assigned yet\", not blank\n• Source of each limit noted: set-up call now, Declaration Page requested in the LOR; projection preliminary\n• Never quote a likely limit to the client",
   "ask": "If your total isn't $40,000, how would you find the wrong layer?"
  }
 },
 "d2m1-a1": {
  "task": {
   "say": "• Generate the full letter set on the firm template in CMS Documents, under Outgoing\n• LORs: Keystone BI with PD carve-out, Harbor Point Host UM and PIP, Cardinal State Relative UM; notices to Bluewater, Peach State\n• Each: Attn line, insured, claim/policy/member number, date of loss; request limits, Dec Pages, other coverage, preservation\n• Route to Atty. Thorne for signature, send by preferred method from the Email Workspace, calendar acknowledgement checks\n• Keystone gets only what it needs; no UM letter asks for money"
  },
  "case": {
   "say": "• 02/17/2026: Atty. Thorne wants letters of representation (LORs) out today\n• Keystone BI, KM-26-440871, Dana Whitfield; Keystone PD, Leah Moran, who accepted PD liability this morning\n• Harbor Point, HP-26-7741, Marcus Bell, Host UM and PIP; Cardinal State, CS-26-20355, no adjuster yet\n• Three LORs plus notices to Bluewater and Peach State, for signature today; delivery methods in the Communications Log"
  },
  "check": {
   "say": "• Five letters: LORs to Keystone, Harbor Point, Cardinal State; notices to Bluewater and Peach State\n• Attn: Dana Whitfield, Marcus Bell, \"Attn: Claims Department\" for Cardinal State\n• Insured: Robert Smith, Kevin Alvarez, Margaret Doe, and Margaret Doe on Bluewater; Peach State shows PSH-55017742 and GRP-41208\n• Keystone: John Doe's name only, carve-out limited to the Civic, 5 business days to inspect; Bluewater asks for the 03/14/2024 rejection form\n• All signed by Atty. Thorne, sent 02/17/2026, follow-up 02/20/2026",
   "ask": "Whose name goes in the insured line on the Harbor Point and Cardinal State letters, and why?"
  }
 },
 "d2m1-l2": {
  "theory": {
   "say": "• An unverified coverage fact is a guess; statuses: reported (02/16, 02/17/2026), noticed (02/17), acknowledged (03/03), disclosed, confirmed in writing (03/20); only the last is proof\n• A phone figure is not proof: both UM carriers confirmed in writing by 03/09/2026; Keystone's Dec Page arrived 03/20/2026\n• Coverage verification: turning \"someone told me\" into a document for every limit, form and exclusion\n• Coverage Matrix: one row per insurer, the file's single coverage record, with status, source and date\n• Dec Page: the policy's own summary of who and what it covers, and for how much\n• Limits: per person caps one injured person, per accident caps everyone, combined single is one number"
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
   "say": "• Smith swears no other insurance, a condition of settling at the limit: request it through Keystone, docket it; sworn 08/10/2026\n• John swears residency and no owned vehicle only if a carrier asks, on Atty. Thorne's reviewed draft\n• Records requests include the custodian's affidavit, so bills enter evidence without calling each provider\n• Northgate's wage letter proves $1,584.00; affidavit of service filed 10/16/2026; file each where it's used: demand conditions, UM packages, trial binder\n• Jurat check: affiant as named, LSH-2026-MVA-770412 and claim number, dates and figures, signature, jurat and seal; defects routed with a task\n• Red flag: unsigned or un-notarized is only say-so; back it goes; never sign, notarize or reword it",
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
   "say": "• First line, and the subject line: the decision and its deadline\n• Example: decision needed by 03/12/2026, approve declining Summit Imaging's LOP; the MRI goes to Harbor Point PIP\n• Why: PIP applies first, $3,675.00 left; then sourced facts, then options\n• If yes, send the decline and route the bill today; if no, draft the LOP for his signature\n• One decision per note; log the note and his answer in the CMS the same day",
   "ask": "A note holds two decisions with different deadlines. How should it be sent?"
  }
 },
 "d2m1-a2": {
  "task": {
   "say": "• Audit the matrix against CMS Documents; fix each error and cite the document and date\n• Restore the $40,000 total, clear overdue follow-ups, leave correct rows alone\n• Call Dana Whitfield at Keystone: confirm the request and authorizations, get a Declaration Page date in writing\n• Share no treatment details or demand figure; log the call, next follow-up by 03/13/2026\n• Send Atty. Thorne a three-line note: confirmed in writing, still preliminary, escalated"
  },
  "case": {
   "say": "• Date 03/11/2026: CMS flagged a colleague's Coverage Matrix for John Doe\n• Keystone BI Declaration Page follow-up was due 03/05/2026, nothing logged\n• Matrix total reads $45,000; the Case Plan says $40,000\n• New documents: Harbor Point letter 03/02/2026, Cardinal State adjuster 03/03/2026, Cardinal State Coverage Letter 03/09/2026\n• Summit Imaging's Letter of Protection request was declined because PIP pays first"
  },
  "check": {
   "say": "• BI stays preliminary; Keystone's Declaration Page doesn't arrive until 03/20/2026\n• Overdue 03/05/2026 follow-up: Dana Whitfield called 03/11/2026, logged, next by 03/13/2026\n• Host UM is add-on per Harbor Point's 03/02/2026 letter; Teresa Okafor replaces not yet assigned\n• PIP out of the stack, total $40,000; chase Bluewater's signed rejection form from 03/14/2024\n• Keystone PD stays outside the stack, preliminary; every fix cites a document",
   "ask": "Does your audit note tell Atty. Thorne what he must decide?"
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
   "say": "• Skill Scale: rate each skill 1 to 5 and submit for review\n• Self-ratings are compared with scores; a 5 beside a wrong $45,000 stack means coaching\n• The legal line is a gate: signing for the attorney or giving coverage opinions fails regardless of score\n• An honest rating helps more than a hopeful one",
   "ask": "Besides coverage, what on this file could make every insurer offer less?"
  }
 },
 "d2m1-cov": {
  "theory": {
   "say": "• No such thing as full coverage: every policy pays a different thing; ask whose it is and what it pays\n• Two separate questions: who pays the bills now, who pays the claim later\n• Payer-First Principle: each bill goes to the payer that must pay it first, or it returns as a lien on John Doe's settlement\n• Third-party coverage is the at-fault driver's, Robert Smith's; first-party is the client's side, and UM follows the person: John Doe has no car policy\n• Recovery Stack: only coverage that pays the claim: BI (bodily injury on the at-fault driver), then UM/UIM\n• MedPay and PIP: no-fault medical coverage paying accident bills fast, regardless of fault"
  },
  "theory2": {
   "say": "• Set-off and non-duplication: some policies subtract what PIP or MedPay paid; verify in writing\n• Subrogation: a payer's right to be repaid from the settlement\n• Contract rate and write-off: in-network providers accept the Health Plan's price, so the lien is smaller\n• Medicare Secondary Payer: Medicare pays last, is repaid by law, case reported to the BCRC\n• Bill first the payer with no right to be repaid\n• Claim numbers: Keystone KM-26-440871, Harbor Point HP-26-7741, Cardinal State CS-26-20355"
  },
  "frame": {
   "say": "• BI liability: at-fault driver's, third-party, pays the injury claim\n• UM/UIM: client's side, through vehicle or household, pays when BI is too small; consent rules apply\n• PIP: from the vehicle the client rode in, pays Medical Bills without proving fault; verify repayment terms in writing\n• Health insurance: client's plan, contract rate, right to be repaid\n• Medicare and Medicaid: last, repaid by law, BCRC report"
  },
  "rules": {
   "say": "• By whose: Keystone BI and PD are Robert Smith's; Host UM, Relative UM, PIP John's side; Peach State his Health Plan\n• The stack, in order: Keystone BI $10,000, exhausted first; Harbor Point Host UM $20,000, Kevin Alvarez's Escape, add-on; Cardinal State Relative UM $10,000, Margaret Doe's\n• Outside the $40,000: Harbor Point PIP $5,000 for bills; Keystone PD $25,000; Bluewater collision\n• Each claim opened: list coverage, carrier and what it pays in the Insurance tab; once confirmed, on the Coverage Matrix: stack, bill order, or neither\n• Who to bill: PIP Log; PIP (no repayment right, confirmed 03/02/2026), Peach State, then an LOP Atty. Thorne approves\n• Post each payment on its ledger"
  },
  "model": {
   "say": "• Navy, third-party: Keystone BI $10,000, Keystone PD $25,000\n• Orange, first-party: Harbor Point Host UM $20,000, Cardinal State Relative UM $10,000, Harbor Point PIP $5,000, Bluewater collision\n• Green: Peach State Health Plan; grey, crossed out: Bluewater UM, rejected 03/14/2024\n• Only the three claim cards form the $40,000 stack; PD's $25,000 is not in it\n• Bill order staircase: MedPay or PIP, Health Plan, Letter of Protection"
  },
  "dodont": {
   "say": "• Do: verify every coverage with a dated Declaration Page; confirm Peach State was active (began 02/01/2026)\n• Do: keep the Payer Order and the Recovery Stack separate\n• Don't: send an LOP where PIP pays; PIP paid Summit Imaging's $2,395.00 with nothing to repay\n• Don't: assume PIP or UM on the client's own policy; Margaret rejected Bluewater UM 03/14/2024\n• Red flag: a stack that adds up to $45,000 means PIP slipped in; never add PIP, PD or collision: PIP pays bills, not the claim\n• The stack is BI $10,000, Host UM $20,000 and Relative UM $10,000: $40,000, every time",
   "ask": "How does John Doe reach $30,000 of UM without an auto policy of his own?"
  }
 },
 "d2m2-l1": {
  "why": {
   "say": "• PIP: coverage on the car he rode in that pays Medical Bills regardless of fault\n• Harbor Point paid $685.00, $640.00, $2,395.00, then $640.00 for 03/27/2026, of $5,000; $640.00 left\n• Payers in line: Harbor Point PIP, Peach State Health Plan, then a Letter of Protection\n• Wrong order turns a payable bill into a lien: a debt paid from John Doe's settlement\n• Red flag: at the LOP desk, a provider wants your word they'll be paid in full at settlement; you can't give it\n• No amount, no reduction, no date: the LOP's terms are Atty. Thorne's"
  },
  "rules": {
   "say": "• Order: Harbor Point PIP, Peach State, then LOP; John claims PIP as a passenger in Kevin Alvarez's 2020 Ford Escape\n• No policy in his household carries PIP; PIP pays in date order\n• Crescent's 05/15/2026 injection went to Peach State with $640.00 PIP left; track both ledgers, never re-route a paid claim\n• Riverton got an LOP as out of network; Summit's 03/11/2026 request was declined and its MRI went to PIP\n• LOP terms are Atty. Thorne's; never promise a provider an amount, reduction or date"
  }
 },
 "d2m2-eob": {
  "theory": {
   "say": "• EOB, Explanation of Benefits: the Health Plan's account of one processed claim, proof of who paid what; not a bill\n• Each payer reports back: Peach State by EOB, Harbor Point by its PIP payment history; read every report before touching a lien\n• RS26, Peach State's EOB: John Doe owes Crescent $0.00 for the injection\n• Line by line, the proof behind demand and lien numbers: billed is the provider's charge, allowed the plan's contract amount, the in-network difference written off\n• Remark codes explain each line: CO-45 is the write-off, AC1 flags a possible accident\n• Member responsibility, deductible, copay, coinsurance: the most an in-network provider may bill the patient"
  },
  "theory2": {
   "say": "• Balance billing: billing the patient for the written-off part; in network it's an error, not a lien or debt\n• PIP payment history: every check, with date of service, amount paid, limit remaining\n• Exhaustion: once the limit is spent, later bills return unpaid and go to the next payer\n• Reconciliation: match every provider balance to each payer's EOB or check, so no paid bill becomes a lien\n• Red flag: a lien logged at the billed amount, or a bill sent to PIP after 06/26/2026; log what the plan paid"
  },
  "frame": {
   "say": "• Match the claim: member ID, claim number, provider, date of service against the CMS treatment record\n• Billed to allowed: charge, allowed amount, write-off; then the patient's share\n• What the plan paid, with date and check or electronic payment number; any payback claim starts there\n• Remark codes: CO-45 explains the write-off; AC1 flags an accident and the plan's payback right\n• Reconcile against the provider's statement and lien register, flag balance billing; the step most often skipped"
  },
  "rules": {
   "say": "• Peach State EOB 06/03/2026, claim PS-2605-449021: Crescent's 05/15/2026 epidural injection, a pain shot near the spine\n• Billed $3,400.00, allowed $1,860.00, $1,540.00 written off, paid $1,860.00, member responsibility $0.00\n• Crescent's 07/01/2026 statement asks John for $1,540.00: a balance bill; document it, route to Atty. Thorne that day\n• Draft a correction request and tell John what's happening; whether he owes anything is counsel's call\n• Peach State's claim starts at $1,860.00; Harbor Point's five checks total $5,000.00, exhausted 06/26/2026"
  },
  "model": {
   "say": "• Left: Peach State EOB, claim PS-2605-449021, stamped THIS IS NOT A BILL\n• Rows: billed $3,400.00, allowed $1,860.00, adjustment $1,540.00, deductible $0.00, paid $1,860.00, member responsibility $0.00\n• Right: Harbor Point's five checks, limit falling from $5,000.00 to nothing, exhausted 06/26/2026\n• Below: Crescent's 07/01/2026 statement for $1,540.00, linked to the $0.00 row; the EOB beats the statement"
  }
 },
 "d2m2-a1": {
  "task": {
   "say": "• Run the Payer Order first on each date\n• 02/23/2026: prepare Riverton's LOP on the approved template, route to Atty. Thorne to sign, send with the HIPAA authorization\n• Live call with Tammy Greer: confirm the LOP is accepted, secure the evaluation, answer with facts only\n• Write the call up as a case note, open follow-up tasks, file in the CMS\n• 03/11/2026: decline Summit in writing, naming Harbor Point PIP, proved from the PIP Log; promise no payment"
  },
  "case": {
   "say": "• 02/23/2026: Tammy Greer, Office Manager at Riverton Spine & Rehab, emails ahead of the 02/24 evaluation\n• Out of network with Peach State; wants a signed LOP and HIPAA authorization (records-sharing form) today\n• First treatment: Riverton Urgent Care 02/20/2026, $685.00, paid by Harbor Point PIP; Atty. Thorne approved the LOP template\n• Baseline: three 2021 chiropractic visits for low-back stiffness\n• 03/11/2026: Summit Imaging, booked for the neck MRI Dr. Reyes ordered 03/05/2026, also asks for an LOP"
  },
  "check": {
   "say": "• LOP signed by John Doe and Atty. Thorne 02/23/2026, before the 02/24 visit; nothing signed by the Case Manager\n• Baseline shows the 2021 visits were low back, resolved, a different region\n• Rental end 03/19/2026 calendared as a treatment risk\n• Summit decline names PIP with $3,675.00 left, enough for the $2,395.00 MRI; Tammy Greer call logged, nothing promised",
   "ask": "When a provider asks whether they'll be paid in full, what is the answer?"
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
   "say": "• Last resort: check health insurance, MedPay and PIP first, and record why none works\n• Signed before the first visit and filed; Riverton's was signed 02/23/2026\n• Request the itemized ledger every 30 days and update the Liens tab\n• John asks where to go: give options with facts, book his pick, log his choice in his words"
  }
 },
 "d2m2-cost": {
  "why": {
   "say": "• After the rental ends, John Doe still has therapy three times a week, plus rides, prescriptions, maybe a brace\n• None of it is on a provider's bill, but every dollar is a cost of the crash\n• Recoverable only if written down when it happened; the Case Manager keeps the log\n• Red flag: \"You'll get every penny back\" sounds like comfort but promises a result\n• What the demand claims, and at what rate, is Atty. Thorne's; log each receipt with who paid it"
  },
  "rules": {
   "say": "• Out-of-pocket costs are Specials; each needs a receipt or log entry\n• Start the trip log at the first visit; the rate is confirmed by Atty. Thorne\n• A rental the carrier didn't pay is the owner's cost: keep the receipt, send it with the PD claim\n• When the rental ends, plan rides before a visit is missed; check payers so nothing is claimed twice\n• Enter costs the day receipts arrive, total and route before the demand; never promise repayment"
  }
 },
 "d2m2-l2": {
  "map": {
   "say": "• Check in on visits, pain, function and barriers: anything stopping him getting to care\n• Name the variance: clinical (medical), psychosocial (life or mood), or systemic (the system stuck)\n• Assess: medical danger to the provider, legal danger to Atty. Thorne; Coordinate: clarify and remove the barrier\n• Track: every fix in a GIRP note, Goal, Intervention, Response, Plan; facts only\n• On his file: week-6 measures due 04/07/2026; missed visits from 04/03 classified psychosocial; No Contact Protocol 04/08 to 04/17\n• 04/20, with consent: Dr. Reyes by telephone, evening LOP slots; 04/21: GIRP note, attendance 04/21 and 04/23"
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
   "say": "• PIP is spent only once; Harbor Point's $5,000 paid five bills his settlement never repays\n• The five: urgent care $685.00, 02/20/2026; Lakeside $640.00 on 03/05, 03/27 and 06/12; Summit MRI $2,395.00, 03/13; exhausted 06/26/2026\n• Where it landed decided what was left for Peach State, the LOP and his net take-home\n• The bills used the whole limit first, so the $1,267.20 wage benefit was never paid\n• Red flag: a PIP-paid bill counted as unpaid, or the injury sized up from PIP's $5,000\n• Severity comes from the audited Specials, $14,817.40 medical; PIP sits on the tracker as a payment source"
  },
  "rules": {
   "say": "• PIP does most good on fixed costs: ER, imaging, specialists; LOP providers reduce more readily\n• Here it paid them; chiropractic and therapy ran under the LOP\n• PIP check clears: post it in the PIP Log with what's left, what's coming, the wage claim; that forecast shows the empty date\n• Bill could go PIP or LOP: email Atty. Thorne both routes with figures, log his decision; never re-route a paid claim\n• EMC states cap PIP without a doctor's EMC finding: check the first records, never request it; if missing, Atty. Thorne that day\n• Set-off credits the defendant for PIP paid; Riverton is add-on, so PIP doesn't reduce BI or UM",
   "ask": "What is recorded first when a PIP check clears, and why?"
  }
 },
 "d2m2-a2": {
  "task": {
   "say": "• Step 1 review first, then notices by channel: call and text 04/08, call and email 04/09, Margaret 04/10\n• Escalate to Atty. Thorne; 10-day Final Warning Letter by certified mail and email, response date 04/20/2026; set Drop Warning\n• 04/17 call: trauma-informed interview; safety first, his pace, his choices, his words\n• No diagnosis, no counselor referral, nothing on the claim; with consent, arrange Dr. Reyes and evening LOP visits\n• Restore the file and confirm 04/21 and 04/23"
  },
  "case": {
   "say": "• 04/08/2026 alert from Riverton Spine & Rehab, LOP account RSR-26-0412: John Doe missed 04/03 and 04/07, no call\n• Last visit 04/02/2026; not answering the clinic; last firm contact a 03/31 check-in\n• Then: misses 04/09 and 04/14; Margaret says on 04/10 he's safe but keeping to himself\n• 04/16: the CMS 14-day no-visit trigger fires; 04/17: John calls in"
  },
  "check": {
   "say": "• Step 1 dated 04/08/2026 before outreach; notices 04/08, 04/09, Margaret 04/10, each with date, time, channel, outcome\n• Letter by certified mail and email, response date 04/20/2026, withdrawal possible not decided, nothing on the claim\n• Interview quotes his words on the 04/02 panic at the corner, his sleep and mood; no labels\n• 04/20: Drop Warning cleared, 14-day trigger reset, Action Plan updated; four missed visits, 19 days; attended 04/21, 04/23",
   "ask": "Which word in a note would do the defense's work on these 19 days?"
  }
 },
 "d2m2-a3": {
  "task": {
   "say": "• Call John back and listen; where he goes, among options his doctors find appropriate, is his choice\n• What care he gets is Dr. Reyes's and the provider's call; no medical advice\n• Verify Crescent's network status with Peach State directly\n• With Janelle Brooks, Lakeside's referral coordinator, send the referral to Crescent Pain & Spine; book with John on the line\n• Every follow-up task done or delegated, with an owner and due date"
  },
  "case": {
   "say": "• 04/22/2026, 12:18 p.m. voicemail from John Doe; care restarted at Riverton Spine & Rehab, evenings, Margaret driving\n• The Civic is still in the shop\n• Lakeside booked Dr. Reyes's 03/27/2026 injection referral at Millbrook Interventional Pain Center for 05/14/2026\n• John won't go: too far, no ride, and a coworker said it's out of network with Peach State\n• He still wants the injection somewhere reachable; rumors aren't records"
  },
  "check": {
   "say": "• Call returned 04/22/2026; his reasons recorded in his own words\n• Verified with Peach State: Crescent Pain & Spine, Dr. Omar Haddad, in network for member PSH-55017742\n• 05/15/2026 booked, a day after the Millbrook slot it replaces; evening therapy continues, so no new gap\n• Millbrook slot cancelled; reminder call 05/13/2026, attendance check 05/18/2026; every task dated or owned\n• No advice: saying one place gives better care fails",
   "ask": "If Crescent's first opening were weeks away, who should be told, and asked what?"
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
   "say": "• Three money questions at once: who pays each bill now, who wants repayment, what to flag in the CMS today\n• A lien found at disbursement or an unrecorded gap is how a good file loses money; flag it the day it's known\n• Sort each coverage twice: whose it is, what it pays; only BI, Host UM and Relative UM make the $40,000 stack\n• Payer-First Principle: Harbor Point PIP, then Peach State, then an LOP last\n• Health subrogation: the plan claims back only what it paid for the collision's care; Peach State asserted $3,618.00 on 06/10/2026, confirmed $1,860.00 in writing 06/24/2026\n• Two CMS flags, facts only, routed to Atty. Thorne"
  },
  "rules": {
   "say": "• Only BI and UM stack, $40,000; PIP and PD sit outside; bills go PIP, then Peach State, then an LOP\n• Lien flagged in CMS Liens on first notice, Peach State's letter of 02/27/2026, always before any demand draft\n• Gap flagged the day records show it: 02/06/2026 to 02/20/2026, 14 days, facts only, routed, watched\n• Neither flag is a judgment; enforceability and effect on value are Atty. Thorne's\n• Red flag: a CMS flag that says what the gap does to the claim is a legal conclusion in a discoverable record\n• Flags hold facts only: dates, counts, and \"explanation pending\""
  }
 },
 "d1m1-a2": {
  "task": {
   "say": "• 03/12/2026: register and flag Peach State's claim in CMS Liens\n• Record carrier, member ID, group number, Payer Order position, asserted basis, flag date and Triple-Check results\n• Reply to Dion Carver in the Email Workspace, requesting an itemized ledger once anything is paid\n• 06/10/2026: audit the ledger line by line, dispute, get the corrected balance in writing, file in the CMS and Backup Drive"
  },
  "case": {
   "say": "• 03/12/2026: Dion Carver at Peach State Health Plan writes about member PSH-55017742, recovery file SRU-26-03318\n• The plan is processing accident claims after the 02/27/2026 notice and will seek reimbursement; no lien record exists yet\n• 06/10/2026: interim itemization asserts $3,618.00 across five claim lines\n• Whatever figure is accepted now carries into the demand and Net Sheet; audit it, don't accept it"
  },
  "audit": {
   "say": "• Recovery vendors pull every claim from the coverage date, related or not\n• Unrelated: 02/03/2026 eye exam before the crash, 03/18/2026 sinus infection, 05/06/2026 allergy visit for an existing condition\n• Crescent injection: plan paid $1,860.00 but claims the billed $3,400.00\n• Summit MRI at $0.00 is fine, PIP paid it; the full-repayment demand goes to Atty. Thorne",
   "ask": "Which number on the Crescent line may the Health Plan claim, and why?"
  },
  "check": {
   "say": "• Peach State entered with PSH-55017742 and GRP-41208\n• Position: after PIP/MedPay, before LOP and provider liens\n• Three unrelated lines disputed; Crescent at the $1,860.00 the plan paid\n• Flag dated before any demand; $1,860.00 confirmed in writing 06/24/2026; any compromise is Atty. Thorne's\n• Registering a lien is not conceding it"
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
   "say": "• Recorded call with AI John Doe in the Call Simulator: why first treatment came 02/20/2026, 14 days after\n• Open on the record: date, who's on, role, consent to record, privacy\n• Ask open, follow his words, yes-or-no only to pin dates and documents; four reasons to draw out\n• Find who he told and what he kept; read his account back; confirm the 03/05 consult and rides after 03/19\n• Hand in a privileged GIRP note in Case Notes with a dated task per document"
  },
  "case": {
   "say": "• 03/04/2026: Riverton Urgent Care's 02/20/2026 note: onset at the MVA 02/06/2026, worsening, right-hand numbness since 02/18\n• The EMS Run Report records neck stiffness on 02/06/2026\n• At Riverton Spine & Rehab since 02/24/2026; Margaret's rental runs to 03/19/2026\n• Nobody has asked why he waited 14 days; Atty. Thorne wants a recorded call today, then a GIRP note\n• Fails: a leading question, a suggested reason, or any \"won't matter\" or \"will hurt the case\""
  },
  "model": {
   "say": "• Left: simulator screen, AI John Doe, recorded call 03/04/2026, transcript below\n• Meter counts questions: open, closed, leading; leading stays at zero\n• Right: four reason slots, each with a document space, filled only as reasons surface\n• Warning: a suggested reason earns a yes, not a fact; target four reasons, four documents"
  },
  "check": {
   "say": "• Opened 03/04/2026 with participants, role, spoken consent, privacy; first question open, zero leading\n• One: no transport; Civic towed, Kevin Alvarez's Escape in the shop, no rental until 02/18/2026\n• Two: thought it was soreness, ibuprofen and lidocaine patches; three: doubted Peach State coverage, didn't know PIP existed\n• Four: numbness from 02/18; worked two shifts, then urgent care on his first day off\n• Texts, Northgate call-outs and receipt surfaced; GIRP note quotes his words, dated plan, labelled privileged",
   "ask": "Does the GIRP note record an intervention and a plan, or only how John Doe felt?"
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
   "say": "• Build the Gap Explanation Record in the CMS Case File\n• Exact dates: 14-day gap 02/06 to 02/20/2026; 19-day disruption 04/02 to 04/21/2026\n• Each reason beside its dated document; no independent document means \"account only,\" his word alone\n• Cite complaints before and after each, and the firm's follow-up; no argument, valuation or privileged call content\n• Defense-eye pass, then route to Atty. Thorne through Tasks"
  },
  "case": {
   "say": "• 06/22/2026: MMI reached 06/12/2026; Dr. Alana Reyes's Causation Letter of 06/19/2026 is in\n• Delayed presentation is clinically consistent with a disc injury whose nerve symptoms build over days to weeks\n• Injury more likely than not caused by the collision: a late start to treatment makes medical sense here\n• Atty. Thorne wants the Gap Explanation Record before the pre-demand session; a second gap runs 04/02 to 04/21/2026\n• Adjuster arguments, not serious, recovered early, unnecessary, another cause: answer each with a document"
  },
  "model": {
   "say": "• One CMS card, Gap Explanation Record, John Doe, in two equal bands\n• Top: 14-day gap 02/06 to 02/20/2026; bottom: 19-day disruption 04/02 to 04/21/2026, anxiety after the crash\n• Columns: reason, corroborating document, date; grey \"account only\" tag where only his word stands\n• Route-to-Atty. Thorne control in the corner; the second interruption gets equal room on purpose"
  },
  "check": {
   "say": "• 14-day gap 02/06 to 02/20/2026; 19-day disruption 04/02 to 04/21/2026, missed 04/03, 04/07, 04/09, 04/14\n• No February transport: tow record, Keystone's rental from 02/18/2026; expected it to pass: 02/07/2026 Riverton Drug receipt\n• April: crash anxiety after the 04/02 panic; Dr. Reyes's 04/20 note, counselor's 06/10 summary; his statement account only\n• Rental and carpool are background, not cause; filed in CMS and Drive; privileged calls kept out",
   "ask": "How does this internal record differ from a gap timeline sent to Keystone?"
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
   "say": "• $7,965.00 in liens sits behind a $10,000 BI limit, leaving $2,035.00 of that layer for John Doe\n• Lien: a bill paid from the settlement before his share; BI: the at-fault driver's bodily injury coverage\n• What the demand can claim is decided in this pre-demand audit, the final stress test; one duplicate line gives Keystone an easy out\n• Trinity of case alignment: story, physical evidence and medical records agree; MMI: as good as he'll get, bills complete, the audit begins\n• Specials: provable dollar loss, Medical Bills plus lost wages plus Property Damage; every line needs a document\n• Three audit passes: dates for gaps, codes for duplicates, prior history for old injuries"
  },
  "theory2": {
   "say": "• Subrogation: a payer's right to repayment from the recovery; Health Plans, government payers, LOP providers; each lien shrinks his net\n• Property Damage deep dive: impact photos, estimate versus final bill, supplements; the car proves the force\n• Defense-eye audit: read the file as the adjuster will, social media, minor-impact label, venue (where it'd be tried)\n• Policy-limits targets: verified limits in opening order; what a policy can pay isn't what the claim is worth\n• This file: chronology, both gaps reasoned, 14 and 19 days; coding, one line per date; prior history, three resolved 2021 low-back visits, no neck complaint"
  },
  "frame": {
   "say": "• Master Audit Checklist: tick it from the file, never from memory\n• Money: Specials documented line by line; lost wages need the employer's wage letter plus a doctor's work note\n• Lien resolution: every payer wanting repayment\n• Liability: final Police Report, witness drift, crash physics; Property Damage point of impact and supplements\n• Medical and billing: every gap explained, no duplicate codes, five to ten years of history"
  },
  "rules": {
   "say": "• MMI is Lakeside Orthopedics' call: its 06/12/2026 note and future care go on the timeline; open the audit task; SOL 02/06/2028 calendared\n• Specials ledger until every billed date matches a visit: Riverton's 34 lines against 33 visits; medical $14,817.40\n• Red flag: Riverton's 05/04/2026 line has no visit note; claiming it inflates the Specials: remove it, $6,105.00, and send the correction in writing\n• The Civic is Keystone PD's; BI Specials are medical plus wages: 9 Northgate shifts, 8 hours, $22.00, $1,584.00; flag five with no note\n• $3,400 to $6,800 future injections stay out; PIP's five payments total $5,000.00; register every lien, billed beside paid, Peach State's $1,860.00 too"
  },
  "model": {
   "say": "• Gate first: MMI 06/12/2026, ticked; nothing enters the ledger before it\n• Riverton Spine & Rehab: $6,290.00 struck, $6,105.00 instead; a $185.00 duplicate on 05/04/2026\n• $14,817.40 medicals plus $1,584.00 wages, $16,401.40; future medical sits outside the total\n• Targets in order: $10,000 BI, $20,000 Host UM, $10,000 Relative UM, each with its source\n• UM covers when at-fault insurance falls short: Host UM on the car he rode in, Relative UM via a relative\n• Before the ask, re-verify each sourced limit on the Coverage Matrix, $40,000 total; billed versus paid to Atty. Thorne; never value it",
   "ask": "Why re-verify the limits now, when the Coverage Matrix was confirmed weeks ago?"
  }
 },
 "d2m4-wage": {
  "task": {
   "say": "• Employer Verification email to Angela Ruiz from the Email Workspace, with the authorization\n• Request the Wage Loss Verification Form, payroll, W-2; confirm rate, shift hours, missed dates, overtime, physical demands\n• She'll ask for his MRI and whether the settlement repays Northgate: send no records, say nothing on the claim\n• Match each missed shift to a provider record; flag the five February shifts to Atty. Thorne\n• Audit the draft to the verified total; enter it in the Specials and the Net Sheet"
  },
  "case": {
   "say": "• 06/22/2026, ten days after MMI: John Doe signed Northgate Distribution's employee authorization this morning\n• A draft wage worksheet, built from his own account by phone, claims $1,760.00; nothing comes from a record\n• Angela Ruiz runs HR at Northgate; the Special Damages Audit is due 07/01/2026\n• Every missed shift must hold up against payroll and the medical chart"
  },
  "audit": {
   "say": "• Check every draft row against Northgate's records and the doctors' notes; five errors\n• 02/18 and 02/19 claimed, but he worked both; the MRI written as 03/12, actually 03/13\n• 05/18 rests on memory, but Crescent's work note covers 05/15 through 05/18; light duty and overtime never happened\n• The 02/09 to 02/13 call-outs left out for lack of a doctor's note: keep them, flagged\n• Employers can take weeks, so the request goes out the day MMI is declared"
  },
  "check": {
   "say": "• Northgate confirmed rate, hours, no overtime, job demands: lifting to 50 pounds, forklift, on his feet all shift\n• 03/05, 03/13, 05/15 and 05/18 shifts each matched to a provider record\n• 02/09 to 02/13 kept and flagged with the call-out record, EMS report and 02/07 receipt\n• Draft $1,760.00 down to $1,584.00, nine shifts, eight hours, $22.00; no medical records sent to the employer",
   "ask": "If Keystone asked how he is known to have missed 03/13, what proves it?"
  }
 },
 "d2m4-a1": {
  "task": {
   "say": "• Build the audited Specials ledger in the CMS Financial Ledger: charges, dates, billed amount, who paid\n• Match Riverton Spine & Rehab's lines to its visit notes; remove any line no visit supports\n• Total medical, add verified wages, show billed beside paid; future medical in the narrative only\n• List every lien in Liens and the Lien Tracker; re-verify the three limits in order on the Insurance tab\n• Part of the grade: what gets flagged rather than decided"
  },
  "case": {
   "say": "• 07/01/2026: Special Damages Audit due on LSH-2026-MVA-770412; MMI 06/12/2026, Causation Letter 06/19/2026\n• Riverton Urgent Care $685.00; Riverton Spine & Rehab 34 lines at $185.00, $6,290.00, with visit notes\n• Lakeside Orthopedics three visits at $640.00; Summit Imaging $2,395.00; Riverton Drug $312.40\n• Crescent Pain & Spine $3,400.00, of which Peach State paid $1,860.00\n• Northgate HR letter 06/30/2026: 9 missed shifts at 8 hours times $22.00; bills given, not totals"
  },
  "check": {
   "say": "• Riverton notes: 33 visits, 34 lines; remove the 05/04/2026 duplicate, $6,290.00 to $6,105.00, request a corrected statement\n• Medical total $14,817.40, down from $15,002.40; wages 9 shifts at 8 hours and $22.00, $1,584.00\n• Total Specials $16,401.40\n• Five shifts, 02/09 to 02/13/2026, came before any provider visit: flag with Northgate's Attendance Record, never drop\n• Billed beside paid for Atty. Thorne; future medical in narrative; targets $10,000, $20,000, $10,000",
   "ask": "Why flag those five early shifts instead of dropping them?"
  }
 },
 "d2m4-l2": {
  "theory": {
   "say": "• Atty. Thorne makes the strategy calls from the brief, before any demand draft, so its shape matters: it carries audit findings, not conclusions\n• Weak opening: the story of 02/06/2026; strong: MMI, $16,401.40 audited Specials against $10,000 BI, decisions needed\n• Story first buries the decision; hiding a risk misleads; making the call for him crosses the line\n• It reports on the four core audit objectives and flags statement drift: a witness whose story changes between tellings\n• Names value killers: social media, a minor-impact label, venue\n• Always carries lien totals; bad math or a missed lien means a short-funded settlement, little or nothing for the client"
  },
  "rules": {
   "say": "• Audit done: one-page memo and exhibit index in the Action Plan Editor, emailed before the session\n• Bottom line first: MMI 06/12/2026, $16,401.40 Specials against $10,000 BI; then the trinity: narrative, physicality, medicals\n• Facts: RPD-26-018842, Smith cited, Ruth Calloway checked for drift, doorbell video; door struck at 28 mph; Civic $6,940.00 to $9,255.00, $2,315.00 A-pillar supplement\n• Each risk with its answering document, 2021 low-back visits included; decisions as questions: figure, terms, time limit, billed versus paid, UM consents\n• Options with consequences; each decision read back, recorded in his words, tasked; Case Plan superseded and re-routed that day\n• Red flag: \"What's it worth?\" Value is Atty. Thorne's; answer with Specials, limits, liens"
  }
 },
 "d2m4-a2": {
  "task": {
   "say": "• Strategy session with AI Atty. Elijah Thorne in the Call Simulator\n• Brief in order: bottom line, audited facts, risks with documents, decisions needed, operational consequences\n• Meet every challenge with dated documents, not adjectives\n• Recommend only on operations; get decisions on the demand, the gap, UM consents and billed versus paid\n• Read each decision back; record in Case Notes, a task for each, re-route the Case Plan"
  },
  "case": {
   "say": "• 07/08/2026: Atty. Thorne has read the audit; strategy session today at 2:00 p.m. in his office\n• Bottom line first; expect pushback on low speed, the 14 days, and the \"degenerative\" read, meaning age wear\n• Bring facts, documents and operational options; demand decisions are his\n• Audit: MMI 06/12/2026, Specials $16,401.40, liens $1,860.00 and $6,105.00\n• Targets: $10,000 BI, $20,000 Host UM, $10,000 Relative UM"
  },
  "check": {
   "say": "• Bottom line first, figures exact\n• Low speed met with facts: Smith ran the stop sign and was cited, door struck about 28 mph, $2,315.00 A-pillar supplement\n• C5-C6 herniation, a neck disc injury, on the 03/13/2026 MRI; gap met with documents; 2021 and \"degenerative\" raised unprompted\n• Recorded: time-limited BI demand to Dana Whitfield, served 07/20/2026; gap up front; UM consent plan; billed versus paid\n• Asked for a demand figure: hand the question back to Atty. Thorne",
   "ask": "When AI Atty. Thorne asked what to demand, what was the answer?"
  }
 },
 "d2m4-kc": {
  "questions": {
   "say": "• Gate bar: this module turns two chips green, Specials audited at $16,401.40 and strategy approved by Atty. Thorne\n• The demand waits until all six chips are green\n• Total the Specials from the bills: Riverton corrected to $6,105.00, medical total, wage math, final figure\n• Who decides MMI, when John Doe's was, why the demand waits, where the $3,400 to $6,800 future medical goes\n• Name the four audit objectives, with one finding each on this file"
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
   "say": "• John Doe's Specials total $16,401.40; Robert Smith carries only $10,000 with Keystone; goal: its full limit within 30 days\n• Time-Limited Demand: a letter asking for the full policy limit, with set days to accept; miss a part, Keystone refuses at no risk\n• Five stops: confirm the foundation, demand within limits on clear terms, reasonable window, complete package, serve and docket\n• Foundation: deadline to sue, fault, coverage, each from its own document; Atty. Thorne decides every term\n• A demand presents a debt owed and forces a decision on the record; its first pages set the tone\n• Final Scrub: last line-by-line clean-up; Why Factor: each bill shows why treatment was needed"
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
   "say": "• Audit the draft against the Big Four and Final Scrub in the Action Plan Editor\n• Log each deficiency as an assigned CMS task; don't fix it quietly\n• Assemble with the gap on page one; once signed, email Dana Whitfield from the Email Workspace and log it\n• Docket the deadline from her written acknowledgement dated 07/22/2026, with reminders\n• Live call: confirm receipt and 08/21/2026, no extension, log her requests in her exact words"
  },
  "case": {
   "say": "• Monday 07/20/2026: Atty. Thorne wants the Keystone BI demand audited and sent today\n• Dana Whitfield, Keystone Mutual, claim KM-26-440871\n• Approved terms: $10,000 limits, Limited Release of Smith and Keystone only, Smith's affidavit, 30 days from receipt\n• On file: MMI 06/12/2026, Dr. Reyes's Causation Letter, the Gap Explanation Record; Specials $16,401.40\n• The demand specialist's draft has problems; audit it and log every deficiency as a task"
  },
  "grade": {
   "say": "• Five tests: within limits, clear, reasonable, documented, timed\n• Terms exactly as Atty. Thorne approved them; the gap answered on page one\n• Package: $10,000 cover letter, liability proof, itemized bills with reasons, gap proof, Northgate's wage letter, narrative\n• Build it from the case documents in the training Drive, then upload the served set to the CMS\n• An A leaves the adjuster no loose thread to pull"
  },
  "audit": {
   "say": "• The enclosure set as the demand specialist built it: keep, replace, pull, add, or flag each item for Atty. Thorne\n• Exhibit E: Riverton Spine & Rehab at $6,290.00, with 05/04 billed twice\n• Crescent's statement bills John $1,540.00 an in-network provider, one that accepted the insurer's prices, can't charge him\n• Two documents the letter relies on are missing\n• After submitting, compare your calls with the package Atty. Thorne signed and served 07/20"
  },
  "check": {
   "say": "• $10,000, Keystone's BI limit per its 03/20/2026 Dec Page; terms match Atty. Thorne's approval word for word\n• Big Four complete: Specials $16,401.40, Riverton Drug receipts counted once\n• 05/04/2026 duplicate removed: Riverton Spine & Rehab $6,290.00 down to $6,105.00\n• Gap on page one; 2021 low-back visits disclosed as resolved, no neck history\n• Each deficiency a dated, assigned task; emailed 07/20; 08/21/2026 docketed from Dana's 07/22 acknowledgement",
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
   "say": "• 08/05/2026: Keystone offered $3,500 against $16,401.40 in Specials, citing the 14-day gap and a “degenerative” MRI, wear and tear from age\n• A missing part is a discount: a Demand Package is proof sorted by what each piece proves\n• Big Four: Medical Specials, Narrative, Liability Proof, Special Damages; flawless before Atty. Thorne reviews\n• Human Story: how the injury changed his work and daily life, from his words and the records\n• 300 pages of raw charts get a lowball; a two-page summary and a strict clock make refusal risky\n• Built for the BI demand served 07/20/2026, rebuilt by function for the 08/31/2026 UM demands: coverage, exhaustion, liability, special and general damages, release"
  },
  "doc": {
   "say": "• Time-Limited Demand: the firm's offer to settle John Doe's BI claim for Keystone's $10,000 per-person limit, open for a fixed time\n• Makes Keystone decide on the record; Atty. Thorne sets every term: payment, Limited Release of Smith and Keystone, Smith's affidavit\n• Emailed to Dana Whitfield 07/20/2026: 81 pages, Exhibits A through J\n• 30 days run from her written acknowledgement of receipt, 07/22/2026; window closes 08/21/2026\n• No certified mail; the sent email and her reply are the proof; log, docket 08/21/2026, change no term"
  },
  "rules": {
   "say": "• Medical Specials from line-item bills, reconciled to the audit: $14,817.40, 05/04/2026 duplicate gone, every line with its why\n• Two-page treatment summary in front; Human Story: five Northgate shifts missed, right-hand numbness from 02/18, paresthesia at MMI\n• Liability: Police Report, Ruth Calloway, doorbell clip, Property Damage photos; Special Damages: Northgate's $1,584.00 letter; $16,401.40 total\n• Final Scrub: no overlaps, 2021 low-back visits disclosed, every balance confirmed by phone\n• For UM, rebuild by function with exhaustion proof, not proof of uninsured status\n• Red flag: Exhibit A cites RPD-26-018824, transposed, one of ten faults in the draft. Run the final scrub; fix all ten before Atty. Thorne signs."
  }
 },
 "d3m1-a2": {
  "task": {
   "say": "• The Demand Desk's drafts are in the file; this activity is QC, quality control\n• Host UM: Marcus Bell, Harbor Point, HP-26-7741, $20,000 limit\n• Relative UM: Teresa Okafor, Cardinal State, CS-26-20355, $10,000 as excess over Host UM\n• Page one of each: tender, consents, signed Limited Release, check copy to follow\n• Check figures against the audit; answer gap and “degenerative” with the MRI; route both drafts to Atty. Thorne"
  },
  "case": {
   "say": "• Monday 08/31/2026; Keystone's check has not arrived\n• BI done: Smith's affidavit 08/10, Keystone's $10,000 tender 08/12\n• Consents: Harbor Point 08/24, Cardinal State 08/26; Limited Release of Smith and Keystone signed 08/28\n• Atty. Thorne wants Host UM to Harbor Point for $20,000 and Relative UM to Cardinal State for $10,000, as excess\n• Exhaustion on page one, deadline left blank; expect Keystone's 08/05 arguments: the 14-day gap, a “degenerative” MRI"
  },
  "grade": {
   "say": "• Two separate packages for two carriers, never the BI demand readdressed\n• Each opens with exhaustion proof: Keystone's tender, Dec Page, Smith's affidavit, both consents, signed Limited Release\n• Then coverage, liability, damages; Cardinal State framed as excess, damages above $30,000\n• A two-page treatment summary, not a stack of records; response deadline blank for Atty. Thorne\n• Build from the training Drive, tie each figure to its source, upload to the CMS with follow-up tasks"
  },
  "check": {
   "say": "• Impairment rating: the doctor's percentage of permanent lost function; only a doctor gives one\n• Two complete packages; Cardinal State gets the whole file, Relative UM claimed above $30,000\n• Page one: 08/12 tender, 03/20 Dec Page, 08/10 affidavit, consents, 08/28 release, check-copy task; 03/02 and 03/09 coverage letters in\n• Gap section quotes the radiologist: “no significant degenerative change at the adjacent levels”\n• Two-page treatment summary; response deadline a marked blank; nothing served",
   "ask": "Does Dr. Reyes's MMI note carry an impairment rating, and if not, what do you ask Atty. Thorne?"
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
   "say": "• Net floor: liens $7,965.00 plus costs $486.75 is $8,451.75; grossed up for the one-third fee, $12,677.63\n• Gross up: the settlement size that leaves that amount after the fee; above Keystone's $10,000 limit\n• Drivers: Smith on video, an independent witness, C5-C6 herniation and injection, right-arm paresthesia (numbness, tingling) at MMI\n• Anchor on $16,401.40 Specials, never PIP's $5,000; restate the demand and 08/21/2026, pause, ask for her data\n• Log Keystone's $3,500 counteroffer word for word; never counter or move the number or deadline\n• Red flag: Whitfield presses for a number. Accept, reject, counter or value can change the demand's terms. Log her exact words; tell Atty. Thorne today."
  }
 },
 "d3m2-a1": {
  "task": {
   "say": "• Run the call in the Call Simulator; log it in the Communications Log; draft the follow-up in the Email Workspace\n• Before dialing, math check on $3,500: fee, costs, unreduced liens, John's net\n• Pause after her number, ask what data supports it, name each stall\n• Gap: EMS report, Gap Explanation Record, Dr. Reyes's Causation Letter; degenerative: Dr. Park's MRI language\n• Restate $10,000 and 08/21/2026; log her words, report today, draft the 08/06/2026 rebuttal for approval"
  },
  "case": {
   "say": "• 08/05/2026, Dana Whitfield, KM-26-440871: Keystone offers $3,500.00 on the bodily injury claim\n• Against $16,401.40 in Specials\n• Her reasons: he waited two weeks to treat; MRI findings “degenerative in nature”; she calls this afternoon\n• Keystone received the $10,000 Time-Limited Demand 07/22; acceptance runs to 08/21/2026\n• Atty. Thorne's written authority: restate the Limits Demand and deadline, present the record, no counter, report same day"
  },
  "check": {
   "say": "• Math before dialing: $3,500 minus $1,166.67 fee and $486.75 costs leaves $1,846.58 against $7,965.00 liens; net $0.00\n• Paused and asked for her data; gap answered with dated documents, degenerative with Dr. Park's sentence\n• Restated $10,000 and 08/21/2026 with no new figure; naming a number or “let me see what I can do” fails\n• Offer logged in her exact words, reported 08/05, rebuttal drafted for 08/06",
   "ask": "If Dana Whitfield raises the April break, which record answers the 19-day disruption?"
  }
 },
 "d3m2-bins": {
  "task": {
   "say": "• Build Stream 1 in the LSH Net Sheet; $10,000.00 gross as tendered, not received\n• Fee at the retainer's pre-suit 33⅓%, $3,333.33; five receipted costs, $486.75; liens as they stand, reduction column blank\n• 25% allocation: $121.69 costs, $1,991.25 liens, projected net $4,553.73, labeled a projection with its assumptions\n• BI-alone pattern: $6,179.92 against $7,965.00, shared pro rata; John at $0.00\n• Route to Atty. Thorne today with the trust-hold flag; allocation and value are his"
  },
  "case": {
   "say": "• Wednesday 08/12/2026: Dana Whitfield tendered Keystone's $10,000 BI limits, inside the 08/21 window\n• Tendered means offered, not received: no check issued, no release signed, UM not yet demanded\n• Atty. Thorne wants the BI Net Sheet: Stream 1 on his 25% working allocation, and Stream 1 standing alone\n• Liens as of 08/05: Peach State $1,860.00, Riverton Spine & Rehab $6,105.00 audited, nothing reduced"
  },
  "check": {
   "say": "• Fee $3,333.33, not $3,333.00 from typing 33.33%\n• Liens $1,860.00 and $6,105.00, nothing reduced; Stream 2 open and empty\n• $4,553.73 marked a projection, with the allocation and open UM layers noted\n• BI alone: $6,179.92 against $7,965.00, $1,785.08 short; Peach State $1,443.15, Riverton $4,736.77, John $0.00\n• Flagged as fact: money stays in trust until liens resolve; the rest is Atty. Thorne's",
   "ask": "You posted Keystone's $10,000 to the Trust Ledger today; what's wrong with that entry?"
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
   "say": "• In the audit workbench, call every clause: keep, replace, pull, add, or flag for Atty. Thorne\n• For each, write what it would do on this file and the amendment proposed\n• Email the review to Atty. Thorne for approval, his clauses flagged; never send the draft to John Doe\n• Dana asks if John can just sign the standard form: route it, don't answer\n• Convert the exchange into a memorandum; file it in the CMS and the Backup Drive"
  },
  "case": {
   "say": "• Friday 08/14/2026: Keystone tendered Wednesday; consent requests went to Harbor Point and Cardinal State yesterday\n• Dana Whitfield sends Keystone's own release for John Doe's notarized signature\n• Her cover letter: no check until both UM consents and subrogation waivers arrive\n• The demand asked for a Limited Release of Smith and Keystone only; this is a Release of All Claims\n• Read every clause against what was promised and what's still open before John sees it"
  },
  "audit": {
   "say": "• Fifteen items; easy keeps: parties, the $10,000.00, non-admission, notary block\n• Catch-all reaching all other insurers would release Harbor Point and Cardinal State, $30,000\n• Property Damage and Loss of Use reaches the Civic's claim, Margaret's, still open with Leah Moran\n• Also wrong: no UM reservation, unagreed confidentiality, indemnity with no ceiling, no payment date\n• Flag for Atty. Thorne: unknown injuries, the Medicare representation, governing law"
  },
  "check": {
   "say": "• Catch-all replaced, with exactly what it would have released\n• Claims cut back to bodily injury; both UM claims reserved by claim number\n• Confidentiality pulled; indemnity limited to the file's liens paid from trust; payment date left for Atty. Thorne\n• Unknown injuries, Medicare and governing law flagged, Medicare facts verified from the file\n• Atty. Thorne's 08/17 approval filed; draft kept from John Doe throughout",
   "ask": "Why can't the release stay confidential on this file?"
  }
 },
 "d3m2-exec": {
  "task": {
   "say": "• Call John Doe: signing Friday 08/28 at the office\n• He brings government photo ID as John Doe, signs only before the notary; Atty. Thorne reviews the release with him first\n• Questions about meaning go to Atty. Thorne\n• After signing: confirm execution requirements; upload to the CMS and his portal\n• Email Dana Whitfield the packet, ask for receipt and check date; route her payee question; deposit 09/04; file the record"
  },
  "case": {
   "say": "• Wednesday 08/26/2026: Cardinal State's consent and waiver arrived, joining Harbor Point's from Monday\n• Keystone issued its Limited Release 08/19, exactly as Atty. Thorne approved\n• Before paying, Keystone needs a notarized wet-ink original, both waivers and the firm's W-9; then pays within 14 days\n• John Doe hasn't seen the release yet; this stage is logistics, every legal question goes to Atty. Thorne"
  },
  "check": {
   "say": "• Signing scheduled only after both consents were in writing\n• Call covered date, place, ID and notary only; every meaning question routed\n• ID matches John Doe exactly; wet-ink original, notarized, every page initialed\n• Packet to Keystone 08/28 with both waivers and W-9; written receipt and check date requested\n• Peach State payee question to Atty. Thorne, no promise; check 0048213 in trust 09/04/2026, record filed",
   "ask": "Why isn't this release going out for e-signature?"
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
   "say": "• Work both UM claims to resolution in the Negotiation Log, the CMS record of every offer, counter, reason and date\n• Log Harbor Point's $8,000 with its reasons; report to Atty. Thorne same day\n• 09/16 counter-package for approval: 03/02/2026 letter, MRI, Dr. Reyes's Causation Letter, MMI residuals, future care\n• Any offer or tender: record John's informed decision through Atty. Thorne; draft the confirming email for approval\n• Finish: prove $40,000.00 gross on the Recovery Ledger, every dollar recovered before fees and bills"
  },
  "case": {
   "say": "• 09/14/2026, Marcus Bell, HP-26-7741: Harbor Point offers $8,000.00 on the Host UM claim\n• Reasons: no treatment for two weeks; the BI payment already compensated much of the loss\n• The second argument is new; compare it with Harbor Point's own 03/02/2026 letter before drafting\n• Context: Keystone's $10,000 in trust since 09/04; both UM demands sent 08/31"
  },
  "check": {
   "say": "• Harbor Point's 09/14 offer logged with both reasons, reported same day\n• Counter: offset answered by the 03/02/2026 letter, damages by medical proof, MMI residuals, future care $3,400 to $6,800\n• Sent 09/16 with no figure below limits from you\n• Harbor Point $20,000 on 09/29, Cardinal State $10,000 tender 10/06: each John's decision through Atty. Thorne, who and when\n• Recovery Ledger reads $40,000.00 only; no PIP $5,000 or Keystone Property Damage payments",
   "ask": "Was each UM release signed before its check arrived on 10/05 and 10/13?"
  }
 },
 "d3m2-umns": {
  "task": {
   "say": "• Build Stream 2: post Harbor Point and Cardinal State to the Recovery Ledger, the running list of every dollar recovered\n• Show which check is in trust and which only tendered; take the pre-suit one-third fee\n• Allocate costs and liens 75% to Stream 2, pro rata to gross: $30,000 of $40,000 came from UM\n• Liens at asserted or audited figures, not hoped-for reductions; mark what can change and why\n• Tie to Stream 1 and the Trust Ledger; write questions for Atty. Thorne; sheet goes to him, not John"
  },
  "case": {
   "say": "• 10/06: Teresa Okafor tendered Cardinal State's $10,000 Relative UM limits; John accepted through Atty. Thorne\n• Relative UM: coverage John reaches through a relative's policy when the at-fault driver's isn't enough\n• In trust: Harbor Point's $20,000 since yesterday, Keystone's $10,000 since 09/04; stack closed at $40,000, $30,000 in the account\n• Liens unchanged: Peach State asserts $1,860.00, Riverton Spine & Rehab $6,105.00 audited\n• Atty. Thorne wants the UM Net Sheet before reviewing it with John; one number looks firm and isn't"
  },
  "check": {
   "say": "• Gross $30,000; fee $10,000.00; costs $365.06, the remainder after Stream 1's $121.69\n• Peach State $1,395.00; Riverton Spine & Rehab $4,578.75 on the audited figure; projected net $13,661.19, labeled\n• Plus Stream 1's $4,553.73 equals $18,214.92: $40,000 less fee, costs and unreduced liens\n• Harbor Point PIP at zero, citing its 03/02 letter; Cardinal State receivable, not received\n• Four questions written and routed to Atty. Thorne today",
   "ask": "John asks tomorrow if he's getting thirteen thousand; what do you tell him?"
  }
 },
 "d3m2-kc": {
  "questions": {
   "say": "• Learning Check on negotiation: answer from John Doe's file, in your own words\n• Q1: math check on Keystone's $3,500: fee, costs, unreduced liens, net $0.00; what it shows Atty. Thorne, who tells John\n• Q2: answer Dana Whitfield's gap and degenerative arguments with four documents and the radiologist's words\n• Q3: PIP's $5,000, exhausted and non-subrogated (no right to repayment): effect on valuation, and the no-fault contrast\n• “No set-off here” is not the same as “no reduction anywhere”"
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
   "say": "• In the Lien Tracker on the Net Sheet: match the plan's payments to the treatment record; classify the lien\n• Record funding status; escalate the governing-law question to Atty. Thorne through CMS Tasks\n• Draft the Reduction Request in Documents, Outgoing: name the doctrine, show one-third math to $1,240.00, cite the MRI\n• Flag made whole as his to argue; record every absent claimant as a verified none with source\n• Hand in: request for signature, cleared Lien Tracker, 10/09/2026 acceptance at $1,240.00 once confirmed in writing"
  },
  "case": {
   "say": "• 10/06/2026, PSH-55017742: Peach State Health Plan asserts a $1,860.00 reimbursement right\n• Paid for the 05/15/2026 epidural injection at Crescent Pain & Spine; asks that its claim be protected\n• Attached: notice of rights and the EOB, the plan's statement of what it paid\n• Cardinal State just tendered $10,000; gross is $40,000.00\n• Both liens on the Lien Tracker since the pre-demand audit; Atty. Thorne held the Reduction Requests until gross was known"
  },
  "check": {
   "say": "• Ledger matched to the one accident-related charge: 05/15/2026 injection, $3,400.00 billed, $1,860.00 paid; lien is what was paid\n• Crescent's $1,540.00 write-off recorded as not owed\n• Lien classified contractual, fully insured per plan documents, governing law Atty. Thorne's; common-fund math cites MRI and 06/19/2026 Causation Letter\n• Absences complete with date and source; prior attorney none known to John Doe; PIP not a lien\n• $1,240.00 final only with Peach State's written confirmation and Atty. Thorne's approval",
   "ask": "Who checked Summit Imaging, which asked for an LOP on 03/11/2026?"
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
   "say": "• Audit Riverton's ledger against visit records; request a written correction first\n• Draft the Reduction Request for Atty. Thorne; send once approved\n• Call Simulator with Tammy Greer, billing manager: audited balance $6,105.00, 05/04/2026 duplicate removed\n• Explain the coverage-capped recovery as fact; she agrees to $4,580.00; accept nothing, route to Atty. Thorne\n• Hand in: logged call, signed 10/12/2026 Payoff Letter, recomputed Net Sheet at $20,359.92"
  },
  "case": {
   "say": "• 10/09/2026: Peach State accepted $1,240.00 in writing\n• Riverton Spine & Rehab's Final Itemized Ledger under the 02/23/2026 LOP: 34 visits at $185.00, balance $6,290.00\n• Riverton asks when to expect payment in full; visit notes attached\n• Atty. Thorne set a written target; the Reduction Request is yours to draft\n• Expect pushback: “We gave him 33 visits on a promise of payment”; answer with the audit and true facts"
  },
  "check": {
   "say": "• 34 billed lines against 33 documented visits, 16 before the disruption, 17 after\n• Written correction of the 05/04/2026 duplicate first, $6,290.00 to $6,105.00; nothing 04/02 to 04/21/2026\n• Request approved and sent before the call; only true facts, recovery capped at $40,000 of coverage\n• At $4,580.00: “goes to Atty. Thorne, confirmed in writing”; Payoff Letter full-and-final, no balance billing\n• Net Sheet shows $20,359.92, clearing the 10/22/2026 disbursement",
   "ask": "Opening with a discount on $6,290.00, how much error would you have negotiated around?"
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
   "say": "• One Net Sheet, two tabs: Recovery Ledger for money in and deductions, Lien Tracker proving each lien; must tie out\n• Streams apart: BI $10,000.00, UM $30,000.00; PIP's $5,000.00 is a payment source on the Lien Tracker, never recovery\n• Fee per stream at 33⅓% pre-suit: $3,333.33 plus $10,000.00 is $13,333.33\n• Costs $486.75 with receipts, split 25% and 75%: $121.69 and $365.06; reduce liens globally, allocate pro rata\n• Net both ways: $5,089.98 plus $15,269.94 is $20,359.92; flag future ESIs (injections) of $3,400 to $6,800"
  },
  "model": {
   "say": "• Recovery Ledger in front: columns for total, Stream 1 BI, Stream 2 UM\n• Rows: gross, 33⅓% fee, costs, Peach State, Riverton Spine & Rehab\n• Orange net row: $20,359.92, which is $5,089.98 plus $15,269.94\n• Lines from each lien row to the Lien Tracker tab: proved by Payoff Letter\n• Corner reminder: BI alone meant $0.00 to John Doe"
  }
 },
 "d3m4-a1": {
  "task": {
   "say": "• Complete both tabs of John Doe's Net Sheet\n• Recovery Ledger: each check by carrier and stream, 33⅓% fee per stream, five costs, costs and liens split 25% and 75%\n• Lien Tracker: every provider and payer with charges, payments, adjustments, balance; asserted, audited, reduced figures; payoff status\n• Tie both tabs to the Trust Ledger; reach $20,359.92 down both streams and in total\n• Route to Atty. Thorne; one future cost belongs on the flag list before John signs"
  },
  "case": {
   "say": "• 10/13/2026: Cardinal State Mutual's $10,000.00 deposited to IOLTA on CS-26-20355, not yet cleared\n• Joins Keystone's check of 09/04 and Harbor Point's of 10/05, each deposited after its release; trust received $40,000.00\n• Peach State accepted $1,240.00 on 10/09, Riverton Spine & Rehab $4,580.00 on 10/12, both in writing; costs $486.75\n• Both Net Sheet tabs half-built; finish before the Settlement Statement is drafted\n• Two lines look owed but aren't: PIP's $5,000.00 and Crescent's write-off"
  },
  "check": {
   "say": "• Gross: Keystone $10,000.00 to Stream 1; Harbor Point and Cardinal State $30,000.00 to Stream 2\n• Fee $3,333.33 plus $10,000.00, $13,333.33; costs $486.75, split $121.69 and $365.06, charged once\n• Liens 25%/75%: Peach State $310.00 and $930.00, Riverton $1,145.00 and $3,435.00\n• Net $5,089.98 plus $15,269.94 is $20,359.92; $40,000.00 minus $19,640.08 matches; zero-balance lines off payables\n• Payoff status recorded, none final on a phone call; up to $6,800 possible repeat injections flagged to Atty. Thorne",
   "ask": "Why does the future-injection flag go to Atty. Thorne rather than straight to John Doe?"
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
   "say": "• Nothing archived until all four sets are in; test: could an outside auditor trace every dollar from the file\n• Money trail, 10/22/2026: three deposits, five checks, confirmation numbers, zero-balance report\n• Zero counts only when bank statement, trust journal and client ledger agree, every check cleared; a second reviewer each disbursement\n• Satisfactions and John's receipt filed with his payer disclosure (PIP $5,000.00, Peach State $1,860.00, John $312.40) and current W-9\n• Closing memo, 10/30/2026, explains every figure that moved; Atty. Thorne signs your closing letter; tag every document, dispose after 7 years\n• Red flag: \"We've changed our wiring instructions.\" Stop payment; verify by phone to a number on file, not the email's",
   "ask": "Riverton Spine & Rehab's $6,290.00 became $4,580.00. What does the closing memo say about that?"
  }
 },
 "d3m4-pal": {
  "task": {
   "say": "• Log the notice on arrival; route to Atty. Thorne same day; send nothing to Vance & Kettering\n• On his instruction, hold the disputed $6,666.67 in the CMS; Action Plan shows 10/22 depends on it\n• Investigate: pull their agreement, compare signatures with John's, check its date against the firm's engagement, audit claimed work\n• Ask John neutrally whether he hired them, with no hints\n• Deliver the packet to Atty. Thorne; archive in the CMS and Drive"
  },
  "case": {
   "say": "• Wednesday 10/14/2026: $40,000.00 in trust, both liens reduced in writing, disbursement set for 10/22\n• Email from Vance & Kettering Injury Law: says it was retained 07/27/2026 and claims a charging lien\n• Charging lien: a lawyer's claim to be paid from the settlement\n• Wants half the fee, $6,666.67, a hold on the whole settlement, and the case manager's confirmation by Friday\n• No one on the file has mentioned another lawyer; log it, route it, send nothing back"
  },
  "audit": {
   "say": "• Test each claim in the notice against the file; keep their agreement whole as the key exhibit\n• Only signature: Margaret Doe's, as mother; John's line is blank\n• Add: John's own 02/09/2026 signatures, a timeline showing engagement and the demand served before 07/27, his account, the hold record\n• Replace their claimed services and carrier notice with the record: 0.6 hours with Margaret, no carrier contact\n• Flag the fee, the lien and their request for confirmation"
  },
  "check": {
   "say": "• Notice logged and routed 10/14, nothing sent to the firm\n• $6,666.67 hold in place on Atty. Thorne's instruction, shown in the Action Plan\n• Signatures compared; dates checked against 02/09 and 07/20; their time record quoted, not characterized\n• John Doe's account in his own words, no view on the lien\n• Every sentence a fact tied to a document; validity, quantum meruit and any reply left to Atty. Thorne",
   "ask": "Who answers Vance & Kettering, and why not the Case Manager?"
  }
 },
 "d3m4-a2": {
  "task": {
   "say": "• Check each condition precedent against its document, not memory\n• Keystone's executed Limited Release and both UM releases; cleared funds; the signed statement; the Payoff Letters\n• Prior-attorney lien withdrawn, hold released by Atty. Thorne\n• Queue one Trust Ledger command per Net Sheet line for his approval: fee and costs, Peach State, Riverton, John Doe\n• Show the ledger at $0.00; request lien satisfactions and John's receipt; take John's call about his check"
  },
  "case": {
   "say": "• 10/21/2026, the day before disbursement: all three checks, $40,000.00, cleared trust by 10/20\n• John Doe signed the Settlement Statement this morning; both Payoff Letters in Documents\n• Monday 10/19: Vance & Kettering withdrew its lien in writing; Atty. Thorne released the hold\n• Today: confirm every gate is closed, then line up five commands taking the ledger to zero"
  },
  "check": {
   "say": "• Executed Limited Release and both UM releases on file; funds cleared by 10/20; statement signed 10/21\n• The 10/19 withdrawal on file; hold release recorded as Atty. Thorne's\n• Commands: $13,333.33 fee, $486.75 costs, $1,240.00 Peach State, $4,580.00 Riverton, $20,359.92 John Doe\n• Total $40,000.00, leaving $0.00; every packet complete, every command awaiting his signature",
   "ask": "What would you do if the hold had not been released by 10/21?"
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
   "say": "• Keystone holds at $3,500, calls it \"final\" on 08/12, lets the demand lapse 08/21\n• Work the dispute path first: evidence, new findings, the 09/02 supervisor escalation; by 09/04/2026 all five triggers are met\n• Never bid against yourself: never lower the number because the carrier went quiet\n• Filing is Atty. Thorne's decision; inputs are yours: RPD-26-018842, Ruth Calloway, doorbell video, MRI, $16,401.40 Specials\n• Calendar SOL 02/06/2028, cutoff 11/05/2027; never recommend suit, value the claim or advise John on $3,500"
  }
 },
 "d4m1-a1": {
  "task": {
   "say": "• Draft the impasse memo to Atty. Elijah Thorne from the CMS memo template; proof from the Communications Log; send via Tasks, Escalate\n• Dated chronology, 07/20/2026 demand through 09/04, each event tied to its proof\n• State Keystone's reasons and the rebuttal evidence it never answered\n• Frozen stack: $30,000 of $40,000 locked behind BI; documented Specials; SOL 02/06/2028, hard date 02/04/2028, cutoff 11/05/2027\n• End with decisions needed, written as questions; recommend nothing"
  },
  "case": {
   "say": "• 09/08/2026, from Atty. Thorne: Keystone silent since the 09/02 escalation; send the full impasse memo today\n• Keystone, Dana Whitfield, KM-26-440871, offered $3,500 on 08/05, citing the 14-Day Gap and a \"degenerative\" MRI\n• 08/06 rebuttal sent Dr. Helen Park's read, Dr. Reyes's 06/19/2026 Causation Letter, the EMS report, the Gap Explanation Record\n• 08/12 \"final\"; demand lapsed 08/21; 08/24, 08/31 follow-ups and 09/02 escalation unanswered\n• Build the chronology first: every event in date order"
  },
  "check": {
   "say": "• Nine events, 07/20 to 09/04, in order, each with a receipt, sent email or log entry\n• Keystone's reasons in Keystone's words: 14-Day Gap, \"degenerative\" MRI; unanswered rebuttal listed\n• Stack: $10,000 BI not used up; $20,000 Host UM and $10,000 Relative UM closed\n• Specials $14,817.40 plus $1,584.00 equals $16,401.40; clock dates right, sent Tuesday 09/08 after Labor Day\n• Decisions written as questions; no recommendation, no new number to Keystone",
   "ask": "Does any sentence in your memo read like advice instead of a question for Atty. Thorne?"
  }
 },
 "d4m1-l2": {
  "why": {
   "say": "• Keystone never said no; it went silent, and that dated, logged silence proved the impasse\n• On 09/10/2026, before filing, the case-number field reads \"Pending\"; anything else is a guess\n• Once Atty. Thorne authorizes suit, a court clock replaces the adjuster's clock\n• Red flag: pre-litigation habits in a court file cost deadlines; update status, court fields, folders and calendar in one sitting, citing Atty. Thorne's 09/09/2026 authorization"
  },
  "rules": {
   "say": "• Status changes to Litigation only on Atty. Thorne's dated authorization, and cites it\n• Fee: 33⅓% before suit, 40% once suit is filed; court fields only from the record, number \"Pending\" until filing\n• Build DOE, JOHN - CASE FILE with folders 01 to 05 for the 09/24/2026 filing; name every PDF, never scan001.pdf\n• Calendar SOL 02/06/2028, hard date 02/04/2028, cutoff 11/05/2027, 48-hour audits; notify UM carriers in writing, no number\n• Keep the doorbell video unaltered; a binding award generally can't be appealed"
  }
 },
 "d4m1-a2": {
  "task": {
   "say": "• Work live in the CMS: Case Summary, Litigation, Documents, Outgoing, Calendar\n• Set status on the 09/09 authorization; open court fields, never guessing a case number; fee tier as the retainer sets it\n• Build the five litigation folders to firm standard\n• Draft both UM notices and preservation requests for his approval; open the ADR fields for mediation and arbitration\n• Seed the Litigation Calendar with 48-hour audits; notices state facts and carry no number"
  },
  "case": {
   "say": "• 09/10/2026, from Atty. Thorne: suit authorized 09/09 against Robert Smith, State Court of Riverton County, filing target 09/24/2026\n• He went over the fee tier with John; transition the file today\n• Draft impasse notices to Harbor Point, Marcus Bell, HP-26-7741, and Cardinal State, Teresa Okafor, CS-26-20355\n• Preservation requests, asking that evidence not be destroyed: doorbell video and the Escape's data recorder, its built-in black box\n• Harbor Point's UM policy has an arbitration clause; video copy secured 02/19/2026; the 2020 Ford Escape is Kevin Alvarez's"
  },
  "check": {
   "say": "• Status Litigation, dated 09/10/2026, citing the 09/09 authorization; case number \"Pending, assigned on filing\"\n• Fee tier: 33⅓% until filing, 40% from the filing date, not 09/10; note his talk with John without explaining it\n• Five folders named exactly; notices to HP-26-7741 and CS-26-20355 state impasse, no dollar figure, go for approval\n• Ask Margaret Doe to keep what she holds; data recorder request to Kevin Alvarez and Harbor Point; flag the arbitration clause\n• Calendar: 09/24 filing, 09/22 audit, SOL dates",
   "ask": "What does Margaret Doe still hold today, and who holds the Escape's event data recorder?"
  }
 },
 "d4m1-efile": {
  "task": {
   "say": "• Task Nadia Brooks, Litigation Desk: cover sheet and summons from the approved Complaint, due tonight, to Atty. Thorne for signature\n• He signs 09/23; on 09/24 build the Court E-Filing envelope: caption, court, three documents, filing attorney, $218.00 fee\n• Open every page to check his signature first\n• Once accepted: record the case number, file the stamped Complaint, summons and conference notice, post the fee\n• Calendar what the filing starts; hold what it doesn't"
  },
  "case": {
   "say": "• 09/22/2026, Track B: file moved to Litigation 09/10 on Atty. Thorne's authorization; filing target 09/24/2026\n• Today is the 48-hour audit, checking everything is ready before filing\n• This morning he approved his Complaint, the document that starts the lawsuit, against Robert Smith in the State Court of Riverton County\n• Still missing: civil cover sheet and summons, the court's notice that Smith is being sued\n• Trap: a 09/15 draft in the CMS, not for filing, unsigned, no case number; acceptance starts court clocks and the 40% tier"
  },
  "check": {
   "say": "• Nadia's task names the documents, the approved Complaint, due date, Atty. Thorne as signer\n• Nothing unsigned went in; the 09/15 draft never left the CMS; accepted 09/24 as 26-CV-04417, replacing Pending\n• Three named PDFs in 01_PLEADINGS; costs $486.75 plus $218.00 is $704.75\n• Service deadline 01/22/2027, a Friday, 120 days out, with alerts; Allied Process Services has its hand-off\n• Conference 12/10/2026, 9:00 a.m., Atty. Thorne attending; answer date set on service, since Smith's clock starts then",
   "ask": "Why can't the answer date be calendared on the day of filing?"
  }
 },
 "d4m1-kc": {
  "questions": {
   "say": "• Learning Check: answer from John Doe's file, in own words, under each question\n• Q1: what's the same on Track B as Track A, what changes 08/12/2026, why one $10,000 carrier freezes $40,000\n• Q2: John Doe's impasse triggers by 09/04/2026, each with its date and proof\n• Q3: Keystone calls $3,500 \"final\": using the \"Never\" rule, what's next and what needs Atty. Thorne's authority\n• If the freeze can't be explained in plain words, review Day 2's order of operations"
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
   "say": "• The Complaint turns a claim into a lawsuit; Atty. Thorne drafts and signs it\n• Parts: caption, jurisdiction, facts, causes of action (legal reasons for suing), prayer for relief (what is asked)\n• Filed before the SOL, it preserves negligence and negligence per se claims against Robert Smith\n• Filed 09/24/2026, No. 26-CV-04417: bodily injury only, $14,817.40 medical, $1,584.00 wages; no Property Damage, John owns no vehicle\n• Verify filing date and Smith's exact name; stamped copy in 01_PLEADINGS; use only the filed version"
  },
  "rules": {
   "say": "• Hard rule: a date fixed by statute, court rule, order or forum rules; miss one and the claim can go\n• Leave out the trigger day, count the last: Robert Smith served 10/14/2026, answer due 11/13/2026\n• Add 3 days for mail, none for e-service; forward counts roll later, backward counts roll earlier\n• Red flag: fifteen RFAs, requests to admit facts, inside the general discovery entry; unanswered, they may be deemed admitted: own entry, alerts, tell Atty. Thorne\n• Sunday SOL becomes hard date 02/04/2028, cutoff 11/05/2027; unsure, docket earlier and flag"
  }
 },
 "d4m2-a1": {
  "task": {
   "say": "• Audit the calendar in the Case Docket and Calendar Conflict Resolver against the 12/10/2026 order, 12/01/2026 discovery, 02/06/2028 SOL\n• Recompute from each trigger document: trigger day out, 3 mail days in, forward later, backward earlier\n• Fix errors, add what's missing, leave correct entries alone\n• Each entry: trigger, rule, math, owner, alerts, mirrored to the CMS Calendar; rank errors, log in Case Notes, send\n• Jenna Price, Atty. Mercer's paralegal, will call: agree to nothing, log her words exactly"
  },
  "case": {
   "say": "• 12/10/2026, from Atty. Thorne: Scheduling Order entered; discovery Mercer mailed 12/01 attached\n• Calendar was re-keyed from paper: nothing verified, no alerts; audit every entry, correct, send the correction log\n• No. 26-CV-04417; discovery: 25 Interrogatories, 30 Requests for Production, 15 RFAs\n• Order: expert disclosure plaintiff 03/15/2027, defense 04/15/2027; mediation by 03/31/2027; discovery closes 05/28/2027\n• Pretrial 08/12/2027, trial 09/13/2027"
  },
  "check": {
   "say": "• Responses corrected to Monday 01/04/2027: 12/01 plus 30 plus 3 lands Sunday 01/03\n• RFA entry added: all 15 due 01/04/2027, deemed admitted if unanswered; the most missed and most severe\n• Expert disclosures un-swapped; mediation \"completed by 03/31/2027\"; hard date 02/04/2028 added\n• Cutoff corrected from 11/08/2027 to 11/05/2027, rolled earlier; correct entries verified and left alone\n• Errors ranked rights first; no call to opposing counsel about extensions",
   "ask": "Did you recompute each date from its trigger document, or from the entry you were checking?"
  }
 },
 "d4m2-medcal": {
  "task": {
   "say": "• Work in the Calendaring Simulators; mirror everything to the CMS Calendar\n• Verify the trigger, the document a deadline counts from; 03/18 sits 13 days inside 03/31: link it, close the windows task\n• Enter the session with attendees; count back: binder 03/11, approval 03/09, binder QC 03/04, draft index 03/02\n• Count forward to the mediator's report on 03/25; get John's written confirmation and reminders; cost task for $1,200.00\n• Flag: Harbor Point and Cardinal State must consent in writing before any BI settlement"
  },
  "case": {
   "say": "• Friday 01/08/2027: Notice of Mediation filed; mediation is a meeting where a neutral helps both sides try to settle\n• Hon. Carla Benton (Ret.), chosen from four windows collected 12/17, Thursday 03/18/2027 at 9:30 a.m., in person at her office\n• Statement and binder due 7 days before; John Doe must attend\n• 12/10 order of referral: each party and lead counsel attend; Keystone sends someone with full settlement authority\n• Fees split equally, firm's half $1,200.00; \"completed by 03/31/2027\" already calendared"
  },
  "check": {
   "say": "• Session once, Thursday 03/18/2027, 9:30 a.m., linked to the 03/31 deadline, not duplicated\n• Statement and binder Thursday 03/11, no roll; approval Tuesday 03/09, QC Thursday 03/04, draft index Tuesday 03/02; report 03/25\n• John's confirmation requested today, tickler 01/15\n• Fee: half of $2,400.00, advanced costs $989.75 to $2,189.75, only once the invoice is receipted\n• UM flag with arithmetic: 30 days from a 03/18 notice runs to Saturday 04/17",
   "ask": "The 03/15 expert disclosure falls between binder and session. Who needs to hear, and by when?"
  }
 },
 "d4m2-um": {
  "theory": {
   "say": "• Three carriers. Third-party claim: against the at-fault driver's insurer, Keystone for Robert Smith, who ran the stop sign\n• First-party claim: against coverage protecting the client, John's own: Harbor Point Host UM and Cardinal State Relative UM\n• UM: uninsured or underinsured motorist coverage, paying when the other driver's insurance isn't enough; Harbor Point offered $8,000 against a $20,000 limit\n• One paragraph in Harbor Point's policy decides where this fight happens; read it before calendaring anything\n• Mandatory arbitration clause sends the dispute to a private decision-maker; the firm files a Demand for Arbitration\n• Bad faith: a separate suit over unfair handling, can exceed the limit; Atty. Thorne's alone"
  },
  "frame": {
   "say": "• Step one, claim submission: UM Demand Package with proof the at-fault limits were used up, sent 03/22/2027\n• Step two, dispute: Harbor Point offered $8,000, Cardinal State $6,000; $14,000 against $30,000 in limits\n• Step three, resolution route: Demand for Arbitration where the clause binds\n• Or a lawsuit against the carrier where state law bars the clause or lets the client opt out\n• Bad faith is not on this flow; separate action, Atty. Thorne's call"
  },
  "rules": {
   "say": "• Know which claim it is: same evidence, different relationship\n• John owns no car; Margaret's Bluewater policy on the Civic had UM rejected in writing 03/14/2024\n• He reaches UM by status: passenger in Kevin Alvarez's Escape, relative living with Margaret\n• The route is read, never chosen; read each layer on its own, Harbor Point's clause doesn't speak for Cardinal State\n• Each route has its own clock, not the 02/06/2028 SOL; ask Atty. Thorne in writing, docket his answer"
  },
  "model": {
   "say": "• Claim submission, 03/22/2027: injuries, records, $16,401.40 in Specials, wage letter, proof Keystone's $10,000 was tendered and consented to\n• Tendered: offered up in full\n• Dispute: $8,000 on 03/31, $6,000 on 04/02; $14,000 against $30,000 of limits\n• Route: Harbor Point invoked its arbitration clause in April 2027; hearing 06/22 before Laura Whitcomb\n• Margaret's Bluewater policy is not a route: UM rejected in writing; John owns no car"
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
   "say": "• Build the ADR rules matrix in the Action Plan Editor: one column for the 03/18/2027 mediation, one for the 06/22/2027 arbitration\n• ADR: alternative dispute resolution, settling a dispute outside a courtroom\n• Rows: neutral and power, binding and appeal, confidentiality, opposing parties, limits, preparation standard, hard dates, logistics\n• Hard-code arbitration dates on the CMS Calendar, counted back from the hearing, with alerts\n• Map the UPL boundary and script the words if Laura Whitcomb asks about a bill"
  },
  "case": {
   "say": "• 04/05/2027: the 03/18/2027 mediation before Hon. Carla Benton (Ret.) produced Keystone's $10,000 BI tender\n• BI used up, UM consents in, Robert Smith dismissed\n• Harbor Point and Cardinal State dispute damages, citing the gap; Harbor Point invoked arbitration, Cardinal State joins\n• One binding arbitration before Laura Whitcomb, Esq., hearing 06/22/2027\n• Exhibits exchanged 20 days before the hearing, brief due 10 days before; docket today"
  },
  "check": {
   "say": "• Mediation: Hon. Carla Benton facilitates only, non-binding, held 03/18/2027 inside 03/31/2027\n• Arbitration: Laura Whitcomb acts as judge, binding, narrow review, Harbor Point's clause with Cardinal State joined\n• Opposing parties: Robert Smith, then the UM carriers; limits $20,000 plus $10,000, $30,000; exhibits 06/02/2027\n• Brief: 10 days back is Saturday 06/12, so Friday 06/11, never Monday 06/14\n• Deferral line: \"Case Manager providing administrative assistance; Atty. Thorne will address that\"",
   "ask": "What are the exact words of your deferral line at the hearing?"
  }
 },
 "d4m2-arbcal": {
  "task": {
   "say": "• In Court E-Filing, the master deadline calendar, enter the hearing; re-anchor exchange and brief to the letter, not the 04/05 memo\n• In the Calendaring Simulators, count back: draft index, binder QC opening, last day for certified-records requests, their chase\n• Hold John's attendance confirmation, Atty. Thorne's prep session and the tech check on the CMS Calendar\n• Route the $900.00 to accounting as a case cost\n• Check the master calendar: SOL entries stay; court dates go to Atty. Thorne as a question"
  },
  "case": {
   "say": "• Monday 04/26/2027: Laura Whitcomb's scheduling letter sets the consolidated UM arbitration for Tuesday 06/22/2027, 9:00 a.m.\n• Arbitration: a private hearing where a neutral decides; consolidated: both UM carriers in one hearing\n• Exhibits and witness lists exchanged 20 days before, briefs 10 days before; plaintiff's fee share $900.00\n• Keystone's $10,000 tendered at the 03/18/2027 mediation; Robert Smith out of the case\n• Master calendar still shows the 12/10/2026 Scheduling Order's court dates and the SOL entries"
  },
  "check": {
   "say": "• Hearing 06/22/2027, 9:00 a.m.; exchange 06/02/2027; brief Friday 06/11/2027, rolled earlier from Saturday, never Monday 06/14\n• Binder QC opens Monday 05/17/2027; draft index Friday 05/14; records requests out Monday 05/03/2027, 14-day custodian window, chase ticklers\n• John's attendance confirmed in writing by 04/28/2027; prep session proposed 06/15; tech check 06/21\n• $900.00 logged as a case cost\n• SOL hard date 02/04/2028 and cutoff 11/05/2027 untouched; court dates kept, marked, asked about",
   "ask": "Why is there no calendar entry for the award date?"
  }
 },
 "d4m2-a3": {
  "task": {
   "say": "• Write the impasse memo to Atty. Thorne: offers against limits, Harbor Point's stated reason\n• Quote each layer's dispute clause word for word; mark Cardinal State's as outstanding\n• Lay out both routes and what each requires operationally\n• Ask in writing: route per layer, each layer's suit or arbitration-demand deadline, whether to hear them together\n• Set up the CMS: ADR entry, status, a task per question; draft calendar entries unsaved; script John's procedural explanation"
  },
  "case": {
   "say": "• 04/05/2027, Track B: UM demands went out 03/22 after Keystone tendered its $10,000 BI limits at mediation\n• Both UM carriers' written consents, a Limited Release, Robert Smith dismissed\n• Marcus Bell, Harbor Point: $8,000 against a $20,000 Host UM limit, calling the 14-day gap a causation problem\n• Teresa Okafor, Cardinal State: $6,000 against $10,000\n• Harbor Point's policy has a binding arbitration clause; Cardinal State's certified policy requested, not arrived"
  },
  "check": {
   "say": "• Both named first-party claims, separate from the Keystone claim closed at the March mediation; figures exact, with dates\n• Exhaustion documented; Harbor Point's clause quoted and called binding, no interpretation\n• Cardinal State its own layer, policy outstanding with a chase task, Harbor Point's clause never read onto it\n• Both routes laid out; bad faith only as a question, handling dates as facts; three written questions\n• Nothing docketed; tort SOL not used as a UM deadline; John's explanation procedural only",
   "ask": "Why are the calendar entries drafted and held instead of docketed today?"
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
   "say": "• Mediation 03/18/2027: master index under Documents; six numbered sections, each document in one; the binder prints from it\n• Each entry: section, exhibit number, Bates range, source; exhibit numbers belong to the proceeding, Bates to the page\n• One, summary and admin; two, briefs, ours to the mediator only; three, only the 09/24/2026 complaint and 11/12/2026 answer\n• Five: ledger tied to certified invoices, Riverton $6,290.00 down to $6,105.00, $16,401.40 total; six: Keystone's $3,500 baseline, draft Limited Release\n• Pleadings Log: each pleaded defense needs an answering exhibit in four or five, or a flag\n• OCR, bookmark, check against the index; approved, searchable, delivered by 03/11/2027, audited 48 hours out; never discuss value"
  },
  "model": {
   "say": "• John Doe's binder from above: six navy tabs down the right edge, each with an orange number and name\n• Beside each, a card of this file's documents: RPD-26-018842, the EDR, the 03/13/2026 MRI, the $16,401.40 in Specials\n• Across the top, the master index: exhibit, Bates, source, status\n• Orange lines run one way only, index to binder\n• Right side: a five-second stopwatch and a red warning: drafts and old pleadings never enter the binder"
  },
  "dodont": {
   "say": "• Do: start from the 07/20/2026 Demand Package; most of the binder already lives there\n• Do: bookmark to the page Atty. Thorne will quote, like Dr. Reyes's causation opinion, not the cover\n• Don't: an unorganized file on 03/18/2027, or a snapshot sheet with stale opposing-counsel contacts\n• Don't send the confidential statement late: due 03/11/2027, to the mediator, not the other side\n• Dr. Reyes's causation opinion may need disclosure by 03/15/2027; how is Atty. Thorne's call\n• Red flag: Riverton still at $6,290.00 makes medical read $15,002.40, and Keystone already says the ledger is unverified; use the audited $6,105.00 and re-run totals",
   "ask": "Why does the 03/15/2027 expert disclosure date matter before the mediation, and who is told today?"
  }
 },
 "d4m3-a1": {
  "task": {
   "say": "• Assemble the six-section Mediation Binder in the CMS from the master index, starting with the 07/20/2026 Demand Package\n• Seat each document once with exhibit number and Bates range; map each defense in the 11/12/2026 answer to its exhibit\n• Rebuild the ledger from certified bills to $16,401.40; cross-check balances against what PIP and Peach State paid\n• PIP: John's no-fault medical coverage; add the Negotiation Log, draft Limited Release, UM consent requests\n• Limited Release: ends only the claim against Robert Smith and Keystone"
  },
  "case": {
   "say": "• 03/04/2027, from Atty. Thorne: Mercer says Keystone won't put a real number up while the medical ledger is unverified\n• Draft binder carries Riverton at $6,290.00 and Crescent as an open balance; rebuild from the master index and audit\n• Statement and binder to Hon. Carla Benton (Ret.) by 03/11/2027, through Atty. Thorne first, for the 03/18/2027 mediation\n• John Doe deposed 02/18/2027; certified transcript on file\n• Riverton Spine & Rehab's Final Itemized Ledger: requested 02/08/2027, followed up 02/22, red-flagged 03/01, not arrived"
  },
  "grade": {
   "say": "• The Grade-A Mediation Binder prints from the master index, never the reverse\n• Any document found in five seconds: tabbed, bookmarked, searchable; operative pleadings only, no drafts\n• Order: cover letter to Hon. Carla Benton, master index, then the six sections\n• Download case documents to the training Drive; build the index first; rebuild the ledger from certified bills\n• Write the cover letter and audit memo; upload the binder to the CMS for the audit"
  },
  "audit": {
   "say": "• The Litigation Desk's index from 03/02/2027; on this draft, Atty. Mercer's complaint is right\n• Section five was typed from the providers' original bills: Riverton Spine & Rehab at $6,290.00 on 34 lines\n• Medical total reads $15,002.40, against the $14,817.40 served in July\n• Crescent shows as an open balance Peach State already paid\n• Call every section: what's missing as well as what's wrong",
   "ask": "Two medical totals for one file. Which one holds up, and what proves it?"
  },
  "check": {
   "say": "• Section one: LSH-2026-MVA-770412, No. 26-CV-04417, Atty. Mercer's verified contacts, fee split read from the order\n• Section three: only the filed complaint and answer; every defense mapped to an exhibit number, not \"See Medical Records\"\n• Landmine one: Riverton audited to 33 visits at $185.00, $6,105.00, duplicate removed, pending final verification; total $16,401.40\n• Landmine two: Crescent's $3,400.00 satisfied by Peach State's $1,860.00; open liens $7,965.00\n• Section six log runs 07/20/2026 demand to suit; release and consents stay drafts"
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
   "say": "• The threshold leads: prove BI used up with Keystone's $10,000 tender, consents, Limited Release, Robert Smith's dismissal, never the Mediation Statement\n• Authenticate, prove it's real, with business-records certifications from each provider, Riverton Fire, Riverton PD, Northgate HR\n• Video in its original file with the 02/19/2026 chain of custody, the record of who held it; stills in color\n• Build to the strict standard even if rules are relaxed; number exhibits C-1 onward, freeze once exchanged\n• Nothing crosses from mediation; Lien Sheet stays in Atty. Thorne's set\n• Red flag: Lien Sheet lists Harbor Point PIP at $5,000.00 and Summit at $2,395.00, neither owed; strike both and re-total"
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
   "say": "• MMI 06/12/2026, Dr. Reyes's Causation Letter 06/19, BI demand 07/20\n• The 03/13 MRI: C5-C6 herniation with no significant degeneration next to it; that line is quoted\n• The fourteen-day gap and the April disruption were answered on file before Keystone's offer cited them\n• Specials $16,401.40, billed and audited\n• Repeat injections Dr. Reyes mentioned go in the narrative, note quoted, never in the Specials"
  }
 },
 "d4m3-a2": {
  "task": {
   "say": "• Sort the folder into six tabs using the Exhibit index, Medical Records Requests and Lien Tracker, applying each tab's quality rule\n• Lead with the BI exhaustion record; number exhibits C-1 onward with Bates ranges; log authentication\n• Tab five shield: answer the 2021 low-back visits pressed at the 02/18/2027 deposition and the 08/05/2026 \"degenerative\" MRI reading\n• Strip the Lien Sheet to what's actually owed; flag anything privileged for Atty. Thorne\n• Call Lori Banks at Crescent: find the hold-up, get a delivery date in writing, log it"
  },
  "case": {
   "say": "• 05/17/2027: exhibit exchange in 16 days, Arbitration Binder not started, zero of six tabs\n• Hard date 06/02/2027, before Laura Whitcomb, Esq., on HP-26-7741 and CS-26-20355; carriers dispute damages over the gap\n• Robert Smith dismissed after Keystone tendered $10,000 at the 03/18/2027 mediation\n• Folder: pre-filing draft Complaint, grayscale doorbell stills, 09/08/2026 impasse memo, Lien Sheet with Harbor Point PIP $5,000.00, Summit Imaging $2,395.00\n• Crescent Pain & Spine's certified records, requested 05/05/2027, not in; Memorial Day weekend falls inside"
  },
  "grade": {
   "say": "• Arbitration standard is stricter: the award rests on these exhibits\n• Threshold first: BI used up, proved with signed documents\n• Every exhibit authenticated by its custodian's certification, logged on arrival; nothing from the confidential mediation crosses over\n• Exhibits C-1 onward, production Bates kept; the set freezes once exchanged 06/02/2027; Lien Sheet stays in Atty. Thorne's set\n• Build from the training Drive documents, send to Atty. Thorne, upload to the CMS for the audit"
  },
  "audit": {
   "say": "• The desk's exhibit index from 05/14/2027; Harbor Point is now the other side\n• For each exhibit: decide its tab or withhold it, applying the quality check while sorting\n• Confidential Mediation Statement sits at C-2; no provider certifications requested; authentication log not started\n• Tab one has no exhaustion record proving BI is gone\n• Lien Sheet claims $5,000 for Harbor Point, which gave up reimbursement in writing in March; at least one more problem remains",
   "ask": "Harbor Point is the opponent now. What changes about what gets sent?"
  },
  "check": {
   "say": "• Tab one: snapshot, 06/11/2027 brief slot; threshold first: $10,000 tender, consents, Limited Release, dismissal, both Coverage Letters\n• Tab two current versions only, draft gone; tab three certified RPD-26-018842, color stills from the original file\n• Tab four ties $14,817.40 to certified bills; tab five pairs the 2021 records with the MRI read and Causation Letter\n• Lien Sheet drops Harbor Point and Summit, leaving $7,965.00; tab six wages, $1,584.00\n• The impasse memo is privileged: flagged, never exchanged; Atty. Thorne decides"
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
   "say": "• Bottleneck: anything that can stop the file reaching a hard date; log it the day it starts, with its threatened date\n• Follow up a silent adjuster every 5 business days: Keystone left 08/24 and 08/31/2026 unanswered, then 09/02 escalation\n• Record silence as dated facts: what, since when, what date at risk; never \"adjuster busy\"\n• Record unanswered 14 days is a bottleneck; ledger $16,401.40, Riverton $6,105.00, Peach State $1,860.00\n• Brief to Hon. Carla Benton by 03/11/2027; chase, document, flag; remedies and value are Atty. Thorne's"
  }
 },
 "d4m4-a1": {
  "task": {
   "say": "• Set four rules in the CMS under Tasks, Countermeasure rules, with the Calendar and Risk Flags\n• Rule 1, silence: follow-ups every 5 business days; 48 hours after the second, supervisor; 48 more, Atty. Thorne\n• Rule 2: record not received 14 days after request gets a second request and a subpoena flag for him\n• Rule 3: a hard date 10 days out with something missing gets a red flag\n• Rule 4: 48-Hour Mandate audit before every hard date, with fallback; holiday moves it earlier; calibrate, then fire all four"
  },
  "case": {
   "say": "• 02/22/2027: Riverton Spine & Rehab's Final Ledger, its full list of charges, requested 02/08/2027, is 14 days overdue: a bottleneck\n• The Mediation Binder needs it; due to Hon. Carla Benton (Ret.) 03/11/2027, session 03/18/2027\n• Keystone's attendee and authority unconfirmed; the file has no countermeasure rules, automatic alarms for silence\n• Demand-stage audit: Riverton $6,105.00, 33 visits at $185.00; Peach State paid $1,860.00 on Crescent's $3,400.00\n• Calibrate first: enter the Keystone dates and watch Rule 1 fire 09/02 and 09/04"
  },
  "check": {
   "say": "• Calibration: Rule 1 fires 09/02/2026 and 09/04/2026, memo 09/08\n• Rule 2 fires 02/22/2027, 02/08 plus 14: Notice of Delay, second request; subpoena flag is a question for Atty. Thorne\n• Rule 3 red flags 03/01/2027 for the ledger, 03/08/2027 for Keystone's attendee with authority; Rule 4 audits 03/09 and 03/16/2027\n• Peach State's $1,860.00 closes Crescent's bill; the $1,540.00 written off is never a lien\n• Fallback: the $6,105.00 interim ledger until the Final Ledger arrives",
   "ask": "Which firing date would you double-check first, and why that one?"
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
   "say": "• Sort all five in the CMS: Conflict Resolver (calendar checker), Bottleneck Log (stuck items), Tasks, Escalate\n• For each: the hard date threatened, the ladder step reached, the countermeasure that applies\n• Order them: what goes to Atty. Thorne first, what to fix today, what the 48-hour audit checks and when\n• One bottleneck report sent 05/24/2027: five fields and one ask per item needing his decision\n• Call Teresa Okafor: ask if Cardinal State has a lawyer, confirm format and exchange in writing, no gap or value talk"
  },
  "case": {
   "say": "• Monday 05/24/2027: nine days to the 06/02/2027 exhibit exchange before Laura Whitcomb, Esq.; five open items\n• One: Crescent Pain & Spine's certified records for the 05/15/2026 injection, requested 05/05, second request 05/19, nothing\n• Two: Dr. Reyes's declaration shielding the 2021 low-back visits; Lakeside says she's away until 06/01/2027\n• Three: Teresa Okafor, Cardinal State, hasn't confirmed format or exchange method; 05/21 supervisor escalation unanswered\n• Four: Riverton's refreshed ledger shows the $6,290.00 duplicate again; five: grayscale stills, scans not OCR-searchable"
  },
  "check": {
   "say": "• Every item maps to the 06/02/2027 exchange, inside the red-flag window\n• Items one to three to Atty. Thorne first, one report on 05/24/2027, nearest hard date first\n• Item three: check CMS Parties for a lawyer; never email the arbitrator; 48 hours ran out Sunday, so step three today\n• Item four: keep $6,105.00, duplicate documented; item five: reprint in color, make scans searchable; audit Friday 05/28/2027\n• Item one's real cause: the firm's own late request",
   "ask": "Why does the 48-hour audit move to Friday 05/28/2027 instead of the following Tuesday?"
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
   "say": "• Track B: the 07/20/2026 Time-Limited Demand to Keystone lapsed unaccepted on 08/21/2026; the 48-Hour Mandate got no answer\n• Atty. Thorne filed suit 09/24/2026, Civil Action No. 26-CV-04417; now a judge sets the pace, not an adjuster\n• Pleadings Log: the running list of everything filed and served\n• Discovery Calendar: every date either side owes the other something\n• Red flag: fifteen RFAs lack their own row. An unanswered RFA may be deemed admitted. Give each a row; tell Atty. Thorne within the hour"
  },
  "rules": {
   "say": "• From the 09/24/2026 filing the court sets the pace; litigation is not a longer negotiation\n• Before Atty. Thorne signs: check the filing date against the SOL (deadline to sue) and the defendant's exact legal name\n• Log every service attempt; unserved at day 14 (10/08/2026), escalate for Skip-Trace authority; Smith served 10/14/2026\n• An RFA unanswered past its deadline may be deemed admitted, treated as true; calendar it the day it lands\n• Hold a Discovery Intake Meeting with John Doe, never mail him the 70 requests; never tell him how to answer"
  }
 },
 "d5m1-a1": {
  "task": {
   "say": "• Repair the Pleadings Log and Discovery Calendar in CMS: Litigation, Calendar and Documents\n• Add missing rows; recompute each response date from trigger and service method, math in the row\n• File each document in its numbered sub-folder, properly named; calendar the Scheduling Order's six dates\n• Graded call: RFA deadline passed with no row; prove compliance from the Certificate of Service, record misses, report to Atty. Thorne today\n• Jenna Price, Atty. Mercer's paralegal, calls: log her exact words and time, take no position, route to Atty. Thorne"
  },
  "case": {
   "say": "• 01/05/2027, Track B: 26-CV-04417 is three months old; calendar corrected 12/10/2026, Pleadings Log never reconciled: five mismatches\n• Affidavit of Service, filed 10/16/2026, sits in an Allied Process Services email with no row; the only proof Smith was served\n• Interrogatories and RFPs mailed 12/01/2026 share one row, due 12/31/2026; calendar shows 01/04/2027; no row for the 15 RFAs\n• Scheduling Order saved as scan_1210.pdf; a Certificate of Service dated 01/04/2027 sits in Documents unlogged"
  },
  "check": {
   "say": "• Affidavit row: personal service 10/14/2026 by Allied Process Services, filed 10/16/2026, saved in 02_SERVICE_DOCS\n• Interrogatories and RFPs corrected to 01/04/2027, count written; 15 RFAs on their own row with a red deemed-admission flag\n• Certificate of Service logged with signed verification; Smith's responses due 01/13/2027, no extra mail days for e-service here\n• Scheduling Order renamed, in 01_PLEADINGS, six dates in; late rows recorded as misses, never back-dated",
   "ask": "Why doesn't the e-served set get three extra mail days, and who confirms it?"
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
   "say": "• Audit the checklist line by line against the 12/10/2026 Scheduling Order: right date, an owner, 30-, 14- and 7-day alerts\n• Add the 02/18/2027 deposition logistics and the prep document set\n• Build the KPI tracker in CMS, Litigation: nine KPIs, formula, target, sourced reading, met, missed or open\n• One task each for three review lenses: coverage, treatment, liability\n• Graded call: which two items go to Atty. Thorne first"
  },
  "case": {
   "say": "• 01/20/2027: notice of John Doe's deposition, 02/18/2027, 10:00 a.m., by videoconference, Riverton Court Reporting\n• The trial-prep checklist was drafted from the calendar before the 12/10/2026 audit and never reconciled\n• It shows experts 04/15/2027, mediation 03/31/2027 as a session date, June 2027 records subpoenas, records from the old Demand Package\n• No alerts, no deposition tasks, no KPI tracker; Smith's 01/13/2027 responses never docketed"
  },
  "check": {
   "say": "• Firm's experts 03/15/2027, 04/15/2027 kept as the defense date; mediation completed by 03/31/2027\n• Records subpoenas back before 05/28/2027; 04/28/2027 flagged as last day to e-serve a 30-day request; 18 alerts\n• Deposition notice docketed by 01/22/2027, reporter confirmed, packet set for 02/11/2027\n• Gap Record lists documents: EMS report, Northgate attendance, texts to Margaret, MRI read, Causation Letter; nothing scripted for John\n• Nine KPIs complete; Smith's 01/13/2027 responses logged as a docket miss and routed",
   "ask": "Which two items went to Atty. Thorne first, and why those two?"
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
   "say": "• Skill Scale: rate each skill 1 to 5 honestly, then submit for review\n• Skills include computing court deadlines, the Pleadings Log and Discovery Calendar, the trial-prep audit and KPIs\n• Ratings are compared with scores; wide gaps get discussed\n• UPL, legal advice from a non-lawyer, is a gate: a strong score doesn't survive an ethics breach",
   "ask": "Which skill might your self-rating and score disagree on?"
  }
 },
 "d5m2-l1": {
  "why": {
   "say": "• Day 1's question returns: does Property Damage touch John Doe's case, now with money on the table\n• Keystone's $792.00 offer on Margaret's Civic does not lower John's settlement\n• Her Loss of Use and Diminished Value come from Keystone's $25,000 Property Damage limit, outside John's $40,000 stack\n• Three things can reach John: a too-wide release, the photos and estimates in his severity set, the rental dates behind his gap\n• Red flag: Keystone's release, \"all claims arising from\" the 02/06/2026 accident, can reach John's BI suit. Accept, reject, counter nothing; Atty. Thorne gets it"
  },
  "rules": {
   "say": "• Read the release before the numbers: Keystone's 12/10/2026 release covers all claims from the 02/06/2026 accident, for Mr. Doe to sign\n• A Property Damage release must never release the injury claim\n• Check the claim number: KM-26-440871-PD for the car, KM-26-440871 for John; hold it, route to Atty. Thorne same day\n• John signs nothing; photos, estimate, $2,315.00 supplement and rental dates stay identical on both files\n• Never accept, reject, counter or value a car figure"
  }
 },
 "d5m2-a1": {
  "task": {
   "say": "• Read the release's scope and claim number before any dollar figure\n• Hold it and route it to Atty. Thorne in Tasks, escalated the same day\n• Sort each outcome: release, Diminished Value, Loss of Use, severity set, rental dates; John's settlement or Margaret's file, and why\n• Take Leah Moran's call: accept nothing, reject nothing, counter nothing\n• Memo to Atty. Thorne ending in one line: does this touch John's case, and how?"
  },
  "case": {
   "say": "• 12/10/2026: email from Leah Moran at Keystone's Property Damage desk, with a release, not a check\n• Keystone's final position on Margaret's Civic: $792.00 Diminished Value, $0 Loss of Use\n• Release covers all claims from the 02/06/2026 accident, for Mr. Doe to sign so payment can go out; Leah calls this afternoon\n• John's injury suit is in discovery; Atty. Thorne wants to know what this changes for John"
  },
  "check": {
   "say": "• Release flagged and routed the same day, nobody asked to sign, claim numbers checked\n• Diminished Value and Loss of Use on Margaret's file; John's liens and Net Sheet unchanged\n• Severity set and rental dates match on both files; Leah told only that it is with Atty. Thorne\n• Memo leads with the decision Atty. Thorne must make and ends with the answer",
   "ask": "What exactly was Leah told when she asked whether Mr. Doe would sign?"
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
   "say": "• Run the segment in the Call Simulator with AI John Doe\n• Confirm his new number, Margaret as backup; state logistics exactly; set a 02/16/2027 test call on his device and room\n• Deliver the three pillars and room rules; practise the two-second pause on neutral questions only\n• AI John asks about the gap, missed April therapy, seatbelt, 2021 chiropractor visits, MRI: all substance, answer none\n• Log each in his words to Atty. Thorne through Tasks, Escalate; hand in segment, logistics record, routed questions"
  },
  "case": {
   "say": "• 02/04/2027, Track B: John went silent 01/22/2027; reached yesterday through Margaret, with a new phone number\n• Deposition 02/18/2027, 10:00 a.m., videoconference, Riverton Court Reporting; John is anxious, expecting a TV-style cross-examination\n• Prep session one, 1:00 p.m.: the Case Manager opens with new number, logistics, test call, three pillars, room rules\n• Atty. Thorne listens, then takes the substance; John's gap set ready to share on screen\n• Graded on routing: answering even one substantive question fails"
  },
  "check": {
   "say": "• New number updated in CMS, Parties; Margaret confirmed as backup\n• Logistics stated exactly: 02/18/2027, 10:00 a.m., videoconference, Riverton Court Reporting; 02/16/2027 test call set\n• Setting explained with no outcome predicted; pause practised on neutral questions; dress talk given as standard advice\n• Room rules: private room, no one else, no notes, no phone, no messaging\n• All five substantive questions routed, logged in John's words; \"tell the truth\" is a rule, \"say you had no ride\" a script",
   "ask": "Using the gap, what's the difference between a rule and a script?"
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
   "say": "• Keep the Trap Log in CMS, Litigation, Deposition prep log, while the mock runs\n• Each trap: timestamp, Mercer's exact words, category, trap type, Golden Rules kept or broken\n• Mischaracterisation, a fact described wrongly: add the record fact and source; log each objection and whether John stopped\n• Route the log to Atty. Thorne before his debrief; coach nothing; nothing in it goes to John"
  },
  "case": {
   "say": "• 02/16/2027, second prep session: at 2:00 p.m. Atty. Thorne runs a mock cross-examination, a practice round\n• Roles: Atty. Thorne leads and defends; AI defense counsel plays Atty. Grant Mercer; AI John Doe answers; the Case Manager observes\n• Microphone muted throughout; the job is the Trap Log\n• Each trap's time, Mercer's exact words, the record fact beside any mischaracterisation, every objection\n• Atty. Thorne debriefs John from the log, so it must reach him before the session ends"
  },
  "check": {
   "say": "• All six traps, plus the silent stare if used, each timestamped, in Mercer's exact words, with a category\n• Gap: 14 days, 02/06/2026 to 02/20/2026; disruption: 19 days, 04/02/2026 to 04/21/2026\n• Degenerative: the 03/13/2026 MRI, no significant degenerative change at the adjacent levels\n• Seatbelt: EMS Run Report and EDR download; 2021: three resolved low-back visits, no prior neck complaints\n• No nodding, chat or words to John; that is coaching",
   "ask": "Which trap worked on John, and which rule would have protected him?"
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
   "say": "• Build the liability counter-package in CMS, Litigation\n• Each allegation: evidence, source document, witness, chain of custody, any foundation gap\n• Write the doorbell video's chain from the 02/17/2026 preservation request to the 02/19/2026 copy\n• Needed custodian: draft a narrow Exhibit A from the firm's template in CMS, Documents, for his review\n• Close with his questions: governing fault rule, seatbelt and citation admissibility, whether fault on Kevin Alvarez touches coverage"
  },
  "case": {
   "say": "• 11/12/2026, Track B: Atty. Grant Mercer of Mercer & Hale LLP files Robert Smith's Answer in 26-CV-04417\n• Denies liability; pleads comparative negligence (out of turn, unbelted), causation (gap, degenerative MRI), failure to mitigate\n• Atty. Thorne wants per allegation: evidence, source, authenticating witness (who can swear it's genuine), chain of custody, plus his questions\n• On file: report RPD-26-018842, Ruth Calloway's details, doorbell video, 10/2026 EDR download, EMS Run Report, A-C-T record"
  },
  "check": {
   "say": "• Three rows: out of turn, unbelted, failure to mitigate\n• Out of turn: RPD-26-018842, Ruth Calloway of 2209 Maple Hollow Rd, video, point of impact; EDR's 11 mph only corroborates\n• Unbelted: EDR and EMS report; mitigation: A-C-T record, 19 days, 04/02 to 04/21/2026, four missed visits, documented anxiety\n• Video chain from Margaret Doe's camera, 02/17 and 02/19/2026, native file unaltered; every item has a witness\n• Exhibit A: only John's 02/06/2026 Riverton Fire EMS run, named record types; stack still $40,000",
   "ask": "Why does a narrow Exhibit A get records faster than one asking for everything?"
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
   "say": "• Part one: escalate for Skip-Trace authority through Tasks, Escalate; evaluate the 10/09 return\n• Pick the address on recency and two corroborating sources; record why; re-instruct Allied; log service, affidavit, answer date\n• Part two: No Contact Protocol Steps 1 to 3 with the litigation impact; then draft Step 4, the Final Warning Letter\n• From the CMS template, for Atty. Thorne's signature: attempts itemized, 7 to 14 day response before 02/04/2027\n• Call Margaret Doe: verify identity, say only the firm needs John to call, log it; assess John's Skip-Trace gate"
  },
  "case": {
   "say": "• Part one, 10/08/2026: Allied Process Services' third failed attempt at 118 Larkspur Ln, 6:40 p.m., after 10/01 and 10/05\n• A neighbor says Robert Smith moved out in August\n• 10/09 Skip-Trace return: 118 Larkspur Ln (utilities closed 08/2026); 4410 Quarry Ridge Ct, Millbrook (utility opened 08/2026, matches registration); a 2019 address\n• Part two, 01/22/2027: John unanswered, two days after his deposition was noticed for 02/18/2027; prep 02/04 and 02/16/2027"
  },
  "check": {
   "say": "• Part one: Skip-Trace escalated, no fourth knock; 4410 Quarry Ridge Ct on two current sources; 118 Larkspur Ln rejected as stale\n• Service 10/14/2026, affidavit 10/16/2026, answer docketed 11/13/2026\n• Part two: Step 1 names the deposition 27 days out, prep dates, 03/15/2027 expert disclosure; calls, email, text, then Margaret\n• 14 days from 01/22 lands 02/05, too late; sent by 01/27/2027, response by 02/03/2027\n• Certified mail to 2214 Maple Hollow Rd plus email, Atty. Thorne signing; no withdrawal language; gate not met, John reached 02/03/2027",
   "ask": "Where does the notice's response date fall against the 02/04/2027 prep session?"
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
   "say": "• LSH Net Sheet: section one, gross by carrier; section two, the 40% fee and every receipted cost on its own row\n• Section three: every provider and payer, charges to balance, each reduced lien with its Payoff Letter; section four, net to John\n• Tie it to the CMS Trust Ledger, the record of money in the firm's trust account\n• Route the Settlement Statement through Tasks, Escalate; on John's call, walk fee, costs, liens, net, the 40% in his retainer"
  },
  "case": {
   "say": "• 07/22/2027: the 07/06/2027 award gave Harbor Point's $20,000.00 and Cardinal State's $10,000.00\n• Harbor Point's check came 07/20, Cardinal State's this morning; with Keystone's $10,000.00, in trust since 03/29/2027, all $40,000.00 is in trust\n• Peach State accepted $1,116.00 on 07/14, Riverton Spine & Rehab $4,275.00 on 07/16, in writing; every cost receipted\n• Suit was filed, so the 40% tier of John's retainer; Atty. Thorne reviews before John sees anything\n• Open the Net Sheet at the Track B stage"
  },
  "check": {
   "say": "• Gross: Keystone $10,000.00 from mediation, Harbor Point $20,000.00 and Cardinal State $10,000.00 from the award: $40,000.00\n• Fee 40%, $16,000.00, from the retainer; costs $3,895.25, each row receipted\n• Liens: Peach State $1,860.00 to $1,116.00; Riverton Spine & Rehab $6,290.00, audited $6,105.00, to $4,275.00; total $5,391.00\n• Zero-balance lines, PIP's $5,000.00 and Crescent's $1,540.00 write-off, stay off the payables\n• Net $14,713.75 tied to trust; John signs 07/29/2027, disbursement 07/30/2027; no lien paid from a phone call",
   "ask": "Does the Trust Ledger tie to $40,000.00 to the cent, and if not, how is the gap found?"
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
   "say": "• Work in CMS, Documents, from the firm's approved templates; record the gate checked first\n• Three Withdrawal Letters for Atty. Thorne's signature\n• Denise's: date, name, date of loss, reason in his note's words, next step: another attorney promptly, time limits apply\n• Granite Shield's and Brookside's: date, client, date of loss, claim number; only that the firm no longer represents her\n• Name each send method and why; write the close-out log; expect Denise to ask if her case was worthless"
  },
  "case": {
   "say": "• Practice matter, not John Doe's file; don't create it in the CMS; date 12/09/2026\n• Denise Harlow, rear-ended at a red light 09/19/2026; Granite Shield Insurance BI claim GS-26-48213; adjuster Paul Ostrander takes email only\n• Treated at Brookside Physical Therapy 09/24 to 10/29/2026, then stopped: no Health Plan; Brookside declined a Letter of Protection\n• Letter of Protection: the firm's written promise to pay a provider from any settlement\n• Pending Drop; Atty. Thorne's 12/08/2026 note: Denise told, understood; 87 Alder Creek Dr confirmed; prefers text and email"
  },
  "check": {
   "say": "• Gate recorded: Pending Drop and the 12/08/2026 note, confirmed before anything was prepared\n• Denise's letter dated 12/09/2026, date of loss 09/19/2026, his reason quoted, approved next step\n• Granite Shield's shows GS-26-48213 and the date of loss; Brookside's asks for updated records; neither says why\n• Word and PDF saved; Denise by text, email and Certified Mail to 87 Alder Creek Dr; Granite Shield email; Brookside fax\n• Each send logged; follow-up 12/16/2026; Dropped only after that, proof kept",
   "ask": "If the receipt isn't back by 12/16/2026, what is the next step?"
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
    "say": "• Welcome; today starts John Doe's case from the beginning\n• Lessons: the case, your role, facts vs. legal advice, reading the file, Case Plan & treatment, client communications, the car (repair, rental)\n• Then 7 Skill Activities in the CMS on his real file\n• Knowledge Check: 70% opens Day 2"
   },
   "lab": {
    "say": "• Open the CMS beside the slides\n• Seven Skill Activities in order: open the case with the Conflict Check first; link Google Drive and build backup folders\n• Work the voicemail and deliver the Direction Packet; assign directions in the system; sort the Civic's Property Damage file\n• Then two client communications activities: outreach logging and the final warning letter\n• Every field matches a document, every correction has a source, every step logged"
   },
   "wrap": {
    "say": "• Robert Smith's insurer has already called John Doe, and he needs a car for work\n• Discuss what to tell him today, in what order\n• Cover: the do's and don'ts in plain words and the rental path\n• Log every step the same day; route anything legal to Atty. Thorne\n• What John says this week stays in the adjuster's notes for the life of the case",
    "ask": "What would you tell John Doe first, and why first?"
   },
   "lifemap": {
    "say": "• The whole of John Doe's file on one slide, in the order we work it this week\n• Across the top: the six stages you carry on every file\n• Day 1 it's raw: the loss, the SOL docketed, the matter opened in the CMS\n• Then claims and care, the demand, liens and ADR, and litigation to the close\n• Each day picks the file up where the last one left it",
    "ask": "Which one date on this track would you protect first, and why?"
   },
   "coverage": {
    "say": "• Three layers pay in order: BI $10,000, Host UM $20,000, Relative UM $10,000\n• $40,000 is the cap, so the care and records must prove value through all three\n• Before any BI release: the UM consent to settle and the subrogation waiver\n• The Health Plan pays care now and recovers from the settlement, so plan the reduction early\n• The gap before treatment is the weak point: name it on Day 1, with its reason documented",
    "ask": "If the BI adjuster offered the full $10,000 tomorrow, what must be on the file before anyone says yes?"
   }
  },
  "2": {
   "agenda": {
    "say": "• Welcome back; today covers John Doe's claim set-up and treatment\n• Claim set-up lessons: coverage tracking, affidavits, liability, decision-first notes, LORs; then the treatment plan and Case Plan\n• Treatment lessons: payers, LOPs, EOBs, PIP strategy, the EMC rule, costs, health subrogation, A-C-T monitoring\n• Then 10 Skill Activities in the CMS on his real file\n• Knowledge Check: 70% opens Day 3"
   },
   "lab": {
    "say": "• Open the CMS beside the slides\n• Ten Skill Activities in order: verify the Policy Stack, send LORs to all three carriers, audit the Coverage Matrix\n• Flag the 14-Day Gap, draft the Case Plan for Atty. Thorne; transmit LOPs: Riverton yes, Summit declined\n• Redirect the referral John won't attend, audit Peach State's lien, re-engage John in the near-drop, sort the backup drive\n• Every note says who, when, which channel, what was said and what happens next"
   },
   "wrap": {
    "say": "• Scenario 04/08/2026: Keystone confirmed its limit in writing 03/20; Riverton Spine & Rehab reports two missed visits\n• Dana Whitfield has asked John Doe for a Recorded Statement\n• Discuss first, second and third steps and what each protects\n• Cover: stop the recorded call through the firm that day; reach John on every approved channel and log it\n• Missed visits go to Atty. Thorne with facts and a plan; ask why before assuming",
    "ask": "Which of those three moves comes first, and what does it protect?"
   }
  },
  "3": {
   "agenda": {
    "say": "• Welcome back; from Day 2: when John's ride ended, ask the clinic about transportation help, log it, tell Atty. Thorne\n• Lessons: the Gap Explanation Record, pre-demand case auditing, the demand, settlement negotiations, the UM consent and waiver, the settlement release\n• Specials: out-of-pocket damages like Medical Bills; Time-Limited Demand: an offer with a deadline\n• Then 14 Skill Activities in the CMS on John Doe's file\n• Knowledge Check: 70% opens Day 4"
   },
   "lab": {
    "say": "• Open the CMS beside the slides; 14 Skill Activities, three with AI role-play: John Doe, Atty. Thorne, the adjuster\n• Build the Gap Explanation Record from John's own words, audit the Specials, audit the backup drive against the CMS\n• Serve the BI demand with its deadline; QC the two UM demands, the coverage that pays when the other driver's runs out\n• Negotiate, close the $40,000, build both Net Sheets, every dollar in and out\n• In role-plays, listen and ask the next question; every number in the demand must be exact"
   },
   "wrap": {
    "say": "• 07/20/2026: Specials audited; Atty. Thorne approved a policy-limits demand to Keystone\n• Discuss what must be true before the Time-Limited Demand goes out\n• Cover: every record and bill included, numbers matching the audit, a clear reasonable deadline, proof of receipt, Atty. Thorne's sign-off\n• One missing page lets Keystone argue it never had a fair chance to settle\n• Next: the $40,000 gross meets the bills, and how it gets split",
    "ask": "What must be true before the Time-Limited Demand goes out to Keystone?"
   }
  },
  "4": {
   "agenda": {
    "say": "• Welcome back; today covers the money side of Track A, the settled file, then Track B, where it doesn't settle\n• Lessons: liens and provider balances, reductions, the Net Sheet, the release audit, disbursement and closing\n• Then court hard rules and calendar, UM disputes, mediation versus arbitration, and the two binders\n• Then 13 Skill Activities in the CMS on John Doe's file\n• Knowledge Check: 70% opens Day 5"
   },
   "lab": {
    "say": "• Open the CMS beside the slides; 13 Skill Activities on both sides of the same file\n• Settled side: Health Plan and statutory lien reductions, provider balances, the final Net Sheet with both tabs\n• Then audit the release, trigger the disbursement, back up the lien file and restore the missing folder\n• Unsettled side: route the UM impasse, audit court hard rules and cutoffs, calendar the mediation and arbitration\n• Map the ADR rules and the UPL line; build both binders; every date checked against its source letter"
   },
   "wrap": {
    "say": "• John Doe's net from the $40,000 is $20,359.92\n• Scenario: Keystone's draft release arrives 08/14/2026, releasing \"all other persons, firms, corporations and insurers\"\n• Harbor Point hasn't answered the consent request; Atty. Thorne is out until Monday\n• Flag that language, since it could release the UM insurers; chase Harbor Point's consent in writing; log everything\n• Nothing gets signed until Atty. Thorne reviews it",
    "ask": "What must not happen before Atty. Thorne is back, and why?"
   }
  },
  "5": {
   "agenda": {
    "say": "• Welcome back to the last day: Litigation and Dropped Cases on John Doe's file\n• Lessons, about 30 minutes: the litigation fork and filing, bottlenecks and escalation, litigation tracking, trial prep, subpoenas\n• Then: Property Damage at settlement, deposition prep, comparative negligence and skip-tracing, the award and Net Sheet, Dropped Cases\n• Then the Full Application Practice: about 150 minutes building the assigned companion case\n• John's 15 Skill Activities are optional extra practice; Knowledge Check: 70% finishes the Case Flow"
   },
   "lab": {
    "say": "• Practice Lab: 15 Skill Activities on John Doe's file in the CMS, optional extra practice today\n• Litigation fork and litigation status, e-filing the Complaint and calendaring service, CMS countermeasures, a bottleneck\n• Pleadings and discovery logs, trial-prep checklist audit, Keystone's final Property Damage position, deposition prep, mock cross-examination\n• Liability counter-package, skip-tracing, Litigation Net Sheet, final backup audit, Denise Harlow's Dropped Case\n• Calendar everything each task starts; in litigation a missed date can end the claim"
   },
   "wrap": {
    "say": "• 01/05/2027: opposing counsel's paralegal says discovery responses are late; John Doe changed his number; deposition set 02/18/2027\n• Confirm the real discovery deadline on the calendar; tell Atty. Thorne today\n• Start outreach on every approved channel and log it; if John stays silent, begin the skip-trace steps\n• Protect the deposition date; more time, or what to tell the other side, is Atty. Thorne's call\n• Late discovery can cost the client evidence and money",
    "ask": "What do you do today, in what order, and what is Atty. Thorne's call, not yours?"
   },
   "build": {
    "say": "• Full Application Practice: about 150 minutes building the assigned companion case, worked like John Doe's file\n• Step 1, read the file; step 2, open it in the CMS, Conflict Check first on every party's full legal name\n• Step 3, the folder by the SOP: [Your Full Name] - [Case Name], nine subfolders, connected, intake documents uploaded\n• Step 4, the claims: every carrier in the stack, Letters of Representation, verification status, coverage matrix\n• Time is called at each step; each case has its own problem to find",
    "ask": "What is the first fact on your case to confirm, and where?"
   },
   "build2": {
    "say": "• Second half: steps 5 to 7\n• Step 5, plan the care: treatment map, 14-day rule and any gap, who pays first, whether an LOP is needed\n• LOP, Letter of Protection: the firm's written promise to pay a provider from the settlement\n• Step 6, the Case Notes entry for Atty. Thorne: decision first, then the deadline it hangs on\n• Step 7, check the work: every document in the CMS and case folder, CMS Case ID logged",
    "ask": "What decision does the note to Atty. Thorne lead with?"
   },
   "extra": {
    "say": "• Optional extra practice: John Doe's 15 Day 5 Skill Activities, untimed\n• Today's practical was the companion case\n• Worth coming back to soon: the deposition prep and the Dropped Case close-out\n• Most rooms go straight to the Knowledge Check"
   }
  }
 }
};
