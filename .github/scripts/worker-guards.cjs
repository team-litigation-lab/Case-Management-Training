// The Worker's guards on what a trainee writes and who a renewal signs in:
//   1. Renewing a session (/api/auth/trainee under single sign-on) is for the record the trainee is already
//      signed in to: an id in the body for a same-named trainee's record is ignored.
//   2. A feedback day a trainee writes is always the auto-review: it can never pass for a trainer's sent review.
//   3. A certificate record is the trainee's own: never written for, or over, another trainee's, never rewritten once
//      issued, only by an approved trainee; a progress record is capped at 2 MB.
//   3c. A trainee can't unlock a corrected copy for themselves (unlockedCopies is the trainer's).
//   4. A trainee's /api/ranking reads only their own record (not one read per trainee).
//   5. A body that isn't JSON is a 400, and an unhandled error never sends its stack trace to the browser.
//   6. The Backup Drive report (/api/drive report / reportAll / checkFor) is a trainer's: a trainee gets 403,
//      and an admin gets the summary with no token in it (Google is stubbed).
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
    // a trainer's change to a trainee record goes through the admin API (it also keeps the admin-owned fields' own key)
    let adminTok = null;
    const asAdmin = async (key, rec) => {
        if (!adminTok) adminTok = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
        const r = await call('/api/storage/set', { key, value: JSON.stringify(rec) }, adminTok);
        if (r.status !== 200) fail(`an admin's save of ${key} failed: ${JSON.stringify(r)}`);
    };
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
        const recB = kvGet(`trainee:${b.id}`) || {}; await asAdmin(`trainee:${b.id}`, Object.assign({}, recB, { approved: false }));
        const unapproved = await call('/api/storage/set', { key: 'cert:LSH-CM-2026-CCCCCC', value: JSON.stringify({ certId: 'LSH-CM-2026-CCCCCC', traineeId: b.id }) }, b.token);
        if (unapproved.status === 200) fail('a trainee who isn\'t approved should not record a certificate');
        await asAdmin(`trainee:${b.id}`, recB);
        // 3b. a progress record has a size cap
        const huge = await call('/api/storage/set', { key: `progress:${a.id}`, value: JSON.stringify({ data: 'x'.repeat(2100000) }) }, a.token);
        if (huge.status === 200) fail('a progress record over 2 MB should be refused');

        // 3c. a trainee can't unlock a corrected copy for themselves: only the trainer's save sets unlockedCopies
        const recA0 = kvGet(`trainee:${a.id}`) || {};
        await asAdmin(`trainee:${a.id}`, Object.assign({}, recA0, { unlockedCopies: ['RS73'] }));
        await call('/api/storage/set', { key: `trainee:${a.id}`, value: JSON.stringify(Object.assign({}, recA0, { unlockedCopies: ['RS72', 'RS73'], unlockedCopiesAt: 'forged' })) }, a.token);
        const recA1 = kvGet(`trainee:${a.id}`) || {};
        if (JSON.stringify(recA1.unlockedCopies) !== JSON.stringify(['RS73']) || recA1.unlockedCopiesAt === 'forged') fail(`a trainee should not change unlockedCopies on their own record: ${JSON.stringify(recA1.unlockedCopies)}`);
        await asAdmin(`trainee:${a.id}`, recA0);

        // 3d. an approval can't be undone by the trainee's page saving a copy it read just before (KV can serve a
        //     minute-old copy elsewhere): whatever lands in trainee:<id>, the admin's fields come from their own key
        await asAdmin(`trainee:${b.id}`, Object.assign({}, recB, { approved: false }));
        const staleB = kvGet(`trainee:${b.id}`);
        await asAdmin(`trainee:${b.id}`, Object.assign({}, recB, { approved: true, unlockedDays: [2] }));
        store.set(`cm:trainee:${b.id}`, JSON.stringify(Object.assign({}, staleB, { approved: false, unlockedDays: [] })));   // the stale save landing
        const seenB = (await call('/api/storage/get', { key: `trainee:${b.id}` }, b.token)).body;
        const recB2 = seenB && seenB.value ? JSON.parse(seenB.value) : {};
        if (recB2.approved !== true || JSON.stringify(recB2.unlockedDays) !== '[2]') fail(`a stale save by the trainee's page undid the trainer's approval: ${JSON.stringify({ approved: recB2.approved, unlockedDays: recB2.unlockedDays })}`);
        const tix = await call('/api/auth/refresh', {}, b.token);
        if (tix.status !== 200) fail(`the approved trainee should still be signed in: ${JSON.stringify(tix)}`);
        await asAdmin(`trainee:${b.id}`, recB);

        // 3e. ...and the same for a trainer's review, focus items and activity feedback: a stale save by the trainee's
        //     page (the record as it was before the trainer's change) lands, and the trainer's part still reads back.
        const readOwn = async (key) => { const r = (await call('/api/storage/get', { key }, a.token)).body; return r && r.value ? JSON.parse(r.value) : {}; };
        {
            // a day's review sent by the trainer; the trainee's read mark on it stays theirs
            const before = { days: { day1: { status: 'draft', auto: true, summary: 'auto' } } };
            await asAdmin(`feedback:${a.id}`, before);
            await asAdmin(`feedback:${a.id}`, { days: { day1: { status: 'sent', summary: 'from the trainer', editedByTrainer: true } } });
            store.set(`cm:feedback:${a.id}`, JSON.stringify({ days: { day1: { status: 'draft', auto: true, summary: 'auto', readAt: 'r1' } } }));   // the stale save landing
            const fb = await readOwn(`feedback:${a.id}`);
            if (!fb.days || !fb.days.day1 || fb.days.day1.summary !== 'from the trainer' || fb.days.day1.status !== 'sent') fail(`a stale save by the trainee's page lost the trainer's sent review: ${JSON.stringify(fb)}`);
            else if (fb.days.day1.readAt !== 'r1') fail(`the trainee's read mark on a trainer's review should stay theirs: ${JSON.stringify(fb.days.day1)}`);
            // and their own save of it still can't rewrite it
            await call('/api/storage/set', { key: `feedback:${a.id}`, value: JSON.stringify({ days: { day1: { status: 'sent', summary: 'forged' } } }) }, a.token);
            if ((await readOwn(`feedback:${a.id}`)).days.day1.summary !== 'from the trainer') fail('a trainee rewrote a trainer\'s review');
        }
        {
            // a focus item the trainer added; seen and done stay the trainee's
            await asAdmin(`focus:${a.id}`, { items: [{ id: 'f1', text: 'old item' }] });
            await call('/api/storage/set', { key: `focus:${a.id}`, value: JSON.stringify({ items: [{ id: 'f1', seenAt: 's1' }] }) }, a.token);
            const staleF = store.get(`cm:focus:${a.id}`);
            await asAdmin(`focus:${a.id}`, { items: [{ id: 'f1', text: 'old item', seenAt: 's1' }, { id: 'f2', text: 'new item' }] });
            store.set(`cm:focus:${a.id}`, staleF);   // the stale save landing
            const fo = await readOwn(`focus:${a.id}`);
            const ids = (fo.items || []).map((x) => x.id).join(',');
            if (ids !== 'f1,f2') fail(`a stale save by the trainee's page lost a focus item the trainer added: ${JSON.stringify(fo)}`);
            else if (fo.items[0].seenAt !== 's1' || fo.items[1].seenAt) fail(`seen marks on focus items should stay the trainee's: ${JSON.stringify(fo.items)}`);
        }
        {
            // feedback on an activity, for the submission it was written for; a new submission retires it
            await call('/api/storage/set', { key: `actsub:${a.id}`, value: JSON.stringify({ items: { act1: { answer: 'mine', submittedAt: 'S1' } } }) }, a.token);
            const staleA = store.get(`cm:actsub:${a.id}`);
            const withFb = JSON.parse(staleA); withFb.items.act1.feedback = { status: 'sent', text: 'good work' };
            await asAdmin(`actsub:${a.id}`, withFb);
            store.set(`cm:actsub:${a.id}`, staleA);   // the stale save landing
            const ac = await readOwn(`actsub:${a.id}`);
            if (!ac.items || !ac.items.act1 || !ac.items.act1.feedback || ac.items.act1.feedback.text !== 'good work') fail(`a stale save by the trainee's page lost the trainer's activity feedback: ${JSON.stringify(ac)}`);
            await call('/api/storage/set', { key: `actsub:${a.id}`, value: JSON.stringify({ items: { act1: { answer: 'again', submittedAt: 'S2' } } }) }, a.token);
            const ac2 = (await readOwn(`actsub:${a.id}`)).items.act1;
            if (ac2.feedback) fail(`a new submission should retire the trainer's feedback, not keep it on the new answer: ${JSON.stringify(ac2)}`);
            if (!ac2.prevFeedback || ac2.prevFeedback.text !== 'good work') fail(`the retired feedback should stay as prevFeedback: ${JSON.stringify(ac2)}`);
        }

        // 3f. a trainee's feedback on the program is rebuilt by the Worker: never stored as sent
        {
            const fk = 'tfeedback:' + 'probe' + Date.now().toString(36);
            const sent = { id: "x');alert(1);//", status: 'actioned', name: 'Someone Else', traineeId: 'someone-else--b100926', batch: 'B999999', at: '<b>', dayId: '<img>',
                ratings: { platform: 7, lessons: 4, facilitator: '<b>', bogus: 5 }, good: '<img src=x onerror=alert(1)>', improve: 'x'.repeat(5000), anonymous: false };
            const w = await call('/api/storage/set', { key: fk, value: JSON.stringify(sent) }, a.token);
            if (w.status !== 200) fail(`a trainee's feedback should be saved: ${JSON.stringify(w)}`);
            const got = kvGet(fk) || {};
            if (got.id !== fk.slice(10)) fail(`a feedback record's id is its key, not what was sent: ${got.id}`);
            if (got.status !== 'new') fail(`new feedback always starts "new": ${got.status}`);
            if (got.traineeId !== a.id || got.name === 'Someone Else' || got.batch === 'B999999') fail(`feedback should name the trainee who sent it, from their own record: ${JSON.stringify({ traineeId: got.traineeId, name: got.name, batch: got.batch })}`);
            if (JSON.stringify(got.ratings) !== JSON.stringify({ lessons: 4 })) fail(`only 1–5 ratings in the known areas are kept: ${JSON.stringify(got.ratings)}`);
            if (got.dayId !== null || !/^\d{4}-/.test(got.at || '') || (got.improve || '').length > 1500) fail(`day, time and text should be narrowed: ${JSON.stringify({ dayId: got.dayId, at: got.at, improve: (got.improve || '').length })}`);
            const again = await call('/api/storage/set', { key: fk, value: JSON.stringify({ good: 'second' }) }, a.token);
            if (again.status === 200) fail('a feedback record is written once');
            const anon = 'tfeedback:' + 'anon' + Date.now().toString(36);
            await call('/api/storage/set', { key: anon, value: JSON.stringify({ anonymous: true, good: 'fine', name: 'Leak' }) }, a.token);
            const an = kvGet(anon) || {};
            if (an.name !== 'Anonymous' || an.traineeId !== null || an.batch !== '') fail(`anonymous feedback should carry no name, id or batch: ${JSON.stringify(an)}`);
        }

        // 4. ranking: a trainee's request reads their own record only
        for (let i = 0; i < 30; i++) store.set(`cm:trainee:t${i}--b100926`, JSON.stringify({ id: `t${i}--b100926`, name: `T ${i}`, batch: 'B100926', approved: true }));
        reads = 0;
        const rk = await call('/api/ranking', {}, a.token);
        if (rk.status !== 200 || !rk.body || rk.body.trainees.length !== 1 || !rk.body.trainees[0].me) fail(`a trainee's ranking should be their own row: ${JSON.stringify(rk.body)}`);
        if (reads > 3) fail(`a trainee's ranking read ${reads} records (should read only their own)`);

        // 6. the Backup Drive report is a trainer's, and never carries a token
        env.GOOGLE_CLIENT_ID = 'ci-client'; env.GOOGLE_CLIENT_SECRET = 'ci-google-secret';
        const realFetch = globalThis.fetch; let nextId = 0;
        const idTok = 'x.' + b64url(JSON.stringify({ email: 'trainee@example.com' })) + '.y';
        globalThis.fetch = async (u, o = {}) => {
            const url = String(u), resp = (j) => new Response(JSON.stringify(j), { status: 200, headers: { 'Content-Type': 'application/json' } });
            if (url.includes('oauth2.googleapis.com/token')) return resp({ access_token: 'ACCESS-SECRET', refresh_token: 'REFRESH-SECRET', expires_in: 3600, id_token: idTok });
            if (url.includes('googleapis.com') && (o.method || 'GET') === 'POST') return resp({ id: 'f' + (++nextId), webViewLink: 'https://drive/x' });
            if (url.includes('googleapis.com')) return resp({ id: 'f', trashed: false });
            return realFetch(u, o);
        };
        try {
            const admin = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body;
            const st = await call('/api/drive', { action: 'connect', code: 'c' }, a.token);
            if (st.status !== 200 || !st.body.drive.connected) fail(`a trainee should connect a stubbed Google Drive: ${JSON.stringify(st)}`);
            const standard = st.body.drive.standard || [];
            await call('/api/drive', { action: 'setup', layout: standard.slice(1) }, a.token);
            const built = await call('/api/drive', { action: 'setup', layout: standard }, a.token);
            if (!built.body || !built.body.built) fail(`the right layout should be built: ${JSON.stringify(built.body)}`);
            for (const action of ['report', 'reportAll', 'checkFor']) {
                const r = await call('/api/drive', { action, traineeId: a.id, traineeIds: [a.id] }, a.token);
                if (r.status !== 403) fail(`a trainee's /api/drive ${action} should be 403, got ${r.status}`);
            }
            const rep = await call('/api/drive', { action: 'report', traineeId: a.id }, admin.token);
            const all = await call('/api/drive', { action: 'reportAll', traineeIds: [a.id, b.id] }, admin.token);
            const chk = await call('/api/drive', { action: 'checkFor', traineeId: a.id }, admin.token);
            const r1 = rep.body && rep.body.report;
            if (rep.status !== 200 || !r1 || !r1.connected || r1.email !== 'trainee@example.com' || r1.attempts !== 2 || !r1.passed || !r1.builtAt || r1.tries.length !== 2 || r1.tries[0].ok)
                fail(`an admin's report should summarise the drive: ${JSON.stringify(rep.body)}`);
            if (all.status !== 200 || !all.body.reports[a.id] || !all.body.reports[b.id] || all.body.reports[b.id].connected) fail(`reportAll should cover each id asked for: ${JSON.stringify(all.body)}`);
            if (chk.status !== 200 || !chk.body.report || !chk.body.report.checkedAt || chk.body.report.missing.length) fail(`checkFor should refresh the check: ${JSON.stringify(chk.body)}`);
            for (const [what, r] of [['report', rep], ['reportAll', all], ['checkFor', chk]]) {
                const text = JSON.stringify(r.body);
                if (/SECRET|"refresh"|"access"|"exp"|token/i.test(text)) fail(`${what} sent a token field: ${text}`);
            }
            // 4b. this program's drive records are its own (cm:drive:), apart from the Foundations training's drive:<id>
            if ([...store.keys()].some((k) => k.startsWith('drive:'))) fail(`the Backup Drive wrote an unprefixed drive: key, which the Foundations training also uses: ${[...store.keys()].filter((k) => k.startsWith('drive:'))}`);
            const foundations = { [`drive:${a.id}`]: JSON.stringify({ email: 'foundations@example.com', setup: { ok: false } }), 'drive:foundations-only--b100926': JSON.stringify({ email: 'f@example.com' }), [`drive:${b.id}`]: JSON.stringify({ email: 'legacy-cm@example.com', builtAt: '2026-10-30T00:00:00Z' }) };
            Object.entries(foundations).forEach(([k, v]) => store.set(k, v));
            const mineNow = await call('/api/drive', { action: 'report', traineeId: a.id }, admin.token);
            if (!mineNow.body || !mineNow.body.report || mineNow.body.report.email !== 'trainee@example.com') fail(`a Foundations drive record under the same trainee id must not stand in for this program's: ${JSON.stringify(mineNow.body)}`);
            const every = await call('/api/drive', { action: 'reportAll' }, admin.token);
            const ids = Object.keys((every.body && every.body.reports) || {});
            if (!ids.includes(a.id)) fail(`reportAll should list this program's drives: ${ids}`);
            if (ids.includes('foundations-only--b100926')) fail(`reportAll listed a Foundations-only trainee's drive: ${ids}`);
            if (!ids.includes(b.id) || every.body.reports[b.id].builtAt !== '2026-10-30T00:00:00Z') fail(`a CM trainee's drive record from before the cm: prefix should still be read: ${JSON.stringify(every.body.reports[b.id])}`);
            await call('/api/drive', { action: 'disconnect' }, a.token);
            Object.entries(foundations).forEach(([k, v]) => { if (store.get(k) !== v) fail(`this program changed the Foundations training's ${k}`); });
        } finally { globalThis.fetch = realFetch; }
    }

    // 5. a body that isn't JSON
    for (const p of ['/api/auth/trainee', '/api/auth/admin']) {
        const res = await raw(p, 'not json');
        const j = await res.json().catch(() => null);
        if (res.status >= 500) fail(`${p} with a body that isn't JSON should not be a server error: ${res.status} ${JSON.stringify(j)}`);
        if (j && /\n\s+at /.test(String(j.detail || ''))) fail(`${p} sent a stack trace to the browser`);
    }
    // ...and JSON of the wrong shape is a 4xx too, never a crash
    if (a && a.token) {
        const adm = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body;
        const shapes = [
            ['focus items as an object', '/api/storage/set', { key: `focus:${a.id}`, value: JSON.stringify({ items: {} }) }, a.token],
            ['focus items with a null', '/api/storage/set', { key: `focus:${a.id}`, value: JSON.stringify({ items: [null] }) }, a.token],
            ['AI request of null', '/api/ai', null, a.token],
            ['AI messages as an object', '/api/ai', { messages: {} }, a.token],
            ['admin set with no value', '/api/storage/set', { key: 'settings:tools' }, adm && adm.token]
        ];
        // a key is configured (or /api/ai answers "no key" before reading the body), and nothing may reach Google
        const realFetch = globalThis.fetch;
        env.GEMINI_API_KEY = 'test-key';
        globalThis.fetch = async () => { throw new Error('a malformed request should be refused before calling Google'); };
        try {
            for (const [what, p, body, token] of shapes) {
                const res = await raw(p, JSON.stringify(body), token);
                if (res.status >= 500) fail(`${what} (${p}) should not be a server error: ${res.status} ${await res.text()}`);
            }
        } finally { globalThis.fetch = realFetch; delete env.GEMINI_API_KEY; }
    }

    if (failures.length) { console.log(`${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Worker guards: a renewal stays on the trainee\'s own record, a trainee\'s review is the auto-review, certificates are their own, the ranking reads one record, the Backup Drive report is a trainer\'s and token-free, and a bad body is a 400.');
})().catch(e => { console.error(e); process.exit(1); });
