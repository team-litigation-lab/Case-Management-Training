/* ============================================================
   🧭 Work here: the CMS and the trainee's Drive folder, one press away on every Skill Building slide

   A Skill Building activity is done in the CMS (John Doe's case) and filed in the trainee's own Backup Drive, so
   while one of its slides is up a small movable card floats over the page with both:
     • 🗂 Open the CMS: beside the slide (the course's tool frame, js/cm-skillbuilders.js openTool "split"), or ↗ in
       a tab, signed in (js/lsh-tool-links.js).
     • 📂 My Drive folder: the trainee's Backup Drive folder (js/cm-drive.js: rootUrl) in a tab (Google Drive can't
       be framed). Not linked yet: 🔗 Link my Drive opens the Backup Drive panel. A trainer gets Google Drive itself.
   The card is dragged by its handle anywhere on the screen, folds to a small pill (–), and keeps where it was put
   and whether it was folded (this browser only: localStorage). Never on the slides window a presenter shares.
   ============================================================ */
(function(){
"use strict";
if(typeof document === "undefined") return;
const POS = "cm-sb-dock-pos", MIN = "cm-sb-dock-min";
const ls = {get(k){ try{ return localStorage.getItem(k); }catch(e){ return null; } }, set(k, v){ try{ localStorage.setItem(k, v); }catch(e){} }};
const esc = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const audience = () => typeof PV_IS_AUDIENCE !== "undefined" && PV_IS_AUDIENCE;
const trainee = () => typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;
const onSkillBuilding = () => !!document.querySelector("#app .cfx-activity");

let dock = null, asked = false;

function drive(){ return window.CMDrive && typeof CMDrive.status === "function" ? CMDrive.status() : null; }
function driveBtn(){
  const D = drive();
  if(!trainee()) return `<a class="sbd-btn sbd-drive" href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener noreferrer">📂 Google Drive ↗</a>`;
  if(D && /^https:\/\//.test(D.rootUrl || "")) return `<a class="sbd-btn sbd-drive" href="${esc(D.rootUrl)}" target="_blank" rel="noopener noreferrer" title="Your Backup Drive folder${D.email ? `: ${esc(D.email)}` : ""}">📂 My Drive folder ↗</a>`;
  if(D && D.configured === false) return `<a class="sbd-btn sbd-drive" href="https://drive.google.com/drive/my-drive" target="_blank" rel="noopener noreferrer">📂 Google Drive ↗</a>`;
  return `<button type="button" class="sbd-btn sbd-drive" onclick="CMSbDock.drive()">🔗 Link my Drive</button>`;
}
function paint(){
  if(!dock) return;
  const min = ls.get(MIN) === "1";
  dock.classList.toggle("sbd-min", min);
  dock.innerHTML = min
    ? `<div class="sbd-grip" title="Drag to move">⠿</div><button type="button" class="sbd-pill" onclick="CMSbDock.fold(false)" title="Show the CMS and Drive links">🗂 CMS · 📂 Drive</button>`
    : `<div class="sbd-head"><span class="sbd-grip" title="Drag to move">⠿ Work here</span><button type="button" class="sbd-x" onclick="CMSbDock.fold(true)" title="Fold" aria-label="Fold">–</button></div>
       <div class="sbd-row"><button type="button" class="sbd-btn sbd-cms" onclick="CMSbDock.cms('split')" title="The CMS beside this slide">🗂 Open the CMS</button><button type="button" class="sbd-btn sbd-tab" onclick="CMSbDock.cms('tab')" title="The CMS in a new tab" aria-label="The CMS in a new tab">↗</button></div>
       <div class="sbd-row">${driveBtn()}</div>`;
}
function place(x, y){
  const r = dock.getBoundingClientRect(), W = window.innerWidth, H = window.innerHeight;
  x = Math.min(Math.max(4, x), Math.max(4, W - r.width - 4));
  y = Math.min(Math.max(4, y), Math.max(4, H - r.height - 4));
  dock.style.left = x + "px"; dock.style.top = y + "px"; dock.style.right = "auto"; dock.style.bottom = "auto";
  return [x, y];
}
function restore(){
  let p = null; try{ p = JSON.parse(ls.get(POS) || "null"); }catch(e){}
  if(p && isFinite(p[0]) && isFinite(p[1])) place(p[0], p[1]);
  else { dock.style.left = "auto"; dock.style.top = "auto"; dock.style.right = "18px"; dock.style.bottom = "96px"; }
}
function ensure(){
  if(dock) return dock;
  dock = document.createElement("div");
  dock.id = "cm-sb-dock"; dock.setAttribute("role", "region"); dock.setAttribute("aria-label", "CMS and Drive links");
  dock.hidden = true;
  document.body.appendChild(dock);
  dock.addEventListener("pointerdown", e => {
    if(!e.target.closest(".sbd-grip, .sbd-head") || e.target.closest("button:not(.sbd-pill), a")) return;
    e.preventDefault();
    const r = dock.getBoundingClientRect(), dx = e.clientX - r.left, dy = e.clientY - r.top;
    dock.setPointerCapture(e.pointerId); dock.classList.add("sbd-drag");
    const move = ev => place(ev.clientX - dx, ev.clientY - dy);
    const up = ev => {
      dock.removeEventListener("pointermove", move); dock.removeEventListener("pointerup", up); dock.removeEventListener("pointercancel", up);
      dock.classList.remove("sbd-drag");
      ls.set(POS, JSON.stringify(place(ev.clientX - dx, ev.clientY - dy)));
    };
    dock.addEventListener("pointermove", move); dock.addEventListener("pointerup", up); dock.addEventListener("pointercancel", up);
  });
  window.addEventListener("resize", () => { if(dock && !dock.hidden && dock.style.left !== "auto") place(parseFloat(dock.style.left), parseFloat(dock.style.top)); });
  return dock;
}
function sync(){
  const want = onSkillBuilding() && !audience();
  if(!want){ if(dock) dock.hidden = true; return; }
  ensure();
  if(trainee() && !drive() && !asked && window.CMDrive && typeof CMDrive.reload === "function"){
    asked = true; Promise.resolve(CMDrive.reload()).then(paint, paint);
  }
  const was = dock.hidden;
  paint(); dock.hidden = false;
  if(was) restore();
}

window.CMSbDock = {
  cms(mode){ if(typeof window.openTool === "function") openTool("cms", mode); else { const h = window.cmToolHref && cmToolHref("cms"); if(h) window.open(h, "_blank"); } },
  drive(){ if(window.CMDrive && typeof CMDrive.show === "function") CMDrive.show(); },
  fold(on){ ls.set(MIN, on ? "1" : "0"); paint(); if(dock && dock.style.left !== "auto") place(parseFloat(dock.style.left), parseFloat(dock.style.top)); },
  sync
};

if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ sync(); }catch(e){} return r; };
}
// a slide drawn without a full render (Next/Previous inside a lesson) still brings the card or takes it away
let queued = false;
const watch = () => { const app = document.getElementById("app"); if(!app) return;
  new MutationObserver(() => { if(queued) return; queued = true; requestAnimationFrame(() => { queued = false; try{ sync(); }catch(e){} }); }).observe(app, {childList:true, subtree:true}); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { watch(); sync(); }); else { watch(); sync(); }

