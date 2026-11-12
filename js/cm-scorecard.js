/* 🏅 The Scorecard, set up the way Foundational Training's is (its js/lsh-program.js): every grading system's graded
   items, each system's average, and the overall, the average of the systems that have a score, so each counts the same.
   Foundational's task trackers and monitoring sheets have no place here; these are this course's own grading systems:
     ✍️ Knowledge Checks      each Case Flow day's quiz (70% passes)
     🧩 Learning Checks       each module's composite (AI × 0.60 + trainer × 0.40), the automated half until the trainer scores it
     📝 Takeaways             each day's Knowledge Check answers, AI-graded
     🧪 Skill Activities      each graded Skill Activity on John Doe's file (the work log)
     🗂 CMS Case Checks       each document filed into the trainee's CMS case, checked for its category and file name (doc-filing)
     📊 Net Sheet Checks      each stage's Check my sheet on the LSH Net Sheet (net-sheet)
     🛠 Skill Builders        each practice tool's best score
     🎯 Graded Calls          the best graded call on each Call Simulator line (callsim:<id>, written by the Portal)
     🧰 Portal Simulators     the best result on each Training Portal simulator (simresults:<id>, written by the Portal)
     🎲 Random Tasks          each resolved random task's grade
   • Trainee: 🏅 My Performance (#/scorecard), their own grades in one table: each grading system's row and its items.
   • Trainer: 🏅 Scorecards (the same address), every approved trainee in one table by batch; a row opens the trainee's table.
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

const NS_STAGES = {recovery: "Track A · Settlement: the gross and the fee", bi: "Track A · BI settlement Net Sheet", um: "Track A · UM settlement Net Sheet",
  liens: "Track A · Lien negotiations", final: "Track A · Disbursement: the final Net Sheet", litigation: "Track B · Case won: the litigated Net Sheet"};
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
  {id: "cms", icon: "🗂", label: "CMS Case Checks", about: "Each document filed into your case in the CMS, checked automatically for the firm's category and file name: 100% first time right, then 100% ÷ the attempts it took.",
    items: c => Object.entries(c.data["doc-filing"] || {}).filter(([, r]) => r && r.attempts > 0).map(([id, r]) => {
      const d = typeof cmDoc === "function" ? cmDoc(id) : null;
      return {name: (d && (d.title || d.name)) || r.name || id, pct: r.filed ? Math.round(100 / r.attempts) : 0,
        note: r.filed ? `Filed as ${r.name || "named"}${r.category ? " under " + r.category : ""} · ${r.attempts === 1 ? "first time right" : r.attempts + " attempts"}` : `Not filed yet · ${r.attempts} attempt${r.attempts === 1 ? "" : "s"} refused`}; })},
  {id: "ns", icon: "📊", label: "Net Sheet Checks", about: "Each stage of the LSH Net Sheet, checked automatically with Check my sheet: the share of its checks that passed.",
    items: c => { const out = [], files = (c.data["net-sheet"] && c.data["net-sheet"].files) || {};
      Object.values(files).forEach(f => Object.entries((f && f.checks) || {}).forEach(([stage, k]) => {
        if(!k || !k.total) return;
        out.push({name: NS_STAGES[stage] || stage, pct: Math.round(100 * k.passed / k.total), note: `${k.passed} of ${k.total} checks · ${fmt(k.at)}`}); }));
      return out; }},
  {id: "sb", icon: "🛠", label: "Skill Builders", about: "Each practice tool's best score.",
    items: c => Object.entries(c.rec.practiceProgress || {}).filter(([, v]) => v && typeof v.bestScore === "number" && v.bestScore > 0).map(([id, v]) => {
      const t = (typeof PRACTICE_TOOLS !== "undefined" ? PRACTICE_TOOLS : []).find(x => x.id === id);
      return {name: t ? t.title : id, pct: num(v.bestScore), note: `${v.runs || 1} attempt${(v.runs || 1) === 1 ? "" : "s"}`}; })},
  {id: "gc", icon: "🎯", label: "Graded Calls", about: "The best graded call on each Call Simulator line (☎ LSH Ring Channel).",
    items: c => Object.entries((c.callsim && c.callsim.best) || {}).filter(([, b]) => b && typeof b.score === "number").map(([k, b]) => ({
      name: b.line || k.replace(/^line:/, ""), pct: num(b.score), note: `${b.calls || 1} call${(b.calls || 1) === 1 ? "" : "s"}`}))},
  {id: "cc", icon: "📞", label: "Case Calls", about: "Each graded call on John Doe's file (Live Calls and the calls the trainer rings in), its best score; an injected call that was missed counts 0.",
    items: c => { const best = {}, cf = c.data["case-flow"] || {};
      (c.data.roleplayHistory || []).filter(h => h && h.categoryId === "caseflow" && typeof h.score === "number").forEach(h => {
        const k = h.topicId || h.topicLabel; if(!best[k] || h.score > best[k].score) best[k] = {name: h.topicLabel || k, score: h.score, n: 0}; best[k].n++; });
      const out = Object.values(best).map(b => ({name: b.name, pct: num(b.score), note: `${b.n} call${b.n === 1 ? "" : "s"}`}));
      Object.values(cf.injects || {}).filter(x => x && x.outcome === "missed" && !best["cf-" + x.blockId])
        .forEach(x => out.push({name: `${x.who}: injected call`, pct: 0, note: `Missed · ${fmt(x.at)}`}));
      return out; }},
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

/* ---------- the sheets, in Foundational's Batch Sheet format (its js/ft-batch-sheet.js and js/ft-overall.js): Google
   Sheets' look — column letters, row numbers, the first column frozen, each cell's working in its hover — so a scorecard
   reads the same in every LSH course ---------- */
