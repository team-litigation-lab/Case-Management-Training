/* ============================================================
   🔁 The daily loop: every Case Flow day runs the same five steps, in this order
       1. 📘 Lessons: all of the day's lessons (and, on Day 2, the trainers' deck pages)
       2. 📇 The Case Profile: Day 1, 👋 Meet John Doe (js/cm-case-profile.js, its "meetJohnDoe" slide) and his Intake,
          which is the day's Skill Building; Days 2–5, a short check-in ("profileCheck") that sends the trainee to the
          Case Profile with what changed on the file since yesterday (the day's fileState, js/cm-case-flow-data.js)
       3. 🎯 ONE Skill Building: the day's `main` activity (CF.sequence), AI graded (js/cm-ai-grader.js) from its Your
          Task (js/cm-sb-task.js); on Day 5, a build day, the Full Application Practice (the companion case)
       ➕ 📁 Backup File Maintenance (CF.sequence `drive`: d1m1-drive … d5-drive), REQUIRED every day, right after the
          Skill Building (Day 5: after the build) and before the Action Plan: a full activity, AI graded from its Your
          Task and graded from the Drive itself; its slides say REQUIRED · BACKUP FILE MAINTENANCE on their top line
          (stepOf: "drive", between steps 3 and 4)
       4. 📝 Update Your Action Plan ("actionPlan"): Day 1 step by step, the template's sections in order; the days after
          lighter each day (progressive autonomy), Day 5 a close-out
       5. 🎯 the Knowledge Check, after the Ready check
   Every other activity of the day is a short side exercise, and every one counts (none of it is optional) ("side": true in its slide copy: "Assuming …",
   two or three steps, logged in the CMS). They sit together in ONE short 🧪 Practice Lab after the Action Plan and
   before the Ready check, where ⏭ goes on to the Ready check: the loop's four steps run without a detour and the plan is written while
   the Skill Building is fresh; what is left at the end of the block is finished from the Practice page. Each side
   exercise's slides say SKILL ACTIVITY on their top line and band; the Skill Building's say THE DAY'S SKILL BUILDING.
   This file wraps buildDaySlides after js/cm-case-flow.js, js/cm-case-profile.js and js/cm-deck-pages.js. A saved place
   follows its slide by key (js/cm-slide-keys.js), wherever the loop put it, with one rule of the loop's own (placeRule):
   a place saved before the loop on the old Practice Lab's opening slide, or on a side exercise that sat before the day's
   Skill Building in that lab, would land after the Skill Building and the Action Plan the trainee has not done; it lands
   on the loop's start instead (step 2, the Case Profile). The minutes are js/cm-case-flow-schedule.js (the loop's own steps).
   ============================================================ */
