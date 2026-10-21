/* ============================================================
   LSH Case Management Training — templates and blank forms (the handouts are in the LSH Knowledge Base)
   Every file lives in /documents. "cms" is the CMS upload button the
   trainee should use. The case documents (John Doe v. Robert Smith)
   are the Case Flow's: js/cm-case-flow-docs.js.
   ============================================================ */
window.CM_DOC_FOLDERS = [
  {id:"templates", label:"Templates & Blank Forms", icon:"📝"}
];

window.CM_DOCS = [
  {id:"TPL1", folder:"templates", file:"templates/Blank_PI_Client_Intake_Form.pdf", title:"Blank Personal Injury Client Intake Form", cms:"Case Files", day:1, desc:"Complete it from the John Doe packet as part of the Intake Decision Challenge.", key:"Trainees should fill every field from documents — and mark unknowns instead of guessing."},
  {id:"TPL2", folder:"templates", file:"templates/LSH_Net_Sheet_v2_FIXED.xlsx", title:"LSH Net Sheet v2 (fee formula fixed) + John Doe v. Robert Smith practice tab", cms:"Others", day:2, desc:"The firm's net sheet. The Robert Smith practice tab is pre-filled from the bills, MedPay and Peach State's EOB (the earlier version's practice tab is kept, archived).", key:"Robert Smith tab: the Riverton Spine & Rehab line is the ledger as billed ($6,290.00) — the trainee must catch the 05/04/2026 duplicate ($6,105.00 audited) before reducing it; Peach State $1,860.00 is the only health-plan claim (Crescent was paid in full at contract rate). v1 bug: L11 = L7*I11 (empty) → fee $0. v2: L11 = L7*C11."},
  {id:"TPL3", folder:"templates", file:"templates/Sample_BI_Release_and_Disbursement_Statement.pdf", title:"Sample BI Release & Settlement Disbursement Statement", cms:"Case Files", day:2, desc:"Blank release with PD scope, non-admission, lien indemnity; blank disbursement statement.", key:""},
  {id:"TPL4", folder:"templates", file:"templates/Sample_UM_Waiver_and_Consent_to_Settle.pdf", title:"Sample UM Waiver of Subrogation & Consent to Settle", cms:"Case Files", day:3, desc:"The 'green light' before any BI release when UM/UIM may be needed.", key:""},
  {id:"TPL5", folder:"templates", file:"templates/Standard_Safe_Settlement_Release_Form.docx", title:"Standard Safe Settlement Release (editable)", cms:"Case Files", day:2, desc:"Proportionate BI-only release — the counter-draft to the defective release.", key:""},
  {id:"TPL6", folder:"templates", file:"templates/Nine_Mock_PI_Cases.pdf", title:"9 Mock Personal Injury Cases", cms:"Others", day:1, desc:"Extra practice files for intake, coverage and liability drills.", key:""}
];

// The handouts live in the LSH Knowledge Base (Case Management collection, one "CM Training · Day N" section per day),
// where trainers add more. The Portal signs the reader in and opens that collection.
window.CM_KB_URL = "https://cm-training-activity.pages.dev/api/launch?tool=kb&to=cmkb";

window.cmDoc = function(id){ return (window.CM_DOCS||[]).find(d=>d.id===id); };
window.cmDocUrl = function(d){ return "documents/" + d.file.split("/").map(encodeURIComponent).join("/"); };
