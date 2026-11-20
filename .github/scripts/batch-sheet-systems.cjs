// @check browser — The Batch Sheet's 🧮 Grading systems is one table: every grading system's columns side by side, a row per trainee, no tabs
// The Batch Sheet (js/cm-batch-sheet.js allSystemsTable): every record in one place — a group of columns per grading system
// (its Average, Graded, its own counts, then its items), a row per trainee; no button to pick one system at a time.
// Usage: node .github/scripts/batch-sheet-systems.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Sheet', 'Systems', 'B111426');
    const r = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const d1 = DAYS.filter(d => d.cf)[0], now = new Date().toISOString();
        const mk = (id, name, score) => ({ id, name, batch: 'B111426', approved: true, registeredAt: now,
            __extra: { data: { 'day-progress': { [d1.id]: { score, passed: score >= 70, date: now, history: [{ score, passed: score >= 70, date: now }] } } } } });
        state.isAdmin = true; state.adminData = [mk('ann-sys--b111426', 'Ann Sys', 90), mk('ben-sys--b111426', 'Ben Sys', 75)];
        state.adminBatchFilter = 'B111426'; state.adminTab = 'batchsheet'; goto('admin'); render(); await new Promise(r => setTimeout(r, 2500));
        const box = document.getElementById('bs-systems'), S = (window.cmScorecard && cmScorecard.sources) || [];
        return { n: S.length, groups: box ? [...box.querySelectorAll('.gs-groups th')].map(t => t.textContent.trim()).filter(Boolean) : [],
            rows: box ? [...box.querySelectorAll('tbody tr')].map(t => (t.querySelector('td') || {}).textContent || '') : [],
            tables: box ? box.querySelectorAll('table').length : 0, tabs: box ? box.querySelectorAll('.bs-view button').length : -1,
            kc: box ? [...box.querySelectorAll('tbody tr')].map(t => [...t.querySelectorAll('td')].map(c => c.textContent.trim())) : [] };
    });
    if (!r.n) fail('no grading systems to show');
    if (r.tables !== 1 || r.tabs !== 0) fail(`🧮 Grading systems isn't one table with no tabs: ${r.tables} table(s), ${r.tabs} tab(s)`);
    if (r.groups.length !== r.n) fail(`not every grading system has its group of columns: ${r.groups.length} of ${r.n} (${r.groups.join(' | ')})`);
    if (r.rows.join() !== 'Ann Sys,Ben Sys') fail(`the table's rows aren't one per trainee: ${JSON.stringify(r.rows)}`);
    if (!r.kc[0] || r.kc[0][1] !== '90%' || !r.kc[1] || r.kc[1][1] !== '75%') fail(`a trainee's Knowledge Check average isn't in their row: ${JSON.stringify(r.kc.map(x => x.slice(0, 3)))}`);
    await browser.close();
    if (failures.length) { console.error('Grading systems table test FAILED:\n- ' + failures.join('\n- ')); process.exit(1); }
    console.log('Grading systems table test passed (every grading system in one table, a group of columns each, a row per trainee, no tabs).');
})();
