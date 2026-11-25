// @check node — A renamed or re-batched Portal ticket with the same uid opens the trainee's existing record (the uid index), and B250926 / B092526 (the same day, as batchShow shows it) resolve to one id
// worker.js: uid:<portalUid> = {id, name, batch} is written on every Portal sign-in that carries "u", and looked at first
// (resolveTrainee); the batch's other date order is one more candidate id (altId, otherBatchOrder). Checked on the Worker:
//   1. the first sign-in with a uid writes the index; the same sign-in again writes nothing new;
//   2. the first name changed, a middle name added, first and last swapped, the Batch ID re-issued: each opens the same
//      record (its Day 1 Knowledge Check is there), and no second account is made;
//   3. without a uid, B250926 (DDMMYY) and B092526 (MMDDYY) are one id, both ways round; B050626 and B060526 (either could be
//      a month) stay two batches;
//   4. an index that names another Portal account's record, or an archived one, is not followed;
//   5. a namesake with a different uid in another batch is still someone else;
//   6. the Training-tools ticket is given to a trainee the uid index moved (renamed or re-batched);
//   7. a record that carries another Portal id is never opened for this one (409 portal-uid-mismatch), by name, by the
//      batch's other order or by a merge redirect;
//   8. a merged-away id whose record came back still signs in to the record it was merged into.
// Usage: node .github/scripts/trainee-identity.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const { picksFor } = require('./kc-picks.cjs');   // (the Worker scores an attempt from its own picks, as the page sends them)
const R = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    // 1. the first sign-in
    const s1 = await h.portal('Ann', 'Lee', 'B090126', 'U-ann');
    R.check(s1.status === 200 && s1.body.id === 'ann-lee--b090126', `the first sign-in should open ann-lee--b090126: ${JSON.stringify(s1)}`);
    const id = s1.body.id;
    const ix = h.raw('uid:U-ann');
    R.check(ix && ix.id === id && ix.name === 'Ann Lee' && ix.batch === 'B090126', `the uid index should name the record and the Portal's name and batch: ${JSON.stringify(ix)}`);
    const ixAt = ix && ix.at;
    await h.portal('Ann', 'Lee', 'B090126', 'U-ann');
    R.check((h.raw('uid:U-ann') || {}).at === ixAt, 'an unchanged sign-in should not rewrite the uid index');
    // the trainee's Day 1 Knowledge Check, saved as their own page saves it
    const rec = await h.get('trainee:' + id);
    rec.dayProgress = { 11: { score: 85, done: true, date: '2026-09-02T10:00:00.000Z', history: [{ score: 85, passed: true, date: '2026-09-02T10:00:00.000Z', answers: picksFor(11, 85) }] } };
    R.check((await h.set('trainee:' + id, rec, s1.body.token)).status === 200, 'the trainee should save their own record');

    // 2. every change the Portal can make to who they are
    for (const [first, last, batch, why] of [['Anne', 'Lee', 'B090126', 'the first name changed'], ['Ann Marie', 'Lee', 'B090126', 'a middle name added'],
        ['Lee', 'Ann', 'B090126', 'first and last swapped'], ['Anne', 'Lee-Smith', 'B092526', 'renamed and re-batched']]) {
        const before = h.ids('trainee:').filter((k) => !k.includes('-admin')).length;
        const s = await h.portal(first, last, batch, 'U-ann');
        R.check(s.status === 200 && s.body.id === id, `${why}: the sign-in should open ${id}, not ${s.body && s.body.id}`);
        R.check(s.body && s.body.existing && s.body.existing.dayProgress && s.body.existing.dayProgress[11] && s.body.existing.dayProgress[11].score === 85, `${why}: the record's Knowledge Check should come with it`);
        R.check(h.ids('trainee:').filter((k) => !k.includes('-admin')).length === before, `${why}: no second account should be made (${h.ids('trainee:').join(', ')})`);
        R.check((h.raw('uid:U-ann') || {}).name === `${first} ${last}` && (h.raw('uid:U-ann') || {}).id === id, `${why}: the uid index should keep the Portal's current name, for a merge`);
    }

    // 3. the batch's two date orders, without a uid
    const d1 = await h.portal('Bo', 'Day', 'B250926');
    const d2 = await h.portal('Bo', 'Day', 'B092526');
    R.check(d1.body.id === 'bo-day--b250926' && d2.body.id === d1.body.id, `B250926 and B092526 should be one account: ${d1.body.id} / ${d2.body.id}`);
    const e1 = await h.portal('Cy', 'Ray', 'B092526');
    const e2 = await h.portal('Cy', 'Ray', 'B250926');
    R.check(e1.body.id === 'cy-ray--b092526' && e2.body.id === e1.body.id, `B092526 then B250926 should be one account: ${e1.body.id} / ${e2.body.id}`);
    const f1 = await h.portal('Di', 'May', 'B050626');
    const f2 = await h.portal('Di', 'May', 'B060526');
    R.check(f1.body.id !== f2.body.id, `B050626 and B060526 are two days (5 June / 6 May): they should stay two accounts (${f1.body.id})`);
    // a renewal under the other order is accepted (/api/auth/trainee)
    const renew = await h.api('/api/auth/trainee', { name: 'Bo Day', batch: 'B092526' }, d1.body.token);
    R.check(renew.status === 200 && renew.body.id === d1.body.id, `a renewal under the batch's other order should stay on the record: ${JSON.stringify(renew)}`);

    // 4. an index that isn't this trainee's
    const g = await h.portal('Gil', 'Ng', 'B100926', 'U-gil');
    h.rawPut('uid:U-other', { id: g.body.id, name: 'Gil Ng', batch: 'B100926' });
    const o = await h.portal('Oz', 'Pe', 'B100926', 'U-other');
    R.check(o.body.id === 'oz-pe--b100926', `an index naming another Portal account's record should not be followed: ${o.body.id}`);
    const gr = await h.get('trainee:' + g.body.id); gr.archived = true; await h.set('trainee:' + g.body.id, gr);
    const g2 = await h.portal('Gil', 'Ng', 'B111026', 'U-gil');
    R.check(g2.body.id === 'gil-ng--b111026', `an archived record (a course finished) should not be opened by the index: ${g2.body.id}`);

    // 5. a namesake with another uid, in another batch
    const n = await h.portal('Ann', 'Lee', 'B111026', 'U-namesake');
    R.check(n.body.id === 'ann-lee--b111026', `a namesake with another uid should be someone else: ${n.body.id}`);

    // 6. the Training-tools ticket for a trainee the uid index moved (renamed and re-batched on the Portal): their record's
    //    name and batch no longer build its id, but they resolve to it, so the tools still open signed in
    const t1 = await h.portal('Tia', 'Moss', 'B090126', 'U-tia');
    const t2 = await h.portal('Tia', 'Moss', 'B100926', 'U-tia');
    R.check(t2.body.id === t1.body.id && (h.raw('trainee:' + t1.body.id) || {}).batch === 'B100926', `the re-batched sign-in should open the record and move its batch: ${t2.body.id}`);
    const tt = await h.api('/api/auth/tool-ticket', {}, t2.body.token);
    R.check(tt.status === 200 && tt.body && tt.body.ticket, `the tool ticket after a re-batch should be given: ${JSON.stringify(tt)}`);
    const other = await h.portal('Uma', 'Fry', 'B090126', 'U-uma');
    const ot = await h.api('/api/auth/tool-ticket', {}, other.body.token);
    R.check(ot.status === 200, 'an unchanged trainee\'s tool ticket is still given');

    // 7. a record that carries another Portal id is never opened for this one (by name, by the batch's other order, or by
    //    a merge redirect): the Portal sign-in is refused (409 portal-uid-mismatch), and that record is left as it was
    const v1 = await h.portal('Val', 'Kay', 'B250926', 'U-val1');
    const before = JSON.stringify(h.raw('trainee:' + v1.body.id));
    const v2 = await h.portal('Val', 'Kay', 'B250926', 'U-val2');
    R.check(v2.status === 409 && v2.body.code === 'portal-uid-mismatch', `another Portal account with the same name + batch should be refused: ${JSON.stringify(v2)}`);
    const v3 = await h.portal('Val', 'Kay', 'B092526', 'U-val2');
    R.check(v3.status === 409 || (v3.body && v3.body.id !== v1.body.id), `the batch's other order should not open another Portal account's record: ${JSON.stringify(v3.body && (v3.body.id || v3.body.code))}`);
    R.check(JSON.stringify(h.raw('trainee:' + v1.body.id)) === before, 'the other Portal account\'s record should be left as it was');
    const w1 = await h.portal('Wes', 'Lo', 'B100926', 'U-wes1');
    h.rawPut('merged:wes-lo--b111026', { into: w1.body.id });
    const w2 = await h.portal('Wes', 'Lo', 'B111026', 'U-wes2');
    R.check(w2.status === 200 && w2.body.id !== w1.body.id, `a redirect into another Portal account's record should not be followed: ${JSON.stringify(w2.body && w2.body.id)}`);

    // 8. a merged-away id whose record came back (a save that landed after the merge): the sign-in opens the record it was merged into
    const m1 = await h.portal('Mo', 'Ash', 'B100926');
    const m2 = await h.portal('Mo', 'Ash', 'B101026');
    h.rawPut('merged:' + m2.body.id, { into: m1.body.id });
    const m3 = await h.portal('Mo', 'Ash', 'B101026');
    R.check(m3.body.id === m1.body.id, `a recreated merged-away record should not take the sign-in back: ${m3.body.id}`);
    R.check((await h.set('progress:' + m2.body.id, { traineeId: m2.body.id, savedAt: new Date().toISOString(), data: {} }, m2.body.token)).status !== 200, 'and its saves are still refused');

    R.done('Trainee identity: the uid index opens the same record whatever the Portal changed; one day\'s two Batch ID orders are one id; another Portal account\'s or an archived record is not followed.');
})().catch((e) => { console.error(e); process.exit(1); });
