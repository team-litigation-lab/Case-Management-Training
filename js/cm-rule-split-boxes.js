/* 🗂 THE RULES SLIDE WITH A RULE vs. EXCEPTION IN TWO BOXES (every lesson deck set up this way)
   A lesson's The Rules slide whose copy has a `ruleEx` draws the numbered points on the left and the Rule vs. Exception
   on the right (js/cm-case-flow.js, .cfx-split-rx). With every point its own card (js/cm-lesson-spacing.js) and the
   Rule and the Exception each in a box of their own, with On this file and Confirm loose under them, the slide read as
   eight separate pieces. Here the two sides are two boxes:
   · the points: one panel, the points inside it split by a thin line instead of each in its own card;
   · the Rule vs. Exception: one panel holding the Rule, the Exception, On this file and Confirm, the last two under a
     line of their own.
   Both panels run the same height. Styles only; nothing on the slide changes, and js/cm-slide-layout.js still sizes
   the slide to fit its card with the panels' padding measured in. */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-rule-split-boxes")) return;
const S = "#lessonSlideWrap .cfx.cfx-lesson .cfx-sheet .cfx-split.cfx-split-rx";
const css = `
${S}{align-items:stretch !important;column-gap:16px !important;}
/* the points: one panel */
${S} > ol.cfx-points{background:#F7F8FB;border:1.5px solid #DFE3EC;border-radius:14px;padding:2px 10px !important;gap:0 !important;align-self:stretch;justify-content:center;}
${S} > ol.cfx-points > li{background:transparent !important;border:0 !important;border-radius:0 !important;padding:5px 2px !important;}
${S} > ol.cfx-points > li + li{border-top:1px solid #DFE3EC !important;}
/* the Rule vs. Exception: one panel, On this file and Confirm under a line */
${S} > .cfx-rx{background:#fff;border:1.5px solid #1E2340;border-radius:14px;padding:6px 10px;gap:5px;justify-content:center;}
${S} > .cfx-rx .cfx-rx-rule,${S} > .cfx-rx .cfx-rx-exc{border:0 !important;border-left:5px solid #1E2340 !important;border-radius:8px;padding:4px 10px 5px;}
${S} > .cfx-rx .cfx-rx-exc{border-left-color:#DB8437 !important;}
${S} > .cfx-rx .cfx-rx-file{border-top:1px solid #DFE3EC;padding-top:5px;}
/* a laptop or any short window (js/cm-lesson-spacing.js packs the slide tighter there): the points sit close inside their box */
@media (max-height:900px){ ${S} > ol.cfx-points > li{padding:3px 2px !important;} ${S} > .cfx-rx{padding:5px 10px;gap:4px;} }
@media (max-height:800px){ ${S} > ol.cfx-points > li{padding:0 2px !important;} ${S} > ol.cfx-points{padding:0 10px !important;}
  ${S} > .cfx-rx{padding:4px 8px;gap:3px;} ${S} > .cfx-rx .cfx-rx-rule,${S} > .cfx-rx .cfx-rx-exc{padding:2px 8px 3px;} ${S} > .cfx-rx .cfx-rx-file{padding-top:3px;} }
`;
const add = () => { if(document.getElementById("cm-rule-split-boxes")) return;
  const st = document.createElement("style"); st.id = "cm-rule-split-boxes"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
