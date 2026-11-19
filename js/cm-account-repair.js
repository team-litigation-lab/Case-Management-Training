/* ============================================================
   🛠 Account Repair: the trainer's recovery tool, its own Admin section (🛠 Account Repair).

   Reads every trainee:, progress:, merged: and uid: record (it changes nothing by reading) and lists three things:
     1. 👥 SUSPECTED DUPLICATE ACCOUNTS of one person, as suggestions:
          - the same Portal id (portalUid);
          - the same name once accents are folded and the words sorted (swapped first and last names), or one name's
            words all in the other's (a middle name added), in any batch;
          - within an equivalent batch (canonicalBatch equal, or batchShow equal: B250926 and B092526 are one batch),
            the same first initial and last name, or names 2 letters or fewer apart (edit distance).
        Two records with two different Portal ids are never put together. Each person's accounts are listed oldest
        first (registeredAt, then lastActive).
     2. 🔒 SIGN-INS SENT ELSEWHERE by an earlier merge or redirect (merged:<id> = {into}): a redirect into an account that
        no longer exists (locked out: that sign-in opens a new, empty account), and the trainees whose CURRENT Portal name
        and batch (uid:<portalUid>) build an id that was redirected (before this release such a sign-in was refused).
     3. ✍️ KNOWLEDGE CHECKS MISSING from trainee:<id> that its own progress snapshot (progress:<id>.data["day-progress"])
        or work-log quiz entries hold: what the 🏅 Scorecard and the Batch Sheet read is the record.

   Nothing is changed without the trainer's confirm, and every change is done by the Worker, which reads everything again:
     - 👥 a person's accounts: "Preview merge" asks /api/account-merge for its DRY RUN (worker-account-repair.js): the table
       day · record value · recovered value · source, the id kept, and every key it would write, move, leave and delete.
       Only then is "Merge" offered, saying what it will do; it sends the same request with confirm: true and the preview's
       result (expectKeep, expectDelete, expectKc), which the Worker refuses if the accounts changed since. The other
       account's keys are deleted only when the merge is run again, two minutes or more later. cmAccountRepair.mergeIds
       does the same for the 📋 Batch Sheet's 👥 Merge.
     - 🔓 a merged:<id> left on a live account: "Remove redirect" (a dry run, then the confirmed removal, backed up).
     - ✍️ one account: "Restore missing KC scores" asks /api/kc-restore for its dry run (the days its record lacks, filled in
       from its own snapshot and work-log; a day the record scores is left as it is); "Restore" sends confirm: true and
       the preview's expectKc, which the Worker refuses if the scores came out otherwise since.
   After a change the panel, the 🏅 Scorecard and the Admin ledger read the records again.
   ============================================================ */
