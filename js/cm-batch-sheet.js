/* ============================================================
   📋 THE SCORE TABLES behind the one 🏅 Scorecard page (js/cm-scorecard.js), and the trainee's 🏅 My Score Card
   ------------------------------------------------------------
   Admin → 🏅 Scorecard opens ONE page (js/cm-scorecard.js renderAll, the 🏅 Scorecards page the owner chose): its banner
   (Batch, trainee, ⬇ Download, ⬇ Scores only, ↻ Refresh, ⚡ Run now), its 🏅 Scores table and the picked trainee's card.
   This file gives that page what the old 📋 Batch Sheet had, folded in, no table beside it:
     scoresSheet(rows)  🏅 Scores: one row per trainee, one number everywhere (cmScorecard.overall / compute): Trainee, Batch,
                        Registered, Days passed, Day 1–5 (the day score, its slide progress and a one-line summary of the
                        day's work; hover: the day's events with their scores, newest first, what 🕒 Recent progress listed,
                        and the 📚 Lessons text), ✍️ Knowledge Checks (hover: each day's best, attempts and pass, what the
                        ✍️ Knowledge Checks table showed), 🧪 Practical activities, 📂 Backup Drive, 🗂 CMS file,
                        📝 Action Plan, Overall %, Result (the takeaways are not scored); sorted by Overall, nothing scored last
     feedbackHtml(row)  in the trainee's card: 💬 Feedback on Practical Activities, Day 1 … Day 5 collapsible, each activity
                        (Skill Activities and calls, Backup File Maintenance, Action Plans, the CMS file, the case
                        exercises) with its score, ⭐ what they did well, 🔧 what to improve and 🧾 why, as text
     csvTables(rows)    ⬇ Download: the 🏅 Scores table first, then ✍️ Knowledge Checks, 📚 Lessons, 🧮 Grading systems,
                        🕒 Recent progress (every event), every trainee's feedback on practical activities, the 100-point
                        model in full, 📅 Day 1–5: Detailed Scores (every score in one row per trainee: the Overall and
                        the day scores, the summary of each grading system, a 🏅 Score Card group per day and a group per
                        grading system, the group names above the headers) and the 🏅 Score Card of each day.
                        ⬇ Scores only: the first.
   The trainees are the Scorecard's (approved, not rejected, not archived, not merged into another account,
   js/cm-merged-away.js). 👥 Duplicate accounts (dupHtml, dupMerge) are drawn on 🛡 Admin Master Control → 👥 Trainee Audit
   (js/cm-audit-table.js). Its day deliverables (dayParts) are what 🏅 My Score Card and the feedback read.
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
// a stored label as shown: "Day 11 · Case Flow Day 1 · …" → "Day 1 · …" (index.html dayText: the Case Flow day, never the internal id)
const shown = t => typeof dayText === "function" ? dayText(t) : String(t == null ? "" : t);
const tools = () => (typeof PRACTICE_TOOLS !== "undefined" ? PRACTICE_TOOLS : []);
const keyOf = r => typeof batchKey === "function" ? batchKey(r) : (r.batch || "");
const labelOf = k => typeof folderLabel === "function" ? folderLabel(k) : k;

const B = {extra: {}, fbOpen: {}};

/* ---------- who is on the sheet: the picked batch (state.adminBatchFilter, "" = all), not rejected, not merged away ----------
   people(): everyone registered (waiting for approval, and the archived with "Show archived"): 📚 Lessons and 🕒 Recent
   progress only. scored(): the one rule of every score table, the same as 🏅 Scorecards (js/cm-scorecard.js loadAll):
   approved, not rejected, not archived, not merged into another live account (js/cm-merged-away.js). */
const MA = () => window.cmMergedAway || null;
function people(){
  const k = state.adminBatchFilter || "";
  const xs = (state.adminData || []).filter(r => r && !r.rejected && (state.adminShowArchived || !r.archived) && (!k || keyOf(r) === k));
  return (MA() ? MA().live(xs) : xs).sort((a, b) => String(a.name || "").localeCompare(String(b.name || "")));
}
const scored = ppl => MA() ? MA().scored(ppl) : ppl.filter(r => r.approved === true && !r.rejected && !r.archived);
const statusOf = r => r.archived ? "Archived" : r.approved === true ? "Approved" : "Waiting for approval";
const nameOf = r => (typeof cleanName === "function" ? cleanName(r.name) : "") || String(r.name || "Unnamed").slice(0, 60);
const extraOf = r => (r && r.__extra) || (state.auditExtra || {})[r.id];
const dataOf = r => (extraOf(r) || {}).data || {};
// the trainee's whole feedback:<id> (the trainer's Learning Check scores and each day's review with its 📐 rubric score)
const fbRecOf = r => { const x = extraOf(r) || {}; return x.fbRec || {days: x.fb || {}}; };

/* ---------- redrawing: the one 🏅 Scorecard page (js/cm-scorecard.js), read again in the background ---------- */
const onPage = () => (state.view === "admin" && ["scorecards", "audit", "batchsheet", "rankings"].includes(state.adminTab || "scorecards")) || state.view === "scorecard";
function repaint(){
  if(!onPage() || (typeof isTyping === "function" && isTyping())) return;
  if(window.cmScorecard && cmScorecard.invalidate) cmScorecard.invalidate();
  if(typeof render === "function") render();
}
// refreshed automatically, as the 📋 Batch Sheet was: the Scorecard reads every trainee again in the background once a minute
// (it redraws only when something changed, keeping what the trainer has open)
setInterval(() => { try{ if(typeof state === "object" && state.isAdmin && state.view === "admin" && onPage() && !(typeof isTyping === "function" && isTyping()) && window.cmScorecard && cmScorecard.reload) cmScorecard.reload(); }catch(e){} }, 60000);
// the duplicate accounts are on the Trainee Audit: redraw whichever page shows them
const redraw = () => { if(state.view === "admin" && typeof render === "function") render(); };
function scoreOf(r){ try{ return window.cmScorecard.compute(ctxFor(r)); }catch(e){ return null; } }
// ⭐ THE Overall and each day's score: js/cm-scorecard.js cmScorecard.overall, the one function the trainee's card and 🏅 Scores
// call too, so every table here shows the same number they do (read once per trainee per repaint)
const OV = {at: 0, m: new Map()};
function ovOf(r){
  if(Date.now() - OV.at > 1500){ OV.m = new Map(); OV.at = Date.now(); }
  if(OV.m.has(r)) return OV.m.get(r);
  let v = null; try{ v = window.cmScorecard && cmScorecard.overall ? cmScorecard.overall(ctxFor(r)) : null; }catch(e){ v = null; }
  OV.m.set(r, v); return v;
}
const ovPct = r => { const o = ovOf(r); return o ? o.pct : null; };
const ovTip = r => { const o = ovOf(r); return o ? o.why : "Nothing scored yet"; };
const dayS = (r, d) => { const o = ovOf(r), x = o && o.days.find(y => y.id === d.id); return x ? x.S : null; };
const daySTip = (r, d) => { const v = dayS(r, d); return v == null ? `${dayLabel(d)}: nothing scored yet` : `${dayLabel(d)} score (the 100-point model's day score, as on the trainee's card) = ${v}%`; };
const summaryOf = r => { try{ return typeof auditSummary === "function" ? auditSummary(r) : null; }catch(e){ return null; } };

/* ---------- the tables: {id, title, note, head, rows: [[{v, f, cls}]], onRow, rowCls} ---------- */
/* 👥 DUPLICATE ACCOUNTS, as Foundational's (its dupGroups / dupMerge): one person with two accounts. A trainee's account id is
   their name + batch (worker.js candidateIds), so the same person coming in with the name or Batch ID written another way
   (the Portal's form of it, a retyped batch) gets a second, empty account. Each account shows its id, the batch as saved,
   when it registered and was last on, and how much it holds; the trainer picks one and 👥 Merge has the Worker merge them
   (js/cm-account-repair.js mergeIds → /api/account-merge, worker-account-repair.js: a dry run the trainer confirms, every
   account backed up, every Knowledge Check attempt kept, the id the Portal opens kept, copied before anything is deleted,
   merged:<other id> = {into} left so a sign-in that would open it opens the kept one). */