const letter = i => { let t = ""; i++; while(i > 0){ const m = (i - 1) % 26; t = String.fromCharCode(65 + m) + t; i = Math.floor((i - 1) / 26); } return t; };
const tone = p => p == null ? "" : p >= 85 ? "gs-hi" : p >= 70 ? "gs-mid" : "gs-lo";
const pcell = (p, f, extra) => ({v: pctTxt(p) === "—" ? "" : pctTxt(p), f, cls: "gs-num " + tone(p) + (extra ? " " + extra : "")});
function sheetHtml(T){
  const n = T.head.length;
  return `<section class="bs-sec" id="scx-${T.id}"><h3 class="bs-h">${E(T.title)} <span>${T.rows.length} row${T.rows.length === 1 ? "" : "s"}</span></h3>${T.note ? `<p class="bs-note">${E(T.note)}</p>` : ""}
    <div class="gs-wrap"><table class="gs" role="grid"><thead>
      <tr class="gs-letters"><th class="gs-corner"></th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${letter(i)}</th>`).join("")}</tr>
      <tr class="gs-head"><th class="gs-rn">1</th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${E(h)}</th>`).join("")}</tr></thead>
      <tbody>${T.rows.map((r, ri) => `<tr${T.rowCls && T.rowCls[ri] ? ` class="${T.rowCls[ri]}"` : ""}${T.onRow && T.onRow[ri] ? ` onclick="${T.onRow[ri]}"` : ""}><th class="gs-rn">${ri + 2}</th>${r.map((c, ci) => `<td tabindex="0" class="${c.cls || ""}${ci === 0 ? " gs-frz" : ""}"${c.f ? ` title="${E(c.f)}"` : ""}>${E(c.v)}</td>`).join("")}</tr>`).join("")}
      ${T.rows.length ? "" : `<tr class="gs-empty"><th class="gs-rn">2</th><td colspan="${n}" class="bs-none">${E(T.empty || "Nothing yet.")}</td></tr>`}</tbody></table></div></section>`;
}
// 🏅 Scores: a row per trainee, a column per grading system (blank: nothing graded yet), the Overall % and the rank
function scoresSheet(rows, me){
  const order = rows.filter(r => r.sc.overall != null).slice().sort((a, b) => b.sc.overall - a.sc.overall);
  order.forEach((r, i) => { r.rank = i && order[i - 1].sc.overall === r.sc.overall ? order[i - 1].rank : i + 1; });
  return {id: "scores", title: "🏅 Scores",
    note: me ? "Every grade the course gives you, averaged per grading system (blank: nothing graded yet), and your Overall %. Your grades in detail are under the table."
      : "Every grade, averaged per grading system (blank: nothing graded yet), then the Overall % (the average of the grading systems with a score), ranked. Click a trainee for their grades in detail under the table.",
    head: ["Trainee"].concat(me ? [] : ["Batch"], ["Days passed"], SOURCES.map(s => `${s.icon} ${s.label}`), ["Overall %"], me ? [] : ["Rank"]),
    rows: rows.map(r => [{v: r.name, f: r.name, cls: "gs-name"}].concat(me ? [] : [{v: batchOf(r.batch), f: r.batch, cls: "gs-batch"}],
      [{v: `${r.sc.done} / ${r.sc.total}`, f: `${r.sc.done} of the ${r.sc.total} Case Flow days passed (70% passes a day)`, cls: "gs-num"}],
      r.sc.rows.map(x => pcell(x.avg, x.avg == null ? `${x.s.label}: nothing graded yet` : `${x.s.label}: average of ${x.items.length} grade${x.items.length === 1 ? "" : "s"} = ${x.avg}%`)),
      [pcell(r.sc.overall, r.sc.overall == null ? "Nothing graded yet" : `Overall % = ${overallWhy(r.sc)}`, "gs-calc gs-bold")],
      me ? [] : [{v: r.rank == null ? "" : String(r.rank), f: r.rank == null ? "Not ranked: nothing graded yet" : `Rank ${r.rank} of ${order.length} by Overall %`, cls: "gs-rank"}])),
    rowCls: rows.map(r => !me && ALL.pick === r.id ? "gs-picked" : ""),
    onRow: me ? null : rows.map(r => `cmScorecard.pick('${E(r.id)}')`),
    empty: me ? "Collecting your grades…" : "No approved trainee in this batch yet."};
}
// 🔎 Grades in detail: every graded item, by grading system (the system's own row carries its average)
function detailSheet(sc, who){
  const rows = [], cls = [];
  sc.rows.forEach(r => {
    rows.push([{v: `${r.s.icon} ${r.s.label}`, f: r.s.about, cls: "gs-name"}, {v: r.s.about, f: r.s.about, cls: "gs-txt"}, {v: "", f: `${r.items.length} graded item${r.items.length === 1 ? "" : "s"}`}, pcell(r.avg, r.avg == null ? "Nothing graded yet" : `The average of ${r.items.length} = ${r.avg}%`, "gs-calc gs-bold")]); cls.push("gs-sys");
    r.items.forEach(x => { rows.push([{v: "", f: r.s.label}, {v: x.name, f: x.name, cls: "gs-txt"}, {v: x.note || "", f: x.note || "", cls: "gs-txt gs-det"}, pcell(x.pct, `${x.name}: ${pctTxt(x.pct)}${x.auto ? " (automated only)" : ""}`)]); cls.push(""); });
  });
  rows.push([{v: "Overall", f: overallWhy(sc), cls: "gs-name"}, {v: overallWhy(sc), f: overallWhy(sc), cls: "gs-txt"}, {v: `${sc.graded} graded item${sc.graded === 1 ? "" : "s"}`, f: `${sc.graded} graded items`, cls: "gs-det"}, pcell(sc.overall, overallWhy(sc), "gs-calc gs-bold")]); cls.push("gs-total");
  return {id: "detail", title: `🔎 Grades in detail${who ? ": " + who : ""}`, note: "Each grading system's row has its average; its graded items are under it.",
    head: ["Grading system", "Item", "Detail", "Score"], rows, rowCls: cls};
}
// the page's header, as Foundational's (ftBanner): a navy band, the kicker, the title, the batch, the sheet's buttons in it
function sheetTop(title, sub, controls, right){
  return `<div class="ft-banner scx-banner"><div><p class="ft-banner-k">Legal Support Help · Case Management Training</p><h2>🏅 ${E(title)}</h2>${sub ? `<p class="ft-banner-sub">${sub}</p>` : ""}</div>
    ${right ? `<div class="ft-banner-right">${right}</div>` : ""}<div class="ft-banner-ctl"><span class="gs-menu">${controls}</span></div></div>`;
}

