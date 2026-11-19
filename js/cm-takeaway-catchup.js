/* ============================================================
   📝 TAKEAWAY CATCH-UP: a takeaway review that didn't complete is run again

   After a day's Knowledge Check each module's written takeaway is AI-reviewed (js/cm-case-flow.js cmCaseFlow.autoReview), and
   the reviews' average is the day's 📝 Takeaways score on the trainer's sheets (📋 Batch Sheet, 🏅 Scorecard), as the
   reviews are the automated half of each 🧩 Learning Check. A review that didn't complete (the AI busy, the shared AI
   budget, the connection) was left ungraded and never tried again, so the 📝 Takeaways column stayed blank and the Learning
   Check counted the quiz alone.

   Now, once a session and a while after the page settles (the sign-in has restored the trainee's progress by then), each
   Case Flow day whose Knowledge Check is taken and whose written takeaways have no AI review is reviewed again, a day at a
   time: autoReview leaves alone what is already reviewed or not written, and saves the day's takeaway score, which the
   trainee's record carries to the sheets (js/cm-updates.js: caseFlow = cmCaseFlow.scoreSummary()). A review that fails
   again waits for the next session. Trainers and a trainer's 👁 Trainee view are left out.
   window.cmTakeawayCatchup: {run, pending}.
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || typeof state === "undefined") return;
const ONCE = "lsh_takeaway-catchup";   // sessionStorage: the trainee whose catch-up ran this session

// the day's takeaway is the one on its last Learning Check (js/cm-case-flow.js kcMods), complete at 8 words (TAKEAWAY_MIN)
const kcModOf = d => { const all = (d.lessons || []).filter(l => l && l.cf && l.cf.block && l.cf.block.kind === "check" && l.cf.mod); return all.length ? all[all.length - 1].cf.mod.id : null; };
const words = t => String(t || "").trim().split(/\s+/).filter(Boolean).length;
// the Case Flow days whose Knowledge Check is taken and whose written takeaway has no AI review
async function pending(){
  if(typeof storeGet !== "function" || typeof DAYS === "undefined") return [];
  let rec = null; try{ rec = await storeGet("case-flow"); }catch(e){}
  const mods = (rec && rec.modules) || {};
  return DAYS.filter(d => d && d.cf).filter(d => {
    const p = (state.progress || {})[d.id], id = kcModOf(d), m = id && mods[id];
    if(!p || (typeof p.score !== "number" && !p.done) || !m) return false;
    return words((m.answers || [])[0]) >= 8 && !(m.ai && typeof m.ai.score === "number");
  });
}

let running = false;
async function run(){
  const cf = window.cmCaseFlow;
  if(running || !cf || typeof cf.autoReview !== "function" || !state.traineeId || state.isAdmin || state.adminPreview) return 0;
  try{ if(sessionStorage.getItem(ONCE) === state.traineeId) return 0; }catch(e){}
  running = true;
  let n = 0;
  try{
    for(const d of await pending()){ try{ await cf.autoReview(d.id); n++; }catch(e){} }
    try{ sessionStorage.setItem(ONCE, state.traineeId); }catch(e){}
  }finally{ running = false; }
  return n;
}

// never in the way of the first screen: 20 seconds after the page has loaded
const later = () => setTimeout(() => { run(); }, 20000);
if(document.readyState === "complete") later(); else window.addEventListener("load", later, {once: true});
window.cmTakeawayCatchup = {run, pending};
})();
