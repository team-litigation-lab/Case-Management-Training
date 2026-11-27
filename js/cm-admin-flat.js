/* 🛡 ADMIN ON ONE WHITE SHEET (every Admin section; the 🏅 Scorecard's 🏅 Scores most of all)
   An Admin page sat in three white cards one inside the other: the section screen (.cmsh-screen), the Admin panel inside
   it (.cm-admin-screen) and, on 🏅 Scorecards, the 🏅 Scores card (.gs-card.scx-card, with its grey frame). The section
   screen stays, the one white sheet; the two inside it lose their white, frame, shadow and padding, so the tabs, the navy
   hero and the table sit straight on it. (The :not(#…) pair outranks js/lsh-card-frame.js's frame on every page card.)
   Styles only. */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-admin-flat")) return;
const css = `
html body .cmsh-screen .cm-admin-screen{background:transparent !important;box-shadow:none !important;border:0 !important;border-radius:0 !important;padding:0 !important;}
html body .cmsh-screen .card.gs-card.scx-card:not(#cm-no-1):not(#cm-no-2), html body .cmsh-screen .card.gs-card.scx-card:not(#cm-no-1):not(#cm-no-2):hover{background:transparent !important;box-shadow:none !important;border:0 !important;border-radius:0 !important;}
`;
const add = () => { if(document.getElementById("cm-admin-flat")) return;
  const st = document.createElement("style"); st.id = "cm-admin-flat"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
