/* ============================================================
   📋 BATCH SHEET: one Google-Sheets-style page per batch, as in Foundational Training (its js/ft-batch-sheet.js)
   ------------------------------------------------------------
   Admin → 🛡 Admin Master Control → 📋 Batch Sheet (the tab the Admin screen opens on). Pick a batch (or All batches)
   and every trainee who registered in it is on one page, in tables one under the other:
     👥 Trainees        status, registered, last on the platform, slides seen, Knowledge Checks passed, where they are now,
                        and the trainer's feedback (sent, to write)
     📚 Lessons         a column per Case Flow day: the deck (✓ finished, or how far in) and the Knowledge Check score
     🏅 Scores          a column per grading system (the Scorecard's own, js/cm-scorecard.js compute), the Overall % and the
                        rank; click a trainee for 🔎 Grades in detail under it
     🛠 Skill Builders   the tools practiced in, the runs, then each tool's runs · best score
     🕒 Recent progress everything they did, newest first
   Under the tables, 👥 Trainees & Batches (index.html renderTraineesAndBatches): approvals, each trainee's actions
   (View Detail, ✍ Feedback, 🎓 Certificate, ↺ Reset Attempts, Revoke), archive and the folded settings.
   It replaces what said the same thing twice: the Trainee Audit's stat tiles and each row's days / average / runs /
   last-active readouts, the Rankings tab, the batch folders' Registry / Rankings / Feedback / Activities sub-tabs, the
   trainer's 🏅 Scorecards page and ⬇ Download Cohort Report (the sheet's ⬇ Download).
   It only reads: trainee:<id> (state.adminData), progress / feedback / focus:<id> (index.html loadAuditExtras, the
   same cache the rows use) and callsim / simresults:<id> for the Scores.
   ============================================================ */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const num = v => typeof v === "number" && isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : null;
