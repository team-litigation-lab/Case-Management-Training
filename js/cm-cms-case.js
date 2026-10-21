/* 🗂 The open case in the CMS, read from the CMS.
   The CMS is integrated with this course, so a step that asks for the CMS Case ID doesn't ask the trainee
   to copy it out of the case header: this file asks the CMS which case is open and fills the box in.
   The trainee can still type over it (a case opened in another tab, a reference the CMS didn't give).

   How: the CMS frame (and any CMS tab this page opened) is asked {lsh:"cms-case?"}; its course-bridge.js
   answers {lsh:"cms-case", caseId, client, phase, dol} and says so again whenever the open case changes, so
   saving a new case fills the box the moment the CMS assigns its ID. Only a message from a CMS address is
   read, and the last known case is kept for the rest of the session (localStorage), so a step opened
   after the frame is closed still has it.
   Nothing here blocks a step: with no CMS open and nothing remembered, the box is empty and typed as before. */
(function(){
const CMS_HOSTS = [/^([a-z0-9-]+\.)?lshcasemanagementtraining-trainingcrm\.pages\.dev$/];
const LOCAL = /^http:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/;                   // a local CMS while the checks run
const cmsOrigin = (origin)=>{ try{ const u = new URL(origin); return CMS_HOSTS.some(re=>re.test(u.hostname)) || LOCAL.test(origin); }catch(e){ return false; } };
const KEY = "cm-cms-case";
const listeners = [];
let open = null;

function remembered(){
  try{ const o = JSON.parse(localStorage.getItem(KEY) || "null"); return o && o.caseId ? o : null; }catch(e){ return null; }
}
open = remembered();

/* the CMS windows this page can reach: the in-portal frame, and the tabs it opened */
function cmsWindows(){
  const out = [];
  document.querySelectorAll("iframe").forEach(f=>{
    const src = f.dataset && (f.dataset.src || f.dataset.base) || f.getAttribute("src") || "";
    try{ const u = new URL(src, location.href); if((CMS_HOSTS.some(re=>re.test(u.hostname)) || LOCAL.test(u.origin)) && f.contentWindow) out.push(f.contentWindow); }catch(e){}
  });
  (window.__cmsTabs || []).forEach(w=>{ if(w && !w.closed) out.push(w); });   // CMS tabs opened from the 🧰 Tools menu (openTool, js/cm-skillbuilders.js)
  return out;
}
window.cmCmsWindows = cmsWindows;
/* Ask every CMS window which case is open. The answer comes back through the listener below.
   A frame asked before its page is ready hears nothing, so each CMS frame is asked again when it loads. */
function ask(){
  cmsWindows().forEach(w=>{ try{ w.postMessage({lsh:"cms-case?"}, "*"); }catch(e){} });   // "*": the frame's address is the CMS's, and the question carries nothing
  document.querySelectorAll("iframe").forEach(f=>{
    if(f.dataset.cmsAsk === "1" || !cmsWindows().includes(f.contentWindow)) return;
    f.dataset.cmsAsk = "1";
    f.addEventListener("load", ()=>{ try{ f.contentWindow.postMessage({lsh:"cms-case?"}, "*"); }catch(e){} });
  });
}
window.addEventListener("message", (e)=>{
  // only a CMS frame on this page: the message has to come from one of its windows, at a CMS address.
  // (A page talking to itself, or any other frame, is not the CMS however it words the message.)
  if(!e.data || e.data.lsh !== "cms-case" || !cmsOrigin(e.origin) || !cmsWindows().includes(e.source)) return;
  const c = {caseId: String(e.data.caseId || "").trim(), client: String(e.data.client || "").trim(),
             phase: String(e.data.phase || "").trim(), dol: String(e.data.dol || "").trim(),   // the case's Date of Loss (MM/DD/YYYY)
             at: e.data.at || new Date().toISOString()};
  if(!c.caseId) return;                                     // a draft with no ID yet: keep what we had
  if(open && open.caseId === c.caseId && open.client === c.client && (open.dol || "") === c.dol) return;
  open = c;
  try{ localStorage.setItem(KEY, JSON.stringify(c)); }catch(err){}
  fill();
  listeners.forEach(fn=>{ try{ fn(c); }catch(err){} });
});

/* Fill the Case ID boxes of the steps on the page: the ones that take a CMS Case ID (data-cms-id),
   left empty or still holding an ID the CMS gave earlier. What the trainee typed is never overwritten. */
function fill(){
  if(!open || !open.caseId) return;
  document.querySelectorAll("input[data-cms-id]").forEach(el=>{
    const v = el.value.trim();
    // empty, or still holding exactly what we put there: ours to fill. Anything else is the trainee's.
    if(v && v !== (el.dataset.cmsValue || "")) return;
    if(v === open.caseId) { el.dataset.fromCms = "1"; el.dataset.cmsValue = open.caseId; return; }
    el.value = open.caseId; el.dataset.fromCms = "1"; el.dataset.cmsValue = open.caseId;
    el.title = `From the CMS: ${open.client || "the open case"}${open.phase ? " · " + open.phase : ""}`;
    const note = el.parentNode && el.parentNode.querySelector("[data-cms-note]");
    if(note) note.textContent = "from the CMS";
  });
}
/* A step that was just drawn: its box gets the case the CMS last said was open, and the CMS is asked again
   (the trainee may have saved a new case since). */
function apply(){ fill(); ask(); }

window.CMCase = {
  get: ()=> open && open.caseId ? Object.assign({}, open) : null,
  id: ()=> (open && open.caseId) || "",
  ask, apply, fill,
  onChange: (fn)=>{ if(typeof fn === "function") listeners.push(fn); }
};
/* every render redraws the steps: fill what is on the page now, and ask the CMS */
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ apply(); }catch(e){} return r; };
}
/* a tool frame opened (the CMS beside the lesson): ask it as soon as it is there */
if(window.MutationObserver){
  new MutationObserver((recs)=>{
    for(const r of recs) for(const n of r.addedNodes) if(n.nodeType === 1 && (n.tagName === "IFRAME" || n.querySelector && n.querySelector("iframe"))) { ask(); return; }
  }).observe(document.documentElement, {childList: true, subtree: true});
}
document.addEventListener("DOMContentLoaded", apply);
window.addEventListener("focus", ask);        // back from the CMS in its own tab
})();
