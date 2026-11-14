// @check node — A trainer's 🔁 Reset Knowledge Check allows exactly one new attempt on the Worker: kcReset is the trainer's, the retake keeps the best score, and a used reset reopens nothing
// js/cm-kc-reset.js writes trainee:<id>.kcReset {<dayId>: {at, by, log}}; worker.js keeps it from a trainee's own write
// (PROTECTED_TRAINEE_FIELDS) and keepKcAttempts honours it (kcRetake). Checked on the Worker itself, no browser:
//   1. a trainee can't write kcReset (theirs is dropped, a trainer's stays through the trainee's later writes);
//   2. with no reset, a second attempt is refused as before;
//   3. after a reset newer than the day's last attempt, ONE new attempt is taken: the history grows by one, the score is
//      the best of the old and the new (nothing recalculated), done if either passed;
//   4. a third attempt after that is refused (the reset is used); two entries added at once are refused; the new
//      attempt is dated by the Worker, after the reset;
//   5. a second reset allows one more; a lower new score keeps the best one.
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
    // 3. the trainer resets Day 11 (the admin write path: the whole record, kcReset added)
    const reset1 = iso(-60e3);
    r.kcReset = { 11: { at: reset1, by: 'Trainer Tess', log: [{ at: reset1, by: 'Trainer Tess' }] } };
    await write(r, admin);
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
    await new Promise(res => setTimeout(res, 20)); const reset2 = iso(0);
    r.kcReset[11] = { at: reset2, by: 'Trainer Tess', log: r.kcReset[11].log.concat([{ at: reset2, by: 'Trainer Tess' }]) };
    await write(r, admin);
    await write(Object.assign({}, base, { dayProgress: day(p.history.concat([attempt(40, -100)])) }));
    r = await read(); p = r.dayProgress[11];
    if (p.history.length !== h1.length + 2 || p.score !== 85 || !p.done) fail(`a second reset allows one more, and a lower score keeps the best: ${JSON.stringify(p)}`);
    if ((r.kcReset[11].log || []).length !== 2) fail('the reset log should keep every reset');

    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('🔁 Reset Knowledge Check on the Worker: kcReset is the trainer\'s alone, a reset allows exactly one new attempt (dated after it), the best score is kept, a used reset reopens nothing, and every reset is logged.');
})().catch(e => { console.error(e); process.exit(1); });
