/* ============================================================
   👥 Account repair: two (or more) accounts of one trainee merged into one, on the Worker, in one call
   (worker.js imports this: POST /api/account-merge, a trainer's only)

   One trainee can end up with two accounts: a name or Batch ID changed on the LSH Training Portal made a new, empty one
   (before the uid index), or the same batch was given out as B250926 and B092526. Each then holds part of the work.
   The old 👥 Merge on the Batch Sheet folded five keys from the trainer's page, kept the kept account's "not passed" over
   the other's pass, and left the rest of the trainee's records (calls, simulator results, check-ins, the Backup Drive,
   uploads, certificates) on the old id. This does it on the Worker, from what it reads itself:

   body {ids: [id, id, …], name?, batch?, keep?, confirm?, expectKeep?, expectDelete?, expectKc?, differentPortalIds?}
     - A DRY RUN unless confirm is true: it reads everything and answers with what the merge would do, per day
       {day, record (the kept record's value now), recovered (the merged value), source (where the attempts come from),
       note (attempts left out)}, and the keys it would write, move, leave and delete. Nothing is written.
     - The confirm must name the preview's result (expectKeep: its keep; expectDelete: its keys.delete): when the id kept
       or the keys to delete came out differently since (a Portal sign-in in between), it is refused (409) unwritten; and
       expectKc: the days only the trainee's device scores (each attempt's score and date), as the preview showed them
       (the trainee can write those copies in between): refused (409) when they came out otherwise, also after step 2.
     - THE ID KEPT is the one the trainee's CURRENT Portal name and batch open (resolveTrainee, as a sign-in does: the uid
       index, then the name + batch ids): from name + batch in the body, else the name and batch the Portal gave at the
       trainee's last sign-in (uid:<portalUid>). Only when they open none of these accounts is `keep` (or the most recently
       active account) used. Then the next sign-in, on any device, opens it.
     - Records with two different Portal ids (portalUid) are two Portal accounts: refused unless differentPortalIds is true.
     - merged:<keep> (or merged:<the current name's id>) that sends the sign-in to a live account not in ids: refused (409).
     - An account active in the last 15 minutes is a warning: a page left open is folded in (worker-identity.js afterMerge).
   On confirm, in this order, and nothing is deleted until everything is copied:
     0. backup:<keep>:<ts>:redirects (merged:<keep>, merged:<new id>, uid:<portalUid> and each merged:<other> as they are),
        then merged:<other> = {into: keep} for each other id (merged:<keep> deleted): from here on a trainee save to another
        account is refused (worker.js traineeWrite; the page backs its work up as orphan:<id>:<ms>); and trainee-alias:<other>
        = keep for each, as every alias that led to one of them (the Portal follows one hop to file a simulator result or
        graded call; worker-identity.js aliasPlan), the kept id's own alias removed (the backup holds them as they were);
     1. backup:<id>:<ts> for every id (the kept one too, with merged:<keep>, merged:<new id> and uid:<portalUid> as they
        were): each key of theirs as read ({at, by, keep, keys}; parts measured in UTF-8 bytes: backup:<id>:<ts>:p2 …,
        and a single value too large for a part in backup:<id>:<ts>:k1 …);
     2. every account read again: a key that changed since the read is backed up (backup:<id>:<ts>:fresh) and the merged
        records are built again from it, so a save made in between (on the kept account, or on another before its
        redirect) is merged, never written over or deleted, and so is an orphan backup written in between;
     3. the kept account's records written merged:
          dayProgress, per day: the trainee:<id> records are the official source: when any of them has an attempt that
          day, only their attempts count (the same score within 10 minutes is one attempt), oldest first. A day no record
          scores is taken from the progress snapshots, work-log quiz entries and the accounts' own orphan:<id>:<ms>
          backups (never one that says it holds another trainee's work): the trainee writes those, so such a day is
          marked kcUnverified (its row: unverified), takes only the attempts counted (never the device's own score or
          "done"), and an attempt is never counted with a score outside 0–100 or, from a device, without a date or dated
          before the trainee registered or after now (listed in the note). The official score is the first attempt, or the
          best when a trainer reset the day (kcReset); done when any attempt counted is 70 or more; caseFlow.days[n].kc
          and passed follow it. Attempts left out are listed in the table's note. kcReset[d].n (a trainer's reset is open
          while the day holds exactly n attempts) is set again from the merged day: a reset open on its own record
          stays open, a used one stays used;
          trainee, progress, feedback, focus, actsub (the MERGE_KEYS; their trainer halves, <type>-admin:<id>, are written
          with them, ownerPut): the kept account's value wins a clash of plain values, lists are joined, a trainer's
          review wins over an auto-review, the newer submission of an activity wins;
          progress:<keep> (written even when no account had one) holds the merged record's practice-progress,
          completed-lab-actions, submissions and roleplayHistory too, so a device restoring it doesn't sync them back
          smaller; a merged snapshot over the save limit (MAX_SNAPSHOT, with headroom) refuses the merge (409, tooLarge);
          trainee:<keep>.mergedAt and progress:<keep>.mergedAt = now, and progress:<keep>.savedAt is later than every
          snapshot's: a device restores the merged snapshot at its next start, or at its next save's answer
          ({mergePending}; js/cm-safe-logout.js backs its own up first), and until it has, its saves are joined with
          mergebase:<keep> (what the merge wrote, written just before it: worker-identity.js afterMerge);
          callsim, simresults, labreview, hipaa: merged; drive, drivework, drivework-ov: moved when the kept account has
          none (else left where they are; checked again just before the write); actup:<id>:*, checkin:<date>:<id>: the
          same; cert:* records of the other ids: traineeId rewritten on the cert as it is then (traineeIdWas kept);
          case-alerts:resolved: re-keyed on the copy read just before the write;
     4. uid:<portalUid> = {id: keep} (the redirects of step 0 include the current name + batch's own id when no record
        has it, only from the trainee's last Portal sign-in). A failure up to here takes the redirects back, so the
        accounts not merged keep working; running the merge again finishes it;
     5. only then the other ids' copied keys are deleted, each one only if it is still as it was read (else it is left,
        listed in changedSinceRead, for the next run), and only once that id's merged:<other> is SETTLE_MS old: KV can
        show a Worker elsewhere no redirect (and this one an old value) for about a minute, so a save can land unseen.
        The first run leaves them (pendingDelete, finishAfter); the merge run again after that reads them fresh, folds in
        what landed, and deletes them. orphan:<id>:* backups are never deleted: the kept account reads those of every id
        merged into it (rec.mergedFrom, while its merged:<x> leads there), so a page left open on the other id still
        reaches it.
   body {removeRedirect: id, confirm?}: a merged:<id> left on a live record (see removeRedirect below), with its trainee-alias:<id>.
   ============================================================ */
const MAIN = ["trainee", "progress", "feedback", "focus", "actsub"];
const SINGLE_MERGE = ["callsim", "simresults", "labreview", "hipaa"];
const SINGLE_MOVE = ["drive", "drivework", "drivework-ov"];
const ID_RE = /^[^\s:]{1,120}$/;
const TEN_MIN = 600000;
// how long a redirect (merged:<other>) must have been written before the other id's keys are deleted: KV can show another
// Worker an old value, or none, for about 60 s after a write
export const SETTLE_MS = 120000;
// the trainee list fields a stale device's whole-record write would drop after a merge (worker-identity.js afterMerge),
// kept with the merged snapshot in mergebase:<keep>
export const MERGE_FOLD = ["submissions", "roleplayHistory", "practiceProgress", "completedLabActions", "caseFlow"];
export const mergeBaseKey = (id) => `mergebase:${id}`;
// the progress:<id> limit a trainee's save is held to (worker.js traineeWrite "Too large"), and the merged snapshot's: a
// little under it, so the device that restores it still has room to save its next work
export const MAX_SNAPSHOT = 2000000;
const MERGED_SNAPSHOT_MAX = Math.floor(MAX_SNAPSHOT * 0.95);
// the merged trainee record's fields its progress snapshot holds too: [record field, snapshot key, joined with the snapshot's]
const RECORD_IN_SNAPSHOT = [["practiceProgress", "practice-progress", false], ["completedLabActions", "completed-lab-actions", false], ["submissions", "submissions", true], ["roleplayHistory", "roleplayHistory", true]];
const parse = (raw) => { if (raw == null) return null; try { return JSON.parse(raw); } catch (e) { return undefined; } };

