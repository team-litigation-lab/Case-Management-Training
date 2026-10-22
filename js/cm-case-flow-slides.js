/* The Case Flow slides' concise copy (one idea per slide, the key phrase **highlighted**), assembled from
   build/case-flow/slides/dN.json (theory-dN.json, clues-dN.json) by build/case-flow/slides/assemble.cjs. Written to build/case-flow/slides/SLIDESPEC.md.
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
   "lead": "Case Management is the **end-to-end coordination** of a case from intake to resolution: tracking, handling and moving it, phase by phase.",
   "concepts": [
    {
     "term": "What It Ensures",
     "text": "Timely progression, proper documentation and compliance, clear communication: **the three tests** every task on the file must pass"
    },
    {
     "term": "The General Process",
     "text": "Six stages, from Intake & Case Opening to Billing, Resolution & Closing: **you carry the file** through all six"
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
    "note": "Six stages on one track, from opening the file to closing it."
   }
  },
  "clues": {
   "dos": [
    [
     "Friday afternoon, you close John Doe's file for the weekend.",
     "Monday morning, the team asks what happens on it, and when.",
     "One task, one owner, a calendar entry: nothing sits idle."
    ],
    [
     "John Doe calls with two questions in a single breath.",
     "One is about paperwork; the other is about what the law means.",
     "You answer the first; Atty. Thorne gets the second, same day."
    ]
   ],
   "donts": [
    [
     "At the end of a call, John Doe asks one more thing.",
     "He wants a number, and he wants it from you.",
     "You toss out a dollar figure that only Atty. Thorne can set."
    ],
    [
     "Dana Whitfield emails an update on John Doe's BI claim.",
     "The message stays put in your email, flagged and starred.",
     "The CMS log is blank; colleagues think nothing has moved."
    ]
   ]
  }
 },
 "d1m1-case": {
  "image": "property-damage",
  "hook": "One file for five days: know **its facts cold** before you touch the CMS.",
  "points": [
   "Who ran the stop, and where John sat: **the Police Report**",
   "The stack, in order: **BI → Host UM → Relative UM**, $40,000",
   "His seat in the vehicle decides **which layers he reaches**",
   "EMS date vs. first treatment record: **find the gap yourself**"
  ],
  "upl": "Share facts and the process; never value, or what the gap does",
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
      "John Doe, client; Robert Smith, defendant; **the Police Report** names the rest"
     ],
     [
      "What",
      "A two-vehicle collision; what EMS found is in the Run Report"
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
      "How it happened, and any citation: **read the Police Report**"
     ]
    ],
    "note": "Every answer comes from a document; ambiguous facts of loss or liability go to Atty. Thorne for review."
   }
  },
  "clues": {
   "dos": [
    [
     "A colleague asks you for John Doe's date of loss.",
     "You answer 02/06/2026, and the colleague asks how you know.",
     "You point to the Police Report, page and line."
    ],
    [
     "Three policies sit on John Doe's file, totaling $40,000.",
     "Keystone Mutual pays first, then Harbor Point, then Cardinal State Mutual.",
     "Every call, the same lineup: BI, Host UM, then Relative UM."
    ]
   ],
   "donts": [
    [
     "An adjuster asks for John Doe's first treatment date.",
     "You recall it off the top of your head, confidently.",
     "No record backs your answer, and nobody checked the file first."
    ],
    [
     "The EMS Run Report and the first treatment record carry different dates.",
     "Days pass between them, and nobody yet knows why.",
     "A case note reads: he waited, so that's on him."
    ]
   ]
  }
 },
 "d1m1-upl": {
  "image": "client-call",
  "hook": "You share **facts and the process**; Atty. Thorne gives every opinion on the case.",
  "points": [
   "Legal advice is **any opinion** on what his facts mean",
   "Share facts: dates, documents, **what was sent and when**",
   "Explain the process: **what happens next**, and who decides",
   "Never value, strategy, settlement, or **what the gap does**"
  ],
  "upl": "Hear it, log it, **route it** to Atty. Thorne the same day",
  "job": [
   [
    "Client asks his case's worth",
    "Log it; route to counsel",
    "CMS → Case Notes · Tasks",
    "Routed today; no figure given"
   ],
   [
    "Client asks what happens next",
    "Explain the next step plainly",
    "CMS → Case Notes",
    "Process explained; no prediction"
   ],
   [
    "Adjuster asks your view",
    "Decline; share approved facts only",
    "CMS → Communications Log",
    "Nothing beyond the record"
   ]
  ],
  "dos": [
   "Answer from **the record**; route what it means",
   "Use **one routing line**, every time",
   "Give the client **a time frame** for the answer"
  ],
  "donts": [
   "Reassuring him **about the outcome**",
   "Guessing a value **“off the record”**",
   "Coaching him on **what to tell an adjuster**"
  ],
  "theory": {
   "lead": "UPL is giving legal advice without a license; a Case Manager stays on **the fact side** of that line, every time.",
   "concepts": [
    {
     "term": "Fact sharing",
     "text": "Telling the client what a record says: a date, an amount, **what was sent**, and when"
    },
    {
     "term": "Process explanation",
     "text": "What happens next, what a form is for, and **who decides**; never how it ends"
    },
    {
     "term": "Legal advice",
     "text": "Any opinion on what his facts mean for **his rights, money or choices**: the attorney's alone"
    },
    {
     "term": "Hear, log, route",
     "text": "An opinion question is written down word for word and **sent to Atty. Thorne** the same day"
    }
   ],
   "pages": [
    "D4#24"
   ]
  },
  "clues": {
   "dos": [
    [
     "John Doe asks when his crash happened, then what that means.",
     "You read him 02/06/2026 straight from the Police Report.",
     "The meaning part goes to Atty. Thorne with a same-day task."
    ],
    [
     "Three clients ask three different opinion questions this week.",
     "Each hears the same sentence: that's Atty. Thorne's call.",
     "The words stay identical, so nobody hears a guess."
    ],
    [
     "John Doe asks if taking the first offer is smart.",
     "You log it for Atty. Thorne instead of answering.",
     "Then you add: he'll call you back by Friday."
    ]
   ],
   "donts": [
    [
     "John Doe is anxious over the days before his first visit.",
     "You want to calm him down quickly.",
     "You tell him: relax, it won't matter at all."
    ],
    [
     "John Doe asks for a ballpark, just between friends.",
     "He promises nobody will hold you to it.",
     "You say probably around forty thousand, roughly."
    ],
    [
     "Keystone Mutual wants to talk with John Doe directly.",
     "He asks you how to answer their questions.",
     "You hand him a script: say the other driver ran it."
    ]
   ]
  }
 },
 "d1m1-l1": {
  "image": "intake-interview",
  "roadmap": {
   "title": "Opening the File: the Roadmap",
   "steps": [
    {
     "label": "Conflict Check",
     "text": "Every party's full legal name, **before the file exists**"
    },
    {
     "label": "Verify the facts",
     "text": "Date of loss against the Police Report; corrections documented"
    },
    {
     "label": "Docket the SOL",
     "text": "On day one, from the confirmed date of loss"
    },
    {
     "label": "Map the parties",
     "text": "Six roles and the client's position, **none left “unknown”**"
    },
    {
     "label": "Record coverage",
     "text": "From the Declaration Page, with each fact's source"
    },
    {
     "label": "Name and file",
     "text": "Every document to the firm's naming convention"
    }
   ]
  },
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
    "None “unknown”; position from report"
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
  },
  "clues": {
   "dos": [
    [
     "Harbor Point confirms a $20,000 Host UM limit by phone.",
     "You type the limit into the CMS coverage field.",
     "Next to it goes the Dec Page, adjuster letter, or Police Report."
    ],
    [
     "John Doe's matter opens in the CMS this morning.",
     "Every deadline on the file counts from 02/06/2026.",
     "By lunch, 02/06/2028 sits on the calendar with reminders."
    ],
    [
     "Marcus Bell sends an update, and a colleague forwards it around.",
     "Side emails pile up with different versions of the facts.",
     "Everything lands in the CMS, and that's the one place people look."
    ]
   ],
   "donts": [
    [
     "A raw file arrives from On the Records at 9 a.m.",
     "A new matter number appears in the CMS within minutes.",
     "Nobody has yet screened Robert Smith's name against firm records."
    ],
    [
     "A screening search runs on the parties to John Doe's file.",
     "The search box holds only R. Smith, and results come back clear.",
     "Nobody types the full legal name Robert Smith into the system."
    ],
    [
     "Intake hands over John Doe's file with a signature missing.",
     "The narrative and the Police Report differ on a detail or two.",
     "Close enough, says the team, and the file goes active anyway."
    ]
   ]
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
   "Position corrected **from the Police Report**",
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
 "d1m1-kc": {
  "image": "knowledge-check",
  "questions": [
   "Name the **six stages** in order. What does the CM own at Intake & Case Opening?",
   "John Doe asks his case's **worth**, and if waiting hurt it. Your exact words, and what you log?",
   "What must happen **before the matter is created** in the CMS, and on whose names?"
  ]
 },
 "d1m2-l1": {
  "image": "phone-call",
  "roadmap": {
   "title": "The No Contact Protocol: the Roadmap",
   "steps": [
    {
     "label": "Internal review",
     "text": "Case status, live deadlines, last contact, channels used"
    },
    {
     "label": "Contact attempts",
     "text": "Phone twice, email and text, emergency contact, **certified mail**"
    },
    {
     "label": "Log every attempt",
     "text": "Date, time, channel and outcome, in the CMS"
    },
    {
     "label": "Team notification",
     "text": "Escalate to Atty. Thorne with **the deadline impact**"
    }
   ]
  },
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
  },
  "clues": {
   "dos": [
    [
     "A records request for John Doe goes out at noon.",
     "Ten days later, the CMS pings you about the missing reply.",
     "That ping was set the very minute the request left."
    ],
    [
     "John Doe works as a shift lead at Northgate Distribution.",
     "He can't take calls on the floor, but texts reach him.",
     "A call window, a text, an upload link: he picks one."
    ]
   ],
   "donts": [
    [
     "John Doe has gone quiet for eleven days running.",
     "The file note says only: we're waiting on the client.",
     "Calls were placed, but the CMS shows no dates, times, or outcomes."
    ],
    [
     "John Doe's signed HIPAA form arrives three weeks late.",
     "Nobody sent it with a deadline or an upload link.",
     "The case note pins the delay squarely on John Doe."
    ]
   ]
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
  },
  "clues": {
   "dos": [
    [
     "Step 4 arrives: the Final Warning Letter for John Doe.",
     "The letter has to prove the firm did its part.",
     "Each call, text, and email appears as a line with its calendar day."
    ],
    [
     "The Final Warning Letter is ready for certified mail.",
     "2214 Maple Hollow Rd, Riverton may be stale by now.",
     "In-house help checks where John Doe actually lives before it ships."
    ]
   ],
   "donts": [
    [
     "John Doe has not answered phone, email, text, or emergency contact.",
     "No Final Warning Letter has gone out, and no deadline has passed.",
     "A Skip-Trace launches anyway, with one of three gates met."
    ],
    [
     "John Doe's Final Warning Letter draft lands on your screen.",
     "Atty. Thorne has not seen or signed off on it.",
     "One line announces the firm is ending representation, as decided."
    ]
   ]
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
   "A colleague calls **three voicemails to one mobile** an exhausted ladder. What's wrong; what should the log show?"
  ]
 },
 "d1m3-l1": {
  "image": "privacy-shield",
  "roadmap": {
   "title": "Client Instructions & Rental: the Roadmap",
   "steps": [
    {
     "label": "Give the instructions",
     "text": "No Recorded Statement, no posts, no signing without review"
    },
    {
     "label": "Treatment and barriers",
     "text": "Keep every appointment; **report any barrier** before a miss"
    },
    {
     "label": "Keep the receipts",
     "text": "Every expense and mile documented, so it can be claimed"
    },
    {
     "label": "The PD carve-out",
     "text": "The adverse carrier may discuss **Property Damage only**"
    },
    {
     "label": "Rental authorization",
     "text": "Who authorizes it, the daily cap and the duration"
    }
   ]
  },
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
   "Ask about **barriers to care** at every check-in",
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
      "label": "Whose Coverage Pays the Rental?",
      "text": "The adverse carrier's **Property Damage** coverage pays the 3P rental; the client's policy only if none"
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
  },
  "clues": {
   "dos": [
    [
     "Margaret Doe's rental runs out in a few weeks.",
     "He mentions his carpool might end soon.",
     "You note it and help line up another ride now."
    ],
    [
     "John Doe calls, frustrated about missing shifts at Northgate Distribution.",
     "You let him finish, then repeat his worry back to him.",
     "Feeling heard, he follows the firm's instructions without pushback."
    ]
   ],
   "donts": [
    [
     "Dana Whitfield of Keystone Mutual asks John Doe for a Recorded Statement.",
     "John Doe asks you why giving one would be a problem.",
     "You explain how it could hurt his claim, instead of just instructing."
    ],
    [
     "The adverse carrier calls John Doe under the LOR carve-out.",
     "The talk starts with repair photos and the damaged door.",
     "Soon the adjuster asks about his neck, and nobody stops the call."
    ]
   ]
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
   "Property Damage section states **whose claim it is**",
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
  "roadmap": {
   "title": "Property Damage: the Roadmap",
   "steps": [
    {
     "label": "Written estimate first",
     "text": "No Repair Estimate, **no position** with the client"
    },
    {
     "label": "Inspection window",
     "text": "Five days from the letter; record when it opens"
    },
    {
     "label": "Audit estimate and photos",
     "text": "Bill against estimate; point of impact, frame, undercarriage"
    },
    {
     "label": "Repair or Total Loss",
     "text": "The carrier's threshold against **actual cash value**, in writing"
    },
    {
     "label": "Loss of Use",
     "text": "Each day without a vehicle, at a comparable rental rate"
    },
    {
     "label": "Escalate disputes",
     "text": "Document and route; no ad hoc arguing with adjusters"
    }
   ]
  },
  "hook": "Property Damage is the client's first test of the firm, and **physical evidence of impact**.",
  "points": [
   "Get **the written Repair Estimate** before discussing any outcome",
   "Total Loss: confirm the carrier's **threshold basis in writing**",
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
  },
  "clues": {
   "dos": [
    [
     "The Escape comes back from the body shop with a final bill.",
     "The bill runs higher than the insurer's first written figure.",
     "Those extra line items reveal structural harm nobody saw at inspection."
    ],
    [
     "The carrier declares the vehicle a Total Loss.",
     "Its offer rests on a CCC One figure for pre-loss value.",
     "You check the comparables before John Doe hears any number."
    ]
   ],
   "donts": [
    [
     "The carrier's appraiser writes up the Escape the week after the crash.",
     "That first figure goes straight into the file as final.",
     "Nobody compares it against the body shop's closing bill or supplementals."
    ],
    [
     "The repair photos show a crushed door on one side.",
     "Frame photos could show how hard the impact really was.",
     "The vehicle file is treated as fender paperwork, apart from the injury claim."
    ]
   ]
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
 "d1m3-a3": {
  "image": "checklist-qa",
  "situation": "Keystone has authorized a rental for the Civic. John Doe calls asking if it is his. Nobody has written down **whose claim it is**.",
  "steps": [
   "Read the **Police Report's vehicle and occupant boxes**",
   "Find **who owns the Civic** in the intake records",
   "Name **the PD and rental claimant** from Keystone's letter",
   "Write a **sourced Case Note** and tell Atty. Thorne",
   "Answer John Doe **within the UPL line**; solve his ride"
  ],
  "deliver": "A **sourced finding** of whose claim it is, reported, and a logged call",
  "checks": [
   "**Position, owner and claimant** each from a record",
   "**Conclusion** on a PD or rental claim for John Doe",
   "Each finding **cites its document**",
   "**Atty. Thorne** told the same day",
   "**Transportation** to treatment arranged"
  ],
  "dos": [
   "Ask: **who owns the claim**, and is that our client?"
  ],
  "donts": [
   "Booking a rental **because the caller asked**"
  ]
 },
 "d1m3-kc": {
  "image": "property-damage",
  "questions": [
   "List the firm's **standing instructions** for a new client, and the harm each prevents.",
   "Before a rental: what must be confirmed, **whose coverage provides it**, and what happens to uncovered days?",
   "What does **actual cash value** mean and not mean, and why does the loan-balance mix-up mislead clients?"
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
    "Coverage verified in writing",
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
     "text": "In a legal framework, Case Management shifts from **best efforts to strict compliance**: every plan deadline is docketed"
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
  },
  "clues": {
   "dos": [
    [
     "The Case Plan reaches the functional pillar for John Doe.",
     "Return to work at Northgate Distribution needs a way to track progress.",
     "Each pillar gets a target with a number and a date."
    ],
    [
     "You mark a file Escalated in the Case Plan's acceptance band.",
     "A colleague covering next week opens it cold.",
     "A written why sits beside the call, plain enough for anyone."
    ]
   ],
   "donts": [
    [
     "The Three-Pillar Case Plan for John Doe hits Atty. Thorne's desk.",
     "PT and specialty consults fill the page with goals.",
     "Return-to-work status and who pays the bills appear nowhere on it."
    ],
    [
     "The verification call has confirmed John Doe's facts of loss.",
     "Accepted, Escalated, or Declined waits on the screen.",
     "Instead of choosing, you order three more records and wait."
    ],
    [
     "A new file's liability facts look murky after the verification call.",
     "No summary goes to Atty. Thorne, and no decision gets recorded.",
     "Weeks pass with the file parked, neither accepted nor escalated."
    ]
   ]
  }
 },
 "d1m4-a1": {
  "image": "calendar-gap",
  "situation": "John Doe's first treatment records have arrived in the CMS. Find the first treatment date yourself and compare it with **the date of loss**.",
  "steps": [
   "Compute **the gap exactly** from DOL to first treatment",
   "Record the gap; **watch for a later break** in care",
   "In the risks band, record **the facts only**: dates and length",
   "List **the documents to request** from John Doe",
   "**Route the flag** to Atty. Thorne"
  ],
  "deliver": "A **precisely computed, prominently flagged** and routed treatment-gap record",
  "checks": [
   "Gap: **14 days, 02/06/2026 to 02/20/2026**",
   "Gap recorded; **a watch set** for later breaks",
   "Risks band: **facts only**, explanation marked pending",
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
   "lead": "A Case Plan is a **living, approved document**: drafted in structure, reviewed by counsel, then run.",
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
  },
  "clues": {
   "dos": [
    [
     "You type a quick note after a call with John Doe.",
     "The CMS keeps an unalterable trail of each line you write.",
     "You write as if Robert Smith's lawyer will open the file."
    ],
    [
     "John Doe's PT session wraps up, and you log the visit.",
     "Medical and legal tracks run side by side, kept apart.",
     "The note lists range of motion and pain scores, nothing more."
    ]
   ],
   "donts": [
    [
     "An old CMS entry on John Doe's file has a typo.",
     "Defense counsel may one day read that exact history.",
     "The original text is overwritten, with no record of the change."
    ],
    [
     "John Doe's PT visit gets logged in the medical track.",
     "A strategy comment slips in next to the PT findings.",
     "The note cheers that this visit will boost his claim."
    ]
   ]
  }
 },
 "d1m4-a2": {
  "image": "cms-screen",
  "situation": "The set-up is in: parties mapped, **$40,000 stack verified**, packet tracked, **14-Day Treatment Gap** identified. Atty. Thorne awaits the Case Plan.",
  "steps": [
   "Snapshot: record **the acceptance decision** and its reason",
   "Coverage stack and order, liability, **preliminary projection**; triple-check held open",
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
   "State John Doe's coverage as the plan should: layers, limits, total, **order of operations**, projection status."
  ]
 },
 "d2m1-l1": {
  "image": "policy-letter",
  "roadmap": {
   "title": "Three Carriers, One Day: the Roadmap",
   "steps": [
    {
     "label": "Draft on template",
     "text": "One LOR per carrier, **each naming its own insured**"
    },
    {
     "label": "Request and preserve",
     "text": "Limits, Dec Pages, photos, video and vehicle data"
    },
    {
     "label": "Protect the client",
     "text": "Third-party letter: his name only, nothing more"
    },
    {
     "label": "Send and log",
     "text": "Each carrier's preferred method; Atty. Thorne signs"
    },
    {
     "label": "Follow up",
     "text": "No acknowledgement by **the third business day**: call"
    }
   ]
  },
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
  },
  "clues": {
   "dos": [
    [
     "Keystone Mutual picks up on 02/16/2026 to open a file.",
     "Every later Attn line and subject line depends on this call.",
     "KM-26-440871 and Dana Whitfield, spelled exactly, go straight into the log."
    ],
    [
     "Harbor Point asks how the 02/06/2026 collision happened.",
     "Anything said now can be quoted back at the demand table.",
     "Date, time, place, type of collision and parties, and nothing more."
    ],
    [
     "An acknowledgement letter mentions a policy nobody has logged yet.",
     "It might be a fourth layer, or nothing at all.",
     "Lead Counsel decides whether it applies, not the Case Manager."
    ]
   ],
   "donts": [
    [
     "Cardinal State gets its notice letter on 02/17/2026.",
     "The BI tender from Keystone has not been documented yet.",
     "The letter asks Cardinal State to pay its $10,000 now."
    ],
    [
     "Keystone's letter goes out to Robert Smith's own carrier.",
     "Third-party adjusters work for the other side of the table.",
     "(555) 010-2288 and 2214 Maple Hollow Rd appear in that letter."
    ],
    [
     "Cardinal State has nobody assigned to CS-26-20355 on 02/17/2026.",
     "The Attn line needs something, and the letters go out today.",
     "A made-up person replaces Claims Department; Teresa Okafor arrives 03/03/2026."
    ]
   ]
  }
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
 "d2m1-a1": {
  "image": "email-outreach",
  "situation": "File date 02/17/2026. Claims are open with Keystone (BI and PD), Harbor Point (Host UM, PIP) and Cardinal State, **no adjuster assigned**. **Five letters** must go out today.",
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
   "Stack **three layers to $40,000**; PIP and PD are tracked, never added",
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
   "**Adding PIP or PD** to the stack total",
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
     "text": "Only liability and UM layers stack; PIP, PD and collision coverage are **separate benefits, tracked apart**"
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
      "Medical Bills to its limit, regardless of fault",
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
  },
  "clues": {
   "dos": [
    [
     "Keystone's adjuster mentions a $10,000 limit during the set-up call.",
     "Nothing in writing will follow until a formal request arrives.",
     "The figure goes in the Matrix at once, tagged as spoken, not confirmed."
    ],
    [
     "Keystone wants formal requests, proof of representation and supporting documents.",
     "Its BI limit stayed unconfirmed until 03/20/2026.",
     "Each ask goes out in writing, logged with its date and attachments."
    ],
    [
     "A Declaration Page arrives with its policy period printed on top.",
     "A policy that lapsed before the crash pays nothing.",
     "The effective dates are read against the date of loss."
    ]
   ],
   "donts": [
    [
     "The Recovery Stack total gets updated after a busy morning.",
     "Harbor Point's $5,000 and Keystone's $25,000 for the car are included.",
     "The $40,000 figure suddenly reads $70,000."
    ],
    [
     "A Police Report lists a carrier and a limit for Robert Smith.",
     "No Declaration Page or Coverage Letter sits behind it yet.",
     "The Matrix status flips to confirmed in writing anyway."
    ],
    [
     "A written request to Keystone has been out for a week.",
     "The calendar shows nothing coming up for that item.",
     "Nobody chases it, and it stays open forever."
    ]
   ]
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
   "**PIP out** of the stack: it pays bills, not claims",
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
   "Name every coverage, whose it is and what it pays. Which **three are the $40,000 stack**?",
   "Give each layer of the **Policy Stack** you built in the CMS: carrier, claim, limit, party, order.",
   "Name the **five letters** sent 02/17/2026: for each, the insured named and how it was addressed."
  ]
 },
 "d2m1-cov": {
  "image": "insurance-stack",
  "hook": "Send each bill to **the right first payer**, or it comes back as a lien",
  "points": [
   "Sort every coverage: **whose it is**, and what it pays",
   "Only BI and UM are **the $40,000 Recovery Stack**",
   "Payer-First: **PIP, then Peach State**, an LOP last",
   "Verify PIP and UM in writing; **never assume either**"
  ],
  "upl": "Route bills in the default order; primacy and lien enforceability are Atty. Thorne's",
  "job": [
   [
    "Coverage confirmed in writing",
    "Place it: stack, Payer Order, outside",
    "CMS → Coverage Matrix",
    "Stack $40,000; PIP outside it"
   ],
   [
    "A provider asks whom to bill",
    "Route it by Payer-First order",
    "CMS → PIP ledger",
    "PIP, Peach State, then LOP"
   ],
   [
    "A provider asks for an LOP",
    "Check PIP and network first",
    "CMS → Liens → LOP register",
    "Atty. Thorne approves any LOP"
   ]
  ],
  "dos": [
   "Verify every coverage in writing: **a dated Declaration Page**",
   "Confirm the Health Plan was **active on the loss date**",
   "Keep the Payer Order and **the Recovery Stack apart**"
  ],
  "donts": [
   "An LOP to a provider **PIP would have paid**",
   "PIP, PD or collision **added to the stack**",
   "Assuming PIP, or **UM on the client's own policy**"
  ],
  "theory": {
   "lead": "Every policy answers **two questions**: whose is it, and what does it pay? The Payer-First Principle then decides which payer each Medical Bill goes to first.",
   "concepts": [
    {
     "term": "Third-Party vs. First-Party",
     "text": "Third-party is the at-fault driver's coverage; first-party answers to the client's side: **who you claim against** changes"
    },
    {
     "term": "The Recovery Stack",
     "text": "Only coverage that pays the claim stacks: BI, then the UM/UIM layers. **Bills and the car** stay outside"
    },
    {
     "term": "No-Fault Medical Coverage",
     "text": "MedPay and PIP pay accident Medical Bills **regardless of fault**, fast, while liability is still disputed"
    },
    {
     "term": "UM by Status",
     "text": "UM/UIM follows the person: an occupant reaches the vehicle's policy, **a resident relative the household's**"
    },
    {
     "term": "Set-Off and Non-Duplication",
     "text": "Some policies credit what MedPay or PIP paid against what they owe: **verify the form in writing**"
    },
    {
     "term": "Subrogation vs. Non-Subrogation",
     "text": "A payer with subrogation claims its payments back from the recovery; without it, **what it paid stays paid**"
    },
    {
     "term": "Contract Rate and Write-Off",
     "text": "An in-network provider takes the plan's rate and writes off the rest: **no balance billing**, a smaller lien"
    },
    {
     "term": "Medicare Secondary Payer",
     "text": "Medicare pays only after no-fault and liability coverage, and **recovers by statute**; report the case to the BCRC"
    }
   ],
   "pages": [
    "D2#25",
    "D3#20"
   ],
   "framework": {
    "title": "What Each Coverage Pays",
    "kind": "table",
    "head": [
     "Coverage",
     "Whose",
     "Pays",
     "Payback risk"
    ],
    "rows": [
     [
      "BI liability",
      "The at-fault driver's (third-party)",
      "The claim, for injuries he caused",
      "None: it is the recovery"
     ],
     [
      "UM/UIM",
      "Client side: the vehicle or household",
      "The claim, when BI is too small",
      "Consent rules guard its subrogation"
     ],
     [
      "PIP",
      "The occupied vehicle's policy",
      "Medical Bills, no fault needed; no wages",
      "By policy: **verify in writing**"
     ],
     [
      "PIP",
      "Client side, where a state requires it",
      "Medical Bills, part of wages, services",
      "Set-off or lien, by state law"
     ],
     [
      "Health insurance",
      "The client's own plan",
      "Covered care at the contract rate",
      "**Reimbursement right** on what it paid"
     ],
     [
      "Medicare / Medicaid",
      "Government payer",
      "Care, after no-fault and liability",
      "Recovery by statute; a BCRC report"
     ]
    ],
    "note": "Payer-First: MedPay or PIP, then health insurance, then an LOP. Liability and UM pay the claim, not the bills"
   }
  },
  "clues": {
   "dos": [
    [
     "A carrier says Host UM is $20,000 on a quick call.",
     "The Coverage Matrix wants a source and a date behind that figure.",
     "Harbor Point's 03/02/2026 letter turns a phone figure into a confirmed layer."
    ],
    [
     "Crescent Pain & Spine bills Peach State Health Plan for an injection.",
     "A plan that began after the crash would pay nothing at all.",
     "Peach State began 02/01/2026, five days before the collision."
    ],
    [
     "Two lists sit side by side on John Doe's Insurance tab.",
     "One says who pays the bills first; the other totals $40,000.",
     "PIP leads the Payer Order yet adds nothing to the BI and UM layers."
    ]
   ],
   "donts": [
    [
     "Summit Imaging asks the firm for a Letter of Protection.",
     "Harbor Point's $5,000 no-fault coverage still has room for the MRI.",
     "A bill Harbor Point could cover turns into a lien on John Doe's net."
    ],
    [
     "Someone totals every policy on the file to impress John Doe.",
     "Keystone PD's $25,000 and Harbor Point's $5,000 land in the claim total.",
     "The number he hears is more than BI and UM can pay."
    ],
    [
     "A new file arrives and coverage gets filled in from memory.",
     "No-fault wage benefits are presumed without a Declaration Page behind them.",
     "On 03/14/2024 Margaret Doe signed away UM on the Bluewater coverage for her Civic."
    ]
   ]
  }
 },
 "d2m2-l1": {
  "image": "treatment-plan",
  "hook": "An LOP **out of Payer Order** turns a payable bill into a lien on his net.",
  "points": [
   "Run the Payer Order: **PIP → Peach State → LOP**",
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
    "PIP pays a bill",
    "Post payment, running total, balance",
    "CMS → PIP ledger",
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
   "An LOP **before checking PIP** and Peach State",
   "Telling a provider **“paid in full at settlement”**",
   "Mission creep: taking on **every problem John Doe raises**"
  ],
  "theory": {
   "lead": "Once the claim is set up, the Case Plan runs on **three pillars**: clinical care, functional status and subrogation management, which sets who pays.",
   "concepts": [
    {
     "term": "Payer Order",
     "text": "The default sequence: MedPay or PIP first, health insurance next, an LOP last. **Order keeps liens down**"
    },
    {
     "term": "MedPay vs. PIP",
     "text": "First-party coverage for Medical Bills regardless of fault, up to its limit; **unlike PIP, no wages**"
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
      "text": "First-party, regardless of fault, to its limit; PIP also pays 80% of wages, MedPay none"
     },
     {
      "label": "Health Plan",
      "text": "Pays covered care at its contract rate, but may assert **a reimbursement right** against the recovery"
     },
     {
      "label": "Letter of Protection",
      "text": "Last rung, for care earlier payers can't carry: paid from any recovery, on Atty. Thorne's terms"
     }
    ],
    "note": "On this file: Harbor Point PIP, then Peach State, then an LOP; providers bill whom they bill"
   }
  },
  "clues": {
   "dos": [
    [
     "John Doe calls about a ride to Riverton Spine & Rehab.",
     "Visits, pain and what he can manage at work all come up.",
     "Each contact checks whether the treatment is actually helping him."
    ],
    [
     "John Doe worries about the envelopes piling up from providers.",
     "Cost worry left unanswered is how a client stops going.",
     "Summit goes to PIP, Crescent to Peach State, Riverton under an LOP."
    ],
    [
     "Riverton's PT note and Dr. Reyes's note describe John Doe differently.",
     "The defense will read the mismatch as a hole in the medicals.",
     "Both offices hear about it the same day, before it spreads."
    ]
   ],
   "donts": [
    [
     "A provider asks for a Letter of Protection over the phone.",
     "Harbor Point's $5,000 and Peach State go unexamined.",
     "The LOP is issued simply because someone asked, and a lien grows."
    ],
    [
     "Riverton Spine & Rehab's billing office asks about its balance.",
     "LOP terms belong to Lead Counsel, and the firm guarantees nothing.",
     "The Case Manager promises the whole bill gets covered when the case resolves."
    ],
    [
     "A treatment check-in drifts into topics far from his care.",
     "Hours go to issues that block nothing about the treatment goal.",
     "The Case Manager adopts each new worry as a personal project."
    ]
   ]
  }
 },
 "d2m2-eob": {
  "image": "money-ledger",
  "hook": "Every bill's story is in **the EOB and the PIP ledger**: read them before you answer",
  "points": [
   "Read billed, allowed, **write-off, paid**, member share, in order",
   "Member responsibility is **the most a provider may bill**",
   "A plan's lien starts at **what it paid**, never billed",
   "PIP paid **$5,000.00 in five checks**; exhausted 06/26/2026"
  ],
  "upl": "Read and report what payers paid; whether a balance is owed is Atty. Thorne's",
  "job": [
   [
    "An EOB arrives",
    "Post billed, allowed, paid, member share",
    "CMS → Liens",
    "Plan paid $1,860.00 logged"
   ],
   [
    "A PIP check clears",
    "Post check and limit remaining",
    "CMS → PIP ledger",
    "Ties to Harbor Point's history"
   ],
   [
    "A patient statement shows a balance",
    "Compare with member responsibility",
    "CMS → Liens · Email Workspace",
    "Balance bill routed to Atty. Thorne"
   ]
  ],
  "dos": [
   "Read every EOB to **the member-responsibility line**",
   "Keep billed and paid **on the same CMS line**",
   "Tell John Doe **what you are doing** about a bill"
  ],
  "donts": [
   "A lien logged **at the billed amount**",
   "A contractual write-off treated as **the client's debt**",
   "A bill sent to PIP **after 06/26/2026**"
  ],
  "theory": {
   "lead": "Every payer reports what it did with a bill: the Health Plan in an **Explanation of Benefits**, PIP in its payment history. Read both before any lien.",
   "concepts": [
    {
     "term": "Explanation of Benefits",
     "text": "The plan's account of one processed claim: **not a bill**, but proof of who paid what"
    },
    {
     "term": "Billed vs. Allowed",
     "text": "Billed is the provider's charge; allowed is the plan's fee schedule. **The gap is written off** in network"
    },
    {
     "term": "Remark Codes",
     "text": "Short codes that explain each line: CO-45 is the fee-schedule write-off, AC1 **flags a possible accident**"
    },
    {
     "term": "Member Responsibility",
     "text": "The deductible, copay and coinsurance left to the patient: **the most a provider may bill** in network"
    },
    {
     "term": "Balance Billing",
     "text": "Billing the patient for a contractual write-off: **not allowed in network**, so an error, not a lien"
    },
    {
     "term": "PIP Payment History",
     "text": "The carrier's ledger of every PIP check: date of service, amount paid and **the limit remaining**"
    },
    {
     "term": "Exhaustion",
     "text": "Once PIP's limit is spent, later bills come back unpaid: **route them to the next payer**"
    },
    {
     "term": "Reconciliation",
     "text": "Matching every provider balance to each payer's EOB or check, so **no paid bill becomes a lien**"
    }
   ],
   "pages": [
    "D4#35",
    "D3#20"
   ],
   "framework": {
    "title": "Reading an EOB",
    "kind": "flow",
    "steps": [
     {
      "label": "Match the claim",
      "text": "Member ID, claim number, provider and date of service against the CMS treatment record"
     },
     {
      "label": "Billed to allowed",
      "text": "The charge, the plan's allowed amount, and the contractual adjustment it wrote off"
     },
     {
      "label": "The patient's share",
      "text": "Deductible, copay and coinsurance: **member responsibility** is the most a provider may bill"
     },
     {
      "label": "What the plan paid",
      "text": "The payment, its date and its EFT or check number: where any reimbursement claim starts"
     },
     {
      "label": "Read the remark codes",
      "text": "CO-45 explains the write-off; AC1 flags an accident and the plan's reimbursement right"
     },
     {
      "label": "Reconcile and log",
      "text": "Tie it to the provider's statement and the lien register; flag any balance billing"
     }
    ],
    "note": "PIP's payment history reads the same way: date of service, billed, paid, check number and the limit remaining"
   }
  },
  "clues": {
   "dos": [
    [
     "Peach State's EOB for claim PS-2605-449021 lands on the desk.",
     "It is stamped THIS IS NOT A BILL across the top.",
     "The final row, $0.00, is the most Crescent may bill John Doe."
    ],
    [
     "Crescent billed $3,400.00 and Peach State paid $1,860.00.",
     "The Specials need one number; the lien register needs the other.",
     "Both figures sit side by side in a single entry."
    ],
    [
     "John Doe calls about a $1,540.00 statement from Crescent.",
     "Counsel gets it the same day and a correction request is drafted.",
     "He hears the next steps and when he will hear back."
    ]
   ],
   "donts": [
    [
     "Peach State's reimbursement claim is entered in the lien register.",
     "The plan paid $1,860.00 on Crescent's injection.",
     "The register shows $3,400.00, Crescent's full charge, instead."
    ],
    [
     "Crescent's 07/01/2026 statement asks John Doe for $1,540.00.",
     "The EOB lists that sum as a CO-45 contractual adjustment.",
     "Someone tells John Doe he owes it and logs it as a lien."
    ],
    [
     "A new Lakeside Orthopedics bill is ready to go out.",
     "Harbor Point's five checks already total $5,000.00.",
     "It comes back with a notice of exhaustion, unpaid."
    ]
   ]
  }
 },
 "d2m2-a1": {
  "image": "medical-visit",
  "situation": "02/23/2026. Urgent care's $685.00 went to PIP. Riverton Spine & Rehab, **out of network** for Peach State, starts care 02/24/2026. On 03/11/2026 Summit Imaging asks for **an LOP for the MRI**.",
  "steps": [
   "Run and record **the Payer Order** for each provider",
   "Prepare Riverton Spine & Rehab's LOP; **route it for signature**",
   "Transmit with the HIPAA authorization; ask for **a missed-visit alert**",
   "Record the assessment and **the 2021 pre-morbid baseline**",
   "Decline Summit in writing, **naming Harbor Point PIP**"
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
   "An LOP to a provider **PIP would have paid**",
   "Answering **“paid in full?”** beyond the LOP's terms"
  ]
 },
 "d2m2-lop": {
  "image": "client-call",
  "hook": "An LOP gets John Doe treated now, paid **from the settlement**.",
  "points": [
   "An LOP is **a promise against the recovery**, not insurance",
   "Use it **only after every payer** is checked",
   "Track the balance: **ledger every 30 days**",
   "Referrals: **options and logistics**, never which care"
  ],
  "upl": "Give the options and book **his choice**; never recommend a provider",
  "job": [
   [
    "No payer covers the care",
    "Check payers; route to counsel",
    "CMS → Insurance · Case Notes",
    "Payer check on file"
   ],
   [
    "The LOP is signed",
    "File it; set ledger task",
    "CMS → Liens · Tasks",
    "Balance tracked monthly"
   ],
   [
    "“Where should I go?”",
    "Give options; book his choice",
    "CMS → Parties · Calendar",
    "His choice logged, no advice"
   ]
  ],
  "dos": [
   "Check **every payer** before an LOP",
   "Give **options with facts**; he chooses",
   "Disclose **any firm relationship**"
  ],
  "donts": [
   "Saying one provider is **better for the case**",
   "Calling the LOP bill **free**",
   "Letting the balance **surprise the Net Sheet**"
  ],
  "theory": {
   "lead": "A **Letter of Protection** keeps care going when no payer will: the firm promises the provider payment from the settlement.",
   "concepts": [
    {
     "term": "Letter of Protection (LOP)",
     "text": "The firm's written promise to pay a provider's bill from the settlement: **a claim against the recovery**, not insurance"
    },
    {
     "term": "Payer-First",
     "text": "Health insurance, MedPay and PIP are checked first; the LOP is **the last resort**, and the reason is recorded"
    },
    {
     "term": "The LOP Balance",
     "text": "Grows with every visit; the itemized ledger every 30 days keeps **the Liens tab and the Net Sheet** current"
    },
    {
     "term": "Provider Referrals",
     "text": "Options and logistics only: a list, network status, the booking. **The client chooses**; any firm relationship is disclosed"
    }
   ],
   "pages": []
  },
  "clues": {
   "dos": [
    [
     "John Doe has no plan that covers chiropractic care.",
     "Health insurance, MedPay and PIP were checked first.",
     "The file records why an LOP is the last resort."
    ],
    [
     "Riverton Spine & Rehab bills under an LOP.",
     "Its ledger grows with every visit.",
     "The Case Manager requests the itemized ledger every 30 days."
    ],
    [
     "John Doe asks the Case Manager where to go for treatment.",
     "He gets a short list with locations, hours and network status.",
     "He chooses, and the Case Manager books his choice."
    ]
   ],
   "donts": [
    [
     "A Case Manager tells John Doe one clinic writes reports that help cases.",
     "It sounds helpful and well meant.",
     "It steers his care: that is the UPL line."
    ],
    [
     "John Doe hears the LOP means he pays nothing.",
     "The bill is paid from the settlement.",
     "He still owes the balance if the recovery falls short."
    ],
    [
     "The LOP was signed after the third visit.",
     "The first visits have no protection.",
     "An LOP is signed before the first visit and filed."
    ]
   ]
  }
 },
 "d2m2-l2": {
  "image": "escalation-alert",
  "roadmap": {
   "title": "Treatment Monitoring: the Roadmap",
   "steps": [
    {
     "label": "Check in",
     "text": "Visits, pain, function, and **any barrier**"
    },
    {
     "label": "Name the variance",
     "text": "Clinical, psychosocial or systemic"
    },
    {
     "label": "Assess",
     "text": "Medical danger to the provider; legal danger to Atty. Thorne"
    },
    {
     "label": "Coordinate",
     "text": "Clarify with the office; **remove the barrier**"
    },
    {
     "label": "Track",
     "text": "Every fix attempt in a GIRP note, facts only"
    }
   ]
  },
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
      "Establishing causation and PIP coverage"
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
  },
  "clues": {
   "dos": [
    [
     "Riverton's attendance log shows empty slots starting 04/03/2026.",
     "The defense reads absences as an injury not serious enough to treat.",
     "After the second no-show, the clinic hears about it from the Case Manager."
    ],
    [
     "A summary for counsel describes John Doe's hand and his herniation.",
     "One flipped word here damages credibility with every reader.",
     "Each mention of a side is checked: this file has only one."
    ],
    [
     "John Doe loses his transport and starts missing PT.",
     "The 14-Day Gap is still being reconstructed after the fact.",
     "This disruption goes in a GIRP note on its very first day."
    ]
   ],
   "donts": [
    [
     "Four visits are missed after transport disappears in April 2026.",
     "Evening slots and rides from Margaret Doe sit unused.",
     "The schedule stays exactly as written, crisis or not."
    ],
    [
     "A referral authorization stalls for reasons outside John Doe's control.",
     "His missed visits get labelled non-compliance in the notes.",
     "The GIRP note points at him instead of the process."
    ],
    [
     "A carrier is stalling on a request that blocks therapy.",
     "The office manager and a written carrier notice both get skipped.",
     "The ladder is climbed from the top rung down."
    ]
   ]
  }
 },
 "d2m2-a2": {
  "image": "car-transport",
  "situation": "04/08/2026: John Doe missed 04/03 and 04/07; **no visit since 04/02/2026**. Keystone ended Margaret's rental 03/19/2026, his carpool ended 04/01/2026, and **the Civic awaits parts**.",
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
 "d2m2-a3": {
  "image": "checklist-qa",
  "situation": "04/22/2026: John Doe's voicemail. Lakeside booked his injection at **Millbrook Interventional Pain Center** for 05/14/2026. He won't go: too far, no ride, and he **heard it's out of network**.",
  "steps": [
   "Call John Doe back: **his choice of facility**, no medical advice",
   "Redirect the referral to **Crescent Pain & Spine** with Janelle Brooks",
   "Book **05/15/2026** with John Doe on the line; cancel Millbrook",
   "Calendar, Parties, Peach State, records, transport: **done or delegated**",
   "Write the GIRP note and **report to Atty. Thorne**"
  ],
  "deliver": "A CMS task list: every task **Done by me** or Delegated, owner and date",
  "checks": [
   "Crescent **verified in network** with Peach State, not hearsay",
   "Crescent's 05/15/2026 slot: **no new Treatment Gap**",
   "Millbrook cancelled; **calendar and reminders** updated",
   "Records request **delegated with an owner** and due date",
   "**No medical advice**; no talk of claim value"
  ],
  "dos": [
   "Read **Dr. Reyes's referral note** before you call anyone",
   "Give every open task **an owner and a date**"
  ],
  "donts": [
   "Telling John Doe **which facility is better** medically",
   "Repeating **what John heard** about the network, unverified"
  ]
 },
 "d1m1-l2": {
  "image": "money-ledger",
  "roadmap": {
   "title": "Who Pays What: the Roadmap",
   "steps": [
    {
     "label": "HIPAA authorization",
     "text": "Claim-specific, naming the incident date"
    },
    {
     "label": "Medicare and Medicaid check",
     "text": "Age and SSDI status verified, **the answer recorded**"
    },
    {
     "label": "Payer Order",
     "text": "PIP first, then health insurance, then LOP or liens"
    },
    {
     "label": "Flag the Health Plan",
     "text": "Reimbursement right logged **on first notice**"
    },
    {
     "label": "Lien register",
     "text": "Carrier, member ID and group number, the same day"
    }
   ]
  },
  "hook": "A reimbursement claim found after the demand comes out of **the client's net**.",
  "points": [
   "Clear the Triple-Check first: **HIPAA, BCRC, Payer Order**",
   "Payer Order: PIP/MedPay, private health insurance, **then LOP/provider liens**",
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
  },
  "clues": {
   "dos": [
    [
     "Retainer signed, John Doe is ready to start treatment talks.",
     "HIPAA release, BCRC answer, and Payer Order sit on a checklist.",
     "All three are cleared first; only then does treatment mapping begin."
    ],
    [
     "John Doe is 34, so the age trigger is ruled out.",
     "His SSDI status still needs checking under MMSEA rules from 2007.",
     "The Benefits Coordination & Recovery Center answer gets logged with its timestamp."
    ]
   ],
   "donts": [
    [
     "Peach State and providers need permission to share John Doe's records.",
     "A boilerplate HIPAA form goes out from the supply drawer.",
     "Nowhere on it does 02/06/2026 appear, so providers may balk."
    ],
    [
     "John Doe worries out loud about his growing Medical Bills.",
     "Peach State has already asserted reimbursement against any settlement.",
     "You tell him not to worry, the plan pays everything."
    ]
   ]
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
  "deliver": "A **dated, flagged lien record** you could negotiate from on Day 4",
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
 "d2m2-kc": {
  "image": "knowledge-check",
  "questions": [
   "Read Peach State's 06/03/2026 EOB line by line. What does **each amount** mean for the file?",
   "Crescent bills John Doe $1,540.00 on 07/01/2026. **What do you do**, and what do you tell him?",
   "Using **the Payer Order**, explain Riverton's LOP and Summit's decline, and what you may tell each provider."
  ]
 },
 "d2m3-l1": {
  "image": "intake-interview",
  "roadmap": {
   "title": "The Gap Interview: the Roadmap",
   "steps": [
    {
     "label": "Plan the questions",
     "text": "Read the records; write questions, **never expected answers**"
    },
    {
     "label": "Open on the record",
     "text": "Date, participants, your role, his consent, privacy"
    },
    {
     "label": "Ask open, follow his words",
     "text": "Broad first, his words next, closed questions last"
    },
    {
     "label": "Ask for the paper",
     "text": "Work schedules, doctor notes, travel logs, **illness records**"
    },
    {
     "label": "Read it back",
     "text": "He corrects your summary; opinion questions routed"
    },
    {
     "label": "Record and task",
     "text": "His words as given; a dated task per document"
    }
   ]
  },
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
  },
  "clues": {
   "dos": [
    [
     "The recorded call with John Doe about the 14-day gap begins.",
     "Broad questions come early; dates and names get pinned at the end.",
     "The opener sounds like: take me through the days after the crash."
    ],
    [
     "John Doe says he figured the pain would pass.",
     "The Case Manager repeats it back in his own words.",
     "He gets the chance to fix anything the summary got off."
    ],
    [
     "John Doe's 03/05/2026 consult with Dr. Reyes gets confirmed.",
     "Margaret Doe's rental, his ride to care, ends 03/19/2026.",
     "Transport gets lined up now, so no new break in care appears."
    ]
   ],
   "donts": [
    [
     "The question plan for the gap call is being drafted.",
     "John Doe agrees easily, and the account stops being his.",
     "“Was it because you had no car?” goes on the list."
    ],
    [
     "John Doe asks whether the gap will sink his claim.",
     "Any answer about value belongs to Atty. Thorne alone.",
     "He hears that it won't matter, or that it will hurt."
    ],
    [
     "John Doe explains he expected the pain to pass on its own.",
     "The tone of the next question turns sharp and judging.",
     "He stops telling the whole story to the firm."
    ]
   ]
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
  },
  "clues": {
   "dos": [
    [
     "The 14-Day Gap needs proof made at the time.",
     "The EMS report, Riverton Drug receipt and Northgate call-outs are on hand.",
     "Those get gathered first; a Causation Letter request comes later."
    ],
    [
     "The EMS report says John Doe declined transport on 02/06/2026.",
     "Every summary of a history gets compared with the original wording.",
     "Neck stiffness stays neck stiffness, word for word, in the timeline."
    ],
    [
     "The treatment timeline from 02/06 to 06/19 is being built.",
     "Unexplained breaks in care read to an adjuster as healed.",
     "The 14-day gap and the 19-day disruption both show, with dates."
    ]
   ],
   "donts": [
    [
     "A PT note and Dr. Reyes's findings disagree.",
     "A letter to the clinic asks it to clarify the note.",
     "The request spells out the exact wording the clinic is to use."
    ],
    [
     "The timeline for the demand is nearly finished.",
     "Fourteen days between 02/06 and 02/20/2026 look awkward on paper.",
     "They quietly vanish from the chart, in hopes Keystone misses them."
    ]
   ]
  }
 },
 "d2m3-a2": {
  "image": "calendar-gap",
  "situation": "06/22/2026. MMI reached 06/12/2026; Dr. Reyes's **06/19/2026 Causation Letter** is in. Atty. Thorne wants **the Gap Explanation Record** before the pre-demand strategy session.",
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
   "Documenting the 14-day gap and **forgetting the 19-day disruption**",
   "Presenting **the client's word as documented**"
  ]
 },
 "d2m3-kc": {
  "image": "knowledge-check",
  "questions": [
   "Name the **four reasons** for the 14-day gap and, beside each, its corroborating document and date.",
   "Rewrite “Was it because you had no car?” **without suggesting the reason**. What does the leading version cost?",
   "“Is this gap going to wreck my case?” Give **your exact answer**, then what you do next."
  ]
 },
 "d2m4-l1": {
  "image": "checklist-qa",
  "hook": "Most value is won or lost here: the demands spend only **what this audit proves**.",
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
     "text": "Health Plans, government payers and LOP providers may claim repayment from the recovery: **every lien shrinks the net**"
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
      "Medical Bills + lost wages + PD, every line documented"
     ],
     [
      "Financial and liens",
      "Lost wages",
      "Employer's wage letter plus a provider's work note; without both, usually rejected"
     ],
     [
      "Financial and liens",
      "Lien resolution",
      "**Every subrogation interest**: statutory, Health Plan, consensual LOP"
     ],
     [
      "Liability proof",
      "Report, witnesses, scene",
      "Final report; witness contact and statement drift; the physics possible"
     ],
     [
      "Property Damage deep dive",
      "Photos, estimates, Total Loss",
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
  },
  "clues": {
   "dos": [
    [
     "MMI is recorded from Lakeside Orthopedics' 06/12/2026 note.",
     "Duplicate lines, prior history and each gap get hunted down.",
     "The defense's attacks are rehearsed in-house before Keystone sees anything."
    ],
    [
     "$16,401.40 in Specials sits against a $10,000 BI limit.",
     "Peach State's $1,860.00 and Riverton's LOP wait behind that limit.",
     "Each interest gets registered while the ask is still being built."
    ],
    [
     "Atty. Thorne picks a random line in the Specials ledger.",
     "He wants to check it in seconds, not hours.",
     "Each number carries the document and date it came from."
    ]
   ],
   "donts": [
    [
     "The Demand Package is ready and the clock is ticking.",
     "Riverton's duplicate $185.00 line from 05/04/2026 is still in it.",
     "It ships anyway, math unchecked, and Keystone finds the slip."
    ],
    [
     "Lakeside's MMI note mentions possible repeat injections.",
     "They could cost $3,400 to $6,800 down the road.",
     "That range gets folded into the audited $16,401.40 total."
    ],
    [
     "Settlement paperwork is signed and the file feels finished.",
     "John Doe's share of the money is being calculated.",
     "A payer's reimbursement claim surfaces only once the signatures are dry."
    ]
   ]
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
  },
  "clues": {
   "dos": [
    [
     "The strategy brief for Atty. Thorne reaches its Risks section.",
     "The 14-Day Gap, the 2021 low-back visits and the declined transport.",
     "Counsel hears each weakness from the Case Manager first, not the adjuster."
    ],
    [
     "John Doe's account, the impact force and the C5-C6 herniation get compared.",
     "One piece out of line hands Keystone an easy out.",
     "Mismatches get caught in-house while there is still time to answer them."
    ],
    [
     "The demand is close, and the other side will go looking online.",
     "John Doe's posts are viewed, but none is touched.",
     "Any instruction about his accounts comes only from Atty. Thorne."
    ]
   ],
   "donts": [
    [
     "The summary memo for the strategy session is drafted.",
     "The bottom line hides somewhere below the chronology.",
     "It needs a stapler where one sheet was the limit."
    ],
    [
     "The exhibit index goes out with the memo.",
     "Atty. Thorne flips to the Causation Letter it lists.",
     "The listed location holds a different document entirely."
    ],
    [
     "The brief's force section covers Kevin Alvarez's Escape and the Civic.",
     "A $2,315.00 A-pillar supplement changed the Civic's repair figure.",
     "The brief still quotes $6,940.00 instead of $9,255.00."
    ]
   ]
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
   "Name **the four audit objectives** and one finding each produced on this file."
  ]
 },
 "d3m1-l1": {
  "image": "demand-letter",
  "roadmap": {
   "title": "The Time-Limited Demand: the Roadmap",
   "steps": [
    {
     "label": "Confirm the foundation",
     "text": "SOL, liability and coverage, each from its document"
    },
    {
     "label": "Within limits, clear terms",
     "text": "$10,000; who and what is released; **how to accept**"
    },
    {
     "label": "A reasonable window",
     "text": "Conditions Keystone can meet; 30 days"
    },
    {
     "label": "Document it",
     "text": "The package complete enough to evaluate inside the window"
    },
    {
     "label": "Serve and docket",
     "text": "Certified mail and email; **docket from receipt**"
    }
   ]
  },
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
      "text": "Lead the demand with the most graphic photo, Property Damage or injury, to **set the tone**"
     },
     {
      "label": "The Why Factor",
      "text": "Every bill in the demand carries **why the treatment was necessary** for the client's recovery"
     }
    ],
    "note": "Treat the carrier like a bank that hasn't paid its bill: the demand presents a debt owed."
   }
  },
  "clues": {
   "dos": [
    [
     "The Keystone demand left the office by certified mail on 07/20/2026.",
     "The green card came back showing delivery on 07/22/2026.",
     "Thirty days from that signed card lands on 08/21/2026, not 08/19."
    ],
    [
     "Dana Whitfield opens the Keystone package and reads page one.",
     "Keystone plans to call John Doe's neck injury degenerative wear.",
     "The 03/13/2026 C5-C6 finding and the injection open the letter."
    ],
    [
     "Keystone said yes to the $10,000 limit by 08/21/2026.",
     "Its check did not arrive until 09/04/2026, two weeks later.",
     "The thirty days govern the yes; check timing is Atty. Thorne's term."
    ]
   ],
   "donts": [
    [
     "The demand letter to Keystone is drafted and ready to sign.",
     "Nothing in it says when the offer expires or what starts the clock.",
     "With no date to answer by, Keystone can refuse at no cost."
    ],
    [
     "John Doe waited from 02/06 to 02/20/2026 for his first treatment.",
     "The demand's chronology skips those 14 days and hopes nobody counts.",
     "Dana Whitfield finds the missing two weeks herself and calls him healed."
    ],
    [
     "John Doe is still in therapy and the bills keep growing.",
     "No future-care plan exists yet, so the Specials are unfinished.",
     "The demand goes out ahead of the 06/12/2026 Maximum Medical Improvement note."
    ]
   ]
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
      "Medical Bills plus pain and suffering, as Atty. Thorne values them",
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
  },
  "clues": {
   "dos": [
    [
     "Two UM Demand Packages are being assembled on 08/31/2026.",
     "The UM adjusters will ask whether Keystone's $10,000 is truly spent.",
     "Page one holds the tender, the consents and the Limited Release."
    ],
    [
     "The Coverage Matrix shows Host UM as add-on, worth $20,000.",
     "Someone asks later who said add-on, and when they said it.",
     "The matrix cell names the Host carrier's letter and its March date."
    ],
    [
     "John Doe is an insured under both UM coverages on this file.",
     "Those carriers will dig into his 2021 low-back visits.",
     "Expect an IME request and a fresh liability check on Smith."
    ]
   ],
   "donts": [
    [
     "Keystone's paperwork arrives on 08/14/2026 for John Doe to sign.",
     "One line frees all persons, firms and corporations, plus every carrier.",
     "Signing it would free Harbor Point and Cardinal State, costing $30,000."
    ],
    [
     "John Doe calls asking how much the UM side will bring.",
     "Offset status at Cardinal State is still unconfirmed in writing.",
     "He hears $30,000 is guaranteed, with no coverage check done."
    ],
    [
     "The third carrier says yes and the stack hits $40,000 gross.",
     "Liens, fee and costs have not been subtracted yet.",
     "The office cheers while the client's take-home figure stays unknown."
    ]
   ]
  }
 },
 "d3m1-a2": {
  "image": "binder-exhibits",
  "situation": "File date 08/31/2026. Keystone tendered $10,000 limits 08/12; consents came 08/24 and 08/26; the **Limited Release was signed** 08/28. Keystone's **check hasn't arrived**. Keystone had called the MRI “degenerative.”",
  "steps": [
   "QC the desk's **Host UM draft** to Harbor Point",
   "QC **Relative UM to Cardinal State**: excess, not primary",
   "Put **exhaustion proof on page one**; show damages above collections",
   "Answer the gap and “degenerative” **with the MRI**",
   "**Leave the response deadline** blank for Atty. Thorne; route both"
  ],
  "deliver": "Two QC'd UM drafts, **exhaustion proof first**, routed for review",
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
   "Keystone calls the MRI degenerative, citing the 14-day gap. **Which documents answer each**, and where?"
  ]
 },
 "d3m2-l1": {
  "image": "negotiation",
  "hook": "Map both attacks and their answers before the first call; **every stall becomes a record**.",
  "points": [
   "Build **the battle map** first: net floor, value drivers, attacks, rebuttals",
   "Net floor: **$12,677.63 gross**, above Keystone's $10,000 limit",
   "Anchor on **$16,401.40 total Specials**, not PIP's $5,000",
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
  },
  "clues": {
   "dos": [
    [
     "Dana Whitfield calls with a low offer on the Keystone claim.",
     "The line goes quiet the moment her figure lands.",
     "Next comes a question: what records support that $3,500 figure."
    ],
    [
     "Dana Whitfield calls the 14-Day Gap proof of a minor injury.",
     "Raising your voice hands the carrier a note for its file.",
     "Calm tone, dated documents, polite but unmoved on the demand."
    ],
    [
     "Keystone's adjuster says the MRI shows degenerative change.",
     "A stock rebuttal paragraph from another file sits ready to paste.",
     "Instead, Dr. Park's adjacent-level line and John Doe's dates get quoted."
    ]
   ],
   "donts": [
    [
     "Dana Whitfield sighs that $10,000 seems awfully steep for this claim.",
     "The caller hints the ask could come down a little.",
     "Hoping to sound reasonable, the trainee shaves the figure unprompted."
    ],
    [
     "The call with Keystone starts in five minutes.",
     "Nobody has added liens, costs and fee for John Doe yet.",
     "Below $12,677.63 gross he walks away with zero, and nobody knows."
    ],
    [
     "Dana Whitfield says she is still waiting on authority.",
     "She promises to get back to you sometime soon.",
     "No date is set while 08/21/2026 keeps ticking closer."
    ]
   ]
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
   "Gap answered with **the Gap Explanation Record** and dated documents",
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
      "Itemized Medical Bills, complete medical records, lost wage verification, future medical estimates"
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
  },
  "clues": {
   "dos": [
    [
     "Keystone's $10,000 alone leaves John Doe with nothing once liens are paid.",
     "Margaret Doe's coverage at Cardinal State counts because John lives with her.",
     "Layering the host car's UM on top builds the $40,000 total."
    ],
    [
     "Two UM carriers stand behind Keystone on John Doe's file.",
     "One question decides whether Host UM is worth $20,000 or $10,000.",
     "A dated letter from each carrier settles add-on versus reduction."
    ],
    [
     "John Doe asks when the UM money will show up.",
     "Demand, evaluation, possibly an IME, then negotiation lie ahead.",
     "He hears the steps and timing, but no dollar figure is pledged."
    ]
   ],
   "donts": [
    [
     "Harbor Point makes its first UM offer on 09/14/2026.",
     "The thinking goes that John Doe's own carrier surely plays fair.",
     "Taking the opening number because he is their insured leaves money behind."
    ],
    [
     "Marcus Bell agrees on the phone to pay the UM limit.",
     "Everyone hangs up happy and moves on to other files.",
     "Weeks later, nothing on paper shows what anyone agreed to."
    ],
    [
     "The five checks have gone out and the Trust Ledger reads zero.",
     "A health-benefit carrier then sends a reimbursement claim.",
     "Nothing is left in trust to pay it, and John Doe is exposed."
    ]
   ]
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
   "Recovery Ledger **$40,000.00 gross**; PIP, Keystone PD, Bluewater excluded",
   "Each UM release signed **before its check**; deposited same day"
  ],
  "dos": [
   "**Quote the carrier**; never paraphrase its reasons"
  ],
  "donts": [
   "Adding **PIP or property-damage payments** to the gross",
   "Depositing a UM check **before its release is signed**"
  ]
 },
 "d3m2-kc": {
  "image": "knowledge-check",
  "questions": [
   "**Math-check Keystone's $3,500**: fee, costs, unreduced liens, net. What does it show, and who tells John Doe?",
   "Dana Whitfield cites the 14-Day Gap and a degenerative MRI. Answer both: **four documents** and the radiologist's words.",
   "Add-on PIP: what do its $5,000, **exhausted and non-subrogated**, mean for valuation? And in no-fault?"
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
      "Self-funded employer Health Plans",
      "Very low: governed by federal law, notoriously hard to reduce"
     ]
    ],
    "note": "Statutory claims have stronger legal backing than contractual ones. Every compromise needs Atty. Thorne's express authority."
   }
  },
  "clues": {
   "dos": [
    [
     "Medicare shows no interest in John Doe's recovery.",
     "The Lien Tracker gets a line even though nothing is owed.",
     "That line says who confirmed it, such as the BCRC check, and when."
    ],
    [
     "A Reduction Request to Peach State Health Plan is being drafted.",
     "Atty. Thorne picked common fund as the basis for the ask.",
     "The letter spells out $1,860.00 minus $620.00 equals $1,240.00."
    ],
    [
     "The $40,000 sits in trust, waiting to go out.",
     "Peach State and Riverton Spine & Rehab both still hold claims.",
     "Each one gets a signed letter closing it out first."
    ]
   ],
   "donts": [
    [
     "A Health Plan asserts reimbursement against the settlement.",
     "Self-funded ERISA plans answer to federal law and resist cuts.",
     "The trainee haggles with it the way one haggles with Riverton."
    ],
    [
     "The trainee phones Peach State's recovery unit about its $1,860.00.",
     "No doctrine is named and no math is attached.",
     "The whole pitch is asking for a favor, pretty please."
    ]
   ]
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
  "roadmap": {
   "title": "Reducing the Liens: the Roadmap",
   "steps": [
    {
     "label": "Audit the bill",
     "text": "Line by line against the records; **corrections first**"
    },
    {
     "label": "Run the math",
     "text": "Pro rata shares, computed from the fraction"
    },
    {
     "label": "Ask with authority",
     "text": "Atty. Thorne's written request and target"
    },
    {
     "label": "Payoff Letter",
     "text": "Full and final, in writing, **before any payment**"
    },
    {
     "label": "Update the ledger",
     "text": "The day a reduction is confirmed; show John Doe"
    }
   ]
  },
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
    "Provider's Final Ledger received",
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
  },
  "clues": {
   "dos": [
    [
     "Riverton Spine & Rehab bills 34 lines at $185.00 each.",
     "The treatment notes show only 33 visits; 05/04/2026 appears twice.",
     "The duplicate comes off, then the reduction talk starts from $6,105.00."
    ],
    [
     "Peach State agrees to $1,240.00 on 10/09.",
     "The Net Sheet is updated that same day.",
     "John Doe sees his take-home climb with each saved dollar."
    ],
    [
     "Riverton's billing office agrees to $4,580.00 over the phone.",
     "Disbursement is still days away on 10/22.",
     "A signed Payoff Letter with full-and-final language lands in the file."
    ]
   ],
   "donts": [
    [
     "Riverton's $6,290.00 ledger arrives, and nobody compares it to the notes.",
     "The 05/04/2026 duplicate line stays buried in the total.",
     "Haggling for a percentage off starts from the padded figure."
    ],
    [
     "Riverton's biller says sure, $4,580.00 works for them.",
     "Nobody sends or receives a letter about it.",
     "Later the full balance shows up, and nothing proves the deal."
    ],
    [
     "Disbursement day arrives for Riverton Spine & Rehab's check.",
     "A monthly bill from the provider sits on the desk.",
     "The check is cut from that bill, not the signed payoff figure."
    ]
   ]
  }
 },
 "d3m3-l3": {
  "image": "checklist-qa",
  "hook": "A reduction is won **on paper first**, then on the phone.",
  "points": [
   "Negotiate from **the audited balance**: $7,965.00",
   "Send **the Reduction Request** before you call",
   "Make **Atty. Thorne's ask**, nothing outside it",
   "**No Payoff Letter**, no payment"
  ],
  "upl": "The authorized ask only; never accept a figure outside it",
  "job": [
   [
    "Audited balance confirmed",
    "Draft the Reduction Request",
    "CMS → Documents → Outgoing",
    "Authority logged first"
   ],
   [
    "Lienholder responds",
    "Call with the authorized ask",
    "CMS → Case Notes",
    "Counter routed the same day"
   ],
   [
    "Reduction agreed",
    "Get the signed Payoff Letter",
    "CMS → Net Sheet",
    "Full-and-final on file"
   ]
  ],
  "dos": [
   "Send **the request** before the call",
   "Update the ledger **the same day**"
  ],
  "donts": [
   "A reduction **agreed only by phone**",
   "An ask **outside his authority**"
  ],
  "theory": {
   "lead": "The lienholder takes less when it can **see the math** and sign a letter that closes the bill.",
   "concepts": [
    {
     "term": "Reduction Request",
     "text": "The written ask: **audited balance**, recovery, fee and costs, other liens and the common-fund share."
    },
    {
     "term": "Authority",
     "text": "Atty. Thorne's written floor for each lien: **the CM asks inside it** and routes anything outside."
    },
    {
     "term": "Payoff Letter",
     "text": "The lienholder's signed **full-and-final** satisfaction: no balance billing, no collections."
    }
   ],
   "pages": [
    "D3#21",
    "D3#22"
   ]
  },
  "clues": {
   "dos": [
    [
     "Riverton's audited balance is $6,105.00.",
     "A letter with the recovery, fee, costs and other liens goes out first.",
     "Atty. Thorne's written authority is already in the file."
    ],
    [
     "Peach State agrees to $1,240.00.",
     "The Net Sheet changes that afternoon.",
     "John Doe sees his take-home rise before he asks."
    ]
   ],
   "donts": [
    [
     "Riverton's biller says $4,580.00 works for them.",
     "Nothing is sent and nothing comes back signed.",
     "The full balance reappears a month later."
    ],
    [
     "The provider counters below the floor.",
     "The CM says yes to close it out.",
     "Atty. Thorne hears about it after the fact."
    ]
   ]
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
   "**Statutory, contractual or none?** Peach State, Riverton Spine & Rehab, PIP, Medicare/Medicaid, prior attorney. Rank liens by reducibility.",
   "Peach State is a **fully insured group plan**. Why does that matter to reducing $1,860.00, and who decides?",
   "Show the math, $1,860.00 to $1,240.00, and **name the doctrine**. How does beating the 14-Day Gap support it?"
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
  },
  "clues": {
   "dos": [
    [
     "Riverton's line on the Net Sheet drops from $6,290.00 to $4,580.00.",
     "Atty. Thorne asks why each number moved.",
     "Beside it: the 05/04 duplicate and the one-third procurement-cost basis."
    ],
    [
     "Keystone opened at $3,500 on the gap and the MRI.",
     "The BI side closed at $10,000; UM added $30,000.",
     "Two columns, BI and UM, sit next to each other for John Doe."
    ],
    [
     "John Doe sits down to review his $20,359.92 net.",
     "Each fee, cost and lien figure matches its receipt and letter.",
     "He leaves confident the firm counted his recovery honestly."
    ]
   ],
   "donts": [
    [
     "Keystone's check and both UM checks get posted to the ledger.",
     "All $40,000 lands on one undivided line.",
     "Nobody can tell which carrier paid what or price the fee separately."
    ],
    [
     "The certified mail receipt for $72.00 gets posted.",
     "It lands in full on the BI column.",
     "Then it lands in full on the UM column too."
    ],
    [
     "Riverton Spine & Rehab's figure goes onto the Lien Tracker.",
     "Its status column for full-and-final paperwork sits blank.",
     "A check goes out with no signed satisfaction from the provider."
    ]
   ]
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
   "PIP and Crescent's write-off **kept off the payables**",
   "**Future ESIs flagged** to Atty. Thorne before John Doe signs"
  ],
  "dos": [
   "Compute the UM share **as the remainder** of each split"
  ],
  "donts": [
   "Marking a lien final **from an email or phone call**",
   "Adding **PIP's $5,000.00** to the payables"
  ]
 },
 "d3m4-l2": {
  "image": "release-signature",
  "roadmap": {
   "title": "From Release to $0.00: the Roadmap",
   "steps": [
    {
     "label": "Audit the release",
     "text": "Who is released, which claims, **what John promises**"
    },
    {
     "label": "UM consents first",
     "text": "Both consents in before the BI release is signed"
    },
    {
     "label": "Settlement Statement",
     "text": "How $40,000.00 becomes his net, full and final"
    },
    {
     "label": "Trust and clearance",
     "text": "IOLTA the same day; nothing paid on uncleared funds"
    },
    {
     "label": "Disburse and reconcile",
     "text": "Payoff Letters, Atty. Thorne's signature, **ledger at $0.00**"
    }
   ]
  },
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
  },
  "clues": {
   "dos": [
    [
     "Four kinds of paperwork wait for signatures to close the file.",
     "The W-9 goes to the payee; the release goes to John Doe.",
     "The Payoff Letter belongs to the lienholder, the stipulation to the attorneys."
    ],
    [
     "John Doe's paperwork comes back with something missing.",
     "A vague note saying incomplete stalls the file for weeks.",
     "The kickback names the missing item and sets a firm date."
    ],
    [
     "A payment request from Riverton Spine & Rehab hits the queue.",
     "Last time, the 05/04/2026 line showed up twice on their bill.",
     "Each billing ID gets checked against the ledger first."
    ]
   ],
   "donts": [
    [
     "Keystone's 08/14/2026 draft says it frees all other insurers.",
     "Harbor Point and Cardinal State would walk away clean.",
     "John Doe signs and loses $30,000 of UM recovery."
    ],
    [
     "The UM check from Cardinal State hit IOLTA on 10/13.",
     "The bank shows the deposit as pending until 10/20.",
     "Five disbursement checks go out that same week anyway."
    ],
    [
     "An email arrives saying Riverton has new bank details.",
     "It asks that the payoff go to the new account.",
     "The check is wired with no call to a number on file."
    ]
   ]
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
   "The Trust Ledger reads $0.00 after 10/22/2026. **Which records prove it**, and what would a leftover balance mean?"
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
      "“The Property Damage was too low for this injury.”",
      "Low-velocity impacts can still injure the spine; point to the imaging"
     ]
    ],
    "note": "Log every stall the day it happens; any new number is Atty. Thorne's to answer, never yours."
   }
  },
  "clues": {
   "dos": [
    [
     "A Keystone voicemail arrives while you juggle five other files.",
     "Weeks later, the impasse memo leans on exact dates, not recollection.",
     "The log entry carries the same date as the call itself."
    ],
    [
     "Keystone says its $3,500 offer is final, and gives no reason.",
     "Atty. Thorne needs a carrier position he can actually quote back.",
     "You ask Keystone to put its grounds and evidence on paper."
    ],
    [
     "Two follow-ups to Dana Whitfield, 08/24 and 08/31, sit unanswered.",
     "Before anyone calls impasse, one more rung above her gets tested.",
     "On 09/02 an email goes to the claims boss over Dana Whitfield."
    ]
   ],
   "donts": [
    [
     "Keystone has gone quiet since its final word on 08/12.",
     "Meanwhile $40,000 of coverage stays frozen behind a $10,000 carrier.",
     "The plan is to sit tight until October and hope Keystone calls."
    ],
    [
     "Keystone stalls on BI, and the UM layers look tempting.",
     "Harbor Point's $20,000 only opens once Keystone's $10,000 is paid or tendered.",
     "A limits demand goes out to Marcus Bell while Keystone still holds."
    ],
    [
     "John Doe calls, worried, asking what comes next with Keystone.",
     "What the stall means for his claim belongs to Atty. Thorne alone.",
     "You tell him a judge and a lawsuit are coming for sure."
    ]
   ]
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
  },
  "clues": {
   "dos": [
    [
     "Atty. Thorne's dated authorization to sue lands on the file.",
     "Status, court fields, folders and the calendar all need changing.",
     "Every change gets made together, before you leave your desk."
    ],
    [
     "A deadline sits on the Litigation Calendar, colored and alerted.",
     "A grayscale exhibit or missed date can cost evidence or leverage.",
     "Forty-eight hours out, you check the exhibits and dates line by line."
    ],
    [
     "Two sessions loom: Hon. Carla Benton (Ret.) and Laura Whitcomb, Esq.",
     "One cares about valuation; the other weighs admissible evidence.",
     "Each binder is built for the person in that chair."
    ]
   ],
   "donts": [
    [
     "The scanner spits out a filed Complaint at the end of the day.",
     "Later, nobody searching 01_PLEADINGS can tell what the PDF is.",
     "The file keeps its scanner name: scan001.pdf."
    ],
    [
     "Two sessions are on the calendar: 03/18/2027 and 06/22/2027.",
     "One neutral can only facilitate; the other issues a binding award.",
     "Both get the identical prep, binder and expectations."
    ],
    [
     "Laura Whitcomb, Esq.'s award arrives with a math slip in it.",
     "Courts vacate or correct awards only on narrow grounds, quickly.",
     "Someone shrugs and says a higher court will fix it later."
    ]
   ]
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
   "08/12: Keystone calls $3,500 “final”. Using **the “Never” rule**, what's next, and what needs Atty. Thorne's authority?"
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
  },
  "clues": {
   "dos": [
    [
     "Robert Smith was served 10/14/2026, and an answer date is due.",
     "Weeks later a colleague needs to re-check how 11/13/2026 was reached.",
     "The entry shows the service date, the 30-day rule and the math."
    ],
    [
     "A court rule reads two ways, and the dates differ.",
     "An earlier date costs time; a later one can cost rights.",
     "You docket the earlier reading and flag it to Atty. Thorne."
    ]
   ],
   "donts": [
    [
     "Robert Smith was served on 10/14/2026, and the count begins.",
     "The answer date comes out one day earlier than 11/13/2026.",
     "The service date itself gets counted as day one."
    ],
    [
     "The arbitration brief is due 10 days ahead of the 06/22/2027 hearing.",
     "The count lands on 06/12/2027, a Saturday.",
     "The date gets pushed to the next business day after Sunday."
    ],
    [
     "John Doe's limitation date, 02/06/2028, falls on a Sunday.",
     "The firm's internal dates sit at 02/04/2028 and 11/05/2027.",
     "The calendar shows only the Sunday, counting on a grace day."
    ]
   ]
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
 "d4m2-um": {
  "image": "coverage-check",
  "hook": "A UM claim is made against **our own client's insurance**, not the other driver's.",
  "points": [
   "Third party: Keystone. **First party: Harbor Point and Cardinal State**",
   "The route is **read off the clause**, never chosen",
   "Mandatory arbitration: file a **Demand for Arbitration**, not a complaint",
   "Bad faith is **a separate suit**, above the policy limit"
  ],
  "upl": "Read the clause, route it to Atty. Thorne; never call an offer unreasonable.",
  "job": [
   [
    "UM offers come back low",
    "Memo with both clauses quoted",
    "CMS → Case Notes",
    "Sent same day, uninterpreted"
   ],
   [
    "Clauses in hand",
    "Ask the route per layer",
    "CMS → Tasks → Atty. Thorne",
    "Nothing recommended, everything asked"
   ],
   [
    "Route decided in writing",
    "Open the ADR entry",
    "CMS → ADR tab",
    "Typed UM / UIM arbitration"
   ]
  ],
  "dos": [
   "Say **first party or third party** before anything else",
   "Quote the clause; **a paraphrase is interpretation**"
  ],
  "donts": [
   "**Filing suit** where the policy sends it to arbitration",
   "Reading Harbor Point's clause **onto Cardinal State**",
   "Telling John Doe the carrier is **acting in bad faith**"
  ],
  "theory": {
   "lead": "A UM/UIM claim is a **first-party claim** against the client's own policy, so the impasse route is set by that contract and the state's law.",
   "concepts": [
    {
     "term": "First-Party Claim",
     "text": "Made against **the client's own coverage**, under a contract he pays premiums on"
    },
    {
     "term": "Third-Party Claim",
     "text": "Made against **the at-fault driver's carrier**, here Keystone Mutual for Robert Smith"
    },
    {
     "term": "Mandatory Arbitration Clause",
     "text": "A policy term sending the dispute to an arbitrator; the firm files **a Demand for Arbitration**"
    },
    {
     "term": "Insurance Bad Faith",
     "text": "A separate suit for unreasonable handling, which **can exceed the policy limit**"
    }
   ],
   "pages": [
    "D2#33",
    "D4#2"
   ],
   "framework": {
    "title": "The UM Dispute Flow",
    "kind": "flow",
    "steps": [
     {
      "label": "Claim submission",
      "text": "The UM Demand Package, with proof the at-fault limits were exhausted"
     },
     {
      "label": "Dispute",
      "text": "The carrier offers far under value, or denies liability or coverage"
     },
     {
      "label": "Resolution route",
      "text": "Demand for Arbitration, or suit against the carrier: state law and the clause decide"
     }
    ],
    "note": "Bad faith sits off this flow: a separate action about the carrier's handling, and Atty. Thorne's call alone."
   }
  },
  "clues": {
   "dos": [
    [
     "Keystone insured the driver who ran the stop sign.",
     "Harbor Point and Cardinal State insure our own side.",
     "Which it is changes the duties, the defences and the exit."
    ],
    [
     "Marcus Bell will not move off his 03/31/2027 number.",
     "Atty. Thorne needs the policy's own words in front of him.",
     "You copy the paragraph across rather than summarise it."
    ]
   ],
   "donts": [
    [
     "The UM negotiation with Harbor Point has plainly failed.",
     "Its policy says where a dispute under it is decided.",
     "You reach for a complaint because the BI claim went that way."
    ],
    [
     "Two UM layers, two carriers, two certified policies.",
     "Only one of them has arrived with its paragraph legible.",
     "You assume the second one says what the first one does."
    ],
    [
     "John Doe rings, angry about an offer worth a third.",
     "Whether handling was unreasonable is a legal opinion.",
     "You agree with him on the phone and name the consequence."
    ]
   ]
  }
 },
 "d4m2-l2": {
  "image": "mediation-table",
  "hook": "Hon. Carla Benton (Ret.) helps parties agree; **Laura Whitcomb, Esq. decides**, with almost no appeal.",
  "roadmap": {
   "title": "Standard Case Progression Roadmap",
   "steps": [
    {
     "label": "Demand & Negotiation",
     "text": "Treatment ends, the demand goes out and **the carrier evaluates it**"
    },
    {
     "label": "Pre-Litigation Mediation",
     "text": "Optional: both sides mediate **before any complaint is filed**"
    },
    {
     "label": "Pre-Filing Arbitration",
     "text": "Only where **a signed clause** compels arbitration instead of court"
    },
    {
     "label": "Complaint Filed",
     "text": "Negotiation fails, suit is filed and **the court's clock starts**"
    },
    {
     "label": "Discovery & Mediation",
     "text": "Evidence exchanged; courts often **order mediation before a trial date**"
    },
    {
     "label": "Arbitration Or Trial",
     "text": "Parties may agree to binding arbitration; otherwise **the case is tried**"
    }
   ]
  },
  "points": [
   "Each forum can land **before or after the complaint is filed**",
   "Court-ordered mediation means John Doe **must attend, not agree**",
   "Binding arbitration: **the arbitrator acts as judge**; court review is narrow",
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
   "lead": "Mediation and arbitration can each come **before or after a lawsuit is filed**: the process, the court's rules and the negotiations decide.",
   "concepts": [
    {
     "term": "Non-Binding (Mediation)",
     "text": "Both sides must agree: **nobody is forced to settle**, and the parties keep control of the outcome"
    },
    {
     "term": "Binding (Arbitration)",
     "text": "The arbitrator's decision is final and **enforceable like a court order**, reviewed on narrow grounds"
    },
    {
     "term": "Before Filing",
     "text": "Mediation after treatment and the demand; arbitration only where **a signed clause** compels it"
    },
    {
     "term": "After Filing",
     "text": "Mediation often **ordered during discovery**; arbitration by the parties' agreement to leave court"
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
  },
  "clues": {
   "dos": [
    [
     "Laura Whitcomb, Esq. reacts sharply to a doorbell still on 06/22/2027.",
     "Afterward, Atty. Thorne needs to know what landed and what did not.",
     "Your notes on testimony and reactions guide every next step he takes."
    ],
    [
     "The arbitrator's office sends a fee schedule and a retainer request.",
     "An unpaid retainer can push the 06/22/2027 session off the calendar.",
     "Accounting pays, and you get confirmation on paper ahead of the date."
    ]
   ],
   "donts": [
    [
     "The 06/22/2027 session with Laura Whitcomb, Esq. is days away.",
     "Her award binds, so exhibits get one shot at admissibility.",
     "The set you bring was built to persuade Hon. Carla Benton (Ret.)."
    ],
    [
     "Laura Whitcomb, Esq. turns and asks you about a Medical Bill.",
     "The Golden Rule keeps Case Managers off the record entirely.",
     "You explain the bill yourself instead of handing it to Atty. Thorne."
    ],
    [
     "From the bench comes a directive with a date attached.",
     "It belongs on the calendar and in a memo that same day.",
     "Tomorrow morning, you try to recall what she said exactly."
    ]
   ]
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
 "d4m2-a3": {
  "image": "documents-audit",
  "situation": "04/05/2027. Harbor Point offers **$8,000 of $20,000**; Cardinal State **$6,000 of $10,000**. Both refuse to move.",
  "steps": [
   "Write the impasse memo: **offers against the limits**",
   "Quote **each layer's dispute-resolution clause** verbatim",
   "Ask the route, the deadline and consolidation **in writing**",
   "Open the ADR entry and **hold every date**",
   "Draft John Doe's **procedural** explanation"
  ],
  "deliver": "An impasse memo, a routed CMS file, **no opinion in either**",
  "checks": [
   "Both named as **first-party** claims",
   "$8,000 / $20,000 and **$6,000 / $10,000**",
   "Harbor Point's clause **quoted, not paraphrased**",
   "Cardinal State's certified policy **marked outstanding**",
   "**Nothing docketed** before his written answer"
  ],
  "dos": [
   "Give each layer **its own clause and deadline**"
  ],
  "donts": [
   "Docketing an arbitration deadline **from the tort SOL**"
  ]
 },
 "d4m2-kc": {
  "image": "knowledge-check",
  "questions": [
   "Discovery mailed 12/01/2026, SOL 02/06/2028: compute **each date with its arithmetic**, both weekend directions, and the RFA risk.",
   "Name the two UM resolution routes, what decides which governs, and where **bad faith** sits.",
   "Place each forum **before or after filing**, say where John Doe's landed, then define non-binding and binding."
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
      "Police Report, photos and video stills, deposition summaries with highlighted pages"
     ],
     [
      "5 · Damages, Financials & Experts",
      "Medical chart and bills ledger, wage-loss proof, expert reports"
     ],
     [
      "6 · Settlement History & Drafts",
      "Negotiation Log of every demand and offer, and a draft release"
     ]
    ],
    "note": "Build three sets, for counsel, the mediator and John Doe, or one OCR-searchable digital set."
   }
  },
  "clues": {
   "dos": [
    [
     "The 03/18/2027 mediation is set, and the binder starts empty.",
     "Most of Sections 4 and 5 were already assembled last summer.",
     "You reopen what went to Keystone back in July, ahead of the stall."
    ],
    [
     "Counsel has minutes to answer the 14-Day Gap at mediation.",
     "The five-second rule applies to every page in the binder.",
     "Each bookmark lands on the exact line he plans to read aloud."
    ]
   ],
   "donts": [
    [
     "Everyone meets Hon. Carla Benton (Ret.) on 03/18/2027.",
     "Atty. Thorne hunts for proof and may concede a point.",
     "He gets a loose stack of papers at breakfast that day."
    ],
    [
     "Section 1 of the binder opens with the snapshot sheet.",
     "Hon. Carla Benton (Ret.) tries to reach the defense side's lawyer.",
     "The phone and email listed for Atty. Mercer are months old."
    ],
    [
     "The confidential statement for Hon. Carla Benton (Ret.) is drafted.",
     "It was due to her by 03/11/2027, a full week ahead.",
     "It reaches her inbox as everyone is already taking seats."
    ]
   ]
  }
 },
 "d4m3-a1": {
  "image": "money-ledger",
  "situation": "It is 03/04/2027; binder due **03/11/2027** for the 03/18/2027 mediation. The draft carries Riverton Spine & Rehab at **$6,290.00** and Crescent's $3,400.00 as open. Riverton's certified ledger is outstanding.",
  "steps": [
   "Build six sections from **the master index**",
   "Map every pleaded defense **to the exhibit answering it**",
   "Rebuild the ledger from certified bills **to $16,401.40**",
   "Cross-check balances **against PIP and Peach State**",
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
      "Certified Police Report, diagrams, and photos and stills in **color, never grayscale**"
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
  },
  "clues": {
   "dos": [
    [
     "The forum's rules let the arbitrator admit whatever seems relevant.",
     "Admitted is not the same as persuasive in a binding award.",
     "You prep every exhibit as if a full trial courtroom were waiting."
    ],
    [
     "On 04/05/2027 Harbor Point and Cardinal State take up the gap fight.",
     "Riverton Fire, Riverton PD and Northgate HR custodians are notoriously slow.",
     "Certification requests go out within days of 04/05/2027."
    ]
   ],
   "donts": [
    [
     "The doorbell video holds the clearest frame of the crash.",
     "QC on Tab 3 checks every still for color.",
     "The copy that reaches Laura Whitcomb, Esq. is shades of gray."
    ],
    [
     "The exchange set is assembled for the 06/02/2027 deadline.",
     "Tab 2 is meant to hold operative versions only.",
     "An old pleading version and a draft brief ride along."
    ],
    [
     "Materials from 03/18/2027 sit on the shelf beside the new tabs.",
     "Whatever Hon. Carla Benton (Ret.) saw is typically inadmissible later.",
     "Our brief to her lands in the set for Laura Whitcomb, Esq."
    ]
   ]
  }
 },
 "d4m3-a2": {
  "image": "checklist-qa",
  "situation": "It is 05/17/2027. **Exchange 06/02/2027**, hearing 06/22/2027. The folder holds a pre-filing draft complaint, grayscale stills, the impasse memo and **a Lien Sheet** listing Harbor Point PIP and Summit Imaging.",
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
   "The 11/12/2026 answer pleads John Doe was unbelted. Which section shows it, and **which exhibits answer it**?"
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
  },
  "clues": {
   "dos": [
    [
     "Riverton Spine & Rehab's Final Ledger has not arrived yet.",
     "The binder is due to Hon. Carla Benton (Ret.) on 03/11/2027.",
     "You flag the holdup on 03/01/2027, ten days out, not 03/11."
    ],
    [
     "You call Dana Whitfield and reach voicemail again.",
     "Later, the impasse file has to prove the silence happened.",
     "Each call gets a matching email, dated and logged."
    ]
   ],
   "donts": [
    [
     "Keystone leaves 08/24 and 08/31 unanswered, then ignores 09/02.",
     "The log is what proves the silence to Atty. Thorne.",
     "The entry just shrugs that Dana Whitfield has a lot going on."
    ],
    [
     "Damage photos and doorbell stills are headed to a binding hearing.",
     "An illegible copy can be excluded or given little weight.",
     "The printer is set to black and white to save toner."
    ]
   ]
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
  },
  "clues": {
   "dos": [
    [
     "Keystone's silence threatens UM and the 11/05/2027 cutoff at once.",
     "Atty. Thorne reads the report's first line and sets his urgency.",
     "The closest deadline on the calendar sits at the very top."
    ],
    [
     "The five-field report to Atty. Thorne is almost finished.",
     "Its last field is the ask, which he can act on in one read.",
     "It names a single choice he needs to make, and by when."
    ]
   ],
   "donts": [
    [
     "Dana Whitfield misses one follow-up on the cadence.",
     "Her supervisor has not yet received a Notice of Delay.",
     "Lead counsel gets the problem first, with both lower rungs untried."
    ],
    [
     "An email to Atty. Thorne reports that Keystone still is not responding.",
     "To act, he first digs up every follow-up himself.",
     "It closes with a two-word request for guidance and nothing else."
    ],
    [
     "The 06/02/2027 exhibit exchange arrives with one provider still outstanding.",
     "No extension from Atty. Thorne is on the docket.",
     "The set waits for the straggler, and 06/02/2027 slips past."
    ]
   ]
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
   "Keystone's representative arrives on 03/18/2027 **without authority to pay $10,000**. What failed earlier, and your countermeasure?"
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
  },
  "clues": {
   "dos": [
    [
     "Defendant's discovery lands on John Doe's file on 12/01/2026 by mail.",
     "The calendar row shows 12/01 plus 30, plus 3, Sunday rolled.",
     "Anyone can re-check the 01/04/2027 date because the math sits in the entry."
    ],
    [
     "Our first interrogatory set to Robert Smith goes out 12/14/2026.",
     "It asks about every policy: primary, excess and umbrella coverage.",
     "Employment scope and surveillance join insurance in a trio asked every time."
    ],
    [
     "A 60-minute Discovery Intake Meeting with John Doe walks every request.",
     "His answers go into the response template for Atty. Thorne's review.",
     "No suggested answers: John's phrasing, his voice, typed exactly as spoken."
    ]
   ],
   "donts": [
    [
     "Atty. Thorne's Complaint has a flawless caption, facts and prayer for relief.",
     "The clerk stamps it on 02/07/2028, and the defense smiles.",
     "The limitation date on the docket read 02/06/2028, one sunrise earlier."
    ],
    [
     "Pre-suit, Dana Whitfield's response dates bent, and nobody lost the case.",
     "Now the expert disclosure date of 03/15/2027 arrives with nothing filed.",
     "A judge's date gets the same loose grace as a carrier's."
    ],
    [
     "Discovery mailed 12/01/2026 sits on the desk with a calendar open.",
     "The tally starts with 12/01 itself as number one.",
     "Every due date lands one day early, like 12/30 instead of 12/31."
    ]
   ]
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
  },
  "clues": {
   "dos": [
    [
     "The court docket goes quiet for weeks on 26-CV-04417.",
     "John Doe hears nothing and starts wondering whether his case died.",
     "A monthly check-in call goes out, news or no news."
    ],
    [
     "Trial subpoenas are drafted ahead of the 09/13/2027 trial calendar.",
     "Ruth Calloway, the Riverton PD officer and Dr. Reyes are candidates.",
     "Lead counsel picks the list; the Case Manager drafts only those."
    ],
    [
     "Subpoenas go out to records custodians ahead of trial.",
     "Each one needs a status check: served, produced, objected or stalled.",
     "The calendar pings the audit on a ten-day loop, without fail."
    ]
   ],
   "donts": [
    [
     "Defense counsel agrees on a call to move a discovery date.",
     "No confirming letter goes out in Atty. Thorne's name that day.",
     "Weeks later, the other side remembers the agreement differently."
    ],
    [
     "Trial is set for the 09/13/2027 calendar and binders need building.",
     "The tabbed exhibits come from the Demand Package assembled pre-suit.",
     "Months of later treatment and the latest provider bills are absent."
    ],
    [
     "John Doe's deposition is set for 02/18/2027 at 10:00 a.m.",
     "The attorney-approved prep packet with the ground rules goes out.",
     "It hits his inbox on 02/17/2027, with no time to absorb it."
    ]
   ]
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
   "File the affidavit, 12/01/2026 RFAs and Scheduling Order: **where, under what names**? What happens to the order's dates?"
  ]
 },
 "d5m2-l1": {
  "image": "repair-shop",
  "hook": "Margaret's PD file: **every figure gets tested**, and its dates explain the 14-Day Gap.",
  "points": [
   "Make the owner whole: **never a windfall**",
   "$9,255.00 is 52.6% of the ACV, under 75%: **repairable, $3,945.00 to spare**",
   "Claim only **the 48 unpaid days**: 48 × $42.00 = $2,016.00",
   "Keep loss-of-use and gap records **identical, date for date**"
  ],
  "upl": "Compute, document and report; never tell Margaret Doe what her car is worth",
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
   "lead": "Property Damage is **a cornerstone of civil litigation**: the law's mechanism for making an owner financially whole after negligence harms their property.",
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
  },
  "clues": {
   "dos": [
    [
     "The Civic's first Repair Estimate reads $6,940.00.",
     "A $2,315.00 teardown supplement arrives 03/02/2026, showing A-pillar damage.",
     "Total $9,255.00, 52.6% of the $17,600.00 ACV: still repairable."
    ],
    [
     "The Civic sits in the shop from 02/06 to 04/24/2026.",
     "Loss of Use needs a dollar figure for each day without a car.",
     "Keystone's own per-day car price sets the measure; it can hardly argue."
    ]
   ],
   "donts": [
    [
     "Seventy-eight days pass between the crash and the repair finishing.",
     "Keystone already covered a substitute vehicle for part of that stretch.",
     "Those covered days land on the Loss of Use claim a second time."
    ],
    [
     "The Civic's A-pillar was torn up in the 02/06/2026 crash.",
     "That structural damage shows the force John Doe's body absorbed.",
     "The teardown supplement gets filed away as a mere vehicle side issue."
    ]
   ]
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
   "Telling Margaret Doe her car **“lost $3,600.00”**",
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
  },
  "clues": {
   "dos": [
    [
     "Keystone offers $792.00 in Diminished Value on the 2019 Civic.",
     "The figure comes from the 17c method: 10%, then 0.75, then 0.60.",
     "The firm asks Keystone to show its math, on record, multiplier by multiplier."
    ],
    [
     "Keystone's 17c cap means no damage can top $1,760.00 here.",
     "The 0.60 mileage factor counts 52,300 miles the ACV already priced.",
     "Those flaws go into a memo for counsel, not an adjuster call."
    ]
   ],
   "donts": [
    [
     "Margaret Doe calls asking what her Civic is really worth now.",
     "The Riverton Auto Appraisal of 05/06/2026 sits open on screen.",
     "The Case Manager quotes the appraisal's number to him as settled fact."
    ],
    [
     "Keystone mails a PD release for John Doe to sign.",
     "Its language covers all matters arising from 02/06/2026.",
     "One signature on a car paper could end the bodily-harm lawsuit."
    ],
    [
     "John Doe tells the Case Manager how much the Civic means.",
     "The law measures a 2019 Civic by fair market price alone.",
     "Someone tells him the heartstrings will be paid for too."
    ]
   ]
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
   "Name **the three damage types**; place repair, Loss of Use, Diminished Value. Punitive damages require what conduct?"
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
  },
  "clues": {
   "dos": [
    [
     "Records, signed interrogatory answers and deposition testimony sit side by side.",
     "Defense counsel hunts for any spot where they disagree.",
     "All three line up because all three are simply true."
    ],
    [
     "John Doe will appear on camera on 02/18/2027.",
     "Business casual, nothing flashy, no hats or slogans on his shirt.",
     "Every client hears the same wardrobe speech, so nobody takes it personally."
    ],
    [
     "John Doe is nervous about his first deposition.",
     "No judge, no jury, just questions on a video call.",
     "A settled nervous system means shorter, more accurate answers on the transcript."
    ]
   ],
   "donts": [
    [
     "The night before, John Doe asks whether he will lose.",
     "The reply skips the process and talks about the case outcome.",
     "“You can't lose your case today,” the Case Manager promises."
    ],
    [
     "Atty. Mercer slides an exhibit onto the shared screen mid-deposition.",
     "It shows three low-back visits from years before the crash.",
     "John Doe blinks, forgot all about it, and nobody had warned him."
    ],
    [
     "Practice sessions with John Doe run night after night.",
     "His answers start arriving in identical phrasing every time.",
     "Defense counsel hears a script, recited perfectly, and smells coaching."
    ]
   ]
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
  },
  "clues": {
   "dos": [
    [
     "John Doe finishes a short answer and Atty. Mercer just waits.",
     "The pause stretches, and the urge to fill it grows.",
     "Eyes on the camera, mouth closed, he waits for the next question."
    ],
    [
     "Mid-answer, Atty. Thorne says “Objection, form” into the microphone.",
     "John stops, lets it finish, then hears “You can answer.”",
     "He knew this would happen, from a prep session weeks earlier."
    ]
   ],
   "donts": [
    [
     "Atty. Mercer asks: so it was just the neck stiffness, nothing else.",
     "The hand numbness and arm symptoms go unmentioned in the moment.",
     "John answers yes, recalling the list off the top of his head."
    ],
    [
     "Atty. Mercer pushes a loaded question about the 14-Day Gap.",
     "John's voice rises and he talks over Atty. Thorne's objection.",
     "He tries to win the point on the record, mid-deposition."
    ],
    [
     "Prep sessions drill the all-way stop, the speed and the impact.",
     "Nobody covers the three low-back visits from 2021.",
     "The Liar's Trap question about prior treatment catches John cold."
    ]
   ]
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
  "deliver": "A **timestamped Trap Log**, scored against the seven Golden Rules, routed before the debrief",
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
   "Name **the four defense question categories**. Which do clients underreport most, and where's that risk here?"
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
    "Flag for Subpoena Duces Tecum",
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
  },
  "clues": {
   "dos": [
    [
     "The Answer claims John Doe rode unbelted in the Escape.",
     "The EDR shows the front-passenger belt buckled at impact.",
     "The EMS Run Report says “restrained front-seat passenger”; counsel argues the rest."
    ],
    [
     "The defense says the Escape entered the all-way stop out of turn.",
     "Ruth Calloway's account and Margaret Doe's doorbell video are both secured.",
     "Point of impact, the front passenger door, plus direction of travel."
    ]
   ],
   "donts": [
    [
     "The Answer pleads comparative fault against John Doe.",
     "John asks the Case Manager whether a passenger could share fault.",
     "He hears a flat assurance he is untouchable, a legal opinion."
    ],
    [
     "The defense points at the host driver for the all-way stop crash.",
     "Someone sees a fresh coverage layer in that driver's own insurance.",
     "The verified $40,000 stack suddenly grows a fourth rung without Atty. Thorne."
    ]
   ]
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
   "Subpoena Duces Tecum: **notice opposing counsel first**, then serve",
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
  },
  "clues": {
   "dos": [
    [
     "The process server reports Robert Smith still unserved at 118 Larkspur Ln.",
     "The Case Manager follows up every 5 days with the server.",
     "Each knock gets logged with its calendar stamp and clock reading."
    ],
    [
     "A Subpoena Duces Tecum pulls a non-party's files toward production.",
     "The copy bill lands in the firm's inbox this morning.",
     "Payment goes out the same day, so production keeps moving."
    ],
    [
     "John Doe has gone silent since 01/22/2027, ahead of his deposition.",
     "The Step 4 Final Warning Letter is ready for Atty. Thorne's signature.",
     "Someone verifies the street address first, so the return receipt means something."
    ]
   ],
   "donts": [
    [
     "Three tries at 118 Larkspur Ln fail: 10/01, 10/05, 10/08.",
     "A neighbor says Robert Smith moved out in August.",
     "The server gets sent to the same door yet again."
    ],
    [
     "A records subpoena for a non-party provider is drafted and narrowed.",
     "The process server heads straight to the records desk.",
     "Atty. Mercer's office first hears about it after the papers land."
    ],
    [
     "On 02/03/2027 Margaret Doe, John's emergency contact, picks up the phone.",
     "She asks what is going on and why the call.",
     "The deposition, the lawsuit and the silence all get explained to her."
    ]
   ]
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
   "Assess John's **Skip-Trace gate** on Day 2's three criteria"
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
   "Track A: $40,000.00 **nets $20,359.92**. Name each deduction's figure and how costs and liens split by stream."
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
  },
  "clues": {
   "dos": [
    [
     "John Doe's litigated net comes in at $14,713.75.",
     "He asks why settling pre-suit would have paid him more.",
     "His own retainer shows the fee climbs to 40% once suit is filed."
    ],
    [
     "The Net Sheet lists $3,895.25 in litigation costs.",
     "Allied Process Services $285.00, Riverton Court Reporting $645.50, filing fee $218.00.",
     "Each line has its proof of payment attached in Documents."
    ]
   ],
   "donts": [
    [
     "Drafting the litigated Net Sheet, habit takes over the fee line.",
     "The pre-suit fee percentage gets typed in from the old settlement path.",
     "Atty. Thorne sees $13,333.33 where the retainer says $16,000.00."
    ],
    [
     "Keystone's $10,000.00 check has sat in trust since 03/29/2027.",
     "Peach State and Riverton Spine & Rehab have no Payoff Letters yet.",
     "Money leaves trust anyway, and the medical payers are still waiting."
    ]
   ]
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
   "Peach State: $1,240.00 on Track A, $1,116.00 on Track B. **Show both reductions**."
  ]
 },
 "d5m6-l1": {
  "image": "policy-letter",
  "hook": "Atty. Thorne **decides the drop**; you close it out so the file proves it.",
  "points": [
   "**No note, no letter**: confirm Pending Drop and the client told",
   "Only the client's letter carries **the reason and next step**",
   "Client: preferred method plus **Certified Mail**; others by email or fax",
   "Log, follow up, then **switch to Dropped**; keep the proof"
  ],
  "upl": "Atty. Thorne decides and explains; **never call a case worthless**.",
  "job": [
   [
    "Pending Drop, client told",
    "Prepare each party's letter",
    "Action Plan Editor",
    "Word and PDF saved"
   ],
   [
    "Letters signed",
    "Send by method; log it",
    "Communications Log",
    "Party, method, date logged"
   ],
   [
    "Receipts followed up",
    "Switch status; file proof",
    "CMS → Documents",
    "Status Dropped, proof retained"
   ]
  ],
  "dos": [
   "Check **the gate** before you open the template",
   "Send the client's letter **two ways**, one with proof"
  ],
  "donts": [
   "Putting **the reason** in a carrier's letter",
   "Switching to Dropped **before every letter is logged**",
   "Telling the client **the case is worthless**"
  ],
  "theory": {
   "lead": "A Dropped Case is a claim **discontinued before resolution**: documented, closed out and proved, so the client is informed and the firm is protected.",
   "concepts": [
    {
     "term": "Why cases are dropped",
     "text": "Unresponsive client, no liability, no coverage, unfinished treatment such as **no Health Plan**, or conflicting information"
    },
    {
     "term": "The Withdrawal Letter",
     "text": "A formal notice that **the attorney-client relationship has ended**, directing the client to seek other counsel"
    },
    {
     "term": "Pending Drop",
     "text": "The status that says the decision is made; the letters wait until **the client has been told**"
    },
    {
     "term": "Proof of closure",
     "text": "Certified Mail receipts, dispatch logs and saved letters **protect the firm** if the drop is questioned later"
    }
   ],
   "pages": [],
   "framework": {
    "title": "Who gets which letter",
    "kind": "table",
    "head": [
     "Recipient",
     "What it says",
     "How it's sent"
    ],
    "rows": [
     [
      "Client",
      "Date, DOL, the reason, and to seek other counsel",
      "Preferred method plus **Certified Mail**"
     ],
     [
      "Carrier",
      "Date, client, DOL, claim number; representation ended",
      "Email or fax, per the CRM"
     ],
     [
      "Medical provider",
      "Representation ended; please update your records",
      "Email or fax, per the CRM"
     ]
    ],
    "note": "Only the client's letter gives the reason; every letter is saved in Word and PDF and logged."
   }
  },
  "clues": {
   "dos": [
    [
     "Denise Harlow's file reads Pending Drop on 12/08/2026.",
     "Before drafting anything, the Case Manager looks for Atty. Thorne's note.",
     "The note confirms Denise was told by phone at 2:10 p.m."
    ],
    [
     "Denise prefers text and email for anything from the firm.",
     "Her letter also goes by Certified Mail to 87 Alder Creek Dr.",
     "The green return receipt comes back signed and goes in the file."
    ]
   ],
   "donts": [
    [
     "Granite Shield's withdrawal notice is drafted for Paul Ostrander.",
     "A line explains that Denise stopped treating at Brookside.",
     "The adjuster now knows why the firm closed its file."
    ],
    [
     "Denise's text and email went out at 9:00 a.m.",
     "Brookside's fax hasn't been sent yet, and nothing is in the log.",
     "The status already reads Dropped on the CMS screen."
    ],
    [
     "Denise calls after the Certified Mail arrives, upset.",
     "She asks whether her claim was ever worth anything.",
     "The reply gives her a view on what her claim was worth."
    ]
   ]
  }
 },
 "d5m6-a1": {
  "image": "email-outreach",
  "situation": "Practice matter, 12/09/2026: Denise Harlow has **no Health Plan** and stopped treatment 10/29/2026. Atty. Thorne dropped the case and told her 12/08. Status: **Pending Drop**.",
  "steps": [
   "Record **the gate**: Pending Drop and Atty. Thorne's note",
   "Draft Denise's letter with **his reason and next step**",
   "Draft Granite Shield's and Brookside's letters, **no reason given**",
   "Send by text, email and **Certified Mail**; email; fax",
   "Log, follow up 12/16/2026, then **switch to Dropped**"
  ],
  "deliver": "Three letters for his signature and **a close-out log to Dropped**",
  "checks": [
   "Gate confirmed **before any letter goes out**",
   "The reason **only in Denise's letter**",
   "Claim GS-26-48213 and DOL **on the carrier letter**",
   "Every letter saved **in Word and PDF**",
   "Dropped only **after the follow-up**; proof retained"
  ],
  "dos": [
   "Quote **Atty. Thorne's reason**; never write your own"
  ],
  "donts": [
   "Offering Denise **a way to save the case**"
  ]
 },
 "d5m6-kc": {
  "image": "knowledge-check",
  "questions": [
   "Name **the two things you confirm** before any Withdrawal Letter goes out, and why.",
   "What goes in Denise's letter but **not in Granite Shield's or Brookside's**, and why?",
   "Before Denise's status becomes Dropped, what must be true, and **what proof stays**?"
  ]
 }
};
