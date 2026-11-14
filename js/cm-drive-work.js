/* ============================================================
   ✍ The written work on a trainee's Backup Drive, AI-graded, and a trainer's override of any Drive grade
   The Worker grades it (worker-drive-work.js: every night, and on 🏅 Grade now): each file the trainee writes in their
   own case folders is matched to its Skill Building activity and graded against that activity's rubric. This page:
     • the trainee: 📂 My Backup Drive gains ✍ Your written work, graded: each activity's final grade (the trainer's
       where there is one, the AI's beside it), the trainer's comment, the rubric's points, and what to fix taught the
       way the Progress Log's ⚠ Needs fixing is (what your work shows, the standard, why it matters, your next step);
       the files not matched, and why; and where each activity's work goes (its folder and the heading to start it
       with). Their dashboard's Backup Drive card says how many are graded. The short form rides their progress
       ("drive-work"), so the Scorecard and the Batch Sheet read it with the rest.
     • a trainer: 🛡 Admin Master Control → 🔗 Trainee Drives gains ✍ Graded work: per trainee, each day's structure grade
       and each activity's AI grade, a box to change any of them with a comment (✓ Save, ✕ Clear), 🏅 Grade now, and
       the files not matched. The 🏅 Scorecard's 📂 Backup Drive and the 📋 Batch Sheet's 📂 column carry the final grades.
   Every name and every line of a document's grade is escaped; only a Google Drive / Docs address is ever linked.
   ============================================================ */
