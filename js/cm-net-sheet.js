/* The LSH Net Sheet, in the course (net-sheet.html): the firm's own template (documents/templates/
   LSH_Net_Sheet_v2_FIXED.xlsx, "LSH Net Sheet") with its four sections, rows and formulas, the Medical Provider Ledger
   left blank for the trainee to build from the bills, so a trainee works John Doe's settlement math where the Case Flow asks for it, side
   by side with the slide (or on a second screen):
     1. Settlement Recovery Summary     L7 gross
     2. Attorney Fees & Case Expenses   L11 = L7 × C11 (33⅓% pre-suit), L20 = SUM(L12:L19), L21 = L11 + L20
     3. Medical Provider Ledger & Liens I = D – E – F – G – H per row; J, K, L totals in row 44
     4. Final Client Disbursement       L52 = L7 – L11 – L20 – L44
   The trainee's sheet is kept on their record ("net-sheet", one of the personal keys, so it syncs with their
   progress and their trainer sees it), and "Check my sheet" tests it against the file at the stage the step is at.
   It is used where the money is worked, and nowhere else: Track A (settled before suit, Day 3) at Settlement
   Negotiations (?stage=recovery), Lien Negotiations (?stage=liens) and Disbursement (?stage=final, $20,359.92); Track B
   (case won at arbitration, Day 5) at its own close-out (?stage=litigation, $14,713.75). Each track is its own sheet,
   and so is each settlement stream's (?stage=bi, ?stage=um: the BI and UM settlement Net Sheets).
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
// a blank ledger: the trainee builds the Medical Provider Ledger from the bills, EOBs and payment histories on the file
// (nothing in section 3 is filled in for them); the fee tier on Track A is the retainer's pre-suit rate
const START = {
  C11: "33⅓%",
};
// what section 3 used to start with (taken out of sheets saved before the ledger started blank)
const OLD_START = {
  B25: "Urgent care", C25: "Riverton Urgent Care (DOS 02/20/2026)", D25: 685, G25: 685,
  B26: "Chiro / PT (LOP)", C26: "Riverton Spine & Rehab — itemized LOP ledger as billed", D26: 6290,
  B27: "Orthopedics", C27: "Lakeside Orthopedics (3 visits)", D27: 1920, G27: 1920,
  B28: "MRI", C28: "Summit Imaging Center (cervical MRI 03/13/2026)", D28: 2395, G28: 2395,
  B29: "Pain management", C29: "Crescent Pain & Spine (ESI 05/15/2026)", D29: 3400, F29: 1860, H29: 1540,
  B30: "Health plan lien (verify!)", C30: "Peach State Health Plan reimbursement claim — fully insured group plan", D30: 1860,
  B42: "Pre-Settlement Funding", C42: "None reported", B43: "Prior Attorney", C43: "None",
};
// Track B starts blank too; the fee tier is the trainee's to enter from the retainer
const START_B = Object.assign({}, START, {C11: ""});
/* what the file says at each stage (build/case-flow: d2m4-a1, d3m3-a2, d3m4-a1) */
const STAGES = {
  recovery: {file: "A", label: "Track A · Settlement: the gross and the fee", checks: [
    {cell: "L7", want: 40000, why: "Gross: Keystone BI $10,000.00 + Harbor Point UM $20,000.00 + Cardinal State UM $10,000.00 = $40,000.00 (PIP and PD are not recovery)."},
    {cell: "L11", want: 13333.33, why: "The fee is 33⅓% pre-suit (no suit filed): one-third of $40,000.00 = $13,333.33. Typing 33.33% gives $13,332.00."},
  ]},
  /* the settlement-stage sheets, one per stream, each its own sheet so the full Track A sheet is never overwritten
     (d3m2-bins: the BI tender, 08/12/2026; d3m2-umns: both UM layers resolved, 10/06/2026) */
  bi: {file: "BI", label: "Track A · Stream 1: the BI settlement Net Sheet", checks: [
    {cell: "L7", want: 10000, why: "Stream 1 is Keystone's BI tender alone: $10,000.00. The UM layers are not recovery yet."},
    {cell: "L11", want: 3333.33, why: "The fee is 33⅓% pre-suit: one-third of $10,000.00 = $3,333.33. Typing 33.33% gives $3,333.00."},
  ]},
  um: {file: "UM", label: "Track A · Stream 2: the UM settlement Net Sheet", checks: [
    {cell: "L7", want: 30000, why: "Stream 2 is the two UM layers: Harbor Point $20,000.00 + Cardinal State $10,000.00 = $30,000.00. Keystone's BI is Stream 1."},
    {cell: "L11", want: 10000, why: "The fee is 33⅓% pre-suit: one-third of $30,000.00 = $10,000.00."},
  ]},
  liens: {file: "A", label: "Track A · Lien negotiations", checks: [
    {cell: "I26", want: 6105, why: "Riverton Spine & Rehab: 34 lines billed, 33 visits in the notes. The 05/04/2026 duplicate ($185.00) goes in Adjustments: $6,290.00 → $6,105.00 audited."},
    {cell: "I44", want: 7965, why: "Liens audited before any reduction: Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $7,965.00. Zero-balance lines stay at zero."},
    {cell: "L30", want: 1240, why: "Peach State: $1,860.00 less the one-third procurement-cost reduction ($620.00) = $1,240.00, accepted in writing 10/09/2026."},
    {cell: "L26", want: 4580, why: "Riverton Spine & Rehab: audited $6,105.00, accepted $4,580.00 in its signed Payoff Letter (10/12/2026)."},
    {cell: "L44", want: 5820, why: "Reduced liens: $1,240.00 + $4,580.00 = $5,820.00."},
  ]},
  final: {file: "A", label: "Track A · Disbursement: the final Net Sheet", checks: [
    {cell: "L7", want: 40000, why: "Gross: Keystone BI $10,000.00 + Harbor Point UM $20,000.00 + Cardinal State UM $10,000.00 = $40,000.00 (PIP and PD are not recovery)."},
    {cell: "L11", want: 13333.33, why: "The fee is 33⅓% pre-suit (no suit filed): one-third of $40,000.00 = $13,333.33. Typing 33.33% gives $13,332.00."},
    {cell: "L20", want: 486.75, why: "Receipted costs: Police Report $25.00, records and billing $214.75, certified mail $72.00, MRI disc $25.00, postage and copies $150.00 = $486.75."},
    {cell: "L26", want: 4580, why: "Riverton Spine & Rehab: audited $6,105.00, accepted $4,580.00 in its signed Payoff Letter (10/12/2026)."},
    {cell: "L30", want: 1240, why: "Peach State: $1,860.00 less the one-third procurement-cost reduction ($620.00) = $1,240.00, accepted in writing 10/09/2026."},
    {cell: "L44", want: 5820, why: "Reduced liens: $1,240.00 + $4,580.00 = $5,820.00. Zero-balance lines stay off the payables."},
    {cell: "L52", want: 20359.92, why: "Net to John Doe: $40,000.00 – $13,333.33 – $486.75 – $5,820.00 = $20,359.92."},
  ]},
  litigation: {file: "B", label: "Track B · Case won: the litigated Net Sheet", checks: [
    {cell: "L7", want: 40000, why: "Gross: Keystone $10,000.00 (mediation, 03/18/2027) + Harbor Point $20,000.00 + Cardinal State $10,000.00 (award, 07/06/2027) = $40,000.00."},
    {cell: "L11", want: 16000, why: "Suit was filed 09/24/2026, so the retainer's 40% tier applies: $16,000.00. The 33⅓% pre-suit rate would give $13,333.33."},
    {cell: "L20", want: 3895.25, why: "Receipted costs: pre-suit $486.75 + filing $218.00 + Allied Process Services $285.00 + mediation $1,200.00 + arbitration $900.00 + Riverton Court Reporting $645.50 + certified records $160.00 = $3,895.25."},
    {cell: "I26", want: 6105, why: "Riverton Spine & Rehab is still audited first: the 05/04/2026 duplicate ($185.00) in Adjustments, $6,290.00 → $6,105.00."},
    {cell: "L26", want: 4275, why: "Riverton Spine & Rehab accepted $4,275.00 in its signed Payoff Letter (07/16/2027)."},
    {cell: "L30", want: 1116, why: "Peach State's reduction follows the fee actually charged: 40% of $1,860.00 = $744.00, so $1,116.00, accepted in writing 07/14/2027."},
    {cell: "L44", want: 5391, why: "Reduced liens: $1,116.00 + $4,275.00 = $5,391.00."},
    {cell: "L52", want: 14713.75, why: "Net to John Doe: $40,000.00 – $16,000.00 – $3,895.25 – $5,391.00 = $14,713.75."},
  ]},
};
const STAGE = STAGES[new URLSearchParams(location.search).get("stage")] ? new URLSearchParams(location.search).get("stage") : "final";
const FILE = STAGES[STAGE].file;   // "A" or "B": each track is its own sheet
/* ---------- the trainee's sheet, kept with their progress ---------- */
const host = (() => { for(const w of [window.parent, window.opener]){ try{ if(w && w !== window && typeof w.storeSet === "function") return w; }catch(e){} } return null; })();
async function load(){
  let v = null;
  try{ if(host) v = await host.storeGet(KEY); }catch(e){}
  if(!v) try{ v = JSON.parse(localStorage.getItem("lsh_" + KEY) || "null"); }catch(e){}
  if(v && v.cells && !v.files) v = {v: 2, files: {A: {cells: v.cells, checks: v.checks || {}}}};   // the first version kept one sheet: Track A's
  v = v && v.files ? v : {v: 2, files: {}};
  v.files[FILE] = v.files[FILE] || {cells: Object.assign({}, FILE === "B" ? START_B : START), checks: {}};
  // sheets started when section 3 came filled in: the values still exactly as they were filled are taken out, once;
  // anything the trainee typed or changed stays
  if(!v.blankLedger){
    Object.values(v.files).forEach(f => { if(f && f.cells) Object.entries(OLD_START).forEach(([k, x]) => { if(f.cells[k] === x) delete f.cells[k]; }); });
    v.blankLedger = 1;
  }
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
function calc(){
  const c = SHEET.cells, g = k => num(c[k]), out = {};
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
  paint(); showCheck();
}
function paint(){
  const o = calc();
  document.querySelectorAll("[data-o]").forEach(el => { const v = o[el.dataset.o]; el.textContent = money(v || 0); el.classList.toggle("neg", v < 0); });
}
/* ---------- Check my sheet ---------- */
function valueOf(expr, o){ return r2(expr.split("+").reduce((s, k) => s + (o[k] != null ? o[k] : num(SHEET.cells[k])), 0)); }
function check(){
  const stage = $("#ns-stage").value, st = STAGES[stage], o = calc();
  const items = st.checks.map(c => { const got = valueOf(c.cell, o); return {cell: c.cell, ok: Math.abs(got - c.want) < 0.005, got, want: c.want}; });
  SHEET.checks = SHEET.checks || {};
  SHEET.checks[stage] = {passed: items.filter(x => x.ok).length, total: items.length, at: new Date().toISOString(), items: items.map(x => ({cell: x.cell, ok: x.ok, got: x.got}))};
  save(); showCheck(true);
}
function showCheck(fresh){
  const stage = $("#ns-stage").value, st = STAGES[stage], r = (SHEET.checks || {})[stage], box = $("#ns-check");
  if(!r){ box.hidden = true; return; }
  box.hidden = false;
  box.innerHTML = `<b>${r.passed === r.total ? "✓ Your sheet ties out" : `${r.passed} of ${r.total} tie out`}</b> · ${E(st.label)} · checked ${E(new Date(r.at).toLocaleString())}
    <ul>${st.checks.map((c, j) => { const it = r.items[j] || {}; return `<li class="${it.ok ? "ok" : "miss"}">${it.ok ? "✓" : "✗"} <code>${E(c.cell)}</code> ${it.ok ? money(c.want) : `is ${money(it.got || 0)}, the file says ${money(c.want)}`}${it.ok ? "" : `<br><span>${E(T(c.why))}</span>`}</li>`; }).join("")}</ul>`;
  if(fresh) box.scrollIntoView({block: "nearest", behavior: "smooth"});
}
/* ---------- Download: the same sheet, formulas and all ---------- */
function download(){
  if(!window.XLSX){ alert("The download needs a moment to load. Try again."); return; }
  const ws = {}, c = SHEET.cells, set = (k, v) => { if(v === "" || v == null) return; ws[k] = typeof v === "number" ? {t: "n", v, z: "$#,##0.00"} : {t: "s", v: T(String(v))}; }, f = (k, fx) => { ws[k] = {t: "n", f: fx, z: "$#,##0.00"}; };
  set("C1", "LSH Net Sheet — John Doe v. Robert Smith (from the course)");
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
  XLSX.writeFile(wb, `LSH_Net_Sheet_John_Doe_Track_${FILE}.xlsx`);
}
/* ---------- start ---------- */
window.addEventListener("DOMContentLoaded", async () => {
  RECORD = await load(); SHEET = RECORD.files[FILE];
  SHEET.cells = SHEET.cells || {}; SHEET.checks = SHEET.checks || {};
  // the stages of this track's sheet
  $("#ns-stage").innerHTML = Object.entries(STAGES).filter(([, x]) => x.file === FILE).map(([k, x]) => `<option value="${k}">${E(x.label)}</option>`).join("");
  $("#ns-track").textContent = FILE === "B" ? "Track B · case won at arbitration" : FILE === "BI" ? "Track A · Stream 1, the BI settlement" : FILE === "UM" ? "Track A · Stream 2, the UM settlement" : "Track A · settled before suit";
  $("#ns-stage").addEventListener("change", () => showCheck());
  $("#ns-check-btn").addEventListener("click", check);
  $("#ns-dl").addEventListener("click", download);
  $("#ns-reset").addEventListener("click", () => { if(confirm("Start over with a blank sheet? Your entries on this track's sheet will be cleared.")){ SHEET.cells = Object.assign({}, FILE === "B" ? START_B : START); SHEET.checks = {}; save(); render(); } });
  render(); setStatus(host ? "Saved with your progress" : "Saved on this device");
});
window.CMNetSheet = {calc: () => calc(), check, STAGES, FILE, get sheet(){ return SHEET; }, get record(){ return RECORD; }};
})();
