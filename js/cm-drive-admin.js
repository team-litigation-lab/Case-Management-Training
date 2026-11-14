/* ============================================================
   🔗 A trainer links a trainee's Backup Drive folder for them
   In 🛡 Admin Master Control → Trainee Audit, a trainee's 📂 Backup Drive panel (index.html renderAdminDrivePanel)
   gains a box: paste the link of the trainee's Drive folder and press 🔗 Link for this trainee. The trainee still
   shares the folder with the platform's service account as Editor first (the address is shown with 📋 Copy); the
   Worker opens the folder as that account before it keeps the link, so a folder not shared, a file instead of a
   folder, or Viewer access is said at once. ✕ Unlink takes the link away; the folder and the grades stay.
   (worker.js /api/drive: a trainer may "link" and "disconnect" with a traineeId, nothing else of a trainee's drive.)
   ============================================================ */
(function(){
"use strict";
if(typeof renderAdminDrivePanel !== "function" || typeof driveAdminApi !== "function") return;
const E = (s)=> String(s == null ? "" : s).replace(/[&<>"']/g, c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const J = (s)=> String(s == null ? "" : s).replace(/[\\'"<>&]/g, c => "\\x" + c.charCodeAt(0).toString(16).padStart(2, "0"));
let SHARE = "", asked = false;
const msg = {};   // trainee id → the last result line
async function shareAddr(){
  if(SHARE || asked) return SHARE; asked = true;
  try{ const j = await driveAdminApi({action: "status"}); SHARE = (j.drive && j.drive.shareWith) || ""; }catch(e){}
  return SHARE;
}
function redraw(){ const w = document.getElementById("adminRowsWrap"); if(w && typeof renderAdminRows === "function" && state.view === "admin") w.innerHTML = renderAdminRows(); }
function box(rec){
  const rep = (state.driveReports || {})[rec.id] || {}, linked = !!rep.connected, m = msg[rec.id];
  if(!SHARE && !asked) shareAddr().then(a => { if(a) redraw(); });
  return `<div class="cmda" data-id="${E(rec.id)}">
    <div class="cmda-h">🔗 ${linked ? "Link a different Drive folder for this trainee" : "Link this trainee's Drive folder"}</div>
    <p class="cmda-p">The trainee shares their folder in Google Drive with ${SHARE ? `<b class="cmda-addr">${E(SHARE)}</b> <button type="button" class="cmda-mini" onclick="cmDriveAdmin.copy()">📋 Copy</button>` : "the platform's service account"} as <b>Editor</b>; paste the folder's link here.</p>
    <div class="cmda-row"><input type="url" class="cmda-in" id="cmdaIn-${E(rec.id)}" placeholder="https://drive.google.com/drive/folders/…" aria-label="The trainee's Drive folder link">
      <button type="button" class="btn btn-navy btn-sm" onclick="cmDriveAdmin.link('${J(rec.id)}')">🔗 Link for this trainee</button>
      ${linked ? `<button type="button" class="btn btn-ghost btn-sm" onclick="cmDriveAdmin.unlink('${J(rec.id)}')">✕ Unlink</button>` : ""}</div>
    ${m ? `<div class="cmda-msg ${m.ok ? "ok" : "no"}">${E(m.text)}</div>` : ""}
  </div>`;
}
const __panel = renderAdminDrivePanel;
window.renderAdminDrivePanel = function(rec){ return __panel.apply(this, arguments) + (rec && rec.id ? box(rec) : ""); };
async function link(id){
  const el = document.getElementById("cmdaIn-" + id), url = el ? el.value.trim() : "";
  if(!url){ msg[id] = {ok: false, text: "Paste the link of the trainee's Drive folder first."}; redraw(); return; }
  msg[id] = {ok: true, text: "Linking…"}; redraw();
  try{
    const j = await driveAdminApi({action: "link", traineeId: id, url});
    msg[id] = {ok: true, text: `Linked${j.drive && j.drive.rootName ? `: ${j.drive.rootName}` : ""}.${j.built ? " The structure the trainee already passed was made in it." : ""}`};
    if(typeof loadDriveReports === "function") await loadDriveReports(true);
  }catch(e){ msg[id] = {ok: false, text: e.message}; }
  redraw();
}
async function unlink(id){
  if(!confirm("Unlink this trainee's Backup Drive folder? The folder and everything in it stay in their Drive, and their grades are kept.")) return;
  try{ await driveAdminApi({action: "disconnect", traineeId: id}); msg[id] = {ok: true, text: "Unlinked."}; if(typeof loadDriveReports === "function") await loadDriveReports(true); }
  catch(e){ msg[id] = {ok: false, text: e.message}; }
  redraw();
}
function copy(){ try{ navigator.clipboard.writeText(SHARE); if(typeof toast === "function") toast("Address copied."); }catch(e){} }
window.cmDriveAdmin = {link, unlink, copy};
const css = document.createElement("style");
css.textContent = `.cmda{margin-top:12px;padding:12px 14px;border:2px solid #DDE1EA;border-radius:10px;background:#F8F9FC;}
.cmda-h{font:800 15px 'Poppins','Inter',sans-serif;color:#1E2340;margin-bottom:4px;}
.cmda-p{font:600 14px/1.45 'Inter',sans-serif;color:#2E3245;margin:0 0 8px;} .cmda-addr{word-break:break-all;}
.cmda-row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;} .cmda-in{flex:1 1 280px;min-width:0;padding:7px 10px;border:2px solid #C9D1E6;border-radius:8px;font:600 14px 'Inter',sans-serif;}
.cmda-mini{border:1px solid #C9D1E6;background:#fff;border-radius:6px;font:700 12px 'Inter',sans-serif;padding:2px 8px;cursor:pointer;}
.cmda-msg{margin-top:8px;font:700 14px/1.4 'Inter',sans-serif;} .cmda-msg.ok{color:#1E7A3A;} .cmda-msg.no{color:#A50E0E;}`;
document.head.appendChild(css);
})();
