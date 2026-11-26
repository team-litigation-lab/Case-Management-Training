/* ✨ EVERY ACTIVITY'S YOUR TASK, QUIETER (the standard on every deck's activities; after js/cm-task-card.js)
   js/cm-task-card.js made Your Task one instruction card (📂 Your Case, ✅ What to do, the steps) and a bar. It still
   read loud: an orange-edged Your Case strip with an orange tag, orange step numbers and highlights, a dashed footer
   line ("Practices: … · 💡 Tips, 📁 Source Files and this task's tools: 📖 Reference, top right") and an orange Submit.
   Now:
   · the footer line is gone from the slide (the lesson it practises stays in the slide's hidden tools, which 📖 Reference
     shows under 🧰 This task's tools, and which the course's checks read: .cfx-of);
   · 📂 Your Case: a navy header with a quiet glass tag and sand highlights, no orange edge;
   · ✅ What to do: a small navy label over a hairline; the steps with room between them;
   · the card: a soft shadow instead of a grey border; the bar under it: no box, 🚀 Launch and Submit → as two calm
     navy buttons (Submit outlined).
   Wraps window.renderLessonCard (before js/cm-vm-transcribe.js); styles otherwise. */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || typeof window.renderLessonCard !== "function") return;
const __card = window.renderLessonCard;
window.renderLessonCard = function(l){
  const html = __card.apply(this, arguments);
  if(String(html).indexOf("cfx-brief-of") < 0) return html;
  const t = document.createElement("template"); t.innerHTML = String(html);
  t.content.querySelectorAll(".cfx-task1 .cfx-brief > .cfx-brief-of").forEach(n => n.remove());
  return t.innerHTML;
};

const NAVY = "#1E2340", SAND = "#C9A27A";
const css = document.createElement("style"); css.id = "cm-task-elegant"; css.textContent = `
html body .cfx .cfx-task1 .cfx-brief{border:1px solid #E6E9F1 !important;border-radius:18px !important;box-shadow:0 18px 40px -30px rgba(30,35,64,.5),0 2px 6px -4px rgba(30,35,64,.15);gap:8px;padding-bottom:14px;}
html body .cfx .cfx-task1 .cfx-brief > .cfx-yc{background:linear-gradient(135deg,#262C52 0%,${NAVY} 100%) !important;border-left:0 !important;padding:14px 20px !important;}
html body .cfx .cfx-task1 .cfx-yc-k{background:rgba(255,255,255,.12) !important;color:#F1DEC6 !important;box-shadow:inset 0 0 0 1px rgba(241,222,198,.35);}
html body .cfx .cfx-task1 .cfx-yc mark.cfx-hl{background:none !important;color:#EBD3B4 !important;}
html body .cfx .cfx-task1 .cfx-yc .cfx-vm-link{color:#EBD3B4 !important;}
html body .cfx .cfx-task1 .cfx-brief-k{margin:6px 20px 0 !important;padding-bottom:6px;border-bottom:1px solid #EEF0F5;color:${NAVY} !important;letter-spacing:.12em !important;}
html body .cfx .cfx-task1 .cfx-brief > ol.cfx-steps{padding:0 20px !important;gap:6px !important;}
html body .cfx .cfx-task1 .cfx-task-foot{background:transparent !important;border:0 !important;padding:4px 2px !important;}
html body .cfx .cfx-task1 .cfx-task-foot .cfx-launch{border:1px solid rgba(201,162,122,.6) !important;border-radius:12px !important;box-shadow:0 8px 18px -12px rgba(30,35,64,.6) !important;}
html body .cfx .cfx-task1 .cfx-task-foot .cfx-launch:hover, html body .cfx .cfx-task1 .cfx-task-foot .cfx-launch:focus-visible{background:#2E3566 !important;}
html body .cfx .cfx-task1 .cfx-grade-go{background:#fff !important;color:${NAVY} !important;border:2px solid ${NAVY} !important;box-shadow:none !important;}
html body .cfx .cfx-task1 .cfx-grade-go:hover, html body .cfx .cfx-task1 .cfx-grade-go:focus-visible{background:${NAVY} !important;color:#fff !important;}
@media (max-height:900px){
  html body .cfx .cfx-task1 .cfx-brief{gap:4px;padding-bottom:8px;}
  html body .cfx .cfx-task1 .cfx-brief > .cfx-yc{padding:8px 16px !important;}
  html body .cfx .cfx-task1 .cfx-brief-k{margin-top:2px !important;padding-bottom:3px;}
  html body .cfx .cfx-task1 .cfx-brief > ol.cfx-steps{gap:2px !important;}
}
`;
document.head.appendChild(css);
})();
