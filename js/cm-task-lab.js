/* 🧪 EVERY TASK IN THE PRACTICE LAB (every Case Flow day), as the EA/PA course sets its labs up
   The deck no longer carries a Skill Activity's instructions. Each activity keeps ONE slide in the deck, a short card:
   its name, where it sits in the day (Skill Building, Backup File Maintenance or Skill Activity k of N), the scenario in
   a line, the day's activities with ✓ for the ones done, and ▶ Start in the Practice Lab. ▶ Start opens the 🧪 Practice
   page on that activity: its full Your Task (📂 Your Case, the steps, the tools, Submit for grading and the AI Grader),
   and its second page where it has one (the Skill Building's document audit, Day 1's Backup Drive set-up), with the
   day's other activities beside it and ← Back to the slide you came from.
   · the deck: an activity's second slide (the audit, the Your Case) leaves the deck; its work is on the lab page. Saved
     places need nothing (js/cm-slide-keys.js: a place on a slide that is gone lands on the one before it, the card).
   · the page: the 🧪 Practice view with state.taskLab {dayId, li}; the 🧪 Practice button in the top bar (or any other
     page) leaves it. Everything on it is the slide's own code (renderDaySlideContent), drawn as on the deck.
   Wraps buildDaySlides, renderDaySlideContent, renderPracticeHub and goto. */
