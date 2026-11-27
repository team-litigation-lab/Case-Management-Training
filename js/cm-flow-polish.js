/* 🧹 FLOW POLISH (every Case Flow deck and the dashboard)
   · ⏭ On to 🎯 Ready for the Knowledge Check?: gone from the Practice Lab and Extra Practice slides (js/cm-case-flow.js,
     js/cm-day-loop.js .cfx-ex-go). The deck's own Next → goes to the Ready check, so the button only said it twice.
   · the dashboard's day cards: one frame and no lines inside it. The orange bar along the header, the line under it, the
     line over the buttons and the lines between them are gone; the rows keep their own tints, which already separate them.
   Styles only. */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-flow-polish")) return;
const css = `
html body #lessonSlideWrap .cfx-ex-go{display:none !important;}
html body .dash-main .module-card.mc-clean.mc-clean .module-head{border-top:0 !important;border-bottom:0 !important;}
html body .dash-main .module-card.mc-clean.mc-clean .mc-grid.mc-grid{border-top:0 !important;}
html body .dash-main .module-card.mc-clean.mc-clean .mc-grid.mc-grid > button, html body .dash-main .module-card.mc-clean.mc-clean .mc-grid.mc-grid > .btn{border-top:0 !important;border-right:0 !important;border-left:0 !important;border-bottom:0 !important;box-shadow:none !important;}
html body .dash-main .module-card.mc-clean.mc-clean .mc-grid.mc-grid > button + button{margin-top:0;}
`;
const add = () => { if(document.getElementById("cm-flow-polish")) return;
  const st = document.createElement("style"); st.id = "cm-flow-polish"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
