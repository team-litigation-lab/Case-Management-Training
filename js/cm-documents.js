/* ============================================================
   LSH Case Management Training — Case Document Library
   Every file lives in /documents. "cms" is the CMS upload button
   the trainee should use (Medical, Police, Case Files, Invoices,
   Bills, PD, Litigation, Others). "key" is the trainer-only audit
   note: what is planted or important in that document.
   ============================================================ */
window.CM_DOC_FOLDERS = [
  {id:"intake", label:"Intake & Retainer", icon:"📥"},
  {id:"police", label:"Police Report", icon:"🚓"},
  {id:"medical", label:"Medical Records", icon:"🩺"},
  {id:"bills", label:"Bills & Invoices", icon:"🧾"},
  {id:"insurance", label:"Insurance & Negotiation", icon:"🛡"},
  {id:"liens", label:"Liens & Subrogation", icon:"⚖"},
  {id:"settlement", label:"Settlement & Wages", icon:"🤝"},
  {id:"litigation", label:"Litigation & ADR", icon:"🏛"},
  {id:"jordan-davies", label:"Jordan Davies File (Day 5)", icon:"🧩"},
  {id:"templates", label:"Templates & Blank Forms", icon:"📝"},
  {id:"handouts", label:"Handout Repository", icon:"📚"}
];