// the Batch Sheet's mergeVals: a's plain value wins a clash, lists are joined, objects merged key by key
export function mergeVals(a, b) {
  if (a === undefined || a === null || a === "") return b === undefined ? a : b;
  if (b === undefined || b === null || b === "") return a;
  if (Array.isArray(a) && Array.isArray(b)) { const seen = new Set(a.map((x) => JSON.stringify(x))); return a.concat(b.filter((x) => !seen.has(JSON.stringify(x)))); }
  if (typeof a === "object" && typeof b === "object" && !Array.isArray(a) && !Array.isArray(b)) { const out = Object.assign({}, a); Object.keys(b).forEach((k) => { out[k] = mergeVals(a[k], b[k]); }); return out; }
  return a;
}
const obj = (v) => v && typeof v === "object" && !Array.isArray(v) ? v : null;
const at = (x) => Date.parse((x && (x.date || x.at)) || "") || 0;

/* One day's Knowledge Check from every source: sources [{label, p (a day as stored), log: [work-log quiz entries]}] and
   whether a trainer reset the day. Returns the merged day's KC fields and where its attempts came from. */
export function mergeDay(sources, reset, kcHistory, window) {
  const all = [], rejected = [];
  const take = (x, s, label) => {
    const why = attemptProblem(x, s.official, s.window || window);
    if (why) rejected.push({ label, score: x.score, why }); else all.push({ x, label });
  };
  for (const s of sources) {
    const h = s.p ? kcHistory(s.p) : [];
    h.forEach((x) => { if (x && typeof x.score === "number") take(x, s, s.label); });
    (s.log || []).forEach((e) => { if (typeof e.score === "number") take({ score: e.score, passed: e.score >= 70, date: e.at || null }, s, s.label.replace(/^[a-z]+:/, "work-log:")); });
  }
  all.sort((a, b) => at(a.x) - at(b.x));
  const out = [], from = [];
  for (const a of all) {
    const same = out.find((y) => y.score === a.x.score && Math.abs(at(y) - at(a.x)) < TEN_MIN);
    if (same) { if (!same.answers && Array.isArray(a.x.answers)) same.answers = a.x.answers; continue; }
    out.push(Object.assign({}, a.x, { passed: a.x.score >= 70 })); from.push(a.label);
  }
  if (!out.length) return rejected.length ? { none: true, rejected } : null;
  // (done from an attempt counted, or a record's own pass: never a device's "done" alone)
  // (a record's own pass counts only when one of its attempts did: never one whose every attempt was left out)
  const counted = new Set(all.map((a) => a.label));
  const done = out.some((x) => x.score >= 70) || sources.some((s) => s.official && s.p && s.p.done === true && counted.has(s.label));
  const score = reset ? Math.max(...out.map((x) => x.score)) : out[0].score;
  return { history: out, score, done, date: out[out.length - 1].date || null, from, rejected };
}
/* An attempt that can't be a real one is never counted: a score outside 0–100, or a date before the trainee registered or
   after now; and, for one the trainee's device wrote (a progress snapshot, a work-log entry, an orphan backup: the trainee
   can write any of them), no date. A record's attempt (official) is held to its own record's registration: an undated one
   there is a record from before attempts were dated. window = {from, to} (ms). The reason, or "" when it counts. */
function attemptProblem(x, official, window) {
  if (typeof x.score !== "number" || !Number.isFinite(x.score) || x.score < 0 || x.score > 100) return "score outside 0–100";
  const t = Date.parse((x && x.date) || "");
  if (!Number.isFinite(t)) return official ? "" : "no date";
  if (window && window.from && t < window.from) return "dated before the trainee registered";
  if (window && window.to && t > window.to) return "dated in the future";
  return "";
}
const rejectedNote = (r) => r && r.length ? `Not counted (not a possible attempt): ${r.map((x) => `${x.label} ${x.score}% (${x.why})`).join("; ")}` : "";

export function mergePractice(a, b) {
  const out = mergeVals(a, b);
  if (!obj(out)) return out;
  Object.keys(out).forEach((t) => {
    const x = obj(a && a[t]), y = obj(b && b[t]), m = obj(out[t]);
    if (!m || !x || !y) return;
    const best = [x.bestScore, y.bestScore].filter((v) => typeof v === "number");
    if (best.length) m.bestScore = Math.max(...best);
    m.runs = Math.max(Number(x.runs) || 0, Number(y.runs) || 0, Array.isArray(m.history) ? m.history.length : 0);
  });
  return out;
}
function mergeFeedback(a, b, isTrainerReview) {
  if (!obj(a)) return b; if (!obj(b)) return a;
  const out = mergeVals(a, b);
  const days = Object.assign({}, obj(b.days) || {}, obj(a.days) || {});
  Object.entries(obj(b.days) || {}).forEach(([d, v]) => { const mine = (obj(a.days) || {})[d]; if (mine && isTrainerReview(v) && !isTrainerReview(mine)) days[d] = v; });
  out.days = days;
  if (obj(a.caseFlow) || obj(b.caseFlow)) {
    const cf = Object.assign({}, obj(a.caseFlow) || {});
    Object.entries(obj(b.caseFlow) || {}).forEach(([m, v]) => { if (!cf[m] || at(v) > at(cf[m])) cf[m] = v; });
    out.caseFlow = cf;
  }
  return out;
}
function mergeFocus(a, b) {
  if (!obj(a)) return b; if (!obj(b)) return a;
  const items = (Array.isArray(a.items) ? a.items : []).slice(), ids = new Set(items.map((x) => x && x.id));
  (Array.isArray(b.items) ? b.items : []).forEach((x) => { if (x && !ids.has(x.id)) items.push(x); });
  return Object.assign(mergeVals(a, b), { items });
}
function mergeActsub(a, b) {
  if (!obj(a)) return b; if (!obj(b)) return a;
  const items = Object.assign({}, obj(b.items) || {});
  Object.entries(obj(a.items) || {}).forEach(([k, v]) => { const o = items[k]; if (!o || String((v && v.submittedAt) || "") >= String((o && o.submittedAt) || "")) items[k] = v; });
  return Object.assign(mergeVals(a, b), { items });
}
const summary = (p) => p && (typeof p.score === "number" || (Array.isArray(p.history) && p.history.length))
  ? { score: typeof p.score === "number" ? p.score : null, done: !!p.done, attempts: Array.isArray(p.history) && p.history.length ? p.history.length : 1 } : null;

async function listKeys(kv, prefix) {
  const out = []; let cursor;
  do { const r = await kv.list({ prefix, cursor }); r.keys.forEach((k) => out.push(k)); cursor = r.list_complete ? null : r.cursor; } while (cursor && out.length < 20000);
  return out;
}

// Everything of one trainee id, as read (a failed read throws: the merge then changes nothing). Its orphan:<id>:<ms>
// backups (a device's work its last save never got to the server, js/cm-safe-logout.js) are read too: never written,
// moved or deleted here.
async function readAccount(kv, D, id) {
  const keys = {};
  const put = (k, raw) => { if (raw != null) keys[k] = raw; };
  await Promise.all(MAIN.map(async (t) => { put(`${t}:${id}`, await kv.get(`${t}:${id}`)); put(D.ownerKey(`${t}:${id}`), await kv.get(D.ownerKey(`${t}:${id}`))); }));
  await Promise.all(SINGLE_MERGE.concat(SINGLE_MOVE).map(async (t) => put(`${t}:${id}`, await kv.get(`${t}:${id}`))));
  for (const k of await listKeys(kv, `actup:${id}:`)) put(k.name, await kv.get(k.name));
  return { id, keys, orphans: await accountOrphans(kv, D, id, parse(keys[`trainee:${id}`])) };
}
// An account's orphans: its own, and those of every id merged into it (rec.mergedFrom, each only while its merged:<x>
// redirect leads here: mergedFrom is on the trainee's own record, the redirect is the Worker's). A page left open on a
// merged-away account backs its refused saves up under that id (js/cm-safe-logout.js), after its records are gone.
async function accountOrphans(kv, D, id, rec) {
  const out = await readOrphans(kv, id);
  const from = [...new Set(obj(rec) && Array.isArray(rec.mergedFrom) ? rec.mergedFrom.map(String).filter((x) => x !== id && ID_RE.test(x)) : [])].slice(0, 20);
  for (const x of from) { const t = await D.mergedInto(kv, x); if (t && t.id === id) out.push(...(await readOrphans(kv, x))); }
  return out;
}
async function readOrphans(kv, id) {
  const out = [];
  for (const k of await listKeys(kv, `orphan:${id}:`)) out.push({ key: k.name, v: obj(parse(await kv.get(k.name))) });
  return out;
}
// An orphan's owner is the id in its key (the Worker took it only from that id's token). The traineeId, name and batch in
// its body are the device's unverified claims: one that names another trainee (a shared computer's handover, or a backup
// uploaded under the next account signed in) is listed, never folded into this id.
const orphanOwner = (o) => String(o.key).split(":")[1];
const ownOrphan = (o) => !!(o.v && obj(o.v.data) && (o.v.traineeId == null || o.v.traineeId === orphanOwner(o)) && o.v.reason !== "handover");
const logIn = (data, d) => (Array.isArray(data && data["work-log"]) ? data["work-log"] : []).filter((e) => e && e.kind === "quiz" && String(e.dayId) === String(d) && typeof e.score === "number");
const scoresOf = (s, kcHistory) => (s.p ? kcHistory(s.p).map((x) => x && x.score) : []).concat((s.log || []).map((e) => e.score)).filter((x) => typeof x === "number");

