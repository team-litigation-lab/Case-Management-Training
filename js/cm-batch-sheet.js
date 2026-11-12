/* ============================================================
   📋 BATCH SHEET: one Google-Sheets-style page per batch, as in Foundational Training (its js/ft-batch-sheet.js)
   ------------------------------------------------------------
   Admin → 🛡 Admin Master Control → 📋 Batch Sheet (the tab the Admin screen opens on). Pick a batch (or All batches)
   and every trainee who registered in it is on one page, in tables one under the other:
     📚 Lessons         a column per Case Flow day: the deck (✓ finished, or how far in) and the Knowledge Check score
     🏅 Scores          a column per grading system (the Scorecard's own, js/cm-scorecard.js compute), the Overall % and the
                        rank; click a trainee for 🔎 Grades in detail under it
     🏅 Score Card      a group of columns per day (Knowledge Check, Learning Checks, Takeaways, Activities & calls,
                        Random tasks, Backup Drive, the day's Average, the trainer's remarks)
     📅 Day by Day      a column per day, and 🔎 a trainee's days in detail (why, ⭐ best, 🔧 improve)
     🧮 Grading systems a sheet per grading system with its own metrics (one shown at a time)
     🕒 Recent progress everything they did, newest first
   The sheet only shows scores: what a trainer DOES (Approve / Reject, ↺ Reset Attempts, Revoke, 📁 Assign a case…, the
   detail with ✍ feedback and 🎓 the certificate, 👥 duplicate accounts, 📦 Archive this batch, the settings) is in
   🛡 Admin Master Control (👥 Trainee Audit, js/cm-audit-table.js; 📁 Companion Cases, js/cm-companion.js; ⚙ Settings).
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
const dTime = v => { const d = T0(v); return d ? DTF.format(d) : ""; };
const ago = v => { const d = T0(v); if(!d) return ""; const m = Math.round((Date.now() - d) / 60000);
  return m < 2 ? "just now" : m < 60 ? `${m} min ago` : m < 1440 ? `${Math.round(m / 60)} h ago` : `${Math.round(m / 1440)} day${Math.round(m / 1440) === 1 ? "" : "s"} ago`; };
const letter = i => { let s = ""; i++; while(i > 0){ const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
const days = () => (typeof DAYS !== "undefined" ? DAYS : []);
const dayLabel = d => d.cf ? `Day ${d.cf.n}` : `Day ${d.id}`;
const tools = () => (typeof PRACTICE_TOOLS !== "undefined" ? PRACTICE_TOOLS : []);
const keyOf = r => typeof batchKey === "function" ? batchKey(r) : (r.batch || "");
const labelOf = k => typeof folderLabel === "function" ? folderLabel(k) : k;

const B = {extra: {}, loading: false, pick: "", recent: 14, ds: "", dsOpen: {}, sys: ""};

/* ---------- who is on the sheet: the picked batch (state.adminBatchFilter, "" = all), not archived, not rejected ---------- */
function people(){
  const k = state.adminBatchFilter || "";
  return (state.adminData || []).filter(r => r && !r.rejected && (state.adminShowArchived || !r.archived) && (!k || keyOf(r) === k))
    .sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}
const statusOf = r => r.archived ? "Archived" : r.approved === true ? "Approved" : "Waiting for approval";
const nameOf = r => (typeof cleanName === "function" ? cleanName(r.name) : "") || String(r.name || "Unnamed").slice(0, 60);
const extraOf = r => (r && r.__extra) || (state.auditExtra || {})[r.id];
const dataOf = r => (extraOf(r) || {}).data || {};
// the trainee's whole feedback:<id> (the trainer's Learning Check scores and each day's review with its 📐 rubric score)
const fbRecOf = r => { const x = extraOf(r) || {}; return x.fbRec || {days: x.fb || {}}; };

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
// the duplicate accounts are on the Trainee Audit: redraw whichever page shows them
const redraw = () => { if(isSheetTab()) repaint(); else if(state.view === "admin" && typeof render === "function") render(); };
const isSheetTab = () => ["batchsheet", "audit", "rankings"].includes(state.adminTab || "batchsheet");
function ready(ppl){
  const missingRows = ppl.some(r => !extraOf(r));
  // (once at a time, and not again within 5 s: a failed read doesn't loop)
  // (held back by the 5 s: try again when it is up, once)
  if(missingRows && !B.rowsP && Date.now() - (B.rowsAt || 0) <= 5000 && !B.rowsRetry) B.rowsRetry = setTimeout(() => { B.rowsRetry = null; repaint(); }, 5200 - (Date.now() - (B.rowsAt || 0)));
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
  const c = {rec: r, cf: r.caseFlow || {days: {}}, data: dataOf(r), callsim: x.callsim, sim: x.sim, fb: fbRecOf(r)};
  try{ return window.cmScorecard.compute(c); }catch(e){ return null; }
}
const summaryOf = r => { try{ return typeof auditSummary === "function" ? auditSummary(r) : null; }catch(e){ return null; } };

/* ---------- the tables: {id, title, note, head, rows: [[{v, f, cls}]], onRow, rowCls} ---------- */
/* 👥 DUPLICATE ACCOUNTS, as Foundational's (its dupGroups / dupMerge): one person with two accounts. A trainee's account id is
   their name + batch (worker.js candidateIds), so the same person coming in with the name or Batch ID written another way
   (the Portal's form of it, a retyped batch) gets a second, empty account. Each account shows its id, the batch as saved,
   when it registered and was last on, and how much it holds; the trainer keeps one and 👥 Merge moves everything of the
   other into it (each field the kept one lacks is filled from the other; lists joined, without repeats; on a clash the kept
   one's value stays), deletes the other's records and leaves merged:<other id> = {into}, so a sign-in that would open it
   opens the kept one, and a page still open on it can't save to it (worker.js traineeSession and traineeWrite). */
