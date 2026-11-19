/* 🧳 LOGGING OUT NEVER LOSES WORK: the device's copy is wiped only once the server has it
   logout (index.html) ran cloudSaveNow, ignored the false it gives when the save fails, and wiped the device's progress
   anyway; forceRevokedLogout (the approval check, when trainee:<id> is gone or not approved, which is exactly what a
   trainer's 👥 merge leaves behind) wiped it without saving at all; and js/portal-gate.js logs out whoever is signed in
   when the Portal maps the trainee to another id. Work that never reached the server was then gone. Logout also left
   many personal keys behind (case-flow, net-sheet, doc-filing, the drive keys...), which the next trainee on a shared
   computer uploaded as their own. This file wraps window.logout and window.forceRevokedLogout:
   • A confirmed save first: cloudSaveNow() must answer true (tried twice). Only then is the device wiped, and then of
     EVERY personal key (PERSONAL_KEYS, the ones add-ons registered with registerPersonalKeys included).
   • No confirmed save: the device keeps a backup of every personal key (localStorage lsh_orphan:<id>:<ms>) and uploads it
     to the trainee-writable orphan:<id>:<ms> on the server (written once, never overwritten; a trainer folds it back).
       - Log out from the page: the trainee stays signed in, the save status says the server hasn't got everything, and
         a message says the work is kept. Logging out again once online signs them out.
       - The Portal signing in someone else on this device (js/portal-gate.js passes {from: "portal"}), a pending or
         declined registration, or a revoked account: signed out, the device NOT wiped (lsh_kept-for = the id). The next
         account restored here (cloudRestore) takes its own server copy; a key it has no copy of that still holds the
         earlier account's value (backed up above) is cleared then, so it is never uploaded as theirs.
   • A merged account (its save is refused with "This account was merged"): backed up and uploaded as above, nothing
     wiped, and the trainee is sent back to the LSH Training Portal to open the account it was merged into. During the
     Portal's own sign-in it is not sent away again (it is arriving from there).
   • A backup whose upload failed is uploaded later, once someone is signed in (as orphan:<current id>:<ms>, naming the
     account it came from). Once the server has a backup (written once there), the device keeps only its record, not its
     data; of the backups not uploaded, only the newest per account is kept (it holds every key the older ones did), and
     an older one is dropped only once the newer one is stored. The last 6 records are kept.
     An orphan's owner is the id in its key (the Worker takes it only from that id's token); the traineeId, name and batch
     in its body are what this device claims, shown to a trainer, never acted on (worker-account-repair.js folds in only
     an account's own, never a "handover").
   • The server answering that it will never take this account's saves (401 or 403 other than "merged": a session that
     can't be renewed, access offboarded, portal-required): Log out backs the work up and signs out, the device unwiped.
   • 👥 After a trainer's merge (progress:<id>.mergedAt), the next start restores the merged snapshot: this device's own
     copy is backed up first (keep: "before-merged-restore"), and its saves then name the merge they restored (mergedAt on
     progress:<id>, mergeSeen on trainee:<id>). Until a device has, the Worker joins its saves with the merge's own copy
     (worker-identity.js afterMerge), so a tab left open can't drop what the merge folded in, and answers {mergePending}:
     a page open through the merge then restores the merged copy at once (its own copy backed up first).
   • A backup of another trainee's work that can't be uploaded is cleared from the device (its record kept) at the sign-in
     of a different trainee after an upload was already tried under one: never kept on a shared computer for good.
   • A shared computer whose earlier account's leftovers have no backup here (localStorage full, a private window): they
     are backed up to the server under the account now signed in (orphan:<id>:<ms>, reason "handover"), then cleared; if
     that fails too they stay on the device but are never uploaded as the new account's own (lsh_kept-hold).
   window.cmSafeLogout: {backups(), uploadPending(), lastResult} (the checks read it). */
