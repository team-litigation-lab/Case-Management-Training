// @check node — The Worker holds the one-attempt Knowledge Check: a trainee's own write can't drop or replace an attempt on their record
// js/cm-kc-once.js refuses a second attempt in the browser; worker.js keepKcAttempts holds it on the server, so a console
// edit or a device's stale progress can't rewrite it. On a trainee's own write to trainee:<id>:
//   1. a day with no attempt yet takes the write as it is (the first attempt is recorded);
//   2. a day with an attempt keeps its first attempt (history[0]) and the score, done and date on the record, whatever the
//      write says; the history never gets shorter (a dayProgress entry deleted, or emptied, comes back);
//   3. the first attempt's own picks (answers) may be added once, for its Answer Review; they change no score;
//   4. an admin's write is not limited.
// Usage: node .github/scripts/kc-once-worker.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');

const failures = [];
const fail = (m) => failures.push(m);

(async () => {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map();
    const env = {
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) }
    };
    const api = async (p, body, token) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
            body: JSON.stringify(body) }), env, { waitUntil() { } });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const t = (await api('/api/auth/trainee', { name: 'Kim Once', batch: 'B100926' })).body;
    const admin = (await api('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    const key = 'trainee:' + t.id;
    const read = async () => { const r = await api('/api/storage/get', { key }, admin); return r.body && r.body.value ? JSON.parse(r.body.value) : null; };
    const write = (rec, tok = t.token) => api('/api/storage/set', { key, value: JSON.stringify(rec) }, tok);

    await write({ id: t.id, name: 'Kim Once', batch: 'B100926' });
    // 1. the first attempt
    const first = { score: 65, passed: false, date: '2026-10-01T10:00:00.000Z' };
    await write({ id: t.id, name: 'Kim Once', batch: 'B100926', dayProgress: { 11: { score: 65, done: false, date: first.date, history: [first] } } });
    let r = await read();
    if (!r || !r.dayProgress || !r.dayProgress[11] || r.dayProgress[11].score !== 65) fail(`the first attempt should be recorded: ${JSON.stringify(r && r.dayProgress)}`);

    // 2. a second "attempt" written over it, and an attempt deleted: the first stands
    await write({ id: t.id, name: 'Kim Once', batch: 'B100926', dayProgress: { 11: { score: 100, done: true, date: '2026-10-02T10:00:00.000Z', history: [{ score: 100, passed: true, date: '2026-10-02T10:00:00.000Z' }] } } });
    r = await read();
    const p = (r.dayProgress || {})[11] || {};
    if (p.score !== 65 || p.done !== false || p.date !== first.date || !p.history || p.history[0].score !== 65) fail(`a trainee's write should not replace the recorded attempt: ${JSON.stringify(p)}`);
    await write({ id: t.id, name: 'Kim Once', batch: 'B100926', dayProgress: {} });
    r = await read();
    if (!r.dayProgress || !r.dayProgress[11] || r.dayProgress[11].score !== 65 || r.dayProgress[11].history.length !== 1) fail(`deleting the day's progress should not clear the attempt: ${JSON.stringify(r.dayProgress)}`);
    await write({ id: t.id, name: 'Kim Once', batch: 'B100926', dayProgress: { 11: { score: 65, done: false, history: [] } } });
    r = await read();
    if ((r.dayProgress[11].history || []).length !== 1) fail('the history should never get shorter');
    // another day, not attempted: the trainee's write stands
    await write({ id: t.id, name: 'Kim Once', batch: 'B100926', dayProgress: { 11: r.dayProgress[11], 12: { score: 80, done: true, history: [{ score: 80, passed: true }] } } });
    r = await read();
    if (!r.dayProgress[12] || r.dayProgress[12].score !== 80) fail(`a day with no attempt yet should take the first one: ${JSON.stringify(r.dayProgress[12])}`);

    // 3. the first attempt's picks, added once
    const withPicks = JSON.parse(JSON.stringify(r.dayProgress)); withPicks[11].history[0].answers = [0, 1, 2, null]; withPicks[11].history[0].score = 99;
    await write({ id: t.id, name: 'Kim Once', batch: 'B100926', dayProgress: withPicks });
    r = await read();
    const h0 = r.dayProgress[11].history[0];
    if (!Array.isArray(h0.answers) || h0.answers.length !== 4 || h0.score !== 65) fail(`the first attempt's picks may be added, with its score unchanged: ${JSON.stringify(h0)}`);

    // 4. an admin may reset it
    await write({ id: t.id, name: 'Kim Once', batch: 'B100926', dayProgress: {} }, admin);
    r = await read();
    if (r.dayProgress && r.dayProgress[11]) fail('an admin\'s write should not be limited');

    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('The Worker holds the one-attempt Knowledge Check: a trainee\'s own write keeps the recorded attempt (score, done, date, history), adds only its picks, and an admin is not limited.');
})().catch(e => { console.error(e); process.exit(1); });
