/* ============================================================
   🏆 RANKINGS & PROGRESS REPORT: Admin → 🏅 Scorecard → 🏆 Rankings & Progress Report (js/cm-admin-shell.js OWN.rankreport)

   The owner's batch sheet ("TRAINEE RANKINGS - <batch> - CM TRAINING"), as one table to screenshot into an email: a row
   per scored trainee of the picked batch, best first, every cell made from the Scorecard's own numbers:
     Rank            by the batch score (finish: the Overall's day scores over every day the batch reached, a day missed = 0), highest first; nothing scored last
     Trainee's Name  the registered name, and the nickname in quotes when the record has one (nickname / preferredName)
     Batch Score     the batch score and its Result (Pass = Overall ≥ 80% and the safety gate at 100%), with the Overall on the days scored when fewer than the batch reached
     Strength        the best of the model's four dimensions, the best graded items with their day, the AI's saved
                     strengths (cf-ai-grades / the work log, cmScorecard.skillActs) and the Knowledge Checks passed
     Challenges      the weakest dimensions, the lowest graded items, the AI's gaps, a Knowledge Check not passed, and
                     the activities that took several attempts
     General Attribute Rating  three Case Management attributes, ★ out of 5 from the model's dimensions (ATTRS below);
                     "N/A (insufficient data)" with fewer than 2 graded items behind it
     Red Flag        a safety-gate breach (UPL, privilege, hard dates, trust money, a trainer's critical item), far behind
                     the batch, or no graded output; else "None." and a line on what went well
     Endorsement     tiered from the Overall, the pass and the red flags (endorse below)
     Progress        "Until Day N" (the last Case Flow day reached) and "Days passed x/5" (cmScorecard.kcPassed)
   The trainer clicks any Strength, Challenges, Red Flag or Endorsement cell to rewrite it; the edit is kept in
   rankings:<batch> ({edits: {<trainee id>: {strength, challenges, redflag, endorsement}}}, admin-only on the Worker: a
   key in neither OWN nor PUBLIC_READ, which traineeWrite refuses) and ↺ Regenerate puts the generated text back.
   📋 Copy as image puts the table alone (no toolbar) on the clipboard as a PNG (an SVG foreignObject drawn on a canvas,
   no library), ⬇ Download PNG saves it, ⬇ CSV the same rows.
   🔗 Share link freezes what the table shows (snapshot(): the table's text and nothing else) as a public, read-only link
   for Management (worker-share.js: share:<128-bit token>, 7 / 30 / 90 days or no expiry); report.html?s=<token> opens it
   with no sign-in (openShared). The links are listed under the toolbar: Copy link, Update snapshot (same URL), Revoke.
   It reads: state.adminData (the ledger), progress / feedback:<id> (index.html loadAuditExtras, as the Batch Sheet),
   callsim / simresults:<id>, and the roster rule of every score table (js/cm-merged-away.js).
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const fin = x => typeof x === "number" && isFinite(x);
const clip = (t, n) => (t = String(t || "").replace(/\s+/g, " ").trim()).length > n ? t.slice(0, n - 1).replace(/\s+\S*$/, "") + "…" : t;
const mean = a => a.length ? a.reduce((n, x) => n + x, 0) / a.length : null;
const SC = () => window.cmScorecard || null;
const cfDays = () => (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d.cf);
const today = () => new Date().toLocaleDateString("en-US", {month: "long", day: "numeric", year: "numeric"});

/* ---------- the three attributes: the model's dimensions, by their weights (cm-scorecard.js MODEL.DIMS) ---------- */
// pc ⏱ Procedural Compliance & Timeliness 25% · na 🔍 Needs Assessment & Risk Identification 25% ·
// cp 🗺 Care/Action Plan Quality 30% · cd ✉️ Communication & Documentation 20%
const ATTRS = [
  {id: "case", label: "Case Analysis & Problem Solving", dims: ["na", "cp"]},
  {id: "comm", label: "Client Communication & Professionalism", dims: ["cd"]},
  {id: "flow", label: "CMS / Workflow Execution", dims: ["pc"]}];
const MIN_EVIDENCE = 2;
// ★ out of 5, in the rubric's bands: 90+ ★5 · 80–89 ★4 · 65–79 ★3 · 50–64 ★2 · below ★1
const starsOf = v => v >= 90 ? 5 : v >= 80 ? 4 : v >= 65 ? 3 : v >= 50 ? 2 : 1;
const starTxt = n => "★".repeat(n) + "☆".repeat(5 - n);
const NA = "N/A (insufficient data)";
const RESULT = {pass: "PASS", pending: "Pass pending (no critical item assessed yet)", below: "Not yet (below 80%)", gate: "Not yet (safety gate)", none: "Not scored yet"};
const FIELDS = ["strength", "challenges", "redflag", "endorsement"];
const COLS = ["Rank", "Trainee's Name", "Batch Score", "Strength", "Challenges", "General Attribute Rating", "Red Flag", "Endorsement", "Progress"];

/* what each dimension says about how a trainee works, in general terms (the Strength and Challenges summaries) */
const GOOD = {pc: "follows the firm's procedures in order and on time", na: "spots what a file needs and the risks in it",
  cp: "turns a file into clear, complete plans with owners and dates", cd: "communicates clearly and keeps the file well documented"};
const GAP = {pc: "doing each step the firm's way, in order and on time", na: "finding a file's gaps and risks before they cause harm",
  cp: "building complete plans, each step with an owner and a date", cd: "writing clear updates and keeping the file's notes and logs current"};
