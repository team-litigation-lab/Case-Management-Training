/* ============================================================
   📤 SEND PROGRESS: a trainer sends a trainee their progress, with their own feedback

   The owner: "allow Sending Progress to trainees With trainer having the ability to Add a feedback".
   • The trainer: on a trainee's card in 🏅 Scorecard (js/cm-scorecard.js), and on their row of 🏅 Scores, 📤 Send progress
     opens a panel: a preview of the trainee's progress as it stands (js/cm-batch-sheet.js snapshot: the Overall and the
     Result, each day's score, slides and work, each practical activity's score with what they did well, what to improve
     and why, and what is missing or failed), the trainer's feedback (one note, and a note per day if they want), and Send.
     "Send to everyone shown" sends each trainee shown their own progress with the same note. The card then says
     "Sent <date> · Read <date>" (or "Not read yet") for the latest reports.
   • Kept in the trainee's own feedback:<id> record, as reports: [{id, at, by, snapshot, note, dayNotes}], newest last
     (the latest 30). The record is read again just before it is written, so the trainee's own reviews and another
     trainer's report aren't lost. The Worker keeps the reports as the trainer's (worker.js OWNED.feedback): a trainee's
     save can't change or drop them.
   • The trainee: 📒 My Progress Log (js/cm-progress-log.js) opens with 📬 Progress from your trainer, the newest first,
     a "new" badge on the ones not opened yet, and a toast once a session when one is new. Opening one marks it read:
     the time is kept in the trainee's own progress (progress-reports-read: {<report id>: <time>}), which the trainer's
     card reads for its "Read <date>". The trainee never writes the report itself.
   window.cmSendProgress: {cardHtml, open, close, send, sendAll, read, inboxHtml, state}.
   ============================================================ */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || typeof state === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const J = s => String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'");
const READ_KEY = "progress-reports-read";
if(typeof registerPersonalKeys === "function") registerPersonalKeys([READ_KEY]);
const S = {open: null, busy: false, msg: "", ok: true, read: null, toasted: false, shown: {}};
const isTrainer = () => !!state.isAdmin && !state.adminPreview;
const isTrainee = () => !!state.traineeId && !state.isAdmin;
const DT = new Intl.DateTimeFormat(undefined, {month: "short", day: "numeric", hour: "numeric", minute: "2-digit"});
const when = v => { const d = v ? new Date(v) : null; return d && isFinite(d) ? DT.format(d) : ""; };
const tone = p => p == null ? "" : p >= 85 ? "sp-hi" : p >= 70 ? "sp-mid" : "sp-lo";
const rows = () => (window.cmScorecard && cmScorecard.rows ? cmScorecard.rows() : []);
const rowOf = id => rows().find(r => r.id === id) || null;
const reportsOf = r => { const fb = (r && r.c && r.c.fb) || {}; return Array.isArray(fb.reports) ? fb.reports : []; };
const readOf = r => ((r && r.c && r.c.data) || {})[READ_KEY] || {};

