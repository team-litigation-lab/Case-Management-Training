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
        cf: {day, mod, block: b, k, phase,   // day: where it is taught; mod: its unit of scoring
             heading: (ph.headings || {})[id] || (b.kind === "lesson" ? (phase.lead === "Case Phase" ? "" : phase.lead + ": ") : b.kind === "activity" ? "Skill Building: " : "Learning Check: ") + ph.title}
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
        label: `${(ph.lead || "Case Phase") === "Case Phase" ? `Case Phase ${pi + 1}` : ph.lead} · ${ph.title}`,
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

/* ---------- the course is the Case Flow: its five days are the engine's DAYS ----------
   (the earlier John Doe v. Apex version is removed; a record's old progress on Days 1–5 stays stored, unshown) */
Array.prototype.splice.call(DAYS, 0, DAYS.length, ...MODULES);
if(typeof DAY_ICONS !== "undefined") MODULES.forEach((m, i) => { if(!DAY_ICONS[m.id]) DAY_ICONS[m.id] = ["🗂", "📨", "💵", "⚖️", "🏛"][i] || "📘"; });

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
  if(b.kind === "lesson") return S(1, "Tell Them — the rules and the strategic why", `<p class="cf-why">${E(b.tell.why)}</p>${ul(b.tell.rules)}`
      + (b.tell.upl || []).map(u => renderCallout({type: "warning", label: "UPL boundary", text: u})).join(""))
    + S(2, showLabel(b, "Show Them"), visual(l, b))
    + S(3, "Trigger ➔ Task ➔ Tool ➔ Checkpoint", opsTable(b.ops))
    + S(4, "Best Practices & Pitfalls", renderPracticeCards(b.best)) + rubricHtml(b.rubric);
  if(b.kind === "activity") return S(1, "Let Them — the scenario", `<div class="scenario-card"><div class="stag">John Doe v. Robert Smith</div><p class="scn">${E(b.act.scenario)}</p></div>`)
    + S(2, "Let Them — execute on the live file", `<p class="cf-prompt">${E(b.act.prompt)}</p><div class="cf-tool"><div><b>🛠 Tool / interface</b><span>${E(b.act.tool)}</span><span class="cfx-btns">${toolButtons(b.act.tool + (SIM.calls[b.id] ? " Call Simulator" : ""), b.id)}</span></div><div><b>📤 Expected output</b><span>${E(b.act.output)}</span></div></div>`)
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
const LANES = {claims: "Claims & Coverage", care: "Client & Treatment"};
/* where a workstream stands for a trainee on Case Flow Day n: the first event it has on that day, else its last before */
function laneAt(lane, n){
  const evs = MODULES.filter(d => d.cf.n <= n).flatMap(d => d.lessons.filter(l => l.cf.block.kind === "activity" && l.cf.phase.lane === lane && SIM.events[l.cf.block.id]).map(l => ({n: d.cf.n, e: SIM.events[l.cf.block.id], title: l.cf.block.title})));
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
const VIEW_LABEL = {why: "Why It Matters", theory: "The Theory", theory2: "The Theory, Continued", frame: "The Framework", rules: "The Rules", model: "See It", job: "On the Job", dodont: "Do & Don't",
  case: "Your Case", task: "Your Task", check: "Check Your Work", questions: "Knowledge Check", questions2: "Knowledge Check, Continued", summary: "Self-Summary", scale: "Skill Scale"};
const VIEW_ICON = {why: "💡", theory: "📚", theory2: "📚", frame: "🧭", rules: "📏", model: "🔍", job: "🛠", dodont: "✅", case: "📂", task: "🎯", check: "☑️", questions: "🧠", questions2: "🧠", summary: "📝", scale: "📊"};
const KC_PER = 4;   // Knowledge Check questions on one slide
/* The Theory: the lesson's concepts from the original Canva decks (build/case-flow/slides/theory-dN.json), four to a
   slide (a deep topic, 6–8 concepts, takes two); then The Framework, the deck page's own table, flowchart or checklist
   rebuilt in the course's design (the slides never show the deck's page images) */
const TH_PER = 4;
const theoryOf = b => (SLIDES[b.id] || {}).theory || null;
const theoryViews = b => { const t = theoryOf(b); return !t ? [] : (t.concepts.length > TH_PER ? ["theory", "theory2"] : ["theory"]).concat(t.framework ? ["frame"] : []); };
function viewsOf(b){
  if(b.kind === "lesson") return ["why"].concat(theoryViews(b), ["rules"],b.show ? ["model"] : [], (b.ops || []).length ? ["job"] : [], (b.best || []).length ? ["dodont"] : []);
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
    dos: c.dos || dos.slice(0, 3).map(x => words(x, 12)), donts: c.donts || donts.slice(0, 3).map(x => words(x, 12)), theory: c.theory || null};
  if(b.kind === "activity") return {image: c.image, situation: c.situation || words(b.act.scenario, 36), steps: c.steps || [words(b.act.prompt, 30)],
    deliver: c.deliver || words(b.act.output, 18), checks: c.checks || b.act.checkpoints.slice(0, 5).map(x => words(x, 12)),
    dos: c.dos || dos.slice(0, 2).map(x => words(x, 12)), donts: c.donts || donts.slice(0, 2).map(x => words(x, 12))};
  return {image: c.image || "knowledge-check", questions: c.questions || b.check.questions};
}
const art = (key, cls) => ART[key] ? `<div class="cfx-art ${cls || ""}" aria-hidden="true">${ART[key]}</div>` : "";
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
];
const TOOL = Object.fromEntries(TOOLKIT.map(t => [t.id, t]));
/* The LSH Net Sheet is where the money is worked, and only there: Day 3's Settlement Negotiations, Lien Negotiations and
   Disbursement (Track A, settled before suit) and Day 5's close-out once the case is won (Track B). Each block of those
   Case Phases opens it at that phase's stage (js/cm-net-sheet.js STAGES). */
const NET_PHASES = {"Settlement Negotiations": "recovery", "Lien Negotiations & Reduction": "liens", "Disbursement & Closing a Case": "final", "Case Won: Award & Disbursement": "litigation"};
const NET_STAGE = {};
(CF.sequence || []).forEach(d => d.phases.forEach(ph => { if(NET_PHASES[ph.title]) ph.blocks.forEach(id => { NET_STAGE[id] = NET_PHASES[ph.title]; }); }));
/* The records, docket and court-filing platforms, at the steps where that work happens on John Doe's file (on top of
   any the step's own text names): ChartSwap for the records and itemized bills behind treatment, specials, liens and
   discovery; the Docket System for every court date the litigation track sets; Court E-Filing for the complaint,
   the First Amended Complaint and alternative service. */
