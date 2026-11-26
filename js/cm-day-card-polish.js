/* 🗂 THE DAY CARDS, TIDIED (after js/cm-day-card-format.js and js/lsh-card-frame.js have laid the card out)
   · The day's theme under its icon ("Fundamentals, Intake, Claim Set Up & Treatment") sits in a pill, centred,
     in place of the short orange underline (which ran into the text on a one-line theme).
     On a short card the theme and its icon get smaller; on a very short one (Day 5, with its 🎬 Case Debrief row) the
     icon goes and the theme stays.
   · ▶ Video keeps its cream fill but loses the orange bar down its left edge: that bar met the card's orange frame
     at the bottom corner and the two overlapped.
   · 👁 Review Score and 🔁 Retake are centred in their cells, clear of the frame on the left.
   Styles only, added once the page has loaded so they come after the card files' own. */
(function(){
"use strict";
if(typeof document === "undefined") return;
const C = "html body .dash-main .module-card.mc-clean";
const css = `
${C} .module-theme{display:block !important;width:fit-content !important;max-width:calc(100% - 16px) !important;margin:4px auto 0 !important;
  padding:4px 14px !important;border-radius:999px !important;background:#FFF4E8 !important;border:2px solid #DB8437 !important;
  box-shadow:0 4px 10px -6px rgba(219,132,55,.6);text-align:center !important;
  -webkit-line-clamp:unset !important;overflow:visible !important;max-height:none !important;font-size:15px !important;line-height:1.22 !important;text-wrap:balance;}
@container (max-height:150px){ ${C} .module-theme{font-size:13.5px !important;padding:3px 12px !important;} ${C} .module-icon{font-size:24px !important;line-height:1 !important;} }
@container (min-height:220px){ ${C} .module-theme{font-size:17px !important;padding:6px 18px !important;} }
@container (max-height:84px){ ${C} .module-icon{display:none !important;} ${C} .module-theme{margin-top:0 !important;} }   /* a very short card keeps the theme, not the icon */
${C} .module-theme::after{content:none !important;display:none !important;}
${C}.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video{box-shadow:none !important;}
${C}.mc-dcf .mc-grid.mc-grid > button.cm-dcf-score,${C}.mc-dcf .mc-grid.mc-grid > button.cm-dcf-retake{text-align:center !important;justify-content:center !important;padding-left:10px !important;padding-right:10px !important;}
`;
const add = () => { if(document.getElementById("cm-day-card-polish")) return;
  const st = document.createElement("style"); st.id = "cm-day-card-polish"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
