/* 🏅 The Scorecard, set up the way Foundational Training's is (its js/lsh-program.js): every grading system's graded
   items, each system's average, and the overall, the average of the systems that have a score, so each counts the same.
   Foundational's task trackers and monitoring sheets have no place here; these are this course's own grading systems:
     ✍️ Knowledge Checks      each Case Flow day's quiz (70% passes)
     🧩 Learning Checks       each module's composite (AI × 0.60 + trainer × 0.40), the automated half until the trainer scores it
     📝 Takeaways             each day's Knowledge Check answers, AI-graded
     🧪 Skill Activities      each graded Skill Activity on John Doe's file (the work log)
     🛠 Skill Builders        each practice tool's best score
     🎯 Graded Calls          the best graded call on each Call Simulator line (callsim:<id>, written by the Portal)
     🧰 Portal Simulators     the best result on each Training Portal simulator (simresults:<id>, written by the Portal)
     🎲 Random Tasks          each resolved random task's grade
   • Trainee: 🏅 My Performance (#/scorecard), their own grades, card by card.
   • Trainer: 🏅 Scorecards (the same address), every approved trainee in one table by batch; a row opens the trainee's cards.
   It only reads: trainee:<id> (its caseFlow summary, dayProgress and practiceProgress), progress:<id> (work-log, task-log),
   callsim:<id> and simresults:<id>, in one get-many. */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const num = v => typeof v === "number" && isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : null;
const pctTxt = p => p == null ? "—" : p + "%";
const tier = p => p == null ? "none" : p >= 85 ? "hi" : p >= 70 ? "ok" : "lo";
const isAdmin = () => typeof state !== "undefined" && !!state.isAdmin && !state.adminPreview;
const isTrainee = () => typeof state !== "undefined" && !!state.traineeId && !state.isAdmin;
const cfDays = () => (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d.cf);
const dayName = d => `Day ${d.cf.n}: ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`;
const fmt = at => { try{ return at ? new Date(at).toLocaleDateString(undefined, {month: "short", day: "numeric"}) : ""; }catch(e){ return ""; } };
function moduleNames(){
  const out = {};
  const CF = window.CM_CASE_FLOW; if(CF && CF.days) CF.days.forEach(d => (d.modules || []).forEach(m => { out[m.id] = {title: m.title, n: d.n}; }));
  return out;
}