(function(){
if(typeof window === "undefined" || typeof renderAdmin !== "function") return;
const TAB = "accountrepair", LABEL = "🛠 Account Repair", SEC = "repair";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const obj = v => v && typeof v === "object" && !Array.isArray(v) ? v : null;
const S = {loading: false, at: 0, err: "", recs: [], prog: {}, merged: {}, uids: {}, orphans: {}, groups: [], locked: [], missing: [],
  dry: {}, kcDry: {}, busy: {}, msg: {}, keep: {}, diffUid: {}, done: []};

/* ---------- reading ---------- */
const fold = s => String(s || "").normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
const tokensOf = n => fold(n).split(/[^a-z0-9]+/).filter(Boolean);
const canon = b => typeof canonicalBatch === "function" ? canonicalBatch(b) : "";
const shown = b => typeof batchShow === "function" ? batchShow(b) : String(b || "");
function sameBatch(a, b){
  const ca = canon(a), cb = canon(b);
  if(ca && cb && ca === cb) return true;
  const sa = shown(a), sb = shown(b);
  if(sa && sb && sa === sb) return true;
  return !ca && !cb && fold(a).trim() === fold(b).trim();
}
function lev(a, b){
  if(Math.abs(a.length - b.length) > 2) return 3;
  let prev = Array.from({length: b.length + 1}, (x, i) => i);
  for(let i = 1; i <= a.length; i++){
    const cur = [i]; let best = i;
    for(let j = 1; j <= b.length; j++){ cur[j] = Math.min(prev[j] + 1, cur[j - 1] + 1, prev[j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)); best = Math.min(best, cur[j]); }
    if(best > 2) return 3;
    prev = cur;
  }
  return prev[b.length];
}
// why two records look like one person ("" when they don't)
function alike(a, b){
  const ua = a.portalUid || "", ub = b.portalUid || "";
  if(ua && ub) return ua === ub ? "the same Portal id" : "";   // two Portal accounts are two people
  const ta = tokensOf(a.name), tb = tokensOf(b.name);
  if(!ta.length || !tb.length) return "";
  const batch = sameBatch(a.batch, b.batch), where = batch ? "" : " (in another batch)";
  if(ta.slice().sort().join(" ") === tb.slice().sort().join(" ")) return (ta.join(" ") === tb.join(" ") ? "the same name" : "the same name, its words in another order") + where;
  const [sm, lg] = ta.length <= tb.length ? [ta, tb] : [tb, ta];
  if(sm.length >= 2 && sm.every(t => lg.includes(t))) return "the same name with a middle name added" + where;
  if(!batch) return "";
  if(ta.length >= 2 && tb.length >= 2 && ta[0][0] === tb[0][0] && ta[ta.length - 1] === tb[tb.length - 1]) return "the same first initial and last name, in an equivalent batch";
  const ja = ta.join(""), jb = tb.join("");
  if(Math.min(ja.length, jb.length) >= 5 && lev(ja, jb) <= 2) return "names 2 letters or fewer apart, in an equivalent batch";
  return "";
}
function findGroups(recs){
  const live = recs.filter(r => r && r.id && !r.archived), up = live.map((x, i) => i), why = live.map(() => new Set());
  const root = i => { while(up[i] !== i){ up[i] = up[up[i]]; i = up[i]; } return i; };
  for(let i = 0; i < live.length; i++) for(let j = i + 1; j < live.length; j++){
    const w = alike(live[i], live[j]); if(!w) continue;
    why[i].add(w); why[j].add(w); up[root(i)] = root(j);
  }
  const by = {};
  live.forEach((r, i) => { const k = root(i); (by[k] = by[k] || {recs: [], why: new Set()}).recs.push(r); why[i].forEach(w => by[k].why.add(w)); });
  return Object.values(by).filter(g => g.recs.length > 1).map(g => {
    g.recs.sort((a, b) => String(a.registeredAt || "").localeCompare(String(b.registeredAt || "")) || String(a.lastActive || "").localeCompare(String(b.lastActive || "")));
    const uids = [...new Set(g.recs.map(r => r.portalUid).filter(Boolean))];
    return {key: g.recs.map(r => r.id).sort().join("|"), ids: g.recs.map(r => r.id), recs: g.recs, why: [...g.why], uids};
  });
}
// the id the Worker builds from a name + batch (worker.js candidateIds newId)
const idOf = (name, batch) => { const s = (typeof slugPart === "function" ? slugPart(name) : fold(name).replace(/[^a-z0-9]+/g, "-")).slice(0, 40); const b = (typeof slugPart === "function" ? slugPart(canon(batch) || batch) : "").slice(0, 20); return b ? `${s}--${b}` : s; };
function findLocked(recs, merged, uids, orphans){
  const has = new Set(recs.map(r => r.id)), out = [];
  const follow = id => { const seen = []; let cur = id;
    for(let i = 0; i < 6 && merged[cur] && merged[cur].into && merged[cur].into !== cur; i++){ cur = merged[cur].into; seen.push(cur); if(has.has(cur)) return {to: cur, path: seen, ok: true}; }
    return {to: cur, path: seen, ok: false}; };
  const current = {};
  Object.entries(uids).forEach(([uid, u]) => { if(obj(u) && u.name && u.batch) current[idOf(u.name, u.batch)] = Object.assign({uid}, u); });
  Object.entries(merged).forEach(([from, m]) => {
    if(!obj(m) || !m.into) return;
    // a redirect left on a live record (the old Batch Sheet merge never deleted merged:<keep>)
    if(has.has(from)){ const f = follow(from);
      out.push({from, to: f.ok && f.to !== from ? f.to : m.into, by: m.by || "", how: m.how || "", at: m.at || "", level: "locked", live: true, orphans: orphans[from] || 0,
        text: f.ok && f.to !== from ? `merged:${from} sends this live account to ${f.to}: its saves are refused and its sign-in opens ${f.to}. If ${from} is the account to keep, merge the two (👥 above) or remove the redirect.`
          : `merged:${from} is left on a live account and leads nowhere else: remove it, so nothing is ever refused on it.`});
      return; }
    const f = follow(from), cur = current[from];
    if(!f.ok) out.push({from, to: f.to, by: m.by || "", how: m.how || "", at: m.at || "", level: "locked", cur, orphans: orphans[from] || 0,
      text: `merged:${from} sends this sign-in to ${f.to}, which has no record: the Portal sign-in under ${from} opens a new, empty account.`});
    else if(cur) out.push({from, to: f.to, by: m.by || "", how: m.how || "", at: m.at || "", level: "redirected", cur, orphans: orphans[from] || 0,
      text: `${cur.name} (${shown(cur.batch)}), as the Portal names them now, builds ${from}, which ${m.by === "portal-batch" ? "the Worker" : "a merge"} redirected to ${f.to}. Before this release that Portal sign-in was refused (locked out); it now opens ${f.to}. Any work their open tab couldn't save is in orphan:${from}:* (${orphans[from] || 0}).`});
  });
  return out.sort((a, b) => (a.level === "locked" ? 0 : 1) - (b.level === "locked" ? 0 : 1) || a.from.localeCompare(b.from));
}
const hist = p => !obj(p) ? [] : Array.isArray(p.history) && p.history.length ? p.history : typeof p.score === "number" ? [{score: p.score, date: p.date || null}] : [];
function findMissing(recs, prog){
  const out = [];
  recs.forEach(r => {
    if(!r || r.archived) return;
    const data = obj(prog[r.id] && prog[r.id].data) || {}, snap = obj(data["day-progress"]) || {}, dp = obj(r.dayProgress) || {};
    const log = (Array.isArray(data["work-log"]) ? data["work-log"] : []).filter(e => e && e.kind === "quiz" && e.dayId != null && typeof e.score === "number");
    const days = {};
    Object.entries(snap).forEach(([d, p]) => { const h = hist(p); if(h.length) days[d] = {day: d, scores: h.map(x => x.score), src: ["progress snapshot"]}; });
    log.forEach(e => { const d = String(e.dayId); days[d] = days[d] || {day: d, scores: [], src: []}; if(!days[d].src.includes("work-log")) days[d].src.push("work-log"); if(!days[d].scores.includes(e.score)) days[d].scores.push(e.score); });
    const miss = Object.values(days).filter(x => !hist(dp[x.day]).length);
    if(miss.length) out.push({id: r.id, name: r.name || r.id, batch: r.batch || "", days: miss});
  });
  return out;
}
async function listOf(prefix){ const k = typeof sharedList === "function" ? await sharedList(prefix) : []; return (k || []).map(x => typeof x === "string" ? x : x && (x.name || x.key)).filter(Boolean); }
async function load(){
  if(S.loading) return;
  S.loading = true; S.err = ""; redraw();
  try{
    const keys = (await listOf("trainee:")).filter(k => /^trainee:[^:]+$/.test(k));
    const recs = keys.length ? await sharedGetMany(keys) : [];
    const ok = recs.filter(Boolean);
    if(ok.length !== keys.length) S.err = `Only ${ok.length} of ${keys.length} trainee records could be read: what is listed may be incomplete. Nothing is changed by reading; try ↻ Refresh.`;
    const progs = ok.length ? await sharedGetMany(ok.map(r => "progress:" + r.id)) : [];
    const mk = await listOf("merged:"), mv = mk.length ? await sharedGetMany(mk) : [];
    const uk = await listOf("uid:"), uv = uk.length ? await sharedGetMany(uk) : [];
    const orphans = {};
    (await listOf("orphan:")).forEach(k => { const id = k.split(":")[1]; if(id) orphans[id] = (orphans[id] || 0) + 1; });
    S.recs = ok; S.prog = {}; ok.forEach((r, i) => { S.prog[r.id] = progs[i] || null; });
    S.merged = {}; mk.forEach((k, i) => { if(mv[i]) S.merged[k.slice(7)] = mv[i]; });
    S.uids = {}; uk.forEach((k, i) => { if(uv[i]) S.uids[k.slice(4)] = uv[i]; });
    S.orphans = orphans;
    S.groups = findGroups(ok); S.locked = findLocked(ok, S.merged, S.uids, orphans); S.missing = findMissing(ok, S.prog);
  }catch(e){ S.err = "The records couldn't be read: " + ((e && e.message) || e) + ". Nothing was changed."; }
  S.loading = false; S.at = Date.now(); redraw();
}

/* ---------- the Worker's dry runs and the confirmed changes ---------- */
async function post(path, body){
  let res, j = {};
  try{ res = await authFetch(path, body); j = await res.json().catch(() => ({})); }catch(e){ return {status: 0, body: {error: "The server couldn't be reached. Nothing was changed."}}; }
  return {status: res.status, body: j || {}};
}
const groupByKey = k => S.groups.find(g => g.key === k);
async function previewMerge(k){
  const g = groupByKey(k); if(!g) return;
  S.busy[k] = true; S.msg[k] = null; redraw();
  const body = {ids: g.ids}; if(S.keep[k]) body.keep = S.keep[k];
  const r = await post("/api/account-merge", body);
  S.busy[k] = false;
  if(r.status === 200 && r.body.dryRun) S.dry[k] = {req: body, res: r.body, expectKeep: r.body.keep, expectDelete: ((r.body.keys || {}).delete || []).slice(), expectKc: r.body.expectKc};
  else { delete S.dry[k]; S.msg[k] = {ok: false, text: (r.body && r.body.error) || `The dry run failed (${r.status}). Nothing was changed.`}; }
  redraw();
}
async function confirmMerge(k){
  const d = S.dry[k]; if(!d) return;
  S.busy[k] = true; redraw();
  // (the merge confirmed is the one previewed: the Worker refuses it when the id kept or the keys to delete came out otherwise)
  const body = Object.assign({}, d.req, {confirm: true, expectKeep: d.expectKeep, expectDelete: d.expectDelete, expectKc: d.expectKc}); if(S.diffUid[k]) body.differentPortalIds = true;
  const r = await post("/api/account-merge", body);
  S.busy[k] = false;
  if(r.status === 200 && r.body.ok){
    delete S.dry[k];
    S.done.unshift({ok: true, text: doneText(r.body)});
    afterChange();
  } else {
    if(r.body && r.body.previewAgain) delete S.dry[k];
    S.msg[k] = {ok: false, text: (r.body && r.body.error) || `The merge failed (${r.status}).`};
  }
  redraw();
}
const doneText = b => `Merged ${(b.others || []).join(", ")} into ${b.keep}. Backups: ${(b.backups || []).join(", ") || "—"}.${(b.failedDeletes || []).length ? ` These old keys couldn't be deleted (their data is in ${b.keep} too): ${b.failedDeletes.join(", ")}.` : ""}${b.message ? " " + b.message : ""}`;
// 👥 a merge of these ids from another page (the 📋 Batch Sheet's 👥 Merge): the Worker's dry run, the trainer's confirm of
// what it says, then the confirmed merge of exactly that preview. {ok, text}
async function mergeIds(ids, keep){
  const req = {ids: ids.slice()}; if(keep) req.keep = keep;
  const d = await post("/api/account-merge", req);
  if(d.status !== 200 || !d.body.dryRun) return {ok: false, text: (d.body && d.body.error) || `The dry run failed (${d.status}). Nothing was changed.`};
  const r = d.body, ch = (r.days || []).filter(x => x.changed);
  const msg = `Merge ${r.others.join(", ")} into ${r.keep}?\n(${r.keepWhy})\n\n${(r.warnings || []).map(w => "⚠ " + w + "\n").join("")}`
    + `Knowledge Checks that change: ${ch.length ? ch.map(x => `${dayLabel(x.day)} ${val(x.record)} → ${val(x.recovered)}`).join("; ") : "none"}.\n\n`
    + `The Worker backs up every account first, writes the merged records to ${r.keep}, moves the rest, redirects the other sign-ins, and deletes the other account's copied keys (${((r.keys || {}).delete || []).length}) only when the merge is run again, two minutes or more later.`
    + `\n\nThe full table is in Admin → 🛠 Account Repair.`;
  if(typeof confirm === "function" && !confirm(msg)) return {ok: false, cancelled: true, text: "Not merged."};
  const body = Object.assign({}, req, {confirm: true, expectKeep: r.keep, expectDelete: ((r.keys || {}).delete || []).slice(), expectKc: r.expectKc});
  if((r.warnings || []).some(w => /different Portal ids/.test(w))){
    if(typeof confirm === "function" && !confirm(`These accounts carry different Portal ids: two Portal accounts. Merge them anyway?`)) return {ok: false, cancelled: true, text: "Not merged."};
    body.differentPortalIds = true;
  }
  const c = await post("/api/account-merge", body);
  if(c.status === 200 && c.body.ok){ S.done.unshift({ok: true, text: doneText(c.body)}); afterChange(); return {ok: true, keep: c.body.keep, text: doneText(c.body)}; }
  return {ok: false, text: (c.body && c.body.error) || `The merge failed (${c.status}).`};
}
// 🔓 a merged:<id> redirect left on a live account: the Worker's dry run, the trainer's confirm, then its removal
async function removeRedirect(id){
  const k = "rd:" + id; S.busy[k] = true; S.msg[k] = null; redraw();
  const d = await post("/api/account-merge", {removeRedirect: id});
  if(d.status !== 200 || !d.body.dryRun){ S.busy[k] = false; S.msg[k] = {ok: false, text: (d.body && d.body.error) || `The dry run failed (${d.status}).`}; redraw(); return; }
  if(typeof confirm === "function" && !confirm(`Remove merged:${id}${d.body.leadsTo ? ` (it sends ${id} to ${d.body.leadsTo})` : ""}? It is backed up first. ${id}'s saves are then taken again and its sign-in opens ${id}.`)){ S.busy[k] = false; redraw(); return; }
  const c = await post("/api/account-merge", {removeRedirect: id, confirm: true});
  S.busy[k] = false;
  S.msg[k] = c.status === 200 && c.body.ok ? {ok: true, text: `Removed merged:${id}. Backup: ${c.body.backup}.`} : {ok: false, text: (c.body && c.body.error) || `The removal failed (${c.status}).`};
  if(c.status === 200 && c.body.ok){ S.done.unshift({ok: true, text: S.msg[k].text}); afterChange(); }
  redraw();
}
async function previewKc(id){
  const k = "kc:" + id; S.busy[k] = true; S.msg[k] = null; redraw();
  const r = await post("/api/kc-restore", {id});
  S.busy[k] = false;
  if(r.status === 200 && r.body.dryRun) S.kcDry[id] = r.body;
  else { delete S.kcDry[id]; S.msg[k] = {ok: false, text: (r.body && r.body.error) || (r.body && r.body.nothingToRestore ? "Nothing to restore: the record already has every day its snapshot and work-log hold." : `The dry run failed (${r.status}). Nothing was changed.`)}; }
  redraw();
}
async function confirmKc(id){
  const k = "kc:" + id; if(!S.kcDry[id]) return;
  S.busy[k] = true; redraw();
  // (the scores restored are the ones previewed: the Worker refuses the confirm when they came out otherwise since)
  const r = await post("/api/kc-restore", {id, confirm: true, expectKc: S.kcDry[id].expectKc});
  S.busy[k] = false;
  if(r.status === 200 && r.body.ok){ delete S.kcDry[id]; S.done.unshift({ok: true, text: `Restored ${r.body.restored.map(dayLabel).join(", ")} on trainee:${id}. Backup: ${r.body.backup}.`}); afterChange(); }
  else if(r.status === 200 && r.body.nothingToRestore){ delete S.kcDry[id]; S.msg[k] = {ok: true, text: "Nothing to restore any more: the record already has those days."}; }
  else { if(r.body && r.body.previewAgain) delete S.kcDry[id]; S.msg[k] = {ok: false, text: (r.body && r.body.error) || `The restore failed (${r.status}).`}; }
  redraw();
}
// the 🏅 Scorecard and the Admin ledger read the repaired records again
function afterChange(){
  try{ state.adminData = null; }catch(e){}
  try{ if(window.cmScorecard){ if(typeof cmScorecard.invalidate === "function") cmScorecard.invalidate(); } }catch(e){}
  load();
}

/* ---------- the page ---------- */
function dayLabel(d){
  const x = (typeof DAYS !== "undefined" ? DAYS : []).find(y => String(y.id) === String(d));
  return x && x.cf ? `Case Flow Day ${x.cf.n}` : x ? `Day ${typeof dayNo === "function" ? dayNo(x.id) : x.id}` : `Day ${d}`;
}
const val = v => !v ? "—" : `${v.score == null ? "no score" : v.score + "%"} · ${v.done ? "passed" : "not passed"} · ${v.attempts} attempt${v.attempts === 1 ? "" : "s"}`;
const when = s => { try{ return s ? new Date(s).toLocaleDateString(undefined, {month: "short", day: "numeric", year: "numeric"}) : "—"; }catch(e){ return "—"; } };
const passedOf = r => Object.values(obj(r.dayProgress) || {}).filter(p => obj(p) && p.done).length;
function dayTable(rows){
  if(!rows || !rows.length) return `<p class="car-dim">No Knowledge Check on any of these records.</p>`;
  return `<table class="car-t car-days"><thead><tr><th>Day</th><th>Record value</th><th>Recovered value</th><th>Source</th></tr></thead><tbody>${rows.map(r =>
    `<tr class="${r.changed ? "car-chg" : ""}"><td>${E(dayLabel(r.day))}</td><td>${E(val(r.record))}</td><td>${E(val(r.recovered))}${r.changed ? ` <b class="car-new">changes</b>` : ""}${r.unverified ? ` <b class="car-unv" title="Only the trainee's device wrote this score: no trainee record has it">⚠ unverified</b>` : ""}${r.note ? `<div class="car-dim">${E(r.note)}</div>` : ""}</td><td>${E(r.source || "—")}</td></tr>`).join("")}</tbody></table>`;
}
const list = (xs) => xs && xs.length ? xs.map(x => `<code>${E(x)}</code>`).join(", ") : "none";
function mergePlan(k, g){
  const d = S.dry[k]; if(!d) return "";
  const r = d.res, busy = S.busy[k], two = (g.uids || []).length > 1;
  return `<div class="car-dry" data-dry="${E(k)}">
    <p class="car-h3">Dry run: nothing has been changed</p>
    <p class="car-p">Kept: <b>${E(r.keep)}</b> (${E(r.keepWhy)}). Folded into it: ${list(r.others)}.</p>
    ${(r.warnings || []).map(w => `<p class="car-warn">⚠ ${E(w)}</p>`).join("")}
    ${dayTable(r.days)}
    <div class="car-will"><b>If you merge, the Worker will, in this order:</b><ol>
      <li>back up every account's records as they are now (<code>backup:&lt;id&gt;:&lt;time&gt;</code>), the kept one too;</li>
      <li>write the merged records to ${E(r.keep)}: ${list((r.keys || {}).write)}; every Knowledge Check attempt of every account is kept;</li>
      <li>move to ${E(r.keep)}: ${list((r.keys || {}).move)}${(r.certs || []).length ? `; and point these certificates at it: ${list(r.certs)}` : ""};</li>
      <li>send these sign-ins to ${E(r.keep)}: ${list(r.redirects)}, so the Portal opens the kept account on any device;</li>
      <li>only then delete, when this merge is run again two minutes or more after the first one (a save made elsewhere in the last moment is folded in then), the copied keys of the other account${r.others && r.others.length > 1 ? "s" : ""}: ${list((r.keys || {}).delete)}.</li>
    </ol>${(r.orphans || []).length ? `<p class="car-p">Device backups read (never deleted): ${list(r.orphans)}.</p>` : ""}${(r.keys || {}).left && r.keys.left.length ? `<p class="car-p">Left where they are (the kept account already has its own): ${list(r.keys.left)}.</p>` : ""}</div>
    ${two ? `<label class="car-p"><input type="checkbox" data-ar="diffuid" data-k="${E(k)}" ${S.diffUid[k] ? "checked" : ""}> These ${g.uids.length} Portal ids are one person: merge anyway</label>` : ""}
    <div class="car-btns"><button type="button" class="btn btn-navy btn-sm" data-ar="merge" data-k="${E(k)}" ${busy || (two && !S.diffUid[k]) ? "disabled" : ""}>✔ Merge into ${E(r.keep)}</button>
      <button type="button" class="btn btn-ghost btn-sm" data-ar="cancel" data-k="${E(k)}">Cancel</button></div></div>`;
}
function groupCard(g){
  const k = g.key, m = S.msg[k];
  return `<div class="car-card" data-group="${E(k)}">
    <p class="car-h3">${E(g.recs[0].name || g.ids[0])} · ${g.recs.length} accounts</p>
    <p class="car-dim">Why: ${E(g.why.join("; "))}</p>
    <table class="car-t"><thead><tr><th>Account</th><th>Name · Batch</th><th>Portal id</th><th>Registered</th><th>Last active</th><th>Days passed</th></tr></thead><tbody>${g.recs.map(r =>
      `<tr><td><code>${E(r.id)}</code>${r.approved === true ? "" : ` <span class="car-dim">(not approved)</span>`}</td><td>${E(r.name || "")} · ${E(shown(r.batch) || "—")}</td><td>${E(r.portalUid || "—")}</td><td>${E(when(r.registeredAt))}</td><td>${E(when(r.lastActive))}</td><td>${passedOf(r)}</td></tr>`).join("")}</tbody></table>
    <div class="car-btns"><label class="car-p">If the Portal's current name opens none of these, keep:
      <select data-ar="keep" data-k="${E(k)}"><option value="">the most recently active</option>${g.ids.map(id => `<option value="${E(id)}" ${S.keep[k] === id ? "selected" : ""}>${E(id)}</option>`).join("")}</select></label>
      <button type="button" class="btn btn-navy btn-sm" data-ar="preview" data-k="${E(k)}" ${S.busy[k] ? "disabled" : ""}>🔍 Preview merge (dry run)</button></div>
    ${m ? `<p class="car-msg ${m.ok ? "ok" : "no"}">${E(m.text)}</p>` : ""}
    ${mergePlan(k, g)}</div>`;
}
function kcCard(x){
  const k = "kc:" + x.id, d = S.kcDry[x.id], m = S.msg[k];
  return `<div class="car-card" data-kc="${E(x.id)}">
    <p class="car-h3">${E(x.name)} · ${E(shown(x.batch) || "—")} · <code>${E(x.id)}</code></p>
    <p class="car-p">Missing from the record: ${x.days.map(y => `<b>${E(dayLabel(y.day))}</b> (${E(y.scores.map(s => s + "%").join(", "))}, from the ${E(y.src.join(" and "))})`).join("; ")}.</p>
    <div class="car-btns"><button type="button" class="btn btn-navy btn-sm" data-ar="kcpreview" data-id="${E(x.id)}" ${S.busy[k] ? "disabled" : ""}>🔍 Restore missing KC scores (dry run first)</button></div>
    ${m ? `<p class="car-msg ${m.ok ? "ok" : "no"}">${E(m.text)}</p>` : ""}
    ${d ? `<div class="car-dry" data-kcdry="${E(x.id)}"><p class="car-h3">Dry run: nothing has been changed</p>${dayTable(d.days)}
      <div class="car-will"><b>If you restore, the Worker will:</b> back up trainee:${E(x.id)} as it is now, then write the days marked "changes" into it (official score: the first attempt, or the best after a reset; passed when any attempt is 70% or more). Days the record already scores stay exactly as they are. The progress snapshot and the work-log are only read.</div>
      <div class="car-btns"><button type="button" class="btn btn-navy btn-sm" data-ar="kcrestore" data-id="${E(x.id)}" ${S.busy[k] ? "disabled" : ""}>✔ Restore ${d.days.filter(r => r.changed).length} KC score${d.days.filter(r => r.changed).length === 1 ? "" : "s"}</button>
      <button type="button" class="btn btn-ghost btn-sm" data-ar="kccancel" data-id="${E(x.id)}">Cancel</button></div></div>` : ""}</div>`;
}
function page(){
  if(!S.at && !S.loading) setTimeout(load, 0);
  const head = `<p class="eyebrow">Admin</p><h1 style="color:var(--navy);font-size:26px;margin:6px 0 10px;">Account Repair</h1>
    <p class="car-lead">Reading this page changes nothing. Every change below is shown first as a dry run and is made only when you confirm it. Archived trainees are left out.
      <button type="button" class="btn btn-ghost btn-sm" data-ar="refresh" ${S.loading ? "disabled" : ""}>↻ Refresh</button></p>`;
  if(!S.at) return `<div class="car-page">${head}<div class="card car-card"><p class="car-p">Reading every trainee's records…</p></div></div>`;
  return `<div class="car-page">${head}
    ${S.err ? `<p class="car-warn">⚠ ${E(S.err)}</p>` : ""}
    ${S.done.length ? `<div class="car-card car-done">${S.done.slice(0, 5).map(m => `<p class="car-msg ok">✔ ${E(m.text)}</p>`).join("")}</div>` : ""}
    ${S.loading ? `<p class="car-dim">Reading the records again…</p>` : ""}
    <section class="car-sec" id="carDupes"><h2 class="car-h2">👥 Suspected duplicate accounts (${S.groups.length})</h2>
      <p class="car-p">One person's accounts, found by the same Portal id, then the same name in any word order, then the same first initial and last name or a name 2 letters apart in an equivalent batch (B250926 and B092526 are one batch). These are suggestions: check them before you merge.</p>
      ${S.groups.length ? S.groups.map(groupCard).join("") : `<p class="car-dim">None found.</p>`}</section>
    <section class="car-sec" id="carLocked"><h2 class="car-h2">🔒 Sign-ins sent elsewhere by a merge or redirect (${S.locked.length})</h2>
      <p class="car-p">A redirect into an account that no longer exists locks the trainee out of their work. A redirect of the id the Portal's current name builds refused the sign-in before this release.</p>
      ${S.locked.length ? `<table class="car-t"><thead><tr><th>Status</th><th>Sign-in id</th><th>Sent to</th><th>By</th><th>What it means</th></tr></thead><tbody>${S.locked.map(x =>
        `<tr data-locked="${E(x.from)}"><td><b class="${x.level === "locked" ? "car-bad" : "car-mid"}">${x.level === "locked" ? "Locked out" : "Redirected"}</b></td><td><code>${E(x.from)}</code></td><td><code>${E(x.to)}</code></td><td>${E(x.by || x.how || "—")}${x.at ? ` · ${E(when(x.at))}` : ""}</td><td>${E(x.text)}${x.live ? `<div class="car-btns"><button type="button" class="btn btn-ghost btn-sm" data-ar="unredirect" data-id="${E(x.from)}" ${S.busy["rd:" + x.from] ? "disabled" : ""}>🔓 Remove redirect…</button></div>` : ""}${S.msg["rd:" + x.from] ? `<p class="car-msg ${S.msg["rd:" + x.from].ok ? "ok" : "no"}">${E(S.msg["rd:" + x.from].text)}</p>` : ""}</td></tr>`).join("")}</tbody></table>` : `<p class="car-dim">None found.</p>`}</section>
    <section class="car-sec" id="carMissing"><h2 class="car-h2">✍️ Knowledge Checks missing from the record (${S.missing.length})</h2>
      <p class="car-p">Taken (they are in the account's progress snapshot or work-log) but not on trainee:&lt;id&gt;, which the 🏅 Scorecard and the Batch Sheet read.</p>
      ${S.missing.length ? S.missing.map(kcCard).join("") : `<p class="car-dim">None found.</p>`}</section></div>`;
}
function redraw(){ if(typeof state !== "undefined" && state.view === "admin" && state.adminTab === TAB && typeof render === "function" && !(typeof isTyping === "function" && isTyping())) render(); }

document.addEventListener("click", e => {
  const b = e.target && e.target.closest && e.target.closest("[data-ar]"); if(!b || b.tagName === "SELECT" || b.type === "checkbox") return;
  const a = b.getAttribute("data-ar"), k = b.getAttribute("data-k"), id = b.getAttribute("data-id");
  if(a === "refresh"){ S.at = 0; load(); }
  else if(a === "preview") previewMerge(k);
  else if(a === "merge") confirmMerge(k);
  else if(a === "cancel"){ delete S.dry[k]; redraw(); }
  else if(a === "kcpreview") previewKc(id);
  else if(a === "kcrestore") confirmKc(id);
  else if(a === "kccancel"){ delete S.kcDry[id]; redraw(); }
  else if(a === "unredirect") removeRedirect(id);
});
document.addEventListener("change", e => {
  const b = e.target && e.target.closest && e.target.closest("[data-ar]"); if(!b) return;
  const a = b.getAttribute("data-ar"), k = b.getAttribute("data-k");
  if(a === "keep"){ S.keep[k] = b.value; delete S.dry[k]; redraw(); }   // a new choice needs a new dry run
  else if(a === "diffuid"){ S.diffUid[k] = !!b.checked; redraw(); }
});

/* ---------- its Admin section and tab ---------- */
function addSection(){
  const sh = window.cmAdminShell;
  if(sh && Array.isArray(sh.sections) && !sh.sections.some(s => s.id === SEC)) sh.sections.push({id: SEC, label: LABEL, tabs: [TAB]});
}
const __admin = renderAdmin;
window.renderAdmin = function(){
  addSection();
  if(typeof state === "undefined" || !state.isAdmin) return __admin.apply(this, arguments);
  const mine = state.adminTab === TAB;
  let h;
  // borrow a light tab for the strip, then draw this page under it
  if(mine){ state.adminTab = "sop"; try{ h = __admin.apply(this, arguments); } finally { state.adminTab = TAB; } }
  else h = __admin.apply(this, arguments);
  if(typeof h !== "string") return h;
  const a = h.indexOf('<div class="admin-tabs'); if(a < 0) return h;
  const end = h.indexOf("</div>", a); if(end < 0) return h;
  let strip = h.slice(a, end);
  if(mine) strip = strip.replace(/admin-tab-btn active/g, "admin-tab-btn");
  const btn = `<button class="admin-tab-btn ${mine ? "active" : ""}" onclick="setAdminTab('${TAB}')">${LABEL}</button>`;
  return h.slice(0, a) + strip + btn + "</div>" + (mine ? page() : h.slice(end + 6));
};
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", addSection); else setTimeout(addSection, 0);

window.cmAccountRepair = {load, state: S, findGroups, findLocked, findMissing, alike, sameBatch, previewMerge, confirmMerge, mergeIds, removeRedirect, previewKc, confirmKc, TAB};

const css = document.createElement("style"); css.id = "cm-account-repair";
css.textContent = `
.car-page{max-width:1400px;}
.car-lead,.car-p{font:600 15px/1.5 'Inter',sans-serif;color:#2E3245;margin:0 0 10px;}
.car-dim{font:600 14px/1.45 'Inter',sans-serif;color:#5F6577;margin:2px 0 8px;}
.car-sec{margin:0 0 22px;} .car-h2{font:800 19px 'Poppins','Inter',sans-serif;color:#1E2340;margin:0 0 6px;}
.car-h3{font:800 16px 'Poppins','Inter',sans-serif;color:#1E2340;margin:0 0 4px;}
.car-card{border:2px solid #DDE1EA;border-radius:10px;background:#F8F9FC;padding:12px 14px;margin:0 0 12px;}
.car-t{width:100%;border-collapse:collapse;background:#fff;font:600 14.5px 'Inter',sans-serif;margin:6px 0 8px;}
.car-t th{background:#1E2340;color:#fff;text-align:left;padding:8px 10px;font-weight:800;} .car-t td{border-bottom:1px solid #DDE1EA;padding:8px 10px;vertical-align:top;word-break:break-word;}
.car-t tr.car-chg td{background:#FFF5EA;} .car-new{color:#B25E14;font-weight:800;} .car-unv{color:#A3261B;font-weight:800;}
.car-dry{border-left:4px solid #DB8437;background:#fff;padding:10px 12px;margin-top:8px;border-radius:6px;}
.car-will{font:600 14.5px/1.5 'Inter',sans-serif;color:#2E3245;margin:6px 0;} .car-will ol{margin:4px 0 6px 20px;padding:0;}
.car-btns{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin:6px 0;}
.car-btns select{font:600 14px 'Inter',sans-serif;padding:4px 6px;border:2px solid #C9D1E6;border-radius:6px;}
.car-msg{font:700 14.5px/1.4 'Inter',sans-serif;margin:6px 0;} .car-msg.ok{color:#1E7A3A;} .car-msg.no,.car-warn{color:#A50E0E;font:700 14.5px/1.4 'Inter',sans-serif;}
.car-bad{color:#A50E0E;} .car-mid{color:#B25E14;}
@media (max-width:700px){.car-t{display:block;overflow-x:auto;}}`;
document.head.appendChild(css);
})();
