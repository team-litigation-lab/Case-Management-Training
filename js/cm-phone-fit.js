/* ============================================================
   📱 Phones: the safety net that keeps every page usable on a phone

   Each page and feature already has its own narrow-screen rules; these only catch what those miss, so every rule is
   wrapped in :where() (no specificity) and any page or feature rule still wins. Nothing here applies wider than 760px,
   so a laptop or a desktop looks exactly as it did.
     • text is never inflated by the phone's own font boost when it turns sideways;
     • pictures, video and embedded frames shrink to the screen instead of pushing the page wider than it;
     • a long unbroken word (an email address, a link, a file name, a case number) breaks rather than running off the edge;
     • a table wider than the screen scrolls sideways inside its own box: each one that overflows and has no scrolling
       box around it already is put into a .cm-pf-scroll one, including tables drawn later (the Case Flow, Admin, the
       sims), since the course's pages lock the window's own scrolling and a wide table would otherwise be out of reach.
   Loaded by index.html, case-doc.html, net-sheet.html and report.html.
   ============================================================ */
(function(){
"use strict";
if(typeof document === "undefined" || document.getElementById("cm-phone-fit")) return;
const css = document.createElement("style"); css.id = "cm-phone-fit";
css.textContent = `
html{-webkit-text-size-adjust:100%;text-size-adjust:100%;}
@media (max-width:760px){
  :where(body){overflow-wrap:break-word;}
  :where(img,video,iframe,embed,object,canvas,svg){max-width:100%;}
  :where(img,video){height:auto;}
  :where(pre){white-space:pre-wrap;}
  :where(input,select,textarea){max-width:100%;}
}
.cm-pf-scroll{max-width:100%;overflow-x:auto;-webkit-overflow-scrolling:touch;}
@media print{ .cm-pf-scroll{overflow:visible;} }
`;
(document.head || document.documentElement).appendChild(css);

const NARROW = window.matchMedia("(max-width:760px)");
function scrolls(el){
  for(let a = el.parentElement; a && a !== document.body; a = a.parentElement){
    const o = getComputedStyle(a).overflowX;
    if(o === "auto" || o === "scroll") return true;
  }
  return false;
}
function fit(){
  if(!NARROW.matches) return;
  document.querySelectorAll("table:not([data-cm-pf])").forEach(t => {
    const p = t.parentElement;
    if(!p || !t.offsetWidth) return;                       // hidden for now: looked at again when it shows
    if(t.matches("table.cdv-page")) return;                 // a case document's page (case-doc.html): its own phone rule
    t.setAttribute("data-cm-pf", "");
    if(t.offsetWidth <= p.clientWidth + 1 || scrolls(t)) return;
    const box = document.createElement("div");
    box.className = "cm-pf-scroll";
    p.insertBefore(box, t); box.appendChild(t);
  });
}
let queued = false;
const soon = () => { if(!queued){ queued = true; requestAnimationFrame(() => { queued = false; fit(); }); } };
function start(){
  fit();
  new MutationObserver(soon).observe(document.body, {childList: true, subtree: true});
  window.addEventListener("resize", soon);
}
if(document.body) start(); else document.addEventListener("DOMContentLoaded", start);
})();