/* ---------- the grading systems: each returns its items, {name, pct, note, auto} ---------- */
const SOURCES = [
  {id: "kc", icon: "✍️", label: "Knowledge Checks", about: "Each Case Flow day's Knowledge Check. 70% passes the day.",
    items: c => cfDays().map(d => { const s = ((c.cf.days || {})[d.cf.n] || {}), p = (c.rec.dayProgress || {})[d.id] || {};
      const pct = num(s.kc != null ? s.kc : p.score); if(pct == null) return null;
      return {name: dayName(d), pct, note: pct >= 70 ? "Passed" : "Below 70%: not passed yet"}; })},
  {id: "lc", icon: "🧩", label: "Learning Checks", about: "Each module's Learning Check: AI × 0.60 + trainer × 0.40. Until the trainer scores it, the automated half counts.",
    items: c => { const names = moduleNames(), out = [];
      Object.values(c.cf.days || {}).forEach(day => Object.entries(day.modules || {}).forEach(([id, s]) => {
        const pct = num(s.c != null ? s.c : s.a); if(pct == null) return;
        out.push({name: (names[id] ? `Day ${names[id].n}: ${names[id].title}` : id), pct, auto: s.c == null,
          note: s.c != null ? `Automated ${pctTxt(num(s.a))} · Trainer ${pctTxt(num(s.t))}` : "Automated only: awaiting the trainer's 40%"}); }));
      return out; }},
  {id: "tk", icon: "📝", label: "Takeaways", about: "Each day's Knowledge Check answers, in your own words, AI-graded.",
    items: c => cfDays().map(d => { const s = (c.cf.days || {})[d.cf.n] || {}, p = (c.rec.dayProgress || {})[d.id] || {};
      const pct = num(s.takeaway != null ? s.takeaway : p.takeaway); return pct == null ? null : {name: dayName(d), pct}; })},
  {id: "sa", icon: "🧪", label: "Skill Activities", about: "Each graded Skill Activity on John Doe's file: the latest attempt of each.",
    items: c => { const seen = {}; (c.data["work-log"] || []).filter(e => e && e.kind === "lab" && typeof e.score === "number")
      .forEach(e => { const k = e.label || e.toolId || "Skill Activity"; if(!seen[k] || String(e.at || "") > String(seen[k].at || "")) seen[k] = e; });
      return Object.entries(seen).map(([k, e]) => ({name: k, pct: num(e.score), note: [e.tier, fmt(e.at)].filter(Boolean).join(" · ")})); }},
  {id: "sb", icon: "🛠", label: "Skill Builders", about: "Each practice tool's best score.",
    items: c => Object.entries(c.rec.practiceProgress || {}).filter(([, v]) => v && typeof v.bestScore === "number" && v.bestScore > 0).map(([id, v]) => {
      const t = (typeof PRACTICE_TOOLS !== "undefined" ? PRACTICE_TOOLS : []).find(x => x.id === id);
      return {name: t ? t.title : id, pct: num(v.bestScore), note: `${v.runs || 1} attempt${(v.runs || 1) === 1 ? "" : "s"}`}; })},
  {id: "gc", icon: "🎯", label: "Graded Calls", about: "The best graded call on each Call Simulator line (☎ LSH Ring Channel).",
    items: c => Object.entries((c.callsim && c.callsim.best) || {}).filter(([, b]) => b && typeof b.score === "number").map(([k, b]) => ({
      name: b.line || k.replace(/^line:/, ""), pct: num(b.score), note: `${b.calls || 1} call${(b.calls || 1) === 1 ? "" : "s"}`}))},
  {id: "ps", icon: "🧰", label: "Portal Simulators", about: "The best result on each Training Portal simulator.",
    items: c => Object.entries((c.sim && c.sim.best) || {}).filter(([, b]) => b && typeof b.score === "number").map(([k, b]) => ({
      name: k, pct: num(b.score), note: `${b.count || 1} run${(b.count || 1) === 1 ? "" : "s"}${b.at ? " · " + fmt(b.at) : ""}`}))},
  {id: "rt", icon: "🎲", label: "Random Tasks", about: "Each resolved random task's grade: timeliness, priorities, the day's lesson, communication and risk.",
    items: c => (c.data["task-log"] || []).filter(e => e && e.status === "resolved" && typeof e.score === "number").map(e => ({
      name: (e.task && (e.task.title || e.task.name)) || (typeof e.task === "string" ? e.task.slice(0, 80) : "Random task"), pct: num(e.score), note: fmt(e.resolvedAt || e.id)}))}
];
function compute(c){
  const rows = SOURCES.map(s => {
    let items = []; try{ items = (s.items(c) || []).filter(x => x && x.pct != null); }catch(e){ items = []; }
    return {s, items, avg: items.length ? Math.round(items.reduce((n, x) => n + x.pct, 0) / items.length) : null};
  });
  const have = rows.filter(r => r.avg != null);
  const overall = have.length ? Math.round(have.reduce((n, r) => n + r.avg, 0) / have.length) : null;
  const done = cfDays().filter(d => (((c.rec.dayProgress || {})[d.id]) || {}).done || (((c.cf.days || {})[d.cf.n]) || {}).passed).length;
  return {rows, overall, systems: have.length, graded: have.reduce((n, r) => n + r.items.length, 0), done, total: cfDays().length};
}
const overallWhy = sc => sc.overall == null ? "Nothing graded yet" : `The average of ${sc.systems} grading system${sc.systems === 1 ? "" : "s"} = ${sc.overall}%`;
const HOW = "Each grading system's score is the average of its graded items; the overall score is the average of the grading systems that have a score, so each one counts the same.";
// a trainee's records as one context (the trainer's table and the trainee's own page read the same)
const ctxOf = (rec, prog, callsim, sim) => ({rec: rec || {}, cf: (rec && rec.caseFlow) || {days: {}}, data: (prog && prog.data) || {}, callsim, sim});

/* ---------- the cards ---------- */
function detail(sc){
  return `<div class="scx-grid">${sc.rows.map(r => `<div class="scx-src">
      <div class="scx-src-h"><span>${r.s.icon}</span><b>${E(r.s.label)}</b><span class="scx-pill t-${tier(r.avg)}">${pctTxt(r.avg)}</span></div>
      <p class="scx-about">${E(r.s.about)}</p>
      ${r.items.length ? `<table class="scx-tbl"><tbody>${r.items.map(x => `<tr><td>${E(x.name)}${x.note ? `<span>${E(x.note)}</span>` : ""}</td><td class="scx-n t-${tier(x.pct)}">${pctTxt(x.pct)}${x.auto ? ` <small title="Automated only">⚙</small>` : ""}</td></tr>`).join("")}</tbody></table>`
        : `<p class="scx-empty">Nothing graded here yet.</p>`}</div>`).join("")}</div>`;
}
const ring = (p, why) => `<div class="scx-ring t-${tier(p)}" style="--p:${p == null ? 0 : p}" title="${E(why || "")}"><span>${pctTxt(p)}</span><small>overall</small></div>`;