/* ---------- 🏅 My Performance: the trainee's own row, then their grades in detail ---------- */
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
  if(state.docFiling && typeof state.docFiling === "object") c.data = Object.assign({}, c.data, {"doc-filing": state.docFiling});
  return c;
}
function renderMine(){
  loadMine(MINE.id !== state.traineeId);
  const loaded = MINE.id === state.traineeId, sc = compute(myCtx()), name = state.traineeName || "Me";
  const me = [{id: state.traineeId, name, batch: state.traineeBatch || "", sc}];
  return `<div class="scx-page scx-wide">${sheetTop("My Performance", `${E(name)}${state.traineeBatch ? ` · Batch <b>${E(batchOf(state.traineeBatch))}</b>` : ""}`, `<button onclick="window.print()">🖨 Print</button>`, loaded ? `<span>Overall ${pctTxt(sc.overall)}</span><span>${sc.done} / ${sc.total} days passed</span>` : "")}
    <div class="card gs-card scx-card">
    ${loaded ? sheetHtml(scoresSheet(me, true)) + sheetHtml(detailSheet(sc)) : `<p class="bs-none scx-pad">Collecting your grades…</p>`}
    <p class="sc-how">${HOW}</p></div></div>`;
}

/* ---------- 🏅 Scorecards: every approved trainee, for the trainer ---------- */
const ALL = {rows: null, loading: false, batch: "", pick: ""};
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
const shownRows = () => (ALL.rows || []).filter(r => !ALL.batch || batchOf(r.batch) === ALL.batch);
function renderAll(){
  if(!ALL.rows){ if(!ALL.loading) loadAll(); return `<div class="scx-page scx-wide"><div class="card gs-card scx-card"><p class="bs-none scx-pad">Collecting every trainee's grades…</p></div></div>`; }
  const batches = [...new Set(ALL.rows.map(r => batchOf(r.batch)).filter(Boolean))].sort();
  const rows = shownRows(), picked = rows.find(r => r.id === ALL.pick);
  return `<div class="scx-page scx-wide">${sheetTop("Scorecards", ALL.batch ? `Batch <b>${E(ALL.batch)}</b>` : "All batches", `<label class="scx-bpick">Batch <select onchange="cmScorecard.batch(this.value)"><option value="">All batches</option>${batches.map(b => `<option ${b === ALL.batch ? "selected" : ""}>${E(b)}</option>`).join("")}</select></label><button onclick="cmScorecard.csv()">⬇ Download</button><button onclick="window.print()">🖨 Print</button><button onclick="cmScorecard.refresh()">↻ Refresh</button>`, `<span>${rows.length} trainee${rows.length === 1 ? "" : "s"}</span>`)}
    <div class="card gs-card scx-card">
    ${sheetHtml(scoresSheet(rows, false))}
    ${picked ? sheetHtml(detailSheet(picked.sc, picked.name)) : rows.length ? `<p class="bs-note scx-pad">Click a trainee in 🏅 Scores for their grades in detail.</p>` : ""}
    <p class="sc-how">${HOW}</p></div></div>`;
}
function csv(){
  const rows = shownRows(), T = scoresSheet(rows, false);
  const q = v => { const t = String(v == null ? "" : v); return `"${(/^[=+\-@\t\r]/.test(t) ? "'" + t : t).replace(/"/g, '""')}"`; };
  const lines = [T.head.map(q).join(",")].concat(T.rows.map(r => r.map(c => q(c.v)).join(",")));
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], {type: "text/csv"}));
  a.download = `Scorecards${ALL.batch ? " - " + ALL.batch : ""}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- the page, its address and its top-bar button ---------- */
window.renderScorecardPage = () => isAdmin() ? renderAll() : isTrainee() ? renderMine() : (typeof renderDashboard === "function" ? renderDashboard() : "");
window.addEventListener("focus", () => { if(isTrainee() && state.view === "scorecard") loadMine(); });
window.cmScorecard = {
  batch(b){ ALL.batch = b || ""; ALL.pick = ""; render(); },
  refresh(){ ALL.rows = null; state.adminData = null; render(); },
  pick(id){ ALL.pick = ALL.pick === id ? "" : id; render(); setTimeout(() => { const d = document.getElementById("scx-detail"); if(d && ALL.pick) d.scrollIntoView({behavior: "smooth", block: "start"}); }, 30); },
  csv, compute, sources: SOURCES
};

const css = document.createElement("style"); css.id = "cm-scorecard";
css.textContent = `
/* Foundational Training's Batch Sheet, the standard for scorecards (its js/ft-overall.js and js/ft-batch-sheet.js): the navy
   banner, Google Sheets' grid, and its contrast — bold dark text, bigger type, visible gridlines, tinted scores */
