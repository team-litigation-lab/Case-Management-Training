// Training tools open signed in: no CMS (or Training Portal) log-in page.
// A trainee signed in on this program opens the CMS and the Portal's simulators already signed in, because
// every outbound tool link carries a short-lived Portal-style ticket (js/lsh-tool-links.js, /api/auth/tool-ticket).
// This test covers both halves, with no server and no browser:
//   1. The Worker's /api/auth/tool-ticket: a signed-in trainee gets a ticket that verifies against
//      PORTAL_SSO_SECRET and carries their name, batch and a 5-minute expiry; a trainer gets the Portal's
//      administrator ticket ({r: "a"}, no trainee name); without the secret it says so; an unapproved or
//      archived trainee is refused.
//   2. js/lsh-tool-links.js: every address in the Training Tools hub (js/cm-skillbuilders.js) is
//      recognized as a tool, and ticketed() adds ?ticket= to it for a trainee and for a trainer (the 👁 Trainee
//      view included, a fresh one each time) and leaves anything that isn't a tool, or anyone not signed in, alone.
// Usage: node .github/scripts/tool-links.cjs   (from the repository root)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');

const failures = [];
const fail = (m) => failures.push(m);
const SECRET = 'portal-secret-shared-with-the-portal';
const ROOT = process.cwd();

