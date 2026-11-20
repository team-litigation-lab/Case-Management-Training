/* ============================================================
   ⚡ RUN NOW: every manual trigger a trainer has, in one menu on the Admin header and on the 🏅 Scorecard banner

   The owner: "Also put all manual triggers on the header." Each item calls the very function its own button calls (looked
   up when it is pressed, so nothing is copied), and the original buttons stay where they are:
     🤖 Run the AI check                  cmAiCheck.run            (⚙ Settings, js/cm-ai-check.js)
     🩺 Test the AI connection            studioTestAI             (✏️ Content Studio, index.html)
     🌙 Grade every Backup Drive now      cmDriveWork.gradeNow     (🔗 Trainee Drives → 🏅 Grade now, for each linked trainee:
                                                                   what the nightly run does, the AI written-work grading too)
     ↻ Refresh the data                   cmScorecard.refresh      (🏅 Scorecard → ↻ Refresh)
     ↻ Refresh trainee feedback           loadTraineeFeedbackAdmin (💬 Trainee Feedback → ↻ Refresh)
     ↻ Refresh activity submissions       daLoadReview             (Activities review → ↻ Refresh)
     ✨ Draft AI feedback for all new      daDraftAll               (Activities review → ✨ Draft feedback for all new)
   and, for the trainee picked in the menu:
     🏅 Grade their Backup Drive now      cmDriveWork.gradeNow     (🔗 Trainee Drives → 🏅 Grade now)
     📂 Grade Days 2–5 from their Drive   driveGradeFor            (👥 Trainee Audit → the trainee → 🏅 Grade now)
     🔄 Check their Drive for folders     driveCheckFor            (👥 Trainee Audit → the trainee → 🔄 Check now)
     ↻ Refresh their work                 loadTraineeWork          (👥 Trainee Audit → the trainee → ↻ Refresh work)
   What each did is said in the menu and in the toast (the AI check's error as it came back). Trainers only: a trainee,
   or a trainer's 👁 Trainee view, never sees it.
   window.cmRunNow: {html, run, list, who, toggle, state}.
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const S = {busy: "", last: "", ok: true, who: "", open: {}};
const isAdmin = () => typeof state !== "undefined" && !!state.isAdmin && !state.adminPreview;
// the function a button calls, as it is when pressed ("cmDriveWork.gradeNow" → window.cmDriveWork.gradeNow, bound)
function fnAt(path){
  const parts = path.split("."), name = parts.pop(); let o = window;
  for(const p of parts){ o = o && o[p]; if(!o) return null; }
  const f = o && o[name]; return typeof f === "function" ? f.bind(o) : null;
}
const people = () => ((typeof state !== "undefined" && state.adminData) || []).filter(r => r && r.approved === true && !r.rejected && !r.archived)
  .sort((a, b) => String(a.name || a.id).localeCompare(String(b.name || b.id)));
const nameOf = id => { const r = people().find(x => x.id === id); return r ? (r.name || id) : id; };
const driveMsg = id => { try{ return ((window.cmDriveWork && cmDriveWork.state && cmDriveWork.state().msg) || {})[id] || null; }catch(e){ return null; } };
const driveRep = id => ((typeof state !== "undefined" && state.driveReports) || {})[id] || {};

const LIST = [
  {id: "ai", label: "🤖 Run the AI check", fn: "cmAiCheck.run", where: "⚙ Settings → 🤖 Run the AI check",
    done: r => window.cmAiCheck && typeof cmAiCheck.summary === "function" ? cmAiCheck.summary(r) : r && r.ok ? `✅ AI grading works: answered in ${((r.ms || 0) / 1000).toFixed(1)} s${r.model ? ` (${r.model})` : ""}.` : `❌ AI grading doesn't work right now: ${(r && r.error) || "no answer"}`, ok: r => !!(r && r.ok)},
  {id: "studio", label: "🩺 Test the AI connection", fn: "studioTestAI", where: "✏️ Content Studio → 🩺 Test AI connection",
    done: () => String((state && state.studioMsg) || "AI connection tested."), ok: () => !/^❌|fail|couldn|error/i.test(String((state && state.studioMsg) || ""))},
  {id: "drives", label: "🌙 Grade every Backup Drive now", fn: "cmDriveWork.gradeNow", where: "🔗 Trainee Drives → 🏅 Grade now, for every linked trainee (the nightly run, on demand)", all: true},
  {id: "refresh", label: "↻ Refresh the data", fn: "cmScorecard.refresh", alt: "refreshAdminData", where: "🏅 Scorecard → ↻ Refresh",
    done: () => "↻ Reading every trainee's records again…"},
  {id: "tfb", label: "↻ Refresh trainee feedback", fn: "loadTraineeFeedbackAdmin", where: "💬 Trainee Feedback → ↻ Refresh",
    done: () => `✓ Trainee feedback read again (${(((state && state.tfbAdmin) || {}).items || []).length} entries).`},
  {id: "subs", label: "↻ Refresh activity submissions", fn: "daLoadReview", where: "Activities review → ↻ Refresh", done: () => "✓ Activity submissions read again."},
  {id: "drafts", label: "✨ Draft AI feedback for all new", fn: "daDraftAll", where: "Activities review → ✨ Draft feedback for all new submissions", before: "daLoadReview",
    done: () => "✨ Drafting finished: review and send each draft in the Activities review.", selfToast: true},
  {id: "work", one: true, label: "🏅 Grade their Backup Drive now", fn: "cmDriveWork.gradeNow", where: "🔗 Trainee Drives → 🏅 Grade now",
    done: (r, id) => { const m = driveMsg(id); return m ? `${m.ok ? "✓" : "❌"} ${nameOf(id)}: ${m.text}` : `✓ ${nameOf(id)}'s Drive graded.`; }, ok: (r, id) => { const m = driveMsg(id); return !m || m.ok; }},
  {id: "days", one: true, label: "📂 Grade Days 2–5 from their Drive", fn: "driveGradeFor", where: "👥 Trainee Audit → the trainee → 🏅 Grade now",
    done: (r, id) => { const p = driveRep(id); return p.checkErr ? `❌ ${nameOf(id)}: ${p.checkErr}` : `✓ ${nameOf(id)}'s Days 2–5 graded from their Drive.`; }, ok: (r, id) => !driveRep(id).checkErr},
  {id: "check", one: true, label: "🔄 Check their Drive for missing folders", fn: "driveCheckFor", where: "👥 Trainee Audit → the trainee → 🔄 Check now",
    done: (r, id) => { const p = driveRep(id); return p.checkErr ? `❌ ${nameOf(id)}: ${p.checkErr}` : `✓ ${nameOf(id)}'s Drive checked: ${(p.missing || []).length ? `${p.missing.length} folder${p.missing.length === 1 ? "" : "s"} missing` : "no folder missing"}.`; }, ok: (r, id) => !driveRep(id).checkErr},
  {id: "twork", one: true, label: "↻ Refresh their work", fn: "loadTraineeWork", where: "👥 Trainee Audit → the trainee → ↻ Refresh work", args: id => [id, true],
    done: (r, id) => `✓ ${nameOf(id)}'s work read again.`}
];

function paint(){
  document.querySelectorAll(".cmrn-st").forEach(el => { el.textContent = S.last; el.className = "cmrn-st" + (S.last ? (S.ok ? " ok" : " no") : ""); });
  document.querySelectorAll(".cmrn [data-run]").forEach(b => { b.disabled = !!S.busy; b.classList.toggle("on", S.busy === b.dataset.run); });
}
function say(text, ok, toastToo){
  S.last = text; S.ok = ok !== false; paint();
  if(toastToo !== false && typeof window.toast === "function") window.toast(text);
}
// every linked trainee's drive, one at a time, through 🏅 Grade now's own function
async function gradeAll(f){
  if(typeof window.loadDriveReports === "function" && !(state.driveReportsAt > 0)) { try{ await window.loadDriveReports(true); }catch(e){} }
  const ids = people().map(r => r.id).filter(id => driveRep(id).connected);
  if(!ids.length) return {text: "No trainee has linked a Backup Drive yet: nothing to grade.", ok: true};
  let ok = 0; const bad = [];
  for(let i = 0; i < ids.length; i++){
    S.last = `🌙 Grading ${nameOf(ids[i])}'s Drive (${i + 1} of ${ids.length})…`; paint();
    try{ await f(ids[i]); const m = driveMsg(ids[i]); if(m && !m.ok) bad.push(`${nameOf(ids[i])}: ${m.text}`); else ok++; }catch(e){ bad.push(`${nameOf(ids[i])}: ${(e && e.message) || e}`); }
  }
  return {text: `${bad.length ? "❌" : "✓"} ${ok} of ${ids.length} Backup Drive${ids.length === 1 ? "" : "s"} graded${bad.length ? `; ${bad.length} couldn't be: ${bad[0]}` : ""}.`, ok: !bad.length};
}
async function run(id){
  if(!isAdmin() || S.busy) return null;
  const t = LIST.find(x => x.id === id); if(!t) return null;
  const f = fnAt(t.fn) || (t.alt ? fnAt(t.alt) : null);
  if(!f){ say(`${t.label}: not available on this page right now (${t.where}).`, false); return null; }
  const who = t.one ? (S.who || (people()[0] || {}).id || "") : "";
  if(t.one && !who){ say("Pick a trainee first.", false); return null; }
  S.busy = id; say(`${t.label}…`, true, false);
  let res = null, text, ok;
  try{
    if(t.all){ const x = await gradeAll(f); text = x.text; ok = x.ok; }
    else {
      if(t.before){ const b = fnAt(t.before); if(b) await b(); }
      res = await f(...(t.args ? t.args(who) : t.one ? [who] : []));
      text = t.done ? t.done(res, who) : `✓ ${t.label}: done.`; ok = t.ok ? t.ok(res, who) : true;
    }
  }catch(e){ text = `❌ ${t.label}: ${(e && e.message) || e}`; ok = false; }
  S.busy = ""; say(text, ok, !t.selfToast || !ok);
  return res;
}
function html(where){
  if(!isAdmin()) return "";
  where = where || "header";
  const ppl = people(); if(S.who && !ppl.some(r => r.id === S.who)) S.who = "";
  const btn = t => `<button type="button" data-run="${t.id}" title="Runs what ${E(t.where)} runs" onclick="cmRunNow.run('${t.id}')"${S.busy ? " disabled" : ""}>${E(t.label)}</button>`;
  return `<details class="cmrn cmrn-${E(where)}"${S.open[where] ? " open" : ""} ontoggle="cmRunNow.toggle('${E(where)}', this.open, this)"><summary title="Every manual trigger: grading, AI checks, refreshes">⚡ Run now</summary>
    <div class="cmrn-pop" role="group" aria-label="Manual triggers">
      <p class="cmrn-st${S.last ? (S.ok ? " ok" : " no") : ""}" aria-live="polite">${E(S.last)}</p>
      <div class="cmrn-g"><b>The whole course</b>${LIST.filter(t => !t.one).map(btn).join("")}</div>
      <div class="cmrn-g"><b>One trainee</b><select aria-label="The trainee to run it for" onchange="cmRunNow.who(this.value)">${ppl.map(r => `<option value="${E(r.id)}"${r.id === S.who ? " selected" : ""}>${E(r.name || r.id)}</option>`).join("") || `<option value="">No approved trainee yet</option>`}</select>${LIST.filter(t => t.one).map(btn).join("")}</div>
    </div></details>`;
}

// the open menu stays inside the window (a laptop's 768px too): it scrolls within what is left below its button
function fit(el){
  const p = el.querySelector(".cmrn-pop"); if(!p) return;
  p.style.maxHeight = ""; const top = p.getBoundingClientRect().top;
  p.style.maxHeight = Math.max(160, Math.floor(window.innerHeight - Math.max(0, top) - 12)) + "px";
  const r = p.getBoundingClientRect(); if(r.right > window.innerWidth - 8){ p.style.left = "auto"; p.style.right = "0"; }
}
// the Admin header (js/cm-admin-shell.js): the menu at the end of the section pills
function hookHeader(){
  const out = window.cmAdminOut; if(typeof out !== "function" || out.__cmrn) return;
  const me = function(fn, h){
    const r = out.apply(this, arguments);
    if(typeof r !== "string" || r === h || !isAdmin()) return r;
    const at = r.indexOf('<div class="cmsh-row"'); if(at < 0) return r;
    return r.slice(0, at) + `<div class="cmrn-bar">${html("header")}</div>` + r.slice(at);
  };
  me.__cmrn = true; window.cmAdminOut = me;
}
hookHeader(); document.addEventListener("DOMContentLoaded", hookHeader); window.addEventListener("load", hookHeader);

window.cmRunNow = {html, run, list: () => LIST.map(t => ({id: t.id, label: t.label, fn: t.fn, where: t.where, one: !!t.one})),
  who(id){ S.who = id || ""; }, toggle(where, open, el){ S.open[where] = !!open; if(open && el) fit(el); }, state: S};

const css = document.createElement("style"); css.id = "cm-run-now";
css.textContent = `
.admin-tabs.cmsh-tabs{position:relative;}
.cmrn-bar{position:absolute;top:2px;right:2px;z-index:30;}
.cmrn{position:relative;display:inline-block;font:700 15px Arial,sans-serif;}
.cmrn > summary{list-style:none;cursor:pointer;padding:7px 14px;border-radius:999px;border:2px solid #DB8437;background:#FFF3E6;color:#1E2340;font:800 15px Arial,sans-serif;white-space:nowrap;}
.cmrn > summary::-webkit-details-marker{display:none;}
.cmrn[open] > summary{background:#DB8437;color:#fff;}
.cmrn-pop{position:absolute;right:0;top:calc(100% + 6px);width:360px;max-width:calc(100vw - 32px);max-height:calc(100vh - 260px);overflow:auto;background:#fff;color:#141A2E;border:2px solid #1E2340;border-radius:12px;box-shadow:0 12px 30px rgba(14,18,40,.3);padding:10px 12px;z-index:60;text-align:left;}
.cmrn-g{display:flex;flex-direction:column;gap:4px;margin-bottom:8px;} .cmrn-g > b{font:800 14px Arial,sans-serif;color:#5F6368;text-transform:uppercase;letter-spacing:.04em;}
.cmrn-g button{text-align:left;border:1.5px solid #9CA3BD;background:#fff;color:#1E2340;border-radius:8px;padding:5px 10px;font:700 15px Arial,sans-serif;cursor:pointer;white-space:normal;}
.cmrn-g button:hover{border-color:#1E2340;background:#F4F5F9;} .cmrn-g button:disabled{opacity:.55;cursor:wait;} .cmrn-g button.on{border-color:#DB8437;background:#FFF3E6;}
.cmrn-g select{font:700 15px Arial,sans-serif;padding:6px 8px;border:1.5px solid #9CA3BD;border-radius:8px;}
.cmrn-st{margin:0 0 6px;font:700 14.5px/1.4 Arial,sans-serif;color:#2E3450;} .cmrn-st:empty{display:none;} .cmrn-st.ok{color:#0B5D1E;} .cmrn-st.no{color:#A50E0E;}
.scx-banner .gs-menu .cmrn > summary{border:2px solid #DB8437;background:#FFF3E6;color:#1E2340;padding:5px 10px;border-radius:7px;font:800 13px Arial,sans-serif;}
.scx-banner .gs-menu .cmrn-g button{border:1.5px solid #9CA3BD;background:#fff;color:#1E2340;box-shadow:none;font:700 15px Arial,sans-serif;padding:5px 10px;white-space:normal;}
.scx-banner .gs-menu .cmrn-pop{left:0;right:auto;}
@media(max-width:760px){ .cmrn-bar{position:static;margin:0 0 8px;} .cmrn-pop{left:0;right:auto;} }
`;
document.head.appendChild(css);
})();
