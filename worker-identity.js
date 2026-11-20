/* ============================================================
   🪪 Who a sign-in opens, and what keeps a trainee's records whole (worker.js imports this: identity(deps))
   Kept out of worker.js so the shared file only holds the call sites. worker.js passes what it owns:
   identity({kcHistory, kcAttempts, candidateIds, batchKey}) (candidateIds, with the batch's other order, stays in worker.js).

   • uid:<portalUid> = {id, name, batch, at}: the record the Portal's own id for a trainee (the ticket's "u") opened last,
     written on every Portal sign-in that carries one (/api/auth/portal) and by 👥 an account merge (worker-account-repair.js).
     It is looked at first, so a name or Batch ID changed on the Portal still opens the trainee's own record, not a new one.
   • merged:<id> = {into}: the record a merged-away id now lives in (followed a few hops).
   • resolveTrainee(kv, name, batch, uid): the record a sign-in opens: the uid index, then newId, rawId, the batch's other
     order (altId), the legacy name-only id, and a merged:<id> redirect of the id chosen (also when trainee:<id> is still
     there: a save that reached a merged-away id after the merge recreated it). A record carrying ANOTHER Portal id
     (portalUid) is never opened for this uid: {foreign: true} when the only record the name + batch build is one.
   • keepKcStored / keepProgressAttempts: a copy read earlier never drops a Knowledge Check saved since; keepMergeStored:
     a trainer's copy read before a merge never clears its mergedAt or drops what it joined.
   • dateFirstAttempts / officialCaseFlow: on a trainee's write, a first attempt is dated by the Worker, and the Case Flow
     summary's kc / passed come from the record's own dayProgress, never from the device.
   • afterMerge / afterMergeProgress: after a 👥 confirmed merge (mergedAt on trainee:<keep> and progress:<keep>), a device
     that hasn't restored the merged copy yet (its write doesn't name that mergedAt) can't drop what the merge folded in:
     its lists and objects are joined with the merge's own copy (mergebase:<keep>), the same fold every time, and the
     Worker's answer tells it to restore (js/cm-safe-logout.js sends what it saw, and restores on {mergePending}).
   • orphanWrite: orphan:<own id>:<ms>, a device's backup of work its last save never got to the server
     (js/cm-safe-logout.js). Written once, never overwritten; at most ORPHAN_MAX per id; the ms within 7 days of now.
     Its owner is the id in its key (the token's own); the traineeId, name and batch in its body are unverified claims.
   • trainee-alias:<id> = <kept id> (the id as plain text, not JSON): the Training Portal reads it, one hop, when it files a
     trainee's simulator result or graded call (its functions/api/sim-results.js and call-results.js work the id out from
     the trainee's Portal name + batch: courseTraineeId, this course's rawId), so the result lands on the record this course
     keeps for them. aliasAtSignIn: every Portal sign-in points the Portal's id at the record it opened (the uid index after
     a Batch ID or name change, a merged: redirect, a portal-batch move), and clears it when that is the Portal's id itself.
     aliasPlan: a 👥 merge points each merged-away id at the kept one, and every alias that led to a merged-away id too
     (the Portal follows one hop); the kept id's own alias goes (worker-account-repair.js writes it, backs it up, undoes it).
   ============================================================ */
import { mergeVals, mergePractice, MERGE_FOLD, MAX_SNAPSHOT } from "./worker-account-repair.js";

