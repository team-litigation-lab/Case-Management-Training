// @check browser — ⬇ Download's 📅 Day 1–5: Detailed Scores holds every score in one row per trainee: the Overall and day scores, 🏅 Scores' summary, a Score Card group per day and a group per grading system, the same numbers as the 🏅 Scorecard page and the file's other tables
// js/cm-batch-sheet.js dayTable, now in the one 🏅 Scorecard page's ⬇ Download (js/cm-scorecard.js csv → csvTables): the one
// place a trainer reads all of a trainee's scores in a single row. Its groups of columns, in order: 📅 Overall & day scores,
// 🏅 Summary (rank, days passed, the grading systems average, each system's average), 🏅 Score Card · Day N for each Case Flow
// day (no second day score), then each grading system; the group names are a row above the headers. Each number is the one
// shown elsewhere: the Overall and days passed as 🏅 Scores on the page, each system's average as the 100-point model in
// full, a day's ✍️ Knowledge Check as that day's 🏅 Score Card. Two trainees' records are put on the server.
// Usage: node .github/scripts/detailed-scores-all.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const CSV = require('./csv-sections.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 }, acceptDownloads: true });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Sheet', 'Every', 'B112026');
    const r = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const cf = DAYS.filter(d => d.cf), now = new Date().toISOString();
        const dp = (s1, s2) => ({ [cf[0].id]: { score: s1, passed: s1 >= 70, done: s1 >= 70, date: now, history: [{ score: s1, passed: s1 >= 70, date: now }] }, [cf[1].id]: { score: s2, passed: s2 >= 70, done: s2 >= 70, date: now, history: [{ score: s2, passed: s2 >= 70, date: now }] } });
        for (const [id, name, s1, s2] of [['ann-every--b112026', 'Ann Every', 92, 81], ['ben-every--b112026', 'Ben Every', 74, 66]]) {
            await sharedSet('trainee:' + id, { id, name, batch: 'B112026', approved: true, registeredAt: now, dayProgress: dp(s1, s2) });
            await sharedSet('progress:' + id, { data: { 'day-progress': dp(s1, s2) } }); }
        state.isAdmin = true; state.adminData = null; delete state.adminTab; cmScorecard.refresh(); goto('admin');
        for (let i = 0; i < 60 && !document.querySelector('.cmsh-screen #scx-scores'); i++) await new Promise(r => setTimeout(r, 300));
        cmScorecard.batch(typeof batchShow === 'function' ? (batchShow('B112026') || 'B112026') : 'B112026'); await new Promise(r => setTimeout(r, 500));
        const S = (window.cmScorecard && cmScorecard.sources) || [];
        return { cfN: cf.length, sys: S.map(s => `${s.icon} ${s.label}`), kcSys: `${S[0].icon} ${S[0].label}` };
    });
    const file = await CSV.grab(page, () => cmScorecard.csv());
    const T = file ? CSV.parse(file) : [], D = T.find(x => x.title.startsWith('📅 Day 1–5: Detailed Scores')), M = T[0], F = T.find(x => x.title === '🏅 The 100-point model in full'), SC1 = T.find(x => /^🏅 Score Card · Day 1\b/.test(x.title));
    if (!file) fail('⬇ Download gave no file');
    else if (!D) fail(`⬇ Download has no 📅 Day 1–5: Detailed Scores: ${JSON.stringify(T.map(x => x.title))}`);
    else {
        const g = (D.groups || []).filter(Boolean);
        if (g[0] !== '📅 Overall & day scores' || g[1] !== '🏅 Summary') fail(`the group names should be a row above the headers, 📅 Overall & day scores then 🏅 Summary first: ${JSON.stringify(g.slice(0, 3))}`);
        const dayG = g.filter(x => /^🏅 Score Card · Day \d/.test(x));
        if (dayG.length !== r.cfN) fail(`a 🏅 Score Card group per Case Flow day (${r.cfN}): ${JSON.stringify(dayG)}`);
        const missing = r.sys.filter(s => !g.includes(s));
        if (missing.length) fail(`every grading system should have its group of columns: missing ${JSON.stringify(missing)}`);
        ['Overall', 'Rank', 'Days passed', 'Grading systems average %'].concat(r.sys).forEach(h => { if (!D.head.includes(h)) fail(`the Detailed Scores should have a "${h}" column`); });
        if (D.head.includes('Day score')) fail('a day score shows once, in front (Day N.), not again in its Score Card group');
        if (D.rows.length !== 2 || !/Ann Every/.test(D.rows[0][0]) || !/Ben Every/.test(D.rows[1][0])) fail(`a row per trainee: ${JSON.stringify(D.rows.map(x => x[0]))}`);
        // the same numbers as the page's 🏅 Scores and the file's other tables
        for (const nm of ['Ann Every', 'Ben Every']) {
            const d = h => CSV.cellOf(D, h, nm).v;
            const same = (what, a, b) => { if (a == null || a !== b) fail(`${nm} · ${what}: the Detailed Scores "${a}", elsewhere "${b}"`); };
            same('Overall', d('Overall'), CSV.cellOf(M, 'Overall %', nm).v);
            same('Days passed', d('Days passed'), CSV.cellOf(M, 'Days passed', nm).v);
            same(r.kcSys, d(r.kcSys), CSV.cellOf(F, r.kcSys, nm).v);
            same('Day 1 ✍️ Knowledge Check', d('✍️ Knowledge Check'), CSV.cellOf(SC1, '✍️ Knowledge Check', nm).v);
        }
        if (CSV.cellOf(D, '✍️ Knowledge Check', 'Ann Every').v !== '92%') fail(`Ann's Day 1 Knowledge Check should read 92%: "${CSV.cellOf(D, '✍️ Knowledge Check', 'Ann Every').v}"`);
        const raw = file.replace(/^﻿/, '').split('\r\n'), i = raw.findIndex(l => l.startsWith('"📅 Day 1–5: Detailed Scores'));
        if (i < 0 || !/"📅 Overall & day scores"/.test(raw[i + 1] || '') || !/"Trainee"/.test(raw[i + 2] || '')) fail(`the CSV should carry the Detailed Scores' group names above its headers: ${JSON.stringify(raw.slice(i, i + 3)).slice(0, 300)}`);
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('📅 Day 1–5: Detailed Scores (⬇ Download): every score in one row per trainee (Overall & day scores, the summary, a Score Card group per day, every grading system), the same numbers as 🏅 Scores and the file\'s other tables, the groups above the headers.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