/* Each day's Knowledge Check, from every account. The trainee:<id> records are the official source (the Worker holds
   their one-attempt rule, keepKcAttempts): when any of them has an attempt that day, only they count. Only a day no record
   scores is taken from what the trainee's devices wrote (progress snapshots, work-log quiz entries, their own orphan
   backups); what was left out is listed in the table, never used for the score or the pass. */
function kcDays(D, recs, now) {
  // (a device's attempt must be dated between the earliest registration and now: a few minutes' clock slack)
  const reg = recs.map(({ rec }) => Date.parse(rec.registeredAt || "")).filter(Number.isFinite);
  const window = { from: reg.length ? Math.min(...reg) - TEN_MIN : 0, to: (now ? now.getTime() : Date.now()) + TEN_MIN };
  const days = new Set();
  recs.forEach(({ rec, prog, orphans }) => {
    Object.keys(obj(rec.dayProgress) || {}).forEach((d) => days.add(d));
    [obj(prog && prog.data)].concat(orphans.map((o) => o.v.data)).forEach((data) => {
      Object.keys(obj(data && data["day-progress"]) || {}).forEach((d) => days.add(d));
      (Array.isArray(data && data["work-log"]) ? data["work-log"] : []).forEach((e) => { if (e && e.kind === "quiz" && e.dayId != null && typeof e.score === "number") days.add(String(e.dayId)); });
    });
  });
  const dayProgress = {}, table = [], keepRec = recs[0].rec;
  [...days].sort((x, y) => Number(x) - Number(y) || x.localeCompare(y)).forEach((d) => {
    const sources = [];
    recs.forEach(({ id, rec, prog, orphans }) => {
      const own = Date.parse(rec.registeredAt || "");
      sources.push({ label: `trainee:${id}`, p: obj((obj(rec.dayProgress) || {})[d]), official: true, window: { from: Number.isFinite(own) ? own - TEN_MIN : 0, to: window.to } });
      const data = obj(prog && prog.data);
      sources.push({ label: `progress:${id}`, p: obj((obj(data && data["day-progress"]) || {})[d]), log: logIn(data, d) });
      orphans.forEach((o) => sources.push({ label: o.key, p: obj((obj(o.v.data["day-progress"]) || {})[d]), log: logIn(o.v.data, d) }));
    });
    const official = sources.filter((s) => s.official), useOfficial = official.some((s) => s.p && D.kcHistory(s.p).length);
    const chosen = useOfficial ? official : sources;
    const reset = recs.some(({ rec }) => obj(rec.kcReset) && rec.kcReset[d]);
    const res = mergeDay(chosen, reset, D.kcHistory, window), kc = res && !res.none ? res : null;
    let base;
    sources.filter((s) => s.official).concat(sources.filter((s) => s.label.startsWith("progress:"))).forEach((s) => { if (s.p) base = mergeVals(base, s.p); });
    const day = Object.assign({}, base || {});
    // (a day no record scores never takes a device's score or pass with it: only the attempts counted)
    // (nor a record's own score when none of its attempts could be counted)
    if (!useOfficial || !kc) { ["score", "done", "history", "date", "kcAttempts"].forEach((f) => delete day[f]); delete day.kcUnverified; }
    if (kc) { day.history = kc.history; day.score = kc.score; day.done = kc.done; day.date = kc.date; }
    if (kc && !useOfficial) day.kcUnverified = true;   // (from the trainee's device only, never a record: js/cm-scorecard.js labels it)
    if (kc || Object.keys(day).length) dayProgress[d] = day;
    const was = obj((obj(keepRec.dayProgress) || {})[d]);
    const from = kc ? [...new Set(kc.from)] : [];
    const left = useOfficial ? sources.filter((s) => !s.official && scoresOf(s, D.kcHistory).length) : [];
    const row = { day: d, record: summary(was), recovered: summary(day), source: from.length ? from.join(", ") : "—", changed: JSON.stringify(summary(was)) !== JSON.stringify(summary(day)) || (kc ? kc.history.length : 0) !== (was && Array.isArray(was.history) ? was.history.length : was && typeof was.score === "number" ? 1 : 0), reset };
    // ⚠ a score only the trainee's device holds (no record has it): the trainer sees it is unverified before confirming
    if (kc && !useOfficial) row.unverified = true;
    const notes = [];
    if (kc && !useOfficial) notes.push("Unverified: only the trainee's device wrote this score (no trainee record has it).");
    if (left.length) notes.push(`Left out (written by the trainee's device; a record scores this day, and the records are what count): ${left.map((s) => `${s.label} ${scoresOf(s, D.kcHistory).map((x) => x + "%").join(", ")}`).join("; ")}`);
    if (res && res.rejected.length) notes.push(rejectedNote(res.rejected));
    if (notes.length) row.note = notes.join(" ");
    table.push(row);
  });
  // (what the trainer confirms of the days only the trainee's device scores: the confirm must name it, kcPrint)
  return { dayProgress, table, kcExpect: JSON.stringify(table.filter((r) => r.unverified).map((r) => kcPrint(r.day, dayProgress[r.day]))) };
}
// a day's Knowledge Check as the trainer previewed it: its score, pass and every attempt's score and date. A confirm
// (merge or restore) names the preview's (expectKc); when the days written from the trainee's own copies came out
// otherwise since (the trainee can write their snapshot and orphan backups), it is refused unwritten.
const kcPrint = (d, p) => [String(d), p && typeof p.score === "number" ? p.score : null, !!(p && p.done), (p && Array.isArray(p.history) ? p.history : []).map((x) => [x && x.score, (x && x.date) || null])];

/* The kept account's merged records, from the kept account as given (as read, or read again just before the writes) and
   the others: {values: {key: value}, table}. */
