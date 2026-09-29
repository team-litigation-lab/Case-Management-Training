/* Trainer notes for Presenter view, Admin → Trainer Cues and the Speaker Notes PDF (same file as the
   EA/PA course, with Case Management content). Written by hand for each slide, keyed "<day>::<topic title>".
   p1 = the topic's first slide (① Core Principles, ② Step-by-Step), p2 = its second slide
   (③ Best Practices & Pitfalls). "on" is the "On this slide" box: what the room is looking at.
   The read-aloud scripts are in js/slide-scripts/dayN.js. Nothing here is generated at run time. */
window.PRESENTER_NOTES = {
// ---------- Day 1 ----------
"1::Training Agenda & What Case Management Is": {
  "p1": {"on": "This slide sets out today's agenda (fundamentals, intake and acceptance, and the Treatment Phase) and defines case management as the end-to-end coordination of a case from intake to resolution. The three steps name what good case management delivers: timely progression, proper documentation and compliance, and effective communication."},
  "p2": {"on": "This slide says intake, evaluation and representation approval are the foundation of everything after them, and that knowing where bottlenecks form lets you get ahead of them. The pitfall to stress is treating case management as data entry instead of ownership."}
},
"1::The General Case Management Process": {
  "p1": {"on": "This slide shows the seven-stage general process every case moves through, from Intake & Case Opening to Case Resolution & Closing, as a left-to-right flow. The core principle is that each stage feeds the next, so weak work early shows up as problems later."},
  "p2": {"on": "This slide asks trainees to know which stage every file is in and reminds them that documentation, communication and monitoring run continuously. The pitfall is jumping to resolution before the file is properly documented and billed."}
},
"1::Key Duties of a Case Manager": {
  "p1": {"on": "This slide lists the nine key duties of a Case Manager, from legal and compliance research through planning and recommendation, each with an icon and a one-line description. The five steps turn those duties into the work: research, draft and file, summarize, monitor, and analyze and recommend."},
  "p2": {"on": "This slide says every recommendation needs its reason and evidence, and that case health analysis means finding weak spots before an adjuster does. The pitfall is tracking tasks without confirming they were completed correctly."}
},
"1::Understanding Case Phases": {
  "p1": {"on": "This slide lays out the case phases as a flow: Intake, Investigation / Claim Set-Up, Treatment, Pre-Demand, Demand, Settlement & Lien Negotiations, Disbursement and, when needed, Litigation. Each phase has its own goals, responsibilities and deliverables."},
  "p2": {"on": "This slide says not to move a file forward until the current phase's deliverables are complete, and to record every phase change in the CMS. The pitfall is treating litigation as a normal next step rather than the path for cases that couldn't resolve."}
},
"1::Case Phase: Intake — Establishing Control": {
  "p1": {"on": "This slide explains that intake is where the Case Manager establishes control, structure and clarity, and that it decides whether the case moves forward or is declined. The four steps are: capture complete client details, screen for conflicts, assess viability and eligibility, and set up a properly structured file."},
  "p2": {"on": "This slide says a well-organized file from day one speeds up every later phase, and that careful attention at intake raises the chance of a good outcome. The pitfall is moving a case forward before the conflict check is complete."}
},
"1::The Real Intake Workflow": {
  "p1": {"on": "This slide shows the real intake workflow as a flow: the client submits an inquiry, the Case Manager reviews and verifies the details, the conflict check is completed, the case is approved or escalated, and the file is created and logged. The six steps add identifying missing information and communicating next steps."},
  "p2": {"on": "This slide asks Case Managers to own the workflow end to end and to be proactive about inconsistencies rather than waiting for someone else to catch them. The pitfall is creating the file before the conflict check is documented."}
},
"1::Intake & Initial Client Contact — Gatekeepers of Case Quality": {
  "p1": {"on": "This slide explains that initial client contact gathers the basic facts and urgency, and that the Case Manager's role starts after intake as the quality-control reviewer before a case is accepted. The four steps confirm the intake is complete, accurate, properly documented and ready for activation."},
  "p2": {"on": "This slide sets the standard: incomplete intake goes back, not forward, and high standards here protect the integrity of the whole process. The pitfall is accepting a case because the intake mostly looks fine."}
},
"1::Case Acceptance Determination": {
  "p1": {"on": "This slide explains that once the verification call confirms the facts of loss, the Case Manager stops gathering information and assesses whether the firm will accept the case. The four steps end with recording the decision (Accepted, Escalated or Declined) with the reason."},
  "p2": {"on": "This slide says only qualified cases should progress, which protects quality and the firm's reputation, and every decision needs a documented reason someone else can follow. The pitfall is gathering more information at this stage instead of making the determination."}
},
"1::Common Intake Bottlenecks — Overview": {
  "p1": {"on": "This slide defines intake bottlenecks as points where work slows down, gets stuck or becomes inconsistent, and lists the five common causes: missing information, delayed client responses, poorly documented submissions, verification or conflict-check delays, and unclear eligibility decisions."},
  "p2": {"on": "This slide says to name a bottleneck precisely before trying to fix it, and that dealing with these early gives a smoother intake and happier clients. The pitfall is blaming the client for delays that are really process gaps."}
},
"1::Bottleneck: Incomplete Client Information": {
  "p1": {"on": "This slide covers the first bottleneck, incomplete client information, and its three forms: missing contact details or incident facts, no supporting documents, and vague or unclear case summaries."},
  "p2": {"on": "This slide recommends a checklist so every intake captures the same minimum data, and requesting missing documents in one consolidated message with a deadline. The pitfall is rewriting a vague summary from memory instead of confirming the facts with the client."}
},
"1::Bottleneck: Delayed Client Follow-Up": {
  "p1": {"on": "This slide covers delayed client follow-up and its three forms: clients not answering clarification requests, missing verification call confirmations, and slow submission of required documents."},
  "p2": {"on": "This slide recommends setting follow-up reminders the moment a request goes out and giving the client an easy way to respond. The pitfall is letting a file sit because 'we're waiting on the client' without logging the attempts."}
},
"1::Bottleneck: Conflict Check Delays": {
  "p1": {"on": "This slide explains that conflict checks must be complete before the case proceeds, and lists three causes of delay: system backlog or manual verification, incomplete conflict-check entries, and unclear opposing-party information."},
  "p2": {"on": "This slide says to enter full legal names for every party, including the company and its driver (for example, Apex Delivery Services and its driver), and to record the date and result of every check. The pitfall is running the check on a nickname or partial name."}
},
"1::Bottleneck: Intake Form Errors": {
  "p1": {"on": "This slide covers errors on the intake form and their three forms: incorrect dates or inconsistent statements, missing signatures or authorization forms, and duplicate or misfiled records."},
  "p2": {"on": "This slide recommends comparing the intake narrative against the police report and client statement before acceptance, and checking every signature and authorization before activation. The pitfall is correcting an inconsistency silently instead of confirming and documenting the correction."}
},
"1::Bottleneck: Case Eligibility Uncertainty": {
  "p1": {"on": "This slide covers submissions that arrive without a clear answer on eligibility: no clear legal assessment, a need for attorney review, or ambiguous facts of loss or liability."},
  "p2": {"on": "This slide says to escalate with a short summary of exactly what is ambiguous, and to clarify the facts of loss with the client first when you can. The pitfall is letting an uncertain file sit in limbo."}
},
"1::Bottleneck: Communication Gaps": {
  "p1": {"on": "This slide explains that gaps between teams stall intake even when the work itself is done, and names three: the intake team not updating Case Managers, the Case Manager not getting the complete packet, and miscommunication between departments."},
  "p2": {"on": "This slide recommends clear communication channels and using the CMS as the single source of truth instead of side emails. The pitfall is assuming the intake team sent everything."}
},
"1::Skill Building: Intake Decision Challenge & Applied Case Manager Actions": {
  "p1": {"on": "This slide sets up the Intake Decision Challenge: John Doe has submitted an inquiry against Apex Delivery Services, and trainees must decide whether to accept, escalate or decline. The steps cover documenting the reason, communicating next steps, and four Applied CM Actions: find where intake slowed, find the root cause, act now, and prevent a repeat."},
  "p2": {"on": "This slide asks trainees to open the case in the CMS training interface and log their decision there, and notes that better training, communication or technology prevents repeat bottlenecks. The pitfall is deciding without documenting the reason."}
},
"1::Tools for Case Planning & the PI Case Lifecycle Strategy": {
  "p1": {"on": "This slide explains that inside a legal framework, case management moves from best efforts to strict compliance, and that a PI case is a race against the Statute of Limitations and the insurer's gap-in-treatment defense. The four tools are the CMS, task trackers and calendars, document management systems and workflow automation."},
  "p2": {"on": "This slide says to docket the Statute of Limitations on day one and use task trackers so gaps in treatment are visible as soon as they start. The pitfall is relying on memory instead of the system for deadlines."}
},
"1::Claim Set-Up: Coverage Determination & Liability Assessment": {
  "p1": {"on": "This slide puts coverage determination and liability assessment side by side. Coverage asks whether valid insurance exists and what its type, limits and exclusions are; liability asks who caused the incident, whether fault is clear, shared or disputed, what evidence supports it, and whether comparative negligence applies."},
  "p2": {"on": "This slide says both assessments are essential to a strong claim and that the source of every coverage fact (dec page, adjuster letter, police report) should be recorded. The pitfall is assuming coverage exists because the defendant is a business."}
},
"1::Claim Set-Up: Case Projection — Why the Three Work Together": {
  "p1": {"on": "This slide shows three boxes that work together: Coverage (is there money to pay the claim?), Liability (who is responsible?) and Projection (what is the case likely worth and how will it move?). The five projection factors are coverage availability, liability strength, injury severity, treatment expectations and documentation quality."},
  "p2": {"on": "This slide says to re-project whenever coverage, liability or treatment changes, and to write the projection with its assumptions. The pitfall is projecting value before coverage is confirmed."}
},
"1::Case Study: John Doe v. Apex — Coverage Analysis": {
  "p1": {"on": "This slide gives the John Doe v. Apex case snapshot: a T-bone collision with an Apex commercial vehicle driven by Robert W. Smith at 4th Ave & Main St on 02/14/2026. It lists the coverage sources: Aggressive Casualty's commercial auto policy for Apex, plus John's own Local Farm Mutual PIP ($10,000) and UM/UIM ($250,000/$500,000)."},
  "p2": {"on": "This slide gives the Case Manager insight that defendant-side coverage looks strong but must be confirmed before the projection is finalized. The pitfall is quoting a likely limit to the client before it's confirmed in writing."}
},
"1::Case Study: John Doe v. Apex — Liability Determination": {
  "p1": {"on": "This slide analyzes the fact pattern: the Apex F-150 entered on a red signal while John turned left on a green arrow, and the driver was cited for Failure to Yield and Disregarding a Traffic Control Device, creating a strong presumption of negligence. It adds possible vicarious liability for Apex and a risk note that liability isn't final until the police report, driver statement and dashcam or other evidence confirm it."},
  "p2": {"on": "This slide gives the insight that liability is likely favorable but still pre-confirmation, and that diligence in confirming it builds a robust case. The pitfall is telling the client liability is a sure thing before the police report is in."}
},
"1::Case Planning Framework: Regulatory Intake & Verification": {
  "p1": {"on": "This slide sets out the Regulatory Triple-Check to clear before clinical planning: a claim-specific HIPAA authorization, Medicare/Medicaid reporting to the BCRC for clients 65+ or on SSDI (under MMSEA), and subrogation management through the primary payer order of PIP/MedPay, then private health insurance, then LOP/provider liens."},
  "p2": {"on": "This slide says to clear the triple-check before any clinical planning and to log the BCRC report date in the file. The pitfall is using a generic medical release that doesn't name the incident date."}
},
"1::Case Planning Framework: The Three-Pillar Case Plan": {
  "p1": {"on": "This slide explains that once the claim is set up the plan must be filed, often within 30–60 days depending on the state, in three pillars: Clinical (acute interventions such as PT and specialty consults), Functional (ADLs and Return to Work status) and Financial (payer order, subrogation and MMSEA compliance)."},
  "p2": {"on": "This slide says to file the plan inside the state window and docket the date, and to give each pillar measurable goals. The pitfall is a plan that only covers clinical care."}
},
"1::Case Planning Framework: Mandatory Disclosure & Compliance Tracking": {
  "p1": {"on": "This slide explains the Case Manager's duty to keep a clean file that is discoverable in litigation, and lists three areas: electronic record integrity (a SOC2-compliant CMS with an unalterable audit trail), state-specific timelines such as IMEs in No-Fault states like NY or FL, and tracking LOP providers for uninsured clients."},
  "p2": {"on": "This slide says to assume every note will be read by defense counsel and to keep the LOP provider list current with balances. The pitfall is editing records in a way that breaks the audit trail."}
},
"1::The “Golden Rule” of US Claim Set-Up": {
  "p1": {"on": "This slide gives the golden rule of US claim set-up: coordinate, don't commingle. The medical plan and the legal claim run as two parallel tracks that never cross-contaminate, with factual clinical notes in one and legal strategy only in the other."},
  "p2": {"on": "This slide warns against legal opinions in medical notes, which defense counsel can use to challenge the Case Manager's neutrality. The pitfall is writing 'this will help the case' in a treatment note."}
},
"1::The Treatment Phase — Core Objectives": {
  "p1": {"on": "This slide explains that in the Treatment Phase the question shifts from 'What do they need?' to 'Is the plan working?', calling it the engine room of case management. Three boxes set out the objectives: Facilitation (access to services), Coordination (providers aligned) and Advocacy (stepping in when services are denied)."},
  "p2": {"on": "This slide says to ask 'Is the plan working?' at every contact. The pitfall is passively recording treatment instead of steering it."}
},
"1::Treatment Phase: Monitoring Progress, Barriers & Crisis Intervention": {
  "p1": {"on": "This slide explains that monitoring means evaluating clinical and functional outcomes, not checking boxes, and that Case Managers must be barrier detectives. The steps cover specific client check-ins, GIRP or SOAP documentation, internal and external barriers, and crisis intervention that pauses or adjusts the plan."},
  "p2": {"on": "This slide says specific questions get specific answers, so ask about attendance, pain scores and function. The pitfall is carrying on with the plan unchanged during a client crisis."}
},
"1::Treatment Phase: Essential Client Communication Strategies": {
  "p1": {"on": "This slide names three communication strategies (Motivational Interviewing, Boundaries and Active Listening) and shows that the Treatment Phase is a cycle, not a line: Assess Response, Evaluate Efficacy, Adjust Intervention."},
  "p2": {"on": "This slide says that when a client isn't reaching their goals, the problem is usually the plan rather than the person, and that changing the plan is proactive management, not a sign the first evaluation was wrong. The pitfall is blaming the client instead of revising the plan."}
},
"1::Handling the Treatment Phase: Clinical Documentation (GIRP)": {
  "p1": {"on": "This slide explains that notes are the legal and professional record of treatment success and introduces the GIRP format in four boxes: Goal, Intervention, Response and Plan. It also notes the midpoint plateau, when initial excitement fades and motivational interviewing matters most."},
  "p2": {"on": "This slide says to re-engage clients at the midpoint plateau to renew motivation. The pitfall is notes that describe feelings but record no intervention or plan."}
},
"1::Handling the Treatment Phase: Proactive Resource Coordination": {
  "p1": {"on": "This slide says the Case Manager is the hub of the wheel and must master the warm handoff: connecting the client to a resource together, in real time, to stop the referral leak. It also warns about mission creep and gives two boundary tools: empower the client, and prioritize what serves the primary goal."},
  "p2": {"on": "This slide gives the pro-tip of ending every treatment-phase contact by asking what might get in the way of the client's goal this week. The pitfall is mission creep: taking on every new problem."}
},
"1::Case Planning — Treatment: The Assessment Phase": {
  "p1": {"on": "This slide explains that before a plan can be built you need to understand the whole person, not just the medical records. Four boxes cover the assessment: Clinical Evaluation, Social Determinants, Pre-Morbid Status (the pre-accident baseline) and Vocational / Educational Outlook."},
  "p2": {"on": "This slide says the pre-morbid baseline is your defense against the pre-existing condition argument. The pitfall is building the plan from medical records only."}
},
"1::Case Planning — Treatment: SMART Goal Setting": {
  "p1": {"on": "This slide explains that PI goals must be defensible and measurable to satisfy both clinicians and adjusters, and uses a table to apply SMART (Specific, Measurable, Achievable, Relevant, Time-bound) to a PI case, with examples such as lifting 20 lbs at work and improving ROM by 30% within two months."},
  "p2": {"on": "This slide gives the example goal 'Improve range of motion in the injured limb by 30% within two months' and says the time-bound element makes progress trackable. The pitfall is goals like 'reduce pain' with no measure or date."}
},
"1::Case Planning — Treatment: The Care Coordination Strategy": {
  "p1": {"on": "This slide maps the specific interventions into four groups: Acute / Restorative Care (surgery, PT, OT), Psychological Support (counseling or CBT for PTSD, anxiety or adjustment disorders), Durable Medical Equipment (wheelchairs, ramps, assistive technology) and Rehabilitation Milestones (inpatient to outpatient to home-based care)."},
  "p2": {"on": "This slide says to monitor milestones so transitions don't create treatment gaps. The pitfall is ignoring psychological support until the demand phase."}
},
"1::The Standard Treatment Map": {
  "p1": {"on": "This slide shows the Standard Treatment Map for PI cases (EMS, ER, MRI/Radiology, EMC, Chiropractic, PT, Ortho, Pain Management, Surgery, Post-Op and Long-Term Pain Management) and a table of four phases: Acute (Days 1–14), Sub-Acute (Weeks 2–8), Restorative (Months 2–6) and Maintenance (6 months+), each with typical interventions and the Case Manager's focus."},
  "p2": {"on": "This slide says to know which phase of the map every client is in. The pitfall is treatment that skips steps, such as surgery before conservative care, without a documented reason."}
},
"1::Treatment Road Map Mastery & the Clinical Pathway Flowchart": {
  "p1": {"on": "This slide explains that mastering the map separates a Case Manager who observes recovery from one who drives it, since deviations are the main cause of insurance denials and IME triggers. The flowchart runs through four phases (Acute, Sub-Acute, Restorative, MMI / Discharge) with a variance loop when the patient isn't improving."},
  "p2": {"on": "This slide gives a glossary (MMI, MOI, PT, Chiro, FCE). The pitfall is letting the client drift off the map without documenting why."}
},
"1::Variance Analysis: Why the Map Fails": {
  "p1": {"on": "This slide explains that when a client drifts off the map, the Case Manager must diagnose why before the insurer stops funding. Three boxes name the types: Clinical Variance (secondary complications), Psychosocial Variance (yellow flags like fear-avoidance, depression or no transport) and Systemic Variance (authorization delays)."},
  "p2": {"on": "This slide says to identify the variance type first, because the fix depends on it. The pitfall is treating a systemic delay as client non-compliance."}
},
"1::Treatment Red Flags: PT & Conservative Care, Surgical Protocols": {
  "p1": {"on": "This slide covers red flags in two areas. In PT and conservative care they signal a stagnating or over-treated case: 12+ sessions with no ROM or pain improvement, passive-only care, and two or more missed appointments. In surgical protocols they concern safety and the standard of care: surgery before conservative care, left/right switched in records, 'just wait' advice for fever or redness, and sharp mechanical pain after surgery."},
  "p2": {"on": "This slide says to flag passive-only care early and ask about an active program, and to proofread laterality (left/right) in every record summary. The pitfall is ignoring post-operative symptoms because the next visit is soon."}
},
"1::Treatment Red Flags: Pain Management, Medication & Behavioral Health / TBI": {
  "p1": {"on": "This slide covers red flags in pain management and medication (the most scrutinized area because of opioid rules and medical-necessity audits) and in behavioral health and TBI, which are high-value cases needing discretion. Its five flags are the opioid, muscle relaxant and sedative combination, a drug screen showing non-use or illicit use, rising doses with no diagnosis change, TBI symptoms first appearing months later, and behavioral-health notes about general stress rather than the accident."},
  "p2": {"on": "This slide says to escalate medication red flags to the attorney and document the conversation with the provider, and to keep behavioral-health notes tied to accident-related trauma. The pitfall is treating late-onset TBI symptoms as proof without validation."}
},
"1::Communication Loops: The “Stakeholder Triad”": {
  "p1": {"on": "This slide explains that the Case Manager is the central router for information and that a break in any loop can stall a case for months. Three boxes set out the Stakeholder Triad: the Clinical Loop (PT notes aligned with the orthopedist's orders), the Legal Loop (status reports that translate jargon into functional evidence) and the Financial Loop (proactive updates to the adjuster before the 6-week physician referral expires)."},
  "p2": {"on": "This slide says to reconcile conflicting provider statements immediately. The pitfall is sending the attorney raw medical records with no functional summary."}
},
"1::The “Golden Standard”: Reasonable and Necessary": {
  "p1": {"on": "This slide explains that under US utilization review, every item in the monitoring framework must be both Reasonable (common for the mechanism of injury) and Necessary (objective evidence that it improves function), shown side by side. It adds the red flag rule: no change in the Oswestry score after 12 weeks of PT means a plateau, and it's time for a specialist or second opinion."},
  "p2": {"on": "This slide says to document objective measures such as ODI and range of motion, not just pain reports. The pitfall is continuing ineffective treatment because it's already scheduled."}
},
"1::Immediate Action Protocol: A-C-T for Red Flags": {
  "p1": {"on": "This slide gives the A-C-T protocol for red flags as a three-step flow: Assess whether it's a medical danger or a legal danger, Clarify with a call to the provider's medical assistant, and Track by documenting the flag and your attempt to fix it."},
  "p2": {"on": "This slide says medical dangers go to the provider immediately and legal dangers go to the attorney. The pitfall is fixing a problem without documenting it."}
},
"1::Illustration & Course Correction: The 6-Week Rule and Objective Metrics": {
  "p1": {"on": "This slide explains the 6-week rule (adjusters look for a functional gap at week 6, expecting 20–30% ROM improvement or lower VAS pain scores) and says to pivot when a client is still at 10/10 pain after 12 PT sessions. A table lists the objective metrics to use: Oswestry / DASH, Gait Analysis, PHQ-9 / GAD-7 and FCE, with their purpose and when to use each."},
  "p2": {"on": "This slide says to include objective metric results in every status update to the insurer. The pitfall is waiting for a denial before course-correcting."}
},
"1::The “Yellow Flag” Warning System": {
  "p1": {"on": "This slide covers yellow flags, the psychosocial barriers that knock a client off the map: catastrophizing, litigation stress and iatrogenic factors such as opioid dependence or too much passive care. It reminds Case Managers to use the map to justify the plan when they communicate with the attorney and insurer."},
  "p2": {"on": "This slide gives model language for a status update that names the phase, the variance and the recommendation, and ties it to Reasonable and Necessary. The pitfall is reporting yellow flags without a recommended plan."}
},
"1::Handling Treatment Gaps During the Treatment Phase": {
  "p1": {"on": "This slide explains why early intervention matters (gaps weaken credibility, delay recovery, create inconsistencies and cut settlement value) and lists the common causes: missed appointments, transportation, co-pays, work conflicts, stopping after temporary relief, and referral or authorization delays. The six steps cover monitoring, fast follow-up, education, coordination, provider contact and documentation."},
  "p2": {"on": "This slide lists practices that keep treatment on track: updated treatment timelines, tracking referrals and pending appointments, encouraging clients to report worsening symptoms, and escalating long or unexplained gaps. Consistent documentation strengthens both medical support and negotiation leverage."}
},
"1::Common Bottlenecks: Escalation Protocol & the Escalation Ladder": {
  "p1": {"on": "This slide gives the 3-step escalation for treatment bottlenecks: Level 1 Clinical (the provider's office manager), Level 2 Administrative (a Notice of Delay to the adjuster and plaintiff attorney) and Level 3 Legal (the attorney files a Motion to Compel or uses an LOP). It adds the escalation ladder: a peer-to-peer review, a status update to the adjuster on rising claim cost, then a 30-Day Demand or a switch to an LOP."},
  "p2": {"on": "This slide says to climb one rung at a time and document each attempt. The pitfall is jumping straight to the attorney before the clinical and administrative steps."}
},
"1::Skill Building: The “Eggshell Plaintiff” vs. the 2018 Lumbar Strain": {
  "p1": {"on": "This slide sets up the Skill Builder: Aggressive Casualty has seen John's 2018 lumbar strain record and is stalling the MRI for the L4-L5 protrusion, calling it pre-existing and degenerative. The objective is to prove aggravation under the eggshell plaintiff rule, which entitles a more vulnerable plaintiff to full recovery for the increase in disability."},
  "p2": {"on": "This slide says to highlight how the accident aggravated the prior injury and never hide the prior record. The pitfall is arguing the prior injury doesn't matter instead of proving the change."}
},
"1::Skill Building: Handling Client Treatment — “The Transportation Wall”": {
  "p1": {"on": "This slide sets up the Transportation Wall scenario: John is four weeks into a 12-week intensive chiropractic program when his car's transmission dies and he says he might as well quit and try again next year. Trainees run a flash-simulation choosing Option A (Problem Solver), B (Empowerer) or C (Clinical Pivot) and update the CMS case file with their plan."},
  "p2": {"on": "This slide says a treatment gap now becomes a demand-phase problem later, so act today. The pitfall is accepting 'I'll quit and try again next year' without a plan."}
},
// ---------- Day 2 ----------
"2::Training Agenda: From Pre-Demand to Settlement": {
  "p1": {"on": "This slide sets out today's three phases as three boxes: Pre-Demand (where 80% of settlement value is won or lost), BI Demand (documentation turned into a narrative with teeth) and BI Settlement (closing, lien mitigation and ethical escrow management). The core principles explain why each one matters."},
  "p2": {"on": "This slide says signing the release is only half the battle, because the Case Manager's duty at closing is aggressive lien mitigation. The pitfall is treating the gross settlement as the finish line."}
},
"2::Pre-Demand Case Auditing: Core Objectives": {
  "p1": {"on": "This slide defines the pre-demand case audit (also called a forensic case audit or pre-litigation audit) as rigorously vetting the claim's evidence and value before the demand letter goes out. Four boxes set out its objectives: Verification, Valuation, Risk Assessment and Compliance."},
  "p2": {"on": "This slide says to stress-test the case before the defense does, because discrepancies destroy credibility. The pitfall is sending the demand and hoping nobody checks the math."}
},
"2::The Auditing Checklist: The Trinity of Case Alignment": {
  "p1": {"on": "This slide explains that the audit should leave the defense zero easy outs, and that three pillars must be perfectly synchronized: The Narrative (the client's story), The Physicality (property damage and the force of impact) and The Medicals (the clinical proof). If one is out of alignment, case value collapses."},
  "p2": {"on": "This slide gives the example of photos showing a minor scratch while the medicals claim a severe spinal impact, which the defense will pick apart in seconds. The pitfall is auditing each pillar separately without cross-checking them."}
},
"2::Master Audit Checklist: Financial & Lien Verification": {
  "p1": {"on": "This slide covers the math of the audit, where mistakes lead to short-funded settlements that leave the client with $0. It lists special damages, lost-wage proof (an employer letter and a doctor's disability slip), statutory liens (Medicare, Medicaid, ERISA, VA), consensual liens (LOPs) and subrogation interests."},
  "p2": {"on": "This slide says to lock in total damages first, then protect them by identifying liens before the demand. The pitfall is discovering a statutory lien after the settlement is signed."}
},
"2::Master Audit Checklist: Liability & Liability Proof": {
  "p1": {"on": "This slide says to lock down liability before the demand and lists three checks: verify the final police or incident report for citations or contributory-negligence notes, confirm witness contact details and check for statement drift, and audit the scene with Google Earth or dashcam footage to make sure the physics of the claim hold up."},
  "p2": {"on": "This slide sums it up: official report plus solid witness testimony plus physical reality equals a case the adjuster can't break. The pitfall is relying on the preliminary exchange-of-information form."}
},
"2::Master Audit Checklist: Property Damage (PD) Deep Dive": {
  "p1": {"on": "This slide treats property damage as physical evidence of impact severity and lists three checks: photos with a clear point of impact (including undercarriage or frame), the insurance estimate compared with the final body shop bill and its supplementals, and the valuation report if the vehicle was totaled."},
  "p2": {"on": "This slide says supplementals are often the best proof of hidden structural damage. The pitfall is using only the initial estimate."}
},
"2::Master Audit Checklist: Medical & Billing Audit": {
  "p1": {"on": "This slide covers the medical and billing audit in three parts: a chronology that finds gaps in treatment (a 14-day gap needs a documented reason), a coding audit for unbundling or duplicate CPT codes, and a review of the past 5–10 years of medical history for pre-existing conditions."},
  "p2": {"on": "This slide says every gap in the chronology gets a documented reason. The pitfall is letting the defense be the first to find a prior injury."}
},
"2::The “Defense-Eye” Audit (Red Flag Detection)": {
  "p1": {"on": "This slide lists three value killers to audit for before finalizing the demand: the client's social media (vacation photos during a loss-of-enjoyment claim), MIST designation when property damage is under about $1,000–$2,000, and a venue audit of where suit would be filed and how the jury pool leans."},
  "p2": {"on": "This slide says addressing value killers early keeps the demand realistic and compelling. The pitfall is ignoring the client's public social media."}
},
"2::Pre-Demand: Final Package Readiness": {
  "p1": {"on": "This slide shows how an audited file is organized for the attorney's final review: a one-page Summary Memo of the audit findings, an Exhibit Index with every bill, record and photo labeled, and 'The Ask', a demand range calculated from the policy limits and total specials."},
  "p2": {"on": "This slide's pro tip is to audit the policy limits one last time, since discovering a $25,000 step-down policy mid-negotiation after a $100,000 demand is the worst outcome. The pitfall is an exhibit index that doesn't match the page numbers."}
},
"2::Skill Building: Pre-Demand Audit Challenges (John Doe File)": {
  "p1": {"on": "This slide sets two challenges on the John Doe file. In the first, Aggressive Casualty claims a low-speed impact and exaggerated injuries. In the second, the adjuster wants to deny the claim over John's 14-day gap after the ER, when he was non-responsive due to mental distress. Trainees disprove the low-speed argument from the intake sheet, reframe the gap, and run the full audit in the CMS."},
  "p2": {"on": "This slide says to use objective facts (extrication, total loss, EMS transport), not adjectives. The pitfall is apologizing for the gap instead of explaining it with documentation."}
},
"2::Case Phase: Demand — The Legal & Procedural Foundation": {
  "p1": {"on": "This slide explains that Case Managers must understand the why behind the paperwork, because the BI demand combines legal, medical and negotiation skills. Three boxes set the foundation: the Statute of Limitations, the Liability Framework and the Coverage Analysis."},
  "p2": {"on": "This slide says to know which value drivers the demand leads with. The pitfall is sending paperwork without understanding why each piece is there."}
},
"2::Demand: The Policy Limit Mindset": {
  "p1": {"on": "This slide asks Case Managers to move from a reactive to a proactive, strategic mindset, and introduces the Policy Limit Mindset: presenting the case in a way that makes the adjuster afraid of a jury. Two checks come first: the client has reached MMI or has a clear future care plan, and every gap is identified and explained."},
  "p2": {"on": "This slide says to present, not just compile. The pitfall is demanding before MMI or a future care plan exists."}
},
"2::Treatment Gaps in the Demand Phase": {
  "p1": {"on": "This slide lists the arguments adjusters build from treatment gaps (injuries weren't serious, recovery came earlier, treatment was unnecessary, something else caused it) and says unexplained gaps reduce settlement value. The four steps: find gaps early, document the reason for every interruption, get supporting documents, and put the explanation in the demand timeline."},
  "p2": {"on": "This slide sets out how to address a gap (acknowledge it, give context and facts, connect continued symptoms to ongoing treatment, show consistent complaints before and after) and says a well-explained gap is less damaging than an unexplained one. The pitfall is leaving the gap out of the timeline and hoping it's missed."}
},
"2::The Demand Packet Checklist: The “Big Four”": {
  "p1": {"on": "This slide sets out the Big Four components that must be flawless before the attorney reviews the demand, in a table: Medical Specials (a clean, itemized ledger with verified balances), The Narrative (the client's story, consistent with the records), Liability Proof (report, photos, statements, scene evidence) and Special Damages (lost wages, property damage, out-of-pocket costs)."},
  "p2": {"on": "This slide says precision here prevents setbacks later in the case. The pitfall is sending the attorney a demand with an unverified ledger."}
},
"2::Demand: Quality Control — The “Final Scrub”": {
  "p1": {"on": "This slide describes the Final Scrub before a demand is sent, which catches three adjuster traps: billing overlaps (double billing for one date of service), pre-existing conditions (framed as aggravation, not hidden) and balance verification (calling every provider for the final balance)."},
  "p2": {"on": "This slide says diligence here leads to a strong demand and favorable negotiations. The pitfall is using stale balances from months ago."}
},
"2::Negotiating the “First Call” (For Senior CMs)": {
  "p1": {"on": "This slide explains that senior Case Managers often handle the first negotiation call, which sets the tone. It gives two techniques: the Anchor (never apologize for a high demand; stay firm on the value drivers) and note-taking (record every excuse the adjuster gives, as ammunition for litigation)."},
  "p2": {"on": "This slide says to write the adjuster's exact words into the CMS immediately after the call. The pitfall is softening the demand to seem reasonable."}
},
"2::Demand: Best Practices": {
  "p1": {"on": "This slide's pro tip reframes the demand as a presentation of a debt owed, treating the insurer like a bank that hasn't paid its bill. It gives three practices: the 30-day rule (demand out within 30 days of MMI), leading with the most graphic photo, and a 'why' for every medical bill."},
  "p2": {"on": "This slide says to docket MMI plus 30 days the moment MMI is confirmed. The pitfall is bills in the demand with no medical-necessity explanation."}
},
"2::Skill Building: Demand Phase Challenge — Real-Time Demand Audit": {
  "p1": {"on": "This slide sets up a real-time demand audit on John Doe v. Apex Delivery: the demand specialist has submitted a draft, and trainees must close every loophole so the adjuster has no grounds to dispute it. The steps are to review it against the Big Four and the Final Scrub, list every deficiency, and assign fix-it tasks in the CMS."},
  "p2": {"on": "This slide says a thorough audit strengthens the demand and speeds up a favorable settlement. The pitfall is fixing issues yourself without assigning and tracking them."}
},
"2::Settlement Negotiations: The Pitch & the Negotiation Battle Map": {
  "p1": {"on": "This slide says a template-looking demand letter gets treated like a template, and adjusters protect insurers by undervaluing claims. The battle map has four steps: create a net sheet (liens, costs and fees set the floor), identify three value drivers that would scare a jury, anticipate the adjuster's top two weaknesses, and prepare the rebuttal."},
  "p2": {"on": "This slide says personalization is key, because a generic letter gets undervalued. The pitfall is negotiating without knowing the client's net floor."}
},
"2::The Valuation Baseline: PIP Set-Off (The Credit)": {
  "p1": {"on": "This slide explains that PIP pays regardless of fault, and in most jurisdictions the defendant's carrier gets a set-off for PIP payments, because the law generally prevents double recovery. The formula: gross settlement value minus PIP paid equals the defendant's remaining liability."},
  "p2": {"on": "This slide says to always know the PIP paid amount before calculating the BI ask. The pitfall is counting PIP-paid bills as unpaid in the BI demand."}
},
"2::The Valuation Baseline: PIP as a Severity Signal": {
  "p1": {"on": "This slide explains that BI adjusters use PIP payments to gauge a claim's seriousness. Speed of exhaustion is a severity signal (John exhausted his $10,000 PIP in 48 hours on ER and EMS bills), and total specials, $41,400 in John's case, are the true anchor for pain-and-suffering multipliers."},
  "p2": {"on": "This slide says to lead with speed of exhaustion as evidence of severity. The pitfall is anchoring on the PIP amount instead of total specials."}
},
"2::The Valuation Baseline: The EMC and the Benefit Ceiling": {
  "p1": {"on": "This slide explains that an Emergency Medical Condition (EMC) finding, like Dr. Sarah Spine's on John's file, is a major negotiation lever. Side by side: without an EMC, PIP is capped at $2,500 in many states and more bills fall on the BI settlement; with an EMC, the full $10,000 is available and fewer liens need negotiating."},
  "p2": {"on": "This slide says to request the EMC determination early in treatment. The pitfall is assuming the full PIP limit without an EMC."}
},
"2::The Valuation Baseline: Subrogation vs. Non-Subrogation": {
  "p1": {"on": "This slide calls subrogation status the most critical technical detail in a BI negotiation. Side by side: in non-subrogation (common), the PIP carrier can't ask for its $10,000 back; with subrogation, the PIP carrier places a lien on the BI settlement that the Case Manager must negotiate down."},
  "p2": {"on": "This slide says to confirm subrogation status in writing from the PIP carrier. The pitfall is finding a PIP lien after disbursement."}
},
"2::The Valuation Baseline: Strategic PIP “Exhaustion”": {
  "p1": {"on": "This slide explains why a Case Manager often wants PIP used up quickly on hard costs like the ER and imaging: once PIP is exhausted, later care (chiro, PT) can move to Letters of Protection, LOP providers are usually more willing to reduce bills than hospitals, and spending PIP on non-negotiable hospital bills preserves BI funds for the client."},
  "p2": {"on": "This slide's tip is to always verify the PIP ledger before BI negotiations, because claiming $40k in specials while forgetting PIP paid $10k destroys credibility. The pitfall is using PIP on negotiable treatment while hospital bills stay unpaid."}
},
"2::Negotiations Initiated: The “Battle” — First Call to Low-Ball": {
  "p1": {"on": "This slide shows how negotiations start once the demand is sent, as a four-step flow: the soft-lead first call (confirm receipt and point to the MRI on page 14), setting the tone (the file is litigation ready), the ask (what is your opening evaluation?) and the response to the low-ball (the professional pause)."},
  "p2": {"on": "This slide says to make the adjuster justify their number with data. The pitfall is reacting emotionally to a low offer."}
},
"2::Settlement Negotiations: The Bracketing Technique": {
  "p1": {"on": "This slide explains bracketing as a bridge when the two sides are far apart ($100k against $30k). The three-step flow: propose the logic ('If I can move my attorney into the $80k range, can you get into the $50k range?'), check authority ('Who does?') and close the bracket by negotiating the middle."},
  "p2": {"on": "This slide says to make sure decision-makers with authority are involved. The pitfall is moving your bracket without a reciprocal move."}
},
"2::Common Adjuster “Stall Tactics” and Rebuttals": {
  "p1": {"on": "This slide explains that adjusters stall to wear you down into a lower end-of-month settlement, and gives a table of three stalls and rebuttals: waiting on the manager's authority (set a deadline), needing records from five years ago (demand a good-faith offer on undisputed injuries) and property damage being too low (low-velocity impacts can cause high-torque spinal injuries, and the MRI proves it)."},
  "p2": {"on": "This slide says to stay firm, factual and professional. The pitfall is accepting an open-ended 'I'll get back to you.'"}
},
"2::Close the Deal: The “Final-Final” and the Paper Trail": {
  "p1": {"on": "This slide explains that the last $2,500 is often the hardest to get, and gives three closing moves: 'split the baby' ($47k and $43k meet at $45k, with a release signed within the hour), confirm the terms before hanging up (BI only, liens included, check timing), and send the paper-trail email right away."},
  "p2": {"on": "This slide says never to end the call without confirming scope, liens and check timing. The pitfall is a verbal settlement with no confirming email."}
},
"2::Settlement Negotiations: The “Never” Rule": {
  "p1": {"on": "This slide gives the Never Rule as an anchor for confident negotiation: never apologize for a high demand, never bid against yourself (they must move before you move again), and never accept 'That's all I have' as final on the first day."},
  "p2": {"on": "This slide says patience on day one usually yields better results. The pitfall is making two moves in a row."}
},
"2::Skill Building: The Math Check — Your Slam-Dunk Liability Case": {
  "p1": {"on": "This slide sets up the math check on the John Doe file: liability is a slam dunk (the Apex truck ran a red light), but Aggressive Casualty is using the 2018 back strain and the 14-day gap to push a lowball $45,000 counteroffer. Task 1 is the integrity audit: run the net math and decide whether the offer is acceptable. Task 2 is the rebuttal: push past the $75,000 ceiling toward the $180,000–$220,000 target."},
  "p2": {"on": "This slide says to calculate total fees and liens and the client's net recovery before saying a word to the adjuster. The pitfall is accepting a gross number that nets the client below zero."}
},
"2::BI Settlement — Phase II: The UM/UIM “Safety Check”": {
  "p1": {"on": "This slide explains that when the at-fault driver has low or no insurance, the client's own UM/UIM coverage comes into play, and that signing the at-fault driver's release without a waiver from the client's insurer can destroy the UM/UIM claim. The two steps are the 30-Day Letter to the UM carrier and a written Waiver of Subrogation."},
  "p2": {"on": "This slide says never to sign the BI release before the UM waiver is in hand. The pitfall is settling BI and then discovering the UM claim is barred."}
},
"2::BI Settlement: Key Laws & Doctrines": {
  "p1": {"on": "This slide sets out three key doctrines as three boxes: the Made Whole Doctrine (no subrogation recovery unless the client is fully compensated), the Common Fund Doctrine (lienholders reduce by the attorney-fee percentage, usually 33.3%) and the Statute of Limitations (the case's 'death date')."},
  "p2": {"on": "This slide says to cite the doctrine by name in every lien reduction request. The pitfall is letting settlement talks run past the SOL without a filed complaint."}
},
"2::The Execution: The Release of All Claims (The “Exit” Document)": {
  "p1": {"on": "This slide calls the Release of All Claims the most critical document in the file, the contract that ends the dispute, and covers three clauses: the BI release scope (don't sign away PD or PIP claims still open), non-admission of liability, and the indemnity and hold harmless clause that makes the claimant responsible for all medical liens."},
  "p2": {"on": "This slide says to read the release scope line by line before it goes to the client. The pitfall is a general release that wipes out an open PD claim."}
},
"2::The Execution: Settlement Disclosure Statement (The “Truth” Document)": {
  "p1": {"on": "This slide explains that the settlement disclosure statement, often required by state law or internal compliance, makes sure the claimant understands what is happening. It covers 'full and final' (no coming back for more) and the cooling-off or rescission period in some states (e.g., 2–3 business days) that must pass before checks are cut."},
  "p2": {"on": "This slide says to docket the rescission deadline and not disburse before it passes. The pitfall is cutting checks during the cooling-off period."}
},
"2::The Execution: Lien Payoff Letters (The “Verification” Paperwork)": {
  "p1": {"on": "This slide explains that a Case Manager can't rely on a medical bill alone and needs a formal final demand or payoff letter. It covers the Medicare final demand (for clients 65+ or on SSDI, which can take 60+ days, so the file stays pended) and the Satisfaction of Lien letter once a provider is paid."},
  "p2": {"on": "This slide's rule is: no payoff letter, no payment. The pitfall is paying from a statement instead of a final payoff figure."}
},
"2::The Execution: The Settlement Statement (The “Net” Sheet)": {
  "p1": {"on": "This slide describes the settlement statement as the ledger that breaks down gross to net, which the Case Manager audits for accuracy. It covers cost verification (every case cost backed by a receipt) and the net to client (enough to cover future medical needs discussed during treatment)."},
  "p2": {"on": "This slide says accurate financial detail builds client trust. The pitfall is costs on the statement with no receipt."}
},
"2::The Execution: The Dismissal (The “Court” Filing)": {
  "p1": {"on": "This slide explains that if a lawsuit was already filed, the settlement isn't over until the court is notified. Side by side: dismissal with prejudice (closed, can't be refiled, the language to verify) against dismissal without prejudice (rare in settlements, can be refiled under certain conditions)."},
  "p2": {"on": "This slide says to docket the dismissal filing and confirm the court entry. The pitfall is forgetting to dismiss a pending suit after settlement."}
},
"2::The Execution: W-9 & Comparison of Key Post-Settlement Documents": {
  "p1": {"on": "This slide explains that many carriers won't issue a settlement check without a W-9, and requesting it late delays the check by at least a week. A table matches each post-settlement document to its signer and purpose: Release (claimant), Final Demand (lienholder), W-9 (payee) and Stipulation to Dismiss (attorneys)."},
  "p2": {"on": "This slide says to send the W-9 with the signed release to avoid accounting holds. The pitfall is waiting until the carrier asks for the W-9."}
},
"2::Finalized Settlement: Boots-on-the-Ground Tasks — Administrative Document Control": {
  "p1": {"on": "This slide describes the technical closing stage, moving the file from Settled to Paid & Archived with full compliance. Its tasks are the signature chase (e-signature or in-person signing), notary coordination (current stamp, ID matching the claimant exactly) and W-9 procurement."},
  "p2": {"on": "This slide says to check the name spelling on the release against the claimant's ID. The pitfall is an expired notary stamp that voids the release."}
},
"2::Finalized Settlement: Final Lien Mitigation (The “Reduction”)": {
  "p1": {"on": "This slide explains that final lien mitigation directly increases the client's net. It covers provider negotiation (asking billing departments to accept 50% as payment in full), updating the ledger immediately with every saving, and checking the Medicare final demand in the MSPRP portal against the internal ledger."},
  "p2": {"on": "This slide says transparency about savings builds trust and shows your value. The pitfall is agreeing to a reduction verbally with no written confirmation."}
},
"2::Skill Building: BI Settlement — Caught in an Operational Pincer Movement": {
  "p1": {"on": "This slide sets up a crisis on the John Doe file: liability is clear, but the team anchored to a low target. Just before signing, Dr. Spine reports permanent nerve damage with a 5% Whole Person Impairment rating, the client is furious, and the adjuster demands the signed release in 5 minutes or will revoke the $100,000 policy-limits tender. Trainees must produce a step-by-step action plan, a de-escalation script, a malpractice mitigation plan and the statutory response to the 5-minute threat."},
  "p2": {"on": "This slide says not to let the client sign under a 5-minute ultimatum when there's new permanent-injury evidence, and to document every communication and decision. The pitfall is staying anchored to the old conservative target after the WPI rating arrives."}
},
// ---------- Day 3 ----------
"3::Training Agenda & Why the UM Phase Matters": {
  "p1": {"on": "This slide sets out today's agenda (the UM phase, UM settlement, and lien negotiation and reduction) and makes the key point that the gross settlement doesn't matter to the client; only the net check does. It shows a $50,000 settlement with $45,000 in unreduced liens leaving the client with almost nothing."},
  "p2": {"on": "This slide says to measure success by the client's net, not the gross. The pitfall is celebrating a gross number before liens are reduced."}
},
"3::Beyond Organization: The UM Demand Strategy": {
  "p1": {"on": "This slide explains that the UM demand phase is the client's financial safety net after an accident with an underinsured driver, and that insurers resist full payouts. Side by side, it contrasts the old mindset (gather records and mail them) with the master mindset (build an undeniable legal trap)."},
  "p2": {"on": "This slide's bottom line is that a correctly built trap backs the insurer into a corner where it has to pay policy limits. The pitfall is treating the client's own insurer as friendly."}
},
"3::BI Exhaustion & Consent — Mechanic 1: Locking the Escape Hatches": {
  "p1": {"on": "This slide explains BI exhaustion: when the at-fault insurer pays its full limit but damages are higher, you pivot to the client's own carrier. It says to front-load the proof (the third-party dec sheet, the signed liability release and the UIM carrier's written Consent to Settle) so the adjuster can't claim the client breached the contract."},
  "p2": {"on": "This slide says the Consent to Settle must be in writing and obtained before the BI release is signed. The pitfall is burying the exhaustion proof at the back of the packet."}
},
"3::The UM Demand Package: Turning Risk Management Against the Insurer": {
  "p1": {"on": "This slide explains that the UM demand needs a full audit like the BI demand and is assigned to the Demand Specialist once BI closes. When medical debt far exceeds the limits, the adjuster faces the bad-faith trap: pay a capped limit today or risk uncapped exposure before a jury. It shows the gap: a $100,000 claim minus a $25,000 BI settlement means a $75,000 UM demand."},
  "p2": {"on": "This slide says to assign the UM demand as a tracked CMS task the day BI closes. The pitfall is re-sending the BI demand unchanged."}
},
"3::UM Demand: Investigation & Evaluation — The Weak File vs. The Legal Trap": {
  "p1": {"on": "This slide warns that the client's own insurer now becomes adversarial, with scrutiny of prior history, a possible IME and a liability check. A table contrasts the weak file (300 pages of raw charts, a casual cover letter, a $3,500 lowball) with the legal trap (a 2-page coded summary, a $40,000 surgical recommendation with a strict 30-day clock, a full policy-limits payout)."},
  "p2": {"on": "This slide says summaries with diagnostic codes beat record dumps. The pitfall is a cover letter with no deadline."}
},
"3::UM Demand: The Demand Packet — Document Inclusions": {
  "p1": {"on": "This slide says the UM packet must show the other driver's fault and damages beyond what was collected, in four boxes: Evidence of Liability (report, photos, statements, dashcam), Economic Damages (itemized bills, records, lost wages, future care), Non-Economic Damages (demand letter, impact statement, injury photos) and Proof of Exhaustion (release, check copy, at-fault dec page, consent letter)."},
  "p2": {"on": "This slide says a well-structured packet builds the narrative that damages exceed what was collected. The pitfall is missing the check copy or release, which are the exhaustion proof."}
},
"3::UM Settlement: How the Settlement Is Calculated": {
  "p1": {"on": "This slide explains that negotiating with the client's own insurer turns the case into a first-party contract claim, and that the UM insurer pays the gap between total damages and what was already collected. A table shows the example: total value $100,000 minus BI received $25,000 equals a UM goal of $75,000."},
  "p2": {"on": "This slide says to document every dollar of damages so the gap is undeniable. The pitfall is demanding the UM limit without showing the gap."}
},
"3::UM Settlement: Negotiation & Settlement": {
  "p1": {"on": "This slide reminds trainees that the client's own insurer becomes adversarial, and shows the negotiation as a three-step flow: the offer (rarely the full demand), back-and-forth (negotiating toward the true value of the remaining damages) and resolution (usually a supplemental settlement check)."},
  "p2": {"on": "This slide says patience and documentation win UM negotiations. The pitfall is accepting the first offer because it's the client's own insurer."}
},
"3::UM Settlement: The “Offset” Rule & the Timeline": {
  "p1": {"on": "This slide explains the offset rule: in many states the client's insurer can subtract the BI settlement from the UM limit, so a $50,000 UM policy with $25,000 already recovered may leave only $25,000 of room unless there's add-on or stacked coverage. It also shows the UM timeline (demand, evaluation, negotiation) as usually faster than BI."},
  "p2": {"on": "This slide says to always look for stacking and resident-relative household policies. The pitfall is promising the client the full UM limit in an offset state."}
},
"3::UM Settlement: Challenges": {
  "p1": {"on": "This slide lists three UM challenges: the value dispute (agreeing the client is hurt but valuing the whole case at $40,000, so offering $15,000 after a $25,000 BI recovery), waiting for MMI before settling, and subrogation and liens that must be negotiated down."},
  "p2": {"on": "This slide says to counter value disputes with objective evidence (MRI, WPI rating, future care costs). The pitfall is ignoring liens until the UM check arrives."}
},
"3::UM Settlement: The Final Payout Process": {
  "p1": {"on": "This slide shows the UM payout as a three-step flow: the UM Release (the client releases their own insurer for this accident), the Check (usually payable to the client and the firm) and Disbursement (into the trust account, then liens, fees and the net check to the client)."},
  "p2": {"on": "This slide notes that because UM is a first-party claim, unreasonable insurer conduct (ignoring evidence, refusing to communicate) may support a bad-faith claim, sometimes above policy limits. The pitfall is depositing the check before the release is fully executed."}
},
"3::Skill Building: UM Settlement — The Bad-Faith Arbitrage & the Permanent Deficit": {
  "p1": {"on": "This slide sets up a hypothetical variation of the John Doe file: John was hit by an uninsured motorist and the claim is under a $100,000 UM limit (his real dec page shows $250,000/$500,000). The insurer used the 2018 strain and the 14-day gap to offer $42,000 and demands verbal acceptance now or it will force arbitration. Then Dr. Spine's final report confirms an acute L4-L5 herniation, a 5% WPI rating and permanent nerve damage caused by the crash."},
  "p2": {"on": "This slide says new permanent-injury evidence changes the valuation, so use it. The pitfall is accepting verbally under pressure."}
},
"3::Documents that Matter: Threshold & Coverage Documents": {
  "p1": {"on": "This slide lists the threshold documents for a UM/UIM claim: the client's declarations page (proves UM/UIM coverage and sets the upper limit), proof of uninsured status (a DMV suspension letter, a denial letter from the supposed carrier, or a police report noting a phantom vehicle) and, for UIM claims, the third-party exhaustion ledger (check copy or release)."},
  "p2": {"on": "This slide says to get the dec page before promising anything about UM. The pitfall is a UIM claim with no proof of exhaustion."}
},
"3::Documents that Matter: Liability & Causation Documents": {
  "p1": {"on": "This slide explains that liability and causation still have to be proven in a first-party claim, and lists the official police report, scene and property damage photos (frame bending and airbag deployment defeat the 'too minor' argument) and witness statements or affidavits, which are critical in phantom-vehicle cases."},
  "p2": {"on": "This slide says to pair property damage photos with the injury narrative. The pitfall is relying on the client's account alone in a hit-and-run."}
},
"3::Documents that Matter: Special Damages Documents (Economic Hard Costs)": {
  "p1": {"on": "This slide lists the special damages documents: itemized medical billing statements from every provider, wage loss verification completed by the employer, and up-to-date prior lien ledgers from health insurers or subrogation companies showing what has already been paid."},
  "p2": {"on": "This slide says itemized means line-item, not balance-forward statements. The pitfall is stale lien ledgers."}
},
"3::Documents that Matter: General Damages Documents (Non-Economic Value)": {
  "p1": {"on": "This slide explains that general damages need objective support too: diagnostic reports (MRI, CT, X-ray) proving internal injuries, an expert medical narrative and permanency rating from the treating physician stating future care and causation, and a formal Whole Person Impairment rating as the biggest weapon against pre-existing condition defenses."},
  "p2": {"on": "This slide says to request the WPI rating as soon as the client nears MMI. The pitfall is a narrative that doesn't state causation explicitly."}
},
"3::Documents that Matter: Final Pleading & Release Documents (Closing Phase)": {
  "p1": {"on": "This slide covers the closing documents: the formal UM demand letter (the full legal argument ending in a time-sensitive demand, for example 10 days to tender limits before bad faith is triggered) and the UM Release and Trust Agreement, where the client releases their insurer and agrees to protect its rights if the uninsured motorist is ever sued."},
  "p2": {"on": "This slide says to docket the tender deadline stated in the demand letter. The pitfall is a demand letter with no time limit."}
},
"3::Lien Negotiations/Reduction: Common Types of Liens": {
  "p1": {"on": "This slide explains that liens aren't equal (statutory ones have stronger legal backing than contractual ones) and gives a table of five types with how hard each is to reduce: medical providers on LOPs (high priority, often settle for less), health insurance (moderate), Medicare/Medicaid (low), ERISA plans (very low) and workers' comp (moderate)."},
  "p2": {"on": "This slide says to start with the most negotiable liens to build momentum. The pitfall is treating an ERISA plan like a provider LOP."}
},
"3::Key Legal Doctrines Used for Reduction": {
  "p1": {"on": "This slide sets out three doctrines attorneys use to make lienholders take less, as three boxes: the Common Fund Doctrine (lienholders share the attorney fee), the Made Whole Doctrine (no lien recovery unless the plaintiff is fully compensated, in many jurisdictions) and Comparative Fault (if the plaintiff was 20% at fault, reduce the lien by 20%)."},
  "p2": {"on": "This slide says to name the doctrine and show the math in every reduction request. The pitfall is asking for a courtesy discount with no legal basis."}
},
"3::Quantum Meruit Principle — Prior Attorney Liens": {
  "p1": {"on": "This slide explains quantum meruit ('as much as he has deserved'): when a lawyer is dismissed before settlement, they can't claim the contingency fee but can file a lien for the reasonable value of the work done. Side by side: the client's absolute right to fire their lawyer, and the lawyer's right to be paid for the benefit they provided."},
  "p2": {"on": "This slide says to challenge clerical hours billed as legal work. The pitfall is paying a prior attorney a percentage fee they're no longer entitled to."}
},
"3::Increasing the Client's Net": {
  "p1": {"on": "This slide says a Case Manager's job is 50% getting money from the insurer and 50% keeping it from the providers. It gives three tools: the pro-rata argument to providers, the made whole doctrine against subrogated health insurers where it applies, and a final payoff letter stating that acceptance is full and final satisfaction of all liens."},
  "p2": {"on": "This slide says to get every reduction in writing before disbursement. The pitfall is sending payment without the full-and-final language."}
},
"3::Auditing the Billing Before Asking for a Discount": {
  "p1": {"on": "This slide says to check a bill is accurate before asking for a discount, because many providers upcode or unbundle. It lists three checks: cross-reference records against billing (a Level 3 visit billed as Level 5 needs a correction, not a favor), look for duplicate charges, and use the common fund doctrine's one-third rule."},
  "p2": {"on": "This slide's rule is corrections first, reductions second. The pitfall is negotiating a percentage off an inflated bill."}
},
"3::The Net Sheet: Purpose of a Combined BI/UM Net Sheet": {
  "p1": {"on": "This slide calls the net sheet the ultimate tool for transparency, case control and maximizing recovery, and gives three purposes for a combined BI/UM sheet: avoiding double-dipping by showing where every dollar came from, keeping possibly different BI and UM fee structures separate, and showing both recovery streams side by side so the client sees the aggregate net."},
  "p2": {"on": "This slide says one net sheet with two clearly separated streams. The pitfall is mixing BI and UM funds on one undifferentiated line."}
},
"3::The Net Sheet: Stream 1 (BI) and Stream 2 (UM/UIM)": {
  "p1": {"on": "This slide shows the two recovery streams side by side. Stream 1 is third-party BI from the at-fault driver's insurer, usually exhausted first as a legal prerequisite. Stream 2 is first-party UM/UIM from the client's own or a resident relative's policy, triggered only when BI is exhausted or the driver is uninsured."},
  "p2": {"on": "This slide says to check resident-relative household policies for extra UM. The pitfall is opening UM before BI is exhausted."}
},
"3::The Net Sheet: The LSH Corporate Net Sheet Ledger": {
  "p1": {"on": "This slide shows the firm's BI/UM Master Financial Ledger in four sections: the settlement recovery summary, attorney fees and advanced case expenses (33.33% fees plus itemized costs), the medical provider ledger with lien reductions (charges, PIP, health and MedPay payments, adjustments, balance owed, maximum offer), and the net to client."},
  "p2": {"on": "This slide gives the formula balance owed = total charges − PIP − health − MedPay − adjustments. The pitfall is a provider line with no PIP or health payments recorded."}
},
"3::The Net Sheet: Case Manager Protocols for Dual Settlements": {
  "p1": {"on": "This slide sets out a strict four-step protocol for dual BI and UM settlements: secure the BI tender first in writing, run the UIM consent protocol before signing the BI release, consolidate the medical reductions against the combined $50,000 global value, and run the aggregate math on both sides of the net sheet so it matches the software ledger."},
  "p2": {"on": "This slide says global negotiation gets bigger reductions than piecemeal. The pitfall is signing the BI release before the UIM consent."}
},
"3::Key Takeaway — The Value of a Case Manager": {
  "p1": {"on": "This slide gives the core rule that a Case Manager's job isn't data entry but financial engineering: combining a third-party BI recovery with a first-party UM household policy doubles the client's recovery pool. Firm costs must be deducted accurately, either as a single line or split proportionally across both accounts."},
  "p2": {"on": "This slide says clean tracking protects the firm, keeps medical lines clear and gets the client every dollar they legally deserve. The pitfall is charging costs twice across BI and UM."}
},
"3::Skill Building: The “Doe v. Apex” Final Net Challenge": {
  "p1": {"on": "This slide sets up the final net challenge: a hypothetical $50,000 gross settlement on the Apex van, with no UM. Trainees have 15 minutes to find an extra $3,000 for the client, draft a zero-recovery letter to BlueCross, and build a net sheet. A table shows three buckets: the prior attorney lien ($1,200), BlueCross subrogation ($6,200) and Metro General Hospital ($18,500), each with a target reduction."},
  "p2": {"on": "This slide says every reduction needs a named doctrine or audit finding. The pitfall is reducing without a written payoff confirmation."}
},
"3::Case Phase: Disbursement — Core Objectives": {
  "p1": {"on": "This slide explains that disbursement is where accuracy, compliance and fraud prevention matter most, because money is leaving the account, and shows the three objectives as boxes: Accuracy, Compliance and Fraud Prevention."},
  "p2": {"on": "This slide recommends a two-person review on every disbursement. The pitfall is paying from an unverified wiring instruction."}
},
"3::Disbursement: The Workflow": {
  "p1": {"on": "This slide shows the disbursement workflow as a four-step flow: Verification (review Ready for Payment files and confirm conditions precedent), Documentation (legible invoices and receipts matching the claim), Authorization (sign-off and the packet to finance) and Reconciliation (confirm receipt and update the file to Paid)."},
  "p2": {"on": "This slide says not to mark a file Paid until receipt is confirmed. The pitfall is submitting an incomplete packet to finance."}
},
"3::Disbursement: Documentation Checklist": {
  "p1": {"on": "This slide lists the documentation every payment request needs: proof of the payee's identity, a payment request form signed by the beneficiary or representative, verified invoices with dates, descriptions and tax IDs, accurate banking information, and W-9 or tax forms for vendor payments."},
  "p2": {"on": "This slide says to update the case file to Paid after these steps. The pitfall is invoices with no tax ID."}
},
"3::Disbursement: Common Challenges & Mitigation": {
  "p1": {"on": "This slide gives a table of three common disbursement challenges and how to handle them: incomplete paperwork (a Kickback Protocol telling the client exactly what's missing, with a deadline), a change of circumstance (updated documents signed by the beneficiary) and duplicate payments (cross-check invoice numbers before approving)."},
  "p2": {"on": "This slide says to give specific deadlines in every kickback. The pitfall is approving a payment without checking for a prior identical invoice."}
},
"3::Final Case Reconciliation Checklist: Net Sheet (The “Money Trail”)": {
  "p1": {"on": "This slide explains that before a case is archived, the Case Manager verifies four document sets. Set 1 is the net sheet: an itemized list of every check, ACH or wire, the bank transaction IDs, and a zero-balance confirmation (approved budget minus total disbursed equals zero)."},
  "p2": {"on": "This slide's rule is no archive without a zero balance. The pitfall is a net sheet with no transaction IDs."}
},
"3::Final Case Reconciliation Checklist: Proof of Delivery/Completion": {
  "p1": {"on": "This slide covers Set 2, evidence the funds were used as intended: the client's signed acknowledgment of receipt, a certificate of completion or final inspection if the disbursement was for construction or repairs, and provider lien waivers confirming payment in full."},
  "p2": {"on": "This slide says to collect lien waivers at the same time as payment. The pitfall is archiving without the client's acknowledgment of receipt."}
},
"3::Final Case Reconciliation Checklist: Compliance & Identity Verification": {
  "p1": {"on": "This slide covers Set 3: an updated W-9 or tax documents for any 1099 reporting, and a duplication-of-benefits statement signed by the beneficiary confirming they didn't receive double funding from another source after the case started."},
  "p2": {"on": "This slide says to verify the W-9 is current, not the one from intake. The pitfall is skipping the duplication-of-benefits statement."}
},
"3::Final Case Reconciliation Checklist: The Internal “Closing Memo”": {
  "p1": {"on": "This slide covers Set 4, which is often overlooked: a one-page internal closing memo with a case summary (how it started versus how it ended), discrepancy notes explaining any difference between the final payout and the initial estimate, and exception reports for any policy waivers granted."},
  "p2": {"on": "This slide says to write the memo so someone new can understand the file in two minutes. The pitfall is no explanation for a payout that differs from the estimate."}
},
"3::Final Case Reconciliation: Retention & Disposition Schedule": {
  "p1": {"on": "This slide explains that closing paperwork is organized under a retention policy, with a table of periods: financial records 7 years (standard), eligibility documents 3–5 years, and correspondence 3 years."},
  "p2": {"on": "This slide says to follow firm policy and any stricter state rule. The pitfall is destroying financial records early."}
},
"3::Skill Building: Closing a Case — John Doe v. Apex Delivery Final Tasks": {
  "p1": {"on": "This slide sets up the closing exercise on the John Doe file: the case settled for $150,000 and is in final disbursement. Trainees reconcile the gross against all liens and costs, make the file audit ready and create a closing letter. The plot twist: after the closing letter goes out, a new $1,200 bill from a radiology imaging center arrives that isn't in the ledger, and John is frustrated."},
  "p2": {"on": "This slide says to verify the bill's legitimacy and link to the accident before anything else, and to remember the indemnity and hold-harmless clause in the release. The pitfall is telling the client it's not our problem."}
},
// ---------- Day 4 ----------
"4::Welcome to Day 4: When Pre-Suit Negotiations Stall": {
  "p1": {"on": "This slide recaps Days 1–3 and introduces today: what happens when pre-suit negotiations stall and the case moves into formal dispute resolution. It compares mediation (voluntary, non-binding, parties keep control) with arbitration (formal, trial-like, a binding award with very limited appeal) and sets the agenda: mediation, arbitration and their bottlenecks."},
  "p2": {"on": "This slide warns that in mediation and arbitration, a missed deadline or a critical exhibit printed in low-quality grayscale can get evidence excluded or lose leverage entirely, so today is about moving from passive tracking to proactive, airtight auditing. The pitfall is treating mediation and arbitration as the same thing."}
},
"4::Introducing the Neutral: Mediator vs. Arbitrator — Expertise & Background": {
  "p1": {"on": "This slide explains why it matters who the neutrals are, and compares their profiles: mediators are experienced PI trial attorneys or retired judges who specialize in negotiation, lien resolution and valuation; arbitrators are retired judges or senior trial attorneys who specialize in evidence, tort law, liability and medical causation."},
  "p2": {"on": "This slide says to tailor the binder to the neutral: valuation for mediators, evidence for arbitrators. The pitfall is preparing an arbitration binder like a negotiation packet."}
},
"4::Introducing the Neutral: Assignment & Selection Workflows": {
  "p1": {"on": "This slide compares how neutrals are chosen. Mediators are picked by mutual agreement or appointed from a court roster. Arbitrators, especially in UM claims, are often required by the policy contract and chosen from an AAA or JAMS panel through strike lists."},
  "p2": {"on": "This slide says to docket the strike-list deadline the day the panel arrives. The pitfall is missing the strike deadline and accepting a default appointment."}
},
"4::Introducing the Neutral: Extent of Decision-Making Power": {
  "p1": {"on": "This slide calls decision-making power the most critical operational distinction. Side by side: the mediator has zero power (a facilitator who can't force a settlement or rule, with parties keeping full control), while the arbitrator has absolute power (a private judge who issues a binding award, can exclude evidence, and whose award is virtually unappealable)."},
  "p2": {"on": "This slide says arbitration binder preparation must be flawless because the arbitrator's word is final and enforced by the court. The pitfall is assuming an arbitration math error can be appealed."}
},
"4::Mediation Protocols for CMs: Logistics & Scheduling": {
  "p1": {"on": "This slide says the Case Manager's main job in mediation is total logistics control. Side by side: unified availability (collect 3–4 workable windows from everyone before contacting the mediator) and environmental control (a secure room with a separate client waiting area, or a stable Zoom with private breakout rooms). The steps add interpreter checks, a 2-hour attorney buffer and launching Zoom 15 minutes early."},
  "p2": {"on": "This slide gives two scenarios: if opposing counsel suggests a quick Zoom mediation next Tuesday, check interpreter needs, the attorney's buffer and client prep before accepting; if they reject all windows, log it in the CMS and escalate for an attorney-to-attorney call. The pitfall is scheduling before collecting everyone's availability."}
},
"4::Preparing Mediation Binders: Organized Case Summaries": {
  "p1": {"on": "This slide defines the mediation binder (or packet) as an organized compilation of the case's most critical documents, the attorney's and mediator's reference guide and the roadmap for settlement. The steps are to compile key medical records, verified special damages sheets and liability exhibits, then index and bookmark them so evidence can be found in seconds."},
  "p2": {"on": "This slide says the attorney must find any record, clause or quote within five seconds, with an example: when defense claims only three chiropractor visits, the attorney flips to Tab 5 and shows 24 verified PT sessions. The pitfall is handing the attorney an unorganized file right before the session."}
},
"4::Mediation Binder Section 1: Executive Summary & Administrative Details": {
  "p1": {"on": "This slide explains that a gold-standard mediation binder has six sections, and Section 1 is the first thing the attorney sees: the CM snapshot or summary sheet (parties, file numbers, opposing counsel contacts), the mediation order or agreement (rules and fee split) and the schedule (date, time, location or Zoom link, mediator's name)."},
  "p2": {"on": "This slide says the fee split is in the formal mediation order or stipulation, typically 50/50 of the mediator's hourly rate. The pitfall is a snapshot sheet with outdated opposing counsel contacts."}
},
"4::Mediation Binder Section 2: The Mediation Briefs": {
  "p1": {"on": "This slide covers Section 2, the briefs: our confidential mediation brief (prepared by Case Managers, approved by the attorney, with our strongest arguments, evidence and settlement positions) and opposing counsel's brief, placed side by side so the attorney can prepare rebuttals."},
  "p2": {"on": "This slide says to deliver our brief to the mediator well before the session. The pitfall is sending the brief 10 minutes before the session starts."}
},
"4::Mediation Binder Section 3: Core Pleadings (The Legal Framework)": {
  "p1": {"on": "This slide covers Section 3, the core pleadings that define what the lawsuit is about: the active (operative) complaint with our client's allegations, and the defense's Answer and Affirmative Defenses."},
  "p2": {"on": "This slide gives an example: if the defense argues at mediation that the client wasn't wearing a seatbelt, check Section 3, and if that defense wasn't pleaded in the Answer, the attorney can object. The pitfall is including a superseded complaint."}
},
"4::Mediation Binder Section 4: Key Evidence & Liability Exhibits": {
  "p1": {"on": "This slide covers Section 4, the raw evidence: contracts or key correspondence, police or incident reports, photographs and video stills, and deposition summaries with the exact highlighted transcript pages."},
  "p2": {"on": "This slide says to highlight the exact transcript lines the attorney will quote. The pitfall is summaries without the supporting transcript pages."}
},
"4::Mediation Binder Section 5: Damages, Financials & Expert Reports": {
  "p1": {"on": "This slide covers Section 5, which justifies the dollar amount: the medical records summary and key bills (chronological notes and a ledger of all expenses), proof of financial loss (tax returns, pay stubs, P&L statements) and expert witness reports (reconstructionists, medical experts, economists)."},
  "p2": {"on": "This slide says the ledger total must match the facility invoices dollar for dollar. The pitfall is an unverified ledger, which the defense will call unsubstantiated."}
},
"4::Mediation Binder Section 6: Settlement History & Draft Agreements": {
  "p1": {"on": "This slide covers Section 6, which prepares the attorney to close: the negotiation log (every demand and counter-offer in order, so nobody is confused about the current number) and a draft settlement agreement or release template for signing before anyone leaves the room."},
  "p2": {"on": "This slide's pro tips are to prepare three binders for in-person mediation (attorney, mediator, client) and to OCR the PDF binder for virtual mediation so it's keyword searchable. The pitfall is having no draft release on hand when a deal is reached."}
},
"4::Mediation: Quality Assurance & Logistics Auditor": {
  "p1": {"on": "This slide describes the Case Manager as the quality assurance and logistics auditor who makes sure the attorney is armed and organized before mediation, with three boxes: binder multi-sets (three identical copies or one unified digital set), searchability optimization (deep OCR) and systematic indexing (six numbered tabs aligned with the firm's master index)."},
  "p2": {"on": "This slide says to QA the binder against the index the day before. The pitfall is a scanned PDF that isn't text-searchable."}
},
"4::Skill Building: Create Your Mediation Binders": {
  "p1": {"on": "This slide sets the task: prepare a complete mediation binder for the case and submit it to the attorney for approval, using the existing demand as the source and the sample mediation brief as a guide. The steps build Sections 1 to 6 and upload the binder to the case in the CMS."},
  "p2": {"on": "This slide says every document should sit in exactly one section, indexed. The pitfall is missing the negotiation log."}
},
"4::Skill Building: The LSH Critical Thinking Challenge — The Pre-Mediation Audit": {
  "p1": {"on": "This slide sets a crisis 48 hours before the mediation completion deadline (June 18, 2026): the attorney is in court, the file has conflicting entries and missing documents, and defense counsel Jane Vance is pushing back. Problem 1: the defense says the medical ledger is unverified. Problem 2: Metro General asserts a $45,000 lien while BlueCross files a $20,000 ERISA subrogation lien. Trainees write an audit memo with a fix for each."},
  "p2": {"on": "This slide gives the solutions: for Problem 1, audit the raw file, pull certified billing ledgers from every facility and put proof of every dollar in Section 5; for Problem 2, cross-reference payments, because if BlueCross already paid Metro General at a reduced contract rate, Metro General can't double-recover and its lien must be stripped. The pitfall is accepting both liens at face value."}
},
"4::Case Phase: Arbitration — The Anatomy of a PI Arbitration": {
  "p1": {"on": "This slide explains that MVA and commercial trucking cases that don't settle at mediation are often routed to arbitration, and that the coverage structure (combined single limit versus split limits) caps what an award can realistically collect. At a hearing, the Case Manager observes and documents, logs directives from the bench, and updates the CMS with new deadlines and a summary memo."},
  "p2": {"on": "This slide says your hearing notes become the attorney's post-hearing roadmap. The pitfall is logging bench directives the next day from memory."}
},
"4::Arbitration: Operational Mindset — From Compromise to Trial-Ready": {
  "p1": {"on": "This slide describes the shift from mediation's compromise focus to arbitration's trial-ready standard: arbitration is an adversarial, formal hearing where the arbitrator issues a final, binding award with drastically limited appeal rights. The steps are to treat it like a multi-day trial, audit every exhibit, and lock every deadline on the master calendar."},
  "p2": {"on": "This slide says trial-ready means nothing is left to fix on the day. The pitfall is bringing a mediation-quality binder to an arbitration."}
},
"4::Arbitration Operational Track 1: Critical Timelines & Calendar Hard Rules": {
  "p1": {"on": "This slide explains that arbitration responsibilities are heavily operational and that three dates must be hard-coded on the firm's master calendar as soon as a case is routed: the hearing date, the arbitration brief deadline (claims, arguments, exhibit index and witness list) and the arbitrator selection cutoff for AAA or JAMS strikes."},
  "p2": {"on": "This slide says to add warning alerts ahead of each hard date. The pitfall is a brief deadline that lives only in an email."}
},
"4::Arbitration Operational Track 2: Logistics & Setup Protocols": {
  "p1": {"on": "This slide makes the Case Manager the main logistics coordinator for arbitration: coordinating 3–4 mutually agreeable time blocks with opposing staff before contacting the arbitrator, retaining the neutral (vetting, confirming the fee schedule, routing the retainer to accounting) and managing logistics (calendar invites, rooms or secure Zoom with breakout rooms)."},
  "p2": {"on": "This slide says to confirm retainer payment in writing, because unpaid retainers delay hearings. The pitfall is contacting the arbitrator before availability is aligned."}
},
"4::Ethics & Boundaries: What You Can and Cannot Do at Hearings (UPL)": {
  "p1": {"on": "This slide gives the golden rule: Case Managers must never present legal arguments, speak on the record or represent clients before an arbitrator, because that is the Unauthorized Practice of Law (UPL). Side by side, it lists what you cannot do and what you can (observe and document, log directives, update the CMS), plus how to respond if the arbitrator asks you a question."},
  "p2": {"on": "This slide says violating UPL rules puts both you and the firm at risk. The pitfall is 'helpfully' answering the arbitrator directly."}
},
"4::Arbitration Binders: Section 1 — The Arbitration Submissions": {
  "p1": {"on": "This slide explains that the arbitration binder is a formal, trial-ready evidentiary record for a private judge, where a missing page or a grayscale exhibit can be permanently excluded. Section 1 holds the CM snapshot sheet, the final arbitration brief, the governing arbitration order or agreement with its scheduling order, and the arbitrator fee disclosures."},
  "p2": {"on": "This slide's QC rule is to confirm arbitrator retainer deposits are paid in full. The pitfall is a draft brief in the binder instead of the final."}
},
"4::Arbitration Binders: Section 2 — Core Litigation Pleadings": {
  "p1": {"on": "This slide covers Section 2, the legal framework for the arbitrator: the operative amended complaint (old complaints removed) and the Answer and Affirmative Defenses showing how the defense will try to avoid liability or argue comparative fault."},
  "p2": {"on": "This slide's QC rule is to remove outdated, superseded complaints. The pitfall is two complaints in the binder."}
},
"4::Arbitration Binders: Section 3 — Liabilities & Biomechanical Evidence": {
  "p1": {"on": "This slide covers Section 3, the raw evidence that the adverse driver was 100% at fault: unredacted police and incident reports (narratives, diagrams, citations) and high-resolution color photos of the vehicle damage and scene."},
  "p2": {"on": "This slide's QC rule is to reject grayscale or black-and-white prints, because they don't show the intensity of the impact, and to use high-resolution color. The pitfall is a redacted police report when the unredacted version is available."}
},
"4::Arbitration Binders: Section 4 — Proving Bodily Accident Medical Damages": {
  "p1": {"on": "This slide covers Section 4, which justifies compensation for physical injuries: the consolidated medical ledger, comprehensive provider treatment logs, diagnostic imaging reports such as MRIs and X-rays, and EMC declarations establishing medical necessity."},
  "p2": {"on": "This slide's QC rule is to verify the billing ledger matches facility invoices dollar for dollar. The pitfall is a ledger total nobody can trace to an invoice."}
},
"4::Arbitration Binders: Section 5 — The Prior Medical Shield": {
  "p1": {"on": "This slide explains that defense attorneys use prior records to argue pre-existing degenerative conditions, and makes Section 5 the defense shield: prior injury records and work history (for example, John Doe's 2018 strain, which resolved in 4 weeks without pre-existing defects) and retained expert reports countering the defense's medical claims."},
  "p2": {"on": "This slide's QC rule is to pair the prior record with an expert opinion proving the past injury fully resolved before the crash. The pitfall is leaving the prior record out and letting the defense introduce it."}
},
"4::Arbitration Binders: Section 6 — Economic Losses & Lien Reconciliations": {
  "p1": {"on": "This slide covers Section 6, the financial closing ledger that affects the client's final payout: forensic lost wage verifications (W-2s, tax returns, employment verification), the chronological negotiation ledger of demands and counter-offers, and audited lien payout sheets."},
  "p2": {"on": "This slide says to cross-reference provider liens so a health insurer hasn't already paid the hospital at a reduced rate, which cuts off the hospital's right to double-recover face value. The pitfall is listing both a hospital lien and the insurer's payment of the same bill."}
},
"4::Skill Building: The PI Critical Thinking Audit Challenge (Arbitration)": {
  "p1": {"on": "This slide sets up the audit challenge on John Doe v. Apex Delivery Services & Robert W. Smith: the case didn't settle at mediation, the arbitration brief is due in 48 hours, and defense counsel Jane Vance argues John's back complaints come from his 2018 work injury, citing the lack of a pre-accident MRI. Trainees must find the specific intake facts that defeat this."},
  "p2": {"on": "This slide gives the answer: pull the 2018 discharge notes proving the strain fully resolved in 4 weeks with no treatment for 8 years, and pair them with the post-crash MRI showing an acute traumatic herniation caused by the impact. The pitfall is arguing without the documents that prove resolution."}
},
"4::Skill Building: The Arbitration Audit & Binder Build": {
  "p1": {"on": "This slide sets an emergency scenario on the John Doe file: the previous Case Manager missed logging the schedule and the hearing is in 48 hours. Trainees sort 12 mixed documents into a 6-tab binder, apply each tab's QC rule, and resolve two landmines (the pre-existing degenerative trap, and the double-dipping lien where a BlueCross EOB shows $15,000 satisfied the $45,000 hospital bill), then upload the binder in the CMS."},
  "p2": {"on": "This slide's answer is to strip Metro General's $45,000 direct lien from the active ledger and log BlueCross's $20,000 subrogation lien in Tab 6. The pitfall is sorting documents without applying QC."}
},
"4::Common Bottlenecks: Mediation (The Compromise Traps)": {
  "p1": {"on": "This slide says the Case Manager's job is to anticipate and eliminate bottlenecks before they kill momentum, and names three in mediation: unverified medical ledgers and liens, missing decision-makers without full settlement authority, and confidential briefs delivered late or missing key exhibits."},
  "p2": {"on": "This slide says the single biggest mediation bottleneck is an unverified medical ledger. The pitfall is a brief that reaches the mediator 10 minutes before the session."}
},
"4::Common Bottlenecks: Arbitration (The Trial-Ready Landmines)": {
  "p1": {"on": "This slide explains that arbitration is binding with no second chances, and names three landmines: evidentiary exclusions (missing documents or low-quality black-and-white photos thrown out), unaddressed pre-existing defense traps (prior injuries not shielded with expert declarations) and calendar and deadline misses."},
  "p2": {"on": "This slide says to package prior discharge notes with an expert declaration, or the arbitrator may reduce the award. The pitfall is printing damage photos in grayscale."}
},
"4::Case Manager Operational Countermeasures: The 48-Hour Mandate": {
  "p1": {"on": "This slide gives the 48-Hour Operational Mandate for solving these bottlenecks: a mandatory file audit 48 hours before any deadline to verify ledgers and binder completeness, proactive lien reconciliation using health insurance EOBs to eliminate double-dipping hospital liens, and OCR scanning of digital binders."},
  "p2": {"on": "This slide says that if a provider hasn't sent the final ledger 48 hours before mediation, escalate to the attorney, mark the treatment Pending Final Verification, include the interim bills and let the attorney set expectations in opening remarks. The pitfall is waiting for perfect records instead of escalating."}
},
// ---------- Day 5 ----------
"5::Welcome to Day 5: Stepping into Litigation": {
  "p1": {"on": "This slide introduces the last day as three boxes: Litigation (mapping the process and where the Case Manager fits), Property Damage (how physical damage affects an injury claim in court) and Liability Disputes & MIA Clients (coverage, disputes and uncooperative clients). The goal is for trainees to feel confident guiding clients through every step of a lawsuit."},
  "p2": {"on": "This slide says litigation is the path when negotiations with the insurer fail. The pitfall is treating a lawsuit like a longer negotiation."}
},
"5::The Case Manager's Tactical Role in Litigation: The Litigation Lifecycle": {
  "p1": {"on": "This slide explains that once a case moves into litigation everything changes: it's a court-mandated process where a missed deadline or misfiled document can get the case dismissed, and property damage can be either proof of injury or the defense's best tool. It shows the lawsuit in three phases (Pleadings, Discovery, Trial Prep) with the Case Manager's role in each."},
  "p2": {"on": "This slide says pre-litigation is like an email negotiation, while litigation is a strict court process with non-negotiable rules. The pitfall is missing a court deadline the way you might let an adjuster deadline slide."}
},
"5::Phase 1: The Pleadings & Service Stage": {
  "p1": {"on": "This slide says the Case Manager's main job in Phase 1 is to get the lawsuit started and make sure the defendant can't claim they never knew about it. It covers tracking the Statute of Limitations, managing process servers or the sheriff for personal service, and filing the signed Affidavit of Service, with alternative service if the defendant evades."},
  "p2": {"on": "This slide says missing the SOL by one day loses the client's right to sue forever. The pitfall is an unfiled Affidavit of Service sitting in email."}
},
"5::Phase 2: Discovery — A. Interrogatories & Requests for Production": {
  "p1": {"on": "This slide explains that discovery is where both sides lay their cards on the table and where Case Managers spend 80% of their litigation time. For the defense's written questions (interrogatories) and document demands (RFPs), the strategy is a dedicated Discovery Intake Meeting: walk the client through every question, draft answers into the legal template, compile the documents, and get a signed verification page."},
  "p2": {"on": "This slide says a 20-page legal questionnaire mailed to a client working two jobs ends up in a drawer, so schedule the 60-minute meeting. The pitfall is sending responses without a signed verification page."}
},
"5::Phase 2: Discovery — B. Deposition Coordination & Preparation": {
  "p1": {"on": "This slide explains that a deposition is a recorded oral interview under oath where the defense may question the client for hours to trip them up. The Case Manager handles logistics (court reporter, videographer, room or Zoom, calendars) and client hand-holding: a prep packet a week before and the core rules of listening, pausing, never guessing and telling the truth."},
  "p2": {"on": "This slide says clients expect a dramatic movie trial, so reset that expectation early. The pitfall is sending the prep packet the day before."}
},
"5::Phase 3: The Trial & Mediation Preparation Stage": {
  "p1": {"on": "This slide covers the final stage: updating medical records and bills (litigation can take 1–3 years, so there may be new doctors, surgery or bills), managing subpoenas so witnesses, physicians and officers legally show up, and organizing indexed, tabbed trial binders for the counsel table."},
  "p2": {"on": "This slide warns that if a $50,000 surgery bill from six months ago isn't requested, the jury won't see it and the client won't be reimbursed. The pitfall is building trial binders from pre-litigation records only."}
},
"5::The Litigation Mindset: Critical Traps & KPIs": {
  "p1": {"on": "This slide names two traps: treating court deadlines like insurance deadlines (court deadlines are absolute, and a missed discovery deadline can bar medical evidence) and letting the client talk to the adjuster after suit is filed (all communication goes through counsel). It adds three KPIs: a process server assigned within 48 hours, discovery drafts to the attorney 7 days early, and a 30-day client call."},
  "p2": {"on": "This slide says to audit the litigation docket weekly against these KPIs. The pitfall is clients feeling forgotten during slow litigation."}
},
"5::Preparing Your Client for a Deposition: The Pre-Deposition Audit": {
  "p1": {"on": "This slide explains that a client's deposition can shape the case's outcome, and that while the attorney handles strategy, the Case Manager prepares the client operationally and psychologically. The pre-deposition audit checks prior medical history (for example, a 2018 lower-back injury), consistency with the signed interrogatories, and the client's social media."},
  "p2": {"on": "This slide says consistency is the key to credibility. The pitfall is letting the client be surprised by their own prior records."}
},
"5::Discovery Intake Meeting — Pillar 1: De-escalating Anxiety": {
  "p1": {"on": "This slide introduces the three pillars of the prep meeting. Pillar 1 is de-escalating anxiety, because clients' ideas about legal matters come from television, with a script describing the deposition as a business meeting in a conference room with no judge, jury or shouting."},
  "p2": {"on": "This slide says calm clients give shorter, more accurate answers. The pitfall is over-coaching until the client sounds rehearsed."}
},
"5::Discovery Intake Meeting — Pillar 2: The Essential Testimony Guidelines": {
  "p1": {"on": "This slide says most prep time should go to practicing three behaviors with mock questions: the 2-second pause (breaks the defense's speed and gives our attorney time to object), the liar's trap (defense already knows about past injuries and is testing honesty) and stop talking (answer only what was asked)."},
  "p2": {"on": "This slide says to run mock questions until the pause is automatic. The pitfall is a client who volunteers extra detail."}
},
"5::Discovery Intake Meeting — Pillar 3: Dress Code & Professional Demeanor": {
  "p1": {"on": "This slide explains that the adjuster sets settlement value partly from the defense attorney's evaluation report of the client, and covers the standard (dress as for a job interview or a funeral), the warning (no flashy jewelry, luxury watches or slogans, since designer labels undermine claims of hardship or distress) and tone (stay polite, never angry or sarcastic)."},
  "p2": {"on": "This slide gives the example that a client claiming financial hardship in $1,000 designer shoes destroys their credibility. The pitfall is not mentioning the dress code because it feels awkward."}
},
"5::Navigating the Silent Traps — Drill A: The “Is That All?” Trap": {
  "p1": {"on": "This slide sets up Drill A, the 'Is that all?' trap: the defense lists injuries and asks 'So, you only hurt your neck, correct?', and a 'yes' may bar later back or shoulder complaints. The solution is a prepared answer: these are the main injuries that come to mind, and the full medical record details everything discussed with the doctors."},
  "p2": {"on": "This slide says to practice the answer until it feels natural. The pitfall is a 'yes' that narrows the case forever."}
},
"5::Navigating the Silent Traps — Drill B: The Thoughtful Silence": {
  "p1": {"on": "This slide sets up Drill B: the defense attorney leaves a long silence after an answer, expecting the client to fill it. The solution is to make eye contact and stay silent, never guess or speculate ('I don't know' and 'I don't recall' are smart answers), and not try to win the case at the deposition."},
  "p2": {"on": "This slide's rule is that silence is safe and rambling is not. The pitfall is filling silence with speculation."}
},
"5::Case Manager Checklist: The Day Before the Deposition": {
  "p1": {"on": "This slide gives the day-before checklist: confirm logistics (date, time, location or Zoom link) with the client, attorney and court reporter; prepare exhibits (final medical records, invoices and property damage photos) for the attorney; and verify a backup phone number for the client."},
  "p2": {"on": "This slide says to warn the client about objections: when our lawyer speaks, stop talking; usually the lawyer will say 'You can answer'; if they say 'I instruct the witness not to answer,' stay quiet. The pitfall is having no backup contact when the client's Zoom fails."}
},
"5::What Will the Defense Attorney Ask Me? The Four Categories": {
  "p1": {"on": "This slide sorts the defense attorney's questions into four categories in four boxes: personal background (work, residence, prior lawsuits), mechanics of the crash (lane, speed, weather, how the impact felt), medical history (injuries from this accident and before it) and impact on daily life (work, hobbies, family, routine)."},
  "p2": {"on": "This slide says clients most often hide or underreport category 3, past medical history. The pitfall is prepping only on the crash mechanics."}
},
"5::The 7 Golden Rules for Testifying (Rules 1–3)": {
  "p1": {"on": "This slide explains the defense's goal (to get the client to contradict themselves, lose their temper or exaggerate) and gives Rules 1–3: always tell the absolute truth (lies about prior injuries will be found, and a jury that catches a lie ends the case), pause two full seconds before answering, and answer vocally, with no nods, shrugs or 'uh-huh'."},
  "p2": {"on": "This slide says Rule 2 matters most when questions come fast. The pitfall is nodding instead of answering."}
},
"5::The 7 Golden Rules for Testifying (Rules 4–5)": {
  "p1": {"on": "This slide covers Rule 4, never guess or speculate (a good estimate is 'roughly 35 to 40 miles per hour'; a bad guess is 'he must have been going 90'), and Rule 5, keep answers short (asked what day it happened, answer 'Tuesday' and stop)."},
  "p2": {"on": "This slide says to give the defense as small a target as possible. The pitfall is volunteering extra information."}
},
"5::The 7 Golden Rules for Testifying (Rules 6–7)": {
  "p1": {"on": "This slide covers Rule 6, beware the silent trap (after a short answer, don't fill the silence; wait for the next question), and Rule 7, don't try to win the case in the deposition (you won't convince the defense or get an apology, so stay polite and calm and leave the legal battle to your attorney)."},
  "p2": {"on": "This slide says a deposition is strictly information gathering. The pitfall is a client who argues with defense counsel."}
},
"5::Professional Presentation: Dress Code & Demeanor": {
  "p1": {"on": "This slide explains that the insurer uses the deposition to judge how a jury would react to the client, and compares what to wear (business casual, with examples for men and women and a list of what to avoid) with body language and tone (stay calm, don't minimize or exaggerate pain, use a matter-of-fact tone about limitations)."},
  "p2": {"on": "This slide gives the scenario of a client on a virtual deposition in a t-shirt and flashy jewelry, sitting on their bed, which tells the adjuster the claim isn't serious. The pitfall is ignoring virtual-deposition presentation."}
},
"5::What Happens When Your Lawyer Objects?": {
  "p1": {"on": "This slide explains that during the deposition the attorney may say 'Objection' followed by a legal term such as form or speculation, and tells the client not to panic, to stop talking immediately, and to listen for instructions: usually 'You can answer the question', or 'I instruct the witness not to answer'."},
  "p2": {"on": "This slide says to explain objections ahead of time so the client doesn't freeze. The pitfall is a client who keeps talking over an objection."}
},
"5::The Litigation Toolkit: The Litigation Document Index": {
  "p1": {"on": "This slide explains that in litigation documents become evidence, and gives a table of five foundational documents with what each is and why it matters: the Complaint or Petition (track the filing date against the SOL), the Answer (the roadmap of what the defense disputes), Interrogatories (a 30-day clock), Requests for Production (compile every item) and Requests for Admission (unanswered by the deadline means automatically admitted)."},
  "p2": {"on": "This slide says to treat every RFA as an immediate fire and notify the attorney. The pitfall is a perfect Complaint filed one day after the SOL, which loses the case."}
},
"5::The 3 Golden Rules of Litigation File Maintenance": {
  "p1": {"on": "This slide gives three rules for keeping litigation files organized: separate pre-lit from lit (sub-folders for pleadings, discovery sent and received, motions and subpoenas), read the scheduling order like the bible (every date on the master calendar with 30-, 14- and 7-day alerts), and document all extensions in writing."},
  "p2": {"on": "This slide says every scheduling order date gets three alerts. The pitfall is a phone-only extension."}
},
"5::Key Performance Indicators (KPIs) for Document Management": {
  "p1": {"on": "This slide gives three document-management KPIs as three boxes: the 48-hour docket rule (anything from the court or opposing counsel filed and docketed within 48 hours), the RFA priority check (alert the attorney the hour an RFA arrives) and the subpoena audit (review outstanding subpoenas every 10 days)."},
  "p2": {"on": "This slide says to put the subpoena audit on a recurring calendar reminder. The pitfall is RFAs waiting in an inbox overnight."}
},
"5::Litigation File Architecture": {
  "p1": {"on": "This slide shows the firm's standard litigation folder structure in a table: a master directory named [CLIENT LAST NAME, FIRST NAME - CASE FILE] with five numbered sub-folders (01_PLEADINGS, 02_SERVICE_DOCS, 03_DISCOVERY_PLAINTIFF_TO_DEFENDANT, 04_DISCOVERY_DEFENDANT_TO_PLAINTIFF, 05_SUBPOENAS) and example file names for each."},
  "p2": {"on": "This slide says consistent names make any file searchable by anyone. The pitfall is 'scan001.pdf' file names."}
},
"5::Advanced KPIs for Litigation Case Managers": {
  "p1": {"on": "This slide gives three advanced KPIs: the zero-default policy (never let a discovery or motion deadline pass without a filed response or a signed written extension), the 14-day service milestone (if the defendant isn't served within 14 days, skip-trace and update the attorney) and the clean discovery check (no blanks, and a signature-ready verification page attached)."},
  "p2": {"on": "This slide says a missed deadline risks sanctions or default. The pitfall is handing the attorney discovery with blanks."}
},
"5::Critical Litigation Processes: Service of Process & E-Filing/Docketing": {
  "p1": {"on": "This slide explains that litigation runs on rigid court procedures executed weekly. Process 1 is the service-of-process pipeline, shown as a four-step flow: issue the summons, assign the process server, monitor the timeline every 5 days, and file proof of service. Process 2 is e-filing and docketing, where every filing creates a docket entry."},
  "p2": {"on": "This slide warns that if a Motion to Dismiss notification lands in spam, the clock is still ticking. The pitfall is relying on email alerts instead of the docket."}
},
"5::Critical Litigation Process 3: Third-Party Evidence Subpoenas": {
  "p1": {"on": "This slide covers the subpoena process when a hospital, phone provider or employer won't hand over records voluntarily, as a four-step flow: draft the Subpoena Duces Tecum, notify opposing counsel first (most states require 5–10 days), have a process server deliver it to the facility's registered agent, and call the records department 5 days before the deadline."},
  "p2": {"on": "This slide says not to just send it and pray, but to follow up. The pitfall is serving the third party before notifying opposing counsel."}
},
"5::Advanced Workflow Deep-Dive: The Complaint / Petition": {
  "p1": {"on": "This slide explains that the complaint starts the lawsuit, with the attorney setting the legal arguments and the Case Manager verifying the facts. It shows the complaint's five sections (caption, jurisdiction, factual allegations, causes of action, prayer for relief) and a three-point pre-signature checklist: the statute date, entity verification through the Secretary of State or property records, and the registered agent for service."},
  "p2": {"on": "This slide says to run all three checks before the complaint goes for signature. The pitfall is suing the wrong entity name."}
},
"5::Written Discovery: Interrogatories, RFPs & RFAs": {
  "p1": {"on": "This slide says a defense discovery packet must be dissected and calendared immediately, as a three-step flow: dial the calendar (usually 30 days from service), compile the data already gathered in pre-lit, and hold a 60-minute discovery intake conference with the client. For our own interrogatories, it lists three baseline categories: insurance coverage (primary, excess and umbrella), course and scope of employment, and surveillance."},
  "p2": {"on": "This slide says course-and-scope answers can open the employer's policy. The pitfall is forgetting to ask about excess and umbrella limits."}
},
"5::Master Timeline & Deadline Calculations": {
  "p1": {"on": "This slide explains that missing a deadline by one day can get a case dismissed with prejudice, and gives the calculation rules: exclude the trigger day, include the last day, and add 3 days in many states for mail or e-service. A matrix lists standard deadlines: serve within 90–120 days of filing, an answer within 20–30 days of service (21 in federal court), discovery responses in 30 days (+3), and motion responses in 14–21 days."},
  "p2": {"on": "This slide says to calendar the conservative date when the rules are unclear. The pitfall is counting the trigger day as day one."}
},
"5::The Process Server & Evading Defendant Protocol": {
  "p1": {"on": "This slide explains that defendants often hide, refuse to answer the door or quit their jobs to avoid service, and that failing to serve by the court's deadline gets the case dismissed for want of prosecution. The three-step protocol: skip trace, vary the server's shifts (6 AM, up to 9 PM, weekends) and a motion for alternative service (social media, certified mail or posting on the door)."},
  "p2": {"on": "This slide says to start the protocol early rather than waiting for the service deadline. The pitfall is repeated attempts at the same time of day."}
},
"5::Subpoena Duces Tecum: Execution Strategy": {
  "p1": {"on": "This slide explains that a Subpoena Duces Tecum compels uncooperative third parties to produce evidence, warns that a blanket request for 'all records of any kind' invites a motion to quash as an overbroad fishing expedition, and gives a specific example. The four-step flow: draft the form with a precise Exhibit A, notify opposing counsel, serve the custodian of records or registered agent, and pay copy invoices promptly."},
  "p2": {"on": "This slide says to pay copy invoices immediately to avoid delays. The pitfall is an overbroad Exhibit A."}
},
"5::Skill Building: The Ultimate Case Management — Jordan Davies": {
  "p1": {"on": "This slide introduces the Jordan Davies file (DOA March 12, 2026; MVA; total loss; pre-litigation with active treatment; a liability dispute and a client refusing treatment). Phase 1: $50,000 in bills against a $10,000 BI policy, so find all available coverage including stackable resident-relative UM/UIM. Phase 2: roleplay a call with Jordan, who stopped PT out of fear of medical debt. Phase 3: answer State General Auto's 50/50 liability split with an evidence plan and carrier notices."},
  "p2": {"on": "This slide says to look beyond the obvious policies, because resident relatives often hold stackable UM. The pitfall is accepting the 50/50 split without requesting evidence."}
},
"5::Property Damage in Litigation: Types of Damages You Can Recover": {
  "p1": {"on": "This slide explains that property damage is a cornerstone of civil litigation, with the goal of restoring the owner to their pre-incident financial position rather than a windfall. Three boxes set out the damage types: economic compensatory (quantifiable losses), non-economic compensatory (pain, distress, loss of consortium) and punitive (punishing egregious conduct such as DUI)."},
  "p2": {"on": "This slide says property damage is also physical evidence of impact severity for the injury claim. The pitfall is treating PD as 'just the car'."}
},
"5::Property Damage: Calculating the Value of the Claim": {
  "p1": {"on": "This slide explains that calculating what the defendant owes is one of the most litigated parts of a PD case. Side by side: the 'lesser of' rule (the lesser of the repair cost or the diminution in value, so a $5,000 car with $7,000 of repairs is capped at $5,000) and sentimental or special value, allowed in some jurisdictions only if the defendant had notice or acted intentionally."},
  "p2": {"on": "This slide says to verify the CCC One or valuation report so the client isn't lowballed. The pitfall is promising emotional-value recovery the law won't award."}
}
};
