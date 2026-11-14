/* ✍️ KNOWLEDGE CHECKS: ONE ATTEMPT ONLY
   A trainee takes each Case Flow day's Knowledge Check once. That first attempt is the official score: it is what the
   day card, 🏅 My Performance, the Scorecards and the Batch Sheet show (state.progress[day].score, saved to the trainee's
   record by submitQuiz and syncToLedger, as before). History keeps the attempt, so the 📒 Progress Log still reads it.
   • A second submit is refused: the recorded result shows instead, with "One attempt only — your score is recorded."
     Before refusing, the trainee's record on the server is read too, so a second device can't take it again.
   • Opening the Knowledge Check again (the day's last slide, ✓ Finish Training, 🔁 Retake) shows the recorded result.
   • The results page has no Retake Quiz button and no "retake" wording.
   • A trainer (signed in as admin, not previewing) is not limited: they try the checks as often as they like.
   A day not passed stays closed until the trainer opens the next day for the trainee (🔓 Open Lessons). Nothing reopens a
   check: the locked 🔁 Retake says to ask the trainer about opening the next day. The Worker holds the rule too (a
   trainee's own write keeps an attempt already on their record: keepKcAttempts).
   Loaded after js/cm-case-flow.js, whose submitQuiz, retakeQuiz, renderQuiz and renderQuizNextStep it wraps. */