/* ---------- the snapshot, as both the trainer's preview and the trainee's report show it ---------- */
function snapHtml(s, note, dayNotes){
  if(!s) return "";
  const li = xs => xs.map(x => E(x)).join(" · ");
  return `<div class="sp-snap">
    <div class="sp-pills"><span class="sp-pill ${tone(s.overall)}">Overall <b>${s.overall == null ? "—" : s.overall + "%"}</b></span><span class="sp-pill ${s.pass ? "sp-hi" : s.overall == null ? "" : "sp-lo"}">${E(s.result || "Not scored yet")}</span></div>
    ${note ? `<div class="sp-note"><b>💬 Your trainer's feedback</b><p>${E(note)}</p></div>` : ""}
    <table class="sp-days"><thead><tr><th>Day</th><th>Score</th><th>Slides</th><th>The day's work</th></tr></thead><tbody>
      ${(s.days || []).map(d => `<tr><td><b>Day ${d.n}</b><small>${E(d.title)}</small></td><td class="${tone(d.score)}">${d.score == null ? "—" : d.score + "%"}</td><td>${E(d.slides || "")}</td><td>${E(d.summary || "Nothing yet")}</td></tr>`).join("")}
    </tbody></table>
    ${(s.days || []).filter(d => (d.practical || []).length || (dayNotes || {})[d.n]).map(d => `<details class="sp-day"><summary><b>Day ${d.n}</b> ${E(d.title)} <em>${(d.practical || []).length} practical activit${(d.practical || []).length === 1 ? "y" : "ies"}</em></summary>
      ${(dayNotes || {})[d.n] ? `<div class="sp-note"><b>💬 Your trainer on Day ${d.n}</b><p>${E(dayNotes[d.n])}</p></div>` : ""}
      ${(d.practical || []).map(y => `<div class="sp-it"><div class="sp-ith"><span>${E(y.name)}</span><b class="${tone(y.pct)}">${y.pct == null ? E(y.status || "Not scored") : "Score " + y.pct + "%"}</b></div>
        ${y.best.length ? `<p><b>⭐ What you did well:</b> ${li(y.best)}</p>` : ""}${y.improve.length ? `<p><b>🔧 What to improve:</b> ${li(y.improve)}</p>` : ""}${y.why ? `<p><b>🧾 Why:</b> ${E(y.why)}</p>` : ""}</div>`).join("")}</details>`).join("")}
    ${(s.missing || []).length ? `<div class="sp-miss"><b>⚠ Missing or failed</b><ul>${s.missing.map(m => `<li>${E(m)}</li>`).join("")}</ul></div>` : `<p class="sp-ok">✓ Nothing missing or failed.</p>`}
  </div>`;
}

/* ---------- the trainer ---------- */
function cardHtml(r){
  if(!isTrainer() || !r) return "";
  const reps = reportsOf(r).slice(-3).reverse(), rd = readOf(r);
  return `<div class="sp-card"><button type="button" class="btn btn-navy btn-sm sp-go" onclick="cmSendProgress.open('${J(r.id)}')">📤 Send progress</button>
    ${reps.length ? `<span class="sp-sent">${reps.map(x => `<span class="sp-rcpt${rd[x.id] ? " read" : ""}" data-report="${E(x.id)}">Sent ${E(when(x.at))} · ${rd[x.id] ? `Read ${E(when(rd[x.id]))}` : "Not read yet"}</span>`).join("")}</span>` : `<span class="sp-sent sp-none">No progress sent yet</span>`}</div>`;
}
function panelHtml(){
  const r = rowOf(S.open); if(!r) return "";
  let snap = null; try{ snap = window.cmBatchSheet && cmBatchSheet.snapshot ? cmBatchSheet.snapshot(r) : null; }catch(e){ snap = null; }
  const shown = window.cmScorecard && cmScorecard.shown ? cmScorecard.shown().length : 0;
  return `<div class="sp-back" onclick="if(event.target===this)cmSendProgress.close()"><div class="sp-panel" role="dialog" aria-label="Send progress to ${E(r.name)}">
    <div class="sp-ph"><h3>📤 Send progress to ${E(r.name)}</h3><button type="button" class="sp-x" onclick="cmSendProgress.close()" aria-label="Close">✕</button></div>
    <p class="sp-sub">What ${E(r.name)} will see in their 📒 Progress Log, as it stands now:</p>
    ${snap ? snapHtml(snap) : `<p class="sp-sub">Their progress couldn't be read: refresh the page and try again.</p>`}
    <label class="sp-lab" for="spNote">💬 Trainer's feedback</label>
    <textarea id="spNote" rows="4" placeholder="What they did well, what to work on next…"></textarea>
    <details class="sp-perday"><summary>Add a note for a day</summary>${(snap ? snap.days : []).map(d => `<label class="sp-lab" for="spDay${d.n}">Day ${d.n} · ${E(d.title)}</label><textarea id="spDay${d.n}" rows="2"></textarea>`).join("")}</details>
    <div class="sp-acts"><button type="button" class="btn btn-navy" id="spSend" onclick="cmSendProgress.send()" ${S.busy || !snap ? "disabled" : ""}>📤 Send to ${E(r.name)}</button>
      ${shown > 1 ? `<button type="button" class="btn btn-ghost" onclick="cmSendProgress.sendAll()" ${S.busy ? "disabled" : ""} title="Each trainee shown gets their own progress with this note (the day notes are for ${E(r.name)} only)">Send to everyone shown (${shown})</button>` : ""}
      <span class="sp-msg ${S.ok ? "" : "bad"}" aria-live="polite">${E(S.msg)}</span></div>
  </div></div>`;
}
function paint(){
  let el = document.getElementById("spRoot");
  if(!S.open){ if(el) el.remove(); return; }
  if(!el){ el = document.createElement("div"); el.id = "spRoot"; document.body.appendChild(el); }
  const keep = {}; el.querySelectorAll("textarea").forEach(t => { keep[t.id] = t.value; });
  el.innerHTML = panelHtml();
  Object.entries(keep).forEach(([id, v]) => { const t = document.getElementById(id); if(t) t.value = v; });
}
function open(id){ if(!isTrainer()) return; S.open = id; S.msg = ""; S.ok = true; paint(); setTimeout(() => { const t = document.getElementById("spNote"); if(t) t.focus(); }, 30); }
function close(){ S.open = null; paint(); }
const who = () => state.traineeName || "Your trainer";
// one trainee's report, written into their feedback:<id> read again just before (their reviews and others' reports kept)
async function sendTo(r, note, dayNotes){
  const snap = cmBatchSheet.snapshot(r);
  const key = "feedback:" + r.id, fb = (await sharedGet(key)) || {};
  if(!fb.days || typeof fb.days !== "object") fb.days = {};
  const rep = {id: "rp" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6), at: new Date().toISOString(), by: who(), snapshot: snap, note: String(note || "").slice(0, 4000)};
  const dn = {}; Object.entries(dayNotes || {}).forEach(([n, v]) => { v = String(v || "").trim(); if(v) dn[n] = v.slice(0, 2000); }); if(Object.keys(dn).length) rep.dayNotes = dn;
  fb.reports = (Array.isArray(fb.reports) ? fb.reports : []).concat([rep]).slice(-30);
  const ok = await sharedSet(key, fb);
  if(ok === false) throw new Error("couldn't save to the server");
  if(r.c) r.c.fb = fb;   // the card shows it at once
  return rep;
}
const noteNow = () => (document.getElementById("spNote") || {}).value || "";
async function send(){
  const r = rowOf(S.open); if(!r || S.busy || !isTrainer()) return null;
  const dayNotes = {}; (window.cmBatchSheet ? cmBatchSheet.snapshot(r).days : []).forEach(d => { const t = document.getElementById("spDay" + d.n); if(t && t.value.trim()) dayNotes[d.n] = t.value; });
  S.busy = true; S.msg = "Sending…"; S.ok = true; paint();
  let rep = null;
  try{ rep = await sendTo(r, noteNow(), dayNotes); S.msg = `✓ Sent to ${r.name}.`; if(typeof toast === "function") toast(`📤 Progress sent to ${r.name}.`); }
  catch(e){ S.ok = false; S.msg = `Couldn't send: ${(e && e.message) || e}`; }
  S.busy = false; paint(); if(S.ok){ close(); if(typeof render === "function") render(); }
  return rep;
}
async function sendAll(){
  if(S.busy || !isTrainer() || !window.cmScorecard) return 0;
  const list = cmScorecard.shown(), note = noteNow();
  if(!list.length || !confirm(`Send each of the ${list.length} trainees shown their own progress, with this note?`)) return 0;
  S.busy = true; S.ok = true; let n = 0; const bad = [];
  for(const r of list){ S.msg = `Sending ${n + 1} of ${list.length}…`; paint(); try{ await sendTo(r, note); n++; }catch(e){ bad.push(r.name); } }
  S.busy = false; S.ok = !bad.length; S.msg = `✓ Sent to ${n} of ${list.length}${bad.length ? `; not sent: ${bad.join(", ")}` : ""}.`; paint();
  if(typeof toast === "function") toast(`📤 Progress sent to ${n} trainee${n === 1 ? "" : "s"}.`);
  if(!bad.length){ close(); if(typeof render === "function") render(); }
  return n;
}