(function(){
"use strict";
const CF = window.CM_CASE_FLOW;
if(!CF || !window.cmCaseFlow || typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const isCf = d => !!(d && d.cf && Array.isArray(d.lessons));
const seqOf = d => (CF.sequence || []).find(s => s.n === d.cf.n) || {};
const mainId = d => seqOf(d).main || "";
const driveId = d => seqOf(d).drive || "";   // 📁 Backup File Maintenance: required every day
const isSide = id => !!((window.CM_CF_SLIDES || {})[id] || {}).side;
const trainer = () => !!(state.isAdmin || state.adminPreview);
const PROFILE = "profileCheck", PLAN = "actionPlan", STEP2 = new Set(["meetJohnDoe", PROFILE]);
const stripDay = d => String(d.title || "").replace(/^Case Flow Day \d+ · /, "");
const mainLesson = d => { const id = mainId(d); return id ? d.lessons.find(l => l.cf.block.id === id) : null; };
const cut = (t, max) => { t = String(t || ""); const c = t.split(/:\s| — /)[0]; return t.length > max && c.length >= 12 ? c : t; };

/* ---------- the topics' numbers, in the loop's order ----------
   A topic's number (l.h "3.9 …", js/cm-case-flow.js) was its place in the sequence; the loop moves the Skill Building
   and the Backup File Maintenance ahead of the other activities, so every Case Flow topic is numbered once here, in the
   order the deck and the 🗺 Roadmap show it: the lessons, the Skill Building, the Backup File Maintenance, the side
   exercises in the sequence's order, the Learning Checks. The slide titles, NEXT UP, the slide picker, Presenter view's
   jump list, "Practises: N.M" and the Roadmap all read l.h, so they agree. The lessons' indices (d.lessons) and the
   saved places (block ids, js/cm-slide-keys.js) do not change; the number a topic had is kept (l.cf.h0) for what was
   stored under it (a published lesson expansion, lessonExpansion). */
function renumber(d){
  const mid = mainId(d), did = driveId(d), kind = l => l.cf.block.kind, id = l => l.cf.block.id;
  const cfL = d.lessons.filter(l => l && l.cf && l.cf.block);
  const acts = cfL.filter(l => kind(l) === "activity");
  const order = cfL.filter(l => kind(l) === "lesson").concat(acts.filter(l => id(l) === mid), acts.filter(l => did && id(l) === did),
    acts.filter(l => id(l) !== mid && id(l) !== did), cfL.filter(l => kind(l) !== "lesson" && kind(l) !== "activity"));
  order.forEach((l, k) => { const m = /^(\d+)\.\d+(\s)/.exec(String(l.h || "")); if(!m) return;
    if(l.cf.h0 == null) l.cf.h0 = l.h;
    l.h = `${m[1]}.${k + 1}${m[2]}${String(l.h).slice(m[0].length)}`; });
}
DAYS.filter(isCf).forEach(renumber);
if(typeof lessonExpansion === "function"){
  const __exp = lessonExpansion;
  const exp = function(d, l){ const r = __exp.apply(this, arguments); return r || !(l && l.cf && l.cf.h0 && l.cf.h0 !== l.h) ? r : __exp.call(this, d, Object.assign({}, l, {h: l.cf.h0})); };
  try{ lessonExpansion = exp; }catch(e){}
}

/* ---------- the deck, in the loop's order ---------- */
const before = buildDaySlides;   // as js/cm-case-flow.js, js/cm-case-profile.js and js/cm-deck-pages.js left it (layout 8's order)
buildDaySlides = function(d){
  const s = before.apply(this, arguments);
  if(!isCf(d)) return s;
  const mid = mainId(d), did = driveId(d), head = [], lessons = [], step2 = [], main = [], build = [], drive = [], labHead = [], sides = [], ready = [], tail = [];
  let started = false;
  s.forEach(sl => {
    if(sl.type === "topic"){
      started = true;
      const b = d.lessons[sl.lessonIndex].cf.block;
      if(b.kind === "lesson") return lessons.push(sl);
      if(b.id === mid) return main.push(sl);
      if(did && b.id === did) return drive.push(sl);
      return sides.push(Object.assign({}, sl, {side: true}));
    }
    if(sl.type === "deckPage"){ started = true; return lessons.push(sl); }
    if(STEP2.has(sl.type)) return step2.push(sl);
    if(sl.type === "companionBuild" || sl.type === "companionBuild2") return build.push(sl);
    if(sl.type === "practiceLab" || sl.type === "extraPractice") return labHead.push(sl);
    if(sl.type === "readyCheck") return ready.push(sl);
    if(sl.type === PLAN) return;
    (started ? tail : head).push(sl);
  });
  if(!main.length && !build.length) return s;   // a day without its Skill Building (not this course's data): as it was
  if(!step2.length) step2.push({type: PROFILE});
  const lab = sides.length ? (labHead.length ? labHead.slice(0, 1) : [{type: "practiceLab"}]).concat(sides) : [];
  return head.concat(lessons, step2, main, build, drive, [{type: PLAN}], lab, ready, tail);
};

/* ---------- a place saved before the loop (js/cm-slide-keys.js: window.CM_SLIDE_KEY_RULES) ----------
   Keys saved since the loop carry RULE in their marks (m) and are left as they are. A place saved before it (keys
   without RULE, or no keys at all: a position in layout 8's deck) whose slide, in the deck before the loop (before(d),
   cmDayLoop.layout8), was the Practice Lab's opening slide or a side exercise ahead of the day's Skill Building, lands on
   step 2 (Meet John Doe, or the Case Profile Check-In): the slide right before the Skill Building. For the place and
   the furthest slide reached alike: nothing past the Skill Building and the Action Plan is unlocked by it. */
const RULE = "dayLoop";
function placeRule(d, r, to, keys){
  if(!isCf(d) || (r && Array.isArray(r.m) && r.m.indexOf(RULE) >= 0) || !window.cmSlideKeys) return to;
  const mid = mainId(d), k = keys[to]; if(!mid || !k) return to;
  const id = x => String(x).replace(/#\d+$/, "").split(":")[0];
  const l = d.lessons.find(x => x.cf && x.cf.block.id === id(k)), side = !!(l && l.cf.block.kind === "activity" && l.cf.block.id !== mid);
  if(!(id(k) === "~practiceLab" || side)) return to;
  const seen = {}, old = before(d).map(sl => { const x = window.cmSlideKeys.keyOf(d, sl); seen[x] = (seen[x] || 0) + 1; return seen[x] > 1 ? x + "#" + seen[x] : x; });
  const o = old.indexOf(k), main8 = old.findIndex(x => id(x) === mid);
  if(!(o >= 0 && main8 >= 0 && o < main8)) return to;
  const s2 = keys.findIndex(x => STEP2.has(String(x).slice(1)));
  return s2 >= 0 && s2 < to ? s2 : to;
}
(window.CM_SLIDE_KEY_RULES = window.CM_SLIDE_KEY_RULES || []).push({id: RULE, place: placeRule});

/* the step of the loop a slide is in: 1 lessons, 2 the Case Profile, 3 the Skill Building, "drive" the required Backup
   File Maintenance, 4 the Action Plan, "side" the side exercises, 5 the Ready check and the Knowledge Check,
   0 the Training Agenda */
function stepOf(d, sl){
  if(!sl) return 0;
  if(sl.type === "topic"){ const b = d.lessons[sl.lessonIndex].cf.block; return b.kind === "lesson" ? 1 : b.id === mainId(d) ? 3 : b.id === driveId(d) ? "drive" : "side"; }
  if(sl.type === "deckPage") return 1;
  if(STEP2.has(sl.type)) return 2;
  if(sl.type === "companionBuild" || sl.type === "companionBuild2") return 3;
  if(sl.type === PLAN) return 4;
  if(sl.type === "practiceLab" || sl.type === "extraPractice") return "side";
  if(sl.type === "readyCheck" || sl.type === "closing") return 5;
  return 0;
}

/* ---------- the Training Agenda's Part 2 (js/cm-case-flow.js agendaSlide reads these) ----------
   One row for the loop's three steps (the agenda's grid keeps the three rows Part 2 had: label, the loop, the Knowledge
   Check, so the slide is not scaled down further), the label saying how many side exercises follow. Day 1's
   Intake (d1m1-open, opening John Doe's file in the CMS) IS the day's Skill Building: one practical, not two. */
const sideCount = d => d.lessons.filter(x => x.cf.block.kind === "activity" && x.cf.block.id !== mainId(d) && x.cf.block.id !== driveId(d)).length;
function mainName(d, sc){
  const l = mainLesson(d);
  if(sc && sc.build || d.cf.build) return "Build Your Companion Case";
  if(d.cf.n === 1) return "the Intake";
  return l && /^Skill Building: /.test(l.cf.heading || "") ? l.cf.heading.replace(/^Skill Building: /, "") : cut(l ? l.cf.block.title : "", 40);   // its section heading, short (the title is on its own slides)
}

function agendaRows(d, sc){
  const n = d.cf.n, sides = sideCount(d), side = sides ? `then ${sides} skill activit${sides === 1 ? "y" : "ies"}` : "";
  // (the Skill Building's own name only where the row has room for it: Day 1's Intake, Day 5's build; on Days 2–4 the
  // name made the row wrap and the whole agenda scale down, so it is on the Objectives page and the slides instead)
  const drv = !!driveId(d);   // 📁 Backup File Maintenance, required every day, between the Skill Building and the Action Plan
  const chain = n === 1 ? `👋 Meet John Doe → 🎯 Skill Building: the Intake${drv ? " → 📁 Backup Files" : ""} → 📝 Action Plan`
    : `📇 Case Profile → 🎯 Skill Building${sc && sc.build || d.cf.build ? ": Build Your Companion Case" : ""}${drv ? " → 📁 Backup Files" : ""} → 📝 ${n === 5 ? "Close Out " : ""}Action Plan`;
  return {label: "Part 2 · 🔁 The Daily Loop", side, sides, main: mainName(d, sc), drive: drv,
    sub: `${n === 1 ? "Meet John Doe" : "Case Profile"} → Skill Building${drv ? " → Backup File Maintenance (required)" : ""} → Action Plan${side ? ", " + side : ""}`,   // js/cm-flow-parts.js labels
    rows: [chain],
    // the loop's steps one by one (the day's Objectives page, the Speaker Notes)
    steps: [n === 1 ? "👋 Meet John Doe (his Case Profile)" : "📇 Case Profile Check-In",
      `🎯 Skill Building: ${n === 1 ? "the Intake, Opening John Doe's File in the CMS" : mainName(d, sc)}`]
      .concat(drv ? ["📁 Backup File Maintenance (required)"] : [], [n === 5 ? "📝 Close Out Your Action Plan" : "📝 Update Your Action Plan"])};
}

/* ---------- the slides ---------- */
const frame = (d, kicker, icon, title, ribbon, body, cls) => `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; ${kicker}</div>
    <div class="card lesson-card cf-card cfx cfx-deck cpx-slide dl-slide ${cls || ""}">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">${icon} ${E(title)}</h2></div>
      <div class="cfx-ribbon"><span>${E(ribbon)}</span></div>
      <div class="cfx-body"><div class="cfx-sheet">${body}</div></div>
    </div>`;
// Days 2–5: the file as it stands today, on the Case Profile
function profileSlide(d){
  const c = CF.case, src = CF.days.find(x => x.n === d.cf.n) || {}, l = mainLesson(d);
  // where the file stands as the day opens: each line whole (cut short, a line dropped the open lien or the track's dates)
  const items = (src.fileState || []).slice(0, 3).map(x => String(x).replace(/\.$/, ""));
  return frame(d, "STEP 2 &middot; CASE PROFILE CHECK-IN", "📇", "Case Profile Check-In", "Lessons done · Step 2: what changed on the file since yesterday", `
    <p class="cpx-s-lead">Before today's Skill Building${l ? `, <b>${E(cut(l.cf.block.title, 60))}</b>` : ""}, open <b>${E(c.client.name)}</b>'s Case Profile and check where <b>${E(c.style)}</b> stands today.</p>
    <ul class="cpx-s-list dl-state">${items.map(x => `<li><span aria-hidden="true">📌</span>${E(x)}</li>`).join("")}</ul>
    <div class="cpx-s-go"><button type="button" class="btn btn-primary cpx-s-btn" onclick="cmDayLoop.profile()">📇 Open the Case Profile: The Case So Far</button>
      <span>Then “← Back to Case Flow Day ${d.cf.n}” brings you back here.</span></div>`, "dl-profile");
}
/* Update Your Action Plan: Day 1 step by step (the template's sections, in order), then less each day */
const PLAN_STEPS = {
  1: ["Press <b>📝 Open my Action Plan</b> below: it opens with the template (or <b>📝 Use the template</b>).",
    "<b>Situation:</b> the Intake facts (date of loss, his position, the SOL), each with its document.",
    "<b>Goal and deadline:</b> what must be true, and by when.",
    "<b>Action items:</b> each with a task, an owner, a due date and a tool.",
    "<b>Risks, UPL check, who is told:</b> facts only; Atty. Thorne's decisions routed to him.",
    "<b>Follow-up:</b> the date you check again. Then come back here."],
  2: ["Add what today's Skill Building changed on the file: every claim opened, with its carrier and claim number.",
    "Add the next action items, each with an owner and a date.",
    "Add any new risk for Atty. Thorne, as facts."],
  3: ["Record where the demand and the negotiation stand, and the next deadline.", "Update the action items and the risks."],
  4: ["Record the binder's exchange date and what Atty. Thorne still has to decide.", "Update the action items and the risks."],
  5: ["Close it out: the litigation handoff, what is still open, and the sign-off Atty. Thorne gives."]
};
function planNote(){
  const p = (state.notes || []).find(n => /action plan/i.test(n.title || ""));
  if(!p || !p.updatedAt || trainer()) return "";
  const t = new Date(p.updatedAt); if(isNaN(t)) return "";
  return `<span class="dl-plan-at">✓ Last updated ${E(t.toLocaleString("en-US", {month: "2-digit", day: "2-digit", hour: "numeric", minute: "2-digit"}))}</span>`;
}
function planSlide(d){
  const n = d.cf.n, steps = PLAN_STEPS[n] || PLAN_STEPS[3], l = mainLesson(d), done = d.cf.build ? "your companion case" : l ? cut(l.cf.block.title, 60) : "today's Skill Building";
  const lead = n === 1 ? `You've done John Doe's Intake. Now write his <b>Action Plan</b>, the template's sections in order.`
    : n === 5 ? `You've built <b>${E(done)}</b>. Close out John Doe's <b>Action Plan</b> before the Knowledge Check.`
    : `You've finished <b>${E(done)}</b>. Update your <b>Action Plan</b> with what changed.`;
  return frame(d, "STEP 4 &middot; UPDATE YOUR ACTION PLAN", "📝", n === 5 ? "Close Out Your Action Plan" : "Update Your Action Plan",
    n === 1 ? "Step 4 · step by step, the template's sections in order" : `Step 4 · ${steps.length === 1 ? "one line" : steps.length + " quick updates"}, in your own words`, `
    <p class="cpx-s-lead">${lead}</p>
    <${n === 1 ? "ol" : "ul"} class="dl-plan${n === 1 ? " dl-plan-guided" : ""}">${steps.map((s, i) => `<li>${n === 1 ? `<span class="dl-n">${i + 1}</span>` : ""}<span>${s}</span></li>`).join("")}</${n === 1 ? "ol" : "ul"}>
    <div class="cpx-s-go"><button type="button" class="btn btn-primary cpx-s-btn" onclick="cmDayLoop.plan(${d.id})">📝 Open my Action Plan</button>${planNote()}
      <span>Then “← Back to Case Flow Day ${n}” brings you back here.</span></div>`, "dl-plan-slide");
}
/* the side exercises: one short Practice Lab, every one of them counts; ⏭ on to the Ready check */
function sideLab(d){
  const mid = mainId(d), sc = (() => { try{ return window.cmCaseFlow.schedule ? window.cmCaseFlow.schedule(d) : null; }catch(e){ return null; } })();
  const acts = d.lessons.map((l, li) => [l, li]).filter(([l]) => l.cf.block.kind === "activity" && l.cf.block.id !== mid && l.cf.block.id !== driveId(d));
  const mins = sc && sc.side ? `about ${sc.side} minutes` : "short";
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; SKILL ACTIVITIES &middot; PRACTICE LAB</div>
    <div class="card lesson-card cf-card cfx cfx-deck cfx-lab dl-side">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">🧪 Practice Lab: Skill Activities</h2></div>
      <div class="cfx-ribbon"><span>${acts.length} Skill Activit${acts.length === 1 ? "y" : "ies"} · ${mins} · every one counts</span></div>
      <div class="cfx-body"><div class="cfx-sheet">
        <p class="dl-side-lead">Each one starts from an assumption (“Assuming …”): log one entry in the CMS. Work all ${acts.length}, in order.</p>
        <ol class="cfx-lab-list cfx-lab-of">${acts.map(([l, li], k) => { const b = l.cf.block, of = l.cf.of, ref = of ? `Practises: ${of.h.split(" ")[0]} ${cut(of.cf.block.title, 40)}` : "";
          return `<li><button type="button" onclick="cmCaseFlow.labGo(${d.id},${li})" title="${E(b.title)}: go to this side exercise"><span class="n">${k + 1}</span><span class="tt"><span class="t">${E(cut(b.title, 54))}</span>${ref ? `<span class="of">${E(ref)}</span>` : ""}</span></button></li>`; }).join("")}</ol>
        <div class="cfx-ex-go dl-side-go"><button type="button" class="btn btn-primary" onclick="cmCaseFlow.toReady(${d.id})">⏭ On to 🎯 Ready for the Knowledge Check?</button></div>
      </div></div>
    </div>`;
}

/* ---------- where the buttons go ---------- */
const backTo = d => { state.cfReturn = {dayId: d.id, n: d.cf.n, slide: typeof state.lessonSlide === "number" ? state.lessonSlide : null, view: "day"}; };
window.cmDayLoop = {
  layout8: d => before(d),   // the deck before the loop's order (layout 8's: placeRule, .github/scripts/slide-places.cjs)
  stepOf, mainId, driveId, isSide, agendaRows,
  profile(){ const d = DAYS.find(x => x.id === state.dayId && isCf(x)); if(d && state.view === "day") backTo(d);
    state.cfFileTab = "now"; if(typeof goto === "function") goto("clientprofile"); window.scrollTo(0, 0); },
  plan(dayId){ const d = DAYS.find(x => x.id === dayId && isCf(x)); if(!d) return;
    window.cmCaseFlow.tool("plan", d.cf.build ? "" : mainId(d)); }
};

/* ---------- the engine's hooks ---------- */
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    if(slide && isCf(d)){
      if(slide.type === PROFILE) return profileSlide(d);
      if(slide.type === PLAN) return planSlide(d);
      if(slide.type === "practiceLab" && mainId(d)) return sideLab(d);
    }
    return __content.apply(this, arguments);
  };
}
if(typeof daySlideTitle === "function"){
  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){
    if(slide && isCf(d)){
      if(slide.type === PROFILE) return "Case Profile Check-In";
      if(slide.type === PLAN) return d.cf.n === 5 ? "Close Out Your Action Plan" : "Update Your Action Plan";
      if(slide.type === "practiceLab" && mainId(d)) return "Practice Lab: Skill Activities";
    }
    return __title.apply(this, arguments);
  };
}
// the top line of an activity's slides says which it is: the day's Skill Building, or a side exercise
if(typeof window.renderLessonCard === "function"){
  const __card = window.renderLessonCard;
  window.renderLessonCard = function(l, i, d){
    const html = __card.apply(this, arguments);
    const b = l && l.cf && l.cf.block; if(!b || b.kind !== "activity" || !isCf(d)) return html;
    const role = b.id === mainId(d) ? "main" : b.id === driveId(d) ? "drive" : "side";
    const tag = {main: "STEP 3 &middot; THE DAY'S SKILL BUILDING", drive: "REQUIRED &middot; BACKUP FILE MAINTENANCE", side: "SKILL ACTIVITY"}[role];
    return String(html).replace(/(<div class="topic-separator cfx-sepline">[^<]*)(<\/div>)/, `$1 &middot; ${tag}$2`)
      .replace(/(class="card lesson-card cf-card cfx )/, `$1${{main: "dl-main ", drive: "dl-main dl-drive ", side: "dl-side-ex "}[role]}`)
      // the band's label: "Practice Lab" now names only the side exercises' block after the Action Plan
      .replace(/(<i class="cfx-what-k">)Practice Lab(<\/i>)/, `$1${{main: "Skill Building", drive: "Required: Backup File Maintenance", side: "Skill Activity"}[role]}$2`)
      // the materials of a voicemail are transcribed: the slide says so (not "Your Case")
      .replace(/(<b class="cfx-what-v">)Your Case(<\/b>)/, `$1${vmOf(b.id) ? "Transcription Exercise" : "Your Case"}$2`)
      // 🧠 a critical-thinking banner opens the materials, tied to the lesson it practises and its plain-English terms
      .replace(/(<div class="cfx-sb(?: [^"]*)?">)/, m => m + thinkBanner(l, b));
  };
}
const vmOf = id => { const ev = ((window.CM_CF_SIM || {}).events || {})[id]; return !!(ev && ev.channel === "voicemail"); };
// the first real sentence of a text: not a date or a "File date …" line, at least a few words
const firstS = t => (String(t || "").replace(/\*\*/g, "").match(/[^.!?]*[.!?](?=\s|$)/g) || []).map(x => x.trim()).find(x => x.split(/\s+/).length >= 6 && !/^(File date\b|\d{2}\/\d{2}\/\d{4})/.test(x)) || "";
function thinkBanner(l, b){
  const sl = (window.CM_CF_SLIDES || {})[b.id] || {}, of = l && l.cf && l.cf.of;
  const plainOf = id => window.cmCaseFlow && typeof cmCaseFlow.plainOf === "function" ? cmCaseFlow.plainOf(id) : [];
  const seen = new Set(), terms = plainOf(b.id).concat(of ? plainOf(of.cf.block.id) : []).filter(x => !seen.has(x.t) && seen.add(x.t)).slice(0, 4);
  const what = firstS(sl.situation) || firstS((b.act || {}).scenario);
  const ask = vmOf(b.id) ? "Transcribe it word for word, then decide what it changes, what you log, and what is Atty. Thorne's call."
    : "Before you open the CMS, decide: what does the file need from you, in what order, and what is Atty. Thorne's call?";
  // one compact block (the materials under it must still fit one laptop screen at full size): the question, then the
  // lesson and its terms on the same lines
  // a voicemail's materials are tall (the player, the transcript): its banner is the question alone, its terms one chip
  const vm = vmOf(b.id);
  const chips = !terms.length ? "" : vm || terms.length > 2
    ? ` <details class="dl-think-t"><summary>📖 Terms (${terms.length})</summary><span>${terms.map(x => `<b>${E(x.t)}</b>: ${E(x.d)}`).join("<br>")}</span></details>`
    : terms.map(x => ` <details class="dl-think-t"><summary>📖 ${E(x.t)}</summary><span>${E(x.d)}</span></details>`).join("");
  return `<div class="dl-think" role="note"><b class="dl-think-h">🧠 Think it through:</b> ${what && !vm ? E(what) + " " : ""}${E(ask)}`
    + (of && !vm ? ` <span class="dl-think-of">Use <b>${E(String(of.h || "").split(" ")[0])} ${E(of.cf.block.title)}</b></span>` : "")
    + chips + `</div>`;
}
// Presenter view: what to say on the loop's own slides (build/case-flow/scripts/days.json "profile", "plan", "lab")
const said = (n, k) => (((window.CM_CF_SCRIPTS || {})._days || {})[n] || {})[k];
const paras = t => String(t || "").split(/\s*\n\s*/).filter(Boolean).map(p => `<p class="script-say${/^•\s/.test(p) ? " script-pt" : ""}">${E(p)}</p>`).join("");
const cue = (title, x, note) => `<h3>${E(title)}</h3>${x ? `<div class="pn"><div class="script-block"><div class="script-head"><span>🗒 Talking points</span></div>${paras(x.say)}${x.ask ? `<p class="script-say script-ask">${E(x.ask)}</p>` : ""}</div></div>` : ""}<div class="pn-on pn-cue"><b>Trainer note — not read aloud</b><p>${note}</p></div>`;
if(typeof presenterCues === "function"){
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    if(!(slide && isCf(d))) return __cues.apply(this, arguments);
    const n = d.cf.n;
    if(slide.type === PROFILE) return cue("Case Profile Check-In", said(n, "profile"), "Step 2 of the daily loop. Open 📇 Case Profile → 📅 The Case So Far on the shared screen for a minute or two: what changed on John Doe's file since yesterday. Then straight into today's Skill Building.");
    if(slide.type === PLAN) return cue(n === 5 ? "Close Out Your Action Plan" : "Update Your Action Plan", said(n, "plan"), n === 1
      ? "Step 4, guided: walk the room through the template section by section on the shared screen (📝 Open my Action Plan), about 15 minutes. Every fact has its document; anything only Atty. Thorne decides is routed."
      : "Step 4, lighter each day: about 10 minutes, the trainees update the plan on their own. Spot-check two plans: every action item has an owner and a date.");
    if(slide.type === "practiceLab" && mainId(d)) { const sc = (() => { try{ return window.cmCaseFlow.schedule(d); }catch(e){ return null; } })();
      return cue("Practice Lab: Skill Activities", said(n, "lab"), `Short, and every one counts: each skill activity is an assumption and an entry to log in the CMS, a few minutes each. Trainees work all ${sc ? sc.sides : "of them"} in order and finish any left from their Practice page. Give the room the time that is left before the Knowledge Check, then ⏭ on the slide goes to the Ready check.`); }
    return __cues.apply(this, arguments);
  };
}

/* ---------- the look ---------- */
if(!document.getElementById("dl-css")){
  const st = document.createElement("style"); st.id = "dl-css";
  st.textContent = `
.dl-slide .cpx-s-lead{margin:0 0 10px;}
.dl-state li{font-weight:700;}
.dl-plan{margin:0 0 8px;padding:0;list-style:none;display:flex;flex-direction:column;gap:5px;}
.dl-plan li{display:flex;gap:10px;align-items:center;text-align:left;font:700 16px/1.3 var(--font-ui,'Inter',sans-serif);color:#1E2340;background:#F6F7FB;border:1px solid #D7DCE7;border-left:5px solid #DB8437;border-radius:10px;padding:4px 12px;}
.dl-plan li::before{display:none !important;content:none !important;}
.dl-plan .dl-n{flex:none;display:inline-grid;place-items:center;width:26px;height:26px;border-radius:50%;background:#1E2340;color:#fff;font:800 16px/1 var(--font-ui,'Inter',sans-serif);}
.dl-plan-at{font:700 16px/1.3 var(--font-ui,'Inter',sans-serif);color:#1F7A4D;}
.dl-think{margin:0 0 6px;padding:6px 12px;border-radius:10px;background:#FFF6EA;border:2px solid #DB8437;color:#1E2340;font:700 16px/1.35 var(--font-ui,'Inter',sans-serif);}
.dl-think-h{font-weight:900;color:#A4470F;} .dl-think-of{white-space:nowrap;}
.dl-think-t{display:inline-block;position:relative;} .dl-think-t summary{cursor:pointer;list-style:none;padding:1px 8px;border-radius:7px;background:#1E2340;color:#fff;font-weight:800;}
.dl-think-t summary::-webkit-details-marker{display:none;}
.dl-think-t[open] span{position:absolute;z-index:5;left:0;top:calc(100% + 4px);width:min(420px,70vw);padding:8px 10px;border-radius:8px;background:#fff;border:2px solid #1E2340;box-shadow:0 6px 18px rgba(30,35,64,.2);font-weight:700;}
.dl-side-lead{margin:0 0 10px;font:700 17px/1.4 var(--font-ui,'Inter',sans-serif);color:#2B3147;}
.dl-side-go{margin-top:6px !important;}
`;
  document.head.appendChild(st);
}
})();
