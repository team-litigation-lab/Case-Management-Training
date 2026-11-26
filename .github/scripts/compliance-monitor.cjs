// @check browser — Compliance and Platform Utilization Monitoring: a trainee's 🏅 Scorecard card carries the section (📂 Backup Drive, 📚 Lesson decks, 🕘 Last opened, ⏱ Last on the platform), each item ✓ or ✗ from what is stored
// js/cm-compliance-monitor.js, drawn by js/cm-scorecard.js cardHtml above 📝 Send Progress:
//   1. cmCompliance.html reads a trainee's Drive report (state.driveReports), their slide progress per Case Flow day,
//      their last-view and their record's lastActive, and counts each row;
//   2. the Scorecard page shows the section on the picked trainee's card.
// Usage: node .github/scripts/compliance-monitor.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Mona', 'Monitor', 'B112126');
    if (!(await page.evaluate(() => !!window.cmCompliance))) fail('index.html should load js/cm-compliance-monitor.js');

    // 1. the section, from what is stored
    const one = await page.evaluate(() => {
        const cf = DAYS.filter(d => d.cf), n0 = buildDaySlides(cf[0]).length, id = 'mona-monitor--b112126';
        state.driveReports = state.driveReports || {};
        state.driveReports[id] = { connected: true, email: 'mona@example.com', passed: true, attempts: 1, builtAt: '2026-11-20T10:00:00Z', checkedAt: '2026-11-24T10:00:00Z', missing: ['04 Medical'] };
        const r = { id, name: 'Mona Monitor', c: { rec: { lastActive: new Date(Date.now() - 3 * 3600e3).toISOString() },
            data: { 'slide-progress': { [cf[0].id]: n0 - 1, [cf[1].id]: 2 }, 'last-view': { view: 'day', dayId: cf[1].id, at: '2026-11-25T09:00:00Z' } } } };
        const box = document.createElement('div'); box.innerHTML = cmCompliance.html(r);
        const rows = [...box.querySelectorAll('tbody tr')].map(tr => [...tr.children].map(c => c.textContent.replace(/\s+/g, ' ').trim()));
        return { cfN: cf.length, head: (box.querySelector('thead') || {}).textContent, rows,
            driveMarks: [...box.querySelectorAll('tbody tr:nth-child(1) .ccm-mk')].map(b => b.textContent),
            deckMarks: [...box.querySelectorAll('tbody tr:nth-child(2) .ccm-mk')].map(b => b.textContent) };
    });
    if (!/Compliance and Platform Utilization Monitoring/.test(one.head || '')) fail(`the section's heading: ${one.head}`);
    const row = (l) => one.rows.find(r => r[0].includes(l)) || [];
    if (row('Backup Drive')[1] !== '3 / 4' || one.driveMarks.join('') !== '✓✓✓✗') fail(`📂 Backup Drive: connected, passed and built, one folder missing → 3 / 4: ${JSON.stringify(row('Backup Drive'))} ${one.driveMarks.join('')}`);
    if (row('Lesson decks')[1] !== `1 / ${one.cfN}` || one.deckMarks[0] !== '✓' || one.deckMarks[1] !== '✗' || one.deckMarks.length !== one.cfN) fail(`📚 Lesson decks: Day 1 gone through to the end, Day 2 part-way → 1 / ${one.cfN}: ${JSON.stringify(row('Lesson decks'))} ${one.deckMarks.join('')}`);
    if (row('Last opened')[1] !== 'Day 2') fail(`🕘 Last opened should name Day 2: ${JSON.stringify(row('Last opened'))}`);
    if (!/3 h ago/.test(row('Last on the platform')[1] || '')) fail(`⏱ Last on the platform should say 3 h ago: ${JSON.stringify(row('Last on the platform'))}`);

    // 2. on the Scorecard page, on the picked trainee's card
    const two = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const cf = DAYS.filter(d => d.cf), now = new Date().toISOString(), id = 'nia-monitor--b112126';
        await sharedSet('trainee:' + id, { id, name: 'Nia Monitor', batch: 'B112126', approved: true, registeredAt: now, lastActive: now });
        await sharedSet('progress:' + id, { data: { 'slide-progress': { [cf[0].id]: 1 } } });
        state.isAdmin = true; state.adminData = null; delete state.adminTab; cmScorecard.refresh(); goto('admin');
        for (let i = 0; i < 60 && !document.querySelector('.ccm'); i++) await new Promise(r => setTimeout(r, 300));
        const s = document.querySelector('.ccm'), card = s && s.closest('.bs-pt');
        return { has: !!s, inCard: !!card, beforeSend: !!(s && (!document.querySelector('.bs-pt .sp-card, .bs-pt [class*="send"]') || s.compareDocumentPosition(document.querySelector('.bs-pt .sp-card, .bs-pt [class*="send"]')) & Node.DOCUMENT_POSITION_FOLLOWING)) };
    });
    if (!two.has || !two.inCard) fail(`the 🏅 Scorecard page should show the section on the trainee's card: ${JSON.stringify(two)}`);

    await browser.close();
    if (failures.length) { console.error('Compliance monitor check FAILED:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log('Compliance monitor check passed (the trainee card\'s Compliance and Platform Utilization Monitoring: 📂 Backup Drive 3 / 4 with the missing folder ✗, 📚 Lesson decks per Case Flow day, 🕘 Last opened, ⏱ Last on the platform; on the 🏅 Scorecard page).');
})().catch(e => { console.error(e); process.exit(1); });
