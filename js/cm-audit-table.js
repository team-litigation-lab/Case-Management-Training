/* ============================================================
   🛡 TRAINEE AUDIT AS ONE TABLE (Admin → Trainee Audit)
   One row per trainee, one column per thing a trainer scans, and every per-trainee action in one place.
   • Top: the page title with the cohort's numbers as chips (in place of the four stat tiles), ⬇ CSV of the table,
     ⬇ Cohort PDF, and ⋯ (↻ Refresh now, Log out). The settings that aren't audit content (🎓 certificate
     signatories, 💬 feedback auto-draft, 🎲 Random Task Injection) fold into one ⚙ section, kept as they were.
   • One filter bar: 🔎 name / ID search, Batch (the same state.adminBatchFilter Rankings uses; 📦 Archive batch and
     ↩ Restore batch sit beside it), Status (Current / Active / ⏳ Pending / Rejected / Archived / All; in place of
     "Show archived"), Day (where they are), and "Needs attention" chips with counts.
     It replaces the Pending Approvals panel (pending rows are pinned on top with Approve / Reject in their Status
     cell), the batch folder cards, the old filter bar and the batch sub-tabs (🏆 Rankings and 💬 Feedback are
     links from the batch picker; 📈 Activities is the table's own columns).
   • Columns sort when their header is clicked (state.adminSort, the old values still work).
   • Each row: 👁 Detail (the same panel as before, as a full-width row under it) and ⋯, one menu with
     Open (detail, ✍ feedback, 🎓 certificate, 🏅 scorecard), Assign (📁 companion case: renderUnlockDaysControl, so
     js/cm-companion.js's picker and anything else wrapped there; roleplay and corrected copies in the detail),
     Access (approve / reject, ↺ reset Skill Builder attempts, 📂 check Drive, 📦 archive / ↩ restore the trainee)
     and, set apart, 🗑 Revoke & delete.
   renderAdminRows and #adminRowsWrap keep their names: every script that redraws the rows still does.
   ============================================================ */