/* ---------- one trainee's row, generated ---------- */
const dayN = (it) => it && it.day ? `Day ${it.day}: ` : "";
// "Day 13 · Case Flow Day 3 · Demand Package — Skill Building" → "Demand Package"; a takeaway's review → "Takeaway"
const itemName = n => clip(String(n || "").replace(/^Day \d+[:·]?\s*/, "").replace(/^Case Flow Day \d+\s*·\s*/, "").replace(/\s+—\s+(Skill Building|CM Self-Summary)\s*$/, ""), 60);
const dimLabel = k => k.label;
function rowOf(r, c){
  const S = SC(), ov = S.overall(c), m = ov.m, dims = m.dims.filter(x => x.v != null), items = m.items || [];
  const sa = (() => { try{ return S.skillActs(c) || []; }catch(e){ return []; } })();
  const days = cfDays(), dp = (c.rec && c.rec.dayProgress) || {}, data = c.data || {};
  const passed = days.filter(d => { try{ return S.kcPassed(c, d); }catch(e){ return false; } }).length;
  const until = days.reduce((n, d) => { const x = ov.days.find(y => y.id === d.id);
    return dp[d.id] || (data["slide-progress"] || {})[d.id] || (data["day-progress"] || {})[d.id] || (x && x.S != null) ? d.cf.n : n; }, 0);
  const kcs = days.map(d => ({d, best: S.kcBest(dp[d.id], S.cfDay(c, d)), tries: ((dp[d.id] || {}).history || []).length, ok: S.kcPassed(c, d)}));

  // ⭐ Strength and 🔧 Challenges: a general summary of how the trainee works — the dimensions they are strong or weak in and
  // the habits their record shows — with no detail of a piece of work (no activity, day, score or AI quote: those are on
  // their 🏅 Scorecard)
  const st = [], ch = [];
  const top = dims.slice().sort((a, b) => b.v - a.v), low = dims.slice().sort((a, b) => a.v - b.v);
  const good = top.filter(x => x.v >= 80).slice(0, 2), weak = low.filter(x => x.v < 80).slice(0, 2);
  const and = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1] : xs[0] || "";
  if(good.length) st.push(`Strong in ${and(good.map(x => dimLabel(x.k)))}: ${and(good.map(x => GOOD[x.k.id] || "meets the firm's standard"))}.`);
  else if(top.length) st.push(`Strongest area so far is ${dimLabel(top[0].k)}, where they ${GOOD[top[0].k.id] || "are closest to the firm's standard"}, though not yet at the pass mark.`);
  const hi = items.filter(x => x.pct >= 80).length, share = items.length ? hi / items.length : 0;
  if(items.length >= 4 && share >= 0.7) st.push("Delivers accurate, complete work on most tasks.");
  else if(items.length >= 4 && share >= 0.4) st.push("Gets a good share of tasks right the first time.");
  if(passed) st.push(passed === days.length ? "Has a firm grasp of the lessons: every Knowledge Check passed." : passed >= Math.ceil(days.length / 2) ? "Understands most of the lessons taught so far." : "Is building an understanding of the lessons.");
  if(sa.length && sa.every(x => (x.tries || 1) <= 2) && share >= 0.4) st.push("Works independently, needing few retries.");
  const strength = st.length ? st.slice(0, 4).join(" ") : "No graded work yet to draw strengths from.";

  if(weak.length) ch.push(`Needs work on ${and(weak.map(x => dimLabel(x.k)))}: ${and(weak.map(x => GAP[x.k.id] || "meeting the firm's standard"))}.`);
  else if(low.length) ch.push(`No area below the pass mark; ${dimLabel(low[0].k)} has the most room to grow.`);
  const lo = items.filter(x => x.pct < 70).length;
  if(items.length >= 4 && lo / items.length >= 0.4) ch.push("Several tasks are incomplete or not yet to standard: finishing each step fully before moving on would help.");
  if(kcs.some(x => fin(x.best) && !x.ok)) ch.push("Some lessons need another review before the next day builds on them.");
  if(sa.some(x => (x.tries || 0) >= 3) || kcs.some(x => x.tries >= 2)) ch.push("Often needs several attempts to get a task right: checking the work against the instructions first would save time.");
  const challenges = ch.length ? ch.slice(0, 4).join(" ") : (items.length ? "No significant challenges in the graded work so far." : "No graded work yet: nothing handed in to assess.");

  // ★ the attributes
  const attrs = ATTRS.map(a => { const ds = m.dims.filter(x => a.dims.includes(x.k.id) && x.v != null), n = items.filter(x => a.dims.includes(x.dim)).length;
    const w = ds.reduce((t, x) => t + x.k.w, 0), v = ds.length ? Math.round(ds.reduce((t, x) => t + x.k.w * x.v, 0) / w) : null;
    return {label: a.label, v, n, stars: v == null || n < MIN_EVIDENCE ? NA : `${starTxt(starsOf(v))}`}; });

  // each Case Flow day's score and weight, for the batch score (finish): a day not done counts 0 there
  const dayS = (m.days || []).map(x => ({n: x.n, S: x.S, mult: x.mult || 1}));
  return {id: r.id, name: nameOf(r), pct: ov.pct, status: ov.status, m, passed, until, dayS, items: items.length, strength, challenges, attrs,
    breaches: m.gate.breaches, weakest: weak[0] ? dimLabel(weak[0].k) : low[0] ? dimLabel(low[0].k) : ""};
}
const nameOf = r => { const n = (typeof cleanName === "function" ? cleanName(r.name) : "") || String(r.name || r.id || "Trainee").slice(0, 80);
  const nick = String(r.nickname || r.nickName || r.preferredName || "").trim();
  return nick && nick.toLowerCase() !== n.toLowerCase() ? `${n} "${clip(nick, 30)}"` : n; };
