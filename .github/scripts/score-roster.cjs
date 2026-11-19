// @check browser — Every score table lists the same trainees (approved, not archived, not merged away), the duplicate marker pairs only same-batch accounts, a pending merge isn't "locked", and the Score Card's 📂 Backup Drive is what the day score counts
// js/cm-merged-away.js with js/cm-batch-sheet.js, js/cm-scorecard.js and js/cm-account-repair.js, in a real browser:
//   1. a merge waiting to finish (merged:<old> = {into: keep}, trainee:<old> still there): the old account is on no score
//      table and the kept one is; a trainee waiting for approval and an archived one ("Show archived" ticked) are on
//      📚 Lessons only, never on 📅 Detailed Scores, 🏅 Scores, ✍️ Knowledge Checks or the 🔎 cards;
//   2. 👥 two accounts: the same name in two different batches is not one person; B250926 and B092526 are one batch;
//   3. 🛠 Account Repair: the merged:<old> of that pending merge reads as a merge not finished, not a lock to remove;
//   4. 📂 Backup Drive: a passed day with no grade on the trainee's record counts 0 in the day score, and the Score Card's
//      📂 column and the card say 0%, never the Worker's nightly 85% the model doesn't count.
// Usage: node .github/scripts/score-roster.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Roster', 'Check', 'B111326');
    const r = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const cf = DAYS.filter(d => d.cf), d1 = cf[0], now = new Date().toISOString();
        const mk = (id, name, batch, extra) => Object.assign({ id, name, batch, approved: true, registeredAt: now,
            dayProgress: { [d1.id]: { score: 90, passed: true, date: now, history: [{ score: 90, passed: true, date: now }] } },
            __extra: { data: { 'day-progress': { [d1.id]: { score: 90, passed: true, date: now } } } } }, extra || {});
        const keep = 'ann-roster--b111326', old = 'ann-roster--b111326x';
        state.isAdmin = true; state.adminShowArchived = true;
        state.adminData = [mk(keep, 'Ann Roster', 'B111326'), mk(old, 'Ann Roster', 'B111326'),
            mk('wes-wait--b111326', 'Wes Wait', 'B111326', { approved: false }), mk('arc-old--b111326', 'Arc Old', 'B111326', { archived: true }),
            mk('ben-two--b111326', 'Ben Two', 'B111326'), mk('ben-two--b120126', 'Ben Two', 'B120126'),
            mk('cy-pair--b250926', 'Cy Pair', 'B250926'), mk('cy-pair--b092526', 'Cy Pair', 'B092526')];
        // the pending merge's redirect, as /api/account-merge leaves it (worker-account-repair.js), and the Worker's nightly
        // Day 1 grade that isn't on Ann's record
        const M = cmMergedAway.state(); M.map = { [old]: keep }; M.loaded = true; M.at = Date.now();
        state.driveReports = { [keep]: { connected: true, setupScore: 85, at: now } }; state.driveReportsAt = Date.now();
        state.adminBatchFilter = 'B111326'; state.adminTab = 'batchsheet'; goto('admin'); render();
        await new Promise(r => setTimeout(r, 2500)); render(); await new Promise(r => setTimeout(r, 800));
        const rowsOf = id => { const s = document.getElementById(id); return s ? [...s.querySelectorAll('tbody tr')].map(tr => (tr.querySelector('td') || {}).textContent || '').filter(Boolean) : null; };
        const cards = [...document.querySelectorAll('details.bs-ds-tr')].map(x => x.id);
        const sc = document.querySelector('[id^="bs-scorecard"]');
        const scCell = (() => { if (!sc) return null; const hs = [...sc.querySelectorAll('.gs-head th')].map(t => t.textContent.trim()), i = hs.indexOf('📂 Backup Drive');
            const tr = [...sc.querySelectorAll('tbody tr')].find(x => (x.querySelector('td') || {}).textContent === 'Ann Roster'); return tr && i > 0 ? tr.querySelectorAll('td')[i - 1].textContent : null; })();
        const card = document.getElementById('bs-ds-' + keep), bdItem = card ? [...card.querySelectorAll('.bs-ds-it')].find(x => /Backup Drive/.test(x.textContent)) : null;
        const bdPct = bdItem ? bdItem.querySelector('.bs-ds-h b').textContent : null;
        // the model's own Day 1 Backup Drive item
        const ov = cmScorecard.overall({ rec: state.adminData[0], cf: { days: {} }, data: state.adminData[0].__extra.data, fb: { days: {} } });
        const out = { days: rowsOf('bs-days'), scores: rowsOf('bs-scores'), kcs: rowsOf('bs-kcs'), lessons: rowsOf('bs-lessons'), cards, scCell, bdPct, ov: ov && ov.pct };
        state.adminBatchFilter = ''; out.dup = cmBatchSheet.dupHtml();
        const lk = cmAccountRepair.findLocked(state.adminData, { [old]: { into: keep, how: 'account-merge', at: now, by: 'trainer' } }, {}, {});
        out.locked = lk.map(x => ({ from: x.from, level: x.level, pending: !!x.pending }));
        return out;
    });
    const only = (name, xs, want) => { if (!xs) fail(`no ${name} table`); else if (JSON.stringify(xs) !== JSON.stringify(want)) fail(`${name} should list ${JSON.stringify(want)}: ${JSON.stringify(xs)}`); };
    const want = ['Ann Roster', 'Ben Two'];
    only('📅 Day 1–5: Detailed Scores', r.days, want);
    only('🏅 Scores', r.scores, want);
    only('✍️ Knowledge Checks', r.kcs, want);
    if (JSON.stringify(r.cards) !== JSON.stringify(['bs-ds-ann-roster--b111326', 'bs-ds-ben-two--b111326'])) fail(`a 🔎 card per scored trainee only: ${JSON.stringify(r.cards)}`);
    if (!r.lessons || !r.lessons.includes('Wes Wait') || !r.lessons.includes('Arc Old')) fail(`📚 Lessons should still list the trainee waiting for approval and the archived one: ${JSON.stringify(r.lessons)}`);
    if (r.lessons && r.lessons.filter(x => x === 'Ann Roster').length !== 1) fail(`the merged-away account should not be on 📚 Lessons either: ${JSON.stringify(r.lessons)}`);
    if (/Ann Roster/.test(r.dup)) fail('a merge waiting to finish should not be offered as two accounts again');
    if (/Ben Two/.test(r.dup)) fail('the same name in two different batches is two people, not one with two accounts');
    if (!/Cy Pair/.test(r.dup)) fail('B250926 and B092526 are one batch: Cy Pair has two accounts');
    const l = r.locked.find(x => x.from === 'ann-roster--b111326x');
    if (!l || l.level !== 'pending' || !l.pending) fail(`a pending merge's redirect should read as a merge not finished (to run again), not a lock to remove: ${JSON.stringify(r.locked)}`);
    if (r.scCell !== '0%') fail(`the Score Card's 📂 Backup Drive should be the 0% the day score counts (no grade on the record), not the nightly 85%: ${r.scCell}`);
    if (r.bdPct !== '0%') fail(`the card's 📂 Backup Drive item should be 0%: ${r.bdPct}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('One roster on every score table (approved, not archived, not merged away); duplicates only in one batch; a pending merge reads pending; the 📂 Backup Drive is what the day score counts.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
