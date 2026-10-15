/* ============================================================
   5-DAY LEGAL CASE MANAGEMENT FLOW — the track's days, slides and wiring
   Focus case: John Doe v. Robert Smith · Lead Counsel: Atty. Elijah Thone

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
const RHYTHM = "lesson,activity,lesson,activity,check";
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

CF.days.forEach(day => {
  const lessons = [], quiz = [], quizMod = [];
  day.modules.forEach(mod => {
    if(mod.blocks.map(b => b.kind).join(",") !== RHYTHM)
      console.warn(`[case-flow] ${mod.id} breaks the Lesson → Activity → Lesson → Activity → Knowledge Check rhythm`);
    mod.blocks.forEach((b, k) => {
      const fp = b.kind === "lesson"
        ? {corePrinciples: [b.tell.why].concat(b.tell.rules), howTo: (b.ops || []).map(o => `${o[1]} (${o[2]}).`)}
        : b.kind === "activity"
        ? {corePrinciples: [b.act.scenario, b.act.prompt], howTo: b.act.checkpoints}
        : {corePrinciples: b.check.questions, howTo: b.check.summary};
      lessons.push(Object.assign({
        h: `${mod.n}.${k + 1} ${b.title}`,
        fourPart: Object.assign(fp, {bestPractices: b.best || [], discussionCase: ""}),
        trainerCue: (b.notes || [])[0] || "",
        cf: {day, mod, block: b, k}
      }, layoutOf(b.show)));
    });
    (mod.quiz || []).forEach(q => { quiz.push(q); quizMod.push(mod.id); });
  });
  const d = {
    id: day.id,
    title: day.title,
    theme: day.modules.map(m => m.title).join(" · "),
    objective: day.objective,
    taskOverview: day.modules.map(m => ({
      label: `Module ${m.n} · ${m.title}`,
      tasks: m.blocks.filter(b => b.kind === "activity").map(b => b.title).concat([m.blocks[4].title]),
      sample: `Sample task: ${m.blocks.find(b => b.kind === "activity").act.prompt.split(". ")[0]}.`
    })),
    lessons,
    quickChecks: [],
    quiz,
    discussionQuestion: day.discussion,
    noDividers: true,           // each block opens with its own module/block header
    cf: {n: day.n, gate: day.gate, quizMod}
  };
  MODULES.push(d);
  BY_ID[d.id] = d;
});
const cfDay = id => BY_ID[Number(id)] || null;
const cfDayByN = n => MODULES.find(d => d.cf.n === n) || null;
window.CM_CASE_FLOW_DAYS = MODULES;

/* ---------- found by id like a day, not counted as one (the js/ft-rules.js pattern) ----------
   Chains off whatever DAYS.find / DAYS.some already are, so it composes with any other patch. */
const __find = DAYS.find, __some = DAYS.some;
Object.defineProperty(DAYS, "find", {configurable: true, writable: true, value: function(fn, that){
  const r = __find.call(this, fn, that);
  return r !== undefined ? r : MODULES.find(m => fn.call(that, m, this.length, this));
}});
Object.defineProperty(DAYS, "some", {configurable: true, writable: true, value: function(fn, that){
  return __some.call(this, fn, that) || MODULES.some(m => fn.call(that, m, this.length, this));
}});
if(typeof DAY_ICONS !== "undefined") MODULES.forEach((m, i) => { if(!DAY_ICONS[m.id]) DAY_ICONS[m.id] = ["🗂", "📨", "💵", "⚖️", "🏛"][i] || "📘"; });

/* Program counts stay with Days 1–5: a passed Case Flow day must not push "Program complete"
   past 100% or move the program's average. (The certificate already counts DAYS only.) */