/* ---------- 🏅 My Performance: the trainee's own ---------- */
const MINE = {id: null, at: 0, loading: null, recs: null};
function loadMine(force){
  if(!isTrainee() || MINE.loading) return;
  const id = state.traineeId;
  if(!force && MINE.id === id && Date.now() - MINE.at < 60000) return;
  MINE.at = Date.now();
  MINE.loading = sharedGetMany(["trainee:" + id, "progress:" + id, "callsim:" + id, "simresults:" + id]).then(v => { if(state.traineeId === id){ MINE.id = id; MINE.recs = v || []; } })
    .catch(() => {}).then(() => { MINE.loading = null; if(state.view === "scorecard" && typeof render === "function") render(); });
}
function myCtx(){
  const [rec, prog, callsim, sim] = MINE.recs || [];
  const c = ctxOf(rec, prog, callsim, sim);
  // what's on this device is the freshest: the live summary, the day progress, the practice bests and the logs
  try{ if(window.cmCaseFlow && cmCaseFlow.scoreSummary) c.cf = cmCaseFlow.scoreSummary(); }catch(e){}
  c.rec = Object.assign({}, c.rec, {dayProgress: state.progress || c.rec.dayProgress || {}, practiceProgress: state.practiceProgress || c.rec.practiceProgress || {}});
  if(Array.isArray(state.taskLog)) c.data = Object.assign({}, c.data, {"task-log": state.taskLog});
  if(Array.isArray(state.workLog)) c.data = Object.assign({}, c.data, {"work-log": state.workLog});
  return c;
}
function renderMine(){
  loadMine(MINE.id !== state.traineeId);
  const loaded = MINE.id === state.traineeId, sc = compute(myCtx());
  return `<div class="scx-page"><div class="scx-hero">
      ${ring(loaded ? sc.overall : null, loaded ? overallWhy(sc) : "")}
      <div class="scx-hero-t"><p class="eyebrow">My Performance</p><h1>🏅 My Performance</h1>
        <p>Every grade the course gives you, collected from all of its grading systems.</p>
        <div class="scx-facts"><span><b>${sc.done} / ${sc.total}</b> days passed</span><span><b>${sc.graded}</b> graded item${sc.graded === 1 ? "" : "s"}</span><span><b>${sc.systems} / ${SOURCES.length}</b> grading systems with a score</span></div></div>
      <button type="button" class="btn btn-ghost btn-sm scx-print" onclick="window.print()">🖨 Print</button></div>
    ${loaded ? detail(sc) : `<div class="scx-wait">Collecting your grades…</div>`}
    <p class="scx-how">${HOW}</p></div>`;
}

