/* 🟡 THE ORANGE BUTTONS GO GOLD, AS ON THE LSH TRAINING PORTAL
   Every button (and button-like link or pill) that was filled with the LSH orange now wears the Portal's gold: a light-to-deep
   gold gradient with LSH navy lettering, a lighter gold on hover, and a gold glow where it had an orange one. A navy button
   whose words were orange gets gold words. Only buttons change: orange borders, underlines, focus rings, headings, labels,
   badges, chips, card edges and the slides' own lettering stay as they were. A border that was simply the button's fill
   colour turns gold with it. "html body" (and !important where the original rule had it) outranks each original rule; the
   rules that keep a button navy (the deck's slide-nav, a pressed ▶ Play) are left to win. Design only: no content changes. */
(function(){
"use strict";
if(document.getElementById("cm-gold-buttons")) return;
const G = "linear-gradient(180deg,#fde7b0 0%,#f5c451 50%,#e0a43a 100%)";
const GH = "linear-gradient(180deg,#ffefc4 0%,#f7cf6a 50%,#e8b04a 100%)";
const INK = "#1E2340", EDGE = "#e0a43a", GLOW = "rgba(224,164,58,.55)";
const gold = (imp) => { const i = imp ? " !important" : ""; return `background:${G}${i};color:${INK}${i};`; };
const goldHover = (imp) => { const i = imp ? " !important" : ""; return `background:${GH}${i};color:${INK}${i};`; };
const st = document.createElement("style"); st.id = "cm-gold-buttons";
st.textContent = `
/* the primary button everywhere (index.html .btn-primary and its --g-accent gradient) */
html body .btn-primary{${gold()}box-shadow:0 10px 26px -14px ${GLOW};}
html body .btn-primary:hover{${goldHover()}}
/* the same button drawn with an inline orange style (cm-kc-rejected.js "Take it now", cm-restore-guard.js "Try again") */
html body .btn-primary[style*="#DB8437"]{${gold(1)}border-color:${EDGE} !important;}
html body .btn-primary[style*="#DB8437"]:hover{${goldHover(1)}}
/* the top bar: the page you are on */
html body .nav button.active{${gold()}}
/* dashboard: ▶ Continue where you left off */
html body .dash-resume-btn{${gold()}box-shadow:0 4px 12px ${GLOW};}
html body .dash-resume-btn:hover{${goldHover()}}
/* "a new version is ready" banner, the feedback button's hover, a voice call's lit control */
html body .update-banner button{${gold()}}
html body .update-banner button:hover{${goldHover()}}
html body .tfb-fab:hover{${goldHover()}}
html body .vc-btn.vc-on{${gold()}border-color:${EDGE};}
/* navy buttons whose words were orange: 👁 Switch View in the top bar, a dark Case Flow tool pill */
html body .nav .nav-viewswitch{color:#f5c451 !important;background:rgba(245,196,81,.16) !important;}
html body .nav .nav-viewswitch:hover{background:rgba(245,196,81,.28) !important;}
html body .cfx-tool{color:#f5c451;background:rgba(245,196,81,.14);}
html body .cfx-tool:hover,html body .cfx-tool:focus-visible,html body .cfx-sheet .cfx-tool:hover,html body .cfx-sheet .cfx-tool:focus-visible{${gold()}}
/* 🧰 Tools: a card's Open button lights up on hover; Skill Builders' New tab ↗ */
html body .tool-card:hover .tool-open-btn{${gold()}border-color:${EDGE};}
html body .cm-tf-newtab{${gold(1)}border-color:${EDGE} !important;}
html body .cm-tf-newtab:hover{${goldHover(1)}}
/* Case Flow: the trainer's ⚡ Inject (its pulse turns gold), the 📄 document link, the reference panel, ▶ Play, ↩ return */
html body .cfx-inject{${gold()}animation-name:cmGoldPulse;}
@keyframes cmGoldPulse{0%{box-shadow:0 0 0 0 ${GLOW};}70%{box-shadow:0 0 0 10px rgba(224,164,58,0);}100%{box-shadow:0 0 0 0 rgba(224,164,58,0);}}
@media(prefers-reduced-motion:reduce){ html body .cfx-inject{animation:none;} }
html body .cfx .cfx-docline-f{${gold()}}
html body .cfx .cfx-docline-f:hover{${goldHover()}}
html body .cfx-ref-open:hover,html body .cfx-ref-open:focus-visible{${gold()}border-color:${EDGE};}
html body .cfx-ref-x{${gold()}}
html body .cfx-th-more:hover,html body .cfx-th-more:focus-visible{${gold()}border-color:${EDGE};}
html body .cfx-side button.cfx-deliver em{${gold()}}
html body .vmp .vmp-play{${gold()}border-color:${EDGE};box-shadow:0 3px 10px ${GLOW};}
html body .vmp .vmp-play:not([aria-pressed=true]):hover,html body .vmp .vmp-play:not([aria-pressed=true]):focus-visible{${goldHover()}border-color:${EDGE};}
html body #cf-return-next{${gold()}box-shadow:0 6px 18px ${GLOW};}
html body #cf-return-next:hover{${goldHover()}}
html body .cfx-aud-go{${gold(1)}box-shadow:0 10px 22px -12px ${GLOW} !important;}
/* Skill Building: 🤖 Grade my work, ▶ Launch (hover), the voicemail's Transcribe, the companion case's grade button */
html body .aig .aig-go{${gold(1)}}
html body .aig .aig-go:hover:not([disabled]),html body .aig .aig-go:focus-visible{${goldHover(1)}}
html body .cfx-task1 .cfx-grade-go{${gold(1)}box-shadow:0 4px 12px ${GLOW} !important;}
html body .cfx-task1 .cfx-grade-go:hover,html body .cfx-task1 .cfx-grade-go:focus-visible{${goldHover(1)}}
html body .cfx-task1 .cfx-launch:hover,html body .cfx-task1 .cfx-launch:focus-visible{${gold(1)}}
html body .cfx-task .cfx-task-foot .vmt-go{${gold(1)}}
html body .cfx-task .cfx-task-foot .vmt-go:hover{${goldHover(1)}}
html body .cbg-ribbon .cbg-go{${gold()}border-color:${EDGE};}
html body .cbg-ribbon .cbg-go:hover,html body .cbg-ribbon .cbg-go:focus-visible{${goldHover()}border-color:${EDGE};}
html body .ctt-go{${gold()}}
html body .ctt-go:hover{${goldHover()}}
/* the navy "Open the Case Profile / Action Plan / side exercise" buttons keep navy, their orange sheen turns gold */
html body .cpx-s-go .cpx-s-btn::before,html body .cfx-ex-go .btn.btn-primary::before{background:linear-gradient(90deg,#f5c451 0%,#fde7b0 45%,#fff 100%);}
/* players: the Case Debrief's and the day video's controls light up gold on hover */
html body .cdb-x:hover,html body .cdb-x:focus-visible,html body button.cdb-ctl:not(:disabled):hover,html body button.cdb-ctl:not(:disabled):focus-visible{${gold()}border-color:${EDGE};}
html body .cm-dv-x:hover,html body .cm-dv-x:focus-visible,html body button.cm-dv-ctl:not(:disabled):hover,html body button.cm-dv-ctl:not(:disabled):focus-visible{${gold()}border-color:${EDGE};}
/* Admin: the audit table's top-bar button and its active filter, ✓ Resolved, ▶ Run now (open), a Drive link's hover */
html body .at-bar-top .btn-navy{${gold()}}
html body .at-bar-top .btn-navy:hover{${goldHover()}}
html body .at-chip.on{${gold()}border-color:${EDGE};}
html body .cma-ok{${gold(1)}border-color:${EDGE} !important;}
html body .cma-ok:hover{${goldHover(1)}}
html body .cmrn[open] > summary{${gold()}border-color:${EDGE};}
html body .drv-s-link:hover:not(:disabled){${gold()}border-color:${EDGE};}
@media print{ html body .btn-primary{background:${G};box-shadow:none;} }
`;
document.head.appendChild(st);
})();
