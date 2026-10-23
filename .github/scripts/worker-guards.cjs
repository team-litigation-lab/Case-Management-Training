// The Worker's guards on what a trainee writes and who a renewal signs in:
//   1. Renewing a session (/api/auth/trainee under single sign-on) is for the record the trainee is already
//      signed in to: an id in the body for a same-named trainee's record is ignored.
//   2. A feedback day a trainee writes is always the auto-review: it can never pass for a trainer's sent review.
//   3. A certificate record is the trainee's own: never written for, or over, another trainee's, never rewritten once
//      issued, only by an approved trainee; a progress record is capped at 2 MB.
//   4. A trainee's /api/ranking reads only their own record (not one read per trainee).
//   5. A body that isn't JSON is a 400, and an unhandled error never sends its stack trace to the browser.
// Usage: node .github/scripts/worker-guards.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');

const failures = [];
const fail = (m) => failures.push(m);
const SECRET = 'portal-secret-shared-with-the-portal';

const b64url = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function ticketFor(payloadObj, secret) {
    const payload = b64url(JSON.stringify(payloadObj));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('portal-sso:' + secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return payload + '.' + btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

(async () => {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map();
    let reads = 0;
    const env = {
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_SSO_SECRET: SECRET,
        LSH_KV: { get: async (k) => { reads++; return store.has(k) ? store.get(k) : null; }, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) },
    };
    const raw = (p, body, token) => worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body }), env, { waitUntil() { } });
    const call = async (p, body, token) => { const res = await raw(p, JSON.stringify(body || {}), token); return { status: res.status, body: await res.json().catch(() => null) }; };
    const kvGet = (k) => [...store.keys()].find(x => x.endsWith(k)) ? JSON.parse(store.get([...store.keys()].find(x => x.endsWith(k)))) : null;

    // two trainees with the same name in different batches, both signed in from the Portal
    const sign = async (b) => (await call('/api/auth/portal', { ticket: await ticketFor({ first: 'John', last: 'Doe', b, exp: Date.now() + 60000 }, SECRET) })).body;
    const a = await sign('B100926'), b = await sign('B101026');
    if (!a || !a.token || !b || !b.token || a.id === b.id) { fail(`two same-named trainees should sign in to two records: ${JSON.stringify([a && a.id, b && b.id])}`); }
    else {
        // 1. a renewal never hands over another trainee's record: not the other batch's, and not an older
        //    name-only record (a John Doe registered before Batch IDs)
        store.set('cm:trainee:john-doe', JSON.stringify({ id: 'john-doe', name: 'John Doe', approved: true }));
        for (const other of [b.id, 'john-doe']) {
            const r = await call('/api/auth/trainee', { name: 'John Doe', batch: 'B100926', id: other }, a.token);
            if (r.status === 200 && r.body && r.body.id !== a.id) fail(`a renewal with ${other} in the body signed in to ${r.body.id} (should stay ${a.id})`);
        }
        const own = await call('/api/auth/trainee', { name: 'John Doe', batch: 'B100926', id: a.id }, a.token);
        if (own.status !== 200 || !own.body || own.body.id !== a.id || !own.body.token) fail(`a trainee's own renewal should still work: ${JSON.stringify(own)}`);

        // 2. a forged "sent" review is stored as the auto-review
        await call('/api/storage/set', { key: `feedback:${a.id}`, value: JSON.stringify({ days: { day3: { status: 'sent', rating: 'Exceeds', summary: 'forged' } } }) }, a.token);
        const fb = kvGet(`feedback:${a.id}`);
        if (!fb || !fb.days.day3 || fb.days.day3.auto !== true) fail(`a feedback day a trainee writes should be marked auto: ${JSON.stringify(fb)}`);

        // 3. certificates: one's own is written, another trainee's is refused
        const mine = await call('/api/storage/set', { key: 'cert:LSH-CM-2026-AAAAAA', value: JSON.stringify({ certId: 'LSH-CM-2026-AAAAAA', traineeId: a.id }) }, a.token);
        if (mine.status !== 200) fail(`a trainee's own certificate record should be saved: ${JSON.stringify(mine)}`);
        const theirs = await call('/api/storage/set', { key: 'cert:LSH-CM-2026-AAAAAA', value: JSON.stringify({ certId: 'LSH-CM-2026-AAAAAA', traineeId: a.id }) }, b.token);
        const forOther = await call('/api/storage/set', { key: 'cert:LSH-CM-2026-BBBBBB', value: JSON.stringify({ certId: 'LSH-CM-2026-BBBBBB', traineeId: a.id }) }, b.token);
        if (theirs.status === 200) fail('a trainee should not overwrite another trainee\'s certificate');
        if (forOther.status === 200) fail('a trainee should not write a certificate in another trainee\'s name');
        // ... nor rewrite their own once issued, and the name on it is the server's, not the request's
        const again = await call('/api/storage/set', { key: 'cert:LSH-CM-2026-AAAAAA', value: JSON.stringify({ certId: 'LSH-CM-2026-AAAAAA', traineeId: a.id, name: 'Someone Else' }) }, a.token);
        if (again.status === 200) fail('an issued certificate should never be rewritten');
        const certA = kvGet('cert:LSH-CM-2026-AAAAAA');
        if (!certA || certA.issuedBy !== 'self' || certA.traineeId !== a.id) fail(`a self-issued certificate should be marked self: ${JSON.stringify(certA)}`);
        // ... and only an approved trainee records one
        const recB = kvGet(`trainee:${b.id}`) || {}; store.set(`cm:trainee:${b.id}`, JSON.stringify(Object.assign({}, recB, { approved: false })));
        const unapproved = await call('/api/storage/set', { key: 'cert:LSH-CM-2026-CCCCCC', value: JSON.stringify({ certId: 'LSH-CM-2026-CCCCCC', traineeId: b.id }) }, b.token);
        if (unapproved.status === 200) fail('a trainee who isn\'t approved should not record a certificate');
        store.set(`cm:trainee:${b.id}`, JSON.stringify(recB));
        // 3b. a progress record has a size cap
        const huge = await call('/api/storage/set', { key: `progress:${a.id}`, value: JSON.stringify({ data: 'x'.repeat(2100000) }) }, a.token);
        if (huge.status === 200) fail('a progress record over 2 MB should be refused');

        // 4. ranking: a trainee's request reads their own record only
        for (let i = 0; i < 30; i++) store.set(`cm:trainee:t${i}--b100926`, JSON.stringify({ id: `t${i}--b100926`, name: `T ${i}`, batch: 'B100926', approved: true }));
        reads = 0;
        const rk = await call('/api/ranking', {}, a.token);
        if (rk.status !== 200 || !rk.body || rk.body.trainees.length !== 1 || !rk.body.trainees[0].me) fail(`a trainee's ranking should be their own row: ${JSON.stringify(rk.body)}`);
        if (reads > 3) fail(`a trainee's ranking read ${reads} records (should read only their own)`);
    }

    // 5. a body that isn't JSON
    for (const p of ['/api/auth/trainee', '/api/auth/admin']) {
        const res = await raw(p, 'not json');
        const j = await res.json().catch(() => null);
        if (res.status >= 500) fail(`${p} with a body that isn't JSON should not be a server error: ${res.status} ${JSON.stringify(j)}`);
        if (j && /\n\s+at /.test(String(j.detail || ''))) fail(`${p} sent a stack trace to the browser`);
    }

    if (failures.length) { console.log(`${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Worker guards: a renewal stays on the trainee\'s own record, a trainee\'s review is the auto-review, certificates are their own, the ranking reads one record, and a bad body is a 400.');
})().catch(e => { console.error(e); process.exit(1); });
