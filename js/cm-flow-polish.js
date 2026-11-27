/* 🧹 FLOW POLISH (every Case Flow deck and the dashboard)
   · ⏭ On to 🎯 Ready for the Knowledge Check?: gone from the Practice Lab and Extra Practice slides (js/cm-case-flow.js,
     js/cm-day-loop.js .cfx-ex-go). The deck's own Next → goes to the Ready check, so the button only said it twice.
   Styles only. */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-flow-polish")) return;
const css = `
html body #lessonSlideWrap .cfx-ex-go{display:none !important;}
`;
const add = () => { if(document.getElementById("cm-flow-polish")) return;
  const st = document.createElement("style"); st.id = "cm-flow-polish"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