const slugOfName = t => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
const MERGE_KEYS = id => [`trainee:${id}`, `progress:${id}`, `feedback:${id}`, `focus:${id}`, `actsub:${id}`];
function mergeVals(a, b){
  if(a === undefined || a === null || a === "") return b === undefined ? a : b;
  if(b === undefined || b === null || b === "") return a;
  if(Array.isArray(a) && Array.isArray(b)){ const seen = new Set(a.map(x => JSON.stringify(x))); return a.concat(b.filter(x => !seen.has(JSON.stringify(x)))); }
  if(typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)){ const out = Object.assign({}, a); Object.keys(b).forEach(k => { out[k] = mergeVals(a[k], b[k]); }); return out; }
  return a;
}
function dupGroups(){
  const live = (state.adminData || []).filter(r => r && r.name && !r.rejected && !r.archived && !r.mergedInto), by = {};
  live.forEach(r => { const k = slugOfName(nameOf(r)); (by[k] = by[k] || []).push(r); });
  const shown = new Set(people().map(r => r.id));
  return Object.entries(by).filter(([, g]) => g.length > 1 && g.some(r => shown.has(r.id))).map(([k, g]) => ({key: k, accts: g.map(r => {
    const a = summaryOf(r) || {seen: 0, kcPassed: 0};
    return {r, id: r.id, batch: r.batch || "", reg: r.registeredAt || "", last: r.lastActive || "", seen: a.seen || 0, kc: a.kcPassed || 0, st: r.approved === true ? "Approved" : "Waiting"};
  }).sort((a, b) => (b.kc - a.kc) || (b.seen - a.seen) || String(b.last).localeCompare(String(a.last)))}));
}
function dupHtml(){
  const G = dupGroups(); if(!G.length) return "";
  B.dupKeep = B.dupKeep || {};
  return `<div class="bs-dup"><b>👥 ${G.length === 1 ? `${E(nameOf(G[0].accts[0].r))} has ${G[0].accts.length} accounts` : `${G.length} trainees have more than one account`}</b>
    <p>The same person came in with their name or Batch ID written another way, so a second account was made. Keep the one with their work; 👥 Merge moves everything of the other into it and deletes it, and a sign-in to the other then opens the one kept.</p>
    ${G.map(g => { const keep = B.dupKeep[g.key] && g.accts.some(a => a.id === B.dupKeep[g.key]) ? B.dupKeep[g.key] : g.accts[0].id;
      return `<table class="bs-dup-t"><thead><tr><th>Keep</th><th>Account id</th><th>Batch as saved</th><th>Registered</th><th>Last on</th><th>Slides seen</th><th>Checks passed</th><th>Status</th></tr></thead><tbody>
        ${g.accts.map(a => `<tr${a.id === keep ? ' class="on"' : ""}><td><input type="radio" name="dup-${E(g.key)}" ${a.id === keep ? "checked" : ""} onchange="cmBatchSheet.dupKeep('${E(g.key)}', '${E(a.id)}')"></td>
          <td><code>${E(a.id)}</code></td><td><code>${E(a.batch)}</code></td><td>${a.reg ? E(dTime(a.reg)) : "—"}</td><td>${a.last ? E(ago(a.last)) : "—"}</td><td>${a.seen}</td><td>${a.kc}</td><td>${a.st}</td></tr>`).join("")}</tbody></table>
        <button class="btn btn-navy btn-sm" type="button" ${B.dupBusy ? "disabled" : ""} onclick="cmBatchSheet.dupMerge('${E(g.key)}')">${B.dupBusy === g.key ? "Merging…" : `👥 Merge into ${E(keep)}`}</button>`; }).join("")}</div>`;
}
async function dupMerge(key){
  if(!state.isAdmin || B.dupBusy) return;
  const g = dupGroups().find(x => x.key === key); if(!g) return;
  const keep = B.dupKeep && g.accts.some(a => a.id === B.dupKeep[key]) ? B.dupKeep[key] : g.accts[0].id, others = g.accts.filter(a => a.id !== keep);
  if(!confirm(`Keep ${nameOf(g.accts[0].r)}'s account ${keep} and merge ${others.map(a => a.id).join(", ")} into it?\n\nEverything the other account holds (progress, Knowledge Checks, feedback, Focus, scores) moves into the one kept, and the other account is deleted. A sign-in to it opens the kept one.`)) return;
  B.dupBusy = key; redraw(); let ok = 0, err = "";
  for(const o of others){
    try{
      const fromK = MERGE_KEYS(o.id), intoK = MERGE_KEYS(keep), vals = await sharedGetMany(fromK.concat(intoK));
      // (nothing is deleted unless both accounts were read: a failed read returns nothing, which must never pass for "empty")
      if(!vals[0] || !vals[fromK.length]) throw new Error("couldn't read both accounts");
      for(let i = 0; i < fromK.length; i++){
        const b = vals[i], a = vals[i + fromK.length]; if(b == null) continue;
        let v = mergeVals(a, b);
        if(i === 0) v = Object.assign({}, v, {id: keep, name: (a && a.name) || b.name, batch: (a && a.batch) || b.batch, approved: !!((a && a.approved === true) || b.approved === true),
          registeredAt: [a && a.registeredAt, b.registeredAt].filter(Boolean).sort()[0] || "", lastActive: [a && a.lastActive, b.lastActive].filter(Boolean).sort().pop() || "", mergedFrom: ((a && a.mergedFrom) || []).concat(o.id)});
        if(await sharedSet(intoK[i], v) === false) throw new Error("save refused");
      }
      if(await sharedSet("merged:" + o.id, {into: keep, at: new Date().toISOString()}) === false) throw new Error("save refused");
      for(const k of fromK) await sharedDelete(k);
      ok++;
    }catch(e){ err = e && e.message || "no connection"; }
  }
  B.dupBusy = null; B.extra = {}; B.rowsAt = 0; if(state.auditExtra) Object.keys(state.auditExtra).forEach(k => delete state.auditExtra[k]);
  if(typeof toast === "function") toast(ok === others.length ? `✓ Merged: one account for ${nameOf(g.accts[0].r)} (${keep}).` : `Couldn't merge every account (${err}). Try again.`);
  if(typeof refreshAdminData === "function") refreshAdminData(); else render();
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
    head: ["Trainee", "Overall %", "Rank", "Days passed"].concat(S.map(s => `${s.icon} ${s.label}`)),
    rows: rows.map(x => [{v: nameOf(x.r), f: nameOf(x.r), cls: "gs-name"},
        {v: pct(x.sc.overall), f: x.sc.overall == null ? "Nothing graded yet" : `The average of ${x.sc.systems} grading systems = ${x.sc.overall}%`, cls: "gs-num gs-calc gs-bold " + tone(x.sc.overall)},
        {v: x.rank == null ? "" : String(x.rank), f: x.rank == null ? "Not ranked: nothing graded yet" : `Rank ${x.rank} of ${order.length}`, cls: "gs-rank"},
        {v: `${x.sc.done} / ${x.sc.total}`, f: `${x.sc.done} of the ${x.sc.total} days passed`, cls: "gs-num"}]
      .concat(x.sc.rows.map(y => ({v: pct(y.avg), f: y.avg == null ? `${y.s.label}: nothing graded yet` : `${y.s.label}: average of ${y.items.length} = ${y.avg}%`, cls: "gs-num " + tone(y.avg)})))),
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
function recentTable(ppl){
  const out = [], since = B.recent ? Date.now() - B.recent * 864e5 : 0;
  const push = (r, at, what, detail, score) => { const d = T0(at); if(d && (!since || +d >= since)) out.push({r, at: d, what, detail: detail || "", score: num(score)}); };
  ppl.forEach(r => {
    push(r, r.registeredAt, "Registered", labelOf(keyOf(r)));
    const data = dataOf(r), dp = data["day-progress"] || r.dayProgress || {};
    days().forEach(d => { const p = dp[d.id]; if(p && typeof p.score === "number") push(r, p.date || p.at, "Knowledge Check", dayLabel(d), p.score); });
    (data["work-log"] || []).forEach(w => { if(!w || w.kind === "quiz") return;
      push(r, w.at, w.kind === "lab" ? "Skill Activity" : w.kind === "roleplay" ? "Call practice" : w.kind === "task" ? "Random task" : "Practice", w.label, typeof w.score === "number" ? w.score : null); });
    const tname = t => clip(typeof t.task === "string" ? t.task : (t.task && (t.task.title || t.task.name)) || "", 120);
    (data["task-log"] || []).forEach(t => { if(t && t.status === "resolved") push(r, t.submittedAt || t.resolvedAt, "Random task resolved", tname(t), t.score); else if(t && t.status === "missed") push(r, t.expiresAt, "Random task missed", tname(t), 0); });
    const lv = data["last-view"]; if(lv && lv.at) push(r, lv.at, "Opened", lv.view === "day" ? `Day ${lv.dayId}` : lv.view === "tool" ? `Skill Builder ${lv.toolId || ""}` : String(lv.view || ""));
  });
  out.sort((a, b) => b.at - a.at);
  return {id: "recent", title: "🕒 Recent progress", note: `Everything they did${B.recent ? ` in the last ${B.recent} days` : ""}, newest first.`,
    head: ["When", "Trainee", "What", "Detail", "Score"],
    rows: out.slice(0, 300).map(x => [{v: dTime(x.at), f: x.at.toLocaleString(), cls: ""}, {v: nameOf(x.r), f: nameOf(x.r), cls: "gs-name"}, {v: x.what, f: x.what}, {v: x.detail, f: x.detail, cls: "gs-txt"}, {v: pct(x.score), f: pct(x.score), cls: "gs-num " + tone(x.score)}]),
    empty: "Nothing in this period."};
}

/* ============================================================
   📅 DAY BY DAY and 🏅 SCORE CARD, as Foundational's (its dayDeliverables / scoreCardTable): each Case Flow day's graded
   deliverables, a trainee at a time, with 🧾 why it was scored that way, ⭐ what they did best and 🔧 what to improve.
   A day's deliverables: ✍️ its Knowledge Check, 🧩 its modules' Learning Checks, 📝 its Takeaways, 🧪 its Skill Activities
   and 📞 graded calls (the work log), 🎲 its random tasks, 📂 its Backup Drive grade, and 💬 the trainer's feedback on it.
   ============================================================ */
const avgOf = xs => { const v = xs.filter(x => typeof x === "number" && isFinite(x)); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
const clip = (s, n) => { s = String(s == null ? "" : s).replace(/\s+/g, " ").trim(); return s.length > n ? s.slice(0, n - 1) + "…" : s; };
const cfDaysL = () => days().filter(d => d.cf);
function modNames(){
  if(B.mods) return B.mods; const out = {}, CF = window.CM_CASE_FLOW;
  if(CF && CF.days) CF.days.forEach(d => (d.modules || []).forEach(m => { out[m.id] = m.title; }));
  return (B.mods = out);
}
// a trainer's sent review only: what a trainee's page writes is stored auto (the auto-review), and never reads as the trainer's remark
const fbOf = (r, d) => { const f = (((extraOf(r) || {}).fb) || {})[d.id]; return f && f.status === "sent" && (!f.auto || f.editedByTrainer) ? f : null; };
const ratingTone = s => /strong|excellent|exceed/i.test(s || "") ? "gs-hi" : /need|below|not yet|concern/i.test(s || "") ? "gs-lo" : s ? "gs-mid" : "";
// the day's deliverables: {grp, name, pct, status, why, best[], improve[]}
function dayParts(r, d){
  const data = dataOf(r), n = d.cf.n, out = [], cfd = ((r.caseFlow || {}).days || {})[n] || {};
  const dp = (data["day-progress"] || r.dayProgress || {})[d.id] || {}, wl = Array.isArray(data["work-log"]) ? data["work-log"] : [];
  // ✍️ the Knowledge Check (its last attempt's missed questions are what to improve)
  const kc = num(cfd.kc != null ? cfd.kc : dp.score), quiz = wl.filter(w => w && w.kind === "quiz" && Number(w.dayId) === Number(d.id)).pop();
  const tries = (dp.history || []).length || dp.kcAttempts || (kc != null ? 1 : 0);
  if(kc != null || tries) out.push({grp: "kc", name: "✍️ Knowledge Check", pct: kc, status: kc == null ? "Not taken" : kc >= 70 ? "Passed" : "Not passed yet",
    why: kc == null ? "" : `${kc}% best of ${tries} attempt${tries === 1 ? "" : "s"}${quiz && quiz.total ? ` · last attempt ${quiz.correct}/${quiz.total} correct` : ""}. 70% passes the day.`,
    best: [], improve: ((quiz && quiz.missed) || []).slice(0, 4).map(q => "Missed: " + clip(q, 160))});
  else out.push({grp: "kc", name: "✍️ Knowledge Check", pct: null, status: "Not taken", why: "", best: [], improve: []});
  // 🧩 the modules' Learning Checks (AI × 0.60 + trainer × 0.40)
  const names = modNames();
  Object.entries(cfd.modules || {}).forEach(([id, s]) => { const c = num(s.c != null ? s.c : s.a);
    out.push({grp: "lc", name: `🧩 Learning Check: ${names[id] || id}`, pct: c, status: s.c != null ? "Scored" : "Awaiting the trainer's 40%",
      why: `Automated ${pct(num(s.a)) || "—"} × 0.60 + trainer ${pct(num(s.t)) || "—"} × 0.40${s.c == null ? ". Until the trainer scores it, the automated half counts." : ` = ${c}%`}`, best: [], improve: []}); });
  // 📝 Takeaways
  const tk = num(cfd.takeaway != null ? cfd.takeaway : dp.takeaway);
  if(tk != null) out.push({grp: "tk", name: "📝 Takeaways", pct: tk, status: "AI-graded", why: "The day's Knowledge Check answers in their own words, AI-graded.", best: [], improve: []});
  // 🧪 Skill Activities and 📞 calls: the latest attempt of each
  const latest = {}; wl.filter(w => w && (w.kind === "lab" || w.kind === "roleplay") && Number(w.dayId) === Number(d.id) && typeof w.score === "number")
    .forEach(w => { const k = w.kind + "|" + (w.label || w.toolId); if(!latest[k] || String(w.at) > String(latest[k].at)) latest[k] = w; });
  Object.values(latest).forEach(w => { const subs = Object.entries(w.subs || {}).map(([k, v]) => `${k} ${v}%`).join(", ");
    out.push({grp: w.kind === "lab" ? "sa" : "call", name: `${w.kind === "lab" ? "🧪" : "📞"} ${clip(w.label || "Skill Activity", 90)}`, pct: num(w.score), status: w.tier || "",
      why: [w.tier, subs ? "rubric: " + subs : "", w.at ? "graded " + dTime(w.at) : ""].filter(Boolean).join(" · "),
      best: (w.strengths || []).map(x => clip(x, 200)), improve: (w.gaps || []).concat(w.growth || []).map(x => clip(x, 200))}); });
  // 🎲 random tasks of the day (a missed one counts 0)
  (Array.isArray(data["task-log"]) ? data["task-log"] : []).filter(t => t && Number(t.dayId) === Number(d.id)).forEach(t => {
    const missed = t.status === "missed" || ((t.status === "new" || t.status === "progress") && t.expiresAt && Date.now() > Date.parse(t.expiresAt));
    const sc = t.status === "resolved" && typeof t.score === "number" ? num(t.score) : missed ? 0 : null;
    out.push({grp: "rt", name: `🎲 Random task: ${clip(typeof t.task === "string" ? t.task : (t.task && (t.task.title || t.task.name)) || "", 70)}`, pct: sc,
      status: t.status === "resolved" ? (t.tier || "Resolved") : missed ? "Missed" : "Open", why: t.status === "resolved" ? `Resolved ${dTime(t.submittedAt || t.resolvedAt)}${t.tier ? " · " + t.tier : ""}` : missed ? "Not resolved before the timer ended: counts 0" : "Still open", best: [], improve: []}); });
  // 📂 Backup Drive
  const bd = n === 1 ? data["drive-setup"] : (data["drive-grades"] || {})[n];
  if(bd && typeof bd.score === "number") out.push({grp: "bd", name: n === 1 ? "📂 Backup Drive: the firm's folders" : "📂 Backup File Maintenance", pct: num(bd.score),
    status: (n === 1 ? bd.ok : bd.passed) ? "Passed" : "Below 70%", why: `Read from the trainee's Drive${bd.attempts ? ` · attempt ${bd.attempts}` : ""}${bd.at ? " · " + dTime(bd.at) : ""}`, best: [], improve: (bd.issues || bd.problems || []).slice ? (bd.issues || bd.problems || []).slice(0, 4).map(x => clip(typeof x === "string" ? x : JSON.stringify(x), 200)) : []});
  // 🗂 the CMS case file (js/cm-cms-file.js): the day's file, graded against what a correct CMS file holds by then
  try{ if(window.cmCmsFile){ const x = cmCmsFile.compute({rec: r, cf: r.caseFlow || {days: {}}, data}).days.find(y => y.n === n);
    if(x && x.pct != null){ const miss = []; x.areas.forEach(a => a.items.filter(i => i.pending || i.pct === 0).forEach(i => miss.push(`${a.a.label}: ${clip(i.name || String(i.text || "").replace(/\*\*/g, ""), 120)}`)));
      out.push({grp: "cmsf", name: "🗂 CMS case file", pct: x.pct, status: x.missing ? `${x.missing} missing` : "Complete", why: x.areas.filter(a => a.pct != null).map(a => `${a.a.label} ${a.pct}%`).join(" · "), best: [], improve: miss.slice(0, 5)}); } } }catch(e){}
  // 💬 the trainer's feedback (sent only), with its 📐 rubric score when the trainer gave one
  const f = fbOf(r, d), rb = f && window.cmRubric && cmRubric.counts(f) ? cmRubric.total(f.rubric) : null;
  if(f) out.push({grp: "fb", name: rb != null ? "📐 Trainer rubric & feedback" : "💬 Trainer feedback", pct: rb, status: f.rating || "Sent", why: clip(f.summary || "", 420), best: (f.strengths || []).map(x => clip(x, 200)), improve: (f.areasToBuild || []).map(x => clip(x, 200))});
  return out;
}
const dayAvg = xs => avgOf(xs.map(x => x.pct));

// 🏅 Score Card: a group of columns per day
const SC_COLS = [["kc", "✍️ Knowledge Check"], ["lc", "🧩 Learning Checks"], ["tk", "📝 Takeaways"], ["sa,call", "🧪 Activities & calls"], ["rt", "🎲 Random tasks"], ["bd", "📂 Backup Drive"], ["cmsf", "🗂 CMS file"], ["fb", "📐 Trainer rubric"]];
function scoreCardTable(ppl){
  const L = cfDaysL(), P = SC_COLS.map(c => c[1]).concat(["Average", "💬 Remarks"]);
  return {id: "scorecard", title: "🏅 Score Card", note: "Each trainee's scores, day by day: the Knowledge Check, the Learning Checks, the Takeaways, the graded Skill Activities and calls, the random tasks and the Backup Drive, the day's Average, and the trainer's remarks. Hover a cell for how it was worked out. Blank: nothing scored yet.",
    groups: [{label: "", span: 2}].concat(L.map(d => ({label: `${dayLabel(d)} · ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`, span: P.length}))),
    head: ["Trainee", "Overall"].concat(...L.map(() => P)),
    rows: ppl.map(r => { const S = L.map(d => dayParts(r, d)), avgs = S.map(dayAvg), all = avgOf(avgs);
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: pct(all), f: all == null ? "Nothing scored yet" : `The average of the days' averages = ${all}%`, cls: "gs-num gs-calc gs-bold " + tone(all)}]
        .concat(...S.map((xs, i) => { const nm = dayLabel(L[i]), f = fbOf(r, L[i]);
          return SC_COLS.map(([g, l]) => { const gs = g.split(","), its = xs.filter(x => gs.includes(x.grp) && x.pct != null), a = avgOf(its.map(x => x.pct));
              return {v: pct(a), f: a == null ? `${nm} · ${l}: nothing scored yet` : `${nm} · ${l}: ${its.map(x => `${x.name.replace(/^\S+\s/, "")} ${x.pct}%`).join("; ")}${its.length > 1 ? ` = ${a}%` : ""}`, cls: "gs-num " + tone(a)}; })
            .concat([{v: pct(avgs[i]), f: avgs[i] == null ? `${nm}: nothing to average yet` : `${nm} · Average of ${xs.filter(x => x.pct != null).length} scored deliverables = ${avgs[i]}%`, cls: "gs-num gs-calc gs-bold " + tone(avgs[i])},
              {v: f ? (f.rating || "Sent") : "", f: f ? `${nm} · Trainer: ${f.rating || ""}${f.summary ? " — " + clip(f.summary, 400) : ""}` : `${nm}: no feedback sent yet`, cls: "gs-txt " + (f ? ratingTone(f.rating) : "")}]); }));
    })};
}
// 📅 Day by Day: a column per day (the average of its scored deliverables)
function dayTable(ppl){
  const L = cfDaysL();
  return {id: "days", title: "📅 Day by Day", note: "Each trainee's score for each Case Flow day: the average of the day's scored deliverables. A day with work but nothing scored yet shows how many are done. Hover a cell for each deliverable; pick a trainee under the table for every deliverable's score, why, what they did best and what to improve.",
    head: ["Trainee", "Average"].concat(L.map(d => `${dayLabel(d)}. ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`)),
    rows: ppl.map(r => { const per = L.map(d => dayParts(r, d)), avgs = per.map(dayAvg), a = avgOf(avgs);
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: pct(a), f: a == null ? "Nothing scored yet" : `The average of the days = ${a}%`, cls: "gs-num gs-calc gs-bold " + tone(a)}]
        .concat(L.map((d, i) => { const xs = per[i], sc = xs.filter(x => x.pct != null);
          return {v: avgs[i] != null ? `${avgs[i]}% · ${sc.length} scored` : "", f: `${dayLabel(d)}: ` + (xs.length ? xs.map(x => `${x.name.replace(/^\S+\s/, "")} ${x.pct != null ? x.pct + "%" : x.status || "—"}`).join(" · ") : "nothing yet"), cls: "gs-num " + tone(avgs[i])}; }));
    }),
    onRow: ppl.map(r => `cmBatchSheet.dsWho('${E(r.id)}')`), rowCls: ppl.map(r => B.ds === r.id ? "gs-picked" : "")};
}
function dayDetailHtml(ppl){
  if(!ppl.length) return "";
  const id = ppl.some(r => r.id === B.ds) ? B.ds : ppl[0].id, r = ppl.find(x => x.id === id);
  const li = (h, xs, cls) => xs.length ? `<div class="bs-ctx ${cls}"><b>${h}</b><ul>${xs.map(x => `<li>${E(x)}</li>`).join("")}</ul></div>` : "";
  return `<section class="bs-sec bs-ds" id="bs-dsdetail"><h3 class="bs-h">🔎 Detailed scores <label class="bs-ck-who">for <select onchange="cmBatchSheet.dsWho(this.value)">${ppl.map(x => `<option value="${E(x.id)}" ${x.id === id ? "selected" : ""}>${E(nameOf(x))}</option>`).join("")}</select></label></h3>
    <div class="bs-ds-days">${cfDaysL().map(d => { const xs = dayParts(r, d), a = dayAvg(xs), open = B.dsOpen[d.id] != null ? B.dsOpen[d.id] : a != null;
      return `<details class="bs-ds-day" data-day="${d.id}"${open ? " open" : ""} ontoggle="cmBatchSheet.dsOpen(${d.id}, this.open)"><summary><b>${dayLabel(d)}</b> <span>${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</span><em class="${tone(a)}">${a != null ? a + "%" : `${xs.filter(x => x.pct != null || /Passed|Sent|Resolved/.test(x.status)).length}/${xs.length} done`}</em></summary>
        ${xs.map(x => { const rich = x.pct != null || x.best.length || x.improve.length;
          return `<div class="bs-ds-it"><div class="bs-ds-h"><span>${E(x.name)}</span><small>${E(x.status || "")}</small><b class="${x.pct != null ? tone(x.pct) : ratingTone(x.grp === "fb" ? x.status : "")}">${x.pct != null ? x.pct + "%" : "—"}</b></div>
            ${rich || x.why ? `<div class="bs-ctx bs-why"><b>🧾 Why this score</b><p>${E(x.why || "—")}</p></div>` : ""}${li("⭐ What they did best", x.best, "bs-best")}${li("🔧 What needs to be improved", x.improve, "bs-imp")}</div>`; }).join("")}</details>`; }).join("")}</div></section>`;
}

/* ============================================================
   🧮 GRADING SYSTEMS: a sheet per grading system (the Scorecard's own, js/cm-scorecard.js), each with its own metrics
   beside its items: a row per trainee, the system's Average and Graded, the system's own counts, then a column per item.
   ============================================================ */
function ctxFor(r){ const x = B.extra[r.id] || {}; return {rec: r, cf: r.caseFlow || {days: {}}, data: dataOf(r), callsim: x.callsim, sim: x.sim, fb: fbRecOf(r)}; }
const cnt = (v, f, cls) => ({v: v == null ? "" : String(v), f: f || "", cls: "gs-num " + (cls || "")});
const EXTRA = {
  kc: {head: ["Passed", "Attempts"], cells: (r, c, items) => { const dp = c.rec.dayProgress || {}, n = cfDaysL().length, p = items.filter(i => i.pct >= 70).length;
    const a = cfDaysL().reduce((s, d) => s + (((dp[d.id] || {}).history || []).length || ((dp[d.id] || {}).score != null ? 1 : 0)), 0);
    return [cnt(`${p} / ${n}`, `${p} of ${n} days passed (70%)`, p === n ? "gs-hi" : ""), cnt(a, `${a} Knowledge Check attempts in all`)]; }},
  lc: {head: ["Trainer-scored", "Awaiting trainer"], cells: (r, c, items) => { const w = items.filter(i => i.auto).length;
    return [cnt(`${items.length - w} / ${items.length}`, "Learning Checks with the trainer's 40% in"), cnt(w || "", `${w} awaiting the trainer's 40%`, w ? "gs-mid" : "")]; }},
  sa: {head: ["Accuracy", "Presence", "Risk", "Efficiency"], cells: (r, c) => { const wl = (c.data["work-log"] || []).filter(w => w && w.kind === "lab" && w.subs);
    return ["accuracy", "presence", "risk", "efficiency"].map(k => { const a = avgOf(wl.map(w => w.subs[k])); return {v: pct(a), f: a == null ? "" : `Average ${k} across ${wl.length} graded attempts = ${a}%`, cls: "gs-num " + tone(a)}; }); }},
  cms: {head: ["Filed", "First time right"], cells: (r, c) => { const xs = Object.values(c.data["doc-filing"] || {}).filter(x => x && x.attempts > 0), f = xs.filter(x => x.filed).length, ft = xs.filter(x => x.filed && x.attempts === 1).length;
    return [cnt(`${f} / ${xs.length}`, `${f} of ${xs.length} documents filed`), cnt(ft, `${ft} filed right on the first attempt`)]; }},
  bd: {head: ["Passed"], cells: (r, c, items) => { const p = items.filter(i => i.pct >= 70).length; return [cnt(`${p} / ${items.length}`, `${p} of ${items.length} graded days at 70% or more`)]; }},
  ns: {head: ["Checks passed"], cells: (r, c) => { let p = 0, t = 0; Object.values((c.data["net-sheet"] || {}).files || {}).forEach(f => Object.values((f && f.checks) || {}).forEach(k => { if(k && k.total){ p += k.passed; t += k.total; } }));
    return [cnt(t ? `${p} / ${t}` : "", `${p} of ${t} Net Sheet checks passed`)]; }},
  sb: {head: ["Tools used", "Runs"], cells: (r, c) => { const pp = c.data["practice-progress"] || c.rec.practiceProgress || {}, xs = Object.values(pp).filter(v => v && v.runs);
    return [cnt(`${xs.length} / ${tools().length}`, "Skill Builders used"), cnt(xs.reduce((s, v) => s + v.runs, 0) || "", "Runs in all")]; }},
  gc: {head: ["Calls"], cells: (r, c) => { const n = Object.values((c.callsim && c.callsim.best) || {}).reduce((s, b) => s + ((b && b.calls) || 0), 0); return [cnt(n || "", `${n} graded calls on the Call Simulator`)]; }},
  cc: {head: ["Calls", "Missed injected"], cells: (r, c) => { const h = (c.data.roleplayHistory || []).filter(x => x && x.categoryId === "caseflow" && typeof x.score === "number").length;
    const m = Object.values(((c.data["case-flow"] || {}).injects) || {}).filter(x => x && x.outcome === "missed").length; return [cnt(h || "", `${h} graded case calls`), cnt(m || "", `${m} injected calls missed`, m ? "gs-lo" : "")]; }},
  ps: {head: ["Runs"], cells: (r, c) => { const n = Object.values((c.sim && c.sim.best) || {}).reduce((s, b) => s + ((b && b.count) || 1), 0); return [cnt(n || "", `${n} simulator runs`)]; }},
  rt: {head: ["Received", "Resolved", "Missed", "Open"], cells: (r, c) => { const tl = (c.data["task-log"] || []).filter(Boolean);
    const miss = tl.filter(t => t.status === "missed" || ((t.status === "new" || t.status === "progress") && t.expiresAt && Date.now() > Date.parse(t.expiresAt))).length, res = tl.filter(t => t.status === "resolved").length;
    return [cnt(tl.length || "", "Random tasks received"), cnt(res || "", "Resolved", res ? "gs-hi" : ""), cnt(miss || "", "Missed (counts 0)", miss ? "gs-lo" : ""), cnt((tl.length - res - miss) || "", "Still open")]; }}
};
function systemTable(ppl, s){
  const per = ppl.map(r => { const c = ctxFor(r); let items = []; try{ items = (s.items(c) || []).filter(x => x && x.pct != null); }catch(e){ items = []; } return {r, c, items}; });
  const cols = []; per.forEach(p => p.items.forEach(i => { if(!cols.includes(i.name)) cols.push(i.name); }));
  if(/^(kc|tk|bd)$/.test(s.id)) cols.sort((a, b) => (parseInt(a.replace(/\D+/, ""), 10) || 0) - (parseInt(b.replace(/\D+/, ""), 10) || 0));
  const X = EXTRA[s.id] || {head: [], cells: () => []};
  return {id: "sys", title: `${s.icon} ${s.label}`, note: s.about + " Each trainee's Average and how many are graded, this system's own counts, then a column per item (hover for its detail). Blank: not graded yet.",
    head: ["Trainee", "Average", "Graded"].concat(X.head, cols),
    rows: per.map(({r, c, items}) => { const a = avgOf(items.map(i => i.pct));
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: pct(a), f: a == null ? "Nothing graded yet" : `The average of ${items.length} = ${a}%`, cls: "gs-num gs-calc gs-bold " + tone(a)}, cnt(items.length || "", `${items.length} graded`)]
        .concat(X.cells(r, c, items), cols.map(n => { const i = items.find(x => x.name === n); return i ? {v: pct(i.pct), f: `${n}: ${i.pct}%${i.note ? " · " + i.note : ""}`, cls: "gs-num " + tone(i.pct)} : {v: "", f: `${n}: not graded yet`}; })); }),
    empty: "No trainee here yet."};
}
function systemsHtml(ppl){
  const S = (window.cmScorecard && cmScorecard.sources) || []; if(!S.length) return "";
  const cur = S.find(s => s.id === B.sys) || S[0];
  return `<div class="bs-sys" id="bs-systems"><h3 class="bs-h">🧮 Grading systems <span>each with its own metrics</span></h3><div class="bs-view">${S.map(s => `<button class="${s === cur ? "on" : ""}" onclick="cmBatchSheet.sys('${s.id}')">${s.icon} ${E(s.label)}</button>`).join("")}</div></div>` + sheetHtml(systemTable(ppl, cur));
}