function buildMerged(D, keepA, others, ctx) {
  const { keep, profile, uid, now } = ctx;
  const recOf = (a) => parse(a.keys[`trainee:${a.id}`]);
  const val = (a, t) => parse(a.keys[`${t}:${a.id}`]);
  const accts = [keepA].concat(others);
  const seenOrphan = new Set();   // (an orphan of a merged-away id is read by the account it now lives in, and by its own while that is still there)
  const recs = accts.map((a) => ({ id: a.id, rec: obj(recOf(a)) || {}, prog: obj(val(a, "progress")), orphans: a.orphans.filter((o) => ownOrphan(o) && !seenOrphan.has(o.key) && seenOrphan.add(o.key)) }));
  const { dayProgress, table, kcExpect } = kcDays(D, recs, now);

  let rec = null;
  recs.forEach((r, i) => { rec = i ? mergeVals(rec, r.rec) : Object.assign({}, r.rec); });
  const all = recs.map((r) => r.rec), keepRec = recs[0].rec;
  rec.id = keep;
  rec.approved = all.some((r) => r.approved === true) && !keepRec.rejected ? true : keepRec.approved;
  rec.registeredAt = all.map((r) => r.registeredAt).filter(Boolean).sort()[0] || rec.registeredAt || "";
  rec.lastActive = all.map((r) => r.lastActive).filter(Boolean).sort().pop() || rec.lastActive || "";
  rec.mergedFrom = [...new Set((Array.isArray(keepRec.mergedFrom) ? keepRec.mergedFrom : []).concat(...others.map((a) => { const r = obj(recOf(a)) || {}; return [a.id].concat(Array.isArray(r.mergedFrom) ? r.mergedFrom : []); })))];
  if (uid) rec.portalUid = keepRec.portalUid || uid;
  if (profile && D.canonicalBatch(profile.batch)) rec.batch = D.canonicalBatch(profile.batch);
  rec.dayProgress = dayProgress;
  // 🔁 a trainer's reset (kcReset[d].n: open while the day holds exactly n attempts) as it was on its own record: open
  // stays open, used stays used, whatever the attempts the merge added to the day
  const resets = {};
  recs.forEach((r) => Object.entries(obj(r.rec.kcReset) || {}).forEach(([d, rs]) => { if (obj(rs) && !resets[d]) resets[d] = { rs, open: D.kcResetOpen(rs, (obj(r.rec.dayProgress) || {})[d]) }; }));
  if (Object.keys(resets).length) {
    rec.kcReset = Object.assign({}, obj(rec.kcReset) || {});
    Object.entries(resets).forEach(([d, { rs, open }]) => {
      const count = dayProgress[d] ? D.kcHistory(dayProgress[d]).length : 0;
      if (!count) { rec.kcReset[d] = rs; return; }
      rec.kcReset[d] = Object.assign({}, rs, { n: open ? count : count - 1 }, rs.n !== (open ? count : count - 1) ? { nBeforeMerge: Number.isInteger(rs.n) ? rs.n : null } : {});
    });
  }
  rec.practiceProgress = recs.reduce((acc, r, i) => i ? mergePractice(acc, r.rec.practiceProgress) : r.rec.practiceProgress, null) || rec.practiceProgress;
  const nums = (f) => all.map((r) => r[f]).filter((x) => typeof x === "number");
  if (nums("labAttemptsGlobal").length) rec.labAttemptsGlobal = Math.max(...nums("labAttemptsGlobal"));
  if (obj(rec.caseFlow)) {
    rec.caseFlow = Object.assign({}, rec.caseFlow, { at: all.map((r) => obj(r.caseFlow) && r.caseFlow.at).filter(Boolean).sort().pop() || rec.caseFlow.at || null });
    if (obj(rec.caseFlow.days)) {
      const cd = {};
      Object.entries(rec.caseFlow.days).forEach(([n, v]) => {
        const p = obj(v) && v.id != null ? dayProgress[String(v.id)] : null;
        cd[n] = p && typeof p.score === "number" ? Object.assign({}, v, { kc: p.score, passed: !!p.done }) : v;
      });
      rec.caseFlow.days = cd;
    }
  }
  delete rec.mergedInto;
  // (a device still open on the kept account that hasn't restored this merge can't drop what it folded in: worker-identity.js afterMerge)
  rec.mergedAt = now.toISOString();

  // the progress snapshot: every key merged, the merged day-progress, and a savedAt later than any device's. Written even
  // when no account had one (its mergedAt is what a device records it restored the merge by, js/cm-safe-logout.js), and it
  // carries the merged record's own lists and practice scores: a device restores the snapshot, and its next trainee:<id>
  // save writes them back from it (index.html syncToLedger), so a snapshot holding only the kept account's would undo them
  let prog = null;
  recs.forEach((r) => { if (r.prog) prog = prog ? mergeVals(prog, r.prog) : Object.assign({}, r.prog); });
  const stamps = recs.map((r) => r.prog).filter(Boolean).flatMap((p) => [p.savedAt, p.serverAt]).map((s) => Date.parse(s || "") || 0);
  const savedAt = new Date(Math.max(now.getTime(), ...stamps.map((x) => x + 1))).toISOString();
  prog = Object.assign({}, prog || {}, { traineeId: keep, savedAt, serverAt: now.toISOString(), mergedAt: now.toISOString() });
  prog.data = Object.assign({}, obj(prog.data) || {});
  const dp = Object.assign({}, obj(prog.data["day-progress"]) || {});
  Object.entries(dayProgress).forEach(([d, v]) => { dp[d] = Object.assign({}, dp[d] || {}, v); });
  prog.data["day-progress"] = dp;
  RECORD_IN_SNAPSHOT.forEach(([f, k, join]) => { if (rec[f] != null) prog.data[k] = join ? mergeVals(prog.data[k], rec[f]) : rec[f]; });
  if (Array.isArray(prog.data["work-log"])) prog.data["work-log"] = prog.data["work-log"].slice().sort((x, y) => at(x) - at(y)).slice(-300);
  if ("trainee-id" in prog.data) prog.data["trainee-id"] = keep;
  const values = {};
  const put = (t, v) => { if (v != null) values[`${t}:${keep}`] = JSON.stringify(v); };
  put("trainee", rec); put("progress", prog);
  put("feedback", accts.reduce((acc, a, i) => i ? mergeFeedback(acc, val(a, "feedback"), D.isTrainerReview) : val(a, "feedback"), null));
  put("focus", accts.reduce((acc, a, i) => i ? mergeFocus(acc, val(a, "focus")) : val(a, "focus"), null));
  put("actsub", accts.reduce((acc, a, i) => i ? mergeActsub(acc, val(a, "actsub")) : val(a, "actsub"), null));
  SINGLE_MERGE.forEach((t) => {
    let v = val(keepA, t), any = false;
    others.forEach((a) => { const o = val(a, t); if (o != null) { v = v == null ? o : mergeVals(v, o); any = true; } });
    if (any) put(t, v);
  });
  // (a snapshot over the Worker's limit would refuse every save of the device that restores it: the merge isn't made)
  const progSize = values[`progress:${keep}`] ? values[`progress:${keep}`].length : 0;
  return { values, table, kcExpect, progSize, tooLarge: progSize > MERGED_SNAPSHOT_MAX };
}

// a backup's keys, in parts that fit a KV value (25 MiB): measured as written (UTF-8, the JSON escapes of the values)
async function putBackup(kv, base, head, entries) {
  const te = new TextEncoder(), parts = [[]], big = [], written = [];
  let size = 0;
  entries.forEach(([k, v]) => {
    const n = te.encode(JSON.stringify([k, v])).length;
    if (n > 24e6) { big.push([k, v]); return; }
    if (size + n > 12e6 && parts[parts.length - 1].length) { parts.push([]); size = 0; }
    parts[parts.length - 1].push([k, v]); size += n;
  });
  const elsewhere = {};
  for (let i = 0; i < big.length; i++) { const k = `${base}:k${i + 1}`; await kv.put(k, String(big[i][1])); written.push(k); elsewhere[big[i][0]] = k; }   // (the value as stored: it fit KV once)
  for (let i = 0; i < parts.length; i++) {
    const k = `${base}${i ? ":p" + (i + 1) : ""}`;
    await kv.put(k, JSON.stringify(Object.assign({}, head, { part: i + 1, parts: parts.length, keys: Object.fromEntries(parts[i]) }, i === 0 && big.length ? { keysElsewhere: elsewhere } : {})));
    written.push(k);
  }
  return written;
}

/* ---------- 🔒 a merged:<id> redirect left on a live record (the old Batch Sheet merge never deleted merged:<keep>) ----------
   body {removeRedirect: id, confirm?}: a dry run unless confirm; on confirm merged:<id> is backed up (backup:<id>:<ts>)
   and deleted. Only while trainee:<id> is there: a redirect of an id with no record is what sends its sign-in on. */
async function removeRedirect(kv, D, tok, b, now) {
  const id = String(b.removeRedirect || "").trim();
  if (!ID_RE.test(id)) return { status: 400, body: { error: "removeRedirect: one trainee id." } };
  let raw, rec;
  let alias = null;   // 🔗 (trainee-alias:<id>, sending the Portal's results for this live record elsewhere, goes with it)
  try { raw = await kv.get(`merged:${id}`); rec = await kv.get(`trainee:${id}`); if (D.aliasKey) alias = await kv.get(D.aliasKey(id)); }
  catch (e) { return { status: 503, body: { error: "A record couldn't be read, so nothing was changed. Try again." } }; }
  if (raw == null) return { status: 404, body: { error: `There is no merged:${id}.` } };
  if (rec == null) return { status: 409, body: { error: `trainee:${id} has no record: merged:${id} is what sends that sign-in to the account it was merged into, so it stays.` } };
  const into = await D.mergedInto(kv, id);
  const report = { id, redirect: parse(raw), leadsTo: into && into.id !== id ? into.id : null };
  if (b.confirm !== true) return { status: 200, body: Object.assign({ dryRun: true }, report) };
  const bk = `backup:${id}:${now.toISOString().replace(/[^0-9]/g, "").slice(0, 17)}`;
  try {
    await kv.put(bk, JSON.stringify({ at: now.toISOString(), by: D.trainerWho(tok), kind: "remove-redirect", keys: Object.assign({ [`merged:${id}`]: raw }, alias != null ? { [D.aliasKey(id)]: alias } : {}) }));
    if ((await kv.get(`merged:${id}`)) !== raw) return { status: 409, body: Object.assign({ error: `merged:${id} changed since it was read: nothing was removed. Read it again.` }, report) };
    await kv.delete(`merged:${id}`);
    if (alias != null) await kv.delete(D.aliasKey(id));
  } catch (e) { return { status: 500, body: Object.assign({ error: "The redirect couldn't be removed. Nothing else was changed.", detail: String((e && e.message) || e) }, report) }; }
  return { status: 200, body: Object.assign({ ok: true, removed: `merged:${id}`, backup: bk }, alias != null ? { aliasRemoved: D.aliasKey(id) } : {}, report) };
}

