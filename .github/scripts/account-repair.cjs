// @check node — 👥 An account merge on the Worker (/api/account-merge): a dry run changes nothing; a confirmed merge keeps the id the current Portal name opens, unions each day's attempts, moves every per-id key, backs everything up and deletes nothing it didn't copy
// worker-account-repair.js, a trainer's only. Checked on the Worker:
//   1. a trainee can't call it; fewer than two ids, or an id with no record, is refused;
//   2. the dry run answers a per-day table {day, record, recovered, source} and changes no key at all;
//   3. the id kept is the one the trainee's current Portal name and batch open (the uid index's name), not the trainer's
//      pick; two different Portal ids are refused unless differentPortalIds;
//   4. confirmed: dayProgress per day is the union of every record's, snapshot's and work-log's attempts; the official score
//      is the first attempt (the best after a kcReset); done when any attempt is 70 or more; caseFlow follows;
//      feedback, focus, actsub, callsim, simresults, checkin, drive, actup move or merge; a cert's traineeId is rewritten;
//   5. merged:<other> → keep, merged:<keep> deleted, uid:<portalUid> → keep; progress:<keep>.savedAt is later than any
//      device's, so the kept device restores it;
//   6. backup:<id>:<ts> holds every id's keys as they were; the other id's keys are gone only after the copy, and only
//      when the merge is run again once its redirect is SETTLE_MS old (a save that landed in between is folded in first);
//   7. after it, the Portal sign-in under either name opens the kept id, and its renewal is accepted;
//   8. a write that fails half-way deletes nothing: every source record is still there, and the redirects written are
//      taken back (the other account still saves);
//   9. the confirm must name the preview's keep and deletes; a save on the kept account during the merge is merged in, a
//      key of the other account that changed after the read is left in place; orphan backups are folded (only the
//      account's own) and never deleted; a trainee:<id> attempt is official over the device's own snapshot;
//  10. after it, a device that hasn't restored the merge can't drop what it folded in (mergedAt);
//  11. merged:<keep> into a live account outside the merge is refused; a stale merged:<id> on a live record is removed
//      only on confirm, backed up.
// Usage: node .github/scripts/account-repair.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
const T = (d, h = 10) => `2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00.000Z`;
(async () => {
    const h = await harness({ portalOnly: true });
    const merge = (body, token = h.admin) => h.api('/api/account-merge', body, token);
    // a confirmed merge names its preview's result (expectKeep, expectDelete), as js/cm-account-repair.js sends it
    const confirmed = async (body) => { const d = await merge(Object.assign({}, body, { confirm: false })); return merge(Object.assign({}, body, { confirm: true, expectKeep: d.body && d.body.keep, expectDelete: d.body && d.body.keys && d.body.keys.delete, expectKc: d.body && d.body.expectKc })); };
    const KV = h.env.LSH_KV, put0 = KV.put;

    // A: Ann Lee's first account (Days 11 and 12, a work-log quiz for Day 13, calls, check-ins, a drive, an upload, a cert)
    const a = await h.portal('Ann', 'Lee', 'B090126');
    const A = a.body.id;
    const recA = await h.get('trainee:' + A);
    Object.assign(recA, { registeredAt: T(1, 0), lastActive: T(5), dayProgress: { 11: { score: 40, done: false, date: T(2), history: [{ score: 40, passed: false, date: T(2) }] }, 12: { score: 90, done: true, date: T(3), history: [{ score: 90, passed: true, date: T(3) }] } },
        caseFlow: { at: T(3), days: { 1: { id: 11, kc: 40, passed: false }, 2: { id: 12, kc: 90, passed: true } } } });
    await h.set('trainee:' + A, recA);
    await h.set('progress:' + A, { traineeId: A, savedAt: T(5), data: { 'day-progress': recA.dayProgress, notes: 'from A', 'work-log': [{ kind: 'quiz', dayId: 13, score: 80, at: T(4) }] } });
    // (a made-up attempt in A's own snapshot for a day the records score: never official)
    const pa = h.raw('progress:' + A); pa.data['day-progress'] = Object.assign({}, pa.data['day-progress'], { 11: { score: 100, done: true, date: T(1), history: [{ score: 100, passed: true, date: T(1) }] } }); h.rawPut('progress:' + A, pa);
    // A's own orphan backup (Day 14 only there), and one a shared computer left that says it is someone else's
    const ms = String(Date.now() - 60000);
    h.rawPut('orphan:' + A + ':' + ms, { traineeId: A, reason: 'logout-unsaved', data: { 'day-progress': { 14: { score: 75, done: true, date: T(4, 11), history: [{ score: 75, passed: true, date: T(4, 11) }] } } } });
    h.rawPut('orphan:' + A + ':' + String(Date.now() - 50000), { traineeId: 'someone-else--b090126', reason: 'handover', data: { 'day-progress': { 15: { score: 99, done: true, date: T(4), history: [{ score: 99, passed: true, date: T(4) }] } } } });
    await h.set('feedback:' + A, { days: { 11: { status: 'sent', text: 'Trainer review of Day 11' } } });
    await h.set('callsim:' + A, { calls: [{ id: 'c1', score: 77 }] });
    h.rawPut('checkin:2026-09-02:' + A, { timeIn: '09:00', name: 'Ann Lee' });
    h.rawPut('actup:' + A + ':f1', { file: 'data:...' });
    h.rawPut('drive:' + A, { rootId: 'folder-a', linkedAt: T(2) });
    h.rawPut('cert:LSH-CM-2026-ABC123', { certId: 'LSH-CM-2026-ABC123', traineeId: A });
    // B: the second account a renamed Portal profile made, carrying the Portal's uid (Day 11 passed there)
    const b = await h.portal('Anne', 'Lee', 'B090126', 'U-ann');
    const B = b.body.id;
    R.check(A !== B, 'the test needs two accounts');
    const recB = await h.get('trainee:' + B);
    Object.assign(recB, { registeredAt: T(1, 0), lastActive: T(6), dayProgress: { 11: { score: 90, done: true, date: T(6), history: [{ score: 90, passed: true, date: T(6) }] } } });
    await h.set('trainee:' + B, recB);
    await h.set('progress:' + B, { traineeId: B, savedAt: T(7), data: { 'day-progress': recB.dayProgress, notes: 'from B' } });
    h.rawPut('checkin:2026-09-06:' + B, { timeIn: '09:05', name: 'Anne Lee' });
    h.rawPut('merged:' + B, { into: 'nowhere' });

    // 1. refusals
    R.check((await merge({ ids: [A, B] }, b.body.token)).status === 403, 'a trainee should not be able to merge accounts');
    R.check((await merge({ ids: [A] })).status === 400, 'one id should be refused');
    R.check((await merge({ ids: [A, 'no-such-trainee'] })).status === 404, 'an id with no record should be refused');

    // 2. the dry run changes nothing
    const before = JSON.stringify([...h.store.entries()].sort());
    const dry = await merge({ ids: [A, B], keep: A });
    R.check(dry.status === 200 && dry.body.dryRun === true, `the dry run should answer: ${JSON.stringify(dry)}`);
    R.check(JSON.stringify([...h.store.entries()].sort()) === before, 'the dry run should change nothing');
    // 3. the id kept: the one the current Portal name (Anne Lee, from the uid index) opens, not the trainer's pick
    R.check(dry.body.keep === B, `the id kept should be the one the current Portal name opens (${B}): ${dry.body.keep} (${dry.body.keepWhy})`);
    const row = (d) => (dry.body.days || []).find((x) => String(x.day) === String(d)) || {};
    R.check(row(11).record && row(11).record.score === 90 && row(11).recovered.score === 40 && row(11).recovered.done === true && row(11).recovered.attempts === 2 && /trainee:/.test(row(11).source),
        `Day 11: record 90 (B), recovered = the first attempt (40), passed (90 ≥ 70), two attempts: ${JSON.stringify(row(11))}`);
    R.check(row(12).record === null && row(12).recovered.score === 90 && row(12).recovered.done === true, `Day 12 should be recovered from A: ${JSON.stringify(row(12))}`);
    R.check(row(13).recovered && row(13).recovered.score === 80 && /work-log:/.test(row(13).source), `Day 13 should be recovered from A's work-log: ${JSON.stringify(row(13))}`);
    R.check(/progress:/.test(row(11).note || '') && /100%/.test(row(11).note || '') && !/progress:/.test(row(11).source), `Day 11: the snapshot's own attempt should be listed as left out, not used: ${JSON.stringify(row(11))}`);
    R.check(row(14).recovered && row(14).recovered.score === 75 && /orphan:/.test(row(14).source), `Day 14 should be recovered from A's own orphan backup: ${JSON.stringify(row(14))}`);
    R.check(!row(15).recovered && (dry.body.orphans || []).some((x) => /not folded in/.test(x)), `a handover orphan naming someone else should be listed, not folded: ${JSON.stringify(dry.body.orphans)}`);

    // a confirm that doesn't name the preview's result is refused, unwritten
    const unpinned = await merge({ ids: [A, B], confirm: true });
    R.check(unpinned.status === 409 && unpinned.body.previewAgain && JSON.stringify([...h.store.entries()].sort()) === before, `a confirm without the preview's keep and deletes should be refused: ${unpinned.status}`);
    const wrongKeep = await merge({ ids: [A, B], confirm: true, expectKeep: A, expectDelete: dry.body.keys.delete });
    R.check(wrongKeep.status === 409 && JSON.stringify([...h.store.entries()].sort()) === before, `a confirm whose kept id differs from the preview's should be refused: ${wrongKeep.status}`);

    // 8. a write that fails half-way deletes nothing (and keeps the backups)
    h.failPut = (k) => k === 'cm:uid:U-ann';   // (the last write: the redirects and merged:<keep>'s delete are done by then)
    const bad = await confirmed({ ids: [A, B] });
    h.failPut = null;
    R.check(bad.status === 500 && h.has('trainee:' + A) && h.has('progress:' + A) && h.has('callsim:' + A) && h.has('checkin:2026-09-02:' + A), `a failure half-way should leave every source record: ${bad.status}`);
    R.check(!h.has('merged:' + A) && (bad.body.redirectsUndone || []).includes('merged:' + A), `the redirects written before the failure should be taken back: ${JSON.stringify(bad.body.redirectsUndone)}`);
    R.check((h.raw('merged:' + B) || {}).into === 'nowhere', 'merged:<keep> should be put back after a failure');
    R.check((await h.set('progress:' + A, Object.assign({}, h.raw('progress:' + A)), a.body.token)).status === 200, 'after a failed merge, the other account should still save');
    R.check(h.ids('backup:' + A + ':').length >= 1, 'the backups should be kept after a failure');
    R.check(/may already hold/.test(bad.body.error || ''), `the failure message should say the kept account may hold merged records: ${bad.body.error}`);

    // saves that land while the merge runs: one on the kept account (after its read), one on the other just before its
    // redirect (merged in: the merge reads every account again once the redirects are written), a trainee save to the
    // other after its redirect (refused), and a change to the other after the second read (left in place, not deleted)
    let lateSave = null;
    KV.put = async (k, v, o) => {
        if (k === 'cm:merged:' + A && !KV.hit2) { KV.hit2 = true; h.store.set('cm:callsim:' + A, JSON.stringify({ calls: [{ id: 'c1', score: 77 }, { id: 'c2', score: 81 }] })); }
        if (k.startsWith('cm:backup:' + A + ':') && !KV.hit1) {
            KV.hit1 = true; const r = JSON.parse(h.store.get('cm:trainee:' + B)); r.submissions = (r.submissions || []).concat([{ id: 'sub-new', at: T(8) }]); h.store.set('cm:trainee:' + B, JSON.stringify(r));
            lateSave = await h.set('progress:' + A, { traineeId: A, savedAt: new Date().toISOString(), data: { notes: 'saved during the merge' } }, a.body.token);
        }
        if (k === 'cm:uid:U-ann' && KV.finishing && !KV.hit3) { KV.hit3 = true; h.store.set('cm:simresults:' + A, JSON.stringify({ best: { x: { score: 1 } } })); }
        return put0(k, v, o);
    };
    h.rawPut('simresults:' + A, { best: { x: { score: 50 } } });

    // 4–6. confirmed
    const startedAt = Date.now();
    const ok = await confirmed({ ids: [A, B] });
    KV.put = put0;
    R.check(ok.status === 200 && ok.body.merged === true && ok.body.keep === B, `the merge should succeed: ${JSON.stringify(ok.body && (ok.body.error || ok.body.keep))}`);
    R.check(((h.raw('trainee:' + B) || {}).submissions || []).some((x) => x.id === 'sub-new'), 'a save on the kept account made while the merge ran should be merged in, not written over');
    R.check(lateSave && lateSave.status === 403 && /merged/i.test((lateSave.body || {}).error || ''), `a trainee save to the other account once the merge has started should be refused: ${JSON.stringify(lateSave)}`);
    // 5b. the other account's keys wait for the redirect to settle (a Worker elsewhere can miss merged:<other> for about a
    //     minute and take a save there): the first run deletes none of them; run again once it has, it folds in what
    //     landed in between and only then deletes them
    R.check(h.has('trainee:' + A) && h.has('progress:' + A) && h.has('callsim:' + A) && (ok.body.pendingDelete || []).includes('trainee:' + A) && ok.body.finishAfter && /again/.test(ok.body.message || ''),
        `the first run should leave the other account's keys until its redirect has settled: ${JSON.stringify(ok.body.pendingDelete)} ${ok.body.message}`);
    R.check(((h.raw('callsim:' + B) || {}).calls || []).length === 2, `a save on the other account before its redirect should be merged in: ${JSON.stringify(h.raw('callsim:' + B))}`);
    const at1 = (h.raw('merged:' + A) || {}).at, soon = await confirmed({ ids: [A, B] });
    R.check(soon.status === 200 && h.has('trainee:' + A) && (soon.body.pendingDelete || []).includes('trainee:' + A) && at1 && (h.raw('merged:' + A) || {}).at === at1, `a run again before the redirect has settled should still delete nothing: ${JSON.stringify(soon.body.pendingDelete)}`);
    const pl = h.raw('progress:' + A); pl.data = Object.assign({}, pl.data, { lateNote: 'saved where merged:<other> was not seen yet' }); h.rawPut('progress:' + A, pl);   // (a save another Worker took)
    h.rawPut('merged:' + A, Object.assign(h.raw('merged:' + A), { at: new Date(Date.now() - 3 * 60000).toISOString() }));   // (the redirect is 3 minutes old)
    KV.put = async (k, v, o) => { if (k === 'cm:uid:U-ann' && !KV.hit3) { KV.hit3 = true; h.store.set('cm:simresults:' + A, JSON.stringify({ best: { x: { score: 1 } } })); } return put0(k, v, o); };
    const fin = await confirmed({ ids: [A, B] });
    KV.put = put0;
    R.check(fin.status === 200 && fin.body.ok && !(fin.body.pendingDelete || []).length, `the merge run again after the redirect settled should finish: ${JSON.stringify(fin.body && (fin.body.error || fin.body.pendingDelete))}`);
    R.check(((h.raw('progress:' + B) || {}).data || {}).lateNote === 'saved where merged:<other> was not seen yet' && !h.has('progress:' + A), `a save that landed on the other account after its redirect should be folded in before the delete: ${JSON.stringify(Object.keys((h.raw('progress:' + B) || {}).data || {}))}`);
    R.check(!h.has('callsim:' + A), 'the other account\'s merged keys are deleted by the finishing run');
    R.check((fin.body.changedSinceRead || []).includes('simresults:' + A) && (h.raw('simresults:' + A) || {}).best.x.score === 1, `a key of the other account that changed after the second read should be left in place: ${JSON.stringify(fin.body.changedSinceRead)}`);
    R.check(h.ids('orphan:' + A + ':').length === 2, 'orphan backups are never deleted');
    const k = h.raw('trainee:' + B) || {};
    const dp = k.dayProgress || {};
    R.check(dp[11] && dp[11].score === 40 && dp[11].done === true && dp[11].history.length === 2, `Day 11 merged: first attempt 40, passed, 2 attempts: ${JSON.stringify(dp[11])}`);
    R.check(dp[12] && dp[12].score === 90 && dp[12].done, 'Day 12 should come from A');
    R.check(dp[13] && dp[13].score === 80 && dp[13].done, 'Day 13 should come from the work-log');
    R.check(dp[14] && dp[14].score === 75 && !dp[15], 'Day 14 should come from A\'s own orphan backup, and nothing from the handover one');
    R.check(k.mergedAt && (h.raw('progress:' + B) || {}).mergedAt === k.mergedAt, 'the merge should be stamped on both kept records (mergedAt)');
    R.check(k.caseFlow && k.caseFlow.days[1].kc === 40 && k.caseFlow.days[1].passed === true, `caseFlow should follow the merged days: ${JSON.stringify(k.caseFlow)}`);
    R.check(k.portalUid === 'U-ann' && Array.isArray(k.mergedFrom) && k.mergedFrom.includes(A) && k.approved === true, 'the kept record should carry the uid, mergedFrom and the approval');
    const p = h.raw('progress:' + B) || {};
    R.check(p.data && p.data.notes === 'from B' && p.data['day-progress'][12] && p.data['day-progress'][11].history.length === 2, 'the kept snapshot should be merged');
    R.check(Date.parse(p.savedAt) >= startedAt - 5 && Date.parse(p.savedAt) > Date.parse(T(7)), `progress savedAt should be later than any device's: ${p.savedAt}`);
    R.check(((h.raw('feedback:' + B) || {}).days || {})[11], 'the trainer\'s review should move to the kept id');
    R.check(h.has('checkin:2026-09-02:' + B) && h.has('checkin:2026-09-06:' + B) && !h.has('checkin:2026-09-02:' + A), 'the check-ins should move');
    R.check(h.has('actup:' + B + ':f1') && !h.has('actup:' + A + ':f1'), 'the upload should move');
    R.check((h.raw('drive:' + B) || {}).rootId === 'folder-a' && !h.has('drive:' + A), 'the Backup Drive record should move');
    R.check((h.raw('cert:LSH-CM-2026-ABC123') || {}).traineeId === B && h.raw('cert:LSH-CM-2026-ABC123').traineeIdWas === A, 'the certificate should name the kept id');
    R.check((h.raw('merged:' + A) || {}).into === B && !h.has('merged:' + B) && (h.raw('uid:U-ann') || {}).id === B, 'merged:<other> → keep, merged:<keep> deleted, the uid index → keep');
    R.check(!h.has('trainee:' + A) && !h.has('trainee-admin:' + A) && !h.has('progress:' + A) && !h.has('feedback:' + A) && !h.has('feedback-admin:' + A), 'the other id\'s copied keys should be gone');
    const backups = h.ids('backup:' + A + ':').map((x) => h.raw(x));
    R.check(backups.some((x) => x.keys && x.keys['trainee:' + A] && JSON.parse(x.keys['trainee:' + A]).dayProgress[11].score === 40 && x.keys['checkin:2026-09-02:' + A]), 'backup:<other>:<ts> should hold its records as they were');
    R.check(h.ids('backup:' + B + ':').map((x) => h.raw(x)).some((x) => x.keys && x.keys['trainee:' + B]), 'backup:<keep>:<ts> should hold the kept records as they were');

    // 7. signing in afterwards
    const s1 = await h.portal('Anne', 'Lee', 'B090126', 'U-ann');
    const s2 = await h.portal('Ann', 'Lee', 'B090126');
    R.check(s1.body.id === B && s2.body.id === B, `both names should open the kept id: ${s1.body.id} / ${s2.body.id}`);
    const rn = await h.api('/api/auth/trainee', { name: 'Ann Lee', batch: 'B090126' }, s1.body.token);
    R.check(rn.status === 200 && rn.body.id === B, `the renewal after the merge should be accepted: ${JSON.stringify(rn)}`);
    const w = await h.set('trainee:' + B, Object.assign({}, h.raw('trainee:' + B), { dayProgress: {} }), rn.body.token);
    R.check(w.status === 200 && h.raw('trainee:' + B).dayProgress[11].history.length === 2, 'the kept device\'s next save should keep the merged attempts');
    // a device still open on the kept account, from before the merge: its whole-record saves can't drop what was folded in
    const stamp = h.raw('trainee:' + B).mergedAt;
    await h.set('trainee:' + B, Object.assign({}, h.raw('trainee:' + B), { submissions: [], completedLabActions: {}, mergedAt: 'forged' }), rn.body.token);
    R.check((h.raw('trainee:' + B).submissions || []).some((x) => x.id === 'sub-new') && h.raw('trainee:' + B).mergedAt === stamp, 'a stale device\'s trainee save should keep the merged lists (and can\'t change mergedAt)');
    await h.set('progress:' + B, { traineeId: B, savedAt: new Date().toISOString(), data: { notes: 'typed on the stale tab' } }, rn.body.token);
    const pb = h.raw('progress:' + B);
    R.check(pb.data.notes === 'typed on the stale tab' && pb.data['day-progress'] && pb.data['day-progress'][12] && pb.mergedAt === stamp, `a stale device\'s snapshot should keep every merged key, its own edits winning: ${JSON.stringify(Object.keys(pb.data))}`);
    // a device that restored the merge (it names mergedAt) writes as before
    await h.set('trainee:' + B, Object.assign({}, h.raw('trainee:' + B), { submissions: [{ id: 'only' }], mergeSeen: stamp }), rn.body.token);
    R.check(JSON.stringify(h.raw('trainee:' + B).submissions) === JSON.stringify([{ id: 'only' }]) && !('mergeSeen' in h.raw('trainee:' + B)), 'a device that restored the merge should write its lists as they are');

    // 3. two Portal accounts; 4. after a kcReset the best attempt
    const c = await h.portal('Cy', 'Ray', 'B100926', 'U-c1');
    const d = await h.portal('Cy', 'Ray', 'B101026', 'U-c2');
    const rc = await h.get('trainee:' + c.body.id);
    Object.assign(rc, { dayProgress: { 11: { score: 50, done: false, date: T(2), history: [{ score: 50, passed: false, date: T(2) }] } }, kcReset: { 11: { at: T(3), by: 'Trainer', n: 1 } } });
    await h.set('trainee:' + c.body.id, rc);
    const rd = await h.get('trainee:' + d.body.id);
    Object.assign(rd, { dayProgress: { 11: { score: 85, done: true, date: T(4), history: [{ score: 85, passed: true, date: T(4) }] } } });
    await h.set('trainee:' + d.body.id, rd);
    // merged:<keep> that sends the sign-in to a live account outside the merge is refused
    const x = await h.portal('Xu', 'Ray', 'B100926');
    h.rawPut('merged:' + d.body.id, { into: x.body.id });
    const stuck = await merge({ ids: [c.body.id, d.body.id], name: 'Cy Ray', batch: 'B101026' });
    R.check(stuck.status === 409 && stuck.body.into === x.body.id, `merged:<keep> into a live account not merged should be refused: ${JSON.stringify(stuck.body)}`);
    h.store.delete('cm:merged:' + d.body.id);
    const two = await confirmed({ ids: [c.body.id, d.body.id] });
    R.check(two.status === 409 && h.has('trainee:' + c.body.id) && h.has('trainee:' + d.body.id), 'two Portal ids should be refused without differentPortalIds');
    const three = await confirmed({ ids: [c.body.id, d.body.id], differentPortalIds: true, name: 'Cy Ray', batch: 'B101026' });
    const kept = three.body && three.body.keep;
    R.check(three.status === 200 && kept === d.body.id, `with differentPortalIds the merge should go ahead, keeping the current name + batch's id: ${JSON.stringify(three.body && (three.body.error || kept))}`);
    const k2 = h.raw('trainee:' + kept) || {};
    R.check(k2.dayProgress && k2.dayProgress[11].score === 85 && k2.dayProgress[11].done === true, `after a kcReset the official score should be the best: ${JSON.stringify(k2.dayProgress)}`);

    // 🔒 a merged:<id> left on a live record: removed only on confirm, backed up first
    const e1 = await h.portal('Eve', 'Lock', 'B100926');
    h.rawPut('merged:' + e1.body.id, { into: 'gone-account' });
    R.check((await h.set('progress:' + e1.body.id, { traineeId: e1.body.id, savedAt: T(9), data: { notes: 'x' } }, e1.body.token)).status === 200, 'a stale merged:<id> on a live record that leads nowhere should not refuse its saves');
    const rdr = await merge({ removeRedirect: e1.body.id });
    R.check(rdr.status === 200 && rdr.body.dryRun && h.has('merged:' + e1.body.id), `the redirect removal's dry run should change nothing: ${JSON.stringify(rdr.body)}`);
    const rr = await merge({ removeRedirect: e1.body.id, confirm: true });
    R.check(rr.status === 200 && !h.has('merged:' + e1.body.id) && h.ids('backup:' + e1.body.id + ':').some((k) => (h.raw(k).keys || {})['merged:' + e1.body.id]), `the confirmed removal should back up and delete the redirect: ${JSON.stringify(rr.body)}`);
    R.check((await merge({ removeRedirect: A })).status === 409, 'a redirect of an id with no record should stay');

    R.done('👥 Account merge: the dry run reads and changes nothing; confirmed, it keeps the id the current Portal name opens, unions each day\'s attempts (first attempt official, best after a reset, passed at 70), moves every per-id key, backs everything up, redirects the others and deletes only what it copied.');
})().catch((e) => { console.error(e); process.exit(1); });
