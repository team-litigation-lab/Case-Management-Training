/* Day 4 — hand-written spoken scripts, one per slide (see slideScript() in index.html).
   p1 = the topic's first slide, p2 = its second slide. Each follows four beats:
   why (the punchline) · talk (plain spoken explanation) · walk (the points in order: first, next, then, finally) · ask (an action or question) · scenario (a short case situation to work through with the room). */
window.SLIDE_SCRIPTS = Object.assign(window.SLIDE_SCRIPTS || {}, {
 "4::Welcome to Day 4: When Pre-Suit Negotiations Stall": {
  "p1": {
   "why": "Today the case leaves the negotiating table and steps into formal dispute resolution, and you're the engine that keeps the attorney ready.",
   "talk": "Days 1 to 3 covered intake, tracking treatment and building pre-litigation demand packages. Today is about what happens when those pre-suit negotiations stall, and we step into formal dispute resolution: mediation, arbitration and litigation. Your role in these phases isn't just administrative. You keep the attorney fully armed, organized and ready to win.",
   "walk": [
    "First, mediation. We'll cover the protocols, the scheduling logistics, how to prep the binder, and how to audit it before the attorney walks into the room.",
    "Next, arbitration. That means a trial-ready mindset, hard calendar rules, UPL boundaries and evidentiary binders. UPL is the unauthorized practice of law, the line between what we can do and what only a lawyer can do.",
    "Finally, the common bottlenecks in mediation and arbitration. We'll learn to spot them early and get rid of them before they slow the case down."
   ],
   "ask": "Raise your hand if you can tell me the core operational difference between mediation and arbitration.",
   "scenario": "Negotiations on the Warren case have stalled at $40,000 against your $95,000 demand, and the adjuster won't move. The attorney says, 'Let's go to mediation, and if that fails, arbitration.' What changes in your job from this moment, and what's the first thing you'd put on the calendar?"
  },
  "p2": {
   "why": "In mediation and arbitration, a small slip isn't a hold-up anymore; it can cost us evidence or our leverage.",
   "talk": "Here's the difference in plain words. Mediation is a voluntary, non-binding negotiation: a neutral mediator helps both sides try to reach a compromise, and the parties keep total control over whether to settle. Arbitration is formal and trial-like: the arbitrator acts as the judge, issues a final, binding Award, and the right to appeal is extremely limited.",
   "walk": [
    "First, know how the stakes change. In pre-litigation, a late document might be a minor hold-up. Here, a missed deadline, or a critical exhibit printed in low-quality grayscale, can get evidence excluded or lose us our leverage entirely.",
    "Next, today is about a shift in how we work: from passively tracking the file to proactive, airtight operational auditing. We don't wait for a problem to show up; we go looking for it.",
    "Finally, the pitfall to watch: treating mediation and arbitration as the same thing. One is a negotiation where the client decides whether to settle; the other ends in a binding decision. They need very different prep."
   ],
   "ask": "So why do cases get routed to mediation or arbitration instead of going straight to a jury trial? What do you think the courts look like right now?",
   "scenario": "Before a mediation, a Case Manager sends the updated medical ledger two days late, 'because that was fine during negotiations.' The defense uses the late ledger to argue the damages aren't verified. Why does a small delay matter more now than it did before?"
  }
 },
 "4::Introducing the Neutral: Mediator vs. Arbitrator — Expertise & Background": {
  "p1": {
   "why": "Both are usually retired judges or seasoned attorneys with decades of PI experience, but their jobs are very different.",
   "talk": "The person in the middle of these proceedings is called a neutral. Understanding who these neutrals are, how they get onto our cases and how much power they hold is critical for managing case flow and setting client expectations. Mediators are usually experienced personal injury trial attorneys or retired judges. Arbitrators are usually retired judges or senior trial attorneys.",
   "walk": [
    "First, the mediator's skill is people and negotiation. They find common ground, defuse emotion, and spot the weak links in a defense argument. They specialize in negotiation dynamics, lien resolution and realistic case valuations, so they're thinking about what the case is worth.",
    "Finally, the arbitrator's skill is strictly judicial. They evaluate the raw evidence, apply state tort law and decide who wins. Their mastery is evidentiary rules, liability standards and medical causation, so they're asking what the evidence actually proves."
   ],
   "ask": "Picture a mediator and an arbitrator reading the same case file. What do you think each one looks for first?",
   "scenario": "Your client asks, 'Is the mediator going to decide who's right?' Next month, a different case goes to arbitration. How would you explain the difference between the two neutrals to a nervous client, in plain words?"
  },
  "p2": {
   "why": "Know who's reading the binder, because a mediator and an arbitrator are looking for different things.",
   "talk": "The practice here is simple: build the binder for the person who'll use it. A mediator is weighing value and trying to get a deal done. An arbitrator is weighing proof and deciding who wins.",
   "walk": [
    "First, tailor the binder's emphasis to the neutral. For a mediator, lead with valuation: what the case is worth and why. For an arbitrator, lead with evidence: what we can actually prove.",
    "Finally, the pitfall to watch: preparing an arbitration binder like a negotiation packet. The arbitrator isn't there to help anyone compromise; they're ruling on the evidence. A packet built for settlement talk leaves them without the proof they need."
   ],
   "ask": "Your turn: how does the neutral's background change your binder prep? Give me one thing you'd put up front for a mediator, and one for an arbitrator.",
   "scenario": "You're building two binders this week: one for a mediation and one for an arbitration hearing. What would you put at the front of each binder, and why do they need different emphasis?"
  }
 },
 "4::Introducing the Neutral: Assignment & Selection Workflows": {
  "p1": {
   "why": "As Case Managers, you help your attorney review resumes and submit strike lists.",
   "talk": "Mediators are almost always chosen by mutual agreement. Both sides review panel resumes and agree on someone known for fair evaluations, or, if a judge orders mediation, the mediator comes from a court-approved roster. Arbitrators work differently. Especially in UM claims, that's uninsured motorist claims, the policy contract often dictates arbitration, and the arbitrator is picked through a strike list.",
   "walk": [
    "First, for mediation, we submit our list of top mediator choices, the defense does the same, and we pick a neutral both sides trust. A mediator one side doesn't trust can't get a deal done.",
    "Next, for arbitration, get the panel list from AAA or JAMS. Those are arbitration providers, and their list of candidates is where the whole selection starts.",
    "Then, help the attorney review the resumes. You're gathering each candidate's background so the attorney can rank preferences with real information, not guesswork.",
    "Finally, submit the strike list. Both sides strike the names they don't want until a neutral is appointed. Our goal is to eliminate arbitrators with a history of bias toward insurance companies."
   ],
   "ask": "Quick check: who usually picks a mediator, and what often decides that a UM claim goes to arbitration?",
   "scenario": "JAMS sends a panel of seven arbitrators for your case. The attorney is in trial all week and asks you to research them. What do you look for in each resume, and how do you present it so she can decide in ten minutes?"
  },
  "p2": {
   "why": "The strike list only protects the client if it goes in on time.",
   "talk": "This slide is about one deadline. When the panel list arrives, the clock starts on striking names. If we miss it, we lose our say in who decides the case.",
   "walk": [
    "First, docket the strike-list deadline the day the panel arrives. Not when you get to it; the same day, so it's on the calendar before anything else can bury it.",
    "Finally, the trap here: missing the strike deadline and accepting a default appointment. The arbitrator gets chosen without our input, and it could be exactly the one we would have struck."
   ],
   "ask": "Your turn: a panel list just landed for a UM arbitration. What would you research about a proposed arbitrator before the attorney ranks them?",
   "scenario": "The strike list was due Friday, but it sat in the attorney's inbox, and the provider appointed an arbitrator by default: one known for low awards in injury cases. What went wrong, and what should have happened the day the panel arrived?"
  }
 },
 "4::Introducing the Neutral: Extent of Decision-Making Power": {
  "p1": {
   "why": "This is the most critical operational distinction: a mediator has zero power to decide, and an arbitrator's power is absolute.",
   "talk": "A mediator is a facilitator and negotiator. Their only tool is persuasion. They can't force a settlement, make a ruling or order a payout, and the parties keep 100% control over whether to sign. If mediation fails, the case simply moves forward. An arbitrator is a private judge and finder of fact, judge and jury in one. Their award is legally enforceable and very hard to appeal.",
   "walk": [
    "First, set the client's expectations for mediation: it can end without a deal. That's not a failure; it's how mediation works. A client who knows that won't panic if the day ends with no settlement.",
    "Next, set the client's expectations for arbitration: it ends with a binding number. They need to hear that before the hearing, because whatever the arbitrator awards is what they live with.",
    "Finally, prepare arbitration binders to be flawless the first time. The arbitrator can exclude evidence and decide damages, and there's no second chance to fix our mistake after the award."
   ],
   "ask": "If you had to explain this difference to a nervous client in one sentence, what would you say?",
   "scenario": "Your client asks, 'If mediation doesn't work, can we just try again?' And for her arbitration next month, 'If I don't like the number, can we appeal?' How do you answer each question, and why does it matter to set these expectations now?"
  },
  "p2": {
   "why": "The arbitrator's word is final and enforced by the court, so our prep has to be right the first time.",
   "talk": "Both practices come back to one fact. An arbitration award is legally binding, and appeal rights are virtually non-existent. So the only place to catch a mistake is before the hearing, in our own prep.",
   "walk": [
    "First, binder preparation for arbitration has to be flawless. The arbitrator's word is final and the court enforces it, so every page, every figure and every exhibit gets checked before it goes in.",
    "Finally, the pitfall to watch: assuming an arbitration math error can be appealed. If a number is wrong going in, it may be wrong in the award, and we don't get to fix it later."
   ],
   "ask": "Here's the case: the award comes in $20,000 short because the arbitrator got the math wrong. Can our attorney appeal it? Why or why not?",
   "scenario": "After an arbitration hearing, you discover the damages summary in the binder added up $6,000 less than the real bills. The award is based on that summary. What can be done now, and what does that tell you about checking the binder beforehand?"
  }
 },
 "4::Mediation Protocols for CMs: Logistics & Scheduling": {
  "p1": {
   "why": "Scheduling a mediation is like solving a puzzle: the client, the attorney, opposing counsel and the mediator all have to line up.",
   "talk": "Mediation is about facilitating compromise, setting logistics and managing confidential negotiations. Your primary job as a Case Manager is total logistics control. That comes down to two things: unified availability, getting everyone's calendar aligned before we reach out, and environmental control, making sure the room, real or virtual, protects our strategy.",
   "walk": [
    "First, collect three to four calendar windows from our team and the client before you contact the mediator's office. If you call the mediator first, you can end up booking a date someone can't make, and starting over.",
    "Next, for an in-person session, secure a main negotiation room and a separate private waiting room for the client. The client needs a private place to wait and talk strategy, away from the other side.",
    "Then, for a virtual session, set up the private breakout rooms ahead of time. Our strategy talks with the client have to stay protected, and you don't want to be building rooms while everyone waits.",
    "Finally, check whether the client needs an interpreter, confirm a 2-hour pre-mediation buffer for the attorney, and launch Zoom 15 minutes early to brief the client. Those small steps are what keep the day calm."
   ],
   "ask": "Who here has tried to schedule something with four busy people? What's the first thing that usually goes wrong?",
   "scenario": "You're scheduling a mediation. The client works weekdays, the attorney has trial the first two weeks of next month, opposing counsel prefers Fridays and the mediator books up fast. The client also speaks mainly Spanish. Plan it: what do you collect, and what do you set up?"
  },
  "p2": {
   "why": "A quick yes to the wrong date can cost us the prep we need, so every proposal gets checked first.",
   "talk": "These practices are about not letting the other side set our schedule. Every proposal gets checked against our client, our attorney and our prep, and every pushback gets logged and escalated.",
   "walk": [
    "First, the scenario: opposing counsel suggests a quick Zoom mediation next Tuesday. Don't just accept it. Check interpreter needs, the attorney's buffer and client prep first, because a fast yes can leave us walking in unprepared.",
    "Next, if opposing counsel rejects all our windows, log the pushback in the CMS, our case management system, immediately. Then escalate to the handling attorney for an attorney-to-attorney call. The log shows exactly what we offered and when.",
    "Finally, the pitfall to watch: scheduling before you've collected everyone's availability. It feels efficient, but it usually means rescheduling, and that wastes everyone's time."
   ],
   "ask": "Opposing counsel just rejected every window we proposed. Walk me through what you do next, and who you tell.",
   "scenario": "Opposing counsel emails, 'Let's do a quick Zoom mediation next Tuesday.' Your binder isn't ready, the client hasn't been prepped and the attorney has a deposition that morning. What do you reply, and what goes in the CMS?"
  }
 },
 "4::Preparing Mediation Binders: Organized Case Summaries": {
  "p1": {
   "why": "Mediation packets are the roadmap for settlement.",
   "talk": "A mediation binder, sometimes called a mediation packet, is a highly organized collection of the most critical documents in the case. Think of it as the ultimate cheat sheet and reference guide for the handling attorney and the mediator. If a document is in the binder and easy to find, the attorney can use it in the room.",
   "walk": [
    "First, compile the crucial medical records. They're the backbone of the injury claim, so they come first.",
    "Next, include the verified special damages sheets. Special damages are the losses we can put an exact number on, like medical bills. Verified means the numbers hold up when the defense pushes back.",
    "Then, include the liability reports and the pivotal case exhibits, the documents that show who's at fault and why.",
    "Finally, index and bookmark everything meticulously, so any piece of evidence can be found in seconds. A great document the attorney can't find in the moment doesn't help the client."
   ],
   "ask": "Think about the last time you had to find one document fast in a big file. What made it easy, or hard?",
   "scenario": "You have a stack of 300 pages for a mediation: medical records, bills, the police report, photos and emails. How do you organize it so the attorney can find any document in seconds? What goes first?"
  },
  "p2": {
   "why": "In a fast-paced session, the attorney has about five seconds to find the proof.",
   "talk": "These practices are all about speed under pressure. Mediation moves fast, and the defense will make claims that need an answer right away. The binder is how the attorney answers with proof instead of memory.",
   "walk": [
    "First, during a fast-paced session, the attorney must be able to find a specific record, clause or deposition quote within five seconds. That's the standard we build every binder to.",
    "Next, here's what that looks like. The defense claims the client only saw the chiropractor three times. Because you bookmarked the treatment ledger, the attorney flips to Tab 5 and shows 24 verified physical therapy sessions. The argument is over in seconds.",
    "Finally, the pitfall to watch: handing the attorney an unorganized file right before the session. They lose momentum, look unprepared, and may concede a point they could have won."
   ],
   "ask": "So what happens if the attorney gets an unorganized file right before mediation? What could that cost the client in the room?",
   "scenario": "During mediation, the defense says the client only went to the chiropractor twice. The attorney turns to the binder, but the chiropractic records are mixed in with the hospital records and aren't tabbed. What should the binder have looked like, and what would the attorney have said in five seconds?"
  }
 },
 "4::Mediation Binder Section 1: Executive Summary & Administrative Details": {
  "p1": {
   "why": "Section 1 is the first thing the attorney sees, so it sets the frame for everything behind it.",
   "talk": "A gold-standard mediation binder is divided into six key sections, and over the next few slides we'll go through each one. Section 1 establishes the basic framework: who's involved, what rules govern the mediation, and when and where it's happening.",
   "walk": [
    "First, the Case CM Snapshot, or Summary Sheet. It's a one-page overview of the parties, the firm file numbers and opposing counsel's contact details, so the attorney has the basics at a glance.",
    "Next, the Mediation Order or Agreement. That's the formal court order for mediation, or the private contract that sets out the rules and how the fees are split.",
    "Finally, the Schedule: the date, the start time, the location or the Zoom link and breakout room, and the mediator's name. If the attorney has to hunt for any of that on the day, Section 1 hasn't done its job."
   ],
   "ask": "Quick check: what are the three items in Section 1, and which one will the attorney reach for first on mediation morning?",
   "scenario": "Build the one-page snapshot for a mediation: client Keisha Warren, a rear-end crash, $62,000 in specials, a $100,000 policy and a mediator from JAMS. What goes on the page, and what schedule details does the attorney need beside it?"
  },
  "p2": {
   "why": "Section 1 looks like paperwork, but a wrong detail here trips the attorney up on the day.",
   "talk": "These practices are about getting the administrative facts right: who pays for what, and how to reach the other side. Small details, but the attorney relies on them without double-checking.",
   "walk": [
    "First, the fee split details are in the formal Mediation Order or Stipulation, the agreement signed by both parties. It's typically a 50/50 split of the mediator's hourly rate, but check the document instead of assuming.",
    "Finally, the pitfall to watch: a snapshot sheet with outdated opposing counsel contacts. If the attorney needs to reach the other side and the number is wrong, we lose time exactly when it matters."
   ],
   "ask": "Your turn: the attorney asks you, \"Where do I find the fee split details?\" Where do you look, and who signed that document?",
   "scenario": "On the morning of mediation, the attorney tries to call opposing counsel using the number on the snapshot sheet. It's disconnected, because the defense firm changed lawyers two months ago. What's the lesson, and what do you check before every mediation?"
  }
 },
 "4::Mediation Binder Section 2: The Mediation Briefs": {
  "p1": {
   "why": "Putting both briefs side by side lets you and the attorney read the opponent's arguments and prepare immediate rebuttals.",
   "talk": "Section 2 holds the mediation briefs, the documents that lay out the legal and factual arguments both sides bring to the table. A brief is a written argument: here's what happened, here's why we're right, and here's where we stand on settlement.",
   "walk": [
    "First, our Confidential Mediation Brief. Case Managers prepare it and the handling attorney approves it. It outlines our strongest arguments, our key evidence and our settlement positions, which is exactly why it stays confidential.",
    "Finally, opposing counsel's mediation brief, the one the defense sends us. It goes side by side with ours, so the attorney can see each defense argument and have a rebuttal ready."
   ],
   "ask": "Why do you think our brief is prepared by the Case Manager but approved by the attorney before it goes anywhere?",
   "scenario": "The defense sends its mediation brief two days before the session. It argues your client's injuries are pre-existing and that she waited ten days to see a doctor. Where do you put it in the binder, and what do you prepare to help the attorney respond?"
  },
  "p2": {
   "why": "A brief the mediator hasn't had time to read can't do its job.",
   "talk": "The practice here is about timing. The mediator uses our brief to understand our side before the session starts. If it arrives late, they walk in without our strongest arguments in mind.",
   "walk": [
    "First, deliver our brief to the mediator well before the session. That gives them time to actually read it and think about our arguments.",
    "Finally, the pitfall to watch: sending the brief ten minutes before the session starts. At that point nobody reads it carefully, and our best arguments never get the attention they deserve."
   ],
   "ask": "Your turn: what goes in our confidential brief that never goes to the defense? Name two things.",
   "scenario": "Your team's confidential brief was finished the night before, and it reached the mediator ten minutes before the session. The mediator starts the day unfamiliar with your strongest points. What should the timeline have been?"
  }
 },
 "4::Mediation Binder Section 3: Core Pleadings (The Legal Framework)": {
  "p1": {
   "why": "Section 3 lets you instantly check what the defense actually pleaded.",
   "talk": "Pleadings are the formal documents filed with the court that dictate what the lawsuit is actually about. They set the boundaries: what we're claiming, and what the defense is using to fight back. When an argument comes up at mediation, this is where we check whether it's really part of the case.",
   "walk": [
    "First, the Active Complaint. That's the operative complaint, meaning the current version, detailing our client's allegations. It's the official record of what we say happened.",
    "Finally, the Answer and Affirmative Defenses. That's the other side's formal response, including the legal defenses they use to shield themselves from liability. What's in there, and what isn't, both matter."
   ],
   "ask": "Quick check: in your own words, what's the difference between the Complaint and the Answer?",
   "scenario": "Your case has an original complaint and an amended complaint that added the employer as a defendant, plus the defense's answer listing three affirmative defenses. Which documents go in Section 3, and why does it matter which complaint you include?"
  },
  "p2": {
   "why": "If a defense wasn't pleaded, the attorney can object, but only if we can show it in seconds.",
   "talk": "These practices are about using the pleadings as a live tool in the room, and making sure we're always working from the right version.",
   "walk": [
    "First, the scenario: at mediation, the defense argues our client didn't wear a seatbelt. Cross-reference Section 3. If a seatbelt or comparative negligence defense, that's the claim the client was partly at fault, wasn't pleaded in the Answer, the attorney can object to unpled defenses.",
    "Finally, the pitfall to watch: including a superseded complaint, one that's been replaced by a newer version. If the attorney works from the old one, they could be arguing about allegations that aren't in the case anymore."
   ],
   "ask": "Your turn: why does it matter whether a defense was pleaded? What does that give our attorney in the room?",
   "scenario": "At mediation, the defense argues your client wasn't wearing a seatbelt. The attorney wants to point out that this defense was never pleaded. How quickly can she find the answer in your binder, and what should Section 3 look like so she can?"
  }
 },
 "4::Mediation Binder Section 4: Key Evidence & Liability Exhibits": {
  "p1": {
   "why": "Section 4 contains the raw evidence proving our client is in the right.",
   "talk": "This is the smoking-gun section, the raw evidence that proves our side is right. Liability means who's legally at fault, and everything in Section 4 is here to answer that question in our favor.",
   "walk": [
    "First, contracts or key correspondence. Think disputed clauses, or the email threads where promises were made or broken. If someone put it in writing, it can go here.",
    "Next, the police, incident or accident reports. These are the official reports of how the incident happened, so they're often the first thing anyone checks on fault.",
    "Then, photographs and video stills. That's visual proof of property damage, the scene layout or the physical injuries. A photo can show in a second what takes a page to describe.",
    "Finally, deposition summaries. A deposition is sworn testimony taken outside court. We include a high-level summary of the key testimony plus the exact transcript pages, highlighted, so the attorney can go straight from the point to the proof."
   ],
   "ask": "Which kind of evidence do you think lands hardest with a mediator: the report, the photos or the testimony? Why?",
   "scenario": "For Section 4, you have the police report, 40 photos, a dashcam clip and two deposition transcripts. What do you include, how do you present the photos and video, and what goes with the deposition summaries?"
  },
  "p2": {
   "why": "A summary tells the attorney what was said; the highlighted page proves it.",
   "talk": "These practices are about making testimony usable in the moment. The attorney shouldn't have to read a whole transcript to find the one line that matters.",
   "walk": [
    "First, highlight the exact transcript lines the attorney will quote. When they need the line, they turn to the page and it's already marked.",
    "Finally, the pitfall to watch: summaries without the supporting transcript pages. A summary is only our description. If the defense challenges it, the attorney needs the actual words in front of them."
   ],
   "ask": "Your turn: think about the John Doe file. Which exhibit is John Doe's strongest smoking gun, and why?",
   "scenario": "The attorney wants to quote the defendant's admission that he 'looked down at his phone.' Your deposition summary mentions it, but the transcript page isn't in the binder. What happens when the defense says, 'That's not what he said'?"
  }
 },
 "4::Mediation Binder Section 5: Damages, Financials & Expert Reports": {
  "p1": {
   "why": "Section 5 justifies the exact dollar amount we are asking for.",
   "talk": "Section 4 proves who's at fault. Section 5 proves what it cost. Damages are the losses the client can be compensated for, and every dollar we ask for needs a document behind it: the medical bills, the lost income, and the experts who explain them.",
   "walk": [
    "First, the medical records summary and key bills. That's the chart notes in chronological order, plus a ledger totaling all medical expenses to date. Chronological order tells the story of the treatment from the start.",
    "Next, proof of financial loss: tax returns, pay stubs, or profit-and-loss statements that prove lost wages or business disruption. Without the paperwork, lost wages are just a claim.",
    "Finally, expert witness reports. These are summaries or declarations from experts we've retained, like accident reconstructionists, medical experts or economists. They explain the facts and the numbers with an expert's authority behind them."
   ],
   "ask": "Have you ever seen someone struggle to prove their income on paper? What documents were hardest to get?",
   "scenario": "Your client is self-employed and claims $30,000 in lost income. She also has $58,000 in medical bills and a life-care planner's report. What documents go in Section 5 to support every dollar?"
  },
  "p2": {
   "why": "If the ledger doesn't match the invoices, the defense gets to question our whole damages number.",
   "talk": "These practices are about verification. A number in our binder is only as strong as the paper behind it.",
   "walk": [
    "First, the ledger total must match the facility invoices dollar for dollar. Not roughly, not close: exactly. Check it line by line.",
    "Finally, the pitfall to watch: an unverified ledger. The defense will call the damages unsubstantiated, meaning not backed by proof, and then we're arguing about our own numbers instead of the client's injuries."
   ],
   "ask": "Your turn: what proves lost wages for a self-employed client, someone with no employer handing them a pay stub?",
   "scenario": "At mediation, the defense adds up your ledger and finds it's $2,800 more than the invoices behind it. They then argue your whole damages claim is unreliable. What should have been done before the binder went out?"
  }
 },
 "4::Mediation Binder Section 6: Settlement History & Draft Agreements": {
  "p1": {
   "why": "If an agreement is reached, the attorney can instantly pull the draft terms sheet for signatures.",
   "talk": "Section 6 is the closing section. It prepares the attorney to finalize the deal. Everything before it builds the case; this section makes sure that when the two sides meet on a number, we can lock it in.",
   "walk": [
    "First, the negotiation log: a chronological list of every demand we made and every counter-offer we received. It prevents confusion over the current baseline number, so nobody in the room argues about where we left off.",
    "Finally, the draft settlement agreement or release template. It's a pre-drafted terms sheet, so the attorney can get signatures before anyone leaves the room. A release is the document where the client agrees to end the claim in exchange for the settlement."
   ],
   "ask": "Quick check: in the middle of the session, the attorney asks, \"What was our last demand?\" Where in the binder do they look?",
   "scenario": "Before mediation, build the negotiation log for a case with three demands and two counter-offers over five months. What does each entry need, and what draft document should sit behind it?"
  },
  "p2": {
   "why": "When a deal is reached, the paperwork has to be ready before anyone leaves the room.",
   "talk": "These practices get us ready for both kinds of mediation, in person or virtual, and for the moment it works.",
   "walk": [
    "First, a CM pro tip: for in-person mediation, prepare three binders, one for the attorney, one for the mediator and one for the client. Everyone can look at the same page at the same time.",
    "Next, for virtual mediation, make sure the PDF binder is OCR-scanned. OCR turns a scanned image into searchable text, so the attorney can hit Control F and jump straight to a keyword.",
    "Finally, the trap here: no draft release on hand when a deal is reached. Everyone agrees, and then there's nothing ready to sign."
   ],
   "ask": "Your turn: why have a draft release ready before the session even starts? What could happen between the handshake and the signature?",
   "scenario": "The case settles at mediation at 6 p.m. But there's no draft release, the mediator is leaving and the defense attorney says, 'We'll paper it next week.' What's the risk, and what should have been ready?"
  }
 },
 "4::Mediation: Quality Assurance & Logistics Auditor": {
  "p1": {
   "why": "As a Case Manager, you are the Quality Assurance and Logistics Auditor.",
   "talk": "Case Managers make sure the handling attorney is completely armed and organized before the mediation session. Here that comes down to three things: binder multi-sets, searchability, and systematic indexing. Get those three right and the binder works in the room.",
   "walk": [
    "First, build the binder multi-sets: three identical copies, for the attorney, the mediator and the client, or one unified digital environment. Identical matters, because if the copies differ, people end up on different pages.",
    "Next, OCR every digital file with a deep scan, so every piece of evidence is searchable with Control F. If it isn't searchable, it's just a picture of a page.",
    "Finally, apply the six numbered divider tabs, lined up with the firm's master index. They match the six binder sections we just covered, so everyone knows exactly where to look."
   ],
   "ask": "Who here has been the person everyone counted on to check things before they went out? What did you check that nobody else did?",
   "scenario": "It's the day before an in-person mediation. You have one printed binder and a PDF that was scanned as images. What else do you need to prepare, and how do you check everything lines up with the index?"
  },
  "p2": {
   "why": "The binder only works if it matches the index and every page can be searched.",
   "talk": "These practices are your final check. A binder that looks finished can still let the attorney down if a tab is missing or a scan can't be searched.",
   "walk": [
    "First, QA the binder against the index the day before. QA is quality assurance: go tab by tab and check that every item on the index is really there. Doing it the day before leaves time to fix what's missing.",
    "Finally, the pitfall to watch: a scanned PDF that isn't text-searchable. It looks fine on screen, but when the attorney hits Control F, nothing comes up."
   ],
   "ask": "Your turn: what's your final QA check before you hand the binder to the attorney? Walk me through it.",
   "scenario": "During a virtual mediation, the attorney searches the PDF binder for 'MRI' and gets zero results, even though the MRI report is in there. What went wrong, and what would the day-before QA check have caught?"
  }
 },
 "4::Skill Building: Create Your Mediation Binders": {
  "p1": {
   "why": "Now it's your turn: build a complete mediation binder for your case and submit it to the attorney for approval.",
   "talk": "This one is hands-on. You'll prepare a complete, comprehensive mediation binder for your case, section by section. Use the existing Demand as your source material, and use the Sample Mediation Brief as a guide for your cover and your briefs.",
   "walk": [
    "First, build Section 1, the executive summary and administrative details: the snapshot sheet, the mediation order and the schedule.",
    "Next, build Section 2, the mediation briefs. Use the Sample Mediation Brief as your guide.",
    "Then, build Section 3, the core pleadings. Make sure it's the active complaint, not an old version.",
    "After that, build Section 4, the key evidence and liability exhibits, the proof that our side is right.",
    "Then, build Section 5, damages, financials and expert reports. Check that the ledger total matches the invoices.",
    "After that, build Section 6, settlement history and draft agreements, with the negotiation log and a draft release.",
    "Finally, upload the binder to the case in the CMS for attorney approval. It isn't done until it's in the system where the attorney can review it."
   ],
   "ask": "Before you start: which section do you expect to take you the longest, and why?",
   "scenario": "You have three days to build a full mediation binder for the Warren case. The medical records are complete, but the defense brief hasn't arrived and the settlement history is in scattered emails. How do you plan the three days, and what can you build now while you wait?"
  },
  "p2": {
   "why": "A binder is only as good as its index: every document in one place, and nothing missing.",
   "talk": "These practices are your checklist while you build. The goal is a binder the attorney can use without ever asking you where something is.",
   "walk": [
    "First, every document should sit in exactly one section, and be indexed. If a document is in two places, or in none, the attorney wastes time looking for it.",
    "Finally, the pitfall to watch: missing the negotiation log. Without it, nobody in the room is sure what the current baseline number is."
   ],
   "ask": "Your turn: when you're done, trade binders with a partner and QA each other's index. Is every document where the index says it is?",
   "scenario": "The attorney reviews your binder and asks, 'What was our last demand, and when did we send it?' The answer is in an email chain, not the binder. Which section is incomplete, and how do you fix it?"
  }
 },
 "4::Skill Building: The LSH Critical Thinking Challenge — The Pre-Mediation Audit": {
  "p1": {
   "why": "Time to test your CM critical thinking skills: two landmines, 48 hours.",
   "talk": "Here's the setting. It's June 18, 2026, and you're 48 hours from the hard Mediation Completion Deadline. The lead attorney is stuck in court and asks you to run a final compliance audit. You open the John Doe file and find conflicting data entries, missing documents, and aggressive pushback from defense counsel Jane Vance. Your job: dig into the raw records and solve two landmines before the attorney walks into mediation.",
   "walk": [
    "First, Problem 1. The defense attorney calls and says, “Your medical ledger is completely unverified, and we will not extend a real settlement offer at mediation while your damages are entirely unsubstantiated.” That puts the whole mediation at risk.",
    "Next, Problem 2. Metro General Hospital has asserted a formal medical lien for $45,000. At the same time, BlueCross Recovery Services has filed an ERISA health insurance subrogation lien for $20,000. A lien is a claim on the settlement money; subrogation means the insurer wants back what it paid.",
    "Finally, write your audit memo, in a Google Doc for example, with your fix for each landmine. The attorney is stuck in court, so the memo has to make sense on its own."
   ],
   "ask": "Before you dig in: which landmine feels more urgent to you, and why?",
   "scenario": "Forty-eight hours before mediation, defense counsel calls: 'Your medical ledger is completely wrong. Our records show BlueCross paid most of these bills.' At the same time, Metro General Hospital asserts a $45,000 lien. What do you do first for each problem?"
  },
  "p2": {
   "why": "Both landmines are solved the same way: go back to the raw records and prove every dollar.",
   "talk": "Here are the solutions, so compare them to your memos. Notice that neither fix is an argument. Each one is an audit of what the file actually shows.",
   "walk": [
    "First, the fix for Problem 1: audit the raw file, pull certified billing ledgers from all the treating facilities, and attach proof of every medical dollar into Section 5. That takes away the defense's reason to hold back a real offer.",
    "Next, the fix for Problem 2: cross-reference the payments. If BlueCross already paid Metro General at a reduced contractual rate, Metro General can't double-recover from the settlement, and its lien must be stripped down.",
    "Finally, the trap here: accepting both liens at face value. That could mean paying twice for the same treatment, out of the client's settlement."
   ],
   "ask": "Your turn: how do you prove BlueCross already paid Metro General? What would you look for in the file?",
   "scenario": "You find that BlueCross paid Metro General $18,000 at a negotiated rate, yet the hospital is still claiming a $45,000 lien. What do you ask the hospital for, and what does the correct ledger look like?"
  }
 },
 "4::Case Phase: Arbitration — The Anatomy of a PI Arbitration": {
  "p1": {
   "why": "When you attend a virtual hearing, your job comes down to three things: observe and document, log directives, and update the CMS.",
   "talk": "In personal injury practice, when a motor vehicle accident case, an MVA, or a commercial trucking case fails to settle at mediation, it's frequently routed to arbitration. Before you walk in, understand the coverage structure we're arbitrating against: a Combined Single Limit, CSL, or split limits. Those are the insurance policy limits, and they cap what the award can realistically collect.",
   "walk": [
    "First, observe and document. Take comprehensive notes on the witness testimony, on what opposing counsel focuses on, and on how the arbitrator reacts to specific evidence. Those reactions tell the attorney what's landing and what isn't.",
    "Next, log directives. Anything the arbitrator orders from the bench, like a timeline for post-hearing briefs or a ruling on evidence, gets written down immediately. Those are deadlines and rules we'll have to follow.",
    "Finally, update the CMS. As soon as you're back at the office, log the new deadlines in the digital case profile and draft an internal summary memo for the handling attorney."
   ],
   "ask": "Who here has taken notes in a meeting and later realized you'd missed the one thing that mattered? What would have helped?",
   "scenario": "You're attending a virtual arbitration hearing. The arbitrator tells both attorneys, 'I want supplemental billing records within ten days, and briefs on the lost wage issue in 20.' What do you write down, and what do you do as soon as the hearing ends?"
  },
  "p2": {
   "why": "Your hearing notes become the attorney's roadmap for everything that comes after.",
   "talk": "These practices are about capturing things while they're fresh. The hearing moves fast, and what the arbitrator says from the bench can set deadlines we have to meet.",
   "walk": [
    "First, your notes at the hearing become the attorney's post-hearing roadmap. They'll plan the next steps from them, so write them for the attorney, not just for yourself.",
    "Finally, the pitfall to watch: logging bench directives the next day from memory. Memory drops details, and one wrong date on a post-hearing deadline is a problem we created ourselves."
   ],
   "ask": "Your turn: what's the difference between a CSL policy and split limits? And why does it change what an award can actually collect?",
   "scenario": "After a long hearing, you plan to update the CMS the next morning from memory. Overnight, you forget one of the arbitrator's deadlines. What could it cost the client, and what's the right habit?"
  }
 },
 "4::Arbitration: Operational Mindset — From Compromise to Trial-Ready": {
  "p1": {
   "why": "Pay attention to the shift in operational mindset here: we're moving from compromise to trial-ready.",
   "talk": "Mediation is a voluntary, non-binding negotiation. Arbitration is a different animal. It's an adversarial, formal hearing where a neutral Arbitrator acts as the judge and issues a final, binding decision, called the Award. And once that Award is issued, the right to appeal is drastically limited by law. So whatever we bring into that room is what the decision gets made on.",
   "walk": [
    "First, treat the hearing with the precision of a multi-day trial in state or federal court. It might happen in a conference room, but the stakes are a trial's stakes, so we prepare like it's one.",
    "Next, audit every exhibit for completeness and quality. A missing page or a poor copy can't be fixed after the Award, because the door to an appeal is mostly closed.",
    "Finally, lock every deadline on the master calendar. In a binding process there's no second pass, so every date gets locked in, not just noted somewhere."
   ],
   "ask": "Think about a mediation file you've prepped, or watched someone prep. What would you have had to redo before you'd be comfortable handing it to a judge?",
   "scenario": "Your case is moving from mediation to binding arbitration in six weeks. The mediation binder had a few missing pages and some grainy photos, but 'it was good enough.' What do you change now, and why?"
  },
  "p2": {
   "why": "Trial-ready means that on hearing day, there's nothing left to fix.",
   "talk": "These practices are about the standard we hold ourselves to. At mediation, a small gap can sometimes be talked around at the table. At arbitration, the Award is binding and appeals are drastically limited, so any gap stays in the record.",
   "walk": [
    "First, trial-ready means nothing is left to fix on the day. If you're still printing, hunting for an exhibit or confirming a date on hearing morning, the file wasn't ready.",
    "Finally, the pitfall to watch: bringing a mediation-quality binder to an arbitration. A binder that was good enough to negotiate with isn't automatically good enough for an Arbitrator who's about to make a final decision."
   ],
   "ask": "Here's the case: a file just moved from mediation to arbitration. What changes operationally for you? Give me one thing about the binder and one thing about the calendar.",
   "scenario": "It's the morning of the arbitration hearing, and you're still printing exhibits and waiting on one provider's records. What does 'trial-ready' mean, and when should the binder have been finished?"
  }
 },
 "4::Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules": {
  "p1": {
   "why": "The moment a case is routed to arbitration, hard-code these dates on the master calendar and actively monitor them.",
   "talk": "On the arbitration track, our job is heavily operational: intense timeline tracking, strict scheduling and rigid document management. The diagram shows the three hard dates that drive everything else. Hard-coding means they go on the firm's master calendar as fixed entries, not as reminders in your head or your inbox.",
   "walk": [
    "First, the Arbitration Hearing Date. That's the final, trial-like day when the attorney presents arguments, cross-examines witnesses and introduces evidence. Everything else on the calendar is counting down to it.",
    "Next, the Arbitration Brief Deadline. That's the absolute cutoff to submit the final factual claims, legal arguments, exhibit index and witness list to the arbitrator and opposing counsel. Absolute means there's no late version.",
    "Finally, the Neutral Arbitrator Selection Cutoff. That's the deadline to review, vet and strike names from the AAA, the American Arbitration Association, or JAMS panels. Striking a name means ruling that person out. Once the cutoff passes, we've lost our chance to shape who hears the case."
   ],
   "ask": "Be honest: where do hard dates like these live on your files today? The master calendar, your own calendar, or somewhere in your inbox?",
   "scenario": "A case was just routed to arbitration. The order sets a hearing date, a brief deadline and a date to select the arbitrator. Put all three on the master calendar. What warning alerts do you add for each, and how far ahead?"
  },
  "p2": {
   "why": "A hard date only protects the case if someone sees it coming.",
   "talk": "These practices are about warning, not just recording. Putting the date on the calendar is step one. Making sure it gets your attention before it arrives is what actually protects the file.",
   "walk": [
    "First, add warning alerts ahead of each hard date. The alert is what buys you time to chase a missing exhibit or flag the attorney before the cutoff, instead of on it.",
    "Finally, the pitfall to watch: a brief deadline that lives only in an email. Emails get buried, and nobody else on the team can see yours. If it's not on the master calendar, as far as the firm's concerned, it doesn't exist."
   ],
   "ask": "Your turn: of the three dates, the hearing, the brief deadline and the arbitrator selection cutoff, which one is the most dangerous to miss, and why?",
   "scenario": "The arbitration brief deadline was mentioned only in an email from opposing counsel. Nobody put it on the calendar, and it passed yesterday. What are the consequences, and what's the rule going forward?"
  }
 },
 "4::Arbitration Operational Track 2: Logistics & Setup Protocols": {
  "p1": {
   "why": "Coordinate, retain and set up: on the arbitration track, you're the logistics backbone.",
   "talk": "You're the primary logistics coordinator for setting up the arbitration. The attorney runs the hearing, but getting everyone into the same room, or the same Zoom, on an agreed date, with the arbitrator retained and paid, that's us. The three steps follow the order it really happens in.",
   "walk": [
    "First, coordinate availability. Work with opposing counsel's staff to secure three or four mutually agreeable blocks of time before anyone formally reaches out to the arbitrator. That way the arbitrator gets real options instead of a back-and-forth.",
    "Next, retain the neutral, that's the arbitrator. Vet the one who's been chosen, confirm their daily or hourly fee schedule, and route the retainer deposit to accounting for immediate payment.",
    "Finally, manage the logistics. Send calendar invitations to everyone internal, then either reserve a firm conference room or set up a secure Zoom layout with clear breakout parameters, meaning everyone knows which breakout room they go to and when."
   ],
   "ask": "Who here has scheduled something with three or more busy parties? What made it drag on, and how would lining up the options first have helped?",
   "scenario": "You need to schedule an arbitration. The arbitrator is selected but not yet paid, opposing counsel's assistant is slow to reply and the client needs a virtual option. Plan the order of your steps: coordinate, retain and set up."
  },
  "p2": {
   "why": "An unpaid retainer or a clumsy first contact can delay a hearing before it's even set.",
   "talk": "Both practices are about sequence and proof. Payment has to be confirmed, not assumed. And the arbitrator should never be the first to find out the two sides haven't agreed on dates.",
   "walk": [
    "First, confirm the retainer payment in writing. Unpaid retainers delay hearings, and \"I sent it to accounting\" isn't the same as \"it's been paid.\" Get the written confirmation and keep it on the file.",
    "Finally, the pitfall to watch: contacting the arbitrator before availability is aligned with the other side. The arbitrator offers dates nobody's checked, and we're back to square one, with the neutral watching us scramble."
   ],
   "ask": "Your turn: build the internal calendar invite for the hearing out loud. What goes in it so nobody on our team has to come back with a question?",
   "scenario": "The hearing was postponed three weeks because the arbitrator's retainer was never paid and nobody confirmed it in writing. The client is upset. What should have happened, and how do you explain the delay to her?"
  }
 },
 "4::Ethics & Boundaries: What You Can and Cannot Do at Hearings (UPL)": {
  "p1": {
   "why": "I can't emphasize this enough: violating UPL rules puts both you and the firm at risk.",
   "talk": "UPL stands for the Unauthorized Practice of Law, that's doing a lawyer's work without being a lawyer. The golden rule: case managers never present legal arguments, speak on the record, or represent clients directly in front of an arbitrator. The diagram splits it into what you cannot do and what you can. At the hearing, your role is administrative assistance, technical support and observation.",
   "walk": [
    "First, observe and document. Watch the testimony and the arbitrator's reactions, and write them down. The attorney is busy arguing; you're their second set of eyes.",
    "Next, log directives. That means the post-hearing timelines and any evidentiary rulings the arbitrator gives. They become new deadlines, so they can't live only in someone's memory.",
    "Then, update the CMS and draft a summary memo for the attorney, so what happened at the hearing is on the file, not just in your notebook.",
    "Finally, if the arbitrator asks you about a medical bill, don't answer it. Politely say you're the case manager providing administrative assistance, defer to the handling attorney on the record, and hand the document to your attorney."
   ],
   "ask": "Where do you think this line gets blurry in real life? Have you ever felt pulled to answer something that wasn't yours to answer?",
   "scenario": "You're sitting in on an arbitration hearing. The arbitrator turns to you and asks, 'Can you tell me why this $4,000 MRI bill is so high?' You know the answer. What do you say, and what do you do instead?"
  },
  "p2": {
   "why": "The most dangerous thing you can do at a hearing is be helpful in the wrong way.",
   "talk": "These practices are short, and that's the point. UPL rarely comes from bad intentions. It usually happens when a well-meaning case manager knows the answer and just says it.",
   "walk": [
    "First, remember the stakes: violating UPL rules puts both you and the firm at risk. This isn't a style preference; it's an ethics boundary.",
    "Finally, the trap here: \"helpfully\" answering the arbitrator directly. You might know that bill better than anyone in the room, but the answer has to come from the attorney."
   ],
   "ask": "Let's practice. I'm the arbitrator, and during the hearing I turn to you and ask, \"What's this charge on the medical bill?\" Tell me exactly what you say and what you do.",
   "scenario": "During a break, opposing counsel asks you casually, 'So what's your client really willing to settle for?' It feels friendly and harmless. What's the risk, and how do you respond?"
  }
 },
 "4::Arbitration Binders: Section 1 — The Arbitration Submissions": {
  "p1": {
   "why": "Section 1 sets the ground rules for the entire proceeding.",
   "talk": "Unlike mediation, the arbitration hearing is a binding legal battle, and the binder is a formal, trial-ready evidentiary record that goes straight to a private judge. If we leave out a page, or print a key vehicle-intrusion photo in low-quality grayscale, the arbitrator can permanently exclude that evidence, with zero chance of appeal. A strong PI firm builds this binder in six tabbed sections, and this is the first.",
   "walk": [
    "First, the Case Manager Snapshot Sheet. It's a one-page overview with our internal file numbers, who each party is, and counsel contacts, so anyone who picks up the binder gets their bearings fast.",
    "Next, the Arbitration Brief. This has to be the final version of the factual claims, liability calculations and legal arguments, because it's how the arbitrator first understands our case.",
    "Then, the Governing Arbitration Order or Agreement. That's the signed stipulation or court directive sending the case to binding arbitration, plus the scheduling order. It's the paper that says why we're here and on what timeline.",
    "Finally, the Arbitrator Fee Disclosures: the hourly and daily rates, how the fees are split between the sides, and confirmation that the retainer deposits were received."
   ],
   "ask": "Quick check: if someone asked, \"Are we actually bound by this arbitration?\", which of these four documents would you pull first?",
   "scenario": "Build Section 1 of an arbitration binder. You have a snapshot sheet, the final arbitration brief, the signed arbitration agreement and an invoice from the arbitrator showing a $3,000 unpaid deposit. What's ready, and what do you do about the invoice?"
  },
  "p2": {
   "why": "Section 1 is the first thing the arbitrator opens, so it has to be final and paid up.",
   "talk": "The two practices here are a money check and a version check. Both are easy to miss when you're building in a hurry, and both show the moment the binder is opened.",
   "walk": [
    "First, the QC check: confirm the arbitrator's retainer deposits are paid in full. Unpaid retainers delay hearings, so the fee disclosure should show payment, not just an invoice.",
    "Finally, the pitfall to watch: a draft brief in the binder instead of the final. A draft can carry old numbers or arguments the attorney has dropped, and the arbitrator will read whatever we give them."
   ],
   "ask": "Your turn: why is the fee disclosure in the binder at all? What does it show, and who needs to see it?",
   "scenario": "The binder given to the arbitrator contains a draft of the brief with tracked comments, not the final version. What's the risk, and what check would have caught it?"
  }
 },
 "4::Arbitration Binders: Section 2 — Core Litigation Pleadings": {
  "p1": {
   "why": "Old, superseded complaints come out of the binder, to prevent confusion.",
   "talk": "Section 2 gives the arbitrator the formal legal framework of the lawsuit: what we're claiming, and how the defense answers it. Pleadings are simply the formal documents where each side states its case. A superseded complaint is an older version that's been replaced by an amended one.",
   "walk": [
    "First, the Operative Amended Complaint. Operative means the one that's active now, with the specific counts we're pursuing. Old complaints come out, so the arbitrator isn't reading claims we've already changed.",
    "Finally, the Answer and Affirmative Defenses. That's the defense's response, explaining how they plan to avoid liability or argue comparative fault, meaning the client was partly to blame. It shows the arbitrator what's really in dispute."
   ],
   "ask": "Has anyone worked a file where the complaint was amended? How did you tell which version was the current one?",
   "scenario": "Your file has the original complaint, a first amended complaint and a second amended complaint that corrected the defendant's name. Which goes in Section 2, and what do you do with the others?"
  },
  "p2": {
   "why": "One complaint in the binder, and it's the right one.",
   "talk": "A short slide with a strict rule. The QC step here is about taking something out, not putting something in, and that's exactly why it gets skipped.",
   "walk": [
    "First, the QC rule: trash or exclude outdated, superseded complaints. If it's been replaced, it doesn't belong in front of the arbitrator.",
    "Finally, the pitfall to watch: two complaints in the binder. Now the arbitrator has to work out which counts are live, and that confusion is exactly what this section is supposed to prevent."
   ],
   "ask": "Your turn: before you print Section 2, how do you confirm which complaint is operative? Where would you check, and who would you ask?",
   "scenario": "During the hearing, the arbitrator asks, 'Which complaint am I supposed to be looking at?' because the binder contains two. What does that do to the attorney's credibility, and how do you prevent it?"
  }
 },
 "4::Arbitration Binders: Section 3 — Liabilities & Biomechanical Evidence": {
  "p1": {
   "why": "Grayscale prints are strictly prohibited, because they fail to show the intensity of the crash impact.",
   "talk": "Section 3 is the raw evidence that the adverse driver, that's the other driver, is 100% at fault for the impact. Liability just means who's responsible. Biomechanical evidence is about the forces involved in the crash. This section has to let the arbitrator see the crash for themselves.",
   "walk": [
    "First, the official incident and police reports, unredacted. That's the officer's narrative, the diagrams and any citations from the scene, with nothing blacked out.",
    "Finally, the high-resolution color exhibits: photos of the vehicle damage and the scene layout. These are what make the impact real for the arbitrator, so print quality matters as much as the photo itself."
   ],
   "ask": "When you look at a crash photo in a file, what tells you how serious the impact was? Now picture that same photo in black and white.",
   "scenario": "You have the police report with the witness names blacked out, and a set of vehicle photos printed in black and white to save toner. What do you replace before these go into an arbitration binder, and why?"
  },
  "p2": {
   "why": "The arbitrator can only weigh the crash they can actually see.",
   "talk": "Both practices are about giving the arbitrator the fullest, clearest version of the evidence. Anything faded or blacked out makes our strongest proof look weaker than it is.",
   "walk": [
    "First, the QC rule: reject grayscale and black-and-white prints. They don't show how intense the crash impact was, so insist on high-resolution color every time.",
    "Finally, the pitfall to watch: a redacted police report when the unredacted version is available. Redacted means parts are blacked out, and we don't want the arbitrator missing any part of what the officer recorded."
   ],
   "ask": "Your turn: explain to a new colleague why color matters for crash-intrusion photos, that's how far the crash pushed into the vehicle. What does color show that grayscale hides?",
   "scenario": "The defense argues the crash was 'minor.' The arbitrator looks at your grayscale photos and can't see the crushed frame that's obvious in color. What does that cost the case, and what's the rule for next time?"
  }
 },
 "4::Arbitration Binders: Section 4 — Proving Bodily Accident Medical Damages": {
  "p1": {
   "why": "Section 4 justifies the exact dollar compensation being demanded.",
   "talk": "This is where we justify the exact financial compensation we're asking for the client's physical injuries. Every dollar in the demand has to trace back to a record in this tab. The four pieces run from the money summary down to the medical proof behind it.",
   "walk": [
    "First, the Consolidated Medical Ledger. It's a chronological treatment chart plus an active billing spreadsheet tracking the total costs. Think of it as the roadmap for this whole section.",
    "Next, the Comprehensive Provider Treatment Logs: records, intake packets, chart notes and invoices from every treating facility. These are the proof behind each line of the ledger.",
    "Then, the Diagnostic Imaging Reports. These are specialist evaluations, like MRIs or X-rays, confirming objective trauma, meaning an injury that shows up on a scan, not just one the client describes.",
    "Finally, the Emergency Medical Condition declarations, EMC for short. They document that the treatment was medically necessary, so the defense can't wave it off as optional."
   ],
   "ask": "Quick check: the ledger shows a bill from a clinic. Where in this section should the arbitrator find the proof behind that line?",
   "scenario": "Build Section 4 for a client with ER, orthopedic, physical therapy and imaging bills totaling $71,000. What documents support each bill, and how do you organize them so the arbitrator can follow the treatment in order?"
  },
  "p2": {
   "why": "A total nobody can trace is a total nobody has to believe.",
   "talk": "These practices are about matching money to paper. The ledger is our summary, and the invoices are the proof. They have to agree, down to the dollar.",
   "walk": [
    "First, the QC rule: verify the billing ledger matches the facility invoices dollar for dollar. Not roughly, not close; exactly.",
    "Finally, the pitfall to watch: a ledger total nobody can trace to an invoice. The defense will find that gap, and it makes the whole damages number look unreliable."
   ],
   "ask": "Your turn: what's the fastest way to reconcile the ledger to the invoices? Walk me through how you'd do it on a file with lots of providers.",
   "scenario": "The defense attorney asks, 'Where does this $71,000 total come from?' Nobody can match it to the invoices in the binder. How does that affect the arbitrator's view of your damages, and what should have been checked?"
  }
 },
 "4::Arbitration Binders: Section 5 — The Prior Medical Shield": {
  "p1": {
   "why": "Section 5 is your defense shield against pre-existing condition arguments.",
   "talk": "Defense attorneys actively weaponize prior records to argue a \"pre-existing degenerative condition,\" meaning the problem was already there and getting worse on its own before the crash. This section is our proactive shield. We put the history in front of the arbitrator ourselves, together with the proof that it was over before the crash.",
   "walk": [
    "First, the prior injury records and work history files. Document the past injuries, like John Doe's 2018 strain, which resolved in four weeks without pre-existing defects. We tell that story before the defense tells their version of it.",
    "Finally, the retained expert reports. These are official statements from accident reconstructionists or medical experts that counter the defense's medical claims. The record shows what happened; the expert explains what it means."
   ],
   "ask": "Why do you think a defense attorney would love to find a prior injury in our file? What story do they want to tell with it?",
   "scenario": "The defense plans to argue your client's back pain comes from a 2016 injury. You have her 2016 records showing she recovered fully, and an expert who reviewed them. How do you put Section 5 together so it works as a shield?"
  },
  "p2": {
   "why": "A prior injury we explain is a shield; a prior injury the defense reveals is a weapon.",
   "talk": "These practices turn a weak spot into a strength. The prior record on its own isn't enough, and leaving it out only hands the defense the first word.",
   "walk": [
    "First, the QC rule: pair the prior record with an expert opinion proving the past injury fully resolved before the crash. The record shows it happened; the expert shows it was over.",
    "Finally, the pitfall to watch: leaving the prior record out and letting the defense introduce it. Then it looks like we were hiding it, and they get to frame it first."
   ],
   "ask": "Your turn: why include the prior injury record yourself, when at first glance it seems to help the defense? Convince me in two sentences.",
   "scenario": "A colleague leaves the client's prior shoulder injury out of the binder 'so it doesn't draw attention.' At the hearing, the defense produces the records and says your side hid them. What went wrong, and what should Section 5 have contained?"
  }
 },
 "4::Arbitration Binders: Section 6 — Economic Losses & Lien Reconciliations": {
  "p1": {
   "why": "You must verify that health insurance hasn't already paid the hospital at a reduced rate, to block double-recovery attempts.",
   "talk": "Section 6 is the financial closing ledger, and it directly affects the final cash payout to the client. A lien is a claim someone places on the client's recovery to get paid back, like a hospital or a health insurer. Subrogation is the insurer's right to be repaid out of the recovery for what it already covered.",
   "walk": [
    "First, the forensic lost wage verifications: W-2s, tax returns or employment verifications that calculate accurate earnings loss and business disruption. Forensic just means it's documented well enough to stand up to a challenge.",
    "Next, the Chronological Negotiation Ledger. It's a master table of the demands and counter-offers over time, so the arbitrator can see the whole history of the negotiation at a glance.",
    "Finally, the audited lien payout sheets: the statutory health insurance holds and subrogation demands, all reconciled. Every lien we accept here comes out of the client's money, so each one gets checked."
   ],
   "ask": "Has anyone seen a client surprised by how much came off their settlement for liens? What could have caught it earlier?",
   "scenario": "Build Section 6 for a client claiming $18,000 in lost wages, with a hospital lien of $45,000 and a health insurer that paid the hospital $17,000. What do you verify before the numbers go into the binder?"
  },
  "p2": {
   "why": "Every dollar of lien we don't challenge comes straight out of the client's pocket.",
   "talk": "The practice here is cross-referencing. A hospital and a health insurer can both end up claiming the same bill, and if we don't catch it, the client pays twice out of their recovery.",
   "walk": [
    "First, cross-reference provider liens against what health insurance paid. If the insurer already paid the hospital at a reduced rate, that cuts off the hospital's right to double-recover the full face value from the client's recovery.",
    "Finally, the pitfall to watch: listing both a hospital lien and the insurer's payment of the same bill. That's one charge counted twice, and it's the client who pays for it."
   ],
   "ask": "Your turn: how do EOBs, the Explanation of Benefits from the health insurer, help you strip out a double-dipping lien? What exactly are you looking for on them?",
   "scenario": "Your binder lists both the hospital's full $45,000 lien and the health insurer's $17,000 payment for the same treatment. The defense points out the double count. How do you fix the ledger, and what does it do to your credibility?"
  }
 },
 "4::Skill Building: The PI Critical Thinking Audit Challenge (Arbitration)": {
  "p1": {
   "why": "Let's solve a real case study: what explicit facts must you pull from the intake files for the brief?",
   "talk": "Here's the file: John Doe v. Apex Delivery Services and Robert W. Smith. It didn't settle at mediation, and we're 48 hours from the formal Arbitration Brief Deadline. Defense counsel Jane Vance has filed a Pre-Hearing Statement saying John's back complaints come entirely from a 2018 work injury, and that his \"severe mental distress\" isn't backed up by the medical timeline.",
   "walk": [
    "First, read the defense position carefully. They say John had a 2018 lumbar strain, a lower-back strain, and since we haven't provided a baseline pre-accident MRI, the arbitrator must treat the current L4–L5 protrusions as a continuation of a pre-existing degenerative condition. Notice what their argument rests on: a gap in our proof.",
    "Finally, the critical thinking test. Dig into the \"Prior Neck/Back Issues\" data in the client's intake records. What explicit, specific facts do you need to pull and package into the Arbitration Brief to defeat this argument? Don't guess; point to the document."
   ],
   "ask": "Take two minutes with the person next to you. Which specific facts from the intake records would you pull, and which document proves each one?",
   "scenario": "The defense says John Doe's back pain is just his 2018 lumbar strain. His intake notes mention 'prior neck/back issues.' Which specific facts would you pull from his file to answer that argument in the arbitration brief?"
  },
  "p2": {
   "why": "In arbitration, arguments don't beat arguments; documents do.",
   "talk": "Here's the answer, and why it works. The defense built their case on a gap, so we close the gap with paper: one document for before the crash, and one for after.",
   "walk": [
    "First, the answer: pull the 2018 discharge notes proving the strain fully resolved in four weeks, with zero treatment for eight years. Pair them with the post-crash MRI showing an acute traumatic herniation caused by the impact. Acute and traumatic means new, and caused by force.",
    "Finally, the pitfall to watch: arguing without the documents that prove resolution. Saying \"it healed years ago\" carries no weight unless the discharge notes are there to show it."
   ],
   "ask": "Your turn: name the two documents that defeat the pre-existing argument, and tell me in one sentence what each one proves.",
   "scenario": "A colleague's draft brief says, 'The prior injury is irrelevant.' There are no documents attached. How would you rewrite that argument using John's 2018 discharge notes and his treatment history since the crash?"
  }
 },
 "4::Skill Building: The Arbitration Audit & Binder Build": {
  "p1": {
   "why": "This is where all six tabs come together, under real pressure, on a file that's already behind.",
   "talk": "Same file, John Doe v. Apex Delivery Services and Robert W. Smith, but now it's an emergency. The previous case manager missed logging the master schedule, and the formal arbitration hearing is in 48 hours. Our mandate: audit the scrambled file, sort 12 mixed documents into a six-tab trial binder, apply strict quality control, and resolve two defense landmines before the brief goes in.",
   "walk": [
    "First, sort the 12 documents into the six tabs. Get each one into its section so you can see what's there and what's missing.",
    "Next, apply each tab's QC rule: retainer paid, superseded complaint excluded, grayscale rejected, ledger matched to invoices, prior record paired with an expert, and liens audited for double recovery. Sorting without QC is just filing.",
    "Then, resolve Landmine 1, the \"pre-existing degenerative\" trap. It's the argument we just solved: the prior strain needs its proof of resolution sitting right beside it.",
    "After that, resolve Landmine 2, the double-dipping lien mirage. Metro General's hospital lien is $45,000, BlueCross has a $20,000 ERISA lien, and the BlueCross EOB shows $15,000 satisfied the $45,000 bill. Read that EOB before you accept either number.",
    "Finally, upload your binders in the CMS, so the attorney and the rest of the team are working from the same finished version."
   ],
   "ask": "Before you start: which of the six tabs do you expect to give you the most trouble, and why?",
   "scenario": "You have twelve documents and two days to build an arbitration binder on a file that's already behind. Among them are a grayscale photo set, a superseded complaint and a $45,000 Metro General lien. Sort the documents into the six tabs, and name which QC rule applies to each problem document."
  },
  "p2": {
   "why": "The landmines are where a fast binder turns into a wrong binder.",
   "talk": "The practices give you the right move on the lien mirage, and the habit that trips people up when the clock is running.",
   "walk": [
    "First, strip Metro General's $45,000 direct lien from the active ledger, and log BlueCross's $20,000 subrogation lien in Tab 6. The EOB shows that $45,000 bill was already satisfied with $15,000, so the hospital's lien doesn't come out of John's recovery.",
    "Finally, the pitfall to watch: sorting documents without applying QC. Every document can be in the right tab and the binder can still fail, because the old complaint or a grayscale photo is sitting in it."
   ],
   "ask": "Your turn: which document is the trap that must be excluded from the binder, and which QC rule catches it?",
   "scenario": "Rushing to finish, a colleague sorted all twelve documents into the right tabs but didn't apply any QC rules. The grayscale photos and the unverified $45,000 lien are still in. What problems will that cause at the hearing?"
  }
 },
 "4::Common Bottlenecks: Mediation (The Compromise Traps)": {
  "p1": {
   "why": "Our job isn't just to react to bottlenecks; it's to see them coming and eliminate them before they kill a case's momentum.",
   "talk": "A bottleneck is anything that stalls the case at the moment it should be moving. At mediation, the stalls usually trace back to preparation: money we can't prove, people without authority, and a mediator who didn't get what they needed in time. These three are the ones to anticipate.",
   "walk": [
    "First, unverified medical ledgers and liens. Unreconciled hospital bills or missing final treatment logs make our damages look unsubstantiated, meaning unproven, and nobody pays full value for a number they can't check.",
    "Next, missing decision-makers. That's an adjuster or defense representative who shows up without full settlement authority, the amount they're allowed to agree to, or without parameters negotiated ahead of time. They can talk all day, but they can't say yes.",
    "Finally, lack of confidential brief alignment. When the brief is late or missing critical exhibits, like MRIs or crash diagrams, the mediator can't prepare, and the session stalls before it starts."
   ],
   "ask": "Have you ever been in a meeting, in any job, where everyone showed up but nothing could actually be decided? What was missing?",
   "scenario": "At a mediation, the adjuster arrives with authority to settle for only $30,000, your ledger has two unreconciled hospital bills and your brief reached the mediator this morning. Name each bottleneck, and what you could have done weeks earlier to prevent it."
  },
  "p2": {
   "why": "Most mediation bottlenecks are built weeks earlier, by what we did or didn't send.",
   "talk": "The practices name the biggest bottleneck and the most avoidable one. Both come down to timing, and both are ours to prevent.",
   "walk": [
    "First, the single biggest mediation bottleneck is an unverified medical ledger. If the numbers aren't verified, everything built on top of them is up for debate.",
    "Finally, the pitfall to watch: a brief that reaches the mediator ten minutes before the session. The mediator walks in unprepared, and time that should go to negotiating goes to catching up."
   ],
   "ask": "Your turn: an adjuster arrives with only $10,000 of authority on a $100,000 policy case. What failed earlier? Think about what we should have sent, and when.",
   "scenario": "Looking back at a failed mediation, the team realizes the medical ledger was never verified and the defense spent the whole morning questioning it. What should the timeline have looked like to avoid this?"
  }
 },
 "4::Common Bottlenecks: Arbitration (The Trial-Ready Landmines)": {
  "p1": {
   "why": "The biggest operational landmine in arbitration is evidentiary exclusion.",
   "talk": "Arbitration is binding, so there are no second chances. Evidentiary exclusion means the arbitrator refuses to consider a piece of evidence, and once it's out, it's out. These three landmines do the most damage, and every one of them is preventable from our desk.",
   "walk": [
    "First, evidentiary exclusions. Missing documents or low-quality black-and-white photos can be permanently thrown out, and then it's as if that evidence never existed.",
    "Next, unaddressed pre-existing defense traps. That's failing to shield prior injury records, like a past strain, with an expert medical declaration. Leave that gap open and the defense walks right through it.",
    "Finally, calendar and deadline misses: scheduling windows with the arbitrator that aren't synchronized, or a hard brief cutoff that slips by. These are the quiet ones, because nothing looks wrong until the date is gone."
   ],
   "ask": "Think back to the six binder tabs. Which QC rule do you think protects against the most landmines at once?",
   "scenario": "At an arbitration, the arbitrator refuses to admit a key medical record because it wasn't exchanged on time, the defense raises a prior injury you didn't address, and a hearing date was set that conflicts with the expert's schedule. Which landmine is each, and how could each have been avoided?"
  },
  "p2": {
   "why": "These landmines don't just cost us an argument; they can cost the client part of the award.",
   "talk": "Both practices come straight from the binder rules we've already built. That's the point: binder QC is our countermeasure for the arbitration landmines.",
   "walk": [
    "First, package the prior discharge notes with an expert declaration. Without that pairing, the arbitrator may reduce the award.",
    "Finally, the pitfall to watch: printing damage photos in grayscale. It's one of the easiest mistakes on the list to make, and one of the most expensive, because the photo can be thrown out for good."
   ],
   "ask": "Your turn: which arbitration landmine is the hardest to recover from, the exclusion, the pre-existing trap, or the missed deadline? Make your case.",
   "scenario": "An arbitrator reduces the award, noting that 'the photographs do not show significant damage' and 'the prior injury was not addressed.' Both were fixable. What would you have done differently in the binder?"
  }
 },
 "4::Case Manager Operational Countermeasures: The 48-Hour Mandate": {
  "p1": {
   "why": "By doing a full file audit 48 hours before any deadline, you keep the handling attorney fully armed and ready to win.",
   "talk": "We solve these bottlenecks with the 48-Hour Operational Mandate. It's a simple rule with a big payoff: problems get found while there's still time to fix them, not on the morning of the session or the hearing. It covers the ledgers, the liens and the binder itself.",
   "walk": [
    "First, the 48-hour pre-session audit. Hard-code a mandatory file audit 48 hours before any deadline, to verify the ledgers and check the binder is complete. Hard-coded means it's on the calendar, not something we do if there's time.",
    "Next, proactive lien reconciliation. Audit the health insurance EOBs, the Explanation of Benefits, early, so we can eliminate double-dipping hospital liens before they ever reach the payout.",
    "Finally, scan the digital binders with OCR, that's the technology that turns a scanned page into searchable text. Then the attorney can search the binder for any word instead of flipping through pages."
   ],
   "ask": "Be honest: how far ahead of a deadline do you usually do your final check today? What would it take to make it 48 hours?",
   "scenario": "It's 48 hours before mediation. You run your audit and find the hospital hasn't sent its final ledger, two EOBs show the health plan paid bills the provider is still claiming, and the PDF binder isn't searchable. What do you do today about each?"
  },
  "p2": {
   "why": "Forty-eight hours out, you escalate what's missing; you don't wait for perfect.",
   "talk": "This practice is for the moment the audit finds a gap you can't close yourself, like a provider who hasn't sent the final ledger. The answer isn't to wait and hope. It's to tell the attorney and keep the binder moving.",
   "walk": [
    "First, if a provider hasn't sent the final ledger 48 hours before mediation, escalate to the attorney, mark the treatment \"Pending Final Verification,\" put the interim bills in the binder, and let the attorney set expectations in opening remarks. The gap gets handled openly instead of discovered at the table.",
    "Finally, the pitfall to watch: waiting for perfect records instead of escalating. Every hour spent quietly waiting is an hour the attorney could have used to plan around the gap."
   ],
   "ask": "Your turn: it's 48 hours out and a provider's final ledger still hasn't come in. Walk me through exactly what you do, in order.",
   "scenario": "A Case Manager keeps waiting for a provider's final ledger, hoping it arrives before mediation. It doesn't, and the attorney finds out the morning of the session. What should she have done 48 hours earlier, and who should she have told?"
  }
 }
});