(function(){
"use strict";
if(typeof renderAdminRows !== "function" || typeof window.renderAdmin !== "function") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const J = s => E(String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'"));   // a string inside onclick="f('…')"
const cfDays = () => DAYS.filter(d => d.cf);
const cfN = id => { const d = DAYS.find(x => String(x.id) === String(id)); return d && d.cf ? d.cf.n : id; };
// the page names Case Flow days as on screen (as js/cm-case-flow.js's relabel does), on a partial redraw too
const relabel = html => cfDays().reduce((h, d) => h.replace(new RegExp(`\\bDay ${d.id}\\b`, "g"), `Case Flow Day ${d.cf.n}`).replace(new RegExp(`\\bDAY ${d.id}\\b`, "g"), `CASE FLOW DAY ${d.cf.n}`), String(html));
const byId = id => (state.adminData || []).find(r => r.id === id) || null;
const nameOf = r => String((r && r.name) || "Unnamed");

/* ---------- each trainee's row data ---------- */
function statusOf(r){
  if(r.archived) return "archived";
  if(r.rejected) return "rejected";
  if(r.approved !== true) return "pending";
  return "active";
}
const STATUS = {active: ["Active", "ok"], pending: ["⏳ Pending", "pend"], rejected: ["Rejected", "bad"], archived: ["Archived", "arch"]};
const asked = r => !!(r.labResetRequestedAt && (!r.labAttemptsResetAt || r.labResetRequestedAt > r.labAttemptsResetAt));
function driveState(r){
  const rep = (state.driveReports || {})[r.id];
  if(!rep) return {k: "", label: r.driveLink ? "🔗 folder link sent" : "—", issue: false};
  if(rep.checking) return {k: "chk", label: "Checking…", issue: false};
  if(!rep.connected) return {k: "off", label: "Not connected", issue: true};
  if(!rep.builtAt) return {k: "on", label: "Connected", issue: false};
  if((rep.missing || []).length) return {k: "bad", label: `${rep.missing.length} folder${rep.missing.length === 1 ? "" : "s"} missing`, issue: true};
  return {k: "ok", label: "Structure ✓", issue: false};
}
function rowOf(r){
  const a = auditSummary(r), day = adminDayStats(r), pp = adminPracticeStats(r);
  const firstOpen = a.days.find(d => !d.passed);
  const curDay = !a.loaded ? null : firstOpen ? cfN(firstOpen.id) : "done";
  const kcScores = a.days.filter(d => d.score !== null).map(d => d.score);
  return {rec: r, a, day, pp, status: statusOf(r), asked: asked(r), drive: driveState(r), curDay,
    kcAvg: kcScores.length ? Math.round(kcScores.reduce((x, y) => x + y, 0) / kcScores.length) : null,
    caseTitle: (r.assignedCase && (r.assignedCase.title || r.assignedCase.id)) || ""};
}

/* ---------- filters ---------- */
const NEEDS = [
  ["pending", "⏳ Awaiting approval", x => x.status === "pending"],
  ["asked", "🙋 Asked for attempts", x => x.asked],
  ["towrite", "💬 Feedback to write", x => x.a.loaded && x.a.toWrite.length > 0],
  ["below", "📉 Below 70%", x => x.a.loaded && x.a.kcBelow.length > 0],
  ["missed", "🎲 Missed a task", x => x.a.loaded && x.a.tasksMissed > 0],
  ["drive", "📂 Drive issue", x => x.drive.issue],
  ["nocase", "📁 No companion case", x => x.status === "active" && !x.caseTitle]
];
const STATUS_OPTS = [["current", "Current (active + pending)"], ["active", "Active"], ["pending", "⏳ Pending"], ["rejected", "Rejected"], ["archived", "Archived"], ["all", "All"]];
function statusFilter(){
  // "Show archived" (state.adminShowArchived) was the old switch: it means All here
  return state.auditStatus || (state.adminShowArchived ? "all" : "current");
}
const statusOk = (s, f) => f === "all" || (f === "current" ? (s === "active" || s === "pending") : s === f);
function baseRows(){
  const f = statusFilter();
  let rs = (state.adminData || []).filter(r => statusOk(statusOf(r), f));
  if(state.adminBatchFilter) rs = rs.filter(r => batchKey(r) === state.adminBatchFilter);
  return rs.map(rowOf);
}
function shownRows(){
  const q = (state.adminSearch || "").trim().toLowerCase();
  let rs = baseRows();
  if(q) rs = rs.filter(x => nameOf(x.rec).toLowerCase().includes(q) || String(x.rec.id || "").toLowerCase().includes(q));
  const dayF = state.auditDay || "";
  if(dayF) rs = rs.filter(x => String(x.curDay) === dayF);
  const need = NEEDS.find(n => n[0] === state.auditNeed);
  if(need) rs = rs.filter(need[2]);
  const {k, dir} = sortOf(), f = SORTS[k] || SORTS.days, m = dir === "asc" ? 1 : -1;
  // pending registrations stay on top, whatever the sort
  rs.sort((x, y) => ((y.status === "pending") - (x.status === "pending")) || m * f(x, y) || nameOf(x.rec).localeCompare(nameOf(y.rec)));
  return rs;
}

/* ---------- sorting: a click on a column's header (state.adminSort, as "<column>_<asc|desc>") ---------- */
const STATUS_RANK = {pending: 0, active: 1, rejected: 2, archived: 3};
const num = v => v == null ? -1 : v;
const SORTS = {
  name: (x, y) => nameOf(x.rec).localeCompare(nameOf(y.rec)),
  batch: (x, y) => String(cleanBatch(x.rec.batch) || "").localeCompare(String(cleanBatch(y.rec.batch) || ""), undefined, {numeric: true}),
  status: (x, y) => STATUS_RANK[x.status] - STATUS_RANK[y.status],
  now: (x, y) => new Date(x.rec.lastActive || 0) - new Date(y.rec.lastActive || 0),
  days: (x, y) => x.day.done - y.day.done,
  kc: (x, y) => num(x.kcAvg) - num(y.kcAvg),
  lessons: (x, y) => x.a.pct - y.a.pct,
  sb: (x, y) => x.pp.runs - y.pp.runs,
  tasks: (x, y) => x.a.tasksDone - y.a.tasksDone,
  feedback: (x, y) => (x.a.toWrite || []).length - (y.a.toWrite || []).length,
  drive: (x, y) => String(x.drive.label).localeCompare(String(y.drive.label)),
  "case": (x, y) => x.caseTitle.localeCompare(y.caseTitle)
};
const LEGACY = {completion_desc: ["days", "desc"], completion_asc: ["days", "asc"], score_desc: ["kc", "desc"], name_asc: ["name", "asc"], recent: ["now", "desc"]};
function sortOf(){
  const s = state.adminSort || "completion_desc";
  if(LEGACY[s]) return {k: LEGACY[s][0], dir: LEGACY[s][1]};
  const m = /^(.+)_(asc|desc)$/.exec(s);
  return m && SORTS[m[1]] ? {k: m[1], dir: m[2]} : {k: "days", dir: "desc"};
}
function sortBy(k){
  const cur = sortOf();
  const dir = cur.k === k ? (cur.dir === "asc" ? "desc" : "asc") : (k === "name" || k === "batch" || k === "status" || k === "case" || k === "drive" ? "asc" : "desc");
  state.adminSort = `${k}_${dir}`;
  refreshAdminRows();
}

/* ---------- the table ---------- */
const COLS = [
  ["name", "Trainee"], ["batch", "Batch"], ["status", "Status"], ["now", "Now · last active"], ["days", "Days 1–5"],
  ["kc", "Knowledge Checks"], ["lessons", "Lessons"], ["sb", "Skill Builder"], ["tasks", "🎲 Random tasks"],
  ["feedback", "Feedback · Focus"], ["drive", "📂 Drive"], ["case", "📁 Companion case"], ["", "Actions"]
];
function ago(iso){
  if(!iso) return "";
  const s = (Date.now() - new Date(iso).getTime()) / 1000;
  if(!(s >= 0)) return fmtDate(iso);
  if(s < 90) return "just now";
  if(s < 3600) return `${Math.round(s / 60)} min ago`;
  if(s < 86400) return `${Math.round(s / 3600)} h ago`;
  if(s < 86400 * 7) return `${Math.round(s / 86400)} d ago`;
  return fmtDate(iso);
}
function dayCell(d){
  const cls = d.passed ? "ok" : (d.score !== null ? "low" : (d.reached > 0 ? "wip" : "none"));
  const tip = `Case Flow Day ${cfN(d.id)}: ${d.reached}/${d.n} slides · ${d.score !== null ? `Knowledge Check ${d.score}%${d.passed ? " ✓" : " (below 70%)"}` : "Knowledge Check not taken"} · Skill Builder ${d.labDone ? "done" : "not done"}`;
  return `<span class="ad-cell ${cls}" title="${E(tip)}">${cfN(d.id)}${d.labDone ? "<i></i>" : ""}</span>`;
}
function rowHtml(x, ncol){
  const r = x.rec, a = x.a, id = r.id, open = state.adminExpandedId === id, menuOpen = MENU.id === id;
  const [stLabel, stCls] = STATUS[x.status];
  const loading = `<span class="at-dim">…</span>`;
  const status = x.status === "pending"
    ? `<span class="at-st pend">⏳ Pending</span><div class="at-inline"><button class="btn btn-sm btn-navy" onclick="approveTrainee('${J(id)}')">Approve</button><button class="btn btn-sm btn-ghost at-danger" onclick="rejectTrainee('${J(id)}')">Reject</button></div>${r.registeredAt ? `<div class="at-dim">registered ${E(ago(r.registeredAt))}</div>` : ""}`
    : `<span class="at-st ${stCls}">${stLabel}</span>`;
  const kc = !a.loaded ? loading : (a.days.some(d => d.score !== null)
    ? `<b>${x.kcAvg}%</b> avg · ${a.kcPassed}/${a.days.length} passed${a.kcBelow.length ? `<div class="at-warn">below 70%: Day ${a.kcBelow.map(cfN).join(", ")}</div>` : ""}`
    : `<span class="at-dim">not taken</span>`);
  const sb = `${x.pp.runs} run${x.pp.runs === 1 ? "" : "s"}${x.pp.avg ? ` · best ${x.pp.avg}%` : ""}${r.labAttemptsGlobal ? `<div class="at-dim">${E(r.labAttemptsGlobal)} of ${typeof LAB_ATTEMPT_CAP !== "undefined" ? LAB_ATTEMPT_CAP : 3} repeats used</div>` : ""}${x.asked ? `<button class="btn btn-sm btn-primary at-ask" title="Asked ${E(fmtDate(r.labResetRequestedAt))}${r.labResetRequestedDay ? ` (Day ${E(cfN(r.labResetRequestedDay))})` : ""}: give a fresh set of attempts" onclick="resetTraineeLabAttempts('${J(id)}')">🙋 Asked · ↺ Reset</button>` : ""}`;
  const tasks = !a.loaded ? loading : (a.tasksTotal ? `${a.tasksDone}/${a.tasksTotal} resolved${a.tasksAvg !== null ? ` · ${a.tasksAvg}%` : ""}${a.tasksMissed ? `<div class="at-warn">${a.tasksMissed} missed</div>` : ""}${a.tasksOpen ? `<div class="at-dim">${a.tasksOpen} open</div>` : ""}` : `<span class="at-dim">none yet</span>`);
  const fb = !a.loaded ? loading : `${a.sent} sent${a.sent ? ` (${a.read} read)` : ""}${a.drafts ? ` · ${a.drafts} draft` : ""}${a.toWrite.length ? `<div class="at-warn">to write: Day ${a.toWrite.map(cfN).join(", ")}</div>` : ""}<div class="at-dim">Focus ${a.focusOpen} open · ${a.focusDone} done</div>`;
  const drive = `<span class="at-drv ${x.drive.k}">${E(x.drive.label)}</span>${r.driveLink && (state.driveReports || {})[id] ? `<div class="at-dim">🔗 folder link sent</div>` : ""}`;
  const kase = x.caseTitle ? `<span class="at-case">📁 ${E(x.caseTitle)}</span>` : `<span class="at-dim">—</span>`;
  const flags = `${r.flaggedInvalidInput ? `<span class="at-flag bad">⚠ invalid input removed</span>` : ""}`;
  return `<tr class="at-row${open ? " open" : ""} st-${x.status}" data-id="${E(id)}">
    <th scope="row" class="at-c-name"><button type="button" class="at-name" onclick="cmAudit.toggle('${J(id)}')" title="${E(nameOf(r).slice(0, 200))}: ${open ? "hide" : "show"} detail">${E(nameOf(r).slice(0, 60))}${nameOf(r).length > 60 ? "…" : ""}</button>
      <div class="at-id">${E(String(id).slice(0, 48))}</div>${flags}</th>
    <td class="at-nw">${r.batch ? E(cleanBatch(r.batch)) : `<span class="at-dim">—</span>`}</td>
    <td class="at-c-st">${status}</td>
    <td>${a.loaded ? `<div class="at-now">${E(relabel(a.where))}</div>` : loading}<div class="at-dim" title="${E(r.lastActive ? new Date(r.lastActive).toLocaleString() : "")}">${r.lastActive ? E(ago(r.lastActive)) : "never active"}</div></td>
    <td>${a.loaded ? `<div class="ad-cells">${a.days.map(dayCell).join("")}</div><div class="at-dim">${x.day.done}/${x.day.total} passed</div>` : loading}</td>
    <td>${kc}</td>
    <td>${a.loaded ? `<b>${a.pct}%</b><div class="at-bar"><div style="width:${a.pct}%"></div></div><div class="at-dim">${a.seen}/${a.total} slides</div>` : loading}</td>
    <td class="at-c-sb">${sb}</td>
    <td>${tasks}</td>
    <td>${fb}</td>
    <td>${drive}</td>
    <td>${kase}</td>
    <td class="at-c-act"><div class="at-acts"><button type="button" class="btn btn-sm ${open ? "btn-navy" : "btn-ghost"}" aria-expanded="${open}" onclick="cmAudit.toggle('${J(id)}')">👁 ${open ? "Hide" : "Detail"}</button><button type="button" class="btn btn-sm btn-ghost at-more" aria-haspopup="menu" aria-expanded="${menuOpen}" title="All actions for ${E(nameOf(r))}" onclick="cmAudit.menu('${J(id)}', this)">⋯</button></div></td>
  </tr>${open ? `<tr class="at-detail-row"><td colspan="${ncol}"><div class="at-detail-in"><div class="at-detail-h"><b>${E(nameOf(r))}</b><button type="button" class="btn btn-sm btn-ghost" onclick="toggleAdminDetail('${J(id)}')">✕ Close detail</button></div>${relabel(renderAdminDetail(r))}</div></td></tr>` : ""}`;
}
function tableHtml(){
  const rs = shownRows(), {k, dir} = sortOf();
  if(!rs.length){
    const any = (state.adminData || []).length;
    return `<div class="empty-note at-empty">No trainees ${any ? "match these filters" : "yet: once someone registers from the Portal, they show up here"}.${any ? ` <button class="btn btn-sm btn-ghost" onclick="cmAudit.clear()">Clear filters</button>` : ""}</div>`;
  }
  const th = ([key, label]) => !key ? `<th scope="col" class="at-c-act">${label}</th>`
    : `<th scope="col"${key === "name" ? ` class="at-c-name"` : ""} aria-sort="${key === k ? (dir === "asc" ? "ascending" : "descending") : "none"}"><button type="button" class="at-sort${key === k ? " on" : ""}" onclick="cmAudit.sort('${key}')">${label}<span>${key === k ? (dir === "asc" ? "▲" : "▼") : "↕"}</span></button></th>`;
  return `<table class="at-table"><caption class="at-cap">${rs.length} trainee${rs.length === 1 ? "" : "s"} shown · click a column's header to sort · 👁 Detail opens the full record · ⋯ holds every action</caption>
    <thead><tr>${COLS.map(th).join("")}</tr></thead>
    <tbody>${rs.map(x => rowHtml(x, COLS.length)).join("")}</tbody></table>`;
}

/* renderAdminRows: what every script redraws into #adminRowsWrap (the old loads are kept: progress, feedback,
   Focus and the Drive reports, at most once a minute) */
const __rows = renderAdminRows;
renderAdminRows = window.renderAdminRows = function(){
  if(!state.adminData) return __rows.apply(this, arguments);
  if(state.adminData.length && state.adminData.some(r => !state.auditExtra[r.id] || Date.now() - state.auditExtra[r.id].at > 60000)) setTimeout(() => loadAuditExtras(), 0);
  if(state.adminData.length && !state.driveReportsLoading && (!state.driveReportsAt || Date.now() - state.driveReportsAt > 60000)) setTimeout(() => loadDriveReports(), 0);
  setTimeout(sizeScroller, 0);
  return tableHtml();
};

/* ---------- the toolbar above the table (outside #adminRowsWrap, so typing in the search keeps its place) ---------- */
function batchKeys(){
  return Array.from(new Set((state.adminData || []).map(batchKey))).sort((a, b) => a === NO_BATCH ? 1 : b === NO_BATCH ? -1 : a.localeCompare(b, undefined, {numeric: true}));
}
function toolbarHtml(){
  const keys = batchKeys();
  if(state.adminBatchFilter && !keys.includes(state.adminBatchFilter)) state.adminBatchFilter = "";
  const cur = state.adminBatchFilter || "", st = statusFilter(), all = state.adminData || [];
  const inBatch = k => all.filter(r => batchKey(r) === k);
  const base = baseRows();
  const chips = NEEDS.map(([key, label, f]) => { const n = base.filter(f).length; const on = state.auditNeed === key;
    return n || on ? `<button type="button" class="at-chip${on ? " on" : ""}" aria-pressed="${on}" onclick="cmAudit.need('${key}')">${label} <b>${n}</b></button>` : ""; }).join("");
  const batchTools = cur ? (() => {
    const live = inBatch(cur).filter(r => !r.archived).length, arch = inBatch(cur).filter(r => r.archived).length;
    const fbN = typeof batchFeedback === "function" && state.tfbAdmin && !state.tfbAdmin.loading ? batchFeedback(cur).length : null;
    return `${live ? `<button class="btn btn-sm btn-ghost at-danger" onclick="confirmArchiveBatch('${J(cur)}')">📦 Archive batch</button>` : ""}${arch ? `<button class="btn btn-sm btn-ghost" onclick="confirmUnarchiveBatch('${J(cur)}')">↩ Restore batch (${arch})</button>` : ""}
      <button class="btn btn-sm btn-ghost" onclick="setAdminTab('rankings')">🏆 Batch rankings</button>
      <button class="btn btn-sm ${state.auditBatchFb ? "btn-navy" : "btn-ghost"}" aria-pressed="${!!state.auditBatchFb}" onclick="cmAudit.batchFb()">💬 Batch feedback${fbN !== null ? ` (${fbN})` : ""}</button>`;
  })() : "";
  return `<div class="at-bar-top">
      <label class="at-f at-f-search"><span>🔎 Search</span><input type="search" id="atSearch" placeholder="Name or ID…" value="${E(state.adminSearch || "")}" oninput="setAdminSearch(this.value)" aria-label="Search trainees by name or ID"></label>
      <label class="at-f"><span>Batch</span><select id="atBatch" onchange="cmAudit.batch(this.value)"><option value="">All batches (${all.filter(r => !r.archived).length})</option>${keys.map(k => { const n = inBatch(k).filter(r => !r.archived).length, ar = inBatch(k).length - n;
        return `<option value="${E(k)}" ${k === cur ? "selected" : ""}>${E(folderLabel(k))} (${n}${ar ? ` + ${ar} archived` : ""})</option>`; }).join("")}</select></label>
      <label class="at-f"><span>Status</span><select id="atStatus" onchange="cmAudit.status(this.value)">${STATUS_OPTS.map(([v, l]) => `<option value="${v}" ${v === st ? "selected" : ""}>${l}</option>`).join("")}</select></label>
      <label class="at-f"><span>Day</span><select id="atDay" onchange="cmAudit.day(this.value)"><option value="">Any day</option>${cfDays().map(d => `<option value="${d.cf.n}" ${String(d.cf.n) === state.auditDay ? "selected" : ""}>On Case Flow Day ${d.cf.n}</option>`).join("")}<option value="done" ${state.auditDay === "done" ? "selected" : ""}>Finished all days</option></select></label>
      ${state.adminSearch || state.auditNeed || state.auditDay || cur || st !== "current" ? `<button class="btn btn-sm btn-ghost at-clear" onclick="cmAudit.clear()">✕ Clear filters</button>` : ""}
      ${batchTools ? `<div class="at-batch-tools">${batchTools}</div>` : ""}
    </div>
    ${chips ? `<div class="at-needs"><span class="at-needs-l">Needs attention:</span>${chips}</div>` : ""}`;
}
function cohortChips(){
  const rs = (state.adminData || []).filter(r => !r.archived), n = rs.length;
  const totalDays = cfDays().length || DAYS.length;
  const avgDone = n ? Math.round(rs.reduce((a, r) => a + adminDayStats(r).done, 0) / n / totalDays * 100) : 0;
  const sc = rs.flatMap(r => { const dp = r.dayProgress || {}; return cfDays().map(d => dp[d.id]).filter(p => p && typeof p.score === "number").map(p => p.score); });
  const avgKc = sc.length ? Math.round(sc.reduce((a, b) => a + b, 0) / sc.length) : null;
  const finished = rs.filter(r => adminDayStats(r).done === totalDays).length;
  const pend = rs.filter(r => statusOf(r) === "pending").length;
  return `<div class="at-kpis"><span><b>${n}</b> trainee${n === 1 ? "" : "s"}</span><span><b>${avgDone}%</b> avg completion</span><span><b>${avgKc === null ? "—" : avgKc + "%"}</b> avg Knowledge Check</span><span><b>${finished}</b> finished all ${totalDays} days</span>${pend ? `<button type="button" class="at-kpi-pend" onclick="cmAudit.status('pending')"><b>${pend}</b> ⏳ awaiting approval</button>` : ""}</div>`;
}

/* The audit's body (called by renderAdmin in index.html): the toolbar, the table, and a picked batch's feedback */
renderAuditBatchView = window.renderAuditBatchView = function(){
  if(state.adminBatchFilter && state.auditBatchFb && !state.tfbAdmin && typeof loadTraineeFeedbackAdmin === "function") setTimeout(() => loadTraineeFeedbackAdmin().then(() => { if(state.view === "admin") render(); }), 0);
  let fbPanel = "";
  if(state.adminBatchFilter && state.auditBatchFb && typeof renderBatchFolderBody === "function"){
    const keep = state.batchSub; state.batchFolder = state.adminBatchFilter; state.batchSub = "feedback"; state.batchShowArchived = statusFilter() === "all" || statusFilter() === "archived";
    try{ fbPanel = `<div class="card at-fb"><div class="at-fb-h"><b>💬 ${E(folderLabel(state.adminBatchFilter))}: what the trainees said about the training</b><button class="btn btn-sm btn-ghost" onclick="cmAudit.batchFb()">✕ Close</button></div><div id="batchFolderBody">${renderBatchFolderBody()}</div></div>`; }
    finally{ state.batchSub = keep; }
  }
  return `<div class="at-wrap" id="cmAuditTable">${toolbarHtml()}${fbPanel}<div class="at-scroll" id="atScroll"><div id="adminRowsWrap">${renderAdminRows()}</div></div></div>`;
};
// the pending registrations are rows of the table now (pinned on top, Approve / Reject in their Status cell)
renderPendingApprovalsPanel = window.renderPendingApprovalsPanel = function(){ return ""; };

/* The rest of the page, rearranged after renderAdmin (and js/cm-case-flow.js's wrapper) draw it */
function headHtml(){
  return `<div class="audit-page-head at-head">
      <div><p class="eyebrow">Admin Dashboard</p><h1>Trainee Audit</h1>${cohortChips()}</div>
      <div class="at-head-acts">
        <button class="btn btn-sm btn-navy" onclick="cmAudit.csv()" title="The table as shown, as a spreadsheet">⬇ Download CSV</button>
        <button class="btn btn-sm btn-ghost" onclick="downloadCohortPdf()" title="Days, average and practice runs for every trainee, as a PDF">⬇ Cohort PDF</button>
        <button class="btn btn-sm btn-ghost at-more" aria-haspopup="menu" aria-expanded="${MENU.id === "__page"}" onclick="cmAudit.menu('__page', this)" title="Refresh now · Log out">⋯</button>
      </div>
    </div>`;
}
function rearrange(out){
  const t = document.createElement("template"); t.innerHTML = out;
  const root = t.content, head = root.querySelector(".audit-page-head");
  if(!head || !root.querySelector("#cmAuditTable")) return out;
  const lede = head.nextElementSibling;
  const h = document.createElement("template"); h.innerHTML = headHtml();
  head.replaceWith(h.content);
  if(lede && lede.tagName === "P") lede.remove();
  const stats = root.querySelector(".stat-row"); if(stats) stats.remove();
  // the old filter bar (search, sort, "Show archived", 📦 Archive This Batch): the table's toolbar does all of it
  const oldSearch = root.querySelector("#adminSearchInput");
  if(oldSearch){ let bar = oldSearch; while(bar.parentNode && bar.parentNode !== root) bar = bar.parentNode; if(bar.parentNode === root) bar.remove(); }
  // the settings that aren't audit content fold into one section
  const task = root.querySelector("#surpriseTaskDaySelect");
  const parts = [root.querySelector(".cert-settings"), root.querySelector(".fb-settings"), task && task.closest(".card")].filter(Boolean);
  if(parts.length){
    const d = document.createElement("details"); d.className = "at-settings"; d.id = "atSettings";
    if(state.auditSettingsOpen) d.setAttribute("open", "");
    d.setAttribute("ontoggle", "state.auditSettingsOpen = this.open");
    d.innerHTML = `<summary>⚙ Settings &amp; live tools <span>🎓 certificate signatories · 💬 feedback drafts · 🎲 random task injection</span></summary><div class="at-settings-body"></div>`;
    parts[0].before(d);
    const body = d.querySelector(".at-settings-body"); parts.forEach(p => body.appendChild(p));
  }
  return t.innerHTML;
}
const __admin = window.renderAdmin;
window.renderAdmin = function(){
  const out = __admin.apply(this, arguments);
  if(!state.isAdmin || (state.adminTab || "audit") !== "audit" || !state.adminData || state.adminLoading) return out;
  setTimeout(sizeScroller, 0);
  try{ return rearrange(out); }catch(e){ return out; }
};

/* the detail row spans the table: it stays as wide as the visible table while the columns scroll sideways */
let ro = null;
function sizeScroller(){
  const sc = document.getElementById("atScroll"); if(!sc) return;
  sc.style.setProperty("--at-w", sc.clientWidth + "px");
  if(typeof ResizeObserver === "function" && (!ro || ro.__el !== sc)){
    if(ro) ro.disconnect();
    ro = new ResizeObserver(() => sc.style.setProperty("--at-w", sc.clientWidth + "px")); ro.__el = sc; ro.observe(sc);
  }
}

/* ---------- ⋯ : one menu for every action on a trainee ---------- */
const MENU = {id: null};
function menuItems(id){
  if(id === "__page") return `<div class="at-m-sec"><button role="menuitem" onclick="cmAudit.close();refreshAdminData()">↻ Refresh now</button><button role="menuitem" onclick="cmAudit.close();adminLogout()">Log out of Admin</button></div>`;
  const r = byId(id); if(!r) return "";
  const st = statusOf(r), open = state.adminExpandedId === id, ask = asked(r);
  const b = (label, js, cls) => `<button type="button" role="menuitem"${cls ? ` class="${cls}"` : ""} onclick="cmAudit.close();${js}">${label}</button>`;
  const q = J(id);
  const assign = (typeof renderUnlockDaysControl === "function" ? renderUnlockDaysControl(r) : "") || "";
  return `<div class="at-m-who"><b>${E(nameOf(r))}</b><span>${E(r.id)}${r.batch ? ` · ${E(cleanBatch(r.batch))}` : ""}</span></div>
    <div class="at-m-sec"><div class="at-m-h">Open</div>
      ${b(`👁 ${open ? "Hide" : "View"} detail`, `toggleAdminDetail('${q}')`)}
      ${b("✍ Write feedback", `openFeedbackFor('${q}')`)}
      ${b("🎓 Certificate", `adminOpenCertificate('${q}')`)}
      ${window.cmScorecard ? b("🏅 Scorecard row", `cmAudit.scorecard('${q}')`) : ""}</div>
    <div class="at-m-sec"><div class="at-m-h">Assign</div>
      ${assign ? `<div class="at-m-ctl" onchange="setTimeout(cmAudit.close, 0)">${assign}</div>` : ""}
      ${b("🎭 Roleplay · 🔓 corrected copies · 🎯 focus", `cmAudit.detail('${q}')`)}</div>
    <div class="at-m-sec"><div class="at-m-h">Access</div>
      ${st === "pending" || st === "rejected" ? b("✅ Approve", `approveTrainee('${q}')`) : ""}
      ${st === "pending" || st === "active" ? b("✖ Reject registration", `rejectTrainee('${q}')`, "at-m-danger") : ""}
      ${b(`↺ Reset Skill Builder attempts${r.labAttemptsGlobal ? ` (${E(r.labAttemptsGlobal)} used)` : ""}${ask ? " · 🙋 asked" : ""}`, `resetTraineeLabAttempts('${q}')`, ask ? "at-m-hot" : "")}
      ${typeof driveCheckFor === "function" ? b("📂 Check Backup Drive now", `driveCheckFor('${q}')`) : ""}
      ${r.archived ? b("↩ Restore trainee", `cmAudit.archive('${q}', false)`) : b("📦 Archive trainee (records kept)", `cmAudit.archive('${q}', true)`)}</div>
    <div class="at-m-sec at-m-zone">${b("🗑 Revoke &amp; delete registration…", `cmAudit.revoke('${q}')`, "at-m-danger")}</div>`;
}
function menu(id, btn){
  if(MENU.id === id){ close(); return; }
  close();
  const m = document.createElement("div"); m.id = "atMenu"; m.className = "at-menu"; m.setAttribute("role", "menu");
  m.innerHTML = relabel(menuItems(id)); if(!m.innerHTML.trim()) return;
  document.body.appendChild(m); MENU.id = id; MENU.btn = btn; MENU.at = Date.now();
  if(btn) btn.setAttribute("aria-expanded", "true");
  const rc = btn ? btn.getBoundingClientRect() : {right: innerWidth - 16, bottom: 80, top: 80};
  const w = m.offsetWidth, h = m.offsetHeight;
  let left = Math.max(8, Math.min(innerWidth - w - 8, rc.right - w)), top = rc.bottom + 6;
  if(top + h > innerHeight - 8) top = Math.max(8, rc.top - h - 6);
  m.style.left = left + "px"; m.style.top = top + "px";
  const first = m.querySelector("button, select"); if(first) first.focus({preventScroll: true});
}
function close(){
  const m = document.getElementById("atMenu"); if(m) m.remove();
  if(MENU.btn && MENU.btn.isConnected) MENU.btn.setAttribute("aria-expanded", "false");
  MENU.id = null; MENU.btn = null;
}
document.addEventListener("mousedown", e => { if(MENU.id && !e.target.closest("#atMenu") && !e.target.closest(".at-more")) close(); }, true);
document.addEventListener("keydown", e => { if(e.key === "Escape" && MENU.id){ const b = MENU.btn; close(); if(b && b.isConnected) b.focus(); } });
window.addEventListener("resize", () => { if(MENU.id) close(); });
// a scroll moves the button away from its menu: close it (not the scroll that brought the button into view a moment ago)
document.addEventListener("scroll", e => { if(MENU.id && Date.now() - (MENU.at || 0) > 400 && !(e.target && e.target.closest && e.target.closest("#atMenu"))) close(); }, true);

/* ---------- actions the table adds ---------- */
async function archive(id, on){
  const rec = await sharedGet("trainee:" + id); if(!rec){ toast("Couldn't load that trainee: refresh and try again."); return; }
  const who = nameOf(rec);
  if(on && !confirm(`Archive ${who}? They're hidden from the current list, Rankings and the batch, but every record is kept. Pick Status: Archived to see them again.`)) return;
  rec.archived = !!on;
  if(!(await sharedSet("trainee:" + id, rec))){ toast("Not saved: check your connection and try again."); return; }
  const i = (state.adminData || []).findIndex(r => r.id === id); if(i !== -1) state.adminData[i] = rec;
  toast(on ? `${who} archived. Their records are kept.` : `${who} restored.`);
  render();
}
function revoke(id){ const r = byId(id); confirmRevokeTrainee(id, nameOf(r)); }
function detail(id){
  state.adminExpandedId = id; refreshAdminRows(); reveal(id);
}
function toggle(id){ toggleAdminDetail(id); if(state.adminExpandedId === id) reveal(id); }
function reveal(id){
  setTimeout(() => { const row = document.querySelector(`.at-row[data-id="${CSS.escape(id)}"]`); if(row) row.scrollIntoView({behavior: "smooth", block: "start"}); }, 60);
}
function scorecard(id){ goto("scorecard"); setTimeout(() => { if(window.cmScorecard && typeof cmScorecard.pick === "function") cmScorecard.pick(id); }, 50); }
function rerender(){ close(); const y = window.scrollY; render(); window.scrollTo(0, y); }
function csv(){
  const rs = shownRows();
  const head = ["Name", "ID", "Batch", "Status", "Now", "Last active", ...cfDays().map(d => `Case Flow Day ${d.cf.n} KC %`), "Days passed", "KC avg %", "Lessons %", "Skill Builder runs", "Repeats used", "Asked for attempts", "Random tasks resolved", "Random tasks missed", "Feedback sent", "Feedback to write (days)", "Focus open", "Drive", "Companion case"];
  const lines = rs.map(x => { const a = x.a, r = x.rec;
    return [nameOf(r), r.id, cleanBatch(r.batch) || "", STATUS[x.status][0].replace(/^⏳ /, ""), a.loaded ? relabel(a.where) : "", r.lastActive || "",
      ...cfDays().map(d => { const y = a.days.find(z => z.id === d.id); return y && y.score !== null ? y.score : ""; }),
      x.day.done, x.kcAvg == null ? "" : x.kcAvg, a.pct, x.pp.runs, r.labAttemptsGlobal || 0, x.asked ? "yes" : "", a.tasksDone || 0, a.tasksMissed || 0, a.sent || 0, (a.toWrite || []).map(cfN).join(" "), a.focusOpen || 0, x.drive.label, x.caseTitle]; });
  const cell = v => { const s = String(v == null ? "" : v); return /[",\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s; };
  const text = "﻿" + [head, ...lines].map(l => l.map(cell).join(",")).join("\r\n");
  const url = URL.createObjectURL(new Blob([text], {type: "text/csv;charset=utf-8"}));
  const a = document.createElement("a"); a.href = url; a.download = `trainee-audit${state.adminBatchFilter ? "-" + batchLabel(state.adminBatchFilter).replace(/[^\w-]+/g, "_") : ""}-${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url), 2000);
}
window.cmAudit = {
  menu, close, sort: sortBy, archive, revoke, detail, toggle, scorecard, csv,
  batch(v){ state.adminBatchFilter = v; rerender(); },
  status(v){ state.auditStatus = v; state.adminShowArchived = v === "all" || v === "archived"; rerender(); },
  day(v){ state.auditDay = v; rerender(); },
  need(k){ state.auditNeed = state.auditNeed === k ? "" : k; rerender(); },
  batchFb(){ state.auditBatchFb = !state.auditBatchFb; rerender(); },
  clear(){ state.adminSearch = ""; state.auditNeed = ""; state.auditDay = ""; state.adminBatchFilter = ""; state.auditStatus = "current"; state.adminShowArchived = false; rerender(); },
  rows: shownRows   // for the checks
};

/* ---------- look: LSH navy and orange, 14px and up ---------- */
const st = document.createElement("style"); st.id = "cm-audit-table"; st.textContent = `
.at-head{display:flex;gap:12px 16px;flex-wrap:wrap;align-items:flex-end;justify-content:space-between;margin-bottom:14px;}
.at-head h1{color:#1E2340;font-size:28px;margin:6px 0 8px;}
.at-head-acts{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;}
.at-kpis{display:flex;flex-wrap:wrap;gap:8px;font-size:14px;color:#262B45;}
.at-kpis>span,.at-kpi-pend{background:#F1F2F7;border:1px solid #DCE0EA;border-radius:999px;padding:4px 12px;font:inherit;}
.at-kpis b{color:#1E2340;font-weight:800;}
.at-kpi-pend{background:#FFF1E2;border-color:#DB8437;color:#7A3F0E;cursor:pointer;}
.at-settings{margin:0 0 16px;border:1px solid #DCE0EA;border-radius:12px;background:#fff;}
.at-settings>summary{cursor:pointer;padding:12px 16px;font-weight:700;color:#1E2340;font-size:15px;list-style-position:inside;}
.at-settings>summary span{font-weight:500;color:#2B2F3E;font-size:14px;margin-left:6px;}
.at-settings-body{padding:0 16px 14px;display:grid;gap:12px;}
.at-settings-body>.card{margin:0 !important;width:auto !important;max-width:100%;box-sizing:border-box;min-width:0;}
.at-settings-body{grid-template-columns:minmax(0,1fr);}
.at-settings .cert-settings-grid{grid-template-columns:repeat(auto-fill,minmax(200px,1fr)) !important;}
.at-settings .cert-settings-grid input{min-width:0;font-size:14px;}
.at-wrap{font-family:'Inter',system-ui,sans-serif;}
.at-bar-top{display:flex;flex-wrap:wrap;gap:10px 12px;align-items:flex-end;background:#1E2340;color:#fff;border-radius:12px 12px 0 0;padding:12px 14px;}
.at-f{display:flex;flex-direction:column;gap:4px;font-size:14px;font-weight:700;color:#E6E8F2;}
.at-f input,.at-f select{font:500 15px 'Inter',system-ui,sans-serif;padding:7px 10px;border-radius:8px;border:1px solid #4A5070;background:#fff;color:#1E2340;min-height:38px;}
.at-f-search input{min-width:220px;}
.at-bar-top .btn-ghost{background:#262B45;border-color:#5A6080;color:#fff;}
.at-bar-top .btn-ghost:hover{background:#343A5C;}
.at-bar-top .btn-navy{background:#DB8437;background-image:none;color:#241304;}
.at-bar-top .at-danger{color:#FFD2CC;}
.at-batch-tools{display:flex;flex-wrap:wrap;gap:8px;margin-left:auto;}
.at-needs{display:flex;flex-wrap:wrap;gap:8px;align-items:center;background:#262B45;padding:8px 14px 12px;}
.at-needs-l{color:#E6E8F2;font-size:14px;font-weight:700;margin-right:2px;}
.at-chip{font:600 14px 'Inter',system-ui,sans-serif;border-radius:999px;border:1px solid #5A6080;background:#1E2340;color:#fff;padding:5px 12px;cursor:pointer;}
.at-chip b{background:#DB8437;color:#241304;border-radius:999px;padding:0 7px;margin-left:4px;}
.at-chip.on{background:#DB8437;border-color:#DB8437;color:#241304;}
.at-chip.on b{background:#1E2340;color:#fff;}
.at-fb{margin:0 !important;border-radius:0 !important;padding:14px 16px !important;}
.at-fb-h{display:flex;justify-content:space-between;gap:10px;align-items:center;margin-bottom:8px;color:#1E2340;font-size:15px;}
.at-scroll{overflow:auto;max-height:76vh;border:1px solid #DCE0EA;border-top:0;border-radius:0 0 12px 12px;background:#fff;}
.at-table{border-collapse:separate;border-spacing:0;width:100%;min-width:1500px;font-size:14px;color:#1E2340;}
.at-cap{caption-side:top;text-align:left;font-size:14px;color:#2B2F3E;padding:8px 14px;background:#F6F7FB;border-bottom:1px solid #DCE0EA;}
.at-table thead th{position:sticky;top:0;z-index:3;background:#262B45;color:#fff;text-align:left;font-weight:700;white-space:nowrap;border-bottom:2px solid #DB8437;padding:0;}
.at-sort{all:unset;box-sizing:border-box;display:flex;gap:6px;align-items:center;width:100%;padding:10px 12px;cursor:pointer;font:700 14px 'Inter',system-ui,sans-serif;color:#fff;}
.at-sort span{opacity:.6;font-size:14px;} .at-sort.on span{opacity:1;color:#F2A65E;}
.at-sort:focus-visible{outline:2px solid #DB8437;outline-offset:-2px;}
.at-table thead th.at-c-act{padding:10px 12px;}
.at-table td,.at-table tbody th{padding:10px 12px;border-bottom:1px solid #E4E7EF;vertical-align:top;background:#fff;text-align:left;font-weight:500;line-height:1.4;}
.at-row,.at-row>*{scroll-margin-top:52px;}
.at-table tbody tr.at-row:hover>*{background:#F8F9FC;}
.at-table tbody tr.open>*{background:#FFF7EE;}
.at-table tbody tr.st-pending>*{background:#FFF7EE;}
.at-c-name{position:sticky;left:0;z-index:2;min-width:210px;max-width:260px;box-shadow:2px 0 0 #DCE0EA;}
.at-table thead th.at-c-name{z-index:4;}
.at-name{all:unset;cursor:pointer;font:700 15px 'Inter',system-ui,sans-serif;color:#1E2340;text-decoration:underline;text-decoration-color:#DB8437;text-underline-offset:3px;overflow-wrap:anywhere;}
.at-name:focus-visible{outline:2px solid #DB8437;}
.at-id{font:500 14px 'IBM Plex Mono',monospace;color:#2B2F3E;overflow-wrap:anywhere;}
.at-flag{display:inline-block;margin-top:4px;font-size:14px;font-weight:700;}
.at-flag.bad,.at-warn{color:#9B3A30;font-weight:700;}
.at-dim{color:#3D4152;font-size:14px;}
.at-st{display:inline-block;border-radius:999px;padding:2px 10px;font-weight:700;font-size:14px;white-space:nowrap;}
.at-st.ok{background:#E3F1E8;color:#24563A;} .at-st.pend{background:#FFE7CF;color:#7A3F0E;} .at-st.bad{background:#F8E1DE;color:#9B3A30;} .at-st.arch{background:#ECEDF2;color:#2B2F3E;}
.at-inline{display:flex;gap:6px;margin:6px 0 2px;}
.at-inline .btn{padding:4px 10px;white-space:nowrap;}
.at-c-st{min-width:178px;}
.at-nw{white-space:nowrap;}
.at-now{font-weight:600;max-width:220px;}
.at-table .ad-cells{gap:4px;} .at-table .ad-cell{width:26px;height:26px;flex-basis:26px;font-size:14px;}
.at-bar{height:6px;border-radius:3px;background:#E4E7EF;margin:4px 0;width:90px;} .at-bar>div{height:100%;border-radius:3px;background:#DB8437;}
.at-drv{font-weight:700;} .at-drv.ok{color:#24563A;} .at-drv.bad,.at-drv.off{color:#9B3A30;}
.at-case{font-weight:600;display:inline-block;max-width:200px;}
.at-ask{margin-top:6px;}
.at-c-sb{min-width:150px;}
.at-c-act{position:sticky;right:0;z-index:2;box-shadow:-2px 0 0 #DCE0EA;}
.at-acts{display:flex;gap:6px;justify-content:flex-end;white-space:nowrap;}
.at-wrap .btn,.at-head .btn,.at-ask{font-size:14px;}
.at-head .eyebrow{font-size:14px;}
.at-more{font-size:18px !important;line-height:1;padding:5px 12px !important;}
.at-danger{color:#9B3A30;}
.at-detail-row>td{padding:0;background:#F8F9FC !important;border-bottom:3px solid #DB8437;}
.at-detail-in{position:sticky;left:0;width:var(--at-w,100%);box-sizing:border-box;}
.at-detail-h{display:flex;justify-content:space-between;align-items:center;gap:10px;padding:10px 18px 0;color:#1E2340;font-size:15px;}
.at-empty{padding:24px;font-size:15px;}
.at-menu{position:fixed;z-index:9999;background:#fff;color:#1E2340;border:1px solid #262B45;border-radius:12px;box-shadow:0 18px 40px -12px rgba(30,35,64,.45);width:320px;max-height:min(80vh,620px);overflow:auto;padding:6px 0;font-family:'Inter',system-ui,sans-serif;}
.at-m-who{padding:8px 14px 10px;border-bottom:1px solid #E4E7EF;background:#1E2340;color:#fff;margin:-6px 0 0;border-radius:11px 11px 0 0;}
.at-m-who b{display:block;font-size:15px;} .at-m-who span{font:500 14px 'IBM Plex Mono',monospace;color:#E6E8F2;overflow-wrap:anywhere;}
.at-m-sec{padding:6px 0;border-bottom:1px solid #E4E7EF;} .at-m-sec:last-child{border-bottom:0;}
.at-m-h{font-size:14px;font-weight:800;color:#B5651F;padding:2px 14px 4px;text-transform:uppercase;letter-spacing:.04em;}
.at-menu button{all:unset;box-sizing:border-box;display:block;width:100%;padding:8px 14px;font:500 15px 'Inter',system-ui,sans-serif;color:#1E2340;cursor:pointer;}
.at-menu button:hover,.at-menu button:focus-visible{background:#FFF1E2;}
.at-menu .at-m-danger{color:#9B3A30;font-weight:700;}
.at-menu .at-m-hot{background:#FFE7CF;font-weight:700;}
.at-m-zone{background:#FBF1EF;}
.at-m-ctl{padding:4px 14px 6px;}
.at-m-ctl select{width:100%;font:500 15px 'Inter',system-ui,sans-serif;padding:7px 8px;border-radius:8px;border:1px solid #262B45;background:#fff;color:#1E2340;}
@media (max-width:760px){.at-f-search input{min-width:0;width:100%;} .at-f-search{flex:1 1 100%;} .at-batch-tools{margin-left:0;}}
@media print{.at-bar-top,.at-needs,.at-acts,.at-settings,.at-head-acts{display:none !important;} .at-scroll{max-height:none;overflow:visible;}}
`;
document.head.appendChild(st);
})();
