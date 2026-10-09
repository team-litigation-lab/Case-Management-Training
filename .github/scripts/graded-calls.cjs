// Graded calls from the CMS Call Simulator count in this course (js/graded-calls.js, worker.js):
// 1. the Worker: a trainee reads their own callsim:<id> (kept by the Training Portal), never another trainee's, and can't write it;
// 2. in a browser: without graded calls the dashboard band's "Graded calls" card says — and 0 lines; with them, the best graded
//    call on each line averaged, the lines and the calls taken, and each line's best in its tooltip.
// Usage: node .github/scripts/graded-calls.cjs [baseUrl] [kv prefix]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');   // the name + batch form is gone: trainees arrive from the Portal
const path = require('path'); const { pathToFileURL } = require('url');
const BASE = process.argv[2] || 'http://localhost:8787/';
const PREFIX = process.argv[3] != null ? process.argv[3] : 'cm:';
const failures = []; const fail = (m) => failures.push(m);

async function workerChecks() {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map([
        [PREFIX + 'trainee:ana-cruz--b1', JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true })],
        [PREFIX + 'callsim:ana-cruz--b1', JSON.stringify({ best: { 'line:Intake Calls': { score: 90, calls: 1, line: 'Intake Calls' } } })],
        [PREFIX + 'callsim:ben-diaz--b1', JSON.stringify({ best: { 'line:Intake Calls': { score: 40, calls: 1, line: 'Intake Calls' } } })]
    ]);
    const env = {
        // PORTAL_ONLY=off so this test can mint a trainee token by name + batch; trainees really come in
        // from the LSH Training Portal (sso.cjs). What's checked here is who may read a graded call.
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) }
    };
    const call = async (p, body, token) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() {} });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const t = (await call('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B1' })).body.token;
    const own = await call('/api/storage/get', { key: 'callsim:ana-cruz--b1' }, t);
    if (own.status !== 200 || !own.body || !/"score":90/.test(own.body.value || '')) fail(`a trainee can't read their graded calls: ${JSON.stringify(own)}`);
    if ((await call('/api/storage/get', { key: 'callsim:ben-diaz--b1' }, t)).status !== 403) fail('a trainee can read another trainee\'s graded calls');
    const write = await call('/api/storage/set', { key: 'callsim:ana-cruz--b1', value: JSON.stringify({ best: { x: { score: 100, calls: 9 } } }) }, t);
    if (write.status !== 403 || /"score":100/.test(store.get(PREFIX + 'callsim:ana-cruz--b1'))) fail(`a trainee could write their own graded calls: ${JSON.stringify(write)}`);
}

(async () => {
    await workerChecks();
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Gina', 'Grade' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');   // a new trainee each run (letters only: a name takes no digits)
    const id = await page.evaluate(() => state.traineeId);
    const rec = await page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || '{}'), 'trainee:' + id);
    rec.approved = true; await put('trainee:' + id, rec);
    // the dashboard (a first visit can land on another page, e.g. the client profile)
    const stat = async () => { await page.evaluate(() => { if (state.view !== 'dashboard' && typeof goto === 'function') goto('dashboard'); }); await page.waitForTimeout(1500);
        return page.evaluate(() => { const c = document.querySelector('.graded-calls-stat'); return c ? { text: c.innerText, tip: c.getAttribute('title') || '' } : null; }); };
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    const none = await stat();
    if (!none || !/—/.test(none.text) || !/0 lines/i.test(none.text)) fail(`without graded calls the dashboard band should show — and 0 lines: ${JSON.stringify(none)}`);
    await put('callsim:' + id, { traineeId: id, calls: [{}, {}, {}], best: { 'line:Intake Calls': { score: 90, calls: 1, line: 'Intake Calls' }, 'line:Client Communication': { score: 70, calls: 2, line: 'Client Communication' } } });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    const two = await stat();
    if (!two || !/80%/.test(two.text) || !/2 lines/i.test(two.text) || !/3 calls/i.test(two.text)) fail(`the dashboard band's graded calls: ${JSON.stringify(two)} (expected 80%, 2 lines, 3 calls)`);
    if (two && (!/Intake Calls: best 90% \(1 call\)/.test(two.tip) || !/Client Communication: best 70% \(2 calls\)/.test(two.tip))) fail(`the card's tooltip doesn't list each line's best: ${two.tip}`);
    await browser.close();
    if (failures.length) { console.log(`${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Graded calls test passed (a trainee reads only their own graded calls and can\'t write them; the dashboard band\'s Graded calls card).');
})().catch(e => { console.error(e); process.exit(1); });