export async function accountMergeApi(env, D, tok, b) {
  if (!tok || tok.role !== "a") return { status: 403, body: { error: "Only a trainer can merge accounts." } };
  const kv = D.kvOf(env);
  if (!kv) return { status: 500, body: { error: "LSH_KV namespace is not bound on this Worker." } };
  if (b && b.removeRedirect != null) return removeRedirect(kv, D, tok, b, new Date());
  const ids = [...new Set((Array.isArray(b && b.ids) ? b.ids : []).map((x) => String(x || "").trim()).filter(Boolean))];
  if (ids.length < 2 || ids.length > 6 || !ids.every((x) => ID_RE.test(x))) return { status: 400, body: { error: "ids: two to six trainee ids." } };
  const confirm = b.confirm === true, by = D.trainerWho(tok), now = new Date();

  /* ---------- read everything first ---------- */
  let accts, checkins, certs, alerts;
  try {
    accts = await Promise.all(ids.map((id) => readAccount(kv, D, id)));
    const missing = accts.filter((a) => !a.keys[`trainee:${a.id}`]).map((a) => a.id);
    if (missing.length) return { status: 404, body: { error: `No trainee record for ${missing.join(", ")}.`, missing } };
    checkins = (await listKeys(kv, "checkin:")).filter((k) => k.name.split(":").length === 3 && ids.includes(k.name.split(":")[2]));
    for (const k of checkins) k.value = await kv.get(k.name);
    certs = [];
    for (const k of await listKeys(kv, "cert:")) {
      const c = parse(await kv.get(k.name));
      if (obj(c) && ids.includes(c.traineeId)) certs.push({ key: k.name, rec: c });
    }
    alerts = parse(await kv.get("case-alerts:resolved"));
  } catch (e) {
    return { status: 503, body: { error: "A record couldn't be read, so nothing was changed. Try again.", detail: String((e && e.message) || e) } };
  }
  const recOf = (a) => parse(a.keys[`trainee:${a.id}`]);
  if (accts.some((a) => !obj(recOf(a)))) return { status: 409, body: { error: "A trainee record couldn't be read as a record, so nothing was changed." } };

  /* ---------- the id kept: the one the trainee's current Portal name and batch open ---------- */
  const uids = [...new Set(accts.map((a) => recOf(a).portalUid).filter((u) => typeof u === "string" && u))];
  const warnings = [];
  if (uids.length > 1) warnings.push(`These accounts carry ${uids.length} different Portal ids (${uids.join(", ")}): two Portal accounts.`);
  const uid = uids[0] || "";
  let profile = b.name && b.batch ? { name: String(b.name).trim().slice(0, 120), batch: String(b.batch).trim().slice(0, 40), from: "request" } : null;
  if (!profile && uid) {
    const u = parse(await kv.get(D.uidKey(uid)));
    if (obj(u) && u.name && u.batch) profile = { name: u.name, batch: u.batch, from: "last Portal sign-in" };
  }
  let keep = "", keepWhy = "";
  if (profile) {
    const r = await D.resolveTrainee(kv, profile.name, profile.batch, uids.length === 1 ? uid : "");   // (two Portal ids: by the name + batch alone)
    const c = D.candidateIds(profile.name, profile.batch);
    const named = [c.newId, c.rawId, c.altId, c.legacyId].find((x) => ids.includes(x));
    if (ids.includes(r.chosen)) { keep = r.chosen; keepWhy = `the id the current Portal name and batch open (${profile.from})`; }
    else if (named) { keep = named; keepWhy = `the id of the current Portal name and batch (${profile.from})`; }
  }
  if (!keep && b.keep && ids.includes(String(b.keep))) { keep = String(b.keep); keepWhy = "the trainer's choice"; }
  if (!keep) {
    keep = accts.slice().sort((x, y) => String(recOf(y).lastActive || "").localeCompare(String(recOf(x).lastActive || "")))[0].id;
    keepWhy = "the most recently active account";
  }
  if (b.keep && String(b.keep) !== keep) warnings.push(`Kept ${keep}, not ${b.keep}: ${keepWhy}.`);
  const keepA = accts.find((a) => a.id === keep), others = accts.filter((a) => a.id !== keep);
  const recent = accts.filter((a) => now - (Date.parse(recOf(a).lastActive || "") || 0) < 15 * 60000);
  if (recent.length) warnings.push(`${recent.map((a) => a.id).join(", ")} ${recent.length === 1 ? "was" : "were"} active in the last 15 minutes: ask the trainee to close the course on every device first. A page left open keeps what the merge folds in, but its newest work reaches the kept account only once it is opened again.`);

  /* ---------- the redirects already there: merged:<keep>, merged:<the current name's id>, uid:<portalUid> ---------- */
  const cur = profile ? D.candidateIds(profile.name, profile.batch) : null;
  const newIdFree = !!(cur && !ids.includes(cur.newId) && !(await kv.get(`trainee:${cur.newId}`)));
  const redirKeys = [`merged:${keep}`].concat(newIdFree ? [`merged:${cur.newId}`] : []).concat(uid ? [D.uidKey(uid)] : []);
  const redirRead = {};
  for (const k of redirKeys) { const v = await kv.get(k); if (v != null) redirRead[k] = v; }
  for (const id of [keep].concat(newIdFree ? [cur.newId] : [])) {
    if (redirRead[`merged:${id}`] == null) continue;
    const t = await D.mergedInto(kv, id);
    if (t && t.id !== id && !ids.includes(t.id)) return { status: 409, body: { error: `merged:${id} sends that sign-in to ${t.id}, a live account that isn't in this merge. Include ${t.id} in the accounts merged, or merge it first.`, conflict: `merged:${id}`, into: t.id } };
  }

  /* ---------- the merged records ---------- */
  const ctx = { keep, profile, uid, now };
  const built = buildMerged(D, keepA, others, ctx);
  const table = built.table;
  const tooLargeMsg = (n) => `The merged progress snapshot would be ${n.toLocaleString("en-US")} characters, over the ${MERGED_SNAPSHOT_MAX.toLocaleString("en-US")} a trainee's saves can hold: every save of the device that restored it would be refused. Nothing is merged; ask a developer to trim the accounts' progress snapshots first.`;
  if (built.tooLarge) warnings.push(tooLargeMsg(built.progSize));

  /* ---------- what moves, what merges, what stays ---------- */
  const plan = { move: [], left: [], del: [] };
  SINGLE_MOVE.forEach((t) => {
    let has = keepA.keys[`${t}:${keep}`] != null;
    others.forEach((a) => {
      const raw = a.keys[`${t}:${a.id}`]; if (raw == null) return;
      if (keepA.keys[`${t}:${keep}`] === raw) plan.del.push(`${t}:${a.id}`);   // (already copied, by a run that stopped before its deletes)
      else if (has) plan.left.push(`${t}:${a.id}`); else { plan.move.push({ from: `${t}:${a.id}`, key: `${t}:${keep}`, value: raw }); has = true; }
    });
  });
  others.forEach((a) => Object.keys(a.keys).filter((k) => k.startsWith(`actup:${a.id}:`)).forEach((k) => {
    const to = `actup:${keep}:${k.slice(`actup:${a.id}:`.length)}`;
    if (keepA.keys[to] === a.keys[k]) plan.del.push(k);
    else if (keepA.keys[to] != null || plan.move.some((m) => m.key === to)) plan.left.push(k); else plan.move.push({ from: k, key: to, value: a.keys[k] });
  }));
  const keepCheckins = new Set(checkins.filter((k) => k.name.split(":")[2] === keep).map((k) => k.name.split(":")[1]));
  checkins.filter((k) => k.name.split(":")[2] !== keep).forEach((k) => {
    const date = k.name.split(":")[1], mine = checkins.find((x) => x.name === `checkin:${date}:${keep}`);
    if (mine && mine.value === k.value && k.value != null) plan.del.push(k.name);
    else if (keepCheckins.has(date) || k.value == null) plan.left.push(k.name);
    else { keepCheckins.add(date); plan.move.push({ from: k.name, key: `checkin:${date}:${keep}`, value: k.value, opts: { expirationTtl: 40 * 86400, metadata: k.metadata || undefined } }); }
  });
  const certPlan = certs.filter((c) => c.rec.traineeId !== keep).map((c) => c.key);
  const alertsFrom = obj(alerts) ? others.filter((a) => alerts[a.id]).map((a) => a.id) : [];
  // the other ids' keys that are now in the kept account (merged or moved): deleted last
  others.forEach((a) => {
    MAIN.forEach((t) => { if (a.keys[`${t}:${a.id}`] != null || a.keys[D.ownerKey(`${t}:${a.id}`)] != null) plan.del.push(`${t}:${a.id}`); });
    SINGLE_MERGE.forEach((t) => { if (a.keys[`${t}:${a.id}`] != null) plan.del.push(`${t}:${a.id}`); });
  });
  plan.move.forEach((m) => plan.del.push(m.from));
  const redirects = others.map((a) => a.id);
  // (the current name + batch's own id is redirected only from the Portal's signed sign-in, never from a name typed here)
  if (newIdFree && profile.from === "last Portal sign-in") redirects.push(cur.newId);
  else if (newIdFree) warnings.push(`${cur.newId} (the name and batch given here) is not redirected to ${keep}: only the name and batch of the trainee's last Portal sign-in are.`);
  // 🔗 trainee-alias:<id> = keep for each id redirected, and for every alias that led to one of them: the Portal files a
  // simulator result or graded call under the id the trainee's Portal name + batch make, and follows one alias hop
  const aliases = D.aliasPlan ? await D.aliasPlan(kv, redirects, keep) : {};
  const orphanList = [...new Set(accts.flatMap((a) => a.orphans.map((o) => ownOrphan(o) ? o.key : `${o.key} (not folded in: it says it holds ${o.v && o.v.traineeId ? o.v.traineeId + "'s" : "another account's"} work${o.v && o.v.reason === "handover" ? ", left on a shared computer" : ""})`)))];
  const report = {
    keep, keepWhy, others: others.map((a) => a.id), profile, portalUid: uid || null, days: table,
    keys: { write: Object.keys(built.values), move: plan.move.map((m) => `${m.from} → ${m.key}`), left: plan.left, delete: plan.del },
    certs: certPlan, redirects: redirects.map((r) => `merged:${r} → ${keep}`), aliases: Object.entries(aliases).map(([k, a]) => a.to == null ? `${k} removed` : `${k} → ${a.to}`), orphans: orphanList, warnings, snapshotSize: built.progSize, expectKc: built.kcExpect
  };
  if (built.tooLarge) report.tooLarge = true;
  if (!confirm) return { status: 200, body: Object.assign({ dryRun: true }, report) };
  if (built.tooLarge) return { status: 409, body: Object.assign({ error: tooLargeMsg(built.progSize) }, report) };
  if (uids.length > 1 && b.differentPortalIds !== true) return { status: 409, body: Object.assign({ error: "These accounts belong to different Portal accounts. Send differentPortalIds: true to merge them anyway." }, report) };
  // the merge confirmed is the one previewed: the same id kept, and nothing deleted that the preview didn't list
  const expect = Array.isArray(b.expectDelete) ? new Set(b.expectDelete.map(String)) : null;
  // (and the days only the trainee's device scores came out as the trainer saw them: expectKc)
  if (b.expectKeep !== keep || !expect || plan.del.some((k) => !expect.has(k)) || b.expectKc !== built.kcExpect) return { status: 409, body: Object.assign({ error: "The accounts changed since the preview (or no preview was sent): nothing was changed. Preview the merge again, then confirm it.", previewAgain: true }, report) };

  /* ---------- confirmed: redirect, back up, read again, copy, and only then delete ---------- */
  const ts = now.toISOString().replace(/[^0-9]/g, "").slice(0, 17);
  const written = [], backups = [], redirectsWritten = [], aliasesWritten = [], left = plan.left.slice(), skipDel = new Set(), del = plan.del.slice();
  const orig = {};
  others.forEach((a) => Object.assign(orig, a.keys));
  checkins.forEach((k) => { if (k.value != null) orig[k.name] = k.value; });
  let keepRedirectWas = null;
  const redirWas = {}, redirAt = {};
  try {
    // the redirects first: from here on a save to another account is refused (worker.js traineeWrite: a page open on it
    // backs its work up as orphan:<id>:<ms>, which is never deleted), so nothing reaches it that the merge then deletes
    // (and before them, a backup of every redirect they change: merged:<keep>, and each merged:<other> as it is now)
    Object.assign(redirWas, redirRead);
    for (const r of redirects) { const v = await kv.get(`merged:${r}`); if (v != null) redirWas[`merged:${r}`] = v; }
    Object.entries(aliases).forEach(([k, a]) => { if (a.was != null) redirWas[k] = a.was; });   // (the aliases it changes, as they are)
    const rk = `backup:${keep}:${ts}:redirects`;
    await kv.put(rk, JSON.stringify({ at: now.toISOString(), by, keep, merged: ids, kind: "redirects", keys: redirWas }));
    backups.push(rk); written.push(rk);
    if (redirRead[`merged:${keep}`] != null) { keepRedirectWas = redirRead[`merged:${keep}`]; await kv.delete(`merged:${keep}`); }
    for (const r of redirects) {
      // (an earlier run's redirect to the same account stays as it is: its time is when saves to that id stopped, which
      // the deletes wait on, SETTLE_MS)
      const was = parse(redirWas[`merged:${r}`]);
      if (obj(was) && was.into === keep) { redirAt[r] = Date.parse(was.at || "") || 0; continue; }
      await kv.put(`merged:${r}`, JSON.stringify({ into: keep, at: now.toISOString(), by, how: "account-merge" })); redirectsWritten.push(r); written.push(`merged:${r}`); redirAt[r] = now.getTime();
    }
    for (const [k, a] of Object.entries(aliases)) { await D.aliasApply(kv, k, a.to); aliasesWritten.push(k); written.push(k); }
    for (const a of accts) {
      const extra = {};
      checkins.filter((k) => k.name.split(":")[2] === a.id).forEach((k) => { if (k.value != null) extra[k.name] = k.value; });
      certs.filter((c) => c.rec.traineeId === a.id).forEach((c) => { extra[c.key] = JSON.stringify(c.rec); });
      if (a.id === keep) { if (alerts != null) extra["case-alerts:resolved"] = JSON.stringify(alerts); Object.assign(extra, redirRead); }
      const ks = await putBackup(kv, `backup:${a.id}:${ts}`, { at: now.toISOString(), by, keep, merged: ids }, Object.entries(Object.assign({}, a.keys, extra)));
      ks.forEach((k) => { backups.push(k); written.push(k); });
    }
    // every account read again, now that no trainee save reaches the others: a save made since the first read (on the
    // kept account, or on another before its redirect) is backed up and merged in, never written over or deleted
    let values = built.values, keepNow = keepA, othersNow = others;
    const fresh = await Promise.all(accts.map((a) => readAccount(kv, D, a.id)));
    for (const f of fresh) {
      const was = accts.find((a) => a.id === f.id);
      const changed = [...new Set(Object.keys(f.keys).concat(Object.keys(was.keys)))].filter((k) => f.keys[k] !== was.keys[k]);
      // (an orphan backup written meanwhile, by a page whose save the redirect refused, is folded in too: it is never deleted)
      const orphansNew = f.orphans.some((o) => !was.orphans.some((x) => x.key === o.key));
      if (!changed.length && !orphansNew) continue;
      if (changed.length) {
        const ks = await putBackup(kv, `backup:${f.id}:${ts}:fresh`, { at: new Date().toISOString(), by, keep, merged: ids, note: "the keys that changed while the merge read them" }, changed.filter((k) => f.keys[k] != null).map((k) => [k, f.keys[k]]));
        ks.forEach((k) => { backups.push(k); written.push(k); });
      }
      if (!f.keys[`trainee:${f.id}`]) throw new Error(`trainee:${f.id} is gone`);
      if (f.id === keep) { keepNow = f; continue; }
      // the other's merged records (MAIN, SINGLE_MERGE) are built again from what it holds now, so deleting them loses
      // nothing; a key moved (drive, actup, checkin) is still compared with the first read before its delete
      const merges = (k) => MAIN.concat(SINGLE_MERGE).some((t) => k === `${t}:${f.id}` || k === D.ownerKey(`${t}:${f.id}`));
      changed.filter(merges).forEach((k) => {
        orig[k] = f.keys[k];
        const base = MAIN.concat(SINGLE_MERGE).map((t) => `${t}:${f.id}`).find((x) => x === k || D.ownerKey(x) === k);
        if (f.keys[k] != null && !del.includes(base)) del.push(base);
      });
      changed.filter((k) => !merges(k) && was.keys[k] == null).forEach((k) => left.push(k));   // (new since the read: left where it is)
      othersNow = othersNow.map((a) => a.id === f.id ? f : a);   // (buildMerged reads only the merged keys and the orphans)
    }
    if (keepNow !== keepA || othersNow !== others) {
      const again = buildMerged(D, keepNow, othersNow, ctx);
      if (again.tooLarge) throw new Error(tooLargeMsg(again.progSize));
      // (a day only the trainee's device scores that came out otherwise than the trainer confirmed: not written)
      if (again.kcExpect !== built.kcExpect) throw Object.assign(new Error("A Knowledge Check score only the trainee's device holds changed while the merge ran."), { previewAgain: true });
      values = again.values;
    }
    // mergebase:<keep>: what the merge wrote, which a device that hasn't restored it yet is joined with (worker-identity.js)
    const recV = parse(values[`trainee:${keep}`]) || {};
    await kv.put(mergeBaseKey(keep), JSON.stringify({ mergedAt: recV.mergedAt, at: now.toISOString(), by, merged: ids,
      trainee: Object.fromEntries(MERGE_FOLD.filter((f) => recV[f] != null).map((f) => [f, recV[f]])), progress: parse(values[`progress:${keep}`]) || null }));
    written.push(mergeBaseKey(keep));
    for (const [key, value] of Object.entries(values)) {
      // (and a Knowledge Check saved in the moment between: keepKcStored, keepProgressAttempts)
      let v = value;
      if (key === `trainee:${keep}`) v = await D.keepKcStored(kv, key, v);
      if (key === `progress:${keep}`) v = JSON.stringify(D.keepProgressAttempts(parse(await kv.get(key)), JSON.parse(v)));
      if (MAIN.includes(key.split(":")[0])) await D.ownerPut(kv, key, v); else await kv.put(key, v);
      written.push(key);
    }
    // a move goes only where the kept account still has nothing (else the other's stays where it is)
    for (const m of plan.move) {
      const now2 = await kv.get(m.key);
      if (now2 != null && now2 !== m.value) { left.push(m.from); skipDel.add(m.from); continue; }
      if (now2 == null) await kv.put(m.key, m.value, m.opts);
      written.push(m.key);
    }
    // certificates and the Resolved marks: re-read and changed only in what the merge re-keys
    for (const k of certPlan) {
      const c = obj(parse(await kv.get(k)));
      if (!c || !others.some((a) => a.id === c.traineeId)) continue;
      await kv.put(k, JSON.stringify(Object.assign({}, c, { traineeId: keep, traineeIdWas: c.traineeId })));
      written.push(k);
    }
    if (alertsFrom.length) {
      const fa = obj(parse(await kv.get("case-alerts:resolved")));
      if (fa && others.some((a) => fa[a.id])) {
        others.forEach((a) => { if (fa[a.id]) { fa[keep] = Object.assign({}, fa[a.id], fa[keep] || {}); delete fa[a.id]; } });
        await kv.put("case-alerts:resolved", JSON.stringify(fa));
        written.push("case-alerts:resolved");
      }
    }
    if (uid) { await kv.put(D.uidKey(uid), JSON.stringify({ id: keep, name: profile ? profile.name : recOf(keepA).name || "", batch: profile ? profile.batch : recOf(keepA).batch || "", at: now.toISOString(), by: "account-merge" })); written.push(D.uidKey(uid)); }
  } catch (e) {
    // the redirects written are taken back, so the accounts not merged yet keep saving and signing in as before
    const undone = [];
    // (a merged:<other> that was there before the merge is put back as it was, not deleted)
    for (const r of redirectsWritten) { try { const was = redirWas[`merged:${r}`]; if (was != null) await kv.put(`merged:${r}`, was); else await kv.delete(`merged:${r}`); undone.push(`merged:${r}`); } catch (x) { /* listed below as written */ } }
    if (keepRedirectWas != null) { try { await kv.put(`merged:${keep}`, keepRedirectWas); } catch (x) { /* it is in the backup */ } }
    for (const k of aliasesWritten) { try { await D.aliasApply(kv, k, aliases[k].was); undone.push(k); } catch (x) { /* it is in the backup */ } }
    if (e && e.previewAgain) return { status: 409, body: Object.assign({ error: `${e.message} Nothing was merged and the redirects written were taken back. Preview the merge again, then confirm it.`, previewAgain: true, written, backups, redirectsUndone: undone }, report) };
    return { status: 500, body: Object.assign({ error: `The merge stopped before anything was deleted. Every other account's records are still where they were, and the redirects written were taken back. The kept account (${keep}) may already hold merged records (see written): that is safe, they are its own records joined with the others'. The backups are kept. Run the merge again (preview, then merge): every step can be run again.`, written, backups, redirectsUndone: undone, detail: String((e && e.message) || e) }, report) };
  }
  /* ---------- only now the other ids' copied keys are deleted: each one only if it is still as it was read ----------
     and only once its id's redirect is SETTLE_MS old. Workers in other places can read merged:<other> as absent (and a key
     as it was) for up to a minute after it is written, so a save there can still land just after the redirect, unseen
     here. Until then the keys are left (pendingDelete): the merge run again after it reads them fresh, folds in anything
     that landed, and only then deletes them. */
  const failedDeletes = [], changedSinceRead = [], pendingDelete = [];
  const idOfKey = (k) => { const p = k.split(":"); return p[0] === "checkin" ? p[2] : p[1]; };
  const settled = (id) => redirAt[id] != null && Date.now() - redirAt[id] >= SETTLE_MS;
  for (const k of del) {
    if (skipDel.has(k)) continue;
    if (!settled(idOfKey(k))) { pendingDelete.push(k); continue; }
    try {
      const now3 = await kv.get(k);
      if ((now3 == null ? null : now3) !== (orig[k] == null ? null : orig[k])) { changedSinceRead.push(k); continue; }
      if (D.ownedType(k) && (await kv.get(D.ownerKey(k))) !== (orig[D.ownerKey(k)] == null ? null : orig[D.ownerKey(k)])) { changedSinceRead.push(k); continue; }
      await kv.delete(k); if (D.ownedType(k)) await kv.delete(D.ownerKey(k));
    } catch (e) { failedDeletes.push(k); }
  }
  const finishAfter = pendingDelete.length ? new Date(Math.max(...Object.values(redirAt)) + SETTLE_MS).toISOString() : null;
  const msg = [changedSinceRead.length ? `These keys of the other account${others.length > 1 ? "s" : ""} changed after they were read, so they were left where they are: ${changedSinceRead.join(", ")}. Preview the merge again to fold them in.` : "",
    pendingDelete.length ? `The other account${others.length > 1 ? "s'" : "'s"} copied records (${pendingDelete.length} keys) are kept for now: a save made elsewhere in the last moment may not be visible yet. Run this merge again after ${finishAfter} (preview, then merge) to fold in anything that landed and delete them.` : ""].filter(Boolean).join(" ");
  return { status: 200, body: Object.assign({ ok: true, merged: true, backups, failedDeletes, changedSinceRead, pendingDelete, finishAfter, message: msg }, report, { keys: Object.assign({}, report.keys, { left, delete: del.filter((k) => !pendingDelete.includes(k)), pendingDelete }) }) };
}