const programIds = () => new Set(Array.prototype.map.call(DAYS, d => d.id));
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
  if(state.isAdmin || state.adminPreview || d.cf.n === 1) return true;
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
const rec = id => (REC.modules[id] = REC.modules[id] || {answers: [], scale: []});
async function load(){
  if(loaded || typeof storeGet !== "function") return;
  loaded = true;
  try{ const v = await storeGet(KEY); if(v && typeof v === "object" && v.modules) REC = v; }catch(e){}
  await loadTrainerScores();
}
/* The trainer's 40% lives with the trainee's feedback (the trainer writes it, the trainee reads it). */
async function loadTrainerScores(){
  if(typeof sharedGet !== "function" || !state || !state.traineeId || state.isAdmin) return;
  try{
    const fb = await sharedGet("feedback:" + state.traineeId);
    Object.entries((fb && fb.caseFlow) || {}).forEach(([id, t]) => { if(t && typeof t.score === "number") rec(id).trainer = t; });
  }catch(e){}
}
const persist = () => { REC.updatedAt = new Date().toISOString(); return typeof storeSet === "function" ? storeSet(KEY, REC) : Promise.resolve(); };
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

function selfSummary(b, day, mod){
  const m = rec(mod.id);
  const qs = b.check.summary.map((q, j) => `<label class="cf-ss-q"><span><b>${j + 1}.</b> ${E(q)}</span>
      <textarea id="cfss_${mod.id}_${j}" rows="3" oninput="cmCaseFlow.draft('${mod.id}')">${E(m.answers[j] || "")}</textarea></label>`).join("");
  const scale = `<div class="mini-table-wrap"><table class="mini-table cf-scale"><thead><tr><th>Competency</th>${CF.scale.map(([n, t]) => `<th title="${E(t)}">${n}</th>`).join("")}</tr></thead>
      <tbody>${b.check.scale.map((c, j) => `<tr><td>${E(c)}</td>${CF.scale.map(([n]) => `<td><input type="radio" name="cfsc_${mod.id}_${j}" value="${n}" aria-label="${E(c)}: ${n}" ${m.scale[j] === n ? "checked" : ""} onchange="cmCaseFlow.rate('${mod.id}',${j},${n})"></td>`).join("")}</tr>`).join("")}</tbody></table></div>
      <p class="cf-legend">${CF.scale.map(([n, t]) => `<b>${n}</b> ${E(t)}`).join(" · ")}</p>`;
  return `<div class="cf-ss" data-mod="${mod.id}">${qs}${scale}
      <div class="cf-ss-act"><button type="button" class="btn btn-ghost btn-sm" onclick="cmCaseFlow.save('${mod.id}')">Save</button>
      <button type="button" class="btn btn-navy btn-sm" onclick="cmCaseFlow.review(${day.id},'${mod.id}')">Submit for review</button>
      <span class="cf-ss-st" id="cfss_st_${mod.id}">${m.savedAt ? "Saved " + E(new Date(m.savedAt).toLocaleString()) : ""}</span></div>
      <div id="cfss_res_${mod.id}">${scoreHtml(mod.id)}</div></div>`;
}

