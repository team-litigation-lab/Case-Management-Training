// Server requests: every /api/ request counts toward Cloudflare's Worker requests for the whole
// account (shared with every other LSH site), so an open page must ask sparingly.
// 1. /api/storage/get-many (worker.js, in secure mode): a trainee gets their own and public records
//    only, an Admin gets every one, more than 100 keys are refused, and keys get the same "cm:"
//    prefix as /api/storage/get (an EA/PA record without the prefix is never read).
// 2. In a browser (checks sped up with window.EAPA_POLL, the same name as in the EA/PA portal): a
//    signed-in trainee's page reads the tasks for every day in one request, reads their record about
//    once per check, checks for a new version rarely, and asks nothing while the tab is in the
//    background (catching up when it's back). A server that doesn't answer never signs the trainee
//    out; a revoke still does. The Admin's Trainee Audit reads every trainee in two requests
//    (the list, then get-many).
// Usage: node .github/scripts/requests.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');   // the name + batch form is gone: trainees arrive from the Portal
const path = require('path'); const { pathToFileURL } = require('url');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

async function workerChecks() {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    // The shared LSH_KV namespace: this course's keys start with "cm:"; EA/PA's have no prefix.
    const store = new Map([
        ['cm:trainee:ana-cruz--b1', JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true })],
        ['cm:trainee:ben-diaz--b1', JSON.stringify({ id: 'ben-diaz--b1', name: 'Ben Diaz', batch: 'B1', approved: true })],
        ['cm:surprise-task-day1', JSON.stringify({ title: 'A task' })],
        ['surprise-task-day2', JSON.stringify({ title: 'An EA/PA task' })]
    ]);
    const env = {
        // PORTAL_ONLY=off so this test can mint a trainee token by name + batch; trainees really come in
        // from the LSH Training Portal (sso.cjs). What's checked here is the storage rules, not the sign-in.
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) }
    };
    const call = async (p, body, token) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() {} });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const t = (await call('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B1' })).body.token;
    const a = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    const keys = ['trainee:ana-cruz--b1', 'trainee:ben-diaz--b1', 'surprise-task-day1', 'surprise-task-day2'];
    const asTrainee = await call('/api/storage/get-many', { keys }, t);
    const v = (asTrainee.body && asTrainee.body.values) || {};
    if (asTrainee.status !== 200 || !v['trainee:ana-cruz--b1'] || !v['surprise-task-day1'] || !('surprise-task-day2' in v)) fail(`get-many as a trainee: ${JSON.stringify(asTrainee)}`);
    if ('trainee:ben-diaz--b1' in v) fail('get-many lets a trainee read another trainee\'s record');
    if (v['surprise-task-day2']) fail('get-many read an EA/PA record (a key without the "cm:" prefix)');
    const one = await call('/api/storage/get', { key: 'trainee:ana-cruz--b1' }, t);
    if (!one.body || one.body.value !== v['trainee:ana-cruz--b1']) fail(`get-many and get disagree on the same record: ${JSON.stringify(one)}`);
    const asAdmin = await call('/api/storage/get-many', { keys }, a);
    if (!asAdmin.body || !asAdmin.body.values || !asAdmin.body.values['trainee:ben-diaz--b1']) fail(`get-many as an Admin: ${JSON.stringify(asAdmin)}`);
    if (asAdmin.body && asAdmin.body.values && asAdmin.body.values['surprise-task-day2']) fail('get-many read an EA/PA record for an Admin (no "cm:" prefix)');
    if ((await call('/api/storage/get-many', { keys }, null)).status !== 401) fail('get-many works without signing in');
    if ((await call('/api/storage/get-many', { keys: Array.from({ length: 101 }, (_, i) => 'k' + i) }, a)).status !== 400) fail('get-many takes more than 100 keys');
}