/* ============================================================
   🛠 Restore missing KC scores: one account's Knowledge Checks that its own progress snapshot (progress:<id>.data
   ["day-progress"]), work-log quiz entries or its own orphan:<id>:<ms> backups (and those of the ids merged into it) hold,
   but trainee:<id> lacks (a sync that failed, a stale save over it). POST /api/kc-restore {id, confirm?, expectKc?}, a
   trainer's only (js/cm-account-repair.js). The confirm names the preview's expectKc (the days restored: each attempt's
   score and date); when they come out otherwise (the trainee wrote a source in between) it is refused (409) unwritten.
     - A DRY RUN unless confirm is true: per day {day, record, recovered, source, changed}. Nothing is written.
     - Only a day with NO attempt on trainee:<id> is filled in. A day the record already scores is left exactly as it is
       (its official score and pass stand), even when the snapshot holds other attempts: those are listed, not added.
     - The day filled in: the snapshot's, the work-log's and the orphan backups' attempts (the same score within 10 minutes
       is one attempt), oldest first; the official score is the first attempt (the best after a trainer's kcReset); done
       when any is 70 or more; caseFlow.days[n].kc and passed are set only where the summary has no score yet.
     - An attempt is never counted with a score outside 0–100, without a date, or dated before the trainee registered or
       after now (the trainee writes every source here); each day restored is marked kcUnverified and its row
       unverified (js/cm-scorecard.js and the trainer's table say so).
     - On confirm: backup:<id>:<ts> holds trainee:<id> as it was read (and as it is just before the write), then the record
       read again is PATCHED: only the days restored, and only where it still has no attempt for them; everything else on
       it (a save made in between included) stays as it is. Only trainee:<id> is written; the rest is only read.
   ============================================================ */
