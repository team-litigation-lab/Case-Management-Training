/* ============================================================
   🔁 RESET KNOWLEDGE CHECK: a trainer reopens one Case Flow day's Knowledge Check for one trainee
   Knowledge Checks take one attempt (js/cm-kc-once.js). A trainer may reopen one, once at a time:
   • Admin → 🛡 Admin Master Control → 👥 Trainee Audit → a trainee's detail: "🔁 Reset Knowledge Check" on every Case
     Flow day the trainee has an attempt on, and the day's reset log (who, when) under it.
   • The reset is written on the trainee's record, trainee:<id>.kcReset = {<dayId>: {at, by, log: [{at, by}, …]}}: a
     field only a trainer writes (worker.js PROTECTED_TRAINEE_FIELDS). worker.js keepKcAttempts (kcRetake) then lets the
     trainee's next write add exactly ONE new attempt to that day, dated by the Worker; another needs another reset.
   • On the trainee's page the record's kcReset is read at sign-in, before the check opens again (✓ Finish Training,
     🔁 Retake) and before a submit (js/cm-kc-once.js reads the record there): a reset not used yet reopens the check, and
     🔁 Retake on the day card unlocks once. The day keeps its best score, the first attempt's or the new one's: nothing
     already recorded is recalculated.
   • A reset not used yet is "reopened": the trainee detail says so (⏳ waiting for the new attempt) and offers no second
     reset until it is used.
   ============================================================ */
