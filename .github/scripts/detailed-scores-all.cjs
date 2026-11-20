// @check browser — The Batch Sheet's 📅 Day 1–5: Detailed Scores holds every score in one row per trainee: the Overall and day scores, 🏅 Scores' summary, a Score Card group per day and a group per grading system, the same numbers as the tables under ▸ More detail
// js/cm-batch-sheet.js dayTable: the sheet's first table is the one place a trainer reads all of a trainee's scores. Its
// groups of columns, in order: 📅 Overall & day scores, 🏅 Summary (rank, days passed, the grading systems average, each
// system's average), 🏅 Score Card · Day N for each Case Flow day (no second day score), then each grading system. Each
// number is the one the folded table it comes from shows: the summary's Knowledge Checks average as 🏅 Scores', a day's
// ✍️ Knowledge Check as that day's 🏅 Score Card. The CSV carries the group names above the headers.
// Usage: node .github/scripts/detailed-scores-all.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Sheet', 'Every', 'B112026');
    const r = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const cf = DAYS.filter(d => d.cf), now = new Date().toISOString();
        const dp = (s1, s2) => ({ [cf[0].id]: { score: s1, passed: s1 >= 70, date: now, history: [{ score: s1, passed: s1 >= 70, date: now }] }, [cf[1].id]: { score: s2, passed: s2 >= 70, date: now, history: [{ score: s2, passed: s2 >= 70, date: now }] } });
        const mk = (id, name, s1, s2) => ({ id, name, batch: 'B112026', approved: true, registeredAt: now, dayProgress: dp(s1, s2), __extra: { data: { 'day-progress': dp(s1, s2) } } });
        state.isAdmin = true; state.adminData = [mk('ann-every--b112026', 'Ann Every', 92, 81), mk('ben-every--b112026', 'Ben Every', 74, 66)];
        state.adminBatchFilter = 'B112026'; state.adminTab = 'batchsheet'; cmBatchSheet.more(true); goto('admin'); render();
        await new Promise(r => setTimeout(r, 2500)); render(); await new Promise(r => setTimeout(r, 500));
        const grid = id => { const s = document.getElementById(id); if (!s) return null;
            return { head: [...s.querySelectorAll('.gs-head th')].slice(1).map(t => t.textContent.trim()), groups: [...s.querySelectorAll('.gs-groups th')].slice(1).map(t => t.textContent.trim()),
                rows: [...s.querySelectorAll('tbody tr')].map(t => [...t.querySelectorAll('td')].map(c => c.textContent.trim())) }; };
        const S = (window.cmScorecard && cmScorecard.sources) || [];
        cmBatchSheet.scDay(cf[0].id); await new Promise(r => setTimeout(r, 300));
        return { cfN: cf.length, days: grid('bs-days'), scores: grid('bs-scores'), sc1: grid('bs-scorecard-d' + cf[0].id), sys: S.map(s => `${s.icon} ${s.label}`), first: (document.querySelector('#bsSheet h3') || {}).textContent || '' };
    });
    const D = r.days;
    if (!D) { fail('the Batch Sheet has no 📅 Day 1–5: Detailed Scores'); }
    else {
        if (!/Day 1–5: Detailed Scores/.test(r.first)) fail(`📅 Day 1–5: Detailed Scores should be the sheet's first table: "${r.first}"`);
        const g = D.groups.filter(Boolean);
        if (g[0] !== '📅 Overall & day scores' || g[1] !== '🏅 Summary') fail(`the first groups should be 📅 Overall & day scores, then 🏅 Summary: ${JSON.stringify(g.slice(0, 3))}`);
        const dayG = g.filter(x => /^🏅 Score Card · Day \d/.test(x));
        if (dayG.length !== r.cfN) fail(`a 🏅 Score Card group per Case Flow day (${r.cfN}): ${JSON.stringify(dayG)}`);
        const missing = r.sys.filter(s => !g.includes(s));
        if (missing.length) fail(`every grading system should have its group of columns: missing ${JSON.stringify(missing)}`);
        ['Overall', 'Rank', 'Days passed', 'Grading systems average %'].concat(r.sys).forEach(h => { if (!D.head.includes(h)) fail(`the Detailed Scores should have a "${h}" column`); });
        if (D.head.includes('Day score')) fail('a day score shows once, in front (Day N.), not again in its Score Card group');
        if (D.rows.length !== 2 || !/Ann Every/.test(D.rows[0][0]) || !/Ben Every/.test(D.rows[1][0])) fail(`a row per trainee: ${JSON.stringify(D.rows.map(x => x[0]))}`);
        // the same numbers as the folded tables
        const at = (G, h, i) => G.rows[i][G.head.indexOf(h)];
        if (r.scores) for (const h of ['Overall %', 'Rank', 'Days passed', '✍️ Knowledge Checks']) for (const i of [0, 1]) {
            const want = at(r.scores, h, i), got = at(D, h === 'Overall %' ? 'Overall' : h, i);
            if (want !== got) fail(`${D.rows[i][0]} · ${h}: 🏅 Scores shows "${want}", the Detailed Scores "${got}"`); }
        else fail('no 🏅 Scores under ▸ More detail to compare with');
        if (r.sc1) { const k = D.head.indexOf('✍️ Knowledge Check'), k1 = r.sc1.head.indexOf('✍️ Knowledge Check');
            for (const i of [0, 1]) if (D.rows[i][k] !== r.sc1.rows[i][k1]) fail(`${D.rows[i][0]} · Day 1 ✍️ Knowledge Check: the Score Card shows "${r.sc1.rows[i][k1]}", the Detailed Scores "${D.rows[i][k]}"`);
            if (D.rows[0][k] !== '92%') fail(`Ann's Day 1 Knowledge Check should read 92%: "${D.rows[0][k]}"`); }
        else fail('no 🏅 Score Card · Day 1 under ▸ More detail to compare with');
    }
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), page.evaluate(() => cmBatchSheet.csv())]);
    if (!dl) fail('⬇ Download gave no CSV');
    else { const txt = require('fs').readFileSync(await dl.path(), 'utf8').split('\n'); const i = txt.findIndex(l => l.startsWith('"📅 Day 1–5: Detailed Scores'));
        if (i < 0 || !/"📅 Overall & day scores"/.test(txt[i + 1] || '') || !/"Trainee"/.test(txt[i + 2] || '')) fail(`the CSV should carry the Detailed Scores' group names above its headers: ${JSON.stringify(txt.slice(i, i + 3)).slice(0, 300)}`); }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('📅 Day 1–5: Detailed Scores: every score in one row per trainee (Overall & day scores, the summary, a Score Card group per day, every grading system), the same numbers as the folded tables, the groups in the CSV.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
