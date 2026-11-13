// @check browser — The Batch Sheet's Score Card shows one day at a time, Recent progress has the scores, and Day by Day and each trainee's own score card are at the bottom
// The Batch Sheet (js/cm-batch-sheet.js): 🏅 Score Card shows one Case Flow day at a time (Day 1 … Day 5 buttons), 🕒 Recent
// progress lists the graded work with its score (each Knowledge Check attempt, the Backup Drive), and 📅 Day by Day and 🔎 a
// card per trainee (their days inside) sit at the bottom of the sheet; clicking a trainee in Day by Day opens their card.
// Usage: node .github/scripts/batch-sheet-cards.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Sheet', 'Cards', 'B111326');
    const r = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const cf = DAYS.filter(d => d.cf), d1 = cf[0], now = new Date().toISOString();
        const mk = (id, name, score) => ({ id, name, batch: 'B111326', approved: true, registeredAt: now,
            __extra: { data: { 'day-progress': { [d1.id]: { score, passed: score >= 70, date: now, history: [{ score: 40, passed: false, date: now }, { score, passed: score >= 70, date: now }] } },
                'drive-grades': { [d1.cf.n]: { score: 88, passed: true, at: now } } } } });
        state.isAdmin = true; state.adminData = [mk('ann-card--b111326', 'Ann Card', 90), mk('ben-card--b111326', 'Ben Card', 75)];
        state.adminBatchFilter = 'B111326'; state.adminTab = 'batchsheet'; goto('admin'); render(); await new Promise(r => setTimeout(r, 2000));
        const main = document.querySelector('main') || document.body, secs = [...main.querySelectorAll('.bs-sec, .bs-sys, section, .gs-wrap')];
        const h = t => [...main.querySelectorAll('h3')].findIndex(x => x.textContent.includes(t));
        const heads = [...main.querySelectorAll('h3')].map(x => x.textContent.trim().slice(0, 40));
        const scBtns = [...main.querySelectorAll('.bs-scday button')].map(b => b.textContent);
        const scHead = [...main.querySelectorAll('h3')].filter(x => x.textContent.includes('Score Card')).map(x => x.textContent);
        const recent = [...main.querySelectorAll('h3')].find(x => x.textContent.includes('Recent progress'));
        const recentText = recent ? recent.closest('section, div').innerText : '';
        const cards = [...main.querySelectorAll('details.bs-ds-tr')].map(x => x.id);
        const row = [...main.querySelectorAll('tr[onclick*="dsWho"]')][1]; if (row) row.click(); await new Promise(r => setTimeout(r, 300));
        const opened = [...document.querySelectorAll('details.bs-ds-tr[open]')].map(x => x.id);
        return { heads, iDay: h('Day by Day'), iRecent: h('Recent progress'), iCards: h("Each trainee's score card"), iSc: h('Score Card'), n: heads.length, scBtns: scBtns.length, cfN: cf.length, scHead, recentText, cards, opened };
    });
    if (r.scBtns !== r.cfN) fail(`the Score Card should have a button per Case Flow day (${r.cfN}): ${r.scBtns}`);
    if (r.scHead.length !== 1 || !/Day 1/.test(r.scHead[0])) fail(`the Score Card should show one day (Day 1 here): ${JSON.stringify(r.scHead)}`);
    if (!(r.iRecent >= 0 && r.iDay > r.iRecent && r.iCards > r.iDay && r.iCards === r.n - 1)) fail(`Day by Day and the trainees' cards should be the last on the sheet: ${JSON.stringify(r.heads)}`);
    if (!/attempt 1/.test(r.recentText) || !/40%/.test(r.recentText) || !/Backup File Maintenance/.test(r.recentText) || !/88%/.test(r.recentText)) fail(`Recent progress should list each Knowledge Check attempt and the Backup Drive with their scores: ${r.recentText.slice(0, 600)}`);
    if (r.cards.length !== 2) fail(`there should be a score card per trainee: ${JSON.stringify(r.cards)}`);
    if (r.opened.length !== 1 || !/ben-card/.test(r.opened[0])) fail(`clicking Ben in Day by Day should open Ben's card: ${JSON.stringify(r.opened)}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('The Batch Sheet: the Score Card a day at a time, Recent progress with its scores, Day by Day and a card per trainee at the bottom.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
