/* ⚠ A KNOWLEDGE CHECK THE WORKER COULDN'T RECORD IS REOPENED, AND THE TRAINEE IS TOLD
   The Worker scores a Knowledge Check from its own picks (worker-identity.js kcScore). An attempt sent without them (a
   tab opened before that change runs the old submitQuiz, which sends no answers) or with too few can't be scored, so it is
   not recorded. The Worker marks the day (trainee:<id>.dayProgress[day].kcRejected, for the trainer) and answers the
   save with {kcRejected: [day, …]}. Without this file the page would keep showing the day as taken and passed,
   js/cm-kc-once.js would refuse a retake on this device, and the trainer would never see a check the trainee sat.
   This file watches the trainee's own saves of trainee:<id> (authFetch). For each day named:
   • this device's attempt is kept aside as state.progress[day].unrecorded ({score, date}) and its score, pass and history
     are cleared, so the Knowledge Check opens again (cm-kc-once's one-attempt rule counts the record's attempts only);
   • a notice (#cm-kc-rejected) says the day's Knowledge Check couldn't be recorded on their account and asks them to
     take it again (this attempt counts), with a button that opens it.
   window.cmKcRejected: {days(), handle(days)} (the checks read it). */
(function(){
"use strict";
if(typeof state === "undefined" || typeof window.authFetch !== "function") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const dayOf = id => (typeof DAYS !== "undefined" ? DAYS : []).find(d => d.id === Number(id)) || null;
const label = id => { const d = dayOf(id); return d && d.cf ? `Day ${d.cf.n}` : `Day ${id}`; };
const open = new Set();   // the days whose notice is up

function notice(){
  let el = document.getElementById("cm-kc-rejected");
  if(!open.size){ if(el) el.remove(); return; }
  const days = [...open].sort((a, b) => a - b), first = days[0], names = days.map(label).join(", ");
  if(!el){
    el = document.createElement("div");
    el.id = "cm-kc-rejected"; el.setAttribute("role", "alert");
    el.style.cssText = "position:fixed;left:16px;right:16px;top:16px;z-index:2147483600;max-width:760px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;justify-content:space-between;"
      + "background:#1E2340;color:#fff;border-left:6px solid #DB8437;border-radius:10px;padding:12px 16px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-weight:700;font-size:16px;line-height:1.4";
    document.body.appendChild(el);
  }
  el.innerHTML = `<span><span aria-hidden="true">⚠ </span>Your ${E(names)} Knowledge Check couldn’t be recorded on your account (it was taken on an older version of this page). Please take it again: this attempt counts.</span>`
    + '<span style="display:flex;gap:8px"><button type="button" data-go class="btn btn-primary" style="background:#DB8437;border-color:#DB8437;color:#fff;font-weight:800;font-size:16px;white-space:nowrap">Take it now</button>'
    + '<button type="button" data-x class="btn" style="font-weight:800;font-size:16px">Later</button></span>';
  el.querySelector("[data-go]").onclick = () => go(first);
  el.querySelector("[data-x]").onclick = () => { open.clear(); notice(); };
}
function go(id){
  open.delete(Number(id)); notice();
  try{
    state.view = "day"; state.dayId = Number(id); state.dayViewMode = "knowledgeCheck";
    state.quizSubmitted = false; state.quizAnswers = {}; state.quizQuestionIndex = 0;
    if(typeof render === "function") render();
    window.scrollTo({top: 0, behavior: "smooth"});
  }catch(e){}
}
async function handle(days){
  if(state.isAdmin && !state.adminPreview) return;
  let changed = false;
  (Array.isArray(days) ? days : []).map(Number).filter(Number.isFinite).forEach(id => {
    state.progress = state.progress || {};
    const p = state.progress[id];
    if(p && typeof p === "object" && (typeof p.score === "number" || (Array.isArray(p.history) && p.history.length))){
      const kept = {score: typeof p.score === "number" ? p.score : null, date: p.date || ((p.history || [])[0] || {}).date || null};
      const n = Object.assign({}, p, {unrecorded: kept}); ["score", "done", "history", "date"].forEach(f => delete n[f]);
      state.progress[id] = n; changed = true;
    }
    open.add(id);
  });
  if(changed){ try{ if(typeof storeSet === "function") await storeSet("day-progress", state.progress); }catch(e){} }
  notice();
  if(changed && state.view === "day"){ try{ if(typeof render === "function") render(); }catch(e){} }
}
const af = window.authFetch;
window.authFetch = async function(url, payload){
  const id = state.traineeId, res = await af.apply(this, arguments);
  if(res && res.ok && url === "/api/storage/set" && id && payload && payload.key === "trainee:" + id){
    try{ const j = await res.clone().json(); if(j && Array.isArray(j.kcRejected) && j.kcRejected.length && state.traineeId === id) handle(j.kcRejected); }catch(e){}
  }
  return res;
};
// (the page's render can drop the notice from the body: it is put back while a day is still owed, as js/cm-restore-guard.js does)
setInterval(() => { if(open.size && !document.getElementById("cm-kc-rejected")) notice(); }, 1000);
window.cmKcRejected = {days: () => [...open], handle};
})();