(async () => {
    await workerChecks();

    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await (await browser.newContext({ viewport: { width: 1360, height: 900 } })).newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.addInitScript(() => { window.EAPA_POLL = { live: 500, approval: 2000, labReset: 2000, feedback: 4000, admin: 2000, update: 3000, updateConfirm: 500 }; });
    const log = [];
    let refuse = false;   // the server stops answering (Cloudflare's request limit: 429)
    await page.route('**/*', async (route) => {
        const req = route.request(), u = new URL(req.url());
        if (u.pathname.startsWith('/api/') || u.pathname === '/version') {
            let key = ''; try { const b = JSON.parse(req.postData() || '{}'); key = b.key || (b.keys ? `[${b.keys.length}] ` + b.keys.join(',') : ''); } catch (e) {}
            log.push({ at: Date.now(), path: u.pathname, key });
            if (refuse) return route.fulfill({ status: 429, contentType: 'text/html', body: '<h1>Error 1027</h1>' });
        }
        return route.continue();
    });
    const since = (t, f) => log.filter(x => x.at >= t && (!f || f(x)));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Req', 'Count', 'B100926');
    const setApproved = (on) => page.evaluate(async (on) => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = on;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    }, on);
    await setApproved(true);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(3000);
    const me = await page.evaluate(() => 'trainee:' + state.traineeId);
    if (!(await page.evaluate(() => !!state.traineeId && state.view !== 'login'))) fail('the trainee didn\'t get signed in');

    // in view: 8 s of checks (sped up: the trainee's check every 2 s, the update check every 3 s)
    let t0 = Date.now(); await page.waitForTimeout(8000);
    const all = since(t0), ticks = 4;
    const singleTasks = all.filter(x => x.path === '/api/storage/get' && /^surprise-task-day/.test(x.key));
    const many = all.filter(x => x.path === '/api/storage/get-many' && /surprise-task-day/.test(x.key));
    const record = all.filter(x => x.path === '/api/storage/get' && x.key === me);
    const version = all.filter(x => x.path === '/version');
    if (singleTasks.length) fail(`the tasks are read one day at a time (${singleTasks.length} requests in 8 s): they should come in one get-many`);
    if (!many.length || many.length > ticks + 1) fail(`the tasks check ran ${many.length} times in 8 s (expected about ${ticks})`);
    if (!record.length || record.length > 2 * ticks + 1) fail(`the trainee's record was read ${record.length} times in 8 s (expected about ${ticks})`);
    if (version.length > 4) fail(`the version was checked ${version.length} times in 8 s (expected 3 or so)`);
    const perCheck = all.length / ticks;
    if (perCheck > 5) fail(`${all.length} requests in 8 s (${perCheck.toFixed(1)} per check): ${JSON.stringify(all.map(x => x.path + ' ' + x.key.slice(0, 40)))}`);

    // in the background: nothing; back in view: it catches up at once
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'hidden' }); document.dispatchEvent(new Event('visibilitychange')); });
    t0 = Date.now(); await page.waitForTimeout(6000);
    const hidden = since(t0);
    if (hidden.length) fail(`${hidden.length} requests while the tab was in the background: ${JSON.stringify(hidden.map(x => x.path + ' ' + x.key.slice(0, 40)))}`);
    await page.evaluate(() => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => 'visible' }); document.dispatchEvent(new Event('visibilitychange')); });
    t0 = Date.now(); await page.waitForTimeout(800);
    if (!since(t0, x => x.key === me).length) fail(`coming back to the tab didn't check the trainee's record: ${JSON.stringify(since(t0 - 1000).map(x => x.path + ' ' + x.key.slice(0, 40)))}`);
    // a quick look at another tab (Meet) and back asks nothing: a second tab with the real timings,
    // between its scheduled checks (the first round runs as it opens; the next is a minute away)
    const page2 = await page.context().newPage();
    const log2 = [];
    page2.on('request', r => { const u = new URL(r.url()); if (u.pathname.startsWith('/api/') || u.pathname === '/version') log2.push({ at: Date.now(), path: u.pathname }); });
    page2.on('pageerror', e => fail(`page error (second tab): ${e.message}`));
    await page2.goto(BASE, { waitUntil: 'load' }); await page2.waitForTimeout(22000);   // its first check rounds: 15 s (feedback), 20 s (version)
    const flip = (v) => page2.evaluate((v) => { Object.defineProperty(document, 'visibilityState', { configurable: true, get: () => v }); document.dispatchEvent(new Event('visibilitychange')); }, v);
    await flip('hidden'); await page2.waitForTimeout(500);
    t0 = Date.now(); await flip('visible'); await page2.waitForTimeout(1500);
    const flick = log2.filter(x => x.at >= t0);
    if (flick.length) fail(`a quick switch to another tab and back sent ${flick.length} requests: ${JSON.stringify(flick.map(x => x.path))}`);
    await page2.close();

    // the server stops answering: the trainee stays signed in (it was signing them out as "revoked")
    refuse = true; await page.waitForTimeout(5000); refuse = false;
    const still = await page.evaluate(() => ({ id: state.traineeId, view: state.view }));
    if (!still.id || still.view === 'login') fail(`a server that didn't answer signed the trainee out: ${JSON.stringify(still)}`);
    // a real revoke still signs them out
    await setApproved(false); await page.waitForTimeout(3500);
    if ((await page.evaluate(() => state.view)) !== 'login') fail('a revoked trainee wasn\'t signed out');

    // the Admin's Trainee Audit: every trainee in two requests
    await page.evaluate(async () => {
        for (let i = 0; i < 6; i++) await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'trainee:ci-' + i + '--x', value: JSON.stringify({ id: 'ci-' + i + '--x', name: 'Ci ' + i, batch: 'X', approved: true }) }) });
        state.isAdmin = true;
    });
    t0 = Date.now();
    const n = await page.evaluate(async () => { await loadAdminLedgerQuiet(); return state.adminData.length; });
    const ledger = since(t0, x => x.path.startsWith('/api/storage/'));
    if (n < 6) fail(`the Trainee Audit has ${n} trainees (expected at least 6)`);
    if (ledger.length !== 2) fail(`the Trainee Audit took ${ledger.length} requests (expected 2: the list, then get-many): ${JSON.stringify(ledger.map(x => x.path))}`);
    t0 = Date.now();
    await page.evaluate(async () => { await loadAdminLedger(); });
    if (since(t0, x => x.path === '/api/storage/get').length) fail('opening the Trainee Audit still reads the trainees one at a time');
    // its progress, feedback and Focus columns: up to 33 trainees a request, not three requests each
    t0 = Date.now();
    const rows = await page.evaluate(async () => { await loadAuditExtras(true); return state.adminData.length; });
    const extras = since(t0, x => x.path.startsWith('/api/storage/'));
    const want = Math.ceil(3 * rows / 100);
    if (extras.length !== want || extras.some(x => x.path !== '/api/storage/get-many')) fail(`the Trainee Audit's progress columns for ${rows} trainees took ${extras.length} requests (expected ${want} get-many): ${JSON.stringify(extras.map(x => x.path + ' ' + x.key.slice(0, 40)))}`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Server requests test passed (get-many rules and the "cm:" prefix; a trainee's page: ${all.length} requests in 8 s of sped-up checks, none in the background or on a quick tab switch; a dead server doesn't sign anyone out; the Trainee Audit in 2 requests, its progress columns in 1).`);
})().catch(e => { console.error(e); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); });
