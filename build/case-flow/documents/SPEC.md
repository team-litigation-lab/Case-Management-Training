# John Doe v. Robert Smith — the case documents (spec)

The document set every Case Flow day works from: `documents/case-flow/<folder>/RS_NN_<Name>.pdf`, built from
`documents/case-flow/html/RSNN.html` by `node build/case-flow/documents/render.cjs` (headless Chromium).
The metadata the program shows (title, folder, CMS category, day, description, trainer key) is
`js/cm-case-flow-docs.js`. The facts are `curriculum/5-day-flow/case-file.md` (sections 1–6); **this spec never
overrides it**. A fact a document needs that is in neither is added to case-file.md §6 first.

## Rules for every document

- **Fictional, simulated, training-only.** No real carrier, provider, court, firm or person. The renderer prints
  the footer on every page: `LSH CASE MANAGEMENT TRAINING — SIMULATED DOCUMENT — FICTIONAL PARTIES — NOT A REAL
  RECORD · John Doe v. Robert Smith · RSNN · page x of y`. Do not repeat it in the body.
- **Real-world look.** Each document looks like what its sender would really produce: a carrier's declarations
  page, a hospital-style clinical note, a court caption, a firm letter on LSH Law Group letterhead, a provider
  ledger. Use the classes in `documents/case-flow/html/doc.css` (letterhead, caption, form grid, ledger table, signature block, stamps).
  Letter size, 1–3 pages (a few, like the visit log or the discovery set, may run longer).
- **Exact facts.** Every name, number, date, claim number, policy number and dollar figure matches case-file.md.
  Dates MM/DD/YYYY in tables and forms; written dates ("February 6, 2026") in letters and pleadings. Money
  `$1,234.56`.
- **Planted discrepancies only where listed.** Each document's *Plant* is deliberate (trainees are taught to
  catch it; the trainer key names it). Anything else inconsistent is a bug. A document with no Plant has none.
