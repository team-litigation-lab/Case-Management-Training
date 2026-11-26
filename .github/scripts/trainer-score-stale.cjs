// @check node — 🏅 A trainer's 40% (feedback:<id>.caseFlow) survives a trainee's write to feedback:<id> made from a copy read before the trainer saved (KV reads can be up to 60 s stale), so the record's t and Composite stay the trainer's
// worker.js OWNED.feedback: the trainer's part of feedback:<id> is kept in feedback-admin:<id> (ownerPut) and laid back over
// every read. The days' reviews were, and now so is caseFlow, the only source of each module's t (trainerScoresOf).
//   1. the trainer saves caseFlow.<module>.score: it is in the trainer's own copy;
//   2. the trainee's routine write (a read mark) lands on an edge whose read of feedback:<id> is still the copy from before:
//      the trainer's score is still there afterwards, read as the admin and as stored;
//   3. the trainee's next save of trainee:<id> keeps the module's t and c from that score.
// Usage: node .github/scripts/trainer-score-stale.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const { picksFor, KC_KEY } = require('./kc-picks.cjs');
const R = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    const me = await h.portal('Stale', 'Read', 'B100926'), id = me.body && me.body.id, tok = me.body && me.body.token;
    if (me.status !== 200 || !tok) { console.log(`the trainee should sign in: ${JSON.stringify(me)}`); process.exit(1); }
    await h.set('feedback:' + id, { days: { 1: { text: 'auto', auto: true } } }, tok);
    const m1 = KC_KEY['11'].mod[0];   // Day 11's first module
    const before = h.store.get('cm:feedback:' + id);   // the copy a stale edge still serves

    // 1. the trainer's 40%
    const fb = await h.get('feedback:' + id); fb.caseFlow = { [m1]: { score: 85, at: '2026-11-19T10:00:00.000Z' } };
    await h.set('feedback:' + id, fb);
    const own = h.raw('feedback-admin:' + id);
    R.check(own && own.caseFlow && own.caseFlow[m1] && own.caseFlow[m1].score === 85, `the trainer's caseFlow score should be in feedback-admin:<id>: ${JSON.stringify(own)}`);

    // 2. one stale read of feedback:<id> for the trainee's write
    const get = h.env.LSH_KV.get; let once = true;
    h.env.LSH_KV.get = async (k) => (once && k === 'cm:feedback:' + id ? (once = false, before) : get(k));
    const w = await h.set('feedback:' + id, { days: { 1: { text: 'auto', auto: true, readAt: '2026-11-19T10:01:00.000Z' } } }, tok);
    h.env.LSH_KV.get = get;
    R.check(w.status === 200, `the trainee's write should be taken: ${JSON.stringify(w)}`);
    R.check(!once, 'the probe should have served the stale copy once');
    const asAdmin = await h.get('feedback:' + id), stored = h.raw('feedback:' + id);
    R.check(asAdmin && asAdmin.caseFlow && asAdmin.caseFlow[m1] && asAdmin.caseFlow[m1].score === 85, `after a stale trainee write the admin should still read the trainer's 85: ${JSON.stringify(asAdmin)}`);
    R.check(stored && stored.caseFlow && stored.caseFlow[m1] && stored.caseFlow[m1].score === 85, `the stored feedback:<id> should keep the trainer's 85: ${JSON.stringify(stored)}`);
    // (and the trainee can't set it)
    await h.set('feedback:' + id, { days: {}, caseFlow: { [m1]: { score: 100 } } }, tok);
    R.check(((((await h.get('feedback:' + id)) || {}).caseFlow || {})[m1] || {}).score === 85, "a trainee's write should not change the trainer's score");

    // 3. the record's t and c
    const key = 'trainee:' + id, cur = await h.get(key);
    const at = new Date().toISOString();
    await h.set(key, Object.assign({}, cur, { dayProgress: { 11: { score: 75, done: true, date: at, history: [{ score: 75, passed: true, date: at, answers: picksFor(11, 75) }] } } }), tok);
    await h.set(key, Object.assign({}, await h.get(key), { caseFlow: { at, days: { 1: { id: 11, modules: { [m1]: { a: 100, t: 0, c: 0, ai: 50 } } } } } }), tok);
    const m = (((await h.get(key)).caseFlow || {}).days || {})[1];
    const mod = m && m.modules && m.modules[m1];
    R.check(mod && mod.t === 85 && typeof mod.a === 'number' && mod.c === Math.round(mod.a * 0.6 + 85 * 0.4), `the record's module should carry the trainer's t 85 and its Composite: ${JSON.stringify(m)}`);

    R.done("trainer-score-stale: a trainer's 40% survives a trainee's write from a stale copy, and stays the record's t and Composite.");
})().catch((e) => { console.error(e); process.exit(1); });
