/* 🎨 CALMER SLIDES: LESS ORANGE (every Case Flow deck)
   The slides had orange on almost every piece at once (the rule numbers, every highlight, the Why it matters tag, the
   ribbon's underline, the title bar, the buttons' edges), which was hard on the eye. Navy carries the structure now,
   and the LSH orange is kept as a small accent:
   · the numbered points: navy discs, not orange;
   · a highlight (**bold** in the copy): a pale slate band under the words instead of a bright orange one;
   · 💡 Why it matters: a quiet glass tag, its highlighted words a soft sand colour;
   · the ribbon, the title's lead bar, the progress bar and the buttons: their orange made a soft, unglowing sand;
   · 📇 Open the Case Profile: a plain navy button (the grid of orange lines over it is gone).
   Styles only (after js/cm-deck-elite.js, which it overrides); nothing on the slides changes. */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-calm-accents")) return;
const SAND = "#C9A27A", NAVY = "#1E2340";
const css = `
/* the numbered points: navy discs */
html body .cf-stage-card.cf-stage-card .cfx ol.cfx-points > li::before{background:linear-gradient(145deg,#3A4275 0%,${NAVY} 100%) !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.18),0 0 0 3px rgba(30,35,64,.08),0 4px 10px -6px rgba(30,35,64,.5) !important;}
/* highlights: a pale slate band */
html body .cfx.cfx mark.cfx-hl{background:linear-gradient(180deg,transparent 58%,#E2E7F2 58%,#E2E7F2 94%,transparent 94%) !important;color:inherit !important;}
html body .cfx.cfx .cfx-whyline mark.cfx-hl{background:none !important;color:#EBD3B4 !important;}
/* 💡 Why it matters: a quiet tag */
html body .cf-stage-card.cf-stage-card .cfx .cfx-whyline-k{background:rgba(255,255,255,.12) !important;color:#F1DEC6 !important;box-shadow:inset 0 0 0 1px rgba(241,222,198,.35) !important;}
/* the title's lead bar, the progress bar, the ribbon: sand, no glow */
html body .cfx-deck .cfx-deck-title.cfx-deck-title::before{background:${SAND} !important;box-shadow:none !important;}
html body .cf-stage-card .slide-dots.cf-dots-bar .cf-dots-fill{background:${SAND} !important;box-shadow:none !important;}
html body .cfx-deck > .cfx-ribbon > span{background:linear-gradient(90deg,rgba(201,162,122,0) 0%,rgba(201,162,122,.55) 30%,rgba(201,162,122,.55) 70%,rgba(201,162,122,0) 100%) left bottom / 100% 2px no-repeat border-box,
    linear-gradient(180deg,rgba(255,255,255,.09) 0%,rgba(255,255,255,.035) 100%) !important;}
html body .cfx-deck .cfx-what-k.cfx-what-k{color:#E9D8C2 !important;background:rgba(255,255,255,.08) !important;border-color:rgba(233,216,194,.35) !important;}
/* the band's buttons: no orange edge */
html body .cfx-ref-open.cfx-ref-open{box-shadow:inset 0 1px 0 rgba(255,255,255,.12),0 8px 16px -10px rgba(0,0,0,.7) !important;border-color:rgba(255,255,255,.28) !important;}
html body .cfx-ref-open.cfx-ref-open:hover, html body .cfx-ref-open.cfx-ref-open:focus-visible{outline-color:${SAND} !important;}
html body .cfx-plain-open.cfx-plain-open{border-color:${SAND};}
html body .cfx-plain-open.cfx-plain-open:hover, html body .cfx-plain-open.cfx-plain-open:focus-visible{background:${NAVY};border-color:${NAVY};}
/* 📇 Open the Case Profile (Day 1's Meet John Doe, a day's The Case So Far): a plain navy button, no grid over it */
html body .cpx-s-go .cpx-s-btn::before{content:none !important;display:none !important;}
html body .cpx-s-go .cpx-s-btn.cpx-s-btn{border:1px solid rgba(201,162,122,.6) !important;border-radius:12px !important;}
/* 📄 the document strip and its "On John Doe's file" button */
html body .cfx.cfx .cfx-docline{border-color:rgba(201,162,122,.55) !important;background:#FBF8F3 !important;}
html body .cfx.cfx .cfx-docline-f{background:${NAVY} !important;color:#fff !important;border-color:${NAVY} !important;box-shadow:none !important;}
/* the day's Training Agenda, even on every day: the cards three to a row, a short last row centred (no hole in a grid),
   each Part's label the full width above its cards, every card in a row the same height; Part 1 opens with the client
   (📇 the Case Profile, before the lessons: js/cm-day-loop.js), in its own sand tint */
html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two{display:flex !important;flex-wrap:wrap !important;justify-content:center !important;align-items:stretch !important;gap:4px 12px !important;grid-template-columns:none !important;grid-template-rows:none !important;}
html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two > li{flex:0 0 calc((100% - 24px) / 3) !important;max-width:calc((100% - 24px) / 3) !important;box-sizing:border-box;grid-column:auto !important;grid-row:auto !important;}
html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two > li.cfx-ag-label{flex:0 0 100% !important;max-width:100% !important;justify-content:center;}
/* a long agenda (Day 1: thirteen rows and more) four cards to a row, so it keeps three rows of cards and stays full size */
html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two:has(> li:nth-child(13)) > li:not(.cfx-ag-label){flex-basis:calc((100% - 36px) / 4) !important;max-width:calc((100% - 36px) / 4) !important;}
html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two:has(> li:nth-child(13)) > li.cfx-ag-lab, html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two:has(> li:nth-child(13)) > li.cfx-ag-kc{flex-basis:calc((100% - 24px) / 3) !important;max-width:calc((100% - 24px) / 3) !important;}   /* (Part 2's two cards a third each: the loop's row on two lines) */
html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two > li:not(.cfx-ag-label){padding-top:2px !important;padding-bottom:2px !important;}
html body #lessonSlideWrap .cfx-agenda .cfx-ag-list.cfx-ag-two > li.cfx-ag-profile{background:rgba(201,162,122,.22) !important;border-color:#C9A27A !important;}
html body #lessonSlideWrap .cfx-agenda .cfx-ag-side p{line-height:1.3 !important;}
/* (the dashboard's day cards: js/cm-daycard-eapa.js) */
/* the Exception: a softer sand */
html body .cfx .cfx-rx .cfx-rx-exc{background:#FAF5EE !important;}
html body #lessonSlideWrap .cfx .cfx-split-rx > .cfx-rx .cfx-rx-exc{border-left-color:${SAND} !important;}
`;
const add = () => { if(document.getElementById("cm-calm-accents")) return;
  const st = document.createElement("style"); st.id = "cm-calm-accents"; st.textContent = css; document.head.appendChild(st); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", add); else add();
})();