(function(){
"use strict";
if(typeof state === "undefined" || typeof DAYS === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const J = s => E(String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
const say = m => { if(typeof toast === "function") toast(m); };
const cfDays = () => DAYS.filter(d => d && d.cf);
const t = s => { const x = Date.parse(s || ""); return Number.isFinite(x) ? x : NaN; };
const when = s => { const d = new Date(s); return isNaN(d) ? "" : d.toLocaleString("en-US", {month: "2-digit", day: "2-digit", year: "numeric", hour: "numeric", minute: "2-digit"}); };
const attempts = p => !p ? 0 : Array.isArray(p.history) && p.history.length ? p.history.length : typeof p.score === "number" ? 1 : 0;

state.kcReset = state.kcReset || {};
/* a day's reset, reopening its check: newer than the first attempt and no attempt after it (the Worker's rule, kcRetake) */
function openIn(reset, p){
  const r = reset && t(reset.at); if(!Number.isFinite(r) || !attempts(p)) return false;
  const h = Array.isArray(p.history) ? p.history : [], first = t((h[0] || p).date);
  if(Number.isFinite(first) && first >= r) return false;
  return !h.some(x => x && t(x.date) > r);
}
const ownProg = id => ((state.progress || {})[id]) || null;
function reopened(id, p){ return openIn((state.kcReset || {})[id], p || ownProg(id)); }
/* the attempts since the day's first reset (they count for the best score; the old score is never recalculated) */
function since(p){
  if(!p || !Array.isArray(p.history)) return [];
  const id = Object.keys(state.progress || {}).find(k => state.progress[k] === p);
  const rs = id != null ? (state.kcReset || {})[id] : null, log = rs && Array.isArray(rs.log) && rs.log.length ? rs.log : rs ? [rs] : [];
  const r0 = Math.min(...log.map(x => t(x.at)).filter(Number.isFinite));
  return Number.isFinite(r0) ? p.history.slice(1).filter(x => x && t(x.date) > r0) : [];
}
function take(rec){ if(rec && typeof rec === "object") state.kcReset = rec.kcReset && typeof rec.kcReset === "object" ? rec.kcReset : {}; }
async function load(){
  if(!state.traineeId || state.isAdmin) return;
  try{ const rec = typeof sharedGet === "function" ? await sharedGet("trainee:" + state.traineeId) : null; take(rec); }catch(e){}
}
window.cmKcReset = {reopened, since, take, load, openIn};

/* the trainee's page: the record's resets, read once the page has signed in, at a later sign-in, once a minute while
   the dashboard or a day is open, and before the check opens again; a newly reopened check redraws the page */
const sig = () => JSON.stringify(state.kcReset || {});
async function refresh(){
  if(!state.traineeId || state.isAdmin) return;
  const was = sig(); await load();
  if(sig() !== was && ["dashboard", "day"].includes(state.view) && typeof render === "function" && !(typeof isTyping === "function" && isTyping())) render();
}
(function boot(k){ if(state.traineeId) return refresh(); if(k < 30) setTimeout(() => boot(k + 1), 1000); })(0);
setInterval(() => { if(document.visibilityState === "visible" && ["dashboard", "day"].includes(state.view)) refresh().catch(() => {}); }, 60000);
if(typeof loadAll === "function"){
  const __loadAll = loadAll;
  loadAll = async function(){ const r = await __loadAll.apply(this, arguments); try{ await load(); }catch(e){} return r; };
}
["finishTrainingForDay", "retakeQuiz"].forEach(name => {
  const f = window[name]; if(typeof f !== "function") return;
  // (it opens as it always did, at once; the record is read meanwhile, and a reset found there reopens the check)
  const w = function(id){ const args = arguments, self = this, was = reopened(id), r = f.apply(self, args);
    if(!was && state.traineeId && !state.isAdmin) load().then(() => { if(!reopened(id)) return;
      state.quizSubmitted = false; state.quizAnswers = {}; f.apply(self, args); if(typeof render === "function") render(); }).catch(() => {});
    return r; };
  window[name] = w; try{ if(name === "retakeQuiz") retakeQuiz = w; else finishTrainingForDay = w; }catch(e){}
});

/* ---------- the trainer: 🔁 Reset Knowledge Check in a trainee's detail ---------- */
const byName = () => String(((state.certSettings || {}).trainerName) || "").trim() || "Trainer";
async function reset(traineeId, dayId){
  if(!state.isAdmin || state.adminPreview) return;
  const d = cfDays().find(x => x.id === Number(dayId)); if(!d) return;
  let rec = null;
  try{ rec = typeof sharedGetStrict === "function" ? await sharedGetStrict("trainee:" + traineeId) : await sharedGet("trainee:" + traineeId); }catch(e){ rec = null; }
  if(!rec){ say("Couldn't load that trainee: refresh and try again."); return; }
  const p = (rec.dayProgress || {})[d.id];
  if(!attempts(p)){ say(`Nothing to reset: no Knowledge Check attempt on Case Flow Day ${d.cf.n}.`); return; }
  const cur = (rec.kcReset || {})[d.id];
  if(openIn(cur, p)){ say(`Case Flow Day ${d.cf.n}'s check is already reopened: waiting for the new attempt.`); return; }
  if(typeof confirm === "function" && !confirm(`Reset Case Flow Day ${d.cf.n}'s Knowledge Check for ${rec.name || "this trainee"}?\n\nThey get ONE new attempt. Their best score is kept; nothing already recorded changes.`)) return;
  const at = new Date().toISOString(), by = byName();
  rec.kcReset = Object.assign({}, rec.kcReset || {}, {[d.id]: {at, by, log: ((cur && Array.isArray(cur.log)) ? cur.log : []).concat([{at, by}])}});
  if(!(await sharedSet("trainee:" + traineeId, rec))){ say("Not saved: check your connection and try again."); return; }
  if(state.adminData){ const i = state.adminData.findIndex(r => r.id === traineeId); if(i !== -1) state.adminData[i] = rec; }
  say(`Case Flow Day ${d.cf.n}'s Knowledge Check reopened for ${rec.name || "the trainee"}: one new attempt. Their page picks it up when they open the check.`);
  const wrap = document.getElementById("adminRowsWrap");
  if(wrap && typeof renderAdminRows === "function") wrap.innerHTML = renderAdminRows(); else if(typeof render === "function") render();
}
window.cmKcReset.reset = reset;
function panel(rec){
  const dp = (rec && rec.dayProgress) || {}, rs = (rec && rec.kcReset) || {};
  const rows = cfDays().map(d => {
    const p = dp[d.id], n = attempts(p), r = rs[d.id], log = r && Array.isArray(r.log) ? r.log : r ? [r] : [];
    const open = openIn(r, p), score = p && typeof p.score === "number" ? `${p.score}%${p.done ? " ✓" : ""}` : "";
    const btn = !n ? `<span class="kcr-none">No attempt yet</span>`
      : open ? `<span class="kcr-wait" title="Reset ${E(when(r.at))} by ${E(r.by || "a trainer")}">⏳ Reopened: waiting for the new attempt</span>`
      : `<button type="button" class="btn btn-sm btn-ghost kcr-btn" data-kcr-day="${d.id}" onclick="cmKcReset.reset('${J(rec.id)}', ${d.id})" title="Give ${E(rec.name || "this trainee")} one new attempt at this day's Knowledge Check (the best score is kept)">🔁 Reset Knowledge Check</button>`;
    return `<li class="kcr-row"><div class="kcr-h"><b>Case Flow Day ${d.cf.n}</b><span>${n ? `${n} attempt${n === 1 ? "" : "s"} · ${score}` : ""}</span>${btn}</div>${log.length ? `<ul class="kcr-log">${log.map(x => `<li>🔁 Reset ${E(when(x.at))} by ${E(x.by || "a trainer")}</li>`).join("")}</ul>` : ""}</li>`;
  }).join("");
  return `<div class="kcr-panel"><div class="sidebar-section-lbl" style="padding-left:0;">🔁 Knowledge Check resets</div><ul class="kcr-list">${rows}</ul></div>`;
}
if(typeof window.renderAdminDetail === "function"){
  const __detail = window.renderAdminDetail;
  window.renderAdminDetail = function(rec){
    const out = __detail.apply(this, arguments);
    try{ if(rec && rec.id) return String(out).replace(/<\/div>\s*$/, panel(rec) + "</div>"); }catch(e){ console.warn("[kc-reset]", e); }
    return out;
  };
}

const st = document.createElement("style"); st.id = "cm-kc-reset"; st.textContent = `
.kcr-panel{margin-top:16px;}
.kcr-list{list-style:none;margin:6px 0 0;padding:0;display:flex;flex-direction:column;gap:4px;}
.kcr-row{border-bottom:1px dashed var(--line,#E3E6EE);padding:4px 0;}
.kcr-h{display:flex;align-items:center;gap:10px;flex-wrap:wrap;font-size:13px;color:#1E2340;}
.kcr-h > b{min-width:130px;} .kcr-h > span:not(.kcr-wait):not(.kcr-none){color:var(--ink-soft,#5B6178);}
.kcr-btn{margin-left:auto;font-weight:700;}
.kcr-wait{margin-left:auto;font-weight:700;color:#A4470F;} .kcr-none{margin-left:auto;color:var(--ink-soft,#8A90A6);}
.kcr-log{list-style:none;margin:2px 0 0 140px;padding:0;font-size:12.5px;color:#4A5170;}
`;
document.head.appendChild(st);
})();
