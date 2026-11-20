// @check node — 🔗 The Portal's simulator results and graded calls land on the record this course keeps: trainee-alias:<the Portal's id> leads there after a Batch ID or name change on the Portal (the ticket's u), a portal-batch move and a trainer's 👥 merge (chains re-pointed, the kept id's own alias removed, taken back if the merge stops), and goes with a redirect removed
// Platform QA 2026-11-19, CM finding 4. The Portal (functions/api/sim-results.js toCourseFor, call-results.js) works the
// id out from the trainee's Portal name + batch (courseTraineeId) and follows <prefix>trainee-alias:<that id> one hop; this
// check does the same lookup on the Worker's KV (portalLands) after each step.
//   1. A Batch ID corrected on the Portal, the ticket carrying u: the sign-in opens the record the trainee had (its
//      Knowledge Check kept), and the Portal's id for the new batch leads to it. Signing in again changes nothing.
//   2. A name changed on the Portal (same u, the uid index): the new name's id leads to the same record.
//   3. A trainee signing in under their own id: no alias (and a stale one is cleared).
//   4. A trainer's 👥 merge: each merged-away id leads to the kept one, so does an alias that led to a merged-away id, the
//      kept id's own alias is removed, the redirects backup holds the aliases as they were; and a merge that stops
//      after writing them takes them back.
//   5. Account Repair's removeRedirect (a merged:<id> left on a live record) removes that id's alias too, backed up.
//   6. A namesake: another Portal user of the same name with a live record in the batch a trainee is moved to keeps their
//      own results: the moved trainee's sign-in writes no alias over that record (and takes back one it wrote before).
// Usage: node .github/scripts/trainee-alias.cjs
const { harness, reporter } = require('./worker-harness.cjs');

