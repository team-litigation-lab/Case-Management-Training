// @check browser — Day 1's Backup File Maintenance slide is the Backup Drive task, and the retired link-based case folder stays gone
// Day 1's case backup is the Backup Drive (js/cm-drive.js), and only the Backup Drive:
// 1. the deck: Day 1's Backup File Maintenance "Your Case" slide shows the Backup Drive task's four steps and the
//    firm's standard as the Worker keeps it;
// 2. the retired link-based case folder (a trainer's Drive Links tab, the trainee's My Case Folder card) stays gone,
//    so a trainee is never given two different folder tasks.
// Usage: node .github/scripts/drive-slide.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    const last = 'Slide' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
    await signIn(page, 'Dana', last, 'B100926');

    // the retired case folder: no card on the dashboard, no tab for a trainer
    await page.evaluate(() => { ['ktLogin'].forEach(i => { const o = document.getElementById(i); if (o) o.remove(); }); goto('dashboard'); render(); });
    await page.waitForTimeout(800);
    if (await page.locator('.dsop-card').count()) fail('the dashboard still shows the retired My Case Folder card');
    const tabs = await page.evaluate(() => { state.isAdmin = true; const h = renderAdmin(); state.isAdmin = false; return h; }).catch(() => '');
    if (/Drive Links|drivelinks/.test(tabs)) fail('the admin page still has the retired Drive Links tab');
    if (await page.evaluate(() => !!window.cmDriveSop)) fail('the retired case folder script is still loaded');

    // the deck: Day 1's Backup File Maintenance, Your Case
    const slide = await page.evaluate(() => { const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
        const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === 'd1m1-drive' && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'case');
        if (k < 0) return null; goToSlide(k); return true; });
    if (!slide) fail('Day 1 has no Your Case slide for Backup File Maintenance');
    else {
        await page.waitForFunction(() => /09 Litigation & ADR/.test((document.querySelector('.drv-slide') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
        const t = await page.locator('.drv-slide').innerText().catch(() => '');
        if (!/Connect your Google Drive/.test(t) || !/Build the firm's folders/.test(t) || !/Check my drive/.test(t) || !/File in the CMS/.test(t)) fail(`the slide should carry the Backup Drive task's four steps: "${t.slice(0, 200)}"`);
        if (!/LSH Case Backups/.test(t) || !/Doe-John/.test(t) || !/09 Litigation & ADR/.test(t) || !/04 Closed Files/.test(t)) fail(`the slide should show the firm's standard, from the Worker: "${t.slice(0, 300)}"`);
        if (/\[Your Full Name\]|Your trainer sends your folder link/.test(t)) fail('the slide still teaches the link-based case folder instead of the Backup Drive');
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Day 1\'s case backup is the Backup Drive: the slide carries its four steps and the firm\'s standard, and the retired case folder stays gone.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