export async function kcRestoreApi(env, D, tok, b) {
  if (!tok || tok.role !== "a") return { status: 403, body: { error: "Only a trainer can restore Knowledge Check scores." } };
  const kv = D.kvOf(env);
  if (!kv) return { status: 500, body: { error: "LSH_KV namespace is not bound on this Worker." } };
  const id = String((b && b.id) || "").trim();
  if (!ID_RE.test(id)) return { status: 400, body: { error: "id: one trainee id." } };
  const confirm = b.confirm === true, now = new Date(), key = `trainee:${id}`;
  let raw, prog, orphans;
  try { raw = await kv.get(key); prog = parse(await kv.get(`progress:${id}`)); orphans = (await accountOrphans(kv, D, id, parse(raw))).filter((o) => ownOrphan(o)); }
  catch (e) { return { status: 503, body: { error: "A record couldn't be read, so nothing was changed. Try again.", detail: String((e && e.message) || e) } }; }
  if (raw == null) return { status: 404, body: { error: `No trainee record for ${id}.` } };
  const rec = parse(raw);
  if (!obj(rec)) return { status: 409, body: { error: "The trainee record couldn't be read as a record, so nothing was changed." } };
  const data = obj(prog && prog.data) || {}, snap = obj(data["day-progress"]) || {};
  const datas = [{ label: `progress:${id}`, data }].concat(orphans.map((o) => ({ label: o.key, data: o.v.data })));
  const days = new Set();
  datas.forEach(({ data: x }) => {
    const sp = obj(x["day-progress"]) || {};
    Object.keys(sp).filter((d) => obj(sp[d]) && D.kcHistory(sp[d]).length).forEach((d) => days.add(d));
    (Array.isArray(x["work-log"]) ? x["work-log"] : []).forEach((e) => { if (e && e.kind === "quiz" && e.dayId != null && typeof e.score === "number") days.add(String(e.dayId)); });
  });
  const dp = Object.assign({}, obj(rec.dayProgress) || {}), table = [];
  const reg = Date.parse(rec.registeredAt || ""), window = { from: Number.isFinite(reg) ? reg - TEN_MIN : 0, to: now.getTime() + TEN_MIN };
  [...days].sort((x, y) => Number(x) - Number(y) || x.localeCompare(y)).forEach((d) => {
    const was = obj(dp[d]), sources = datas.map(({ label, data: x }) => ({ label, p: obj((obj(x["day-progress"]) || {})[d]), log: logIn(x, d) }));
    if (was && D.kcHistory(was).length) {
      table.push({ day: d, record: summary(was), recovered: summary(was), source: "—", changed: false, note: "the record already has this day's score: left as it is" });
      return;
    }
    const res = mergeDay(sources, !!(obj(rec.kcReset) && rec.kcReset[d]), D.kcHistory, window);
    if (!res) return;
    if (res.none) { table.push({ day: d, record: summary(was), recovered: summary(was), source: "—", changed: false, note: rejectedNote(res.rejected) }); return; }
    const kc = res;
    // (the device's own day, but never its score, pass or attempts: only the attempts counted)
    const own = obj(snap[d]) ? Object.assign({}, snap[d]) : null;
    if (own) ["score", "done", "history", "date", "kcAttempts"].forEach((f) => delete own[f]);
    const day = Object.assign(mergeVals(was ? Object.assign({}, was) : null, own) || {}, { history: kc.history, score: kc.score, done: kc.done, date: kc.date, kcUnverified: true });
    dp[d] = day;
    // ⚠ every score restored here was written by the trainee's device: the trainer confirms it knowing that
    table.push({ day: d, record: summary(was), recovered: summary(day), source: [...new Set(kc.from)].join(", "), changed: true, unverified: true,
      note: ["Unverified: only the trainee's device wrote this score (the record has none).", rejectedNote(kc.rejected)].filter(Boolean).join(" ") });
  });
  const changed = table.filter((r) => r.changed);
  const report = { id, name: rec.name || "", batch: rec.batch || "", days: table, write: changed.length ? [key] : [], expectKc: JSON.stringify(changed.map((r) => kcPrint(r.day, dp[r.day]))) };
  if (!confirm || !changed.length) return { status: 200, body: Object.assign({ dryRun: !confirm, nothingToRestore: !changed.length }, report) };
  // (the scores restored are the ones the trainer previewed: the trainee can write every source here in between)
  if (b.expectKc !== report.expectKc) return { status: 409, body: Object.assign({ error: "The scores to restore changed since the preview (or no preview was sent): nothing was changed. Preview the restore again, then confirm it.", previewAgain: true }, report) };

  const by = D.trainerWho(tok), bk = `backup:${id}:${now.toISOString().replace(/[^0-9]/g, "").slice(0, 17)}`;
  const restored = [];
  try {
    // the record as it is now: the days restored go in only where it still has no attempt, nothing else is touched
    const head = { at: now.toISOString(), by, kind: "kc-restore" };
    await kv.put(bk, JSON.stringify(Object.assign({}, head, { keys: { [key]: raw } })));
    const freshRaw = await kv.get(key), fresh = obj(parse(freshRaw));
    if (!fresh) return { status: 409, body: Object.assign({ error: "The trainee record is gone or unreadable now: nothing was written." }, report) };
    if (freshRaw !== raw) await kv.put(bk, JSON.stringify(Object.assign({}, head, { keys: { [key]: raw, [`${key} (just before the restore)`]: freshRaw } })));
    const fdp = Object.assign({}, obj(fresh.dayProgress) || {});
    changed.forEach((r) => { if (!(obj(fdp[r.day]) && D.kcHistory(fdp[r.day]).length)) { fdp[r.day] = Object.assign({}, obj(fdp[r.day]) || {}, dp[r.day]); restored.push(r.day); } });
    if (!restored.length) return { status: 200, body: Object.assign({ nothingToRestore: true, note: "The record got these days' scores in the meantime: nothing was written." }, report) };
    const next = Object.assign({}, fresh, { dayProgress: fdp });
    if (obj(fresh.caseFlow) && obj(fresh.caseFlow.days)) {
      const cd = {};
      Object.entries(fresh.caseFlow.days).forEach(([n, v]) => {
        const p = obj(v) && v.id != null && restored.includes(String(v.id)) ? fdp[String(v.id)] : null;
        cd[n] = p && typeof v.kc !== "number" ? Object.assign({}, v, { kc: p.score, passed: !!(v.passed || p.done) }) : v;
      });
      next.caseFlow = Object.assign({}, fresh.caseFlow, { days: cd });
    }
    await D.ownerPut(kv, key, await D.keepKcStored(kv, key, JSON.stringify(next)));
  } catch (e) {
    return { status: 500, body: Object.assign({ error: "The restore stopped: the record may not have been written. Nothing was deleted.", detail: String((e && e.message) || e) }, report) };
  }
  return { status: 200, body: Object.assign({ ok: true, restored, backup: bk }, report) };
}

