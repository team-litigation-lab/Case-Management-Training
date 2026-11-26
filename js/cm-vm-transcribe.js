/* 🎙 A VOICEMAIL ACTIVITY'S YOUR TASK: TAKE THE MESSAGE DOWN IN THE LISTENING CHECK, AND IT IS PART OF THE GRADE
   A Skill Activity that starts from a voicemail with its 🎧 Listening Check (js/cm-case-flow.js cmCaseFlow.listen: the
   player and the questions the trainee answers from what they hear, checked with "Check my notes") used to say
   "Assuming John Doe's voicemail is transcribed…", and its bar held 🧰 Tools and Submit →. Now its Your Task says it
   plainly, and the bar's button is where the message is taken down:
   · 📂 Your Case opens "Listen to John Doe's voicemail and take it down in the 🎧 Listening Check. Then, assuming …"
     (in place of "Assuming John Doe's voicemail is transcribed and …");
   · the bar keeps 🚀 Launch; in place of 🧰 Tools and Submit → it has 🎧 Take it down: Listening Check, which opens the
     check, and once the notes are checked, 📤 Submit →, which opens the activity's 🤖 AI Grader;
   · the grader already reads the Listening Check's answers as evidence (js/cm-ai-grader.js prefill); its 🧭 Guide gets
     "The voicemail taken down in the Listening Check: every fact caught", and its copy of the steps the step itself
     (window.CM_AIG_EXTRA slide: the generated copy is not edited).
   Wraps window.renderLessonCard; nothing in the generated deck is edited. */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const SIM = () => window.CM_CF_SIM || {events: {}};
const STEP = "Play the voicemail and take it down in the 🎧 Listening Check (Check my notes): it is graded.";
const CHECK = "The voicemail taken down in the Listening Check: every fact caught";

/* the activities this is for: a voicemail with its words and its Listening Check */
function vmOf(id){
  const e = (SIM().events || {})[id];
  return e && e.channel === "voicemail" && e.spoken && Array.isArray(e.listen) && e.listen.length ? e : null;
}
const REC = () => (window.cmCaseFlow && typeof cmCaseFlow.record === "function" && cmCaseFlow.record()) || {};
const checked = id => !!(((REC().listen || {})[id] || {}).at);

/* ---------- the slide ---------- */
if(typeof window.renderLessonCard === "function"){
  const __card = window.renderLessonCard;
  window.renderLessonCard = function(l){
    const html = __card.apply(this, arguments);
    const b = l && l.cf && l.cf.block; if(!b || b.kind !== "activity" || !vmOf(b.id) || String(html).indexOf("cfx-task-foot") < 0) return html;
    const t = document.createElement("template"); t.innerHTML = String(html);
    const task = t.content.querySelector(".cfx-task"), foot = task && task.querySelector(".cfx-task-foot");
    if(!foot) return html;
    // 📂 Your Case no longer assumes the message is taken down: the trainee does it here
    const yc = task.querySelector(".cfx-yc-t");
    if(yc) yc.innerHTML = yc.innerHTML.replace(/Assuming ([^<.]*?)voicemail is transcribed(?: and|,)\s*/i, (m, who) => `<b class="vmt-do">Listen to ${who}voicemail and take it down in the 🎧 Listening Check.</b> Then, assuming `);
    foot.querySelectorAll(":scope > .cfx-tools-menu, :scope > .cfx-grade-go").forEach(n => n.remove());
    foot.insertAdjacentHTML("beforeend", checked(b.id)
      ? `<button type="button" class="btn vmt-go" onclick="cmCaseFlow.mode('${E(b.id)}','check')" title="Your notes are checked: now your work on the file is checked">📤 Submit →</button>`
      : `<button type="button" class="btn vmt-go" onclick="cmCaseFlow.listen('${E(b.id)}')" title="Play the voicemail and take it down: your notes are graded">🎧 Take it down: Listening Check</button>`);
    return t.innerHTML;
  };
}
// once the notes are checked, the slide's button turns to 📤 Submit →
if(window.cmCaseFlow && typeof cmCaseFlow.listenCheck === "function"){
  const __check = cmCaseFlow.listenCheck;
  cmCaseFlow.listenCheck = function(id){ const r = __check.apply(this, arguments); if(vmOf(id) && checked(id) && typeof render === "function") try{ render(); }catch(e){} return r; };
}
window.cmVmTranscribe = {vmOf, checked};

/* ---------- the grader's copy of the slide: the step and its Guide line ---------- */
function register(){
  const ev = SIM().events || {}, X = (window.CM_AIG_EXTRA = window.CM_AIG_EXTRA || {});
  Object.keys(ev).filter(vmOf).forEach(id => {
    if(X[id]) return;
    X[id] = {get slide(){ const s = (window.CM_CF_SLIDES || {})[id]; if(!s) return undefined;
      return Object.assign({}, s, {steps: [STEP].concat(s.steps || []), checks: (s.checks || []).concat([CHECK])}); }};
  });
}
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", register); else register();

const css = document.createElement("style"); css.id = "cm-vm-transcribe"; css.textContent = `
.cfx-task1 .cfx-yc .vmt-do{color:#FFC98F;font-weight:800;}
.cfx-task .cfx-task-foot .vmt-go{margin-left:auto;background:#DB8437 !important;color:#fff !important;border:0 !important;font:800 18px/1.2 var(--font-ui,'Inter',sans-serif) !important;padding:11px 22px !important;border-radius:12px !important;}
.cfx-task .cfx-task-foot .vmt-go:hover{background:#1E2340 !important;}
`;
document.head.appendChild(css);
})();