/* ---------- the trainee: 📬 Progress from your trainer, in 📒 My Progress Log ---------- */
const myReports = () => { const fb = state.myFeedbackRaw || {}; return (Array.isArray(fb.reports) ? fb.reports : []).slice().reverse(); };
async function loadRead(){ if(S.read || typeof storeGet !== "function") return S.read || {}; try{ S.read = (await storeGet(READ_KEY)) || {}; }catch(e){ S.read = {}; } return S.read; }
const unread = () => myReports().filter(x => !(S.read || {})[x.id]);
function inboxHtml(){
  const reps = myReports(); if(!isTrainee() || !reps.length) return "";
  const rd = S.read || {}, n = reps.filter(x => !rd[x.id]).length;
  return `<div class="sp-in" id="spInbox"><h3>📬 Progress from your trainer ${n ? `<span class="sp-badge">${n} new</span>` : ""}</h3>
    ${reps.map(x => `<details class="sp-rep${rd[x.id] ? "" : " new"}" data-report="${E(x.id)}"${S.shown[x.id] ? " open" : ""} ontoggle="cmSendProgress.toggle('${J(x.id)}', this.open)"><summary>Sent ${E(when(x.at))}${x.by ? ` by ${E(x.by)}` : ""}${rd[x.id] ? ` <small>· read ${E(when(rd[x.id]))}</small>` : ` <span class="sp-badge">New</span>`}</summary>
      ${snapHtml(x.snapshot, x.note, x.dayNotes)}</details>`).join("")}</div>`;
}
async function read(id){
  if(!isTrainee()) return;
  await loadRead(); if(S.read[id]) return;
  S.read = Object.assign({}, S.read, {[id]: new Date().toISOString()});
  try{ await storeSet(READ_KEY, S.read); if(typeof cloudSaveNow === "function") await cloudSaveNow(); }catch(e){}
  const b = document.querySelector(`#spInbox details[data-report="${CSS.escape(id)}"]`); if(b){ b.classList.remove("new"); const s = b.querySelector("summary .sp-badge"); if(s) s.outerHTML = ` <small>· read ${E(when(S.read[id]))}</small>`; }
  const h = document.querySelector("#spInbox h3 .sp-badge"), n = unread().length; if(h){ if(n) h.textContent = `${n} new`; else h.remove(); }
}
// once the trainee's feedback is read (index.html loadMyFeedbackCore): a toast, once a session, when a report is new
if(typeof window.loadMyFeedbackCore === "function"){
  const __core = window.loadMyFeedbackCore;
  window.loadMyFeedbackCore = async function(){ const r = await __core.apply(this, arguments);
    try{ if(isTrainee()){ await loadRead(); const n = unread().length;
      if(n && !S.toasted){ S.toasted = true; if(typeof toast === "function") toast(`📬 Your trainer sent you your progress: open 📒 Progress Log.`); if(state.view === "dashboard" && typeof render === "function") render(); } } }catch(e){}
    return r; };
}
// the section opens 📒 My Progress Log on the dashboard
if(typeof window.renderDashboard === "function"){
  const __dash = window.renderDashboard;
  window.renderDashboard = function(){
    const html = __dash.apply(this, arguments);
    if(!isTrainee()) return html;
    let box = ""; try{ if(!S.read) loadRead().then(() => { if(state.view === "dashboard" && myReports().length && typeof render === "function") render(); }); box = inboxHtml(); }catch(e){ box = ""; }
    if(!box) return html;
    const t = document.createElement("template"); t.innerHTML = html;
    const log = t.content.querySelector("#myProgressLog .plog-h");
    if(!log) return html;
    log.insertAdjacentHTML("afterend", box);
    return t.innerHTML;
  };
}

