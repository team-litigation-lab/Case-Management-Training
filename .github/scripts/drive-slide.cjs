// @check browser — Day 1's Backup File Maintenance slide is the Backup Drive task, the retired case folder stays gone, and the 🏷 naming convention box is where the drive is worked on
// Day 1's case backup is the Backup Drive (js/cm-drive.js), and only the Backup Drive:
// 1. the deck: Day 1's Backup File Maintenance "Your Case" slide shows the Backup Drive task's four steps and the
//    firm's standard as the Worker keeps it;
// 2. the retired link-based case folder (a trainer's Drive Links tab, the trainee's My Case Folder card) stays gone,
//    so a trainee is never given two different folder tasks.
// 3. 🏷 the firm's naming convention is shown where the drive is worked on: Day 1's slide and each later day's Backup File
//    Maintenance task carry the box (the Worker's pattern, a filled example to copy, the labels from Day 3, what the names
//    count for), and the Backup Drive panel lists each wrongly named file with its folder, the name it should have, the
//    differing part marked and what the check can't see, in type no smaller than 14px bold.
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
    // 🏷 Day 1's slide carries the naming box: the pattern as the Worker has it and an example to copy
    const PATTERN = '<Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.<ext>', NAME = /^[A-Z0-9-]+_Doe-John_[A-Za-z-]+_\d{4}-\d{2}-\d{2}\.pdf$/;
    const boxOf = async (sel) => page.evaluate((sel) => { const b = document.querySelector(sel); if (!b) return null;
        const small = [...b.querySelectorAll('*')].filter(e => e.children.length === 0 && e.textContent.trim()).map(e => { const c = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 30), px: parseFloat(c.fontSize), w: Number(c.fontWeight) }; }).filter(x => x.px < 14 || x.w < 700);
        return { text: b.innerText, pattern: (b.querySelector('.drv-nc-pat') || {}).textContent || '', copy: (b.querySelector('[data-copy]') || { dataset: {} }).dataset.copy || '', small }; }, sel);
    await page.waitForFunction(() => /Case ID/.test((document.querySelector('.drv-slide .drv-nc') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
    let box = await boxOf('.drv-slide .drv-nc');
    if (!box) fail("Day 1's Backup Drive slide has no 🏷 naming convention box");
    else {
        if (box.pattern !== PATTERN) fail(`Day 1's 🏷 box should show the firm's pattern: "${box.pattern}"`);
        if (!NAME.test(box.copy)) fail(`Day 1's 🏷 box should carry a filled example of John Doe's file to copy: "${box.copy}"`);
        if (box.small.length) fail(`Day 1's 🏷 box has type under 14px bold: ${JSON.stringify(box.small.slice(0, 4))}`);
    }
    // 🏷 and each later day's Backup File Maintenance task (every day open, as a trainer presents it)
    for (const n of [2, 3, 4, 5]) {
        const shown = await page.evaluate((n) => { state.isAdmin = true; const d = DAYS.find(d => d.cf && d.cf.n === n); goto('day', d.id); state.dayViewMode = 'slides';
            const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === `d${n}-drive` && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'task');
            if (k < 0) return false; goToSlide(k); return true; }, n);
        if (!shown) { fail(`Day ${n} has no Your Task slide for Backup File Maintenance`); continue; }
        await page.waitForFunction(() => /Case ID/.test((document.querySelector('#lessonSlideWrap .drv-nc') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
        box = await boxOf('#lessonSlideWrap .drv-nc');
        if (!box) { fail(`Day ${n}'s Backup File Maintenance task has no 🏷 naming convention box`); continue; }
        if (box.pattern !== PATTERN || !NAME.test(box.copy)) fail(`Day ${n}'s 🏷 box should show the pattern and an example to copy: "${box.pattern}" / "${box.copy}"`);
        if (!/12 of the 60/.test(box.text)) fail(`Day ${n}'s 🏷 box should say what the names count for: "${box.text.slice(0, 200)}"`);
        if (n >= 3 && (!/_DRAFT\.pdf/.test(box.text) || !/_SUPERSEDED-<YYYY-MM-DD>\.pdf/.test(box.text))) fail(`Day ${n}'s 🏷 box should show the DRAFT and SUPERSEDED labels: "${box.text.slice(0, 300)}"`);
        if (box.small.length) fail(`Day ${n}'s 🏷 box has type under 14px bold: ${JSON.stringify(box.small.slice(0, 4))}`);
    }
    await page.evaluate(() => { state.isAdmin = false; goto('dashboard'); render(); });
    // 🏷 the panel: a connected, built drive whose last check found a name turned round (the Worker's report, as it sends it)
    // (the test server has no Google keys and no trainee tokens, so the status is composed here from the Worker's own
    //  "standard" answer: its structure and its naming rule, with a report shaped as driveNaming in worker.js sends it)
    const std = await page.evaluate(async () => (await (await fetch('/api/drive', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, typeof authHeaders === 'function' ? authHeaders() : {}), body: JSON.stringify({ action: 'standard' }) })).json()).standard);
    if (!std || !std.naming || std.naming.pattern !== PATTERN) fail(`the Worker's "standard" answer should carry the naming rule: ${JSON.stringify(std && std.naming).slice(0, 200)}`);
    const status = { drive: { configured: true, clientId: 'x', scopes: '', standard: (std || {}).standard || [], why: (std || {}).why || {}, homes: {}, root: (std || {}).root || '', connected: true, email: 'dana@example.com', rootUrl: '',
        built: true, builtAt: '2026-11-12T10:00:00.000Z', checkedAt: '2026-11-12T11:00:00.000Z', lastMissing: [], setup: { attempts: 1, ok: true, score: 100, problems: [] }, saved: [], grades: {}, gradedAt: null, drills: [],
        naming: Object.assign({}, (std || {}).naming, { caseId: 'LSH-2026-MVA-000041', report: { at: '2026-11-12T12:00:00.000Z', checked: 4, named: 3, wrong: 1, list: [{ kind: 'file', folder: '02 Police, Witness & Video',
            name: 'LSH-2026-MVA-000041_John-Doe_Police-Report_2026-11-12.pdf', want: 'LSH-2026-MVA-000041_Doe-John_Police-Report_2026-11-12.pdf', n: 2, part: 'Last-First', got: 'John-Doe', should: 'Doe-John',
            hint: 'Look at part 2 of the name, the second piece between the underscores (Last-First): "John-Doe" should be "Doe-John".' }] } }) }, grades: {} };
    await page.route('**/api/drive', (route) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(status) }));
    await page.evaluate(async () => { await CMDrive.reload(); CMDrive.show(); });
    await page.waitForSelector('#cmDriveHost .drv-nr-it', { timeout: 10000 }).catch(() => {});
    const panel = await page.evaluate(() => { const h = document.getElementById('cmDriveHost'); if (!h) return null; const it = h.querySelector('.drv-nr-it');
        const small = [...h.querySelectorAll('.drv-nc *, .drv-nr *')].filter(e => e.children.length === 0 && e.textContent.trim()).map(e => { const c = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 30), px: parseFloat(c.fontSize), w: Number(c.fontWeight) }; }).filter(x => x.px < 14 || x.w < 700);
        return { box: (h.querySelector('.drv-nc') || {}).innerText || '', report: (h.querySelector('.drv-nr') || {}).innerText || '', item: it ? it.innerText : '', bad: it ? [...it.querySelectorAll('.drv-nr-bad')].map(e => e.textContent) : [], good: it ? [...it.querySelectorAll('.drv-nr-good')].map(e => e.textContent) : [],
            copy: it ? ((it.querySelector('[data-copy]') || { dataset: {} }).dataset.copy || '') : '', card: (document.getElementById('drvCardSlot') || {}).innerText || '', small }; });
    await page.unroute('**/api/drive');
    if (!panel) fail('the Backup Drive panel did not open');
    else {
        if (!/<Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>\.<ext>/.test(panel.box) || !/LSH-2026-MVA-000041_Doe-John_/.test(panel.box)) fail(`the panel's 🏷 box should show the pattern and an example with the trainee's Case ID: "${panel.box.slice(0, 240)}"`);
        if (!/12 of the 60 points/.test(panel.box)) fail('the panel should state what the names count for in the grade');
        if (!/02 Police, Witness & Video/.test(panel.item) || !/LSH-2026-MVA-000041_John-Doe_Police-Report_2026-11-12\.pdf/.test(panel.item) || !/LSH-2026-MVA-000041_Doe-John_Police-Report_2026-11-12\.pdf/.test(panel.item) || !/part 2/.test(panel.item))
            fail(`the panel should list the wrongly named file with its folder, its name, the name it should have and the part to look at: "${panel.item}"`);
        if (panel.bad.join() !== 'John-Doe' || panel.good.join() !== 'Doe-John') fail(`the differing part should be marked in both names: ${JSON.stringify([panel.bad, panel.good])}`);
        if (panel.copy !== 'LSH-2026-MVA-000041_Doe-John_Police-Report_2026-11-12.pdf') fail(`the name it should have should be copyable: "${panel.copy}"`);
        if (!/can't see/.test(panel.report) || !/by hand/.test(panel.report) || !/3 of 4 files/.test(panel.report)) fail(`the panel should say how many names are right and what the check can't see: "${panel.report.slice(0, 300)}"`);
        if (!/1 name to fix/.test(panel.card)) fail(`the dashboard card should say a name needs fixing: "${panel.card.slice(0, 200)}"`);
        if (panel.small.length) fail(`the panel's naming box and report have type under 14px bold: ${JSON.stringify(panel.small.slice(0, 4))}`);
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Day 1\'s case backup is the Backup Drive: the slide carries its four steps and the firm\'s standard, and the retired case folder stays gone.');
    console.log('🏷 The naming convention is on Day 1\'s slide, every Backup File Maintenance task and the Backup Drive panel, which lists each wrong name with the part that differs.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
