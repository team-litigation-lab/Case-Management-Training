/* The Case Flow slides' concise copy (one idea per slide, the key phrase **highlighted**), assembled from
   build/case-flow/slides/dN.json by build/case-flow/slides/assemble.cjs. Written to build/case-flow/slides/SLIDESPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SLIDES = {
 "d1m1-role": {
  "image": "team-huddle",
  "hook": "You own **the file's movement**; Atty. Thorne owns every legal judgment.",
  "points": [
   "Coordinate the case **from intake to resolution**, end to end",
   "Log every contact, deadline and decision **in the CMS**",
   "Each phase has **its own goals and deliverables**",
   "Flag risk to Atty. Thorne **the day you see it**"
  ],
  "upl": "Explain the process and confirm facts; never value, merits or settlement advice",
  "job": [
   [
    "New matter assigned",
    "Read the raw file first",
    "CMS → Case File",
    "Parties, dates, carriers noted"
   ],
   [
    "Client asks a legal question",
    "Log it; route it same day",
    "CMS → Communications Log",
    "Routed; no opinion given"
   ],
   [
    "Deadline or risk appears",
    "Docket, flag, recommend next step",
    "CMS → Calendar · Risk Flags",
    "Nothing lives only in email"
   ]
  ],
  "dos": [
   "Keep **a dated next step** on every file",
   "Answer process questions; **route the legal ones**"
  ],
  "donts": [
   "Guessing **what the case is worth**",
   "Keeping the status **in your inbox**, not the CMS"
  ],
  "theory": {
   "lead": "Case management is the **end-to-end coordination** of a case from intake to resolution: tracking, handling and moving it, phase by phase.",
   "concepts": [
    {
     "term": "What It Ensures",
     "text": "Timely progression, proper documentation and compliance, clear communication: **the three tests** every task on the file must pass"
    },
    {
     "term": "The General Process",
     "text": "Seven stages, from Intake & Case Opening to Resolution & Closing: **you carry the file** through all seven"
    },
    {
     "term": "Case Planning & Strategy Support",
     "text": "You build the plan and recommend next steps; **strategy itself stays** with Atty. Thorne"
    },
    {
     "term": "Case Health Analysis",
     "text": "Reading the whole file for risk, not single tasks: **spotting the weak point** before it costs the client"
    }
   ],
   "pages": [
    "D1#3",
    "D1#4"
   ],
   "framework": {
    "title": "The General Process",
    "kind": "flow",
    "steps": [
     {
      "label": "Intake & Case Opening",
      "text": "Verify the facts, run the Conflict Check and open the file in the CMS"
     },
     {
      "label": "Case Planning & Strategy Support",
      "text": "Draft the Case Plan and recommend next steps; **Atty. Thorne sets strategy**"
     },
     {
      "label": "Documentation & File Management",
      "text": "Request, name and file every document; the CMS is the single source of truth"
     },
     {
      "label": "Communication Management",
      "text": "Keep the client, carriers and providers updated; log every contact the same day"
     },
     {
      "label": "Case Monitoring & Tracking",
      "text": "Docket every deadline, watch progress and flag risk to counsel the day you see it"
     },
     {
      "label": "Billing, Resolution & Closing",
      "text": "Support the billing and lien records through resolution, then close a complete file"
     }
    ],
    "note": "Seven stages on one track; billing support and closing run together at the end of the file."
   }
  }
 },
 "d1m1-case": {
  "image": "property-damage",
  "hook": "One file for five days: know **its facts cold** before you touch the CMS.",
  "points": [
   "02/06/2026: Robert Smith **ran the stop**; John Doe was the passenger",
   "The stack, in order: **BI → Host UM → Relative UM**, $40,000",
   "Passenger status opens **both UM layers**",
   "First treatment 02/20/2026: **the 14-Day Treatment Gap**"
  ],
  "upl": "Share facts and the process; never value, or how the gap will play",
  "job": [
   [
    "Course begins",
    "Read the Case File and intake",
    "Case File · Documents",
    "DOL, stack, gap from memory"
   ],
   [
    "Matter opens in the CMS",
    "Trace each fact to its document",
    "CMS → Case File",
    "No fact from memory alone"
   ],
   [
    "A fact changes",
    "Update the CMS the same day",
    "CMS → Case Notes",
    "The CMS matches the file"
   ]
  ],
  "dos": [
   "Trace every fact **to its document**",
   "Say the stack **in order**, every time"
  ],
  "donts": [
   "Repeating facts **from memory** alone",
   "Treating the gap as **the client's fault**"
  ],
  "theory": {
   "lead": "Every file is worked from **its verified facts**: who was hurt, how, which policies apply, and what could weaken the claim.",
   "concepts": [
    {
     "term": "The Case Snapshot",
     "text": "Parties, date of loss, SOL, client position and coverage on one card: **the facts every task reads**"
    },
    {
     "term": "Facts of Loss",
     "text": "How, where and when the collision happened, confirmed by the Police Report and witnesses; **ambiguity here needs counsel**"
    },
    {
     "term": "Critical Case Event",
     "text": "The one fact the defense will build on; name it early so **counsel plans around it**"
    },
    {
     "term": "The Source Documents",
     "text": "Intake sheet, supplement and Police Report are the file's sources: **quote the document**, never your memory"
    }
   ],
   "pages": [
    "D1#16"
   ],
   "framework": {
    "title": "The Structured Intake Questions",
    "kind": "table",
    "head": [
     "Question",
     "On this file"
    ],
    "rows": [
     [
      "Who",
      "John Doe, passenger; Robert Smith, defendant; Kevin Alvarez, host driver"
     ],
     [
      "What",
      "A collision into the Escape's passenger door; EMS noted neck stiffness"
     ],
     [
      "When",
      "02/06/2026, about 7:10 a.m.; SOL docketed 02/06/2028"
     ],
     [
      "Where",
      "The all-way stop at Maple Hollow Rd & Birch Ave"
     ],
     [
      "How",
      "Robert Smith **ran the stop**; Riverton PD cited him (RPD-26-018842)"
     ]
    ],
    "note": "Every answer comes from a document; ambiguous facts of loss or liability go to Atty. Thorne for review."
   }
  }
 },
 "d1m1-l1": {
  "image": "intake-interview",
  "hook": "A file opened wrong stays wrong: **a mis-mapped party** is a lost coverage layer.",
  "points": [
   "Run the **Conflict Check first**, on every party's full legal name",
   "Confirm the date of loss against the Police Report; **docket SOL 02/06/2028**",
   "Map **all six roles**: “unknown” is a coverage layer not yet found",
   "Record the client's position: it decides **which policies can be reached**"
  ],
  "upl": "Confirm facts, explain the process; worth and merits are Atty. Thorne's call",
  "job": [
   [
    "Raw file received",
    "Conflict Check, then verify DOL",
    "CMS → New Case",
    "DOL matches the Police Report"
   ],
   [
    "Matter created",
    "Docket SOL; log retainer and HIPAA",
    "CMS → Calendar · Documents",
    "SOL 02/06/2028 on the calendar"
   ],
   [
    "Parties identified",
    "Map six roles; record position",
    "CMS → Parties",
    "None “unknown”; position = passenger"
   ]
  ],
  "dos": [
   "Record **the source** of every coverage fact",
   "Docket the statute of limitations **on day one**",
   "Keep the CMS as **the single source of truth**"
  ],
  "donts": [
   "Creating the file **before the Conflict Check**",
   "Running the Conflict Check on **a nickname or partial name**",
   "Accepting a case because intake **“mostly” looks fine**"
  ],
  "theory": {
   "lead": "Intake is where you establish **control, structure and clarity**: verifying facts and mapping every party to the policy it unlocks.",
   "concepts": [
    {
     "term": "The Recovery Stack",
     "text": "Every policy that can pay the claim, layered in the order it pays; **find every layer** at intake"
    },
    {
     "term": "Bodily Injury Liability",
     "text": "The at-fault driver's coverage for injuries he causes others: **the first layer** to pay, and a third-party claim"
    },
    {
     "term": "UM/UIM Coverage",
     "text": "First-party cover for when the at-fault driver's BI is **missing or too small**; reached through the vehicle or household"
    },
    {
     "term": "Exclusions and Rejections",
     "text": "A signed UM rejection or an owned-vehicle exclusion **closes a layer**; record the document that does it"
    },
    {
     "term": "MedPay and PIP",
     "text": "First-party medical coverage paid regardless of fault: **it pays bills first**, while the claim is still open"
    },
    {
     "term": "Property Damage and Collision",
     "text": "PD liability repairs what the at-fault driver damaged; collision is the owner's own cover. **Neither joins the injury stack**"
    },
    {
     "term": "Per-Person vs. Per-Accident Limits",
     "text": "A split limit caps each injured person at the first figure and **the whole accident** at the second; read both"
    },
    {
     "term": "The Declaration Page",
     "text": "The carrier's statement of the named insured, covered vehicles, coverages and limits: **written proof of coverage**"
    }
   ],
   "pages": [
    "D1#21",
    "D1#22"
   ],
   "framework": {
    "title": "The Intake Workflow",
    "kind": "flow",
    "steps": [
     {
      "label": "Raw File Received",
      "text": "The file arrives from “On the Records”; read it end to end first"
     },
     {
      "label": "Review & Verify Details",
      "text": "Check the DOL, parties and signatures against the Police Report, not the intake note"
     },
     {
      "label": "Conflict Check Completed",
      "text": "Run it on every party's **full legal name**; log its date and result"
     },
     {
      "label": "Approved or Escalated",
      "text": "Complete intake moves to acceptance; incomplete intake goes back, uncertain eligibility to Atty. Thorne"
     },
     {
      "label": "File Created and Logged",
      "text": "Open the matter in the CMS: six roles mapped, SOL docketed, documents named"
     }
    ],
    "note": "Nothing moves before the Conflict Check is documented; coverage is then read off the Declaration Page."
   }
  }
 },
 "d1m1-open": {
  "image": "data-entry",
  "situation": "02/09/2026. The raw file is in and a colleague keyed **a draft intake record** into the CMS. Atty. Thorne wants the matter **active today**.",
  "steps": [
   "Run and log **the Conflict Check** on full legal names",
   "Verify every draft field **against its source document**",
   "Correct each error **with its source**, never silently",
   "Docket **SOL 02/06/2028**, map six roles, file intake documents",
   "Route **a correction note** to Atty. Thorne in Case Notes"
  ],
  "deliver": "An active matter, **every field verified**, corrections noted to Atty. Thorne",
  "checks": [
   "Conflict Check logged **before the matter existed**",
   "Position corrected to **front-seat passenger**",
   "Date of birth and **report number** corrected, with sources",
   "SOL docketed; **six roles** mapped; documents filed",
   "Correction note **routed to Atty. Thorne**"
  ],
  "dos": [
   "Verify against **signed documents**, not the draft"
  ],
  "donts": [
   "Accepting **a pre-filled field** unchecked"
  ]
 },
 "d1m1-a1": {
  "image": "insurance-stack",
  "situation": "All three carriers reported limits **on the set-up calls**. **No Declaration Page** has arrived yet; Keystone wants authorizations first. Nothing is in the CMS Insurance tab.",
  "steps": [
   "Enter all three layers in **order of operations**",
   "Record carrier, policy and claim numbers, limit and **adjuster for each**",
   "Classify each layer as **first-party or third-party**",
   "In Comments: carrier's name, differing driver, adjuster or **“none assigned yet”**",
   "Verify the total, record the pursuit order, **mark the projection preliminary**"
  ],
  "deliver": "A three-layer Coverage Matrix **totalling $40,000**, each layer classified, ordered and attributed",
  "checks": [
   "Limits **$10,000 / $20,000 / $10,000**; total $40,000",
   "Order recorded: **BI → Host UM → Relative UM**",
   "BI third-party; **both UM layers first-party**",
   "Relative UM adjuster: **“No adjuster assigned yet”**, not blank",
   "Each limit's source recorded; projection **marked preliminary**"
  ],
  "dos": [
   "Record **where each limit came from**"
  ],
  "donts": [
   "Quoting a likely limit **before written confirmation**"
  ]
 },
 "d1m1-l2": {
  "image": "money-ledger",
  "hook": "A reimbursement claim found after the demand comes out of **the client's net**.",
  "points": [
   "Clear the Triple-Check first: **HIPAA, BCRC, Payer Order**",
   "Payer order: PIP/MedPay, private health insurance, **then LOP/provider liens**",
   "The Payer Order pays the bills; **the $40,000 stack** pays the claim",
   "Flag the plan's reimbursement right **before the first demand**"
  ],
  "upl": "Report what a plan asserts; never judge enforceability or compromise without counsel",
  "job": [
   [
    "Retainer signed",
    "Get claim-specific HIPAA authorization",
    "CMS → Documents",
    "Authorization names 02/06/2026"
   ],
   [
    "Age and benefits known",
    "Verify SSDI status; report if required",
    "CMS → Case Notes",
    "BCRC answer logged, dated"
   ],
   [
    "Plan pays accident-related bill",
    "Record and flag the lien",
    "CMS → Liens → Flag",
    "Flag set before any demand"
   ]
  ],
  "dos": [
   "Clear the triple-check **before clinical planning**",
   "Log the **BCRC report date** or verified “not required”"
  ],
  "donts": [
   "Using a generic release **without the incident date**",
   "Reassuring the client **“insurance will cover it”**"
  ],
  "theory": {
   "lead": "Before clinical planning, the **Regulatory Triple-Check** establishes the claim and your authority to act; the Payer Order then decides who funds care.",
   "concepts": [
    {
     "term": "Subrogation",
     "text": "A payer's right to stand in the client's shoes and **recover what it paid** for accident care"
    },
    {
     "term": "Primary Payer Determination",
     "text": "Deciding which payer is billed first, so each bill **goes to the right payer** and nothing is paid twice"
    },
    {
     "term": "Letter of Protection",
     "text": "The firm's written promise to pay a provider from the settlement: **last in the Payer Order**"
    },
    {
     "term": "The Client's Net",
     "text": "What the client keeps once fees, costs and liens are paid: **a late-flagged lien** comes straight out of it"
    }
   ],
   "pages": [
    "D1#25",
    "D1#22"
   ],
   "framework": {
    "title": "The Regulatory Triple-Check",
    "kind": "table",
    "head": [
     "Check",
     "What you do",
     "Why it matters"
    ],
    "rows": [
     [
      "HIPAA Compliance",
      "Obtain a claim-specific authorization naming the incident date",
      "A standard release may not be adequate for injury claims"
     ],
     [
      "Medicare/Medicaid Reporting",
      "If 65+ or on SSDI, report the case to the BCRC",
      "Avoids federal penalties and **settlement freezes** under MMSEA"
     ],
     [
      "Subrogation Management",
      "Set the Payer Order: PIP/MedPay → private health insurance → LOP/provider liens",
      "Each bill reaches the right payer; reimbursement rights surface early"
     ]
    ],
    "note": "Clear all three before clinical planning begins: the claim is established and you are authorized to act."
   }
  }
 },
 "d1m1-a2": {
  "image": "lien-scale",
  "situation": "Peach State Health Plan has begun paying John Doe's accident-related treatment. **No lien record exists** yet, and **the pre-demand audit** is still ahead.",
  "steps": [
   "Register Peach State's claim and **flag it against the matter**",
   "Enter carrier, **member ID and group number**",
   "Record its **payer-order position** and the reimbursement basis",
   "Date the flag and attach **the Triple-Check results**",
   "State what must happen **before any compromise**"
  ],
  "deliver": "A **dated, flagged lien record** you could negotiate from on Day 3",
  "checks": [
   "Carrier: **Peach State Health Plan**",
   "**PSH-55017742 and GRP-41208** both entered",
   "Position: **after PIP/MedPay, before LOP/provider liens**",
   "Flag dated **before any demand** is drafted",
   "Compromise needs **Atty. Thorne's authority**"
  ],
  "dos": [
   "Registering a lien **is not conceding it**"
  ],
  "donts": [
   "Finding the lien **at disbursement**"
  ]
 },
 "d1m1-kc": {
  "image": "knowledge-check",
  "questions": [
   "List the **three coverage layers** in pursuit order, with each limit and the total.",
   "How does John Doe being a **front-seat passenger** change the recovery? What if he'd driven his own car?",
   "Why can't Host UM be demanded **before BI is exhausted** or tendered? What does the wrong order cost?",
   "Set out John Doe's **Payer Order**, and explain why it differs from the Recovery Stack.",
   "Name the three parts of the **Regulatory Triple-Check**, what each requires, and what you verify for the BCRC.",
   "An **unregistered health lien** surfaces the morning the demand is due. Your steps, in order, and whose authority?"
  ]
 },
 "d1m2-l1": {
  "image": "phone-call",
  "hook": "A client you can't reach **still has deadlines**; the protocol proves the firm did its part.",
  "points": [
   "Step 1: review status, deadlines and last contact **before you call**",
   "Step 2: **2+ phone attempts**, email and text, emergency contact, certified mail",
   "Escalate **by channel, not by volume**; log every attempt as made",
   "Step 3: notify the attorney and **assess SOL and hearing dates**"
  ],
  "upl": "Say what the firm needs, by when; never advise on rights or threaten withdrawal",
  "job": [
   [
    "Client misses a contact",
    "Step 1: review status, deadlines",
    "CMS → Case Summary",
    "Live deadlines identified first"
   ],
   [
    "Review complete",
    "Step 2: work the channel ladder",
    "CMS → Communications Log",
    "Date, time, channel, outcome logged"
   ],
   [
    "Ladder exhausted",
    "Step 3: notify Atty. Thorne",
    "CMS → Tasks → Escalate",
    "SOL 02/06/2028 impact assessed"
   ]
  ],
  "dos": [
   "Set a **follow-up reminder** as each request goes out",
   "Offer **an easy way to respond**: call, text, upload link"
  ],
  "donts": [
   "Letting a file sit **without logging attempts**",
   "Blaming the client for **process gaps**"
  ],
  "theory": {
   "lead": "The No Contact Protocol is a **formal due-diligence record**: it tracks silence, proves the firm tried, and protects it from liability.",
   "concepts": [
    {
     "term": "Intake Bottlenecks",
     "text": "Points where work slows, stalls or turns inconsistent; **a silent client** is one, delaying case progression"
    },
    {
     "term": "Due Diligence",
     "text": "Proof the firm made reasonable, documented efforts to reach the client: **the record that justifies** whatever comes next"
    },
    {
     "term": "Approved Channels",
     "text": "The contact methods the client and firm agreed at intake; **only approved channels** count as a valid attempt"
    },
    {
     "term": "Emergency Contact",
     "text": "A second person, collected at intake, who can **still reach the client** after they go quiet"
    }
   ],
   "pages": [
    "D1#11",
    "D1#9"
   ],
   "framework": {
    "title": "Common Intake Bottlenecks",
    "kind": "table",
    "head": [
     "Bottleneck",
     "How it shows up"
    ],
    "rows": [
     [
      "Incomplete Client Information",
      "Missing contact details or incident facts; no supporting documents"
     ],
     [
      "Delayed Client Follow-Up",
      "**Unanswered clarification requests**, missed verification calls, slow documents"
     ],
     [
      "Conflict Check Delays",
      "System backlog, incomplete entries, unclear opposing party information"
     ],
     [
      "Intake Form Errors",
      "Incorrect dates, inconsistent statements, missing signatures, misfiled records"
     ],
     [
      "Case Eligibility Uncertainty",
      "Ambiguous facts of loss or liability needing attorney review"
     ],
     [
      "Communication Gaps",
      "Incomplete intake packets; miscommunication between departments"
     ]
    ],
    "note": "A silent client is Delayed Client Follow-Up: the No Contact Protocol clears it, one logged attempt at a time."
   }
  }
 },
 "d1m2-a1": {
  "image": "data-entry",
  "situation": "John Doe has been silent **six days**: a missed check-in, no treatment yet, two unlogged voicemails. **An emergency contact** is on file.",
  "steps": [
   "Step 1: **name the live deadlines** before any outreach",
   "Log the two earlier voicemails with **date, time, channel**",
   "Carry the ladder forward: email, SMS, **emergency contact**",
   "Record **the next action** with its due date",
   "Decide whether **Step 3 notification** is warranted, and the impact"
  ],
  "deliver": "A Step 1 review and an **unbroken, contemporaneous** Step 2 outreach log",
  "checks": [
   "Step 1 review done **before any outreach**",
   "**Every entry**: date, time, channel, outcome",
   "Email and SMS attempted, **not repeat calls**",
   "Impact names **SOL 02/06/2028** and treatment not started",
   "No entry **threatens withdrawal** or closure"
  ],
  "dos": [
   "Write each entry as if **audited six months from now**"
  ],
  "donts": [
   "Logging **“called client, no answer”** with no details",
   "Counting three calls to one mobile **as three channels**"
  ]
 },
 "d1m2-l2": {
  "image": "skip-trace",
  "hook": "The Final Warning Letter is **the last low-cost step** before search or withdrawal.",
  "points": [
   "Step 4: send by **certified mail AND email**, to a confirmed address",
   "State earlier attempts, **a 7–14 day deadline**, and notice of potential withdrawal",
   "Skip-Trace needs **all three**: ladder exhausted, letter sent, deadline passed",
   "Withdrawal and skip-tracing are **counsel's decisions**; keep the file moving"
  ],
  "upl": "Never judge the claim or advise on rights; only the attorney ends representation",
  "job": [
   [
    "No response after Step 3",
    "Draft letter, 7–14 day deadline",
    "Action Plan Editor",
    "Attempts itemized; withdrawal notice present"
   ],
   [
    "Letter ready",
    "Confirm address; certified mail AND email",
    "CMS → Documents → Outgoing",
    "Both logged; receipt kept"
   ],
   [
    "Response deadline expires",
    "Verify all three criteria; escalate",
    "CMS → Tasks → Escalate",
    "Criteria evidenced in the log"
   ]
  ],
  "dos": [
   "Itemize **attempts with dates**",
   "Ask in-house help to **confirm an address**"
  ],
  "donts": [
   "Skip-tracing on **the first criterion alone**",
   "Writing **“we are withdrawing”** without attorney approval"
  ],
  "theory": {
   "lead": "The Final Warning Letter **closes the outreach record**: one last documented notice before the firm searches for the client or counsel moves to withdraw.",
   "concepts": [
    {
     "term": "Dual Delivery",
     "text": "Certified mail proves delivery; email gets a response. **Each covers the other's gap**"
    },
    {
     "term": "The Three-Criteria Gate",
     "text": "An AND gate, not a checklist: the search waits until **all three are true**, so money isn't spent early"
    },
    {
     "term": "Skip-Trace",
     "text": "A paid search for a missing person's current address and contacts; **counsel authorizes it** because it spends firm money"
    },
    {
     "term": "Withdrawal",
     "text": "Ending representation by Notice of Withdrawal or Motion to Withdraw; **only the attorney decides**, under firm and court rules"
    }
   ],
   "pages": [],
   "framework": {
    "title": "The No Contact Protocol, Steps 4–6",
    "kind": "flow",
    "steps": [
     {
      "label": "Final Warning Letter",
      "text": "Earlier attempts itemized, a 7–14 day deadline, withdrawal notice; certified mail AND email"
     },
     {
      "label": "Decision Point",
      "text": "Still no response: **the attorney decides** on a Notice or Motion to Withdraw"
     },
     {
      "label": "File Closure",
      "text": "Marked “No response – withdrew per protocol”; proof of every attempt retained"
     }
    ],
    "note": "Skip-tracing waits for all three: ladder exhausted, letter sent, deadline passed. Counsel authorizes it."
   }
  }
 },
 "d1m2-a2": {
  "image": "email-outreach",
  "situation": "John Doe, unreachable **eleven days**: phone, email, texts and emergency contact all tried, logged. Step 3 escalation made to Atty. Thorne. **Treatment still hasn't begun**.",
  "steps": [
   "Itemize **the earlier attempts** with dates",
   "Set a response deadline **inside 7–14 days**, as a date",
   "Give **notice of potential withdrawal** and how to respond",
   "Keep every line **inside the UPL boundary**",
   "Record the Skip-Trace criteria and **Atty. Thorne's Step 5 authority**"
  ],
  "deliver": "A **send-ready Final Warning Letter**, both deliveries logged, escalation recorded",
  "checks": [
   "**DOL 02/06/2026** and file reference present",
   "Deadline is **a date inside 7–14 days**",
   "Withdrawal noted **as possible, not decided**",
   "**Certified mail AND email** both recorded",
   "No statement on **value or legal consequences**"
  ],
  "dos": [
   "Be **urgent without threatening**: what's needed, by when"
  ],
  "donts": [
   "A deadline of **“as soon as possible”**",
   "Writing **“you will lose your case”**"
  ]
 },
 "d1m2-kc": {
  "image": "escalation-alert",
  "questions": [
   "Set out all **six No Contact Protocol steps** in order, with each step's required action.",
   "State the protocol's **three purposes**. Which one protects the firm rather than the client?",
   "A colleague calls **three voicemails to one mobile** an exhausted ladder. What's wrong; what should the log show?",
   "State the **three Skip-Trace criteria**, and why starting on fewer hurts the firm and the record.",
   "Eleven days unreachable, **treatment not begun**: name every risk now building, and what you do about each.",
   "At Step 5, still no response. What may you do, and what may **only Atty. Thorne** do?",
   "Bring **inside the UPL boundary**: “Call back this week or you will lose your case and we'll withdraw.”"
  ]
 },
 "d1m3-l1": {
  "image": "privacy-shield",
  "hook": "Most self-inflicted claim damage happens **in the first two weeks**, before the client is told.",
  "points": [
   "**No Recorded Statement** to the adverse carrier; route contact through the firm",
   "Start treatment and **keep every appointment**",
   "**Post nothing**, sign nothing from a carrier until the firm reviews it",
   "Rental: confirm authorization, **rate cap and duration** before collection"
  ],
  "upl": "Give the instruction; route questions about claim value to Atty. Thorne",
  "job": [
   [
    "Retainer signed",
    "Deliver standing instructions; log delivery",
    "CMS → Onboarding",
    "Date and method logged"
   ],
   [
    "Client asks about a rental",
    "Confirm policy, authorization, cap, duration",
    "CMS → Property Damage",
    "Recorded before collection"
   ],
   [
    "Adverse carrier calls client",
    "Route to the firm; log contact",
    "CMS → Communications Log",
    "No Recorded Statement; logged"
   ]
  ],
  "dos": [
   "Explain **why consistent treatment matters**",
   "Use **active listening**; heard clients follow instructions"
  ],
  "donts": [
   "Explaining why a Recorded Statement hurts: **that's legal advice**",
   "Letting a carrier's Property Damage call **drift into injuries**"
  ],
  "theory": {
   "lead": "Client instructions protect the claim from **the client's own good intentions**: what the client says, posts, signs or skips can become evidence.",
   "concepts": [
    {
     "term": "Medical vs. Legal Danger",
     "text": "A medical danger threatens the client's health; a legal danger, like **a gap in care**, threatens the claim"
    },
    {
     "term": "A Clean, Discoverable File",
     "text": "Everything on the file can reach defense counsel, so instructions stay **factual, never legal opinion**"
    },
    {
     "term": "Letter of Representation",
     "text": "The notice that the firm represents the client; from then on, adverse contact **routes through the firm**"
    },
    {
     "term": "Rate Cap and Duration",
     "text": "The authorized daily rate and number of days; **anything beyond them** is the client's own cost"
    }
   ],
   "pages": [
    "D1#44",
    "D1#28"
   ],
   "framework": {
    "title": "The Rental Authorization Check",
    "kind": "flow",
    "steps": [
     {
      "label": "Whose Policy Is Primary?",
      "text": "The renter's own policy is usually primary; the rental company follows a written denial"
     },
     {
      "label": "Who Authorizes?",
      "text": "Confirm who authorizes the rental and check for a rental reimbursement endorsement"
     },
     {
      "label": "Daily Rate Cap",
      "text": "Record the authorized daily rate before the client collects a vehicle"
     },
     {
      "label": "Duration Limit",
      "text": "Record the number of covered days: **uncovered days are the client's cost**"
     }
    ],
    "note": "All four go in the CMS before collection; the LOR carve-out lets the carrier discuss only Property Damage."
   }
  }
 },
 "d1m3-a1": {
  "image": "client-call",
  "situation": "John Doe's retainer is signed and the matter is open. **Nothing has been sent** yet, and **Robert Smith's carrier** has already called him.",
  "steps": [
   "Build **all six packet sections**",
   "Fill each with the **firm's standing instructions**",
   "Make the **Property Damage section** specific to this file",
   "Name **the most urgent instruction** and how you'll confirm understanding",
   "**Log delivery** with date and method"
  ],
  "deliver": "A complete, delivered, logged packet **specific to John Doe's file**",
  "checks": [
   "**All six sections** present and populated",
   "Treatment direction stated: **treatment hasn't begun**",
   "Property Damage section names **the rental parameters**",
   "Atty. Elijah Thorne listed as **Lead Counsel**",
   "Adverse-contact instruction made urgent, **with a confirmation step**"
  ],
  "dos": [
   "Plan how you'll know **he read it**"
  ],
  "donts": [
   "A **generic packet** that ignores the file's history"
  ]
 },
 "d1m3-l2": {
  "image": "repair-shop",
  "hook": "Property Damage is the client's first test of the firm, and **physical evidence of impact**.",
  "points": [
   "Get **the written Repair Estimate** before discussing any outcome",
   "Total loss: confirm the carrier's **threshold basis in writing**",
   "ACV is **pre-loss market value**: not the loan balance, not a replacement",
   "Loss of Use is **claimed separately**, per day without a vehicle"
  ],
  "upl": "Report figures; never advise on accepting a valuation or the vehicle's legal worth",
  "job": [
   [
    "Repair Estimate received",
    "Log; compare with ACV, final bill",
    "CMS → Property Damage",
    "Comparison recorded"
   ],
   [
    "Carrier states a disposition",
    "Confirm threshold basis, Valuation Report",
    "CMS → Property Damage → Correspondence",
    "Basis confirmed, not assumed"
   ],
   [
    "Client is without a vehicle",
    "Record dates; open loss-of-use claim",
    "CMS → Property Damage",
    "Dates recorded; claimed separately"
   ]
  ],
  "dos": [
   "Check supplementals: often the best proof of **hidden damage**",
   "Verify the Valuation Report so **the client isn't lowballed**"
  ],
  "donts": [
   "Working only from **the initial estimate**",
   "Treating Property Damage as **“just the car”**"
  ],
  "theory": {
   "lead": "Property Damage is **a separate claim** with its own measure: repair or total, set against the vehicle's pre-loss value.",
   "concepts": [
    {
     "term": "The Scene Audit",
     "text": "Photos, video and damage must match how the crash happened; **the physics must be possible**"
    },
    {
     "term": "Supplemental Estimate",
     "text": "An added estimate written after teardown finds hidden damage: **proof of impact severity** for the injury claim"
    },
    {
     "term": "Total Loss Threshold",
     "text": "The repair-to-ACV percentage at which a carrier stops repairing and **pays the value instead**"
    },
    {
     "term": "The Valuation Report",
     "text": "The carrier's market-based report that sets ACV; **verify it line by line** so the client isn't lowballed"
    }
   ],
   "pages": [
    "D2#6"
   ],
   "framework": {
    "title": "Property Damage (PD) Deep Dive",
    "kind": "table",
    "head": [
     "Check",
     "What you audit",
     "Why it matters"
    ],
    "rows": [
     [
      "Photos",
      "Point-of-impact clarity, including the undercarriage and frame",
      "Physical proof of the impact behind the injury claim"
     ],
     [
      "Estimates vs. Actuals",
      "The insurance estimate against the final body shop bill",
      "**Supplementals prove hidden** structural damage"
     ],
     [
      "Total Loss/Value",
      "The CCC One or other Valuation Report, line by line",
      "So the client isn't lowballed on the vehicle's value"
     ],
     [
      "The Scene Audit",
      "Photos, video and damage against how the crash happened",
      "The physics of the claim must be possible"
     ]
    ],
    "note": "Audit Property Damage as carefully as the medicals: it is physical evidence of how hard the impact was."
   }
  }
 },
 "d1m3-a2": {
  "image": "checklist-qa",
  "situation": "John Doe's onboarding packet is **delivered and logged**. The directions must now become **tracked obligations**, not a document sent once.",
  "steps": [
   "Turn each direction into **a tracked task**",
   "Set **owner, due date and verification** for each",
   "Find **the mis-assigned card** and reassign it",
   "Record why it **could never be the client's**",
   "Schedule the **treatment-start follow-up**"
  ],
  "deliver": "A tracked task set with **correct owners, dates and verification**",
  "checks": [
   "Every task has **an owner and due date**",
   "**Verification method** recorded for each task",
   "Mis-assigned card **reassigned to the firm**",
   "**Reason for reassignment** recorded",
   "**Treatment-start follow-up** scheduled"
  ],
  "dos": [
   "Ask of every task: **how will you know**?"
  ],
  "donts": [
   "Tracking tasks **without confirming they were done**"
  ]
 },
 "d1m3-kc": {
  "image": "property-damage",
  "questions": [
   "List the firm's **standing instructions** for a new client, and the harm each prevents.",
   "Before a rental: what must be confirmed, **whose policy is usually primary**, and what happens to uncovered days?",
   "What does **actual cash value** mean and not mean, and why does the loan-balance mix-up mislead clients?",
   "Robert Smith's carrier asks John Doe for **a Recorded Statement**. What do you instruct and log?",
   "Beyond **the repair or ACV payment**, what else may John Doe be owed, and how is each documented?",
   "A delivered direction **never became a tracked task**. Why is that a failure, and what's the cost here?",
   "What does **the Case Manager own** on John Doe's file, and what does Atty. Thorne own?",
   "Which errors did you find **in the draft record** and intake sheet, and which documents proved them?"
  ]
 },
 "d1m4-l1": {
  "image": "treatment-plan",
  "hook": "The plan is **the file's operating instruction**, and what Atty. Thorne sets strategy from.",
  "points": [
   "**Decide acceptance**: Accepted, Escalated or Declined, with a reason",
   "State coverage, liability and projection together; projection **preliminary until coverage confirmed**",
   "Give Clinical, Functional and Financial pillars **measurable goals**",
   "**Flag adverse facts prominently**; a buried risk isn't disclosed"
  ],
  "upl": "State facts, flag risks; legal conclusions, value and posture are Atty. Thorne's",
  "job": [
   [
    "Verification call complete",
    "Record acceptance decision and reason",
    "CMS → Case Notes",
    "Reason a colleague can follow"
   ],
   [
    "Coverage verified, triple-check cleared",
    "Draft all five bands",
    "Action Plan Editor",
    "Risks band populated"
   ],
   [
    "Plan drafted",
    "Docket window; route to Atty. Thorne",
    "Route for review · Calendar",
    "Routed before any position-committing action"
   ]
  ],
  "dos": [
   "Give each pillar **measurable goals**",
   "Give every decision **a reason others can follow**"
  ],
  "donts": [
   "A plan that **only covers clinical care**",
   "Gathering more information **at the acceptance stage**",
   "Letting an uncertain file **sit in limbo**"
  ],
  "theory": {
   "lead": "Early evaluation joins **coverage, liability and projection**: is there money, who is responsible, and how the case is likely to move.",
   "concepts": [
    {
     "term": "Coverage Determination",
     "text": "Which policies apply, with what benefits, limits and exclusions: **is there money** to pay the claim?"
    },
    {
     "term": "Liability Assessment",
     "text": "Who caused the incident and to what degree: **clear, shared or disputed**, and on what evidence"
    },
    {
     "term": "Case Projection",
     "text": "An early read of risk and trajectory from coverage, liability, injury, treatment and documents; **value stays with counsel**"
    },
    {
     "term": "Strict Compliance",
     "text": "In a legal framework, case management shifts from **best efforts to strict compliance**: every plan deadline is docketed"
    }
   ],
   "pages": [
    "D1#21",
    "D1#22"
   ],
   "framework": {
    "title": "Why These Three Work Together",
    "kind": "table",
    "head": [
     "Element",
     "The question",
     "What you check"
    ],
    "rows": [
     [
      "Coverage",
      "Is there money to pay the claim?",
      "Valid policies, coverage type, limits, exclusions and gaps"
     ],
     [
      "Liability",
      "Who is responsible, and to what degree?",
      "Who caused it; clear, shared or disputed; evidence; comparative negligence"
     ],
     [
      "Projection",
      "How is this case likely to move?",
      "Coverage, liability, injury severity, treatment expectations, documentation quality"
     ]
    ],
    "note": "Projection reads risk and trajectory; it stays preliminary until coverage is confirmed, and case value stays with Atty. Thorne."
   }
  }
 },
 "d1m4-a1": {
  "image": "calendar-gap",
  "situation": "John Doe's first treatment records have arrived. **DOL 02/06/2026**; **first treatment 02/20/2026**; chiropractic care began 02/24/2026.",
  "steps": [
   "Compute **the gap exactly** from DOL to first treatment",
   "Record the gap; **watch for a later break** in care",
   "In the risks band, state how each is **used against the claim**",
   "List **likely causes** and the steps to explain them",
   "**Route the flag** to Atty. Thorne"
  ],
  "deliver": "A **precisely computed, prominently flagged** and routed treatment-gap record",
  "checks": [
   "Gap: **14 days, 02/06/2026 to 02/20/2026**",
   "Gap recorded; **a watch set** for later breaks",
   "**Defense uses named**: not serious, recovered early, unnecessary, other causes",
   "Investigation steps: **client's explanation, documents, provider confirmation**",
   "Flag prominent in risks band; **routed to Atty. Thorne**"
  ],
  "dos": [
   "**Document the reason** for every interruption"
  ],
  "donts": [
   "Writing **“about two weeks”** instead of exact dates",
   "Recording the gap but **setting no watch** for the next"
  ]
 },
 "d1m4-l2": {
  "image": "strategy-session",
  "hook": "Routing isn't overhead: it's where **operational work becomes authorized work**.",
  "points": [
   "Draft in **the section templates**; owner and date in their own fields",
   "**Route for review** before committing the firm's position externally",
   "Address every comment and re-route; run on **the approved version**",
   "Re-route when **a material fact changes**"
  ],
  "upl": "Legal strategy is counsel's: review comments needing legal judgment go to Atty. Thorne",
  "job": [
   [
    "Five bands drafted",
    "Route to Atty. Thorne",
    "Action Plan Editor",
    "Routing timestamp recorded"
   ],
   [
    "Returned with comments",
    "Address every comment; re-route",
    "Action Plan Editor → Revisions",
    "No comment unaddressed"
   ],
   [
    "Material fact changes",
    "Mark superseded; re-route",
    "Action Plan Editor → Version",
    "Approved version kept; new one routed"
   ]
  ],
  "dos": [
   "Assume **defense counsel reads every note**",
   "Keep medical notes **factual and clinical**"
  ],
  "donts": [
   "Edits that **break the audit trail**",
   "Writing **“this will help the case”** in a treatment note"
  ],
  "theory": {
   "lead": "A case plan is a **living, approved document**: drafted in structure, reviewed by counsel, then run.",
   "concepts": [
    {
     "term": "Section Templates",
     "text": "One structure for every plan, so reviewers can **scan it fast** and nothing is missed"
    },
    {
     "term": "The Review Loop",
     "text": "Draft, route, review, approve, execute; **a return is normal**, a step back into drafting, not a failure"
    },
    {
     "term": "Pre-Confirmation Stage",
     "text": "A conclusion still awaiting its proof; when the proof arrives and differs, **the plan is re-routed**"
    },
    {
     "term": "The Audit Trail",
     "text": "The CMS keeps every version unaltered, so **each approval is provable**, and every note is discoverable"
    }
   ],
   "pages": [
    "D1#25"
   ],
   "framework": {
    "title": "Mandatory Disclosure & Compliance Tracking",
    "kind": "table",
    "head": [
     "Requirement",
     "What the plan tracks"
    ],
    "rows": [
     [
      "Electronic Record Integrity",
      "A CMS that keeps an **unalterable audit trail** of every version"
     ],
     [
      "State-Specific Timelines",
      "Carrier-mandated deadlines, such as an early IME in no-fault states"
     ],
     [
      "Letter of Protection (LOP)",
      "Providers treating under an LOP, so no bill arrives as a surprise"
     ],
     [
      "The Golden Rule",
      "Medical plan and legal claim as parallel tracks: coordinate, don't commingle"
     ]
    ],
    "note": "The file is discoverable in litigation: write every plan note as if defense counsel will read it."
   }
  }
 },
 "d1m4-a2": {
  "image": "cms-screen",
  "situation": "Day 1's work is in: parties mapped, **$40,000 stack verified**, triple-check cleared, packet tracked, **14-Day Treatment Gap** identified. Atty. Thorne awaits the Case Plan.",
  "steps": [
   "Snapshot: record **the acceptance decision** and its reason",
   "Coverage stack and order, liability, **preliminary projection**, triple-check results",
   "Pillars: **measurable goals**; each action item with owner and date",
   "Risks: **14-Day Gap and later breaks in care**, prominently, with consequences",
   "Docket the filing window, then **route to Atty. Thorne**"
  ],
  "deliver": "A complete, routed plan counsel could **set strategy from** without a follow-up question",
  "checks": [
   "Snapshot: DOL 02/06/2026, SOL 02/06/2028, **client a passenger**",
   "Coverage **$10,000 / $20,000 / $10,000**, total $40,000",
   "Order **BI → Host UM → Relative UM**; projection preliminary",
   "Risks band: **14-Day Gap and later breaks**, with consequences",
   "Plan **routed to Atty. Elijah Thorne** with a timestamp"
  ],
  "dos": [
   "If counsel must ask a question, **it isn't finished**"
  ],
  "donts": [
   "A projection stated as a number **before coverage is confirmed**"
  ]
 },
 "d1m4-kc": {
  "image": "knowledge-check",
  "questions": [
   "Set out the **five bands** of the Case Plan and what belongs in each, including the three pillars.",
   "Why has **an adverse fact buried** in a plan's body not really been disclosed to counsel?",
   "State John Doe's coverage as the plan should: layers, limits, total, **order of operations**, projection status.",
   "**Compute John Doe's Treatment Gap** from the record dates. How will an adjuster use it?",
   "The gap investigation changes the picture after approval. What is **the approval's status**, and what do you do?",
   "Draw the line: one thing the plan may state, and one that **must come from Atty. Thorne**.",
   "List the **four Day 1 gate conditions**. What breaks if treatment work starts with the stack unverified?"
  ]
 },
 "d2m1-l1": {
  "image": "policy-letter",
  "hook": "The LOR moves every carrier onto the firm; one wrong letter risks **$30,000 of UM coverage**.",
  "points": [
   "Name the **right insured** on each: Robert Smith, Kevin Alvarez, Margaret Doe",
   "Notify **all three stack carriers** now: late notice hands them a defense",
   "**Notice, not demand**: no UM payment request before the documented BI tender",
   "Keystone gets **John Doe's name only**: no phone, address, birth date, employer"
  ],
  "upl": "You draft and send; Atty. Thorne signs. Never value the claim or argue fault.",
  "job": [
   [
    "Claims opened 02/16–02/17/2026",
    "Log number, adjuster, delivery method",
    "CMS → Insurance tab",
    "Number, adjuster or “none yet”, method"
   ],
   [
    "LOR set drafted",
    "Route all five for signature",
    "CMS → Documents → Outgoing",
    "Signed by counsel, never the CM"
   ],
   [
    "Letters served 02/17/2026",
    "Log delivery; calendar acknowledgement check",
    "CMS → Communications Log",
    "Follow-up 02/20/2026 if carrier silent"
   ]
  ],
  "dos": [
   "Confirm **claim number and adjuster** on every claim call",
   "Keep claim-opening facts **general and verifiable**",
   "Treat other coverage as **a question for Atty. Thorne**"
  ],
  "donts": [
   "A UM letter that **reads as a demand**",
   "The client's **phone, address or birth date** to Keystone",
   "A **guessed adjuster name** for Cardinal State"
  ],
  "theory": {
   "lead": "Claim set-up is coverage determination: finding **which policies apply** and what limits and exclusions they carry. The LOR puts the firm on each one.",
   "concepts": [
    {
     "term": "Letter of Representation",
     "text": "The firm's formal notice that it represents the client: **it moves all contact** off the client and onto the firm"
    },
    {
     "term": "Coverage Determination",
     "text": "Four questions: is coverage valid, what type applies, what are the limits, any exclusions? **Every LOR request** chases an answer"
    },
    {
     "term": "Liability Assessment",
     "text": "Who is legally responsible, and how far: **clear, shared or disputed**. Atty. Thorne weighs it; you secure the proof"
    },
    {
     "term": "First- and Third-Party Claims",
     "text": "Third-party: the other driver's carrier, adverse to the client. First-party: policies covering him. **Each letter differs accordingly**"
    },
    {
     "term": "Information Protection",
     "text": "The adverse carrier learns only what it must: **anything you give it** can be used against the client"
    },
    {
     "term": "Notice vs. Demand",
     "text": "Notice preserves the claim; a demand asks for payment. **UM notice comes early**; demand follows a documented BI tender"
    },
    {
     "term": "Preservation Request",
     "text": "Asks the carrier to keep photos, statements, video, the vehicle and its event data: **liability proof that can vanish**"
    },
    {
     "term": "Acknowledgement",
     "text": "The carrier's written receipt of the LOR, sometimes stating coverage and limit: **the first written answer** you log"
    }
   ],
   "pages": [
    "D1#21"
   ],
   "framework": {
    "title": "Coverage Determination and Liability",
    "kind": "table",
    "head": [
     "Coverage Determination",
     "Liability Assessment"
    ],
    "rows": [
     [
      "Is there valid insurance coverage?",
      "Who caused the incident?"
     ],
     [
      "What type of coverage applies?",
      "Is liability clear, shared or disputed?"
     ],
     [
      "What are the **policy limits**?",
      "What evidence supports fault?"
     ],
     [
      "Are there exclusions or coverage gaps?",
      "Are there comparative negligence factors?"
     ]
    ],
    "note": "Every LOR request chases a coverage answer; Atty. Thorne weighs liability, and the preservation request protects its proof"
   }
  }
 },
 "d2m1-a1": {
  "image": "email-outreach",
  "situation": "File date 02/17/2026. Claims are open with Keystone (BI and PD), Harbor Point (Host UM, MedPay) and Cardinal State, **no adjuster assigned**. **Five letters** must go out today.",
  "steps": [
   "Draft **five letters** on the firm template: three LORs, two notices",
   "Give each its **Attn line, insured, number** and date of loss",
   "Request **limits, Declaration Pages**, additional coverage and preservation",
   "Route the set to **Atty. Thorne for signature**",
   "Send by preferred method; **calendar the acknowledgement checks**"
  ],
  "deliver": "Five letters **signed, sent and logged**, each correctly addressed, follow-ups calendared",
  "checks": [
   "Cardinal State: **“Attn: Claims Department”**, not a guessed name",
   "**Correct insured** on each: Robert Smith, Kevin Alvarez, Margaret Doe",
   "Keystone: **John Doe's name only**; PD carve-out for the Civic",
   "No UM letter **asks for payment**",
   "All signed and sent 02/17/2026; **follow-up 02/20/2026** if silent"
  ],
  "dos": [
   "Read each letter **against the claim-call log** before signature",
   "Tell John Doe: PD may call **about the Civic only**"
  ],
  "donts": [
   "One letter copied five times, **insured left as Robert Smith**",
   "**Sending before signature** because a carrier said “today”"
  ]
 },
 "d2m1-l2": {
  "image": "coverage-check",
  "hook": "An unverified coverage fact is a guess: put **a source behind every “confirmed”**.",
  "points": [
   "Limits stay **preliminary until a Declaration Page** or Coverage Letter",
   "Get each UM carrier's form **in writing**: add-on or reduced",
   "Stack **three layers to $40,000**; MedPay and PD are tracked, never added",
   "Every open item carries **a dated next follow-up**"
  ],
  "upl": "You record and chase; applying terms or alleging bad faith is Atty. Thorne's call.",
  "job": [
   [
    "Written coverage confirmation arrives",
    "Enter limit, form, source, date",
    "CMS → Insurance tab",
    "Confirmed only with document attached"
   ],
   [
    "Adjuster assigned: Teresa Okafor, 03/03/2026",
    "Replace “not yet assigned” with contact",
    "CMS → Insurance tab · Parties",
    "No stale “not yet assigned” entry"
   ],
   [
    "Follow-up date arrives, item open",
    "Follow up, log, set next date",
    "CMS → Calendar · Communications Log",
    "No open item with past date"
   ]
  ],
  "dos": [
   "Log a verbal limit at once, **marked verbal**",
   "Keep **a paper trail** on every Keystone request",
   "Check each policy period **covers 02/06/2026**"
  ],
  "donts": [
   "**Adding MedPay or PD** to the stack total",
   "Confirming a limit **from a phone call** or Police Report",
   "An open request with **no next date**"
  ],
  "theory": {
   "lead": "Coverage verification turns a reported fact into **a confirmed one in writing**: every limit, form and exclusion traced to the document that proves it.",
   "concepts": [
    {
     "term": "Coverage Matrix",
     "text": "One row per carrier, the file's single coverage record: **status, source and date** show what is proven"
    },
    {
     "term": "Verification Statuses",
     "text": "Reported, noticed, acknowledged, disclosed, confirmed in writing: **only the last is proof**; each earlier status is a lead"
    },
    {
     "term": "Declaration Page",
     "text": "The policy's own summary of who and what it covers, and for how much: **the proof behind a limit**"
    },
    {
     "term": "Limit Types",
     "text": "**Per person** caps one injured person; per accident caps everyone; a combined single limit is one figure for all"
    },
    {
     "term": "UM Forms",
     "text": "Add-on (excess) UM pays on top of the BI payment; reduced UM subtracts it. **The form changes the stack**"
    },
    {
     "term": "Stacking Layers",
     "text": "Only liability and UM layers stack; MedPay, PD and collision coverage are **separate benefits, tracked apart**"
    },
    {
     "term": "Exclusions and Gaps",
     "text": "A policy's exclusions matter as much as its limits: **a verified zero** is a fact, an assumed one a guess"
    },
    {
     "term": "Applied Case Manager Actions",
     "text": "A stalled carrier is a bottleneck: find the root cause, act now, then **prevent the next occurrence**"
    }
   ],
   "pages": [
    "D1#20",
    "D1#18"
   ],
   "framework": {
    "title": "Identified Potential Coverage Sources",
    "kind": "table",
    "head": [
     "Coverage type",
     "Limit or form",
     "Status proven by",
     "Notes"
    ],
    "rows": [
     [
      "BI liability",
      "Per person, per accident or combined single limit",
      "Declaration Page or Coverage Letter",
      "First stack layer; confirm no step-down"
     ],
     [
      "Host UM",
      "Add-on, or reduced by the BI payment",
      "The carrier's written form confirmation",
      "Second layer; opens after the BI tender"
     ],
     [
      "Relative UM",
      "Add-on or reduced; other-insurance clause",
      "Certified policy and Coverage Letter",
      "Third layer; priority is Atty. Thorne's call"
     ],
     [
      "MedPay or PIP",
      "Medical bills to its limit, regardless of fault",
      "Written terms, including any reimbursement right",
      "**Tracked apart**, never added to the stack"
     ],
     [
      "PD and collision",
      "Vehicle damage only",
      "Declaration Page, like any limit",
      "Separate benefit, outside the stack"
     ],
     [
      "Client's own UM",
      "Zero if rejected in writing",
      "The signed rejection form in the file",
      "A verified zero, not an assumed one"
     ]
    ],
    "note": "Only BI and the UM layers stack; on this file $10,000 + $20,000 + $10,000 = $40,000"
   }
  }
 },
 "d2m1-a2": {
  "image": "insurance-stack",
  "situation": "File date 03/11/2026. A colleague's Coverage Matrix **totals $45,000**. The file holds Harbor Point's 03/02/2026 confirmation, Cardinal State's 03/09/2026 letter and **no Keystone Declaration Page** yet.",
  "steps": [
   "Check **every row against its document**",
   "Correct each error, **citing document and date**",
   "Restore the **$40,000 stack total**; leave correct rows alone",
   "Clear each **past-due follow-up**: act, then set a date",
   "Route a **three-line audit note** to Atty. Thorne"
  ],
  "deliver": "A corrected matrix **totalling $40,000**, every status sourced, open items dated, note routed",
  "checks": [
   "BI: **still preliminary**; Declaration Page not until 03/20/2026",
   "**MedPay moved out** of the stack into the Payer Order",
   "Stack total **$45,000 corrected to $40,000**",
   "BI follow-up **logged 03/11/2026**; next by 03/13/2026",
   "Bluewater's “UM: none” chased: **signed rejection form** (03/14/2024)"
  ],
  "dos": [
   "Open the letter **before you change the cell**"
  ],
  "donts": [
   "**Marking BI confirmed** because $10,000 is expected",
   "Fixing the total **without finding why**"
  ]
 },
 "d2m1-kc": {
  "image": "knowledge-check",
  "questions": [
   "Name the **five letters** sent 02/17/2026: for each, the insured named and how it was addressed.",
   "Why “Attn: Claims Department” on Cardinal State's LOR, and what had to change **in the CMS after 03/03/2026**?",
   "What must Keystone's LOR request and **leave out**, and why can Harbor Point's letter say more?",
   "On 03/11/2026, which layers were **confirmed in writing**, which preliminary, and by what document and date?",
   "Why do MedPay ($5,000) and Keystone's PD ($25,000) sit in the matrix but **never in the $40,000 stack**?",
   "Dana Whitfield offers to **“talk limits”** for why John Doe waited. What do you say, log, and escalate?",
   "If Host UM were **reduced by the BI**, what would the matrix show, and why verify the form?"
  ]
 },
 "d2m2-l1": {
  "image": "treatment-plan",
  "hook": "An LOP **out of Payer Order** turns a payable bill into a lien on his net.",
  "points": [
   "Run the payer order: **MedPay → Peach State → LOP**",
   "Use an LOP **only where earlier payers can't**",
   "Atty. Thorne sets LOP terms; **never promise payment** amounts, reductions or dates",
   "Be the hub: **warm handoffs**, not phone numbers"
  ],
  "upl": "You prepare and route LOPs; never set terms, sign, promise payment or explain liability.",
  "job": [
   [
    "Provider asks for an LOP",
    "Run Payer Order; prepare if needed",
    "CMS → Documents → Outgoing",
    "Nothing sent without Atty. Thorne's approval"
   ],
   [
    "MedPay pays a bill",
    "Post payment, running total, balance",
    "CMS → MedPay ledger",
    "$5,000.00 reached 06/12/2026; $0.00 left"
   ],
   [
    "LOP statement arrives",
    "Update balance; check lines against visits",
    "CMS → Liens → LOP register",
    "Every billed date an attended visit"
   ]
  ],
  "dos": [
   "Ask **“Is the plan working?”** at every contact",
   "Tell John Doe **which payer handles which bill**",
   "Reconcile **conflicting provider statements** at once"
  ],
  "donts": [
   "An LOP **before checking MedPay** and Peach State",
   "Telling a provider **“paid in full at settlement”**",
   "Mission creep: taking on **every problem John Doe raises**"
  ],
  "theory": {
   "lead": "Once the claim is set up, the case plan runs on **three pillars**: clinical care, functional status and subrogation management, which sets who pays.",
   "concepts": [
    {
     "term": "Payer Order",
     "text": "The default sequence: MedPay or PIP first, health insurance next, an LOP last. **Order keeps liens down**"
    },
    {
     "term": "MedPay vs. PIP",
     "text": "First-party coverage for medical bills regardless of fault, up to its limit; **unlike PIP, no wages**"
    },
    {
     "term": "Health Insurance",
     "text": "Pays covered care at its contract rate, but may hold **a reimbursement right** against the recovery"
    },
    {
     "term": "Letter of Protection",
     "text": "The client's signed agreement that a provider is paid from any recovery: **a consensual lien** on his net"
    },
    {
     "term": "Standard Treatment Map",
     "text": "The usual route of care: emergency, imaging, chiropractic and PT, orthopedics, pain management, surgery. **Each stop needs a payer**"
    },
    {
     "term": "Monitoring Progress",
     "text": "Evaluating clinical and functional outcomes, not checking boxes: **ask about the plan**, not just “How are you?”"
    },
    {
     "term": "Crisis Intervention",
     "text": "Stepping in when care is denied or stalled by bureaucracy: **adjust the plan** to the immediate issue first"
    },
    {
     "term": "Medication Red Flags",
     "text": "Combined opioid, muscle relaxant and sedative, or rising doses without a new diagnosis: **raise it with the provider**"
    }
   ],
   "pages": [
    "D1#26",
    "D1#39"
   ],
   "framework": {
    "title": "The Payer Order",
    "kind": "flow",
    "steps": [
     {
      "label": "Identify the payers",
      "text": "Primary payer determination: list every source and its default order; primacy is Atty. Thorne's call"
     },
     {
      "label": "MedPay or PIP",
      "text": "First-party, regardless of fault, up to its limit; MedPay pays medical bills only, never wages"
     },
     {
      "label": "Health plan",
      "text": "Pays covered care at its contract rate, but may assert **a reimbursement right** against the recovery"
     },
     {
      "label": "Letter of Protection",
      "text": "Last rung, for care earlier payers can't carry: paid from any recovery, on Atty. Thorne's terms"
     }
    ],
    "note": "On this file: Harbor Point MedPay, then Peach State, then an LOP. No PIP; providers bill whom they bill"
   }
  }
 },
 "d2m2-a1": {
  "image": "medical-visit",
  "situation": "02/23/2026. Urgent care's $685.00 went to MedPay. Riverton Spine & Rehab, **out of network** for Peach State, starts care 02/24/2026. On 03/11/2026 Summit Imaging asks for **an LOP for the MRI**.",
  "steps": [
   "Run and record **the Payer Order** for each provider",
   "Prepare Riverton Spine & Rehab's LOP; **route it for signature**",
   "Transmit with the HIPAA authorization; ask for **a missed-visit alert**",
   "Record the assessment and **the 2021 pre-morbid baseline**",
   "Decline Summit in writing, **naming Harbor Point MedPay**"
  ],
  "deliver": "One **counsel-approved LOP** sent, one declined with payer named, ledger and baseline recorded",
  "checks": [
   "Signed by John Doe and Atty. Thorne **before 02/24/2026**",
   "Baseline: 2021 visits **low back, resolved**; no prior neck",
   "Rental ends 03/19/2026: **calendared as a treatment risk**",
   "Decline proved: **$3,675.00 left**, enough for the $2,395.00 MRI",
   "**No payment promised** to either provider"
  ],
  "dos": [
   "Run the Payer Order **before the LOP template**, every time",
   "Highlight prior history: **never hide it**"
  ],
  "donts": [
   "An LOP to a provider **MedPay would have paid**",
   "Answering **“paid in full?”** beyond the LOP's terms"
  ]
 },
 "d2m2-l2": {
  "image": "escalation-alert",
  "hook": "On an LOP, you are **the only real-time check** that John Doe's plan is working.",
  "points": [
   "Monitor **outcomes, not attendance** alone; hunt the barriers",
   "Week 6 (04/07/2026): **20–30% more range of motion** or lower pain",
   "**A-C-T every red flag**; write each intervention as a GIRP note",
   "Adjust the plan first; **climb one documented rung** at a time"
  ],
  "upl": "You coordinate care, never direct it, and never tie missed visits to claim value.",
  "job": [
   [
    "Missed-visit alert arrives",
    "A-C-T same day: call John Doe",
    "Call Simulator → AI John Doe",
    "Call and note same day"
   ],
   [
    "Week 6 of care (04/07/2026)",
    "Request re-evaluation measures from provider",
    "Medical Records Requests",
    "Measures on file, or flagged"
   ],
   [
    "Barrier survives the clinical rung",
    "Notice the carrier; copy Atty. Thorne",
    "CMS → Tasks → Escalate",
    "Each rung dated in log"
   ]
  ],
  "dos": [
   "Raise **two or more missed visits** with the provider",
   "**Proofread laterality**: everything on this file is right-sided",
   "Record the disruption **the day it happens**"
  ],
  "donts": [
   "**Continuing the plan unchanged** through a crisis",
   "**Blaming the client** for a systemic delay",
   "Jumping to Atty. Thorne **before the first two rungs**"
  ],
  "theory": {
   "lead": "Mastering **the Standard Treatment Map** separates a Case Manager who observes a recovery from one who drives it; deviations trigger denials and IMEs.",
   "concepts": [
    {
     "term": "Acute and Sub-Acute Phases",
     "text": "Days 1–14: ER, imaging, initial PT, documenting causation. Weeks 2–8: active PT, specialists, **measuring functional gains**"
    },
    {
     "term": "Restorative and Maintenance Phases",
     "text": "Weeks 9–24: injections, work hardening, **barriers to return to work**. Then home exercise and as-needed visits"
    },
    {
     "term": "Maximum Medical Improvement",
     "text": "The provider's finding that further care won't improve the condition: **it closes the treatment phase** and opens pre-demand"
    },
    {
     "term": "Variance Analysis",
     "text": "When a client drifts off the map, identify why first: **clinical, psychosocial or systemic**, before funding stops"
    },
    {
     "term": "A-C-T Protocol",
     "text": "The immediate action for any red flag: Assess the danger, Coordinate the fix, Track it. **Documentation supplies counsel's why**"
    },
    {
     "term": "Reasonable and Necessary",
     "text": "The utilization-review test: common for the mechanism of injury, and **objective functional gain**, not subjective pain alone"
    },
    {
     "term": "SMART Goals",
     "text": "Specific, Measurable, Achievable, Relevant, Time-bound: goals **defensible to clinicians and adjusters** alike, like the week-6 measures"
    },
    {
     "term": "Stakeholder Triad",
     "text": "Clinical, legal and financial loops, with you as the router: **one broken loop** can stall a case for months"
    }
   ],
   "pages": [
    "D1#40",
    "D1#44"
   ],
   "framework": {
    "title": "The Standard Treatment Map",
    "kind": "table",
    "head": [
     "Phase",
     "Window",
     "Typical interventions",
     "Case Manager focus"
    ],
    "rows": [
     [
      "Acute",
      "Days 1–14",
      "ER, imaging (MRI/CT), bracing, RICE, initial PT",
      "Establishing causation and MedPay coverage"
     ],
     [
      "Sub-Acute",
      "Weeks 2–8",
      "Active PT 2–3 times weekly, specialist follow-up",
      "Functional gains; week-6 check: 20–30% better range of motion"
     ],
     [
      "Restorative",
      "Weeks 9–24",
      "Work hardening, injections, psychological adjustment",
      "Identifying barriers to return to work"
     ],
     [
      "Maintenance",
      "After week 24",
      "Home exercise program, as-needed visits",
      "Watching for the provider's MMI finding"
     ],
     [
      "MMI",
      "The endpoint",
      "The provider finds further care won't improve the condition",
      "Treatment closes; **pre-demand audit opens**"
     ]
    ],
    "note": "Deviations from the map are the main trigger for denials and IMEs; name the variance before funding stops"
   }
  }
 },
 "d2m2-a2": {
  "image": "car-transport",
  "situation": "04/08/2026: John Doe missed 04/03 and 04/07; **no visit since 04/02/2026**. Keystone ended his rental 03/19/2026, his carpool ended 04/01/2026, and **the Civic awaits parts**.",
  "steps": [
   "Assess: call John Doe **on 04/08/2026**; classify the variance",
   "Coordinate: request **a rental extension** from Keystone PD in writing",
   "Build the transport plan from one **Transportation Wall option**, saying why",
   "Track: write **the GIRP note**; report to Atty. Thorne",
   "Confirm **attendance once care resumes**"
  ],
  "deliver": "A complete A-C-T record, with **attendance confirmed 04/21 and 04/23/2026**",
  "checks": [
   "Missed visits: **04/03, 04/07, 04/09 and 04/14/2026**",
   "04/02/2026 → 04/21/2026 = **19 days**",
   "Keystone PD request: **property facts only**; 04/10/2026 refusal logged",
   "**Evening slots booked** with John Doe on the line",
   "**No treatment advice**, no talk of claim value"
  ],
  "dos": [
   "**Act the day** the alert lands",
   "Calendar **known transport risks**, like a rental's end date"
  ],
  "donts": [
   "Telling John Doe missed therapy **“will hurt your case”**",
   "Accepting **“I'll just wait”** without a plan"
  ]
 },
 "d2m2-kc": {
  "image": "knowledge-check",
  "questions": [
   "Using **the Payer Order**, explain Riverton's LOP and Summit's decline, and what you may tell each provider.",
   "Post the MedPay ledger: which visit exhausts **the $5,000.00**, and what happens to the next bill?",
   "On 04/08/2026 and 06/12/2026, place John Doe on the Standard Treatment Map and name **the Case Manager's focus**.",
   "Turn “get through his shifts” into **a SMART goal**; which objective measures show care is reasonable and necessary?",
   "Keystone cites the 2021 visits. State **the pre-morbid baseline**, its proof, the post-crash change, and Atty. Thorne's part.",
   "04/21/2026: Riverton demands **written confirmation of full payment** before John Doe's visit. What do you do, in order?",
   "In pain management, name two medication or **behavioral-health red flags**, and who hears about each."
  ]
 },
 "d2m3-l1": {
  "image": "intake-interview",
  "hook": "The gap explanation that holds up is **John Doe's own**, backed by documents.",
  "points": [
   "Investigate, don't advocate: write **questions only**, never expected answers",
   "Funnel: **open first**, closed questions last, one at a time",
   "**Never lead**: a suggested reason gets agreement, not information",
   "Record **only with his spoken consent**; protect privilege"
  ],
  "upl": "Never say what the gap does to his case; route that to Atty. Thorne.",
  "job": [
   [
    "Records show the 14-day gap",
    "Write a questions-only plan",
    "CMS → Case Notes",
    "Plan saved; no reason named"
   ],
   [
    "Call connects",
    "Consent and privacy on record",
    "Call Simulator → AI John Doe",
    "Consent before first substantive question"
   ],
   [
    "Carrier asks for Recorded Statement",
    "Refer to firm; tell Atty. Thorne",
    "CMS → Communications Log",
    "No statement without Atty. Thorne"
   ]
  ],
  "dos": [
   "**Ask open**, follow his words, close last",
   "Paraphrase back and **let him correct you**",
   "**Prevent the next gap** now; it's cheaper than explaining it"
  ],
  "donts": [
   "A question that **names the reason** you expect",
   "Reassuring or alarming him: **both are case opinions**",
   "**Blaming the client** for the gap"
  ],
  "theory": {
   "lead": "The Golden Rule: coordinate, don't commingle. The medical plan and the legal claim are **two parallel tracks** that never cross-contaminate, even in a gap interview.",
   "concepts": [
    {
     "term": "Case Manager Neutrality",
     "text": "Legal opinions in medical or call notes let the defense **impeach your neutrality**; record facts, never conclusions"
    },
    {
     "term": "Gaps as Legal Danger",
     "text": "Under A-C-T, a gap in care is **a legal danger**, not medical: it routes to Atty. Thorne"
    },
    {
     "term": "Active Listening",
     "text": "Reflect and paraphrase his words, then summarize: he **feels heard and corrects** what you got wrong"
    },
    {
     "term": "Attorney-Client Privilege",
     "text": "Confidential firm-client communication is privileged; **a third person** in the conversation can put that protection at risk"
    }
   ],
   "pages": [
    "D1#28",
    "D1#44"
   ],
   "framework": {
    "title": "The A-C-T Immediate Action Protocol",
    "kind": "flow",
    "steps": [
     {
      "label": "Assess",
      "text": "Medical danger (fever, hardware failure) → the provider today; legal danger (gaps, generic notes) → Atty. Thorne"
     },
     {
      "label": "Coordinate",
      "text": "Clarify with the provider's office, then remove the barrier the client names: transport, scheduling, referrals"
     },
     {
      "label": "Track",
      "text": "Document the flag and each fix attempt that day: **counsel's why** if a provider is dropped"
     },
     {
      "label": "Back to monitoring",
      "text": "Track feeds the next check-in: is the plan working?"
     }
    ],
    "note": "For a gap in care, Assess is already answered: a legal danger, routed to Atty. Thorne"
   }
  }
 },
 "d2m3-a1": {
  "image": "client-call",
  "situation": "03/04/2026. EMS recorded neck stiffness on 02/06/2026; urgent care on 02/20/2026 noted **onset at the MVA** and right-hand numbness since 02/18. Nobody has asked **why he waited 14 days**.",
  "steps": [
   "Open on the record: **date, participants, consent**, privacy",
   "Ask **open questions** first; closed only to pin dates, documents",
   "Ask **who he told** and what he kept",
   "Read his account back; **restate the standing instruction**",
   "File **a privileged GIRP note** the same day"
  ],
  "deliver": "**All four reasons**, in his words, on a consented, privileged recording; GIRP note filed",
  "checks": [
   "**Zero leading questions**; no reason introduced first",
   "**Four reasons in his words**: transport, soreness, coverage, numbness",
   "Corroboration: texts, **02/09–02/13 call-outs**, 02/07/2026 receipt",
   "**No opinion** on what the gap does",
   "GIRP note **filed 03/04/2026**, labelled privileged"
  ],
  "dos": [
   "**Let a pause run**; silence draws out detail",
   "Put his words **in quotation marks**"
  ],
  "donts": [
   "**Rescuing a hesitant client** with a suggested reason",
   "Ending the call without asking **who he told**"
  ]
 },
 "d2m3-l2": {
  "image": "documents-audit",
  "hook": "Records made at the time prove continuity; **a record made to order** destroys the case.",
  "points": [
   "Read every history for **mechanism, onset and body region**",
   "**Never request** a change, back-date or excuse note to order",
   "Flag conflicting histories **to Atty. Thorne**; never resolve them yourself",
   "Never hide an interruption: **show its dates**, same complaints before and after"
  ],
  "upl": "You collect, compare and flag; never tell a provider what to write.",
  "job": [
   [
    "A provider record arrives",
    "Compare mechanism, onset, body region",
    "CMS → Treatment timeline",
    "Consistent, or conflict quoted and flagged"
   ],
   [
    "Histories conflict",
    "Flag to Atty. Thorne; change nothing",
    "CMS → Tasks → Escalate",
    "Same day; no wording requests"
   ],
   [
    "Work or excuse note arrives",
    "Check signer, date, covered days",
    "CMS → Documents",
    "Every covered day matches a visit"
   ]
  ],
  "dos": [
   "Collect **what already exists** before asking for anything new",
   "**Quote records exactly**; never strengthen a history",
   "Keep **every interruption visible** on the timeline"
  ],
  "donts": [
   "A “clarify” request that **tells them what to write**",
   "**Leaving the gap out** of the timeline"
  ],
  "theory": {
   "lead": "Case Managers must understand **the why behind the paperwork**: continuity is proved by what the record already shows, never by what it is asked to say.",
   "concepts": [
    {
     "term": "Continuity of Care",
     "text": "An unbroken path along the Standard Treatment Map, each step following from the last: **the chain an adjuster tests**"
    },
    {
     "term": "Treatment Gap",
     "text": "Any break in care, before first treatment or midstream. Adjusters read it as **minor, healed or unrelated**"
    },
    {
     "term": "Records Made at the Time",
     "text": "Written by EMS, providers and employers as events happened: **strongest proof**, since nobody wrote them for the claim"
    },
    {
     "term": "Consistent Histories",
     "text": "Each provider's history repeats mechanism, onset and body region; **agreement across charts** is what makes continuity credible"
    },
    {
     "term": "Causation Opinion",
     "text": "A treating doctor's opinion linking injury to collision: **the bridge across a gap**, requested by Atty. Thorne"
    },
    {
     "term": "Record Integrity",
     "text": "A record changes only by its author's dated addendum: altering one **can be evidence tampering** or fraud"
    },
    {
     "term": "Excuse Notes",
     "text": "A work note proves only what its author saw or ordered at a visit: **unexamined days need other proof**"
    },
    {
     "term": "Generic Notes",
     "text": "Notes that don't tie complaints to the collision weaken causation: under A-C-T, **flag them to Atty. Thorne**"
    }
   ],
   "pages": [
    "D1#44",
    "D1#39"
   ],
   "framework": {
    "title": "Treatment Red Flags",
    "kind": "table",
    "head": [
     "Area",
     "Red flag",
     "What it signals"
    ],
    "rows": [
     [
      "Physical therapy",
      "Over 12 sessions with no gain; no specialist or imaging suggested",
      "A stalled plan, or care read as **over-treatment**"
     ],
     [
      "Physical therapy",
      "Passive care only: heat packs, TENS, massage, no active exercise",
      "Feel-good care that adjusters discount"
     ],
     [
      "Attendance",
      "Two or more missed appointments",
      "Defense argues the injury wasn't serious enough to treat"
     ],
     [
      "Surgery",
      "Surgery recommended before PT or injections, outside an emergency",
      "A reasonable-and-necessary challenge"
     ],
     [
      "Pain management",
      "Opioid, muscle relaxant and sedative together; doses rising, diagnosis unchanged",
      "A safety risk; treatment failing or dependency forming"
     ],
     [
      "Records",
      "Left and right switched; notes on life stress, not the collision",
      "Credibility and causation weakened"
     ]
    ],
    "note": "Under A-C-T, raise medical flags with the provider and legal flags with Atty. Thorne; you never direct care"
   }
  }
 },
 "d2m3-a2": {
  "image": "calendar-gap",
  "situation": "06/22/2026. MMI reached 06/12/2026; Dr. Reyes's **06/19/2026 Causation Letter** is in. Atty. Thorne wants **the Gap Justification Record** before the pre-demand strategy session.",
  "steps": [
   "Cover both: 14-day gap and **19-day disruption**, exact dates",
   "Pair every reason with **a dated document**",
   "Tag reasons with no document **“account only”**",
   "Write **facts and citations only**; nothing from the privileged call",
   "Run **a defense-eye pass**, then route to Atty. Thorne"
  ],
  "deliver": "A routed record of **both interruptions**, every reason beside a dated document",
  "checks": [
   "14 days, 02/06/2026 → 02/20/2026; **19 days**, 04/02/2026 → 04/21/2026",
   "Escalation quoted exactly: **“onset at MVA 02/06/2026”**",
   "Continuity: EMS report, call-outs, **06/19/2026 Causation Letter**",
   "Carpool ending and Escape in shop: **“account only”**",
   "Social media checked; **nothing deleted or advised deleted**"
  ],
  "dos": [
   "**One reason per row**, one dated document per reason",
   "Keep **the work-product layer** in the CMS"
  ],
  "donts": [
   "Justifying the 14-day gap and **forgetting the 19-day disruption**",
   "Presenting **the client's word as documented**"
  ]
 },
 "d2m3-kc": {
  "image": "knowledge-check",
  "questions": [
   "Name the **four reasons** for the 14-day gap and, beside each, its corroborating document and date.",
   "Rewrite “Was it because you had no car?” **without suggesting the reason**. What does the leading version cost?",
   "“Is this gap going to wreck my case?” Give **your exact answer**, then what you do next.",
   "Compare the 03/04/2026 call with **a Keystone Recorded Statement**: who, consent, privilege, and what the firm does.",
   "List **five continuity records** for the 14-day gap, and two things never done to strengthen the record.",
   "Riverton offers to **“add a line”** to its 04/21/2026 note explaining the missed visits. Your steps, in order?",
   "Why must the record cover **the 19-day disruption**? Give its dates, missed visits, reasons and documents."
  ]
 },
 "d2m4-l1": {
  "image": "checklist-qa",
  "hook": "Most value is won or lost here: Day 3's demands spend only **what this audit proves**.",
  "points": [
   "MMI is **a medical determination**; record it from the 06/12/2026 note",
   "BI Specials are **medical plus wages**; the Civic runs separately",
   "Show **billed beside paid**; which one to claim is Atty. Thorne's call",
   "Future care ($3,400–$6,800) stays **out of the audited total**"
  ],
  "upl": "You audit and flag; valuing, billed-or-paid and the demand figure are Atty. Thorne's.",
  "job": [
   [
    "MMI note received 06/12/2026",
    "Record MMI; open the audit",
    "CMS → Treatment timeline",
    "MMI dated from provider's note"
   ],
   [
    "Final bills and records in",
    "Build and reconcile Specials ledger",
    "CMS → Financial Ledger → Specials",
    "Medical total $14,817.40"
   ],
   [
    "Before the ask",
    "Re-verify each limit, in order",
    "CMS → Coverage Matrix",
    "$40,000, each with written source"
   ]
  ],
  "dos": [
   "**Stress-test the file** before the defense does",
   "Identify **every lien before the demand**",
   "Record **the source of every figure**"
  ],
  "donts": [
   "Sending the demand and **hoping nobody checks**",
   "**Adding future care** to the Specials",
   "Discovering a lien **after the release** is signed"
  ],
  "theory": {
   "lead": "A full pre-demand audit is **the final stress test**: the move from collecting information to using it, leaving the defense zero easy outs.",
   "concepts": [
    {
     "term": "Trinity of Case Alignment",
     "text": "Narrative, physicality and medicals **must all agree**; if one is out of line, the case value collapses"
    },
    {
     "term": "Maximum Medical Improvement",
     "text": "The provider's finding that care has reached its plateau: **the incurred Specials are complete**, and the audit can begin"
    },
    {
     "term": "Special Damages",
     "text": "Medical Bills + lost wages + Property Damage: the provable dollar loss. **Every line needs a document**"
    },
    {
     "term": "Medical and Billing Audit",
     "text": "Three passes: chronology for gaps, coding for duplicates, prior history for pre-existing conditions. **Find weak spots first**"
    },
    {
     "term": "Liens and Subrogation",
     "text": "Health plans, government payers and LOP providers may claim repayment from the recovery: **every lien shrinks the net**"
    },
    {
     "term": "Property Damage Deep Dive",
     "text": "Photos of the point of impact, estimate against final bill, supplements: **PD proves the force** behind the injury"
    },
    {
     "term": "Defense-Eye Audit",
     "text": "Read the file as the adjuster will: social media, a minor-impact (MIST) label, venue. **Name each value killer**"
    },
    {
     "term": "Policy-Limits Targets",
     "text": "Verified limits in the order they open: what each policy can pay, **not the claim's worth**"
    }
   ],
   "pages": [
    "D2#4",
    "D1#40"
   ],
   "framework": {
    "title": "The Master Audit Checklist",
    "kind": "table",
    "head": [
     "Audit area",
     "Checkpoint",
     "What to verify"
    ],
    "rows": [
     [
      "Financial and liens",
      "Special Damages",
      "Medical bills + lost wages + PD, every line documented"
     ],
     [
      "Financial and liens",
      "Lost wages",
      "Employer's wage letter plus a provider's work note; without both, usually rejected"
     ],
     [
      "Financial and liens",
      "Lien resolution",
      "**Every subrogation interest**: statutory, health plan, consensual LOP"
     ],
     [
      "Liability proof",
      "Report, witnesses, scene",
      "Final report; witness contact and statement drift; the physics possible"
     ],
     [
      "Property Damage deep dive",
      "Photos, estimates, total loss",
      "Point of impact clear; supplements show hidden structural damage"
     ],
     [
      "Medical and billing",
      "Chronology, coding, prior history",
      "Every gap explained; no duplicate codes; 5–10 years of history"
     ]
    ],
    "note": "Opened at MMI, when the incurred Specials are complete; every finding goes to Atty. Thorne, who sets the demand"
   }
  }
 },
 "d2m4-a1": {
  "image": "money-ledger",
  "situation": "Early July 2026, after MMI 06/12/2026. Medical Bills **total $15,002.40**; Riverton Spine & Rehab bills **34 lines × $185.00**; Northgate verifies 9 missed shifts at 8 h × $22.00.",
  "steps": [
   "Enter each provider's **charges, dates and payer**",
   "Reconcile Riverton Spine & Rehab's lines **against its visit notes**",
   "Total medical, **add verified wages**, show billed beside paid",
   "Put **future medical in the narrative**, not the ledger",
   "List every lien; **re-verify the three targets** in order"
  ],
  "deliver": "An **audited ledger at $16,401.40**, billed beside paid, liens, targets, flags routed",
  "checks": [
   "**05/04/2026 duplicate removed**: $6,290.00 → $6,105.00",
   "**Specials $16,401.40**: $14,817.40 medical + $1,584.00 wages",
   "**Five pre-treatment shifts flagged**, with Northgate's Attendance Record",
   "Billed-vs-paid choice **routed to Atty. Thorne**",
   "**Liens listed**: Peach State $1,860.00, LOP $6,105.00"
  ],
  "dos": [
   "**Count the visits** before adding a provider's lines",
   "Keep the **duplicate's removal visible**"
  ],
  "donts": [
   "**Totaling the statement** instead of auditing it",
   "Dropping **the paid column** because it shrinks the number"
  ]
 },
 "d2m4-l2": {
  "image": "binder-exhibits",
  "hook": "Atty. Thorne decides from your brief: lead with **the decision, not the chronology**.",
  "points": [
   "**Bottom line first**: where the file stands, what you need",
   "Facts next, **audited and sourced**; the trinity must agree",
   "Name each risk **with its answering document**, or say none",
   "Frame decisions as **questions only he can answer**"
  ],
  "upl": "Recommend on operations only; the demand, billed-or-paid and the UM timing are Atty. Thorne's.",
  "job": [
   [
    "Audit complete",
    "Draft one-page memo and exhibit index",
    "Action Plan Editor → Pre-demand brief",
    "Exhibit labels match their pages"
   ],
   [
    "Brief ready",
    "Book session; send memo ahead",
    "CMS → Calendar · Email Workspace",
    "Held before any demand drafted"
   ],
   [
    "Session held",
    "Record decisions in counsel's words",
    "CMS → Case Notes",
    "Each decision dated, attributed, tasked"
   ]
  ],
  "dos": [
   "Bring **the bad facts** yourself",
   "Find **discrepancies before the defense** does",
   "Check **public social media**; never suggest deleting"
  ],
  "donts": [
   "A summary memo that **runs to three pages**",
   "An exhibit index whose **page numbers don't match**",
   "Briefing **the initial PD estimate**, not the final figure"
  ],
  "theory": {
   "lead": "A pre-demand audit is the file's sanity check; the strategy brief carries **its findings, not conclusions**, to Atty. Thorne, who makes every call.",
   "concepts": [
    {
     "term": "Core Audit Objectives",
     "text": "Verification (facts match evidence), Valuation (every dollar justified), Risk, Compliance: **the brief reports each**"
    },
    {
     "term": "Statement Drift",
     "text": "A witness whose story changes between tellings: **drift is a defense opening**, so the brief flags it"
    },
    {
     "term": "Value Killers",
     "text": "The defense-eye audit looks for what shrinks a claim: social media, a MIST label, venue. **Counsel weighs each one**"
    },
    {
     "term": "Short-Funded Settlement",
     "text": "When the math is wrong or liens are missed, **the client takes home nothing**: lien totals belong in every brief"
    }
   ],
   "pages": [
    "D2#3",
    "D2#9"
   ],
   "framework": {
    "title": "Core Objectives of the Pre-Demand Audit",
    "kind": "list",
    "steps": [
     {
      "label": "Verification",
      "text": "Do the facts match the physical evidence: photos, the Police Report, the scene?"
     },
     {
      "label": "Valuation",
      "text": "Are damages calculated accurately: bills, wages and future care, each justified by a document?"
     },
     {
      "label": "Risk Assessment",
      "text": "Weak spots the defense will argue: comparative negligence, social media, a MIST label, venue"
     },
     {
      "label": "Compliance",
      "text": "Statutory requirements met before the demand issues, the **Statute of Limitations** first"
     }
    ],
    "note": "The audit is the file's sanity check: the brief reports each objective's findings; Atty. Thorne draws the conclusions"
   }
  }
 },
 "d2m4-a2": {
  "image": "strategy-session",
  "situation": "Early July 2026, before any demand. Your audit: MMI 06/12/2026, **Specials $16,401.40**, liens $1,860.00 and $6,105.00, targets **$10,000 → $20,000 → $10,000**. Atty. Thorne has called the strategy session.",
  "steps": [
   "Brief in protocol order: **bottom line first**",
   "Then audited facts, **risks with their documents**, decisions, options",
   "Answer challenges with **objective facts, not adjectives**",
   "Recommend only on operations; **ask for his decision** on everything legal",
   "**Read back each decision**; record and task it; re-route the plan"
  ],
  "deliver": "A recorded session and dated decision record, each **attributed to Atty. Thorne**, tasked",
  "checks": [
   "Low-speed challenge: **about 28 mph**, $2,315.00 A-pillar supplement, C5-C6 herniation",
   "Gap met **with documents, not apology**",
   "Decision recorded: **time-limited BI demand**, served 07/20/2026",
   "UM plan: **no UM demand** before a documented BI tender",
   "**No demand figure proposed**; recommendations stay operational"
  ],
  "dos": [
   "**Read back every decision** before the session ends"
  ],
  "donts": [
   "**Apologizing for the gap** instead of explaining it",
   "Leaving with **“sounds good”** instead of a decision"
  ]
 },
 "d2m4-kc": {
  "image": "knowledge-check",
  "questions": [
   "Total the specials: show the **Riverton Spine & Rehab correction**, the medical total, wage arithmetic and final figure.",
   "Who **determines MMI**, when was John Doe's, and why must the demand wait? Where does $3,400–$6,800 go?",
   "Name **the four audit objectives** and one finding each produced on this file.",
   "Run the defense-eye audit: name **four risks Keystone will raise** and the document answering each.",
   "Crescent billed $3,400.00; Peach State paid $1,860.00. Explain **billed vs paid**, what Atty. Thorne sees, why he chooses.",
   "07/20/2026: the exhibit index **still lists Riverton at $6,290.00**. Your steps, in order, and whose authority?",
   "**Draw the line**: one recommendation you may make, one decision you must leave to Atty. Thorne, and why."
  ]
 },
 "d3m1-l1": {
  "image": "demand-letter",
  "hook": "A clear, timed **$10,000 Limits Demand** makes Keystone decide on the record.",
  "points": [
   "Demand **within limits**: $10,000, Keystone's full BI limit",
   "Make **every term acceptable as written**; release Smith and Keystone only",
   "Serve certified mail AND email; **docket from receipt**: 08/21/2026",
   "Answer the 14-day gap and lead causation with the **03/13/2026 MRI**"
  ],
  "upl": "Serve and prove the demand; never set terms, extend deadlines or value the claim.",
  "job": [
   [
    "MMI declared (06/12/2026)",
    "Docket MMI + 30",
    "Docket System · CMS → Tasks",
    "07/12/2026 Sunday: work it Fri 07/10"
   ],
   [
    "Return receipt shows 07/22/2026",
    "Docket the acceptance deadline",
    "Docket System",
    "08/21/2026, from receipt, not mailing"
   ],
   [
    "Keystone writes or calls",
    "Log verbatim; route to Atty. Thorne",
    "CMS → Communications Log",
    "Same day; the CM changes nothing"
   ]
  ],
  "dos": [
   "Docket from the **return receipt date**, never the mailing date",
   "Lead with the value-drivers: the **MRI herniation** and injection",
   "The window is for **acceptance, not payment**"
  ],
  "donts": [
   "A demand with **no stated deadline** or clock trigger",
   "Leaving **the gap out of the timeline**",
   "Demanding **before MMI** or a future-care plan"
  ],
  "theory": {
   "lead": "A demand is not a request for money; it is a **presentation of a debt owed**, built on the legal and procedural foundation.",
   "concepts": [
    {
     "term": "Legal and Procedural Foundation",
     "text": "Three pillars every demand stands on: SOL, Liability Framework, Coverage Analysis. Know **the why behind the paperwork**."
    },
    {
     "term": "The Time-Limited Demand",
     "text": "A within-limits demand with a stated window: it **forces a decision on the record**; an unreasonable refusal can matter."
    },
    {
     "term": "The Why Factor",
     "text": "Every bill carries **why the treatment was necessary**: the adjuster evaluates a documented recovery, not a pile of invoices."
    },
    {
     "term": "The Final Scrub",
     "text": "Before it goes out, check for **common adjuster traps**: billing overlaps, an unexplained pre-existing condition, unverified balances."
    }
   ],
   "pages": [
    "D2#19",
    "D2#13"
   ],
   "framework": {
    "title": "Demand Best Practices",
    "kind": "list",
    "steps": [
     {
      "label": "30-Day Rule",
      "text": "At MMI the demand targets **MMI plus 30 days**; any later date is Atty. Thorne's"
     },
     {
      "label": "Photo Impact",
      "text": "Lead the demand with the most graphic photo, property damage or injury, to **set the tone**"
     },
     {
      "label": "The Why Factor",
      "text": "Every bill in the demand carries **why the treatment was necessary** for the client's recovery"
     }
    ],
    "note": "Treat the carrier like a bank that hasn't paid its bill: the demand presents a debt owed."
   }
  }
 },
 "d3m1-a1": {
  "image": "checklist-qa",
  "situation": "File date 07/20/2026. MMI reached; Specials $16,401.40. Atty. Thorne approved **$10,000 limits**, a Limited Release of Smith and Keystone, Smith's affidavit, 30 days from receipt. The draft awaits **your final audit**.",
  "steps": [
   "Audit the draft against **the Big Four** and the Final Scrub",
   "Log each deficiency as **an assigned CMS task**",
   "Assemble the package with **the gap answered** on page one",
   "Once signed, serve by **certified mail AND email**; log both",
   "Docket **08/21/2026 from the receipt** dated 07/22/2026, with reminders"
  ],
  "deliver": "An audited, served demand with **proof of delivery** and 08/21/2026 docketed",
  "checks": [
   "**$10,000 BI limit**; terms match Atty. Thorne's approval exactly",
   "Big Four complete; **Specials total $16,401.40**",
   "Gap answered **on page one**; each deficiency an assigned task",
   "Served by **certified mail AND email**; 08/21/2026 docketed",
   "Any extension request **routed to Atty. Thorne** same day"
  ],
  "dos": [
   "Re-verify **every provider balance** in the week of service"
  ],
  "donts": [
   "Counting the window **from the mailing date**",
   "Answering **Dana Whitfield's request for time** yourself"
  ]
 },
 "d3m1-l2": {
  "image": "insurance-stack",
  "hook": "The UM layers change John Doe's net, and **a technicality can lose them**.",
  "points": [
   "Host UM opens once **Keystone's 08/12/2026 tender** is documented",
   "Send the 30-Day Letters (08/13/2026) asking each to **consent or substitute**",
   "Limit the release to Smith and Keystone; **hold it until both consents**",
   "Confirm **add-on, not offset**, in writing from each carrier; $40,000 needs both"
  ],
  "upl": "Never interpret a policy or release for John Doe or tell him to sign.",
  "job": [
   [
    "Keystone tenders $10,000 (08/12/2026)",
    "Prepare 30-Day Letters for signature",
    "Consent-to-settle template · Docket System",
    "Both sent 08/13/2026; windows docketed"
   ],
   [
    "Draft release arrives (08/14/2026)",
    "Compare it with approved terms",
    "CMS → Tasks → Escalate",
    "Overbreadth flagged; John Doe signs nothing"
   ],
   [
    "Both consents in; release signed 08/28/2026",
    "Open both UM demands as tasks",
    "CMS → Tasks",
    "Carrier, claim number, adjuster on each"
   ]
  ],
  "dos": [
   "Put **exhaustion proof at the front** of each UM package",
   "Record the add-on confirmation's source: **Harbor Point, 03/02/2026**",
   "Your client's own carriers **are now adversaries**"
  ],
  "donts": [
   "Letting an **“all other … insurers” release** reach the client",
   "Promising **full UM limits** before coverage and offset are confirmed",
   "Celebrating the $40,000 gross: **success is John Doe's net**"
  ],
  "theory": {
   "lead": "UM is **the client's financial safety net**: once the at-fault policy is exhausted, first-party coverage makes up the difference, up to its limits.",
   "concepts": [
    {
     "term": "The Net Check",
     "text": "The gross settlement doesn't matter to the client; **only the net check** does, after fees and unreduced liens."
    },
    {
     "term": "BI Exhaustion",
     "text": "The at-fault carrier pays its full limit. That **pulls the contract trigger**: the UM claim becomes a second phase."
    },
    {
     "term": "Consent and Subrogation Waiver",
     "text": "The UM carrier consents and waives subrogation, or substitutes its own check: **the UM claim survives** the BI release."
    },
    {
     "term": "Front-Load the Proof",
     "text": "The at-fault Dec Page, signed release and consents up front **strip the technicality defense** on page one."
    },
    {
     "term": "First-Party Contract Claim",
     "text": "The UM carrier insures the client, so the claim shifts **from third-party to first-party**: a contract claim, yet adversarial."
    },
    {
     "term": "The Gap",
     "text": "UM doesn't simply pay its limit: it pays **the gap between damages** and what was already collected."
    },
    {
     "term": "Offset vs. Add-On",
     "text": "An offset policy subtracts the BI from its UM limit; **add-on or stacked coverage** pays on top."
    },
    {
     "term": "Relative UM as Excess",
     "text": "Relative UM answers only **above the primary layers**: the gap it pays starts where BI and Host UM end."
    }
   ],
   "pages": [
    "D3#5",
    "D3#9"
   ],
   "framework": {
    "title": "How the UM Settlement Is Calculated",
    "kind": "table",
    "head": [
     "Component",
     "How it's calculated",
     "On this file"
    ],
    "rows": [
     [
      "Total Case Value",
      "Medical bills plus pain and suffering, as Atty. Thorne values them",
      "Atty. Thorne's valuation"
     ],
     [
      "BI Settlement Received",
      "Minus the at-fault driver's maximum limit",
      "– $10,000, Keystone's full BI limit"
     ],
     [
      "UM Settlement Goal",
      "The **remaining gap**, up to the UM limit",
      "Harbor Point Host UM, up to $20,000"
     ],
     [
      "Relative UM (excess)",
      "Answers only above BI and Host UM",
      "The gap above $30,000, up to $10,000"
     ]
    ],
    "note": "An offset policy subtracts the BI from the UM limit; add-on pays on top (Harbor Point, 03/02/2026)."
   }
  }
 },
 "d3m1-a2": {
  "image": "binder-exhibits",
  "situation": "File date 08/31/2026. Keystone tendered $10,000 limits 08/12; consents came 08/24 and 08/26; the **Limited Release was signed** 08/28. Keystone's **check hasn't arrived**. Keystone had called the MRI “degenerative.”",
  "steps": [
   "Draft **Host UM to Harbor Point** for the $20,000 limit",
   "Draft **Relative UM to Cardinal State**: $10,000, excess over Host UM",
   "Put **exhaustion proof on page one**; show damages above collections",
   "Answer the gap and “degenerative” **with the MRI**",
   "**Leave the response deadline** blank for Atty. Thorne; route both"
  ],
  "deliver": "Two attorney-ready UM drafts, **exhaustion proof first**, routed for review",
  "checks": [
   "Two separate packages, **HP-26-7741 and CS-26-20355**",
   "Relative UM claimed for **damages above $30,000**",
   "**Exhaustion on page one**: tender, Dec Page, affidavit, consents, release",
   "Check copy listed **to follow, with a task**",
   "**Response deadline left blank**; nothing served"
  ],
  "dos": [
   "Give Cardinal State **the whole file**, not a cross-reference"
  ],
  "donts": [
   "**Re-sending the BI demand** with new addressees",
   "A UM demand with **no deadline** or check copy"
  ]
 },
 "d3m1-kc": {
  "image": "knowledge-check",
  "questions": [
   "State the BI demand's terms, how it was served, and **the date its window closed**. Show your count.",
   "Name **the five elements** of an answerable Time-Limited Demand, with this file's examples. Who decides bad faith?",
   "Keystone calls the MRI degenerative, citing the 14-day gap. **Which documents answer each**, and where?",
   "08/25/2026: **Cardinal State hasn't consented**; John Doe wants to sign today. Your move, and what does consent protect?",
   "Explain the $40,000 stack, what Host UM pays **under an offset form**, and why Relative UM is excess.",
   "Demand day, 07/20/2026: Dana Whitfield's auto-reply: out until 08/03, no backup. **Your steps, in order**, and whose authority?",
   "List **the page-one exhibits** of the 08/31/2026 Host UM demand, and what you do when Keystone's check arrives."
  ]
 },
 "d3m2-l1": {
  "image": "negotiation",
  "hook": "Map both attacks and their answers before the first call; **every stall becomes a record**.",
  "points": [
   "Build **the battle map** first: net floor, value drivers, attacks, rebuttals",
   "Net floor: **$12,677.63 gross**, above Keystone's $10,000 limit",
   "Anchor on **$16,401.40 total Specials**, not MedPay's $5,000",
   "Restate the approved demand and name each stall; **make no moves**"
  ],
  "upl": "Present the record, relay offers; never counter, move number or deadline, or value offers.",
  "job": [
   [
    "Keystone receives demand (07/22/2026)",
    "Build battle map; compute net floor",
    "Net Sheet · Case Notes",
    "Floor $12,677.63; attacks matched to documents"
   ],
   [
    "Adjuster calls with an offer",
    "Pause, ask her data, restate demand",
    "Call Simulator → AI Adjuster",
    "No counter; 08/21/2026 unchanged"
   ],
   [
    "Call ends",
    "Log verbatim; report to Atty. Thorne",
    "Communications Log · Escalate",
    "Logged and reported same day"
   ]
  ],
  "dos": [
   "Make the adjuster **justify her number with data**",
   "Stay **firm, factual and professional**",
   "**Personalize every answer** to John Doe's record"
  ],
  "donts": [
   "**Softening the demand** to seem reasonable",
   "Negotiating without knowing **the client's net floor**",
   "Accepting **an open-ended callback**"
  ],
  "theory": {
   "lead": "In PI law the demand letter is **your opening move**; adjusters protect the carrier by undervaluing claims, so negotiation is prepared, not improvised.",
   "concepts": [
    {
     "term": "The Pitch",
     "text": "A demand that reads like a template **gets treated like one**; a tailored presentation earns a real evaluation."
    },
    {
     "term": "Value Drivers",
     "text": "The few facts that would **scare a jury**: they create the carrier's risk, so every call leads with them."
    },
    {
     "term": "Anticipate the Response",
     "text": "Name your **top two weaknesses** before the adjuster does, and have the documents that answer them in hand."
    },
    {
     "term": "The Professional Pause",
     "text": "Silence after a low number **shifts the burden back**: the adjuster must justify the figure with data."
    }
   ],
   "pages": [
    "D2#21",
    "D2#27"
   ],
   "framework": {
    "title": "The Negotiation Battle Map",
    "kind": "flow",
    "steps": [
     {
      "label": "Create a Net Sheet",
      "text": "Total the liens, costs and attorney's fee: below that, **the client receives $0**"
     },
     {
      "label": "Identify the Value Drivers",
      "text": "List three facts that would scare a jury; every call leads with them"
     },
     {
      "label": "Anticipate the Adjuster's Response",
      "text": "Name your **top two weaknesses** and the documents that justify them"
     },
     {
      "label": "Prepare the Rebuttal",
      "text": "Have the argument ready **before they bring it up**"
     }
    ],
    "note": "Built before the first call. The CM presents the record; every move on the number is Atty. Thorne's."
   }
  }
 },
 "d3m2-a1": {
  "image": "phone-call",
  "situation": "File date 08/05/2026. Acceptance runs to 08/21/2026. Dana Whitfield **calls with $3,500**: John Doe “waited two weeks,” the MRI is “degenerative.” Atty. Thorne's authority: restate the demand, **no counter**.",
  "steps": [
   "Run **the math check on $3,500** before dialing",
   "Pause after her number; **ask what data supports it**",
   "Name each stall; answer **the gap and “degenerative”** from the record",
   "Log her exact words; **report to Atty. Thorne** the same day",
   "Draft **the 08/06/2026 rebuttal** for his approval"
  ],
  "deliver": "A call **held inside Atty. Thorne's authority**, logged offer, same-day report, drafted rebuttal",
  "checks": [
   "$3,500 **nets John Doe $0.00** after fee, costs and liens",
   "Pause used; **asked what data supports $3,500**",
   "Gap answered with **the Gap Justification Record** and dated documents",
   "“Degenerative” answered **with Dr. Park's words**",
   "**No counter**; terms and 08/21/2026 deadline unchanged"
  ],
  "dos": [
   "Have every document open; **read quotes, don't paraphrase**"
  ],
  "donts": [
   "Answering “degenerative” **with an opinion**, not the radiologist's sentence",
   "Letting a gross that **nets below zero** go unchallenged"
  ]
 },
 "d3m2-l2": {
  "image": "coverage-check",
  "hook": "John Doe's own carriers will argue against him; **prove the gap above each layer**.",
  "points": [
   "UM pays **the gap**: damages minus BI, up to its limit",
   "Check **the offset rule first**: add-on pays on top",
   "On a limits offer, **confirm terms without accepting**; report that day",
   "**Never accept verbally** under pressure: log it, escalate"
  ],
  "upl": "Assemble evidence and relay offers; never accept, reject, counter or advise settling.",
  "job": [
   [
    "UM offer received (09/14/2026)",
    "Log and report to Atty. Thorne",
    "Negotiation Log · Escalate",
    "Logged and reported 09/14/2026"
   ],
   [
    "Carrier offers its limits",
    "Confirm terms without accepting; report",
    "Email Workspace · Case Notes",
    "Acceptance only after John Doe decides"
   ],
   [
    "UM check arrives",
    "Confirm release signed; deposit same day",
    "CMS → Financial Ledger → Trust",
    "Deposited 10/05 and 10/13/2026"
   ]
  ],
  "dos": [
   "Find **every stacking and resident-relative policy**",
   "Confirm **offset status in writing** from each carrier",
   "Set UM timeline expectations; **never promise a limit**"
  ],
  "donts": [
   "Accepting the first offer because **“it's his own coverage”**",
   "A verbal settlement **with no confirming email**",
   "Finding a benefit-carrier lien **after disbursement**"
  ],
  "theory": {
   "lead": "A UM settlement is won on paper: the package shows the other driver's fault and that **damages exceed what's collected**.",
   "concepts": [
    {
     "term": "Weak File vs. Legal Trap",
     "text": "Raw charts and a casual letter carry no risk; a coded summary on a clock **raises the carrier's risk**."
    },
    {
     "term": "Documents by Function",
     "text": "The package sorts proof by job: **coverage, liability, damages**. Diagnostics and a causation narrative answer pre-existing-condition defenses."
    },
    {
     "term": "The Bracketing Technique",
     "text": "Paired ranges that **build a bridge** across a gap, then close in the middle. Atty. Thorne makes every move."
    },
    {
     "term": "PIP Set-Off",
     "text": "In no-fault states the law generally bars **double recovery**: value minus PIP paid is what the defendant still owes."
    }
   ],
   "pages": [
    "D3#8",
    "D3#7"
   ],
   "framework": {
    "title": "The UM Demand Packet Inclusions",
    "kind": "table",
    "head": [
     "Category",
     "What goes in"
    ],
    "rows": [
     [
      "Evidence of Liability",
      "Police Report, property-damage photos, witness statements, dashcam or surveillance footage"
     ],
     [
      "Economic Damages",
      "Itemized medical bills, complete medical records, lost wage verification, future medical estimates"
     ],
     [
      "Non-Economic Damages",
      "The demand letter, the client's impact statement, photos of injuries"
     ],
     [
      "Proof of Exhaustion",
      "Signed Limited Release, check copy, at-fault Dec Page, **Consent to Settle**"
     ]
    ],
    "note": "To secure a UM settlement, the package shows the other driver's fault and damages above what's collected."
   }
  }
 },
 "d3m2-a2": {
  "image": "settlement-check",
  "situation": "File date 09/14/2026. Keystone's $10,000 is in trust; UM demands went out 08/31. Marcus Bell offers **$8,000 for Harbor Point**, citing the gap and **“BI already compensated him.”**",
  "steps": [
   "Log the **$8,000 and its reasons**; report it same day",
   "Assemble **the 09/16 counter-package** for Atty. Thorne's approval",
   "Log **every later move** in the Negotiation Log",
   "Record **John Doe's decision** through Atty. Thorne, then draft the acceptance",
   "Prove **$40,000 gross** on the Recovery Ledger"
  ],
  "deliver": "A complete Negotiation Log, approved counter-package, confirming emails, Recovery Ledger at **$40,000.00 gross**",
  "checks": [
   "Offset answered with **the 03/02/2026 add-on letter**",
   "Counter-package approved, sent 09/16/2026; **no figure below limits**",
   "**Each confirming email**: coverage, release, liens, payee, check date",
   "Recovery Ledger **$40,000.00 gross**; MedPay, Keystone PD, Bluewater excluded",
   "Each UM release signed **before its check**; deposited same day"
  ],
  "dos": [
   "**Quote the carrier**; never paraphrase its reasons"
  ],
  "donts": [
   "Adding **MedPay or property-damage payments** to the gross",
   "Depositing a UM check **before its release is signed**"
  ]
 },
 "d3m2-kc": {
  "image": "knowledge-check",
  "questions": [
   "**Math-check Keystone's $3,500**: fee, costs, unreduced liens, net. What does it show, and who tells John Doe?",
   "Dana Whitfield cites the 14-Day Gap and a degenerative MRI. Answer both: **four documents** and the radiologist's words.",
   "No PIP here. What does MedPay's $5,000, **exhausted and non-subrogated**, mean for valuation? What changes where PIP applies?",
   "Why doesn't **the offset rule** cut Host UM, and why must Cardinal State's file show damages above $30,000?",
   "Name **three stall tactics** and your answer to each. What is the “Never” rule on a Limits Demand?",
   "Marcus Bell: accept $8,000 verbally or it's withdrawn. Atty. Thorne is flying. **What do you say** and log?",
   "Cardinal State tenders $10,000 (10/06/2026). What do you confirm, what does the email say, and **what precedes deposit**?"
  ]
 },
 "d3m3-l1": {
  "image": "policy-letter",
  "hook": "$40,000 isn't John Doe's until every claim is **found, classified and resolved** in writing.",
  "points": [
   "**Statutory liens bend least**; contractual claims rest on an agreement",
   "Inventory every claimant; record each **“none” with its source**",
   "**Funding decides the law**: Peach State is fully insured",
   "Common fund, fee share: **$1,860.00 – $620.00 = $1,240.00**"
  ],
  "upl": "Classify and draft; no lien is compromised without Atty. Thorne's express authority.",
  "job": [
   [
    "Gross reaches $40,000.00 (10/06/2026)",
    "Run final inventory; classify each claim",
    "Net Sheet → Lien Tracker",
    "Two liens open; every “none” sourced"
   ],
   [
    "Health Plan lien classified",
    "Get plan documents; route funding status",
    "CMS → Tasks → Escalate",
    "Fully insured; governing law his call"
   ],
   [
    "Atty. Thorne chooses the basis",
    "Draft request: doctrine named, math shown",
    "CMS → Documents → Outgoing",
    "$1,240.00 shown; held for his approval"
   ]
  ],
  "dos": [
   "Record a verified “none” **with its source and date**",
   "Name the doctrine and **show the math** in every request",
   "Resolve **every lien in writing** before disbursement"
  ],
  "donts": [
   "Treating an ERISA plan **like a provider LOP**",
   "Asking for **a “courtesy discount”** with no legal basis"
  ],
  "theory": {
   "lead": "Not all liens are created equal: **legal backing decides negotiability**, from statutory claims that bend least to provider balances that bend most.",
   "concepts": [
    {
     "term": "Medical Provider Liens",
     "text": "Providers treating on an LOP: **high negotiability**, often willing to take a reduction to get paid now."
    },
    {
     "term": "Health Insurance Subrogation",
     "text": "A private plan's reimbursement right: moderate, shaped by the **Made Whole and Common Fund** doctrines."
    },
    {
     "term": "Medicare and Medicaid",
     "text": "Government payers bound by **strict federal or state formulas**: low negotiability, and slow to process."
    },
    {
     "term": "ERISA Plans",
     "text": "Self-funded employer plans governed by federal law: **very low negotiability**, notoriously difficult to reduce."
    }
   ],
   "pages": [
    "D3#20"
   ],
   "framework": {
    "title": "Common Types of Liens",
    "kind": "table",
    "head": [
     "Lien Type",
     "Description",
     "Negotiability"
    ],
    "rows": [
     [
      "Medical Providers",
      "Doctors or hospitals treating on a Letter of Protection (LOP)",
      "**High**: often take a reduction to get paid now"
     ],
     [
      "Health Insurance",
      "Private insurers seeking subrogation",
      "Moderate: subject to the Made Whole or Common Fund doctrines"
     ],
     [
      "Medicare · Medicaid",
      "Government-funded programs",
      "Low: strict federal or state formulas; slow to process"
     ],
     [
      "ERISA Plans",
      "Self-funded employer health plans",
      "Very low: governed by federal law, notoriously hard to reduce"
     ]
    ],
    "note": "Statutory claims have stronger legal backing than contractual ones. Every compromise needs Atty. Thorne's express authority."
   }
  }
 },
 "d3m3-a1": {
  "image": "documents-audit",
  "situation": "File date 10/06/2026; **gross is $40,000.00**. Peach State **asserts $1,860.00**, its payment for the 05/15/2026 injection at Crescent Pain & Spine. Plan documents show a fully insured group plan.",
  "steps": [
   "Match **the plan's payments** to the treatment record",
   "Classify it, record funding, and **escalate governing law** to Atty. Thorne",
   "Draft the request: doctrine named, **one-third math to $1,240.00**",
   "Flag **made whole** for Atty. Thorne to argue",
   "Record **every absent claimant** as a verified “none”"
  ],
  "deliver": "A signature-ready request, absent claimants cleared, $1,240.00 recorded **once confirmed in writing**",
  "checks": [
   "Lien is **what the plan paid**: $1,860.00, not $3,400.00 billed",
   "Classified **contractual, not statutory**; fully insured recorded",
   "Math shown: **$1,860.00 – $620.00 = $1,240.00**",
   "Request held **until Atty. Thorne's written approval**",
   "Acceptance logged 10/09/2026 **only with written confirmation**"
  ],
  "dos": [
   "Audit the plan's ledger: it can carry **unrelated charges**",
   "Record **absent liens** with the same care"
  ],
  "donts": [
   "Arguing a doctrine **Atty. Thorne hasn't chosen**",
   "Logging “we'll take a third off” **as a final figure**"
  ]
 },
 "d3m3-l2": {
  "image": "lien-scale",
  "hook": "Every dollar a lien gives up **lands in John Doe's net**.",
  "points": [
   "Audit first: drop the 05/04/2026 duplicate, **negotiate from $6,105.00**",
   "Pro rata: equal-priority liens **share in proportion** to their amounts",
   "Argue **on true facts only**: a coverage-capped recovery, payment now",
   "**No Payoff Letter, no payment**; pay from the payoff figure"
  ],
  "upl": "Ask only inside Atty. Thorne's written authority; never accept outside it or promise payment.",
  "job": [
   [
    "Provider's final ledger received",
    "Audit each line; request written correction",
    "Medical Records Requests · Lien Tracker",
    "33 visits; duplicate out; $6,105.00"
   ],
   [
    "Audited balance confirmed",
    "Draft request; get written authority",
    "CMS → Documents → Outgoing",
    "Authority logged before any call"
   ],
   [
    "Reduction agreed",
    "Get signed Payoff Letter; update tabs",
    "Financial Ledger → Net Sheet",
    "Full-and-final language; net recomputed same day"
   ]
  ],
  "dos": [
   "**Corrections first**, reductions second",
   "Show John Doe **his net rising**",
   "Get **every reduction in writing** before disbursement"
  ],
  "donts": [
   "Negotiating a percentage **off an inflated bill**",
   "Agreeing to a reduction verbally with **no written confirmation**",
   "Paying **from a statement**, not the payoff figure"
  ],
  "theory": {
   "lead": "Before you ask for a discount, make sure the bill is accurate: an error earns **a demand for correction**, not a favor.",
   "concepts": [
    {
     "term": "Upcoding",
     "text": "Billing a higher service level than the records support, like **Level 5 for Level 3**: the record decides."
    },
    {
     "term": "Unbundling",
     "text": "Splitting one service into separately billed parts to **inflate the total**; the records show what was one treatment."
    },
    {
     "term": "Pro-Rata Distribution",
     "text": "Equal-priority liens split a short fund **in proportion**: each lien's amount over all liens, times what's left."
    },
    {
     "term": "The Common Fund Doctrine",
     "text": "The lienholder shouldn't get **a free ride** on the work and costs that created the fund it's repaid from."
    }
   ],
   "pages": [
    "D3#24",
    "D3#23"
   ],
   "framework": {
    "title": "Auditing the Billing to the Payoff",
    "kind": "flow",
    "steps": [
     {
      "label": "Cross-Reference",
      "text": "Records against bill: a Level 3 visit billed Level 5 is **corrected, not discounted**"
     },
     {
      "label": "Duplicate Charges",
      "text": "Look for overlapping dates, especially between hospital stays and individual physician groups"
     },
     {
      "label": "Leverage the Common Fund",
      "text": "In many states lienholders reduce by their share of fees and costs; Atty. Thorne argues it"
     },
     {
      "label": "The Payoff Letter",
      "text": "Never pay without a signed letter: **full and final satisfaction** of the lien"
     }
    ],
    "note": "Corrections first, reductions second: never negotiate a percentage off an inflated bill."
   }
  }
 },
 "d3m3-a2": {
  "image": "negotiation",
  "situation": "10/09/2026: Peach State accepted $1,240.00. Riverton Spine & Rehab's ledger bills **34 lines × $185.00 = $6,290.00**. Atty. Thorne set a written target; **no lien is paid** until resolved in writing.",
  "steps": [
   "Audit the ledger; **request a written correction** first",
   "Draft the Reduction Request; **send it once approved**",
   "Call the billing manager **inside Atty. Thorne's authority**",
   "State the audited balance, recovery and math; ask for **payment in full**",
   "When the manager agrees to $4,580.00, say **it goes to Atty. Thorne**"
  ],
  "deliver": "Audited $6,105.00, a logged call, **a signed $4,580.00 Payoff Letter**, recomputed Net Sheet",
  "checks": [
   "34 billed lines **against 33 documented visits**",
   "Correction first: **$6,290.00 – $185.00 = $6,105.00**",
   "**$4,580.00 not accepted** on the call",
   "**Signed Payoff Letter**: full and final, no balance billing",
   "Net Sheet recomputed: **net $20,359.92**"
  ],
  "dos": [
   "**Script the call** before you dial",
   "Lead with **the audit correction**"
  ],
  "donts": [
   "**Agreeing on the phone** because it sounds good",
   "A Payoff Letter **without full-and-final language**"
  ]
 },
 "d3m3-kc": {
  "image": "knowledge-check",
  "questions": [
   "**Statutory, contractual or none?** Peach State, Riverton Spine & Rehab, MedPay, Medicare/Medicaid, prior attorney. Rank liens by reducibility.",
   "Peach State is a **fully insured group plan**. Why does that matter to reducing $1,860.00, and who decides?",
   "Show the math, $1,860.00 to $1,240.00, and **name the doctrine**. How does beating the 14-Day Gap support it?",
   "BI-only illustration: how would **$6,179.92 be shared** between the two liens, and what would John Doe net?",
   "Riverton Spine & Rehab billed $6,290.00. **What do you do first**, and what figure do you negotiate from?",
   "Disbursement morning: a lawyer claims “one-third”; file shows no prior attorney. **Your steps, in order**, and whose authority?",
   "Riverton agrees to $4,580.00 on the phone. What must happen **before it's final** and a check can issue?"
  ]
 },
 "d3m4-l1": {
  "image": "cms-screen",
  "hook": "The Net Sheet shows **every dollar's origin and destination** before a cent leaves trust.",
  "points": [
   "Keep **two streams apart**: BI $10,000.00, UM $30,000.00",
   "Price **the fee per stream**: $3,333.33 + $10,000.00 = $13,333.33",
   "**Every cost needs a receipt**: $486.75, charged once",
   "Run both streams at once: **net $20,359.92**"
  ],
  "upl": "Build and explain the arithmetic; never say whether the net is enough.",
  "job": [
   [
    "Each settlement check received",
    "Post it to its stream",
    "Net Sheet → Recovery Ledger",
    "BI $10,000.00 · UM $30,000.00"
   ],
   [
    "Cost incurred",
    "Attach receipt; post it once",
    "Recovery Ledger",
    "Five receipts = $486.75"
   ],
   [
    "Both tabs complete",
    "Tie to trust; route for review",
    "CMS → Financial Ledger → Trust",
    "Net $20,359.92; Atty. Thorne reviews first"
   ]
  ],
  "dos": [
   "Every reduction carries **its reason**: audit finding or named basis",
   "Show **the streams side by side**",
   "Accurate financial detail **builds client trust**"
  ],
  "donts": [
   "**Mixing BI and UM money** on one line",
   "Charging **the same cost** to both streams",
   "A lien figure **with no Payoff Letter**"
  ],
  "theory": {
   "lead": "The Net Sheet is the tool for **transparency and case control**: it shows every dollar's origin and destination before anything leaves trust.",
   "concepts": [
    {
     "term": "Third-Party BI Stream",
     "text": "The at-fault driver's carrier; exhausting its limit is usually **a legal prerequisite** to first-party UM."
    },
    {
     "term": "First-Party UM Stream",
     "text": "The client's own or **a resident relative's policy**; triggers only once BI is exhausted or the driver is uninsured."
    },
    {
     "term": "The Double-Dipping Trap",
     "text": "Carriers audit files closely; tracing every dollar's source keeps liens paid correctly, **without cross-contaminating funds**."
    },
    {
     "term": "The Final Aggregate Net",
     "text": "Both streams side by side show the client **the compounding power** of the coverages and what negotiation added."
    }
   ],
   "pages": [
    "D3#25",
    "D3#26"
   ],
   "framework": {
    "title": "The Net Sheet: Two Recovery Streams",
    "kind": "table",
    "head": [
     "Stream",
     "Source",
     "CM Focus",
     "On this file"
    ],
    "rows": [
     [
      "Stream 1: Third-Party BI",
      "The at-fault driver's insurance company",
      "Exhaust its limit first: usually **a legal prerequisite**",
      "Keystone, $10,000"
     ],
     [
      "Stream 2: First-Party UM/UIM",
      "First-party coverage: a host vehicle's or resident relative's policy",
      "Triggers only once BI is exhausted or the tortfeasor uninsured",
      "Harbor Point $20,000 + Cardinal State $10,000"
     ]
    ],
    "note": "Track each stream separately: fee terms can differ between BI and UM, and no dollar is counted twice."
   }
  }
 },
 "d3m4-a1": {
  "image": "money-ledger",
  "situation": "File date 10/13/2026. Cardinal State's check arrived today: **$40,000.00 received**, the last hasn't cleared. Peach State accepted $1,240.00, Riverton Spine & Rehab $4,580.00. Costs $486.75. **Both tabs are half-built**.",
  "steps": [
   "Post each check **by carrier and stream**",
   "Apply **the 33⅓% fee per stream** and receipted costs",
   "Split costs and liens **25% / 75%** down to net",
   "Complete the Lien Tracker: **asserted, audited, reduced**, payoff status",
   "**Tie both tabs** to the Trust Ledger"
  ],
  "deliver": "A two-tab Net Sheet reaching **$20,359.92 both ways**, routed to Atty. Thorne",
  "checks": [
   "Pre-suit fee: **$3,333.33 + $10,000.00 = $13,333.33**",
   "Costs **$486.75, split $121.69 / $365.06**, charged once",
   "Net: **$5,089.98 + $15,269.94 = $20,359.92**",
   "MedPay and Crescent's write-off **kept off the payables**",
   "**Future ESIs flagged** to Atty. Thorne before John Doe signs"
  ],
  "dos": [
   "Compute the UM share **as the remainder** of each split"
  ],
  "donts": [
   "Marking a lien final **from an email or phone call**",
   "Adding **MedPay's $5,000.00** to the payables"
  ]
 },
 "d3m4-l2": {
  "image": "release-signature",
  "hook": "One unread line in Keystone's 08/14 draft would have **cost John Doe $30,000**.",
  "points": [
   "Read **every release line by line** before John Doe sees it",
   "BI release: **both UM consents first**, PD claim left open",
   "Deposit to IOLTA once its release is signed; **never disburse uncleared funds**",
   "Verify, document, authorize, then **reconcile to $0.00**"
  ],
  "upl": "Audit, flag, prepare, verify; never explain release clauses or sign trust checks.",
  "job": [
   [
    "Settlement agreed or tendered",
    "Request the W-9; send with release",
    "CMS → Documents → Outgoing",
    "No accounting hold on the check"
   ],
   [
    "Carrier's draft release arrives",
    "Audit terms; route a redline memo",
    "Release audit · Escalate",
    "Every over-broad line quoted, flagged"
   ],
   [
    "Settlement check received",
    "Confirm release signed; deposit same day",
    "CMS → Financial Ledger → Trust",
    "$40,000.00 deposited; cleared by 10/20"
   ]
  ],
  "dos": [
   "**Match each document** to its signer",
   "Missing paperwork: **say exactly what**, give a deadline",
   "**Cross-reference invoice numbers** before approving payment"
  ],
  "donts": [
   "A General Release that **wipes out the UM claims**",
   "Cutting checks **against uncleared funds**",
   "Paying from emailed instructions **without verifying by phone**"
  ],
  "theory": {
   "lead": "The release is **the contract that ends the dispute**; disbursement then moves money only through verification, documentation, authorization and reconciliation.",
   "concepts": [
    {
     "term": "Release of All Claims",
     "text": "The exit document that **ends the right to sue**; its scope decides which claims and carriers survive."
    },
    {
     "term": "Settlement Disclosure Statement",
     "text": "The truth document: gross to net, and that **full and final** means no return for more money."
    },
    {
     "term": "Satisfaction of Lien",
     "text": "A provider's signed letter that its lien is paid: it **prevents collections against the client** later."
    },
    {
     "term": "Dismissal With Prejudice",
     "text": "Where suit was filed, the court is told it's over; with prejudice means the case **can't be refiled**."
    }
   ],
   "pages": [
    "D2#35",
    "D3#32"
   ],
   "framework": {
    "title": "The Disbursement Workflow",
    "kind": "flow",
    "steps": [
     {
      "label": "Verification",
      "text": "Review Ready for Payment files; confirm all **conditions precedent** are met"
     },
     {
      "label": "Documentation",
      "text": "Collect invoices and receipts; ensure each is legible and matches the claim"
     },
     {
      "label": "Authorization",
      "text": "Sign-off for release: **Atty. Thorne approves and signs**; the packet goes to accounting"
     },
     {
      "label": "Reconciliation",
      "text": "Confirm receipt of funds; update the case file to reflect Paid status"
     }
    ],
    "note": "Disbursement serves accuracy, compliance and fraud prevention: no gate opens before the one before it closes."
   }
  }
 },
 "d3m4-a2": {
  "image": "settlement-check",
  "situation": "Two file dates. 08/14/2026: Keystone's draft release arrives; **UM consents still pending**. 10/21/2026: $40,000.00 cleared by 10/20, statement signed, Payoff Letters in. **Disbursement is 10/22**.",
  "steps": [
   "Part 1: audit Keystone's draft **line by line**",
   "Flag every line that reaches **past Smith, Keystone or BI**",
   "State its cost to John Doe; **route a redline memo**",
   "Part 2: **confirm every condition precedent**",
   "Queue **one command per Net Sheet line**; show $0.00"
  ],
  "deliver": "A redline memo before John Doe sees the draft; **five commands to $0.00**",
  "checks": [
   "**“All other … insurers”** quoted: $30,000 of the $40,000 stack",
   "Memo routed 08/14; **draft withheld from John Doe**",
   "Five commands **match the Net Sheet** exactly",
   "Ledger arithmetic shown, **$40,000.00 to $0.00**",
   "**None released by the CM**; all for Atty. Thorne's signature"
  ],
  "dos": [
   "**Quote the over-broad words** exactly in the memo"
  ],
  "donts": [
   "Sending the draft to John Doe **“to save time”**",
   "Queuing a command **before the funds clear**"
  ]
 },
 "d3m4-kc": {
  "image": "knowledge-check",
  "questions": [
   "Take $40,000.00 to $20,359.92 **stream by stream**: fee, costs, liens. Why the 25% / 75% split?",
   "Name **the four document sets** needed before archive, the file's item for each, and the retention period.",
   "The Trust Ledger reads $0.00 after 10/22/2026. **Which records prove it**, and what would a leftover balance mean?",
   "Write the closing memo's discrepancy note: $3,500, $8,000, $6,000 became $10,000, $20,000, $10,000. **What answered the 14-Day Gap**?",
   "No suit on Track A. When would **a dismissal** be needed, what kind, signed by whom, confirmed how?",
   "John Doe angrily forwards Crescent's $1,540.00 bill. **What do you check first**? Who's accountable? What do you say?",
   "Keystone: signed release within the hour, or no tender. Draft releases “all other … insurers.” **Your steps, in order**?"
  ]
 },
 "d4m1-l1": {
  "image": "insurance-stack",
  "hook": "One $10,000 carrier now holds **the whole $40,000 stack**; prove the impasse with dates.",
  "points": [
   "Document impasse on **its triggers**, not frustration; Atty. Thorne calls it",
   "Work the dispute path first; litigation only when **nothing moves the carrier**",
   "Never **bid against yourself**; any new number is Atty. Thorne's",
   "Filing is counsel's decision; **its inputs are yours** to verify"
  ],
  "upl": "Document the impasse and ask; never recommend suit or value the claim.",
  "job": [
   [
    "Offer repeated or deadline passes",
    "Log the trigger with proof",
    "CMS → Communications Log",
    "Every trigger dated and documented"
   ],
   [
    "Follow-ups unanswered",
    "Escalate to supervisor; no new number",
    "Email Workspace",
    "Dated; asks for written position"
   ],
   [
    "Escalation window closes unanswered",
    "Assemble impasse record for counsel",
    "CMS → Tasks → Escalate",
    "Routed with SOL and internal dates"
   ]
  ],
  "dos": [
   "Date every contact **the day it happens**",
   "Ask for the carrier's reasons and evidence **in writing**",
   "Escalate a silent adjuster **to the supervisor** first"
  ],
  "donts": [
   "Treating silence as negotiation and **waiting another month**",
   "Sending a UM demand **before BI is exhausted**",
   "Telling John Doe it “will have to go **to court**”"
  ],
  "theory": {
   "lead": "An impasse is **a stall the record proves**: the carrier holds its number after every rebuttal, follow-up and escalation, and the file reaches the litigation fork.",
   "concepts": [
    {
     "term": "The Stall",
     "text": "An adjuster's delay line, such as “waiting on authority”, meant to **wear you down**; log it, never accept it"
    },
    {
     "term": "The Rebuttal",
     "text": "Each stall gets a factual answer and a firm reply date; **a rebuttal left unanswered** becomes evidence of impasse"
    },
    {
     "term": "Reasons in Writing",
     "text": "Ask the carrier to state **its reasons in writing**; a named ground can be rebutted, a vague one cannot"
    },
    {
     "term": "The Four Elements",
     "text": "Duty, breach, causation and damages: **what any suit must prove**, so each needs a verified exhibit"
    }
   ],
   "pages": [
    "D2#29"
   ],
   "framework": {
    "title": "Common Adjuster Stall Tactics",
    "kind": "table",
    "head": [
     "The stall",
     "The rebuttal"
    ],
    "rows": [
     [
      "“I'm waiting on my manager's authority.”",
      "Set **a firm reply date**; after it, the file goes to counsel"
     ],
     [
      "“We need records from five years ago.”",
      "Ask why they matter; expect a good-faith offer on undisputed injuries now"
     ],
     [
      "“The property damage was too low for this injury.”",
      "Low-velocity impacts can still injure the spine; point to the imaging"
     ]
    ],
    "note": "Log every stall the day it happens; any new number is Atty. Thorne's to answer, never yours."
   }
  }
 },
 "d4m1-a1": {
  "image": "escalation-alert",
  "situation": "File date 09/08/2026, Track B. Keystone called $3,500 **“final” on 08/12**; the demand lapsed 08/21. Follow-ups 08/24 and 08/31 and the 09/02 escalation: **no answer**. SOL 02/06/2028.",
  "steps": [
   "Build a **dated chronology** from the 07/20/2026 demand to 09/04",
   "Tie each event to **its proof** in the Communications Log",
   "State Keystone's grounds and the **unanswered rebuttal evidence**",
   "Show the **frozen stack**, the Specials, then SOL and internal dates",
   "End with the decision needed, **framed as questions**"
  ],
  "deliver": "A dated, sourced memo to Atty. Thorne: **asks for a decision**, recommends none",
  "checks": [
   "Nine events, **07/20 to 09/04**, each tied to proof",
   "Keystone's grounds **in Keystone's words**: 14-Day Gap, “degenerative” MRI",
   "Frozen stack: **$30,000 of $40,000** unreachable behind $10,000 BI",
   "SOL 02/06/2028, internal hard date 02/04/2028, **cutoff 11/05/2027**",
   "Questions for Atty. Thorne; **no sentence recommends suit**"
  ],
  "dos": [
   "Write it so Atty. Thorne decides **in five minutes**",
   "When the escalation window closes, **escalate with what you have**"
  ],
  "donts": [
   "Waiting another follow-up cycle **instead of escalating**",
   "A memo that ends **“we should file suit”**"
  ]
 },
 "d4m1-l2": {
  "image": "legal-filing",
  "hook": "Once suit is authorized, **a court clock** replaces the adjuster's: status, fields, folders, calendar change together.",
  "points": [
   "Change status only on **Atty. Thorne's dated authorization** to sue",
   "Fill court fields from the record; **never guess a number**",
   "Build the **five litigation sub-folders** before the 09/24/2026 filing",
   "Seed the Litigation Calendar **the day status changes**"
  ],
  "upl": "Tell John Doe what happens next; what it means is Atty. Thorne's.",
  "job": [
   [
    "Atty. Thorne authorizes suit",
    "Change status; open court fields",
    "CMS → Litigation",
    "Cites dated authorization; number “Pending”"
   ],
   [
    "Status changed",
    "Build master directory and five sub-folders",
    "CMS → Documents → Litigation folders",
    "Five sub-folders, named to standard"
   ],
   [
    "Folders built",
    "Seed calendar with 48-hour audits",
    "CMS → Calendar · Docket System",
    "SOL, hard date, cutoff, audits calendared"
   ]
  ],
  "dos": [
   "Change status, fields, folders and calendar **in one sitting**",
   "Audit deadlines and exhibits; **don't just track** them",
   "Tailor the binder **to the neutral**"
  ],
  "donts": [
   "Leaving “scan001.pdf” **in a litigation folder**",
   "Treating mediation and arbitration **as the same thing**",
   "Assuming an arbitration error **can be appealed**"
  ],
  "theory": {
   "lead": "Filing the Complaint **formally initiates the lawsuit**: the file moves from negotiation to court procedure, and later to a neutral the parties select or a court appoints.",
   "concepts": [
    {
     "term": "The Complaint",
     "text": "Counsel drafts the legal arguments; the Case Manager **verifies the factual foundation** beneath them"
    },
    {
     "term": "Anatomy of a Complaint",
     "text": "Caption, jurisdiction, factual allegations, causes of action, prayer for relief: **five sections to check** against the file"
    },
    {
     "term": "Pre-Filing Verification",
     "text": "The Statute Date, the defendant's **exact legal name** and a business's Registered Agent, confirmed before counsel signs"
    },
    {
     "term": "Panel Strike List",
     "text": "AAA or JAMS sends candidates; each side vets, ranks and **strikes names** before a docketed cutoff"
    }
   ],
   "pages": [
    "D5#31",
    "D4#4"
   ],
   "framework": {
    "title": "The Complaint, Section by Section",
    "kind": "table",
    "head": [
     "Section",
     "Core function"
    ],
    "rows": [
     [
      "1 · The Caption",
      "Court name, the parties and the official case number"
     ],
     [
      "2 · Jurisdiction",
      "The legal basis for the court's authority to rule"
     ],
     [
      "3 · Factual Allegations",
      "The narrative: date, location and mechanics of the crash"
     ],
     [
      "4 · Causes of Action",
      "The legal claims asserted, such as negligence"
     ],
     [
      "5 · Prayer for Relief",
      "The explicit demand for legal remedies and money damages"
     ]
    ],
    "note": "Counsel drafts the claims; you check each section's facts against the file. The case number stays “Pending” until filing."
   }
  }
 },
 "d4m1-a2": {
  "image": "cms-screen",
  "situation": "File date 09/10/2026, Track B. On 09/09 Atty. Thorne **authorized suit** in the State Court of Riverton County, filing target **09/24/2026**. Harbor Point's UM policy has an arbitration clause.",
  "steps": [
   "Set status on the 09/09 authorization; **never guess a case number**",
   "Record the fee tier **as the retainer sets it**",
   "Build the **five litigation folders** to the firm standard",
   "Draft UM notices and preservation requests **for his approval**",
   "Seed the Litigation Calendar **with 48-hour audits**"
  ],
  "deliver": "Litigation status with every field, folder, notice and date **on Atty. Thorne's authority**",
  "checks": [
   "Status dated 09/10/2026, **citing the 09/09/2026 authorization**",
   "Case number reads **“Pending — assigned on filing”**",
   "Fee tier: 33⅓% until filing, **40% from the filing date**",
   "Notices: HP-26-7741, CS-26-20355; **no demand or figure**",
   "Filing target 09/24/2026, **48-hour audit 09/22/2026**"
  ],
  "dos": [
   "A notice to a UM carrier **is not a demand**",
   "Flag Harbor Point's **arbitration clause now**"
  ],
  "donts": [
   "Recording the 40% tier **from the status date**",
   "Calling Keystone or Robert Smith **to announce the suit**"
  ]
 },
 "d4m1-kc": {
  "image": "knowledge-check",
  "questions": [
   "What is the same as Track A, what changes 08/12/2026, and why does **one $10,000 carrier freeze $40,000**?",
   "List John Doe's impasse triggers by 09/04/2026, each with **its date and proof**.",
   "08/12: Keystone calls $3,500 “final”. Using **the “Never” rule**, what's next, and what needs Atty. Thorne's authority?",
   "What changes at transition? Name **the five sub-folders**, and where an incoming Request for Admission is filed.",
   "Compare this file's mediator and arbitrator: background, selection, **what each can decide**, and the binder.",
   "John Doe asks about taking $3,500 and the fee. What do you say, withhold, **send Atty. Thorne today**?",
   "Arbitration award short: a bill missing from your binder. **Can Atty. Thorne appeal?** How must you build binders?"
  ]
 },
 "d4m2-l1": {
  "image": "clock-deadline",
  "hook": "From 09/24/2026 the dates are set by rule, and **one mis-counted day** can end a claim.",
  "points": [
   "Count the court's way: **exclude the trigger day**, include the last",
   "Served by mail? **Add 3 days**; e-service adds nothing",
   "Forward counts roll later; **backward counts roll earlier**",
   "Docket the SOL to **internal dates**: 02/04/2028 and 11/05/2027"
  ],
  "upl": "You compute, docket and flag; which rule governs, and extensions, are Atty. Thorne's.",
  "job": [
   [
    "Scheduling Order entered 12/10/2026",
    "Enter every date; read each verb",
    "Docket System",
    "“Completed by” entered as deadline"
   ],
   [
    "Discovery mailed 12/01/2026",
    "Count 30 + 3; RFAs separately",
    "Case Docket & Calendar Conflict Resolver",
    "Responses and RFAs due 01/04/2027"
   ],
   [
    "SOL review",
    "Set internal hard date and cutoff",
    "CMS → Calendar",
    "02/04/2028 and 11/05/2027 docketed"
   ]
  ],
  "dos": [
   "Record **trigger, rule and arithmetic** on every entry",
   "Calendar **the conservative date**, and flag it"
  ],
  "donts": [
   "Counting **the trigger day** as day one",
   "Rolling a backward deadline **forward to Monday**",
   "Relying on **the SOL's weekend roll-forward**"
  ],
  "theory": {
   "lead": "Litigation is **governed by rigid procedures**: once suit is filed, statute, rule and order set the dates, and documents shift from administrative tracking to evidence.",
   "concepts": [
    {
     "term": "Documents Become Evidence",
     "text": "After filing, a missing or misfiled page is no longer clerical: it **can jeopardize a trial**"
    },
    {
     "term": "Weekly Court Processes",
     "text": "Litigation runs on recurring court processes you execute **every week**, each one driven by the calendar"
    },
    {
     "term": "Built-In Notice Periods",
     "text": "Many steps carry a built-in wait, like notice to opposing counsel **before a third-party subpoena**; docket the wait"
    },
    {
     "term": "Tracking Compliance",
     "text": "A deadline someone else owes still needs **a check-in before it**: call the records office days ahead"
    }
   ],
   "pages": [
    "D4#21",
    "D5#28"
   ],
   "framework": {
    "title": "Subpoena Issuance Process Flow",
    "kind": "flow",
    "steps": [
     {
      "label": "Draft the Subpoena",
      "text": "Fill out the court-approved Subpoena Duces Tecum, a command to produce documents"
     },
     {
      "label": "Notice to Opposing Counsel",
      "text": "Serve the defense a copy first; most states require **5 to 10 days' notice**"
     },
     {
      "label": "Formal Service",
      "text": "A process server delivers the subpoena to the facility's Registered Agent"
     },
     {
      "label": "Track Compliance",
      "text": "Call the facility's legal or records department 5 days before the deadline"
     }
    ],
    "note": "Atty. Thorne decides whether to subpoena and signs it; you draft, docket each notice period and track compliance."
   }
  }
 },
 "d4m2-a1": {
  "image": "calendar-gap",
  "situation": "12/10/2026: the Scheduling Order in No. 26-CV-04417 was entered. Discovery, including **15 RFAs**, was mailed 12/01/2026. SOL 02/06/2028. A colleague re-keyed the calendar: **unverified, no alerts**.",
  "steps": [
   "Recompute every entry **from its trigger document**",
   "Exclude the trigger day; **add 3 mail days**",
   "Move forward counts later, **backward counts earlier**",
   "Fix errors, add missing entries, **leave correct ones alone**",
   "Rank errors by risk; **route the log** to Atty. Thorne"
  ],
  "deliver": "A verified calendar and **a ranked correction log** routed to Atty. Thorne",
  "checks": [
   "Responses corrected to **01/04/2027 (Mon)**",
   "RFA entry added: **“deemed admitted if unanswered”**",
   "Expert disclosures un-swapped: **plaintiff's 03/15/2027**",
   "Mediation entered as **“completed by 03/31/2027”**",
   "Cutoff corrected **to 11/05/2027**, hard date 02/04/2028 added"
  ],
  "dos": [
   "Recompute from **the trigger document**, never the entry",
   "Mark correct entries **as verified**"
  ],
  "donts": [
   "Missing **what isn't on the screen**, like the RFAs",
   "Rolling 11/06/2027 **forward to Monday**"
  ]
 },
 "d4m2-l2": {
  "image": "mediation-table",
  "hook": "Hon. Carla Benton (Ret.) helps parties agree; **Laura Whitcomb, Esq. decides**, with almost no appeal.",
  "points": [
   "Court-ordered mediation means John Doe **must attend, not agree**",
   "Binding arbitration: **the arbitrator acts as judge**; court review is narrow",
   "Collect **3–4 windows** from everyone before contacting the mediator",
   "Golden Rule: **never argue**, speak on the record or represent John Doe"
  ],
  "upl": "Run logistics, exhibits and notes; never argue, negotiate or advise on a number.",
  "job": [
   [
    "Mediation required by 03/31/2027",
    "Collect 3–4 windows, then contact mediator",
    "Calendaring Simulators",
    "Windows logged before mediator contacted"
   ],
   [
    "Opposing counsel rejects every window",
    "Log pushback; escalate same day",
    "CMS → Tasks → Escalate",
    "Logged and escalated same day"
   ],
   [
    "Directive from the bench",
    "Log, calendar, memo Atty. Thorne",
    "CMS → Case Notes · Calendar",
    "Dated and calendared same day"
   ]
  ],
  "dos": [
   "Your hearing notes become Atty. Thorne's **post-hearing roadmap**",
   "Confirm the retainer payment **in writing**"
  ],
  "donts": [
   "A mediation-quality binder **at an arbitration**",
   "**“Helpfully” answering the arbitrator** directly",
   "Logging bench directives **the next day from memory**"
  ],
  "theory": {
   "lead": "Mediation is **negotiation toward compromise**, non-binding; arbitration is an adversarial hearing where a neutral acts as judge and issues a binding Award.",
   "concepts": [
    {
     "term": "Zero Decision Power",
     "text": "The mediator facilitates and negotiates but cannot rule; **the parties keep control** over whether to sign"
    },
    {
     "term": "Absolute Decision Power",
     "text": "The arbitrator is a private judge and finder of fact who **can exclude evidence** and award damages"
    },
    {
     "term": "Trial-Ready Standard",
     "text": "Because appeal is drastically limited, treat the hearing with **a multi-day trial's precision**, not a compromise mindset"
    },
    {
     "term": "Unauthorized Practice of Law",
     "text": "Arguing, speaking on the record or representing John Doe is practicing law; **without a license it's UPL**"
    }
   ],
   "pages": [
    "D4#5",
    "D4#20"
   ],
   "framework": {
    "title": "Extent of Decision-Making Power",
    "kind": "table",
    "head": [
     "Element",
     "Mediator",
     "Arbitrator"
    ],
    "rows": [
     [
      "Role",
      "Facilitator and negotiator",
      "Private judge and finder of fact"
     ],
     [
      "Decision authority",
      "Zero: cannot force a settlement, rule or order payout",
      "Total: issues **a binding Arbitration Award**"
     ],
     [
      "Control of the outcome",
      "The parties keep full control over whether to sign",
      "Decides liability and damages, and can exclude evidence"
     ],
     [
      "Review afterward",
      "None needed: there is no ruling",
      "Court review on narrow grounds only"
     ],
     [
      "Your standard",
      "Compromise focus",
      "Trial-ready standard"
     ]
    ],
    "note": "Court-ordered mediation compels attendance, never agreement. At both tables the Case Manager never argues or speaks for John Doe."
   }
  }
 },
 "d4m2-a2": {
  "image": "arbitration",
  "situation": "It is 04/05/2027. Keystone tendered **$10,000 BI** at mediation; Harbor Point invokes arbitration, Cardinal State joins. Hearing before Laura Whitcomb, Esq. **06/22/2027 (Tue)**; exhibits 20 days before, brief 10.",
  "steps": [
   "Build the matrix: a column each for **mediation and arbitration**",
   "Hard-code the arbitration dates today, **counting back from the hearing**",
   "Map **the UPL boundary** for the hearing",
   "Script your exact words **if asked about a bill**",
   "Route both **to Atty. Thorne**"
  ],
  "deliver": "A two-forum matrix, **dates hard-coded**, and a UPL map, routed to Atty. Thorne",
  "checks": [
   "Mediation: Hon. Carla Benton (Ret.) **facilitates only**; non-binding",
   "Arbitration: Laura Whitcomb, Esq. **acts as judge**; binding",
   "Limits: **$30,000 UM**, opened by the $10,000 BI tender",
   "Exhibits 06/02/2027; **brief 06/11/2027 (Fri)**, never 06/14/2027",
   "Deferral scripted, **document handed to Atty. Thorne**"
  ],
  "dos": [
   "Build it **for the colleague** staffing the hearing",
   "Write the deferral script and **say it aloud once**"
  ],
  "donts": [
   "A brief deadline that **lives only in an email**",
   "Treating the UM carriers **as friendly**"
  ]
 },
 "d4m2-kc": {
  "image": "knowledge-check",
  "questions": [
   "Discovery mailed 12/01/2026: compute the response date step by step. What can happen **to an unanswered RFA**?",
   "SOL 02/06/2028: give the **internal hard date and cutoff** with arithmetic. Why never rely on a weekend roll-forward?",
   "Explain **forward versus backward counting** using the 01/04/2027 deadline and the 06/22/2027 arbitration brief.",
   "From 04/05/2027, what logistics do you own before 06/22/2027? What do you log **from the bench**, when?",
   "Laura Whitcomb, Esq. asks why Riverton Spine & Rehab's bill shows 34 lines. **Your exact words**, actions, log?",
   "Counsel rejects every window, offering “a quick video mediation next Tuesday.” Order: **by 03/31/2027**. What's checked, logged, escalated?",
   "At the 06/22/2027 hearing: two things you do, two **you never do**, and who does them instead?"
  ]
 },
 "d4m3-l1": {
  "image": "binder-exhibits",
  "hook": "At the 03/18/2027 mediation Atty. Thorne has minutes: every record **in a known place**.",
  "points": [
   "Find any exhibit **in five seconds**: indexed and bookmarked",
   "**Six numbered sections** in fixed order; each document in one",
   "The CMS master index is **the single source of truth**",
   "Section 5's ledger ties **line by line** to certified invoices"
  ],
  "upl": "Build and audit; never discuss value with the mediator, Atty. Mercer or John Doe.",
  "job": [
   [
    "Mediation set for 03/18/2027",
    "Seat each document in one section",
    "CMS → Documents → Master index",
    "Section, exhibit number, Bates, source"
   ],
   [
    "Pleadings and evidence indexed",
    "Check each pleaded defense against exhibits",
    "CMS → Litigation → Pleadings Log",
    "Each defense answered or flagged"
   ],
   [
    "Binder assembled",
    "OCR, bookmark, QA; route for approval",
    "CMS → Documents → Mediation Binder",
    "Approved, delivered by 03/11/2027"
   ]
  ],
  "dos": [
   "Start from **the 07/20/2026 Demand Package**",
   "Bookmark to the page **Atty. Thorne will quote**"
  ],
  "donts": [
   "An unorganized file **the morning of the session**",
   "A snapshot sheet with **stale opposing-counsel contacts**",
   "The confidential statement sent **ten minutes before the session**"
  ],
  "theory": {
   "lead": "A Mediation Binder is **the attorney's cheat sheet**: the case's most critical documents, compiled so counsel never fumbles during a fast-paced compromise session.",
   "concepts": [
    {
     "term": "Executive Summary & Administration",
     "text": "The first thing counsel sees: a one-page snapshot that **sets the basic framework** of parties, order and schedule"
    },
    {
     "term": "The Mediation Briefs",
     "text": "Both sides' arguments **read side by side**, so counsel can prepare rebuttals before the session"
    },
    {
     "term": "Core Pleadings",
     "text": "The legal framework: the filed documents that **define what the suit is about**"
    },
    {
     "term": "Key Evidence & Liability",
     "text": "The “smoking guns”: **raw evidence of liability**, from reports to stills and highlighted deposition pages"
    },
    {
     "term": "Damages, Financials & Experts",
     "text": "The section that **justifies counsel's dollar figure**: records, bills, wage proof and expert reports"
    },
    {
     "term": "Settlement History & Drafts",
     "text": "The closing section that **prepares counsel to finalize** any deal reached, before anyone leaves the room"
    }
   ],
   "pages": [
    "D4#7",
    "D4#8"
   ],
   "framework": {
    "title": "The Six-Section Mediation Binder",
    "kind": "table",
    "head": [
     "Section",
     "What goes in"
    ],
    "rows": [
     [
      "1 · Executive Summary & Administration",
      "Snapshot sheet, mediation order or agreement, and the session schedule"
     ],
     [
      "2 · The Mediation Briefs",
      "Our confidential statement and the defense's brief, if exchanged"
     ],
     [
      "3 · Core Pleadings",
      "The operative complaint and the answer with its affirmative defenses"
     ],
     [
      "4 · Key Evidence & Liability",
      "Police report, photos and video stills, deposition summaries with highlighted pages"
     ],
     [
      "5 · Damages, Financials & Experts",
      "Medical chart and bills ledger, wage-loss proof, expert reports"
     ],
     [
      "6 · Settlement History & Drafts",
      "Negotiation log of every demand and offer, and a draft release"
     ]
    ],
    "note": "Build three sets, for counsel, the mediator and John Doe, or one OCR-searchable digital set."
   }
  }
 },
 "d4m3-a1": {
  "image": "money-ledger",
  "situation": "It is 03/04/2027; binder due **03/11/2027** for the 03/18/2027 mediation. The draft carries Riverton Spine & Rehab at **$6,290.00** and Crescent's $3,400.00 as open. Riverton's certified ledger is outstanding.",
  "steps": [
   "Build six sections from **the master index**",
   "Map every pleaded defense **to the exhibit answering it**",
   "Rebuild the ledger from certified bills **to $16,401.40**",
   "Cross-check balances **against MedPay and Peach State**",
   "Add Negotiation Log, release, consent requests; **route to Atty. Thorne**"
  ],
  "deliver": "Indexed, OCR-searchable binder with **an audited ledger**, routed to Atty. Thorne, ready by 03/11/2027",
  "checks": [
   "Riverton audited: 33 visits × $185.00 = **$6,105.00**",
   "Crescent's bill **satisfied by Peach State's $1,860.00**",
   "Open liens: $1,860.00 + $6,105.00 = **$7,965.00**",
   "Section 3: **operative pleadings only**, all three defenses listed",
   "Routed to Atty. Thorne; **nothing about value** to Atty. Mercer"
  ],
  "dos": [
   "Answer every pleaded defense **with a page**",
   "Pull **certified billing records**, not portal printouts"
  ],
  "donts": [
   "Carrying **the $6,290.00 bill** into Section 5",
   "No Negotiation Log, so **Keystone's last number** is unclear"
  ]
 },
 "d4m3-l2": {
  "image": "documents-audit",
  "hook": "An Arbitration Binder is the record **a binding award rests on**.",
  "points": [
   "Lead with **the BI exhaustion record**, never the Mediation Statement",
   "Authenticate every exhibit with **a business-records certification**",
   "Keep video native and unaltered; **print stills in color**",
   "**Nothing from the confidential mediation** crosses over"
  ],
  "upl": "Assemble, index and audit; never argue an exhibit to the arbitrator or carriers.",
  "job": [
   [
    "Arbitration invoked 04/05/2027",
    "Open exhibit index; calendar exchange, brief",
    "CMS → Litigation → Exhibit index",
    "06/02/2027 exchange, 06/11/2027 brief calendared"
   ],
   [
    "Provider records gathered",
    "Request each custodian's certification",
    "Medical Records Requests",
    "One per provider, every date covered"
   ],
   [
    "Exchange set assembled",
    "Route set and flagged items",
    "CMS → Tasks → Escalate",
    "Approved before 06/02/2027; nothing privileged"
   ]
  ],
  "dos": [
   "Build to **the strict evidence standard** anyway",
   "Request certifications **the week arbitration is invoked**"
  ],
  "donts": [
   "**A grayscale print** of a crash still",
   "A draft brief or **superseded complaint** in the set",
   "The Confidential Mediation Statement **in the Arbitration Binder**"
  ],
  "theory": {
   "lead": "The Arbitration Binder is **a trial-ready evidentiary record**, not a reference packet: it is submitted directly to a private judge who decides.",
   "concepts": [
    {
     "term": "Operational Tracks",
     "text": "Your arbitration role is operational: **timelines, scheduling and documents**, run with rigid precision"
    },
    {
     "term": "Arbitration Brief Deadline",
     "text": "The absolute cutoff for claims, **exhibit indexes and witness lists**, sent to the arbitrator and opposing counsel"
    },
    {
     "term": "Arbitration Submissions",
     "text": "The foundational paperwork that **sets the ground rules** for the whole proceeding, so it leads the binder"
    },
    {
     "term": "Evidentiary Exclusion",
     "text": "A missing page or grayscale print **can be excluded**, and a binding award leaves no second chance"
    }
   ],
   "pages": [
    "D4#25",
    "D4#21"
   ],
   "framework": {
    "title": "The Six-Tab Arbitration Binder",
    "kind": "table",
    "head": [
     "Tab",
     "What goes in"
    ],
    "rows": [
     [
      "1 · Arbitration Submissions",
      "Snapshot sheet, final brief, governing order or agreement, fee disclosures"
     ],
     [
      "2 · Arbitration Pleadings",
      "The operative demand and each party's written position; no superseded versions"
     ],
     [
      "3 · Liability & Biomechanics",
      "Certified police report, diagrams, and photos and stills in **color, never grayscale**"
     ],
     [
      "4 · Medical Damages",
      "Consolidated medical ledger, provider treatment records and bills, imaging, causation opinion"
     ],
     [
      "5 · The Prior Medical Shield",
      "Prior injury records and work history, paired with a medical opinion"
     ],
     [
      "6 · Economic Losses",
      "Wage-loss proof only: employer letters, W-2s or tax returns"
     ]
    ],
    "note": "Liens, the negotiation ledger, the tort complaint and answer stay in Atty. Thorne's set; nothing from mediation crosses over."
   }
  }
 },
 "d4m3-a2": {
  "image": "checklist-qa",
  "situation": "It is 05/17/2027. **Exchange 06/02/2027**, hearing 06/22/2027. The folder holds a pre-filing draft complaint, grayscale stills, the impasse memo and **a Lien Sheet** listing Harbor Point MedPay and Summit Imaging.",
  "steps": [
   "Sort into six tabs, **applying each QC rule** as you go",
   "Lead with **the BI exhaustion record**",
   "Number exhibits **C-1 onward** with Bates ranges; log authentication",
   "Build Tab 5's **prior medical shield**",
   "Strip liens **to what is owed**; flag privileged items for Atty. Thorne"
  ],
  "deliver": "A six-tab, C-numbered binder, authentication log and audited Lien Sheet, **routed to Atty. Thorne**",
  "checks": [
   "Threshold exhibits first, **nothing from the Mediation Statement**",
   "Tab 5 shields **the 2021 low-back visits** with answering records",
   "Doorbell stills **reprinted in color** from the native file",
   "Liens: $1,860.00 + $6,105.00 = **$7,965.00**; Crescent holds none",
   "Draft removed; **impasse memo flagged**, not exchanged"
  ],
  "dos": [
   "Apply the QC rule **the moment a document lands**",
   "Pair every damaging record **with the record answering it**"
  ],
  "donts": [
   "Conceding a reimbursement right **the carrier gave up**",
   "**An internal memo** in an exchanged set"
  ]
 },
 "d4m3-kc": {
  "image": "knowledge-check",
  "questions": [
   "Name the six Mediation Binder sections **in order**, with one document from this file for each.",
   "What does the master index record per exhibit, and why does it **outrank the printed binder**?",
   "The 11/12/2026 answer pleads John Doe was unbelted. Which section shows it, and **which exhibits answer it**?",
   "Why does the Arbitration Binder lead with **Keystone's $10,000 tender**, and exclude the Confidential Mediation Statement?",
   "What does **a business-records certification** do here, and what does a relaxed evidence rule change, or not?",
   "Crescent billed $3,400.00; Peach State paid $1,860.00. What does **the attorney's-set Lien Sheet** show, and what proves it?",
   "The evening before the 06/02/2027 exchange, Riverton's certified records stop at 04/02/2026. Your steps in order? **Who decides?**"
  ]
 },
 "d4m4-l1": {
  "image": "bottleneck",
  "hook": "Anticipate bottlenecks and clear them **before they cost a deadline**.",
  "points": [
   "Log each bottleneck **the day it starts**, with its hard date",
   "Follow up **every 5 business days**; log date, time, method, outcome",
   "Record silence as dated facts, **never “adjuster busy”**",
   "A record request unanswered **after 14 days** is a bottleneck"
  ],
  "upl": "Chase and report; never choose a remedy, discuss value or explain Keystone's silence.",
  "job": [
   [
    "A follow-up goes unanswered",
    "Log it; date the next follow-up",
    "CMS → Communications Log",
    "Date, time, method, outcome logged"
   ],
   [
    "Second follow-up goes unanswered",
    "Open a bottleneck entry",
    "Case File → Bottleneck Log",
    "Start date: first unanswered request"
   ],
   [
    "Dependency open 10 days out",
    "Red-flag it; tell Atty. Thorne",
    "Case File → Risk Flags",
    "Flag dated 03/01/2027 for 03/11/2027"
   ]
  ],
  "dos": [
   "A bottleneck found **at the deadline** was found too late",
   "Follow up **in writing** as well as by phone"
  ],
  "donts": [
   "Logging silence as **“adjuster busy”** instead of dates",
   "Stills printed **in grayscale** for a binding hearing"
  ],
  "theory": {
   "lead": "Bottlenecks come in two kinds: **compromise traps** that stall a mediation, and trial-ready landmines that can sink a binding arbitration.",
   "concepts": [
    {
     "term": "Compromise Traps",
     "text": "Unverified ledgers, absent authority and late briefs **give the defense a reason** to stall at mediation"
    },
    {
     "term": "Trial-Ready Landmines",
     "text": "Excluded exhibits, unshielded priors and missed cutoffs at arbitration **cost evidence you can't recover**"
    },
    {
     "term": "The Prior Medical Shield",
     "text": "The defense uses prior records to argue **pre-existing degenerative conditions**; the shield answers with records and expert opinion"
    },
    {
     "term": "Operational Countermeasures",
     "text": "Two habits clear most bottlenecks early: **a 48-hour audit** and lien reconciliation against EOBs"
    }
   ],
   "pages": [
    "D4#33",
    "D4#35"
   ],
   "framework": {
    "title": "Common Bottlenecks in Mediation & Arbitration",
    "kind": "table",
    "head": [
     "Forum",
     "Bottleneck",
     "What goes wrong"
    ],
    "rows": [
     [
      "Mediation",
      "Unverified ledgers & liens",
      "Unreconciled bills or missing final treatment logs make damages look unsupported"
     ],
     [
      "Mediation",
      "Missing decision-makers",
      "A representative attends without **full settlement authority**"
     ],
     [
      "Mediation",
      "Confidential brief misalignment",
      "Briefs arrive late or missing critical exhibits, stalling the mediator's preparation"
     ],
     [
      "Arbitration",
      "Evidentiary exclusions",
      "Missing documents or low-quality grayscale prints can be excluded"
     ],
     [
      "Arbitration",
      "Pre-existing defense traps",
      "Prior injury records left unshielded by an expert medical declaration"
     ],
     [
      "Arbitration",
      "Calendar & deadline misses",
      "Unsynced windows for the neutral, or a missed brief cutoff"
     ]
    ],
    "note": "Countermeasures: a 48-hour audit before every deadline, and early lien reconciliation against health-plan EOBs."
   }
  }
 },
 "d4m4-a1": {
  "image": "cms-screen",
  "situation": "File date 02/22/2027. Binder due **03/11/2027**, mediation 03/18/2027. Riverton Spine & Rehab's ledger, requested 02/08/2027, **hasn't arrived**. Keystone's representative and authority are unconfirmed.",
  "steps": [
   "Rule 1: follow-ups every 5 business days, **then 48-hour escalations**",
   "Rule 2: **no record in 14 days** → second request, subpoena flag",
   "Rule 3: open dependency **10 days out** → red flag",
   "Rule 4: **48-Hour Mandate audit** before every hard date",
   "Calibrate on Keystone, then **fire all four** on the mediation calendar"
  ],
  "deliver": "Four calibrated rules; every firing **dated, actioned and owned**",
  "checks": [
   "Calibration: Rule 1 fires **09/02/2026 and 09/04/2026**",
   "Rule 2 fires 02/22/2027: **Notice of Delay** sent",
   "Red flags **03/01/2027 and 03/08/2027**",
   "Audits **03/09/2027 and 03/16/2027**, both weekdays",
   "Subpoena flagged **as Atty. Thorne's decision**"
  ],
  "dos": [
   "Calibrate on **a known record** before trusting a rule",
   "Move a weekend audit **earlier, never later**"
  ],
  "donts": [
   "Waiting **for the perfect ledger** instead of escalating",
   "A trigger firing into **an inbox nobody owns**"
  ]
 },
 "d4m4-l2": {
  "image": "escalation-alert",
  "hook": "The ladder decides who hears; **the report decides** whether they can act in one read.",
  "points": [
   "Climb **one rung at a time**: source, supervisor, Atty. Thorne",
   "A Notice of Delay **states facts**; it never argues bad faith",
   "Every report carries **five fields**, nearest hard date first",
   "Zero defaults: ready by the hard date, marked **“Pending Final Verification”**"
  ],
  "upl": "Escalate and ask; Atty. Thorne chooses, signs and sends any legal tool.",
  "job": [
   [
    "Rung 1 unanswered on cadence",
    "Send a written Notice of Delay",
    "Email Workspace",
    "Item, start date, hard date named"
   ],
   [
    "Rung 2 unanswered 48 hours",
    "Escalate with the five-field report",
    "CMS → Tasks → Escalate",
    "Five fields; one ask per blocker"
   ],
   [
    "Weekly reporting day",
    "Send the Bottleneck Log",
    "Case File → Bottleneck Log",
    "Every item: owner, age, hard date"
   ]
  ],
  "dos": [
   "Lead the report with **the nearest hard date**",
   "Write the ask as **one decision and a date**"
  ],
  "donts": [
   "Going **straight to Atty. Thorne** before the lower rungs",
   "“Please advise” **with no dates**",
   "Letting a deadline pass **because a record was late**"
  ],
  "theory": {
   "lead": "Escalation is **a variance loop**: monitor each item against its expected course, and when progress stalls, route it up before the date is lost.",
   "concepts": [
    {
     "term": "Variance Detected",
     "text": "The moment an item **departs from its expected course**; that departure, not frustration, starts the escalation"
    },
    {
     "term": "The Escalation Ladder",
     "text": "Each problem goes to **the lowest capable rung**, so counsel's time is spent on decisions only he can make"
    },
    {
     "term": "Decision-Ready Report",
     "text": "A report built so the supervisor can **act in one read**, without redoing your research"
    },
    {
     "term": "The Critical Thinking Audit",
     "text": "Before a hard date, test the file against **the defense's stated position** and escalate any gap you find"
    }
   ],
   "pages": [
    "D1#45"
   ],
   "framework": {
    "title": "The Three-Step Escalation Protocol",
    "kind": "flow",
    "steps": [
     {
      "label": "Level 1: The Source",
      "text": "Follow up with whoever owes the item, on the cadence; log date, method and result"
     },
     {
      "label": "Level 2: Notice of Delay",
      "text": "Written notice to the supervisor or office manager: what is outstanding, since when, the hard date"
     },
     {
      "label": "Level 3: Atty. Thorne",
      "text": "Send the five-field report; a motion to compel or subpoena is **his to choose**"
     }
    ],
    "note": "Give each rung 48 hours after the second unanswered follow-up. With a hard date 10 days out, tell counsel in parallel."
   }
  }
 },
 "d4m4-a2": {
  "image": "clock-deadline",
  "situation": "Mon 05/24/2027. Exhibit exchange **06/02/2027**, brief 06/11/2027, hearing 06/22/2027. **Five problems**: Crescent's missing records, Dr. Reyes away until 06/01/2027, Cardinal State's silence, Riverton's restored duplicate, a grayscale non-OCR set.",
  "steps": [
   "Triage each: **hard date, rung**, countermeasure",
   "Write one report: **five fields, one ask** per item",
   "Send it first: items needing **Atty. Thorne's decision**",
   "Fix what you own **the same day**",
   "Date **the 48-hour audit** before the exchange"
  ],
  "deliver": "Sequenced triage of all five, and **one five-field report** sent 05/24/2027",
  "checks": [
   "All five mapped to **the 06/02/2027 exchange**",
   "Items 1–3 in **one report**, nearest hard date first",
   "Items 4 and 5 **fixed same day**, no escalation",
   "Audit **Fri 05/28/2027**: Memorial Day moves it earlier",
   "Nothing decided that is **Atty. Thorne's**"
  ],
  "dos": [
   "**Longest lead first**: send others' decisions before your fixes",
   "Protect **the exhibit exchange** first"
  ],
  "donts": [
   "Escalating the grayscale reprint **while sitting on the certification**",
   "Holding the whole exchange **for one late record**"
  ]
 },
 "d4m4-kc": {
  "image": "knowledge-check",
  "questions": [
   "Name **the three bottleneck families**, with this file's example of each and the hard date threatened.",
   "Walk Rule 1 on Keystone: follow-ups, **the 48-Hour Mandate escalation**, the hand-off to Atty. Thorne, every date.",
   "Keystone's representative arrives on 03/18/2027 **without authority to pay $10,000**. What failed earlier, and your countermeasure?",
   "Name **the three arbitration landmines** and each countermeasure before the 06/02/2027 exhibit exchange.",
   "03/09/2027: binder due in 48 hours; Riverton's ledger hasn't arrived. Your steps in order? **What don't you do?**",
   "Lakeside: 05/05/2027 request unanswered by 05/19/2027. Who hears, when? What does **the Notice of Delay** say, never say?",
   "Citing the 14-Day Gap, Teresa Okafor asks: less than limits? **What do you say**, do, log?"
  ]
 },
 "d5m1-l1": {
  "image": "courthouse",
  "hook": "An adjuster's deadline bends; **a court's does not**, so the log proves nothing slipped.",
  "points": [
   "Unserved at day 14: **escalate for Skip-Trace authority**",
   "An unanswered RFA may be **deemed admitted**; flag it red",
   "Calendar discovery the day it lands, **arithmetic in the row**",
   "Read the Answer as **a roadmap**: each defense is evidence to pull"
  ],
  "upl": "You track and draft; Atty. Thorne decides; never tell John Doe how to answer",
  "job": [
   [
    "Atty. Thorne authorizes suit",
    "Verify filing date and legal name",
    "CMS → Litigation → Pleadings Log",
    "Filed 09/24/2026, inside 02/04/2028 hard date"
   ],
   [
    "A service attempt fails",
    "Log it; escalate at day 14",
    "CMS → Tasks → Escalate",
    "Each attempt logged, date and address"
   ],
   [
    "Discovery or RFAs land",
    "Calendar; alert Atty. Thorne on RFAs",
    "CMS → Calendar · Docket System",
    "Weekend rolled; RFA alert time-stamped"
   ]
  ],
  "dos": [
   "Write **trigger, service method, arithmetic** into every entry",
   "Ask the **three baseline questions** in every interrogatory set",
   "Record John Doe's answers **in his own words**"
  ],
  "donts": [
   "A perfect Complaint filed **one day after the SOL**",
   "Letting a **court deadline** slide like an adjuster's",
   "**Counting the trigger day** as day one"
  ],
  "theory": {
   "lead": "A lawsuit is a **highly structured, court-mandated process**: miss a deadline or misfile a document, and the court can dismiss the case.",
   "concepts": [
    {
     "term": "Your Role by Phase",
     "text": "Pleadings: track service and draft files; discovery: gather data, prep the client; trial prep: **coordinate schedules, final medicals**"
    },
    {
     "term": "Documents Become Evidence",
     "text": "Once suit is filed, paperwork stops being admin tracking: a **missing or misfiled document** can jeopardize the trial"
    },
    {
     "term": "Written Discovery Tools",
     "text": "Interrogatories are written questions under oath, RFPs demand documents, RFAs demand admit or deny: all **run on strict deadlines**"
    },
    {
     "term": "The Docket Entry",
     "text": "Every filing by either side creates a docket entry, and **its clock runs** whether or not the email reached you"
    }
   ],
   "pages": [
    "D5#3",
    "D5#27"
   ],
   "framework": {
    "title": "The Litigation Lifecycle: Where You Fit In",
    "kind": "table",
    "head": [
     "Phase",
     "What happens",
     "Your role"
    ],
    "rows": [
     [
      "Pleadings",
      "File the Complaint, serve the defendant, receive the Answer",
      "Track **service timelines** and draft the initial files"
     ],
     [
      "Discovery",
      "Interrogatories, Requests for Production, depositions",
      "Calendar every response, gather the data, meet the client"
     ],
     [
      "Trial prep",
      "Expert disclosures, motion practice, trial or settlement",
      "Coordinate schedules and update the final medicals"
     ]
    ],
    "note": "Discovery is where you spend most of your litigation time; every phase runs on the court's deadlines, not an adjuster's."
   }
  }
 },
 "d5m1-a1": {
  "image": "data-entry",
  "situation": "01/05/2027: the Pleadings Log for 26-CV-04417 was never reconciled to the calendar. The **15 RFAs** have no row; **their 01/04/2027 deadline** passed. A 01/04/2027 Certificate of Service sits unlogged.",
  "steps": [
   "Add every missing row; **recompute each response date** with arithmetic",
   "File each document in its **numbered sub-folder** under the convention",
   "Calendar the **Scheduling Order's six dates**",
   "**Prove RFA compliance** from the Certificate of Service",
   "Record both misses honestly; **report them to Atty. Thorne** today"
  ],
  "deliver": "A **corrected, source-linked log** and calendar, RFA compliance proved, misses reported the same day",
  "checks": [
   "Interrogatories and RFPs corrected **from 12/31/2026 to 01/04/2027**",
   "RFA row (15) added with a **red deemed-admission flag**",
   "**Certificate of Service** logged, its 01/04/2027 date checked",
   "Escalated to Atty. Thorne 01/05/2027; **no call to Atty. Mercer**",
   "Late filings **logged as misses**, not back-dated"
  ],
  "dos": [
   "**One row per discovery set**, so no deadline hides",
   "Link every row to **its source document**"
  ],
  "donts": [
   "**Quietly fixing a passed deadline** instead of telling Atty. Thorne",
   "Forgetting **the 3 mail days**, or adding them to e-service"
  ]
 },
 "d5m1-l2": {
  "image": "checklist-qa",
  "hook": "The Scheduling Order's **dates are absolute**; the checklist and KPIs keep every task ahead.",
  "points": [
   "Give every order date **30-, 14- and 7-day alerts**",
   "Confirm every extension **in writing**, over Atty. Thorne's signature",
   "Defense reaches John Doe: end it, **tell Atty. Thorne that day**",
   "Prepare **the process, never the testimony**"
  ],
  "upl": "You schedule, assemble, track and relay; never agree an extension or coach testimony",
  "job": [
   [
    "Scheduling Order entered 12/10/2026",
    "Calendar six dates, three alerts each",
    "CMS → Calendar · Docket System",
    "18 alerts; order in 01_PLEADINGS"
   ],
   [
    "Extension agreed by phone",
    "Draft confirmation for Atty. Thorne's signature",
    "Email Workspace · CMS → Calendar",
    "Sent the same day"
   ],
   [
    "Deposition noticed",
    "Book reporter, link, technology check",
    "CMS → Calendar · Communications Log",
    "Packet sent by 02/11/2027"
   ]
  ],
  "dos": [
   "Call every litigation client **at least every 30 days**",
   "Subpoena only **the witnesses Atty. Thorne names**",
   "Put the subpoena audit on a **recurring 10-day reminder**"
  ],
  "donts": [
   "A **phone-only extension**",
   "Trial binders built from **the pre-lit records**",
   "Sending the prep packet **the day before**"
  ],
  "theory": {
   "lead": "Trial preparation is the stage where you **compile the final puzzle pieces**, so the attorney walks into court fully armed.",
   "concepts": [
    {
     "term": "Discovery: The Heavy Lifting",
     "text": "Both sides must lay their cards on the table; it is where Case Managers spend **most of their litigation time**"
    },
    {
     "term": "The Deposition",
     "text": "An oral interview under oath, recorded by a court reporter; you own **the logistics, not the testimony**"
    },
    {
     "term": "The Final Run",
     "text": "Litigation can take 1 to 3 years, so records and bills are rerun to show **the total cost** of injury"
    },
    {
     "term": "The Weekly KPI Audit",
     "text": "Measurable checks you audit weekly, like a server assigned within 48 hours, so a slipping file **shows before it fails**"
    }
   ],
   "pages": [
    "D5#7",
    "D5#5"
   ],
   "framework": {
    "title": "Phase 3: Trial and Mediation Preparation",
    "kind": "list",
    "steps": [
     {
      "label": "The Final Run",
      "text": "Litigation can take 1 to 3 years: rerun records from **every provider**, never the pre-lit package"
     },
     {
      "label": "Subpoena Management",
      "text": "Draft trial subpoenas for the witnesses Atty. Thorne names, so they legally appear"
     },
     {
      "label": "Trial Binder Organization",
      "text": "Exhibits from the litigation file, indexed and tabbed for the attorney at the counsel table"
     }
    ],
    "note": "The Scheduling Order sets every date: pin it to the front of the file, with 30-, 14- and 7-day alerts."
   }
  }
 },
 "d5m1-a2": {
  "image": "calendar-gap",
  "situation": "01/20/2027: John Doe's **deposition notice** arrived for 02/18/2027. The trial-prep checklist was never reconciled to **the 12/10/2026 order**; there is no KPI tracker.",
  "steps": [
   "Audit each line against the order: **right date, owner, three alerts**",
   "Add the 02/18/2027 **deposition logistics and prep documents**",
   "Build the tracker: **nine KPIs**, formula, target, sourced reading, status",
   "Set one task per **review lens**: coverage, treatment, liability",
   "Name **the two items** you route to Atty. Thorne first, and why"
  ],
  "deliver": "A checklist matching **the order date for date**, and a complete KPI tracker",
  "checks": [
   "Our expert disclosure corrected **from 04/15/2027 to 03/15/2027**",
   "Mediation recorded as **completed by 03/31/2027**",
   "Records subpoena returns land **before discovery closes 05/28/2027**",
   "Final records run **re-sourced from every provider**",
   "RFA Priority Check and 48-Hour Docket Rule: **both missed**"
  ],
  "dos": [
   "Every KPI is **a formula with a target**",
   "**Prepare the documents**, not the testimony"
  ],
  "donts": [
   "Scheduling discovery work **after the discovery cutoff**",
   "Accepting the Answer's liability story **without pulling the evidence**"
  ]
 },
 "d5m1-kc": {
  "image": "knowledge-check",
  "questions": [
   "Discovery mailed 12/01/2026: compute the **response date**. What changes for e-service, and why confirm the court's rule?",
   "Name the Answer's **three defenses** and the file evidence you would pull for Atty. Thorne against each.",
   "File the affidavit, 12/01/2026 RFAs and scheduling order: **where, under what names**? What happens to the order's dates?",
   "Define **three litigation KPIs** as formulas with targets; give this file's reading for one, with its source.",
   "On 01/20/2027, name one litigation task under each **review lens** (coverage, treatment, liability) and whose decision it feeds.",
   "Atty. Mercer's office wants **two more weeks** on Smith's responses, “just note it.” Your steps, on whose authority?",
   "01/15/2027: John Doe says a **Keystone investigator** called and he answered. Your steps, in order, on whose authority?"
  ]
 },
 "d5m2-l1": {
  "image": "repair-shop",
  "hook": "The Civic is pleaded now: **every figure gets tested**, and its dates explain the 14-Day Gap.",
  "points": [
   "Make the owner whole: **never a windfall**",
   "$9,255.00 is 52.6% of the ACV, under 75%: **repairable, $3,945.00 to spare**",
   "Claim only **the 48 unpaid days**: 48 × $42.00 = $2,016.00",
   "Keep loss-of-use and gap records **identical, date for date**"
  ],
  "upl": "Compute, document and report; never tell John Doe what his car is worth",
  "job": [
   [
    "Final repair bill posts",
    "Re-run total-loss check on $9,255.00",
    "CMS → Property Damage",
    "52.6% of $17,600.00 recorded"
   ],
   [
    "Rental ends, Civic still in shop",
    "Log each day without a vehicle",
    "CMS → Property Damage",
    "12 + 36 = 48 days"
   ],
   [
    "Deposition noticed 01/20/2027",
    "Add the PD severity set",
    "CMS → Documents → Deposition set",
    "Indexed before the 02/04/2027 prep"
   ]
  ],
  "dos": [
   "Run the threshold on **the final bill**",
   "Use Keystone's own **$42.00 rental rate**"
  ],
  "donts": [
   "Claiming **the 30 paid rental days** again",
   "Treating Property Damage as **“just the car”**"
  ],
  "theory": {
   "lead": "Property damage is **a cornerstone of civil litigation**: the law's mechanism for making an owner financially whole after negligence harms their property.",
   "concepts": [
    {
     "term": "PD Cuts Both Ways",
     "text": "In suit, PD can be **definitive evidence of injury** or the defense's most formidable tool against it"
    },
    {
     "term": "Special vs. General Damages",
     "text": "Special damages are quantifiable losses; general damages are subjective. Every PD figure is special, **proved by documents**"
    },
    {
     "term": "Valuation Is Contested",
     "text": "How much the defendant owes is among the **most heavily litigated** PD questions, so courts apply set formulas"
    },
    {
     "term": "Diminution in Value",
     "text": "Pre-loss market value minus post-loss value; the **lesser-of rule** weighs it against repair cost, capping a Total Loss"
    }
   ],
   "pages": [
    "D5#39",
    "D5#40"
   ],
   "framework": {
    "title": "Types of Damages You Can Recover",
    "kind": "table",
    "head": [
     "Type of damage",
     "What it covers",
     "On a PD claim"
    ],
    "rows": [
     [
      "Economic (special)",
      "Quantifiable financial losses, **proved by documents**",
      "Repair, tow and storage, rental, Loss of Use, Diminished Value"
     ],
     [
      "Non-economic (general)",
      "Subjective losses: pain and suffering, emotional distress, loss of consortium",
      "Claimed on the injury side, not the property side"
     ],
     [
      "Punitive (exemplary)",
      "Punishes egregious, reckless or intentional misconduct and deters others",
      "Conduct such as DUI; none is pleaded on this file"
     ]
    ],
    "note": "The goal is not a windfall: restore the owner to the financial position held before the incident."
   }
  }
 },
 "d5m2-a1": {
  "image": "money-ledger",
  "situation": "12/2026: RFPs ask for every PD document, **due 01/04/2027**. The PD screen tests Total Loss on the $6,940.00 estimate and claims **78 days, $3,276.00**. Keystone offers $0 for Loss of Use.",
  "steps": [
   "Re-run the total-loss check on **the final repair**",
   "List what to verify in **Keystone's Valuation Report**",
   "Rebuild Loss of Use **day by day**, each day once",
   "Evidence each period; **index the severity set**",
   "Flag Keystone's two arguments for Atty. Thorne, **without answering them**"
  ],
  "deliver": "A corrected PD worksheet: repairable at 52.6%, **48 days, $2,016.00 claimed**, defenses flagged",
  "checks": [
   "**$9,255.00 is 52.6%** of $17,600.00: repairable",
   "Stale 39.4% check corrected **with a dated note**",
   "78 days allocated once: **12 + 30 + 36**",
   "Loss of Use corrected to **48 × $42.00 = $2,016.00**",
   "Escalated to Atty. Thorne **on or before 12/28/2026**"
  ],
  "dos": [
   "Evidence each period, **not just the total**",
   "Correct with a dated note; **never overwrite the history**"
  ],
  "donts": [
   "Arguing **“shop delay” with the adjuster** yourself",
   "Producing a worksheet that **still says $3,276.00**"
  ]
 },
 "d5m2-l2": {
  "image": "negotiation",
  "hook": "$792.00 is a formula, $3,600.00 a market appraisal: **you build the evidence**.",
  "points": [
   "Diminished Value is **market value lost** after a proper repair",
   "Keystone's “17c” is **a carrier formula**, not a legal measure",
   "The 10% cap: **never above $1,760.00**, however severe the damage",
   "PD settles only on a **property-damage-only release** Atty. Thorne reviewed"
  ],
  "upl": "Calculate, critique and recommend; never make, accept, reject or counter a PD figure",
  "job": [
   [
    "Keystone states diminished-value figure",
    "Draft input request for Atty. Thorne",
    "CMS → Property Damage → Correspondence",
    "Base, multipliers, ACV on file"
   ],
   [
    "Appraisal received 05/06/2026",
    "Audit method, data, credentials",
    "CMS → Property Damage",
    "Audit note dated; appraisal indexed"
   ],
   [
    "Keystone sends a release or check",
    "Hold it; route to Atty. Thorne",
    "CMS → Tasks → Escalate",
    "Reviewed before John Doe sees it"
   ]
  ],
  "dos": [
   "Make Keystone show **its formula's inputs in writing**",
   "Put **the critique on paper** for Atty. Thorne"
  ],
  "donts": [
   "Telling John Doe his car **“lost $3,600.00”**",
   "A PD release that **reaches the injury claim**",
   "Promising **sentimental-value recovery** the law won't award"
  ],
  "theory": {
   "lead": "The law measures property at **fair market value**, so what a repaired car still loses is a market loss, proved with market evidence.",
   "concepts": [
    {
     "term": "Market Value, Not Sentiment",
     "text": "Standard law values property at market; special value to an owner is **an exception, not the rule**"
    },
    {
     "term": "Formula Versus Market",
     "text": "A carrier formula is claims practice, **not a legal measure**; an appraisal built on market data tests it"
    },
    {
     "term": "The Written Basis",
     "text": "Get the carrier's position and inputs in writing: only **a basis on paper** can be answered with stronger evidence"
    },
    {
     "term": "Subpoena Duces Tecum",
     "text": "In suit, a Subpoena Duces Tecum **compels a non-party's records**; a blanket request invites a Motion to Quash"
    }
   ],
   "pages": [
    "D5#41",
    "D5#35"
   ],
   "framework": {
    "title": "Calculating the Value of the Claim",
    "kind": "table",
    "head": [
     "Measure",
     "How courts apply it",
     "Its limit"
    ],
    "rows": [
     [
      "The lesser-of rule",
      "The lesser of repair cost or the drop in market value",
      "Costs more to fix than it was worth: a Total Loss"
     ],
     [
      "Diminished Value",
      "Market value a car still loses after a proper repair",
      "Many courts add it to repair, kept under pre-loss value"
     ],
     [
      "Special value",
      "No market (an heirloom): some courts use actual value to the owner",
      "Sentimental value is still excluded: **an exception, not the rule**"
     ]
    ],
    "note": "Every measure starts from fair market value; confirm the governing rule with Atty. Thorne."
   }
  }
 },
 "d5m2-a2": {
  "image": "phone-call",
  "situation": "12/10/2026: Leah Moran (Keystone PD) says **$792.00 and $0 final**, sends an **“all claims” release** for John Doe, and asks if he'll take it. Atty. Thorne wants your recommendation.",
  "steps": [
   "Rebuild Keystone's “17c” figure from **the $17,600.00 ACV**",
   "Critique its **10% cap and both multipliers**",
   "Set out claimed against offered; recommend **a top and a floor**",
   "Answer Leah Moran **without accepting, rejecting or countering**",
   "Route the release; send the range **to Atty. Thorne for authority**"
  ],
  "deliver": "A one-page PD memo: **a recommended range**, release flagged, routed to Atty. Thorne",
  "checks": [
   "“17c” rebuilt: **$1,760.00 × 0.75 × 0.60** = $792.00",
   "Dispute totalled: **$5,616.00 claimed** against $792.00 offered",
   "Floor **sits above $792.00**; weakest item named",
   "Release flagged; **nothing sent to John Doe** to sign",
   "Leah Moran told only the **offer is with Atty. Thorne**"
  ],
  "dos": [
   "Recommend with arithmetic: every number **traces to a document**"
  ],
  "donts": [
   "Telling Leah Moran **“we'd probably take”** any figure",
   "Forwarding **Keystone's release to John Doe**"
  ]
 },
 "d5m2-kc": {
  "image": "knowledge-check",
  "questions": [
   "Is the Civic a **Total Loss**? Show the final repair, ACV, Keystone's threshold and percentage, with the arithmetic.",
   "Allocate **the 78 days**: which are claimed, at what rate, for how much? Why exclude rental days?",
   "Name **the three damage types**; place repair, Loss of Use, Diminished Value. Punitive damages require what conduct?",
   "Rebuild Keystone's $792.00 and give **three reasons** the “17c” formula understates John Doe's Diminished Value.",
   "State **the lesser-of rule**; with the make-whole principle, show repair plus Diminished Value doesn't over-compensate John Doe.",
   "Atty. Mercer's office wants the Civic inspected and $792.00 accepted **by 5 p.m. today**. Your steps, whose authority?",
   "How does the PD record help Atty. Thorne against **the 14-Day Gap**? Where does your role stop?"
  ]
 },
 "d5m3-l1": {
  "image": "deposition-video",
  "hook": "Atty. Thorne prepares the substance; you prepare **the person and the setting**.",
  "points": [
   "Audit for landmines **before 02/04/2027**; route them to Atty. Thorne",
   "Alignment comes from **reviewing records with Atty. Thorne**, never a script",
   "Three pillars: **de-escalate, guidelines, dress and demeanor**",
   "Test with John **on 02/16/2027**: same device, same room"
  ],
  "upl": "Run the process; never tell John what to say. Substance goes to Atty. Thorne",
  "job": [
   [
    "Notice served 01/20/2027",
    "Calendar sessions, packet, day-before checklist",
    "Docket System · CMS → Calendar",
    "02/04, 02/11, 02/16, 02/17, 02/18/2027 calendared"
   ],
   [
    "Test call, 02/16/2027",
    "Technology check on John's device",
    "CMS → Case Notes",
    "Each item logged pass or fail"
   ],
   [
    "Day before, 02/17/2027",
    "Confirm with all three; finalize exhibits",
    "Email Workspace · CMS → Documents",
    "Three confirmations logged"
   ]
  ],
  "dos": [
   "**Consistency is credibility**: records, answers and testimony agree",
   "Give **the dress-code talk** to every client",
   "**Calm clients** give shorter, more accurate answers"
  ],
  "donts": [
   "Calming him **with a prediction**, not the process",
   "Letting John be surprised by **his 2021 chiropractic records**",
   "Over-coaching until **John sounds rehearsed**"
  ],
  "theory": {
   "lead": "A deposition can shape a litigated case's outcome: the attorney owns the legal strategy, while you prepare the client **operationally and psychologically**.",
   "concepts": [
    {
     "term": "The Landmine Audit",
     "text": "Before any prep meeting, review the file for **what the defense will exploit**, so Atty. Thorne meets it first"
    },
    {
     "term": "Consistency Is Credibility",
     "text": "The defense compares testimony with signed answers and records; any mismatch **reads as concealment**, so counsel sees it first"
    },
    {
     "term": "The Courtroom Drama Myth",
     "text": "Clients expect a TV courtroom drama; showing **the real, ordinary process** calms them without any prediction"
    },
    {
     "term": "The Evaluation Report",
     "text": "Defense counsel reports to the carrier how the client will strike a jury: **presentation feeds that report**"
    }
   ],
   "pages": [
    "D5#9",
    "D5#10"
   ],
   "framework": {
    "title": "Preparing Your Client for a Deposition",
    "kind": "flow",
    "steps": [
     {
      "label": "Pre-deposition audit",
      "text": "Prior medical history, signed answers, public social media: landmines routed to Atty. Thorne"
     },
     {
      "label": "Pillar 1: De-escalate",
      "text": "No judge, no jury, no shouting: calm the client with **the process**, never a prediction"
     },
     {
      "label": "Pillar 2: Testimony guidelines",
      "text": "Pause, tell the truth, stop once answered: drilled on neutral questions only"
     },
     {
      "label": "Pillar 3: Dress and demeanor",
      "text": "Business casual, nothing flashy; limitations told plainly, never minimized or exaggerated"
     },
     {
      "label": "Technology check",
      "text": "A computer, camera at eye level, light in front, a quiet private room"
     },
     {
      "label": "The day before",
      "text": "Confirm date, time and link with the client, Atty. Thorne and the court reporter"
     }
    ],
    "note": "Atty. Thorne prepares the substance; you prepare the person and the setting."
   }
  }
 },
 "d5m3-a1": {
  "image": "client-call",
  "situation": "02/04/2027: John, reached through Margaret yesterday, has **a new number**. He's anxious about his **02/18/2027 video deposition**, expecting a TV cross-examination. You run the first segment; Atty. Thorne takes the substance after.",
  "steps": [
   "Confirm his **new number**, with Margaret as backup",
   "Confirm logistics and **a 02/16/2027 test call**",
   "Deliver **the three pillars** and in-room rules; drill the pause",
   "Answer no substance: log each question **in his words**",
   "Have **Atty. Thorne's gap set** ready to share"
  ],
  "deliver": "A delivered segment, a logistics record, and **substantive questions routed** in John's words",
  "checks": [
   "Logistics exact: **02/18/2027, 10:00 a.m.**, Riverton Court Reporting",
   "Pause drilled **on neutral questions only**",
   "All five substantive questions **routed, not answered**",
   "Pillar 1 explained; **no outcome predicted**",
   "**No script** or suggested wording given to John"
  ],
  "dos": [
   "**Answer the process**; route the substance"
  ],
  "donts": [
   "**The helpful half-answer**; it is a script",
   "Promising John **an outcome** to calm him"
  ]
 },
 "d5m3-l2": {
  "image": "deposition-video",
  "hook": "Atty. Mercer doesn't need John to lie: **a hurried “yes”** does the damage.",
  "points": [
   "Rule 1 is **the absolute truth**; prior injuries test honesty",
   "**Pause two full seconds**; answer in words; never guess",
   "“Is that all?”: **the record, not memory**, is the full list",
   "John stops for an objection, then answers **unless instructed not to**"
  ],
  "upl": "Explain the rules and objections; never tell John how to answer a trap",
  "job": [
   [
    "Answer served 11/12/2026",
    "Map each defense to predicted questions",
    "Deposition prep log",
    "Each defense mapped to a trap"
   ],
   [
    "Trap map complete",
    "Confirm records in Atty. Thorne's set",
    "CMS → Documents",
    "EMS, MRI, Causation Letter, EDR present"
   ],
   [
    "John asks how to answer",
    "Log in his words; route it",
    "CMS → Tasks → Escalate",
    "Routed same day; no wording offered"
   ]
  ],
  "dos": [
   "**Silence is safe**; rambling is not",
   "Explain objections **ahead of time** so John doesn't freeze"
  ],
  "donts": [
   "A “yes” to **a list from memory**",
   "A client who **argues with defense counsel**",
   "Preparing only the crash mechanics, **missing the medical history**"
  ],
  "theory": {
   "lead": "The defense's goal is to make the client **contradict, lose temper or exaggerate**, damaging credibility; general rules protect it, a script cannot.",
   "concepts": [
    {
     "term": "Wide-Open Questioning",
     "text": "Defense counsel may ask a very broad range of questions to discover the facts: **wide questions are normal**, not attacks"
    },
    {
     "term": "Estimate Versus Guess",
     "text": "An estimate rests on what you perceived; a guess claims what you couldn't know: **only the estimate** is honest testimony"
    },
    {
     "term": "Information Gathering, Not Battle",
     "text": "A deposition gathers facts for the defense's evaluation; nothing is won there, so **the smallest target** protects the case"
    },
    {
     "term": "The Objection's Purpose",
     "text": "An objection is **a formal flag** on the record protecting the witness, not a sign of trouble"
    }
   ],
   "pages": [
    "D5#16",
    "D5#17"
   ],
   "framework": {
    "title": "The 7 Golden Rules for Testifying",
    "kind": "table",
    "head": [
     "Rule",
     "What it says",
     "Why it protects"
    ],
    "rows": [
     [
      "1",
      "Always tell the absolute truth",
      "A damaged case can be saved; **a lied-about one cannot**"
     ],
     [
      "2 · 3",
      "Pause two full seconds, then answer in words",
      "Time to think, a clean transcript, a window to object"
     ],
     [
      "4 · 5",
      "Never guess; answer only what was asked, then stop",
      "“I don't know” is a complete answer: the smallest target"
     ],
     [
      "6 · 7",
      "Hold the silence; don't try to win",
      "A deposition gathers information; the legal battle is Atty. Thorne's"
     ]
    ],
    "note": "Questions fall into four categories: background, crash mechanics, medical history, daily life. Clients underreport medical history most."
   }
  }
 },
 "d5m3-a2": {
  "image": "checklist-qa",
  "situation": "02/16/2027, the second prep session: Atty. Thorne runs a mock cross-examination. AI Mercer questions AI John; **your microphone is muted**. Atty. Thorne **debriefs from your log**.",
  "steps": [
   "Open the Trap Log; **start the clock** at the first question",
   "Log time, **exact words**, category, trap type and rules",
   "Put **the record fact and source** beside every mischaracterisation",
   "Log each objection and **whether John stopped talking**",
   "**Coach nothing**; route the log to Atty. Thorne"
  ],
  "deliver": "A **timestamped Trap Log**, scored against the seven golden rules, routed before the debrief",
  "checks": [
   "All **six assigned traps** logged",
   "Gap entry: **14 days**, 02/06/2026 to 02/20/2026",
   "“Degenerative” entry cites **the 03/13/2026 MRI** report",
   "Seatbelt entry cites **the EMS report and EDR**",
   "**No coaching**: no signal, chat or comment to John"
  ],
  "dos": [
   "Log the question in **the questioner's exact words**"
  ],
  "donts": [
   "Telling John afterwards **“you should have said…”**",
   "**A nod or chat message** to the witness"
  ]
 },
 "d5m3-kc": {
  "image": "knowledge-check",
  "questions": [
   "List the **landmines the audit must surface** before 02/04/2027, with the record that documents each.",
   "Set out **the 02/17/2027 day-before checklist**: who you confirm with, what, the exhibit set and backup contact.",
   "Name **the four defense question categories**. Which do clients underreport most, and where's that risk here?",
   "State **the seven golden rules** with their reasons. What does the two-second pause do on video?",
   "02/17/2027: John asks, “Can I just tell them I had no ride?” **Your exact reply**, and next step?",
   "9:50 a.m., 02/18/2027: no John on video, new number to voicemail. Your steps? Who decides **a late start**?",
   "“Objection, form” mid-answer: **what must John do**? What usually follows? Why is talking over it worse on video?"
  ]
 },
 "d5m4-l1": {
  "image": "binder-exhibits",
  "hook": "Fault can reduce or bar recovery; **answer each allegation with evidence** that can come in.",
  "points": [
   "Don't rest liability on **report RPD-26-018842**",
   "“Unbelted” is answered twice: **the EDR and EMS report**",
   "Failure to mitigate: **the A-C-T record** answers the 19 days",
   "Every item needs source, **authenticating witness and custody**"
  ],
  "upl": "Gather, authenticate and index; never tell John his share of fault",
  "job": [
   [
    "Answer filed 11/12/2026",
    "Log each defense separately",
    "CMS → Litigation → Pleadings Log",
    "Three lines, each dated 11/12/2026"
   ],
   [
    "Defenses logged",
    "Map evidence to each allegation",
    "CMS → Litigation → Liability counter-package",
    "Every item: source and named witness"
   ],
   [
    "Item lacks foundation",
    "Flag for subpoena duces tecum",
    "CMS → Tasks → Escalate",
    "Foundation gap and holder named"
   ]
  ],
  "dos": [
   "Answer each allegation **with a document**, not an argument",
   "Read **the damage pattern** with the video and witness"
  ],
  "donts": [
   "Telling John he **“can't be blamed”** as a passenger",
   "Adding **Kevin Alvarez's policy** to the stack"
  ],
  "theory": {
   "lead": "Comparative negligence **apportions fault** between the parties; the share charged to the injured person can reduce, or bar, what they recover.",
   "concepts": [
    {
     "term": "Three Fault Regimes",
     "text": "Pure, modified and contributory treat one fault finding differently: **the governing rule**, not the percentage alone, decides reduce or bar"
    },
    {
     "term": "Liability Status",
     "text": "Liability is accepted, partial or denied; recording **its status and source** shows Atty. Thorne what remains contested"
    },
    {
     "term": "Fault Versus Mitigation",
     "text": "Comparative fault concerns the crash; failure to mitigate concerns later care and **trims only avoidable damages**"
    },
    {
     "term": "The Counter-Package",
     "text": "An index answering each pleaded allegation with **evidence that can come in**, built for Atty. Thorne's analysis"
    }
   ],
   "pages": [],
   "framework": {
    "title": "The Liability Counter-Package",
    "kind": "table",
    "head": [
     "Defense pleaded",
     "What it targets",
     "Evidence that answers"
    ],
    "rows": [
     [
      "Entered the stop out of turn",
      "Kevin Alvarez's driving, not John's",
      "Ruth Calloway, the doorbell video, the point of impact; EDR corroborates"
     ],
     [
      "Unbelted passenger",
      "John's seatbelt use",
      "EDR: belt buckled; EMS: “restrained front-seat passenger”"
     ],
     [
      "Failure to mitigate",
      "19 days without visits, 04/02 → 04/21/2026",
      "The A-C-T record: the 04/08 call, extension refused 04/10, evening slots"
     ],
     [
      "Causation",
      "The 14-Day Gap; the “degenerative” MRI",
      "The Gap Record: four reasons, EMS neck complaint, Causation Letter"
     ]
    ],
    "note": "Every item carries its source, its authenticating witness and **its chain of custody**; its weight is Atty. Thorne's call."
   }
  }
 },
 "d5m4-a1": {
  "image": "documents-audit",
  "situation": "11/12/2026: Atty. Grant Mercer's Answer pleads **comparative negligence** (out of turn; unbelted), causation and **failure to mitigate**. The file holds RPD-26-018842, Ruth Calloway, the doorbell video, EDR, EMS report, A-C-T record.",
  "steps": [
   "List the evidence answering **each of the three allegations**",
   "Give each item **source, witness, custody** and foundation gaps",
   "Write **the video's chain** from 02/17/2026 to 02/19/2026",
   "Draft **a narrow Exhibit A** for any needed custodian",
   "Close with questions **only Atty. Thorne can answer**"
  ],
  "deliver": "An **allegation-by-allegation counter-package** with full foundation, a draft Exhibit A, questions routed",
  "checks": [
   "**Three separate rows**: out of turn, unbelted, failure to mitigate",
   "EDR's 11 mph used **as corroboration only**",
   "Video chain: **native file unaltered**, each transfer logged",
   "Exhibit A limited to **the 02/06/2026 EMS run**",
   "Stack stated as **$40,000; no layer added**"
  ],
  "dos": [
   "**One allegation, one row**",
   "The EMS report **does double duty**"
  ],
  "donts": [
   "An Exhibit A asking for **“all records of any kind”**",
   "Calling the EDR's 11 mph **proof of the right-of-way**"
  ]
 },
 "d5m4-l2": {
  "image": "skip-trace",
  "hook": "Two people went missing on this file; **the record proves diligence**.",
  "points": [
   "Stale address? **Skip-Trace first**, permissible purpose only",
   "Follow up with the process server **every 5 days**",
   "Subpoena duces tecum: **notice opposing counsel first**, then serve",
   "The Step 4 letter: **certified mail AND email**, Atty. Thorne's signature"
  ],
  "upl": "Run authorized skip-traces and draft notices; never decide alternative service or threaten withdrawal",
  "job": [
   [
    "Third failed attempt, 10/08/2026",
    "Escalate for Skip-Trace authority",
    "CMS → Tasks → Escalate",
    "Result logged 10/09/2026"
   ],
   [
    "Affidavit filed 10/16/2026",
    "Docket answer date; weekly check",
    "Docket System · CMS → Calendar",
    "Answer due 11/13/2026 calendared"
   ],
   [
    "Client unreachable from 01/22/2027",
    "Run Steps 1–3; draft Step 4",
    "CMS → Communications Log",
    "Response date before 02/04/2027"
   ]
  ],
  "dos": [
   "Ask the server for **each attempt's date and time**",
   "**Pay a custodian's invoice** the day it arrives",
   "Confirm the address **before certified mail** goes out"
  ],
  "donts": [
   "**A fourth attempt** at a stale address",
   "Serving the non-party **before opposing counsel has notice**",
   "Telling Margaret Doe **why the firm needs John**"
  ],
  "theory": {
   "lead": "Filing a lawsuit **means nothing until service**: the defendant must be legally notified, or the case stalls and may be dismissed.",
   "concepts": [
    {
     "term": "Evading Defendants",
     "text": "Defendants aware of a suit may hide, ignore the door or move; **diligent, logged attempts** prove the effort"
    },
    {
     "term": "The Skip-Trace",
     "text": "A background search of utility, employment and address records that **finds a current address**, run only for permissible purpose"
    },
    {
     "term": "Alternative Service",
     "text": "A court-permitted substitute for personal service, such as mail or posting, that **only the attorney can request**"
    },
    {
     "term": "Certified Notice",
     "text": "Certified mail leaves **a provable mailing record**; with email, it shows the client was told how to respond"
    }
   ],
   "pages": [
    "D5#22"
   ],
   "framework": {
    "title": "The Evading Defendant Protocol",
    "kind": "flow",
    "steps": [
     {
      "label": "Attempts fail",
      "text": "Log each attempt's date, time and address; follow up with the server every 5 days"
     },
     {
      "label": "Skip-Trace",
      "text": "On Atty. Thorne's authority, licensed databases check utility, employment and **active-address records**"
     },
     {
      "label": "Vary the windows",
      "text": "The server tries early mornings, evenings and weekends where the court's rules allow"
     },
     {
      "label": "Alternative service",
      "text": "Atty. Thorne may ask the court to permit service by mail or posting"
     },
     {
      "label": "Proof of service",
      "text": "The signed affidavit of service is filed with the court, never left in email"
     }
    ],
    "note": "Unserved before the court's deadline, a case can be dismissed: confirm the court's rule."
   }
  }
 },
 "d5m4-a2": {
  "image": "email-outreach",
  "situation": "10/08/2026: **a third failed attempt** at 118 Larkspur Ln; a neighbor says Smith moved in August. 01/22/2027: calls to John Doe go unanswered, **deposition 02/18/2027**, prep 02/04 and 02/16/2027.",
  "steps": [
   "Escalate for **Skip-Trace authority**",
   "Pick the address on **recency and two corroborating sources**",
   "Re-instruct the server; log service and affidavit; **docket the answer date**",
   "Run Steps 1–3; draft **the Step 4 certified notice**",
   "Assess John's **Skip-Trace gate** on Day 1's three criteria"
  ],
  "deliver": "A service record through the answer date; **a certified notice dispatched**, both deliveries logged",
  "checks": [
   "4410 Quarry Ridge Ct, Millbrook chosen on **two current sources**",
   "**Answer due 11/13/2026** docketed (10/14 + 30)",
   "Response date before 02/04/2027: **sent by 01/27/2027**",
   "**Certified mail AND email**, signed by Atty. Thorne",
   "**Gate not met**: deadline not expired; no Skip-Trace"
  ],
  "dos": [
   "Calendar the response date **beside the deposition**"
  ],
  "donts": [
   "A response date **after the first prep session**",
   "**Threatening withdrawal** in a text to John"
  ]
 },
 "d5m4-kc": {
  "image": "knowledge-check",
  "questions": [
   "List the **Recovery Stack in order**, limits and total; name three coverages outside it, then the Payer Order.",
   "When did **the 07/20/2026 demand's window** close? Why? Track A: what must UM carriers give before BI release?",
   "Track A: $40,000.00 **nets $20,359.92**. Name each deduction's figure and how costs and liens split by stream.",
   "Why did Keystone's stonewall **freeze the stack**? Which binds, mediation or arbitration? Internal SOL cutoff and brief date?",
   "Match the 11/12/2026 Answer's **three allegations** to file evidence; name each one's question only Atty. Thorne can answer.",
   "John unreachable 01/22–02/03/2027: which **No Contact steps** apply, which calls are Atty. Thorne's? His gap question: what now?",
   "Civic: $2,016.00 Loss of Use; $3,600.00 vs $792.00 Diminished Value. Your **routed recommendation**? What may Leah Moran hear?"
  ]
 },
 "d5m5-l1": {
  "image": "money-ledger",
  "hook": "Same $40,000.00 gross; **suit changes the net** to $14,713.75.",
  "points": [
   "Suit filed 09/24/2026: **the 40% tier**, $16,000.00",
   "Receipt **every litigation cost**: $3,895.25 in all",
   "Reduce liens **at the fee actually charged**",
   "Net: **$14,713.75**, routed before John Doe signs"
  ],
  "upl": "Explain the arithmetic; whether suing was worth it is Atty. Thorne's.",
  "job": [
   [
    "Award received 07/06/2027",
    "Log it; diary each payment",
    "CMS → Litigation",
    "Harbor Point $20,000.00 · Cardinal State $10,000.00"
   ],
   [
    "The fund is known",
    "Send Reduction Requests for approval",
    "LSH Net Sheet",
    "$1,116.00 · $4,275.00"
   ],
   [
    "Last UM check cleared",
    "Complete Net Sheet; route statement",
    "LSH Net Sheet",
    "Net $14,713.75"
   ]
  ],
  "dos": [
   "Show John **the 40% tier** in his retainer",
   "Attach **a receipt** to every cost"
  ],
  "donts": [
   "Carrying **Track A's 33⅓%** into this file",
   "Disbursing **before the liens resolve**"
  ],
  "theory": {
   "lead": "The Net Sheet is **the ultimate transparency tool**: it shows the client where every dollar came from and where it goes.",
   "concepts": [
    {
     "term": "The Common Fund Doctrine",
     "text": "The attorney's work and costs created the fund, so lienholders contribute **their proportional share** of fees and costs"
    },
    {
     "term": "The Double-Dipping Trap",
     "text": "Carriers audit the file, so the sheet traces **every dollar to its source**, never mixing funds"
    },
    {
     "term": "Fee Structure Transparency",
     "text": "Fees can differ by stream and stage; tracking **each stream's fee separately** keeps the ledger accurate and explainable"
    },
    {
     "term": "The Final Payoff Letter",
     "text": "No lien check goes out without a signed letter accepting it as **full and final satisfaction**"
    }
   ],
   "pages": [
    "D3#25",
    "D3#21"
   ],
   "framework": {
    "title": "The BI/UM Master Financial Ledger",
    "kind": "table",
    "head": [
     "Net Sheet section",
     "What it records",
     "On a litigated file"
    ],
    "rows": [
     [
      "Recovery summary",
      "Gross recovery by stream, each with its source",
      "BI tendered at mediation; both UM awards at arbitration"
     ],
     [
      "Attorney fees",
      "The fee on each stream, confirmed from the retainer",
      "The **40% tier** once suit is filed"
     ],
     [
      "Case expenses",
      "Every advanced cost, each with its receipt",
      "Filing, service, mediation, arbitration, reporter, records, plus pre-suit costs"
     ],
     [
      "Provider ledger",
      "Charges, payments, adjustments, balance owed, reduction",
      "Only liens owed; reductions follow the fee actually charged"
     ],
     [
      "Net to client",
      "Gross minus fees, costs and reduced liens",
      "Shown line by line before John Doe signs"
     ]
    ],
    "note": "Nothing leaves trust until both UM checks clear and every Payoff Letter is in Documents."
   }
  }
 },
 "d5m5-a1": {
  "image": "money-ledger",
  "situation": "File date 07/22/2027. The award gave **Harbor Point $20,000.00 and Cardinal State $10,000.00**; with Keystone's $10,000.00, **$40,000.00 is in trust**. Peach State accepted $1,116.00, Riverton $4,275.00.",
  "steps": [
   "Enter **the gross by carrier**: $40,000.00",
   "Apply **the 40% fee** the retainer sets after suit",
   "Post **every receipted cost** on its row",
   "Enter each lien's **reduced figure** with its Payoff Letter",
   "**Route the Settlement Statement** to Atty. Thorne"
  ],
  "deliver": "A Net Sheet reaching **$14,713.75**, every cost and lien proved",
  "checks": [
   "Fee at 40%: **$16,000.00**",
   "Costs receipted: **$3,895.25**",
   "Liens: **$1,116.00 + $4,275.00** = $5,391.00",
   "Net: **$14,713.75**, tied to trust",
   "Nothing paid **until John Doe signs**"
  ],
  "dos": [
   "Write **each reduction's basis** on its line"
  ],
  "donts": [
   "Paying a lien **from a phone call**"
  ]
 },
 "d5m5-kc": {
  "image": "knowledge-check",
  "questions": [
   "Take the award to **$14,713.75**: every deduction, its figure and its source.",
   "Why is the fee **40% on this file**, which document says so, and who confirms it?",
   "Peach State: $1,240.00 on Track A, $1,116.00 on Track B. **Show both reductions**.",
   "List **the litigation costs** with amounts. What do you need before charging any?",
   "John asks why he nets **$5,646.17 less**. What do you say, and route?"
  ]
 }
};
