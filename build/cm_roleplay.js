const ROLEPLAY_CATEGORIES = [
  {id:"client", icon:"🤝", label:"Client Communication", topics:[
    {id:"transportwall", label:"The Transportation Wall", context:"The client (John Doe) is four weeks into a 12-week chiropractic program and wants to quit because his car broke down and the clinic is 45 minutes away. The Case Manager must prevent a treatment gap without making promises they can't keep."},
    {id:"miaclient", label:"The MIA Client Comes Back", context:"After 14 days of no contact, the client finally answers. He is ashamed of his facial scarring, doesn't want to see anyone, and is thinking of taking whatever the insurer offers. The Case Manager must re-engage him with empathy and get him back to treatment and a psych evaluation."},
    {id:"netcheck", label:"“Why Is My Check So Small?”", context:"The client just saw his settlement statement and is furious that fees, costs and liens took so much. The Case Manager must explain gross-to-net clearly, show the lien reductions already won, and stay composed."},
    {id:"latebill", label:"The Bill After Closing", context:"Weeks after the case closed, the client got a $1,200 radiology bill and calls angry. The Case Manager must verify it, own the missed records sweep, explain the release's lien responsibility, and offer a plan."},
    {id:"deponerves", label:"Deposition Nerves", context:"The client is terrified about tomorrow's deposition and asks whether he should leave out his 2018 back injury. The Case Manager must calm him, insist on the absolute truth, and review the testimony rules — without giving legal advice."},
    {id:"treatmentdebt", label:"“I Can't Afford Treatment”", context:"The client stopped physical therapy because he's afraid of medical debt. The Case Manager must validate the fear, explain how a Letter of Protection works, and explain why stopping against medical advice hurts the claim."}
  ]},
  {id:"insurance", icon:"🛡", label:"Insurance & Negotiation", topics:[
    {id:"firstcall", label:"The First Call on a Demand", context:"The Case Manager calls the adjuster after sending the demand to confirm receipt, point to the key exhibit, set a litigation-ready tone, and ask for the opening evaluation."},
    {id:"lowball", label:"Low-Ball & Stall Tactics", context:"The adjuster offers far below value and cites the 2018 strain, the 14-day gap and collateral source, then stalls ('waiting on my manager'). The Case Manager must use the anchor technique, the professional pause, and firm deadlines."},
    {id:"revocation", label:"The 5-Minute Revocation Threat", context:"The adjuster demands a signed release within minutes or the tender is revoked — right after new permanency evidence arrived. The Case Manager must refuse to be rushed, escalate to the attorney, and put the new evidence in writing."},
    {id:"umconsent", label:"UM Consent to Settle", context:"The Case Manager calls the client's own UM carrier to request written consent to settle the BI claim and a waiver of subrogation. The UM adjuster is slow-walking the request."},
    {id:"liabilitysplit", label:"Disputing a 50/50 Liability Split", context:"The adverse carrier assigned 50% fault to the client based only on its insured's statement. The Case Manager must challenge it with the evidence being gathered, without conceding anything."}
  ]},
  {id:"liens", icon:"⚖", label:"Providers & Lienholders", topics:[
    {id:"hospitallien", label:"Hospital Lien Double-Recovery", context:"Metro General asserts a $45,000 lien against a $12,700 bill that PIP and the health plan already paid in part. The hospital's revenue-recovery director insists the full lien must be protected."},
    {id:"erisa", label:"ERISA Plan Reduction", context:"A self-funded ERISA plan claims first-priority reimbursement and rejects Made Whole and Common Fund. The Case Manager must request the plan documents and itemization and negotiate a written reduction."},
    {id:"lopreduction", label:"LOP Provider Reduction", context:"A chiropractor treating under a Letter of Protection wants the full balance. The Case Manager asks for a reduction in the interest of global resolution."},
    {id:"priorcounsel", label:"Prior Counsel's Quantum Meruit Lien", context:"The client's former attorney demands $1,200 for costs and 8 hours of work. The Case Manager separates reimbursable costs from clerical overhead and negotiates."},
    {id:"recordsdelay", label:"Records Stuck at the Provider", context:"A provider's records department hasn't produced records or a final ledger in 40 days, and a deadline is close. The Case Manager escalates professionally."}
  ]},
  {id:"litigation", icon:"🏛", label:"Litigation & ADR", topics:[
    {id:"mediationsched", label:"Mediation Scheduling Pushback", context:"Opposing counsel's office rejects every proposed mediation window and pushes a date the attorney can't make. The Case Manager must hold the line and escalate correctly."},
    {id:"uplarbitrator", label:"The Arbitrator Asks You a Question", context:"During an arbitration break the arbitrator (or opposing counsel) asks the Case Manager to explain a medical bill. The Case Manager must avoid the unauthorized practice of law and defer to the attorney."},
    {id:"adjusterdirect", label:"Adjuster Calls the Client Directly", context:"After suit was filed, the client reports the defense adjuster called him directly. The Case Manager must handle the client call, stop the contact, and notify the attorney."},
    {id:"extension", label:"Extension Request by Phone", context:"Defense counsel's paralegal calls asking for a one-week discovery extension and says 'no need to put it in writing.' The Case Manager must confirm the attorney's authority and document it in writing."}
  ]}
];
const ROLEPLAY_PERSONAS = [
  {id:"adjuster", label:"Aggressive Casualty Adjuster", sub:"Hard-line negotiator", desc:"Cites the 2018 record, the gap and collateral source; uses stalls, deadlines and low anchors."},
  {id:"client", label:"Distressed Client", sub:"Emotional / anxious", desc:"Scared, embarrassed or angry; may threaten to quit treatment or fire the firm; needs empathy and clarity."},
  {id:"counsel", label:"Opposing Counsel (Jane Vance)", sub:"Probing", desc:"Precise and pressuring; tests boundaries, deadlines and whether the Case Manager will overstep into legal advice."}
];

