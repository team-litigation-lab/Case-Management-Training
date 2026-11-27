/* 🔥 The Roleplay hub and 🎲 Quick Practice serve only calls whose activity is still on a day.
   The owner cut and merged extra tasks so trainees focus on each day's Skill Building (js/cm-case-flow-data.js keeps the
   cut blocks, retired, so old grades still resolve). A Case Flow call in ROLEPLAY_CATEGORIES is "cf-<activity id>"; one
   whose activity is in no day's CM_CASE_FLOW.sequence is taken out of the hub's topics and out of
   QUICK_PRACTICE_TOPIC_IDS (index.html), so no trainee practices, or is graded on, a call for work their days no longer
   have. Calls that are not a Case Flow activity's are left as they are; so are the categories and every saved result. */
(function(){
"use strict";
if(typeof window === "undefined") return;
const CF = window.CM_CASE_FLOW;
if(!CF || !CF.days || !CF.sequence) return;
const taught = new Set(), acts = new Set();
CF.sequence.forEach(s => (s.phases || []).forEach(ph => (ph.blocks || []).forEach(b => taught.add(b))));
CF.days.forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if(b.kind === "activity") acts.add(b.id); })));
const cut = id => { const m = /^cf-(.+)$/.exec(String(id || "")); return !!m && acts.has(m[1]) && !taught.has(m[1]); };
function keepTaught(){
  if(typeof ROLEPLAY_CATEGORIES !== "undefined") ROLEPLAY_CATEGORIES.forEach(c => { if(Array.isArray(c.topics)) c.topics = c.topics.filter(t => !cut(t.id)); });
  if(typeof QUICK_PRACTICE_TOPIC_IDS !== "undefined") for(let i = QUICK_PRACTICE_TOPIC_IDS.length - 1; i >= 0; i--) if(cut(QUICK_PRACTICE_TOPIC_IDS[i])) QUICK_PRACTICE_TOPIC_IDS.splice(i, 1);
}
keepTaught();
window.cmRoleplayTaught = {cut, keepTaught};
})();