const CRIT = () => (SC() && SC().model && SC().model.CRIT) || [];
// 🚩 and the endorsement, once the batch is known (far behind is read against the batch's furthest day)
// 🏁 THE ranking number, the batch score: the Overall's day scores (the 100-point model, weighted by complexity) over EVERY
// day the batch has reached, a day this trainee didn't do counting 0. The Overall averages only the days a trainee has a
// score for, so one strong day outranked four full ones (the owner: "francis only attended 1 day of training and yet he
// ranks 1"). The Overall itself is unchanged and shown beside it.
const batchPct = (x, far) => { if(x.pct == null) return null; if(!far) return x.pct;
  const ds = (x.dayS || []).filter(d => d.n <= far), w = ds.reduce((t, d) => t + d.mult, 0);
  return w ? Math.round(ds.reduce((t, d) => t + (d.S == null ? 0 : d.S * d.mult), 0) / w) : x.pct; };
// each safety-gate item, said in general terms (the Red Flag)
const GATE = {upl: "gave the client legal advice, which only the attorney may do", priv: "shared privileged or private client information",
  date: "a hard date was missed or not set", trust: "client trust money was mishandled"};
const andList = xs => xs.length > 1 ? xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1] : xs[0] || "";
function finish(rows){
  const far = Math.max(0, ...rows.map(x => x.until));
  rows.forEach(x => {
    x.overallPct = x.pct; x.pct = batchPct(x, far);
    x.scoredDays = (x.dayS || []).filter(d => d.S != null && (!far || d.n <= far)).length; x.far = far;
    x.behind = far >= 2 && far - x.until >= 2;
    const flags = [];
    // (a general statement of each risk — no day, activity or quote: those are on the trainee's 🏅 Scorecard. Worked out
    // from the record as it is now, so a flag the trainee repairs is gone the next time the report is drawn)
    if(x.breaches.length){ const ids = [...new Set(x.breaches.map(b => b.id))];
      flags.push(`⛔ Safety gate breached: ${andList(ids.map(id => GATE[id] || "a critical item was missed"))}.`); }
    if(!x.items) flags.push("No graded output yet: nothing handed in to grade.");
    if(x.behind) flags.push("Far behind the batch's pace.");
    x.redflag = flags.length ? flags.join(" ") : `None. ${x.status === "pass" ? "Every critical item assessed so far was met." : "Keeping pace with the batch."}`;
    const e = endorse(x); x.tier = e.tier; x.endorsement = e.text;
  });
  rows.sort((a, b) => (b.pct == null ? -1 : b.pct) - (a.pct == null ? -1 : a.pct) || a.name.localeCompare(b.name));
  rows.forEach((x, i) => { x.rank = i + 1; });
  return rows;
}
// the tiers: Highly Endorsed (≥ 90, passed) · Endorsed (≥ 80) · Endorsed with coaching (≥ 65, or ≥ 80 but far behind) · Not Yet
function endorse(x){
  const p = x.pct, coach = x.weakest ? ` Coach on ${x.weakest} first.` : "";
  if(!x.items || p == null) return {tier: "not", text: "Not Yet Endorsed for Independent Case Management Work. No graded work yet to assess."};
  if(x.breaches.length) return {tier: "not", text: "Not Yet Endorsed for Independent Case Management Work. The safety-gate breach must be retrained and re-assessed before any independent caseload."};
  if(p >= 90 && x.status === "pass" && !x.behind) return {tier: "high", text: "Highly Endorsed for Case Manager Roles. Exemplary across the scored days with every critical item met; ready for an independent caseload."};
  if(p >= 80 && !x.behind) return {tier: "endorsed", text: `Endorsed for Case Manager Roles. Proficient and ${x.status === "pass" ? "passing" : "on track to pass"}; ready for a standard caseload with routine review.`};
  if(p >= 65) return {tier: "coaching", text: `Endorsed with Coaching for Case Manager Roles. ${x.behind ? "Scores are sound but the course is not finished." : "Developing (65–79%)."}${coach}`};
  return {tier: "not", text: `Not Yet Endorsed for Independent Case Management Work. Below 65% overall; needs retraining and supervised practice.${coach}`};
}

