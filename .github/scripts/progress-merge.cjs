// @check node — A progress:<id> write keeps the stored day-progress attempts the incoming snapshot lacks, and is stamped with the Worker's time (serverAt), the device's savedAt untouched
// cloudSaveNow (index.html) uploads the device's whole snapshot, so a stale device (two open, or one a 👥 merge hasn't
// reached) dropped a Knowledge Check another one saved. worker.js traineeWrite (keepProgressAttempts) now:
//   1. keeps a stored day the incoming snapshot lacks (score, done, history);
//   2. adds the stored attempts a day in the snapshot lacks (the same score within 10 minutes is one attempt), done if
//      either passed, the best score;
//   3. takes everything else from the incoming snapshot (the newest device's notes win, as before);
//   4. stamps serverAt with the Worker's clock and leaves savedAt as the device sent it (cloudRestore compares that with the
//      device's own lsh_progress-saved-at, so a server time there would restore over a device's unsaved work);
//   5. still refuses a snapshot over 2,000,000 characters and a write from a merged-away id;
//   6. an orphan:<own id>:<ms> backup is taken once, only under the trainee's own id, dated within 7 days, at most 20 per id.
// Usage: node .github/scripts/progress-merge.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
(async () => {
    const h = await harness();
    const t = (await h.api('/api/auth/trainee', { name: 'Pat Two', batch: 'B100926' })).body;
    const key = 'progress:' + t.id, at = (m) => new Date(Date.now() + m * 60000).toISOString();
    const snap = (savedAt, dp, notes) => ({ traineeId: t.id, savedAt, data: { 'day-progress': dp, notes } });
    // device A: Day 11's Knowledge Check
    const a11 = { score: 80, done: true, date: at(-30), history: [{ score: 80, passed: true, date: at(-30) }] };
    R.check((await h.set(key, snap(at(-29), { 11: a11 }, 'A'), t.token)).status === 200, 'device A should save');
    // device B, stale: no Day 11, its own notes
    const bAt = at(-20);
    const before = Date.now();
    await h.set(key, snap(bAt, { 12: { score: 40, done: false, date: at(-21), history: [{ score: 40, passed: false, date: at(-21) }] } }, 'B'), t.token);
    let s = h.raw(key);
    R.check(s.data['day-progress'][11] && s.data['day-progress'][11].score === 80 && s.data['day-progress'][11].done === true, `a stale snapshot should keep the stored Day 11: ${JSON.stringify(s.data['day-progress'])}`);
    R.check(s.data['day-progress'][12] && s.data['day-progress'][12].score === 40, 'the incoming Day 12 should be written');
    R.check(s.data.notes === 'B', 'everything else should come from the incoming snapshot');
    R.check(s.savedAt === bAt, `savedAt should stay the device's own: ${s.savedAt} / ${bAt}`);
    R.check(Date.parse(s.serverAt) >= before - 5 && Date.parse(s.serverAt) <= Date.now() + 5, `serverAt should be the Worker's clock: ${s.serverAt}`);
    // 2. device A again, without Day 12's attempt but with a different Day 12 attempt
    await h.set(key, snap(at(-10), { 11: a11, 12: { score: 75, done: true, date: at(-11), history: [{ score: 75, passed: true, date: at(-11) }] } }, 'A2'), t.token);
    s = h.raw(key);
    const d12 = s.data['day-progress'][12];
    R.check(d12.history.length === 2 && d12.done === true && d12.score === 75 && d12.history[0].score === 40, `the two devices' Day 12 attempts should both be kept, oldest first: ${JSON.stringify(d12)}`);
    // the same attempt in both (a few minutes apart in the date): one attempt
    await h.set(key, snap(at(-9), { 11: { score: 80, done: true, date: at(-28), history: [{ score: 80, passed: true, date: at(-28) }] }, 12: d12 }, 'A3'), t.token);
    s = h.raw(key);
    R.check(s.data['day-progress'][11].history.length === 1, `the same attempt dated two minutes apart should stay one: ${JSON.stringify(s.data['day-progress'][11])}`);
    // a snapshot with no day-progress at all keeps every stored day
    await h.set(key, { traineeId: t.id, savedAt: at(-8), data: { notes: 'C' } }, t.token);
    s = h.raw(key);
    R.check(s.data['day-progress'] && s.data['day-progress'][11] && s.data['day-progress'][12], 'a snapshot without day-progress should keep the stored days');
    // 5. the old refusals stand
    const big = await h.api('/api/storage/set', { key, value: JSON.stringify({ traineeId: t.id, data: { notes: 'x'.repeat(2000001) } }) }, t.token);
    R.check(big.status === 403, 'a snapshot over 2,000,000 characters should still be refused');
    h.rawPut('merged:' + t.id, { into: 'someone-else' });
    const m = await h.set(key, snap(at(-1), {}, 'D'), t.token);
    R.check(m.status === 403 && h.raw(key).data.notes === 'C', 'a merged-away id\'s save should still be refused');

    // 6. orphan:<own id>:<ms> (a device's backup, js/cm-safe-logout.js): own id only, written once, the ms within 7 days of
    //    the Worker's clock, and at most 20 per id
    const u = (await h.api('/api/auth/trainee', { name: 'Ola Orphan', batch: 'B100926' })).body;
    const ok1 = await h.api('/api/storage/set', { key: `orphan:${u.id}:${Date.now()}`, value: '{"data":{}}' }, u.token);
    R.check(ok1.status === 200, `a trainee's own backup should be taken: ${JSON.stringify(ok1)}`);
    R.check((await h.api('/api/storage/set', { key: `orphan:${t.id}:${Date.now()}`, value: '{}' }, u.token)).status !== 200, 'another id\'s backup should be refused');
    R.check((await h.api('/api/storage/set', { key: `orphan:${u.id}:${Date.now() - 8 * 86400000}`, value: '{}' }, u.token)).status !== 200, 'a backup dated more than 7 days off should be refused');
    let n = 1;
    for (let i = 1; i < 25; i++) if ((await h.api('/api/storage/set', { key: `orphan:${u.id}:${Date.now() + i}`, value: '{}' }, u.token)).status === 200) n++;
    R.check(n === 20 && h.ids(`orphan:${u.id}:`).length === 20, `at most 20 backups per id: ${n}`);

    R.done('Progress snapshots keep the stored Knowledge Check attempts a stale device lacks, take everything else from the device, and carry the Worker\'s time (serverAt).');
})().catch((e) => { console.error(e); process.exit(1); });