/* ---------- a block's card: part 1 = Tell + Show (or Let); part 2 = practice, rubric, self-summary ---------- */
function card(l, i, d, part){
  const {day, mod, block: b, k} = l.cf, p = part === 2 ? 2 : 1;
  let body = "";
  if(b.kind === "lesson"){
    body = p === 1
      ? S(1, "Tell Them — the rules and the strategic why", `<p class="cf-why">${E(b.tell.why)}</p>${ul(b.tell.rules)}`
          + (b.tell.upl || []).map(u => renderCallout({type: "warning", label: "UPL boundary", text: u})).join(""))
        + S(2, showLabel(b, "Show Them"), visual(l, b))
      : S(3, "Trigger ➔ Task ➔ Tool ➔ Checkpoint", opsTable(b.ops))
        + S(4, "Best Practices & Pitfalls", renderPracticeCards(b.best))
        + rubricHtml(b.rubric);
  }else if(b.kind === "activity"){
    body = p === 1
      ? S(1, "Let Them — the scenario", `<div class="scenario-card"><div class="stag">John Doe v. Robert Smith</div><p class="scn">${E(b.act.scenario)}</p></div>`)
        + S(2, "Let Them — execute on the live file", `<p class="cf-prompt">${E(b.act.prompt)}</p>
            <div class="cf-tool"><div><b>🛠 Tool / interface</b><span>${E(b.act.tool)}</span></div><div><b>📤 Expected output</b><span>${E(b.act.output)}</span></div>
            ${/CMS/.test(b.act.tool) && typeof openCms === "function" ? `<button type="button" class="btn btn-navy btn-sm" onclick="openCms()">Open CMS</button>` : ""}</div>`)
        + (b.show ? S(3, showLabel(b, "Show Them — the reference model"), visual(l, b)) : "")
      : S(3, "Verification checkpoints", `<div class="check-list">${b.act.checkpoints.map(c => `<label class="check-item"><input type="checkbox">${E(c)}</label>`).join("")}</div>`)
        + S(4, "Trigger ➔ Task ➔ Tool ➔ Checkpoint", opsTable(b.ops))
        + S(5, "Best Practices & Pitfalls", renderPracticeCards(b.best))
        + rubricHtml(b.rubric);
  }else{
    body = p === 1
      ? S(1, "Knowledge verification", `<div class="qcheck-card"><div class="qc-tag"><span class="dot"></span>Answer in your own words, from this file</div><ol class="cf-q">${b.check.questions.map(q => `<li>${E(q)}</li>`).join("")}</ol></div>`)
        + `<p class="cf-note">The day's auto-graded questions are in the Knowledge Check at the end of Case Flow Day ${day.n}.</p>`
      : S(2, "Case Manager Self-Summary & Skill Scale", selfSummary(b, day, mod))
        + S(3, "Best Practices & Pitfalls", renderPracticeCards(b.best))
        + rubricHtml(b.rubric);
  }
  return `<div class="topic-separator">CASE FLOW DAY ${day.n}${day.track ? ` &middot; ${E(day.track).toUpperCase()}` : ""} &middot; MODULE ${mod.n} OF ${day.modules.length} &middot; ${KIND[b.kind].toUpperCase()} &middot; BLOCK ${k + 1} OF ${mod.blocks.length} &middot; PART ${p} OF 2</div>
    <div class="card lesson-card density-m cf-card" data-part="${p}">
      <h4><span class="lnum">${mod.n}.${k + 1}</span>${E(b.title)}</h4>
      <p class="cf-topic">${E(mod.title)} · ${E(b.topic)}</p>
      ${strip()}
      ${body}
    </div>`;
}
const __card = window.renderLessonCard;
window.renderLessonCard = function(l, i, d, unused, part){
  return (l && l.cf) ? card(l, i, d, part) : __card.apply(this, arguments);
};

