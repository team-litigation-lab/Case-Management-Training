/* ============================================================
   5-DAY LEGAL CASE MANAGEMENT FLOW — the track's days, slides and wiring
   Focus case: John Doe v. Robert Smith · Lead Counsel: Atty. Elijah Thorne

   Content: js/cm-case-flow-data.js (window.CM_CASE_FLOW), the single source of
   truth. This file only turns it into this course's own day and lesson objects
   and wires them in. It does not touch the John Doe v. Apex days (1–5).

   HOW IT ATTACHES
   • Days. Each Case Flow day is a normal day object with its own id (11, 12, …),
     looked up by DAYS.find / DAYS.some but NOT pushed into DAYS. So #/day/11, the
     slideshow, the Knowledge Check and Presenter view all work, while everything
     that counts the program — "x of 5 days", the certificate, attendance, the SOP —
     still counts only Days 1–5.
   • Slides. Every block is a lesson topic in the course's own shape
     ({h, layout, fourPart, trainerCue}), so search, the SOP and Presenter view read
     it like any other topic. Its card is drawn here, from the engine's own pieces
     (renderFourPartSection, renderLessonVisual, renderPracticeCards, renderTable,
     renderCallout), so it carries the house look and whatever the universal layout
     changes next — with Tell Them / Show Them / Let Them as its section names.
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
  const lessons = [], quiz = [], quizMod = [], phases = [];
  seq.phases.forEach((ph, pi) => {
    const phase = {n: pi + 1, of: seq.phases.length, title: ph.title, count: ph.blocks.length, lane: ph.workstream || ""};
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
        cf: {day, mod, block: b, k, phase,   // day: where it is taught; mod: its unit of scoring
             heading: (ph.headings || {})[id] || (b.kind === "lesson" ? "Case Phase: " : b.kind === "activity" ? "Skill Building: " : "Learning Check: ") + ph.title}
      }, layoutOf(b.show)));
      if(b.kind === "check") (mod.quiz || []).forEach(q => { quiz.push(q); quizMod.push(mod.id); });
    });
  });
  const blocksOf = ph => ph.blocks.map(id => STORED[id]).filter(Boolean).map(x => x.block);
  const d = {
    id: day.id,
    title: day.title,
    theme: phases.map(p => p.title).join(" · "),
    objective: day.objective,
    taskOverview: seq.phases.map((ph, pi) => {
      const bs = blocksOf(ph), act = bs.find(b => b.kind === "activity");
      return {
        label: `Case Phase ${pi + 1} · ${ph.title}`,
        tasks: bs.filter(b => b.kind !== "lesson").map(b => b.title),
        sample: act ? `Sample task: ${act.act.prompt.split(". ")[0]}.` : ""
      };
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

let SWAP_KEEP = null;   // the archived days, while withCaseFlowDays() runs
/* ---------- found by id like a day, not counted as one (the js/ft-rules.js pattern) ----------
   Chains off whatever DAYS.find / DAYS.some already are, so it composes with any other patch. */
const __find = DAYS.find, __some = DAYS.some;
Object.defineProperty(DAYS, "find", {configurable: true, writable: true, value: function(fn, that){
  const r = __find.call(this, fn, that);
  if(r !== undefined) return r;
  const m = MODULES.find(x => fn.call(that, x, this.length, this));
  return m !== undefined || !SWAP_KEEP ? m : SWAP_KEEP.find(x => fn.call(that, x, this.length, this));   // while the Case Flow days stand in for DAYS, the archived days still resolve by id
}});
Object.defineProperty(DAYS, "some", {configurable: true, writable: true, value: function(fn, that){
  return __some.call(this, fn, that) || MODULES.some(m => fn.call(that, m, this.length, this));
}});
if(typeof DAY_ICONS !== "undefined") MODULES.forEach((m, i) => { if(!DAY_ICONS[m.id]) DAY_ICONS[m.id] = ["🗂", "📨", "💵", "⚖️", "🏛"][i] || "📘"; });

/* ---------- the course is the Case Flow; John Doe v. Apex is archived ----------
   Every trainee takes the Case Flow unless a trainer assigns them otherwise (Admin → the
   trainee's panel → Course version):
     caseflow  the Case Flow (the default): its days are the program on the dashboard, the
               Knowledge Checks and certificate count them, the Case File is John Doe v. Robert Smith
     both      the Case Flow, plus the archived Apex days in a row below
     classic   the archived John Doe v. Apex version (Days 1–5) only, as it was
   Nothing of the Apex version is deleted: its days stay reachable (their Skill Builders keep
   working), and trainers see it in an "Archived version" row. The choice is stored with the
   trainee's feedback (feedback:<id>, `track`): the trainer writes it, the trainee can only read it
   (worker.js keeps everything but `days` when a trainee writes). */
const TRACKS = {caseflow: "Case Flow: John Doe v. Robert Smith", both: "Case Flow + the archived Apex days", classic: "Archived: John Doe v. Apex (Days 1–5)"};
const DEFAULT_TRACK = "caseflow";
const isTrainer = () => !!(state.isAdmin || state.adminPreview);
let FB = {id: null, p: null};
const traineeFeedback = () => {   // one read of feedback:<id> per trainee, shared by the version and the trainer scores
  const id = state && state.traineeId;
  if(!id || typeof sharedGet !== "function") return Promise.resolve(null);
  if(FB.id !== id) FB = {id, p: Promise.resolve().then(() => sharedGet("feedback:" + id)).catch(() => null)};
  return FB.p;
};
function ensureTrack(){
  const id = state && state.traineeId;
  if(!id || isTrainer() || state.cfTrackFor === id || state.cfTrackLoading === id) return;
  state.cfTrackLoading = id;
  traineeFeedback().then(fb => {
    if(state.traineeId !== id || state.cfTrackFor === id) return;   // switched trainee, or already known
    const prev = state.cfTrack || DEFAULT_TRACK, t = fb && fb.track;
    state.cfTrack = TRACKS[t] ? t : DEFAULT_TRACK; state.cfTrackFor = id; state.cfTrackLoading = null;
    if(state.cfTrack !== prev && typeof render === "function" && !(typeof isTyping === "function" && isTyping())) render();
  });
}
const track = () => { if(isTrainer()) return "both"; ensureTrack(); return (state.cfTrackFor === state.traineeId && state.cfTrack) || DEFAULT_TRACK; };
const seesCaseFlow = () => track() !== "classic";

/* The trainer side reads each trainee's version from their feedback record, which the Admin page
   already fetches (one get-many for the Trainee Audit, one get when a panel opens): no extra requests. */
state.cfTrackOf = state.cfTrackOf || {};
const noteTracks = (keys, vals) => (keys || []).forEach((k, i) => {
  const key = typeof k === "string" ? k : (k && k.key), m = /^feedback:(.+)$/.exec(key || "");
  if(m) state.cfTrackOf[m[1]] = (vals[i] && TRACKS[vals[i].track]) ? vals[i].track : DEFAULT_TRACK;
});
if(typeof sharedGetMany === "function"){
  const __many = sharedGetMany;
  sharedGetMany = async function(keys){ const r = await __many.apply(this, arguments); try{ noteTracks(keys, r || []); }catch(e){} return r; };
}
const trackOf = id => { const w = (state.traineeWork || {})[id], t = w && w.feedback && w.feedback.track; return TRACKS[t] ? t : (state.cfTrackOf[id] || DEFAULT_TRACK); };

/* Run one of the engine's (synchronous) functions with the Case Flow days as the program: the
   functions that count, list or certify "the days" read DAYS, so for the length of the call DAYS
   holds the Case Flow days, and is put back before anything else runs. */
function withCaseFlowDays(fn){
  if(DAYS.__cfSwap) return fn();
  const keep = SWAP_KEEP = Array.prototype.slice.call(DAYS);
  Array.prototype.splice.call(DAYS, 0, DAYS.length, ...MODULES);
  Object.defineProperty(DAYS, "__cfSwap", {configurable: true, value: true});
  try{ return fn(); }
  finally{ Array.prototype.splice.call(DAYS, 0, DAYS.length, ...keep); delete DAYS.__cfSwap; SWAP_KEEP = null; }
}
const relabelAll = html => relabel(html, MODULES[0]);

/* Program counts follow the trainee's version (the Case Flow, or the archived Apex days): a day of
   the other version never moves "Program complete" or the average. */
