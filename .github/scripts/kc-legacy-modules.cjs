// @check node — 🏅 A module's Automated score (a) is never dropped for a day whose official Knowledge Check the Worker can't re-score (taken before picks were kept, a score a trainer restored, a 21-pick attempt whose extra question was unpublished since)
// worker-identity.js moduleQuiz / officialCaseFlow:
//   1. an attempt with no picks and no stored module summary: the device's a is kept, marked aUnverified (not the AI half alone);
//   2. an attempt with no picks and a stored module a: the stored a stands (the device can't raise it), marked aUnverified;
//   3. a 21-pick attempt (a published extra question), the extra question unpublished since: the official attempt is the one
//      recorded at the day's score, and its modules' shares are still worked out from its picks (no aUnverified).
// Usage: node .github/scripts/kc-legacy-modules.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const { picksFor, KC_KEY } = require('./kc-picks.cjs');
const R = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    const m1 = KC_KEY['11'].mod[0], at = '2026-09-01T10:00:00.000Z';
    const sign = async (first) => { const t = await h.portal(first, 'Legacy', 'B100926', 'U-' + first); return { id: t.body.id, tok: t.body.token, key: 'trainee:' + t.body.id }; };
    const save = (u, mods) => h.set(u.key, Object.assign({}, h.raw(u.key), { caseFlow: { at: new Date().toISOString(), days: { 1: { id: 11, kc: 80, passed: true, modules: mods } } } }), u.tok);
    const mod = (u) => (((((h.raw(u.key) || {}).caseFlow || {}).days || {})[1] || {}).modules || {})[m1];

    // 1. no picks, nothing stored
    const a = await sign('Ana');
    h.rawPut(a.key, Object.assign({}, h.raw(a.key), { approved: true, dayProgress: { 11: { score: 80, done: true, date: at, history: [{ score: 80, passed: true, date: at }] } } }));
    let r = await save(a, { [m1]: { a: 85, t: null, c: null, ai: 70 } });
    R.check(r.status === 200 && mod(a) && mod(a).a === 85 && mod(a).aUnverified === true && mod(a).ai === 70, `an attempt with no picks should keep the device's a, marked aUnverified: ${JSON.stringify(mod(a))}`);

    // 2. no picks, a stored module a
    const b = await sign('Ben');
    h.rawPut(b.key, Object.assign({}, h.raw(b.key), { approved: true, dayProgress: { 11: { score: 80, done: true, date: at, history: [{ score: 80, passed: true, date: at }] } },
        caseFlow: { at, days: { 1: { id: 11, kc: 80, passed: true, modules: { [m1]: { a: 88, t: null, c: null, ai: 70 } } } } } }));
    r = await save(b, { [m1]: { a: 100, t: null, c: null, ai: 70 } });
    R.check(r.status === 200 && mod(b) && mod(b).a === 88 && mod(b).aUnverified === true, `the stored a should stand when the attempt has no picks: ${JSON.stringify(mod(b))}`);

    // 3. a 21-pick attempt, its extra question unpublished since
    const c = await sign('Cy');
    const picks = picksFor(11, 75).concat([2]);   // 15 of 20 right, and the extra one right: 16 of 21 = 76
    h.rawPut(c.key, Object.assign({}, h.raw(c.key), { approved: true, dayProgress: { 11: { score: 76, done: true, date: at, history: [{ score: 76, passed: true, date: at, answers: picks }] } } }));
    h.rawPut('extraquiz:day11', { questions: [{ q: 'Extra', opts: ['a', 'b', 'c', 'd'], a: 2, status: 'draft' }] });
    r = await save(c, { [m1]: { a: 0, t: null, c: null, ai: 50 } });
    const q = KC_KEY['11'].a.slice(0, 20).map((x, i) => i).filter((i) => KC_KEY['11'].mod[i] === m1), right = q.filter((i) => picks[i] === KC_KEY['11'].a[i]).length;
    const want = Math.round((Math.round((right / q.length) * 100) + 50) / 2);
    R.check(r.status === 200 && mod(c) && mod(c).a === want && !mod(c).aUnverified, `the attempt recorded at the day's score should give the modules' quiz share (a ${want}): ${JSON.stringify(mod(c))}`);

    R.done("kc-legacy-modules: a day whose official attempt can't be re-scored keeps its modules' Automated score (the stored one, else the device's, marked aUnverified).");
})().catch((e) => { console.error(e); process.exit(1); });
