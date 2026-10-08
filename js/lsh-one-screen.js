/* ============================================================
   Every page fits one screen.

   The window never scrolls. The top bar and the footer line keep their place, and the page's
   body (<main>) takes exactly the height left between them. A page with more in it than fits
   — Case Documents, the Practice Lab, the Training Tools, a handout, the Facilitator Guide —
   scrolls inside that body, so the page itself is always one screen tall and the top bar and
   footer never move. The lesson pages don't scroll at all: the slide is sized to the room the
   page has left (fitSlideFrame in js/cm-updates.js), and the dashboard already fills the
   screen (js/lsh-dashboard.js).

   Only on a window with room for it (at least 1001 x 480): a phone and a tiny window keep the
   ordinary page scroll, the way the lesson slides already do under 1000px wide — there the top
   bar alone wraps to three rows, and a one-screen body would leave almost nothing for the page.

   Because the window no longer scrolls, window.scrollTo() and window.scrollY would silently
   do nothing — the page's code uses both to send a page back to the top and to keep an admin
   table's place across a redraw. They are pointed at the page body here, so every caller keeps
   working and nothing else in the app has to change.

   New in this course; the other LSH course repos don't have it yet. Copy this file (and the
   footer-line part of fitSlideFrame) into them to give them the same layout.
   Loaded last, after js/lsh-topbar.js.
   ============================================================ */
(function(){
const MIN_W = 1001, MIN_H = 480;   // under this the page scrolls as it always did

const st = document.createElement("style"); st.id = "lsh-one-screen"; st.textContent = `
body.one-screen{overflow:hidden;}
body.one-screen #app{height:100vh;height:100dvh;min-height:0;overflow:hidden;}
body.one-screen #app > .topbar, body.one-screen #app > .footer-note{flex:0 0 auto;}
body.one-screen #app > main{flex:1 1 auto;min-height:0;overflow-y:auto;overflow-x:hidden;
  overscroll-behavior:contain;scrollbar-gutter:stable;padding-bottom:18px;}
/* the footer line stays on the screen, so it is kept slim */
body.one-screen #app > .footer-note{padding:8px 24px 12px;}
`;
document.head.appendChild(st);

const on = ()=>document.body.classList.contains("one-screen");
const pageBody = ()=>document.querySelector("#app > main");
const apply = ()=>{ document.body.classList.toggle("one-screen", innerWidth >= MIN_W && innerHeight >= MIN_H); };
apply();
window.addEventListener("resize", apply);

/* The page body scrolls instead of the window, so the page's own scrollTo / scrollY work on it. */
const nativeScrollTo = window.scrollTo.bind(window);
window.scrollTo = function(a, b){
  const m = on() && pageBody();
  if(!m) return nativeScrollTo.apply(window, arguments);
  const o = (a && typeof a === "object") ? a : {top:Number(b) || 0, left:Number(a) || 0};
  try{ m.scrollTo({top:o.top || 0, left:o.left || 0, behavior:o.behavior || "auto"}); }
  catch(e){ m.scrollTop = o.top || 0; }
};
const native = Object.getOwnPropertyDescriptor(Window.prototype, "scrollY");
["scrollY", "pageYOffset"].forEach(k=>{
  try{
    Object.defineProperty(window, k, {configurable:true, get(){
      const m = on() && pageBody();
      return m ? m.scrollTop : (native && native.get ? native.get.call(window) : 0);
    }});
  }catch(e){}
});
})();
