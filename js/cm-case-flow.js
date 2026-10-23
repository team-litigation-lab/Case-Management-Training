/* ============================================================
   5-DAY LEGAL CASE MANAGEMENT FLOW — the track's days, slides and wiring
   Focus case: John Doe v. Robert Smith · Lead Counsel: Atty. Elijah Thorne

   Content: js/cm-case-flow-data.js (window.CM_CASE_FLOW), the single source of
   truth. This file only turns it into this course's own day and lesson objects
   and wires them in. The Case Flow is the whole course (the earlier John Doe v. Apex version is removed).

   HOW IT ATTACHES
   • Days. Each Case Flow day is a normal day object with its own id (11–15), and the five are the
     engine's DAYS, so #/day/11, the slideshow, the Knowledge Check, Presenter view and everything
     that counts the program ("x of 5 days", the certificate, attendance) are the Case Flow's.
     On screen the days are "Case Flow Day 1–5" (relabel()).
   • Slides. Every block is a lesson topic in the course's own shape
     ({h, layout, fourPart, trainerCue}), so search, the SOP and Presenter view read
     it like any other topic. Its card is drawn here, from the engine's own pieces
     (renderFourPartSection, renderLessonVisual, renderPracticeCards, renderTable,
     renderCallout), so it carries the house look and whatever the universal layout
     changes next — with Tell Them / Show Them as its lesson section names.
   • Speaker notes go to Presenter view (window.SLIDE_SCRIPTS), never onto the
     trainee's slide: in this course trainer content stays off the shared screen.
   • Scoring. The day's Knowledge Check is the course's own auto-graded quiz (70% to
     pass), assembled from each module's questions. Each module's Self-Summary and
     Skill Scale is saved to the trainee's record ("case-flow", synced to the cloud
     with the rest of their progress) and can be sent to the course's AI evaluator
     (runRubricEvaluation) against that module's rubric. The record has a slot for
     the trainer's 40% (trainer: {score, comment}); the composite shows once it is
     filled. The trainer enters it on the Admin page, in each trainee's panel
     ("Case Flow — trainer assessment"); it is stored with the trainee's feedback
     (feedback:<id>, caseFlow.<module>) and read back into the trainee's record.
   • Order. Case Flow Day N opens once the Day N-1 Knowledge Check is passed.

   Loads after js/graded-calls.js (its dashboard wrapper must run last, on the
   finished page) and after js/cm-skillbuilders.js (it wraps renderLessonCard).
   ============================================================ */
(function(){
const CF = window.CM_CASE_FLOW;
if(!CF || !Array.isArray(CF.days) || !CF.days.length || typeof DAYS === "undefined") return;

const E = v => (typeof esc === "function" ? esc(v) : String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
const money = n => "$" + Number(n).toLocaleString("en-US");
const KIND = {lesson: "Lesson", activity: "Skill Activity", check: "Knowledge Check"};
const stackLayers = () => CF.case.stack.slice().sort((a, b) => a.order - b.order);
const sum = rows => (rows || []).reduce((a, r) => a + r[1], 0);

/* ---------- the visual model, as this course's native layout fields ---------- */
function layoutOf(s){
  if(!s) return {};
  switch(s.type){
    case "process":  return {layout: "PROCESS", processSteps: s.steps.map(([label, desc]) => ({label, desc}))};
    case "table":    return {layout: "TABLE", tableHeaders: s.head, tableRows: s.rows};
    case "threebox": return {layout: "THREEBOX", boxes: s.items.map(([label, desc]) => ({label, desc}))};
    case "compare":  return {layout: "COMPARE", compareLeft: {label: s.boxes[0].head, items: s.boxes[0].items}, compareRight: {label: s.boxes[1].head, items: s.boxes[1].items}};
    case "split":    return {layout: "COMPARE", compareLeft: {label: "✅ Do", items: s.do}, compareRight: {label: "❌ Don't", items: s.dont}};
    case "stack":    return {layout: "TABLE", tableHeaders: ["#", "Layer", "Limit", "Carrier", "Claim", "Adjuster"],
                       tableRows: stackLayers().map(l => [String(l.order), `${l.tag} — ${l.name}`, money(l.limit), l.carrier, l.claim, l.adjuster])};
  }
  return {};
}

/* ---------- build the days ---------- */
const MODULES = [];   // the day objects, in order
const BY_ID = {};
const QUIZ_N = 20;   // every Case Flow day's Knowledge Check quiz: 20 questions

/* Where each block is stored: its module is its unit of scoring (the Knowledge Check, its quiz share,
   the Self-Summary and Skill Scale, the trainer's 40%). Where it is taught is the sequence below. */
const STORED = {};
CF.days.forEach(day => day.modules.forEach(mod => {
  if(mod.blocks.filter(b => b.kind === "check").length !== 1 || mod.blocks[mod.blocks.length - 1].kind !== "check")
    console.warn(`[case-flow] ${mod.id} should end in exactly one Knowledge Check`);
  mod.blocks.forEach((b, k) => { STORED[b.id] = {day, mod, block: b}; });
}));
/* The order the course teaches: CF.sequence (each day's Case Phases), or each module as a phase */
const SEQUENCE = Array.isArray(CF.sequence) && CF.sequence.length ? CF.sequence
  : CF.days.map(day => ({n: day.n, phases: day.modules.map(m => ({title: m.title, blocks: ["lesson", "activity", "check"].flatMap(kind => m.blocks.filter(b => b.kind === kind).map(b => b.id))}))}));

SEQUENCE.forEach(seq => {
  const day = CF.days.find(x => x.n === seq.n);
  if(!day) return;
  const lessons = [], pools = [], phases = [];
  seq.phases.forEach((ph, pi) => {
    // What this run of blocks is. Most are stages of the case (a lesson's title is just "Demand"), but some are
    // cross-phase work the Case Manager does throughout (bottlenecks, binders, deposition prep): calling
    // those a Case Phase is simply wrong, so a phase may name its own lead in CF.sequence.
    const phase = {n: pi + 1, of: seq.phases.length, title: ph.title, lead: ph.lead || "Case Phase", count: ph.blocks.length, lane: ph.workstream || ""};
    phases.push(phase);
    ph.blocks.forEach((id, k) => {
      const at = STORED[id];
      if(!at){ console.warn(`[case-flow] the sequence names ${id}, which isn't a block`); return; }
      const {block: b, mod} = at;
      const fp = b.kind === "lesson"
        ? {corePrinciples: [b.tell.why].concat(b.tell.rules), howTo: (b.ops || []).map(o => `${o[1]} (${o[2]}).`)}
        : b.kind === "activity"
        ? {corePrinciples: [b.act.scenario, b.act.prompt], howTo: b.act.checkpoints}
        : {corePrinciples: b.check.questions, howTo: b.check.summary};
      lessons.push(Object.assign({
        h: `${phase.n}.${k + 1} ${b.title}`,
        fourPart: Object.assign(fp, {bestPractices: b.best || [], discussionCase: ""}),
        trainerCue: (b.notes || [])[0] || "",
        cf: {day, mod, block: b, k, phase, lane: (ph.lanes || {})[id] || phase.lane,   // day: where it is taught; mod: its unit of scoring; lane: its workstream
             heading: (ph.headings || {})[id] || (b.kind === "lesson" ? (phase.lead === "Case Phase" ? "" : phase.lead + ": ") : b.kind === "activity" ? "Skill Building: " : "Learning Check: ") + ph.title}
      }, layoutOf(b.show)));
      if(b.kind === "check") pools.push((mod.quiz || []).map(q => ({q, mod: mod.id})));
    });
  });
  // every day's Knowledge Check: 20 questions. A day with more takes them in turn from each module it checks (so every
  // module a day checks is asked about), kept in the order they are taught
  const take = pools.map(() => 0); let left = Math.min(QUIZ_N, pools.reduce((a, p) => a + p.length, 0));
  for(let k = 0; left; k = (k + 1) % pools.length) if(take[k] < pools[k].length){ take[k]++; left--; }
  const picked = pools.flatMap((p, k) => p.slice(0, take[k]));
  const quiz = picked.map(x => x.q), quizMod = picked.map(x => x.mod);
  const blocksOf = ph => ph.blocks.map(id => STORED[id]).filter(Boolean).map(x => x.block);
  const d = {
    id: day.id,
    title: day.title,
    theme: phases.map(p => p.title).join(" · "),
    objective: day.objective,
    // the module's Practice, grouped under each activity's heading (a long run shows its first two and a count), then its Knowledge Check
    taskOverview: seq.phases.flatMap(ph => {
      const groups = [];
      blocksOf(ph).filter(b => b.kind === "activity").forEach(b => {
        const t = ((ph.headings || {})[b.id] || ph.title).replace(/^Skill Building:\s*/, ""), last = groups[groups.length - 1];
        if(last && last.t === t) last.bs.push(b); else groups.push({t, bs: [b]});
      });
      const few = xs => xs.length > 3 ? xs.slice(0, 2).concat(`… and ${xs.length - 2} more`) : xs;
      return groups.map(g => ({label: `${ph.lead || "Case Phase"} · ${g.t}`, tasks: few(g.bs.map(b => b.title)), sample: `Sample task: ${g.bs[0].act.prompt.split(". ")[0]}.`}))
        .concat([{label: `${ph.lead || "Case Phase"} · Knowledge Check`, tasks: [`${QUIZ_N} questions on today's module, then your takeaway`], sample: ""}]);
    }),
    lessons,
    quickChecks: [],
    quiz,
    discussionQuestion: day.discussion,
    noDividers: true,           // each block opens with its own phase/block header
    cf: {n: day.n, gate: day.gate, quizMod, phases}
  };
  MODULES.push(d);
  BY_ID[d.id] = d;
});
const cfDay = id => BY_ID[Number(id)] || null;
const cfDayByN = n => MODULES.find(d => d.cf.n === n) || null;
window.CM_CASE_FLOW_DAYS = MODULES;

/* ---------- the course is the Case Flow: its five days are the engine's DAYS ----------
   (the earlier John Doe v. Apex version is removed; a record's old progress on Days 1–5 stays stored, unshown) */
Array.prototype.splice.call(DAYS, 0, DAYS.length, ...MODULES);
if(typeof DAY_ICONS !== "undefined") MODULES.forEach((m, i) => { if(!DAY_ICONS[m.id]) DAY_ICONS[m.id] = ["🗂", "📨", "🩺", "⚖️", "🤝"][i] || "📘"; });

const isTrainer = () => !!(state.isAdmin || state.adminPreview);
let FB = {id: null, p: null};
const traineeFeedback = () => {   // one read of feedback:<id> per trainee, for the trainer scores
  const id = state && state.traineeId;
  if(!id || typeof sharedGet !== "function") return Promise.resolve(null);
  if(FB.id !== id) FB = {id, p: Promise.resolve().then(() => sharedGet("feedback:" + id)).catch(() => null)};
  return FB.p;
};

const relabelAll = html => relabel(html, MODULES[0]);

/* A saved place, a link or a bookmark from the removed Apex version (Days 1–5, its Skill Builders) lands on
   the Case Flow instead: the day route only opens a Case Flow day, and the one practice tool the Case Flow
   still uses is the Calendar Conflict Resolver. */
const CF_TOOLS = new Set(["calendar"]);
if(typeof goto === "function"){
  const __goto = goto;
  goto = function(view, id){
    if(view === "day" && !cfDay(id)) return __goto.call(this, "dashboard");
    if(view === "tool" && !CF_TOOLS.has(id)) return __goto.call(this, "practice");
    return __goto.apply(this, arguments);
  };
  window.goto = goto;
}
const keptView = lv => !lv || lv.view !== "day" || cfDay(lv.dayId) ? lv : null;   // a saved "last view" on an Apex day is no place to resume
if(typeof auditSummary === "function"){
  const __audit = auditSummary;
  auditSummary = function(rec){
    const x = state.auditExtra && state.auditExtra[rec.id], data = x && x.data;
    if(data && data["last-view"]) data["last-view"] = keptView(data["last-view"]);
    return __audit.apply(this, arguments);
  };
}
/* Program counts are the Case Flow's days: a record's old Apex progress (Days 1–5) never moves "Program complete" or the average. */
const programIds = () => new Set(MODULES.map(d => d.id));
if(typeof completedCount === "function"){
  completedCount = function(){ const ids = programIds(); return Object.entries(state.progress || {}).filter(([k, p]) => ids.has(Number(k)) && p && p.done).length; };
}
if(typeof avgScore === "function"){
  avgScore = function(){
    const ids = programIds();
    const s = Object.entries(state.progress || {}).filter(([k, p]) => ids.has(Number(k)) && p && typeof p.score === "number").map(([, p]) => p.score);
    return s.length ? Math.round(s.reduce((a, b) => a + b, 0) / s.length) : 0;
  };
}

/* ---------- order: Case Flow Day N opens when Day N-1's Knowledge Check is passed ---------- */
const __unlocked = window.dayUnlocked;
window.dayUnlocked = function(id){
  const d = cfDay(id); if(!d) return __unlocked.apply(this, arguments);
  if(state.isAdmin || state.adminPreview) return true;
  if(d.cf.n === 1) return true;
  const prev = cfDayByN(d.cf.n - 1), p = prev && (state.progress || {})[prev.id];
  return !!(p && p.done);
};
if(typeof dayLockReason === "function"){
  const __reason = dayLockReason;
  dayLockReason = function(id){
    const d = cfDay(id); if(!d) return __reason.apply(this, arguments);
    const prev = cfDayByN(d.cf.n - 1);
    return `Pass the Case Flow Day ${d.cf.n - 1} Knowledge Check (70%) to open Case Flow Day ${d.cf.n}. ${prev ? "Gate: " + prev.cf.gate + "." : ""}`;
  };
}

/* "Day 11"–"Day 15" are internal ids: on screen they are "Case Flow Day 1"–"5" (the day's own
   id, and any other Case Flow day it links to, such as "Back to Day 13"). */
const relabel = (html, d) => !d ? html : MODULES.reduce((h, m) => h
  .replace(new RegExp(`\\bDay ${m.id}\\b`, "g"), `Case Flow Day ${m.cf.n}`)
  .replace(new RegExp(`\\bDAY ${m.id}\\b`, "g"), `CASE FLOW DAY ${m.cf.n}`), String(html));

/* The "← Back to …" button names a Case Flow day by its label, not its id. */
if(typeof routeLabel === "function"){
  const __route = routeLabel;
  routeLabel = function(h){
    const r = __route.apply(this, arguments), m = /^Day (\d+)$/.exec(r || "");
    return m && cfDay(m[1]) ? `Case Flow Day ${cfDay(m[1]).cf.n}` : r;
  };
}

/* "▶ Resume where you left off" names a Case Flow day by its label too, and isn't offered for a
   Case Flow day the trainee can't open yet. */
if(typeof resumeLabel === "function"){
  const __resume = resumeLabel;
  resumeLabel = function(){
    state.lastView = keptView(state.lastView);
    const lv = state.lastView, d = lv && lv.view === "day" && cfDay(lv.dayId);
    if(d && !dayUnlocked(d.id)) return "";
    if(lv && lv.view === "day" && !d) return "";   // an old Apex day (removed) isn't resumable
    const r = __resume.apply(this, arguments);
    return d ? relabel(r, d) : r;
  };
}

/* ---------- the continuity strip on every block ---------- */
function strip(){
  const c = CF.case, L = stackLayers();
  return `<div class="cf-strip" aria-label="Case file">
    <span class="cf-anchor"><b>Case</b>${E(c.style)}</span>
    <span class="cf-anchor"><b>Counsel</b>${E(c.counsel)}</span>
    <span class="cf-anchor"><b>Stack</b>${E(L.map(l => money(l.limit) + " " + l.tag).join(" / "))} = ${E(money(c.total))}</span>
    <span class="cf-anchor cf-flag"><b>Critical fact</b>${E(c.gapDays)}-Day Treatment Gap</span>
  </div>`;
}

/* ---------- pieces ---------- */
const S = (n, label, html) => renderFourPartSection(n, label, html);
const ul = xs => `<ul>${(xs || []).map(x => `<li>${E(x)}</li>`).join("")}</ul>`;
const table = (headers, rows) => renderTable({headers, rows});

function ladder(){
  const L = stackLayers();
  return `<div class="cf-ladder">
    <div class="cf-rungs">${L.slice().reverse().map(l => `<div class="cf-rung cf-rung-${l.order}">
      <span class="cf-rung-n">${l.order}</span><span class="cf-rung-tag">${E(l.tag)}</span>
      <span class="cf-rung-limit">${E(money(l.limit))}</span>
      <span class="cf-rung-meta">${E(l.carrier)} · ${E(l.claim)} · ${E(l.adjuster)}</span></div>`).join("")}</div>
    <div class="cf-brace"><span class="cf-total">${E(money(CF.case.total))}</span><span class="cf-total-l">TOTAL AVAILABLE</span></div>
  </div>
  <p class="cf-order">Order of operations: <b>${E(L.map(l => l.tag).join(" → "))}</b>. UM pays only after BI is exhausted, and releasing BI without the UM carriers' consent can forfeit the stack.</p>`;
}
const visual = (l, b) => !b.show ? "" : (b.show.type === "stack" ? ladder() : renderLessonVisual(l));
const showLabel = (b, head) => head + (b.show && b.show.caption ? ` — ${b.show.caption}` : "");

const opsTable = ops => !(ops && ops.length) ? "" :
  table(["Trigger event", "Case Manager task", "Tool / interface", "Verification checkpoint"], ops);

function rubricHtml(r){   // the grading weights stay with the scoring (the Knowledge Check, the trainer's panel): not shown in the lesson
  return "";
  if(!r) return "";
  const rows = list => list.map(([dim, pts, crit]) => [`${pts}%`, dim, crit]);
  return `<details class="cf-rubric"><summary>Assessment criteria — AI ${sum(r.ai)}% + Trainer ${sum(r.trainer)}%</summary>
    <div class="cf-rubric-h">🤖 Automated AI grading · ${sum(r.ai)}%</div>${table(["Weight", "Dimension", "What is graded"], rows(r.ai))}
    <div class="cf-rubric-h">🧑‍🏫 Trainer assessment · ${sum(r.trainer)}%</div>${table(["Weight", "Dimension", "What is assessed"], rows(r.trainer))}
    <p class="cf-formula">Composite = AI × 0.60 + Trainer × 0.40</p>
    ${renderCallout({type: "warning", label: "UPL is a gate, not a weighting", text: "Giving the client legal advice fails the block's UPL criterion whatever the composite score."})}
  </details>`;
}

/* ---------- the trainee's own record: Self-Summary, Skill Scale, scores ----------
   One personal key, "case-flow" (in PERSONAL_KEYS, so it syncs with the rest of the trainee's progress):
   {v:1, modules:{<modId>:{answers:[], scale:[], savedAt, ai:{score,tier,strengths,gaps,growth,at},
                           quiz:{correct,total,pct,at}, trainer:{score,comment,at}}}} */
const KEY = "case-flow";
let REC = {v: 1, modules: {}}, loaded = false;
const rec = id => { const m = (REC.modules[id] = REC.modules[id] || {answers: [], scale: []}); m.kc = m.kc || []; return m; };   // kc: the Knowledge Check answers
async function load(){
  if(loaded || typeof storeGet !== "function") return;
  loaded = true;
  try{ const v = await storeGet(KEY); if(v && typeof v === "object" && v.modules) REC = v; }catch(e){}
  keepCaseYear();
  keepDolOffset();
  await loadTrainerScores();
}
/* The case's dates roll forward with the calendar (js/cm-case-dates.js), but a trainee stays on the case year
   they started on: it's kept on their record (caseYear, set with their first saved work) and on this device. If
   this page was built on another year (a new device, or the last trainee's year), it reloads once on theirs. */
const DATES = window.CM_CASE_DATES;
function keepCaseYear(){
  if(!DATES || DATES.preview) return;
  const want = DATES.yearForRecord(REC);
  DATES.pin(want);
  if(want === DATES.year) return;
  try{ if(sessionStorage.getItem("lsh_case-year-reload") === String(want)) return; sessionStorage.setItem("lsh_case-year-reload", String(want)); }catch(e){ return; }
  location.reload();
}
/* The CMS's Date of Loss leads (js/cm-case-dates.js): when the trainee's John Doe case in the CMS has another DOL,
   every date on or after it moves by the same number of days, as the CMS moves the SOL and the rest of the case.
   Kept on the record (dolOffset, dolYear, dolFrom: the CMS DOL it came from) and on this device; a page built with
   another offset reloads once on the record's. dolIgnore: a CMS DOL the trainee chose not to follow. */
const dolWanted = () => (DATES && REC.dolYear === DATES.year ? (REC.dolOffset || 0) : 0);
function keepDolOffset(){
  if(!DATES || DATES.preview || isTrainer()) return;
  const want = dolWanted();
  if(want === (DATES.dolOffset || 0)) return;
  DATES.setDolOffset(want, DATES.year);
  try{ if(sessionStorage.getItem("lsh_case-dol-reload") === String(want)) return; sessionStorage.setItem("lsh_case-dol-reload", String(want)); }catch(e){ return; }
  location.reload();
}
function followCmsDol(c){
  if(!DATES || DATES.preview || isTrainer() || !c || !c.dol || !/\bjohn\b[\s\S]*\bdoe\b|\bdoe\b[\s\S]*\bjohn\b/i.test(c.client || "")) return;
  if(c.dol === REC.dolIgnore) return;
  const n = DATES.offsetFor(c.dol);
  if(n == null || n === dolWanted()) return;
  REC.dolOffset = n; REC.dolYear = DATES.year; REC.dolFrom = c.dol; delete REC.dolIgnore;
  DATES.setDolOffset(n, DATES.year); persist();
  if(typeof toast === "function") toast(`Your CMS Date of Loss is ${c.dol}: the case's dates move ${n > 0 ? "+" : ""}${n} day${Math.abs(n) === 1 ? "" : "s"}. Update them from 📂 Case File.`);
  if(typeof render === "function" && state && state.view === "clientprofile") render();
}
window.addEventListener("load", () => { if(window.CMCase){ CMCase.onChange(followCmsDol); const c = CMCase.get(); if(c) followCmsDol(c); } });
function dolNote(){
  if(!DATES || isTrainer() || DATES.preview) return "";
  const want = dolWanted(), now = DATES.dolOffset || 0;
  if(!want && !now) return "";
  const sg = n => `${n > 0 ? "+" : ""}${n} day${Math.abs(n) === 1 ? "" : "s"}`;
  if(want !== now) return `<p class="cf-note cf-dol">📅 Your CMS Date of Loss (${E(REC.dolFrom || "")}) moves the case's dates ${sg(want)}. <a href="#" onclick="cmCaseFlow.updateDol();return false">Update the dates now</a> · <a href="#" onclick="cmCaseFlow.resetDol();return false">Keep the course's dates</a></p>`;
  return `<p class="cf-note cf-dol">📅 Dates follow your CMS Date of Loss (moved ${sg(now)}). <a href="#" onclick="cmCaseFlow.resetDol();return false">Reset to the course's dates</a></p>`;
}
Object.assign(window.cmCaseFlow = window.cmCaseFlow || {}, {
  updateDol: () => location.reload(),
  resetDol: () => { REC.dolIgnore = REC.dolFrom || ""; REC.dolOffset = 0; REC.dolYear = DATES.year; DATES.setDolOffset(0, DATES.year); Promise.resolve(persist()).then(() => location.reload()); },
  followCmsDol
});
/* After sign-in restores a trainee's progress from the cloud, read their Case Flow record again: the one loaded
   at startup was this device's, and saving over the restored one would lose their work. */
if(typeof loadAll === "function"){
  const __loadAll = loadAll;
  loadAll = async function(){ const r = await __loadAll.apply(this, arguments); loaded = false; await load(); return r; };
}
/* The trainer's 40% lives with the trainee's feedback (the trainer writes it, the trainee reads it). */
async function loadTrainerScores(){
  if(typeof sharedGet !== "function" || !state || !state.traineeId || state.isAdmin) return;
  try{
    const fb = await traineeFeedback();
    Object.entries((fb && fb.caseFlow) || {}).forEach(([id, t]) => { if(t && typeof t.score === "number") rec(id).trainer = t; });
  }catch(e){}
}
const persist = () => { REC.updatedAt = new Date().toISOString(); if(DATES && !DATES.preview && !REC.caseYear) REC.caseYear = DATES.year; return typeof storeSet === "function" ? storeSet(KEY, REC) : Promise.resolve(); };
load();

function composite(m){
  const auto = [m.quiz && m.quiz.pct, m.ai && m.ai.score].filter(v => typeof v === "number");
  const a = auto.length ? Math.round(auto.reduce((x, y) => x + y, 0) / auto.length) : null;
  const t = m.trainer && typeof m.trainer.score === "number" ? m.trainer.score : null;
  return {a, t, c: (a != null && t != null) ? Math.round(a * 0.6 + t * 0.4) : null};
}
function scoreHtml(modId){
  const m = rec(modId), s = composite(m);
  const pill = (label, v, note) => `<div class="cf-score"><b>${v == null ? "—" : v + "%"}</b><span>${E(label)}</span>${note ? `<small>${E(note)}</small>` : ""}</div>`;
  const ai = m.ai ? `<div class="cf-ai"><b>AI evaluation · ${E(m.ai.score)}% ${m.ai.tier ? "· " + E(m.ai.tier) : ""}</b>
      ${(m.ai.strengths || []).length ? `<p>✓ ${(m.ai.strengths || []).map(E).join(" · ")}</p>` : ""}
      ${(m.ai.gaps || []).length ? `<p>→ ${(m.ai.gaps || []).map(E).join(" · ")}</p>` : ""}</div>` : "";
  return `<div class="cf-scores">
      ${pill("Automated (60%)", s.a, m.quiz ? `Quiz ${m.quiz.correct}/${m.quiz.total}${m.ai ? " · written answers" : ""}` : (m.ai ? "Written answers" : "Pass the day's Knowledge Check and submit below"))}
      ${pill("Trainer (40%)", s.t, s.t == null ? "Pending your trainer's review" : (m.trainer.comment || ""))}
      ${pill("Composite", s.c, s.c == null ? "Shown once both channels are in" : "AI × 0.60 + Trainer × 0.40")}
    </div>${ai}`;
}

function selfSummary(b, day, mod, part){   // part: "qs" (the prompts) or "scale" (the Skill Scale and Submit); omitted, both
  const m = rec(mod.id);
  const qs = b.check.summary.map((q, j) => `<label class="cf-ss-q"><span><b>${j + 1}.</b> ${E(q)}</span>
      <textarea id="cfss_${mod.id}_${j}" rows="3" oninput="cmCaseFlow.draft('${mod.id}')">${E(m.answers[j] || "")}</textarea></label>`).join("");
  const scale = `<div class="mini-table-wrap"><table class="mini-table cf-scale"><thead><tr><th>Competency</th>${CF.scale.map(([n, t]) => `<th title="${E(t)}">${n}</th>`).join("")}</tr></thead>
      <tbody>${b.check.scale.map((c, j) => `<tr><td>${E(c)}</td>${CF.scale.map(([n]) => `<td><input type="radio" name="cfsc_${mod.id}_${j}" value="${n}" aria-label="${E(c)}: ${n}" ${m.scale[j] === n ? "checked" : ""} onchange="cmCaseFlow.rate('${mod.id}',${j},${n})"></td>`).join("")}</tr>`).join("")}</tbody></table></div>`;   // each 1–5 heading says what it means on hover
  const st = `<span class="cf-ss-st" id="cfss_st_${mod.id}">${m.savedAt ? "Saved " + E(new Date(m.savedAt).toLocaleString()) : ""}</span>`;
  const save = `<button type="button" class="btn btn-ghost btn-sm" onclick="cmCaseFlow.save('${mod.id}')">Save</button>`;
  if(part === "qs") return `<div class="cf-ss" data-mod="${mod.id}">${qs}<div class="cf-ss-act">${save}${st}<span class="cf-note">Next: rate yourself on the Skill Scale, then submit.</span></div></div>`;
  if(part === "page") return `<div class="cf-ss" data-mod="${mod.id}">${qs}${scale}<div class="cf-ss-act">${st}</div></div>`;
  return `<div class="cf-ss" data-mod="${mod.id}">${part === "scale" ? "" : qs}${scale}
      <div class="cf-ss-act">${save}
      <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.review(${day.id},'${mod.id}')">Submit for review</button>
      ${st}</div>
      <div id="cfss_res_${mod.id}">${scoreHtml(mod.id)}</div></div>`;
}

/* ---------- the full text of a block (the curriculum as written), behind "📖 Full text" ---------- */
function fullText(l, d){
  const {block: b} = l.cf;
  if(b.kind === "lesson"){
    // the foundation (CF.discuss) comes first: the knowledge the rules stand on, for the discussion
    const found = (CF.discuss || {})[b.id] || [], n = found.length ? 1 : 0;
    return (n ? S(1, "The Foundation — for discussion", `<div class="cf-discuss">${found.map(p => `<p>${hl(p)}</p>`).join("")}</div>`) : "")
      + S(1 + n, "Tell Them — the rules and the strategic why", `<p class="cf-why">${E(b.tell.why)}</p>${ul(b.tell.rules)}`
      + (b.tell.upl || []).map(u => renderCallout({type: "warning", label: "UPL boundary", text: u})).join(""))
    + S(2 + n, showLabel(b, "Show Them"), visual(l, b))
    + S(3 + n, "Trigger ➔ Task ➔ Tool ➔ Checkpoint", opsTable(b.ops))
    + S(4 + n, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
  }
  if(b.kind === "activity") return S(1, "The scenario", `<div class="scenario-card"><div class="stag">John Doe v. Robert Smith</div><p class="scn">${E(b.act.scenario)}</p></div>`)
    + S(2, "Execute on the live file", `<p class="cf-prompt">${E(b.act.prompt)}</p><div class="cf-tool"><div><b>🛠 Tool / interface</b><span>${E(b.act.tool)}</span></div><div><b>📤 Expected output</b><span>${E(b.act.output)}</span></div></div>`)
    + S(3, "Verification checkpoints", answersOpen(b.id) ? ul(b.act.checkpoints) : `<p class="cf-note">Shown once you finish the activity and reveal the answers on its Check Your Work slide.</p>`)
    + S(4, "Trigger ➔ Task ➔ Tool ➔ Checkpoint", opsTable(b.ops))
    + S(5, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
  return S(1, "Knowledge verification", `<ol class="cf-q">${b.check.questions.map(q => `<li>${E(q)}</li>`).join("")}</ol>`)
    + S(2, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
}

/* ---------- the slides: one idea per slide, big type, a picture, the key point highlighted ----------
   Every block is a short run of slides (its "views"), drawn from its concise copy (js/cm-case-flow-slides.js,
   window.CM_CF_SLIDES[blockId]; written to build/case-flow/slides/SLIDESPEC.md) and its picture
   (js/cm-case-flow-art.js). The block's full curriculum text stays one tap away (📖 Full text) and in
   Presenter view. A block with no concise copy yet is condensed from its full text. */
const SLIDES = window.CM_CF_SLIDES || {}, ART = window.CM_CF_ART || {};
/* The simulation (js/cm-case-flow-sim.js): what lands on the file to start each Skill Activity, the live
   call in every Case Phase, what a skipped step costs later, and the case's milestones. */
const SIM = Object.assign({events: {}, calls: {}, fallout: [], timeline: []}, window.CM_CF_SIM || {});
const CHANNEL = {email: ["✉️", "Email"], call: ["📞", "Phone call"], voicemail: ["📳", "Voicemail"], letter: ["📨", "Letter"], fax: ["📠", "Fax"],
  alert: ["🔔", "CMS alert"], portal: ["🌐", "Portal message"], text: ["💬", "Text message"], memo: ["📝", "Internal memo"]};
const dayMs = v => { const [m, d, y] = String(v || "").split("/").map(Number); return y ? Date.UTC(y, m - 1, d) : NaN; };
function eventCard(e, extra, blockId, noAtt){   // noAtt: the slide shows the documents as thumbnails beside it
  if(e.channel === "voicemail" && e.spoken && blockId) return voicemailCard(e, blockId, extra);
  const [icon, label] = CHANNEL[e.channel] || ["📌", "Message"];
  const att = noAtt ? [] : (e.attachments || []).map(id => CF_DOCS.find(x => x.id === id)).filter(Boolean);
  return `<div class="cfx-ev cfx-ev-${E(e.channel)}${extra ? " " + extra : ""}">
      <div class="cfx-ev-h"><span class="cfx-ev-i">${icon}</span><span class="cfx-ev-ch">${E(label)}</span><span class="cfx-ev-from">${E(e.from || "")}</span>
        <span class="cfx-ev-when">${E(e.date || "")}${e.time ? " · " + E(e.time) : ""}</span></div>
      <div class="cfx-ev-subj">${E(e.subject || "")}</div>
      <p class="cfx-ev-body">${E(e.body || "")}</p>
      ${att.length ? `<div class="cfx-ev-att">${att.map(x => `<a href="${E(docUrl(x))}" target="_blank" rel="noopener" title="${E(x.desc)}" onclick="return cmCaseFlow.doc(event,'${x.id}')">📎 ${E(x.title)}</a>`).join("")}</div>` : ""}
    </div>`;
}
/* a snapshot of a CMS log as it stands when the event lands (e.g. the Communications Log of the No Contact Protocol):
   a slide shows it in place of the document thumbnails, its documents stay under Your Task's Work From */
function logSnapshot(g){
  return `<div class="cfx-log"><div class="cfx-log-h">🗂 ${E(g.title)}</div><div class="cfx-log-scroll"><table><thead><tr>${g.head.map(h => `<th>${E(h)}</th>`).join("")}</tr></thead>
    <tbody>${g.rows.map(r => `<tr${r.mark ? ` class="cfx-log-${E(r.mark)}"` : ""}>${r.cells.map((x, j) => `<td${j < 2 ? ' class="cfx-log-mono"' : ""}>${E(x)}</td>`).join("")}</tr>`).join("")}</tbody></table></div>
    ${g.note ? `<p class="cfx-log-note">${hl(g.note)}</p>` : ""}</div>`;
}
const LANES = {claims: "Claims & Coverage", care: "Client & Treatment"};
/* where a workstream stands for a trainee on Case Flow Day n: the first event it has on that day, else its last before */
function laneAt(lane, n){
  const evs = MODULES.filter(d => d.cf.n <= n).flatMap(d => d.lessons.filter(l => l.cf.block.kind === "activity" && l.cf.lane === lane && SIM.events[l.cf.block.id]).map(l => ({n: d.cf.n, e: SIM.events[l.cf.block.id], title: l.cf.block.title})));
  return evs.find(x => x.n === n) || evs[evs.length - 1] || null;
}
/* fallout: a later activity shows what a skipped check costs, for a trainee who didn't tick it */
function falloutFor(blockId){
  const ticks = (REC.ticks || {});
  return (SIM.fallout || []).filter(f => f.then && f.then.activity === blockId).map(f => {
    const done = !!((ticks[f.if.activity] || [])[f.if.check]);
    const what = ((SLIDES[f.if.activity] || {}).checks || [])[f.if.check] || "";
    return {f, done, what: String(what).replace(/\*\*/g, "")};
  }).filter(x => isTrainer() || !x.done);
}
const VIEW_LABEL = {grade: "The Grade-A Standard", audit: "Audit & the Finished Set", why: "Why It Matters", doc: "The Document", theory: "The Theory", theory2: "The Theory, Continued", frame: "The Framework", rules: "The Rules", map: "The Roadmap", model: "See It", job: "On the Job", dodont: "Do & Don't",
  case: "Your Case", task: "Your Task", check: "Check Your Work", questions: "Knowledge Check", questions2: "Knowledge Check, Continued", summary: "Self-Summary", scale: "Skill Scale"};
const VIEW_ICON = {grade: "🏅", audit: "🔍", why: "💡", doc: "📄", theory: "📚", theory2: "📚", frame: "🧭", rules: "📏", map: "🗺", model: "🔍", job: "🛠", dodont: "✅", case: "📂", task: "🎯", check: "☑️", questions: "🧠", questions2: "🧠", summary: "📝", scale: "📊"};
const KC_PER = 4;   // Knowledge Check questions on one slide
/* The Theory: the lesson's concepts from the original Canva decks (build/case-flow/slides/theory-dN.json), four to a
   slide (a deep topic, 6–8 concepts, takes two); then The Framework, the deck page's own table, flowchart or checklist
   rebuilt in the course's design (the slides never show the deck's page images) */
const TH_PER = 4;
const theoryOf = b => (SLIDES[b.id] || {}).theory || null;
const roadmapOf = b => (SLIDES[b.id] || {}).roadmap || null;   // a complex lesson opens with its roadmap: the steps ahead, before any of them is taught or tested
/* a roadmap marked `merge` is no slide of its own: it opens The Theory as a strip of its steps (a short lesson keeps both on one slide) */
const mapView = b => roadmapOf(b) && !roadmapOf(b).merge ? ["map"] : [];
const mapStrip = b => { const r = roadmapOf(b); return r && r.merge ? `<ol class="cfx-map-strip" style="--n:${r.steps.length > 4 ? Math.ceil(r.steps.length / 2) : r.steps.length}" aria-label="${E(r.title)}">${r.steps.map((x, i) => `<li><span class="cfx-fw-n">${i + 1}</span><b>${E(x.label)}</b><span>${hl(x.text)}</span></li>`).join("")}</ol>` : ""; };
const theoryViews = b => { const t = theoryOf(b); return !t ? [] : (t.concepts.length > TH_PER ? ["theory", "theory2"] : ["theory"]).concat(t.framework ? ["frame"] : []); };
/* a lesson that introduces a legal or medical document opens with The Document (what it is, its legal purpose, its
   evidentiary role, how the Case Manager handles it) before anything asks the trainee to work with it */
const docView = b => (SLIDES[b.id] || {}).document ? ["doc"] : [];
function viewsOf(b){
  const vs = viewsIn(b), t = vs.indexOf("theory");
  return (SLIDES[b.id] || {}).theoryFirst && vs[0] === "why" && t > 0 ? ["theory", "why"].concat(vs.slice(1).filter(v => v !== "theory")) : vs;   // theoryFirst: the definition before the why (the course's opening lesson)
}
function viewsIn(b){
  if(b.kind === "lesson" && b.brief) return ["why"].concat(docView(b), ["rules"]).concat((b.ops || []).length ? ["job"] : []);   // brief: a condensed overview (Day 5's litigation)
  if(b.kind === "lesson" && b.compact) return ["why"].concat(docView(b), mapView(b), theoryViews(b).slice(0, 1), ["rules"], (b.ops || []).length ? ["job"] : []);   // compact: a full topic on fewer slides (Days 2, 4 and 5 keep to their slide budget)
  if(b.kind === "lesson") return ["why"].concat(docView(b), mapView(b), theoryViews(b), ["rules"],b.show ? ["model"] : [], (b.ops || []).length ? ["job"] : [], (b.best || []).length && !b.noGame ? ["dodont"] : []);   // noGame: the CM introduction (Meet Your Case comes before the first game)
  if(b.kind === "activity") return ["case"].concat((SLIDES[b.id] || {}).grade ? ["grade"] : [], ["task"], EX.audits[b.id] ? ["audit"] : [], b.show && !b.compact ? ["model"] : [], ["check"]);   // compact: no See It slide (the worked model stays in 📖 Full text)
  return (copyOf(b).questions.length > KC_PER ? ["questions", "questions2"] : ["questions"]).concat(["summary", "scale"]);
}
const SMALL = new Set(["a", "an", "the", "and", "or", "but", "nor", "of", "to", "in", "on", "for", "at", "by", "with", "from", "as", "per", "vs.", "v.", "via", "into"]);
const titleCase = t => String(t || "").split(/(\s+|—|–|\/)/).map((w, i, a) => {
  if(!/[a-z]/.test(w) || /[A-Z]/.test(w.slice(1)) || /\d/.test(w)) return w;   // acronyms, mixed case (LORs), numbers stay as they are
  const first = i === 0, last = i === a.length - 1;
  return (!first && !last && SMALL.has(w.toLowerCase())) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1);
}).join("");
const leadSplit = t => { const m = String(t || "").match(/^\*\*([^*]+?[.!?:])\*\*\s+(.+)$/); return m ? [m[1], m[2]] : null; };
const hl = t => E(t).replace(/\*\*(.+?)\*\*/g, '<mark class="cfx-hl">$1</mark>');
/* Check Your Work holds the answers (the **marked** parts): a trainee sees them blurred in place (no gap in the sentence) until they finish the activity and
   reveal them; the trainer always sees them, except on the shared slides window (the audience sees what trainees see). */
const masked = t => E(t).replace(/\*\*(.+?)\*\*/g, '<span class="cfx-blank" title="Your answer, from the file: shown when you finish" aria-hidden="true">$1</span>');
const inAudience = () => typeof document !== "undefined" && !!document.body && document.body.classList.contains("audience-mode");
let justRevealed = null;   // the block whose answers were just revealed: they animate from blurred to clear once
const answersOpen = id => (isTrainer() && !inAudience()) || !!((REC.revealed || {})[id]);
const words = (t, n) => { const w = String(t || "").replace(/\s+/g, " ").trim().split(" "); return w.length <= n ? w.join(" ") : w.slice(0, n).join(" ").replace(/[,;:]$/, "") + "…"; };
const firstSentence = t => (String(t || "").match(/^.*?[.!?](\s|$)/) || [t])[0].trim();
function copyOf(b){   // the block's concise copy, or a condensed fallback from its full text
  const c = SLIDES[b.id] || {};
  const best = b.best || [], dos = best.filter(x => !/^pitfall/i.test(x)), donts = best.filter(x => /^pitfall/i.test(x)).map(x => x.replace(/^pitfall:\s*/i, ""));
  if(b.kind === "lesson") return {image: c.image, hook: c.hook || words(firstSentence(b.tell.why), 22), points: c.points || b.tell.rules.slice(0, 4).map(r => words(r, 16)),
    upl: c.upl !== undefined ? c.upl : ((b.tell.upl || [])[0] ? words(b.tell.upl[0], 18) : ""), job: c.job || (b.ops || []).slice(0, 3).map(r => r.map(x => words(x, 7))),
    dos: c.dos || dos.slice(0, 3).map(x => words(x, 12)), donts: c.donts || donts.slice(0, 3).map(x => words(x, 12)), theory: c.theory || null, document: c.document || null};
  if(b.kind === "activity") return {image: c.image, situation: c.situation || words(b.act.scenario, 36), steps: c.steps || [words(b.act.prompt, 30)],
    purpose: c.purpose || "", principle: c.principle || (c.dos || dos.map(x => words(x, 12)))[0] || "",
    deliver: c.deliver || words(b.act.output, 18), checks: c.checks || b.act.checkpoints.slice(0, 5).map(x => words(x, 12)),
    dos: c.dos || dos.slice(0, 2).map(x => words(x, 12)), donts: c.donts || donts.slice(0, 2).map(x => words(x, 12))};
  return {image: c.image || "knowledge-check", questions: c.questions || b.check.questions};
}
/* The illustrations move, and the motion means something: a scene's strokes (a check mark, a signature, a line of
   text) draw themselves as it appears, its sparkles twinkle, and its subject moves the way the scene does — a phone
   rings, the car drives, the scale weighs, a filing is stamped, a deadline pulses, a document floats. A click replays
   it. Every scene shares one structure (a background shape, sparkles, a shadow, then the subject), so the subject is
   grouped after the shadow and each stroked path is given a unit length to draw along. Reduced motion: none of it. */
const ART_MOTION = {
  "client-call": "ring", "phone-call": "ring", "intake-interview": "talk", "team-huddle": "talk", "strategy-session": "talk",
  "car-transport": "drive", "property-damage": "jolt", "repair-shop": "jolt", "skip-trace": "search",
  "lien-scale": "sway", "negotiation": "sway", "mediation-table": "sway", "arbitration": "sway", "courthouse": "sway",
  "release-signature": "stamp", "legal-filing": "stamp", "demand-letter": "stamp", "policy-letter": "stamp", "settlement-check": "stamp",
  "escalation-alert": "pulse", "clock-deadline": "pulse", "calendar-gap": "pulse", "bottleneck": "pulse", "knowledge-check": "pulse",
  "email-outreach": "send", "privacy-shield": "pulse", "money-ledger": "stamp", "deposition-video": "talk"
};
const ART_CACHE = {};
function artSvg(key){
  if(ART_CACHE[key]) return ART_CACHE[key];
  let svg = ART[key];
  const m = svg.match(/<ellipse[^>]*opacity="0\.08"\/>/);
  if(m){ const i = svg.indexOf(m[0]) + m[0].length; svg = svg.slice(0, i) + '<g class="cfa-subj">' + svg.slice(i).replace(/<\/svg>\s*$/, "</g></svg>"); }
  svg = svg.replace(/<path (?=[^>]*fill="none")(?=[^>]*stroke=")/g, '<path pathLength="1" class="cfa-draw" ');
  return (ART_CACHE[key] = svg);
}
const art = (key, cls) => ART[key] ? `<div class="cfx-art ${cls || ""}" data-motion="${ART_MOTION[key] || "float"}" aria-hidden="true" title="Click to replay" onclick="cmCaseFlow.artReplay(this)">${artSvg(key)}</div>` : "";
window.cmCaseFlow.artReplay = (el) => { el.classList.remove("cfa-on"); void el.offsetWidth; el.classList.add("cfa-on"); };
/* ---------- the tools and simulators, connected at every step ----------
   Every Case Flow slide carries the tools its step is worked in (🛠 in the slide's top row), each On the Job row
   and each Your Task step opens the tool it names, and Check Your Work logs the reference of what the trainee did
   there. The training platforms open in the course's own tool frame (js/cm-skillbuilders.js openTool: the
   session is kept while the trainee moves between slides); the course's own pages (the Action Plan, the Case
   Documents, the Calendar Conflict Resolver) open with a way back to the slide; a call on John Doe's file is the
   step's live call. The Drafting Tools (LOR, HIPAA, Med Provider) stay out: they're standalone exercises on
   their own assigned cases, never linked to a case file. */
const TOOLKIT = [
  {id: "cms", icon: "🗂", short: "CMS", name: "the CMS", re: /\bCMS\b|Case File|Case Notes|Case Summary|Communications Log|Financial Ledger|Lien Tracker|Net Sheet|Recovery Ledger|Insurance tab|\bTasks\b|\bLiens\b|Parties|\bCalendar\b(?! Conflict)|Documents →/},
  {id: "call", icon: "📞", short: "Call Simulator", name: "the Call Simulator", re: /Call Simulator|\bcall(s|ed)? (John|Margaret|Dana|the adjuster|the client)\b/i},
  {id: "netsheet", icon: "📊", short: "Net Sheet", name: "the LSH Net Sheet", re: /Net Sheet|Lien Tracker|Recovery Ledger|Specials ledger|Financial Ledger → Specials/},
  {id: "email", icon: "✉️", short: "Email", name: "the Email Workspace", re: /Email Workspace/},
  {id: "replies", icon: "📨", short: "Replies", name: "Email Replies", re: /Email Replies/},
  {id: "docket", icon: "⚖️", short: "Docket", name: "the Docket System", re: /Docket System/},
  {id: "records", icon: "🩺", short: "ChartSwap", name: "ChartSwap (the Medical Records Requests platform)", re: /ChartSwap|Medical Records Requests?/},
  {id: "efiling", icon: "🏛", short: "E-Filing", name: "Court E-Filing", re: /E-Filing/},
  {id: "calendar", icon: "◫", short: "Conflicts", name: "the Calendar Conflict Resolver", re: /Calendar Conflict Resolver/},
  {id: "calendaring", icon: "🗓", short: "Calendaring", name: "the Calendaring Simulators", re: /Calendaring Simulators?/},
  {id: "plan", icon: "📝", short: "Action Plan", name: "your Action Plan", re: /Action Plan Editor|action plan/i},
  {id: "docs", icon: "📁", short: "Documents", name: "the Case Documents", re: /Case Documents/},
  {id: "lor", icon: "📄", short: "LOR Drafting", name: "LOR Drafting (John Doe v. Robert Smith)", re: /\bLORs?\b|Letters? of Representation/},
  {id: "packet", icon: "📚", short: "Packet Builder", name: "the Packet Builder (Demand Packets & Binders)", re: /Packet Builder/},
];
const TOOL = Object.fromEntries(TOOLKIT.map(t => [t.id, t]));
/* The LSH Net Sheet is where the money is worked, and only there: Day 4's Settlement Negotiations, Lien Negotiations and
   Disbursement (Track A, settled before suit) and its close-out once the case is won (Track B). Each block of those
   modules opens it at that stage (js/cm-net-sheet.js STAGES). */
const NET_MODS = {d3m2: "recovery", d3m3: "liens", d3m4: "final", d5m5: "litigation"};
/* The email practice a step opens, aimed at the step rather than at a page of choices (the Portal's
   simulators/email.js and email-replies.html read these):
     ✉ Email Workspace  → inbox=1, the ready-made inbox the trainee's program starts on (the CM Monday
                           inbox on this course), opened straight away instead of the chooser;
     📨 Email Replies    → email=<id>, the one scenario the step is about (the ids in the Portal's
                           reply-packs/emails.json). EMAIL_NEED maps a block to its scenario; a block
                           with no entry opens the list filtered to the course, as before. */
/* A Case Manager's day is negotiating and communicating in writing, so each activity that is practice
   at one of those opens the Email Replies scenario for that need — the adjuster, the lienholder, the
   provider's billing desk, the client, the attorney — rather than a list of eleven to pick from. The
   ids are the Portal's (simulators/reply-packs/emails.json); a block listed here is also offered Email
   Replies among its tools (blockTools), and a block that isn't listed is unaffected.
   Which scenario belongs to which activity is a curriculum decision: this is the mapping by the need
   each activity practises, and it is meant to be edited here as the Case Flow changes. A scenario is
   used for more than one activity where the need is the same skill (an adjuster is negotiated with more
   than once). */
const EMAIL_NEED = {
  // Negotiating
  "d3m1-a1": "cm_adjuster_statement",         // serving the BI time-limit demand: the adjuster's demands back
  "d3m2-a1": "cm_adjuster_statement",         // MRI findings against the 14-day gap
  "d5m2-a2": "cm_adjuster_statement",         // diminished value, argued with the carrier
  "d3m3-a1": "cm_hospital_lien",              // statutory lien reduction: the hospital's $45,000 notice
  "d3m3-a2": "cm_lop_provider",               // provider balance negotiation
  "d2m2-a1": "cm_lop_provider",               // transmitting LOPs: the provider's balance question
  "d5m1-a1": "cm_extension",                  // pleadings and discovery: opposing counsel's extension
  // Communicating
  "d1m2-a1": "all_web_inquiry",               // multi-channel outreach: a prospective client's inquiry
  "d1m3-a1": "cm_spouse",                     // onboarding directions: what a spouse may be told
  "d2m2-a2": "cm_client_bills_collections",   // A-C-T crisis protocol: the client whose bills keep coming
  "d2m3-a1": "cm_client_bills_collections",   // probing the treatment gap with the client
  "d2m3-a2": "cm_records_dob",                // the gap justification record: a records request refused
  "d2m4-a2": "cm_attorney_status",            // the pre-demand strategy session: "where are we?"
  "d3m2-a2": "cm_client_net",                 // closing the gross recovery: "where is my money"
  "d3m4-a2": "all_wire_phish"                 // release and disbursement: fraudulent wire instructions
};
/* The Training Portal's Packet Builder (simulators/demand-packet.html) assembles the packet these steps put together, as
   one PDF (cover letter, index, demand, PIP log, bills, records; or the binders' numbered tabs), and files it into the
   case in the CMS beside the slide through this course's relay (js/cm-doc-filing.js). Each step opens the packet it
   builds, with the trainee's open case. */
const PACKET_TYPE = {"d3m1-pkg": "demand", "d3m1-a1": "demand", "d4m3-l1": "mediation", "d4m3-a1": "mediation", "d4m3-l2": "arbitration", "d4m3-a2": "arbitration"};
function emailTarget(id, blockId){
  if(id === "packet"){
    const c = window.CMCase && CMCase.id && CMCase.id();
    return "type=" + (PACKET_TYPE[blockId] || "demand") + (c ? "&case=" + encodeURIComponent(c) : "");
  }
  if(id === "email") return "inbox=1";
  if(id === "replies") return EMAIL_NEED[blockId] ? "email=" + EMAIL_NEED[blockId] : "";
  return "";
}
const NET_STAGE = {};
Object.keys(STORED).forEach(id => { const st = NET_MODS[STORED[id].mod.id]; if(st) NET_STAGE[id] = st; });
Object.assign(NET_STAGE, {"d3m2-bins": "bi", "d3m2-umns": "um"});   // the settlement-stage sheets, one per stream
/* The records, docket and court-filing platforms, at the steps where that work happens on John Doe's file (on top of
   any the step's own text names): ChartSwap for the records and itemized bills behind treatment, specials, liens and
   discovery; the Docket System for every court date the litigation track sets; Court E-Filing for the complaint,
   the First Amended Complaint and alternative service. */
const WORKED_IN = {
  "d2m2-a1": ["records"], "d2m2-a2": ["records"], "d2m2-a3": ["records"], "d2m3-a2": ["records"], "d2m4-a1": ["records"], "d3m3-a2": ["records"],
  "d4m1-a2": ["docket", "efiling"], "d4m2-a2": ["docket"], "d5m1-a1": ["efiling", "docket", "records"], "d5m1-a2": ["docket"],
  "d5m3-a1": ["docket"], "d5m4-a2": ["efiling"],
  "d3m1-pkg": ["packet"], "d3m1-a1": ["packet"], "d4m3-l1": ["packet"], "d4m3-a1": ["packet"], "d4m3-l2": ["packet"], "d4m3-a2": ["packet"],
  "d2m2-l1": ["records"], "d2m2-l2": ["records"], "d2m4-l1": ["records"], "d4m1-l2": ["efiling", "docket"], "d4m2-l1": ["docket"], "d5m1-l1": ["efiling", "docket"], "d5m1-l2": ["docket"]};
/* LOR Drafting (js/cm-lor.js, on John Doe's file with no assignment) is the claims phase's: Claim Set Up drafts the LORs */
const LOR_BLOCKS = new Set();
(CF.sequence || []).forEach(d => d.phases.forEach(ph => { if(/^Claim Set Up/.test(ph.title)) ph.blocks.forEach(id => LOR_BLOCKS.add(id)); }));
// the in-course pages a tool opens (anything else is a training platform in the tool frame)
const PAGE = {plan: ["notes"], docs: ["casedocs"], calendar: ["tool", "calendar"], lor: ["lor"]};
function toolLive(id, blockId){
  // a step with a call on John Doe's file takes that call; any other opens the Call Simulator (☎ LSH Ring Channel)
  if(id === "call") return !!(blockId && SIM.calls[blockId]) || (typeof cmTool === "function" && !!cmTool("calls"));
  if(id === "netsheet") return !!(blockId && NET_STAGE[blockId]);
  if(id === "lor") return !!(blockId && LOR_BLOCKS.has(blockId)) && typeof window.cmLorCard === "function";
  if(PAGE[id]) return id !== "calendar" || (typeof PRACTICE_TOOLS !== "undefined" && PRACTICE_TOOLS.some(t => t.id === "calendar"));
  return typeof openTool === "function" && typeof cmTool === "function" && !!cmTool(id);
}
/* the tools a text names, in the toolkit's order, that this course can open */
function toolsIn(text, blockId){
  const t = String(text || "");
  return TOOLKIT.filter(x => x.re.test(t) && toolLive(x.id, blockId)).map(x => x.id);
}
/* the tools of a block, for every slide of it */
function blockTools(b){
  let ids;
  if(b.kind === "activity") ids = toolsIn(b.act.tool + " " + b.act.prompt, b.id).concat(SIM.calls[b.id] ? ["call"] : []);
  else if(b.kind === "lesson") ids = toolsIn((b.ops || []).map(o => o[2]).join(" · "), b.id);
  else ids = ["cms", "docs"];
  if(NET_STAGE[b.id]) ids.push("netsheet");   // every block of a Case Phase that works the money
  if(b.id === "d2m1-a1") ids.push("lor");   // Generating Formal LORs: drafted in LOR Drafting, logged in the CMS
  if(EMAIL_NEED[b.id]) ids.push("replies");   // practice at the negotiating or communicating this step needs (EMAIL_NEED)
  ids = ids.concat(WORKED_IN[b.id] || []);
  ids = [...new Set(ids)];
  return ids.length ? ids : ["cms"];
}
/* Your Task: each step ends with a link to where it's done. The CMS screen a step names (New Case for the Conflict
   Check, Calendar for a deadline, Case Notes for a note); a step worked from the file's documents opens 📁 Work From
   (its documents open beside the slide); otherwise the tool the step names, else the block's own tool. */
const STEP_AT = [
  [/Conflict Check/i, "cms", "CMS → New Case"],
  [/Case Notes/, "cms", "CMS → Case Notes"],
  [/\bDocket\b(?! System)|\bSOL\b|\bcalendar\b(?! Conflict)/i, "cms", "CMS → Calendar"],
  [/\bParties\b|\broles?\b/i, "cms", "CMS → Parties"],
  [/source documents?|signed documents?|against (the|its|each) (Police Report|Declaration Page|record|document)/i, "docs", "Documents"]
];
function stepLink(text, b){
  const t = String(text || "").replace(/\*\*/g, ""), hit = STEP_AT.find(([re]) => re.test(t));
  // a step worked in the Notes & Action Plan (the transcript, the plan, its emails) opens it
  if(notesOf(b.id) && /transcribe|action plan|^email|coordinate/i.test(t)) return ` <button type="button" class="cfx-at" onclick="cmCaseFlow.notes('${b.id}')" title="Open the Notes &amp; Action Plan">📝 ${/^email|coordinate/i.test(t) ? "Email Simulator" : "Notes"} ↗</button>`;
  let id = hit && hit[1], label = hit && hit[2];
  if(id === "docs" && !(CF_PACKETS[b.id] || []).length){ id = toolLive("docs", b.id) ? "docs" : null; label = "Documents"; }
  if(id === "cms" && !toolLive("cms", b.id)) id = null;
  if(!id){ id = toolsIn(t, b.id)[0] || blockTools(b).filter(x => x !== "call")[0]; label = id && TOOL[id] ? TOOL[id].short : ""; }
  if(!id || !TOOL[id]) return "";
  const go = id === "docs" && (CF_PACKETS[b.id] || []).length ? `cmCaseFlow.workFrom(this)` : `cmCaseFlow.tool('${id}','${b.id}')`;
  return ` <button type="button" class="cfx-at" onclick="${go}" title="Open ${E(label)}">${TOOL[id].icon} ${E(label)} ↗</button>`;
}
function toolChip(id, blockId, big){
  const t = TOOL[id];
  if(!t || !toolLive(id, blockId)) return "";
  const live = id === "call" && blockId && SIM.calls[blockId], name = live ? `the live call with ${SIM.calls[blockId].who}` : t.name;
  return `<button type="button" class="${big ? "btn btn-navy btn-sm" : "cfx-tool"}" data-tool="${id}" onclick="cmCaseFlow.tool('${id}','${blockId || ""}')" title="Open ${E(name)}">${t.icon} ${E(live ? "Live Call" : big ? t.name.replace(/^(the|your) /, "").replace(/^./, c => c.toUpperCase()) : t.short)}</button>`;
}
const toolChips = (ids, blockId, big) => ids.map(id => toolChip(id, blockId, big)).join("");
function rowTools(b, cell, ri){
  for(const t of [cell, ((b.ops || [])[ri] || [])[2]]){ const ids = toolsIn(t, b.id); if(ids.length) return ids; }
  return blockTools(b).slice(0, 1);
}
function toolButtons(tool, blockId){ return toolChips(toolsIn(tool, blockId), blockId, true); }
/* ---------- 3 Clues, 1 Rule: the Do & Don't slide as a game ----------
   Adapted from Foundational's "3 Clues, 1 Claim". Each round hides one of the lesson's Dos or Don'ts behind three
   clues (build/case-flow/slides/clues-dN.json), shown one at a time. The class calls it (✅ Do or ⚠️ Don't) and
   names the rule; the rule is then revealed. A right call on the first clue scores 3, on the second 2, on the
   third 1. The rounds are mixed so the order gives nothing away, and the full list closes the game. */
const ddList = c => `<div class="cfx-dd"><div class="cfx-do"><h3>✅ Do</h3><ul>${c.dos.map(x => `<li>${hl(x)}</li>`).join("")}</ul></div>
      <div class="cfx-dont"><h3>⚠️ Don't</h3><ul>${c.donts.map(x => `<li>${hl(x)}</li>`).join("")}</ul></div></div>`;
const blockById = id => { for(const d of CF.days) for(const m of d.modules){ const b = m.blocks.find(x => x.id === id); if(b) return b; } return null; };
const CG_ROUNDS = 3;   // a short game: three rounds, the rest of the rules in the full list (📋)
const CG = {};   // the game on each lesson's slide, for this visit: {round, shown, calls: {i: {pick, ok, pts}}, list}
function cgRounds(b){
  const c = copyOf(b), k = SLIDES[b.id].clues;
  const r = c.dos.map((x, i) => ({side: "do", rule: x, clues: k.dos[i]})).concat(c.donts.map((x, i) => ({side: "dont", rule: x, clues: k.donts[i]})));
  let h = 0; for(const ch of b.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;   // a fixed mix per lesson: the same for the whole class
  for(let i = r.length - 1; i > 0; i--){ h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [r[i], r[j]] = [r[j], r[i]]; }
  return r.slice(0, CG_ROUNDS);
}
function clueGame(b){
  const g = CG[b.id] = CG[b.id] || {round: 0, shown: 1, calls: {}, list: false}, rounds = cgRounds(b);
  const done = Object.keys(g.calls).length, pts = Object.values(g.calls).reduce((a, x) => a + x.pts, 0), over = done === rounds.length;
  const head = `<div class="cfx-cg-head"><div class="cfx-cg-marq"><b>3 Clues, 1 Rule</b><span>Spot the clues. Make the call. Name the rule.</span></div>
      <div class="cfx-cg-tabs">${rounds.map((x, i) => { const k = g.calls[i]; return `<button type="button" class="cfx-cg-tab${i === g.round && !g.list ? " on" : ""}${k ? (k.ok ? " ok" : " miss") : ""}" onclick="cmCaseFlow.cg('${b.id}','round',${i})" aria-label="Round ${i + 1}">${k ? (x.side === "do" ? "✅" : "⚠️") : i + 1}</button>`; }).join("")}
        <button type="button" class="cfx-cg-tab list${g.list ? " on" : ""}" onclick="cmCaseFlow.cg('${b.id}','list')" title="The full Do & Don't list">📋</button></div>
      <span class="cfx-cg-score">⭐ ${pts} pt${pts === 1 ? "" : "s"} · ${done}/${rounds.length} called</span></div>`;
  if(g.list || g.ended) return `<div class="cfx-cg" id="cfxCg-${b.id}">${head}${g.ended && !g.list ? `<p class="cfx-cg-final">🏁 Game over: <b>${pts} of ${rounds.length * 3}</b> points. Here is the full list. <button type="button" class="btn btn-ghost btn-sm" onclick="cmCaseFlow.cg('${b.id}','again')">↻ Play again</button></p>` : ""}${ddList(copyOf(b))}</div>`;
  const x = rounds[g.round], call = g.calls[g.round], shown = call ? 3 : g.shown;
  const cards = x.clues.map((t, j) => j < shown
    ? `<div class="cfx-cg-clue" style="animation-delay:${call ? 0 : .05}s"><small>Clue ${j + 1}</small><span>${E(t)}</span></div>`
    : `<div class="cfx-cg-clue hid"><small>Clue ${j + 1}</small><span>?</span></div>`).join("");
  const act = call
    ? `<div class="cfx-cg-reveal ${x.side}"><b>${x.side === "do" ? "✅ Do" : "⚠️ Don't"}</b><span>${hl(x.side === "dont" ? x.rule.replace(/^./, ch => ch.toUpperCase()) : x.rule)}</span>
        <em>${call.ok ? `Right call, +${call.pts}` : `It's a ${x.side === "do" ? "Do" : "Don't"}: no points`}</em>
        <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.cg('${b.id}','${over ? "end" : "next"}')">${over ? "See the results 🏁" : "Next round →"}</button></div>`
    : `<div class="cfx-cg-act">${g.shown < 3 ? `<button type="button" class="btn btn-ghost btn-sm" onclick="cmCaseFlow.cg('${b.id}','clue')">🔎 Next clue (${3 - g.shown} left)</button>` : ""}
        <span>Name the rule, then call it:</span>
        <button type="button" class="btn btn-sm cfx-cg-do" onclick="cmCaseFlow.cg('${b.id}','call','do')">✅ It's a Do</button>
        <button type="button" class="btn btn-sm cfx-cg-dont" onclick="cmCaseFlow.cg('${b.id}','call','dont')">⚠️ It's a Don't</button>
        <small>${4 - g.shown} pt${g.shown === 3 ? "" : "s"} for a right call now</small></div>`;
  return `<div class="cfx-cg" id="cfxCg-${b.id}">${head}<div class="cfx-cg-stage">${cards}</div>${act}</div>`;
}
window.cmCaseFlow = window.cmCaseFlow || {};
window.cmCaseFlow.cg = function(id, act, arg){
  const g = CG[id], b = blockById(id); if(!g || !b) return;
  const rounds = cgRounds(b), next = () => { for(let k = 1; k <= rounds.length; k++){ const i = (g.round + k) % rounds.length; if(!g.calls[i]) return i; } return g.round; };
  if(act === "round"){ g.round = arg; g.shown = 1; g.list = false; g.ended = false; }
  else if(act === "list"){ g.list = !g.list; if(!g.list) g.ended = false; }
  else if(act === "clue") g.shown = Math.min(3, g.shown + 1);
  else if(act === "call" && !g.calls[g.round]){ const ok = arg === rounds[g.round].side; g.calls[g.round] = {pick: arg, ok, pts: ok ? 4 - g.shown : 0}; }
  else if(act === "next"){ g.round = next(); g.shown = 1; }
  else if(act === "end"){ g.ended = true; g.list = false; }
  else if(act === "again"){ CG[id] = {round: 0, shown: 1, calls: {}, list: false}; }
  const el = document.getElementById("cfxCg-" + id); if(!el) return;
  el.outerHTML = clueGame(b);
  if(typeof fitSlideZoom === "function") fitSlideZoom(document.getElementById("lessonSlideWrap"));   // the game grows as it plays: scale the slide to fit again
};
/* Plain English: every legal term and abbreviation in CF.plain is explained, in plain words, on the first block that
   uses it (in the order the course teaches), before any task asks the trainee to work with it: on a lesson's Rules
   slide, or on an activity's Your Task slide */
let PLAIN_FIRST = null;
const plainRe = t => { const ac = /^[A-Z0-9&/.-]+$/.test(t), esc = t.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); return new RegExp("\\b" + esc + (ac ? "s?" : "(s|es)?") + "\\b", ac ? "" : "i"); };
function plainFirst(){
  if(PLAIN_FIRST) return PLAIN_FIRST;
  PLAIN_FIRST = {};
  const terms = Object.keys(CF.plain || {}), seen = new Set(), all = {};
  CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { all[b.id] = b; })));
  SEQUENCE.forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(id => {
    const b = all[id]; if(!b) return;
    const text = JSON.stringify([SLIDES[id] || {}, b.title, b.topic, b.tell || {}, b.act ? [b.act.scenario, b.act.prompt] : [], b.check ? b.check.questions : []]).replace(/\*\*/g, "");
    const fresh = terms.filter(t => !seen.has(t) && plainRe(t).test(text));
    fresh.forEach(t => seen.add(t));
    if(fresh.length) PLAIN_FIRST[id] = fresh;
  })));
  return PLAIN_FIRST;
}
function plainBox(b){
  const ts = plainFirst()[b.id] || [];
  if(!ts.length) return "";
  return `<details class="cfx-plain"${ts.length <= 3 ? " open" : ""}><summary>📖 <b>In plain English</b> · ${ts.map(E).join(" · ")}</summary><dl>${ts.map(t => `<div><dt>${E(t)}</dt><dd>${E(CF.plain[t])}</dd></div>`).join("")}</dl></details>`;
}
/* Time on the file. The course is five days; John Doe's case runs from the collision to the award over a year and a
   half, and its Skill Activities are taught by topic, not in date order. So each one's Your Case opens by saying how
   the file has moved since the last task (later, back to an earlier date, the other workstream, or into Track B),
   how long after the collision it is, what stage the file is at (the activity's `transition`), and how much of the
   SOL is left. All of it is worked out from the case's own dates, so it follows the case year and the CMS's DOL. */
const SPAN_DAYS = 14;   // a move of less than two weeks is the same stretch of work: no jump is announced
function spanOf(days){
  days = Math.abs(Math.round(days));
  if(days < SPAN_DAYS) return days === 1 ? "1 day" : `${days} days`;
  if(days < 60) return `${Math.round(days / 7)} weeks`;
  const mo = Math.round(days / 30.44), y = Math.floor(mo / 12), m = mo % 12;
  return [y ? `${y} year${y > 1 ? "s" : ""}` : "", m ? `${m} month${m > 1 ? "s" : ""}` : ""].filter(Boolean).join(" ");
}
const johnDoeActs = () => MODULES.flatMap(d => d.lessons).filter(l => l.cf.block.kind === "activity" && !l.cf.block.otherMatter && SIM.events[l.cf.block.id]);
function timeBanner(l){
  const b = l.cf.block, ev = SIM.events[b.id];
  if(!ev) return "";
  const say = b.transition ? `<p>${hl(b.transition)}</p>` : "";
  if(b.otherMatter) return `<div class="cfx-when cfx-when-other"><div class="cfx-when-top"><b class="cfx-when-jump">📂 A different file</b><span class="cfx-when-date">📆 File date <b>${E(ev.date)}</b></span></div>${say}</div>`;
  const acts = johnDoeActs(), i = acts.findIndex(x => x.cf.block.id === b.id), prev = i > 0 ? acts[i - 1] : null;
  const t = dayMs(ev.date), dol = dayMs(CF.case.dol), sol = dayMs(CF.case.sol), DAY = 864e5;
  let jump = "";
  if(!prev) jump = "📅 Day one on the file";
  else {
    const gap = (t - dayMs(SIM.events[prev.cf.block.id].date)) / DAY, far = Math.abs(gap) >= SPAN_DAYS;
    const intoB = trackOf(l.cf.mod.id) === "B" && trackOf(prev.cf.mod.id) !== "B";
    const lanes = l.cf.lane && prev.cf.lane && l.cf.lane !== prev.cf.lane;
    if(intoB) jump = `🔀 Track B: the same file, had it not settled${gap < 0 && far ? `, back to ${E(ev.date)}` : ""}`;
    else if(lanes) jump = `⇄ Meanwhile, on ${E(LANES[l.cf.lane])}${far ? (gap < 0 ? `, back to ${E(ev.date)}` : `, ${spanOf(gap)} later`) : ""}`;
    else if(far) jump = gap > 0 ? `⏩ ${spanOf(gap)} later` : `⏪ Back to ${E(ev.date)}, ${spanOf(gap)} before the last task`;
  }
  const left = (sol - t) / DAY;
  const solLine = left > 0 ? `⚖️ SOL ${E(CF.case.sol)} · <b>${spanOf(left)} left</b>` : `⚠️ <b>Past the SOL</b> (${E(CF.case.sol)})`;
  const urgency = left <= 0 ? " cfx-when-late" : left < 183 ? " cfx-when-soon" : "";   // the SOL pill: green, amber inside six months, red once it's past
  return `<div class="cfx-when${urgency}"><div class="cfx-when-top">${jump ? `<b class="cfx-when-jump">${jump}</b>` : ""}<span class="cfx-when-date">📆 File date <b>${E(ev.date)}</b> · ${t > dol ? `<b>${spanOf((t - dol) / DAY)}</b> after the collision` : "the day of the collision"}</span><span class="cfx-when-sol">${solLine}</span></div>${say}</div>`;
}
function slideBody(view, l, d){
  const {block: b, day, mod} = l.cf, c = copyOf(b);
  switch(view){
    case "why": { const ls = leadSplit(c.hook);
      return `<div class="cfx-hero"><div class="cfx-hero-text"><span class="cfx-chip">${E(titleCase(b.topic))}</span>${ls ? `<p class="cfx-lead-1">${hl("**" + ls[0] + "**")}</p><p class="cfx-hook">${hl(ls[1])}</p>` : `<p class="cfx-hook">${hl(c.hook)}</p>`}</div>${art(c.image)}</div>${strip()}`; }
    case "theory": case "theory2": {
      const t = c.theory, half = Math.ceil(t.concepts.length / 2), two = t.concepts.length > TH_PER;
      const list = !two ? t.concepts : view === "theory" ? t.concepts.slice(0, half) : t.concepts.slice(half);
      return `<div class="cfx-theory cfx-th-solo"><div class="cfx-th-main">${view === "theory" ? mapStrip(b) : ""}
          ${view === "theory" ? (leadSplit(t.lead) ? `<p class="cfx-lead-1">${hl("**" + leadSplit(t.lead)[0] + "**")}</p><p class="cfx-th-lead">${hl(leadSplit(t.lead)[1])}</p>` : `<p class="cfx-th-lead">${hl(t.lead)}</p>`) : `<p class="cfx-th-cont">${E(titleCase(b.topic))}: continued</p>`}
          <div class="cfx-th-grid">${list.map((x, j) => `<div class="cfx-th-c" style="animation-delay:${j * .05}s"><b>${E(x.term)}</b><span>${hl(x.text)}</span>${(x.more || []).length ? `<button type="button" class="cfx-th-more" onclick="cmCaseFlow.more('${b.id}',${t.concepts.indexOf(x)})" title="More on ${E(x.term)}">＋ More</button>` : ""}</div>`).join("")}</div></div>
      </div>`;
    }
    case "frame": {   // the deck page's structure, drawn in the course's own design
      const f = c.theory.framework, steps = f.steps || [];
      const body = f.kind === "table"
        ? `<div class="cfx-fw-scroll"><table class="cfx-fw-tbl"><thead><tr>${f.head.map(h => `<th>${E(h)}</th>`).join("")}</tr></thead><tbody>${f.rows.map((r, i) => `<tr style="animation-delay:${i * .05}s">${r.map((x, j) => j ? `<td>${hl(x)}</td>` : `<th scope="row">${hl(x)}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`
        : f.kind === "flow"
          ? `<ol class="cfx-fw-flow" style="--n:${steps.length}">${steps.map((x, i) => `<li style="animation-delay:${i * .07}s"><span class="cfx-fw-n">${i + 1}</span><b>${E(x.label)}</b><span>${hl(x.text)}</span></li>`).join("")}</ol>`
          : `<div class="cfx-fw-list">${steps.map((x, i) => `<div style="animation-delay:${i * .05}s"><b>${E(x.label)}</b><span>${hl(x.text)}</span></div>`).join("")}</div>`;
      return `<div class="cfx-fw"><h3 class="cfx-fw-t">${E(String(f.title).replace(/,?\s*\(?Steps?\s+\d+\s*[–-]\s*\d+\)?\s*$/i, ""))}</h3>${body}${f.note ? `<p class="cfx-fw-note">${hl(f.note)}</p>` : ""}</div>`;
    }
    case "doc": {   // The Document: what it is, why the law cares, what it proves, and the Case Manager's handling
      const d = c.document, f = d.doc && CF_DOCS.find(x => x.id === d.doc);
      const card = (cls, h, body) => `<div class="cfx-doc-c ${cls}"><h3>${h}</h3>${body}</div>`;
      return `<div class="cfx-fw cfx-doc"><h3 class="cfx-fw-t">📄 ${E(d.name)}</h3><div class="cfx-doc-w">
        <div class="cfx-doc-g">${card("cfx-doc-def", "What it is", `<p>${hl(d.definition)}</p>`)}${card("cfx-doc-pur", "Its legal purpose", `<p>${hl(d.purpose)}</p>`)}
          ${card("cfx-doc-ev", "What it proves", `<p>${hl(d.evidence)}</p>`)}${card("cfx-doc-cm", "How you handle it", `<ul>${d.handling.map(x => `<li>${hl(x)}</li>`).join("")}</ul>`)}</div>
        ${f ? `<a class="cfx-thumb cfx-doc-f" href="${E(docUrl(f))}" target="_blank" rel="noopener" title="${E(f.desc)}" onclick="return cmCaseFlow.doc(event,'${f.id}')"><img src="/decks/cf-docs/${E(f.id)}.webp" alt="" loading="lazy"><span>On John Doe's file: ${E(f.title)}</span></a>` : ""}</div>
        <p class="cfx-fw-note">Know the document before you're asked to work with it.</p></div>`;
    }
    case "map": { const r = roadmapOf(b), steps = r.steps;
      return `<div class="cfx-fw cfx-map"><h3 class="cfx-fw-t">🗺 ${E(r.title)}</h3><ol class="cfx-fw-flow" style="--n:${steps.length}">${steps.map((x, i) => `<li style="animation-delay:${i * .07}s"><span class="cfx-fw-n">${i + 1}</span><b>${E(x.label)}</b><span>${hl(x.text)}</span></li>`).join("")}</ol><p class="cfx-fw-note">Where this lesson is going: each step is taught next, before anything asks you to do it.</p></div>`;
    }
    case "rules": return `<div class="cfx-split"><ol class="cfx-points">${c.points.map(x => `<li><span>${hl(x)}</span></li>`).join("")}</ol>${art(c.image, "small")}</div>${plainBox(b)}
      ${c.upl ? `<div class="cfx-upl"><b>⚖ UPL Line</b><span>${hl(c.upl)}</span></div>` : ""}`;
    case "audit": return auditSlide(b);
    case "grade": {   // what a Grade-A packet or binder holds and how it is built, shown before Your Task
      const g = SLIDES[b.id].grade, col = (cls, h, xs, ol) => `<div class="cfx-grade-c ${cls}"><h3>${h}</h3><${ol ? "ol" : "ul"}>${xs.map(x => `<li>${hl(x)}</li>`).join("")}</${ol ? "ol" : "ul"}></div>`;
      return `<div class="cfx-fw cfx-grade-w"><h3 class="cfx-fw-t">🏅 ${E(g.title)}</h3><div class="cfx-grade">${col("cfx-grade-g", "📐 Guidelines", g.guide)}${col("cfx-grade-i", "📦 Standard Inclusions", g.include)}${col("cfx-grade-s", "🪜 Steps to Grade A", g.steps, true)}</div>
        <p class="cfx-fw-note">Build your own version from the downloaded case documents, then upload it to your training Drive and the CMS: the platform audits it against this standard.</p></div>`;
    }
    case "model": return `<div class="cfx-model">${b.show && b.show.caption ? `<p class="cfx-caption">${E(b.show.caption)}</p>` : ""}${visual(l, b)}</div>`;
    case "job": return `<div class="cfx-job">${c.job.map((r, ri) => `<div class="cfx-flow">${r.map((x, j) => `<div class="cfx-step"><small>${["Trigger", "Task", "Tool", "Checkpoint"][j]}</small><span>${hl(x)}</span></div>`).join('<span class="cfx-arrow">➔</span>')}</div>`).join("")}</div>`;
    case "dodont": return (SLIDES[b.id] || {}).clues ? clueGame(b) : ddList(c);
    case "case": {
      const docs = (CF_PACKETS[b.id] || []).map(id => CF_DOCS.find(x => x.id === id)).filter(docAvail).filter(Boolean).slice(0, 4);
      const ev = SIM.events[b.id], fall = falloutFor(b.id), vm = ev && ev.channel === "voicemail" && ev.spoken;
      const thumbs = notesOf(b.id) ? npCard(b.id) : ev && ev.log ? logSnapshot(ev.log) : docs.length ? `<div class="cfx-docs-row">${docs.map(x => `<a class="cfx-thumb" href="${E(docUrl(x))}" target="_blank" rel="noopener" title="${E(x.desc)}" onclick="return cmCaseFlow.doc(event,'${x.id}')"><img src="/decks/cf-docs/${E(x.id)}.webp" alt="" loading="lazy" onerror="this.parentNode.classList.add('cfx-thumb-off');this.remove()"><span>${E(x.title)}</span></a>`).join("")}</div>` : art(c.image, "small");
      return `<div class="cfx-sb">${timeBanner(l)}
        ${fall.map(x => { const e = x.f.then.event, [icon] = CHANNEL[e.channel] || ["⚠️"];
          return `<details class="cfx-fall"><summary><span class="cfx-fall-i">⚠️</span><b>${E(e.subject)}</b><span class="cfx-fall-from">${icon} ${E(e.from || "")}</span></summary>
            <p>${E(e.body)}</p>${isTrainer() ? `<small class="cfx-fall-why">${x.done ? "Not shown to this trainee: they confirmed" : "Shown because this wasn't confirmed"}: “${E(x.what)}” (${E(x.f.if.activity)})</small>` : ""}</details>`; }).join("")}
        <div class="cfx-sb-grid${vm ? " cfx-sb-vm" : ""}">
          <div class="cfx-sb-main">${ev ? (ev.before || []).map(x => eventCard(x, "cfx-ev-before")).join("") + eventCard(ev, "", b.id, (docs.length > 0 && !ev.log) || !!notesOf(b.id)) : `<div class="cfx-task-card"><span class="cfx-chip">📂 On the file</span><p class="cfx-situation">${hl(c.situation)}</p></div>`}${docs.length && !notesOf(b.id) && !(ev && (ev.log || (ev.before || []).length)) ? art(c.image, "cfx-sb-art") : ""}</div>
          <div class="cfx-sb-docs">${thumbs}</div>
        </div></div>`;
    }
    case "task": { const main = blockTools(b).filter(id => id !== "call")[0] || "cms";
      const where = TOOLKIT.find(t => t.id === main), whereName = where ? where.name.replace(/^the /, "the ") : "the CMS";
      /* the busiest slides were shrunk to fit: the Practice Lab note is one line, and the things to do (the live call,
         the service confirmation) sit under the steps, so the two columns are about the same height; with both, the
         service confirmation goes to the right column */
      return `${plainBox(b)}<div class="cfx-do-now"><b>🧪 Practice Lab</b><span>Work the steps in ${E(whereName)}${SIM.calls[b.id] ? ", take the live call" : ""}, then <em>Deliver</em>.</span></div>
      <div class="cfx-task"><div class="cfx-task-main"><ol class="cfx-points">${c.steps.map(x => `<li><span>${hl(x)}${stepLink(x, b)}</span></li>`).join("")}</ol>
        ${SIM.calls[b.id] ? `<div class="cfx-call"><b>📞 Live Call</b><span>${E(SIM.calls[b.id].who)} is on the line${(REC.calls || {})[b.id] ? ` · <em>✓ taken ${E(new Date(REC.calls[b.id].at).toLocaleDateString())}</em>` : ""}</span>
          <button type="button" class="btn btn-orange btn-sm" data-tool="call" onclick="cmCaseFlow.call('${b.id}')">📞 Take the call</button></div>` : ""}
        ${serviceOf(b.id) && !SIM.calls[b.id] ? `<div class="cfx-call cfx-svb"><b>✉ Service Confirmation</b><span>${E(serviceOf(b.id).kicker)}${svRec(b.id).filed ? ` · <em>✓ filed ${E(svRec(b.id).filed.name)}</em>` : ""}</span>
          <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.service('${b.id}')">✉ Open the Service Confirmation</button></div>` : ""}
        ${amendOf(b.id) ? (s => `<div class="cfx-call cfx-svb"><b>📝 Skill Builder: Amendment Requests</b><span>${E(amendOf(b.id).kicker)}${s.sent ? ` · <em>${s.sent} of ${s.of} sent · ${s.filed} of ${s.copies} corrected copies filed</em>` : ""}</span>
          <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.amend('${b.id}')">📝 Open the Amendment Requests</button></div>`)(amSummary(b.id, amendOf(b.id), amRec(b.id))) : ""}</div>
      <aside class="cfx-side">${c.purpose || c.principle ? `<div class="cfx-why">${c.purpose ? `<b>🎯 Purpose</b><span>${hl(c.purpose)}</span>` : ""}${c.principle ? `<b>⚖️ Principle</b><span>${hl(c.principle)}</span>` : ""}</div>` : ""}
        ${docLine(b.id) ? `<details class="cfx-docs"><summary><b>📁 Work From</b> · ${(CF_PACKETS[b.id] || []).length} Documents</summary>${docLine(b.id)}${window.cmDocFiling ? cmDocFiling.panel(b.id) : ""}</details>` : ""}
        ${notesOf(b.id) ? `<div class="cfx-call cfx-svb"><b>📝 Notes &amp; Action Plan</b><span>${npParts(b.id).filter(p => p.done).length} of ${npParts(b.id).length} done</span>
          <button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.notes('${b.id}')">📝 Open</button></div>` : ""}
        ${serviceOf(b.id) && SIM.calls[b.id] ? `<div class="cfx-call cfx-svb"><b>✉ Service Confirmation</b><span>${E(serviceOf(b.id).kicker)}${svRec(b.id).filed ? ` · <em>✓ filed ${E(svRec(b.id).filed.name)}</em>` : ""}</span>
          <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.service('${b.id}')">✉ Open the Service Confirmation</button></div>` : ""}
        <button type="button" class="cfx-deliver" onclick="nextSlide()" title="Hand it in, then check your work"><b>📤 Deliver</b><span>${hl(c.deliver)}</span><em>Hand in &amp; check your work ➔</em></button></aside></div>`; }
    case "check": { const open = answersOpen(b.id);
      return `<div class="cfx-check">${c.checks.map((x, j) => `<label class="cfx-tick"><input type="checkbox" ${((REC.ticks || {})[b.id] || [])[j] ? "checked" : ""} onchange="cmCaseFlow.tick('${b.id}',${j},this.checked)"><span>${open ? (justRevealed === b.id ? hl(x).replace(/class="cfx-hl"/g, 'class="cfx-hl cfx-unblur"') : hl(x)) : masked(x)}</span></label>`).join("")}</div>
      ${open ? (isTrainer() && !inAudience() ? `<p class="cfx-key-note">🔑 Trainer view: the answers. Trainees see them blurred until they finish the activity.</p>` : "")
        : `<div class="cfx-reveal"><span>Work the activity in the tool first, then compare: each blurred part is an answer your file should hold.</span><button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.reveal('${b.id}')">✓ I've finished: show the answers</button></div>`}
      ${c.donts.length ? `<div class="cfx-watch"><b>⚠️ Watch For</b>${c.donts.map(x => `<span>${hl(x)}</span>`).join("")}</div>` : ""}${workLog(b)}`; }
    case "questions": case "questions2": {   // each question with its answer box; answers save as they're typed
      const from = view === "questions2" ? KC_PER : 0, m = rec(mod.id), last = from + KC_PER >= c.questions.length;
      return `<ol class="cfx-points cfx-qs cfx-qs-2 cfx-kc" style="counter-reset:cfx ${from}">${c.questions.slice(from, from + KC_PER).map((q, j) => `<li><span><span class="cfx-kc-q">${hl(q)}</span>
          <textarea class="cfx-kc-a" id="cfkc_${mod.id}_${from + j}" rows="2" placeholder="Your answer, from the file" aria-label="Answer ${from + j + 1}" oninput="cmCaseFlow.kcDraft('${mod.id}',${from + j},this.value)">${E(m.kc[from + j] || "")}</textarea></span></li>`).join("")}</ol>
        <p class="cf-note">${last ? "Your answers save as you type and go to review with your Self-Summary (next)." : "More questions on the next slide."} The day's auto-graded quiz comes at the end of Case Flow Day ${day.n}.</p>`;
    }
    case "summary": return `<div class="cfx-summary">${selfSummary(b, day, mod, "qs")}</div>`;
    case "scale": return `<div class="cfx-summary">${selfSummary(b, day, mod, "scale")}</div>`;
  }
  return "";
}
/* How far the trainee has worked each Skill Activity: the furthest slide reached (REC.reached), with ticks, logged
   work, the call and the listening check also counting as having done it. The Case File fills in from this. */
let reachT = null;
function noteReached(b, p){
  if(b.kind !== "activity" || isTrainer() || ((REC.reached || {})[b.id] || 0) >= p) return;
  (REC.reached = REC.reached || {})[b.id] = p;
  clearTimeout(reachT); reachT = setTimeout(persist, 800);
}
const BLOCK = {};
CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { BLOCK[b.id] = b; })));
function actDone(id){
  const b = BLOCK[id]; if(!b) return false;
  return ((REC.reached || {})[id] || 0) >= viewsOf(b).length || ((REC.ticks || {})[id] || []).some(Boolean) || !!(REC.work || {})[id] || !!((REC.listen || {})[id] || {}).at || !!((REC.notes || {})[id] || {}).txAt || !!(REC.calls || {})[id];
}
const actOpened = id => !!(REC.reached || {})[id] || actDone(id);
/* each tool once per slide: a slide names its tools in the top row, in the Your Task "Where" box, beside a step or
   an On the Job row, and the live call in its own box. Only the first of each stays, looked for in that order of
   weight: the live-call box, the Where box, the slide's own content, then the top row (which goes if it ends up empty). */
function oneOfEachTool(html){
  if(typeof document === "undefined") return html;
  const t = document.createElement("template"); t.innerHTML = html;
  const root = t.content, seen = new Set();
  const order = [".cfx-call [data-tool]", ".cfx-side [data-tool]", ".cfx-sheet [data-tool], .cfx-sb [data-tool]", ".cfx-top [data-tool]"];
  const done = new Set();
  order.forEach(sel => root.querySelectorAll(sel).forEach(el => {
    if(done.has(el)) return; done.add(el);
    const id = el.getAttribute("data-tool");
    if(seen.has(id)) el.remove(); else seen.add(id);
  }));
  root.querySelectorAll(".cfx-tools-in").forEach(x => { if(!x.querySelector("[data-tool]")) x.remove(); });
  root.querySelectorAll(".cfx-top .cfx-tools").forEach(x => { if(!x.querySelector("[data-tool]")) x.remove(); });
  root.querySelectorAll(".cfx-side .cfx-btns").forEach(x => { if(!x.querySelector("[data-tool]")) x.remove(); });
  return t.innerHTML;
}
function card(l, i, d, part){
  const {day, mod, block: b, k, phase} = l.cf, vs = viewsOf(b), p = Math.min(Math.max(part || 1, 1), vs.length), view = vs[p - 1];
  noteReached(b, p);
  const dots = vs.map((v, j) => `<span class="cfx-dot${j === p - 1 ? " on" : j < p - 1 ? " done" : ""}" title="${E(VIEW_LABEL[v])}"></span>`).join("");
  const logo = "";   // (the LSH logo is in the top bar; the slide doesn't repeat it)
  const onNavy = view === "case";   // a Skill Building opener sits on the slide itself, like the deck's
  return oneOfEachTool(`<div class="topic-separator cfx-sepline">CASE FLOW DAY ${day.n}${day.track ? ` &middot; ${E(day.track).toUpperCase()}` : ""} &middot; ${phase.lead === "Case Phase" ? `CASE PHASE ${phase.n} OF ${phase.of}` : phase.lead.toUpperCase()} &middot; ${KIND[b.kind].toUpperCase()} &middot; BLOCK ${k + 1} OF ${mod.blocks.length} &middot; ${VIEW_LABEL[view].toUpperCase()}</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-${view} cfx-${b.kind}" data-part="${p}">
      <div class="cfx-deck-head">${logo}<h2 class="cfx-deck-title" title="${E(l.cf.heading)}">${E(l.cf.heading)}</h2></div>
      <div class="cfx-ribbon"><span title="${E(titleCase(b.title))}">${E(titleCase(b.title))}</span></div>
      <div class="cfx-top"><span class="cfx-title cfx-pill"><span class="cfx-vi">${VIEW_ICON[view]}</span>${E(VIEW_LABEL[view])}</span>
        <span class="cfx-dots" aria-label="Slide ${p} of ${vs.length}">${dots}</span><span class="cfx-kicker">${phase.n}.${k + 1} · ${E(KIND[b.kind])}</span>${timeChip(l, d)}
        <button type="button" class="cfx-full" onclick="cmCaseFlow.full(${d.id},${i})">📖 Full text</button></div>
      <div class="cfx-body${onNavy ? " cfx-body-navy" : ""}">${onNavy ? slideBody(view, l, d) : `<div class="cfx-sheet">${slideBody(view, l, d)}</div>`}</div>
    </div>`);
}
if(!document.getElementById("cfx-deck-font")){
  const f = document.createElement("link"); f.id = "cfx-deck-font"; f.rel = "stylesheet";
  f.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap";
  document.head.appendChild(f);
}
window.cmCaseFlow = window.cmCaseFlow || {};
window.cmCaseFlow.full = function(dayId, i){
  const d = cfDay(dayId), l = d && d.lessons[i]; if(!l) return;
  // its own browser tab, so the slides and the tool beside them stay in view; the pop-up only when tabs are blocked
  const w = window.open("", "_blank");
  if(w && w.document){
    const head = [...document.querySelectorAll('link[rel="stylesheet"], style')].map(n => n.outerHTML).join("");
    w.document.open();
    w.document.write(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>${E(titleCase(l.cf.block.title))} — Full Text</title><base href="${location.origin}/">${head}<style>body{background:#F4F5FA;margin:0;padding:24px 16px}.cfx-full-page{max-width:980px;margin:0 auto;padding:18px 24px !important}</style></head><body><div class="card lesson-card cfx-full-page"><h2 style="margin:0 0 12px">📖 ${E(titleCase(l.cf.block.title))} — Full Text</h2>${strip()}${fullText(l, d)}</div></body></html>`);
    w.document.close();
    return;
  }
  const o = document.createElement("div"); o.className = "cfx-modal"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Full text");
  o.innerHTML = `<div class="cfx-modal-in card lesson-card"><div class="cfx-modal-h"><b>📖 ${E(titleCase(l.cf.block.title))} — Full Text</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>${strip()}${fullText(l, d)}</div>`;
  const close = () => { o.remove(); document.removeEventListener("keydown", esc, true); };
  const esc = e => { if(e.key === "Escape"){ e.stopPropagation(); close(); } };
  o.addEventListener("click", e => { if(e.target === o || e.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o);
};
const __card = window.renderLessonCard;
window.renderLessonCard = function(l, i, d, unused, part){
  return (l && l.cf) ? card(l, i, d, part) : __card.apply(this, arguments);
};
/* a Case Flow block is as many slides as it has views */
if(typeof buildDaySlides === "function"){
  const __build = buildDaySlides;
  buildDaySlides = function(d){
    const s = __build.apply(this, arguments);
    if(!cfDay(d && d.id)) return s;
    // the day's lessons are already in the order the course teaches them (CF.sequence): Lesson → its Skill Building →
    // Lesson → its Skill Building → …; each block is one slide per view. The Learning Checks (questions,
    // Self-Summary, Skill Scale) aren't slides: they're on the day's Knowledge Check page.
    const out = [];
    let lab = false, lastAct = -1;   // the module's one Practice Lab slide, just before its first Skill Activity (the base deck's own is dropped)
    s.forEach(sl => {
      if(sl.type === "practiceLab") return;
      if(sl.type !== "topic") return out.push(sl);
      if(!lab && d.lessons[sl.lessonIndex].cf.block.kind === "activity" && sl.part === 1){ lab = true; out.push({type: "practiceLab"}); }
      if(sl.part !== 1 || d.lessons[sl.lessonIndex].cf.block.kind === "check") return;
      viewsOf(d.lessons[sl.lessonIndex].cf.block).forEach((v, j) => out.push({type: "topic", lessonIndex: sl.lessonIndex, part: j + 1}));
      if(d.lessons[sl.lessonIndex].cf.block.kind === "activity") lastAct = out.length;
    });
    // the module's three key concepts, after its last Skill Activity, right before the Knowledge Check
    if(lastAct >= 0 && labQuestions(d).length) out.splice(lastAct, 0, {type: "readyCheck"});
    return out;
  };
}
/* ---------- the 4-hour day: a 15–20 minute discussion for every topic (4 for a condensed overview), the Practice
   (about 10 minutes a Skill Activity, 30 to 60 in all), a 10–15 minute Knowledge Check (longer the more topics the
   day has) and 20 minutes kept free for the welcome, a break and the close; whatever is left is Q&A. build/case-flow/curriculum.cjs checks every day
   fits, with the same numbers. ---------- */
const DAY_MIN = 240, PRACTICE_MIN = 30, PRACTICE_MAX = 60, BRIEF_MIN = 4, BREAK_MIN = 20;   // BREAK_MIN: the welcome (5), a break (10) and the close (5)
function daySchedule(d){
  const kindOf = l => l.cf.block.kind, isFull = l => kindOf(l) === "lesson" && !l.cf.block.brief, isBrief = l => kindOf(l) === "lesson" && !!l.cf.block.brief;
  const n = d.lessons.filter(isFull).length || 1, m = d.lessons.filter(isBrief).length, nActs = d.lessons.filter(l => kindOf(l) === "activity").length;
  const kc = Math.max(10, Math.min(15, Math.round(10 + (n + m / 2 - 8) * 2.5)));
  const practice = Math.max(PRACTICE_MIN, Math.min(PRACTICE_MAX, nActs * 10, DAY_MIN - BREAK_MIN - kc - n * 15 - m * BRIEF_MIN));
  const per = Math.max(15, Math.min(20, Math.floor((DAY_MIN - BREAK_MIN - practice - kc - m * BRIEF_MIN) / n)));
  const phases = d.cf.phases.map(ph => { const ls = d.lessons.filter(l => l.cf.phase === ph); return {ph, topics: ls.filter(isFull).length, briefs: ls.filter(isBrief).length, acts: ls.filter(l => kindOf(l) === "activity").length}; });
  const acts = phases.reduce((a, x) => a + x.acts, 0) || 1;
  let left = practice; phases.forEach((x, i) => { x.practice = i === phases.length - 1 ? left : Math.round(practice * x.acts / acts); left -= x.practice; x.discuss = x.topics * per + x.briefs * BRIEF_MIN; });
  return {per, brief: BRIEF_MIN, kc, practice, phases, buffer: Math.max(0, DAY_MIN - n * per - m * BRIEF_MIN - practice - kc), topics: n + m};
}
/* a trainer's countdown for a topic's discussion (or a phase's practice): tap the chip to start, tap again to stop */
const TIMERS = {};
window.cmCaseFlow = window.cmCaseFlow || {};
window.cmCaseFlow.timer = function(key, min){
  const t = TIMERS[key];
  if(t && t.iv){ clearInterval(t.iv); delete TIMERS[key]; return paintTimers(); }
  TIMERS[key] = {end: Date.now() + min * 60000, min, iv: setInterval(paintTimers, 1000)}; paintTimers();
};
function paintTimers(){
  document.querySelectorAll(".cfx-time[data-k]").forEach(el => {
    const t = TIMERS[el.dataset.k], base = el.dataset.label;
    if(!t){ el.textContent = base; el.classList.remove("on", "over"); return; }
    const ms = t.end - Date.now(), over = ms < 0, a = Math.abs(Math.round(ms / 1000));
    el.textContent = `${over ? "+" : ""}${Math.floor(a / 60)}:${String(a % 60).padStart(2, "0")} ${over ? "over" : "left"}`;
    el.classList.add("on"); el.classList.toggle("over", over);
  });
}
function timeChip(l, d){
  if(!d || !d.cf) return "";
  const sc = daySchedule(d), b = l.cf.block, x = sc.phases.find(p => p.ph === l.cf.phase);
  if(b.kind === "lesson") { const min = b.brief ? sc.brief : sc.per, label = b.brief ? `💬 ${min} min overview` : `💬 ${min} min discussion`; return `<button type="button" class="cfx-time" data-k="t_${b.id}" data-label="${label}" title="This topic's ${b.brief ? "condensed overview" : "discussion"}: ${min} minutes. Tap to start a countdown." onclick="cmCaseFlow.timer('t_${b.id}',${min})">${label}</button>`; }
  const sg = b.kind === "activity" && x && segmentOf(d, l);
  if(sg) { const k = `p_${d.id}_${sg.items[0].cf.block.id}`, label = `🧪 Skill Building · ${sg.mins} min`; return `<button type="button" class="cfx-time" data-k="${k}" data-label="${label}" title="This Skill Building's ${sg.items.length} activit${sg.items.length === 1 ? "y shares" : "ies share"} ${sg.mins} practice minutes. Tap to start a countdown." onclick="cmCaseFlow.timer('${k}',${sg.mins})">${label}</button>`; }
  return "";
}
/* the day's module in its lifecycle: Lesson → Skill Building → Lesson → Skill Building → … → Knowledge Check. A lesson
   segment is a run of lessons under one heading; a Skill Building segment is the run of Skill Activities after it,
   sharing the day's practice minutes by how many activities it has */
function daySegments(d){
  const sc = daySchedule(d), segs = [];
  d.lessons.forEach(l => {
    const b = l.cf.block, last = segs[segs.length - 1];
    if(b.kind === "lesson"){
      const p = last && last.kind === "lesson" && last.title === l.cf.heading ? last : (segs.push({kind: "lesson", title: l.cf.heading, topics: [], full: 0, briefs: 0}), segs[segs.length - 1]);
      p.topics.push(l); b.brief ? p.briefs++ : p.full++;
    } else if(b.kind === "activity"){
      const p = last && last.kind === "practice" ? last : (segs.push({kind: "practice", title: String(l.cf.heading || "Skill Building").replace(/^Skill Building:\s*/, ""), items: []}), segs[segs.length - 1]);
      p.items.push(l);
    }
  });
  const pr = segs.filter(x => x.kind === "practice"), nActs = pr.reduce((a, x) => a + x.items.length, 0) || 1;
  let left = sc.practice;
  segs.forEach(x => { if(x.kind === "lesson") x.mins = x.full * sc.per + x.briefs * sc.brief; });
  pr.forEach((x, i) => { x.mins = i === pr.length - 1 ? left : Math.round(sc.practice * x.items.length / nActs); left -= x.mins; });
  return segs;
}
function lectureParts(d){ return daySegments(d).filter(x => x.kind === "lesson"); }
const segmentOf = (d, l) => daySegments(d).find(x => (x.items || x.topics).includes(l));
function agendaSlide(d){
  const logo = "";
  const src = CF.days.find(x => x.n === d.cf.n) || {};
  const sc = daySchedule(d);
  const row = (n, title, small, mins) => `<li><span class="cfx-ag-n">${String(n).padStart(2, "0")}</span><div><b>${E(title)}</b>
      <small>${small}</small></div><span class="cfx-ag-min">${mins} min</span></li>`;
  const segs = daySegments(d);
  const rows = segs.map((p, i) => p.kind === "lesson"
      ? row(i + 1, p.title, [p.full ? `💬 ${p.full} topic${p.full === 1 ? "" : "s"} × ${sc.per} min discussion` : "", p.briefs ? `💬 ${p.briefs} condensed overview${p.briefs === 1 ? "" : "s"} × ${sc.brief} min` : ""].filter(Boolean).join(" · "), p.mins)
      : row(i + 1, `Skill Building: ${p.title}`, `🧪 ${p.items.length} Skill Activit${p.items.length === 1 ? "y" : "ies"} on John Doe's file`, p.mins)).join("")
    + row(segs.length + 1, "Knowledge Check", `🎯 ${d.quiz.length} questions and your takeaway`, sc.kc);
  return `<div class="card lesson-card cf-card cfx cfx-deck cfx-agenda">
      <div class="cfx-deck-head">${logo}<h2 class="cfx-deck-title">Case Management Training</h2></div>
      <div class="cfx-ribbon"><span>Day ${d.cf.n} · Training Agenda</span></div>
      <div class="cfx-top"><span class="cfx-title cfx-pill"><span class="cfx-vi">📅</span>Training Agenda</span></div>
      <div class="cfx-body cfx-body-navy"><div class="cfx-ag${segs.length + 1 > 7 ? " cfx-ag-long" : ""}"><ol class="cfx-ag-list" style="--ag-rows:${Math.ceil((segs.length + 1) / 2)}">${rows}</ol>
        <div class="cfx-ag-side"><p class="cfx-ag-day">${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</p><p>${E(src.objective || "")}</p></div></div></div>
    </div>`;
}
/* ---------- the Training Agenda's speaker notes ----------
   What the trainer says over each day's agenda slide, in the voice of the slide scripts (build/case-flow/scripts/
   SCRIPTSPEC.md: first person to the room, John Doe's file, no lists). The welcome and the question are written for
   each day; the run of the day is read from the slide itself (its parts, minutes, activities and questions), so the
   notes and the slide can never disagree. Shown in Presenter view, on Admin → Trainer Cues and in the Speaker Notes PDF. */
const AGENDA_NOTES = {
  1: {open: "Welcome, everyone, and thanks for being here on time. For the next five days you're the Case Manager on one file, John Doe v. Robert Smith, Atty. Elijah Thorne's case, and everything we do this week happens on that file. Right now it's a raw file: nothing is in the CMS yet, John Doe hasn't started treatment, and there's a damaged car on it that nobody has sorted out.",
      ask: "Before we start, who has worked on a personal injury file before, and which part of it did you handle?"},
  2: {open: "Morning, everyone. Yesterday we opened John Doe's matter in the CMS, ran the Conflict Check and got the Property Damage side moving. Today the three claims are reported by phone, but nothing is confirmed in writing yet, and John Doe is about to start treatment. So today is about setting the claims up properly and then carrying him through treatment without losing him.",
      ask: "Think about the file as we left it yesterday: what's the one thing on it you'd want confirmed in writing before anything else today?"},
  3: {open: "Welcome back. John Doe has finished treatment and reached MMI, the Specials stand at $16,401.40, and there's a 14-day gap on the file that we still have to explain from his own documented facts. Today we audit the file, brief Atty. Thorne, serve a demand that holds up and negotiate it.",
      ask: "Before the demand goes out, what on John Doe's file would an adjuster use against us first?"},
  4: {open: "Morning, everyone. On Track A the file settles at $40,000 gross. Today we finish that settlement properly: the release, the liens, the provider balances and a net to John Doe that reconciles to the cent. Then we go back and follow the same file down Track B, where it doesn't settle, into mediation and arbitration and the binders that go with them.",
      ask: "Once the $40,000 comes in, whose money is it, and who has to be paid before John Doe sees a dollar?"},
  5: {open: "Welcome to our last day. On Track B the carrier let the demand lapse, so today John Doe's file goes into litigation: the impasse, the complaint, discovery, his deposition and, at the end, the award and the Litigation Net Sheet. We'll also close out a separate matter that's being dropped, and do it the right way.",
      ask: "When a file goes into suit, what changes in your day as the Case Manager, and what stays exactly the same?"}
};
function agendaNotes(d){
  const n = d.cf.n, w = AGENDA_NOTES[n] || {}, sc = daySchedule(d), segs = daySegments(d), parts = segs.filter(x => x.kind === "lesson");
  const acts = d.lessons.filter(l => l.cf.block.kind === "activity").length, q = (d.quiz || []).length, next = cfDayByN(n + 1);
  const topics = parts.map(p => p.title);
  const say = [w.open || `Welcome, everyone. Let's pick John Doe's file up where we left it.`,
    `Here's how today runs, and it's all on the slide. Each topic is a short lesson and then straight into Skill Building on it: ${andList(topics)}.`
      + (segs.length > 2 && sc.buffer >= 10 ? " We'll take a ten-minute break about halfway through." : ""),
    `That's ${acts} Skill Activit${acts === 1 ? "y" : "ies"} on John Doe's file in all, about ${sc.practice} minutes, worked in the CMS and the tools, not on paper, each one right after the lesson it practises.`,
    `We finish with the Knowledge Check, ${q} question${q === 1 ? "" : "s"} in about ${sc.kc} minutes, and you need 70% ${next || n < 5 ? `to open Day ${n + 1}` : "to finish the Case Flow"}.`,
    `By the end of today you'll ${firstAim(d)}.`].join(" ");
  return {say, ask: w.ask || ""};
}

/* ---------- the live call: the course's own roleplay engine, on John Doe v. Robert Smith ---------- */
function caseDossier(){
  const c = CF.case;
  return [`CASE: ${c.style} (${c.no}) — ${c.type}. Lead Counsel: ${c.counsel}. The Case Manager is the trainee.`,
    `Client: ${c.client.name}, ${c.client.position}. Date of loss ${c.dol}; SOL ${c.sol}.`,
    `Coverage, in order: ${stackLayers().map(l => `${l.tag} ${money(l.limit)} (${l.carrier}${l.adjuster ? ", adjuster " + l.adjuster : ""})`).join(" → ")} = ${money(c.total)}.`,
    `Health Plan: ${c.health.carrier}. Critical fact: ${c.critical}`,
    ...(CF.profile || []).flatMap(sec => [`${sec.title}:`, ...sec.items.map(x => `- ${x}`)])].join("\n");
}
window.cmCaseFlow = window.cmCaseFlow || {};
window.cmCaseFlow.call = function(blockId){
  const c = SIM.calls[blockId], at = MODULES.flatMap(d => d.lessons.map((l, i) => ({d, l, i}))).find(x => x.l.cf.block.id === blockId);
  if(!c || !at || typeof goto !== "function" || typeof ROLEPLAY_MODES === "undefined") return;
  const back = {dayId: at.d.id, slide: typeof state.lessonSlide === "number" ? state.lessonSlide : null, blockId};
  const ev = SIM.events[blockId] || {};
  state.rpSession = {
    category: {id: "caseflow", icon: "📞", label: `Case Flow Day ${at.d.cf.n}`},
    topic: {id: "cf-" + blockId, label: `${c.who}: ${at.l.cf.block.title}`, fixedOpening: c.opening,
      context: `${ev.date ? "Date on the file: " + ev.date + ". " : ""}${c.context}\nThe Case Manager must: ${c.goals.join("; ")}.\nUPL line on this call: ${c.line}`},
    mode: ROLEPLAY_MODES.find(m => m.id === "guided") || ROLEPLAY_MODES[0],
    persona: {id: "cf-" + c.role, label: c.who, desc: c.persona},
    chatHistory: [], startedAt: Date.now(), part: 1, rapidTasks: [], rapidIndex: 0, rapidResponses: [],
    cf: back
  };
  goto("openroleplay");
  if(typeof rpGenerateOpening === "function") rpGenerateOpening();
};
window.cmCaseFlow.callBack = function(){
  const s = state.rpSession, cf = s && s.cf;
  if(cf && (s.chatHistory || []).some(m => m.role === "ea")){ REC.calls = REC.calls || {}; REC.calls[cf.blockId] = {at: new Date().toISOString(), lines: s.chatHistory.length}; persist(); }
  try{ if(typeof VoiceCall !== "undefined") VoiceCall.hangup(true); }catch(e){}
  state.rpSession = null;
  if(!cf){ goto("dashboard"); return; }
  goto("day", cf.dayId);
  setTimeout(() => { state.dayViewMode = "slides"; if(typeof goToSlide === "function" && cf.slide != null) goToSlide(cf.slide); }, 0);
};
/* ---------- a voicemail is heard, not read ----------
   A voicemail event (build/case-flow/sim: "spoken" and "listen") plays like a voicemail box: the system voice with
   the time and the caller ID, the beep, then the caller in their own voice over a faint line hiss. The slide shows
   only what a phone shows (caller ID, time, length); the trainee takes notes in the Listening Check, checks them
   against what was said, and only then sees the transcript. Plays and the check are kept on their record
   (REC.listen) and shown to their trainer. A browser that can't speak (no speech engine, or no English voice
   installed) gets the steps to turn it on for that device, and the transcript stays closed until they've listened. */
const VM = {playing: null, ctx: null, hiss: null};
const vmWords = t => String(t || "").split(/\s+/).filter(Boolean).length;
const vmLength = e => { const s = Math.round(vmWords(e.spoken) / 2.3 + 6); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const vmRec = id => { REC.listen = REC.listen || {}; return (REC.listen[id] = REC.listen[id] || {plays: 0, answers: []}); };
const canSpeak = () => typeof speechSynthesis !== "undefined" && typeof SpeechSynthesisUtterance !== "undefined";
function vmVoice(kind){
  const vs = (canSpeak() ? speechSynthesis.getVoices() : []).filter(v => /^en[-_]/i.test(v.lang));
  const male = /\b(male|david|daniel|alex|fred|guy|george|mark|james|tom|aaron|arthur|ryan|christopher|eric|roger)\b/i, female = /\b(female|samantha|zira|susan|victoria|karen|moira|tessa|aria|jenny|libby|sonia|serena|allison|ava)\b/i;
  const want = kind === "caller" ? vs.filter(v => male.test(v.name) && !female.test(v.name)) : vs.filter(v => female.test(v.name));
  return want[0] || vs[kind === "caller" ? Math.min(1, vs.length - 1) : 0] || null;
}
// "02/10/2026" + "8:47 a.m." → "Tuesday, February 10th, at 8:47 a.m."
function vmWhen(e){
  const [m, d, y] = String(e.date || "").split("/").map(Number);
  if(!y) return "";
  const t = new Date(Date.UTC(y, m - 1, d)), f = o => t.toLocaleDateString("en-US", Object.assign({timeZone: "UTC"}, o));
  const sfx = (d % 100 >= 11 && d % 100 <= 13) ? "th" : ({1: "st", 2: "nd", 3: "rd"}[d % 10] || "th");
  return `${f({weekday: "long"})}, ${f({month: "long"})} ${d}${sfx}${e.time ? ", at " + e.time : ""}`;
}
const vmDigits = t => (String(t).match(/\(?\d{3}\)?[\s-]*\d{3}-\d{4}/) || [""])[0].replace(/\D/g, "").split("").map(n => n === "0" ? "oh" : n).join(" ").replace(/^(\S+ \S+ \S+) (\S+ \S+ \S+) /, "$1, $2, ");
function vmTone(ctx, at, f, dur, gain){ const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; g.gain.value = gain; o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + at); o.stop(ctx.currentTime + at + dur); }
function vmHiss(on){
  try{
    if(on){
      const Ctx = window.AudioContext || window.webkitAudioContext; if(!Ctx) return;
      const ctx = VM.ctx || (VM.ctx = new Ctx()), buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), ch = buf.getChannelData(0);
      for(let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf; src.loop = true; bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.6; g.gain.value = 0.018;
      src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(); VM.hiss = src;
    }else if(VM.hiss){ VM.hiss.stop(); VM.hiss = null; }
  }catch(e){}
}
function vmSay(text, kind, token){
  return new Promise(res => {
    if(VM.playing !== token) return res();
    const u = new SpeechSynthesisUtterance(text), v = vmVoice(kind);
    if(v) u.voice = v;
    u.rate = kind === "caller" ? 0.92 : 1; u.pitch = kind === "caller" ? 0.85 : 1.08; u.volume = 1;
    let done = false; const end = () => { if(!done){ done = true; res(); } };
    u.onend = end; u.onerror = end;
    setTimeout(end, Math.max(4000, vmWords(text) * 650));   // never hang if a browser drops the event
    speechSynthesis.speak(u);
  });
}
const vmPause = ms => new Promise(r => setTimeout(r, ms));
function vmPaint(blockId){
  document.querySelectorAll(`[data-vm="${blockId}"]`).forEach(el => {
    const r = vmRec(blockId), on = VM.playing && VM.playing.id === blockId;
    el.querySelectorAll(".cfx-vm-play").forEach(b => { b.textContent = on ? "⏹ Stop" : r.plays ? "↻ Play again" : "▶ Play"; b.setAttribute("aria-pressed", on ? "true" : "false"); });
    el.querySelectorAll(".cfx-vm-st").forEach(x => { x.textContent = on ? "🔊 Playing…" : vmStatus(blockId); });
    el.classList.toggle("on", !!on);
  });
}
function vmStatus(blockId){
  const r = vmRec(blockId), e = SIM.events[blockId];
  if(r.at) return `Listening Check ${r.score}/${(e.listen || []).length} · played ${r.plays}×`;
  return r.plays ? `Played ${r.plays}× · now check your notes` : "Not played yet";
}
window.cmCaseFlow.vmPlay = async function(blockId){
  const e = SIM.events[blockId];
  if(!e || !e.spoken) return;
  if(VM.playing){ const was = VM.playing.id; VM.playing = null; try{ speechSynthesis.cancel(); }catch(er){} vmHiss(false); vmPaint(was); if(was === blockId) return; }
  if(!(await vmVoicesReady())){ vmSetup(blockId); return; }
  const token = {id: blockId}; VM.playing = token;
  const r = vmRec(blockId); r.plays = (r.plays || 0) + 1; persist();
  vmPaint(blockId);
  try{ speechSynthesis.cancel(); }catch(er){}
  const Ctx = window.AudioContext || window.webkitAudioContext;
  try{ if(Ctx){ VM.ctx = VM.ctx || new Ctx(); if(VM.ctx.state === "suspended") await VM.ctx.resume(); } }catch(er){}
  const when = vmWhen(e);
  await vmSay(`You have one new message. Received ${when}${/\.$/.test(when) ? "" : "."} From ${vmDigits(e.from)}.`, "system", token);
  if(VM.playing === token){ try{ VM.ctx && vmTone(VM.ctx, 0.15, 1000, 0.45, 0.08); }catch(er){} await vmPause(900); }
  if(VM.playing === token) vmHiss(true);
  // the caller, sentence by sentence, with the small gaps people leave
  for(const part of String(e.spoken).split(/(?<=[.?!])\s+/)){
    if(VM.playing !== token) break;
    await vmSay(part.replace(/\.\.\./g, ","), "caller", token);
    await vmPause(/\.\.\.$|,$/.test(part) ? 500 : 260);
  }
  vmHiss(false);
  if(VM.playing === token) await vmSay("End of message.", "system", token);
  if(VM.playing === token){ VM.playing = null; vmPaint(blockId); }
};
/* speech in this browser: an engine and at least one English voice (Chrome loads its voices a moment after the page) */
function vmVoicesReady(){
  if(!canSpeak()) return Promise.resolve(false);
  const has = () => speechSynthesis.getVoices().some(v => /^en[-_]/i.test(v.lang));
  if(has()) return Promise.resolve(true);
  return new Promise(res => {
    let done = false; const end = v => { if(!done){ done = true; res(v); } };
    try{ speechSynthesis.addEventListener("voiceschanged", () => end(has()), {once: true}); }catch(e){}
    setTimeout(() => end(has()), 1500);
  });
}
/* the steps to turn speech on, for the device the trainee is on */
function vmDevice(){
  const ua = navigator.userAgent || "", p = (navigator.userAgentData && navigator.userAgentData.platform) || navigator.platform || "";
  const os = /iPhone|iPad|iPod/.test(ua) ? "ios" : /Android/.test(ua) ? "android" : /CrOS/.test(ua) ? "chromeos" : /Mac/.test(p + ua) ? "mac" : /Win/.test(p + ua) ? "windows" : /Linux/.test(p + ua) ? "linux" : "other";
  const browser = /Edg\//.test(ua) ? "Edge" : /Firefox\//.test(ua) ? "Firefox" : /Chrome\//.test(ua) ? "Chrome" : /Safari\//.test(ua) ? "Safari" : "this browser";
  return {os, browser};
}
const VM_STEPS = {
  windows: ["Open <b>Settings → Time &amp; language → Speech</b>.", "Under <b>Manage voices</b>, choose <b>Add voices</b> and add an <b>English</b> voice.", "Close every browser window and open the course again."],
  mac: ["Open <b>System Settings → Accessibility → Spoken Content</b>.", "Next to <b>System voice</b>, choose <b>Manage Voices…</b> and download an <b>English</b> voice.", "Quit the browser (⌘Q) and open the course again."],
  chromeos: ["Open <b>Settings → Accessibility → Text-to-Speech</b>.", "Under <b>Speech engine</b>, install an <b>English</b> voice (Google voices).", "Close the browser and open the course again."],
  linux: ["Install the speech engine: <code>sudo apt install speech-dispatcher espeak-ng</code> (or your system's package manager).", "Restart the computer, or log out and back in.", "Open the course in <b>Chrome</b> or <b>Edge</b>."],
  ios: ["Open <b>Settings → Accessibility → Spoken Content → Voices → English</b> and download a voice.", "Turn off <b>Silent mode</b> and turn the volume up.", "Open the course again in Safari."],
  android: ["Open <b>Settings → Accessibility → Text-to-speech output</b>.", "Choose <b>Speech Services by Google</b> and install the <b>English</b> voice data.", "Open the course again in Chrome."],
  other: ["Open the course in <b>Google Chrome</b> or <b>Microsoft Edge</b> on a computer.", "Install an <b>English</b> text-to-speech voice in your computer's settings.", "Close the browser and open the course again."],
};
function vmSetup(blockId){
  const {os, browser} = vmDevice(), engine = canSpeak();
  let box = document.getElementById("cf-vm");
  if(!box){ box = document.createElement("div"); box.id = "cf-vm"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); document.body.appendChild(box);
    document.addEventListener("keydown", ev => { if(ev.key === "Escape" && !box.hidden) cmCaseFlow.listenClose(); }); }
  box.setAttribute("aria-label", "Turn on speech to hear the voicemail");
  box.innerHTML = `<div class="cf-vm-card cf-vm-setup">
      <div class="cf-vm-h"><div><b>🔈 Turn on speech to hear this voicemail</b><span>${engine ? `${E(browser)} has no English voice installed on this device.` : `${E(browser)} can't speak on this device.`} This step is a listening test, so the message has to be heard.</span></div>
        <button type="button" class="cf-vm-x" onclick="cmCaseFlow.listenClose()" aria-label="Close">✕</button></div>
      <ol class="cf-vm-steps">${(VM_STEPS[os] || VM_STEPS.other).map(x => `<li>${x}</li>`).join("")}</ol>
      <p class="cf-vm-lead">Also check that your computer isn't muted and that this site may play sound (the 🔒 beside the address → <b>Site settings → Sound: Allow</b>). Headphones are best.${browser === "Firefox" || browser === "Safari" ? ` <b>Chrome</b> or <b>Edge</b> has the clearest voices.` : ""}</p>
      <div class="cfx-vm-row"><button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.vmRetry('${blockId}')">↻ I've done this: try again</button>
        <span class="cfx-vm-st" id="cf-vm-retry"></span></div>
      <p class="cf-note">Still silent after these steps? Ask your trainer: they can check your device with you.</p>
    </div>`;
  const tb = document.querySelector(".topbar"); document.body.style.setProperty("--cf-topbar", tb ? Math.max(0, Math.round(tb.getBoundingClientRect().bottom)) + "px" : "0px");
  box.hidden = false;
}
window.cmCaseFlow.vmRetry = async function(blockId){
  const st = document.getElementById("cf-vm-retry"); if(st) st.textContent = "Checking…";
  if(await vmVoicesReady()){ cmCaseFlow.listenClose(); cmCaseFlow.vmPlay(blockId); return; }
  if(st) st.textContent = "Still no voice on this device. Finish the steps above (a restart of the browser is usually needed).";
};
function voicemailCard(e, blockId, extra){
  return `<div class="cfx-ev cfx-ev-voicemail cfx-vm${extra ? " " + extra : ""}" data-vm="${blockId}">
      <div class="cfx-ev-h"><span class="cfx-ev-i">📳</span><span class="cfx-ev-ch">Voicemail</span><span class="cfx-ev-from">${E(e.from || "")}</span>
        <span class="cfx-ev-when">${E(e.date || "")}${e.time ? " · " + E(e.time) : ""}</span></div>
      <div class="cfx-vm-body"><span class="cfx-vm-wave" aria-hidden="true">${"<i></i>".repeat(18)}</span>
        <div><b>1 new message</b> · ${vmLength(e)}<br><small>${notesOf(blockId) ? "Listen, then transcribe it in your Notes &amp; Action Plan." : "Listen first: the transcript opens after your Listening Check."}</small></div></div>
      <div class="cfx-vm-row"><button type="button" class="btn btn-orange btn-sm cfx-vm-play" onclick="cmCaseFlow.vmPlay('${blockId}')">${vmRec(blockId).plays ? "↻ Play again" : "▶ Play"}</button>
        ${notesOf(blockId) ? `<button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.notes('${blockId}')">📝 Transcribe</button>` : `<button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.listen('${blockId}')">🎧 Listening Check</button>`}
        <span class="cfx-vm-st">${E(vmStatus(blockId))}</span></div>
    </div>`;
}
/* the Listening Check: notes from the message, checked against what was said, then the transcript */
window.cmCaseFlow.listen = function(blockId, reveal){
  const e = SIM.events[blockId]; if(!e || !e.listen) return;
  const r = vmRec(blockId), checked = !!r.at, show = checked || (reveal && isTrainer());
  let box = document.getElementById("cf-vm");
  if(!box){ box = document.createElement("div"); box.id = "cf-vm"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Listening Check"); document.body.appendChild(box);
    document.addEventListener("keydown", ev => { if(ev.key === "Escape" && !box.hidden) cmCaseFlow.listenClose(); }); }
  box.innerHTML = `<div class="cf-vm-card" data-vm="${blockId}">
      <div class="cf-vm-h"><div><b>🎧 Listening Check</b><span>Voicemail from ${E(e.from)} · ${E(e.date)}${e.time ? " · " + E(e.time) : ""}</span></div>
        <button type="button" class="cf-vm-x" onclick="cmCaseFlow.listenClose()" aria-label="Close">✕</button></div>
      <div class="cfx-vm-row"><button type="button" class="btn btn-orange btn-sm cfx-vm-play" onclick="cmCaseFlow.vmPlay('${blockId}')">${r.plays ? "↻ Play again" : "▶ Play"}</button><span class="cfx-vm-st">${E(vmStatus(blockId))}</span></div>
      <p class="cf-vm-lead">Take the message down the way you would at your desk: from what you heard, not the caller ID.</p>
      <ol class="cf-vm-qs">${e.listen.map((x, j) => `<li><label for="cfvm_${blockId}_${j}">${E(x.q)}</label>
        <textarea id="cfvm_${blockId}_${j}" rows="2" oninput="cmCaseFlow.listenDraft('${blockId}',${j},this.value)" ${checked ? "readonly" : ""}>${E((r.answers || [])[j] || "")}</textarea>
        ${checked ? `<div class="cf-vm-res ${r.got[j] ? "ok" : "miss"}">${r.got[j] ? "✓ Caught" : "✗ Missed"} · <span>The message: ${E(x.a)}</span></div>` : ""}</li>`).join("")}</ol>
      ${checked ? `<div class="cf-vm-score">You caught <b>${r.score} of ${e.listen.length}</b>${r.score < e.listen.length ? ". Play it again for what you missed before you call back." : ". Now call him back."}</div>` : `<button type="button" class="btn btn-navy" onclick="cmCaseFlow.listenCheck('${blockId}')">Check my notes</button>`}
      ${show ? `<details class="cf-vm-tx" ${checked ? "" : "open"}><summary>📝 Transcript</summary><p>${E(e.spoken)}</p></details>` : ""}
    </div>`;
  // never over the top bar: the check opens under it
  const tb = document.querySelector(".topbar"); document.body.style.setProperty("--cf-topbar", tb ? Math.max(0, Math.round(tb.getBoundingClientRect().bottom)) + "px" : "0px");
  box.hidden = false;
};
window.cmCaseFlow.listenDraft = function(blockId, j, v){ const r = vmRec(blockId); if(r.at) return; r.answers[j] = String(v).slice(0, 400); clearTimeout(VM.t); VM.t = setTimeout(persist, 600); };
window.cmCaseFlow.listenCheck = function(blockId){
  const e = SIM.events[blockId], r = vmRec(blockId);
  e.listen.forEach((x, j) => { const el = document.getElementById(`cfvm_${blockId}_${j}`); if(el) r.answers[j] = el.value.trim().slice(0, 400); });
  if(!r.plays){ if(typeof toast === "function") toast("Play the voicemail first: this check is on what you hear."); return; }
  if(!r.answers.some(Boolean)){ if(typeof toast === "function") toast("Write down what you heard first."); return; }
  r.got = e.listen.map((x, j) => x.match.every(m => { try{ return new RegExp(m, "i").test(r.answers[j] || ""); }catch(er){ return false; } }));
  r.score = r.got.filter(Boolean).length; r.at = new Date().toISOString();
  persist(); cmCaseFlow.listen(blockId); vmPaint(blockId);
};
window.cmCaseFlow.listenClose = function(){ const box = document.getElementById("cf-vm"); if(box) box.hidden = true; };
/* ---------- opening a step's tool ---------- */
/* ---------- the exhibit audit, the completed package, and the service confirmation ----------
   A Skill Activity that assembles or serves a document set gets the set itself (build/case-flow/exhibits:
   "audits"), as a packet the trainee works item by item — keep it, replace it, pull it, add what is missing,
   or flag it for the attorney — with the loophole or evidentiary gap each item hides. Handed in, the finished
   set is revealed: the Demand Package as served, the Mediation Binder as delivered, the Arbitration Binder as
   exchanged, which every later activity then works from (CM_CF_DOC_PACKETS carries it forward).
   An activity that serves something also gets the Service Confirmation ("emails"): the trainee writes the
   email that serves the demand on the adjuster, the adjuster acknowledges receipt in writing, the trainee
   answers the follow-up that tests the UPL line, and then converts the whole exchange into a memorandum, files
   it in the CMS under the firm's naming convention, which keeps it on their Backup Drive in its folder too. Their marks, their email, the
   choice they made and what they filed are kept on their record and shown to their trainer. */
const EX = Object.assign({audits: {}, emails: {}, amendments: {}, notes: {}}, window.CM_CF_EXHIBITS || {});
const VERDICT = {
  keep: {label: "Keep as is", icon: "✓", hint: "The copy is fit to use and belongs in the set."},
  replace: {label: "Replace it", icon: "↻", hint: "It belongs in the set, but not this copy or not this figure."},
  pull: {label: "Pull it", icon: "✕", hint: "It does not belong in a set that leaves this office."},
  add: {label: "Add what is missing", icon: "＋", hint: "The set needs something it does not have."},
  flag: {label: "Flag for Atty. Thorne", icon: "⚖", hint: "It stays, and the decision is the attorney's, not yours."}
};
const VORDER = ["keep", "replace", "pull", "add", "flag"];
const EKIND = {loophole: "Loophole", gap: "Evidentiary gap", privilege: "Privileged — ours, not theirs",
  qc: "Copy not fit to use", arithmetic: "Figure that doesn't tie", calendar: "Date counted from the wrong event"};
const auditOf = id => EX.audits[id] || null;
const serviceOf = id => EX.emails[id] || null;
function exRec(blockId){ REC.audits = REC.audits || {}; return (REC.audits[blockId] = REC.audits[blockId] || {marks: [], notes: [], at: null}); }
function svRec(blockId){ REC.service = REC.service || {}; return (REC.service[blockId] = REC.service[blockId] || {sent: null, body: "", tries: 0, choice: null, converted: null, filed: null, drive: null}); }
const exScore = (a, r) => a.items.reduce((n, it, i) => n + (r.marks[i] === it.verdict ? 1 : 0), 0);
const exMarked = r => (r.marks || []).filter(Boolean).length;
const exDoc = id => CF_DOCS.find(d => d.id === id);
const exDocLink = id => { const d = exDoc(id); return d ? `<a href="${E(docUrl(d))}" target="_blank" rel="noopener" title="${E(d.desc)}" onclick="return cmCaseFlow.doc(event,'${E(id)}')">${E(d.title)}</a>` : E(id); };

/* the slide: where the audit stands, and — once it is handed in — the completed package */
function auditSlide(b){
  const a = auditOf(b.id); if(!a) return "";
  const r = exRec(b.id), done = !!r.at, n = a.items.length, sc = done ? exScore(a, r) : 0, sv = serviceOf(b.id);
  const src = exDoc(a.source), rev = exDoc(a.reveal);
  const head = `<div class="cfx-aud-h"><span class="cfx-chip">📁 ${E(a.title)}</span>
      <span class="cfx-aud-due">Out the door by <b>${E(a.due)}</b></span></div>
    <p class="cfx-aud-intro">${hl(a.intro)}</p>`;
  if(!done) return `<div class="cfx-aud">${head}
    <div class="cfx-aud-row">
      <div class="cfx-aud-card"><b>The set you are auditing</b><span>${src ? exDocLink(a.source) : E(a.source)}</span>
        <small>${n} items to call: ${VORDER.map(v => VERDICT[v].label.toLowerCase()).join(", ")}.</small></div>
      <div class="cfx-aud-card"><b>Where you are</b><span class="cfx-aud-prog">${exMarked(r)} of ${n} called</span>
        <small>Nothing is scored until you hand it in, and nothing is corrected quietly: every finding is a dated, assigned task.</small></div>
    </div>
    <div class="cfx-aud-act"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.audit('${b.id}')">🔍 Open the audit workbench</button>
      ${sv ? `<button type="button" class="btn btn-navy" onclick="cmCaseFlow.service('${b.id}')">✉ Service Confirmation</button>` : ""}
      <span class="cfx-aud-note">${E(a.kicker)}</span></div></div>`;
  return `<div class="cfx-aud cfx-aud-done">${head}
    <div class="cfx-aud-row">
      <div class="cfx-aud-card cfx-aud-score"><b>Your audit</b><span>${sc} of ${n} called correctly</span>
        <small>Handed in ${E(new Date(r.at).toLocaleDateString())}. Your trainer sees every call and every note you wrote.</small></div>
      <div class="cfx-aud-card cfx-aud-rev"><b>📦 The completed package</b><span>${rev ? exDocLink(a.reveal) : E(a.reveal)}</span>
        <small>${hl(a.revealNote)}</small></div>
    </div>
    <ul class="cfx-aud-points">${a.revealPoints.map(p => `<li>${hl(p)}</li>`).join("")}</ul>
    <div class="cfx-aud-act"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.audit('${b.id}')">🔍 Compare your audit, item by item</button>
      ${sv ? `<button type="button" class="btn btn-navy" onclick="cmCaseFlow.service('${b.id}')">✉ Service Confirmation</button>` : ""}</div></div>`;
}

/* the workbench: every item of the set, the call the trainee makes, and after hand-in what the file says */
function auditBench(blockId){
  const a = auditOf(blockId), r = exRec(blockId), done = !!r.at;
  const rows = a.items.map((it, i) => {
    const mine = r.marks[i] || "", right = done && mine === it.verdict;
    return `<tr class="${done ? (right ? "ok" : "no") : ""}">
      <td class="ab-ref">${E(it.ref)}</td>
      <td><b>${E(it.what)}</b><br><span class="ab-as">${E(it.as)}</span></td>
      <td class="ab-call">${done ? `<span class="ab-v ab-v-${E(mine || "none")}">${mine ? VERDICT[mine].icon + " " + E(VERDICT[mine].label) : "— not called"}</span>
            ${right ? `<span class="ab-ok">✓</span>` : `<br><span class="ab-right">${VERDICT[it.verdict].icon} ${E(VERDICT[it.verdict].label)}</span>`}`
        : `<select class="ab-sel" aria-label="Your call on ${E(it.what)}" onchange="cmCaseFlow.auditMark('${blockId}',${i},this.value)">
            <option value="">Your call…</option>${VORDER.map(v => `<option value="${v}"${mine === v ? " selected" : ""}>${VERDICT[v].icon} ${E(VERDICT[v].label)}</option>`).join("")}</select>`}</td>
      <td>${done ? `<span class="ab-kind">${E(EKIND[it.kind])}</span><br>${hl(it.issue)}<br><b>Fix:</b> ${hl(it.fix)}<br><small>${it.proof.map(exDocLink).join(" · ")}</small>`
        : `<textarea class="ab-note" rows="2" placeholder="What is wrong with it, or what is missing — and who fixes it" aria-label="Your note on ${E(it.what)}" oninput="cmCaseFlow.auditNote('${blockId}',${i},this.value)">${E(r.notes[i] || "")}</textarea>`}</td>
    </tr>`;
  }).join("");
  const n = a.items.length;
  return `<div class="cfx-modal-in card lesson-card cfx-bench"><div class="cfx-modal-h"><b>🔍 ${E(a.title)}</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <div class="ab-top"><span>${E(a.kicker)}</span>${exDoc(a.source) ? `<span>Open the set beside this: ${exDocLink(a.source)}</span>` : ""}
      ${done ? `<span class="ab-sc">${exScore(a, r)} of ${n} correct</span>` : `<span class="ab-sc" id="absc_${E(blockId)}">${exMarked(r)} of ${n} called</span>`}</div>
    <div class="ab-key">${VORDER.map(v => `<span><b>${VERDICT[v].icon} ${E(VERDICT[v].label)}</b> ${E(VERDICT[v].hint)}</span>`).join("")}</div>
    <table class="ab-table"><thead><tr><th>${E(a.columns.ref)}</th><th>What it is${done ? "" : " · as drafted"}</th><th>Your call${done ? " · the file's" : ""}</th><th>${done ? "What it would have cost, and the fix" : "Your note"}</th></tr></thead><tbody>${rows}</tbody></table>
    ${done ? `<div class="ab-rev"><b>📦 ${E(a.revealNote)}</b><ul>${a.revealPoints.map(p => `<li>${hl(p)}</li>`).join("")}</ul>
        <p>The completed set: ${exDoc(a.reveal) ? exDocLink(a.reveal) : E(a.reveal)}</p></div>`
      : `<div class="ab-foot"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.auditHandIn('${blockId}')">Hand in the audit</button>
        <span>Call every item first. Once it is handed in you see what the file says about each one, and the completed package.</span></div>`}</div>`;
}
/* ---------- every pop-up moves: drag it by its title bar ----------
   The Full text, the exhibit audits and the Service Confirmation open over the slide. Dragged aside, the dimming lifts
   and the slide and the documents behind it can be used while the pop-up stays open. The offset lives on the outer
   layer (--cfx-dx / --cfx-dy), so a pop-up that repaints its panel stays where it was put. */
document.addEventListener("pointerdown", e => {
  const h = e.target.closest && e.target.closest(".cfx-modal-h");
  if(!h || e.button !== 0 || e.target.closest("button, a, input, select, textarea")) return;
  const o = h.closest(".cfx-modal"), inner = h.closest(".cfx-modal-in"); if(!o || !inner) return;
  e.preventDefault();
  if(!o.classList.contains("cfx-modal-moved")){ const st = o.scrollTop; o.classList.add("cfx-modal-moved"); inner.scrollTop = st; }
  const px = v => parseFloat(o.style.getPropertyValue(v)) || 0, dx0 = px("--cfx-dx"), dy0 = px("--cfx-dy");
  const r = inner.getBoundingClientRect(), left0 = r.left - dx0, top0 = r.top - dy0, x0 = e.clientX, y0 = e.clientY;
  const move = ev => {   // the title bar never leaves the screen
    const left = Math.min(Math.max(left0 + dx0 + ev.clientX - x0, 120 - r.width), innerWidth - 120);
    const top = Math.min(Math.max(top0 + dy0 + ev.clientY - y0, 0), innerHeight - 48);
    o.style.setProperty("--cfx-dx", (left - left0) + "px"); o.style.setProperty("--cfx-dy", (top - top0) + "px");
    o.style.setProperty("--cfx-mh", Math.max(160, innerHeight - top - 12) + "px");   // the panel ends on the screen, scrolling inside
  };
  const up = () => { removeEventListener("pointermove", move); removeEventListener("pointerup", up); removeEventListener("pointercancel", up); };
  addEventListener("pointermove", move); addEventListener("pointerup", up); addEventListener("pointercancel", up);
});
window.cmCaseFlow.audit = function(blockId){
  if(!auditOf(blockId) || document.getElementById("cf-bench")) return;   // one workbench at a time
  const o = document.createElement("div"); o.className = "cfx-modal"; o.id = "cf-bench"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Exhibit audit");
  o.innerHTML = auditBench(blockId);
  const close = () => { o.remove(); document.removeEventListener("keydown", esc, true); if(typeof render === "function") render(); };
  const esc = e => { if(e.key === "Escape"){ e.stopPropagation(); close(); } };
  o.addEventListener("click", e => { if(e.target === o || e.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o);
};
function benchRepaint(blockId){
  const o = document.getElementById("cf-bench"); if(!o) return;
  repaintModal(o, auditBench(blockId));
}
// a pop-up's panel repainted where it is: a moved pop-up scrolls its own panel, so that scroll is kept too
function repaintModal(o, html){
  const inner = o.querySelector(".cfx-modal-in"), st = inner ? inner.scrollTop : 0;
  o.innerHTML = html;
  const next = o.querySelector(".cfx-modal-in"); if(next && st) next.scrollTop = st;
}
let exT = null;
window.cmCaseFlow.auditMark = function(blockId, i, v){
  const a = auditOf(blockId), r = exRec(blockId); if(!a || r.at) return;
  r.marks[i] = VORDER.includes(v) ? v : "";
  const sc = document.getElementById("absc_" + blockId);
  if(sc) sc.textContent = `${exMarked(r)} of ${a.items.length} called`;
  clearTimeout(exT); exT = setTimeout(persist, 600);
};
window.cmCaseFlow.auditNote = function(blockId, i, v){
  const r = exRec(blockId); if(r.at) return;
  r.notes[i] = String(v).slice(0, 600);
  clearTimeout(exT); exT = setTimeout(persist, 800);
};
window.cmCaseFlow.auditHandIn = function(blockId){
  const a = auditOf(blockId), r = exRec(blockId); if(!a || r.at) return;
  const left = a.items.length - exMarked(r);
  if(left){ if(typeof toast === "function") toast(`${left} item${left === 1 ? "" : "s"} still to call. An audit that skips an item is how a set goes out with it.`); return; }
  r.at = new Date().toISOString(); persist();
  if(typeof toast === "function") toast("Audit handed in. The completed package is on the slide and in the workbench.");
  benchRepaint(blockId);
};

/* ---------- the Service Confirmation: the serving email, the acknowledgment, and the filed document ----------
   Proving a demand left the office is half of it. The other half is the email the Case Manager writes to serve it
   on the adjuster, and the adjuster's written acknowledgment — which fixes the date the clock started from the
   carrier's own words — and the follow-up that tests whether the Case Manager will move a deadline that is not
   theirs. Then the exchange stops being a mailbox thread: it is converted into a memorandum, filed into the open
   case in the CMS under the firm's naming convention, and backed up to the trainee's Drive. */
const folderLabel = (id) => { const f = (window.CM_CF_DOC_FOLDERS || []).find(x => x.id === id); return f ? f.label : String(id || "its folder"); };
const svNameFor = (e) => {
  const id = (window.CMCase && CMCase.id()) || "<Case ID>";
  return `${id}_Doe-John_${String(e.convert.type).replace(/\s+/g, "-")}_${(e.reply.date || "").split("/").reverse().join("-").replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1-$3-$2")}.pdf`;
};
function svStep(n, label, state, body){
  return `<div class="sv-step sv-${state}"><div class="sv-h"><span class="sv-n">${state === "done" ? "✓" : n}</span><b>${E(label)}</b></div>${body ? `<div class="sv-b">${body}</div>` : ""}</div>`;
}
function svWorkspace(blockId){
  const e = serviceOf(blockId), r = svRec(blockId), a = auditOf(blockId);
  const sent = !!r.sent, chose = r.choice != null, right = chose && !!(e.press.choices[r.choice] || {}).ok;
  const conv = !!r.converted, filed = !!r.filed, drive = !!r.drive;
  const compose = sent
    ? `<div class="sv-sentmail"><div class="sv-eh"><b>To</b> ${E(e.to)}<br><b>Cc</b> ${E(e.cc || "—")}<br><b>Subject</b> ${E(e.subject)}<br><b>Sent</b> ${E(e.sent)}, 4:21 p.m.<br><b>Attachment</b> ${E(e.attachment)}</div><pre class="sv-body">${E(r.body)}</pre></div>`
    : `<p class="sv-brief">${hl(e.brief)}</p>
      <div class="sv-eh"><b>To</b> ${E(e.to)}<br><b>Cc</b> ${E(e.cc || "—")}<br><b>Subject</b> ${E(e.subject)}<br><b>Attachment</b> ${E(e.attachment)}</div>
      <textarea class="sv-write" id="svw_${E(blockId)}" rows="9" placeholder="Write the email as you would send it." aria-label="Your email serving the demand">${E(r.body || "")}</textarea>
      <ul class="sv-req">${e.required.map(q => `<li>${E(q.label)}</li>`).join("")}</ul>
      <div class="sv-row"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.svSend('${blockId}')">Send it to the adjuster</button>
        <span class="sv-msg" id="svm_${E(blockId)}" aria-live="polite">${r.tries ? `Not sent yet — ${r.tries} attempt${r.tries === 1 ? "" : "s"}.` : ""}</span></div>`;
  const reply = sent ? `<div class="sv-eh"><b>From</b> ${E(e.reply.from)}<br><b>Sent</b> ${E(e.reply.date)}, ${E(e.reply.time)}<br><b>Subject</b> ${E(e.reply.subject)}</div><pre class="sv-body">${E(e.reply.body)}</pre>
      <ul class="sv-est">${e.convert.establishes.map(x => `<li>${hl(x)}</li>`).join("")}</ul>` : "";
  const press = sent ? `<div class="sv-eh"><b>From</b> ${E(e.press.from)}<br><b>Sent</b> ${E(e.press.date)}<br><b>Subject</b> ${E(e.press.subject)}</div><pre class="sv-body">${E(e.press.body)}</pre>
      <div class="sv-choices">${e.press.choices.map((c, i) => `<label class="sv-ch${chose ? (c.ok ? " ok" : (r.choice === i ? " no" : "")) : ""}">
          <input type="radio" name="svch_${E(blockId)}" ${r.choice === i ? "checked" : ""} ${chose ? "disabled" : ""} onchange="cmCaseFlow.svChoose('${blockId}',${i})">
          <span>${E(c.label)}${chose ? `<br><small>${c.ok ? "✓ " : "✕ "}${E(c.why)}</small>` : ""}</span></label>`).join("")}</div>` : "";
  const convert = `<p class="sv-note">A thread in a mailbox is not on the case file: a colleague covering the file cannot find it, and it is not in the backup. Converted, filed and backed up, the carrier's own confirmation of the date that started the clock is part of the case.</p>
    <ul class="sv-sec">${e.convert.sections.map(s => `<li><b>${E(s.h)}</b>${s.lines.length ? `<br>${s.lines.map(E).join("<br>")}` : ""}</li>`).join("")}</ul>
    <div class="sv-row"><button type="button" class="btn btn-navy" ${right ? "" : "disabled"} onclick="cmCaseFlow.svConvert('${blockId}')">📄 ${conv ? "Build it again" : "Convert the thread into a document"}</button>
      ${conv ? `<span class="sv-ok">✓ ${E(r.converted.pages)} page${r.converted.pages === 1 ? "" : "s"} built${r.converted.saved ? " and downloaded" : ""}</span>` : `<span class="sv-msg">${right ? "" : "Answer the follow-up correctly first."}</span>`}</div>`;
  const file = `<div class="sv-eh"><b>Category</b> ${E(e.convert.category)} &nbsp;<b>Name it</b> <code>&lt;Case ID&gt;_&lt;Last-First&gt;_&lt;Type&gt;_&lt;YYYY-MM-DD&gt;.pdf</code></div>
    ${filed ? `<span class="sv-ok">✓ Filed in the CMS as <b>${E(r.filed.name)}</b> under ${E(r.filed.category)}</span>${r.drive ? `<br><span class="sv-ok">✓ Kept on your Backup Drive under <b>${E(String(r.drive.folder).split("/").pop())}</b></span>` : ""}`
      : `<div class="sv-row"><input class="sv-name" id="svn_${E(blockId)}" placeholder="${E(svNameFor(e))}" aria-label="File name for the memorandum" value="${E(r.nameTried || "")}">
        <button type="button" class="btn btn-navy" ${conv ? "" : "disabled"} onclick="cmCaseFlow.svFile('${blockId}')">📤 File it in the CMS</button>
        <span class="sv-msg" id="svf_${E(blockId)}" aria-live="polite">${(r.problems || []).length ? r.problems.map(E).join(" · ") : (conv ? "" : "Build the document first.")}</span></div>`}`;
  const back = `<p class="sv-note">The firm keeps a Backup Drive as well as a CMS, and a document you wrote belongs in it like any other: a colleague covering this file looks for it under <b>${E(folderLabel(e.convert.folder))}</b>, where every demand and negotiation document on the case is kept. The CMS is the file of record, so a drive that isn't built yet never undoes the filing &mdash; it just leaves you one copy.</p>
    ${drive ? `<span class="sv-ok">✓ Kept on your Backup Drive under <b>${E(String(r.drive.folder).split("/").pop())}</b>, with the filing</span>`
      : `<div class="sv-row">${filed ? `<button type="button" class="btn btn-navy" onclick="cmCaseFlow.svDrive('${blockId}')">📂 Keep it on my Backup Drive</button>` : ""}
        <span class="sv-msg" id="svd_${E(blockId)}" aria-live="polite">${!filed ? "File it in the CMS first: the copy is kept with the filing."
          : r.driveWhy === "no-folder" ? "That folder isn't in your Backup Drive. Put the missing folders back from the dashboard, then try again."
          : "Your Backup Drive isn't built yet, so no copy was kept. Build it from the card on your dashboard, then keep this document on it."}</span></div>`}`;
  const model = `<p class="sv-note">The firm's own memorandum for this service, for you to read yours against: ${exDoc(e.model) ? exDocLink(e.model) : E(e.model)}.</p>`;
  return `<div class="cfx-modal-in card lesson-card cfx-sv"><div class="cfx-modal-h"><b>✉ ${E(e.title)}</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <div class="sv-top"><span>${E(e.kicker)}</span>${a && !exRec(blockId).at ? `<span class="sv-warn">Audit the set before you serve it: nothing goes out that has not been audited.</span>` : ""}</div>
    ${svStep(1, "The email that serves the demand", sent ? "done" : "now", compose)}
    ${svStep(2, "The adjuster's written acknowledgment", sent ? "done" : "wait", reply)}
    ${svStep(3, "The follow-up that tests the line", chose ? (right ? "done" : "no") : (sent ? "now" : "wait"), press)}
    ${svStep(4, "Convert the exchange into a document", conv ? "done" : (right ? "now" : "wait"), convert)}
    ${svStep(5, "File it in the CMS", filed ? "done" : (conv ? "now" : "wait"), file)}
    ${svStep(6, "Kept on your Backup Drive", drive ? "done" : (filed ? "now" : "wait"), back)}
    ${svStep(7, "Read yours against the firm's", "note", model)}</div>`;
}
window.cmCaseFlow.service = function(blockId){
  if(!serviceOf(blockId) || document.getElementById("cf-sv")) return;   // one workspace at a time, or the email being written is lost behind it
  const o = document.createElement("div"); o.className = "cfx-modal"; o.id = "cf-sv"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Service Confirmation");
  o.innerHTML = svWorkspace(blockId);
  const close = () => { const t = document.getElementById("svw_" + blockId); if(t) { svRec(blockId).body = t.value.slice(0, 4000); persist(); } o.remove(); document.removeEventListener("keydown", esc, true); if(typeof render === "function") render(); };
  const esc = ev => { if(ev.key === "Escape"){ ev.stopPropagation(); close(); } };
  o.addEventListener("click", ev => { if(ev.target === o || ev.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o);
};
function svRepaint(blockId){ const o = document.getElementById("cf-sv"); if(o) repaintModal(o, svWorkspace(blockId)); }
window.cmCaseFlow.svSend = function(blockId){
  const e = serviceOf(blockId), r = svRec(blockId); if(!e || r.sent) return;
  const el = document.getElementById("svw_" + blockId), text = ((el && el.value) || "").trim();
  r.body = text.slice(0, 4000);
  const msg = document.getElementById("svm_" + blockId);
  if(text.split(/\s+/).filter(Boolean).length < 40){
    r.tries++; persist();
    if(msg) msg.innerHTML = `<b>Not sent.</b> An email this short cannot do the job. Work through the list above.`;
    return;
  }
  const missing = e.required.filter(q => !q.match.every(p => { try{ return new RegExp(p, "i").test(text); }catch(err){ return true; } }));
  if(missing.length){
    r.tries++; persist();
    if(msg) msg.innerHTML = `<b>Not sent.</b> Dana Whitfield can answer this without giving you what you need:<ul>${missing.map(q => `<li>${E(q.label)} — ${E(q.hint)}</li>`).join("")}</ul>`;
    return;
  }
  r.sent = new Date().toISOString(); persist();
  if(typeof toast === "function") toast("Sent. Her acknowledgment is in the thread.");
  svRepaint(blockId);
};
window.cmCaseFlow.svChoose = function(blockId, i){
  const e = serviceOf(blockId), r = svRec(blockId); if(!e || r.choice != null) return;
  r.choice = i; persist();
  const c = e.press.choices[i] || {};
  if(typeof toast === "function") toast(c.ok ? "Right: recorded, routed, and the date stays on the docket." : "That one costs the file. Read why, and remember whose call it was.");
  svRepaint(blockId);
};
const SV_BYTES = {};   // the built PDF, held for this page's life (a PDF is not worth persisting: it is rebuilt)
/* the memorandum: the trainee's own email, the adjuster's words, and what the acknowledgment establishes.
   Everything it is made of is on their record, so it can be built again whenever it is needed — which is how
   the Drive copy still works for a trainee who files today and builds their drive tomorrow. */
async function svBuild(blockId){
  const e = serviceOf(blockId), r = svRec(blockId);
  if(!e || !(r.choice != null && (e.press.choices[r.choice] || {}).ok)) return null;
  if(typeof ensureJsPdf === "function" && !(await ensureJsPdf())) return null;
  const {jsPDF} = window.jspdf || {};
  if(!jsPDF) return null;
  const doc = (typeof safeDoc === "function" ? safeDoc(new jsPDF({unit: "pt", format: "letter"})) : new jsPDF({unit: "pt", format: "letter"}));
  const W = doc.internal.pageSize.getWidth(), H = doc.internal.pageSize.getHeight(), M = 54;
  const navy = [38, 43, 69], orange = [219, 132, 55], ink = [40, 42, 58], soft = [110, 116, 140];
  let y = 0, page = 0;
  const foot = () => { doc.setFont("helvetica", "normal"); doc.setFontSize(8); doc.setTextColor.apply(doc, soft);
    doc.text(`LSH CASE MANAGEMENT TRAINING — SIMULATED DOCUMENT — FICTIONAL PARTIES · John Doe v. Robert Smith · page ${page}`, W / 2, H - 24, {align: "center"}); };
  const head = (first) => { page++; if(typeof drawPdfHeader === "function") drawPdfHeader(doc, e.convert.title, `${(window.CMCase && CMCase.id()) || "LSH-2026-MVA-770412"} · prepared by ${state.traineeName || "the Case Manager"}${first ? "" : " (continued)"}`); y = 112; };
  const need = n => { if(y + n > H - 54){ foot(); doc.addPage(); head(false); } };
  const para = (t, opt) => { const o = opt || {};
    doc.setFont("helvetica", o.b ? "bold" : (o.i ? "italic" : "normal")); doc.setFontSize(o.size || 10); doc.setTextColor.apply(doc, o.color || ink);
    doc.splitTextToSize(String(t), W - 2 * M - (o.pad || 0)).forEach(l => { need(14); doc.text(l, M + (o.pad || 0), y); y += (o.lh || 13.5); }); y += (o.after == null ? 5 : o.after); };
  const h3 = t => { need(30); doc.setFont("helvetica", "bold"); doc.setFontSize(11.5); doc.setTextColor.apply(doc, navy); doc.text(String(t), M, y);
    doc.setDrawColor.apply(doc, orange); doc.setLineWidth(1.2); doc.line(M, y + 5, M + 40, y + 5); y += 20; };
  head(true);
  para(`Memorandum to file · prepared ${e.reply.date} · ${e.convert.title}`, {i: true, color: soft, size: 9.5});
  e.convert.sections.forEach(s => {
    h3(s.h);
    s.lines.forEach(l => para("— " + l));
    if(/email that served|confirmation email/i.test(s.h)){
      para(`To: ${e.to}`, {size: 9}); para(`Cc: ${e.cc || "—"}`, {size: 9}); para(`Subject: ${e.subject}`, {size: 9});
      para(`Sent: ${e.sent}, 4:21 p.m. · Attachment: ${e.attachment}`, {size: 9, color: soft});
      String(r.body).split(/\n{2,}/).forEach(p => para(p.replace(/\s*\n\s*/g, " "), {pad: 12}));
    }
    if(/adjuster's acknowledg/i.test(s.h)){
      para(`From: ${e.reply.from}`, {size: 9}); para(`Sent: ${e.reply.date}, ${e.reply.time}`, {size: 9}); para(`Subject: ${e.reply.subject}`, {size: 9});
      String(e.reply.body).split(/\n{2,}/).forEach(p => para(p.replace(/\s*\n\s*/g, " "), {pad: 12}));
    }
    if(/establishes/i.test(s.h)) e.convert.establishes.forEach(x => para("— " + x));
  });
  h3("Appendix · the follow-up and how it was answered");
  para(`${e.press.from}, ${e.press.date} — ${e.press.subject}`, {size: 9, color: soft});
  para(String(e.press.body).replace(/\s*\n\s*/g, " "), {pad: 12});
  para("Answered: " + (e.press.choices[r.choice] || {}).label, {b: true});
  foot();
  let bytes = null;
  try{ bytes = doc.output("arraybuffer"); }catch(err){ bytes = null; }
  if(bytes) SV_BYTES[blockId] = bytes;
  return {bytes, pages: page, doc};
}
/* The trainee's own press of "Convert": build it, hand them the file, and let them name it for the CMS. */
window.cmCaseFlow.svConvert = async function(blockId){
  const e = serviceOf(blockId), r = svRec(blockId); if(!e) return;
  if(!(r.choice != null && (e.press.choices[r.choice] || {}).ok)) return;
  const built = await svBuild(blockId);
  if(!built || !built.bytes){ if(typeof toast === "function") toast("Couldn't build the document — try again."); return; }
  let saved = false;
  try{ built.doc.save(String(e.convert.title).replace(/[^\w]+/g, "-").replace(/^-|-$/g, "") + ".pdf"); saved = true; }catch(err){}
  r.converted = {at: new Date().toISOString(), pages: built.pages, saved};
  persist();
  if(typeof toast === "function") toast("Document built. Name it the firm's way and file it in the CMS.");
  svRepaint(blockId);
};
/* The document as it stands, built again if this page hasn't built it yet. */
async function svBytes(blockId){
  const held = SV_BYTES[blockId];
  if(held && held.byteLength) return held;
  const built = await svBuild(blockId);
  return built && built.bytes && built.bytes.byteLength ? built.bytes : null;
}
window.cmCaseFlow.svFile = async function(blockId){
  const e = serviceOf(blockId), r = svRec(blockId); if(!e || !r.converted || r.filed) return;
  const el = document.getElementById("svn_" + blockId), name = ((el && el.value) || "").trim();
  const msg = document.getElementById("svf_" + blockId);
  const say = h => { if(msg) msg.innerHTML = h; };
  r.nameTried = name;
  if(!name){ say("Write the file name first, the firm's way."); return; }
  if(!window.cmDocFiling || typeof cmDocFiling.send !== "function"){ say("Filing isn't available on this page."); return; }
  say("Filing…");
  const bytes = await svBytes(blockId);
  if(!bytes){ say("The document could not be built. Press Convert again, then file it."); return; }
  const out = await cmDocFiling.send({name, category: e.convert.category, folder: e.convert.folder,
    original: "Demand-Service-Acknowledgment.pdf",
    mime: "application/pdf", summary: e.convert.title, bytes: bytes.slice(0)});
  if(out && out.ok){
    r.filed = {name: out.name, category: out.category || e.convert.category, at: new Date().toISOString()}; r.problems = [];
    // the same filing keeps it on the trainee's Backup Drive, in the folder this kind of document belongs in
    if(out.drive && out.drive.ok) r.drive = {at: new Date().toISOString(), folder: out.drive.folder};
    else r.driveWhy = (out.drive && out.drive.why) || "no-drive";
    persist();
    if(typeof toast === "function") toast(`Filed in the CMS as ${out.name}.`);
    if(r.drive && typeof toast === "function") toast(`Kept on your Backup Drive under ${String(r.drive.folder).split("/").pop()}.`);
    svRepaint(blockId); return;
  }
  r.problems = (out && out.problems && out.problems.length) ? out.problems : [(out && out.error) || "The CMS did not file it."];
  persist(); say(`<b>Not filed.</b> ${r.problems.map(E).join(" · ")}`);
};

/* ---------- the Amendment Requests: records wrong at their source, corrected by the provider ----------
   A Case Manager never fixes a provider's record. In the pre-demand audit they screen the records and bills,
   find what is wrong at the source, and — with Atty. Thorne's approval — write each provider a request to correct
   its own record or statement (build/case-flow/exhibits: "amendments"). A request that leaves out what the provider
   needs, or asks for something it must not, is refused with the reason and nothing is sent. A complete one brings
   the provider's answer and, with it, the corrected copy (RS72, RS73), which opens to the trainee from then on —
   on the Documents page and in every later activity that works from it — and which they file in the CMS the
   firm's way. Every request ends in written feedback on their work, and their trainer sees all of it. */
const amendOf = id => (EX.amendments || {})[id] || null;
function amRec(blockId){ REC.amend = REC.amend || {}; return (REC.amend[blockId] = REC.amend[blockId] || {marks: {}, screened: null, req: {}}); }
function amReq(blockId, docId){ const r = amRec(blockId); return (r.req[docId] = r.req[docId] || {body: "", tries: 0, log: [], sent: null, choice: null}); }
/* A corrected copy opens once the trainee's request for it is answered; every other document is as it was. */
function docAvail(d){
  if(!d || !d.unlock || isTrainer()) return true;
  return !!((((REC.amend || {})[d.unlock] || {}).req || {})[d.amends] || {}).sent;
}
window.cmDocAvailable = docAvail;
const AM_FIT = "fit", AM_FIX = "fix";
const amAsked = a => new Set(a.requests.map(q => q.doc));
const amScreenScore = (a, r) => a.screen.reduce((n, s) => n + ((r.marks[s.doc] === AM_FIX) === amAsked(a).has(s.doc) ? 1 : 0), 0);
/* The requests a trainee works: once the screening is checked, every one — those they found, and those they
   missed (marked so), because a record left wrong is still wrong. */
const amOpenReqs = (a, r) => r.screened ? a.requests : [];
const amTest = (q, text) => (q.match || []).every(p => { try{ return new RegExp(p, "i").test(text); }catch(err){ return true; } });
const amTrips = (q, text) => (q.match || []).some(p => { try{ return new RegExp(p, "i").test(text); }catch(err){ return false; } });
/* the sentence of the trainee's own email that does each job, quoted back to them in the feedback */
function amQuote(q, text){
  const parts = String(text).split(/\n+|(?<!\b(?:Mr|Ms|Mrs|Dr|Atty|No|St)\.)(?<=[.!?])\s+/).map(x => x.trim()).filter(Boolean);
  const hit = parts.find(x => amTest(q, x)) || parts.find(x => amTrips(q, x));
  return hit ? (hit.length > 220 ? hit.slice(0, 217) + "…" : hit) : "";
}
const amFiled = docId => ((state.docFiling || {})[docId] || {});
function amSummary(blockId, a, r){
  const reqs = amOpenReqs(a, r), sent = reqs.filter(q => amReq(blockId, q.doc).sent);
  const first = sent.filter(q => amReq(blockId, q.doc).tries === 0).length;
  const copies = reqs.filter(q => q.corrected), filed = copies.filter(q => amFiled(q.corrected).filed);
  return {sent: sent.length, of: a.requests.length, first, copies: copies.length, filed: filed.length,
    filedFirst: filed.filter(q => amFiled(q.corrected).attempts === 1).length};
}

function amWorkspace(blockId){
  const a = amendOf(blockId), r = amRec(blockId);
  const asked = amAsked(a), done = !!r.screened;
  const marked = a.screen.filter(s => r.marks[s.doc]).length;
  const screenRows = a.screen.map(s => {
    const d = exDoc(s.doc), mine = r.marks[s.doc] || "", need = asked.has(s.doc), right = done && (mine === AM_FIX) === need;
    const q = need ? a.requests.find(x => x.doc === s.doc) : null;
    return `<tr class="${done ? (right ? "ok" : "no") : ""}"><td>${exDocLink(s.doc)}<br><small class="ab-as">${E(d ? d.desc : "")}</small></td>
      <td class="ab-call">${done
        ? `<span class="ab-v">${mine === AM_FIX ? "↻ Wrong at its source" : "✓ Fit to use"}</span>${right ? `<span class="ab-ok">✓</span>` : `<br><span class="ab-right">${need ? "↻ Wrong at its source" : "✓ Fit to use"}</span>`}`
        : `<label class="am-opt"><input type="radio" name="am_${E(blockId)}_${E(s.doc)}" ${mine === AM_FIT ? "checked" : ""} onchange="cmCaseFlow.amMark('${blockId}','${s.doc}','${AM_FIT}')"> Fit to use</label>
           <label class="am-opt"><input type="radio" name="am_${E(blockId)}_${E(s.doc)}" ${mine === AM_FIX ? "checked" : ""} onchange="cmCaseFlow.amMark('${blockId}','${s.doc}','${AM_FIX}')"> Wrong at its source</label>`}</td>
      <td>${done ? (need ? `<b>${right ? "You caught it." : "You missed this one."}</b> ${hl(q.wrong)}<br><small>Proved by: ${q.proof.map(exDocLink).join(" · ")}</small>` : `${right ? "" : "<b>It is fit to use.</b> "}${hl(s.why)}`) : ""}</td></tr>`;
  }).join("");
  const screen = `<table class="ab-table am-screen"><thead><tr><th>Record or bill</th><th>Your call${done ? " · the file's" : ""}</th><th>${done ? "Why" : ""}</th></tr></thead><tbody>${screenRows}</tbody></table>
    ${done ? `<p class="sv-ok">Screening: ${amScreenScore(a, r)} of ${a.screen.length} called correctly. Every record wrong at its source gets a request below, including any you missed.</p>`
      : `<div class="sv-row"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.amScreen('${blockId}')">Check my screening</button><span class="sv-msg" id="ams_${E(blockId)}">${marked} of ${a.screen.length} called</span></div>`}`;
  const reqs = amOpenReqs(a, r).map((q, i) => amCard(blockId, a, r, q, i)).join("");
  const s = amSummary(blockId, a, r);
  const report = done && s.sent === s.of ? `<div class="am-report"><b>📋 Your feedback on this skill builder</b>
      <ul><li>Screening: <b>${amScreenScore(a, r)} of ${a.screen.length}</b> records called correctly${amScreenScore(a, r) === a.screen.length ? ". You found every record wrong at its source and left the sound ones alone." : ". Read the ✕ rows above: a record missed here goes into the demand wrong."}</li>
      <li>Requests: <b>${s.sent} of ${s.of}</b> sent, <b>${s.first}</b> the first time${s.first === s.of ? ". Each one gave the provider everything it needed and asked for nothing it shouldn't." : ". The refused attempts are listed on each request with what was missing."}</li>
      <li>Corrected copies: <b>${s.filed} of ${s.copies}</b> filed in the CMS${s.filed ? `, ${s.filedFirst} first time right` : ""}${s.filed < s.copies ? ". File the rest: a corrected copy in your inbox is not on the case file." : "."}</li></ul></div>` : "";
  return `<div class="cfx-modal-in card lesson-card cfx-sv"><div class="cfx-modal-h"><b>📝 ${E(a.title)}</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <div class="sv-top"><span>${E(a.kicker)}</span></div>
    <p class="sv-brief">${hl(a.intro)}</p>
    ${report}
    ${svStep(1, "Screen the records and bills", done ? "done" : "now", screen)}
    ${reqs}</div>`;
}
function amCard(blockId, a, r, q, i){
  const x = amReq(blockId, q.doc), sent = !!x.sent, src = exDoc(q.doc), missed = r.marks[q.doc] !== AM_FIX;
  const chose = x.choice != null, nextOk = chose && !!(q.next.choices[x.choice] || {}).ok;
  const copy = q.corrected ? exDoc(q.corrected) : null, filedRec = copy ? amFiled(copy.id) : {};
  const finished = sent && (q.next ? chose : !!filedRec.filed);
  const head = `<p class="am-wrong">${missed ? "<b>You missed this one in the screening.</b> " : ""}${hl(q.wrong)}</p>`;
  const compose = sent
    ? `<div class="sv-sentmail"><div class="sv-eh"><b>To</b> ${E(q.to)}<br><b>Cc</b> ${E(q.cc)}<br><b>Subject</b> ${E(q.subject)}<br><b>Attachment</b> ${E(q.attachment)}</div><pre class="sv-body">${E(x.body)}</pre></div>`
    : `<p class="sv-brief">${hl(q.brief)}</p>
      <div class="sv-eh"><b>To</b> ${E(q.to)}<br><b>Cc</b> ${E(q.cc)}<br><b>Subject</b> ${E(q.subject)}<br><b>Attachment</b> ${E(q.attachment)}</div>
      <textarea class="sv-write" id="amw_${E(blockId)}_${E(q.doc)}" rows="9" placeholder="Write the request as you would send it." aria-label="Your request to the provider">${E(x.body || "")}</textarea>
      <ul class="sv-req">${q.required.map(z => `<li>${E(z.label)}</li>`).join("")}</ul>
      <div class="sv-row"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.amSend('${blockId}','${q.doc}')">Send the request</button>
        <span class="sv-msg" id="amm_${E(blockId)}_${E(q.doc)}" aria-live="polite">${x.tries ? `Not sent yet — ${x.tries} attempt${x.tries === 1 ? "" : "s"} refused.` : ""}</span></div>`;
  const reply = sent ? `<div class="sv-eh"><b>From</b> ${E(q.reply.from)}<br><b>Sent</b> ${E(q.reply.date)}, ${E(q.reply.time)}<br><b>Subject</b> ${E(q.reply.subject)}${copy ? `<br><b>Attachment</b> ${E(copy.title)}` : ""}</div><pre class="sv-body">${E(q.reply.body)}</pre>
      ${copy ? `<p class="sv-ok">📄 The corrected copy is now in your case documents: ${exDocLink(copy.id)}. It opens beside the original in every activity that works from it.</p>` : ""}` : "";
  const after = !sent ? "" : copy
    ? `<p class="sv-note">A corrected copy in your inbox is not on the case file. File it in the CMS beside the original, named the firm's way; the filing keeps it on your Backup Drive too.</p>
       ${window.cmDocFiling && cmDocFiling.row ? `<div class="dfl">${cmDocFiling.row(blockId, copy)}</div>` : ""}`
    : `<p class="sv-brief"><b>${E(q.next.q)}</b></p>
       <div class="sv-choices">${q.next.choices.map((c, k) => `<label class="sv-ch${chose ? (c.ok ? " ok" : (x.choice === k ? " no" : "")) : ""}">
         <input type="radio" name="amch_${E(blockId)}_${E(q.doc)}" ${x.choice === k ? "checked" : ""} ${chose ? "disabled" : ""} onchange="cmCaseFlow.amChoose('${blockId}','${q.doc}',${k})">
         <span>${E(c.label)}${chose ? `<br><small>${c.ok ? "✓ " : "✕ "}${E(c.why)}</small>` : ""}</span></label>`).join("")}</div>`;
  const feedback = sent ? amFeedback(blockId, q, x, copy, filedRec) : "";
  const label = `${src ? src.title : q.doc}`;
  return `<div class="am-req">${svStep(i + 2, `Request ${i + 1}: ${label}`, finished ? "done" : "now", head
    + `<div class="am-sub"><b>✉ Your request</b>${compose}</div>`
    + (sent ? `<div class="am-sub"><b>↩ The provider's answer</b>${reply}</div><div class="am-sub"><b>${copy ? "📤 File the corrected copy" : "➡ What you do next"}</b>${after}</div>${feedback}` : ""))}</div>`;
}
/* the explicit feedback on one request: what the email did, in the trainee's own words; what was refused on the way;
   the filing; the decision; what the correction protects; and the firm's model to read theirs against */
function amFeedback(blockId, q, x, copy, filedRec){
  const did = q.required.map(z => { const quote = amQuote(z, x.body);
    return `<li>✓ <b>${E(z.label)}</b>${quote ? ` — you wrote: <i>“${E(quote)}”</i>` : ""}</li>`; }).join("");
  const refused = (x.log || []).map((l, k) => `<li>✕ Attempt ${k + 1} refused: ${l.short ? "too short to do the job" : ""}${(l.tripped || []).map(id => { const z = (q.forbidden || []).find(f => f.id === id); return z ? `it ${E(z.label.charAt(0).toLowerCase() + z.label.slice(1))}` : ""; }).filter(Boolean).join("; ")}${(l.missing || []).length ? `${(l.tripped || []).length || l.short ? "; " : ""}missing: ${l.missing.map(id => { const z = q.required.find(f => f.id === id); return z ? E(z.label) : ""; }).join("; ")}` : ""}</li>`).join("");
  const tries = x.tries || 0;
  const filing = copy ? (filedRec.filed ? `<li>✓ Filed in the CMS as <code>${E(filedRec.name)}</code> under ${E(filedRec.category)}${filedRec.attempts === 1 ? ", first time right" : `, after ${E(filedRec.attempts)} attempts`}.</li>` : `<li>… The corrected copy is not filed yet.</li>`) : "";
  const choice = !copy && x.choice != null ? (c => `<li>${c.ok ? "✓" : "✕"} You chose: <i>${E(c.label)}</i> ${E(c.why)}</li>`)(q.next.choices[x.choice]) : "";
  return `<div class="am-fb"><b>📋 Feedback on your request</b>
    <p>${tries === 0 ? "Sent first time: it gave the provider everything it needed and asked for nothing it shouldn't." : `Sent on attempt ${tries + 1}. ${tries} refused before it, each for the reason below; that is what a provider would have bounced back or used against the file.`}</p>
    <ul class="am-did">${did}${refused}${filing}${choice}</ul>
    <p><b>What this protects:</b> ${hl(q.protects)}</p>
    <details><summary>The firm's model request, to read yours against</summary><pre class="sv-body">${E(q.model)}</pre></details></div>`;
}
window.cmCaseFlow.amend = function(blockId){
  if(!amendOf(blockId) || document.getElementById("cf-am")) return;
  const o = document.createElement("div"); o.className = "cfx-modal"; o.id = "cf-am"; o.dataset.block = blockId; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Amendment Requests");
  o.innerHTML = amWorkspace(blockId);
  const close = () => { amKeepDrafts(blockId); persist(); o.remove(); document.removeEventListener("keydown", esc, true); if(typeof render === "function") render(); };
  const esc = ev => { if(ev.key === "Escape"){ ev.stopPropagation(); close(); } };
  o.addEventListener("click", ev => { if(ev.target === o || ev.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o);
};
// the emails being written survive a repaint and a close
function amKeepDrafts(blockId){
  const a = amendOf(blockId); if(!a) return;
  a.requests.forEach(q => { const t = document.getElementById(`amw_${blockId}_${q.doc}`), x = amReq(blockId, q.doc); if(t && !x.sent) x.body = t.value.slice(0, 4000); });
}
function amRepaint(blockId){ const o = document.getElementById("cf-am"); if(o){ amKeepDrafts(blockId); repaintModal(o, amWorkspace(blockId)); } }
window.cmCaseFlow.amMark = function(blockId, docId, v){
  const a = amendOf(blockId), r = amRec(blockId); if(!a || r.screened) return;
  r.marks[docId] = v === AM_FIX ? AM_FIX : AM_FIT;
  const m = document.getElementById("ams_" + blockId); if(m) m.textContent = `${a.screen.filter(s => r.marks[s.doc]).length} of ${a.screen.length} called`;
  clearTimeout(exT); exT = setTimeout(persist, 600);
};
window.cmCaseFlow.amScreen = function(blockId){
  const a = amendOf(blockId), r = amRec(blockId); if(!a || r.screened) return;
  const left = a.screen.filter(s => !r.marks[s.doc]).length;
  if(left){ if(typeof toast === "function") toast(`${left} record${left === 1 ? "" : "s"} still to call. A record you didn't look at is one that goes into the demand unchecked.`); return; }
  r.screened = new Date().toISOString(); persist();
  if(typeof toast === "function") toast(`Screening checked: ${amScreenScore(a, r)} of ${a.screen.length}. Write the requests below.`);
  amRepaint(blockId);
};
window.cmCaseFlow.amSend = function(blockId, docId){
  const a = amendOf(blockId), q = a && a.requests.find(z => z.doc === docId), x = amReq(blockId, docId); if(!q || x.sent) return;
  const el = document.getElementById(`amw_${blockId}_${docId}`), text = ((el && el.value) || "").trim();
  x.body = text.slice(0, 4000);
  const msg = document.getElementById(`amm_${blockId}_${docId}`), who = String(q.to).split(/[,<]/)[0].trim();
  const refuse = (entry, html) => { x.tries++; x.log.push(entry); persist(); if(msg) msg.innerHTML = html; };
  if(text.split(/\s+/).filter(Boolean).length < 40){ refuse({short: true, missing: [], tripped: []}, `<b>Not sent.</b> A request this short cannot do the job. Work through the list above.`); return; }
  const tripped = (q.forbidden || []).filter(z => amTrips(z, text));
  const missing = q.required.filter(z => !amTest(z, text));
  if(tripped.length || missing.length){
    refuse({missing: missing.map(z => z.id), tripped: tripped.map(z => z.id)},
      `<b>Not sent.</b>${tripped.length ? `<ul>${tripped.map(z => `<li><b>${E(z.label)}.</b> ${E(z.why)}</li>`).join("")}</ul>` : ""}${missing.length ? `${who} can't act on this as written:<ul>${missing.map(z => `<li>${E(z.label)} — ${E(z.hint)}</li>`).join("")}</ul>` : ""}`);
    return;
  }
  x.sent = new Date().toISOString(); persist();
  if(typeof toast === "function") toast(q.corrected ? `Sent. ${who} answered, and the corrected copy is in your case documents.` : `Sent. ${who} answered: read it, then decide what you do next.`);
  amRepaint(blockId);
};
window.cmCaseFlow.amChoose = function(blockId, docId, k){
  const a = amendOf(blockId), q = a && a.requests.find(z => z.doc === docId), x = amReq(blockId, docId); if(!q || !q.next || x.choice != null) return;
  x.choice = k; persist();
  if(typeof toast === "function") toast((q.next.choices[k] || {}).ok ? "Right: the audited figure goes out with its proof, and the correction is chased." : "That one costs the file. Read why.");
  amRepaint(blockId);
};
// a corrected copy filed from the workspace: repaint it so the feedback shows the filing
window.addEventListener("cm-doc-filed", () => { const o = document.getElementById("cf-am"); if(o && o.dataset.block) amRepaint(o.dataset.block); });
/* The memorandum reaches the Backup Drive with the filing. This is the retry, for a trainee whose drive
   wasn't built or connected when they filed: the copy is made now, from the document they already built. */
window.cmCaseFlow.svDrive = async function(blockId){
  const e = serviceOf(blockId), r = svRec(blockId); if(!e || !r.filed || r.drive) return;
  const msg = document.getElementById("svd_" + blockId);
  const say = t => { if(msg) msg.textContent = t; };
  if(!window.cmDocFiling || typeof cmDocFiling.keepOnDrive !== "function"){ say("The Backup Drive isn't available on this page."); return; }
  say("Keeping it on your Drive…");
  // a trainee who files today and builds their drive tomorrow: the memorandum is built again from their record
  const bytes = await svBytes(blockId);
  if(!bytes){ say("The document could not be built again. Press Convert, then keep it on your Drive."); return; }
  const out = await cmDocFiling.keepOnDrive(e.convert.folder, r.filed.name, bytes.slice(0));
  if(out && out.ok){
    r.drive = {at: new Date().toISOString(), folder: out.folder}; r.driveWhy = "";
    persist();
    if(typeof toast === "function") toast(`Kept on your Backup Drive under ${String(out.folder).split("/").pop()}.`);
    svRepaint(blockId); return;
  }
  r.driveWhy = (out && out.why) || "no-drive"; persist();
  say(out && out.why === "no-folder" ? "That folder isn't in your Backup Drive. Put the missing folders back from the dashboard, then try again."
    : "Your Backup Drive isn't built yet. Build it from the card on your dashboard, then keep this document on it.");
};
/* ---------- Notes & Action Plan: a message on the file, taken down and turned into work ----------
   In place of the documents beside a voicemail, the trainee works it the way the desk does: types the message as
   said (checked against what was said, then the transcript and the facts it had to catch are shown), writes the
   action plan (graded against the steps it must hold, each with its answer key once handed in), then works the plan:
   the emails (Email Simulator: refused while one leaves out what it must say or says what it must not, answered
   once it does) and the client check-in on the live call. Content: build/case-flow/exhibits (notes); the record
   (REC.notes) goes to the trainer with the module's Learning Check. */
const notesOf = id => EX.notes[id] || null;
function npRec(id){ REC.notes = REC.notes || {}; const r = (REC.notes[id] = REC.notes[id] || {tx: "", txAt: null, txGot: [], plan: "", planAt: null, planGot: [], mails: {}});
  r.mails = r.mails || {}; return r; }
const npHit = (pats, text) => (pats || []).every(p => { try{ return new RegExp(p, "i").test(text || ""); }catch(e){ return false; } });
const npMail = (r, id) => (r.mails[id] = r.mails[id] || {body: "", sent: null, tries: 0});
/* how far the trainee is: each part, done or not, in the order it's worked */
function npParts(blockId){
  const n = notesOf(blockId), r = npRec(blockId);
  return [{k: "tx", label: "Transcribe the voicemail", done: !!r.txAt}, {k: "plan", label: "Write your action plan", done: !!r.planAt}]
    .concat((n.emails || []).map(e => ({k: "mail-" + e.id, label: e.title.replace(/^Email Simulator — /, "Email "), done: !!npMail(r, e.id).sent})))
    .concat(n.call ? [{k: "call", label: n.call.title.replace(/ \(Call Simulator\)$/, ""), done: !!(REC.calls || {})[blockId]}] : []);
}
function npCard(blockId){
  const n = notesOf(blockId), parts = npParts(blockId), r = npRec(blockId);
  const sc = r.txAt ? ` · transcript ${r.txGot.filter(Boolean).length}/${n.transcribe.facts.length}` : "", pl = r.planAt ? ` · plan ${r.planGot.filter(Boolean).length}/${n.plan.required.length}` : "";
  return `<div class="cfx-np"><b>📝 Notes &amp; Action Plan</b><span class="cfx-np-k">${E(n.kicker)}</span>
    <ol>${parts.map(p => `<li class="${p.done ? "ok" : ""}">${p.done ? "✓" : "○"} ${E(p.label)}</li>`).join("")}</ol>
    <div class="cfx-np-r"><button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.notes('${blockId}')">📝 ${parts.some(p => p.done) ? "Continue" : "Open"} Notes &amp; Action Plan</button><small>${parts.filter(p => p.done).length} of ${parts.length} done${sc}${pl}</small></div></div>`;
}
function npEmail(blockId, e, open){
  const r = npRec(blockId), m = npMail(r, e.id), sent = !!m.sent;
  const head = `<div class="sv-eh"><b>To</b> ${E(e.to)}${e.cc ? `<br><b>Cc</b> ${E(e.cc)}` : ""}<br><b>Subject</b> ${E(e.subject)}${sent ? `<br><b>Sent</b> ${E(new Date(m.sent).toLocaleString())}` : ""}</div>`;
  if(sent) return `<p class="sv-note">${E(e.why)}</p><div class="sv-sentmail">${head}<pre class="sv-body">${E(m.body)}</pre>
      <div class="sv-eh"><b>From</b> ${E(e.reply.from)}<br><b>Sent</b> ${E(e.reply.date)}, ${E(e.reply.time)}<br><b>Subject</b> ${E(e.reply.subject)}</div><pre class="sv-body">${E(e.reply.body)}</pre></div>`;
  if(!open) return `<p class="sv-note">${E(e.why)}</p>`;
  return `<p class="sv-note">${E(e.why)}</p><p class="sv-brief">${hl(e.brief)}</p>${head}
    <textarea class="sv-write" id="npm_${E(blockId)}_${E(e.id)}" rows="7" placeholder="Write the email as you would send it." aria-label="${E(e.title)}" oninput="cmCaseFlow.npDraft('${blockId}','m:${e.id}',this.value)">${E(m.body || "")}</textarea>
    <ul class="sv-req">${e.required.map(q => `<li>${E(q.label)}</li>`).join("")}</ul>
    <div class="sv-row"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.npSend('${blockId}','${e.id}')">✉ Send</button>
      <span class="sv-msg" id="npmm_${E(blockId)}_${E(e.id)}" aria-live="polite">${m.tries ? `Not sent yet — ${m.tries} attempt${m.tries === 1 ? "" : "s"}.` : ""}</span></div>`;
}
function npWorkspace(blockId){
  const n = notesOf(blockId), r = npRec(blockId), ev = SIM.events[blockId] || {}, vm = vmRec(blockId);
  const txDone = !!r.txAt, planDone = !!r.planAt, t = n.transcribe, p = n.plan;
  const tx = txDone
    ? `<pre class="sv-body">${E(r.tx)}</pre>
      <div class="np-key"><b>Answer key: what was said</b><p>${E(ev.spoken || "")}</p>
        <ul>${t.facts.map((f, i) => `<li class="${r.txGot[i] ? "ok" : "miss"}">${r.txGot[i] ? "✓ Caught" : "✗ Missed"} · ${E(f.label)}</li>`).join("")}</ul></div>`
    : `<p class="sv-brief">${hl(t.brief)}</p>
      <div class="sv-row"><button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.vmPlay('${blockId}')">${vm.plays ? "↻ Play again" : "▶ Play the voicemail"}</button><span class="sv-note">${E(ev.from || "")} · ${E(ev.date || "")}${ev.time ? " · " + E(ev.time) : ""}</span></div>
      <textarea class="sv-write" id="npt_${E(blockId)}" rows="6" placeholder="Type the message as you hear it." aria-label="Your transcript of the voicemail" oninput="cmCaseFlow.npDraft('${blockId}','tx',this.value)">${E(r.tx || "")}</textarea>
      <div class="sv-row"><button type="button" class="btn btn-navy" onclick="cmCaseFlow.npTx('${blockId}')">Check my transcript</button><span class="sv-msg" id="nptm_${E(blockId)}" aria-live="polite"></span></div>`;
  const plan = planDone
    ? `<pre class="sv-body">${E(r.plan)}</pre>
      <div class="np-key"><b>Answer key: the plan, step by step</b><ol>${p.required.map((q, i) => `<li class="${r.planGot[i] ? "ok" : "miss"}"><b>${r.planGot[i] ? "✓" : "✗"} ${E(q.label)}</b><br>${E(q.key)}</li>`).join("")}</ol></div>`
    : !txDone ? "" : `<p class="sv-brief">${hl(p.brief)}</p>
      <textarea class="sv-write" id="npp_${E(blockId)}" rows="8" placeholder="1. …&#10;2. …" aria-label="Your action plan" oninput="cmCaseFlow.npDraft('${blockId}','plan',this.value)">${E(r.plan || "")}</textarea>
      <div class="sv-row"><button type="button" class="btn btn-navy" onclick="cmCaseFlow.npPlan('${blockId}')">Hand in my plan</button><span class="sv-msg" id="nppm_${E(blockId)}" aria-live="polite"></span></div>`;
  const called = !!(REC.calls || {})[blockId];
  const call = n.call ? `<p class="sv-note">${E(n.call.why)}</p><ul class="sv-req">${n.call.goals.map(g => `<li>${E(g)}</li>`).join("")}</ul>
    <div class="sv-row">${planDone ? `<button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.npCall('${blockId}')">📞 ${called ? "Call again" : "Take the call"}</button>` : ""}${called ? `<span class="sv-ok">✓ Call taken ${E(new Date(REC.calls[blockId].at).toLocaleDateString())}</span>` : ""}</div>` : "";
  let k = 2;
  return `<div class="cfx-modal-in card lesson-card cfx-sv cfx-npw"><div class="cfx-modal-h"><b>📝 ${E(n.title)}</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <div class="sv-top"><span>${E(n.kicker)}</span></div>
    ${svStep(1, "Transcribe the voicemail", txDone ? "done" : "now", tx)}
    ${svStep(2, "Your action plan (graded)", planDone ? "done" : (txDone ? "now" : "wait"), plan)}
    ${(n.emails || []).map(e => { k++; const s = !!npMail(r, e.id).sent; return svStep(k, e.title, s ? "done" : (planDone ? "now" : "wait"), npEmail(blockId, e, planDone)); }).join("")}
    ${n.call ? svStep(++k, n.call.title, called ? "done" : (planDone ? "now" : "wait"), call) : ""}</div>`;
}
window.cmCaseFlow.notes = function(blockId){
  if(!notesOf(blockId) || document.getElementById("cf-np")) return;
  const o = document.createElement("div"); o.className = "cfx-modal"; o.id = "cf-np"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Notes & Action Plan");
  o.innerHTML = npWorkspace(blockId);
  const close = () => { persist(); o.remove(); document.removeEventListener("keydown", esc, true); if(typeof render === "function") render(); };
  const esc = ev => { if(ev.key === "Escape"){ ev.stopPropagation(); close(); } };
  o.addEventListener("click", ev => { if(ev.target === o || ev.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o);
};
function npRepaint(blockId){ const o = document.getElementById("cf-np"); if(o) repaintModal(o, npWorkspace(blockId)); }
let npT = null;
window.cmCaseFlow.npDraft = function(blockId, k, v){
  const r = npRec(blockId), t = String(v).slice(0, 4000);
  if(k === "tx" && !r.txAt) r.tx = t; else if(k === "plan" && !r.planAt) r.plan = t;
  else if(k.startsWith("m:")){ const m = npMail(r, k.slice(2)); if(!m.sent) m.body = t; }
  clearTimeout(npT); npT = setTimeout(persist, 600);
};
const npWords = t => String(t || "").split(/\s+/).filter(Boolean).length;
window.cmCaseFlow.npTx = function(blockId){
  const n = notesOf(blockId), r = npRec(blockId), el = document.getElementById("npt_" + blockId), msg = document.getElementById("nptm_" + blockId);
  if(!n || r.txAt) return;
  r.tx = ((el && el.value) || r.tx || "").trim().slice(0, 4000);
  if(!vmRec(blockId).plays && !isTrainer()){ if(msg) msg.textContent = "Play the voicemail first: the transcript is of what you hear."; return; }
  if(npWords(r.tx) < 25){ if(msg) msg.textContent = "Take more of it down: type the message as he says it, start to finish."; return; }
  r.txGot = n.transcribe.facts.map(f => npHit(f.match, r.tx)); r.txAt = new Date().toISOString(); persist();
  if(typeof toast === "function") toast(`You caught ${r.txGot.filter(Boolean).length} of ${n.transcribe.facts.length}. The transcript and the answer key are open.`);
  npRepaint(blockId);
};
window.cmCaseFlow.npPlan = function(blockId){
  const n = notesOf(blockId), r = npRec(blockId), el = document.getElementById("npp_" + blockId), msg = document.getElementById("nppm_" + blockId);
  if(!n || r.planAt || !r.txAt) return;
  r.plan = ((el && el.value) || r.plan || "").trim().slice(0, 4000);
  if(npWords(r.plan) < 30){ if(msg) msg.textContent = "A plan names each step, who it's with and what it must achieve. Write it out."; return; }
  r.planGot = n.plan.required.map(q => npHit(q.match, r.plan)); r.planAt = new Date().toISOString(); persist();
  if(typeof toast === "function") toast(`Your plan holds ${r.planGot.filter(Boolean).length} of ${n.plan.required.length} steps. The answer key is open; now work the plan.`);
  npRepaint(blockId);
};
window.cmCaseFlow.npSend = function(blockId, id){
  const n = notesOf(blockId), e = n && (n.emails || []).find(x => x.id === id), r = npRec(blockId), m = e && npMail(r, id);
  if(!e || m.sent || !r.planAt) return;
  const el = document.getElementById(`npm_${blockId}_${id}`), msg = document.getElementById(`npmm_${blockId}_${id}`), text = ((el && el.value) || m.body || "").trim();
  m.body = text.slice(0, 4000);
  const no = html => { m.tries++; persist(); if(msg) msg.innerHTML = `<b>Not sent.</b> ${html}`; };
  if(npWords(text) < 35) return no("An email this short cannot do the job. Work through the list above.");
  const bad = (e.forbid || []).filter(x => npHit([x.match], text));
  if(bad.length) return no(`<ul>${bad.map(x => `<li>${E(x.why)}</li>`).join("")}</ul>`);
  const missing = e.required.filter(q => !npHit(q.match, text));
  if(missing.length) return no(`It leaves out:<ul>${missing.map(q => `<li>${E(q.label)} — ${E(q.hint)}</li>`).join("")}</ul>`);
  m.sent = new Date().toISOString(); persist();
  if(typeof toast === "function") toast("Sent. The reply is in the thread.");
  npRepaint(blockId);
};
window.cmCaseFlow.npCall = function(blockId){ const o = document.getElementById("cf-np"); if(o) o.remove(); persist(); cmCaseFlow.call(blockId); };
window.cmCaseFlow.tool = function(id, blockId){
  if(id === "call" && blockId && SIM.calls[blockId]) return cmCaseFlow.call(blockId);
  if(id === "netsheet" && typeof openPane === "function"){   // the firm's Net Sheet (net-sheet.html), over the slide at full width (its ledger is wide), checked at this step's stage
    const st = NET_STAGE[blockId] || "final";
    openPane("netsheet", new URL(`net-sheet.html?stage=${st}${DATES ? "&year=" + DATES.year : ""}`, location.href).href, `LSH Net Sheet · ${st === "litigation" ? "Track B (case won)" : "Track A (settled)"}`, "📊", "full");
    return;
  }
  if(PAGE[id]){   // one of the course's own pages: go there, with a way back to this slide
    const d = MODULES.find(x => x.lessons.some(l => l.cf.block.id === blockId)) || MODULES.find(x => x.id === state.dayId);
    state.cfReturn = d ? {dayId: d.id, n: d.cf.n, slide: typeof state.lessonSlide === "number" ? state.lessonSlide : null, view: state.view} : null;
    goto.apply(null, PAGE[id]);
    return;
  }
  if(typeof openTool === "function") openTool(id === "call" ? "calls" : id, "split", emailTarget(id, blockId) || undefined);   // a training platform, beside the slide (⧉ Side by side; 🖥 Second screen)
};
/* a step's 📁 Documents link: open the slide's Work From list and bring it into view */
window.cmCaseFlow.workFrom = function(el){
  const box = el && el.closest(".cfx-task") && el.closest(".cfx-task").querySelector(".cfx-docs");
  if(!box){ cmCaseFlow.tool("docs"); return; }
  box.open = true; box.scrollIntoView({block: "nearest", behavior: "smooth"});
  box.classList.remove("cfx-flash"); void box.offsetWidth; box.classList.add("cfx-flash");
};
/* a theory card's ＋ More: the detail that doesn't fit on the card (theory-dN.json concepts[].more), in a pop-up card */
window.cmCaseFlow.more = function(blockId, i){
  const t = (SLIDES[blockId] || {}).theory, x = t && t.concepts[i]; if(!x || !(x.more || []).length) return;
  const o = document.createElement("div"); o.className = "cfx-modal cfx-more"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", x.term);
  o.innerHTML = `<div class="cfx-modal-in card lesson-card"><div class="cfx-modal-h"><b>${E(x.term)}</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <p class="cfx-more-lead">${hl(x.text)}</p><ul>${x.more.map(m => `<li>${hl(m)}</li>`).join("")}</ul></div>`;
  const close = () => { o.remove(); document.removeEventListener("keydown", esc, true); };
  const esc = e => { if(e.key === "Escape"){ e.stopPropagation(); close(); } };
  o.addEventListener("click", e => { if(e.target === o || e.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o); o.querySelector(".cfx-modal-h button").focus();
};
window.cmCaseFlow.back = function(){
  const r = state.cfReturn; state.cfReturn = null;
  syncReturn();
  if(!r) return;
  if(r.view !== "day"){ goto(r.view); return; }
  goto("day", r.dayId);
  setTimeout(() => { state.dayViewMode = "slides"; if(typeof goToSlide === "function" && r.slide != null) goToSlide(r.slide); }, 0);
};
/* ---------- Admin: where an admin lands, and the tabs grouped in sections ----------
   An admin who opens the course (from the Main Portal, or a link with no page in it) lands on the Admin screen,
   not the trainee dashboard; a link to a page (#/day/…, #/admin, …) still opens that page, and once they've moved
   on, the Dashboard is theirs to open. The Admin screen's nine tabs are grouped as in Foundational Training: a
   row of sections, then the open section's tabs. A tab not listed goes under Admin Master Control. */
const BOOT_HASH = String(location.hash || "").replace(/^#\/?/, "");
let adminLanded = !!BOOT_HASH;
function adminLanding(){
  if(adminLanded || !state.isAdmin || state.adminPreview) return;
  if(state.view === "dashboard"){ adminLanded = true; setTimeout(() => { if(state.view === "dashboard") goto("admin"); }, 0); }
  else if(!["login", "pendingApproval"].includes(state.view)) adminLanded = true;
}
const ADMIN_GROUPS = [
  {id: "admin", label: "🛡 Admin Master Control", tabs: ["audit", "batches", "rankings", "tfeedback"]},
  {id: "modules", label: "📚 Training Modules", tabs: ["sop", "cues", "studio"]},
  {id: "activities", label: "📋 Activities", tabs: ["activities", "fbstyle"]}
];
const adminGroupOf = tab => (ADMIN_GROUPS.find(g => g.tabs.includes(tab)) || ADMIN_GROUPS[0]).id;
function groupAdminTabs(out){
  const a = out.indexOf('<div class="admin-tabs"'); if(a < 0) return out;
  const b = out.indexOf("</div>", a) + 6;
  const t = document.createElement("template"); t.innerHTML = out.slice(a, b);
  const tabs = [...t.content.querySelectorAll(".admin-tab-btn")].map(x => ({id: ((x.getAttribute("onclick") || "").match(/setAdminTab\('([^']+)'\)/) || [])[1], html: x.outerHTML})).filter(x => x.id);
  if(!tabs.length) return out;
  const cur = adminGroupOf(state.adminTab || "audit");
  const secs = ADMIN_GROUPS.map(g => ({g, tabs: tabs.filter(x => adminGroupOf(x.id) === g.id)})).filter(x => x.tabs.length);
  const open = secs.find(x => x.g.id === cur) || secs[0];
  const bar = `<div class="admin-tabs cf-admin-tabs"><div class="cf-admin-secs">${secs.map(x => `<button type="button" class="cf-admin-sec${x === open ? " active" : ""}" onclick="setAdminTab('${x.tabs[0].id}')">${x.g.label}<span>${x.tabs.length}</span></button>`).join("")}</div>
    <div class="cf-admin-row">${open.tabs.map(x => x.html).join("")}</div></div>`;
  return out.slice(0, a) + bar + out.slice(b);
}
/* the way back: a pill on the course page a step opened, until the trainee goes back or elsewhere in the Case Flow;
   after an activity worked in the Action Plan Editor, a second one carries on to the next step */
function syncReturn(){
  let pill = document.getElementById("cf-return"), go = document.getElementById("cf-return-next");
  const r = state.cfReturn, show = !!r && state.view !== "day";
  if(r && state.view === "day") state.cfReturn = null;
  if(!show){ if(pill) pill.hidden = true; if(go) go.hidden = true; return; }
  if(!pill){ pill = document.createElement("button"); pill.id = "cf-return"; pill.type = "button"; pill.onclick = () => cmCaseFlow.back(); document.body.appendChild(pill); }
  pill.textContent = r.view === "day" ? `← Back to Case Flow Day ${r.n}` : "← Back to the Case Flow";
  pill.hidden = false;
  if(r.next == null){ if(go) go.hidden = true; return; }
  if(!go){ go = document.createElement("button"); go.id = "cf-return-next"; go.type = "button"; go.onclick = () => cmCaseFlow.onward(); document.body.appendChild(go); }
  go.textContent = `Next: ${r.nextLabel} →`;
  go.hidden = false;
}
/* ---------- Next after an Action Plan activity: the live draft in the editor, then the next step ----------
   On the last slide of a Skill Activity worked in the Action Plan Editor (the Live Case Plan Draft, the warning
   letter, the demand and memo drafts), Next opens the editor, where "Next: …" carries on to the activity after it
   (or the day's Knowledge Check). Presenting, the console does it only on the day's last slide, so the shared
   slides window isn't closed mid-day; there, with no draft to open, Next goes on to the Knowledge Check. */
const PLAN_TOOL = /^\s*Action Plan Editor/i;
function planStop(d, idx){
  const slides = buildDaySlides(d), x = slides[idx], nx = slides[idx + 1]; if(!x) return null;
  const l = d.lessons[x.lessonIndex], b = l && l.cf && l.cf.block;
  if(!b || b.kind !== "activity" || !PLAN_TOOL.test((b.act && b.act.tool) || "") || (nx && nx.lessonIndex === x.lessonIndex)) return null;
  return {b, next: nx ? idx + 1 : "kc", nextLabel: nx ? String(daySlideTitle(d, nx)).replace(/<[^>]+>/g, "") : "Knowledge Check"};
}
function openPlanStop(d, idx, stop){
  state.cfReturn = {dayId: d.id, n: d.cf.n, slide: idx, view: "day", next: stop.next, nextLabel: stop.nextLabel};
  goto.apply(null, PAGE.plan);
  if(typeof toast === "function") toast(`📝 ${stop.b.title}: draft it here, then Next.`);
}
window.cmCaseFlow.onward = function(){
  const r = state.cfReturn; state.cfReturn = null; syncReturn();
  if(!r) return;
  goto("day", r.dayId);
  setTimeout(() => {
    if(r.next === "kc"){ state.dayViewMode = "knowledgeCheck"; render(); window.scrollTo({top: 0}); }
    else { state.dayViewMode = "slides"; if(typeof goToSlide === "function") goToSlide(r.next); }
  }, 0);
};
const onLastPage = () => !((state.slidePages || 1) > 1 && (state.slidePage || 0) < state.slidePages - 1);
["nextSlide", "goToKnowledgeCheckWithInterstitial"].forEach(fn => {
  const orig = window[fn]; if(typeof orig !== "function") return;
  window[fn] = function(){
    const d = cfDay(state.dayId), idx = state.lessonSlide || 0, stop = d && state.view === "day" && onLastPage() && planStop(d, idx);
    if(stop){ openPlanStop(d, idx, stop); return; }
    return orig.apply(this, arguments);
  };
});
if(typeof window.presenterStep === "function"){
  const __step = window.presenterStep;
  window.presenterStep = function(dir){
    const d = cfDay(state.dayId);
    if(dir > 0 && d){
      const total = buildDaySlides(d).length, idx = state.lessonSlide || 0, lastPage = (state.presentPage || 0) >= (state.presentPages || 1) - 1;
      if(lastPage && idx === total - 1){
        const stop = planStop(d, idx);
        if(stop){ openPlanStop(d, idx, stop); return; }
        if(typeof goToKnowledgeCheckWithInterstitial === "function"){ if(typeof presenterEnd === "function") presenterEnd(true); goToKnowledgeCheckWithInterstitial(); return; }
      }
    }
    return __step.apply(this, arguments);
  };
}
/* The presenter: a Case Manager in the course's illustration style (navy blazer, LSH badge, tablet), gesturing to the slide. */
const PRESENTER_SVG = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 240 430" role="presentation">'
  + '<ellipse cx="124" cy="418" rx="78" ry="9" fill="#1F2A44" opacity=".18"/>'
  + '<path d="M28 132v14M21 139h14" stroke="#F4B77A" stroke-width="3" stroke-linecap="round"/><circle cx="20" cy="186" r="4" fill="#E07A1F"/><circle cx="208" cy="70" r="5" fill="#F4B77A"/><path d="M214 118v10M209 123h10" stroke="#E07A1F" stroke-width="2.5" stroke-linecap="round"/>'
  + '<rect x="98" y="250" width="22" height="152" rx="9" fill="#1F2A44"/><rect x="126" y="250" width="22" height="152" rx="9" fill="#262B45"/>'
  + '<rect x="88" y="396" width="34" height="13" rx="6.5" fill="#1F2A44"/><rect x="124" y="396" width="34" height="13" rx="6.5" fill="#1F2A44"/>'
  + '<path d="M94 92Q90 54 122 52Q154 52 150 92Q153 122 142 134L104 134Q90 122 94 92Z" fill="#2A1F1A"/>'
  + '<rect x="115" y="110" width="15" height="20" rx="6" fill="#C98B5E"/>'
  + '<path d="M84 156Q84 132 108 128L136 128Q160 132 160 156L164 262Q122 274 80 262Z" fill="#3B4A6B"/>'
  + '<path d="M110 128L122 156L134 128Z" fill="#FFFFFF"/>'
  + '<path d="M108 128L122 164L113 172L96 136Z" fill="#2C3758"/><path d="M136 128L122 164L131 172L148 136Z" fill="#2C3758"/>'
  + '<path d="M114 132L122 182L130 132" fill="none" stroke="#E07A1F" stroke-width="3" stroke-linejoin="round"/>'
  + '<rect x="113" y="180" width="18" height="23" rx="3" fill="#FFFFFF" stroke="#8A93A8" stroke-width="1.5"/><rect x="116" y="184" width="12" height="4" rx="1" fill="#E07A1F"/><rect x="116" y="191" width="12" height="2.5" rx="1" fill="#C9CFE0"/><rect x="116" y="196" width="8" height="2.5" rx="1" fill="#C9CFE0"/>'
  + '<path d="M90 150L66 204L40 166" fill="none" stroke="#3B4A6B" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>'
  + '<path d="M32 152Q30 140 38 142L41 154L44 140Q48 136 50 142L49 158Q48 170 40 172Q32 170 32 160Z" fill="#C98B5E"/>'
  + '<path d="M154 150L166 208L140 222" fill="none" stroke="#3B4A6B" stroke-width="19" stroke-linecap="round" stroke-linejoin="round"/>'
  + '<g transform="rotate(-10 132 226)"><rect x="110" y="198" width="46" height="60" rx="6" fill="#1F2A44"/><rect x="115" y="204" width="36" height="46" rx="3" fill="#DCE6F5"/><rect x="119" y="209" width="20" height="4" rx="2" fill="#E07A1F"/><rect x="119" y="217" width="28" height="3" rx="1.5" fill="#8A93A8"/><rect x="119" y="224" width="24" height="3" rx="1.5" fill="#8A93A8"/><rect x="119" y="231" width="28" height="3" rx="1.5" fill="#8A93A8"/><path d="M120 241l5 5 9-10" fill="none" stroke="#2F8F5B" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></g>'
  + '<circle cx="140" cy="222" r="9.5" fill="#C98B5E"/>'
  + '<circle cx="122" cy="90" r="25" fill="#C98B5E"/>'
  + '<path d="M97 86Q100 60 124 60Q146 61 148 86Q132 74 112 80Q104 84 97 86Z" fill="#2A1F1A"/>'
  + '<circle cx="113" cy="93" r="2.4" fill="#1F2A44"/><circle cx="131" cy="93" r="2.4" fill="#1F2A44"/>'
  + '<path d="M109 86q4-3 8 0M127 86q4-3 8 0" fill="none" stroke="#2A1F1A" stroke-width="1.8" stroke-linecap="round"/>'
  + '<path d="M114 103Q122 109 130 103" fill="none" stroke="#7A4A32" stroke-width="2.2" stroke-linecap="round"/>'
  + '<circle cx="97" cy="100" r="3" fill="#F4B77A"/><circle cx="147" cy="100" r="3" fill="#F4B77A"/>'
  + '</svg>';
/* A Case Flow slide is one card: the dots and the slide go in .cf-stage-card (the dots beside the slide's title), the full width of the stage, and
   Previous / Next sit under it (the presenter stands in the side column, sidePresenter()). Everything stays inside #lessonStage, so full screen and the slide's fit still work. */
function cfStage(html){
  if(typeof html !== "string" || html.indexOf("cfx-deck") < 0 || html.indexOf("stage-body") < 0) return html;
  const t = document.createElement("template"); t.innerHTML = html;
  const body = t.content.querySelector(".stage-body");
  if(!body || !body.querySelector(".cfx-deck") || body.closest(".cf-stage-card")) return html;
  const card = document.createElement("div"); card.className = "cf-stage-card";
  const dots = body.previousElementSibling && body.previousElementSibling.classList.contains("slide-dots") ? body.previousElementSibling : null;
  if(dots && dots.children.length){   // one thin progress line, the same on every day (no rows of dots that change the title's room)
    const n = dots.children.length, at = [...dots.children].findIndex(x => x.classList.contains("active"));
    dots.classList.add("cf-dots-bar"); dots.title = `Step ${at + 1} of ${n}`;
    dots.innerHTML = `<span class="cf-dots-fill" style="width:${((at + 1) / n * 100).toFixed(1)}%"></span>`;
  }
  body.before(card); if(dots) card.appendChild(dots); card.appendChild(body);
  const head = body.querySelector(".cfx-deck-head");   // the title and the progress dots share the top row
  if(dots && head){ dots.classList.add("cf-head-dots"); head.appendChild(dots); }
  body.querySelectorAll(":scope > .stage-presenter").forEach(x => x.remove());
  return t.innerHTML;
}
/* the one presenter: in the lesson's side column, under its controls (shown only beside a Case Flow slide) */
function sidePresenter(){
  const main = document.querySelector("main");
  if(!main || !main.querySelector(":scope > #lessonStage")) return;
  let who = main.querySelector(":scope > .cf-side-presenter");
  if(!who){ who = document.createElement("div"); who.className = "cf-side-presenter"; who.setAttribute("aria-hidden", "true"); who.innerHTML = PRESENTER_SVG; main.appendChild(who); }
  sizePresenter(who, main);
}
// the figure takes the room left under the controls, never more (the page fits one screen), and steps aside when
// there's too little for it
function sizePresenter(who, main){
  who.style.width = ""; who.style.visibility = "";
  if(getComputedStyle(who).display === "none") return;
  const cs = getComputedStyle(main), room = main.getBoundingClientRect().bottom - (parseFloat(cs.paddingBottom) || 0) - (parseFloat(cs.borderBottomWidth) || 0) - who.getBoundingClientRect().top - 12;
  const svg = who.querySelector("svg"), ratio = svg && svg.viewBox && svg.viewBox.baseVal && svg.viewBox.baseVal.width ? svg.viewBox.baseVal.height / svg.viewBox.baseVal.width : 1.68;
  const w = Math.min(190, Math.floor(room / ratio));
  if(w < 70){ who.style.visibility = "hidden"; who.style.width = "0px"; } else who.style.width = w + "px";
}
let __spT; addEventListener("resize", () => { clearTimeout(__spT); __spT = setTimeout(() => { const m = document.querySelector("main"), w = m && m.querySelector(":scope > .cf-side-presenter"); if(w) sizePresenter(w, m); }, 150); });
if(typeof window.renderDaySlideshow === "function"){
  const __rds = window.renderDaySlideshow;
  window.renderDaySlideshow = function(){ return cfStage(__rds.apply(this, arguments)); };
}
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ syncReturn(); sidePresenter(); kcFit(); fitFileCols(); adminLanding(); yearInSide(); }catch(e){} return r; };
}
/* Check Your Work: the reference of what the trainee did in the tool (a CMS Case ID, a docket or request number),
   kept on their record and shown to their trainer with the module's Learning Check */
/* A trainee has one CMS Case ID (the file they open in the CMS): it is logged once, on the first Skill Activity worked
   in the CMS; the other tools' references (a docket or request number) are logged where that work happens. */
const workTool = b => blockTools(b).filter(id => id !== "call" && !PAGE[id])[0] || "cms";
let FIRST_CMS = null;
const firstCmsActivity = () => FIRST_CMS || (FIRST_CMS = (MODULES.flatMap(d => d.lessons.map(l => l.cf.block)).find(x => x.kind === "activity" && workTool(x) === "cms") || {}).id);
function workLog(b){
  const main = workTool(b), t = typeof cmTool === "function" && cmTool(main);
  if(main === "cms" && b.id !== firstCmsActivity()) return "";
  const w = (REC.work || {})[b.id] || {};
  return `<div class="cfx-log" title="The reference of the work you did in ${E(TOOL[main].name)}"><b>🧾 Log Your Work</b>
    <input id="cflog_${b.id}" placeholder="${E((t && t.idHint) || "CMS Case ID or reference")}" value="${E(w.ref || (main === "cms" && window.CMCase ? CMCase.id() : ""))}" aria-label="Reference of your work in ${E(TOOL[main].name)}"${main === "cms" ? ' data-cms-id="1"' : ""}>${main === "cms" ? `<span class="cfx-log-from" data-cms-note>${window.CMCase && CMCase.id() ? "from the CMS" : ""}</span>` : ""}
    <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.logWork('${b.id}','${main}')">Log it</button>
    <span class="cfx-log-ok" id="cflogok_${b.id}">${w.at ? `✓ Logged ${E(new Date(w.at).toLocaleDateString())}` : ""}</span></div>`;
}
window.cmCaseFlow.logWork = function(blockId, tool){
  const el = document.getElementById("cflog_" + blockId);
  // nothing typed on a CMS step: the case open in the CMS (js/cm-cms-case.js)
  const ref = (((el && el.value || "").trim()) || (tool === "cms" && window.CMCase ? CMCase.id() : "")).slice(0, 120);
  if(el && ref && el.value.trim() !== ref) el.value = ref;
  if(!ref){ if(typeof toast === "function") toast("Add the reference of your work first: the CMS Case ID, docket or request number."); return; }
  REC.work = REC.work || {}; REC.work[blockId] = {ref, tool, at: new Date().toISOString()}; persist();
  const ok = document.getElementById("cflogok_" + blockId); if(ok) ok.textContent = "✓ Logged " + new Date().toLocaleDateString();
  if(typeof toast === "function") toast("Logged. Your trainer sees it with this module's Learning Check.");
};
/* while a Case Flow call is live, the caller and the reviewer know John Doe v. Robert Smith, never the earlier Apex file */
if(typeof window.callAIText === "function"){
  const __ai = window.callAIText;
  window.callAIText = function(prompt){
    const s = typeof state !== "undefined" && state.rpSession;
    if(s && s.cf && typeof prompt === "string"){
      let p = typeof CLIENT_DOSSIER_MD === "string" ? prompt.split(CLIENT_DOSSIER_MD).join(caseDossier()) : prompt;
      p = p.replace(/John Doe v\. Apex[^\n)]*/g, "John Doe v. Robert Smith");
      arguments[0] = p;
    }
    return __ai.apply(this, arguments);
  };
}
if(typeof window.renderOpenRoleplay === "function" || typeof renderOpenRoleplay === "function"){
  const __rp = renderOpenRoleplay;
  renderOpenRoleplay = function(){
    const s = state.rpSession, html = __rp.apply(this, arguments);
    if(!s || !s.cf) return html;
    const d = cfDay(s.cf.dayId);
    return `<div class="cf-call-bar"><button class="btn btn-navy btn-sm" onclick="cmCaseFlow.callBack()">← Back to Case Flow Day ${d ? d.cf.n : ""}</button>
      <span>📞 A live call on <b>${E(CF.case.style)}</b>. Speak or type as the Case Manager, then <b>End &amp; Get Debrief</b>; your call counts once you've replied.</span></div>`
      + html.replace(/<button class="btn btn-ghost btn-sm" style="margin-bottom:14px;" onclick="rpExitToHub\(\)">&larr; Back to Dashboard<\/button>/, "");
  };
}
/* ---------- the Practice Lab: one slide per module ----------
   Where the day's tools open, once: the CMS and every other platform its Skill Activities use (the Net Sheet, LOR
   Drafting, ChartSwap, the Docket and E-Filing platforms, the Case Documents). The activity slides that follow say
   where each step is done without repeating the buttons; a live call is taken from its own activity's Your Task. */
function labTools(d){
  const at = {};
  d.lessons.forEach(l => { const b = l.cf.block; if(b.kind === "activity") blockTools(b).concat(SIM.calls[b.id] ? ["call"] : []).forEach(id => { if(!at[id]) at[id] = b.id; }); });
  if(typeof relatedTools === "function" && relatedTools(d.id).some(t => t.id === "calendar") && !at.calendar) at.calendar = "";
  const order = TOOLKIT.map(t => t.id);
  return Object.entries(at).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}
function practiceLab(d){
  const acts = d.lessons.map((l, li) => [l, li]).filter(([l]) => l.cf.block.kind === "activity");
  const ph = d.cf.phases[0] || {title: ""};
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; ${E(String(ph.lead || "").toUpperCase())} &middot; PRACTICE LAB</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-lab">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">🧪 Practice Lab</h2></div>
      <div class="cfx-ribbon"><span>${E(titleCase(ph.title))}</span></div>
      <div class="cfx-top"><span class="cfx-title cfx-pill"><span class="cfx-vi">🧪</span>Open Your Tools</span></div>
      <div class="cfx-body"><div class="cfx-sheet">
        <p class="cfx-lab-lead">Open your tools here, once: they stay open beside the slides. Today's <b>${acts.length} Skill Activities</b> come straight after the lessons they practise, on John Doe's file, in the order the work happens. Each opens with <em>Your Case</em>, then <em>Your Task</em> and <em>Check Your Work</em>; 📞 marks a live call.</p>
        <div class="cfx-lab-tools" id="cfxLabTools${d.id}">${labTools(d).map(([id, bid]) => toolChip(id, bid, true)).join("")}</div>
        <ol class="cfx-lab-list">${acts.map(([l, li], k) => { const b = l.cf.block;
          return `<li><button type="button" onclick="cmCaseFlow.labGo(${d.id},${li})" title="Go to this activity's slides"><span class="n">${k + 1}</span><span class="t">${E(titleCase(b.title))}</span>${SIM.calls[b.id] ? `<span class="c" title="Live call">📞</span>` : ""}${!isTrainer() && actDone(b.id) ? `<span class="ok" title="Worked">✓</span>` : ""}</button></li>`; }).join("")}</ol>
      </div></div>
    </div>`;
}
/* Ready for the Knowledge Check? After the module's last Skill Activity, right before the Knowledge Check: three
   key-concept questions, one from each of the day's first three modules (their Knowledge Check pools). A wrong answer
   shows the reason and can be tried again; nothing is locked, it is the trainee's own last look before the check. */
function labQuestions(d){
  const mods = [];
  (d.lessons || []).map(l => l.cf && l.cf.block && l.cf.block.id).filter(Boolean).forEach(id => {
    const m = CF.days.flatMap(x => x.modules).find(x => x.blocks.some(b => b.id === id)); if(m && !mods.includes(m)) mods.push(m); });
  return mods.filter(m => (m.quiz || []).length).slice(0, 3).map(m => m.quiz[0]);
}
function readyCheck(d){
  const qs = labQuestions(d), ph = d.cf.phases[0] || {title: ""};
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; ${E(String(ph.lead || "").toUpperCase())} &middot; READY FOR THE KNOWLEDGE CHECK?</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-lab cfx-ready">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">🎯 Ready for the Knowledge Check?</h2></div>
      <div class="cfx-ribbon"><span>${E(titleCase(ph.title))}</span></div>
      <div class="cfx-top"><span class="cfx-title cfx-pill"><span class="cfx-vi">🎯</span>${qs.length} Key Concepts</span></div>
      <div class="cfx-body"><div class="cfx-sheet">
        <div class="cfx-lab-gate" id="cfxLabGate${d.id}"><b>You've worked today's Skill Activities.</b> Before you check your work, answer these ${qs.length} key concepts from today's lessons.
        ${qs.map((q, qi) => `<div class="cfx-lab-q" data-q="${qi}"><span>${qi + 1}. ${E(q.q)}</span><div class="o">${q.opts.map((o, oi) =>
          `<button type="button" onclick="cmCaseFlow.labGate(${d.id},${qi},${oi},this)">${E(o)}</button>`).join("")}</div><div class="r" hidden></div></div>`).join("")}
        <p class="cfx-ready-done" hidden>✓ All ${qs.length} right. Next: the Knowledge Check.</p></div>
      </div></div>
    </div>`;
}
window.cmCaseFlow.labGate = function(dayId, qi, oi, btn){
  const d = cfDay(dayId), q = d && labQuestions(d)[qi], row = btn && btn.closest(".cfx-lab-q");
  if(!q || !row) return;
  const ok = oi === q.a, r = row.querySelector(".r");
  row.querySelectorAll("button").forEach(b => b.classList.remove("no"));
  btn.classList.add(ok ? "ok" : "no");
  if(ok){ row.classList.add("done"); row.querySelectorAll("button").forEach(b => { b.disabled = true; }); }
  r.hidden = false; r.textContent = ok ? "✓ " + q.r : "Not quite. " + q.r + " Try again.";
  const gate = row.closest(".cfx-lab-gate");
  if(gate && gate.querySelectorAll(".cfx-lab-q").length === gate.querySelectorAll(".cfx-lab-q.done").length){
    gate.classList.add("passed");
    const done = gate.querySelector(".cfx-ready-done"); if(done) done.hidden = false;
  }
};
window.cmCaseFlow.labGo = function(dayId, li){
  const d = cfDay(dayId), slides = d && typeof buildDaySlides === "function" ? buildDaySlides(d) : [];
  const idx = slides.findIndex(sl => sl.type === "topic" && sl.lessonIndex === li && sl.part === 1);
  if(idx >= 0 && typeof goToSlide === "function") goToSlide(idx);
};
if(typeof presenterCues === "function"){   // Presenter view: the trainer's notes for the Training Agenda and the Practice Lab slides
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    if(slide && slide.type === "readyCheck" && cfDay(d && d.id)) return `<h3>Ready for the Knowledge Check?</h3><p>The day's Skill Activities are done. Give the room a couple of minutes on these ${labQuestions(d).length} key concepts, one from each of today's first modules: a wrong answer shows the reason and can be tried again. Then open the Knowledge Check.</p>`;
    if(slide && slide.type === "taskOverview" && cfDay(d && d.id)){
      const a = agendaNotes(d);
      return `<h3>Training Agenda</h3><div class="pn-part">🎙 Script — read aloud</div><p>${E(a.say)}</p>${a.ask ? `<p><b>Ask:</b> ${E(a.ask)}</p>` : ""}`;
    }
    if(!(slide && slide.type === "practiceLab" && cfDay(d && d.id))) return __cues.apply(this, arguments);
    const n = d.lessons.filter(l => l.cf.block.kind === "activity").length;
    return `<h3>Practice Lab</h3><p>Have everyone open the tools from this slide now, the CMS first, so they stay open beside the slides. Today's ${n} Skill Activities each come straight after the lessons they practise: each opens with Your Case, then Your Task and Check Your Work. Live calls are taken from their own activity.</p><p>Anyone stuck on one step for more than ten minutes: help them log what they have and move on. The debrief is where it lands.</p>`;
  };
}
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    if(slide && slide.type === "practiceLab" && cfDay(d && d.id)) return practiceLab(d);
    if(slide && slide.type === "readyCheck" && cfDay(d && d.id)) return readyCheck(d);
    return (slide && slide.type === "taskOverview" && cfDay(d && d.id)) ? agendaSlide(d) : __content.apply(this, arguments);
  };
}
if(typeof daySlideTitle === "function"){
  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){
    if(cfDay(d && d.id) && slide && slide.type === "taskOverview") return "Training Agenda";
    if(cfDay(d && d.id) && slide && slide.type === "practiceLab") return "Practice Lab";
    if(cfDay(d && d.id) && slide && slide.type === "readyCheck") return "Ready for the Knowledge Check?";
    if(cfDay(d && d.id) && slide && slide.type === "topic"){ const l = d.lessons[slide.lessonIndex]; const v = viewsOf(l.cf.block)[(slide.part || 1) - 1]; return `${l.h} — ${VIEW_LABEL[v] || ""}`; }
    return __title.apply(this, arguments);
  };
}
if(typeof slideScript === "function"){   // Presenter view: each slide has its own script (p1, p2, … pN below)
  const __script = slideScript;
  slideScript = function(d, l, part){
    const n = l && l.cf && (window.SLIDE_SCRIPTS || {})[`${d.id}::${l.h}`];
    const h = n && n["p" + (part || 1)];
    if(!h) return __script.apply(this, arguments);
    const k = `${d.id}::${l.h}::${part || 1}`;
    return {why: h.why || "", talk: named(h.talk || "", k), walk: h.walk || [], ask: named(h.ask || "", k + "?"), scenario: h.scenario || "", hand: true};
  };
}
/* The scripts call on trainees by name: each {name} becomes a first name from the batch being taught (Trainee
   Audit's batch filter, else the newest batch), and [Trainee] until the roster has loaded. The same slide always
   calls the same people, so a re-drawn console doesn't change who was called; the next {name} moves on. */
let rosterAsked = false;
function roster(){
  const rs = (state.adminData || []).filter(r => r && r.approved === true && !r.archived && r.name);
  if(!rs.length && state.isAdmin && !rosterAsked && typeof loadAdminLedgerQuiet === "function"){ rosterAsked = true; loadAdminLedgerQuiet().catch(() => {}); }
  const day = b => { const m = /^B(\d\d)(\d\d)(\d\d)$/.exec(String(b || "").trim().toUpperCase()); return m ? +(m[3] + m[1] + m[2]) : -1; };
  const key = r => String(r.batch || "").trim().toUpperCase();
  const pick = state.adminBatchFilter ? String(state.adminBatchFilter).trim().toUpperCase() : rs.map(key).sort((a, b) => day(b) - day(a))[0];
  return [...new Set(rs.filter(r => key(r) === pick).map(r => String(r.name).trim().split(/\s+/)[0]))].sort();
}
function named(s, k){
  if(!/\{name\}/.test(s)) return s;
  const rs = roster(); let h = 0; for(const c of k) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  let i = 0; return s.replace(/\{name\}/g, () => rs.length ? rs[(h + i++) % rs.length] : "[Trainee]");
}

/* ---------- Presenter view: the speaker notes, as this course's slide scripts ---------- */
window.SLIDE_SCRIPTS = window.SLIDE_SCRIPTS || {};
window.cmCaseFlow = window.cmCaseFlow || {}; window.cmCaseFlow.viewsOf = b => viewsOf(b);   // a block's slides, in order (the scripts' keys)
MODULES.forEach(d => d.lessons.forEach(l => {
  const b = l.cf.block, n = b.notes || [], vs = viewsOf(b), best = (b.best || []).map(x => String(x).replace(/^pitfall:\s*/i, "Watch for this: "));
  const per = {   // one script per slide (view); the block's speaker notes spread across its slides
    why: {why: b.tell && b.tell.why, talk: n[0] || ""},
    theory: theoryOf(b) ? {why: String(theoryOf(b).lead).replace(/\*\*/g, ""), walk: theoryOf(b).concepts.slice(0, theoryOf(b).concepts.length > TH_PER ? Math.ceil(theoryOf(b).concepts.length / 2) : TH_PER).map(x => `${x.term}: ${String(x.text).replace(/\*\*/g, "")}`), ask: "Which of these have you met before, and where would it show up on John Doe's file?"} : {},
    theory2: theoryOf(b) ? {why: "The theory, continued.", walk: theoryOf(b).concepts.slice(Math.ceil(theoryOf(b).concepts.length / 2)).map(x => `${x.term}: ${String(x.text).replace(/\*\*/g, "")}`)} : {},
    frame: theoryOf(b) && theoryOf(b).framework ? {why: theoryOf(b).framework.title, walk: (theoryOf(b).framework.rows || []).map(r => r.map(x => String(x).replace(/\*\*/g, "")).join(" · ")).concat((theoryOf(b).framework.steps || []).map(x => `${x.label}: ${String(x.text).replace(/\*\*/g, "")}`)), ask: "Walk the room through it on John Doe's file: where is he on this right now?"} : {},
    doc: (SLIDES[b.id] || {}).document ? {why: `${SLIDES[b.id].document.name}: what it is, why the law cares, what it proves, and how you handle it.`, walk: ["definition", "purpose", "evidence"].map(k => String(SLIDES[b.id].document[k]).replace(/\*\*/g, "")).concat(SLIDES[b.id].document.handling.map(x => String(x).replace(/\*\*/g, "")))} : {},
    map: roadmapOf(b) ? {why: roadmapOf(b).title, walk: roadmapOf(b).steps.map(x => `${x.label}: ${String(x.text).replace(/\*\*/g, "")}`)} : {},
    rules: {why: "The rules, and where the Case Manager's role ends.", walk: ((b.tell && b.tell.rules) || []).concat((b.tell && b.tell.upl) || []), ask: n[1] || ""},
    model: {why: (b.show && b.show.caption) || "The model to follow.", talk: b.visual || ""},
    job: {why: "Trigger ➔ Task ➔ Tool ➔ Checkpoint: how it runs on the job.", walk: (b.ops || []).map(r => r.join(" ➔ "))},
    grade: (SLIDES[b.id] || {}).grade ? {why: SLIDES[b.id].grade.title, walk: ["Guidelines: " + SLIDES[b.id].grade.guide.join("; "), "Standard inclusions: " + SLIDES[b.id].grade.include.join("; "), "Steps: " + SLIDES[b.id].grade.steps.join("; ")].map(x => x.replace(/\*\*/g, ""))} : {},
    dodont: {why: "How this block is graded, and what to watch for.", talk: n.slice(2).join(" "), walk: best},
    case: {why: b.act && b.act.scenario, talk: [SIM.events[b.id] ? (SIM.events[b.id].channel === "voicemail" && SIM.events[b.id].spoken ? `A voicemail just landed on the file (${SIM.events[b.id].date}). ${notesOf(b.id) ? "Play it, transcribe it and write the action plan in the Notes & Action Plan (each graded, with its answer key), then work the plan: the emails and the call." : "Play it, take notes as you would at your desk, and check them before you act."}` : `What just landed on the file (${SIM.events[b.id].date}): ${SIM.events[b.id].subject}. ${SIM.events[b.id].body}`) : "", n[0] || ""].filter(Boolean).join(" ")},
    task: {why: b.act && b.act.prompt, walk: b.act ? [`Tool: ${b.act.tool}`, `Output: ${b.act.output}`].concat(SIM.calls[b.id] ? [`Live call: ${SIM.calls[b.id].who}. The trainee must: ${SIM.calls[b.id].goals.join("; ")}.`] : []) : [], ask: n[1] || ""},
    check: {why: "Check the work against the verification checkpoints.", talk: n.slice(2).join(" "), walk: ((b.act && b.act.checkpoints) || []).concat(best)},
    questions: {why: "Knowledge check: answers come from this file, in the trainee's own words, typed under each question.", walk: ((b.check && b.check.questions) || []).slice(0, KC_PER), talk: n[0] || ""},
    questions2: {why: "Knowledge check, continued.", walk: ((b.check && b.check.questions) || []).slice(KC_PER)},
    summary: {why: "Self-Summary: the principles, in the trainee's own words.", talk: n.slice(1).join(" "), scenario: d.discussionQuestion || ""},
    scale: {why: "Skill Scale: rate each competency 1–5, then submit for review.", ask: "Compare each trainee's self-rating with their score, and talk through any wide gap."}
  };
  // the trainer's own words for each slide (build/case-flow/scripts: js/cm-case-flow-scripts.js), said out loud;
  // a slide without one falls back to the script built above from the block
  const said = (window.CM_CF_SCRIPTS || {})[b.id] || {}, sc = {};
  vs.forEach((v, j) => {
    const x = per[v] || {}, h = said[v];
    sc["p" + (j + 1)] = h ? {why: "", talk: h.say, walk: [], ask: h.ask || "", scenario: x.scenario || ""}
      : {why: x.why || "", talk: x.talk || "", walk: x.walk || [], ask: x.ask || "", scenario: x.scenario || ""};
  });
  window.SLIDE_SCRIPTS[`${d.id}::${l.h}`] = sc;
}));

/* ---------- the SOP's run of show: the Case Flow day, as the trainer runs it ----------
   Admin → SOP Reference → a day: the day's Training Agenda turned into a timed plan (its Case Phases with each
   topic's discussion and the phase's Skill Activities and live call, the day's Knowledge Check game; a break and
   the end-of-day discussion when the agenda's spare minutes allow them),
   with what the trainer says at each step in their own words. The engine's run of show described the old course
   (dividers, Quick Checks, Skill Builders); the rest of the SOP page is unchanged. */
const lc1 = t => String(t || "").replace(/\.$/, "").replace(/^[A-Z](?=[a-z])/, c => c.toLowerCase());
// the objective's opening clause, said aloud; a setting clause first ("With Track A settled …", "On Track B") is skipped for the aim itself
const firstAim = d => lc1(String(d.objective || d.title).replace(/\s*\([^)]*\)/g, "").split(/,\s|;\s/).find(c => !/^(with|on|where)\b/i.test(c.trim())) || d.title);
const andList = xs => xs.length < 2 ? (xs[0] || "") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
if(typeof window.sopRunOfShow === "function"){
  const __ros = window.sopRunOfShow;
  window.sopRunOfShow = function(dRaw){
    const d = cfDay(dRaw && dRaw.id); if(!d) return __ros.apply(this, arguments);
    const sc = daySchedule(d), n = d.cf.n, game = GAMES[GAME_DAY[n]] || GAMES.millionaire, next = cfDayByN(n + 1);
    const titles = lectureParts(d).map(p => p.title);
    const steps = []; let t = 0;
    const add = (mins, x) => { steps.push(Object.assign({from: t, to: t + mins}, x)); t += mins; };
    add(15, {pre: true, title: "Before trainees join", do: [
      `Admin → <b>Trainee Audit</b>: approve anyone new and check everyone has Case Flow Day ${n} open (yesterday's Knowledge Check submitted).`,
      `Open Case Flow Day ${n} → slides → <b>🖥 Presenter view</b>, allow pop-ups, and in Google Meet share <b>“LSH Slides — share this window”</b>. Every slide has its read-aloud script in the console.`,
      `Keep John Doe's 📂 Case File and the CMS open in another tab: the room will ask where things are on the file.`]});
    add(5, {title: "Welcome and the Training Agenda", do: [`Put the Training Agenda slide up: it lists today's module, Lesson → Skill Building → … → Knowledge Check, with its topics, activities and minutes.`, n > 1 ? `Recap yesterday in a minute: where John Doe's file stood when we stopped, and the one thing most people found hard (check the Knowledge Check scores).` : `Introduce the file: John Doe v. Robert Smith, Atty. Elijah Thorne's case, the one file the whole week works.`],
      say: n === 1 ? `“Welcome, everyone. For the next five days you're the Case Manager on one real-looking file, John Doe v. Robert Smith. Today we work through ${andList(titles)}. By the end of the day you'll ${firstAim(d)}, and you'll have done it on the file yourselves.”`
        : `“Morning, everyone. Let's pick John Doe's file up where we left it. Today it's ${andList(titles)}. By the time we finish you'll ${firstAim(d)}.”`,
      watch: "Anyone who hasn't opened today's day yet: ask them to open it now so they can follow along."});
    // the module's lifecycle: each lesson segment, then its Skill Building (a break at the halfway point), then the Knowledge Check
    const segs = daySegments(d), mid = Math.ceil(segs.length / 2);
    let spare = sc.buffer, li = 0;
    segs.forEach((p, i) => {
      if(p.kind === "practice") practiceStep(p);
      else lessonStep(p, ++li);
      if(i === mid - 1 && i < segs.length - 1 && spare >= 10){ spare -= 10; add(10, {brk: true, title: "Break", do: ["Ten minutes. Tell the room the exact time you'll restart."], say: "“Let's take ten. We're back at the time on the screen, and we'll pick John Doe's file up right where we stopped.”"}); }
    });
    function lessonStep(p, i){
      const full = p.topics.filter(l => !l.cf.block.brief);
      add(p.mins, {title: `Lecture ${i + 1}: ${E(p.title)}`, do: [
        `${p.topics.length} topic${p.topics.length > 1 ? "s" : ""}${full.length ? `, about ${sc.per} minutes each` : ""}${p.briefs ? ` (${full.length ? "the condensed ones " : ""}${sc.brief} minutes each)` : ""} (tap a slide's 💬 chip for a countdown): ${p.topics.map(l => `<b>${E(titleCase(l.cf.block.title))}</b>`).join(" · ")}.`,
        full.length ? `Each topic runs Why It Matters, The Theory, The Framework, The Rules, See It, On the Job, then Do &amp; Don't: play <b>3 Clues, 1 Rule</b> with the room and let them call it before you reveal.` : `Each is a condensed overview: Why It Matters, The Rules and On the Job. Keep it to what the Case Manager does on the file.`,
        `Read the script in Presenter view as written or in your own words; take one or two answers per question, not a round of the room.`],
        say: `“Now we're into ${p.title}. Keep John Doe's file in your head the whole way through: everything on these slides is something you'll do on it in the Skill Building straight after.”`,
        watch: "Silence usually means it's too abstract: bring it back to John Doe's file and ask what they'd do next on it."});
    }
    function practiceStep(p){
    const pacts = p.items, calls = pacts.map(l => SIM.calls[l.cf.block.id]).filter(Boolean);
    add(p.mins, {title: `Skill Building: ${E(p.title)} · ${pacts.length} Skill Activit${pacts.length === 1 ? "y" : "ies"}`, do: [
      pacts.map(l => `<b>${E(l.cf.block.title)}</b> <span style="color:var(--ink-soft)">(${E(String(l.cf.block.act.tool || "").split("·")[0].trim())})</span>`).join(" · "),
      `Trainees work them on John Doe's file in the CMS or the tool each step names, beside the slide (⧉ Side by side), straight after the lesson they practise, then tick Check Your Work and log the reference.`,
      calls.length ? `📞 Live call${calls.length > 1 ? "s" : ""}: ${andList(calls.map(c => E(c.who)))}. Each starts from “Take the call” on the Your Task slide; let one trainee take it while the room listens, or everyone takes it at their desk.` : "",
      pacts.some(l => PLAN_TOOL.test(l.cf.block.act.tool || "")) ? `The Action Plan drafts: Next on the activity's last slide opens the editor, and “Next” there carries on.` : ""].filter(Boolean),
      say: pacts.length === 1 ? `“Your turn. Open John Doe's file and do this the way you would at your desk. I'm around, so shout if you get stuck, and log what you did before you move on.”`
        : `“Your turn. There are ${pacts.length} of these, in the order the work happens on the file, so pace yourselves. Work them the way you would at your desk, and shout if you get stuck.”`,
      watch: "Anyone stuck on one step for more than ten minutes: help them log what they have and move on. The debrief is where it lands."});
    }
    const lastSb = steps.filter(x => /^Skill Building/.test(x.title)).pop();
    if(lastSb && labQuestions(d).length) lastSb.do.push(`After the last activity, the <b>Ready for the Knowledge Check?</b> slide: ${labQuestions(d).length} key concepts from today's lessons, a couple of minutes, nothing locked.`);
    if(d.discussionQuestion && spare >= 18) add(8, {title: "End-of-day discussion", say: `“Before the Knowledge Check, let's step back and talk about this together: ${E(d.discussionQuestion)}”`, do: ["Take two or three answers and connect each one to a moment on John Doe's file from today."]});
    add(sc.kc, {title: `Knowledge Check · ${game.icon} ${E(game.name)}`, do: [
      `Trainees open the Knowledge Check from the last slide: ① today's game, ${E(game.name)}, then ② the module's takeaway, and one Submit.`,
      `70% marks the day complete. Below that it's a “not yet”: they can move on and retake it, and their best score counts.`],
      say: `“Last stretch for today. The Knowledge Check is a game, ${game.name}, and then a short takeaway, a few lines in your own words about what you will do differently. No looking at each other's screens.”`,
      watch: "Stop presenting while they answer, so nobody reads answers off the shared screen."});
    add(5, {title: "Close", do: [`Ask everyone to send quick feedback with the 💬 Feedback button.`, `Click <b>■ End</b> in Presenter view.`],
      say: next ? `“That's Case Flow Day ${n}. Tomorrow we pick John Doe's file up at ${E(String(next.title).replace(/^Case Flow Day \d+ · /, ""))}. Before you go, hit Feedback and tell me one thing that worked today and one thing that didn't.”`
        : `“That's the file, start to finish. You've carried John Doe's case from intake to the end. Before you go, hit Feedback and tell me one thing that worked this week and one thing that didn't.”`});
    add(20, {pre: true, title: "After the session", do: [
      `<b>Trainee Audit → View Detail</b>: review each trainee's Case Flow Day ${n} Learning Checks with the AI review, add the 40% trainer score and your comment, and send their Day-by-Day Feedback.`,
      `Look at the CMS Case IDs and references they logged: open one or two in the CMS and check the work is really there.`,
      `Read today's Trainee Feedback and note one thing to change tomorrow.`]});
    const start = sopStartMin(), live = steps.filter(x => !x.pre), liveMins = live.reduce((a, x) => a + (x.to - x.from), 0);
    const rows = steps.map(x => {
      const from = x.pre && x.title === "Before trainees join" ? -15 : x.from - 15;
      const when = x.pre && x.title === "After the session" ? `After<small>≈20 min</small>` : `${sopClock(start, from)}<small>${x.to - x.from} min</small>`;
      return `<li><div class="sopf-time">${when}</div><div class="sopf-step ${x.brk ? "brk" : ""}"><h4><span class="n"></span>${x.title}</h4><div class="sopf-rows">
        ${x.do && x.do.length ? `<div><b>Do</b><ul>${x.do.map(y => `<li>${y}</li>`).join("")}</ul></div>` : ""}
        ${x.say ? `<div><b>Say</b><span>${x.say}</span></div>` : ""}
        ${x.watch ? `<div><b>Watch for</b><span>${E(x.watch)}</span></div>` : ""}
      </div></div></li>`;
    }).join("");
    const acts = d.lessons.filter(l => l.cf.block.kind === "activity").length;
    return `<section class="card sopf">
      <div class="sopf-head"><div><div class="sopx-kicker">Case Flow Day ${n} · How to run this session</div><h2>Run of show</h2></div>
        <label class="sopf-start">Session starts at <input type="time" value="${E(state.sopStart || "09:00")}" onchange="setSopStart(this.value)"> <button class="btn btn-ghost btn-sm" onclick="window.print()">🖨 Print</button></label></div>
      <div class="sopf-meta"><span>⏱ About ${Math.round(liveMins / 60 * 10) / 10} hours live · ends ≈ ${sopClock(start, liveMins)}</span><span>🗂 ${E(String(d.cf.phases[0] ? d.cf.phases[0].lead + " · " + d.cf.phases[0].title : ""))}</span><span>📚 ${sc.topics} topics</span><span>🧪 ${acts} Skill Activities</span><span>${game.icon} ${E(game.short)}</span></div>
      <ol class="sopf-steps">${rows}</ol>
      <p style="font-size:12.5px;color:var(--ink-soft);margin:12px 0 0;">Built from the day's Training Agenda (the same minutes as the slides' chips). Every slide's read-aloud script is in Presenter view, and the day's Trainer Speaker Notes PDF prints them all.</p>
    </section>`;
  };
}
/* the program page's few lines about the old course, in the Case Flow's words */
if(typeof window.sopProgramFlow === "function"){
  const __flow = window.sopProgramFlow;
  window.sopProgramFlow = function(){
    return [
      [/every Skill Builder is graded against those documents/g, "every Skill Activity works from those documents"],
      [/<li><b>Teach:<\/b>[^<]*<\/li>/, "<li><b>Teach:</b> each day is one module: its Lectures, about 15–20 minutes of discussion a topic (a few minutes for a condensed one), with Do &amp; Don't played as 3 Clues, 1 Rule; each topic followed straight away by its Skill Building, then the Knowledge Check.</li>"],
      [/<li><b>Practise:<\/b>[^<]*(<[^/][^>]*>[^<]*<\/[^>]+>[^<]*)*<\/li>/, "<li><b>Practise:</b> each topic's Skill Activities on John Doe's file in the CMS, straight after its lessons, with their live calls.</li>"],
      [/<li>Reset <b>Skill Builder attempts<\/b>[^<]*<\/li>/, ""],
      [/\(trainees log their Case ID in each Skill Builder\)/, "(trainees log their CMS Case ID once, and each activity's reference)"],
      [/<th>Skill Builders<\/th>/, "<th>Skill Activities</th>"]
    ].reduce((h, [a, b]) => h.replace(a, b), __flow.apply(this, arguments));
  };
}

/* Presenter view's script header counts the block's own slides (the engine's topics had two) */
if(typeof window.renderPresenterNote === "function"){
  const __note = window.renderPresenterNote;
  window.renderPresenterNote = function(d, l, part){
    const h = __note.apply(this, arguments);
    if(!l || !l.cf) return h;
    const k = viewsOf(l.cf.block).length;
    return h.replace(/ · slide \d+ of 2/, k > 1 ? ` · slide ${part || 1} of ${k}` : "");
  };
}
/* ---------- Admin → Trainer Cues, and the day's Speaker Notes PDF: every slide's script ----------
   The engine's pages listed each topic's two parts (and the old course's answer keys); a Case Flow block has up to
   eight slides, so these list them all, by Case Phase, each under its slide's name, in the trainer's own words. */
const slideName = v => `${VIEW_ICON[v] || ""} ${VIEW_LABEL[v] || v}`.trim();
/* the picker in the lesson's side column (trainers), and the year on Presenter view's console */
function yearInSide(){
  if(!DATES || !state.isAdmin || state.view !== "day") return;
  const top = document.querySelector(".ls-top");
  if(top && !state.presenting && !top.querySelector(".cf-yr")) top.insertAdjacentHTML("beforeend", `<div class="cf-yr-side">${caseYearPicker(true)}</div>`);
  const meta = document.querySelector(".pv-meta");
  if(meta && !meta.querySelector(".cf-yr-pv")) meta.insertAdjacentHTML("beforeend", `<span class="cf-yr-pv" title="The case year these notes and the slides are in (set on Admin → Trainer Cues or beside the slides)">📅 ${E(DATES.year)}</span>`);
}
/* ---------- the case year a trainer's notes are in ----------
   Each trainee keeps the case year they started on (js/cm-case-dates.js), and a batch starts together: its ID is its
   start date (B + MMDDYY), so its case year is the one that was current that day. The trainer picks the year (each
   year listed with the batches on it) and the whole course, the scripts, Presenter view and the Speaker Notes PDF,
   is shown in it for this tab: the dates the trainer reads out are the dates on their trainees' screens. */
const batchYear = b => { const m = /^B(\d\d)(\d\d)(\d\d)$/.exec(String(b || "").trim().toUpperCase()); return m && DATES ? DATES.freshYear(Date.UTC(2000 + +m[3], +m[1] - 1, +m[2], 12)) : null; };
function teachYears(){
  if(!DATES) return [];
  const ys = []; for(let y = DATES.base; y <= Math.max(DATES.fresh, DATES.year); y++) if(DATES.shiftFor(y) != null) ys.push({y, batches: []});
  const seen = new Set();
  (state.adminData || []).forEach(r => { const b = r && String(r.batch || "").trim().toUpperCase(), y = batchYear(b); if(!y || seen.has(b) || (r && r.archived)) return; seen.add(b); const row = ys.find(x => x.y === y); if(row) row.batches.push(b); });
  ys.forEach(x => x.batches.sort().reverse());
  return ys.reverse();
}
function caseYearPicker(compact){
  if(!DATES) return "";
  const ys = teachYears();
  const opt = x => `<option value="${x.y}"${x.y === DATES.year ? " selected" : ""}>${x.y}${x.y === DATES.fresh ? " (current)" : ""}${x.batches.length ? " · " + E(x.batches.slice(0, 4).join(", ")) + (x.batches.length > 4 ? ` +${x.batches.length - 4}` : "") : ""}</option>`;
  return `<label class="cf-yr${compact ? " cf-yr-sm" : ""}" title="The case year your notes, slides and Speaker Notes PDF show. Each batch keeps the case year it started in: pick your batch's.">📅 Case year
    <select onchange="cmCaseFlow.teachYear(this.value)">${ys.map(opt).join("")}</select></label>${DATES.preview ? `<small class="cf-yr-note">Showing ${E(DATES.year)} in this tab</small>` : ""}`;
}
window.cmCaseFlow.teachYear = function(y){
  if(!DATES || +y === DATES.year) return;
  if(state.presenting && !confirm("Changing the case year reloads the page and ends Presenter view. Continue?")){ render(); return; }
  const u = new URL(location.href); u.searchParams.set("caseYear", +y === (DATES.pinnedYear || DATES.fresh) ? "off" : String(+y));   // back to this browser's own year: no preview location.assign(u.href);
};

if(typeof window.renderAdminTrainerCues === "function"){
  const __cues = window.renderAdminTrainerCues;
  window.renderAdminTrainerCues = function(){
    const d = cfDay(state.cuesDay) || DAYS[0]; if(!d || !d.cf) return __cues.apply(this, arguments);
    let k = -1;
    const phases = d.cf.phases.map(ph => {
      const items = d.lessons.map((l, i) => [l, i]).filter(([l]) => l.cf.phase === ph).map(([l, i]) => { k++; const vs = viewsOf(l.cf.block);
        return `<details class="cue-item" ${k === 0 ? "open" : ""}>
          <summary><span class="cue-num">${String(i + 1).padStart(2, "0")}</span>${E(titleCase(l.cf.block.title))}<span class="cue-steps">${slideLabel(d, i)}</span></summary>
          <div class="cue-body">${vs.map((v, j) => `<div class="pn-part">${slideName(v)}</div>${renderPresenterNote(d, l, j + 1)}`).join("")}</div>
        </details>`; }).join("");
      return items ? `<h3 style="font:700 15px var(--font-ui);color:var(--navy);margin:14px 18px 6px;">${E(ph.lead === "Case Phase" ? `Case Phase ${ph.n}` : ph.lead)}: ${E(ph.title)}</h3>${items}` : "";
    }).join("");
    return `
      <p class="eyebrow">Admin Only</p>
      <h1 style="color:var(--navy);font-size:26px;margin:6px 0 4px;">Trainer Cues &amp; Scripts</h1>
      <p style="color:var(--ink-soft);font-size:13px;max-width:75ch;margin:0 0 18px;">What you say on every slide, in your own voice, plus the questions to put to the room. Trainees (and your screen-share) never see this. Keep it open in a second window, or use 🖥 Presenter view, which shows the same script beside each slide.</p>
      <div class="cf-yr-row">${caseYearPicker()}</div>
      <div class="cues-day-tabs">${DAYS.map(x => `<button class="${x.id === d.id ? "active" : ""}" onclick="setCuesDay(${x.id})">Case Flow Day ${x.cf.n}</button>`).join("")}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:16px 0 10px;">
        <h2 style="color:var(--navy);font-size:19px;margin:0;">${E(d.title)}</h2>
        <button class="btn btn-navy btn-sm" onclick="downloadDayScriptsPdf(${d.id})">⬇ Download the Speaker Notes (PDF)</button>
      </div>
      ${(a => `<div class="card" style="padding:14px 18px;margin-bottom:12px;"><div class="pn-part">📅 Training Agenda — read aloud</div><p style="margin:6px 0;">${E(a.say)}</p>${a.ask ? `<p style="margin:6px 0 0;"><b>Ask:</b> ${E(a.ask)}</p>` : ""}</div>`)(agendaNotes(d))}
      ${d.cf.n === 1 && typeof renderMeetClientTrainerGuide === "function" ? `<div class="card" style="padding:14px 18px;margin-bottom:12px;">${renderMeetClientTrainerGuide()}</div>` : ""}
      ${d.discussionQuestion ? `<div class="card discussion-card" style="margin-bottom:12px;">
        <div class="discussion-tag">💬 End-of-Day Discussion</div>
        <p class="discussion-q">${E(d.discussionQuestion)}</p>
        <p class="discussion-note"><b>Say:</b> “Before the Knowledge Check, let's step back and talk about this together.” Then ask the question above, take two or three answers, and tie each one to a moment on John Doe's file from today.</p>
      </div>` : ""}
      <div class="card" style="padding:6px 0;margin-bottom:18px;">${phases || `<p style="padding:14px 18px;color:var(--ink-soft);">No scripts for this day.</p>`}</div>`;
  };
}
if(typeof window.downloadDayScriptsPdf === "function"){
  const __pdf = window.downloadDayScriptsPdf;
  window.downloadDayScriptsPdf = function(dayId){
    const d = cfDay(dayId); if(!d || typeof buildAndSavePdf !== "function") return __pdf.apply(this, arguments);
    buildAndSavePdf("LSH Case Management Training", `Case Flow Day ${d.cf.n}: Trainer Speaker Notes`, buildDayScriptLines(d), `LSH_Case_Flow_Day${d.cf.n}_Speaker_Notes`);
  };
}
if(typeof window.buildDayScriptLines === "function"){
  const __lines = window.buildDayScriptLines;
  window.buildDayScriptLines = function(d){
    if(!d || !d.cf) return __lines.apply(this, arguments);
    const lines = [`## ${d.title}: Trainer Speaker Notes`];
    const ag = agendaNotes(d);
    lines.push("## Training Agenda", "SLIDE: TRAINING AGENDA", ag.say);
    if(ag.ask) lines.push(`ASK: ${ag.ask}`);
    lines.push("---");
    d.cf.phases.forEach(ph => {
      const ls = d.lessons.map((l, i) => [l, i]).filter(([l]) => l.cf.phase === ph); if(!ls.length) return;
      lines.push(`## ${ph.lead === "Case Phase" ? `Case Phase ${ph.n}` : ph.lead}: ${ph.title}`);
      ls.forEach(([l, i]) => {
        lines.push(`## ${String(i + 1).padStart(2, "0")}. ${titleCase(l.cf.block.title)}  ·  ${slideLabel(d, i)}`);
        viewsOf(l.cf.block).forEach((v, j) => {
          const sc = slideScript(d, l, j + 1), paras = scriptProse(sc);
          lines.push(`SLIDE ${j + 1}: ${(VIEW_LABEL[v] || v).toUpperCase()}`);
          if(paras[0]) lines.push(paras[0]);
          if(paras[1]) lines.push(`ASK: ${paras[1]}`);
          if(sc.scenario) lines.push(`SCENARIO: ${sc.scenario}`);
        });
        lines.push("---");
      });
    });
    if(d.discussionQuestion){ lines.push("## End-of-Day Discussion"); lines.push(`SAY: “Before the Knowledge Check, let's step back and talk about this together.”`); lines.push(`ASK: “${d.discussionQuestion}”`); lines.push(`WRAP: “Thanks, everyone. Hold onto those examples: we'll pick John Doe's file up from here tomorrow.”`); }
    return lines;
  };
}

/* ---------- the day page: labels, and the next step after the Knowledge Check ---------- */
if(typeof renderDay === "function"){
  const __day = renderDay;
  renderDay = function(id){ const d = cfDay(id); const html = __day.apply(this, arguments); return d ? relabel(html, d) : html; };
}
if(typeof renderQuizNextStep === "function"){
  const __next = renderQuizNextStep;
  renderQuizNextStep = function(d, passed){
    if(!d || !d.cf) return __next.apply(this, arguments);
    const n = d.cf.n, next = cfDayByN(n + 1), up = (CF.upcoming || []).find(u => u.n === n + 1);
    const done = !!((state.progress || {})[d.id] || {}).done;
    const title = passed ? `Passed — Case Flow Day ${n} is marked complete ✓` : `Not yet passing — 70% is required to mark Case Flow Day ${n} complete.`;
    const lines = [];
    if(passed) lines.push(next ? `<b>Next step:</b> Case Flow Day ${n + 1} is open.` : up ? `<b>Next step:</b> Case Flow Day ${n + 1} (${E(up.title)}) opens as soon as it is published. Finish each module's Self-Summary & Skill Scale so your trainer can review the day.` : "<b>Case Flow complete.</b>");
    else lines.push(`<b>Required:</b> retake this Knowledge Check — Case Flow Day ${n + 1} opens on a pass. ${done ? "You already passed it earlier; your best score is kept." : "Only your best score is kept."}`);
    lines.push(`<b>Gate:</b> ${E(d.cf.gate)}.`);
    return `<div class="quiz-next-step qns-${passed ? "ok" : "stop"}"><div class="qns-title">${title}</div>${lines.map(x => `<p>${x}</p>`).join("")}</div>`;
  };
}

/* The day's quiz is every module's questions in order; on submit, each module's share is
   scored and kept on the trainee's record — the automated half of that module's composite. */
if(typeof submitQuiz === "function"){
  const __submit = submitQuiz;
  const wrapped = async function(dayId){
    const d = cfDay(dayId);
    if(!d) return __submit.apply(this, arguments);
    const answers = Object.assign({}, state.quizAnswers || {}), before = ((state.progress || {})[dayId] || {}).date;
    const r = await __submit.apply(this, arguments);
    const after = ((state.progress || {})[dayId] || {}).date;
    if(after && after !== before){
      const at = new Date().toISOString(), by = {};
      d.quiz.forEach((q, i) => { const m = d.cf.quizMod[i]; by[m] = by[m] || {correct: 0, total: 0}; by[m].total++; if(answers[i] === q.a) by[m].correct++; });
      await load();
      Object.entries(by).forEach(([m, v]) => { rec(m).quiz = Object.assign(v, {pct: Math.round(v.correct / v.total * 100), at}); });
      await persist();
      const g = state.cfGame; if(g && g.day === dayId){ REC.game = REC.game || {}; const b0 = REC.game[dayId]; if(!b0 || g.pts > (b0.pts || 0)) REC.game[dayId] = {pts: g.pts, best: g.best, at};
        if(!g.banked){ g.banked = true; REC.friendTokens = tokensBanked() + tokensEarned(Object.values(g.log).filter(x => x.ok).length); }   // 🤝 for the next round
        await persist(); }
      cmCaseFlow.autoReview(dayId);   // the rubric scoring runs by itself, module by module
    }
    return r;
  };
  submitQuiz = wrapped; window.submitQuiz = wrapped;
}

/* ---------- the Knowledge Check page: ① the quiz, ② each Case Phase's Learning Check & Self-Summary ----------
   The Learning Checks aren't slides any more: the day's Knowledge Check is the quiz, then each module's written
   questions, Self-Summary and Skill Scale. One Submit scores the quiz and sends every module to the AI reviewer
   against its rubric, automatically (no separate "Submit for review"); the results fit one screen. */
const words3 = (x, n) => String(x || "").trim().split(/\s+/).filter(Boolean).length >= n;
// The bonus round is ONE takeaway for the whole day (saves time): a short summary of the day, written against and
// graded with the day's last Knowledge Check block, which stands for the day.
const kcMods = d => { const all = d.lessons.filter(l => l.cf.block.kind === "check").map(l => ({b: l.cf.block, mod: l.cf.mod, ph: l.cf.phase}));
  return all.length ? [all[all.length - 1]] : []; };
const TAKEAWAY_MIN = 8;
const takeawayOf = b => `Your key takeaway from today, in one short summary: what you learned across the day's lessons and activities on John Doe's file, and what you will do differently on the job. (Start from: ${b.check.summary[0]})`;
function modMissing(b, modId){   // what's left to do on a module's Learning Check, or "" when it's complete
  const m = rec(modId), n = String(m.answers[0] || "").trim().split(/\s+/).filter(Boolean).length;
  return n >= TAKEAWAY_MIN ? "" : n ? `add to your takeaway (at least ${TAKEAWAY_MIN} words; ${n} so far)` : "write your takeaway";
}
/* ② the bonus round: one module's Learning Check at a time, its modules as tabs, so it fits one screen */
function writtenPart(d){
  const day = d.cf, mods = kcMods(d), firstOpen = mods.findIndex(x => modMissing(x.b, x.mod.id));
  const sel = mods.some(x => x.mod.id === state.cfKcMod) ? state.cfKcMod : (mods[firstOpen < 0 ? 0 : firstOpen] || mods[0]).mod.id;
  const tabs = `<div class="cf-kc-tabs" role="tablist">${mods.map(({b, mod, ph}) => { const left = modMissing(b, mod.id);
      return `<button type="button" role="tab" class="cf-kc-tab${mod.id === sel ? " on" : ""}${left ? "" : " ok"}" aria-selected="${mod.id === sel}" onclick="cmCaseFlow.kcMod('${mod.id}')"><small>${day.n}.${ph.n} ${E(ph.title)}</small><b>${E(b.title)}</b><span class="cf-kc-badge ${left ? "" : "ok"}">${left ? "To do" : "Complete ✓"}</span></button>`; }).join("")}</div>`;
  const submit = `<div class="cf-kc-submit"><button class="btn btn-ghost" type="button" onclick="cmCaseFlow.kcPart('quiz')">← Back to the quiz</button>
      <button class="btn btn-primary" style="padding:13px 28px;" type="button" ${state.quizSubmitting ? "disabled" : ""} onclick="cmCaseFlow.kcSubmit(${d.id})">Submit Knowledge Check</button></div>`;
  return `<div class="cf-kc-written">${tabs}${mods.filter(x => x.mod.id === sel).map(({b, mod}) => {
      const m = rec(mod.id);
      return `<div class="card cf-kc-mod" data-mod="${mod.id}"><div class="cf-ss" data-mod="${mod.id}">
        <h4>Your takeaway</h4>
        <label class="cf-kc-take" for="cfss_${mod.id}_0">${E(takeawayOf(b))}</label>
        <textarea id="cfss_${mod.id}_0" rows="6" placeholder="In your own words, from John Doe's file (a few sentences)" oninput="cmCaseFlow.draft('${mod.id}')">${E(m.answers[0] || "")}</textarea>
        <div class="cf-kc-take-st"><span id="cfss_st_${mod.id}"></span></div></div>
        ${submit}
      </div>`; }).join("")}
    </div>`;
}
const kcSig = (b, m) => JSON.stringify([m.kc, m.answers, m.scale]).length + ":" + JSON.stringify([m.kc, m.answers, m.scale]).replace(/\s+/g, " ").slice(0, 4000).split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
function kcChip(modId){   // a module's scores, compact, for the results
  const s = composite(rec(modId)), m = rec(modId);
  const v = x => x == null ? "—" : x + "%";
  return `<span>Automated <b>${v(s.a)}</b></span><span>Trainer <b>${v(s.t)}</b></span><span>Composite <b>${v(s.c)}</b></span>${m.ai ? "" : `<em id="cfkc_rv_${modId}">${state.cfReviewing && state.cfReviewing[modId] ? "Reviewing…" : "Review pending"}</em>`}`;
}
/* The bonus round is graded: each takeaway by the AI reviewer against its module's rubric. Their average is the day's
   takeaway score, kept on the day's record beside the quiz (state.progress[day].takeaway), so it shows on the results,
   the trainer's Day-by-Day and the trainee's evidence; the quiz alone still decides the 70% pass. */
function takeawayScore(d){
  const mods = kcMods(d), v = mods.map(({mod}) => rec(mod.id).ai).filter(a => a && typeof a.score === "number").map(a => a.score);
  return {n: mods.length, graded: v.length, pct: v.length ? Math.round(v.reduce((x, y) => x + y, 0) / v.length) : null};
}
async function saveTakeaway(d){
  const t = takeawayScore(d), p = (state.progress || {})[d.id];
  if(!p || t.pct == null || (p.takeaway === t.pct && p.takeawayGraded === t.graded)) return;
  p.takeaway = t.pct; p.takeawayGraded = t.graded; p.takeawayAt = new Date().toISOString();
  try{ await storeSet("day-progress", state.progress); if(typeof syncToLedger === "function") await syncToLedger(); }catch(e){}
}
/* What the Training Portal's Progress page shows for this course (it reads the trainee's record, key caseFlow; written with the
   record, cm-updates.js): per Case Flow day, the Knowledge Check, the takeaway score, and each module's Automated, Trainer and
   Composite scores. */
function scoreSummary(){
  const out = {days: {}, at: REC.updatedAt || null};
  DAYS.filter(d => d.cf).forEach(d => {
    const mods = {};
    [...new Set(d.lessons.filter(l => l.cf).map(l => l.cf.mod.id))].forEach(id => {
      const m = (REC.modules || {})[id]; if(!m) return;
      const s = composite(m); if(s.a != null || s.t != null) mods[id] = s;
    });
    const p = (state.progress || {})[d.id] || {};
    out.days[d.cf.n] = {id: d.id, kc: typeof p.score === "number" ? p.score : null, passed: !!p.done,
      takeaway: typeof p.takeaway === "number" ? p.takeaway : null, modules: mods};
  });
  return out;
}
function takeawayHtml(d){
  const t = takeawayScore(d), busy = kcMods(d).some(({mod}) => state.cfReviewing && state.cfReviewing[mod.id]);
  return `<b>${t.pct == null ? "—" : t.pct + "%"}</b><span>Takeaways</span><small>${t.pct == null ? (busy ? "Grading…" : "Graded after you submit") : `AI-graded · ${t.graded} of ${t.n}${busy ? " · grading…" : ""}`}</small>`;
}
function cfResult(d){
  const {lastScore, lastCorrect, lastTotal, lastPassed} = state;
  const msg = lastPassed ? `That's a wrap on Case Flow Day ${d.cf.n}. Well done.` : "Not quite 70% yet. See which questions you missed below, then retake when you're ready.";
  const history = (state.progress[d.id] && state.progress[d.id].history) || [];
  const next = d.cf.n < MODULES.length ? (dayUnlocked(cfIdOf(d.cf.n + 1)) ? `<button class="btn btn-primary" onclick="goToNextDay(${d.id})">Continue to Case Flow Day ${d.cf.n + 1} →</button>` : "")
    : (typeof certData === "function" && certData().eligible ? `<button class="btn btn-primary" onclick="openCertificate()">🎓 View Certificate of Completion</button>` : "");
  return `<div class="card quiz-result cf-kc-result">
      <div class="cf-kcr-top">
        <div class="cf-kcr-score">${typeof sealSvg === "function" ? sealSvg({size: 72, label: lastScore + "%", done: lastPassed}) : ""}<div><div class="big">${lastCorrect} / ${lastTotal} correct</div><div class="sub">${msg}</div></div>
          <div class="cf-kcr-take" id="cfkc_take_${d.id}">${takeawayHtml(d)}</div></div>
        <div class="cf-kcr-next">${renderQuizNextStep(d, lastPassed)}</div>
      </div>
      ${state.cfGame && state.cfGame.day === d.id ? `<div class="cf-kcr-game"><span>${state.cfGame.mode === "millionaire" ? `<b>${rankName(rankAt(Object.values(state.cfGame.log).filter(x => x.ok).length, d.quiz.length))}</b>` : `⭐ <b>${state.cfGame.pts.toLocaleString()}</b> points`}</span><span>🔥 best streak <b>${state.cfGame.best}</b></span>${gameBadges(d, state.cfGame).map(([i, t]) => `<span class="cfg-badge sm"><i>${i}</i><b>${t}</b></span>`).join("")}${(REC.game || {})[d.id] ? `<span class="cf-note">Your best: ${(REC.game[d.id].pts || 0).toLocaleString()} points</span>` : ""}</div>` : ""}
      <div class="cf-kcr-mods">${kcMods(d).map(({b, mod, ph}) => `<div class="cf-kcr-mod"><small>${d.cf.n}.${ph.n} ${E(ph.title)}</small><b>${E(b.title)}</b><div class="cf-kcr-chips" id="cfkc_res_${mod.id}">${kcChip(mod.id)}</div></div>`).join("")}</div>
      <div class="cf-kcr-foot">
        <div class="cf-kcr-btns"><button class="btn btn-ghost btn-sm" onclick="retakeQuiz(${d.id})">Retake Quiz</button>
          <button class="btn btn-ghost btn-sm" onclick="downloadQuizResultPdf(${d.id})">⬇ Download PDF</button>
          <button class="btn btn-ghost btn-sm" onclick="returnToLessonCard(${d.id})">Return to Progress</button>${next}</div>
        ${history.length ? `<div class="cf-kcr-hist">Attempts: ${history.map(h => `<span class="${h.passed ? "qh-pass" : "qh-fail"}">${h.score}%</span>`).join(" · ")}</div>` : ""}
        ${typeof renderQuickDayFeedback === "function" ? `<div class="cf-kcr-fb">${renderQuickDayFeedback(d.id)}</div>` : ""}
      </div>
    </div>
    <div id="answerFeedback"></div>`;
}
/* ---------- ① the quiz, played as a game show: each Case Flow day has its own, and only its own. A pick locks in
   and shows at once whether it was right, never which option is (the answer key still waits for a pass), and no
   clock ever forces an answer. The rewards are a Case Manager's, not a prize fund: points, badges, a career rank, and
   🤝 Ask a Friend tokens (one for every 5 right answers, banked on Submit for the next round: a hint from the AI
   colleague that names the principle, never the answer).
     💼 Who Wants to Be a Case Manager? (Day 1): climb the career ranks, a 30-second clock, 50/50 and Ask the Audience
     🟦 Jeopardy (Day 2): the day's questions in columns of five, each headed by its module, × point values, a hidden Daily Double
     💣 Countdown Bomb (Day 3): a fuse burns; answer before 💥 for the time bonus
     🎡 Wheel of Fortune (Day 4): spin for a multiplier before each question
     🚪 Mystery Doors (Day 5): pick a door for its reward, then the question ---------- */
const GAMES = {
  millionaire: {icon: "💼", name: "Who Wants to Be a Case Manager?", short: "Career Climb"},
  jeopardy: {icon: "🟦", name: "Case Flow Jeopardy!", short: "Jeopardy"},
  bomb: {icon: "💣", name: "Countdown Bomb", short: "Countdown Bomb"},
  wheel: {icon: "🎡", name: "Wheel of Fortune", short: "Wheel of Fortune"},
  doors: {icon: "🚪", name: "Mystery Doors", short: "Mystery Doors"}};
const GAME_DAY = {1: "millionaire", 2: "jeopardy", 3: "bomb", 4: "wheel", 5: "doors"};
const GAME_FAST = 12000, MIL_SEC = 30, BOMB_SEC = 20;
const WHEEL_COL = ["#DB8437", "#262B45", "#F4B77A", "#46508A", "#B54A3F", "#2F8F5B", "#C26A22", "#343C66"];
const WHEEL = [["×1", 1, 0], ["×2", 2, 0], ["+50", 1, 50], ["×1.5", 1.5, 0], ["×3", 3, 0], ["+100", 1, 100], ["×1", 1, 0], ["×2", 2, 0]];
/* Day 1's ladder is a career: seven ranks, climbed by right answers, from Trainee to Lead Case Manager */
const RANKS = [["🎓", "Trainee"], ["📋", "Intake Assistant"], ["🗂", "Case Assistant"], ["📞", "Claims Coordinator"], ["💼", "Case Manager"], ["⭐", "Senior Case Manager"], ["🏆", "Lead Case Manager"]];
const rankAt = (right, n) => Math.min(RANKS.length - 1, Math.floor(right * (RANKS.length - 1) / Math.max(1, n)));
const rankName = i => RANKS[i][0] + " " + RANKS[i][1];
/* 🤝 Ask a Friend: one token for every TOKEN_EVERY right answers (at most TOKEN_MAX a round), banked on Submit and
   spent in a later round; REC.friendTokens on the trainee's record */
const TOKEN_EVERY = 5, TOKEN_MAX = 3;
const tokensEarned = right => Math.min(TOKEN_MAX, Math.floor(right / TOKEN_EVERY));
const tokensBanked = () => Math.max(0, (typeof REC !== "undefined" && REC && REC.friendTokens) || 0);
/* sound: short synthesized cues (off by the 🔇 button; remembered on the device) */
let AC = null;
const soundOn = () => { try{ return localStorage.getItem("cf_game_sound") !== "off"; }catch(e){ return true; } };
function sfx(kind){
  if(!soundOn()) return;
  try{
    AC = AC || new (window.AudioContext || window.webkitAudioContext)();
    const seq = {right: [[660, .09], [880, .14]], wrong: [[220, .18], [160, .22]], tick: [[1200, .03]], boom: [[90, .45]], spin: [[520, .05], [620, .05], [720, .05]], open: [[440, .07], [660, .1]], level: [[523, .09], [659, .09], [784, .16]], tense: [[196, .25], [233, .3]]}[kind] || [];
    let t = AC.currentTime;
    seq.forEach(([f, d]) => { const o = AC.createOscillator(), g = AC.createGain(); o.type = kind === "boom" || kind === "wrong" ? "sawtooth" : "triangle"; o.frequency.value = f; g.gain.setValueAtTime(.06, t); g.gain.exponentialRampToValueAtTime(.0001, t + d); o.connect(g); g.connect(AC.destination); o.start(t); o.stop(t + d); t += d * .9; });
  }catch(e){}
}
/* The quiz in progress is kept on the trainee's record (REC.quizDraft[dayId]: the picks and the game), so leaving
   the Knowledge Check for another page, or closing the tab, doesn't lose it: coming back picks up where they were.
   It's cleared once the quiz is submitted or retaken. */
function saveQuizDraft(d){
  REC.quizDraft = REC.quizDraft || {};
  REC.quizDraft[d.id] = {answers: Object.assign({}, state.quizAnswers || {}), game: state.cfGame && state.cfGame.day === d.id ? state.cfGame : null, at: new Date().toISOString()};
  persist();
}
function restoreQuizDraft(d){
  const q = REC.quizDraft && REC.quizDraft[d.id];
  if(!q || state.quizSubmitted || Object.keys(state.quizAnswers || {}).length || !Object.keys(q.answers || {}).length) return;
  state.quizAnswers = Object.assign({}, q.answers);
  if(q.game) state.cfGame = q.game;
  const next = d.quiz.findIndex((_, i) => state.quizAnswers[i] === undefined);
  state.quizQuestionIndex = next < 0 ? d.quiz.length - 1 : next;
}
function clearQuizDraft(dayId){ clearTimeout(__qdT); if(REC.quizDraft && REC.quizDraft[dayId]){ delete REC.quizDraft[dayId]; persist(); } }
if(typeof window.retakeQuiz === "function"){
  const __retake = window.retakeQuiz;
  window.retakeQuiz = function(dayId){ clearQuizDraft(dayId); state.cfGame = null; return __retake.apply(this, arguments); };
}
function game(d){
  restoreQuizDraft(d);
  const g = state.cfGame;
  if(!g || g.day !== d.id || !Object.keys(state.quizAnswers || {}).length && Object.keys(g.log).length){
    const mode = (state.cfGameMode && state.cfGameMode[d.id]) || GAME_DAY[d.cf.n] || "millionaire";
    const daily = Math.floor(Math.random() * d.quiz.length);
    state.cfGame = {day: d.id, mode, pts: 0, streak: 0, best: 0, fast: 0, log: {}, shown: {}, misses: 0, comeback: false, pre: {}, used: {}, hide: {}, aud: {}, boom: {}, daily, board: state.cfGame && state.cfGame.day === d.id ? null : null};
  }
  return state.cfGame;
}
function gameBadges(d, g){
  const n = d.quiz.length, right = Object.values(g.log).filter(x => x.ok).length;
  return [right === n && ["🏆", "Perfect Run", "every answer right"], g.best >= 5 && ["🔥", "On Fire", `${g.best} in a row`], g.fast >= 5 && ["⚡", "Quick Draw", `${g.fast} speed bonuses`], g.comeback && ["💪", "Comeback", "right after two misses"],
    g.mode === "millionaire" && right >= Math.ceil(n * .8) && !g.used.fifty && !g.used.aud && ["🎖", "No Lifelines", "80%+ on your own"],
    g.mode === "bomb" && Object.values(g.log).filter(x => x.ok && !x.boom).length >= Math.ceil(n * .8) && ["🧯", "Bomb Squad", "defused 80%+ in time"]].filter(Boolean);
}
// the board: the day's questions in columns of five, in the order they're taught, each headed by the module it checks
function jeopardyCols(d){
  const mods = CF.days.flatMap(x => x.modules), cols = [], seen = {};
  d.quiz.forEach((_, i) => { let c = cols[cols.length - 1]; if(!c || c.qs.length === 5) cols.push(c = {qs: []}); c.qs.push(i); });
  cols.forEach(c => { const t = (mods.find(x => x.id === d.cf.quizMod[c.qs[0]]) || {}).title || d.cf.phases[0].title; seen[t] = (seen[t] || 0) + 1; c.title = seen[t] > 1 ? `${t} (${seen[t]})` : t; });
  return cols;
}
const phaseOfQ = (d, i) => jeopardyCols(d).find(c => c.qs.includes(i)) || {title: ""};
function jeopardyBoard(d, g){
  const cols = jeopardyCols(d);
  const rows = Math.max(...cols.map(c => c.qs.length));
  return `<div class="cfg-jb" style="--cols:${cols.length}">${cols.map(c => `<div class="cfg-jh">${E(c.title)}</div>`).join("")}
    ${Array.from({length: rows}, (_, r) => cols.map(c => { const i = c.qs[r]; if(i === undefined) return `<div class="cfg-jc empty"></div>`; const l = g.log[i], v = (r + 1) * 200;
      return `<button type="button" class="cfg-jc${l ? (l.ok ? " ok" : " no") : ""}" ${l ? "disabled" : ""} onclick="cmCaseFlow.gamePick(${i},${v})">${l ? (l.ok ? "✓ " : "✗ ") + v : v}</button>`; }).join("")).join("")}</div>`;
}
function gameQuiz(d){
  const g = game(d), n = d.quiz.length, answered = Object.keys(state.quizAnswers || {}).length, G = GAMES[g.mode];
  const finished = answered >= n;
  let qi = Math.min(state.quizQuestionIndex || 0, n - 1);
  const sound = `<button type="button" class="cfg-sound" onclick="cmCaseFlow.gameSound()" title="Sound">${soundOn() ? "🔊" : "🔇"}</button>`;
  const right = Object.values(g.log).filter(x => x.ok).length, rk = rankAt(right, n), earned = tokensEarned(right);
  const score = g.mode === "millionaire" ? rankName(rk) : `⭐ ${g.pts.toLocaleString()}`;
  const titleRow = `<div class="cfg-title"><b>${G.icon} ${G.name}</b>${sound}</div>`;   // under the score strip, so the top isn't crowded
  const hud = `<div class="cfg-hud"><span class="cfg-pts">${score}<small>${g.mode === "millionaire" ? "your rank" : "points"}</small></span><span class="cfg-streak${g.streak >= 3 ? " hot" : ""}">🔥 ${g.streak}<small>streak</small></span><span class="cfg-lvl">${answered}<small>of ${n} played</small></span><span class="cfg-tok" title="Ask a Friend tokens: one for every ${TOKEN_EVERY} right answers, for your next round">🤝 ${tokensBanked()}<small>to use${earned ? ` · +${earned} next round` : ""}</small></span></div>`;
  const track = g.mode === "jeopardy" ? "" : `<div class="cfg-track">${d.quiz.map((_, i) => { const l = g.log[i]; return `<button type="button" class="cfg-node${i === qi && !finished ? " at" : ""}${l ? (l.ok ? " ok" : " no") : ""}" ${l ? "" : "disabled"} onclick="cmCaseFlow.gameGo(${i})" aria-label="Question ${i + 1}">${i === qi && !finished ? (g.mode === "bomb" ? "💣" : "🚀") : l ? (l.ok ? "✓" : "✗") : i + 1}</button>`; }).join("")}</div>`;
  const clear = `<div class="cfg-clear"><div class="cfg-clear-h">🏁 ${g.mode === "millionaire" ? `You made ${score}!` : "Game over: quiz cleared!"}</div>
      <div class="cfg-tally"><span><b>${right}</b> of ${n} right</span>${g.mode === "millionaire" ? "" : `<span><b class="cfg-count" data-to="${g.pts}">${g.pts.toLocaleString()}</b> points</span>`}<span>best streak <b>${g.best}</b></span></div>
      ${earned ? `<div class="cfg-earn">🤝 <b>+${earned} Ask a Friend token${earned === 1 ? "" : "s"}</b> for your next round: a hint from your AI colleague on a question you're stuck on</div>` : ""}
      ${gameBadges(d, g).length ? `<div class="cfg-badges">${gameBadges(d, g).map(([i, t, x]) => `<span class="cfg-badge"><i>${i}</i><b>${t}</b><small>${x}</small></span>`).join("")}</div>` : ""}
      <button class="btn btn-primary" style="padding:13px 28px;" type="button" onclick="cmCaseFlow.kcPart('written')">Bonus round: your key takeaway →</button></div>`;
  // the board / the wheel / the doors come before a question
  if(g.mode === "jeopardy" && (state.cfJq == null || g.log[state.cfJq] && state.cfGameShow !== state.cfJq && state.cfJAns !== state.cfJq)){
    return `<div class="cfg">${hud}${titleRow}${finished ? clear : `<p class="cfg-hint">Pick a category and a value. One square hides a <b>Daily Double</b>.</p>`}${jeopardyBoard(d, g)}</div>`;
  }
  if(g.mode === "jeopardy") qi = state.cfJq;
  if(finished && state.cfGameShow !== qi) return `<div class="cfg">${hud}${track}${titleRow}${clear}</div>`;
  const q = d.quiz[qi], pick = state.quizAnswers[qi], done = pick !== undefined, log = g.log[qi];
  if(!done && g.mode === "wheel" && !g.pre[qi]){
    const seg = 360 / WHEEL.length;
    return `<div class="cfg">${hud}${track}${titleRow}<div class="cfg-wheel-wrap"><div class="cfg-pointer">▼</div>
      <div class="cfg-wheel" id="cfgWheel" style="background:conic-gradient(${WHEEL.map((_, i) => `${WHEEL_COL[i]} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})">${WHEEL.map(([t], i) => `<span style="transform:rotate(${i * seg + seg / 2}deg)"><b>${t}</b></span>`).join("")}<i class="cfg-hub">🎡</i></div>
      <button class="btn btn-primary cfg-spin" type="button" onclick="cmCaseFlow.gameSpin(${qi})">🎡 Spin for level ${qi + 1}</button></div></div>`;
  }
  if(!done && g.mode === "doors" && !g.pre[qi]){
    return `<div class="cfg">${hud}${track}${titleRow}<p class="cfg-hint">Level ${qi + 1}: pick a door. Behind each, a reward for a right answer.</p>
      <div class="cfg-doors">${[1, 2, 3].map(k => `<button type="button" class="cfg-door" onclick="cmCaseFlow.gameDoor(${qi},${k})"><span class="cfg-door-panel">🚪<b>${k}</b></span></button>`).join("")}</div></div>`;
  }
  if(!done && !g.shown[qi]) g.shown[qi] = Date.now();
  const hidden = g.hide[qi] || [], aud = g.aud[qi], fr = (g.friend || {})[qi];
  const friend = !done && !fr && tokensBanked() ? `<button type="button" class="cfg-friend" onclick="cmCaseFlow.gameFriend(${qi})" title="Spend a token: your AI colleague names the principle, never the answer">🤝 Ask a Friend <small>${tokensBanked()} token${tokensBanked() === 1 ? "" : "s"}</small></button>` : "";
  const hint = fr ? `<div class="cfg-hintbox">🤝 <b>Your colleague:</b> ${fr === 1 ? "<i>thinking…</i>" : E(fr)}</div>` : "";
  const extra = g.mode === "millionaire" ? `<div class="cfg-life"><button type="button" ${g.used.fifty || done ? "disabled" : ""} onclick="cmCaseFlow.gameLife('fifty',${qi})">½ 50:50</button><button type="button" ${g.used.aud || done ? "disabled" : ""} onclick="cmCaseFlow.gameLife('aud',${qi})">👥 Ask the Audience</button><span class="cfg-clock" data-sec="${MIL_SEC}" data-start="${g.shown[qi] || 0}"></span></div>`
    : g.mode === "bomb" ? `<div class="cfg-fuse${done ? " out" : ""}${g.boom[qi] ? " boomed" : ""}"><i style="animation-duration:${BOMB_SEC}s;animation-delay:-${Math.min(BOMB_SEC, ((done ? (log && log.at) || Date.now() : Date.now()) - (g.shown[qi] || Date.now())) / 1000)}s"></i><span>💣</span></div>`
    : (g.pre[qi] ? `<div class="cfg-prize">${g.mode === "wheel" ? "🎡" : "🚪"} This level pays <b>${g.pre[qi].label}</b></div>` : g.mode === "jeopardy" ? `<div class="cfg-prize">🟦 ${E(phaseOfQ(d, qi).title)} for <b>${state.cfJv || 200} points</b>${qi === g.daily ? " · <b class='dd'>DAILY DOUBLE ×2</b>" : ""}</div>` : "");
  const card = `<div class="card cfg-card${done ? (log && log.ok ? " right" : " wrong") : ""}${g.mode === "jeopardy" ? " jq" : ""}" data-q="${qi}">
      ${extra}${friend}
      <p class="cfg-q">${E(q.q)}</p>${hint}
      <div class="cfg-opts">${q.opts.map((o, oi) => { const me = pick === oi, gone = hidden.includes(oi);
        return `<button type="button" class="cfg-opt${me ? (log && log.ok ? " right" : " wrong") : ""}${done && !me ? " dim" : ""}${gone ? " gone" : ""}" ${done || gone ? "disabled" : ""} onclick="cmCaseFlow.gameAnswer(${d.id},${qi},${oi})"><span class="cfg-letter">${String.fromCharCode(65 + oi)}</span><span>${E(o)}</span>${aud ? `<span class="cfg-aud"><i style="width:${aud[oi]}%"></i><em>${aud[oi]}%</em></span>` : ""}${me ? `<span class="cfg-mark">${log && log.ok ? "✓" : "✗"}</span>` : ""}</button>`; }).join("")}</div>
      ${done && log ? `<div class="cfg-say ${log.ok ? "ok" : "no"}">${log.ok ? `Correct! <b>${g.mode === "millionaire" ? (rankAt(right, n) > rankAt(right - 1, n) ? "Promoted to " + rankName(rankAt(right, n)) : `Level ${qi + 1} cleared`) : "+" + log.pts}</b>${right % TOKEN_EVERY === 0 && right / TOKEN_EVERY <= TOKEN_MAX ? " · 🤝 +1 token for your next round" : ""}${log.fast ? " · ⚡ speed bonus" : ""}${log.combo ? ` · 🔥 streak +${log.combo}` : ""}` : `${log.boom ? "💥 Boom, and " : ""}Not this one. The right answer shows in the review once you pass.`}</div>` : ""}
    </div>`;
  const side = g.mode === "millionaire" ? `<div class="cfg-ranks"><b>Your career</b><ol class="cfg-ladder">${RANKS.map(([ic, t], i) => `<li class="${i === rk ? "at" : i < rk ? "won" : ""}"><span>${ic}</span>${E(t)}</li>`).reverse().join("")}</ol><small>${right} of ${n} right · next rank at ${Math.min(n, Math.ceil((rk + 1) * n / (RANKS.length - 1)))}</small></div>` : "";
  const nav = finished ? `<div class="cfg-nav"><button class="btn btn-ghost" type="button" onclick="cmCaseFlow.gameGo(-1)">← Back to the ${g.mode === "jeopardy" ? "board" : "tally"}</button></div>`
    : done ? `<div class="cfg-nav"><button class="btn btn-primary" type="button" onclick="cmCaseFlow.gameNext()">${g.mode === "jeopardy" ? "Back to the board →" : "Next level →"}</button></div>` : "";
  return `<div class="cfg cfg-m-${g.mode}">${hud}${track}${titleRow}<div class="${side ? "cfg-split" : ""}"><div>${card}${nav}</div>${side}</div></div>`;
}
const gameDay = () => DAYS.find(x => x.id === state.dayId);
/* The Knowledge Check page is one screen: its own compact head replaces the engine's back links and day title
   (body.cf-kc-page hides them), and the check is scaled down (to 60% at the least) until it fits the page. */
function kcFit(){
  const on = state.view === "day" && state.dayViewMode === "knowledgeCheck" && !!cfDay(state.dayId);
  document.body.classList.toggle("cf-kc-page", on);
  const w = document.getElementById("quizWrap"); if(!on || !w) return;
  const box = w.closest("main") || document.scrollingElement;
  let z = 1; w.style.zoom = "";
  while(box.scrollHeight > box.clientHeight + 1 && z > 0.6){ z = Math.round((z - 0.05) * 100) / 100; w.style.zoom = String(z); }
}
window.addEventListener("resize", () => { clearTimeout(state.cfKcFitT); state.cfKcFitT = setTimeout(() => { try{ kcFit(); }catch(e){} }, 120); });
/* The Knowledge Check is repainted on every answer, every pick and every move between questions. Writing
   the whole page back with innerHTML threw away and rebuilt every node each time: the page visibly
   flickered, worst on Day 3, whose Countdown Bomb repaints while a CSS fuse animation is running and
   whose rebuilt page is measured and scaled again by kcFit.
   So the new page is built as before and then *morphed* in: a node whose markup hasn't changed is left
   exactly as it is, and only what really differs is written. The result is the same DOM innerHTML would
   have produced — morphEl falls back to replacing a node whenever it can't patch it — so no mode's
   markup has to be known here, and nothing flickers because almost nothing is touched.
   The fuse is the one exception: its animation-delay is worked out from the clock on every render (so a
   rebuilt fuse resumes where it was), which would make it differ every time and restart the animation.
   A fuse that is already running on the same question keeps its own style. */
const FUSE_SEL = ".cfg-fuse i";
function sameFuse(cur, next){
  return cur.matches && cur.matches(FUSE_SEL) && next.matches && next.matches(FUSE_SEL)
    && cur.closest(".cfg-card") && next.closest && true;
}
function morphAttrs(cur, next, keepStyle){
  for(const a of Array.from(next.attributes)){
    if(keepStyle && a.name === "style") continue;
    if(cur.getAttribute(a.name) !== a.value) cur.setAttribute(a.name, a.value);
  }
  for(const a of Array.from(cur.attributes)){
    if(keepStyle && a.name === "style") continue;
    if(!next.hasAttribute(a.name)) cur.removeAttribute(a.name);
  }
}
function morphEl(cur, next){
  if(cur.nodeType === 3 && next.nodeType === 3){ if(cur.nodeValue !== next.nodeValue) cur.nodeValue = next.nodeValue; return true; }
  if(cur.nodeType !== 1 || next.nodeType !== 1 || cur.tagName !== next.tagName) return false;
  const fuse = sameFuse(cur, next);
  if(!fuse && cur.outerHTML === next.outerHTML) return true;            // unchanged: left alone
  // A live <select>, <input> or <textarea> keeps what the trainee has typed or chosen.
  if(/^(SELECT|INPUT|TEXTAREA)$/.test(cur.tagName)){ morphAttrs(cur, next); return true; }
  morphAttrs(cur, next, fuse);
  morphKids(cur, next);
  return true;
}
function morphKids(cur, next){
  // The live child list, never a snapshot of it: patching a child can replace it, which makes a
  // snapshot's later entries stale and left a node behind (a mode whose card has one box fewer kept
  // the box before it — the Countdown Bomb's fuse turned up on the next day's page).
  const b = Array.from(next.childNodes);
  for(let i = 0; i < b.length; i++){
    const cn = cur.childNodes[i];
    if(!cn){ cur.appendChild(b[i].cloneNode(true)); continue; }
    if(!morphEl(cn, b[i])) cur.replaceChild(b[i].cloneNode(true), cn);
  }
  while(cur.childNodes.length > b.length) cur.removeChild(cur.lastChild);
}
function paintInto(w, html){
  if(!w.firstChild){ w.innerHTML = html; return; }
  const next = document.createElement("div");
  next.innerHTML = html;
  morphKids(w, next);
}
let __qdT = null;
function gamePaint(d){
  if(d && !state.quizSubmitted && Object.keys(state.quizAnswers || {}).length){ clearTimeout(__qdT); __qdT = setTimeout(() => saveQuizDraft(d), 400); }
  const w = document.getElementById("quizWrap"); if(!w) return;
  // Only ever paint the day that is open. A game's own timers (the bomb's 20-second fuse, the wheel's
  // spin) hold the day they were started on, so one left running while the trainee opens another day
  // used to paint that day's quiz over this one.
  if(d && state.dayId && d.id !== state.dayId) return;
  // No flicker, from both ends. The page is morphed in rather than written back whole (paintInto), so a
  // node whose markup hasn't changed is left alone; and only a new question card plays its entrance
  // (cfgIn starts from transparent, so replaying it blinked the card on every click).
  const prevQ = w.dataset.cfq;
  paintInto(w, renderQuiz(d));
  const shownCard = w.querySelector(".cfg-card"), shownQ = shownCard ? String(shownCard.dataset.q) : "";
  w.classList.toggle("cfg-same", !!shownQ && shownQ === prevQ); w.dataset.cfq = shownQ;
  try{ kcFit(); }catch(e){}
  clearInterval(state.cfClockIv); clearTimeout(state.cfBombT);
  const g = state.cfGame; if(!g) return;
  const card = shownCard, qi = card ? +card.dataset.q : -1;
  if(qi < 0 || state.quizAnswers[qi] !== undefined) return;
  if(g.mode === "millionaire"){
    const el = w.querySelector(".cfg-clock"), t0 = g.shown[qi];
    const tick = () => { const left = Math.max(0, MIL_SEC - Math.floor((Date.now() - t0) / 1000)); if(el){ el.textContent = left ? `⏱ ${left}s` : "⏱ time's up: no time bonus"; el.classList.toggle("low", left <= 5); } if(left && left <= 5) sfx("tick"); if(!left) clearInterval(state.cfClockIv); };
    tick(); state.cfClockIv = setInterval(tick, 1000);
  }
  if(g.mode === "bomb" && !g.boom[qi]){
    const left = BOMB_SEC * 1000 - (Date.now() - g.shown[qi]);
    state.cfBombT = setTimeout(() => { if(state.quizAnswers[qi] !== undefined) return; g.boom[qi] = true; sfx("boom");
      document.body.classList.add("cfg-shake"); setTimeout(() => document.body.classList.remove("cfg-shake"), 600);
      const f = w.querySelector(".cfg-fuse"); if(f) f.classList.add("boomed");
      const c = w.querySelector(".cfg-card"); if(c){ const b = document.createElement("div"); b.className = "cfg-banner boom"; b.textContent = "💥 BOOM! Answer to move on"; c.appendChild(b); } }, Math.max(0, left));
  }
}
Object.assign(window.cmCaseFlow = window.cmCaseFlow || {}, {
  gameMode(k){ const d = gameDay(); state.cfGameMode = Object.assign(state.cfGameMode || {}, {[d.id]: k}); state.cfGame = null; state.cfJq = null; gamePaint(d); },
  tokens(n){ if(n != null && (state.isAdmin || n < tokensBanked())){ REC.friendTokens = Math.max(0, Math.floor(n)); persist(); } return tokensBanked(); },   // a trainer can grant Ask a Friend tokens
  async gameFriend(qi){ const d = gameDay(), g = game(d), q = d.quiz[qi];
    if(!tokensBanked() || (g.friend || {})[qi]) return;
    g.friend = g.friend || {}; g.friend[qi] = 1; REC.friendTokens = tokensBanked() - 1; persist(); sfx("open"); gamePaint(d);
    const mod = CF.days.flatMap(x => x.modules).find(m => m.id === d.cf.quizMod[qi]) || {};
    const fallback = `Think back to ${mod.title ? `“${mod.title}”` : "this Case Phase's lesson"}: the rule taught there decides it, and so does what John Doe's file actually shows.`;
    let text = "";
    try{
      if(typeof callAIText === "function") text = String(await callAIText(`You are a senior personal-injury Case Manager helping a trainee colleague on a training quiz about the John Doe v. Robert Smith file. Give a nudge in at most two short sentences: name the principle, rule or fact on the file that decides the question. Never say which option is right, never quote or paraphrase any option, never use option letters, and never say "the answer is".\n\nQuestion: ${q.q}\nOptions:\n${q.opts.map(o => "- " + o).join("\n")}`, 120, undefined, "tracker") || "").trim();
    }catch(e){ text = ""; }
    const right = String(q.opts[q.a] || "").toLowerCase().slice(0, 28);
    if(!text || /answer is|option [a-d]\b|\b[a-d]\)|choose|correct (one|option)/i.test(text) || (right.length > 12 && text.toLowerCase().includes(right))) text = fallback;
    g.friend[qi] = text.slice(0, 320); if(state.quizAnswers[qi] === undefined) gamePaint(d); },
  gameSound(){ try{ localStorage.setItem("cf_game_sound", soundOn() ? "off" : "on"); }catch(e){} gamePaint(gameDay()); },
  gameGo(i){ const d = gameDay(), all = Object.keys(state.quizAnswers || {}).length >= d.quiz.length;
    if(i < 0){ state.cfGameShow = null; if(state.cfGame && state.cfGame.mode === "jeopardy"){ state.cfJq = null; state.cfJAns = null; } return gamePaint(d); }
    state.quizQuestionIndex = i; if(state.cfGame && state.cfGame.mode === "jeopardy") state.cfJq = i; state.cfGameShow = all ? i : null; gamePaint(d); },
  gameNext(){ const d = gameDay(), g = game(d);
    if(g.mode === "jeopardy"){ clearTimeout(state.cfGameT); state.cfJq = null; state.cfJAns = null; state.cfGameShow = null; return gamePaint(d); }
    const next = d.quiz.findIndex((_, i) => state.quizAnswers[i] === undefined); state.quizQuestionIndex = next < 0 ? d.quiz.length - 1 : next; gamePaint(d); },
  gamePick(i, v){ const d = gameDay(); state.cfJq = i; state.cfJv = v; state.quizQuestionIndex = i; sfx(i === game(d).daily ? "tense" : "open"); gamePaint(d); },
  gameSpin(qi){ const d = gameDay(), g = game(d), w = document.getElementById("cfgWheel"), k = Math.floor(Math.random() * WHEEL.length), seg = 360 / WHEEL.length;
    const turn = 360 * 5 + (360 - k * seg - seg / 2);
    if(w){ w.style.transition = "transform 2.4s cubic-bezier(.15,.85,.25,1)"; w.style.transform = `rotate(${turn}deg)`; }
    sfx("spin"); const iv = setInterval(() => sfx("tick"), 160);
    setTimeout(() => { clearInterval(iv); const [label, mult, bonus] = WHEEL[k]; g.pre[qi] = {label, mult, bonus}; sfx("level"); gamePaint(d); }, w ? 2500 : 0); },
  gameDoor(qi, k){ const d = gameDay(), g = game(d), prizes = [["×2", 2, 0], ["+150 🎁", 1, 150], ["×1.5", 1.5, 0], ["×3", 3, 0], ["+100", 1, 100]];
    const [label, mult, bonus] = prizes[Math.floor(Math.random() * prizes.length)];
    const el = document.querySelectorAll(".cfg-door")[k - 1]; if(el){ el.classList.add("open"); el.insertAdjacentHTML("beforeend", `<span class="cfg-door-prize">${label}</span>`); }
    sfx("open"); setTimeout(() => { g.pre[qi] = {label, mult, bonus}; gamePaint(d); }, el ? 1000 : 0); },
  gameLife(kind, qi){ const d = gameDay(), g = game(d), q = d.quiz[qi]; if(g.used[kind]) return; g.used[kind] = true;
    if(kind === "fifty"){ const wrong = q.opts.map((_, i) => i).filter(i => i !== q.a).sort(() => Math.random() - .5); g.hide[qi] = wrong.slice(0, Math.max(0, q.opts.length - 2)); }
    else { const left = 100, right = 40 + Math.floor(Math.random() * 25); let rest = left - right; g.aud[qi] = q.opts.map((_, i) => i === q.a ? right : 0);
      const others = q.opts.map((_, i) => i).filter(i => i !== q.a); others.forEach((i, j) => { const v = j === others.length - 1 ? rest : Math.floor(Math.random() * rest * .7); g.aud[qi][i] = v; rest -= v; }); }
    sfx("open"); gamePaint(d); },
  gameAnswer(dayId, qi, oi){
    const d = DAYS.find(x => x.id === dayId), g = game(d), q = d.quiz[qi];
    if(state.quizAnswers[qi] !== undefined) return;   // a pick locks in
    clearInterval(state.cfClockIv); clearTimeout(state.cfBombT);
    state.quizAnswers[qi] = oi; state.cfJAns = qi; saveQuizDraft(d);   // (Jeopardy: the clue stays up to show the result)
    const ok = oi === q.a, el = Date.now() - (g.shown[qi] || Date.now()), boom = !!g.boom[qi];
    const fast = ok && (g.mode === "millionaire" ? el <= MIL_SEC * 1000 : g.mode === "bomb" ? !boom : el <= GAME_FAST);
    let pts = 0, combo = 0;
    if(ok){
      g.streak++; combo = g.mode === "millionaire" ? 0 : Math.min(100, 20 * (g.streak - 1)); if(g.misses >= 2) g.comeback = true; g.misses = 0; if(fast) g.fast++;
      const pre = g.pre[qi] || {mult: 1, bonus: 0};
      pts = g.mode === "jeopardy" ? (state.cfJv || 200) * (qi === g.daily ? 2 : 1) + combo
        : g.mode === "bomb" ? (boom ? 50 : 100 + Math.round((BOMB_SEC * 1000 - el) / 100)) + combo
        : g.mode === "millionaire" ? 0
        : Math.round((100 + (fast ? 25 : 0)) * pre.mult + pre.bonus) + combo;
    } else { g.streak = 0; g.misses++; }
    g.best = Math.max(g.best, g.streak); g.pts += pts; g.log[qi] = {ok, pts, fast: fast && g.mode !== "bomb", combo, boom, at: Date.now()};
    sfx(ok ? "right" : "wrong");
    gamePaint(d);
    const card = document.querySelector(".cfg-card");
    if(card && pts){ const f = document.createElement("span"); f.className = "cfg-float"; f.textContent = `+${pts}`; card.appendChild(f); }
    if(ok && g.streak >= 3 && g.streak % 2 === 1){ const b = document.createElement("div"); b.className = "cfg-banner"; b.textContent = `🔥 ${g.streak} in a row!`; const c = document.querySelector(".cfg"); if(c) c.appendChild(b); if(typeof burstConfetti === "function" && g.streak >= 5) burstConfetti(); }
    const n = d.quiz.length, next = d.quiz.findIndex((_, i) => state.quizAnswers[i] === undefined);
    clearTimeout(state.cfGameT);
    state.cfGameT = setTimeout(() => { if(state.view !== "day" || state.dayViewMode !== "knowledgeCheck") return;
      if(g.mode === "jeopardy"){ state.cfJq = null; state.cfJAns = null; }
      if(next >= 0 && g.mode !== "jeopardy"){ state.quizQuestionIndex = next; gamePaint(d); }
      else if(next >= 0) gamePaint(d);   // Jeopardy: back to the board, the trainee picks the next square
      else { state.quizQuestionIndex = n - 1; state.cfGameShow = null; gamePaint(d); sfx("level"); if(typeof burstConfetti === "function") burstConfetti(); countUp(); } }, ok ? 1300 : 1700);
  }
});
function countUp(){   // the tally counts up
  document.querySelectorAll(".cfg-count").forEach(el => { const to = +el.dataset.to || 0, t0 = performance.now(), m = !!el.dataset.money;
    const step = t => { const k = Math.min(1, (t - t0) / 900), v = Math.round(to * (1 - Math.pow(1 - k, 3))); el.textContent = m ? money(Math.round(v)) : v.toLocaleString(); if(k < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step); });
}
if(typeof renderQuiz === "function"){
  const __quiz = renderQuiz;
  const quiz = function(d){
    if(!d || !d.cf) return __quiz.apply(this, arguments);
    if(state.quizSubmitted) return relabel(cfResult(d), d);
    const mods = kcMods(d), done = mods.filter(x => !modMissing(x.b, x.mod.id)).length, answered = Object.keys(state.quizAnswers || {}).length;
    const part = state.cfKcPart === "written" && state.cfKcDay === d.id ? "written" : "quiz";
    const step = (k, label, sub) => `<button type="button" class="cf-kc-step${part === k ? " on" : ""}" onclick="cmCaseFlow.kcPart('${k}')"><b>${label}</b><small>${sub}</small></button>`;
    const steps = `<div class="cf-kc-steps">${step("quiz", `① ${(GAMES[(state.cfGame && state.cfGame.day === d.id && state.cfGame.mode) || (state.cfGameMode || {})[d.id] || GAME_DAY[d.cf.n]] || GAMES.millionaire).icon} The Quiz Game`, `${answered} of ${d.quiz.length} played`)}${step("written", "② Bonus round: your key takeaway", `${done} of ${mods.length} written${takeawayScore(d).pct == null ? " · graded when you submit" : ` · graded ${takeawayScore(d).pct}%`}`)}</div>`;
    const prog = (state.progress || {})[d.id];
    const head = `<div class="cf-kc-head"><button type="button" class="cf-kc-back" onclick="cmCaseFlow.kcBack(${d.id})" title="Back to the slide you were on">← Lessons</button>
      <b>Case Flow Day ${d.cf.n} · ${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</b><span class="tag">Knowledge Check · ${d.quiz.length} questions</span>
      ${prog && prog.done ? `<span class="cf-kc-passed" title="Your best score is kept; you can retake it any time">✓ Passed · best ${E(prog.score)}%</span>` : ""}</div>`;
    if(part === "written") return head + steps + writtenPart(d);
    return head + steps + gameQuiz(d);
  };
  renderQuiz = quiz; window.renderQuiz = quiz;
}

/* The results' Answer Review: the day's 20 questions as a 4 × 5 grid of compact cards (the question, your pick, the
   right answer when you missed it, the reason on hover), so the whole review fits one screen */
if(typeof window.renderAnswerFeedback === "function"){
  const __af = window.renderAnswerFeedback;
  window.renderAnswerFeedback = function(d){
    if(!d || !d.cf) return __af.apply(this, arguments);
    const el = document.getElementById("answerFeedback"); if(!el) return;
    el.innerHTML = `<h2 class="cf-ans-h">Answer Review</h2><div class="cf-ans-grid">${d.quiz.map((q, i) => {
      const p = state.quizAnswers[i], ok = p === q.a;
      return `<div class="cf-ans ${ok ? "ok" : "no"}" title="${E(q.r)}"><p><b>${i + 1}.</b> ${E(q.q)}</p>
        <div class="cf-ans-pick">${ok ? "✅" : "❌"} ${typeof p === "number" ? E(q.opts[p]) : "(not answered)"}</div>
        ${ok ? "" : `<div class="cf-ans-right">✓ ${E(q.opts[q.a])}</div>`}</div>`; }).join("")}</div>`;
    if(typeof kcFit === "function") setTimeout(kcFit, 0);
  };
}
/* ---------- the trainee's actions ---------- */
let draftTimer = null;
function readForm(modId){
  const m = rec(modId), n = (document.querySelectorAll(`.cf-ss[data-mod="${modId}"] textarea`) || []).length;
  for(let j = 0; j < n; j++){ const el = document.getElementById(`cfss_${modId}_${j}`); if(el) m.answers[j] = el.value; }
  return m;
}
const status = (modId, t) => { const el = document.getElementById(`cfss_st_${modId}`); if(el) el.textContent = t; };
window.cmCaseFlow = Object.assign(window.cmCaseFlow || {}, {
  draft(modId){ readForm(modId); clearTimeout(draftTimer); draftTimer = setTimeout(() => { persist(); status(modId, "Draft saved"); }, 900); },
  rate(modId, j, n){ rec(modId).scale[j] = n; persist(); },
  reveal(blockId){ (REC.revealed = REC.revealed || {})[blockId] = new Date().toISOString(); persist(); justRevealed = blockId; if(typeof render === "function") render(); justRevealed = null; },   // the answers clear from blurred on this one render
  tick(blockId, j, on){ REC.ticks = REC.ticks || {}; (REC.ticks[blockId] = REC.ticks[blockId] || [])[j] = !!on; persist(); },
  kcDraft(modId, j, v){ rec(modId).kc[j] = v; clearTimeout(draftTimer); draftTimer = setTimeout(() => { persist(); status(modId, "Draft saved"); }, 900); },
  async save(modId){ const m = readForm(modId); m.savedAt = new Date().toISOString(); await persist(); status(modId, "Saved " + new Date(m.savedAt).toLocaleString()); },
  kcMod(modId){ const cur = document.querySelector(".cf-kc-mod"); if(cur) readForm(cur.dataset.mod); persist(); state.cfKcMod = modId; gamePaint(DAYS.find(x => x.id === state.dayId)); },
  kcBack(dayId){ const d = cfDay(dayId) || cfDay(state.dayId); state.dayViewMode = "slides"; state.lessonSlide = typeof resumeSlideFor === "function" ? resumeSlideFor(d.id) : 0; state.slidePage = 0; render(); },
  kcPart(part){ state.cfKcPart = part; state.cfKcDay = state.dayId; gamePaint(DAYS.find(x => x.id === state.dayId)); window.scrollTo({top: 0, behavior: "smooth"}); },
  scoreSummary(){ return scoreSummary(); },
  async kcSubmit(dayId){
    const d = cfDay(dayId); if(!d) return;
    if(Object.keys(state.quizAnswers || {}).length < d.quiz.length){ if(typeof toast === "function") toast(`Answer all ${d.quiz.length} quiz questions first.`); return cmCaseFlow.kcPart("quiz"); }
    document.querySelectorAll(".cf-kc-mod .cf-ss").forEach(el => readForm(el.dataset.mod));
    const miss = kcMods(d).find(x => modMissing(x.b, x.mod.id));
    if(miss){
      if(typeof toast === "function") toast(`${miss.b.title}: ${modMissing(miss.b, miss.mod.id)} first.`);
      state.cfKcMod = miss.mod.id; gamePaint(d);   // its tab
      return;
    }
    clearQuizDraft(dayId);
    await persist();
    state.cfKcPart = "quiz";
    return submitQuiz(dayId);
  },
  async autoReview(dayId){
    const d = cfDay(dayId); if(!d) return;
    for(const {b, mod} of kcMods(d)){
      const m = rec(mod.id);
      if(modMissing(b, mod.id) || (m.ai && m.ai.sig === kcSig(b, m))) continue;   // incomplete, or already scored as it stands
      state.cfReviewing = Object.assign(state.cfReviewing || {}, {[mod.id]: true});
      const el = document.getElementById(`cfkc_rv_${mod.id}`); if(el) el.textContent = "Reviewing…";
      try{ await cmCaseFlow.review(dayId, mod.id, true); }catch(e){}
      state.cfReviewing[mod.id] = false;
      const res = document.getElementById(`cfkc_res_${mod.id}`); if(res) res.innerHTML = kcChip(mod.id);
      const tk = document.getElementById(`cfkc_take_${dayId}`); if(tk) tk.innerHTML = takeawayHtml(d);
    }
    await saveTakeaway(d);
    const tk = document.getElementById(`cfkc_take_${dayId}`); if(tk) tk.innerHTML = takeawayHtml(d);
  },
  async review(dayId, modId, auto){
    const d = cfDay(dayId), m = auto ? rec(modId) : readForm(modId);
    const mod = allMods().map(x => x.m).find(x => x.id === modId);
    const b = mod.blocks.find(x => x.kind === "check");
    if(auto && modMissing(b, modId)) return;
    if(modMissing(b, modId)){ if(typeof toast === "function") toast(`${b.title}: ${modMissing(b, modId)} first.`); return; }
    m.savedAt = new Date().toISOString(); await persist();
    if(typeof runRubricEvaluation !== "function"){ status(modId, "Saved. The AI reviewer isn't available here; your trainer will review it."); return; }
    status(modId, "Reviewing…");
    const c = CF.case, day = CF.days.find(x => x.id === dayId);
    const label = `Day ${dayId} · Case Flow Day ${d.cf.n} · ${b.title} — CM Self-Summary`;   // "Day <id>" files it under this day, by its id
    const ctx = `Case: ${c.style}, ${c.type}. Lead Counsel ${c.counsel}. DOL ${c.dol}; SOL ${c.sol}. Client ${c.client.name}, ${c.client.position}. `
      + `Coverage stack (in order): ${stackLayers().map(l => `${l.tag} ${money(l.limit)} (${l.carrier})`).join(" → ")} = ${money(c.total)}. `
      + `Health Plan ${c.health.carrier} (${c.health.memberId}). Critical fact: ${c.critical}\n`
      + (day && (day.fileState || []).length ? `Where the file stands on Case Flow Day ${day.n} (${day.phase}): ${day.fileState.join(" ")}\n` : "")
      + `Module: ${mod.title} — ${mod.about}\nThe module's knowledge-verification questions were:\n- ${b.check.questions.join("\n- ")}`;
    const text = `The trainee's takeaway (one written answer for this module):\n${takeawayOf(b)}\n${m.answers[0] || ""}`;
    const notes = `This is a short takeaway (a few sentences), not a full write-up: grade the understanding it shows, not its length. Grade against this module's rubric. AI criteria: ${b.rubric.ai.map(r => `${r[0]} (${r[1]}%): ${r[2]}`).join("; ")}. `
      + `A trainer separately assesses: ${b.rubric.trainer.map(r => r[0]).join(", ")}. `
      + `UPL is a gate: if the trainee proposes giving the client legal advice (case value, merits, what silence does to their rights, announcing withdrawal), score Risk Mitigation 0 and say so. `
      + `Use the case facts above; numbers that contradict them (limits, dates, order of the stack, the 14-day gap, the figures for this day) are accuracy errors.`;
    try{
      const rep = await runRubricEvaluation(label, ctx, text, notes);
      m.ai = {score: Math.round(rep.totalScore), tier: rep.gradeTier || "", strengths: (rep.strengths || []).slice(0, 3),
              gaps: (rep.blindspots || []).slice(0, 3), growth: (rep.growthSuggestions || []).slice(0, 2), at: new Date().toISOString(), sig: kcSig(b, m)};
      await persist();
      status(modId, "Reviewed");
    }catch(e){
      status(modId, e && e.invalidInput ? (e.message || "Add more detail and try again.") : "Saved. The AI review didn't complete; your trainer will still see your answers.");
    }
    const res = document.getElementById(`cfss_res_${modId}`); if(res) res.innerHTML = scoreHtml(modId);
  }
});

/* the results PDF carries the takeaways' grades under the quiz result */
if(typeof window.downloadQuizResultPdf === "function"){
  const __pdf = window.downloadQuizResultPdf;
  window.downloadQuizResultPdf = async function(dayId){
    const d = cfDay(dayId), mk = window.buildAndSavePdf;
    if(!d || typeof mk !== "function") return __pdf.apply(this, arguments);
    const t = takeawayScore(d);
    const add = ["Takeaways (bonus round, AI-graded against each module's rubric): " + (t.pct == null ? "not graded yet" : `${t.pct}% average (${t.graded} of ${t.n} graded)`)]
      .concat(kcMods(d).map(({b, mod}) => { const a = rec(mod.id).ai; return `   ${b.title}: ${a && typeof a.score === "number" ? a.score + "%" + (a.tier ? " — " + a.tier : "") : "not graded yet"}`; }));
    window.buildAndSavePdf = function(title, sub, lines){ if(Array.isArray(lines)) lines.splice(1, 0, ...add); return mk.apply(this, arguments); };
    try{ return await __pdf.apply(this, arguments); }finally{ window.buildAndSavePdf = mk; }
  };
}
/* the takeaway score beside the quiz, where a trainer reads a trainee's days */
if(typeof window.renderAdminDetail === "function"){
  const __detail = window.renderAdminDetail;
  window.renderAdminDetail = function(rec){
    let out = __detail.apply(this, arguments);
    const dp = (rec && rec.dayProgress) || {};
    DAYS.forEach(d => { const p = dp[d.id]; if(!p || typeof p.takeaway !== "number") return;
      const head = `<span>Day ${d.id} — ${E(d.title)}</span>`, i = out.indexOf(head); if(i < 0) return;
      const j = out.indexOf("</span>", out.indexOf("<span", i + head.length)); if(j < 0) return;
      out = out.slice(0, j) + ` · takeaways ${p.takeaway}%` + out.slice(j); });
    return out;
  };
}
if(typeof window.evidenceText === "function"){
  const __ev = window.evidenceText;
  window.evidenceText = function(ev){
    const t = __ev.apply(this, arguments);
    return ev && ev.dp && typeof ev.dp.takeaway === "number" ? `${t}\nKnowledge Check takeaways (bonus round, AI-graded against each module's rubric): ${ev.dp.takeaway}% average.` : t;
  };
}

/* ---------- the dashboard: the Case Flow is the program ----------
   The engine draws the dashboard from DAYS, the Case Flow's days, so the day cards, the banner's day
   circles, the stats band and the certificate are all the Case Flow's; on screen the days are 1–5. */
if(typeof renderDashboard === "function"){
  const __dash = renderDashboard;
  renderDashboard = function(){
    const t = document.createElement("template");
    t.innerHTML = relabelAll(__dash.apply(this, arguments));
    t.content.querySelectorAll(".step-circle").forEach(c => { const d = cfDay(c.textContent.trim()); if(d) c.textContent = String(d.cf.n); });   // the circles show 1–5, not the ids
    return t.innerHTML;
  };
}

/* ---------- 🎯 My Focus: its trainer-feedback chips and the day's feedback pop-up name Case Flow Days 1–5 ---------- */
if(typeof renderWorkOnNextPanel === "function"){
  const __won = renderWorkOnNextPanel;
  renderWorkOnNextPanel = function(){ return relabelAll(__won.apply(this, arguments)); };
}
if(typeof openDayFeedback === "function"){
  const __dayFb = openDayFeedback;
  openDayFeedback = window.openDayFeedback = function(){
    const r = __dayFb.apply(this, arguments);   // the pop-up is on the page before its first await
    document.querySelectorAll(".fb-modal .mh-day").forEach(n => { n.textContent = relabelAll(n.textContent); });
    return r;
  };
}

/* ---------- the Admin page: each trainee's progress and audit count the Case Flow's days ---------- */
if(typeof adminDayStats === "function"){
  adminDayStats = function(rec){
    // the record may still hold old Apex days (1–5): count only the Case Flow's
    const dp = rec.dayProgress || {}, ps = MODULES.map(d => dp[d.id]).filter(Boolean);
    const scores = ps.filter(p => typeof p.score === "number").map(p => p.score);
    return {done: ps.filter(p => p.done).length, total: MODULES.length, avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0};
  };
}
if(typeof renderAuditStrip === "function"){
  const __strip = renderAuditStrip;
  renderAuditStrip = function(rec){
    // the strip's day cells show the day's number (11–15 inside); on screen they're Case Flow Days 1–5
    const html = __strip.apply(this, arguments)
      .replace(/\bDay ((?:1[1-5])(?:, 1[1-5])+)\b/g, (m, list) => "Case Flow Day " + list.split(", ").map(x => cfDay(x).cf.n).join(", "))   // "below 70%: Day 11, 12"
      .replace(/(<span class="ad-cell[^"]*" title="[^"]*">)(1[1-5])/g, (m, a, id) => a + cfDay(id).cf.n);
    return relabelAll(html);
  };
}

/* Every Admin tab (the Trainee Audit, Trainer Cues, the SOP, Activities) names the days as on screen: Case Flow Day 1–5, never their ids */
if(typeof window.renderAdmin === "function"){
  const __admin = window.renderAdmin;
  /* An admin opening the course from the Portal can reach the Admin screen a moment before their sign-in has settled
     (the Portal's ticket is still being exchanged, or the admin session is in but not yet applied): wait for it, for up
     to 10 seconds, instead of saying "Admin access required" (which a second try from the Training Directory then fixed). */
  let adminWaits = 0;
  const signingIn = () => !!(state.adminToken || document.getElementById("portal-cover-msg"));
  window.renderAdmin = function(){
    if(!state.isAdmin && !state.adminPreview && signingIn() && adminWaits < 20){
      adminWaits++;
      setTimeout(async () => {
        if(state.view !== "admin" || state.isAdmin) return;
        try{ if(state.adminToken && typeof authStatus === "function" && (await authStatus())) state.isAdmin = true; }catch(e){}
        if(state.view === "admin") render();
      }, 500);
      return `<div class="card" style="padding:40px;text-align:center;"><div style="font-size:30px;margin-bottom:10px;">🛡</div><h2 style="color:var(--navy);margin:0;">Opening the admin screen…</h2></div>`;
    }
    if(state.isAdmin) adminWaits = 0;
    if(state.adminTab === "attendance") state.adminTab = "audit"; return groupAdminTabs(relabelAll(__admin.apply(this, arguments)).replace("Knowledge Checks, Skill Builders and your day-by-day", "Knowledge Checks, Skill Activities and your day-by-day")); };   // (attendance is on the Main Portal now)
}

/* ---------- the trainer's 40%: entered in each trainee's Admin panel ---------- */
const allMods = () => CF.days.flatMap(day => day.modules.map(m => ({day, m})));
/* each module's Learning Check, in the order the course teaches them: {n: the day, phase, m: its module, b: the check} */
const checksTaught = () => MODULES.flatMap(d => d.lessons.filter(l => l.cf.block.kind === "check").map(l => ({n: d.cf.n, phase: l.cf.phase, m: l.cf.mod, b: l.cf.block})));
/* the trainee's case year (js/cm-case-dates.js): their answers quote that year's dates */
function caseYearNote(mine){
  if(!DATES) return "";
  const y = DATES.yearForRecord(mine);
  return `<p class="cf-note">📅 <b>Case year ${E(y)}</b>: this trainee's file has the collision on ${E(DATES.text("02/06/2026", DATES.shiftFor(y)))}, and their answers quote that year's dates.${y !== DATES.year ? ` You are seeing ${E(DATES.year)}: <a href="?caseYear=${E(y)}">see the course in ${E(y)}</a>.` : ""}</p>`;
}
let snapDocFiling = null;   // the trainee's doc-filing record, while their trainer panel is drawn
function workLogged(mine, m){
  const rows = m.blocks.filter(x => x.kind === "activity").map(x => ({x, w: (mine.work || {})[x.id]})).filter(r => r.w);
  const heard = m.blocks.filter(x => x.kind === "activity" && ((mine.listen || {})[x.id] || {}).at).map(x => { const h = mine.listen[x.id], ev = SIM.events[x.id]; return `<div class="cf-tr-work"><b>🎧 Listening Check (${E(x.title)}):</b> ${E(h.score)}/${E((ev.listen || []).length)} caught · played ${E(h.plays)}×${(ev.listen || []).map((q, j) => `<br>${h.got[j] ? "✓" : "✗"} ${E(q.q)} <i>${E(h.answers[j] || "—")}</i>`).join("")}</div>`; }).join("");
  const aud = m.blocks.filter(x => x.kind === "activity" && EX.audits[x.id] && ((mine.audits || {})[x.id] || {}).at).map(x => {
    const a = EX.audits[x.id], r = mine.audits[x.id], sc = a.items.reduce((n, it, i) => n + (r.marks[i] === it.verdict ? 1 : 0), 0);
    return `<div class="cf-tr-work"><b>🔍 ${E(a.title)}:</b> ${E(sc)}/${E(a.items.length)} called correctly · handed in ${E(new Date(r.at).toLocaleDateString())}${a.items.map((it, i) => `<br>${r.marks[i] === it.verdict ? "✓" : "✗"} ${E(it.ref)} ${E(it.what)} — called <i>${E((VERDICT[r.marks[i]] || {}).label || "—")}</i>${r.notes[i] ? `: “${E(r.notes[i])}”` : ""}`).join("")}</div>`;
  }).join("");
  const svs = m.blocks.filter(x => x.kind === "activity" && EX.emails[x.id] && ((mine.service || {})[x.id] || {}).sent).map(x => {
    const e = EX.emails[x.id], r = mine.service[x.id], c = r.choice != null ? e.press.choices[r.choice] : null;
    return `<div class="cf-tr-work"><b>✉ ${E(e.title)}:</b> sent after ${E(r.tries || 0)} rejected attempt${(r.tries || 0) === 1 ? "" : "s"}${c ? ` · follow-up answered ${c.ok ? "correctly" : "wrongly"}: “${E(c.label)}”` : " · follow-up not answered"}${r.filed ? ` · filed as <code>${E(r.filed.name)}</code> under ${E(r.filed.category)}` : " · not filed"}${r.drive ? " · backed up to Drive" : ""}<br><i>${E(r.body || "—")}</i></div>`;
  }).join("");
  const nps = m.blocks.filter(x => x.kind === "activity" && EX.notes[x.id] && ((mine.notes || {})[x.id] || {}).txAt).map(x => {
    const n = EX.notes[x.id], r = mine.notes[x.id], pl = n.plan.required;
    return `<div class="cf-tr-work"><b>📝 ${E(n.title)}:</b> transcript ${E(r.txGot.filter(Boolean).length)}/${E(n.transcribe.facts.length)} facts caught${r.planAt ? ` · plan ${E(r.planGot.filter(Boolean).length)}/${E(pl.length)} steps` : " · plan not handed in"}${(n.emails || []).map(e => { const mm = (r.mails || {})[e.id] || {}; return ` · ${E(e.title.replace(/^Email Simulator — /, ""))}: ${mm.sent ? `sent after ${E(mm.tries || 0)} rejected attempt${(mm.tries || 0) === 1 ? "" : "s"}` : "not sent"}`; }).join("")}${n.call ? ` · call ${(mine.calls || {})[x.id] ? "taken" : "not taken"}` : ""}
      <br><i>Transcript:</i> ${E(r.tx || "—")}${r.planAt ? pl.map((q, i) => `<br>${r.planGot[i] ? "✓" : "✗"} ${E(q.label)}`).join("") + `<br><i>Plan:</i> ${E(r.plan)}` : ""}${(n.emails || []).filter(e => ((r.mails || {})[e.id] || {}).sent).map(e => `<br><i>${E(e.title)}:</i> ${E(r.mails[e.id].body)}`).join("")}</div>`;
  }).join("");
  const ams = m.blocks.filter(x => x.kind === "activity" && EX.amendments[x.id] && ((mine.amend || {})[x.id] || {}).screened).map(x => {
    const a = EX.amendments[x.id], r = mine.amend[x.id], asked = amAsked(a), filing = (snapDocFiling || {});
    const sc = a.screen.reduce((n, s) => n + ((r.marks[s.doc] === AM_FIX) === asked.has(s.doc) ? 1 : 0), 0);
    return `<div class="cf-tr-work"><b>📝 ${E(a.title)}:</b> screening ${E(sc)}/${E(a.screen.length)}${a.screen.filter(s => (r.marks[s.doc] === AM_FIX) !== asked.has(s.doc)).map(s => ` · ✗ ${E(s.doc)} called ${r.marks[s.doc] === AM_FIX ? "wrong at its source" : "fit to use"}`).join("")}
      ${a.requests.map(q => { const t = (r.req || {})[q.doc] || {}, c = q.next && t.choice != null ? q.next.choices[t.choice] : null, f = q.corrected ? (filing[q.corrected] || {}) : null;
        return `<br>${t.sent ? "✓" : "…"} <b>${E(q.doc)}</b> ${t.sent ? `sent after ${E(t.tries || 0)} refused attempt${(t.tries || 0) === 1 ? "" : "s"}` : `not sent (${E(t.tries || 0)} refused)`}${(t.log || []).map((l, k) => ` · try ${k + 1}: ${l.short ? "too short" : [].concat((l.tripped || []).map(id => "tripped " + id), (l.missing || []).length ? ["missing " + l.missing.join(", ")] : []).join("; ")}`).join("")}${c ? ` · next step ${c.ok ? "right" : "wrong"}: “${E(c.label)}”` : ""}${f ? (f.filed ? ` · ${E(q.corrected)} filed as <code>${E(f.name)}</code>${f.attempts === 1 ? " (first time right)" : ` (${E(f.attempts)} attempts)`}` : ` · ${E(q.corrected)} not filed`) : ""}${t.body ? `<br><i>${E(t.body)}</i>` : ""}`; }).join("")}</div>`;
  }).join("");
  const extra = aud + svs + ams + nps;
  if(heard) return heard + extra + (rows.length ? `<div class="cf-tr-work"><b>🧾 Work logged in the tools:</b> ${rows.map(({x, w}) => `${E(x.title)}: <code>${E(w.ref)}</code> (${E((TOOL[w.tool] || TOOL.cms).short)})`).join(" · ")}</div>` : "");
  if(extra) return extra + (rows.length ? `<div class="cf-tr-work"><b>🧾 Work logged in the tools:</b> ${rows.map(({x, w}) => `${E(x.title)}: <code>${E(w.ref)}</code> (${E((TOOL[w.tool] || TOOL.cms).short)})`).join(" · ")}</div>` : "");
  return rows.length ? `<div class="cf-tr-work"><b>🧾 Work logged in the tools:</b> ${rows.map(({x, w}) => `${E(x.title)}: <code>${E(w.ref)}</code> (${E((TOOL[w.tool] || TOOL.cms).short)})`).join(" · ")}</div>` : "";
}
const NET_LABEL = {recovery: "Track A · settlement", liens: "Track A · liens", final: "Track A · final", litigation: "Track B · case won"};
function netLogged(snap, m){
  const ns = snap["net-sheet"], stage = (m.blocks.map(x => NET_STAGE[x.id]).filter(Boolean))[0];
  const sheet = ns && (ns.files ? ns.files[stage === "litigation" ? "B" : "A"] : ns), r = stage && sheet && sheet.checks && sheet.checks[stage];
  return r ? `<div class="cf-tr-work"><b>📊 Net Sheet (${E(NET_LABEL[stage])}):</b> ${E(r.passed)}/${E(r.total)} tie out · checked ${E(new Date(r.at).toLocaleDateString())}${r.items.filter(x => !x.ok).map(x => ` · ✗ ${E(x.cell)} = ${E(x.got)}`).join("")}</div>` : "";
}
function trainerPanel(rec){
  const work = (state.traineeWork || {})[rec.id];
  if(!work || work.loading || !work.feedback) return "";
  const mine = (work.snap || {})[KEY] || {modules: {}}, given = work.feedback.caseFlow || {}, sid = cssId(rec.id);
  snapDocFiling = (work.snap || {})["doc-filing"] || null;
  const rows = checksTaught().map(({n, phase, m, b}) => {
    const r = mine.modules[m.id] || {}, t = given[m.id] || {};
    const c = composite(Object.assign({}, r, {trainer: t}));
    const answered = (r.answers || []).some(a => String(a || "").trim());
    return `<details class="cf-tr"><summary><b>Case Flow Day ${n} · ${phase.lead === "Case Phase" ? `Case Phase ${phase.n}` : E(phase.lead)}</b> ${E(b.title)}
        <span class="cf-tr-chips">${r.quiz ? `<span class="fb-chip sent">Quiz ${E(r.quiz.pct)}%</span>` : ""}${r.ai ? `<span class="fb-chip sent">AI ${E(r.ai.score)}%</span>` : ""}${typeof t.score === "number" ? `<span class="fb-chip sent">Trainer ${E(t.score)}%</span>` : (answered ? `<span class="fb-chip draft">To score</span>` : `<span class="fb-chip none">No summary yet</span>`)}${c.c != null ? `<span class="fb-chip sent">Composite ${E(c.c)}%</span>` : ""}</span></summary>
      ${answered ? `<div class="fb-evidence">${(r.kc || []).some(Boolean) ? b.check.questions.map((q, j) => `<div><b>KC ${j + 1}. ${E(q)}</b><br>${E((r.kc || [])[j] || "—")}</div>`).join("") : ""}${b.check.summary.map((q, j) => `<div><b>${E(q)}</b><br>${E((r.answers || [])[j] || "—")}</div>`).join("")}
        <div><b>Self-ratings:</b> ${b.check.scale.map((x, j) => `${E(x)}: ${E((r.scale || [])[j] || "—")}`).join(" · ")}</div></div>` : ""}
      ${workLogged(mine, m)}${netLogged(work.snap || {}, m)}
      <div class="cf-tr-rubric"><b>Assess against:</b> ${b.rubric.trainer.map(x => `${E(x[0])} (${E(x[1])})`).join(" · ")} — UPL is a gate, not a weighting.</div>
      <div class="fbc-row"><label>Trainer score (0–100)<input type="number" min="0" max="100" id="cftr_${sid}_${m.id}" value="${typeof t.score === "number" ? E(t.score) : ""}"></label></div>
      <label class="fbc-full">Comment for the trainee<textarea id="cftc_${sid}_${m.id}" rows="2">${E(t.comment || "")}</textarea></label>
      <div class="fbc-actions"><button class="btn btn-primary btn-sm" onclick="cmCaseFlow.trainerSave('${rec.id}','${m.id}')">Save trainer score</button></div>
    </details>`;
  }).join("");
  return `<div class="fb-admin cf-tr-wrap"><div class="sidebar-section-lbl" style="padding-left:0;">Case Flow — trainer assessment (40%)</div>
    <p class="cf-note">The trainee's quiz share and AI review make the automated 60%. Your score here makes the 40%; the composite appears on their Knowledge Check once both are in.</p>${caseYearNote(mine)}${rows}</div>`;
}
window.cmCaseFlow.trainerSave = async function(id, modId){
  const sid = cssId(id), work = (state.traineeWork || {})[id];
  const v = Number((document.getElementById(`cftr_${sid}_${modId}`) || {}).value);
  if(!work || !(v >= 0 && v <= 100) || String((document.getElementById(`cftr_${sid}_${modId}`) || {}).value).trim() === ""){ if(typeof toast === "function") toast("Enter a score from 0 to 100."); return; }
  const latest = (await sharedGet("feedback:" + id).catch(() => null)) || work.feedback || {days: {}};   // re-read so a trainee's read-receipt isn't clobbered
  latest.days = latest.days || {};
  latest.caseFlow = Object.assign({}, latest.caseFlow, {[modId]: {score: Math.round(v), comment: String((document.getElementById(`cftc_${sid}_${modId}`) || {}).value || "").trim(), at: new Date().toISOString()}});
  const ok = await sharedSet("feedback:" + id, latest);
  if(!ok){ if(typeof toast === "function") toast("Couldn't save the trainer score — try again."); return; }
  work.feedback = latest;
  if(typeof toast === "function") toast("Trainer score saved — the trainee sees it on their Knowledge Check.");
  const wrap = document.getElementById("adminRowsWrap"); if(wrap && typeof renderAdminRows === "function") wrap.innerHTML = renderAdminRows();
};
if(typeof renderFeedbackAdmin === "function"){
  const __fbAdmin = renderFeedbackAdmin;
  renderFeedbackAdmin = function(rec){
    // Day-by-Day Feedback lists the Case Flow's days
    const html = relabelAll(__fbAdmin.apply(this, arguments)).replace(/Case Flow Day (\d)(<\/b>)? — Case Flow Day \1 · /g, "Case Flow Day $1$2 — ");   // not "Case Flow Day 1 — Case Flow Day 1 · …"
    try{ return html + trainerPanel(rec); }catch(e){ return html; }
  };
}

/* ---------- the Case File page: John Doe v. Robert Smith ----------
   The Client Profile is this file's (CF.profile), for every trainee and trainer. Each section opens with its Case Flow day (`opens`) or once that day is passed (`passed`),
   so the profile never gives away a day's answers; trainers see every section. */
const cfIdOf = n => (cfDayByN(n) || {}).id;
/* The Case File's fact cards are the answer key — the audited specials, the fork, Track A's net sheet, how
   the suit ends — so they are the trainer's: a trainee builds the file from the documents and their own
   work in the CMS, and sees their own timeline here, not the answers. */
const profileOpen = () => isTrainer();
// the Case File page is one screen: its parts are tabs, not a column to scroll. The timeline is everyone's;
// the fact tabs (CF.profile `group`) are the trainer's.
const CF_FILE_TABS = [
  {id: "now", label: "📅 So Far", title: "The case so far"},
  {id: "file", label: "📂 The File", title: "The file: the client, the people, the collision, the retainer"},
  {id: "cover", label: "🛡 Coverage & PD", title: "Coverage, the $40,000 stack and the property damage claim"},
  {id: "care", label: "🩺 Treatment", title: "Injury, treatment, the disruption and the 14-day gap"},
  {id: "money", label: "💵 Demand", title: "The specials, the demand and the settlement"},
  {id: "suit", label: "🏛 Into Suit", title: "Track B: the stonewall, impasse and suit"},
  {id: "won", label: "🏆 Case Won", title: "Track B: where the suit stands, and how it ends"}
];
/* the whole case: the shared file, the two workstreams that run in parallel (each with "you are here"), then the file again */
/* an activity's track: A (the demand, settlement, liens and disbursement) or B (the litigation fork and its close-out);
   none before the file forks */
const trackOf = modId => /^d4m|^d5m[1-5]$/.test(modId) ? "B" : /^d3m/.test(modId) ? "A" : "";
/* where the trainee's file stands: the newest event of each activity they have opened, overall and per workstream */
function caseNow(){
  const now = {"": NaN, claims: NaN, care: NaN}, max = (a, b) => isNaN(a) ? b : Math.max(a, b);
  let trackA = false, trackB = false;
  MODULES.forEach(d => d.lessons.forEach(l => {
    const id = l.cf.block.id, e = SIM.events[id];
    if(l.cf.block.kind !== "activity" || !e || !actOpened(id)) return;
    const t = dayMs(e.date); now[""] = max(now[""], t);
    if(l.cf.lane) now[l.cf.lane] = max(now[l.cf.lane], t);
    const m = l.cf.mod.id;   // Track A: the demand, settlement, liens and disbursement (d3m*); Track B: the litigation fork and its close-out
    const tk = trackOf(m); if(tk === "B") trackB = true; else if(tk === "A") trackA = true;
  }));
  return {now, track: trackB ? "B" : trackA ? "A" : ""};
}
const fmtMs = t => { const d = new Date(t); return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`; };
/* one screen: each event is a date button; its label pops up on hover, focus or tap */
const tlItem = (cls, label, date) => `<li class="${cls}"><button type="button" class="cf-tl-b" aria-label="${label} · ${date}"><i></i><small>${date.replace(/\/\d\d(\d\d)\b/, "/$1")}</small></button><b class="cf-tl-pop">${label}<span>${date}</span></b></li>`;
// a row is dated entries (events, then the file marker), drawn in date order; on the same day the event comes first
const tlRow = es => `<ol class="cfx-tl cfx-tl-full">${es.filter(Boolean).sort((a, b) => a.t - b.t || a.r - b.r).map(e => e.h).join("")}</ol>`;
/* The Case So Far. A trainee sees the whole path of their file from the start, on the dates of their own case year and
   CMS date of loss (js/cm-case-dates.js has already moved SIM.timeline): the dates they have worked light up and are
   joined by the trace, "You are here" sits on the newest file date of an activity they have opened, and the dates
   ahead are hollow, their events unnamed until reached (the timeline never gives away what happens next). */
function caseTimeline(n){
  if(!(SIM.timeline || []).length) return "";
  if(!isTrainer()){
    const {now, track} = caseNow();
    const path = SIM.timeline.filter(m => !m.track || m.track === (track || "A"));   // before the fork, the path ahead is Track A's
    const reached = m => dayMs(m.date) <= (m.lane ? now[m.lane] : now[""]);   // false while nothing is opened (NaN)
    const ev = m => ({t: dayMs(m.date), r: 0, h: reached(m) ? tlItem("past", E(m.label), E(m.date)) : tlItem("next", "Ahead on the file", E(m.date))});
    // a row's events with its marker: on the date of an event the trainee has reached, that event is where they are
    const trace = (list, t) => { const on = isNaN(t) ? null : list.find(m => dayMs(m.date) === t && reached(m));
      return list.map(m => m === on ? {t, r: 0, h: tlItem("here", "You are here: " + E(m.label), E(m.date))} : ev(m)).concat(!isNaN(t) && !on ? [{t, r: 1, h: tlItem("here", "You are here", E(fmtMs(t)))}] : []); };
    const done = path.filter(reached).length;
    const head = `<h3>📅 The Case So Far</h3><p class="cf-tl-sum">${done ? `You've worked <b>${done} of ${path.length}</b> dates on John Doe's file` : "The path of John Doe's file: it lights up as you work it"}</p>`;
    const laned = path.filter(m => m.lane);
    if(!laned.length) return `<div class="card cf-timeline cf-trace">${head}${tlRow(trace(path, now[""]))}</div>`;
    // the shared file, the two workstreams side by side (each with its own marker), then the file again
    const ts = laned.map(m => dayMs(m.date)), lo = Math.min(...ts), hi = Math.max(...ts);
    const before = path.filter(m => !m.lane && dayMs(m.date) < lo), after = path.filter(m => !m.lane && dayMs(m.date) > hi);
    const beyond = now[""] > hi, inLanes = !beyond && now[""] >= lo;   // where the overall marker belongs
    return `<div class="card cf-timeline cf-trace">${head}
      ${tlRow(trace(before, !beyond && !inLanes ? now[""] : NaN))}
      <div class="cf-lanes">${Object.entries(LANES).map(([k, name]) => `<div class="cf-lane cf-lane-${k}"><div class="cf-lane-h">${E(name)}</div>${tlRow(trace(laned.filter(m => m.lane === k), beyond ? NaN : now[k]))}</div>`).join("")}</div>
      ${tlRow(trace(after, beyond ? now[""] : NaN))}</div>`;
  }
  const track = n >= 4 ? "B" : n === 3 ? "A" : "";
  const items = SIM.timeline.filter(m => !m.track || !track || m.track === track);
  const first = cfDayByN(n) && cfDayByN(n).lessons.find(l => l.cf.block.kind === "activity" && SIM.events[l.cf.block.id]);
  const here = {"": first ? SIM.events[first.cf.block.id].date : ""};
  Object.keys(LANES).forEach(k => { const x = laneAt(k, n); here[k] = x ? x.e.date : ""; });
  // the events of a row, past or next against `at`, with the file marker at `at` when this row shows it
  const row = (list, at, mark = true) => { const t = dayMs(at);
    return list.map(m => ({t: dayMs(m.date), r: 0, h: tlItem(!isNaN(t) && dayMs(m.date) <= t ? "past" : "next", E(m.label) + (m.track ? " · Track " + E(m.track) : ""), E(m.date))}))
      .concat(mark && at && !isNaN(t) ? [{t, r: 1, h: tlItem("here", "The file is at", E(at))}] : []); };
  const laned = items.filter(m => m.lane), lo = Math.min(...laned.map(m => dayMs(m.date))), hi = Math.max(...laned.map(m => dayMs(m.date)));
  const before = items.filter(m => !m.lane && dayMs(m.date) < lo), after = items.filter(m => !m.lane && dayMs(m.date) > hi);
  const pastLanes = dayMs(here[""]) > hi;   // the file is beyond the workstreams: every one of their events is past, and the marker is in the row after
  const lastShared = pastLanes ? here[""] : "";
  return `<div class="card cf-timeline"><h3>📅 The Case So Far</h3>
    ${tlRow(row(before, here[""], dayMs(here[""]) < lo))}
    <div class="cf-lanes">${Object.entries(LANES).map(([k, name]) => `<div class="cf-lane cf-lane-${k}"><div class="cf-lane-h">${E(name)}</div>${tlRow(row(laned.filter(m => m.lane === k), pastLanes ? here[""] : here[k], !pastLanes))}</div>`).join("")}</div>
    ${tlRow(row(after, lastShared))}</div>`;
}
function caseFlowProfile(){
  const c = CF.case, secs = CF.profile || [], shown = secs.filter(profileOpen);
  const pos = dayUnlocked(cfIdOf(5)) ? 5 : [4, 3, 2, 1].find(n => dayUnlocked(cfIdOf(n))) || 1;
  // one card: the page's title and the client together (applyPageHero leaves an h1 that's already in a hero alone)
  return `<div class="cf-file-page"><section class="page-hero cf-file-hero">
      <div class="cf-file-head">
        <div class="cf-file-who"><p class="eyebrow">Case File</p><h1>📂 ${E(c.style)}</h1>
          <div class="cf-client"><span class="cf-client-k">📌 Your Client</span><b>${E(c.client.name)}</b><span>Matter ${E(c.no)} · Lead Counsel ${E(c.counsel)}</span></div></div>
      </div>
      <p class="cf-note">${isTrainer() ? `The whole file, as you know it: the key tabs are the answers, and trainees never see them.${DATES ? ` 📅 Case year ${E(DATES.year)} (collision ${E(DATES.dol())}); each trainee keeps the year they started on.${DATES.preview ? ` <b>Preview of ${E(DATES.year)}</b>: <a href="?caseYear=off">end it</a>.` : ""}` : ""}` : "Your case so far is below. The file itself is in 📁 Case Documents, and the case you build is in the 🗂 CMS."}</p>${dolNote()}</section>
    ${fileTabs(shown, pos)}
</div>`;
}
/* The page in tabs: one screenful each, laid out across the width instead of down a long column.
   Everyone gets 📅 The Case So Far; the fact tabs are the trainer's and are marked as such. */
function fileTabs(shown, pos){
  const tabs = CF_FILE_TABS.filter(t => t.id === "now" || shown.some(x => (x.group || "file") === t.id));
  const cur = tabs.some(t => t.id === state.cfFileTab) ? state.cfFileTab : "now";
  const secs = shown.filter(x => (x.group || "file") === cur);
  // the file's tabs (the trainer's) and, on the same line, the Case File | Documents switch
  const strip = `<div class="cf-file-tabs" role="tablist">
      ${tabs.length > 1 ? tabs.map(t => `<button type="button" role="tab" aria-selected="${t.id === cur}" title="${E(t.title)}${t.id === "now" ? "" : " — trainer only: trainees never see this tab"}" class="cf-file-tab${t.id === cur ? " on" : ""}${t.id === "now" ? "" : " key"}" onclick="cmCaseFlow.fileTab('${t.id}')">${E(t.label)}</button>`).join("") : ""}
      <div class="lsh-subtabs cf-docs-switch cf-file-switch"><button type="button" class="on" aria-selected="true">Case File</button><button type="button" onclick="goto('casedocs')">📁 Documents</button></div></div>`;
  return `<div class="cf-file-facts">${strip}
    ${cur === "now" ? caseTimeline(pos) : `<div class="cf-file-cols">${secs.map(x => `<div class="cf-file-sec"><h3>${E(x.title)}</h3><ul>${x.items.map(i => `<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}</div>`}</div>`;
}
/* the file's text at the largest size that still fits the screen (15px down to 11px) */
function fitFileCols(){
  const c = document.querySelector(".cf-file-page .cf-file-cols"); if(!c) return;
  let f = 15; c.style.fontSize = f + "px";
  while(c.scrollHeight > c.clientHeight + 1 && f > 11){ f -= 0.5; c.style.fontSize = f + "px"; }
}
window.addEventListener("resize", () => { clearTimeout(state.cfFileFitT); state.cfFileFitT = setTimeout(() => { try{ fitFileCols(); }catch(e){} }, 120); });
window.cmCaseFlow.fileTab = function(id){ state.cfFileTab = id; if(typeof render === "function") render(); };

/* ---------- the day's intro ("Before you start"): one screen ----------
   One wide card of the day's objectives, split where the sentence lists them (never inside brackets or a
   figure like $40,000), then what the day covers, one card per Case Phase, every topic shown. */
function objectivesOf(text){
  const out = []; let cur = "", depth = 0; const t = String(text || "");
  for(let i = 0; i < t.length; i++){
    const c = t[i];
    if(c === "(" || c === "[") depth++;
    else if((c === ")" || c === "]") && depth) depth--;
    if(!depth && (c === ";" || (c === "," && /\s/.test(t[i + 1] || "")) || (c === "." && /\s/.test(t[i + 1] || "")))){ out.push(cur); cur = ""; continue; }
    cur += c;
  }
  out.push(cur);
  return out.map(x => x.trim().replace(/^and\s+/i, "").replace(/\.$/, "")).filter(x => x.length > 8).map(x => x[0].toUpperCase() + x.slice(1));
}
if(typeof window.renderDayIntro === "function"){
  const __intro = window.renderDayIntro;
  window.renderDayIntro = function(d){
    if(!d || !d.cf) return __intro.apply(this, arguments);
    const objs = objectivesOf(d.objective);
    // two cards, the module's lifecycle in teaching order: each 📘 lesson segment and its 🧪 Skill Building, then the
    // 🎯 Knowledge Check (a long run under one heading shows as a count, so the day fits one screen)
    // one line a topic: its lessons → its Skill Building, in teaching order
    const segs = daySegments(d), rows = [];
    segs.forEach(p => { if(p.kind === "lesson" || !rows.length) rows.push({lesson: p.kind === "lesson" ? p : null, practice: p.kind === "practice" ? p : null}); else rows[rows.length - 1].practice = p; });
    const li = r => `<li><span aria-hidden="true">📘</span> <strong>${E(r.lesson ? r.lesson.title : "")}</strong> <small>${r.lesson ? `${r.lesson.topics.length} lesson${r.lesson.topics.length === 1 ? "" : "s"}` : ""}</small>${r.practice ? `<br><span aria-hidden="true">🧪</span> Skill Building <small>${r.practice.items.length} activit${r.practice.items.length === 1 ? "y" : "ies"}: ${E(r.practice.items.map(l => titleCase(l.cf.block.title)).join(" · "))}</small>` : ""}</li>`;
    const cut = Math.ceil(rows.length / 2);
    const cols = [
      [{name: "📘 Lesson → 🧪 Skill Building", groups: [{title: "", html: rows.slice(0, cut).map(li).join("")}]}],
      [{name: cut < rows.length ? "📘 Lesson → 🧪 Skill Building, continued" : "", groups: [{title: "", html: rows.slice(cut).map(li).join("")}]},
       {name: "🎯 Knowledge Check", groups: [{title: "", html: `<li><span aria-hidden="true">🎯</span> ${d.quiz.length} questions and your takeaway</li>`}]}]];
    return `<div class="lesson-stage day-intro cf-intro">
      <div class="lesson-slide"><div class="card lesson-card">
        <div class="di-box cf-intro-obj"><b>🎯 By the end of today you'll be able to</b><ul>${objs.map(o => `<li>${E(o)}</li>`).join("")}</ul></div>
        <div class="cf-intro-phases">${cols.map(c => `<div class="di-box cf-intro-ph">${c.map(s => `${s.name ? `<b>${s.name}</b>` : ""}${s.groups.map(g => `${g.title ? `<small class="cf-intro-sub">${E(g.title)}</small>` : ""}<ul>${g.html}</ul>`).join("")}`).join("")}</div>`).join("")}</div>
      </div></div>
      <div class="slide-nav"><button class="btn btn-ghost" onclick="goto('dashboard')">← Dashboard</button><span class="slide-counter">Objectives</span><button class="btn btn-primary" onclick="startDayFromIntro(${d.id})">Start Case Flow Day ${d.cf.n} →</button></div>
    </div>`;
  };
}

if(typeof window.renderClientProfile === "function" && Array.isArray(CF.profile)){
  window.renderClientProfile = () => caseFlowProfile();
  window.cmCaseFlow.profile = () => { if(state.view !== "clientprofile" && typeof goto === "function") return goto("clientprofile"); render(); window.scrollTo(0, 0); };   // the dashboard's "Case profile" button
}

/* ---------- the Action Plan: a template the trainee fills in ----------
   The Action Plan note starts as a form in plain text: each section labelled, each answer a blank to fill, so a
   trainee writes the plan rather than wondering what goes in it. An empty Action Plan gets it again; 📝 Use the
   template puts it back on demand (below what is already written). */
const PLAN_TEMPLATE = [
  "ACTION PLAN · John Doe v. Robert Smith",
  "Date: ____________    Case Flow Day / phase: ____________",
  "",
  "1. SITUATION (facts from the file only, with the document each comes from)",
  "   - ____________",
  "",
  "2. GOAL AND DEADLINE (what must be true, by when: SOL, carrier or court date)",
  "   - Goal: ____________",
  "   - Deadline: ____________",
  "",
  "3. ACTION ITEMS (one per line: task, owner, due date, tool)",
  "   - Task: ____________ | Owner: ____________ | Due: ____________ | Tool: ____________",
  "   - Task: ____________ | Owner: ____________ | Due: ____________ | Tool: ____________",
  "   - Task: ____________ | Owner: ____________ | Due: ____________ | Tool: ____________",
  "",
  "4. RISKS AND FLAGS (gaps, liens, coverage, deadlines; facts only, no opinion on value)",
  "   - ____________",
  "",
  "5. UPL CHECK (anything the client asked that only the attorney can answer, and when it was routed)",
  "   - ____________",
  "",
  "6. WHO IS TOLD (attorney, client, carrier, provider) and how",
  "   - ____________",
  "",
  "7. FOLLOW-UP (the date you check again, and what you check)",
  "   - ____________"
].join("\n");
if(typeof window.ensureDefaultNote === "function"){
  const __ensure = window.ensureDefaultNote;
  window.ensureDefaultNote = function(){
    __ensure.apply(this, arguments);
    const plan = (state.notes || []).find(n => /action plan/i.test(n.title || ""));
    if(plan && !String(plan.content || "").trim()) plan.content = PLAN_TEMPLATE;
  };
}
window.cmCaseFlow.planTemplate = function(){
  if(typeof ensureDefaultNote === "function") ensureDefaultNote();
  const plan = (state.notes || []).find(n => /action plan/i.test(n.title || "")); if(!plan) return;
  plan.content = String(plan.content || "").trim() ? plan.content + "\n\n" + PLAN_TEMPLATE : PLAN_TEMPLATE;
  plan.updatedAt = new Date().toISOString();
  if(typeof storeSet === "function") storeSet("notes", state.notes);
  if(typeof render === "function") render();
};

/* ---------- My Notes & Action Plan: one screen ----------
   The page's title in a column on the left, with the way back to the Case Flow at its foot; the note editor takes
   the rest of the width and the height of the screen (its page scrolls inside); Download (PDF) and, after an
   activity, Next sit at the bottom right. One note: the Action Plan (earlier notes still show, below it). */
if(typeof window.renderNotes === "function" && typeof window.renderNoteCard === "function"){
  window.renderNotes = function(){
    if(typeof ensureDefaultNote === "function") ensureDefaultNote();
    const r = state.cfReturn;
    const back = r ? `<button type="button" class="btn btn-ghost cf-notes-back" onclick="cmCaseFlow.back()">${r.view === "day" ? `← Back to Case Flow Day ${E(r.n)}` : "← Back to the Case Flow"}</button>` : "";
    const next = r && r.next != null ? `<button type="button" class="btn btn-primary" onclick="cmCaseFlow.onward()">Next: ${E(r.nextLabel)} →</button>` : "";
    return `<div class="cf-notes">
      <section class="page-hero cf-notes-hero"><p class="eyebrow">Personal Workspace</p><h1>My Notes &amp; Action Plan</h1>
        <p>Your action plan, takeaways, and anything else worth keeping. It saves automatically, and <b>Review</b> gives quick feedback on quality, professionalism and compliance before you finalize anything.</p>${back}</section>
      <div class="cf-notes-main"><div id="notesList">${state.notes.map(n => renderNoteCard(n)).join("")}</div>
        <div class="cf-notes-foot"><button type="button" class="btn btn-ghost" onclick="cmCaseFlow.planTemplate()" title="Add the fill-in Action Plan template to your plan">📝 Use the template</button><button type="button" class="btn btn-ghost" onclick="downloadNotesPdf()">⬇ Download All Notes (PDF)</button>${next}</div></div></div>`;
  };
}

/* ---------- the case documents: John Doe v. Robert Smith (js/cm-case-flow-docs.js) ----------
   The Documents page is this file's document set, each document
   opening with its Case Flow day (trainers see them all). Each Skill Activity names the documents it works from. */
const CF_DOCS = window.CM_CF_DOCS || [], CF_FOLDERS = window.CM_CF_DOC_FOLDERS || [], CF_PACKETS = window.CM_CF_DOC_PACKETS || {};
if(typeof window.cmDoc === "function"){
  const __doc = window.cmDoc;
  window.cmDoc = id => __doc(id) || CF_DOCS.find(d => d.id === id);
}
/* A case document opens in case-doc.html, which shows it in the page with the trainee's case-year dates
   (js/cm-case-dates.js; print it or save it as a PDF there). Nothing opens as a download: not the PDFs (a browser
   set to download PDFs would), and not RS03, the editable CMS record, whose original is a .docx. */
/* a case document opens beside the slide (the course's tool frame, side by side), so the trainee reads it while they
   work; Ctrl/⌘-click or the middle button still opens it in a new tab */
window.cmCaseFlow.doc = function(ev, id){
  if(ev && (ev.ctrlKey || ev.metaKey || ev.shiftKey || ev.button === 1) || typeof openPane !== "function") return true;
  const d = CF_DOCS.find(x => x.id === id); if(!d) return true;
  openPane("doc", new URL(docUrl(d), location.href).href, `${d.title} (${d.id})`, "📄", "split");
  return false;
};
const docUrl = d => /^RS\d\d$/.test(d.id) ? `case-doc.html?id=${d.id}${DATES && DATES.year ? `&year=${DATES.year}` : ""}${DATES && DATES.dolOffset ? `&dol=${DATES.dolOffset}` : ""}`
  : typeof cmDocUrl === "function" ? cmDocUrl(d) : "documents/" + d.file;
function docLine(blockId){
  const all = (CF_PACKETS[blockId] || []).map(id => CF_DOCS.find(d => d.id === id)).filter(Boolean), docs = all.filter(docAvail), held = all.length - docs.length;
  if(!docs.length) return "";
  return `<div class="cf-docline"><b>📁 Work from</b>${docs.map(d => `<a href="${E(docUrl(d))}" target="_blank" rel="noopener" title="${E(d.desc)}" onclick="return cmCaseFlow.doc(event,'${d.id}')">${E(d.title)}</a>`).join("")}${held ? `<span class="cf-note">🔒 ${held} corrected cop${held === 1 ? "y opens" : "ies open"} once your Amendment Requests (Pre-Demand Case Auditing) are answered.</span>` : ""}</div>`;
}
const docOpen = d => !!(state.isAdmin || state.adminPreview) || (dayUnlocked(cfIdOf(d.day)) && docAvail(d));
function caseFlowDocuments(){
  const shown = CF_DOCS.filter(docOpen), locked = CF_DOCS.filter(d => !docOpen(d));
  const tpl = (window.CM_DOCS || []).filter(d => d.folder === "templates");
  const row = d => `<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span> <span style="font-size:11px;color:var(--ink-soft)">· ${d.folder === "templates" ? "Any day" : "Case Flow Day " + d.day}</span><div class="d">${E(d.desc)}</div>${state.isAdmin && d.key ? `<div class="cm-key">🔑 ${E(d.key)}</div>` : ""}</div>
      <div style="display:flex;gap:6px;align-items:center"><span class="cms">CMS: ${E(d.cms)}</span><a class="btn btn-ghost btn-sm" href="${E(docUrl(d))}" target="_blank" rel="noopener"${/^RS\d\d$/.test(d.id) ? ` onclick="return cmCaseFlow.doc(event,'${d.id}')"` : ""}>${!/^RS\d\d$/.test(d.id) && /\.(docx|xlsx)$/i.test(d.file) ? "Download" : "Open"}</a></div></div>`;
  const heldBy = d => dayUnlocked(cfIdOf(d.day)) && !docAvail(d);   // open by its day, waiting on the trainee's Amendment Request
  const folders = CF_FOLDERS.map(fo => ({fo, items: shown.filter(d => d.folder === fo.id), later: locked.filter(d => d.folder === fo.id && !heldBy(d)).length, held: locked.filter(d => d.folder === fo.id && heldBy(d)).length})).filter(x => x.items.length || x.later || x.held);
  return `<p class="eyebrow">Case Documents</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📁 Case Documents: ${E(CF.case.style)}</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 14px">The working file for John Doe v. Robert Smith: intake, police and video, Medical Records and bills, the carriers' policies and letters, liens, the Civic's Property Damage, and (Track B) the lawsuit. Each document opens with its Case Flow day, and each Skill Activity lists the ones it works from. Each shows the <b>CMS upload category</b> to use when you add it to the case in the CMS. Read them the way a Case Manager does: verify every fact against its source, and flag what doesn't match.</p>
    <div class="cf-docs-switch-row"><div class="lsh-subtabs cf-docs-switch" role="tablist"><button type="button" role="tab" onclick="goto('clientprofile')">Case File</button><button type="button" role="tab" class="on" aria-selected="true">📁 Documents</button></div></div>
    ${state.isAdmin ? `<div class="card" style="padding:12px 16px;margin-bottom:16px;border-left:4px solid var(--danger);font-size:12.8px">🔑 <b>Trainer view:</b> the red notes under each document are the audit key: planted discrepancies and what a strong trainee should catch. Trainees don't see them. Every document's plants are listed in build/case-flow/documents/SPEC.md.</div>` : ""}
    ${folders.map(({fo, items, later, held}) => `<div class="card cm-lib-folder" style="padding:14px 18px"><h3>${fo.icon} ${E(fo.label)} <span style="font-weight:500;color:var(--ink-soft);font-size:12px">(${items.length})</span></h3>
      ${items.map(row).join("")}${later ? `<div class="cf-note">🔒 ${later} more open with later Case Flow days.</div>` : ""}${held ? `<div class="cf-note">🔒 ${held} corrected cop${held === 1 ? "y opens" : "ies open"} once your Amendment Request to the provider is answered (Pre-Demand Case Auditing → 📝 Amendment Requests).</div>` : ""}</div>`).join("")}
    ${tpl.length ? `<div class="card cm-lib-folder" style="padding:14px 18px"><h3>📝 Templates &amp; Blank Forms <span style="font-weight:500;color:var(--ink-soft);font-size:12px">(${tpl.length})</span></h3>${tpl.map(row).join("")}</div>` : ""}
`;
}
window.renderCaseDocuments = () => caseFlowDocuments();   // the Documents page is the Case Flow's own

/* ---------- 🧪 Practice: the Case Flow's Skill Activities ----------
   Practice is the Case Flow's own hands-on work: every Skill Activity,
   day by day and module by module, with its tool, its expected output and the documents it works from,
   opening straight on its slide. */
window.cmCaseFlow.openBlock = function(dayId, lessonIndex){
  if(typeof goto !== "function") return;
  goto("day", dayId);
  const d = cfDay(dayId), slides = d && typeof buildDaySlides === "function" ? buildDaySlides(d) : [];
  const idx = slides.findIndex(sl => sl.lessonIndex === lessonIndex && sl.part === 1);
  if(idx >= 0 && typeof goToSlide === "function") setTimeout(() => { state.dayViewMode = "slides"; goToSlide(idx); }, 0);
};
/* one page per Case Flow day: a tab for each day, opening on the trainee's current day */
window.cmCaseFlow.pxDay = function(n){ state.cfPxDay = n; render(); window.scrollTo(0, 0); };
function caseFlowPractice(){
  const kcDone = d => !!((state.progress || {})[d.id] || {}).done;
  const cur = [5, 4, 3, 2, 1].find(n => dayUnlocked(cfIdOf(n))) || 1;
  const sel = MODULES.some(d => d.cf.n === state.cfPxDay) ? state.cfPxDay : cur;
  const tabs = `<div class="cf-px-tabs" role="tablist">${MODULES.map(d => `<button type="button" role="tab" aria-selected="${d.cf.n === sel}" class="cf-px-tab${d.cf.n === sel ? " on" : ""}" onclick="cmCaseFlow.pxDay(${d.cf.n})">Day ${d.cf.n}${dayUnlocked(d.id) ? (kcDone(d) ? " ✓" : "") : " 🔒"}<small>${E((CF.days.find(x => x.n === d.cf.n) || {}).phase || "")}</small></button>`).join("")}</div>`;
  const days = MODULES.filter(d => d.cf.n === sel).map(d => {
    const open = dayUnlocked(d.id), day = CF.days.find(x => x.n === d.cf.n);
    /* One tools access for the session, not a set of chips on every activity. A day's activities are
       worked in the same few platforms, so the chips repeated down the page were the same two or three
       buttons over and over, and a trainee opening one from the wrong row landed on the wrong step.
       The day's distinct tools are offered once, at the top of the day, each opening on that day's first
       activity that uses it; every activity row still names the tool it is worked in, in words. The
       per-step buttons stay where they belong, on the activity's own slide (the 🛠 Where box). */
    const firstFor = {};
    d.lessons.forEach((l, li) => { if(l.cf.block.kind !== "activity") return;
      blockTools(l.cf.block).forEach(id => { if(firstFor[id] === undefined) firstFor[id] = {blockId: l.cf.block.id, li}; }); });
    const sessionTools = open ? Object.keys(firstFor).map(id => toolChip(id, firstFor[id].blockId)).filter(Boolean).join("") : "";
    // the module's Practice, in the order the work happens, grouped under each activity's heading
    const groups = [];
    d.lessons.forEach((l, li) => { if(l.cf.block.kind !== "activity") return; const t = l.cf.heading.replace(/^Skill Building:\s*/, ""), last = groups[groups.length - 1];
      if(last && last.title === t) last.acts.push({b: l.cf.block, li}); else groups.push({title: t, acts: [{b: l.cf.block, li}]}); });
    const mods = groups.map(({title, acts}, gi) => {
      return `<div class="cf-px-mod"><div class="cf-px-mh">${d.cf.n}.${gi + 1} · ${E(title)}</div>
        ${acts.map(({b, li}) => `<div class="cf-px-act"><div><b>${E(b.title)}</b>
            <div class="cf-px-meta"><span>🛠 ${E(b.act.tool)}</span><span>📤 ${E(b.act.output)}</span>${(CF_PACKETS[b.id] || []).length ? `<span>📁 ${CF_PACKETS[b.id].length} documents</span>` : ""}</div></div>
          ${open ? `<button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.openBlock(${d.id},${li})">Open</button>` : `<span class="cf-px-lock">🔒</span>`}</div>`).join("")}</div>`;
    }).join("");
    return `<div class="card px-day"><div class="px-day-h"><div><h2>Case Flow Day ${d.cf.n}${open ? "" : " · 🔒"}${day.track ? ` <span class="cf-px-track">${E(day.track)}</span>` : ""}</h2><div class="sub">${E(day.phase)}</div></div>
        <span class="px-prog">${kcDone(d) ? "Knowledge Check passed ✓" : open ? "In progress" : "Opens when the day before is passed"}</span></div>
      ${sessionTools ? `<div class="cf-px-tools"><b>🛠 Tools for this session</b><div class="cf-px-toolrow">${sessionTools}</div>
        <small>Each opens on the first activity of the day that is worked in it. Every step's own tools are on its slide.</small></div>` : ""}
      <div class="cf-px-mods">${mods}</div></div>`;
  }).join("");
  const any = [
    `<button class="btn btn-ghost btn-sm" onclick="goto('casedocs')">📁 Case Documents</button>`,
    typeof rpLaunchQuickPractice === "function" ? `<button class="btn btn-ghost btn-sm" onclick="rpLaunchQuickPractice()">🎲 Quick roleplay call</button>` : "",
    typeof openTool === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openTool('cms',null,'library=1')">📚 CMS Training Library</button>` : "",
    typeof openCms === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 Open the CMS</button>` : ""].join("");
  return `<p class="eyebrow">Practice</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">🧪 Practice: The Case Flow Skill Activities</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:84ch;margin:0 0 14px">Every hands-on exercise of the 5-Day Legal Case Management Flow, on the live file <b>${E(CF.case.style)}</b>: each day's Skill Activities, in the order the work happens, every one worked on John Doe's file in the CMS (with the Call Simulator or the email workspace where it names them), from the documents it lists. Each opens with its day and goes straight to its slide.</p>
    ${tabs}
    ${days}
    <div class="card" style="padding:14px 18px;margin-bottom:14px"><b style="color:var(--navy)">Any day</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${any}</div></div>
`;
}
if(typeof window.renderPracticeHub === "function") window.renderPracticeHub = () => caseFlowPractice();
window.cmCaseFlowTest = {blockTools, EMAIL_NEED, emailTarget};   // .github/scripts/practice-tools.cjs

/* ---------- styles: only what the course's own classes don't already give ---------- */
const st = document.createElement("style"); st.id = "cm-case-flow"; st.textContent = `
.cf-px-tools{margin:0 0 14px;padding:12px 14px;background:#F7F8FB;border:1px solid var(--line,#D6DAE4);border-radius:12px;}
.cf-px-tools > b{display:block;font:800 12.5px var(--font-ui);color:var(--navy);letter-spacing:.04em;text-transform:uppercase;}
.cf-px-toolrow{display:flex;gap:8px;flex-wrap:wrap;margin:9px 0 0;}
.cf-px-tools small{display:block;margin-top:8px;font-size:12px;color:var(--ink-soft,#5B6178);}
.cfg{position:relative;width:100%;box-sizing:border-box;}
#quizWrap:has(.cfg){width:100%;}
.cfg-title{display:flex;justify-content:center;align-items:center;gap:10px;margin:0 0 8px;}
.cfg-title b{font:900 24px 'Poppins','Inter',sans-serif;color:var(--navy);letter-spacing:.01em;}
.cfg-sound{border:1px solid var(--line,#D6DAE4);background:#fff;border-radius:999px;width:34px;height:34px;cursor:pointer;font-size:16px;}
.cfg-hint{text-align:center;font:600 14px var(--font-ui);color:var(--ink-soft,#5B6178);margin:0 0 10px;}
/* Jeopardy */
.cfg-jb{display:grid;grid-template-columns:repeat(var(--cols),minmax(0,1fr));gap:5px;background:#0E1A5C;padding:6px;border-radius:14px;}
.cfg-jh{background:#1B2A8A;color:#fff;font:800 13px/1.25 'Poppins','Inter',sans-serif;text-transform:uppercase;text-align:center;padding:6px;border-radius:6px;display:grid;place-items:center;min-height:34px;}
.cfg-jc{background:#1B2A8A;color:#F4C542;font:900 18px 'Poppins','Inter',sans-serif;border:0;border-radius:6px;padding:6px 4px;cursor:pointer;text-shadow:0 2px 0 #000;transition:transform .15s, background .15s;}
.cfg-jc:not(:disabled):hover{transform:scale(1.04);background:#2438B0;}
.cfg-jc.ok{background:#1F5E3A;color:#BFF0D0;font-size:15px;}.cfg-jc.no{background:#5E1F1F;color:#F5C2BC;font-size:15px;}.cfg-jc.empty{background:transparent;}
.cfg-card.jq{animation:cfgZoom .45s cubic-bezier(.2,.8,.3,1.1) both;}
/* the wheel */
.cfg-wheel-wrap{display:flex;flex-direction:column;align-items:center;gap:14px;margin:6px 0;position:relative;}
.cfg-pointer{font-size:26px;color:#B54A3F;line-height:1;margin-bottom:-18px;z-index:2;text-shadow:0 2px 0 #fff;}
.cfg-wheel{position:relative;width:260px;height:260px;border-radius:50%;border:8px solid #262B45;box-shadow:0 14px 30px -12px rgba(20,24,48,.6);}
.cfg-wheel span{position:absolute;left:50%;top:50%;width:0;height:0;}
.cfg-wheel span b{position:absolute;left:-28px;top:-112px;width:56px;text-align:center;font:900 17px 'Poppins','Inter',sans-serif;color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.5);}
.cfg-hub{position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:54px;height:54px;border-radius:50%;background:#fff;display:grid;place-items:center;font-style:normal;font-size:24px;box-shadow:0 2px 8px rgba(0,0,0,.3);}
/* the doors */
.cfg-doors{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:16px;max-width:620px;margin:0 auto;perspective:900px;}
.cfg-door{position:relative;height:200px;border:0;background:#FBF1E6;border-radius:12px 12px 4px 4px;cursor:pointer;padding:0;overflow:hidden;}
.cfg-door-panel{position:absolute;inset:0;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:6px;background:linear-gradient(160deg,#8A4A1C,#5E3112);color:#F4B77A;font-size:54px;border:4px solid #3E200B;border-radius:12px 12px 4px 4px;transform-origin:left center;transition:transform .9s cubic-bezier(.3,.7,.2,1);z-index:1;}
.cfg-door-panel b{font:900 26px 'Poppins','Inter',sans-serif;color:#fff;}
.cfg-door:not(.open):hover .cfg-door-panel{transform:rotateY(-12deg);}
.cfg-door.open .cfg-door-panel{transform:rotateY(-105deg);}
.cfg-door-prize{position:absolute;inset:0;display:grid;place-items:center;font:900 30px 'Poppins','Inter',sans-serif;color:#262B45;animation:cfgPop .6s ease both;}
.cfg-prize{display:inline-block;margin:0 0 10px;background:#262B45;color:#fff;border-radius:999px;padding:5px 14px;font:700 13.5px var(--font-ui);}.cfg-prize b{color:#F4B77A;}.cfg-prize .dd{color:#F4C542;}
/* Millionaire */
.cfg-split{display:grid;grid-template-columns:minmax(0,1fr) 210px;gap:14px;align-items:start;}
.cfg-ranks{align-self:start;position:sticky;top:0;background:#0B1240;border-radius:12px;padding:10px 10px 8px;color:#C9CFEA;}
.cfg-ranks>b{display:block;font:800 12px 'Poppins','Inter',sans-serif;color:#fff;text-transform:uppercase;letter-spacing:.06em;margin:0 0 6px 4px;}
.cfg-ranks>small{display:block;font:600 11px var(--font-ui);color:#8A93C8;margin:6px 4px 0;}
.cfg-ladder{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:3px;}
.cfg-ladder li{display:flex;gap:8px;align-items:center;font:700 12.5px var(--font-ui);color:#8A93C8;padding:5px 8px;border-radius:6px;}
.cfg-ladder li span{width:20px;text-align:center;}.cfg-ladder li.won{color:#7FD6A0;}
.cfg-tok{color:#2F6B4A;}
.cfg-friend{float:right;margin:0 0 6px 8px;border:1.5px solid #2F8F5B;background:#EAF6EF;color:#1F5E3B;border-radius:999px;padding:5px 12px;font:700 12.5px var(--font-ui);cursor:pointer;}
.cfg-friend small{font-weight:600;opacity:.8;margin-left:4px;}
.cfg-hintbox{margin:8px 0 10px;padding:9px 12px;border-left:4px solid #2F8F5B;background:#EAF6EF;border-radius:6px;font:500 14px/1.45 var(--font-ui);color:#1F3B2C;}
.cfg-earn{margin:8px auto 4px;max-width:560px;padding:9px 14px;background:#EAF6EF;border:1.5px solid #2F8F5B;border-radius:10px;font:600 14px var(--font-ui);color:#1F5E3B;}
.cfg-ladder li.at{background:#DB8437;color:#fff;animation:cfgPulse 1s ease-in-out infinite alternate;}
.cfg-life{display:flex;align-items:center;gap:8px;margin:0 0 10px;flex-wrap:wrap;}
.cfg-life button{border:1.5px solid #262B45;background:#fff;color:#262B45;border-radius:999px;padding:5px 12px;font:800 12.5px var(--font-ui);cursor:pointer;}
.cfg-life button:disabled{opacity:.4;cursor:default;text-decoration:line-through;}
.cfg-clock{margin-left:auto;font:800 14px 'IBM Plex Mono',monospace;color:var(--navy);}.cfg-clock.low{color:#B54A3F;animation:cfgPulse .5s ease-in-out infinite alternate;}
.cfg-opt.gone{visibility:hidden;}
.cfg-aud{position:relative;margin-left:auto;width:90px;height:16px;background:#EEF0F5;border-radius:4px;overflow:hidden;flex:none;}
.cfg-aud i{position:absolute;left:0;top:0;bottom:0;background:#46508A;animation:cfgGrow .8s ease-out both;}.cfg-aud em{position:absolute;right:4px;top:0;font:700 11px var(--font-ui);font-style:normal;color:#262B45;}
/* the bomb */
.cfg-fuse{position:relative;height:14px;background:#EEF0F5;border-radius:999px;margin:0 0 12px;overflow:visible;}
.cfg-fuse i{position:absolute;left:0;top:0;bottom:0;width:100%;border-radius:999px;background:linear-gradient(90deg,#B54A3F,#DB8437 70%,#F4C542);animation-name:cfgFuse;animation-timing-function:linear;animation-fill-mode:forwards;}
.cfg-fuse.out i{animation-play-state:paused;}
.cfg-fuse span{position:absolute;right:-6px;top:50%;transform:translateY(-50%);font-size:26px;}
.cfg-fuse.boomed span{animation:cfgPop .4s ease;filter:drop-shadow(0 0 8px #F4C542);}
.cfg-banner.boom{background:linear-gradient(135deg,#B54A3F,#5E1F1F);}
body.cfg-shake #quizWrap{animation:cfgShake .5s ease;}
@keyframes cfgFuse{from{width:100%;}to{width:0%;}}
@keyframes cfgGrow{from{width:0;}}
@keyframes cfgZoom{from{opacity:0;transform:scale(.6);}to{opacity:1;transform:none;}}
@media(max-width:760px){.cfg-split{grid-template-columns:minmax(0,1fr);}.cfg-ladder{display:none;}.cfg-doors{grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}.cfg-door{height:140px;}.cfg-wheel{width:220px;height:220px;}.cfg-wheel span b{top:-94px;}}
.cfg-hud{display:flex;gap:10px;justify-content:center;margin:0 0 10px;}
.cfg-hud > span{display:flex;align-items:baseline;gap:6px;background:#262B45;color:#fff;border-radius:12px;padding:8px 16px;font:800 20px 'Poppins','Inter',sans-serif;}
.cfg-hud small{font:600 11px var(--font-ui);color:#C9CFE0;text-transform:uppercase;letter-spacing:.06em;}
.cfg-pts{transition:transform .2s;}.cfg-streak.hot{background:linear-gradient(135deg,#DB8437,#B54A3F);animation:cfgPulse 1s ease-in-out infinite alternate;}
.cfg-track{display:flex;gap:4px;justify-content:center;flex-wrap:wrap;margin:0 0 12px;}
.cfg-node{width:30px;height:30px;border-radius:50%;border:2px solid #D6DAE4;background:#fff;color:#8A93A8;font:700 12px var(--font-ui);display:grid;place-items:center;cursor:pointer;padding:0;transition:transform .2s;}
.cfg-node:disabled{cursor:default;opacity:.7;}.cfg-node.ok{background:#2F8F5B;border-color:#2F8F5B;color:#fff;}.cfg-node.no{background:#B54A3F;border-color:#B54A3F;color:#fff;}
.cfg-node.at{transform:scale(1.25);border-color:#DB8437;background:#FFF1E2;font-size:15px;}
.cfg-card{position:relative;padding:20px 24px !important;animation:cfgIn .35s cubic-bezier(.2,.8,.3,1.2) both;overflow:visible;}
#quizWrap.cfg-same .cfg-card,#quizWrap.cfg-same .cfg-aud i{animation:none;}
.cfg-q{font:700 20px/1.4 'Fraunces',Georgia,serif;color:var(--navy);margin:0 0 14px;}
.cfg-opts{display:grid;grid-template-columns:1fr 1fr;gap:10px;}
.cfg-opt{display:flex;align-items:center;gap:12px;text-align:left;padding:12px 14px;border-radius:12px;border:2px solid #E3E6EE;background:#fff;font:500 15px/1.35 var(--font-ui);color:var(--ink);cursor:pointer;transition:transform .15s, border-color .15s, box-shadow .15s;}
.cfg-opt:not(:disabled):hover{transform:translateY(-2px);border-color:#DB8437;box-shadow:0 8px 18px -10px rgba(219,132,55,.7);}
.cfg-letter{flex:none;display:grid;place-items:center;width:30px;height:30px;border-radius:8px;background:#262B45;color:#fff;font:800 14px 'Poppins','Inter',sans-serif;}
.cfg-mark{margin-left:auto;font:800 20px var(--font-ui);}
.cfg-opt.right{border-color:#2F8F5B;background:#E9F6EE;animation:cfgPop .4s ease;}.cfg-opt.right .cfg-letter{background:#2F8F5B;}
.cfg-opt.wrong{border-color:#B54A3F;background:#FBECEA;animation:cfgShake .45s ease;}.cfg-opt.wrong .cfg-letter{background:#B54A3F;}
.cfg-opt.dim{opacity:.55;}
.cfg-say{margin-top:12px;font:700 15px var(--font-ui);}.cfg-say.ok{color:#1F6B43;}.cfg-say.no{color:#9A3A2F;}
.cfg-float{position:absolute;right:28px;top:14px;font:900 28px 'Poppins','Inter',sans-serif;color:#2F8F5B;pointer-events:none;animation:cfgFloat 1.2s ease-out forwards;}
.cfg-banner{position:absolute;left:50%;top:40%;transform:translate(-50%,-50%);background:linear-gradient(135deg,#DB8437,#B54A3F);color:#fff;font:900 30px 'Poppins','Inter',sans-serif;padding:14px 26px;border-radius:16px;box-shadow:0 18px 40px -16px rgba(0,0,0,.6);pointer-events:none;animation:cfgBanner 1.3s ease-out forwards;z-index:5;}
.cfg-nav{display:flex;justify-content:flex-end;margin-top:12px;}
.cfg-clear{margin-top:12px;text-align:center;background:#262B45;color:#fff;border-radius:16px;padding:18px;animation:cfgIn .4s ease both;}
.cfg-clear-h{font:900 26px 'Poppins','Inter',sans-serif;margin-bottom:8px;}
.cfg-tally{display:flex;justify-content:center;gap:22px;flex-wrap:wrap;margin-bottom:12px;font:600 15px var(--font-ui);color:#C9CFE0;}.cfg-tally b{font-size:24px;color:#F4B77A;}
.cfg-badges{display:flex;justify-content:center;gap:10px;flex-wrap:wrap;margin-bottom:14px;}
.cfg-badge{display:flex;flex-direction:column;align-items:center;gap:2px;background:#fff;color:#262B45;border-radius:14px;padding:8px 14px;min-width:110px;animation:cfgPop .5s ease both;}
.cfg-badge i{font-style:normal;font-size:24px;}.cfg-badge b{font:800 13px 'Poppins','Inter',sans-serif;}.cfg-badge small{font:500 11px var(--font-ui);color:#5B6178;}
.cfg-badge.sm{flex-direction:row;min-width:0;padding:4px 10px;border:1px solid #E3E6EE;gap:6px;}.cfg-badge.sm i{font-size:15px;}
.cf-kcr-game{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;margin:12px 0 0;font:600 14px var(--font-ui);color:var(--ink);}.cf-kcr-game b{color:var(--navy);}
@keyframes cfgIn{from{opacity:0;transform:translateX(40px) scale(.97);}to{opacity:1;transform:none;}}
@keyframes cfgPop{0%{transform:scale(1);}40%{transform:scale(1.04);}100%{transform:scale(1);}}
@keyframes cfgShake{0%,100%{transform:translateX(0);}20%{transform:translateX(-8px);}40%{transform:translateX(8px);}60%{transform:translateX(-5px);}80%{transform:translateX(5px);}}
@keyframes cfgFloat{from{opacity:1;transform:translateY(0);}to{opacity:0;transform:translateY(-50px);}}
@keyframes cfgBanner{0%{opacity:0;transform:translate(-50%,-50%) scale(.6);}20%{opacity:1;transform:translate(-50%,-50%) scale(1.08);}70%{opacity:1;transform:translate(-50%,-50%) scale(1);}100%{opacity:0;transform:translate(-50%,-80%) scale(.95);}}
@keyframes cfgPulse{from{box-shadow:0 0 0 0 rgba(219,132,55,.55);}to{box-shadow:0 0 0 8px rgba(219,132,55,0);}}
@media(prefers-reduced-motion:reduce){.cfg *, .cfg-card, .cfg-opt, .cfg-banner, .cfg-float{animation:none !important;transition:none !important;}}
@media(max-width:760px){.cfg-opts{grid-template-columns:minmax(0,1fr);}.cfg-hud > span{font-size:16px;padding:6px 10px;}}
.cf-kc-steps{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 10px;}
body.cf-kc-page .nav-back-row,body.cf-kc-page main>a.back-link,body.cf-kc-page main>.day-head-compact,body.cf-kc-page main>h2.section-title,
body.cf-kc-page main>.card,body.cf-kc-page main>#quizWrap~button{display:none!important;}
.cf-kc-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin:0 0 10px;}
.cf-kc-head b{font:700 17px 'Fraunces',Georgia,serif;color:var(--navy);}
.cf-kc-back,.cf-kc-newtab{border:1.5px solid var(--line,#D6DAE4);background:#fff;border-radius:999px;padding:4px 12px;font:700 12.5px var(--font-ui);color:var(--navy);cursor:pointer;}
.cf-kc-newtab{margin-left:auto;}
.cf-kc-passed{font:700 12px var(--font-ui);color:#1F5E3B;background:#EAF6EF;border:1.5px solid #2F8F5B;border-radius:999px;padding:3px 10px;}
.cf-kc-cols{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1fr);gap:18px;align-items:start;}
.cf-kc-cols h4{margin-top:4px!important;}
@media(max-width:900px){.cf-kc-cols{grid-template-columns:minmax(0,1fr);}}
.cf-kc-step{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 16px;border-radius:12px;border:1.5px solid var(--line,#D6DAE4);background:#fff;color:var(--navy);cursor:pointer;text-align:left;}
.cf-kc-step b{font:800 15px 'Poppins','Inter',sans-serif;}.cf-kc-step small{font:500 12.5px var(--font-ui);color:var(--ink-soft,#5B6178);}
.cf-kc-step.on{background:#262B45;border-color:#262B45;color:#fff;}.cf-kc-step.on small{color:#C9CFE0;}
.cf-kc-mod{padding:6px 0 0;margin:0 0 12px;overflow:hidden;}
.cf-kc-tabs{display:grid;grid-template-columns:repeat(auto-fit,minmax(0,1fr));gap:8px;margin:0 0 10px;}
.cf-kc-tab{display:flex;flex-direction:column;align-items:flex-start;gap:2px;text-align:left;padding:8px 12px;border-radius:10px;border:1.5px solid var(--line,#D6DAE4);background:#fff;cursor:pointer;position:relative;}
.cf-kc-tab small{font:700 10.5px 'IBM Plex Mono',monospace;color:#C26A22;text-transform:uppercase;letter-spacing:.04em;}
.cf-kc-tab b{font:700 13.5px/1.25 'Fraunces',Georgia,serif;color:var(--navy);padding-right:64px;}
.cf-kc-tab .cf-kc-badge{position:absolute;top:8px;right:8px;}
.cf-kc-tab.on{border-color:#DB8437;box-shadow:0 0 0 2px rgba(219,132,55,.25);}
.cf-kc-mod > summary{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:14px 18px;cursor:pointer;list-style:none;}
.cf-kc-mod > summary::-webkit-details-marker{display:none;}
.cf-kc-mh{display:flex;flex-direction:column;gap:2px;}.cf-kc-mh small{font:700 11.5px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--orange-deep);}
.cf-kc-mh b{font:700 17px 'Fraunces',Georgia,serif;color:var(--navy);}
.cf-kc-badge{font:700 12px var(--font-ui);padding:4px 10px;border-radius:999px;background:#FFF1E2;color:#9A4E12;white-space:nowrap;}.cf-kc-badge.ok{background:#E6F4EC;color:#1F6B43;}
.cf-kc-mod[open] > summary{border-bottom:1px solid var(--line,#E3E6EE);}
.cf-kc-mod h4{margin:14px 18px 8px;font:800 13px 'Poppins','Inter',sans-serif;letter-spacing:.04em;text-transform:uppercase;color:var(--navy);}
.cf-kc-qs{margin:0 18px 6px;padding-left:20px;display:flex;flex-direction:column;gap:10px;}
.cf-kc-qs li > span{display:block;font:600 14.5px/1.4 var(--font-ui);color:var(--ink);margin-bottom:4px;}
.cf-kc-qs textarea{width:100%;box-sizing:border-box;font:14px/1.4 var(--font-ui);padding:8px 10px;border:1px solid var(--line,#D6DAE4);border-radius:8px;resize:vertical;}
.cf-kc-mod .cf-ss{padding:0 18px 14px;}
.cf-kc-submit{display:flex;flex-wrap:wrap;align-items:center;gap:10px 14px;margin:6px 0 4px;}
.cf-kc-result{padding:18px 22px !important;text-align:left !important;}
.cf-kcr-top{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px;align-items:center;}
.cf-kcr-score{display:flex;align-items:center;gap:14px;}
.cf-kcr-take{display:flex;flex-direction:column;align-items:flex-start;margin-left:18px;padding:8px 14px;border-left:3px solid #DB8437;background:rgba(219,132,55,.08);border-radius:0 10px 10px 0;}
.cf-kcr-take b{font-size:26px;line-height:1.1;color:#132A5C;}.cf-kcr-take span{font-weight:800;font-size:13px;color:#132A5C;}.cf-kcr-take small{font-size:11.5px;color:var(--ink-soft);}.cf-kcr-score .big{font-size:30px !important;margin:0 !important;}.cf-kcr-score .sub{margin-top:2px;}
.cf-kcr-next .quiz-next-step{margin:0 !important;text-align:left;}
.cf-kcr-mods{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;margin:14px 0 10px;}
.cf-kcr-mod{background:#F6F7FB;border:1px solid var(--line,#E3E6EE);border-radius:10px;padding:8px 12px;font-size:12.5px;}
.cf-kcr-mod > b{display:block;color:var(--navy);margin-bottom:4px;font-size:13px;line-height:1.3;}
.cf-kcr-mod > small{display:block;font:700 10.5px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--orange-deep);}
.cf-kcr-chips{display:flex;flex-wrap:wrap;gap:4px 12px;color:var(--ink-soft,#5B6178);}.cf-kcr-chips b{color:var(--navy);}.cf-kcr-chips em{color:var(--orange-deep);font-style:normal;font-weight:700;}
.cf-kcr-foot{display:flex;flex-wrap:wrap;align-items:center;gap:8px 16px;}
.cf-kcr-btns{display:flex;flex-wrap:wrap;gap:8px;}
.cf-kcr-hist{font-size:12.5px;color:var(--ink-soft,#5B6178);}.cf-kcr-hist .qh-pass{color:#1F6B43;font-weight:700;}.cf-kcr-hist .qh-fail{color:#B54A3F;font-weight:700;}
.cf-kcr-fb{flex:1 1 100%;}.cf-kcr-fb > *{margin:0 !important;}
@media(max-width:760px){.cf-kcr-top,.cf-kc-steps{grid-template-columns:minmax(0,1fr);}}
.cf-px-tabs{display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;margin:0 0 14px;}
.cf-px-tab{display:flex;flex-direction:column;align-items:flex-start;gap:2px;padding:10px 14px;border-radius:12px;border:1.5px solid var(--line,#D6DAE4);background:#fff;color:var(--navy);font:800 15px 'Poppins','Inter',sans-serif;cursor:pointer;text-align:left;}
.cf-px-tab small{font:500 12px/1.3 var(--font-ui);color:var(--ink-soft,#5B6178);}
.cf-px-tab.on{background:#262B45;border-color:#262B45;color:#fff;box-shadow:0 8px 18px -10px rgba(20,24,48,.6);}
.cf-px-tab.on small{color:#C9CFE0;}
@media(max-width:760px){.cf-px-tabs{grid-template-columns:repeat(3,minmax(0,1fr));}}
/* ---- the Case Flow slides: one idea per slide, big type ---- */
.cfx{display:block !important;text-align:left !important;padding:22px 30px 24px !important;background:linear-gradient(180deg,#fff 0%,#fffdf9 100%) !important;position:relative;overflow:hidden;}
.cfx::before{content:"";position:absolute;right:-120px;top:-140px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,#FBF1E6 0%,rgba(251,241,230,0) 70%);pointer-events:none;}
.cfx-top{display:flex;align-items:center;gap:10px;margin:0 0 6px;position:relative;}
/* one line: the pills never wrap inside themselves; the tools give way first (they scroll sideways, never a second row) */
.cfx-top > *{flex:0 0 auto;white-space:nowrap;}
.cfx-top .cfx-dots{flex:0 0 auto;}
.cfx-top .cfx-tools{flex:0 1 auto;min-width:0;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;}
.cfx-top .cfx-tools::-webkit-scrollbar{display:none;}
.cfx-kicker{font:700 12px 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--orange-deep);background:#FBF1E6;border:1px solid #F0D2AE;border-radius:999px;padding:4px 10px;}
.cfx-dots{display:inline-flex;gap:6px;}
.cfx-dot{width:10px;height:10px;border-radius:50%;background:#E3E6EE;transition:transform .2s ease;}
.cfx-dot.done{background:var(--navy-soft);}
.cfx-dot.on{background:var(--orange);transform:scale(1.35);box-shadow:0 0 0 3px rgba(224,122,31,.18);}
.cf-discuss p{margin:0 0 12px;font-size:15px;line-height:1.65;max-width:72ch;}.cf-discuss p:last-child{margin-bottom:0;}
.cfx-full{margin-left:auto;border:1px solid var(--line);background:#fff;border-radius:999px;padding:5px 12px;font:600 12.5px var(--font-ui);color:var(--navy);cursor:pointer;}
.cfx-full:hover{border-color:var(--orange);color:var(--orange-deep);}
.cfx-title{font:700 34px/1.15 'Fraunces',Georgia,serif !important;color:var(--navy) !important;margin:6px 0 16px !important;letter-spacing:-.01em;position:relative;}
.cfx-vi{margin-right:10px;}
.cfx-of{font:600 19px/1.3 var(--font-ui);color:var(--ink-soft);letter-spacing:0;}
.cfx mark.cfx-hl{background:linear-gradient(180deg,transparent 52%,#FFD9A8 52%,#FFD9A8 92%,transparent 92%);color:inherit;padding:0 2px;font-weight:700;}
.cfx-chip{display:inline-block;font:700 13px var(--font-ui);color:var(--navy);background:#DCE6F5;border-radius:999px;padding:6px 14px;margin-bottom:16px;}
.cfx-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:28px;align-items:center;}
.cfx-hook{font:600 32px/1.32 'Fraunces',Georgia,serif;color:var(--ink);margin:0;}
.cfx-lead-1{text-align:center;font:700 30px/1.3 'Fraunces',Georgia,serif;color:var(--ink);margin:0 0 12px;}
.cfx-hero-text .cfx-lead-1 + .cfx-hook{text-align:center;font-size:26px;}
.cfx-theory .cfx-lead-1{font-size:24px;} .cfx-theory .cfx-lead-1 + .cfx-th-lead{text-align:center;}
.cfx-lab-lead{font:500 16px/1.45 var(--font-ui);color:var(--ink);margin:0 0 10px;text-align:left;}
.cfx-lab-tools{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;}
.cfx-lab-tools[hidden]{display:none;}
.cfx-lab-gate{border:1px solid #F0C9A0;background:#FFF8EF;border-radius:10px;padding:8px 12px;margin:0 0 10px;font:500 13px/1.4 var(--font-ui);color:var(--ink);text-align:left;}
.cfx-lab-gate.passed{border-color:#9CD3B0;background:#F1FAF4;}
.cfx-lab-gate.passed .cfx-lab-q{display:none;}
.cfx-lab-gate.passed::after{content:" ✓ Ready: today's tools are open.";color:#2E7D4F;}
.cfx-lab-q{margin-top:6px;}
.cfx-lab-q .o{display:flex;flex-wrap:wrap;gap:4px;margin-top:3px;}
.cfx-lab-q .o button{font:500 12px/1.3 var(--font-ui);border:1px solid #CBD2E1;background:#fff;border-radius:6px;padding:3px 8px;cursor:pointer;text-align:left;}
.cfx-lab-q .o button.ok{background:#E3F4E8;border-color:#3E9A5E;}
.cfx-lab-q .o button.no{background:#FDECEC;border-color:#C9473F;}
.cfx-lab-q .r{font-size:12px;color:var(--ink-soft);margin-top:2px;}
.cfx-lab-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;text-align:left;}
.cfx-lab-list > li{padding:0 !important;margin:0 !important;}
.cfx-lab-list > li::before, .cfx-lab-list > li::after{content:none !important;display:none !important;}
.cfx-lab-list button{display:flex;align-items:center;gap:8px;width:100%;background:#F7F8FC;border:1px solid #DDE2EE;border-radius:10px;padding:6px 10px;font:600 13.5px/1.25 var(--font-ui);color:var(--ink);cursor:pointer;text-align:left;}
.cfx-lab-list button:hover{border-color:#2457C5;background:#EEF4FF;}
.cfx-lab-list .n{flex:none;width:22px;height:22px;border-radius:50%;background:var(--navy);color:#fff;font:800 12px/22px var(--font-ui);text-align:center;}
.cfx-lab-list .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cfx-lab-list .ok{color:#1E8A4C;font-weight:800;}
.cfx-do-now{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;background:#EEF4FF;border:1.5px solid #9DB6E8;border-left:6px solid #2457C5;border-radius:12px;padding:10px 16px;margin:0 0 12px;text-align:left;}
.cfx-do-now b{font:800 16px var(--font-ui);color:#1C3F8F;} .cfx-do-now span{font:500 15.5px/1.45 var(--font-ui);color:var(--ink);}
.cfx-situation{font:500 25px/1.5 var(--font-ui);color:var(--ink);margin:0;}
.cfx-art{display:flex;align-items:center;justify-content:center;animation:cfxIn .5s ease both;}
.cfx-art{cursor:pointer;}
.cfx-art .cfa-subj{transform-box:fill-box;transform-origin:50% 85%;animation:cfa-float 5s ease-in-out infinite;}
.cfx-art[data-motion="ring"] .cfa-subj{transform-origin:50% 50%;animation:cfa-ring 3.4s ease-in-out infinite;}
.cfx-art[data-motion="talk"] .cfa-subj{animation:cfa-talk 2.6s ease-in-out infinite;}
.cfx-art[data-motion="drive"] .cfa-subj{animation:cfa-drive 4s ease-in-out infinite;}
.cfx-art[data-motion="jolt"] .cfa-subj{animation:cfa-jolt 4.5s ease-in-out infinite;}
.cfx-art[data-motion="search"] .cfa-subj{animation:cfa-search 5s ease-in-out infinite;}
.cfx-art[data-motion="sway"] .cfa-subj{transform-origin:50% 100%;animation:cfa-sway 4.8s ease-in-out infinite;}
.cfx-art[data-motion="stamp"] .cfa-subj{animation:cfa-stamp 3.6s ease-in-out infinite;}
.cfx-art[data-motion="pulse"] .cfa-subj{transform-origin:50% 50%;animation:cfa-pulse 2.4s ease-in-out infinite;}
.cfx-art[data-motion="send"] .cfa-subj{animation:cfa-send 4.2s ease-in-out infinite;}
.cfx-art svg > circle{transform-box:fill-box;transform-origin:center;animation:cfa-twinkle 2.8s ease-in-out infinite;}
.cfx-art svg > circle:nth-of-type(2){animation-delay:1.1s;}
.cfx-art .cfa-draw{stroke-dasharray:1;stroke-dashoffset:1;animation:cfa-draw 1.1s .35s ease-out forwards;}
.cfx-art.cfa-on .cfa-draw{animation:cfa-draw 1.1s .1s ease-out forwards;}
@keyframes cfa-draw{to{stroke-dashoffset:0;}}
@keyframes cfa-float{0%,100%{transform:translateY(0);}50%{transform:translateY(-5px);}}
@keyframes cfa-ring{0%,62%,100%{transform:rotate(0);}66%{transform:rotate(-4deg);}70%{transform:rotate(4deg);}74%{transform:rotate(-3deg);}78%{transform:rotate(3deg);}82%{transform:rotate(0);}}
@keyframes cfa-talk{0%,100%{transform:translateY(0) scale(1);}30%{transform:translateY(-3px) scale(1.01);}60%{transform:translateY(0) scale(1);}}
@keyframes cfa-drive{0%{transform:translateX(-10px);}45%{transform:translateX(10px) translateY(-1px);}55%{transform:translateX(10px);}100%{transform:translateX(-10px);}}
@keyframes cfa-jolt{0%,70%,100%{transform:translateX(0);}74%{transform:translateX(-5px) rotate(-1deg);}78%{transform:translateX(4px) rotate(1deg);}82%{transform:translateX(-2px);}86%{transform:translateX(0);}}
@keyframes cfa-search{0%,100%{transform:translate(0,0);}25%{transform:translate(6px,-3px);}50%{transform:translate(0,-5px);}75%{transform:translate(-6px,-2px);}}
@keyframes cfa-sway{0%,100%{transform:rotate(-1.6deg);}50%{transform:rotate(1.6deg);}}
@keyframes cfa-stamp{0%,55%,100%{transform:translateY(0) scale(1);}65%{transform:translateY(-8px) scale(1.01);}72%{transform:translateY(2px) scale(.99,1.01);}78%{transform:translateY(0) scale(1);}}
@keyframes cfa-pulse{0%,100%{transform:scale(1);}50%{transform:scale(1.035);}}
@keyframes cfa-send{0%,100%{transform:translate(0,0);}40%{transform:translate(7px,-6px);}60%{transform:translate(7px,-6px);}}
@keyframes cfa-twinkle{0%,100%{opacity:1;transform:scale(1);}50%{opacity:.35;transform:scale(.6);}}
@media (prefers-reduced-motion: reduce){.cfx-art *{animation:none !important;}.cfx-art .cfa-draw{stroke-dashoffset:0;}}
.cfx-art svg{width:100%;max-width:420px;height:auto;max-height:300px;}
.cfx-art.small svg{max-width:260px;max-height:200px;}
@keyframes cfxIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.cfx .cf-strip{margin-top:22px;}.cfx-lesson .cf-strip{justify-content:center;}
.cfx-split{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:24px;align-items:center;}
.cfx-points{list-style:none;counter-reset:cfx;margin:0;padding:0;display:flex;flex-direction:column;gap:14px;}
.cfx-points li{counter-increment:cfx;display:grid;grid-template-columns:44px 1fr;gap:14px;align-items:start;font:500 24px/1.4 var(--font-ui);color:var(--ink);animation:cfxIn .3s ease-out both;}
.cfx-points li:nth-child(2){animation-delay:.05s}.cfx-points li:nth-child(3){animation-delay:.1s}.cfx-points li:nth-child(4){animation-delay:.15s}.cfx-points li:nth-child(5){animation-delay:.2s}
.cfx-points li > span{grid-column:2;grid-row:1;text-align:left;}
.cfx-hero-text,.cfx-dd,.cfx-check,.cfx-side,.cfx-job,.cfx-upl,.cfx-watch{text-align:left;}
.cfx .cfx-points li::before{content:counter(cfx) !important;grid-column:1;grid-row:1;position:static !important;display:grid !important;place-items:center;width:40px;height:40px;border-radius:50%;background:var(--orange);color:#fff;font:700 19px 'Fraunces',Georgia,serif;box-shadow:0 3px 8px rgba(224,122,31,.3);}
.cfx-qs li{font-size:23px;}
.cfx-upl{margin-top:20px;display:flex;gap:14px;align-items:center;background:#FFF4F2;border:1.5px solid #F2C4BC;border-radius:14px;padding:12px 18px;font:500 20px/1.4 var(--font-ui);}
.cfx-upl b{white-space:nowrap;color:#A33A2A;font-size:15px;letter-spacing:.04em;text-transform:uppercase;}
/* lesson slides sit in the middle of their sheet, not against its left edge: the Why It Matters hook, the Rules list
   with its picture as one centred group, the UPL line, and each Do / Don't heading over its (centred) list */
.cfx-lesson .cfx-hero-text{text-align:center;}
.cfx-lesson .cfx-split{grid-template-columns:auto auto;justify-content:center;column-gap:36px;}
.cfx-lesson .cfx-upl{justify-content:center;text-align:center;}
.cfx-plain{margin-top:14px;background:#F4F7FB;border:1.5px solid #CAD6E6;border-radius:12px;padding:8px 14px;font:400 15px/1.4 var(--font-ui);text-align:left;}
.cfx-plain summary{cursor:pointer;color:#262B45;font-size:14px;}
.cfx-plain summary b{color:#262B45;letter-spacing:.03em;}
.cfx-plain dl{margin:8px 0 2px;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:6px 18px;}
.cfx-plain dl div{display:flex;gap:8px;align-items:baseline;}
.cfx-plain dt{font-weight:700;color:#262B45;white-space:nowrap;}
.cfx-plain dd{margin:0;color:#4A5068;}
.cfx-map .cfx-fw-note{margin-top:14px;}
/* a merged roadmap: its steps as one row across the top of The Theory */
.cfx-map-strip{list-style:none;margin:0 0 14px;padding:0 0 12px;display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:10px 14px;border-bottom:2px dashed #F0D2AE;}
.cfx-map-strip li{display:grid !important;grid-template-columns:28px minmax(0,1fr);column-gap:8px;align-items:start;text-align:left !important;}
.cfx-map-strip .cfx-fw-n{grid-column:1;grid-row:1 / span 2;position:static;margin:0;flex:none;}
.cfx-map-strip b,.cfx-map-strip li > span:last-child{grid-column:2;text-align:left;}
.cfx .cfx-map-strip li::before{display:none !important;content:none !important;}
.cfx-map-strip b{font:800 14.5px/1.25 'Poppins','Inter',sans-serif;color:var(--navy);}
.cfx-map-strip li > span:last-child{font:500 13.5px/1.35 var(--font-ui);color:var(--ink);}
.cfx-lesson .cfx-dd > div{display:flex;flex-direction:column;align-items:center;}
.cfx-lesson .cfx-dd h3{text-align:center;}
.cfx-model{font-size:18px;}
.cfx-model .cfx-caption{font:600 20px var(--font-ui);color:var(--navy-soft);margin:0 0 12px;}
.cfx-model table{font-size:17px;}
/* the process cards (e.g. the briefing protocol): big enough to read from the back of the room */
.cfx-model .lesson-process{gap:8px;flex-wrap:nowrap;margin:4px 0 0;}
.cfx-model .lesson-process .pstep{flex:1 1 0;min-width:0;min-height:min(300px,34vh);padding:20px 18px 22px;border-radius:16px;}
.cfx-model .lesson-process .pnum{width:42px;height:42px;font-size:20px;}
.cfx-model .lesson-process .plabel{font-size:24px;line-height:1.2;margin:14px 0 10px;}
.cfx-model .lesson-process .pdesc{font-size:19px;line-height:1.45;}
.cfx-model .lesson-process-arrow{font-size:24px;padding:0;}
/* five or six steps: three to a row, wide enough to read at a laptop's height (the numbers keep the order) */
.cfx-model .lesson-process:has(> .pstep:nth-of-type(5)){display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;}
.cfx-model .lesson-process:has(> .pstep:nth-of-type(5)) .lesson-process-arrow{display:none;}
.cfx-model .lesson-process:has(> .pstep:nth-of-type(5)) .pstep{min-height:0;}
@media(max-width:1100px){.cfx-model .lesson-process{flex-wrap:wrap;}.cfx-model .lesson-process .pstep{flex:1 1 30%;min-height:0;}.cfx-model .lesson-process-arrow{display:none;}}
/* See It's Do / Don't board (the shared compare layout), at slide size */
.cfx-model .lesson-compare{gap:18px;margin:0;}
.cfx-model .lesson-compare .chead{padding:12px 18px;font-size:22px;}
.cfx-model .lesson-compare .cbody{padding:16px 20px;}
.cfx-model .lesson-compare .citem{font:500 20px/1.4 var(--font-ui);padding-left:26px;margin-bottom:12px;}
.cfx-model .lesson-compare .citem::before{top:9px;width:11px;height:11px;}
.cfx-job{display:flex;flex-direction:column;gap:16px;}
.cfx-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:10px;align-items:stretch;animation:cfxIn .3s ease-out both;}
.cfx-flow:nth-child(2){animation-delay:.1s}.cfx-flow:nth-child(3){animation-delay:.2s}
.cfx-step{background:#F6F7FB;border:1px solid var(--line);border-top:4px solid var(--navy);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;}
.cfx-step:nth-child(3){border-top-color:var(--navy-soft);}.cfx-step:nth-child(5){border-top-color:var(--orange);}.cfx-step:nth-child(7){border-top-color:#2F8F5B;}
.cfx-step small{font:700 11px 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);}
.cfx-step span{font:600 18px/1.35 var(--font-ui);color:var(--ink);}
.cfx-arrow{align-self:center;font-size:22px;color:var(--orange);}
.cfx-dd{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.cfx-grade{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:14px;text-align:left;}
.cfx-grade-c{border-radius:14px;padding:10px 14px;animation:cfxIn .3s ease-out both;}
.cfx-grade-c h3{margin:0 0 6px;font:800 15px var(--font-ui);color:var(--navy);text-transform:uppercase;letter-spacing:.04em;}
.cfx-grade-c ul,.cfx-grade-c ol{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:4px;font:500 14.5px/1.34 var(--font-ui);color:var(--ink);}
.cfx-grade-c li{display:list-item;margin:0;padding:0;text-align:left;position:static;}
.cfx-grade-c li::before{content:none !important;display:none !important;}
.cfx-grade-c ul li{list-style:disc;} .cfx-grade-c ol li{list-style:decimal;}
.cfx-grade-c li::marker{color:var(--orange);font-weight:800;}
.cfx-grade-g{background:#EEF4FF;border:1.5px solid #C7D6F2;}
.cfx-grade-i{background:#FFF6EC;border:1.5px solid #F3D2B3;animation-delay:.06s;}
.cfx-grade-s{background:#EEF8F2;border:1.5px solid #BFE3CE;animation-delay:.12s;}
/* The Document: a legal or medical document broken down before the task that uses it */
.cfx-doc-w{display:flex;gap:16px;align-items:stretch;}
.cfx-doc-g{flex:1;display:grid;grid-template-columns:1fr 1fr;gap:12px;text-align:left;}
.cfx-doc-c{border-radius:14px;padding:10px 14px;background:#fff;border:1.5px solid #E6DED2;border-top:5px solid var(--orange);animation:cfxIn .3s ease-out both;}
.cfx-doc-c h3{margin:0 0 4px;font:800 14px var(--font-ui);color:var(--navy);text-transform:uppercase;letter-spacing:.04em;}
.cfx-doc-c p{margin:0;font:500 17px/1.4 var(--font-ui);color:var(--ink);}
.cfx-doc-c ul{margin:0;padding-left:20px;font:500 16px/1.35 var(--font-ui);color:var(--ink);}
.cfx-doc-c li{list-style:disc;display:list-item;text-align:left;margin:0 0 3px;padding:0;position:static;} .cfx-doc-c li::before{content:none !important;display:none !important;} .cfx-doc-c li::marker{color:var(--orange);}
.cfx-doc-f span{color:var(--ink) !important;font-weight:700;}
.cfx-doc-pur{border-top-color:var(--navy);animation-delay:.05s;} .cfx-doc-ev{border-top-color:#2E8B57;animation-delay:.1s;} .cfx-doc-cm{background:#FFF6EC;animation-delay:.15s;}
.cfx-doc-f{flex:0 0 170px;align-self:center;}
@media (max-width:900px){.cfx-doc-w{flex-direction:column;}.cfx-doc-g{grid-template-columns:1fr;}.cfx-doc-f{align-self:flex-start;}}
/* Notes & Action Plan: on the Your Case slide in place of the documents, and its workspace */
.cfx-np{background:#fff;border:1.5px solid #E6DED2;border-left:5px solid var(--orange);border-radius:14px;padding:12px 16px;display:flex;flex-direction:column;gap:6px;text-align:left;}
.cfx-np>b{font:800 17px var(--font-ui);color:var(--navy);}
.cfx-np-k{font:500 14.5px/1.35 var(--font-ui);color:var(--ink-soft);}
.cfx-np ol{margin:2px 0;padding:0;list-style:none;display:grid;gap:3px;justify-items:start;text-align:left;font:600 15px/1.35 var(--font-ui);color:var(--ink);}
.cfx-np li{display:block;text-align:left;margin:0;padding:0;position:static;list-style:none;}
.cfx-np li::before{content:none !important;display:none !important;}
.cfx-np li.ok{color:#1d5c3a;}
.cfx-np-r{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:4px;}
.cfx-np-r small{color:var(--ink-soft);font-size:13px;}
.np-key{margin-top:8px;border:1px solid #BFE3CE;background:#F3F9F5;border-radius:10px;padding:8px 12px;}
.np-key p{margin:4px 0;font-style:italic;}
.np-key ul,.np-key ol{margin:4px 0 0;padding-left:20px;display:grid;gap:4px;}
.np-key li.ok{color:#1d5c3a;} .np-key li.miss{color:#A2410F;}
/* 3 Clues, 1 Rule */
.cfx-cg{display:flex;flex-direction:column;gap:12px;text-align:left;}
.cfx-cg-head{display:flex;align-items:center;gap:14px;flex-wrap:wrap;}
.cfx-cg-marq{display:flex;flex-direction:column;background:linear-gradient(135deg,#1B2A4A,#2B3F6B);border:2px solid var(--orange);border-radius:14px;padding:6px 16px;box-shadow:0 0 0 3px rgba(232,119,34,.18);}
.cfx-cg-marq b{font:800 22px/1.1 'Poppins',var(--font-ui);color:#fff;letter-spacing:.01em;}
.cfx-cg-marq span{font:600 11.5px var(--font-ui);color:#FDBA74;}
.cfx-cg-tabs{display:flex;gap:6px;flex-wrap:wrap;}
.cfx-cg-tab{min-width:38px;height:38px;border-radius:999px;border:1.5px solid #CBD5E1;background:#fff;font:800 15px var(--font-ui);color:var(--navy);cursor:pointer;}
.cfx-cg-tab.on{background:var(--navy);color:#fff;border-color:var(--navy);}
.cfx-cg-tab.ok{background:#EEF8F2;border-color:#7CC59A;} .cfx-cg-tab.miss{background:#FFF1F1;border-color:#E9A3A3;}
.cfx-cg-tab.on.ok,.cfx-cg-tab.on.miss{box-shadow:0 0 0 3px rgba(27,42,74,.25);}
.cfx-cg-score{margin-left:auto;font:800 15px var(--font-ui);color:var(--navy);background:#FFF7ED;border:1.5px solid #FBD5B0;border-radius:999px;padding:6px 14px;}
.cfx-cg-stage{display:grid;grid-template-columns:repeat(3,1fr);gap:14px;}
.cfx-cg-clue{background:#fff;border:2px solid #E2E8F0;border-radius:16px;padding:14px 18px;min-height:118px;display:flex;flex-direction:column;gap:6px;animation:cfxIn .3s ease-out both;box-shadow:0 4px 14px rgba(15,33,72,.06);}
.cfx-cg-clue small{font:700 11px 'IBM Plex Mono',monospace;letter-spacing:.12em;text-transform:uppercase;color:var(--orange);}
.cfx-cg-clue span{font:600 19px/1.4 var(--font-ui);color:var(--ink);}
.cfx-cg-clue.hid{background:repeating-linear-gradient(135deg,#F1F5F9 0 10px,#E9EEF5 10px 20px);border-style:dashed;align-items:center;justify-content:center;}
.cfx-cg-clue.hid span{font:800 40px 'Poppins',var(--font-ui);color:#94A3B8;}
.cfx-cg-act{display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.cfx-cg-act > span{font:600 14px var(--font-ui);color:var(--ink-soft);}
.cfx-cg-act small{font:600 12.5px var(--font-ui);color:var(--ink-soft);}
.cfx-cg-do{background:#EEF8F2;border:1.5px solid #7CC59A;color:#14532D;font-weight:800;}
.cfx-cg-dont{background:#FFF6EC;border:1.5px solid #F0B27A;color:#7C2D12;font-weight:800;}
.cfx-cg-reveal{display:flex;align-items:center;gap:14px;flex-wrap:wrap;border-radius:16px;padding:12px 18px;animation:cfxIn .3s ease-out both;}
.cfx-cg-reveal.do{background:#EEF8F2;border:1.5px solid #BFE3CE;} .cfx-cg-reveal.dont{background:#FFF6EC;border:1.5px solid #F3D2B3;}
.cfx-cg-reveal > b{font:700 20px 'Fraunces',Georgia,serif;color:var(--navy);white-space:nowrap;}
.cfx-cg-reveal > span{flex:1 1 300px;font:600 20px/1.35 var(--font-ui);color:var(--ink);}
.cfx-cg-reveal em{font:800 13px var(--font-ui);font-style:normal;color:var(--navy);}
.cfx-cg-final{margin:0;font:600 15px var(--font-ui);color:var(--ink);display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
@media (max-width:760px){.cfx-cg-stage{grid-template-columns:1fr;}.cfx-cg-clue{min-height:0;}.cfx-cg-score{margin-left:0;}}
.cfx-dd > div{border-radius:16px;padding:16px 20px;animation:cfxIn .3s ease-out both;}
.cfx-do{background:#EEF8F2;border:1.5px solid #BFE3CE;}
.cfx-dont{background:#FFF6EC;border:1.5px solid #F3D2B3;animation-delay:.1s !important;}
.cfx-dd h3{margin:0 0 10px;font:700 22px 'Fraunces',Georgia,serif;color:var(--navy);}
.cfx-dd ul{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px;}
.cfx-dd li{font:500 21px/1.4 var(--font-ui);color:var(--ink);}
/* The Theory: the deck's lead line, its concepts as cards, the original deck pages beside them */
.cfx-theory{display:grid;grid-template-columns:minmax(0,1fr) clamp(160px,20%,250px);gap:18px;align-items:start;}
.cfx-theory.cfx-th-solo{grid-template-columns:minmax(0,1fr);}
.cfx-th-lead{font:600 22px/1.3 'Fraunces',Georgia,serif;color:var(--ink);margin:0 0 10px;text-align:center;}
.cfx-th-cont,.cfx-fw-t,.cfx-ag-day{display:table;margin:0 auto 14px !important;font:800 15px/1.3 var(--font-ui) !important;letter-spacing:.07em;text-transform:uppercase;color:#B5561A !important;background:#F6D2AC;padding:3px 10px;border-radius:4px;text-align:center;}
.cfx-th-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;}
.cfx-th-c{background:#fff;border:1.5px solid #E6DED2;border-left:5px solid #DB8437;border-radius:12px;padding:7px 12px;display:flex;flex-direction:column;gap:2px;animation:cfxIn .3s ease-out both;}
.cfx-th-c b{font:800 15px/1.25 'Poppins','Inter',sans-serif;color:var(--navy);letter-spacing:.01em;}
.cfx-th-c span{font:500 16px/1.35 var(--font-ui);color:var(--ink);}
.cfx-th-solo .cfx-th-c span{font-size:17px;}
.cfx-th-c{position:relative;}
.cfx-th-more{position:absolute;top:6px;right:8px;border:1px solid #F0D2AE;background:#FBF1E6;color:#B5561A;border-radius:999px;padding:1px 9px;font:700 12px/1.6 var(--font-ui);cursor:pointer;}
.cfx-th-more:hover,.cfx-th-more:focus-visible{background:var(--orange);border-color:var(--orange);color:#fff;outline:none;}
.cfx-more{align-items:center;}
.cfx-more .cfx-modal-in{max-width:560px;border-top:5px solid #DB8437;background:#FFFDF8 !important;backdrop-filter:none !important;opacity:1;box-shadow:0 18px 50px rgba(20,26,44,.35);}
.cfx-more .cfx-modal-h{display:flex;justify-content:space-between;align-items:center;gap:12px;}
.cfx-more .cfx-modal-h b{font:800 19px/1.25 'Poppins','Inter',sans-serif;color:var(--navy);}
.cfx-more mark.cfx-hl{background:linear-gradient(180deg,transparent 52%,#FFD9A8 52%,#FFD9A8 92%,transparent 92%);color:inherit;padding:0 2px;font-weight:700;}
.cfx-more-lead{margin:10px 0 8px;font:600 16px/1.4 var(--font-ui);color:var(--ink);}
.cfx-more ul{margin:0;padding-left:20px;display:flex;flex-direction:column;gap:7px;font:500 16px/1.45 var(--font-ui);color:var(--ink);}
/* The Framework: the deck's table, flow or checklist, in the course's design */
.cfx-fw-t{margin:0 0 12px;text-align:center;font:800 22px/1.25 'Poppins','Inter',sans-serif;color:var(--navy);}
.cfx-fw-scroll{overflow-x:auto;}
.cfx-fw-tbl{width:100%;border-collapse:separate;border-spacing:0;background:#fff;border:1.5px solid #E6DED2;border-radius:14px;overflow:hidden;}
.cfx-fw-tbl thead th{background:#262B45;color:#fff;font:800 13px 'Poppins','Inter',sans-serif;letter-spacing:.04em;text-transform:uppercase;text-align:left;padding:9px 14px;}
.cfx-fw-tbl tbody tr{animation:cfxIn .3s ease-out both;}
.cfx-fw-tbl tbody th, .cfx-fw-tbl td{padding:9px 14px;border-top:1px solid #EEE7DD;text-align:left;vertical-align:top;font:500 16px/1.35 var(--font-ui);color:var(--ink);}
.cfx-fw-tbl tbody th{font-weight:800;color:var(--navy);background:#FBF6EF;white-space:nowrap;}
.cfx-fw-tbl tbody tr:nth-child(even) td{background:#FFFCF7;}
.cfx-fw-flow{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:16px;}
.cfx-fw-flow li{position:relative;background:#fff;border:1.5px solid #E6DED2;border-top:5px solid #DB8437;border-radius:12px;padding:12px 12px 12px;display:flex;flex-direction:column;gap:5px;animation:cfxIn .3s ease-out both;}
.cfx-fw-flow li::before{display:none !important;content:none !important;}
.cfx-fw-flow li:not(:last-child)::after{content:"➔";position:absolute;right:-15px;top:50%;transform:translateY(-50%);color:#DB8437;font-size:16px;z-index:1;}
.cfx-fw-n{display:grid;place-items:center;width:28px;height:28px;border-radius:50%;background:#262B45;color:#fff;font:800 13px 'Poppins','Inter',sans-serif;}
.cfx-fw-flow b, .cfx-fw-list b{font:800 15px/1.25 'Poppins','Inter',sans-serif;color:var(--navy);}
.cfx-fw-flow span:last-child, .cfx-fw-list span{font:500 15px/1.35 var(--font-ui);color:var(--ink);}
.cfx-fw-list{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;}
.cfx-fw-list > div{background:#fff;border:1.5px solid #E6DED2;border-left:5px solid #262B45;border-radius:12px;padding:10px 14px;display:flex;flex-direction:column;gap:4px;animation:cfxIn .3s ease-out both;}
.cfx-fw-note{margin:12px 0 0;text-align:center;font:600 15px/1.4 var(--font-ui);color:var(--ink-soft,#5B6178);}

.cfx-task{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.9fr);gap:24px;align-items:start;}
.cfx-task .cfx-points li{font-size:22px;line-height:1.35;}
/* Your Task fits its card: steps closer together, and each step's link small enough to sit on the step's own line */
.cfx-task .cfx-points{gap:8px;}
.cfx-task .cfx-at{margin-left:4px;padding:0 8px;font-size:12.5px;line-height:1.7;}
.cfx-task .cfx-side{gap:9px;}
.cfx-task .cfx-side > div,.cfx-task .cfx-side .cfx-docs{padding:9px 12px;}
.cfx-task .cfx-side .cfx-why span{font-size:15px;}
.cfx-task .cfx-side button.cfx-deliver{padding:9px 12px;gap:4px;}
.cfx-task .cfx-side .cfx-deliver span{font-size:16px;}
.cfx-sheet .cfx-do-now{padding:6px 14px;margin-bottom:10px;}
.cfx-side{display:flex;flex-direction:column;gap:12px;}
.cfx-side > div{background:#F6F7FB;border:1px solid var(--line);border-radius:14px;padding:12px 14px;display:flex;flex-direction:column;gap:6px;font-size:15px;}
.cfx-side b{font:700 13px var(--font-ui);color:var(--navy);text-transform:uppercase;letter-spacing:.05em;}
.cfx-side .cf-docline{margin:0;font-size:14px;}
.cfx-side .cfx-docs{background:#F6F7FB;border:1px solid var(--line);border-radius:14px;padding:12px 14px;font-size:15px;}
.cfx-docs summary{cursor:pointer;color:var(--ink-soft);}.cfx-docs .cf-docline > b{display:none;}.cfx-docs[open] summary{margin-bottom:6px;}
.cfx-qs-2{display:grid;grid-template-columns:1fr 1fr;gap:16px 28px;}.cfx-qs-2 li{font-size:21px;}
.cfx-kc li{font-size:19px;}.cfx-kc li > span{display:flex;flex-direction:column;gap:8px;}
.cfx-kc-a{width:100%;box-sizing:border-box;font:500 16px/1.4 var(--font-ui);padding:10px 12px;border:1.5px solid var(--line);border-radius:12px;background:#fff;resize:vertical;min-height:64px;}
.cfx-kc-a:focus{outline:none;border-color:var(--orange);box-shadow:0 0 0 3px rgba(224,122,47,.15);}
.cfx-summary .cf-ss-q > span{font:500 19px/1.4 var(--font-ui);}.cfx-summary textarea{font-size:16px;min-height:96px;}
.cfx-summary .cf-scale{font-size:16px;}.cfx-summary .cf-scale td,.cfx-summary .cf-scale th{padding:6px 8px;}.cfx-summary .cf-scale input{width:20px;height:20px;}
.cfx-btns{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;}
.cfx-deliver{background:#FBF1E6 !important;border-color:#F0D2AE !important;}
.cfx-deliver span{font:600 18px/1.4 var(--font-ui);color:var(--ink);}
.cfx-side button.cfx-deliver{display:flex;flex-direction:column;gap:6px;text-align:left;border:1px solid;border-radius:14px;padding:12px 14px;cursor:pointer;font:inherit;transition:transform .12s,box-shadow .12s;}
.cfx-side button.cfx-deliver:hover,.cfx-side button.cfx-deliver:focus-visible{transform:translateY(-1px);box-shadow:0 6px 16px rgba(224,122,31,.25);outline:none;}
.cfx-side button.cfx-deliver em{align-self:flex-end;font:700 13px var(--font-ui);font-style:normal;color:#fff;background:var(--orange);border-radius:999px;padding:5px 12px;}
.cfx-side .cfx-why span{font:500 16px/1.4 var(--font-ui);color:var(--ink);}
.cfx-side .cfx-why span + b{margin-top:6px;padding-top:8px;border-top:1px solid var(--line);}
.cfx-at{display:inline-flex;align-items:center;gap:4px;margin-left:6px;padding:2px 10px;border:1px solid #C9D3EA;border-radius:999px;background:#EEF2FB;color:var(--navy);font:600 14px/1.6 var(--font-ui);cursor:pointer;vertical-align:middle;white-space:nowrap;}
.cfx-at:hover,.cfx-at:focus-visible{background:var(--navy);color:#fff;border-color:var(--navy);outline:none;}
@keyframes cfxFlash{0%{box-shadow:0 0 0 3px var(--orange)}100%{box-shadow:0 0 0 0 transparent}}
.cfx-side .cfx-docs.cfx-flash{animation:cfxFlash 1.2s ease-out;}
.cfx-check{display:flex;flex-direction:column;gap:12px;}
.cfx-tick{display:flex;gap:14px;align-items:flex-start;font:500 22px/1.4 var(--font-ui);color:var(--ink);background:#fff;border:1.5px solid var(--line);border-radius:14px;padding:12px 16px;cursor:pointer;animation:cfxIn .3s ease-out both;}
.cfx-tick input{width:24px;height:24px;margin-top:3px;accent-color:#2F8F5B;flex:0 0 auto;}
.cfx-tick:has(input:checked){background:#EEF8F2;border-color:#BFE3CE;}
.cfx-watch{margin-top:16px;display:flex;flex-wrap:wrap;gap:8px 16px;align-items:baseline;font:500 18px/1.4 var(--font-ui);color:var(--ink);background:#FFF6EC;border-radius:12px;padding:10px 16px;}
.cfx-watch b{color:var(--orange-deep);font-size:14px;text-transform:uppercase;letter-spacing:.05em;}
.cfx-summary .cf-ss-q{font-size:16px;}
/* ---------- executed like the original deck: navy slide, logo + outlined phase title, the topic ribbon, white cards ---------- */
.cfx-sepline{display:none !important;}
.cfx.cfx-deck{background:#262B45 !important;color:#fff;border:0 !important;padding:16px 28px 22px !important;}
/* the deck card carries its view as a class (cfx-theory, cfx-task…), the same names as the slide bodies inside it: their
   layout (a grid, align-items:start) must never reach the deck, or the ribbon and title bar shrink to their text */
.cfx.cfx-deck{display:block;align-items:stretch !important;grid-template-columns:none;}
/* one card: the slide's design sits directly on the card (no second card inside it), the full width of the stage;
   Previous / Next sit under it, on the page (cfStage() builds this from the engine's stage); the presenter is in the side column */
.lesson-stage:has(> .cf-stage-card){background:transparent !important;box-shadow:none !important;padding:0 !important;border-radius:0 !important;overflow:visible !important;
  display:grid !important;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto;}
.cf-stage-card{grid-column:1;grid-row:1;position:relative;overflow:hidden;min-width:0;background:rgba(30,35,64,.9);backdrop-filter:blur(12px) saturate(1.1);-webkit-backdrop-filter:blur(12px) saturate(1.1);border:1px solid rgba(255,255,255,.14);border-radius:20px;padding:16px 20px 14px;box-shadow:0 18px 40px -22px rgba(20,24,48,.65);}
/* the card is glass over the page's background; line ornaments at three corners, drawn inside the card's padding so they never cross the slide */
.cf-stage-card::before, .cf-stage-card::after{content:"";position:absolute;pointer-events:none;background-repeat:no-repeat;}
.cf-stage-card::before{top:0;right:0;width:96px;height:96px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96' fill='none' stroke-linecap='round'%3E%3Cg transform='rotate(180 48 48)'%3E%3Cpath d='M12 14V84H82' stroke='%23DB8437' stroke-width='1.6'/%3E%3Cpath d='M6 30V66M30 90H66' stroke='%238E97C4' stroke-width='1.2'/%3E%3Ccircle cx='12' cy='14' r='2.2' fill='%23DB8437'/%3E%3Ccircle cx='82' cy='84' r='2.2' fill='%23DB8437'/%3E%3Ccircle cx='6' cy='30' r='1.6' fill='%238E97C4'/%3E%3Ccircle cx='66' cy='90' r='1.6' fill='%238E97C4'/%3E%3C/g%3E%3C/svg%3E");}
.cf-stage-card::after{bottom:0;left:0;right:0;height:96px;background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96' fill='none' stroke-linecap='round'%3E%3Cg transform='translate(0 0)'%3E%3Cpath d='M12 14V84H82' stroke='%23DB8437' stroke-width='1.6'/%3E%3Cpath d='M6 30V66M30 90H66' stroke='%238E97C4' stroke-width='1.2'/%3E%3Ccircle cx='12' cy='14' r='2.2' fill='%23DB8437'/%3E%3Ccircle cx='82' cy='84' r='2.2' fill='%23DB8437'/%3E%3Ccircle cx='6' cy='30' r='1.6' fill='%238E97C4'/%3E%3Ccircle cx='66' cy='90' r='1.6' fill='%238E97C4'/%3E%3C/g%3E%3C/svg%3E"),url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96' viewBox='0 0 96 96' fill='none' stroke-linecap='round'%3E%3Cg transform='matrix(-1 0 0 1 96 0)'%3E%3Cpath d='M12 14V84H82' stroke='%23DB8437' stroke-width='1.6'/%3E%3Cpath d='M6 30V66M30 90H66' stroke='%238E97C4' stroke-width='1.2'/%3E%3Ccircle cx='12' cy='14' r='2.2' fill='%23DB8437'/%3E%3Ccircle cx='82' cy='84' r='2.2' fill='%23DB8437'/%3E%3Ccircle cx='6' cy='30' r='1.6' fill='%238E97C4'/%3E%3Ccircle cx='66' cy='90' r='1.6' fill='%238E97C4'/%3E%3C/g%3E%3C/svg%3E");background-position:left bottom,right bottom;}
.cf-stage-card > *{position:relative;z-index:1;}
.cf-stage-card .slide-dots{padding-right:90px;}   /* the dots stop short of the corner ornament */
.cf-stage-card .slide-dots.cf-dots-bar{display:block;height:6px;border-radius:3px;background:rgba(255,255,255,.18);margin:6px 90px 12px 0;padding:0;}
/* on the title row: a dark pill of small dots between the title and the corner */
.cfx-deck-head .slide-dots.cf-head-dots{flex:0 1 auto;min-width:0;margin:0 96px 0 auto !important;padding:6px 10px;gap:3px;justify-content:center;background:rgba(0,0,0,.28);border:1px solid rgba(255,255,255,.12);border-radius:8px;}
.cfx-deck-head .cf-head-dots .slide-dot{width:6px;height:6px;}
.cfx-deck-head .cf-head-dots .slide-dot.active{width:16px;}
.cfx-deck-head .slide-dots.cf-head-dots.cf-dots-bar{display:block;flex:0 1 320px;height:8px;padding:0;}
.cf-dots-bar .cf-dots-fill{display:block;height:100%;border-radius:3px;background:var(--orange,#E8913A);}
.cf-stage-card .stage-body{display:block !important;}
.cf-stage-card #lessonSlideWrap{background:transparent !important;border-radius:0 !important;box-shadow:none !important;padding:4px 2px 2px !important;}
.cf-stage-card #lessonSlideWrap::before, .cf-stage-card #lessonSlideWrap::after{display:none !important;}
.cf-stage-card #lessonSlideWrap .cfx.cfx-deck{background:transparent !important;padding:0 !important;}
body:has(.cf-stage-card) .slide-presenter{display:none !important;}   /* the page's own presenter: the Case Flow card has its own beside it */
main > .cf-side-presenter{display:none;}
@media(min-width:1000px){
  body:not(.ft-fit) main:has(> #lessonStage .cf-stage-card){grid-template-columns:minmax(0,1fr) 240px !important;}   /* the side column, a little wider */
  main:has(> #lessonStage .cf-stage-card) > .cf-side-presenter{display:block;width:min(190px, calc((100vh - 520px) * .56));margin:6px auto 0 !important;pointer-events:none;user-select:none;}
  body.cm-tf-split.cm-tf-open main > .cf-side-presenter{display:none !important;}
}
.cf-side-presenter svg{display:block;width:100%;height:auto;filter:drop-shadow(0 10px 14px rgba(20,24,48,.25));}
.lesson-stage > .cf-stage-card ~ .slide-nav, .lesson-stage > .cf-stage-card ~ .slide-done-banner{grid-column:1 / -1;}
.lesson-stage > .cf-stage-card ~ .slide-nav{margin:10px 0 0 !important;padding:8px 12px;background:rgba(255,255,255,.82);border:1px solid rgba(38,43,69,.12);border-radius:14px;backdrop-filter:blur(6px);}
.lesson-stage > .cf-stage-card ~ .slide-nav .slide-counter{color:#262B45 !important;}
.lesson-stage > .cf-stage-card ~ .slide-nav .btn-ghost{background:#fff;border:1px solid rgba(38,43,69,.2);}
.lesson-stage:fullscreen:has(> .cf-stage-card){background:#1F2440 !important;padding:2.5vh 2vw !important;grid-template-rows:minmax(0,1fr) auto;height:100vh;box-sizing:border-box;}
.lesson-stage:fullscreen > .cf-stage-card{display:flex;flex-direction:column;min-height:0;height:100%;box-sizing:border-box;}
.lesson-stage:fullscreen > .cf-stage-card .stage-body{display:flex !important;flex-direction:column;flex:1;min-height:0;}
.cfx-deck > *{position:relative;z-index:1;}
.cfx-deck-head{display:flex;align-items:center;gap:20px;padding:0 0 4px;margin:0 0 12px;}
.cfx-logo{height:48px;width:auto;flex:0 0 auto;}
.cfx-deck-title{margin:0 !important;padding:2px 0 2px 4px;font:800 33px/1.1 'Poppins','Inter',sans-serif !important;color:#fff !important;letter-spacing:.005em;
  -webkit-text-stroke:4px #DB8437;paint-order:stroke fill;stroke-linejoin:round;text-shadow:0 4px 0 rgba(0,0,0,.18);}   /* a true outline (stroke under the fill): smooth edges, unlike stacked shadows; the left padding keeps the first letter's outline inside the slide's clip */
.cfx-ribbon{margin:0 0 16px;}
.cfx-tools{display:inline-flex;flex-wrap:wrap;align-items:center;gap:4px;margin-left:auto;font-size:13px;color:#D6DBEA;}
.cfx-tools + .cfx-full{margin-left:6px;}
.cfx-tool{font:700 11.5px/1 'Inter',sans-serif;padding:5px 9px;border-radius:999px;border:1px solid #F4B77A;background:rgba(244,183,122,.14);color:#F4B77A;cursor:pointer;white-space:nowrap;}
.cfx-tool:hover,.cfx-tool:focus-visible{background:#F4B77A;color:#262B45;}
.cfx-sheet .cfx-tool{border-color:#DB8437;background:#FFF3E6;color:#9A4E12;}
.cfx-sheet .cfx-tool:hover,.cfx-sheet .cfx-tool:focus-visible{background:#DB8437;color:#fff;}
.cfx-tools-in{display:inline-flex;flex-wrap:wrap;gap:4px;margin-left:6px;vertical-align:middle;}
.cfx-step .cfx-tools-in{display:inline-flex;margin:0 0 0 6px;}
.cfx-log{display:flex;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:6px;padding:4px 10px;border:1px dashed #DB8437;border-radius:10px;background:#FFF8EF;font-size:12.5px;}
.cfx-log .btn{padding:4px 12px;}
.cfx-log b{color:#262B45;}
.cfx-log input{flex:1 1 200px;min-width:0;padding:4px 10px;border:1px solid #C9CEDB;border-radius:8px;font:12.5px 'Inter',sans-serif;}
.cfx-log-ok{color:var(--success,#2E7D4F);font-weight:600;}
/* 🔑 the Case File's facts: the trainer's answer key, in tabs so the page fits one screen */
.cf-file-facts{margin-top:10px;}
.cf-file-tabs{display:flex;flex-wrap:wrap;align-items:center;gap:6px;margin-bottom:8px;}
.cf-file-switch{margin:0 0 0 auto !important;}
.cf-file-tab{font:600 14px 'Inter',sans-serif;color:#2B3147;background:rgba(255,255,255,.62);border:1px solid #C9CEDB;border-radius:999px;padding:4px 12px;cursor:pointer;}
.cf-file-tab:hover{border-color:#DB8437;}
.cf-file-tab.on{background:#132A5C;border-color:#132A5C;color:#fff;}
.cf-file-cols{font-size:15px;columns:3 300px;column-gap:18px;padding:10px 14px;border:1px solid #D7DCE7;border-radius:12px;background:rgba(255,255,255,.62);}
.cf-file-tab.key{border-style:dashed;}
/* the page fills the screen and nothing below it scrolls away: the hero keeps its size, the open tab takes
   what is left, and only a tab with more in it than that (the whole timeline) scrolls inside itself */
#app > main:has(> .cf-file-page){display:flex;flex-direction:column;padding-top:14px;}
#app > main:has(> .cf-file-page) > .lsh-subtabs{margin-bottom:10px;}
.cf-file-page{display:flex;flex-direction:column;flex:1 1 auto;height:100%;min-height:0;}
.cf-file-page .cf-file-facts{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;}
.cf-file-page .cf-file-cols{flex:1 1 auto;min-height:0;overflow:auto;}
/* the timeline takes what it needs and no more (a trainee's is short at first), and scrolls inside
   itself rather than pushing the page past the screen */
.cf-file-page .cf-file-facts .cf-timeline{flex:0 1 auto;min-height:0;overflow:visible;}
.cf-file-facts .cf-timeline{margin:0;}
.cf-timeline .cf-note{color:#D7DDEA;}   /* the card is navy: the empty-state line has to be light */
.cf-file-hero{flex:0 0 auto;padding:11px 18px 10px;margin-bottom:9px;}
.cf-file-hero .eyebrow{display:none;}   /* the title says Case File */
.cf-file-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;}
.cf-file-hero h1{font-size:19px;margin:0 0 5px;}
.cf-file-hero .cf-client{margin:0;}
.cf-file-hero .cf-note{margin:6px 0 0;font-size:11.8px;}
.cf-file-hero .cf-hero-btns{margin:0;flex:0 0 auto;}
/* Newspaper columns, not boxes: a heading under a rule, then its facts. A long one runs on into the next
   column instead of leaving a column half empty, which is what lets a whole tab fit the screen. */
.cf-file-sec{margin:0 0 9px;padding:0;}
.cf-file-sec + .cf-file-sec{padding-top:8px;border-top:1px solid #D7DCE7;}
.cf-file-sec h3{margin:0 0 5px;font:700 1.12em 'Fraunces',serif;color:#132A5C;break-after:avoid;}
.cf-file-sec ul{margin:0;padding-left:15px;}
.cf-file-sec li{font-size:1em;line-height:1.38;color:#2E3345;margin-bottom:2.5px;}
.cf-file-sec li:last-child{margin-bottom:0;}
/* a laptop screen: the same cards, a little tighter, so a tab still fits without scrolling */
@media (max-width:1440px){
  .cf-file-sec li{margin-bottom:2px;}
  .cf-file-cols{columns:4 240px;column-gap:10px;}
}
/* a small laptop (1280 x 720): narrower columns, so a tab still fits the screen */
@media (max-width:1300px){
  .cf-file-cols{columns:4 220px;column-gap:10px;padding:7px 10px;}
  .cf-file-sec{margin-bottom:5px;}
  .cf-file-sec + .cf-file-sec{padding-top:5px;}
  .cf-file-sec h3{margin-bottom:3px;}
  .cf-file-sec li{line-height:1.32;margin-bottom:1.5px;}
}
@media (max-width:900px){.cf-file-cols{columns:1;}}
/* 📤 filing the block's documents into the CMS (js/cm-doc-filing.js) */
.dfl{margin:10px 0 2px;padding:10px 12px;border:1px solid #C9CEDB;border-radius:10px;background:rgba(255,255,255,.62);}
.dfl-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:6px 12px;font-size:13px;color:#262B45;}
.dfl-h b{color:#132A5C;}
.dfl-conv{font-size:12px;color:#3B4257;}
.dfl-conv code{font-size:11.5px;background:rgba(226,232,240,.8);border-radius:5px;padding:1px 5px;color:#1F2A44;}
.dfl-count{margin-left:auto;font-size:12px;font-weight:700;color:#1F4E79;background:rgba(214,231,248,.75);border-radius:999px;padding:2px 9px;}
.dfl-case,.dfl-need{font-size:12px;color:#3B4257;margin:6px 0 2px;display:flex;align-items:center;gap:8px;flex-wrap:wrap;}
.dfl-row{padding:8px 0;border-top:1px solid #E3E7F0;}
.dfl-doc{font-size:13px;font-weight:600;color:#262B45;display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;}
.dfl-doc a{color:#1F4E79;}
.dfl-file{font-size:11.5px;color:#4A5165;font-weight:500;}
.dfl-fields{display:flex;flex-wrap:wrap;gap:6px;margin-top:5px;}
.dfl-fields select,.dfl-fields input{padding:4px 8px;border:1px solid #C9CEDB;border-radius:8px;font:12.5px 'Inter',sans-serif;color:#262B45;background:#fff;}
.dfl-fields input{flex:1 1 320px;min-width:0;}
.dfl-msg{margin-top:5px;}
.dfl-bad{font-size:12.3px;color:#8A2F26;background:rgba(253,232,228,.7);border-left:3px solid #9B3A30;border-radius:0 8px 8px 0;padding:6px 10px;}
.dfl-bad ul{margin:4px 0 0;padding-left:18px;}
.dfl-ok{font-size:12.3px;color:#1F5B3A;margin-top:4px;}
/* 📤 a drafting activity filing the one letter it drafted (js/cm-cms-upload.js) */
.dfl-one{margin:14px 0 2px;}
.dfl-one .dfl-row:first-of-type{border-top:none;padding-top:4px;}
.dfl-done{opacity:.95;}
/* the Case ID the CMS gave, not typed (js/cm-cms-case.js) */
.cfx-log-from:not(:empty){font-size:11px;font-weight:700;color:#1F4E79;background:rgba(214,231,248,.75);border-radius:999px;padding:2px 8px;}
.cf-tr-work{font-size:12.8px;margin:6px 0;padding:6px 10px;background:#F4F6FB;border-radius:8px;}
.cfx-vm .cfx-vm-body{display:flex;align-items:center;gap:14px;margin:8px 0 10px;font-size:14px;}
.cfx-vm .cfx-vm-body small{color:#5B6178;}
.cfx-vm-wave{display:inline-flex;align-items:center;gap:3px;height:34px;}
.cfx-vm-wave i{display:block;width:4px;border-radius:2px;background:#DB8437;height:30%;}
.cfx-vm-wave i:nth-child(3n){height:75%}.cfx-vm-wave i:nth-child(4n+1){height:50%}.cfx-vm-wave i:nth-child(5n+2){height:95%}
.cfx-vm.on .cfx-vm-wave i,.cf-vm-card.on .cfx-vm-wave i{animation:cfvm .9s ease-in-out infinite alternate;}
.cfx-vm-wave i:nth-child(odd){animation-delay:.3s!important}
@keyframes cfvm{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
.cfx-vm-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;}
.cfx-vm-st{font:600 12.5px 'Inter',sans-serif;color:#5B6178;}
/* a voicemail is a short card, so the documents get the room: one row of large pages under it */
.cfx-sb-grid.cfx-sb-vm{grid-template-columns:minmax(0,300px) minmax(0,1fr);gap:18px;align-items:start;}
.cfx-sb-grid.cfx-sb-vm .cfx-sb-docs .cfx-docs-row{gap:12px 18px;}
.cfx-sb-grid.cfx-sb-vm .cfx-thumb span{font-size:13px;}
/* the voicemail card itself: phone-sized */
.cfx-sb-vm .cfx-vm .cfx-ev-h{flex-wrap:wrap;gap:2px 8px;}
.cfx-sb-vm .cfx-vm .cfx-ev-from{flex-basis:100%;order:3;}
.cfx-sb-vm .cfx-vm .cfx-ev-when{margin-left:auto;}
.cfx-sb-vm .cfx-vm .cfx-vm-body{flex-direction:column;align-items:stretch;gap:6px;margin:8px 0;font-size:13px;}
.cfx-sb-vm .cfx-vm .cfx-vm-wave{height:28px;justify-content:space-between;}
.cfx-sb-vm .cfx-vm .cfx-vm-row{flex-wrap:wrap;gap:6px;}
.cfx-sb-vm .cfx-vm .cfx-vm-row .btn{flex:1 1 auto;padding:6px 10px;font-size:12.5px;white-space:nowrap;}
.cfx-sb-vm .cfx-vm .cfx-vm-st{flex-basis:100%;}
@media(max-width:760px){.cfx-sb-grid.cfx-sb-vm{grid-template-columns:minmax(0,1fr);}}
#cf-vm{position:fixed;left:0;right:0;bottom:0;top:var(--cf-topbar,0px);z-index:80;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(20,24,40,.55);}
.cf-vm-card{max-height:calc(100vh - var(--cf-topbar,0px) - 32px)!important;}
#cf-vm[hidden]{display:none;}
.cf-vm-card{width:min(720px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#FFFDF8;border:3px solid #DB8437;border-radius:18px;padding:16px 20px;box-shadow:0 18px 40px rgba(0,0,0,.35);}
.cf-vm-h{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px;}
.cf-vm-h b{display:block;font:800 19px 'Poppins','Inter',sans-serif;color:#262B45;}
.cf-vm-h span{font-size:13px;color:#5B6178;}
.cf-vm-x{border:0;background:none;font-size:20px;cursor:pointer;color:#262B45;}
.cf-vm-lead{font-size:13.5px;color:#37394A;margin:10px 0;}
.cf-vm-qs{margin:0 0 12px;padding-left:20px;}
.cf-vm-qs li{margin:0 0 10px;font-size:14px;}
.cf-vm-qs label{display:block;font-weight:600;color:#262B45;margin-bottom:4px;}
.cf-vm-qs textarea{width:100%;box-sizing:border-box;border:1px solid #C9CEDB;border-radius:8px;padding:6px 10px;font:14px 'Inter',sans-serif;resize:vertical;}
.cf-vm-res{font-size:13px;margin-top:4px;}.cf-vm-res.ok{color:#2E7D4F;}.cf-vm-res.miss{color:#B54A3F;}.cf-vm-res span{color:#37394A;}
.cf-vm-steps{margin:6px 0 10px;padding-left:22px;font-size:14px;line-height:1.5;}
.cf-vm-steps li{margin:0 0 6px;}
.cf-vm-steps code{background:#F1F3F8;padding:1px 6px;border-radius:5px;font-size:12.5px;}
.cf-vm-score{padding:8px 12px;border-radius:10px;background:#F4F6FB;font-size:14px;margin-bottom:10px;}
.cf-vm-tx{font-size:13.5px;background:#fff;border:1px solid #E1E4EC;border-radius:10px;padding:8px 12px;}
.cf-vm-tx summary{cursor:pointer;font-weight:700;color:#262B45;}
#cf-return{position:fixed;left:16px;bottom:16px;z-index:60;font:700 13px 'Inter',sans-serif;padding:10px 16px;border:0;border-radius:999px;background:#262B45;color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;}
#cf-return[hidden],#cf-return-next[hidden]{display:none;}
/* Presenter view's slides window (the one shared in Meet): a step's tool or document opens beside the slide there too
   (⧉ Side by side), so the room sees the slide and the CMS together; the slide moves over to make room */
html body.audience-mode > div#cm-toolframe:not([hidden]){display:flex !important;}   /* (beats the slides window's "nothing but the slide") */
body.audience-mode.cm-tf-split.cm-tf-open #audienceRoot{right:var(--cm-tf-w,50vw);}
/* the slides window: the Case Flow card fills the window and the slide inside it is fitted to what's left (scaled down
   when the window is narrow, as it is beside a tool) instead of running off the bottom */
#audienceRoot .lesson-stage:has(> .cf-stage-card){display:flex !important;flex-direction:column;height:100vh;box-sizing:border-box;padding:1.5vh 1.5vw !important;}
#audienceRoot .cf-stage-card{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;}
#audienceRoot .cf-stage-card .stage-body{flex:1 1 auto;min-height:0;display:flex !important;flex-direction:column;}
#audienceRoot .cf-stage-card #lessonSlideWrap{flex:1 1 auto;min-height:0;height:auto !important;}
/* the case-year picker (trainers) */
.cf-yr{display:inline-flex;align-items:center;gap:8px;font:700 13px var(--font-ui,'Inter',sans-serif);color:var(--navy,#132A5C);}
.cf-yr select{font:600 13px var(--font-ui,'Inter',sans-serif);padding:6px 10px;border:1px solid #C9CEDB;border-radius:8px;background:#fff;color:#132A5C;max-width:100%;}
.cf-yr-row{margin:0 0 12px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;}
.cf-yr-note{font-size:12px;color:var(--ink-soft);}
.cf-yr-side .cf-yr{width:100%;justify-content:space-between;font-size:12px;}.cf-yr-side select{flex:1;min-width:0;font-size:12px;}
.cf-yr-side .cf-yr-note{display:block;margin-top:4px;}
@media (max-height:780px){.cf-yr-side{display:none;}}   /* a short screen: no room beside the slide; the picker is on Admin → Trainer Cues */
.cf-yr-pv{font-family:'IBM Plex Mono',monospace;}
/* the day's intro on one screen (renderDayIntro above) */
.cf-intro .lesson-card{padding:18px 24px !important;}
.cf-intro-obj{margin-bottom:12px;}
.cf-intro-obj ul{columns:2 340px;column-gap:28px;margin:0;}
.cf-intro-obj li{break-inside:avoid;font-size:15px;line-height:1.45;margin-bottom:4px;}
.cf-intro-phases{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,340px),1fr));gap:12px;align-items:start;}
.cf-intro-ph ul + b{margin-top:10px;}
.cf-intro-ph{border-top-color:var(--navy) !important;}
.cf-intro-ph:nth-child(even){border-top-color:var(--orange) !important;}
.cf-intro-ph ul{list-style:none;margin:0;padding:0;}
.cf-intro-sub{display:block;font-size:12px;font-weight:700;color:var(--ink-soft);margin:8px 0 2px;letter-spacing:.02em;}
.cf-intro-ph ul + .cf-intro-sub{margin-top:8px;}
.cf-intro-ph b{display:block;}
.cf-intro-ph li{font-size:14px;line-height:1.35;margin:0 0 3px;padding:0;}
.cf-intro-ph li small{color:var(--ink-soft);font-weight:500;}
.cf-intro-ph li + li{margin-top:7px;}
@media (max-height:820px){.cf-intro .di-box{padding:10px 14px;}.cf-intro-obj li{font-size:14px;margin-bottom:2px;}.cf-intro-ph li{font-size:13px;line-height:1.3;margin-bottom:2px;}.cf-intro-ph ul + b{margin-top:6px;}}
.cf-intro-ph li::before{display:none;}
/* My Notes & Action Plan on one screen (renderNotes above) */
body:has(.cf-notes) #cf-return,body:has(.cf-notes) #cf-return-next{display:none !important;}
.cf-notes{display:grid;grid-template-columns:minmax(240px,300px) 1fr;gap:18px;height:calc(100dvh - 196px);min-height:440px;}
.cf-notes-hero{display:flex;flex-direction:column;gap:10px;margin:0 !important;padding:22px 20px !important;}
.cf-notes-hero h1{font-size:28px !important;line-height:1.15;margin:0 !important;}
.cf-notes-hero p{margin:0;font-size:14px;line-height:1.5;}
.cf-notes-back{margin-top:auto;align-self:flex-start;color:#fff !important;background:rgba(255,255,255,.12) !important;border:1px solid rgba(255,255,255,.55) !important;}
.cf-notes-back:hover{background:rgba(255,255,255,.22) !important;}
.cf-notes-main{display:flex;flex-direction:column;min-width:0;min-height:0;gap:10px;}
.cf-notes #notesList{flex:1 1 auto;min-height:0;overflow:auto;display:flex;flex-direction:column;gap:12px;}
.cf-notes .note-card{flex:1 0 100%;display:flex;flex-direction:column;margin:0;padding:12px 16px;min-height:0;}
.cf-notes .note-card + .note-card{flex:0 0 auto;}
.cf-notes .note-head{margin-bottom:6px;}
.cf-notes .note-card > .wd{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;}
.cf-notes .wd-canvas{flex:1 1 auto;max-height:none;min-height:0;padding:14px;}
.cf-notes .wd-page{max-width:none;min-height:100%;box-sizing:border-box;padding:28px 40px;}
.cf-notes .note-foot{margin-top:6px;}
.cf-notes-foot{display:flex;justify-content:flex-end;gap:10px;flex:none;}
@media (max-width:900px){.cf-notes{grid-template-columns:1fr;height:auto;}.cf-notes .wd-canvas{max-height:60vh;}}
/* the Knowledge Check: the takeaway, and the results' Answer Review grid */
.cf-kc-take{display:block;font:600 16px/1.45 var(--font-ui);color:var(--navy);margin:6px 0 10px;}
.cf-kc-mod textarea{width:100%;font:500 15px/1.5 var(--font-ui);padding:12px 14px;border:1px solid var(--line);border-radius:10px;resize:vertical;}
.cf-kc-take-st{font-size:12px;color:var(--ink-soft);min-height:16px;margin:4px 0 8px;}
body.cf-kc-page #quizWrap{max-width:none;}
.cf-kc-result{max-width:none;}
.cf-ans-h{font:700 20px 'Fraunces',Georgia,serif;color:var(--navy);margin:16px 0 8px;}
.cf-ans-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;}
.cf-ans{background:#fff;border:1px solid var(--line);border-left:4px solid #2F8F5B;border-radius:10px;padding:8px 10px;font:500 13.5px/1.4 var(--font-ui);color:var(--ink);cursor:help;}
.cf-ans.no{border-left-color:#C0392B;background:#FFF8F7;}
.cf-ans p{margin:0 0 5px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.cf-ans-pick{font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cf-ans-right{margin-top:3px;color:#1E6B43;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
@media (max-width:900px){.cf-ans-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
/* Case Documents: the Case File / Documents switch sits under the page's intro (no Open CMS: the slides send trainees to
   the CMS), so the copy js/lsh-topbar.js puts at the top of the page is hidden there */
main:has(.cf-docs-switch) > .lsh-subtabs{display:none !important;}   /* (ours is wrapped, so js/lsh-topbar.js leaves it alone) */
/* the Admin screen's tabs, grouped: the sections, then the open section's tabs */
.admin-tabs.cf-admin-tabs{display:block !important;border-bottom:1px solid var(--line);margin-bottom:20px;white-space:normal;overflow:visible;}
.cf-admin-secs{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:6px;}
.cf-admin-sec{font:inherit;font-size:13.5px;font-weight:700;border:1px solid #DDE1EC;background:#fff;color:var(--navy);border-radius:999px;padding:6px 14px;cursor:pointer;display:inline-flex;align-items:center;gap:7px;white-space:nowrap;}
.cf-admin-sec span{font-size:11px;font-weight:800;background:#ECEEF5;color:#4A5070;border-radius:999px;padding:1px 7px;}
.cf-admin-sec:hover{border-color:#353B57;} .cf-admin-sec.active{background:var(--navy);border-color:var(--navy);color:#fff;} .cf-admin-sec.active span{background:rgba(255,255,255,.2);color:#fff;}
.cf-admin-row{display:flex;gap:8px;flex-wrap:wrap;}
@media(max-width:760px){
  .cf-admin-secs{display:grid;grid-template-columns:1fr 1fr;gap:6px;}
  .cf-admin-sec{font-size:12.5px;padding:7px 8px;justify-content:center;white-space:normal;text-align:center;line-height:1.2;}
  .cf-admin-row{gap:6px;padding:4px 0 10px;}
  .cf-admin-row .admin-tab-btn{font-size:13px;padding:6px 11px;border:1px solid #DDE1EC !important;border-radius:999px;background:#fff;}
  .cf-admin-row .admin-tab-btn.active{background:#FFF3E6;border-color:var(--orange) !important;color:var(--navy);}
}
#cf-return-next{position:fixed;right:16px;bottom:16px;z-index:60;font:800 14px 'Inter',sans-serif;padding:11px 20px;border:0;border-radius:999px;background:var(--orange,#E87722);color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;}
/* the sub-header: a full-width bar, the topic centred in capitals and quotes, on a lighter navy with an orange rule */
.cfx-ribbon span{display:block;text-align:center;background:linear-gradient(90deg,#343C66 0%,#46508A 50%,#343C66 100%);border-bottom:3px solid #DB8437;border-radius:6px;color:#fff;font:800 20px/1.25 'Poppins','Inter',sans-serif;letter-spacing:.04em;text-transform:uppercase;padding:8px 24px;}

.cfx-deck .cfx-top{margin:0 0 16px;}
.cfx-deck .cfx-title.cfx-pill{display:inline-flex;align-items:center;gap:8px;margin:0 !important;background:#ECEEF3;color:#262B45 !important;border-radius:8px;padding:6px 16px;font:700 17px/1.2 'Poppins','Inter',sans-serif !important;letter-spacing:.06em;}
.cfx-deck .cfx-vi{margin:0;}
.cfx-deck .cfx-kicker{background:transparent;border-color:rgba(255,255,255,.35);color:#F4B77A;}
.cfx-deck .cfx-dot{background:rgba(255,255,255,.25);}.cfx-deck .cfx-dot.done{background:#AEB6CC;}
.cfx-deck .cfx-full{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.35);color:#fff;}
.cfx-sheet{background:#fff;color:var(--ink);border:1px solid rgba(255,255,255,.6);border-radius:14px;padding:18px 24px;box-shadow:0 8px 22px rgba(0,0,0,.18);}
/* One frame for every slide (desktop): the deck fills the slide area from the top, its title, ribbon and top row
   keep one size and one place, and the lesson card fills the rest at the same size on every slide. Only what is
   inside the card changes: when it is too long, the card's content alone is scaled to fit (fitSlideZoom). */
@media (min-width:761px){
  .lesson-stage #lessonSlideWrap:has(> .cfx-deck){justify-content:flex-start !important;align-items:stretch !important;flex-direction:column !important;}
  .lesson-stage #lessonSlideWrap > .cfx-deck{display:flex !important;flex-direction:column;flex:1 1 auto;min-height:0;width:100%;gap:0 !important;justify-content:flex-start !important;}
  .cfx-deck > .topic-separator,.cfx-deck > .cfx-deck-head,.cfx-deck > .cfx-ribbon,.cfx-deck > .cfx-top{flex:none;}
  .lesson-stage .cfx-deck-head{position:relative;min-width:0;padding:0 96px 12px 0;}
  .lesson-stage .cfx-deck-title{flex:1 1 auto;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:clamp(20px,1.9vw,30px) !important;}
  .lesson-stage .cfx-deck-head .slide-dots.cf-head-dots.cf-dots-bar{position:absolute;left:4px;right:96px;bottom:0;width:auto;height:5px;margin:0 !important;flex:none;}
  .lesson-stage .cfx-ribbon > span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:clamp(13px,1.1vw,17px) !important;}
  .lesson-stage .cfx-deck > .cfx-body{flex:1 1 0;min-height:0;display:flex;flex-direction:column;overflow:hidden;}
  .lesson-stage .cfx-body > .cfx-sheet{flex:1 1 auto;min-height:0;overflow:hidden;}
  /* a short slide sits in the middle of its sheet, not at the top; auto margins centre it and give way to nothing
     once the slide is full, so a tall slide is never pushed or clipped */
  .lesson-stage .cfx-body > .cfx-sheet{display:flex;flex-direction:column;}
  .lesson-stage .cfx-body > .cfx-sheet > :first-child{margin-top:auto;}
  .lesson-stage .cfx-body > .cfx-sheet > :last-child{margin-bottom:auto;}
  /* the day's closing line sits over the middle of the Previous / Next bar, so the last slide keeps the same frame */
  .lesson-stage:has(> .cf-stage-card){position:relative;}
  .lesson-stage > .cf-stage-card ~ .slide-done-banner{position:absolute;left:0;right:0;bottom:6px;z-index:3;margin:0 auto !important;width:max-content;max-width:min(52%,640px);padding:6px 14px !important;font-size:13px !important;line-height:1.35;text-align:center;}
}
.cfx-sheet .cfx-art.small svg{max-height:200px;}
/* Skill Building opener: the case documents, the challenge ribbon, the situation */
.cfx-docs-row{display:flex;gap:14px;justify-content:center;margin:0 0 12px;}
.cfx-thumb{flex:0 1 150px;display:flex;flex-direction:column;gap:6px;text-decoration:none;color:#fff;}
.cfx-thumb img{width:100%;aspect-ratio:300/388;object-fit:cover;object-position:top;background:#fff;border:3px solid #DB8437;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,.3);transition:transform .2s ease;}
.cfx-thumb:hover img{transform:translateY(-3px);}
.cfx-thumb span{font:600 12.5px/1.3 'Inter',sans-serif;color:#DDE2EE;text-align:center;}
.cfx-task-card{background:#C9CDD8;color:#1F2433;border-radius:22px;padding:14px 22px;border:3px solid #E9EBF0;}
.cfx-task-card .cfx-chip{background:#262B45;color:#fff;}
.cfx-task-card .cfx-situation{margin:8px 0 0;font-size:22px;color:#1F2433;}
/* the day's Training Agenda */
.cfx-ag-list li > div{flex:1;min-width:0;text-align:left;}.cfx-ag-list li > div b, .cfx-ag-list li > div small{text-align:left;}
.cfx-ag-min{margin-left:auto;font:800 14px 'IBM Plex Mono',monospace;color:#F4B77A;white-space:nowrap;}
.cfx-time{font:700 12px 'IBM Plex Mono',monospace;letter-spacing:.02em;padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#F4B77A;cursor:pointer;white-space:nowrap;}
.cfx-time.on{background:#DB8437;color:#fff;border-color:#DB8437;}.cfx-time.over{background:#B54A3F;border-color:#B54A3F;}
.cfx-ag{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.9fr);gap:22px;align-items:stretch;}
.cfx-ag-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
.cfx-ag-list li{text-align:left;display:flex;gap:16px;align-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 16px;}
.cfx-ag-list li::before{display:none !important;content:none !important;}
.cfx-ag-n{flex:0 0 auto;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#DB8437;color:#fff;font:800 18px 'Poppins','Inter',sans-serif;}
.cfx-ag-list b{display:block;font:700 21px/1.25 'Poppins','Inter',sans-serif;color:#fff;}
.cfx-ag-list small{display:block;margin-top:3px;font:500 14px/1.35 'Inter',sans-serif;color:#C9CFDD;}
.cfx-ag-side{background:#FFFDF8;color:var(--ink);border:3px solid #DB8437;border-radius:20px;padding:30px 34px;font:500 31px/1.5 'Inter',sans-serif;display:flex;flex-direction:column;justify-content:center;gap:14px;}   /* as tall as the agenda beside it, its text read across the room */
.cfx-ag-side .cfx-ag-day{margin:0 0 8px !important;font:800 24px/1.3 var(--font-ui) !important;padding:6px 14px !important;}
.cfx-ag-side p{margin:0;}
/* a long, interleaved day: the objective on top, the agenda in two columns read down */
.cfx-ag.cfx-ag-long{grid-template-columns:minmax(0,1fr);gap:14px;}
.cfx-ag-long .cfx-ag-side{order:-1;padding:10px 18px;font-size:15px;}
.cfx-ag-long .cfx-ag-side .cfx-ag-day{display:none;}
.cfx-ag-long .cfx-ag-list{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));grid-auto-flow:column;grid-template-rows:repeat(var(--ag-rows),auto);gap:10px 14px;}
.cfx-ag-long .cfx-ag-list li{padding:8px 14px;gap:12px;}
.cfx-ag-long .cfx-ag-n{width:38px;height:38px;font-size:16px;}
.cfx-ag-long .cfx-ag-list b{font-size:18px;}
.cfx-ag-long .cfx-ag-list small{font-size:13px;}
@media(max-width:760px){
  .cfx.cfx-deck{padding:14px 16px 18px !important;}
  .cfx-deck-head{gap:10px 12px;flex-wrap:wrap;}.cfx-deck-head .slide-dots.cf-head-dots{order:-1;flex:1 1 100%;margin:0 70px 0 0 !important;}.cfx-logo{height:38px;}.cfx-deck-title{font-size:23px !important;-webkit-text-stroke-width:3px;}
  .cfx-ribbon span{font-size:16px;padding:6px 12px;}
  .cfx-deck .cfx-top{flex-wrap:wrap;gap:8px 10px;}.cfx-deck .cfx-title.cfx-pill{white-space:nowrap;font-size:15px !important;padding:5px 12px;}
  .cfx-deck .cfx-kicker{display:none;}.cfx-thumb:nth-child(n+3){display:none;}
  .cfx-docs-row{flex-wrap:wrap;}.cfx-thumb{flex-basis:44%;}
  .cfx-ag{grid-template-columns:minmax(0,1fr);}
  .cfx-ag-long .cfx-ag-list{grid-template-columns:minmax(0,1fr);grid-auto-flow:row;grid-template-rows:none;}
}
/* ---------- the simulation: what landed on the file, the case timeline, fallout, the live call ---------- */
.cfx-tl{list-style:none;margin:0 0 10px;padding:0;display:flex;gap:0;align-items:flex-start;position:relative;}
.cfx-tl::before{content:"";position:absolute;left:8px;right:8px;top:8px;height:2px;background:rgba(255,255,255,.3);}
.cfx-tl li{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px;position:relative;}
.cfx-tl li::before{display:none !important;content:none !important;}
.cfx-tl i{width:14px;height:14px;border-radius:50%;border:2px solid #AEB6CC;background:#262B45;z-index:1;}
.cfx-tl li.past i{background:#AEB6CC;}
.cfx-tl li.here i{width:18px;height:18px;margin-top:-2px;background:#DB8437;border-color:#fff;box-shadow:0 0 0 4px rgba(219,132,55,.35);}
.cfx-tl small{font:500 10.5px 'IBM Plex Mono',monospace;color:#9AA3BA;}
.cfx-sb-grid{display:grid;grid-template-columns:minmax(0,.72fr) minmax(0,1.6fr);gap:18px;align-items:start;}
.cfx-sb-main .cfx-ev{padding:8px 12px;} .cfx-sb-main .cfx-ev p{font-size:15px !important;line-height:1.45;}
.cfx-sb-main{display:flex;flex-direction:column;gap:10px;}
/* the space under the event card holds the activity's own illustration (its slide image), sized to what the documents leave */
.cfx-sb-grid{align-items:stretch;}
.cfx-sb-main>:first-child{margin-top:28px;}   /* the card sits a little lower, level with the documents' text */
.cfx-sb-main>:not(.cfx-sb-art){flex:0 0 auto;}   /* the card keeps its full height; the illustration takes what is left */
.cfx-sb-grid.cfx-sb-vm{align-items:stretch;}
.cfx-sb-art{flex:1 1 0;min-height:72px;padding:6px 4px 0;}
.cfx-sb-art svg{width:100%;height:100%;max-width:400px;max-height:260px;}
/* the case documents in one row, as big as the column and the screen's height allow (600px images, so they stay legible) */
.cfx-sb-docs .cfx-docs-row{display:flex;flex-wrap:nowrap;justify-content:center;align-items:flex-start;gap:14px;margin:0;}
.cfx-sb-docs{padding-top:22px;}   /* the documents sit a little lower too, level with the card */
.cfx-sb-docs .cfx-thumb{flex:1 1 0;min-width:0;max-width:min(360px,calc((100vh - 422px) / 1.25));}
.cfx-sb-docs .cfx-thumb img{border-width:3px;}
.cfx-sb-docs .cfx-thumb span{font-size:12.5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cfx-ev{background:#fff;color:#1F2433;border-radius:14px;border:2px solid #DB8437;padding:10px 14px;box-shadow:0 6px 18px rgba(0,0,0,.25);text-align:left;}
.cfx-ev-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;font:600 12.5px 'Inter',sans-serif;color:#5B6579;}
.cfx-ev-i{font-size:16px;}.cfx-ev-ch{font:800 11px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#B5651F;}
.cfx-ev-from{color:#262B45;}.cfx-ev-when{margin-left:auto;font-family:'IBM Plex Mono',monospace;font-size:11.5px;}
.cfx-ev-subj{margin:4px 0 4px;font:800 20px/1.3 'Poppins','Inter',sans-serif;color:#262B45;}
.cfx-ev-body{margin:0;font:500 17px/1.5 'Inter',sans-serif;color:#2C3142;}
.cfx-ev-att{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;}
.cfx-ev.cfx-ev-before{border-color:#9AA3B5;padding:6px 12px;opacity:.96;}
.cfx-ev-before .cfx-ev-subj{font-size:15px;margin:2px 0;}.cfx-sb-main .cfx-ev-before p.cfx-ev-body{font-size:13.5px !important;line-height:1.4;}
.cfx-log{background:#fff;color:#1F2433;border-radius:12px;border:2px solid #DB8437;box-shadow:0 6px 18px rgba(0,0,0,.25);overflow:hidden;text-align:left;}
.cfx-log-h{background:#262B45;color:#fff;font:700 13px 'Inter',sans-serif;padding:7px 12px;letter-spacing:.02em;}
.cfx-log-scroll{overflow-x:auto;}
.cfx-log table{width:100%;border-collapse:collapse;font:500 13px/1.35 'Inter',sans-serif;}
.cfx-log th{background:#F1F3F8;color:#5B6579;font:800 10.5px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;text-align:left;padding:5px 8px;}
.cfx-log td{padding:5px 8px;border-top:1px solid #E4E7EF;vertical-align:top;}
.cfx-log-mono{font-family:'IBM Plex Mono',monospace;font-size:12px;white-space:nowrap;}
.cfx-log tr.cfx-log-call td:first-child{box-shadow:inset 3px 0 #DB8437;}
.cfx-log tr.cfx-log-email td:first-child{box-shadow:inset 3px 0 #2E6FD8;}
.cfx-log tr.cfx-log-esc td{background:#FFF5F2;font-weight:700;}
.cfx-log-note{margin:0;padding:6px 12px 8px;font:500 12.5px/1.4 'Inter',sans-serif;color:#5B6579;border-top:1px solid #E4E7EF;}
.cfx-thumb-off::before{content:"📄";display:flex;align-items:center;justify-content:center;font-size:40px;aspect-ratio:300/388;background:#fff;border:3px solid #DB8437;border-radius:6px;}
.cfx-ev-att a{font:600 12px 'Inter',sans-serif;color:#262B45;background:#F1F3F8;border-radius:999px;padding:3px 10px;text-decoration:none;}
.cfx-fall{margin:0 0 8px;background:#FFF5F2;border:2px solid #E0533D;border-radius:12px;color:#3A1D17;}
.cfx-fall summary{cursor:pointer;display:flex;align-items:center;gap:10px;padding:7px 12px;font:700 15.5px/1.3 'Inter',sans-serif;list-style:none;}
.cfx-fall summary::-webkit-details-marker{display:none;}
.cfx-fall summary b{color:#9E2A1C;}.cfx-fall-from{margin-left:auto;font:600 12px 'Inter',sans-serif;color:#7A4A40;white-space:nowrap;}
.cfx-fall p{margin:0;padding:0 14px 10px 40px;font:500 15.5px/1.45 'Inter',sans-serif;}
.cfx-fall .cfx-fall-why{display:block;padding:0 14px 8px 40px;color:#B5651F;}
.cfx-ev.cfx-ev-fall{border-color:#E0533D;background:#FFF5F2;}
.cfx-ev-fall .cfx-ev-ch{color:#C0392B;}
.cfx-fall-why{display:block;margin-top:4px;color:#F4B77A;font:600 12px 'Inter',sans-serif;}
.cfx-sb .cfx-task-card{padding:10px 16px;}.cfx-sb .cfx-task-card .cfx-situation{font-size:18px;margin-top:6px;}
.cfx-task-main{display:flex;flex-direction:column;gap:12px;min-width:0;}
.cfx-task-main .cfx-call{display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 12px;background:#262B45;border-radius:14px;padding:10px 14px;color:#fff;text-align:left;}
.cfx-task-main .cfx-call b{grid-column:1;font:700 13px var(--font-ui);color:#F4B77A;text-transform:uppercase;letter-spacing:.05em;}
.cfx-task-main .cfx-call span{grid-column:1;color:#DDE2EE;font-size:14px;}.cfx-task-main .cfx-call em{color:#9BE0B4;font-style:normal;}
.cfx-task-main .cfx-call .btn{grid-column:2;grid-row:1 / span 2;}
.cfx-side .cfx-call{background:#262B45 !important;border-color:#262B45 !important;color:#fff;}
.cfx-side .cfx-call b{color:#F4B77A;}.cfx-side .cfx-call span{color:#DDE2EE;font-size:14px;}.cfx-side .cfx-call em{color:#9BE0B4;font-style:normal;}
.cf-call-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin:0 0 14px;padding:10px 14px;background:#262B45;color:#DDE2EE;border-radius:12px;font-size:14px;}
.cf-call-bar b{color:#fff;}
.cf-timeline{padding:16px 20px;margin:0 0 16px;background:#262B45 !important;color:#fff;border:0 !important;}
/* the Case File's header: the page title and the client in one card */
.cf-file-hero .cf-client{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin:14px 0 4px;color:#E4E7F2;font:600 15px/1.4 var(--font-ui);}
.cf-file-hero .cf-client-k{font:700 11.5px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#F4B77A;}
.cf-file-hero .cf-client b{font:700 22px 'Fraunces',Georgia,serif;color:#fff;}
.cf-file-hero .cf-note, .cf-file-hero .cf-case-year{color:#C9CFE0 !important;margin:2px 0 0;font-size:13.5px;}
.cf-file-hero .cf-case-year a{color:#F4B77A;}
.cf-hero-btns{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px;}
.cf-hero-btns .btn-ghost{background:rgba(255,255,255,.1) !important;border:1px solid rgba(255,255,255,.3) !important;color:#fff !important;}
/* The Case So Far, top to bottom: a dot on a vertical line, the date, what happened */
.cf-timeline .cfx-tl-full{flex-direction:column;flex-wrap:nowrap;gap:0;position:relative;margin:0 0 8px;}
.cf-timeline .cfx-tl-full::before{display:block !important;content:"";position:absolute;left:8px;right:auto;top:10px;bottom:10px;width:2px;height:auto;background:rgba(255,255,255,.28);}
.cf-timeline .cfx-tl-full li, .cf-timeline .cf-lane .cfx-tl-full li{flex:none !important;flex-direction:row;align-items:center;text-align:left;gap:12px;padding:6px 0;}
.cf-timeline .cfx-tl-full li small{order:1;min-width:104px;font-size:13.5px;}
.cf-timeline .cfx-tl-full li.here{padding:8px 0;}
.cf-timeline .cfx-tl-full li.here i{margin-top:0;margin-left:-2px;}
.cfx-tl-full{flex-wrap:wrap;row-gap:14px;}.cfx-tl-full li{flex:0 0 calc(100% / 8);}.cfx-tl-full::before{display:none;}
.cf-lanes{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}
.cf-lane{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px 12px;}
.cf-lane-h{font:800 12px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#F4B77A;margin:0 0 10px;}
.cf-lane-care .cf-lane-h{color:#9BE0B4;}
.cf-lane .cfx-tl-full li{flex:0 0 calc(100% / 4);}
/* one screen: the timeline is a wrap of date buttons; each label pops up over the rail */
.cf-timeline .cfx-tl-full{flex-direction:row !important;flex-wrap:wrap !important;gap:4px;margin:0 0 4px;}
.cf-timeline .cfx-tl-full::before{display:none !important;}
.cf-timeline .cfx-tl-full li, .cf-timeline .cf-lane .cfx-tl-full li{flex:0 0 auto !important;padding:0;position:relative;overflow:visible;}
.cf-tl-b{display:flex;align-items:center;gap:5px;padding:2px 7px;border-radius:999px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.07);color:#DDE2EE;cursor:pointer;font:inherit;}
.cf-tl-b:hover,.cf-tl-b:focus-visible{background:rgba(219,132,55,.3);border-color:#DB8437;outline:none;}
.cf-timeline .cfx-tl-full li small{order:0;min-width:0 !important;font:600 10.5px 'IBM Plex Mono',monospace;letter-spacing:-.01em;color:#C9CFE0;}
.cf-timeline .cfx-tl-full li i{width:6px;height:6px;border-width:1px;}
.cf-timeline .cfx-tl-full li.here .cf-tl-b{background:#DB8437;border-color:#fff;}
.cf-timeline .cfx-tl-full li.here small{color:#fff;}
.cf-timeline .cfx-tl-full li.next .cf-tl-b{opacity:.62;}
/* the time banner on a Skill Activity's Your Case (timeBanner); cfx-time is the countdown button, not this */
/* the time on the file: where the case has moved since the last task, and how long the SOL leaves; made to be noticed */
.cfx-when{margin:0 0 10px;padding:8px 12px;border:2px solid #DB8437;border-left-width:6px;border-radius:12px;background:linear-gradient(90deg,rgba(219,132,55,.30),rgba(255,255,255,.07) 70%);color:#fff;font:600 15px/1.4 'Inter',sans-serif;animation:cfxWhen 1.4s ease-out 1;}
.cfx-when-top{display:flex;flex-wrap:wrap;align-items:center;gap:6px 14px;}
.cfx-when-jump{background:#DB8437;color:#fff;padding:3px 12px;border-radius:999px;font:800 15px/1.3 'Poppins','Inter',sans-serif;box-shadow:0 2px 8px rgba(0,0,0,.25);}
.cfx-when-date b{color:#FFD9A8;font-weight:800;}
.cfx-when-sol{margin-left:auto;padding:3px 12px;border-radius:999px;background:#1F6B47;color:#E6FFF1;font:600 13.5px/1.3 'IBM Plex Mono',monospace;}
.cfx-when-sol b{font-weight:800;color:#fff;}
.cfx-when p{margin:6px 0 0;color:#fff;font-weight:600;}
.cfx-when-other{border-color:#AEB6CC;background:rgba(255,255,255,.08);}.cfx-when-other .cfx-when-jump{background:#5B6787;}
.cfx-when-soon{border-color:#E0A526;}.cfx-when-soon .cfx-when-sol{background:#A86B12;color:#FFF4DE;}
.cfx-when-late{border-color:#E5484D;background:linear-gradient(90deg,rgba(229,72,77,.32),rgba(255,255,255,.07) 70%);}.cfx-when-late .cfx-when-sol{background:#B4282D;color:#fff;}
@keyframes cfxWhen{0%{box-shadow:0 0 0 0 rgba(244,183,122,.75)}100%{box-shadow:0 0 0 14px rgba(244,183,122,0)}}
@media (prefers-reduced-motion:reduce){.cfx-when{animation:none;}}
/* today (the real date) is white, apart from the orange file marker, so neither is read as the other */
/* the trace (a trainee's timeline): the dates worked are lit and joined, the marker glows, the dates ahead are hollow */
.cf-tl-sum{margin:-6px 0 12px;font:500 13.5px/1.4 'Inter',sans-serif;color:#C9CFE0;}.cf-tl-sum b{color:#F4B77A;}
.cf-trace .cfx-tl-full li.past .cf-tl-b{background:rgba(219,132,55,.28);border-color:#DB8437;color:#fff;}
.cf-trace .cfx-tl-full li.past i{background:#F4B77A;border-color:#F4B77A;}
.cf-trace .cfx-tl-full li.past small{color:#fff;}
.cf-trace .cfx-tl-full li.past + li.past::before,.cf-trace .cfx-tl-full li.past + li.here::before{display:block !important;content:"" !important;position:absolute !important;left:-4px;top:50%;width:4px;height:2px;background:#DB8437;}
.cf-trace .cfx-tl-full li.here .cf-tl-b{box-shadow:0 0 0 3px rgba(244,183,122,.45);animation:cfTraceHere 2s ease-in-out infinite;}
.cf-trace .cfx-tl-full li.next .cf-tl-b{opacity:1;background:transparent;border-style:dashed;border-color:rgba(255,255,255,.28);color:#8C95AD;}
.cf-trace .cfx-tl-full li.next i{background:transparent;}
.cf-trace .cfx-tl-full li.next small{color:#8C95AD;}
@keyframes cfTraceHere{0%,100%{box-shadow:0 0 0 3px rgba(244,183,122,.45)}50%{box-shadow:0 0 0 6px rgba(244,183,122,.12)}}
@media (prefers-reduced-motion:reduce){.cf-trace .cfx-tl-full li.here .cf-tl-b{animation:none;}}
.cf-tl-pop span{display:block;margin-top:2px;font:600 10.5px 'IBM Plex Mono',monospace;color:#F4B77A;}
.cf-tl-pop{position:absolute;left:50%;top:calc(100% + 8px);transform:translateX(-50%);z-index:20;display:none;width:max-content;max-width:260px;padding:7px 11px;border-radius:10px;background:#12162B;border:1px solid #DB8437;color:#fff;font:700 12.5px/1.3 'Inter',sans-serif;box-shadow:0 8px 20px rgba(0,0,0,.45);}
.cf-timeline .cfx-tl-full li:hover .cf-tl-pop,.cf-timeline .cfx-tl-full li:focus-within .cf-tl-pop{display:block;}
.cf-timeline .cfx-tl-full li:first-child .cf-tl-pop{left:0;transform:none;}
.cf-timeline .cfx-tl-full li:last-child .cf-tl-pop{left:auto;right:0;transform:none;}
@media(max-width:760px){.cf-lanes{grid-template-columns:minmax(0,1fr);}}
.cf-timeline h3{margin:0 0 12px;font:800 20px 'Poppins','Inter',sans-serif;color:#fff;}
@media(max-width:760px){
  .cfx-sb-grid{grid-template-columns:minmax(0,1fr);}
  .cfx-tl li:nth-child(1),.cfx-tl li:nth-child(7){display:none;}
  .cfx-tl b{font-size:10.5px;}
}
/* the exhibit audit, the completed package and the Service Confirmation */
.cfx-aud{display:grid;gap:12px;}
.cfx-aud-h{display:flex;flex-wrap:wrap;align-items:center;gap:10px;}
.cfx-aud-due{font-size:13px;color:var(--ink-soft);}
.cfx-aud-intro{font-size:17px;line-height:1.45;margin:0;max-width:80ch;}
.cfx-aud-row{display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:12px;}
.cfx-aud-card{border:1px solid var(--line);border-radius:12px;padding:10px 13px;background:#fff;display:grid;gap:3px;}
.cfx-aud-card b{color:var(--navy);font-size:12px;text-transform:uppercase;letter-spacing:.05em;}
.cfx-aud-card>span{font-size:16px;font-weight:700;color:var(--navy);}
.cfx-aud-card small{font-size:12.5px;color:var(--ink-soft);line-height:1.4;}
.cfx-aud-score{background:#FFF8EF;border-color:#F0C08A;}
.cfx-aud-rev{background:#F3F7F4;border-color:#BBD4C4;}
.cfx-aud-points{margin:0;padding-left:20px;display:grid;gap:3px;font-size:14px;color:var(--ink);}
.cfx-aud-act{display:flex;flex-wrap:wrap;align-items:center;gap:10px;}
.cfx-aud-note{font-size:13px;color:var(--ink-soft);}
.cfx-bench,.cfx-sv{max-width:1180px;}
.ab-top,.sv-top{display:flex;flex-wrap:wrap;gap:6px 16px;align-items:center;font-size:13px;color:var(--ink-soft);margin-bottom:8px;}
.ab-sc{margin-left:auto;font-weight:800;color:var(--navy);}
.sv-warn{color:#A2410F;font-weight:700;}
.ab-key{display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:4px 12px;margin-bottom:10px;font-size:12px;color:var(--ink-soft);}
.ab-key b{color:var(--navy);}
.ab-table{width:100%;border-collapse:collapse;font-size:13px;}
.ab-table th{text-align:left;background:#F4F6FA;border:1px solid var(--line);padding:5px 7px;color:var(--navy);font-size:11.5px;text-transform:uppercase;letter-spacing:.04em;}
.ab-table td{border:1px solid var(--line);padding:6px 7px;vertical-align:top;line-height:1.4;}
.ab-table tr.ok td{background:#F3F9F5;}
.ab-table tr.no td{background:#FDF4F2;}
.ab-ref{font-family:ui-monospace,Menlo,monospace;font-weight:700;color:var(--navy);white-space:nowrap;}
.ab-as{color:var(--ink-soft);}
.ab-call{min-width:160px;}
.ab-sel,.ab-note,.sv-write,.sv-name{font:inherit;font-size:13px;border:1px solid var(--line);border-radius:7px;padding:5px 7px;width:100%;background:#fff;}
.ab-v{font-weight:700;color:var(--navy);}
.ab-ok{color:#1d5c3a;font-weight:800;margin-left:4px;}
.ab-right{font-weight:800;color:#A2410F;}
.ab-kind{display:inline-block;font-size:10.5px;text-transform:uppercase;letter-spacing:.05em;font-weight:800;color:#A2410F;}
.ab-foot,.ab-rev{margin-top:12px;display:flex;flex-wrap:wrap;gap:10px;align-items:center;font-size:13px;color:var(--ink-soft);}
.ab-rev{display:block;border:1px solid #BBD4C4;background:#F3F7F4;border-radius:12px;padding:10px 14px;color:var(--ink);}
.ab-rev ul{margin:6px 0;padding-left:20px;}
.sv-step{border:1px solid var(--line);border-radius:12px;padding:10px 14px;margin-bottom:10px;background:#fff;}
.sv-step.sv-done{border-color:#BBD4C4;background:#F7FBF8;}
.sv-step.sv-now{border-color:#F0C08A;background:#FFFCF7;}
.sv-step.sv-wait{opacity:.6;}
.sv-step.sv-no{border-color:#E6B4A8;background:#FDF6F4;}
.sv-h{display:flex;align-items:center;gap:9px;color:var(--navy);font-size:15px;}
.sv-n{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:var(--navy);color:#fff;font-size:12px;font-weight:800;flex:0 0 auto;}
.sv-step.sv-done .sv-n{background:#1d5c3a;}
.sv-b{margin-top:8px;font-size:13.5px;line-height:1.5;}
.sv-note{color:var(--ink-soft);margin:6px 0 0;}
.sv-brief{margin:0 0 8px;}
.sv-eh{font-family:ui-monospace,Menlo,monospace;font-size:12px;background:#F4F6FA;border:1px solid var(--line);border-radius:8px;padding:7px 9px;margin:0 0 8px;line-height:1.6;}
.sv-body{font-family:ui-monospace,Menlo,monospace;font-size:12px;white-space:pre-wrap;background:#fff;border:1px solid var(--line);border-left:3px solid #DB8437;border-radius:0 8px 8px 0;padding:8px 10px;margin:0;}
.sv-req,.sv-est,.sv-sec{margin:8px 0 0;padding-left:20px;display:grid;gap:3px;}
.sv-row{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:9px;}
.sv-name{max-width:420px;}
.sv-msg{font-size:12.5px;color:#A2410F;}
.sv-msg ul{margin:4px 0 0;padding-left:18px;}
.sv-ok{font-size:12.5px;color:#1d5c3a;font-weight:700;}
.sv-choices{display:grid;gap:6px;margin-top:9px;}
.sv-ch{display:grid;grid-template-columns:20px 1fr;gap:8px;align-items:start;border:1px solid var(--line);border-radius:9px;padding:7px 9px;cursor:pointer;}
.sv-ch.ok{border-color:#BBD4C4;background:#F3F9F5;}
.sv-ch.no{border-color:#E6B4A8;background:#FDF4F2;}
.sv-ch small{color:var(--ink-soft);}
.am-opt{display:block;white-space:nowrap;font-size:13px;cursor:pointer;}
.am-wrong{margin:0 0 8px;}
.am-sub{margin-top:10px;}
.am-sub>b{display:block;color:var(--navy);font-size:13px;margin-bottom:5px;}
.am-fb,.am-report{margin-top:12px;border:1px solid #C9D3E6;background:#F5F8FD;border-radius:12px;padding:10px 14px;font-size:13.5px;line-height:1.5;}
.am-report{margin:0 0 10px;border-color:#BBD4C4;background:#F3F9F5;}
.am-fb>b,.am-report>b{color:var(--navy);}
.am-fb p{margin:6px 0;}
.am-did,.am-report ul{margin:6px 0;padding-left:20px;display:grid;gap:3px;}
.am-did{list-style:none;padding-left:4px;}
.am-did i{color:var(--ink-soft);}
.am-fb details{margin-top:6px;}
.am-fb summary{cursor:pointer;color:var(--navy);font-weight:700;}
.sv-sentmail{display:grid;gap:8px;}
@media(max-width:760px){
  .ab-table,.ab-table thead,.ab-table tbody,.ab-table tr,.ab-table td{display:block;width:auto;}
  .ab-table thead{display:none;}
  .ab-table tr{border:1px solid var(--line);border-radius:10px;margin-bottom:8px;padding:4px;}
  .ab-table td{border:0;padding:4px 6px;}
  .cfx-aud-intro{font-size:15px;}
}
.cfx-blank{filter:blur(7px);user-select:none;pointer-events:none;color:var(--ink);background:#FCE3C6;border-radius:4px;padding:0 2px;font-weight:700;animation:cfxBlurPulse 2.4s ease-in-out infinite;}   /* the answer, blurred in place until revealed; a slow pulse marks it as hidden */
@keyframes cfxBlurPulse{0%,100%{filter:blur(7px);opacity:1;}50%{filter:blur(9px);opacity:.7;}}
.cfx-unblur{animation:cfxUnblur .9s ease-out both;}
@keyframes cfxUnblur{from{filter:blur(8px);opacity:.6;}to{filter:blur(0);opacity:1;}}
@media(prefers-reduced-motion:reduce){.cfx-blank{animation:none;}.cfx-unblur{animation:none;}}
.cfx-reveal{display:flex;gap:12px;align-items:center;justify-content:space-between;margin:10px 0;padding:10px 14px;border-radius:10px;background:#FFF6EC;font-size:14px;}
.cfx-key-note{font-size:12.5px;color:var(--ink-soft);margin:6px 0;}
.cfx-modal{position:fixed;inset:0;z-index:9999;background:rgba(20,26,44,.55);display:flex;align-items:flex-start;justify-content:center;padding:4vh 16px;overflow:auto;}
.cfx-modal-in{max-width:980px;width:100%;padding:18px 24px !important;}
.cfx-modal-h{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;font-size:17px;color:var(--navy);}
.cfx-modal-in{transform:translate(var(--cfx-dx,0px),var(--cfx-dy,0px));transition:none;}
.cfx-modal-h{cursor:move;touch-action:none;user-select:none;}
.cfx-modal-h button,.cfx-modal-h a{cursor:pointer;}
.cfx-modal-moved{background:transparent;pointer-events:none;overflow:hidden;}
.cfx-modal-moved .cfx-modal-in{pointer-events:auto;max-height:var(--cfx-mh,92vh);overflow:auto;padding-top:0 !important;box-shadow:0 18px 50px rgba(20,26,44,.35);}
.cfx-modal-moved .cfx-modal-h{position:sticky;top:0;z-index:2;margin:0 -24px 10px;padding:14px 24px 10px;background:#fff;border-bottom:1px solid #E6E8F0;}
@media(max-width:760px){
  .cfx{padding:16px 16px 18px !important;}
  .cfx-title{font-size:26px !important;}.cfx-of{display:block;font-size:15px;margin-top:4px;}.cfx-sep{display:none;}
  .cfx-hero,.cfx-split,.cfx-lesson .cfx-split,.cfx-task,.cfx-dd,.cfx-grade,.cfx-qs-2,.cfx-theory,.cfx-th-grid,.cfx-fw-flow{grid-template-columns:minmax(0,1fr);}
  .cfx-fw-flow li:not(:last-child)::after{content:"⬇";right:50%;top:auto;bottom:-15px;transform:translateX(50%);}
  .cfx-hook{font-size:24px;}.cfx-situation{font-size:19px;}
  .cfx-points li{font-size:19px;grid-template-columns:36px 1fr;}.cfx-points li::before{width:32px;height:32px;font-size:16px;}
  .cfx-flow{grid-template-columns:minmax(0,1fr);}.cfx-arrow{transform:rotate(90deg);justify-self:center;}
  .cfx-art.small{display:none;}
  .cfx-dd li,.cfx-tick{font-size:18px;}
}
@media(prefers-reduced-motion:reduce){.cfx *{animation:none !important;}}
.cf-card .cf-topic{margin:-4px 0 10px;font:600 13px/1.4 var(--font-ui);color:var(--ink-soft);}
.cf-strip{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;}
.cf-anchor{display:inline-flex;flex-direction:column;gap:1px;background:#F6F7FB;border:1px solid var(--line);border-radius:10px;padding:6px 11px;font:500 12.5px/1.35 var(--font-ui);color:var(--ink);}
.cf-anchor b{font:700 10.5px/1.2 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:var(--navy-soft);}
.cf-anchor.cf-flag{background:#FFF8EF;border-color:#F0D2AE;}
.cf-anchor.cf-flag b{color:var(--orange-deep);}
.cf-why{margin:0 0 8px;font-weight:600;color:var(--navy);}
.cf-prompt{margin:0 0 10px;}
.cf-note{font-size:12.5px;color:var(--ink-soft);margin:8px 0 0;}
.cf-tool{display:flex;flex-wrap:wrap;gap:10px;align-items:stretch;}
.cf-tool>div{flex:1 1 220px;background:#fff;border:1px solid var(--line);border-top:3px solid var(--orange);border-radius:12px;padding:9px 12px;display:flex;flex-direction:column;gap:2px;font-size:13.5px;}
.cf-tool>div b{color:var(--navy);font-size:12.5px;}
.cf-tool .btn{align-self:center;}
.cf-q{margin:6px 0 0;padding-left:22px;}
.cf-q li{margin:6px 0;}
.cf-ladder{display:grid;grid-template-columns:minmax(0,1fr) auto;gap:12px;align-items:stretch;}
.cf-rungs{display:flex;flex-direction:column;gap:7px;}
.cf-rung{display:grid;grid-template-columns:26px 78px auto 1fr;gap:10px;align-items:center;border-radius:12px;padding:10px 14px;color:#fff;background:var(--navy);text-align:left;}
.cf-rung-2{background:var(--navy-soft);}
.cf-rung-3{background:var(--orange);color:#241304;}
.cf-rung-n{display:grid;place-items:center;width:24px;height:24px;border-radius:50%;background:rgba(255,255,255,.18);font:700 12px 'IBM Plex Mono',monospace;}
.cf-rung-3 .cf-rung-n{background:rgba(36,19,4,.15);}
.cf-rung-tag{font:700 11.5px 'IBM Plex Mono',monospace;letter-spacing:.06em;}
.cf-rung-limit{font:700 19px 'Fraunces',Georgia,serif;}
.cf-rung-meta{font-size:11.5px;opacity:.85;text-align:right;}
.cf-brace{display:grid;place-content:center;gap:2px;text-align:center;padding:0 16px;border-left:4px solid var(--orange);border-radius:0 12px 12px 0;background:#FBF1E6;}
.cf-total{font:700 28px 'Fraunces',Georgia,serif;color:var(--navy);}
.cf-total-l{font:700 10px 'IBM Plex Mono',monospace;letter-spacing:.1em;color:var(--orange-deep);}
.cf-order{margin:8px 0 0;font-size:13px;}
.cf-rubric{margin:12px 0 0;border:1px solid var(--line);border-radius:12px;background:rgba(255,255,255,.8);padding:0 14px;}
.cf-rubric summary{cursor:pointer;padding:10px 0;font:800 13px var(--font-ui);color:var(--navy);}
.cf-rubric-h{margin:8px 0 4px;font:700 12px var(--font-ui);color:var(--navy);}
.cf-formula{margin:8px 0;font:600 12.5px 'IBM Plex Mono',monospace;color:var(--navy);}
.cf-ss{display:flex;flex-direction:column;gap:10px;}
.cf-ss-q{display:flex;flex-direction:column;gap:5px;font-size:13.5px;}
.cf-ss-q textarea{width:100%;box-sizing:border-box;min-height:64px;resize:vertical;border:1px solid var(--line);border-radius:10px;padding:8px 10px;font:400 14px/1.5 var(--font-ui);color:var(--ink);background:#fff;}
.cf-ss-q textarea:focus{outline:2px solid var(--orange-soft);border-color:var(--orange);}
.cf-scale td,.cf-scale th{text-align:center;}
.cf-scale td:first-child,.cf-scale th:first-child{text-align:left;}
.cf-scale input{accent-color:var(--orange);width:16px;height:16px;}
.cf-legend{margin:0;font-size:11.5px;color:var(--ink-soft);}
.cf-ss-act{display:flex;flex-wrap:wrap;gap:8px;align-items:center;}
.cf-ss-st{font-size:12px;color:var(--ink-soft);}
.cf-scores{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}
.cf-score{background:#F6F7FB;border:1px solid var(--line);border-radius:12px;padding:9px 12px;display:flex;flex-direction:column;gap:2px;}
.cf-score b{font:700 22px 'Fraunces',Georgia,serif;color:var(--navy);}
.cf-score span{font:700 11.5px var(--font-ui);color:var(--navy);text-transform:uppercase;letter-spacing:.05em;}
.cf-score small{font-size:11.5px;color:var(--ink-soft);}
.cf-ai{margin-top:8px;font-size:13px;background:#FFFBF3;border:1px solid var(--orange-soft);border-radius:12px;padding:9px 12px;}
.cf-ai p{margin:4px 0 0;}
.cf-dash{margin-top:22px;}
@media(min-width:1001px){
  main.main-dash > .cf-first{flex:0 0 auto;min-height:100%;display:flex;flex-direction:column;}
  main.main-dash > .cf-first > .dash-top{flex:0 0 auto;}
  main.main-dash > .cf-first > .dash-layout{flex:1 1 auto;display:flex !important;flex-direction:column;}
  /* the page scrolls to the Case Flow row anyway, so a short laptop screen never crushes the day cards' icon and topics */
  main.main-dash > .cf-first .module-card.mc-clean .module-body{min-height:118px;}
  main.main-dash > .cf-dash{flex:0 0 auto;}
}
.cf-tr-wrap{margin-top:14px;}
.cf-track{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;margin:0 0 10px;padding:10px 12px;background:#F6F7FB;border:1px solid var(--line);border-radius:12px;}
.cf-track label{display:flex;gap:8px;align-items:center;flex-wrap:wrap;}
.cf-track select{max-width:100%;}
.cf-track .cf-note{margin:0;flex:1 1 260px;}
.cf-tr summary{cursor:pointer;display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.cf-tr-chips{display:inline-flex;flex-wrap:wrap;gap:4px;}
.cf-tr-rubric{font-size:12.5px;color:var(--ink-soft);margin:6px 0;}
.cf-tr input[type=number]{width:90px;}
.cf-dash-head h2{margin:2px 0 6px;color:var(--navy);font-size:22px;}
.cf-dash-head p:not(.eyebrow){margin:0 0 12px;max-width:90ch;color:var(--ink-soft);font-size:14px;}
.cf-soon .module-body{opacity:.8;}
.cf-docline{display:flex;flex-wrap:wrap;gap:4px 10px;align-items:baseline;margin:8px 0 0;font-size:12.5px;}
.cf-docline b{font-size:12px;color:var(--navy);}
.cf-docline a{color:var(--navy-soft);text-decoration:underline;text-decoration-color:var(--orange-soft);text-underline-offset:2px;}
.cf-docline a:not(:last-child)::after{content:" ·";color:var(--ink-soft);}
.cf-px-mods{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;}
.cf-px-mod{border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:#fff;}
.cf-px-mh{font:700 13px var(--font-ui);color:var(--navy);margin-bottom:6px;}
.cf-px-act{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:7px 0;border-top:1px dashed var(--line);}
.cf-px-act b{font-size:13.5px;color:var(--ink);}
.cf-px-act > .btn{flex:0 0 auto;white-space:nowrap;}
.cf-px-meta{display:flex;flex-direction:column;gap:2px;margin-top:3px;font-size:12px;color:var(--ink-soft);}
.cf-px-lock{font-size:14px;opacity:.7;}
.cf-px-track{font:700 11px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:var(--orange-deep);margin-left:6px;}
@media(max-width:760px){.cf-px-mods{grid-template-columns:minmax(0,1fr);}}
.cf-prof-lock{background:#F6F7FB;}
.cf-prof-lock h3{color:var(--ink-soft);}
.cf-prof-lock li{color:var(--ink-soft);}
@media(max-width:760px){
  .cf-ladder{grid-template-columns:minmax(0,1fr);}
  .cf-brace{border-left:0;border-top:4px solid var(--orange);border-radius:0 0 12px 12px;padding:10px 0;}
  /* narrow: number · tag · limit on one row, the carrier line under them across the full width */
  .cf-rung{grid-template-columns:24px minmax(0,1fr) auto;row-gap:4px;}
  .cf-rung-limit{white-space:nowrap;}
  .cf-rung-meta{grid-column:1/-1;text-align:left;}
  .cf-scores{grid-template-columns:minmax(0,1fr);}
}`;
document.head.appendChild(st);
})();