const WORKED_IN = {
  "d2m2-a1": ["records"], "d2m2-a2": ["records"], "d2m3-a2": ["records"], "d2m4-a1": ["records"], "d3m3-a2": ["records"],
  "d4m1-a2": ["docket", "efiling"], "d4m2-a2": ["docket"], "d5m1-a1": ["efiling", "docket", "records"], "d5m1-a2": ["docket"],
  "d5m3-a1": ["docket"], "d5m4-a2": ["efiling"],
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
const CG = {};   // the game on each lesson's slide, for this visit: {round, shown, calls: {i: {pick, ok, pts}}, list}
function cgRounds(b){
  const c = copyOf(b), k = SLIDES[b.id].clues;
  const r = c.dos.map((x, i) => ({side: "do", rule: x, clues: k.dos[i]})).concat(c.donts.map((x, i) => ({side: "dont", rule: x, clues: k.donts[i]})));
  let h = 0; for(const ch of b.id) h = (h * 31 + ch.charCodeAt(0)) >>> 0;   // a fixed mix per lesson: the same for the whole class
  for(let i = r.length - 1; i > 0; i--){ h = (h * 1103515245 + 12345) >>> 0; const j = h % (i + 1); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
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
function slideBody(view, l, d){
  const {block: b, day, mod} = l.cf, c = copyOf(b);
  switch(view){
    case "why": return `<div class="cfx-hero"><div class="cfx-hero-text"><span class="cfx-chip">${E(titleCase(b.topic))}</span><p class="cfx-hook">${hl(c.hook)}</p></div>${art(c.image)}</div>${strip()}`;
    case "theory": case "theory2": {
      const t = c.theory, half = Math.ceil(t.concepts.length / 2), two = t.concepts.length > TH_PER;
      const list = !two ? t.concepts : view === "theory" ? t.concepts.slice(0, half) : t.concepts.slice(half);
      return `<div class="cfx-theory cfx-th-solo"><div class="cfx-th-main">
          ${view === "theory" ? `<p class="cfx-th-lead">${hl(t.lead)}</p>` : `<p class="cfx-th-cont">${E(titleCase(b.topic))}: continued</p>`}
          <div class="cfx-th-grid">${list.map((x, j) => `<div class="cfx-th-c" style="animation-delay:${j * .05}s"><b>${E(x.term)}</b><span>${hl(x.text)}</span></div>`).join("")}</div></div>
      </div>`;
    }
    case "frame": {   // the deck page's structure, drawn in the course's own design
      const f = c.theory.framework, steps = f.steps || [];
      const body = f.kind === "table"
        ? `<div class="cfx-fw-scroll"><table class="cfx-fw-tbl"><thead><tr>${f.head.map(h => `<th>${E(h)}</th>`).join("")}</tr></thead><tbody>${f.rows.map((r, i) => `<tr style="animation-delay:${i * .05}s">${r.map((x, j) => j ? `<td>${hl(x)}</td>` : `<th scope="row">${hl(x)}</th>`).join("")}</tr>`).join("")}</tbody></table></div>`
        : f.kind === "flow"
          ? `<ol class="cfx-fw-flow" style="--n:${steps.length}">${steps.map((x, i) => `<li style="animation-delay:${i * .07}s"><span class="cfx-fw-n">${i + 1}</span><b>${E(x.label)}</b><span>${hl(x.text)}</span></li>`).join("")}</ol>`
          : `<div class="cfx-fw-list">${steps.map((x, i) => `<div style="animation-delay:${i * .05}s"><b>${E(x.label)}</b><span>${hl(x.text)}</span></div>`).join("")}</div>`;
      return `<div class="cfx-fw"><h3 class="cfx-fw-t">${E(f.title)}</h3>${body}${f.note ? `<p class="cfx-fw-note">${hl(f.note)}</p>` : ""}</div>`;
    }
    case "rules": return `<div class="cfx-split"><ol class="cfx-points">${c.points.map(x => `<li><span>${hl(x)}</span></li>`).join("")}</ol>${art(c.image, "small")}</div>
      ${c.upl ? `<div class="cfx-upl"><b>⚖ UPL Line</b><span>${hl(c.upl)}</span></div>` : ""}`;
    case "model": return `<div class="cfx-model">${b.show && b.show.caption ? `<p class="cfx-caption">${E(b.show.caption)}</p>` : ""}${visual(l, b)}</div>`;
    case "job": return `<div class="cfx-job">${c.job.map((r, ri) => `<div class="cfx-flow">${r.map((x, j) => `<div class="cfx-step"><small>${["Trigger", "Task", "Tool", "Checkpoint"][j]}</small><span>${hl(x)}</span>${j === 2 ? `<span class="cfx-tools-in">${toolChips(rowTools(b, x, ri), b.id)}</span>` : ""}</div>`).join('<span class="cfx-arrow">➔</span>')}</div>`).join("")}</div>`;
    case "dodont": return (SLIDES[b.id] || {}).clues ? clueGame(b) : ddList(c);
    case "case": {
      const docs = (CF_PACKETS[b.id] || []).map(id => CF_DOCS.find(x => x.id === id)).filter(Boolean).slice(0, 4);
      const ev = SIM.events[b.id], fall = falloutFor(b.id), vm = ev && ev.channel === "voicemail" && ev.spoken;
      const thumbs = docs.length ? `<div class="cfx-docs-row">${docs.map(x => `<a class="cfx-thumb" href="${E(docUrl(x))}" target="_blank" rel="noopener" title="${E(x.desc)}" onclick="return cmCaseFlow.doc(event,'${x.id}')"><img src="/decks/cf-docs/${E(x.id)}.webp" alt="" loading="lazy"><span>${E(x.title)}</span></a>`).join("")}</div>` : art(c.image, "small");
      return `<div class="cfx-sb">
        ${fall.map(x => { const e = x.f.then.event, [icon] = CHANNEL[e.channel] || ["⚠️"];
          return `<details class="cfx-fall"><summary><span class="cfx-fall-i">⚠️</span><b>${E(e.subject)}</b><span class="cfx-fall-from">${icon} ${E(e.from || "")}</span></summary>
            <p>${E(e.body)}</p>${isTrainer() ? `<small class="cfx-fall-why">${x.done ? "Not shown to this trainee: they confirmed" : "Shown because this wasn't confirmed"}: “${E(x.what)}” (${E(x.f.if.activity)})</small>` : ""}</details>`; }).join("")}
        <div class="cfx-sb-grid${vm ? " cfx-sb-vm" : ""}">
          <div class="cfx-sb-main">${ev ? eventCard(ev, "", b.id, docs.length > 0) : `<div class="cfx-task-card"><span class="cfx-chip">📂 On the file</span><p class="cfx-situation">${hl(c.situation)}</p></div>`}</div>
          <div class="cfx-sb-docs">${thumbs}</div>
        </div></div>`;
    }
    case "task": { const main = blockTools(b).filter(id => id !== "call")[0] || "cms";
      return `<div class="cfx-task"><ol class="cfx-points">${c.steps.map(x => { const ids = toolsIn(x, b.id); return `<li><span>${hl(x)}<span class="cfx-tools-in">${toolChips(ids.length ? ids : [main], b.id)}</span></span></li>`; }).join("")}</ol>
      <aside class="cfx-side"><div><b>🛠 Where</b><span>${E(b.act.tool)}</span><div class="cfx-btns">${toolChips([...new Set(toolsIn(b.act.tool + (SIM.calls[b.id] ? " Call Simulator" : ""), b.id).concat(WORKED_IN[b.id] || []))], b.id, true)}</div></div>
        ${docLine(b.id) ? `<details class="cfx-docs"><summary><b>📁 Work From</b> · ${(CF_PACKETS[b.id] || []).length} Documents</summary>${docLine(b.id)}${window.cmDocFiling ? cmDocFiling.panel(b.id) : ""}</details>` : ""}
        ${SIM.calls[b.id] ? `<div class="cfx-call"><b>📞 Live Call</b><span>${E(SIM.calls[b.id].who)} is on the line${(REC.calls || {})[b.id] ? ` · <em>✓ taken ${E(new Date(REC.calls[b.id].at).toLocaleDateString())}</em>` : ""}</span>
          <button type="button" class="btn btn-orange btn-sm" data-tool="call" onclick="cmCaseFlow.call('${b.id}')">📞 Take the call</button></div>` : ""}
        <div class="cfx-deliver"><b>📤 Deliver</b><span>${hl(c.deliver)}</span></div></aside></div>`; }
    case "check": return `<div class="cfx-check">${c.checks.map((x, j) => `<label class="cfx-tick"><input type="checkbox" ${((REC.ticks || {})[b.id] || [])[j] ? "checked" : ""} onchange="cmCaseFlow.tick('${b.id}',${j},this.checked)"><span>${hl(x)}</span></label>`).join("")}</div>
      ${c.donts.length ? `<div class="cfx-watch"><b>⚠️ Watch For</b>${c.donts.map(x => `<span>${hl(x)}</span>`).join("")}</div>` : ""}${workLog(b)}`;
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
  return ((REC.reached || {})[id] || 0) >= viewsOf(b).length || ((REC.ticks || {})[id] || []).some(Boolean) || !!(REC.work || {})[id] || !!((REC.listen || {})[id] || {}).at || !!(REC.calls || {})[id];
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
  const logo = typeof LOGO_FULL_SRC !== "undefined" ? `<img class="cfx-logo" src="${LOGO_FULL_SRC}" alt="Legal Support Help">` : "";
  const onNavy = view === "case";   // a Skill Building opener sits on the slide itself, like the deck's
  return oneOfEachTool(`<div class="topic-separator cfx-sepline">CASE FLOW DAY ${day.n}${day.track ? ` &middot; ${E(day.track).toUpperCase()}` : ""} &middot; ${phase.lead === "Case Phase" ? `CASE PHASE ${phase.n} OF ${phase.of}` : phase.lead.toUpperCase()} &middot; ${KIND[b.kind].toUpperCase()} &middot; BLOCK ${k + 1} OF ${mod.blocks.length} &middot; ${VIEW_LABEL[view].toUpperCase()}</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-${view} cfx-${b.kind}" data-part="${p}">
      <div class="cfx-deck-head">${logo}<h2 class="cfx-deck-title">${E(l.cf.heading)}</h2></div>
      <div class="cfx-ribbon"><span>${E(titleCase(b.title))}</span></div>
      <div class="cfx-top"><span class="cfx-title cfx-pill"><span class="cfx-vi">${VIEW_ICON[view]}</span>${E(VIEW_LABEL[view])}</span>
        <span class="cfx-dots" aria-label="Slide ${p} of ${vs.length}">${dots}</span><span class="cfx-kicker">${phase.n}.${k + 1} · ${E(KIND[b.kind])}</span>${timeChip(l, d)}
        <span class="cfx-tools" aria-label="Tools for this step">🛠 ${toolChips(blockTools(b), b.id)}</span>
        <button type="button" class="cfx-full" onclick="cmCaseFlow.full(${d.id},${i})">📖 Full text</button></div>
      ${onNavy ? slideBody(view, l, d) : `<div class="cfx-sheet">${slideBody(view, l, d)}</div>`}
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
    // lessons, uninterrupted → its activities and practice; each block is one slide per view. The Learning
    // Checks (questions, Self-Summary, Skill Scale) aren't slides: they're on the day's Knowledge Check page.
    const out = [];
    s.forEach(sl => {
      if(sl.type !== "topic") return out.push(sl);
      if(sl.part !== 1 || d.lessons[sl.lessonIndex].cf.block.kind === "check") return;
      viewsOf(d.lessons[sl.lessonIndex].cf.block).forEach((v, j) => out.push({type: "topic", lessonIndex: sl.lessonIndex, part: j + 1}));
    });
    return out;
  };
}
/* ---------- the 4-hour day: a 15–20 minute discussion for every topic, 30 minutes of Practice, a 10–15 minute
   Knowledge Check (longer the more topics the day has); whatever is left is breaks and Q&A ---------- */
const DAY_MIN = 240, PRACTICE_MIN = 30;
function daySchedule(d){
  const kindOf = l => l.cf.block.kind, n = d.lessons.filter(l => kindOf(l) === "lesson").length || 1;
  const kc = Math.max(10, Math.min(15, Math.round(10 + (n - 8) * 2.5)));
  const per = Math.max(15, Math.min(20, Math.floor((DAY_MIN - PRACTICE_MIN - kc) / n)));
  const phases = d.cf.phases.map(ph => { const ls = d.lessons.filter(l => l.cf.phase === ph); return {ph, topics: ls.filter(l => kindOf(l) === "lesson").length, acts: ls.filter(l => kindOf(l) === "activity").length}; });
  const acts = phases.reduce((a, x) => a + x.acts, 0) || 1;
  let left = PRACTICE_MIN; phases.forEach((x, i) => { x.practice = i === phases.length - 1 ? left : Math.round(PRACTICE_MIN * x.acts / acts); left -= x.practice; x.discuss = x.topics * per; });
  return {per, kc, practice: PRACTICE_MIN, phases, buffer: Math.max(0, DAY_MIN - n * per - PRACTICE_MIN - kc), topics: n};
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
  if(b.kind === "lesson") { const label = `💬 ${sc.per} min discussion`; return `<button type="button" class="cfx-time" data-k="t_${b.id}" data-label="${label}" title="This topic's discussion: ${sc.per} minutes. Tap to start a countdown." onclick="cmCaseFlow.timer('t_${b.id}',${sc.per})">${label}</button>`; }
  if(b.kind === "activity" && x) { const label = `🧪 Practice · ${x.practice} min`; return `<button type="button" class="cfx-time" data-k="p_${d.id}_${x.ph.n}" data-label="${label}" title="This Case Phase's Skill Activities share ${x.practice} of the day's ${sc.practice} practice minutes. Tap to start a countdown." onclick="cmCaseFlow.timer('p_${d.id}_${x.ph.n}',${x.practice})">${label}</button>`; }
  return "";
}
function agendaSlide(d){
  const logo = typeof LOGO_FULL_SRC !== "undefined" ? `<img class="cfx-logo" src="${LOGO_FULL_SRC}" alt="Legal Support Help">` : "";
  const src = CF.days.find(x => x.n === d.cf.n) || {};
  const sc = daySchedule(d);
  const rows = sc.phases.map(({ph, topics, acts, discuss, practice}) => `<li><span class="cfx-ag-n">${String(ph.n).padStart(2, "0")}</span><div><b>${E(ph.title)}</b>
      <small>💬 ${topics} topic${topics === 1 ? "" : "s"} × ${sc.per} min discussion · 🧪 ${acts} Skill Activit${acts === 1 ? "y" : "ies"} · ${practice} min practice</small></div><span class="cfx-ag-min">${discuss + practice} min</span></li>`).join("");
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
        <div><b>1 new message</b> · ${vmLength(e)}<br><small>Listen first: the transcript opens after your Listening Check.</small></div></div>
      <div class="cfx-vm-row"><button type="button" class="btn btn-orange btn-sm cfx-vm-play" onclick="cmCaseFlow.vmPlay('${blockId}')">${vmRec(blockId).plays ? "↻ Play again" : "▶ Play"}</button>
        <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.listen('${blockId}')">🎧 Listening Check</button>
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
window.cmCaseFlow.tool = function(id, blockId){
  if(id === "call" && blockId && SIM.calls[blockId]) return cmCaseFlow.call(blockId);
  if(id === "netsheet" && typeof openPane === "function"){   // the firm's Net Sheet (net-sheet.html), beside the slide, checked at this step's stage
    const st = NET_STAGE[blockId] || "final";
    openPane("netsheet", new URL(`net-sheet.html?stage=${st}${DATES ? "&year=" + DATES.year : ""}`, location.href).href, `LSH Net Sheet · ${st === "litigation" ? "Track B (case won)" : "Track A (settled)"}`, "📊", "split");
    return;
  }
  if(PAGE[id]){   // one of the course's own pages: go there, with a way back to this slide
    const d = MODULES.find(x => x.lessons.some(l => l.cf.block.id === blockId)) || MODULES.find(x => x.id === state.dayId);
    state.cfReturn = d ? {dayId: d.id, n: d.cf.n, slide: typeof state.lessonSlide === "number" ? state.lessonSlide : null, view: state.view} : null;
    goto.apply(null, PAGE[id]);
    return;
  }
  if(typeof openTool === "function") openTool(id === "call" ? "calls" : id, "split");   // a training platform, beside the slide (⧉ Side by side; 🖥 Second screen)
};
window.cmCaseFlow.back = function(){
  const r = state.cfReturn; state.cfReturn = null;
  syncReturn();
  if(!r) return;
  if(r.view !== "day"){ goto(r.view); return; }
  goto("day", r.dayId);
  setTimeout(() => { state.dayViewMode = "slides"; if(typeof goToSlide === "function" && r.slide != null) goToSlide(r.slide); }, 0);
};
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
/* A Case Flow slide is one card: the dots and the slide go in .cf-stage-card, the full width of the stage, and
   Previous / Next sit under it (the presenter stands in the side column, sidePresenter()). Everything stays inside #lessonStage, so full screen and the slide's fit still work. */
function cfStage(html){
  if(typeof html !== "string" || html.indexOf("cfx-deck") < 0 || html.indexOf("stage-body") < 0) return html;
  const t = document.createElement("template"); t.innerHTML = html;
  const body = t.content.querySelector(".stage-body");
  if(!body || !body.querySelector(".cfx-deck") || body.closest(".cf-stage-card")) return html;
  const card = document.createElement("div"); card.className = "cf-stage-card";
  const dots = body.previousElementSibling && body.previousElementSibling.classList.contains("slide-dots") ? body.previousElementSibling : null;
  body.before(card); if(dots) card.appendChild(dots); card.appendChild(body);
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
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ syncReturn(); sidePresenter(); kcFit(); }catch(e){} return r; };
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
window.cmCaseFlow = window.cmCaseFlow || {}; window.cmCaseFlow.viewsOf = b => viewsOf(b);   // a block's slides, in order (the scripts' keys)
MODULES.forEach(d => d.lessons.forEach(l => {
  const b = l.cf.block, n = b.notes || [], vs = viewsOf(b), best = (b.best || []).map(x => String(x).replace(/^pitfall:\s*/i, "Watch for this: "));
  const per = {   // one script per slide (view); the block's speaker notes spread across its slides
    why: {why: b.tell && b.tell.why, talk: n[0] || ""},
    theory: theoryOf(b) ? {why: String(theoryOf(b).lead).replace(/\*\*/g, ""), walk: theoryOf(b).concepts.slice(0, theoryOf(b).concepts.length > TH_PER ? Math.ceil(theoryOf(b).concepts.length / 2) : TH_PER).map(x => `${x.term}: ${String(x.text).replace(/\*\*/g, "")}`), ask: "Which of these have you met before, and where would it show up on John Doe's file?"} : {},
    theory2: theoryOf(b) ? {why: "The theory, continued.", walk: theoryOf(b).concepts.slice(Math.ceil(theoryOf(b).concepts.length / 2)).map(x => `${x.term}: ${String(x.text).replace(/\*\*/g, "")}`)} : {},
    frame: theoryOf(b) && theoryOf(b).framework ? {why: theoryOf(b).framework.title, walk: (theoryOf(b).framework.rows || []).map(r => r.map(x => String(x).replace(/\*\*/g, "")).join(" · ")).concat((theoryOf(b).framework.steps || []).map(x => `${x.label}: ${String(x.text).replace(/\*\*/g, "")}`)), ask: "Walk the room through it on John Doe's file: where is he on this right now?"} : {},
    rules: {why: "The rules, and where the Case Manager's role ends.", walk: ((b.tell && b.tell.rules) || []).concat((b.tell && b.tell.upl) || []), ask: n[1] || ""},
    model: {why: (b.show && b.show.caption) || "The model to follow.", talk: b.visual || ""},
    job: {why: "Trigger ➔ Task ➔ Tool ➔ Checkpoint: how it runs on the job.", walk: (b.ops || []).map(r => r.join(" ➔ "))},
    dodont: {why: "How this block is graded, and what to watch for.", talk: n.slice(2).join(" "), walk: best},
    case: {why: b.act && b.act.scenario, talk: [SIM.events[b.id] ? (SIM.events[b.id].channel === "voicemail" && SIM.events[b.id].spoken ? `A voicemail just landed on the file (${SIM.events[b.id].date}). Play it, take notes as you would at your desk, and check them before you act.` : `What just landed on the file (${SIM.events[b.id].date}): ${SIM.events[b.id].subject}. ${SIM.events[b.id].body}`) : "", n[0] || ""].filter(Boolean).join(" ")},
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
const firstAim = d => lc1(String(d.objective || d.title).replace(/\s*\([^)]*\)/g, "").split(/,\s|;\s/)[0]);   // the objective's opening clause, said aloud
const andList = xs => xs.length < 2 ? (xs[0] || "") : xs.slice(0, -1).join(", ") + " and " + xs[xs.length - 1];
if(typeof window.sopRunOfShow === "function"){
  const __ros = window.sopRunOfShow;
  window.sopRunOfShow = function(dRaw){
    const d = cfDay(dRaw && dRaw.id); if(!d) return __ros.apply(this, arguments);
    const sc = daySchedule(d), n = d.cf.n, game = GAMES[GAME_DAY[n]] || GAMES.millionaire, next = cfDayByN(n + 1);
    const titles = sc.phases.map(x => x.ph.title);
    const steps = []; let t = 0;
    const add = (mins, x) => { steps.push(Object.assign({from: t, to: t + mins}, x)); t += mins; };
    add(15, {pre: true, title: "Before trainees join", do: [
      `Admin → <b>Trainee Audit</b>: approve anyone new and check everyone has Case Flow Day ${n} open (yesterday's Knowledge Check submitted).`,
      `Open Case Flow Day ${n} → slides → <b>🖥 Presenter view</b>, allow pop-ups, and in Google Meet share <b>“LSH Slides — share this window”</b>. Every slide has its read-aloud script in the console.`,
      `Keep John Doe's 📂 Case File and the CMS open in another tab: the room will ask where things are on the file.`]});
    add(5, {title: "Welcome and the Training Agenda", do: [`Put the Training Agenda slide up: it lists today's Case Phases with their topics, activities and minutes.`, n > 1 ? `Recap yesterday in a minute: where John Doe's file stood when we stopped, and the one thing most people found hard (check the Knowledge Check scores).` : `Introduce the file: John Doe v. Robert Smith, Atty. Elijah Thorne's case, the one file the whole week works.`],
      say: n === 1 ? `“Welcome, everyone. For the next five days you're the Case Manager on one real-looking file, John Doe v. Robert Smith. Today we work through ${andList(titles)}. By the end of the day you'll ${firstAim(d)}, and you'll have done it on the file yourselves.”`
        : `“Morning, everyone. Let's pick John Doe's file up where we left it. Today it's ${andList(titles)}. By the time we finish you'll ${firstAim(d)}.”`,
      watch: "Anyone who hasn't opened today's day yet: ask them to open it now so they can follow along."});
    const mid = Math.ceil(sc.phases.length / 2);
    sc.phases.forEach((x, i) => {
      const ls = d.lessons.filter(l => l.cf.phase === x.ph), topics = ls.filter(l => l.cf.block.kind === "lesson"), acts = ls.filter(l => l.cf.block.kind === "activity");
      const calls = acts.map(l => SIM.calls[l.cf.block.id]).filter(Boolean);
      if(topics.length) add(x.discuss, {title: `Case Phase ${x.ph.n}: ${E(x.ph.title)}`, do: [
        `${topics.length} topic${topics.length > 1 ? "s" : ""}, about ${sc.per} minutes each (tap a slide's 💬 chip for a countdown): ${topics.map(l => `<b>${E(titleCase(l.cf.block.title))}</b>`).join(" · ")}.`,
        `Each topic runs Why It Matters, The Theory, The Framework, The Rules, See It, On the Job, then Do &amp; Don't: play <b>3 Clues, 1 Rule</b> with the room and let them call it before you reveal.`,
        `Read the script in Presenter view as written or in your own words; take one or two answers per question, not a round of the room.`],
        say: `“Now we're into ${x.ph.title}. Keep John Doe's file in your head the whole way through: everything on these slides is something you'll do on it in a few minutes.”`,
        watch: "Silence usually means it's too abstract: bring it back to John Doe's file and ask what they'd do next on it."});
      if(acts.length) add(x.practice, {title: `Skill Activities: ${E(x.ph.title)}`, do: [
        acts.map(l => `<b>${E(l.cf.block.title)}</b> <span style="color:var(--ink-soft)">(${E(String(l.cf.block.act.tool || "").split("·")[0].trim())})</span>`).join(" · "),
        `Trainees work it on John Doe's file in the CMS or the tool the step names, beside the slide (⧉ Side by side), then tick Check Your Work and log the reference.`,
        calls.length ? `📞 Live call${calls.length > 1 ? "s" : ""}: ${andList(calls.map(c => E(c.who)))}. It starts from “Take the call” on the Your Task slide; let one trainee take it while the room listens, or everyone takes it at their desk.` : "",
        acts.some(l => PLAN_TOOL.test(l.cf.block.act.tool || "")) ? `The Action Plan drafts: Next on the activity's last slide opens the editor, and “Next” there carries on.` : ""].filter(Boolean),
        say: acts.length === 1 ? `“Your turn. Open John Doe's file and do this the way you would at your desk. I'm around, so shout if you get stuck, and log what you did before you move on.”`
          : `“Your turn. There are ${acts.length} of these, so pace yourselves. Work them on John Doe's file the way you would at your desk, and shout if you get stuck.”`,
        watch: "Anyone stuck on one step for more than ten minutes: help them log what they have and move on. The debrief is where it lands."});
      if(i === mid - 1 && sc.phases.length > 1 && sc.buffer >= 20) add(10, {brk: true, title: "Break", do: ["Ten minutes. Tell the room the exact time you'll restart."], say: "“Let's take ten. We're back at the time on the screen, and we'll pick John Doe's file up right where we stopped.”"});
    });
    if(d.discussionQuestion && sc.buffer >= 28) add(8, {title: "End-of-day discussion", say: `“Before the Knowledge Check, let's step back and talk about this together: ${E(d.discussionQuestion)}”`, do: ["Take two or three answers and connect each one to a moment on John Doe's file from today."]});
    add(sc.kc, {title: `Knowledge Check · ${game.icon} ${E(game.name)}`, do: [
      `Trainees open the Knowledge Check from the last slide: ① today's game, ${E(game.name)}, then ② each Case Phase's Learning Check (3 written questions, the Self-Summary and the Skill Scale), and one Submit.`,
      `70% marks the day complete. Below that it's a “not yet”: they can move on and retake it, and their best score counts.`],
      say: `“Last stretch for today. The Knowledge Check is a game, ${game.name}, and then three written questions for each Case Phase. Answer from the file, in your own words. No looking at each other's screens.”`,
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
      <div class="sopf-meta"><span>⏱ About ${Math.round(liveMins / 60 * 10) / 10} hours live · ends ≈ ${sopClock(start, liveMins)}</span><span>🗂 ${sc.phases.length} Case Phases</span><span>📚 ${sc.topics} topics</span><span>🧪 ${acts} Skill Activities</span><span>${game.icon} ${E(game.short)}</span></div>
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
      [/<li><b>Teach:<\/b>[^<]*<\/li>/, "<li><b>Teach:</b> each Case Phase's topics, about 15–20 minutes of discussion each, with Do &amp; Don't played as 3 Clues, 1 Rule.</li>"],
      [/<li><b>Practise:<\/b>[^<]*(<[^/][^>]*>[^<]*<\/[^>]+>[^<]*)*<\/li>/, "<li><b>Practise:</b> the phase's Skill Activities on John Doe's file in the CMS, with its live call.</li>"],
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
      return items ? `<h3 style="font:700 15px var(--font-ui);color:var(--navy);margin:14px 18px 6px;">Case Phase ${ph.n}: ${E(ph.title)}</h3>${items}` : "";
    }).join("");
    return `
      <p class="eyebrow">Admin Only</p>
      <h1 style="color:var(--navy);font-size:26px;margin:6px 0 4px;">Trainer Cues &amp; Scripts</h1>
      <p style="color:var(--ink-soft);font-size:13px;max-width:75ch;margin:0 0 18px;">What you say on every slide, in your own voice, plus the questions to put to the room. Trainees (and your screen-share) never see this. Keep it open in a second window, or use 🖥 Presenter view, which shows the same script beside each slide.</p>
      <div class="cues-day-tabs">${DAYS.map(x => `<button class="${x.id === d.id ? "active" : ""}" onclick="setCuesDay(${x.id})">Case Flow Day ${x.cf.n}</button>`).join("")}</div>
      <div style="display:flex;justify-content:space-between;align-items:center;gap:10px;flex-wrap:wrap;margin:16px 0 10px;">
        <h2 style="color:var(--navy);font-size:19px;margin:0;">${E(d.title)}</h2>
        <button class="btn btn-navy btn-sm" onclick="downloadDayScriptsPdf(${d.id})">⬇ Download the Speaker Notes (PDF)</button>
      </div>
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
    d.cf.phases.forEach(ph => {
      const ls = d.lessons.map((l, i) => [l, i]).filter(([l]) => l.cf.phase === ph); if(!ls.length) return;
      lines.push(`## Case Phase ${ph.n}: ${ph.title}`);
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
const kcMods = d => d.lessons.filter(l => l.cf.block.kind === "check").map(l => ({b: l.cf.block, mod: l.cf.mod, ph: l.cf.phase}));
function modMissing(b, modId){   // what's left to do on a module's Learning Check, or "" when it's complete
  const m = rec(modId);
  if(b.check.questions.some((_, j) => !words3(m.kc[j], 3))) return "answer each question";
  if(b.check.summary.some((_, j) => !words3(m.answers[j], 12))) return "answer each Self-Summary prompt in a few sentences";
  if(b.check.scale.some((_, j) => !m.scale[j])) return "rate yourself on every competency";
  return "";
}
/* ② the bonus round: one module's Learning Check at a time, its modules as tabs, so it fits one screen */
function writtenPart(d){
  const day = d.cf, mods = kcMods(d), firstOpen = mods.findIndex(x => modMissing(x.b, x.mod.id));
  const sel = mods.some(x => x.mod.id === state.cfKcMod) ? state.cfKcMod : (mods[firstOpen < 0 ? 0 : firstOpen] || mods[0]).mod.id;
  const tabs = `<div class="cf-kc-tabs" role="tablist">${mods.map(({b, mod, ph}) => { const left = modMissing(b, mod.id);
      return `<button type="button" role="tab" class="cf-kc-tab${mod.id === sel ? " on" : ""}${left ? "" : " ok"}" aria-selected="${mod.id === sel}" onclick="cmCaseFlow.kcMod('${mod.id}')"><small>${day.n}.${ph.n} ${E(ph.title)}</small><b>${E(b.title)}</b><span class="cf-kc-badge ${left ? "" : "ok"}">${left ? "To do" : "Complete ✓"}</span></button>`; }).join("")}</div>`;
  const submit = `<div class="cf-kc-submit"><button class="btn btn-ghost" type="button" onclick="cmCaseFlow.kcPart('quiz')">← Back to the quiz</button>
      <button class="btn btn-primary" style="padding:13px 28px;" type="button" ${state.quizSubmitting ? "disabled" : ""} onclick="cmCaseFlow.kcSubmit(${d.id})">Submit Knowledge Check</button></div>`;
  return `<div class="cf-kc-written">${tabs}${mods.filter(x => x.mod.id === sel).map(({b, mod, ph}, i) => {
      const left = modMissing(b, mod.id), m = rec(mod.id);
      return `<div class="card cf-kc-mod" data-mod="${mod.id}">
        <div class="cf-kc-cols"><div><h4>Knowledge Check questions</h4>
        <ol class="cf-kc-qs">${b.check.questions.map((q, j) => `<li><span>${E(q)}</span><textarea id="cfkc_${mod.id}_${j}" rows="2" placeholder="Your answer, from the file" aria-label="Answer ${j + 1}" oninput="cmCaseFlow.kcDraft('${mod.id}',${j},this.value)">${E(m.kc[j] || "")}</textarea></li>`).join("")}</ol>
        ${submit}</div><div><h4>Self-Summary & Skill Scale</h4>
        ${selfSummary(b, day, mod, "page")}</div></div>
      </div>`; }).join("")}
    </div>`;
}
const kcSig = (b, m) => JSON.stringify([m.kc, m.answers, m.scale]).length + ":" + JSON.stringify([m.kc, m.answers, m.scale]).replace(/\s+/g, " ").slice(0, 4000).split("").reduce((h, c) => (h * 31 + c.charCodeAt(0)) | 0, 7);
function kcChip(modId){   // a module's scores, compact, for the results
  const s = composite(rec(modId)), m = rec(modId);
  const v = x => x == null ? "—" : x + "%";
  return `<span>Automated <b>${v(s.a)}</b></span><span>Trainer <b>${v(s.t)}</b></span><span>Composite <b>${v(s.c)}</b></span>${m.ai ? "" : `<em id="cfkc_rv_${modId}">${state.cfReviewing && state.cfReviewing[modId] ? "Reviewing…" : "Review pending"}</em>`}`;
}
function cfResult(d){
  const {lastScore, lastCorrect, lastTotal, lastPassed} = state;
  const msg = lastPassed ? `That's a wrap on Case Flow Day ${d.cf.n}. Well done.` : "Not quite 70% yet. See which questions you missed below, then retake when you're ready.";
  const history = (state.progress[d.id] && state.progress[d.id].history) || [];
  const next = d.cf.n < MODULES.length ? (dayUnlocked(cfIdOf(d.cf.n + 1)) ? `<button class="btn btn-primary" onclick="goToNextDay(${d.id})">Continue to Case Flow Day ${d.cf.n + 1} →</button>` : "")
    : (typeof certData === "function" && certData().eligible ? `<button class="btn btn-primary" onclick="openCertificate()">🎓 View Certificate of Completion</button>` : "");
  return `<div class="card quiz-result cf-kc-result">
      <div class="cf-kcr-top">
        <div class="cf-kcr-score">${typeof sealSvg === "function" ? sealSvg({size: 72, label: lastScore + "%", done: lastPassed}) : ""}<div><div class="big">${lastCorrect} / ${lastTotal} correct</div><div class="sub">${msg}</div></div></div>
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
     🟦 Jeopardy (Day 2): the day's Case Phases × point values, a hidden Daily Double
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
function game(d){
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
const phaseOfQ = (d, i) => { const m = d.cf.quizMod[i]; const l = d.lessons.find(x => x.cf.mod && x.cf.mod.id === m); return l ? l.cf.phase : d.cf.phases[0]; };
function jeopardyBoard(d, g){
  const cols = d.cf.phases.map(ph => ({ph, qs: d.quiz.map((_, i) => i).filter(i => phaseOfQ(d, i) === ph)})).filter(c => c.qs.length);
  const rows = Math.max(...cols.map(c => c.qs.length));
  return `<div class="cfg-jb" style="--cols:${cols.length}">${cols.map(c => `<div class="cfg-jh">${E(c.ph.title)}</div>`).join("")}
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
  const hud = `<div class="cfg-title"><b>${G.icon} ${G.name}</b>${sound}</div>
    <div class="cfg-hud"><span class="cfg-pts">${score}<small>${g.mode === "millionaire" ? "your rank" : "points"}</small></span><span class="cfg-streak${g.streak >= 3 ? " hot" : ""}">🔥 ${g.streak}<small>streak</small></span><span class="cfg-lvl">${answered}<small>of ${n} played</small></span><span class="cfg-tok" title="Ask a Friend tokens: one for every ${TOKEN_EVERY} right answers, for your next round">🤝 ${tokensBanked()}<small>to use${earned ? ` · +${earned} next round` : ""}</small></span></div>`;
  const track = g.mode === "jeopardy" ? "" : `<div class="cfg-track">${d.quiz.map((_, i) => { const l = g.log[i]; return `<button type="button" class="cfg-node${i === qi && !finished ? " at" : ""}${l ? (l.ok ? " ok" : " no") : ""}" ${l ? "" : "disabled"} onclick="cmCaseFlow.gameGo(${i})" aria-label="Question ${i + 1}">${i === qi && !finished ? (g.mode === "bomb" ? "💣" : "🚀") : l ? (l.ok ? "✓" : "✗") : i + 1}</button>`; }).join("")}</div>`;
  const clear = `<div class="cfg-clear"><div class="cfg-clear-h">🏁 ${g.mode === "millionaire" ? `You made ${score}!` : "Game over: quiz cleared!"}</div>
      <div class="cfg-tally"><span><b>${right}</b> of ${n} right</span>${g.mode === "millionaire" ? "" : `<span><b class="cfg-count" data-to="${g.pts}">${g.pts.toLocaleString()}</b> points</span>`}<span>best streak <b>${g.best}</b></span></div>
      ${earned ? `<div class="cfg-earn">🤝 <b>+${earned} Ask a Friend token${earned === 1 ? "" : "s"}</b> for your next round: a hint from your AI colleague on a question you're stuck on</div>` : ""}
      ${gameBadges(d, g).length ? `<div class="cfg-badges">${gameBadges(d, g).map(([i, t, x]) => `<span class="cfg-badge"><i>${i}</i><b>${t}</b><small>${x}</small></span>`).join("")}</div>` : ""}
      <button class="btn btn-primary" style="padding:13px 28px;" type="button" onclick="cmCaseFlow.kcPart('written')">Bonus round: Learning Checks & Self-Summary →</button></div>`;
  // the board / the wheel / the doors come before a question
  if(g.mode === "jeopardy" && (state.cfJq == null || g.log[state.cfJq] && state.cfGameShow !== state.cfJq && state.cfJAns !== state.cfJq)){
    return `<div class="cfg">${hud}${finished ? clear : `<p class="cfg-hint">Pick a category and a value. One square hides a <b>Daily Double</b>.</p>`}${jeopardyBoard(d, g)}</div>`;
  }
  if(g.mode === "jeopardy") qi = state.cfJq;
  if(finished && state.cfGameShow !== qi) return `<div class="cfg">${hud}${track}${clear}</div>`;
  const q = d.quiz[qi], pick = state.quizAnswers[qi], done = pick !== undefined, log = g.log[qi];
  if(!done && g.mode === "wheel" && !g.pre[qi]){
    const seg = 360 / WHEEL.length;
    return `<div class="cfg">${hud}${track}<div class="cfg-wheel-wrap"><div class="cfg-pointer">▼</div>
      <div class="cfg-wheel" id="cfgWheel" style="background:conic-gradient(${WHEEL.map((_, i) => `${WHEEL_COL[i]} ${i * seg}deg ${(i + 1) * seg}deg`).join(",")})">${WHEEL.map(([t], i) => `<span style="transform:rotate(${i * seg + seg / 2}deg)"><b>${t}</b></span>`).join("")}<i class="cfg-hub">🎡</i></div>
      <button class="btn btn-primary cfg-spin" type="button" onclick="cmCaseFlow.gameSpin(${qi})">🎡 Spin for level ${qi + 1}</button></div></div>`;
  }
  if(!done && g.mode === "doors" && !g.pre[qi]){
    return `<div class="cfg">${hud}${track}<p class="cfg-hint">Level ${qi + 1}: pick a door. Behind each, a reward for a right answer.</p>
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
  return `<div class="cfg cfg-m-${g.mode}">${hud}${track}<div class="${side ? "cfg-split" : ""}"><div>${card}${nav}</div>${side}</div></div>`;
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
function gamePaint(d){
  const w = document.getElementById("quizWrap"); if(!w) return;
  w.innerHTML = renderQuiz(d);
  try{ kcFit(); }catch(e){}
  clearInterval(state.cfClockIv); clearTimeout(state.cfBombT);
  const g = state.cfGame; if(!g) return;
  const card = w.querySelector(".cfg-card"), qi = card ? +card.dataset.q : -1;
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
    state.quizAnswers[qi] = oi; state.cfJAns = qi;   // (Jeopardy: the clue stays up to show the result)
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
    const steps = `<div class="cf-kc-steps">${step("quiz", `① ${(GAMES[(state.cfGame && state.cfGame.day === d.id && state.cfGame.mode) || (state.cfGameMode || {})[d.id] || GAME_DAY[d.cf.n]] || GAMES.millionaire).icon} The Quiz Game`, `${answered} of ${d.quiz.length} played`)}${step("written", "② Bonus round: Learning Checks & Self-Summary", `${done} of ${mods.length} complete`)}</div>`;
    const prog = (state.progress || {})[d.id];
    const head = `<div class="cf-kc-head"><button type="button" class="cf-kc-back" onclick="backToSlidesFromKnowledgeCheck()">← Lessons</button>
      <b>Case Flow Day ${d.cf.n} · ${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</b><span class="tag">Knowledge Check · ${d.quiz.length} questions</span>
      ${prog && prog.done ? `<span class="cf-kc-passed" title="Your best score is kept; you can retake it any time">✓ Passed · best ${E(prog.score)}%</span>` : ""}
      <button type="button" class="cf-kc-newtab" onclick="openRouteInNewTab('#/day/${d.id}')" title="Keep this Knowledge Check open and review the lessons side by side">📑 Lessons in a new tab</button></div>`;
    if(part === "written") return head + steps + writtenPart(d);
    return head + steps + gameQuiz(d);
  };
  renderQuiz = quiz; window.renderQuiz = quiz;
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
  kcMod(modId){ const cur = document.querySelector(".cf-kc-mod"); if(cur) readForm(cur.dataset.mod); persist(); state.cfKcMod = modId; gamePaint(DAYS.find(x => x.id === state.dayId)); },
  kcPart(part){ state.cfKcPart = part; state.cfKcDay = state.dayId; gamePaint(DAYS.find(x => x.id === state.dayId)); window.scrollTo({top: 0, behavior: "smooth"}); },
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
    }
  },
  async review(dayId, modId, auto){
    const d = cfDay(dayId), m = auto ? rec(modId) : readForm(modId);
    const mod = allMods().map(x => x.m).find(x => x.id === modId);
    const b = mod.blocks.find(x => x.kind === "check");
    if(auto && modMissing(b, modId)) return;
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
    const label = `Day ${dayId} · Case Flow Day ${d.cf.n} · ${b.title} — CM Self-Summary`;   // "Day <id>" files it under this day, by its id
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
              gaps: (rep.blindspots || []).slice(0, 3), growth: (rep.growthSuggestions || []).slice(0, 2), at: new Date().toISOString(), sig: kcSig(b, m)};
      await persist();
      status(modId, "Reviewed");
    }catch(e){
      status(modId, e && e.invalidInput ? (e.message || "Add more detail and try again.") : "Saved. The AI review didn't complete; your trainer will still see your answers.");
    }
    const res = document.getElementById(`cfss_res_${modId}`); if(res) res.innerHTML = scoreHtml(modId);
  }
});

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
  window.renderAdmin = function(){ return relabelAll(__admin.apply(this, arguments)); };
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
function workLogged(mine, m){
  const rows = m.blocks.filter(x => x.kind === "activity").map(x => ({x, w: (mine.work || {})[x.id]})).filter(r => r.w);
  const heard = m.blocks.filter(x => x.kind === "activity" && ((mine.listen || {})[x.id] || {}).at).map(x => { const h = mine.listen[x.id], ev = SIM.events[x.id]; return `<div class="cf-tr-work"><b>🎧 Listening Check (${E(x.title)}):</b> ${E(h.score)}/${E((ev.listen || []).length)} caught · played ${E(h.plays)}×${(ev.listen || []).map((q, j) => `<br>${h.got[j] ? "✓" : "✗"} ${E(q.q)} <i>${E(h.answers[j] || "—")}</i>`).join("")}</div>`; }).join("");
  if(heard) return heard + (rows.length ? `<div class="cf-tr-work"><b>🧾 Work logged in the tools:</b> ${rows.map(({x, w}) => `${E(x.title)}: <code>${E(w.ref)}</code> (${E((TOOL[w.tool] || TOOL.cms).short)})`).join(" · ")}</div>` : "");
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
/* where the trainee's file stands: the newest event of each activity they have opened, overall and per workstream */
function caseNow(){
  const now = {"": NaN, claims: NaN, care: NaN}, max = (a, b) => isNaN(a) ? b : Math.max(a, b);
  let trackA = false, trackB = false;
  MODULES.forEach(d => d.lessons.forEach(l => {
    const id = l.cf.block.id, e = SIM.events[id];
    if(l.cf.block.kind !== "activity" || !e || !actOpened(id)) return;
    const t = dayMs(e.date); now[""] = max(now[""], t);
    if(l.cf.phase.lane) now[l.cf.phase.lane] = max(now[l.cf.phase.lane], t);
    if(d.cf.n >= 4) trackB = true; else if(d.cf.n === 3) trackA = true;
  }));
  return {now, track: trackB ? "B" : trackA ? "A" : ""};
}
const fmtMs = t => { const d = new Date(t); return `${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(d.getUTCDate()).padStart(2, "0")}/${d.getUTCFullYear()}`; };
function caseTimeline(n){
  if(!(SIM.timeline || []).length) return "";
  if(!isTrainer()){   // a trainee sees the case only as far as they have worked it
    const {now, track} = caseNow();
    const seen = SIM.timeline.filter(m => (!m.track || m.track === track) && dayMs(m.date) <= (m.lane ? now[m.lane] : now[""]));
    if(!seen.length) return `<div class="card cf-timeline"><h3>📅 The Case So Far</h3><p class="cf-note">The timeline fills in as you work John Doe's file.</p></div>`;
    const li = list => list.map(m => `<li class="past"><i></i><b>${E(m.label)}</b><small>${E(m.date)}</small></li>`).join("");
    const at = t => isNaN(t) ? "" : `<li class="here"><i></i><b>You are here</b><small>${E(fmtMs(t))}</small></li>`;
    const laned = seen.filter(m => m.lane);
    if(!laned.length) return `<div class="card cf-timeline"><h3>📅 The Case So Far</h3><ol class="cfx-tl cfx-tl-full">${li(seen)}${at(now[""])}</ol></div>`;
    // once the two workstreams have started: the shared file, the workstreams side by side (each with its own "you are here"), then the file again
    const all = SIM.timeline.filter(m => m.lane && (!m.track || m.track === track)).map(m => dayMs(m.date)), lo = Math.min(...all), hi = Math.max(...all);
    const before = seen.filter(m => !m.lane && dayMs(m.date) < lo), after = seen.filter(m => !m.lane && dayMs(m.date) > hi);
    return `<div class="card cf-timeline"><h3>📅 The Case So Far</h3>
      ${before.length ? `<ol class="cfx-tl cfx-tl-full">${li(before)}</ol>` : ""}
      <div class="cf-lanes">${Object.entries(LANES).map(([k, name]) => `<div class="cf-lane cf-lane-${k}"><div class="cf-lane-h">${E(name)}</div><ol class="cfx-tl cfx-tl-full">${li(laned.filter(m => m.lane === k))}${after.length ? "" : at(now[k])}</ol></div>`).join("")}</div>
      ${after.length ? `<ol class="cfx-tl cfx-tl-full">${li(after)}${at(now[""])}</ol>` : ""}</div>`;
  }
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
function caseFlowProfile(){
  const c = CF.case, secs = CF.profile || [], shown = secs.filter(profileOpen);
  const pos = dayUnlocked(cfIdOf(5)) ? 5 : [4, 3, 2, 1].find(n => dayUnlocked(cfIdOf(n))) || 1;
  // one card: the page's title and the client together (applyPageHero leaves an h1 that's already in a hero alone)
  return `<div class="cf-file-page"><section class="page-hero cf-file-hero">
      <div class="cf-file-head">
        <div class="cf-file-who"><p class="eyebrow">Case File</p><h1>📂 ${E(c.style)}</h1>
          <div class="cf-client"><span class="cf-client-k">📌 Your Client</span><b>${E(c.client.name)}</b><span>Matter ${E(c.no)} · Lead Counsel ${E(c.counsel)}</span></div></div>
        <div class="cf-hero-btns"><button class="btn btn-primary btn-sm" onclick="goto('day',${cfIdOf(pos)})">Open Case Flow Day ${pos}</button><button class="btn btn-ghost btn-sm" onclick="goto('casedocs')">📁 Case Documents</button>${typeof openCms === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 CMS</button>` : ""}</div>
      </div>
      <p class="cf-note">${isTrainer() ? `The whole file, as you know it: the key tabs are the answers, and trainees never see them.${DATES ? ` 📅 Case year ${E(DATES.year)} (collision ${E(DATES.dol())}); each trainee keeps the year they started on.${DATES.preview ? ` <b>Preview of ${E(DATES.year)}</b>: <a href="?caseYear=off">end it</a>.` : ""}` : ""}` : "Your case so far is below. The file itself is in 📁 Case Documents, and the case you build is in the 🗂 CMS."}</p></section>
    ${fileTabs(shown, pos)}
</div>`;
}
/* The page in tabs: one screenful each, laid out across the width instead of down a long column.
   Everyone gets 📅 The Case So Far; the fact tabs are the trainer's and are marked as such. */
function fileTabs(shown, pos){
  const tabs = CF_FILE_TABS.filter(t => t.id === "now" || shown.some(x => (x.group || "file") === t.id));
  const cur = tabs.some(t => t.id === state.cfFileTab) ? state.cfFileTab : "now";
  const secs = shown.filter(x => (x.group || "file") === cur);
  const strip = tabs.length > 1 ? `<div class="cf-file-tabs" role="tablist">
      ${tabs.map(t => `<button type="button" role="tab" aria-selected="${t.id === cur}" title="${E(t.title)}${t.id === "now" ? "" : " — trainer only"}" class="cf-file-tab${t.id === cur ? " on" : ""}${t.id === "now" ? "" : " key"}" onclick="cmCaseFlow.fileTab('${t.id}')">${E(t.label)}</button>`).join("")}
      <span class="cf-file-only" title="The dashed tabs are the case's answers: a trainee sees none of them">🔑 yours only</span></div>` : "";
  return `<div class="cf-file-facts">${strip}
    ${cur === "now" ? caseTimeline(pos) : `<div class="cf-file-cols">${secs.map(x => `<div class="cf-file-sec"><h3>${E(x.title)}</h3><ul>${x.items.map(i => `<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}</div>`}</div>`;
}
window.cmCaseFlow.fileTab = function(id){ state.cfFileTab = id; if(typeof render === "function") render(); };

if(typeof window.renderClientProfile === "function" && Array.isArray(CF.profile)){
  window.renderClientProfile = () => caseFlowProfile();
  window.cmCaseFlow.profile = () => { if(state.view !== "clientprofile" && typeof goto === "function") return goto("clientprofile"); render(); window.scrollTo(0, 0); };   // the dashboard's "Case profile" button
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
const docUrl = d => /^RS\d\d$/.test(d.id) ? `case-doc.html?id=${d.id}${DATES && DATES.year ? `&year=${DATES.year}` : ""}`
  : typeof cmDocUrl === "function" ? cmDocUrl(d) : "documents/" + d.file;
function docLine(blockId){
  const docs = (CF_PACKETS[blockId] || []).map(id => CF_DOCS.find(d => d.id === id)).filter(Boolean);
  if(!docs.length) return "";
  return `<div class="cf-docline"><b>📁 Work from</b>${docs.map(d => `<a href="${E(docUrl(d))}" target="_blank" rel="noopener" title="${E(d.desc)}" onclick="return cmCaseFlow.doc(event,'${d.id}')">${E(d.title)}</a>`).join("")}</div>`;
}
const docOpen = d => !!(state.isAdmin || state.adminPreview) || dayUnlocked(cfIdOf(d.day));
function caseFlowDocuments(){
  const shown = CF_DOCS.filter(docOpen), locked = CF_DOCS.filter(d => !docOpen(d));
  const tpl = (window.CM_DOCS || []).filter(d => d.folder === "templates");
  const row = d => `<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span> <span style="font-size:11px;color:var(--ink-soft)">· ${d.folder === "templates" ? "Any day" : "Case Flow Day " + d.day}</span><div class="d">${E(d.desc)}</div>${state.isAdmin && d.key ? `<div class="cm-key">🔑 ${E(d.key)}</div>` : ""}</div>
      <div style="display:flex;gap:6px;align-items:center"><span class="cms">CMS: ${E(d.cms)}</span><a class="btn btn-ghost btn-sm" href="${E(docUrl(d))}" target="_blank" rel="noopener"${/^RS\d\d$/.test(d.id) ? ` onclick="return cmCaseFlow.doc(event,'${d.id}')"` : ""}>${!/^RS\d\d$/.test(d.id) && /\.(docx|xlsx)$/i.test(d.file) ? "Download" : "Open"}</a></div></div>`;
  const folders = CF_FOLDERS.map(fo => ({fo, items: shown.filter(d => d.folder === fo.id), later: locked.filter(d => d.folder === fo.id).length})).filter(x => x.items.length || x.later);
  return `<p class="eyebrow">Case Documents</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📁 Case Documents: ${E(CF.case.style)}</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 14px">The working file for John Doe v. Robert Smith: intake, police and video, Medical Records and bills, the carriers' policies and letters, liens, the Civic's Property Damage, and (Track B) the lawsuit. Each document opens with its Case Flow day, and each Skill Activity lists the ones it works from. Each shows the <b>CMS upload category</b> to use when you add it to the case in the CMS. Read them the way a Case Manager does: verify every fact against its source, and flag what doesn't match.</p>
    <div class="cm-filter"><button class="btn btn-sm btn-ghost" onclick="openCms()">🗂 Open CMS</button></div>
    ${state.isAdmin ? `<div class="card" style="padding:12px 16px;margin-bottom:16px;border-left:4px solid var(--danger);font-size:12.8px">🔑 <b>Trainer view:</b> the red notes under each document are the audit key: planted discrepancies and what a strong trainee should catch. Trainees don't see them. Every document's plants are listed in build/case-flow/documents/SPEC.md.</div>` : ""}
    ${folders.map(({fo, items, later}) => `<div class="card cm-lib-folder" style="padding:14px 18px"><h3>${fo.icon} ${E(fo.label)} <span style="font-weight:500;color:var(--ink-soft);font-size:12px">(${items.length})</span></h3>
      ${items.map(row).join("")}${later ? `<div class="cf-note">🔒 ${later} more open with later Case Flow days.</div>` : ""}</div>`).join("")}
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
    const mods = d.cf.phases.map(ph => {
      const acts = d.lessons.map((l, li) => ({b: l.cf.block, li, ph: l.cf.phase})).filter(x => x.ph === ph && x.b.kind === "activity");
      if(!acts.length) return "";
      return `<div class="cf-px-mod"><div class="cf-px-mh">${d.cf.n}.${ph.n} · ${E(ph.title)}</div>
        ${acts.map(({b, li}) => `<div class="cf-px-act"><div><b>${E(b.title)}</b>
            <div class="cf-px-meta"><span>🛠 ${E(b.act.tool)} ${open ? toolChips(blockTools(b), b.id) : ""}</span><span>📤 ${E(b.act.output)}</span>${(CF_PACKETS[b.id] || []).length ? `<span>📁 ${CF_PACKETS[b.id].length} documents</span>` : ""}</div></div>
          ${open ? `<button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.openBlock(${d.id},${li})">Open</button>` : `<span class="cf-px-lock">🔒</span>`}</div>`).join("")}</div>`;
    }).join("");
    return `<div class="card px-day"><div class="px-day-h"><div><h2>Case Flow Day ${d.cf.n}${open ? "" : " · 🔒"}${day.track ? ` <span class="cf-px-track">${E(day.track)}</span>` : ""}</h2><div class="sub">${E(day.phase)}</div></div>
        <span class="px-prog">${kcDone(d) ? "Knowledge Check passed ✓" : open ? "In progress" : "Opens when the day before is passed"}</span></div>
      <div class="cf-px-mods">${mods}</div></div>`;
  }).join("");
  const any = [
    `<button class="btn btn-ghost btn-sm" onclick="goto('casedocs')">📁 Case Documents</button>`,
    typeof rpLaunchQuickPractice === "function" ? `<button class="btn btn-ghost btn-sm" onclick="rpLaunchQuickPractice()">🎲 Quick roleplay call</button>` : "",
    typeof openTool === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openTool('cms',null,'library=1')">📚 CMS Training Library</button>` : "",
    typeof openCms === "function" ? `<button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 Open the CMS</button>` : ""].join("");
  return `<p class="eyebrow">Practice</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">🧪 Practice: The Case Flow Skill Activities</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:84ch;margin:0 0 14px">Every hands-on exercise of the 5-Day Legal Case Management Flow, on the live file <b>${E(CF.case.style)}</b>: each Case Phase's Skill Activities, every one worked on John Doe's file in the CMS (with the Call Simulator or the email workspace where it names them), from the documents it lists. Each opens with its day and goes straight to its slide.</p>
    ${tabs}
    ${days}
    <div class="card" style="padding:14px 18px;margin-bottom:14px"><b style="color:var(--navy)">Any day</b><div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:10px">${any}</div></div>
`;
}
if(typeof window.renderPracticeHub === "function") window.renderPracticeHub = () => caseFlowPractice();

/* ---------- styles: only what the course's own classes don't already give ---------- */
const st = document.createElement("style"); st.id = "cm-case-flow"; st.textContent = `
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
.cf-kcr-score{display:flex;align-items:center;gap:14px;}.cf-kcr-score .big{font-size:30px !important;margin:0 !important;}.cf-kcr-score .sub{margin-top:2px;}
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
.cfx-lesson .cfx-dd > div{display:flex;flex-direction:column;align-items:center;}
.cfx-lesson .cfx-dd h3{text-align:center;}
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
.cfx-th-cont{font:700 13px var(--font-ui);letter-spacing:.06em;text-transform:uppercase;color:var(--orange-deep);margin:0 0 12px;text-align:center;}
.cfx-th-grid{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:9px;}
.cfx-th-c{background:#fff;border:1.5px solid #E6DED2;border-left:5px solid #DB8437;border-radius:12px;padding:7px 12px;display:flex;flex-direction:column;gap:2px;animation:cfxIn .3s ease-out both;}
.cfx-th-c b{font:800 15px/1.25 'Poppins','Inter',sans-serif;color:var(--navy);letter-spacing:.01em;}
.cfx-th-c span{font:500 16px/1.35 var(--font-ui);color:var(--ink);}
.cfx-th-solo .cfx-th-c span{font-size:17px;}
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
/* one card: the slide's design sits directly on the card (no second card inside it), the full width of the stage;
   Previous / Next sit under it, on the page (cfStage() builds this from the engine's stage); the presenter is in the side column */
.lesson-stage:has(> .cf-stage-card){background:transparent !important;box-shadow:none !important;padding:0 !important;border-radius:0 !important;overflow:visible !important;
  display:grid !important;grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto;}
.cf-stage-card{grid-column:1;grid-row:1;position:relative;overflow:hidden;min-width:0;background:#262B45;border-radius:20px;padding:16px 20px 14px;box-shadow:0 18px 40px -22px rgba(20,24,48,.65);}
.cf-stage-card::before{content:"";position:absolute;top:0;right:0;width:min(200px,20%);height:46px;border-radius:0 0 0 100%;background:#DB8437;opacity:.95;pointer-events:none;}
.cf-stage-card > *{position:relative;z-index:1;}
.cf-stage-card .slide-dots{padding-right:min(190px,19%);}   /* the dots stop short of the orange corner */
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
.cfx-deck-head{display:flex;align-items:center;gap:20px;padding:0 0 8px;margin:0 0 10px;border-bottom:2px solid rgba(255,255,255,.88);}
.cfx-logo{height:48px;width:auto;flex:0 0 auto;}
.cfx-deck-title{margin:0 !important;font:800 33px/1.1 'Poppins','Inter',sans-serif !important;color:#fff !important;letter-spacing:.005em;
  text-shadow:-2px -2px 0 #DB8437,2px -2px 0 #DB8437,-2px 2px 0 #DB8437,2px 2px 0 #DB8437,0 -2px 0 #DB8437,0 2px 0 #DB8437,-2px 0 0 #DB8437,2px 0 0 #DB8437,0 4px 0 rgba(0,0,0,.18);}
.cfx-ribbon{margin:0 0 10px;}
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
.cf-file-only{font-size:11px;font-weight:800;letter-spacing:.03em;text-transform:uppercase;color:#8A2F26;background:rgba(253,232,228,.75);border-radius:999px;padding:3px 9px;margin-right:4px;}
.cf-file-tab{font:600 12.5px 'Inter',sans-serif;color:#2B3147;background:rgba(255,255,255,.62);border:1px solid #C9CEDB;border-radius:999px;padding:4px 12px;cursor:pointer;}
.cf-file-tab:hover{border-color:#DB8437;}
.cf-file-tab.on{background:#132A5C;border-color:#132A5C;color:#fff;}
.cf-file-cols{columns:4 260px;column-gap:18px;padding:10px 14px;border:1px solid #D7DCE7;border-radius:12px;background:rgba(255,255,255,.62);}
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
.cf-file-page .cf-file-facts .cf-timeline{flex:0 1 auto;min-height:0;overflow:auto;}
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
.cf-file-sec h3{margin:0 0 4px;font:700 12.5px 'Fraunces',serif;color:#132A5C;break-after:avoid;}
.cf-file-sec ul{margin:0;padding-left:15px;}
.cf-file-sec li{font-size:11px;line-height:1.32;color:#2E3345;margin-bottom:2.5px;}
.cf-file-sec li:last-child{margin-bottom:0;}
/* a laptop screen: the same cards, a little tighter, so a tab still fits without scrolling */
@media (max-width:1440px){
  .cf-file-sec li{margin-bottom:2px;}
  .cf-file-cols{columns:4 240px;column-gap:10px;}
}
/* a small laptop (1280 x 720): narrower columns, so a tab still fits the screen */
@media (max-width:1300px){
  .cf-file-cols{columns:5 200px;column-gap:9px;padding:7px 10px;}
  .cf-file-sec{margin-bottom:5px;}
  .cf-file-sec + .cf-file-sec{padding-top:5px;}
  .cf-file-sec h3{font-size:12px;margin-bottom:3px;}
  .cf-file-sec li{font-size:10.8px;line-height:1.28;margin-bottom:1.5px;}
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
#cf-return-next{position:fixed;right:16px;bottom:16px;z-index:60;font:800 14px 'Inter',sans-serif;padding:11px 20px;border:0;border-radius:999px;background:var(--orange,#E87722);color:#fff;box-shadow:0 6px 18px rgba(0,0,0,.25);cursor:pointer;}
/* the sub-header: a full-width bar, the topic centred in capitals and quotes, on a lighter navy with an orange rule */
.cfx-ribbon span{display:block;text-align:center;background:linear-gradient(90deg,#343C66 0%,#46508A 50%,#343C66 100%);border-bottom:3px solid #DB8437;border-radius:6px;color:#fff;font:800 20px/1.25 'Poppins','Inter',sans-serif;letter-spacing:.04em;text-transform:uppercase;padding:8px 24px;}
.cfx-ribbon span::before{content:"“";color:#F4B77A;margin-right:2px;}.cfx-ribbon span::after{content:"”";color:#F4B77A;margin-left:2px;}
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
.cfx-task-card{background:#C9CDD8;color:#1F2433;border-radius:22px;padding:14px 22px;border:3px solid #E9EBF0;}
.cfx-task-card .cfx-chip{background:#262B45;color:#fff;}
.cfx-task-card .cfx-situation{margin:8px 0 0;font-size:22px;color:#1F2433;}
/* the day's Training Agenda */
.cfx-ag-list li > div{flex:1;min-width:0;text-align:left;}.cfx-ag-list li > div b, .cfx-ag-list li > div small{text-align:left;}
.cfx-ag-min{margin-left:auto;font:800 14px 'IBM Plex Mono',monospace;color:#F4B77A;white-space:nowrap;}
.cfx-time{font:700 12px 'IBM Plex Mono',monospace;letter-spacing:.02em;padding:4px 10px;border-radius:999px;border:1px solid rgba(255,255,255,.35);background:rgba(255,255,255,.08);color:#F4B77A;cursor:pointer;white-space:nowrap;}
.cfx-time.on{background:#DB8437;color:#fff;border-color:#DB8437;}.cfx-time.over{background:#B54A3F;border-color:#B54A3F;}
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
  .cfx-ribbon span{font-size:16px;padding:6px 12px;}
  .cfx-deck .cfx-top{flex-wrap:wrap;gap:8px 10px;}.cfx-deck .cfx-title.cfx-pill{white-space:nowrap;font-size:15px !important;padding:5px 12px;}
  .cfx-deck .cfx-kicker{display:none;}.cfx-thumb:nth-child(n+3){display:none;}
  .cfx-docs-row{flex-wrap:wrap;}.cfx-thumb{flex-basis:44%;}
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
.cfx-sb-grid{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.15fr);gap:18px;align-items:start;}
.cfx-sb-main{display:flex;flex-direction:column;gap:10px;}
/* the case documents in one row, as big as the column and the screen's height allow (600px images, so they stay legible) */
.cfx-sb-docs .cfx-docs-row{display:flex;flex-wrap:nowrap;justify-content:center;align-items:flex-start;gap:14px;margin:0;}
.cfx-sb-docs .cfx-thumb{flex:1 1 0;min-width:0;max-width:min(280px,calc((100vh - 430px) / 1.3));}
.cfx-sb-docs .cfx-thumb img{border-width:3px;}
.cfx-sb-docs .cfx-thumb span{font-size:12.5px;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
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
.cf-timeline .cfx-tl-full li small{order:1;min-width:92px;font-size:12px;}
.cf-timeline .cfx-tl-full li b{order:2;font-size:14px;padding:0;}
.cf-timeline .cfx-tl-full li.here{padding:8px 0;}
.cf-timeline .cfx-tl-full li.here i{margin-top:0;margin-left:-2px;}
.cfx-tl-full{flex-wrap:wrap;row-gap:14px;}.cfx-tl-full li{flex:0 0 calc(100% / 8);}.cfx-tl-full::before{display:none;}
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
  .cfx-hero,.cfx-split,.cfx-lesson .cfx-split,.cfx-task,.cfx-dd,.cfx-qs-2,.cfx-theory,.cfx-th-grid,.cfx-fw-flow{grid-template-columns:minmax(0,1fr);}
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
