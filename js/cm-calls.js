/* ============================================================
   LSH Case Management Training — 📞 Call Simulator
   A separate practice floor for the phone work a Case Manager does
   every day: the front desk, intake, client calls, reporting to the
   attorney, adjusters and providers. Each call is live (the AI plays
   the caller, the portal's voice engine rings, speaks and listens),
   followed by the documentation the call requires, then a scored
   debrief on a rubric built for that kind of call.
   Loaded after cm-skillbuilders.js.
   ============================================================ */
(function(){
"use strict";

const st = document.createElement("style"); st.id = "cm-calls-css"; st.textContent = `
.cl-hero{display:flex;gap:16px;align-items:center;justify-content:space-between;flex-wrap:wrap;padding:18px 20px;margin-bottom:18px;border-left:4px solid var(--orange)}
.cl-hero b{color:var(--navy);font-size:15px}.cl-hero p{margin:4px 0 0;font-size:12.8px;color:var(--ink-soft);max-width:70ch}
.cl-lines{display:grid;grid-template-columns:repeat(auto-fit,minmax(230px,1fr));gap:12px;margin-bottom:20px}
.cl-line{padding:16px 18px;cursor:pointer;display:flex;flex-direction:column;gap:6px;transition:transform .12s,box-shadow .12s}
.cl-line:hover{transform:translateY(-2px);box-shadow:0 8px 22px rgba(20,24,60,.10)}
.cl-line .ic{font-size:26px}.cl-line b{color:var(--navy);font-size:14.5px}
.cl-line p{margin:0;font-size:12.5px;color:var(--ink-soft)}
.cl-line .meta{font-size:11.5px;color:var(--ink-soft);margin-top:auto;display:flex;justify-content:space-between;gap:8px}
.cl-line .avg{font-weight:700;color:var(--navy)}
.cl-scn{padding:14px 18px;margin-bottom:10px;display:flex;gap:14px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.cl-scn b{color:var(--navy);font-size:14px}.cl-scn p{margin:3px 0 0;font-size:12.5px;color:var(--ink-soft);max-width:72ch}
.cl-tags{display:flex;gap:6px;flex-wrap:wrap;margin-top:6px}
.cl-tag{font-size:10.5px;font-weight:700;border-radius:999px;padding:2px 8px;background:#EEF0F6;color:var(--navy)}
.cl-tag.l1{background:#E3F4EA;color:#1D6B3C}.cl-tag.l2{background:#FFF1DE;color:#9A5B00}.cl-tag.l3{background:#FBE3E0;color:#9B2C1F}
.cl-tag.done{background:var(--navy);color:#fff}
.cl-brief{padding:18px 20px;margin-bottom:14px}
.cl-brief h3{margin:0 0 6px;color:var(--navy);font-size:15px}
.cl-brief ul{margin:6px 0 0;padding-left:20px;font-size:13px}
.cl-grid{display:grid;grid-template-columns:minmax(0,1fr) 300px;gap:18px;align-items:start}
.cl-grid.solo{grid-template-columns:minmax(0,1fr)}
@media (max-width:900px){.cl-grid{grid-template-columns:minmax(0,1fr)}}
.cl-side{padding:14px 16px;font-size:12.5px}
.cl-side b{color:var(--navy);font-size:12.5px}
.cl-side ul{margin:6px 0 12px;padding-left:18px}
.cl-note textarea{width:100%;min-height:230px;padding:12px;border-radius:8px;border:1px solid var(--line);font-family:'IBM Plex Mono',monospace;font-size:12.5px;line-height:1.5;resize:vertical}
.cl-transcript{max-height:260px;overflow:auto;border:1px solid var(--line);border-radius:8px;padding:10px 12px;background:#FAFAFC;font-size:12.5px}
.cl-transcript div{margin-bottom:6px}.cl-transcript .c{color:var(--navy)}.cl-transcript .t{color:#7A4A10}
.cl-hist{width:100%;border-collapse:collapse;font-size:12.5px}
.cl-hist th,.cl-hist td{text-align:left;padding:7px 8px;border-bottom:1px solid var(--line)}
.cl-hist th{font-size:11px;text-transform:uppercase;letter-spacing:.03em;color:var(--ink-soft)}
.cl-sub{display:grid;grid-template-columns:repeat(auto-fit,minmax(170px,1fr));gap:8px;margin:12px 0}
.cl-sub div{border:1px solid var(--line);border-radius:9px;padding:8px 10px;background:#fff;font-size:12px}
.cl-sub div b{display:block;font-size:15px;color:var(--navy)}
.cl-sub div span{color:var(--ink-soft)}
.cl-incoming{position:relative;overflow:hidden}
.cl-incoming .btn{animation:clPulse 1.4s infinite}
@keyframes clPulse{0%,100%{box-shadow:0 0 0 0 rgba(232,125,40,.5)}50%{box-shadow:0 0 0 10px rgba(232,125,40,0)}}
`;
document.head.appendChild(st);

const E = (s)=> (s==null?"":String(s)).replace(/[&<>"']/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const FIRM = "LSH Law Group";
const ATTY = "Attorney Dana Carter";

/* ================================================================
   CALL LINES — each has its own documentation and rubric.
   Scenario fields: caller/role, brief (what the trainee knows before
   picking up), opening (the caller's first line), facts (what the
   caller knows — revealed only when asked), behavior, goals (what a
   strong call achieves; shown in Guided mode, always used to grade).
   ================================================================ */
const CALL_LINES = [
{id:"reception", icon:"☎", label:"Reception & Front Desk", who:"receptionist answering the firm's main line",
 sub:"Answer the main line: greet, identify, protect confidentiality, route or take a perfect message.",
 note:{title:"Message slip / routing note", template:"CALLER NAME:\nCOMPANY / RELATIONSHIP:\nCALLBACK NUMBER:\nBEST TIME TO CALL BACK:\nREGARDING (client / case / claim #):\nMESSAGE:\nURGENCY (routine / today / urgent) AND WHY:\nROUTED TO / ACTION TAKEN:"},
 rubric:[
  {label:"Greeting & Professionalism", desc:"Firm greeting with name, warm and composed tone, controls the call, closes it properly."},
  {label:"Caller ID & Purpose", desc:"Gets the caller's full name, organization, relationship to the matter, callback number, and the actual reason for the call."},
  {label:"Confidentiality & Boundaries", desc:"Does not confirm or deny representation to third parties, discloses no case details, gives no legal advice, verifies identity before discussing anything."},
  {label:"Routing & Message Accuracy", desc:"Routes correctly (or takes a message) with the right urgency; the message slip is complete and matches what the caller actually said."}],
 tips:["Greet with the firm name and your name.","Get name, number and reason before anything else.","Never confirm who the firm represents to a third party.","Read the number back to the caller.","Tell the caller exactly what happens next and when."],
 scenarios:[
  {id:"rc_status", title:"Spouse Asks for a Case Update", level:1, dir:"in", caller:"Jane Doe", role:"Spouse of client John Doe", usesCase:true,
   brief:"The main line is ringing. It's a Tuesday morning; the Case Manager on the Doe file is in a meeting until 11:30.",
   opening:"Hi, this is Jane Doe — my husband John is a client there. I've been trying to reach someone about his case. Is there any update on the settlement?",
   facts:"You are John's wife and were the front-seat passenger in the crash. John asked you to call because he's at physical therapy. Your number is (555) 982-4411. You want to know if the adjuster made a new offer. You also have neck pain that hasn't gone away and wonder if you should 'be part of the case'. You're not on the retainer. Best time to call back: after 2 PM.",
   behavior:"Friendly but a bit anxious. If the receptionist gives case details without checking authority, happily take them. If they explain they need John's permission, accept it after mild disappointment.",
   goals:["Greets professionally with the firm name","Verifies who Jane is and does NOT share case/settlement details without John's authorization on file","Flags Jane's own neck pain as a possible separate claim (conflict check) for the attorney/intake — without advising her","Takes a complete message with callback number (555) 982-4411 and time (after 2 PM)","Tells Jane who will call back and when"]},
  {id:"rc_reporter", title:"A Reporter Wants Confirmation", level:2, dir:"in", caller:"Marcus Bell", role:"Reporter, Metro Center Daily", usesCase:true,
   brief:"The main line rings. The caller ID shows a local newspaper.",
   opening:"Good afternoon, Marcus Bell with the Metro Center Daily. I'm writing about the Apex Delivery crash on Valentine's Day — I understand your firm represents the driver who got cut out of his Tesla. Can you confirm that and tell me how he's doing?",
   facts:"You're working on a story about Apex Delivery trucks and crashes. You heard from a tow driver that LSH represents the Tesla driver. Your number is (555) 310-7788, deadline 5 PM today. You'll try several angles: 'just confirm off the record', 'the family already talked to me', 'is he going to sue Apex?'.",
   behavior:"Polite, persistent, slightly pushy. Reword the question if blocked. If the receptionist stays firm and offers to pass a message to the attorney, accept it.",
   goals:["Neither confirms nor denies that the firm represents anyone","Shares no facts about any client or crash, even 'off the record'","Offers to take a message for the attorney (media inquiries go to the attorney)","Captures name, outlet, number (555) 310-7788 and the 5 PM deadline","Stays courteous — no 'no comment' hostility"]},
  {id:"rc_newlead", title:"A Frightened New Caller", level:1, dir:"in", caller:"Rosa Delgado", role:"Potential new client",
   brief:"The main line rings. The intake team is on another call.",
   opening:"Hello? Um, I was in a car accident two days ago and my neighbor said I should call a lawyer. I don't really know how this works. Can someone help me?",
   facts:"Rear-ended at a red light on Harbor Blvd two days ago. Neck and lower back pain, went to urgent care yesterday. Police came (report number unknown). The other driver's insurer already called and asked for a recorded statement — you haven't given one. Number (555) 448-2090. Available anytime today.",
   behavior:"Nervous and unsure. Asks 'Do I have a case?' and 'Should I talk to their insurance?'. Calms down if treated kindly.",
   goals:["Greets warmly and shows empathy","Collects name, number and a one-line summary without running the full intake","Does NOT evaluate the case or give legal advice ('do I have a case?') — explains intake/attorney will","Flags the recorded-statement request as urgent for intake (without advising herself beyond 'the intake team will talk to you about that before you speak to anyone')","Warm-transfers or schedules an intake callback with a specific time"]},
  {id:"rc_adjuster", title:"Adjuster With a Same-Day Offer", level:2, dir:"in", caller:"Tom Reeves", role:"Adjuster, Aggressive Casualty Insurance", usesCase:true,
   brief:"The main line rings. The Doe Case Manager is out today; the attorney is in a deposition.",
   opening:"Yeah, Tom Reeves, Aggressive Casualty. I need to talk to whoever's handling John Doe — claim 2026-0214-AX. I've got a limited-time offer and I need an answer today.",
   facts:"You're calling to put a $52,000 offer on the table, open until 5 PM today. You want a 'quick yes or no' and will try to get the receptionist to 'just pass it to the client directly'. Your direct line is (555) 700-1422, ext. 318.",
   behavior:"Brusque and in a hurry. Pushes the deadline. Tries to get the receptionist to relay the offer to the client or confirm details about treatment.",
   goals:["Identifies the caller, company and claim number","Discloses nothing about the client or treatment","Does not accept, relay to the client, or comment on the offer","Documents the exact offer ($52,000), the deadline (5 PM today) and the direct line with extension","Marks it URGENT and routes to the Case Manager/attorney immediately (interrupt protocol / text), telling the adjuster when to expect a call"]},
  {id:"rc_angry", title:"“Nobody Calls Me Back”", level:3, dir:"in", caller:"Derek Owens", role:"Existing client (a different file)",
   brief:"The main line rings. Derek's Case Manager is on vacation this week; a backup CM is covering.",
   opening:"This is Derek Owens. I have been calling for THREE weeks and nobody calls me back. I'm about ready to fire you people. Put me through to my lawyer right now.",
   facts:"Your case is a slip-and-fall at a grocery store last year. Your CM (Priya) went on vacation and you didn't know. You got a bill from a collections agency for your MRI ($1,850) and you're scared it will hurt your credit. Number (555) 227-6013. You'll calm down if someone takes ownership and gives you a real callback time.",
   behavior:"Angry and loud at first, interrupts. De-escalates if heard and given a specific plan. Escalates if brushed off or told 'she's on vacation, call back next week'.",
   goals:["Stays calm; acknowledges the frustration without blaming colleagues","Doesn't promise the attorney will pick up right now; offers the covering CM","Gets the real issue: collections notice for the MRI bill ($1,850)","Takes a complete, urgent message and gives a specific callback window","Notes the 'fire the firm' statement for the attorney (client-relations risk)"]}
 ]},
{id:"intake", icon:"📥", label:"Intake Calls", who:"intake specialist screening a new personal-injury inquiry",
 sub:"Screen new injury inquiries: empathy, full fact capture, red flags (SOL, prior counsel, conflicts), no case valuation.",
 note:{title:"Intake sheet", template:"CALLER / CLIENT NAME:\nPHONE / EMAIL:\nDATE OF BIRTH:\nDATE & TIME OF INCIDENT:\nLOCATION:\nHOW IT HAPPENED:\nOTHER PARTIES (names / employer / vehicle):\nINJURIES:\nTREATMENT SO FAR (providers / dates):\nPOLICE REPORT / INCIDENT REPORT #:\nINSURANCE (client's / other party's / health):\nWITNESSES / PHOTOS:\nPRIOR ATTORNEY / PRIOR INJURIES:\nRED FLAGS (SOL, liability, gaps, conflicts):\nRECOMMENDATION (accept / escalate / decline) & NEXT STEP:"},
 rubric:[
  {label:"Empathy & Rapport", desc:"Acknowledges the injury and the stress, keeps the caller comfortable, explains the process in plain language."},
  {label:"Fact Capture", desc:"Captures who/what/when/where/how, injuries, treatment, police report, insurance for all parties, witnesses, and contact details — and the intake sheet matches what the caller said."},
  {label:"Screening & Red Flags", desc:"Spots SOL problems, prior counsel/liens, liability issues, treatment gaps, pre-existing conditions and conflict-check names; asks the follow-up questions they call for."},
  {label:"Boundaries & Next Steps", desc:"No case valuation, no guarantees, no legal advice; clear next step (attorney review, sign-up, records) with a timeline; advises no recorded statements only as firm policy allows."}],
 tips:["Start with how they're doing, then 'walk me through what happened'.","Ask the date early — it drives the SOL.","Always ask: prior attorney? prior injuries? other people in the car?","Get every insurer: theirs, the other side's, health.","Never say what a case is worth."],
 scenarios:[
  {id:"in_rearend", title:"Rear-End Collision Intake", level:1, dir:"in", caller:"Kevin Tran", role:"New caller — rear-end collision",
   brief:"A new inquiry is transferred to you from the front desk.",
   opening:"Hi, yes, the lady at the front said you could help. I got rear-ended last week and my neck has been killing me.",
   facts:"DOB 03/22/1991. Rear-ended 9 days ago (last Thursday ~5:40 PM) at Oak St & 12th while stopped at a red light. Other driver: Lisa Moore, driving a 2020 Honda Civic, insured by Summit Auto (claim number not yet). Police came: Metro PD report 2026-1109-KT. Went to urgent care the next day (neck strain, told to follow up with primary doctor) — hasn't gone back since. Your insurer: Coastline Mutual, has PIP. Health insurance through work (Aetna). No witnesses except a passerby who left. You took photos of the bumper. No prior attorney. Prior injury: 'tweaked my neck at the gym' 2 years ago, fully healed. Works as a warehouse supervisor, missed 4 days. Phone (555) 612-3390, kevin.tran91@gmail.com.",
   behavior:"Cooperative, a little vague about details unless asked specifically. Asks 'How much do you think I could get?' at some point.",
   goals:["Captures date/time/location and mechanism (stopped at red, rear-ended)","Gets the other driver's name, vehicle and insurer, the police report #, and all insurance (PIP, health)","Identifies the treatment gap since urgent care and explains why consistent treatment matters (without medical advice)","Asks about prior injuries and prior counsel; records the gym neck injury","Declines to value the case; sets the next step (attorney review / sign-up) with a timeline"]},
  {id:"in_sol", title:"The Almost-Expired Claim", level:3, dir:"in", caller:"Linda Park", role:"New caller — old accident",
   brief:"A new inquiry comes in late on a Friday afternoon.",
   opening:"Hi. I had a car accident a while back and I've been having surgery on my shoulder and I finally feel ready to deal with it. Is it too late to do something?",
   facts:"The accident was 23 months ago (two years ago next month) — exact date: the 28th of that month, 23 months ago. T-boned by a city bus (Metro Transit) at 5th & Pine. Rotator cuff surgery 8 months ago. A different law firm (Hughes & Partners) handled it for 6 months then 'dropped' you by letter — you still have the letter. Never got a settlement. Metro Transit is a government entity (there may have been a short notice-of-claim deadline — you don't know if prior firm filed one). Phone (555) 901-4478.",
   behavior:"Hesitant, apologetic about waiting. Only mentions the prior law firm and the bus being city-owned if asked (who hit you? did you ever talk to a lawyer?).",
   goals:["Gets the exact date early and recognizes the SOL is about a month away","Identifies the government defendant (city bus) and the possible notice-of-claim issue","Discovers the prior firm (Hughes & Partners) and asks for the withdrawal letter (possible lien, file transfer)","Escalates to an attorney TODAY as urgent instead of scheduling routinely","Stays empathetic; makes no promises about whether it's too late"]},
  {id:"in_slipfall", title:"Grocery-Store Slip and Fall", level:2, dir:"in", caller:"Harold Jenkins", role:"New caller — slip and fall (age 72)",
   brief:"A caller's daughter set up this call; Harold is calling himself.",
   opening:"Good morning. I fell at the FreshWay grocery on Elm Street and broke my wrist. My daughter says I should talk to somebody.",
   facts:"DOB 06/02/1953. Fell 3 weeks ago (a Saturday ~10 AM) in the produce aisle — there was water from the misting system on the floor, no wet-floor sign. A store employee (name tag 'Carl') helped you up and filled out an incident report; you didn't get a copy. Ambulance to St. Mary's; distal radius fracture, cast, now PT twice a week. Medicare + a Medicare supplement (AARP). Your daughter Ellen took photos of the wet floor on her phone that day. Prior: osteoporosis diagnosis, a hip replacement in 2019. Phone (555) 330-8812; daughter Ellen (555) 330-8845 (you want her on calls).",
   behavior:"Polite, a little hard of hearing — asks the trainee to repeat things if they talk fast. Wants his daughter included.",
   goals:["Captures store, location in store, hazard, lack of warning sign, and the incident report (employee 'Carl')","Identifies evidence to preserve (store video, incident report, daughter's photos) — flags a preservation letter as urgent","Gets Medicare as the health payer (Medicare lien/conditional payments)","Records prior conditions (osteoporosis, 2019 hip) for the attorney","Handles the daughter request properly (permission / authorization) and sets the next step"]},
  {id:"in_represented", title:"Already Has a Lawyer", level:2, dir:"in", caller:"Brianna Scott", role:"New caller — already has a lawyer",
   brief:"A new inquiry. The front desk noted 'unhappy with current lawyer'.",
   opening:"Hi, I already have a lawyer for my accident but he never calls me back and I want to switch to you guys. Can you just take over?",
   facts:"Motorcycle vs. car, 7 months ago. Current attorney: Barry Slow, The Fast Settlement Firm (the same prior counsel on the Doe file). He pushed you to take $8,000; you refused. You signed his contingency agreement. Injuries: broken collarbone, road rash, 2 months PT. Your insurer: Local Farm Mutual. Phone (555) 774-0021.",
   behavior:"Frustrated with the current lawyer; wants a yes right now. Asks the intake specialist to 'just call Barry and tell him'.",
   goals:["Collects the incident facts and the current attorney's name/firm","Explains that switching is the client's choice and the new firm will handle the substitution — does not disparage the other lawyer","Flags the prior counsel's lien (quantum meruit / costs) for the attorney","Doesn't promise the firm will take the case; routes to attorney review","Does not contact the other attorney on the caller's behalf during the call"]},
  {id:"in_value", title:"“What’s My Case Worth?”", level:1, dir:"in", caller:"Andre Mills", role:"New caller — wants a number",
   brief:"A new inquiry about a dog bite.",
   opening:"Hey. My neighbor's dog bit me pretty bad on the leg. Before I waste my time — how much are these cases worth? Like, ballpark?",
   facts:"Bitten 5 days ago in front of your house by the neighbor's pit mix 'Rocco' (owner: Gary Hunt, next door, renter — landlord unknown). ER visit, 6 stitches, antibiotics; wound check in 2 days. Animal control came (report # AC-5521). The dog had bitten a delivery driver last year (you heard). Phone (555) 208-1175. You have photos of the wound.",
   behavior:"Keeps pushing for a dollar figure (asks 2-3 times). Becomes cooperative once the process is explained confidently.",
   goals:["Declines to give any value/ballpark and explains why (the attorney evaluates after records)","Captures owner, dog, prior-bite history, animal-control report # and the landlord question (possible insurance)","Captures injuries/treatment and the upcoming wound check","Asks about homeowner's/renter's insurance","Clear next step with timeline"]}
 ]},
{id:"client", icon:"🤝", label:"Client Communication", who:"Case Manager on the client's file",
 sub:"Existing clients: status updates, bad news, treatment, money questions — clear, kind, and never legal advice.",
 note:{title:"CMS case note", template:"DATE / TIME:\nCALL WITH:\nPURPOSE:\nWHAT THE CLIENT REPORTED (facts, treatment, concerns):\nWHAT I EXPLAINED:\nCOMMITMENTS MADE (by whom / by when):\nESCALATIONS TO ATTORNEY:\nFOLLOW-UP TASKS:"},
 rubric:[
  {label:"Empathy & Tone", desc:"Warm, patient, plain language; acknowledges emotion before information; no jargon or defensiveness."},
  {label:"Accuracy & Clarity", desc:"Uses correct file facts; explains status, process and next steps clearly; checks understanding."},
  {label:"Boundaries & Ethics", desc:"No legal advice or case valuation; no promises on outcome or timing; no cash advances; escalates decisions to the attorney."},
  {label:"Action & Documentation", desc:"Concrete next steps with owners and dates; the CMS note is accurate, complete and objective."}],
 tips:["Open with why you're calling (or thank them for calling).","Acknowledge feelings before facts.","Say what you'll do and by when — then write it down.","'That's a question for your attorney — I'll get you an answer by…'"],
 scenarios:[
  {id:"cl_pulse", title:"30-Day Client Pulse Call", level:1, dir:"out", caller:"John Doe", role:"Client (you are calling him)", usesCase:true,
   brief:"30-day client pulse call. John is post-microdiscectomy and doing PT. The demand is out; Aggressive Casualty countered $45,000 and the attorney rejected it. You're calling to check in.",
   opening:"Hello? Oh — hi. Is this about my case?",
   facts:"You're doing PT twice a week; your left foot still drags when you're tired. You got a letter from 'Global Health Blue-Shield' about a lien and you're confused (you thought you had BCBS). You missed one PT session last week because of a work meeting (you're on light duty). You want to know when it'll settle. You also mention you posted a photo of your scar on Facebook last week.",
   behavior:"Tired but cooperative. Asks 'so when do I get my money?'. Mentions the Facebook post casually near the end, only if the call goes on or if asked about anything new.",
   goals:["Explains the status (demand, $45,000 counter rejected) accurately without predicting timing or value","Captures the treatment update (foot drop symptoms, one missed PT) and encourages keeping appointments","Asks for / takes the Global Health Blue-Shield letter and flags the plan-identity discrepancy","Addresses social media: politely asks him to stop posting and flags to the attorney","Documents it all in the CMS note with follow-ups"]},
  {id:"cl_advance", title:"“Can the Firm Front Me Money?”", level:2, dir:"in", caller:"Maria Lopez", role:"Client — needs money",
   brief:"A client on a pending auto case calls your direct line. Her case is in negotiation.",
   opening:"Hi, it's Maria Lopez. Look, I'm behind on rent because I can't work. Can the firm just front me like two thousand dollars from my settlement? I'll pay it back.",
   facts:"Case: rear-end, 10 months ago, in negotiation. You're out of work on doctor's orders. Rent is due in 5 days ($1,450). You've heard of 'lawsuit loan' companies from TV ads and ask about them. You also ask whether you should just take the last offer ($18,000) so you can pay rent.",
   behavior:"Embarrassed, then desperate. Pushes twice for the advance.",
   goals:["Empathetic, non-judgmental","Explains the firm cannot advance living expenses (ethics rule) without lecturing","Does not advise on the pre-settlement loan or on accepting the offer — routes both to the attorney promptly","Offers legitimate help (e.g., community resources, disability/wage-loss claim paperwork if applicable)","Documents the settlement-authority question as an attorney escalation with a callback time"]},
  {id:"cl_denial", title:"Delivering Bad News: PD Denied", level:2, dir:"out", caller:"John Doe", role:"Client (you are calling him)", usesCase:true,
   brief:"You need to tell John that Aggressive Casualty DENIED the property-damage claim for his Tesla ($42,500 total loss) under Exclusion 4.b. His own collision coverage (Local Farm Mutual, ACV, $1,000 deductible) is the path. He doesn't know yet.",
   opening:"Hey, this is John. What's going on?",
   facts:"You were counting on Apex's insurance paying for the Tesla. You're still paying the car loan (~$700/month) and renting a car ($45/day) for three weeks. You're upset: 'Their guy ran a red light!'. Ask: 'Can we sue them for the car?' and 'Why do I have to pay a deductible?'",
   behavior:"Frustrated, a bit angry at the unfairness; calms if the path forward is clear.",
   goals:["Leads with the bottom line kindly (BLUF) — the PD claim was denied under Exclusion 4.b","Explains the next path: his collision coverage (ACV, $1,000 deductible) and that the deductible may be recovered later (attorney's call) — no promises","Routes 'can we sue for the car' to the attorney","Addresses the rental and loan concerns with concrete next steps (open the collision claim, gap insurance question)","Documents the call and follow-ups"]},
  {id:"cl_depo", title:"Night-Before-Deposition Panic", level:3, dir:"in", caller:"John Doe", role:"Client — deposition tomorrow", usesCase:true,
   brief:"The day before John's deposition. He calls you in the evening.",
   opening:"Hey, sorry to call late. I'm freaking out about tomorrow. Honestly — do I have to tell them about my back thing in 2018? It was nothing.",
   facts:"You're scared the 2018 lumbar strain will 'ruin' the case. You also forgot what time to be there and whether to bring anything. You want to know if you can bring Jane.",
   behavior:"Anxious, rambling. Tests whether the CM will tell him what to say.",
   goals:["Calms him and insists on complete honesty — never suggests hiding anything","Does not coach testimony or give legal advice; routes content questions to the attorney (offers to set a quick prep call tonight/in the morning)","Confirms logistics (time, place, ID, dress, no documents unless the attorney says)","Handles the 'bring Jane' question correctly (attorney decides; she may be a witness)","Documents and notifies the attorney of his anxiety and the 2018 question"]},
  {id:"cl_net", title:"“Why Is My Check So Small?”", level:2, dir:"in", caller:"John Doe", role:"Client — upset about his net", usesCase:true,
   brief:"The settlement statement went out yesterday. Gross $150,000; attorney fee 40% of gross after costs; costs $2,090; liens negotiated down to $28,000; net to client $60,746.",
   opening:"I just looked at this statement. A hundred and fifty thousand dollars and I get sixty? How is that fair? Where did all my money go?",
   facts:"You didn't realize the fee went to 40% when suit was filed. You think the lien reductions 'didn't happen'. You want the check this week.",
   behavior:"Angry, feels cheated. Calms down when walked through the numbers line by line.",
   goals:["Acknowledges the feeling before walking through the math","Walks gross → costs → fee (40% because suit was filed, per the retainer) → liens → net accurately","Points out the lien reductions already won (from the asserted amounts)","Does not promise a date for the check; explains trust-account clearance and signatures","Offers an attorney call if he still disputes the fee; documents it"]}
 ]},
{id:"attorney", icon:"⚖", label:"Attorney Reporting", who:"Case Manager reporting to the handling attorney",
 sub:"Brief the handling attorney: BLUF, exact facts and deadlines, the decision you need — in under three minutes.",
 note:{title:"Follow-up recap email to the attorney", template:"SUBJECT:\nBLUF:\nKEY FACTS / NUMBERS:\nDEADLINES (date + time):\nDECISION / AUTHORITY NEEDED:\nWHAT I'VE DONE:\nNEXT STEPS (owner / date):"},
 rubric:[
  {label:"BLUF & Brevity", desc:"Leads with the bottom line in the first sentence; no rambling or background first; respects the attorney's time."},
  {label:"Factual Accuracy", desc:"Correct names, numbers, dates and document references; answers the attorney's follow-up questions precisely or says 'I'll confirm by…' instead of guessing."},
  {label:"Deadlines & Decision", desc:"States every deadline with date/time; asks clearly for the decision or authority needed; confirms the attorney's instruction back."},
  {label:"Ownership & Documentation", desc:"Owns problems (including mistakes) without excuses; proposes a plan; the recap email accurately captures instructions."}],
 tips:["First sentence = the bottom line.","Numbers and dates, not adjectives.","Say what you need: 'I need your decision on X by Y.'","Repeat the instruction back before hanging up."],
 scenarios:[
  {id:"at_weekly", title:"Weekly Status Report on Doe", level:1, dir:"out", caller:ATTY, role:"Handling attorney (you are calling her)", usesCase:true,
   brief:"Weekly status call on John Doe v. Apex. Current facts: demand $250,000 sent 05/15; counter $45,000 on 05/22; rejected 05/26. New since last week: Dr. Neil Ron's 5% WPI permanency report arrived; Metro General's lien ($45,000) is disputed against its $12,700 bill; John missed one PT session; the 30-day policy-limits clock is running. You need: approval to send the permanency report with a supplemental demand.",
   opening:"Carter. I've got about three minutes before a call — what do you have on Doe?",
   facts:"You're busy and direct. You'll ask: 'What's the WPI number?', 'Did the adjuster respond to the rejection?', 'What's the Metro General issue exactly?', 'When does the policy-limits clock run?'. If the CM gives a clear ask, you approve the supplemental demand and ask for a draft by tomorrow noon. If they ramble, cut them off: 'Bottom line?'",
   behavior:"Impatient with rambling, appreciative of crisp answers. Tests accuracy with one pointed question.",
   goals:["Opens with BLUF (new permanency report + the ask)","States numbers correctly (5% WPI, $250,000 / $45,000, $45,000 lien vs $12,700 bill)","Gives deadline dates rather than vague timing","Gets a clear decision and repeats it back (supplemental demand draft by tomorrow noon)","Recap email accurately reflects the instruction"]},
  {id:"at_rfa", title:"Urgent: RFAs Served", level:2, dir:"out", caller:ATTY, role:"Handling attorney (you are calling her)", usesCase:true,
   brief:"URGENT: Defense served Requests for Admission on John Doe v. Apex by mail on 06/12/2026 (30 days + 3 for mail → responses due 07/15/2026). Several RFAs ask John to admit his injuries pre-existed the crash. The attorney is at the courthouse.",
   opening:"I'm between hearings — is this urgent?",
   facts:"You'll ask: 'Served how and when?', 'What's the due date?', 'How many requests?' (say you don't have it in front of you if they ask you), 'Have you calendared it?'. You'll instruct: calendar a 7-day warning, send the draft responses to you by 07/08, and set a client meeting to review the RFAs.",
   behavior:"Rushed but engaged once you hear 'RFAs'. Irritated by any wrong date.",
   goals:["Leads with 'RFAs served — deemed admitted if we miss 07/15'","Correct service method and calculation (mail +3 days)","Confirms docketing with warning alerts","Gets and repeats the instructions (drafts by 07/08, client meeting)","Recap email with the exact dates"]},
  {id:"at_mistake", title:"Owning a Missed Subpoena", level:3, dir:"out", caller:ATTY, role:"Handling attorney (you are calling her)", usesCase:true,
   brief:"You discovered that the Metro General subpoena was never served — it's been sitting in the outbox for 12 days (the subpoena audit should happen every 10 days). The mediation is in 3 weeks and the records are needed for the binder. You need to tell the attorney.",
   opening:"Hi — what's up?",
   facts:"You'll ask: 'How did that happen?', 'What's the impact on mediation?', 'What's your fix?'. You respond well to ownership + a plan (serve today, request expedited production, call the records custodian, add a check to the audit). You react badly to blaming others or minimizing.",
   behavior:"Calm but serious. Probes for ownership.",
   goals:["States the problem plainly up front (no burying it)","Owns it without excuses or blaming a colleague","Explains the impact (records for the mediation binder, timeline)","Brings a concrete fix with dates (serve today, expedited production, custodian call, audit fix)","Recap email is honest and complete"]},
  {id:"at_offer", title:"Conveying a New Offer", level:2, dir:"out", caller:ATTY, role:"Handling attorney (you are calling her)", usesCase:true,
   brief:"Aggressive Casualty's adjuster just called with a new offer of $95,000 on John Doe, open until Friday 5 PM. The client asked you yesterday to 'get it done soon' but has not given any number. Liens asserted: $45,000 Metro General, $20,000 BlueCross ERISA, $11,200 Global Health, $1,200 prior counsel.",
   opening:"Carter. Go ahead.",
   facts:"You'll ask: 'What did the adjuster say about the permanency report?', 'What's the client's net at 95?', 'What are the liens at right now?'. You want a quick net estimate, and you'll instruct the CM to schedule a client call Thursday at 10 and prepare a net sheet at 95k and at 125k.",
   behavior:"Analytical. Expects the CM NOT to have discussed the offer's merits with the client.",
   goals:["BLUF: new offer $95,000, deadline Friday 5 PM","Accurate lien totals; any net estimate clearly labeled as preliminary","Makes clear nothing was said to the client about accepting","Gets and repeats instructions (client call Thu 10 AM, net sheets at 95k and 125k)","Recap email with the offer, deadline and tasks"]},
  {id:"at_jordan", title:"Jordan Davies Coverage Briefing", level:3, dir:"out", caller:ATTY, role:"Handling attorney (you are calling her)",
   brief:"Jordan Davies file: the at-fault driver's policy is only $10,000 (State General), and State General is proposing a 50/50 liability split based only on its insured's statement. You found hidden coverage: Jordan's own Coastal Mutual UIM, plus Allied Mutual UIM through the household (his mother's policy). Summit Auto does NOT apply. CCTV at the Quick-Fuel station may be overwritten in ~30 days. Jordan stopped treatment 2 weeks ago because he's scared of the bills.",
   opening:"I've got ten minutes. Davies — good news or bad news first?",
   facts:"You'll ask: 'How much UIM?', 'Have we sent notice to the UIM carriers?', 'Why not Summit?', 'What's the plan to fight the split?'. You'll approve preservation letters today and the notice letters, and ask about getting Jordan back into treatment (LOP).",
   behavior:"Fast and strategic. Checks whether the CM understands consent-to-settle with UIM.",
   goals:["Leads with the coverage finding (UIM stack) and the liability-split threat","Accurately explains Coastal + Allied (not Summit) and the need for notice/consent before any BI tender","Proposes evidence preservation (Quick-Fuel CCTV, 911/CAD, bus-driver witness) with urgency","Raises the treatment gap and an LOP solution","Gets approvals and repeats them; recap email complete"]}
 ]},
{id:"insurance", icon:"🛡", label:"Adjusters & Carriers", who:"Case Manager calling or taking calls from insurers",
 sub:"Set up claims, get coverage and PIP info, push stalled files — and never let an adjuster take a statement from your client.",
 note:{title:"Call log (CMS note)", template:"DATE / TIME:\nSPOKE WITH (name / title / direct line):\nCARRIER / CLAIM #:\nPURPOSE:\nINFORMATION OBTAINED:\nREQUESTS MADE / DOCUMENTS TO SEND:\nCARRIER'S POSITION / COMMITMENTS:\nCONFIRMATION LETTER SENT? (Y/N, date):\nFOLLOW-UP DATE:"},
 rubric:[
  {label:"Preparation & Identifiers", desc:"Has the claim #, insured, DOL, policy and client identifiers ready; confirms the adjuster's name, title and direct line."},
  {label:"Assertiveness & Composure", desc:"Professional and firm; pushes for specific answers and dates; doesn't get rattled by stalls or pressure."},
  {label:"Protecting the Client", desc:"No recorded statements, no blanket medical authorizations, no admissions or speculation; nothing that hurts liability or damages."},
  {label:"Follow-Through", desc:"Gets commitments with dates, confirms everything in writing, and the call log is complete and accurate."}],
 tips:["Get the adjuster's full name and direct line first.","Ask for specifics: amount, date, document.","'I'll confirm our conversation in writing today.'","Recorded statements and blanket authorizations: not without the attorney."],
 scenarios:[
  {id:"ins_pip", title:"PIP Status & Coverage Check", level:1, dir:"out", caller:"Sarah Miller", role:"PIP adjuster, Local Farm Mutual", usesCase:true,
   brief:"Call Local Farm Mutual (John Doe's own carrier) to confirm PIP status. Claim LFM-99210-JD. You need: the PIP payment ledger, confirmation PIP is exhausted, the UM/UIM limits ($250k/$500k) in writing, and the dec page.",
   opening:"Local Farm Mutual claims, this is Sarah Miller.",
   facts:"PIP $10,000 is exhausted: EMS $2,200 + ER $4,800 + CT $3,000, all paid in February/March. You can email the ledger but need a letter of representation on file first (you have it). You will ask the CM to 'have Mr. Doe call me for a quick recorded statement on the UM side'. Direct line (555) 480-2200 ext. 44.",
   behavior:"Friendly, procedural. Slips in the recorded-statement request as routine.",
   goals:["Identifies self, firm, client, claim # and DOL","Confirms PIP exhausted and gets the ledger breakdown","Requests the dec page and UM/UIM limits in writing","Declines the recorded statement (routes to the attorney) politely","Call log with the direct line and follow-up date"]},
  {id:"ins_stall", title:"Breaking an Adjuster’s Stall", level:2, dir:"out", caller:"Tom Reeves", role:"BI adjuster, Aggressive Casualty", usesCase:true,
   brief:"You sent the supplemental demand with Dr. Neil Ron's permanency report (5% WPI) 21 days ago. No response. Claim 2026-0214-AX, insured Apex Delivery Services. The attorney wants a response date.",
   opening:"Tom Reeves.",
   facts:"You haven't reviewed it: 'It's with my manager', 'We're waiting on a peer review of the medicals', 'The 2018 back injury is a real problem for you'. If pushed firmly and professionally, commit to a written response within 10 business days.",
   behavior:"Stalls, deflects, tries to argue the pre-existing condition. Respects firmness; ignores pleading.",
   goals:["Identifies claim and the date the supplement was sent","Doesn't argue the merits (pre-existing) — notes it and stays on the ask","Gets a specific response date and the manager's name","Confirms in writing","Accurate call log with commitments"]},
  {id:"ins_um", title:"UM Consent to Settle", level:2, dir:"out", caller:"Greg Patel", role:"UM/UIM adjuster, Local Farm Mutual", usesCase:true,
   brief:"The attorney wants written consent to settle the BI claim with Aggressive Casualty and a waiver of subrogation from the UM carrier (Local Farm Mutual) before accepting any BI tender.",
   opening:"UM claims, Greg Patel speaking.",
   facts:"You haven't opened a UM file yet. You need: the BI offer amount, the tentative settlement documents, and 'your client's medicals'. Standard practice: 30 days to respond to a consent request. You'll ask for a recorded statement and a blanket medical authorization.",
   behavior:"Slow, bureaucratic.",
   goals:["Explains the consent-to-settle + waiver-of-subrogation request clearly","Gets the UM claim opened / number assigned","Agrees to send the request in writing with the BI offer documentation (not a blanket authorization)","Declines the recorded statement","Gets the response timeline and documents it"]},
  {id:"ins_inbound", title:"The Friendly Fishing Adjuster", level:3, dir:"in", caller:"Nina Ross", role:"Adjuster, Aggressive Casualty (calling the firm)", usesCase:true,
   brief:"You pick up your direct line. You're the CM on the Doe file.",
   opening:"Hi there, Nina Ross from Aggressive Casualty. I'm new on the Doe file — just need to confirm a few things. Is Mr. Doe back at work full-time now? And he was treating with a chiropractor before this accident too, right?",
   facts:"You're fishing for damaging facts (return to work, prior treatment, social media). You'll also ask for John's cell number 'to schedule an IME directly'.",
   behavior:"Friendly and chatty — a charm offensive.",
   goals:["Does not answer fishing questions about work status or prior treatment","Does not give the client's contact information; all contact goes through the firm","Gets Nina's full name, title, direct line and confirms she's the new adjuster (and who replaced whom)","Routes the IME request to the attorney","Documents the call"]}
 ]},
{id:"providers", icon:"🏥", label:"Providers & Records", who:"Case Manager dealing with medical providers and records departments",
 sub:"Get the records and bills you need, negotiate balances, keep providers treating — HIPAA-correct every time.",
 note:{title:"Call log + follow-up task", template:"DATE / TIME:\nPROVIDER / DEPARTMENT:\nSPOKE WITH (name / direct line / email / fax):\nPATIENT IDENTIFIERS USED (name / DOB / DOS):\nREQUEST:\nPROVIDER'S RESPONSE / COMMITMENT (date):\nFEES / FORMS REQUIRED:\nFOLLOW-UP TASK (owner / date):"},
 rubric:[
  {label:"Identifiers & HIPAA", desc:"Uses the correct patient identifiers (name, DOB, dates of service); has a signed HIPAA/authorization on file; doesn't over-share case details."},
  {label:"Precise Request", desc:"Asks for exactly what's needed (complete records vs. itemized billing with CPT codes, date range, format, delivery method)."},
  {label:"Negotiation & Escalation", desc:"Professional persistence; escalates to a supervisor with a reason and a deadline; negotiates reductions with justification."},
  {label:"Follow-Through", desc:"Gets a commitment date, confirms fees and forms, and documents a follow-up task."}],
 tips:["Have the DOB and dates of service ready.","Records ≠ bills: ask for both, itemized with CPT codes.","Ask for the name of the person and a date.","Escalate politely: 'Who can help me meet this deadline?'"],
 scenarios:[
  {id:"pr_records", title:"Records Request With a DOB Mismatch", level:1, dir:"out", caller:"Carla Nguyen", role:"Records department, Metro Radiology", usesCase:true,
   brief:"You need John Doe's MRI report and the itemized bill from Metro Radiology (DOS 03/15/2026). The MRI report on file shows DOB 02/14/1980 — wrong; John's DOB is 08/14/1980. The HIPAA authorization was signed last week.",
   opening:"Metro Radiology, medical records, this is Carla.",
   facts:"Your system has John Doe with DOB 02/14/1980 (a registration error). You can't release anything unless the DOB matches the authorization — which says 08/14/1980. You need a corrected-demographics form from the patient or a copy of his ID. Fee: $25 for records, itemized bill free. Turnaround 10 business days; 3 days for rush ($15).",
   behavior:"Helpful but strict on HIPAA.",
   goals:["Gives correct identifiers and spots the DOB mismatch","Asks for both the report and the itemized bill (CPT codes) for DOS 03/15/2026","Resolves the demographics correction (form/ID) instead of arguing","Gets fees, turnaround and the rush option; decides based on the mediation timeline","Documents a follow-up task with dates"]},
  {id:"pr_lop", title:"LOP Provider Threatens to Stop Care", level:2, dir:"in", caller:"Dr. Al Lign's office manager (Pam)", role:"Chiropractor treating under a Letter of Protection", usesCase:true,
   brief:"Dr. Al Lign (chiropractor) treats John under an LOP. His office manager calls your direct line.",
   opening:"Hi, this is Pam from Dr. Lign's office. John Doe has a balance of eight thousand four hundred with us and we're thinking of stopping his care until something's paid. When's the case settling?",
   facts:"The actual chiro billing statement in your file is $320 — the $8,400 figure came from the demand draft and may be a projection. Pam's number (555) 519-2211. She'll consider continuing care if the firm confirms the LOP in writing and gives a status update. Will ask 'what's the case worth?'.",
   behavior:"Businesslike, a little impatient.",
   goals:["Doesn't disclose settlement value/timing or case details beyond what the LOP allows","Asks for the itemized ledger to reconcile $8,400 vs the $320 statement","Confirms the LOP and the firm's commitment in writing","Protects continuity of care (flags any treatment interruption to the attorney)","Documents the call and the reconciliation task"]},
  {id:"pr_lien", title:"Hospital Lien Negotiation", level:3, dir:"out", caller:"Brenda Sterling", role:"Revenue Recovery Director, Metro General Hospital", usesCase:true,
   brief:"Negotiate Metro General's $45,000 hospital lien. Their own ER billing statement shows $12,700, and PIP paid $4,800 (ER) + $3,000 (CT). BCBS may also have paid. The attorney authorized you to propose a reduction and get the itemization first.",
   opening:"Brenda Sterling, Revenue Recovery.",
   facts:"The $45,000 includes 'anticipated future charges' and full chargemaster rates. You'll resist: 'The lien is statutory and it's first priority'. You'll agree to send an itemized statement and consider a reduction if shown the PIP payments and the double-billing issue. Direct line (555) 600-4410, email bsterling@metrogeneral.org.",
   behavior:"Firm, experienced, not easily moved — but responds to documentation.",
   goals:["Requests a full itemization (CPT codes, payments, adjustments) before discussing numbers","Raises the $45,000 vs $12,700 discrepancy and the PIP payments ($7,800) clearly","Doesn't accept 'statutory' as the end of the conversation — asks for the basis and the payment ledger","Gets a commitment and a date for the itemization/reduction response","Documents the positions and the next step"]}
 ]}
];

const MODES = {
  guided:{id:"guided", label:"Guided", desc:"Goals and coaching tips stay on screen. Untimed."},
  live:{id:"live", label:"Live", desc:"No help on screen. The timer runs. This is the real thing."}
};

/* ---------------- helpers ---------------- */
const lineOf = (id)=> CALL_LINES.find(l=>l.id===id);
const scnOf = (lid, sid)=> { const l = lineOf(lid); return l && l.scenarios.find(s=>s.id===sid); };
const hist = ()=> state.callHistory || (state.callHistory = []);
function lineAvg(lid){ const h = hist().filter(x=>x.lineId===lid && typeof x.score==="number"); return h.length ? Math.round(h.reduce((a,b)=>a+b.score,0)/h.length) : null; }
function bestFor(sid){ const h = hist().filter(x=>x.scenarioId===sid && typeof x.score==="number"); return h.length ? Math.max(...h.map(x=>x.score)) : null; }
const C = ()=> state.callSim || (state.callSim = {step:"home"});
const transcriptOf = (s)=> (s.chat||[]).filter(m=>!m.pending).map(m=>(m.role==="caller"?"CALLER: ":"TRAINEE: ")+m.text).join("\n");
function fmtSecs(sec){ sec = Math.max(0, Math.round(sec||0)); return `${Math.floor(sec/60)}:${String(sec%60).padStart(2,"0")}`; }

window.CALL_LINES = CALL_LINES;

/* ================================================================
   VIEW
   ================================================================ */
window.renderCallSimulator = function(){
  const c = C();
  if(c.step==="line") return viewLine(c);
  if(c.step==="brief") return viewBrief(c);
  if(c.step==="call") return viewCall(c);
  if(c.step==="note") return viewNote(c);
  return viewHome();
};

function viewHome(){
  const h = hist().slice().reverse().slice(0,8);
  return `<p class="eyebrow">Call Simulator</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📞 Call Simulator</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 16px">Practice the phone work of a Case Manager, separate from the day's lessons and Skill Builders, as often as you like. The phone rings and the caller speaks. Answer by voice (Chrome or Edge) or by typing. After you hang up, write the note the call requires. Each call is scored on a rubric built for that kind of call.</p>
    <div class="card cl-hero cl-incoming"><div><b>📟 Take a random incoming call</b><p>No briefing, no warning: the phone rings and you handle whoever is on the line, like a real front desk or a real caseload.</p></div>
      <button class="btn btn-orange" onclick="callRandom()">Answer the next call →</button></div>
    <h3 style="font-size:13px;color:var(--navy);margin:0 0 10px">Pick a line to practice</h3>
    <div class="cl-lines">${CALL_LINES.map(l=>{ const a = lineAvg(l.id), n = hist().filter(x=>x.lineId===l.id).length;
      return `<div class="card cl-line" role="button" tabindex="0" onclick="callOpenLine('${l.id}')" onkeydown="if(event.key==='Enter')callOpenLine('${l.id}')">
        <div class="ic">${l.icon}</div><b>${E(l.label)}</b><p>${E(l.sub)}</p>
        <div class="meta"><span>${l.scenarios.length} calls</span><span>${n?`${n} done · avg <span class="avg">${a}%</span>`:"Not started"}</span></div></div>`; }).join("")}</div>
    <div class="card" style="padding:16px 20px"><b style="color:var(--navy)">My recent calls</b>
      ${h.length ? `<table class="cl-hist"><thead><tr><th>Call</th><th>Line</th><th>Mode</th><th>Length</th><th>Score</th><th>Date</th></tr></thead><tbody>
        ${h.map(x=>`<tr><td>${E(x.title)}</td><td>${E(x.lineLabel)}</td><td>${E(x.mode)}</td><td>${fmtSecs(x.secs)}</td><td><b>${x.score==null?"—":x.score+"%"}</b></td><td>${typeof fmtDate==="function"?fmtDate(x.date):E(x.date)}</td></tr>`).join("")}</tbody></table>`
      : `<p style="font-size:13px;color:var(--ink-soft);margin:6px 0 0">No calls yet. Start with a Level 1 call on any line.</p>`}</div>`;
}

function viewLine(c){
  const l = lineOf(c.lineId);
  return `<button class="btn btn-ghost btn-sm" style="margin-bottom:14px" onclick="callHome()">← All lines</button>
    <h2 class="section-title">${l.icon} ${E(l.label)}</h2>
    <p style="font-size:13px;color:var(--ink-soft);max-width:78ch;margin:0 0 6px">${E(l.sub)}</p>
    <p style="font-size:12.5px;color:var(--ink-soft);max-width:78ch;margin:0 0 16px">After each call you write: <b>${E(l.note.title)}</b>. Scored on: ${l.rubric.map(r=>E(r.label)).join(" · ")}.</p>
    ${l.scenarios.map(s=>{ const b = bestFor(s.id);
      return `<div class="card cl-scn"><div style="flex:1;min-width:240px"><b>${E(s.title||s.caller)}</b>
        <p>${s.dir==="in"?"📲 Incoming":"📤 You call"} · <b>${E(s.caller)}</b>, ${E(s.role)}</p>
        <div class="cl-tags"><span class="cl-tag l${s.level}">Level ${s.level}</span>${s.usesCase?`<span class="cl-tag">John Doe file</span>`:""}${b!=null?`<span class="cl-tag done">Best ${b}%</span>`:""}</div></div>
        <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-ghost btn-sm" onclick="callBrief('${l.id}','${s.id}','guided')">Guided</button><button class="btn btn-navy btn-sm" onclick="callBrief('${l.id}','${s.id}','live')">Live call</button></div></div>`; }).join("")}`;
}

function viewBrief(c){
  const l = lineOf(c.lineId), s = scnOf(c.lineId, c.scenarioId), m = MODES[c.mode];
  return `<button class="btn btn-ghost btn-sm" style="margin-bottom:14px" onclick="callOpenLine('${l.id}')">← ${E(l.label)}</button>
    <div class="card cl-brief"><div class="cl-tags" style="margin:0 0 8px"><span class="cl-tag l${s.level}">Level ${s.level}</span><span class="cl-tag">${E(m.label)} mode</span><span class="cl-tag">${s.dir==="in"?"📲 Incoming call":"📤 Outgoing call"}</span></div>
      <h3>${E(s.title)}</h3>
      <p style="font-size:13px;margin:0 0 8px"><b>${s.dir==="in"?"Caller":"You are calling"}:</b> ${E(s.caller)}, ${E(s.role)}. <b>You are:</b> the ${E(l.who)} at ${FIRM}.</p>
      <p style="font-size:13px;margin:0;color:#37394A">${E(s.brief)}</p>
      ${c.mode==="guided" ? `<b style="display:block;margin-top:12px;font-size:12.5px;color:var(--navy)">A strong call will:</b><ul>${s.goals.map(g=>`<li>${E(g)}</li>`).join("")}</ul>` : `<p style="font-size:12.5px;color:var(--ink-soft);margin:10px 0 0">Live mode: no goals on screen. They're revealed in your debrief.</p>`}
      ${s.usesCase ? `<p style="font-size:12.3px;color:var(--ink-soft);margin:10px 0 0">This call is on the John Doe file. Check the <a href="#" onclick="goto('clientprofile');return false">Case File</a> first if you need to.</p>` : ""}
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:14px"><button class="btn btn-orange" onclick="callStart()">${s.dir==="in"?"📲 Answer the call":"📞 Place the call"}</button></div></div>`;
}

function viewCall(c){
  const l = lineOf(c.lineId), s = scnOf(c.lineId, c.scenarioId);
  const guided = c.mode==="guided";
  return `<div class="rp-session-header"><div><div class="rp-session-tag">${l.icon} ${E(l.label)} · ${E(MODES[c.mode].label)}${c.random?" · 📟 Random call":""}</div>
      <h2 style="margin:2px 0 0;color:var(--navy)">${c.random && s.dir==="in" ? "Incoming call" : E(s.title)}</h2></div></div>
    <div class="cl-grid ${guided?"":"solo"}">
      <div class="card" style="padding:16px 18px">
        ${VoiceCall.panel("call")}
        <div class="vc-transcript-label">Live transcript</div>
        <div class="cr-chat-window" id="callChat">${renderChat(c)}</div>
        <div class="cr-chat-input-row">
          <textarea id="callInput" placeholder="Speak your reply, or type it here…" onkeydown="if(event.key==='Enter'&&!event.shiftKey){event.preventDefault();callSend();}"></textarea>
          <button class="btn btn-orange btn-sm" onclick="callSend()">Send</button>
        </div>
        <div style="margin-top:10px;display:flex;gap:10px;flex-wrap:wrap">
          <button class="btn btn-navy btn-sm" onclick="callHangup()">📞 Hang up &amp; write the note</button>
          <button class="btn btn-ghost btn-sm" onclick="callAbandon()">Cancel call</button></div>
      </div>
      ${guided ? `<div class="card cl-side"><b>🎯 A strong call will</b><ul>${s.goals.map(g=>`<li>${E(g)}</li>`).join("")}</ul>
        <b>🧭 Tips for this line</b><ul>${l.tips.map(t=>`<li>${E(t)}</li>`).join("")}</ul>
        <b>📝 After the call</b><p style="margin:4px 0 0">You'll write the ${E(l.note.title.toLowerCase())}. Jot numbers and names as you go.</p></div>` : ""}
    </div>`;
}
function renderChat(c){
  return (c.chat||[]).map(m=>`<div class="cr-msg ${m.role==='caller'?'cr-client':'cr-ea'}">${E(m.text)}</div>`).join("");
}
function paintChat(){ const w = document.getElementById("callChat"); if(w){ w.innerHTML = renderChat(C()); w.scrollTop = w.scrollHeight; } }

function viewNote(c){
  const l = lineOf(c.lineId), s = scnOf(c.lineId, c.scenarioId);
  return `<div class="rp-session-header"><div><div class="rp-session-tag">${l.icon} ${E(l.label)} · call ended · ${fmtSecs(c.secs)}</div>
      <h2 style="margin:2px 0 0;color:var(--navy)">${E(s.title)} · ${E(s.caller)}</h2></div></div>
    <div class="card" style="padding:16px 18px;margin-bottom:14px"><b style="color:var(--navy);font-size:13px">Call transcript</b>
      <div class="cl-transcript" style="margin-top:8px">${(c.chat||[]).filter(m=>!m.pending).map(m=>`<div class="${m.role==='caller'?'c':'t'}"><b>${m.role==='caller'?E(s.caller):"You"}:</b> ${E(m.text)}</div>`).join("")}</div></div>
    <div class="card cl-note" style="padding:16px 18px"><b style="color:var(--navy);font-size:14px">📝 ${E(l.note.title)}</b>
      <p style="font-size:12.5px;color:var(--ink-soft);margin:4px 0 10px">Write it the way it would go into the file. It's graded against what was actually said on the call, so don't add anything the caller didn't tell you.</p>
      <textarea id="callNote" oninput="state.callSim.note=this.value">${E(c.note!=null?c.note:l.note.template)}</textarea>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">
        <button class="btn btn-navy btn-sm" id="callScoreBtn" onclick="callScore()">Submit for scoring</button>
        <button class="btn btn-ghost btn-sm" onclick="callRetry()">Redo the call</button>
        <button class="btn btn-ghost btn-sm" onclick="callOpenLine('${l.id}')">Back to ${E(l.label)}</button></div>
      <div id="callReport" style="margin-top:14px">${c.reportHtml||""}</div></div>`;
}

/* ================================================================
   ACTIONS
   ================================================================ */
window.callHome = function(){ endVoice(); state.callSim = {step:"home"}; goto("calls"); };
window.callOpenLine = function(lid){ endVoice(); state.callSim = {step:"line", lineId:lid}; goto("calls"); };
window.callBrief = function(lid, sid, mode){ state.callSim = {step:"brief", lineId:lid, scenarioId:sid, mode}; goto("calls"); };
window.callRandom = function(){
  const pool = []; CALL_LINES.forEach(l=>l.scenarios.forEach(s=>{ if(s.dir==="in") pool.push([l.id,s.id]); }));
  const last = (state.callSim||{}).scenarioId;
  let pick = pool[Math.floor(Math.random()*pool.length)];
  if(pool.length>1 && pick[1]===last) pick = pool[(pool.indexOf(pick)+1)%pool.length];
  state.callSim = {step:"brief", lineId:pick[0], scenarioId:pick[1], mode:"live", random:true};
  callStart();
};
window.callStart = function(){
  const c = C(), l = lineOf(c.lineId), s = scnOf(c.lineId, c.scenarioId);
  VoiceCall.unlockAudio();                 // inside the click, so the browser allows speech
  Object.assign(c, {step:"call", chat:[{role:"caller", text:s.opening}], startedAt:Date.now(), note:null, reportHtml:""});
  goto("calls");
  const shown = c.random && s.dir==="in" ? "Incoming call" : s.caller;
  VoiceCall.start("call", {name:shown, subtitle: c.random && s.dir==="in" ? l.label : `${s.role}`, inputId:"callInput",
    send:()=>callSend(), onHangup:()=>callToNote()});
  render();
  VoiceCall.say("call", s.opening);
};
function endVoice(){ if(VoiceCall.active && VoiceCall.active.key==="call") VoiceCall.hangup(true); }
window.callAbandon = function(){ const c = C(); endVoice(); state.callSim = {step:"line", lineId:c.lineId}; render(); };

window.callSend = async function(){
  const input = document.getElementById("callInput"); if(!input) return;
  const text = input.value.trim(); if(!text) return;
  const c = C(); if(c.busy) return;
  const l = lineOf(c.lineId), s = scnOf(c.lineId, c.scenarioId);
  c.chat.push({role:"trainee", text}); input.value = "";
  c.chat.push({role:"caller", text:"…", pending:true}); paintChat();
  VoiceCall.thinking("call"); c.busy = true;
  const prompt = `You are playing ${s.caller} (${s.role}) on a live phone call in a training simulation for ${FIRM}, a personal-injury law firm. The trainee is the firm's ${l.who}. Stay fully in character: speak only as ${s.caller}. No narration, no stage directions, no meta-commentary.
${s.usesCase ? `\nCASE FILE (background you may know as far as your role would):\n${CLIENT_DOSSIER_MD}\n` : ""}
SITUATION: ${s.brief}
WHAT YOU KNOW (share details only when the trainee asks, or when it's natural for your character; never recite everything at once; never contradict these facts; if asked something not covered, improvise a realistic, consistent answer):
${s.facts}
HOW YOU BEHAVE: ${s.behavior}

CALL SO FAR:
${transcriptOf(c)}

Reply with your next spoken line only, 1-3 sentences, natural phone speech. React to what the trainee actually said: cooperate more when they handle you well; push back, repeat your question or get more emotional when they are vague, wrong, or overstep. If the trainee wraps up the call properly, say a natural goodbye.`;
  try{
    const reply = await callAIText(prompt, 220);
    c.chat = c.chat.filter(m=>!m.pending);
    c.chat.push({role:"caller", text: String(reply||"").trim().replace(/^["“]+|["”]+$/g,"").replace(/^[A-Z][\w .'-]{0,40}:\s*/,"")});
  }catch(e){
    c.chat = c.chat.filter(m=>!m.pending);
    c.chat.push({role:"caller", text:"[Connection issue — send your line again.]"});
  }
  c.busy = false; paintChat();
  const last = c.chat[c.chat.length-1];
  if(last && last.role==="caller" && !/^\[/.test(last.text)) VoiceCall.say("call", last.text);
};

window.callHangup = function(){
  const c = C();
  if(!(c.chat||[]).some(m=>m.role==="trainee")){ toast("Say or type at least one line before you hang up."); return; }
  endVoice(); callToNote();
};
function callToNote(){
  const c = C();
  if(c.step!=="call") return;
  if(!(c.chat||[]).some(m=>m.role==="trainee")){ state.callSim = {step:"line", lineId:c.lineId}; render(); toast("Call ended before you said anything."); return; }
  c.secs = Math.round((Date.now()-(c.startedAt||Date.now()))/1000);
  c.step = "note"; render();
}
window.callRetry = function(){ const c = C(); state.callSim = {step:"brief", lineId:c.lineId, scenarioId:c.scenarioId, mode:c.mode||"live"}; callStart(); };

window.callScore = async function(){
  const c = C(), l = lineOf(c.lineId), s = scnOf(c.lineId, c.scenarioId);
  const note = (document.getElementById("callNote")||{}).value || "";
  c.note = note;
  if(note.replace(l.note.template,"").trim().length < 40){ toast(`Fill in the ${l.note.title.toLowerCase()} first.`); return; }
  const out = document.getElementById("callReport"), btn = document.getElementById("callScoreBtn");
  if(btn) btn.disabled = true;
  out.innerHTML = `<div class="ai-loading">Reviewing your call and your ${E(l.note.title.toLowerCase())}…</div>`;
  const prompt = `You are a strict, fair trainer at ${FIRM} grading a trainee on a practice phone call. The trainee was the firm's ${l.who}.

SCENARIO: ${s.title} — ${s.dir==="in"?"incoming call from":"outgoing call to"} ${s.caller} (${s.role}).
BRIEFING THE TRAINEE HAD: ${s.brief}
FACTS THE CALLER KNEW (the trainee only knows what the caller actually said on the call): ${s.facts}
WHAT A STRONG CALL ACHIEVES:
${s.goals.map((g,i)=>`${i+1}. ${g}`).join("\n")}
${s.usesCase ? `\nCASE FILE:\n${CLIENT_DOSSIER_MD}\n` : ""}
TRANSCRIPT:
${transcriptOf(c)}

THE TRAINEE'S ${l.note.title.toUpperCase()}:
${note}

Score four categories, 0-25 each, judged on BOTH the call and the documentation:
${l.rubric.map((r,i)=>`${i+1}. ${r.label}: ${r.desc}`).join("\n")}

Rules: a short or generic call scores well below 70 in total. Reserve 85+ for calls that hit nearly every goal with no boundary errors. Any legal advice, case valuation, guarantee, or confidentiality breach caps "${l.rubric[2].label}" at 8. Documentation that invents or misstates facts loses points in the category it affects. Quote or paraphrase the trainee's actual words in your feedback.

Return ONLY JSON, no other text:
{"scores":[<int>,<int>,<int>,<int>],"notes":["<one sentence per category>","","",""],"goalsMet":[<true/false for each goal, in order>],"strengths":["..."],"fixes":["<what to do differently, specific>"],"modelLine":"<one example line the trainee could have said at the weakest moment>"}`;
  try{
    const raw = await callAIJson(prompt, 1100);
    const scores = [0,1,2,3].map(i=>Math.max(0, Math.min(25, Math.round(((raw.scores||[])[i])||0))));
    const total = scores.reduce((a,b)=>a+b,0);
    const rep = {total, scores, notes: raw.notes||[], goalsMet: raw.goalsMet||[], strengths: raw.strengths||[], fixes: raw.fixes||[], modelLine: raw.modelLine||""};
    c.reportHtml = renderReport(l, s, rep);
    out.innerHTML = c.reportHtml;
    hist().push({lineId:l.id, lineLabel:l.label, scenarioId:s.id, title:s.title, mode:MODES[c.mode||"live"].label + (c.random?" · random":""), score:total, secs:c.secs||0, date:new Date().toISOString(), sub:scores});
    await storeSet("callHistory", state.callHistory);
    try{ if(typeof syncToLedger==="function") await syncToLedger(); }catch(e){}
    if(total>=90 && typeof burstConfetti==="function") burstConfetti();
  }catch(e){
    out.innerHTML = typeof renderAiErrorBlock==="function" ? renderAiErrorBlock(e, "Couldn't score this call") : `<p style="color:var(--danger)">Couldn't score this call: ${E(e && e.message)}</p>`;
  }
  if(btn) btn.disabled = false;
};

function renderReport(l, s, r){
  const tier = typeof gradeTierFor==="function" ? gradeTierFor(r.total) : "";
  const color = (typeof GRADE_TIER_COLOR!=="undefined" && GRADE_TIER_COLOR[tier]) || "var(--navy)";
  const li = (a)=> a.map(x=>`<li>${E(x)}</li>`).join("");
  return `<div class="eval-report">
    <div class="eval-report-header"><div class="eval-score-ring" style="--ring-color:${color}"><span>${r.total}</span></div>
      <div><div class="eval-tier" style="color:${color}">${E(typeof displayTier==="function"?displayTier(tier):tier)}</div>
      <div style="font-size:12px;color:var(--ink-soft)">${E(l.label)} · ${E(s.title)}</div></div></div>
    <div class="cl-sub">${l.rubric.map((x,i)=>`<div><span>${E(x.label)}</span><b>${r.scores[i]}/25</b>${r.notes[i]?`<span>${E(r.notes[i])}</span>`:""}</div>`).join("")}</div>
    <div class="eval-section"><b>Call goals</b><ul style="list-style:none;padding-left:0">${s.goals.map((g,i)=>`<li>${r.goalsMet[i]===true?"✅":"⬜"} ${E(g)}</li>`).join("")}</ul></div>
    ${r.strengths.length?`<div class="eval-section"><b>Strengths</b><ul>${li(r.strengths)}</ul></div>`:""}
    ${r.fixes.length?`<div class="eval-section"><b>Do this differently</b><ul>${li(r.fixes)}</ul></div>`:""}
    ${r.modelLine?`<div class="eval-section"><b>Try saying</b><p style="font-size:12.8px;margin:4px 0 0;font-style:italic">“${E(r.modelLine)}”</p></div>`:""}
    <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px"><button class="btn btn-navy btn-sm" onclick="callRetry()">Redo this call</button><button class="btn btn-orange btn-sm" onclick="callRandom()">📟 Next random call</button></div>
  </div>`;
}

/* ---------- Admin: add call results next to Live Roleplay on each trainee ---------- */
const _origAdminRp = window.renderAdminRoleplayPanel;
if(typeof _origAdminRp==="function"){
  window.renderAdminRoleplayPanel = function(rec){
    const h = (rec && rec.callHistory) || [];
    const rows = CALL_LINES.map(l=>{ const x = h.filter(y=>y.lineId===l.id && typeof y.score==="number"); return {l, n:x.length, avg:x.length?Math.round(x.reduce((a,b)=>a+b.score,0)/x.length):null}; });
    return _origAdminRp(rec) + `<div style="margin-top:16px"><div class="sidebar-section-lbl" style="padding-left:0">📞 Call Simulator</div>
      ${h.length ? `<div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:8px">${rows.map(r=>`<div style="padding:8px 10px;border-radius:8px;background:#fff;border:1px solid var(--line)"><div style="font-size:11px;color:var(--ink-soft)">${r.l.icon} ${E(r.l.label)}</div><div style="font-size:15px;font-weight:700;color:${r.avg===null?'var(--ink-soft)':r.avg<85?'var(--danger)':'var(--navy)'}">${r.avg===null?"—":r.avg+"%"}</div><div style="font-size:10.5px;color:var(--ink-soft)">${r.n} call${r.n===1?"":"s"}</div></div>`).join("")}</div>`
        : `<p style="font-size:12.5px;color:var(--ink-soft);margin:0">No practice calls yet.</p>`}</div>`;
  };
}

/* ---------- startup ---------- */
window.addEventListener("load", ()=>{ setTimeout(async ()=>{ try{ const h = await storeGet("callHistory"); if(Array.isArray(h)) state.callHistory = h; }catch(e){} }, 300); });
})();
