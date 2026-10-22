/* The LSH Net Sheet, in the course (net-sheet.html): the firm's own template (documents/templates/
   LSH_Net_Sheet_v2_FIXED.xlsx, "LSH Net Sheet") with its four sections, rows and formulas, so a trainee works John
   Doe's settlement math where the Case Flow asks for it, side by side with the slide (or on a second screen):
     1. Settlement Recovery Summary     L7 gross
     2. Attorney Fees & Case Expenses   L11 = L7 × C11 (33⅓% pre-suit), L20 = SUM(L12:L19), L21 = L11 + L20
     3. Medical Provider Ledger & Liens I = D – E – F – G – H per row; J, K, L totals in row 44
     4. Final Client Disbursement       L52 = L7 – L11 – L20 – L44
   It opens completely unpopulated, on purpose: the exercise is the data entry, the line-item bill audit and the
   arithmetic, so nothing is pre-filled — not a provider name, not a charge, not the fee tier. Every figure comes
   from a document on the file.
   The trainee's sheet is kept on their record ("net-sheet", one of the personal keys, so it syncs with their
   progress and their trainer sees it). Each stage runs the way the Demand Draft does — the trainee's own work
   first, the reference afterwards: "Check my sheet" tests it against the file, and only then does "✓ Corrected
   sheet" reveal the finalized reference Net Sheet for that stage, line by line against what they entered, to
   compare, review and self-audit (it downloads too).
   It is used where the money is worked, and nowhere else. Track A (settled before suit) builds the sheet as the
   money arrives: the BI settlement (?stage=bi — the first Net Sheet, generated from the medical and treatment
   bills on Keystone's $10,000 tender), the UM settlement (?stage=um — the same sheet updated with the revised,
   ongoing and final treatment bills and lien balances, at $40,000.00 gross), Lien Negotiations (?stage=liens) and
   Disbursement (?stage=final, $20,359.92). Track B (case won at arbitration) has its own close-out
   (?stage=litigation, $14,713.75). Each track is its own sheet.
   "Download" gives the sheet as an .xlsx, formulas and all, to open in Excel or upload to Google Sheets. */