(function(){
"use strict";
if(typeof state === "undefined" || typeof window.logout !== "function") return;
const PFX = "lsh_orphan:", KEPT = "lsh_kept-for", HOLD = "lsh_kept-hold", SEEN = "lsh_merge-seen", KEEP_N = 6;
const say = m => { try{ if(typeof toast === "function") toast(m); }catch(e){} };
const keys = () => (typeof PERSONAL_KEYS !== "undefined" ? PERSONAL_KEYS.slice() : []);
const sig = v => { const t = JSON.stringify(v === undefined ? null : v); return (typeof certHash === "function" ? certHash(t) : "") + ":" + t.length; };
const lsGet = k => { try{ return localStorage.getItem(k); }catch(e){ return null; } };
const lsSet = (k, v) => { try{ localStorage.setItem(k, v); return localStorage.getItem(k) === v; }catch(e){ return false; } };
const lsDel = k => { try{ localStorage.removeItem(k); }catch(e){} };
const SL = {mergedFor: "", refusedFor: "", lastResult: null, hold: null, restoring: false};
const lsJson = k => { try{ return JSON.parse(lsGet(k) || "null"); }catch(e){ return null; } };

// ---------- what the server answered: a merged account's save is refused with "This account was merged …"; a 401 or
// another 403 on the progress save is a server that will never take this account's saves ----------
if(typeof window.authFetch === "function"){
  const af = window.authFetch;
  window.authFetch = async function(url, payload){
    const id = state.traineeId, res = await af.apply(this, arguments);
    // 👥 a save the Worker joined with a merge this device hasn't restored ({mergePending}): the merged copy is restored now
    if(res && res.ok && url === "/api/storage/set" && id && payload && (payload.key === "progress:" + id || payload.key === "trainee:" + id)){
      try{ const j = await res.clone().json(); if(j && j.mergePending && j.mergePending !== seenFor(id)) restoreMerged(id); }catch(e){}
    }
    if(res && url === "/api/storage/set" && id && payload && payload.key === "progress:" + id){
      if(res.ok){ if(SL.refusedFor === id) SL.refusedFor = ""; }
      else if(res.status === 401 || res.status === 403){
        let m = false; try{ const j = await res.clone().json(); m = /merged/i.test(String(j && j.error || "")); }catch(e){}
        if(m) SL.mergedFor = id; else SL.refusedFor = id;
      }
    } else if(res && res.status === 403 && url === "/api/storage/set" && id){
      try{ const j = await res.clone().json(); if(/merged/i.test(String(j && j.error || ""))) SL.mergedFor = id; }catch(e){}
    }
    return res;
  };
}
const merged = id => !!id && SL.mergedFor === id;
const refused = id => !!id && SL.refusedFor === id && !merged(id);

// ---------- 👥 the merge this device restored, named on its saves (worker-identity.js afterMerge) ----------
const seenFor = id => { const v = lsJson(SEEN); return v && v.id === id ? v.at : ""; };
const holdFor = id => { const v = SL.hold || lsJson(HOLD); return v && v.forId === id && v.held ? v.held : null; };
if(typeof window.sharedSet === "function"){
  const ss = window.sharedSet;
  window.sharedSet = function(key, val){
    const args = Array.prototype.slice.call(arguments);
    try{
      const id = state.traineeId;
      if(id && !state.isAdmin && val && typeof val === "object" && !Array.isArray(val)){
        if(key === "progress:" + id){
          const v = Object.assign({}, val), seen = seenFor(id), hold = holdFor(id);
          if(seen) v.mergedAt = seen;
          // an earlier account's leftovers on a shared computer (no backup of them could be made) are never uploaded as this one's
          if(hold && v.data && typeof v.data === "object"){ const d = Object.assign({}, v.data); Object.keys(hold).forEach(k => { if(k in d && sig(d[k]) === hold[k]) delete d[k]; }); v.data = d; }
          args[1] = v;
        } else if(key === "trainee:" + id){ const seen = seenFor(id); if(seen) args[1] = Object.assign({}, val, {mergeSeen: seen}); }
      }
    }catch(e){ /* the save itself always goes ahead */ }
    return ss.apply(this, args);
  };
}

// a trainer merged this account while this page was open (the Worker answered a save with {mergePending}): the merged
// copy is restored here now, so the page shows it and its next saves name the merge, instead of being joined with it on
// the Worker save after save. This device's own work goes up FIRST (a real progress save: the Worker joins it with the
// merge's copy), so the copy restored holds it; when that save fails, nothing is restored (the work is backed up, and
// the next {mergePending} tries again)
function restoreMerged(id){
  if(SL.restoring || typeof window.cloudRestore !== "function") return;
  SL.restoring = true;
  setTimeout(async () => {
    try{
      if(state.traineeId !== id) return;
      let up = false;
      if(typeof cloudSaveNow === "function"){ state.lastCloudSig = null; try{ up = await cloudSaveNow(); }catch(e){ up = false; } }
      if(!up || state.traineeId !== id){ if(state.traineeId === id) await keep(id, "before-merged-restore"); return; }
      const keepName = state.traineeName, r = await window.cloudRestore(id);
      if(r && state.traineeId === id && typeof loadAll === "function"){
        await loadAll(); state.traineeName = keepName; state.lastCloudSig = null;
        say("Your trainer joined your accounts into this one: this page now shows all your work.");
        try{ render(); }catch(e){}
      }
    }catch(e){ /* the Worker keeps joining the saves until a restore goes through */ }
    finally{ SL.restoring = false; }
  }, 0);
}

// ---------- the backup ----------
function backups(){
  const out = [];
  try{ for(let i = 0; i < localStorage.length; i++){ const k = localStorage.key(i); if(k && k.startsWith(PFX)){ try{ out.push(Object.assign({lsKey: k}, JSON.parse(localStorage.getItem(k)))); }catch(e){} } } }catch(e){}
  return out.sort((a, b) => String(a.at).localeCompare(String(b.at)));
}
async function snapshot(){
  const data = {};
  for(const k of keys()){ try{ const v = await storeGet(k); if(v !== null && v !== undefined) data[k] = v; }catch(e){} }
  return data;
}
async function upload(b, asId){
  if(!asId || typeof authFetch !== "function" || !b.data) return false;
  const ms = String(Date.now()).padStart(13, "0"), key = `orphan:${asId}:${ms}`;
  const value = JSON.stringify({traineeId: b.traineeId, uploadedBy: asId, at: b.at, uploadedAt: new Date().toISOString(), reason: b.reason, name: b.name, batch: b.batch, data: b.data});
  try{
    const r = await authFetch("/api/storage/set", {key, value});
    if(!r.ok) return false;
    b.uploaded = key;
    // (the server's copy is written once and kept: the device keeps the record of it, not a second copy of the work)
    if(b.stored !== false) lsSet(b.lsKey, JSON.stringify(Object.assign({}, b, {lsKey: undefined, data: undefined})));
    return true;
  }catch(e){ return false; }
}
function prune(){
  const all = backups();
  const drop = all.filter(b => b.uploaded || b.cleared).slice(0, Math.max(0, all.length - KEEP_N));
  drop.forEach(b => lsDel(b.lsKey));
}
// a backup of every personal key on this device (one per change: the same data isn't stored twice), uploaded if it can be
// (under asId: the account signed in now, the only one the server takes it from)
async function keep(id, reason, asId, who){
  const data = await snapshot(), s = sig(data);
  let b = backups().filter(x => x.traineeId === id && x.sig === s).pop();
  if(!b){
    const ms = Date.now();
    b = {lsKey: `${PFX}${id}:${ms}`, traineeId: id, at: new Date(ms).toISOString(), reason, sig: s, name: who ? who.name || "" : state.traineeName || "", batch: who ? who.batch || "" : state.traineeBatch || "", data, uploaded: ""};
    b.stored = lsSet(b.lsKey, JSON.stringify(Object.assign({}, b, {lsKey: undefined})));
    // the newest backup not uploaded holds every key the older ones of this account did: those go, once it is stored
    if(b.stored) backups().filter(x => x.traineeId === id && !x.uploaded && x.lsKey !== b.lsKey).forEach(x => lsDel(x.lsKey));
  } else b.stored = true;
  if(!b.uploaded) await upload(b, asId || id);
  prune();
  return {stored: !!b.stored, uploaded: !!b.uploaded, key: b.lsKey, sig: s};
}
// backups not uploaded yet go up once someone is signed in (under their own id: the server takes only that)
// A backup of ANOTHER trainee's work (a shared computer) that can't be uploaded isn't kept on the device for good: it is
// tried under each trainee signed in here; once an upload was tried under one trainee's sign-in, the next sign-in of yet
// another trainee clears its data (its record stays, as an uploaded one's does). The owner's own sign-in never clears it.
async function uploadPending(){
  if(!state.traineeId || state.isAdmin) return 0;
  let n = 0;
  for(const b of backups().filter(x => !x.uploaded && !x.cleared && x.data)){
    if(await upload(b, state.traineeId)){ n++; continue; }
    if(!b.traineeId || b.traineeId === state.traineeId) continue;
    const rec = Object.assign({}, b, {lsKey: undefined});
    if(b.triedBy && b.triedBy !== state.traineeId) lsSet(b.lsKey, JSON.stringify(Object.assign(rec, {data: undefined, cleared: new Date().toISOString()})));
    else if(!b.triedBy) lsSet(b.lsKey, JSON.stringify(Object.assign(rec, {triedBy: state.traineeId})));
  }
  prune();
  return n;
}

// ---------- the save that must be confirmed ----------
async function saved(forceWrite){
  if(typeof cloudSaveNow !== "function") return false;
  for(let i = 0; i < 2; i++){
    if(forceWrite || i) state.lastCloudSig = null;   // a real write, so the server's answer is heard (and a merge noticed)
    let ok = false; try{ ok = await cloudSaveNow(); }catch(e){ ok = false; }
    if(ok) return true;
    if(merged(state.traineeId)) return false;
    await new Promise(r => setTimeout(r, 800));
  }
  return false;
}
// every personal key cleared: only ever after a confirmed save
async function wipeAll(){
  for(const k of keys()){ try{ await storeSet(k, null); }catch(e){} }
  lsDel("lsh_progress-saved-at"); lsDel(KEPT);
}
// before a confirmed logout clears the device: an earlier account's leftovers held back (lsh_kept-hold, no backup of them
// could be made when this account was restored) are backed up now, while this account's token can still upload them
async function holdBackup(id){
  const h = SL.hold || lsJson(HOLD);
  if(!holdFor(id)) return;
  try{ await keep(h.fromId || "unknown", "handover", id, {name: "", batch: ""}); }catch(e){}
  SL.hold = null; lsDel(HOLD);
}
// signed out with the device's work left in place (it is backed up): what each key held, so the next account restored
// here can tell the earlier account's leftovers from its own
async function signOutKeeping(id, k){
  const data = await snapshot(), held = {};
  Object.keys(data).forEach(x => { held[x] = sig(data[x]); });
  // (sig: the backup of exactly this work, which the next account's restore looks for before it clears any of it)
  lsSet(KEPT, JSON.stringify({id, at: new Date().toISOString(), held, sig: k && (k.stored || k.uploaded) ? k.sig : ""}));
  if(state.approvalPollInterval){ clearInterval(state.approvalPollInterval); state.approvalPollInterval = null; }
  try{ setTraineeToken(""); }catch(e){}
  state.traineeId = ""; state.traineeName = ""; state.isAdmin = false;
  try{ await storeSet("trainee-id", ""); await storeSet("trainee-name", ""); }catch(e){}
  state.view = "login";
  try{ render(); }catch(e){}
}
function toPortal(){
  if(state.approvalPollInterval){ clearInterval(state.approvalPollInterval); state.approvalPollInterval = null; }
  setTimeout(() => { try{ if(typeof window.goToMainPortal === "function") window.goToMainPortal(); }catch(e){} }, 2500);
}
const MERGED_MSG = "This account was merged into your current one. Your work on this device is kept and was sent to your trainer. Taking you back to the LSH Training Portal: open the program from there.";

// ---------- logout ----------
const logoutPage = window.logout;
window.logout = async function(opts){
  const id = state.traineeId, from = opts && opts.from;
  if(!id) return logoutPage.apply(this, arguments);
  if(await saved(false)){
    await holdBackup(id);
    const r = await logoutPage.apply(this, arguments);
    await wipeAll();
    SL.lastResult = {id, how: "saved-and-wiped"};
    return r;
  }
  const k = await keep(id, merged(id) ? "merged" : "logout-unsaved");
  if(merged(id)){
    SL.lastResult = Object.assign({id, how: "merged-kept"}, k);
    if(from === "portal"){ await signOutKeeping(id, k); return; }   // the Portal is signing them in to the account it was merged into
    say(MERGED_MSG); toPortal();
    throw Object.assign(new Error("kept: merged account"), {kept: true});
  }
  if(from === "portal" || ["pendingApproval", "registrationDenied"].includes(state.view)){
    SL.lastResult = Object.assign({id, how: "signed-out-kept"}, k);
    await signOutKeeping(id, k);
    return;
  }
  // the server answered, and will never take this account's saves: signed out, the work kept on the device and backed up
  if(refused(id)){
    SL.lastResult = Object.assign({id, how: "signed-out-kept", refused: true}, k);
    await signOutKeeping(id, k);
    say(`Signed out. The server doesn't take this account's saves any more, so your work on this device was kept${k.uploaded ? " and a copy was sent to your trainer" : ""}. Open the program again from the LSH Training Portal.`);
    return;
  }
  SL.lastResult = Object.assign({id, how: "stayed-signed-in"}, k);
  try{ setSaveStatus("offline"); }catch(e){}
  say(`Couldn't save your progress to the server, so you are still signed in: nothing was lost. Your work is kept on this device${k.uploaded ? " and a copy was sent to your trainer" : ""}. Log out again once you're back online.`);
  // (thrown, so the wrappers outside this one don't reset their part of the page as if the trainee had left)
  throw Object.assign(new Error("kept: not saved"), {kept: true});
};
// the page's Log out links call logout() without waiting: a refused logout is no error to report
window.addEventListener("unhandledrejection", e => { if(e && e.reason && e.reason.kept) e.preventDefault(); });

// ---------- forced logout (the approval check: the record gone or not approved) ----------
if(typeof window.forceRevokedLogout === "function"){
  const forcePage = window.forceRevokedLogout;
  window.forceRevokedLogout = async function(){
    const id = state.traineeId;
    if(!id) return forcePage.apply(this, arguments);
    const ok = await saved(true);   // a real write: a merged account's is refused, and that says where it went
    if(merged(id)){
      SL.lastResult = Object.assign({id, how: "merged-kept"}, await keep(id, "merged"));
      say(MERGED_MSG); toPortal();
      return;
    }
    if(ok){
      await holdBackup(id);
      const r = await forcePage.apply(this, arguments);
      await wipeAll();
      SL.lastResult = {id, how: "saved-and-wiped"};
      return r;
    }
    const k = await keep(id, "revoked-unsaved");
    SL.lastResult = Object.assign({id, how: "signed-out-kept"}, k);
    await signOutKeeping(id, k);
    say("Your access to this program has been revoked. Your work on this device is kept. Contact your trainer if you believe this is a mistake.");
  };
}

// ---------- the next account restored on a device signed out with work left on it; a merge restored ----------
if(typeof window.cloudRestore === "function"){
  const restorePage = window.cloudRestore;
  window.cloudRestore = async function(id){
    const self = this, args = arguments;
    const kept = lsJson(KEPT);
    let snap = null; try{ snap = await sharedGetStrict("progress:" + id); }catch(e){ return restorePage.apply(self, args); }   // can't tell: change nothing
    // (a copy the Worker couldn't join with the merge, mergeFoldSkipped, is not the merged one: never recorded as restored)
    const mergedNew = !!(snap && snap.mergedAt && snap.mergedAt !== seenFor(id) && !(snap.mergeFoldSkipped && snap.mergeFoldSkipped.mergedAt === snap.mergedAt));
    const seen = r => { if(r && mergedNew) lsSet(SEEN, JSON.stringify({id, at: snap.mergedAt})); return r; };
    if(!kept || !kept.id || kept.id === id){
      if(kept && kept.id === id) lsDel(KEPT);   // the same account back: its newer work stays
      if(!mergedNew) return restorePage.apply(self, args);
      // 👥 a trainer merged this account since this device restored it: the merged copy is restored, this device's own
      // copy backed up first (on the device and to the server), so unsaved work here is never lost by it
      if(lsGet("lsh_progress-saved-at")) await keep(id, "before-merged-restore");
      lsDel("lsh_progress-saved-at");
      return seen(await restorePage.apply(self, args));
    }
    // another account: it restores its own copy, whatever this device's save stamp says (that stamp was the other's)
    let backedUp = !!kept.sig && backups().some(b => b.traineeId === kept.id && b.sig === kept.sig && (b.stored !== false || b.uploaded));
    if(!backedUp){
      // no backup of the earlier account's leftovers here: one goes to the server under this account (a "handover",
      // never folded in as this account's work); if it can't, the leftovers stay but are never uploaded as this account's
      const k = await keep(kept.id, "handover", id, {name: "", batch: ""});
      backedUp = !!(k.uploaded || (k.stored && k.sig === sig(await snapshot())));
      if(!backedUp){
        const have = (snap && snap.data) || {}, held = {};
        Object.keys(kept.held || {}).forEach(x => { if(!(x in have)) held[x] = kept.held[x]; });
        SL.hold = {forId: id, held}; lsSet(HOLD, JSON.stringify(SL.hold));
      }
    }
    lsDel("lsh_progress-saved-at");
    const r = await restorePage.apply(self, args);
    if(backedUp){
      const have = (snap && snap.data) || {};
      for(const k of Object.keys(kept.held || {})){
        if(k in have) continue;
        let v = null; try{ v = await storeGet(k); }catch(e){ continue; }
        if(v !== null && sig(v) === kept.held[k]){ try{ await storeSet(k, null); }catch(e){} }
      }
    }
    lsDel(KEPT);
    setTimeout(later, 0);   // (a sign-in: backups left here go up now, or are cleared: uploadPending)
    return seen(r);
  };
}

// backups left from an earlier failed save go up once a trainee is signed in
const later = () => { if(state.traineeId && backups().some(b => !b.uploaded && !b.cleared && b.data)) uploadPending(); };
setTimeout(later, 8000);
window.addEventListener("online", later);

window.cmSafeLogout = {backups, uploadPending, keep, get lastResult(){ return SL.lastResult; }, get mergedFor(){ return SL.mergedFor; }};
})();