const css = document.createElement("style");
css.textContent = `
#cm-sb-dock{position:fixed;z-index:9000;width:224px;background:#1E2340;color:#fff;border:2px solid #DB8437;border-radius:14px;
  box-shadow:0 10px 28px rgba(14,18,40,.35);padding:8px 10px 10px;font-weight:700;font-size:16px;touch-action:none;user-select:none;}
#cm-sb-dock[hidden]{display:none;}
#cm-sb-dock.sbd-drag{opacity:.92;cursor:grabbing;}
#cm-sb-dock .sbd-head{display:flex;align-items:center;justify-content:space-between;margin-bottom:6px;cursor:grab;}
#cm-sb-dock .sbd-grip{cursor:grab;color:#F3C99E;font-size:14px;letter-spacing:.04em;text-transform:uppercase;}
#cm-sb-dock .sbd-x{background:transparent;border:0;color:#fff;font-size:20px;line-height:1;font-weight:800;cursor:pointer;padding:0 4px;}
#cm-sb-dock .sbd-row{display:flex;gap:6px;margin-top:6px;}
#cm-sb-dock .sbd-btn{flex:1;display:flex;align-items:center;justify-content:center;gap:4px;min-height:38px;border-radius:9px;border:0;
  font:inherit;font-weight:800;font-size:16px;cursor:pointer;text-decoration:none;padding:6px 8px;}
#cm-sb-dock .sbd-cms{background:#DB8437;color:#fff;}
#cm-sb-dock .sbd-tab{flex:0 0 40px;background:#fff;color:#1E2340;}
#cm-sb-dock .sbd-drive{background:#fff;color:#1E2340;}
#cm-sb-dock .sbd-btn:hover{filter:brightness(1.07);}
#cm-sb-dock .sbd-btn:focus-visible,#cm-sb-dock .sbd-x:focus-visible,#cm-sb-dock .sbd-pill:focus-visible{outline:3px solid #F3C99E;outline-offset:2px;}
#cm-sb-dock.sbd-min{width:auto;display:flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;}
#cm-sb-dock.sbd-min[hidden]{display:none;}
#cm-sb-dock .sbd-pill{background:transparent;border:0;color:#fff;font:inherit;font-weight:800;font-size:16px;cursor:pointer;white-space:nowrap;}
@media print{#cm-sb-dock{display:none!important;}}
`;
document.head.appendChild(css);
})();