/* ---------- the table (the admin page and the shared page draw the same one) ---------- */
// snap: {title, batch, date, rows: [{rank, name, overall, result, strength, challenges, attrs: [{label, stars}], redflag,
// endorsement, tier, progress, passed}]}; ed (admin only): {ids: [trainee id per row], over: {<id>: {<field>: true}}}
function tableHtml(snap, ed, foot){
  const cell = (r, i, f, cls) => { const id = ed && ed.ids[i], o = ed && ((ed.over[id] || {})[f]);
    return `<td class="rk-c ${cls || ""}"><div class="rk-t${ed ? " rk-ed" : ""}"${ed ? ` data-id="${E(id)}" data-f="${f}" tabindex="0" title="Click to edit"` : ""}>${E(r[f])}</div>${o ? `<button type="button" class="rk-tool rk-regen" data-id="${E(id)}" data-f="${f}" title="Put the generated text back">↺ Regenerate</button>` : ""}</td>`; };
  const tone = t => ({high: "rk-tier-hi", endorsed: "rk-tier-ok", coaching: "rk-tier-mid", not: "rk-tier-lo"})[t] || "";
  return `<div class="rk-sheet" id="rkSheet">
  <div class="rk-title"><span>${E(snap.title)}</span><small>${E(snap.date)}</small></div>
  <table class="rk-table"><colgroup><col style="width:4.5%"><col style="width:10.5%"><col style="width:7.5%"><col style="width:18.5%"><col style="width:16.5%"><col style="width:14.5%"><col style="width:9.5%"><col style="width:11.5%"><col style="width:7%"></colgroup>
  <thead><tr>${COLS.map(h => `<th>${E(h.toUpperCase())}</th>`).join("")}</tr></thead>
  <tbody>${snap.rows.length ? snap.rows.map((r, i) => `<tr class="rk-row" data-rank="${E(r.rank)}">
    <td class="rk-c rk-rank">${E(r.rank)}</td>
    <td class="rk-c rk-name">${E(r.name)}</td>
    <td class="rk-c rk-ov"><b>${E(r.overall)}</b><span class="rk-res ${/^PASS/.test(r.result) ? "rk-pass" : /safety/.test(r.result) ? "rk-gate" : ""}">${E(r.result)}</span></td>
    ${cell(r, i, "strength")}${cell(r, i, "challenges")}
    <td class="rk-c rk-attrs">${(r.attrs || []).map(a => `<div class="rk-attr"><span>${E(a.label)}</span><b class="${a.stars === NA ? "rk-na" : "rk-stars"}">${E(a.stars)}</b></div>`).join("")}</td>
    ${cell(r, i, "redflag", /^None\./.test(r.redflag) ? "rk-ok" : "rk-flag")}${cell(r, i, "endorsement", "rk-end " + tone(r.tier))}
    <td class="rk-c rk-prog"><b>${E(r.progress)}</b><span>${E(r.passed)}</span></td></tr>`).join("") : `<tr><td class="rk-c rk-empty" colspan="${COLS.length}">No scored trainees in this batch yet.</td></tr>`}</tbody></table>
  ${foot ? `<div class="rk-foot">${E(foot)}</div>` : ""}</div>`;
}

/* ---------- the admin page ---------- */
const L = {extra: {}, xLoading: false, recs: {}, rowsAt: 0, links: null, linksFor: null, editing: false, busy: "", days: 30, msg: ""};
const keyOfR = r => typeof batchKey === "function" ? batchKey(r) : (r.batch || "");
const labelOf = k => typeof folderLabel === "function" ? folderLabel(k) : k;
const slug = label => String(label || "").replace(/[^A-Za-z0-9-]/g, "").slice(0, 40) || "all";
const extraOf = r => (r && r.__extra) || ((typeof state !== "undefined" && state.auditExtra) || {})[r.id];
const isPage = () => typeof state !== "undefined" && state.view === "admin" && state.adminTab === "rankreport";
const repaint = () => { if(isPage() && !L.editing && typeof render === "function") render(); };
function batches(){
  const ks = [...new Set((state.adminData || []).filter(r => r && !r.rejected).map(keyOfR))];
  return ks.sort((a, b) => typeof NO_BATCH !== "undefined" && a === NO_BATCH ? 1 : typeof NO_BATCH !== "undefined" && b === NO_BATCH ? -1 : a.localeCompare(b, undefined, {numeric: true}));
}
function curBatch(){
  const ks = batches();
  if(L.batch == null || (L.batch && !ks.includes(L.batch))) L.batch = state.adminBatchFilter && ks.includes(state.adminBatchFilter) ? state.adminBatchFilter : (ks.filter(k => typeof NO_BATCH === "undefined" || k !== NO_BATCH).pop() || "");
  return L.batch;
}
function people(){
  const k = curBatch(), xs = (state.adminData || []).filter(r => r && (!k || keyOfR(r) === k));
  const MA = window.cmMergedAway;
  return MA ? MA.scored(xs) : xs.filter(r => r.approved === true && !r.rejected && !r.archived);
}
function load(ppl){
  if(!state.adminData){ if(!state.adminLoading && typeof loadAdminLedger === "function") loadAdminLedger(); return false; }
  if(ppl.some(r => !extraOf(r)) && typeof loadAuditExtras === "function" && Date.now() - L.rowsAt > 5000){
    L.rowsAt = Date.now();
    (async () => { while(state.auditExtraLoading) await new Promise(f => setTimeout(f, 300)); await loadAuditExtras(); })().catch(() => {}).then(repaint);
  }
  const due = ppl.filter(r => !L.extra[r.id]);
  if(due.length && !L.xLoading && typeof sharedGetMany === "function"){
    L.xLoading = true;
    sharedGetMany(due.flatMap(r => ["callsim:" + r.id, "simresults:" + r.id])).then(got => { due.forEach((r, i) => { L.extra[r.id] = {callsim: got[i * 2], sim: got[i * 2 + 1]}; }); })
      .catch(() => due.forEach(r => { L.extra[r.id] = {}; })).then(() => { L.xLoading = false; repaint(); });
  }
  const s = slug(labelOf(curBatch()));
  if(!(s in L.recs) && typeof sharedGet === "function"){ L.recs[s] = null; sharedGet("rankings:" + s).then(v => { L.recs[s] = v && typeof v === "object" ? v : {edits: {}}; repaint(); }).catch(() => { L.recs[s] = {edits: {}}; repaint(); }); }
  return ppl.every(r => extraOf(r)) && ppl.every(r => L.extra[r.id]) && !!L.recs[s];
}
const ctxOf = r => { const x = extraOf(r) || {}, y = L.extra[r.id] || {};
  return {rec: r, cf: r.caseFlow || {days: {}}, data: x.data || {}, callsim: y.callsim, sim: y.sim, fb: x.fbRec || {days: x.fb || {}}}; };