(function(){
"use strict";
if(typeof window === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function" || typeof renderDaySlideContent !== "function") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const cfDay = d => !!(d && d.cf && Array.isArray(d.lessons));
const blockOf = (d, li) => { const l = d && d.lessons[li]; return l && l.cf && l.cf.block; };
const isAct = (d, sl) => cfDay(d) && sl && sl.type === "topic" && (blockOf(d, sl.lessonIndex) || {}).kind === "activity";
const loop = () => window.cmDayLoop || {};
const words = (t, n) => { const w = String(t || "").replace(/\*\*/g, "").replace(/\s+/g, " ").trim().split(" "); return w.length <= n ? w.join(" ") : w.slice(0, n).join(" ").replace(/[,;:]$/, "") + "…"; };
const title = l => String(l.h || "").trim() || (l.cf && l.cf.block.title) || "";
const viewsOf = b => (window.cmCaseFlow && typeof cmCaseFlow.viewsOf === "function" ? cmCaseFlow.viewsOf(b) : ["task"]) || ["task"];
let FULL = false;   // drawing the lab page: the activity's own slides, in full

/* ---------- the deck: one slide per activity ---------- */
const __build = buildDaySlides;
buildDaySlides = window.buildDaySlides = function(d){
  const s = __build.apply(this, arguments);
  if(!cfDay(d)) return s;
  return s.filter(sl => !(isAct(d, sl) && sl.part > 1));
};

/* the day's activities, in the deck's order: [lessonIndex, its deck slide] */
function actsOf(d){
  const deck = buildDaySlides(d), out = [];
  deck.forEach((sl, k) => { if(isAct(d, sl) && !out.some(x => x[0] === sl.lessonIndex)) out.push([sl.lessonIndex, k]); });
  return out;
}
/* done: graded (its answers revealed), submitted or its work logged */
function doneOf(id){
  const r = (window.cmCaseFlow && typeof cmCaseFlow.record === "function" && cmCaseFlow.record()) || {};
  if((r.revealed || {})[id]) return "graded";
  if((r.work || {})[id] || (r.listen || {})[id]) return "worked";
  return "";
}
function roleOf(d, li){
  const id = (blockOf(d, li) || {}).id, L = loop();
  if(L.mainId && L.mainId(d) === id) return "🎯 Skill Building";
  if(L.driveId && L.driveId(d) === id) return "📁 Backup File Maintenance · required";
  return "";
}
function cardHtml(d, sl, idx){
  const li = sl.lessonIndex, l = d.lessons[li], b = l.cf.block, acts = actsOf(d), k = acts.findIndex(x => x[0] === li);
  const role = roleOf(d, li) || `🧪 Skill Activity ${k + 1} of ${acts.length}`, st = doneOf(b.id);
  const list = acts.map(([j], n) => { const bb = blockOf(d, j), s = doneOf(bb.id);
    return `<li class="${j === li ? "on" : ""}${s ? " done" : ""}"><span>${s ? "✓" : n + 1}</span>${E(words(String(title(d.lessons[j])).replace(/^\d+\.\d+\s+/, ""), 9))}</li>`; }).join("");
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; PRACTICE LAB &middot; ACTIVITY ${k + 1} OF ${acts.length}</div>
    <div class="card lesson-card cf-card cfx cfx-deck ctl-card" data-ctl="${E(b.id)}">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">${E(title(l))}</h2></div>
      <div class="cfx-ribbon"><span>${E(role)} · your task is in the 🧪 Practice Lab</span></div>
      <div class="cfx-body"><div class="cfx-sheet ctl-sheet">
        <div class="ctl-main">
          ${b.act && b.act.scenario ? `<p class="ctl-scn"><b>📂 The case:</b> ${E(words(b.act.scenario, 34))}</p>` : ""}
          <p class="ctl-st ${st ? "ok" : ""}">${st === "graded" ? "✓ Done and graded: open it to see your grade and the answers." : st ? "✓ Started: your work is saved. Open it to carry on or submit." : "Not started yet."}</p>
          <button type="button" class="btn ctl-go" onclick="cmTaskLab.open(${d.id},${li})">▶ ${st ? "Open" : "Start"} in the Practice Lab</button>
        </div>
        <ol class="ctl-list" aria-label="Today's activities">${list}</ol>
      </div></div>
    </div>`;
}
const __content = renderDaySlideContent;
renderDaySlideContent = window.renderDaySlideContent = function(d, sl){
  if(!FULL && isAct(d, sl)) return cardHtml(d, sl, arguments[2]);
  return __content.apply(this, arguments);
};

/* ---------- the 🧪 Practice page on one activity ---------- */
function open(dayId, li){
  const d = DAYS.find(x => x.id === dayId); if(!cfDay(d)) return;
  const at = actsOf(d).find(x => x[0] === li); if(!at) return;
  if(state.presenting && typeof presenterEnd === "function") presenterEnd(true);
  if(document.fullscreenElement && document.exitFullscreen) try{ document.exitFullscreen(); }catch(e){}
  state.taskLab = {dayId, li};
  state.dayId = dayId; state.lessonSlide = at[1];   // the slide it is opened from: what the slide's own code reads
  OPENING = true; try{ goto("practice"); } finally { OPENING = false; }
}
function back(){
  const t = state.taskLab; if(!t) return goto("practice");
  const d = DAYS.find(x => x.id === t.dayId), at = d && actsOf(d).find(x => x[0] === t.li);
  state.taskLab = null; goto("day", t.dayId);
  if(at) setTimeout(() => { state.dayViewMode = "slides"; if(typeof goToSlide === "function") goToSlide(at[1]); }, 0);
}
function pageHtml(){
  const t = state.taskLab, d = t && DAYS.find(x => x.id === t.dayId);
  if(!cfDay(d) || !blockOf(d, t.li)) { state.taskLab = null; return null; }
  const l = d.lessons[t.li], b = l.cf.block, acts = actsOf(d), k = acts.findIndex(x => x[0] === t.li);
  state.dayId = d.id; state.lessonSlide = acts[k][1];
  let body = "";
  FULL = true;
  try{ body = viewsOf(b).map((v, j) => `<div class="cf-stage-card ctl-stage"><div class="lesson-slide still" id="${j ? "ctlSlide" + j : "lessonSlideWrap"}">${renderDaySlideContent(d, {type: "topic", lessonIndex: t.li, part: j + 1}, acts[k][1])}</div></div>`).join(""); }
  finally { FULL = false; }
  const side = acts.map(([j], n) => { const bb = blockOf(d, j), s = doneOf(bb.id);
    return `<li><button type="button" class="${j === t.li ? "on" : ""}${s ? " done" : ""}" onclick="cmTaskLab.open(${d.id},${j})"><span>${s ? "✓" : n + 1}</span>${E(String(title(d.lessons[j])))}</button></li>`; }).join("");
  return `<div class="ctl-page">
    <div class="ctl-top"><button type="button" class="btn ctl-back" onclick="cmTaskLab.back()">← Back to Day ${d.cf.n}</button>
      <div class="ctl-h"><small>🧪 Practice Lab · Day ${d.cf.n} · Activity ${k + 1} of ${acts.length}${roleOf(d, t.li) ? " · " + E(roleOf(d, t.li)) : ""}</small><b>${E(title(l))}</b></div></div>
    <div class="ctl-grid"><nav class="ctl-side" aria-label="Day ${d.cf.n}'s activities"><p>Day ${d.cf.n}'s activities</p><ol>${side}</ol></nav>
      <div class="ctl-work">${body}</div></div>
  </div>`;
}
if(typeof window.renderPracticeHub === "function"){
  const __hub = window.renderPracticeHub;
  window.renderPracticeHub = function(){
    if(state.taskLab){ const h = pageHtml(); if(h != null) return h; }
    return __hub.apply(this, arguments);
  };
}
/* any other page (the top bar's 🧪 Practice included) leaves the activity */
let OPENING = false;
if(typeof window.goto === "function"){
  const __goto = window.goto;
  window.goto = function(view){ if(!OPENING) state.taskLab = null; return __goto.apply(this, arguments); };
  try{ goto = window.goto; }catch(e){}
}
/* a page a step opens from the lab (the Action Plan Editor, the Case Profile …): its ← Back comes back to the lab */
let FROM = null;
if(window.cmCaseFlow && typeof cmCaseFlow.tool === "function" && typeof cmCaseFlow.back === "function"){
  const __tool = cmCaseFlow.tool, __back = cmCaseFlow.back;
  cmCaseFlow.tool = function(){ FROM = state.taskLab ? Object.assign({}, state.taskLab) : null; return __tool.apply(this, arguments); };
  cmCaseFlow.back = function(){ if(FROM && !state.taskLab){ const f = FROM; FROM = null; state.cfReturn = null; return open(f.dayId, f.li); } FROM = null; return __back.apply(this, arguments); };
}
window.cmTaskLab = {open, back, start: () => { const d = DAYS.find(x => x.id === state.dayId), sl = d && buildDaySlides(d)[state.lessonSlide || 0]; if(isAct(d, sl)) open(d.id, sl.lessonIndex); }, card: cardHtml, acts: actsOf};

const st = document.createElement("style"); st.id = "cm-task-lab"; st.textContent = `
/* the deck's card */
.ctl-card .ctl-sheet{text-align:left !important;display:grid !important;grid-template-columns:minmax(0,1.25fr) minmax(0,1fr);gap:22px;align-items:center;}
.ctl-card .ctl-main{display:flex !important;flex-direction:column !important;gap:16px !important;align-items:flex-start !important;justify-content:center !important;align-self:center !important;margin:0 !important;}
.ctl-card .ctl-main > *{margin:0 !important;align-self:flex-start !important;text-align:left !important;}
.ctl-card .ctl-scn{margin:0;font:700 19px/1.5 'Inter',sans-serif;color:#1E2340;}
.ctl-card .ctl-st{margin:0;padding:8px 14px;border-radius:10px;background:#EEF0F6;font:800 17px/1.35 'Inter',sans-serif;color:#4A5170;}
.ctl-card .ctl-st.ok{background:#E7F6EC;color:#166534;}
.ctl-card .ctl-go{font:800 20px/1 'Poppins','Inter',sans-serif !important;padding:16px 26px !important;border-radius:14px !important;border:0 !important;background:linear-gradient(180deg,#2B3266 0%,#1E2340 100%) !important;color:#fff !important;box-shadow:0 10px 22px -12px rgba(30,35,64,.8) !important;cursor:pointer;}
.ctl-card .ctl-go:hover{filter:brightness(1.12);}
.ctl-card .ctl-list{list-style:none;margin:0;padding:12px;border:1px solid #E3E6EF;border-radius:14px;background:#F8F9FC;display:flex;flex-direction:column;gap:5px;}
.ctl-card .ctl-list li::before{content:none !important;display:none !important;}
.ctl-card .ctl-list li{text-align:left !important;justify-content:flex-start !important;align-items:center !important;display:flex;gap:10px;align-items:flex-start;font:700 16px/1.35 'Inter',sans-serif;color:#4A5170;padding:4px 6px;border-radius:8px;}
.ctl-card .ctl-list li span{flex:0 0 26px;height:26px;border-radius:50%;background:#E3E6EF;color:#1E2340;display:grid;place-items:center;font:800 16px/1 'Inter',sans-serif;}
.ctl-card .ctl-list li.on{background:#1E2340;color:#fff;} .ctl-card .ctl-list li.on span{background:#C9A27A;color:#1E2340;}
.ctl-card .ctl-list li.done span{background:#16A34A;color:#fff;}
@media (max-width:900px){ .ctl-card .ctl-sheet{grid-template-columns:1fr;} }
/* the Practice Lab page */
.ctl-page{max-width:1400px;margin:0 auto;padding:18px 16px 40px;}
.ctl-top{display:flex;align-items:center;gap:16px;flex-wrap:wrap;margin-bottom:14px;padding:14px 18px;border-radius:18px;background:linear-gradient(135deg,#1E2340 0%,#2B3266 100%);box-shadow:0 14px 30px -18px rgba(20,24,48,.7);}
body:has(.ctl-page) #cf-return, body:has(.ctl-page) .nav-back-row{display:none !important;}
.ctl-back{font:800 16px/1 'Inter',sans-serif !important;padding:12px 18px !important;border-radius:999px !important;background:#fff !important;color:#1E2340 !important;border:0 !important;}
.ctl-h{display:flex;flex-direction:column;gap:2px;min-width:0;}
.ctl-h small{font:800 14px/1.3 'Inter',sans-serif;color:#C9A27A;letter-spacing:.02em;text-transform:uppercase;}
.ctl-h b{font:900 24px/1.25 'Poppins','Inter',sans-serif;color:#fff;}
.ctl-grid{display:grid;grid-template-columns:280px minmax(0,1fr);gap:16px;align-items:start;}
.ctl-side{position:sticky;top:12px;background:#fff;border-radius:16px;padding:12px;box-shadow:0 12px 30px -20px rgba(20,24,48,.6);}
.ctl-side p{margin:0 0 8px;font:900 15px/1.3 'Inter',sans-serif;color:#1E2340;text-transform:uppercase;letter-spacing:.03em;}
.ctl-side ol{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:4px;}
.ctl-side button{display:flex;gap:8px;width:100%;text-align:left;border:0;background:transparent;border-radius:10px;padding:8px;font:700 15px/1.35 'Inter',sans-serif;color:#2B3147;cursor:pointer;}
.ctl-side button:hover{background:#EEF0F6;}
.ctl-side button span{flex:0 0 24px;height:24px;border-radius:50%;background:#E3E6EF;display:grid;place-items:center;font:800 13px/1 'Inter',sans-serif;color:#1E2340;}
.ctl-side button.on{background:#1E2340;color:#fff;} .ctl-side button.on span{background:#C9A27A;}
.ctl-side button.done span{background:#16A34A;color:#fff;}
.ctl-work{display:flex;flex-direction:column;gap:16px;min-width:0;}
.ctl-work .ctl-stage .lesson-slide{animation:none !important;}
@media (max-width:900px){ .ctl-grid{grid-template-columns:1fr;} .ctl-side{position:static;} }
`;
document.head.appendChild(st);
})();
