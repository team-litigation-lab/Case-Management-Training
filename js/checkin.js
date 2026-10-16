/* ============================================================
   🕘 Automatic Time In (trainees)
   Attendance is taken on the Main Portal (the LSH Training Portal's Master Control → 🕘 Attendance, every program
   and batch in one place); this course has no Attendance tab of its own. What stays here is the trainee's side:
   their first visit each day (Eastern time: EST, or EDT in summer) records their Time In on the Worker
   (/api/checkin, which keeps the first one: checkin:<YYYY-MM-DD>:<id>, kept 40 days), and the portal's page
   shows it (marked "auto") until a trainer sets one. It is sent when the page opens, when they come back to
   the tab, and on their first click or key press if the page was left open overnight, with the Case Flow day
   they're on, for the attendance Google Sheet.
   ============================================================ */
(function(){
"use strict";
const etDate = () => {
  const p = new Intl.DateTimeFormat("en-CA", {timeZone: "America/New_York", year: "numeric", month: "2-digit", day: "2-digit"}).formatToParts(new Date());
  const g = t => (p.find(x => x.type === t) || {}).value;
  return `${g("year")}-${g("month")}-${g("day")}`;
};
// the day they're on: the first Case Flow day not yet complete
function myTraining(){
  try{
    const p = state.progress || {}, d = DAYS.find(x => !(p[x.id] && p[x.id].done)) || DAYS[DAYS.length - 1];
    if(!d) return "";
    const title = String(d.title || "").replace(/^Case Flow Day \d+\s*·\s*/, "");
    return d.cf ? `Case Flow Day ${d.cf.n}: ${title}` : `Day ${d.id}: ${title}`;
  }catch(err){ return ""; }
}
const CI = {busy: false, wait: 0, tapped: 0};
function checkIn(){
  if(CI.busy || Date.now() < CI.wait || typeof state === "undefined" || !state.traineeId || state.isAdmin || state.adminPreview) return;
  if(document.visibilityState !== "visible" || typeof authFetch !== "function") return;
  const date = etDate(), mark = "lsh-checkin:" + state.traineeId;
  try{ if(localStorage.getItem(mark) === date) return; }catch(err){}
  CI.busy = true;
  authFetch("/api/checkin", {id: state.traineeId, training: myTraining()})
    .then(r => r.json()).then(j => {
      if(j && j.ok){ try{ localStorage.setItem(mark, j.date || date); }catch(err){} }
      else CI.wait = Date.now() + 10 * 60 * 1000;     // not approved yet: ask again later
    })
    .catch(() => { CI.wait = Date.now() + 60 * 1000; })
    .finally(() => { CI.busy = false; });
}
[2000, 6000, 20000].forEach(t => setTimeout(checkIn, t));
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "visible") checkIn(); });
["pointerdown", "keydown"].forEach(ev => document.addEventListener(ev, () => {
  if(Date.now() - CI.tapped < 60000) return;
  CI.tapped = Date.now(); checkIn();
}, {capture: true, passive: true}));
})();