// the rows as shown: generated, then the trainer's edits over them
function current(){
  const ppl = people(), ok = load(ppl), label = curBatch() ? labelOf(curBatch()) : "All batches", s = slug(label);
  const gen = finish(ppl.map(r => { try{ return rowOf(r, ctxOf(r)); }catch(e){ console.warn("rankings row", r && r.id, e); return null; } }).filter(Boolean));
  const edits = ((L.recs[s] || {}).edits) || {}, over = {};
  const rows = gen.map(x => { const o = edits[x.id] || {}; over[x.id] = {};
    const r = {rank: String(x.rank), name: x.name, overall: x.pct == null ? "—" : x.pct + "%", result: (RESULT[x.status] || "") + (x.pct != null && x.far && x.scoredDays < x.far ? ` · ${x.overallPct}% on the ${x.scoredDays} day${x.scoredDays === 1 ? "" : "s"} scored, of ${x.far}` : ""), attrs: x.attrs.map(a => ({label: a.label, stars: a.stars})),
      tier: x.tier, progress: x.until ? `Until Day ${x.until}` : "Not started", passed: `Days passed ${x.passed}/${cfDays().length}`};
    // (a Red Flag a trainer wrote gives way by itself once the trainee has repaired it: the generated one is "None." again)
    FIELDS.forEach(f => { let v = typeof o[f] === "string" && o[f].trim() ? o[f] : null;
      if(f === "redflag" && v != null && /^None\./.test(x.redflag) && !/^None\./.test(v.trim())) v = null;
      r[f] = v != null ? v : x[f]; if(v != null && v !== x[f]) over[x.id][f] = true; });
    return r; });
  return {ok, label, slug: s, gen, ids: gen.map(x => x.id), over,
    snap: {title: `TRAINEE RANKINGS & PROGRESS REPORT – ${label.toUpperCase()} – CM TRAINING`, batch: label, date: today(), rows}};
}
// what a share link holds: the table's text, and nothing else
const SNAP_ROW = ["rank", "name", "overall", "result", "strength", "challenges", "attrs", "redflag", "endorsement", "tier", "progress", "passed"];
function snapshot(cur){
  cur = cur || current();
  return {title: cur.snap.title, batch: cur.snap.batch, date: cur.snap.date,
    rows: cur.snap.rows.map(r => { const o = {}; SNAP_ROW.forEach(k => { o[k] = k === "attrs" ? r.attrs.map(a => ({label: a.label, stars: a.stars})) : r[k]; }); return o; })};
}
function pageHtml(){
  if(!state.adminData) { load([]); return banner("", "") + `<div class="card rk-wait">Loading the batches…</div>`; }
  const cur = current(), ks = batches();
  const pick = `<label class="rk-pick">Batch <select onchange="cmRankings.batch(this.value)"><option value="">All batches</option>${ks.map(k => `<option value="${E(k)}" ${k === curBatch() ? "selected" : ""}>${E(labelOf(k))}</option>`).join("")}</select></label>`;
  const tools = `${pick}<button type="button" onclick="cmRankings.copy()">📋 Copy as image</button><button type="button" onclick="cmRankings.download()">⬇ Download PNG</button><button type="button" onclick="cmRankings.csv()">⬇ CSV</button>
    <span class="rk-share"><select aria-label="Link expires after" onchange="cmRankings.days(this.value)">${[[7, "7 days"], [30, "30 days"], [90, "90 days"], [0, "No expiry"]].map(([v, t]) => `<option value="${v}" ${+L.days === v ? "selected" : ""}>${t}</option>`).join("")}</select><button type="button" onclick="cmRankings.share()">🔗 Share link</button></span>`;
  if(L.linksFor !== cur.label){ L.linksFor = cur.label; L.links = null; loadLinks(); }
  return banner(cur.label, tools) + `${L.msg ? `<p class="rk-msg" role="status">${E(L.msg)}</p>` : ""}${linksHtml()}
    <div class="rk-wrap">${cur.ok ? "" : `<p class="rk-note">Collecting the latest grades… the table fills in as they come.</p>`}${tableHtml(cur.snap, {ids: cur.ids, over: cur.over}, `Legal Support Help · Case Management Training · ${cur.snap.date} · confidential`)}</div>
    <p class="rk-note rk-tool">Click a Strength, Challenges, Red Flag or Endorsement cell to edit it; ↺ Regenerate puts the generated text back. Ranked by the Overall (the 100-point model). The toolbar and these notes are not in the image.</p>`;
}
const banner = (label, tools) => `<div class="ft-banner cmsh-banner rk-banner"><div><p class="ft-banner-k">Legal Support Help · Case Management Training</p><h2>🏆 Rankings &amp; Progress Report</h2>
  <p class="ft-banner-sub">${label ? `Batch <b>${E(label)}</b> · ` : ""}🏅 Scorecard · Admin</p></div>${tools ? `<div class="ft-banner-ctl rk-bar">${tools}</div>` : ""}</div>`;