const slugOfName = t => String(t || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
// (one person: the same name in an equivalent batch, B250926 and B092526 being one, as js/cm-account-repair.js sameBatch;
// two different Portal ids are two people, never one group)
const batchOfDup = r => { const b = r.batch || ""; return (typeof canonicalBatch === "function" && canonicalBatch(b) && typeof batchShow === "function" ? batchShow(b) : "") || String(b).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase().trim(); };
function dupGroups(){
  const all = (state.adminData || []).filter(r => r && r.name && !r.rejected && !r.archived && !r.mergedInto), by = {};
  (MA() ? MA().live(all) : all).forEach(r => { const k = slugOfName(nameOf(r)) + "@" + slugOfName(batchOfDup(r)); (by[k] = by[k] || []).push(r); });
  const shown = new Set(people().map(r => r.id)), out = [];
  Object.entries(by).forEach(([k, g]) => {
    // split by Portal id: each Portal id its own group, with the accounts that have none
    const uids = [...new Set(g.map(r => r.portalUid).filter(Boolean))], none = g.filter(r => !r.portalUid);
    (uids.length ? uids.map(u => [k + "~" + u, g.filter(r => r.portalUid === u).concat(uids.length === 1 ? none : [])]) : [[k, g]]).forEach(x => out.push(x));
  });
  const G = out.filter(([, g]) => g.length > 1 && g.some(r => shown.has(r.id)));
  // (a pair to show: the redirects are read first, so a merge waiting to finish isn't offered again; drawn again once in)
  if(G.length && MA() && !MA().loaded()){ MA().ready(); return []; }
  return G.map(([k, g]) => ({key: k, accts: g.map(r => {
    const a = summaryOf(r) || {seen: 0, kcPassed: 0};
    return {r, id: r.id, batch: r.batch || "", reg: r.registeredAt || "", last: r.lastActive || "", seen: a.seen || 0, kc: a.kcPassed || 0, st: r.approved === true ? "Approved" : "Waiting"};
  }).sort((a, b) => (b.kc - a.kc) || (b.seen - a.seen) || String(b.last).localeCompare(String(a.last)))}));
}
function dupHtml(){
  const G = dupGroups(); if(!G.length) return "";
  B.dupKeep = B.dupKeep || {};
  return `<div class="bs-dup"><b>👥 ${G.length === 1 ? `${E(nameOf(G[0].accts[0].r))} has ${G[0].accts.length} accounts` : `${G.length} trainees have more than one account`}</b>
    <p>The same person came in with their name or Batch ID written another way, so a second account was made. 👥 Merge shows the Worker's dry run first; it keeps the account the trainee's current Portal sign-in opens (else the one picked here), backs up every account, keeps every Knowledge Check attempt, and a sign-in to the other then opens the one kept.</p>
    ${G.map(g => { const keep = B.dupKeep[g.key] && g.accts.some(a => a.id === B.dupKeep[g.key]) ? B.dupKeep[g.key] : g.accts[0].id;
      return `<table class="bs-dup-t"><thead><tr><th>Keep</th><th>Account id</th><th>Batch as saved</th><th>Registered</th><th>Last on</th><th>Slides seen</th><th>Checks passed</th><th>Status</th></tr></thead><tbody>
        ${g.accts.map(a => `<tr${a.id === keep ? ' class="on"' : ""}><td><input type="radio" name="dup-${E(g.key)}" ${a.id === keep ? "checked" : ""} onchange="cmBatchSheet.dupKeep('${E(g.key)}', '${E(a.id)}')"></td>
          <td><code>${E(a.id)}</code></td><td><code>${E(a.batch)}</code></td><td>${a.reg ? E(dTime(a.reg)) : "—"}</td><td>${a.last ? E(ago(a.last)) : "—"}</td><td>${a.seen}</td><td>${a.kc}</td><td>${a.st}</td></tr>`).join("")}</tbody></table>
        <button class="btn btn-navy btn-sm" type="button" ${B.dupBusy ? "disabled" : ""} onclick="cmBatchSheet.dupMerge('${E(g.key)}')">${B.dupBusy === g.key ? "Merging…" : `👥 Merge (dry run first)`}</button>`; }).join("")}</div>`;
}
async function dupMerge(key){
  if(!state.isAdmin || B.dupBusy) return;
  const g = dupGroups().find(x => x.key === key); if(!g) return;
  const keep = B.dupKeep && g.accts.some(a => a.id === B.dupKeep[key]) ? B.dupKeep[key] : g.accts[0].id, others = g.accts.filter(a => a.id !== keep);
  // 👥 on the Worker (js/cm-account-repair.js mergeIds → /api/account-merge): its dry run, the trainer's confirm, then exactly
  // that merge (every account backed up, every attempt kept, copied before anything is deleted)
  if(!window.cmAccountRepair || !cmAccountRepair.mergeIds){ if(typeof toast === "function") toast("Open Admin → 🛠 Account Repair to merge these accounts."); return; }
  B.dupBusy = key; redraw();
  let r; try{ r = await cmAccountRepair.mergeIds([keep].concat(others.map(a => a.id)), keep); }catch(e){ r = {ok: false, text: (e && e.message) || "no connection"}; }
  B.dupBusy = null; B.extra = {}; B.rowsAt = 0; if(MA()) MA().reload(); if(state.auditExtra) Object.keys(state.auditExtra).forEach(k => delete state.auditExtra[k]);
  if(typeof toast === "function" && !r.cancelled) toast(r.ok ? `✓ Merged: one account for ${nameOf(g.accts[0].r)} (${r.keep}).` : `Couldn't merge: ${r.text}`);
  if(typeof refreshAdminData === "function") refreshAdminData(); else render();
}
/* ---------- 📚 Lessons and 🕒 Recent progress, a trainee's day at a time (the 🏅 Scores day cells; the CSV in full) ---------- */
// a day's slides, as the Trainee Audit counts them (index.html auditSummary): the furthest slide reached of the day's deck
function slidesOf(r, d){
  const data = dataOf(r), sp = data["slide-progress"] || {}, dp = data["day-progress"] || r.dayProgress || {};
  let n = 0; try{ n = typeof buildDaySlides === "function" ? buildDaySlides(d).length : 0; }catch(e){ n = 0; }
  const reached = Math.min(n, (sp[d.id] || 0) + ((sp[d.id] || dp[d.id]) ? 1 : 0));
  return {n, reached, line: n && reached >= n ? "Slides ✓" : reached ? `Slides ${reached}/${n}` : n ? "Slides not opened" : ""};
}
const dayN = id => { const d = days().find(x => String(x.id) === String(id)); return d && d.cf ? d.cf.n : null; };
// each CMS document's Case Flow day (js/cm-cms-file.js plan: the day whose activities file it)
function docDay(){
  if(B.docDay) return B.docDay; const out = {};
  try{ const P = window.cmCmsFile ? cmCmsFile.plan() : {days: {}}; Object.entries(P.days || {}).forEach(([n, x]) => (x.docs || []).forEach(dc => { if(out[dc.id] == null) out[dc.id] = Number(n); })); }catch(e){}
  return Object.keys(out).length ? (B.docDay = out) : out;
}
// everything a trainee did, with its score and its Case Flow day (n, null: no day), newest first
function eventsOf(r){
  const out = [], data = dataOf(r), dp = data["day-progress"] || {}, rdp = r.dayProgress || {}, dd = docDay();
  const push = (at, n, what, detail, score) => { const d = T0(at); if(d) out.push({r, at: d, n: n == null ? null : Number(n), what, detail: detail || "", score: num(score)}); };
  // every Knowledge Check attempt (its history), not only the best one: 🛡 the record's (the Worker scored them); a day only
  // the device holds is shown as unconfirmed (js/cm-scorecard.js kcDevice)
  days().forEach(d => { const rp = rdp[d.id], own = rp && (typeof rp.score === "number" || (Array.isArray(rp.history) && rp.history.length)), p = own ? rp : (dp[d.id] || {}), h = Array.isArray(p.history) ? p.history : [], n = d.cf ? d.cf.n : null;
    const unc = own ? "" : " · unconfirmed: on the trainee's device only";
    if(h.length) h.forEach((x, i) => push(x.date || x.at, n, "Knowledge Check", `${dayLabel(d)} · attempt ${i + 1}${x.passed && own ? " · passed" : ""}${unc}`, x.score));
    else if(typeof p.score === "number") push(p.date || p.at, n, "Knowledge Check", dayLabel(d) + unc, p.score); });
  // documents filed into the CMS case (js/cm-doc-filing.js): first time right is 100%, then 100% ÷ the attempts
  Object.entries(data["doc-filing"] || {}).forEach(([id, x]) => { if(!x || !x.attempts) return;
    push(x.at || x.lastAt, dd[id], x.filed ? "Document filed in the CMS" : "Document refused by the CMS", `${x.name || id}${x.category ? " · " + x.category : ""} · ${x.attempts} attempt${x.attempts === 1 ? "" : "s"}`, x.filed ? Math.round(100 / x.attempts) : 0); });
  // the Backup Drive: Day 1's folders and each day's Backup File Maintenance (js/cm-drive.js)
  const ds = data["drive-setup"]; if(ds && typeof ds.score === "number") push(ds.at, 1, "Backup Drive set up", `the firm's folders · attempt ${ds.attempts || 1}`, ds.score);
  Object.entries(data["drive-grades"] || {}).forEach(([n, g]) => { if(g && typeof g.score === "number") push(g.at, n, "Backup File Maintenance", `Case Flow Day ${n}${g.passed ? " · passed" : ""}`, g.score); });
  // feedback a trainer sent (its rubric score when it has one)
  Object.entries(((extraOf(r) || {}).fb) || {}).forEach(([dayId, f]) => { if(!f || f.status !== "sent" || (f.auto && !f.editedByTrainer)) return;
    const d = days().find(x => String(x.id) === String(dayId)), rb = window.cmRubric && cmRubric.counts && cmRubric.counts(f) ? cmRubric.total(f.rubric) : null;
    push(f.sentAt, dayN(dayId), "Trainer feedback sent", `${d ? dayLabel(d) : "Day " + dayId}${f.rating ? " · " + f.rating : ""}`, rb); });
  (data["work-log"] || []).forEach(w => { if(!w || w.kind === "quiz") return;
    push(w.at, dayN(w.dayId), w.kind === "lab" ? "Skill Activity" : w.kind === "roleplay" ? "Call practice" : w.kind === "task" ? "Random task" : "Practice", shown(w.label), typeof w.score === "number" ? w.score : null); });
  const tname = t => clip(typeof t.task === "string" ? t.task : (t.task && (t.task.title || t.task.name)) || "", 120);
  (data["task-log"] || []).forEach(t => { if(t && t.status === "resolved") push(t.submittedAt || t.resolvedAt, dayN(t.dayId), "Random task resolved", tname(t), t.score); else if(t && t.status === "missed") push(t.expiresAt, dayN(t.dayId), "Random task missed", tname(t), 0); });
  const lv = data["last-view"]; if(lv && lv.at) push(lv.at, lv.view === "day" ? dayN(lv.dayId) : null, "Opened", lv.view === "day" ? `Day ${typeof dayNo === "function" ? dayNo(lv.dayId) : lv.dayId}` : lv.view === "tool" ? `Skill Builder ${lv.toolId || ""}` : String(lv.view || ""));
  return out.sort((a, b) => b.at - a.at);
}
// a day's 📚 Lessons text: its slides and its Knowledge Check
function lessonText(r, d){
  const s = slidesOf(r, d), k = kcOf(r, d);
  return `${dayLabel(d)}: ${s.reached} of ${s.n} slides${k.kc == null ? " · Knowledge Check not taken" : ` · Knowledge Check best ${k.kc}% of ${k.tries} attempt${k.tries === 1 ? "" : "s"} ${k.ok ? "(passed)" : "(below 70%)"}`}`;
}
function lessonsTable(ppl){
  const L = cfDaysL();
  return {id: "lessons", title: "📚 Lessons",
    head: ["Trainee", "Registered"].concat(L.map(d => `${dayLabel(d)}. ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`)),
    rows: ppl.map(r => { const reg = T0(r.registeredAt);
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: [reg ? dTime(r.registeredAt) : "", labelOf(keyOf(r))].filter(Boolean).join(" · "), f: "", cls: "bs-reg"}].concat(L.map(d => {
        const s = slidesOf(r, d), k = kcOf(r, d);
        return {v: [s.reached ? s.line : "", k.kc == null ? "" : `Check ${k.kc}%`].filter(Boolean).join(" · "), f: lessonText(r, d)}; })); })};
}
function recentTable(ppl){
  const out = [].concat(...ppl.map(eventsOf)).sort((a, b) => b.at - a.at);
  return {id: "recent", title: "🕒 Recent progress", note: "Everything they did, newest first: Knowledge Check attempts, Skill Activities and calls, documents filed in the CMS, the Backup Drive, random tasks and the feedback sent, each with its score.",
    head: ["When", "Trainee", "Day", "What", "Detail", "Score"],
    rows: out.map(x => [{v: dTime(x.at)}, {v: nameOf(x.r), cls: "gs-name"}, {v: x.n ? `Day ${x.n}` : ""}, {v: x.what}, {v: x.detail}, {v: pct(x.score)}])};
}
/* ============================================================
   📅 DAY BY DAY and 🏅 SCORE CARD, as Foundational's (its dayDeliverables / scoreCardTable): each Case Flow day's graded
   deliverables, a trainee at a time, with 🧾 why it was scored that way, ⭐ what they did best and 🔧 what to improve.
   A day's deliverables: ✍️ its Knowledge Check, 🧩 its modules' Learning Checks, 🧪 its Skill Activities
   (the grader's and the work log's) and 📞 graded calls, 📝 its Action Plan, 📂 its Backup Drive grade (the latest of the
   saved and the Worker's nightly grade), 🗂 the CMS file and 💬 the trainer's feedback on it. 📝 / 🧪 / 📝 / 📂 are
   js/cm-scorecard.js dayItems, the same items and averages as the trainee's card and 🏅 Scores.
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
  // (🛡 the day's Case Flow summary only when it is this day's: one naming another day's id is not its score, js/cm-scorecard.js cfDay)
  const data = dataOf(r), n = d.cf.n, out = [], cf0 = ((r.caseFlow || {}).days || {})[n], cfd = cf0 && typeof cf0 === "object" && (cf0.id == null || String(cf0.id) === String(d.id)) ? cf0 : {};
  const dp = (data["day-progress"] || r.dayProgress || {})[d.id] || {}, wl = Array.isArray(data["work-log"]) ? data["work-log"] : [];
  // ✍️ the Knowledge Check (its last attempt's missed questions are what to improve)
  // (🛡 the best score of the trainee's record and its Case Flow summary only: js/cm-scorecard.js kcBest / kcPassed. A score
  // only the device holds is shown as unconfirmed, never counted: kcDevice)
  const S = window.cmScorecard, rp = (r.dayProgress || {})[d.id] || {}, ctx = ctxFor(r);
  const kb = S && S.kcBest ? S.kcBest(rp, cfd) : (cfd.kc != null ? cfd.kc : rp.score);
  const kc = num(kb), quiz = wl.filter(w => w && w.kind === "quiz" && Number(w.dayId) === Number(d.id)).pop();
  const dev = kc == null && S && S.kcDevice ? num(S.kcDevice(ctx, d)) : null;
  const passed = S && S.kcPassed ? S.kcPassed(ctx, d) : kc != null && kc >= 70;
  const tries = (rp.history || []).length || rp.kcAttempts || (kc != null ? 1 : 0);
  if(kc != null || tries) out.push({grp: "kc", name: "✍️ Knowledge Check", pct: kc, status: kc == null ? "Not taken" : passed ? "Passed" : "Not passed yet",
    why: kc == null ? "" : `${kc}% best of ${tries} attempt${tries === 1 ? "" : "s"}${quiz && quiz.total ? ` · last attempt ${quiz.correct}/${quiz.total} correct` : ""}. 70% passes the day.${rp.kcUnverified ? " Restored from the trainee's device." : ""}`,
    best: [], improve: ((quiz && quiz.missed) || []).slice(0, 4).map(q => "Missed: " + clip(q, 160))});
  else if(dev != null) out.push({grp: "kc", name: "✍️ Knowledge Check", pct: null, status: `Unconfirmed: ${dev}% on the trainee's device only`, why: `${dev}% is on the trainee's device but not on their record, so it isn't counted. 🛠 Account Repair can restore it.`, best: [], improve: []});
  else out.push({grp: "kc", name: "✍️ Knowledge Check", pct: null, status: "Not taken", why: "", best: [], improve: []});
  // 🧩 the modules' Learning Checks (Automated × 0.60 + trainer × 0.40)
  const names = modNames();
  Object.entries(S && S.lcMods ? S.lcMods(cfd.modules, ctx.fb) : cfd.modules || {}).forEach(([id, s]) => { const c = num(s.c != null ? s.c : s.a);
    out.push({grp: "lc", name: `🧩 Learning Check: ${names[id] || id}`, pct: c, status: s.c != null ? "Scored" : "Awaiting the trainer's 40%",
      why: `Automated ${pct(num(s.a)) || "—"} × 0.60 + trainer ${pct(num(s.t)) || "—"} × 0.40${s.c == null ? ". Until the trainer scores it, the automated half counts." : ` = ${c}%`}`, best: [], improve: []}); });
  // (📝 the takeaway is not scored) 🧪 Skill Activities and 📞 calls · 📝 Action Plan · 📂 Backup Drive: js/cm-scorecard.js dayItems, the same
  // items the grading systems, the day score and the trainee's card count (each with its latest attempt)
  const I = S && S.dayItems ? S.dayItems(ctx, d) : {sa: [], call: [], ap: [], bd: []};
  const subsOf = x => Object.entries(x.subs || {}).map(([k, v]) => `${k} ${v}%`).join(", ");
  I.sa.forEach(x => out.push({grp: "sa", name: `🧪 ${clip(shown(String(x.name).replace(/^Day \d+: /, "")), 90)}`, pct: num(x.pct), status: x.tier || "",
    why: [x.tier, subsOf(x) ? "rubric: " + subsOf(x) : "", x.from === "the grader" ? `Graded${x.tries ? ` · attempt ${x.tries}` : ""}` : "", x.at ? "graded " + dTime(x.at) : ""].filter(Boolean).join(" · "),
    best: (x.best || []).map(y => clip(y, 200)), improve: (x.improve || []).map(y => clip(y, 200))}));
  I.call.forEach(x => out.push({grp: "call", name: `📞 ${clip(shown(x.name), 90)}`, pct: num(x.pct), status: x.tier || "",
    why: [x.tier, subsOf(x) ? "rubric: " + subsOf(x) : "", x.at ? "graded " + dTime(x.at) : ""].filter(Boolean).join(" · "), best: (x.best || []).map(y => clip(y, 200)), improve: (x.improve || []).map(y => clip(y, 200))}));
  I.ap.forEach(x => out.push({grp: "ap", name: `📝 Action Plan: ${clip(String(x.name).replace(/^Day \d+: /, ""), 80)}`, pct: num(x.pct), status: x.pct >= 70 ? "Handed in" : "Steps missing",
    why: `${x.note || ""}: the plan checked against the steps it must hold.`, best: (x.best || []).map(y => clip(y, 200)), improve: (x.improve || []).map(y => clip(y, 200))}));
  // 🧪 a Skill Activity handed in to the grader whose grading didn't come back (js/cm-ai-grader.js keeps the reason, failed)
  // and that has no grade yet: listed, so a blank isn't read as work not done (it counts in no average until it is graded)
  const aig = ((data["cf-ai-grades"] || {}).blocks) || {}, CFD = window.CM_CASE_FLOW || {};
  if(Object.values(aig).some(g => g && g.failed && typeof g.score !== "number")){
    const dayOf = {}, title = {};
    (CFD.sequence || []).forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(id => { dayOf[id] = sd.n; })));
    (CFD.days || []).forEach(x => (x.modules || []).forEach(m => (m.blocks || []).forEach(b => { title[b.id] = b.title; })));
    Object.entries(aig).forEach(([id, g]) => {
      if(!g || !g.failed || typeof g.score === "number" || Number(dayOf[id]) !== Number(n)) return;
      out.push({grp: "sa", name: `🧪 ${clip(shown(title[id] || id), 90)}`, pct: null, status: "Handed in, not graded",
        why: `The grading didn't come back: ${g.failed.why || "no answer"}${g.failed.at ? ` (${dTime(g.failed.at)})` : ""}${g.failed.detail ? `. ${clip(g.failed.detail, 160)}` : ""}`,
        best: [], improve: ["Submit it again from the activity's Submit slide: an attempt that isn't graded uses none of the 3."]});
    });
  }
  // 📂 Backup Drive: exactly the items the day score and the Overall count (js/cm-scorecard.js SOURCES bd, the latest of the
  // saved grade and the Worker's nightly grade of the drive with a trainer's override winning, and the ✍ written work, from
  // js/cm-drive-work.js scoreItems); the grade's record (saved or nightly) gives the detail: its dimensions, 🏷 File names, the issues
  const rep = (typeof state === "object" && state.driveReports || {})[r.id] || null;
  const DIMW = {compliance: "Compliance", detail: "Attention to detail", organization: "Organization", naming: "Naming convention"};
  const bdName = n === 1 ? "📂 Backup Drive: the firm's folders" : "📂 Backup File Maintenance";
  I.bd.forEach(x => { const written = /^Day \d+: ✍/.test(x.name), trainer = x.src === "trainer" || /^Your trainer/.test(x.note || "");
    if(x.missing){ out.push({grp: "bd", name: bdName, pct: 0, status: "Not done",
      why: (!rep || !rep.connected ? "No Backup Drive linked yet" : n === 1 ? "The firm's folders haven't been graded yet" : "No grade of this day yet, saved or from the Worker's nightly read of the drive") + ": counts 0, as the day is passed and the Backup Drive is required every day",
      best: [], improve: [!rep || !rep.connected ? "Link the Google Drive folder (🔗 Link my Google Drive, Day 1's Backup File Maintenance)." : n === 1 ? "Build the firm's folders and submit them." : "Open the Backup Drive so the day's grade is saved, and file the day's documents in the CMS so their copies land in their folders."]}); return; }
    if(written){ out.push({grp: "bd", name: x.name.replace(/^Day \d+: /, ""), pct: num(x.pct), status: trainer ? "Trainer's grade" : x.pct >= 70 ? "Passed" : "Below 70%", why: x.note || "Graded written work, read from the trainee's Backup Drive", best: [], improve: []}); return; }
    const g = x.g && typeof x.g === "object" ? x.g : {};
    const dims = g.dims && !Array.isArray(g.dims) ? Object.entries(DIMW).filter(([k]) => typeof g.dims[k] === "number").map(([k, w]) => `${w} ${g.dims[k]}%`).join(" · ") : "";
    // 🏷 the day's File names row (names: {got, max, wrong}) leads the list when it cost points, so the cause is named
    const nm = g.names && typeof g.names.got === "number" && typeof g.names.max === "number" && (g.names.got < g.names.max || g.names.wrong > 0)
      ? [`🏷 File names ${g.names.got}/${g.names.max}${g.names.wrong > 0 ? ` · ${g.names.wrong} name${g.names.wrong === 1 ? "" : "s"} wrong` : ""}`] : [];
    const iss = Array.isArray(g.issues || g.problems) ? (g.issues || g.problems).slice(0, 4).map(y => clip(typeof y === "string" ? y : JSON.stringify(y), 200)) : [];
    const from = x.src === "nightly" ? "Graded by the Worker from the trainee's Drive (its nightly read)" : "Read from the trainee's Drive, saved on their progress";
    out.push({grp: "bd", name: bdName, pct: num(x.pct), status: trainer ? "Trainer's grade" : x.pct >= 70 ? "Passed" : "Below 70%",
      why: trainer ? x.note : `${dims ? dims + " · " : ""}${from}${g.attempts ? ` · attempt ${g.attempts}` : ""}${x.at ? " · " + dTime(x.at) : ""}`, best: [], improve: trainer && x.note && /: /.test(x.note) ? [x.note.replace(/^Your trainer's grade: /, "")] : nm.concat(iss)}); });
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
const SC_COLS = [["kc", "✍️ Knowledge Check"], ["lc", "🧩 Learning Checks"], ["sa,call", "🧪 Activities & calls"], ["ap", "📝 Action Plan"], ["bd", "📂 Backup Drive"], ["cmsf", "🗂 CMS file"], ["fb", "📐 Trainer rubric"]];
// what each column measures: the Score Card's note (the owner's "table that specifies what the metrics were")
const SC_WHAT = {kc: "the day's Knowledge Check, its best score (70% passes the day)",
  lc: "each module's Learning Check: the review × 0.60 + the trainer's score × 0.40 (the automated half until the trainer scores it).",
  "sa,call": "each Skill Activity graded by the grader and each graded call of the day, the latest attempt of each, averaged",
  ap: "each action plan written in the day's Notes & Action Plan: the share of the steps it must hold",
  bd: "Day 1's folders, then each day's Backup File Maintenance, graded from the trainee's Drive (the latest of the saved and the Worker's nightly grade, a trainer's grade winning; a passed day with none counts 0)",
  cmsf: "John Doe's file in the CMS, graded against what a correct file holds by that day (a CMS activity with nothing ticked on Check Your Work takes its graded score here; the day score counts that grade once, under 🧪)",
  fb: "the trainer's 📐 rubric score on the day's sent review"};
const scNote = () => "What each column measures: " + SC_COLS.map(([g, l]) => `${l}: ${SC_WHAT[g] || ""}`).join(". ") + ". Day score: the 100-point model's score for the day (the four dimensions, 25/25/30/20), the same as the trainee's card. 💬 Remarks: the rating on the trainer's sent review. Hover a cell for the items it averages.";
function scoreCardTable(ppl, day){
  // (one day at a time on the page, the trainer picks it: a table of every day side by side scrolled sideways; ⬇ Download has each day)
  const ALL = cfDaysL(), L = day ? [day] : ALL, P = SC_COLS.map(c => c[1]).concat(["Day score", "💬 Remarks"]);
  return {id: day ? "scorecard-d" + day.id : "scorecard", title: day ? `🏅 Score Card · ${dayLabel(day)}` : "🏅 Score Card", note: scNote(),
    groups: [{label: "", span: 2}].concat(L.map(d => ({label: `${dayLabel(d)} · ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`, span: P.length}))),
    head: ["Trainee", "Overall"].concat(...L.map(() => P)),
    rows: ppl.map(r => { const SA = ALL.map(d => dayParts(r, d)), all = ovPct(r), S = L.map(d => SA[ALL.indexOf(d)]), avgs = L.map(d => dayS(r, d));
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: pct(all), f: ovTip(r), cls: "gs-num gs-calc gs-bold " + tone(all)}]
        .concat(...S.map((xs, i) => { const nm = dayLabel(L[i]), f = fbOf(r, L[i]);
          return SC_COLS.map(([g, l]) => { const gs = g.split(","), its = xs.filter(x => gs.includes(x.grp) && x.pct != null), a = avgOf(its.map(x => x.pct));
              return {v: pct(a), f: a == null ? `${nm} · ${l}: nothing scored yet` : `${nm} · ${l}: ${its.map(x => `${x.name.replace(/^\S+\s/, "")} ${x.pct}%`).join("; ")}${its.length > 1 ? ` = ${a}%` : ""}`, cls: "gs-num " + tone(a)}; })
            .concat([{v: pct(avgs[i]), f: daySTip(r, L[i]), cls: "gs-num gs-calc gs-bold " + tone(avgs[i])},
              {v: f ? (f.rating || "Sent") : "", f: f ? `${nm} · Trainer: ${f.rating || ""}${f.summary ? " — " + clip(f.summary, 400) : ""}` : `${nm}: no feedback sent yet`, cls: "gs-txt " + (f ? ratingTone(f.rating) : "")}]); }));
    })};
}
// 📅 Day by Day: a column per day (the average of its scored deliverables)
// the Score Card's day picker: Day 1 … Day 5 (the latest day anyone has a score on opens first)
// 🏅 Scores' summary of each trainee (rank, days passed, each grading system's average): the Detailed Scores' 🏅 Summary group
function scoresTable(ppl){
  const S = (window.cmScorecard && cmScorecard.sources) || [];
  const rows = scored(ppl).map(r => ({r, sc: scoreOf(r)})).filter(x => x.sc);
  rows.forEach(x => { x.ov = ovPct(x.r); });
  const order = rows.filter(x => x.ov != null).slice().sort((a, b) => b.ov - a.ov);
  order.forEach((x, i) => { x.rank = i && order[i - 1].ov === x.ov ? order[i - 1].rank : i + 1; });
  return {id: "scores", rowsRaw: rows, title: "🏅 Scores", 
    head: ["Trainee", "Overall %", "Rank", "Days passed", "Grading systems average %"].concat(S.map(s => `${s.icon} ${s.label}`)),
    rows: rows.map(x => [{v: nameOf(x.r), f: nameOf(x.r), cls: "gs-name"},
        {v: pct(x.ov), f: ovTip(x.r), cls: "gs-num gs-calc gs-bold " + tone(x.ov)},
        {v: x.rank == null ? "" : String(x.rank), f: x.rank == null ? "Not ranked: nothing graded yet" : `Rank ${x.rank} of ${order.length}`, cls: "gs-rank"},
        {v: `${x.sc.done} / ${x.sc.total}`, f: `${x.sc.done} of the ${x.sc.total} days passed`, cls: "gs-num"},
        {v: pct(x.sc.overall), f: x.sc.overall == null ? "Nothing graded yet" : `A sub-score, not the Overall: the average of ${x.sc.systems} grading systems = ${x.sc.overall}%`, cls: "gs-num " + tone(x.sc.overall)}]
      .concat(x.sc.rows.map(y => ({v: pct(y.avg), f: y.avg == null ? `${y.s.label}: nothing graded yet` : `${y.s.label}: average of ${y.items.length} = ${y.avg}%`, cls: "gs-num " + tone(y.avg)})))),
    empty: "No approved trainee here yet."};
}
// 📅 Day 1–5: Detailed Scores, the sheet's first table: every score of a trainee in ONE row, so no two tables read a trainee
// different numbers for what looks like the same thing. The Overall and the day scores first (the 100-point model's, as the
// card), then 🏅 Scores' summary (rank, days passed, the grading systems average, each system's average), a group of columns
// per Case Flow day (that day's 🏅 Score Card without its day score, already in front) and a group per grading system (how
// many graded, its own counts, each graded item; its average is in the summary). The other tables of ⬇ Download are the
// same numbers cut another way. (Only in ⬇ Download: the page shows 🏅 Scores, js/cm-scorecard.js.)
function dayTable(ppl){
  const L = cfDaysL(), sc = scoresTable(ppl), sum = new Map(sc.rowsRaw.map((x, i) => [x.r.id, sc.rows[i].slice(2)])), sumHead = sc.head.slice(2);
  const dayT = L.map(d => scoreCardTable(ppl, d)), keep = h => h !== "Day score";
  const S = (window.cmScorecard && cmScorecard.sources) || [], sysT = S.map(s => systemTable(ppl, s));
  return {id: "days", title: "📅 Day 1–5: Detailed Scores · every score in one table", note: "A row per trainee with every score: the Overall and each Case Flow day's score (the 100-point model's, the same numbers as their card), then the rank, days passed and each grading system's average, then a group of columns per day (its Score Card: each kind of score and the trainer's remarks) and a group per grading system (each graded item). A day with work but nothing scored yet shows how many are done. Hover a cell for how it was scored; scroll sideways for the rest; click a trainee to open their score card just below, with every deliverable's score, why, what they did best and what to improve.",
    groups: [{label: "", span: 1}, {label: "📅 Overall & day scores", span: 1 + L.length}, {label: "🏅 Summary", span: sumHead.length}]
      .concat(dayT.map(t => ({label: `🏅 Score Card · ${t.groups[1].label}`, span: t.head.slice(2).filter(keep).length})))
      .concat(sysT.map(t => ({label: t.title, span: t.head.length - 2}))),
    head: ["Trainee", "Overall"].concat(L.map(d => `${dayLabel(d)}. ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`), sumHead,
      ...dayT.map(t => t.head.slice(2).filter(keep)), ...sysT.map(t => t.head.slice(2))),
    rows: ppl.map((r, ri) => { const per = L.map(d => dayParts(r, d)), avgs = L.map(d => dayS(r, d)), a = ovPct(r);
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: pct(a), f: ovTip(r), cls: "gs-num gs-calc gs-bold " + tone(a)}]
        .concat(L.map((d, i) => { const xs = per[i], sc = xs.filter(x => x.pct != null);
          return {v: avgs[i] != null ? `${avgs[i]}% · ${sc.length} scored` : sc.length ? `${sc.length} scored` : "", f: `${daySTip(r, d)} · its deliverables: ` + (xs.length ? xs.map(x => `${x.name.replace(/^\S+\s/, "")} ${x.pct != null ? x.pct + "%" : x.status || "—"}`).join(" · ") : "nothing yet"), cls: "gs-num " + tone(avgs[i])}; }),
          sum.get(r.id) || sumHead.map(() => ({v: "", f: "Nothing scored yet"})),
          ...dayT.map(t => t.rows[ri].slice(2).filter((c, ci) => keep(t.head[ci + 2]))), ...sysT.map(t => t.rows[ri].slice(2)));
    })};
}
// ✍️ Knowledge Checks: a column per Case Flow day, each the best score the day score counts (js/cm-scorecard.js kcBest, only
// what is on the trainee's record; a score on the device only is named, never counted) and whether it passed (kcPassed)
function kcTable(ppl){
  const L = cfDaysL(), S = window.cmScorecard;
  return {id: "kcs", title: "✍️ Knowledge Checks", note: "Each Case Flow day's Knowledge Check: the best score kept (70% passes the day), as the day score and the Overall count it. Hover a cell for its attempts.",
    head: ["Trainee", "Days passed", "Attempts"].concat(L.map(d => `${dayLabel(d)}. ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`)),
    rows: ppl.map(r => { const ctx = ctxFor(r);
      const per = L.map(d => { const cf0 = ((r.caseFlow || {}).days || {})[d.cf.n], cfd = cf0 && typeof cf0 === "object" && (cf0.id == null || String(cf0.id) === String(d.id)) ? cf0 : {}, rp = (r.dayProgress || {})[d.id] || {};
        const kc = num(S && S.kcBest ? S.kcBest(rp, cfd) : (cfd.kc != null ? cfd.kc : rp.score)), ok = S && S.kcPassed ? !!S.kcPassed(ctx, d) : kc != null && kc >= 70;
        const tries = (rp.history || []).length || rp.kcAttempts || (kc != null ? 1 : 0), dev = kc == null && S && S.kcDevice ? num(S.kcDevice(ctx, d)) : null;
        return {d, kc, ok, tries, dev}; });
      const passed = per.filter(x => x.ok).length, tries = per.reduce((n, x) => n + x.tries, 0);
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, {v: `${passed} / ${L.length}`, f: `${passed} of the ${L.length} days' Knowledge Checks passed`, cls: "gs-num gs-bold " + (passed === L.length ? "gs-hi" : "")},
        {v: tries ? String(tries) : "", f: `${tries} attempt${tries === 1 ? "" : "s"} in all`, cls: "gs-num"}]
        .concat(per.map(x => x.kc != null ? {v: `${x.kc}%${x.ok ? " ✓" : ""}`, f: `${dayLabel(x.d)}: best ${x.kc}% of ${x.tries} attempt${x.tries === 1 ? "" : "s"}${x.ok ? " · passed" : " · not passed yet (70%)"}`, cls: "gs-num " + tone(x.kc)}
          : x.dev != null ? {v: "Unconfirmed", f: `${dayLabel(x.d)}: ${x.dev}% is on the trainee's device only, not on their record, so it isn't counted (🛠 Account Repair can restore it)`, cls: "gs-num gs-mid"}
          : {v: "", f: `${dayLabel(x.d)}: not taken yet`, cls: "gs-num"})); }),
    empty: "No approved trainee here yet."};
}

/* ============================================================
   🧮 GRADING SYSTEMS: a sheet per grading system (the Scorecard's own, js/cm-scorecard.js), each with its own metrics
   beside its items: a row per trainee, the system's Average and Graded, the system's own counts, then a column per item.
   ============================================================ */