const programIds = () => new Set(track() !== "classic" ? MODULES.map(d => d.id) : Array.prototype.map.call(DAYS, d => d.id));   // the program is the Case Flow, unless the trainee is on the archived version
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
  if(!seesCaseFlow()) return false;
  if(d.cf.n === 1) return true;
  const prev = cfDayByN(d.cf.n - 1), p = prev && (state.progress || {})[prev.id];
  return !!(p && p.done);
};
if(typeof dayLockReason === "function"){
  const __reason = dayLockReason;
  dayLockReason = function(id){
    const d = cfDay(id); if(!d) return __reason.apply(this, arguments);
    if(!seesCaseFlow()) return "You're on the archived version of the course. Ask your trainer to move you to the Case Flow.";
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
   Case Flow day the trainee can't open (the Case Flow isn't assigned to them). */
if(typeof resumeLabel === "function"){
  const __resume = resumeLabel;
  resumeLabel = function(){
    const lv = state.lastView, d = lv && lv.view === "day" && cfDay(lv.dayId);
    if(d && !dayUnlocked(d.id)) return "";
    if(lv && lv.view === "day" && !d && track() === "caseflow") return "";   // an archived Apex day isn't theirs to resume
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

function rubricHtml(r){
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
      <tbody>${b.check.scale.map((c, j) => `<tr><td>${E(c)}</td>${CF.scale.map(([n]) => `<td><input type="radio" name="cfsc_${mod.id}_${j}" value="${n}" aria-label="${E(c)}: ${n}" ${m.scale[j] === n ? "checked" : ""} onchange="cmCaseFlow.rate('${mod.id}',${j},${n})"></td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="cf-legend">${CF.scale.map(([n, t]) => `<b>${n}</b> ${E(t)}`).join(" · ")}</p>`;
  const st = `<span class="cf-ss-st" id="cfss_st_${mod.id}">${m.savedAt ? "Saved " + E(new Date(m.savedAt).toLocaleString()) : ""}</span>`;
  const save = `<button type="button" class="btn btn-ghost btn-sm" onclick="cmCaseFlow.save('${mod.id}')">Save</button>`;
  if(part === "qs") return `<div class="cf-ss" data-mod="${mod.id}">${qs}<div class="cf-ss-act">${save}${st}<span class="cf-note">Next: rate yourself on the Skill Scale, then submit.</span></div></div>`;
  return `<div class="cf-ss" data-mod="${mod.id}">${part === "scale" ? "" : qs}${scale}
      <div class="cf-ss-act">${save}
      <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.review(${day.id},'${mod.id}')">Submit for review</button>
      ${st}</div>
      <div id="cfss_res_${mod.id}">${scoreHtml(mod.id)}</div></div>`;
}

/* ---------- the full text of a block (the curriculum as written), behind "📖 Full text" ---------- */
function fullText(l, d){
  const {block: b} = l.cf;
  if(b.kind === "lesson") return S(1, "Tell Them — the rules and the strategic why", `<p class="cf-why">${E(b.tell.why)}</p>${ul(b.tell.rules)}`
      + (b.tell.upl || []).map(u => renderCallout({type: "warning", label: "UPL boundary", text: u})).join(""))
    + S(2, showLabel(b, "Show Them"), visual(l, b))
    + S(3, "Trigger ➔ Task ➔ Tool ➔ Checkpoint", opsTable(b.ops))
    + S(4, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
  if(b.kind === "activity") return S(1, "Let Them — the scenario", `<div class="scenario-card"><div class="stag">John Doe v. Robert Smith</div><p class="scn">${E(b.act.scenario)}</p></div>`)
    + S(2, "Let Them — execute on the live file", `<p class="cf-prompt">${E(b.act.prompt)}</p><div class="cf-tool"><div><b>🛠 Tool / interface</b><span>${E(b.act.tool)}</span></div><div><b>📤 Expected output</b><span>${E(b.act.output)}</span></div></div>`)
    + S(3, "Verification checkpoints", ul(b.act.checkpoints))
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
const trackOfDay = day => (/Track ([AB])/.exec((day && day.track) || "") || [])[1] || "";
function eventCard(e, extra){
  const [icon, label] = CHANNEL[e.channel] || ["📌", "Message"];
  const att = (e.attachments || []).map(id => CF_DOCS.find(x => x.id === id)).filter(Boolean);
  return `<div class="cfx-ev cfx-ev-${E(e.channel)}${extra ? " " + extra : ""}">
      <div class="cfx-ev-h"><span class="cfx-ev-i">${icon}</span><span class="cfx-ev-ch">${E(label)}</span><span class="cfx-ev-from">${E(e.from || "")}</span>
        <span class="cfx-ev-when">${E(e.date || "")}${e.time ? " · " + E(e.time) : ""}</span></div>
      <div class="cfx-ev-subj">${E(e.subject || "")}</div>
      <p class="cfx-ev-body">${E(e.body || "")}</p>
      ${att.length ? `<div class="cfx-ev-att">${att.map(x => `<a href="${E(docUrl(x))}" target="_blank" rel="noopener" title="${E(x.desc)}">📎 ${E(x.title)}</a>`).join("")}</div>` : ""}
    </div>`;
}
const LANES = {claims: "Claims & Coverage", care: "Client & Treatment"};
/* where a workstream stands for a trainee on Case Flow Day n: the first event it has on that day, else its last before */
function laneAt(lane, n){
  const evs = MODULES.filter(d => d.cf.n <= n).flatMap(d => d.lessons.filter(l => l.cf.block.kind === "activity" && l.cf.phase.lane === lane && SIM.events[l.cf.block.id]).map(l => ({n: d.cf.n, e: SIM.events[l.cf.block.id], title: l.cf.block.title})));
  return evs.find(x => x.n === n) || evs[evs.length - 1] || null;
}
/* the case's milestones around a date, with "you are here"; on a workstream, that lane's milestones */
function timelineStrip(at, track, lane, n){
  const t = dayMs(at), all = (SIM.timeline || []).filter(m => (!m.track || !track || m.track === track) && (!lane || !m.lane || m.lane === lane));
  if(!all.length || isNaN(t)) return "";
  let k = all.findIndex(m => dayMs(m.date) > t); if(k < 0) k = all.length;
  const show = all.slice(Math.max(0, k - 3), Math.min(all.length, k + 3)), cut = show.findIndex(m => dayMs(m.date) > t);
  const dot = (m, past) => `<li class="${past ? "past" : "next"}"><i></i><b>${E(m.label)}</b><small>${E(m.date)}</small></li>`;
  const here = `<li class="here"><i></i><b>You are here</b><small>${E(at)}</small></li>`;
  const items = show.map((m, j) => (j === cut ? here : "") + dot(m, cut < 0 || j < cut)).join("") + (cut < 0 ? here : "");
  const other = lane && laneAt(lane === "claims" ? "care" : "claims", n);
  const head = lane ? `<div class="cfx-lane"><span class="cfx-lane-on cfx-lane-${lane}">${E(LANES[lane])} workstream</span>${other ? `<span class="cfx-lane-off">${E(LANES[lane === "claims" ? "care" : "claims"])} runs in parallel: last at ${E(other.e.date)}, ${E(other.title)}</span>` : ""}</div>` : "";
  return `${head}<ol class="cfx-tl">${items}</ol>`;
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
const VIEW_LABEL = {why: "Why It Matters", rules: "The Rules", model: "See It", job: "On the Job", dodont: "Do & Don't",
  case: "Your Case", task: "Your Task", check: "Check Your Work", questions: "Knowledge Check", questions2: "Knowledge Check, Continued", summary: "Self-Summary", scale: "Skill Scale"};
const VIEW_ICON = {why: "💡", rules: "📏", model: "🔍", job: "🛠", dodont: "✅", case: "📂", task: "🎯", check: "☑️", questions: "🧠", questions2: "🧠", summary: "📝", scale: "📊"};
const KC_PER = 4;   // Knowledge Check questions on one slide
function viewsOf(b){
  if(b.kind === "lesson") return ["why", "rules"].concat(b.show ? ["model"] : [], (b.ops || []).length ? ["job"] : [], (b.best || []).length ? ["dodont"] : []);
  if(b.kind === "activity") return ["case", "task"].concat(b.show ? ["model"] : [], ["check"]);
  return (copyOf(b).questions.length > KC_PER ? ["questions", "questions2"] : ["questions"]).concat(["summary", "scale"]);
}
const SMALL = new Set(["a", "an", "the", "and", "or", "but", "nor", "of", "to", "in", "on", "for", "at", "by", "with", "from", "as", "per", "vs.", "v.", "via", "into"]);
const titleCase = t => String(t || "").split(/(\s+|—|–|\/)/).map((w, i, a) => {
  if(!/[a-z]/.test(w) || /[A-Z]/.test(w.slice(1)) || /\d/.test(w)) return w;   // acronyms, mixed case (LORs), numbers stay as they are
  const first = i === 0, last = i === a.length - 1;
  return (!first && !last && SMALL.has(w.toLowerCase())) ? w.toLowerCase() : w.charAt(0).toUpperCase() + w.slice(1);
}).join("");
const hl = t => E(t).replace(/\*\*(.+?)\*\*/g, '<mark class="cfx-hl">$1</mark>');
const words = (t, n) => { const w = String(t || "").replace(/\s+/g, " ").trim().split(" "); return w.length <= n ? w.join(" ") : w.slice(0, n).join(" ").replace(/[,;:]$/, "") + "…"; };
const firstSentence = t => (String(t || "").match(/^.*?[.!?](\s|$)/) || [t])[0].trim();
function copyOf(b){   // the block's concise copy, or a condensed fallback from its full text
  const c = SLIDES[b.id] || {};
  const best = b.best || [], dos = best.filter(x => !/^pitfall/i.test(x)), donts = best.filter(x => /^pitfall/i.test(x)).map(x => x.replace(/^pitfall:\s*/i, ""));
  if(b.kind === "lesson") return {image: c.image, hook: c.hook || words(firstSentence(b.tell.why), 22), points: c.points || b.tell.rules.slice(0, 4).map(r => words(r, 16)),
    upl: c.upl !== undefined ? c.upl : ((b.tell.upl || [])[0] ? words(b.tell.upl[0], 18) : ""), job: c.job || (b.ops || []).slice(0, 3).map(r => r.map(x => words(x, 7))),
    dos: c.dos || dos.slice(0, 3).map(x => words(x, 12)), donts: c.donts || donts.slice(0, 3).map(x => words(x, 12))};
  if(b.kind === "activity") return {image: c.image, situation: c.situation || words(b.act.scenario, 36), steps: c.steps || [words(b.act.prompt, 30)],
    deliver: c.deliver || words(b.act.output, 18), checks: c.checks || b.act.checkpoints.slice(0, 5).map(x => words(x, 12)),
    dos: c.dos || dos.slice(0, 2).map(x => words(x, 12)), donts: c.donts || donts.slice(0, 2).map(x => words(x, 12))};
  return {image: c.image || "knowledge-check", questions: c.questions || b.check.questions};
}
const art = (key, cls) => ART[key] ? `<div class="cfx-art ${cls || ""}" aria-hidden="true">${ART[key]}</div>` : "";
// the tools an activity names, as buttons that open them (the course's own tool launcher)
const TOOL_OF = [[/Call Simulator/, "calls", "📞 Call Simulator"], [/Email Workspace/, "email", "✉️ Email Workspace"], [/Docket System/, "docket", "⚖️ Docket System"],
  [/Medical Records Requests/, "records", "🗂 Medical Records Requests"], [/Calendar Conflict Resolver/, "calendaring", "🗓 Calendaring"], [/CMS|Action Plan Editor|Lien Tracker|Tasks/, "cms", "🗂 Open the CMS"]];
function toolButtons(tool){
  if(typeof openTool !== "function") return "";
  const seen = new Set();
  return TOOL_OF.filter(([re, id]) => re.test(tool) && !seen.has(id) && seen.add(id))
    .map(([, id, label]) => `<button type="button" class="btn btn-navy btn-sm" onclick="openTool('${id}')">${label}</button>`).join("");
}
function slideBody(view, l, d){
  const {block: b, day, mod} = l.cf, c = copyOf(b);
  switch(view){
    case "why": return `<div class="cfx-hero"><div class="cfx-hero-text"><span class="cfx-chip">${E(titleCase(b.topic))}</span><p class="cfx-hook">${hl(c.hook)}</p></div>${art(c.image)}</div>${strip()}`;
    case "rules": return `<div class="cfx-split"><ol class="cfx-points">${c.points.map(x => `<li><span>${hl(x)}</span></li>`).join("")}</ol>${art(c.image, "small")}</div>
      ${c.upl ? `<div class="cfx-upl"><b>⚖ UPL Line</b><span>${hl(c.upl)}</span></div>` : ""}`;
    case "model": return `<div class="cfx-model">${b.show && b.show.caption ? `<p class="cfx-caption">${E(b.show.caption)}</p>` : ""}${visual(l, b)}</div>`;
    case "job": return `<div class="cfx-job">${c.job.map(r => `<div class="cfx-flow">${r.map((x, j) => `<div class="cfx-step"><small>${["Trigger", "Task", "Tool", "Checkpoint"][j]}</small><span>${hl(x)}</span></div>`).join('<span class="cfx-arrow">➔</span>')}</div>`).join("")}</div>`;
    case "dodont": return `<div class="cfx-dd"><div class="cfx-do"><h3>✅ Do</h3><ul>${c.dos.map(x => `<li>${hl(x)}</li>`).join("")}</ul></div>
      <div class="cfx-dont"><h3>⚠️ Don't</h3><ul>${c.donts.map(x => `<li>${hl(x)}</li>`).join("")}</ul></div></div>`;
    case "case": {
      const docs = (CF_PACKETS[b.id] || []).map(id => CF_DOCS.find(x => x.id === id)).filter(Boolean).slice(0, 4);
      const ev = SIM.events[b.id], fall = falloutFor(b.id);
      const thumbs = docs.length ? `<div class="cfx-docs-row">${docs.map(x => `<a class="cfx-thumb" href="${E(docUrl(x))}" target="_blank" rel="noopener" title="${E(x.desc)}"><img src="/decks/cf-docs/${E(x.id)}.webp" alt="" loading="lazy"><span>${E(x.title)}</span></a>`).join("")}</div>` : art(c.image, "small");
      return `<div class="cfx-sb">
        ${ev ? timelineStrip(ev.date, trackOfDay(day), l.cf.phase.lane, d.cf.n) : ""}
        <div class="cfx-challenge"><span>“${E(b.title.toUpperCase())}”</span></div>
        ${fall.map(x => { const e = x.f.then.event, [icon] = CHANNEL[e.channel] || ["⚠️"];
          return `<details class="cfx-fall"><summary><span class="cfx-fall-i">⚠️</span><b>${E(e.subject)}</b><span class="cfx-fall-from">${icon} ${E(e.from || "")}</span></summary>
            <p>${E(e.body)}</p>${isTrainer() ? `<small class="cfx-fall-why">${x.done ? "Not shown to this trainee: they confirmed" : "Shown because this wasn't confirmed"}: “${E(x.what)}” (${E(x.f.if.activity)})</small>` : ""}</details>`; }).join("")}
        <div class="cfx-sb-grid">
          <div class="cfx-sb-main">${ev ? eventCard(ev) : `<div class="cfx-task-card"><span class="cfx-chip">📂 On the file</span><p class="cfx-situation">${hl(c.situation)}</p></div>`}</div>
          <div class="cfx-sb-docs">${thumbs}</div>
        </div></div>`;
    }
    case "task": return `<div class="cfx-task"><ol class="cfx-points">${c.steps.map(x => `<li><span>${hl(x)}</span></li>`).join("")}</ol>
      <aside class="cfx-side"><div><b>🛠 Where</b><span>${E(b.act.tool)}</span><div class="cfx-btns">${toolButtons(b.act.tool)}</div></div>
        ${docLine(b.id) ? `<details class="cfx-docs"><summary><b>📁 Work From</b> · ${(CF_PACKETS[b.id] || []).length} Documents</summary>${docLine(b.id)}</details>` : ""}
        ${SIM.calls[b.id] ? `<div class="cfx-call"><b>📞 Live Call</b><span>${E(SIM.calls[b.id].who)} is on the line${(REC.calls || {})[b.id] ? ` · <em>✓ taken ${E(new Date(REC.calls[b.id].at).toLocaleDateString())}</em>` : ""}</span>
          <button type="button" class="btn btn-orange btn-sm" onclick="cmCaseFlow.call('${b.id}')">📞 Take the call</button></div>` : ""}
        <div class="cfx-deliver"><b>📤 Deliver</b><span>${hl(c.deliver)}</span></div></aside></div>`;
    case "check": return `<div class="cfx-check">${c.checks.map((x, j) => `<label class="cfx-tick"><input type="checkbox" ${((REC.ticks || {})[b.id] || [])[j] ? "checked" : ""} onchange="cmCaseFlow.tick('${b.id}',${j},this.checked)"><span>${hl(x)}</span></label>`).join("")}</div>
      ${c.donts.length ? `<div class="cfx-watch"><b>⚠️ Watch For</b>${c.donts.map(x => `<span>${hl(x)}</span>`).join("")}</div>` : ""}`;
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
function card(l, i, d, part){
  const {day, mod, block: b, k, phase} = l.cf, vs = viewsOf(b), p = Math.min(Math.max(part || 1, 1), vs.length), view = vs[p - 1];
  const dots = vs.map((v, j) => `<span class="cfx-dot${j === p - 1 ? " on" : j < p - 1 ? " done" : ""}" title="${E(VIEW_LABEL[v])}"></span>`).join("");
  const logo = typeof LOGO_FULL_SRC !== "undefined" ? `<img class="cfx-logo" src="${LOGO_FULL_SRC}" alt="Legal Support Help">` : "";
  const onNavy = view === "case";   // a Skill Building opener sits on the slide itself, like the deck's
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${day.n}${day.track ? ` &middot; ${E(day.track).toUpperCase()}` : ""} &middot; CASE PHASE ${phase.n} OF ${phase.of} &middot; ${KIND[b.kind].toUpperCase()} &middot; BLOCK ${k + 1} OF ${mod.blocks.length} &middot; ${VIEW_LABEL[view].toUpperCase()}</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-${view} cfx-${b.kind}" data-part="${p}">
      <div class="cfx-deck-head">${logo}<h2 class="cfx-deck-title">${E(l.cf.heading)}</h2></div>
      <div class="cfx-ribbon"><span>${E(titleCase(b.title))}</span></div>
      <div class="cfx-top"><span class="cfx-title cfx-pill"><span class="cfx-vi">${VIEW_ICON[view]}</span>${E(VIEW_LABEL[view])}</span>
        <span class="cfx-dots" aria-label="Slide ${p} of ${vs.length}">${dots}</span><span class="cfx-kicker">${phase.n}.${k + 1} · ${E(KIND[b.kind])}</span>
        <button type="button" class="cfx-full" onclick="cmCaseFlow.full(${d.id},${i})">📖 Full text</button></div>
      ${onNavy ? slideBody(view, l, d) : `<div class="cfx-sheet">${slideBody(view, l, d)}</div>`}
    </div>`;
}
if(!document.getElementById("cfx-deck-font")){
  const f = document.createElement("link"); f.id = "cfx-deck-font"; f.rel = "stylesheet";
  f.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@600;700;800&display=swap";
  document.head.appendChild(f);
}
window.cmCaseFlow = window.cmCaseFlow || {};
window.cmCaseFlow.full = function(dayId, i){
  const d = cfDay(dayId), l = d && d.lessons[i]; if(!l) return;
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
    // the day's lessons are already in the order the course teaches them (CF.sequence): each Case Phase's
    // lessons, uninterrupted → its activities and practice → its Learning Check; each block is one slide per view
    const out = [];
    s.forEach(sl => {
      if(sl.type !== "topic") return out.push(sl);
      if(sl.part !== 1) return;
      viewsOf(d.lessons[sl.lessonIndex].cf.block).forEach((v, j) => out.push({type: "topic", lessonIndex: sl.lessonIndex, part: j + 1}));
    });
    return out;
  };
}
function agendaSlide(d){
  const logo = typeof LOGO_FULL_SRC !== "undefined" ? `<img class="cfx-logo" src="${LOGO_FULL_SRC}" alt="Legal Support Help">` : "";
  const src = CF.days.find(x => x.n === d.cf.n) || {};
  const rows = d.cf.phases.map(ph => {
    const ls = d.lessons.filter(l => l.cf.phase === ph), n = kind => ls.filter(l => l.cf.block.kind === kind).length;
    return `<li><span class="cfx-ag-n">${String(ph.n).padStart(2, "0")}</span><div><b>${E(ph.title)}</b>
      <small>${n("lesson")} lessons · Skill Building: ${n("activity")} activities in the CMS · Learning Check</small></div></li>`;
  }).join("");
  return `<div class="card lesson-card cf-card cfx cfx-deck cfx-agenda">
      <div class="cfx-deck-head">${logo}<h2 class="cfx-deck-title">Case Management Training</h2></div>
      <div class="cfx-ribbon"><span>Day ${d.cf.n} · Training Agenda</span></div>
      <div class="cfx-ag"><ol class="cfx-ag-list">${rows}</ol>
        <div class="cfx-ag-side"><p class="cfx-ag-day">${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</p><p>${E(src.objective || "")}</p></div></div>
    </div>`;
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
/* while a Case Flow call is live, the caller and the reviewer know John Doe v. Robert Smith, not the archived file */
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
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    return (slide && slide.type === "taskOverview" && cfDay(d && d.id)) ? agendaSlide(d) : __content.apply(this, arguments);
  };
}
if(typeof daySlideTitle === "function"){
  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){
    if(cfDay(d && d.id) && slide && slide.type === "taskOverview") return "Training Agenda";
    if(cfDay(d && d.id) && slide && slide.type === "topic"){ const l = d.lessons[slide.lessonIndex]; const v = viewsOf(l.cf.block)[(slide.part || 1) - 1]; return `${l.h} — ${VIEW_LABEL[v] || ""}`; }
    return __title.apply(this, arguments);
  };
}
if(typeof slideScript === "function"){   // Presenter view: each slide has its own script (p1, p2, … pN below)
  const __script = slideScript;
  slideScript = function(d, l, part){
    const n = l && l.cf && (window.SLIDE_SCRIPTS || {})[`${d.id}::${l.h}`];
    const h = n && n["p" + (part || 1)];
    return h ? {why: h.why || "", talk: h.talk || "", walk: h.walk || [], ask: h.ask || "", scenario: h.scenario || "", hand: true} : __script.apply(this, arguments);
  };
}

/* ---------- Presenter view: the speaker notes, as this course's slide scripts ---------- */
window.SLIDE_SCRIPTS = window.SLIDE_SCRIPTS || {};
MODULES.forEach(d => d.lessons.forEach(l => {
  const b = l.cf.block, n = b.notes || [], vs = viewsOf(b), best = (b.best || []).map(x => String(x).replace(/^pitfall:\s*/i, "Watch for this: "));
  const per = {   // one script per slide (view); the block's speaker notes spread across its slides
    why: {why: b.tell && b.tell.why, talk: n[0] || ""},
    rules: {why: "The rules, and where the Case Manager's role ends.", walk: ((b.tell && b.tell.rules) || []).concat((b.tell && b.tell.upl) || []), ask: n[1] || ""},
    model: {why: (b.show && b.show.caption) || "The model to follow.", talk: b.visual || ""},
    job: {why: "Trigger ➔ Task ➔ Tool ➔ Checkpoint: how it runs on the job.", walk: (b.ops || []).map(r => r.join(" ➔ "))},
    dodont: {why: "How this block is graded, and what to watch for.", talk: n.slice(2).join(" "), walk: best},
    case: {why: b.act && b.act.scenario, talk: [SIM.events[b.id] ? `What just landed on the file (${SIM.events[b.id].date}): ${SIM.events[b.id].subject}. ${SIM.events[b.id].body}` : "", n[0] || ""].filter(Boolean).join(" ")},
    task: {why: b.act && b.act.prompt, walk: b.act ? [`Tool: ${b.act.tool}`, `Output: ${b.act.output}`].concat(SIM.calls[b.id] ? [`Live call: ${SIM.calls[b.id].who}. The trainee must: ${SIM.calls[b.id].goals.join("; ")}.`] : []) : [], ask: n[1] || ""},
    check: {why: "Check the work against the verification checkpoints.", talk: n.slice(2).join(" "), walk: ((b.act && b.act.checkpoints) || []).concat(best)},
    questions: {why: "Knowledge check: answers come from this file, in the trainee's own words, typed under each question.", walk: ((b.check && b.check.questions) || []).slice(0, KC_PER), talk: n[0] || ""},
    questions2: {why: "Knowledge check, continued.", walk: ((b.check && b.check.questions) || []).slice(KC_PER)},
    summary: {why: "Self-Summary: the principles, in the trainee's own words.", talk: n.slice(1).join(" "), scenario: d.discussionQuestion || ""},
    scale: {why: "Skill Scale: rate each competency 1–5, then submit for review.", ask: "Compare each trainee's self-rating with their score, and talk through any wide gap."}
  };
  const sc = {};
  vs.forEach((v, j) => { const x = per[v] || {}; sc["p" + (j + 1)] = {why: x.why || "", talk: x.talk || "", walk: x.walk || [], ask: x.ask || "", scenario: x.scenario || ""}; });
  window.SLIDE_SCRIPTS[`${d.id}::${l.h}`] = sc;
}));

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
    }
    return r;
  };
  submitQuiz = wrapped; window.submitQuiz = wrapped;
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
  tick(blockId, j, on){ REC.ticks = REC.ticks || {}; (REC.ticks[blockId] = REC.ticks[blockId] || [])[j] = !!on; persist(); },
  kcDraft(modId, j, v){ rec(modId).kc[j] = v; clearTimeout(draftTimer); draftTimer = setTimeout(() => { persist(); status(modId, "Draft saved"); }, 900); },
  async save(modId){ const m = readForm(modId); m.savedAt = new Date().toISOString(); await persist(); status(modId, "Saved " + new Date(m.savedAt).toLocaleString()); },
  async review(dayId, modId){
    const d = cfDay(dayId), m = readForm(modId);
    const mod = allMods().map(x => x.m).find(x => x.id === modId);
    const b = mod.blocks.find(x => x.kind === "check");
    if(m.answers.filter(a => String(a || "").trim().split(/\s+/).length >= 12).length < b.check.summary.length){
      if(typeof toast === "function") toast("Answer each Self-Summary prompt in a few sentences first."); return;
    }
    if(b.check.scale.some((_, j) => !m.scale[j])){ if(typeof toast === "function") toast("Rate yourself 1–5 on every competency first."); return; }
    if(b.check.questions.some((_, j) => String(m.kc[j] || "").trim().split(/\s+/).filter(Boolean).length < 3)){
      if(typeof toast === "function") toast("Answer each Knowledge Check question first (the slides before the Self-Summary)."); return;
    }
    m.savedAt = new Date().toISOString(); await persist();
    if(typeof runRubricEvaluation !== "function"){ status(modId, "Saved. The AI reviewer isn't available here; your trainer will review it."); return; }
    status(modId, "Reviewing…");
    const c = CF.case, day = CF.days.find(x => x.id === dayId);
    const label = `Day ${dayId} · Case Flow Day ${d.cf.n} · ${b.title} — CM Self-Summary`;   // "Day <id>" files it under this day, not under Apex Day ${d.cf.n}
    const ctx = `Case: ${c.style}, ${c.type}. Lead Counsel ${c.counsel}. DOL ${c.dol}; SOL ${c.sol}. Client ${c.client.name}, ${c.client.position}. `
      + `Coverage stack (in order): ${stackLayers().map(l => `${l.tag} ${money(l.limit)} (${l.carrier})`).join(" → ")} = ${money(c.total)}. `
      + `Health Plan ${c.health.carrier} (${c.health.memberId}). Critical fact: ${c.critical}\n`
      + (day && (day.fileState || []).length ? `Where the file stands on Case Flow Day ${day.n} (${day.phase}): ${day.fileState.join(" ")}\n` : "")
      + `Module: ${mod.title} — ${mod.about}\nThe module's knowledge-verification questions were:\n- ${b.check.questions.join("\n- ")}`;
    const text = `Knowledge Check answers:\n${b.check.questions.map((q, j) => `${j + 1}. ${q}\n${m.kc[j] || ""}`).join("\n\n")}\n\nSelf-Summary:\n`
      + b.check.summary.map((q, j) => `${q}\n${m.answers[j] || ""}`).join("\n\n")
      + `\n\nSelf-ratings (1–5): ${b.check.scale.map((s, j) => `${s}: ${m.scale[j]}`).join("; ")}`;
    const notes = `Grade against this module's rubric. AI criteria: ${b.rubric.ai.map(r => `${r[0]} (${r[1]}%): ${r[2]}`).join("; ")}. `
      + `A trainer separately assesses: ${b.rubric.trainer.map(r => r[0]).join(", ")}. `
      + `UPL is a gate: if the trainee proposes giving the client legal advice (case value, merits, what silence does to their rights, announcing withdrawal), score Risk Mitigation 0 and say so. `
      + `Use the case facts above; numbers that contradict them (limits, dates, order of the stack, the 14-day gap, the figures for this day) are accuracy errors.`;
    try{
      const rep = await runRubricEvaluation(label, ctx, text, notes);
      m.ai = {score: Math.round(rep.totalScore), tier: rep.gradeTier || "", strengths: (rep.strengths || []).slice(0, 3),
              gaps: (rep.blindspots || []).slice(0, 3), growth: (rep.growthSuggestions || []).slice(0, 2), at: new Date().toISOString()};
      await persist();
      status(modId, "Reviewed");
    }catch(e){
      status(modId, e && e.invalidInput ? (e.message || "Add more detail and try again.") : "Saved. The AI review didn't complete; your trainer will still see your answers.");
    }
    const res = document.getElementById(`cfss_res_${modId}`); if(res) res.innerHTML = scoreHtml(modId);
  }
});

/* ---------- the dashboard: the Case Flow is the program ----------
   The engine draws the dashboard with the Case Flow days as DAYS, so the day cards, the banner's
   day circles, the stats band and the certificate are all the Case Flow's. Trainers (and trainees on
   "both") get the archived Apex days in a row below. On a laptop the dashboard fills exactly one
   screen (js/lsh-dashboard.js grows the day cards into the height that's left), so that row goes
   after the one-screen block (.cf-first), a scroll below, never squeezing it. */
if(typeof renderDashboard === "function"){
  const __dash = renderDashboard;
  renderDashboard = function(){
    const v = track();
    if(v === "classic") return __dash.apply(this, arguments);   // the archived version, as it was
    const t = document.createElement("template");
    t.innerHTML = relabelAll(withCaseFlowDays(() => __dash.apply(this, arguments)));
    t.content.querySelectorAll(".step-circle").forEach(c => { const d = cfDay(c.textContent.trim()); if(d) c.textContent = String(d.cf.n); });   // the circles show 1–5, not the ids
    if(v === "caseflow" || typeof moduleCard !== "function") return t.innerHTML;
    const main = t.content.querySelector(".dash-main"), layout = main && main.closest(".dash-layout");
    if(!layout || layout.parentNode !== t.content) return t.innerHTML;
    const sec = document.createElement("section");
    sec.className = "cf-dash cf-archive";
    sec.innerHTML = `<div class="cf-dash-head"><p class="eyebrow">🗄 Archived version</p>
        <h2>John Doe v. Apex Delivery Services (Days 1–5)</h2>
        <p>The course's earlier version, kept as it was. ${isTrainer() ? "Trainees don't see it unless you assign it: Admin → the trainee's panel → Course version." : "Your trainer has given you access to it alongside the Case Flow."}</p></div>
      <div class="module-grid">${Array.prototype.map.call(DAYS, d => moduleCard(d)).join("")}</div>`;
    const first = document.createElement("div"); first.className = "cf-first";
    const top = layout.previousElementSibling && layout.previousElementSibling.classList.contains("dash-top") ? layout.previousElementSibling : null;
    layout.before(first);
    if(top) first.appendChild(top);
    first.appendChild(layout);
    first.after(sec);
    return t.innerHTML;
  };
}
/* The certificate counts the trainee's own program (the Case Flow days, unless they're on the archived version). */
if(typeof certData === "function"){
  const __cert = certData;
  certData = function(src){
    const archived = src ? trackOf(src.traineeId) === "classic" : track() === "classic";
    return archived ? __cert.apply(this, arguments) : withCaseFlowDays(() => __cert.apply(this, arguments));
  };
}

/* ---------- the Admin page: each trainee's progress, audit and day feedback follow their version ---------- */
const onCaseFlow = rec => !!rec && trackOf(rec.id) !== "classic";
if(typeof adminDayStats === "function"){
  const __stats = adminDayStats;
  adminDayStats = function(rec){
    // the engine counts every day on the record; count only the trainee's own version's days
    const dp = rec.dayProgress || {}, ps = (onCaseFlow(rec) ? MODULES : Array.prototype.slice.call(DAYS)).map(d => dp[d.id]).filter(Boolean);
    const scores = ps.filter(p => typeof p.score === "number").map(p => p.score);
    return {done: ps.filter(p => p.done).length, total: onCaseFlow(rec) ? MODULES.length : __stats.apply(this, arguments).total, avg: scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0};
  };
}
if(typeof auditSummary === "function"){
  const __audit = auditSummary;
  auditSummary = function(rec){ return onCaseFlow(rec) ? withCaseFlowDays(() => __audit.apply(this, arguments)) : __audit.apply(this, arguments); };
}
if(typeof renderAuditStrip === "function"){
  const __strip = renderAuditStrip;
  renderAuditStrip = function(rec){
    if(!onCaseFlow(rec)) return __strip.apply(this, arguments);
    // the strip's day cells show the day's number (11–15 inside); on screen they're Case Flow Days 1–5
    const html = withCaseFlowDays(() => __strip.apply(this, arguments))
      .replace(/\bDay ((?:1[1-5])(?:, 1[1-5])+)\b/g, (m, list) => "Case Flow Day " + list.split(", ").map(x => cfDay(x).cf.n).join(", "))   // "below 70%: Day 11, 12"
      .replace(/(<span class="ad-cell[^"]*" title="[^"]*">)(1[1-5])/g, (m, a, id) => a + cfDay(id).cf.n);
    return relabelAll(html);
  };
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
function trainerPanel(rec){
  const work = (state.traineeWork || {})[rec.id];
  if(!work || work.loading || !work.feedback) return "";
  const mine = (work.snap || {})[KEY] || {modules: {}}, given = work.feedback.caseFlow || {}, sid = cssId(rec.id);
  const rows = checksTaught().map(({n, phase, m, b}) => {
    const r = mine.modules[m.id] || {}, t = given[m.id] || {};
    const c = composite(Object.assign({}, r, {trainer: t}));
    const answered = (r.answers || []).some(a => String(a || "").trim());
    return `<details class="cf-tr"><summary><b>Case Flow Day ${n} · Case Phase ${phase.n}</b> ${E(b.title)}
        <span class="cf-tr-chips">${r.quiz ? `<span class="fb-chip sent">Quiz ${E(r.quiz.pct)}%</span>` : ""}${r.ai ? `<span class="fb-chip sent">AI ${E(r.ai.score)}%</span>` : ""}${typeof t.score === "number" ? `<span class="fb-chip sent">Trainer ${E(t.score)}%</span>` : (answered ? `<span class="fb-chip draft">To score</span>` : `<span class="fb-chip none">No summary yet</span>`)}${c.c != null ? `<span class="fb-chip sent">Composite ${E(c.c)}%</span>` : ""}</span></summary>
      ${answered ? `<div class="fb-evidence">${(r.kc || []).some(Boolean) ? b.check.questions.map((q, j) => `<div><b>KC ${j + 1}. ${E(q)}</b><br>${E((r.kc || [])[j] || "—")}</div>`).join("") : ""}${b.check.summary.map((q, j) => `<div><b>${E(q)}</b><br>${E((r.answers || [])[j] || "—")}</div>`).join("")}
        <div><b>Self-ratings:</b> ${b.check.scale.map((x, j) => `${E(x)}: ${E((r.scale || [])[j] || "—")}`).join(" · ")}</div></div>` : ""}
      <div class="cf-tr-rubric"><b>Assess against:</b> ${b.rubric.trainer.map(x => `${E(x[0])} (${E(x[1])})`).join(" · ")} — UPL is a gate, not a weighting.</div>
      <div class="fbc-row"><label>Trainer score (0–100)<input type="number" min="0" max="100" id="cftr_${sid}_${m.id}" value="${typeof t.score === "number" ? E(t.score) : ""}"></label></div>
      <label class="fbc-full">Comment for the trainee<textarea id="cftc_${sid}_${m.id}" rows="2">${E(t.comment || "")}</textarea></label>
      <div class="fbc-actions"><button class="btn btn-primary btn-sm" onclick="cmCaseFlow.trainerSave('${rec.id}','${m.id}')">Save trainer score</button></div>
    </details>`;
  }).join("");
  const cur = TRACKS[work.feedback.track] ? work.feedback.track : DEFAULT_TRACK;
  const version = `<div class="cf-track"><label><b>Course version</b>
      <select onchange="cmCaseFlow.setTrack('${rec.id}', this.value)">${Object.entries(TRACKS).map(([k, l]) => `<option value="${k}" ${k === cur ? "selected" : ""}>${E(l)}${k === DEFAULT_TRACK ? " (default)" : ""}</option>`).join("")}</select></label>
      <span class="cf-note">What this trainee sees. The course is the Case Flow; John Doe v. Apex is archived (nothing of it is deleted, and you can change this at any time).</span></div>`;
  if(cur === "classic") return `<div class="fb-admin cf-tr-wrap">${version}</div>`;
  return `<div class="fb-admin cf-tr-wrap">${version}<div class="sidebar-section-lbl" style="padding-left:0;">Case Flow — trainer assessment (40%)</div>
    <p class="cf-note">The trainee's quiz share and AI review make the automated 60%. Your score here makes the 40%; the composite appears on their Knowledge Check once both are in.</p>${caseYearNote(mine)}${rows}</div>`;
}
window.cmCaseFlow.setTrack = async function(id, value){
  const work = (state.traineeWork || {})[id];
  if(!work || !TRACKS[value]) return;
  const latest = (await sharedGet("feedback:" + id).catch(() => null)) || work.feedback || {days: {}};   // re-read so nothing else is clobbered
  latest.days = latest.days || {};
  latest.track = value;
  latest.trackSetAt = new Date().toISOString();
  const ok = await sharedSet("feedback:" + id, latest);
  if(!ok){ if(typeof toast === "function") toast("Couldn't save the course version — try again."); return; }
  work.feedback = latest;
  if(typeof toast === "function") toast(`Course version: ${TRACKS[value]}. The trainee sees it the next time their page loads.`);
  const wrap = document.getElementById("adminRowsWrap"); if(wrap && typeof renderAdminRows === "function") wrap.innerHTML = renderAdminRows();
};
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
    // Day-by-Day Feedback lists the trainee's own days: the Case Flow's, unless they're on the archived version
    const html = onCaseFlow(rec)
      ? relabelAll(withCaseFlowDays(() => __fbAdmin.apply(this, arguments))).replace(/Case Flow Day (\d)(<\/b>)? — Case Flow Day \1 · /g, "Case Flow Day $1$2 — ")   // not "Case Flow Day 1 — Case Flow Day 1 · …"
      : __fbAdmin.apply(this, arguments);
    try{ return html + trainerPanel(rec); }catch(e){ return html; }
  };
}

/* ---------- the Case File page: John Doe v. Robert Smith ----------
   The Client Profile is this file's (CF.profile), for every trainee on the Case Flow and for
   trainers. The John Doe v. Apex Case File is archived, not deleted: it stays whole for a trainee
   on the archived version, and trainers (and trainees given the archived days too) reach it from
   the "Archived" link at the foot of the page (it holds the Apex days' Case File checkpoints).
   Each section opens with its Case Flow day (`opens`) or once that day is passed (`passed`),
   so the profile never gives away a day's answers; trainers see every section. */
const cfIdOf = n => (cfDayByN(n) || {}).id;
const profileOpen = sec => !!(state.isAdmin || state.adminPreview) ||
  (sec.opens ? dayUnlocked(cfIdOf(sec.opens)) : !!((state.progress || {})[cfIdOf(sec.passed)] || {}).done);
const lockLabel = sec => sec.opens ? `Opens with Case Flow Day ${sec.opens}` : `Opens when you pass Case Flow Day ${sec.passed}`;
/* the whole case: the shared file, the two workstreams that run in parallel (each with "you are here"), then the file again */
function caseTimeline(n){
  if(!(SIM.timeline || []).length) return "";
  const track = n >= 4 ? "B" : n === 3 ? "A" : "";
  const items = SIM.timeline.filter(m => !m.track || !track || m.track === track);
  const first = cfDayByN(n) && cfDayByN(n).lessons.find(l => l.cf.block.kind === "activity" && SIM.events[l.cf.block.id]);
  const here = {"": first ? SIM.events[first.cf.block.id].date : ""};
  Object.keys(LANES).forEach(k => { const x = laneAt(k, n); here[k] = x ? x.e.date : ""; });
  const row = (list, at, mark = true) => {   // mark: show "you are here" in this row (else only colour what's past)
    const t = dayMs(at); let placed = !mark;
    const li = list.map(m => {
      const past = !isNaN(t) && dayMs(m.date) <= t, pre = !placed && !isNaN(t) && dayMs(m.date) > t ? (placed = true, `<li class="here"><i></i><b>You are here</b><small>${E(at)}</small></li>`) : "";
      return pre + `<li class="${past ? "past" : "next"}"><i></i><b>${E(m.label)}</b><small>${E(m.date)}${m.track ? " · Track " + E(m.track) : ""}</small></li>`;
    }).join("");
    return li + (!placed && at && !isNaN(t) ? `<li class="here"><i></i><b>You are here</b><small>${E(at)}</small></li>` : "");
  };
  const laned = items.filter(m => m.lane), lo = Math.min(...laned.map(m => dayMs(m.date))), hi = Math.max(...laned.map(m => dayMs(m.date)));
  const before = items.filter(m => !m.lane && dayMs(m.date) < lo), after = items.filter(m => !m.lane && dayMs(m.date) > hi);
  const lastShared = dayMs(here[""]) > hi ? here[""] : "";
  return `<div class="card cf-timeline"><h3>📅 The Case So Far</h3>
    <ol class="cfx-tl cfx-tl-full">${row(before, here[""], dayMs(here[""]) < lo)}</ol>
    <div class="cf-lanes">${Object.entries(LANES).map(([k, name]) => `<div class="cf-lane cf-lane-${k}"><div class="cf-lane-h">${E(name)}</div><ol class="cfx-tl cfx-tl-full">${row(laned.filter(m => m.lane === k), dayMs(here[""]) > hi ? "" : here[k])}</ol></div>`).join("")}</div>
    <ol class="cfx-tl cfx-tl-full">${row(after, lastShared)}</ol></div>`;
}
function caseFlowProfile(archiveLink){
  const c = CF.case, secs = CF.profile || [], shown = secs.filter(profileOpen), locked = secs.filter(x => !profileOpen(x));
  const gates = [];
  locked.forEach(x => { const k = lockLabel(x), g = gates.find(y => y.k === k); g ? g.t.push(x.title) : gates.push({k, t: [x.title]}); });
  const pos = dayUnlocked(cfIdOf(5)) ? 5 : [4, 3, 2, 1].find(n => dayUnlocked(cfIdOf(n))) || 1;
  return `<h1 style="color:var(--navy);font-size:28px;margin:0 0 10px">📂 Case File: ${E(c.style)}</h1>
    <div class="client-intro-banner"><div class="cib-tag">📌 Your Client</div><h2>One File, From Intake to Deposition</h2>
      <p>${E(c.client.name)}, ${E(c.client.position.toLowerCase())}, is your client for the whole course: ${E(c.no)} · Lead Counsel ${E(c.counsel)} · ${E(money(c.total))} Recovery Stack · ${E(c.gapDays)}-Day Treatment Gap.</p>
      ${DATES ? `<p class="cf-case-year">📅 <b>Dates are kept current.</b> On your file the collision is ${E(DATES.dol())}; every date, weekday and deadline on the case moves with it, and the two-year SOL stays exact. You keep this case year until you finish.${DATES.preview ? ` <b>Trainer preview of ${E(DATES.year)}</b>: <a href="?caseYear=off">end the preview</a>.` : ""}</p>` : ""}
      <p>This profile grows with the file. Each section opens with the day it belongs to, and what a day's work produces (the audited Specials, the reasons for the gap, the Net Sheet, the calendar) opens once you pass that day, so work it out from the documents first.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-navy btn-sm" onclick="goto('day',${cfIdOf(pos)})">Open Case Flow Day ${pos}</button><button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.docsArchived ? cmCaseFlow.docsArchived(false) : goto('casedocs')">📁 Open the Case Documents</button>${typeof openCms === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 Open the CMS</button>` : ""}</div></div>
    ${caseTimeline(pos)}
    <div class="profile-grid">${shown.map(x => `<div class="card profile-section"><h3>${E(x.title)}</h3><ul>${x.items.map(i => `<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}
      ${gates.map(g => `<div class="card profile-section cf-prof-lock"><h3>🔒 ${E(g.k)}</h3><ul>${g.t.map(t => `<li>${E(t)}</li>`).join("")}</ul></div>`).join("")}</div>
    ${archiveLink ? `<div class="cf-archived-link"><button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.archived(true)">🗄 Archived: The John Doe v. Apex Case File</button>
      <span class="cf-note">The earlier version's Case File and its Case File checkpoints, kept for the Apex days.</span></div>` : ""}`;
}
function archivedBar(){
  return `<div class="cf-archived-bar"><span><b>🗄 Archived</b> · the John Doe v. Apex Case File, kept for the earlier version's days. Your client is John Doe v. Robert Smith.</span>
    <button class="btn btn-navy btn-sm" onclick="cmCaseFlow.archived(false)">← John Doe v. Robert Smith</button></div>`;
}
if(typeof window.renderClientProfile === "function"){
  const __profile = window.renderClientProfile;
  window.renderClientProfile = function(){
    const v = track();
    if(v === "classic" || !Array.isArray(CF.profile)) return __profile.apply(this, arguments);   // the Apex Case File, as it was
    if(v === "caseflow") return caseFlowProfile(false);   // the archived Apex Case File isn't theirs
    // trainers, and trainees given the archived days too: Robert Smith is the Case File; the Apex Case File is one click away
    return state.cfArchived ? archivedBar() + __profile.apply(this, arguments) : caseFlowProfile(true);
  };
  const show = archived => {
    state.cfArchived = !!archived;
    if(state.view !== "clientprofile" && typeof goto === "function") return goto("clientprofile");
    render(); window.scrollTo(0, 0);
  };
  window.cmCaseFlow.profile = () => show(false);   // the dashboard's "Case profile" button
  window.cmCaseFlow.archived = show;
}

/* ---------- the case documents: John Doe v. Robert Smith (js/cm-case-flow-docs.js) ----------
   The Documents page is this file's document set for every trainee on the Case Flow, each document
   opening with its Case Flow day (trainers see them all). The John Doe v. Apex and Jordan Davies
   documents are archived: whole for a trainee on the archived version, one click away for trainers
   (and trainees given the archived days too). Each Skill Activity names the documents it works from. */
const CF_DOCS = window.CM_CF_DOCS || [], CF_FOLDERS = window.CM_CF_DOC_FOLDERS || [], CF_PACKETS = window.CM_CF_DOC_PACKETS || {};
if(typeof window.cmDoc === "function"){
  const __doc = window.cmDoc;
  window.cmDoc = id => __doc(id) || CF_DOCS.find(d => d.id === id);
}
/* Once the case has rolled forward a year (js/cm-case-dates.js), a document opens in case-doc.html, which shows
   it with that year's dates (print it or save it as a PDF there); in the case's own year, the PDF as rendered. */
const docUrl = d => DATES && DATES.shift && /^RS\d\d$/.test(d.id) ? `case-doc.html?id=${d.id}&year=${DATES.year}`
  : typeof cmDocUrl === "function" ? cmDocUrl(d) : "documents/" + d.file;
function docLine(blockId){
  const docs = (CF_PACKETS[blockId] || []).map(id => CF_DOCS.find(d => d.id === id)).filter(Boolean);
  if(!docs.length) return "";
  return `<div class="cf-docline"><b>📁 Work from</b>${docs.map(d => `<a href="${E(docUrl(d))}" target="_blank" rel="noopener" title="${E(d.desc)}">${E(d.title)}</a>`).join("")}</div>`;
}
const docOpen = d => !!(state.isAdmin || state.adminPreview) || dayUnlocked(cfIdOf(d.day));
function caseFlowDocuments(archiveLink){
  const shown = CF_DOCS.filter(docOpen), locked = CF_DOCS.filter(d => !docOpen(d));
  const tpl = (window.CM_DOCS || []).filter(d => d.folder === "templates");
  const row = d => `<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span> <span style="font-size:11px;color:var(--ink-soft)">· ${d.folder === "templates" ? "Any day" : "Case Flow Day " + d.day}</span><div class="d">${E(d.desc)}</div>${state.isAdmin && d.key ? `<div class="cm-key">🔑 ${E(d.key)}</div>` : ""}</div>
      <div style="display:flex;gap:6px;align-items:center"><span class="cms">CMS: ${E(d.cms)}</span><a class="btn btn-ghost btn-sm" href="${E(docUrl(d))}" target="_blank" rel="noopener">${/\.(docx|xlsx)$/i.test(d.file) ? "Download" : "Open"}</a></div></div>`;
  const folders = CF_FOLDERS.map(fo => ({fo, items: shown.filter(d => d.folder === fo.id), later: locked.filter(d => d.folder === fo.id).length})).filter(x => x.items.length || x.later);
  return `<p class="eyebrow">Case Documents</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📁 Case Documents: ${E(CF.case.style)}</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 14px">The working file for John Doe v. Robert Smith: intake, police and video, Medical Records and bills, the carriers' policies and letters, liens, the Civic's Property Damage, and (Track B) the lawsuit. Each document opens with its Case Flow day, and each Skill Activity lists the ones it works from. Each shows the <b>CMS upload category</b> to use when you add it to the case in the CMS. Read them the way a Case Manager does: verify every fact against its source, and flag what doesn't match.</p>
    <div class="cm-filter"><button class="btn btn-sm btn-ghost" onclick="openCms()">🗂 Open CMS</button></div>
    ${state.isAdmin ? `<div class="card" style="padding:12px 16px;margin-bottom:16px;border-left:4px solid var(--danger);font-size:12.8px">🔑 <b>Trainer view:</b> the red notes under each document are the audit key: planted discrepancies and what a strong trainee should catch. Trainees don't see them. Every document's plants are listed in build/case-flow/documents/SPEC.md.</div>` : ""}
    ${folders.map(({fo, items, later}) => `<div class="card cm-lib-folder" style="padding:14px 18px"><h3>${fo.icon} ${E(fo.label)} <span style="font-weight:500;color:var(--ink-soft);font-size:12px">(${items.length})</span></h3>
      ${items.map(row).join("")}${later ? `<div class="cf-note">🔒 ${later} more open with later Case Flow days.</div>` : ""}</div>`).join("")}
    ${tpl.length ? `<div class="card cm-lib-folder" style="padding:14px 18px"><h3>📝 Templates &amp; Blank Forms <span style="font-weight:500;color:var(--ink-soft);font-size:12px">(${tpl.length})</span></h3>${tpl.map(row).join("")}</div>` : ""}
    ${archiveLink ? `<div class="cf-archived-link"><button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.docsArchived(true)">🗄 Archived: the John Doe v. Apex and Jordan Davies documents</button>
      <span class="cf-note">The earlier version's document set, kept for the Apex days and their Skill Builders.</span></div>` : ""}`;
}
if(typeof window.renderCaseDocuments === "function" && CF_DOCS.length){
  const __docs = window.renderCaseDocuments;
  window.renderCaseDocuments = function(){
    const v = track();
    if(v === "classic") return __docs.apply(this, arguments);   // the archived version's documents, as they were
    if(v === "caseflow") return caseFlowDocuments(false);
    return state.cfDocsArchived
      ? `<div class="cf-archived-bar"><span><b>🗄 Archived</b> · the John Doe v. Apex and Jordan Davies documents, kept for the earlier version's days.</span>
          <button class="btn btn-navy btn-sm" onclick="cmCaseFlow.docsArchived(false)">← John Doe v. Robert Smith documents</button></div>` + __docs.apply(this, arguments)
      : caseFlowDocuments(true);
  };
  window.cmCaseFlow.docsArchived = function(on){ state.cfDocsArchived = !!on; if(state.view !== "casedocs" && typeof goto === "function") return goto("casedocs"); render(); window.scrollTo(0, 0); };
}

/* ---------- 🧪 Practice: the Case Flow's Skill Activities ----------
   For a trainee on the Case Flow, Practice is the Case Flow's own hands-on work: every Skill Activity,
   day by day and module by module, with its tool, its expected output and the documents it works from,
   opening straight on its slide. The Apex Skill Builders (built on the archived Apex documents) are
   archived: whole for a trainee on the archived version, one click away for trainers. */
window.cmCaseFlow.openBlock = function(dayId, lessonIndex){
  if(typeof goto !== "function") return;
  goto("day", dayId);
  const d = cfDay(dayId), slides = d && typeof buildDaySlides === "function" ? buildDaySlides(d) : [];
  const idx = slides.findIndex(sl => sl.lessonIndex === lessonIndex && sl.part === 1);
  if(idx >= 0 && typeof goToSlide === "function") setTimeout(() => { state.dayViewMode = "slides"; goToSlide(idx); }, 0);
};
function caseFlowPractice(archiveLink){
  const kcDone = d => !!((state.progress || {})[d.id] || {}).done;
  const days = MODULES.map(d => {
    const open = dayUnlocked(d.id), day = CF.days.find(x => x.n === d.cf.n);
    const mods = d.cf.phases.map(ph => {
      const acts = d.lessons.map((l, li) => ({b: l.cf.block, li, ph: l.cf.phase})).filter(x => x.ph === ph && x.b.kind === "activity");
      if(!acts.length) return "";
      return `<div class="cf-px-mod"><div class="cf-px-mh">${d.cf.n}.${ph.n} · ${E(ph.title)}</div>
        ${acts.map(({b, li}) => `<div class="cf-px-act"><div><b>${E(b.title)}</b>
            <div class="cf-px-meta"><span>🛠 ${E(b.act.tool)}</span><span>📤 ${E(b.act.output)}</span>${(CF_PACKETS[b.id] || []).length ? `<span>📁 ${CF_PACKETS[b.id].length} documents</span>` : ""}</div></div>
          ${open ? `<button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.openBlock(${d.id},${li})">Open</button>` : `<span class="cf-px-lock">🔒</span>`}</div>`).join("")}</div>`;
    }).join("");
    return `<div class="card px-day"><div class="px-day-h"><div><h2>Case Flow Day ${d.cf.n}${open ? "" : " · 🔒"}${day.track ? ` <span class="cf-px-track">${E(day.track)}</span>` : ""}</h2><div class="sub">${E(day.phase)}</div></div>
        <span class="px-prog">${kcDone(d) ? "Knowledge Check passed ✓" : open ? "In progress" : "Opens when the day before is passed"}</span></div>
      <div class="cf-px-mods">${mods}</div></div>`;
  }).join("");
  const any = [
    `<button class="btn btn-ghost btn-sm" onclick="${window.cmCaseFlow.docsArchived ? "cmCaseFlow.docsArchived(false)" : "goto('casedocs')"}">📁 Case Documents</button>`,
    typeof rpLaunchQuickPractice === "function" ? `<button class="btn btn-ghost btn-sm" onclick="rpLaunchQuickPractice()">🎲 Quick roleplay call</button>` : "",
    typeof openTool === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openTool('cms',null,'library=1')">📚 CMS Training Library</button>` : "",
    typeof openCms === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 Open the CMS</button>` : ""].join("");
  return `<p class="eyebrow">Practice</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">🧪 Practice: The Case Flow Skill Activities</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:84ch;margin:0 0 14px">Every hands-on exercise of the 5-Day Legal Case Management Flow, on the live file <b>${E(CF.case.style)}</b>: each Case Phase's Skill Activities, every one worked on John Doe's file in the CMS (with the Call Simulator or the email workspace where it names them), from the documents it lists. Each opens with its day and goes straight to its slide.</p>
    ${days}
    <div class="card" style="padding:14px 18px;margin-bottom:14px"><b style="color:var(--navy)">Any day</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${any}</div></div>
    ${archiveLink ? `<div class="cf-archived-link"><button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.practiceArchived(true)">🗄 Archived: the John Doe v. Apex Skill Builders</button>
      <span class="cf-note">The earlier version's practice tools, on the archived Apex and Jordan Davies documents.</span></div>` : ""}`;
}
if(typeof window.renderPracticeHub === "function"){
  const __px = window.renderPracticeHub;
  window.renderPracticeHub = function(){
    const v = track();
    if(v === "classic") return __px.apply(this, arguments);   // the archived version's Practice, as it was
    if(v === "caseflow") return caseFlowPractice(false);
    return state.cfPxArchived
      ? `<div class="cf-archived-bar"><span><b>🗄 Archived</b> · the John Doe v. Apex Skill Builders, kept for the earlier version's days.</span>
          <button class="btn btn-navy btn-sm" onclick="cmCaseFlow.practiceArchived(false)">← The Case Flow Skill Activities</button></div>` + __px.apply(this, arguments)
      : caseFlowPractice(true);
  };
  window.cmCaseFlow.practiceArchived = function(on){ state.cfPxArchived = !!on; render(); window.scrollTo(0, 0); };
}

/* ---------- styles: only what the course's own classes don't already give ---------- */
const st = document.createElement("style"); st.id = "cm-case-flow"; st.textContent = `
/* ---- the Case Flow slides: one idea per slide, big type ---- */
.cfx{display:block !important;text-align:left !important;padding:22px 30px 24px !important;background:linear-gradient(180deg,#fff 0%,#fffdf9 100%) !important;position:relative;overflow:hidden;}
.cfx::before{content:"";position:absolute;right:-120px;top:-140px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,#FBF1E6 0%,rgba(251,241,230,0) 70%);pointer-events:none;}
.cfx-top{display:flex;align-items:center;gap:14px;margin:0 0 6px;position:relative;}
.cfx-kicker{font:700 12px 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--orange-deep);background:#FBF1E6;border:1px solid #F0D2AE;border-radius:999px;padding:4px 10px;}
.cfx-dots{display:inline-flex;gap:6px;}
.cfx-dot{width:10px;height:10px;border-radius:50%;background:#E3E6EE;transition:transform .2s ease;}
.cfx-dot.done{background:var(--navy-soft);}
.cfx-dot.on{background:var(--orange);transform:scale(1.35);box-shadow:0 0 0 3px rgba(224,122,31,.18);}
.cfx-full{margin-left:auto;border:1px solid var(--line);background:#fff;border-radius:999px;padding:5px 12px;font:600 12.5px var(--font-ui);color:var(--navy);cursor:pointer;}
.cfx-full:hover{border-color:var(--orange);color:var(--orange-deep);}
.cfx-title{font:700 34px/1.15 'Fraunces',Georgia,serif !important;color:var(--navy) !important;margin:6px 0 16px !important;letter-spacing:-.01em;position:relative;}
.cfx-vi{margin-right:10px;}
.cfx-of{font:600 19px/1.3 var(--font-ui);color:var(--ink-soft);letter-spacing:0;}
.cfx mark.cfx-hl{background:linear-gradient(180deg,transparent 52%,#FFD9A8 52%,#FFD9A8 92%,transparent 92%);color:inherit;padding:0 2px;font-weight:700;}
.cfx-chip{display:inline-block;font:700 13px var(--font-ui);color:var(--navy);background:#DCE6F5;border-radius:999px;padding:6px 14px;margin-bottom:16px;}
.cfx-hero{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,.85fr);gap:28px;align-items:center;}
.cfx-hook{font:600 32px/1.32 'Fraunces',Georgia,serif;color:var(--ink);margin:0;}
.cfx-situation{font:500 25px/1.5 var(--font-ui);color:var(--ink);margin:0;}
.cfx-art{display:flex;align-items:center;justify-content:center;animation:cfxIn .5s ease both;}
.cfx-art svg{width:100%;max-width:420px;height:auto;max-height:300px;}
.cfx-art.small svg{max-width:260px;max-height:200px;}
@keyframes cfxIn{from{opacity:0;transform:translateY(8px);}to{opacity:1;transform:none;}}
.cfx .cf-strip{margin-top:22px;}
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
.cfx-model{font-size:18px;}
.cfx-model .cfx-caption{font:600 20px var(--font-ui);color:var(--navy-soft);margin:0 0 12px;}
.cfx-model table{font-size:17px;}
.cfx-job{display:flex;flex-direction:column;gap:16px;}
.cfx-flow{display:grid;grid-template-columns:1fr auto 1fr auto 1fr auto 1fr;gap:10px;align-items:stretch;animation:cfxIn .3s ease-out both;}
.cfx-flow:nth-child(2){animation-delay:.1s}.cfx-flow:nth-child(3){animation-delay:.2s}
.cfx-step{background:#F6F7FB;border:1px solid var(--line);border-top:4px solid var(--navy);border-radius:12px;padding:10px 12px;display:flex;flex-direction:column;gap:4px;}
.cfx-step:nth-child(3){border-top-color:var(--navy-soft);}.cfx-step:nth-child(5){border-top-color:var(--orange);}.cfx-step:nth-child(7){border-top-color:#2F8F5B;}
.cfx-step small{font:700 11px 'IBM Plex Mono',monospace;letter-spacing:.1em;text-transform:uppercase;color:var(--ink-soft);}
.cfx-step span{font:600 18px/1.35 var(--font-ui);color:var(--ink);}
.cfx-arrow{align-self:center;font-size:22px;color:var(--orange);}
.cfx-dd{display:grid;grid-template-columns:1fr 1fr;gap:18px;}
.cfx-dd > div{border-radius:16px;padding:16px 20px;animation:cfxIn .3s ease-out both;}
.cfx-do{background:#EEF8F2;border:1.5px solid #BFE3CE;}
.cfx-dont{background:#FFF6EC;border:1.5px solid #F3D2B3;animation-delay:.1s !important;}
.cfx-dd h3{margin:0 0 10px;font:700 22px 'Fraunces',Georgia,serif;color:var(--navy);}
.cfx-dd ul{margin:0;padding-left:22px;display:flex;flex-direction:column;gap:10px;}
.cfx-dd li{font:500 21px/1.4 var(--font-ui);color:var(--ink);}
.cfx-task{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.9fr);gap:24px;align-items:start;}
.cfx-task .cfx-points li{font-size:22px;}
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
.lesson-stage #lessonSlideWrap:has(.cfx-deck){background:#262B45 !important;}
.lesson-stage #lessonSlideWrap:has(.cfx-deck) .cfx.cfx-deck{background:transparent !important;padding:0 !important;}
.lesson-stage #lessonSlideWrap:has(.cfx-deck)::before{content:"";inset:auto;top:0;right:0;left:auto;width:min(300px,30%);height:84px;border-radius:0 16px 0 100%;background:#DB8437;opacity:.95;}
.lesson-stage #lessonSlideWrap:has(.cfx-deck)::after{content:"";position:absolute;left:0;bottom:0;width:min(180px,18%);height:52px;border-radius:0 100% 0 16px;background:#DB8437;opacity:.9;pointer-events:none;}
.cfx-deck > *{position:relative;z-index:1;}
.cfx-deck-head{display:flex;align-items:center;gap:20px;padding:0 0 8px;margin:0 0 10px;border-bottom:2px solid rgba(255,255,255,.88);}
.cfx-logo{height:48px;width:auto;flex:0 0 auto;}
.cfx-deck-title{margin:0 !important;font:800 33px/1.1 'Poppins','Inter',sans-serif !important;color:#fff !important;letter-spacing:.005em;
  text-shadow:-2px -2px 0 #DB8437,2px -2px 0 #DB8437,-2px 2px 0 #DB8437,2px 2px 0 #DB8437,0 -2px 0 #DB8437,0 2px 0 #DB8437,-2px 0 0 #DB8437,2px 0 0 #DB8437,0 4px 0 rgba(0,0,0,.18);}
.cfx-ribbon{margin:0 0 10px -28px;max-width:calc(100% + 28px);}
.lesson-stage #lessonSlideWrap .cfx-ribbon{margin-left:-40px;max-width:calc(100% + 40px);}
.cfx-ribbon span{display:inline-block;background:#5B6579;color:#fff;font:700 21px/1.25 'Poppins','Inter',sans-serif;padding:7px 54px 7px 40px;clip-path:polygon(0 0,calc(100% - 28px) 0,100% 50%,calc(100% - 28px) 100%,0 100%);}
.cfx-deck .cfx-top{margin:0 0 10px;}
.cfx-deck .cfx-title.cfx-pill{display:inline-flex;align-items:center;gap:8px;margin:0 !important;background:#ECEEF3;color:#262B45 !important;border-radius:8px;padding:6px 16px;font:700 17px/1.2 'Poppins','Inter',sans-serif !important;letter-spacing:.06em;}
.cfx-deck .cfx-vi{margin:0;}
.cfx-deck .cfx-kicker{background:transparent;border-color:rgba(255,255,255,.35);color:#F4B77A;}
.cfx-deck .cfx-dot{background:rgba(255,255,255,.25);}.cfx-deck .cfx-dot.done{background:#AEB6CC;}
.cfx-deck .cfx-full{background:rgba(255,255,255,.1);border-color:rgba(255,255,255,.35);color:#fff;}
.cfx-sheet{background:#FFFDF8;color:var(--ink);border:3px solid #DB8437;border-radius:22px;padding:18px 24px;box-shadow:0 8px 22px rgba(0,0,0,.18);}
.cfx-sheet .cfx-art.small svg{max-height:200px;}
/* Skill Building opener: the case documents, the challenge ribbon, the situation */
.cfx-docs-row{display:flex;gap:14px;justify-content:center;margin:0 0 12px;}
.cfx-thumb{flex:0 1 150px;display:flex;flex-direction:column;gap:6px;text-decoration:none;color:#fff;}
.cfx-thumb img{width:100%;aspect-ratio:300/388;object-fit:cover;object-position:top;background:#fff;border:3px solid #DB8437;border-radius:6px;box-shadow:0 6px 16px rgba(0,0,0,.3);transition:transform .2s ease;}
.cfx-thumb:hover img{transform:translateY(-3px);}
.cfx-thumb span{font:600 12.5px/1.3 'Inter',sans-serif;color:#DDE2EE;text-align:center;}
.cfx-challenge{margin:4px -28px 12px;background:linear-gradient(90deg,#5B6579 0%,#4C5568 100%);clip-path:polygon(0 0,calc(100% - 34px) 0,100% 50%,calc(100% - 34px) 100%,0 100%);text-align:center;}
.cfx-challenge span{display:block;padding:9px 48px;font:800 22px/1.25 'Poppins','Inter',sans-serif;letter-spacing:.03em;color:#fff;}
.cfx-task-card{background:#C9CDD8;color:#1F2433;border-radius:22px;padding:14px 22px;border:3px solid #E9EBF0;}
.cfx-task-card .cfx-chip{background:#262B45;color:#fff;}
.cfx-task-card .cfx-situation{margin:8px 0 0;font-size:22px;color:#1F2433;}
/* the day's Training Agenda */
.cfx-ag{display:grid;grid-template-columns:minmax(0,1.3fr) minmax(0,.9fr);gap:22px;align-items:start;}
.cfx-ag-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:12px;}
.cfx-ag-list li{text-align:left;display:flex;gap:16px;align-items:center;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.14);border-radius:14px;padding:12px 16px;}
.cfx-ag-list li::before{display:none !important;content:none !important;}
.cfx-ag-n{flex:0 0 auto;width:46px;height:46px;border-radius:50%;display:grid;place-items:center;background:#DB8437;color:#fff;font:800 18px 'Poppins','Inter',sans-serif;}
.cfx-ag-list b{display:block;font:700 21px/1.25 'Poppins','Inter',sans-serif;color:#fff;}
.cfx-ag-list small{display:block;margin-top:3px;font:500 14px/1.35 'Inter',sans-serif;color:#C9CFDD;}
.cfx-ag-side{background:#FFFDF8;color:var(--ink);border:3px solid #DB8437;border-radius:20px;padding:16px 20px;font:500 16px/1.5 'Inter',sans-serif;}
.cfx-ag-side .cfx-ag-day{margin:0 0 8px;font:800 22px/1.25 'Poppins','Inter',sans-serif;color:#262B45;}
.cfx-ag-side p{margin:0;}
@media(max-width:760px){
  .cfx.cfx-deck{padding:14px 16px 18px !important;}
  .cfx-deck-head{gap:12px;}.cfx-logo{height:38px;}.cfx-deck-title{font-size:23px !important;}
  .cfx-ribbon,.lesson-stage #lessonSlideWrap .cfx-ribbon{margin-left:0;max-width:100%;}.cfx-ribbon span{font-size:17px;padding:6px 34px 6px 14px;}
  .cfx-deck .cfx-top{flex-wrap:wrap;gap:8px 10px;}.cfx-deck .cfx-title.cfx-pill{white-space:nowrap;font-size:15px !important;padding:5px 12px;}
  .cfx-deck .cfx-kicker{display:none;}.cfx-thumb:nth-child(n+3){display:none;}
  .cfx-docs-row{flex-wrap:wrap;}.cfx-thumb{flex-basis:44%;}
  .cfx-challenge{margin:4px -16px 12px;}.cfx-challenge span{font-size:16px;padding:8px 30px;}
  .cfx-ag{grid-template-columns:minmax(0,1fr);}
}
/* ---------- the simulation: what landed on the file, the case timeline, fallout, the live call ---------- */
.cfx-tl{list-style:none;margin:0 0 10px;padding:0;display:flex;gap:0;align-items:flex-start;position:relative;}
.cfx-tl::before{content:"";position:absolute;left:8px;right:8px;top:8px;height:2px;background:rgba(255,255,255,.3);}
.cfx-tl li{flex:1 1 0;min-width:0;display:flex;flex-direction:column;align-items:center;text-align:center;gap:3px;position:relative;}
.cfx-tl li::before{display:none !important;content:none !important;}
.cfx-tl i{width:14px;height:14px;border-radius:50%;border:2px solid #AEB6CC;background:#262B45;z-index:1;}
.cfx-tl li.past i{background:#AEB6CC;}
.cfx-tl li.here i{width:18px;height:18px;margin-top:-2px;background:#DB8437;border-color:#fff;box-shadow:0 0 0 4px rgba(219,132,55,.35);}
.cfx-tl b{font:600 11.5px/1.25 'Inter',sans-serif;color:#DDE2EE;padding:0 4px;}
.cfx-tl li.here b{color:#F4B77A;font-weight:800;text-transform:uppercase;letter-spacing:.06em;}
.cfx-tl small{font:500 10.5px 'IBM Plex Mono',monospace;color:#9AA3BA;}
.cfx-sb-grid{display:grid;grid-template-columns:minmax(0,1.45fr) minmax(0,.9fr);gap:16px;align-items:start;}
.cfx-sb-main{display:flex;flex-direction:column;gap:10px;}
.cfx-sb-docs .cfx-docs-row{display:grid;grid-template-columns:repeat(2,minmax(0,100px));justify-content:center;gap:10px 12px;margin:0;}
.cfx-sb-docs .cfx-thumb{flex:none;}
.cfx-sb-docs .cfx-thumb span{font-size:11px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cfx-ev{background:#fff;color:#1F2433;border-radius:14px;border:2px solid #DB8437;padding:10px 14px;box-shadow:0 6px 18px rgba(0,0,0,.25);text-align:left;}
.cfx-ev-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 10px;font:600 12.5px 'Inter',sans-serif;color:#5B6579;}
.cfx-ev-i{font-size:16px;}.cfx-ev-ch{font:800 11px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#B5651F;}
.cfx-ev-from{color:#262B45;}.cfx-ev-when{margin-left:auto;font-family:'IBM Plex Mono',monospace;font-size:11.5px;}
.cfx-ev-subj{margin:4px 0 4px;font:800 20px/1.3 'Poppins','Inter',sans-serif;color:#262B45;}
.cfx-ev-body{margin:0;font:500 17px/1.5 'Inter',sans-serif;color:#2C3142;}
.cfx-ev-att{margin-top:6px;display:flex;flex-wrap:wrap;gap:6px;}
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
.cfx-side .cfx-call{background:#262B45 !important;border-color:#262B45 !important;color:#fff;}
.cfx-side .cfx-call b{color:#F4B77A;}.cfx-side .cfx-call span{color:#DDE2EE;font-size:14px;}.cfx-side .cfx-call em{color:#9BE0B4;font-style:normal;}
.cf-call-bar{display:flex;flex-wrap:wrap;align-items:center;gap:10px 16px;margin:0 0 14px;padding:10px 14px;background:#262B45;color:#DDE2EE;border-radius:12px;font-size:14px;}
.cf-call-bar b{color:#fff;}
.cf-timeline{padding:16px 20px;margin:0 0 16px;background:#262B45 !important;color:#fff;border:0 !important;}
.cfx-tl-full{flex-wrap:wrap;row-gap:14px;}.cfx-tl-full li{flex:0 0 calc(100% / 8);}.cfx-tl-full::before{display:none;}
.cfx-lane{display:flex;flex-wrap:wrap;align-items:center;gap:6px 12px;margin:0 0 6px;}
.cfx-lane-on{font:800 11.5px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;padding:3px 10px;border-radius:999px;color:#262B45;background:#F4B77A;}
.cfx-lane-on.cfx-lane-care{background:#9BE0B4;}
.cfx-lane-off{font:500 12px 'Inter',sans-serif;color:#AEB6CC;}
.cf-lanes{display:grid;grid-template-columns:1fr 1fr;gap:14px;margin:12px 0;}
.cf-lane{background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.12);border-radius:12px;padding:10px 12px;}
.cf-lane-h{font:800 12px 'IBM Plex Mono',monospace;letter-spacing:.08em;text-transform:uppercase;color:#F4B77A;margin:0 0 10px;}
.cf-lane-care .cf-lane-h{color:#9BE0B4;}
.cf-lane .cfx-tl-full li{flex:0 0 calc(100% / 4);}
@media(max-width:760px){.cf-lanes{grid-template-columns:minmax(0,1fr);}}
.cf-timeline h3{margin:0 0 12px;font:800 20px 'Poppins','Inter',sans-serif;color:#fff;}
@media(max-width:760px){
  .cfx-sb-grid{grid-template-columns:minmax(0,1fr);}
  .cfx-tl li:nth-child(1),.cfx-tl li:nth-child(7){display:none;}
  .cfx-tl b{font-size:10.5px;}
}
.cfx-modal{position:fixed;inset:0;z-index:9999;background:rgba(20,26,44,.55);display:flex;align-items:flex-start;justify-content:center;padding:4vh 16px;overflow:auto;}
.cfx-modal-in{max-width:980px;width:100%;padding:18px 24px !important;}
.cfx-modal-h{display:flex;justify-content:space-between;align-items:center;gap:12px;margin-bottom:10px;font-size:17px;color:var(--navy);}
@media(max-width:760px){
  .cfx{padding:16px 16px 18px !important;}
  .cfx-title{font-size:26px !important;}.cfx-of{display:block;font-size:15px;margin-top:4px;}.cfx-sep{display:none;}
  .cfx-hero,.cfx-split,.cfx-task,.cfx-dd,.cfx-qs-2{grid-template-columns:minmax(0,1fr);}
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
.cf-archived-link{display:flex;flex-wrap:wrap;gap:6px 12px;align-items:center;margin:18px 0 4px;}
.cf-archived-link .cf-note{margin:0;}
.cf-archived-bar{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;justify-content:space-between;margin:0 0 14px;padding:10px 14px;background:#F6F7FB;border:1px dashed #B9BFD0;border-radius:12px;font-size:13.5px;color:var(--ink-soft);}
.cf-archived-bar b{color:var(--navy);}
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
