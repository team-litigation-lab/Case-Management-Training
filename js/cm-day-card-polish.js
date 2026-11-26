/* 🗂 THE DAY CARDS, TIDIED (after js/cm-day-card-format.js and js/lsh-card-frame.js have laid the card out)
   · The day's theme under its icon ("Fundamentals, Intake, Claim Set Up & Treatment") sits in a soft cream-to-peach gradient box with a thin orange border and warm orange type, the card's width,
     in place of the short orange underline (which ran into the text on a one-line theme).
     On a shorter card (a laptop, or Day 5 with its 🎬 Case Debrief row) the icon goes and the theme stays, in its pill.
   · ▶ Video keeps its cream fill but loses the orange bar down its left edge: that bar met the card's orange frame
     at the bottom corner and the two overlapped.
   · The line along the top of every day card is the LSH orange (it alternated slate and orange).
   · 👁 Review Score and 🔁 Retake are centred in their cells, clear of the frame on the left.
   Styles only, added once the page has loaded so they come after the card files' own. */
(function(){
"use strict";
if(typeof document === "undefined") return;
const C = "html body .dash-main .module-card.mc-clean";
const css = `
/* the theme: a soft cream-to-peach gradient box, a thin orange border, warm orange type, the card's width */
${C} .module-theme{display:flex !important;align-items:center;justify-content:center;box-sizing:border-box;width:calc(100% - 24px) !important;max-width:none !important;min-height:3.2em;margin:6px auto 0 !important;
  padding:8px 14px !important;border-radius:10px !important;background:linear-gradient(180deg,#FFFBF6 0%,#FDEEDD 100%) !important;border:1.5px solid #E8A469 !important;
  color:#B35A1F !important;font-family:inherit !important;font-weight:700 !important;letter-spacing:.01em !important;text-align:center !important;
  box-shadow:0 6px 16px -10px rgba(219,132,55,.55) !important;
  -webkit-line-clamp:unset !important;overflow:visible !important;max-height:none !important;font-size:15.5px !important;line-height:1.35 !important;text-wrap:balance;}
@container (min-height:180px){ ${C} .module-theme{font-size:17px !important;} }
@container (max-height:96px){ ${C} .module-theme{min-height:0;padding:4px 12px !important;margin:0 auto !important;box-shadow:none !important;} }   /* a very short card (Day 5, with 🎬 Case Debrief): the box tighter, nothing clipped */
@container (max-width:280px){ ${C} .module-theme{width:calc(100% - 16px) !important;padding:5px 8px !important;font-size:14px !important;min-height:2.9em;} }   /* a laptop's narrow cards: two lines, not three */
@container (max-height:132px){ ${C} .module-icon{display:none !important;} ${C} .module-theme{margin-top:0 !important;} }   /* a short card keeps the theme, in its pill, not the icon */
${C} .module-theme::after{content:none !important;display:none !important;}
/* the line along the top of every day card in one colour, the LSH orange (lsh-dashboard.js alternates slate and orange) */
${C} .module-head{border-top:4px solid #DB8437 !important;}
${C}.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video{box-shadow:none !important;}
${C}.mc-dcf .mc-grid.mc-grid > button.cm-dcf-score,${C}.mc-dcf .mc-grid.mc-grid > button.cm-dcf-retake{text-align:center !important;justify-content:center !important;padding-left:10px !important;padding-right:10px !important;}
`;
const add = () => { if(document.getElementById("cm-day-card-polish")) return;
  const st = document.createElement("style"); st.id = "cm-day-card-polish"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
