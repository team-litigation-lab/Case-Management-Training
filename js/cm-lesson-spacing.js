/* 🧩 EVERY LESSON SLIDE IN SEPARATE, SPACED BLOCKS (the standard for all the lesson decks)
   A Case Flow lesson slide stacks its parts on one white sheet: 💡 Why it matters, the numbered points (and the CM Red
   Flag beside them), a Milestone Steps rail, 📖 In plain English and ⚖ UPL Line. Run together they read as one
   crowded block, so each part is set apart here:
   · a clear gap between every part of the sheet;
   · each numbered point is its own light card, so the points never run into each other or into the Red Flag;
   · the Milestone Steps rail sits in its own panel, with a line between the steps.
   js/cm-slide-layout.js still enlarges the slide to fill its card: the gaps are measured with everything else, so a
   slide only grows as far as still fits with them.
   Also the 🎯 Ready for the Knowledge Check? slide: its questions sit in the middle of the sheet, not at the top with
   a blank band under them. Styles only; nothing on the slide changes. */
(function(){
"use strict";
if(typeof document === "undefined") return;
const S = "#lessonSlideWrap .cfx.cfx-lesson .cfx-sheet";
const R = "#lessonSlideWrap .cfx.cfx-ready .cfx-sheet";
const css = `
/* a gap between every part of a lesson sheet */
${S} > * + *{margin-top:16px !important;}
${S} > .cfx-whyline + *{margin-top:18px !important;}
${S} .cfx-split{column-gap:28px !important;row-gap:14px !important;}
/* each numbered point its own card */
${S} ol.cfx-points{gap:10px !important;}
${S} .cfx-split-ms ol.cfx-points{gap:10px 18px !important;}
${S} ol.cfx-points > li{background:#F7F8FB;border:1.5px solid #DFE3EC;border-radius:14px;padding:8px 14px 8px 10px !important;align-items:center !important;}
${S} ol.cfx-points > li::before{box-shadow:none !important;}
/* the Milestone Steps rail in its own panel, a line between the steps */
${S} .cfx-ms{background:#F7F8FB;border:1.5px solid #DFE3EC;border-radius:14px;padding:10px 16px 12px !important;margin-bottom:0 !important;}
${S} .cfx-ms-t{margin-bottom:8px !important;}
${S} .cfx-ms-rail{gap:0 !important;}
${S} .cfx-ms-rail > li{padding:12px 14px 0 !important;}
${S} .cfx-ms-rail > li:first-child{padding-left:0 !important;}
${S} .cfx-ms-rail > li + li{border-left:1.5px solid #DFE3EC;}
${S} .cfx-ms-n{box-shadow:none !important;}
@media(max-width:600px){ ${S} .cfx-ms-rail > li{padding:10px 0 0 12px !important;} ${S} .cfx-ms-rail > li + li{border-left:0;border-top:1.5px solid #DFE3EC;} }
/* a laptop (or any short window): the same blocks, closer together, so a long lesson still fits at full size */
@media (max-height:900px){
  ${S} > * + *{margin-top:6px !important;} ${S} > .cfx-whyline + *{margin-top:6px !important;}
  ${S} ol.cfx-points, ${S} .cfx-split-ms ol.cfx-points{gap:4px 12px !important;}
  ${S} ol.cfx-points > li{padding:0 8px 0 4px !important;border-width:1px;border-radius:10px;}
  ${S} .cfx-ms{padding:6px 12px 8px !important;} ${S} .cfx-ms-t{margin-bottom:4px !important;} ${S} .cfx-ms-rail > li{padding:8px 10px 0 !important;}
}
/* the shortest windows (a 768px-high laptop): the cards keep their tint, lose their borders, and sit close */
@media (max-height:800px){
  ${S} > * + *, ${S} > .cfx-whyline + *{margin-top:4px !important;}
  ${S} ol.cfx-points, ${S} .cfx-split-ms ol.cfx-points{gap:3px 12px !important;}
  ${S} ol.cfx-points > li{border:0 !important;padding:0 8px 0 2px !important;}
  ${S} .cfx-ms{border:0 !important;padding:4px 10px 6px !important;}
}
/* the Ready check: its questions in the middle of the sheet (auto margins: a long list still starts at the top) */
${R}{justify-content:flex-start !important;}
${R} > .cfx-lab-gate{margin-top:auto !important;margin-bottom:auto !important;}
`;
const add = () => { if(document.getElementById("cm-lesson-spacing")) return;
  const st = document.createElement("style"); st.id = "cm-lesson-spacing"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
