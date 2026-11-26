// @check browser — Every score table lists the same trainees (approved, not archived, not merged away), the duplicate marker pairs only same-batch accounts, a pending merge isn't "locked", and the Backup Drive is the Worker's nightly grade the day score counts
// js/cm-merged-away.js with js/cm-scorecard.js (the one 🏅 Scorecard page), js/cm-batch-sheet.js (its 🏅 Scores, the cards'
// feedback and ⬇ Download) and js/cm-account-repair.js, in a real browser, with the trainees' records on the server:
//   1. a merge waiting to finish (merged:<old> = {into: keep}, trainee:<old> still there): the old account is on no score
//      table and the kept one is; a trainee waiting for approval and an archived one are on ⬇ Download's 📚 Lessons only,
//      never on 🏅 Scores, the cards, ✍️ Knowledge Checks or 📅 Detailed Scores;
//   2. 👥 two accounts: the same name in two different batches is not one person; B250926 and B092526 are one batch;
//   3. 🛠 Account Repair: the merged:<old> of that pending merge reads as a merge not finished, not a lock to remove;
//   4. 📂 Backup Drive: a day graded only by the Worker's nightly read of the drive (state.driveReports, no grade on the
//      trainee's progress) counts that grade: 🏅 Scores' 📂 column, ⬇ Download's Score Card, the card's feedback and the
//      model's day item all say 85%.
// Usage: node .github/scripts/score-roster.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const CSV = require('./csv-sections.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const KEEP = 'ann-roster--b111326', OLD = 'ann-roster--b111326x';
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Roster', 'Check', 'B111326');
    // the records, on the server as the Worker keeps them
    await page.evaluate(async ([KEEP, OLD]) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const d1 = DAYS.filter(d => d.cf)[0], now = new Date().toISOString();
        const mk = (id, name, batch, extra) => Object.assign({ id, name, batch, approved: true, registeredAt: now,
            dayProgress: { [d1.id]: { score: 90, passed: true, done: true, date: now, history: [{ score: 90, passed: true, date: now }] } } }, extra || {});
        const recs = [mk(KEEP, 'Ann Roster', 'B111326'), mk(OLD, 'Ann Roster', 'B111326'),
            mk('wes-wait--b111326', 'Wes Wait', 'B111326', { approved: false }), mk('arc-old--b111326', 'Arc Old', 'B111326', { archived: true }),
            mk('ben-two--b111326', 'Ben Two', 'B111326'), mk('ben-two--b120126', 'Ben Two', 'B120126'),
            mk('cy-pair--b250926', 'Cy Pair', 'B250926'), mk('cy-pair--b092526', 'Cy Pair', 'B092526')];
        for (const r of recs) { await sharedSet('trainee:' + r.id, r); await sharedSet('progress:' + r.id, { data: { 'day-progress': r.dayProgress } }); }
        // the pending merge's redirect, as /api/account-merge leaves it (worker-account-repair.js)
        await sharedSet('merged:' + OLD, { into: KEEP, how: 'account-merge', at: now, by: 'trainer' });
    }, [KEEP, OLD]);
    const r = await page.evaluate(async ([KEEP, OLD]) => {
        const now = new Date().toISOString();
        state.isAdmin = true; state.adminShowArchived = true; state.adminData = null;
        await cmMergedAway.ready(true);
        // the Worker's nightly Day 1 grade that isn't on Ann's record
        state.driveReports = { [KEEP]: { connected: true, setupScore: 85, at: now } }; state.driveReportsAt = Date.now();
        cmScorecard.refresh(); state.adminTab = ''; goto('admin');
        for (let i = 0; i < 60 && !document.querySelector('.cmsh-screen #scx-scores'); i++) await new Promise(r => setTimeout(r, 300));
        cmScorecard.batch(typeof batchShow === 'function' ? (batchShow('B111326') || 'B111326') : 'B111326'); await new Promise(r => setTimeout(r, 600));
        const rows = [...document.querySelectorAll('.cmsh-screen #scx-scores tbody tr')].map(tr => (tr.querySelector('td') || {}).textContent || '').filter(Boolean);
        // one trainee's card at a time: the trainees it can show are the hero's names (and the card shown is one of them)
        const cards = [...document.querySelectorAll('.cmsh-screen .scx-who-row .bs-pt-who select option')].map(x => x.value);
        const shown = [...document.querySelectorAll('.cmsh-screen .bs-pt')].map(x => x.dataset.id);
        const hs = [...document.querySelectorAll('.cmsh-screen #scx-scores .gs-head th')].map(t => t.textContent.trim()), bi = hs.indexOf('📂 Backup Drive %');
        const annTr = [...document.querySelectorAll('.cmsh-screen #scx-scores tbody tr')].find(x => (x.querySelector('td') || {}).textContent === 'Ann Roster');
        const bdCol = annTr && bi > 0 ? annTr.querySelectorAll('td')[bi - 1].textContent : null;
        const fb = document.querySelector('.cmsh-screen #bs-fb-' + KEEP.replace(/[^A-Za-z0-9_-]/g, '_') + ' details.bs-fb-day[data-day="1"]');
        const bdItem = fb ? [...fb.querySelectorAll('.bs-fb-it')].find(x => /Backup Drive/.test(x.textContent)) : null;
        const bdPct = bdItem ? bdItem.querySelector('.bs-fb-sc b').textContent : null;
        // the model's own Day 1 Backup Drive item
        const ann = state.adminData.find(x => x.id === KEEP), ev = cmScorecard.model.evidence({ rec: ann, cf: ann.caseFlow || { days: {} }, data: { 'day-progress': ann.dayProgress }, fb: { days: {} } });
        const bdModel = (ev.items.find(x => x.group === '📂 Backup Drive' && x.day === 1) || {}).pct;
        const out = { rows, cards, shown, bdCol, bdPct, bdModel };
        state.adminBatchFilter = ''; out.dup = cmBatchSheet.dupHtml();
        const lk = cmAccountRepair.findLocked(state.adminData, { [OLD]: { into: KEEP, how: 'account-merge', at: now, by: 'trainer' } }, {}, {});
        out.locked = lk.map(x => ({ from: x.from, level: x.level, pending: !!x.pending }));
        return out;
    }, [KEEP, OLD]);
    const file = await CSV.grab(page, () => cmScorecard.csv());
    const T = file ? CSV.parse(file) : [], col = t => { const x = T.find(y => y.title === t || y.title.startsWith(t + ' · ')); return x ? x.rows.map(r => r[0]) : null; };
    const only = (name, xs, want) => { if (!xs) fail(`no ${name} table`); else if (JSON.stringify(xs) !== JSON.stringify(want)) fail(`${name} should list ${JSON.stringify(want)}: ${JSON.stringify(xs)}`); };
    const want = ['Ann Roster', 'Ben Two'];
    only('🏅 Scores', r.rows, want);
    only('⬇ Download · 🏅 Scores', col('🏅 Scores'), want);
    only('⬇ Download · ✍️ Knowledge Checks', col('✍️ Knowledge Checks'), want);
    only('⬇ Download · 📅 Day 1–5: Detailed Scores', col('📅 Day 1–5: Detailed Scores'), want);
    if (JSON.stringify(r.cards) !== JSON.stringify([KEEP, 'ben-two--b111326'])) fail(`a card per scored trainee only: ${JSON.stringify(r.cards)}`);
    if (r.shown.length !== 1 || !r.cards.includes(r.shown[0])) fail(`the Scorecards should show one scored trainee's card at a time: ${JSON.stringify(r.shown)}`);
    const lessons = col('📚 Lessons');
    if (!lessons || !lessons.includes('Wes Wait') || !lessons.includes('Arc Old')) fail(`⬇ Download's 📚 Lessons should still list the trainee waiting for approval and the archived one: ${JSON.stringify(lessons)}`);
    if (lessons && lessons.filter(x => x === 'Ann Roster').length !== 1) fail(`the merged-away account should not be on 📚 Lessons either: ${JSON.stringify(lessons)}`);
    if (/Ann Roster/.test(r.dup)) fail('a merge waiting to finish should not be offered as two accounts again');
    if (/Ben Two/.test(r.dup)) fail('the same name in two different batches is two people, not one with two accounts');
    if (!/Cy Pair/.test(r.dup)) fail('B250926 and B092526 are one batch: Cy Pair has two accounts');
    const l = r.locked.find(x => x.from === OLD);
    if (!l || l.level !== 'pending' || !l.pending) fail(`a pending merge's redirect should read as a merge not finished (to run again), not a lock to remove: ${JSON.stringify(r.locked)}`);
    if (r.bdCol !== '85%') fail(`🏅 Scores' 📂 Backup Drive should be the Worker's nightly 85% (nothing saved on the trainee's progress): ${r.bdCol}`);
    const sc1 = T.find(x => /^🏅 Score Card · Day 1/.test(x.title)), c = CSV.cellOf(sc1, '📂 Backup Drive', 'Ann Roster');
    if (c.v !== '85%') fail(`⬇ Download's 🏅 Score Card · Day 1 📂 Backup Drive should be the nightly 85%: ${c.err || c.v}`);
    if (r.bdPct !== '85%') fail(`the card's feedback on Day 1's 📂 Backup Drive should be the nightly 85%: ${r.bdPct}`);
    if (r.bdModel !== 85) fail(`the day score should count the nightly 85% for Day 1's Backup Drive: ${r.bdModel}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('One roster on every score table (approved, not archived, not merged away); duplicates only in one batch; a pending merge reads pending; the 📂 Backup Drive is the Worker\'s nightly grade the day score counts.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