/* 🔁 FINISH WHAT A MERGE LEFT: the other account removed by itself, no second run by hand.
   A confirmed merge leaves the other account's copied keys for SETTLE_MS (a save elsewhere may not be visible yet: see
   step 5 above), then deletes them when it is run again. The trainer's page runs it again by itself once that time is up
   (js/cm-account-repair.js); this is the backstop for a page closed before then, called from the Worker's hourly run.
   For each merged:<other> = {into, how: "account-merge"} older than SETTLE_MS whose trainee:<other> is still there (and
   trainee:<into> too), it runs the same merge again the safe way: a dry run of [into, other], and only when that dry run
   keeps `into`, the confirm of exactly what it showed (expectKeep, expectDelete, expectKc). Anything else is left for a
   trainer (🛠 Account Repair lists it as "Merge not finished"). At most `max` merges a run. Returns what it did. */
export async function finishPendingMerges(env, D, max = 3) {
  const kv = D.kvOf(env); if (!kv) return { finished: [], skipped: [] };
  const tok = { role: "a", id: "admin:Automatic merge finish" }, finished = [], skipped = [];
  for (const k of await listKeys(kv, "merged:")) {
    if (finished.length + skipped.length >= max) break;
    const other = String(k.name || "").slice(7); if (!ID_RE.test(other)) continue;
    let m = null; try { m = JSON.parse((await kv.get(k.name)) || "null"); } catch (e) { m = null; }
    if (!m || m.how !== "account-merge" || !m.into || m.into === other || !(Date.now() - Date.parse(m.at || "") >= SETTLE_MS)) continue;
    if ((await kv.get(`trainee:${other}`)) == null || (await kv.get(`trainee:${m.into}`)) == null) continue;
    try {
      const dry = await accountMergeApi(env, D, tok, { ids: [m.into, other], keep: m.into });
      if (dry.status !== 200 || !dry.body.dryRun || dry.body.keep !== m.into) { skipped.push({ other, into: m.into, why: (dry.body && dry.body.error) || `the dry run keeps ${dry.body && dry.body.keep}` }); continue; }
      const r = await accountMergeApi(env, D, tok, { ids: [m.into, other], keep: m.into, confirm: true, expectKeep: dry.body.keep, expectDelete: ((dry.body.keys || {}).delete || []).slice(), expectKc: dry.body.expectKc, differentPortalIds: true });
      if (r.status === 200 && r.body.ok) finished.push({ other, into: m.into, left: (r.body.pendingDelete || []).length });
      else skipped.push({ other, into: m.into, why: (r.body && r.body.error) || `status ${r.status}` });
    } catch (e) { skipped.push({ other, into: m.into, why: String((e && e.message) || e).slice(0, 200) }); }
  }
  return { finished, skipped };
}
