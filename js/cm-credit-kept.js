/* 🛡 CREDIT KEPT: work a trainee was credited for stays credited
   The case file keeps being corrected (John Doe's figures, the records screened, the Net Sheet's lines), and a trainee's
   work is often scored again from its answers whenever a page is drawn. A correction must never take away credit a
   trainee already earned:
   • 📊 Net Sheet: each stage's stored result (net-sheet.files[track].checks[stage]) is the best one. A later Check my
     sheet that ties out fewer lines never lowers it: it is kept as that stage's .last (shown as the latest check), and a
     stage that tied out keeps .tiedAt ("tied out on <date>"). Start over clears the cells, never the results. The rule
     is keepStage() below, used by js/cm-net-sheet.js as it checks and by the course page on every save of the sheet
     (so an older copy of the sheet open in another tab can't write a lower result over it).
   • 🔎 Case exercises scored against an answer key when they are read (the exhibit audits, the records screening, the
     judgement call on a served email): the score is stamped on the record when it is handed in ({kept: {right, of, at}}),
     and the Scorecard reads that stamp. Work handed in before the stamp existed is scored on the answer key as it was
     when it was handed in (KEY_HISTORY: the records screened before 18 Nov 2026 22:27 UTC were the 11 records without
     RS97 and RS98), never on a key that changed afterwards.
   • ✍️ Knowledge Checks: the Scorecard reads the best score and the day stays passed once any attempt passed
     (js/cm-scorecard.js kcBest / kcPassed, which also read the device's own day progress and the work log).
   window.cmCreditKept: {keepStage, keepSheet, nsBest, audit, screen, choice, KEY_HISTORY}. */
(function(){
"use strict";
const ratio = k => k && k.total ? k.passed / k.total : -1;
const full = k => !!(k && k.total && k.passed === k.total);
const clean = k => { if(!k) return k; const c = Object.assign({}, k); delete c.last; delete c.tiedAt; return c; };
// a stage's result after a new check: the better of the two stays the result, the newer one is kept beside it as .last
function keepStage(old, now){
  if(!now) return old;
  if(!old || !old.total) return Object.assign({}, now, full(now) ? {tiedAt: now.tiedAt || now.at} : {});
  const tiedAt = old.tiedAt || (full(old) ? old.at : "") || (full(now) ? now.at : "");
  const newer = String(now.at || "") >= String(old.at || "");
  if(ratio(now) >= ratio(old)) return Object.assign({}, clean(now), tiedAt ? {tiedAt} : {}, !newer && old.last ? {last: old.last} : {});
  // the new check is lower: the stored result stands
  const last = newer ? clean(now) : old.last;
  return Object.assign({}, clean(old), tiedAt ? {tiedAt} : {}, last ? {last} : {});
}
// a whole sheet record (net-sheet) written over an older one: every stage of every track keeps its best
function keepSheet(old, now){
  if(!now || typeof now !== "object" || !old || typeof old !== "object" || !old.files || !now.files) return now;
  const out = Object.assign({}, now, {files: Object.assign({}, now.files)});
  Object.entries(old.files).forEach(([f, of]) => {
    if(!of || !of.checks) return;
    const nf = out.files[f] = Object.assign({cells: {}}, now.files[f] || of, {checks: Object.assign({}, (now.files[f] || {}).checks || {})});
    Object.entries(of.checks).forEach(([st, k]) => { nf.checks[st] = nf.checks[st] ? keepStage(k, nf.checks[st]) : k; });
  });
  return out;
}
// the result a stage is credited with: the best stored one
const nsBest = k => [k, k && k.last].filter(x => x && x.total).sort((a, b) => ratio(b) - ratio(a))[0] || k;

/* ---------- 🔎 case exercises: the answer key the work was done against ---------- */
const KEY_HISTORY = {
  // the records screening for the amendment requests (CM_CF_EXHIBITS.amendments[block].screen): before RS97 and RS98 were added
  screen: {"d2m4-a1": [{until: "2026-11-18T22:26:58Z", docs: ["RS14", "RS16", "RS18", "RS21", "RS22", "RS23", "RS24", "RS25", "RS26", "RS31", "RS43"]}]}
};
const EX = () => window.CM_CF_EXHIBITS || {};
const kept = r => r && r.kept && typeof r.kept.of === "number" && r.kept.of > 0 ? {right: r.kept.right, of: r.kept.of, at: r.kept.at, kept: true} : null;
function audit(b, r, a){
  a = a || (EX().audits || {})[b]; if(!r || !r.at || !a || !Array.isArray(a.items)) return null;
  const k = kept(r); if(k) return k;
  const marks = r.marks || [];
  return {right: a.items.filter((it, i) => marks[i] === it.verdict).length, of: a.items.length};
}
function screenDocs(b, a, at){
  const h = (KEY_HISTORY.screen[b] || []).find(x => at && String(at) < x.until);
  return h ? h.docs : (a.screen || []).map(s => s.doc);
}
function screen(b, r, a){
  a = a || (EX().amendments || {})[b]; if(!r || !r.screened || !a || !Array.isArray(a.screen) || !a.screen.length) return null;
  const k = kept(r); if(k) return k;
  const asked = new Set((a.requests || []).map(q => q.doc)), docs = screenDocs(b, a, r.screened);
  return {right: docs.filter(d => ((r.marks || {})[d] === "fix") === asked.has(d)).length, of: docs.length};
}
function choice(b, r, e){
  e = e || (EX().emails || {})[b]; if(!r || r.choice == null || !e || !e.press || !e.press.choices) return null;
  if(r.kept && typeof r.kept.ok === "boolean") return {ok: r.kept.ok, kept: true};
  const c = e.press.choices[r.choice]; return c ? {ok: !!c.ok} : null;
}
// stamps the scores on a Case Flow record as it is saved (each once: a stamp is never recalculated)
function stamp(rec){
  if(!rec || typeof rec !== "object") return rec;
  const at = new Date().toISOString();
  Object.entries(rec.audits || {}).forEach(([b, r]) => { if(r && r.at && !r.kept){ const s = audit(b, r); if(s) r.kept = {right: s.right, of: s.of, at}; } });
  Object.entries(rec.amend || {}).forEach(([b, r]) => { if(r && r.screened && !r.kept){ const s = screen(b, r); if(s) r.kept = {right: s.right, of: s.of, at}; } });
  Object.entries(rec.service || {}).forEach(([b, r]) => { if(r && r.choice != null && !(r.kept && typeof r.kept.ok === "boolean")){ const s = choice(b, r); if(s) r.kept = {ok: s.ok, at}; } });
  return rec;
}

/* ---------- the course page: every save of the sheet and of the Case Flow record goes through here ---------- */
if(typeof window.storeSet === "function" && typeof window.storeGet === "function"){
  const set = window.storeSet;
  window.storeSet = async function(key, val){
    try{
      if(key === "net-sheet" && val && typeof val === "object" && !(typeof state !== "undefined" && state.cloudRestoring)){
        const old = await window.storeGet("net-sheet");
        if(old && typeof old === "object") val = keepSheet(old, val);
      }
      if(key === "case-flow" && val && typeof val === "object" && !(typeof state !== "undefined" && state.isAdmin && !state.adminPreview)) stamp(val);
    }catch(e){ /* the save itself always goes ahead */ }
    return set.call(this, key, val);
  };
}

window.cmCreditKept = {keepStage, keepSheet, nsBest, audit, screen, choice, stamp, KEY_HISTORY};
})();
