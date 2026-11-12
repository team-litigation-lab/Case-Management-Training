/* 📁 Companion cases (build/case-flow/cases/CASESPEC.md): a second, shorter file a trainer assigns each trainee beside
   John Doe v. Robert Smith, with a new problem on it every Case Flow day and an Attorney–CM brainstorm at the end of
   the day, the trainer playing Atty. Thorne.
   • Trainer: Admin → Trainee Audit → each row's 📁 Case picks the trainee's case (saved on their record as
     assignedCase, which only a trainer can change). Presenter view's 🧠 Brainstorm and the end of the day's Speaker
     Notes PDF give the day's brainstorm guide for every assigned trainee: the situation, what to ask, the answer key,
     the attorney's call and the mistake to watch for.
   • Trainee: the Case File page shows their case; its case file opens on the day they're on, with what happens on the
     file and the questions Atty. Thorne will ask. The answer key never reaches the trainee's screen. */
(function(){
"use strict";
const CASES = window.CM_COMPANION_CASES || {};
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const ids = () => Object.keys(CASES);
const caseOf = id => (id && CASES[id]) || null;
const isAdmin = () => typeof state !== "undefined" && !!state.isAdmin && !state.adminPreview;
const days = () => (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d.cf);
// a course day's Case Flow number (1–5): the companion case's day
const cfN = d => (d && d.cf && d.cf.n) || 1;
const dayByN = n => days().find(d => cfN(d) === n) || null;
// the trainee's day: the first Case Flow day not yet passed
function traineeDayN(){
  const ds = days(); if(!ds.length) return 1;
  const open = ds.find(d => !((state.progress || {})[d.id] || {}).done);
  return cfN(open || ds[ds.length - 1]);
}
const firstName = rec => String((rec && (rec.firstName || rec.name)) || "Trainee").trim().split(/\s+/)[0];

/* ---------- Admin → Trainee Audit: 📁 Case on each row ---------- */
function renderCaseAssignControl(rec){
  if(!ids().length) return "";
  const cur = rec.assignedCase && rec.assignedCase.id;
  return `<select class="btn btn-sm btn-ghost cc-assign${cur ? " on" : ""}" title="Assign this trainee a companion case: a second file with a new problem each day and an Attorney–CM brainstorm" onchange="cmCompanion.assign('${E(rec.id)}', this.value)">
      <option value="">📁 ${cur ? "Case: none (remove)" : "Assign a case…"}</option>
      ${ids().map((id, i) => `<option value="${id}" ${id === cur ? "selected" : ""}>📁 ${i + 1}. ${E(CASES[id].theme)}: ${E(CASES[id].title)}</option>`).join("")}
    </select>`;
}
async function assign(traineeId, caseId){
  const rec = await sharedGet("trainee:" + traineeId); if(!rec) return;
  rec.assignedCase = caseId && CASES[caseId] ? {id: caseId, title: CASES[caseId].title, at: new Date().toISOString()} : null;
  if(!(await sharedSet("trainee:" + traineeId, rec))){ if(typeof toast === "function") toast("Not saved: check your connection and try again."); return; }
  if(state.adminData){ const i = state.adminData.findIndex(r => r.id === traineeId); if(i !== -1) state.adminData[i] = rec; }
  const wrap = document.getElementById("adminRowsWrap"); if(wrap && typeof renderAdminRows === "function") wrap.innerHTML = renderAdminRows();
  if(typeof toast === "function") toast(rec.assignedCase ? `${rec.name || "Trainee"} now has ${CASES[caseId].title}. They'll see it on their Case File.` : `Companion case removed for ${rec.name || "the trainee"}.`);
}
if(typeof window.renderUnlockDaysControl === "function" || typeof renderUnlockDaysControl === "function"){
  // the row's controls: the case picker sits where the (retired) day-unlock control renders
  const __unlock = renderUnlockDaysControl;
  window.renderUnlockDaysControl = renderUnlockDaysControl = function(rec){ return __unlock.apply(this, arguments) + renderCaseAssignControl(rec); };
}

/* ---------- the case file, in a pop-up (trainee and trainer) ---------- */
function dayHtml(c, n, trainer){
  const x = (c.days || {})[n] || {}, d = dayByN(n);
  return `<div class="cc-day">
    <div class="cc-day-h"><span>Day ${n}${d ? ` · ${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}` : ""}</span><b>${E(x.title)}</b></div>
    <p class="cc-sit">${E(x.situation)}</p>
    <p class="cc-task"><b>Your task:</b> ${E(x.task)}</p>
    <div class="cc-asks"><b>🧠 Attorney–CM brainstorm: Atty. Thorne will ask you</b><ol>${(x.attorneyAsks || []).map(q => `<li>${E(q)}</li>`).join("")}</ol></div>
    ${trainer ? `<div class="cc-key"><b>Answer key: a strong answer covers</b><ul>${(x.strongAnswer || []).map(q => `<li>${E(q)}</li>`).join("")}</ul>
      <p><b>⚖ Atty. Thorne's call, not the Case Manager's:</b> ${E(x.attorneysCall)}</p>
      <p><b>⚠ Watch for:</b> ${E(x.watchFor)}</p></div>` : ""}
  </div>`;
}
function fileHtml(c){
  return `<div class="cc-file">
    <p class="cc-hook">${E(c.hook)}</p>
    <dl><dt>Type</dt><dd>${E(c.type)}</dd><dt>Client</dt><dd>${E(c.client)}</dd><dt>Injuries</dt><dd>${E(c.injuries)}</dd><dt>Coverage</dt><dd>${E(c.coverage)}</dd><dt>Lead Counsel</dt><dd>Atty. Elijah Thorne</dd></dl>
    <b class="cc-sub">At intake</b><ul>${(c.facts || []).map(f => `<li>${E(f)}</li>`).join("")}</ul>
  </div>`;
}
let openState = null;   // {id, n, trainer, who}
function open(id, n, opts){
  const c = caseOf(id); if(!c) return;
  const trainer = !!(opts && opts.trainer) && isAdmin();
  openState = {id, n: n || (trainer ? 1 : traineeDayN()), trainer, who: (opts && opts.who) || ""};
  paint();
}
function paint(){
  close(true);
  const {id, n, trainer, who} = openState, c = caseOf(id);
  const o = document.createElement("div"); o.className = "cc-modal"; o.id = "ccModal"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Companion case: " + c.title);
  o.onclick = e => { if(e.target === o) close(); };
  o.innerHTML = `<div class="cc-box"><button type="button" class="cc-x" onclick="cmCompanion.close()" aria-label="Close">✕</button>
    <p class="cc-eyebrow">📁 ${trainer ? `Companion case${who ? ` · ${E(who)}` : ""} · trainer view` : "Your companion case"} · ${E(c.theme)}</p>
    <h2>${E(c.title)}</h2>
    ${fileHtml(c)}
    <div class="cc-tabs" role="tablist">${[1, 2, 3, 4, 5].map(k => `<button type="button" role="tab" aria-selected="${k === n}" class="${k === n ? "on" : ""}" onclick="cmCompanion.day(${k})">Day ${k}</button>`).join("")}</div>
    ${dayHtml(c, n, trainer)}
    ${trainer ? "" : `<p class="cc-foot">Work it out before the end of the day: at the brainstorm you present your plan to Atty. Thorne (your trainer). Facts, documents and next steps are yours; advice, value and strategy are his.</p>`}
  </div>`;
  document.body.appendChild(o); document.addEventListener("keydown", onKey);
  const x = o.querySelector(".cc-x"); if(x) x.focus();
}
function onKey(e){ if(e.key === "Escape") close(); }
function close(keep){ const o = document.getElementById("ccModal"); if(o) o.remove(); document.removeEventListener("keydown", onKey); if(!keep) openState = null; }
function day(k){ if(openState){ openState.n = k; paint(); } }

/* ---------- the trainee's Case File: their companion case, under the page's header ---------- */
function traineeCard(){
  if(isAdmin() || typeof state === "undefined") return "";
  const a = state.assignedCase, c = caseOf(a && a.id); if(!c) return "";
  const n = traineeDayN(), x = (c.days || {})[n] || {};
  return `<div class="cc-card" role="region" aria-label="Your companion case">
    <div class="cc-card-ic" aria-hidden="true">📁</div>
    <div class="cc-card-tx"><span>Your companion case · ${E(c.theme)}</span><b>${E(c.title)}</b><em>Day ${n}: ${E(x.title)}. Prepare for today's Attorney–CM brainstorm.</em></div>
    <button type="button" class="btn btn-primary btn-sm" onclick="cmCompanion.open('${E(a.id)}')">Open case file</button>
  </div>`;
}
if(typeof window.renderClientProfile === "function"){
  const __file = window.renderClientProfile;
  window.renderClientProfile = function(){
    const html = __file.apply(this, arguments), card = traineeCard(); if(!card) return html;
    const at = html.indexOf('<div class="cf-file-facts">');
    return at >= 0 ? html.slice(0, at) + card + html.slice(at) : html + card;
  };
}

/* ---------- the trainer's brainstorm guide for a day: every assigned trainee ---------- */
function assigned(){
  return (state.adminData || []).filter(r => !r.archived && r.assignedCase && CASES[r.assignedCase.id])
    .sort((a, b) => String(a.batch || "").localeCompare(String(b.batch || "")) || String(a.name || "").localeCompare(String(b.name || "")));
}
let loadingRecs = false;
function needRecs(after){
  if(state.adminData || loadingRecs || typeof sharedList !== "function") return;
  loadingRecs = true;
  sharedList("trainee:").then(keys => sharedGetMany(keys)).then(rs => { if(!state.adminData) state.adminData = (rs || []).filter(Boolean); })
    .catch(() => {}).then(() => { loadingRecs = false; if(after) after(); });
}
function guideHtml(n){
  if(!state.adminData){ needRecs(() => { const b = document.getElementById("ccBrain"); if(b) brainstorm(b.dataset.day); }); return `<p class="cc-none">Loading the trainees' cases…</p>`; }
  const rs = assigned();
  if(!rs.length) return `<p class="cc-none">No trainee has a companion case yet. Assign one in Admin → Trainee Audit (📁 on each trainee's row).</p>`;
  return rs.map(r => { const c = CASES[r.assignedCase.id], x = (c.days || {})[n] || {};
    return `<details class="cc-g"><summary><b>${E(r.name || "Trainee")}</b>${r.batch ? `<span class="cc-batch">${E(typeof batchShow === "function" ? batchShow(r.batch) : r.batch)}</span>` : ""}<span>📁 ${E(c.title)} · ${E(x.title)}</span></summary>
      <div class="cc-g-body">${dayHtml(c, n, true)}<button type="button" class="btn btn-ghost btn-sm" onclick="cmCompanion.open('${E(r.assignedCase.id)}', ${n}, {trainer: true, who: '${E(String(r.name || "").replace(/'/g, ""))}'})">Open the whole case file</button></div></details>`; }).join("");
}
function brainstormCard(d){
  const n = cfN(d);
  return `<div class="cc-brain-card"><p class="cc-eyebrow">🧠 Attorney–CM Brainstorm · Companion cases</p><h2>Day ${n}: each trainee's own case</h2>
    <p class="cc-bn">End the day with each trainee's own case. You play Atty. Thorne: they present the problem and their plan, you ask the questions below and check their answer against the key. Hold the line on what's the attorney's call.</p>
    ${guideHtml(n)}</div>`;
}
// the day's Speaker Notes PDF ends with the brainstorm guide: each assigned trainee's case for the day (every case
// when no trainee has one yet, so the guide can be printed ahead of assigning)
if(typeof window.buildDayScriptLines === "function"){
  const __lines = window.buildDayScriptLines;
  window.buildDayScriptLines = function(d){
    const lines = __lines.apply(this, arguments); if(!d || !d.cf || !ids().length) return lines;
    const n = cfN(d), rs = assigned();
    const rows = rs.length ? rs.map(r => [r.assignedCase.id, r.name || "Trainee"]) : ids().map(id => [id, ""]);
    lines.push(`## Attorney–CM Brainstorm: Companion Cases, Day ${n}`, "You play Atty. Thorne. Each trainee presents today's problem on their own case and their plan; ask the questions, check the answer against the key, and hold the line on the attorney's call.");
    rows.forEach(([id, who]) => { const c = CASES[id], x = (c.days || {})[n] || {};
      lines.push(`## ${who ? who + ": " : ""}${c.title} (${c.theme})`, `TODAY: ${x.title}. ${x.situation}`, `THE TASK: ${x.task}`,
        ...(x.attorneyAsks || []).map((q, i) => `ASK ${i + 1}: ${q}`), ...(x.strongAnswer || []).map(a => `KEY: ${a}`),
        `ATTORNEY'S CALL: ${x.attorneysCall}`, `WATCH FOR: ${x.watchFor}`, "---"); });
    return lines;
  };
}
// Presenter view's 🧠 Brainstorm: the same guide in a pop-up beside the slides
function brainstorm(dayId){
  close(true);
  const d = days().find(x => String(x.id) === String(dayId)) || days()[0]; if(!d) return;
  const o = document.createElement("div"); o.className = "cc-modal"; o.id = "ccModal"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Attorney–CM brainstorm");
  o.onclick = e => { if(e.target === o) close(); };
  o.innerHTML = `<div class="cc-box" id="ccBrain" data-day="${E(d.id)}"><button type="button" class="cc-x" onclick="cmCompanion.close()" aria-label="Close">✕</button>${brainstormCard(d)}</div>`;
  document.body.appendChild(o); document.addEventListener("keydown", onKey);
}

const css = document.createElement("style"); css.id = "cm-companion";
css.textContent = `
.cc-assign{max-width:230px;padding:4px 8px;} .cc-assign.on{border-color:var(--orange,#DB8437);color:var(--navy);font-weight:700;}
.cc-card{display:flex;align-items:center;gap:14px;margin:0 0 14px;padding:12px 16px;border-radius:14px;background:var(--surface-glass,rgba(255,255,255,.72));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid #E3E6EE;border-left:4px solid var(--orange,#DB8437);}
.cc-card-ic{font-size:26px;flex:0 0 auto;} .cc-card-tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px;}
.cc-card-tx span{font:700 11px 'Inter',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#8A5A24;} .cc-card-tx b{font-family:'Fraunces',Georgia,serif;font-size:18px;color:var(--navy);}
.cc-card-tx em{font-style:normal;font-size:13px;color:var(--ink-soft);}
@media(max-width:640px){ .cc-card{flex-wrap:wrap;} .cc-card .btn{width:100%;} }
.cc-modal{position:fixed;inset:0;z-index:2147482000;background:rgba(15,20,40,.55);display:flex;align-items:center;justify-content:center;padding:16px;}
.cc-box{position:relative;background:#fff;border-radius:16px;padding:22px 24px;max-width:860px;width:100%;max-height:90vh;overflow:auto;box-shadow:0 20px 50px rgba(0,0,0,.3);color:#262B45;}
.cc-x{position:absolute;top:12px;right:14px;border:0;background:none;font-size:18px;cursor:pointer;color:#5B6579;}
.cc-eyebrow{margin:0 0 4px;font:700 11.5px 'Inter',sans-serif;letter-spacing:.06em;text-transform:uppercase;color:#8A5A24;padding-right:28px;}
.cc-box h2{margin:0 0 10px;font-family:'Fraunces',Georgia,serif;color:var(--navy,#262B45);font-size:24px;}
.cc-hook{margin:0 0 12px;font-size:15px;font-weight:600;color:var(--navy,#262B45);}
.cc-file dl{display:grid;grid-template-columns:110px 1fr;gap:6px 12px;margin:0 0 12px;font-size:14px;} .cc-file dt{font-weight:700;color:#5B6579;} .cc-file dd{margin:0;}
@media(max-width:560px){ .cc-file dl{grid-template-columns:1fr;} .cc-file dd{margin-bottom:6px;} }
.cc-sub{display:block;font-size:13px;color:#5B6579;margin:4px 0;} .cc-file ul{margin:0 0 14px;padding-left:20px;font-size:14px;line-height:1.5;}
.cc-tabs{display:flex;gap:6px;flex-wrap:wrap;margin:6px 0 12px;border-bottom:1px solid #E2E6EF;padding-bottom:8px;}
.cc-tabs button{border:1px solid #DDE1EC;background:#F4F5F9;border-radius:999px;padding:5px 14px;font:700 12.5px 'Inter',sans-serif;color:#4A5070;cursor:pointer;}
.cc-tabs button.on{background:var(--navy,#262B45);border-color:var(--navy,#262B45);color:#fff;}
.cc-day-h{display:flex;flex-direction:column;gap:2px;margin-bottom:8px;} .cc-day-h span{font-size:12px;color:#5B6579;font-weight:600;} .cc-day-h b{font-family:'Fraunces',Georgia,serif;font-size:18px;color:var(--navy,#262B45);}
.cc-sit{margin:0 0 10px;font-size:14.5px;line-height:1.6;} .cc-task{margin:0 0 12px;font-size:14px;}
.cc-asks,.cc-key{border-radius:12px;padding:10px 14px;margin:0 0 10px;font-size:14px;line-height:1.5;}
.cc-asks{background:#F4F5F9;border:1px solid #E2E6EF;} .cc-key{background:#FFF6EC;border:1px solid #F0D2B0;}
.cc-asks ol,.cc-key ul{margin:6px 0 0;padding-left:20px;} .cc-key p{margin:8px 0 0;}
.cc-foot{margin:10px 0 0;font-size:12.5px;color:#5B6579;}
.cc-brain-card{color:#262B45;} .cc-bn{margin:0 0 10px;font-size:14px;line-height:1.55;color:#4A5070;} .cc-none{color:var(--ink-soft,#5B6579);font-size:13.5px;margin:8px 0 0;}
.cc-g{border-top:1px solid #ECEEF4;padding:8px 0;} .cc-g summary{cursor:pointer;display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;font-size:14px;}
.cc-g summary span{color:#5B6579;font-size:13px;} .cc-batch{font-family:'IBM Plex Mono',monospace;font-size:11.5px !important;}
.cc-g-body{padding:10px 0 4px;}`;
document.head.appendChild(css);
window.cmCompanion = {open, close: () => close(), day, assign, brainstorm, cases: () => CASES};
})();
