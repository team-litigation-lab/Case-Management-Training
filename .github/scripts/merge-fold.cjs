// @check node — 👥 After an account merge, a device that hasn't restored it is folded in the same way every time (never growing, its own removals kept), told to restore; a trainer's KC reset stays open or used; impossible or device-only scores are never official
// worker-identity.js afterMerge / afterMergeProgress and worker-account-repair.js accountMergeApi, on the Worker:
//   1. the merge stamps mergedAt on trainee:<keep> and progress:<keep>, and keeps what it wrote in mergebase:<keep>;
//   2. a stale device's save (no mergeSeen / mergedAt) keeps what the merge folded in and is answered {mergePending};
//      its saves are joined with mergebase, not the stored copy: ten saves of a changed list entry don't grow the snapshot,
//      and an item the device itself added and then removed is gone;
//   3. a save that names the merge (mergeSeen on trainee:<id>, mergedAt on progress:<id>) is written as it is, unanswered;
//   4. a fold that would be over 2 MB isn't made (the device's own copy is stored, marked mergeFoldSkipped, and the device
//      is NOT told to restore it: it isn't the merged copy);
//   5. kcReset[d].n is set so an open reset stays open and a used one stays used, whatever the merge did to the attempts;
//   6. a device's attempt with a score over 100 or a date before registration / in the future isn't counted, a device's
//      "done" alone doesn't pass a day, and a day scored only by a device is marked unverified in the dry run's table.
// Usage: node .github/scripts/merge-fold.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
const T = (d, h = 10, m = 0) => `2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00.000Z`;
(async () => {
    const h = await harness({ portalOnly: true });
    const merge = (body) => h.api('/api/account-merge', body, h.admin);
    const confirmed = async (body) => { const d = await merge(Object.assign({}, body, { confirm: false })); return { dry: d, done: await merge(Object.assign({}, body, { confirm: true, expectKeep: d.body && d.body.keep, expectDelete: d.body && d.body.keys && d.body.keys.delete, expectKc: d.body && d.body.expectKc })) }; };
    const H = (s, d, hh = 10, m = 0) => ({ score: s, passed: s >= 70, date: T(d, hh, m) });

    // two accounts of one trainee; the Portal's uid is on B, so B is kept
    const a = await h.portal('Mo', 'Fold', 'B090126'), A = a.body.id;
    const ra = await h.get('trainee:' + A);
    Object.assign(ra, { registeredAt: T(1, 0), submissions: [{ id: 's-a' }],
        dayProgress: { 11: { score: 50, done: false, date: T(2), history: [H(50, 2)] }, 12: { score: 80, done: true, date: T(2), history: [H(80, 2), H(80, 2, 10, 5)] } },
        kcReset: { 11: { at: T(2, 11), by: 'Trainer', n: 1 }, 12: { at: T(2, 9), by: 'Trainer', n: 1 } } });
    await h.set('trainee:' + A, ra);
    await h.set('progress:' + A, { traineeId: A, savedAt: T(3), data: { notes: 'A', items: [{ id: 1, v: 'a' }],
        'day-progress': { 13: { score: 150, done: true, date: T(3), history: [{ score: 150, passed: true, date: T(3) }] }, 14: { done: true, score: 95, history: [{ score: 95, passed: true, date: '2025-01-01T00:00:00.000Z' }] } },
        'work-log': [{ kind: 'quiz', dayId: 15, score: 88, at: T(3) }, { kind: 'quiz', dayId: 16, score: 90, at: '2099-01-01T00:00:00.000Z' }] } });
    const b = await h.portal('Moe', 'Fold', 'B090126', 'U-mo'), B = b.body.id;
    const rb = await h.get('trainee:' + B);
    Object.assign(rb, { registeredAt: T(1, 0), lastActive: T(4), submissions: [{ id: 's-b' }], dayProgress: { 11: { score: 90, done: true, date: T(3), history: [H(90, 3)] } } });
    await h.set('trainee:' + B, rb);
    await h.set('progress:' + B, { traineeId: B, savedAt: T(4), data: { notes: 'B' } });

    const { dry, done } = await confirmed({ ids: [A, B] });
    R.check(done.status === 200 && done.body.keep === B, `the merge should go through, keeping ${B}: ${JSON.stringify(done.body && (done.body.error || done.body.keep))}`);
    const row = (d) => (dry.body.days || []).find((x) => String(x.day) === String(d)) || {};

    // 6. impossible or device-only scores
    R.check(!row(13).recovered && /outside 0–100/.test(row(13).note || ''), `a score of 150 should not be counted: ${JSON.stringify(row(13))}`);
    R.check(!row(14).recovered && /before the trainee registered/.test(row(14).note || ''), `an attempt dated before registration should not be counted, nor the device's "done" alone: ${JSON.stringify(row(14))}`);
    R.check(row(15).recovered && row(15).recovered.score === 88 && row(15).unverified === true && /Unverified/.test(row(15).note || ''), `a day only the device scored should be marked unverified: ${JSON.stringify(row(15))}`);
    R.check(!row(16).recovered && /future/.test(row(16).note || ''), `a work-log entry dated in the future should not be counted: ${JSON.stringify(row(16))}`);
    R.check(!row(11).unverified && !row(12).unverified, 'a day a record scores is not unverified');
    const k = h.raw('trainee:' + B), dp = k.dayProgress || {};
    R.check(!(dp[13] && dp[13].done) && !(dp[14] && (dp[14].done || dp[14].score != null)) && dp[15] && dp[15].kcUnverified === true && dp[15].score === 88, `the record should hold no impossible score or pass, and mark the device's day: ${JSON.stringify(dp)}`);

    // 5. the resets: Day 11's was open on A (1 attempt, n 1) and the merge made it 2 attempts; Day 12's was used on A
    //    (2 attempts, n 1) and the merge counts them as 1 (the same score within 10 minutes)
    const attempts = (p) => Array.isArray(p && p.history) ? p.history.length : 0;
    const open = (d) => k.kcReset && k.kcReset[d] && attempts(dp[d]) === k.kcReset[d].n;
    R.check(attempts(dp[11]) === 2 && open(11), `an open reset should stay open after the merge: ${JSON.stringify({ dp: dp[11], r: (k.kcReset || {})[11] })}`);
    R.check(attempts(dp[12]) === 1 && !open(12), `a used reset should stay used after the merge: ${JSON.stringify({ dp: dp[12], r: (k.kcReset || {})[12] })}`);

    // 1. stamped, and the merge's copy kept
    const stamp = k.mergedAt, base = h.raw('mergebase:' + B);
    R.check(stamp && h.raw('progress:' + B).mergedAt === stamp && base && base.mergedAt === stamp && base.progress && base.trainee && Array.isArray(base.trainee.submissions), `mergedAt on both records and mergebase:<keep>: ${JSON.stringify({ stamp, base: base && base.mergedAt })}`);

    // 2. a stale device (it never restored the merge): folded, told to restore, never growing
    const tok = b.body.token;
    const t1 = await h.set('trainee:' + B, Object.assign({}, h.raw('trainee:' + B), { submissions: [{ id: 's-b' }] }), tok);
    R.check(t1.body && t1.body.mergePending === stamp && (h.raw('trainee:' + B).submissions || []).some((x) => x.id === 's-a'), `a stale trainee save should keep the merged lists and be told to restore: ${JSON.stringify(t1.body)}`);
    const sizes = [];
    let p1;
    for (let i = 0; i < 10; i++) {
        p1 = await h.set('progress:' + B, { traineeId: B, savedAt: new Date().toISOString(), data: { notes: 'stale', items: [{ id: 1, v: 'edit ' + i }], tmp: i < 5 ? ['mine'] : [] } }, tok);
        sizes.push(h.store.get('cm:progress:' + B).length);
    }
    const pb = h.raw('progress:' + B);
    R.check(p1.body && p1.body.mergePending === stamp, `a stale progress save should be told to restore: ${JSON.stringify(p1.body)}`);
    R.check(pb.data.notes === 'stale' && pb.data.items.length === 2 && pb.data['day-progress'] && pb.data['day-progress'][11], `the stale snapshot should be the device's own joined with the merge's (one edited item, not ten): ${JSON.stringify(pb.data.items)}`);
    R.check(Math.max(...sizes.slice(5)) - Math.min(...sizes.slice(5)) < 40, `the stored snapshot should not grow save after save: ${sizes.join(', ')}`);
    R.check(JSON.stringify(pb.data.tmp) === '[]', `an item the device added and then removed should be gone: ${JSON.stringify(pb.data.tmp)}`);

    // 3. a device that restored the merge writes as it is
    const p2 = await h.set('progress:' + B, { traineeId: B, savedAt: new Date().toISOString(), mergedAt: stamp, data: { notes: 'restored', items: [] } }, tok);
    const pr = h.raw('progress:' + B);
    R.check(!(p2.body && p2.body.mergePending) && pr.data.notes === 'restored' && pr.data.items.length === 0 && !pr.data.tmp, `a save that names the merge should be written as it is: ${JSON.stringify(pr.data)}`);
    const t2 = await h.set('trainee:' + B, Object.assign({}, h.raw('trainee:' + B), { submissions: [{ id: 'only' }], mergeSeen: stamp }), tok);
    R.check(!(t2.body && t2.body.mergePending) && JSON.stringify(h.raw('trainee:' + B).submissions) === '[{"id":"only"}]', 'a trainee save that names the merge should be written as it is');

    // 4. a fold over 2 MB isn't made
    h.rawPut('mergebase:' + B, Object.assign({}, h.raw('mergebase:' + B), { progress: { traineeId: B, mergedAt: stamp, data: { big: 'x'.repeat(1200000) } } }));
    const p3 = await h.set('progress:' + B, { traineeId: B, savedAt: new Date().toISOString(), data: { big2: 'y'.repeat(1200000) } }, tok);
    const pz = h.raw('progress:' + B);
    R.check(p3.status === 200 && !p3.body.mergePending && p3.body.mergeFoldSkipped === stamp && pz.data.big2 && !pz.data.big && pz.mergeFoldSkipped && pz.mergeFoldSkipped.mergedAt === stamp && h.store.get('cm:progress:' + B).length < 2000000 + 1000, `a fold over 2 MB should store the device's own copy, marked mergeFoldSkipped, and not tell the device to restore it: ${p3.status} ${JSON.stringify(p3.body)} ${h.store.get('cm:progress:' + B).length}`);

    R.done('👥 Merge fold: a device that hasn\'t restored the merge is joined with the merge\'s own copy (never growing, its removals kept) and told to restore; resets stay open or used; impossible or device-only scores are never official.');
})().catch((e) => { console.error(e); process.exit(1); });
