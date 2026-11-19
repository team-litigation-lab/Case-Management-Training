// @check node — An admin write of a stale trainee record keeps a Knowledge Check attempt stored after it was read (keepKcStored), and the trainer's own change still lands
// The admin pages write whole trainee records they read earlier (✨ Generate AI review, archive or restore a batch,
// approve, unlock): a Knowledge Check the trainee submitted in between used to be erased. worker.js /api/storage/set now
// keeps, for an admin's write of trainee:<id>:
//   1. a day the trainer's copy lacks: the stored day, whole (score, done, date, history, and its other fields);
//   2. a day the copy has with fewer attempts (a retake after a 🔁 reset): the stored attempts added, the stored score
//      and pass standing;
//   3. the Case Flow summary (caseFlow) when the stored one is newer;
//   4. the trainer's own change (here an AI review and an approval) lands as written, and a copy that already holds every
//      stored attempt (a 👥 merge's, which adds some) is written as it is;
//   5. only a deliberate replacement (replaceKc: true) clears a day.
// Usage: node .github/scripts/admin-kc-keep.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
(async () => {
    const h = await harness();
    const t = (await h.api('/api/auth/trainee', { name: 'Kim Keep', batch: 'B100926' })).body;
    const key = 'trainee:' + t.id, at = (m) => new Date(Date.now() + m * 60000).toISOString();
    await h.set(key, { id: t.id, name: 'Kim Keep', batch: 'B100926' }, t.token);
    await h.set(key, Object.assign(await h.get(key), { approved: true }));
    // the trainer's page reads the record (no Knowledge Check yet)
    const stale = await h.get(key);
    // the trainee submits Day 12's Knowledge Check, and the Case Flow summary with it
    const d12 = { score: 85, done: true, date: at(-5), history: [{ score: 85, passed: true, date: at(-5) }], surpriseTaskScore: 70 };
    await h.set(key, Object.assign({}, stale, { dayProgress: { 12: d12 }, caseFlow: { at: at(-5), days: { 2: { id: 12, kc: 85, passed: true } } } }), t.token);
    R.check(((await h.get(key)).dayProgress || {})[12], 'the trainee\'s Knowledge Check should be stored');
    // 1, 3, 4. the trainer's stale copy lands
    await h.set(key, Object.assign({}, stale, { aiReview: { text: 'Good work', at: at(0) } }));
    let r = await h.get(key);
    R.check(r.aiReview && r.aiReview.text === 'Good work', 'the trainer\'s AI review should land');
    R.check(r.dayProgress && r.dayProgress[12] && r.dayProgress[12].score === 85 && r.dayProgress[12].done === true && r.dayProgress[12].history.length === 1 && r.dayProgress[12].surpriseTaskScore === 70, `a stale admin copy should keep the stored day: ${JSON.stringify(r.dayProgress)}`);
    R.check(r.caseFlow && r.caseFlow.days && r.caseFlow.days[2] && r.caseFlow.days[2].kc === 85, `a stale admin copy should keep the newer Case Flow summary: ${JSON.stringify(r.caseFlow)}`);

    // 2. a retake after a reset, then a stale copy holding only the first attempt
    await h.set(key, Object.assign({}, r, { dayProgress: Object.assign({}, r.dayProgress, { 13: { score: 50, done: false, date: at(-4), history: [{ score: 50, passed: false, date: at(-4) }] } }) }), t.token);
    const copy = await h.get(key);
    R.check((await h.api('/api/kc-reset', { traineeId: t.id, dayId: 13 }, h.admin)).status === 200, 'the trainer should reset Day 13');
    const now = await h.get(key);
    await h.set(key, Object.assign({}, now, { dayProgress: Object.assign({}, now.dayProgress, { 13: { score: 90, done: true, date: at(-1), history: now.dayProgress[13].history.concat([{ score: 90, passed: true, date: at(-1) }]) } }) }), t.token);
    R.check((await h.get(key)).dayProgress[13].history.length === 2, 'the retake should be stored');
    await h.set(key, Object.assign({}, copy, { approved: true, unlockedDays: [14] }));
    r = await h.get(key);
    R.check(r.dayProgress[13].history.length === 2 && r.dayProgress[13].score === 90 && r.dayProgress[13].done === true, `a copy from before the retake should keep it (two attempts, 90, passed): ${JSON.stringify(r.dayProgress[13])}`);
    R.check(Array.isArray(r.unlockedDays) && r.unlockedDays[0] === 14, 'the trainer\'s unlock should land');
    R.check(r.kcReset && r.kcReset[13], 'the reset should stay (keepKcResets)');

    // 4. a copy that holds every stored attempt and adds one (a merge's) is written as it is
    const more = JSON.parse(JSON.stringify(r));
    more.dayProgress[12].history.unshift({ score: 60, passed: false, date: at(-600) });
    more.dayProgress[12].score = 60;
    await h.set(key, more);
    r = await h.get(key);
    R.check(r.dayProgress[12].history.length === 2 && r.dayProgress[12].score === 60, `a copy that adds attempts should be written as it is: ${JSON.stringify(r.dayProgress[12])}`);

    // 5. a deliberate replacement
    await h.set(key, Object.assign({}, r, { dayProgress: {} }), h.admin, { replaceKc: true });
    r = await h.get(key);
    R.check(!r.dayProgress[12] && !r.dayProgress[13], 'a replaceKc write should clear the days');

    R.done('Admin writes keep the Knowledge Checks stored since the trainer\'s copy was read (and the newer Case Flow summary); the trainer\'s own change lands; replaceKc replaces.');
})().catch((e) => { console.error(e); process.exit(1); });
