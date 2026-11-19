/* 👥 MERGED-AWAY ACCOUNTS: one rule for who is on a score table
   A confirmed 👥 Merge (worker-account-repair.js) writes merged:<other> = {into: keep} at once, but leaves trainee:<other>
   in place (pendingDelete) until the merge is run again once the redirect is SETTLE_MS old. Until then the trainer's list
   of trainee: records still has the other account, so the same person showed twice on every score table, with a smaller,
   older copy, and the 👥 duplicate-accounts box kept offering the merge.
   This file reads the merged:<id> redirects (admin only: a trainee can't read them, and never asks) and gives the one
   inclusion rule every score table uses (js/cm-batch-sheet.js people / dupGroups, js/cm-scorecard.js loadAll):
     cmMergedAway.away(r, all)   the id r was merged into, when merged:<r.id> leads (following a chain) to a DIFFERENT id
                                 that has a live record in all; else null. A redirect to itself, or to no live record (the
                                 stale-redirect case), is not "merged away": that record is the kept account.
     cmMergedAway.live(list)     list without the merged-away records
     cmMergedAway.scored(list)   the score tables' rule: approved, not rejected, not archived, not merged away
     cmMergedAway.ready()        a promise: the redirects read (re-read at most once a minute; reload() forces it). It
                                 is called by the tables that need it (not on every ledger read), and a table drawn
                                 before the first read is drawn again when it is in.
   Nothing is written. */
(function(){
"use strict";
const M = {map: {}, at: 0, p: null, loaded: false};
const isAdmin = () => typeof state === "object" && !!state.isAdmin;
async function read(){
  const keys = ((typeof sharedList === "function" ? await sharedList("merged:") : []) || []).map(k => typeof k === "string" ? k : k && (k.name || k.key)).filter(k => /^merged:[^:]+$/.test(k || ""));
  const vals = keys.length && typeof sharedGetMany === "function" ? await sharedGetMany(keys) : [];
  const map = {};
  keys.forEach((k, i) => { let v = vals[i]; if(typeof v === "string"){ try{ v = JSON.parse(v); }catch(e){ v = null; } }
    const into = v && typeof v === "object" ? v.into : null; if(into) map[k.slice(7)] = String(into); });
  return map;
}
function ready(force){
  if(!isAdmin()) return Promise.resolve(M.map);
  if(M.p) return M.p;
  if(!force && M.loaded && Date.now() - M.at < 60000) return Promise.resolve(M.map);
  // (a table waiting on the first read is drawn when it is in; after that only a change redraws)
  const first = !M.loaded;
  M.p = read().then(map => { const was = JSON.stringify(M.map); M.map = map; M.loaded = true; M.at = Date.now(); M.p = null;
      if(first || JSON.stringify(map) !== was) redraw(); return map; })
    .catch(() => { M.p = null; M.at = Date.now(); M.loaded = true; if(first) redraw(); return M.map; });
  return M.p;
}
function redraw(){
  if(typeof state !== "object" || !["admin", "scorecard"].includes(state.view) || typeof render !== "function") return;
  if(typeof isTyping === "function" && isTyping()) return;
  try{ if(window.cmScorecard && cmScorecard.invalidate) cmScorecard.invalidate(); }catch(e){}
  render();
}
function away(r, all){
  if(!r || !r.id) return null;
  const live = new Set((all || (typeof state === "object" && state.adminData) || []).filter(x => x && x.id && !x.rejected).map(x => String(x.id)));
  let id = String(r.id), seen = new Set([id]);
  for(let i = 0; i < 8; i++){
    const t = M.map[id]; if(!t || seen.has(t)) break;
    seen.add(t); id = t;
    if(live.has(t)) return t;
  }
  return null;
}
function live(list){ const all = (typeof state === "object" && state.adminData) || list || []; const pool = (list || []).concat(all);
  return (list || []).filter(r => !away(r, pool)); }
const scored = list => live((list || []).filter(r => r && r.approved === true && !r.rejected && !r.archived));
window.cmMergedAway = {ready, reload: () => ready(true), away, live, scored, loaded: () => M.loaded || !isAdmin(), state: () => M};
// (read only where a score table or the 👥 duplicate marker needs it, never with the Admin screen's ledger: the Trainee
// Audit stays at its two requests, .github/scripts/requests.cjs; once read it is kept a minute)
})();
