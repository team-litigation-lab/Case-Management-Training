/* ============================================================
   🧑‍🏫 TRAINER NOTES ON GRADED ACTIVITIES: a trainer's own feedback beside the automated grade

   The owner: "allow manual trainer feedbacking too". Every Practice Lab activity is graded automatically
   (js/cm-ai-grader.js); this lets the trainer add their own words to any graded activity, and the trainee reads them
   under the grade on the activity's Submit slide.
     • Trainer: 👥 Trainee Audit → a trainee → the feedback composer (renderFeedbackAdmin) gains "🧑‍🏫 Practice Lab: your
       feedback on each graded activity": each graded activity with its score, the coach's note and its challenges
       (from the trainee's cf-ai-grades), a box for the trainer's feedback, and Save. Saving an empty box removes the note.
     • Saved in the trainee's feedback:<id> record as activities[<blockId>] = {comment, by, at}: the trainer's part of
       that record, which the Worker keeps (worker.js OWNED.feedback), so a trainee's save never overwrites it.
     • Trainee: the record their page already reads (state.myFeedbackRaw, index.html loadMyFeedbackCore, refreshed every
       few minutes and on coming back to the tab); the note shows under the grade as "🧑‍🏫 Your trainer's feedback".
     • 📞 Case Calls too: each call taken on John Doe's file (roleplayHistory, category "caseflow") has its own box, saved
       as activities["call:<blockId>"]; the trainee reads it on that call's screen and under the activity's grade.
     • 🎯 Graded Calls too (the Training Portal's Call Sim: its calls and debriefs are the Portal's): each line the trainee
       took (callsim:<id>, read only) has its own box, saved as activities["gc:<line key>"]; the trainee reads it on 🏅 My
       Performance beside that line's score (js/cm-scorecard.js), with a next step when the best call is under the pass mark.
     • 🛠 Skill Builders too: each tool the trainee has tried (trainee:<id>.practiceProgress) has its own box, saved as
       activities["sb:<toolId>"]; the trainee reads it under the Skill Builders hub's cards and inside the tool, at the top
       of the part whose work is reviewed (the Calendar Conflict Resolver's briefing).
   Nothing else is written; the score is unchanged (a trainer's score override stays where it is).
   ============================================================ */
(function(){
"use strict";
if(typeof document === "undefined" || typeof state === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const J = s => String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
const cssId = id => String(id || "").replace(/[^A-Za-z0-9_-]/g, "_");
const when = at => { try{ return at ? new Date(at).toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"}) : ""; }catch(e){ return ""; } };
const isTrainer = () => !!state.isAdmin && !state.adminPreview;
const plain = t => String(t || "").replace(/\s+→\s+/g, " — ");

// every activity of the course, with the Case Flow day it is taught on (CF.sequence), for the trainer's list
function activities(){
  const CF = window.CM_CASE_FLOW || {days: []}, out = {}, taught = {};
  (CF.sequence || []).forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(id => { taught[id] = sd.n; })));
  (CF.days || []).forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if(b.kind === "activity") out[b.id] = {title: b.title, n: taught[b.id] || d.n}; })));
  Object.entries(window.CM_AIG_EXTRA || {}).forEach(([id, x]) => { if(x && x.b && !out[id]) out[id] = {title: x.b.title || id, n: typeof x.n === "number" ? x.n : 5}; });
  return out;
}

