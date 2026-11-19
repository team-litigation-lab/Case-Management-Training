/* ☁ THE TRAINEE'S RECORD ALWAYS GETS THE KNOWLEDGE CHECK: syncToLedger, retried until the server has it
   A Knowledge Check reaches trainee:<id> (what the trainer's 🏅 Scorecard and 📋 Batch Sheet read) only through
   syncToLedger (index.html). It read the record with sharedGet, which answers null on ANY failure (a 401, a 429 from
   Cloudflare's request limit, a 5xx, flaky Wi-Fi), took that null for "the record is gone" and quietly skipped the
   write; and it never looked at whether its write went through. The score then stayed on the trainee's device only.
   This file wraps window.syncToLedger:
   • the record is read with sharedGetStrict: a read that fails is a failure to retry, never "no record";
   • the page's own syncToLedger then runs on the record just read (it is handed that copy, so nothing is read twice),
     and its write to trainee:<id> is watched: a write the server didn't take is a failure to retry;
   • a failure leaves the sync pending: it is tried again on its own (3 s, 10 s, 30 s, 1 min, 2 min, then every 5 min),
     when the tab comes back into view, when the device is back online and on the next progress save (cloudSaveNow);
   • while it is pending, the save status under the page says so ("⚠ Couldn't reach the server — saved on this device
     and will retry"), as a progress save that failed does;
   • a record the server says is not there (an answer, not a failure) is left alone, as before: only sign-in creates
     one, and the approval check signs a revoked trainee out;
   • a write refused because a trainer merged the account into another ("This account was merged …") is not retried:
     the server will never take it (js/cm-safe-logout.js backs the work up and sends the trainee to the Portal).
   The calls run one after another, so two never interleave their read and write.
   window.cmLedgerRetry: {pending, stopped, retry(), state()} (the checks read it). */
(function(){
"use strict";
if(typeof window.syncToLedger !== "function" || typeof state === "undefined") return;
const page = window.syncToLedger;
const LR = {pending: null, tries: 0, error: "", okAt: null, stopped: null};
const WAIT = [3000, 10000, 30000, 60000, 120000, 300000];
let chain = Promise.resolve(), timer = null;

function repaint(){ try{ if(typeof setSaveStatus === "function") setSaveStatus(state.saveStatus); }catch(e){} }
function failed(id, allowCreate, why){
  const was = LR.pending && LR.pending.id === id ? LR.pending : null;
  LR.pending = {id, allowCreate: !!(allowCreate || (was && was.allowCreate)), since: (was && was.since) || new Date().toISOString()};
  LR.error = String(why || "");
  LR.tries++;
  clearTimeout(timer);
  timer = setTimeout(retry, WAIT[Math.min(LR.tries - 1, WAIT.length - 1)]);
  repaint();
  return false;
}
function settled(){
  const had = !!LR.pending;
  LR.pending = null; LR.tries = 0; LR.error = ""; LR.okAt = new Date().toISOString();
  clearTimeout(timer); timer = null;
  if(had) repaint();
  return true;
}
async function attempt(allowCreate){
  const id = state.traineeId; if(!id) return true;
  const key = "trainee:" + id;
  let existing;
  try{ existing = await sharedGetStrict(key); }
  catch(e){ return failed(id, allowCreate, "read: " + (e && e.message || e)); }
  if(state.traineeId !== id) return true;   // signed out (or in as someone else) while it was read
  // the page's own syncToLedger, on the copy just read; its write to the record is watched (and the server's refusal read)
  const get = window.sharedGet, set = window.sharedSet, af = window.authFetch;
  let served = false, wrote = null, threw = null, mergedAway = false;
  if(typeof af === "function") window.authFetch = async function(url, payload){
    const res = await af.apply(this, arguments);
    if(res && res.status === 403 && url === "/api/storage/set" && payload && payload.key === key){ try{ const j = await res.clone().json(); if(/merged/i.test(String(j && j.error || ""))) mergedAway = true; }catch(e){} }
    return res;
  };
  window.sharedGet = function(k){
    if(k === key && !served){ served = true; return Promise.resolve(existing ? JSON.parse(JSON.stringify(existing)) : null); }
    return get.apply(this, arguments);
  };
  window.sharedSet = async function(k){
    const r = await set.apply(this, arguments);
    if(k === key) wrote = wrote === false ? false : !!r;
    return r;
  };
  try{ await page.call(window, allowCreate); }catch(e){ threw = e; }
  finally{
    if(window.sharedGet !== get) window.sharedGet = get;
    if(window.sharedSet !== set) window.sharedSet = set;
    if(af && window.authFetch !== af) window.authFetch = af;
  }
  if(threw) return failed(id, allowCreate, "sync: " + (threw && threw.message || threw));
  // 👥 an account a trainer merged into another: the server will never take its record again (the device's work is
  // backed up and the trainee sent to the Portal, js/cm-safe-logout.js), so it is not retried every few minutes
  if(wrote === false && mergedAway){ LR.pending = null; LR.tries = 0; LR.error = "merged"; clearTimeout(timer); timer = null; LR.stopped = {id, why: "merged", at: new Date().toISOString()}; repaint(); return false; }
  if(wrote === false) return failed(id, allowCreate, "write refused");
  return settled();
}
window.syncToLedger = function(allowCreate){
  const run = chain.then(() => attempt(allowCreate)).catch(e => failed(state.traineeId, allowCreate, e && e.message));
  chain = run.catch(() => {});
  return run;
};
async function retry(){
  clearTimeout(timer); timer = null;
  const p = LR.pending;
  if(!p) return true;
  if(!state.traineeId || state.traineeId !== p.id){ LR.pending = null; LR.tries = 0; repaint(); return true; }   // another trainee now
  return window.syncToLedger(p.allowCreate);
}

// while the record's sync is pending, the save status says the server hasn't got everything yet
if(typeof window.saveStatusText === "function"){
  const text = window.saveStatusText;
  window.saveStatusText = function(){
    if(LR.pending && state.traineeId === LR.pending.id && state.saveStatus !== "saving"){
      const s = state.saveStatus; state.saveStatus = "offline";
      try{ return text.apply(this, arguments); }finally{ state.saveStatus = s; }
    }
    return text.apply(this, arguments);
  };
}
// the next progress save carries a pending sync with it
if(typeof window.cloudSaveNow === "function"){
  const save = window.cloudSaveNow;
  window.cloudSaveNow = async function(){
    const r = await save.apply(this, arguments);
    if(LR.pending) retry();
    return r;
  };
}
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "visible" && LR.pending) retry(); });
window.addEventListener("online", () => { if(LR.pending) retry(); });

window.cmLedgerRetry = {
  get pending(){ return LR.pending; },
  retry,
  get stopped(){ return LR.stopped; },
  state: () => ({pending: LR.pending, tries: LR.tries, error: LR.error, okAt: LR.okAt, stopped: LR.stopped})
};
})();