/* ---------- drawing: Google Sheets' look, the same classes the Scorecard uses (js/cm-scorecard.js .scx-card) ---------- */
function sheetHtml(T){
  const n = T.head.length;
  return `<section class="bs-sec" id="bs-${T.id}"><h3 class="bs-h">${E(T.title)} <span>${T.rows.length} row${T.rows.length === 1 ? "" : "s"}</span></h3>${T.note ? `<p class="bs-note">${E(T.note)}</p>` : ""}
    <div class="gs-wrap"><table class="gs" role="grid"><thead>
      <tr class="gs-letters"><th class="gs-corner"></th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${letter(i)}</th>`).join("")}</tr>
      ${T.groups ? `<tr class="gs-groups"><th class="gs-rn"></th>${T.groups.map((g, i) => `<th colspan="${g.span}" class="${i === 0 ? "gs-frz" : ""}">${E(g.label)}</th>`).join("")}</tr>` : ""}
      <tr class="gs-head"><th class="gs-rn">1</th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${E(h)}</th>`).join("")}</tr></thead>
      <tbody>${T.rows.map((r, ri) => `<tr${T.rowCls && T.rowCls[ri] ? ` class="${T.rowCls[ri]}"` : ""}${T.onRow && T.onRow[ri] ? ` onclick="${T.onRow[ri]}"` : ""}><th class="gs-rn">${ri + 2}</th>${r.map((c, ci) => `<td tabindex="0" class="${c.cls || ""}${ci === 0 ? " gs-frz" : ""}"${c.f ? ` title="${E(c.f)}"` : ""}>${c.html != null ? c.html : E(c.v)}</td>`).join("")}</tr>`).join("")}
      ${T.rows.length ? "" : `<tr class="gs-empty"><th class="gs-rn">2</th><td colspan="${n}" class="bs-none">${E(T.empty || "No trainee here yet.")}</td></tr>`}</tbody></table></div></section>`;
}
let LAST = [];
// the page, as Foundational's, scores only: 🏅 Score Card, 📅 Day by Day (and a trainee's days in detail), 🏅 Scores (and the
// picked trainee's grades in detail), 🧮 Grading systems, 📚 Lessons, 🕒 Recent progress. LAST: every table, for ⬇ Download.
function tablesHtml(){
  const ppl = people();
  if(!ready(ppl)) return `<p class="bs-none scx-pad">Reading the batch's progress…</p>`;
  const sc = scoresTable(ppl), picked = sc.rowsRaw.find(x => x.r.id === B.pick), S = (window.cmScorecard && cmScorecard.sources) || [];
  const head = [scoreCardTable(ppl), dayTable(ppl)], tail = [lessonsTable(ppl), recentTable(ppl)];
  LAST = head.concat([sc], S.map(s => systemTable(ppl, s)), tail);
  return head.map(sheetHtml).join("") + dayDetailHtml(ppl) + sheetHtml(sc) + (picked ? sheetHtml(detailTable(picked)) : "") + systemsHtml(ppl) + tail.map(sheetHtml).join("");
}
function bannerHtml(){
  const keys = Array.from(new Set((state.adminData || []).filter(r => !r.rejected).map(keyOf))).sort((a, b) => typeof NO_BATCH !== "undefined" && a === NO_BATCH ? 1 : typeof NO_BATCH !== "undefined" && b === NO_BATCH ? -1 : a.localeCompare(b, undefined, {numeric: true}));
  const cur = state.adminBatchFilter || "", ppl = people();
  const waiting = (state.adminData || []).filter(r => r.approved !== true && !r.rejected && (!cur || keyOf(r) === cur)).length;
  return `<div class="ft-banner scx-banner"><div><p class="ft-banner-k">Legal Support Help · Case Management Training</p><h2>📋 Batch Sheet</h2>
      <p class="ft-banner-sub">${cur ? `Batch <b>${E(labelOf(cur))}</b>` : "All batches"} · refreshed automatically</p></div>
    <div class="ft-banner-right"><span>${ppl.length} trainee${ppl.length === 1 ? "" : "s"}</span>${waiting ? `<button type="button" class="bs-wait-pill" title="Approve or reject them in 🛡 Admin Master Control → 👥 Trainee Audit" onclick="state.auditStatus='pending';setAdminTab('traineeaudit')">${waiting} waiting for approval →</button>` : ""}</div>
    <div class="ft-banner-ctl"><span class="gs-menu"><label class="scx-bpick">Batch <select onchange="cmBatchSheet.batch(this.value)"><option value="">All batches</option>${keys.map(k => `<option value="${E(k)}" ${k === cur ? "selected" : ""}>${E(labelOf(k))}</option>`).join("")}</select></label>
      <button onclick="cmBatchSheet.csv()">⬇ Download</button><button onclick="cmBatchSheet.refresh()">↻ Refresh</button>
      <label class="scx-bpick bs-arch"><input type="checkbox" ${state.adminShowArchived ? "checked" : ""} onchange="setAdminShowArchived(this.checked)"> Show archived</label></span></div></div>`;
}
window.renderAdminBatchSheet = function(){
  if(state.adminLoading || !state.adminData) return `<div class="card" style="padding:40px;text-align:center;color:var(--ink-soft);">Loading the batches…</div>`;
  return `<div class="scx-page bs-page">${bannerHtml()}<div class="card gs-card scx-card" id="bsSheet">${tablesHtml()}</div></div>`;
};
function csv(){
  const q = v => { const s = String(v == null ? "" : v); return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; };
  if(!LAST.length) tablesHtml();
  const T = LAST;
  const lines = []; T.forEach(t => { lines.push(q(t.title)); lines.push(t.head.map(q).join(",")); t.rows.forEach(r => lines.push(r.map(c => q(c.v)).join(","))); lines.push(""); });
  const k = state.adminBatchFilter ? labelOf(state.adminBatchFilter) : "All batches";
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob([lines.join("\n")], {type: "text/csv"}));
  a.download = `Batch Sheet - ${k}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
window.cmBatchSheet = {
  batch(v){ B.pick = ""; if(typeof setAdminBatchFilter === "function") setAdminBatchFilter(v); else { state.adminBatchFilter = v; render(); } },
  dsWho(id){ B.ds = id; B.dsOpen = {}; repaint(); setTimeout(() => { const d = document.getElementById("bs-dsdetail"); if(d) d.scrollIntoView({behavior: "smooth", block: "start"}); }, 30); },
  dsOpen(d, open){ B.dsOpen[d] = open; },
  sys(id){ B.sys = id; repaint(); setTimeout(() => { const d = document.getElementById("bs-systems"); if(d) d.scrollIntoView({block: "start"}); }, 30); },
  // 👥 duplicate accounts: drawn on 🛡 Admin Master Control → 👥 Trainee Audit (js/cm-audit-table.js), not on the sheet
  dupHtml, dupKeep(key, id){ B.dupKeep = B.dupKeep || {}; B.dupKeep[key] = id; redraw(); },
  dupMerge,
  myOpen(id){ MY.open = MY.open === id ? null : id; render(); },
  pick(id){ B.pick = B.pick === id ? "" : id; repaint(); setTimeout(() => { const d = document.getElementById("bs-detail"); if(d && B.pick) d.scrollIntoView({behavior: "smooth", block: "start"}); }, 30); },
  refresh(){ B.extra = {}; B.rowsAt = 0; if(state.auditExtra) Object.keys(state.auditExtra).forEach(k => delete state.auditExtra[k]); if(typeof refreshAdminData === "function") refreshAdminData(); else render(); },
  csv
};

// a trainee's saves (↺ Reset Attempts, 📁 Assign a case…, the detail's own) redraw the row list: redraw the sheet too
const __rows = window.refreshAdminRows;
if(typeof __rows === "function") window.refreshAdminRows = function(){ const r = __rows.apply(this, arguments); repaint(); return r; };
function hookCompanion(){
  const c = window.cmCompanion; if(!c || c.__bs || typeof c.assign !== "function") return;
  const a = c.assign; c.assign = async function(){ const r = await a.apply(this, arguments); repaint(); return r; }; c.__bs = true;
}
setTimeout(hookCompanion, 0); document.addEventListener("DOMContentLoaded", hookCompanion);

/* ============================================================
   🏅 MY SCORE CARD (the trainee's dashboard, role-based): the Score Card's own day-by-day view with ONE trainee in it —
   the one signed in. It reads only what is theirs (their own progress on this device, their own Drive grades, and the
   feedback a trainer has SENT them, which the Worker gives a trainee without the trainer's private note): no other
   trainee, no batch, no rank. Only the kinds of score they actually have are columns; a day opens to each graded item
   with why it scored so, what they did best and what to improve.
   ============================================================ */
const MY = {open: null, loaded: false, setup: null, grades: null};
const isTraineeView = () => typeof state !== "undefined" && ((!!state.traineeId && !state.isAdmin) || !!state.adminPreview);
async function loadMine(){
  if(MY.loaded || MY.loading || typeof storeGet !== "function") return; MY.loading = true;
  try{ MY.setup = await storeGet("drive-setup"); MY.grades = await storeGet("drive-grades"); }catch(e){}
  MY.loaded = true; MY.loading = false; if(state.view === "dashboard") render();
}
function myRec(){
  let cf = {days: {}}; try{ if(window.cmCaseFlow && cmCaseFlow.scoreSummary) cf = cmCaseFlow.scoreSummary() || cf; }catch(e){}
  const prog = state.progress || {};
  return {id: state.traineeId || "me", name: state.traineeName || "Me", approved: true, dayProgress: prog, caseFlow: cf,
    __extra: {data: {"day-progress": prog, "work-log": Array.isArray(state.workLog) ? state.workLog : [], "task-log": Array.isArray(state.taskLog) ? state.taskLog : [],
      "drive-setup": MY.setup || null, "drive-grades": MY.grades || {}}, fb: state.myFeedback || {}}};
}
function myScoreCardHtml(){
  if(!isTraineeView()) return "";
  loadMine();
  const r = myRec(), L = cfDaysL(); if(!L.length) return "";
  const per = L.map(d => dayParts(r, d)), avgs = per.map(dayAvg), all = avgOf(avgs);
  // (only the kinds of score this trainee has: a column nobody can fill yet would only be noise)
  const cols = SC_COLS.filter(([g]) => per.some(xs => xs.some(x => g.split(",").includes(x.grp) && x.pct != null)));
  const cell = (xs, g) => { const gs = g.split(","), its = xs.filter(x => gs.includes(x.grp) && x.pct != null), a = avgOf(its.map(x => x.pct));
    return `<td class="${tone(a)}" title="${E(its.map(x => `${x.name.replace(/^\S+\s/, "")} ${x.pct}%`).join(" · "))}">${a == null ? "" : a + "%"}</td>`; };
  const li = (h, xs, cls) => xs.length ? `<div class="bs-ctx ${cls}"><b>${h}</b><ul>${xs.map(x => `<li>${E(x)}</li>`).join("")}</ul></div>` : "";
  const open = L.find(d => d.id === MY.open);
  return `<section class="card my-sc"><div class="my-sc-h"><h2>🏅 My Scores <span>day by day</span></h2>
      <span class="my-sc-all ${tone(all)}">${all == null ? "Nothing scored yet" : `Average ${all}%`}</span></div>
    <p class="my-sc-sub">Only your own scores, the same ones your trainer sees. Click a day for each graded item: why it scored that way, what you did best and what to improve.</p>
    <div class="my-sc-wrap"><table class="my-sc-t"><thead><tr><th>Day</th>${cols.map(([, l]) => `<th>${E(l)}</th>`).join("")}<th>Day average</th><th>💬 Trainer</th></tr></thead><tbody>
      ${L.map((d, i) => { const f = fbOf(r, d);
        return `<tr class="${MY.open === d.id ? "on" : ""}" onclick="cmBatchSheet.myOpen(${d.id})"><td class="my-sc-day"><b>${dayLabel(d)}</b><span>${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</span></td>
          ${cols.map(([g]) => cell(per[i], g)).join("")}<td class="my-sc-avg ${tone(avgs[i])}">${avgs[i] == null ? "—" : avgs[i] + "%"}</td>
          <td class="${f ? ratingTone(f.rating) : ""}">${f ? E(f.rating || "Sent") : ""}</td></tr>`; }).join("")}
    </tbody></table></div>
    ${open ? (() => { const xs = per[L.indexOf(open)];
      return `<div class="my-sc-detail"><h3>${dayLabel(open)} · ${E(String(open.title).replace(/^Case Flow Day \d+ · /, ""))}</h3>${xs.length ? xs.map(x => { const rich = x.pct != null || x.best.length || x.improve.length;
        return `<div class="bs-ds-it"><div class="bs-ds-h"><span>${E(x.name)}</span><small>${E(x.status || "")}</small><b class="${x.pct != null ? tone(x.pct) : ratingTone(x.grp === "fb" ? x.status : "")}">${x.pct != null ? x.pct + "%" : "—"}</b></div>
          ${rich || x.why ? `<div class="bs-ctx bs-why"><b>🧾 Why this score</b><p>${E(x.why || "—")}</p></div>` : ""}${li("⭐ What you did best", x.best, "bs-best")}${li("🔧 What to improve", x.improve, "bs-imp")}</div>`; }).join("") : `<p class="bs-none">Nothing graded on this day yet.</p>`}</div>`; })() : ""}
  </section>`;
}
if(typeof window.renderDashboard === "function" || typeof renderDashboard === "function"){
  const __dash = window.renderDashboard || renderDashboard;
  window.renderDashboard = renderDashboard = function(){ return __dash.apply(this, arguments) + myScoreCardHtml(); };
}

// the trainer's 🏅 Scorecards page (js/cm-scorecard.js: every trainee's card and the 100-point model) is its own tab beside
// the sheet: Admin → 🏅 Scorecard → 🏅 Scorecards (js/cm-admin-shell.js)

const css = document.createElement("style"); css.id = "cm-batch-sheet";
css.textContent = `
.bs-page{margin-bottom:22px;}
.bs-page .ft-banner{margin-bottom:12px;}
.bs-page .bs-wait-pill{background:#F6C08F !important;color:#1E2340 !important;border-color:#F6C08F !important;}
button.bs-wait-pill{cursor:pointer;font:800 14px Arial,sans-serif;border:1px solid;border-radius:999px;padding:4px 12px;}
.bs-page .gs-wrap{max-height:62vh;}
.scx-card td.bs-lesson{font-size:14px;}
/* headers wrap between words only (main's overflow-wrap:anywhere broke "Knowledg-e"); a column is as wide as its words */
.scx-card .gs th, .scx-card .gs td{overflow-wrap:normal !important;word-break:normal !important;hyphens:none;}
.scx-card .gs-head th{min-width:104px;max-width:180px;font-size:14.5px;}
.scx-card .gs-groups th{background:#1E2340;color:#fff;font:800 14px Arial,sans-serif;text-align:center;border-right:2px solid #fff;white-space:nowrap;}
.scx-card .gs-groups th.gs-frz{background:#1E2340;}
.bs-sys{padding:14px 14px 0;border-top:1px solid #E1E3E1;} .bs-sys + .bs-sec{border-top:0;padding-top:4px;}
.bs-view{display:flex;flex-wrap:wrap;gap:6px;margin:6px 0 4px;} .bs-view button{border:1px solid #C9CEDA;background:#fff;border-radius:999px;padding:6px 12px;cursor:pointer;font:700 13.5px Arial,sans-serif;color:#1E2340;}
.bs-view button.on{background:#1E2340;color:#fff;border-color:#1E2340;}
.bs-ds{padding:14px;} .bs-ck-who{font:700 15px Arial,sans-serif;margin-left:8px;} .bs-ck-who select{font:700 15px Arial,sans-serif;padding:4px 8px;border:1px solid #9AA3B5;border-radius:6px;}
.bs-ds-days{display:flex;flex-direction:column;gap:8px;margin-top:8px;}
.bs-ds-day{border:1px solid #C9CEDD;border-radius:10px;background:#fff;} .bs-ds-day > summary{cursor:pointer;padding:10px 14px;display:flex;gap:10px;align-items:center;font:700 15px Arial,sans-serif;color:#141A2E;}
.bs-ds-day > summary span{flex:1;color:#2E3450;} .bs-ds-day > summary em{font-style:normal;font-weight:800;padding:2px 10px;border-radius:999px;background:#EEF0F6;}
.bs-ds-day > summary em.gs-hi{background:#E6F4EA;color:#0B5D1E;} .bs-ds-day > summary em.gs-mid{background:#FFF4E0;color:#7A4B00;} .bs-ds-day > summary em.gs-lo{background:#FDE8E8;color:#A50E0E;}
.bs-ds-it{border-top:1px solid #E3E6EF;padding:10px 14px;} .bs-ds-h{display:flex;gap:10px;align-items:baseline;font:700 14.5px Arial,sans-serif;}
.bs-ds-h span{flex:1;} .bs-ds-h small{color:#5F6368;font-weight:600;} .bs-ds-h b{min-width:54px;text-align:center;padding:2px 8px;border-radius:6px;background:#F1F3F4;}
.bs-ds-h b.gs-hi{background:#E6F4EA;color:#0B5D1E;} .bs-ds-h b.gs-mid{background:#FFF4E0;color:#7A4B00;} .bs-ds-h b.gs-lo{background:#FDE8E8;color:#A50E0E;}
.bs-ctx{margin:6px 0 0;font:600 13.5px/1.45 Arial,sans-serif;color:#2E3450;} .bs-ctx b{display:block;color:#141A2E;} .bs-ctx p{margin:2px 0 0;} .bs-ctx ul{margin:2px 0 0 18px;padding:0;}
.bs-best b{color:#0B5D1E;} .bs-imp b{color:#A50E0E;}
.scx-card td.gs-act{white-space:normal !important;min-width:430px;cursor:default;}
.bs-acts{display:flex;flex-wrap:wrap;gap:6px;align-items:center;} .bs-acts .btn{padding:5px 10px;} .bs-acts select{max-width:220px;}
.cm-admin-screen .bs-recdetail .bs-h .btn, .bs-recdetail .bs-h .btn{margin-left:10px;vertical-align:middle;font-size:15px !important;padding:5px 12px;}
.scx-banner .gs-menu button.bs-danger{color:#A50E0E;}
.bs-arch input{width:18px;height:18px;}
.bs-settings{margin-top:14px;}
/* 🏅 My Score Card on the trainee's dashboard */
.my-sc{margin-top:16px;padding:18px 20px;background:#fff;border-radius:16px;color:#141A2E;}
.my-sc-h{display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap;} .my-sc-h h2{margin:0;font:800 24px 'Fraunces',Georgia,serif;color:#1E2340;} .my-sc-h h2 span{font:700 15px Arial,sans-serif;color:#5F6368;margin-left:6px;}
.my-sc-all{font:800 16px Arial,sans-serif;padding:5px 14px;border-radius:999px;background:#EEF0F6;} .my-sc-all.gs-hi{background:#E6F4EA;color:#0B5D1E;} .my-sc-all.gs-mid{background:#FFF4E0;color:#7A4B00;} .my-sc-all.gs-lo{background:#FDE8E8;color:#A50E0E;}
.my-sc-sub{margin:6px 0 12px;font:600 15px/1.5 Arial,sans-serif;color:#2E3450;}
.my-sc-wrap{overflow-x:auto;} .my-sc-t{width:100%;border-collapse:collapse;font:700 16px Arial,sans-serif;}
.my-sc-t th{background:#F4F5F9;color:#1E2340;font:800 14.5px Arial,sans-serif;padding:9px 10px;border-bottom:2px solid #D6DAE5;text-align:center;white-space:nowrap;}
.my-sc-t th:first-child{text-align:left;} .my-sc-t td{padding:10px;border-bottom:1px solid #E3E6EF;text-align:center;}
.my-sc-t tbody tr{cursor:pointer;} .my-sc-t tbody tr:hover td{background:#F7F9FD;} .my-sc-t tbody tr.on td{background:#EEF3FD;}
.my-sc-day{text-align:left !important;} .my-sc-day b{display:block;color:#1E2340;} .my-sc-day span{font:600 13.5px Arial,sans-serif;color:#5F6368;}
.my-sc-t td.gs-hi{color:#0B5D1E;background:#E6F4EA;} .my-sc-t td.gs-mid{color:#7A4B00;background:#FFF4E0;} .my-sc-t td.gs-lo{color:#A50E0E;background:#FDE8E8;} .my-sc-avg{font-weight:800;}
.my-sc-detail{margin-top:12px;border:1px solid #C9CEDD;border-radius:10px;} .my-sc-detail h3{margin:0;padding:10px 14px;font:800 17px Arial,sans-serif;color:#1E2340;background:#F4F5F9;border-radius:10px 10px 0 0;}
.bs-dup{margin:14px 14px 4px;padding:14px 16px;border:2px solid #E8A13A;background:#FFF7EC;border-radius:10px;font:600 15px/1.5 Arial,sans-serif;color:#141A2E;}
.bs-dup > b{font-size:17px;color:#7A4B00;} .bs-dup p{margin:4px 0 10px;}
.bs-dup-t{border-collapse:collapse;margin:0 0 10px;background:#fff;font:600 14.5px Arial,sans-serif;} .bs-dup-t th, .bs-dup-t td{border:1px solid #D9C9AE;padding:6px 10px;text-align:left;}
.bs-dup-t th{background:#F7E9D2;font-weight:800;} .bs-dup-t tr.on td{background:#E6F4EA;} .bs-dup-t code{font-size:13.5px;}
.bs-dup{margin:14px 14px 4px;padding:14px 16px;border:2px solid #E8A13A;background:#FFF7EC;border-radius:10px;font:600 15px/1.5 Arial,sans-serif;color:#141A2E;}
.bs-dup > b{font-size:17px;color:#7A4B00;} .bs-dup p{margin:4px 0 10px;}
.bs-dup-t{border-collapse:collapse;margin:0 0 10px;background:#fff;font:600 14.5px Arial,sans-serif;} .bs-dup-t th, .bs-dup-t td{border:1px solid #D9C9AE;padding:6px 10px;text-align:left;}
.bs-dup-t th{background:#F7E9D2;font-weight:800;} .bs-dup-t tr.on td{background:#E6F4EA;} .bs-dup-t code{font-size:13.5px;}
.bs-people{margin-top:8px;padding-top:6px;border-top:2px solid #E3E6EF;scroll-margin-top:80px;}
.bs-people > h2{margin:14px 0 4px;color:var(--navy);font-size:22px;}
.bs-people > .bs-people-sub{margin:0 0 14px;color:#2E3450;font-size:13.5px;}
`;
document.head.appendChild(css);
})();