// (🏅 My Scores' own record, myRec, carries the trainee's Portal and Call Simulator bests in its __extra)
function ctxFor(r){ if(r && r.__ctx) return r.__ctx; const x = B.extra[r.id] || (r && r.__extra) || {}; return {rec: r, cf: r.caseFlow || {days: {}}, data: dataOf(r), callsim: x.callsim, sim: x.sim, fb: fbRecOf(r)}; }
const cnt = (v, f, cls) => ({v: v == null ? "" : String(v), f: f || "", cls: "gs-num " + (cls || "")});
// 🧪 the grader's attempts of a trainee (cf-ai-grades): any at all, and whether the newest one failed (with its reason)
function aiState(r){
  const bl = ((dataOf(r)["cf-ai-grades"] || {}).blocks) || {}, ev = [];
  Object.values(bl).forEach(g => { if(!g) return; if(typeof g.score === "number") ev.push({at: String(g.at || ""), ok: true});
    if(g.failed) ev.push({at: String(g.failed.at || ""), ok: false, why: g.failed.why || "no answer"}); });
  ev.sort((a, b) => a.at.localeCompare(b.at)); const last = ev[ev.length - 1];
  return {any: ev.length > 0, failed: !!(last && !last.ok), why: last && !last.ok ? last.why : ""};
}
// 🤖 does the AI work NOW? Trainees' last attempts can all still read "failed" from while it was down: they are graded
// again by themselves only when each trainee next opens the course (js/cm-auto-grade.js). So before saying "AI grading
// looks down", the 🤖 AI check (js/cm-ai-check.js) is asked once, quietly, and the page drawn again with its answer:
// true = it answers (the gateway, or this site's own keys while the gateway refuses), false = it doesn't, null = not known yet
const aiNow = () => { const c = window.cmAiCheck, r = c && c.state && c.state.res; return r ? !!(r.ok || r.fallback) : null; };
let aiAsked = false;
function askAi(){
  const c = window.cmAiCheck; if(aiAsked || !c || typeof c.run !== "function" || (c.state && c.state.busy)) return;
  aiAsked = true;
  Promise.resolve().then(() => c.run()).then(() => { if(typeof render === "function") render(); }).catch(() => {});
}
// what an empty cell says instead of nothing: why this trainee has no grade there
const whyNone = (r, id) => { if(id === "sa" || id === "pa"){ const a = aiState(r); return a.failed ? `grading failed: ${a.why}` : "not graded yet"; } return "not done yet"; };
const noneCell = (r, id, f) => { const w = whyNone(r, id); return {v: w, csv: w, f: f || w, cls: "gs-num bs-why", html: `<small class="bs-why">${E(w)}</small>`}; };
const EXTRA = {
  kc: {head: ["Passed", "Attempts"], cells: (r, c, items) => { const dp = c.rec.dayProgress || {}, n = cfDaysL().length, p = items.filter(i => i.pct >= 70 && !i.unconfirmed).length;
    const a = cfDaysL().reduce((s, d) => s + (((dp[d.id] || {}).history || []).length || ((dp[d.id] || {}).score != null ? 1 : 0)), 0);
    return [cnt(`${p} / ${n}`, `${p} of ${n} days passed (70%)`, p === n ? "gs-hi" : ""), cnt(a, `${a} Knowledge Check attempts in all`)]; }},
  lc: {head: ["Trainer-scored", "Awaiting trainer"], cells: (r, c, items) => { const w = items.filter(i => i.auto).length;
    return [cnt(`${items.length - w} / ${items.length}`, "Learning Checks with the trainer's 40% in"), cnt(w || "", `${w} awaiting the trainer's 40%`, w ? "gs-mid" : "")]; }},
  // (each Skill Activity's latest attempt, once: js/cm-scorecard.js skillActs, the work log's and the grader's with its
  // rubric parts, js/cm-ai-grader.js subs)
  sa: {head: ["Accuracy", "Presence", "Risk", "Efficiency"], cells: (r, c) => { let xs = []; try{ xs = (window.cmScorecard && cmScorecard.skillActs ? cmScorecard.skillActs(c) : []).filter(x => x && x.subs); }catch(e){ xs = []; }
    if(!xs.length){ const graded = (() => { try{ return (cmScorecard.skillActs(c) || []).length; }catch(e){ return 0; } })();
      const w = graded ? "no rubric parts kept" : whyNone(r, "sa"); return [{v: w, f: graded ? "Graded before the grader kept the rubric's four parts: only its total" : w, cls: "gs-num bs-why"}].concat([0, 0, 0].map(() => ({v: "—", f: w, cls: "gs-num"}))); }
    return ["accuracy", "presence", "risk", "efficiency"].map(k => { const a = avgOf(xs.map(x => x.subs[k])); return {v: pct(a), f: a == null ? "" : `Average ${k} across ${xs.length} graded Skill Activit${xs.length === 1 ? "y" : "ies"} (the latest attempt of each) = ${a}%`, cls: "gs-num " + tone(a)}; }); }},
  cms: {head: ["Filed", "First time right"], cells: (r, c) => { const xs = Object.values(c.data["doc-filing"] || {}).filter(x => x && x.attempts > 0), f = xs.filter(x => x.filed).length, ft = xs.filter(x => x.filed && x.attempts === 1).length;
    return [cnt(`${f} / ${xs.length}`, `${f} of ${xs.length} documents filed`), cnt(ft, `${ft} filed right on the first attempt`)]; }},
  bd: {head: ["Passed"], cells: (r, c, items) => { const p = items.filter(i => i.pct >= 70).length; return [cnt(`${p} / ${items.length}`, `${p} of ${items.length} graded days at 70% or more`)]; }},
  ns: {head: ["Checks passed"], cells: (r, c) => { let p = 0, t = 0; Object.values((c.data["net-sheet"] || {}).files || {}).forEach(f => Object.values((f && f.checks) || {}).forEach(k => { if(k && k.total){ p += k.passed; t += k.total; } }));
    return [cnt(t ? `${p} / ${t}` : "", `${p} of ${t} Net Sheet checks passed`)]; }},
  sb: {head: ["Tools used", "Runs"], cells: (r, c) => { const pp = c.data["practice-progress"] || c.rec.practiceProgress || {}, xs = Object.values(pp).filter(v => v && v.runs);
    return [cnt(`${xs.length} / ${tools().length}`, "Skill Builders used"), cnt(xs.reduce((s, v) => s + v.runs, 0) || "", "Runs in all")]; }},
  gc: {head: ["Calls"], cells: (r, c) => { const n = Object.values((c.callsim && c.callsim.best) || {}).reduce((s, b) => s + ((b && b.calls) || 0), 0); return [cnt(n || "", `${n} graded calls on the Call Sim`)]; }},
  cc: {head: ["Calls", "Missed injected"], cells: (r, c) => { const h = (c.data.roleplayHistory || []).filter(x => x && x.categoryId === "caseflow" && typeof x.score === "number").length;
    const m = Object.values(((c.data["case-flow"] || {}).injects) || {}).filter(x => x && x.outcome === "missed").length; return [cnt(h || "", `${h} graded case calls`), cnt(m || "", `${m} injected calls missed`, m ? "gs-lo" : "")]; }},
  ps: {head: ["Runs"], cells: (r, c) => { const n = Object.values((c.sim && c.sim.best) || {}).reduce((s, b) => s + ((b && b.count) || 1), 0); return [cnt(n || "", `${n} simulator runs`)]; }}
};
function systemTable(ppl, s){
  const per = ppl.map(r => { const c = ctxFor(r); let items = []; try{ items = (s.items(c) || []).filter(x => x && x.pct != null); }catch(e){ items = []; } return {r, c, items}; });
  const cols = []; per.forEach(p => p.items.forEach(i => { if(!cols.includes(i.name)) cols.push(i.name); }));
  if(/^(kc|tk|bd|sa|ap)$/.test(s.id)) cols.sort((a, b) => (parseInt(a.replace(/\D+/, ""), 10) || 0) - (parseInt(b.replace(/\D+/, ""), 10) || 0));
  const X = EXTRA[s.id] || {head: [], cells: () => []};
  return {id: "sys", title: `${s.icon} ${s.label}`, 
    head: ["Trainee", "Average", "Graded"].concat(X.head, cols),
    // (🛡 an unconfirmed item, a score only the trainee's device holds, is shown in its column and never averaged or
    //  counted, as the Scorecard's compute leaves it out)
    rows: per.map(({r, c, items}) => { const counted = items.filter(i => !i.unconfirmed), a = avgOf(counted.map(i => i.pct));
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name"}, a == null ? noneCell(r, s.id) : {v: pct(a), f: `The average of ${counted.length} = ${a}%`, cls: "gs-num gs-calc gs-bold " + tone(a)}, cnt(counted.length, `${counted.length} graded`)]
        .concat(X.cells(r, c, counted), cols.map(n => { const i = items.find(x => x.name === n); return !i ? {v: "", f: `${n}: not graded yet`}
          : i.unconfirmed ? {v: "Unconfirmed", f: `${n}: ${i.pct}%${i.note ? " · " + i.note : ""}`, cls: "gs-num gs-mid"}
          : {v: pct(i.pct), f: `${n}: ${i.pct}%${i.note ? " · " + i.note : ""}`, cls: "gs-num " + tone(i.pct)}; })); }),
    empty: "No trainee here yet."};
}
// 🧮 every grading system in ONE table: a group of columns per system (its Average, Graded, its own counts, then its items),
// a row per trainee — each trainee's every record in one place, no tab to pick
function allSystemsTable(ppl, S){
  const ts = S.map(s => systemTable(ppl, s));
  return {id: "systems", title: "🧮 Grading systems: every record", note: "Every grading system side by side, a group of columns each: its average, how many are graded, its own counts, then each graded item. Scroll sideways for the rest.",
    groups: [{label: "", span: 1}].concat(ts.map(t => ({label: t.title, span: t.head.length - 1}))),
    head: ["Trainee"].concat(...ts.map(t => t.head.slice(1))),
    rows: ppl.map((r, i) => [ts[0] ? ts[0].rows[i][0] : {v: nameOf(r), f: nameOf(r), cls: "gs-name"}].concat(...ts.map(t => t.rows[i].slice(1)))),
    empty: "No trainee here yet."};
}
/* ============================================================
   🏅 THE ONE SCORES TABLE, the feedback on practical activities and ⬇ Download, for the 🏅 Scorecard page
   (js/cm-scorecard.js renderAll calls scoresSheet, feedbackHtml and csvTables with its rows: {id, name, batch, c, m, sc})
   ============================================================ */
