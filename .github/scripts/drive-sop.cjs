// The case folder, the Foundational Training way (js/cm-drive-sop.js):
// 1. the Worker: a trainee reads settings:drive and their own driveLink but can't write either (driveLink is a trainer's field);
// 2. the trainer: Admin → 📂 Drive Links sends a trainee their folder link;
// 3. the trainee: 📂 My Case Folder shows it, names the folder [Full Name] - Doe v. Smith, connects their Main Case Folder,
//    marks a day uploaded, and the trainer's table shows both;
// 4. the deck: Day 1's Backup File Maintenance "Your Case" slide is the SOP and the folder structure sample.
// Usage: node .github/scripts/drive-sop.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const path = require('path'); const { pathToFileURL } = require('url');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const LINK = 'https://drive.google.com/drive/folders/TRAINER-SENT-123';
const MINE = 'https://drive.google.com/drive/folders/MY-CASE-FOLDER-456';

async function workerChecks() {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map([['cm:trainee:ana-cruz--b1', JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true, driveLink: LINK })],
        ['cm:settings:drive', JSON.stringify({ resources: LINK })]]);
    const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) } };
    const call = async (p, body, token) => { const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
    const t = (await call('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B1' })).body.token;
    const s = await call('/api/storage/get', { key: 'settings:drive' }, t);
    if (s.status !== 200 || !(s.body.value || '').includes(LINK)) fail(`a trainee can't read the TRAINING RESOURCES link: ${JSON.stringify(s)}`);
    if ((await call('/api/storage/set', { key: 'settings:drive', value: '{}' }, t)).status !== 403) fail('a trainee could write settings:drive');
    await call('/api/storage/set', { key: 'trainee:ana-cruz--b1', value: JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true, driveLink: 'https://drive.google.com/x' }) }, t);
    if (!store.get('cm:trainee:ana-cruz--b1').includes(LINK)) fail('a trainee could change the folder link their trainer sent');
}

(async () => {
    await workerChecks();
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    const last = 'Folder' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
    await signIn(page, 'Dana', last, 'B100926');
    const id = await page.evaluate(() => state.traineeId);
    const rec = await page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || '{}'), 'trainee:' + id);
    rec.approved = true; await put('trainee:' + id, rec);

    // the trainer sends the link (Admin → 📂 Drive Links), as an admin would
    await page.evaluate(() => { state.isAdmin = true; state.adminData = null; state.adminTab = 'drivelinks'; goto('admin'); render(); });
    await page.waitForSelector(`#dl-${id}`, { timeout: 15000 }).catch(() => fail('the trainee has no row on Drive Links'));
    await page.fill(`#dl-${id}`, LINK); await page.click(`#dl-${id} + button`); await page.waitForTimeout(800);
    const sent = await page.evaluate(async (k) => (await sharedGet(k)).driveLink, 'trainee:' + id);
    if (sent !== LINK) fail(`Send should put the link on the trainee's record: ${sent}`);

    // the trainee sees it, connects their folder and marks Day 1 uploaded
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    await page.evaluate(() => { ['ktLogin'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); if (state.view !== 'dashboard') goto('dashboard'); render(); });
    await page.waitForFunction((l) => !!document.querySelector(`.dsop-card a[href="${l}"]`), LINK, { timeout: 15000 }).catch(() => fail('the trainee\'s My Case Folder card has no link to the folder the trainer sent'));
    const name = await page.locator('.dsop-name').textContent().catch(() => '');
    if (name !== `Dana ${last} - Doe v. Smith`) fail(`the folder name should be [Full Name] - Doe v. Smith: "${name}"`);
    await page.fill('#dsopLink', 'not a link'); await page.click('#dsopLink + button');
    if (await page.evaluate(async () => !!((await storeGet('case-folder')) || {}).link)) fail('a link that isn\'t Google Drive was accepted');
    await page.fill('#dsopLink', MINE); await page.click('#dsopLink + button'); await page.waitForTimeout(300);
    await page.click('.dsop-day >> nth=0'); await page.waitForTimeout(300);
    const mine = await page.evaluate(() => storeGet('case-folder'));
    if (!mine || mine.link !== MINE) fail(`the Main Case Folder link wasn't kept on the trainee's file: ${JSON.stringify(mine)}`);
    if (!mine || !Object.keys(mine.uploads || {}).length) fail('Day 1\'s upload wasn\'t recorded');
    // and the trainer's table shows them, once the progress is saved to the server
    await page.evaluate(() => cloudSaveNow());
    await page.evaluate(() => { state.isAdmin = true; state.adminData = null; cmDriveSop.refresh(); state.adminTab = 'drivelinks'; goto('admin'); render(); });
    await page.waitForSelector(`#dl-${id}`, { timeout: 15000 }).catch(() => {});
    const row = await page.evaluate((id) => { const tr = document.getElementById('dl-' + id) && document.getElementById('dl-' + id).closest('tr'); return tr ? tr.innerHTML : ''; }, id);
    if (!row.includes(MINE)) fail('the trainer\'s Drive Links table doesn\'t show the trainee\'s Main Case Folder');
    if (!/✅/.test(row)) fail('the trainer\'s Drive Links table doesn\'t show the day uploaded');

    // the deck: Day 1's Backup File Maintenance, Your Case
    const slide = await page.evaluate(() => { state.isAdmin = false; const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
        const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === 'd1m1-drive' && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'case');
        if (k < 0) return null; goToSlide(k); return true; });
    await page.waitForTimeout(800);
    if (!slide) fail('Day 1 has no Your Case slide for Backup File Maintenance');
    else {
        const t = await page.locator('.dsop-slide').innerText().catch(() => '');
        if (!/Create the Main Case Folder/.test(t) || !/Set Up Firm Subfolders/.test(t) || !/Connect to the Platform/.test(t) || !/Maintain & Upload Case Documents/.test(t)) fail(`the slide should carry the SOP's four steps: "${t.slice(0, 200)}"`);
        if (!/09 Litigation & ADR/.test(t) || !/Main Case Folder/.test(t)) fail('the slide should show the folder structure sample');
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Case folders follow the firm\'s SOP: the trainer sends each trainee their Drive link (only a trainer can), the trainee names the folder [Full Name] - Doe v. Smith, connects it and marks each day uploaded, the trainer\'s Drive Links table shows both, and Day 1\'s deck carries the SOP and the folder structure sample.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
