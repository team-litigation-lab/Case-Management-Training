// @check node — Single sign-on (the Portal is the only way a trainee gets in; a missing PORTAL_SSO_SECRET says so)
// Single sign-on: the LSH Training Portal is the only way a trainee gets into this program.
//   1. With an admin password set, single sign-on is on whether or not PORTAL_SSO_SECRET is — a name + batch
//      typed at /api/auth/trainee is refused (403 portal-required), so opening this site directly gives a
//      trainee no way in. Only a trainee already signed in on the device can renew their session that way.
//   2. A trainee who opens the program from the Portal is signed in by its signed ticket, with no form.
//   3. With single sign-on on but no PORTAL_SSO_SECRET here, /api/auth/portal says which setting is missing
//      (503 portal-secret-missing) rather than letting it read as an expired link, and /api/auth/status
//      reports portalSecret false so the sign-in screen can tell an administrator.
//   4. PORTAL_ONLY=off is the way back to the old name + batch sign-in (the tests use it).
//   5. An administrator's ticket (an admin signed in on the Portal) signs them in as a trainer, with no second password,
//      and only once: the same ticket again is refused (401 used).
// Usage: node .github/scripts/sso.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');

const failures = [];
const fail = (m) => failures.push(m);
const SECRET = 'portal-secret-shared-with-the-portal';