// a Scorecard row as this file's trainee record: the records the Scorecard read (c), so both read one trainee the same way
const RECS = new WeakMap();
function recOf(x){
  if(!x || !x.c) return x; if(RECS.has(x)) return RECS.get(x);
  const c = x.c, r = Object.assign({}, c.rec || {}, {id: x.id, name: x.name, batch: x.batch,
    __extra: {data: c.data || {}, fb: (c.fb || {}).days || {}, fbRec: c.fb || {days: {}}}, __ctx: c});
  RECS.set(x, r); return r;
}
// ✍️ a day's Knowledge Check: the best score kept (js/cm-scorecard.js kcBest, the record only), its attempts and its pass
function kcOf(r, d){
  const S = window.cmScorecard, ctx = ctxFor(r), cf0 = ((r.caseFlow || {}).days || {})[d.cf.n], cfd = cf0 && typeof cf0 === "object" && (cf0.id == null || String(cf0.id) === String(d.id)) ? cf0 : {}, rp = (r.dayProgress || {})[d.id] || {};
  const kc = num(S && S.kcBest ? S.kcBest(rp, cfd) : (cfd.kc != null ? cfd.kc : rp.score)), ok = S && S.kcPassed ? !!S.kcPassed(ctx, d) : kc != null && kc >= 70;
  const tries = (rp.history || []).length || rp.kcAttempts || (kc != null ? 1 : 0), dev = kc == null && S && S.kcDevice ? num(S.kcDevice(ctx, d)) : null;
  return {d, kc, ok, tries, dev};
}
const kcLine = x => x.kc != null ? `${dayLabel(x.d)}: best ${x.kc}% of ${x.tries} attempt${x.tries === 1 ? "" : "s"}${x.ok ? " · passed" : " · not passed yet (70%)"}`
  : x.dev != null ? `${dayLabel(x.d)}: ${x.dev}% on the trainee's device only, not counted (🛠 Account Repair can restore it)` : `${dayLabel(x.d)}: not taken yet`;
