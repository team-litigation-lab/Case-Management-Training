// One batch, whichever way its Batch ID was saved: B250926 (day-first) and B092526 (month-first) are both 25 September 2026,
// shown as B092526. The admin pages group trainees by the Batch ID as shown (index.html batchKey), so the Batch Sheet, the
// Trainee Audit and Open Lessons list everyone in the batch, and its picker shows it once.
// Usage: node .github/scripts/batch-group.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Batch', 'Grouper', 'B100926');
    const r = await page.evaluate(async () => {
        const put = (k, v) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: k, value: JSON.stringify(v) }) });
        await put('trainee:ann-dayfirst--b250926', { id: 'ann-dayfirst--b250926', name: 'Ann Dayfirst', batch: 'B250926', approved: true });
        await put('trainee:ben-monthfirst--b092526', { id: 'ben-monthfirst--b092526', name: 'Ben Monthfirst', batch: 'B092526', approved: true });
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        state.isAdmin = true; const keys = await sharedList('trainee:'); state.adminData = (await sharedGetMany(keys)).filter(Boolean);
        const k1 = batchKey({ batch: 'B250926' }), k2 = batchKey({ batch: 'B092526' });
        state.adminBatchFilter = k1; state.adminTab = 'batchsheet'; goto('admin'); render(); await new Promise(r => setTimeout(r, 1500));
        const text = (document.querySelector('main') || document.body).innerText;
        const opts = [...document.querySelectorAll('select option')].map(o => o.textContent.trim()).filter(t => /^B(092526|250926)$/.test(t));
        return { k1, k2, ann: /Ann Dayfirst/.test(text), ben: /Ben Monthfirst/.test(text), opts };
    });
    if (r.k1 !== r.k2) fail(`B250926 and B092526 are grouped apart: ${r.k1} / ${r.k2}`);
    if (r.k1 !== 'B092526') fail(`the batch should be grouped as it is shown, B092526: ${r.k1}`);
    if (!r.ann || !r.ben) fail(`the Batch Sheet for B092526 should list both trainees (day-first ${r.ann}, month-first ${r.ben})`);
    if (r.opts.length !== 1) fail(`the batch picker should show B092526 once: ${JSON.stringify(r.opts)}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('One batch whichever way its Batch ID was saved: B250926 and B092526 group as B092526, and the Batch Sheet lists both trainees.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