(function(){
"use strict";
const $ = s => document.querySelector(s);
const E = s => String(s == null ? "" : s).replace(/[&<>"]/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;"})[c]);
const D = window.CM_CASE_DATES, T = s => D ? D.text(s) : s;   // the case's dates, in the trainee's case year
const KEY = "net-sheet";
const COSTS = [[12, "Filing fees & Summons"], [13, "Process Server"], [14, "Mediation"], [15, "CME Videographer"], [16, "Deposition"], [17, "Postage"], [18, "Medical records/bills req."], [19, "File Storage fee"]];
const LEDGER = [25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40, 42, 43];
const MONEY_COLS = ["D", "E", "F", "G", "H", "J", "K", "L"];
// The sheet starts blank. Nothing is pre-filled: the trainee enters every provider, charge, payment, adjustment,
// cost and rate from the documents on the file, and the template's formulas do the rest.
const BLANK = {};
/* ---------- the finalized reference Net Sheet, revealed after the trainee's own audit ----------
   The provider ledger as the bills and statements prove it (RS22–RS26, RS41, RS42): charges in Total Charges, each
   payer in its own column, audit corrections in Adjustments. Zero-balance lines stay at zero and off the payables. */
const REF_LEDGER = {
  B25: "Urgent care", C25: "Riverton Urgent Care (DOS 02/20/2026) — paid in full by Riverton PIP", D25: 685, E25: 685,
  B26: "Chiro / PT (LOP)", C26: "Riverton Spine & Rehab — itemized LOP ledger, 34 lines billed against 33 documented visits", D26: 6290, H26: 185,
  B27: "Orthopedics", C27: "Lakeside Orthopedics — 3 visits × $640.00, paid by Riverton PIP (the 06/12/2026 payment exhausted the $5,000.00 limit)", D27: 1920, E27: 1920,
  B28: "MRI", C28: "Summit Imaging Center — cervical MRI 03/13/2026, paid by Riverton PIP", D28: 2395, E28: 2395,
  B29: "Pain management", C29: "Crescent Pain & Spine — ESI 05/15/2026, in network: the $1,540.00 write-off is not a balance", D29: 3400, F29: 1860, H29: 1540,
  B30: "Health plan lien", C30: "Peach State Health Plan — itemized reimbursement claim (fully insured group plan)", D30: 1860,
  B42: "Pre-Settlement Funding", C42: "None reported", B43: "Prior Attorney", C43: "None"
};
/* The receipted costs, by the Case Cost Ledger's own categories (RS44). Only the total is graded: any split that
   comes to it, each line traceable to its receipt, ties out. */
const REF_COSTS_A = {
  C17: "Certified mail with return receipt $72.00 + postage and copies $150.00", L17: 222,
  C18: "Police report $25.00 + medical records and billing $214.75 + MRI images on disc $25.00", L18: 264.75
};
const REF_COSTS_B = Object.assign({}, REF_COSTS_A, {
  C12: "Complaint filing fee and summons, 09/24/2026", L12: 218,
  C13: "Allied Process Services — service of process", L13: 285,
  C14: "Mediation (Hon. Carla Benton, plaintiff's half) $1,200.00 + arbitration (plaintiff's share of the arbitrator's fee) $900.00", L14: 2100,
  C16: "Riverton Court Reporting — deposition transcript", L16: 645.5,
  C18: "Police report $25.00 + records and billing $214.75 + MRI disc $25.00 + certified records for the binder $160.00", L18: 424.75
});
const REF_GROSS_A = {C7: "Keystone Mutual BI $10,000.00 + Harbor Point Host UM $20,000.00 + Cardinal State Relative UM $10,000.00", L7: 40000};
const ref = (...parts) => Object.assign({}, REF_LEDGER, ...parts);
/* what the file says at each stage (build/case-flow: d3m2-a1, d3m2-a2, d3m3-a2, d3m4-a1, d5m5-a1): `how` is the
   trainee's instruction for the stage, `checks` the figures tested, `cells` the corrected sheet revealed after */
const STAGES = {
  bi: {
    file: "A", label: "Track A · BI settlement: the first Net Sheet from the bills", when: "08/12/2026 — Keystone Mutual tenders its $10,000.00 BI limits",
    how: [
      "Section 1 — the gross actually recovered: Keystone Mutual's $10,000.00 BI limits, tendered 08/12/2026 (KM-26-440871). Riverton's PIP payments and the property damage to Margaret's Civic are not recovery.",
      "Section 2 — the fee rate from the signed Retainer Agreement (the pre-suit tier: no suit has been filed), then every receipted cost from the Case Cost Ledger, on the row it belongs to.",
      "Section 3 — build the provider ledger line by line from the medical and treatment bills: Riverton Urgent Care, Riverton Spine & Rehab, Lakeside Orthopedics, Summit Imaging, Crescent Pain & Spine, and Peach State's reimbursement claim. Charges in Total Charges, each payment in its own payer column, audit corrections in Adjustments.",
      "Audit every bill before you type it: the 05/04/2026 line billed twice on Riverton's ledger is an Adjustment, not a balance, and Crescent's $1,540.00 patient statement is the in-network contractual write-off.",
      "Reduced Bill — nothing is reduced yet, so each open lien carries its audited balance and the PIP-paid providers stay at zero.",
      "Then read Section 4: what the BI layer alone leaves John Doe is the reason the UM layers matter."
    ],
    checks: [
      {cell: "L7", want: 10000, why: "Gross at the BI settlement: Keystone Mutual's $10,000.00 BI limits, tendered 08/12/2026. PIP and the property-damage payments are not recovery."},
      {cell: "L11", want: 3333.33, why: "The fee is 33⅓% pre-suit (no suit filed): one-third of $10,000.00 = $3,333.33. Typing 33.33% gives $3,333.00."},
      {cell: "L20", want: 486.75, why: "Receipted costs: Police Report $25.00, records and billing $214.75, certified mail $72.00, MRI disc $25.00, postage and copies $150.00 = $486.75."},
      {cell: "I26", want: 6105, why: "Riverton Spine & Rehab: 34 lines billed, 33 visits in the notes. The 05/04/2026 duplicate ($185.00) goes in Adjustments: $6,290.00 → $6,105.00 audited."},
      {cell: "I44", want: 7965, why: "Liens audited before any reduction: Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00. Crescent's write-off and the PIP-paid providers stay at zero."},
      {cell: "L44", want: 7965, why: "Nothing is reduced yet, so the payables are the audited balances: $1,860.00 + $6,105.00 = $7,965.00."},
      {cell: "L52", want: -1785.08, why: "BI alone leaves John Doe nothing: $10,000.00 – $3,333.33 – $486.75 = $6,179.92 against $7,965.00 of unreduced liens, so the sheet runs $1,785.08 short. That is the case for the UM layers, and for every reduction."}
    ],
    cells: ref({C7: "Keystone Mutual BI limits, tendered 08/12/2026 (KM-26-440871)", L7: 10000, C11: "33⅓%", L26: 6105, L30: 1860}, REF_COSTS_A)
  },
  um: {
    file: "A", label: "Track A · UM settlement: the bills and lien balances updated", when: "10/06/2026 — both UM layers have tendered their limits",
    how: [
      "Section 1 — add both UM layers to the gross: Harbor Point's Host UM $20,000.00 (paid 09/29/2026) and Cardinal State's Relative UM $10,000.00 (tendered 10/06/2026). $40,000.00 recovered in all.",
      "Section 2 — the fee stays on the pre-suit tier (the file settled without suit); bring the costs up to date from the Case Cost Ledger, each with its receipt.",
      "Section 3 — update every treatment line from the bills and statements that came in after the BI settlement: Riverton Spine & Rehab's final LOP ledger (02/24–06/05/2026) and Peach State's itemized reimbursement claim.",
      "Re-verify each balance with the provider before you change a figure, and re-run the audit on the final ledger: the 05/04/2026 duplicate is still on it.",
      "Reduced Bill still carries the audited balance: the reductions are negotiated next, and only a written acceptance moves that column.",
      "Check your sheet, then open the corrected sheet and self-audit every line you changed."
    ],
    checks: [
      {cell: "L7", want: 40000, why: "Gross: Keystone BI $10,000.00 + Harbor Point UM $20,000.00 + Cardinal State UM $10,000.00 = $40,000.00 (PIP and PD are not recovery)."},
      {cell: "L11", want: 13333.33, why: "The fee is 33⅓% pre-suit (no suit filed): one-third of $40,000.00 = $13,333.33. Typing 33.33% gives $13,332.00."},
      {cell: "I26", want: 6105, why: "Riverton's final LOP ledger still carries the 05/04/2026 duplicate ($185.00): audited $6,290.00 → $6,105.00, corrected in writing before any reduction is asked."},
      {cell: "I44", want: 7965, why: "The verified balances at the UM settlement: Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00."},
      {cell: "L44", want: 7965, why: "No reduction has been accepted in writing yet (Peach State 10/09, Riverton 10/12/2026), so the payables are still the audited $7,965.00."},
      {cell: "L52", want: 18214.92, why: "Before the reductions: $40,000.00 – $13,333.33 – $486.75 – $7,965.00 = $18,214.92. The lien negotiations take it to $20,359.92."}
    ],
    cells: ref(REF_GROSS_A, {C11: "33⅓%", L26: 6105, L30: 1860}, REF_COSTS_A)
  },
  liens: {
    file: "A", label: "Track A · Lien negotiations", when: "10/12/2026 — both reductions accepted in writing",
    how: [
      "Audit Riverton Spine & Rehab's final ledger line by line against the visit notes before asking for anything, and put the correction in Adjustments.",
      "Enter a reduction in Reduced Bill only once it is accepted in writing: Peach State's acceptance (10/09/2026) and Riverton's signed Payoff Letter (10/12/2026).",
      "Leave the zero-balance lines at zero: a line paid by PIP, or written off in network, is never a payable."
    ],
    checks: [
      {cell: "I26", want: 6105, why: "Riverton Spine & Rehab: 34 lines billed, 33 visits in the notes. The 05/04/2026 duplicate ($185.00) goes in Adjustments: $6,290.00 → $6,105.00 audited."},
      {cell: "I44", want: 7965, why: "Liens audited before any reduction: Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00. Zero-balance lines stay at zero."},
      {cell: "L30", want: 1240, why: "Peach State: $1,860.00 less the one-third procurement-cost reduction ($620.00) = $1,240.00, accepted in writing 10/09/2026."},
      {cell: "L26", want: 4580, why: "Riverton Spine & Rehab: audited $6,105.00, accepted $4,580.00 in its signed Payoff Letter (10/12/2026)."},
      {cell: "L44", want: 5820, why: "Reduced liens: $1,240.00 + $4,580.00 = $5,820.00."}
    ],
    cells: ref(REF_GROSS_A, {C11: "33⅓%", L26: 4580, L30: 1240}, REF_COSTS_A)
  },
  final: {
    file: "A", label: "Track A · Disbursement: the final Net Sheet", when: "10/13/2026 — the last UM check is in trust",
    how: [
      "Prove the gross by check: Keystone $10,000.00, Harbor Point $20,000.00, Cardinal State $10,000.00, each deposited after its release was signed.",
      "The fee on the pre-suit tier, and all five receipted cost categories from the Case Cost Ledger.",
      "Every provider and payer on the ledger with charges, payments, adjustments and balance owed, and each lien at the figure accepted in writing.",
      "Section 4 is what John Doe signs for: tie it to the Trust Ledger before it goes to Atty. Thorne."
    ],
    checks: [
      {cell: "L7", want: 40000, why: "Gross: Keystone BI $10,000.00 + Harbor Point UM $20,000.00 + Cardinal State UM $10,000.00 = $40,000.00 (PIP and PD are not recovery)."},
      {cell: "L11", want: 13333.33, why: "The fee is 33⅓% pre-suit (no suit filed): one-third of $40,000.00 = $13,333.33. Typing 33.33% gives $13,332.00."},
      {cell: "L20", want: 486.75, why: "Receipted costs: Police Report $25.00, records and billing $214.75, certified mail $72.00, MRI disc $25.00, postage and copies $150.00 = $486.75."},
      {cell: "L26", want: 4580, why: "Riverton Spine & Rehab: audited $6,105.00, accepted $4,580.00 in its signed Payoff Letter (10/12/2026)."},
      {cell: "L30", want: 1240, why: "Peach State: $1,860.00 less the one-third procurement-cost reduction ($620.00) = $1,240.00, accepted in writing 10/09/2026."},
      {cell: "L44", want: 5820, why: "Reduced liens: $1,240.00 + $4,580.00 = $5,820.00. Zero-balance lines stay off the payables."},
      {cell: "L52", want: 20359.92, why: "Net to John Doe: $40,000.00 – $13,333.33 – $486.75 – $5,820.00 = $20,359.92."}
    ],
    cells: ref(REF_GROSS_A, {C11: "33⅓%", L26: 4580, L30: 1240}, REF_COSTS_A)
  },
  litigation: {
    file: "B", label: "Track B · Case won: the litigated Net Sheet", when: "07/22/2027 — the award is collected",
    how: [
      "Section 1 — the gross by carrier: Keystone's $10,000.00 from the 03/18/2027 mediation, and Harbor Point's $20,000.00 and Cardinal State's $10,000.00 from the 07/06/2027 award.",
      "Section 2 — the fee tier the retainer sets once suit is filed, and every litigation cost on its own row with its receipt, on top of the pre-suit costs.",
      "Section 3 — the same audited bills, each lien reduced against the litigated fund at the fee actually charged and accepted in writing.",
      "Section 4 — the net, tied to the trust deposits, before John Doe signs the Settlement Statement."
    ],
    checks: [
      {cell: "L7", want: 40000, why: "Gross: Keystone $10,000.00 (mediation, 03/18/2027) + Harbor Point $20,000.00 + Cardinal State $10,000.00 (award, 07/06/2027) = $40,000.00."},
      {cell: "L11", want: 16000, why: "Suit was filed 09/24/2026, so the retainer's 40% tier applies: $16,000.00. The 33⅓% pre-suit rate would give $13,333.33."},
      {cell: "L20", want: 3895.25, why: "Receipted costs: pre-suit $486.75 + filing $218.00 + Allied Process Services $285.00 + mediation $1,200.00 + arbitration $900.00 + Riverton Court Reporting $645.50 + certified records $160.00 = $3,895.25."},
      {cell: "I26", want: 6105, why: "Riverton Spine & Rehab is still audited first: the 05/04/2026 duplicate ($185.00) in Adjustments, $6,290.00 → $6,105.00."},
      {cell: "L26", want: 4275, why: "Riverton Spine & Rehab accepted $4,275.00 in its signed Payoff Letter (07/16/2027)."},
      {cell: "L30", want: 1116, why: "Peach State's reduction follows the fee actually charged: 40% of $1,860.00 = $744.00, so $1,116.00, accepted in writing 07/14/2027."},
      {cell: "L44", want: 5391, why: "Reduced liens: $1,116.00 + $4,275.00 = $5,391.00."},
      {cell: "L52", want: 14713.75, why: "Net to John Doe: $40,000.00 – $16,000.00 – $3,895.25 – $5,391.00 = $14,713.75."}
    ],
    cells: ref({C7: "Keystone $10,000.00 (mediation 03/18/2027) + Harbor Point $20,000.00 + Cardinal State $10,000.00 (award 07/06/2027)", L7: 40000, C11: "40%", L26: 4275, L30: 1116}, REF_COSTS_B)
  }
};
const PARAM = new URLSearchParams(location.search).get("stage");
const ALIAS = {recovery: "bi"};   // the sheet opened on one Settlement Negotiations stage before; those links still work
const STAGE = STAGES[ALIAS[PARAM] || PARAM] ? (ALIAS[PARAM] || PARAM) : "final";
const FILE = STAGES[STAGE].file;   // "A" or "B": each track is its own sheet
/* ---------- the trainee's sheet, kept with their progress ---------- */
const host = (() => { for(const w of [window.parent, window.opener]){ try{ if(w && w !== window && typeof w.storeSet === "function") return w; }catch(e){} } return null; })();
async function load(){
  let v = null;
  try{ if(host) v = await host.storeGet(KEY); }catch(e){}
  if(!v) try{ v = JSON.parse(localStorage.getItem("lsh_" + KEY) || "null"); }catch(e){}
  if(v && v.cells && !v.files) v = {v: 2, files: {A: {cells: v.cells, checks: v.checks || {}}}};   // the first version kept one sheet: Track A's
  v = v && v.files ? v : {v: 2, files: {}};
  v.files[FILE] = v.files[FILE] || {cells: Object.assign({}, BLANK), checks: {}};
  // a sheet checked when Settlement Negotiations was one stage keeps that result, under the stage it is now
  Object.keys(v.files).forEach(k => { const f = v.files[k]; if(f && f.checks && f.checks.recovery && !f.checks.bi){ f.checks.bi = f.checks.recovery; delete f.checks.recovery; } });
  return v;
}
let RECORD = null, SHEET = null, saveT = null;
function write(){
  saveT = null;
  try{ localStorage.setItem("lsh_" + KEY, JSON.stringify(RECORD)); }catch(e){}
  try{ if(host){ host.storeSet(KEY, RECORD); setStatus("Saved"); return; } }catch(e){}   // writes this device's copy at once, then syncs
  setStatus("Saved on this device");
}
function save(){
  SHEET.updatedAt = RECORD.updatedAt = new Date().toISOString();
  clearTimeout(saveT);
  saveT = setTimeout(write, 300);
  setStatus("Saving…");
}
// closing the sheet (✕, another stage replacing it, the tab hidden) never loses the last entry
const flush = () => { if(saveT){ clearTimeout(saveT); write(); } };
window.addEventListener("pagehide", flush);
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "hidden") flush(); });
const setStatus = t => { const el = $("#ns-status"); if(el) el.textContent = t; };
/* ---------- the math, as the template's formulas ---------- */
const num = v => { if(typeof v === "number") return v; const s = String(v == null ? "" : v).replace(/[$,\s]/g, ""); if(!s) return 0; const n = Number(s.replace(/[()]/g, "")); return isNaN(n) ? 0 : (/^\(.*\)$/.test(s) ? -n : n); };
function rate(v){   // "33⅓%", "1/3", "33.3333", "0.333…" → a fraction
  const s = String(v == null ? "" : v).trim();
  if(/⅓|1\/3/.test(s)) return 1 / 3;
  if(/^40\s*%?$/.test(s)) return 0.4;
  const n = num(s.replace("%", ""));
  return n > 1 ? n / 100 : n;
}
const r2 = n => Math.round(n * 100) / 100;
function calc(cells){
  const c = cells || SHEET.cells, g = k => num(c[k]), out = {};
  out.L7 = g("L7");
  out.L11 = r2(out.L7 * rate(c.C11));
  out.L20 = r2(COSTS.reduce((s, [r]) => s + g("L" + r), 0));
  out.L21 = r2(out.L11 + out.L20);
  LEDGER.forEach(r => { out["I" + r] = r2(g("D" + r) - g("E" + r) - g("F" + r) - g("G" + r) - g("H" + r)); out["L" + r] = g("L" + r); });
  ["I", "J", "K", "L"].forEach(col => { out[col + "44"] = r2(LEDGER.reduce((s, r) => s + (col === "I" ? out["I" + r] : g(col + r)), 0)); });
  out.L48 = out.L7; out.L49 = -out.L11; out.L50 = -out.L20; out.L51 = -out.L44;
  out.L52 = r2(out.L48 + out.L49 + out.L50 + out.L51);
  return out;
}
const money = n => (n < 0 ? "–" : "") + "$" + Math.abs(n).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
/* ---------- the sheet on the page ---------- */
const inp = (k, cls, money) => `<input class="ns-in ${cls || ""}" data-k="${k}" value="${E(SHEET.cells[k] != null ? (money && typeof SHEET.cells[k] === "number" ? SHEET.cells[k].toFixed(2) : T(String(SHEET.cells[k]))) : "")}" ${money ? 'inputmode="decimal"' : ""} aria-label="${k}">`;
const out = k => `<output class="ns-out" data-o="${k}"></output>`;
function render(){
  $("#ns").innerHTML = `
    <section class="ns-sec"><h2>1. Settlement Recovery Summary</h2>
      <table class="ns-t"><tr><th>Description</th><th>Reference</th><th class="m">Amount</th></tr>
        <tr><td>Gross Settlement</td><td>${inp("C7", "wide")}</td><td class="m">${inp("L7", "", true)}</td></tr></table></section>
    <section class="ns-sec"><h2>2. Attorney Fees &amp; Advanced Case Expenses</h2>
      <table class="ns-t"><tr><th>Expense Type</th><th>Details</th><th class="m">Amount</th></tr>
        <tr><td>Attorney Fees</td><td>${inp("C11", "pct")} <small>of the gross (33⅓% pre-suit, 40% once suit is filed)</small></td><td class="m">${out("L11")}</td></tr>
        ${COSTS.map(([r, l]) => `<tr><td>${E(l)}</td><td>${inp("C" + r, "wide")}</td><td class="m">${inp("L" + r, "", true)}</td></tr>`).join("")}
        <tr class="tot"><td>Total Attorney Costs</td><td></td><td class="m">${out("L20")}</td></tr>
        <tr class="tot"><td>Total Fees &amp; Costs</td><td></td><td class="m">${out("L21")}</td></tr></table></section>
    <section class="ns-sec"><h2>3. Medical Provider Ledger &amp; Lien Reductions</h2>
      <div class="ns-scroll"><table class="ns-t ns-ledger"><tr><th>Provider Type</th><th>Provider Name</th><th class="m">Total Charges</th><th class="m">PIP Payments</th><th class="m">Health Payments</th><th class="m">PIP</th><th class="m">Adjustments</th><th class="m">Balance Owed</th><th class="m">Max Offer</th><th class="m">Low Offer</th><th class="m">Reduced Bill</th></tr>
        ${LEDGER.map(r => `${r === 42 ? '<tr class="gap"><td colspan="11"></td></tr>' : ""}<tr><td>${inp("B" + r)}</td><td>${inp("C" + r, "wide")}</td>${["D", "E", "F", "G", "H"].map(col => `<td class="m">${inp(col + r, "", true)}</td>`).join("")}<td class="m">${out("I" + r)}</td>${["J", "K", "L"].map(col => `<td class="m">${inp(col + r, "", true)}</td>`).join("")}</tr>`).join("")}
        <tr class="tot"><td colspan="7">Total Liens &amp; Reductions</td><td class="m">${out("I44")}</td><td class="m">${out("J44")}</td><td class="m">${out("K44")}</td><td class="m">${out("L44")}</td></tr></table></div></section>
    <section class="ns-sec"><h2>4. Final Client Disbursement Calculation</h2>
      <table class="ns-t"><tr><th>Calculation</th><th class="m">Amount</th></tr>
        <tr><td>Gross Settlement</td><td class="m">${out("L48")}</td></tr><tr><td>Less: Attorney Fees</td><td class="m">${out("L49")}</td></tr>
        <tr><td>Less: Advanced Case Expenses</td><td class="m">${out("L50")}</td></tr><tr><td>Less: Total Liens (Reduced)</td><td class="m">${out("L51")}</td></tr>
        <tr class="net"><td>NET CLIENT DISBURSEMENT</td><td class="m">${out("L52")}</td></tr></table></section>`;
  $("#ns-stage").value = STAGE;
  // an amount reads as money once you leave its cell
  $("#ns").querySelectorAll(".m .ns-in").forEach(el => el.addEventListener("blur", () => { const v = SHEET.cells[el.dataset.k]; if(typeof v === "number") el.value = v.toFixed(2); }));
  $("#ns").querySelectorAll(".ns-in").forEach(el => el.addEventListener("input", () => { const k = el.dataset.k, m = MONEY_COLS.includes(k[0]) && k !== "C11"; SHEET.cells[k] = m && el.value.trim() !== "" && !isNaN(num(el.value)) ? num(el.value) : el.value; paint(); save(); }));
  paint(); showBrief(); showCheck();
}
function paint(){
  const o = calc();
  document.querySelectorAll("#ns [data-o]").forEach(el => { const v = o[el.dataset.o]; el.textContent = money(v || 0); el.classList.toggle("neg", v < 0); });
}
/* ---------- the stage's instructions: what to build here, and from what ---------- */
function showBrief(){
  const st = STAGES[$("#ns-stage").value] || STAGES[STAGE], box = $("#ns-brief");
  if(!box) return;
  box.innerHTML = `<b>${E(st.label)}</b> <span class="ns-when">${E(T(st.when))}</span>
    <ol>${st.how.map(s => `<li>${E(T(s))}</li>`).join("")}</ol>
    <p class="ns-gate">Work it yourself first: <b>Check my sheet</b> tests your figures against the file, and the <b>corrected sheet</b> opens once you have.</p>`;
}
/* ---------- Check my sheet ---------- */
function valueOf(expr, o){ return r2(expr.split("+").reduce((s, k) => s + (o[k] != null ? o[k] : num(SHEET.cells[k])), 0)); }
function check(){
  const stage = $("#ns-stage").value, st = STAGES[stage], o = calc();
  const items = st.checks.map(c => { const got = valueOf(c.cell, o); return {cell: c.cell, ok: Math.abs(got - c.want) < 0.005, got, want: c.want}; });
  SHEET.checks = SHEET.checks || {};
  SHEET.checks[stage] = {passed: items.filter(x => x.ok).length, total: items.length, at: new Date().toISOString(), items: items.map(x => ({cell: x.cell, ok: x.ok, got: x.got}))};
  save(); showCheck(true); refButton();
}
function showCheck(fresh){
  const stage = $("#ns-stage").value, st = STAGES[stage], r = (SHEET.checks || {})[stage], box = $("#ns-check");
  if(!r){ box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = `<b>${r.passed === r.total ? "✓ Your sheet ties out" : `${r.passed} of ${r.total} tie out`}</b> · ${E(st.label)} · checked ${E(new Date(r.at).toLocaleString())}
    <ul>${st.checks.map((c, j) => { const it = r.items[j] || {}; return `<li class="${it.ok ? "ok" : "miss"}">${it.ok ? "✓" : "✗"} <code>${E(c.cell)}</code> ${it.ok ? money(c.want) : `is ${money(it.got || 0)}, the file says ${money(c.want)}`}${it.ok ? "" : `<br><span>${E(T(c.why))}</span>`}</li>`; }).join("")}</ul>`;
  if(fresh) box.scrollIntoView({block: "nearest", behavior: "smooth"});
}
/* ---------- the corrected, finalized Net Sheet, for comparison and self-audit ----------
   The reference sheet for this stage, read-only, with every line the trainee entered differently marked and their
   own figure beneath it. It never writes to their sheet, and it downloads as its own .xlsx. */
const checked = stage => !!((SHEET.checks || {})[stage || $("#ns-stage").value]);
function refButton(){
  const btn = $("#ns-ref-btn"); if(!btn) return;
  const ok = checked();
  btn.disabled = !ok;
  btn.title = ok ? "The finalized Net Sheet this stage reaches, line by line against yours" : "Check your sheet first: the corrected sheet opens after your own audit";
}
function toggleRef(){
  const stage = $("#ns-stage").value, box = $("#ns-ref");
  if(!checked(stage)) return;
  if(!box.hidden){ box.hidden = true; return; }
  SHEET.revealed = Object.assign({}, SHEET.revealed, {[stage]: new Date().toISOString()});
  save(); showRef();
}
const same = (a, b) => {
  if(a == null || a === "") return b == null || b === "";
  if(typeof b === "number" || typeof a === "number") return Math.abs(num(a) - num(b)) < 0.005;
  return String(a).trim().toLowerCase() === String(b).trim().toLowerCase();
};
const show$ = v => v == null || v === "" ? "—" : (typeof v === "number" ? money(v) : E(T(String(v))));
function cmp(want, mine, fmt){
  const f = fmt || show$;
  return same(mine, want) ? `<span class="ns-ref-ok">${f(want)}</span>` : `<span class="ns-ref-fix">${f(want)}</span><span class="ns-ref-mine">yours: ${f(mine)}</span>`;
}
/* A figure is right or wrong, so it is compared to the cent. The firm's wording in a Provider Type, Provider Name or
   Details cell is a model, not a graded figure: it is shown beside the trainee's own without marking theirs wrong,
   and only an empty cell is flagged. */
function refCell(k, c){
  const want = c[k], mine = SHEET.cells[k];
  if(MONEY_COLS.includes(k[0])) return cmp(want, mine);
  if(want == null || want === "") return `<span class="ns-ref-ok">${show$(mine)}</span>`;
  if(mine == null || String(mine).trim() === "") return `<span class="ns-ref-fix">${show$(want)}</span><span class="ns-ref-mine">yours: —</span>`;
  return `<span class="ns-ref-ok">${show$(want)}</span>${same(mine, want) ? "" : `<span class="ns-ref-mine">yours: ${show$(mine)}</span>`}`;
}
const refOut = (k, o, mine) => cmp(o[k], mine[k], v => money(v || 0));
function showRef(){
  const stage = $("#ns-stage").value, st = STAGES[stage], box = $("#ns-ref");
  if(!box || !checked(stage)) return;
  const c = st.cells, o = calc(c), mine = calc();
  const rows = LEDGER.filter(r => c["B" + r] != null || c["C" + r] != null || SHEET.cells["B" + r] || SHEET.cells["C" + r] || num(SHEET.cells["D" + r]));
  const costRows = COSTS.filter(([r]) => c["L" + r] != null || num(SHEET.cells["L" + r]));
  const tot = (label, k, net) => `<tr class="${net ? "net" : "tot"}"><td>${E(label)}</td><td class="m">${refOut(k, o, mine)}</td></tr>`;
  box.hidden = false;
  box.innerHTML = `<div class="ns-ref-head"><b>✓ The corrected Net Sheet — ${E(st.label)}</b>
      <small>The finalized sheet this stage reaches on the file, as the firm would keep it. A figure in orange is a line to review, with “yours” beneath it. Nothing here changes your own sheet.</small>
      <button type="button" id="ns-ref-dl" class="ns-ref-dl">⬇ Download the corrected sheet</button></div>
    <section class="ns-sec"><h2>1. Settlement Recovery Summary</h2>
      <table class="ns-t"><tr><th>Description</th><th>Reference</th><th class="m">Amount</th></tr>
        <tr><td>Gross Settlement</td><td>${refCell("C7", c)}</td><td class="m">${refCell("L7", c)}</td></tr></table></section>
    <section class="ns-sec"><h2>2. Attorney Fees &amp; Advanced Case Expenses</h2>
      <table class="ns-t"><tr><th>Expense Type</th><th>Details</th><th class="m">Amount</th></tr>
        <tr><td>Attorney Fees</td><td>${refCell("C11", c)}</td><td class="m">${refOut("L11", o, mine)}</td></tr>
        ${costRows.map(([r, l]) => `<tr><td>${E(l)}</td><td>${refCell("C" + r, c)}</td><td class="m">${refCell("L" + r, c)}</td></tr>`).join("")}
        ${tot("Total Attorney Costs", "L20")}</table>
      <p class="ns-ref-note">Only the total is graded: any split of the Case Cost Ledger's categories that comes to ${money(o.L20)}, each line traceable to its receipt, ties out.</p></section>
    <section class="ns-sec"><h2>3. Medical Provider Ledger &amp; Lien Reductions</h2>
      <div class="ns-scroll"><table class="ns-t ns-ledger"><tr><th>Provider Type</th><th>Provider Name</th><th class="m">Total Charges</th><th class="m">PIP</th><th class="m">Health</th><th class="m">Med Pay</th><th class="m">Adjustments</th><th class="m">Balance Owed</th><th class="m">Reduced Bill</th></tr>
        ${rows.map(r => `<tr><td>${refCell("B" + r, c)}</td><td>${refCell("C" + r, c)}</td>${["D", "E", "F", "G", "H"].map(col => `<td class="m">${refCell(col + r, c)}</td>`).join("")}<td class="m">${refOut("I" + r, o, mine)}</td><td class="m">${refCell("L" + r, c)}</td></tr>`).join("")}
        <tr class="tot"><td colspan="7">Total Liens Audited (Balance Owed)</td><td class="m">${refOut("I44", o, mine)}</td><td class="m">${refOut("L44", o, mine)}</td></tr></table></div></section>
    <section class="ns-sec"><h2>4. Final Client Disbursement Calculation</h2>
      <table class="ns-t"><tr><th>Calculation</th><th class="m">Amount</th></tr>
        ${tot("Gross Settlement", "L48")}${tot("Less: Attorney Fees", "L49")}${tot("Less: Advanced Case Expenses", "L50")}${tot("Less: Total Liens (Reduced)", "L51")}${tot("NET CLIENT DISBURSEMENT", "L52", true)}</table></section>
    <div class="ns-ref-why"><b>Why each figure is what it is</b><ul>${st.checks.map(x => `<li><code>${E(x.cell)}</code> ${E(T(x.why))}</li>`).join("")}</ul></div>`;
  $("#ns-ref-dl").addEventListener("click", () => download(c, "Corrected"));
  box.scrollIntoView({block: "nearest", behavior: "smooth"});
}
/* ---------- Download: the same sheet, formulas and all ---------- */
function download(cells, tag){
  if(!window.XLSX){ alert("The download needs a moment to load. Try again."); return; }
  const ws = {}, c = cells || SHEET.cells, set = (k, v) => { if(v === "" || v == null) return; ws[k] = typeof v === "number" ? {t: "n", v, z: "$#,##0.00"} : {t: "s", v: T(String(v))}; }, f = (k, fx) => { ws[k] = {t: "n", f: fx, z: "$#,##0.00"}; };
  set("C1", `LSH Net Sheet — John Doe v. Robert Smith (from the course)${tag ? ` — corrected reference, ${STAGES[STAGE].label}` : ""}`);
  set("B5", "1. SETTLEMENT RECOVERY SUMMARY"); set("B6", "Description"); set("C6", "Reference"); set("L6", "Amount");
  set("B7", "Gross Settlement"); set("C7", c.C7); set("L7", num(c.L7));
  set("B9", "2. ATTORNEY FEES & ADVANCED CASE EXPENSES"); set("B10", "Expense Type"); set("C10", "Details"); set("L10", "Amount");
  set("B11", "Attorney Fees"); ws.C11 = {t: "n", v: rate(c.C11), z: "0.00%"}; f("L11", "L7*C11");
  COSTS.forEach(([r, l]) => { set("B" + r, l); set("C" + r, c["C" + r]); set("L" + r, num(c["L" + r])); });
  set("B20", "Total Attorney Costs"); f("L20", "SUM(L12:L19)"); set("B21", "Total Fees & Costs"); f("L21", "L11+L20");
  set("B23", "3. MEDICAL PROVIDER LEDGER & LIEN REDUCTIONS");
  ["Provider Type", "Provider Name", "Total Charges", "PIP Payments", "Health Payments", "PIP", "Adjustments", "Balance Owed", "Max Offer", "Low Offer", "Reduced Bill"].forEach((h, i) => set("BCDEFGHIJKL"[i] + "24", h));
  LEDGER.forEach(r => { set("B" + r, c["B" + r]); set("C" + r, c["C" + r]); ["D", "E", "F", "G", "H", "J", "K", "L"].forEach(col => { if(c[col + r] !== undefined && c[col + r] !== "") set(col + r, num(c[col + r])); }); f("I" + r, `D${r}-E${r}-F${r}-G${r}-H${r}`); if(ws["L" + r] == null) set("L" + r, 0); });
  set("B44", "Total Liens & Reductions"); ["I", "J", "K", "L"].forEach(col => f(col + "44", `SUM(${col}25:${col}43)`));
  set("B46", "4. FINAL CLIENT DISBURSEMENT CALCULATION"); set("B47", "Calculation"); set("L47", "Amount");
  set("B48", "Gross Settlement"); f("L48", "L7"); set("B49", "Less: Attorney Fees"); f("L49", "-L11"); set("B50", "Less: Advanced Case Expenses"); f("L50", "-L20");
  set("B51", "Less: Total Liens (Reduced)"); f("L51", "-L44"); set("B52", "NET CLIENT DISBURSEMENT"); f("L52", "SUM(L48:L51)");
  ws["!ref"] = "A1:L52"; ws["!cols"] = [{wch: 2}, {wch: 26}, {wch: 44}, ...Array(9).fill({wch: 14})];
  const wb = XLSX.utils.book_new(); XLSX.utils.book_append_sheet(wb, ws, "LSH Net Sheet");
  XLSX.writeFile(wb, `LSH_Net_Sheet_John_Doe_Track_${FILE}${tag ? "_" + tag : ""}.xlsx`);
}
/* ---------- start ---------- */
window.addEventListener("DOMContentLoaded", async () => {
  RECORD = await load(); SHEET = RECORD.files[FILE];
  SHEET.cells = SHEET.cells || {}; SHEET.checks = SHEET.checks || {};
  // the stages of this track's sheet
  $("#ns-stage").innerHTML = Object.keys(STAGES).filter(k => STAGES[k].file === FILE).map(k => `<option value="${k}">${E(STAGES[k].label)}</option>`).join("");
  $("#ns-track").textContent = FILE === "B" ? "Track B · case won at arbitration" : "Track A · settled before suit";
  $("#ns-stage").addEventListener("change", () => { $("#ns-ref").hidden = true; showBrief(); showCheck(); refButton(); });
  $("#ns-check-btn").addEventListener("click", check);
  $("#ns-ref-btn").addEventListener("click", toggleRef);
  $("#ns-dl").addEventListener("click", () => download());
  $("#ns-reset").addEventListener("click", () => { if(confirm("Start over on a blank sheet? Your entries on this track's sheet will be cleared.")){ SHEET.cells = Object.assign({}, BLANK); SHEET.checks = {}; SHEET.revealed = {}; save(); $("#ns-ref").hidden = true; render(); refButton(); } });
  render(); refButton(); setStatus(host ? "Saved with your progress" : "Saved on this device");
});
window.CMNetSheet = {calc: cells => calc(cells), check, STAGES, FILE, get sheet(){ return SHEET; }, get record(){ return RECORD; }};
})();