- **Never** state the answer to a trainee exercise unless the document would really say it (a provider ledger
  does not know about a duplicate; a carrier's letter argues its own position). No coaching text, no "Case
  Manager check" notes inside documents.
- **No word "blueprint"** anywhere.
- HTML fragment only (no `<html>`/`<head>`): the renderer wraps it with `doc.css`. Inline `style` is fine for
  one-offs. Page breaks: `<div class="page-break"></div>`. Images: none (draw diagrams with HTML/CSS or inline
  SVG; "photos" and video stills are drawn as labelled frames with timestamps).

## Fixed details used across documents

- **Firm:** LSH Law Group, 500 Commerce St, Suite 1200, Riverton · (555) 010-4000 · Lead Counsel Atty. Elijah Thorne ·
  file LSH-2026-MVA-770412. Case Manager signatures read "Case Manager, LSH Law Group" (no personal name).
- **Riverton Spine & Rehab visits** ($185.00 each, one ledger line per visit date):
  02/24, 02/26, 03/02, 03/03, 03/05, 03/09, 03/10, 03/12, 03/16, 03/17, 03/19, 03/23, 03/24, 03/26, 03/31, 04/02 (16);
  missed 04/03, 04/07, 04/09, 04/14 (no charge); 04/21, 04/23, 04/28, 04/30, 05/04, 05/05, 05/07, 05/11, 05/12,
  05/14, 05/19, 05/21, 05/26, 05/28, 06/02, 06/04, 06/05 (17). 33 visits = $6,105.00.
- **Missed shifts (Northgate):** 02/09, 02/10, 02/11, 02/12, 02/13, 03/05, 03/13, 05/15, 05/18/2026 — 9 × 8 h × $22.00 = $1,584.00.
- **Riverton Drug ($312.40):** 02/07 OTC ibuprofen + lidocaine patches $38.60 · 02/20 Rx cyclobenzaprine + naproxen $64.20 ·
  03/05 Rx meloxicam $42.80 · 03/27 Rx gabapentin $58.40 · 04/21 OTC lidocaine patches $29.80 · 05/15 Rx methylprednisolone
  $36.20 · 06/12 Rx gabapentin refill $42.40.
- **PIP (Harbor Point, $5,000.00):** 03/09 Riverton Urgent Care $685.00 · 03/16 Lakeside 03/05 visit $640.00 ·
  03/25 Summit Imaging $2,395.00 · 04/10 Lakeside 03/27 visit $640.00 · 06/26 Lakeside 06/12 visit $640.00 (exhausted).
- **Peach State EOB (Crescent Pain & Spine, DOS 05/15/2026):** billed $3,400.00 · allowed $1,860.00 · paid $1,860.00 (06/03/2026) ·
  contractual adjustment $1,540.00 · member responsibility $0.00.
- **Case costs ($486.75):** Police Report $25.00 (02/18/2026) · medical records and billing $214.75 · certified mail $72.00 ·
  MRI images on disc $25.00 · postage and copies $150.00.

## The documents

Day = the Case Flow day the document opens with (a trainee sees it once that day is open). Folder = the
`documents/case-flow/` subfolder. CMS = the CMS upload category (Medical · Police · Case Files · Invoices ·
Bills · PD · Litigation · Others).

### Intake & retainer (folder `intake`)

**RS01 · New Client Intake Sheet** · Day 1 · CMS Case Files · file `RS_01_New_Client_Intake_Sheet.pdf`
Intake 02/09/2026, taken by the intake specialist. Client identity and contact (case-file §1), DOB 08/14/1991,
lives with his mother Margaret Doe (emergency contact, same address, phone (555) 010-2291). Position: front-seat
passenger in Kevin Alvarez's 2020 Ford Escape (coworker carpool). Employer Northgate Distribution, shift lead,
$22.00/h, started 01/12/2026. Health plan Peach State (member/group). Owns no car; the parked 2019 Civic LX is Margaret's, Bluewater (UM
"rejected? — client unsure"). Collision summary (all-way stop, Smith rolled through, passenger-door impact, Escape
pushed into the parked Civic). Police Report number, injuries reported ("neck stiffness, sore; declined ambulance;
no treatment yet"), carriers as known at intake (Keystone for Smith; Harbor Point for Kevin; Cardinal State for
Margaret — limits unknown). Intake notes: no treatment yet; told to seek care and keep receipts; preserve the
doorbell video (Margaret's camera); Keystone has already called John once.
*Plant:* the Police Report number is written **RPD-26-018824** (transposed; the report is RPD-26-018842).
*Key:* Verify every reference number against its source: the report is RPD-26-018842. Passenger status opens Host
UM and Relative UM. No treatment yet: the 14-day gap is already running (first care 02/20/2026).

**RS02 · Intake Supplement — Prior History & Household** · Day 1 · Case Files · `RS_02_Intake_Supplement_Prior_History.pdf`
Same intake specialist, 02/09/2026. Prior injuries/claims: "Chiropractic 2021 — Birch Avenue Chiropractic, 3
visits, **neck and back** stiffness, resolved." No prior claims, no prior counsel, no workers' comp. Household:
lives with mother (resident relative); Margaret's car insured with Cardinal State. No vehicle of his own; Margaret's Civic and its Bluewater policy;
"client believes he signed something about UM in 2024". Employment history. Social media: told to stop posting.
*Plant:* the 2021 care is recorded as **neck and back**; the 2021 records (RS20) show **low back only**, no neck.
*Key:* The 2021 visits were low back only (RS20). A "prior neck" note in our own file is exactly what defense counsel
would use (causation, deposition). Correct it in the CMS with a note citing RS20.

**RS03 · LSH CMS Intake Record (editable)** · Day 1 · Case Files · `RS_03_LSH_CMS_Intake_Record.docx`
The intake as keyed into the CMS (the editable export the trainee corrects): matter, client identity, contact,
employment, incident narrative, parties, vehicles, insurance, health plan, emergency contact, flags.
*Plants:* (1) client role **"Driver"** (he was the front-seat passenger: this is what opens Host UM and Relative UM);
(2) DOB **08/14/1990** (it is 08/14/1991).
*Key:* Role must be Passenger — listed as a driver, the file points at the wrong coverage (he owns no car; Margaret's Bluewater policy has no UM).
DOB is 08/14/1991 (driver's license copy and RS01). Every downstream letter (LORs, HIPAA requests) inherits these.

**RS04 · Master Case Summary — Attorney Only** · Day 1 · Case Files · `RS_04_Master_Case_Summary_ATTORNEY_ONLY.pdf`
Atty. Thorne's internal summary (02/10/2026): liability (stop-sign citation, witness, doorbell video), coverage
stack and order of operations (UM opens only after BI is exhausted; consent before any BI release), passenger-status
analysis, health plan reimbursement, the treatment-gap risk, SOL 02/06/2028 (Sunday — internal hard date
02/04/2028, internal filing cutoff 11/05/2027), case plan priorities. Marked "PRIVILEGED & CONFIDENTIAL — ATTORNEY
WORK PRODUCT — DO NOT PRODUCE".
*Plant:* none. *Key:* Internal work product: never in a demand package, mediation binder or arbitration exhibit set.

**RS05 · Contingency Fee Agreement** · Day 1 · Case Files · `RS_05_Retainer_Agreement.pdf`
LSH Law Group and John Doe, executed 02/09/2026, re the 02/06/2026 collision. Fee 33⅓% of gross recovery before
suit; 40% of gross recovery once a lawsuit is filed. Costs reimbursed from the client's share after the fee
(fee on gross). Client duties (no direct contact with carriers, keep appointments, keep us informed of address and
phone changes — a missed-contact / withdrawal clause after documented attempts), settlement authority stays with the
client, lien payment authority. Signatures.
*Plant:* none. *Key:* Fee tier turns on whether suit is filed (Track A 33⅓%; Track B 40%). Fee is on gross; costs
come from the client's share after the fee — the net sheet follows this.

**RS06 · HIPAA Authorization (claim-specific)** · Day 1 · Case Files · `RS_06_HIPAA_Authorization.pdf`
Authorization to release PHI to LSH Law Group, naming the 02/06/2026 motor vehicle collision, all providers,
purpose (legal claim), signed and dated 02/09/2026, witness. Expiration field: **02/06/2027**.
*Plant:* expires 02/06/2027 — before Track B's 2027 records runs (Crescent records 05/2027, Riverton ledger 02/2027).
*Key:* Calendar a renewal before 02/06/2027; a records request on an expired authorization is rejected.

**RS40 · Peach State — Notice of Reimbursement Rights** · Day 1 · Others · `RS_40_Peach_State_Notice_of_Reimbursement_Rights.pdf`
(folder `liens`) Dion Carver, Subrogation & Recovery Unit, 02/27/2026, to LSH Law Group (after the firm's notice):
the plan has paid and may pay accident-related claims; asserts its reimbursement right from any recovery; asks for
the carriers, the attorney, accident details; asks to be notified before any settlement; encloses a questionnaire.
States the plan is a **fully insured group health plan issued to Northgate Distribution**.
*Plant:* none. *Key:* Flag the lien on Day 1; fully insured (not self-funded ERISA) means state law governs reduction —
Atty. Thorne's call. Paid-to-date will be itemized later (RS41).

### Police, witness, video (folder `police`)

**RS07 · Riverton PD Traffic Crash Report RPD-26-018842** · Day 1 · Police · `RS_07_Police_Report_RPD-26-018842.pdf`
Officer Thomas Garner #2217, 02/06/2026, ~07:10, Maple Hollow Rd & Birch Ave (all-way stop). Unit 1: Robert Smith,
118 Larkspur Ln, Riverton, 2017 Chevrolet Silverado, Keystone Mutual KMI-PA-7731045, northbound Birch Ave. Unit 2:
Kevin Alvarez, 2020 Ford Escape, Harbor Point HPA-4402917, eastbound Maple Hollow, stopped then proceeded. Unit 3:
parked 2019 Honda Civic (John Doe, Bluewater BWA-209-66184). Occupants: John Doe, Unit 2 front-right passenger,
restraint "lap/shoulder belt used", injury code "C – possible injury, complaint of neck pain", EMS refused.
Narrative: Unit 1 failed to stop, struck Unit 2's front passenger door, pushed Unit 2 into parked Unit 3. Diagram
(CSS/SVG). Citation: Smith, failure to stop at stop sign. Witness: Ruth Calloway, 2209 Maple Hollow Rd. Doorbell
camera noted at 2214 Maple Hollow Rd.
*Plant:* Unit 2 year listed as **2021** Ford Escape (Harbor Point's declarations page: 2020).
*Key:* Liability anchor (citation + independent witness + video). Reconcile the Escape's year to the declarations
page (2020). Smith's address (118 Larkspur Ln) goes stale — Day 5 skip-trace.

**RS08 · Witness Statement — Ruth Calloway** · Day 1 · Police · `RS_08_Witness_Statement_Ruth_Calloway.pdf`
Riverton PD voluntary statement form, 02/06/2026, 07:40, taken by Officer Garner: she was walking her dog at the
corner; the small SUV stopped fully and went; the pickup "didn't even slow down" and hit the SUV's passenger side;
the SUV slid into the parked car. Signed. Contact phone.
*Plant:* none. *Key:* Independent witness: the strongest answer to Smith's later comparative-negligence defense (the
Escape "entered out of turn"). Get a signed follow-up statement before memories fade.

**RS09 · Doorbell Video — Preservation & Chain of Custody** · Day 1 · Police · `RS_09_Doorbell_Video_Preservation_Log.pdf`
LSH Law Group evidence log: 02/17/2026 preservation instruction to John (call note); 02/19/2026 copy secured by
Margaret Doe to USB, delivered to the firm; file name, length (clip 07:09:41–07:10:26), SHA-256 hash, storage
location; four still frames drawn as labelled boxes with timestamps (Escape stopped at the line 07:10:02; Escape
proceeding 07:10:05; Silverado entering without stopping 07:10:06; impact 07:10:07). An "export for binder" line:
"stills exported 02/20/2026 (grayscale, 150 dpi) for the file".
*Plant:* the stills on file are **grayscale exports**.
*Key:* Chain of custody is what makes the video admissible. The grayscale stills fail binder QC — re-export in color
from the original file (hash unchanged) before any binder or exhibit set.

**RS10 · Event Data Recorder Download — 2020 Ford Escape** · Day 5 · Police · `RS_10_EDR_Download_Report.pdf`
Crash data retrieval report (download 10/2026, by an accident reconstruction tech for LSH under a preservation
agreement with Harbor Point/Kevin Alvarez): event 02/06/2026, pre-crash 5 s table (speed, brake, throttle),
speed at impact **11 mph**, front-passenger belt **BUCKLED**, driver belt buckled, airbag deployment status.
*Plant:* none. *Key:* Rebuts the Answer's "unbelted" and supports the stop-then-go account. Foundation: who downloaded
it, when, chain of custody — needed for Exhibit A of the counter-package.

**RS11 · Riverton Fire EMS Run Report** · Day 1 · Medical · `RS_11_EMS_Run_Report.pdf` (folder `medical`)
Medic 7, run RF-26-0206-114, 02/06/2026, dispatched 07:12, on scene 07:18, paramedic J. Ortiz. Patient John Doe,
"restrained front-seat passenger, complains of neck stiffness, declined transport". Vitals, assessment (no LOC, GCS
15, neck pain 3/10, no midline tenderness on palpation documented). Refusal of transport signed 07:31, risks
explained.
*Plant:* none. *Key:* A neck complaint on the date of loss: the anchor for the 14-day gap — the injury was reported at
the scene. Restrained (rebuts "unbelted").

### Medical records (folder `medical`)

**RS12 · Riverton Urgent Care — Visit Note (02/20/2026)** · Day 1 · Medical · `RS_12_Urgent_Care_Note.pdf`
Nina Patel, PA-C. HPI exactly: "onset at MVA 02/06/2026, progressively worsening; numbness to right hand since
02/18." Exam, assessment (cervical strain, r/o cervical radiculopathy), plan (cyclobenzaprine + naproxen Rx, refer
orthopedics, recommend chiropractic/PT), payer: Harbor Point PIP (claim HP-26-7741).
*Plant:* none. *Key:* First treatment: 14 days after the DOL. The history ties onset to the collision.

**RS13 · Riverton Spine & Rehab — Initial Evaluation & LOP** · Day 2 · Medical · `RS_13_Spine_Rehab_Initial_Eval_and_LOP.pdf`
Dr. Mark Ellison, DC and Sara Lin, DPT, 02/24/2026. History (collision, urgent care), past history ("2021 chiropractic
care for low-back stiffness, 3 visits, resolved; no prior neck complaints"), exam, plan (chiro + PT 2–3×/week, 12
weeks). Page 2: Letter of Protection signed 02/23/2026 by Atty. Elijah Thorne for LSH Law Group (provider to be paid
from recovery; patient remains responsible; acknowledgment by Tammy Greer, office manager).
*Plant:* none. *Key:* Out of network for Peach State — the LOP is why. The provider's own history says the 2021 care
was low back (contrast RS02).

**RS14 · Riverton Spine & Rehab — Visit Notes & Attendance Log** · Day 1 · Medical · `RS_14_Spine_Rehab_Visit_Notes_and_Attendance.pdf`
Attendance log with every visit date (spec list) and short SOAP lines (pain scores trending down, ROM improving),
the missed visits 04/03, 04/07, 04/09, 04/14 marked "No show — transportation" / "No show", the missed-visit alert
sent to LSH Law Group 04/08/2026, return 04/21/2026 (evening slot), discharge 06/05/2026 (plateau, home program).
*Plant:* none. *Key:* 33 attended visits. The 19-day disruption (04/02 → 04/21) is documented with its cause
(transportation) — the A-C-T record answers "failure to mitigate".

**RS15 · Lakeside Orthopedics — Consult & Follow-up** · Day 2 · Medical · `RS_15_Lakeside_Orthopedics_Consult_and_Followup.pdf`
Dr. Alana Reyes, MD. 03/05/2026 consult (history, exam: right C6 dermatomal paresthesia, Spurling positive right;
plan cervical MRI). 03/27/2026 follow-up (MRI reviewed: C5-C6 right paracentral herniation; refer to pain
management for ESI).
*Plant:* none. *Key:* Specialist confirmation of radiculopathy; the MRI order and the referral to Crescent.

**RS16 · Summit Imaging Center — Cervical MRI Report (03/13/2026)** · Day 2 · Medical · `RS_16_MRI_Cervical_Report.pdf`
Radiologist Dr. Helen Park, MD; referring Dr. Alana Reyes. Clinical history line: "MVA, **date of injury
02/16/2026**, neck pain with right arm numbness." Findings: C5-C6 right paracentral disc herniation with mild right
foraminal narrowing; other levels; Impression including exactly "no significant degenerative change at the adjacent
levels".
*Plant:* the history line's date of injury reads **02/16/2026** (the DOL is 02/06/2026).
*Key:* The impression is the answer to "degenerative" (Day 3, Day 5) — quote it exactly. Request a corrected history
addendum from Summit: an adjuster will use a wrong injury date against causation.

**RS17 · Crescent Pain & Spine — Cervical ESI Procedure Note (05/15/2026)** · Day 2 · Medical · `RS_17_Crescent_ESI_Procedure_Note.pdf`
Dr. Omar Haddad, MD. Pre-procedure diagnosis, consent, fluoroscopic right C5-C6 (or C6-C7 interlaminar approach —
pick one and keep it), medication, tolerance, post-procedure plan; payer Peach State (in network).
*Plant:* none. *Key:* Paid by Peach State at contract rate — this is the $1,860.00 lien (RS26, RS41).

**RS18 · Lakeside Orthopedics — MMI Note (06/12/2026)** · Day 2 · Medical · `RS_18_Lakeside_MMI_Note.pdf`
Dr. Alana Reyes: MMI declared; residual intermittent right-arm paresthesia; future care: possibly 1–2 repeat ESIs
within 24 months at $3,400 each.
*Plant:* none. *Key:* MMI = the demand clock. Future medical $3,400–$6,800 is narrative, not specials.

**RS19 · Dr. Alana Reyes — Causation Letter (06/19/2026)** · Day 2 · Medical · `RS_19_Reyes_Causation_Letter.pdf`
To Atty. Thorne. Records reviewed; opinion to a reasonable degree of medical probability: delayed presentation is
clinically consistent with a disc injury whose radicular symptoms evolve over days to weeks; the C5-C6 herniation
was more likely than not caused by the 02/06/2026 collision; the 2021 low-back care is unrelated.
*Plant:* none. *Key:* The causation answer to the gap and to the 2021 visits; the centrepiece of the gap explanation
record and the rebuttal.

**RS20 · Prior Records — Birch Avenue Chiropractic (2021)** · Day 2 · Medical · `RS_20_Prior_Records_Birch_Ave_Chiropractic_2021.pdf`
Dr. Lena Ford, DC. Three visits 05/04, 05/11, 05/18/2021: low-back stiffness after moving furniture; lumbar only;
cervical exam normal; resolved; released to full activity.
*Plant:* none. *Key:* Low back only — no prior neck. Corrects RS02.

**RS21 · Riverton Drug — Pharmacy Receipts & Rx History** · Day 2 · Medical · `RS_21_Pharmacy_Receipts.pdf`
The receipts (spec list) and a printed Rx history; total $312.40.
*Plant:* none. *Key:* The 02/07 OTC receipt corroborates symptoms the day after the collision (gap reason 2).

### Bills & invoices (folder `bills`)

**RS22 · Riverton Urgent Care — Statement** · Day 2 · Bills · `RS_22_Urgent_Care_Statement.pdf`
DOS 02/20/2026, $685.00, paid by Harbor Point PIP 03/09/2026, balance $0.00.

**RS23 · Riverton Spine & Rehab — Itemized LOP Ledger** · Day 2 · Bills · `RS_23_Spine_Rehab_Itemized_LOP_Ledger.pdf`
Tammy Greer, office manager, statement date 06/30/2026: one line per visit date at $185.00, **34 lines**, total
**$6,290.00**, payments $0.00, balance $6,290.00, "Account under Letter of Protection — LSH Law Group".
*Plant:* **05/04/2026 appears twice** (one visit billed on two lines).
*Key:* 33 visits match the attendance log (RS14); the second 05/04 line is a duplicate. Audited balance $6,105.00.

**RS24 · Lakeside Orthopedics — Statement** · Day 2 · Bills · `RS_24_Lakeside_Orthopedics_Statement.pdf`
Three visits 03/05, 03/27, 06/12/2026 at $640.00 = $1,920.00; PIP payments 03/16, 04/10, 06/26/2026; balance $0.00.

**RS25 · Summit Imaging Center — Invoice** · Day 2 · Invoices · `RS_25_Summit_Imaging_Invoice.pdf`
Cervical MRI without contrast 03/13/2026, $2,395.00 (technical + professional), paid by PIP 03/25/2026, $0.00.
Note: "LOP requested 03/11/2026 — not required (PIP coverage confirmed)".

**RS26 · Crescent Pain & Spine — Bill, Peach State EOB & Patient Statement** · Day 2 · Bills · `RS_26_Crescent_Bill_EOB_and_Statement.pdf`
Page 1: claim to Peach State, DOS 05/15/2026, $3,400.00. Page 2: Peach State EOB (spec figures). Page 3: a Crescent
patient statement mailed to John 07/01/2026 showing **"Balance due: $1,540.00"**.
*Plant:* the patient statement bills John the $1,540.00 contractual adjustment.
*Key:* In network: the provider agreed to the contract rate and cannot balance-bill the member. Crescent is paid in
full ($1,860.00 by Peach State); the only claim is Peach State's $1,860.00 reimbursement. Ask Crescent for a
corrected $0.00 statement; never list Crescent as an open balance.

### Insurance & negotiation (folder `insurance`)

**RS27 · Keystone Mutual — Declarations Page (Robert Smith)** · Day 2 · Others · `RS_27_Dec_Page_Keystone_Mutual_BI.pdf`
Policy KMI-PA-7731045, named insured Robert Smith, 118 Larkspur Ln, 2017 Chevrolet Silverado; BI $10,000 /
$20,000; PD $25,000; no UM; policy period covering 02/06/2026. Cover letter from Dana Whitfield dated 03/20/2026
("enclosed as requested, with the authorizations received").
*Key:* BI $10,000 per person confirmed 03/20/2026 — the first layer. PD $25,000 is outside the stack.

**RS28 · Harbor Point Insurance — Declarations, Coverage Letter & Arbitration Clause** · Day 2 · Others · `RS_28_Harbor_Point_Dec_Page_and_Coverage_Letter.pdf`
Dec page HPA-4402917 (Kevin Alvarez, 2020 Ford Escape; UM $20,000/$40,000 add-on/excess; PIP $5,000). Marcus
Bell's coverage letter 03/02/2026: John covered as an occupant; no reimbursement right on PIP; UM add-on, not
reduced by BI; no PIP non-duplication reduction. Policy excerpt: UM arbitration clause (either party may demand
arbitration of damages disputes) and the consent-to-settle condition.
*Key:* Second layer. Consent before any BI settlement; the arbitration clause drives Track B's forum (RS57).

**RS29 · Cardinal State Mutual — Declarations, Assignment & Coverage Letter** · Day 2 · Others · `RS_29_Cardinal_State_Dec_Page_and_Coverage_Letter.pdf`
Dec page CSM-AU-5580213 (Margaret Doe, 2018 Toyota Camry; UM $10,000/$20,000); 03/03/2026 letter assigning Teresa
Okafor; 03/09/2026 coverage letter: John covered as a resident relative occupying a non-owned vehicle; exclusion
excerpt (a vehicle owned by the insured or a resident relative and not insured under this policy).
*Key:* Third layer, excess over Host UM. He reaches it as Margaret's resident relative occupying a non-owned vehicle.

**RS30 · Bluewater Auto — Declarations & UM Rejection** · Day 2 · Others · `RS_30_Bluewater_Dec_Page_and_UM_Rejection.pdf`
Dec page BWA-209-66184 (John Doe, 2019 Honda Civic LX; liability 25/50/25; collision $500 ded.; UM/UIM: REJECTED);
signed UM/UIM selection/rejection form 03/14/2024.
*Key:* Margaret's policy on the Civic: UM rejected in writing, so it adds no UM layer for John. Her collision coverage is a route for her own PD claim, not his.

**RS31 · Harbor Point — First-Party Medical Benefits Payment Ledger (PIP & MedPay)** · Day 2 · Others · `RS_31_Harbor_Point_PIP_Ledger.pdf`
Part B PIP: the five payments (spec list) at 100% of the billed medical, running balance to $0.00, "PIP limit exhausted 06/26/2026". MedPay ($1,500.00 limit): one check (03/20/2026) for Riverton Spine & Rehab's first eight visits, 02/24–03/12/2026, $185.00 each = $1,480.00, "MedPay limit exhausted 03/16/2026" — $20.00 left, less than the $185.00 charge for the 03/16/2026 visit. Then a lost-income section: the 80% wage benefit ($1,267.20 on $1,584.00) not payable, limit exhausted before Northgate's 06/30/2026 letter.
*Key:* Payer order in action; the Crescent bill went to Peach State, not PIP or MedPay (both first-party limits were gone by 05/15/2026). MedPay's $1,480.00 comes off the LOP account: Riverton audits to $6,105.00 and $4,625.00 is owed.

**RS32 · Keystone Mutual — Claim Correspondence (Feb–Apr 2026)** · Day 2 · Others · `RS_32_Keystone_Claim_Correspondence.pdf`
02/17/2026 Leah Moran: PD liability accepted; 02/18 rental authorized at Rivergate Rentals, $42.00/day, max 30 days;
02/24 Dana Whitfield: BI acknowledgment; the $10,000 limit given on the set-up call will be confirmed in writing (declarations page) only on a written request with signed authorizations;
03/16 Leah Moran: rental ends 03/19 (30 days); 04/10 Leah Moran: extension refused ("shop delay is not covered").
*Key:* The rental cutoff starts the disruption (A-C-T). The limits request is how the BI layer was verified.

**RS33 · BI Time-Limited Demand — DRAFT for audit** · Day 3 · Others · `RS_33_BI_Time_Limited_Demand_DRAFT.pdf`
The demand specialist's draft (dated 07/20/2026) to Dana Whitfield, KM-26-440871, by certified mail and email:
liability, injuries and treatment, the gap addressed up front (EMS report, causation letter), specials table
(medical $14,817.40 audited by line, wages $1,584.00), the offer to settle for the $10,000 limits. Marked "DRAFT —
for Case Manager audit before Atty. Thorne signs".
*Plants:* (1) acceptance deadline "**30 days from the date of this letter (08/19/2026)**" — the window runs 30 days
from **receipt** (07/22 → 08/21/2026); (2) release term "**a full and final release of all claims**" — must be a
limited release of Robert Smith and Keystone only; (3) the specials total reads **$16,410.40** (the lines add to
$16,401.40); (4) Smith's **affidavit of no other insurance is missing** from the conditions.
*Key:* All four must be fixed before signature; a general release in our own demand would release the UM claims.

**RS34 · BI Demand — Proof of Delivery** · Day 3 · Others · `RS_34_BI_Demand_Proof_of_Delivery.pdf`
USPS certified mail receipt (mailed 07/20/2026) and return receipt (green card) signed by Keystone's mail room
07/22/2026; email delivery confirmation 07/20/2026.
*Key:* Receipt 07/22/2026 starts the 30-day window → 08/21/2026. Proof of delivery is what makes the deadline real.

**RS35 · Keystone Mutual — Offer Letter (08/05/2026)** · Day 3 · Others · `RS_35_Keystone_Offer_Letter.pdf`
Dana Whitfield: $3,500 to resolve the BI claim; reasons: "your client waited two weeks to seek any treatment" and
"the MRI findings are degenerative in nature"; asks for the remaining records.
*Key:* The adjuster's own words for the offer log. Answer with the MRI impression (RS16), the causation letter (RS19),
the EMS report (RS11) and the gap record — no counter without Atty. Thorne's authority.

**RS36 · Track A — Smith Affidavit & Keystone Tender** · Day 3 · Others · `RS_36_Smith_Affidavit_and_Keystone_Tender.pdf`
Robert Smith's affidavit of no other insurance (notarized 08/10/2026: no other policy, not in the course of
employment, no umbrella). Keystone tender letter 08/12/2026: tenders the $10,000 BI limits on receipt of a signed
release; check to follow.
*Key:* Track A only. BI exhausted by tender — the UM consents (RS38) must come before any release is signed.

**RS37 · Keystone Mutual — Draft Release (08/14/2026)** · Day 3 · Case Files · `RS_37_Keystone_Draft_Release.pdf`
"Release of All Claims" for $10,000: releases Robert Smith, Keystone Mutual "**and all other persons, firms,
corporations and insurers**" from all claims arising from the 02/06/2026 collision; confidentiality; hold-harmless
and lien indemnity by the claimant; signature lines.
*Plant:* the release language reaches "all other ... insurers" (Harbor Point and Cardinal State).
*Key:* Signing this releases the UM claims. Redline to a limited release of Robert Smith and Keystone only, preserving
all UM/UIM claims, and route to Atty. Thorne before the client sees it. Revised limited release signed 08/28/2026.

**RS38 · UM Consents to Settle** · Day 3 · Others · `RS_38_UM_Consents_to_Settle.pdf`
Harbor Point 08/24/2026 (Marcus Bell) and Cardinal State 08/26/2026 (Teresa Okafor): consent to the $10,000 BI
settlement with Robert Smith/Keystone, waiver of subrogation against Smith, no substitution of their own check.
*Key:* The green light for the limited BI release.

**RS39 · UM Correspondence — Offers & Tenders** · Day 3 · Others · `RS_39_UM_Offers_and_Tenders.pdf`
Harbor Point: 09/14/2026 offer $8,000 ("the gap"; "BI already compensated him"); 09/29/2026 payment of the $20,000
limits. Cardinal State: 10/01/2026 offer $6,000; 10/06/2026 tender of the $10,000 limits.
*Key:* "BI already compensated him" is wrong on an add-on UM (RS28). Gross recovery $40,000.00.

### Liens (folder `liens`) — RS40 is listed under Day 1 above

**RS41 · Peach State — Lien Itemization & Reduction Acceptance** · Day 3 · Others · `RS_41_Peach_State_Lien_and_Acceptance.pdf`
Itemization (one claim: Crescent Pain & Spine, DOS 05/15/2026, paid $1,860.00); reimbursement claim $1,860.00;
plan language excerpt (fully insured group policy). Page 2: 10/09/2026 letter accepting **$1,240.00** in full
satisfaction (a one-third procurement-cost reduction), payment instructions.
*Key:* Accepted in writing at $1,240.00 — only a written acceptance goes on the net sheet.

**RS42 · Riverton Spine & Rehab — LOP Payoff Letter** · Day 3 · Others · `RS_42_Spine_Rehab_Payoff_Letter.pdf`
Tammy Greer, 10/12/2026: accepts **$3,470.00** in full satisfaction of the LOP account (audited balance $6,105.00);
release of lien on payment; payment instructions.
*Key:* $6,290.00 billed → $6,105.00 audited (duplicate removed) → $3,470.00 accepted.

### Settlement & wages (folder `settlement`)

**RS43 · Northgate Distribution — Wage & Attendance Verification** · Day 2 · Others · `RS_43_Northgate_Wage_and_Attendance_Letter.pdf`
Angela Ruiz, HR manager, 06/30/2026: employment since 01/12/2026, shift lead, $22.00/h, 8-hour shifts; the nine
missed shifts (spec list) with reason codes (02/09–02/13 "called out — neck pain"; 03/05, 03/13, 05/15, 05/18
"medical appointment"); 72 hours = $1,584.00 unpaid; health plan Peach State effective 02/01/2026.
*Key:* Lost wages $1,584.00; the 02/09–02/13 call-outs corroborate the gap (symptoms before first treatment).

**RS44 · LSH Law Group — Case Cost Ledger** · Day 3 · Case Files · `RS_44_Case_Cost_Ledger.pdf`
Costs advanced through settlement (spec list) = $486.75, each with date, payee and receipt reference.
*Key:* $486.75 on the net sheet; costs come from the client's share after the fee (RS05).

### Property damage (folder `property`)

**RS45 · Riverton Collision Center — Estimate, Supplement & Tow/Storage** · Day 2 · PD · `RS_45_Repair_Estimate_Supplement_and_Tow.pdf`
Estimate 02/16/2026 $6,940.00 (estimator Paul Diaz; line items); teardown supplement 03/02/2026 $2,315.00 (A-pillar,
structural); total $9,255.00; parts backorder note; repair completed 04/24/2026; paid by Keystone 04/24/2026.
Riverton Towing invoice: tow $185.00 + 6 days storage at $45.00 = $455.00 (paid by Keystone).

**RS46 · Keystone Mutual — Vehicle Valuation & Rental Ledger** · Day 2 · PD · `RS_46_Keystone_Valuation_and_Rental_Ledger.pdf`
Valuation report: 2019 Honda Civic LX, 52,300 miles, ACV $17,600.00; total-loss threshold 75% ($13,200.00);
repair $9,255.00 = 52.6% → repairable. Rental ledger: Rivergate Rentals 02/18–03/19/2026, 30 days × $42.00 =
$1,260.00 paid.
*Key:* Repairable (52.6%). Loss of use runs for the days without a car and without a paid rental: 02/06–02/17 and
03/20–04/24 = 48 days × $42.00 = $2,016.00.

**RS47 · Riverton Auto Appraisal — Diminished Value Report** · Day 5 · PD · `RS_47_Diminished_Value_Appraisal.pdf`
Carl Benning, 05/06/2026: pre-loss value, structural repair (A-pillar) disclosure on history reports, comparable
market data, diminished value **$3,600.00**; appraiser's qualifications.
*Key:* The independent number against Keystone's 17c (RS48).

**RS48 · Keystone PD — Final Offer & Release (12/10/2026)** · Day 5 · PD · `RS_48_Keystone_PD_Final_Offer_and_Release.pdf`
Leah Moran: diminished value $792.00 by the "17c" formula (10% of $17,600.00 = $1,760.00 × damage 0.75 × mileage
0.60), loss of use $0 ("rental provided"), "final"; enclosed release of "**all claims arising from the 02/06/2026
accident**" for John's signature.
*Plant:* the PD release reaches **all claims** from the accident — it would release the bodily-injury claim in suit.
*Key:* Never let John sign a PD release that isn't limited to property damage. 17c caps at 10% and multiplies it down;
the appraisal is $3,600.00. Route to Atty. Thorne with a recommendation.

### Litigation & ADR — Track B (folder `litigation`)

**RS49 · Keystone — Impasse Correspondence (Aug–Sep 2026)** · Day 4 · Litigation · `RS_49_Keystone_Impasse_Correspondence.pdf`
08/06 LSH rebuttal (cover letter listing the enclosures: MRI report, causation letter, EMS report, gap explanation
record); 08/12 Dana Whitfield email: "$3,500 is our final offer"; 08/24 and 08/31 LSH follow-ups asking for a
response and the evidence relied on (no reply); 09/02 escalation letter to Greg Holloway, claims supervisor (no reply).
*Key:* The impasse record: every attempt dated, every silence documented. The demand lapsed 08/21/2026.

**RS50 · Complaint — Pre-Filing Draft (superseded)** · Day 4 · Litigation · `RS_50_Complaint_PRE-FILING_DRAFT.pdf`
An earlier draft: no case number, "DRAFT 09/15/2026", unsigned, damages paragraph omits property damage.
*Plant:* it is a superseded draft. *Key:* Never in a binder or exhibit set — use the filed complaint (RS51).

**RS51 · Complaint (filed 09/24/2026)** · Day 4 · Litigation · `RS_51_Complaint_Filed.pdf`
State Court of Riverton County, *John Doe v. Robert Smith*, Civil Action No. 26-CV-04417; filed stamp 09/24/2026;
negligence (failure to stop), damages: medical specials, lost wages, future medical, pain and suffering, property
damage (loss of use and diminished value); jury demand; signed by Atty. Elijah Thorne.

**RS52 · Service of Process — Non-Service, Skip-Trace & Affidavit of Service** · Day 5 · Litigation · `RS_52_Service_Skip_Trace_and_Affidavit.pdf`
Allied Process Services (Miguel Santos): non-service reports 10/01, 10/05, 10/08/2026 at 118 Larkspur Ln (neighbor:
moved in August). TraceLine Investigations skip-trace report 10/09/2026: 118 Larkspur Ln (utilities closed 08/2026),
**4410 Quarry Ridge Ct, Millbrook** (utility opened 08/2026; matches vehicle registration), a 2019 address. Affidavit
of personal service 10/14/2026, filed 10/16/2026.
*Key:* Answer due 11/13/2026 (30 days from service — as configured for this training file; confirm the court's rules).

**RS53 · Answer & Affirmative Defenses (11/12/2026)** · Day 5 · Litigation · `RS_53_Answer_and_Affirmative_Defenses.pdf`
Atty. Grant Mercer, Mercer & Hale LLP: denials; affirmative defenses: comparative negligence (the Escape entered the
all-way stop out of turn; plaintiff was not wearing a seatbelt), causation (delayed treatment; degenerative findings),
failure to mitigate (missed treatment), plus standard reservations.
*Key:* Every defense here needs a counter with foundation (RS08, RS09, RS10, RS11, RS14, RS16, RS19).

**RS54 · Defendant's First Discovery Requests (12/01/2026)** · Day 4 · Litigation · `RS_54_Defendants_First_Discovery_Requests.pdf`
Interrogatories (25), Requests for Production (30) and Requests for Admission (15), served by U.S. mail on Atty.
Thorne 12/01/2026, with certificate of service. Include all 25 / 30 / 15 (short realistic items: prior injuries,
the 2021 care, social media, employment, the gap, seatbelt, PD documents...). Cover letter from Mercer's paralegal.
*Plant:* the cover letter says "**responses are due December 31, 2026**".
*Key:* Served by mail: 30 days + 3 = 01/03/2027, a Sunday → due 01/04/2027 (as configured for this training file;
confirm the rules). Unanswered RFAs may be deemed admitted.

**RS55 · Scheduling Order (12/10/2026)** · Day 4 · Litigation · `RS_55_Scheduling_Order.pdf`
The court's order: plaintiff's expert disclosure 03/15/2027; defense expert disclosure 04/15/2027; mediation
completed by 03/31/2027; discovery closes 05/28/2027; pretrial conference 08/12/2027; trial calendar 09/13/2027.
Signed by the judge (fictional name).

**RS56 · Notice of Videoconference Deposition — John Doe** · Day 5 · Litigation · `RS_56_Notice_of_Deposition_John_Doe.pdf`
Served 01/20/2027 by Atty. Mercer: deposition 02/18/2027, 10:00 a.m., by videoconference, Riverton Court Reporting;
link to follow; documents to bring.

**RS57 · Mediation — Order & Mediator's Confirmation** · Day 4 · Litigation · `RS_57_Mediation_Order_and_Confirmation.pdf`
Order referring the case to mediation (complete by 03/31/2027). Hon. Carla Benton (Ret.) confirmation: session
03/18/2027, 9:30 a.m.; confidential mediation statement and binder due **03/11/2027**; party representatives with
full authority to attend.

**RS58 · UM Arbitration — Demand, Joinder & Notice of Hearing** · Day 4 · Litigation · `RS_58_UM_Arbitration_Notice_of_Hearing.pdf`
04/05/2027 Harbor Point demand for arbitration under the policy clause (damages dispute, citing the gap); Cardinal
State joinder (consolidated, binding); arbitrator Laura Whitcomb, Esq.: notice of hearing **06/22/2027 (Tue)**, exhibit
exchange 20 days before (06/02/2027), arbitration brief "due **June 12, 2027**".
*Plant:* the brief date falls on a **Saturday**.
*Key:* 10 days before 06/22 is 06/12, a Saturday: counting backward, docket the earlier business day, 06/11/2027 (as
configured for this training file; confirm the forum's rules).

**RS59 · Mediated Settlement Term Sheet (03/18/2027)** · Day 4 · Litigation · `RS_59_Mediated_Settlement_Term_Sheet.pdf`
Signed at mediation: Keystone pays its $10,000 BI limits; limited release of Robert Smith and Keystone only,
expressly preserving all UM/UIM claims; dismissal of the bodily-injury claims against Robert Smith with prejudice on
payment, the property-damage claims (loss of use, diminished value; KM-26-440871-PD) expressly excluded and not
released; UM consents attached.
*Key:* BI exhausted on Track B — Host UM and Relative UM open (and go to arbitration).

**RS60 · Certificate of Service — Plaintiff's Discovery Responses (01/04/2027)** · Day 5 · Litigation · `RS_60_Certificate_of_Service_Discovery_Responses.pdf`
Atty. Thorne's certificate: John Doe's verified answers to interrogatories, responses to requests for production and
responses to requests for admission served by U.S. mail on Atty. Grant Mercer 01/04/2027.
*Key:* Proves the RFA responses were timely (due 01/04/2027).

**RS65 · Harbor Point — PIP Application & Claim Acknowledgement** · Day 2 · Others · `RS_65_Harbor_Point_PIP_Application.pdf`
John Doe's PIP application, signed 02/17/2026 and sent with the Harbor Point LOR (passenger in Kevin Alvarez's 2020 Ford Escape; household policies: Margaret Doe's Bluewater and Cardinal State, PIP rejected in writing), and Harbor Point's 02/24/2026 acknowledgement: PIP opened under HPA-4402917, $5,000 each person, 100% medical / 80% lost income, bills to be sent with the claim number; wage loss needs an employer verification.
*Key:* Whose PIP: the vehicle he rode in, because no household policy carries PIP. Riverton's add-on rule: no BI or UM set-off, no reimbursement from the recovery.

### The audited sets and their finished counterparts

Three Skill Activities audit a draft set and are then shown the finished one: the Demand Package's exhibit
packet (RS66 → RS67), the Litigation Desk's draft Mediation Binder (RS62 → RS69) and its draft Arbitration
Binder index (RS63 → RS70). The drafts carry the plants; the finished sets carry none, and every activity that
comes after works from them. Content for the audits: `build/case-flow/exhibits/EXHIBITSPEC.md`.

**RS66 · Demand Package — Exhibit Packet & Index (DRAFT for audit)** · Day 3 · Others · `RS_66_Demand_Exhibit_Packet_DRAFT.pdf`
The demand specialist's enclosure set for RS33, prepared 07/17/2026: a cover sheet, the Exhibit A–J index with page
counts, Bates ranges and the source of each copy, a table of what the cover letter says the set proves, and the
blank audit sheet the Case Manager fills in (keep / replace / pull, what is wrong or missing, the fix and who does
it). Marked "DRAFT EXHIBIT PACKET — for Case Manager audit before Atty. Thorne signs".
*Plants (ten, this is the loophole audit):* (1) Exhibit A cites the Police Report as **RPD-26-018824** (it is
RPD-26-018842, RS07); (2) Exhibit C is the **grayscale** still export (RS09); (3) Exhibit E carries Riverton Spine &
Rehab's **34-line, $6,290.00** ledger with the 05/04/2026 duplicate (RS23); (4) Exhibit E also carries Crescent's
patient statement billing John **$1,540.00**, a contractual adjustment an in-network provider cannot bill (RS26);
(5) Exhibit F is the MRI with the **02/16/2026** history date and no corrected addendum (RS16); (6) Exhibit I is the
estimate and Diminished Value report for **Margaret Doe's** Civic, her claim and not Mr. Doe's;
(7) Exhibit J encloses the **Master Case Summary** (work product, RS04) and the client's **HIPAA authorization**
(RS06); (8) Bates ranges **overlap** (E runs 000016–66, F runs 000064–66); (9) **missing** the Gap Explanation
Record, so the 19-day April disruption has no exhibit; (10) **missing** Keystone's declarations page and limits
letter of 03/20/2026 (RS27), the proof of the limit the demand is built on.
*Key:* Audited against the file, not against the draft's own figures. Every fix is a dated, assigned CMS task; the
Case Manager corrects nothing silently. The finished set is RS67.

**RS67 · BI Time-Limited Demand Package — FINAL as served (07/20/2026)** · Day 3 · Others · `RS_67_BI_Demand_Package_FINAL_AS_SERVED.pdf`
The complete, ready-to-go package as signed and served, shown once the audit is handed in: the demand letter with
RS33's four faults corrected (30 days **from receipt**; a **Limited Release of Robert Smith and Keystone Mutual
only**, expressly preserving every UM/UIM claim and the Property Damage claim; Specials **$16,401.40**; Smith's
affidavit of no other insurance added as condition 3), then the Exhibit Index as served — Exhibits A–J, 81 pages,
Bates LSH-DEM-000001–000081, each exhibit mapped to the cover-letter section it proves — then a table of what was
pulled from the draft set and why. Ends with the service record: signed and served 07/20/2026 by certified mail
(No. 9589 0710 5270 0412 7731 58) and email at 4:21 p.m., return receipt 07/22/2026, acceptance docketed 08/21/2026.
*Key:* No plants. This is the package every later activity works from: the negotiation, the lien work, the
Mediation Binder (RS69) and the arbitration exhibits (RS70) all trace to these exhibits and these figures.

**RS68 · Demand Service & Adjuster Acknowledgment — Memorandum (as filed)** · Day 3 · Others · `RS_68_Demand_Service_and_Acknowledgment_Memo.pdf`
The model for the Service Confirmation activity: a memorandum to file dated 07/22/2026 holding the service table
(both channels and their proof), the Case Manager's confirmation email of 07/20/2026 reproduced in full, Dana
Whitfield's written acknowledgment of 07/22/2026, what the acknowledgment establishes and what it does not, the
same-day action taken, and where the memorandum and its thread are filed (CMS → Doc Hub → Others under the firm's
naming convention, Communications Log, the Insurance tab's Demand record, and the Google Drive backup folder).
*Key:* No plants. The acknowledgment fixes 07/22/2026 from the carrier's own writing and confirms the set is
complete at 81 pages, Exhibits A–J, closing the "we never got all of it" argument. "I may come back to you about
the time frame" is a request **flagged for Atty. Thorne**, never an extension the Case Manager grants.

**RS69 · Mediation Binder — FINAL as delivered (03/11/2027)** · Day 4 · Litigation · `RS_69_Mediation_Binder_FINAL_AS_DELIVERED.pdf`
The complete six-section binder as approved 03/10/2027 and delivered 03/11/2027, shown once the audit is handed in:
the master index (Sections 1–6, 141 pages, Bates LSH-MED-000001–000141, OCR-searchable and bookmarked), the Section 3
defense map pairing each of the five pleaded allegations with the exhibit that answers it (and the two legal
questions flagged for Atty. Thorne), the Section 5 ledger rebuilt line by line to **$16,401.40** with open liens
**$6,485.00**, the Property Damage schedule kept separate, a table of what the audit changed and what each fault
would have cost, and the delivery record.
*Key:* No plants. Built from RS67 and audited against the Litigation Desk's draft index (RS62); the starting point for RS70 and for Day 5.

**RS70 · UM Arbitration Binder — FINAL as exchanged (06/02/2027)** · Day 4 · Litigation · `RS_70_Arbitration_Binder_FINAL_AS_EXCHANGED.pdf`
The complete six-tab binder as approved 05/29/2027 and exchanged 06/02/2027, shown once the audit is handed in: the
master exhibit index (Tabs 1–6, exhibits C-1 to C-18, 174 pages, Bates LSH-ARB-000001–000174) with each tab's QC
rule in its row, the withheld-items list with Atty. Thorne's recorded reason for each, the Lien Sheet audited from
$11,485.00 to **$6,485.00**, a table of what the sort and QC changed, and the exchange record.
*Key:* No plants. Threshold exhibits lead (the BI tender, the UM consents, the Limited Release and the dismissal);
the brief is docketed **06/11/2027**; nothing privileged or settlement-related is in the exchanged set.