(function(){
"use strict";
if(typeof submitQuiz !== "function" || typeof state === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const ONCE = "One attempt only — your score is recorded.";
const say = m => { if(typeof toast === "function") toast(m); };
const dayOf = id => (typeof DAYS !== "undefined" ? DAYS : []).find(d => d.id === Number(id)) || null;
const trainer = () => !!state.isAdmin && !state.adminPreview;
const progOf = id => ((state.progress || {})[id]) || null;
// how many attempts the record holds: its history, or a score kept from before history was recorded
const attemptsIn = p => !p ? 0 : Array.isArray(p.history) && p.history.length ? p.history.length : typeof p.score === "number" ? 1 : 0;
const taken = id => !trainer() && attemptsIn(progOf(id)) >= 1;
// the official attempt: the first one (a record from before this rule keeps the score it has)
const official = p => (p && Array.isArray(p.history) && p.history[0]) || (p ? {score: p.score, passed: !!p.done} : null);

/* the recorded result, read-only, in place of a fresh quiz */
function showRecorded(id){
  const d = dayOf(id), p = progOf(id); if(!d || !p) return;
  const o = official(p), n = (d.quiz || []).length || 1;
  state.view = "day"; state.dayId = d.id; state.dayViewMode = "knowledgeCheck";
  state.quizSubmitted = true; state.slideInterstitial = null;
  state.lastScore = o.score; state.lastCorrect = Math.round(o.score / 100 * n); state.lastTotal = n; state.lastPassed = !!p.done;
  // the Answer Review shows the recorded attempt's own picks (saved with it), never this device's leftovers or a refused
  // second play-through; a record from before the picks were saved has no per-question review
  const picks = o && Array.isArray(o.answers) ? o.answers : null;
  state.quizAnswers = {};
  if(picks) picks.forEach((v, i) => { if(typeof v === "number") state.quizAnswers[i] = v; });
  state.kcNoReview = picks ? null : d.id;
}
const noReview = d => !!d && state.kcNoReview === d.id && !trainer();
const NO_REVIEW = "The question-by-question review of this recorded attempt isn't available (it was taken before answers were kept with the score). Your score is recorded.";
if(typeof window.renderAnswerFeedback === "function"){
  const __af = window.renderAnswerFeedback;
  window.renderAnswerFeedback = function(d){
    if(!noReview(d)) return __af.apply(this, arguments);
    const el = document.getElementById("answerFeedback"); if(!el) return;
    el.innerHTML = `<h2 class="cf-ans-h">Answer Review</h2><p class="kc-once-note">${E(NO_REVIEW)}</p>`;
  };
}
if(typeof window.downloadQuizResultPdf === "function"){
  const __pdf = window.downloadQuizResultPdf;
  window.downloadQuizResultPdf = async function(id){
    const d = dayOf(id);
    if(!noReview(d) || typeof buildAndSavePdf !== "function") return __pdf.apply(this, arguments);
    if(typeof ensureTraineeName === "function") await ensureTraineeName();
    const lines = [`Result: ${state.lastCorrect} / ${state.lastTotal} correct (${state.lastScore}%) — ${state.lastPassed ? "PASSED" : "Not yet passing (70% required)"}`, "---", NO_REVIEW];
    buildAndSavePdf("LSH Case Management Training", `Day ${id} Knowledge Check — Results`, lines, `LSH_Day${id}_Knowledge_Check`);
  };
}
window.cmKcOnce = {taken, official: id => official(progOf(id)), ONCE};

/* ✓ Finish Training / 🔁 Retake on a day card, and Retake Quiz: the recorded result */
if(typeof window.finishTrainingForDay === "function"){
  const __finish = window.finishTrainingForDay;
  window.finishTrainingForDay = function(id){
    if(!taken(id)) return __finish.apply(this, arguments);
    say(ONCE);
    return typeof reviewMyScore === "function" ? reviewMyScore(id) : (showRecorded(id), render());
  };
}
if(typeof window.retakeQuiz === "function"){
  const __retake = window.retakeQuiz;
  window.retakeQuiz = function(id){ if(taken(id)){ say(ONCE); return; } return __retake.apply(this, arguments); };
}

/* Submit: refused once the day has an attempt (here or on the trainee's record on the server) */
const __submit = window.submitQuiz;
// the day's record on the server: its progress when it has an attempt, null when it has none, FAILED when it couldn't be
// read (sharedGet can't tell a failed read from an empty one, so the Worker is asked directly where there is one)
const FAILED = {failed: true};
async function onServer(id){
  if(!state.traineeId) return null;
  const pick = rec => { const p = rec && rec.dayProgress && rec.dayProgress[id]; return attemptsIn(p) ? p : null; };
  try{
    if(!window.storage && typeof authFetch === "function"){
      const res = await authFetch("/api/storage/get", {key: "trainee:" + state.traineeId});
      if(!res || !res.ok) return FAILED;
      const j = await res.json();
      return pick(j && j.value ? JSON.parse(j.value) : null);
    }
    if(typeof sharedGet !== "function") return null;
    return pick(await sharedGet("trainee:" + state.traineeId));
  }catch(e){ return FAILED; }
}
let pending = false;   // a submit waiting on the server read: a second click does nothing
const submit = async function(id){
  if(state.quizSubmitting || pending) return;
  const picks = Object.assign({}, state.quizAnswers || {});
  if(!trainer()){
    let p;
    pending = true;
    try{ p = taken(id) ? progOf(id) : await onServer(id); }finally{ pending = false; }
    if(p === FAILED){ say("Couldn't check your record, try again."); return; }
    if(!p && taken(id)) p = progOf(id);   // taken here while the read was out
    if(p){
      if(!taken(id)){ state.progress = state.progress || {}; state.progress[id] = p; try{ await storeSet("day-progress", state.progress); }catch(e){} }
      say(`You've already taken this Knowledge Check. ${ONCE}`);
      showRecorded(id); render(); window.scrollTo({top: 0, behavior: "smooth"});
      return;
    }
  }
  const r = await __submit.apply(this, arguments);
  // the first attempt is the official score (submitQuiz keeps the best of several; with one attempt they're the same,
  // and this keeps it so whatever is on the record)
  const p = progOf(id);
  if(p && !trainer()){
    const o = official(p), d = dayOf(id);
    // the first attempt keeps its own picks, so its Answer Review reads the same on any device later
    const keep = o && Array.isArray(p.history) && p.history[0] === o && !o.answers && p.history.length === 1 && d && (d.quiz || []).length;
    if(keep) o.answers = d.quiz.map((q, i) => typeof picks[i] === "number" ? picks[i] : null);
    if(keep || (o && typeof o.score === "number" && (p.score !== o.score || !!p.done !== !!o.passed))){
      if(o && typeof o.score === "number"){ p.score = o.score; p.done = !!o.passed; }
      state.kcNoReview = null;
      try{ await storeSet("day-progress", state.progress); if(typeof syncToLedger === "function") await syncToLedger(); }catch(e){}
    }
  }
  return r;
};
window.submitQuiz = submit;
try{ submitQuiz = submit; }catch(e){}

/* The results: no Retake Quiz button, no retake wording; a day already taken opens on its recorded result */
const STRIP = [
  [/<button[^>]*onclick="retakeQuiz\(\d+\)"[^>]*>[^<]*<\/button>/g, `<span class="kc-once-note" title="${E(ONCE)}">🔒 ${E(ONCE)}</span>`],
  [/,? ?then retake when you(?:'|&#39;|’)re ready\./g, ". Your score is recorded."],
  [/, retake if you like, or keep going\./g, ". Your score is recorded."],
  [/ A retake is optional\./g, " Your score is recorded."],
  [/title="Your best score is kept; you can retake it any time">✓ Passed · best /g, `title="${E(ONCE)}">✓ Passed · `]
];
const clean = html => STRIP.reduce((h, [re, to]) => h.replace(re, to), String(html));
if(typeof window.renderQuiz === "function"){
  const __quiz = window.renderQuiz;
  const quiz = function(d){
    if(d && taken(d.id) && !state.quizSubmitted && !state.quizSubmitting) showRecorded(d.id);
    return clean(__quiz.apply(this, arguments));
  };
  window.renderQuiz = quiz;
  try{ renderQuiz = quiz; }catch(e){}
}
/* the next step after a check under 70%: the score stands; the trainer opens the next day */
if(typeof window.renderQuizNextStep === "function" || typeof renderQuizNextStep === "function"){
  const __next = typeof renderQuizNextStep === "function" ? renderQuizNextStep : window.renderQuizNextStep;
  const next = function(d, passed){
    if(passed || !d || trainer()) return clean(__next.apply(this, arguments));
    const n = d.cf ? d.cf.n : d.id, name = d.cf ? "Case Flow Day" : "Day", last = d.cf ? !(typeof DAYS !== "undefined" && DAYS.some(x => x.cf && x.cf.n === n + 1)) : d.id >= (DAYS || []).length;
    const lines = [`<b>${E(ONCE)}</b> This check can't be taken again.`,
      last ? "Ask your trainer about your next step." : `${name} ${n + 1} opens on a pass, or when your trainer opens it for you. Ask your trainer.`];
    if(d.cf && d.cf.gate) lines.push(`<b>Gate:</b> ${E(d.cf.gate)}.`);
    return `<div class="quiz-next-step qns-stop"><div class="qns-title">Not yet passing — 70% is required to mark ${name} ${n} complete.</div>${lines.map(x => `<p>${x}</p>`).join("")}</div>`;
  };
  try{ renderQuizNextStep = next; }catch(e){}
  window.renderQuizNextStep = next;
}

const st = document.createElement("style"); st.id = "cm-kc-once"; st.textContent = `
.kc-once-note{display:inline-flex;align-items:center;gap:4px;padding:6px 12px;border-radius:8px;background:#F3F4F8;border:1px solid #D6DAE5;color:#1E2340;font-weight:700;font-size:14px;}
`;
document.head.appendChild(st);
})();
