/* ☁ A COPY THIS DEVICE COULDN'T READ IS NEVER SAVED OVER
   cloudRestore (index.html) read progress:<id> with sharedGet, which answers null for a failed read as for "nothing saved".
   A trainee signing in on a new computer whose read failed (a Worker 500, a short network drop; js/cm-safe-logout.js reads
   once more first) was taken for one with no saved work, and four seconds later the new computer's near-empty copy was
   saved over the real one: their notes, Net Sheet, document filing, CMS log and Case Flow work gone, under "☁ Progress
   saved to your account". Now cloudRestore reads strictly: a failed read sets state.cloudUnread = <id>, and cloudSaveNow
   saves nothing for that id until a read succeeds (a real "no record yet" is a read that succeeded). This file:
   • shows the trainee a clear notice while that lasts (#cm-unread: we couldn't load your saved work, so nothing is saved
     until it loads; your work on this computer is kept) with a Try again button, and the save status says the same;
   • tries the read again by itself (15 s, then less often, up to every 2 minutes), and when it succeeds restores the saved
     copy (the page reloads its state from it) and saving starts again. Work done on this computer meanwhile is backed up
     first (js/cm-safe-logout.js keep: on the device and to the server as orphan:<id>:<ms>, for a trainer to fold back),
     so the restore never loses it either. A device whose own copy is newer keeps it (cloudRestore's rule).
   window.cmRestoreGuard: {retry(), unread()} (the checks read it). */
(function(){
"use strict";
if(typeof state === "undefined" || typeof window.cloudRestore !== "function" || typeof window.cloudSaveNow !== "function") return;
const WAIT = [15000, 30000, 60000, 120000];
let timer = null, busy = false, tries = 0, episode = null;   // episode: {id, sig}: this device's copy when the read first failed
const unread = () => !!state.traineeId && state.cloudUnread === state.traineeId;
const say = m => { try{ if(typeof toast === "function") toast(m); }catch(e){} };
async function deviceSig(){
  const data = {};
  for(const k of (typeof PERSONAL_KEYS !== "undefined" ? PERSONAL_KEYS : [])){ try{ const v = await storeGet(k); if(v !== null && v !== undefined) data[k] = v; }catch(e){} }
  const t = JSON.stringify(data);
  return (typeof certHash === "function" ? certHash(t) : "") + ":" + t.length;
}

// ---------- the notice ----------
function show(){
  let el = document.getElementById("cm-unread");
  if(!el){
    el = document.createElement("div");
    el.id = "cm-unread"; el.setAttribute("role", "alert");
    el.style.cssText = "position:fixed;left:16px;right:16px;bottom:16px;z-index:2147483600;max-width:760px;margin:0 auto;display:flex;flex-wrap:wrap;gap:10px 14px;align-items:center;justify-content:space-between;"
      + "background:#1E2340;color:#fff;border-left:6px solid #DB8437;border-radius:10px;padding:12px 16px;box-shadow:0 10px 30px rgba(0,0,0,.3);font-weight:700;font-size:16px;line-height:1.4";
    el.innerHTML = '<span><span aria-hidden="true">⚠ </span>We couldn’t load your saved work from the server, so nothing is being saved until it loads. Your work on this computer is kept.</span>'
      + '<button type="button" class="btn btn-primary" style="background:#DB8437;border-color:#DB8437;color:#fff;font-weight:800;font-size:16px;white-space:nowrap">Try again</button>';
    el.querySelector("button").onclick = () => { retry(); };
    document.body.appendChild(el);
  }
  const b = el.querySelector("button"); if(b){ b.disabled = busy; b.textContent = busy ? "Loading…" : "Try again"; }
}
function hide(){ const el = document.getElementById("cm-unread"); if(el) el.remove(); }
function schedule(){ clearTimeout(timer); timer = setTimeout(retry, WAIT[Math.min(tries, WAIT.length - 1)]); tries++; }

// ---------- a read that failed starts an episode; one that succeeded ends it ----------
const restorePage = window.cloudRestore;
window.cloudRestore = async function(id){
  const r = await restorePage.apply(this, arguments);
  if(state.cloudUnread === id && id === state.traineeId){
    if(!episode || episode.id !== id){ episode = {id, sig: await deviceSig()}; tries = 0; }
    show(); if(!busy) schedule();
    try{ setSaveStatus("unread"); }catch(e){}
  } else if(episode && episode.id === id){ episode = null; clearTimeout(timer); timer = null; hide(); }
  return r;
};

// ---------- trying again ----------
async function retry(){
  clearTimeout(timer); timer = null;
  const id = state.traineeId;
  if(!id || state.cloudUnread !== id){ hide(); return true; }
  if(busy) return false;
  busy = true; show();
  try{
    let ok = false; try{ await sharedGetStrict("progress:" + id); ok = true; }catch(e){ ok = false; }
    if(!ok || state.traineeId !== id){ schedule(); return false; }
    // the server answers again: what was done on this computer meanwhile is backed up before the saved copy is restored
    if(episode && episode.id === id && episode.sig !== await deviceSig() && window.cmSafeLogout && typeof window.cmSafeLogout.keep === "function"){
      try{ await window.cmSafeLogout.keep(id, "before-late-restore"); }catch(e){}
    }
    const keepName = state.traineeName;
    const restored = await window.cloudRestore(id);
    if(state.cloudUnread === id){ schedule(); return false; }
    if(restored && state.traineeId === id && typeof loadAll === "function"){
      await loadAll(); state.traineeName = keepName;
      try{ render(); }catch(e){}
    }
    state.lastCloudSig = null;
    say(restored ? "Your saved work has loaded. Saving to your account again." : "Connected again. Saving to your account again.");
    try{ setSaveStatus("saved"); }catch(e){}
    if(typeof scheduleCloudSave === "function") scheduleCloudSave();
    return true;
  }finally{
    busy = false;
    if(unread()) show(); else hide();
  }
}
window.addEventListener("online", () => { if(unread()) retry(); });
// (above every pop-up, the tools sign-in one included, so Try again can always be pressed; the page's render can drop
// the notice from the body: it is put back while the read is still owed)
setInterval(() => { if(unread() && !document.getElementById("cm-unread")) show(); else if(!unread() && document.getElementById("cm-unread")) hide(); }, 2000);
window.cmRestoreGuard = {retry, unread};
})();
