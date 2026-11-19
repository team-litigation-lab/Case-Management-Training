// The Worker in Node, for the node checks of trainee identity, sign-in and records (trainee-identity.cjs, merged-signin.cjs,
// admin-kc-keep.cjs, progress-merge.cjs, account-repair.cjs): an in-memory KV (the "cm:" keys as the Worker stores them),
// a Portal ticket signed with the shared secret, and the Worker's own routes. Not a check itself.
// Usage: const { harness } = require('./worker-harness.cjs'); const h = await harness({ portalOnly: true });
const path = require('path');
const { pathToFileURL } = require('url');

const SECRET = 'portal-secret-shared-with-the-portal';
const b64url = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
// A Portal ticket names the program it is for (p, its topic key: the Portal's makeTicket); p: undefined leaves it out.
const PORTAL_TOPIC = 'CM TRAINING';
async function ticketFor(payloadObj) {
    const payload = b64url(JSON.stringify(Object.assign({ p: PORTAL_TOPIC }, payloadObj)));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('portal-sso:' + SECRET), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return payload + '.' + btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function harness(opts = {}) {
    const worker = (await import(pathToFileURL(path.join(__dirname, '../../worker.js')).href)).default;
    const store = new Map(), meta = new Map();
    const h = { store, failPut: null };
    const env = {
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_SSO_SECRET: SECRET,
        LSH_KV: {
            get: async (k) => store.has(k) ? store.get(k) : null,
            put: async (k, v, o) => { if (h.failPut && h.failPut(k)) throw new Error('KV put failed (test)'); store.set(k, v); if (o && o.metadata) meta.set(k, o.metadata); },
            delete: async (k) => { store.delete(k); meta.delete(k); },
            list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).sort().map((name) => Object.assign({ name }, meta.has(name) ? { metadata: meta.get(name) } : {})), list_complete: true })
        }
    };
    if (!opts.portalOnly) env.PORTAL_ONLY = 'off';
    h.env = env;
    h.api = async (p, body, token) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() { } });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    h.portal = async (first, last, b, u) => h.api('/api/auth/portal', { ticket: await ticketFor(Object.assign({ first, last, b, exp: Date.now() + 60000 }, u ? { u } : {})) });
    h.admin = (await h.api('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    h.get = async (key) => { const r = await h.api('/api/storage/get', { key }, h.admin); return r.body && r.body.value != null ? JSON.parse(r.body.value) : null; };
    h.set = (key, v, token = h.admin, extra = {}) => h.api('/api/storage/set', Object.assign({ key, value: JSON.stringify(v) }, extra), token);
    // the raw KV, as stored (the Worker's "cm:" prefix)
    h.raw = (key) => { const v = store.get('cm:' + key); return v == null ? null : JSON.parse(v); };
    h.rawPut = (key, v) => store.set('cm:' + key, JSON.stringify(v));
    h.has = (key) => store.has('cm:' + key);
    h.ids = (prefix) => [...store.keys()].filter((k) => k.startsWith('cm:' + prefix)).map((k) => k.slice(3));
    return h;
}
function reporter() {
    const failures = [];
    return {
        fail: (m) => failures.push(m),
        check: (ok, m) => { if (!ok) failures.push(m); },
        done: (okMsg) => {
            if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
            console.log(okMsg);
        }
    };
}
module.exports = { harness, reporter, ticketFor };