.scx-page{max-width:none;margin:0 auto;padding:4px 0 24px;}
.ft-banner{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;padding:16px 18px;border-radius:12px;background:linear-gradient(135deg,#1E2340,#33406B);color:#fff;margin:0 0 12px;}
.ft-banner h2{margin:2px 0 !important;font:800 26px 'Fraunces',Georgia,serif !important;color:#fff !important;}
.ft-banner .ft-banner-k{margin:0 !important;font:800 12px Arial,sans-serif !important;letter-spacing:.08em;text-transform:uppercase;color:#F6C08F !important;}
.ft-banner .ft-banner-sub{margin:2px 0 0 !important;color:#E8ECF7 !important;font:600 15px Arial,sans-serif !important;} .ft-banner .ft-banner-sub b{color:#fff !important;}
.ft-banner-right{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.ft-banner-right span{font:800 13px Arial,sans-serif;padding:4px 11px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);color:#fff;}
.ft-banner-ctl{flex-basis:100%;margin-top:6px;}
.scx-banner .gs-menu{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.scx-banner .gs-menu button{border:2px solid #fff;background:#fff;color:#1E2340;font:800 13px Arial,sans-serif;padding:5px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;box-shadow:0 1px 0 rgba(0,0,0,.06);}
.scx-banner .gs-menu button:hover{background:#EEF1F8;}
.scx-bpick{display:inline-flex;align-items:center;gap:6px;font:800 15px Arial,sans-serif;color:#fff;margin-right:6px;}
.scx-bpick select{font:800 15px Arial,sans-serif;padding:5px 9px;border:2px solid #fff;border-radius:7px;background:#E8EDFB;color:#1E2340;}
.gs-card.scx-card{padding:0;overflow:hidden;font-family:Arial,'Roboto',sans-serif;background:#fff;border:1px solid #E1E3E1;border-radius:12px;}
.scx-card .bs-sec{padding:14px 14px 6px;border-top:1px solid #E1E3E1;} .scx-card .bs-sec:first-child{border-top:0;}
.scx-card .bs-h{margin:0 0 2px;font:800 21px Arial,sans-serif;color:#141A2E;} .scx-card .bs-h span{font:400 13px Arial,sans-serif;color:#5F6368;margin-left:6px;}
.scx-card .bs-note{margin:0 0 8px;font:600 14.5px Arial,sans-serif;color:#2E3450;} .scx-pad{padding:14px;} .bs-none{color:#5F6368;font-style:italic;}
.scx-card .gs-wrap{overflow:auto;max-height:70vh;background:#fff;border:1px solid #9AA3B5;border-radius:4px;}
.scx-card .gs{border-collapse:separate;border-spacing:0;font:16px Arial,sans-serif;color:#141A2E;}
.scx-card .gs th,.scx-card .gs td{border-right:1px solid #AEB6C6;border-bottom:1px solid #AEB6C6;padding:7px 11px;white-space:nowrap;height:30px;}
.scx-card .gs thead{position:sticky;top:0;z-index:3;}
.scx-card .gs-letters th{background:#F8F9FA;color:#5F6368;font-weight:400;font-size:12px;text-align:center;min-width:90px;height:22px;padding:2px 8px;}
.scx-card .gs-head th{background:#F8F9FA;font:800 15.5px Arial,sans-serif;color:#141A2E;text-align:center;white-space:normal;min-width:110px;max-width:220px;line-height:1.25;}
.scx-card .gs-corner,.scx-card .gs-rn{position:sticky;left:0;z-index:4;background:#F8F9FA !important;color:#5F6368;font-weight:400 !important;font-size:12px;text-align:center;width:40px;min-width:40px !important;}
.scx-card thead .gs-corner,.scx-card thead .gs-rn{z-index:5;}
.scx-card .gs .gs-frz{position:sticky;left:41px;z-index:2;background:#fff;box-shadow:2px 0 0 #9AA3B5;}
.scx-card .gs-letters .gs-frz,.scx-card .gs-head .gs-frz{z-index:4;background:#F8F9FA;}
.scx-card .gs td{font-weight:700;color:#141A2E;} .scx-card .gs td.gs-name{font-weight:800;min-width:200px;}
.scx-card td.gs-batch{font:700 13px 'IBM Plex Mono',monospace;color:#2E3450;}
.scx-card .gs-num{text-align:right;} .scx-card .gs-rank{text-align:center;font-weight:800;color:#B5651F;}
.scx-card .gs-calc{background:#F1F3F4;} .scx-card .gs-bold{font-weight:800;}
.scx-card td.gs-hi{color:#0B5D1E;background:#E6F4EA;} .scx-card td.gs-mid{color:#7A4B00;background:#FFF4E0;} .scx-card td.gs-lo{color:#A50E0E;background:#FDE8E8;}
.scx-card .gs-txt{white-space:normal !important;min-width:260px;max-width:520px;} .scx-card td.gs-det{color:#3C4043;font-weight:600;}
.scx-card .gs td{cursor:cell;outline:none;} .scx-card .gs td:focus{box-shadow:inset 0 0 0 2px #1A73E8;}
.scx-card tr[onclick] td{cursor:pointer;} .scx-card tr[onclick]:hover td:not(.gs-hi):not(.gs-mid):not(.gs-lo){background:#F1F6FE;}
.scx-card tr.gs-picked td.gs-name{background:#E8F0FE;box-shadow:inset 4px 0 0 #1A73E8,2px 0 0 #9AA3B5;}
/* (a grading system's row: a band across the table, its items indented under it; the overall a navy band, as Foundational's) */
.scx-card tr.gs-sys td{background:#E8ECF6;color:#1E2340;font-weight:800;border-top:2px solid #AEB6C6;} .scx-card tr.gs-sys td.gs-hi,.scx-card tr.gs-sys td.gs-mid,.scx-card tr.gs-sys td.gs-lo{border-top:2px solid #AEB6C6;}
.scx-card tr:not(.gs-sys):not(.gs-total) td.gs-frz{background:#F8FAFD;}
.scx-card tr.gs-sys td.gs-hi{color:#0B5D1E;background:#CFEBD8;} .scx-card tr.gs-sys td.gs-mid{color:#7A4B00;background:#FFE7BF;} .scx-card tr.gs-sys td.gs-lo{color:#A50E0E;background:#F9D0D0;}
.scx-card tr.gs-total td{background:#1E2340 !important;color:#fff !important;font-weight:800;} .scx-card tr.gs-total td:last-child{color:#FDE68A !important;}
.scx-card .sc-how{margin:10px 14px 14px;font:600 13.5px Arial,sans-serif;color:#2E3450;}
@media(max-width:640px){ .ft-banner h2{font-size:22px !important;} }
@media print{ .topbar,.tfb-fab,footer,.ft-banner-ctl{display:none !important;} .scx-card .gs-wrap{max-height:none;overflow:visible;} .ft-banner{-webkit-print-color-adjust:exact;print-color-adjust:exact;} }
`;
document.head.appendChild(css);
})();