// the columns by kind of work: each the average of cmScorecard.compute's graded items of its grading systems
const KINDS = [
  ["✍️ Knowledge Checks %", ["kc"], "each day's Knowledge Check, its best score (70% passes the day)", "best Knowledge Check per day"],
  ["🧪 Practical activities %", ["sa", "cc"], "the Skill Activities (the grader) and the graded calls on John Doe's file, the latest attempt of each", "Skill Activities and calls"],
  ["📂 Backup Drive %", ["bd"], "Day 1's folders and each day's Backup File Maintenance, graded from the trainee's Drive", "folders and Backup File Maintenance"],
  ["🗂 CMS file %", ["cms"], "John Doe's case file in the CMS, against what a correct file holds by that day", "the CMS file against a correct one"],
  ["📝 Action Plan %", ["ap"], "each action plan: the share of the steps it must hold", "the steps each plan holds"]];
const PRACT = new Set(["sa", "call", "bd", "ap", "cmsf"]);
// a day's work in one line: "KC 90% · 3 activities avg 78% · 12 docs filed (9 first time) · Drive 85%"
// (the day's work as [label, value] pairs: the Day % cell shows them as a small table, the ⬇ Download as one line)
function dayBits(r, d, parts){
  const n = d.cf.n, out = [], dd = docDay(), sc = g => parts.filter(x => g.includes(x.grp) && x.pct != null);
  const kc = sc(["kc"])[0]; if(kc) out.push(["KC", `${kc.pct}%`, `KC ${kc.pct}%`, kc.pct]);
  const a = sc(["sa", "call"]); if(a.length) out.push(["Activities", `${a.length} · avg ${dayAvg(a)}%`, `${a.length} activit${a.length === 1 ? "y" : "ies"} avg ${dayAvg(a)}%`, dayAvg(a)]);
  const docs = Object.entries(dataOf(r)["doc-filing"] || {}).filter(([id, x]) => x && x.attempts > 0 && dd[id] === n).map(([, x]) => x);
  if(docs.length){ const f = docs.filter(x => x.filed), ft = f.filter(x => x.attempts === 1).length, rf = docs.length - f.length;
    out.push(["Docs filed", `${f.length} (${ft} first time)${rf ? ` · ${rf} refused` : ""}`, `${f.length} doc${f.length === 1 ? "" : "s"} filed (${ft} first time)${rf ? `, ${rf} refused` : ""}`, null]); }
  const ap = sc(["ap"]); if(ap.length) out.push(["Plan", `${dayAvg(ap)}%`, `Plan ${dayAvg(ap)}%`, dayAvg(ap)]);
  const bd = sc(["bd"]); if(bd.length) out.push(["Drive", `${dayAvg(bd)}%`, `Drive ${dayAvg(bd)}%`, dayAvg(bd)]);
  return out;
}
function daySummary(r, d, parts){ return dayBits(r, d, parts).map(b => b[2]).join(" · "); }
// the Day % cell: the day's score, then its slides and work as a small table (label | value)
function dayCellHtml(v, s, bits){
  const slides = s.line ? [["Slides", s.line.replace(/^Slides\s*/, "") || "—", null]] : [];
  const rows = slides.concat(bits.map(b => [b[0], b[1], b[3]]));
  // (a grid, not a nested <table>: the sheet's rows and cells stay the sheet's own)
  return `<b>${v == null ? "—" : v + "%"}</b>${rows.length ? `<span class="bs-dc-t" role="table">${rows.map(([l, x]) => `<span class="bs-dc-r" role="row"><span class="bs-dc-l" role="rowheader">${E(l)}</span><span class="bs-dc-v" role="cell">${E(x)}</span></span>`).join("")}</span>` : ""}`;
}
// 🏅 Scores: one row per trainee (the Scorecard's rows), sorted by the Overall, nothing scored last
function scoresSheet(rows){
  const L = cfDaysL(), S = window.cmScorecard || {}, M = S.model || {STATUS: {}, PASS: 80};
  const per = (rows || []).map(x => { const r = recOf(x), o = ovOf(r); return {x, r, o, ov: o ? o.pct : null, sc: x.sc || scoreOf(r)}; })
    .sort((a, b) => (a.ov == null) - (b.ov == null) || (b.ov || 0) - (a.ov || 0) || nameOf(a.r).localeCompare(nameOf(b.r)));
  const kindAvg = (sc, ids) => { const xs = [].concat(...((sc && sc.rows) || []).filter(y => ids.includes(y.s.id)).map(y => y.items.filter(i => !i.unconfirmed)));
    return {a: avgOf(xs.map(i => i.pct)), xs}; };
  // (a column with no result for any trainee shown is left out, and named on one quiet line under the table)
  const K = KINDS.filter(([, ids]) => per.some(p => kindAvg(p.sc, ids).a != null)), none = KINDS.filter(k => !K.includes(k));
  // (🤖 every trainee's newest AI Grader attempt failed: the AI grading is down, the 🤖 AI check says why)
  const ai = per.map(p => aiState(p.r)).filter(a => a.any), down = ai.length > 0 && ai.every(a => a.failed);
  const now = down ? aiNow() : null, waiting = ai.filter(a => a.failed).length;
  if(down && now === null) askAi();
  const T = {id: "scores", title: "🏅 Scores", order: per.map(p => p.x),
    warn: down && now === false ? `AI grading looks down: every trainee's latest Skill Activity grading failed (${ai[0].why}). Run 🤖 the AI check (⚡ Run now) to see why.` : "",
    info: down && now === true ? `🤖 AI grading works again (the AI check passed). ${waiting} trainee${waiting === 1 ? "'s" : "s'"} last grading failed while it was down: each is graded again by itself the next time that trainee opens the course.` : "",
    none: none.length ? `No results yet: ${none.map(k => k[0].replace(/ %$/, "")).join(", ")}.` : "",
    note: "Click a trainee for their card. Hover a day for each thing they did that day, with its score; hover ✍️ Knowledge Checks for each day's best, attempts and pass.",
    foot: `What each column measures: Day 1–5 = the day's score (100-point model) · its slides · its work; ${K.map(k => `${k[0].replace(/ %$/, "").replace(/^\S+ /, "")} = ${k[3]}`).join("; ")}; Overall = the 100-point model's Final; Result = a pass at ${M.PASS}% with the safety gate at 100%.`,
    head: ["Trainee", "Batch", "Registered", "Days passed"].concat(L.map(d => `${dayLabel(d)} %`), K.map(k => k[0]), ["Overall %", "Result"]),
    rows: per.map(({r, o, ov, sc}) => {
      const reg = T0(r.registeredAt), bt = typeof batchShow === "function" ? (batchShow(r.batch) || r.batch || "") : (r.batch || ""), evs = eventsOf(r);
      // (📤 Send progress, js/cm-send-progress.js: from the row too, without opening the card)
      return [{v: nameOf(r), f: nameOf(r), cls: "gs-name", html: window.cmSendProgress && state.isAdmin ? `${E(nameOf(r))}<button type="button" class="sp-row" aria-label="Send ${E(nameOf(r))} their progress" title="📤 Send ${E(nameOf(r))} their progress" onclick="event.stopPropagation();cmSendProgress.open('${E(String(r.id).replace(/\\/g, "\\\\").replace(/'/g, "\\'"))}')"></button>` : null}, {v: bt, f: r.batch || "", cls: "gs-batch"},
        {v: [reg ? dTime(r.registeredAt) : "", bt].filter(Boolean).join(" · "), f: reg ? `Registered ${reg.toLocaleString()}${bt ? " in " + bt : ""}` : "Registration date not recorded", cls: "bs-reg"},
        {v: sc ? `${sc.done} / ${sc.total}` : "", f: sc ? `${sc.done} of the ${sc.total} Case Flow days passed (70% on the Knowledge Check passes a day)` : "", cls: "gs-num"}]
        .concat(L.map(d => { const v = dayS(r, d), parts = dayParts(r, d), s = slidesOf(r, d), bits = dayBits(r, d, parts), sum = bits.map(b => b[2]).join(" · "), ev = evs.filter(e => e.n === d.cf.n);
          const f = [daySTip(r, d), lessonText(r, d)].concat(ev.length ? ["Newest first:"].concat(ev.slice(0, 30).map(e => `${dTime(e.at)} · ${e.what} · ${e.detail}${e.score != null ? " · " + e.score + "%" : ""}`), ev.length > 30 ? [`and ${ev.length - 30} more (⬇ Download has every one)`] : []) : ["Nothing done on this day yet."]).join("\n");
          return {v: pct(v), csv: [pct(v) || "—", s.line, sum].filter(Boolean).join(" · "), f, cls: "gs-num bs-dc " + tone(v),
            html: dayCellHtml(v, s, bits)}; }),
          K.map(([l, ids]) => { const k = kindAvg(sc, ids), first = ids[0] === "kc";
            const f = first ? ["Each day's Knowledge Check (the best score kept):"].concat(L.map(d => kcLine(kcOf(r, d)))).join("\n")
              : k.a == null ? `${l.replace(/ %$/, "")}: nothing graded yet` : `${l.replace(/ %$/, "")}: the average of ${k.xs.length} = ${k.a}%\n` + k.xs.slice(0, 20).map(x => `${x.name} ${x.pct}%`).join("\n");
            return k.a == null ? noneCell(r, ids.includes("sa") ? "pa" : ids[0], f) : {v: pct(k.a), f, cls: "gs-num " + tone(k.a)}; }),
          [{v: pct(ov), f: o ? o.why : "Nothing scored yet", cls: "gs-num gs-calc gs-bold " + tone(ov)},
           {v: o ? (M.STATUS[o.status] || "") : "", f: `Pass = Overall ≥ ${M.PASS}% and the safety gate at 100%`, cls: o && o.status === "pass" ? "gs-hi" : !o || o.status === "none" ? "" : o.status === "pending" ? "gs-mid" : "gs-lo"}]); }),
    empty: "No approved trainee in this batch yet."};
  return T;
}
/* 💬 FEEDBACK ON PRACTICAL ACTIVITIES, in the trainee's card: Day 1 … Day 5, each practical activity graded that day (the Skill
   Activities and calls, the Backup Drive's folders and Backup File Maintenance, the Action Plans, the CMS file and the case
   exercises) with its score, ⭐ what they did well, 🔧 what to improve and 🧾 why: the graders' own words (dayParts) */