const CRISIS_SCENARIO_SETS = {
  cmTreatment1: [
    {id:"transport", title:"The Transportation Wall",
     setup:"John is 4 weeks into a 12-week intensive chiropractic program and doing well. His replacement car's transmission just died. The clinic is a 45-minute drive.",
     stakes:"If he quits now, a gap in treatment opens that the adjuster will use to argue he recovered — and his recovery stalls.",
     script:`OPENING LINE (John, played live, defeated): "I can't get to the clinic anymore. It's a 45-minute drive. I might as well just quit the program and try again next year when I have money saved."
FOLLOW-UP PRESSURE: "The bus takes two hours each way. I can't do that with my back."
CURVEBALL: "Can't you just tell the insurance company I'm still going?"`,
     objective:{recommendation:"Validate, then solve today: warm handoff to a ride resource or non-profit voucher, ask the clinic about telehealth/home program for the interim, confirm the next appointment, and document it in a GIRP note.",
       risksTradeoffs:"Doing everything for him risks mission creep and dependence; leaving it to him risks a gap. Never misrepresent attendance to the insurer.",
       blufStatement:`"Don't quit — let's keep you on track this week. I'll call the clinic with you right now about a home program, and I'm sending you two ride options today."`}},
    {id:"mia", title:"The MIA Client Comes Back",
     setup:"After 14 days of silence (04/01–04/15), John answers your call. Since his sutures came out he can't stand seeing his face and hasn't left the house.",
     stakes:"The adjuster is already citing the gap. Without a documented clinical reason, the gap costs value — and John needs help.",
     script:`OPENING LINE (John, flat and quiet): "Sorry I haven't called back. I just… I don't want anyone to see me like this."
FOLLOW-UP PRESSURE: "Maybe I should just take the $15,000 they offered and be done with it."
CURVEBALL: "Do I really have to go back to physical therapy? What's the point?"`,
     objective:{recommendation:"Lead with empathy, don't push the case first; arrange a psych evaluation and a warm handoff; explain simply why consistent treatment matters; tell the attorney about the settlement comment; document everything.",
       risksTradeoffs:"Pressure can deepen withdrawal; silence lets the gap and the lowball offer define the case.",
       blufStatement:`"I'm really glad you picked up. Let's get you some support first — I can set up a visit with a specialist who helps with exactly this. The attorney will talk with you before anything is decided about any offer."`}},
    {id:"stall", title:"The Stalled Surgical Referral",
     setup:"The carrier has sat on the neurosurgical/ESI authorization for three weeks. John has foot drop and calls, scared and angry.",
     stakes:"A systemic delay is becoming a medical danger and a documentation problem.",
     script:`OPENING LINE (John, alarmed): "My foot is dragging when I walk. Why is nobody approving the surgeon? What am I paying you people for?"
FOLLOW-UP PRESSURE: "The chiropractor says he can't do anything more for me."
CURVEBALL: "Should I just go to the ER?"`,
     objective:{recommendation:"Treat a new neurological deficit as a medical danger: tell him to contact his treating doctor now (ER if symptoms worsen suddenly), then climb the escalation ladder — peer-to-peer, Notice of Delay to the adjuster and attorney, LOP if needed.",
       risksTradeoffs:"Giving medical advice is out of scope; ignoring a neuro symptom is dangerous.",
       blufStatement:`"Call Dr. Spine's office right after we hang up — if it suddenly gets worse, go to the ER. I'm requesting a peer-to-peer and sending a Notice of Delay today."`}}
  ],
  cmNegotiate2: [
    {id:"firstcall", title:"The First Call on the $250,000 Demand",
     setup:"You call Aggressive Casualty's adjuster ten days after the John Doe demand went out.",
     stakes:"The first call sets the tone and tells you what the adjuster is really focused on.",
     script:`OPENING LINE (Adjuster, busy): "Yeah, I've got the Doe file somewhere in my stack. What do you need?"
FOLLOW-UP PRESSURE: "Two hundred fifty is a big number for what looks like a soft-tissue case with a gap."
CURVEBALL: "Off the record, what will your guy actually take?"`,
     objective:{recommendation:"Confirm receipt and point to specific exhibits (EMG, operative report, permanency), state the file is litigation-ready, ask for the opening evaluation, never reveal the client's bottom line.",
       risksTradeoffs:"Too soft invites a lowball; too combative ends the conversation.",
       blufStatement:`"I want to make sure you saw the April 20 EMG and the 5% WPI rating — this isn't soft tissue. The file is litigation-ready. What's your opening evaluation?"`}},
    {id:"stalltactics", title:"Stalls & the $45,000 Counter",
     setup:"The adjuster has countered at $45,000 citing the 2018 record, the gap, and collateral source.",
     stakes:"Your client nets less than zero at $45,000. You must move them without bidding against yourself.",
     script:`OPENING LINE (Adjuster): "Forty-five is fair given the 2018 back history and the fact he walked away from treatment for two weeks."
FOLLOW-UP PRESSURE: "I'll need to run anything higher by my manager. Could be a while."
CURVEBALL: "Global Health only paid eleven thousand. That's your real damages."`,
     objective:{recommendation:"Professional pause, then make them justify the number; rebut each point with documents; set a deadline for the authority response; state readiness to file.",
       risksTradeoffs:"Accepting an open-ended stall wastes time; dropping your number rewards the stall.",
       blufStatement:`"I'll give you until Thursday at 4:00 PM to get authority. If I don't hear back, the file goes to our litigation department."`}},
    {id:"fiveminutes", title:"The 5-Minute Revocation Threat",
     setup:"New permanency evidence just arrived. The adjuster says the $100,000 tender disappears unless a signed release arrives in five minutes.",
     stakes:"Signing now could waive UM rights and leave the client under-compensated; the firm faces malpractice exposure.",
     script:`OPENING LINE (Adjuster, sharp): "I need the signed release in my inbox in five minutes or the hundred thousand is off the table. Permanently."
FOLLOW-UP PRESSURE: "Your client's company-defendant is out of business. This is the only money he'll ever see."
CURVEBALL: "Just have him sign — you can sort the liens out later."`,
     objective:{recommendation:"Don't be rushed; escalate to the handling attorney immediately; send the new permanency evidence with a time-limited demand in writing; refuse the defective release; protect UM consent.",
       risksTradeoffs:"Losing a tender is a risk — but signing a global release with UM waiver and personal indemnity is worse.",
       blufStatement:`"We received new permanency findings this morning. My attorney will respond in writing today. We won't sign a release under a five-minute deadline."`}}
  ],
  cmLien3: [
    {id:"metro", title:"Metro General's $45,000 Lien",
     setup:"You call Brenda Sterling, Director of Revenue Recovery at Metro General, about the $45,000 hospital lien.",
     stakes:"The hospital's own statement is $12,700; PIP paid $7,800 and the health plan paid its contract rate.",
     script:`OPENING LINE (Brenda, firm): "Our lien is statutory. We expect the full forty-five thousand protected at settlement."
FOLLOW-UP PRESSURE: "What the insurance paid doesn't change our charges."
CURVEBALL: "If you disburse without paying us, the firm is personally liable."`,
     objective:{recommendation:"Ask for the itemized ledger and payment history; point out the double-recovery; request the verified balance and a written final payoff letter; confirm nothing is disbursed until it's in hand.",
       risksTradeoffs:"Ignoring a statutory lien creates firm liability; accepting face value robs the client.",
       blufStatement:`"Please send the itemized ledger with all payments applied. Your statement is $12,700 and PIP and the plan have paid part of it — we'll protect the verified balance, not the face amount."`}},
    {id:"bluecross", title:"BlueCross ERISA Reimbursement",
     setup:"You call BlueCross Recovery Services about its $20,000 ERISA subrogation claim.",
     stakes:"The plan rejects Made Whole and Common Fund; a separate notice itemizes only $11,200.",
     script:`OPENING LINE (Lien specialist): "The plan is self-funded under ERISA. We don't reduce for attorney fees and we don't care about made-whole."
FOLLOW-UP PRESSURE: "Twenty thousand is the current number."
CURVEBALL: "Why do you need the plan documents? Just pay it."`,
     objective:{recommendation:"Request the SPD/plan document and an itemized payment ledger; question the $20,000 vs $11,200; remove unrelated or duplicate charges; ask for a hardship/procurement reduction in writing.",
       risksTradeoffs:"Paying without itemization overpays; stonewalling delays disbursement.",
       blufStatement:`"Please send the plan document and an itemized ledger — the only itemization we have totals $11,200. Once we confirm what was paid for this accident, we can discuss a written reduction."`}},
    {id:"slow", title:"Barry Slow's Quantum Meruit Lien",
     setup:"Prior counsel Barry Slow wants his $1,200 — $400 costs and 8 hours at $100.",
     stakes:"He was fired for pushing a $15,000 offer; his work was mostly intake and ordering a police report.",
     script:`OPENING LINE (Barry Slow): "My firm did the groundwork on this case. I want my twelve hundred."
FOLLOW-UP PRESSURE: "I got them to fifteen thousand before he fired me."
CURVEBALL: "If you don't agree, I'll file a lien in court and hold up the whole settlement."`,
     objective:{recommendation:"Agree to reimburse documented costs; challenge clerical hours as overhead; ask for the time log; propose a figure and get it in writing.",
       risksTradeoffs:"A court fight delays disbursement; overpaying hurts the client.",
       blufStatement:`"We'll reimburse your documented $400 in costs. The intake and records ordering are clerical overhead — please send your time log and we can resolve the rest today."`}}
  ],
  cmLitigation5: [
    {id:"nerves", title:"The Night Before the Deposition",
     setup:"John calls the evening before his deposition.",
     stakes:"If he hides the 2018 injury, the defense will catch it and his credibility is gone.",
     script:`OPENING LINE (John, anxious): "I can't sleep. What if they ask about my back in 2018? Can I just say I never hurt it before?"
FOLLOW-UP PRESSURE: "What if I say something wrong and lose the whole case?"
CURVEBALL: "Should I wear my good watch? I want to look successful."`,
     objective:{recommendation:"Calm him; the absolute truth is non-negotiable; review the 2-second pause, short answers, 'I don't recall', the 'Is that all?' answer; dress code; confirm logistics and a backup number; the attorney handles legal questions.",
       risksTradeoffs:"Over-coaching sounds rehearsed; giving legal advice is out of scope.",
       blufStatement:`"Tell the truth about 2018 — it helps you, because it healed. Pause two seconds, answer only what's asked, and leave the watch at home. I'll confirm the time and Zoom link with you in the morning."`}},
    {id:"isthatall", title:"Mock Drill — “Is That All?”",
     setup:"You play the client; the AI plays defense counsel Jane Vance running a mock cross.",
     stakes:"One careless 'yes' can bar complaints about other injuries later.",
     script:`OPENING LINE (Jane Vance, calm): "So, Mr. Doe, the only thing you hurt in this accident was your lower back — correct?"
FOLLOW-UP PRESSURE: (Long silence after your answer.)
CURVEBALL: "How fast was the truck going?"`,
     objective:{recommendation:"Answer with the drill line about primary injuries and the complete medical record; embrace the silence; don't guess speed.",
       risksTradeoffs:"Volunteering detail widens the target.",
       blufStatement:`"Those are the main injuries that come to mind right now, but my complete medical records detail everything I've discussed with my doctors."`}},
    {id:"direct", title:"The Adjuster Called Me",
     setup:"After suit was filed, John tells you the Aggressive Casualty adjuster called him at home with a 'quick question.'",
     stakes:"All contact must go through counsel once suit is filed.",
     script:`OPENING LINE (John, confused): "The insurance lady called me at home. She was really nice — she just wanted to know if my back was better."
FOLLOW-UP PRESSURE: "I told her it's a little better some days. Was that bad?"
CURVEBALL: "She said she'd call again tomorrow."`,
     objective:{recommendation:"Reassure without alarm; instruct him not to discuss the case and to refer calls to the firm; document exactly what was said; notify the attorney immediately.",
       risksTradeoffs:"Scaring him damages trust; ignoring it lets the defense build statements.",
       blufStatement:`"You didn't do anything wrong. If she calls again, say 'please contact my attorney' and hang up. I'm telling our attorney right now."`}}
  ],
  cmJordan5: [
    {id:"debt", title:"“I'm Going to Drown in Medical Debt”",
     setup:"Jordan Davies stopped PT on 04/13. Dr. Nand ordered 6 more weeks and a shoulder surgery re-evaluation.",
     stakes:"Every missed week weakens the claim and his recovery.",
     script:`OPENING LINE (Jordan, stressed): "I can't keep going. Every visit is another bill. I'm going to drown in medical debt."
FOLLOW-UP PRESSURE: "And the other guy's insurance is saying it's half my fault anyway."
CURVEBALL: "Can you just promise me I won't have to pay any of this?"`,
     objective:{recommendation:"Validate the fear; explain a Letter of Protection in plain words (provider waits to be paid from the settlement); explain that stopping against doctor's orders gives the insurer a reason to devalue; mention MedPay; get him rescheduled; no promises of outcome; tell him the attorney is fighting the 50/50.",
       risksTradeoffs:"Promising he'll never pay is a misrepresentation; ignoring the fear loses him.",
       blufStatement:`"I hear you — and there's a way to keep treating without paying up front. It's called a Letter of Protection. Let's get you back on Dr. Nand's schedule this week."`}},
    {id:"fault", title:"“They Say I Ran the Red”",
     setup:"Jordan just read State General's 50/50 letter.",
     stakes:"He's angry and wants to call the adjuster himself.",
     script:`OPENING LINE (Jordan, angry): "That light was yellow! I'm calling that adjuster myself and telling her what really happened."
FOLLOW-UP PRESSURE: "There was a bus driver right there — she saw everything."
CURVEBALL: "What if I just post the story on Facebook?"`,
     objective:{recommendation:"Stop him from contacting the adjuster or posting; capture the bus-driver detail; explain the evidence you're requesting (cameras, CCTV, witness); keep him focused on treatment.",
       risksTradeoffs:"Client statements and posts can be used against him.",
       blufStatement:`"Please don't call her or post anything — let us do the talking. The bus driver is gold; I'm contacting the transit authority today and requesting the camera footage."`}},
    {id:"mom", title:"Linda Asks About Her Insurance",
     setup:"Jordan's mother Linda calls after receiving a notice letter to her carrier, Allied Mutual.",
     stakes:"Her policy's stacked UIM may be the biggest source of recovery.",
     script:`OPENING LINE (Linda, worried): "Why did my insurance company get a letter about Jordan's accident? Is my premium going to go up?"
FOLLOW-UP PRESSURE: "I don't want to get involved in a lawsuit."
CURVEBALL: "Can I just take him off my policy?"`,
     objective:{recommendation:"Explain resident-relative UIM in plain language; she isn't being sued; the notice protects Jordan's rights; don't give legal/insurance advice about premiums or removing him — refer to the attorney/her agent; document the call.",
       risksTradeoffs:"Confidentiality — Jordan is the client; share only what he's authorized.",
       blufStatement:`"You're not being sued. Because Jordan lives with you, your policy may help cover his injuries, and the letter protects that right. The attorney can answer any policy questions."`}}
  ]
};