const b64url = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// A Portal ticket names the program it is for (p, its topic key: the Portal's makeTicket); p: undefined leaves it out.
// j: a few random characters, as makeTicket adds, so two tickets made in the same millisecond are two tickets (each works once).
const PORTAL_TOPIC = 'CM TRAINING';
async function ticketFor(payloadObj, secret) {
    const payload = b64url(JSON.stringify(Object.assign({ p: PORTAL_TOPIC, j: crypto.randomUUID().slice(0, 8) }, payloadObj)));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('portal-sso:' + secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    const b = String.fromCharCode(...new Uint8Array(sig));
    return payload + '.' + btoa(b).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

(async () => {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const makeEnv = (extra) => {
        const store = new Map();
        return Object.assign({
            MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret',
            LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) },
            __store: store
        }, extra);
    };
    const call = async (env, p, body, headers) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}), body: JSON.stringify(body || {}) }), env, { waitUntil() { } });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const status = async (env) => (await call(env, '/api/auth/status')).body;

    // 1. single sign-on is on with the admin password alone, and a typed name + batch is refused
    for (const [label, env] of [['without the Portal secret', makeEnv({})], ['with the Portal secret', makeEnv({ PORTAL_SSO_SECRET: SECRET })]]) {
        const st = await status(env);
        if (!st.portalOnly) fail(`${label}: /api/auth/status should report single sign-on on (portalOnly)`);
        const typed = await call(env, '/api/auth/trainee', { name: 'Walk In', batch: 'B100926' });
        if (typed.status !== 403 || !typed.body || typed.body.error !== 'portal-required') {
            fail(`${label}: a name + batch typed on this site should be refused (403 portal-required), got ${JSON.stringify(typed)}`);
        }
    }

    // 2. a trainee opening the program from the Portal is signed in by its ticket
    const env = makeEnv({ PORTAL_SSO_SECRET: SECRET });
    const good = await call(env, '/api/auth/portal', { ticket: await ticketFor({ first: 'Ana', last: 'Cruz', b: 'B100926', exp: Date.now() + 60000 }, SECRET) });
    if (good.status !== 200 || !good.body || !good.body.token) fail(`a Portal ticket should sign the trainee in: ${JSON.stringify(good)}`);
    else {
        if (good.body.id !== 'ana-cruz--b100926') fail(`the Portal ticket should give the Batch ID's record: ${good.body.id}`);
        if (good.body.batch !== 'B100926') fail(`the Batch ID should come back in its one form: ${JSON.stringify(good.body.batch)}`);
    }
    // that trainee can now renew their own session with the name + batch the Portal vouched for
    const renew = await call(env, '/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' }, { Authorization: 'Bearer ' + good.body.token });
    if (renew.status !== 200) fail(`a trainee already signed in on the device should be able to renew: ${JSON.stringify(renew)}`);
    // a ticket signed with the wrong secret is refused
    const wrong = await call(env, '/api/auth/portal', { ticket: await ticketFor({ first: 'Ana', last: 'Cruz', b: 'B100926', exp: Date.now() + 60000 }, 'a-different-secret') });
    if (wrong.status !== 401 || !wrong.body || wrong.body.code !== 'signature') fail(`a ticket signed with another secret should be refused: ${JSON.stringify(wrong)}`);
    // an expired ticket is refused
    const old = await call(env, '/api/auth/portal', { ticket: await ticketFor({ first: 'Ana', last: 'Cruz', b: 'B100926', exp: Date.now() - 1000 }, SECRET) });
    if (old.status !== 401) fail(`an expired ticket should be refused: ${JSON.stringify(old)}`);

    // 3. single sign-on on, but this Worker has no Portal secret: say which setting is missing
    const noSecret = makeEnv({});
    const st2 = await status(noSecret);
    if (st2.portalSecret !== false) fail(`/api/auth/status should report portalSecret false when it isn't set: ${JSON.stringify(st2)}`);
    const blocked = await call(noSecret, '/api/auth/portal', { ticket: await ticketFor({ first: 'Ana', last: 'Cruz', b: 'B100926', exp: Date.now() + 60000 }, SECRET) });
    if (blocked.status !== 503 || !blocked.body || blocked.body.code !== 'portal-secret-missing') {
        fail(`without PORTAL_SSO_SECRET the Portal sign-in should name the missing setting (503 portal-secret-missing), got ${JSON.stringify(blocked)}`);
    } else if (!/PORTAL_SSO_SECRET/.test(blocked.body.error || '')) fail('the message should name PORTAL_SSO_SECRET');

    // 4. PORTAL_ONLY=off is the way back
    const off = makeEnv({ PORTAL_ONLY: 'off' });
    if ((await status(off)).portalOnly) fail('PORTAL_ONLY=off should turn single sign-on off');
    const typedOff = await call(off, '/api/auth/trainee', { name: 'Walk In', batch: 'B100926' });
    if (typedOff.status !== 200) fail(`with PORTAL_ONLY=off a name + batch should still sign in: ${JSON.stringify(typedOff)}`);

    // 5. single sign-on for trainers: an administrator's ticket signs them in as a trainer, once
    const aTicket = await ticketFor({ r: 'a', n: 'Coach Ana', exp: Date.now() + 60000 }, SECRET);
    const adminTicket = await call(env, '/api/auth/portal', { ticket: aTicket });
    if (adminTicket.status !== 200 || !adminTicket.body || !adminTicket.body.admin || !adminTicket.body.token) {
        fail(`an administrator's ticket should sign them in as a trainer, got ${JSON.stringify(adminTicket)}`);
    } else {
        // the token is a trainer's: an admin-only call works with it (a trainee's gets 403)
        const asAdmin = await call(env, '/api/storage/delete', { key: 'sso-test-nothing' }, { Authorization: 'Bearer ' + adminTicket.body.token });
        if (asAdmin.status !== 200) fail(`the token from an administrator's ticket isn't a trainer's: ${JSON.stringify(asAdmin)}`);
    }
    const again = await call(env, '/api/auth/portal', { ticket: aTicket });
    if (again.status !== 401 || !again.body || again.body.code !== 'used') fail(`an administrator's ticket should work only once, got ${JSON.stringify(again)}`);

    // 5b. ...once even when two uses arrive together and KV can't tell (a read elsewhere can be a minute stale): the
    //     TicketLedger Durable Object decides. Here KV never remembers a use, and two uses of one ticket race.
    {
        const mod = await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href);
        if (typeof mod.TicketLedger !== 'function') fail('worker.js should export the TicketLedger Durable Object (wrangler.json binds it)');
        else {
            const tick = () => new Promise((r) => setTimeout(r, 5));
            const instances = new Map();
            const instance = (name) => {
                if (!instances.has(name)) {
                    const data = new Map(); let gate = Promise.resolve(), alarmAt = null;
                    const state = {
                        // one event at a time inside the callback, as a Durable Object's input gate guarantees
                        blockConcurrencyWhile: (fn) => { const run = gate.then(fn); gate = run.catch(() => {}); return run; },
                        storage: { get: async (k) => { await tick(); return data.get(k); }, put: async (k, v) => { await tick(); data.set(k, v); }, setAlarm: async (t) => { alarmAt = t; }, deleteAll: async () => data.clear() }
                    };
                    const obj = new mod.TicketLedger(state, {});
                    instances.set(name, { obj, data, alarm: () => alarmAt });
                }
                return instances.get(name);
            };
            const TICKET_LEDGER = { idFromName: (n) => n, get: (n) => ({ fetch: (u, o) => instance(n).obj.fetch(new Request(u, o)) }) };
            const forgetful = makeEnv({ PORTAL_SSO_SECRET: SECRET, TICKET_LEDGER });
            forgetful.LSH_KV.get = async () => null;   // KV sees no earlier use, as a stale read elsewhere would
            const raced = await ticketFor({ r: 'a', n: 'Coach Ana', exp: Date.now() + 60000 }, SECRET);
            const both = await Promise.all([call(forgetful, '/api/auth/portal', { ticket: raced }), call(forgetful, '/api/auth/portal', { ticket: raced })]);
            const ins = both.filter((r) => r.status === 200).length;
            if (ins !== 1) fail(`two uses of one administrator's ticket at once should sign in exactly once, signed in ${ins} times: ${JSON.stringify(both.map((r) => r.status))}`);
            const third = await call(forgetful, '/api/auth/portal', { ticket: raced });
            if (third.status !== 401 || !third.body || third.body.code !== 'used') fail(`a later use of the same ticket should be refused (401 used), got ${JSON.stringify(third)}`);
            const [one] = [...instances.values()];
            if (!one || !one.alarm() || one.alarm() - Date.now() < 10 * 60 * 1000) fail('the ledger should clear its mark only after the ticket can no longer be used (an alarm past 10 minutes)');
            else { await one.obj.alarm(); if (one.data.size) fail('the ledger alarm should clear the mark'); }
            const other = await call(forgetful, '/api/auth/portal', { ticket: await ticketFor({ r: 'a', n: 'Coach Ben', exp: Date.now() + 60000 }, SECRET) });
            if (other.status !== 200) fail(`a different administrator's ticket should still sign in: ${JSON.stringify(other)}`);
        }
    }

    // 6. a trainee sees only their own Score Card: /api/ranking never names another trainee or shows their scores
    for (const [f, l] of [['Ben', 'Diaz'], ['Cara', 'Lim']]) {
        await env.LSH_KV.put(`cm:trainee:${f.toLowerCase()}-${l.toLowerCase()}--b100926`, JSON.stringify({ id: `${f.toLowerCase()}-${l.toLowerCase()}--b100926`, name: `${f} ${l}`, batch: 'B100926', approved: true, dayProgress: { 11: { done: true, score: 90 } } }));
    }
    await env.LSH_KV.put('cm:trainee:ana-cruz--b100926', JSON.stringify({ id: 'ana-cruz--b100926', name: 'Ana Cruz', batch: 'B100926', approved: true, dayProgress: { 11: { done: true, score: 80 } } }));
    const rank = await call(env, '/api/ranking', {}, { Authorization: 'Bearer ' + good.body.token });
    const names = ((rank.body && rank.body.trainees) || []).map(t => t.name);
    if (rank.status !== 200 || names.length !== 1 || names[0] !== 'Ana C.') fail(`a trainee's /api/ranking should hold only themselves, got ${JSON.stringify(names)}`);

    // 7. a session still in use is renewed (a long day never drops a live call); an expired or forged token is not
    if (adminTicket.body && adminTicket.body.token) {
        const t0 = adminTicket.body.token, exp0 = Number(t0.split('.')[2]);
        await new Promise(r => setTimeout(r, 5));
        const ren = await call(env, '/api/auth/refresh', {}, { Authorization: 'Bearer ' + t0 });
        const t1 = ren.body && ren.body.token;
        if (ren.status !== 200 || !t1 || t1.split('.')[0] !== 'a' || !(Number(t1.split('.')[2]) > exp0)) fail(`a live admin token should be renewed with a later expiry, got ${JSON.stringify(ren)}`);
        const parts = t0.split('.'); parts[2] = String(Date.now() - 1000);
        const stale = await call(env, '/api/auth/refresh', {}, { Authorization: 'Bearer ' + parts.join('.') });
        if (stale.status !== 401) fail(`an expired (or re-dated) token must not be renewed, got ${stale.status}`);
    }

    // 7b. 🔓 a sign-in lasts until 8 hours with no activity (worker.js SESSION_IDLE_HOURS): every token runs 8 hours from when it
    //     was made and an open page renews it, so a closed tab is still signed in 7 hours later and signed out 9 hours later;
    //     a token that ran out (9 hours idle) can't be brought back by the name + batch renewal either (no grace)
    {
        const H = 3600e3, near = (t, ms) => Math.abs(Number(String(t || '').split('.')[2]) - Date.now() - ms) < 60000;
        if (!(adminTicket.body && near(adminTicket.body.token, 8 * H))) fail(`a trainer's Portal sign-in should run 8 hours: ${adminTicket.body && adminTicket.body.token}`);
        if (!(good.body && near(good.body.token, 8 * H))) fail(`a trainee's Portal sign-in should run 8 hours (it was 30 days): ${good.body && good.body.token}`);
        const pw = await call(env, '/api/auth/admin', { passphrase: 'ci-pass' });
        if (!(pw.body && near(pw.body.token, 8 * H))) fail(`a trainer's admin-password sign-in should run 8 hours (it was 12): ${JSON.stringify(pw.body)}`);
        const ren = await call(env, '/api/auth/refresh', {}, { Authorization: 'Bearer ' + good.body.token });
        if (!(ren.status === 200 && near(ren.body && ren.body.token, 8 * H))) fail(`a renewed token should run 8 hours from now: ${JSON.stringify(ren)}`);
        // a token made <ago> hours ago (signed as the Worker signs one), as a tab closed then and opened again now finds it
        const signed = async (role, subj, ago) => {
            const body = `${role}.${encodeURIComponent(subj)}.${Date.now() - ago * H + 8 * H}`;
            const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('ci-secret'), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
            const sig = btoa(String.fromCharCode(...new Uint8Array(await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(body))))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
            return `${body}.${sig}`;
        };
        const tid = good.body.id;
        for (const [ago, alive] of [[0.05, true], [7, true], [9, false], [24, false]]) {
            for (const [role, subj] of [['a', 'admin:Coach Ana'], ['t', tid]]) {
                const r = await call(env, '/api/auth/refresh', {}, { Authorization: 'Bearer ' + await signed(role, subj, ago) });
                if ((r.status === 200) !== alive) fail(`a ${role === 'a' ? "trainer's" : "trainee's"} sign-in idle ${ago} h should read ${alive ? 'signed in' : 'signed out'}, got ${r.status}`);
            }
            const rn = await call(env, '/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926', id: tid }, { Authorization: 'Bearer ' + await signed('t', tid, ago) });
            if ((rn.status === 200) !== alive) fail(`the name + batch renewal of a trainee idle ${ago} h should be ${alive ? 'accepted' : 'refused (portal-required)'}, got ${rn.status} ${JSON.stringify(rn.body).slice(0, 120)}`);
        }
    }

    // 6. 🎯 a Portal ticket names the program it is for (p, this program's topic key) and works once, whoever it is for
    //    (platform QA 2026-11-19, finding 1): a ticket made for another program or a tool is refused, so Program Access on
    //    the Portal stays the one gate (one with no p is still taken: the rollout); and the trainee's full registered name (finding 8) is kept, the ID unchanged.
    {
        const soon = () => Date.now() + 60000;
        const e6 = makeEnv({ PORTAL_SSO_SECRET: SECRET });
        for (const [label, p] of [["another program's", 'SOME OTHER PROGRAM'], ["the Knowledge Base's", 'kb'], ["a course's tool link", 'tool'], ['a blank-audience', '']]) {
            for (const [kind, t] of [['trainee', { first: 'Pat', last: 'Lane', b: 'B100926' }], ['admin', { r: 'a', n: 'Coach Ana' }], ['system', { r: 's' }]]) {
                const res = await call(e6, '/api/auth/portal', { ticket: await ticketFor(Object.assign({}, t, { p, exp: soon() }), SECRET) });
                if (res.status !== 401 || !res.body || res.body.code !== 'audience' || res.body.token) fail(`${label} ${kind} ticket must be refused (401 audience), got ${JSON.stringify(res)}`);
            }
        }
        if ([...e6.__store.keys()].some((k) => /pat-lane/.test(k) && !/^(\w+:)?sso-used:/.test(k))) fail('a refused ticket must not create or approve a trainee record');
        // a ticket with no p (made before the Portal named the program) is still taken, so nobody is locked out mid-rollout
        const np = await call(e6, '/api/auth/portal', { ticket: await ticketFor({ first: 'Pat', last: 'Lane', b: 'B100926', p: undefined, exp: soon() }, SECRET) });
        if (np.status !== 200 || !np.body || !np.body.token) fail(`a ticket with no p should still sign in: ${JSON.stringify(np)}`);
        const ap = await call(e6, '/api/auth/portal', { ticket: await ticketFor({ r: 'a', n: 'Coach Ana', p: undefined, exp: soon() }, SECRET) });
        if (ap.status !== 200 || !ap.body || !ap.body.admin) fail(`a trainer's ticket with no p should still sign in: ${JSON.stringify(ap)}`);
        // a trainee's own ticket works once, like a trainer's
        const tt = await ticketFor({ first: 'Pat', last: 'Lane', b: 'B100926', p: PORTAL_TOPIC, exp: soon() }, SECRET);
        const first = await call(e6, '/api/auth/portal', { ticket: tt });
        if (first.status !== 200 || !first.body || !first.body.token) fail(`this program's own trainee ticket should sign in: ${JSON.stringify(first)}`);
        const second = await call(e6, '/api/auth/portal', { ticket: tt });
        if (second.status !== 401 || !second.body || second.body.code !== 'used' || second.body.token) fail(`a trainee's ticket should work only once, got ${JSON.stringify(second)}`);
        // the Sign-in check's system ticket works once too
        const st = await ticketFor({ r: 's', exp: soon() }, SECRET);
        const s1 = await call(e6, '/api/auth/portal', { ticket: st }), s2 = await call(e6, '/api/auth/portal', { ticket: st });
        if (s1.status !== 200 || s2.status !== 401) fail(`the Sign-in check's ticket should work once: ${s1.status} then ${s2.status}`);
        // the full registered name is kept as fullName, the ID stays first + last + batch
        const fm = await call(e6, '/api/auth/portal', { ticket: await ticketFor({ first: 'Maria', last: 'Santos', b: 'B100926', full: 'Maria L. Santos', exp: soon() }, SECRET) });
        const fullName = fm.body && (fm.body.fullName || (fm.body.existing && fm.body.existing.fullName));
        if (fm.status !== 200 || fm.body.id !== 'maria-santos--b100926' || fullName !== 'Maria L. Santos') fail(`a ticket's full name should be kept as fullName with the same ID: ${JSON.stringify(fm.body && { id: fm.body.id, fullName })}`);
    }

    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Single sign-on: the Portal is the only way a trainee gets in, a typed name + batch is refused, a missing PORTAL_SSO_SECRET says so, a trainee sees only their own ranking, and a trainer signed in on the Portal gets in with no second password, once per ticket.');
})().catch(e => { console.error(e); process.exit(1); });
