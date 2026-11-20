/* ============================================================
   ⚡ AUTO-GRADE: every score fills in by itself, no one has to press anything

   The owner: "Automatically score everything without having the need for manual trigger." What used to wait on a button:

   1. 🤖 A Skill Activity whose AI grading didn't come back (js/cm-ai-grader.js keeps it as `failed` on cf-ai-grades: the AI
      busy, the shared AI budget, the site's AI connection refused) waited for the trainee to press Try again / Submit →.
      Now it is sent again by itself, on the trainee's own page:
        • when the course loads (a while after the page settles, and after a sign-in restores their progress), when they
          come back to the tab, and on a minute's tick while the page is open;
        • with backoff, counted from the last failure: 1 minute, 10 minutes, 1 hour, then every 6 hours (DELAYS);
        • at most MAX_FAILS_DAY failed retries a day (and MAX_CALLS_DAY calls in all), and a round stops at its first
          failure, so a service that is down (AI_GATEWAY_SECRET not set) is asked a few times a day per trainee, not
          hammered, and the grading recovers by itself the first time it answers;
        • a retry is no attempt of the trainee's: a grading that fails uses none of the 3 (the grader's own rule), and the
          one that comes back is the attempt the trainee handed in.
      Work handed in but never graded (Submit pressed, the page closed before the AI answered: a draft, no score and no
      failure) is sent the same way. Done (🔑 I'm done), out of attempts, or a trainer's / 👁 Trainee view: never.
      The backoff is kept in "cf-ai-regrade" (a personal key: {who, n, last, day, fails, calls}), so a reload or a second
      device doesn't start it over. It runs through window.CMAIGrader.submit, the button's own function: nothing of the
      grader's is copied.
   2. 🏅 The trainer's Scorecard read the Backup Drive reports once (js/cm-drive-work.js) and the trainee records when it
      was drawn, so a grade given since (the Worker's hourly and nightly runs, worker-drive-work.js driveWorkActive /
      driveWorkNightly) showed only after ↻ Refresh. Now, while the Scorecard is open and in view, the drive reports and the
      records are read again every TRAINER_MS and on coming back to the tab (the cards redraw only when something changed).
   The ⚡ Run now buttons stay, for "now rather than later"; nothing waits on them.
   window.cmAutoGrade: {run, pending, due, state, trainerTick, DELAYS, MAX_FAILS_DAY, MAX_CALLS_DAY}.
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || typeof state === "undefined") return;
const KEY = "cf-ai-regrade";
if(typeof registerPersonalKeys === "function") registerPersonalKeys([KEY]);
const MIN = 60000, DELAYS = [MIN, 10 * MIN, 60 * MIN, 360 * MIN];
const MAX_FAILS_DAY = 6, MAX_CALLS_DAY = 40;
const AFTER_LOAD = 8000, AFTER_SIGNIN = 3000, TICK = MIN, TRAINER_MS = 2 * MIN, LOCK = "lsh_auto-grade-lock", LOCK_MS = 3 * MIN;

const isTrainee = () => !!state.traineeId && !state.isAdmin && !state.adminPreview;
const isAdmin = () => !!state.isAdmin && !state.adminPreview;
const audience = () => !!document.body && document.body.classList.contains("audience-mode");
const typing = () => typeof isTyping === "function" && isTyping();
const visible = () => document.visibilityState !== "hidden";
const today = () => new Date().toISOString().slice(0, 10);
const t = s => Date.parse(s || "") || 0;

/* ---------- 1. the AI grades that didn't come back ---------- */
const fresh = () => ({v: 1, who: state.traineeId || "", n: 0, last: "", day: today(), fails: 0, calls: 0});
let S = fresh();
async function loadS(){
  let v = null; try{ if(typeof storeGet === "function") v = await storeGet(KEY); }catch(e){}
  S = Object.assign(fresh(), v && typeof v === "object" && v.who === state.traineeId ? v : {});
  if(S.day !== today()) Object.assign(S, {day: today(), fails: 0, calls: 0});
  return S;
}
const saveS = () => { try{ return typeof storeSet === "function" ? storeSet(KEY, S) : null; }catch(e){ return null; } };

