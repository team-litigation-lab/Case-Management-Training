// @check node — 🛡 A Knowledge Check pass can't be forged or slipped past a trainer: a "done" with no score, a Case Flow summary naming another day's id, a trainer's stale copy after a merge, a restore or merge confirm whose device-only scores changed since the preview; and a merged-away id's orphan backups still reach the kept account
// Checked on the Worker (worker-identity.js, worker-account-repair.js, worker.js keepKcResets) and on js/cm-scorecard.js:
//   1. a trainee's write of dayProgress[d].done (or kcUnverified) on a day with no attempt is not stored, and the
//      Scorecard never counts a record's "done" without a recorded score;
//   2. caseFlow.days[k].id is the stored summary's for k: a trainee's write that points Day k at another day's id gets no
//      kc / pass; and the Scorecard reads a summary only when its id is the day's own;
//   3. a trainer's whole-record write from a copy read before a merge keeps the kcReset the merge set (n = the merged
//      day's attempts): a reset open before the merge stays open;
//   4. /api/kc-restore and /api/account-merge confirms name the preview's expectKc: when the trainee changed the device
//      copies the unverified scores come from (before the confirm, or while the merge runs), nothing is written (409);
//   5. an orphan backup a merged-away id writes after its records are gone is read for the account it was merged into
//      (kc-restore of the kept id); one claiming a merged id that never redirected here is not.
// Usage: node .github/scripts/kc-forge-guards.cjs   (no server, no browser needed)
const vm = require('vm'), fs = require('fs'), path = require('path');
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
const T = (d, h = 10) => `2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00.000Z`;

function scorecard() {
    const win = { addEventListener() { } };
    const ctx = { window: win, DAYS: [{ id: 11, cf: { n: 1 } }, { id: 12, cf: { n: 2 } }], document: { addEventListener() { }, getElementById() { return null; }, querySelector() { return null; }, createElement: () => ({ appendChild() { } }), head: { appendChild() { } }, body: { appendChild() { } } }, console, setTimeout, clearTimeout, state: {} };
    win.window = win; vm.createContext(ctx);
    ctx.window = new Proxy(win, { get: (t, k) => k in t ? t[k] : ctx[k], set: (t, k, v) => { t[k] = v; return true; } });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../../js/cm-scorecard.js'), 'utf8'), ctx);
    return { S: win.cmScorecard, days: ctx.DAYS };
}