/* ---------- the trainer: the feedback composer's panel ---------- */
function panel(rec){
  const work = (state.traineeWork || {})[rec.id];
  if(!work || work.loading || !work.feedback) return "";
  const G = (((work.snap || {})["cf-ai-grades"]) || {}).blocks || {}, notes = work.feedback.activities || {}, A = activities(), sid = cssId(rec.id);
  const ids = Object.keys(G).filter(id => G[id] && typeof G[id].score === "number")
    .sort((a, b) => ((A[a] || {}).n || 9) - ((A[b] || {}).n || 9) || String((A[a] || {}).title || a).localeCompare(String((A[b] || {}).title || b)));
  const head = `<div class="sidebar-section-lbl" style="padding-left:0;">🧑‍🏫 Practice Lab: your feedback on each graded activity</div>
    <p class="cf-note">Add your own words to any graded activity. The trainee reads them under the grade on that activity's Submit slide. The score itself is unchanged.</p>`;
  const rows = ids.map(id => {
    const g = G[id], a = A[id] || {title: id, n: ""}, nt = notes[id] || {};
    const list = (h, xs) => (xs || []).length ? `<div><b>${h}</b><ul>${xs.map(x => `<li>${E(plain(x))}</li>`).join("")}</ul></div>` : "";
    return `<details class="cf-tr tn-row"><summary><b>Case Flow Day ${E(a.n)}</b> ${E(a.title)}
        <span class="cf-tr-chips"><span class="fb-chip sent">Graded ${E(g.score)}%</span>${nt.comment ? `<span class="fb-chip sent">Your feedback ✓</span>` : `<span class="fb-chip draft">No feedback yet</span>`}</span></summary>
      <div class="fb-evidence">${g.summary ? `<div><b>Coach's note</b><br>${E(g.summary)}</div>` : ""}${list("What they did well", g.strengths)}${list("Challenges", g.gaps)}${list("What they could have done better", g.better)}</div>
      <label class="fbc-full">Your feedback for the trainee<textarea id="tn_${sid}_${cssId(id)}" rows="3" placeholder="What you saw, what to keep doing, and what to change next time.">${E(nt.comment || "")}</textarea></label>
      <div class="fbc-actions"><button class="btn btn-primary btn-sm" onclick="cmTrainerNotes.save('${J(rec.id)}','${J(id)}')">Save feedback</button>${nt.at ? `<span class="cf-note">Saved ${E(when(nt.at))}${nt.by ? ` by ${E(nt.by)}` : ""}</span>` : ""}</div>
    </details>`;
  }).join("");
  return `<div class="fb-admin tn-wrap">${head}${rows || `<p class="cf-note">No graded activities yet.</p>`}${callPanel(rec, work, notes, sid, A)}${gcPanel(rec, work, notes, sid)}${sbPanel(rec, notes, sid)}</div>`;
}
/* 📞 the Case Calls the trainee took on John Doe's file (their roleplayHistory, category "caseflow", topic "cf-<blockId>"),
   each with its best score and a box: notes under "call:<blockId>" */
function callPanel(rec, work, notes, sid, A){
  const by = {};
  (((work.snap || {}).roleplayHistory) || []).forEach(h => { if(!h || h.categoryId !== "caseflow" || typeof h.score !== "number") return;
    const id = String(h.topicId || "").replace(/^cf-/, ""); if(!id) return;
    const x = by[id] = by[id] || {best: 0, n: 0, label: h.topicLabel || id}; x.best = Math.max(x.best, h.score); x.n++; });
  const rows = Object.keys(by).sort((a, b) => ((A[a] || {}).n || 9) - ((A[b] || {}).n || 9)).map(id => { const x = by[id], key = "call:" + id, nt = notes[key] || {}, a = A[id] || {};
    return `<details class="cf-tr tn-row"><summary><b>📞 ${a.n ? `Case Flow Day ${E(a.n)} call` : "Case call"}</b> ${E(x.label)}
        <span class="cf-tr-chips"><span class="fb-chip sent">Best ${E(x.best)}% · ${E(x.n)} call${x.n === 1 ? "" : "s"}</span>${nt.comment ? `<span class="fb-chip sent">Your feedback ✓</span>` : `<span class="fb-chip draft">No feedback yet</span>`}</span></summary>
      <label class="fbc-full">Your feedback on the call<textarea id="tn_${sid}_${cssId(key)}" rows="3" placeholder="How the call went, what to keep doing, and what to say differently next time.">${E(nt.comment || "")}</textarea></label>
      <div class="fbc-actions"><button class="btn btn-primary btn-sm" onclick="cmTrainerNotes.save('${J(rec.id)}','${J(key)}')">Save feedback</button>${nt.at ? `<span class="cf-note">Saved ${E(when(nt.at))}${nt.by ? ` by ${E(nt.by)}` : ""}</span>` : ""}</div>
    </details>`; }).join("");
  return `<div class="sidebar-section-lbl" style="padding-left:0;margin-top:12px;">📞 Case Calls: your feedback</div>${rows || `<p class="cf-note">No case calls taken yet.</p>`}`;
}
/* 🎯 the Graded Calls taken on the Training Portal's Call Sim (callsim:<id>, the Portal's: read here, never written), each
   line's best call with a box: notes under "gc:<line key>". The record is read once per trainee opened, then the rows redraw. */
function gcPanel(rec, work, notes, sid){
  if(work.callsim === undefined && typeof sharedGet === "function"){
    work.callsim = null;
    sharedGet("callsim:" + rec.id).then(v => { work.callsim = v && typeof v === "object" ? v : {best: {}};
      const wrap = document.getElementById("adminRowsWrap"); if(wrap && typeof renderAdminRows === "function") wrap.innerHTML = renderAdminRows(); }).catch(() => { work.callsim = {best: {}}; });
  }
  const head = `<div class="sidebar-section-lbl" style="padding-left:0;margin-top:12px;">🎯 Graded Calls (Call Sim): your feedback</div>`;
  if(!work.callsim) return head + `<p class="cf-note">${work.callsim === null ? "Reading the trainee's graded calls…" : "No graded calls yet."}</p>`;
  const lines = Object.entries(work.callsim.best || {}).filter(([, b]) => b && typeof b.score === "number");
  const rows = lines.map(([k, b]) => { const key = "gc:" + k, nt = notes[key] || {};
    return `<details class="cf-tr tn-row"><summary><b>🎯 ${E(b.line || k.replace(/^line:/, ""))}</b>
        <span class="cf-tr-chips"><span class="fb-chip sent">Best ${E(b.score)}% · ${E(b.calls || 1)} call${(b.calls || 1) === 1 ? "" : "s"}</span>${nt.comment ? `<span class="fb-chip sent">Your feedback ✓</span>` : `<span class="fb-chip draft">No feedback yet</span>`}</span></summary>
      <label class="fbc-full">Your feedback on this line's calls<textarea id="tn_${sid}_${cssId(key)}" rows="3" placeholder="How the calls went, what to keep doing, and what to say differently next time.">${E(nt.comment || "")}</textarea></label>
      <div class="fbc-actions"><button class="btn btn-primary btn-sm" onclick="cmTrainerNotes.save('${J(rec.id)}','${J(key)}')">Save feedback</button>${nt.at ? `<span class="cf-note">Saved ${E(when(nt.at))}${nt.by ? ` by ${E(nt.by)}` : ""}</span>` : ""}</div>
    </details>`; }).join("");
  return head + (rows || `<p class="cf-note">No graded calls yet.</p>`);
}
/* 🛠 the Skill Builders the trainee has tried (trainee:<id>.practiceProgress), each with a box: notes under "sb:<toolId>" */
const SB_TOOLS = () => (typeof PRACTICE_TOOLS !== "undefined" && Array.isArray(PRACTICE_TOOLS)) ? PRACTICE_TOOLS : [];
function sbPanel(rec, notes, sid){
  const P = rec.practiceProgress || {}, tried = SB_TOOLS().filter(t => P[t.id]);
  const rows = tried.map(t => { const p = P[t.id] || {}, key = "sb:" + t.id, nt = notes[key] || {};
    return `<details class="cf-tr tn-row"><summary><b>🛠 Skill Builder</b> ${E(t.title)}
        <span class="cf-tr-chips"><span class="fb-chip sent">Best ${E(p.bestScore || 0)}% · ${E(p.runs || 0)} run${p.runs === 1 ? "" : "s"}</span>${nt.comment ? `<span class="fb-chip sent">Your feedback ✓</span>` : `<span class="fb-chip draft">No feedback yet</span>`}</span></summary>
      <label class="fbc-full">Your feedback for the trainee<textarea id="tn_${sid}_${cssId(key)}" rows="3" placeholder="What you saw, what to keep doing, and what to change next time.">${E(nt.comment || "")}</textarea></label>
      <div class="fbc-actions"><button class="btn btn-primary btn-sm" onclick="cmTrainerNotes.save('${J(rec.id)}','${J(key)}')">Save feedback</button>${nt.at ? `<span class="cf-note">Saved ${E(when(nt.at))}${nt.by ? ` by ${E(nt.by)}` : ""}</span>` : ""}</div>
    </details>`; }).join("");
  return `<div class="sidebar-section-lbl" style="padding-left:0;margin-top:12px;">🛠 Skill Builders: your feedback</div>${rows || `<p class="cf-note">No Skill Builders tried yet.</p>`}`;
}
async function save(id, blockId){
  if(!isTrainer()) return;
  const work = (state.traineeWork || {})[id]; if(!work) return;
  const el = document.getElementById(`tn_${cssId(id)}_${cssId(blockId)}`), text = String((el && el.value) || "").trim().slice(0, 4000);
  // re-read so a trainee's read mark or another trainer's note isn't written over
  const latest = (await sharedGet("feedback:" + id).catch(() => null)) || work.feedback || {days: {}};
  latest.days = latest.days || {};
  const acts = Object.assign({}, latest.activities);
  if(text) acts[blockId] = {comment: text, by: state.traineeName || "Trainer", at: new Date().toISOString()}; else delete acts[blockId];
  latest.activities = acts;
  const ok = await sharedSet("feedback:" + id, latest);
  if(!ok){ if(typeof toast === "function") toast("Couldn't save your feedback: check your connection and try again."); return; }
  work.feedback = latest;
  if(typeof toast === "function") toast(text ? (String(blockId).startsWith("sb:") ? "Feedback saved: the trainee sees it on the Skill Builder." : String(blockId).startsWith("call:") ? "Feedback saved: the trainee sees it on the call and under the activity." : String(blockId).startsWith("gc:") ? "Feedback saved: the trainee sees it on 🏅 My Performance, beside the line's score." : "Feedback saved: the trainee sees it under the activity's grade.") : "Feedback removed.");
  const wrap = document.getElementById("adminRowsWrap"); if(wrap && typeof renderAdminRows === "function") wrap.innerHTML = renderAdminRows();
}
if(typeof renderFeedbackAdmin === "function"){
  const __fbAdmin = renderFeedbackAdmin;
  renderFeedbackAdmin = function(rec){
    const html = __fbAdmin.apply(this, arguments);
    try{ return html + panel(rec); }catch(e){ return html; }
  };
}

/* ---------- the trainee: the note under the grade ---------- */
const noteOf = id => { const fb = state.myFeedbackRaw; const n = fb && fb.activities && fb.activities[id]; return n && n.comment ? n : null; };
function noteHtml(id){
  const n = noteOf(id); if(!n) return "";
  return `<div class="tn-note" data-tn="${E(id)}"><b>🧑‍🏫 Your trainer's feedback</b><p>${E(n.comment)}</p>${n.at ? `<small>${n.by ? E(n.by) + " · " : ""}${E(when(n.at))}</small>` : ""}</div>`;
}
function wrapView(){
  const G = window.CMAIGrader; if(!G || typeof G.view !== "function" || G.view.__tn) return;
  const __view = G.view;
  G.view = function(id){ const html = __view.apply(this, arguments); try{ return html + noteHtml(id) + noteHtml("call:" + id).replace("🧑‍🏫 Your trainer's feedback", "🧑‍🏫 Your trainer's feedback on the call"); }catch(e){ return html; } };
  G.view.__tn = true;
}
// a note saved since the trainee's page last read their record shows at once (the page redraws only for a new day's review)
if(typeof loadMyFeedbackCore === "function"){
  const __load = loadMyFeedbackCore;
  loadMyFeedbackCore = async function(){
    const before = JSON.stringify(((state.myFeedbackRaw || {}).activities) || {});
    const r = await __load.apply(this, arguments);
    try{ if(JSON.stringify(((state.myFeedbackRaw || {}).activities) || {}) !== before && (document.querySelector("[data-aig]") || ["practice", "tool", "openroleplay"].includes(state.view)) && typeof render === "function") render(); }catch(e){}
    return r;
  };
}
// 🛠 a Skill Builder's note: under the hub's cards, and at the top of the tool's briefing part (where its feedback lands)
if(typeof renderPracticeHub === "function"){
  const __hub = renderPracticeHub;
  renderPracticeHub = function(){
    const html = __hub.apply(this, arguments);
    try{ const ns = SB_TOOLS().map(t => noteOf("sb:" + t.id) ? `<h3 class="tn-sb-h">${E(t.title)}</h3>${noteHtml("sb:" + t.id)}` : "").join("");
      return ns ? html + `<div class="tn-sb">${ns}</div>` : html; }catch(e){ return html; }
  };
}
function wrapCalendar(){
  if(typeof window.renderCalendarBody !== "function" || window.renderCalendarBody.__tn) return;
  const __cal = window.renderCalendarBody;
  window.renderCalendarBody = function(body){
    const r = __cal.apply(this, arguments);
    try{ const scr = body && body.querySelectorAll(".wizard-screen"), n = noteHtml("sb:calendar");
      if(n && scr && scr[1] && !scr[1].querySelector(".tn-note")) scr[1].insertAdjacentHTML("afterbegin", n); }catch(e){}
    return r;
  };
  window.renderCalendarBody.__tn = true;
}
// 📞 the call screen of a call on John Doe's file: the trainer's note on it, under the call's plan
if(typeof renderOpenRoleplay === "function"){
  const __rp = renderOpenRoleplay;
  renderOpenRoleplay = function(){
    const html = __rp.apply(this, arguments), s = state.rpSession;
    try{ const n = s && s.cf ? noteHtml("call:" + s.cf.blockId) : ""; return n ? html + n.replace("🧑‍🏫 Your trainer's feedback", "🧑‍🏫 Your trainer's feedback on this call") : html; }catch(e){ return html; }
  };
}
wrapCalendar();
wrapView();
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", () => { wrapView(); wrapCalendar(); });

const css = document.createElement("style");
css.id = "cm-trainer-notes-css";
css.textContent = `
.tn-note{margin-top:12px;padding:10px 14px;background:#FFFBF3;border:2px solid #F3C99E;border-left:8px solid #1E2340;border-radius:12px;text-align:left;}
.tn-note b{display:block;font:800 17px/1.3 var(--font-ui);color:#1E2340;margin:0 0 4px;}
.tn-note p{margin:0;font:700 16px/1.45 var(--font-ui);color:#141A2E;white-space:pre-wrap;}
.tn-note small{display:block;margin-top:4px;font:700 16px/1.3 var(--font-ui);color:#4A5068;}
.tn-sb{margin-top:18px;} .tn-sb-h{margin:14px 0 0;font-size:15px;color:#1E2340;}
.tn-row .fb-evidence ul{margin:4px 0 6px;padding-left:18px;}
`;
document.head.appendChild(css);

window.cmTrainerNotes = {save, panel, noteHtml};
})();
