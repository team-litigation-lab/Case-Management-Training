// @check node — After a merge or a portal-batch redirect, the Portal sign-in followed by /api/auth/trainee succeeds (no 403 portal-required) and writes to the kept id
// js/portal-gate.js signs a trainee in with the Portal's ticket (/api/auth/portal), then the page's submitLogin renews the
// session with the Portal's name and batch (/api/auth/trainee). Under single sign-on that renewal used to be refused unless
// the token's id was the name + batch's own id, so a trainee the Worker had moved to another id was locked out. worker.js
// now also accepts the id the name + batch resolve to (resolveTrainee: the uid index, merged:<id>). Checked on the Worker:
//   1. a Batch ID corrected on the Portal (the portal-batch redirect, merged:<new id> = {into}): the sign-in opens the old
//      id, the renewal under the new Batch ID is accepted, and the trainee's save lands on the old id;
//   2. the same through the uid index (a renamed trainee);
//   3. a trainer's merge (merged:<other> = {into: keep}, the other's record gone): the sign-in under the other's name opens
//      the kept id, the renewal is accepted, the save lands on the kept id; a page still signed in to the merged-away id
//      is renewed onto the kept id (and its own writes are still refused, so it can't bring the old account back);
//   4. nothing else is let in: a token with an unrelated name + batch is refused, and a renewal never hands out another
//      trainee's id.
// Usage: node .github/scripts/merged-signin.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    const renew = (name, batch, token) => h.api('/api/auth/trainee', { name, batch }, token);

    // 1. the portal-batch redirect (no uid index yet: a record from before it)
    const a = await h.portal('Alex', 'Rivera', 'B090126', 'U-alex');
    const oldId = a.body.id;
    h.store.delete('cm:uid:U-alex');
    const a2 = await h.portal('Alex', 'Rivera', 'B100926', 'U-alex');
    R.check(a2.status === 200 && a2.body.id === oldId, `the corrected Batch ID should open ${oldId}: ${JSON.stringify(a2.body && a2.body.id)}`);
    R.check((h.raw('merged:alex-rivera--b100926') || {}).into === oldId, 'the portal-batch redirect should be left (merged:<new id>)');
    const r1 = await renew('Alex Rivera', 'B100926', a2.body.token);
    R.check(r1.status === 200 && r1.body.id === oldId, `the renewal under the corrected Batch ID should be accepted: ${JSON.stringify(r1)}`);
    const w1 = await h.set('progress:' + oldId, { traineeId: oldId, savedAt: new Date().toISOString(), data: { notes: 'mine' } }, r1.body && r1.body.token);
    R.check(w1.status === 200 && (h.raw('progress:' + oldId) || {}).data && h.raw('progress:' + oldId).data.notes === 'mine', `the trainee's save should land on ${oldId}: ${JSON.stringify(w1)}`);

    // 2. the uid index (a renamed trainee)
    const b = await h.portal('Bea', 'Cruz', 'B100926', 'U-bea');
    const b2 = await h.portal('Beatriz', 'Cruz', 'B100926', 'U-bea');
    R.check(b2.body.id === b.body.id, 'the renamed trainee should open their own record');
    const r2 = await renew('Beatriz Cruz', 'B100926', b2.body.token);
    R.check(r2.status === 200 && r2.body.id === b.body.id, `the renewal under the new name should be accepted: ${JSON.stringify(r2)}`);

    // 3. a trainer's merge: X (the newer account, the trainee's current name) merged into K (the older one)
    const k = await h.portal('Cal', 'Dee', 'B090126');
    const x = await h.portal('Cal', 'Dee', 'B100926');
    const keep = k.body.id, other = x.body.id;
    await h.api('/api/storage/delete', { key: 'trainee:' + other }, h.admin);
    h.rawPut('merged:' + other, { into: keep, at: new Date().toISOString() });
    const x2 = await h.portal('Cal', 'Dee', 'B100926');
    R.check(x2.body.id === keep, `the sign-in under the merged-away name should open the kept id: ${x2.body.id}`);
    const r3 = await renew('Cal Dee', 'B100926', x2.body.token);
    R.check(r3.status === 200 && r3.body.id === keep, `the renewal after a merge should be accepted (was 403 portal-required): ${JSON.stringify(r3)}`);
    const rec = await h.get('trainee:' + keep);
    rec.dayProgress = { 11: { score: 80, done: true, history: [{ score: 80, passed: true, date: new Date().toISOString() }] } };
    const w3 = await h.set('trainee:' + keep, rec, r3.body && r3.body.token);
    R.check(w3.status === 200 && (h.raw('trainee:' + keep).dayProgress || {})[11], `the save after a merge should land on the kept id: ${JSON.stringify(w3)}`);
    // a page still signed in to the merged-away id
    const r4 = await renew('Cal Dee', 'B100926', x.body.token);
    R.check(r4.status === 200 && r4.body.id === keep, `a page signed in to the merged-away id should be renewed onto the kept id: ${JSON.stringify(r4)}`);
    const w4 = await h.set('trainee:' + other, { id: other, name: 'Cal Dee' }, x.body.token);
    R.check(w4.status === 403 && !h.has('trainee:' + other), 'the merged-away id\'s own writes should still be refused');

    // 4. nothing else is let in
    const z = await h.portal('Zed', 'Other', 'B100926');
    const r5 = await renew('Zed Other', 'B100926', k.body.token);
    R.check(r5.status === 403, `a token with someone else's name + batch should be refused: ${JSON.stringify(r5)}`);
    const r6 = await renew('Zed Other', 'B100926', b.body.token);
    R.check(!(r6.body && r6.body.id === z.body.id), `a renewal should never hand out another trainee's id: ${JSON.stringify(r6.body && r6.body.id)}`);
    const r7 = await renew('Zed Other', 'B100926');
    R.check(r7.status === 403, 'a name + batch with no session should be refused (portal-required)');

    R.done('Merged sign-in: after a portal-batch redirect, a uid redirect or a trainer\'s merge, the Portal sign-in and its renewal open the kept id and the trainee\'s saves land there; nothing else is let in.');
})().catch((e) => { console.error(e); process.exit(1); });
