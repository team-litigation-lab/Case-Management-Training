// @check node — 🏅 A trainer's save of the 40% (feedback:<id>.caseFlow) never writes trainee:<id> back from a copy a stale edge served, so the trainee's newer Knowledge Check and work survive; the 40% still reads on the record at once, and a trainer's own write of the record stands
// worker.js: the trainer's save is stamped (caseFlowAt, in feedback-admin:<id>) and laid over every read of trainee:<id>
// (worker-identity.js layTrainerScores); the trainee's next save records it (caseFlow.tFrom names the save it came from).
//   1. the trainee saves Day 11, then Day 12's Knowledge Check and other work; a stale edge still serves the older record;
//   2. the trainer saves feedback:<id>.caseFlow.<m1>.score = 80: the stored record still has Day 12 and the work;
//   3. read as the admin (and as the trainee) the record's module carries t 80 and its Composite at once;
//   4. the trainee's next save records t 80 in the stored record itself (what the Portal reads straight from KV);
//   5. a trainer's own write of the record's t stands, and a later trainer save of feedback is laid over it again.
// Usage: node .github/scripts/trainer-save-no-rollback.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const { picksFor, KC_KEY } = require('./kc-picks.cjs');
const R = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    const me = await h.portal('Roll', 'Back', 'B100926', 'U-rb'), id = me.body && me.body.id, tok = me.body && me.body.token, key = 'trainee:' + id;
    if (me.status !== 200 || !tok) { console.log(`the trainee should sign in: ${JSON.stringify(me)}`); process.exit(1); }
    const at = new Date().toISOString(), m1 = KC_KEY['11'].mod[0];
    const att = (d, s) => ({ score: s, done: true, date: at, history: [{ score: s, passed: true, date: at, answers: picksFor(d, s) }] });
    await h.set(key, Object.assign({}, await h.get(key), { dayProgress: { 11: att(11, 75) }, caseFlow: { at, days: { 1: { id: 11, modules: { [m1]: { ai: 50 } } } } } }), tok);
    const stale = h.store.get('cm:' + key);
    const cur = await h.get(key);
    await h.set(key, Object.assign({}, cur, { dayProgress: Object.assign({}, cur.dayProgress, { 12: att(12, 85) }), someWork: 'saved after the stale copy' }), tok);
    R.check(h.raw(key).dayProgress[12] && h.raw(key).someWork, `the trainee's newer save should be stored: ${JSON.stringify(h.raw(key))}`);

    // 2. the trainer's save, while every read of trainee:<id> is the stale copy
    const get = h.env.LSH_KV.get;
    h.env.LSH_KV.get = async (k) => (k === 'cm:' + key ? stale : get(k));
    const fb = (await h.get('feedback:' + id)) || { days: {} };
    const r = await h.set('feedback:' + id, Object.assign({}, fb, { caseFlow: { [m1]: { score: 80 } } }));
    h.env.LSH_KV.get = get;
    R.check(r.status === 200, `the trainer's save should be taken: ${JSON.stringify(r)}`);
    const after = h.raw(key);
    R.check(after.dayProgress[12] && after.dayProgress[12].score === 85 && after.someWork === 'saved after the stale copy', `the trainer's save should not roll back the trainee's newer work: ${JSON.stringify(after)}`);

    // 3. at once, on every read
    const mod = (rec) => (((((rec || {}).caseFlow || {}).days || {})[1] || {}).modules || {})[m1];
    const asTrainee = async (k) => { const x = await h.api('/api/storage/get', { key: k }, tok); return x.body && x.body.value != null ? JSON.parse(x.body.value) : null; };
    const a = mod(await h.get(key)), mine = mod(await asTrainee(key));
    R.check(a && a.t === 80 && typeof a.a === 'number' && a.c === Math.round(a.a * 0.6 + 80 * 0.4), `the admin's read should carry the trainer's 80 and its Composite: ${JSON.stringify(a)}`);
    R.check(mine && mine.t === 80, `the trainee's read should carry the trainer's 80: ${JSON.stringify(mine)}`);

    // 4. the trainee's next save records it
    await h.set(key, Object.assign({}, await asTrainee(key), { caseFlow: { at: new Date().toISOString(), days: { 1: { id: 11, modules: { [m1]: { a: 100, t: 0, c: 0, ai: 50 } } } } } }), tok);
    const raw = mod(h.raw(key));
    R.check(raw && raw.t === 80 && raw.c === Math.round(raw.a * 0.6 + 80 * 0.4), `the stored record should carry the trainer's 80 after the trainee's next save: ${JSON.stringify(raw)}`);

    // 5. a trainer's write of the record stands; their next feedback save is laid over it
    const rec = await h.get(key);
    rec.caseFlow.days[1].modules[m1] = Object.assign({}, rec.caseFlow.days[1].modules[m1], { t: 90, c: 81 });
    await h.set(key, rec);
    R.check(mod(await h.get(key)).t === 90, `a trainer's write of the record should stand: ${JSON.stringify(mod(await h.get(key)))}`);
    await h.set('feedback:' + id, Object.assign({}, await h.get('feedback:' + id), { caseFlow: { [m1]: { score: 60 } } }));
    R.check(mod(await h.get(key)).t === 60, `a later trainer save of feedback should be laid over it: ${JSON.stringify(mod(await h.get(key)))}`);

    R.done("trainer-save-no-rollback: a trainer's 40% never rolls back the trainee's record, reads at once, and the trainee's next save records it.");
})().catch((e) => { console.error(e); process.exit(1); });