const pct = p => p == null ? "" : p + "%";
const tone = p => p == null ? "" : p >= 85 ? "gs-hi" : p >= 70 ? "gs-mid" : "gs-lo";
const T0 = v => { const d = v ? new Date(v) : null; return d && isFinite(d) ? d : null; };
const DF = new Intl.DateTimeFormat(undefined, {month: "short", day: "numeric", year: "numeric"});
const DTF = new Intl.DateTimeFormat(undefined, {month: "short", day: "numeric", hour: "numeric", minute: "2-digit"});
const dOnly = v => { const d = T0(v); return d ? DF.format(d) : ""; };
const dTime = v => { const d = T0(v); return d ? DTF.format(d) : ""; };
const ago = v => { const d = T0(v); if(!d) return ""; const m = Math.round((Date.now() - d) / 60000);
  return m < 2 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} day${Math.round(m / 1440) === 1 ? "" : "s"} ago`; };
const letter = i => { let s = ""; i++; while(i > 0){ const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
const days = () => (typeof DAYS !== "undefined" ? DAYS : []);
const dayLabel = d => d.cf ? `Day ${d.cf.n}` : `Day ${d.id}`;
const tools = () => (typeof PRACTICE_TOOLS !== "undefined" ? PRACTICE_TOOLS : []);
const keyOf = r => typeof batchKey === "function" ? batchKey(r) : (r.batch || "");
const labelOf = k => typeof folderLabel === "function" ? folderLabel(k) : k;

const B = {extra: {}, loading: false, pick: "", recent: 14};

/* ---------- who is on the sheet: the picked batch (state.adminBatchFilter, "" = all), not archived, not rejected ---------- */
function people(){
  const k = state.adminBatchFilter || "";
  return (state.adminData || []).filter(r => r && !r.rejected && (state.adminShowArchived || !r.archived) && (!k || keyOf(r) === k))
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}
const statusOf = r => r.archived ? "Archived" : r.approved === true ? "Approved" : "Waiting for approval";
const nameOf = r => (typeof cleanName === "function" ? cleanName(r.name) : "") || String(r.name || "Unnamed").slice(0, 60);
const extraOf = r => (state.auditExtra || {})[r.id];
const dataOf = r => (extraOf(r) || {}).data || {};

/* ---------- loading: the rows' cache (progress, feedback, focus) and, for the Scores, callsim / simresults ---------- */
async function loadScores(ppl){
  const due = ppl.filter(r => !B.extra[r.id] || Date.now() - B.extra[r.id].at > 60000);
  if(!due.length || B.loading) return;
  B.loading = true;
  try{
    const got = await sharedGetMany(due.flatMap(r => ["callsim:" + r.id, "simresults:" + r.id]));
    due.forEach((r, i) => { B.extra[r.id] = {at: Date.now(), callsim: got[i * 2], sim: got[i * 2 + 1]}; });
  }catch(e){ due.forEach(r => { B.extra[r.id] = {at: Date.now()}; }); }
  B.loading = false;
  repaint();
}
function repaint(){
  if(state.view !== "admin" || !isSheetTab() || (typeof isTyping === "function" && isTyping())) return;
  const el = document.getElementById("bsSheet"); if(el) el.innerHTML = tablesHtml();
}
const isSheetTab = () => ["batchsheet", "audit", "rankings"].includes(state.adminTab || "batchsheet");
function ready(ppl){
  const missingRows = ppl.some(r => !extraOf(r));
  // (once at a time, and not again within 5 s: a failed read doesn't loop)
  if(missingRows && typeof loadAuditExtras === "function" && !B.rowsP && Date.now() - (B.rowsAt || 0) > 5000){
    B.rowsAt = Date.now();
    B.rowsP = (async () => { while(state.auditExtraLoading) await new Promise(f => setTimeout(f, 300)); await loadAuditExtras(); })()
      .catch(() => {}).then(() => { B.rowsP = null; repaint(); });
  }
  loadScores(ppl);
  return !missingRows && ppl.every(r => B.extra[r.id]);
}
function scoreOf(r){
  const x = B.extra[r.id] || {};
  const c = {rec: r, cf: r.caseFlow || {days: {}}, data: dataOf(r), callsim: x.callsim, sim: x.sim};
  try{ return window.cmScorecard.compute(c); }catch(e){ return null; }
}
const summaryOf = r => { try{ return typeof auditSummary === "function" ? auditSummary(r) : null; }catch(e){ return null; } };

/* ---------- the tables: {id, title, note, head, rows: [[{v, f, cls}]], onRow, rowCls} ---------- */
function traineesTable(ppl){
  return {id: "trainees", title: "👥 Trainees", note: "Everyone registered in the batch, from the moment they register: their status, when they were last on, how far they are and the feedback you have sent.",
    head: ["Trainee", "Batch", "Status", "Registered", "Last on the platform", "Slides seen", "Knowledge Checks passed", "Now", "💬 Feedback"],
    rows: ppl.map(r => {
      const a = summaryOf(r) || {days: [], seen: 0, total: 0, pct: 0, kcPassed: 0, where: "", sent: 0, read: 0, drafts: 0, toWrite: []};
      const last = [r.lastActive, (extraOf(r) || {}).savedAt].map(T0).filter(Boolean).sort((x, y) => y - x)[0];
      const st = statusOf(r), n = days().length;
      const fb = `${a.sent} sent${a.drafts ? ` · ${a.drafts} draft` : ""}${a.toWrite.length ? ` · to write: ${a.toWrite.map(id => { const d = days().find(z => z.id === id); return d ? dayLabel(d) : "Day " + id; }).join(", ")}` : ""}`;
      return [
        {v: nameOf(r), f: `${nameOf(r)} · ${r.id}`, cls: "gs-name"},
        {v: labelOf(keyOf(r)), f: r.batch || "No batch", cls: "gs-batch"},
        {v: st, f: st, cls: st === "Approved" ? "gs-hi" : st === "Archived" ? "" : "gs-mid"},
        {v: dOnly(r.registeredAt), f: r.registeredAt ? new Date(r.registeredAt).toLocaleString() : "", cls: ""},
        {v: last ? dOnly(last) : "Not yet", f: last ? `${last.toLocaleString()} (${ago(last)})` : "Hasn't been on the platform since registering", cls: last && Date.now() - last < 2 * 864e5 ? "" : "gs-lo"},
        {v: a.total ? `${a.seen} / ${a.total} · ${a.pct}%` : "", f: `${a.seen} of ${a.total} slides seen`, cls: "gs-num " + tone(a.total ? a.pct : null)},
        {v: `${a.kcPassed} / ${n}`, f: `${a.kcPassed} of the ${n} Knowledge Checks passed (70% passes)`, cls: "gs-num"},
        {v: a.where || "", f: a.where || "", cls: "gs-txt"},
        {v: fb, f: `${a.sent} sent (${a.read} read)${a.drafts ? `, ${a.drafts} draft` : ""}${a.toWrite.length ? "; days with work but no feedback yet" : ""}`, cls: "gs-txt " + (a.toWrite.length ? "gs-mid" : "")}];
    })};
}
function lessonsTable(ppl){
  const L = days();
  return {id: "lessons", title: "📚 Lessons", note: "One column per day: the slides (✓ finished, or how far in) and the Knowledge Check score (70% passes). Blank: not opened yet.",
    head: ["Trainee"].concat(L.map(d => `${dayLabel(d)}. ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`)),
    rows: ppl.map(r => { const a = summaryOf(r) || {days: []};
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}].concat(L.map(d => {
        const x = a.days.find(z => z.id === d.id) || {n: 0, reached: 0, score: null};
        const fin = x.n && x.reached >= x.n, deck = fin ? "Slides ✓" : x.reached ? `Slides ${x.reached}/${x.n}` : "";
        const check = x.score == null ? "" : `Check ${x.score}%`;
        return {v: [deck, check].filter(Boolean).join(" · "), f: `${dayLabel(d)}: ${x.reached} of ${x.n} slides${x.score == null ? " · Knowledge Check not taken" : ` · Knowledge Check ${x.score}% ${x.score >= 70 ? "(passed)" : "(below 70%)"}`}${x.labDone ? " · Skill Builder done" : ""}`,
          cls: "bs-lesson " + (x.score != null ? tone(x.score) : fin ? "gs-hi" : x.reached ? "gs-mid" : "")};
      })); })};
}
function scoresTable(ppl){
  const S = (window.cmScorecard && cmScorecard.sources) || [];
  const rows = ppl.filter(r => r.approved === true).map(r => ({r, sc: scoreOf(r)})).filter(x => x.sc);
  const order = rows.filter(x => x.sc.overall != null).slice().sort((a, b) => b.sc.overall - a.sc.overall);
  order.forEach((x, i) => { x.rank = i && order[i - 1].sc.overall === x.sc.overall ? order[i - 1].rank : i + 1; });
  return {id: "scores", rowsRaw: rows, title: "🏅 Scores", note: "Every grade, averaged per grading system (blank: nothing graded yet), then the Overall % (the average of the systems with a score, so each counts the same), ranked. Click a trainee for their grades in detail.",
    head: ["Trainee", "Days passed"].concat(S.map(s => `${s.icon} ${s.label}`), ["Overall %", "Rank"]),
    rows: rows.map(x => [{v: nameOf(x.r), f: nameOf(x.r), cls: "gs-name"}, {v: `${x.sc.done} / ${x.sc.total}`, f: `${x.sc.done} of the ${x.sc.total} days passed`, cls: "gs-num"}]
      .concat(x.sc.rows.map(y => ({v: pct(y.avg), f: y.avg == null ? `${y.s.label}: nothing graded yet` : `${y.s.label}: average of ${y.items.length} = ${y.avg}%`, cls: "gs-num " + tone(y.avg)})),
        [{v: pct(x.sc.overall), f: x.sc.overall == null ? "Nothing graded yet" : `The average of ${x.sc.systems} grading systems = ${x.sc.overall}%`, cls: "gs-num gs-calc gs-bold " + tone(x.sc.overall)},
         {v: x.rank == null ? "" : String(x.rank), f: x.rank == null ? "Not ranked: nothing graded yet" : `Rank ${x.rank} of ${order.length}`, cls: "gs-rank"}])),
    onRow: rows.map(x => `cmBatchSheet.pick('${E(x.r.id)}')`), rowCls: rows.map(x => B.pick === x.r.id ? "gs-picked" : ""),
    empty: "No approved trainee here yet."};
}
function detailTable(x){
  const sc = x.sc, rows = [], cls = [];
  sc.rows.forEach(r => {
    rows.push([{v: `${r.s.icon} ${r.s.label}`, f: r.s.about, cls: "gs-name"}, {v: r.s.about, f: r.s.about, cls: "gs-txt"}, {v: "", f: ""}, {v: pct(r.avg), f: r.avg == null ? "Nothing graded yet" : `Average of ${r.items.length}`, cls: "gs-num gs-calc gs-bold " + tone(r.avg)}]); cls.push("gs-sys");
    r.items.forEach(i => { rows.push([{v: "", f: r.s.label}, {v: i.name, f: i.name, cls: "gs-txt"}, {v: i.note || "", f: i.note || "", cls: "gs-txt gs-det"}, {v: pct(i.pct), f: `${i.name}: ${pct(i.pct)}`, cls: "gs-num " + tone(i.pct)}]); cls.push(""); });
  });
  rows.push([{v: "Overall", f: "", cls: "gs-name"}, {v: sc.overall == null ? "Nothing graded yet" : `The average of ${sc.systems} grading systems`, f: "", cls: "gs-txt"}, {v: `${sc.graded} graded items`, f: ""}, {v: pct(sc.overall), f: "", cls: "gs-num gs-bold"}]); cls.push("gs-total");
  return {id: "detail", title: `🔎 Grades in detail: ${nameOf(x.r)}`, note: "Each grading system's row has its average; its graded items are under it.", head: ["Grading system", "Item", "Detail", "Score"], rows, rowCls: cls};
}
function practiceTable(ppl){
  const TL = tools();
  return {id: "practice", title: "🛠 Skill Builders", note: `How much each trainee practices: the tools used (of ${TL.length}), every run, then each tool (runs · best score). Blank: not used yet.`,
    head: ["Trainee", "Tools used", "Runs"].concat(TL.map(t => t.title)),
    rows: ppl.map(r => {
      const pp = dataOf(r)["practice-progress"] || r.practiceProgress || {};
      const cells = TL.map(t => { const v = pp[t.id] || {}, n = v.runs || 0, b = typeof v.bestScore === "number" ? num(v.bestScore) : null;
        return {n, b, v: n ? `${n}${b != null ? " · " + b + "%" : ""}` : "", f: n ? `${t.title}: ${n} run${n === 1 ? "" : "s"}${b != null ? `, best ${b}%` : ""}` : `${t.title}: not used yet`}; });
      const used = cells.filter(c => c.n).length, runs = cells.reduce((s, c) => s + c.n, 0);
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: `${used} / ${TL.length}`, f: `${used} of ${TL.length} tools used`, cls: "gs-num " + (used ? "" : "gs-lo")}, {v: runs || "", f: `${runs} runs`, cls: "gs-num gs-bold"}]
        .concat(cells.map(c => ({v: c.v, f: c.f, cls: "bs-lesson " + tone(c.b)})));
    })};
}
function recentTable(ppl){
  const out = [], since = B.recent ? Date.now() - B.recent * 864e5 : 0;
  const push = (r, at, what, detail, score) => { const d = T0(at); if(d && (!since || +d >= since)) out.push({r, at: d, what, detail: detail || "", score: num(score)}); };
  ppl.forEach(r => {
    push(r, r.registeredAt, "Registered", labelOf(keyOf(r)));
    const data = dataOf(r), dp = data["day-progress"] || r.dayProgress || {};
    days().forEach(d => { const p = dp[d.id]; if(p && typeof p.score === "number") push(r, p.date || p.at, "Knowledge Check", dayLabel(d), p.score); });
    (data["work-log"] || []).forEach(w => { if(!w || w.kind === "quiz") return;
      push(r, w.at, w.kind === "lab" ? "Skill Activity" : w.kind === "roleplay" ? "Call practice" : w.kind === "task" ? "Random task" : "Practice", w.label, typeof w.score === "number" ? w.score : null); });
    (data["task-log"] || []).forEach(t => { if(t && t.status === "resolved") push(r, t.resolvedAt, "Random task resolved", (t.task && (t.task.title || t.task.name)) || "", t.score); else if(t && t.status === "missed") push(r, t.expiresAt, "Random task missed", (t.task && (t.task.title || t.task.name)) || "", 0); });
    const lv = data["last-view"]; if(lv && lv.at) push(r, lv.at, "Opened", lv.view === "day" ? `Day ${lv.dayId}` : lv.view === "tool" ? `Skill Builder ${lv.toolId || ""}` : String(lv.view || ""));
  });
  out.sort((a, b) => b.at - a.at);
  return {id: "recent", title: "🕒 Recent progress", note: `Everything they did${B.recent ? ` in the last ${B.recent} days` : ""}, newest first.`,
    head: ["When", "Trainee", "What", "Detail", "Score"],
    rows: out.slice(0, 300).map(x => [{v: dTime(x.at), f: x.at.toLocaleString(), cls: ""}, {v: nameOf(x.r), f: nameOf(x.r), cls: "gs-name"}, {v: x.what, f: x.what}, {v: x.detail, f: x.detail, cls: "gs-txt"}, {v: pct(x.score), f: pct(x.score), cls: "gs-num " + tone(x.score)}]),
    empty: "Nothing in this period."};
}

/* ---------- drawing: Google Sheets' look, the same classes the Scorecard uses (js/cm-scorecard.js .scx-card) ---------- */
function sheetHtml(T){
  const n = T.head.length;
  return `<section class="bs-sec" id="bs-${T.id}"><h3 class="bs-h">${E(T.title)} <span>${T.rows.length} row${T.rows.length === 1 ? "" : "s"}</span></h3>${T.note ? `<p class="bs-note">${E(T.note)}</p>` : ""}
    <div class="gs-wrap"><table class="gs" role="grid"><thead>
      <tr class="gs-letters"><th class="gs-corner"></th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${letter(i)}</th>`).join("")}</tr>
      <tr class="gs-head"><th class="gs-rn">1</th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${E(h)}</th>`).join("")}</tr></thead>
      <tbody>${T.rows.map((r, ri) => `<tr${T.rowCls && T.rowCls[ri] ? ` class="${T.rowCls[ri]}"` : ""}${T.onRow && T.onRow[ri] ? ` onclick="${T.onRow[ri]}"` : ""}><th class="gs-rn">${ri + 2}</th>${r.map((c, ci) => `<td tabindex="0" class="${c.cls || ""}${ci === 0 ? " gs-frz" : ""}"${c.f ? ` title="${E(c.f)}"` : ""}>${E(c.v)}</td>`).join("")}</tr>`).join("")}
      ${T.rows.length ? "" : `<tr class="gs-empty"><th class="gs-rn">2</th><td colspan="${n}" class="bs-none">${E(T.empty || "No trainee here yet.")}</td></tr>`}</tbody></table></div></section>`;
}
let LAST = [];
function tables(){
  const ppl = people();
  if(!ready(ppl)) return null;
  const sc = scoresTable(ppl), picked = sc.rowsRaw.find(x => x.r.id === B.pick);
  LAST = [traineesTable(ppl), lessonsTable(ppl), sc].concat(picked ? [detailTable(picked)] : [], [practiceTable(ppl), recentTable(ppl)]);
  return LAST;
}
function tablesHtml(){
  const T = tables();
  return T ? T.map(sheetHtml).join("") : `<p class="bs-none scx-pad">Reading the batch's progress…</p>`;
}
function bannerHtml(){
  const keys = Array.from(new Set((state.adminData || []).filter(r => !r.rejected).map(keyOf))).sort((a, b) => typeof NO_BATCH !== "undefined" && a === NO_BATCH ? 1 : typeof NO_BATCH !== "undefined" && b === NO_BATCH ? -1 : a.localeCompare(b, undefined, {numeric: true}));
  const cur = state.adminBatchFilter || "", ppl = people();
  const waiting = (state.adminData || []).filter(r => r.approved !== true && !r.rejected && (!cur || keyOf(r) === cur)).length;
  return `<div class="ft-banner scx-banner"><div><p class="ft-banner-k">Legal Support Help · Case Management Training</p><h2>📋 Batch Sheet</h2>
      <p class="ft-banner-sub">${cur ? `Batch <b>${E(labelOf(cur))}</b>` : "All batches"} · refreshed automatically</p></div>
    <div class="ft-banner-right"><span>${ppl.length} trainee${ppl.length === 1 ? "" : "s"}</span>${waiting ? `<span class="bs-wait-pill">${waiting} waiting for approval</span>` : ""}</div>
    <div class="ft-banner-ctl"><span class="gs-menu"><label class="scx-bpick">Batch <select onchange="cmBatchSheet.batch(this.value)"><option value="">All batches</option>${keys.map(k => `<option value="${E(k)}" ${k === cur ? "selected" : ""}>${E(labelOf(k))}</option>`).join("")}</select></label>
      <button onclick="cmBatchSheet.csv()">⬇ Download</button><button onclick="cmBatchSheet.refresh()">↻ Refresh</button></span></div></div>`;
}
window.renderAdminBatchSheet = function(){
  if(state.adminLoading || !state.adminData) return `<div class="card" style="padding:40px;text-align:center;color:var(--ink-soft);">Loading the batches…</div>`;
  return `<div class="scx-page bs-page">${bannerHtml()}<div class="card gs-card scx-card" id="bsSheet">${tablesHtml()}</div></div>`;
};
function csv(){
  const q = v => { const s = String(v == null ? "" : v); return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; };
  const T = LAST.length ? LAST : (tables() || []);
  const lines = []; T.forEach(t => { lines.push(q(t.title)); lines.push(t.head.map(q).join(",")); t.rows.forEach(r => lines.push(r.map(c => q(c.v)).join(","))); lines.push(""); });
  const k = state.adminBatchFilter ? labelOf(state.adminBatchFilter) : "All batches";
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], {type: "text/csv"}));
  a.download = `Batch Sheet - ${k}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
window.cmBatchSheet = {
  batch(v){ B.pick = ""; if(typeof setAdminBatchFilter === "function") setAdminBatchFilter(v); else { state.adminBatchFilter = v; render(); } },
  pick(id){ B.pick = B.pick === id ? "" : id; repaint(); setTimeout(() => { const d = document.getElementById("bs-detail"); if(d && B.pick) d.scrollIntoView({behavior: "smooth", block: "start"}); }, 30); },
  refresh(){ B.extra = {}; if(state.auditExtra) Object.keys(state.auditExtra).forEach(k => delete state.auditExtra[k]); if(typeof refreshAdminData === "function") refreshAdminData(); else render(); },
  csv
};

// the trainer's 🏅 Scorecards page is the sheet's 🏅 Scores now: an old link opens the Batch Sheet
const __sc = window.renderScorecardPage;
if(typeof __sc === "function") window.renderScorecardPage = function(){
  if(state.isAdmin && !state.adminPreview){ setTimeout(() => { state.adminTab = "batchsheet"; goto("admin"); }, 0); return `<div class="card" style="padding:40px;text-align:center;">Opening the Batch Sheet…</div>`; }
  return __sc.apply(this, arguments);
};

const css = document.createElement("style"); css.id = "cm-batch-sheet";
css.textContent = `
.bs-page{margin-bottom:22px;}
.bs-page .ft-banner{margin-bottom:12px;}
.bs-page .bs-wait-pill{background:#F6C08F !important;color:#1E2340 !important;border-color:#F6C08F !important;}
.bs-page .gs-wrap{max-height:62vh;}
.scx-card td.bs-lesson{font-size:14px;}
.bs-people{margin-top:8px;padding-top:6px;border-top:2px solid #E3E6EF;scroll-margin-top:80px;}
.bs-people > h2{margin:14px 0 4px;color:var(--navy);font-size:22px;}
.bs-people > .bs-people-sub{margin:0 0 14px;color:#2E3450;font-size:13.5px;}
`;
document.head.appendChild(css);
})();