(function(){
"use strict";
const KEY = "drive-work";
if(typeof registerPersonalKeys === "function") registerPersonalKeys([KEY]);
const E = (s)=> String(s == null ? "" : s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const J = (s)=> String(s == null ? "" : s).replace(/[\\'"<>&]/g, c => "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0"));
const gd = (u)=> /^https:\/\/(drive|docs)\.google\.com\//.test(String(u || "")) ? String(u) : "";
const pct = (v)=> typeof v === "number" && isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : null;
const tone = (p)=> p == null ? "" : p >= 85 ? "is-hi" : p >= 70 ? "is-ok" : "is-lo";
const when = (at)=>{ try{ return at ? new Date(at).toLocaleString(undefined, {month:"short", day:"numeric", hour:"numeric", minute:"2-digit"}) : ""; }catch(e){ return ""; } };
const isAdmin = ()=> typeof state === "object" && !!state.isAdmin && !state.adminPreview;
const isTrainee = ()=> typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;
const say = (m)=>{ if(typeof toast === "function") toast(m); };
const DAYNAME = {1: "the firm's folders", 2: "Backup File Maintenance", 3: "Backup File Maintenance", 4: "Backup File Maintenance", 5: "Backup File Maintenance"};

async function api(body){
  const r = await fetch("/api/drive", {method:"POST", headers:Object.assign({"Content-Type":"application/json"}, typeof authHeaders === "function" ? authHeaders() : {}), body:JSON.stringify(body)});
  let j = {}; try{ j = await r.json(); }catch(e){}
  if(!r.ok) throw new Error(j.error || `The Drive grades couldn't be read (${r.status}).`);
  return j;
}

/* ---------- the grade of one activity, as the trainee and the trainer read it ---------- */
function pill(p, cls){ return `<span class="cmdw-pill ${tone(p)} ${cls || ""}">${p == null ? "—" : p + "%"}</span>`; }
function teachHtml(f){
  return `<li class="cmdw-fix"><span><i>What your work shows:</i> ${E(f.shows)}</span><span><i>📏 The standard:</i> ${E(f.standard)}</span>
    <span><i>💡 Why it matters:</i> ${E(f.why)}</span><span class="cmdw-next"><i>🛠 Your next step:</i> ${E(f.next)}</span></li>`;
}
function itemHtml(x, forTrainer){
  const o = x.override, url = gd(x.url);
  const notes = [];
  if(x.wrongFolder && x.home) notes.push(`📁 Saved in ${E(x.folder)}: the firm keeps this work in <b>${E(x.home)}</b>.`);
  if(x.nameOk === false) notes.push(`🏷 The name isn't the firm's convention${x.nameWant ? `: <code>${E(x.nameWant)}</code>` : ""}${x.nameHint ? ` — ${E(x.nameHint)}` : ""}`);
  if(x.truncated) notes.push(`✂ Only the first ${E((x.maxChars || 20000).toLocaleString())} characters (of ${E((x.chars || 0).toLocaleString())}) were read.`);
  if(x.error) notes.push(`⏳ ${x.auto == null ? "Not graded yet" : "The last grade stands"}: ${E(x.error)} It is tried again tonight.`);
  else if(x.waiting) notes.push("⏳ Waiting for tonight's grading.");
  return `<div class="cmdw-item" data-cmdw-act="${E(x.id)}">
    <div class="cmdw-ih"><b>Day ${E(x.day)} · ${E(x.title)}</b>${pill(x.final)}</div>
    <div class="cmdw-meta">${x.file ? `${url ? `<a href="${E(url)}" target="_blank" rel="noopener noreferrer">📄 ${E(x.file)} ↗</a>` : `📄 ${E(x.file)}`}` : "No file on the drive now"}${x.gradedAt ? ` · graded ${E(when(x.gradedAt))}` : ""}</div>
    ${o ? `<div class="cmdw-ov"><b>${forTrainer ? "Your grade" : "Your trainer's grade"}: ${E(o.score)}%</b>${x.auto != null ? ` <span>(the AI's: ${E(x.auto)}%)</span>` : ""}${o.comment ? `<div class="cmdw-com">💬 ${E(o.comment)}</div>` : ""}</div>` : ""}
    ${(x.dims || []).length ? `<div class="cmdw-dims">${x.dims.map(d=>`<span>${d.points === d.max ? "✓" : "○"} ${E(d.name)} ${E(d.points)}/${E(d.max)}</span>`).join("")}</div>` : ""}
    ${(x.strengths || []).length ? `<ul class="cmdw-good">${x.strengths.map(s=>`<li>⭐ ${E(s)}</li>`).join("")}</ul>` : ""}
    ${(x.fix || []).length ? `<div class="cmdw-fixh">⚠ Needs fixing</div><ul class="cmdw-fixes">${x.fix.map(teachHtml).join("")}</ul>` : ""}
    ${notes.length ? `<ul class="cmdw-notes">${notes.map(n=>`<li>${n}</li>`).join("")}</ul>` : ""}
  </div>`;
}
function listHtml(head, xs, lead){
  if(!xs || !xs.length) return "";
  return `<div class="cmdw-list"><b>${head}</b>${lead ? `<p>${lead}</p>` : ""}<ul>${xs.map(x=>`<li>${gd(x.url) ? `<a href="${E(gd(x.url))}" target="_blank" rel="noopener noreferrer">${E(x.name)} ↗</a>` : E(x.name)} <span>in ${E(x.folder)}</span>${x.why ? ` — ${E(x.why)}` : ""}</li>`).join("")}</ul></div>`;
}

/* ---------- 🧑‍🎓 the trainee ---------- */
let MINE = null, mineAt = 0, mineBusy = false, lastMirror = "";
async function loadMine(force){
  if(!isTrainee() || mineBusy || (!force && mineAt && Date.now() - mineAt < 60000)) return;
  mineBusy = true; mineAt = Date.now();
  try{ MINE = await api({action:"work"}); mirror(MINE.brief); }
  catch(e){ MINE = MINE || {failed: e.message}; }
  mineBusy = false; inject(true);
  if(state.view === "dashboard" && typeof render === "function" && MINE && MINE.brief && MINE.brief.items && MINE.brief.items.length && !(typeof isTyping === "function" && isTyping())) render();
}
/* the short form on the trainee's progress, where the Scorecard and the Batch Sheet read it (only when it changed) */
function mirror(brief){
  if(!brief) return;
  const s = JSON.stringify([brief.items, brief.days]);
  if(s === lastMirror) return; lastMirror = s;
  try{ if(typeof storeSet === "function") storeSet(KEY, brief); }catch(e){}
}
function guideHtml(guide){
  if(!(guide || []).length) return "";
  const days = [...new Set(guide.map(g=>g.day))];
  return `<details class="cmdw-guide"><summary>✍ Where your written work goes, and how to head it</summary>
    <p>Write each activity's work in your own Google Drive, in the case folder the firm keeps it in, named the firm's way. Start the document with its heading, exactly as below: that is how the grader knows which activity it is the work of. It is graded every night against that activity's rubric.</p>
    ${days.map(d=>`<div class="cmdw-gday"><b>Day ${E(d)}</b><ul>${guide.filter(g=>g.day === d).map(g=>`<li><code>${E(g.heading)}</code> <button type="button" class="cmdw-mini" data-copy="${E(g.heading)}" onclick="cmDriveWork.copy(this)">📋 Copy</button> <span>→ ${E(String(g.folder).split("/").pop())}</span></li>`).join("")}</ul></div>`).join("")}
  </details>`;
}
function traineeSection(){
  const M = MINE;
  if(!M) return `<section class="cmdw-sec" data-cmdw-sec><h4>✍ Your written work, graded</h4><p class="cmdw-p">Reading your grades…</p></section>`;
  if(M.failed) return `<section class="cmdw-sec" data-cmdw-sec><h4>✍ Your written work, graded</h4><p class="cmdw-p">Your written work's grades couldn't be read just now.</p></section>`;
  const v = M.work || {items: [], unmatched: [], unreadable: []}, S = M.structure || {};
  const dayOv = Object.keys(S).filter(n=>S[n] && S[n].override);
  return `<section class="cmdw-sec" data-cmdw-sec><h4>✍ Your written work, graded</h4>
    <p class="cmdw-p">What you write in your case folders (memos, letters, logs, summaries, drafts) is matched to its activity and graded by the AI against that activity's rubric, every night. A grade your trainer changed is the one that counts.${M.ai ? "" : " <b>The AI grader isn't switched on yet.</b>"}</p>
    ${dayOv.length ? `<div class="cmdw-days">${dayOv.map(n=>`<div class="cmdw-ov"><b>Day ${E(n)} · ${E(DAYNAME[n])}: your trainer's grade ${E(S[n].final)}%</b>${S[n].auto != null ? ` <span>(auto: ${E(S[n].auto)}%)</span>` : ""}${S[n].override.comment ? `<div class="cmdw-com">💬 ${E(S[n].override.comment)}</div>` : ""}</div>`).join("")}</div>` : ""}
    ${(v.items || []).length ? (v.items || []).map(x=>itemHtml(Object.assign({maxChars: M.maxChars}, x), false)).join("") : `<p class="cmdw-p cmdw-none">Nothing graded yet. Write an activity's work in its folder, start it with its heading (below), and it is graded tonight.</p>`}
    ${listHtml("Not matched to an activity", v.unmatched, "Start each document with the heading of the activity it is the work of.")}
    ${listHtml("Not readable as text", v.unreadable)}
    ${guideHtml(M.guide)}
  </section>`;
}
/* the dashboard card's one line */
function cardLine(){
  const b = MINE && MINE.brief; if(!b) return "";
  const xs = b.items || [], avg = xs.length ? Math.round(xs.reduce((t, x)=>t + (Number(x.s) || 0), 0) / xs.length) : null;
  const com = xs.filter(x=>x.c).length + Object.values(b.days || {}).filter(d=>d && d.c).length;
  return `<p class="cmdw-line" data-cmdw-line>✍ Written work: ${xs.length ? `<b>${xs.length} graded</b>, average <b>${avg}%</b>` : "nothing graded yet"}${com ? ` · 💬 ${com} trainer comment${com === 1 ? "" : "s"}` : ""} <button type="button" class="cmdw-mini" onclick="cmDriveWork.open()">Read it</button></p>`;
}
/* Put the section in the open 📂 My Backup Drive panel and the line on its dashboard card, as they are drawn. */
let injectQueued = false;
function inject(redo){
  if(!isTrainee()) return;
  const body = document.querySelector("#cmDriveHost .drv-body");
  const st = window.CMDrive && CMDrive.status ? CMDrive.status() : null;
  if(body && st && st.connected){
    const old = body.querySelector("[data-cmdw-sec]");
    if(!old || redo){ if(old) old.remove(); body.insertAdjacentHTML("beforeend", traineeSection()); if(!MINE) loadMine(); }
  }
  const card = document.querySelector("#drvCardSlot .drv-card");
  if(card && st && st.connected && !MINE) loadMine();
  if(card && st && st.connected && MINE && MINE.brief){
    const old = card.querySelector("[data-cmdw-line]");
    if(!old || redo){ if(old) old.remove(); const btn = card.querySelector(".btn"); const h = cardLine(); if(btn) btn.insertAdjacentHTML("beforebegin", h); else card.insertAdjacentHTML("beforeend", h); }
  }
}
function watch(){
  if(typeof MutationObserver !== "function" || !document.body) return;
  new MutationObserver(()=>{ if(injectQueued || !isTrainee()) return; injectQueued = true;
    (window.requestAnimationFrame || setTimeout)(()=>{ injectQueued = false; inject(false); }); }).observe(document.body, {childList:true, subtree:true});
}
function openMine(){
  if(window.CMDrive && CMDrive.show) CMDrive.show();
  loadMine(true);
  setTimeout(()=>{ inject(true); const s = document.querySelector("#cmDriveHost [data-cmdw-sec]"); if(s) try{ s.scrollIntoView({block:"start"}); }catch(e){} }, 60);
}
function copy(btn){ const t = btn && btn.getAttribute("data-copy"); try{ navigator.clipboard.writeText(t); say("Heading copied."); }catch(e){} }
// a grade of the drive's structure (a check, a filed copy) or a page that opens: read the written work's grades again
window.addEventListener("cm-drive-graded", ()=> loadMine(true));
window.addEventListener("focus", ()=>{ if(isTrainee()) loadMine(); });

/* ---------- 🛡 the trainer: 🔗 Trainee Drives → ✍ Graded work ---------- */
const OPEN = {}, DATA = {}, DRAFT = {}, MSG = {}, BUSY = {};
function draftOf(id, kind, key, cur){ const k = `${id}|${kind}|${key}`; return DRAFT[k] || {score: cur && cur.override ? String(cur.override.score) : "", comment: cur && cur.override ? cur.override.comment || "" : ""}; }
function ovRow(id, kind, key, cur){
  const d = draftOf(id, kind, key, cur), k = `${id}|${kind}|${key}`;
  return `<div class="cmdw-ovf" data-cmdw-ov="${E(kind)}:${E(key)}">
    <input type="number" min="0" max="100" step="1" inputmode="numeric" class="cmdw-in cmdw-score" value="${E(d.score)}" placeholder="0–100" aria-label="Override grade" oninput="cmDriveWork.draft('${J(k)}','score',this.value)">
    <input type="text" class="cmdw-in cmdw-comment" maxlength="1000" value="${E(d.comment)}" placeholder="Comment for the trainee" aria-label="Comment for the trainee" oninput="cmDriveWork.draft('${J(k)}','comment',this.value)">
    <button type="button" class="btn btn-navy btn-sm" onclick="cmDriveWork.save('${J(id)}','${J(kind)}','${J(key)}')">✓ Save</button>
    ${cur && cur.override ? `<button type="button" class="btn btn-ghost btn-sm" onclick="cmDriveWork.clear('${J(id)}','${J(kind)}','${J(key)}')">✕ Clear</button>` : ""}
  </div>`;
}
function trainerBody(id){
  const V = DATA[id];
  if(!V) return `<p class="cmdw-p">Reading this trainee's grades…</p>`;
  if(V.failed) return `<p class="cmdw-p cmdw-no">${E(V.failed)}</p>`;
  const S = V.structure || {}, v = V.work || {items: [], unmatched: [], unreadable: []};
  return `${V.ai ? "" : `<p class="cmdw-p cmdw-no">No AI is configured on the Worker (GEMINI_API_KEY or AI_GATEWAY_SECRET): the written work is matched but not graded.</p>`}
    <table class="cmdw-t"><thead><tr><th>Backup Drive</th><th>Auto</th><th>Final</th><th>Change the grade · comment</th></tr></thead><tbody>
    ${[1, 2, 3, 4, 5].map(n=>{ const s = S[n] || {}; return `<tr data-cmdw-day="${n}"><td><b>Day ${n} · ${E(DAYNAME[n])}</b></td><td>${pill(s.auto)}</td><td>${pill(s.final)}${s.override ? ` <small>trainer</small>` : ""}</td><td>${ovRow(id, "day", String(n), s)}</td></tr>`; }).join("")}
    </tbody></table>
    <table class="cmdw-t"><thead><tr><th>Written work</th><th>AI</th><th>Final</th><th>Change the grade · comment</th></tr></thead><tbody>
    ${(v.items || []).map(x=>`<tr data-cmdw-row="${E(x.id)}"><td><details class="cmdw-det"><summary><b>Day ${E(x.day)} · ${E(x.title)}</b>${x.file ? `<div class="cmdw-meta">📄 ${E(x.file)}</div>` : ""}</summary>${itemHtml(x, true)}</details></td>
      <td>${pill(x.auto)}</td><td>${pill(x.final)}${x.override ? ` <small>trainer</small>` : ""}</td><td>${ovRow(id, "work", x.id, x)}</td></tr>`).join("") || `<tr><td colspan="4">No written work matched to an activity yet.</td></tr>`}
    </tbody></table>
    ${listHtml("Not matched to an activity (not graded)", v.unmatched)}
    ${listHtml("Not readable as text", v.unreadable)}
    ${(v.older || []).length ? `<p class="cmdw-p cmdw-dim">Older versions not graded (the newest file of an activity is): ${v.older.map(o=>E(o.name)).join(", ")}</p>` : ""}`;
}
function trainerSection(rows){
  const reps = state.driveReports || {};
  const list = rows.filter(r=>{ const p = reps[r.id] || {}; return p.connected || p.work || p.overrides; });
  return `<section class="cmdw-adm" id="cmdwAdm"><h3>✍ Graded work · the AI's grades and yours</h3>
    <p class="cmdw-p">Each trainee's written work on their Backup Drive is graded by the AI every night against its activity's rubric, and each day's folders and filing automatically. Change any grade and leave a comment: your grade is the one the trainee, the Scorecard and the Batch Sheet see, and the nightly grading never overwrites it. <b>🏅 Grade now</b> runs the same grading for one trainee straight away.</p>
    ${list.length ? list.map(r=>{ const p = reps[r.id] || {}, w = p.work || {}, xs = w.items || [], avg = xs.length ? Math.round(xs.reduce((t, x)=>t + (Number(x.s) || 0), 0) / xs.length) : null, m = MSG[r.id];
      return `<details class="cmdw-tr" data-cmdw-id="${E(r.id)}" ${OPEN[r.id] ? "open" : ""} ontoggle="cmDriveWork.toggle('${J(r.id)}', this.open)">
        <summary><b>${E(r.name || r.id)}</b><span class="cmdw-sum">${xs.length ? `${xs.length} graded · average ${avg}%` : "no written work graded yet"}${w.unmatched ? ` · ${w.unmatched} not matched` : ""}</span>
          <button type="button" class="btn btn-navy btn-sm" data-cmdw-now ${BUSY[r.id] ? "disabled" : ""} onclick="event.preventDefault();event.stopPropagation();cmDriveWork.gradeNow('${J(r.id)}')">${BUSY[r.id] ? "Grading…" : "🏅 Grade now"}</button></summary>
        ${m ? `<div class="cmdw-msg ${m.ok ? "ok" : "no"}">${E(m.text)}</div>` : ""}
        ${OPEN[r.id] ? trainerBody(r.id) : ""}
      </details>`; }).join("") : `<p class="cmdw-p">No trainee has linked a Backup Drive yet.</p>`}
  </section>`;
}
async function loadFor(id, force){
  if(DATA[id] && !force) return;
  try{ DATA[id] = await api({action:"workFor", traineeId:id}); keepBrief(id, DATA[id]); }
  catch(e){ DATA[id] = {failed: e.message}; }
  redraw();
}
// what the trainer's lists read (the 🏅 Scorecard, the 📋 Batch Sheet) follows at once
function keepBrief(id, V){
  if(!V || !V.brief) return;
  state.driveReports = state.driveReports || {};
  const rep = state.driveReports[id] = Object.assign({}, state.driveReports[id] || {}, {work: V.brief});
  const S = V.structure || {};
  rep.grades = Object.assign({}, rep.grades || {});
  [2, 3, 4, 5].forEach(n=>{ if(S[n] && S[n].final != null) rep.grades[n] = Object.assign({}, rep.grades[n] || {}, {score: S[n].final, auto: S[n].auto, override: S[n].override || undefined}); });
  if(S[1]) rep.setupScore = S[1].final;
  if(window.cmScorecard && cmScorecard.invalidate) cmScorecard.invalidate();
}
function redraw(){ if(state.view === "admin" && state.adminTab === "tdrives" && !(typeof isTyping === "function" && isTyping()) && typeof render === "function") render(); }
function toggle(id, open){ if(!!OPEN[id] === !!open) return; OPEN[id] = !!open; if(open) loadFor(id); redraw(); }
function draft(k, field, v){ const [id, kind, key] = k.split("|"); const cur = draftOf(id, kind, key, findCur(id, kind, key)); DRAFT[k] = Object.assign({}, cur, {[field]: String(v)}); }
function findCur(id, kind, key){ const V = DATA[id]; if(!V) return null; return kind === "day" ? (V.structure || {})[key] : ((V.work || {}).items || []).find(x=>x.id === key); }
async function save(id, kind, key, clear){
  const k = `${id}|${kind}|${key}`, d = draftOf(id, kind, key, findCur(id, kind, key));
  const score = clear ? null : String(d.score).trim();
  if(!clear && !/^\d{1,3}$/.test(score || "") || (!clear && Number(score) > 100)){ MSG[id] = {ok:false, text:"A grade is a whole number from 0 to 100."}; redraw(); return; }
  try{
    DATA[id] = await api({action:"override", traineeId:id, kind, key, score: clear ? null : Number(score), comment: clear ? "" : d.comment});
    delete DRAFT[k]; keepBrief(id, DATA[id]);
    MSG[id] = {ok:true, text: clear ? "Override cleared: the automatic grade counts again." : `Saved: ${kind === "day" ? `Day ${key}` : "the activity"} is ${score}% for the trainee.`};
  }catch(e){ MSG[id] = {ok:false, text:e.message}; }
  redraw();
}
async function gradeNow(id){
  if(BUSY[id]) return;
  BUSY[id] = true; OPEN[id] = true; MSG[id] = {ok:true, text:"Grading this trainee's Drive now: the AI reads each changed file…"}; redraw();
  try{
    DATA[id] = await api({action:"workGradeFor", traineeId:id}); keepBrief(id, DATA[id]);
    const r = DATA[id].ran || {};
    MSG[id] = {ok:true, text:`Graded ${r.graded || 0} file${r.graded === 1 ? "" : "s"}${r.failed ? `, ${r.failed} couldn't be graded (the last grade stands)` : ""}${r.pending ? `; ${r.pending} more wait for the next press or tonight` : ""}.${r.structure ? " The folders and filing were graded too." : ""}`};
  }catch(e){ MSG[id] = {ok:false, text:e.message}; }
  BUSY[id] = false; redraw();
}
if(typeof renderAdmin === "function"){
  const __admin = renderAdmin;
  window.renderAdmin = function(){
    const h = __admin.apply(this, arguments);
    if(!isAdmin() || state.adminTab !== "tdrives") return h;
    const at = h.indexOf('id="cmdaPage"'), end = at < 0 ? -1 : h.indexOf("</tbody></table>", at);
    if(end < 0) return h;
    const all = (state.adminData || []).filter(r=>r && r.approved === true && !r.archived);
    const bf = state.adminBatchFilter && state.adminBatchFilter !== "all" ? state.adminBatchFilter : "";
    const rows = all.filter(r=>!bf || (typeof cleanBatch === "function" ? cleanBatch(r.batch) : r.batch) === bf || r.batch === bf).sort((a, b)=>String(a.name || a.id).localeCompare(String(b.name || b.id)));
    const cut = end + "</tbody></table>".length;
    return h.slice(0, cut) + trainerSection(rows) + h.slice(cut);
  };
}

/* ---------- the grades wherever a Drive grade is read: 🏅 Scorecard, 📋 Batch Sheet ---------- */
function briefFor(id, data){
  if(isTrainee() && id === state.traineeId){ if(!MINE) loadMine(); if(MINE && MINE.brief) return MINE.brief; }
  const rep = (state.driveReports || {})[id];
  if(rep && rep.work) return rep.work;
  if(isAdmin() && typeof loadDriveReports === "function" && state.adminData && !state.driveReportsAt && !state.driveReportsLoading)
    loadDriveReports().then(()=>{ if(window.cmScorecard && cmScorecard.invalidate) cmScorecard.invalidate(); if(["scorecard", "admin"].includes(state.view) && typeof render === "function" && !(typeof isTyping === "function" && isTyping())) render(); });
  return (data && data[KEY]) || null;
}
const ovNote = (d)=> `Your trainer's grade${d.c ? `: ${d.c}` : ""}`;
/* 🏅 Scorecard → 📂 Backup Drive: a day's override in place of the auto grade, and each activity's written work */
function scoreItems(c, items){
  const id = c && c.rec && c.rec.id, b = id ? briefFor(id, c.data) : null;
  if(!b) return items;
  const out = items.slice();
  Object.entries(b.days || {}).forEach(([n, d])=>{
    if(!d || typeof d.s !== "number") return;
    const name = n === "1" ? "Day 1: the firm's folders" : `Day ${n}: Backup File Maintenance`, at = out.findIndex(x=>x && x.name === name);
    const it = {name, pct: pct(d.s), note: ovNote(d)};
    if(at >= 0) out[at] = Object.assign({}, out[at], it); else out.push(it);
  });
  (b.items || []).forEach(x=>{ if(typeof x.s === "number") out.push({name: `Day ${x.d}: ✍ ${x.t}`, pct: pct(x.s), note: x.ov ? `${ovNote(x)}${x.ai != null ? ` (AI ${x.ai}%)` : ""}` : "AI-graded written work on the Backup Drive"}); });
  return out;
}
function hookScorecard(){
  const S = window.cmScorecard, src = S && Array.isArray(S.sources) ? S.sources.find(s=>s && s.id === "bd") : null;
  if(!src || src.__cmdw) return;
  const items = src.items; src.items = (c)=> scoreItems(c, items(c)); src.__cmdw = true;
}
/* 📋 Batch Sheet → a day's 📂 Backup Drive items (js/cm-batch-sheet.js dayParts calls this) */
function dayParts(r, n, data, out){
  const b = briefFor(r && r.id, data); if(!b) return;
  const d = (b.days || {})[n];
  if(d && typeof d.s === "number"){
    const it = out.find(x=>x.grp === "bd" && !/^✍/.test(x.name));
    const ov = {pct: pct(d.s), status: "Trainer's grade", why: ovNote(d)};
    if(it) Object.assign(it, ov); else out.push(Object.assign({grp: "bd", name: n === 1 ? "📂 Backup Drive: the firm's folders" : "📂 Backup File Maintenance", best: [], improve: d.c ? [d.c] : []}, ov));
  }
  (b.items || []).filter(x=>Number(x.d) === Number(n) && typeof x.s === "number").forEach(x=>out.push({grp: "bd", name: `✍ ${x.t}`, pct: pct(x.s),
    status: x.ov ? "Trainer's grade" : x.s >= 70 ? "Passed" : "Below 70%", why: x.ov ? `${ovNote(x)}${x.ai != null ? ` · the AI's ${x.ai}%` : ""}` : "AI-graded written work, read from the trainee's Backup Drive", best: [], improve: []}));
}

window.cmDriveWork = {open: openMine, copy, toggle, draft, save: (id, kind, key)=>save(id, kind, key, false), clear: (id, kind, key)=>save(id, kind, key, true), gradeNow,
  dayParts, scoreItems, briefFor, reload: ()=>loadMine(true), state: ()=>({mine: MINE, data: DATA})};
hookScorecard();
document.addEventListener("DOMContentLoaded", ()=>{ hookScorecard(); watch(); if(isTrainee()) loadMine(); });
if(document.readyState !== "loading"){ watch(); }

const css = document.createElement("style");
css.textContent = `.cmdw-sec{margin:16px 0 4px;padding:14px 16px;border:2px solid #DDE1EA;border-radius:12px;background:#fff;}
.cmdw-sec h4,.cmdw-adm h3{margin:0 0 6px;font:800 17px 'Poppins','Inter',sans-serif;color:#1E2340;}
.cmdw-p{font:600 14px/1.5 'Inter',sans-serif;color:#2E3245;margin:0 0 10px;} .cmdw-none{color:#5F6577;} .cmdw-no{color:#A50E0E;} .cmdw-dim{color:#5F6577;}
.cmdw-item{border:1px solid #DDE1EA;border-left:4px solid #DB8437;border-radius:10px;padding:10px 12px;margin:0 0 10px;background:#FBFCFE;}
.cmdw-ih{display:flex;justify-content:space-between;gap:10px;align-items:center;font:800 15px 'Inter',sans-serif;color:#1E2340;}
.cmdw-meta{font:600 14px 'Inter',sans-serif;color:#5F6577;margin:3px 0 6px;overflow-wrap:anywhere;} .cmdw-meta a{color:#1E2340;}
.cmdw-pill{display:inline-block;min-width:48px;text-align:center;padding:2px 9px;border-radius:999px;font:800 14px 'Inter',sans-serif;background:#EEF1F8;color:#1E2340;}
.cmdw-pill.is-hi{background:#DCF2E2;color:#1E7A3A;} .cmdw-pill.is-ok{background:#FFF1DE;color:#8A4B08;} .cmdw-pill.is-lo{background:#FDE2E2;color:#A50E0E;}
.cmdw-ov{margin:6px 0;padding:8px 10px;border-radius:8px;background:#FBF3E7;border:1px solid #EAD5B4;font:700 14px 'Inter',sans-serif;color:#1E2340;} .cmdw-ov span{color:#5F6577;}
.cmdw-com{margin-top:4px;font:600 14px/1.45 'Inter',sans-serif;color:#2E3245;overflow-wrap:anywhere;}
.cmdw-dims{display:flex;flex-wrap:wrap;gap:6px 12px;font:700 14px 'Inter',sans-serif;color:#1E2340;margin:6px 0;}
.cmdw-good,.cmdw-fixes,.cmdw-notes{margin:6px 0 0 18px;padding:0;font:600 14px/1.45 'Inter',sans-serif;color:#2E3245;}
.cmdw-fixh{margin-top:8px;font:800 14px 'Inter',sans-serif;color:#A50E0E;}
.cmdw-fix{margin-bottom:8px;} .cmdw-fix span{display:block;} .cmdw-fix i{font-style:normal;font-weight:800;color:#1E2340;} .cmdw-next i{color:#DB8437 !important;}
.cmdw-list{margin:10px 0;font:600 14px/1.45 'Inter',sans-serif;color:#2E3245;} .cmdw-list b{color:#1E2340;} .cmdw-list ul{margin:4px 0 0 18px;padding:0;} .cmdw-list li span{color:#5F6577;} .cmdw-list p{margin:2px 0;}
.cmdw-guide{margin-top:10px;font:600 14px/1.45 'Inter',sans-serif;color:#2E3245;} .cmdw-guide summary{cursor:pointer;font-weight:800;color:#1E2340;}
.cmdw-guide ul{margin:4px 0 8px 18px;padding:0;} .cmdw-guide code{font-size:14px;font-weight:700;overflow-wrap:anywhere;} .cmdw-gday b{color:#1E2340;}
.cmdw-mini{border:1px solid #C9D1E6;background:#fff;border-radius:6px;font:700 13px 'Inter',sans-serif;padding:2px 8px;cursor:pointer;}
.cmdw-line{font:700 14px 'Inter',sans-serif !important;color:#1E2340 !important;}
.cmdw-adm{margin-top:22px;} .cmdw-tr{border:2px solid #DDE1EA;border-radius:10px;margin:0 0 10px;background:#fff;}
.cmdw-tr>summary{display:flex;gap:12px;align-items:center;flex-wrap:wrap;padding:10px 14px;cursor:pointer;font:700 15px 'Inter',sans-serif;color:#1E2340;}
.cmdw-sum{color:#5F6577;font-weight:700;font-size:14px;flex:1 1 auto;} .cmdw-tr>*:not(summary){margin-left:14px;margin-right:14px;}
.cmdw-t{width:calc(100% - 28px);border-collapse:collapse;margin:8px 14px 12px;font:600 14px 'Inter',sans-serif;}
.cmdw-t th{background:#1E2340;color:#fff;text-align:left;padding:8px 10px;font-weight:800;} .cmdw-t td{border-bottom:1px solid #DDE1EA;padding:8px 10px;vertical-align:top;}
.cmdw-t small{color:#DB8437;font-weight:800;}
.cmdw-ovf{display:flex;gap:6px;flex-wrap:wrap;align-items:center;} .cmdw-in{padding:6px 8px;border:2px solid #C9D1E6;border-radius:8px;font:600 14px 'Inter',sans-serif;}
.cmdw-score{width:80px;} .cmdw-comment{flex:1 1 220px;min-width:0;}
.cmdw-det summary{cursor:pointer;} .cmdw-msg{font:700 14px/1.4 'Inter',sans-serif;margin:0 14px 8px;} .cmdw-msg.ok{color:#1E7A3A;} .cmdw-msg.no{color:#A50E0E;}`;
document.head.appendChild(css);
})();