window.CM_DOCS = [
  /* ---------- JOHN DOE — INTAKE ---------- */
  {id:"JD01", folder:"intake", file:"intake/JD_01_New_Client_Intake_Sheet.pdf", title:"New Client Intake Sheet", cms:"Case Files", day:1,
   desc:"Client info, DOL 02/14/2026, police report #, injuries, carriers, passenger (spouse) and internal intake notes.",
   key:"Police report # listed correctly as 2026-0214-AX. Notes the 2-week MIA period and litigation threat. Passenger Jane Doe is a potential second claimant — conflict check needed."},
  {id:"JD02", folder:"intake", file:"intake/JD_02_Intake_Supplement_Prior_History.pdf", title:"Intake Supplement — Prior History & Prior Counsel", cms:"Case Files", day:1,
   desc:"2018 lumbar strain, chronic migraines (2021), prior counsel Barry Slow and his pending lien, Eggshell Plaintiff strategy.",
   key:"Says 'asymptomatic for 7 years' while other records say 8 years (2018→2026). Prior counsel lien = $1,200 costs + quantum meruit — must be acknowledged before any disbursement."},
  {id:"JD03", folder:"intake", file:"intake/JD_03_LSH_CMS_Intake_Record.docx", title:"LSH Intake Record (CMS format)", cms:"Case Files", day:1,
   desc:"The intake as it should be keyed into the CMS: identity, employment, narrative, police details, health insurance, vehicles.",
   key:"PLANTED: occupation 'Nurse' (every other document says Senior Logistics Manager); police 'REPORT NUMBER 1104' is Sgt. Vance's badge number, not the report number; narrative dated 5/27/2026. Health insurance BCBS ERISA Group BC-441-A."},
  {id:"JD04", folder:"intake", file:"intake/JD_04_Master_Case_Summary_ATTORNEY_ONLY.pdf", title:"Master Case Summary (Internal — Attorney Only)", cms:"Case Files", day:1,
   desc:"SOL 02/14/2028, vehicle damage log, coverage analysis, the 14-day MIA gap, current status.",
   key:"INTERNAL WORK PRODUCT — never goes into a mediation or arbitration binder. States 'Litigation was initiated' → fee tier moves to 40% under the retainer. Location field is incomplete ('Generic Address')."},
  {id:"JD05", folder:"intake", file:"intake/JD_05_Retainer_Agreement.pdf", title:"Contingent Fee Retainer Agreement", cms:"Case Files", day:1,
   desc:"Signed 02/15/2026. 33⅓% pre-suit / 40% if suit filed. Authority to resolve Barry Slow's lien. Costs deducted before fee.",
   key:"Fee tier depends on whether a complaint was filed — check before every net sheet. Costs are deducted from gross BEFORE the fee is calculated (§4) — the Net Sheet template calculates fee on gross; flag to attorney."},
  {id:"JD06", folder:"intake", file:"intake/JD_06_HIPAA_Authorization.pdf", title:"HIPAA Authorization", cms:"Case Files", day:1,
   desc:"Claim-specific release naming the 02/14/2026 incident, spinal trauma and facial lacerations.",
   key:"PLANTED: unsigned and undated — records requests will be rejected until it is executed."},
  /* ---------- POLICE ---------- */
  {id:"JD07", folder:"police", file:"police/JD_07_Police_Report_2026-0214-AX.pdf", title:"Police Report 2026-0214-AX", cms:"Police", day:1,
   desc:"Sgt. A. Vance #1104. Smith (Apex F-150) ran the red; Doe turning left on a green arrow; B-pillar T-bone; extrication; citations.",
   key:"Liability anchor: two citations to Smith. No independent witness listed — spouse is the only other occupant. Jane Doe refused EMS (document for her separate claim)."},
  /* ---------- MEDICAL ---------- */
  {id:"JD08", folder:"medical", file:"medical/JD_08_EMS_Run_Report.pdf", title:"EMS Run Report (Medic 14)", cms:"Medical", day:2,
   desc:"Entrapment, facial hemorrhage, 10/10 back pain, left-leg numbness; extricated 15:05; GCS 14.", key:"Objective severity evidence that defeats a 'low-speed' argument."},
  {id:"JD09", folder:"medical", file:"medical/JD_09_Metro_General_Hospital_Records.pdf", title:"Metro General Hospital Records (ER, Surgical Log, Labs, Op Report)", cms:"Medical", day:1,
   desc:"Level 1 Trauma, 12cm stellate laceration, 42 sutures, CT C5-C6, 14-day strict bed rest order.",
   key:"The 14-day bed-rest order (02/14–02/28) is a documented medical order, NOT a treatment gap."},
  {id:"JD10", folder:"medical", file:"medical/JD_10_Hospital_Labs_Radiology.pdf", title:"Hospital Labs & ER Radiology", cms:"Medical", day:2, desc:"WBC 14.8, BAC negative, drug screen negative, cervical/chest x-ray.", key:"Negative BAC and drug screen eliminate a comparative-fault / impairment argument."},
  {id:"JD11", folder:"medical", file:"medical/JD_11_Facial_Surgical_Repair_Log.pdf", title:"Facial Surgical Repair Log", cms:"Medical", day:2, desc:"Glass shard removal, multi-layer closure (12 Vicryl + 30 Prolene = 42 sutures).", key:"Permanent disfigurement proof — a high general-damages driver."},
  {id:"JD12", folder:"medical", file:"medical/JD_12_EMC_Attestation_Dr_Spine.pdf", title:"EMC Attestation — Dr. Sarah Spine", cms:"Medical", day:2, desc:"Emergency Medical Condition finding — unlocks full PIP.", key:"With an EMC the full $10,000 PIP is available (already exhausted per the PIP log)."},
  {id:"JD13", folder:"medical", file:"medical/JD_13_MRI_Lumbar_Report.pdf", title:"MRI Lumbar Report (03/15/2026)", cms:"Medical", day:1,
   desc:"5mm L4-L5 protrusion impinging the left L5 root; mild degenerative L5-S1.",
   key:"PLANTED: DOB 02/14/1980 (wrong); 'Dr. Aris Thorne' as referring physician (not a known treater); age 46 vs 45. Demand email and chronology cite '3mm, 03/10' — reconcile before demand/brief."},
  {id:"JD14", folder:"medical", file:"medical/JD_14_PT_Functional_Evaluation.pdf", title:"PT Functional Evaluation", cms:"Medical", day:1, desc:"ROM deficits of 60%+, ADL limits, can't lift his 2-year-old.", key:"Objective ADL evidence for the attorney's pain & suffering case."},
  {id:"JD15", folder:"medical", file:"medical/JD_15_PT_Sessions_5-6.pdf", title:"PT Sessions #5–#6", cms:"Medical", day:1, desc:"Radicular symptoms, foot drop (hallux 3/5), PT placed on hold pending specialist.", key:"Foot drop = medical danger red flag (A-C-T: call the provider). Note of clinical withdrawal precedes the gap."},
  {id:"JD16", folder:"medical", file:"medical/JD_16_Chiro_Visit_12.pdf", title:"Chiropractic Visit #12", cms:"Medical", day:1, desc:"8/10 radicular pain, plateau due to structural disc protrusion, surgical referral.", key:"Plateau → course-correct (specialist), per the Treatment Map."},
  {id:"JD17", folder:"medical", file:"medical/JD_17_Chiro_Visits_13-14.pdf", title:"Chiropractic Visits #13–#14", cms:"Medical", day:1, desc:"Worsening neuro symptoms; patient requests 14-day rest phase; neurosurgery referral.", key:"Visit dates (03/30, 04/02) don't match the chiro billing statement dates (03/15, 03/17) — request the complete ledger."},
  {id:"JD18", folder:"medical", file:"medical/JD_18_Neuropsych_Eval_Gap_Explanation.pdf", title:"Neuropsychological Evaluation (Gap Explanation)", cms:"Medical", day:2, desc:"PTSD with Acute Dissociative Withdrawal explains the 04/01–04/15 gap.", key:"The document that reframes the gap in the demand."},
  {id:"JD19", folder:"medical", file:"medical/JD_19_Microdiscectomy_Operative_Report.pdf", title:"Microdiscectomy Operative Report (05/12/2026)", cms:"Medical", day:2, desc:"L4-L5 left microdiscectomy by Dr. Spine; anesthesiologist Dr. Victor Vapor (independent group).", key:"Independent anesthesia group = a separate bill that is missing from the specials."},
  {id:"JD20", folder:"medical", file:"medical/JD_20_Neurology_Permanency_5pct_WPI.pdf", title:"Neurology Permanency — 5% WPI (Dr. Neil Ron)", cms:"Medical", day:3, desc:"Permanent L5/S1 deficit, chronic axonal damage, 5% Whole Person Impairment.", key:"The single biggest weapon against the pre-existing defense."},
  {id:"JD21", folder:"medical", file:"medical/JD_21_Discharge_Summary_Work_Restrictions.pdf", title:"Discharge Summary & Permanent Work Restrictions", cms:"Medical", day:3, desc:"Light duty only; cannot return to Senior Logistics Manager; loss of earning capacity.", key:"Contradicts the 'Nurse' occupation in the CMS intake record."},
  {id:"JD22", folder:"medical", file:"medical/JD_22_Prior_Injury_Record_2018.pdf", title:"Prior Injury Record — 2018 Workplace Strain", cms:"Medical", day:1, desc:"08/12/2018 L4-L5 strain; resolved 09/15/2018 at MMI, no restrictions, no MRI.", key:"The 'adjuster landmine' — and the proof of an 8-year asymptomatic baseline."},
  {id:"JD23", folder:"medical", file:"medical/JD_23_Medical_Chronology.pdf", title:"Medical Chronology & Forensic Summary", cms:"Medical", day:2, desc:"Exhibits A–F with legal/value implications for each record.", key:"PLANTED: MRI listed as 03/10/2026, 3mm — the MRI report says 03/15/2026, 5mm. Claims 'scrubbed for double billing' — verify, don't trust."},
  /* ---------- BILLS ---------- */
  {id:"JD24", folder:"bills", file:"bills/JD_24_Provider_Billing_Statements.pdf", title:"Provider Billing Statements (EMS, ER, Dr. Spine, Chiro, PT)", cms:"Bills", day:2,
   desc:"EMS $2,200 · ER $12,700 · EMC $1,200 · Chiro $320 · PT $560.",
   key:"PLANTED: DOB 02/14/1980 on every statement. Chiro/PT statements are partial (2 visits each). ER bill $12,700 vs hospital lien $45,000 vs demand $12,400."},
  {id:"JD25", folder:"bills", file:"bills/JD_25_MRI_Invoice.pdf", title:"MRI Invoice — Metro Radiology & Imaging", cms:"Invoices", day:2,
   desc:"Lumbar MRI technical $2,450 + professional $450 + brain MRI $2,100 = $5,000.",
   key:"The demand lists 'Metropolis Radiology — MRI spinal mapping $2,100' — that's the BRAIN MRI amount (migraine history risk) and the wrong entity name."},
  {id:"JD42", folder:"bills", file:"bills/JD_42_Late_Bill_Riverview_Radiology_POST_CLOSING.pdf", title:"Late Bill — Riverview Radiology ($1,200, post-closing)", cms:"Bills", day:3,
   desc:"First statement dated 08/04/2026 for DOS 06/02/2026, referred by Dr. Spine.", key:"Day 3 plot twist. Accident-related (post-op follow-up referred by the treating surgeon); not on the ledger; release indemnity clause makes it the claimant's obligation — firm must own the missed records sweep and negotiate."},
  /* ---------- INSURANCE ---------- */
  {id:"JD26", folder:"insurance", file:"insurance/JD_26_PIP_Exhaustion_Log.pdf", title:"PIP Exhaustion Log — Local Farm Mutual", cms:"Others", day:2, desc:"$10,000 exhausted on 02/14 (EMS $2,200, ER $4,800, CT $3,000).", key:"Speed of exhaustion = severity signal. Remaining bills go to health insurance or LOP."},
  {id:"JD27", folder:"insurance", file:"insurance/JD_27_Dec_Page_Aggressive_Casualty_BI.pdf", title:"Dec Page — Aggressive Casualty (Apex)", cms:"Others", day:1, desc:"$1,000,000 CSL; PD DENIED (Excl. 4.b); MedPay $5,000 secondary.", key:"PD denial means the Tesla ($42,500 total loss) goes through the client's collision coverage ($1,000 deductible) + subrogation."},
  {id:"JD28", folder:"insurance", file:"insurance/JD_28_Dec_Page_Local_Farm_Mutual_UM.pdf", title:"Dec Page — Local Farm Mutual (Client)", cms:"Others", day:3, desc:"BI $250k/$500k · UM/UIM $250k/$500k · PIP $10,000 · Collision ACV $1,000 ded.", key:"UM is available only if BI is exhausted — protect it with Consent to Settle before any BI release."},
  {id:"JD29", folder:"insurance", file:"insurance/JD_29_Demand_and_Adjuster_Email_Exchange.pdf", title:"Demand & Adjuster Email Exchange (V2)", cms:"Others", day:2,
   desc:"Email 1 demand $250,000 · Email 2 counter $45,000 · Email 3 rebuttal.",
   key:"PLANTED in the demand's specials table: 'Fire Dept' extrication $1,850 (really EMS ALS transport); ER $12,400 (bill $12,700); plastic reconstruction $3,200 (no bill on file); MRI $2,100 (brain MRI, wrong entity); chiro $8,400 (statement $320); future care $15,000 (p.2) vs $57,000 (p.18); MRI '3mm 03/10'. Surgeon/anesthesia/facility/PT/EMC bills omitted."},
  /* ---------- LIENS ---------- */
  {id:"JD30", folder:"liens", file:"liens/JD_30_Global_Health_Subrogation_Lien.pdf", title:"Statutory Subrogation Lien — Global Health Blue-Shield ($11,200)", cms:"Others", day:3, desc:"Itemized payments: ER $4,200 · MRI $850 · Surgical facility $6,150.", key:"Entity name doesn't match the client's health plan (BCBS ERISA BC-441-A). Verify whether this and the BlueCross $20,000 notice are the same interest — never pay both."},
  {id:"JD31", folder:"liens", file:"liens/JD_31_Lien_Letters_Hospital_PriorAttorney_BlueCross.pdf", title:"Lien Letters — Metro General, Barry Slow, BlueCross", cms:"Others", day:3,
   desc:"Hospital lien $45,000 · Prior counsel $1,200 (8 hrs QM + $400 costs) · BlueCross ERISA $20,000.",
   key:"Metro General's $45,000 vs its own $12,700 bill — PIP and health insurance already paid part (double-recovery). BlueCross letter says self-funded ERISA: Made Whole and Common Fund do NOT apply unless agreed in writing — reduce by audit/itemization and negotiation. Barry Slow: challenge clerical hours as overhead."},
  /* ---------- SETTLEMENT ---------- */
  {id:"JD32", folder:"settlement", file:"settlement/JD_32_Lost_Wage_Verification.pdf", title:"Lost Wage Verification ($15,900)", cms:"Others", day:2, desc:"Senior Logistics Manager; full absence, partial disability, appointments.", key:"Payroll + Dr. Spine RTW note attached = both pieces adjusters require."},
  {id:"JD33", folder:"settlement", file:"settlement/JD_33_Proposed_Release_AUDIT_DO_NOT_SIGN.pdf", title:"Proposed Release — AUDIT, DO NOT SIGN", cms:"Case Files", day:2,
   desc:"$100,000 'global' release from Aggressive Casualty with a lien ledger.",
   key:"PLANTED defects: global release of unknown/future injuries; §II makes the client AND counsel personally liable to defend and pay; §III waives UM/UIM (destroys the Local Farm Mutual claim); ledger only lists the $11,200 Global Health lien — omits Metro General, BlueCross ERISA, prior counsel; 'disregarding ongoing clinical therapies'; $100,000 vs a $1,000,000 CSL. Counter with the Standard Safe Release."},
  /* ---------- LITIGATION & ADR ---------- */
  {id:"JD34", folder:"litigation", file:"litigation/JD_34_Original_Complaint_SUPERSEDED.pdf", title:"Original Complaint (SUPERSEDED)", cms:"Litigation", day:4, desc:"Filed 06/01/2026 — names the driver only.", key:"Exclude from binders — superseded by the First Amended Complaint."},
  {id:"JD35", folder:"litigation", file:"litigation/JD_35_First_Amended_Complaint_OPERATIVE.pdf", title:"First Amended Complaint (Operative)", cms:"Litigation", day:4, desc:"Filed 06/10/2026 — negligence, vicarious liability, negligent entrustment vs Apex and Smith.", key:"Suit filed → retainer fee tier is now 40%."},
  {id:"JD36", folder:"litigation", file:"litigation/JD_36_Answer_and_Affirmative_Defenses.pdf", title:"Answer & Affirmative Defenses", cms:"Litigation", day:4, desc:"Comparative negligence, pre-existing, failure to mitigate, collateral source, reasonableness.", key:"No seatbelt defense pleaded — the attorney can object if it's raised at mediation/arbitration."},
  {id:"JD37", folder:"litigation", file:"litigation/JD_37_Arbitration_Scheduling_Order.pdf", title:"Stipulated Arbitration & Scheduling Order", cms:"Litigation", day:4, desc:"Mediation deadline 06/18 · brief due 06/18 5 PM · hearing 06/20 9 AM · retainer deposits 06/16.", key:"Every date must be hard-coded on the master calendar with alerts."},
  {id:"JD38", folder:"litigation", file:"litigation/JD_38_AAA_Fee_Statement.pdf", title:"AAA Arbitrator Fee Statement", cms:"Litigation", day:4, desc:"Hon. Ruth Calder (Ret.), $600/hr, 50/50 split.", key:"PLANTED: claimant's $4,800 deposit is OUTSTANDING — the hearing won't proceed. Route to accounting today."},
  {id:"JD39", folder:"litigation", file:"litigation/JD_39_Defendants_First_Requests_for_Admission.pdf", title:"Defendant's First Requests for Admission", cms:"Litigation", day:5, desc:"Served by U.S. Mail 06/12/2026.", key:"Response due 07/15/2026 (30 days + 3 for mail, trigger day excluded). RFA #3 (seatbelt) and #4 (no permanent injury) are deadly if deemed admitted."},
  {id:"JD40", folder:"litigation", file:"litigation/JD_40_Scene_Photo_Exhibit_FAX_COPY.pdf", title:"Scene Photo Exhibit — Grayscale Fax Copy", cms:"PD", day:4, desc:"B&W fax of the scene/vehicle photos from prior counsel.", key:"QC FAIL — reject grayscale; obtain the investigator's high-resolution color originals."},
  {id:"JD41", folder:"litigation", file:"litigation/JD_41_Plaintiff_Arbitration_Brief_DRAFT_v3.pdf", title:"Plaintiff's Arbitration Brief — DRAFT v3", cms:"Litigation", day:4, desc:"Liability and injuries drafted; defenses and damages sections incomplete.", key:"Sections III–IV must be completed (prior-injury shield + verified ledger) before the 06/18 5 PM deadline."},
  /* ---------- JORDAN DAVIES ---------- */
  {id:"JDV01", folder:"jordan-davies", file:"jordan-davies/JDV_01_Intake_Summary.pdf", title:"Jordan Davies — Intake Summary", cms:"Case Files", day:5, desc:"Lives with his mother Linda at 2215 Harbor View Dr; brother lives elsewhere; stopped PT; $50,000 bills; 50/50 split.", key:"Residence facts make Jordan a resident relative under his mother's policy."},
  {id:"JDV02", folder:"jordan-davies", file:"jordan-davies/JDV_02_Police_Report.pdf", title:"Jordan Davies — Police Report", cms:"Police", day:5, desc:"Disputed signal, no citations, unnamed bus-driver witness, traffic camera and gas-station CCTV noted.", key:"Evidence to request NOW: City DOT camera, Quick-Fuel CCTV (preservation letter — footage overwrites), transit authority for the Route 9 driver, signal timing charts, 911 audio, vehicle EDR."},
  {id:"JDV03", folder:"jordan-davies", file:"jordan-davies/JDV_03_Dec_Page_State_General_AtFault.pdf", title:"Dec Page — State General Auto (at-fault)", cms:"Others", day:5, desc:"BI $10,000/$20,000.", key:"Tender the $10,000 BI — but get UIM consent first."},
  {id:"JDV04", folder:"jordan-davies", file:"jordan-davies/JDV_04_Dec_Page_Jordan_Coastal_Mutual.pdf", title:"Dec Page — Coastal Mutual (Jordan)", cms:"Others", day:5, desc:"UIM $25,000/$50,000 non-stacked · PIP $10,000 · MedPay $5,000.", key:"Applies — named insured."},
  {id:"JDV05", folder:"jordan-davies", file:"jordan-davies/JDV_05_Dec_Page_Linda_Davies_Allied_Mutual.pdf", title:"Dec Page — Allied Mutual (Linda Davies, mother)", cms:"Others", day:5, desc:"UIM $100,000/$300,000 per vehicle, stacking on 2 vehicles; resident-relative definition.", key:"HIDDEN COVERAGE: Jordan is a resident family member → stacked UIM up to $200,000 per person. Place on notice."},
  {id:"JDV06", folder:"jordan-davies", file:"jordan-davies/JDV_06_Dec_Page_Marcus_Davies_Summit.pdf", title:"Dec Page — Summit Auto (Marcus Davies, brother)", cms:"Others", day:5, desc:"UIM $50,000/$100,000.", key:"TRAP: Marcus lives at a different address — Jordan is NOT a resident of his household. Does not apply."},
  {id:"JDV07", folder:"jordan-davies", file:"jordan-davies/JDV_07_Medical_Billing_Summary_and_PT_Attendance.pdf", title:"Jordan Davies — Billing Summary & PT Attendance", cms:"Bills", day:5, desc:"$50,000 total; PIP exhausted; PT no-shows from 04/13; Dr. Nand orders PT to continue.", key:"Treatment gap forming now — LOP conversation needed."},
  {id:"JDV08", folder:"jordan-davies", file:"jordan-davies/JDV_08_State_General_Liability_Letter.pdf", title:"State General — 50/50 Liability Letter", cms:"Others", day:5, desc:"Assigns 50% fault to Jordan based on the insured's statement only.", key:"No witnesses or citations support it — rebut with objective evidence."},
  /* ---------- TEMPLATES ---------- */
  {id:"TPL1", folder:"templates", file:"templates/Blank_PI_Client_Intake_Form.pdf", title:"Blank Personal Injury Client Intake Form", cms:"Case Files", day:1, desc:"Complete it from the John Doe packet as part of the Intake Decision Challenge.", key:"Trainees should fill every field from documents — and mark unknowns instead of guessing."},
  {id:"TPL2", folder:"templates", file:"templates/LSH_Net_Sheet_v2_FIXED.xlsx", title:"LSH Net Sheet v2 (fee formula fixed) + John Doe practice tab", cms:"Others", day:2, desc:"Original template's attorney-fee cell referenced an empty cell (fee always $0). Fixed; practice tab pre-filled from the bills and PIP log.", key:"v1 bug: L11 = L7*I11 (empty) → fee $0. v2: L11 = L7*C11."},
  {id:"TPL3", folder:"templates", file:"templates/Sample_BI_Release_and_Disbursement_Statement.pdf", title:"Sample BI Release & Settlement Disbursement Statement", cms:"Case Files", day:2, desc:"Blank release with PD scope, non-admission, lien indemnity; blank disbursement statement.", key:""},
  {id:"TPL4", folder:"templates", file:"templates/Sample_UM_Waiver_and_Consent_to_Settle.pdf", title:"Sample UM Waiver of Subrogation & Consent to Settle", cms:"Case Files", day:3, desc:"The 'green light' before any BI release when UM/UIM may be needed.", key:""},
  {id:"TPL5", folder:"templates", file:"templates/Standard_Safe_Settlement_Release_Form.docx", title:"Standard Safe Settlement Release (editable)", cms:"Case Files", day:2, desc:"Proportionate BI-only release — the counter-draft to the defective release.", key:""},
  {id:"TPL6", folder:"templates", file:"templates/Nine_Mock_PI_Cases.pdf", title:"9 Mock Personal Injury Cases", cms:"Others", day:1, desc:"Extra practice files for intake, coverage and liability drills.", key:""}
];

