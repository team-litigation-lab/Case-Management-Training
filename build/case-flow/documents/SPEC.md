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
"rejected? — Margaret unsure"). Collision summary (all-way stop, Smith rolled through, passenger-door impact, Escape
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
"Margaret believes she signed something about UM in 2024". Employment history. Social media: told to stop posting.
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

**RS04 · Master Case Summary — Attorney Only** · Day 2 · Case Files · `RS_04_Master_Case_Summary_ATTORNEY_ONLY.pdf`
Atty. Thorne's internal summary (02/17/2026, after the claims were opened at set-up): liability (stop-sign citation, witness, doorbell video), coverage
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

**RS40 · Peach State — Notice of Reimbursement Rights** · Day 2 · Others · `RS_40_Peach_State_Notice_of_Reimbursement_Rights.pdf`
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
parked 2019 Honda Civic (owner Margaret Doe, Bluewater BWA-209-66184). Occupants: John Doe, Unit 2 front-right passenger,
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

**RS11 · Riverton Fire EMS Run Report** · Day 2 · Medical · `RS_11_EMS_Run_Report.pdf` (folder `medical`)
Medic 7, run RF-26-0206-114, 02/06/2026, dispatched 07:12, on scene 07:18, paramedic J. Ortiz. Patient John Doe,
"restrained front-seat passenger, complains of neck stiffness, declined transport". Vitals, assessment (no LOC, GCS
15, neck pain 3/10, no midline tenderness on palpation documented). Refusal of transport signed 07:31, risks
explained.
*Plant:* none. *Key:* A neck complaint on the date of loss: the anchor for the 14-day gap — the injury was reported at
the scene. Restrained (rebuts "unbelted").

### Medical records (folder `medical`)

**RS12 · Riverton Urgent Care — Visit Note (02/20/2026)** · Day 2 · Medical · `RS_12_Urgent_Care_Note.pdf`
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

**RS14 · Riverton Spine & Rehab — Visit Notes & Attendance Log** · Day 2 · Medical · `RS_14_Spine_Rehab_Visit_Notes_and_Attendance.pdf`
Attendance log with every visit date (spec list) and short SOAP lines (pain scores trending down, ROM improving),
the missed visits 04/03, 04/07, 04/09, 04/14 marked "No show" (no call; the clinic's voicemails and texts unanswered),
the missed-visit alert sent to LSH Law Group 04/08/2026, the front-desk log (04/08 the firm's call; 04/17 evening slots
booked with the patient on the line), return 04/21/2026 (evening slot, mother driving; the patient's own report of panic
and avoiding car rides since 04/02), discharge 06/05/2026 (plateau, home program).
*Plant:* none. *Key:* 33 attended visits. The 19-day disruption (04/02 → 04/21) is documented: the near-drop, then the
patient's own report on 04/21; with RS75–RS78 it answers "failure to mitigate".

**RS15 · Lakeside Orthopedics — Consult & Follow-up** · Day 2 · Medical · `RS_15_Lakeside_Orthopedics_Consult_and_Followup.pdf`
Dr. Alana Reyes, MD. 03/05/2026 consult (history, exam: right C6 dermatomal paresthesia, Spurling positive right;
plan cervical MRI). 03/27/2026 follow-up (MRI reviewed: C5-C6 right paracentral herniation; refer to pain
management for ESI).
*Plant:* none. *Key:* Specialist confirmation of radiculopathy; the MRI order and the referral to Crescent.

**RS16 · Summit Imaging Center — Cervical MRI Report (03/13/2026)** · Day 3 · Medical · `RS_16_MRI_Cervical_Report.pdf`
Radiologist Dr. Helen Park, MD; referring Dr. Alana Reyes. Clinical history line: "MVA, **date of injury
02/16/2026**, neck pain with right arm numbness." Findings: C5-C6 right paracentral disc herniation with mild right
foraminal narrowing; other levels; Impression including exactly "no significant degenerative change at the adjacent
levels".
*Plant:* the history line's date of injury reads **02/16/2026** (the DOL is 02/06/2026).
*Key:* The impression is the answer to "degenerative" (Day 3, Day 5) — quote it exactly. The wrong date goes to
Atty. Thorne; with his approval the Case Manager asks Summit to review its own record, and Summit corrects it by a dated
addendum with the original kept (RS72, 07/15/2026). Never ask a provider to change a record to match the file.

**RS17 · Crescent Pain & Spine — Cervical ESI Procedure Note (05/15/2026)** · Day 3 · Medical · `RS_17_Crescent_ESI_Procedure_Note.pdf`
Dr. Omar Haddad, MD. Pre-procedure diagnosis, consent, fluoroscopic right C5-C6 (or C6-C7 interlaminar approach —
pick one and keep it), medication, tolerance, post-procedure plan; payer Peach State (in network).
*Plant:* none. *Key:* Paid by Peach State at contract rate — this is the $1,860.00 lien (RS26, RS41).

**RS18 · Lakeside Orthopedics — MMI Note (06/12/2026)** · Day 3 · Medical · `RS_18_Lakeside_MMI_Note.pdf`
Dr. Alana Reyes: MMI declared; residual intermittent right-arm paresthesia; future care: possibly 1–2 repeat ESIs
within 24 months at $3,400 each. Interval history: therapy interrupted 04/02–04/21/2026 while he avoided car travel
after a panic episode at the collision site (telephone encounter 04/20; EAP counseling since 04/24).
*Plant:* none. *Key:* MMI = the demand clock. Future medical $3,400–$6,800 is narrative, not specials.

**RS19 · Dr. Alana Reyes — Causation Letter (06/19/2026)** · Day 3 · Medical · `RS_19_Reyes_Causation_Letter.pdf`
To Atty. Thorne. Records reviewed; opinion to a reasonable degree of medical probability: delayed presentation is
clinically consistent with a disc injury whose radicular symptoms evolve over days to weeks; the C5-C6 herniation
was more likely than not caused by the 02/06/2026 collision; the 2021 low-back care is unrelated.
*Plant:* none. *Key:* The causation answer to the gap and to the 2021 visits; the centrepiece of the gap explanation
record and the rebuttal.

**RS20 · Prior Records — Birch Avenue Chiropractic (2021)** · Day 2 · Medical · `RS_20_Prior_Records_Birch_Ave_Chiropractic_2021.pdf`
Dr. Lena Ford, DC. Three visits 05/04, 05/11, 05/18/2021: low-back stiffness after moving furniture; lumbar only;
cervical exam normal; resolved; released to full activity.
*Plant:* none. *Key:* Low back only — no prior neck. Corrects RS02.

**RS21 · Riverton Drug — Pharmacy Receipts & Rx History** · Day 3 · Medical · `RS_21_Pharmacy_Receipts.pdf`
The receipts (spec list) and a printed Rx history; total $312.40.
*Plant:* none. *Key:* The 02/07 OTC receipt corroborates symptoms the day after the collision (gap reason 2).

### Bills & invoices (folder `bills`)

**RS22 · Riverton Urgent Care — Statement** · Day 3 · Bills · `RS_22_Urgent_Care_Statement.pdf`
DOS 02/20/2026, $685.00, paid by Harbor Point PIP 03/09/2026, balance $0.00.

**RS23 · Riverton Spine & Rehab — Itemized LOP Ledger** · Day 3 · Bills · `RS_23_Spine_Rehab_Itemized_LOP_Ledger.pdf`
Tammy Greer, office manager, statement date 06/30/2026: one line per visit date at $185.00, **34 lines**, total
**$6,290.00**, payments $0.00, balance $6,290.00, "Account under Letter of Protection — LSH Law Group".
*Plant:* **05/04/2026 appears twice** (one visit billed on two lines).
*Key:* 33 visits match the attendance log (RS14); the second 05/04 line is a duplicate. Audited balance $6,105.00.

**RS24 · Lakeside Orthopedics — Statement** · Day 3 · Bills · `RS_24_Lakeside_Orthopedics_Statement.pdf`
Three visits 03/05, 03/27, 06/12/2026 at $640.00 = $1,920.00; PIP payments 03/16, 04/10, 06/26/2026; balance $0.00.

**RS25 · Summit Imaging Center — Invoice** · Day 2 · Invoices · `RS_25_Summit_Imaging_Invoice.pdf`
Cervical MRI without contrast 03/13/2026, $2,395.00 (technical + professional), paid by PIP 03/25/2026, $0.00.
Note: "LOP requested 03/11/2026 — not required (PIP coverage confirmed)".

**RS26 · Crescent Pain & Spine — Bill, Peach State EOB & Patient Statement** · Day 3 · Bills · `RS_26_Crescent_Bill_EOB_and_Statement.pdf`
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
Dec page BWA-209-66184 (Margaret Doe, 2019 Honda Civic LX; liability 25/50/25; collision $500 ded.; UM/UIM: REJECTED);
signed UM/UIM selection/rejection form 03/14/2024.
*Key:* Margaret's policy on the Civic: UM rejected in writing, so it adds no UM layer for John. Her collision coverage is a route for her own PD claim, not his.

**RS31 · Harbor Point — PIP Payment Ledger** · Day 2 · Others · `RS_31_Harbor_Point_PIP_Ledger.pdf`
The five payments (spec list) at 100% of the billed medical, running balance to $0.00, "PIP limit exhausted 06/26/2026"; a lost-income section: the 80% wage benefit ($1,267.20 on $1,584.00) not payable, limit exhausted before Northgate's 06/30/2026 letter.
*Key:* Payer order in action; the Crescent bill went to Peach State, not PIP.

**RS71 · PIP Log — John Doe (Harbor Point PIP)** · Day 2 · Case Files · `RS_71_PIP_Log.pdf`
The firm's own record (LSH Law Group letterhead, Form PIP-100), kept by the Case Manager in CMS → Insurance tab → PIP Log: the PIP claim
(HP-26-7741, HPA-4402917, Marcus Bell; $5,000.00, 100% medical / 80% lost income; application 02/17/2026, opened 02/24/2026;
no reimbursement right per the 03/02/2026 letter); the five payments (spec list) with the check numbers from RS31 and the limit
remaining to $0.00; the 80% wage benefit not payable; care billed elsewhere (Crescent to Peach State, Riverton Spine & Rehab under
its LOP); an activity log through 07/06/2026, when it was reconciled to RS31.
*Key:* No plants. It ties to RS31 line for line.

**RS32 · Keystone Mutual — Claim Correspondence (Feb–Apr 2026)** · Day 2 · Others · `RS_32_Keystone_Claim_Correspondence.pdf`
02/17/2026 Leah Moran: PD liability accepted; 02/18 rental authorized at Rivergate Rentals, $42.00/day, max 30 days;
02/24 Dana Whitfield: BI acknowledgment; the $10,000 limit given on the set-up call will be confirmed in writing (declarations page) only on a written request with signed authorizations;
03/16 Leah Moran: rental ends 03/19 (30 days); 04/10 Leah Moran: extension refused ("shop delay is not covered").
*Key:* The 03/19 rental cutoff is Property Damage (Margaret's Loss of Use), background to the April disruption, not its cause. The limits request is how the BI layer was verified.

**RS33 · BI Time-Limited Demand — DRAFT for audit** · Day 3 · Others · `RS_33_BI_Time_Limited_Demand_DRAFT.pdf`
The demand specialist's draft (dated 07/20/2026) to Dana Whitfield, KM-26-440871, by email:
liability, injuries and treatment, the gap addressed up front (EMS report, causation letter), specials table
(medical $14,817.40 audited by line, wages $1,584.00), the offer to settle for the $10,000 limits. Marked "DRAFT —
for Case Manager audit before Atty. Thorne signs".
*Plants:* (1) acceptance deadline "**30 days from the date of this letter (08/19/2026)**" — the window runs 30 days
from **receipt** (07/22 → 08/21/2026); (2) release term "**a full and final release of all claims**" — must be a
limited release of Robert Smith and Keystone only; (3) the specials total reads **$16,410.40** (the lines add to
$16,401.40); (4) Smith's **affidavit of no other insurance is missing** from the conditions.
*Key:* All four must be fixed before signature; a general release in our own demand would release the UM claims.

**RS34 · BI Demand — Proof of Delivery** · Day 3 · Others · `RS_34_BI_Demand_Proof_of_Delivery.pdf`
The firm's proof-of-delivery print: the sent email that served the demand (07/20/2026, 4:21 p.m., Demand Package
attached, 81 pp.) and Dana Whitfield's written acknowledgement of receipt (07/22/2026, 9:06 a.m.), with the log entries.
*Key:* The written acknowledgement of 07/22/2026 starts the 30-day window → 08/21/2026. Proof of delivery is what makes the deadline real.

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
Dana Whitfield's cover letter (08/14/2026: sign before a notary, wet-ink original; **before payment issues, each UM carrier's written
consent and waiver of subrogation against Robert Smith**, and the firm's W-9) and Keystone's "Release of All Claims" (Form KM-REL-100)
for $10,000: releases Robert Smith, Keystone Mutual "**and all other persons, firms, corporations and insurers**"; claims released include
bodily injury, property damage and loss of use; §1 non-admission; §2 unknown injuries; §3 confidentiality; §4 lien warranty with
indemnify, defend and hold harmless including attorney's fees; §5 Medicare representation; §6 entire agreement, governed by "the laws of
the state in which it is signed"; signature, witness and notary block.
*Plant:* the release language reaches "all other ... insurers" (Harbor Point and Cardinal State); the clause audit (d3m2-rel) also finds
the property-damage reach, the missing UM reservation, the confidentiality term, the unlimited indemnity and the missing payment date.
*Key:* Signing this releases the UM claims. Clause-audit it, propose amendments, route to Atty. Thorne before the client sees it. As
approved: RS80. Limited Release signed 08/28/2026 (RS81).

**RS38 · UM Consents to Settle** · Day 3 · Others · `RS_38_UM_Consents_to_Settle.pdf`
Harbor Point 08/24/2026 (Marcus Bell) and Cardinal State 08/26/2026 (Teresa Okafor): consent to the $10,000 BI
settlement with Robert Smith/Keystone, waiver of subrogation against Smith, no substitution of their own check.
*Key:* The green light for the limited BI release.

**RS83 · UM Subrogation Waivers — Harbor Point & Cardinal State (executed)** · Day 3 · Others · `RS_83_UM_Subrogation_Waivers.pdf`
Two stand-alone instruments, one per UM carrier, each on the carrier's own form: Harbor Point (Form HP-UM-14, policy
HPA-4402917, claim HP-26-7741), signed by Marcus Bell 08/24/2026; Cardinal State (Form CSM-SW-3, policy CSM-AU-5580213,
claim CS-26-20355), signed by Teresa Okafor 08/26/2026. Recitals (Keystone's 08/12 tender, Smith's 08/10 affidavit, the
firm's 08/13 request); waiver of subrogation, reimbursement and recovery against Robert Smith and Keystone only; consent
to the $10,000 settlement and the limited release; no substitution; the UM claim stays open; reliance, including filing
in court or arbitration; authority. Each signed and acknowledged before a notary with seal (Denise Farrow, Riverton County;
Samuel Kirkland, Millbrook County).
*Key:* No plants. The consent letters (RS38) are correspondence; these waivers are the sworn, acknowledged instruments the
release, the UM claims and any court or arbitration rely on. File them at the front of each UM Demand Package, with the
transmittal to Keystone and in the arbitration exhibit set.

**RS39 · UM Correspondence — Offers & Tenders** · Day 3 · Others · `RS_39_UM_Offers_and_Tenders.pdf`
Harbor Point: 09/14/2026 offer $8,000 ("the gap"; "BI already compensated him"); 09/29/2026 payment of the $20,000
limits. Cardinal State: 10/01/2026 offer $6,000; 10/06/2026 tender of the $10,000 limits.
*Key:* "BI already compensated him" is wrong on an add-on UM (RS28). Gross recovery $40,000.00.

**RS80 · Keystone Limited Release — as approved (08/19/2026)** · Day 3 · Case Files · `RS_80_Keystone_Limited_Release_AS_APPROVED.pdf`
LSH file cover sheet (what changed from RS37 and who decided it), Keystone's 08/19/2026 letter accepting Atty. Thorne's 08/17 redline, and
the Limited Release (Form KM-REL-100-L), unsigned: Smith and Keystone only, "and no other person, firm, corporation or insurer"; the BI
claim only; §1 UM/UIM claims (HP-26-7741, CS-26-20355) and the Civic's claim (KM-26-440871-PD) reserved; §2 non-admission; §3 unknown
injuries; §4 liens on the file paid from trust, hold harmless to the extent of the proceeds, no defense or fees; §5 Medicare; §6 payment
within 14 days of receipt of the executed release and W-9; §7 State of Riverton law. No confidentiality.
*Key:* No plants. The reveal of the clause audit (d3m2-rel); what John Doe signs on 08/28/2026.

**RS81 · BI Settlement Packet — Executed, Transmitted & Funded (as filed 09/04/2026)** · Day 3 · Others · `RS_81_BI_Settlement_Packet_EXECUTED_AND_FUNDED.pdf`
Memorandum to file: the packet table, the 08/28/2026 4:21 p.m. transmittal email, Dana Whitfield's 08/31/2026 9:12 a.m. acknowledgment
(check to issue 09/01), her 09/01 payee question and how it was routed, what the exchange establishes, where it is filed; the executed
Limited Release (John Doe, 08/28/2026, notary Renee Castillo, NP-0522190, expires 03/31/2030; Atty. Thorne approved as to form); the
signing session record; Keystone check no. 0048213, $10,000.00, issued 09/01, received and deposited to IOLTA 09/04/2026.
*Key:* No plants. The model for the transmittal email (d3m2-exec) and the fully executed settlement packet every later activity works from.

**RS82 · Release Clause Review & Attorney Approval — Memorandum (as filed)** · Day 3 · Others · `RS_82_Release_Clause_Review_and_Approval_Memo.pdf`
Memorandum dated 08/17/2026: the clause-by-clause review of RS37 with proposed amendments, the Case Manager's email to Atty. Thorne
(08/14/2026, 4:21 p.m.), his written approval (08/17/2026, 9:40 a.m.), what the approval establishes, where it is filed, and the adjuster's
08/18 side-letter request and how it was routed.
*Key:* No plants. The model for the release review email (d3m2-rel).

### Liens (folder `liens`) — RS40 is listed under Day 1 above

**RS41 · Peach State — Lien Itemization & Reduction Acceptance** · Day 4 · Others · `RS_41_Peach_State_Lien_and_Acceptance.pdf`
Itemization (one claim: Crescent Pain & Spine, DOS 05/15/2026, paid $1,860.00); reimbursement claim $1,860.00;
plan language excerpt (fully insured group policy). Page 2: 10/09/2026 letter accepting **$1,240.00** in full
satisfaction (a one-third procurement-cost reduction), payment instructions.
*Key:* Accepted in writing at $1,240.00 — only a written acceptance goes on the net sheet.

**RS42 · Riverton Spine & Rehab — LOP Payoff Letter** · Day 4 · Others · `RS_42_Spine_Rehab_Payoff_Letter.pdf`
Tammy Greer, 10/12/2026: accepts **$4,580.00** in full satisfaction of the LOP account (audited balance $6,105.00);
release of lien on payment; payment instructions.
*Key:* $6,290.00 billed → $6,105.00 audited (duplicate removed) → $4,580.00 accepted.

**RS90 · Peach State — Interim Lien Itemization (06/10/2026)** · Day 2 · Others · `RS_90_Peach_State_Interim_Lien_Itemization.pdf`
Dion Carver, recovery file SRU-26-03318, answering the firm's 03/12/2026 request: a cover letter (reimbursed "first, in full ...
without reduction for attorney fees or costs"; remit within 30 days of any settlement; notice before settlement) and the
itemization, marked INTERIM, of every claim with a date of service from 02/01/2026: Riverton Vision Center 02/03/2026 eye exam
(Z01.00) $95.00; Summit Imaging Center 03/13/2026 MRI, denied (other coverage primary, PIP) $0.00; Peach State Virtual Care
03/18/2026 acute sinusitis (J01.90) $49.00; Riverton Allergy & Asthma Clinic 05/06/2026 established patient (J30.2) $74.00;
Crescent Pain & Spine 05/15/2026 (PS-2605-449021) billed $3,400.00, paid $1,860.00, **claimed $3,400.00**. Asserted **$3,618.00**.
*Plants:* three lines not the collision's (one before the DOL, one unrelated, one pre-existing) and the Crescent line claimed at
billed. *Key:* audited line by line to $1,860.00, confirmed in writing in RS91; the "without reduction" demand is Atty. Thorne's.

**RS91 · Peach State — Corrected Itemization & Lien Confirmation (06/24/2026)** · Day 2 · Others · `RS_91_Peach_State_Corrected_Itemization.pdf`
Dion Carver to the Case Manager (cc Atty. Thorne), answering the 06/12/2026 dispute: the three lines removed, Crescent corrected
to the $1,860.00 paid, Summit $0.00; reimbursement claim **$1,860.00** as of 06/24/2026; no other accident-related claims in
process; Section 11 of the certificate (as RS41). *Plant:* none. *Key:* the completed set for the d1m1-a2 audit.

**RS92 · Peach State Lien Audit & Written Confirmation — Memorandum (as filed)** · Day 2 · Others · `RS_92_Peach_State_Lien_Audit_Memo.pdf`
The model memorandum (06/24/2026): the audit table ($3,618.00 → $1,860.00), the 06/12/2026 dispute email, the reply, the
follow-up (full repayment, limits, settlement date) routed to Atty. Thorne, what the confirmation establishes, where it is filed.
*Plant:* none.

**RS84 · Vance & Kettering — Notice of Charging Lien & Fee-Division Demand (10/13/2026)** · Day 4 · Others · `RS_84_Vance_Kettering_Notice_of_Charging_Lien.pdf`
Atty. Corbin Vance's letter (dated 10/13, received by email 10/14/2026): retained 07/27/2026; "substantial services"; carriers "placed on
notice"; charging lien; one-half of the fee on $40,000.00 = $6,666.67; hold the entire settlement; asks the case manager to confirm the fee
division by 10/16. Enclosures: the Contingency Fee Agreement (client "John Doe (by Margaret Doe, mother)", signed only by Margaret Doe and
Paige Lusk for the firm; John Doe's line blank; no authority attached) and the time record (0.4 h 07/27, 0.2 h 07/29, both with Margaret).
*Plants:* the representation and work claims the record contradicts (no client signature or authority; 0.6 hours with Margaret, nothing on
the claim; no carrier notice; dated after LSH's 02/09/2026 engagement and the 07/20/2026 demand).
*Key:* The Case Manager logs receipt, answers nothing to the firm, investigates facts and builds RS85; validity, any response and the hold
are Atty. Thorne's.

**RS85 · Asserted Prior-Attorney Lien — Evidentiary Packet to Atty. Thorne (10/15/2026)** · Day 4 · Others · `RS_85_Prior_Attorney_Lien_Evidentiary_Packet.pdf`
Factual summary, representation timeline, signature comparison (RS05, RS06 against RS84), work-product audit, John Doe's statement on the
10/15 call, the $6,666.67 hold and Action Plan update, and the questions for Atty. Thorne's decision.
*Key:* No plants. The reveal of the lien audit (d3m4-pal).

**RS86 · Prior-Attorney Lien — Atty. Thorne's Repudiation (10/16) & Withdrawal (10/19/2026)** · Day 4 · Others · `RS_86_Lien_Repudiation_and_Withdrawal.pdf`
Atty. Thorne's letter rejecting the lien and asking for withdrawal by 10/20; Vance & Kettering's written withdrawal of 10/19/2026 claiming
no fee; the file note: hold released 10/19, everything filed in the CMS and on the Backup Drive.
*Key:* No plants. A condition precedent of the 10/22/2026 disbursement.

### Settlement & wages (folder `settlement`)

**RS43 · Northgate Distribution — Wage & Attendance Verification** · Day 3 · Others · `RS_43_Northgate_Wage_and_Attendance_Letter.pdf`
Angela Ruiz, HR manager, 06/30/2026: employment since 01/12/2026, shift lead, $22.00/h, 8-hour shifts; the nine
missed shifts (spec list) with reason codes (02/09–02/13 "called out — neck pain"; 03/05, 03/13, 05/15, 05/18
"medical appointment"); 72 hours = $1,584.00 unpaid; health plan Peach State effective 02/01/2026.
*Key:* Lost wages $1,584.00; the 02/09–02/13 call-outs corroborate the gap (symptoms before first treatment).

**RS44 · LSH Law Group — Case Cost Ledger** · Day 4 · Case Files · `RS_44_Case_Cost_Ledger.pdf`
Pre-suit costs advanced through 09/23/2026 (spec list) = $486.75, each with date, payee and receipt reference; the copy and postage logs close the day before suit, so the figure is the same on Track A (settled) and Track B (pre-suit costs, d5m5-a1).
*Key:* $486.75 on the net sheet; costs come from the client's share after the fee (RS05).

**RS93 · Northgate Distribution — Wage Loss Verification Form & Payroll Records** · Day 3 · Others · `RS_93_Northgate_Wage_Loss_Verification_Form_and_Payroll.pdf`
Angela Ruiz, 06/30/2026, with RS43: employee ID NGD-20417; $22.00/h; 8-hour day shifts, 40 h a week; the nine unpaid shifts
(72 h, $1,584.00); no overtime scheduled on a missed shift; the 02/20 and 03/05/2026 restrictions accommodated at full shifts;
physical demands (lifting to 50 lb, forklift, on his feet the full shift); no Northgate W-2 for 2025 (hired 01/12/2026);
payroll for 02/02–02/15 (40 unpaid hours), 03/02–03/15 (16) and 05/11–05/24/2026 (16). *Plant:* none.

**RS94 · Lost Wage Worksheet — DRAFT for audit (06/23/2026)** · Day 3 · Case Files · `RS_94_Lost_Wage_Worksheet_DRAFT.pdf`
A working paper from John Doe's own account by telephone, before Northgate's records came. *Plants:* 02/18 and 02/19/2026
claimed (he worked them); 02/09–02/13 excluded; the MRI on 03/12; 05/18 with no note; light duty $440.00 and overtime $264.00;
total $1,760.00; a PIP wage claim of $1,408.00; the 2025 W-2 asked of Northgate; "loss of earning capacity: permanent".
*Key:* audited to $1,584.00 in RS95.

**RS95 · Lost Wage Verification Record — FINAL (07/01/2026)** · Day 3 · Case Files · `RS_95_Lost_Wage_Verification_Record_FINAL.pdf`
Each missed shift matched to Northgate's record and the provider's note (03/05 RS15, 03/13 RS16, 05/15 and 05/18 RS17);
02/09–02/13 kept and flagged (RS11, RS21, RS12 corroborate); $1,584.00; the changes from RS94 and why. *Plant:* none.

**RS96 · Employer Wage Verification — Memorandum (as filed)** · Day 3 · Others · `RS_96_Employer_Wage_Verification_Memo.pdf`
The model memorandum (06/30/2026): the 06/22/2026 request to Angela Ruiz, her reply, the follow-up (will the settlement repay
him; send his MRI) answered with nothing about the claim and no medical records, what it establishes, where it is filed.
*Plant:* none.

### Property damage (folder `property`)

**RS45 · Riverton Collision Center — Estimate, Supplement & Tow/Storage** · Day 5 · PD · `RS_45_Repair_Estimate_Supplement_and_Tow.pdf`
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
accident**" for Margaret Doe's signature (the Civic is hers).
*Plant:* the PD release reaches **all claims** from the accident, not only the Civic.
*Key:* Never let Margaret sign a PD release that isn't limited to property damage; John Doe has no PD claim and signs nothing. 17c caps at 10% and multiplies it down;
the appraisal is $3,600.00. Route to Atty. Thorne with a recommendation.

### Litigation & ADR — Track B (folder `litigation`)

**RS49 · Keystone — Impasse Correspondence (Aug–Sep 2026)** · Day 5 · Litigation · `RS_49_Keystone_Impasse_Correspondence.pdf`
08/06 LSH rebuttal (cover letter listing the enclosures: MRI report, causation letter, EMS report, gap explanation
record); 08/12 Dana Whitfield email: "$3,500 is our final offer"; 08/24 and 08/31 LSH follow-ups asking for a
response and the evidence relied on (no reply); 09/02 escalation letter to Greg Holloway, claims supervisor (no reply).
*Key:* The impasse record: every attempt dated, every silence documented. The demand lapsed 08/21/2026.

**RS50 · Complaint — Pre-Filing Draft (superseded)** · Day 4 · Litigation · `RS_50_Complaint_PRE-FILING_DRAFT.pdf`
An earlier draft: no case number, "DRAFT 09/15/2026", unsigned. Like the filed complaint, it pleads no property damage (the Civic is Margaret Doe's claim).
*Plant:* it is a superseded draft. *Key:* Never in a binder or exhibit set — use the filed complaint (RS51).

**RS51 · Complaint (filed 09/24/2026)** · Day 4 · Litigation · `RS_51_Complaint_Filed.pdf`
State Court of Riverton County, *John Doe v. Robert Smith*, Civil Action No. 26-CV-04417; filed stamp 09/24/2026;
negligence (failure to stop), damages: medical specials, lost wages, future medical, pain and suffering; no property
damage is pleaded (John Doe owns no vehicle; the Civic's loss of use and diminished value are Margaret Doe's own claim);
jury demand; signed by Atty. Elijah Thorne.

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
payment; Plaintiff makes no property-damage claim (the Civic's claim, KM-26-440871-PD, is Margaret Doe's own and
is not touched by the release); UM consents attached.
*Key:* BI exhausted on Track B — Host UM and Relative UM open (and go to arbitration).

**RS60 · Certificate of Service — Plaintiff's Discovery Responses (01/04/2027)** · Day 5 · Litigation · `RS_60_Certificate_of_Service_Discovery_Responses.pdf`
Atty. Thorne's certificate: John Doe's verified answers to interrogatories, responses to requests for production and
responses to requests for admission served by U.S. mail on Atty. Grant Mercer 01/04/2027.
*Key:* Proves the RFA responses were timely (due 01/04/2027).

**RS61 · Host UM & Relative UM Demands — DRAFT for QC** · Day 3 · Others · `RS_61_UM_Demands_DRAFT.pdf`
The Demand Desk's drafts of the $20,000 Host UM demand to Harbor Point and the $10,000 Relative UM demand to Cardinal State (08/28/2026), assigned after the audit, for your QC.
*Plants:* (1) exhaustion proof buried in section 3, not on page one; (2) Relative UM demanded "payable now and in addition to any other recovery" — it is excess over BI + Host UM ($30,000); (3) future medical $3,400.00 counted inside the Specials ($19,801.40) — Specials are $16,401.40, future medical goes in the narrative; (4) response deadline filled in — it is Atty. Thorne's to set; (5) "all medical records" enclosed instead of a two-page treatment summary; (6) the gap and the "degenerative" reading are not answered (MRI adjacent levels, Causation Letter, EMS report, Gap Explanation Record).

**RS62 · Mediation Binder — Master Index DRAFT for QC (03/02/2027)** · Day 4 · Litigation · `RS_62_Mediation_Binder_DRAFT.pdf`
The Litigation Desk's draft Mediation Binder index and medical ledger, assembled 03/02/2027, for your QC before it goes to Hon. Carla Benton (Ret.) on 03/11/2027.
*Plants:* (1) ledger from the original bills — Riverton Spine & Rehab $6,290.00 (34 lines) instead of $6,105.00 after the audit, total $15,002.40 instead of $14,817.40; (2) Crescent's $3,400.00 shown open — Peach State paid $1,860.00 at contract rate, no balance billing; (3) the pre-filing draft Complaint (RS50) in Section 3 instead of the filed one (RS51); (4) session time and location left blank and the fee split assumed, not read from the order; (5) deposition summary missing.

**RS63 · Arbitration Binder — Exhibit Index DRAFT for QC (05/14/2027)** · Day 4 · Litigation · `RS_63_Arbitration_Binder_DRAFT.pdf`
The Litigation Desk's draft Arbitration Binder exhibit index, assembled 05/14/2027, for your QC before the 06/02/2027 exchange.
*Plants:* (1) the brief docketed 06/12/2027, a Saturday — counting back, it moves to Friday 06/11/2027; (2) the Confidential Mediation Statement in the exchange set; (3) the pre-filing draft Complaint; (4) the public-redacted Police Report and grayscale doorbell stills; (5) the impasse memo in the exchange set; (6) Harbor Point PIP listed as a $5,000.00 lien — no reimbursement right (03/02/2026 letter); (7) the threshold BI exhaustion record, the 2021 records and the authentication log missing.

**RS64 · CMS Task Log — Pre-Demand Audit Closed, Drafting Assigned (07/15/2026)** · Day 3 · Case Files · `RS_64_CMS_Task_Log_Drafting_Assigned.pdf`
The CMS task log Atty. Thorne opened when the pre-demand audit closed: the BI and UM demands and the two binders assigned to the drafting desks, each returning to the Case Manager for QC.
*Key:* Shows the workflow: the desks draft, the CM QCs against the records, Atty. Thorne approves. Note the dependencies: UM opens only once BI is exhausted; the binders are contingent on suit and on a UM dispute.

**RS65 · Harbor Point — PIP Application & Claim Acknowledgement** · Day 2 · Others · `RS_65_Harbor_Point_PIP_Application.pdf`
John Doe's PIP application, signed 02/17/2026 and sent with the Harbor Point LOR (passenger in Kevin Alvarez's 2020 Ford Escape), and Harbor Point's 02/24/2026 acknowledgement: PIP opened under HPA-4402917, $5,000 each person, 100% medical / 80% lost income, bills to be sent with the claim number; wage loss needs an employer verification.
*Key:* Whose PIP: the vehicle he rode in, because no household policy carries PIP. Riverton's add-on rule: no BI or UM set-off, no reimbursement from the recovery.

### The near-drop: the 19-day disruption (RS75–RS79)

The April disruption's record (case-file §2, "Why the disruption happened"). No plants. None adds a bill: the
Specials stay $16,401.40.

**RS75 · Client Outreach Log & Re-engagement Notices (04/08–04/20/2026)** · Day 2 · Case Files · folder `intake` · `RS_75_Client_Outreach_Log_and_Notices.pdf`
LSH CMS Communications Log export, printed 04/20/2026: 18 entries from the last contact (03/31 check-in) through the
04/08 alert, Step 1 review, Notices 1–3 (call + text 04/08, call + email 04/09, text 04/13), Margaret Doe 04/10, Step 3
escalation, the Final Warning Letter and Drop Warning status (04/10), the certified receipt (04/13), the 14-day
no-visit trigger (04/16), John's call 04/17 (declined recording; privileged GIRP note filed separately), Atty.
Thorne's approval, and the restoration 04/20. Page 2: the text of each notice as sent.
*Plant:* none. *Key:* the finished protocol record; it is the model for d2m2-a2, so it is not in that activity's packet.

**RS76 · Final Warning Letter — 10-Day (04/10/2026)** · Day 2 · Case Files · folder `intake` · `RS_76_Final_Warning_Letter_10_Day.pdf`
Atty. Thorne to John Doe, by certified mail 7026 0410 0001 3382 5590 and email: the five attempts itemized, respond
by April 20, 2026, withdrawal possible under section 7 of the retainer and not decided, how to respond. Page 2: return
receipt signed "M. Doe" 04/13/2026 and the email delivery record.
*Plant:* none. *Key:* the 10-day date is a response date; RS05 §7 needs 30 days of documented attempts before withdrawal.

**RS77 · Dr. Alana Reyes — Telephone Encounter & Counseling Referral (04/20/2026)** · Day 2 · Medical · folder `medical` · `RS_77_Reyes_Telephone_Encounter_and_Counseling_Referral.pdf`
Lakeside telephone encounter 04/20/2026, 20 minutes, not billed ($0.00), scheduled 04/17 at the patient's request
(scheduling only): the 04/02 panic episode at the collision corner, avoidance of car travel, sleep, low mood, denies
self-harm; assessment anxiety with avoidance after the MVA (provisional, not a psychiatric evaluation); referral to
Stonebridge EAP Services (Northgate's EAP); PT to resume. Page 2: the faxed referral letter.
*Plant:* none.

**RS78 · Stonebridge EAP — Counseling Summary (06/10/2026)** · Day 2 · Medical · folder `medical` · `RS_78_Stonebridge_EAP_Counseling_Summary.pdf`
Renee Castillo, LPC, to Atty. Thorne (his letter 05/27; authorization 05/06): six video sessions 04/24, 05/01, 05/08,
05/22, 05/29, 06/05/2026 at no charge; his words; GAD-7 15 → 7, PHQ-9 12 → 5; impression consistent with an
adjustment disorder with mixed anxiety and depressed mood, related by history to the 02/06/2026 collision; progress
and recommendations. Treatment summary only, no psychotherapy notes.
*Plant:* none.

**RS79 · John Doe — Personal Impact Statement (06/15/2026)** · Day 2 · Others · folder `insurance` · `RS_79_Personal_Impact_Statement.pdf`
John's own words on the firm's open-prompt form: work, basketball, the corner, 04/02, the silence, the counseling,
what remains. Signed 06/15/2026.
*Plant:* none. *Key:* his account: "account only" in the Gap Explanation Record; use in the demand is Atty. Thorne's call.

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
RS33's four faults corrected (30 days **from the adjuster's written acknowledgement of receipt**; a **Limited Release of Robert Smith and Keystone Mutual
only**, expressly preserving every UM/UIM claim and the Property Damage claim; Specials **$16,401.40**; Smith's
affidavit of no other insurance added as condition 3), then the Exhibit Index as served — Exhibits A–J, 81 pages,
Bates LSH-DEM-000001–000081, each exhibit mapped to the cover-letter section it proves — then a table of what was
pulled from the draft set and why. Ends with the service record: signed and served 07/20/2026 by email to the adjuster at 4:21 p.m., receipt
acknowledged in writing 07/22/2026, acceptance docketed 08/21/2026.
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
**$7,965.00**, the Property Damage schedule kept separate, a table of what the audit changed and what each fault
would have cost, and the delivery record.
*Key:* No plants. Built from RS67 and audited against the Litigation Desk's draft index (RS62); the starting point for RS70 and for Day 5.

**RS70 · UM Arbitration Binder — FINAL as exchanged (06/02/2027)** · Day 4 · Litigation · `RS_70_Arbitration_Binder_FINAL_AS_EXCHANGED.pdf`
The complete six-tab binder as approved 05/29/2027 and exchanged 06/02/2027, shown once the audit is handed in: the
master exhibit index (Tabs 1–6, exhibits C-1 to C-18, 174 pages, Bates LSH-ARB-000001–000174) with each tab's QC
rule in its row, the withheld-items list with Atty. Thorne's recorded reason for each, the Lien Sheet audited from
$12,965.00 to **$7,965.00**, a table of what the sort and QC changed, and the exchange record.
*Key:* No plants. Threshold exhibits lead (the BI tender, the UM consents, the Limited Release and the dismissal);
the brief is docketed **06/11/2027**; nothing privileged or settlement-related is in the exchanged set.

## The corrected copies (the pre-demand audit's Amendment Requests)

Three records in the set are wrong at their source (RS16, RS23, RS26). In the pre-demand audit (`d2m4-a1`) the Case
Manager screens the bills and records, finds them, and writes each provider an amendment request; the provider's
answer comes back, and with it the corrected copy, which the trainee files in the CMS. A corrected copy opens to a
trainee only once their request is answered (`unlock` in the manifest; trainers see it always). Content for the
requests: `build/case-flow/exhibits/EXHIBITSPEC.md` ("amendments"). Riverton Spine & Rehab does not reissue its
ledger before the demand (its answer of 07/09/2026), so it has no corrected copy here.

**RS72 · Summit Imaging Center — MRI Corrected History Addendum (07/15/2026)** · Day 3 · Medical · `RS_72_Summit_MRI_Corrected_History_Addendum.pdf`
Dr. Helen Park's addendum to the 03/13/2026 report (accession SIC-MR-26-031307): reason (a transcription error in the
history), the corrected clinical history ("date of injury 02/06/2026"), the scope (history only; technique, findings
and impression unchanged and restated), her electronic signature 07/15/2026, and the HIM release record (request
received 07/06/2026 from LSH Law Group with the HIPAA authorization; released by Marisol Ortega, HIM Supervisor).
*Key:* No plants. The date fixed and nothing else. Exhibit F of RS67.

**RS73 · Crescent Pain & Spine — Corrected Patient Statement, $0.00 (07/10/2026)** · Day 3 · Bills · `RS_73_Crescent_Corrected_Patient_Statement.pdf`
Replaces the 07/01/2026 statement on account CPS-30442: the $3,400.00 charge, Peach State's $1,860.00 payment and the
$1,540.00 in-network contractual adjustment (CO-45) posted 07/10/2026; balance $0.00; the earlier statement withdrawn;
account paid in full and closed; corrected by Renee Halvorsen, Billing Lead, on the firm's request of 07/06/2026.
*Key:* No plants. Crescent is not an open balance; the only claim on the bill is Peach State's $1,860.00. Exhibit E of RS67.



**RS74 · LSH Law Group — Closing Letter to John Doe, with Lien Payoff Letters (10/23/2026)** · Day 4 · Case Files · `RS_74_Closing_Letter_with_Lien_Payoffs.pdf`
Track A's closing letter from the firm to John Doe, the day after the 10/22/2026 disbursement: the three checks received
(Keystone $10,000.00 09/04, Harbor Point $20,000.00 10/05, Cardinal State $10,000.00 10/13), the Settlement Statement
he signed 10/21 paid out (fee $13,333.33, costs $486.75, Peach State $1,240.00, Riverton Spine & Rehab $4,580.00, net
$20,359.92, trust at $0.00), the liens satisfied in the lienholders' own writing, the instruction to send any late bill
to the firm, no tax advice, and the file closing 10/30/2026 with seven-year retention. Enclosures: Peach State's
acceptance (RS41, 10/09/2026) and Riverton Spine & Rehab's Payoff Letter (RS42, 10/12/2026).
*Plant:* none. *Key:* the model closed-file letter; the trainee follows it for Track B's close-out (d5m5-a1).