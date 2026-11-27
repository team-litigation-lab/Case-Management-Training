/* 🗂 THE DASHBOARD'S DAY CARDS IN THE EA/PA COURSE'S STYLE (same rows, same buttons, same order)
   The EA/PA Track's day cards: a white card in the navy-to-orange frame; a small spaced day kicker; the topic in a
   soft grey pill with a navy edge; the icon on white; the main button a solid navy band, its word in capitals; the
   small buttons quiet slate tiles. The Case Flow cards keep everything they hold (Case Flow Day N, the icon, the
   topic, the Knowledge Check line, Review / Start / Continue, 👁 Review Score · 🔁 Retake, ▶ Video · 🎬 Case Debrief);
   only their look changes. Styles only. */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-daycard-eapa")) return;
const C = "html body .dash-main .module-card.mc-clean.mc-clean.mc-clean";
const css = `
${C}{background:linear-gradient(#fff,#fff) padding-box,linear-gradient(180deg,#1E2340 0%,#2C3360 30%,#A8692F 78%,#DB8437 100%) border-box !important;border:6px solid transparent !important;border-radius:22px !important;
  box-shadow:0 16px 30px -16px rgba(30,35,64,.45),0 4px 10px -6px rgba(30,35,64,.2) !important;overflow:hidden;}
/* the head: Case Flow Day N as the EA/PA day kicker */
${C} .module-head{background:#fff !important;border:0 !important;padding:6px 10px 0 !important;}
${C} .module-head .mh-title{background:none !important;border:0 !important;padding:0 !important;font:800 13px/1.4 'IBM Plex Mono',ui-monospace,monospace !important;letter-spacing:.1em !important;text-transform:uppercase !important;color:#9A3412 !important;}
/* the body: the icon on white, the topic in a grey pill with a navy edge */
${C} .module-body{background:#fff !important;padding:2px 12px 4px !important;gap:4px !important;}
${C} .module-icon{display:block !important;font-size:26px !important;line-height:1 !important;margin:0 auto 4px !important;}
${C} .module-theme{background:#E9EBEF !important;border:2px solid #0F2148 !important;border-radius:10px !important;box-shadow:none !important;color:#0F2148 !important;
  font:800 17px/1.2 'Inter',sans-serif !important;letter-spacing:0 !important;padding:4px 10px !important;margin:0 !important;}
/* the Knowledge Check line */
${C} .mc-progress, ${C} .mc-kc{background:#fff !important;color:#1E2340 !important;}
/* the rows: no lines; the main button a navy band, the others slate tiles */
${C} .mc-grid.mc-grid{background:#fff !important;border:0 !important;gap:0 !important;}
${C} .mc-grid.mc-grid > button, ${C} .mc-grid.mc-grid > .btn, ${C} .mc-grid.mc-grid > * > button{border:0 !important;border-radius:0 !important;box-shadow:none !important;}
${C} .mc-grid.mc-grid > button.module-start-btn{background:#0F2148 !important;color:#FDBA74 !important;font:800 16px/1 'Inter',sans-serif !important;letter-spacing:.06em !important;text-transform:uppercase !important;padding:12px 10px !important;}
${C} .mc-grid.mc-grid > button.module-start-btn:not(:disabled):hover{background:#1E2F63 !important;color:#FFD3A1 !important;}
${C} .mc-grid.mc-grid > button:not(.module-start-btn), ${C} .mc-grid.mc-grid > *:not(button) > button{background:#F1F5F9 !important;color:#334155 !important;font:700 14px/1.2 'Inter',sans-serif !important;padding:9px 6px !important;}
/* ▶ Video (and Day 5's 🎬 Case Debrief beside it): its own row, a size up from the small tiles, as in Day 1's format */
${C} .mc-grid.mc-grid > button.cm-dcf-video{font:800 16px/1.2 'Inter',sans-serif !important;padding:12px 6px !important;color:#0F2148 !important;}
${C} .mc-grid.mc-grid > button:not(.module-start-btn) + button:not(.module-start-btn){box-shadow:inset 1px 0 0 #fff !important;}
${C} .mc-grid.mc-grid > button:not(.module-start-btn):not([aria-disabled="true"]):hover{background:#E2E8F0 !important;color:#0F2148 !important;}
${C} .mc-grid.mc-grid > button[aria-disabled="true"]:not(.module-start-btn){color:#64748B !important;}
`;
const add = () => { if(document.getElementById("cm-daycard-eapa")) return;
  const st = document.createElement("style"); st.id = "cm-daycard-eapa"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