const b64url = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
const unb64url = (s) => Buffer.from(String(s).replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8');
async function sign(payload, secret) {
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('portal-sso:' + secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}
const ticketFor = async (obj, secret) => { const p = b64url(JSON.stringify(obj)); return p + '.' + await sign(p, secret); };

// ---------- the Training Tools hub's addresses (js/cm-skillbuilders.js) ----------
function toolAddresses() {
    const src = fs.readFileSync(path.join(ROOT, 'js/cm-skillbuilders.js'), 'utf8');
    const i = src.indexOf('const CM_TOOL_DEFAULTS');
    if (i < 0) { fail('js/cm-skillbuilders.js: CM_TOOL_DEFAULTS not found (the Training Tools hub moved?)'); return []; }
    const block = src.slice(i, src.indexOf('\n];', i));
    const out = [];
    const re = /\{\s*id:\s*"([^"]+)"[\s\S]*?url:\s*"([^"]+)"/g;
    let m; while ((m = re.exec(block))) out.push({ id: m[1], url: m[2] });
    return out;
}

// ---------- js/lsh-tool-links.js in a small DOM shim ----------
function loadToolLinks(stateObj, fetchImpl) {
    const listeners = {};
    const sandbox = {
        console,
        location: { href: 'https://case-management-training.legalsupporthelp.workers.dev/' },
        URL, URLSearchParams, Promise, Date, fetch: fetchImpl,
        state: stateObj,
        authHeaders: () => ({ 'Content-Type': 'application/json', Authorization: 'Bearer test-token' }),
        document: { addEventListener: (t, f) => { listeners[t] = f; } }
    };
    sandbox.window = sandbox;
    sandbox.globalThis = sandbox;
    vm.createContext(sandbox);
    vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/lsh-tool-links.js'), 'utf8'), sandbox, { filename: 'lsh-tool-links.js' });
    return sandbox.LSHToolLinks;
}

(async () => {
    const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
    const makeEnv = (extra) => {
        const store = new Map();
        return Object.assign({
            MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret',
            LSH_KV: {
                get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, String(v)),
                delete: async (k) => store.delete(k),
                list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true })
            }, __store: store
        }, extra);
    };
    const call = async (env, p, body, headers) => {
        const res = await worker.fetch(new Request('http://x' + p, {
            method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, headers || {}), body: JSON.stringify(body || {})
        }), env, { waitUntil() { } });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const signInTrainee = async (env) => (await call(env, '/api/auth/portal',
        { ticket: await ticketFor({ first: 'Ana', last: 'Cruz', b: 'B100926', exp: Date.now() + 60000 }, SECRET) })).body;

    /* ---------- 1. the Worker mints the ticket ---------- */
    const env = makeEnv({ PORTAL_SSO_SECRET: SECRET });
    const me = await signInTrainee(env);
    if (!me || !me.token) { fail('the Portal sign-in should give a trainee a token (see sso.cjs)'); }
    else {
        const auth = { Authorization: 'Bearer ' + me.token };
        const got = await call(env, '/api/auth/tool-ticket', {}, auth);
        if (got.status !== 200 || !got.body || !got.body.ticket) fail(`a signed-in trainee should get a tool ticket: ${JSON.stringify(got)}`);
        else {
            const [payload, sig] = String(got.body.ticket).split('.');
            if (sig !== await sign(payload, SECRET)) fail('the tool ticket should be signed with PORTAL_SSO_SECRET, the way the Portal signs its own');
            let claims = null; try { claims = JSON.parse(unb64url(payload)); } catch (e) { fail('the tool ticket payload should be readable JSON'); }
            if (claims) {
                if (claims.first !== 'Ana' || claims.last !== 'Cruz') fail(`the ticket should carry the trainee's name: ${JSON.stringify(claims)}`);
                if (claims.b !== 'B100926') fail(`the ticket should carry the trainee's batch: ${JSON.stringify(claims.b)}`);
                if (claims.r) fail("the ticket must not claim the administrator's role");
                const left = claims.exp - Date.now();
                if (!(left > 0 && left <= 5 * 60 * 1000 + 2000)) fail(`the ticket should be good for about 5 minutes, not ${Math.round(left / 1000)}s`);
            }
        }
        // A trainer gets the Portal's administrator ticket: {r: "a"}, signed the same way, good for 5 minutes, and
        // never a trainee's name (an admin's token is subject "admin": a trainee record under that name is seeded
        // first, so the ticket has to come from the role, not from a record that happens to be there).
        const admin = await call(env, '/api/auth/admin', { passphrase: 'ci-pass' });
        if (!admin.body || !admin.body.token) fail(`the admin password should sign an admin in: ${JSON.stringify(admin)}`);
        else {
            await env.LSH_KV.put('cm:trainee:admin', JSON.stringify({ id: 'admin', name: 'Ad Min', firstName: 'Ad', lastName: 'Min', batch: 'B100926', approved: true }));
            const adminTicket = await call(env, '/api/auth/tool-ticket', {}, { Authorization: 'Bearer ' + admin.body.token });
            if (adminTicket.status !== 200 || !adminTicket.body || !adminTicket.body.ticket) fail(`a trainer should get a tool ticket: ${JSON.stringify(adminTicket)}`);
            else {
                const [payload, sig] = String(adminTicket.body.ticket).split('.');
                if (sig !== await sign(payload, SECRET)) fail("the trainer's ticket should be signed with PORTAL_SSO_SECRET");
                let claims = null; try { claims = JSON.parse(unb64url(payload)); } catch (e) { fail("the trainer's ticket payload should be readable JSON"); }
                if (claims) {
                    if (claims.r !== 'a') fail(`the trainer's ticket should be the Portal's administrator ticket (r: "a"): ${JSON.stringify(claims)}`);
                    if (claims.first || claims.last || claims.b) fail(`the trainer's ticket must not carry a trainee's name or batch: ${JSON.stringify(claims)}`);
                    const left = claims.exp - Date.now();
                    if (!(left > 0 && left <= 5 * 60 * 1000 + 2000)) fail(`the trainer's ticket should be good for about 5 minutes, not ${Math.round(left / 1000)}s`);
                }
            }
            await env.LSH_KV.delete('cm:trainee:admin');
        }
        // a trainee whose access was taken away is refused
        const revoked = makeEnv({ PORTAL_SSO_SECRET: SECRET });
        const r2 = await signInTrainee(revoked);
        const rec = JSON.parse(await revoked.LSH_KV.get('cm:trainee:' + r2.id) || await revoked.LSH_KV.get('trainee:' + r2.id) || 'null');
        if (!rec) fail("the signed-in trainee's record should be in the store");
        else {
            const key = (await revoked.LSH_KV.list({ prefix: '' })).keys.map(k => k.name).find(k => k.endsWith('trainee:' + r2.id));
            await revoked.LSH_KV.put(key, JSON.stringify(Object.assign({}, rec, { approved: false })));
            const out = await call(revoked, '/api/auth/tool-ticket', {}, { Authorization: 'Bearer ' + r2.token });
            if (out.status !== 403) fail(`a trainee who isn't approved should not get a tool ticket (403), got ${JSON.stringify(out)}`);
        }
    }
    // without the secret the links open as they are, and the Worker says why
    const noSecret = makeEnv({});
    const n = await signInTrainee(noSecret);
    const noTicket = await call(noSecret, '/api/auth/tool-ticket', {}, n && n.token ? { Authorization: 'Bearer ' + n.token } : {});
    if (noTicket.status === 200) fail('without PORTAL_SSO_SECRET there is nothing to sign a tool ticket with: it should not answer 200');

    /* ---------- 2. every tool link carries it on the way out ---------- */
    const tools = toolAddresses();
    if (tools.length < 8) fail(`expected the Training Tools hub's eight tools, found ${tools.length}`);
    let asked = 0;
    const fetchTicket = (u) => {
        if (!String(u).includes('/api/auth/tool-ticket')) return Promise.reject(new Error('unexpected request: ' + u));
        asked++;
        return Promise.resolve({ ok: true, json: () => Promise.resolve({ ticket: 'TESTTICKET' }) });
    };
    const trainee = { traineeId: 'ana-cruz--b100926', authToken: 'test-token', isAdmin: false, adminPreview: false };
    const links = loadToolLinks(trainee, fetchTicket);
    for (const t of tools) {
        if (!links.isTool(t.url)) { fail(`${t.id}: ${t.url} is not recognized as a training tool, so it would open the log-in page`); continue; }
        const out = await links.ticketed(t.url);
        const q = new URL(out).searchParams;
        if (q.get('ticket') !== 'TESTTICKET') fail(`${t.id}: the address should carry ?ticket= (got ${out})`);
        // the address keeps everything it already had
        const had = new URL(t.url).searchParams;
        for (const [k, v] of had) if (q.get(k) !== v) fail(`${t.id}: ${k}=${v} was lost when the ticket was added (${out})`);
    }
    if (asked !== 1) fail(`the ticket should be asked for once and reused, not ${asked} times`);
    // a Call Simulator line's graded calls (the Portal's page, which opens ☎ LSH Ring Channel), and a Training Library case, keep their query too
    const deep = await links.ticketed('https://cm-training-activity.pages.dev/simulators/call.html?program=CM&line=Adjusters%20%26%20Carriers&mode=graded');
    if (!/[?&]ticket=TESTTICKET/.test(deep) || !/mode=graded/.test(deep)) fail(`a graded call link should keep its query and get the ticket: ${deep}`);
    // the shared Drafting tool on the Portal (js/cm-lor.js and js/cm-medprov.js send trainees there
    // instead of drafting in the course, so it has to be signed in like any other tool)
    const drafting = await links.ticketed('https://cm-training-activity.pages.dev/simulators/drafting.html');
    if (!/[?&]ticket=TESTTICKET/.test(drafting)) fail(`the shared Drafting tool should get the ticket: ${drafting}`);
    for (const f of ['js/cm-lor.js', 'js/cm-medprov.js']) {
        const src = fs.readFileSync(path.join(ROOT, f), 'utf8');
        if (!src.includes('https://cm-training-activity.pages.dev/simulators/drafting.html')) {
            fail(`${f} should open the shared Drafting tool on the Portal`);
        }
    }
    const cmsDeep = await links.ticketed('https://lshcasemanagementtraining-trainingcrm.pages.dev/?program=CM&mock=MC-04');
    if (!/[?&]ticket=TESTTICKET/.test(cmsDeep) || !/mock=MC-04/.test(cmsDeep)) fail(`a Training Library case link should keep its query and get the ticket: ${cmsDeep}`);

    // anything that isn't a training tool is left alone
    for (const other of ['https://cm-training-activity.pages.dev/programs.html', 'https://example.com/?x=1', '/js/cm-updates.js']) {
        if (links.isTool(other)) fail(`${other} should not be treated as a training tool`);
        if (await links.ticketed(other) !== other) fail(`${other} should be left as it is`);
    }
    // a trainer and the 👁 Trainee view get a ticket too, a fresh one for every tool (the CMS takes a trainer's once)
    for (const who of [{ traineeId: '', authToken: '', isAdmin: true, adminToken: 'a-token' }, { traineeId: 'x', authToken: 't', isAdmin: false, adminPreview: true, adminToken: 'a-token' }]) {
        let n = 0;
        const l = loadToolLinks(who, (u) => { n++; return fetchTicket(u); });
        const url = tools[0] ? tools[0].url : 'https://lshcasemanagementtraining-trainingcrm.pages.dev';
        for (let k = 0; k < 2; k++) if (!/[?&]ticket=TESTTICKET/.test(await l.ticketed(url))) fail(`${JSON.stringify(who)}: a trainer's tool link should carry ?ticket=`);
        if (n !== 2) fail(`${JSON.stringify(who)}: a trainer's ticket is used once, so each tool should ask for its own (asked ${n} times for 2)`);
    }
    // nobody signed in: left alone
    { const l = loadToolLinks({ traineeId: '', authToken: '' }, () => Promise.reject(new Error('nobody is signed in: no ticket to ask for')));
      const url = tools[0] ? tools[0].url : 'https://lshcasemanagementtraining-trainingcrm.pages.dev';
      if (await l.ticketed(url) !== url) fail('with nobody signed in, the address should be left as it is'); }

    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Training tools open signed in: the Worker signs a 5-minute ticket for a trainee and for a trainer, and all ${tools.length} tool addresses carry it on the way out.`);
})().catch(e => { console.error(e); process.exit(1); });