const parse = (raw) => { try { return JSON.parse(raw || "null"); } catch (e) { return null; } };
const ORPHAN_MAX = 20, WEEK = 7 * 86400000;
export const uidKey = (uid) => `uid:${String(uid || "").slice(0, 80)}`;
export const aliasKey = (id) => `trainee-alias:${id}`;
const ALIAS_ID = /^[a-z0-9-]{1,100}$/;   // (what the Portal follows)
// 🔗 a Portal sign-in: the Portal's id for this trainee (portalId) leads to the record the sign-in opened (openedId)
export async function aliasAtSignIn(kv, portalId, openedId) {
  if (!ALIAS_ID.test(portalId || "") || !ALIAS_ID.test(openedId || "")) return;
  const cur = await kv.get(aliasKey(portalId));
  if (portalId === openedId) { if (cur != null) await kv.delete(aliasKey(portalId)); return; }
  if (cur !== openedId) await kv.put(aliasKey(portalId), openedId, { metadata: { into: openedId } });
}
// 🔗 a 👥 merge into keep of fromIds: {<alias key>: {was (null: none), to (null: deleted)}}, only the keys that change. Read
// only: the merge backs up `was` before it writes `to` (aliasApply), and puts `was` back if it stops.
export async function aliasPlan(kv, fromIds, keep) {
  const out = {};
  if (!ALIAS_ID.test(keep || "")) return out;
  const from = new Set(fromIds.filter((x) => x && x !== keep && ALIAS_ID.test(x)));
  const want = async (k, to) => { const was = await kv.get(k); if (was !== to && !(was == null && to == null)) out[k] = { was, to }; };
  for (const id of from) await want(aliasKey(id), keep);
  const keys = []; let cursor;
  do { const r = await kv.list({ prefix: "trainee-alias:", cursor }); r.keys.forEach((k) => keys.push(k)); cursor = r.list_complete ? null : r.cursor; } while (cursor && keys.length < 5000);
  for (const k of keys) {
    if (k.name in out || k.name === aliasKey(keep) || [...from].some((id) => k.name === aliasKey(id))) continue;
    const v = await kv.get(k.name);
    if (from.has(v)) out[k.name] = { was: v, to: keep };
  }
  await want(aliasKey(keep), null);
  return out;
}
export async function aliasApply(kv, k, to) { if (to == null) await kv.delete(k); else await kv.put(k, to, { metadata: { into: to } }); }

