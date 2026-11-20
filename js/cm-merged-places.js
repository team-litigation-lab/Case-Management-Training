/* ============================================================
   A saved place on a merged activity lands on the Skill Building that now holds its work

   The owner merged extra tasks into each day's Skill Building (js/cm-case-flow-data.js: the merged block keeps
   `retired` and `mergedInto`, the main it became a checkpoint of). A trainee's place is saved by slide key
   (js/cm-slide-keys.js). Left alone, a place on a merged activity's slide lands on the nearest slide before it that is
   still there: another side exercise, the Practice Lab. This rule (window.CM_SLIDE_KEY_RULES) puts it on the first
   slide of the main instead, where that work is now done, when the main is in the day. A plain cut activity (no
   mergedInto) keeps the nearest slide before it, as ever.
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined") return;
const RULE = "mergedPlaces";
const blockOf = k => String(k || "").replace(/#\d+$/, "").replace(/:[^:]*$/, "");
let MAIN = null;
function mains(){
  if(MAIN) return MAIN;
  const CF = window.CM_CASE_FLOW; MAIN = {};
  if(CF && CF.days) CF.days.forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if(b && b.mergedInto) MAIN[b.id] = b.mergedInto; })));
  return MAIN;
}
function place(d, r, to, keys){
  const k = r && Array.isArray(r.k) ? r.k[0] : "";
  if(!k || k.charAt(0) === "~" || keys.indexOf(k) >= 0) return to;   // a day's own slide, or its slide is still there
  const main = mains()[blockOf(k)]; if(!main) return to;
  const at = keys.findIndex(x => blockOf(x) === main);
  return at >= 0 ? at : to;
}
(window.CM_SLIDE_KEY_RULES = window.CM_SLIDE_KEY_RULES || []).push({id: RULE, place});
window.cmMergedPlaces = {place};
})();