/* ---------- the trainer's edits: rankings:<batch> ---------- */
async function saveEdit(id, f, text){
  const cur = current(), key = "rankings:" + cur.slug, g = cur.gen.find(x => x.id === id); if(!g) return;
  let rec = null; try{ rec = await sharedGet(key); }catch(e){ rec = null; }
  rec = rec && typeof rec === "object" ? rec : {}; rec.edits = rec.edits || {}; rec.batch = cur.label;
  const t = String(text == null ? "" : text).replace(/\s+/g, " ").trim().slice(0, 2000), o = Object.assign({}, rec.edits[id] || {});
  if(!t || t === g[f]) delete o[f]; else o[f] = t;
  if(Object.keys(o).length) rec.edits[id] = o; else delete rec.edits[id];
  rec.at = new Date().toISOString();
  L.recs[cur.slug] = rec;
  const ok = await sharedSet(key, rec);
  L.msg = ok ? "" : "The edit couldn't be saved. Check the connection and try again.";
  repaint();
  return ok;
}
document.addEventListener("click", e => {
  const g = e.target.closest && e.target.closest(".rk-regen"); if(g){ e.preventDefault(); saveEdit(g.dataset.id, g.dataset.f, ""); return; }
  const t = e.target.closest && e.target.closest(".rk-ed"); if(t && !t.isContentEditable) startEdit(t);
});
document.addEventListener("keydown", e => {
  const t = e.target.closest && e.target.closest(".rk-ed");
  if(!t) return;
  if(!t.isContentEditable && (e.key === "Enter" || e.key === " ")){ e.preventDefault(); startEdit(t); return; }
  if(t.isContentEditable && e.key === "Escape"){ t.dataset.cancel = "1"; t.blur(); }
  if(t.isContentEditable && e.key === "Enter" && !e.shiftKey){ e.preventDefault(); t.blur(); }
});
function startEdit(t){
  L.editing = true; t.contentEditable = "true"; t.dataset.was = t.textContent; t.focus();
  try{ const r = document.createRange(); r.selectNodeContents(t); const s = getSelection(); s.removeAllRanges(); s.addRange(r); }catch(e){}
  t.addEventListener("blur", () => { t.contentEditable = "false"; L.editing = false;
    if(t.dataset.cancel){ t.textContent = t.dataset.was; delete t.dataset.cancel; return; }
    if(t.textContent !== t.dataset.was) saveEdit(t.dataset.id, t.dataset.f, t.textContent); }, {once: true});
}

/* ---------- 📋 the table as a PNG: an SVG foreignObject drawn on a canvas, no library ---------- */
async function pngBlob(el){
  el = el || document.getElementById("rkSheet"); if(!el) throw new Error("No table on the page");
  const w = Math.ceil(el.getBoundingClientRect().width);
  const copy = el.cloneNode(true); copy.querySelectorAll(".rk-tool").forEach(x => x.remove());
  copy.querySelectorAll("[contenteditable],[tabindex],[title]").forEach(x => { x.removeAttribute("contenteditable"); x.removeAttribute("tabindex"); x.removeAttribute("title"); });
  copy.style.width = w + "px"; copy.style.margin = "0";
  const xhtml = new XMLSerializer().serializeToString(copy);
  // its height as the image lays it out: the sheet alone, with only its own styles (the page's may differ), in a hidden frame
  const h = await new Promise(ok => { const f = document.createElement("iframe");
    f.style.cssText = `position:fixed;left:-99999px;top:0;width:${w}px;height:100px;border:0;visibility:hidden;`;
    f.onload = () => { let v = 0; try{ v = Math.ceil(f.contentDocument.getElementById("rkSheet").getBoundingClientRect().height); }catch(e){ v = 0; } f.remove(); ok(v || Math.ceil(el.scrollHeight)); };
    f.srcdoc = `<!doctype html><html><head><meta charset="utf-8"><style>${SHEET_CSS}</style></head><body style="margin:0">${xhtml}</body></html>`; document.body.appendChild(f); });
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><foreignObject x="0" y="0" width="${w}" height="${h}"><div xmlns="http://www.w3.org/1999/xhtml"><style>${SHEET_CSS}</style>${xhtml}</div></foreignObject></svg>`;
  const img = new Image(); img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  await (img.decode ? img.decode() : new Promise((ok, no) => { img.onload = ok; img.onerror = no; }));
  const k = 2, cv = document.createElement("canvas"); cv.width = w * k; cv.height = h * k;
  const g = cv.getContext("2d"); g.fillStyle = "#FFFFFF"; g.fillRect(0, 0, cv.width, cv.height); g.scale(k, k); g.drawImage(img, 0, 0);
  return await new Promise((ok, no) => cv.toBlob(b => b ? ok(b) : no(new Error("The image could not be made")), "image/png"));
}
const fileBase = () => { const el = document.querySelector("#rkSheet .rk-title span"); return clip((el ? el.textContent : "Trainee Rankings").replace(/[\\/:*?"<>|]+/g, "-"), 120); };
function save(blob, name){
  const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 800);
}
const say = m => { if(typeof toast === "function") toast(m); else { const s = document.getElementById("rkSay"); if(s) s.textContent = m; } };
async function copy(){
  let blob; try{ blob = await pngBlob(); }catch(e){ say("The image could not be made: " + (e.message || e)); return null; }
  try{ await navigator.clipboard.write([new ClipboardItem({"image/png": blob})]); say("📋 The table is on the clipboard as an image: paste it into your email."); }
  catch(e){ save(blob, fileBase() + ".png"); say("The browser wouldn't put the image on the clipboard, so it was downloaded instead."); }
  return blob;
}
async function download(){ try{ const b = await pngBlob(); save(b, fileBase() + ".png"); return b; }catch(e){ say("The image could not be made: " + (e.message || e)); return null; } }
function csvText(snap){
  const q = v => { const t = String(v == null ? "" : v); return `"${(/^[=+\-@\t\r]/.test(t) ? "'" + t : t).replace(/"/g, '""')}"`; };
  const lines = [[snap.title].map(q).join(","), [snap.date].map(q).join(","), COLS.map(q).join(",")]
    .concat(snap.rows.map(r => [r.rank, r.name, `${r.overall} ${r.result}`, r.strength, r.challenges, r.attrs.map(a => `${a.label}: ${a.stars}`).join("; "), r.redflag, r.endorsement, `${r.progress}; ${r.passed}`].map(q).join(",")));
  return "﻿" + lines.join("\r\n");
}
function csv(snap){ snap = snap || current().snap; const b = new Blob([csvText(snap)], {type: "text/csv"}); save(b, fileBase() + ".csv"); return b; }

