// @check browser — a Knowledge Check only the trainee's device holds is never counted in 🧮 Grading systems or 👥 Trainee Audit, and 🏅 My Scores reads Day 1's Portal Backup Drive as My Performance does
// 🛡 Only the trainee's record counts (js/cm-scorecard.js kcBest / kcPassed); the device's own copy (progress:<id>) is the
// trainee's to write, so a score held only there is shown unconfirmed and counts for nothing. Three places read it apart:
//   1. ⬇ Download's 🧮 Grading systems (js/cm-batch-sheet.js systemTable) averaged and counted a device-only Day 2 KC;
//   2. 👥 Trainee Audit's row (js/cm-audit-table.js rowOf) took the KC scores and passes from the device's day progress;
//   3. 🏅 My Scores (js/cm-batch-sheet.js myRec) gave dayParts no Portal records, so a Day 1 built on the Portal's Backup
//      Drive read 0% "Not done" beside a Day score that counted it.
// Usage: node .github/scripts/device-kc-uncounted.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Dev', 'Only', 'B112026');

    // 3. 🏅 My Scores: the trainee's records (cmScorecard.myCtx) carry the Portal's Backup Drive Setup 95; Day 1's KC passed
    const my = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const d1 = DAYS.filter(d => d.cf)[0];
        const rec = { id: state.traineeId, name: 'Dev Only', approved: true, dayProgress: { [d1.id]: { score: 90, done: true, history: [{ score: 90 }] } } };
        const ctx = { rec, cf: { days: {} }, data: {}, sim: { best: { 'Backup Drive Setup': { score: 95, count: 1 } } }, fb: {} };
        cmScorecard.myCtx = () => ctx;
        const parts = cmBatchSheet.dayParts(Object.assign({}, rec, { caseFlow: { days: {} }, __extra: { data: {}, fb: {}, sim: ctx.sim } }), d1).filter(p => p.grp === 'bd').map(p => p.pct);
        goto('dashboard'); await new Promise(r => setTimeout(r, 800));
        const t = document.querySelector('.my-sc-t'); if (!t) return { err: 'no 🏅 My Scores table', parts };
        const hs = [...t.querySelectorAll('thead th')].map(x => x.textContent.trim()), i = hs.indexOf('📂 Backup Drive');
        const row = t.querySelector('tbody tr'); return { hs, i, v: i < 0 || !row ? null : row.children[i].textContent.trim(), parts };
    });
    if (my.err) fail(my.err);
    else if (my.i < 0) fail(`🏅 My Scores should have a 📂 Backup Drive column for a Day 1 built on the Portal: ${JSON.stringify(my.hs)}`);
    else if (my.v !== '95%') fail(`🏅 My Scores' Day 1 📂 Backup Drive should read the Portal's 95%, as My Performance counts it: "${my.v}"`);

    // 1 and 2: the trainer's views. Record: Day 1 KC 90. Device only: Day 2 KC 40 (a fail) and Day 3 KC 95 (a "pass").
    const r = await page.evaluate(() => {
        const cf = DAYS.filter(d => d.cf), id = 'tess-dev--b112026';
        const rec = { id, name: 'Tess Dev', batch: 'B112026', approved: true, dayProgress: { [cf[0].id]: { score: 90, done: true, history: [{ score: 90 }] } }, caseFlow: { days: {} } };
        const dev = { [cf[0].id]: { score: 90, done: true }, [cf[1].id]: { score: 40, history: [{ score: 40 }] }, [cf[2].id]: { score: 95, done: true, history: [{ score: 95 }] } };
        const c = { rec, cf: { days: {} }, data: { 'day-progress': dev }, fb: {} };
        const row = { id, name: 'Tess Dev', batch: 'B112026', c, sc: cmScorecard.compute(c), m: cmScorecard.model.compute(c) };
        const sys = (cmBatchSheet.csvTables([row], [], null) || []).find(t => t.id === 'systems');
        const kcAvg = cmScorecard.compute(c).rows.find(x => x.s.id === 'kc').avg;
        let systems = null;
        if (sys) { const g = sys.rows[0].map(x => x.v); systems = { avg: g[1], graded: g[2], unconf: g.filter(v => v === 'Unconfirmed').length, has40: g.includes('40%') }; }
        // 👥 Trainee Audit: the record in state.adminData, the device copy as loadAuditExtras keeps it
        state.isAdmin = true; state.adminData = [rec]; state.auditExtra = state.auditExtra || {};
        state.auditExtra[id] = { at: Date.now(), data: { 'day-progress': dev }, fb: {}, fbRec: {}, focus: [] };
        state.adminSearch = ''; state.auditDay = ''; state.auditNeed = ''; state.auditStatus = 'all'; state.adminBatchFilter = '';
        const box = document.createElement('div'); box.innerHTML = renderAdminRows();
        const tr = box.querySelector(`tr.at-row[data-id="${id}"]`);
        const audit = tr ? { text: tr.textContent.replace(/\s+/g, ' '), ok: tr.querySelectorAll('.ad-cell.ok').length, low: tr.querySelectorAll('.ad-cell.low').length } : null;
        state.auditNeed = 'below'; const box2 = document.createElement('div'); box2.innerHTML = renderAdminRows(); state.auditNeed = '';
        return { kcAvg, systems, audit, below: !!box2.querySelector(`tr.at-row[data-id="${id}"]`) };
    });
    if (r.kcAvg !== 90) fail(`the Scorecard's KC average should be the record's 90: ${r.kcAvg}`);
    if (!r.systems) fail('⬇ Download has no 🧮 Grading systems table');
    else {
        if (r.systems.avg !== '90%' || r.systems.graded !== '1') fail(`🧮 Grading systems' ✍️ Knowledge Checks should average and count only the record's Day 1 (90%, 1 graded), as the Scorecard does: ${JSON.stringify(r.systems)}`);
        if (r.systems.has40 || r.systems.unconf !== 2) fail(`a device-only day should read "Unconfirmed" in its column, not a bare %: ${JSON.stringify(r.systems)}`);
    }
    if (!r.audit) fail('👥 Trainee Audit shows no row for the trainee');
    else {
        if (!/90% avg · 1\/\d+ passed/.test(r.audit.text)) fail(`👥 Trainee Audit's Knowledge Checks should be the record's (90% avg, 1 passed), not the device's: "${r.audit.text.slice(0, 400)}"`);
        if (r.audit.ok !== 1 || r.audit.low !== 0) fail(`👥 Trainee Audit's day cells should show only the record's Day 1 as passed: ${r.audit.ok} passed, ${r.audit.low} below 70%`);
    }
    if (r.below) fail('a device-only 40% should not put the trainee under 📉 Below 70%');
    await browser.close();
    if (failures.length) { console.log('✗ Device-only scores uncounted:\n  ' + failures.join('\n  ')); process.exit(1); }
    console.log('Device-only scores uncounted: 🧮 Grading systems and 👥 Trainee Audit count only the record\'s Knowledge Checks (a device-only day reads Unconfirmed); 🏅 My Scores reads Day 1\'s Portal Backup Drive.');
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