// an activity the grader knows: a block of the lesson data, or registered work (window.CM_AIG_EXTRA)
function known(id){
  const X = (window.CM_AIG_EXTRA || {})[id]; if(X && X.b) return true;
  return ((window.CM_CASE_FLOW || {}).days || []).some(d => (d.modules || []).some(m => (m.blocks || []).some(b => b.id === id)));
}
const skip = {};   // this page visit: work the grader wouldn't send (it asked for more detail), never sent again until a reload
/* the work to send: a grading that failed (and is newer than any grade it has), or work handed in and never graded */
function pending(){
  const A = window.CMAIGrader; if(!A || typeof A.all !== "function") return [];
  const G = A.all() || {}, max = A.MAX_TRIES || 3;
  return Object.entries(G.blocks || {}).filter(([id, r]) => r && typeof r === "object" && !r.done && (r.tries || 0) < max && !skip[id] && known(id) && (r.failed
      ? (typeof r.score !== "number" || String(r.failed.at || "") > String(r.at || ""))
      : (typeof r.score !== "number" && !!String(r.draft || "").trim())))
    .map(([id, r]) => ({id, failed: !!r.failed, at: (r.failed && r.failed.at) || ""}));
}
/* when the next retry may go: never-graded work at once (while nothing is failing), else DELAYS after the last failure */
function due(list){
  list = list || pending();
  if(!list.length) return null;
  if(S.fails >= MAX_FAILS_DAY || S.calls >= MAX_CALLS_DAY) return Infinity;
  const last = Math.max(t(S.last), ...list.filter(x => x.failed).map(x => t(x.at)));
  if(!last) return 0;
  return last + DELAYS[Math.min(S.n, DELAYS.length - 1)];
}
// one page at a time sends them (two tabs of the course don't both retry)
const me = Math.random().toString(36).slice(2);
function lock(){
  try{ const v = JSON.parse(localStorage.getItem(LOCK) || "null"); if(v && v.me !== me && Date.now() - v.at < LOCK_MS) return false;
    localStorage.setItem(LOCK, JSON.stringify({me, at: Date.now()})); }catch(e){}
  return true;
}
const unlock = () => { try{ const v = JSON.parse(localStorage.getItem(LOCK) || "null"); if(v && v.me === me) localStorage.removeItem(LOCK); }catch(e){} };
const snap = id => { const r = ((((window.CMAIGrader && CMAIGrader.all()) || {}).blocks) || {})[id] || {}; return {at: r.at || "", score: r.score, failed: (r.failed && r.failed.at) || ""}; };

let running = false;
async function run(why){
  if(running || !isTrainee() || audience() || !window.CMAIGrader || typeof CMAIGrader.submit !== "function" || typeof runRubricEvaluation !== "function") return {ran: 0, why: "not here"};
  if(!visible() || typing() || state.rpSession) return {ran: 0, why: "busy"};   // never while they type, or on a live call
  await loadS();
  const list = pending(), when = due(list);
  if(when == null) return {ran: 0, why: "nothing pending"};
  if(when === Infinity) return {ran: 0, why: "today's retries used"};
  if(Date.now() < when) return {ran: 0, why: "backing off", next: new Date(when).toISOString()};
  if(!lock()) return {ran: 0, why: "another tab"};
  running = true;
  let graded = 0, failed = 0;
  try{
    for(const it of list){
      if(S.calls >= MAX_CALLS_DAY || typing() || state.rpSession) break;
      const before = snap(it.id);
      try{ await CMAIGrader.submit(it.id); }catch(e){}
      const after = snap(it.id);
      if(typeof after.score === "number" && after.at !== before.at){ graded++; S.calls++; S.n = 0; S.last = ""; continue; }
      if(after.failed && after.failed !== before.failed){ failed++; S.calls++; S.fails++; S.n++; S.last = new Date().toISOString(); break; }   // the service is down: the rest wait for the next retry
      skip[it.id] = true;   // not sent (the grader asked for more detail, or it was already being graded)
    }
  }finally{ running = false; unlock(); await saveS(); }
  return {ran: graded + failed, graded, failed, why: why || ""};
}

// when: the course loading, a sign-in restoring the trainee's progress, coming back to the tab, and a minute's tick
const later = (ms, why) => setTimeout(() => { run(why); }, ms);
if(document.readyState === "complete") later(AFTER_LOAD, "load"); else window.addEventListener("load", () => later(AFTER_LOAD, "load"), {once: true});
if(typeof loadAll === "function"){
  const __loadAll = loadAll;
  loadAll = async function(){ const r = await __loadAll.apply(this, arguments); later(AFTER_SIGNIN, "sign-in"); return r; };
}
document.addEventListener("visibilitychange", () => { if(!visible()) return; run("back"); trainerTick(true); });
setInterval(() => { run("tick"); }, TICK);

/* ---------- 2. the trainer's Scorecard keeps itself current ---------- */
let trainerAt = 0, trainerBusy = false;
async function trainerTick(now){
  if(!isAdmin() || !visible() || typing() || trainerBusy || state.view !== "scorecard" || !window.cmScorecard) return false;
  if(!now && Date.now() - trainerAt < TRAINER_MS) return false;
  trainerBusy = true; trainerAt = Date.now();
  try{
    if(typeof loadDriveReports === "function" && (state.adminData || []).length){ try{ await loadDriveReports(true); }catch(e){} }
    if(typeof cmScorecard.reload === "function") await cmScorecard.reload();
  }catch(e){}
  finally{ trainerBusy = false; }
  return true;
}
setInterval(() => { trainerTick(false); }, TRAINER_MS);

window.cmAutoGrade = {run, pending, due: () => due(), state: () => S, trainerTick, DELAYS, MAX_FAILS_DAY, MAX_CALLS_DAY, KEY};
})();
