/* ============================================================
   📋 The trainee's Task Tracker and Monitoring Sheet, linked and checked

   Trainee (dashboard card, "📁 Link My Task Tracker and Monitoring Sheet"):
     ① Download the template  ② Make a copy in your Google Drive and share it "Anyone with the link can
     view"  ③ Paste the link and Save. The link is kept on the trainee's own record (trainee:<id>.trackerLink).
     Nothing of the check below is ever shown to the trainee.

   Trainer (Admin → Trainee Audit → View Detail): the link, a status chip (On track / Behind / Not updated /
   Can't read the sheet — not shared), tasks done/open/overdue, the last update and the AI's notes, with
   🔄 Check now. Opening the Trainee Audit re-checks, a few at a time, any linked sheet last checked over
   6 hours ago. The check itself is /api/tracker-check in worker.js (admins only); its result is kept on
   trackerReview:<id>, which trainees can't read.
   ============================================================ */
(function(){
const esc = (s)=> String(s == null ? "" : s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const say = (m)=> { if(typeof toast === "function") toast(m); };
const STALE_MS = 6 * 60 * 60 * 1000;
const signedTrainee = ()=> typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;

/* A link the Worker can read: a Google Sheets (or Drive file) link on docs.google.com / drive.google.com. */
function validLink(v){
  let u; try{ u = new URL(String(v||"").trim()); }catch(e){ return false; }
  return u.protocol === "https:" && /^(docs|drive)\.google\.com$/i.test(u.hostname) && /\/(spreadsheets|file)\/d\/[A-Za-z0-9_-]{10,}/.test(u.pathname);
}

/* ① the template: one sheet (the check reads the first tab, or the tab in the link's gid) */
const COLS = ["Date Assigned","Task","Case / Matter","Priority (High/Med/Low)","Due Date","Status (Not started / In progress / Done)","Date Completed","Last Updated","Notes / Blockers"];
function downloadTemplate(){
  const q = (v)=>`"${String(v??"").replace(/"/g,'""')}"`;
  const today = new Date().toISOString().slice(0,10);
  const rows = [COLS, [today,"Example: Request medical records from provider","John Doe v. Robert Smith","High",today,"In progress","",today,"Delete this example row"]]
    .concat(Array.from({length:20},()=>COLS.map(()=>"")));
  const blob = new Blob(["﻿"+rows.map(r=>r.map(q).join(",")).join("\n")], {type:"text/csv;charset=utf-8"});
  const url = URL.createObjectURL(blob), a = document.createElement("a");
  a.href = url; a.download = "LSH_Task_Tracker_and_Monitoring_Sheet.csv"; a.style.display = "none";
  document.body.appendChild(a); a.click(); setTimeout(()=>{ a.remove(); URL.revokeObjectURL(url); }, 1500);
  say("Template downloaded — upload it to Google Drive and open it with Google Sheets.");
}

/* ---------- trainee: the dashboard card ---------- */
let open = false, saved = false, mine = null, asked = false;
async function loadMine(){
  if(asked || !signedTrainee()) return; asked = true;
  const rec = await sharedGet("trainee:"+state.traineeId).catch(()=>null);
  mine = (rec && rec.trackerLink) || "";
  redraw();
}
function card(){
  if(!signedTrainee()) return "";
  if(mine === null) setTimeout(loadMine, 0);
  const has = !!mine;
  if(!open) return `<div class="card" style="padding:14px 18px;margin-bottom:16px;display:flex;align-items:center;gap:12px;flex-wrap:wrap;">
      <div style="flex:1;min-width:200px;"><b style="color:var(--navy);">📋 Task Tracker and Monitoring Sheet</b>
      <div style="font-size:12.5px;color:var(--ink-soft);">${has ? "Linked ✓ — keep it up to date; your trainer follows your progress from it." : "Link your sheet so your trainer can follow your progress."}</div></div>
      <button class="btn btn-sm ${has?"btn-ghost":"btn-primary"}" onclick="CMTracker.toggle()">📁 Link My Task Tracker and Monitoring Sheet</button></div>`;
  return `<div class="card" style="padding:16px 18px;margin-bottom:16px;">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;"><b style="color:var(--navy);">📁 Link My Task Tracker and Monitoring Sheet</b>
      <button class="btn btn-sm btn-ghost" onclick="CMTracker.toggle()">Close</button></div>
    <ol style="font-size:13.5px;line-height:1.6;margin:10px 0 12px;padding-left:20px;">
      <li><b>Download the template.</b> <button class="btn btn-sm btn-ghost" onclick="CMTracker.downloadTemplate()">⬇ Download template</button></li>
      <li><b>Make a copy in your Google Drive</b> (upload it, then open it with Google Sheets) and <b>share it</b>: Share → General access → <b>"Anyone with the link" — Viewer</b>.</li>
      <li><b>Paste the link and Save.</b></li>
    </ol>
    <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center;">
      <input id="trkLinkIn" type="url" value="${esc(mine||"")}" placeholder="https://docs.google.com/spreadsheets/d/…" style="flex:1;min-width:220px;padding:9px 11px;border:1px solid var(--line);border-radius:8px;font:inherit;font-size:13px;" oninput="CMTracker.edited()">
      <button class="btn btn-sm btn-primary" onclick="CMTracker.save()">Save</button>
      <span id="trkSaved" style="font-size:13px;color:var(--success);font-weight:700;">${saved ? "Saved ✓" : ""}</span>
    </div>
    <div id="trkErr" style="font-size:12.5px;color:var(--danger);margin-top:6px;"></div>
  </div>`;
}
function slot(){ return `<div id="trkCardSlot">${card()}</div>`; }
function redraw(){ const s = document.getElementById("trkCardSlot"); if(s) s.innerHTML = card(); }
function toggle(){ open = !open; saved = false; redraw(); }
function edited(){ saved = false; const s = document.getElementById("trkSaved"); if(s) s.textContent = ""; }
async function save(){
  const inp = document.getElementById("trkLinkIn"), err = document.getElementById("trkErr");
  const v = String((inp && inp.value) || "").trim();
  if(!validLink(v)){ if(err) err.textContent = "Paste the share link of your Google Sheet (it starts with https://docs.google.com/spreadsheets/d/…)."; return; }
  if(err) err.textContent = "";
  const rec = await sharedGet("trainee:"+state.traineeId).catch(()=>null);
  if(!rec){ if(err) err.textContent = "Couldn't reach your record. Try again in a moment."; return; }
  rec.trackerLink = v; rec.trackerLinkAt = new Date().toISOString();
  await sharedSet("trainee:"+state.traineeId, rec);
  mine = v; saved = true; redraw();
}

/* ---------- trainer: Trainee Audit → View Detail ---------- */
const reviews = {};      // id -> trackerReview record
const checking = {};
const CHIP = {"On track":["#E6F6EC","#1E7B3C"], "Behind":["#FFF1DE","#9A5B00"], "Not updated":["#F1F2F6","#4A5070"], "Can't read the sheet — not shared":["#FDECEC","#B42318"]};
function chip(st){ const c = CHIP[st] || ["#F1F2F6","#4A5070"]; return `<span class="pill" style="background:${c[0]};color:${c[1]};font-weight:800;">${esc(st || "Not checked yet")}</span>`; }
function adminBlock(rec){
  if(typeof state !== "object" || !state.isAdmin || !rec) return "";
  const r = reviews[rec.id], link = rec.trackerLink || "";
  return `<div id="trkAdm-${esc(rec.id)}" style="margin:0 0 16px;padding:12px 14px;background:#fff;border:1px solid var(--line);border-radius:10px;">
    <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;flex-wrap:wrap;">
      <div class="sidebar-section-lbl" style="padding-left:0;">📋 Task Tracker &amp; Monitoring Sheet (AI check)</div>
      ${link ? `<button class="btn btn-sm btn-ghost" onclick="CMTracker.check('${esc(rec.id)}')" ${checking[rec.id]?"disabled":""}>${checking[rec.id]?"Checking…":"🔄 Check now"}</button>` : ""}
    </div>
    ${link ? `<div style="font-size:12.5px;margin:4px 0 8px;word-break:break-all;"><a href="${esc(link)}" target="_blank" rel="noopener noreferrer">${esc(link)}</a></div>` : `<div style="font-size:12.5px;color:var(--ink-soft);">No tracker link saved yet.</div>`}
    ${link && r ? `<div style="display:flex;gap:10px;flex-wrap:wrap;align-items:center;font-size:12.5px;">${chip(r.status)}
        ${r.status && r.done != null ? `<span>✅ ${r.done} done</span><span>🕒 ${r.open} open</span><span style="color:${r.overdue?"var(--danger)":"inherit"};">⚠ ${r.overdue} overdue</span>` : ""}
        ${r.lastUpdate ? `<span>Last update ${esc(r.lastUpdate)}</span>` : ""}
        <span style="color:var(--ink-soft);">checked ${esc(new Date(r.checkedAt).toLocaleString())}</span></div>
      ${r.notes ? `<div style="font-size:12.5px;margin-top:6px;white-space:pre-line;">${esc(r.notes)}</div>` : ""}
      ${r.error ? `<div style="font-size:12.5px;margin-top:6px;color:var(--danger);">${esc(r.error)}</div>` : ""}` : (link ? `<div style="font-size:12.5px;color:var(--ink-soft);">${chip("")}</div>` : "")}
  </div>`;
}
function redrawAdmin(id){
  const el = document.getElementById("trkAdm-"+id); if(!el) return;
  const rec = (state.adminData||[]).find(x=>x.id===id); if(rec) el.outerHTML = adminBlock(rec);
}
async function check(id){
  if(checking[id]) return; checking[id] = true; redrawAdmin(id);
  try{
    const res = await authFetch("/api/tracker-check", {id});
    const j = await res.json().catch(()=>({}));
    if(res.ok) reviews[id] = j; else say(j.error || "The tracker check failed.");
  }catch(e){ say("The tracker check failed — check your connection."); }
  checking[id] = false; redrawAdmin(id);
}
/* Opening the Trainee Audit: read the stored checks, then re-check (two at a time) any linked sheet whose
   check is over 6 hours old. Throttled to once every 10 minutes per page. */
let lastAuto = 0;
async function autoCheck(recs){
  if(typeof state !== "object" || !state.isAdmin || Date.now() - lastAuto < 10*60*1000) return;
  lastAuto = Date.now();
  const linked = (recs||[]).filter(r=>r && r.trackerLink && !r.archived);
  if(!linked.length) return;
  const got = await sharedGetMany(linked.map(r=>"trackerReview:"+r.id)).catch(()=>[]);
  linked.forEach((r,i)=>{ if(got && got[i]) reviews[r.id] = got[i]; redrawAdmin(r.id); });
  const due = linked.filter(r=>{ const v = reviews[r.id]; return !v || v.link !== r.trackerLink || Date.now() - new Date(v.checkedAt||0).getTime() > STALE_MS; });
  for(let i=0;i<due.length;i+=2) await Promise.all(due.slice(i,i+2).map(r=>check(r.id)));
}

window.CMTracker = {slot, card, toggle, edited, save, downloadTemplate, validLink, adminBlock, check, autoCheck};
})();