function practOf(r, d, cx){
  return dayParts(r, d).filter(x => PRACT.has(x.grp))
    .concat(cx.filter(i => Number(i.day) === Number(d.cf.n)).map(i => ({grp: "cx", name: `🔎 ${clip(i.name, 90)}`, pct: num(i.pct), status: "Case exercise", why: String(i.note || "").replace(/^Day \d+ · /, ""), best: [], improve: []})));
}
function cxOf(r){ try{ const s = ((window.cmScorecard || {}).sources || []).find(x => x.id === "cx"); return s ? (s.items(ctxFor(r)) || []).filter(i => i && i.pct != null) : []; }catch(e){ return []; } }
const said = (xs, none) => xs && xs.length ? xs.map(x => E(String(x).replace(/\s+$/, ""))).join(" · ") : `<i>${none}</i>`;
/* the grader's "to improve" notes split in two: the finding (before its →) and the fix (after it); a note that is only advice
   ("Practice…", "Build…", "Before…") is a fix */
const ADVICE = /^(practice|build|before|try|next time|keep|always|start|make|write|use|re-?do|redo)\b/i;
function splitImprove(xs){
  const fix = [], better = [];
  (xs || []).forEach(t => { t = String(t || "").trim(); if(!t) return; const i = t.indexOf("→");
    if(i > 0){ fix.push(t.slice(0, i).trim()); better.push(t.slice(i + 1).trim()); }
    else if(ADVICE.test(t)) better.push(t); else fix.push(t); });
  return {fix, better};
}
/* 🚩 a red flag: a finding that puts the client, the file or the firm at risk, named for why */
// (each needs the problem itself — a mismatch, a disclosure, a date not set — not only the topic's name)
const FLAGS = [
  [/\b(wrong|mismatch\w*|different|doesn'?t match|does not match|instead of)\b[^.]*\b(case id|snapshot id|matter|client'?s? file)|\b(case id|snapshot id)\b[^.]*\b(but|wrong|mismatch\w*|doesn'?t match|does not match)\b|another client'?s/i, "Wrong file or Case ID: work filed on the wrong matter can't be found and can expose another client's file."],
  [/\b(gave|giving|gives|offered|told \w+ (the|his|her|their) (case|claim) (is|was))\b[^.]*\b(legal advice|advice|opinion)|\bUPL\b|\bpredict\w* (an |the |his |her )?outcome|\boutcome predicted/i, "Legal advice or an outcome predicted: only the attorney may advise the client (unauthorized practice of law)."],
  [/\b(shared|disclosed|exposed|sent|forwarded|leaked|waived|breach\w*)\b[^.]*\b(privilege\w*|HIPAA|confidential\w*|medical records?|PHI)\b|\b(privilege\w*|confidential\w*)\b[^.]*\b(shared|disclosed|exposed|waived|breach\w*)\b/i, "Privacy or privilege: client information shared or left unprotected."],
  [/\b(was |were |is |are )?(never set|not set|not calendared|not docketed|missed|not on the calendar)\b|\bSOL\b[^.]*\b(wrong|missing|not)\b/i, "A date not set or missed: a missed deadline can cost the client the claim."],
  [/\b(refused|not filed|(isn'?t|is not|not) on the drive|not backed up|never filed)\b/i, "A required document not filed or backed up: the file is incomplete and the work can't be found."]
];
function redFlags(y){
  const out = [], seen = new Set();
  // (the CMS case file's "to improve" is the list of entries the file lacks: one flag, the file incomplete, with the count)
  if(/CMS case file/i.test(y.name || "")){ const n = (y.improve || []).length || Number((/(\d+) missing/.exec(y.status || "") || [])[1]) || 0;
    return n ? [{why: "The client's file is incomplete: anyone who opens it works from missing facts and dates.", quote: `${n} required entr${n === 1 ? "y is" : "ies are"} missing from the CMS file`}] : []; }
  // (a note that says the problem did NOT happen — "Nothing in the record gives legal advice" — is no flag)
  (y.improve || []).concat(y.why ? [y.why] : []).forEach(t => { t = String(t || ""); if(/^\s*(nothing|no |none|never (gave|shared|disclosed))/i.test(t)) return; FLAGS.forEach(([re, why]) => {
    if(seen.has(why) || !re.test(t)) return; seen.add(why); out.push({why, quote: clip(t.split("→")[0].trim(), 140)}); }); });
  return out;
}
const lis = (xs, none) => xs && xs.length ? `<ul>${xs.map(x => `<li>${E(String(x).replace(/\s+$/, ""))}</li>`).join("")}</ul>` : `<i>${none}</i>`;
function fbRowHtml(y){
  const sp = splitImprove(y.improve), fl = redFlags(y), cms = /CMS case file/i.test(y.name || "");
  return `<tr class="bs-fb-it"><th scope="row" class="bs-fb-act"><span class="bs-fb-n">${E(y.name)}</span>${y.status ? `<small>${E(y.status)}</small>` : ""}</th>
    <td class="bs-best">${lis(y.best, "Nothing noted by the grader.")}</td>
    <td class="bs-imp">${lis(sp.fix, "Nothing noted by the grader.")}${cms ? `<p class="bs-fb-see">📋 Every missing item is listed in the 🗂 CMS Case File table, under “What the file is missing”.</p>` : ""}</td>
    <td class="bs-why">${y.why ? E(y.why) : "<i>No reason recorded.</i>"}</td>
    <td class="bs-better">${lis(sp.better, "—")}</td>
    <td class="bs-flag">${fl.length ? fl.map(f => `<p><b>🚩 ${E(f.why)}</b><q>${E(f.quote)}</q></p>`).join("") : "<i>None</i>"}</td>
    <td class="bs-fb-sc"><b class="${tone(y.pct)}">${y.pct != null ? y.pct + "%" : "—"}</b></td></tr>`;
}
// top: HTML put first in the section (js/cm-scorecard.js gives its 🎯 Focus on table, so a trainer's card has one place for what to work on)
function feedbackHtml(x, top){
  const r = recOf(x), L = cfDaysL(), cx = cxOf(r); if(!r || !L.length) return top || "";
  return `<section class="bs-fb" id="bs-fb-${E(String(r.id).replace(/[^A-Za-z0-9_-]/g, "_"))}"><h4>💬 Feedback on Practical Activities</h4>
    ${top || ""}<p class="bs-fb-note">Each practical activity of the day, as its grader marked it: what they did well, what to improve, why, what could have been done better, any 🚩 red flag (and why it is one), and the score.</p>
    ${L.map(d => { const xs = practOf(r, d, cx), sc = xs.filter(y => y.pct != null), a = dayAvg(sc), k = r.id + "|" + d.id, open = !!B.fbOpen[k];
      return `<details class="bs-fb-day" data-day="${d.cf.n}"${open ? " open" : ""} ontoggle="cmBatchSheet.fbOpen('${E(k)}', this.open)"><summary><b>${dayLabel(d)}</b><span>${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</span><em class="${tone(a)}">${xs.length ? `${xs.length} activit${xs.length === 1 ? "y" : "ies"}${a != null ? ` · avg ${a}%` : ""}` : "Nothing yet"}</em></summary>
        ${xs.length ? `<div class="bs-fb-wrap"><table class="bs-fb-t"><thead><tr><th>Activity</th><th>⭐ What they did well</th><th>🔧 What to improve</th><th>🧾 Why</th><th>💡 What could have been done better</th><th>🚩 Red flag</th><th>Score</th></tr></thead>
          <tbody>${xs.map(fbRowHtml).join("")}</tbody></table></div>` : `<p class="bs-none">No practical activity on this day yet.</p>`}</details>`; }).join("")}</section>`;
}
function feedbackTable(recs){
  const rows = []; recs.forEach(r => { const cx = cxOf(r); cfDaysL().forEach(d => practOf(r, d, cx).forEach(y => { const sp = splitImprove(y.improve);
    rows.push([nameOf(r), dayLabel(d), y.name, y.status || "", (y.best || []).join(" · "), sp.fix.join(" · "), y.why || "", sp.better.join(" · "), redFlags(y).map(f => `${f.why} (“${f.quote}”)`).join(" · "), pct(y.pct)].map(v => ({v}))); })); });
  return {id: "feedback", title: "💬 Feedback on Practical Activities", head: ["Trainee", "Day", "Activity", "Status", "⭐ What they did well", "🔧 What to improve", "🧾 Why", "💡 What could have been done better", "🚩 Red flag", "Score"], rows};
}
// everyone registered in the batch shown (waiting for approval and archived too, not rejected, not merged away): 📚 Lessons and
// 🕒 Recent progress list them all, with the records the Scorecard read for the ones it scores
function everyone(recs, inBatch){
  const by = new Map(recs.map(r => [r.id, r])), all = (state.adminData || []).filter(r => r && !r.rejected && (!inBatch || inBatch(r)));
  const xs = (MA() ? MA().live(all) : all).map(r => by.get(r.id) || r);
  recs.forEach(r => { if(!xs.some(x => x.id === r.id)) xs.push(r); });
  return xs.sort((a, b) => nameOf(a).localeCompare(nameOf(b)));
}
// ⬇ Download: the 🏅 Scores table first, then every table the page folds in (more: the Scorecard's own, e.g. its model in full)
function csvTables(rows, more, inBatch){
  const recs = (rows || []).map(recOf), S = (window.cmScorecard && cmScorecard.sources) || [], all = everyone(recs, inBatch);
  return [scoresSheet(rows), kcTable(recs), lessonsTable(all)].concat(S.length ? [allSystemsTable(recs, S)] : [], [recentTable(all), feedbackTable(recs)], more || [], [dayTable(recs)], cfDaysL().map(d => scoreCardTable(recs, d)));
}
function download(tables, name){
  const q = v => { const s = String(v == null ? "" : v); return `"${(/^[=+\-@\t\r]/.test(s) ? "'" + s : s).replace(/"/g, '""')}"`; };
  const lines = []; tables.forEach((t, i) => { if(tables.length > 1 || i){ lines.push(q(t.title)); } 
    // (a table in groups of columns: the group names above its headers, so a day's or a system's columns say whose they are)
    if(t.groups) lines.push([].concat(...t.groups.map(g => [g.label].concat(Array(Math.max(0, g.span - 1)).fill("")))).map(q).join(","));
    lines.push(t.head.map(q).join(",")); t.rows.forEach(r => lines.push(r.map(c => q(c.csv != null ? c.csv : c.v)).join(","))); lines.push(""); });
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], {type: "text/csv"}));
  a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}
// the old 📋 Batch Sheet tab opens the one page
window.renderAdminBatchSheet = function(){ return typeof window.renderScorecardPage === "function" ? window.renderScorecardPage() : ""; };
// 📤 a trainee's progress as it stands, for a report the trainer sends (js/cm-send-progress.js): the Overall and Result, each
// day's cell of 🏅 Scores (its score, slides and work), its practical activities with their feedback, and what is missing
function snapshot(x){
  const r = recOf(x), o = ovOf(r), M = (window.cmScorecard || {}).model || {STATUS: {}}, cx = cxOf(r), missing = [];
  const days = cfDaysL().map(d => { const parts = dayParts(r, d), k = kcOf(r, d), s = slidesOf(r, d), n = d.cf.n;
    if(k.kc != null && !k.ok) missing.push(`Day ${n}: Knowledge Check ${k.kc}%, below 70%`);
    parts.filter(y => y.grp === "bd" && y.pct === 0 && /Not done/.test(y.status)).forEach(() => missing.push(`Day ${n}: Backup Drive not done`));
    parts.filter(y => y.pct == null && y.grp !== "kc" && y.status).forEach(y => missing.push(`Day ${n}: ${y.name.replace(/^\S+\s/, "")}: ${y.status}`));
    return {n, title: String(d.title).replace(/^Case Flow Day \d+ · /, ""), score: dayS(r, d), slides: s.line, summary: daySummary(r, d, parts),
      practical: practOf(r, d, cx).map(y => ({name: y.name, pct: y.pct, status: y.status || "", best: (y.best || []).slice(0, 3), improve: (y.improve || []).slice(0, 3), why: clip(y.why || "", 300)}))}; });
  const a = aiState(r); if(a.failed) missing.push(`Skill Activity grading failed: ${a.why}`);
  return {name: nameOf(r), overall: o ? o.pct : null, result: o ? (M.STATUS[o.status] || "") : "", pass: !!(o && o.status === "pass"), days, missing};
}
window.cmBatchSheet = {
  _askAiAgain: () => { aiAsked = false; },   // (checks: the quiet AI check is asked once a page; this lets a check ask again)
  scoresSheet, feedbackHtml, csvTables, download, recOf, eventsOf, snapshot,
  fbOpen(k, open){ B.fbOpen[k] = !!open; },
  // 👥 duplicate accounts: drawn on 🛡 Admin Master Control → 👥 Trainee Audit (js/cm-audit-table.js)
  dupHtml, dupKeep(key, id){ B.dupKeep = B.dupKeep || {}; B.dupKeep[key] = id; redraw(); },
  dupMerge,
  recentTable,   // (🕒 Recent progress: read by .github/scripts/kc-device-views.cjs)
  dayParts,   // a trainee's deliverables of a day, as the feedback and 🏅 My Scores read them (.github/scripts/ai-grading-recovery.cjs)
  myOpen(id){ MY.open = MY.open === id ? null : id; render(); },
  refresh(){ if(window.cmScorecard && cmScorecard.refresh) cmScorecard.refresh(); else if(typeof refreshAdminData === "function") refreshAdminData(); },
  csv(only){ if(window.cmScorecard && cmScorecard.csv) cmScorecard.csv(only); }
};
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
// what this device saved (index.html's mem): the Case Flow record (the action plans' grades) and the grader's
const memOf = k => { try{ return typeof mem !== "undefined" && mem[k] && typeof mem[k] === "object" ? mem[k] : null; }catch(e){ return null; } };
function myRec(){
  // 🛡 the same records as 🏅 My Performance (js/cm-scorecard.js myCtx): the cloud record, then this device's store, then
  // what it saved since, so My Scores and the trainer's Score Card read one trainee's work the same way
  let c = null; try{ c = window.cmScorecard && cmScorecard.myCtx ? cmScorecard.myCtx() : null; }catch(e){ c = null; }
  const data = Object.assign({}, c ? c.data : {});
  if(!data["drive-setup"] && MY.setup) data["drive-setup"] = MY.setup;
  if(!data["drive-grades"] && MY.grades) data["drive-grades"] = MY.grades;
  ["case-flow", "cf-ai-grades", "doc-filing", "cms-file"].forEach(k => { const v = memOf(k); if(v) data[k] = v; });
  if(!c){ data["day-progress"] = state.progress || {}; data["work-log"] = Array.isArray(state.workLog) ? state.workLog : []; data["task-log"] = Array.isArray(state.taskLog) ? state.taskLog : []; }
  let cf = c ? c.cf : {days: {}}; if(!c) try{ if(window.cmCaseFlow && cmCaseFlow.scoreSummary) cf = cmCaseFlow.scoreSummary() || cf; }catch(e){}
  const fbRec = c && c.fb && Object.keys(c.fb).length ? c.fb : null;
  return {id: state.traineeId || "me", name: state.traineeName || "Me", approved: true, dayProgress: c ? c.rec.dayProgress || {} : state.progress || {}, caseFlow: cf,
    // (🛡 and the Portal's and Call Simulator's records, as myOverall counts them: a Day 1 built on the Portal's Backup Drive)
    __extra: Object.assign({data, fb: state.myFeedback || (fbRec && fbRec.days) || {}}, fbRec ? {fbRec} : {}, c ? {sim: c.sim, callsim: c.callsim} : {})};
}
function myScoreCardHtml(){
  if(!isTraineeView()) return "";
  loadMine();
  const r = myRec(), L = cfDaysL(); if(!L.length) return "";
  // the Overall and each day's score: the same function and records as their 🏅 My Performance card (cmScorecard.myOverall)
  let mo = null; try{ mo = window.cmScorecard && cmScorecard.myOverall ? cmScorecard.myOverall() : null; }catch(e){ mo = null; }
  const per = L.map(d => dayParts(r, d)), avgs = L.map(d => { const x = mo && mo.days.find(y => y.id === d.id); return x ? x.S : null; }), all = mo ? mo.pct : null;
  // (only the kinds of score this trainee has: a column nobody can fill yet would only be noise)
  const cols = SC_COLS.filter(([g]) => per.some(xs => xs.some(x => g.split(",").includes(x.grp) && x.pct != null)));
  const cell = (xs, g) => { const gs = g.split(","), its = xs.filter(x => gs.includes(x.grp) && x.pct != null), a = avgOf(its.map(x => x.pct));
    return `<td class="${tone(a)}" title="${E(its.map(x => `${x.name.replace(/^\S+\s/, "")} ${x.pct}%`).join(" · "))}">${a == null ? "" : a + "%"}</td>`; };
  const li = (h, xs, cls) => xs.length ? `<div class="bs-ctx ${cls}"><b>${h}</b><ul>${xs.map(x => `<li>${E(x)}</li>`).join("")}</ul></div>` : "";
  const open = L.find(d => d.id === MY.open);
  return `<section class="card my-sc"><div class="my-sc-h"><h2>🏅 My Scores <span>day by day</span></h2>
      <span class="my-sc-all ${tone(all)}">${all == null ? "Nothing scored yet" : `Overall ${all}%`}</span></div>
    <p class="my-sc-sub">Only your own scores, the same ones your trainer sees. Click a day for each graded item: why it scored that way, what you did best and what to improve.</p>
    <div class="my-sc-wrap"><table class="my-sc-t"><thead><tr><th>Day</th>${cols.map(([, l]) => `<th>${E(l)}</th>`).join("")}<th>Day score</th><th>💬 Trainer</th></tr></thead><tbody>
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
/* 🏅 Scores (js/cm-scorecard.js renderAll): a day's cell is its score, its slides and a line of its work */
.scx-card td.bs-dc{white-space:normal !important;min-width:200px;max-width:260px;text-align:left;vertical-align:top;line-height:1.3;}
.scx-card td.bs-dc b{display:block;font-size:16px;} .scx-card td.bs-dc small{display:block;font:700 13.5px/1.3 Arial,sans-serif;color:#2E3450;}
.scx-card td.bs-dc small.bs-sl{color:#5F6368;}
.scx-card td.bs-reg{color:#3E4560;white-space:nowrap;}
.scx-card .bs-foot{margin:8px 0 0;} .scx-card .bs-none-line{margin:4px 0 0;color:#5F6368;font:600 14px Arial,sans-serif;}
.scx-card td.bs-why small.bs-why, .scx-card td.bs-why{color:#5F6368;font-weight:600;white-space:normal;}
.scx-card .bs-warn{margin:6px 0 8px;padding:8px 12px;border:2px solid #B42318;border-radius:8px;background:#FDECEC;color:#7A1A12;font:700 15px Arial,sans-serif;}
.scx-card .bs-info{margin:6px 0 8px;padding:8px 12px;border:2px solid #1d7a46;border-radius:8px;background:#EAF6EF;color:#14532d;font:700 15px Arial,sans-serif;}
.scx-card .bs-warn button{margin-left:8px;font:800 14px Arial,sans-serif;border:2px solid #B42318;background:#fff;color:#7A1A12;border-radius:6px;padding:3px 10px;cursor:pointer;}
/* headers wrap between words only (main's overflow-wrap:anywhere broke "Knowledg-e"); a column is as wide as its words */
.scx-card .gs th, .scx-card .gs td{overflow-wrap:normal !important;word-break:normal !important;hyphens:none;}
.scx-card .gs-head th{min-width:96px;max-width:180px;font-size:14.5px;white-space:normal;}
/* 💬 Feedback on Practical Activities, in the trainee's card */
.bs-fb{margin:14px 0 4px;padding:12px 14px;border:2px solid #1E2340;border-radius:12px;background:#F7F8FB;}
.bs-fb > h4{margin:-12px -14px 10px;padding:11px 16px;font:800 20px Arial,sans-serif;color:#fff;background:#1E2340;border-bottom:4px solid #DB8437;border-radius:10px 10px 0 0;letter-spacing:.01em;}   /* a navy band, white type: it stands out in the card */ .bs-fb-note{margin:0 0 8px;font:600 15px/1.4 Arial,sans-serif;color:#2E3450;}
.bs-fb-day{border:1px solid #C9CEDD;border-radius:10px;background:#fff;margin-top:8px;} .bs-fb-day > summary{cursor:pointer;padding:10px 14px;display:flex;gap:10px;align-items:center;font:800 16px Arial,sans-serif;color:#141A2E;}
.bs-fb-day > summary span{flex:1;font-weight:700;color:#2E3450;} .bs-fb-day > summary em{font-style:normal;font-weight:800;padding:2px 10px;border-radius:999px;background:#EEF0F6;}
.bs-fb-day > summary em.gs-hi, .bs-fb-h b.gs-hi{background:#E6F4EA;color:#0B5D1E;} .bs-fb-day > summary em.gs-mid, .bs-fb-h b.gs-mid{background:#FFF4E0;color:#7A4B00;} .bs-fb-day > summary em.gs-lo, .bs-fb-h b.gs-lo{background:#FDE8E8;color:#A50E0E;}
.bs-fb-it{border-top:1px solid #E3E6EF;padding:10px 14px;} .bs-fb-h{display:flex;gap:10px;align-items:baseline;font:800 16px Arial,sans-serif;color:#141A2E;}
.bs-fb-h span{flex:1;} .bs-fb-h small{color:#5F6368;font:700 14px Arial,sans-serif;} .bs-fb-h b{padding:2px 10px;border-radius:6px;background:#F1F3F4;white-space:nowrap;}
.bs-fb-l{margin:5px 0 0;font:600 15px/1.45 Arial,sans-serif;color:#2E3450;} .bs-fb-l > b{color:#141A2E;} .bs-fb-l i{color:#5F6368;}
.bs-fb-l.bs-best > b{color:#0B5D1E;} .bs-fb-l.bs-imp > b{color:#A50E0E;}
.bs-fb .bs-none{padding:10px 14px;margin:0;font:600 15px Arial,sans-serif;color:#5F6368;}
/* the day's feedback as one table: an activity a row */
.bs-fb-wrap{overflow-x:auto;border-top:1px solid #E3E6EF;}
.bs-fb-t{width:100%;min-width:1100px;border-collapse:collapse;font:600 14px/1.45 Arial,sans-serif;color:#2E3450;}
.bs-fb-t thead th{background:#262B45;color:#fff;font:800 14px Arial,sans-serif;text-align:left;padding:9px 10px;border-bottom:2px solid #DB8437;white-space:nowrap;}
.bs-fb-t td,.bs-fb-t tbody th{padding:9px 10px;border-top:1px solid #E3E6EF;vertical-align:top;text-align:left;}
.bs-fb-t tbody tr:nth-child(even) td,.bs-fb-t tbody tr:nth-child(even) th{background:#F8F9FC;}
.bs-fb-t .bs-fb-act{font:800 15px Arial,sans-serif;color:#141A2E;min-width:170px;max-width:230px;}
.bs-fb-t .bs-fb-act small{display:block;margin-top:3px;font:700 13px Arial,sans-serif;color:#5F6368;}
.bs-fb-t ul{margin:0;padding-left:18px;} .bs-fb-t li{margin:0 0 4px;} .bs-fb-t i{color:#5F6368;}
.bs-fb-t td.bs-best{min-width:180px;} .bs-fb-t td.bs-imp{min-width:200px;} .bs-fb-t td.bs-why{min-width:150px;color:#3E4560;} .bs-fb-t td.bs-better{min-width:200px;}
.bs-fb-t td.bs-flag{min-width:200px;} .bs-fb-t td.bs-flag p{margin:0 0 6px;} .bs-fb-t td.bs-flag b{display:block;color:#A50E0E;}
.bs-fb-t td.bs-flag q{display:block;margin-top:2px;color:#5F6368;font-weight:600;font-style:italic;}
.bs-fb-t td.bs-fb-sc{white-space:nowrap;text-align:center;} .bs-fb-t td.bs-fb-sc b{display:inline-block;padding:3px 10px;border-radius:6px;background:#F1F3F4;font:800 15px Arial,sans-serif;}
.bs-fb-t td.bs-fb-sc b.gs-hi{background:#E6F4EA;color:#0B5D1E;} .bs-fb-t td.bs-fb-sc b.gs-mid{background:#FFF4E0;color:#7A4B00;} .bs-fb-t td.bs-fb-sc b.gs-lo{background:#FCE8E6;color:#A50E0E;}
.bs-fb-see{margin:6px 0 0;font:700 13.5px Arial,sans-serif;color:#46508A;}
/* the Day % cell: the score, then the day's slides and work as a small table */
.scx-card td.bs-dc .bs-dc-t{display:grid;grid-template-columns:auto 1fr;margin-top:4px;font:700 13.5px/1.3 Arial,sans-serif;border:1px solid rgba(46,52,80,.16);border-radius:6px;overflow:hidden;background:rgba(255,255,255,.55);}
.scx-card td.bs-dc .bs-dc-r{display:contents;}
.scx-card td.bs-dc .bs-dc-l{color:#5F6368;padding:3px 8px;white-space:nowrap;border-top:1px solid rgba(46,52,80,.12);}
.scx-card td.bs-dc .bs-dc-v{color:#1E2340;padding:3px 8px 3px 0;border-top:1px solid rgba(46,52,80,.12);}
.scx-card td.bs-dc .bs-dc-r:first-child > span{border-top:0;}
.bs-ds-it{border-top:1px solid #E3E6EF;padding:10px 14px;} .bs-ds-h{display:flex;gap:10px;align-items:baseline;font:700 14.5px Arial,sans-serif;}
.bs-ds-h span{flex:1;} .bs-ds-h small{color:#5F6368;font-weight:600;} .bs-ds-h b{min-width:54px;text-align:center;padding:2px 8px;border-radius:6px;background:#F1F3F4;}
.bs-ds-h b.gs-hi{background:#E6F4EA;color:#0B5D1E;} .bs-ds-h b.gs-mid{background:#FFF4E0;color:#7A4B00;} .bs-ds-h b.gs-lo{background:#FDE8E8;color:#A50E0E;}
.bs-ctx{margin:6px 0 0;font:600 13.5px/1.45 Arial,sans-serif;color:#2E3450;} .bs-ctx b{display:block;color:#141A2E;} .bs-ctx p{margin:2px 0 0;} .bs-ctx ul{margin:2px 0 0 18px;padding:0;}
.bs-best b{color:#0B5D1E;} .bs-imp b{color:#A50E0E;}
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
