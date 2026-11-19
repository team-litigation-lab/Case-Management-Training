// @check node — 🛠 Restore missing KC scores (/api/kc-restore): a dry run changes nothing; confirmed, only the days trainee:<id> has no attempt for are filled in from its own progress snapshot and work-log, a scored day is never changed, and the record is backed up first
// worker-account-repair.js kcRestoreApi, a trainer's only (js/cm-account-repair.js's "Restore missing KC scores"):
//   1. a trainee can't call it; an id with no record is refused;
//   2. the dry run answers {day, record, recovered, source} per day and changes no key;
//   3. confirmed: a day missing from trainee:<id> but in progress:<id>.data["day-progress"] is written with its attempts;
//      a day only in the work-log (kind quiz) is written from it; the first attempt is the official score; done at 70+;
//      caseFlow.days[n].kc and passed follow where the summary had no score;
//   4. a day the record already scores keeps its score, pass and history exactly;
//   5. backup:<id>:<ts> holds the record as it was; progress:<id> is not written;
//   6. a second run has nothing to restore;
//   7. the record is patched as it is just before the write (a save in between stays), and the account's own orphan
//      backups are a source (one that says it holds someone else's work is not);
//   8. an attempt that can't be real is never counted (a score outside 0–100; from the device: no date, or one before
//      registration or in the future), and every score restored is marked unverified (row.unverified, day.kcUnverified).
// Usage: node .github/scripts/kc-restore.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
const T = (d, h = 10) => `2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00.000Z`;
(async () => {
    const h = await harness({ portalOnly: true });
    const restore = (body, token = h.admin) => h.api('/api/kc-restore', body, token);
    const a = await h.portal('Kim', 'Restore', 'B090126', 'U-kim');
    const id = a.body.id;
    const rec = await h.get('trainee:' + id);
    // Day 11 scored on the record (40, failed); Day 12 only in the snapshot (2 attempts); Day 13 only in the work-log
    Object.assign(rec, { registeredAt: T(1, 0), dayProgress: { 11: { score: 40, done: false, date: T(2), history: [{ score: 40, passed: false, date: T(2) }] } },
        caseFlow: { at: T(2), days: { 1: { id: 11, kc: 40, passed: false }, 2: { id: 12 }, 3: { id: 13 } } } });
    await h.set('trainee:' + id, rec);
    const prog = { traineeId: id, savedAt: T(5), data: {
        'day-progress': { 11: { score: 95, done: true, date: T(4), history: [{ score: 95, passed: true, date: T(4) }] }, 12: { score: 60, done: true, trainingDone: true, date: T(3), history: [{ score: 60, passed: false, date: T(3) }, { score: 85, passed: true, date: T(3, 12) }] } },
        'work-log': [{ kind: 'quiz', dayId: 13, score: 80, at: T(4) }, { kind: 'quiz', dayId: 12, score: 60, at: T(3) }] } };
    // 8. attempts that can't be real (the trainee can write their own snapshot): a score over 100, a date before they
    //    registered or in the future, no date; a device's "done" with no attempt counted doesn't pass the day
    Object.assign(prog.data['day-progress'], { 14: { score: 150, done: true, date: T(4), history: [{ score: 150, passed: true, date: T(4) }] },
        15: { score: 95, done: true, history: [{ score: 95, passed: true, date: '2025-01-01T00:00:00.000Z' }, { score: 90, passed: true, date: '2099-01-01T00:00:00.000Z' }, { score: 85, passed: true }] } });
    await h.set('progress:' + id, prog);

    R.check((await restore({ id }, a.body.token)).status === 403, 'a trainee should not be able to restore scores');
    R.check((await restore({ id: 'no-such-trainee' })).status === 404, 'an id with no record should be refused');

    const before = JSON.stringify([...h.store.entries()].sort());
    const dry = await restore({ id });
    R.check(dry.status === 200 && dry.body.dryRun === true, `the dry run should answer: ${JSON.stringify(dry)}`);
    R.check(JSON.stringify([...h.store.entries()].sort()) === before, 'the dry run should change nothing');
    const row = (d) => (dry.body.days || []).find((x) => String(x.day) === String(d)) || {};
    R.check(row(11).changed === false && row(11).record && row(11).record.score === 40, `Day 11 is scored on the record: left as it is: ${JSON.stringify(row(11))}`);
    R.check(row(12).changed === true && !row(12).record && row(12).recovered && row(12).recovered.score === 60 && row(12).recovered.attempts === 2, `Day 12 should be recovered from the snapshot, first attempt official: ${JSON.stringify(row(12))}`);
    R.check(/progress:/.test(row(12).source || ''), `Day 12's source should name the snapshot: ${row(12).source}`);
    R.check(row(13).changed === true && row(13).recovered && row(13).recovered.score === 80 && /work-log:/.test(row(13).source || ''), `Day 13 should be recovered from the work-log: ${JSON.stringify(row(13))}`);
    R.check(row(12).unverified === true && /Unverified/.test(row(12).note || '') && row(13).unverified === true, `a score only the device wrote should be marked unverified: ${JSON.stringify(row(12))}`);
    R.check(!row(14).changed && !row(14).recovered && /outside 0–100/.test(row(14).note || ''), `a score over 100 should not be counted: ${JSON.stringify(row(14))}`);
    R.check(!row(15).changed && !row(15).recovered && /before the trainee registered/.test(row(15).note || '') && /future/.test(row(15).note || '') && /no date/.test(row(15).note || ''), `attempts dated before registration, in the future or undated should not be counted: ${JSON.stringify(row(15))}`);

    const done = await restore({ id, confirm: true, expectKc: dry.body.expectKc });
    R.check(done.status === 200 && done.body.ok === true, `the confirmed restore should succeed: ${JSON.stringify(done.body)}`);
    const after = await h.get('trainee:' + id);
    R.check(JSON.stringify(after.dayProgress[11]) === JSON.stringify(rec.dayProgress[11]), `Day 11 should be unchanged: ${JSON.stringify(after.dayProgress[11])}`);
    const d12 = after.dayProgress[12] || {};
    R.check(d12.score === 60 && d12.done === true && (d12.history || []).length === 2 && d12.trainingDone === true, `Day 12 on the record: ${JSON.stringify(d12)}`);
    const d13 = after.dayProgress[13] || {};
    R.check(d13.score === 80 && d13.done === true && (d13.history || []).length === 1, `Day 13 on the record: ${JSON.stringify(d13)}`);
    R.check(d12.kcUnverified === true && d13.kcUnverified === true && !after.dayProgress[14] && !after.dayProgress[15], `restored days are marked kcUnverified, impossible ones not written: ${JSON.stringify(after.dayProgress)}`);
    const strip = JSON.parse(JSON.stringify(after)); Object.values(strip.dayProgress).forEach((x) => delete x.kcUnverified); strip.dayProgress[11].kcUnverified = true;
    await h.set('trainee:' + id, strip, a.body.token);
    const kept = (await h.get('trainee:' + id)).dayProgress;
    R.check(kept[12].kcUnverified === true && !kept[11].kcUnverified, `the trainee's own save can't drop or add the unverified label: ${JSON.stringify(kept)}`);
    const cf = after.caseFlow.days;
    R.check(cf[1].kc === 40 && cf[1].passed === false && cf[2].kc === 60 && cf[2].passed === true && cf[3].kc === 80, `caseFlow should follow the restored days only: ${JSON.stringify(cf)}`);
    R.check(after.approved === rec.approved && after.portalUid === 'U-kim', 'the rest of the record stays');
    const bk = h.ids('backup:' + id + ':');
    R.check(bk.length === 1 && JSON.parse(h.raw(bk[0]).keys['trainee:' + id]).dayProgress[11].score === 40 && !JSON.parse(h.raw(bk[0]).keys['trainee:' + id]).dayProgress[12], `a backup of the record as it was: ${bk}`);
    R.check(JSON.stringify(await h.get('progress:' + id)) === JSON.stringify(prog), 'progress:<id> should not be written');

    const again = await restore({ id, confirm: true });
    R.check(again.status === 200 && again.body.nothingToRestore === true && !again.body.ok, `a second run should find nothing to restore: ${JSON.stringify(again.body)}`);
    R.check(h.ids('backup:' + id + ':').length === 1, 'a second run should write nothing (no second backup)');
    // 7. a save between the read and the write is kept (the record is patched, not replaced), and the account's own orphan
    //    backup is a source for a day the record lacks (one that says it is someone else's is not)
    const b2 = await h.portal('Lu', 'Patch', 'B090126', 'U-lu');
    const id2 = b2.body.id;
    await h.set('trainee:' + id2, Object.assign(await h.get('trainee:' + id2), { registeredAt: T(1, 0) }));
    h.rawPut(`orphan:${id2}:${Date.now() - 1000}`, { traineeId: id2, reason: 'logout-unsaved', data: { 'day-progress': { 14: { score: 72, done: true, date: T(6), history: [{ score: 72, passed: true, date: T(6) }] } } } });
    h.rawPut(`orphan:${id2}:${Date.now() - 500}`, { traineeId: 'not-' + id2, reason: 'handover', data: { 'day-progress': { 15: { score: 90, done: true, date: T(6), history: [{ score: 90, passed: true, date: T(6) }] } } } });
    const d2 = await restore({ id: id2 });
    const r14 = (d2.body.days || []).find((x) => x.day === '14'), r15 = (d2.body.days || []).find((x) => x.day === '15');
    R.check(r14 && r14.changed && r14.recovered.score === 72 && /orphan:/.test(r14.source) && !r15, `the own orphan backup should be a source, a handover one not: ${JSON.stringify(d2.body.days)}`);
    const KV = h.env.LSH_KV, put0 = KV.put;
    KV.put = async (k, v, o) => {
        if (k.startsWith('cm:backup:' + id2 + ':')) { const r = JSON.parse(h.store.get('cm:trainee:' + id2)); r.submissions = [{ id: 'mid-save' }]; h.store.set('cm:trainee:' + id2, JSON.stringify(r)); }
        return put0(k, v, o);
    };
    const c2 = await restore({ id: id2, confirm: true, expectKc: d2.body.expectKc });
    KV.put = put0;
    const after2 = await h.get('trainee:' + id2);
    R.check(c2.status === 200 && after2.dayProgress[14] && after2.dayProgress[14].score === 72 && (after2.submissions || []).some((x) => x.id === 'mid-save'), `a save made during the restore should be kept: ${JSON.stringify(after2.submissions)}`);
    R.check(h.ids('orphan:' + id2 + ':').length === 2, 'the orphan backups are only read');

    R.done('🛠 Restore missing KC scores: a dry run changes nothing; only the missing days are filled in, a scored day stays, the record is backed up first.');
})().catch((e) => { console.error(e); process.exit(1); });