/* ---------- 🏅 Scorecards: every approved trainee, for the trainer ---------- */
const ALL = {rows: null, loading: false, batch: "", open: {}};
async function loadAll(){
  ALL.loading = true;
  try{
    let people = state.adminData;
    if(!people){ const keys = await sharedList("trainee:"); people = (await sharedGetMany(keys)).filter(Boolean); state.adminData = people; }
    people = people.filter(r => r && r.approved === true && !r.archived);
    const want = []; people.forEach(r => want.push("progress:" + r.id, "callsim:" + r.id, "simresults:" + r.id));
    const vals = await sharedGetMany(want);
    ALL.rows = people.map((r, i) => ({id: r.id, name: r.name || r.id, batch: r.batch || "", sc: compute(ctxOf(r, vals[i * 3], vals[i * 3 + 1], vals[i * 3 + 2]))}))
      .sort((a, b) => a.batch.localeCompare(b.batch) || a.name.localeCompare(b.name));
  }catch(e){ ALL.rows = []; }
  ALL.loading = false;
  if(state.view === "scorecard" && typeof render === "function") render();
}
const batchOf = b => typeof cleanBatch === "function" ? (cleanBatch(b) || b) : b;
function renderAll(){
  if(!ALL.rows){ if(!ALL.loading) loadAll(); return `<div class="scx-page"><div class="scx-wait">Collecting every trainee's grades…</div></div>`; }
  const batches = [...new Set(ALL.rows.map(r => batchOf(r.batch)).filter(Boolean))].sort();
  const rows = ALL.rows.filter(r => !ALL.batch || batchOf(r.batch) === ALL.batch);
  const cell = (p, why) => `<td class="scx-n t-${tier(p)}"${why ? ` title="${E(why)}"` : ""}>${pctTxt(p)}</td>`;
  return `<div class="scx-page scx-wide"><div class="scx-admin">
    <div class="scx-admin-bar"><div><p class="eyebrow">Admin</p><h1>🏅 Scorecards</h1><p class="scx-about">Each trainee's grades, collected from all of the course's grading systems. Click a trainee for the details.</p></div>
      <span><select onchange="cmScorecard.batch(this.value)" aria-label="Batch"><option value="">All batches</option>${batches.map(b => `<option ${b === ALL.batch ? "selected" : ""}>${E(b)}</option>`).join("")}</select>
      <button type="button" class="btn btn-ghost btn-sm" onclick="cmScorecard.refresh()">↻ Refresh</button>
      <button type="button" class="btn btn-ghost btn-sm" onclick="cmScorecard.csv()">⬇ CSV</button></span></div>
    ${rows.length ? `<div class="scx-scroll"><table class="scx-tbl scx-admin-tbl"><thead><tr><th>Trainee</th><th>Batch</th><th>Days</th>${SOURCES.map(s => `<th>${s.icon} ${E(s.label)}</th>`).join("")}<th>Overall</th></tr></thead><tbody>
      ${rows.map(r => `<tr class="scx-row" tabindex="0" onclick="cmScorecard.toggle('${E(r.id)}')" onkeydown="if(event.key==='Enter')cmScorecard.toggle('${E(r.id)}')"><td><b>${E(r.name)}</b></td><td class="scx-batch">${E(batchOf(r.batch))}</td><td>${r.sc.done} / ${r.sc.total}</td>${r.sc.rows.map(x => cell(x.avg)).join("")}${cell(r.sc.overall, overallWhy(r.sc))}</tr>
        ${ALL.open[r.id] ? `<tr class="scx-open"><td colspan="${SOURCES.length + 4}">${detail(r.sc)}</td></tr>` : ""}`).join("")}
    </tbody></table></div>` : `<p class="scx-empty">No approved trainees${ALL.batch ? " in this batch" : ""} yet.</p>`}
    <p class="scx-how">${HOW}</p></div></div>`;
}
function csv(){
  const rows = (ALL.rows || []).filter(r => !ALL.batch || batchOf(r.batch) === ALL.batch);
  const q = v => `"${String(v == null ? "" : v).replace(/"/g, '""')}"`;
  const lines = [["Trainee", "Batch", "Days passed"].concat(SOURCES.map(s => s.label), ["Overall"]).map(q).join(",")]
    .concat(rows.map(r => [r.name, batchOf(r.batch), `${r.sc.done}/${r.sc.total}`].concat(r.sc.rows.map(x => x.avg == null ? "" : x.avg), [r.sc.overall == null ? "" : r.sc.overall]).map(q).join(",")));
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], {type: "text/csv"}));
  a.download = `Scorecards${ALL.batch ? " - " + ALL.batch : ""}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- the page, its address and its top-bar button ---------- */
window.renderScorecardPage = () => isAdmin() ? renderAll() : isTrainee() ? renderMine() : (typeof renderDashboard === "function" ? renderDashboard() : "");
window.addEventListener("focus", () => { if(isTrainee() && state.view === "scorecard") loadMine(); });
window.cmScorecard = {
  batch(b){ ALL.batch = b || ""; render(); },
  refresh(){ ALL.rows = null; state.adminData = null; render(); },
  toggle(id){ ALL.open[id] = !ALL.open[id]; render(); },
  csv, compute, sources: SOURCES
};

const css = document.createElement("style"); css.id = "cm-scorecard";
css.textContent = `
.scx-page{max-width:1180px;margin:0 auto;padding:4px 0 24px;color:var(--navy,#262B45);} .scx-wide{max-width:none;}
.scx-hero,.scx-admin,.scx-src,.scx-wait{background:var(--surface-glass,rgba(255,255,255,.78));backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid #E3E6EE;border-radius:16px;}
.scx-hero{display:flex;align-items:center;gap:22px;padding:20px 24px;margin-bottom:14px;position:relative;}
.scx-hero h1,.scx-admin h1{margin:2px 0 4px;font-family:'Fraunces',Georgia,serif;font-size:28px;color:var(--navy,#262B45);}
.scx-hero p{margin:0;color:var(--ink-soft,#5B6579);font-size:14px;} .scx-hero-t{flex:1;min-width:0;}
.scx-facts{display:flex;flex-wrap:wrap;gap:8px 18px;margin-top:10px;font-size:13px;color:var(--ink-soft,#5B6579);} .scx-facts b{color:var(--navy,#262B45);}
.scx-print{position:absolute;top:14px;right:16px;}
.scx-ring{--c:#9CA3B8;flex:0 0 auto;width:112px;height:112px;border-radius:50%;display:flex;flex-direction:column;align-items:center;justify-content:center;background:conic-gradient(var(--c) calc(var(--p)*1%),#E9EBF2 0);position:relative;}
.scx-ring::before{content:"";position:absolute;inset:10px;border-radius:50%;background:#fff;}
.scx-ring span,.scx-ring small{position:relative;} .scx-ring span{font:800 26px 'Inter',sans-serif;color:var(--navy,#262B45);} .scx-ring small{font-size:11px;color:#5B6579;text-transform:uppercase;letter-spacing:.08em;}
.scx-ring.t-hi{--c:#1F8A5B;} .scx-ring.t-ok{--c:#DB8437;} .scx-ring.t-lo{--c:#C0392B;}
.scx-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(320px,1fr));gap:14px;}
.scx-src{padding:14px 16px;} .scx-src-h{display:flex;align-items:center;gap:8px;font-size:16px;} .scx-src-h b{flex:1;}
.scx-about{margin:4px 0 10px;font-size:12.5px;color:var(--ink-soft,#5B6579);line-height:1.45;}
.scx-pill{font:800 13px 'Inter',sans-serif;padding:3px 10px;border-radius:999px;background:#EEF0F5;}
.scx-pill.t-hi,.scx-n.t-hi{color:#1F7A50;} .scx-pill.t-ok,.scx-n.t-ok{color:#A85A16;} .scx-pill.t-lo,.scx-n.t-lo{color:#B42318;} .scx-n.t-none{color:#9CA3B8;}
.scx-pill.t-hi{background:#E3F4EC;} .scx-pill.t-ok{background:#FDF0E2;} .scx-pill.t-lo{background:#FBE7E5;}
.scx-tbl{width:100%;border-collapse:collapse;font-size:13.5px;} .scx-tbl td,.scx-tbl th{padding:7px 8px;border-top:1px solid #ECEEF4;text-align:left;vertical-align:top;}
.scx-tbl td span{display:block;font-size:11.5px;color:#5B6579;margin-top:1px;} .scx-n{text-align:right !important;font-weight:800;white-space:nowrap;}
.scx-empty{margin:4px 0 0;font-size:13px;color:#8A90A6;} .scx-how{margin:14px 2px 0;font-size:12.5px;color:var(--ink-soft,#5B6579);}
.scx-wait{padding:28px;text-align:center;color:var(--ink-soft,#5B6579);}
.scx-admin{padding:18px 20px;} .scx-admin-bar{display:flex;flex-wrap:wrap;justify-content:space-between;align-items:flex-end;gap:12px;margin-bottom:12px;}
.scx-admin-bar > span{display:flex;gap:8px;flex-wrap:wrap;align-items:center;} .scx-admin-bar select{padding:6px 10px;border-radius:8px;border:1px solid #CBD2E0;font:inherit;font-size:13px;}
.scx-scroll{overflow-x:auto;} .scx-admin-tbl th{font-size:12px;color:#5B6579;white-space:nowrap;border-top:0;} .scx-admin-tbl td{white-space:nowrap;}
.scx-admin-tbl .scx-n{text-align:center !important;} .scx-row{cursor:pointer;} .scx-row:hover td{background:rgba(240,192,138,.15);}
.scx-batch{font-family:'IBM Plex Mono',monospace;font-size:12px;} .scx-open > td{background:#F7F8FB;white-space:normal;padding:14px;}
@media(max-width:640px){ .scx-hero{flex-direction:column;text-align:center;padding-top:44px;} .scx-facts{justify-content:center;} .scx-grid{grid-template-columns:1fr;} }
@media print{ .topbar,.scx-print,.tfb-fab,footer{display:none !important;} .scx-hero,.scx-src{break-inside:avoid;} }`;
document.head.appendChild(css);
})();