/* ---------- 🔗 share links (worker-share.js) ---------- */
async function api(path, body){
  const res = typeof authFetch === "function" ? await authFetch(path, body) : await fetch(path, {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify(body)});
  let j = null; try{ j = await res.json(); }catch(e){ j = null; }
  return {status: res.status, body: j || {}};
}
const linkUrl = t => `${location.origin}/report.html?s=${t}`;
async function loadLinks(){ const want = L.linksFor; try{ const r = await api("/api/share/list", {batch: want}); if(L.linksFor === want){ L.links = r.status === 200 ? (r.body.links || []) : []; repaint(); } }catch(e){ L.links = []; } }
const when = v => { try{ return v ? new Date(v).toLocaleDateString("en-US", {month: "short", day: "numeric", year: "numeric"}) : ""; }catch(e){ return ""; } };
function linksHtml(){
  const xs = (L.links || []).filter(x => x.live);
  if(!xs.length) return "";
  return `<div class="rk-links rk-tool"><b>🔗 Shared links</b> <span class="rk-note">(anyone with a link can read this table, no sign-in)</span><ul>${xs.map(x => `<li><code>${E(linkUrl(x.token).replace(/^https?:\/\//, ""))}</code>
    <span>made ${E(when(x.createdAt))}${x.updatedAt && x.updatedAt !== x.createdAt ? ` · updated ${E(when(x.updatedAt))}` : ""} · ${x.expiresAt ? `expires ${E(when(x.expiresAt))}` : "no expiry"}</span>
    <button type="button" onclick="cmRankings.copyLink('${E(x.token)}')">Copy link</button><button type="button" onclick="cmRankings.update('${E(x.token)}')">Update snapshot</button><button type="button" class="rk-revoke" onclick="cmRankings.revoke('${E(x.token)}')">Revoke</button></li>`).join("")}</ul></div>`;
}
async function copyText(t){ try{ await navigator.clipboard.writeText(t); return true; }catch(e){ return false; } }
async function share(){
  const r = await api("/api/share/save", {snapshot: snapshot(), days: +L.days});
  if(r.status !== 200){ L.msg = r.body.error || "The link could not be made."; repaint(); return null; }
  const url = linkUrl(r.body.token), copied = await copyText(url);
  L.msg = `🔗 ${copied ? "Link copied" : "Link made"}: ${url}${r.body.expiresAt ? ` (expires ${when(r.body.expiresAt)})` : " (no expiry)"}`;
  L.links = null; L.linksFor = null; repaint();
  return Object.assign({url}, r.body);
}
async function update(token){
  const r = await api("/api/share/save", {snapshot: snapshot(), token});
  L.msg = r.status === 200 ? "🔗 The link now shows the table as it is now (same address)." : (r.body.error || "The link could not be updated.");
  L.links = null; L.linksFor = null; repaint(); return r.status === 200;
}
async function revoke(token){
  if(typeof confirm === "function" && !window.__rkNoConfirm && !confirm("Revoke this link? Anyone who opens it from now on gets “link not found”.")) return false;
  const r = await api("/api/share/revoke", {token});
  L.msg = r.status === 200 ? "The link is revoked." : (r.body.error || "The link could not be revoked.");
  L.links = null; L.linksFor = null; repaint(); return r.status === 200;
}

/* ---------- the shared page: report.html?s=<token>, no sign-in ---------- */
async function openShared(root){
  root = root || document.getElementById("rkShared");
  const t = new URLSearchParams(location.search).get("s") || "";
  let r = null; try{ const res = await fetch("/api/share/get", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({token: t}), cache: "no-store", credentials: "omit"}); r = res.status === 200 ? await res.json() : null; }catch(e){ r = null; }
  if(!r || !r.snapshot){ root.innerHTML = `<div class="rk-gone"><h1>Link not found</h1><p>This report link has expired, been revoked, or isn't valid. Ask Legal Support Help for a new one.</p></div>`; document.title = "Link not found"; return false; }
  const s = r.snapshot; document.title = s.title || "Trainee Rankings";
  root.innerHTML = `<div class="rk-pub-bar rk-tool"><span>🏆 ${E(s.batch || "")} · read-only</span><button type="button" onclick="cmRankings.copy()">📋 Copy as image</button><button type="button" onclick="cmRankings.download()">⬇ Download PNG</button><span id="rkSay" role="status"></span></div>
    <div class="rk-wrap">${tableHtml(s, null, `Shared by LSH · snapshot of ${when(r.updatedAt || r.createdAt) || s.date} · confidential`)}</div>`;
  return true;
}

window.cmRankings = {
  pageHtml, openShared, current, snapshot, tableHtml, pngBlob, copy, download, csv, csvText, share, update, revoke, saveEdit, ATTRS, starsOf,
  batch(v){ L.batch = v || ""; L.msg = ""; repaint(); },
  days(v){ L.days = +v; },
  copyLink: async t => { const ok = await copyText(linkUrl(t)); L.msg = ok ? "🔗 Link copied." : `🔗 ${linkUrl(t)}`; repaint(); },
  links: () => L.links, reset(){ L.extra = {}; L.recs = {}; L.links = null; L.linksFor = null; L.batch = null; L.msg = ""; }
};

/* ---------- the look: a white sheet in LSH navy and orange, whatever the page's theme ---------- */
const SHEET_CSS = `
.rk-sheet{background:#FFFFFF;color:#141A2E;font-family:Arial,Helvetica,sans-serif;font-size:13px;line-height:1.38;padding:14px;box-sizing:border-box;width:100%;color-scheme:light;}
.rk-sheet *{box-sizing:border-box;font-family:Arial,Helvetica,sans-serif;}
.rk-title{display:flex;justify-content:space-between;align-items:baseline;gap:12px;background:#1E2340;color:#FFFFFF;font-weight:800;font-size:17px;letter-spacing:.02em;padding:11px 14px;border-bottom:4px solid #DB8437;}
.rk-title small{font-size:13px;font-weight:700;color:#F4C08E;white-space:nowrap;}
.rk-table{width:100%;border-collapse:collapse;table-layout:fixed;background:#FFFFFF;}
.rk-table th{background:#1E2340;color:#FFFFFF;font-weight:800;font-size:12px;text-align:center;vertical-align:middle;padding:9px 3px;border:1px solid #3A4166;border-bottom:3px solid #DB8437;letter-spacing:0;word-wrap:normal;overflow-wrap:normal;hyphens:none;}
.rk-table td.rk-c{border:1px solid #9CA3BD;padding:8px 8px;vertical-align:top;color:#141A2E;font-weight:600;word-wrap:break-word;overflow-wrap:anywhere;background:#FFFFFF;}
.rk-row:nth-child(even) td.rk-c{background:#F6F7FB;}
.rk-rank{text-align:center;font-size:20px;font-weight:900 !important;color:#DB8437 !important;vertical-align:middle !important;}
.rk-name{font-weight:800 !important;color:#1E2340 !important;font-size:13.5px;}
.rk-ov{text-align:center;}
.rk-ov b{display:block;font-size:18px;color:#1E2340;}
.rk-res{display:block;margin-top:3px;font-size:11.5px;font-weight:800;color:#8A5A00;}
.rk-res.rk-pass{color:#17703A;} .rk-res.rk-gate{color:#B3261E;}
.rk-t{white-space:pre-wrap;min-height:1.3em;border-radius:4px;}
.rk-ed{cursor:text;outline:none;}
.rk-ed:hover{background:#FFF3E6;box-shadow:0 0 0 2px #F4C08E;}
.rk-ed[contenteditable="true"]{background:#FFFBEA;box-shadow:0 0 0 2px #DB8437;}
.rk-regen{display:inline-block;margin-top:5px;border:0;background:none;color:#B5651D;font:700 12px Arial,Helvetica,sans-serif;cursor:pointer;padding:0;text-decoration:underline;}
.rk-attr{margin-bottom:6px;} .rk-attr:last-child{margin-bottom:0;}
.rk-attr span{display:block;font-size:12px;color:#2E3450;}
.rk-stars{color:#DB8437;font-size:15px;letter-spacing:1px;} .rk-na{color:#6B7190;font-size:12px;font-style:italic;}
td.rk-flag{color:#B3261E !important;} td.rk-ok{color:#17703A !important;}
td.rk-end{font-weight:700;} td.rk-tier-hi{color:#17703A !important;} td.rk-tier-ok{color:#1E2340 !important;} td.rk-tier-mid{color:#8A5A00 !important;} td.rk-tier-lo{color:#B3261E !important;}
.rk-prog{text-align:center;} .rk-prog b{display:block;color:#1E2340;} .rk-prog span{display:block;font-size:12px;margin-top:3px;color:#2E3450;}
.rk-empty{text-align:center;color:#5B6178 !important;padding:20px !important;}
.rk-foot{margin-top:8px;font-size:11.5px;font-weight:700;color:#5B6178;text-align:right;border-top:2px solid #DB8437;padding-top:6px;}`;
const css = document.createElement("style"); css.id = "cm-rankings";
css.textContent = SHEET_CSS + `
.rk-wrap{background:#FFFFFF;border-radius:10px;overflow:hidden;}
.rk-banner .rk-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}
.rk-bar button,.rk-bar select,.rk-links button,.rk-pub-bar button{font:700 14px Arial,Helvetica,sans-serif;padding:7px 12px;border-radius:8px;border:1px solid #9CA3BD;background:#FFFFFF;color:#1E2340;cursor:pointer;}
.rk-bar button:hover,.rk-links button:hover,.rk-pub-bar button:hover{border-color:#DB8437;}
.rk-pick{font-weight:700;color:inherit;display:inline-flex;gap:6px;align-items:center;}
.rk-share{display:inline-flex;gap:6px;align-items:center;}
.rk-note{font-size:14px;font-weight:600;color:#5B6178;margin:8px 2px;}
.rk-msg{font-size:15px;font-weight:700;color:#1E2340;background:#FFF3E6;border-left:4px solid #DB8437;padding:8px 12px;border-radius:6px;margin:0 0 10px;word-break:break-all;}
.rk-links{background:#F6F7FB;border:1px solid #DDE1EC;border-radius:10px;padding:10px 14px;margin:0 0 12px;font-size:14px;color:#1E2340;}
.rk-links ul{margin:6px 0 0;padding:0;list-style:none;} .rk-links li{display:flex;flex-wrap:wrap;gap:8px;align-items:center;padding:5px 0;border-top:1px solid #E3E6EF;}
.rk-links code{font-size:13px;background:#FFFFFF;padding:2px 6px;border-radius:4px;border:1px solid #DDE1EC;}
.rk-links .rk-revoke{color:#B3261E;}
.rk-wait{padding:40px;text-align:center;}
.rk-pub-bar{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:0 0 12px;font:700 15px Arial,Helvetica,sans-serif;color:#1E2340;}
.rk-gone{max-width:560px;margin:80px auto;text-align:center;font-family:Arial,Helvetica,sans-serif;color:#1E2340;} .rk-gone h1{font-size:26px;}`;
(document.head || document.documentElement).appendChild(css);
})();