export function identity(D) {
  const { kcHistory, kcAttempts, candidateIds, batchKey } = D;
  // merged:<id> = {into}: the live record a merged-away id now lives in (null when none is there)
  async function mergedInto(kv, id) {
    for (let i = 0, cur = id; i < 4 && cur; i++) {
      const m = parse(await kv.get(`merged:${cur}`));
      if (!m || !m.into || m.into === cur) return null;
      const raw = await kv.get(`trainee:${m.into}`);
      if (raw) return { id: m.into, raw };
      cur = m.into;
    }
    return null;
  }
  async function uidTarget(kv, uid) {
    if (!uid) return null;
    const m = parse(await kv.get(uidKey(uid)));
    if (!m || !m.id) return null;
    let id = m.id, raw = await kv.get(`trainee:${id}`);
    const t = await mergedInto(kv, id);
    if (t && t.id !== id) { id = t.id; raw = t.raw; }
    if (!raw) return null;
    const rec = parse(raw);
    // (another Portal account's record is not theirs; an archived one is a course finished: a new batch opens its own, as before)
    if (!rec || typeof rec !== "object" || (rec.portalUid && rec.portalUid !== uid) || rec.archived) return null;
    return { id, raw };
  }
  // (written only when it changes: the id, or the name and batch the Portal gave last, which 👥 a merge keeps to)
  async function indexUid(kv, who, id) {
    const cur = parse(await kv.get(uidKey(who.uid)));
    const next = { id, name: String(who.name || ""), batch: String(who.batch || "") };
    if (cur && cur.id === next.id && cur.name === next.name && cur.batch === next.batch) return;
    await kv.put(uidKey(who.uid), JSON.stringify(Object.assign(next, { at: new Date().toISOString() })));
  }
  // the Portal id on a trainee's record (or on the record it was merged into)
  async function uidOf(kv, id) {
    let raw = await kv.get(`trainee:${id}`);
    if (!raw) { const t = await mergedInto(kv, id); raw = t && t.raw; }
    const r = parse(raw); return (r && typeof r.portalUid === "string" && r.portalUid) || "";
  }
  async function resolveTrainee(kv, name, batch, uid) {
    const { newId, rawId, altId, legacyId } = candidateIds(name, batch);
    // a record that carries another Portal account's id is that account's, never this uid's
    const foreign = (raw) => { const r = parse(raw); return !!(uid && r && r.portalUid && r.portalUid !== uid); };
    const u = await uidTarget(kv, uid);
    if (u) return { chosen: u.id, existing: u.raw, by: "uid" };
    let chosen = newId, existing = null, newIdForeign = false;
    for (const id of [...new Set([newId, rawId, altId])]) {
      const raw = await kv.get(`trainee:${id}`);
      if (!raw) continue;
      if (foreign(raw)) { if (id === newId) newIdForeign = true; continue; }
      chosen = id; existing = raw; break;
    }
    if (!existing) {
      const legacy = await kv.get(`trainee:${legacyId}`);
      const lrec = parse(legacy);
      if (lrec && !foreign(legacy) && (!lrec.batch || batchKey(lrec.batch) === batchKey(batch))) { chosen = legacyId; existing = legacy; }
    }
    // a merged:<id> redirect of the id chosen: also when its record is there (a save that reached it after the merge)
    const t = await mergedInto(kv, chosen);
    if (t && t.id !== chosen && !foreign(t.raw)) return { chosen: t.id, existing: t.raw, by: "merged" };
    if (!existing && newIdForeign) return { chosen: newId, existing: null, by: "", foreign: true };
    return { chosen, existing, by: existing ? "name" : "" };
  }
  // a save from a token whose id was merged away: refused only while the redirect leads to another live record (a stale
  // merged:<id> on a live record that leads nowhere else, which the old Batch Sheet merge left, no longer locks it)
  async function mergedAway(kv, id) {
    if ((await kv.get(`merged:${id}`)) == null) return false;
    const t = await mergedInto(kv, id);
    if (t && t.id !== id) return true;
    return (await kv.get(`trainee:${id}`)) == null;
  }

  // The attempts of a day's stored history that an incoming copy lacks (the same score within 10 minutes is the same
  // attempt: a retake the Worker dated and the device's own copy of it), and the two histories together, oldest first.
  function kcUnion(n, p) {
    const at = (x) => Date.parse((x && x.date) || "") || 0, mine = kcHistory(n);
    const add = kcHistory(p).filter((x) => x && typeof x.score === "number" && !mine.some((y) => y && y.score === x.score && Math.abs(at(y) - at(x)) < 600000));
    return { add, history: mine.concat(add).sort((x, y) => at(x) - at(y)) };
  }
  // ✍️ A trainer's write of a whole trainee record (approving, archiving, an AI review …) is a copy read earlier: a Knowledge
  // Check the trainee submitted in between is kept (a day the copy lacks is the stored day; attempts it lacks are added, and
  // the stored score and pass stand), and so is the Case Flow summary when the stored one is newer. A copy that holds every
  // stored attempt (a 👥 merge's, which adds some) is written as it is.
  async function keepKcStored(kv, key, value) {
    let inc, ex; try { inc = JSON.parse(value); ex = JSON.parse((await kv.get(key)) || "null"); } catch (e) { return value; }
    if (!inc || typeof inc !== "object" || !ex || typeof ex !== "object") return value;
    let changed = false;
    if (ex.dayProgress && typeof ex.dayProgress === "object") {
      const out = Object.assign({}, inc.dayProgress && typeof inc.dayProgress === "object" ? inc.dayProgress : {});
      for (const [d, p] of Object.entries(ex.dayProgress)) {
        if (!kcAttempts(p)) continue;
        const n = out[d] && typeof out[d] === "object" ? out[d] : null;
        if (!kcAttempts(n)) { out[d] = Object.assign({}, p, n || {}, { history: kcHistory(p), score: p.score, done: !!p.done, date: p.date || null }); changed = true; continue; }
        const u = kcUnion(n, p);
        if (!u.add.length) continue;
        const theirs = kcHistory(p).length >= kcHistory(n).length;
        out[d] = Object.assign({}, n, { history: u.history, score: theirs ? p.score : n.score, done: !!(n.done || p.done), date: theirs ? p.date || n.date || null : n.date || null });
        changed = true;
      }
      if (changed) inc.dayProgress = out;
    }
    if (ex.caseFlow && typeof ex.caseFlow === "object" && String(ex.caseFlow.at || "") > String((inc.caseFlow && inc.caseFlow.at) || "")) { inc.caseFlow = ex.caseFlow; changed = true; }
    return changed ? JSON.stringify(inc) : value;
  }
  // 💾 A device's progress:<id> snapshot is whole, so a stale device (or one a 👥 merge didn't reach yet) would drop a
  // Knowledge Check another one saved: a day's attempts stored and missing from the incoming snapshot are kept (the union
  // of the two histories, the best score, done if either is). savedAt stays the device's own (cloudRestore compares it
  // with the device's lsh_progress-saved-at); the Worker stamps serverAt.
  function keepProgressAttempts(existing, incoming) {
    const was = existing && existing.data && existing.data["day-progress"], now = incoming && incoming.data && incoming.data["day-progress"];
    if (!was || typeof was !== "object" || Array.isArray(was)) return incoming;
    const out = now && typeof now === "object" && !Array.isArray(now) ? Object.assign({}, now) : {};
    let changed = false;
    for (const [d, p] of Object.entries(was)) {
      if (!kcAttempts(p)) continue;
      const n = out[d] && typeof out[d] === "object" ? out[d] : null;
      if (!kcAttempts(n)) { out[d] = Object.assign({}, p, n || {}, { history: kcHistory(p), score: p.score, done: !!p.done, date: p.date || null }); changed = true; continue; }
      const u = kcUnion(n, p);
      if (!u.add.length && (n.done || !p.done)) continue;
      const scores = [n.score, p.score].filter((x) => typeof x === "number");
      out[d] = Object.assign({}, n, { history: u.history, done: !!(n.done || p.done) }, scores.length ? { score: Math.max(...scores) } : {});
      changed = true;
    }
    if (!changed) return incoming;
    return Object.assign({}, incoming, { data: Object.assign({}, incoming.data, { "day-progress": out }) });
  }
  // ✍️ On a trainee's own write to trainee:<id>, a day's FIRST attempt (the day had none on the stored record, so
  // keepKcAttempts took the write as it is) is dated by the Worker's clock, not the device's, and only a score of 0–100
  // is recorded: the record's dates and scores are then ones the trainee can't choose (a 👥 merge orders attempts by them).
  function dateFirstAttempts(existing, merged, now) {
    const was = (existing && existing.dayProgress && typeof existing.dayProgress === "object") ? existing.dayProgress : {};
    const dp = merged.dayProgress;
    if (!dp || typeof dp !== "object" || Array.isArray(dp)) return;
    const ok = (x) => typeof x === "number" && Number.isFinite(x) && x >= 0 && x <= 100;
    const at = now.toISOString(), out = Object.assign({}, dp);
    let changed = false;
    for (const [d, n] of Object.entries(dp)) {
      if (!n || typeof n !== "object" || kcAttempts(was[d])) continue;
      const h = Array.isArray(n.history) ? n.history : [];
      // (a day with no attempt is never passed, nor marked restored: done and kcUnverified come only with a score)
      if (!h.length && n.score == null) { if ("done" in n || "kcUnverified" in n) { const x = Object.assign({}, n); delete x.done; delete x.kcUnverified; out[d] = x; changed = true; } continue; }
      const x = Object.assign({}, n);
      delete x.kcUnverified;   // (a trainer's 🛠 restore sets it, never the trainee's write)
      if (h.length) {
        // (one attempt: a day's first write records only its first, as the one-attempt rule allows; js/cm-kc-once.js)
        const first = h.find((y) => y && typeof y === "object" && ok(y.score));
        if (!first) { ["history", "score", "done", "date"].forEach((f) => delete x[f]); }
        else { x.history = [Object.assign({}, first, { passed: first.score >= 70, date: at })]; x.score = first.score; x.done = first.score >= 70; x.date = at; }
      } else if (ok(n.score)) { x.date = at; x.done = n.score >= 70; }
      else { ["score", "done", "date"].forEach((f) => delete x[f]); }
      out[d] = x; changed = true;
    }
    if (changed) merged.dayProgress = out;
  }
  // 🏅 The Case Flow summary's Knowledge Check (caseFlow.days[n].kc and .passed: the Scorecard, the Batch Sheet and the
  // Portal read it) is the record's own: on a trainee's write it is set from merged.dayProgress (its official score and
  // pass, after keepKcAttempts), or, for a day with no attempt there, kept as the stored summary had it. The device's
  // copy (index.html scoreSummary, from its own state) never sets it.
  function officialCaseFlow(existing, merged) {
    const cf = merged.caseFlow;
    if (!cf || typeof cf !== "object" || !cf.days || typeof cf.days !== "object") return;
    const dp = (merged.dayProgress && typeof merged.dayProgress === "object") ? merged.dayProgress : {};
    const exDays = (existing && existing.caseFlow && existing.caseFlow.days && typeof existing.caseFlow.days === "object") ? existing.caseFlow.days : {};
    const days = {};
    // (which day's dayProgress a Case Flow day reads is not the device's to choose: the stored summary's id for that day
    // stands; a day new to the summary takes the write's id only when no other day of it has that id)
    const exId = (k) => exDays[k] && typeof exDays[k] === "object" && exDays[k].id != null ? String(exDays[k].id) : null;
    const held = new Set(Object.keys(exDays).map(exId).filter((x) => x != null)), fresh = {};
    Object.entries(cf.days).forEach(([k, v]) => { if (exId(k) == null && v && typeof v === "object" && v.id != null) fresh[String(v.id)] = (fresh[String(v.id)] || 0) + 1; });
    for (const [k, v] of Object.entries(cf.days)) {
      if (!v || typeof v !== "object") { days[k] = v; continue; }
      const own = exId(k) != null ? exDays[k].id : v.id != null && !held.has(String(v.id)) && fresh[String(v.id)] === 1 ? v.id : null;
      const w = Object.assign({}, v); if (own != null) w.id = own; else delete w.id;
      const p = own != null ? dp[String(own)] : null, ex = exDays[k] && typeof exDays[k] === "object" && (exId(k) != null || own == null) ? exDays[k] : null;
      if (kcAttempts(p)) days[k] = Object.assign(w, { kc: typeof p.score === "number" ? p.score : kcHistory(p)[0].score, passed: !!p.done });
      else days[k] = Object.assign(w, { kc: ex && typeof ex.kc === "number" ? ex.kc : null, passed: !!(ex && ex.passed) });
    }
    merged.caseFlow = Object.assign({}, cf, { days });
  }
  return { mergedInto, uidTarget, indexUid, uidOf, resolveTrainee, mergedAway, kcUnion, keepKcStored, keepProgressAttempts, dateFirstAttempts, officialCaseFlow };
}

