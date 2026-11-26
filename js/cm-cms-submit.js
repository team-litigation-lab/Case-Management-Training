/* 📤 SUBMIT FOR GRADING, IN CASEWORX: ONLY WHEN IT WAS OPENED FROM A CM TRAINING ACTIVITY (every Skill Activity)
   A Skill Activity's Your Task ended in Submit →, which turned the slide into its 🤖 AI Grader. The owner: Submit belongs
   in the activity itself, not on the deck. The work is done in LSH CaseWorX, which 🚀 Launch opens in the course's tool
   window beside the slide (js/cm-skillbuilders.js openTool: #cm-toolframe, a frame of the CMS). So:
   · the slide shows no Submit (the bar keeps 🚀 Launch; a voicemail activity keeps 🎧 Take it down: Listening Check);
   · the tool window's own bar, over CaseWorX, shows 📤 Submit for grading while it holds the CaseWorX that an activity's
     🚀 Launch opened. It hands that activity's work in: the slide beside it turns into the activity's 🤖 AI Grader
     (cmCaseFlow.mode(id, "check"), as Submit → did), and the window goes side by side so both are on screen;
   · CaseWorX itself is not changed: many modules open it, and outside a CM Training activity (another tool, CaseWorX
     opened from the 🧰 Tools menu, or another course) there is no Submit;
   · a voicemail activity (js/cm-vm-transcribe.js) hands in once its Listening Check is checked, as before.
   Wraps window.renderLessonCard (after js/cm-vm-transcribe.js), cmCaseFlow.tool and window.openTool. */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || !window.cmCaseFlow) return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const say = m => { if(typeof toast === "function") toast(m); };
let forBlock = null, viaActivity = false;

/* the slide: no Submit */
if(typeof window.renderLessonCard === "function"){
  const __card = window.renderLessonCard;
  window.renderLessonCard = function(l){
    const html = __card.apply(this, arguments);
    const b = l && l.cf && l.cf.block; if(!b || b.kind !== "activity" || String(html).indexOf("cfx-task-foot") < 0) return html;
    const t = document.createElement("template"); t.innerHTML = String(html);
    t.content.querySelectorAll(".cfx-task-foot .cfx-grade-go, .cfx-task-foot .vmt-go[onclick*=\"'check'\"]").forEach(n => n.remove());
    return t.innerHTML;
  };
}

/* which activity opened CaseWorX */
const __tool = cmCaseFlow.tool;
cmCaseFlow.tool = function(id, blockId){
  if(id === "cms") forBlock = blockId && isActivity(blockId) ? blockId : null;
  viaActivity = true;
  try{ return __tool.apply(this, arguments); } finally { viaActivity = false; }
};
function isActivity(id){ const w = where(id); return !!(w && w.l.cf.block.kind === "activity"); }
function where(id){
  for(const d of (typeof DAYS !== "undefined" && Array.isArray(DAYS) ? DAYS : [])){ if(!d || !d.cf || !d.lessons) continue; const i = d.lessons.findIndex(l => l.cf && l.cf.block && l.cf.block.id === id); if(i >= 0) return {d, i, l: d.lessons[i]}; }
  return null;
}
if(typeof window.openTool === "function"){
  const __open = window.openTool;
  window.openTool = function(id, mode){
    if(!viaActivity && (id === "cms" || !id) && mode !== "tab") forBlock = null;   // CaseWorX from the 🧰 Tools menu: no activity, no Submit
    const r = __open.apply(this, arguments);
    paint();
    return r;
  };
}
function paint(){
  const bar = document.querySelector("#cm-toolframe .cm-tf-bar"); if(!bar) return;
  let btn = bar.querySelector(".cm-tf-submit");
  const name = (bar.querySelector(".cm-tf-name") || {}).textContent || "";
  const w = forBlock && where(forBlock), on = !!(w && /CaseWorX|CMS/i.test(name));   // the window holds CaseWorX, opened by this activity
  if(!on){ if(btn) btn.remove(); return; }
  const title = E(w.l.cf.block.title);
  if(!btn){
    btn = document.createElement("button"); btn.type = "button"; btn.className = "btn btn-sm cm-tf-submit";
    btn.addEventListener("click", submit);
    const close = [...bar.querySelectorAll("button")].pop(); if(close) close.before(btn); else bar.appendChild(btn);
  }
  btn.textContent = "📤 Submit for grading"; btn.title = `Hand in your work on "${w.l.cf.block.title}": it is scored and you see what to improve`;
  btn.dataset.block = forBlock; btn.setAttribute("aria-label", `Submit for grading: ${title}`);
}
function submit(){
  const w = forBlock && where(forBlock); if(!w) return say("Open CaseWorX from the activity's 🚀 Launch to hand it in.");
  if(!document.body.classList.contains("cm-tf-split") && typeof window.cmToolSplit === "function") cmToolSplit(true);   // the grader beside CaseWorX
  cmCaseFlow.mode(forBlock, "check");
  const here = typeof state === "object" && state.view === "day" && state.dayId === w.d.id && typeof cmCaseFlow.blockAt === "function"
    && document.querySelector(`#lessonSlideWrap [data-launch="${CSS.escape(forBlock)}"], #lessonSlideWrap .cfx-check`);
  if(!here && typeof cmCaseFlow.openBlock === "function") cmCaseFlow.openBlock(w.d.id, w.i);
}
window.cmCmsSubmit = {submit, paint, forBlock: () => forBlock, open: (id) => { forBlock = id; paint(); }};

const st = document.createElement("style"); st.id = "cm-cms-submit"; st.textContent = `
#cm-toolframe .cm-tf-bar .cm-tf-submit{background:linear-gradient(180deg,#F3D7AE 0%,#E2B677 100%) !important;color:#1E2340 !important;border:0 !important;font-weight:800 !important;white-space:nowrap;}
#cm-toolframe .cm-tf-bar .cm-tf-submit:hover,#cm-toolframe .cm-tf-bar .cm-tf-submit:focus-visible{background:#fff !important;outline:2px solid #E2B677;outline-offset:1px;}
`;
document.head.appendChild(st);
})();
