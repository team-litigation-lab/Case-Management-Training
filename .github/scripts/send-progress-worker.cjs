// @check node — 📤 A progress report a trainer sends stays the trainer's: a trainee's own save of feedback:<id> (their auto-review, a stale copy without the report, or one that rewrites it) never changes or drops it, the trainee reads it, and their read mark lives in their own progress
// worker.js OWNED.feedback keeps feedback:<id>'s reports (js/cm-send-progress.js) in the trainer's part (feedback-admin:<id>),
// as it does a day's sent review: every read lays them back over the record, and the trainee's write path only ever takes
// their own days from what they send. The trainee's "read" mark is theirs, in progress:<id>.data["progress-reports-read"].
// Usage: node .github/scripts/send-progress-worker.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
(async () => {
    const h = await harness();
    const t = (await h.api('/api/auth/trainee', { name: 'Rae Report', batch: 'B100926' })).body;
    const key = 'feedback:' + t.id;
    // the trainee's own auto-review of a day, then (a minute later, from a copy read before) the trainer's report
    await h.set(key, { days: { 11: { status: 'draft', summary: 'my auto-review' } } }, t.token);
    const stale = await h.get(key);
    const rep = { id: 'rp1', at: new Date().toISOString(), by: 'Coach', snapshot: { overall: 81, result: 'PASS', days: [], missing: [] }, note: 'Good work on Day 1.' };
    await h.set(key, Object.assign({}, stale, { reports: [rep] }));
    let fb = await h.get(key);
    R.check(fb.reports && fb.reports.length === 1 && fb.reports[0].note === 'Good work on Day 1.', `the trainer's report should be stored: ${JSON.stringify(fb.reports)}`);
    R.check(fb.days[11] && fb.days[11].summary === 'my auto-review', 'the trainee\'s own review should stay beside it');
    // the trainee reads it
    const mine = await h.api('/api/storage/get', { key }, t.token), mv = JSON.parse(mine.body.value || 'null');
    R.check(mv && mv.reports && mv.reports[0].id === 'rp1', `the trainee should read the report: ${JSON.stringify(mv && mv.reports)}`);
    // the trainee saves a stale copy (no reports), then one that rewrites the report and adds a forged one
    await h.set(key, { days: { 12: { status: 'draft', summary: 'day 2 auto-review' } } }, t.token);
    await h.set(key, { days: {}, reports: [Object.assign({}, rep, { note: 'forged' }), { id: 'rp-fake', note: 'from the trainee' }] }, t.token);
    fb = await h.get(key);
    R.check(fb.reports && fb.reports.length === 1 && fb.reports[0].note === 'Good work on Day 1.', `a trainee's save should never change or drop the trainer's report: ${JSON.stringify(fb.reports)}`);
    R.check(fb.days[12] && fb.days[12].summary === 'day 2 auto-review', 'the trainee\'s later review should land');
    // even if the base record lost them (a stale KV read), the trainer's part lays them back
    const base = h.raw(key); delete base.reports; h.rawPut(key, base);
    fb = await h.get(key);
    R.check(fb.reports && fb.reports[0] && fb.reports[0].id === 'rp1', `the trainer's part should lay the reports back over the record: ${JSON.stringify(fb.reports)}`);
    // the read mark: the trainee's own progress
    await h.set('progress:' + t.id, { data: { 'progress-reports-read': { rp1: '2026-11-20T10:00:00Z' } } }, t.token);
    const p = await h.get('progress:' + t.id);
    R.check(p && p.data && p.data['progress-reports-read'] && p.data['progress-reports-read'].rp1, `the trainee's read mark should be kept on their progress: ${JSON.stringify(p && p.data)}`);
    R.done('📤 A sent progress report stays the trainer\'s: the trainee reads it, their saves (stale, rewritten or forged) never change it, and their read mark is their own.');
})().catch(e => { console.error(e); process.exit(1); });
