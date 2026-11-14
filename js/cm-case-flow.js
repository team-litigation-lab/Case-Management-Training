/* ============================================================
   5-DAY LEGAL CASE MANAGEMENT FLOW — the track's days, slides and wiring
   Focus case: John Doe VS Robert Smith · Lead Counsel: Atty. Elijah Thorne

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
    const phase = {n: pi + 1, of: seq.phases.length, title: ph.title, lead: ph.lead || "Case Phase", count: ph.blocks.length, lane: ph.workstream || "",
      num: seq.phases.length > 1 ? pi + 1 : day.n};   // a topic's number: Day 2's topics are 2.1, 2.2 … (the phase's number when a day has several)
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
        h: `${phase.num}.${k + 1} ${b.title}`,
        fourPart: Object.assign(fp, {bestPractices: b.best || [], discussionCase: ""}),
        trainerCue: (b.notes || [])[0] || "",
        cf: {day, mod, block: b, k, phase, lane: (ph.lanes || {})[id] || phase.lane,   // day: where it is taught; mod: its unit of scoring; lane: its workstream
             practises: b.kind === "activity" ? (ph.practises || {})[id] || "" : "",   // an activity: the id of the lesson it practises (cf.of: that lesson, set below)
             heading: (ph.headings || {})[id] || (b.kind === "lesson" ? (phase.lead === "Case Phase" ? "" : phase.lead + ": ") : b.kind === "activity" ? "Skill Building: " : "Learning Check: ") + ph.title}
      }, layoutOf(b.show)));
      if(b.kind === "check") pools.push((mod.quiz || []).map(q => ({q, mod: mod.id})));
    });
  });
  // a Skill Activity's lesson (the sequence's `practises`; without one, the last lesson of its own module taught before it)
  lessons.forEach((l, i) => { if(l.cf.block.kind !== "activity") return;
    l.cf.of = lessons.find(x => x.cf.block.kind === "lesson" && x.cf.block.id === l.cf.practises)
      || lessons.slice(0, i).filter(x => x.cf.block.kind === "lesson" && x.cf.mod === l.cf.mod).pop() || null; });
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
    cf: {n: day.n, gate: day.gate, quizMod, phases, build: seq.build === "rest" ? "rest" : Number(seq.build) || 0, lessonMax: Number(seq.lessonMax) || 0}   // build: minutes of the day's practical spent building the companion case (Day 5)
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
    <span class="cf-anchor"><b>Client</b>${E(c.client.name)}</span>
    <span class="cf-anchor"><b>Lead Counsel</b>${E(c.counsel)}</span>
    <span class="cf-anchor"><b>SOL</b>${E(c.sol)}</span>
    <span class="cf-anchor cf-flag"><b>Recovery Stack</b>${E(L.map(l => money(l.limit) + " " + l.tag).join(" / "))} = ${E(money(c.total))}</span>
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
  if(typeof toast === "function") toast(`Your CMS Date of Loss is ${c.dol}: the case's dates move ${n > 0 ? "+" : ""}${n} day${Math.abs(n) === 1 ? "" : "s"}. Update them from 📇 Case Profile.`);
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

/* ---------- the full text of a block (the curriculum as written), behind "📖 Additional Reference" ---------- */
function fullText(l, d){
  const {block: b} = l.cf;
  if(b.kind === "lesson"){
    // the foundation (CF.discuss) comes first: the knowledge the rules stand on, for the discussion
    const found = (CF.discuss || {})[b.id] || [], n = found.length ? 1 : 0;
    return (n ? S(1, "The Foundation — for discussion", `<div class="cf-discuss">${found.map(p => `<p>${hl(p)}</p>`).join("")}</div>`) : "")
      + S(1 + n, "Tell Them — the rules and the strategic why", `<p class="cf-why">${E(b.tell.why)}</p>${ul(b.tell.rules)}`
      + (b.tell.upl || []).map(u => renderCallout({type: "warning", label: "UPL boundary", text: u})).join(""))
    + S(2 + n, showLabel(b, "Show Them"), visual(l, b))
    + S(3 + n, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
  }
  if(b.kind === "activity") return S(1, "The scenario", `<div class="scenario-card"><div class="stag">John Doe VS Robert Smith</div><p class="scn">${E(b.act.scenario)}</p></div>`)
    + S(2, "Execute on the live file", `<p class="cf-prompt">${E(b.act.prompt)}</p><div class="cf-tool"><div><b>🛠 Tool / interface</b><span>${E(b.act.tool)}</span></div><div><b>📤 Expected output</b><span>${E(b.act.output)}</span></div></div>`)
    + S(3, "Verification checkpoints", answersOpen(b.id) ? ul(b.act.checkpoints) : `<p class="cf-note">Shown once the AI Grader has scored your work on this activity.</p>`)
    + S(4, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
  return S(1, "Knowledge verification", `<ol class="cf-q">${b.check.questions.map(q => `<li>${E(q)}</li>`).join("")}</ol>`)
    + S(2, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
}

/* ---------- the slides: one idea per slide, big type, a picture, the key point highlighted ----------
   Every block is a short run of slides (its "views"), drawn from its concise copy (js/cm-case-flow-slides.js,
   window.CM_CF_SLIDES[blockId]; written to build/case-flow/slides/SLIDESPEC.md) and its picture
   (js/cm-case-flow-art.js). The block's full curriculum text stays one tap away (📖 Additional Reference) and in
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
const VIEW_LABEL = {grade: "The Grade-A Standard", audit: "Audit & the Finished Set", why: "Why It Matters", doc: "The Document", theory: "The Theory", theory2: "The Theory, Continued", frame: "The Framework", rules: "The Rules", map: "The Roadmap", model: "See It", dodont: "Do & Don't",
  case: "Your Case", task: "Your Task", check: "AI Grader", questions: "Knowledge Check", questions2: "Knowledge Check, Continued", summary: "Self-Summary", scale: "Skill Scale"};
const VIEW_ICON = {grade: "🏅", audit: "🔍", why: "💡", doc: "📄", theory: "📚", theory2: "📚", frame: "🧭", rules: "📏", map: "🗺", model: "🔍", dodont: "✅", case: "📂", task: "🎯", check: "🤖", questions: "🧠", questions2: "🧠", summary: "📝", scale: "📊"};
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
/* The three micro-frameworks (build/case-flow/slides/SLIDESPEC.md), drawn on a lesson's existing slides so no slide
   is added: the CM Red Flag (the risk, what it costs, what you do, whose call) on the slide rfView names (Why It
   Matters where the lesson still has that slide; otherwise The Rules, or the slide the copy's `on` names), Rule vs.
   Exception on The Rules, and Milestone Steps (the case's own dates) on The Framework, or on The Rules where a
   lesson has no Framework (msView), in the few lessons whose slide has room for the rail at full size on a laptop.
   At most one Red Flag on a slide.
   (The lessons had an On the Job slide here, their operational steps as rows of cards, and 26 of them then a
   Milestone Steps slide of their own in its place: both are gone, and so is that table in 📖 Additional Reference. Those lessons' steps are in the trainer's talking
   points for The Rules, build/case-flow/scripts.) */
const mfOf = b => { const c = SLIDES[b.id] || {}; return {redFlag: c.redFlag || null, ruleEx: c.ruleEx || null, milestones: c.milestones || null}; };
const FLAG_SVG = `<svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true" focusable="false"><path d="M5 21V4" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"/><path d="M6 4h11l-2.6 4L17 12H6z" fill="currentColor"/></svg>`;
function redFlagBox(b, view){
  const r = mfOf(b).redFlag; if(!r || rfView(b) !== view) return "";
  const row = (k, x) => `<div class="cfx-rf-r"><dt>${k}</dt><dd>${hl(x)}</dd></div>`;
  return `<aside class="cfx-rf" role="note" aria-label="CM Red Flag"><div class="cfx-rf-h"><span class="cfx-rf-i">${FLAG_SVG}</span><b>CM Red Flag</b><span class="cfx-rf-own">Owner: ${E(r.owner)}</span></div>
    <dl>${row("You see", r.see)}${row("It costs", r.costs)}${row("You do", r.do)}</dl></aside>`;
}
function ruleExBox(b){
  const x = mfOf(b).ruleEx; if(!x) return "";
  return `<section class="cfx-rx" aria-label="Rule vs. Exception"><div class="cfx-rx-p"><div class="cfx-rx-rule"><p><b>Rule</b> ${hl(x.rule)}</p></div>
    <div class="cfx-rx-exc"><p><b>${x.contrast ? "Contrast" : "Exception"}</b> ${hl(x.exception)}</p></div></div>
    ${x.onFile ? `<p class="cfx-rx-file"><b>On this file:</b> ${hl(x.onFile)}</p>` : ""}<p class="cfx-rx-conf"><b>Confirm:</b> ${hl(x.confirm)}</p></section>`;
}
const msView = b => { const vs = viewsOf(b); return ["frame", "rules"].find(v => vs.includes(v)) || null; };
function milestoneRail(b, view){
  const m = mfOf(b).milestones; if(!m || msView(b) !== view) return "";
  const n0 = m.start || 1;
  return `<section class="cfx-ms" aria-label="Milestone Steps: ${E(m.title)}"><h3 class="cfx-ms-t">${E(m.title)}</h3><ol class="cfx-ms-rail" style="--n:${m.steps.length}" start="${n0}">${m.steps.map((s, i) => `<li><span class="cfx-ms-n">${n0 + i}</span><span class="cfx-ms-h"><b>${E(s.label)}</b>${s.chip ? `<code class="cfx-ms-chip">${E(s.chip)}</code>` : ""}</span><span class="cfx-ms-done"><i>Done when:</i> ${hl(s.done)}</span></li>`).join("")}</ol>
    ${m.note ? `<p class="cfx-ms-note">${hl(m.note)}</p>` : ""}</section>`;
}
/* A lesson whose slides are the trainer's own Canva deck pages (js/cm-deck-slides.js, from build/videoslide): one slide
   per page, named deck<page>, in place of the lesson's drawn slides. The page's speaker notes are its Presenter script. */
const DECK = window.CM_DECK_SLIDES || {};
const deckOf = b => (b.kind === "lesson" && DECK[b.id]) || null;
const deckPage = (b, view) => (deckOf(b) || []).find(x => "deck" + x.page === view) || null;
Object.values(DECK).forEach(xs => xs.forEach(x => { VIEW_LABEL["deck" + x.page] = x.title; VIEW_ICON["deck" + x.page] = "🖼"; }));
/* Why It Matters is no slide of its own in a lesson that has The Theory: its line opens that slide (whyOpen: a
   "💡 Why it matters" band above the theory's lead), one slide where there were two. The band is one line: the
   lesson's hook, or the copy's shorter `whyLine` where the hook would wrap (the full hook is then in the slide's
   talking points). A lesson whose Theory also carries its merged roadmap draws the roadmap down the left and the
   theory beside it (cfx-th-road), so the three fit at full size on a laptop. The CM Red Flag that sat on Why It
   Matters is on The Rules, or on the slide the copy names (rfView: `on`), or, where no slide of the lesson has room
   for it at full size, in the trainer's talking points for The Rules only (`spoken`). A brief lesson has no Theory
   slide and keeps Why It Matters as it was; `"whySlide": true` in the copy would keep the slide in a lesson with a
   Theory (none does). js/cm-slide-places.js moves a place saved in the deck that had the slide. */
const whyView = b => theoryViews(b).length && !(SLIDES[b.id] || {}).whySlide ? [] : ["why"];
const rfView = b => { const r = mfOf(b).redFlag, vs = viewsOf(b); return !r ? null : vs.includes("why") ? "why" : r.spoken ? null : vs.includes(r.on) ? r.on : "rules"; };
const whyOpen = (b, c) => { if(b.kind !== "lesson" || viewsOf(b).includes("why") || !c.hook) return ""; const ls = leadSplit(c.hook), line = (SLIDES[b.id] || {}).whyLine || (ls ? ls[0] : c.hook);
  return `<p class="cfx-whyline" role="note" aria-label="Why it matters"><b class="cfx-whyline-k">💡 Why it matters</b><span class="cfx-whyline-t">${hl(line)}</span></p>`; };
function viewsOf(b, drawn){   // drawn: the lesson's own slides, as before its deck pages took their place (js/cm-slide-places.js)
  if(deckOf(b) && !drawn) return deckOf(b).map(x => "deck" + x.page);
  if(b.kind === "lesson" && b.brief) return ["why"].concat(docView(b), ["rules"]);   // brief: a condensed overview (Day 5's litigation); no Theory slide, so Why It Matters stays
  if(b.kind === "lesson" && b.compact) return mapView(b).concat(theoryViews(b).slice(0, 1), whyView(b), docView(b), ["rules"]);   // compact: a full topic on fewer slides
  if(b.kind === "lesson") return mapView(b).concat(theoryViews(b), whyView(b), docView(b), ["rules"], b.show ? ["model"] : [], (b.best || []).length && !b.noGame ? ["dodont"] : []);   // The Theory opens with why it matters; noGame: the CM introduction
  if(b.kind === "activity") return ["task", "case"].concat((SLIDES[b.id] || {}).grade ? ["grade"] : [], EX.audits[b.id] ? ["audit"] : [], b.show && !b.compact ? ["model"] : [], ["check"]);   // Your Task first: what to do, then the file it's done on   // compact: no See It slide (the worked model stays in 📖 Full text)
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
/* The answers (an activity's checkpoints, and the **marked** parts of its checks) open once the trainee has finished the activity
   (graded by the AI Grader, or revealed on a record from before it); the trainer always sees them, except on the shared slides window. */
const inAudience = () => typeof document !== "undefined" && !!document.body && document.body.classList.contains("audience-mode");
let justRevealed = null;   // the block whose answers were just revealed: they animate from blurred to clear once
const answersOpen = id => (isTrainer() && !inAudience()) || !!((REC.revealed || {})[id]);
const words = (t, n) => { const w = String(t || "").replace(/\s+/g, " ").trim().split(" "); return w.length <= n ? w.join(" ") : w.slice(0, n).join(" ").replace(/[,;:]$/, "") + "…"; };
const firstSentence = t => (String(t || "").match(/^.*?[.!?](\s|$)/) || [t])[0].trim();
function copyOf(b){   // the block's concise copy, or a condensed fallback from its full text
  const c = SLIDES[b.id] || {};
  const best = b.best || [], dos = best.filter(x => !/^pitfall/i.test(x)), donts = best.filter(x => /^pitfall/i.test(x)).map(x => x.replace(/^pitfall:\s*/i, ""));
  if(b.kind === "lesson") return {image: c.image, hook: c.hook || words(firstSentence(b.tell.why), 22), points: c.points || b.tell.rules.slice(0, 4).map(r => words(r, 16)),
    upl: c.upl !== undefined ? c.upl : ((b.tell.upl || [])[0] ? words(b.tell.upl[0], 18) : ""),
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
   Every Case Flow slide carries the tools its step is worked in (🛠 in the slide's top row), each Your Task
   step opens the tool it names, and Check Your Work logs the reference of what the trainee did
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
  {id: "records", icon: "🩺", short: "ChartSwap", name: "ChartSwap (the Medical Records Requests platform)", re: /ChartSwap|Medical Records Requests?/},
  {id: "efiling", icon: "🏛", short: "E-Filing", name: "Court E-Filing", re: /E-Filing|Docket System/},
  {id: "calendar", icon: "◫", short: "Conflicts", name: "the Calendar Conflict Resolver", re: /Calendar Conflict Resolver/},
  {id: "calendaring", icon: "🗓", short: "Calendaring", name: "the Calendaring Simulators", re: /Calendaring Simulators?/},
  {id: "plan", icon: "📝", short: "Action Plan", name: "your Action Plan", re: /Action Plan Editor|action plan/i},
  {id: "docs", icon: "📁", short: "Documents", name: "the Case Documents", re: /Case Documents/},
  {id: "lor", icon: "📄", short: "LOR Drafting", name: "LOR Drafting (John Doe VS Robert Smith)", re: /\bLORs?\b|Letters? of Representation/},
  {id: "packet", icon: "📚", short: "Packet Builder", name: "the Packet Builder (Demand Packets & Binders)", re: /Packet Builder/},
  {id: "drive", icon: "📂", short: "Backup Drive", name: "My Backup Drive (your linked Google Drive)", re: /Backup Drive/},
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
  "d5m2-a1": "cm_adjuster_statement",         // Keystone PD presses for a yes: the PD position stays with counsel
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
   discovery; Court E-Filing for every court date the litigation track sets and for the complaint,
   the First Amended Complaint and alternative service. */
const WORKED_IN = {
  "d2m2-a1": ["records"], "d2m2-a2": ["records"], "d2m2-a3": ["records"], "d2m3-a2": ["records"], "d2m4-a1": ["records"], "d3m3-a2": ["records"],
  "d4m1-a2": ["efiling"], "d4m2-a2": ["efiling"], "d5m1-a1": ["efiling", "records"], "d5m1-a2": ["efiling"],
  "d5m3-a1": ["efiling"], "d5m4-a2": ["efiling"],
  "d2m2-l1": ["records"], "d2m2-l2": ["records"], "d2m4-l1": ["records"], "d4m1-l2": ["efiling"], "d4m2-l1": ["efiling"], "d5m1-l1": ["efiling"], "d5m1-l2": ["efiling"]};
/* LOR Drafting (js/cm-lor.js, on John Doe's file with no assignment) is the claims phase's: Claim Set Up drafts the LORs */
const LOR_BLOCKS = new Set();
(CF.sequence || []).forEach(d => d.phases.forEach(ph => { if(/^Claim Set Up/.test(ph.title)) ph.blocks.forEach(id => LOR_BLOCKS.add(id)); }));
// the in-course pages a tool opens (anything else is a training platform in the tool frame)
const PAGE = {plan: ["notes"], docs: ["casedocs"], calendar: ["tool", "calendar"], lor: ["lor"]};
// the day a block is taught on (the sequence), which can differ from the day its data sits under
const TAUGHT_ON = {};
(CF.sequence || []).forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(id => { TAUGHT_ON[id] = sd.n; })));
const taughtOn = id => TAUGHT_ON[id];
function toolLive(id, blockId){
  // Day 5: the case is finished, so there is no Action Plan to work (the Practice Lab and its activities don't offer it)
  if(id === "plan" && blockId && taughtOn(blockId) === 5) return false;
  // a step with a call on John Doe's file takes that call; any other opens the Call Simulator (☎ LSH Ring Channel)
  if(id === "call") return !!(blockId && SIM.calls[blockId]) || (typeof cmTool === "function" && !!cmTool("calls"));
  if(id === "netsheet") return !!(blockId && NET_STAGE[blockId]);
  if(id === "lor") return !!(blockId && LOR_BLOCKS.has(blockId)) && typeof window.cmLorCard === "function";
  if(id === "drive") return !!(window.CMDrive && CMDrive.show);   // js/cm-drive.js: the 📂 Backup Drive panel
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
function toolChip(id, blockId, big){
  const t = TOOL[id];
  if(!t || !toolLive(id, blockId)) return "";
  const live = id === "call" && blockId && SIM.calls[blockId], name = live ? `the live call with ${SIM.calls[blockId].who}` : t.name;
  return `<button type="button" class="${big ? "btn btn-navy btn-sm" : "cfx-tool"}" data-tool="${id}" onclick="cmCaseFlow.tool('${id}','${blockId || ""}')" title="Open ${E(name)}">${t.icon} ${E(live ? "Live Call" : big ? t.name.replace(/^(the|your) /, "").replace(/^./, c => c.toUpperCase()) : t.short)}</button>`;
}
/* ---------- the Do & Don't slide: the lesson's Dos and Don'ts, side by side ---------- */
const ddList = c => `<div class="cfx-dd"><div class="cfx-do"><h3>✅ Do</h3><ul>${c.dos.map(x => `<li>${hl(x)}</li>`).join("")}</ul></div>
      <div class="cfx-dont"><h3>⚠️ Don't</h3><ul>${c.donts.map(x => `<li>${hl(x)}</li>`).join("")}</ul></div></div>`;
/* 🎓 Finish Training (the last day's Knowledge Check, once passed): the Congratulations & Thank You slide */
window.cmCaseFlow = window.cmCaseFlow || {};
window.cmCaseFlow.finish = function(){
  // the course closes on its Congratulations & Thank You slide (the certificate stays on the dashboard)
  const d = DAYS.find(x => isLastCfDay(x)); if(!d || typeof goto !== "function") return;
  goto("day", d.id); state.dayViewMode = "slides"; state.cfClosing = d.id;
  const k = buildDaySlides(d).findIndex(x => x.type === "closing");
  state.lessonSlide = k >= 0 ? k : 0; if(typeof render === "function") render(); window.scrollTo(0, 0);
};
// the Congratulations slide is a stop of its own, never part of the deck: leaving it (Previous, Slide Map, another
// page) closes it, so the deck ends on Continue to Knowledge Check again
["goto", "prevSlide", "goToSlide"].forEach(f => {
  if(typeof window[f] !== "function") return;
  const __f = window[f];
  window[f] = function(){ if(state.cfClosing){ state.cfClosing = null; if(f === "goToSlide" || f === "prevSlide") state.lessonSlide = Math.min(state.lessonSlide, buildDaySlides(DAYS.find(x => isLastCfDay(x))).length); } return __f.apply(this, arguments); };
});
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
    // (a lesson's ops, its operational steps in the data, count: nothing draws them now, but their tools and terms are still what the lesson teaches)
    const text = JSON.stringify([SLIDES[id] || {}, b.title, b.topic, b.tell || {}, b.kind === "lesson" ? b.ops || [] : [], b.act ? [b.act.scenario, b.act.prompt] : [], b.check ? b.check.questions : []]).replace(/\*\*/g, "");
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
  const dp = deckPage(b, view);
  if(dp) return `<figure class="cfx-deckpage"><img src="${E(dp.img)}" alt="${E(dp.title)}: ${E(String(dp.notes).slice(0, 220))}" width="1600" height="900" decoding="async"></figure>`;
  if(DRIVE_LATER.has(b.id) && window.CMDrive && CMDrive.dayOpened) CMDrive.dayOpened(Number(b.id.charAt(1)));   // a day's Backup File Maintenance: Day 2 lays its drill, and the day is graded
  switch(view){
    case "why": { const ls = leadSplit(c.hook);
      return `<div class="cfx-hero${mfOf(b).redFlag ? " cfx-hero-rf" : ""}"><div class="cfx-hero-text"><span class="cfx-chip">${E(titleCase(b.topic))}</span>${ls ? `<p class="cfx-lead-1">${hl("**" + ls[0] + "**")}</p><p class="cfx-hook">${hl(ls[1])}</p>` : `<p class="cfx-hook">${hl(c.hook)}</p>`}</div>${art(c.image)}</div>${redFlagBox(b, "why")}${strip()}`; }
    case "theory": case "theory2": {
      const t = c.theory, half = Math.ceil(t.concepts.length / 2), two = t.concepts.length > TH_PER;
      const list = !two ? t.concepts : view === "theory" ? t.concepts.slice(0, half) : t.concepts.slice(half);
      const why = view === "theory" ? whyOpen(b, c) : "", road = view === "theory" ? mapStrip(b) : "", cols = !!(why && road);   // cols: the merged roadmap down the left, the theory beside it
      return `<div class="cfx-theory cfx-th-solo${why ? " cfx-th-why" : ""}${cols ? " cfx-th-road" : ""}${rfView(b) === view ? " cfx-th-rf" : ""}"><div class="cfx-th-main">${why}${cols ? `<div class="cfx-th-cols">${road}<div class="cfx-th-side">` : road}
          ${view === "theory" ? (leadSplit(t.lead) ? `<p class="cfx-lead-1">${hl("**" + leadSplit(t.lead)[0] + "**")}</p><p class="cfx-th-lead">${hl(leadSplit(t.lead)[1])}</p>` : `<p class="cfx-th-lead">${hl(t.lead)}</p>`) : `<p class="cfx-th-cont">${E(titleCase(b.topic))}: continued</p>`}
          <div class="cfx-th-grid">${list.map((x, j) => `<div class="cfx-th-c" style="animation-delay:${j * .05}s"><b>${E(x.term)}</b><span>${hl(x.text)}</span>${(x.more || []).length ? `<button type="button" class="cfx-th-more" onclick="cmCaseFlow.more('${b.id}',${t.concepts.indexOf(x)})" title="More on ${E(x.term)}">＋ More</button>` : ""}</div>`).join("")}</div>${cols ? "</div></div>" : ""}${redFlagBox(b, view)}${why ? strip() : ""}</div>
      </div>`;
    }
    case "frame": {   // the deck page's structure, drawn in the course's own design
      const f = c.theory.framework, steps = f.steps || [];
      const body = f.kind === "table"
        ? `<div class="cfx-fw-scroll"><table class="cfx-fw-tbl"><thead><tr>${f.head.map(h => `<th>${E(h)}</th>`).join("")}</tr></thead><tbody>${f.rows.map((r, i) => `<tr style="animation-delay:${i * .05}s">${r.map((x, j) => j ? `<td>${hl(x)}</td>` : `<th scope="row">${hl(x)}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`
        : f.kind === "flow"
          ? `<ol class="cfx-fw-flow" style="--n:${steps.length}">${steps.map((x, i) => `<li style="animation-delay:${i * .07}s"><span class="cfx-fw-n">${i + 1}</span><b>${E(x.label)}</b><span>${hl(x.text)}</span>${stepMore(b, x, i)}</li>`).join("")}</ol>`
          : `<div class="cfx-fw-list">${steps.map((x, i) => `<div style="animation-delay:${i * .05}s"><b>${E(x.label)}</b><span>${hl(x.text)}</span>${stepMore(b, x, i)}</div>`).join("")}</div>`;
      return `<div class="cfx-fw"><h3 class="cfx-fw-t">${E(String(f.title).replace(/,?\s*\(?Steps?\s+\d+\s*[–-]\s*\d+\)?\s*$/i, ""))}</h3>${body}${f.note ? `<p class="cfx-fw-note">${hl(f.note)}</p>` : ""}</div>${milestoneRail(b, "frame")}${redFlagBox(b, "frame")}`;
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
      return `<div class="cfx-fw cfx-map"><h3 class="cfx-fw-t">🗺 ${E(r.title)}</h3><ol class="cfx-fw-flow" style="--n:${steps.length}">${steps.map((x, i) => `<li style="animation-delay:${i * .07}s"><span class="cfx-fw-n">${i + 1}</span><b>${E(x.label)}</b><span>${hl(x.text)}</span></li>`).join("")}</ol><p class="cfx-fw-note">Where this lesson is going: each step is taught next, before anything asks you to do it.</p></div>${redFlagBox(b, "map")}`;
    }
    case "rules": { const side = mfOf(b).ruleEx ? "rx" : msView(b) === "rules" && mfOf(b).milestones ? "ms" : rfView(b) === "rules" ? "rf" : "";   // beside the points: Rule vs. Exception, or the Red Flag, in the picture's place
      return `<div class="cfx-split${side ? " cfx-split-" + side : ""}${side === "rf" && mfOf(b).redFlag.tight ? " cfx-split-tight" : ""}"><ol class="cfx-points">${c.points.map(x => `<li><span>${hl(x)}</span></li>`).join("")}</ol>${side === "rx" ? ruleExBox(b) : side === "ms" ? "" : side === "rf" ? redFlagBox(b, "rules") : art(c.image, "small")}</div>${side === "rf" ? "" : redFlagBox(b, "rules")}${milestoneRail(b, "rules")}${plainBox(b)}
      ${c.upl ? `<div class="cfx-upl"><b>⚖ UPL Line</b><span>${hl(c.upl)}</span></div>` : ""}`; }
    case "audit": return auditSlide(b);
    case "grade": {   // what a Grade-A packet or binder holds and how it is built, shown before Your Task
      const g = SLIDES[b.id].grade, col = (cls, h, xs, ol) => `<div class="cfx-grade-c ${cls}"><h3>${h}</h3><${ol ? "ol" : "ul"}>${xs.map(x => `<li>${hl(x)}</li>`).join("")}</${ol ? "ol" : "ul"}></div>`;
      return `<div class="cfx-fw cfx-grade-w"><h3 class="cfx-fw-t">🏅 ${E(g.title)}</h3><div class="cfx-grade">${col("cfx-grade-g", "📐 Guidelines", g.guide)}${col("cfx-grade-i", "📦 Standard Inclusions", g.include)}${col("cfx-grade-s", "🪜 Steps to Grade A", g.steps, true)}</div>
        <p class="cfx-fw-note">Build your own version from the downloaded case documents, then upload it to your training Drive and the CMS: the platform audits it against this standard.</p></div>`;
    }
    case "model": return `<div class="cfx-model">${b.show && b.show.caption ? `<p class="cfx-caption">${E(b.show.caption)}</p>` : ""}${visual(l, b)}</div>${redFlagBox(b, "model")}`;
    case "dodont": return ddList(c) + redFlagBox(b, "dodont");   // the Do's and Don'ts themselves (3 Clues, 1 Rule is retired)
    case "case": {
      if(b.id === "d1m1-drive" && window.CMDrive && CMDrive.slide) return CMDrive.slide();   // Day 1's case backup: the task in four steps and the firm's standard, from the Worker (js/cm-drive.js)
      const docs = (CF_PACKETS[b.id] || []).map(id => CF_DOCS.find(x => x.id === id)).filter(docAvail).filter(Boolean).slice(0, 4);
      const ev = SIM.events[b.id], fall = falloutFor(b.id), vm = ev && ev.channel === "voicemail" && ev.spoken;
      const thumbs = notesOf(b.id) ? npCard(b.id) : ev && ev.log ? logSnapshot(ev.log) : docs.length ? `<div class="cfx-docs-row">${docs.map(x => `<a class="cfx-thumb" href="${E(docUrl(x))}" target="_blank" rel="noopener" title="${E(x.desc)}" onclick="return cmCaseFlow.doc(event,'${x.id}')"><img src="/decks/cf-docs/${E(x.id)}.webp" alt="" loading="lazy" onerror="this.parentNode.classList.add('cfx-thumb-off');this.remove()"><span>${E(x.title)}</span></a>`).join("")}</div>` : art(c.image, "small");
      return `<div class="cfx-sb${vm ? " cfx-sb-vmw" : ""}">${timeBanner(l)}
        ${fall.map(x => { const e = x.f.then.event, [icon] = CHANNEL[e.channel] || ["⚠️"];
          return `<details class="cfx-fall"><summary><span class="cfx-fall-i">⚠️</span><b>${E(e.subject)}</b><span class="cfx-fall-from">${icon} ${E(e.from || "")}</span></summary>
            <p>${E(e.body)}</p>${isTrainer() ? `<small class="cfx-fall-why">${x.done ? "Not shown to this trainee: they confirmed" : "Shown because this wasn't confirmed"}: “${E(x.what)}” (${E(x.f.if.activity)})</small>` : ""}</details>`; }).join("")}
        <div class="cfx-sb-grid${vm ? " cfx-sb-vm" + (notesOf(b.id) ? "" : " cfx-sb-vmd") : ""}">
          <div class="cfx-sb-main">${ev ? (ev.before || []).map(x => eventCard(x, "cfx-ev-before")).join("") + eventCard(ev, "", b.id, (docs.length > 0 && !ev.log) || !!notesOf(b.id)) : `<div class="cfx-task-card"><span class="cfx-chip">📂 On the file</span><p class="cfx-situation">${hl(c.situation)}</p></div>`}${docs.length && !vm && !notesOf(b.id) && !(ev && (ev.log || (ev.before || []).length)) ? art(c.image, "cfx-sb-art") : ""}</div>
          <div class="cfx-sb-docs">${thumbs}</div>
        </div></div>`;
    }
    case "task": {   /* Your Task, in one column (js/cm-sb-task.js styles it and draws its Launch button): one button opens the CMS and
         Google Drive, then the steps in full sentences, then what is done in another tool (the live call, the service confirmation,
         the Amendment Requests, the Notes & Action Plan), then one bar: the source files and Submit to AI Grader (js/cm-ai-grader.js).
         Purpose, principle and the naming convention are in 📖 Reference, with the rest of the rules. */
      const ofLine = practisesLine(l) ? `<b class="cfx-of" title="The lesson this activity practises: ${E(titleCase(l.cf.of.cf.block.title))}">${E(practisesLine(l))}</b>` : "";
      const more = blockTools(b).filter(id => !["cms", "drive", "call", "docs", "plan"].includes(id)).map(id => toolChip(id, b.id)).join(""), n = (CF_PACKETS[b.id] || []).length;
      const acts = (SIM.calls[b.id] ? `<div class="cfx-call"><b>📞 Live Call</b><span>${E(SIM.calls[b.id].who)} is on the line${(REC.calls || {})[b.id] ? ` · <em>✓ taken ${E(new Date(REC.calls[b.id].at).toLocaleDateString())}</em>` : ""}<small class="cfx-simnote-s">⏱ Simulated in real time for accelerated training</small></span>
          <button type="button" class="btn btn-orange btn-sm" data-tool="call" onclick="cmCaseFlow.call('${b.id}')">📞 Take the call</button></div>` : "")
        + (serviceOf(b.id) ? `<div class="cfx-call cfx-svb"><b>✉ ${E(svWords(serviceOf(b.id)).label)}</b><span>${E(serviceOf(b.id).kicker)}${svRec(b.id).filed ? ` · <em>✓ filed ${E(svRec(b.id).filed.name)}</em>` : ""}</span>
          <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.service('${b.id}')">✉ Open the ${E(svWords(serviceOf(b.id)).label)}</button></div>` : "")
        + (amendOf(b.id) ? (s => `<div class="cfx-call cfx-svb"><b>📝 Amendment Requests</b><span>${E(amendOf(b.id).kicker)}${s.sent ? ` · <em>${s.sent} of ${s.of} sent · ${s.filed} of ${s.copies} corrected copies filed</em>` : ""}</span>
          <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.amend('${b.id}')">📝 Open the Amendment Requests</button></div>`)(amSummary(b.id, amendOf(b.id), amRec(b.id))) : "")
        + (notesOf(b.id) ? `<div class="cfx-call cfx-svb"><b>📝 Notes &amp; Action Plan</b><span>${npParts(b.id).filter(p => p.done).length} of ${npParts(b.id).length} done</span>
          <button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.notes('${b.id}')">📝 Open</button></div>` : "");
      return `${plainBox(b)}<div class="cfx-task cfx-task1">
        <div class="cfx-task-bar">${window.CMSbTask ? CMSbTask.launch(b.id) : ""}${planGo(b, l.cf.day.n)}${more ? `<details class="cfx-more-tools"><summary>🧰 Other tools</summary><span class="cfx-tools-in">${more}</span></details>` : ""}${ofLine}</div>
        <ol class="cfx-points cfx-steps">${c.steps.map(x => `<li><span>${hl(x)}</span></li>`).join("")}</ol>
        ${acts ? `<div class="cfx-task-acts">${acts}</div>` : ""}
        <div class="cfx-task-foot">${docLine(b.id) ? `<details class="cfx-docs"><summary>📁 Source Files (${n} Document${n === 1 ? "" : "s"})</summary><div class="cfx-docs-pop">${docLine(b.id)}${window.cmDocFiling ? cmDocFiling.panel(b.id) : ""}</div></details>` : "<span></span>"}
          <button type="button" class="btn cfx-grade-go" onclick="cmCaseFlow.toView('${b.id}','check')" title="Hand in what you did: the AI Grader scores it and says what to improve">Submit to AI Grader →</button></div></div>`; }
    case "check":   // 🤖 the AI Grader (js/cm-ai-grader.js) in place of the old self-tick list, then the reference of the work
      return (window.CMAIGrader ? CMAIGrader.view(b.id) : `<p class="cf-note">The AI Grader is loading…</p>`) + workLog(b);
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
/* Backup File Maintenance is graded by the Worker (/api/drive), not on the slide: Day 1's is done once the hierarchy
   was graded as built and a drive check since then found every folder in place. Days 2–5 are each done once that
   day's auto-grade from the drive passes (driveDayPassed). Either way the normal completion still counts. */
const DRIVE_ACT = "d1m1-drive", DRIVE_LATER = new Set(["d2-drive", "d3-drive", "d4-drive", "d5-drive"]);
function driveDone(){
  const D = window.CMDrive && CMDrive.status && CMDrive.status();
  return !!(D && D.built && D.checkedAt && (!D.builtAt || D.checkedAt >= D.builtAt) && !(D.lastMissing || []).length);
}
/* Days 2–5 are auto-graded from the drive (driveGrade in worker.js): the day's grade passing finishes the activity. */
function driveDayPassed(id){
  const D = window.CMDrive && CMDrive.status && CMDrive.status(), g = D && D.grades && D.grades[String(id).charAt(1)];
  return !!(g && g.passed);
}
function actDone(id){
  const b = BLOCK[id]; if(!b) return false;
  if(id === DRIVE_ACT && driveDone()) return true;
  if(DRIVE_LATER.has(id) && driveDayPassed(id)) return true;
  return ((REC.reached || {})[id] || 0) >= viewsOf(b).length || ((REC.ticks || {})[id] || []).some(Boolean) || !!(REC.work || {})[id] || !!((REC.listen || {})[id] || {}).at || !!((REC.notes || {})[id] || {}).txAt || !!(REC.calls || {})[id];
}
const actOpened = id => !!(REC.reached || {})[id] || actDone(id);
/* each tool once per slide: a slide names its tools in the top row, in the Your Task "Where" box, beside a step,
   and the live call in its own box. Only the first of each stays, looked for in that order of
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
/* One title on a slide. The big title is the lesson's or activity's own numbered title (l.h: "2.3 Liability
   Investigation …"), the one the Agenda's picker, "Next up", the Roadmap and Presenter view give it (daySlideTitle).
   The band under it says what this slide is in plain words (The Theory, See It, Your Task …), with a small label
   for which of the two the trainee is in: a Lesson or the Practice Lab. The group a lesson sits in ("Claim Set Up",
   "Skill Building: Client Directions": l.cf.heading) is a section heading in the Agenda and the Roadmap, and is
   not shown on the slide. A long title is set a size smaller and wraps; it is never cut with an ellipsis. */
const WHAT = {lesson: "Lesson", activity: "Practice Lab", check: "Knowledge Check"};
const TITLE_LONG = 72;
function card(l, i, d, part){
  const {day, mod, block: b, k, phase} = l.cf, vs = viewsOf(b), p = Math.min(Math.max(part || 1, 1), vs.length), view = vs[p - 1];
  noteReached(b, p);
  const dots = vs.map((v, j) => `<span class="cfx-dot${j === p - 1 ? " on" : j < p - 1 ? " done" : ""}" title="${E(VIEW_LABEL[v])}"></span>`).join("");
  const logo = "";   // (the LSH logo is in the top bar; the slide doesn't repeat it)
  const onNavy = view === "case";   // a Skill Building opener sits on the slide itself, like the deck's
  return oneOfEachTool(`<div class="topic-separator cfx-sepline">CASE FLOW DAY ${day.n}${day.track ? ` &middot; ${E(day.track).toUpperCase()}` : ""} &middot; ${phase.lead === "Case Phase" ? `CASE PHASE ${phase.n} OF ${phase.of}` : phase.lead.toUpperCase()} &middot; ${KIND[b.kind].toUpperCase()} &middot; BLOCK ${k + 1} OF ${mod.blocks.length} &middot; ${VIEW_LABEL[view].toUpperCase()}</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-${view} cfx-${b.kind}" data-part="${p}">
      <div class="cfx-deck-head">${logo}<h2 class="cfx-deck-title${l.h.length > TITLE_LONG ? " cfx-t-long" : ""}" title="${E(l.h)}">${E(l.h)}</h2></div>
      <div class="cfx-ribbon cfx-what cfx-ribbon-ref"><span><i class="cfx-what-k">${E(WHAT[b.kind])}</i><b class="cfx-what-v">${E(VIEW_LABEL[view])}</b></span>${inAudience() ? "" : `<button type="button" class="cfx-ref-open" onclick="cmCaseFlow.full(${d.id},${i})" title="The full text of this block, over the slide">📖 Reference</button>`}</div>
      <div class="cfx-top"><span class="cfx-title cfx-pill"><span class="cfx-vi">${VIEW_ICON[view]}</span>${E(VIEW_LABEL[view])}</span>
        <span class="cfx-dots" aria-label="Slide ${p} of ${vs.length}">${dots}</span><span class="cfx-kicker">${phase.num || phase.n}.${k + 1} · ${E(KIND[b.kind])}</span><span class="cfx-top-rib" title="${E(titleCase(b.title))}">${E(titleCase(b.title))}</span>
        ${view === "task" && isTrainer() && !inAudience() && injectsOf(b).length ? `<button type="button" class="cfx-inject" onclick="cmCaseFlow.inject(${d.id},${i})" title="Trainer only: a real-time task to inject while the room works this one">⚡ Inject: ${E(injectsOf(b).map(x => x.short).join(" · "))}</button>` : ""}
        <button type="button" class="cfx-full" onclick="cmCaseFlow.full(${d.id},${i})">📖 Additional Reference</button></div>
      <div class="cfx-body${onNavy ? " cfx-body-navy" : ""}">${onNavy ? slideBody(view, l, d) : `<div class="cfx-sheet">${slideBody(view, l, d)}</div>`}</div>
    </div>`);
}
/* ⚡ Inject: where the trainer drops a real-time task into the room while the trainees are mid-task (trainer-only,
   never on the shared slides). Two kinds: the activity's live call (the trainer or a co-trainer plays the caller,
   taken from Your Task), and the simulation's fallout (build/case-flow/sim: a step an earlier activity skipped comes
   back here as an email, a call or a CMS alert, delivered to whoever missed it). Shown on the activity's Your Task
   slide, in Presenter view's notes and in the SOP's run of show. */
function injectsOf(b){
  if(!b || b.kind !== "activity") return [];
  const out = [], c = SIM.calls[b.id];
  if(c) out.push({kind: "call", short: `📞 ${c.who}`, html: `<b>📞 Live call: ${E(c.who)}</b> Once the room is working the task, play ${E(c.who)} (you or a co-trainer), from Your Task → <i>Take the call</i>. One trainee answers on the shared screen while the room listens; the rest keep working. Goals: ${E((c.goals || []).join("; "))}.`});
  (SIM.fallout || []).filter(f => f.then && f.then.activity === b.id).forEach(f => {
    const ev = f.then.event || {}, sb = (STORED[f.if.activity] || {}).block, ck = sb && sb.act && (sb.act.checkpoints || [])[f.if.check - 1];
    out.push({kind: "fallout", short: `⚡ ${ev.channel || "event"} from ${String(ev.from || "").replace(/\s*\(.*$/, "")}`,
      html: `<b>⚡ Fallout, for anyone who missed it:</b> who skipped <i>${E(ck || "check " + f.if.check)}</i> on ${E(titleCase(sb ? sb.title : f.if.activity))}, deliver this ${E(ev.channel || "event")} mid-task: <b>${E(ev.from || "")}</b>, “${E(ev.subject || "")}”. ${E(ev.body || "")}`});
  });
  return out;
}
window.cmCaseFlow.inject = function(dayId, i){
  const d = cfDay(dayId), l = d && d.lessons[i], xs = injectsOf(l && l.cf.block); if(!xs.length) return;
  const o = document.createElement("div"); o.className = "cfx-modal cfx-more cfx-inject-m"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Inject a real-time task");
  o.innerHTML = `<div class="cfx-modal-in card lesson-card"><div class="cfx-modal-h"><b>⚡ Inject a real-time task: trainer only</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <p class="cfx-more-lead">Inject it once the trainees are working this task, not before: the point is handling it mid-task, the way it lands on a real desk.</p><ul>${xs.map(x => `<li>${x.html}</li>`).join("")}</ul>${ringBtn(d.id, l.cf.block)}</div>`;
  const close = () => { o.remove(); document.removeEventListener("keydown", esc, true); };
  const esc = e => { if(e.key === "Escape"){ e.stopPropagation(); close(); } };
  o.addEventListener("click", e => { if(e.target === o || e.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o);
};
/* 📞 The injected call: the trainer rings every trainee's LSH Ring Channel from the ⚡ Inject (or the Presenter's cue).
   It's a shared record, call-inject-day<N> ({active, id, dayId, blockId, who, at}); each trainee's browser reads it in its
   once-a-minute check, on any page, and rings: 📞 Answer opens the graded call (cmCaseFlow.call), Decline or 60 seconds unanswered
   is a missed call. Either way it's logged on their file (REC.injects[id]) and counts on the Scorecard (📞 Case Calls). */
const RING_FOR = 10 * 60 * 1000, RING_SECS = 60;
function ringBtn(dayId, b){
  if(!b || !SIM.calls[b.id] || !isTrainer()) return "";
  return `<div class="cfx-ringrow"><button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.ring(${dayId},'${b.id}')">📞 Ring every trainee now: ${E(SIM.calls[b.id].who)}</button><small>Rings their LSH Ring Channel for ${RING_SECS} seconds; answered or missed, it's on their Scorecard.</small></div>`;
}
window.cmCaseFlow.ring = async function(dayId, blockId){
  const c = SIM.calls[blockId]; if(!c || typeof sharedSet !== "function") return;
  const now = new Date().toISOString();
  try{ await sharedSet("call-inject-day" + dayId, {active: true, id: now, at: now, dayId, blockId, who: c.who}); toast(`📞 Ringing every trainee on Day ${(cfDay(dayId) || {cf: {}}).cf.n || dayId}: ${c.who}.`); }
  catch(e){ toast("The call couldn't be sent. Check the connection and try again."); }
};
let ringing = null;
/* No request of its own: the ring is read in the trainee's once-a-minute check, in the same get-many as the random
   tasks (checkSurpriseTask in index.html), so it keeps that check's pace and is quiet while the tab is hidden. */
window.cmCaseFlow.ringKeys = () => MODULES.map(d => "call-inject-day" + d.id);   // every day: a trainer rings the whole room, wherever each trainee has got to
window.cmCaseFlow.onRing = async function(recs){
  if(ringing || !state.traineeId || state.isAdmin) return;
  await load();   // the calls already answered or missed are on the trainee's file
  const done = REC.injects || {};
  const live = (recs || []).filter(r => r && r.active && r.id && !done[r.id] && SIM.calls[r.blockId] && Date.now() - new Date(r.at).getTime() < RING_FOR)
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))[0];
  if(live) ring(live);
};
function logInject(r, outcome){
  REC.injects = REC.injects || {};
  REC.injects[r.id] = {blockId: r.blockId, dayId: r.dayId, who: r.who, at: r.at, outcome, [outcome + "At"]: new Date().toISOString()};
  persist();
}
function ring(r){
  if(document.getElementById("cfRing")) return;
  const o = document.createElement("div"); o.id = "cfRing"; o.className = "cf-ring"; o.setAttribute("role", "alertdialog"); o.setAttribute("aria-label", "Incoming call");
  let left = RING_SECS;
  o.innerHTML = `<div class="cf-ring-box"><div class="cf-ring-ic" aria-hidden="true">📞</div><p class="cf-ring-k">Incoming call · LSH Ring Channel</p><h3>${E(r.who)}</h3>
    <p class="cf-ring-on">On John Doe's file · <span class="cf-ring-t">${left}s</span></p>
    <div class="cf-ring-btns"><button type="button" class="btn cf-ring-no">Decline</button><button type="button" class="btn cf-ring-yes">📞 Answer</button></div>
    <small>Answered or missed, this call is logged on your file and your Scorecard.</small></div>`;
  ringing = r;
  const t = setInterval(() => { left--; const el = o.querySelector(".cf-ring-t"); if(el) el.textContent = left + "s"; if(left <= 0) end("missed"); }, 1000);
  function end(outcome){
    clearInterval(t); o.remove(); ringing = null; logInject(r, outcome);
    if(outcome === "answered") cmCaseFlow.call(r.blockId);
    else toast(`📞 Missed call from ${r.who}. It's logged on your file: call back from the day's Your Task slide.`);
  }
  o.querySelector(".cf-ring-yes").onclick = () => end("answered");
  o.querySelector(".cf-ring-no").onclick = () => end("missed");
  document.body.appendChild(o);
  try{ if(navigator.vibrate) navigator.vibrate([400, 200, 400]); }catch(e){}
}
if(!document.getElementById("cfx-deck-font")){
  const f = document.createElement("link"); f.id = "cfx-deck-font"; f.rel = "stylesheet";
  f.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap";
  document.head.appendChild(f);
}
window.cmCaseFlow = window.cmCaseFlow || {};
/* 📖 Additional Reference: the block's full text in a panel over the slide it was opened from, in the same window
   (✕, Esc or moving to another slide closes it). It scrolls inside; the slide's own size doesn't change. */
window.cmCaseFlow.full = function(dayId, i){
  const d = cfDay(dayId), l = d && d.lessons[i]; if(!l) return;
  window.cmCaseFlow.fullClose();
  const host = document.querySelector(".cf-card .cfx-body") || document.querySelector(".cf-card");
  const o = document.createElement("section"); o.className = "cfx-ref"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Additional Reference");
  o.innerHTML = `<div class="cfx-ref-h"><b>📖 Additional Reference <span>${E(titleCase(l.cf.block.title))}</span></b><button type="button" class="cfx-ref-x" onclick="cmCaseFlow.fullClose()" aria-label="Close the reference and go back to the slide">✕ Back to the slide</button></div>
    <div class="cfx-ref-b" tabindex="0">${strip()}${fullText(l, d)}</div>`;
  if(host){ host.classList.add("cfx-ref-host"); host.appendChild(o); }
  else { o.classList.add("cfx-ref-float"); document.body.appendChild(o); }   // no slide on screen (a link from elsewhere): over the page
  document.addEventListener("keydown", fullEsc, true);
  const b = o.querySelector(".cfx-ref-x"); if(b) b.focus();
};
window.cmCaseFlow.blockAt = (dayId, i) => { const d = cfDay(dayId), l = d && d.lessons[i]; return (l && l.cf && l.cf.block) || null; };   // the block a slide is of (js/cm-sb-task.js: the Rules & Naming Guide)
function fullEsc(e){ if(e.key === "Escape" && document.querySelector(".cfx-ref")){ e.stopPropagation(); window.cmCaseFlow.fullClose(); } }
window.cmCaseFlow.fullClose = function(){
  document.querySelectorAll(".cfx-ref").forEach(x => { const h = x.parentElement; x.remove(); if(h) h.classList.remove("cfx-ref-host"); });
  document.removeEventListener("keydown", fullEsc, true);
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
    // A day is two parts, in this order, whatever order the data lists its blocks in:
    //   the Training Agenda → ALL of the day's lessons, in teaching order (CF.sequence) → ONE 🧪 Practice Lab slide and
    //   ALL of the day's Skill Activities behind it, in the order their lessons were taught → 🎯 Ready for the
    //   Knowledge Check? (the last slide: its button opens the Knowledge Check).
    // Each block is one slide per view. The Learning Checks (questions, Self-Summary, Skill Scale) aren't slides:
    // they're on the day's Knowledge Check page. The base deck's own Practice Lab slide is dropped.
    const out = [], build = d.cf.build, acts = [], tail = [];
    let topics = false;
    s.forEach(sl => {
      if(sl.type === "practiceLab") return;
      if(sl.type !== "topic") return (topics ? tail : out).push(sl);   // the base deck's slides after its last topic follow the Practice Lab
      topics = true;
      const b = d.lessons[sl.lessonIndex].cf.block;
      if(sl.part !== 1 || b.kind === "check") return;
      if(b.kind === "activity"){ acts.push(sl.lessonIndex); return; }
      viewsOf(b).forEach((v, j) => out.push({type: "topic", lessonIndex: sl.lessonIndex, part: j + 1}));
    });
    const lab = extra => acts.forEach(li => viewsOf(d.lessons[li].cf.block).forEach((v, j) => out.push(Object.assign({type: "topic", lessonIndex: li, part: j + 1}, extra ? {extra: true} : {}))));
    if(build){
      // a build day (Day 5): 🏗 the build is the practical; then the optional extra practice (John Doe's activities,
      // untimed: ⏭ on its opening slide skips them to the Ready check)
      out.push({type: "companionBuild"}, {type: "companionBuild2"});   // the build's seven steps on two slides, so the type stays large on a laptop
      if(acts.length){ out.push({type: "extraPractice"}); lab(true); }
    }
    else if(acts.length){ out.push({type: "practiceLab"}); lab(false); }
    // the day's three key concepts: the last slide, after the last Skill Activity, right before the Knowledge Check
    if((acts.length || build) && labQuestions(d).length) out.push({type: "readyCheck"});
    tail.forEach(sl => out.push(sl));
    // the last day closes the case: a congratulations and a thank-you card, not in the deck: it opens only from
    // 🎓 Finish Training, once the Knowledge Check is passed
    if(isLastCfDay(d) && state.cfClosing === d.id) out.push({type: "closing"});
    return out;
  };
}
/* ---------- the 4-hour day, in two parts: ALL of the day's lessons (their sections, in teaching order), then ONE
   Practice Lab (every Skill Activity on John Doe's file, in the order its lesson was taught, a brainstorm after each
   Skill Building group); the Knowledge Check last, with 20 minutes kept for the welcome, a break and the close.
   Whatever is left is Q&A. ---------- */
// js/cm-case-flow-schedule.js holds the numbers and the arithmetic (build/case-flow/curriculum.cjs checks with the same)
function daySchedule(d){
  const items = d.lessons.filter(l => l.cf.block.kind !== "check").map(l => ({kind: l.cf.block.kind, brief: !!l.cf.block.brief, thorough: !!l.cf.block.thorough,
    id: l.cf.block.id, of: l.cf.of ? l.cf.of.cf.block.id : "",   // an activity's Skill Building group is the section of the lesson it practises
    slides: viewsOf(l.cf.block).length, heading: l.cf.heading, mod: l.cf.mod.id, modTitle: l.cf.mod.title, ref: l}));
  const sc = window.CM_CF_SCHEDULE.schedule(items, {build: d.cf.build, lessonMax: d.cf.lessonMax, main: (CF.sequence.find(s => s.n === d.cf.n) || {}).main, day: d.cf.n});   // main: the daily loop's one Skill Building (js/cm-day-loop.js)
  // each lesson's own minutes (a refresher's share of the 30%, a thorough lesson's larger one), by the lesson
  sc.minsOf = new Map(items.filter(x => x.kind === "lesson").map(x => [x.ref, x.mins]));
  sc.parts.concat(sc.labs).forEach(p => { p.topics = (p.topics || []).map(x => x.ref); p.acts = p.acts.map(x => x.ref); p.extra = p.extra.map(x => x.ref); });
  return sc;
}
function lectureParts(d){ return daySchedule(d).parts; }   // the lessons' parts: a run of lessons under one section heading
window.cmCaseFlow.schedule = daySchedule;   // js/cm-day-loop.js: the side exercises' minutes
/* "2.3 Liability Investigation": a lesson by its number and its title up to the first colon (the Practice Lab's list and
   an activity's first slide name the lesson an activity practises this way) */
// a title short enough for one line: up to its colon or dash, and a long one up to its first "&" or comma that leaves a name (the whole title is on the block's own slides)
const shortTitle = (t, max) => { t = titleCase(String(t || "").split(/:\s| — /)[0]); if(t.length <= max) return t;
  const cut = [...t.matchAll(/\s&\s|,\s/g)].map(m => t.slice(0, m.index)).find(x => x.length >= 12); return cut || t; };
const lessonRef = l => l ? `${l.h.split(" ")[0]} ${shortTitle(l.cf.block.title, 40)}` : "";
const practisesLine = l => l && l.cf.of ? `Practises: ${lessonRef(l.cf.of)}` : "";
/* beside the agenda: the one file the day works, and the stretch of it today covers (its activities' file dates) */
function agendaFile(d){
  const c = CF.case, dates = d.lessons.filter(l => l.cf.block.kind === "activity" && !l.cf.block.otherMatter && SIM.events[l.cf.block.id]).map(l => SIM.events[l.cf.block.id].date).sort((a, b) => dayMs(a) - dayMs(b));
  const tracks = [...new Set(d.lessons.filter(l => l.cf.block.kind === "activity").map(l => trackOf(l.cf.mod.id)).filter(Boolean))].sort();
  const rows = [["👤 Client", `${c.client.name} · ${c.client.position.toLowerCase()}`], ["⚖️ Lead counsel", c.counsel], ["📆 Date of loss · SOL", `${c.dol} · ${c.sol}`],
    ["🧱 Recovery stack", `${stackLayers().map(x => `${x.tag} ${money(x.limit)}`).join(" → ")} = ${money(c.total)}`]];
  return `<div class="cfx-ag-file"><p class="cfx-ag-file-h">📂 ${E(c.style)} <small>${E(c.no)}</small></p><dl>${rows.map(([k, v]) => `<div><dt>${k}</dt><dd>${E(v)}</dd></div>`).join("")}</dl></div>`;
}
// the day as segments, for the views that list it: every section of lessons, then the Practice Lab's Skill Building groups
function daySegments(d){
  const sc = daySchedule(d);
  return sc.parts.map(p => ({kind: "lesson", title: p.title, topics: p.topics, full: p.full, briefs: p.briefs, mins: p.lecture}))
    .concat(sc.labs.filter(p => p.acts.length || p.extra.length).map(p => ({kind: "practice", title: p.title, items: p.acts.length ? p.acts : p.extra, optional: !p.acts.length, mins: p.skill + p.brainstorm})));
}
function agendaSlide(d){
  const logo = "";
  const src = CF.days.find(x => x.n === d.cf.n) || {};
  const sc = daySchedule(d), parts = sc.parts;
  const row = (n, title, part) => `<li${part ? ` class="cfx-ag-part cfx-ag-${part}"` : ""}><span class="cfx-ag-n">${String(n).padStart(2, "0")}</span><div><b>${E(title)}</b></div></li>`;   // the title only: no "1 topic · 2 Skill Activities" line
  // the day's two parts, in order and plainly labelled: Lessons (every section of them), then the Practice Lab
  // (all of the day's Skill Activities; on a build day, the Full Application Practice); the Knowledge Check last
  const nActs = d.lessons.filter(l => l.cf.block.kind === "activity").length, nLessons = d.lessons.filter(l => l.cf.block.kind === "lesson").length;
  const label = (k, t) => `<li class="cfx-ag-label"><b>${k}</b><span>${E(t)}</span></li>`;
  // the trainers' deck pages a day shows after its lessons (js/cm-deck-pages.js Day 2, js/cm-day-decks.js Days 3-5) are lesson sections too, by their topic
  const dp = window.CM_DECK_PAGES, dd = (window.CM_DAY_DECKS || {})[d.cf.n], deckTopics = dp && dp.DAY === d.cf.n ? dp.DECK.map(g => g.topic) : dd ? dd.map(g => g.topic) : [], n1 = parts.length + deckTopics.length;
  // Part 2 is the daily loop (js/cm-day-loop.js): the Case Profile → the Skill Building → the Action Plan, then the Knowledge Check
  const loop = sc.loop && window.cmDayLoop ? window.cmDayLoop.agendaRows(d, sc) : null;
  const rows = label("Part 1 · 📘 Lessons", `${nLessons} lessons${deckTopics.length ? ` and ${deckTopics.length} deck topics` : ""}, all together`) + parts.map((p, i) => row(i + 1, p.title)).join("")
    + deckTopics.map((t, i) => row(parts.length + i + 1, t)).join("")
    + (loop ? label(loop.label, loop.side) + loop.rows.map((t, i) => row(n1 + i + 1, t, "lab")).join("") + row(n1 + loop.rows.length + 1, "Knowledge Check", "kc")
    : label(sc.build ? "Part 2 · 🏗 Full Application Practice" : "Part 2 · 🧪 Practice Lab", sc.build ? "then optional extra practice" : `all ${nActs} Skill Activities, in one place`)
    + (sc.build ? row(n1 + 1, "Build Your Companion Case", "lab") : row(n1 + 1, `Practice Lab: ${nActs} Skill Activities`, "lab"))
    + row(n1 + 2, "Knowledge Check", "kc"));
  return `<div class="card lesson-card cf-card cfx cfx-deck cfx-agenda">
      <div class="cfx-deck-head">${logo}<h2 class="cfx-deck-title">Training Agenda</h2></div>
      <div class="cfx-ribbon"><span>Case Management Training · Day ${d.cf.n}</span></div>
      <div class="cfx-body cfx-body-navy cfx-ag-body"><div class="cfx-ag"><div class="cfx-ag-side"><p class="cfx-ag-day">${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</p><p>${E(src.objective || "")}</p></div>
        <ol class="cfx-ag-list cfx-ag-two" style="--ag-rows:${Math.max(3, Math.ceil(n1 / 2) + 1)}">${rows}</ol>${agendaFile(d)}</div></div>
    </div>`;
}
/* ---------- the Training Agenda's speaker notes ----------
   What the trainer says over each day's agenda slide, in the voice of the slide scripts (build/case-flow/scripts/
   SCRIPTSPEC.md: first person to the room, John Doe's file, no lists). The welcome and the question are written for
   each day; the run of the day is read from the slide itself (its parts, minutes, activities and questions), so the
   notes and the slide can never disagree. Shown in Presenter view and in the Speaker Notes PDF. */
const AGENDA_NOTES = {
  1: {open: "Welcome, everyone, and thanks for being here on time. For the next five days you're the Case Manager on one file, John Doe VS Robert Smith, Atty. Elijah Thorne's case, and everything we do this week happens on that file. Right now it's a raw file: nothing is in the CMS yet, John Doe hasn't started treatment, and there's a damaged car on it that nobody has sorted out.",
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
  const n = d.cf.n, w = AGENDA_NOTES[n] || {}, sc = daySchedule(d), parts = lectureParts(d);
  const q = (d.quiz || []).length, next = cfDayByN(n + 1);
  const lectures = parts.map(p => `${p.title}, about ${p.lecture} minutes`);
  const say = [w.open || `Welcome, everyone. Let's pick John Doe's file up where we left it.`,
    `Here's how today runs, and it's all on the slide, in two parts. You've met all of this before, so it's a refresher. Part one is the lessons, all of them together, about ${sc.lessonMin} minutes: ${andList(lectures)}.`
      + (sc.acts ? " We'll take a ten-minute break when the lessons are done." : ""),
    sc.loop ? `Part two is the loop we run every day. First John Doe's Case Profile${n === 1 ? ", where you meet him" : ", to see what changed on his file"}, then ${sc.build ? `the big one: ${sc.build} minutes building your companion case, start to finish, the way you worked John Doe's file` : `today's one Skill Building${n === 1 ? ", his Intake: opening his file in the CMS" : ""}, about ${sc.act} minutes on his file, graded by the AI Grader, with ${sc.brainstorm} minutes after it to brainstorm what the file showed us`}. Then you ${n === 5 ? "close out" : "update"} your Action Plan, about ${sc.plan} minutes.${sc.sides ? ` After that there are ${sc.sides} short side exercises, optional${sc.side ? `, in about ${sc.side} minutes${sc.sidePick && sc.sidePick < sc.sides ? `: pick any ${sc.sidePick}` : ""}` : ""}: each one is an assumption and an entry to log in the CMS.` : ""}` : "",
    sc.loop ? "" : sc.build ? `Part two is the big one: ${sc.build} minutes building your companion case, start to finish, the way you worked John Doe's file.` : "",
    sc.acts && !sc.loop ? `Part two is the Practice Lab, all ${sc.acts} Skill Activities in one place, in the same order as the lessons: you do each one on John Doe's file, in the CMS and the tools, about ${sc.act} minutes an activity, and each one names the lesson it practises. After each group we take ${sc.brainstorm} minutes to brainstorm what the file just showed us.` : "",
    `We finish with the Knowledge Check, ${q} question${q === 1 ? "" : "s"} in about ${sc.kc} minutes, and you need 70% ${next || n < 5 ? `to open Day ${n + 1}` : "to finish the Case Flow"}.`,
    `By the end of today you'll ${firstAim(d)}.`].filter(Boolean).join("\n");
  return {say, ask: w.ask || "", run: say.split("\n").slice(1).join(" ")};   // run: the run of the day alone (the Speaker Notes print it under the day's own opening)
}

/* ---------- the live call: the course's own roleplay engine, on John Doe VS Robert Smith ---------- */
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
/* The player. speechSynthesis can't seek inside an utterance, so the message is spoken chunk by chunk (vmChunks: a
   sentence, a long one cut at its commas) on a timeline (vmPlan) whose total is the length the card has always shown
   (vmTotal). A place on the bar is a time; playing from it starts at the chunk that holds it, so ⏪ / ⏩ and a drag of
   the bar land on the start of a phrase. One state (VM) drives every player on the page (the Your Case card, the
   Listening Check, the Notes & Action Plan): each is a [data-vm] and vmPaint repaints them together.
   A play is counted when playback starts from a stopped state (never played, played to the end, or ↺ Start over);
   a pause and resume, a seek and ⏪ / ⏩ are the same play. Nothing runs while nothing plays: the frame loop, the
   hiss and every timer end with the playback, and a hidden tab pauses it. */
const VM = {ctx: null, hiss: null, osc: null, id: null, pos: 0, on: false, open: false, token: null, base: 0, cap: 0, at: 0, raf: 0, say: null, wait: null, seekT: 0, busy: false, plans: {}};
const vmWords = t => String(t || "").split(/\s+/).filter(Boolean).length;
const VM_SYS = 6;   // seconds for the system voice and the tone, around the caller
const vmTotal = e => Math.round(vmWords(e.spoken) / 2.3 + VM_SYS);
const vmClock = s => { s = Math.max(0, Math.floor(s + 1e-6)); return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`; };
const vmLength = e => vmClock(vmTotal(e));
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
// the caller's words in the pieces they are spoken in: each sentence, a long one (over 10 words) cut at its commas
function vmChunks(spoken){
  const out = [];
  String(spoken || "").split(/(?<=[.?!])(?<!\b(?:Mr|Mrs|Ms|Dr|Atty|St|Jr|Sr|No|vs)\.)\s+/).filter(Boolean).forEach(sent => {   // (a title's full stop ends no sentence)
    if(vmWords(sent) <= 10){ out.push(sent); return; }
    const parts = []; let cur = "";
    sent.split(/(?<=,)\s+/).forEach(piece => {
      if(cur && vmWords(cur) >= 4 && vmWords(cur) + vmWords(piece) > 10){ parts.push(cur); cur = piece; }
      else cur = cur ? cur + " " + piece : piece;
    });
    if(cur){ if(parts.length && vmWords(cur) < 3) parts[parts.length - 1] += " " + cur; else parts.push(cur); }
    parts.forEach(x => out.push(x));
  });
  return out;
}
// the timeline: the system voice, the tone, the caller chunk by chunk, "End of message"; every piece has its start (t) and length (d), in seconds
function vmPlan(blockId){
  if(VM.plans[blockId]) return VM.plans[blockId];
  const e = SIM.events[blockId]; if(!e || !e.spoken) return null;
  const total = vmTotal(e), when = vmWhen(e);
  const segs = [{kind: "system", text: `You have one new message. Received ${when}${/\.$/.test(when) ? "" : "."} From ${vmDigits(e.from)}.`, d: 4, gap: 0}, {kind: "tone", d: 1.2}];
  const chunks = vmChunks(e.spoken), w = chunks.map(c => vmWords(c) + (/\.\.\.$/.test(c) ? 1.2 : /,$/.test(c) ? 0.3 : 0.6));
  const sum = w.reduce((x, y) => x + y, 0) || 1, body = Math.max(1, total - VM_SYS);
  chunks.forEach((c, i) => segs.push({kind: "caller", text: c.replace(/\.\.\./g, ","), d: body * w[i] / sum, gap: /\.\.\.$/.test(c) ? 500 : /,$/.test(c) ? 140 : 260}));
  segs.push({kind: "system", text: "End of message.", d: 0.8, gap: 0});
  let t = 0; segs.forEach(s => { s.t = t; t += s.d; });
  return (VM.plans[blockId] = {segs, total});
}
const vmSegAt = (p, t) => { let i = 0; while(i + 1 < p.segs.length && p.segs[i + 1].t <= t + 1e-6) i++; return i; };
// where the message is: live while it plays (never past the end of the chunk being spoken), else the place kept
const vmNow = () => VM.on ? Math.min(VM.cap, VM.base + (performance.now() - VM.at) / 1000) : VM.pos;
const vmAt = blockId => VM.id === blockId ? vmNow() : 0;
function vmSync(t, cap){ VM.base = VM.pos = t; VM.cap = cap; VM.at = performance.now(); }
function vmTone(ctx, at, f, dur, gain){ const o = ctx.createOscillator(), g = ctx.createGain(); o.frequency.value = f; g.gain.value = gain; o.connect(g); g.connect(ctx.destination); o.start(ctx.currentTime + at); o.stop(ctx.currentTime + at + dur); return o; }
function vmHiss(on){
  try{
    if(on){
      if(VM.hiss) return;   // one hiss, however often a seek asks for it
      const Ctx = window.AudioContext || window.webkitAudioContext; if(!Ctx) return;
      const ctx = VM.ctx || (VM.ctx = new Ctx()), buf = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), ch = buf.getChannelData(0);
      for(let i = 0; i < ch.length; i++) ch[i] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(), bp = ctx.createBiquadFilter(), g = ctx.createGain();
      src.buffer = buf; src.loop = true; bp.type = "bandpass"; bp.frequency.value = 1800; bp.Q.value = 0.6; g.gain.value = 0.018;
      src.connect(bp); bp.connect(g); g.connect(ctx.destination); src.start(); VM.hiss = src;
    }else if(VM.hiss){ const h = VM.hiss; VM.hiss = null; h.stop(); }
  }catch(e){}
}
function vmSay(seg, token){
  return new Promise(res => {
    if(VM.token !== token) return res();
    const u = new SpeechSynthesisUtterance(seg.text), v = vmVoice(seg.kind);
    if(v) u.voice = v;
    u.rate = seg.kind === "caller" ? 0.92 : 1; u.pitch = seg.kind === "caller" ? 0.85 : 1.08; u.volume = 1;
    let done = false, guard = 0;
    const end = () => { if(done) return; done = true; clearTimeout(guard); if(VM.say === end){ VM.say = null; VM.u = null; } res(); };
    // the clock is set to the chunk's start when the engine starts it, and moved on at each word the engine reports
    u.onstart = () => { if(VM.token === token) vmSync(seg.t, seg.t + seg.d); };
    u.onboundary = ev => { if(VM.token !== token || !ev || !(ev.charIndex > 0)) return;
      const at = seg.t + seg.d * Math.min(1, ev.charIndex / Math.max(1, seg.text.length)); if(at > vmNow()){ VM.base = at; VM.at = performance.now(); } };
    u.onend = end; u.onerror = end;
    guard = setTimeout(end, Math.max(4000, vmWords(seg.text) * 650));   // never hang if a browser drops the event
    VM.say = end; VM.u = u;   // (held, so the engine's events still arrive)
    speechSynthesis.speak(u);
  });
}
const vmPause = ms => new Promise(res => { const w = VM.wait = {res, t: setTimeout(() => { if(VM.wait === w) VM.wait = null; res(); }, ms)}; });
// silence: what is being said, the tone and every pending timer
function vmQuiet(){
  if(VM.seekT){ clearTimeout(VM.seekT); VM.seekT = 0; }
  if(VM.wait){ const w = VM.wait; VM.wait = null; clearTimeout(w.t); w.res(); }
  if(VM.say){ const f = VM.say; VM.say = null; VM.u = null; f(); }
  if(VM.osc){ try{ VM.osc.stop(); }catch(e){} VM.osc = null; }
  try{ if(canSpeak()) speechSynthesis.cancel(); }catch(e){}
}
// stop speaking: keep = ⏸ (the place is kept, the play goes on), else back to the start (the next ▶ is a new play)
function vmHalt(keep){
  const id = VM.id, at = vmNow();
  VM.on = false; VM.token = null; vmQuiet(); vmHiss(false);
  if(VM.raf){ cancelAnimationFrame(VM.raf); VM.raf = 0; }
  VM.pos = keep ? at : 0; if(!keep) VM.open = false;
  if(id) vmPaint(id);
}
// speak from the chunk that holds the place, chunk after chunk, to the end of the message
async function vmRun(token){
  const p = vmPlan(VM.id); if(!p) return;
  for(let i = vmSegAt(p, VM.pos); i < p.segs.length && VM.token === token; i++){
    const s = p.segs[i];
    vmSync(s.t, s.t + s.d); vmHiss(s.kind === "caller"); vmTime(VM.id);
    if(s.kind === "tone"){ try{ if(VM.ctx) VM.osc = vmTone(VM.ctx, 0.15, 1000, 0.45, 0.08); }catch(er){} await vmPause(900); VM.osc = null; }
    else{ await vmSay(s, token); if(VM.token === token && s.gap) await vmPause(s.gap); }
  }
  if(VM.token === token) vmHalt(false);   // the end of the message
}
// playing: go quiet, move to t, and speak from there after a beat (so a drag of the bar doesn't stutter)
function vmGo(t){
  const token = VM.token = {id: VM.id};
  vmQuiet(); vmSync(t, t); vmPaint(VM.id);
  VM.seekT = setTimeout(() => { VM.seekT = 0; if(VM.token === token) vmRun(token); }, 160);
}
function vmFrame(){ VM.raf = 0; if(!VM.on) return; vmTime(VM.id); VM.raf = requestAnimationFrame(vmFrame); }
// the bar and the elapsed time of every player of this voicemail
function vmTime(blockId){
  const p = vmPlan(blockId); if(!p) return;
  const at = vmAt(blockId), label = vmClock(at), f = (Math.min(1, at / p.total)).toFixed(4);
  document.querySelectorAll(`[data-vm="${blockId}"]`).forEach(el => {
    el.querySelectorAll(".vmp-el").forEach(x => { if(x.textContent !== label) x.textContent = label; });
    el.querySelectorAll(".vmp-seek").forEach(x => { x.value = at.toFixed(1); x.style.setProperty("--f", f); if(x.dataset.at !== label){ x.dataset.at = label; x.setAttribute("aria-valuetext", `${label} of ${vmClock(p.total)}`); } });
  });
}
function vmPaint(blockId){
  const on = VM.on && VM.id === blockId, st = vmStatusNow(blockId);
  document.querySelectorAll(`[data-vm="${blockId}"]`).forEach(el => {
    el.querySelectorAll(".cfx-vm-play").forEach(b => { b.textContent = on ? "⏸️ Pause" : "▶ Play"; b.setAttribute("aria-pressed", on ? "true" : "false"); });
    el.querySelectorAll(".cfx-vm-st").forEach(x => { x.textContent = st; });
    el.classList.toggle("on", !!on);
  });
  vmTime(blockId);
}
function vmStatus(blockId){
  const r = vmRec(blockId), e = SIM.events[blockId];
  if(r.at) return `Listening Check ${r.score}/${(e.listen || []).length} · played ${r.plays}×`;
  return r.plays ? `Played ${r.plays}× · now check your notes` : "Not played yet";
}
// the line beside the player: playing, paused at a place, or where the trainee stands (vmStatus)
function vmStatusNow(blockId){
  if(VM.id !== blockId || !(VM.on || VM.open)) return vmStatus(blockId);
  const n = vmRec(blockId).plays || 0;
  return VM.on ? `🔊 Playing · played ${n}×` : `⏸️ Paused at ${vmClock(VM.pos)} · played ${n}×`;
}
/* the player itself: ▶ / ⏸, ⏪ 5s, ⏩ 5s, the bar (click, drag or arrow keys; a tick at each phrase), elapsed / total, ↺ Start over.
   It never shows a word of the message. */
function vmPlayer(blockId, cls){
  const p = vmPlan(blockId); if(!p) return "";
  const on = VM.on && VM.id === blockId, at = vmAt(blockId), tot = vmClock(p.total);
  return `<div class="vmp${cls ? " " + cls : ""}" role="group" aria-label="Voicemail player">
      <button type="button" class="vmp-play cfx-vm-play" onclick="cmCaseFlow.vmPlay('${blockId}')" aria-pressed="${on ? "true" : "false"}">${on ? "⏸️ Pause" : "▶ Play"}</button>
      <button type="button" class="vmp-b vmp-back" onclick="cmCaseFlow.vmSkip('${blockId}',-5)" title="Back 5 seconds" aria-label="Back 5 seconds">⏪ 5s</button>
      <button type="button" class="vmp-b vmp-fwd" onclick="cmCaseFlow.vmSkip('${blockId}',5)" title="Forward 5 seconds" aria-label="Forward 5 seconds">5s ⏩</button>
      <span class="vmp-track"><span class="vmp-ticks" aria-hidden="true">${p.segs.filter(s => s.kind === "caller").map(s => `<i style="left:${(100 * s.t / p.total).toFixed(2)}%"></i>`).join("")}</span>
        <input type="range" class="vmp-seek" min="0" max="${p.total}" step="0.1" value="${at.toFixed(1)}" style="--f:${(Math.min(1, at / p.total)).toFixed(4)}" aria-label="Place in the voicemail" aria-valuetext="${vmClock(at)} of ${tot}"
          oninput="cmCaseFlow.vmSeek('${blockId}',this.value)" onkeydown="cmCaseFlow.vmKey(event,'${blockId}')"></span>
      <span class="vmp-time"><b class="vmp-el">${vmClock(at)}</b> / <span class="vmp-tot">${tot}</span></span>
      <button type="button" class="vmp-b vmp-over" onclick="cmCaseFlow.vmOver('${blockId}')" title="Back to the beginning">↺ Start over</button>
    </div>`;
}
// ▶ Play / ⏸ Pause. From a stopped state it is a new play (counted on the record); from a pause it goes on from the place.
window.cmCaseFlow.vmPlay = async function(blockId){
  const e = SIM.events[blockId];
  if(!e || !e.spoken) return;
  if(VM.on && VM.id === blockId){ vmHalt(true); return; }
  if(VM.busy) return;
  if(VM.id && VM.id !== blockId) vmHalt(false);
  VM.busy = true; let ok = false; try{ ok = await vmVoicesReady(); }finally{ VM.busy = false; }
  if(!ok){ vmSetup(blockId); return; }
  if(document.hidden) return;
  if(VM.id !== blockId){ VM.id = blockId; VM.pos = 0; VM.open = false; }
  if(!VM.open){ VM.open = true; const r = vmRec(blockId); r.plays = (r.plays || 0) + 1; persist(); }
  const token = VM.token = {id: blockId}; VM.on = true; vmSync(VM.pos, VM.pos);
  vmPaint(blockId);
  if(!VM.raf) VM.raf = requestAnimationFrame(vmFrame);
  try{ speechSynthesis.cancel(); }catch(er){}
  const Ctx = window.AudioContext || window.webkitAudioContext;
  // (a browser that won't start the sound without a fresh tap leaves resume() waiting: the voice doesn't wait for it)
  try{ if(Ctx){ VM.ctx = VM.ctx || new Ctx(); if(VM.ctx.state === "suspended") await Promise.race([VM.ctx.resume(), vmPause(400)]); } }catch(er){}
  if(VM.token === token) vmRun(token);
};
// a place on the bar, in seconds: playing, it jumps there and keeps playing; paused or stopped, the place moves and it stays quiet
window.cmCaseFlow.vmSeek = function(blockId, t){
  const p = vmPlan(blockId); if(!p) return;
  t = Math.max(0, Math.min(p.total - 0.05, Number(t) || 0));
  if(VM.id !== blockId){ if(VM.id) vmHalt(false); VM.id = blockId; VM.pos = 0; VM.open = false; }
  if(VM.on) vmGo(t); else{ VM.pos = t; vmPaint(blockId); }
};
// ⏪ / ⏩: playing, to the phrase that many seconds away (always a different one); paused, the place moves by that much
window.cmCaseFlow.vmSkip = function(blockId, d){
  const p = vmPlan(blockId); if(!p) return;
  if(!(VM.on && VM.id === blockId)) return cmCaseFlow.vmSeek(blockId, vmAt(blockId) + d);
  const now = vmNow(), cur = vmSegAt(p, now); let i = vmSegAt(p, Math.max(0, Math.min(p.total - 0.05, now + d)));
  if(d > 0 && i <= cur) i = Math.min(p.segs.length - 1, cur + 1);
  if(d < 0 && i >= cur) i = Math.max(0, cur - 1);
  vmGo(p.segs[i].t);
};
// ↺ Start over: back to 0:00 and stopped; if it was playing it plays again from the top, a new play
window.cmCaseFlow.vmOver = function(blockId){
  const was = VM.on && VM.id === blockId;
  if(VM.id === blockId) vmHalt(false);
  if(was) cmCaseFlow.vmPlay(blockId);
};
// the bar from the keyboard: ← / → are ⏪ / ⏩, Home is the start (and the deck doesn't turn the slide)
window.cmCaseFlow.vmKey = function(ev, blockId){
  const d = {ArrowLeft: -5, ArrowDown: -5, ArrowRight: 5, ArrowUp: 5}[ev.key];
  if(!d && ev.key !== "Home") return;
  ev.preventDefault(); ev.stopPropagation();
  if(d) cmCaseFlow.vmSkip(blockId, d); else cmCaseFlow.vmSeek(blockId, 0);
};
// a tab nobody is looking at doesn't talk: it pauses, and the place is kept
document.addEventListener("visibilitychange", () => { if(document.hidden && VM.on) vmHalt(true); });
window.addEventListener("pagehide", () => { if(VM.on) vmHalt(true); });
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
/* the voicemail on the activity's Your Case slide: who it is from and when, the player, the play count, and the way
   to the work on it (the Notes & Action Plan, or the Listening Check). Only what a phone shows: never the words. */
function voicemailCard(e, blockId, extra){
  const np = notesOf(blockId), on = VM.on && VM.id === blockId;
  return `<div class="cfx-ev cfx-ev-voicemail cfx-vm${extra ? " " + extra : ""}${on ? " on" : ""}" data-vm="${blockId}">
      <div class="vmc-h"><span class="vmc-ch">📳 Voicemail</span><b class="vmc-from">${E(e.from || "")}</b>
        <span class="vmc-when">${E(e.date || "")}${e.time ? " · " + E(e.time) : ""}</span></div>
      <span class="cfx-vm-wave" aria-hidden="true">${"<i></i>".repeat(56)}</span>
      ${vmPlayer(blockId)}
      <div class="vmc-f"><span class="cfx-vm-st">${E(vmStatusNow(blockId))}</span>
        <span class="vmc-hint">${np ? "Listen, then take it down word for word in your Notes &amp; Action Plan." : "Listen first: the transcript opens after your Listening Check."}</span>
        ${np ? `<button type="button" class="btn btn-navy vmc-go" onclick="cmCaseFlow.notes('${blockId}')">📝 Transcribe</button>` : `<button type="button" class="btn btn-navy vmc-go" onclick="cmCaseFlow.listen('${blockId}')">🎧 Listening Check</button>`}</div>
    </div>`;
}
/* the Listening Check: notes from the message, checked against what was said, then the transcript */
window.cmCaseFlow.listen = function(blockId, reveal){
  const e = SIM.events[blockId]; if(!e || !e.listen) return;
  const r = vmRec(blockId), checked = !!r.at, show = checked || (reveal && isTrainer());
  let box = document.getElementById("cf-vm");
  if(!box){ box = document.createElement("div"); box.id = "cf-vm"; box.setAttribute("role", "dialog"); box.setAttribute("aria-modal", "true"); box.setAttribute("aria-label", "Listening Check"); document.body.appendChild(box);
    document.addEventListener("keydown", ev => { if(ev.key === "Escape" && !box.hidden) cmCaseFlow.listenClose(); }); }
  box.innerHTML = `<div class="cf-vm-card${VM.on && VM.id === blockId ? " on" : ""}" data-vm="${blockId}">
      <div class="cf-vm-h"><div><b>🎧 Listening Check</b><span>Voicemail from ${E(e.from)} · ${E(e.date)}${e.time ? " · " + E(e.time) : ""}</span></div>
        <button type="button" class="cf-vm-x" onclick="cmCaseFlow.listenClose()" aria-label="Close">✕</button></div>
      ${vmPlayer(blockId, "vmp-2")}
      <div class="cfx-vm-row"><span class="cfx-vm-st">${E(vmStatusNow(blockId))}</span></div>
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
/* The simulation's disclaimer. Lien amounts, insurer and provider replies and recovery records arrive here in minutes
   so the work can be practised in a session; on a real file they take weeks. Shown wherever a simulated party answers:
   the audit slide and workbench, the Service Confirmation and the live call. */
const SIM_NOTE = "Training simulation: lien amounts, insurer and provider responses and recovery records are generated in real time, strictly for accelerated training. On a real file they take weeks of administrative back-and-forth.";
const simNote = () => `<p class="cfx-simnote" role="note"><b>⏱ Real-time results</b> ${E(SIM_NOTE)}</p>`;
/* The Service Confirmation's own words are the demand's (d3m1-a1); an exchange with another party (a lienholder, an
   employer) names its own in the email's `labels` (build/case-flow/exhibits/EXHIBITSPEC.md). */
const svLabels = e => Object.assign({write: "The email that serves the demand", reply: "The adjuster's written acknowledgment",
  send: "Send it to the adjuster", who: "Dana Whitfield", sentTime: "4:21 p.m.", sentToast: "Sent. Her acknowledgment is in the thread.",
  warn: "Audit the set before you serve it: nothing goes out that has not been audited.",
  why: "A thread in a mailbox is not on the case file: a colleague covering the file cannot find it, and it is not in the backup. Converted, filed and backed up, the carrier's own confirmation of the date that started the clock is part of the case.",
  folderNote: "every demand and negotiation document on the case", rightToast: "Right: recorded, routed, and the date stays on the docket.", aria: "Your email serving the demand", original: "Demand-Service-Acknowledgment.pdf"}, (e && e.labels) || {});
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
      <span class="cfx-aud-due">⏰ Out the door by <b>${E(a.due)}</b></span></div>
    <p class="cfx-aud-intro">${hl(a.intro)}</p>${simNote()}`;
  const called = exMarked(r), pct = n ? Math.round(called / n * 100) : 0;
  if(!done) return `<div class="cfx-aud">${head}
    <div class="cfx-aud-row cfx-aud-row3">
      <div class="cfx-aud-card cfx-aud-set">${src ? `<a class="cfx-aud-thumb" href="${E(docUrl(src))}" target="_blank" rel="noopener" onclick="return cmCaseFlow.doc(event,'${src.id}')"><img src="/decks/cf-docs/${src.id}.webp" alt="" loading="lazy"></a>` : ""}
        <div><b>The set you are auditing</b><span>${src ? exDocLink(a.source) : E(a.source)}</span><small><span class="cfx-aud-n">${n}</span> items to call, one by one</small></div></div>
      <div class="cfx-aud-card cfx-aud-where"><b>Where you are</b><span class="cfx-aud-prog">${called} of ${n} called</span>
        <div class="cfx-aud-bar" role="progressbar" aria-valuemin="0" aria-valuemax="${n}" aria-valuenow="${called}"><i style="width:${pct}%"></i></div>
        <small>Nothing is scored until you hand it in, and nothing is corrected quietly: every finding is a dated, assigned task.</small></div>
      <div class="cfx-aud-card cfx-aud-calls"><b>Your five calls</b><div class="cfx-aud-vs">${VORDER.map(v => `<span class="cfx-aud-v v-${v}" title="${E(VERDICT[v].hint)}"><i>${VERDICT[v].icon}</i>${E(VERDICT[v].label)}</span>`).join("")}</div></div>
    </div>
    <div class="cfx-aud-act"><button type="button" class="btn btn-orange cfx-aud-go" onclick="cmCaseFlow.audit('${b.id}')">🔍 Open the audit workbench</button>
      ${sv ? `<button type="button" class="btn btn-navy" onclick="cmCaseFlow.service('${b.id}')">✉ ${E(svWords(sv).label)}</button>` : ""}
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
      ${sv ? `<button type="button" class="btn btn-navy" onclick="cmCaseFlow.service('${b.id}')">✉ ${E(svWords(sv).label)}</button>` : ""}</div></div>`;
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
      ${done ? `<span class="ab-sc">${exScore(a, r)} of ${n} correct</span>` : `<span class="ab-sc" id="absc_${E(blockId)}">${exMarked(r)} of ${n} called</span>`}</div>${simNote()}
    <div class="ab-key">${VORDER.map(v => `<span><b>${VERDICT[v].icon} ${E(VERDICT[v].label)}</b> ${E(VERDICT[v].hint)}</span>`).join("")}</div>
    <table class="ab-table"><thead><tr><th>${E(a.columns.ref)}</th><th>What it is${done ? "" : " · as drafted"}</th><th>Your call${done ? " · the file's" : ""}</th><th>${done ? "What it would have cost, and the fix" : "Your note"}</th></tr></thead><tbody>${rows}</tbody></table>
    ${done ? `<div class="ab-rev"><b>📦 ${E(a.revealNote)}</b><ul>${a.revealPoints.map(p => `<li>${hl(p)}</li>`).join("")}</ul>
        <p>The completed set: ${exDoc(a.reveal) ? exDocLink(a.reveal) : E(a.reveal)}</p></div>`
      : `<div class="ab-foot"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.auditHandIn('${blockId}')">Hand in the audit</button>
        <span>Call every item first. Once it is handed in you see what the file says about each one, and the completed package.</span></div>`}</div>`;
}
/* ---------- every pop-up moves: drag it by its title bar ----------
   The Additional Reference, the exhibit audits and the Service Confirmation open over the slide. Dragged aside, the dimming lifts
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
/* The words around an exchange are the demand's by default; an exchange that isn't serving a demand (the no-contact
   notice to an adjuster, routing a release to Atty. Thorne) names its own in the exhibits: label, write, send, reply. */
const svWords = (e) => Object.assign({label: "Service Confirmation"}, svLabels(e), e.words || {});   // the panel name, beside the workspace's own labels
const folderLabel = (id) => { const f = (window.CM_CF_DOC_FOLDERS || []).find(x => x.id === id); return f ? f.label : String(id || "its folder"); };
const svNameFor = (e) => {
  const id = (window.CMCase && CMCase.id()) || "<Case ID>";
  return `${id}_Doe-John_${String(e.convert.type).replace(/\s+/g, "-")}_${(e.reply.date || "").split("/").reverse().join("-").replace(/^(\d{4})-(\d{2})-(\d{2})$/, "$1-$3-$2")}.pdf`;
};
function svStep(n, label, state, body){
  return `<div class="sv-step sv-${state}"><div class="sv-h"><span class="sv-n">${state === "done" ? "✓" : n}</span><b>${E(label)}</b></div>${body ? `<div class="sv-b">${body}</div>` : ""}</div>`;
}
function svWorkspace(blockId){
  const e = serviceOf(blockId), r = svRec(blockId), a = auditOf(blockId), L = svLabels(e);
  const sent = !!r.sent, chose = r.choice != null, right = chose && !!(e.press.choices[r.choice] || {}).ok;
  const conv = !!r.converted, filed = !!r.filed, drive = !!r.drive;
  const compose = sent
    ? `<div class="sv-sentmail"><div class="sv-eh"><b>To</b> ${E(e.to)}<br><b>Cc</b> ${E(e.cc || "—")}<br><b>Subject</b> ${E(e.subject)}<br><b>Sent</b> ${E(e.sent)}, ${E(L.sentTime)}<br><b>Attachment</b> ${E(e.attachment)}</div><pre class="sv-body">${E(r.body)}</pre></div>`
    : `<p class="sv-brief">${hl(e.brief)}</p>
      <div class="sv-eh"><b>To</b> ${E(e.to)}<br><b>Cc</b> ${E(e.cc || "—")}<br><b>Subject</b> ${E(e.subject)}<br><b>Attachment</b> ${E(e.attachment)}</div>
      <textarea class="sv-write" id="svw_${E(blockId)}" rows="9" placeholder="Write the email as you would send it." aria-label="${E(L.aria)}">${E(r.body || "")}</textarea>
      <ul class="sv-req">${e.required.map(q => `<li>${E(q.label)}</li>`).join("")}</ul>
      <div class="sv-row"><button type="button" class="btn btn-orange" onclick="cmCaseFlow.svSend('${blockId}')">${E(L.send)}</button>
        <span class="sv-msg" id="svm_${E(blockId)}" aria-live="polite">${r.tries ? `Not sent yet — ${r.tries} attempt${r.tries === 1 ? "" : "s"}.` : ""}</span></div>`;
  const reply = sent ? `<div class="sv-eh"><b>From</b> ${E(e.reply.from)}<br><b>Sent</b> ${E(e.reply.date)}, ${E(e.reply.time)}<br><b>Subject</b> ${E(e.reply.subject)}</div><pre class="sv-body">${E(e.reply.body)}</pre>
      <ul class="sv-est">${e.convert.establishes.map(x => `<li>${hl(x)}</li>`).join("")}</ul>` : "";
  const press = sent ? `<div class="sv-eh"><b>From</b> ${E(e.press.from)}<br><b>Sent</b> ${E(e.press.date)}<br><b>Subject</b> ${E(e.press.subject)}</div><pre class="sv-body">${E(e.press.body)}</pre>
      <div class="sv-choices">${e.press.choices.map((c, i) => `<label class="sv-ch${chose ? (c.ok ? " ok" : (r.choice === i ? " no" : "")) : ""}">
          <input type="radio" name="svch_${E(blockId)}" ${r.choice === i ? "checked" : ""} ${chose ? "disabled" : ""} onchange="cmCaseFlow.svChoose('${blockId}',${i})">
          <span>${E(c.label)}${chose ? `<br><small>${c.ok ? "✓ " : "✕ "}${E(c.why)}</small>` : ""}</span></label>`).join("")}</div>` : "";
  const convert = `<p class="sv-note">${E(L.why)}</p>
    <ul class="sv-sec">${e.convert.sections.map(s => `<li><b>${E(s.h)}</b>${s.lines.length ? `<br>${s.lines.map(E).join("<br>")}` : ""}</li>`).join("")}</ul>
    <div class="sv-row"><button type="button" class="btn btn-navy" ${right ? "" : "disabled"} onclick="cmCaseFlow.svConvert('${blockId}')">📄 ${conv ? "Build it again" : "Convert the thread into a document"}</button>
      ${conv ? `<span class="sv-ok">✓ ${E(r.converted.pages)} page${r.converted.pages === 1 ? "" : "s"} built${r.converted.saved ? " and downloaded" : ""}</span>` : `<span class="sv-msg">${right ? "" : "Answer the follow-up correctly first."}</span>`}</div>`;
  const file = `<div class="sv-eh"><b>Category</b> ${E(e.convert.category)} &nbsp;<b>Name it</b> <code>&lt;Case ID&gt;_&lt;Last-First&gt;_&lt;Type&gt;_&lt;YYYY-MM-DD&gt;.pdf</code></div>
    ${filed ? `<span class="sv-ok">✓ Filed in the CMS as <b>${E(r.filed.name)}</b> under ${E(r.filed.category)}</span>${r.drive ? `<br><span class="sv-ok">✓ Kept on your Backup Drive under <b>${E(String(r.drive.folder).split("/").pop())}</b></span>` : ""}`
      : `<div class="sv-row"><input class="sv-name" id="svn_${E(blockId)}" placeholder="${E(svNameFor(e))}" aria-label="File name for the memorandum" value="${E(r.nameTried || "")}">
        <button type="button" class="btn btn-navy" ${conv ? "" : "disabled"} onclick="cmCaseFlow.svFile('${blockId}')">📤 File it in the CMS</button>
        <span class="sv-msg" id="svf_${E(blockId)}" aria-live="polite">${(r.problems || []).length ? r.problems.map(E).join(" · ") : (conv ? "" : "Build the document first.")}</span></div>`}`;
  const back = `<p class="sv-note">The firm keeps a Backup Drive as well as a CMS, and a document you wrote belongs in it like any other: a colleague covering this file looks for it under <b>${E(folderLabel(e.convert.folder))}</b>, where ${E(L.folderNote)} is kept. The CMS is the file of record, so a drive that isn't built yet never undoes the filing &mdash; it just leaves you one copy.</p>
    ${drive ? `<span class="sv-ok">✓ Kept on your Backup Drive under <b>${E(String(r.drive.folder).split("/").pop())}</b>, with the filing</span>`
      : `<div class="sv-row">${filed ? `<button type="button" class="btn btn-navy" onclick="cmCaseFlow.svDrive('${blockId}')">📂 Keep it on my Backup Drive</button>` : ""}
        <span class="sv-msg" id="svd_${E(blockId)}" aria-live="polite">${!filed ? "File it in the CMS first: the copy is kept with the filing."
          : r.driveWhy === "no-folder" ? "That folder isn't in your Backup Drive. Put the missing folders back from the dashboard, then try again."
          : "Your Backup Drive isn't built yet, so no copy was kept. Build it from the card on your dashboard, then keep this document on it."}</span></div>`}`;
  const model = `<p class="sv-note">The firm's own memorandum for this service, for you to read yours against: ${exDoc(e.model) ? exDocLink(e.model) : E(e.model)}.</p>`;
  return `<div class="cfx-modal-in card lesson-card cfx-sv"><div class="cfx-modal-h"><b>✉ ${E(e.title)}</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <div class="sv-top"><span>${E(e.kicker)}</span>${a && L.warn && !exRec(blockId).at ? `<span class="sv-warn">${E(L.warn)}</span>` : ""}</div>${simNote()}
    ${svStep(1, L.write, sent ? "done" : "now", compose)}
    ${svStep(2, L.reply, sent ? "done" : "wait", reply)}
    ${svStep(3, "The follow-up that tests the line", chose ? (right ? "done" : "no") : (sent ? "now" : "wait"), press)}
    ${svStep(4, "Convert the exchange into a document", conv ? "done" : (right ? "now" : "wait"), convert)}
    ${svStep(5, "File it in the CMS", filed ? "done" : (conv ? "now" : "wait"), file)}
    ${svStep(6, "Kept on your Backup Drive", drive ? "done" : (filed ? "now" : "wait"), back)}
    ${svStep(7, "Read yours against the firm's", "note", model)}</div>`;
}
window.cmCaseFlow.service = function(blockId){
  if(!serviceOf(blockId) || document.getElementById("cf-sv")) return;   // one workspace at a time, or the email being written is lost behind it
  const o = document.createElement("div"); o.className = "cfx-modal"; o.id = "cf-sv"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", svWords(serviceOf(blockId)).label);
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
    if(msg) msg.innerHTML = `<b>Not sent.</b> ${E(svLabels(e).who)} can answer this without giving you what you need:<ul>${missing.map(q => `<li>${E(q.label)} — ${E(q.hint)}</li>`).join("")}</ul>`;
    return;
  }
  r.sent = new Date().toISOString(); persist();
  if(typeof toast === "function") toast(svLabels(e).sentToast);
  svRepaint(blockId);
};
window.cmCaseFlow.svChoose = function(blockId, i){
  const e = serviceOf(blockId), r = svRec(blockId); if(!e || r.choice != null) return;
  r.choice = i; persist();
  const c = e.press.choices[i] || {};
  if(typeof toast === "function") toast(c.ok ? svLabels(e).rightToast : "That one costs the file. Read why, and remember whose call it was.");
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
    doc.text(`LSH CASE MANAGEMENT TRAINING — SIMULATED DOCUMENT — FICTIONAL PARTIES · John Doe VS Robert Smith · page ${page}`, W / 2, H - 24, {align: "center"}); };
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
    if(/email that served|confirmation email|email as sent/i.test(s.h)){
      para(`To: ${e.to}`, {size: 9}); para(`Cc: ${e.cc || "—"}`, {size: 9}); para(`Subject: ${e.subject}`, {size: 9});
      para(`Sent: ${e.sent}, ${svLabels(e).sentTime} · Attachment: ${e.attachment}`, {size: 9, color: soft});
      String(r.body).split(/\n{2,}/).forEach(p => para(p.replace(/\s*\n\s*/g, " "), {pad: 12}));
    }
    if(/adjuster's acknowledg|reply as received/i.test(s.h)){
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
    original: svLabels(e).original,
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
   the provider's answer and, with it, the corrected copy (RS72, RS73). The copy opens to the trainee only once their
   trainer unlocks it (Admin → Trainee Audit → View Detail; kept on the trainee record as unlockedCopies) — then
   on the Documents page and in every later activity that works from it — and which they file in the CMS the
   firm's way. Every request ends in written feedback on their work, and their trainer sees all of it. */
const amendOf = id => (EX.amendments || {})[id] || null;
function amRec(blockId){ REC.amend = REC.amend || {}; return (REC.amend[blockId] = REC.amend[blockId] || {marks: {}, screened: null, req: {}}); }
function amReq(blockId, docId){ const r = amRec(blockId); return (r.req[docId] = r.req[docId] || {body: "", tries: 0, log: [], sent: null, choice: null}); }
/* A corrected copy opens only once the trainer unlocks it for this trainee; every other document is as it was. */
function docAvail(d){
  if(!d || !d.unlock || isTrainer()) return true;
  const open = (typeof state !== "undefined" && Array.isArray(state.adminUnlockedCopies)) ? state.adminUnlockedCopies : [];
  return open.includes(d.id);
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
  const copy = q.corrected ? exDoc(q.corrected) : null, filedRec = copy ? amFiled(copy.id) : {}, copyOpen = !!copy && docAvail(copy);
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
      ${copy ? (copyOpen ? `<p class="sv-ok">📄 Your trainer unlocked the corrected copy. It is in your case documents: ${exDocLink(copy.id)}. It opens beside the original in every activity that works from it.</p>` : `<p class="sv-note">🔒 The corrected copy opens once your trainer unlocks it for you. Ask your trainer when you are ready.</p>`) : ""}` : "";
  const after = !sent ? "" : copy
    ? !copyOpen ? `<p class="sv-note">You file the corrected copy in the CMS once your trainer unlocks it.</p>` : `<p class="sv-note">A corrected copy in your inbox is not on the case file. File it in the CMS beside the original, named the firm's way; the filing keeps it on your Backup Drive too.</p>
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
  if(typeof toast === "function") toast(q.corrected ? `Sent. ${who} answered. The corrected copy opens once your trainer unlocks it.` : `Sent. ${who} answered: read it, then decide what you do next.`);
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
  const sc = r.txAt ? ` · transcript ${npTxScore(n, r)}% (${r.txGot.filter(Boolean).length}/${n.transcribe.facts.length} facts)` : (r.txTries || []).length ? ` · transcript attempt ${r.txTries.length}: ${r.txTries[r.txTries.length - 1].score}%` : "", pl = r.planAt ? ` · plan ${r.planGot.filter(Boolean).length}/${n.plan.required.length}` : "";
  // the card itself opens the workspace (Your Task's steps open it too): no separate "Open Notes & Action Plan" button
  return `<div class="cfx-np" role="button" tabindex="0" title="Open the Notes &amp; Action Plan" onclick="cmCaseFlow.notes('${blockId}')" onkeydown="if(event.key==='Enter'||event.key===' '){event.preventDefault();cmCaseFlow.notes('${blockId}')}"><b>📝 Notes &amp; Action Plan</b><span class="cfx-np-k">${E(n.kicker)}</span>
    <ol>${parts.map(p => `<li class="${p.done ? "ok" : ""}">${p.done ? "✓" : "○"} ${E(p.label)}</li>`).join("")}</ol>
    <div class="cfx-np-r"><small>${parts.filter(p => p.done).length} of ${parts.length} done${sc}${pl}</small></div></div>`;
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
  const n = notesOf(blockId), r = npRec(blockId), ev = SIM.events[blockId] || {};
  const txDone = !!r.txAt, planDone = !!r.planAt, t = n.transcribe, p = n.plan;
  const tries = r.txTries || [], last = tries[tries.length - 1];
  const triesHtml = tries.length ? `<ol class="np-tries">${tries.map((a, i) => `<li><b>Attempt ${i + 1}: ${E(a.score)}%</b> · ${E(a.facts)} of ${E(a.of)} facts · ${E(a.acc)}% word accuracy${a.final ? " · <em>handed in</em>" : ""}</li>`).join("")}</ol>` : "";
  const tx = txDone
    ? `<pre class="sv-body">${E(r.tx)}</pre>
      <div class="np-grade"><b>🎙 Transcript grade: ${E(npTxScore(n, r))}%</b><span>${E(TX_HOW)}</span>${triesHtml}</div>
      <div class="np-key"><b>Answer key: what was said</b><p>${E(ev.spoken || "")}</p>
        <ul>${t.facts.map((f, i) => `<li class="${r.txGot[i] ? "ok" : "miss"}">${r.txGot[i] ? "✓ Caught" : "✗ Missed"} · ${E(f.label)}</li>`).join("")}</ul></div>`
    : `<p class="sv-brief">${hl(t.brief)}</p>
      ${last ? `<div class="np-grade"><b>🎙 Attempt ${tries.length} of ${TX_TRIES}: ${E(last.score)}%</b><span>${E(last.facts)} of ${E(last.of)} facts caught · ${E(last.acc)}% word accuracy against the message. Play it again and improve it, or hand it in: the answer key opens when you do${tries.length >= TX_TRIES - 1 ? " (your next check is handed in)" : ""}.</span>${triesHtml}
        <div class="sv-row"><button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.npTxHand('${blockId}')">📤 Hand in attempt ${tries.length} (${E(last.score)}%)</button></div></div>` : ""}
      <div class="np-vm${VM.on && VM.id === blockId ? " on" : ""}" data-vm="${blockId}"><div class="np-vm-h"><b>📳 ${E(ev.from || "")}</b><span>${E(ev.date || "")}${ev.time ? " · " + E(ev.time) : ""}</span><span class="cfx-vm-st">${E(vmStatusNow(blockId))}</span></div>
        ${vmPlayer(blockId, "vmp-2")}
        <p class="np-vm-tip">⏪ 5s takes you back a phrase; drag the bar or click it to hear one part again.</p></div>
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
/* 🎙 The transcript is graded, every attempt: the facts it had to catch (the answer key, 60%) and its word accuracy
   against what was said (the voicemail's own words, 40%: the words in common, in order, over the two lengths, so a
   word left out and a word made up both cost). Up to TX_TRIES checks; a check at 90% or more, the last one, or
   📤 Hand in hands it in, and only then the answer key opens. Each attempt is kept (r.txTries); the one handed in
   is the transcript's grade (r.txScore), the scorecard's 🎙 Transcription and the 100-point model's Documentation. */
const TX_TRIES = 3, TX_PASS = 90;
const TX_HOW = "Graded on the facts it had to catch (60%) and its word accuracy against what was said (40%).";
const TX_FILL = new Set(["uh", "um", "er", "ah", "hmm", "erm", "like"]);
const TX_NUM = {zero: "0", oh: "0", o: "0", one: "1", two: "2", three: "3", four: "4", five: "5", six: "6", seven: "7", eight: "8", nine: "9"};
function txWords(t){
  const out = [];
  String(t || "").toLowerCase().replace(/[’']/g, "").split(/[^a-z0-9]+/).filter(Boolean).forEach(w => {
    if(TX_FILL.has(w)) return;
    if(/^\d+$/.test(w)) w.split("").forEach(d => out.push(d)); else out.push(TX_NUM[w] || w);
  });
  return out;
}
function txAccuracy(said, typed){
  const a = txWords(said), b = txWords(typed); if(!a.length || !b.length) return 0;
  let prev = new Array(b.length + 1).fill(0);
  for(let i = 1; i <= a.length; i++){ const cur = [0]; for(let j = 1; j <= b.length; j++) cur[j] = a[i - 1] === b[j - 1] ? prev[j - 1] + 1 : Math.max(prev[j], cur[j - 1]); prev = cur; }
  return Math.round(100 * 2 * prev[b.length] / (a.length + b.length));
}
function npTxGrade(blockId, text){
  const n = notesOf(blockId), got = n.transcribe.facts.map(f => npHit(f.match, text)), facts = got.filter(Boolean).length, of = got.length;
  const acc = txAccuracy((SIM.events[blockId] || {}).spoken || "", text);
  return {got, facts, of, acc, score: Math.round(0.6 * (of ? 100 * facts / of : 0) + 0.4 * acc)};
}
// the transcript's grade: the attempt handed in (a transcript from before the grading had only its facts)
const npTxScore = (n, r) => typeof r.txScore === "number" ? r.txScore : Math.round(100 * (r.txGot || []).filter(Boolean).length / Math.max(1, n.transcribe.facts.length));
function npTxHandIn(blockId, a){
  const r = npRec(blockId); a.final = true; if(a.text) r.tx = a.text;
  r.txGot = a.got; r.txScore = a.score; r.txAt = new Date().toISOString(); persist();
  if(typeof toast === "function") toast(`Transcript handed in: ${a.score}% (${a.facts} of ${a.of} facts, ${a.acc}% word accuracy). The answer key is open.`);
  npRepaint(blockId);
}
window.cmCaseFlow.npTx = function(blockId){
  const n = notesOf(blockId), r = npRec(blockId), el = document.getElementById("npt_" + blockId), msg = document.getElementById("nptm_" + blockId);
  if(!n || r.txAt) return;
  r.tx = ((el && el.value) || r.tx || "").trim().slice(0, 4000);
  if(!vmRec(blockId).plays && !isTrainer()){ if(msg) msg.textContent = "Play the voicemail first: the transcript is of what you hear."; return; }
  if(npWords(r.tx) < 25){ if(msg) msg.textContent = "Take more of it down: type the message as he says it, start to finish."; return; }
  const g = npTxGrade(blockId, r.tx), a = {at: new Date().toISOString(), score: g.score, facts: g.facts, of: g.of, acc: g.acc, got: g.got, words: npWords(r.tx), text: r.tx};
  r.txTries = (r.txTries || []).concat([a]);
  if(g.score >= TX_PASS || r.txTries.length >= TX_TRIES) return npTxHandIn(blockId, a);
  persist();
  if(typeof toast === "function") toast(`Attempt ${r.txTries.length}: ${g.score}% (${g.facts} of ${g.of} facts, ${g.acc}% word accuracy). Improve it, or hand it in.`);
  npRepaint(blockId);
};
window.cmCaseFlow.txGrade = (said, typed) => txAccuracy(said, typed);
window.cmCaseFlow.npTxHand = function(blockId){
  const r = npRec(blockId), tries = r.txTries || [];
  if(r.txAt || !tries.length) return;
  npTxHandIn(blockId, tries[tries.length - 1]);
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
  if(id === "drive" && window.CMDrive) return CMDrive.show();   // the Backup Drive panel: link Google Drive, build and check the firm's folders
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
/* a theory card's ＋ More: the detail that doesn't fit on the card (theory-dN.json concepts[].more), in a pop-up card;
   a framework step's (framework.steps[].more) opens the same way, its index written "s<n>", so a flow can be read step by step */
const stepMore = (b, x, i) => (x.more || []).length ? `<button type="button" class="cfx-th-more" onclick="cmCaseFlow.more('${b.id}','s${i}')" title="More on ${E(x.label)}">＋ More</button>` : "";
const moreOf = (t, i) => { if(!t) return null; const m = /^s(\d+)$/.exec(String(i)); const c = m ? ((t.framework && t.framework.steps) || [])[+m[1]] : t.concepts[i]; return c && {term: m ? c.label : c.term, text: c.text, more: c.more}; };
/* In a presentation the pop-up is the room's: opened in the slides window, its live copy in the presenter console or
   from the console's own ＋ More buttons, it opens (and closes) in every window over the presentation channel. */
const moreCh = (() => { try{ return "BroadcastChannel" in window ? new BroadcastChannel("lsh-present-v1") : null; }catch(e){ return null; } })();
const moreAudience = () => document.body.classList.contains("audience-mode");
if(moreCh) moreCh.addEventListener("message", e => {
  const m = e.data || {}; if(!moreAudience()) return;
  if(m.type === "more") window.cmCaseFlow.more(m.blockId, m.i, true);
  if(m.type === "moreClose" || m.type === "show" || m.type === "end") document.querySelectorAll(".cfx-more").forEach(x => x.remove());
});
window.cmCaseFlow.moreShow = function(blockId, i){ if(moreCh) moreCh.postMessage({type: "more", blockId, i}); };
window.cmCaseFlow.moreHide = function(){ if(moreCh) moreCh.postMessage({type: "moreClose"}); };
window.cmCaseFlow.more = function(blockId, i, remote){
  const t = (SLIDES[blockId] || {}).theory, x = moreOf(t, i); if(!x || !(x.more || []).length) return;
  document.querySelectorAll(".cfx-more").forEach(m => m.remove());
  if(!remote && moreAudience() && moreCh) moreCh.postMessage({type: "more", blockId, i});
  const o = document.createElement("div"); o.className = "cfx-modal cfx-more"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", x.term);
  o.innerHTML = `<div class="cfx-modal-in card lesson-card"><div class="cfx-modal-h"><b>${E(x.term)}</b><button type="button" class="btn btn-ghost btn-sm">Close ✕</button></div>
    <p class="cfx-more-lead">${hl(x.text)}</p><ul>${x.more.map(m => `<li>${hl(m)}</li>`).join("")}</ul></div>`;
  const close = () => { o.remove(); document.removeEventListener("keydown", esc, true); if(moreAudience() && moreCh) moreCh.postMessage({type: "moreClose"}); };
  const esc = e => { if(e.key === "Escape"){ e.stopPropagation(); close(); } };
  o.addEventListener("click", e => { if(e.target === o || e.target.closest(".cfx-modal-h button")) close(); });
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o); if(!remote) o.querySelector(".cfx-modal-h button").focus();
};
window.cmCaseFlow.back = function(){
  const r = state.cfReturn; state.cfReturn = null;
  syncReturn();
  if(!r) return;
  if(r.view !== "day"){ goto(r.view); return; }
  goto("day", r.dayId);
  setTimeout(() => { state.dayViewMode = "slides"; if(typeof goToSlide === "function" && r.slide != null) goToSlide(r.slide); }, 0);
};
/* the Admin screen as Foundational's: one solid panel, the page as wide as the screen (main.cm-admin-main) */
const adminPanel = out => state.isAdmin ? `<div class="cm-admin-screen">${out}</div>` : out;
/* the way back: a pill on the course page a step opened, until the trainee goes back or elsewhere in the Case Flow.
   It returns to the slide the trainee left (cmCaseFlow.back). There is no second pill that carries on to another
   step: a page opened from a slide only ever leads back to that slide. */
function syncReturn(){
  let pill = document.getElementById("cf-return"), go = document.getElementById("cf-return-next");
  if(go){ go.remove(); go = null; }
  // the dashboard has its own ▶ Continue where you left off: no floating Back / Next over it, and reaching it ends the way back
  if(state.view === "dashboard") state.cfReturn = null;
  const r = state.cfReturn, show = !!r && state.view !== "day";
  if(r && state.view === "day") state.cfReturn = null;
  if(!show){ if(pill) pill.hidden = true; if(go) go.hidden = true; return; }
  if(!pill){ pill = document.createElement("button"); pill.id = "cf-return"; pill.type = "button"; pill.onclick = () => cmCaseFlow.back(); document.body.appendChild(pill); }
  pill.textContent = r.view === "day" ? `← Back to Case Flow Day ${r.n}` : "← Back to the Case Flow";
  pill.hidden = false;
}
/* ---------- Next is Next; the Action Plan Editor is a button ----------
   Next always goes to the next slide and "Continue to Knowledge Check" always opens the Knowledge Check: for a
   trainee, for a trainer and in Presenter view. (On the last slide of a Skill Activity worked in the Action Plan
   Editor both used to open the editor instead, with a "Next: …" pill there that carried on: a button that said one
   thing and did another. That detour is gone.)
   The draft itself is one click from the activity's own slide: 📝 Open the Action Plan Editor, in the Practice Lab
   line of its Your Task (planGo; no slide is any taller for it). It opens the editor with the way back to the slide the trainee left
   (cmCaseFlow.tool → state.cfReturn → "← Back to Case Flow Day N", cmCaseFlow.back).
   In Presenter view the console's forward button on the day's last slide ends the presentation and opens the
   Knowledge Check, and says so: it reads "Continue to Knowledge Check →" there (js/cm-flow-parts.js). */
const PLAN_TOOL = /^\s*Action Plan Editor/i;
const planAct = b => !!b && b.kind === "activity" && PLAN_TOOL.test((b.act && b.act.tool) || "");
const planGo = (b, n) => planAct(b) ? `<button type="button" class="btn btn-navy btn-sm cfx-plan-go" data-tool="plan" onclick="cmCaseFlow.tool('plan','${b.id}')" title="Your draft for this activity is written there. “← Back to Case Flow Day ${n}” brings you back to this slide.">📝 Open the Action Plan Editor</button>` : "";
window.cmCaseFlow.onward = function(){ cmCaseFlow.back(); };   // (an older page's "Next: …" pill: it goes back to the slide, as Back does)
if(typeof window.presenterStep === "function"){
  const __step = window.presenterStep;
  window.presenterStep = function(dir){
    const d = cfDay(state.dayId);
    if(dir > 0 && d){
      const total = buildDaySlides(d).length, idx = state.lessonSlide || 0, lastPage = (state.presentPage || 0) >= (state.presentPages || 1) - 1;
      // the day's last slide: the forward button reads "Continue to Knowledge Check →" and does that
      if(lastPage && idx === total - 1 && typeof goToKnowledgeCheckWithInterstitial === "function"){ if(typeof presenterEnd === "function") presenterEnd(true); goToKnowledgeCheckWithInterstitial(); return; }
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
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ const mn = document.querySelector("#app > main, main"); if(mn) mn.classList.toggle("cm-admin-main", !!mn.querySelector(".cm-admin-screen")); syncReturn(); sidePresenter(); kcFit(); fitFileCols(); yearInSide(); }catch(e){} return r; };
}
/* Check Your Work: the reference of what the trainee did in the tool (a CMS Case ID, an e-filing or request number),
   kept on their record and shown to their trainer with the module's Learning Check */
/* A trainee has one CMS Case ID (the file they open in the CMS): it is logged once, on the first Skill Activity worked
   in the CMS; the other tools' references (an e-filing or request number) are logged where that work happens. */
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
window.cmCaseFlow.record = () => REC;   // the trainee's Case Flow record, read by the AI Grader (js/cm-ai-grader.js) to fill in what was done
window.cmCaseFlow.logWork = function(blockId, tool){
  const el = document.getElementById("cflog_" + blockId);
  // nothing typed on a CMS step: the case open in the CMS (js/cm-cms-case.js)
  const ref = (((el && el.value || "").trim()) || (tool === "cms" && window.CMCase ? CMCase.id() : "")).slice(0, 120);
  if(el && ref && el.value.trim() !== ref) el.value = ref;
  if(!ref){ if(typeof toast === "function") toast("Add the reference of your work first: the CMS Case ID, e-filing or request number."); return; }
  REC.work = REC.work || {}; REC.work[blockId] = {ref, tool, at: new Date().toISOString()}; persist();
  const ok = document.getElementById("cflogok_" + blockId); if(ok) ok.textContent = "✓ Logged " + new Date().toLocaleDateString();
  if(typeof toast === "function") toast("Logged. Your trainer sees it with this module's Learning Check.");
};
/* while a Case Flow call is live, the caller and the reviewer know John Doe VS Robert Smith, never the earlier Apex file */
if(typeof window.callAIText === "function"){
  const __ai = window.callAIText;
  window.callAIText = function(prompt){
    const s = typeof state !== "undefined" && state.rpSession;
    if(s && s.cf && typeof prompt === "string"){
      let p = typeof CLIENT_DOSSIER_MD === "string" ? prompt.split(CLIENT_DOSSIER_MD).join(caseDossier()) : prompt;
      p = p.replace(/John Doe v\. Apex[^\n)]*/g, "John Doe VS Robert Smith");
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
/* ---------- the Practice Lab: one slide a day, after ALL of the day's lessons ----------
   Every Skill Activity of the day is behind this slide, in the order its lesson was taught. The slide lists them in
   that order, each with the lesson it practises ("Practises: 2.3 Liability Investigation"), so nobody has to remember
   which lesson a lab belongs to; each activity's own Your Task slide says it again (practisesLine).
   It is also where the day's tools open, once: the CMS and every other platform its Skill Activities use (the Net
   Sheet, LOR Drafting, ChartSwap, the Docket and E-Filing platforms, the Case Documents). The activity slides that
   follow say where each step is done without repeating the buttons; a live call is taken from its own activity's
   Your Task. */
function labTools(d){
  const at = {};
  d.lessons.forEach(l => { const b = l.cf.block; if(b.kind === "activity") blockTools(b).concat(SIM.calls[b.id] ? ["call"] : []).forEach(id => { if(!at[id]) at[id] = b.id; }); });
  if(typeof relatedTools === "function" && relatedTools(d.id).some(t => t.id === "calendar") && !at.calendar) at.calendar = "";
  const order = TOOLKIT.map(t => t.id);
  return Object.entries(at).sort((a, b) => order.indexOf(a[0]) - order.indexOf(b[0]));
}
/* a tool on the Practice Lab slide: its short name, so a day's dozen tools take two rows at full size */
function labChip(id, blockId){
  const t = TOOL[id]; if(!t || !toolLive(id, blockId)) return "";
  const live = id === "call" && blockId && SIM.calls[blockId], name = live ? `the live call with ${SIM.calls[blockId].who}` : t.name;
  return `<button type="button" class="btn btn-navy btn-sm" data-tool="${id}" onclick="cmCaseFlow.tool('${id}','${blockId || ""}')" title="Open ${E(name)}">${t.icon} ${E(live ? "Live Call" : t.short)}</button>`;
}
/* an activity's name on the lab's list: a long title up to its colon (the whole of it is on the activity's own slides) */
const labTitle = b => { const t = titleCase(b.title), cut = titleCase(String(b.title).split(/:\s| — /)[0]); return t.length > 54 && cut.length >= 12 ? cut : t; };
function practiceLab(d){
  const acts = d.lessons.map((l, li) => [l, li]).filter(([l]) => l.cf.block.kind === "activity");
  const ph = d.cf.phases[0] || {title: ""};
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; ${E(String(ph.lead || "").toUpperCase())} &middot; PRACTICE LAB</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-lab">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">🧪 Practice Lab</h2></div>
      <div class="cfx-ribbon"><span>All ${acts.length} of today's Skill Activities, in the order of the lessons</span></div>
      <div class="cfx-body"><div class="cfx-sheet">
        <div class="cfx-lab-tools" id="cfxLabTools${d.id}"><b class="cfx-lab-k">Open your tools once:</b>${labTools(d).map(([id, bid]) => labChip(id, bid)).join("")}</div>
        <ol class="cfx-lab-list cfx-lab-of">${acts.map(([l, li], k) => { const b = l.cf.block, of = practisesLine(l);
          return `<li><button type="button" onclick="cmCaseFlow.labGo(${d.id},${li})" title="${E(titleCase(b.title))}${of ? " · " + E(of) : ""}: go to this activity's slides"><span class="n">${k + 1}</span><span class="tt"><span class="t">${E(labTitle(b))}</span>${of ? `<span class="of">${E(of)}</span>` : ""}</span>${SIM.calls[b.id] ? `<span class="c" title="A live call">📞</span>` : ""}${!isTrainer() && actDone(b.id) ? `<span class="ok" title="Worked">✓</span>` : ""}</button></li>`; }).join("")}</ol>
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
/* The course's last slide (Day 5, before its Knowledge Check): the case is finished, so no Action Plan, a celebratory
   congratulations and a bold thank-you card */
const isLastCfDay = d => !!(d && d.cf) && d.cf.n === Math.max(...CF.days.map(x => x.n));
function closingSlide(d){
  const c = CF.case;
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; THE CASE IS CLOSED</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-closing">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">🎉 Congratulations</h2></div>
      <div class="cfx-body"><div class="cfx-sheet cfx-close">
        <div class="cfx-close-burst" aria-hidden="true"><span>🎊</span><span>🎓</span><span>🎉</span></div>
        <p class="cfx-close-cheer">You did it!</p>
        <div class="cfx-thanks" role="note" aria-label="Thank you card">
          <p class="cfx-thanks-h">Thank you</p>
          <p>Thank you for the care you put into John Doe's file this week: every document checked, every deadline docketed, every
          call made with the client in mind. That is what a Case Manager brings to a firm, and to the people it represents.</p>
          <p class="cfx-thanks-sig">With gratitude,<br><span>${E(c.counsel)}</span> and the LSH Training team</p>
        </div>
        <p class="cfx-close-next">${((state.progress || {})[d.id] || {}).done ? "✓ Knowledge Check passed: your training is complete." : "One last step: today's Knowledge Check."}</p>
      </div></div>
    </div>`;
}
/* ---------- 🏗 Build Your Companion Case (a build day, Day 5): the practical, 150 minutes ----------
   Each trainee opens and builds the companion case their trainer assigned (Trainee Audit → 📁), the way they worked
   John Doe's file all week: the steps in order, each with the minutes it gets and why it comes there. */
const BUILD_STEPS = [
  [10, "Read the file", "📁 Open case file: the client, the injuries, the coverage and the facts at intake.", "You can't open a matter you haven't read: the facts decide every step after this one."],
  [30, "Open the matter in the CMS", "The Conflict Check first, on every party's full legal name; then the parties, the insurance and the SOL calendared from the date of loss.", "Day 1: the CMS is the file of record, and a conflict found late is a matter you can't keep."],
  [15, "Build its case folder", "The SOP: a Main Case Folder named [Your Full Name] - [Case Name], the firm's nine subfolders, connected to the platform, the intake documents uploaded.", "Day 1: one file, one address, so whoever covers it finds everything in seconds."],
  [35, "Set up the claims", "Every carrier in the stack: the Letters of Representation, each claim's verification status, the coverage matrix in the CMS.", "Day 2: nothing counts until it's confirmed in writing, and an unreported layer is money left on the table."],
  [30, "Plan the care", "The treatment map, the 14-day rule and any gap, who pays first, and whether an LOP is needed.", "Day 2: the treatment record becomes the claim, so a gap or a wrong payer is fixed now, not at the demand."],
  [20, "Note the decision to Atty. Thorne", "Decision first: what's decided, what needs his call, and the deadline it hangs on, in Case Notes.", "Days 3–5: the attorney decides value and strategy; you bring him the file ready for that decision."],
  [10, "Check your work", "Every document filed in the CMS and in the case folder; your CMS Case ID logged; ready for the brainstorm.", "If it isn't on the file, it didn't happen."]
];
/* the build's steps at the minutes the day gives it (the schedule's build: what the lessons and the Knowledge Check leave) */
function buildSteps(d){
  const mins = buildMins(d), base = BUILD_STEPS.reduce((a, x) => a + x[0], 0);
  const out = BUILD_STEPS.map(x => [Math.max(5, Math.round(x[0] * mins / base / 5) * 5), x[1], x[2], x[3]]);
  out[out.length - 1][0] += mins - out.reduce((a, x) => a + x[0], 0);   // the last step takes the rounding
  return out;
}
function buildMins(d){ try{ return daySchedule(d).build || 150; }catch(e){ return 150; } }
function companionBuild(d, page){
  page = page || 1;
  const mins = buildMins(d), me = !isTrainer() && state.assignedCase, cc = me && (window.CM_COMPANION_CASES || {})[state.assignedCase.id];
  let t = 0;
  const all = buildSteps(d).map(([m, h, what, why], i) => { const from = t; t += m;
    return `<li><span class="cfx-bd-t">${Math.floor(from / 60)}:${String(from % 60).padStart(2, "0")}<small>${m} min</small></span><div><b>${i + 1}. ${E(h)}</b><span>${E(what)}</span><em>Why: ${E(why)}</em></div></li>`; });
  const steps = (page === 1 ? all.slice(0, 4) : all.slice(4)).join("");
  const mine = cc ? `<div class="cfx-bd-case cfx-bd-slim" title="${E(cc.hook)}"><p class="cfx-bd-k">📁 Your companion case · ${E(cc.theme)}</p><h3>${E(cc.title)}</h3>
      <button type="button" class="btn btn-primary" onclick="cmCompanion.open('${E(state.assignedCase.id)}', ${d.cf.n})">📁 Open case file</button></div>`
    : isTrainer() ? `<div class="cfx-bd-case"><p class="cfx-bd-k">📁 Companion cases</p><h3>Every trainee builds the case you assigned</h3><p>Trainee Audit → 📁 on each row. Walk the room while they build; the 🧠 Brainstorm guide has each trainee's case and what to look for.</p>
      ${window.cmCompanion ? `<button type="button" class="btn btn-navy" onclick="cmCompanion.brainstorm(${d.id})">🧠 Brainstorm guide</button>` : ""}</div>`
    : `<div class="cfx-bd-case"><p class="cfx-bd-k">📁 Your companion case</p><h3>Not assigned yet</h3><p>Your trainer assigns it: ask them now, so you can start building.</p></div>`;
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; FULL APPLICATION PRACTICE &middot; ${mins} MINUTES</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-lab cfx-build">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">🏗 Full Application Practice${page === 1 ? ": Build Your Companion Case" : ": the Second Half"}</h2></div>
      <div class="cfx-ribbon"><span>${page === 1 ? `${mins} minutes · everything you practised on John Doe's file, applied to a case of your own` : `Steps 5 to 7 · plan, decide, check`}</span></div>
      <div class="cfx-body"><div class="cfx-sheet"><div class="cfx-bd">${page === 1 ? mine : ""}<ol class="cfx-bd-steps cfx-bd-p${page}">${steps}</ol></div></div></div>
    </div>`;
}
function extraPractice(d){
  const acts = d.lessons.map((l, i) => ({l, i})).filter(x => x.l.cf.block.kind === "activity");
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; OPTIONAL EXTRA PRACTICE</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-lab cfx-extra">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">➕ Optional Extra Practice</h2></div>
      <div class="cfx-ribbon"><span>John Doe's ${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))} activities · untimed</span></div>
      <div class="cfx-body"><div class="cfx-sheet">
        <p class="cfx-ex-lead">Today's practical was your companion case. These ${acts.length} Skill Activities take John Doe's file through today's lessons, in the same order: work any of them now or after the training.</p>
        <ol class="cfx-ex-list">${acts.map(x => `<li><button type="button" onclick="cmCaseFlow.labGo(${d.id},${x.i})"><span>${E(x.l.h.split(" ")[0])}</span>${E(x.l.cf.block.title)}</button></li>`).join("")}</ol>
        <div class="cfx-ex-go"><button type="button" class="btn btn-primary" onclick="cmCaseFlow.toReady(${d.id})">⏭ Skip to 🎯 Ready for the Knowledge Check?</button></div>
      </div></div>
    </div>`;
}
/* ---------- Day 1's introduction, drawn: the life of John Doe's file, and his coverage against his injury ----------
   Kept on purpose, though no deck inserts these two slides any more: the Case Profile's 🗺 File Map (js/cm-case-profile.js
   fileMap) shows the same, and a change to one should be made to the other. */
function introFrame(d, icon, title, ribbon, body){
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; INTRODUCTION</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-intro">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">${icon} ${E(title)}</h2></div>
      <div class="cfx-ribbon"><span>${E(ribbon)}</span></div>
      <div class="cfx-body"><div class="cfx-sheet">${body}</div></div>
    </div>`;
}
function caseMap(d){
  const c = CF.case, days = MODULES.filter(x => x.cf).sort((a, b) => a.cf.n - b.cf.n);
  const stages = ((SLIDES["d1m1-role"] || {}).theory || {}).framework ? SLIDES["d1m1-role"].theory.framework.steps.map(x => x.label) : [];
  const marks = {1: [`Loss ${c.dol}`, `SOL ${c.sol} docketed`, "Matter opened in the CMS"],
    2: [`Care starts ${c.treatmentStart}`, `${c.gapDays}-day gap to explain`, "LORs to every carrier"],
    3: ["Specials audited", "Demand served", `${money(c.total)} stack negotiated`],
    4: ["Liens reduced", "Net Sheet to the cent", "Mediation & Arbitration"],
    5: ["Impasse → suit", "Discovery & deposition", "Award, then close-out"]};
  const track = days.map(x => `<li class="cfx-cm-node${x.cf.n === d.cf.n ? " on" : ""}"><span class="cfx-cm-n">${x.cf.n}</span><b>${E(String(x.title).replace(/^Case Flow Day \d+ · /, ""))}</b><ul>${(marks[x.cf.n] || []).map(m => `<li>${E(m)}</li>`).join("")}</ul></li>`).join("");
  const band = stages.length ? `<div class="cfx-cm-band"><span class="cfx-cm-k">Your Work on Every File: ${stages.length} Stages</span><ol>${stages.map((x, i) => `<li><i>${i + 1}</i>${E(x)}</li>`).join("")}</ol></div>` : "";
  return introFrame(d, "🗺", "The Life of John Doe's File", `${c.style} · from the loss to the close`, `${band}<p class="cfx-cm-k2">John Doe's File: ${days.length} Case Phases, One Each Day</p><ol class="cfx-cm-track">${track}</ol>
    <p class="cfx-cm-foot">You carry all ${stages.length} stages of your work through each of the ${days.length} case phases.</p>`);
}
function coverageMap(d){
  const c = CF.case, layers = stackLayers(), max = Math.max(...layers.map(l => l.limit));
  const ladder = layers.map((l, i) => `<li><span class="cfx-cv-o">${i + 1}</span><div class="cfx-cv-bar" style="--w:${Math.round(l.limit / max * 100)}%"><b>${E(l.tag)} · ${money(l.limit)}</b><span>${E(l.carrier)}</span></div><em>${E(l.note)}</em></li>`).join("");
  const plan = [
    [`The stack caps the recovery at ${money(c.total)}`, "Plan the care and the records so the damages prove value through all three layers."],
    [`${layers[0].tag} pays first: ${money(layers[0].limit)}`, `Tender at limits opens ${layers[1] ? layers[1].tag : "the next layer"}; UM consent to settle and the subrogation waiver come before any release.`],
    [`${c.health.carrier} pays care now, recovers later`, `${c.health.subro}: its lien comes out of the settlement, so plan the reduction early.`],
    ["The weak point, named on Day 1", c.critical + " Document the reason now, before an adjuster uses it against value."]];
  return introFrame(d, "🧱", "Coverage vs. Injury: the Strategy Plan", "Who pays, in what order, against what the injury will cost", `<div class="cfx-cv">
    <section class="cfx-cv-l"><h3>The Coverage Hierarchy</h3><ol class="cfx-cv-ladder">${ladder}</ol>
      <p class="cfx-cv-total">Total Available: <b>${money(c.total)}</b></p></section>
    <section class="cfx-cv-r"><h3>The Strategy Plan</h3><ol class="cfx-cv-plan">${plan.map(([h, t]) => `<li><b>${E(h)}</b><span>${E(t)}</span></li>`).join("")}</ol></section></div>`);
}
function readyCheck(d){
  const qs = labQuestions(d), ph = d.cf.phases[0] || {title: ""};
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; ${E(String(ph.lead || "").toUpperCase())} &middot; READY FOR THE KNOWLEDGE CHECK?</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-lab cfx-ready">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">🎯 Ready for the Knowledge Check?</h2></div>
      <div class="cfx-ribbon"><span>Day ${d.cf.n} · ${qs.length} key concepts from today's lessons</span></div>
      <div class="cfx-body"><div class="cfx-sheet">
        <div class="cfx-lab-gate" id="cfxLabGate${d.id}"><b>${d.cf.build ? "You've built your companion case." : "You've worked today's Skill Activities."}</b> Before you check your work, answer these ${qs.length} key concepts from today's lessons.
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
/* ⏭ on Day 5's Optional Extra Practice: past John Doe's optional activities to the day's last slide, the Ready check
   (whose own button opens the Knowledge Check); in Presenter view the slides window follows */
window.cmCaseFlow.toReady = function(dayId){
  const d = cfDay(dayId), slides = d && typeof buildDaySlides === "function" ? buildDaySlides(d) : [];
  const idx = slides.findIndex(sl => sl.type === "readyCheck"); if(idx < 0) return;
  if(state.presenting && typeof presenterJump === "function") return presenterJump(idx);
  if(!isTrainer()){   // skipping the optional activities is reaching the Ready check: Previous and the slide picker still open them
    state.maxSlideReached = Math.max(state.maxSlideReached || 0, idx);
    state.slideProgress = state.slideProgress || {}; state.slideProgress[d.id] = Math.max(state.slideProgress[d.id] || 0, idx);
    if(typeof storeSet === "function") storeSet("slide-progress", state.slideProgress);
  }
  if(typeof goToSlide === "function") goToSlide(idx);
};
window.cmCaseFlow.labGo = function(dayId, li){
  const d = cfDay(dayId), slides = d && typeof buildDaySlides === "function" ? buildDaySlides(d) : [];
  const idx = slides.findIndex(sl => sl.type === "topic" && sl.lessonIndex === li && sl.part === 1);
  if(idx >= 0 && typeof goToSlide === "function") goToSlide(idx);
};
/* The day's own slides, outside any block: the opening Training Agenda, the Practice Lab, and the End-of-Day
   Discussion before the Knowledge Check (build/case-flow/scripts/days.json, under CM_CF_SCRIPTS._days), read aloud
   like a block's slides, {name} filled from the batch. */
const dayScript = (d, k) => { const x = (((window.CM_CF_SCRIPTS || {})._days || {})[d && d.cf && d.cf.n] || {})[k]; return x && {say: named(x.say, `${d.id}::_${k}`), ask: named(x.ask || "", `${d.id}::_${k}?`)}; };
// a script's paragraphs, as written: a line break starts a new one
const sayParas = t => String(t || "").split(/\s*\n\s*/).map(x => x.trim()).filter(Boolean);
const sayHtml = (t, cls) => sayParas(t).map(p => `<p${cls ? ` class="${cls}${/^•\s/.test(p) ? " script-pt" : ""}"` : ""}>${E(p)}</p>`).join("");
const isPointsSay = t => { const ps = sayParas(t); return ps.length > 0 && ps.every(p => /^•\s/.test(p)); };
const dayScriptHtml = x => `<div class="pn"><div class="script-block"><div class="script-head"><span>${isPointsSay(x.say) ? "🗒 Talking points" : "🎙 Script — read aloud"}</span></div>
  ${sayHtml(x.say, "script-say")}${x.ask ? `<p class="script-say script-ask">${E(x.ask)}</p>` : ""}</div></div>`;
const dayScriptLines = (x, label) => [`SLIDE: ${label.toUpperCase()}`, ...sayParas(x.say)].concat(x.ask ? [`ASK: ${x.ask}`] : []);
if(typeof presenterCues === "function"){   // Presenter view: the trainer's note for the Training Agenda and Practice Lab slides
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    if(slide && slide.type === "closing" && cfDay(d && d.id)) return `<h3>Congratulations & Thank You</h3><p>The case is closed. The Knowledge Check is done: celebrate with the room and read them the thank-you letter.</p>`;
    if(slide && (slide.type === "caseMap" || slide.type === "coverageMap") && cfDay(d && d.id)){
      const x = dayScript(d, slide.type === "caseMap" ? "lifemap" : "coverage");
      return `<h3>${slide.type === "caseMap" ? "The Life of John Doe's File" : "Coverage vs. Injury: the Strategy Plan"}</h3>${x ? dayScriptHtml(x) : ""}`;
    }
    if(slide && (slide.type === "companionBuild" || slide.type === "companionBuild2" || slide.type === "extraPractice") && cfDay(d && d.id)){
      const k = {companionBuild: "build", companionBuild2: "build2", extraPractice: "extra"}[slide.type], x = dayScript(d, k);
      const note = k === "build" || k === "build2"
        ? `<p>${buildMins(d)} minutes, the course's full application practice: each trainee builds the companion case you assigned, step by step as the slide times it. Walk the room; the 🧠 Brainstorm guide has each trainee's case. Call time at each step so nobody spends the whole build on the CMS setup.</p>`
        : `<p>Optional and untimed: John Doe's Day ${d.cf.n} activities, in the order of today's lessons. Most rooms skip them (⏭ on the slide goes to the Ready check, the day's last slide, and from there to the Knowledge Check); trainees can come back to these any time.</p>`;
      return `<h3>${k === "extra" ? "Optional Extra Practice" : "Full Application Practice"}</h3>${x ? dayScriptHtml(x) : ""}<div class="pn-on pn-cue"><b>Trainer note — not read aloud</b>${note}</div>`;
    }
    if(slide && slide.type === "readyCheck" && cfDay(d && d.id)){ const x = d.discussionQuestion ? dayScript(d, "wrap") : null;   // the day's last slide: the End-of-Day Discussion is held on it, then its key concepts
      return `<h3>End-of-Day Discussion · Ready for the Knowledge Check?</h3>${x ? `<p><b>Discussion question:</b> ${E(d.discussionQuestion)}</p>${dayScriptHtml(x)}` : ""}<div class="pn-on pn-cue"><b>Trainer note — not read aloud</b><p>${d.cf.build ? "The companion-case build is done." : "The Practice Lab is done: every Skill Activity of the day."} ${x ? "Hold the discussion first, then give" : "Give"} the room a couple of minutes on the slide's ${labQuestions(d).length} key concepts, one from each of today's first modules: a wrong answer shows the reason and can be tried again. This is the day's last slide: <b>Continue to Knowledge Check</b> opens the Knowledge Check.</p></div>`; }
    if(!(slide && (slide.type === "practiceLab" || slide.type === "taskOverview") && cfDay(d && d.id))) return __cues.apply(this, arguments);
    if(slide.type === "taskOverview"){ const x = dayScript(d, "agenda"), a = agendaNotes(d);
      return x ? `<h3>Training Agenda</h3>${dayScriptHtml(x)}<div class="pn-on pn-cue"><b>The run of the day, from the slide</b>${sayHtml(a.say.split("\n").slice(1).join("\n"))}</div>`
        : `<h3>Training Agenda</h3><div class="pn-part">🎙 Script — read aloud</div>${sayHtml(a.say)}${a.ask ? `<p><b>Ask:</b> ${E(a.ask)}</p>` : ""}`; }
    const n = d.lessons.filter(l => l.cf.block.kind === "activity").length, x = dayScript(d, "lab");
    const how = `<p>The lessons are done: every slide from here to the Ready check is practice. Have everyone open the tools from this slide now, the CMS first, so they stay open beside the slides. All ${n} of today's Skill Activities follow, in the order their lessons were taught; the slide names the lesson each one practises, and so does each activity's first slide. Each runs Your Task, then Your Case, then the AI Grader. Live calls are taken from their own activity.</p><p>Anyone stuck on one step for more than ten minutes: help them log what they have and move on. The debrief is where it lands.</p>`;
    return x ? `<h3>Practice Lab</h3>${dayScriptHtml(x)}<div class="pn-on pn-cue"><b>Trainer note — not read aloud</b>${how}</div>` : `<h3>Practice Lab</h3>${how}`;
  };
}
if(typeof presenterCues === "function"){   // Presenter view: ⚡ Inject, at the top of the notes on an activity's Your Task slide
  const __cuesInject = presenterCues;
  presenterCues = function(d, slide){
    const html = __cuesInject.apply(this, arguments);
    if(!(slide && slide.type === "topic" && cfDay(d && d.id))) return html;
    const l = d.lessons[slide.lessonIndex], b = l && l.cf && l.cf.block;
    if(!b || viewsOf(b)[(slide.part || 1) - 1] !== "task") return html;
    const xs = injectsOf(b); if(!xs.length) return html;
    return `<div class="pv-inject"><b>⚡ Inject now: a real-time task</b><span>Once the room is working this task, not before.</span><ul>${xs.map(x => `<li>${x.html}</li>`).join("")}</ul>${ringBtn(d.id, b)}</div>` + html;
  };
}
if(typeof presenterCues === "function"){   // Presenter view: the slide's ＋ More pop-ups, opened in the room's window from the console
  const __cuesMore = presenterCues;
  presenterCues = function(d, slide){
    const html = __cuesMore.apply(this, arguments);
    if(!(slide && slide.type === "topic" && cfDay(d && d.id))) return html;
    const l = d.lessons[slide.lessonIndex], b = l && l.cf && l.cf.block, view = b && viewsOf(b)[(slide.part || 1) - 1];
    const t = b && (SLIDES[b.id] || {}).theory;
    if(!t || (view !== "theory" && view !== "theory2")) return html;
    const half = Math.ceil(t.concepts.length / 2), two = t.concepts.length > TH_PER;
    const list = !two ? t.concepts : view === "theory" ? t.concepts.slice(0, half) : t.concepts.slice(half);
    const more = list.filter(x => (x.more || []).length);
    if(!more.length) return html;
    return html + `<div class="pv-more"><b>＋ More on screen</b><span>Opens the pop-up in the slides window for the room; Close there or here.</span>
      <div>${more.map(x => `<button type="button" class="btn btn-ghost btn-sm" onclick="cmCaseFlow.moreShow('${b.id}',${t.concepts.indexOf(x)})">＋ ${E(x.term)}</button>`).join("")}
      <button type="button" class="btn btn-ghost btn-sm" onclick="cmCaseFlow.moreHide()">Close pop-up ✕</button></div></div>`;
  };
}
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    if(slide && slide.type === "practiceLab" && cfDay(d && d.id)) return practiceLab(d);
    if(slide && slide.type === "readyCheck" && cfDay(d && d.id)) return readyCheck(d);
    if(slide && slide.type === "caseMap" && cfDay(d && d.id)) return caseMap(d);
    if(slide && slide.type === "coverageMap" && cfDay(d && d.id)) return coverageMap(d);
    if(slide && slide.type === "companionBuild" && cfDay(d && d.id)) return companionBuild(d, 1);
    if(slide && slide.type === "companionBuild2" && cfDay(d && d.id)) return companionBuild(d, 2);
    if(slide && slide.type === "extraPractice" && cfDay(d && d.id)) return extraPractice(d);
    if(slide && slide.type === "closing" && cfDay(d && d.id)) return closingSlide(d);
    return (slide && slide.type === "taskOverview" && cfDay(d && d.id)) ? agendaSlide(d) : __content.apply(this, arguments);
  };
}
if(typeof daySlideTitle === "function"){
  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){
    if(cfDay(d && d.id) && slide && slide.type === "taskOverview") return "Training Agenda";
    if(cfDay(d && d.id) && slide && slide.type === "practiceLab") return "Practice Lab";
    if(cfDay(d && d.id) && slide && slide.type === "readyCheck") return "Ready for the Knowledge Check?";
    if(cfDay(d && d.id) && slide && slide.type === "caseMap") return "The Life of John Doe's File";
    if(cfDay(d && d.id) && slide && slide.type === "coverageMap") return "Coverage vs. Injury: the Strategy Plan";
    if(cfDay(d && d.id) && slide && slide.type === "companionBuild") return "Full Application Practice: Build Your Companion Case";
    if(cfDay(d && d.id) && slide && slide.type === "companionBuild2") return "Full Application Practice: the Second Half";
    if(cfDay(d && d.id) && slide && slide.type === "extraPractice") return "Optional Extra Practice";
    if(cfDay(d && d.id) && slide && slide.type === "closing") return "Congratulations & Thank You";
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
window.cmCaseFlow = window.cmCaseFlow || {}; window.cmCaseFlow.viewsOf = b => viewsOf(b); window.cmCaseFlow.drawnViewsOf = b => viewsOf(b, true);
// a block's slide by its view (Your Task's Submit to AI Grader goes straight to the AI Grader, past Your Case)
window.cmCaseFlow.toView = function(blockId, view){
  const d = typeof DAYS !== "undefined" ? DAYS.find(x => x.id === state.dayId) : null; if(!d || typeof buildDaySlides !== "function") return nextSlide();
  const li = d.lessons.findIndex(l => l.cf && l.cf.block.id === blockId), vs = li >= 0 ? viewsOf(d.lessons[li].cf.block) : [];
  const i = buildDaySlides(d).findIndex(sl => sl.type === "topic" && sl.lessonIndex === li && vs[sl.part - 1] === view);
  if(i < 0) return nextSlide();
  if(typeof goToSlide === "function") goToSlide(i); else { state.lessonSlide = i; render(); }
};   // a block's slides, in order (the scripts' keys)
MODULES.forEach(d => d.lessons.forEach(l => {
  const b = l.cf.block, n = b.notes || [], vs = viewsOf(b), best = (b.best || []).map(x => String(x).replace(/^pitfall:\s*/i, "Watch for this: "));
  const per = {   // one script per slide (view); the block's speaker notes spread across its slides
    why: {why: b.tell && b.tell.why, talk: n[0] || ""},
    // (a lesson whose Why It Matters opens The Theory: its why and its note come first on that slide)
    theory: theoryOf(b) ? {why: (vs.includes("why") || !(b.tell && b.tell.why) ? "" : b.tell.why + " ") + String(theoryOf(b).lead).replace(/\*\*/g, ""), talk: vs.includes("why") ? "" : n[0] || "", walk: theoryOf(b).concepts.slice(0, theoryOf(b).concepts.length > TH_PER ? Math.ceil(theoryOf(b).concepts.length / 2) : TH_PER).map(x => `${x.term}: ${String(x.text).replace(/\*\*/g, "")}`), ask: "Which of these have you met before, and where would it show up on John Doe's file?"} : {},
    theory2: theoryOf(b) ? {why: "The theory, continued.", walk: theoryOf(b).concepts.slice(Math.ceil(theoryOf(b).concepts.length / 2)).map(x => `${x.term}: ${String(x.text).replace(/\*\*/g, "")}`)} : {},
    frame: theoryOf(b) && theoryOf(b).framework ? {why: theoryOf(b).framework.title, walk: (theoryOf(b).framework.rows || []).map(r => r.map(x => String(x).replace(/\*\*/g, "")).join(" · ")).concat((theoryOf(b).framework.steps || []).map(x => `${x.label}: ${String(x.text).replace(/\*\*/g, "")}`)), ask: "Walk the room through it on John Doe's file: where is he on this right now?"} : {},
    doc: (SLIDES[b.id] || {}).document ? {why: `${SLIDES[b.id].document.name}: what it is, why the law cares, what it proves, and how you handle it.`, walk: ["definition", "purpose", "evidence"].map(k => String(SLIDES[b.id].document[k]).replace(/\*\*/g, "")).concat(SLIDES[b.id].document.handling.map(x => String(x).replace(/\*\*/g, "")))} : {},
    map: roadmapOf(b) ? {why: roadmapOf(b).title, walk: roadmapOf(b).steps.map(x => `${x.label}: ${String(x.text).replace(/\*\*/g, "")}`)} : {},
    rules: {why: "The rules, and where the Case Manager's role ends.", walk: ((b.tell && b.tell.rules) || []).concat((b.tell && b.tell.upl) || []), ask: n[1] || ""},
    model: {why: (b.show && b.show.caption) || "The model to follow.", talk: b.visual || ""},
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
    const x = deckPage(b, v) ? {talk: deckPage(b, v).notes} : per[v] || {}, h = said[v];
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
      `Keep John Doe's 📇 Case Profile and the CMS open in another tab: the room will ask where things are on the file.`]});
    add(5, {title: "Welcome and the Training Agenda", do: [`Put the Training Agenda slide up: it lists today's two parts in order, Part 1 the Lessons (all of them, section by section) and Part 2 ${sc.loop ? `the Daily Loop: ${n === 1 ? "👋 Meet John Doe" : "📇 the Case Profile"} → 🎯 ${sc.build ? "the Full Application Practice (the companion case)" : `today's Skill Building${n === 1 ? ", the Intake" : ""}`} → 📝 the Action Plan${sc.sides ? `, then ${sc.sides} optional side exercises` : ""}` : sc.build ? "the Full Application Practice" : "the Practice Lab (all of the day's Skill Activities)"}, then the Knowledge Check.`, n > 1 ? `Recap yesterday in a minute: where John Doe's file stood when we stopped, and the one thing most people found hard (check the Knowledge Check scores).` : `Introduce the file: John Doe VS Robert Smith, Atty. Elijah Thorne's case, the one file the whole week works.`],
      say: n === 1 ? `“Welcome, everyone. For the next five days you're the Case Manager on one real-looking file, John Doe VS Robert Smith. Today we work through ${andList(titles)}. By the end of the day you'll ${firstAim(d)}, and you'll have done it on the file yourselves.”`
        : `“Morning, everyone. Let's pick John Doe's file up where we left it. Today it's ${andList(titles)}. By the time we finish you'll ${firstAim(d)}.”`,
      watch: "Anyone who hasn't opened today's day yet: ask them to open it now so they can follow along."});
    // the day in two parts: ALL of the lessons, section by section; the break (inside the 20 minutes kept for the
    // welcome, the break and the close); then the Practice Lab, one Skill Building group after another, a brainstorm
    // after each; then the Knowledge Check
    const parts = sc.parts, labs = sc.labs.filter(p => p.acts.length);
    let spare = sc.buffer;
    parts.forEach((p, i) => {
      if(p.topics.length) add(p.lecture, {title: `Lessons ${i + 1} of ${parts.length}: ${E(p.title)}`, do: [
        `${p.topics.length} topic${p.topics.length > 1 ? "s" : ""}, ${p.lecture} minutes in all (${p.topics.map(l => `${(sc.minsOf && sc.minsOf.get(l)) || sc.per} min`).join(", ")}): ${p.topics.map(l => `<b>${E(titleCase(l.cf.block.title))}</b>`).join(" · ")}.`,
        `A refresher: the room has met every one of these, so recap the rule, check it with one question about John Doe's file, and move on; each topic keeps all its slides (The Theory, which opens with why it matters, The Rules, See It, Do &amp; Don't), at a quicker pace. ${p.topics.some(l => l.cf.block.thorough) ? "<b>The mediation and arbitration lessons are the exception: teach them in full</b>, they get the most minutes." : ""}`,
        `Read the script in Presenter view as written or in your own words; take one or two answers per question, not a round of the room.`],
        say: `“Now we're into ${p.title}. Keep John Doe's file in your head the whole way through: ${sc.loop ? "in today's Skill Building you'll do this on it" : "in the Practice Lab you'll do this on it"}.”`,
        watch: "Silence usually means it's too abstract: bring it back to John Doe's file and ask what they'd do next on it."});
    });
    if(parts.length) add(10, {brk: true, title: "Break", do: [`Ten minutes, between the lessons and ${sc.loop ? (n === 1 ? "👋 Meet John Doe on the Case Profile" : "the 📇 Case Profile check-in") : sc.build ? "the build" : "the Practice Lab"}. Tell the room the exact time you'll restart.`], say: `“That's every lesson for today. Let's take ten. When we're back it's all hands-on: ${sc.loop ? `John Doe's Case Profile, then ${sc.build ? "you build your companion case" : "today's Skill Building, on his file"}` : sc.build ? "you build your companion case" : "the Practice Lab, on John Doe's file"}.”`});
    // the daily loop (js/cm-day-loop.js): the Case Profile first, then the Skill Building, then the Action Plan and the side exercises
    if(sc.loop) add(sc.profile, {title: n === 1 ? "👋 Meet John Doe: the Case Profile" : "📇 Case Profile Check-In", do: [
      n === 1 ? `The slide after the last lesson sends everyone to 📇 Case Profile → 👋 Meet John Doe. Walk it on the shared screen: the collision, who pays and in what order, the critical fact. The Intake is the next slide: today's Skill Building.`
        : `The check-in slide lists what changed on the file since yesterday; open 📇 Case Profile → 📅 The Case So Far on the shared screen for a minute, then go straight into the Skill Building.`],
      say: n === 1 ? `“The lessons are done. Now meet your client: not on a slide, on his Case Profile.”` : `“Before we work the file, look at where it stands today.”`});
    labs.forEach((p, i) => {
      {
        const calls = p.acts.map(l => SIM.calls[l.cf.block.id]).filter(Boolean);
        add(p.skill, {title: sc.loop ? `🎯 Skill Building: ${n === 1 ? "the Intake, " : ""}${E(p.title)}` : `Practice Lab ${i + 1} of ${labs.length} · Skill Building: ${E(p.title)}`, do: [
          (i === 0 && !sc.loop ? `Put the <b>🧪 Practice Lab</b> slide up first: everyone opens their tools from it, once, and it lists all ${sc.acts} activities with the lesson each one practises. ` : "")
          + `${p.acts.length} Skill Activit${p.acts.length === 1 ? "y" : "ies"}: ` + p.acts.map(l => `<b>${E(l.cf.block.title)}</b> <span style="color:var(--ink-soft)">(${E(String(l.cf.block.act.tool || "").split("·")[0].trim())}${l.cf.of ? "; practises " + E(lessonRef(l.cf.of)) : ""})</span>`).join(" · "),
          `About ${sc.act} minutes each (the 🧪 chip counts it down). Your Task first, then Your Case: trainees work it on John Doe's file in the CMS or the tool the step names, beside the slide (⧉ Side by side), then submit it to the AI Grader and log the reference.`,
          calls.length ? `📞 Live call${calls.length > 1 ? "s" : ""}: ${andList(calls.map(c => E(c.who)))}. Each starts from “Take the call” on the Your Task slide; let one trainee take it while the room listens, or everyone takes it at their desk.` : "",
          p.acts.some(l => planAct(l.cf.block)) ? `The Action Plan drafts: <b>📝 Open the Action Plan Editor</b> is on the activity's Your Task slide; “← Back to Case Flow Day ${n}” there returns to the slide. Next on the slide is always the next slide.` : "",
          ...p.acts.flatMap(l => injectsOf(l.cf.block).filter(x => x.kind === "fallout").map(x => `⚡ <b>Inject mid-task</b> on ${E(titleCase(l.cf.block.title))} (the ⚡ pill on its Your Task slide): ${x.html.replace(/^<b>[^<]*<\/b>\s*/, "")}`))].filter(Boolean),
          say: p.acts.length === 1 ? `“Your turn. Open John Doe's file and do this the way you would at your desk. Shout if you get stuck, and log what you did before we move on.”`
            : `“Your turn. There are ${p.acts.length} of these, in the order the work happens on the file. Work them the way you would at your desk, and shout if you get stuck.”`,
          watch: "Anyone stuck on one step for more than a few minutes: help them log what they have and move on. The brainstorm is where it lands."});
        add(p.brainstorm, {title: "Brainstorm", do: [
          `Straight after the Skill Building, the room thinks out loud about what John Doe's file just showed: what they found, what they'd do differently, and what Atty. Thorne needs to hear from them.`,
          i < labs.length - 1 ? `Take three answers and tie the last one to the next group of activities.` : `Take three answers and tie the last one to the Knowledge Check.`],
          say: `“Before we move on: what did John Doe's file just tell you that the slides didn't? And what would you do differently next time?”`,
          watch: "The quiet ones did the work too: call on someone by name with a specific question about their file."});
      }
    });
    if(sc.build){
      let at = 0;
      add(sc.build, {title: `🏗 Full Application Practice: Build Your Companion Case`, do: [
        `The practical: ${sc.build} minutes. Each trainee builds the companion case you assigned (Trainee Audit → 📁), on the slide's steps: ${buildSteps(d).map(([m, h]) => { const t = at; at += m; return `<b>${E(h)}</b> (${Math.floor(t / 60)}:${String(t % 60).padStart(2, "0")}, ${m} min)`; }).join(" · ")}.`,
        `Call time at each step. Walk the room with the 🧠 Brainstorm guide: it has each trainee's case and the trap to watch for.`,
        `John Doe's Day ${n} activities are behind the build as ➕ Optional Extra Practice, untimed: ⏭ on that slide skips them to the Ready check, the day's last slide.`],
        say: `“You've worked John Doe's file all week. Now you build one yourself: the steps and the minutes are on the slide, and I'll call time at each one.”`,
        watch: "Anyone still in the CMS setup at the 45-minute mark: get them to log what they have and move to the folder."});
      if(labQuestions(d).length) steps[steps.length - 1].do.push(sc.loop ? `After the build, <b>Close Out Your Action Plan</b>; then ⏭ on Optional Extra Practice goes to the day's last slide, <b>Ready for the Knowledge Check?</b>: ${labQuestions(d).length} key concepts from today's lessons, a couple of minutes, nothing locked.`
        : `After the build, the day's last slide, <b>Ready for the Knowledge Check?</b> (⏭ on Optional Extra Practice goes to it): ${labQuestions(d).length} key concepts from today's lessons, a couple of minutes, nothing locked.`);
    }
    if(sc.loop){
      add(sc.plan, {title: n === 5 ? "📝 Close Out Your Action Plan" : "📝 Update Your Action Plan", do: [
        n === 1 ? `Guided, step by step: the slide's six steps are the template's sections in order. Do the first one together on the shared screen (📝 Open my Action Plan), then walk the room.`
          : `Lighter each day: the trainees update the plan on their own from the slide's prompts. Spot-check two plans: every action item has an owner and a date.`]});
      if(sc.side) add(sc.side, {title: `🧪 Practice Lab: ${sc.sides} Optional Side Exercises`, do: [
        `Optional and short: each one is an assumption (“Assuming …”) and an entry to log in the CMS. ${sc.sidePick < sc.sides ? `${sc.side} minutes is time for about ${sc.sidePick} of the ${sc.sides}, about ${sc.sideEach} minutes each: trainees choose any ${sc.sidePick} (the ones closest to their own desk work), not all of them.` : `Trainees pick the ones they have time for.`} ⏭ on the slide goes to the Ready check.`]});
    }
    const lastSb = sc.build || sc.loop ? null : steps.filter(x => /Skill Building/.test(x.title)).pop();
    if(lastSb && labQuestions(d).length) lastSb.do.push(`After the last activity, the <b>Ready for the Knowledge Check?</b> slide: ${labQuestions(d).length} key concepts from today's lessons, a couple of minutes, nothing locked.`);
    if(d.discussionQuestion && spare >= 18) add(8, {title: "End-of-day discussion", say: `“Before the Knowledge Check, let's step back and talk about this together: ${E(d.discussionQuestion)}”`, do: ["Take two or three answers and connect each one to a moment on John Doe's file from today."]});
    add(sc.kc, {title: `Knowledge Check · ${game.icon} ${E(game.name)}`, do: [
      `Trainees open the Knowledge Check from the last slide: ① today's game, ${E(game.name)}, then ② the module's takeaway, and one Submit.`,
      `70% marks the day complete. One attempt only: the first score is the one recorded. Below 70%, open the next day for them in 🔓 Open Lessons.`],
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
      <div class="sopf-meta"><span>⏱ About ${Math.round(liveMins / 60 * 10) / 10} hours live · ends ≈ ${sopClock(start, liveMins)}</span><span>🗂 ${E(String(d.cf.phases[0] ? d.cf.phases[0].lead + " · " + d.cf.phases[0].title : ""))}</span><span>📚 ${sc.topics} topics</span><span>🧪 ${sc.loop ? `${sc.build ? "the companion-case build" : "1 Skill Building"}${sc.sides ? ` + ${sc.sides} optional side exercise${sc.sides === 1 ? "" : "s"}` : ""}` : `${acts} Skill Activities`}</span><span>${game.icon} ${E(game.short)}</span></div>
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
      [/<li><b>Teach:<\/b>[^<]*<\/li>/, "<li><b>Teach:</b> each day is one module and a refresher: 30% lessons (66 of the 220 teaching minutes, each topic's slides at a quicker pace; the mediation and arbitration lessons in full), 70% practical (the Skill Building straight after each topic, the brainstorms and the Knowledge Check). Day 5's practical is the 150-minute companion-case build.</li>"],
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
/* ---------- the day's Speaker Notes PDF: every slide's script ----------
   The engine's pages listed each topic's two parts (and the old course's answer keys); a Case Flow block has up to
   eight slides, so it lists them all, by Case Phase, each under its slide's name, in the trainer's own words. */
/* the case year picker: in the lesson's side column (trainers, when it shows) and on Presenter view's console */
function yearInSide(){
  if(!DATES || !state.isAdmin || state.view !== "day") return;
  const top = document.querySelector(".ls-top");
  if(top && !state.presenting && !top.querySelector(".cf-yr")) top.insertAdjacentHTML("beforeend", `<div class="cf-yr-side">${caseYearPicker(true)}</div>`);
  const meta = document.querySelector(".pv-meta");
  // the trainer picks it here, on the console they teach from (the side column's picker has no room on a laptop)
  if(meta && !meta.querySelector(".cf-yr-pv")) meta.insertAdjacentHTML("beforeend", `<span class="cf-yr-pv">${caseYearPicker(true)}</span>`);
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
    const lines = [`## ${d.title}: Trainer Speaker Notes`], agenda = dayScript(d, "agenda"), lab = dayScript(d, "lab"), wrap = dayScript(d, "wrap");
    const firstAct = d.lessons.findIndex(l => l.cf.block.kind === "activity"), ag = agendaNotes(d);
    if(agenda) lines.push("## Opening: Training Agenda", ...dayScriptLines(agenda, "Training Agenda"), `RUN OF THE DAY: ${ag.run}`, "---");
    else { lines.push("## Training Agenda", "SLIDE: TRAINING AGENDA", ...sayParas(ag.say)); if(ag.ask) lines.push(`ASK: ${ag.ask}`); lines.push("---"); }
    const block = (l, i) => {
      lines.push(`## ${String(i + 1).padStart(2, "0")}. ${titleCase(l.cf.block.title)}  ·  ${slideLabel(d, i)}`);
      viewsOf(l.cf.block).forEach((v, j) => {
        const sc = slideScript(d, l, j + 1), sb = scriptBody(sc);
        lines.push(`SLIDE ${j + 1}: ${(VIEW_LABEL[v] || v).toUpperCase()}`);
        lines.push(...sb.say);
        if(sb.ask) lines.push(`ASK: ${sb.ask}`);
        if(sc.scenario) lines.push(`SCENARIO: ${sc.scenario}`);
      });
      lines.push("---");
    };
    // the daily loop (js/cm-day-loop.js): the notes in the deck's order: the lessons → the Case Profile → the one Skill
    // Building (Day 5, the build) → Update Your Action Plan → the optional side exercises
    const sch = daySchedule(d);
    if(sch.loop && window.cmDayLoop){
      const n = d.cf.n, mid = window.cmDayLoop.mainId(d), all = d.lessons.map((l, i) => [l, i]);
      d.cf.phases.forEach(ph => {
        const ls = all.filter(([l]) => l.cf.phase === ph && l.cf.block.kind === "lesson"); if(!ls.length) return;
        lines.push(`## ${ph.lead === "Case Phase" ? `Case Phase ${ph.n}` : ph.lead}: ${ph.title}`);
        ls.forEach(([l, i]) => block(l, i));
      });
      const profile = dayScript(d, "profile");
      if(n === 1 && !profile) lines.push("## Meet John Doe (the Case Profile)", "SLIDE: MEET JOHN DOE",
        "• The lessons are done: now meet the client, on his Case Profile, not on a slide",
        "• Open 📇 Case Profile → 👋 Meet John Doe on the shared screen and walk it: the collision, the team, who pays in order, the critical fact",
        "• Say the stack out loud in order, twice: BI, Host UM, Relative UM",
        "• Where he sat, who ran the stop and the gap's dates: they find them in the documents, at the Intake (the next slide, today's Skill Building)",
        "ASK: Which fact on his profile would you want confirmed by a document before your first call, and why?", "---");
      else if(profile) lines.push(n === 1 ? "## Meet John Doe (the Case Profile)" : "## Case Profile Check-In", ...dayScriptLines(profile, n === 1 ? "Meet John Doe" : "Case Profile Check-In"), "---");
      if(d.cf.build) [["build", "Full Application Practice: Build Your Companion Case"], ["build2", "Full Application Practice: the Second Half"]].forEach(([k, t]) => { const x = dayScript(d, k); if(x) lines.push(`## ${t}`, ...dayScriptLines(x, t), "---"); });
      all.filter(([l]) => l.cf.block.kind === "activity" && l.cf.block.id === mid).forEach(([l, i]) => { lines.push("## Skill Building"); block(l, i); });
      const plan = dayScript(d, "plan"), planT = n === 5 ? "Close Out Your Action Plan" : "Update Your Action Plan";
      if(plan) lines.push(`## ${planT}`, ...dayScriptLines(plan, planT), "---");
      const sides = all.filter(([l]) => l.cf.block.kind === "activity" && l.cf.block.id !== mid);
      if(sides.length){
        const x = d.cf.build ? dayScript(d, "extra") : lab, t = d.cf.build ? "Optional Extra Practice" : "Practice Lab: Optional Side Exercises";
        lines.push(`## ${t}`, ...(x ? dayScriptLines(x, t) : []), "---");
        sides.forEach(([l, i]) => block(l, i));
      }
    } else
    d.cf.phases.forEach(ph => {
      const ls = d.lessons.map((l, i) => [l, i]).filter(([l]) => l.cf.phase === ph); if(!ls.length) return;
      lines.push(`## ${ph.lead === "Case Phase" ? `Case Phase ${ph.n}` : ph.lead}: ${ph.title}`);
      ls.forEach(([l, i]) => {
        if(i === firstAct && d.cf.build) [["build", "Full Application Practice: Build Your Companion Case"], ["build2", "Full Application Practice: the Second Half"], ["extra", "Optional Extra Practice"]].forEach(([k, t]) => { const x = dayScript(d, k); if(x) lines.push(`## ${t}`, ...dayScriptLines(x, t), "---"); });   // the deck's order: the build, then John Doe's optional activities
        else if(lab && i === firstAct) lines.push("## Practice Lab", ...dayScriptLines(lab, "Practice Lab"), "---");
        lines.push(`## ${String(i + 1).padStart(2, "0")}. ${titleCase(l.cf.block.title)}  ·  ${slideLabel(d, i)}`);
        viewsOf(l.cf.block).forEach((v, j) => {
          const sc = slideScript(d, l, j + 1), sb = scriptBody(sc);
          lines.push(`SLIDE ${j + 1}: ${(VIEW_LABEL[v] || v).toUpperCase()}`);
          lines.push(...sb.say);
          if(sb.ask) lines.push(`ASK: ${sb.ask}`);
          if(sc.scenario) lines.push(`SCENARIO: ${sc.scenario}`);
        });
        lines.push("---");
      });
    });
    if(d.discussionQuestion && wrap) lines.push("## End-of-Day Discussion", `QUESTION: ${d.discussionQuestion}`, wrap.say, ...(wrap.ask ? [`ASK: ${wrap.ask}`] : []));
    else if(d.discussionQuestion){ lines.push("## End-of-Day Discussion"); lines.push(`SAY: “Before the Knowledge Check, let's step back and talk about this together.”`); lines.push(`ASK: “${d.discussionQuestion}”`); lines.push(`WRAP: “Thanks, everyone. Hold onto those examples: we'll pick John Doe's file up from here tomorrow.”`); }
    return lines;
  };
}

/* ---------- the day page: labels, and the next step after the Knowledge Check ---------- */
if(typeof renderDay === "function"){
  const __day = renderDay;
  renderDay = function(id){ const d = cfDay(id); const html = __day.apply(this, arguments); return d ? relabel(html, d) : html; };
}
/* The "+ N more topics" window names the day too ("Day 11 · 20 topics", "Start Day 11"): it is put on the page,
   not returned, so it is relabelled once it is there. */
if(typeof showDayTopics === "function"){
  const __topics = showDayTopics;
  showDayTopics = window.showDayTopics = function(id){
    const r = __topics.apply(this, arguments), d = cfDay(id);
    const ov = d && [...document.querySelectorAll(".topics-overlay")].pop();
    if(ov) ov.innerHTML = relabel(ov.innerHTML, d);   // the overlay's own listeners (click outside, Escape) are kept
    return r;
  };
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
      <button class="btn btn-primary" style="padding:13px 28px;" type="button" ${state.quizSubmitting ? "disabled" : ""} onclick="cmCaseFlow.kcSubmit(${d.id})">Submit &amp; continue to End of Module →</button></div>`;
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
    : (lastPassed ? `<button class="btn btn-primary" onclick="cmCaseFlow.finish()">🎓 Finish Training</button>` : "");   // the last day: the Congratulations slide
  return `<div class="card quiz-result cf-kc-result">
      <p class="cf-kcr-eyebrow">End of Module · Case Flow Day ${d.cf.n} · ${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</p>
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
      <button class="btn btn-primary" style="padding:13px 28px;" type="button" onclick="cmCaseFlow.kcContinue(${d.id})" title="Next: your key takeaway (if it isn't written yet), then the End of Module">Continue →</button></div>`;
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
  if(state.quizSubmitted){ w.style.zoom = ""; return; }   // the End of Module reads at full size: the page scrolls instead
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
      if(typeof callAIText === "function") text = String(await callAIText(`You are a senior personal-injury Case Manager helping a trainee colleague on a training quiz about the John Doe VS Robert Smith file. Give a nudge in at most two short sentences: name the principle, rule or fact on the file that decides the question. Never say which option is right, never quote or paraphrase any option, never use option letters, and never say "the answer is".\n\nQuestion: ${q.q}\nOptions:\n${q.opts.map(o => "- " + o).join("\n")}`, 120, undefined, "tracker") || "").trim();
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
      ${prog && prog.done ? `<span class="cf-kc-passed" title="Your best score is kept; you can retake it any time">✓ Passed · best ${E(prog.score)}%</span>` : ""}
      ${prog && prog.done && isLastCfDay(d) ? `<button type="button" class="btn cf-kc-finish" onclick="cmCaseFlow.finish()">🎓 Finish Training</button>` : ""}</div>`;
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
  tick(blockId, j, on){ REC.ticks = REC.ticks || {}; (REC.ticks[blockId] = REC.ticks[blockId] || [])[j] = !!on; (REC.tickAt = REC.tickAt || {})[blockId] = new Date().toISOString(); persist(); },   // tickAt: when, for the 📒 Progress Log
  kcDraft(modId, j, v){ rec(modId).kc[j] = v; clearTimeout(draftTimer); draftTimer = setTimeout(() => { persist(); status(modId, "Draft saved"); }, 900); },
  async save(modId){ const m = readForm(modId); m.savedAt = new Date().toISOString(); await persist(); status(modId, "Saved " + new Date(m.savedAt).toLocaleString()); },
  kcMod(modId){ const cur = document.querySelector(".cf-kc-mod"); if(cur) readForm(cur.dataset.mod); persist(); state.cfKcMod = modId; gamePaint(DAYS.find(x => x.id === state.dayId)); },
  kcBack(dayId){ const d = cfDay(dayId) || cfDay(state.dayId); state.dayViewMode = "slides"; state.lessonSlide = typeof resumeSlideFor === "function" ? resumeSlideFor(d.id) : 0; state.slidePage = 0; render(); },
  kcPart(part){ state.cfKcPart = part; state.cfKcDay = state.dayId; gamePaint(DAYS.find(x => x.id === state.dayId)); window.scrollTo({top: 0, behavior: "smooth"}); },
  // Continue after the quiz game: the key takeaway if it isn't written yet, else straight on to the End of Module
  kcContinue(dayId){ const d = cfDay(dayId); if(!d) return;
    if(kcMods(d).some(x => modMissing(x.b, x.mod.id))){ if(typeof toast === "function") toast("One last step: your key takeaway, then the End of Module."); return cmCaseFlow.kcPart("written"); }
    return cmCaseFlow.kcSubmit(dayId); },
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

/* Every Admin tab (the Trainee Audit, the SOP, Activities) names the days as on screen: Case Flow Day 1–5, never their ids */
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
    if(state.adminTab === "attendance") state.adminTab = "audit"; return adminPanel(relabelAll(__admin.apply(this, arguments)).replace("Knowledge Checks, Skill Builders and your day-by-day", "Knowledge Checks, Skill Activities and your day-by-day")); };   // (attendance is on the Main Portal now)
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
        return `<br>${t.sent ? "✓" : "…"} <b>${E(q.doc)}</b> ${t.sent ? `sent after ${E(t.tries || 0)} refused attempt${(t.tries || 0) === 1 ? "" : "s"}` : `not sent (${E(t.tries || 0)} refused)`}${(t.log || []).map((l, k) => ` · try ${k + 1}: ${l.short ? "too short" : E([].concat([].concat(l.tripped || []).map(id => "tripped " + id), [].concat(l.missing || []).length ? ["missing " + [].concat(l.missing).join(", ")] : []).join("; "))}`).join("")}${c ? ` · next step ${c.ok ? "right" : "wrong"}: “${E(c.label)}”` : ""}${f ? (f.filed ? ` · ${E(q.corrected)} filed as <code>${E(f.name)}</code>${f.attempts === 1 ? " (first time right)" : ` (${E(f.attempts)} attempts)`}` : ` · ${E(q.corrected)} not filed`) : ""}${t.body ? `<br><i>${E(t.body)}</i>` : ""}`; }).join("")}</div>`;
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

/* ---------- the Case Profile page: John Doe VS Robert Smith ----------
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
  // one card: the page's title and the client together (applyPageHero leaves an h1 that's already in a hero alone);
  // js/cm-case-profile.js draws the client and the claim's facts in it (cmCaseFlow.profileExt.head)
  const ext = window.cmCaseFlow.profileExt || {};
  return `<div class="cf-file-page"><section class="page-hero cf-file-hero">
      <div class="cf-file-head">
        <div class="cf-file-who"><p class="eyebrow">Case Profile</p><h1>📇 ${E(c.style)}</h1>
          ${ext.head ? ext.head() : `<div class="cf-client"><span class="cf-client-k">📌 Your Client</span><b>${E(c.client.name)}</b><span>Matter ${E(c.no)} · Lead Counsel ${E(c.counsel)}</span></div>`}</div>
      </div>
      <p class="cf-note">${isTrainer() ? `The whole file, as you know it: the key tabs are the answers, and trainees never see them.${DATES ? ` 📅 Case year ${E(DATES.year)} (collision ${E(DATES.dol())}); each trainee keeps the year they started on.${DATES.preview ? ` <b>Preview of ${E(DATES.year)}</b>: <a href="?caseYear=off">end it</a>.` : ""}` : ""}` : "Meet John Doe first, then follow your case in 📅 So Far. The file itself is in 📁 Case Documents, and the case you build is in the 🗂 CMS."}</p>${dolNote()}</section>
    ${fileTabs(shown, pos)}
</div>`;
}
/* The page in tabs: one screenful each, laid out across the width instead of down a long column.
   Everyone gets 📅 The Case So Far, and first the tabs js/cm-case-profile.js adds (👋 Meet John Doe); the fact tabs
   are the trainer's and are marked as such. */
function fileTabs(shown, pos){
  const own = (window.cmCaseFlow.profileExt || {}).tabs || [], mine = t => t.id === "now" || own.includes(t);
  const tabs = own.concat(CF_FILE_TABS.filter(t => t.id === "now" || shown.some(x => (x.group || "file") === t.id)));
  const cur = tabs.some(t => t.id === state.cfFileTab) ? state.cfFileTab : tabs[0].id, ownCur = own.find(t => t.id === cur);
  const secs = shown.filter(x => (x.group || "file") === cur);
  // the file's tabs (the trainer's) and, on the same line, the Case File | Documents switch
  const strip = `<div class="cf-file-tabs" role="tablist">
      ${tabs.length > 1 ? tabs.map(t => `<button type="button" role="tab" aria-selected="${t.id === cur}" title="${E(t.title)}${mine(t) ? "" : " — trainer only: trainees never see this tab"}" class="cf-file-tab${t.id === cur ? " on" : ""}${mine(t) ? "" : " key"}" onclick="cmCaseFlow.fileTab('${t.id}')">${E(t.label)}</button>`).join("") : ""}
      <div class="lsh-subtabs cf-docs-switch cf-file-switch"><button type="button" class="on" aria-selected="true">Case Profile</button><button type="button" onclick="goto('casedocs')">📁 Documents</button></div></div>`;
  return `<div class="cf-file-facts">${strip}
    ${ownCur ? ownCur.html() : cur === "now" ? caseTimeline(pos) : `<div class="cf-file-cols">${secs.map(x => `<div class="cf-file-sec"><h3>${E(x.title)}</h3><ul>${x.items.map(i => `<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}</div>`}</div>`;
}
/* the file's text at the largest size that still fits the screen (15px down to 11px) */
function fitFileCols(again){
  const c = document.querySelector(".cf-file-page .cf-file-cols"); if(!c) return;
  // and once more after the page around it has settled (the one-screen fit sizes it a frame later)
  if(!again){ requestAnimationFrame(() => fitFileCols(true)); clearTimeout(state.cfFileFitLate); state.cfFileFitLate = setTimeout(() => fitFileCols(true), 180); }
  let f = 15; c.style.fontSize = f + "px";
  while(c.scrollHeight > c.clientHeight + 1 && f > 11){ f -= 0.5; c.style.fontSize = f + "px"; }
}
window.addEventListener("resize", () => { clearTimeout(state.cfFileFitT); state.cfFileFitT = setTimeout(() => { try{ fitFileCols(true); }catch(e){} }, 120); });
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
    // two cards, the day's two parts in order: Part 1, 📘 Lessons (every section of them); Part 2, the 🧪 Practice Lab
    // (its Skill Building groups, each under the section of lessons it practises; on a build day the 🏗 build, then the
    // optional extra practice); then the 🎯 Knowledge Check
    const segs = daySegments(d), les = segs.filter(p => p.kind === "lesson"), pra = segs.filter(p => p.kind === "practice"), build = d.cf.build;
    const liL = p => `<li><span aria-hidden="true">📘</span> <strong>${E(p.title)}</strong> <small>${p.topics.length} lesson${p.topics.length === 1 ? "" : "s"}</small></li>`;
    // (one line a group, as the lessons beside it: the activities are named on the Practice Lab slide, each with its lesson)
    const liP = p => `<li title="${E(p.items.map(l => titleCase(l.cf.block.title)).join(" · "))}"><span aria-hidden="true">🧪</span> <strong>${E(p.title)}</strong> <small>${p.items.length} activit${p.items.length === 1 ? "y" : "ies"}</small></li>`;
    const nA = pra.reduce((a, p) => a + p.items.length, 0);
    // the daily loop (js/cm-day-loop.js): Part 2 is its steps, one under another, then the optional side exercises
    const sc = daySchedule(d), loop = sc.loop && window.cmDayLoop ? window.cmDayLoop.agendaRows(d, sc) : null;
    const loopPart = loop ? {name: loop.label, groups: [{title: "", html: loop.steps.map(t => { const m = String(t).match(/^(\S+)\s+(.*)$/) || ["", "", t]; return `<li><span aria-hidden="true">${m[1]}</span> <strong>${E(m[2])}</strong></li>`; }).join("")},
      loop.sides ? {title: `Optional side exercises (${loop.sides})`, html: `<li><span aria-hidden="true">🧪</span> ${build ? `${loop.sides} activities on John Doe's file, untimed` : `${loop.sides} short ones, each an assumption logged in the CMS${sc.sidePick && sc.sidePick < loop.sides ? `: choose about ${sc.sidePick}` : ""}`}</li>`} : null].filter(Boolean)} : null;
    const cols = [
      [{name: `Part 1 · 📘 Lessons (${les.reduce((a, p) => a + p.topics.length, 0)}, all together)`, groups: [{title: "", html: les.map(liL).join("")}]}],
      [loopPart ? loopPart : build ? {name: "Part 2 · 🏗 Full Application Practice", groups: [{title: "", html: `<li><span aria-hidden="true">🏗</span> <strong>Build Your Companion Case</strong></li><li><span aria-hidden="true">➕</span> Optional extra practice <small>${nA} activities on John Doe's file, untimed</small></li>`}]}
        : {name: `Part 2 · 🧪 Practice Lab (all ${nA} Skill Activities, in one place)`, groups: [{title: "", html: pra.map(liP).join("")}]},
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
  "ACTION PLAN · John Doe VS Robert Smith",
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
   the rest of the width and the height of the screen (its page scrolls inside); Download (PDF) sits at the bottom
   right. One note: the Action Plan (earlier notes still show, below it). */
if(typeof window.renderNotes === "function" && typeof window.renderNoteCard === "function"){
  window.renderNotes = function(){
    if(typeof ensureDefaultNote === "function") ensureDefaultNote();
    const r = state.cfReturn;
    const back = r ? `<button type="button" class="btn btn-ghost cf-notes-back" onclick="cmCaseFlow.back()">${r.view === "day" ? `← Back to Case Flow Day ${E(r.n)}` : "← Back to the Case Flow"}</button>` : "";
    const next = "";   // no "Next: …" here: the page leads back to the slide it was opened from, and Next is on the slide
    return `<div class="cf-notes">
      <section class="page-hero cf-notes-hero"><p class="eyebrow">Personal Workspace</p><h1>My Notes &amp; Action Plan</h1>
        <p>Your action plan, takeaways, and anything else worth keeping. It saves automatically, and <b>Review</b> gives quick feedback on quality, professionalism and compliance before you finalize anything.</p>${back}</section>
      <div class="cf-notes-main"><div id="notesList">${state.notes.map(n => renderNoteCard(n)).join("")}</div>
        <div class="cf-notes-foot"><button type="button" class="btn btn-ghost" onclick="cmCaseFlow.planTemplate()" title="Add the fill-in Action Plan template to your plan">📝 Use the template</button><button type="button" class="btn btn-ghost" onclick="downloadNotesPdf()">⬇ Download All Notes (PDF)</button>${next}</div></div></div>`;
  };
}

/* ---------- the case documents: John Doe VS Robert Smith (js/cm-case-flow-docs.js) ----------
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
/* Open, never download: a Word or Excel file opens in Office's online viewer, everything else in its own tab */
const openUrl = d => !/^RS\d\d$/.test(d.id) && /\.(docx|xlsx)$/i.test(d.file)
  ? "https://view.officeapps.live.com/op/view.aspx?src=" + encodeURIComponent(new URL(docUrl(d), location.href).href) : docUrl(d);
/* ☁️ Add to GDrive (Back up files): the Case Manager keeps an organized backup of the case file. The file goes to the
   trainee's Backup Drive (js/cm-drive.js through cmDocFiling.keepOnDrive) in the folder its kind belongs in. */
async function backupDoc(btn, id){
  const d = CF_DOCS.concat(window.CM_DOCS || []).find(x => x.id === id);
  if(!d || !window.cmDocFiling || !cmDocFiling.keepOnDrive) return toast("Back up isn't available here.");
  const label = btn.textContent; btn.disabled = true; btn.textContent = "Backing up…";
  try{
    const r = await fetch("documents/" + d.file.split("/").map(encodeURIComponent).join("/"));
    if(!r.ok) throw new Error(r.status);
    // 🏷 Named the firm's way, like every file on the drive: the name it was filed under in the CMS if it is filed, or else
    // the convention filled in (the Worker's pattern, js/cm-drive.js) with the Case ID, its CMS category as the Type and today.
    const filed = cmDocFiling.record && cmDocFiling.record(d.id), ext = (/\.([A-Za-z0-9]{1,8})$/.exec(d.file) || [])[1] || "pdf";
    const name = (filed && filed.filed && filed.name) || (window.CMDrive && CMDrive.nameFor ? CMDrive.nameFor({category: cmDocFiling.expectedCategory(d), ext}) : "");
    if(!name){
      // why no name could be made: the drive isn't there, the firm's naming rule hasn't loaded, or (the rule here) no Case ID yet
      const st = window.CMDrive && CMDrive.status ? CMDrive.status() : null, ruled = !!(window.CMDrive && CMDrive.naming && CMDrive.naming());
      toast(!st || !st.configured || !st.connected || !st.built ? "Your Backup Drive isn't set up yet. Link it, then try again."
        : !ruled ? "The firm's naming convention hasn't loaded yet. Open 📂 My Backup Drive, then try again."
        : "Open your case in the CMS first (🗂 Open CMS): the backup copy is named with its Case ID, the firm's way.");
      return; }
    const out = await cmDocFiling.keepOnDrive(d.folder, name, await r.arrayBuffer(), d.id);
    if(out && out.ok){ btn.textContent = "✓ In GDrive"; toast(`Backed up to your Drive under ${String(out.folder).split("/").pop()} as ${name}.`); return; }
    toast(out && out.why === "no-drive" ? "Your Backup Drive isn't set up yet. Link it, then try again." : "The backup didn't reach your Drive. Try again.");
  }catch(e){ toast("The backup didn't reach your Drive. Check your connection and try again."); }
  finally{ btn.disabled = false; if(btn.textContent === "Backing up…") btn.textContent = label; }
}
window.cmCaseFlow = Object.assign(window.cmCaseFlow || {}, {backup: backupDoc});
function docLine(blockId){
  const all = (CF_PACKETS[blockId] || []).map(id => CF_DOCS.find(d => d.id === id)).filter(Boolean), docs = all.filter(docAvail), held = all.length - docs.length;
  if(!docs.length) return "";
  return `<div class="cf-docline"><b>📁 Work from</b>${docs.map(d => `<a href="${E(docUrl(d))}" target="_blank" rel="noopener" title="${E(d.desc)}" onclick="return cmCaseFlow.doc(event,'${d.id}')">${E(d.title)}</a>`).join("")}${held ? `<span class="cf-note">🔒 ${held} corrected cop${held === 1 ? "y opens" : "ies open"} once your trainer unlocks ${held === 1 ? "it" : "them"} (after your Amendment Requests in Pre-Demand Case Auditing are answered).</span>` : ""}</div>`;
}
const docOpen = d => !!(state.isAdmin || state.adminPreview) || (dayUnlocked(cfIdOf(d.day)) && docAvail(d));
function caseFlowDocuments(){
  const shown = CF_DOCS.filter(docOpen), locked = CF_DOCS.filter(d => !docOpen(d));
  const tpl = (window.CM_DOCS || []).filter(d => d.folder === "templates");
  const row = d => `<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span> <span style="font-size:11px;color:var(--ink-soft)">· ${d.folder === "templates" ? "Any day" : "Case Flow Day " + d.day}</span><div class="d">${E(d.desc)}</div>${state.isAdmin && d.key ? `<div class="cm-key">🔑 ${E(d.key)}</div>` : ""}</div>
      <div style="display:flex;gap:6px;align-items:center"><span class="cms">CMS: ${E(d.cms)}</span><a class="btn btn-ghost btn-sm" href="${E(openUrl(d))}" target="_blank" rel="noopener"${/^RS\d\d$/.test(d.id) ? ` onclick="return cmCaseFlow.doc(event,'${d.id}')"` : ""}>Open</a><button type="button" class="btn btn-ghost btn-sm" title="Back up this file to your Google Drive, in its case folder, named by the firm's naming convention" onclick="cmCaseFlow.backup(this,'${E(d.id)}')">☁️ Add to GDrive</button></div></div>`;
  const heldBy = d => dayUnlocked(cfIdOf(d.day)) && !docAvail(d);   // open by its day, waiting for the trainer to unlock it
  const folders = CF_FOLDERS.map(fo => ({fo, items: shown.filter(d => d.folder === fo.id), later: locked.filter(d => d.folder === fo.id && !heldBy(d)).length, held: locked.filter(d => d.folder === fo.id && heldBy(d)).length})).filter(x => x.items.length || x.later || x.held);
  return `<p class="eyebrow">Case Documents</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📁 Case Documents: ${E(CF.case.style)}</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 14px">The working file for John Doe VS Robert Smith: intake, police and video, Medical Records and bills, the carriers' policies and letters, liens, the Civic's Property Damage, and (Track B) the lawsuit. Each document opens with its Case Flow day, and each Skill Activity lists the ones it works from. Each shows the <b>CMS upload category</b> to use when you add it to the case in the CMS. Read them the way a Case Manager does: verify every fact against its source, and flag what doesn't match.</p>
    <div class="cf-docs-switch-row"><div class="lsh-subtabs cf-docs-switch" role="tablist"><button type="button" role="tab" onclick="goto('clientprofile')">Case Profile</button><button type="button" role="tab" class="on" aria-selected="true">📁 Documents</button></div></div>
    ${state.isAdmin ? `<div class="card" style="padding:12px 16px;margin-bottom:16px;border-left:4px solid var(--danger);font-size:12.8px">🔑 <b>Trainer view:</b> the red notes under each document are the audit key: planted discrepancies and what a strong trainee should catch. Trainees don't see them. Every document's plants are listed in build/case-flow/documents/SPEC.md.</div>` : ""}
    ${folders.map(({fo, items, later, held}) => `<div class="card cm-lib-folder" style="padding:14px 18px"><h3>${fo.icon} ${E(fo.label)} <span style="font-weight:500;color:var(--ink-soft);font-size:12px">(${items.length})</span></h3>
      ${items.map(row).join("")}${later ? `<div class="cf-note">🔒 ${later} more open with later Case Flow days.</div>` : ""}${held ? `<div class="cf-note">🔒 ${held} corrected cop${held === 1 ? "y opens" : "ies open"} once your trainer unlocks ${held === 1 ? "it" : "them"} (send your Amendment Request first: Pre-Demand Case Auditing → 📝 Amendment Requests).</div>` : ""}</div>`).join("")}
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
    // one screen: every activity a compact tile (its topic, title, tool and documents; the output on hover), in a grid
    // the daily loop (js/cm-day-loop.js): the day's one Skill Building marked 🎯, every other activity an optional side exercise
    const mid = window.cmDayLoop && window.cmDayLoop.mainId ? window.cmDayLoop.mainId(d) : "";
    const mods = groups.map(({title, acts}, gi) => acts.map(({b, li}) => {
      const tool = String(b.act.tool || "").split("·")[0].split("→")[0].trim(), docs = (CF_PACKETS[b.id] || []).length;
      const tag = mid ? (b.id === mid ? `<span class="cf-px-loop cf-px-main">🎯 Skill Building</span>` : `<span class="cf-px-loop">Optional side exercise</span>`) : "";
      return `<div class="cf-px-tile${mid && b.id === mid ? " cf-px-tile-main" : ""}${open ? "" : " locked"}"${open ? ` role="button" tabindex="0" onclick="cmCaseFlow.openBlock(${d.id},${li})" onkeydown="if(event.key==='Enter')cmCaseFlow.openBlock(${d.id},${li})"` : ""} title="${E("Deliver: " + b.act.output)}">
          <span class="cf-px-k">${d.cf.n}.${gi + 1} · ${E(title)}${SIM.calls[b.id] ? " · 📞" : ""}</span>
          <b>${E(b.title)}</b>${tag}
          <span class="cf-px-m"><span>🛠 ${E(tool)}</span>${docs ? `<span>📁 ${docs}</span>` : ""}${!isTrainer() && actDone(b.id) ? `<span class="ok">✓ Worked</span>` : ""}<span class="go">${open ? "Open →" : "🔒"}</span></span>
        </div>`; }).join("")).join("");
    return `<div class="card px-day cf-px-day"><div class="cf-px-dh"><h2>Day ${d.cf.n} · ${E(day.phase)}${open ? "" : " · 🔒"}${day.track ? ` <span class="cf-px-track">${E(day.track)}</span>` : ""}</h2>
        <span class="cf-px-prog">${kcDone(d) ? "Knowledge Check passed ✓" : open ? "In progress" : "Opens when the day before is passed"}</span></div>
      ${sessionTools ? `<div class="cf-px-tools" title="Each opens on the first activity of the day that is worked in it. Every step's own tools are on its slide."><b>🛠 Tools</b><div class="cf-px-toolrow">${sessionTools}</div></div>` : ""}
      <div class="cf-px-grid">${mods}</div></div>`;
  }).join("");
  const any = [
    `<button class="btn btn-ghost btn-sm" onclick="goto('casedocs')">📁 Case Documents</button>`,
    typeof rpLaunchQuickPractice === "function" ? `<button class="btn btn-ghost btn-sm" onclick="rpLaunchQuickPractice()">🎲 Quick roleplay call</button>` : "",
    typeof openTool === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openTool('cms',null,'library=1')">📚 CMS Training Library</button>` : "",
    typeof openCms === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 Open the CMS</button>` : ""].join("");
  // one screen: a single header line, the day tabs, then the day's tiles; the any-day links ride in the header
  return `<div class="cf-px-page"><div class="cf-px-head"><h1>🧪 Practice <span>The Case Flow Skill Activities, on ${E(CF.case.style)}: each opens on its slide.</span></h1><div class="cf-px-any">${any}</div></div>
    ${tabs}
    ${days}</div>
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
/* the End of Module (the results): the screen's width, solid and high-contrast */
main:has(.cf-kc-result){max-width:min(2200px, 98vw) !important;}
.card.cf-kc-result{background:#fff !important;border:2px solid #262B45 !important;box-shadow:0 10px 30px -18px rgba(20,24,40,.5) !important;color:#141A2E;padding:22px 26px !important;}
.cf-kcr-eyebrow{margin:0 0 10px;font:800 13px 'Inter',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#fff;background:#262B45;display:inline-block;padding:6px 14px;border-radius:8px;}
.cf-kc-result .sub{color:#2E3450 !important;font-weight:600;font-size:15px !important;}
.cf-kc-result .quiz-next-step, .cf-kc-result .quiz-next-step *{font-size:14.5px !important;line-height:1.5;color:#141A2E;} .cf-kc-result .cf-kcr-btns .btn{font-size:14px;padding:8px 14px;}
.cf-kcr-top{display:grid;grid-template-columns:minmax(0,.9fr) minmax(0,1.1fr);gap:18px;align-items:center;}
.cf-kcr-score{display:flex;align-items:center;gap:14px;}
.cf-kcr-take{display:flex;flex-direction:column;align-items:flex-start;margin-left:18px;padding:8px 14px;border-left:3px solid #DB8437;background:rgba(219,132,55,.08);border-radius:0 10px 10px 0;}
.cf-kcr-take b{font-size:26px;line-height:1.1;color:#132A5C;}.cf-kcr-take span{font-weight:800;font-size:13px;color:#132A5C;}.cf-kcr-take small{font-size:11.5px;color:var(--ink-soft);}.cf-kcr-score .big{font-size:30px !important;margin:0 !important;}.cf-kcr-score .sub{margin-top:2px;}
.cf-kcr-next .quiz-next-step{margin:0 !important;text-align:left;}
.cf-kcr-mods{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:8px;margin:14px 0 10px;}
.cf-kcr-mod{background:#EEF1F8;border:1px solid #AEB6C6;border-radius:10px;padding:10px 14px;font-size:14px;color:#141A2E;}
.cf-kcr-mod > b{display:block;color:#141A2E;margin-bottom:4px;font-size:15px;line-height:1.3;}
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
/* 💡 Why it matters, the line that opens The Theory (the lesson's Why It Matters slide, merged into it) */
.cfx .cfx-whyline{display:flex;align-items:center;gap:14px;margin:0;padding:6px 16px;background:#1E2340;border-left:8px solid #DB8437;border-radius:12px;text-align:left !important;flex:none;}
.cfx .cfx-whyline-k{flex:none;font:800 16px/1.3 var(--font-ui);letter-spacing:.06em;text-transform:uppercase;color:#1E2340;background:#DB8437;border-radius:999px;padding:4px 14px;white-space:nowrap;}
.cfx .cfx-whyline-t{font:800 clamp(21px,2.8vh,26px)/1.3 var(--font-ui);color:#fff;text-align:left !important;}
.cfx .cfx-whyline mark.cfx-hl{background:none;color:#FFC98F;padding:0;font-weight:800;}
/* The Theory with its merged roadmap and the opening line: the roadmap's steps down the left, the lead and the
   concept cards beside them, every line bold and at least 16px on a laptop (the row of steps across the top left the
   cards no room) */
.cfx-th-solo.cfx-th-why.cfx-th-road > .cfx-th-main{gap:8px;}
.cfx-th-solo.cfx-th-road .cfx-th-cols{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(0,.35fr) minmax(0,.65fr);gap:0 18px;align-items:stretch;}
.cfx .cfx-th-road .cfx-map-strip{display:flex;flex-direction:column;justify-content:space-around;gap:3px;margin:0;padding:0 16px 0 0;border-bottom:0;border-right:2px dashed #E3B98A;}
.cfx .cfx-th-road .cfx-map-strip li{grid-template-columns:30px minmax(0,1fr);column-gap:10px;margin:0 !important;}
.cfx .cfx-th-road .cfx-map-strip .cfx-fw-n{width:30px;height:30px;font-size:16px;font-weight:800;}
.cfx .cfx-th-road .cfx-map-strip b{font:800 clamp(16.5px,2.2vh,23px)/1.2 var(--font-ui);color:#1E2340;}
.cfx .cfx-th-road .cfx-map-strip li > span:last-child{font:700 clamp(16px,2.1vh,22px)/1.22 var(--font-ui);color:#141A2E;}
.cfx .cfx-th-road .cfx-map-strip mark.cfx-hl{font-weight:800;}
.cfx-th-solo.cfx-th-road .cfx-th-side{min-width:0;min-height:0;display:flex;flex-direction:column;gap:6px;}
.cfx .cfx-th-road .cfx-th-lead{font-size:clamp(19px,2.6vh,26px);line-height:1.25;text-align:left;margin:0;}
.cfx-th-solo.cfx-th-road .cfx-th-grid{gap:6px 12px;}
.cfx .cfx-th-solo.cfx-th-road .cfx-th-c{padding:clamp(5px,.8vh,16px) 14px;gap:2px;}
.cfx .cfx-th-solo.cfx-th-road .cfx-th-c b{font-size:clamp(17.5px,2.4vh,24px);line-height:1.15;}
.cfx .cfx-th-solo.cfx-th-road .cfx-th-c span{font-size:clamp(17px,2.3vh,23px);line-height:1.25;}
@media (max-width:900px){ .cfx-th-solo.cfx-th-road .cfx-th-cols{grid-template-columns:minmax(0,1fr);gap:10px;} .cfx .cfx-th-road .cfx-map-strip{border-right:0;padding:0;} }
/* the band takes its height from the slide's spacing, never from the theory's type or its cards */
.cfx-th-solo.cfx-th-why > .cfx-th-main{gap:10px;} .cfx .cfx-th-why .cfx-th-lead{margin-bottom:0;} .cfx-th-solo.cfx-th-why .cfx-th-grid{gap:10px 14px;}
/* the case strip that sat on Why It Matters: under the theory's cards on a screen with room for it (a large screen, the
   shared slides window), not on a laptop, where the slide is full */
.cfx .cfx-th-why .cf-strip{display:none;margin:0;justify-content:center;flex:none;}
@media (min-width:1500px) and (min-height:940px){ #lessonStage .cfx-th-why .cf-strip, #audienceRoot .cfx-th-why .cf-strip{display:flex;} }
.cfx .cfx-th-why .cf-strip .cf-anchor{font-size:18px !important;font-weight:800;} .cfx .cfx-th-why .cf-strip .cf-anchor b{font-size:16px !important;font-weight:800;}
/* ＋ More on a concept card: bold and 16px like the rest of the slide, the card's title kept clear of it */
.cfx .cfx-th-c .cfx-th-more{font:800 16px/1.5 var(--font-ui);padding:1px 12px;} .cfx .cfx-th-c:has(> .cfx-th-more) > b{padding-right:96px;}
/* the CM Red Flag beside the points on The Rules (in the picture's place), and under the Do & Don't */
.cfx-lesson .cfx-split-rf{grid-template-columns:minmax(0,1fr) minmax(0,1fr) !important;justify-content:stretch !important;align-items:center !important;column-gap:24px !important;}
.cfx .cfx-split-rf .cfx-rf{margin:0;} .cfx .cfx-dd + .cfx-rf{margin-top:14px;} .cfx .cfx-split + .cfx-rf{margin-top:6px;}
/* the copy's "tight": four two-line points beside the Red Flag, at the size they take beside a Rule vs. Exception box */
.cfx .cfx-split-tight .cfx-points{gap:8px;} .cfx .cfx-split-tight .cfx-points li,.cfx .cfx-split-tight .cfx-points li span{font-size:clamp(18px,2.4vh,22px) !important;line-height:1.32 !important;}
/* the Red Flag under See It, The Framework or The Roadmap (the copy's "on") */
.cfx .cfx-model + .cfx-rf,.cfx .cfx-fw + .cfx-rf{margin-top:10px;}
.cfx .cfx-rf ~ .cfx-upl,.cfx .cfx-rf ~ .cfx-plain,.cfx .cfx-split-rf ~ .cfx-upl,.cfx .cfx-split-rf ~ .cfx-plain{margin-top:10px;}
.cfx-th-solo.cfx-th-rf > .cfx-th-main{gap:10px;} .cfx-th-solo.cfx-th-rf .cfx-th-grid{gap:10px 14px;} .cfx .cfx-th-rf .cfx-rf{margin:0;flex:none;} .cfx .cfx-th-rf .cfx-th-cont{margin-bottom:4px !important;}
@media (max-width:760px){ .cfx .cfx-whyline{flex-wrap:wrap;gap:4px 10px;} .cfx-lesson .cfx-split-rf{grid-template-columns:minmax(0,1fr) !important;} }   /* a phone: the label above its line, the Red Flag under the points */
.cfx-lab-lead{font:500 16px/1.45 var(--font-ui);color:var(--ink);margin:0 0 10px;text-align:left;}
.cfx-lab-tools{display:flex;flex-wrap:wrap;gap:8px;margin:0 0 12px;}
.cfx-lab-tools[hidden]{display:none;}
.cfx-lab-gate{border:2px solid #E3A867;background:#FFF6EA;border-radius:12px;padding:16px 20px;margin:0 0 12px;font:500 18px/1.5 var(--font-ui);color:#1F2433;text-align:left;}
.cfx-lab-gate.passed{border-color:#9CD3B0;background:#F1FAF4;}
.cfx-lab-gate.passed .cfx-lab-q{display:none;}
.cfx-lab-gate.passed::after{content:" ✓ Ready: today's tools are open.";color:#2E7D4F;}
.cfx-ready .cfx-lab-gate.passed::after{content:none;}   /* the Ready check says its own line (✓ All right. Next: the Knowledge Check): the tools line belonged to a gate on the Practice Lab slide */
.cfx-lab-q{margin-top:14px;font-weight:600;}
.cfx-lab-q .o{display:flex;flex-wrap:wrap;gap:8px;margin-top:8px;}
.cfx-lab-q .o button{font:600 16.5px/1.35 var(--font-ui);color:#1F2433;border:2px solid #AEB6C6;background:#fff;border-radius:9px;padding:9px 14px;cursor:pointer;text-align:left;} .cfx-lab-q .o button:hover{border-color:#262B45;background:#F3F4F8;}
.cfx-lab-q .o button.ok{background:#E3F4E8;border-color:#3E9A5E;}
.cfx-lab-q .o button.no{background:#FDECEC;border-color:#C9473F;}
.cfx-lab-q .r{font-size:15.5px;color:#3C4258;margin-top:6px;font-weight:500;}
.cfx-lab-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:1fr 1fr;gap:6px 10px;text-align:left;}
.cfx-lab-list > li{padding:0 !important;margin:0 !important;}
.cfx-lab-list > li::before, .cfx-lab-list > li::after{content:none !important;display:none !important;}
.cfx-lab-list button{display:flex;align-items:center;gap:8px;width:100%;background:#F7F8FC;border:1px solid #DDE2EE;border-radius:10px;padding:6px 10px;font:600 13.5px/1.25 var(--font-ui);color:var(--ink);cursor:pointer;text-align:left;}
.cfx-lab-list button:hover{border-color:#2457C5;background:#EEF4FF;}
.cfx-lab-list .n{flex:none;width:22px;height:22px;border-radius:50%;background:var(--navy);color:#fff;font:800 12px/22px var(--font-ui);text-align:center;}
.cfx-lab-list .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cfx-lab-list .ok{color:#1E8A4C;font-weight:800;}
/* the Practice Lab's list: each activity with the lesson it practises under it, bold and at least 16px, at full size on a laptop
   (two columns; three when a day has more than ten activities) */
.cfx-lab .cfx-lab-tools{gap:6px;margin:0 0 10px;align-items:center;} .cfx-lab .cfx-lab-tools .btn{font:700 16px/1.25 var(--font-ui) !important;padding:6px 11px !important;min-height:0 !important;height:auto !important;}
.cfx-lab-k{font:800 16px/1.25 var(--font-ui);color:#1E2340;margin-right:4px;}
.cfx-lab-of{gap:4px 10px;grid-template-columns:repeat(2,minmax(0,1fr));}
.cfx-lab-of button{align-items:center;padding:2px 10px;font:700 16px/1.2 var(--font-ui);color:#1E2340;border:1.5px solid #C9CFDD;}
.cfx-lab-of button:hover{border-color:#DB8437;background:#FFF6EA;}
.cfx-lab-of .n{width:26px;height:26px;background:#1E2340;font:800 16px/26px var(--font-ui);}
.cfx-lab-of .tt{flex:1;min-width:0;display:block;}
.cfx-lab .cfx-lab-of li > button .t{display:block;font-size:16px !important;font-weight:700;letter-spacing:-.4px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cfx-lab-of .of{display:block;font:700 16px/1.2 var(--font-ui);color:#A4470F;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cfx-lab-of .c{flex:none;font-size:18px;}
.cfx-do-now{display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;background:#EEF4FF;border:1.5px solid #9DB6E8;border-left:6px solid #2457C5;border-radius:12px;padding:10px 16px;margin:0 0 12px;text-align:left;}
.cfx-do-now b{font:800 16px var(--font-ui);color:#1C3F8F;} .cfx-do-now b.cfx-of{margin-left:auto;color:#A4470F;white-space:nowrap;} .cfx .cfx-of-row{margin:4px 0 0;text-align:left;} .cfx .cfx-of-row .cfx-of{font:800 16px/1.3 var(--font-ui);color:#A4470F;} .cfx .cfx-do-now .cfx-plan-go{font:700 16px/1.2 var(--font-ui) !important;padding:2px 12px !important;min-height:0 !important;height:auto !important;align-self:center;}   /* the lesson this activity practises, at the end of the Practice Lab line */ .cfx-do-now span{font:500 15.5px/1.45 var(--font-ui);color:var(--ink);}
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
.cfx-hero-text,.cfx-dd,.cfx-check,.cfx-side,.cfx-upl,.cfx-watch{text-align:left;}
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
.cfx-np[role=button]{cursor:pointer;transition:box-shadow .15s ease,transform .15s ease;}.cfx-np[role=button]:hover,.cfx-np[role=button]:focus-visible{box-shadow:0 6px 18px rgba(0,0,0,.18);transform:translateY(-1px);outline:none;}
.cfx-np>b{font:800 17px var(--font-ui);color:var(--navy);}
.cfx-np-k{font:500 14.5px/1.35 var(--font-ui);color:var(--ink-soft);}
.cfx-np ol{margin:2px 0;padding:0;list-style:none;display:grid;gap:3px;justify-items:start;text-align:left;font:600 15px/1.35 var(--font-ui);color:var(--ink);}
.cfx-np li{display:block;text-align:left;margin:0;padding:0;position:static;list-style:none;}
.cfx-np li::before{content:none !important;display:none !important;}
.cfx-np li.ok{color:#1d5c3a;}
.cfx-np-r{display:flex;flex-wrap:wrap;gap:10px;align-items:center;margin-top:4px;}
.cfx-np-r small{color:var(--ink-soft);font-size:13px;}
.np-grade{margin-top:8px;border:2px solid #C9D1E6;background:#F4F6FB;border-radius:10px;padding:8px 12px;font:600 15px/1.45 var(--font-ui);color:#1E2340;}
.np-grade > b{display:block;font-weight:800;font-size:16px;color:#1E2340;} .np-grade > span{display:block;color:#2E3450;}
.np-tries{margin:6px 0 0;padding-left:20px;font-size:15px;font-weight:600;} .np-tries b{color:#1E2340;} .np-tries em{color:#B5651F;font-style:normal;font-weight:800;}
.np-grade .sv-row{margin-top:6px;}
.np-key{margin-top:8px;border:1px solid #BFE3CE;background:#F3F9F5;border-radius:10px;padding:8px 12px;}
.np-key p{margin:4px 0;font-style:italic;}
.np-key ul,.np-key ol{margin:4px 0 0;padding-left:20px;display:grid;gap:4px;}
.np-key li.ok{color:#1d5c3a;} .np-key li.miss{color:#A2410F;}
.cf-kc-finish{margin-left:auto;background:#1F7A4A;color:#fff;border:0;border-radius:999px;padding:8px 18px;font:800 14px 'Inter',sans-serif;box-shadow:0 4px 12px rgba(31,122,74,.35);}
.cf-kc-finish:hover{background:#17603A;}
.cfx-close{display:flex;flex-direction:column;align-items:center;gap:14px;text-align:center;}
.cfx-close-burst{display:flex;gap:22px;font-size:64px;line-height:1;}
.cfx-close-burst span{display:inline-block;animation:cfxPop 1.6s ease-in-out infinite alternate;}
.cfx-close-burst span:nth-child(2){animation-delay:.3s;font-size:78px;} .cfx-close-burst span:nth-child(3){animation-delay:.6s;}
@keyframes cfxPop{from{transform:translateY(0) rotate(-6deg);}to{transform:translateY(-8px) rotate(6deg);}}
@media(prefers-reduced-motion:reduce){.cfx-close-burst span{animation:none;}}
.cfx-close-cheer{margin:0;font:800 34px/1.1 'Poppins','Inter',sans-serif;color:#262B45;}
.cfx-thanks{max-width:820px;background:#FFF8EC;border:4px solid #DB8437;border-radius:18px;padding:22px 30px;box-shadow:0 12px 28px rgba(219,132,55,.28);}
.cfx-thanks p{margin:0 0 10px;font:700 18px/1.5 'Inter',sans-serif;color:#1F2433;}
.cfx-thanks .cfx-thanks-h{font:800 44px/1.1 'Fraunces',Georgia,serif;color:#B5651F;margin-bottom:12px;}
.cfx-thanks .cfx-thanks-sig{margin:0;font-weight:700;} .cfx-thanks .cfx-thanks-sig span{font-family:'Fraunces',Georgia,serif;font-style:italic;font-size:21px;color:#262B45;}
.cfx-close-next{margin:0;text-align:center;font:700 14px 'Inter',sans-serif;color:#262B45;}
.cfx-dd > div{border-radius:16px;padding:16px 20px;animation:cfxIn .3s ease-out both;}
.cfx-do{background:#EEF8F2;border:1.5px solid #BFE3CE;}
.cfx-dont{background:#FFF6EC;border:1.5px solid #F3D2B3;animation-delay:.1s !important;}
.cfx-dd h3{margin:0 0 10px;font:700 22px 'Fraunces',Georgia,serif;color:var(--navy);}
.cfx-dd ul{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px;}
.cfx-dd li{font:500 21px/1.4 var(--font-ui);color:var(--ink);}
/* The Theory: the deck's lead line, its concepts as cards, the original deck pages beside them */
.cfx-deckpage{margin:0;flex:1 1 auto;min-height:0;display:flex;align-items:center;justify-content:center;height:100%;}
.cfx-deckpage img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;aspect-ratio:16/9;object-fit:contain;border-radius:10px;box-shadow:0 2px 14px rgba(30,35,64,.22);}
.cfx-ref-host{position:relative;}
/* 📖 Reference: in the block's title band, on every slide of the block (the room's shared window doesn't show it) */
.cfx-ribbon.cfx-ribbon-ref,.cfx-deck > .cfx-ribbon.cfx-ribbon-ref{display:flex !important;align-items:stretch;gap:8px;}
.cfx-ribbon.cfx-ribbon-ref > span{flex:1 1 auto;min-width:0;}
.cfx-ref-open{flex:0 0 auto;font:800 16px/1 'Inter',sans-serif;padding:0 14px;border-radius:6px;border:2px solid #DB8437;background:#fff;color:#1E2340;cursor:pointer;white-space:nowrap;}
.cfx-ref-open:hover,.cfx-ref-open:focus-visible{background:#DB8437;color:#fff;outline:none;}
.cfx-ref{position:absolute;inset:0;z-index:30;display:flex;flex-direction:column;background:#fff;border:3px solid #1E2340;border-radius:14px;box-shadow:0 10px 34px rgba(30,35,64,.35);overflow:hidden;animation:cfxRefIn .18s ease-out;}
.cfx-ref.cfx-ref-float{position:fixed;inset:6vh 4vw;z-index:4000;}
@keyframes cfxRefIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:none}}
.cfx-ref-h{display:flex;align-items:center;gap:12px;padding:10px 16px;background:#1E2340;color:#fff;border-bottom:3px solid #DB8437;flex:0 0 auto;}
.cfx-ref-h b{flex:1;font:800 18px/1.3 'Poppins','Inter',sans-serif;min-width:0;}
.cfx-ref-h b span{color:#F6C08F;margin-left:8px;font-size:16px;}
.cfx-ref-x{font:800 16px/1 'Inter',sans-serif;padding:9px 14px;border-radius:999px;border:2px solid #fff;background:#DB8437;color:#fff;cursor:pointer;white-space:nowrap;}
.cfx-ref-x:hover,.cfx-ref-x:focus-visible{background:#fff;color:#1E2340;outline:none;}
.cfx-ref-b{flex:1 1 auto;min-height:0;overflow-y:auto;padding:16px 22px 22px;font-size:16px;font-weight:600;}
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
.cfx-fw-flow li,.cfx-fw-list > div{position:relative;}
.cfx-th-more{position:absolute;top:6px;right:8px;border:1px solid #F0D2AE;background:#FBF1E6;color:#B5561A;border-radius:999px;padding:1px 9px;font:700 12px/1.6 var(--font-ui);cursor:pointer;}
.cfx-th-more:hover,.cfx-th-more:focus-visible{background:var(--orange);border-color:var(--orange);color:#fff;outline:none;}
.cfx-more{align-items:center;}
.cfx-inject{margin-left:auto;margin-right:8px;padding:5px 12px;border-radius:999px;border:0;background:linear-gradient(135deg,#C0392B,#DB8437);color:#fff;font:800 12.5px var(--font-ui);cursor:pointer;max-width:42%;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;box-shadow:0 0 0 0 rgba(219,132,55,.7);animation:cfxInject 1.8s ease-out infinite;}
.cfx-inject + .cfx-full{margin-left:0;}
@keyframes cfxInject{0%{box-shadow:0 0 0 0 rgba(219,132,55,.7);}70%{box-shadow:0 0 0 10px rgba(219,132,55,0);}100%{box-shadow:0 0 0 0 rgba(219,132,55,0);}}
@media(prefers-reduced-motion:reduce){.cfx-inject{animation:none;}}
.cfx-inject-m ul li{margin-bottom:6px;}
.pv-inject{margin:0 0 12px;padding:10px 12px;border-radius:10px;background:#FDF0E6;border:2px solid #DB8437;}
.pv-inject > b{display:block;color:#8E2A2A;font-size:14px;}.pv-inject > span{display:block;font-size:12px;color:var(--ink-soft);margin:2px 0 4px;}
.pv-inject ul{margin:0;padding-left:18px;}
.cfx-ringrow{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin-top:10px;}.cfx-ringrow small{font:600 12.5px var(--font-ui);color:#3C4258;}
.cf-ring{position:fixed;inset:0;z-index:2147483000;background:rgba(15,20,40,.72);display:flex;align-items:center;justify-content:center;padding:16px;}
.cf-ring-box{background:#1E2340;color:#fff;border-radius:22px;padding:26px 30px;max-width:440px;width:100%;text-align:center;border-top:6px solid #DB8437;box-shadow:0 20px 60px rgba(0,0,0,.45);}
.cf-ring-ic{font-size:46px;animation:cfRing 1s ease-in-out infinite;} .cf-ring-k{margin:6px 0 0;font:800 12.5px var(--font-ui);letter-spacing:.1em;text-transform:uppercase;color:#F6C08F;}
.cf-ring-box h3{margin:6px 0;font:800 26px 'Poppins',var(--font-ui);color:#fff;} .cf-ring-on{margin:0 0 16px;font:600 15px var(--font-ui);color:#E3E7F1;}
.cf-ring-btns{display:flex;gap:12px;justify-content:center;margin-bottom:10px;} .cf-ring-btns .btn{flex:1;padding:12px;font:800 16px var(--font-ui);border:0;border-radius:999px;color:#fff;}
.cf-ring-no{background:#C0392B;} .cf-ring-yes{background:#1E8E4F;} .cf-ring-box small{font:600 12.5px var(--font-ui);color:#C9CEDC;}
@keyframes cfRing{0%,100%{transform:rotate(0)}20%{transform:rotate(-14deg)}40%{transform:rotate(14deg)}60%{transform:rotate(-10deg)}80%{transform:rotate(10deg)}}
@media(prefers-reduced-motion:reduce){.cf-ring-ic{animation:none;}}.pv-inject li{font-size:13.5px;margin:4px 0;}
.pv-more{margin:14px 0 0;padding:10px 12px;border:1px dashed #DB8437;border-radius:10px;background:#FFF6EC;}
.pv-more b{display:block;font-size:13px;color:var(--navy);}.pv-more span{display:block;font-size:12px;color:var(--ink-soft);margin:2px 0 6px;}
.pv-more div{display:flex;flex-wrap:wrap;gap:6px;}
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
.cfx-log{display:flex;flex:0 0 auto;flex-wrap:wrap;align-items:center;gap:4px 8px;margin-top:6px;padding:4px 10px;border:1px dashed #DB8437;border-radius:10px;background:#FFF8EF;font-size:12.5px;}
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
.cfx-vm-wave{display:flex;align-items:center;justify-content:space-between;gap:3px;height:34px;}
.cfx-vm-wave i{display:block;flex:0 0 4px;width:4px;border-radius:2px;background:#DB8437;height:30%;}
.cfx-vm-wave i:nth-child(3n){height:75%}.cfx-vm-wave i:nth-child(4n+1){height:50%}.cfx-vm-wave i:nth-child(5n+2){height:95%}.cfx-vm-wave i:nth-child(7n+3){height:62%}
.cfx-vm.on .cfx-vm-wave i,.cf-vm-card.on .cfx-vm-wave i{animation:cfvm .9s ease-in-out infinite alternate;}
.cfx-vm-wave i:nth-child(odd){animation-delay:.3s!important}
@keyframes cfvm{from{transform:scaleY(.35)}to{transform:scaleY(1)}}
@media (prefers-reduced-motion:reduce){.cfx-vm.on .cfx-vm-wave i{animation:none;}}
.cfx-vm-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;}
.cfx-vm-st{font:800 16px/1.3 'Inter',sans-serif;color:#1E2340;}
/* the voicemail player (vmPlayer): one transport, the same on the slide, in the Listening Check and in the Notes & Action Plan.
   Bold, never under 16px; on the slide it grows with the window (--vf). */
.vmp{display:flex;flex-wrap:wrap;align-items:center;gap:.5em .6em;font:800 var(--vf,16px)/1.2 'Inter',sans-serif;color:#1E2340;}
.vmp button{font:inherit;font-weight:800;line-height:1.2;white-space:nowrap;cursor:pointer;border-radius:999px;margin:0;}
.vmp .vmp-play{min-width:7.3em;padding:.5em 1.1em;font-size:1.12em;background:#DB8437;color:#1E2340;border:2px solid #DB8437;box-shadow:0 3px 10px rgba(219,132,55,.45);}
.vmp .vmp-play:hover,.vmp .vmp-play:focus-visible{background:#1E2340;border-color:#1E2340;color:#fff;outline:none;}
.vmp .vmp-play[aria-pressed=true]{background:#1E2340;border-color:#1E2340;color:#fff;}
.vmp .vmp-b{padding:.42em .8em;background:#fff;color:#1E2340;border:2px solid #1E2340;}
.vmp .vmp-b:hover,.vmp .vmp-b:focus-visible{background:#1E2340;color:#fff;outline:none;}
.vmp-track{position:relative;flex:1 1 200px;min-width:150px;display:flex;align-items:center;height:2.4em;}
.vmp-ticks{position:absolute;left:11px;right:11px;top:50%;height:0;pointer-events:none;}
.vmp-ticks i{position:absolute;top:10px;width:2px;height:7px;margin-left:-1px;border-radius:1px;background:#8A91A8;}
.vmp-seek{-webkit-appearance:none;appearance:none;display:block;width:100%;height:12px;margin:0;padding:0;border:0;border-radius:999px;cursor:pointer;
  background:linear-gradient(to right,#DB8437 calc(11px + (100% - 22px) * var(--f,0)),#CCD1E0 0);}
.vmp-seek:focus-visible{outline:3px solid #DB8437;outline-offset:5px;}
.vmp-seek::-webkit-slider-thumb{-webkit-appearance:none;appearance:none;width:22px;height:22px;border-radius:50%;background:#1E2340;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.45);cursor:grab;}
.vmp-seek::-moz-range-thumb{width:16px;height:16px;border-radius:50%;background:#1E2340;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.45);cursor:grab;}
.vmp-seek::-moz-range-track{background:transparent;}
.vmp-time{font:800 1.12em/1 'IBM Plex Mono',monospace;font-variant-numeric:tabular-nums;white-space:nowrap;color:#1E2340;}
.vmp-time b{font-weight:800;color:#A4561A;}
.vmp-2 .vmp-track{order:-2;flex:1 1 calc(100% - 9em);}
.vmp-2 .vmp-time{order:-1;}
.vmp-2 .vmp-over{margin-left:auto;}
/* Your Case of a voicemail activity: the voicemail first, across the slide, and what is worked from it under it
   (the Notes & Action Plan checklist, or the documents), the two sharing the slide's height */
.cfx-sb.cfx-sb-vmw{flex:1 0 auto;min-height:0;display:flex;flex-direction:column;padding-bottom:4px;}
.cfx-sb.cfx-sb-vmw .cfx-when{flex:0 0 auto;}
.cfx .cfx-sb-vmw .cfx-when-date,.cfx .cfx-sb-vmw .cfx-when-sol,.cfx .cfx-sb-vmw .cfx-when-jump,.cfx .cfx-sb-vmw .cfx-when-date b,.cfx .cfx-sb-vmw .cfx-when-sol b{font-size:16px !important;font-weight:800 !important;}
.cfx .cfx-sb-vmw .cfx-when p{font-weight:700 !important;}
.cfx-sb-grid.cfx-sb-vm{--vf:clamp(16px,min(2.15vh,1.2vw),24px);flex:1 1 auto;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto;align-content:stretch;gap:calc(var(--vf) * .8);align-items:stretch;}
.cfx-sb-grid.cfx-sb-vm.cfx-sb-vmd{grid-template-rows:minmax(min-content,1fr) auto;}
.cfx-sb-vm .cfx-sb-main>:first-child{margin-top:0;}
.cfx-sb-vm .cfx-sb-main>.cfx-vm{flex:1 1 auto;display:flex;flex-direction:column;justify-content:space-between;gap:calc(var(--vf) * .5);padding:calc(var(--vf) * .7) calc(var(--vf) * 1.2);font:800 var(--vf)/1.25 'Inter',sans-serif;color:#1E2340;border-width:3px;}
.vmc-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:.2em .9em;}
.vmc-ch{font:800 1em 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#A4561A;}
.vmc-from{font:800 1.3em/1.15 'Poppins','Inter',sans-serif;color:#1E2340;}
.vmc-when{margin-left:auto;font:800 1em 'IBM Plex Mono',monospace;color:#1E2340;}
.cfx-sb-vm .cfx-vm .cfx-vm-wave{flex:1 1 0;min-height:0;height:auto;max-height:calc(var(--vf) * 4);overflow:hidden;}
.vmc-f{display:flex;flex-wrap:wrap;align-items:center;gap:.3em 1em;}
.cfx-sb-vm .cfx-vm .cfx-vm-st{font:800 1em/1.25 'Inter',sans-serif;color:#1E2340;background:#FBEBDD;border-radius:999px;padding:.25em .8em;}
.vmc-hint{flex:1 1 12em;font:700 1em/1.25 'Inter',sans-serif;color:#3A4256;}
.cfx .cfx-sb-vm .cfx-vm .vmc-go{margin-left:auto;font:800 calc(var(--vf) * 1.05)/1.2 'Inter',sans-serif !important;padding:.5em 1.1em;white-space:nowrap;border-radius:999px;}
/* under it, the Notes & Action Plan: its name and score at the left, the checklist in columns beside */
.cfx-sb-vm .cfx-sb-docs{padding-top:0;display:flex;flex-direction:column;justify-content:center;min-height:0;}
.cfx-sb-vm .cfx-np{flex:1 1 auto;display:grid;grid-template-columns:minmax(0,auto) minmax(0,1.6fr);grid-template-rows:auto auto auto;align-content:center;gap:calc(var(--vf) * .3) calc(var(--vf) * 2.4);padding:calc(var(--vf) * .7) calc(var(--vf) * 1.2);border-width:3px;border-left-width:8px;font:800 var(--vf)/1.3 var(--font-ui);}
.cfx-sb-vm .cfx-np>b{grid-column:1;grid-row:1;font:800 1.3em/1.15 'Poppins',var(--font-ui);color:#1E2340;}
.cfx-sb-vm .cfx-np .cfx-np-k{grid-column:1;grid-row:2;font:700 1em/1.3 var(--font-ui);color:#3A4256;max-width:24em;}
.cfx-sb-vm .cfx-np .cfx-np-r{grid-column:1;grid-row:3;align-self:start;margin-top:.2em;}
.cfx-sb-vm .cfx-np .cfx-np-r small{font:800 1em/1.3 var(--font-ui);color:#A4561A;}
.cfx-sb-vm .cfx-np ol{grid-column:2;grid-row:1 / 4;align-self:center;margin:0;display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:.45em 1.6em;font:800 1em/1.25 var(--font-ui);color:#1E2340;}
.cfx .cfx-sb-vm .cfx-np li{font-size:var(--vf) !important;font-weight:800 !important;line-height:1.25;text-align:left !important;}
/* or the documents it is worked from, in one row of pages with their names */
.cfx-sb-grid.cfx-sb-vm .cfx-sb-docs .cfx-docs-row{gap:calc(var(--vf) * 1.2);align-items:stretch;}
.cfx-sb-grid.cfx-sb-vm .cfx-sb-docs .cfx-thumb{flex:1 1 0;max-width:none;flex-direction:row;align-items:center;gap:calc(var(--vf) * .7);}
.cfx-sb-grid.cfx-sb-vm .cfx-sb-docs .cfx-thumb img{flex:0 0 auto;width:auto;height:clamp(120px,calc(42vh - 150px),340px);}
.cfx .cfx-sb-grid.cfx-sb-vm .cfx-thumb span{display:block;overflow:visible;min-width:0;font:800 clamp(16px,min(1.9vh,1.05vw),20px)/1.25 'Inter',sans-serif !important;color:#fff;text-align:left;}
.cfx-sb-grid.cfx-sb-vm .cfx-thumb-off::before{flex:0 0 auto;height:clamp(120px,calc(42vh - 150px),340px);}
@media(max-width:760px){
  .cfx-sb-vm .cfx-np{grid-template-columns:minmax(0,1fr);grid-template-rows:none;}
  .cfx-sb-vm .cfx-np>b,.cfx-sb-vm .cfx-np .cfx-np-k,.cfx-sb-vm .cfx-np .cfx-np-r,.cfx-sb-vm .cfx-np ol{grid-column:1;grid-row:auto;}
  .cfx-sb-vm .cfx-np ol{grid-template-columns:minmax(0,1fr);}
  .cfx-sb-grid.cfx-sb-vm .cfx-sb-docs .cfx-docs-row{flex-wrap:wrap;}
  .cfx-sb-grid.cfx-sb-vm .cfx-sb-docs .cfx-thumb{flex:1 1 100%;}
  .cfx-sb-grid.cfx-sb-vm .cfx-sb-docs .cfx-thumb img{height:110px;}
  .vmp-track{flex-basis:100%;order:5;}
}
/* the player in the Listening Check and in the Notes & Action Plan */
.cf-vm-card>.vmp{margin:4px 0 8px;}
.np-vm{margin-top:10px;border:3px solid #DB8437;border-radius:12px;background:#FFFDF8;padding:10px 14px;}
.np-vm-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin-bottom:8px;font:800 16px/1.3 var(--font-ui);color:#1E2340;}
.np-vm-h b{font-size:17px;}
.np-vm-h .cfx-vm-st{margin-left:auto;color:#A4561A;}
.np-vm-tip{margin:8px 0 0;font:700 16px/1.35 var(--font-ui);color:#3A4256;}
#cf-vm{position:fixed;left:0;right:0;bottom:0;top:var(--cf-topbar,0px);z-index:80;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(20,24,40,.55);}
.cf-vm-card{max-height:calc(100vh - var(--cf-topbar,0px) - 32px)!important;}
#cf-vm[hidden]{display:none;}
.cf-vm-card{width:min(720px,100%);max-height:calc(100vh - 32px);overflow:auto;background:#FFFDF8;border:3px solid #DB8437;border-radius:18px;padding:16px 20px;box-shadow:0 18px 40px rgba(0,0,0,.35);}
.cf-vm-h{display:flex;justify-content:space-between;gap:12px;align-items:flex-start;margin-bottom:10px;}
.cf-vm-h b{display:block;font:800 19px 'Poppins','Inter',sans-serif;color:#262B45;}
.cf-vm-h span{font:700 16px/1.35 'Inter',sans-serif;color:#3A4256;}
.cf-vm-x{border:0;background:none;font-size:20px;cursor:pointer;color:#262B45;}
.cf-vm-lead{font:700 16px/1.4 'Inter',sans-serif;color:#37394A;margin:10px 0;}
.cf-vm-qs{margin:0 0 12px;padding-left:20px;}
.cf-vm-qs li{margin:0 0 10px;font-size:16px;font-weight:700;}
.cf-vm-qs label{display:block;font-weight:700;color:#262B45;margin-bottom:4px;}
.cf-vm-qs textarea{width:100%;box-sizing:border-box;border:1px solid #C9CEDB;border-radius:8px;padding:6px 10px;font:600 16px 'Inter',sans-serif;resize:vertical;}
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
@media (max-height:780px){.cf-yr-side{display:none;}}   /* a short screen: no room beside the slide; the picker is on Presenter view's console */
.cf-yr-pv{display:inline-flex;align-items:center;gap:6px;} .cf-yr-pv .cf-yr{font-size:12px;color:#F6C08F;} .cf-yr-pv select{font-size:12px;padding:3px 6px;}
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
.cf-ans-h{font:800 24px 'Fraunces',Georgia,serif;color:#fff;background:#262B45;margin:18px 0 10px;padding:10px 16px;border-radius:10px;}
main:has(.cf-kc-result) #answerFeedback{max-width:none;}
.cf-ans-grid{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:8px;}
.cf-ans{background:#fff;border:1px solid #AEB6C6;border-left:6px solid #1E7A47;border-radius:10px;padding:10px 12px;font:500 14.5px/1.45 var(--font-ui);color:#141A2E;cursor:help;}
.cf-ans.no{border-left-color:#C0392B;background:#FFF8F7;}
.cf-ans p{margin:0 0 5px;display:-webkit-box;-webkit-line-clamp:3;-webkit-box-orient:vertical;overflow:hidden;}
.cf-ans-pick{font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cf-ans-right{margin-top:3px;color:#1E6B43;font-weight:700;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
@media (max-width:900px){.cf-ans-grid{grid-template-columns:repeat(2,minmax(0,1fr));}}
/* Case Documents: the Case File / Documents switch sits under the page's intro (no Open CMS: the slides send trainees to
   the CMS), so the copy js/lsh-topbar.js puts at the top of the page is hidden there */
main:has(.cf-docs-switch) > .lsh-subtabs{display:none !important;}   /* (ours is wrapped, so js/lsh-topbar.js leaves it alone) */
/* the Admin screen: a solid, full-width panel over the photo (as Foundational's js/ft-admin-tidy.js) */
main.cm-admin-main, main:has(.cm-admin-screen){max-width:min(2200px,97vw);padding-left:16px;padding-right:16px;}
.cm-admin-screen{background:#fff;border-radius:16px;padding:20px 24px 26px;box-shadow:0 10px 30px rgba(14,18,40,.28);color:#141A2E;}
.cm-admin-screen .card{border:1px solid #C9CEDD;}
.cm-admin-screen .admin-portal-link{display:none !important;}   /* (🎓 Training Directory is in the top bar) */
.adm-settings{padding:10px 16px;margin:0 0 14px;} .adm-settings > summary{cursor:pointer;font-weight:800;color:var(--navy);font-size:14px;}
.adm-settings[open] > summary{margin-bottom:8px;} .adm-settings .card{box-shadow:none;margin:8px 0 0;background:#fff;}
@media(max-width:760px){ .cm-admin-screen{padding:14px 12px 18px;border-radius:12px;} }
/* the standard for every Admin tab (as Foundational's admin sections, body.lp-sec-admin): bigger, bolder text. max(…, 1em):
   never smaller than the text around it, so nothing that was already bigger shrinks; !important beats the pages' inline sizes */
.cm-admin-screen{font-size:16px;font-weight:600;color:#141A2E;}
.cm-admin-screen p, .cm-admin-screen li, .cm-admin-screen label, .cm-admin-screen dd, .cm-admin-screen dt{font-size:max(16px, 1em) !important;line-height:1.55;font-weight:600 !important;}
.cm-admin-screen p b, .cm-admin-screen li b, .cm-admin-screen label b, .cm-admin-screen strong{font-weight:800 !important;}
.cm-admin-screen small, .cm-admin-screen .admin-id, .cm-admin-screen em{font-size:max(14px, 1em) !important;font-weight:700 !important;}
.cm-admin-screen h1{font-size:max(30px, 1em) !important;font-weight:800 !important;} .cm-admin-screen h2{font-size:max(24px, 1em) !important;font-weight:800 !important;} .cm-admin-screen h3{font-size:max(20px, 1em) !important;font-weight:800 !important;}
.cm-admin-screen summary{font-size:16.5px !important;font-weight:800 !important;}
.cm-admin-screen .admin-tab-btn{font-size:16.5px !important;font-weight:800 !important;}
.cm-admin-screen .btn{font-size:max(15px, 1em) !important;font-weight:800 !important;}
.cm-admin-screen input, .cm-admin-screen select, .cm-admin-screen textarea{font-size:16px !important;font-weight:700 !important;}
.cm-admin-screen .admin-name{font-size:17px !important;font-weight:800 !important;}
.cm-admin-screen .eyebrow{font-size:13px !important;font-weight:800 !important;}
/* text the pages size inline (font-size:10px–14px): 15px at least, bold; a card's own title 17px */
.cm-admin-screen [style*="font-size:10"], .cm-admin-screen [style*="font-size:11"], .cm-admin-screen [style*="font-size:12"], .cm-admin-screen [style*="font-size:13"], .cm-admin-screen [style*="font-size:14"]{font-size:max(15px, 1em) !important;font-weight:700 !important;}
.cm-admin-screen .card > b[style*="font-size"], .cm-admin-screen .card > div > b[style*="font-size"]{font-size:17.5px !important;font-weight:800 !important;}
.cm-admin-screen .tk-admin-note, .cm-admin-screen .audit-strip, .cm-admin-screen .audit-strip span, .cm-admin-screen .rv{font-size:max(15px, 1em) !important;font-weight:700 !important;}
.cm-admin-screen .audit-strip .as-block > b{font-size:13.5px !important;font-weight:800 !important;}
/* the Batch Sheet's grids: bigger cells, headers and notes */
.cm-admin-screen .scx-card .gs{font-size:17px;} .cm-admin-screen .scx-card .gs td{font-weight:700;}
.cm-admin-screen .scx-card .gs-head th{font-size:16px !important;font-weight:800 !important;}
.cm-admin-screen .scx-card .gs-groups th{font-size:15.5px !important;}
.cm-admin-screen .scx-card .bs-h{font-size:24px !important;} .cm-admin-screen .scx-card .bs-note{font-size:16px !important;font-weight:600 !important;}
.cm-admin-screen .bs-ds-h, .cm-admin-screen .bs-ds-day > summary{font-size:16.5px !important;} .cm-admin-screen .bs-ctx{font-size:15.5px !important;}
.cm-admin-screen .bs-view button{font-size:15px !important;font-weight:800 !important;}
.cm-admin-screen .ft-banner .ft-banner-sub{font-size:16.5px !important;} .cm-admin-screen .scx-banner .gs-menu button{font-size:14.5px !important;}
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
.cfx-ag{display:grid;grid-template-columns:minmax(0,1fr);grid-template-areas:"goal" "list" "file";gap:12px;align-items:stretch;}
.cfx-ag > .cfx-ag-side{grid-area:goal;}.cfx-ag > .cfx-ag-list{grid-area:list;}.cfx-ag > .cfx-ag-file{grid-area:file;}
.cfx-ag-file{display:flex;flex-wrap:wrap;align-items:stretch;gap:8px;color:#fff;text-align:left;}
.cfx-ag-file-h{margin:0;padding:6px 12px;border-radius:12px;background:#262B45;border:1px solid rgba(255,255,255,.18);font:800 15px/1.25 'Poppins','Inter',sans-serif;display:flex;flex-direction:column;justify-content:center;}.cfx-ag-file-h small{font:600 11.5px 'IBM Plex Mono',monospace;color:#C9CFDD;}
.cfx-ag-file dl{display:contents;}
.cfx-ag-file dl > div{flex:1 1 auto;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.16);border-radius:12px;padding:6px 12px;}
.cfx-ag-file dt{font:700 11.5px 'Inter',sans-serif;color:#F4B77A;letter-spacing:.02em;}.cfx-ag-file dd{margin:1px 0 0;font:600 14px/1.3 'Inter',sans-serif;color:#E8EBF3;white-space:nowrap;}
.cfx-ag-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));grid-template-rows:repeat(var(--ag-rows,3),auto);grid-auto-flow:column;gap:10px 12px;}
.cfx-ag-list li{text-align:left;display:flex;gap:12px;align-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:10px 14px;}
.cfx-ag-list li::before{display:none !important;content:none !important;}
.cfx-ag-n{flex:0 0 auto;width:40px;height:40px;border-radius:50%;display:grid;place-items:center;background:#DB8437;color:#fff;font:800 18px 'Poppins','Inter',sans-serif;}
.cfx-ag-list b{display:block;font:700 18.5px/1.25 'Poppins','Inter',sans-serif;color:#fff;}
.cfx-ag-list small{display:block;margin-top:2px;font:500 13px/1.3 'Inter',sans-serif;color:#C9CFDD;}
.cfx-ag-side{background:#FFFDF8;color:var(--ink);border:3px solid #DB8437;border-radius:20px;padding:12px 20px;font:500 17px/1.5 'Inter',sans-serif;text-align:left;}
.cfx-ag-side .cfx-ag-day{margin:0 0 8px;font:800 22px/1.25 'Poppins','Inter',sans-serif;color:#262B45;}
.cfx-ag-side p{margin:0;}
.cfx-ag-side p:not(.cfx-ag-day){font-weight:700;color:#1A1E2E;}   /* the day's objective, bold enough to read on a projector */
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
  .cfx-ag-file dd{white-space:normal;}.cfx-ag-list{grid-template-columns:minmax(0,1fr);grid-auto-flow:row;grid-template-rows:none;}
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
.cfx-ev-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;font:700 12.5px 'Inter',sans-serif;color:#3A4256;}
.cfx-ev-i{font-size:16px;}.cfx-ev-ch{font:800 12.5px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#A4561A;}
.cfx-ev-from{color:#262B45;}.cfx-ev-when{margin-left:auto;font-family:'IBM Plex Mono',monospace;font-size:11.5px;}
.cfx-ev-subj{margin:4px 0 6px;font:800 20px/1.3 'Poppins','Inter',sans-serif;color:#262B45;text-align:center;}
.cfx-ev-body{margin:0;font:700 17px/1.5 'Inter',sans-serif;color:#1A1E2E;text-align:justify;hyphens:auto;}
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
/* the time banner on a Skill Activity's Your Case (timeBanner) */
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
.cfx-aud-due{padding:4px 11px;border-radius:999px;background:#FDECEC;border:1px solid #F2B8B8;color:#8E2A2A !important;font-weight:600;}
.cfx-aud-row3{grid-template-columns:1.25fr 1fr 1.25fr;align-items:stretch;}
.cfx-aud-card{border-top:4px solid #262B45;box-shadow:0 6px 18px -12px rgba(20,24,48,.35);}
.cfx-aud-set{display:flex !important;gap:12px;align-items:center;border-top-color:#DB8437;}
.cfx-aud-set > div{display:grid;gap:4px;min-width:0;}
.cfx-aud-thumb{flex:0 0 auto;width:74px;border:1px solid var(--line);border-radius:6px;overflow:hidden;box-shadow:0 4px 10px -6px rgba(20,24,48,.5);transition:transform .15s;}
.cfx-aud-thumb:hover{transform:translateY(-2px) rotate(-1deg);}
.cfx-aud-thumb img{display:block;width:100%;height:auto;}
.cfx-aud-n{display:inline-grid;place-items:center;min-width:24px;height:24px;padding:0 6px;border-radius:999px;background:#DB8437;color:#fff;font-weight:800;margin-right:4px;}
.cfx-aud-prog{font-size:22px !important;}
.cfx-aud-bar{height:10px;border-radius:999px;background:#E9EBF2;overflow:hidden;margin:2px 0 4px;}
.cfx-aud-bar i{display:block;height:100%;background:linear-gradient(90deg,#262B45,#DB8437);border-radius:999px;transition:width .4s;}
.cfx-aud-vs{display:flex;flex-wrap:wrap;gap:6px;margin-top:4px;}
.cfx-aud-v{display:inline-flex;align-items:center;gap:6px;padding:4px 10px 4px 4px;border-radius:999px;font:700 12.5px var(--font-ui);border:1px solid;}
.cfx-aud-v i{display:inline-grid;place-items:center;width:22px;height:22px;border-radius:50%;font-style:normal;color:#fff;font-size:12px;}
.cfx-aud-v.v-keep{background:#EAF5EE;border-color:#B9DCC6;color:#22603A;} .cfx-aud-v.v-keep i{background:#2E7D4F;}
.cfx-aud-v.v-replace{background:#EEF3FB;border-color:#C2D2EC;color:#26457A;} .cfx-aud-v.v-replace i{background:#3B66AE;}
.cfx-aud-v.v-pull{background:#FDECEC;border-color:#F2B8B8;color:#8E2A2A;} .cfx-aud-v.v-pull i{background:#C0392B;}
.cfx-aud-v.v-add{background:#FFF4E6;border-color:#F3CFA0;color:#8A4B12;} .cfx-aud-v.v-add i{background:#DB8437;}
.cfx-aud-v.v-flag{background:#F1EEF8;border-color:#CFC5E6;color:#4A3A7A;} .cfx-aud-v.v-flag i{background:#5E4B9B;}
.cfx-aud-go{font-size:16px !important;padding:11px 20px !important;background:linear-gradient(135deg,#DB8437,#EFA463) !important;color:#fff !important;border:0 !important;box-shadow:0 10px 22px -12px rgba(219,132,55,.9);}
.cfx-aud-go:hover{filter:brightness(1.05);transform:translateY(-1px);}
@media(max-width:1100px){.cfx-aud-row3{grid-template-columns:1fr;}}
.cfx-bench,.cfx-sv{max-width:1180px;}
.cfx-simnote{margin:0;padding:6px 10px;border-left:3px solid #DB8437;background:rgba(219,132,55,.08);border-radius:6px;font-size:12.5px;line-height:1.4;color:var(--ink-soft);}
.cfx-simnote b{color:var(--ink);margin-right:4px;}.cfx-modal-in .cfx-simnote{margin:0 0 10px;}
.cfx-simnote-s{display:block;font-size:11.5px;color:#C9CFDF;margin-top:2px;}
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
.cf-px-head{display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;margin:0 0 10px;}
.cf-px-head h1{margin:0;font:800 22px/1.2 'Fraunces',Georgia,serif;color:var(--navy);}
.cf-px-head h1 span{font:500 13px var(--font-ui);color:var(--ink-soft);margin-left:8px;}
.cf-px-any{display:flex;gap:6px;flex-wrap:wrap;}
.cf-px-page .cf-px-tabs{margin:0 0 10px;}
.cf-px-page .cf-px-tab{padding:6px 12px;}
.cf-px-page .cf-px-tab small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%;}
.cf-px-day{padding:12px 14px !important;}
.cf-px-dh{display:flex;align-items:baseline;justify-content:space-between;gap:10px;flex-wrap:wrap;margin:0 0 8px;}
.cf-px-dh h2{margin:0;font:800 18px/1.25 'Fraunces',Georgia,serif;color:var(--navy);}
.cf-px-prog{font:700 12px var(--font-ui);color:var(--ink-soft);}
.cf-px-day .cf-px-tools{display:flex;align-items:center;gap:10px;margin:0 0 10px;padding:7px 10px;}
.cf-px-day .cf-px-tools > b{flex:0 0 auto;}
.cf-px-day .cf-px-toolrow{margin:0;}
.cf-px-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(215px,1fr));gap:7px;}
.cf-px-tile{display:flex;flex-direction:column;gap:2px;padding:7px 10px;border:1px solid var(--line);border-left:4px solid #DB8437;border-radius:10px;background:#fff;cursor:pointer;transition:transform .12s,box-shadow .12s;min-width:0;}
.cf-px-tile:hover,.cf-px-tile:focus-visible{transform:translateY(-1px);box-shadow:0 8px 18px -12px rgba(20,24,48,.45);outline:none;}
.cf-px-tile.locked{cursor:default;opacity:.7;border-left-color:#B8BCCB;}
.cf-px-k{font:700 10.5px var(--font-ui);letter-spacing:.04em;text-transform:uppercase;color:var(--orange-deep);white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cf-px-tile b{font:700 13px/1.25 var(--font-ui);min-height:2.5em;color:var(--navy);display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cf-px-m{display:flex;gap:10px;align-items:center;font-size:11.5px;color:var(--ink-soft);margin-top:auto;}
.cf-px-m > span{white-space:nowrap;}
.cf-px-m > span:first-child{overflow:hidden;text-overflow:ellipsis;min-width:0;}
.cf-px-m .ok{color:#2E7D4F;font-weight:700;white-space:nowrap;}
.cf-px-m .go{margin-left:auto;font-weight:800;color:var(--navy);white-space:nowrap;}
.cf-px-mod{border:1px solid var(--line);border-radius:12px;padding:10px 12px;background:#fff;}
.cf-px-mh{font:700 13px var(--font-ui);color:var(--navy);margin-bottom:6px;}
.cf-px-act{display:flex;justify-content:space-between;align-items:flex-start;gap:10px;padding:7px 0;border-top:1px dashed var(--line);}
.cf-px-act b{font-size:13.5px;color:var(--ink);}
.cf-px-act > .btn{flex:0 0 auto;white-space:nowrap;}
.cf-px-loop{align-self:flex-start;padding:1px 7px;border-radius:6px;background:#EEF0F6;color:#4A5170;font:700 11.5px/1.4 'Inter',sans-serif;}
.cf-px-loop.cf-px-main{background:#DB8437;color:#fff;}
.cf-px-tile.cf-px-tile-main{border-color:#DB8437;box-shadow:0 0 0 2px rgba(219,132,55,.35);}
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

/* ---------- the slides' contrast and type (Batch 1 revamp): every slide reads on a projector ----------
   Dark ink on white, navy section labels with white text, stronger borders and highlights, theory cards larger
   with 18–20px body type, the case strip in navy; the agenda's grid sits lower with more room. Loaded last, so it
   overrides the slide styles above without changing any slide's content. */
(function(){
  const st = document.createElement("style"); st.id = "cf-contrast";
  st.textContent = `
.cfx{--ink:#141A2E;}
.cfx .cfx-body:not(.cfx-body-navy){color:#141A2E;}
.cfx mark.cfx-hl{background:linear-gradient(180deg,transparent 46%,#F8C48A 46%,#F8C48A 94%,transparent 94%);color:#141A2E;font-weight:800;}
.cfx .cfx-chip{background:#262B45;color:#fff;font-size:14.5px;padding:7px 16px;}
.cfx .cfx-hook{color:#141A2E;font-weight:700;}
.cfx .cfx-lead-1, .cfx .cfx-th-lead{color:#141A2E;}
.cfx-hero .cfx-art, .cfx .cfx-art svg{filter:saturate(1.35) contrast(1.12);}
/* theory: bigger cards, more padding, 18–20px body */
.cfx .cfx-th-c{border:2px solid #C9B9A3;border-left:6px solid #DB8437;padding:12px 16px;gap:5px;}
.cfx .cfx-th-c b{font-size:17.5px;color:#1E2340;}
.cfx .cfx-th-c span, .cfx-th-solo .cfx-th-c span{font-size:18.5px;line-height:1.45;color:#141A2E;}
/* rules, steps, Do & Don't */
.cfx .cfx-points li{color:#141A2E;}
.cfx .cfx-dd > div{border-width:2px;border-radius:14px;padding:14px 18px;}
.cfx .cfx-do{background:#E6F4EC;border-color:#1E7A47;} .cfx .cfx-dont{background:#FDEDEB;border-color:#B42318;}
.cfx .cfx-do h3{color:#0B5D1E;} .cfx .cfx-dont h3{color:#8F1A12;}
.cfx .cfx-dd li{font-size:18.5px;line-height:1.45;color:#141A2E;margin:0 0 6px;}
.cfx .cfx-upl{border-width:2px;}
/* the case strip: Case · Client · Lead Counsel · SOL · Recovery Stack */
.cf-strip .cf-anchor{background:#1E2340;border:1px solid #1E2340;color:#fff;font-size:14px;padding:7px 13px;}
.cf-strip .cf-anchor b{color:#F6C08F;font-size:11px;letter-spacing:.08em;text-transform:uppercase;}
.cf-strip .cf-anchor.cf-flag{background:#FFF1E2;border-color:#DB8437;color:#141A2E;} .cf-strip .cf-anchor.cf-flag b{color:#A4470F;}
/* the agenda: the grid lower, with more room */
.cfx-agenda .cfx-ag-body{padding-top:22px !important;}
.cfx-agenda .cfx-ag{gap:22px;}
.cfx-agenda .cfx-ag-list{gap:14px 16px;}
.cfx-agenda .cfx-ag-list li{padding:14px 16px;background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.28);}
.cfx-agenda .cfx-ag-list small{font-size:14.5px;color:#E3E7F1;}
.cfx-agenda .cfx-ag-side p:not(.cfx-ag-day){font-size:18px;}
/* bigger and bold: every slide's body text, as on Foundational's decks */
.cfx .cfx-th-c b{font-size:19px;font-weight:800;}
/* The Theory fills its card: the lead at the top, the concept cards sharing the rest of the height (no empty bands) */
.cfx-sheet > .cfx-theory.cfx-th-solo{margin:0 !important;flex:1 1 auto;min-height:0;display:flex;flex-direction:column;}
.cfx-th-solo > .cfx-th-main{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:12px;}
.cfx-th-solo .cfx-th-grid{flex:1 1 auto;min-height:0;grid-auto-rows:minmax(0,1fr);gap:14px;}
.cfx .cfx-th-solo .cfx-th-c{justify-content:center;padding:clamp(12px,2vh,22px) clamp(16px,1.6vw,28px);gap:8px;}
.cfx .cfx-th-solo .cfx-th-c b{font-size:clamp(19px,2.6vh,24px);}
.cfx .cfx-th-solo .cfx-th-c span{font-size:clamp(19px,2.5vh,23px);line-height:1.45;}
.cfx .cfx-th-c span, .cfx-th-solo .cfx-th-c span{font-size:20px;font-weight:600;}
.cfx .cfx-th-lead{font-size:24px;font-weight:700;}
.cfx .cfx-points li{font-weight:600;}
.cfx .cfx-dd li{font-size:21px;font-weight:600;}
.cfx .cfx-dd h3{font-size:24px;}
.cfx .cfx-fw-list span{font-size:18px;font-weight:600;color:#141A2E;}
/* the framework tables (The Structured Intake Questions and the like): big, bold type, as on the cards */
.cfx .cfx-fw-tbl td{font-size:21px;font-weight:700;line-height:1.35;color:#141A2E;padding:12px 18px;}
.cfx .cfx-fw-tbl tbody th{font-size:21px;font-weight:800;padding:12px 18px;}
.cfx .cfx-fw-tbl thead th{font-size:16px;padding:11px 18px;}
.cfx .cfx-fw-note{font-size:18px;font-weight:700;color:#2E3450;}
.cfx .cfx-fw-list b{font-size:18.5px;font-weight:800;color:#1E2340;}
/* the flow (The General Process and every step-by-step track): big, bold type, and the step number white on its navy
   badge (it is a span too, so it used to take the description's near-black and vanish into the badge) */
.cfx .cfx-fw-flow li{padding:16px 14px 16px;gap:8px;}
.cfx .cfx-fw-flow li b{font-size:23px;font-weight:800;line-height:1.2;color:#1E2340;}
/* six steps or more: the longest single words ("Documentation", "Communication") still fit their card at 1280×720 */
.cfx .cfx-fw-flow[style*="--n:6"] li b, .cfx .cfx-fw-flow[style*="--n:7"] li b, .cfx .cfx-fw-flow[style*="--n:8"] li b{font-size:19.5px;}
.cfx .cfx-fw-flow li span:last-child{font-size:20px;font-weight:700;line-height:1.35;color:#141A2E;}
.cfx .cfx-fw-flow li .cfx-fw-n{width:36px;height:36px;font-size:17px;font-weight:800;color:#fff;background:#262B45;}
@media(min-width:761px){.cfx .cfx-fw-flow li:not(:last-child)::after{font-size:20px;right:-17px;}}
.cfx .cfx-doc-c p, .cfx .cfx-doc-c li, .cfx .cfx-grade-c li{font-size:18px;font-weight:600;color:#141A2E;}
.cfx .cfx-upl span{font-weight:700;}
.cfx .cfx-situation{font-weight:600;color:#141A2E;}
.cf-strip .cf-anchor{font-size:15px;font-weight:700;}
.cfx-agenda .cfx-ag-list b{font-size:20px;font-weight:800;}
.cfx-agenda .cfx-ag-list small{font-size:15.5px;font-weight:600;}
.cfx-agenda .cfx-ag-side p:not(.cfx-ag-day){font-size:19px;font-weight:700;}
.cfx-ready .cfx-lab-gate{font-size:20px;} .cfx-ready .cfx-lab-q > span{font-size:20px;font-weight:700;} .cfx-ready .cfx-lab-q .o button{font-size:18px;padding:10px 16px;} .cfx-ready .cfx-lab-q .r{font-size:16.5px;}
.cfx .cfx-plain{font-size:17px;border:2px solid #9DB0CC;background:#EEF3FA;} .cfx .cfx-plain summary{font-size:16px;font-weight:700;color:#141A2E;}
.cfx .cfx-plain dt{font-weight:800;color:#141A2E;} .cfx .cfx-plain dd{color:#141A2E;font-weight:600;}
`;
  document.head.appendChild(st);
})();
/* 🏗 Build Your Companion Case and ➕ Optional Extra Practice (a build day, Day 5) */
(function(){
  if(document.getElementById("cf-build-css")) return;
  const st = document.createElement("style"); st.id = "cf-build-css";
  st.textContent = `
.cfx-bd{display:flex;flex-direction:column;gap:12px;text-align:left;}
.cfx-bd-case{background:#1E2340;color:#fff;border-radius:14px;padding:12px 18px;border-left:6px solid #DB8437;display:grid;grid-template-columns:minmax(0,1fr) auto;grid-template-areas:'k k' 'h b' 'p b';column-gap:20px;align-items:center;}
.cfx-bd-case .cfx-bd-k{grid-area:k;}
.cfx-bd-case.cfx-bd-slim{grid-template-columns:auto minmax(0,1fr) auto;grid-template-areas:'k h b';column-gap:16px;padding:10px 16px;} .cfx-bd-slim h3{margin:0 !important;} .cfx-bd-case h3{grid-area:h;} .cfx-bd-case > p:not(.cfx-bd-k){grid-area:p;} .cfx-bd-case dl{grid-area:dl;} .cfx-bd-case .btn{grid-area:b;white-space:nowrap;}
.cfx-bd-k{margin:0;font:800 12.5px 'Inter',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#F6C08F;}
.cfx-bd-case h3{margin:6px 0 6px;font:800 23px/1.25 'Poppins','Inter',sans-serif;color:#fff;}
.cfx-bd-case p{margin:0;font:600 17.5px/1.45 'Inter',sans-serif;color:#E3E7F1;}
.cfx-bd-case dl{display:grid;grid-template-columns:auto 1fr;gap:4px 10px;margin:0;font:600 16.5px/1.4 'Inter',sans-serif;}
.cfx-bd-case dt{color:#F6C08F;font-weight:800;} .cfx-bd-case dd{margin:0;color:#fff;}
.cfx-bd-steps{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:minmax(0,1fr);gap:10px;}
.cfx-bd-steps li > div{text-align:left !important;}
.cfx-bd-steps li{display:grid;grid-template-columns:82px 1fr;gap:16px;align-items:start;text-align:left;background:#fff;border:1.5px solid #E2D7C8;border-left:6px solid #DB8437;border-radius:12px;padding:9px 18px;}
.cfx-bd-steps .cfx-bd-t{font:800 22px 'IBM Plex Mono',monospace;color:#1E2340;display:flex;flex-direction:column;gap:3px;} .cfx-bd-steps .cfx-bd-t small{font:800 15px 'Inter',sans-serif;color:#A4470F;}
.cfx-bd-steps li > div > b{display:block;font:800 22px/1.3 'Inter',sans-serif;color:#1E2340;} .cfx-bd-steps li > div > span{display:block;font:600 19.5px/1.45 'Inter',sans-serif;color:#141A2E;margin-top:2px;}
.cfx-bd-steps li::before,.cfx-ex-list li::before{display:none !important;content:none !important;} .cfx-ex-list li{padding:0 !important;margin:0 !important;}
.cfx-bd-steps em{display:block;font:700 17.5px/1.4 'Inter',sans-serif;font-style:normal;color:#8E3A0B;margin-top:4px;}
.cfx-ex-lead{text-align:left;margin:0 0 12px;font:600 20px/1.5 'Inter',sans-serif;color:#141A2E;}
.cfx-ex-list{list-style:none;margin:0 0 14px;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px;}
.cfx-ex-list button{width:100%;text-align:left;display:flex;gap:10px;align-items:baseline;border:1.5px solid #DDE1EA;background:#fff;border-radius:10px;padding:8px 14px;font:700 18px/1.35 'Inter',sans-serif;color:#1E2340;cursor:pointer;}
.cfx-ex-list button:hover{border-color:#DB8437;} .cfx-ex-list button span{font:700 15px 'IBM Plex Mono',monospace;color:#A4470F;flex:0 0 auto;}
.cfx-ex-go{display:flex;justify-content:flex-end;} .cfx-ex-go .btn{font-size:17px;padding:12px 22px;}
@media(max-width:900px){ .cfx-bd-case{grid-template-columns:1fr;grid-template-areas:'k' 'h' 'p' 'dl' 'b';} .cfx-bd-steps,.cfx-ex-list{grid-template-columns:1fr;} }`;
  document.head.appendChild(st);
})();

/* A laptop (a short screen, 1366×768 and the like): the slide's content gets the height. The block's title moves into the
   row of the view pill (no separate ribbon), the deck title and the gaps tighten, the kicker and the page's footer line
   go, so the card's content is drawn at (or near) full size instead of being shrunk to fit. */
(function(){
  if(document.getElementById("cf-laptop-css")) return;
  const st = document.createElement("style"); st.id = "cf-laptop-css";
  st.textContent = `
.cfx-top-rib{display:none;flex:1 1 auto;min-width:0;text-align:center;color:#fff;font:800 17px/1.2 'Poppins','Inter',sans-serif;letter-spacing:.04em;text-transform:uppercase;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;padding:4px 12px;border-bottom:3px solid #DB8437;border-radius:6px;background:linear-gradient(90deg,#343C66 0%,#46508A 50%,#343C66 100%);}
@media (min-width:1000px) and (max-height:900px){
  body:has(#lessonStage) .footer-note{display:none !important;}
  .lesson-stage .cfx-deck-head{padding-bottom:2px !important;margin-bottom:6px !important;}
  .lesson-stage .cfx-deck-title{font-size:clamp(20px,1.75vw,27px) !important;}
  .cfx-deck .cfx-kicker{display:none !important;}
  .cfx-deck > .cfx-ribbon{margin-bottom:8px !important;} .cfx-deck > .cfx-ribbon span{font-size:16px !important;padding:5px 16px !important;}
  .cfx-deck .cfx-top{margin-bottom:8px !important;}
}
/* readable on a laptop: the small print of the slides, raised (measured at 1366×768, every slide of every day) */
.cfx .cfx-ev-body{font-size:17px !important;line-height:1.45 !important;}
.cfx .cfx-ev-from{font-size:13.5px !important;} .cfx .cfx-ev-when{font-size:13px !important;}
.cfx .cf-docline a,.cfx .dfl-doc a{font-size:16px !important;} .cfx .dfl-file{font-size:13.5px !important;}
.cfx .dfl-conv,.cfx .dfl-conv code,.cfx .dfl-need{font-size:14px !important;} .cfx .dfl-h b{font-size:15.5px !important;} .cfx .dfl-fields .btn{font-size:15px !important;}
.cfx .cfx-thumb span{font-size:14px !important;}
.cfx .cf-strip .cf-anchor{font-size:16px !important;} .cfx .cf-strip .cf-anchor b{font-size:12.5px !important;}
.cfx .cfx-when p{font-size:16.5px !important;} .cfx .cfx-when-date,.cfx .cfx-when-sol,.cfx .cfx-when-jump{font-size:15px !important;} .cfx .cfx-when-date b,.cfx .cfx-when-sol b{font-size:15px !important;}
.cfx .cfx-side .cfx-why span{font-size:17px !important;line-height:1.45 !important;} .cfx .cfx-side .cfx-why b{font-size:15px !important;}
.cfx .cfx-hero .cfx-chip{font-size:16px !important;}
.cfx .cfx-fall p{font-size:16px !important;} .cfx .cfx-fall-why{font-size:13.5px !important;}
.cfx .cfx-at{font-size:13.5px !important;}
.cfx .cfx-deliver span{font-size:17px !important;} .cfx .cfx-deliver em{font-size:14.5px !important;}
.cfx .cfx-do-now span{font-size:16.5px !important;}
.cfx .cfx-call span{font-size:15.5px !important;} .cfx .cfx-simnote-s,.cfx .cfx-simnote{font-size:13.5px !important;}
.cfx .cfx-top .cfx-full,.cfx .cfx-top .cfx-inject{font-size:14px !important;}
.cfx-lab li > button .t{font-size:15.5px !important;}
.cfx-ready .cfx-lab-q > span{font-size:18px !important;} .cfx-ready .cfx-lab-q .o button{font-size:16.5px !important;}
.cfx-agenda .cfx-ag-list li{justify-content:center !important;} .cfx-agenda .cfx-ag-list li > div{flex:0 1 auto !important;} .cfx-agenda .cfx-ag-list li > div,.cfx-agenda .cfx-ag-list li > div b{text-align:left !important;}   /* the agenda's topics, number and title together, centred in their boxes */
.cfx-agenda .cfx-ag-side p{font-size:16.5px !important;} .cfx-agenda .cfx-ag-list li small{font-size:14px !important;}
.cfx .cfx-model td,.cfx .cfx-model th,.cfx-model tbody td{font-size:18px !important;font-weight:700 !important;color:#141A2E;line-height:1.45;}
/* a model table's text bold, as the trainer asked: its header row and first column extra-bold, the caption bold and dark */
.cfx .cfx-model th,.cfx-model thead th{font-weight:800 !important;color:#fff;} .cfx .cfx-model tbody td:first-child{font-weight:800 !important;}
.cfx-model .cfx-caption{font-weight:800 !important;color:#1E2340 !important;font-size:21px !important;}
.cfx .cfx-grade-c li{font-size:17px !important;}
.cfx-agenda .cfx-ag-side p:not(.cfx-ag-day){font-size:17px !important;line-height:1.5 !important;}
.cfx-agenda .cfx-ag-list li small{font-size:15px !important;} .cfx-agenda .cfx-ag-list li b{font-size:19px !important;}
.cfx-agenda .cfx-ag-file dt{font-size:13px !important;} .cfx-agenda .cfx-ag-file dd{font-size:15.5px !important;} .cfx-agenda .cfx-ag-file-h small{font-size:13px !important;}
/* the Training Agenda, brighter (the trainer found it dull): each topic a lighter solid card with a bright edge, white
   extra-bold titles, the number in a ringed orange badge; the case strip's values white on lighter boxes */
.cfx-agenda .cfx-ag-list li{background:linear-gradient(135deg,#46508A 0%,#38416F 100%) !important;border:1.5px solid rgba(255,255,255,.42) !important;box-shadow:0 6px 16px -10px rgba(0,0,0,.55),inset 0 1px 0 rgba(255,255,255,.12) !important;}
.cfx-agenda .cfx-ag-list li b{color:#fff !important;font-weight:800 !important;text-shadow:0 1px 1px rgba(0,0,0,.25);}
.cfx-agenda .cfx-ag-list li small{color:#F2F4FA !important;font-weight:600 !important;}
.cfx-agenda .cfx-ag-n{background:#F08A2C !important;box-shadow:0 0 0 3px rgba(255,255,255,.85) !important;color:#fff !important;}
.cfx-agenda .cfx-ag-file dl > div{background:rgba(255,255,255,.16) !important;border:1.5px solid rgba(255,255,255,.38) !important;}
.cfx-agenda .cfx-ag-file dt{color:#FFC98F !important;font-weight:800 !important;}
.cfx-agenda .cfx-ag-file dd{color:#fff !important;font-weight:700 !important;}
.cfx-agenda .cfx-ag-file-h{background:#DB8437 !important;border-color:#F4B77A !important;color:#fff !important;} .cfx-agenda .cfx-ag-file-h small{color:#FFF4E6 !important;}`;
  document.head.appendChild(st);
})();

/* Bigger decks: no row of view pill, kicker and 📖 Additional Reference above the card (a trainer's ⚡ Inject keeps its
   row on Your Task), the block's title band always shown, no footer line on a lesson page, and bolder, bigger type. */
(function(){
  if(document.getElementById("cf-bigger-css")) return;
  const st = document.createElement("style"); st.id = "cf-bigger-css";
  st.textContent = `
.cfx-deck .cfx-top .cfx-pill,.cfx-deck .cfx-top .cfx-dots,.cfx-deck .cfx-top .cfx-kicker,.cfx-deck .cfx-top .cfx-full,.cfx-deck .cfx-top .cfx-top-rib{display:none !important;}
.cfx-deck .cfx-top:not(:has(.cfx-inject)){display:none !important;}
.cfx-deck .cfx-top:has(.cfx-inject){justify-content:flex-end;margin:0 0 6px !important;}
.cfx-deck > .cfx-ribbon{display:block !important;}
body:has(#lessonStage) .footer-note{display:none !important;}
body:not(.ft-fit) #lessonStage > .slide-nav{margin-top:8px !important;margin-bottom:0 !important;}
/* bolder, bigger type on every slide */
.cfx .cfx-sheet{font-weight:600;}
.cfx .cfx-th-c span,.cfx .cfx-points li,.cfx .cfx-points li span{font-weight:700 !important;}
.cfx .cfx-th-c b{font-weight:800 !important;}
.cfx .cfx-points li,.cfx .cfx-points li span{font-size:clamp(20px,2.6vh,25px) !important;}
.cfx .cfx-fw-list span{font-size:clamp(17px,2.2vh,20px) !important;font-weight:600 !important;}
.cfx .cfx-fw-list b{font-size:clamp(18px,2.3vh,21px) !important;font-weight:800 !important;}
/* the flow keeps its own measured sizes (above, "the flow ..."): 23px titles (19.5px at six steps or more), 20px bold text */
.cfx .cfx-hero-text p,.cfx .cfx-hero-text h3{font-weight:800 !important;}
.cfx .cfx-ev-body,.cfx .cfx-side .cfx-why span,.cfx .cfx-deliver span,.cfx .cfx-when p{font-weight:600 !important;}
.cfx .cfx-dd li,.cfx .cfx-dd li span{font-weight:700 !important;}
.cfx .cfx-model td,.cfx .cfx-model th{font-weight:700 !important;} .cfx .cfx-model th,.cfx .cfx-model tbody td:first-child{font-weight:800 !important;}`;
  document.head.appendChild(st);
})();

/* Day 1's introduction graphics */
(function(){
  if(document.getElementById("cf-intro-css")) return;
  const st = document.createElement("style"); st.id = "cf-intro-css";
  st.textContent = `
.cfx-intro .cfx-sheet{text-align:left;display:flex;flex-direction:column;gap:14px;}
.cfx-intro li::before{display:none !important;content:none !important;} .cfx-intro .cfx-cv-plan li::before{display:flex !important;content:counter(pl) !important;}
.cfx-intro .cfx-cv li,.cfx-intro .cfx-cv li *{text-align:left !important;} .cfx-intro li{padding-left:0;}
.cfx-cm-band{display:flex;align-items:center;gap:12px;flex-wrap:wrap;background:#1E2340;border-radius:12px;padding:10px 14px;}
.cfx-cm-k{font:800 13px 'Inter',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#F6C08F;}
.cfx-cm-band ol{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px;}
.cfx-cm-band li{font:700 15px 'Inter',sans-serif;color:#fff;background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:999px;padding:4px 12px;}
.cfx-cm-band li i{font-style:normal;color:#F6C08F;margin-right:6px;}
.cfx-cm-track{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:0;position:relative;}
.cfx-cm-track::before{content:"";position:absolute;left:4%;right:4%;top:24px;height:6px;border-radius:3px;background:linear-gradient(90deg,#DB8437,#1E2340);}
.cfx-cm-node{position:relative;display:flex;flex-direction:column;align-items:center;text-align:center;padding:0 8px;}
.cfx-cm-n{position:relative;z-index:1;width:54px;height:54px;border-radius:50%;background:#1E2340;color:#fff;font:800 24px 'Poppins','Inter',sans-serif;display:flex;align-items:center;justify-content:center;border:5px solid #fff;box-shadow:0 0 0 3px #DB8437;}
.cfx-cm-node.on .cfx-cm-n{background:#DB8437;}
.cfx-cm-node > b{margin:10px 0 8px;font:800 18px/1.25 'Poppins','Inter',sans-serif;color:#1E2340;min-height:2.5em;}
.cfx-cm-node ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px;width:100%;}
.cfx-cm-node ul li{font:700 15.5px/1.35 'Inter',sans-serif;color:#141A2E;background:#FFF4E6;border:1.5px solid #F0C9A0;border-radius:8px;padding:6px 8px;}
.cfx-cm-k2{margin:0 0 -4px;font:800 14px 'Inter',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#A4470F;}
.cfx-cm-foot{margin:0;font:700 17px 'Inter',sans-serif;color:#A4470F;text-align:center;}
.cfx-cv{display:grid;grid-template-columns:minmax(0,1.05fr) minmax(0,1fr);gap:22px;}
.cfx-cv h3{margin:0 0 10px;font:800 21px 'Poppins','Inter',sans-serif;color:#1E2340;}
.cfx-cv-ladder{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;}
.cfx-cv-ladder > li{display:grid;grid-template-columns:40px 1fr;gap:4px 12px;align-items:center;}
.cfx-cv-o{width:40px;height:40px;border-radius:50%;background:#DB8437;color:#fff;font:800 19px 'Inter',sans-serif;display:flex;align-items:center;justify-content:center;}
.cfx-cv-bar{width:max(var(--w),46%);background:linear-gradient(90deg,#1E2340,#343C66);color:#fff;border-radius:10px;padding:8px 14px;border-left:6px solid #DB8437;}
.cfx-cv-bar b{display:block;font:800 19px 'Inter',sans-serif;text-align:left;} .cfx-cv-bar span{display:block;font:600 15px 'Inter',sans-serif;color:#E3E7F1;}
.cfx-cv-ladder em{grid-column:2;font:700 15px/1.35 'Inter',sans-serif;font-style:normal;color:#4A5068;}
.cfx-cv-total{margin:12px 0 0;font:700 18px 'Inter',sans-serif;color:#1E2340;} .cfx-cv-total b{color:#A4470F;font-size:22px;}
.cfx-cv-plan{list-style:none;counter-reset:pl;margin:0;padding:0;display:flex;flex-direction:column;gap:9px;}
.cfx-intro .cfx-cv-plan li{counter-increment:pl;position:relative;padding:9px 12px 9px 46px !important;background:#fff;border:1.5px solid #E2D7C8;border-left:5px solid #1E2340;border-radius:10px;}
.cfx-cv-plan li::before{content:counter(pl);position:absolute;left:12px;top:10px;width:24px;height:24px;border-radius:50%;background:#1E2340;color:#fff;font:800 14px 'Inter',sans-serif;display:flex;align-items:center;justify-content:center;}
.cfx-cv-plan b{display:block;font:800 17.5px/1.3 'Inter',sans-serif;color:#1E2340;} .cfx-cv-plan span{display:block;font:600 16px/1.4 'Inter',sans-serif;color:#141A2E;}
@media(max-width:900px){ .cfx-cm-track{grid-template-columns:1fr;gap:12px;} .cfx-cm-track::before{display:none;} .cfx-cv{grid-template-columns:1fr;} }`;
  document.head.appendChild(st);
})();

/* The three micro-frameworks: CM Red Flag (Why It Matters), Rule vs. Exception (The Rules), Milestone Steps (The Framework, or The Rules).
   LSH navy #1E2340 and orange #DB8437; the Red Flag in a red-bordered box with its flag icon and label, so its meaning
   never rests on colour alone; body type on them never under 16px, bold. */
(function(){
  if(document.getElementById("cf-mf-css")) return;
  const st = document.createElement("style"); st.id = "cf-mf-css";
  st.textContent = `
.cfx-rf{margin:8px 0 0;background:#FDECEA;border:2px solid #B3261E;border-left:8px solid #B3261E;border-radius:12px;padding:8px 16px 9px;text-align:left;}
.cfx-rf-h{display:flex;align-items:center;gap:10px;margin:0 0 4px;color:#B3261E;}
.cfx-rf-i{display:inline-flex;}
.cfx-rf-h b{font:800 17px var(--font-ui);letter-spacing:.08em;text-transform:uppercase;color:#7F1D1D;}
.cfx-rf-own{margin-left:auto;font:800 17px var(--font-ui);background:#1E2340;color:#fff;border-radius:999px;padding:3px 14px;white-space:nowrap;}
.cfx-rf dl{margin:0;display:flex;flex-direction:column;gap:2px;}
.cfx-rf-r{display:grid;grid-template-columns:96px minmax(0,1fr);gap:12px;align-items:baseline;}
.cfx-rf dt{font:800 17px var(--font-ui);color:#B3261E;text-transform:uppercase;letter-spacing:.03em;white-space:nowrap;}
.cfx-rf dd{margin:0;font:700 clamp(17px,2.3vh,20px)/1.35 var(--font-ui);color:#3B0D0D;}
.cfx-lesson .cfx-hero-rf{gap:16px;}
.cfx .cfx-hero-rf .cfx-hook{font-size:clamp(24px,3.6vh,32px) !important;}
.cfx-lesson .cfx-hero-rf .cfx-art{max-height:min(22vh,180px);}
.cfx-lesson .cfx-hero-rf .cfx-art svg,.cfx-lesson .cfx-hero-rf .cfx-art img{max-height:min(22vh,180px);width:auto;}
.cfx-lesson .cfx-split-rx{grid-template-columns:minmax(0,1.05fr) minmax(0,1fr) !important;justify-content:stretch !important;align-items:start !important;column-gap:24px !important;}
.cfx .cfx-split-rx .cfx-points{gap:8px;}
.cfx .cfx-split-rx .cfx-points li,.cfx .cfx-split-rx .cfx-points li span{font-size:clamp(18px,2.4vh,22px) !important;line-height:1.32 !important;}
.cfx-rx{display:flex;flex-direction:column;gap:6px;text-align:left;}
.cfx-rx-p{display:flex;flex-direction:column;gap:6px;}
.cfx-rx-rule,.cfx-rx-exc{border-radius:12px;padding:7px 14px 8px;}
.cfx-rx-rule{background:#EEF1FA;border:2px solid #1E2340;}
.cfx-rx-exc{background:#FFF3E6;border:2px solid #DB8437;}
.cfx-rx-p b{display:inline-block;font:800 17px/1.2 var(--font-ui);letter-spacing:.08em;text-transform:uppercase;padding:2px 9px;border-radius:6px;background:#1E2340;color:#fff;margin-right:6px;vertical-align:1px;}
.cfx-rx-exc b{background:#9A4E12;}
.cfx-rx-p p{margin:0;font:700 clamp(17px,2.3vh,20px)/1.32 var(--font-ui);color:#1E2340;}
.cfx-rx-exc p{color:#5A2A08;}
.cfx-rx-file,.cfx-rx-conf{margin:0;font:700 clamp(17px,2.2vh,18px)/1.3 var(--font-ui);color:#141A2E;}
.cfx-rx-file > b,.cfx-rx-conf > b{color:#9A4E12;font-weight:800;}
.cfx .cfx-ms,.cfx .cfx-ms *,.cfx .cfx-rx,.cfx .cfx-rx *,.cfx .cfx-rf,.cfx .cfx-rf *{text-align:left !important;}
.cfx .cfx-rx > *,.cfx .cfx-ms > *,.cfx .cfx-rf > *{margin-left:0 !important;margin-right:0 !important;}
.cfx-ms{margin:0 0 10px;}
.cfx-ms + .cfx-plain,.cfx-fw + .cfx-ms{margin-top:12px;}
.cfx-ms-t{margin:0 0 4px;font:800 18px var(--font-ui);color:#1E2340;text-transform:uppercase;letter-spacing:.06em;}
.cfx-ms-rail{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));gap:12px;position:relative;}
.cfx-ms-rail::before{content:"";position:absolute;left:0;right:0;top:0;height:4px;background:linear-gradient(90deg,#DB8437,#1E2340);border-radius:2px;}
.cfx-ms-rail > li{position:relative;display:grid;grid-template-columns:40px minmax(0,1fr);align-items:center;column-gap:8px;row-gap:3px;padding:10px 0 0;align-content:start;}
.cfx-ms-rail > li > .cfx-ms-done{grid-column:1 / -1;justify-self:start;}
.cfx-ms-h{display:flex;flex-wrap:wrap;align-items:center;gap:3px 8px;}
.cfx-ms-rail > li::before{display:none !important;content:none !important;}
.cfx-ms-n{position:relative;z-index:1;width:40px;height:40px;border-radius:50%;background:#DB8437;color:#161829;font:800 19px var(--font-ui);display:flex;align-items:center;justify-content:center;box-shadow:0 0 0 3px #fff;}
.cfx-ms-rail b{font:800 clamp(17px,2.2vh,19px)/1.2 var(--font-ui);color:#1E2340;}
.cfx-ms-chip{font:700 17px 'IBM Plex Mono',monospace;background:#1E2340;color:#fff;border-radius:6px;padding:2px 8px;white-space:nowrap;}
.cfx-ms-done{font:700 17px/1.28 var(--font-ui);color:#141A2E;}
.cfx-ms-done i{font-style:normal;font-weight:800;color:#9A4E12;}
.cfx-ms-note{margin:6px 0 0;font:700 17px/1.35 var(--font-ui);color:#1E2340;}
.cfx-lesson .cfx-split-ms{grid-template-columns:minmax(0,1fr) !important;justify-content:stretch !important;}
.cfx .cfx-split-ms .cfx-points li,.cfx .cfx-split-ms .cfx-points li span{font-size:clamp(18px,2.4vh,22px) !important;}
.cfx .cfx-split-ms .cfx-points{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px 24px;}
@media(max-width:600px){
  .cfx-ms-rail{grid-template-columns:minmax(0,1fr);}
  .cfx-ms-rail::before{left:0;right:auto;top:0;bottom:0;width:4px;height:auto;}
  .cfx-ms-rail > li{padding:0 0 0 12px;}
  .cfx .cfx-split-ms .cfx-points{grid-template-columns:minmax(0,1fr);}
  .cfx-ms-rail > li > .cfx-ms-done{grid-column:2;}
  .cfx-rf-r{grid-template-columns:minmax(0,1fr);gap:0;}
  .cfx-lesson .cfx-split-rx{grid-template-columns:minmax(0,1fr) !important;}
  .cfx-rx-p p,.cfx-rf dd{font-size:18px;}
}`;
  document.head.appendChild(st);
})();

/* See It tables (e.g. "John Doe's file at a glance"): bigger and bolder, the rows sharing the card's height */
(function(){
  if(document.getElementById("cf-model-big")) return;
  const st = document.createElement("style"); st.id = "cf-model-big";
  st.textContent = `
/* the model never shrinks under its content, and its table never scrolls inside the slide: a long one makes the card
   overflow, and the frame then scales the card's content to fit (fitSlideZoom), so every row is on the one screen */
.cfx .cfx-model{display:flex;flex-direction:column;flex:1 0 auto;min-height:auto;}
.cfx .cfx-model > *{flex-shrink:0;}
.cfx .cfx-model .mini-table-wrap{overflow:visible;}
.cfx .cfx-model .cfx-caption{font:800 clamp(22px,3vh,28px)/1.25 'Poppins','Inter',sans-serif !important;color:#1E2340 !important;margin:0 0 12px !important;}
.cfx .cfx-model table{width:100%;font-size:clamp(19px,2.6vh,23px) !important;}
.cfx .cfx-model th{font-size:clamp(17px,2.2vh,20px) !important;font-weight:800 !important;padding:clamp(7px,1.2vh,14px) 16px !important;}
.cfx .cfx-model td,.cfx-model tbody td{font-size:clamp(19px,2.6vh,23px) !important;font-weight:700 !important;line-height:1.3 !important;padding:clamp(6px,1.1vh,14px) 16px !important;color:#141A2E !important;}
.cfx .cfx-model tbody td:first-child{font-weight:800 !important;color:#1E2340 !important;white-space:nowrap;}
/* See It compares (✅ Do / ❌ Don't, "Matched pairs"): big, bold lines that use the card's room */
.cfx .cfx-model .lesson-compare .chead{font-size:clamp(24px,3.4vh,30px) !important;font-weight:800 !important;padding:clamp(12px,1.8vh,18px) 22px !important;}
.cfx .cfx-model .lesson-compare .cbody{padding:clamp(16px,2.4vh,26px) 24px !important;}
.cfx .cfx-model .lesson-compare .citem{font-size:clamp(22px,3.1vh,27px) !important;font-weight:700 !important;line-height:1.35 !important;color:#141A2E !important;padding-left:30px !important;margin-bottom:clamp(12px,2vh,20px) !important;}
.cfx .cfx-model .lesson-compare .citem::before{top:.45em !important;width:13px !important;height:13px !important;}`;
  document.head.appendChild(st);
})();
