// @check node — 🔓 A sign-in lasts until 8 hours with no activity: closing the tab keeps it, 9 hours idle ends it (index.html's tokens)
// The page's half of the rule (the Worker's half is in sso.cjs, 7b): index.html's SECURE MODE block, run in a small shim.
//   1. Both tokens are kept in localStorage, so closing the tab or the browser signs no one out: the trainer's token,
//      which used to live in sessionStorage (every new tab: the admin password again), is moved there as the page opens.
//   2. A token made 7 hours ago (a tab closed this morning, opened again this afternoon) is still signed in; one made
//      9 hours ago (8 hours with no activity) is dropped as the page opens, which reads as signed out.
//   3. While the page is open its tokens are renewed (/api/auth/refresh) whatever is left on them, so a session in use
//      never runs out; one that ran out while the laptop slept is not renewed: the page opens again (reload), signed out.
//   4. 🚪 Log out (setAdminToken("") / setTraineeToken("")) clears both stores.
// Usage: node .github/scripts/session-idle.cjs   (from the repository root; no server, no browser)
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const failures = [];
const check = (ok, m) => { if (!ok) failures.push(m); };
const html = fs.readFileSync(path.join(process.cwd(), 'index.html'), 'utf8');
const a = html.indexOf('state.authToken = (()=>');
const z = html.indexOf('\n', html.indexOf('function setAdminToken('));
if (a < 0 || z < 0) { console.log('index.html: the SECURE MODE token block was not found (state.authToken … function setAdminToken)'); process.exit(1); }
const block = html.slice(a, z);

const H = 3600e3;
const tok = (role, ago) => `${role}.someone.${Date.now() - ago * H + 8 * H}.sig`;   // a token made <ago> hours ago (8-hour life)
const store = () => { const m = new Map(); return { m, getItem: (k) => (m.has(k) ? m.get(k) : null), setItem: (k, v) => m.set(k, String(v)), removeItem: (k) => m.delete(k) }; };

async function page({ local = {}, session = {} } = {}) {
    const localStorage = store(), sessionStorage = store();
    Object.entries(local).forEach(([k, v]) => localStorage.setItem(k, v));
    Object.entries(session).forEach(([k, v]) => sessionStorage.setItem(k, v));
    const calls = [], listeners = {};
    const ctx = {
        state: {}, localStorage, sessionStorage, Date, Number, String, Promise, JSON, Object,
        document: { visibilityState: 'visible', addEventListener: (t, f) => { listeners[t] = f; } },
        location: { reloads: 0, reload() { this.reloads++; } },
        setInterval: () => 0, setTimeout: () => 0,
        fetch: async (url, opts) => { calls.push({ url, auth: opts.headers.Authorization }); const role = opts.headers.Authorization.slice(7, 8); return { ok: true, json: async () => ({ token: tok(role, 0) }) }; }
    };
    vm.createContext(ctx);
    vm.runInContext(block + '\n;this.__api = { refreshTokens, setAdminToken, setTraineeToken };', ctx);
    return { ctx, calls, listeners, api: ctx.__api };
}

(async () => {
    // 1. the trainer's token moves from sessionStorage to localStorage, so a new tab or a reopened browser is still signed in
    {
        const t = tok('a', 1);
        const p = await page({ session: { lsh_admin_token: t } });
        check(p.ctx.state.adminToken === t, 'a live trainer token saved in sessionStorage (before this change) should still sign the trainer in');
        check(p.ctx.localStorage.getItem('lsh_admin_token') === t && p.ctx.sessionStorage.getItem('lsh_admin_token') === null, 'the trainer token should move to localStorage, so closing the tab does not sign the trainer out');
        p.api.setAdminToken(tok('a', 0));
        check(!!p.ctx.localStorage.getItem('lsh_admin_token') && p.ctx.sessionStorage.getItem('lsh_admin_token') === null, 'setAdminToken should keep the trainer token in localStorage');
    }
    // 2. 7 hours idle: still signed in; 9 hours idle: signed out (both roles)
    for (const [ago, alive] of [[0.1, true], [7, true], [9, false], [30, false]]) {
        const ta = tok('a', ago), tt = tok('t', ago);
        const p = await page({ local: { lsh_admin_token: ta, lsh_auth_token: tt } });
        check((p.ctx.state.adminToken === ta) === alive, `a trainer token ${ago} h idle should read ${alive ? 'signed in' : 'signed out'}`);
        check((p.ctx.state.authToken === tt) === alive, `a trainee token ${ago} h idle should read ${alive ? 'signed in' : 'signed out'}`);
        if (!alive) check(p.ctx.localStorage.getItem('lsh_admin_token') === null && p.ctx.localStorage.getItem('lsh_auth_token') === null, `a token ${ago} h idle should be dropped from the device`);
    }
    // 3. an open page renews its tokens whatever is left on them (not only in their last hours), and as the tab comes back
    {
        const p = await page({ local: { lsh_admin_token: tok('a', 0.5), lsh_auth_token: tok('t', 0.5) } });
        await p.api.refreshTokens();
        check(p.calls.length === 2 && p.calls.every((c) => c.url === '/api/auth/refresh'), `an open page should renew both tokens (7.5 hours left on each): ${p.calls.length} renewal(s)`);
        check(Number(p.ctx.state.adminToken.split('.')[2]) - Date.now() > 7.9 * H, 'the renewed trainer token should run 8 hours from now');
        check(p.ctx.location.reloads === 0, 'a live session should not reload the page');
        check(typeof p.listeners.visibilitychange === 'function', 'the page should renew its tokens as a tab comes back into view');
        // the laptop slept 9 hours with the tab open: the token ran out, nothing is renewed, the page opens again signed out
        p.ctx.state.authToken = tok('t', 9); p.calls.length = 0;
        await p.api.refreshTokens();
        check(p.ctx.location.reloads === 1 && !p.calls.some((c) => c.auth === 'Bearer ' + p.ctx.state.authToken), 'a token that ran out (9 hours idle) should not be renewed: the page reloads, signed out');
    }
    // 4. 🚪 Log out clears both stores
    {
        const p = await page({ local: { lsh_admin_token: tok('a', 0), lsh_auth_token: tok('t', 0) }, session: { lsh_admin_token: tok('a', 0) } });
        p.api.setAdminToken(''); p.api.setTraineeToken('');
        check(!p.ctx.state.adminToken && !p.ctx.state.authToken && ![p.ctx.localStorage, p.ctx.sessionStorage].some((s) => s.m.size), 'Log out should clear both tokens from both stores');
    }
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Sign-in lasts until 8 hours idle: both tokens in localStorage (closing the tab keeps the sign-in), 7 h idle signed in, 9 h idle signed out, an open page renews its tokens, Log out clears them.');
})().catch((e) => { console.error(e); process.exit(1); });
