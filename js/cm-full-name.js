/* 🪪 THE NAME ON THE CERTIFICATE IS THE ONE REGISTERED ON THE PORTAL
   The Portal's sign-in ticket carries the trainee's whole registered name (full: a middle name or initial, a suffix). The
   Worker keeps it on trainee:<id> as fullName, set by the Portal's sign-in only (an identity field: never the trainee's to
   change, worker.js IDENTITY_TRAINEE_FIELDS); the record's name and id stay first + last name + batch. certData
   (index.html) built the certificate's name from the first and last name alone, so "Maria L. Santos" was given a
   certificate for "Santos, Maria". This file wraps certData: when the record has a fullName, the certificate shows it, in
   the order the trainers chose (Admin → certificate: "Last name, First name" or "First name Last name"). The trainee's own
   record is read when they open or download their certificate; a trainer's copy comes from the roster (state.adminData).
   window.cmFullName: {certName(full, first, last, fmt)} (the checks call it). */
(function(){
"use strict";
if(typeof window.certData !== "function" || typeof state === "undefined") return;
const clean = s => String(s == null ? "" : s).replace(/\s+/g, " ").trim();
const edge = c => c === undefined || /[\s,]/.test(c);
// The registered name in the certificate's order. Last, First: the last name moved to the front, what came before it
// after the comma, a suffix kept at the end ("John A. Doe Jr." → "Doe, John A. Jr."). A full name the last name is not a
// word of (or starts with) is shown as registered: its order can't be told.
function certName(full, first, last, fmt){
  full = clean(full); last = clean(last);
  if(!full) return "";
  if(fmt === "firstLast" || !last) return full;
  const i = full.toLowerCase().lastIndexOf(last.toLowerCase());
  if(i <= 0 || !edge(full[i - 1]) || !edge(full[i + last.length])) return full;
  const before = clean(full.slice(0, i)).replace(/,$/, ""), after = clean(full.slice(i + last.length)).replace(/^,\s*/, "");
  return before ? `${full.slice(i, i + last.length)}, ${before}${after ? " " + after : ""}` : full;
}
const fmt = () => (state.certSettings && state.certSettings.nameFormat) || "lastFirst";
const rowOf = id => (Array.isArray(state.adminData) ? state.adminData : []).find(r => r && r.id === id) || null;
let own = null;   // {id, full, last}: the signed-in trainee's record, read when they open their certificate

const certPage = window.certData;
window.certData = function(src){
  const c = certPage.apply(this, arguments);
  try{
    let full = "", first = "", last = "";
    if(src){ const r = rowOf(src.traineeId) || {}; full = src.fullName || r.fullName; first = src.firstName || r.firstName; last = src.lastName || r.lastName; }
    else if(own && own.id === state.traineeId){ full = own.full; first = state.regName && state.regName.first; last = (state.regName && state.regName.last) || own.last; }
    const n = certName(full, first, last, fmt());
    if(n && c){ c.name = n; c.confirmedName = true; }
  }catch(e){ /* the certificate keeps the name certData gave it */ }
  return c;
};
async function loadOwn(){
  const id = state.traineeId; if(!id || typeof sharedGet !== "function") return;
  try{ const me = await sharedGet("trainee:" + id); if(me && state.traineeId === id) own = {id, full: clean(me.fullName), last: clean(me.lastName)}; }catch(e){ /* the last copy read stands */ }
}
// the trainee's own certificate (no src / a null admin id) reads their record first
["openCertificate", "downloadCertificatePdf"].forEach(n => {
  const f = window[n]; if(typeof f !== "function") return;
  window[n] = async function(src){ if(!src) await loadOwn(); return f.apply(this, arguments); };
});
window.cmFullName = {certName};
})();
