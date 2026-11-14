// @check node — A Batch ID corrected on the Portal reaches the trainee's record (a merged account), and nothing else changes
// What a corrected Batch ID does at the Portal's sign-in (worker.js /api/auth/portal):
//   1. a trainee signs in under one Batch ID: their record carries it;
//   2. the Batch ID is corrected on the Portal: the next sign-in, under the new id, finds no record there, finds theirs
//      under the nearby old batch and opens it (merged:<new id> = {into}, as a trainer's 👥 merge leaves), with no new account;
//   3. the next sign-in opens the same account, and its record carries the corrected Batch ID, with its work kept;
//   4. the same Batch ID typed another way (B100926 / B10092026) is the same batch: the record is not rewritten;
//   5. a namesake in a batch months away is someone else: their own new account; two nearby records: refused (409),
//      for a trainer to merge.
// Usage: node .github/scripts/batch-fix.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');

const failures = [];
const fail = (m) => failures.push(m);
const SECRET = 'portal-secret-shared-with-the-portal';
const b64url = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function ticketFor(payloadObj) {
    const payload = b64url(JSON.stringify(payloadObj));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('portal-sso:' + SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return payload + '.' + btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

(async () => {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map();
    const env = {
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_SSO_SECRET: SECRET,
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) }
    };
    const portal = async (b) => {
        const res = await worker.fetch(new Request('http://x/api/auth/portal', { method: 'POST', headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ ticket: await ticketFor({ first: 'Alex', last: 'Rivera', b, exp: Date.now() + 60000 }) }) }), env, { waitUntil() { } });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const api = async (p, body, token) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}),
            body: JSON.stringify(body) }), env, { waitUntil() { } });
        return res.json().catch(() => null);
    };
    const admin = (await api('/api/auth/admin', { passphrase: 'ci-pass' })).token;
    // the records as the Worker keeps them (its prefix, a trainer's part in its own key), read and written as an admin
    const rec = async (id) => { const r = await api('/api/storage/get', { key: 'trainee:' + id }, admin); return r && r.value ? JSON.parse(r.value) : null; };
    const put = (key, v) => api('/api/storage/set', { key, value: JSON.stringify(v) }, admin);
    const del = (key) => api('/api/storage/delete', { key }, admin);

    // 1. the first sign-in, under the Batch ID as first registered
    const first = await portal('B092526');
    if (first.status !== 200) { fail(`the Portal sign-in failed: ${JSON.stringify(first)}`); }
    const oldId = first.body && first.body.id;
    const r1 = (await rec(oldId)) || {};
    if (r1.batch !== 'B092526') fail(`the record should carry the Batch ID it was signed in with: ${JSON.stringify(r1)}`);
    r1.dayProgress = { 11: { score: 85, done: true, history: [{ score: 85, passed: true }] } };
    await put('trainee:' + oldId, r1);

    // 2. corrected on the Portal: the sign-in opens the record under the old batch, not a new empty account
    const second = await portal('B092626');
    if (!second.body || second.body.id !== oldId) fail(`a corrected Batch ID should open the trainee's own record (${oldId}), not a new account: ${JSON.stringify(second.body && (second.body.id || second.body.error))}`);
    if (store.has('lsh:trainee:alex-rivera--b092626') || [...store.keys()].some(k => /trainee:alex-rivera--b092626$/.test(k))) fail('a corrected Batch ID should not leave a second, empty account');
    if (![...store.keys()].some(k => /merged:alex-rivera--b092626$/.test(k))) fail('the corrected sign-in should leave merged:<new id> pointing at the record kept');

    // 3. the next sign-in opens the account kept, with the corrected Batch ID and its work
    const third = await portal('B092626');
    if (!third.body || third.body.id !== oldId) fail(`after the merge, the sign-in should open the account kept (${oldId}): ${JSON.stringify(third.body && third.body.id)}`);
    const r3 = (await rec(oldId)) || {};
    if (r3.batch !== 'B092626') fail(`the account kept should now carry the corrected Batch ID B092626: ${r3.batch}`);
    if (!r3.dayProgress || !r3.dayProgress[11] || r3.dayProgress[11].score !== 85) fail('the account kept should keep its work');
    if (!third.body.existing || third.body.existing.batch !== 'B092626') fail(`the sign-in should hand the page the corrected Batch ID: ${JSON.stringify(third.body.existing && third.body.existing.batch)}`);

    // 4. the same batch written another way is not a correction
    const before = JSON.stringify(await rec(oldId));
    await portal('B09262026');
    if (JSON.stringify(await rec(oldId)) !== before) fail('the same Batch ID in its long form should not rewrite the record');

    // 5. a namesake months away: their own new account; two nearby records: refused
    const far = await portal('B031527');
    if (!far.body || far.body.id === oldId || !/b031527$/.test(far.body.id || '')) fail(`a namesake in a batch months away should get their own account: ${JSON.stringify(far.body && far.body.id)}`);
    await put('trainee:alex-rivera--b100126', { id: 'alex-rivera--b100126', name: 'Alex Rivera', batch: 'B100126', approved: true });
    const amb = await portal('B100326');
    if (amb.status !== 409 || amb.body.code !== 'batch-ambiguous') fail(`two nearby records under the name should be refused for a trainer to merge: ${amb.status} ${JSON.stringify(amb.body)}`);

    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('A Batch ID corrected on the Portal reaches the trainee\'s record (the account kept after a merge), with its work; the same batch written another way leaves the record alone.');
})().catch(e => { console.error(e); process.exit(1); });