/* ---------- Presenter view: the speaker notes, as this course's slide scripts ---------- */
window.SLIDE_SCRIPTS = window.SLIDE_SCRIPTS || {};
MODULES.forEach(d => d.lessons.forEach(l => {
  const b = l.cf.block, n = b.notes || [];
  const walk1 = b.kind === "lesson" ? b.tell.rules : b.kind === "activity" ? b.act.checkpoints : b.check.questions;
  window.SLIDE_SCRIPTS[`${d.id}::${l.h}`] = {
    p1: {why: b.kind === "lesson" ? b.tell.why : b.kind === "activity" ? b.act.scenario : "Knowledge check: answers come from this file, in the trainee's own words.",
         talk: n[0] || "", walk: walk1, ask: n[1] || "", scenario: ""},
    p2: {why: "How this block is graded, and what to watch for.",
         talk: n.slice(2).join(" "),
         walk: (b.best || []).map(x => String(x).replace(/^pitfall:\s*/i, "Watch for this: ")),
         ask: b.kind === "check" ? "Compare each trainee's self-rating with their score, and talk through any wide gap." : "",
         scenario: b.kind === "check" ? (d.discussionQuestion || "") : ""}
  };
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
window.cmCaseFlow = {
  draft(modId){ readForm(modId); clearTimeout(draftTimer); draftTimer = setTimeout(() => { persist(); status(modId, "Draft saved"); }, 900); },
  rate(modId, j, n){ rec(modId).scale[j] = n; persist(); },
  async save(modId){ const m = readForm(modId); m.savedAt = new Date().toISOString(); await persist(); status(modId, "Saved " + new Date(m.savedAt).toLocaleString()); },
  async review(dayId, modId){
    const d = cfDay(dayId), m = readForm(modId);
    const mod = CF.days.find(x => x.id === dayId).modules.find(x => x.id === modId);
    const b = mod.blocks.find(x => x.kind === "check");
    if(m.answers.filter(a => String(a || "").trim().split(/\s+/).length >= 12).length < b.check.summary.length){
      if(typeof toast === "function") toast("Answer each Self-Summary prompt in a few sentences first."); return;
    }
    if(b.check.scale.some((_, j) => !m.scale[j])){ if(typeof toast === "function") toast("Rate yourself 1–5 on every competency first."); return; }
    m.savedAt = new Date().toISOString(); await persist();
    if(typeof runRubricEvaluation !== "function"){ status(modId, "Saved. The AI reviewer isn't available here; your trainer will review it."); return; }
    status(modId, "Reviewing…");
    const c = CF.case, day = CF.days.find(x => x.id === dayId);
    const label = `Day ${dayId} · Case Flow Day ${d.cf.n} · Module ${mod.n} — CM Self-Summary`;   // "Day <id>" files it under this day, not under Apex Day ${d.cf.n}
    const ctx = `Case: ${c.style}, ${c.type}. Lead counsel ${c.counsel}. DOL ${c.dol}; SOL ${c.sol}. Client ${c.client.name}, ${c.client.position}. `
      + `Coverage stack (in order): ${stackLayers().map(l => `${l.tag} ${money(l.limit)} (${l.carrier})`).join(" → ")} = ${money(c.total)}. `
      + `Health plan ${c.health.carrier} (${c.health.memberId}). Critical fact: ${c.critical}\n`
      + (day && (day.fileState || []).length ? `Where the file stands on Case Flow Day ${day.n} (${day.phase}): ${day.fileState.join(" ")}\n` : "")
      + `Module: ${mod.title} — ${mod.about}\nThe module's knowledge-verification questions were:\n- ${b.check.questions.join("\n- ")}`;
    const text = b.check.summary.map((q, j) => `${q}\n${m.answers[j] || ""}`).join("\n\n")
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
};

/* ---------- the dashboard: the track's own row of day cards, under Days 1–5 ---------- */
if(typeof renderDashboard === "function"){
  const __dash = renderDashboard;
  renderDashboard = function(){
    const html = __dash.apply(this, arguments);
    const t = document.createElement("template"); t.innerHTML = html;
    const main = t.content.querySelector(".dash-main");
    if(!main || typeof moduleCard !== "function") return html;
    const c = CF.case;
    const cards = MODULES.map(d => relabel(moduleCard(d), d)).join("")
      + (CF.upcoming || []).filter(u => !cfDayByN(u.n)).map(u => `<div class="module-card mc-locked cf-soon">
          <div class="module-head"><div class="mh-day">Case Flow Day ${u.n} · In development</div><div class="mh-title">${E(u.title)}</div></div>
          <div class="module-body"><ul class="module-topic-list">${u.modules.map(m => `<li>${E(m)}</li>`).join("")}</ul></div></div>`).join("");
    const sec = document.createElement("section");
    sec.className = "cf-dash";
    sec.innerHTML = `<div class="cf-dash-head"><p class="eyebrow">New track</p>
        <h2>5-Day Legal Case Management Flow</h2>
        <p>One file from intake to deposition: <b>${E(c.style)}</b> · ${E(c.counsel)} · ${E(money(c.total))} stack · ${E(c.gapDays)}-Day Treatment Gap. Every module runs Lesson → Skill Activity → Lesson → Skill Activity → Knowledge Check.</p>
        ${window.cmCaseFlow.profile ? `<p><button class="btn btn-ghost btn-sm" onclick="cmCaseFlow.profile(true)">📂 Case profile: ${E(c.style)}</button></p>` : ""}</div>
      <div class="module-grid">${cards}</div>`;
    main.appendChild(sec);
    return t.innerHTML;
  };
}

/* ---------- the trainer's 40%: entered in each trainee's Admin panel ---------- */
const allMods = () => CF.days.flatMap(day => day.modules.map(m => ({day, m})));
function trainerPanel(rec){
  const work = (state.traineeWork || {})[rec.id];
  if(!work || work.loading || !work.feedback) return "";
  const mine = (work.snap || {})[KEY] || {modules: {}}, given = work.feedback.caseFlow || {}, sid = cssId(rec.id);
  const rows = allMods().map(({day, m}) => {
    const r = mine.modules[m.id] || {}, t = given[m.id] || {}, b = m.blocks.find(x => x.kind === "check");
    const c = composite(Object.assign({}, r, {trainer: t}));
    const answered = (r.answers || []).some(a => String(a || "").trim());
    return `<details class="cf-tr"><summary><b>Case Flow Day ${day.n} · ${m.n}</b> ${E(m.title)}
        <span class="cf-tr-chips">${r.quiz ? `<span class="fb-chip sent">Quiz ${E(r.quiz.pct)}%</span>` : ""}${r.ai ? `<span class="fb-chip sent">AI ${E(r.ai.score)}%</span>` : ""}${typeof t.score === "number" ? `<span class="fb-chip sent">Trainer ${E(t.score)}%</span>` : (answered ? `<span class="fb-chip draft">To score</span>` : `<span class="fb-chip none">No summary yet</span>`)}${c.c != null ? `<span class="fb-chip sent">Composite ${E(c.c)}%</span>` : ""}</span></summary>
      ${answered ? `<div class="fb-evidence">${b.check.summary.map((q, j) => `<div><b>${E(q)}</b><br>${E((r.answers || [])[j] || "—")}</div>`).join("")}
        <div><b>Self-ratings:</b> ${b.check.scale.map((x, j) => `${E(x)}: ${E((r.scale || [])[j] || "—")}`).join(" · ")}</div></div>` : ""}
      <div class="cf-tr-rubric"><b>Assess against:</b> ${b.rubric.trainer.map(x => `${E(x[0])} (${E(x[1])})`).join(" · ")} — UPL is a gate, not a weighting.</div>
      <div class="fbc-row"><label>Trainer score (0–100)<input type="number" min="0" max="100" id="cftr_${sid}_${m.id}" value="${typeof t.score === "number" ? E(t.score) : ""}"></label></div>
      <label class="fbc-full">Comment for the trainee<textarea id="cftc_${sid}_${m.id}" rows="2">${E(t.comment || "")}</textarea></label>
      <div class="fbc-actions"><button class="btn btn-primary btn-sm" onclick="cmCaseFlow.trainerSave('${rec.id}','${m.id}')">Save trainer score</button></div>
    </details>`;
  }).join("");
  return `<div class="fb-admin cf-tr-wrap"><div class="sidebar-section-lbl" style="padding-left:0;">Case Flow — trainer assessment (40%)</div>
    <p class="cf-note">The trainee's quiz share and AI review make the automated 60%. Your score here makes the 40%; the composite appears on their Knowledge Check once both are in.</p>${rows}</div>`;
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
  renderFeedbackAdmin = function(rec){ const html = __fbAdmin.apply(this, arguments); try{ return html + trainerPanel(rec); }catch(e){ return html; } };
}

/* ---------- the Case File page: the Apex file and this file's case profile ----------
   The Case File page keeps the John Doe v. Apex file exactly as it is and gains a
   switch to this file's profile (CF.profile). Each section opens with its Case Flow day
   (`opens`) or once that day is passed (`passed`), so the profile never gives away a
   day's answers; trainers see every section. */
const cfIdOf = n => (cfDayByN(n) || {}).id;
const profileOpen = sec => !!(state.isAdmin || state.adminPreview) ||
  (sec.opens ? dayUnlocked(cfIdOf(sec.opens)) : !!((state.progress || {})[cfIdOf(sec.passed)] || {}).done);
const lockLabel = sec => sec.opens ? `Opens with Case Flow Day ${sec.opens}` : `Opens when you pass Case Flow Day ${sec.passed}`;
function caseFlowProfile(){
  const c = CF.case, secs = CF.profile || [], shown = secs.filter(profileOpen), locked = secs.filter(x => !profileOpen(x));
  const gates = [];
  locked.forEach(x => { const k = lockLabel(x), g = gates.find(y => y.k === k); g ? g.t.push(x.title) : gates.push({k, t: [x.title]}); });
  const pos = dayUnlocked(cfIdOf(5)) ? 5 : [4, 3, 2, 1].find(n => dayUnlocked(cfIdOf(n))) || 1;
  return `<h1 style="color:var(--navy);font-size:28px;margin:0 0 10px">📂 Case File: ${E(c.style)}</h1>
    <div class="client-intro-banner"><div class="cib-tag">🧭 Case Flow File</div><h2>One file, from intake to deposition</h2>
      <p>The file you work in the 5-Day Legal Case Management Flow: ${E(c.no)} · ${E(c.counsel)} · ${E(money(c.total))} stack · ${E(c.gapDays)}-Day Treatment Gap. It is a separate training file from John Doe v. Apex Delivery Services.</p>
      <p>This profile grows with the file. Each section opens with the day it belongs to, and what a day's work produces (the audited specials, the reasons for the gap, the net sheet, the calendar) opens once you pass that day, so work it out from the documents first.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-navy btn-sm" onclick="goto('day',${cfIdOf(pos)})">Open Case Flow Day ${pos}</button></div></div>
    <div class="profile-grid">${shown.map(x => `<div class="card profile-section"><h3>${E(x.title)}</h3><ul>${x.items.map(i => `<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}
      ${gates.map(g => `<div class="card profile-section cf-prof-lock"><h3>🔒 ${E(g.k)}</h3><ul>${g.t.map(t => `<li>${E(t)}</li>`).join("")}</ul></div>`).join("")}</div>`;
}
function profileSwitch(){
  const on = !!state.cfProfile;
  return `<div class="cf-prof-switch" role="tablist" aria-label="Case files">
    <button role="tab" aria-selected="${!on}" class="${on ? "" : "on"}" onclick="cmCaseFlow.profile(false)">📂 John Doe v. Apex Delivery <small>Days 1–5</small></button>
    <button role="tab" aria-selected="${on}" class="${on ? "on" : ""}" onclick="cmCaseFlow.profile(true)">🧭 John Doe v. Robert Smith <small>Case Flow</small></button></div>`;
}
if(typeof window.renderClientProfile === "function"){
  const __profile = window.renderClientProfile;
  window.renderClientProfile = function(){
    return profileSwitch() + (state.cfProfile && Array.isArray(CF.profile) ? caseFlowProfile() : __profile.apply(this, arguments));
  };
  window.cmCaseFlow.profile = function(on){
    state.cfProfile = !!on;
    if(state.view !== "clientprofile" && typeof goto === "function") return goto("clientprofile");
    render(); window.scrollTo(0, 0);
  };
}

/* ---------- styles: only what the course's own classes don't already give ---------- */
const st = document.createElement("style"); st.id = "cm-case-flow"; st.textContent = `
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
.cf-tr-wrap{margin-top:14px;}
.cf-tr summary{cursor:pointer;display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.cf-tr-chips{display:inline-flex;flex-wrap:wrap;gap:4px;}
.cf-tr-rubric{font-size:12.5px;color:var(--ink-soft);margin:6px 0;}
.cf-tr input[type=number]{width:90px;}
.cf-dash-head h2{margin:2px 0 6px;color:var(--navy);font-size:22px;}
.cf-dash-head p:not(.eyebrow){margin:0 0 12px;max-width:90ch;color:var(--ink-soft);font-size:14px;}
.cf-soon .module-body{opacity:.8;}
.cf-prof-switch{display:inline-flex;flex-wrap:wrap;gap:4px;padding:4px;margin:0 0 14px;background:#F6F7FB;border:1px solid var(--line);border-radius:12px;max-width:100%;}
.cf-prof-switch button{border:0;background:transparent;border-radius:9px;padding:7px 12px;font:700 13px var(--font-ui);color:var(--navy);cursor:pointer;}
.cf-prof-switch button small{font-weight:500;color:var(--ink-soft);margin-left:4px;}
.cf-prof-switch button.on{background:#fff;box-shadow:0 1px 3px rgba(20,30,60,.12);}
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
