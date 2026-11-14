/* ============================================================
   One slide a block: a saved place on a slide that left the deck lands on its block's slide

   A drawn lesson is one slide now, The Rules (js/cm-case-flow.js `lean`), and a Skill Activity is its Your Task slide
   (a day's Skill Building keeps its document audit, Day 1's Backup File Maintenance its Your Case): their other slides
   (The Theory, The Framework, Your Case, the Grade-A Standard, See It, the AI Grader …) are in 📖 Reference, in the
   trainer's talking points and, for the AI Grader, behind Your Task's Submit button.
   A trainee's place is saved by slide key (js/cm-slide-keys.js: "d2m2-eob:theory2"). Left alone, a place whose slide
   is gone lands on the nearest slide before it that is still there: the slide before the block, another lesson. This
   rule (window.CM_SLIDE_KEY_RULES) puts it on its own block's first slide instead, where the block is still in the day.
   (A place saved on a Skill Activity's AI Grader slide lands on its Your Task, where Submit opens the AI Grader.)
   ============================================================ */
(function(){
"use strict";
const RULE = "oneSlide";
// the drawn slides that left the deck when a block became one slide (a lesson's, an activity's)
const LEFT = /:(map|theory|theory2|frame|why|doc|model|dodont|case|grade|audit|check)$/;
const blockOf = k => String(k || "").replace(/#\d+$/, "").replace(/:[^:]*$/, "");
function place(d, r, to, keys){
  const k = r && Array.isArray(r.k) ? r.k[0] : "";
  if(!k || k.charAt(0) === "~" || keys.indexOf(k) >= 0) return to;   // a day's own slide, or its slide is still there
  if(!LEFT.test(String(k).replace(/#\d+$/, ""))) return to;   // a deck page taken out: the nearest slide before it, as ever
  const b = blockOf(k); if(!b) return to;
  const at = keys.findIndex(x => blockOf(x) === b);
  return at >= 0 ? at : to;
}
(window.CM_SLIDE_KEY_RULES = window.CM_SLIDE_KEY_RULES || []).push({id: RULE, place});

/* Your Task turned into the 🤖 AI Grader (Submit) or a side exercise's audit is that slide only: moving to another slide
   (Next, Previous, a jump) shows the next block's slide as it is, and coming back shows Your Task again */
["nextSlide", "prevSlide", "goToSlide"].forEach(f => {
  const was = window[f]; if(typeof was !== "function") return;
  window[f] = function(){ if(window.cmCaseFlow && typeof cmCaseFlow.clearModes === "function") cmCaseFlow.clearModes(); return was.apply(this, arguments); };
});

/* The type floor (CLAUDE.md: type on the slides is bold and at least 16px on a laptop; .github/scripts/slide-type.cjs):
   what a Skill Activity's slide shows in its AI Grader and its document audit, and the day's own slides, at 16px bold. The audit's slide is the
   way into its workbench: the set, where the trainee stands and the button; the five calls are explained in the
   workbench itself, so their legend is not repeated on the slide, nor its note on the simulation's real-time results. */
if(typeof document === "undefined") return;
const W = "#lessonSlideWrap .cfx";
const css = document.createElement("style");
css.id = "cm-one-slide-css";
css.textContent = `
${W} .aig-empty,${W} .aig-ev li,${W} .cfx-log,${W} .cfx-log b,${W} .cfx-log input,${W} .cfx-log .btn{font-size:16px !important;font-weight:700 !important;}
${W} .cfx-aud .cfx-chip,${W} .cfx-aud-due,${W} .cfx-aud-due b,${W} .cfx-aud-intro,${W} .cfx-aud .cfx-simnote,${W} .cfx-aud .cfx-simnote b,${W} .cfx-aud-card b,${W} .cfx-aud-card small,
${W} .cfx-aud-card span,${W} .cfx-aud-card a,${W} .cfx-aud-n,${W} .cfx-aud-note,${W} .cfx-aud-act .btn,${W} .cfx-aud-points{font-size:16px !important;font-weight:700 !important;}
${W} .cfx-aud-card b{text-transform:none;letter-spacing:0;}
${W} .cfx-aud-calls{display:none !important;}
${W} .cfx-aud{gap:8px;} ${W} .cfx-aud-intro{line-height:1.35;max-width:none;text-align:left !important;}
${W} .cfx-aud .cfx-simnote{display:none !important;}   /* (the workbench says it, where the results come in) */
/* the day's own slides: the Training Agenda, the Ready check, the companion-case build and the optional extra practice */
${W}-agenda .cfx-ag-day,${W}-agenda .cfx-ag-side p,${W}-agenda .cfx-ag-n,${W}-agenda .cfx-ag-list li small,${W}-agenda .cfx-ag-label b,${W}-agenda .cfx-ag-label span,
${W}-agenda .cfx-ag-file dt,${W}-agenda .cfx-ag-file dd,${W}-agenda .cfx-ag-file-h,${W}-agenda .cfx-ag-file-h small{font-size:16px !important;font-weight:700 !important;}
${W}-agenda .cfx-ag-side p{line-height:1.4 !important;}
@media (max-height:900px){ ${W}-agenda .cfx-ag-file{display:none !important;} }
${W}-agenda .cfx-ag{gap:8px !important;} ${W}-agenda .cfx-ag-side{padding:8px 16px !important;} ${W}-agenda .cfx-ag-day{margin:0 auto 6px !important;}
${W}-agenda .cfx-ag-list li:not(.cfx-ag-label){padding:6px 14px !important;min-height:0 !important;} ${W}-agenda .cfx-ag-n{width:32px !important;height:32px !important;min-width:32px !important;}
${W}-agenda .cfx-ag-list.cfx-ag-two{gap:6px 12px !important;} ${W}-agenda .cfx-ag-list li b{font-size:18px !important;line-height:1.22 !important;} ${W}-agenda .cfx-ag-list li:not(.cfx-ag-label){padding:5px 12px !important;} ${W}-agenda .cfx-ag-body{padding-top:8px !important;}
${W}-ready .cfx-sheet{padding-top:8px !important;padding-bottom:8px !important;}
${W}-ready .cfx-lab-gate{font-weight:700 !important;padding:6px 14px !important;font-size:16px !important;line-height:1.3 !important;margin:0 !important;}
${W}-ready .cfx-lab-q{margin-top:5px !important;} ${W}-ready .cfx-lab-q > span{font-size:16px !important;font-weight:800 !important;line-height:1.25 !important;}
${W}-ready .cfx-lab-q .o{gap:4px 6px !important;margin-top:4px !important;} ${W}-ready .cfx-lab-q .o button{font-size:16px !important;font-weight:700 !important;padding:3px 10px !important;line-height:1.2 !important;border-width:1.5px !important;}
${W}-ready .cfx-lab-q .r,${W}-ready .cfx-ready-done{font-size:16px !important;font-weight:700 !important;}
${W}-build .cfx-bd-k,${W}-build .cfx-bd-steps .cfx-bd-t small{font-size:16px !important;font-weight:800 !important;}
${W}-build .cfx-bd-steps{gap:6px !important;} ${W}-build .cfx-bd-steps li{padding:6px 16px !important;}
${W}-build .cfx-bd-steps li > div > b{font-size:19px !important;} ${W}-build .cfx-bd-steps li > div > span{font-size:17px !important;line-height:1.35 !important;} ${W}-build .cfx-bd-steps .cfx-bd-t{font-size:19px !important;}
${W}-build .cfx-bd-steps em{font-size:16px !important;line-height:1.3 !important;margin-top:2px !important;}
${W}-build .cfx-bd-case{padding:8px 16px !important;} ${W}-build .cfx-bd-case h3{font-size:19px !important;margin:2px 0 !important;} ${W}-build .cfx-bd-case p{font-size:16px !important;line-height:1.35 !important;}
${W}-build .cfx-bd{gap:8px !important;}
@media (max-height:900px){ ${W}-build .cfx-bd-steps em{display:none !important;} }   /* each step's why: on a large screen; a laptop shows the steps */
${W}-extra .cfx-ex-list button span{font-size:16px !important;} ${W}-extra .cfx-ex-list{gap:6px !important;margin-bottom:8px !important;} ${W}-extra .cfx-ex-list button{padding:6px 12px !important;font-size:17px !important;line-height:1.3 !important;}
${W}-extra .cfx-ex-lead{font-size:18px !important;margin-bottom:8px !important;line-height:1.4 !important;}
   /* on a laptop the case's strip is the Case Profile's (📇): the agenda keeps the day and its parts */

`;
document.head.appendChild(css);
})();
