/* How a Case Flow slide uses its card (js/cm-case-flow.js draws the slide; js/cm-updates.js fits it to the screen:
   fitSlideZoom scales a slide that is too long for one screen down. This file wraps it, and never scales anything down).
   · 🔎 A See It visual (a table, a comparison, a process, three boxes) and a log on Your Case fill the width of the
     card, and their type is as large as fits at full size: fitType tries 24px down to 16px (the card's --see), bold,
     long cells wrapping; never under 16px.
   · ↕ A slide whose content does not fill its card is enlarged until it does (grow, once the slide fits at full
     size): bigger type before empty space, on a laptop and on a large screen. What is left over is shared above and
     under the content, so a short slide sits in the middle of its card, never at the top with a blank band under it. */
(function(){
  "use strict";
  const SEE_MAX = 24, SEE_MIN = 16, STEP = 0.05;
  /* The most a slide is enlarged: 1.3 on a laptop (1366x768), and as much more as the window is larger than that. */
  const growCap = () => Math.min(2.2, 1.3 * Math.max(1, Math.min(window.innerHeight / 768, window.innerWidth / 1366)));
  /* box: the slide's card (.cfx-sheet, or the navy body of Your Case). Returns a test that is true when something
     is cut off or squeezed: the card itself, or any box inside it whose content no longer fits it (a concept card
     whose text eats its padding or runs out of it, a strip that scrolls), or the 💡 Why it matters line taking a
     second line. What already
     ran over before anything was changed (by design: a badge hung on a corner) is allowed the same, no more. */
  const cutter = box => {
    const zoom = () => Number(box.firstElementChild && box.firstElementChild.style.zoom) || 1;
    const all = [box, ...box.querySelectorAll("*")].filter(e => e.clientHeight > 0 && e.getClientRects().length), css = all.map(e => getComputedStyle(e));
    const boxes = all.filter((e, k) => css[k].display.indexOf("table") !== 0);
    const was = boxes.map(e => [Math.max(0, e.scrollHeight - e.clientHeight), Math.max(0, e.scrollWidth - e.clientWidth)]);
    was[0] = [0, 0];   // the card itself may never run over
    const lines = [...box.querySelectorAll(".cfx-whyline")].map(e => [e, e.clientHeight]);
    // a box that lays its content out itself (flex, grid): centred content that outgrows it eats its padding before it runs over
    const inset = f => { const r = f.e.getBoundingClientRect(), z = zoom(); let t = 1e9, b = -1e9;
      for(const k of f.e.children){ const q = k.getBoundingClientRect(); if(!q.height) continue; t = Math.min(t, q.top); b = Math.max(b, q.bottom); }
      return t > b ? [0, 0] : [Math.min(0, (t - r.top) / z - f.pt), Math.min(0, (r.bottom - b) / z - f.pb)]; };
    const flex = all.map((e, k) => ({e, c: css[k]})).filter(x => x.e !== box && x.e.children.length && /flex|grid/.test(x.c.display))
      .map(x => ({e: x.e, pt: parseFloat(x.c.paddingTop) + parseFloat(x.c.borderTopWidth), pb: parseFloat(x.c.paddingBottom) + parseFloat(x.c.borderBottomWidth)}));
    flex.forEach(f => { f.was = inset(f); });
    return () => boxes.some((e, k) => e.scrollHeight - e.clientHeight > was[k][0] + 2 || e.scrollWidth - e.clientWidth > was[k][1] + 2)
      || lines.some(([e, h]) => e.clientHeight > h + 2)
      || flex.some(f => { const now = inset(f); return now[0] < f.was[0] - 1.5 || now[1] < f.was[1] - 1.5; });
  };
  function fitType(box){
    box.style.removeProperty("--see");
    if(!box.querySelector(".cfx-model, .cfx-sb-docs .cfx-log")) return;
    [...box.children].forEach(n => { n.style.zoom = ""; });
    // a table whose first column is short labels keeps them on one line; a first column of sentences wraps like the rest
    box.querySelectorAll(".cfx-model table").forEach(t => t.classList.toggle("see-labels", [...t.querySelectorAll("tbody td:first-child")].every(td => td.textContent.trim().length <= 30)));
    box.style.setProperty("--see", SEE_MIN + "px");
    const cut = cutter(box);   // measured at the smallest size: what runs over there runs over by design
    for(let px = SEE_MAX; px > SEE_MIN; px--){ box.style.setProperty("--see", px + "px"); if(!cut()) return; }
    box.style.setProperty("--see", SEE_MIN + "px");
  }
  function grow(box, inner){
    const cut = cutter(box);
    const cap = growCap(); let z = 1;
    while(z + STEP <= cap + 1e-6){
      const n = Math.round((z + STEP) * 100) / 100;
      inner.forEach(x => { x.style.zoom = String(n); });
      if(cut()){ inner.forEach(x => { x.style.zoom = z === 1 ? "" : String(z); }); break; }
      z = n;
    }
    return z;
  }
  const __fit = window.fitSlideZoom;
  if(typeof __fit === "function") window.fitSlideZoom = function(wrap){
    const body = wrap && wrap.isConnected && window.innerWidth > 760 ? wrap.querySelector(".cfx-deck > .cfx-body") : null;
    const box = body && (body.querySelector(":scope > .cfx-sheet") || body);
    if(box) try{ fitType(box); }catch(e){}
    const r = __fit.apply(this, arguments);
    if(box && wrap.isConnected) try{
      const inner = [...box.children];
      if(inner.length && box.style.overflowY !== "auto" && !inner.some(n => n.style.zoom)) grow(box, inner);
    }catch(e){}
    return r;
  };

  if(document.getElementById("cf-slide-layout-css")) return;
  const st = document.createElement("style"); st.id = "cf-slide-layout-css";
  st.textContent = `
/* One title: the lesson's or activity's own numbered title, never cut with an ellipsis (a long one is a size smaller
   and wraps); the band under it says what this slide is, with "Lesson" or "Practice Lab" as its label */
.lesson-stage .cfx-deck-title{white-space:normal !important;overflow:visible !important;text-overflow:clip !important;line-height:1.2 !important;text-wrap:balance;}
.lesson-stage .cfx-deck-title.cfx-t-long{font-size:clamp(17px,1.45vw,23px) !important;-webkit-text-stroke-width:3px;}
@media (min-width:1000px) and (max-height:900px){ .lesson-stage .cfx-deck-head{margin-bottom:3px !important;} }   /* the title's taller line costs the card nothing */
.lesson-stage .cfx-ribbon > span{white-space:normal !important;overflow:visible !important;text-overflow:clip !important;}
.cfx-deck > .cfx-ribbon.cfx-what > span{display:flex !important;align-items:center;justify-content:center;gap:12px;text-transform:none !important;letter-spacing:0 !important;padding-top:3px !important;padding-bottom:3px !important;}
.cfx-what-k{font:800 16px/1.2 'Inter',sans-serif;font-style:normal;text-transform:uppercase;letter-spacing:.08em;background:#DB8437;color:#1E2340;border-radius:999px;padding:2px 12px;white-space:nowrap;}
.cfx-what-v{font:800 clamp(18px,1.45vw,22px)/1.2 'Poppins','Inter',sans-serif;color:#fff;letter-spacing:.02em;}
/* "Next up" gives the same title on two lines beside its label (it was cut after one), in the room the bar already has */
#lessonStage > .slide-nav .nav-nextup{flex-direction:row;align-items:center;gap:10px;padding:3px 12px;}
#lessonStage > .slide-nav .nav-nextup b{flex:0 0 auto;}
#lessonStage > .slide-nav .nav-nextup span{white-space:normal;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;font-size:13px;line-height:1.18;}
/* ↕ in the middle: Your Case (the navy body) and See It sit in the middle of the card like every other slide */
@media (min-width:761px){
  .lesson-stage .cfx-body.cfx-body-navy > :first-child{margin-top:auto;}
  .lesson-stage .cfx-body.cfx-body-navy > :last-child{margin-bottom:auto;}
  .lesson-stage .cfx .cfx-sheet > .cfx-model{flex:0 1 auto !important;}
}
/* Your Case: a document's name under its thumbnail is read in full (no two-line cut-off), bold */
.cfx-sb-docs .cfx-thumb span{display:block;-webkit-line-clamp:unset;overflow:visible;font:700 16px/1.25 'Inter',sans-serif;color:#fff;}
/* 🔎 See It: the visual takes the card's width; its type is the card's --see (24px down to 16px, whatever fits), bold */
.cfx .cfx-model{width:100%;}
.cfx .cfx-model .mini-table-wrap{overflow:visible !important;margin-top:0 !important;}
.cfx .cfx-model table.mini-table{width:100% !important;min-width:0 !important;}
.cfx .cfx-model th{font-size:max(16px,calc(var(--see,20px) * .8)) !important;font-weight:800 !important;line-height:1.2 !important;padding:.5em .8em !important;}
.cfx .cfx-model td,.cfx-model tbody td{font-size:var(--see,20px) !important;font-weight:700 !important;line-height:1.28 !important;padding:.42em .65em !important;overflow-wrap:break-word;}
.cfx .cfx-model tbody td:first-child{white-space:normal !important;font-weight:800 !important;}
.cfx .cfx-model table.see-labels tbody td:first-child{white-space:nowrap !important;}
.cfx .cfx-model .lesson-compare{grid-template-columns:repeat(2,minmax(0,1fr)) !important;gap:16px !important;}
.cfx .cfx-model .lesson-compare .chead{font-size:calc(var(--see,20px) * 1.12) !important;font-weight:800 !important;line-height:1.2;padding:.45em .8em !important;}
.cfx .cfx-model .lesson-compare .cbody{padding:.7em 1em !important;}
.cfx .cfx-model .lesson-compare .citem{font:700 var(--see,20px)/1.3 var(--font-ui) !important;color:#141A2E !important;padding-left:1.3em !important;margin-bottom:.45em !important;}
.cfx .cfx-model .lesson-compare .citem:last-child{margin-bottom:0 !important;}
.cfx .cfx-model .lesson-compare .citem::before{top:.42em !important;width:.55em !important;height:.55em !important;}
.cfx .cfx-model .lesson-process{margin:0 !important;}
.cfx .cfx-model .lesson-process:has(> .pstep:nth-of-type(5)){display:flex !important;flex-wrap:wrap !important;justify-content:center;gap:12px !important;}
.cfx .cfx-model .lesson-process:has(> .pstep:nth-of-type(5)) .pstep{flex:0 1 calc((100% - 24px) / 3) !important;}
.cfx .cfx-model .lesson-process .pstep{min-height:0 !important;padding:.8em .8em .9em !important;font-size:var(--see,20px);}
.cfx .cfx-model .lesson-process .plabel,.cfx .cfx-model .lesson-threebox .tlabel,.cfx .cfx-model .lesson-compare .chead{font-family:'Poppins','Inter',sans-serif !important;}
.cfx .cfx-model .lesson-process .plabel{font-size:calc(var(--see,20px) * 1.15) !important;font-weight:800 !important;line-height:1.2 !important;margin:.5em 0 .4em !important;}
.cfx .cfx-model .lesson-process .pdesc{font-size:var(--see,20px) !important;font-weight:700 !important;line-height:1.3 !important;color:#fff !important;}
.cfx .cfx-model .lesson-threebox{margin:0 !important;grid-template-columns:repeat(auto-fit,minmax(0,1fr)) !important;grid-auto-flow:column;}
.cfx .cfx-model .lesson-threebox .tbox{padding:.9em 1em 1em !important;font-size:var(--see,20px);}
.cfx .cfx-model .lesson-threebox .tlabel{font-size:calc(var(--see,20px) * 1.2) !important;font-weight:800 !important;}
.cfx .cfx-model .lesson-threebox .tdesc{font-size:var(--see,20px) !important;font-weight:700 !important;line-height:1.32 !important;}
/* The Framework's table: its headings 16px, its cells bold */
.cfx .cfx-fw-tbl thead th{font-size:16px !important;}
.cfx .cfx-fw-tbl td{font-weight:700 !important;}
/* 🗂 a log on Your Case (the Communications Log): the width of its card, the same type, its note in bold */
.cfx-sb-docs .cfx-log .cfx-log-h{font:800 max(16px,calc(var(--see,18px) * .9))/1.25 'Inter',sans-serif;padding:.35em .8em;}
.cfx-sb-docs .cfx-log .cfx-log-scroll{overflow:visible;}
.cfx-sb-docs .cfx-log table{width:100%;font:700 var(--see,18px)/1.25 'Inter',sans-serif;color:#141A2E;}
.cfx-sb-docs .cfx-log th{font:800 16px/1.2 'Inter',sans-serif;letter-spacing:.04em;color:#3A4256;padding:.3em .4em;}
.cfx-sb-docs .cfx-log td{font-size:var(--see,18px);font-weight:700;padding:.22em .4em;}
.cfx-sb-grid:has(.cfx-sb-docs .cfx-log){grid-template-columns:minmax(0,.6fr) minmax(0,1.75fr);gap:12px;}
.cfx-sb-docs .cfx-log .cfx-log-mono{font-family:'Inter',sans-serif;font-size:var(--see,18px);font-weight:800;white-space:nowrap;}
.cfx-sb-docs .cfx-log tr.cfx-log-esc td{font-weight:800;}
.cfx-sb-docs .cfx-log .cfx-log-note{font:700 max(16px,calc(var(--see,18px) * .9))/1.3 'Inter',sans-serif;color:#1E2340;padding:.4em .8em .5em;}
.cfx-sb-grid:has(.cfx-sb-docs .cfx-log) .cfx-sb-docs{padding-top:0;display:flex;flex-direction:column;justify-content:center;}
.cfx-sb-grid:has(.cfx-sb-docs .cfx-log) .cfx-sb-main > :first-child{margin-top:0;}
.cfx-sb-grid:has(.cfx-sb-docs .cfx-log) .cfx-sb-main{justify-content:center;}`;
  document.head.appendChild(st);
})();