(async () => {
    const h = await harness({ portalOnly: true });
    const { S, days: [d11, d12] } = scorecard();

    // ---------- 1. "done" with no score ----------
    const t1 = await h.portal('Dee', 'Done', 'B090126', 'U-dee'), I1 = t1.body.id;
    await h.set('trainee:' + I1, Object.assign(await h.get('trainee:' + I1), { dayProgress: { 13: { done: true, kcUnverified: true, trainingDone: true } } }), t1.body.token);
    const r1 = (await h.get('trainee:' + I1)).dayProgress[13] || {};
    R.check(!('done' in r1) && !('kcUnverified' in r1) && r1.trainingDone === true, `a trainee's "done" on a day with no attempt should not be stored: ${JSON.stringify(r1)}`);
    const noScore = { rec: { dayProgress: { 11: { done: true } } }, cf: { days: {} }, data: {} };
    R.check(!S.kcPassed(noScore, d11) && S.compute(noScore).done === 0, 'the Scorecard should not count a "done" with no recorded score');
    R.check(S.kcPassed({ rec: { dayProgress: { 11: { done: true, score: 60, history: [{ score: 60 }] } } }, cf: { days: {} }, data: {} }, d11), 'a record\'s "done" with a recorded attempt still counts');

    // ---------- 2. a summary that names another day's id ----------
    const t2 = await h.portal('Cal', 'Flow', 'B090126', 'U-cal'), I2 = t2.body.id;
    const base2 = await h.get('trainee:' + I2);
    await h.set('trainee:' + I2, Object.assign({}, base2, { dayProgress: { 11: { score: 90, done: true, history: [{ score: 90, passed: true }] } }, caseFlow: { at: T(2), days: { 1: { id: 11 }, 2: { id: 12 } } } }), t2.body.token);
    const cf2 = (await h.get('trainee:' + I2)).caseFlow.days;
    R.check(cf2[1].kc === 90 && cf2[1].passed === true && cf2[2].kc == null, `the summary should follow the record: ${JSON.stringify(cf2)}`);
    const rec2 = await h.get('trainee:' + I2);
    await h.set('trainee:' + I2, Object.assign({}, rec2, { caseFlow: { at: T(3), days: { 1: { id: 11 }, 2: { id: 11 }, 3: { id: 11 } } } }), t2.body.token);
    const cf2b = (await h.get('trainee:' + I2)).caseFlow.days;
    R.check(String(cf2b[2].id) === '12' && cf2b[2].kc == null && !cf2b[2].passed, `Day 2's summary should keep its own id and get no kc from Day 1: ${JSON.stringify(cf2b[2])}`);
    R.check(cf2b[3].id == null && cf2b[3].kc == null && !cf2b[3].passed, `a new day naming another day's id should get no kc or pass: ${JSON.stringify(cf2b[3])}`);
    R.check(cf2b[1].kc === 90 && cf2b[1].passed === true, `Day 1 keeps its own: ${JSON.stringify(cf2b[1])}`);
    const wrongId = { rec: { dayProgress: {} }, cf: { days: { 2: { id: 11, kc: 90, passed: true } } }, data: {} };
    R.check(!S.kcPassed(wrongId, d12) && S.kcBest({}, S.cfDay(wrongId, d12)) == null && S.compute(wrongId).done === 0, 'the Scorecard should not credit a summary that names another day\'s id');
    R.check(S.kcPassed({ rec: { dayProgress: {} }, cf: { days: { 2: { id: 12, kc: 80, passed: true } } }, data: {} }, d12), 'a summary with the day\'s own id counts');

    // ---------- 3. a trainer's stale copy after a merge keeps the merged kcReset ----------
    const merge = (body) => h.api('/api/account-merge', body, h.admin);
    const confirmed = async (body) => { const d = await merge(Object.assign({}, body, { confirm: false })); return { dry: d, done: await merge(Object.assign({}, body, { confirm: true, expectKeep: d.body.keep, expectDelete: d.body.keys && d.body.keys.delete, expectKc: d.body.expectKc })) }; };
    const a = await h.portal('Rae', 'Set', 'B090126'), A = a.body.id;
    const b = await h.portal('Ray', 'Set', 'B090126'), B = b.body.id;
    await h.set('trainee:' + A, Object.assign(await h.get('trainee:' + A), { registeredAt: T(1, 0), lastActive: T(5), dayProgress: { 11: { score: 40, done: false, date: T(2), history: [{ score: 40, passed: false, date: T(2) }] } } }));
    await h.set('trainee:' + B, Object.assign(await h.get('trainee:' + B), { registeredAt: T(1, 0), lastActive: T(4), dayProgress: { 11: { score: 55, done: false, date: T(3), history: [{ score: 55, passed: false, date: T(3) }] } } }));
    const rs = await h.api('/api/kc-reset', { traineeId: A, dayId: 11 }, h.admin);
    R.check(rs.status === 200 && rs.body.open === true, `the test needs an open reset: ${JSON.stringify(rs.body)}`);
    const staleCopy = await h.get('trainee:' + A);   // (a trainer's page, loaded before the merge)
    const m = await confirmed({ ids: [A, B], keep: A });
    R.check(m.done.status === 200 && m.done.body.keep === A, `the merge should go through: ${JSON.stringify(m.done.body && (m.done.body.error || m.done.body.keep))}`);
    const afterM = await h.get('trainee:' + A);
    R.check(afterM.kcReset[11].n === 2 && afterM.dayProgress[11].history.length === 2, `the merge should keep the reset open (n = 2 attempts): ${JSON.stringify(afterM.kcReset[11])}`);
    await h.set('trainee:' + A, Object.assign({}, staleCopy, { approved: true }));
    const afterW = await h.get('trainee:' + A);
    R.check(afterW.approved === true && afterW.kcReset[11].n === afterW.dayProgress[11].history.length && afterW.kcReset[11].n === 2, `a trainer's copy read before the merge should not close the reset: n=${afterW.kcReset[11].n}, attempts=${afterW.dayProgress[11].history.length}`);

    // ---------- 4. the confirm names the preview's device-only scores ----------
    const t4 = await h.portal('Ves', 'Verify', 'B090126', 'U-ves'), I4 = t4.body.id;
    await h.set('trainee:' + I4, Object.assign(await h.get('trainee:' + I4), { registeredAt: T(1, 0) }));
    await h.set('progress:' + I4, { traineeId: I4, savedAt: T(5), data: { 'day-progress': { 12: { score: 65, done: false, date: T(3), history: [{ score: 65, passed: false, date: T(3) }] } } } }, t4.body.token);
    const dry4 = await h.api('/api/kc-restore', { id: I4 }, h.admin);
    R.check(dry4.status === 200 && typeof dry4.body.expectKc === 'string' && /65/.test(dry4.body.expectKc), `the restore's preview should carry what it would write: ${JSON.stringify(dry4.body.expectKc)}`);
    await h.set('progress:' + I4, { traineeId: I4, savedAt: T(6), data: { 'day-progress': { 12: { score: 100, done: true, date: T(3), history: [{ score: 100, passed: true, date: T(3) }] } } } }, t4.body.token);
    const bad4 = await h.api('/api/kc-restore', { id: I4, confirm: true, expectKc: dry4.body.expectKc }, h.admin);
    R.check(bad4.status === 409 && bad4.body.previewAgain && !(await h.get('trainee:' + I4)).dayProgress, `a restore whose scores changed since the preview should write nothing: ${bad4.status} ${JSON.stringify((await h.get('trainee:' + I4)).dayProgress)}`);
    R.check((await h.api('/api/kc-restore', { id: I4, confirm: true }, h.admin)).status === 409, 'a restore confirm without the preview should be refused');
    const dry4b = await h.api('/api/kc-restore', { id: I4 }, h.admin);
    const ok4 = await h.api('/api/kc-restore', { id: I4, confirm: true, expectKc: dry4b.body.expectKc }, h.admin);
    R.check(ok4.status === 200 && ok4.body.ok && (await h.get('trainee:' + I4)).dayProgress[12].score === 100, 'previewed again, the restore goes through with what the trainer saw');
    // the merge: a device-only day changed before the confirm, or while the merge runs (after its redirects)
    const e = await h.portal('Mo', 'Ver', 'B090126'), E = e.body.id;
    const f = await h.portal('Moe', 'Ver', 'B090126'), F = f.body.id;
    for (const id of [E, F]) await h.set('trainee:' + id, Object.assign(await h.get('trainee:' + id), { registeredAt: T(1, 0) }));
    await h.set('progress:' + E, { traineeId: E, savedAt: T(5), data: { 'day-progress': { 13: { score: 65, date: T(3), history: [{ score: 65, passed: false, date: T(3) }] } } } }, e.body.token);
    const dm = await merge({ ids: [E, F], keep: E });
    const row13 = (dm.body.days || []).find((x) => x.day === '13') || {};
    R.check(row13.unverified && /65/.test(dm.body.expectKc || ''), `the merge's preview should carry the device-only day: ${JSON.stringify(row13)} ${dm.body.expectKc}`);
    await h.set('progress:' + E, { traineeId: E, savedAt: T(6), data: { 'day-progress': { 13: { score: 100, date: T(3), history: [{ score: 100, passed: true, date: T(3) }] } } } }, e.body.token);
    const before = JSON.stringify([...h.store.entries()].sort());
    const cm = await merge({ ids: [E, F], keep: E, confirm: true, expectKeep: dm.body.keep, expectDelete: dm.body.keys.delete, expectKc: dm.body.expectKc });
    R.check(cm.status === 409 && cm.body.previewAgain && JSON.stringify([...h.store.entries()].sort()) === before, `a merge whose device-only scores changed since the preview should write nothing: ${cm.status}`);
    const dm2 = await merge({ ids: [E, F], keep: E });
    const KV = h.env.LSH_KV, put0 = KV.put;
    KV.put = async (k, v, o) => {
        if (k === 'cm:merged:' + F && !KV.hitE) { KV.hitE = true; const p = JSON.parse(h.store.get('cm:progress:' + E)); p.data['day-progress'][13] = { score: 99, date: T(3), history: [{ score: 99, passed: true, date: T(3) }] }; h.store.set('cm:progress:' + E, JSON.stringify(p)); }
        return put0(k, v, o);
    };
    const cm2 = await merge({ ids: [E, F], keep: E, confirm: true, expectKeep: dm2.body.keep, expectDelete: dm2.body.keys.delete, expectKc: dm2.body.expectKc });
    KV.put = put0;
    R.check(cm2.status === 409 && cm2.body.previewAgain && !h.has('merged:' + F) && !(h.raw('trainee:' + E).dayProgress || {})[13], `a device-only score changed while the merge ran should stop it, its redirects taken back: ${cm2.status} ${JSON.stringify(h.raw('merged:' + F))}`);

    // ---------- 5. a merged-away id's orphans after its records are gone ----------
    const g = await h.portal('Ola', 'Orphan', 'B090126'), G = g.body.id;
    const k = await h.portal('Olu', 'Orphan', 'B090126'), K = k.body.id;
    for (const id of [G, K]) await h.set('trainee:' + id, Object.assign(await h.get('trainee:' + id), { registeredAt: T(1, 0) }));
    const mg = await confirmed({ ids: [G, K], keep: G });
    R.check(mg.done.status === 200 && h.has('trainee:' + K), `the merge should go through, leaving K until its redirect settles: ${mg.done.status}`);
    h.rawPut('merged:' + K, Object.assign(h.raw('merged:' + K), { at: new Date(Date.now() - 3 * 60000).toISOString() }));
    const mg2 = await confirmed({ ids: [G, K], keep: G });
    R.check(mg2.done.status === 200 && !h.has('trainee:' + K) && !h.has('progress:' + K), `run again after the redirect settled, K's records should be gone: ${JSON.stringify(mg2.done.body && (mg2.done.body.error || mg2.done.body.pendingDelete))}`);
    // (a page left open on K: its save is refused, so it backs its work up under K, which the Worker still takes)
    const ms = Date.now() - 1000;
    const up = await h.api('/api/storage/set', { key: `orphan:${K}:${ms}`, value: JSON.stringify({ traineeId: K, reason: 'save-refused', data: { 'day-progress': { 14: { score: 82, date: T(6), history: [{ score: 82, passed: true, date: T(6) }] } } } }) }, k.body.token);
    R.check(up.status === 200, `the merged-away page's orphan backup should be taken: ${JSON.stringify(up.body)}`);
    // (and one of an id that names itself in mergedFrom but never redirected here: not read)
    const x = await h.portal('Zed', 'Other', 'B090126'), X = x.body.id;
    h.rawPut(`orphan:${X}:${ms}`, { traineeId: X, data: { 'day-progress': { 15: { score: 95, date: T(6), history: [{ score: 95, passed: true, date: T(6) }] } } } });
    const gr = h.raw('trainee:' + G); gr.mergedFrom = (gr.mergedFrom || []).concat([X]); h.rawPut('trainee:' + G, gr);
    const kr = await h.api('/api/kc-restore', { id: G }, h.admin);
    const r14 = (kr.body.days || []).find((y) => y.day === '14'), r15 = (kr.body.days || []).find((y) => y.day === '15');
    R.check(r14 && r14.changed && r14.recovered.score === 82 && new RegExp('orphan:' + K).test(r14.source), `the kept account's restore should read the merged-away id's orphan: ${JSON.stringify(kr.body.days)}`);
    R.check(!r15, `an orphan of an id that never redirected here should not be read: ${JSON.stringify(r15)}`);
    const mo = await merge({ ids: [G, X], keep: G });
    R.check((mo.body.orphans || []).some((o) => o.startsWith(`orphan:${K}:`)), `the kept account's merge should list the merged-away id's orphan: ${JSON.stringify(mo.body.orphans)}`);

    R.done('🛡 KC guards: no pass from a bare "done" or another day\'s summary id, a stale trainer copy keeps the merged reset, a confirm whose device-only scores changed is refused, and a merged-away id\'s orphans reach the kept account.');
})().catch((e) => { console.error(e); process.exit(1); });
