// @check browser — 🏅 Scorecard in the trainee's top bar: the ✅ passing score, their own row of 🏅 Scores, their feedback table and 📊 My Batch's Progress (their rank and each day against the batch average, no other trainee's name)
// The trainee's 🏅 Scorecard (js/cm-scorecard.js renderMine, js/cm-rank-share.js) shows what the trainer's Scorecard shows of
// them, and only them: a passing-score bar with the pass mark on it and each day against it; their row of the 🏅 Scores
// table (no row numbers, Registered or Days passed); their 💬 Feedback on practical activities; and 📊 My Batch's Progress
// from rankshare:<id> (written when a trainer opens the Rankings & Progress Report): their rank of the ranked, each day
// beside the batch average and the passing score, and their Strength, Challenges and ratings — no other trainee's name.
// Usage: node .github/scripts/trainee-scorecard.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Tia', 'Scorecard', 'B112026');
    const id = await page.evaluate(() => state.traineeId);
    const get = (key) => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    const put = (key, v) => page.evaluate(([key, v]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(v) }) }), [key, v]);
    const rec = await get('trainee:' + id); rec.approved = true; await put('trainee:' + id, rec);
    await put('rankshare:' + id, { at: new Date().toISOString(), batch: 'Batch B112026', rank: 2, of: 5, overall: '72%', result: 'Not yet (below 80%)',
        strength: 'Strong in Communication & Documentation: communicates clearly and keeps the file well documented.', challenges: 'Needs work on Care/Action Plan Quality.',
        attrs: [{ label: 'Case Analysis & Problem Solving', stars: '★★★★☆' }], progress: 'Until Day 3', passed: 'Days passed 2/5', days: [{ n: 1, me: 85, avg: 78 }, { n: 2, me: 60, avg: 70 }] });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    const nav = await page.evaluate(() => [...document.querySelectorAll('.topbar .nav button')].map(b => b.innerText.trim()));
    if (!nav.includes('🏅 Scorecard')) fail(`the trainee's top bar has no 🏅 Scorecard button: ${JSON.stringify(nav)}`);
    await page.evaluate(() => goto('scorecard'));
    await page.waitForSelector('.rks', { timeout: 20000 }).catch(() => {});
    await page.waitForFunction(() => document.querySelector('.rks') && !/Loading/.test(document.querySelector('.rks').innerText), null, { timeout: 15000 }).catch(() => {});
    const R = await page.evaluate(() => ({
        pass: (document.querySelector('.scx-pass') || {}).innerText || '', passLine: !!document.querySelector('.scx-bar .scx-bar-pass'),
        scores: (document.querySelector('#scx-scores') || {}).innerText || '', head: [...document.querySelectorAll('#scx-scores .gs-head th')].map(t => t.textContent.trim()),
        rn: !!document.querySelector('#scx-scores .gs-rn'), rows: document.querySelectorAll('#scx-scores tbody tr').length,
        fb: !!document.querySelector('.bs-fb'), batch: (document.querySelector('.rks') || {}).innerText || '' }));
    if (!/Passing score: 80%/.test(R.pass) || !R.passLine) fail(`the ✅ passing score should be shown with the pass mark on the bar: ${R.pass.slice(0, 200)}`);
    if (!/🏅 My Scores/.test(R.scores) || R.rows !== 1) fail(`🏅 My Scores should be the trainee's one row of the Scores table (${R.rows} rows): ${R.scores.slice(0, 200)}`);
    if (R.rn || R.head.includes('Registered') || R.head.includes('Days passed')) fail(`🏅 My Scores should have no row numbers, Registered or Days passed: ${JSON.stringify(R.head)}`);
    if (!R.fb) fail('the trainee\'s 🏅 Scorecard has no 💬 Feedback on practical activities');
    for (const t of ["📊 My Batch's Progress", '#2', 'of 5 ranked', 'Batch average', '78%', '85%', 'Strong in Communication', 'Needs work on Care/Action Plan', '★★★★☆'])
        if (!R.batch.includes(t)) fail(`📊 My Batch's Progress has no "${t}": ${R.batch.slice(0, 400)}`);
    if (/Ann|Ben/.test(R.batch)) fail('📊 My Batch\'s Progress should name no other trainee');
    // 👁 a trainer's Trainee view opens the Scorecard page itself, not the Dashboard with its day cards
    const pv = await page.evaluate(() => { state.isAdmin = true; state.adminPreview = true; goto('scorecard'); render();
        return { banner: (document.querySelector('.scx-banner') || {}).innerText || '', dayCards: document.querySelectorAll('.day-card, .cf-day-card, .dash-day').length, dash: !!document.querySelector('.my-sc') }; });
    if (!/My Scorecard/.test(pv.banner) || pv.dayCards || pv.dash) fail(`👁 Trainee view's 🏅 Scorecard should be the Scorecard page, not the Dashboard: ${JSON.stringify(pv)}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('The trainee\'s 🏅 Scorecard: the passing score with the pass mark, their own row of 🏅 Scores, their feedback table, and their batch\'s progress (rank, each day against the batch average) with no other trainee named.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
