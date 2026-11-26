/* ✨ THE LESSON DECKS, ELEVATED
   The Case Flow lesson decks take the look the LSH Training Portal's redesign gave its mainframes (LSH Academy Index, LSH Elev8,
   LSH Atlas): the blue-gold frame (a thick rounded outline, navy along the top fading to gold at the bottom), a deep-navy face
   with a soft warm glow, crisp white type without the cartoon outline, small uppercase mono tags, pill badges, soft elevation
   and dark-navy primary buttons with an orange underline.
   Design only: nothing here adds, removes or reorders a word, a picture or a slide. Sizes stay as they were (borders that grow
   are paid back in padding), so every slide still fits one screen (fit.cjs), and slide type stays bold and at least 16px.
   It reaches: the slide card (.cf-stage-card) and its title, progress bar, lesson ribbon and 📖 Reference button; the slide
   face (.cfx-sheet), the deck pictures, the rule numbers, the Why-it-matters line, the Red Flag, Plain-English and UPL boxes;
   the Previous / Next bar, the Step counter and its slide map, the side-by-side tools menu; full screen; and Presenter view's
   console and slides window. Doubled class names and `html body` outrank the older rules in cm-case-flow.js / cm-updates.js. */
(function(){
"use strict";
if(document.getElementById("cm-deck-elite")) return;
const FRAME = "linear-gradient(180deg,#1E2340 0%,#2c3360 30%,#a8692f 78%,#DB8437 100%)";
const FACE = ["radial-gradient(120% 75% at 100% 0%,rgba(219,132,55,.13) 0%,rgba(219,132,55,0) 55%)", "radial-gradient(90% 60% at 0% 100%,rgba(240,192,138,.07) 0%,rgba(240,192,138,0) 65%)",
  "linear-gradient(180deg,#262C57 0%,#1E2340 48%,#181C38 100%)"].map(l => l + " padding-box").join(",");
const NAVY_BTN = "linear-gradient(180deg,#2a3058 0%,#1E2340 100%)";
const st = document.createElement("style"); st.id = "cm-deck-elite";
st.textContent = `
/* ---- the slide card: the blue-gold frame around a deep-navy face (the 3px the frame adds is taken back from the padding) ---- */
html body .cf-stage-card.cf-stage-card{border:4px solid transparent !important;border-radius:22px !important;padding:13px 17px 11px !important;
  background:${FACE},${FRAME} border-box !important;
  backdrop-filter:none !important;-webkit-backdrop-filter:none !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.07),0 30px 60px -32px rgba(8,11,30,.8),0 8px 18px -12px rgba(8,11,30,.5) !important;}
html body .cf-stage-card.cf-stage-card::before, html body .cf-stage-card.cf-stage-card::after{display:none !important;}   /* the HUD corner brackets give way to the frame */

/* ---- the title: crisp white, no cartoon outline; a short orange-to-gold bar leads it ---- */
html body .cfx-deck .cfx-deck-title.cfx-deck-title{-webkit-text-stroke:0 !important;paint-order:normal !important;text-shadow:0 2px 18px rgba(0,0,0,.28) !important;letter-spacing:-.005em !important;color:#fff !important;padding-left:0 !important;}
html body .cfx-deck .cfx-deck-title.cfx-deck-title::before{content:"";display:inline-block;width:5px;height:.82em;margin:0 12px 0 2px;vertical-align:-.06em;border-radius:3px;background:linear-gradient(180deg,#F0C08A 0%,#DB8437 100%);box-shadow:0 0 12px rgba(219,132,55,.55);}

/* ---- the progress bar: a hairline track, an orange-to-gold fill that glows ---- */
html body .cf-stage-card .slide-dots.cf-dots-bar{background:rgba(255,255,255,.1) !important;box-shadow:inset 0 0 0 1px rgba(255,255,255,.04);}
html body .cf-stage-card .slide-dots.cf-dots-bar .cf-dots-fill{background:linear-gradient(90deg,#DB8437 0%,#F0C08A 100%) !important;border-radius:999px !important;box-shadow:0 0 10px rgba(219,132,55,.6);}

/* ---- the lesson ribbon: glass on navy, a fading orange-gold underline; the kind of slide is a mono tag pill ---- */
html body .cfx-deck > .cfx-ribbon > span{border:1px solid rgba(255,255,255,.1) !important;border-bottom:3px solid transparent !important;border-radius:12px !important;
  background:linear-gradient(90deg,rgba(219,132,55,0) 0%,#DB8437 18%,#F0C08A 50%,#DB8437 82%,rgba(219,132,55,0) 100%) left bottom / 100% 3px no-repeat border-box,
    linear-gradient(180deg,rgba(255,255,255,.09) 0%,rgba(255,255,255,.035) 100%) !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 10px 22px -16px rgba(0,0,0,.7) !important;}
html body .cfx-deck .cfx-what-k.cfx-what-k{font-family:'IBM Plex Mono',ui-monospace,monospace !important;font-weight:700 !important;font-size:16px !important;letter-spacing:.1em !important;
  color:#F6C590 !important;background:rgba(219,132,55,.14) !important;border:1px solid rgba(240,192,138,.55);border-radius:999px;padding:1px 12px !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.06);}
html body .cfx-deck .cfx-what-v.cfx-what-v{letter-spacing:.01em !important;}
html body .cfx-ref-open.cfx-ref-open{border:1px solid rgba(240,192,138,.5) !important;border-radius:12px !important;background:${NAVY_BTN} !important;color:#fff !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -2px 0 #DB8437,0 8px 16px -10px rgba(0,0,0,.7) !important;padding:0 15px !important;}
html body .cfx-ref-open.cfx-ref-open:hover, html body .cfx-ref-open.cfx-ref-open:focus-visible{background:linear-gradient(180deg,#343b6b 0%,#262c52 100%) !important;color:#fff !important;outline:2px solid #DB8437;outline-offset:1px;}

/* ---- the slide face: a clean white sheet with soft elevation; a deck picture sits on a cool light stage in a crisp frame ---- */
html body .cf-stage-card .cfx-sheet{border-radius:16px !important;border-color:rgba(255,255,255,.75) !important;
  box-shadow:inset 0 1px 0 #fff,0 22px 40px -26px rgba(0,0,0,.75),0 4px 12px -8px rgba(0,0,0,.4) !important;}
html body .cf-stage-card .cfx-sheet:has(> .cfx-deckpage){background:radial-gradient(80% 70% at 50% 0%,#FFFFFF 0%,#F4F5FA 70%,#ECEEF5 100%) !important;}
html body .cf-stage-card .cfx-deckpage img{border-radius:12px !important;
  box-shadow:0 0 0 1px rgba(30,35,64,.12),0 24px 44px -26px rgba(30,35,64,.6),0 6px 14px -8px rgba(30,35,64,.3) !important;}

/* ---- the slide's own pieces: the rule numbers, the Why-it-matters line, the Red Flag, Plain English and UPL boxes ---- */
html body .cf-stage-card .cfx ol.cfx-points > li::before{background:linear-gradient(145deg,#EFA868 0%,#DB8437 55%,#C46F27 100%) !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.35),0 0 0 3px rgba(219,132,55,.16),0 6px 12px -6px rgba(164,71,15,.6) !important;}
html body .cf-stage-card .cfx .cfx-whyline{background:linear-gradient(135deg,#2A3160 0%,#1E2340 60%,#191D3A 100%) !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.08),0 12px 24px -16px rgba(30,35,64,.8) !important;}
html body .cf-stage-card .cfx .cfx-whyline-k{background:linear-gradient(135deg,#F0B479 0%,#DB8437 100%) !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.35);}
html body .cf-stage-card .cfx .cfx-rf{box-shadow:0 12px 24px -18px rgba(179,38,30,.6) !important;}
html body .cf-stage-card .cfx .cfx-plain, html body .cf-stage-card .cfx .cfx-upl{box-shadow:0 10px 20px -18px rgba(30,35,64,.55) !important;}

/* ---- the Previous / Next bar: frosted white, soft elevation; Next is the dark-navy primary button with an orange underline ---- */
html body .lesson-stage > .cf-stage-card ~ .slide-nav{background:linear-gradient(180deg,rgba(255,255,255,.94) 0%,rgba(247,248,252,.9) 100%) !important;border:1px solid rgba(30,35,64,.1) !important;border-radius:16px !important;
  box-shadow:inset 0 1px 0 #fff,0 16px 30px -22px rgba(30,35,64,.55),0 3px 8px -6px rgba(30,35,64,.25) !important;backdrop-filter:blur(10px);}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .btn{border-radius:11px !important;}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .btn-ghost{background:#fff !important;border:1px solid rgba(30,35,64,.16) !important;box-shadow:0 1px 0 rgba(30,35,64,.04),0 6px 12px -10px rgba(30,35,64,.45);}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .btn-ghost:hover:not(:disabled){border-color:#DB8437 !important;}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .btn-primary, html body .lesson-stage > .cf-stage-card ~ .slide-nav .btn-navy{background:${NAVY_BTN} !important;color:#fff !important;border:0 !important;
  box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -2px 0 #DB8437,0 8px 16px -10px rgba(30,35,64,.85) !important;}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .btn-primary:hover, html body .lesson-stage > .cf-stage-card ~ .slide-nav .btn-navy:hover{background:linear-gradient(180deg,#343b6b 0%,#262c52 100%) !important;}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .slide-counter.sm-counter{border-radius:999px !important;background:#F1F3F8 !important;border:1px solid rgba(30,35,64,.12) !important;font-family:'IBM Plex Mono',ui-monospace,monospace !important;font-weight:700 !important;letter-spacing:.02em;}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .nav-nextup{background:${NAVY_BTN} !important;border-radius:12px !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 8px 16px -12px rgba(30,35,64,.8) !important;}
html body .lesson-stage > .cf-stage-card ~ .slide-nav .nav-nextup > b{font-family:'IBM Plex Mono',ui-monospace,monospace !important;letter-spacing:.12em !important;color:#F0C08A !important;}

/* ---- the slide map behind the Step counter, and the side-by-side tools menu: the same frame, pills and soft lift ---- */
html body .sm-modal{background:rgba(12,16,36,.6) !important;backdrop-filter:blur(4px);}
html body .sm-modal .sm-box{border:4px solid transparent !important;border-radius:20px !important;background:linear-gradient(#fff,#fff) padding-box,${FRAME} border-box !important;box-shadow:0 30px 70px -30px rgba(8,11,30,.75) !important;}
html body .sm-modal .sm-item{border-radius:999px !important;}
html body .sm-modal .sm-item.on{background:#1E2340 !important;color:#fff !important;box-shadow:inset 0 -2px 0 #DB8437;}
html body .sm-modal .sm-sub{font-family:'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.04em;}
html body .cfx-task1 .cfx-tools-menu > summary{border-radius:12px !important;box-shadow:0 6px 14px -10px rgba(30,35,64,.6);}
html body .cfx-task1 .cfx-tools-menu[open] > summary{background:${NAVY_BTN} !important;box-shadow:inset 0 -2px 0 #DB8437,0 6px 14px -10px rgba(30,35,64,.6);}
html body .cfx-task1 .cfx-tools-pop{border-radius:16px !important;box-shadow:0 24px 48px -24px rgba(8,11,30,.6) !important;}

/* ---- full screen: the card on a deep navy stage with a warm glow ---- */
html body .lesson-stage:fullscreen:has(> .cf-stage-card){background:radial-gradient(70% 60% at 85% 0%,rgba(219,132,55,.14) 0%,rgba(219,132,55,0) 60%),linear-gradient(180deg,#1E2340 0%,#141833 100%) !important;}

/* ---- Presenter view: the console wears the frame; the slide mirror sits in a gold hairline; the slides window has no empty bar ---- */
html body .pv{border:4px solid transparent !important;background:radial-gradient(90% 60% at 100% 0%,rgba(219,132,55,.12) 0%,rgba(219,132,55,0) 60%) padding-box,linear-gradient(135deg,#262C57 0%,#1E2340 55%,#181C38 100%) padding-box,${FRAME} border-box !important;
  border-radius:22px !important;padding:9px 13px 11px !important;box-shadow:0 30px 60px -34px rgba(8,11,30,.8) !important;}
html body .pv .pv-title b, html body .pv .pv-label{font-family:'IBM Plex Mono',ui-monospace,monospace;letter-spacing:.08em;}
html body .pv .pv-mirror{border-radius:14px !important;box-shadow:0 0 0 1px rgba(240,192,138,.6),0 18px 36px -22px rgba(0,0,0,.8) !important;}
html body .pv .pv-cues{border-radius:16px !important;box-shadow:inset 0 1px 0 #fff,0 18px 36px -24px rgba(0,0,0,.7);}
html body .pv .pv-nav .btn-primary{background:${NAVY_BTN} !important;color:#fff !important;box-shadow:inset 0 1px 0 rgba(255,255,255,.12),inset 0 -2px 0 #DB8437 !important;border:1px solid rgba(240,192,138,.35) !important;}
html body.audience-mode{background:linear-gradient(180deg,#1E2340 0%,#141833 100%) !important;}
html body #audienceRoot .lesson-stage > .cf-stage-card ~ .slide-nav{background:transparent !important;border-color:transparent !important;box-shadow:none !important;backdrop-filter:none;}
html body #audienceRoot .lesson-stage > .cf-stage-card ~ .slide-nav .slide-counter.sm-counter{background:rgba(255,255,255,.08) !important;border-color:rgba(255,255,255,.14) !important;color:#E6E8F2 !important;}

/* ---- a phone: a thinner frame ---- */
@media (max-width:560px){
  html body .cf-stage-card.cf-stage-card{border-width:3px !important;padding:14px 18px 12px !important;}
  html body .pv{border-width:3px !important;}
}
`;
document.head.appendChild(st);
})();