window.CM_HANDOUTS = [
  {day:1, file:"handouts/The_PI_Lifecycle_Case_Manager_s_Roadmap.pdf", title:"The PI Lifecycle — Case Manager's Roadmap"},
  {day:1, file:"handouts/OPERATIONAL_CONFLICT_RESOLUTION_INTAKE_PLANNING_TREATMENT.pdf", title:"Operational Conflict Resolution: Intake, Planning & Treatment"},
  {day:1, file:"handouts/Treatment_Gaps_During_Treatment_Phase.pdf", title:"Handling Treatment Gaps During the Treatment Phase"},
  {day:2, file:"handouts/Case_Manager_Pre_Demand_Reduction_Handout.pdf", title:"Pre-Demand & Reduction File Review Protocols"},
  {day:2, file:"handouts/Advanced_Case_Management_Manual_for_Demand_Phase.pdf", title:"Advanced Case Management Manual — Demand Phase"},
  {day:2, file:"handouts/Treatment_Gaps_in_the_Demand_Phase.pdf", title:"Handling Treatment Gaps in the Demand Phase"},
  {day:2, file:"handouts/Settlement_Negotiations_and_PIP_Physics_Handout.pdf", title:"Settlement Standoffs, PIP Exhaustion Physics & Claims Algorithms"},
  {day:2, file:"handouts/Settlement_release_training_handout_v3.pdf", title:"Settlement Release Agreements: Clause Navigation"},
  {day:2, file:"handouts/Standard_Safe_Settlement_Release_Form.pdf", title:"Standard Safe Settlement Release Form"},
  {day:3, file:"handouts/Case_Manager_Handout_Advanced_UM_Demand_Settlement_Mechanics_V2_.pdf", title:"Advanced UM Demand & Settlement Mechanics (V2)"},
  {day:3, file:"handouts/Case_Manager_MedPay_First-Party_Coordination_Roadmap.docx", title:"MedPay & First-Party Coordination Roadmap (PIP, ERISA, Medicare)"},
  {day:3, file:"handouts/ADVANCED_PROTOCOLS_PACKAGING_AUDITS_SUBROGATION_CUTS_DV_CMS_ANALYTICS.pdf", title:"Advanced Protocols: Packaging Audits, Subrogation Cuts, DV & CMS Analytics"},
  {day:4, file:"handouts/Mediation_Binder_Quality_Control_Checklist.docx", title:"Mediation Binder Quality Control Checklist"},
  {day:4, file:"handouts/Litigation_and_ADR_Case_Management_Training_Handout.pdf", title:"Litigation & ADR Operations Manual"},
  {day:5, file:"handouts/Case_Management_Trainee_Handout-Litigation.pdf", title:"Trainee Handout — Litigation: Advanced Concepts & Troubleshooting"}
];

window.cmDoc = function(id){ return (window.CM_DOCS||[]).find(d=>d.id===id); };
window.cmDocUrl = function(d){ return "documents/" + d.file.split("/").map(encodeURIComponent).join("/"); };
