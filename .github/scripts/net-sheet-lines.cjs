// @check browser — 📊 Net Sheet saves and lines: a stale pane never writes over a newer tie-out, a provider's line is the one its Provider Name names, a missing line never ties out
// net-sheet.html + js/cm-net-sheet.js, with js/cm-credit-kept.js:
//   1. the pane on the course page (index.html, net-sheet.html in an iframe): the pane was opened before another tab
//      tied out Track A's final stage; an edit in the pane saves its older record, and the stored tie-out stays (the
//      course page's storeSet merges the save with the stored copy, so the pane must not overwrite that copy first);
//   2. the same on the sheet by itself (saved on this device): the save merges with the copy already on the device;
//   3. the Crescent Pain line named after its source document ("…Peach State EOB…"), above the Peach State lien: the
//      Peach State checks read the Peach State line, and a correct sheet ties out;
//   4. a blank sheet ties out nothing: "Riverton Drug · Balance Owed" wants 0, but with no Riverton Drug line it is a miss.
// Usage: node .github/scripts/net-sheet-lines.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const A = {   // Track A, settled before suit (as in net-sheet.cjs), the Crescent Pain line first and named after RS26
  C7: 'Keystone BI + Harbor Point UM + Cardinal State UM', L7: '40000', C11: '33⅓%',
  C12: 'Police Report', L12: '25', C18: 'Records and billing; MRI disc', L18: '214.75 + 25', C17: 'Certified mail; postage and copies', L17: '72 + 150',
  B25: 'Pain management (in network with Peach State)', C25: 'Crescent Pain & Spine — Bill, Peach State EOB & Patient Statement', D25: '3400', F25: '1860', H25: '1540',
  B26: 'Urgent care', C26: 'Riverton Urgent Care', D26: '685', G26: '685',
  B27: 'Orthopedics', C27: 'Lakeside Orthopedics', D27: '1920', G27: '1920',
  B28: 'Chiro / PT (LOP)', C28: 'Riverton Spine & Rehab', D28: '6290', H28: '185', L28: '4580',
  B29: 'MRI', C29: 'Summit Imaging Center', D29: '2395', G29: '2395',
  B30: 'Emergency room', C30: 'Riverton General Hospital', D30: '24400', E30: '8850', H30: '15550',
  B31: 'Health plan lien', C31: 'Health plan lien: Peach State Health Plan', D31: '1860', L31: '1240',
  B33: 'Ambulance (EMS)', C33: 'Riverton Fire EMS', D33: '2182.60', E33: '1150', H33: '1032.60',
  B61: 'Pharmacy', C61: 'Riverton Drug', D61: '312.40', F61: '312.40',
};
const TIED = { passed: 9, total: 9, at: '2026-11-21T10:00:00.000Z', items: [] };

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    page.on('dialog', d => d.accept());
    const type = (frame, k, v) => frame.evaluate(([k, v]) => { const el = document.querySelector(`#ns [data-k="${k}"]`); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }, [k, v]);
    try {
        // 1. the pane on the course page
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        // a trainee new on every run: a copy synced by an earlier run would bring its tie-out back
        await signIn(page, 'Nora', 'Lines' + Date.now().toString(36).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
        await page.evaluate(async (BASE) => {
            await storeSet('net-sheet', { v: 2, blankLedger: 1, files: { A: { cells: { L7: 40000 }, checks: {} } } });
            const f = document.createElement('iframe'); f.id = 'ns-pane'; f.src = BASE + 'net-sheet.html?stage=final'; document.body.appendChild(f);
        }, BASE);
        const fh = await page.waitForSelector('#ns-pane'); const pane = await fh.contentFrame();
        await pane.waitForSelector('#ns .ns-in');
        // another tab ties out the final stage after the pane was opened
        await page.evaluate(async (k) => { await storeSet('net-sheet', { v: 2, blankLedger: 1, files: { A: { cells: { L7: 40000 }, checks: { final: k } } } }); }, TIED);
        await type(pane, 'L12', '25'); await page.waitForTimeout(900);
        const h = await page.evaluate(async () => { const v = await storeGet('net-sheet'); const f = v.files.A; return { k: (f.checks || {}).final, L12: f.cells.L12 }; });
        if (!h.k || h.k.passed !== 9) fail(`an edit in a pane opened before another tab tied out the final stage should keep that tie-out: ${JSON.stringify(h.k)}`);
        if (h.L12 !== 25) fail(`the pane's edit itself should be saved: L12 = ${h.L12}`);

        // 2. the sheet by itself, saved on this device
        await page.goto(BASE + 'net-sheet.html?stage=final', { waitUntil: 'load' });
        await page.evaluate(() => { localStorage.clear(); localStorage.setItem('lsh_net-sheet', JSON.stringify({ v: 2, blankLedger: 1, files: { A: { cells: {}, checks: {} } } })); });
        await page.goto(BASE + 'net-sheet.html?stage=final', { waitUntil: 'load' }); await page.waitForSelector('#ns .ns-in');
        await page.evaluate((k) => { localStorage.setItem('lsh_net-sheet', JSON.stringify({ v: 2, blankLedger: 1, files: { A: { cells: {}, checks: { final: k } } } })); }, TIED);
        await type(page, 'L12', '25'); await page.waitForTimeout(900);
        const s = await page.evaluate(() => { const v = JSON.parse(localStorage.getItem('lsh_net-sheet')); return { k: v.files.A.checks.final, L12: v.files.A.cells.L12 }; });
        if (!s.k || s.k.passed !== 9) fail(`the sheet saved on this device should keep a tie-out written by another tab: ${JSON.stringify(s.k)}`);
        if (s.L12 !== 25) fail(`the edit itself should be saved on this device: L12 = ${s.L12}`);

        // 3 and 4. which line is a provider's, and a missing line
        await page.evaluate(() => localStorage.clear());
        await page.goto(BASE + 'net-sheet.html?stage=final', { waitUntil: 'load' }); await page.waitForSelector('#ns .ns-in');
        const res = (stage) => page.evaluate((stage) => { const s = document.querySelector('#ns-stage'); s.value = stage; s.dispatchEvent(new Event('change')); CMNetSheet.check();
            const k = CMNetSheet.sheet.checks[stage], r = k.last && String(k.last.at) > String(k.at) ? k.last : k; return { passed: r.passed, total: r.total, now: k.last ? k.last.passed : k.passed, ok: r.items.filter(x => x.ok).map(x => x.cell) }; }, stage);
        const blank = await res('final');
        if (blank.passed !== 0) fail(`a blank sheet should tie out nothing at the final stage: ${blank.passed}/${blank.total} (${blank.ok.join(', ')})`);
        for (const [k, v] of Object.entries(A)) await type(page, k, v);
        for (const st of ['liens', 'final']) {
            const r = await res(st);
            if (r.passed !== r.total) fail(`a correct sheet with the Crescent Pain line ("…Peach State EOB…") above the Peach State lien should tie out at ${st}: ${r.passed}/${r.total}`);
        }
    } finally { await browser.close(); }
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('📊 Net Sheet: a stale pane keeps a newer tie-out (on the course page and on this device), a provider\'s line is the one its name names, and a missing line never ties out.');
    console.log('All good.');
})().catch(e => { console.error(e); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); });