const R = reporter();
const slugPart = (t) => String(t || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
// the Portal's courseTraineeId (functions/api/call-results.js)
const portalId = (first, last, batch) => { const slug = slugPart(`${first} ${last}`.trim()).slice(0, 40); const b = slugPart(batch).slice(0, 20); return b ? `${slug}--${b}` : slug; };
const alias = (h, id) => (h.store.has(`cm:trainee-alias:${id}`) ? h.store.get(`cm:trainee-alias:${id}`) : null);
const portalLands = (h, first, last, batch) => { const id = portalId(first, last, batch); const a = alias(h, id); return a && /^[a-z0-9-]{1,100}$/.test(a) ? a : id; };
const kcOf = (h, id) => { const r = h.raw('trainee:' + id); return r && r.dayProgress && r.dayProgress[11] ? r.dayProgress[11].score : null; };

(async () => {
    // 1. a Batch ID corrected on the Portal (u)
    {
        const h = await harness({ portalOnly: true });
        const s1 = await h.portal('Mark', 'Lee', 'B100126', 'U-mark');
        const old = s1.body.id;
        const rec = h.raw('trainee:' + old); rec.dayProgress = { 11: { score: 90, done: true, history: [{ score: 90, passed: true, date: new Date().toISOString() }] } }; h.rawPut('trainee:' + old, rec);
        R.check(alias(h, old) === null, `a sign-in under the trainee's own id writes no alias: ${alias(h, old)}`);
        const s2 = await h.portal('Mark', 'Lee', 'B110226', 'U-mark');
        R.check(s2.status === 200 && s2.body.id === old && kcOf(h, old) === 90, `the corrected batch opens the record the trainee had, its KC kept: ${JSON.stringify({ id: s2.body.id, kc: kcOf(h, old) })}`);
        R.check(portalLands(h, 'Mark', 'Lee', 'B110226') === old, `a simulator result filed by the Portal under the new batch should land on ${old}: ${portalLands(h, 'Mark', 'Lee', 'B110226')}`);
        const meta = [...(await h.env.LSH_KV.list({ prefix: 'cm:trainee-alias:' })).keys].find((k) => k.name === 'cm:trainee-alias:mark-lee--b110226');
        R.check(meta && meta.metadata && meta.metadata.into === old, 'the alias carries its target as metadata too (a listing shows where each one leads)');
        const aliases = () => h.ids('trainee-alias:').sort().join(',');
        const before = aliases();
        const s3 = await h.portal('Mark', 'Lee', 'B110226', 'U-mark');
        R.check(s3.body.id === old && alias(h, 'mark-lee--b110226') === old && aliases() === before, `signing in again keeps the one alias: ${aliases()}`);

        // 2. a name changed on the Portal (the uid index)
        const s4 = await h.portal('Marc', 'Lee', 'B110226', 'U-mark');
        R.check(s4.body.id === old, `the renamed trainee (same u) opens their record: ${s4.body.id}`);
        R.check(portalLands(h, 'Marc', 'Lee', 'B110226') === old, `a result filed under the new name lands on ${old}: ${portalLands(h, 'Marc', 'Lee', 'B110226')}`);

        // 3. a stale alias on a trainee's own id is cleared when they sign in under it
        h.store.set('cm:trainee-alias:kim-park--b100126', 'someone-else--b100126');
        const k1 = await h.portal('Kim', 'Park', 'B100126', 'U-kim');
        R.check(k1.body.id === 'kim-park--b100126' && alias(h, 'kim-park--b100126') === null, `a trainee signed in under their own id clears a stale alias: ${alias(h, 'kim-park--b100126')}`);
    }

    // 4. a trainer's 👥 merge
    const mergeOf = (h) => {
        const merge = (body) => h.api('/api/account-merge', body, h.admin);
        return async (body) => { const d = await merge(Object.assign({}, body, { confirm: false })); return { dry: d, res: await merge(Object.assign({}, body, { confirm: true, expectKeep: d.body && d.body.keep, expectDelete: d.body && d.body.keys && d.body.keys.delete, expectKc: d.body && d.body.expectKc })) }; };
    };
    {
        const h = await harness({ portalOnly: true });
        const confirmed = mergeOf(h);
        const a = await h.portal('Ida', 'Moss', 'B100126'), b = await h.portal('Ida', 'Moss', 'B110226');
        // (an earlier alias that led to the account merged away, and one on the account kept)
        h.store.set('cm:trainee-alias:ida-moss--b010126', b.body.id);
        h.store.set('cm:trainee-alias:' + a.body.id, 'nobody--b100126');
        const { dry, res } = await confirmed({ ids: [a.body.id, b.body.id], keep: a.body.id, name: 'Ida Moss', batch: 'B100126' });
        R.check(res.status === 200 && res.body.keep === a.body.id, `the merge: ${JSON.stringify(res.body && (res.body.error || res.body.keep))}`);
        R.check(Array.isArray(dry.body.aliases) && dry.body.aliases.length === 3, `the preview lists the aliases it changes: ${JSON.stringify(dry.body.aliases)}`);
        R.check(alias(h, b.body.id) === a.body.id, `the merged-away id leads to the kept one: ${alias(h, b.body.id)}`);
        R.check(portalLands(h, 'Ida', 'Moss', 'B110226') === a.body.id, 'a result the Portal files under the merged-away batch lands on the kept record');
        R.check(alias(h, 'ida-moss--b010126') === a.body.id, `an alias that led to the merged-away id leads to the kept one now: ${alias(h, 'ida-moss--b010126')}`);
        R.check(alias(h, a.body.id) === null, `the kept id's own alias is removed: ${alias(h, a.body.id)}`);
        const rk = h.ids('backup:' + a.body.id).find((k) => /:redirects$/.test(k));
        const bk = rk ? h.raw(rk) : null;
        R.check(bk && bk.keys && bk.keys['trainee-alias:ida-moss--b010126'] === b.body.id && bk.keys['trainee-alias:' + a.body.id] === 'nobody--b100126', `the redirects backup holds the aliases as they were: ${JSON.stringify(bk && bk.keys)}`);
        // a later merge of the kept account into another: the chain follows
        const c = await h.portal('Ida', 'Moss', 'B120326');
        const m2 = await confirmed({ ids: [a.body.id, c.body.id], keep: c.body.id, name: 'Ida Moss', batch: 'B120326' });
        R.check(m2.res.status === 200 && m2.res.body.keep === c.body.id, `the second merge: ${JSON.stringify(m2.res.body && (m2.res.body.error || m2.res.body.keep))}`);
        for (const id of [a.body.id, b.body.id, 'ida-moss--b010126']) R.check(alias(h, id) === c.body.id, `after the second merge ${id} leads to ${c.body.id} (one hop): ${alias(h, id)}`);
    }
    {
        // a merge that stops after its redirects takes its aliases back
        const h = await harness({ portalOnly: true });
        const confirmed = mergeOf(h);
        const a = await h.portal('Oto', 'Vale', 'B100126'), b = await h.portal('Oto', 'Vale', 'B110226');
        h.store.set('cm:trainee-alias:oto-vale--b010126', b.body.id);
        h.failPut = (k) => /^cm:backup:[^:]+:\d+$/.test(k);   // (the accounts' own backups, written after the redirects)
        const { res } = await confirmed({ ids: [a.body.id, b.body.id], keep: a.body.id, name: 'Oto Vale', batch: 'B100126' });
        h.failPut = null;
        R.check(res.status === 500, `the merge should stop when a backup can't be written: ${res.status}`);
        R.check(alias(h, b.body.id) === null && alias(h, 'oto-vale--b010126') === b.body.id, `a stopped merge takes its aliases back: ${JSON.stringify({ [b.body.id]: alias(h, b.body.id), 'oto-vale--b010126': alias(h, 'oto-vale--b010126') })}`);
        R.check(h.raw('merged:' + b.body.id) === null, 'and its redirects');
    }

    // 5. removeRedirect
    {
        const h = await harness({ portalOnly: true });
        const a = await h.portal('Lu', 'Sol', 'B100126'), b = await h.portal('Lu', 'Sol', 'B110226');
        h.rawPut('merged:' + b.body.id, { into: a.body.id, at: new Date().toISOString(), by: 'old batch sheet' });
        h.store.set('cm:trainee-alias:' + b.body.id, a.body.id);
        const rr = await h.api('/api/account-merge', { removeRedirect: b.body.id, confirm: true }, h.admin);
        R.check(rr.status === 200 && rr.body.aliasRemoved === 'trainee-alias:' + b.body.id, `removeRedirect: ${JSON.stringify(rr.body)}`);
        R.check(alias(h, b.body.id) === null && portalLands(h, 'Lu', 'Sol', 'B110226') === b.body.id, 'a live record whose redirect is removed gets its own results again');
        const bk = rr.body.backup ? h.raw(rr.body.backup) : null;
        R.check(bk && bk.keys && bk.keys['trainee-alias:' + b.body.id] === a.body.id, 'the alias removed is in the backup');
    }

    // 6. a namesake: another Portal user with the same name really in the batch the trainee is moved to
    {
        const h = await harness({ portalOnly: true });
        const u1 = await h.portal('Mark', 'Lee', 'B100126', 'U1');
        const u3 = await h.portal('Mark', 'Lee', 'B110226', 'U3');
        R.check(u1.body.id === 'mark-lee--b100126' && u3.body.id === 'mark-lee--b110226', `two namesakes, two records: ${u1.body.id}, ${u3.body.id}`);
        const moved = await h.portal('Mark', 'Lee', 'B110226', 'U1');   // U1's batch corrected on the Portal
        R.check(moved.status === 200 && moved.body.id === u1.body.id, `U1's moved sign-in opens U1's record: ${JSON.stringify(moved.body && moved.body.id)}`);
        R.check(alias(h, 'mark-lee--b110226') === null && portalLands(h, 'Mark', 'Lee', 'B110226') === u3.body.id,
            `U3's live record keeps U3's Portal results (no alias over it): trainee-alias:mark-lee--b110226 = ${alias(h, 'mark-lee--b110226')}`);
        await h.portal('Mark', 'Lee', 'B110226', 'U3'); await h.portal('Mark', 'Lee', 'B110226', 'U1');
        R.check(alias(h, 'mark-lee--b110226') === null, `signing in by turns never points U3's id at U1: ${alias(h, 'mark-lee--b110226')}`);
        // (an alias a sign-in wrote before the namesake's record existed is taken back at U1's next sign-in)
        h.store.set('cm:trainee-alias:mark-lee--b110226', u1.body.id);
        await h.portal('Mark', 'Lee', 'B110226', 'U1');
        R.check(alias(h, 'mark-lee--b110226') === null, `an alias to U1 over U3's live record is taken back: ${alias(h, 'mark-lee--b110226')}`);
        R.check(h.raw('trainee:' + u3.body.id) && h.raw('trainee:' + u3.body.id).portalUid === 'U3', "U3's record is untouched");
    }

    R.done('trainee-alias:<the Portal\'s id> leads to the kept record after a Batch ID or name change, a sign-in under the own id clears it, a 👥 merge re-points every alias (taken back if it stops), and removeRedirect removes it.');
})().catch((e) => { console.error(e); process.exit(1); });
