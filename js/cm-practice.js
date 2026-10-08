/* ============================================================
   LSH Case Management Training — 🧪 PRACTICE
   One page for every practice tool, organized the same way for
   every day into three categories:
     🧠 Skill Builders  — think it through on the case documents
     🗣 Communication   — say it: live calls, roleplay, email
     🗂 Systems         — do it in the platform: CMS, docket,
                          records, e-filing, calendar, ledger
   Also adds the tools each day was missing:
     Day 1 · Systems        Front Desk Case Lookup (CMS Training Library)
     Day 2 · Systems        Demand Package Builder
     Day 3 · Systems        Trust Ledger & Disbursement
     Day 4 · Communication  ADR Communication Lab
   and an ➕ Extra Practice section for optional labs (they don't gate days):
     Property Damage Claims Lab (John Doe's totaled Tesla; opens with Day 2)
   Loaded after cm-skillbuilders.js (uses window.__cmKit).
   ============================================================ */
(function(){
"use strict";
const K = window.__cmKit;
if(!K){ console.warn("cm-practice: cm-skillbuilders.js must load first"); return; }
const {TOOLS, part, scenario, flagTable, sorter, checklist, calc, choice, choiceText, docPacket, toolStep, cmsStep, E, money, scorePart, cmState, CM_UI} = K;

/* ---------------- styles ---------------- */
const st = document.createElement("style"); st.id = "cm-practice-css"; st.textContent = `
.px-cats{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;margin:0 0 18px}
.px-cat{border-radius:14px;padding:14px 16px;border:1.5px solid var(--line);background:#fff}
.px-cat b{display:block;font-size:15px;color:var(--navy)}.px-cat p{margin:4px 0 0;font-size:12.6px;color:var(--ink-soft)}
.px-cat .ic{font-size:22px}
.px-cat.think{border-color:#C9D3F0;background:#F6F8FE}.px-cat.talk{border-color:#F3D2B3;background:#FFF8F1}.px-cat.do{border-color:#BFE3CE;background:#F3FBF6}
.px-bar{display:flex;gap:6px;flex-wrap:wrap;align-items:center;margin:0 0 16px}
.px-bar .sep{width:1px;height:24px;background:var(--line);margin:0 4px}
.px-day{margin-bottom:22px;padding:16px 18px}
.px-day-h{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;flex-wrap:wrap;margin-bottom:12px}
.px-day-h h2{margin:0;font-size:17px;color:var(--navy)}.px-day-h .sub{font-size:12.5px;color:var(--ink-soft);margin-top:2px}
.px-prog{font-size:12px;font-weight:700;color:var(--navy);background:#EEF0F6;border-radius:999px;padding:4px 10px;white-space:nowrap}
.px-grid{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px}
.px-grid.one{grid-template-columns:minmax(0,1fr)}
.px-col h3{font-size:12px;letter-spacing:.05em;text-transform:uppercase;margin:0 0 8px;display:flex;align-items:center;gap:6px}
.px-col.think h3{color:#2B4C9B}.px-col.talk h3{color:#B45A12}.px-col.do h3{color:#1D6B3C}
.px-item{display:flex;gap:10px;align-items:flex-start;border:1px solid var(--line);border-radius:11px;padding:10px 12px;margin-bottom:8px;background:#fff;cursor:pointer;transition:border-color .15s, box-shadow .15s}
.px-item:hover{border-color:var(--orange);box-shadow:0 2px 10px rgba(0,0,0,.06)}
.px-item.locked{opacity:.6;cursor:not-allowed}
.px-item .ic{font-size:20px;width:34px;height:34px;border-radius:9px;background:#EEF0F6;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.px-item .t{font-weight:700;color:var(--ink);font-size:13.4px;line-height:1.3}
.px-item .d{font-size:12px;color:var(--ink-soft);margin-top:2px;line-height:1.4}
.px-item .tags{display:flex;gap:5px;flex-wrap:wrap;margin-top:5px}
.px-tag{font-size:10.5px;font-weight:700;border-radius:999px;padding:1px 8px;background:#F3F4F9;color:var(--navy)}
.px-tag.done{background:#E3F4EA;color:#1D6B3C}.px-tag.new{background:#FFF1DE;color:#9A5B00}.px-tag.where{background:#EEF0F6;color:#4A4F6A}
.px-foot{display:flex;gap:8px;flex-wrap:wrap;margin-top:6px}
@media (max-width:900px){.px-grid{grid-template-columns:minmax(0,1fr)}}
@media (max-width:640px){.px-cats{gap:8px}.px-cat{padding:9px 6px;text-align:center}.px-cat p{display:none}.px-cat b{font-size:11px}.px-cat .ic{font-size:18px}}
/* platform-style screens inside the new Systems tools */
.px-sys{border:1.5px solid var(--navy);border-radius:12px;overflow:hidden;margin:6px 0 12px;background:#fff}
.px-sys-h{background:var(--navy);color:#fff;padding:9px 14px;font-size:12.5px;display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap}
.px-sys-h b{color:#F0C08A;letter-spacing:.03em}
.px-sys-b{padding:10px 14px}
.px-ledger-sum{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:10px;margin:8px 0}
.px-ledger-sum div{border:1px solid var(--line);border-radius:10px;padding:8px 10px;background:#F8F9FC}
.px-ledger-sum span{display:block;font-size:11px;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft);font-weight:700}
.px-ledger-sum b{font-size:17px;color:var(--navy);font-family:'IBM Plex Mono',monospace}
@media (max-width:640px){.px-ledger-sum{grid-template-columns:minmax(0,1fr)}}
.px-q{border:1px solid var(--line);border-radius:10px;padding:10px 12px;margin-bottom:8px;background:#fff}
.px-q.ok{border-color:var(--success);background:#EEF7F1}.px-q.bad{border-color:var(--danger);background:#FBEDEA}
.px-q .who{font-size:11px;font-weight:800;text-transform:uppercase;letter-spacing:.04em;color:var(--ink-soft)}
.px-q .ask{font-size:13.3px;font-weight:700;color:var(--navy);margin:3px 0 7px}
.px-q .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center}
.px-q select{font:inherit;font-size:12.8px;padding:6px 8px;border:1px solid var(--line);border-radius:8px;flex:1;min-width:220px;max-width:100%}
`; document.head.appendChild(st);

/* ================================================================
   NEW TOOLS
   ================================================================ */
const NEW_TOOLS = [
  {id:"cmLookup1", icon:"☎", title:"Front Desk Case Lookup (CMS Training Library)", relates:"Day 1", cat:"do", isNew:true,
   desc:"Callers want answers now. Open the CMS Training Library's mock cases, verify who is calling, find the fact on the file (appointments, check status, who's authorized, who handles what), route urgent calls correctly, and log a complete message in the CMS."},
  {id:"cmDemand2", icon:"📦", title:"Demand Package Builder", relates:"Day 2", cat:"do", isNew:true,
   desc:"Build the John Doe demand package the way the system needs it: decide which bills support the specials, total what's verified, index the exhibits, then send it with a time limit, calendar the response date and update the CMS."},
  {id:"cmTrust3", icon:"🏦", title:"Trust Ledger & Disbursement", relates:"Day 3", cat:"do", isNew:true,
   desc:"The $150,000 settlement has cleared the trust account. Work the disbursement queue: release what is ready, hold what isn't (an expired payoff letter, a reduction that's only verbal, suspicious wire instructions), balance the ledger to the penny and document the holds."},
  {id:"cmADR4", icon:"🤝", title:"ADR Communication Lab", relates:"Day 4", cat:"talk", isNew:true,
   desc:"The calls around mediation and arbitration: defense counsel's office pushes a mediation date past the court's deadline, the arbitrator asks you a question at the break, and John calls about the mediator's proposal. Practice each live, then put it in writing."},
  // Extra Practice: optional, listed in its own section of the Practice page.
  {id:"cmPD2", icon:"🚗", title:"Property Damage Claims Lab", relates:"Day 2", cat:"think", isNew:true, extra:true,
   desc:"John's Tesla is a $42,500 total loss and Apex's carrier denied property damage. Send each loss to the right coverage, audit the total-loss valuation, run the settlement and loan-payoff numbers, work the PD file, and write the valuation dispute."}
];
NEW_TOOLS.forEach(t=>{ t.gate = false; if(!PRACTICE_TOOLS.some(x=>x.id===t.id)) PRACTICE_TOOLS.push(t); });
/* The next day still unlocks on the original Skill Builders (any score), so adding these
   tools never locks a trainee who is mid-course. They count toward the day's practice. */
window.dayLabDone = function(dayId){
  const tools = PRACTICE_TOOLS.filter(t=>t.gate!==false && (String(t.relates||"").match(/\d+/g)||[]).map(Number).includes(dayId));
  if(!tools.length){ const p = state.progress[dayId]; return !!(p && (p.done || typeof p.score==="number")); }
  const pp = state.practiceProgress || {};
  return tools.every(t=>pp[t.id] && (pp[t.id].runs||0) >= 1);
};
const CAT_OF = {cmIntake1:"think", cmTreatment1:"think", cmPreDemand2:"think", cmNegotiate2:"think", cmLien3:"think", cmClosing3:"think",
  cmMediation4:"think", cmArbitration4:"think", calendar:"do", cmLitigation5:"think", cmJordan5:"think"};
PRACTICE_TOOLS.forEach(t=>{ if(!t.cat) t.cat = CAT_OF[t.id] || "think"; });
const CATS = {
  think:{icon:"🧠", label:"Skill Builders", short:"Skill Builder", blurb:"Think it through on the real case documents: audit, decide, calculate and write."},
  talk:{icon:"🗣", label:"Communication", short:"Communication", blurb:"Say it: live calls and roleplay with clients, adjusters, counsel and providers, plus email."},
  do:{icon:"🗂", label:"Systems", short:"Systems", blurb:"Do it in the platform: the CMS, docket, medical records, e-filing, calendar and trust ledger."}
};
window.cmToolCategory = (id)=> { const t = PRACTICE_TOOLS.find(x=>x.id===id); return CATS[(t && t.cat) || "think"]; };

/* ---- a lookup quiz: questions answered from a CMS Training Library case ---- */
function lookupQuiz(key, items){
  CM_UI[key] = {type:"lookup", items};
  const s = cmState()[key] = cmState()[key] || {};
  const k = key.replace(/\W/g,"_");
  return items.map((q,i)=>`<div class="px-q" id="row_${k}_${i}">
      <div class="who">📞 ${E(q.who)} · file ${E(q.mock)}</div><div class="ask">${E(q.ask)}</div>
      <div class="row"><select onchange="cmSet('${key}',${i},this.value)"><option value="">— what do you do / say? —</option>${q.opts.map(o=>`<option ${s[i]===o?"selected":""}>${E(o)}</option>`).join("")}</select>
      <button class="btn btn-ghost btn-sm" onclick="openTool('cms',null,'mock=${q.mock}')">Open ${E(q.mock)} in the CMS</button></div>
      <span class="cm-why" id="why_${k}_${i}"></span></div>`).join("")
    + `<button class="btn btn-navy btn-sm" onclick="pxCheckLookup('${key}')">Check my answers</button><div class="cm-res" id="res_${k}"></div>`;
}
window.pxCheckLookup = async function(key){
  const cfg = CM_UI[key], s = cmState()[key]||{}, k = key.replace(/\W/g,"_");
  if(cfg.items.some((_,i)=>!s[i])){ toast("Answer every call first."); return; }
  let ok = 0;
  cfg.items.forEach((q,i)=>{ const good = s[i]===q.answer; if(good) ok++;
    const row = document.getElementById(`row_${k}_${i}`); if(row){ row.classList.toggle("ok",good); row.classList.toggle("bad",!good); }
    const w = document.getElementById(`why_${k}_${i}`); if(w) w.textContent = (good?"✓ ":"✗ Best answer: "+q.answer+" — ") + q.why; });
  const score = Math.round(ok/cfg.items.length*100);
  document.getElementById("res_"+k).innerHTML = `<b style="color:${score>=80?"var(--success)":"var(--danger)"}">${ok}/${cfg.items.length} correct (${score}%)</b>`;
  await scorePart(key, score);
};

/* ---- AI-graded writing with its own case context (not the John Doe dossier) ---- */
function aiTaskX(key, cfg){
  CM_UI[key] = Object.assign({type:"aix"}, cfg);
  const k = key.replace(/\W/g,"_");
  return `<label style="font-size:12.8px;font-weight:700;color:var(--navy);display:block;margin:10px 0 5px">${E(cfg.label)}</label>
    <textarea class="cm-ta" id="ta_${k}" style="min-height:${cfg.rows||150}px" placeholder="${E(cfg.placeholder||"Write it exactly as you would send or log it…")}"></textarea>
    <button class="btn btn-navy btn-sm" style="margin-top:8px" onclick="pxGrade('${key}', this)">Review</button>
    <div id="ai_${k}" style="margin-top:10px"></div>`;
}
window.pxGrade = async function(key, btn){
  const cfg = CM_UI[key], k = key.replace(/\W/g,"_");
  const ta = document.getElementById("ta_"+k); const text = (ta && ta.value || "").trim();
  const out = document.getElementById("ai_"+k);
  if(text.length < 40){ toast("Write out your full answer first."); return; }
  const tool = K.toolOfKey(key), day = K.dayOfTool(tool);
  if(!(await useLabAttempt(day, key))) return;
  if(btn){ btn.disabled = true; btn.textContent = "Reviewing…"; }
  out.innerHTML = `<div class="ai-loading">Reviewing your work…</div>`;
  const extra = typeof cfg.extra==="function" ? cfg.extra() : "";
  try{
    const report = await runRubricEvaluation(cfg.exercise || cfg.label,
      `${cfg.caseText || ("CASE FILE (John Doe v. Apex Delivery Services):\n" + CLIENT_DOSSIER_MD)}\n\nEXERCISE CONTEXT:\n${cfg.context}${extra?`\n\nTRAINEE'S EARLIER SELECTIONS:\n${extra}`:""}`,
      text, cfg.criteria);
    out.innerHTML = renderEvaluationReport(report, day);
    await bumpPracticeProgress(tool, report.totalScore);
  }catch(e){ out.innerHTML = renderAiErrorBlock(e, "Couldn't review this yet"); }
  if(btn){ btn.disabled = false; btn.textContent = "Review"; }
};

const sysScreen = (title, right, inner)=> `<div class="px-sys"><div class="px-sys-h"><b>${title}</b><span>${right||""}</span></div><div class="px-sys-b">${inner}</div></div>`;

/* ---------- DAY 1 · Systems · Front Desk Case Lookup ---------- */
const CMS_LIB_NOTE = `<p style="font-size:12.8px;color:#37394A;margin:0 0 10px">These calls come in on the <b>CMS Training Library</b>: 20 mock cases every LSH program shares. Each button opens that case in the CMS, <b>view only</b>. Use the tabs (Profile, Treatment, Notes, Tasks, Litigation…) and the library's <b>☎ Firm directory &amp; front-desk rules</b>. First rule of every call: <b>verify the caller</b> (full name, date of birth and one more identifier on file) and check who is <b>authorized</b> before you share anything.</p>`;
TOOLS.cmLookup1 = ()=>[
  {label:"Find It on the File", html: part("A. Callers on the line: find it on the file",
    "Every Case Manager covers the phones. For each call, open the case, find the fact (or the rule) and pick what you would do or say.",
    CMS_LIB_NOTE + lookupQuiz("cmLookup1:lookup", [
      {mock:"MC-01", who:"Maria Santos (client, verified)", ask:"\"I lost my appointment card. When is my next chiropractor visit?\"",
       opts:["Tuesday 09/29/2026 at 10:30 AM at City Spine & Rehab","Thursday 10/01/2026 at 4:00 PM at City Spine & Rehab","She has no appointment scheduled; take a message","I can't tell her; only the case manager can give out appointment times"],
       answer:"Tuesday 09/29/2026 at 10:30 AM at City Spine & Rehab", why:"Treatment tab → chronology: next chiro visit 09/29 at 10:30 AM. Thursday 10/01 at 4:00 PM is physical therapy. A verified client may be told her own appointment."},
      {mock:"MC-01", who:"\"Rosa, Maria's cousin\"", ask:"\"Has Maria's case settled yet? How much is she getting?\"",
       opts:["Take a message only; don't confirm the firm represents Maria","Tell her the case is still in treatment","Give her the settlement status once she confirms Maria's date of birth","Transfer her to the attorney"],
       answer:"Take a message only; don't confirm the firm represents Maria", why:"Notes: only the client is authorized. Knowing Maria's DOB doesn't make a relative authorized."},
      {mock:"MC-06", who:"James Wilson (client, verified)", ask:"\"Is my settlement check ready? I need it this week.\"",
       opts:["Not yet: the firm is waiting on one provider's written lien reduction, then he signs the final settlement statement","Yes, it's ready for pickup at the front desk","It will be mailed Friday","The case hasn't settled yet"],
       answer:"Not yet: the firm is waiting on one provider's written lien reduction, then he signs the final settlement statement", why:"Notes 09/22 and 09/24: Align Chiropractic's reduction is still pending; the check is ready about 3 business days after he signs. Don't promise a date."},
      {mock:"MC-05", who:"Marco Garcia (Linda Garcia's son)", ask:"\"What time do I need to bring my mom in on the 2nd?\"",
       opts:["He's authorized: deposition prep with Atty. Brooks is 10/02/2026 at 2:00 PM","He's authorized: the deposition is 10/02/2026 at 10:00 AM","He isn't authorized; take a message","Transfer him to defense counsel's office"],
       answer:"He's authorized: deposition prep with Atty. Brooks is 10/02/2026 at 2:00 PM", why:"Notes: Marco signed a communication authorization (05/2026). Prep is 10/02 at 2:00 PM; the deposition itself is 10/06 at 10:00 AM."},
      {mock:"MC-10", who:"Angela Ruiz (Sofia Morales's mother)", ask:"\"I'm her mother. I have a right to know what's happening with my daughter's case.\"",
       opts:["Respectfully take a message; share nothing (only Frank Morales, the guardian on file, is authorized)","Share the case status because she is a parent","Give her the next plastic-surgery appointment only","Tell her to get a court order"],
       answer:"Respectfully take a message; share nothing (only Frank Morales, the guardian on file, is authorized)", why:"Doc Hub and Notes: the client instruction and custody order say no disclosure to Angela Ruiz without Frank's written authorization. Don't argue custody."},
      {mock:"MC-04", who:"Greg Hollis, Liberty Crest Insurance", ask:"\"I have an offer on Chen: $65,000, open until Friday at 5.\"",
       opts:["Urgent: reach Atty. Marcus Reyes (ext 201) or Grace Kim (ext 313) now, or leave a priority message with the amount and deadline","Tell him the client wants the full $100,000 policy limits","Call the client to pass on the offer","Take a normal message for the case manager"],
       answer:"Urgent: reach Atty. Marcus Reyes (ext 201) or Grace Kim (ext 313) now, or leave a priority message with the amount and deadline", why:"An offer with a time limit is urgent. Never react to it or relay it to the client yourself."},
      {mock:"MC-13", who:"Nicole Adams (potential client)", ask:"\"Is it too late for me to sue? The store's adjuster says I have plenty of time.\"",
       opts:["Urgent: transfer to Atty. David Okafor (ext 203) or Intake (ext 100) now; no deadline advice","Tell her the statute runs 10/20/2026, so she has time","Tell her the adjuster is right","Schedule an intake appointment for next week"],
       answer:"Urgent: transfer to Atty. David Okafor (ext 203) or Intake (ext 100) now; no deadline advice", why:"The file flags the SOL as 10/20/2026, weeks away. Deadline questions are legal advice; route them urgently."},
      {mock:"MC-08", who:"A caller speaking Spanish about Tomás Rivera", ask:"\"Hola, llamo por mi caso… Tomás Rivera.\"",
       opts:["Transfer to Luis Ortega, the bilingual case manager (ext 314)","Ask the caller to call back with an English speaker","Transfer to Atty. Marcus Reyes (ext 201)","Transfer to Intake (ext 100)"],
       answer:"Transfer to Luis Ortega, the bilingual case manager (ext 314)", why:"Profile/Notes: the client prefers Spanish and Luis Ortega handles his calls. Don't guess through a language barrier."}
    ]))},
  {label:"Take the Message", html: part("B. The message that can't be missed",
    "Write the message you would log for Greg Hollis's call on MC-04 (the $65,000 offer open until Friday at 5) as it will appear in the CMS Note and in the attorney's inbox.",
    aiTaskX("cmLookup1:message", {label:"Your phone message and routing (as logged in the CMS)", exercise:"Front desk: message for a time-limited settlement offer", rows:150,
      caseText:"MOCK CASE MC-04 (CMS Training Library): client Robert \"Bobby\" Chen, MVA 11/18/2025, status BI Demanded. Attorney: Atty. Marcus Reyes (ext 201). Case manager: Grace Kim (ext 313). BI carrier Liberty Crest Insurance, adjuster Greg Hollis, (555) 010-7755, claim LC-25-99812, limits $100,000/$300,000. Policy-limits demand ($100,000) sent 09/08/2026, response due 10/08/2026. Client prefers calls before 9 AM. Firm rules: offers with time limits are URGENT (reach the attorney or CM live; otherwise priority message); the front desk never reacts to an offer, never relays it to the client, never gives an opinion; complete message = date/time, caller name and role, company, callback number, best time, case name, what they need, urgency, initials; log as a Note and route to the person on the file.",
      context:"Greg Hollis called the front desk: \"I have an offer on Chen: $65,000, and it's only open until Friday at 5.\"",
      criteria:"Must include: date and time of the call; caller name, role and company; direct callback number; case name and the carrier's claim number; the exact offer amount and the exact deadline (Friday 5 PM); marked URGENT; routed to Atty. Reyes and Grace Kim (with extensions) and a live attempt noted; what the front desk said (nothing about the offer's merits); initials. Penalize any reaction to or opinion on the offer, contacting the client directly, a missing deadline or amount, or a vague 'please call him back'."})
    + toolStep("cms", "cmLookup1:cms", "Open <b>MC-04</b> from the CMS <b>📚 Training Library</b>, choose <b>✍ Work on a practice copy</b>, add your message as a <b>Note</b> (Staff: Receptionist / Front Desk) and a <b>Task</b> for Atty. Reyes due before Friday 5 PM, then <b>Save Case</b> and log your Case ID here."))}
];

/* ---------- DAY 2 · Systems · Demand Package Builder ---------- */
TOOLS.cmDemand2 = ()=>[
  {label:"Specials Ledger", html: part("A. The specials ledger: what can go in the demand today?",
    "The demand builder only totals bills you mark <b>Include</b>. A special without a bill behind it is an argument the adjuster wins. Decide each line from the documents.",
    docPacket(["JD24","JD25","JD26","JD29","JD19","JD31"], "Bills, invoices and the draft demand")
    + sysScreen("LSH DEMAND BUILDER · SPECIALS", "John Doe v. Apex Delivery Services",
      flagTable("cmDemand2:specials", [
        {item:"Metro Center EMS — ALS transport + supplies", shows:"EMS bill on file: A0427 $1,850 + supplies $350 = $2,200 (paid by PIP).", answer:"Include", why:"A billed, documented special. PIP paying it doesn't remove it from the specials."},
        {item:"Metro General Hospital — ER", shows:"Itemized ER statement on file: $12,700.", answer:"Include", why:"Use the billed amount from the statement (the draft's $12,400 was wrong)."},
        {item:"Metro Radiology & Imaging — lumbar MRI, contrast, brain MRI", shows:"Invoice on file: $2,450 + $450 + $2,100 = $5,000.", answer:"Include", why:"All three studies are billed and accident-related. The narrative must address the 2021 migraine history for the brain MRI."},
        {item:"Dr. Sarah Spine — EMC evaluation", shows:"Statement on file: $1,200.", answer:"Include", why:"Documented."},
        {item:"Metro Physical Therapy", shows:"Statement on file: $560.", answer:"Include", why:"Documented."},
        {item:"City Chiropractic & Rehab", shows:"Draft says $8,400 “to date”; the statement on file shows $320 for two visits; records show at least 14 visits.", answer:"Request the bill first", why:"The figure is unsupported. Get the complete ledger with a final balance."},
        {item:"Surgical facility — microdiscectomy 05/12/2026", shows:"$6,150 appears only in a lien letter; no itemized facility bill.", answer:"Request the bill first", why:"A lien letter isn't a bill. Request the UB-04 / itemized statement."},
        {item:"Surgeon's fee — microdiscectomy", shows:"Operative report on file; no bill.", answer:"Request the bill first", why:"The surgery is documented but the charge isn't."},
        {item:"Independent anesthesiologist (Dr. Vapor)", shows:"Named on the operative report; no bill.", answer:"Request the bill first", why:"Separate provider, separate bill. Easy to miss."},
        {item:"“Specialist Surgeon Group — plastic reconstruction $3,200”", shows:"No bill from this group; the ER statement already includes CPT 13132 complex laceration repair.", answer:"Leave out", why:"Unsupported and duplicates a charge already on the ER bill."}
      ], ["Include","Request the bill first","Leave out"])
      + calc("cmDemand2:total", [
        {label:"Verified specials you can put in the demand today", answer:21660, tol:1, hint:"EMS 2,200 + ER 12,700 + MRI 5,000 + Dr. Spine 1,200 + PT 560"},
        {label:"Bills still to request before the demand goes out", answer:4, tol:0, hint:"Chiro ledger, surgical facility, surgeon, anesthesiologist"}
      ])))},
  {label:"Exhibit Index", html: part("B. Build the exhibit index",
    "The builder assembles the package in exhibit order. Put each document where it belongs, or keep it out of the package entirely.",
    sysScreen("LSH DEMAND BUILDER · EXHIBITS", "Drag-free: pick a tab for each",
      sorter("cmDemand2:exhibits", [
        {t:"Police Report 2026-0214-AX", doc:"JD07", z:"A — Liability", why:"Smith cited; Doe on a green arrow."},
        {t:"EMS Run Report (Medic 14)", doc:"JD08", z:"B — Medical records & chronology", why:"Mechanical extrication and trauma vitals."},
        {t:"Medical Chronology & Forensic Summary", doc:"JD23", z:"B — Medical records & chronology", why:"The adjuster reads this first."},
        {t:"Microdiscectomy Operative Report", doc:"JD19", z:"B — Medical records & chronology", why:"Objective surgical proof."},
        {t:"Neurology Permanency (5% WPI)", doc:"JD20", z:"B — Medical records & chronology", why:"Permanency drives value."},
        {t:"Provider Billing Statements", doc:"JD24", z:"C — Bills & specials ledger", why:"Every figure in the specials table needs its bill."},
        {t:"MRI Invoice", doc:"JD25", z:"C — Bills & specials ledger", why:"Supports the $5,000 line."},
        {t:"Lost Wage Verification ($15,900)", doc:"JD32", z:"D — Lost wages", why:"Employer proof plus the doctor's restriction note."},
        {t:"Master Case Summary (Internal — Attorney Only)", doc:"JD04", z:"Keep out of the package", why:"Attorney work product."},
        {t:"Contingent Fee Retainer Agreement", doc:"JD05", z:"Keep out of the package", why:"Confidential client–firm agreement; not the adjuster's business."}
      ], ["A — Liability","B — Medical records & chronology","C — Bills & specials ledger","D — Lost wages","Keep out of the package"], "Document")))},
  {label:"Send & Calendar", html: part("C. Send it, start the clock, update the system",
    "The attorney approved the final package. Select every step the system log must show.",
    checklist("cmDemand2:send", [
      {t:"The attorney signs the final demand letter before it goes out.", ok:true, why:"Demands go out over the attorney's signature."},
      {t:"Send by a trackable method (certified mail, return receipt, plus email to the adjuster) and file the proof of delivery.", ok:true, why:"The time limit runs from receipt; you must be able to prove it."},
      {t:"State the time limit for a response in the letter and calendar the due date with 14-, 7- and 3-day reminders.", ok:true, why:"A policy-limits deadline that isn't calendared is a missed deadline."},
      {t:"Move the CMS status to “BI Demanded” and log the send (date, method, recipient) as a Note.", ok:true, why:"The file must show where the case is."},
      {t:"Tell John the demand went out and what happens next, without predicting a value.", ok:true, why:"Client communication, no promises."},
      {t:"Copy the lienholders on the demand so they know a settlement is coming.", ok:false, why:"The demand is a confidential negotiation document. Lien notices are handled separately."},
      {t:"Attach our internal net sheet so the adjuster can see the math.", ok:false, why:"Internal valuation never goes to the other side."},
      {t:"Send it now without the missing bills and add them if the adjuster asks.", ok:false, why:"Unsupported specials get discounted. Request the four bills first."}
    ], "Check my send steps")
    + scenario(`<b>Practice the clock:</b> say the demand goes out by certified mail and the green card shows it was received <b>Tuesday 04/28/2026</b>. The letter gives <b>30 days from receipt</b> to respond.`)
    + calc("cmDemand2:dates", [
      {label:"Response due date", type:"date", answer:"2026-05-28", hint:"04/28 + 30 days"},
      {label:"14-day reminder", type:"date", answer:"2026-05-14"},
      {label:"7-day reminder", type:"date", answer:"2026-05-21"}
    ])
    + cmsStep("cmDemand2:cms", "In John's CMS case: set the status to <b>BI Demanded</b>, upload the final demand under <b>Case Files</b>, add a <b>Task</b> for each of the four missing bills, and add the response deadline with its reminders as Tasks."))}
];

/* ---------- DAY 3 · Systems · Trust Ledger & Disbursement ---------- */
const TRUST_ROWS = [
  {payee:"LSH (operating account) — reimbursed case costs", amt:2090, shows:"Receipts on file for all five costs; the client signed the settlement statement.", answer:"Release", why:"Documented costs on a signed statement."},
  {payee:"LSH (operating account) — attorney fee", amt:59164, shows:"40% of (gross − costs) per the retainer; signed settlement statement on file.", answer:"Release", why:"Earned fee on a signed statement; it moves out of trust once the funds have cleared."},
  {payee:"Metro General Hospital", amt:4900, shows:"Signed final payoff letter on file.", answer:"Release", why:"Final written payoff."},
  {payee:"BlueCross ERISA plan", amt:9500, shows:"Payoff letter on file, but its “good through” date passed 10 days ago.", answer:"Hold", why:"Expired payoff: request an updated payoff letter before paying."},
  {payee:"Dr. Sarah Spine (LOP)", amt:6000, shows:"Signed written reduction and W-9 on file.", answer:"Release", why:"Written reduction plus W-9."},
  {payee:"Metro Radiology & Imaging", amt:3500, shows:"Payoff letter on file. Yesterday an email from a free webmail address asked us to wire the payment to a “new bank account”.", answer:"Hold", why:"Classic payment-diversion fraud. Verify by calling the number on the original letter; never use contact details from the suspicious email."},
  {payee:"City Chiropractic (LOP, reduced)", amt:2400, shows:"Reduction to $2,400 agreed by phone; nothing in writing yet.", answer:"Hold", why:"No written reduction, no payment. Get it in writing (and a Satisfaction of Lien after paying)."},
  {payee:"Metro Physical Therapy", amt:1100, shows:"Final payoff letter on file.", answer:"Release", why:"Final written payoff."},
  {payee:"Barry Slow (prior counsel)", amt:600, shows:"Signed agreement for $600 on file.", answer:"Release", why:"Resolved in writing."},
  {payee:"John Doe — net to client", amt:60746, shows:"Settlement statement signed; ID verified; every lien amount, including the three on hold, stays reserved in trust.", answer:"Release", why:"The held liens are fully reserved, so the client's net can go out."}
];
window.pxTrustPaint = function(){
  const s = cmState()["cmTrust3:ledger"] || {};
  let rel = 0, hold = 0;
  TRUST_ROWS.forEach((r,i)=>{ if(s[i]==="Release") rel += r.amt; else if(s[i]==="Hold") hold += r.amt; });
  const set = (id,v)=>{ const el = document.getElementById(id); if(el) el.textContent = money(v); };
  set("pxTrustRel", rel); set("pxTrustHold", hold); set("pxTrustOpen", 150000 - rel - hold);
};
document.addEventListener("change", (e)=>{ if(e.target && e.target.closest && e.target.closest("#tbl_cmTrust3_ledger")) pxTrustPaint(); });
TOOLS.cmTrust3 = ()=>{ setTimeout(()=>window.pxTrustPaint && pxTrustPaint(), 0); return [
  {label:"Disbursement Queue", html: part("A. Work the disbursement queue",
    "The $150,000 settlement check has <b>cleared</b> the trust account. Ten disbursement requests are waiting. Release what is ready; hold anything that isn't, with the reason. The totals update as you go.",
    docPacket(["TPL3","JD31","JD05"], "Statement, lien letters, retainer")
    + sysScreen("LSH TRUST LEDGER · IOLTA", "Client matter: John Doe v. Apex Delivery Services · Deposit $150,000.00 (cleared)",
      `<div class="px-ledger-sum"><div><span>Released today</span><b id="pxTrustRel">$0.00</b></div><div><span>Held in trust</span><b id="pxTrustHold">$0.00</b></div><div><span>Not yet decided</span><b id="pxTrustOpen">$150,000.00</b></div></div>`
      + flagTable("cmTrust3:ledger", TRUST_ROWS.map(r=>({item:`${r.payee} — ${money(r.amt)}`, shows:r.shows, answer:r.answer, why:r.why})), ["Release","Hold"])))},
  {label:"Balance to the Penny", html: part("B. Balance the ledger",
    "A trust account is balanced when every dollar is either paid out with a record or still sitting in the client's ledger for a reason.",
    calc("cmTrust3:balance", [
      {label:"Total released today", answer:134600, tol:1},
      {label:"Still held in John's trust ledger", answer:15400, tol:1, hint:"BlueCross 9,500 + Metro Radiology 3,500 + City Chiropractic 2,400"},
      {label:"John's trust balance once the three holds are resolved and paid", answer:0, tol:0}
    ])
    + checklist("cmTrust3:rules", [
      {t:"Record every check on John's client ledger the same day it's written, referencing the matter.", ok:true, why:"The client ledger is the money trail."},
      {t:"Reconcile three ways each month: bank statement = trust journal = total of all client ledgers.", ok:true, why:"The three-way reconciliation catches errors and misuse."},
      {t:"Get a Satisfaction of Lien or zero-balance letter after each lien payment.", ok:true, why:"Proof the lien is gone (one of the four audit-ready document sets)."},
      {t:"Pay the three held liens from the firm's operating account now and reimburse it from trust later.", ok:false, why:"Mixing firm and client money is commingling."},
      {t:"Move the $15,400 on hold into the operating account for safekeeping.", ok:false, why:"Client money stays in trust until it is paid out."},
      {t:"Pay BlueCross the old payoff amount now; they'll refund any difference.", ok:false, why:"An expired payoff can be wrong in either direction. Get the updated letter."}
    ], "Check the trust rules"))},
  {label:"Document the Holds", html: part("C. Document the holds",
    "Write the internal memo to the handling attorney (copy accounting) that explains each hold, what clears it, who owns the next step and by when. Then add one short paragraph for John on why part of the money is still in trust.",
    aiTaskX("cmTrust3:memo", {label:"Your hold memo + the paragraph for John", exercise:"Trust disbursement — documenting holds", rows:170,
      context:"Settlement $150,000 cleared trust. Released $134,600 (costs $2,090, fee $59,164, Metro General $4,900, Dr. Spine $6,000, Metro PT $1,100, Barry Slow $600, client net $60,746). Held $15,400: BlueCross ERISA $9,500 (payoff letter expired 10 days ago), Metro Radiology & Imaging $3,500 (email from a free webmail address asking to wire funds to a new account), City Chiropractic $2,400 (reduction only agreed by phone).",
      criteria:"For each hold: the reason, what clears it (updated BlueCross payoff; call Metro Radiology at the number on the original letter to verify and pay by check to the address of record, flag the email as possible fraud; written reduction from City Chiropractic), the owner and a due date. States the amount held ($15,400) and that it stays in John's trust ledger. Client paragraph: plain language, no blame, explains that his net is already paid and the held money belongs to the providers until each is confirmed. Penalize paying on unverified wire instructions, commingling, or vague next steps."})
    + cmsStep("cmTrust3:cms", "In John's CMS case, <b>Finance</b> tab: add each released payment and each hold (with its reason) as a ledger entry, upload the signed settlement statement under <b>Case Files</b>, and add a <b>Task</b> for each hold."))}
]; };

/* ---------- DAY 4 · Communication · ADR Communication Lab ---------- */
if(typeof CRISIS_SCENARIO_SETS !== "undefined" && !CRISIS_SCENARIO_SETS.cmADR4){
  CRISIS_SCENARIO_SETS.cmADR4 = [
    {id:"sched", title:"Mediation Date Past the Deadline",
     setup:"Jane Vance's paralegal calls about scheduling the John Doe mediation. The stipulated order sets the mediation deadline for 06/18. She offers 06/19 or \"a quick Zoom next Tuesday\" at a time your attorney is in trial.",
     stakes:"Missing a court-ordered deadline puts the case out of compliance. Agreeing to a date the attorney can't attend is worse.",
     script:`OPENING LINE (paralegal, brisk): "Hi, Jane Vance's office. We can do the Doe mediation on the 19th, or a quick Zoom next Tuesday at 10. Can you just confirm one of those?"
FOLLOW-UP PRESSURE: "The 19th is one day late, nobody's going to care about that."
CURVEBALL: "Jane says if we can't lock it today, we'll tell the arbitrator your side is delaying."`,
     objective:{recommendation:"Don't agree to either. Note that the order sets 06/18, offer the attorney's cleared windows before the deadline, say you'll confirm after checking with the attorney and the mediator's office, and put it in writing the same day.",
       risksTradeoffs:"Agreeing on the phone commits the attorney; stalling looks like delay. Hold the line politely and move fast.",
       blufStatement:`"The order sets the mediation deadline for the 18th, so the 19th won't work. I have three windows before then from our attorney; I'll email them to you and the mediator's office within the hour."`}},
    {id:"arbq", title:"The Arbitrator Asks You a Question",
     setup:"At a break in the arbitration, Hon. Ruth Calder (Ret.) turns to you: \"You're the case manager? Why did the MRI charges go from $2,450 to $5,000?\"",
     stakes:"Explaining evidence or arguing the case is the unauthorized practice of law, and a casual answer can undercut the attorney's presentation.",
     script:`OPENING LINE (arbitrator, friendly): "You keep the file, right? Quick question while we wait: why does the MRI line say five thousand when I see twenty-four fifty here?"
FOLLOW-UP PRESSURE: "I'm just trying to understand the numbers. You must know."
CURVEBALL (defense counsel Jane Vance, smiling): "Yes, and was the brain MRI even related to the accident?"`,
     objective:{recommendation:"Politely decline to explain or argue; say the attorney will address it; tell the attorney right away and give them the invoice (lumbar $2,450 + contrast $450 + brain MRI $2,100).",
       risksTradeoffs:"Staying silent can feel rude, but answering is the bigger risk. Be courteous and brief.",
       blufStatement:`"I'm not able to speak to the evidence, Your Honor, but our attorney will address it as soon as we resume."`}},
    {id:"proposal", title:"John and the Mediator's Proposal",
     setup:"Mediation ended without a deal. The mediator made a proposal of $150,000; both sides must answer by Friday at 5 PM. John calls you, anxious.",
     stakes:"The decision is John's, made with his attorney's advice, not the case manager's. A missed deadline kills the proposal.",
     script:`OPENING LINE (John, anxious): "The mediator says $150,000. Should I take it? What would you do?"
FOLLOW-UP PRESSURE: "Just tell me yes or no. You know this case better than anyone."
CURVEBALL: "And how much of that do I actually get? My wife is asking."`,
     objective:{recommendation:"Acknowledge, don't advise. Explain that his attorney will go over it with him, set that call today, make sure the Friday 5 PM deadline is on the calendar, and send the attorney a note. On the net: an estimate comes from the attorney with the settlement statement.",
       risksTradeoffs:"Refusing to engage feels cold; giving an opinion is legal advice. Stay warm and clear about roles.",
       blufStatement:`"That decision is yours, with your attorney's advice. I'm setting up a call with the attorney today so you have time before Friday at 5."`}}
  ];
}
TOOLS.cmADR4 = ()=>[
  {label:"Scheduling Pushback", html: part("A. Defense counsel's office pushes a date past the deadline",
    "The stipulated order sets the mediation deadline for <b>06/18</b>. Jane Vance's paralegal calls offering <b>06/19</b> or “a quick Zoom next Tuesday at 10” (your attorney is in trial that morning).",
    docPacket(["JD37"], "The order")
    + choice("cmADR4:sched", ["Confirm Tuesday at 10 on Zoom so it's inside the deadline, then tell the attorney.", "Accept the 19th; one day late won't matter if both sides agree.", "Agree to neither. Cite the 06/18 deadline, offer the attorney's cleared windows before it, and confirm in writing today.", "Tell her you can't discuss scheduling and hang up."])
    + `<div style="margin-top:14px">${renderCrisisRoleplaySection("cmADR4", "Live call: practice it with the AI (pick the scenario at the top)")}</div>`
    + aiTaskX("cmADR4:email", {label:"Your follow-up email to Jane Vance's office (copy the mediator's office and your attorney)", exercise:"ADR scheduling — written confirmation", rows:140,
      extra: ()=>"Approach chosen: " + choiceText("cmADR4:sched"),
      context:"Stipulated Arbitration & Scheduling Order: mediation deadline 06/18, brief due 06/18 5 PM, hearing 06/20 9 AM. Defense paralegal proposed 06/19 or Tuesday 10 AM Zoom (attorney in trial). The case manager must hold the deadline, propose the attorney's cleared windows before 06/18, and document the call.",
      criteria:"Correct approach (choice 3). Email: professional and brief; cites the order's 06/18 deadline; proposes 2–3 specific windows before it (as cleared with the attorney); asks for confirmation by a stated time; copies the mediator's office and the attorney; summarizes the call accurately without accusations; no agreement to 06/19. Penalize accepting a date past the deadline or one the attorney can't attend."}))},
  {label:"The Arbitrator's Question", html: part("B. The arbitrator asks you a question",
    "At the break, Hon. Ruth Calder (Ret.) asks you why the MRI charges read $5,000 when she sees $2,450. Defense counsel adds: “And was the brain MRI even related?” Select every appropriate response.",
    checklist("cmADR4:upl", [
      {t:"“I'm not able to speak to the evidence, Your Honor; the attorney will address it when we resume.”", ok:true, why:"Courteous, and it keeps you out of the unauthorized practice of law."},
      {t:"Tell the attorney immediately and hand over the MRI invoice (lumbar $2,450 + contrast $450 + brain MRI $2,100).", ok:true, why:"The attorney needs to know the question is on the arbitrator's mind."},
      {t:"Note the exchange in the file after the session.", ok:true, why:"Document what was asked and by whom."},
      {t:"Explain the invoice quickly; it's just arithmetic, not legal argument.", ok:false, why:"Explaining evidence to the decision-maker is advocacy. Leave it to the attorney."},
      {t:"Answer defense counsel that the brain MRI was related to the crash.", ok:false, why:"Causation is argument. Never engage opposing counsel on the merits."},
      {t:"Ignore the arbitrator and walk away.", ok:false, why:"Be courteous: decline and defer, don't ignore."}
    ], "Check my responses"))},
  {label:"The Mediator's Proposal", html: part("C. John calls about the mediator's proposal",
    "Mediation ended with a mediator's proposal of <b>$150,000</b>; both sides must answer by <b>Friday at 5 PM</b>. John: “Should I take it? What would you do? And how much do I actually get?”",
    aiTaskX("cmADR4:proposal", {label:"What you say to John + your GIRP note + your note to the attorney", exercise:"Mediator's proposal — client call without legal advice", rows:190,
      context:"Mediator's proposal $150,000, response due Friday 5 PM. Client anxious, asks for a recommendation and his net. Retainer: 40% after suit filed, costs deducted before the fee; liens being negotiated.",
      criteria:"Script: empathetic, clearly states the decision is John's with the attorney's advice, gives no opinion or recommendation, sets an attorney call today, confirms the Friday 5 PM deadline, explains that a net estimate will come from the attorney with a settlement statement (no guessing numbers). GIRP note: Goal, Intervention, Response, Plan with dates. Attorney note: the proposal, the deadline, the client's questions and emotional state, the requested call time. Penalize any recommendation, predicted net, or missing deadline."})
    + toolStep("calendaring", "cmADR4:cal", "Practice the week this lands in: the Calendaring Simulator's CM week has the hearing, the brief deadline and the prep time to fit around a Friday 5 PM response."))}
];

/* ---------- EXTRA PRACTICE · Property Damage Claims Lab (John Doe's Tesla) ----------
   From the file: Aggressive Casualty's dec page lists PD liability "$0.00 DENIED (Refer to Excl. 4.b)";
   John's Local Farm Mutual policy has Collision (ACV, $1,000 deductible) and no rental coverage;
   the Master Case Summary has Local Farm Mutual subrogating against Apex for the deductible.
   The valuation report, settlement letter, loan payoff and receipts below are simulated for the lab. */
TOOLS.cmPD2 = ()=>[
  {label:"Who Pays for What", html: part("A. Who pays for what?",
    "Aggressive Casualty (Apex's carrier) lists property damage liability as <b>$0.00, DENIED (Refer to Excl. 4.b)</b>. John's own Local Farm Mutual policy has <b>Collision at actual cash value with a $1,000 deductible</b> and no rental coverage. A carrier's denial doesn't erase Apex's responsibility: a loss no policy pays is still damage Apex caused, and the attorney decides how to pursue it. Send each loss where it belongs.",
    docPacket(["JD27","JD28","JD04","JD26"], "Dec pages, the Master Case Summary and the PIP log")
    + sorter("cmPD2:route", [
      {t:"The Tesla itself: a total loss, actual cash value $42,500", z:"Local Farm Mutual collision claim (now)", why:"Apex's carrier denied property damage, so John's own collision coverage pays the car now. Don't make him wait on the injury case."},
      {t:"Tow from the scene and storage at the tow yard", z:"Local Farm Mutual collision claim (now)", why:"Towing and reasonable storage are part of the collision claim. Get the car moved before storage piles up."},
      {t:"John's $1,000 collision deductible", z:"Recover from Apex (subrogation or the attorney's claim)", why:"Local Farm Mutual is subrogating against Apex and includes the deductible (Master Case Summary §IV). Track it so John gets it back."},
      {t:"Rental car while John had no car (receipts: 18 days × $65)", z:"Recover from Apex (subrogation or the attorney's claim)", why:"John's policy has no rental coverage. Loss of use is damage Apex's driver caused: keep every receipt for the attorney."},
      {t:"John's personal laptop, destroyed in the crash (receipt $1,300)", z:"Recover from Apex (subrogation or the attorney's claim)", why:"Collision covers the car, not what was in it. Document the item (receipt, photo) as a loss against Apex, and ask whether John's homeowner's or renter's policy covers it."},
      {t:"Metro General ER bill ($12,700)", z:"Not property damage (injury claim)", why:"Medical bills belong to the injury claim: PIP, health insurance and the bodily-injury demand."},
      {t:"Apex's Medical Payments coverage ($5,000, secondary)", z:"Not property damage (injury claim)", why:"MedPay pays medical bills, not the car."},
      {t:"Using John's PIP ($10,000) to pay for the car", z:"Doesn't apply to this loss", why:"PIP pays medical bills and lost wages, never vehicle damage, and John's PIP is already exhausted (JD26)."},
      {t:"A diminished value claim on the Tesla", z:"Doesn't apply to this loss", why:"Diminished value is the resale value a repaired car loses. A total loss is paid at actual cash value, so there's nothing to diminish."}
    ], ["Local Farm Mutual collision claim (now)","Recover from Apex (subrogation or the attorney's claim)","Not property damage (injury claim)","Doesn't apply to this loss"], "Loss"))},
  {label:"Audit the Valuation", html: part("B. Audit the total-loss valuation",
    "The valuation report sets what John is paid for the car. Carriers get the trim, the comparables and the adjustments wrong, and every error comes out of the client's pocket. Check each line against John's own documents.",
    scenario(`<b>This week's PD mail:</b> Local Farm Mutual's total-loss adjuster, <b>Dana Price</b>, sent the valuation behind the $42,500 figure (claim <b>LFM-99210-JD</b>, collision). John has sent you his <b>registration and window sticker</b> (2023 Model Y <b>Long Range AWD</b>), a <b>tow-yard odometer photo</b> (18,420 miles) and a <b>tire receipt</b> (four new tires, 01/28/2026, $1,480). He says the car had <b>no prior damage</b>. The carrier moved the car from the tow yard on <b>03/09/2026</b>.`)
    + sysScreen("LOCAL FARM MUTUAL · TOTAL LOSS VALUATION", "Claim LFM-99210-JD · 2023 Tesla Model Y · Training: simulated",
      flagTable("cmPD2:valuation", [
        {item:"Vehicle description", shows:"Report: 2023 Tesla Model Y Standard Range RWD. John's registration and window sticker: Long Range AWD.", answer:"Dispute it", why:"The wrong trim understates the value by thousands. Send the registration and window sticker and ask for a corrected valuation."},
        {item:"Mileage", shows:"Report: 18,420 miles. Tow-yard odometer photo: 18,420.", answer:"Accept", why:"Matches the photo."},
        {item:"Comparable #3", shows:"A 2021 Model Y with 44,800 miles, at a dealer 310 miles away.", answer:"Dispute it", why:"Two model years older, more than twice the miles and outside John's market. Ask for local 2023 Long Range AWD comparables."},
        {item:"Condition adjustment", shows:"−$1,200 for “prior damage, rear bumper”. No photo or record attached; John says there was no prior damage.", answer:"Ask for proof", why:"An adjustment needs evidence. Ask for the photo or record it's based on; if there is none, it comes off."},
        {item:"Tires", shows:"No credit. John's receipt: four new tires on 01/28/2026, $1,480.", answer:"Dispute it", why:"Recent new tires are a documented condition credit. Send the receipt."},
        {item:"Sales tax and fees", shows:"Settlement letter adds 6% sales tax on the actual cash value plus $185 title and registration fees.", answer:"Accept", why:"Tax and fees on a total loss are included, and the math is right."},
        {item:"Owner-retained salvage", shows:"If John keeps the car, $6,800 salvage value is deducted.", answer:"Accept", why:"Standard. It's John's choice; explain it, and let the attorney weigh in before the car goes anywhere."},
        {item:"Storage", shows:"Carrier pays yard storage “through 03/02/2026 only”. The yard billed through 03/09/2026, the day the carrier moved the car.", answer:"Dispute it", why:"The week's delay was the carrier's. Ask it to pay storage through 03/09 so the yard doesn't bill John."}
      ], ["Accept","Dispute it","Ask for proof"])))},
  {label:"Run the Numbers", html: part("C. Run the numbers",
    "Before you explain the offer to John, check its math and know where every dollar goes.",
    scenario(`<b>Local Farm Mutual's settlement letter (as written):</b> actual cash value <b>$42,500</b> + sales tax 6% <b>$2,550</b> + title and registration <b>$185</b> − deductible <b>$1,000</b>.<br>
      <b>Tesla Finance</b> holds a lien on the title: payoff <b>$28,760</b>, good through 03/31/2026. The carrier pays the lienholder first and sends John the rest.<br>
      <b>John's losses no policy has paid:</b> the $1,000 deductible, the rental (18 days × $65) and the laptop ($1,300).<br>
      <b>Practice the Day 5 “lesser of” rule</b> on a different, repairable car: value before the crash $12,000, value after the crash $2,000, repairs $11,500.`)
    + calc("cmPD2:math", [
      {label:"Total-loss settlement in the letter", answer:44235, tol:1, hint:"42,500 + 2,550 + 185 − 1,000"},
      {label:"Check to John after Tesla Finance is paid", answer:15475, tol:1, hint:"44,235 − 28,760"},
      {label:"John's unpaid losses to recover from Apex", answer:3470, tol:1, hint:"Deductible 1,000 + rental 1,170 (18 × 65) + laptop 1,300"},
      {label:"“Lesser of” practice: what the law awards for the repairable car", answer:10000, tol:1, hint:"The lesser of the repairs ($11,500) and the drop in value ($12,000 − $2,000 = $10,000)"}
    ], `<span style="font-size:12.5px;color:var(--ink-soft)">If a loan payoff is ever <b>more</b> than the settlement, the shortfall is GAP coverage's job (if the client bought it). Flag it to the attorney the day you see it; don't promise the client it's covered.</span>`))},
  {label:"Work the PD File", html: part("D. Work the property damage file",
    "Property damage is its own claim with its own clock, and it's evidence for the injury case. Select everything a Case Manager should do on John's PD file this week.",
    docPacket(["JD40","JD07","JD33"], "Photos, police report and the proposed release")
    + checklist("cmPD2:file", [
      {t:"Ask Aggressive Casualty for its denial in writing and the full text of Exclusion 4.b, and send both to the attorney.", ok:true, why:"A $0 property damage line on a $1,000,000 combined single limit policy is unusual. The attorney decides whether to challenge it; you get the paper."},
      {t:"Open John's collision claim with Local Farm Mutual now, without waiting for the injury case.", ok:true, why:"John needs a car. The collision claim doesn't depend on who pays in the end."},
      {t:"Replace the grayscale fax photos (JD40) with the investigator's color originals: the B-pillar intrusion, the deployed airbags and the interior.", ok:true, why:"Property damage photos are evidence of how hard the impact was (Day 2 PD Deep Dive)."},
      {t:"Before the Tesla leaves for the salvage auction, tell the attorney so they can decide whether to preserve it or download its crash data and camera footage.", ok:true, why:"Once the car is sold for salvage, the evidence in it is gone."},
      {t:"Get the car out of the tow yard quickly, and ask the carrier to pay storage through the day it moved the car.", ok:true, why:"Storage runs every day, and the client shouldn't pay for the carrier's delay."},
      {t:"Keep John's rental and laptop receipts and log them as losses against Apex.", ok:true, why:"No policy pays them; they're part of what Apex owes."},
      {t:"Before any bodily-injury release is signed, check that it releases bodily injury only, so the open property damage losses aren't signed away.", ok:true, why:"A general release can wipe out an open PD claim (Day 2). The proposed release on file (JD33) is a “global” release."},
      {t:"Tell John the denial is final and the $1,000 deductible is his loss.", ok:false, why:"Local Farm Mutual is subrogating against Apex for the deductible, and the attorney may challenge the denial."},
      {t:"Have John sign the title and the carrier's release the day the offer arrives, so storage stops.", ok:false, why:"Not until the valuation disputes are resolved and the attorney confirms nothing needs preserving. Once the title is signed, the leverage is gone."},
      {t:"Mention the injury claim's value to the total-loss adjuster to speed up the car.", ok:false, why:"Keep the property damage conversation about the car. Injury negotiations belong to the attorney."}
    ], "Check my PD file steps"))},
  {label:"Dispute & Update", html: part("E. Write the valuation dispute and update John",
    "Write the email to Dana Price at Local Farm Mutual disputing the valuation (copy the handling attorney), then a short update for John.",
    aiTaskX("cmPD2:letter", {label:"Your dispute email to Local Farm Mutual + your update for John", exercise:"Property damage: total-loss valuation dispute and client update", rows:190,
      context:"Property damage claim on John Doe's 2023 Tesla Model Y (total loss). Aggressive Casualty (Apex) denied PD liability under Excl. 4.b; the car goes through John's Local Farm Mutual collision coverage (policy LFM-4412-JD, claim LFM-99210-JD, total-loss adjuster Dana Price; ACV basis, $1,000 deductible; Local Farm Mutual is subrogating against Apex for the deductible). The valuation report values the car at $42,500 but lists the wrong trim (Standard Range RWD; John's registration and window sticker show Long Range AWD), uses a 2021 comparable with 44,800 miles from 310 miles away, deducts $1,200 for 'prior damage, rear bumper' with no photo or record (John says there was none), gives no credit for four new tires bought 01/28/2026 ($1,480 receipt), and pays storage only through 03/02/2026 although the carrier didn't move the car until 03/09/2026. Settlement letter as written: $42,500 + 6% tax $2,550 + $185 fees − $1,000 deductible = $44,235; Tesla Finance payoff $28,760; about $15,475 to John. John's unpaid losses: deductible $1,000, rental $1,170, laptop $1,300.",
      criteria:"Dispute email: addressed to Dana Price with the claim and policy numbers; professional and specific; disputes each error with the supporting document (registration and window sticker for the trim, the tire receipt), asks for local 2023 Long Range AWD comparables in place of comparable #3, asks for the basis of the $1,200 condition adjustment or its removal, asks the carrier to pay storage through 03/09/2026; requests a corrected valuation by a stated date; says John won't sign the title or release until it's resolved; copies the attorney. Client update: plain language; explains the total-loss process and what's being disputed; lists what John should send or keep (receipts, photos); explains the deductible is being pursued from Apex through subrogation; no promised dollar figure; tells John not to sign anything from the carrier without talking to the firm. Penalize accepting the valuation as is, threats or accusations of bad faith, mentioning the injury claim's value to the PD adjuster, legal advice, or promising a number."})
    + cmsStep("cmPD2:cms", "In John's CMS case: upload the valuation report, settlement letter, tow and storage invoices, receipts and color photos under <b>PD</b>; add a <b>Note</b> summarizing the property damage claim; and add <b>Tasks</b> for the valuation follow-up (7 days), the attorney's preservation decision, the loss-of-use receipts, and checking that any release excludes property damage."))}
];

/* ================================================================
   THE PLAN: every day, three categories
   ================================================================ */
const SIM = (id, extra)=> Object.assign({kind:"sim", id}, extra||{});
const RP = (categoryId, topicId, lab)=> ({kind:"rp", categoryId, topicId, lab});
/* Every activity below sends the trainee to do the work in the CMS (or the Training Portal tool it runs on,
   then the CMS) with its steps beside the tool, and takes the result back for review (js/cm-lab.js).
   lab: {key, title, extra (the tool's address for this activity), steps, keys (what a full summary names),
   caseRef ("jd": the trainee's own John Doe case)}. */
const CMS = (t)=> ({t, open:{tool:"cms"}});
const LINE = (line)=> `line=${encodeURIComponent(line)}&mode=graded`;
const CALL = (line, t)=> ({t, open:{tool:"calls", extra:LINE(line)}});
const rpLab = (day, topicId, cmsStep, keys)=> ({key:`px${day}:rp-${topicId}`, tool:"cms", caseRef:"jd", keys,
  steps:[{t:"Take the live call here (the AI plays the caller). Stay in role: no legal advice, no promises.", rp:true}, CMS(cmsStep)]});
const PLAN = {
  1:{think:["cmIntake1","cmTreatment1"],
     talk:[SIM("calls",{note:"Reception & Front Desk · Intake Calls lines", lab:{key:"px1:calls", title:"Call Simulator: Reception & Front Desk and Intake Calls (graded)", extra:LINE("Reception & Front Desk"), caseRef:"jd", keys:["verify","Note","Task"],
        steps:[CALL("Reception & Front Desk", "Take <b>Graded call 1</b> on the Reception &amp; Front Desk line: verify the caller before you share anything, then write the note the call asks for."),
               CALL("Intake Calls", "Take <b>Graded call 1</b> on the Intake Calls line: who, what, when, where, how, and the conflict check before anything moves."),
               CMS("In your John Doe case in the CMS, log each call as a <b>Note</b> (caller, reason, what you said, next step) and add a <b>Task</b> for any follow-up.")]}}),
       RP("client","transportwall", rpLab(1, "transportwall", "In your John Doe case in the CMS, add the <b>GIRP</b> note under Notes (Goal, Intervention, Response, Plan) and a <b>Task</b> for the ride or telehealth follow-up.", ["Goal","Intervention","Response","Plan","Task"])),
       RP("client","miaclient", rpLab(1, "miaclient", "In your John Doe case in the CMS, add a <b>Note</b> of every contact attempt (date, method, result) and a <b>Task</b> for the next attempt and the attorney's notice.", ["attempt","Note","Task","attorney"]))],
     do:[SIM("cms",{title:"Build John Doe's case in the CMS", note:"From the Case File snapshot: key the intake, upload by category", lab:{key:"px1:cms-build", legacy:"cmIntake1:cms", extra:"intake=1", keys:["intake","Case Files","Police","parties","Task"],
        steps:[{t:"<b>📝 New intake</b> in the CMS: key John Doe's intake from the documents with the corrected facts (DOB 08/14/1980, Senior Logistics Manager, police report 2026-0214-AX) and save it as a case.", open:{tool:"cms", extra:"intake=1"}},
               {t:"Upload each document under its CMS category (📁 Case Documents shows the category on every file): the intake packet under <b>Case Files</b>, the police report under <b>Police</b>."},
               {t:"Add the <b>parties</b>, the carriers (Aggressive Casualty, Local Farm Mutual) and the lienholders."},
               {t:"Calendar every deadline and add a <b>Task</b> for every next step: the signed HIPAA authorization, the prior records, the passenger's conflict check, prior counsel's lien."}]}}),
       SIM("records",{note:"Prior records flagged at intake (2018, 2021)", lab:{key:"px1:records", legacy:"cmIntake1:records", caseRef:"jd", keys:["2018","2021","HIPAA","DOB","Task"],
        steps:[{t:"Request John's prior records flagged at intake (the <b>2021</b> migraine records and the <b>2018</b> records). Attach the claim-specific <b>HIPAA</b> authorization, which must be signed first, and give the provider the correct <b>DOB</b>, 08/14/1980.", open:{tool:"records"}},
               CMS("Log each request number as a <b>Task</b> in your John Doe case with its follow-up date.")]}}),
       "cmLookup1"]},
  2:{think:["cmPreDemand2","cmNegotiate2"],
     talk:[RP("insurance","firstcall", rpLab(2, "firstcall", "In your John Doe case in the CMS, add a <b>Note</b> of the adjuster call (who, claim number, what was said, any offer and its deadline) and a <b>Task</b> for the attorney.", ["claim","Note","Task","attorney"])),
       RP("insurance","lowball", rpLab(2, "lowball", "In your John Doe case in the CMS, add a <b>Note</b> of the offer and the stall tactic, and a <b>Task</b> for the attorney with the response deadline.", ["offer","deadline","Note","Task"])),
       SIM("replies",{note:"The adjuster and client emails", lab:{key:"px2:replies", caseRef:"jd", keys:["Note","Task"],
        steps:[{t:"Answer the John Doe emails on Email Replies (the client, the adjuster, a lienholder, defense counsel, your attorney) and report the phishing attempt.", open:{tool:"replies"}},
               CMS("Log each reply in your John Doe case as a <b>Note</b>, and a <b>Task</b> for anything you promised.")]}}),
       SIM("calls",{note:"Adjusters & Carriers line", lab:{key:"px2:calls", title:"Call Simulator: Adjusters & Carriers (graded)", extra:LINE("Adjusters & Carriers"), caseRef:"jd", keys:["claim","Note","Task"],
        steps:[CALL("Adjusters & Carriers", "Take <b>Graded call 1</b> on the Adjusters &amp; Carriers line: claim number first, no admissions, nothing promised."),
               CMS("Log the call in your John Doe case as a <b>Note</b> and add a <b>Task</b> for the follow-up.")]}})],
     do:["cmDemand2", SIM("records",{note:"The bills missing from the demand", lab:{key:"px2:records", caseRef:"jd", keys:["chiro","UB-04","surgeon","anesthesiologist","Task"],
        steps:[{t:"Request the itemized bills missing from the demand: the complete <b>chiro</b> ledger, the surgical facility's <b>UB-04</b>, the <b>surgeon</b>'s bill and the <b>anesthesiologist</b>'s bill.", open:{tool:"records"}},
               CMS("Log each request number as a <b>Task</b> in your John Doe case with its follow-up date.")]}})]},
  3:{think:["cmLien3","cmClosing3"],
     talk:[RP("liens","hospitallien", rpLab(3, "hospitallien", "In your John Doe case in the CMS, <b>Liens</b> tab: add Metro General's lien with the asserted and the negotiated amounts, and a <b>Note</b> of the call.", ["Liens","asserted","negotiated","Note"])),
       RP("liens","erisa", rpLab(3, "erisa", "In your John Doe case in the CMS, <b>Liens</b> tab: add the BlueCross ERISA lien, and a <b>Task</b> to request the plan document (SPD) and the itemized payment ledger.", ["Liens","ERISA","SPD","Task"])),
       RP("client","netcheck", rpLab(3, "netcheck", "In your John Doe case in the CMS, add a <b>Note</b> of what you told John about his net (plain language, no new figures) and a <b>Task</b> for the attorney's call.", ["net","Note","Task","attorney"])),
       SIM("calls",{note:"Providers & Records line", lab:{key:"px3:calls", title:"Call Simulator: Providers & Records (graded)", extra:LINE("Providers & Records"), caseRef:"jd", keys:["Note","Task"],
        steps:[CALL("Providers & Records", "Take <b>Graded call 1</b> on the Providers &amp; Records line."),
               CMS("Log the call in your John Doe case as a <b>Note</b> and add a <b>Task</b> for the follow-up.")]}})],
     do:["cmTrust3", SIM("cms",{title:"Update John's CMS ledger", note:"Liens tab and Finance tab after disbursement", lab:{key:"px3:cms-ledger", caseRef:"jd", keys:["Liens","Finance","settlement statement","Task"],
        steps:[{t:"<b>Liens</b> tab: each lien with its asserted, negotiated and paid amounts.", open:{tool:"cms"}},
               {t:"<b>Finance</b> tab: each released payment and each hold, with its reason."},
               {t:"Upload the signed <b>settlement statement</b> under Case Files, and add a <b>Task</b> for each hold."}]}})]},
  4:{think:["cmMediation4","cmArbitration4"],
     talk:["cmADR4", RP("litigation","mediationsched", rpLab(4, "mediationsched", "In your John Doe case in the CMS, add a <b>Note</b> of the call and a <b>Task</b> to confirm the mediation date in writing before the court's deadline.", ["deadline","Note","Task"])),
       RP("litigation","uplarbitrator", rpLab(4, "uplarbitrator", "In your John Doe case in the CMS, add a <b>Note</b> of what was asked, by whom, and what you said, and a <b>Task</b> to brief the attorney.", ["Note","Task","attorney"]))],
     do:["calendar", SIM("calendaring",{lab:{key:"px4:calendaring", caseRef:"jd", keys:["Task","reminder"],
        steps:[{t:"Build the Litigation Week in the Calendaring Simulator (it opens in its own tab) and submit it for your score.", open:{tool:"calendaring"}},
               CMS("Put the week's hard dates on your John Doe case as <b>Task</b>s, each with a <b>reminder</b>.")]}}),
       SIM("docket",{note:"The John Doe assignment (course counting rules)", lab:{key:"px4:docket", caseRef:"jd", keys:["docket","Task"],
        steps:[{t:"Work the John Doe assignment in the Docket System: put what belongs on the court <b>docket</b> there, with every deadline it triggers.", open:{tool:"docket"}},
               CMS("Add each deadline to your John Doe case as a <b>Task</b> with its warning alerts.")]}})]},
  5:{think:["cmLitigation5","cmJordan5"],
     talk:[RP("client","deponerves", rpLab(5, "deponerves", "In your John Doe case in the CMS, add a <b>Note</b> of the prep call and a <b>Task</b> for the deposition-day checklist.", ["deposition","Note","Task"])),
       RP("litigation","adjusterdirect", rpLab(5, "adjusterdirect", "In your John Doe case in the CMS, add a <b>Note</b> that the adjuster contacted the represented client, and a <b>Task</b> for the attorney's letter to the carrier.", ["Note","Task","attorney"])),
       RP("litigation","extension", rpLab(5, "extension", "In your John Doe case in the CMS, add a <b>Note</b> of the extension call and a <b>Task</b> to confirm it in writing and calendar the new date.", ["extension","Note","Task"])),
       SIM("email",{note:"Clear the CM inbox", lab:{key:"px5:email", caseRef:"jd", keys:["Note","Task"],
        steps:[{t:"Clear the Case Management inbox in the Email Workspace: one decision per email, labels, replies, and report the phishing.", open:{tool:"email"}},
               CMS("Log every email that needs case action in your John Doe case as a <b>Note</b> or a <b>Task</b>.")]}})],
     do:[SIM("efiling",{note:"John Doe's First Amended Complaint and more", lab:{key:"px5:efiling", caseRef:"jd", keys:["Litigation","service","Task"],
        steps:[{t:"File John Doe's First Amended Complaint (fix the document first, then service and fees).", open:{tool:"efiling"}},
               CMS("Upload the filed copy to your John Doe case under <b>Litigation</b> and add a <b>Task</b> for the <b>service</b> deadline.")]}}),
       SIM("docket",{lab:{key:"px5:docket", caseRef:"jd", keys:["RFA","Answer","Task"],
        steps:[{t:"Docket the litigation deadlines (the <b>RFA</b> responses, the service deadline, the <b>Answer</b>, the SOL) with warning alerts.", open:{tool:"docket"}},
               CMS("Add each deadline to your John Doe case as a <b>Task</b>.")]}}),
       SIM("cms",{title:"Build Jordan Davies's file in the CMS", note:"The Day 5 case, documented in the CMS", lab:{key:"px5:cms-jordan", legacy:"cmJordan5:cms", extra:"intake=1", caseRef:"jdv", keys:["dec pages","police report","UIM","preservation","Task"],
        steps:[{t:"<b>📝 New intake</b>: create Jordan Davies's case (a separate file from John Doe).", open:{tool:"cms", extra:"intake=1"}},
               {t:"Upload the <b>dec pages</b> and the <b>police report</b>, and record the coverage stack (the at-fault BI, Jordan's <b>UIM</b>, his mother's stacked UIM; not his brother's)."},
               {t:"Add a <b>Task</b> for every evidence request (the DOT camera, the gas-station CCTV <b>preservation</b> letter, the transit authority) and every UIM notice letter."}]}})]}
};
// Each activity's steps and review (js/cm-lab.js), defined once.
Object.entries(PLAN).forEach(([day, cats])=> Object.values(cats).forEach(list=> list.forEach(it=>{
  if(!it || typeof it !== "object" || !it.lab || !window.cmLabDefine) return;
  const t = it.kind === "sim" ? cmTool(it.id) : null, r = it.kind === "rp" ? rpLabel(it) : null;
  const steps = it.lab.steps.map(s=> s.rp === true ? Object.assign({}, s, {rp:{categoryId:it.categoryId, topicId:it.topicId}}) : s);
  cmLabDefine(it.lab.key, Object.assign({day:Number(day), tool: it.kind === "rp" ? "cms" : it.id,
    title: it.lab.title || it.title || (r ? `Live call: ${r.title}` : t ? t.name.replace(/ \((LSH Training Portal|LSH CMS)\)$/,"") : it.id),
    html: it.note && it.kind === "sim" ? `${E(it.note)}. Do the steps below, then submit what the tool gave you for review.` : "Do the steps below, then submit what the CMS gave you for review."}, it.lab, {steps}));
})));
// The Practice page's activities, day by day (the trainer's review list in js/cm-lab.js).
window.cmPracticePlan = ()=> [1,2,3,4,5].map(day=>({day, items: ["think","talk","do"].flatMap(c=> (PLAN[day][c]||[]).map(it=>{
  if(typeof it === "string"){ const t = PRACTICE_TOOLS.find(x=>x.id===it); return t ? {id:t.id, title:t.title, cat:CATS[c].label, tool:true} : null; }
  if(!it.lab) return null;
  const def = window.cmLabDef ? cmLabDef(it.lab.key) : null;
  return {id:it.lab.key, title:(def && def.title) || it.lab.key, cat:CATS[c].label, rp: it.kind === "rp" ? {topicId:it.topicId} : null, legacy:it.lab.legacy};
}).filter(Boolean)).concat(PRACTICE_TOOLS.filter(t=>t.extra && toolDayOf(t)===day).map(t=>({id:t.id, title:t.title, cat:"Extra Practice", tool:true})))}));

function rpLabel(it){
  const c = (typeof ROLEPLAY_CATEGORIES!=="undefined" ? ROLEPLAY_CATEGORIES : []).find(x=>x.id===it.categoryId);
  const t = c && c.topics.find(x=>x.id===it.topicId);
  return t ? {title:t.label, desc:t.context, cat:c.label} : null;
}
const reviewed = (keys)=> keys.some(k=> window.cmLabReview && cmLabReview(k));
function itemView(it, day){
  if(typeof it==="string"){
    const t = PRACTICE_TOOLS.find(x=>x.id===it); if(!t) return null;
    const p = (state.practiceProgress||{})[t.id];
    const subKeys = Object.keys(state.labSubs||{}).filter(k=>k.indexOf(t.id+":")===0);
    return {icon:t.icon, title:t.title, desc:t.desc, done:!!p, doneLabel: p ? `✓ Best ${p.bestScore}%` : "", isNew:!!t.isNew, reviewed: reviewed([t.id].concat(subKeys)),
      where:"In this portal", act:`goto('tool','${t.id}')`, unlocked: toolUnlocked(t)};
  }
  if(it.kind==="rp"){
    const r = rpLabel(it); if(!r) return null;
    const k = it.lab && it.lab.key, done = !!(k && window.cmLabDone && cmLabDone(k));
    return {icon:"🔥", title:r.title, desc:r.desc, where:`Live roleplay · then the CMS`, done, doneLabel:"✓ Submitted", reviewed: k ? reviewed([k]) : false,
      act: k ? `cmLabOpen('${k}')` : `pxRoleplay('${it.categoryId}','${it.topicId}')`};
  }
  if(it.kind==="sim"){
    const t = cmTool(it.id); if(!t) return null;
    const k = it.lab && it.lab.key, done = !!(k && window.cmLabDone && cmLabDone(k));
    const name = it.title || t.name.replace(/ \((LSH Training Portal|LSH CMS)\)$/,"");
    return {icon:t.icon, title:name, desc:it.note || t.desc, where: it.id==="cms" || t.cmsHosted ? "LSH CMS" : "LSH Training Portal · then the CMS",
      done, doneLabel:"✓ Submitted", live:t.live, reviewed: k ? reviewed([k]) : false,
      act: k ? `cmLabOpen('${k}')` : it.go ? `goto('${it.go}')` : `openTool('${it.id}')`};
  }
  return null;
}
window.pxRoleplay = function(categoryId, topicId){
  state.rpHub = {step:"mode", categoryId, topicId};
  goto("crisisroleplay");
};
function itemHTML(v, locked){
  const lk = locked || v.unlocked===false;
  return `<div class="px-item${lk?" locked":""}" ${lk?`title="Opens when this day unlocks"`:`onclick="${v.act}"`} role="button" tabindex="0">
    <span class="ic">${lk?"🔒":v.icon}</span>
    <div style="min-width:0"><div class="t">${E(v.title)}</div><div class="d">${E(v.desc.length>150 ? v.desc.slice(0,147).replace(/\s+\S*$/,"")+"…" : v.desc)}</div>
      <div class="tags"><span class="px-tag where">${E(v.where)}</span>${v.isNew?`<span class="px-tag new">New</span>`:""}${v.done?`<span class="px-tag done">${E(v.doneLabel)}</span>`:""}${v.reviewed?`<span class="px-tag done">💬 Reviewed</span>`:""}${v.live===false?`<span class="px-tag">Coming soon</span>`:""}</div></div></div>`;
}

window.renderPracticeHub = function(){
  const pf = state.pxFilter || {day:"all", cat:"all"};
  const days = [1,2,3,4,5].filter(n=> pf.day==="all" || String(n)===String(pf.day));
  const cats = ["think","talk","do"].filter(c=> pf.cat==="all" || pf.cat===c);
  const dayTitle = (n)=> ((typeof DAYS!=="undefined" && DAYS.find(d=>d.id===n))||{}).title || "";
  const chip = (group, val, label)=> `<button class="btn btn-sm ${String((pf||{})[group])===String(val)?"btn-navy":"btn-ghost"}" onclick="pxSetFilter('${group}','${val}')">${label}</button>`;
  const blocks = days.map(n=>{
    const plan = PLAN[n]; const unlocked = state.isAdmin || typeof dayUnlocked!=="function" || dayUnlocked(n);
    const views = {}; let total = 0, done = 0;
    cats.forEach(c=>{ views[c] = (plan[c]||[]).map(it=>itemView(it,n)).filter(Boolean); views[c].forEach(v=>{ total++; if(v.done) done++; }); });
    return `<div class="card px-day" id="px-day-${n}"><div class="px-day-h"><div><h2>Day ${n}${unlocked?"":" · 🔒"}</h2><div class="sub">${E(dayTitle(n))}</div></div>
        <span class="px-prog">${done} of ${total} done</span></div>
      <div class="px-grid${cats.length===1?" one":""}">${cats.map(c=>`<div class="px-col ${c}"><h3>${CATS[c].icon} ${CATS[c].label}</h3>
        ${views[c].map(v=>itemHTML(v, !unlocked)).join("") || `<p style="font-size:12px;color:var(--ink-soft)">—</p>`}</div>`).join("")}</div></div>`;
  }).join("");
  // Extra Practice: optional labs on the course's cases (they never hold up the next day).
  const extraViews = PRACTICE_TOOLS.filter(t=>t.extra && (pf.cat==="all" || pf.cat===t.cat) && (pf.day==="all" || String(toolDayOf(t))===String(pf.day)))
    .map(t=>{ const v = itemView(t.id); if(v) v.where = `In this portal · opens with Day ${toolDayOf(t)}`; return v; }).filter(Boolean);
  const extraBlock = extraViews.length ? `<div class="card px-day" id="px-extra"><div class="px-day-h"><div><h2>➕ Extra Practice</h2>
      <div class="sub">Optional labs on the course's cases. They open with their day and don't affect when the next day unlocks.</div></div>
      <span class="px-prog">${extraViews.filter(v=>v.done).length} of ${extraViews.length} done</span></div>
    <div class="px-grid">${extraViews.map(v=>itemHTML(v)).join("")}</div></div>` : "";
  return `<p class="eyebrow">Practice</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">🧪 Practice</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:84ch;margin:0 0 14px">Every practice tool in one place, organized the same way for every day. Each day has all three kinds of practice: <b>think</b> it through on the documents, <b>say</b> it on a call or in an email, and <b>do</b> it in the system. Each day's tools open when you reach that day${state.isAdmin ? " (as an admin you can open all of them)" : ""}.</p>
    <div class="px-cats">${["think","talk","do"].map(c=>`<div class="px-cat ${c}"><span class="ic">${CATS[c].icon}</span><b>${CATS[c].label}</b><p>${CATS[c].blurb}</p></div>`).join("")}</div>
    <div class="px-bar">${chip("day","all","All days")}${[1,2,3,4,5].map(n=>chip("day",n,"Day "+n)).join("")}<span class="sep"></span>${chip("cat","all","All")}${["think","talk","do"].map(c=>chip("cat",c,CATS[c].icon+" "+CATS[c].label)).join("")}</div>
    ${window.cmLabTrainerHTML ? cmLabTrainerHTML() : ""}
    ${blocks}
    ${extraBlock}
    <div class="card" style="padding:14px 18px;margin-bottom:14px"><b style="color:var(--navy)">Any day</b>
      <div class="px-grid" style="margin-top:10px">
        <div class="px-col think"><h3>${CATS.think.icon} Review</h3>${itemHTML({icon:"📁", title:"Case Documents", desc:"Every John Doe and Jordan Davies document the tools use.", where:"In this portal", act:"goto('casedocs')"})}</div>
        <div class="px-col talk"><h3>${CATS.talk.icon} Open practice</h3>${itemHTML({icon:"🎲", title:"Quick roleplay call", desc:"A random live call, no setup.", where:"Live roleplay", act:"rpLaunchQuickPractice()"})}${itemHTML({icon:"🔥", title:"All roleplay situations", desc:"Pick any category, situation, difficulty and persona.", where:"Live roleplay", act:"state.rpHub={step:'category'};goto('crisisroleplay')"})}${itemHTML({icon:"📞", title:"Call Simulator (all 27 CM calls)", desc:"Reception, intake, clients, attorneys, adjusters and providers.", where:"LSH Training Portal", act:"openTool('calls')"})}</div>
        <div class="px-col do"><h3>${CATS.do.icon} Platforms</h3>${itemHTML({icon:"📚", title:"CMS Training Library", desc:"20 mock cases shared by every LSH program, view only, with caller scenarios.", where:"LSH CMS", act:"openTool('cms',null,'library=1')"})}${itemHTML({icon:"📞", title:"Front Desk Drill (scored)", desc:"Timed incoming calls: find the caller's case, authenticate them, handle the call. Your trainer sees the scores.", where:"LSH CMS", act:"openTool('cms',null,'drill=1')"})}${itemHTML({icon:"🧰", title:"All tools, sign-in help & my work log", desc:"Every platform's address, how sign-in works inside the portal, and the IDs you've logged.", where:"In this portal", act:"goto('tools')"})}</div>
      </div></div>`;
};
window.pxSetFilter = function(group, val){
  state.pxFilter = Object.assign({day:"all", cat:"all"}, state.pxFilter||{}); state.pxFilter[group] = val; render();
};
})();