// 👥 After a merge, a device that hasn't restored the merged copy yet (its write doesn't name the stored mergedAt: mergeSeen
// on trainee:<id>, mergedAt on progress:<id>, js/cm-safe-logout.js) can't drop what the merge folded in. Its write is
// joined with mergebase:<id> (what the merge itself wrote, worker-account-repair.js), never with the stored copy, so the
// fold is the same every time: what the device later removes or changes of its own isn't kept or doubled, and the
// snapshot never grows past the device's own copy and the merge's. Without a mergebase of that merge (a merge from before
// it was kept), the stored copy is used. A fold that would be over MAX_SNAPSHOT isn't made (the merge's copy stays in
// mergebase:<id> and its backups; the stored copy is marked mergeFoldSkipped and the answer is {mergeFoldSkipped}, never
// {mergePending}). The Worker answers {mergePending: mergedAt}: the device then restores the merged copy.
export { MAX_SNAPSHOT };
export const mergeBaseKey = (id) => `mergebase:${id}`;
async function mergeBase(kv, id, mergedAt) {
  const b = parse(await kv.get(mergeBaseKey(id)));
  return b && typeof b === "object" && b.mergedAt === mergedAt ? b : null;
}
// trainee:<id>: `merged` is the trainee's write (protected fields already kept, mergedAt among them); the mergedAt folded
// for ("" when the write names it, or there was no merge)
export async function afterMerge(kv, id, existing, merged, incoming) {
  const seen = incoming && incoming.mergeSeen;
  delete merged.mergeSeen;
  if (!existing || !existing.mergedAt || seen === existing.mergedAt) return "";
  const b = await mergeBase(kv, id, existing.mergedAt), base = (b && b.trainee) || existing;
  // (a practice's best score and runs are the higher of the two, as the merge made them: never the device's lower one)
  MERGE_FOLD.forEach((f) => { if (base[f] != null) merged[f] = f === "practiceProgress" ? mergePractice(merged[f], base[f]) : mergeVals(merged[f], base[f]); });
  return existing.mergedAt;
}
// ✍️ A trainer's write of a whole trainee:<id> record from a copy read before a 👥 merge (it doesn't name the stored
// mergedAt): the merge's mark is kept (it lives in trainee-admin:<id>, so a copy without it would clear it, and a device
// still open would then stop being folded), and the lists the merge joined are joined back in from mergebase:<id>, as a
// stale trainee write's are (afterMerge). A copy that names the stored mergedAt is written as it is.
export async function keepMergeStored(kv, key, value) {
  let inc, ex; try { inc = JSON.parse(value); ex = JSON.parse((await kv.get(key)) || "null"); } catch (e) { return value; }
  if (!inc || typeof inc !== "object" || !ex || typeof ex !== "object" || !ex.mergedAt) return value;
  if (inc.mergedAt && String(inc.mergedAt) >= String(ex.mergedAt)) return value;
  inc.mergedAt = ex.mergedAt;
  const b = await mergeBase(kv, key.slice("trainee:".length), ex.mergedAt), base = b && b.trainee;
  if (base) MERGE_FOLD.forEach((f) => { if (base[f] != null) inc[f] = f === "practiceProgress" ? mergePractice(inc[f], base[f]) : mergeVals(inc[f], base[f]); });
  return JSON.stringify(inc);
}
// progress:<id>: the same for the whole snapshot (incoming.mergedAt is the merge the device restored last):
// {value, pending (the mergedAt folded for, or "")}
export async function afterMergeProgress(kv, id, existing, incoming) {
  if (!existing || typeof existing !== "object" || !existing.mergedAt || incoming.mergedAt === existing.mergedAt) return { value: incoming, pending: "" };
  const b = await mergeBase(kv, id, existing.mergedAt), base = (b && b.progress) || existing;
  const out = Object.assign(mergeVals(incoming, base), { savedAt: incoming.savedAt, mergedAt: existing.mergedAt, traineeId: incoming.traineeId || existing.traineeId });
  const PP = "practice-progress", di = incoming.data, db = base && base.data;
  if (out.data && typeof out.data === "object" && di && db && di[PP] != null && db[PP] != null) out.data = Object.assign({}, out.data, { [PP]: mergePractice(di[PP], db[PP]) });
  delete out.mergeFoldSkipped;
  // (too large folded: the device's own copy is stored so its work isn't refused, marked mergeFoldSkipped for a trainer
  // (the merge's copy stays in mergebase:<id> and its backups). It keeps the mergedAt, so its next saves are still
  // folded, but it isn't the merged copy: the device is not told to restore it, and no device records it as restored)
  if (JSON.stringify(out).length > MAX_SNAPSHOT) return { value: Object.assign({}, incoming, { mergedAt: existing.mergedAt, mergeFoldSkipped: { mergedAt: existing.mergedAt, at: new Date().toISOString() } }), pending: "", skipped: existing.mergedAt };
  return { value: out, pending: existing.mergedAt };
}
// 🧳 orphan:<own id>:<ms> (null when written, else why not)
export async function orphanWrite(kv, id, key, value) {
  if (!key.startsWith(`orphan:${id}:`) || !/^orphan:[^:]+:\d{13}$/.test(key) || String(value).length > 2000000) return "Not allowed";
  if (Math.abs(Date.now() - Number(key.slice(-13))) > WEEK) return "Not allowed";
  if ((await kv.get(key)) != null) return "Not allowed";
  const n = (await kv.list({ prefix: `orphan:${id}:`, limit: ORPHAN_MAX + 1 })).keys.length;
  if (n >= ORPHAN_MAX) return "Too many backups";
  await kv.put(key, String(value));
  return null;
}
