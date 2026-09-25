const DAY1 = {
  id: 1,
  title: "Case Management Fundamentals, Intake & Treatment",
  theme: "What Case Management Is · The General Process & Key Duties · Case Phases · Intake & Acceptance · Intake Bottlenecks · Claim Set-Up (Coverage, Liability, Projection) · Case Planning Framework · The Treatment Phase",
  objective: "Understand what a Case Manager owns from intake to resolution, run a clean intake and acceptance decision, set up the claim (coverage, liability, projection and regulatory checks), and keep the Treatment Phase on the Standard Treatment Map while spotting red flags, gaps and bottlenecks early.",
  taskOverview: [
    { label: "Intake & Case Opening", tasks: [
        "Review the intake submission or run the verification call (who, what, when, where, how).",
        "Run and document the conflict check before anything else moves.",
        "Decide: accept, escalate for attorney/senior review, or decline — and document why.",
        "Create the case file with proper naming conventions and log it in the CMS."
      ], sample: "Sample task: John Doe's inquiry against Apex Delivery Services lands in your queue — verify the facts of loss, run the conflict check, and record an Accept / Escalate / Decline decision with your reasoning in the CMS." },
    { label: "Case Planning & Strategy Support", tasks: [
        "Determine coverage (valid policy, type, limits, exclusions) and assess liability.",
        "Build an early case projection from coverage, liability, injury severity and treatment expectations.",
        "Clear the Regulatory Triple-Check: HIPAA authorization, Medicare/Medicaid reporting, payer order.",
        "File the Three-Pillar Case Plan (Clinical, Functional, Financial) within the state's 30–60 day window."
      ], sample: "Sample task: confirm whether Apex's commercial policy is verified before you finalize the projection, and note what evidence still has to confirm liability." },
    { label: "Documentation & File Management", tasks: [
        "Keep a “clean”, discoverable file — medical plan and legal claim as parallel tracks.",
        "Use GIRP or SOAP-style notes to document goals, interventions, responses and plans.",
        "Maintain an unalterable audit trail in a SOC2-compliant CMS.",
        "Track LOP providers and IME timelines where the state requires them."
      ], sample: "Sample task: write a GIRP note for today's check-in with the client about missed therapy sessions — no legal opinions in the medical note." },
    { label: "Communication Management", tasks: [
        "Keep the Stakeholder Triad loops tight: clinical (MDT), legal (attorney), financial (adjuster).",
        "Communicate next steps clearly to the client and internal team after every decision.",
        "Use warm handoffs instead of handing clients a phone number.",
        "Translate medical jargon into functional evidence for the attorney."
      ], sample: "Sample task: send the adjuster a status update explaining that the MRI authorization delay is extending the period of temporary disability." },
    { label: "Case Monitoring & Tracking", tasks: [
        "Monitor treatment frequency, appointment compliance and referral completion.",
        "Watch the 6-week functional gap and the 12-week plateau red flags.",
        "Identify clinical, psychosocial and systemic variance before funding is cut.",
        "Escalate bottlenecks with the 3-step escalation ladder."
      ], sample: "Sample task: the client has had 15 PT sessions with no ROM gain — call the provider's MA and ask whether an orthopedic referral is being considered, then document it." },
    { label: "Billing, Resolution & Closing", tasks: [
        "Track the payor order (PIP/MedPay → health insurance → LOP/provider liens).",
        "Identify subrogation interests early so they don't surprise you at settlement.",
        "Prepare the file for Pre-Demand, Demand, Settlement, Disbursement or Litigation.",
        "Close and archive only when every phase requirement is met."
      ], sample: "Sample task: flag that the client is on SSDI and report the case to the BCRC before any settlement discussion." }
  ],
  lessons: [
    { h: "Training Agenda & What Case Management Is",
      fourPart: {
        corePrinciples: [
          "Today's agenda: 01 Understand Case Management Fundamentals · 02 Intake, Case Evaluation, and Representation Approval · 03 Case Phase: Treatment.",
          "Case Management is the end-to-end coordination, tracking, and handling of a case from intake to resolution.",
          "It ensures timely progression of cases, proper documentation and compliance, and effective communication between all parties."
        ],
        howTo: [
          "Timely progression — keep every file moving so delays don't pile up and client satisfaction stays high.",
          "Proper documentation and compliance — meticulous records create accountability.",
          "Effective communication — keep every party (client, providers, attorney, adjuster) aligned."
        ],
        bestPractices: [
          "Treat intake, evaluation and representation approval as the foundation for everything that follows.",
          "Learn where bottlenecks usually form in each phase so you can get ahead of them.",
          "Pitfall: thinking of case management as data entry — it is coordination and ownership from start to finish."
        ],
        discussionCase: "Ask the room: what is one delay you have seen in a case that better coordination would have prevented?"
      },
      trainerCue: "We're covering the essentials of case management fundamentals — intake, case evaluation and representation approval — then the bottlenecks in each case phase and how to overcome them. These fundamentals lay the groundwork for more detailed discussions later."
    },
    { h: "The General Case Management Process",
      layout: "PROCESS",
      processSteps: [
        { label: "Intake & Case Opening", desc: "Verify, screen conflicts, accept and open the file." },
        { label: "Case Planning & Strategy Support", desc: "Coverage, liability, projection and the case plan." },
        { label: "Documentation & File Management", desc: "Clean, discoverable, well-named records." },
        { label: "Communication Management", desc: "Client, providers, attorney and adjuster loops." },
        { label: "Case Monitoring & Tracking", desc: "Treatment, deadlines, variance and red flags." },
        { label: "Billing & Documentation Support", desc: "Bills, ledgers, liens and payor order." },
        { label: "Case Resolution & Closing", desc: "Settlement, disbursement, archive." }
      ],
      fourPart: {
        corePrinciples: [
          "Every case moves through the same seven-stage general process, from 01 Intake & Case Opening to 07 Case Resolution & Closing.",
          "Each stage feeds the next — weak work early shows up as problems later."
        ],
        howTo: [
          "01 Intake & Case Opening",
          "02 Case Planning & Strategy Support",
          "03 Documentation & File Management",
          "04 Communication Management",
          "05 Case Monitoring & Tracking",
          "06 Billing & Documentation Support",
          "07 Case Resolution & Closing"
        ],
        bestPractices: [
          "Know which stage every one of your files is in at all times.",
          "Documentation, communication and monitoring run continuously — they are not one-off steps.",
          "Pitfall: jumping to resolution before the file has been properly documented and billed."
        ],
        discussionCase: "Pick a stage and ask a volunteer to describe what “done” looks like for that stage."
      },
      trainerCue: "Walk the seven boxes left to right. Emphasize that documentation, communication and monitoring are the ‘always on’ middle of the process."
    },
    { h: "Key Duties of a Case Manager",
      layout: "ICONLIST",
      icons: [
        { icon: "⚖️", label: "Relevant Laws & Legal Compliance Research", desc: "Know the statutes, deadlines and rules that govern the file." },
        { icon: "📝", label: "Legal Document Drafting & Filing", desc: "Prepare, organize and file the documents the case needs." },
        { icon: "🗒", label: "Case Updates & Summaries", desc: "Keep status clear for the attorney and client." },
        { icon: "✅", label: "Task Compliance Monitoring", desc: "Make sure assigned tasks are actually done on time." },
        { icon: "🤝", label: "Client Communication", desc: "Proactive, clear updates and next steps." },
        { icon: "🩺", label: "Case Health Analysis", desc: "Spot weak points before the defense does." },
        { icon: "📈", label: "Case Progress Monitoring", desc: "Track phase movement and deadlines." },
        { icon: "👥", label: "Resource Allocation", desc: "Assign the right people and tools to each task." },
        { icon: "🎯", label: "Planning & Recommendation", desc: "Recommend next steps with a reason." }
      ],
      fourPart: {
        corePrinciples: [
          "A Case Manager's key duties: relevant laws and legal compliance research; legal document drafting and filing; case updates and summaries; task compliance monitoring; client communication; case health analysis; case progress monitoring; resource allocation; planning and recommendation."
        ],
        howTo: [
          "Research the laws and compliance rules that apply to the file.",
          "Draft and file the legal documents the phase requires.",
          "Write case updates and summaries the attorney can read in a minute.",
          "Monitor task compliance and case progress against deadlines.",
          "Analyze case health, allocate resources, and make a recommendation."
        ],
        bestPractices: [
          "Every recommendation should come with the reason and the evidence behind it.",
          "Case health analysis is proactive — look for weak spots before an adjuster finds them.",
          "Pitfall: tracking tasks without confirming they were completed correctly."
        ],
        discussionCase: "Which of the nine duties do new Case Managers most often under-do, and why?"
      },
      trainerCue: "Point out that ‘Planning & Recommendation’ is what separates a Case Manager from a file clerk."
    },
    { h: "Understanding Case Phases",
      layout: "PROCESS",
      processSteps: [
        { label: "Intake", desc: "Laying the groundwork." },
        { label: "Investigation / Claim Set-Up", desc: "Coverage, liability, plan." },
        { label: "Treatment", desc: "The engine room." },
        { label: "Pre-Demand", desc: "Audit the file." },
        { label: "Demand", desc: "Present the debt owed." },
        { label: "Settlement & Lien Negotiations", desc: "Maximize the net." },
        { label: "Disbursement", desc: "Pay out and reconcile." },
        { label: "Litigation", desc: "When negotiation fails." }
      ],
      fourPart: {
        corePrinciples: [
          "Case Management is divided into structured phases that guide how a case is handled from start to finish.",
          "Each phase has specific goals, responsibilities, and deliverables that ensure the case progresses efficiently and accurately."
        ],
        howTo: [
          "Intake Phase",
          "Investigation Phase / Claim Set-Up",
          "Treatment Phase",
          "Pre-Demand",
          "Demand",
          "Settlement and Lien Negotiations",
          "Disbursement",
          "Litigation (for cases needing further action)"
        ],
        bestPractices: [
          "Each phase builds on the last — don't move a file forward until the current phase's deliverables are complete.",
          "Record the phase in the CMS every time it changes so the whole team sees the same status.",
          "Pitfall: treating litigation as a normal next step — it is the path for cases that could not resolve earlier."
        ],
        discussionCase: "Which phase transition is most likely to be rushed, and what breaks when it is?"
      },
      trainerCue: "Understanding the phases is essential. Each builds on the last, creating a comprehensive process crucial for effective case management."
    },
    { h: "Case Phase: Intake — Establishing Control",
      fourPart: {
        corePrinciples: [
          "The Intake Phase is where Case Managers establish control, structure, and clarity from the very beginning of a case.",
          "It is not just data collection — it is the first opportunity to ensure accuracy, compliance, and proper case direction.",
          "Your role is to verify and organize essential case information while ensuring the case meets acceptance standards.",
          "👉 This phase determines whether the case should move forward or be declined."
        ],
        howTo: [
          "Capture complete and accurate client details.",
          "Screen for conflicts of interest.",
          "Assess case viability and eligibility.",
          "Establish a properly structured case file."
        ],
        bestPractices: [
          "A well-organized case file from day one makes every later phase faster.",
          "Careful attention at intake raises the likelihood of a successful outcome.",
          "Pitfall: moving a case forward before the conflict check is complete."
        ],
        discussionCase: "What does a “properly structured case file” look like in our CMS on day one?"
      },
      trainerCue: "Intake sets the tone and direction for the entire case. It requires establishing control, ensuring compliance, and setting the case up for success."
    },
    { h: "The Real Intake Workflow",
      layout: "PROCESS",
      processSteps: [
        { label: "Client submits inquiry form", desc: "Web form, call or referral." },
        { label: "CM reviews & verifies details", desc: "Who, what, when, where, how." },
        { label: "Conflict check completed", desc: "In the system, before proceeding." },
        { label: "Approved or escalated", desc: "Against acceptance criteria." },
        { label: "Case file created & logged", desc: "Naming conventions + system entry." }
      ],
      fourPart: {
        corePrinciples: [
          "In a real intake workflow, a Case Manager will: speak with or review client-submitted information; ask structured intake questions (who, what, when, where, how); run a conflict check in the system before proceeding; review documents for completeness and relevance; create a case file with proper naming conventions and system entry."
        ],
        howTo: [
          "Conduct a full intake call or review the intake submission.",
          "Identify missing or inconsistent client information.",
          "Perform and document a conflict check accurately.",
          "Decide if the case meets basic acceptance criteria.",
          "Set up a complete and organized case file in the system.",
          "Communicate next steps clearly to the client or internal team."
        ],
        bestPractices: [
          "Work independently through the whole workflow — own it end to end.",
          "Be proactive about inconsistencies; don't wait for someone else to catch them.",
          "Pitfall: creating the file before the conflict check is documented."
        ],
        discussionCase: "Walk through the example workflow with a live intake: where do you personally slow down?"
      },
      trainerCue: "Effective communication and independent work are vital. Be proactive in identifying inconsistencies and ensure the case meets acceptance criteria before proceeding."
    },
    { h: "Intake & Initial Client Contact — Gatekeepers of Case Quality",
      fourPart: {
        corePrinciples: [
          "Every great legal outcome starts long before we enter a courtroom or sign a settlement.",
          "Initial client contact is the first interaction with a potential client, followed immediately by intake — used to gather basic facts, assess urgency, and determine if the case can move forward.",
          "The Case Manager's role begins after intake is completed, functioning as a quality control and case validation reviewer before a case is officially accepted into active case management.",
          "👉 Case Managers are the gatekeepers of case quality."
        ],
        howTo: [
          "Confirm the intake work is complete.",
          "Confirm it is accurate.",
          "Confirm it is properly documented.",
          "Confirm it is ready for case activation."
        ],
        bestPractices: [
          "Hold the standard: incomplete intake goes back, not forward.",
          "Maintaining high standards here protects the integrity of the entire process.",
          "Pitfall: accepting a case because intake “mostly” looks fine."
        ],
        discussionCase: "What single missing item would make you send an intake packet back?"
      },
      trainerCue: "Initial client contact is a vital first touchpoint. After intake, the Case Manager reviews the information to ensure accuracy and completeness, acting as a gatekeeper for case quality."
    },
    { h: "Case Acceptance Determination",
      fourPart: {
        corePrinciples: [
          "After the Case Manager completes the verification call and confirms the facts of loss, the case moves into a review and evaluation stage for acceptance.",
          "At this point, the Case Manager is no longer gathering information — they are assessing whether the firm will accept the case based on verified facts and intake completeness.",
          "👉 This step ensures the case is factually confirmed, properly documented, and aligned with firm criteria before acceptance."
        ],
        howTo: [
          "Complete the verification call and confirm the facts of loss.",
          "Check intake completeness against the firm's acceptance criteria.",
          "Assess alignment with the firm's strategic goals.",
          "Record the decision: Accepted, Escalated, or Declined — with the reason."
        ],
        bestPractices: [
          "Only qualified cases progress — that protects quality and the firm's reputation.",
          "Every decision needs a documented reason someone else can follow.",
          "Pitfall: gathering more information at this stage instead of making the determination."
        ],
        discussionCase: "What facts must be verified before you would ever mark a case Accepted?"
      },
      trainerCue: "By meticulously verifying details, the Case Manager acts as a gatekeeper, allowing only qualified cases to progress."
    },
    { h: "Common Intake Bottlenecks — Overview",
      fourPart: {
        corePrinciples: [
          "Intake bottlenecks are points in the intake process where work slows down, gets stuck, or becomes inconsistent, delaying case progression."
        ],
        howTo: [
          "Missing or incomplete information",
          "Delayed client responses",
          "Poorly documented intake submissions",
          "Verification or conflict check delays",
          "Unclear case eligibility decisions"
        ],
        bestPractices: [
          "Name the bottleneck precisely before trying to fix it.",
          "Addressing these early gives a smoother intake and better client satisfaction.",
          "Pitfall: blaming the client for delays that are really process gaps."
        ],
        discussionCase: "Which of the five causes is most common in your experience?"
      },
      trainerCue: "Identifying common intake bottlenecks is essential for improving workflow efficiency and case progression."
    },
    { h: "Bottleneck: Incomplete Client Information",
      fourPart: {
        corePrinciples: [
          "Incomplete client information can severely impede progress in the intake phase."
        ],
        howTo: [
          "Missing contact details or incident facts — causes significant delays.",
          "No supporting documents attached — essential for building a strong case.",
          "Vague or unclear case summaries — lead to misunderstandings and unnecessary follow-ups."
        ],
        bestPractices: [
          "Use a checklist so every intake captures the same minimum data.",
          "Request missing documents in one consolidated message, with a deadline.",
          "Pitfall: rewriting a vague summary from memory instead of confirming facts with the client."
        ],
        discussionCase: "Draft the one-message request you'd send a client with three missing items."
      },
      trainerCue: "Addressing these issues early ensures a smoother process. Next: delayed client follow-up."
    },
    { h: "Bottleneck: Delayed Client Follow-Up",
      fourPart: {
        corePrinciples: [
          "Delayed client follow-up stalls timelines and outcomes."
        ],
        howTo: [
          "Clients not responding to clarification requests — questions stay unanswered.",
          "Missing verification call confirmations — facts can't be verified.",
          "Slow submission of required documents — creates bottlenecks in intake."
        ],
        bestPractices: [
          "Set follow-up reminders the moment a request goes out.",
          "Offer the client an easy way to respond (call window, text, upload link).",
          "Pitfall: letting a file sit because “we're waiting on the client” without logging attempts."
        ],
        discussionCase: "How many follow-up attempts, over what period, before you escalate?"
      },
      trainerCue: "By tackling delayed follow-up, we improve the efficiency of case management and streamline intake."
    },
    { h: "Bottleneck: Conflict Check Delays",
      fourPart: {
        corePrinciples: [
          "Conflict checks must be complete before the case proceeds — delays here stop everything."
        ],
        howTo: [
          "System backlog or manual verification delays.",
          "Incomplete conflict check entries — lead to time-consuming back-and-forth.",
          "Unclear opposing party information — compounds delays."
        ],
        bestPractices: [
          "Enter full legal names for every party, including the employer/company (e.g., Apex Delivery Services and its driver).",
          "Document the date and result of every conflict check in the file.",
          "Pitfall: running the check on a nickname or partial name."
        ],
        discussionCase: "What opposing-party details would you need to run a clean check on a trucking case?"
      },
      trainerCue: "By tackling conflict check delays we enhance the efficiency of intake and ensure quicker case handling."
    },
    { h: "Bottleneck: Intake Form Errors",
      fourPart: {
        corePrinciples: [
          "Errors on the intake form create delays and credibility problems later."
        ],
        howTo: [
          "Incorrect dates or inconsistent statements — cause confusion.",
          "Missing signatures or authorization forms — halt progress.",
          "Duplicate or misfiled records — lead to inefficiencies."
        ],
        bestPractices: [
          "Compare the intake narrative against the police report and client statement before acceptance.",
          "Check every signature and authorization before the file is activated.",
          "Pitfall: correcting an inconsistency silently instead of confirming it and documenting the correction."
        ],
        discussionCase: "The CMS intake lists the police report number as “1104” and the provider bills show DOB 02/14/1980. What do you do before the case is activated?"
      },
      trainerCue: "Proactively resolving these problems can streamline intake and support successful legal outcomes."
    },
    { h: "Bottleneck: Case Eligibility Uncertainty",
      fourPart: {
        corePrinciples: [
          "Some intake submissions arrive without a clear answer on whether the case is eligible."
        ],
        howTo: [
          "Intake submitted without clear legal assessment.",
          "Requires attorney review before decision.",
          "Ambiguous facts of loss or liability."
        ],
        bestPractices: [
          "Escalate with a short summary of exactly what is ambiguous so the attorney can decide quickly.",
          "Clarify facts of loss with the client before escalating when you can.",
          "Pitfall: letting an uncertain file sit in limbo instead of escalating."
        ],
        discussionCase: "Write the two-line escalation note you would send an attorney on an ambiguous-liability case."
      },
      trainerCue: "Lack of legal assessment and ambiguous facts slow the process. Addressing these uncertainties early improves outcomes for clients and the firm."
    },
    { h: "Bottleneck: Communication Gaps",
      fourPart: {
        corePrinciples: [
          "Communication gaps between teams stall intake even when the work is done."
        ],
        howTo: [
          "Intake team not updating Case Managers.",
          "Case Manager not receiving the complete intake packet.",
          "Miscommunication between departments."
        ],
        bestPractices: [
          "Establish clear communication channels so information is shared consistently.",
          "Use the CMS as the single source of truth — not side emails.",
          "Pitfall: assuming the intake team sent everything."
        ],
        discussionCase: "Design a simple handoff rule between intake and case management."
      },
      trainerCue: "Effective communication during intake is vital for improving case management efficiency and achieving better legal outcomes."
    },
    { h: "Tools for Case Planning & the PI Case Lifecycle Strategy",
      fourPart: {
        corePrinciples: [
          "When working within a legal framework, Case Management shifts from “best efforts” to “strict compliance.”",
          "System = Efficiency + Accountability.",
          "A PI case is a race against the Statute of Limitations and the “gap in treatment” defense used by insurance companies."
        ],
        howTo: [
          "Case Management Software (our CMS)",
          "Task Trackers / Calendars",
          "Document Management Systems",
          "Workflow Automation Tools"
        ],
        bestPractices: [
          "Docket the Statute of Limitations on day one.",
          "Use task trackers so gaps in treatment are visible the day they start.",
          "Pitfall: relying on memory instead of the system for deadlines."
        ],
        discussionCase: "Which tool would have caught a missed deadline you've seen?"
      },
      trainerCue: "Strict compliance with deadlines and procedures is crucial in PI cases, particularly because of the Statute of Limitations and the ‘gap in treatment’ defense."
    },
    { h: "Skill Building: Intake Decision Challenge & Applied Case Manager Actions",
      skill: { tool: "cmIntake1", cms: true },
      fourPart: {
        corePrinciples: [
          "“INTAKE DECISION CHALLENGE” — A new potential client, John Doe, submits an inquiry regarding a case against Apex Delivery Services.",
          "Your task is to complete the intake evaluation process and determine whether the case should be accepted, rejected, or escalated for review.",
          "✅ Accepted for case opening · ⚠️ Escalated for attorney/senior review · ❌ Declined due to eligibility or risk factors."
        ],
        howTo: [
          "Decide: Accept, Escalate or Decline — and clearly document the reason for the decision.",
          "Communicate next steps to the intake team or client.",
          "Applied CM Actions 1 — identify where intake slowed down.",
          "Applied CM Actions 2 — conduct a root cause analysis.",
          "Applied CM Actions 3 — implement immediate actions to move the file forward.",
          "Applied CM Actions 4 — prevent future occurrences."
        ],
        bestPractices: [
          "Open the case in the CMS training interface and log your decision there.",
          "Better training, communication or technology prevents repeat bottlenecks.",
          "Pitfall: deciding without documenting the reason."
        ],
        discussionCase: "Have two volunteers reach different decisions on the John Doe intake and defend them."
      },
      trainerCue: "Scenario: John Doe v. Apex Delivery Services. Trainees decide whether to open, escalate, or decline based on eligibility or risk, document reasons, and communicate the decision. Mastering this process improves the efficiency of the legal process."
    },
    { h: "Claim Set-Up: Coverage Determination & Liability Assessment",
      layout: "COMPARE",
      compareLeft: { label: "Coverage Determination", items: ["Is there valid insurance coverage?", "What type of coverage applies?", "What are the policy limits?", "Are there exclusions or coverage gaps?"] },
      compareRight: { label: "Liability Assessment", items: ["Who caused the incident?", "Is liability clear, shared, or disputed?", "What evidence supports fault?", "Are there comparative negligence factors?"] },
      fourPart: {
        corePrinciples: [
          "Early Evaluation Phase.",
          "Coverage determination is the process of identifying which insurance policies apply to a claim and what benefits, limits, and exclusions exist.",
          "Liability assessment determines who is legally responsible for the incident and to what degree."
        ],
        howTo: [
          "Identify every potential policy and confirm it is valid.",
          "Identify the type of coverage and the limits.",
          "Check exclusions and coverage gaps.",
          "Establish who caused the incident and whether liability is clear, shared or disputed.",
          "List the evidence that supports fault and any comparative negligence factors."
        ],
        bestPractices: [
          "Both assessments are essential for a strong claim foundation.",
          "Record the source of every coverage fact (dec page, adjuster letter, police report).",
          "Pitfall: assuming coverage exists because the defendant is a business."
        ],
        discussionCase: "What documents would you request first to verify coverage on a commercial vehicle claim?"
      },
      trainerCue: "Coverage identifies applicable policies, limits and exclusions; liability establishes legal responsibility. Both are essential for a strong claim foundation."
    },
    { h: "Claim Set-Up: Case Projection — Why the Three Work Together",
      layout: "THREEBOX",
      boxes: [
        { label: "🛡️ Coverage", desc: "“Is there money to pay the claim?”" },
        { label: "⚖️ Liability", desc: "“Who is responsible?”" },
        { label: "📈 Projection", desc: "“What is this case likely worth and how will it move?”" }
      ],
      fourPart: {
        corePrinciples: [
          "Case projection is the early estimation of case value, risk, and outcome trajectory.",
          "You cannot accurately project a case unless you understand coverage, liability and the projection factors together."
        ],
        howTo: [
          "Coverage availability",
          "Liability strength",
          "Injury severity",
          "Treatment expectations",
          "Documentation quality"
        ],
        bestPractices: [
          "Re-project whenever coverage, liability or treatment changes.",
          "Write the projection with its assumptions so others can see what would change it.",
          "Pitfall: projecting value before coverage is confirmed."
        ],
        discussionCase: "How would a confirmed $1M commercial policy change the projection versus an unverified one?"
      },
      trainerCue: "These interconnected components are vital for informed decision-making in case strategy."
    },
    { h: "Case Study: John Doe v. Apex — Coverage Analysis",
      fourPart: {
        corePrinciples: [
          "Case Snapshot — Client: John Doe · Defendant: Apex Delivery Services (commercial delivery company) and its driver Robert W. Smith · Incident Type: motor vehicle collision with a commercial vehicle (T-bone) · Location: 4th Ave & Main St, Metro Center · Date of Loss: 02/14/2026 (verify every intake field against Police Report 2026-0214-AX).",
          "🔍 Identified potential coverage sources: Aggressive Casualty commercial auto (Apex) — plus the client's own Local Farm Mutual PIP ($10,000) and UM/UIM ($250,000/$500,000). Open both dec pages in 📁 Case Documents.",
          "Coverage Analysis Summary: Apex is a commercial carrier → high likelihood of substantial liability coverage; policy limits are expected to be higher than standard auto policies."
        ],
        howTo: [
          "List the defendant-side policy (commercial auto liability).",
          "List the client-side coverages (PIP/MedPay, health insurance, UM/UIM).",
          "Request the declarations page to confirm limits.",
          "Hold the projection as “preliminary” until coverage is confirmed."
        ],
        bestPractices: [
          "🧠 Case Manager Insight: coverage appears strong on the defendant side, but confirmation is required before projection can be finalized.",
          "Pitfall: quoting a likely limit to the client before it's confirmed in writing."
        ],
        discussionCase: "What is the fastest way to confirm Apex's policy limits?"
      },
      trainerCue: "Apex, as a commercial carrier, likely has substantial liability coverage, which should be confirmed before finalizing projections."
    },
    { h: "Case Study: John Doe v. Apex — Liability Determination",
      fourPart: {
        corePrinciples: [
          "Fact pattern analysis: the Apex F-150 entered on a red signal while John turned left on a green arrow; Smith was cited for Failure to Yield and Disregarding a Traffic Control Device — a strong presumption of negligence (the deck's original example used a rear-end collision, which carries the same presumption).",
          "The Apex driver may be liable for negligent operation and failure to maintain a safe distance; Apex may carry employer vicarious liability."
        ],
        howTo: [
          "⚠️ Risk Note: liability is strong but not final until confirmed by —",
          "The police report",
          "The driver statement",
          "Dashcam or other evidence"
        ],
        bestPractices: [
          "🧠 Insight: liability is likely favorable, but still in the pre-confirmation stage.",
          "Diligence in the confirmation process builds a robust case before proceeding.",
          "Pitfall: telling the client liability is “a sure thing” before the police report is in."
        ],
        discussionCase: "Ask the room: what single piece of evidence would most change this liability assessment?"
      },
      trainerCue: "Start with the presumption of negligence, highlight vicarious liability, then emphasize that police reports, driver statements and dashcam footage confirm it. Engage the audience for input."
    },
    { h: "Case Planning Framework: Regulatory Intake & Verification",
      layout: "THREEBOX",
      boxes: [
        { label: "HIPAA Compliance", desc: "Claim-specific Authorization to Release Medical Information." },
        { label: "Medicare/Medicaid Reporting", desc: "65+ or SSDI → report to the BCRC." },
        { label: "Subrogation Management", desc: "Primary payer order: PIP/MedPay → Private Health → LOP/Provider Liens." }
      ],
      fourPart: {
        corePrinciples: [
          "Before clinical planning begins, you must clear the “Regulatory Triple-Check” to ensure the claim is properly established and the case manager is authorized to act."
        ],
        howTo: [
          "HIPAA Compliance — obtain a claim-specific Authorization to Release Medical Information; standard releases may not be adequate for PI cases. It should specify the incident date and permit communication with legal and insurance parties.",
          "Medicare/Medicaid Reporting — if a client is 65+ or on SSDI, report the case to the Benefits Coordination & Recovery Center (BCRC) to avoid severe federal penalties and potential settlement freezes (MMSEA — Medicare, Medicaid, and SCHIP Extension Act of 2007).",
          "Subrogation Management — Primary Payer Determination: identify the payor order (Personal Injury Protection (PIP) / MedPay → Private Health Insurance → LOP/Provider Liens)."
        ],
        bestPractices: [
          "Clear the triple-check before any clinical planning.",
          "Log the BCRC report date in the file.",
          "Pitfall: using a generic medical release that doesn't name the incident date."
        ],
        discussionCase: "A 67-year-old client is referred. What is the first regulatory action you take?"
      },
      trainerCue: "This step is critical for a smooth case management process — the triple-check grants authority to act and prevents federal penalties."
    },
    { h: "Case Planning Framework: The Three-Pillar Case Plan",
      layout: "THREEBOX",
      boxes: [
        { label: "Clinical", desc: "Acute interventions (PT, specialty consults)." },
        { label: "Functional", desc: "ADLs and Return to Work (RTW) status." },
        { label: "Financial", desc: "Payor order, subrogation, MMSEA compliance." }
      ],
      fourPart: {
        corePrinciples: [
          "Once the claim is set up, the plan must be filed (often within 30–60 days depending on the state).",
          "It should be structured into three distinct categories: Clinical, Functional, and Financial."
        ],
        howTo: [
          "Clinical — acute interventions (PT, specialty consults) to stabilize the client's condition.",
          "Functional — activities of daily living (ADLs) and “Return to Work” (RTW) status.",
          "Financial — Primary Payer Determination (PIP/MedPay → Private Health Insurance → LOP/Provider Liens), subrogation management, and MMSEA compliance."
        ],
        bestPractices: [
          "File the plan inside the state window and docket the date.",
          "Each pillar should have measurable goals.",
          "Pitfall: a plan that only covers clinical care."
        ],
        discussionCase: "Draft one goal per pillar for John Doe."
      },
      trainerCue: "Adhering to these pillars is vital for a comprehensive plan that supports the client's recovery and the legal process."
    },
    { h: "Case Planning Framework: Mandatory Disclosure & Compliance Tracking",
      fourPart: {
        corePrinciples: [
          "US Case Managers have a duty to maintain a “clean” file that is discoverable in litigation."
        ],
        howTo: [
          "Electronic Record Integrity — ensure your Case Management System (CMS) is SOC2 compliant and maintains an unalterable audit trail.",
          "State-Specific Timelines — e.g., in “No-Fault” states (like NY or FL), the framework must include a timeline for IMEs (Independent Medical Examinations), which the carrier will mandate early in set-up.",
          "Letter of Protection (LOP) Management — if the client is uninsured, track providers working under an LOP to avoid “surprise” medical bills that exceed the policy limits."
        ],
        bestPractices: [
          "Assume every note will be read by defense counsel.",
          "Keep the LOP provider list current with balances.",
          "Pitfall: editing records in a way that breaks the audit trail."
        ],
        discussionCase: "What makes a file “clean” versus merely complete?"
      },
      trainerCue: "Transparency: the CMS preserves an unalterable audit trail; IME timelines matter in No-Fault states; LOP tracking protects clients from financial surprises."
    },
    { h: "The “Golden Rule” of US Claim Set-Up",
      fourPart: {
        corePrinciples: [
          "US Case Managers have a duty to maintain a “clean” file that is discoverable in litigation.",
          "Coordinate, don't just Commingle."
        ],
        howTo: [
          "Treat the medical plan and the legal claim as two parallel tracks that never cross-contaminate.",
          "Keep medical notes factual and clinical.",
          "Keep legal strategy in the legal track only."
        ],
        bestPractices: [
          "Avoid offering legal opinions in medical notes — defense counsel often uses them to impeach the case manager's neutrality.",
          "Pitfall: writing “this will help the case” in a treatment note."
        ],
        discussionCase: "Rewrite a note that mixes legal opinion with medical facts."
      },
      trainerCue: "Managing medical plans and legal claims separately is crucial for effective case management."
    },
    { h: "The Treatment Phase — Core Objectives",
      layout: "THREEBOX",
      boxes: [
        { label: "Facilitation", desc: "Ensure the client can actually access services (transportation, paperwork, scheduling)." },
        { label: "Coordination", desc: "Therapist, doctor and social worker aren't working at cross-purposes." },
        { label: "Advocacy", desc: "Intervene when the client is denied service or hits a bureaucratic wall." }
      ],
      fourPart: {
        corePrinciples: [
          "During this phase, your primary focus shifts from “What do they need?” to “Is the plan working?”",
          "This phase is the “Engine Room” of Case Management for achieving set goals. CMs must balance support, monitoring, and problem-solving."
        ],
        howTo: [
          "Facilitation — remove logistical barriers to care.",
          "Coordination — keep every provider aligned on one treatment approach.",
          "Advocacy — step in when services are denied."
        ],
        bestPractices: [
          "Ask “Is the plan working?” at every contact.",
          "Pitfall: passively recording treatment instead of steering it."
        ],
        discussionCase: "Give an example of each pillar in a real file."
      },
      trainerCue: "The primary question during this phase is, “Is the plan working?” This requires continuous support, monitoring and problem-solving."
    },
    { h: "Treatment Phase: Monitoring Progress, Barriers & Crisis Intervention",
      fourPart: {
        corePrinciples: [
          "You aren't just checking boxes; you are evaluating clinical and functional outcomes.",
          "Treatment rarely goes perfectly. Case managers must be “barrier detectives.”"
        ],
        howTo: [
          "Client Check-in — ask specific questions about the treatment plan, like therapy session attendance, instead of just “How are you?”",
          "Documentation — use “GIRP” or “SOAP” notes to track behavioral changes and milestones.",
          "Identify Internal Barriers — motivation issues, relapse, mental health symptoms.",
          "Identify External Barriers — housing loss, childcare shortages, insurance lapses.",
          "Crisis Intervention — if a client faces a crisis (eviction, medical emergency, service denial, bureaucratic obstacle), pause or adjust the treatment plan to prioritize the immediate issue."
        ],
        bestPractices: [
          "Specific questions get specific answers — ask about attendance, pain scores and function.",
          "Pitfall: continuing the plan unchanged during a client crisis."
        ],
        discussionCase: "Name one internal and one external barrier you would ask about at every check-in."
      },
      trainerCue: "Your proactive approach ensures clients receive necessary support despite unexpected challenges."
    },
    { h: "Treatment Phase: Essential Client Communication Strategies",
      layout: "PROCESS",
      processSteps: [
        { label: "Assess Response", desc: "How is the client responding?" },
        { label: "Evaluate Efficacy", desc: "Is the intervention working?" },
        { label: "Adjust Intervention", desc: "Course-correct the plan." }
      ],
      fourPart: {
        corePrinciples: [
          "Motivational Interviewing — helps clients stay committed when the “newness” of treatment wears off.",
          "Boundaries — prevent burnout and keep the focus on client self-sufficiency.",
          "Active Listening — ensures the client feels heard and reduces misunderstandings with providers.",
          "The Treatment Phase is not linear. It is a cycle."
        ],
        howTo: [
          "Assess Response",
          "Evaluate Efficacy",
          "Adjust Intervention"
        ],
        bestPractices: [
          "If a client isn't achieving their goals, it's usually due to the plan rather than the individual.",
          "Modifying the plan reflects proactive management, not a misstep in the initial evaluation.",
          "Pitfall: blaming the client instead of revising the plan."
        ],
        discussionCase: "When did a plan change, not the client, fix a stalled case?"
      },
      trainerCue: "Case managers guide, not take over. Regularly revisit and adjust plans."
    },
    { h: "Handling the Treatment Phase: Clinical Documentation (GIRP)",
      layout: "QUADRANT",
      quadrants: [
        { label: "Goal", desc: "What part of the treatment plan are we addressing today?" },
        { label: "Intervention", desc: "What did you do? (e.g., “Provided psychoeducation on medication side effects.”)" },
        { label: "Response", desc: "How did the client react to your intervention?" },
        { label: "Plan", desc: "What is the next step before the next meeting?" }
      ],
      fourPart: {
        corePrinciples: [
          "Your notes serve as the legal and professional record of treatment success.",
          "Motivational Interviewing: at the midpoint of treatment, many clients experience a plateau as initial excitement wanes and hard work begins."
        ],
        howTo: [
          "Goal — name the part of the plan addressed.",
          "Intervention — state exactly what you did.",
          "Response — record the client's reaction.",
          "Plan — set the next step before the next meeting."
        ],
        bestPractices: [
          "Re-engage clients at the midpoint plateau to renew motivation.",
          "Pitfall: notes that describe feelings but no intervention or plan."
        ],
        discussionCase: "Write a four-line GIRP note for a client who missed two PT sessions."
      },
      trainerCue: "Treatment is cyclical — continuous assessment, intervention, and adjustment."
    },
    { h: "Handling the Treatment Phase: Proactive Resource Coordination",
      fourPart: {
        corePrinciples: [
          "You are the “hub” of the wheel. To handle this phase effectively, you must master the Warm Handoff.",
          "Instead of saying “Here is the number for the housing office,” a high-skill case manager says “I know Sarah at the housing office. Let's call her together right now to schedule your intake.” This reduces the “referral leak” where clients drop out of treatment during transitions.",
          "One of the biggest risks is Mission Creep — trying to solve every new problem that pops up, which dilutes focus on the primary treatment goals."
        ],
        howTo: [
          "Warm handoff — connect the client directly to the resource, together, in real time.",
          "Managing Boundaries: Empower — coach them through it instead of doing it for them; the goal is to eventually make the case manager unnecessary.",
          "Managing Boundaries: Prioritize — ask “Does this need to be solved to achieve our primary goal, or is it a distraction?”"
        ],
        bestPractices: [
          "Pro-Tip: always end a treatment-phase contact by asking “What is the one thing that might get in the way of you reaching your goal this week?”",
          "Pitfall: mission creep — taking on every new problem."
        ],
        discussionCase: "Role-play a warm handoff to a transportation resource."
      },
      trainerCue: "The Pro-Tip question forces clients to identify obstacles before they happen."
    },
    { h: "Treatment Red Flags: PT & Conservative Care, Surgical Protocols",
      fourPart: {
        corePrinciples: [
          "As a Case Manager, it is essential to become proficient in the standard treatment protocols in the US.",
          "PT & Conservative Care: in legal cases, PT is often the “baseline” of treatment. Red flags here usually signal the case is stagnating or being “over-treated” for billing purposes.",
          "Surgical Protocols: surgery is the most valuable aspect of a legal claim; red flags are often linked to safety and “Standard of Care.”"
        ],
        howTo: [
          "PT red flag — over 12 sessions with no improvement in Range of Motion (ROM) or pain, and no specialist or imaging suggested.",
          "PT red flag — sessions of heat packs, TENS units or massage without active exercise (“feel-good” treatment lacking legal value to adjusters).",
          "PT red flag — two or more missed appointments. Legal impact: defense may argue the injury isn't severe enough to justify the claim.",
          "Surgical red flag — recommending surgery (e.g., spinal fusion) before trying PT or injections (unless an emergency): a significant “Reasonable Necessity” red flag.",
          "Surgical red flag — switching “Left” and “Right” in medical records damages trial credibility.",
          "Surgical red flag — advising clients to “just wait until the follow-up” for fever or redness raises malpractice concerns.",
          "Surgical red flag — sharp or mechanical pain post-surgery may signal a loose screw or retained surgical sponge."
        ],
        bestPractices: [
          "Flag passive-only care early and ask about an active program.",
          "Proofread laterality (left/right) in every record summary.",
          "Pitfall: ignoring post-operative symptoms because the next visit is soon."
        ],
        discussionCase: "Which PT red flag most damages case value and why?"
      },
      trainerCue: "By being proactive in recognizing these red flags, you maintain effective and legally sound treatment."
    },
    { h: "Treatment Red Flags: Pain Management, Medication & Behavioral Health / TBI",
      fourPart: {
        corePrinciples: [
          "Pain Management & Medication is the most scrutinized area due to opioid regulations and “Medical Necessity” audits.",
          "Behavioral Health / TBI: clients with TBI are regarded as High Value Cases, necessitating utmost discretion."
        ],
        howTo: [
          "An opioid + muscle relaxant + sedative (“The Holy Trinity”) — massive safety risk and legal liability for “contributory negligence” if the client has an accident while medicated.",
          "Urine Drug Screen (UDS) shows the client isn't taking prescribed medication (possible diversion/selling) or shows illicit substances.",
          "Increasing dosages without a change in clinical diagnosis — suggests failing treatment or forming addiction.",
          "No memory loss mentioned at the ER, then “significant” TBI symptoms 3 months later when the lawsuit starts — requires immediate neurological validation to rule out “malingering.”",
          "Behavioral health notes focused on “general life stress” rather than the specific trauma of the accident — rarely covered and a huge red flag for “unreasonable” costs."
        ],
        bestPractices: [
          "Escalate medication red flags to the attorney and document the conversation with the provider.",
          "Keep behavioral-health notes tied to accident-related trauma.",
          "Pitfall: treating late-onset TBI symptoms as proof without validation."
        ],
        discussionCase: "How would you raise a UDS red flag with a provider without accusing the client?"
      },
      trainerCue: "Handling TBI cases with care is essential as they are often considered high-value."
    },
    { h: "Case Planning — Treatment: The Assessment Phase",
      layout: "QUADRANT",
      quadrants: [
        { label: "Clinical Evaluation", desc: "Identify physical, cognitive and psychological impairments." },
        { label: "Social Determinants", desc: "Housing, family support systems, financial stability." },
        { label: "Pre-Morbid Status", desc: "The client's baseline — pre-existing vs. accident-related." },
        { label: "Vocational / Educational Outlook", desc: "Can they return to their role or do they need retraining?" }
      ],
      fourPart: {
        corePrinciples: [
          "Before a plan can be built, you need a comprehensive understanding of the “whole person.” This involves more than just reviewing medical records."
        ],
        howTo: [
          "Clinical Evaluation — identify physical, cognitive, and psychological impairments.",
          "Social Determinants — assess housing, family support systems, and financial stability.",
          "Pre-Morbid Status — establish the client's “baseline” to differentiate pre-existing conditions from accident-related injuries.",
          "Vocational/Educational Outlook — determine if the client can return to their previous role or requires retraining."
        ],
        bestPractices: [
          "The pre-morbid baseline is your defense against the “pre-existing condition” argument.",
          "Pitfall: building the plan from medical records only."
        ],
        discussionCase: "What does John Doe's 2018 lumbar strain mean for his pre-morbid baseline?"
      },
      trainerCue: "This thorough assessment establishes a foundation for a personalized treatment plan."
    },
    { h: "Case Planning — Treatment: SMART Goal Setting",
      layout: "TABLE",
      tableHeaders: ["Goal Attribute", "What it means in a PI case"],
      tableRows: [
        ["Specific", "Instead of “get better,” name the function: “Improve lumbar range of motion so the client can lift 20 lbs at work.”"],
        ["Measurable", "Use objective measures (ROM %, ODI/VAS scores, sessions attended) that an adjuster can verify."],
        ["Achievable", "Realistic for the injury, the client's condition and the treatment available."],
        ["Relevant", "Tied to the client's recovery and the claim (ADLs, Return to Work)."],
        ["Time-bound", "A clear deadline — e.g., “improve ROM by 30% within two months.”"]
      ],
      fourPart: {
        corePrinciples: [
          "In a personal injury context, goals must be defensible and measurable to satisfy both clinicians and legal adjusters.",
          "SMART: Specific, Measurable, Achievable, Relevant, Time-bound."
        ],
        howTo: [
          "Name the specific function to improve.",
          "Attach an objective measurement.",
          "Check it is realistic for the client's condition.",
          "Tie it to recovery and legal outcomes.",
          "Set the deadline and review date."
        ],
        bestPractices: [
          "Example: “Improve range of motion in the injured limb by 30% within two months.”",
          "The time-bound element makes it possible to track progress and adjust.",
          "Pitfall: goals like “reduce pain” with no measure or date."
        ],
        discussionCase: "Convert “help John get back to work” into a SMART goal."
      },
      trainerCue: "Clear, attainable goals support client recovery and provide a solid foundation for legal proceedings."
    },
    { h: "Case Planning — Treatment: The Care Coordination Strategy",
      layout: "QUADRANT",
      quadrants: [
        { label: "Acute / Restorative Care", desc: "Surgery, Physiotherapy, Occupational Therapy." },
        { label: "Psychological Support", desc: "Counseling or CBT for PTSD, anxiety, adjustment disorders." },
        { label: "Durable Medical Equipment (DME)", desc: "Wheelchairs, ramps, assistive technology." },
        { label: "Rehabilitation Milestones", desc: "Inpatient → outpatient → home-based care." }
      ],
      fourPart: {
        corePrinciples: [
          "This is where you map out the specific interventions required. A standard framework categorizes these into four groups."
        ],
        howTo: [
          "Acute/Restorative Care — surgery, physiotherapy, and occupational therapy.",
          "Psychological Support — counseling or CBT to address PTSD, anxiety, or adjustment disorders.",
          "Durable Medical Equipment (DME) — sourcing wheelchairs, ramps, or assistive technology.",
          "Rehabilitation Milestones — transitioning from inpatient to outpatient or home-based care."
        ],
        bestPractices: [
          "Monitor milestones so transitions don't create treatment gaps.",
          "Pitfall: ignoring psychological support until the demand phase."
        ],
        discussionCase: "Which category is most often missing from PI care plans?"
      },
      trainerCue: "We monitor Rehabilitation Milestones to ensure a smooth transition from inpatient to outpatient or home-based care."
    },
    { h: "The Standard Treatment Map",
      layout: "TABLE",
      tableHeaders: ["Phase", "Timeline", "Typical Interventions", "Case Manager Focus"],
      tableRows: [
        ["Acute", "Days 1–14", "ER, Imaging (MRI/CT), bracing, RICE, initial PT", "Establishing Causation and “MedPay” coverage"],
        ["Sub-Acute", "Weeks 2–8", "Active Physical Therapy (2–3x weekly), specialist f/up", "Monitoring Functional Gains (e.g., ROM, weight-bearing)"],
        ["Restorative", "Months 2–6", "Work hardening, injections, psych adjustment", "Identifying Barriers to RTW (Return to Work)"],
        ["Maintenance", "6 Months+", "Home Exercise Program (HEP), PRN visits", "Determining MMI (Maximum Medical Improvement)"]
      ],
      fourPart: {
        corePrinciples: [
          "The Standard Treatment Map for personal injury cases: Emergency Medical Services → Emergency Room Treatment → MRI/Radiology → EMC → Chiropractic Care → Physical Therapy → Ortho → Pain Management → Surgery → Post-Operative Care → Long-Term Pain Management."
        ],
        howTo: [
          "Emergency Response — stabilization and assessment through EMS and ER.",
          "Diagnostics — MRI and radiology to identify underlying issues.",
          "Rehabilitation — physical therapy and chiropractic care.",
          "Surgical Interventions — surgery and pain management based on severity.",
          "Long-Term Care — sustaining recovery and preventing relapse."
        ],
        bestPractices: [
          "Know which phase of the map every client is in.",
          "Pitfall: treatment that skips steps (e.g., surgery before conservative care) without a documented reason."
        ],
        discussionCase: "Place John Doe on the map today and name the next expected step."
      },
      trainerCue: "Understanding this map is crucial for tailoring recovery to each patient's needs. Next: causation and MedPay."
    },
    { h: "Treatment Road Map Mastery & the Clinical Pathway Flowchart",
      layout: "PROCESS",
      processSteps: [
        { label: "Phase 1: Acute (Days 1–14)", desc: "Initial set-up: ER/urgent care diagnostic, establish causation MOI, PIP/MedPay verification." },
        { label: "Phase 2: Sub-Acute (Weeks 2–8)", desc: "Conservative care PT/Chiro, imaging MRI/EMG. Is the patient improving? Yes → continue; No → variance loop." },
        { label: "Phase 3: Restorative (Weeks 9–24)", desc: "Work hardening/FCE, surgical intervention?" },
        { label: "Phase 4: MMI / Discharge", desc: "Permanent impairment rating, final lien resolution, case settlement support." }
      ],
      fourPart: {
        corePrinciples: [
          "Mastering the Standard Treatment Map is the difference between a Case Manager who simply “observes” a recovery and one who “drives” it.",
          "In the US personal injury landscape, deviations from these maps are the primary reason for insurance denials and IME (Independent Medical Examination) triggers."
        ],
        howTo: [
          "Phase 1 — verify PIP/MedPay and establish the Mechanism of Injury (MOI).",
          "Phase 2 — ask “Is the patient improving?” at every check-in.",
          "If NO → Variance Detected → medication management/injections, specialist referral (Ortho/Neuro), psychological screening for yellow flags.",
          "Phase 3 — consider FCE (Functional Capacity Evaluation) and surgical necessity.",
          "Phase 4 — obtain the permanent impairment rating and move to final lien resolution."
        ],
        bestPractices: [
          "Glossary: MMI = Maximum Medical Improvement · MOI = Mechanics of Injury · PT = Physical Therapy · Chiro = Chiropractic Care · FCE = Functional Capacity Evaluation.",
          "Pitfall: letting the client drift off the map without documenting why."
        ],
        discussionCase: "What would trigger the variance loop for a client in Week 6?"
      },
      trainerCue: "Adhering closely to the treatment map is crucial to prevent insurance denials and ensure a smooth recovery."
    },
    { h: "Variance Analysis: Why the Map Fails",
      layout: "THREEBOX",
      boxes: [
        { label: "Clinical Variance", desc: "Secondary complications (e.g., radiculopathy not in the ER report)." },
        { label: "Psychosocial Variance", desc: "“Yellow Flags” — fear-avoidance, depression, no transport to therapy." },
        { label: "Systemic Variance", desc: "Delays in insurance authorization for an MRI or specialist referral." }
      ],
      fourPart: {
        corePrinciples: [
          "When a client drifts off the map, the case manager must diagnose the “Why” before the insurer terminates funding."
        ],
        howTo: [
          "Clinical Variance — secondary complications (e.g., a back-injury patient develops radiculopathy/nerve pain that wasn't in the initial ER report).",
          "Psychosocial Variance — “Yellow Flags” such as fear-avoidance behavior, depression, or lack of transportation to therapy.",
          "Systemic Variance — delays in insurance authorization for an MRI or specialist referral."
        ],
        bestPractices: [
          "Identify the variance type first — the fix depends on it.",
          "Pitfall: treating a systemic delay as client non-compliance."
        ],
        discussionCase: "Classify three real delays by variance type."
      },
      trainerCue: "Identifying variances early lets case managers intervene and keep treatment on track, ensuring continued progress and funding."
    },
    { h: "Communication Loops: The “Stakeholder Triad”",
      layout: "THREEBOX",
      boxes: [
        { label: "The Clinical Loop (MDT)", desc: "PT notes must align with the Orthopedist's orders." },
        { label: "The Legal Loop (Attorney)", desc: "Status reports that translate jargon into functional evidence (ADLs)." },
        { label: "The Financial Loop (Adjuster)", desc: "Proactive updates before the 6-week Physician Referral expires." }
      ],
      fourPart: {
        corePrinciples: [
          "In the US, the Case Manager acts as the central router for information. A breakdown in any of these loops can stall a case for months."
        ],
        howTo: [
          "Clinical Loop — ensure the PT's notes align with the Orthopedist's orders. If the PT says “90% recovered” but Ortho says “Total Disability,” the case has a documentation crisis.",
          "Legal Loop — provide status reports that translate medical jargon into functional evidence; the attorney needs to know what the client can't do (ADLs) to calculate “Pain and Suffering” damages.",
          "Financial Loop — send proactive updates before the 6-week “Physician Referral” expires, preventing gaps in treatment the defense can frame as “non-compliance.”"
        ],
        bestPractices: [
          "Reconcile conflicting provider statements immediately.",
          "Pitfall: sending the attorney raw medical records with no functional summary."
        ],
        discussionCase: "The PT and Ortho disagree on disability — who do you call first?"
      },
      trainerCue: "Maintaining these communication loops ensures treatment continuity and protects clients' interests."
    },
    { h: "The “Golden Standard”: Reasonable and Necessary",
      layout: "COMPARE",
      compareLeft: { label: "Reasonable", items: ["Is the treatment common for this specific MOI (Mechanism of Injury)?"] },
      compareRight: { label: "Necessary", items: ["Is there objective evidence (not just subjective pain) that the treatment is improving function?"] },
      fourPart: {
        corePrinciples: [
          "Under US law, specifically in the context of Utilization Review (UR), every item in your monitoring framework must meet two criteria: Reasonable and Necessary."
        ],
        howTo: [
          "Reasonable — check the treatment is common for the Mechanism of Injury.",
          "Necessary — look for objective evidence of functional improvement.",
          "The Red Flag Rule — if there's no change in the Oswestry Disability Index (ODI) score after 12 weeks of PT, the Treatment Map indicates a plateau.",
          "Seek a specialist or second opinion instead of persisting with ineffective treatment."
        ],
        bestPractices: [
          "Document objective measures (ODI, ROM) — not just pain reports.",
          "Pitfall: continuing ineffective treatment because it's already scheduled."
        ],
        discussionCase: "Which objective measure would you track for a lumbar injury?"
      },
      trainerCue: "Emphasizing “reasonable” and “necessary” is crucial for effective treatment monitoring."
    },
    { h: "Immediate Action Protocol: A-C-T for Red Flags",
      layout: "PROCESS",
      processSteps: [
        { label: "Assess", desc: "Medical Danger (fever, hardware failure) or Legal Danger (gaps, generic notes)?" },
        { label: "Clarify", desc: "Call the provider's MA — “15 PT sessions, no progress; Ortho referral?”" },
        { label: "Track", desc: "Document the flag and your fix attempt — the “why” for the attorney." }
      ],
      fourPart: {
        corePrinciples: [
          "When you spot a red flag during treatment, follow the A-C-T protocol."
        ],
        howTo: [
          "Assess — is the flag a Medical Danger (fever, hardware failure) or a Legal Danger (gaps in care, generic notes)?",
          "Clarify — call the provider's Medical Assistant. Ask: “The client has had 15 PT sessions with no progress; is the doctor considering an Orthopedic referral?”",
          "Track — document the red flag and your attempt to fix it. If the attorney needs to “drop” a provider because they are damaging the case, your documentation provides the “why.”"
        ],
        bestPractices: [
          "Medical dangers go to the provider immediately; legal dangers go to the attorney.",
          "Pitfall: fixing a problem without documenting it."
        ],
        discussionCase: "Run A-C-T on a client reporting sharp pain after surgery."
      },
      trainerCue: "This protocol promotes a proactive approach in managing cases with diligence and care."
    },
    { h: "Illustration & Course Correction: The 6-Week Rule and Objective Metrics",
      layout: "TABLE",
      tableHeaders: ["Metric", "Purpose", "When to Use"],
      tableRows: [
        ["Oswestry / DASH", "Measures ADL disability", "Every 30 days"],
        ["Gait Analysis", "Measures mobility / fall risk", "For lower-extremity injuries"],
        ["PHQ-9 / GAD-7", "Screens for depression / anxiety", "If physical progress stalls (Yellow Flags)"],
        ["FCE", "Functional Capacity Evaluation", "Before “Return to Work” / MMI"]
      ],
      fourPart: {
        corePrinciples: [
          "Under US law (Utilization Review), every item in your monitoring framework must be Reasonable and Necessary — the Standard US PI Treatment Map (Clinical Pathway Flowchart) is your illustration of that path.",
          "1. Identifying the “Plateau” (The 6-Week Rule): most adjusters look for a “Functional Gap” at the 6-week mark.",
          "2. Monitoring via Objective Metrics keeps the communication loop “tight” with the insurer."
        ],
        howTo: [
          "The Map Expectation — a 20–30% improvement in Range of Motion (ROM) or a reduction in pain scores (VAS) by week 6.",
          "The Variance — if the client is still at 10/10 pain after 12 sessions of PT, the map tells you to pivot immediately.",
          "Do not wait for the adjuster to deny the next 6 sessions.",
          "Use standard US tools in monitoring notes: Oswestry/DASH, Gait Analysis, PHQ-9/GAD-7, FCE."
        ],
        bestPractices: [
          "Put objective metric results in every status update to the insurer.",
          "Pitfall: waiting for a denial before course-correcting."
        ],
        discussionCase: "At week 6 ROM has improved 5%. What do you do?"
      },
      trainerCue: "Utilize these guidelines to adapt the treatment plan, aiming for optimal client outcomes. Allow pauses for audience reflection."
    },
    { h: "The “Yellow Flag” Warning System",
      fourPart: {
        corePrinciples: [
          "As a Case Manager, you are monitoring for psychosocial barriers that “derail” the map."
        ],
        howTo: [
          "Catastrophizing — “I will never walk again” (despite minor clinical findings).",
          "Litigation Stress — high conflict with the defense side slowing recovery.",
          "Iatrogenic Factors — dependency on opioids or excessive “passive” care (ice/heat) vs. “active” care (exercise).",
          "When you communicate with the Attorney and Insurer, use the map to justify your plan."
        ],
        bestPractices: [
          "Model language: “Client is currently in Phase 2 (Sub-Acute). We have noted a Clinical Variance: physical therapy has not reduced radicular pain. Per the Standard Treatment Map, I am recommending an MRI and Neurosurgical consult to rule out surgical necessity before proceeding to Phase 3. This ensures treatment remains Reasonable and Necessary.”",
          "Pitfall: reporting yellow flags without a recommended plan."
        ],
        discussionCase: "Rewrite a vague status update using the model language."
      },
      trainerCue: "Addressing yellow flags early keeps the treatment path reasonable and necessary, ultimately benefiting the client's recovery."
    },
    { h: "Handling Treatment Gaps During the Treatment Phase",
      fourPart: {
        corePrinciples: [
          "🎯 Why early intervention matters — treatment gaps identified during active care can weaken injury credibility, delay recovery progress, create documentation inconsistencies, and reduce future settlement value.",
          "👉 Early case management intervention helps prevent larger demand-phase issues later.",
          "🔍 Common causes: missed appointments; transportation problems; financial concerns or co-pays; work schedule conflicts; client stops treatment after temporary symptom relief; delays in referrals, imaging, or authorizations."
        ],
        howTo: [
          "✅ Monitor treatment frequency and appointment compliance.",
          "✅ Follow up immediately after missed appointments.",
          "✅ Educate clients on the importance of consistent treatment.",
          "✅ Help coordinate transportation, scheduling, or referrals.",
          "✅ Communicate with providers regarding care interruptions.",
          "✅ Document all client explanations and follow-up efforts."
        ],
        bestPractices: [
          "📋 Maintain updated treatment timelines.",
          "Track referral completion and pending appointments.",
          "Encourage clients to report worsening symptoms promptly.",
          "Escalate prolonged or unexplained gaps to supervising staff or attorneys.",
          "👉 Consistent treatment documentation strengthens both medical support and future negotiation leverage."
        ],
        discussionCase: "A client missed two weeks after “feeling better.” Script your call."
      },
      trainerCue: "Highlight the Case Manager's role in catching gaps during active care — prevention now is far cheaper than explaining gaps in the demand."
    },
    { h: "Common Bottlenecks: Escalation Protocol & the Escalation Ladder",
      layout: "PROCESS",
      processSteps: [
        { label: "Level 1 — Clinical", desc: "Provider office manager: expedite notes / peer-to-peer." },
        { label: "Level 2 — Administrative", desc: "“Notice of Delay” to the Adjuster and Plaintiff Attorney." },
        { label: "Level 3 — Legal", desc: "Attorney: “Motion to Compel” or LOP to bypass stalling." }
      ],
      fourPart: {
        corePrinciples: [
          "When a bottleneck occurs, use the 3-Step Escalation.",
          "Resolve (The Escalation Ladder): when the Standard Treatment Map hits a wall, you move up the ladder."
        ],
        howTo: [
          "Level 1 (Clinical) — contact the provider's office manager to expedite notes or peer-to-peer reviews.",
          "Level 2 (Administrative) — issue a “Notice of Delay” to the Adjuster and Plaintiff Attorney, documenting the barrier to care.",
          "Level 3 (Legal) — request the Attorney file a “Motion to Compel” or use an LOP (Letter of Protection) to bypass insurance stalling.",
          "Step A (The Clinician) — request a “Peer-to-Peer” review between the treating doctor and the insurance medical director.",
          "Step B (The Adjuster) — send a “Status Update” stating the delay is increasing total claim cost by extending temporary disability.",
          "Step C (The Attorney) — if Step B fails, the attorney issues a “30-Day Demand” or switches the provider to an LOP basis to bypass authorization wait times."
        ],
        bestPractices: [
          "Climb one rung at a time and document each attempt.",
          "Pitfall: jumping straight to the attorney before clinical and administrative steps."
        ],
        discussionCase: "MRI authorization has been pending 3 weeks. Walk the ladder."
      },
      trainerCue: "Each step escalates efficiently while prioritizing the client's interests and continuous care."
    },
    { h: "Skill Building: The “Eggshell Plaintiff” vs. the 2018 Lumbar Strain",
      skill: { tool: "cmTreatment1", cms: true },
      fourPart: {
        corePrinciples: [
          "John Doe vs. Apex Delivery Services (Aggressive Casualty). Based on the intake, we have a critical complication: the “Eggshell Plaintiff” narrative vs. a prior 2018 lumbar strain.",
          "The Strategic Conflict: Aggressive Casualty (the 3P carrier) has seen the 2018 record. They are stalling the MRI for the L4-L5 protrusion noted in your internal intake, claiming the injury is a “pre-existing degenerative condition” and not caused by the T-bone collision with the Apex truck.",
          "The Case Management Objective: you must prove Aggravation. Under US law, an “Eggshell Plaintiff” is entitled to full recovery for the increase in disability, even if they were more vulnerable to injury than a healthy person."
        ],
        howTo: [
          "Pull the 2018 records and establish the pre-morbid baseline (resolved, no treatment since).",
          "Document the change in function since the collision with objective measures.",
          "Escalate the MRI stall using the escalation ladder (peer-to-peer, status update, LOP).",
          "Write the aggravation argument for the attorney."
        ],
        bestPractices: [
          "Highlight how the accident aggravated the prior injury — never hide the prior record.",
          "Pitfall: arguing the prior injury “doesn't matter” instead of proving the change."
        ],
        discussionCase: "What single document best proves aggravation here?"
      },
      trainerCue: "Run this as a guided problem — trainees must prove aggravation, not deny the prior history."
    },
    { h: "Skill Building: Handling Client Treatment — “The Transportation Wall”",
      skill: { tool: "cmTreatment1", cms: true },
      fourPart: {
        corePrinciples: [
          "🛑 The Scenario: “The Transportation Wall.”",
          "The Plan: John is currently in a 12-week intensive Chiro program. He has been doing great for 4 weeks.",
          "The Crisis: John calls you. His car's transmission just died. He says, “I can't get to the clinic anymore. It's a 45-minute drive. I might as well just quit the program and try again next year when I have money saved.”"
        ],
        howTo: [
          "🛠 Your Task: how will you approach the situation? Run a “Flash-Simulation.”",
          "Option A (The Problem Solver) — look up bus routes, call a local non-profit for ride vouchers, and email the schedule.",
          "Option B (The Empowerer) — ask about alternative transportation in his neighborhood and brainstorm ride options for tomorrow.",
          "Option C (The Clinical Pivot) — contact the clinic to arrange temporary telehealth / home-program sessions while the car issue is addressed.",
          "Create a case file in the training interface (CMS) and update the case file with your plan."
        ],
        bestPractices: [
          "A treatment gap now becomes a demand-phase problem later — act today.",
          "Pitfall: accepting “I'll quit and try again next year” without a plan."
        ],
        discussionCase: "Which option best balances empowerment with keeping treatment on track?"
      },
      trainerCue: "Choose from Option A (Problem Solver), B (Empowerer), C (Clinical Pivot) and debrief the trade-offs. Trainees update the CMS case file."
    }
  ],
  quickChecks: [
    { afterIndex: 7, q: "After the verification call confirms the facts of loss, the Case Manager's job is to:", opts: ["Keep gathering more information", "Assess whether the firm will accept the case based on verified facts and intake completeness", "Send the demand letter", "Close the file"], a: 1, r: "At acceptance determination you are no longer gathering information — you are assessing acceptance." },
    { afterIndex: 21, q: "A client is 66 years old. Before clinical planning you must:", opts: ["Wait until settlement to check Medicare", "Report the case to the BCRC", "Send a standard medical release", "Skip HIPAA authorization"], a: 1, r: "Clients 65+ or on SSDI must be reported to the Benefits Coordination & Recovery Center to avoid federal penalties and settlement freezes." },
    { afterIndex: 39, q: "A client has had 12 weeks of PT with no change in ODI score. The Treatment Map says:", opts: ["Continue the same treatment", "This is a plateau — seek a specialist or second opinion", "Close the file", "Stop documenting"], a: 1, r: "The Red Flag Rule: no ODI change after 12 weeks indicates a plateau; a proactive CM seeks a specialist or second opinion." }
  ],
  quiz: [
    { q: "Case Management is best defined as:", opts: ["Filing documents with the court", "End-to-end coordination, tracking, and handling of a case from intake to resolution", "Negotiating with adjusters only", "Scheduling client appointments"], a: 1, r: "It covers the whole lifecycle from intake to resolution." },
    { q: "Which step must happen before the case file is created in a real intake workflow?", opts: ["Demand letter", "Conflict check", "Lien negotiation", "Mediation"], a: 1, r: "Run a conflict check in the system before proceeding." },
    { q: "The three possible intake decisions are:", opts: ["Accept, Escalate, Decline", "Accept, Settle, Litigate", "Open, Close, Archive", "Demand, Negotiate, Settle"], a: 0, r: "✅ Accepted, ⚠️ Escalated for attorney/senior review, ❌ Declined." },
    { q: "“Clients not responding to clarification requests” is an example of which bottleneck?", opts: ["Intake form errors", "Delayed client follow-up", "Conflict check delays", "Communication gaps"], a: 1, r: "Delayed client follow-up." },
    { q: "Coverage determination answers:", opts: ["Who is responsible?", "Is there money to pay the claim?", "What is the case worth?", "When is the SOL?"], a: 1, r: "Coverage = is there money to pay; Liability = who is responsible; Projection = what is it worth." },
    { q: "Which is NOT part of the Regulatory Triple-Check?", opts: ["HIPAA claim-specific authorization", "Medicare/Medicaid reporting", "Subrogation / payer order", "Mediation binder"], a: 3, r: "The triple-check is HIPAA, Medicare/Medicaid reporting, and subrogation/payer order." },
    { q: "The correct primary payer order is:", opts: ["LOP → Health Insurance → PIP", "PIP/MedPay → Private Health Insurance → LOP/Provider Liens", "Health Insurance → PIP → LOP", "Defendant's insurer first"], a: 1, r: "PIP/MedPay → Private Health Insurance → LOP/Provider Liens." },
    { q: "The “Golden Rule” of US claim set-up is:", opts: ["Commingle medical and legal notes for efficiency", "Coordinate, don't commingle — keep the medical plan and legal claim as parallel tracks", "Only the attorney writes notes", "Never document barriers"], a: 1, r: "Legal opinions in medical notes are used by defense to impeach neutrality." },
    { q: "In the Treatment Phase the primary question becomes:", opts: ["What do they need?", "Is the plan working?", "Who is at fault?", "What's the policy limit?"], a: 1, r: "Focus shifts from “What do they need?” to “Is the plan working?”" },
    { q: "GIRP stands for:", opts: ["Goal, Intervention, Response, Plan", "Gap, Injury, Record, Payment", "Goal, Insurance, Release, Policy", "General Injury Review Protocol"], a: 0, r: "Goal · Intervention · Response · Plan." },
    { q: "A “warm handoff” means:", opts: ["Giving the client a phone number", "Connecting the client directly to the resource together, in real time", "Emailing the provider later", "Transferring the file to another CM"], a: 1, r: "It reduces “referral leak” during transitions." },
    { q: "An opioid + muscle relaxant + sedative combination is called:", opts: ["The Golden Standard", "The Holy Trinity — a major safety and liability red flag", "The Treatment Map", "Standard of care"], a: 1, r: "It creates safety risk and contributory-negligence exposure." },
    { q: "At the 6-week mark adjusters expect roughly:", opts: ["No change", "A 20–30% improvement in ROM or reduced pain scores", "Full recovery", "Surgery"], a: 1, r: "The 6-Week Rule looks for a Functional Gap of 20–30%." },
    { q: "Delays in insurance authorization for an MRI are which variance?", opts: ["Clinical", "Psychosocial", "Systemic", "Financial"], a: 2, r: "Systemic variance." },
    { q: "In the A-C-T protocol, “Track” means:", opts: ["Track the client's location", "Document the red flag and your attempt to fix it", "Track billing codes", "Track the adjuster's calls"], a: 1, r: "Documentation provides the “why” if a provider must be dropped." },
    { q: "Level 2 of the 3-Step Escalation is:", opts: ["Motion to Compel", "Notice of Delay to the Adjuster and Plaintiff Attorney", "Call the provider's office manager", "Close the file"], a: 1, r: "Level 1 Clinical, Level 2 Administrative (Notice of Delay), Level 3 Legal." },
    { q: "The “Eggshell Plaintiff” doctrine means:", opts: ["Clients with prior injuries recover nothing", "The client may recover for the increase in disability even if more vulnerable than a healthy person", "The defense can always reduce value by 50%", "Only new injuries count"], a: 1, r: "You must prove aggravation." }
  ],
  discussionQuestion: "John Doe's packet has a DOB mismatch, two different occupations, an unsigned HIPAA authorization, a passenger spouse, a prior attorney's lien and a 2018 lumbar strain. What do you verify, what do you document, and would you Accept, Escalate, or Decline today?"
};
