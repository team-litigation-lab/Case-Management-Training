// @check node — A trainer's 🔁 Reset Knowledge Check allows exactly one new attempt on the Worker: set by the Worker (its clock, the trainer, the attempts counted), kcReset is the trainer's, the retake keeps the best score whatever the clocks say, and a used reset reopens nothing
// js/cm-kc-reset.js asks the Worker (/api/kc-reset, kcResetApi) to set trainee:<id>.kcReset {<dayId>: {at, by, n, log}};
// worker.js keeps it from a trainee's own write (PROTECTED_TRAINEE_FIELDS) and keepKcAttempts honours it (kcRetake).
// Checked on the Worker itself, no browser:
//   1. a trainee can't write kcReset, nor call /api/kc-reset (theirs is dropped, a trainer's stays through the trainee's
//      later writes); the Worker stamps at (its clock), by (the trainer signed in) and n (the attempts counted);
//   2. with no reset, a second attempt is refused as before;
//   3. after a reset newer than the day's last attempt, ONE new attempt is taken: the history grows by one, the score is
//      the best of the old and the new (nothing recalculated), done if either passed;
//   4. a third attempt after that is refused (the reset is used); two entries added at once are refused; the new
//      attempt is dated by the Worker, after the reset;
//   5. a second reset allows one more; a lower new score keeps the best one;
//   6. clocks don't matter: a trainee whose device runs 10 minutes fast fails, the trainer resets 2 minutes later, and
//      the retake is taken (attempts are counted, not dates compared);
//   7. a record from before history was kept (a score, no history): the retake keeps the original attempt as
//      history[0] and the best score;
//   8. a trainer's page writing back a copy of the record loaded before the reset keeps the reset (its log is never
//      shortened), and the reset itself changes nothing else of the record (a trainee's save meanwhile stays).
// Usage: node .github/scripts/kc-reset-worker.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');
const failures = [], fail = (m) => failures.push(m);
(async () => {
    const worker = (await import(pathToFileURL(path.join(__dirname, '../../worker.js')).href)).default;
    const store = new Map();
    const env = {
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) }
    };
    const api = async (p, body, token) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() { } });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const t = (await api('/api/auth/trainee', { name: 'Kim Reset', batch: 'B100926' })).body;
    const admin = (await api('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    const key = 'trainee:' + t.id;
    const read = async () => { const r = await api('/api/storage/get', { key }, admin); return r.body && r.body.value ? JSON.parse(r.body.value) : null; };
    const write = (rec, tok = t.token) => api('/api/storage/set', { key, value: JSON.stringify(rec) }, tok);
    const base = { id: t.id, name: 'Kim Reset', batch: 'B100926' };
    const iso = (ms) => new Date(Date.now() + ms).toISOString();
    const attempt = (score, ms) => ({ score, passed: score >= 70, date: iso(ms) });
    // the trainee's write: their day as js/cm-kc-once.js leaves it after a submit (the history plus the new attempt)
    const day = (h) => ({ 11: { score: Math.max(...h.map(x => x.score)), done: h.some(x => x.passed), date: h[h.length - 1].date, history: h } });

    await write(base);
    const first = attempt(55, -3600e3);
    await write(Object.assign({}, base, { dayProgress: day([first]) }));
    // 1. a trainee can't reset their own check
    await write(Object.assign({}, base, { dayProgress: day([first]), kcReset: { 11: { at: iso(-1000), by: 'me' } } }));
    let r = await read();
    if (r.kcReset) fail(`a trainee's own kcReset should be dropped: ${JSON.stringify(r.kcReset)}`);
    // 2. no reset: a second attempt is refused
    await write(Object.assign({}, base, { dayProgress: day([first, attempt(95, -90e3)]) }));
    r = await read();
    if (r.dayProgress[11].score !== 55 || r.dayProgress[11].done) fail(`without a reset a second attempt should be refused: ${JSON.stringify(r.dayProgress[11])}`);
    const h1 = r.dayProgress[11].history;
    // a trainee can't reset through the Worker's route either
    if ((await api('/api/kc-reset', { traineeId: t.id, dayId: 11 }, t.token)).status !== 403) fail('a trainee calling /api/kc-reset should be refused (403)');
    // 3. the trainer resets Day 11 (/api/kc-reset: the Worker stamps it)
    const before = Date.now(), rr = await api('/api/kc-reset', { traineeId: t.id, dayId: 11 }, admin);
    if (rr.status !== 200 || !rr.body.open) fail(`the trainer's reset should be set and open: ${JSON.stringify(rr)}`);
    if ((await api('/api/kc-reset', { traineeId: t.id, dayId: 11 }, admin)).status !== 409) fail('a second reset while the first is unused should be refused (409)');
    r = await read();
    const reset1 = r.kcReset && r.kcReset[11] && r.kcReset[11].at;
    if (!reset1 || Date.parse(reset1) < before - 5 || r.kcReset[11].n !== 1 || r.kcReset[11].by !== 'Trainer (admin password)' || (r.kcReset[11].log || []).length !== 1) fail(`the Worker should stamp the reset {at: its clock, by: the trainer, n: 1, log}: ${JSON.stringify(r.kcReset)}`);
    // the trainee's next ordinary save (no kcReset in it) keeps the trainer's
    await write(Object.assign({}, base, { dayProgress: { 11: r.dayProgress[11] } }));
    r = await read();
    if (!r.kcReset || !r.kcReset[11] || r.kcReset[11].at !== reset1) fail(`the trainer's kcReset should stay through the trainee's own write: ${JSON.stringify(r.kcReset)}`);
    // two entries at once: refused
    await write(Object.assign({}, base, { dayProgress: day(h1.concat([attempt(80, -2000), attempt(90, -1000)])) }));
    r = await read();
    if (r.dayProgress[11].history.length !== h1.length) fail('two new attempts at once should be refused');
    // the one new attempt
    await write(Object.assign({}, base, { dayProgress: day(h1.concat([attempt(85, -1000)])) }));
    r = await read();
    let p = r.dayProgress[11];
    if (!(Date.parse(p.history[p.history.length - 1].date) > Date.parse(reset1))) fail('the new attempt should be dated by the Worker, after the reset');
    if (p.history.length !== h1.length + 1 || p.score !== 85 || !p.done || p.history[0].score !== 55) fail(`after a reset one new attempt should be taken, the best score kept: ${JSON.stringify(p)}`);
    // 4. the reset is used: a third attempt is refused
    await write(Object.assign({}, base, { dayProgress: day(p.history.concat([attempt(100, -500)])) }));
    r = await read(); p = r.dayProgress[11];
    if (p.history.length !== h1.length + 1 || p.score !== 85) fail(`a used reset should allow nothing more: ${JSON.stringify(p)}`);
    // 5. a second reset; a lower score keeps the best one
    if ((await api('/api/kc-reset', { traineeId: t.id, dayId: 11 }, admin)).status !== 200) fail('a second reset, once the first is used, should be set');
    await write(Object.assign({}, base, { dayProgress: day(p.history.concat([attempt(40, -100)])) }));
    r = await read(); p = r.dayProgress[11];
    if (p.history.length !== h1.length + 2 || p.score !== 85 || !p.done) fail(`a second reset allows one more, and a lower score keeps the best: ${JSON.stringify(p)}`);
    r = await read();
    if ((r.kcReset[11].log || []).length !== 2 || r.kcReset[11].n !== 2) fail(`the reset log should keep every reset, the second at n = 2: ${JSON.stringify(r.kcReset[11])}`);

    // 6. a trainee's clock 10 minutes fast: attempts are counted, so the reset two minutes later still reopens the check
    const t2 = (await api('/api/auth/trainee', { name: 'Fast Clock', batch: 'B100926' })).body, key2 = 'trainee:' + t2.id, base2 = { id: t2.id, name: 'Fast Clock', batch: 'B100926' };
    const w2 = (rec, tok = t2.token) => api('/api/storage/set', { key: key2, value: JSON.stringify(rec) }, tok);
    const r2 = async () => JSON.parse((await api('/api/storage/get', { key: key2 }, admin)).body.value);
    await w2(base2); const fast = attempt(50, 10 * 60e3);
    await w2(Object.assign({}, base2, { dayProgress: day([fast]) }));
    if ((await api('/api/kc-reset', { traineeId: t2.id, dayId: 11 }, admin)).status !== 200) fail('the reset of a fast-clock trainee should be set');
    await w2(Object.assign({}, base2, { dayProgress: day([fast, attempt(90, 10 * 60e3 + 1000)]) }));
    p = (await r2()).dayProgress[11];
    if (p.history.length !== 2 || p.score !== 90 || !p.done) fail(`a trainee whose clock runs fast should still get the retake after a reset: ${JSON.stringify(p)}`);

    // 7. a record from before history was kept: its one attempt stays history[0]
    const t3 = (await api('/api/auth/trainee', { name: 'Old Record', batch: 'B100926' })).body, key3 = 'trainee:' + t3.id, base3 = { id: t3.id, name: 'Old Record', batch: 'B100926' };
    const w3 = (rec, tok = t3.token) => api('/api/storage/set', { key: key3, value: JSON.stringify(rec) }, tok);
    const oldDate = iso(-86400e3);
    await w3(base3); await w3(Object.assign({}, base3, { dayProgress: { 11: { score: 60, done: false, date: oldDate } } }), admin);
    if ((await api('/api/kc-reset', { traineeId: t3.id, dayId: 11 }, admin)).status !== 200) fail('a legacy record (a score, no history) should be resettable');
    await w3(Object.assign({}, base3, { dayProgress: { 11: { score: 75, done: true, date: iso(0), history: [{ score: 75, passed: true, date: iso(0) }] } } }));
    p = JSON.parse((await api('/api/storage/get', { key: key3 }, admin)).body.value).dayProgress[11];
    if (!p.history || p.history.length !== 2 || p.history[0].score !== 60 || p.history[1].score !== 75 || p.score !== 75 || !p.done) fail(`a legacy record's retake should keep the original attempt as history[0] and the best score: ${JSON.stringify(p)}`);

    // 8. a stale copy of the record written back by a trainer's page keeps the reset; the reset touches nothing else
    const stale = await r2();
    await w2(Object.assign({}, stale, { dayProgress: stale.dayProgress, notes: 'saved by the trainee' }));
    if ((await api('/api/kc-reset', { traineeId: t2.id, dayId: 11 }, admin)).status !== 200) fail('a second reset of the fast-clock trainee should be set');
    let now2 = await r2();
    if (now2.notes !== 'saved by the trainee') fail('the reset should change nothing of the record but kcReset (the trainee\'s save meanwhile is kept)');
    delete stale.kcReset; stale.approved = true;
    await w2(stale, admin);
    now2 = await r2();
    if (!now2.kcReset || (now2.kcReset[11].log || []).length !== 2) fail(`a trainer's write of a copy loaded before the reset should keep the reset: ${JSON.stringify(now2.kcReset)}`);

    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('🔁 Reset Knowledge Check on the Worker: kcReset is the trainer\'s alone and stamped by the Worker (its clock, the trainer, the attempts counted), a reset allows exactly one new attempt whatever the clocks say, a legacy record keeps its first attempt, the best score is kept, a used reset reopens nothing, a stale trainer write keeps it, and every reset is logged.');
})().catch(e => { console.error(e); process.exit(1); });
