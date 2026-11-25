/* 🔠 THE KNOWLEDGE CHECK GAMES FILL THE SCREEN
   The five Case Flow quiz games (js/cm-case-flow.js: 💼 Who Wants to Be a Case Manager?, 🟦 Jeopardy, 💣 Countdown Bomb,
   🎡 Wheel of Fortune, 🚪 Mystery Doors) were drawn at one fixed size, so on a laptop the question and its four answers sat
   in the top half of the window with empty space below, and on a large monitor they looked small. On a desktop-sized window
   (761px and wider) the Knowledge Check page uses the window's full width (not the page's 1400px column), and everything
   in the game grows with the window's height and width: the question, the A–D answers
   and their letters, the lifelines, the career ladder, the Jeopardy board, the wheel and the doors. Every size is a clamp(),
   so the smallest is the size it was before; it never gets smaller. Phones keep the layout cm-case-flow.js gives them.
   Only CSS: nothing about how a game plays, scores or saves changes. */
(function(){
"use strict";
if(document.getElementById("cm-kc-big")) return;
const css = document.createElement("style"); css.id = "cm-kc-big";
css.textContent = `
@media (min-width:761px){
  /* the page's 1400px column would leave empty bands either side on a wide monitor: the Knowledge Check uses the window's width */
  body.cf-kc-page main{max-width:none;padding-left:clamp(20px,2.2vw,48px);padding-right:clamp(20px,2.2vw,48px);}
  .cfg-title b{font-size:clamp(24px,calc(1.2vw + 1.6vh),48px);}
  .cfg-sound{width:clamp(34px,4.6vh,46px);height:clamp(34px,4.6vh,46px);font-size:clamp(16px,2.2vh,22px);}
  .cfg-hint{font-size:clamp(14px,1.9vh,19px);}
  .cfg-card{padding:clamp(20px,3.4vh,56px) clamp(24px,2.4vw,64px) !important;}
  .cfg-q{font-size:clamp(20px,calc(.9vw + 1.9vh),50px);margin-bottom:clamp(14px,2.6vh,40px);}
  .cfg-opts{gap:clamp(10px,2vh,30px);}
  .cfg-opt{font-size:clamp(15px,calc(.55vw + 1.45vh),36px);padding:clamp(12px,2.3vh,36px) clamp(14px,1.5vw,40px);min-height:clamp(56px,10.5vh,200px);gap:clamp(12px,1.2vw,20px);border-radius:clamp(12px,1.6vh,18px);}
  .cfg-letter{width:clamp(30px,4.6vh,70px);height:clamp(30px,4.6vh,70px);font-size:clamp(14px,2.2vh,32px);border-radius:clamp(8px,1.1vh,12px);}
  .cfg-mark{font-size:clamp(20px,3vh,32px);}
  .cfg-say{font-size:clamp(15px,2vh,28px);margin-top:clamp(12px,2vh,22px);}
  .cfg-life{gap:clamp(8px,1.2vh,14px);margin-bottom:clamp(10px,1.8vh,20px);}
  .cfg-life button,.cfg-friend{font-size:clamp(12.5px,1.75vh,24px);padding:clamp(5px,.9vh,10px) clamp(12px,1.1vw,18px);}
  .cfg-clock{font-size:clamp(14px,2.1vh,22px);}
  .cfg-aud{width:clamp(90px,8vw,140px);height:clamp(16px,2.2vh,22px);}
  .cfg-hintbox,.cfg-earn{font-size:clamp(14px,1.9vh,19px);}
  .cfg-prize{font-size:clamp(13.5px,1.8vh,18px);padding:clamp(5px,.8vh,9px) clamp(14px,1.2vw,20px);}
  /* 💼 the career ladder beside the question */
  .cfg-split{grid-template-columns:minmax(0,1fr) clamp(210px,15vw,380px);gap:clamp(14px,1.4vw,24px);}
  .cfg-ranks{padding:clamp(10px,1.6vh,18px) clamp(10px,1vw,16px);}
  .cfg-ranks>b{font-size:clamp(12px,1.6vh,16px);margin-bottom:clamp(6px,1vh,12px);}
  .cfg-ranks>small{font-size:clamp(11px,1.5vh,15px);}
  .cfg-ladder{gap:clamp(3px,.6vh,8px);}
  .cfg-ladder li{font-size:clamp(12.5px,1.8vh,24px);padding:clamp(5px,1vh,11px) clamp(8px,.8vw,12px);}
  /* 🟦 the Jeopardy board */
  .cfg-jb{gap:clamp(5px,.8vh,9px);padding:clamp(6px,1vh,12px);}
  .cfg-jh{font-size:clamp(13px,1.7vh,24px);min-height:clamp(34px,7vh,100px);}
  .cfg-jc{font-size:clamp(18px,3.4vh,48px);padding:clamp(6px,1.8vh,20px) 4px;}
  .cfg-jc.ok,.cfg-jc.no{font-size:clamp(15px,2.6vh,28px);}
  /* 🎡 the wheel (its labels sit 18px inside the rim, as before) */
  .cfg-wheel{--wh:clamp(260px,40vh,600px);width:var(--wh);height:var(--wh);}
  .cfg-wheel span b{top:calc(var(--wh) / -2 + 18px);font-size:clamp(17px,2.4vh,24px);}
  .cfg-hub{width:clamp(54px,8vh,80px);height:clamp(54px,8vh,80px);font-size:clamp(24px,3.6vh,36px);}
  .cfg-pointer{font-size:clamp(26px,3.8vh,40px);}
  /* 🚪 the doors */
  .cfg-doors{max-width:clamp(620px,62vw,980px);gap:clamp(16px,2vw,30px);}
  .cfg-door{height:clamp(200px,40vh,560px);}
  .cfg-door-panel{font-size:clamp(54px,8vh,90px);}
  .cfg-door-panel b{font-size:clamp(26px,3.6vh,38px);}
  .cfg-door-prize{font-size:clamp(30px,4.2vh,44px);}
  /* the end-of-round summary */
  .cfg-clear-h{font-size:clamp(26px,3.6vh,38px);}
  .cfg-tally{font-size:clamp(15px,2vh,20px);}.cfg-tally b{font-size:clamp(24px,3.4vh,34px);}
}`;
document.head.appendChild(css);
})();