// (a report the trainee opened stays open when the page is drawn again)
function toggle(id, isOpen){ S.shown[id] = !!isOpen; if(isOpen) read(id); }
window.cmSendProgress = {cardHtml, open, close, send, sendAll, read, toggle, inboxHtml, snapHtml, state: S};

const css = document.createElement("style"); css.id = "cm-send-progress";
css.textContent = `
/* the 📤 on a trainee's row of 🏅 Scores (its icon drawn by CSS, so the cell's text stays the trainee's name) */
.sp-row{margin-left:8px;border:1.5px solid #DB8437;background:#FFF3E6;border-radius:6px;padding:1px 6px;cursor:pointer;font:700 14px Arial,sans-serif;vertical-align:middle;} .sp-row::before{content:"📤";}
.sp-card{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin:10px 0 0;font:700 14.5px Arial,sans-serif;color:#2E3450;}
.sp-sent{display:flex;flex-wrap:wrap;gap:6px;} .sp-rcpt{padding:3px 10px;border-radius:999px;background:#FFF4E0;color:#7A4B00;} .sp-rcpt.read{background:#E6F4EA;color:#0B5D1E;} .sp-none{color:#5F6368;}
.sp-back{position:fixed;inset:0;background:rgba(14,18,40,.45);z-index:900;display:flex;align-items:flex-start;justify-content:center;padding:24px 16px;overflow:auto;}
.sp-panel{background:#fff;color:#141A2E;border-radius:14px;max-width:820px;width:100%;padding:18px 20px;box-shadow:0 18px 40px rgba(14,18,40,.35);font:600 15px/1.45 Arial,sans-serif;}
.sp-ph{display:flex;justify-content:space-between;align-items:center;gap:10px;} .sp-ph h3{margin:0;font:800 20px Arial,sans-serif;color:#1E2340;}
.sp-x{border:0;background:#EEF0F6;border-radius:8px;font:800 16px Arial,sans-serif;padding:4px 10px;cursor:pointer;}
.sp-sub{margin:6px 0 10px;color:#2E3450;} .sp-lab{display:block;margin:12px 0 4px;font:800 15px Arial,sans-serif;color:#1E2340;}
.sp-panel textarea{width:100%;box-sizing:border-box;font:600 15px Arial,sans-serif;padding:8px 10px;border:1.5px solid #9CA3BD;border-radius:8px;}
.sp-perday{margin-top:8px;} .sp-perday summary{cursor:pointer;font:800 15px Arial,sans-serif;color:#1E2340;}
.sp-acts{display:flex;flex-wrap:wrap;gap:8px;align-items:center;margin-top:14px;} .sp-msg{font:700 14.5px Arial,sans-serif;color:#0B5D1E;} .sp-msg.bad{color:#A50E0E;}
.sp-snap{border:1px solid #D6DAE5;border-radius:10px;padding:10px 12px;background:#F7F8FB;}
.sp-pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:8px;} .sp-pill{padding:4px 12px;border-radius:999px;background:#EEF0F6;font:800 15px Arial,sans-serif;}
.sp-hi{background:#E6F4EA !important;color:#0B5D1E;} .sp-mid{background:#FFF4E0 !important;color:#7A4B00;} .sp-lo{background:#FDE8E8 !important;color:#A50E0E;}
.sp-days{width:100%;border-collapse:collapse;font:600 14.5px Arial,sans-serif;background:#fff;} .sp-days th, .sp-days td{border:1px solid #D6DAE5;padding:5px 8px;text-align:left;vertical-align:top;}
.sp-days th{background:#EEF0F6;font-weight:800;} .sp-days td small{display:block;color:#5F6368;}
.sp-day{margin-top:8px;border:1px solid #D6DAE5;border-radius:8px;background:#fff;} .sp-day summary{cursor:pointer;padding:6px 10px;font:700 15px Arial,sans-serif;} .sp-day summary em{font-style:normal;color:#5F6368;margin-left:6px;}
.sp-it{border-top:1px solid #E3E6EF;padding:6px 10px;} .sp-ith{display:flex;justify-content:space-between;gap:8px;font:800 15px Arial,sans-serif;} .sp-ith b{padding:1px 8px;border-radius:6px;background:#F1F3F4;}
.sp-it p{margin:3px 0 0;}
.sp-note{margin:8px 0;padding:8px 12px;border-left:4px solid #DB8437;background:#FFF7EC;border-radius:6px;} .sp-note p{margin:2px 0 0;white-space:pre-wrap;}
.sp-miss{margin-top:8px;color:#7A1A12;} .sp-miss ul{margin:4px 0 0 18px;padding:0;} .sp-ok{margin:8px 0 0;color:#0B5D1E;}
.sp-in{margin:10px 0 14px;padding:12px 14px;border:2px solid #DB8437;border-radius:12px;background:#FFFBF5;} .sp-in h3{margin:0 0 8px;font:800 18px Arial,sans-serif;color:#1E2340;}
.sp-badge{display:inline-block;margin-left:6px;padding:1px 9px;border-radius:999px;background:#DB8437;color:#fff;font:800 13.5px Arial,sans-serif;vertical-align:middle;}
.sp-rep{border:1px solid #E3D2BC;border-radius:10px;background:#fff;margin-top:8px;} .sp-rep > summary{cursor:pointer;padding:8px 12px;font:800 15px Arial,sans-serif;color:#141A2E;} .sp-rep.new > summary{background:#FFF1DE;border-radius:10px;}
.sp-rep > .sp-snap{margin:0 10px 10px;}
@media(max-width:760px){ .sp-days{font-size:14px;} .sp-panel{padding:14px 12px;} }
`;
document.head.appendChild(css);
})();
