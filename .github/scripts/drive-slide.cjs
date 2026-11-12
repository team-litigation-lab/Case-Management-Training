// @check browser — Day 1's Backup File Maintenance slide is the Backup Drive task, the retired case folder stays gone, and the 🏷 naming convention box is where the drive is worked on without costing a slide its size
// Day 1's case backup is the Backup Drive (js/cm-drive.js), and only the Backup Drive:
// 1. the deck: Day 1's Backup File Maintenance "Your Case" slide shows the Backup Drive task's four steps and the
//    firm's standard as the Worker keeps it;
// 2. the retired link-based case folder (a trainer's Drive Links tab, the trainee's My Case Folder card) stays gone,
//    so a trainee is never given two different folder tasks.
// 3. 🏷 the firm's naming convention is shown where the drive is worked on: Day 1's slide and each later day's Backup File
//    Maintenance task carry the box (the Worker's pattern, a filled example to copy, the labels from Day 3, what the names
//    count for), and the Backup Drive panel lists each wrongly named file with its folder, the name it should have, the
//    differing part marked and what the check can't see, in type no smaller than 14px bold. The box never stays on
//    "Loading…": a trainee whose own status was refused gets the rule from the Worker's "standard", and is told when neither
//    could be loaded. With names to fix (the Worker's report: files and folders counted apart, every differing piece
//    listed, a copy the platform named itself marked as not counted) the panel says so beside the folders' verdict and in
//    its head, with the report above the convention; the card and the slides carry ✗ N names to fix · 📂 Open My Backup
//    Drive; one toast is shown when the list has changed; and the day's stored grade names the File names row first.
// 5. 📐 The box costs the slides no size. At 1366x768, on Day 1's Your Case slide (a trainee not linked, after a sign-in that
//    didn't finish, linked, linked and built, with names to fix; a trainer; the slides window) and on Days 2–5's Your Task
//    slides (a trainer; a trainee; a trainee with names to fix): nothing under #lessonSlideWrap is scaled down (no zoom
//    below 1), no text is under 16px, nothing is cut off, 🔗 Link my Google Drive and 📂 Build my folders are in plain view,
//    and Day 1's 🏷 card covers none of the firm's standard.
// 4. 🔗 Step 1 of Day 1's slide is where the drive is linked. A trainee has 🔗 Link my Google Drive there: Google's sign-in
//    script is fetched when the slide is drawn, so the first press starts the sign-in (initCodeClient().requestCode()) from the
//    slide, and the code Google hands back goes to /api/drive as "connect". While it runs the button reads Linking…; a sign-in
//    that didn't finish is a line in step 1 and the button works again. Linked, step 1 is ticked and shows the email and
//    Open my Drive ↗ (what the server sent is escaped), step 2 offers 📂 Build my folders, and the slide has redrawn itself in
//    place: the page isn't rendered again and the deck doesn't move. A trainer, and the slides window a presenter shares, get
//    the same button as a sample: pressing it asks nothing of Google and writes nothing to /api/drive. With linking not
//    switched on there is no button. Nothing on the slide is under 16px, and it is never cut off at 1366x768.
//    (Google and /api/drive are answered by the test: the test server has no Google keys and no trainee tokens.)
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
        if (!/Link your Google Drive/.test(t) || !/Build the firm's folders/.test(t) || !/Check my drive/.test(t) || !/File in the CMS/.test(t)) fail(`the slide should carry the Backup Drive task's four steps: "${t.slice(0, 200)}"`);
        if (!/LSH Case Backups/.test(t) || !/Doe-John/.test(t) || !/09 Litigation & ADR/.test(t) || !/04 Closed Files/.test(t)) fail(`the slide should show the firm's standard, from the Worker: "${t.slice(0, 300)}"`);
        if (/\[Your Full Name\]|Your trainer sends your folder link/.test(t)) fail('the slide still teaches the link-based case folder instead of the Backup Drive');
        // linking isn't switched on here (the test server has no Google keys): no button to press, and the slide says so
        if (await page.locator('.drv-slide [data-drv-link]').count()) fail("with Google linking not switched on, the slide still shows 🔗 Link my Google Drive");
        if (!/isn't switched on for this site yet/.test(t)) fail(`with Google linking not switched on, the slide should say so: "${t.slice(0, 300)}"`);
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
        // of the points the Worker grades that day (its `ofDay`): 60 on Days 2, 3 and 4, 48 on Day 5
        if (!(n === 5 ? /12 of the 48 points/ : /12 of the 60 points/).test(box.text)) fail(`Day ${n}'s 🏷 box should say what the names count for (12 of the ${n === 5 ? 48 : 60} points the Worker grades that day): "${box.text.slice(0, 200)}"`);
        // the labels that go last: from Day 3, at the end of the Practice Lab line (the row has the room for them)
        const labels = await page.evaluate(() => { const e = document.querySelector('#lessonSlideWrap .cfx-do-now .drv-nc-lb'); return e && !e.hidden ? e.innerText : ''; });
        if (n >= 3 && (!/_DRAFT\.pdf/.test(labels) || !/_SUPERSEDED-<YYYY-MM-DD>\.pdf/.test(labels) || !/label goes last/.test(labels))) fail(`Day ${n}'s task should show the DRAFT and SUPERSEDED labels, in its Practice Lab line: "${labels.slice(0, 300)}"`);
        if (n < 3 && labels) fail(`Day ${n}'s task shows the labels before Day 3 teaches them: "${labels.slice(0, 120)}"`);
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
        if (!/12 of the 60 points/.test(panel.box) || !/of 48 on Day 5/.test(panel.box)) fail(`the panel should state what the names count for in the grade, and that Day 5 is graded of 48: "${panel.box.slice(-260)}"`);
        if (!/02 Police, Witness & Video/.test(panel.item) || !/LSH-2026-MVA-000041_John-Doe_Police-Report_2026-11-12\.pdf/.test(panel.item) || !/LSH-2026-MVA-000041_Doe-John_Police-Report_2026-11-12\.pdf/.test(panel.item) || !/part 2/.test(panel.item))
            fail(`the panel should list the wrongly named file with its folder, its name, the name it should have and the part to look at: "${panel.item}"`);
        if (panel.bad.join() !== 'John-Doe' || panel.good.join() !== 'Doe-John') fail(`the differing part should be marked in both names: ${JSON.stringify([panel.bad, panel.good])}`);
        if (panel.copy !== 'LSH-2026-MVA-000041_Doe-John_Police-Report_2026-11-12.pdf') fail(`the name it should have should be copyable: "${panel.copy}"`);
        if (!/can't see/.test(panel.report) || !/by hand/.test(panel.report) || !/3 of 4 files/.test(panel.report)) fail(`the panel should say how many names are right and what the check can't see: "${panel.report.slice(0, 300)}"`);
        if (!/1 name to fix/.test(panel.card)) fail(`the dashboard card should say a name needs fixing: "${panel.card.slice(0, 200)}"`);
        if (panel.small.length) fail(`the panel's naming box and report have type under 14px bold: ${JSON.stringify(panel.small.slice(0, 4))}`);
    }

    /* ---------- 3b. 🏷 names to fix, as the Worker reports them: files and folders apart, every differing piece, a copy not counted ---------- */
    {
        const CASE = 'LSH-2026-MVA-000041';
        const wrong = { at: '2026-11-12T12:30:00.000Z', checked: 6, named: 3, wrong: 4, wrongFiles: 3, wrongFolders: 1, unscored: 1, list: [
            { kind: 'file', folder: '03 Medical Records', name: `${CASE}_Doe-John_medical records_2026-11-10.PDF`, want: `${CASE}_Doe-John_Medical-Records_2026-11-10.pdf`, scored: true,
              issues: [{ n: 3, part: 'Type', got: 'medical records', should: 'Medical-Records' }, { n: 99, part: 'ext', got: 'PDF', should: 'pdf' }], hint: 'Look at part 3 (Type): "medical records" should be "Medical-Records". Also the extension: ".PDF" should be ".pdf".' },
            { kind: 'file', folder: '01 Intake & Retainer', name: 'RS_05_Retainer_Agreement.pdf', want: `${CASE}_Doe-John_Retainer_2026-07-01.pdf`, scored: false,
              issues: [{ n: 1, part: 'Case ID', got: 'RS', should: CASE }, { n: 2, part: 'Last-First', got: '05', should: 'Doe-John' }, { n: 4, part: 'YYYY-MM-DD', got: 'Agreement', should: '2026-07-01' }], hint: '3 parts of this name differ, so rename it as shown.' },
            { kind: 'file', folder: '05 Insurance, Demands & Negotiation', name: `${CASE}_Doe-John_Others_2026-11-12.pdf`, want: `${CASE}_Doe-John_Others_2026-11-12_DRAFT.pdf`, scored: true,
              issues: [{ n: 5, part: 'label', got: '', should: 'DRAFT' }], hint: 'This document is a draft: add _DRAFT after the date.' },
            { kind: 'folder', folder: 'LSH Case Backups/01 Clients', name: 'doe john', want: 'Doe-John', scored: true, issues: [{ n: 0, part: 'folder', got: 'doe john', should: 'Doe-John' }], hint: 'A folder keeps the name the firm gave it.' }] };
        const clean = { at: '2026-11-12T13:00:00.000Z', checked: 6, named: 6, wrong: 0, wrongFiles: 0, wrongFolders: 0, list: [] };
        let fixed = false;
        const NOTE = '🏷 In 03 Medical Records, "medical records" should be named "Medical-Records". 2 more names aren\'t the firm\'s way: each one is listed under 🏷 File names.';
        const day = () => Object.assign({ score: fixed ? 85 : 62, passed: fixed, at: '2026-11-12T12:30:00.000Z', rows: [
            { label: 'Documents backed up', got: 20, max: 25, notes: ['RS16 is not on the drive.', 'RS26 is not on the drive.'] }, { label: 'Right folder', got: 10, max: 13, notes: ['RS12 is in 04 Bills & Invoices.', 'RS13 is in 04 Bills & Invoices.', 'RS15 is in the wrong folder.'] },
            { label: 'File names', got: fixed ? 12 : 6, max: 12, notes: fixed ? [] : [NOTE] }] },
            // as the Worker sends a day: the File names row by itself (`wrong`: the names it charges, so not the unscored copy)
            // and the notes with the 🏷 one first. (The day with every name right is sent the older way, rows only: the page reads them.)
            fixed ? {} : { names: { got: 6, max: 12, wrong: 3 }, issues: [NOTE, 'RS16 is not on the drive.', 'RS26 is not on the drive.', 'RS12 is in 04 Bills & Invoices.', 'RS13 is in 04 Bills & Invoices.', 'RS15 is in the wrong folder.'] });
        const drive = () => Object.assign({}, status.drive, { grades: { 2: day() }, gradedAt: '2026-11-12T12:30:00.000Z', naming: Object.assign({}, status.drive.naming, { report: fixed ? clean : wrong }) });
        await page.route('**/api/drive', (route) => {
            let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* no body */ }
            const body = b.action === 'check' ? { verified: { missing: [] }, drive: drive() } : b.action === 'grade' ? { drive: drive(), grades: { 2: day() } } : { drive: drive() };
            route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
        });
        const toasts = () => page.evaluate(() => window.__ciToasts.slice());
        await page.addStyleTag({ content: '#ktLogin{display:none!important}' });   // a trainee's 🔔 open-your-tools prompt, out of the way of the clicks
        await page.evaluate(async () => { const o = document.getElementById('ktLogin'); if (o) o.remove(); CMDrive.close();
            window.__ciToasts = []; const t = window.toast; window.toast = function (m) { window.__ciToasts.push(String(m)); return t.apply(this, arguments); };
            await CMDrive.reload(); await CMDrive.grade(true); });
        await page.waitForFunction(() => /folder to fix/.test((document.getElementById('drvCardSlot') || {}).innerText || '') && window.__ciToasts.some(t => /to fix on your Backup Drive/.test(t)), null, { timeout: 10000 }).catch(() => {});
        // the dashboard card: files and folders said apart, and the line that opens the panel on the names
        const card = await page.evaluate(() => { const c = document.getElementById('drvCardSlot'), f = c && c.querySelector('[data-drv-fix]'); const st = f && getComputedStyle(f);
            return { text: c ? c.innerText : '', fix: f ? f.innerText.trim() : '', px: st ? parseFloat(st.fontSize) : 0, w: st ? Number(st.fontWeight) : 0 }; });
        if (!/3 files and 1 folder to fix/.test(card.text)) fail(`the dashboard card should say files and folders apart ("3 files and 1 folder to fix"): "${card.text.slice(0, 160)}"`);
        if (!/^✗ 4 names to fix · 📂 Open My Backup Drive$/.test(card.fix) || card.px < 14 || card.w < 700) fail(`the dashboard card should carry "✗ 4 names to fix · 📂 Open My Backup Drive", at 14px bold or more: ${JSON.stringify(card)}`);
        // one toast for a list of names the trainee wasn't told about, and none for the same list again
        let said = await toasts();
        if (said.filter(t => /to fix on your Backup Drive/.test(t)).length !== 1 || !said.some(t => /3 files and 1 folder to fix/.test(t))) fail(`a new list of names to fix should be said in one toast: ${JSON.stringify(said)}`);
        await page.evaluate(() => CMDrive.grade(true));
        if ((await toasts()).length !== said.length) fail(`the same names to fix should not be said again on the next grade: ${JSON.stringify(await toasts())}`);
        // the card's line opens the panel on the report of the names
        const inView = () => page.waitForFunction(() => { const b = document.querySelector('#cmDriveHost .drv-body'), r = document.querySelector('#cmDriveHost .drv-nr'); if (!b || !r) return false;
            const top = r.getBoundingClientRect().top - b.getBoundingClientRect().top; return top > -4 && top < b.clientHeight / 2; }, null, { timeout: 5000 }).then(() => true).catch(() => false);
        await page.click('#drvCardSlot [data-drv-fix]');
        if (!(await inView())) fail('✗ N names to fix · 📂 Open My Backup Drive should open the panel on the list of names');
        // ✓ Check my drive: the folders are right and the names are not. The green line is not the only thing said
        await page.evaluate(() => { document.querySelector('#cmDriveHost .drv-body').scrollTop = 0; });
        await page.click('#cmDriveHost .drv-foot .drv-btn:has-text("Check my drive")');
        await page.waitForSelector('#cmDriveHost .drv-verdict .drv-good', { timeout: 10000 }).catch(() => {});
        const pv = await page.evaluate(async () => { const h = document.getElementById('cmDriveHost'), v = h && h.querySelector('.drv-verdict'); if (!v) return null;
            const good = v.querySelector('.drv-good'), jump = v.querySelector('.drv-nm-jump'), top = h.querySelector('.drv-head .drv-nm-jump'), nr = h.querySelector('.drv-nr'), nc = h.querySelector('.drv-nc');
            const type = (e) => { const c = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 30), px: parseFloat(c.fontSize), w: Number(c.fontWeight) }; };
            const small = [...h.querySelectorAll('.drv-nc *, .drv-nr *, .drv-nm-jump, .drv-g-row, .drv-g-row *, .drv-meta, .drv-meta *')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(type).filter(x => x.px < 14 || x.w < 700);
            const items = [...h.querySelectorAll('.drv-nr-it')].map(it => ({ bad: [...it.querySelectorAll('.drv-nr-bad')].map(e => e.textContent), good: [...it.querySelectorAll('.drv-nr-good')].map(e => e.textContent), free: (it.querySelector('.drv-nr-free') || {}).textContent || '', copy: (it.querySelector('[data-copy]') || { dataset: {} }).dataset.copy || '' }));
            const firstNote = (h.querySelector('.drv-g-row ul li') || {}).textContent || '';
            return { good: good ? good.innerText : '', jump: jump ? jump.innerText.trim() : '', beside: !!(good && jump && Math.abs(good.getBoundingClientRect().top - jump.getBoundingClientRect().top) < 12), top: top ? top.innerText.trim() : '',
                reportFirst: !!(nr && nc && (nr.compareDocumentPosition(nc) & Node.DOCUMENT_POSITION_FOLLOWING)), report: nr ? nr.innerText : '', items, small, firstNote, stored: await storeGet('drive-grades') }; });
        if (!pv) fail('after ✓ Check my drive the panel shows no verdict');
        else {
            if (!/Every folder is where it should be/.test(pv.good) || !/^🏷 3 files and 1 folder to fix ↓$/.test(pv.jump) || !pv.beside) fail(`with names wrong, the green "Every folder is where it should be" should have "🏷 3 files and 1 folder to fix ↓" beside it: ${JSON.stringify([pv.good, pv.jump, pv.beside])}`);
            if (!/3 files and 1 folder to fix/.test(pv.top)) fail(`the panel's head should say names are to fix, wherever the panel is scrolled: "${pv.top}"`);
            if (!pv.reportFirst) fail('the report of the names should come above the naming convention box');
            if (!/3 files and 1 folder to fix/.test(pv.report) || !/3 of 6 files/.test(pv.report) || !/1 folder/.test(pv.report)) fail(`the report should count files and folders apart: "${pv.report.slice(0, 200)}"`);
            if (!/1 of the 4 not counted in your grade/.test(pv.report)) fail(`the report should say how many of the names to fix the grade doesn't count (the Worker's unscored): "${pv.report.slice(0, 240)}"`);
            const [a, b, c, d] = pv.items;
            if (pv.items.length !== 4) fail(`the report should list the four wrong names: ${pv.items.length}`);
            else {
                if (a.bad.join('|') !== 'medical records|PDF' || a.good.join('|') !== 'Medical-Records|pdf') fail(`every differing piece should be marked in both names: ${JSON.stringify([a.bad, a.good])}`);
                if (b.bad.join('|') !== 'RS|05|Agreement' || b.good.join('|') !== `${CASE}|Doe-John|2026-07-01`) fail(`three differing pieces should all be marked: ${JSON.stringify([b.bad, b.good])}`);
                if (!/not counted in your grade/.test(b.free) || a.free || c.free) fail(`a copy the Worker doesn't score should be tagged "not counted in your grade", and only that one: ${JSON.stringify([a.free, b.free, c.free])}`);
                if (c.bad.length || c.good.join() !== 'DRAFT' || c.copy !== `${CASE}_Doe-John_Others_2026-11-12_DRAFT.pdf`) fail(`a missing label is marked in the name it should have only, which can be copied: ${JSON.stringify(c)}`);
                if (d.bad.join() !== 'doe john' || d.good.join() !== 'Doe-John') fail(`a folder's name is marked whole: ${JSON.stringify(d)}`);
            }
            if (pv.small.length) fail(`the panel's naming lines (the box, the report, the names-to-fix line, the day's rows, the weight) have type under 14px bold: ${JSON.stringify(pv.small.slice(0, 5))}`);
            if (!/^🏷/.test(pv.firstNote)) fail(`the day's notes in the panel should put the 🏷 File names note first: "${pv.firstNote.slice(0, 80)}"`);
            // the day's grade as it is kept for the Scorecard and the Batch Sheet: the File names row, and its note first
            const g2 = (pv.stored || {})[2] || {};
            if (!g2.names || g2.names.got !== 6 || g2.names.max !== 12 || g2.names.wrong !== 3) fail(`the stored day's grade should carry the Worker's names:{got,max,wrong} (3 charged, of the 4 to fix): ${JSON.stringify(g2.names)}`);
            if (!/^🏷/.test((g2.issues || [])[0] || '') || (g2.issues || []).length > 4) fail(`the stored day's issues should put the 🏷 File names note first: ${JSON.stringify(g2.issues)}`);
            const note = await page.evaluate((g) => { try { const r = cmScorecard.compute({ rec: {}, cf: { days: {} }, data: { 'drive-grades': g } }).rows.find(r => r.s.id === 'bd'); return (r.items.find(i => /Day 2/.test(i.name)) || {}).note || ''; } catch (e) { return 'error: ' + e.message; } }, pv.stored);
            if (!/🏷 File names 6\/12 · 3 names wrong/.test(note)) fail(`the Scorecard's note for the day should name the cause ("🏷 File names 6/12 · 3 names wrong"): "${note}"`);
        }
        await page.click('#cmDriveHost .drv-verdict .drv-nm-jump').catch(() => {});
        if (!(await inView())) fail('🏷 N names to fix ↓ should scroll the panel to the list of names');
        // the names are fixed: said once, and the red lines go
        fixed = true; said = await toasts();
        await page.evaluate(() => CMDrive.grade(true));
        const done = await page.evaluate(async () => ({ jumps: document.querySelectorAll('#cmDriveHost .drv-nm-jump').length, toasts: window.__ciToasts.slice(), stored: ((await storeGet('drive-grades')) || {})[2] || {} }));
        // a day sent as rows only (a Worker from before it sent `names`): the page reads the File names row itself
        if (!done.stored.names || done.stored.names.got !== 12 || done.stored.names.max !== 12 || done.stored.names.wrong !== 0) fail(`a day sent as rows only should still be kept with names:{got,max,wrong}, read from its File names row: ${JSON.stringify(done.stored.names)}`);
        if (done.jumps) fail('with every name right, the panel should show no names-to-fix line');
        if (done.toasts.length !== said.length + 1 || !/firm's way now/.test(done.toasts[done.toasts.length - 1])) fail(`names that were fixed should be said in one toast: ${JSON.stringify(done.toasts.slice(said.length))}`);
        await page.evaluate(() => CMDrive.close());
        await page.unroute('**/api/drive');
    }

    /* ---------- 3c. 🏷 the box never stays on "Loading…" ---------- */
    // A trainee's own status is refused here (the test server has no trainee tokens), and on this fresh page nothing has read
    // the Worker's "standard" yet: the box asks for it, and shows the rule. When the standard fails too, the box says so.
    for (const broken of [false, true]) {
        const p3 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
        p3.on('pageerror', e => fail(`page error (the 🏷 box): ${e.message}`));
        if (broken) await p3.route('**/api/drive', (route) => route.fulfill({ status: 500, contentType: 'application/json', body: JSON.stringify({ error: 'down' }) }));
        await p3.goto(BASE, { waitUntil: 'load' }); await p3.waitForTimeout(800);
        await signIn(p3, 'Dana', last + (broken ? 'z' : 'y'), 'B100926');
        await p3.evaluate(async () => { await CMDrive.reload(); document.body.insertAdjacentHTML('beforeend', '<div id="ciBox">' + CMDrive.namingBox({ day: 3, slide: true }) + '</div>'); });
        await p3.waitForFunction(() => !/Loading/.test((document.getElementById('ciBox') || {}).innerText || 'Loading'), null, { timeout: 8000 }).catch(() => {});
        const t = await p3.evaluate(() => document.getElementById('ciBox').innerText);
        if (/Loading/.test(t)) fail(`the 🏷 box stays on "Loading…" for a trainee whose status call ${broken ? 'and the standard both failed' : 'was refused'}: "${t.slice(0, 120)}"`);
        else if (!broken && !t.includes(PATTERN)) fail(`a trainee whose status call was refused should get the naming rule from the Worker's standard: "${t.slice(0, 160)}"`);
        else if (broken && !/couldn't be loaded/.test(t)) fail(`with the status and the standard both failing, the 🏷 box should say it couldn't be loaded: "${t.slice(0, 160)}"`);
        await p3.close();
    }

    /* ---------- 4. 🔗 step 1 is where the drive is linked ---------- */
    {
        const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
        const EMAIL = 'dana<img src=x onerror="window.__xss=1">@example.com', ROOT = 'https://drive.google.com/drive/folders/ci-root';
        const calls = []; let gsi = 0, linked = false, refuse = '', built = false, report = null;
        const CASE = 'LSH-2026-MVA-000041', CLEAN = { at: '2026-11-12T12:00:00.000Z', checked: 6, named: 6, wrong: 0, wrongFiles: 0, wrongFolders: 0, list: [] };
        const WRONG = { at: '2026-11-12T12:00:00.000Z', checked: 6, named: 3, wrong: 4, wrongFiles: 3, wrongFolders: 1, list: [{ kind: 'file', folder: '03 Medical Records', name: `${CASE}_John-Doe_Medical-Records_2026-11-10.pdf`, want: `${CASE}_Doe-John_Medical-Records_2026-11-10.pdf`, scored: true, issues: [{ n: 2, part: 'Last-First', got: 'John-Doe', should: 'Doe-John' }], hint: 'Look at part 2 (Last-First).' }] };
        const driveOf = () => ({ drive: { configured: true, clientId: 'ci-client.apps.googleusercontent.com', scopes: 'openid email https://www.googleapis.com/auth/drive.file', standard: (std || {}).standard || [], why: (std || {}).why || {}, homes: {}, root: (std || {}).root || '',
            connected: linked, email: linked ? EMAIL : '', rootUrl: linked ? ROOT : '', built, builtAt: built ? '2026-11-12T10:00:00.000Z' : null, checkedAt: built ? '2026-11-12T11:00:00.000Z' : null, lastMissing: [],
            setup: built ? { attempts: 1, ok: true, score: 100, problems: [] } : null, saved: built ? [{ folder: '03 Medical Records', name: 'x.pdf' }] : [], grades: {}, gradedAt: null, drills: ['2'],
            naming: Object.assign({}, (std || {}).naming, { caseId: CASE, report }) } });
        await ctx.route('**/api/drive', (route) => {
            let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* no body */ }
            calls.push(b);
            const send = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
            if (b.action === 'standard') return send(200, { standard: Object.assign({}, std, { configured: true }) });
            if (b.action === 'connect') {
                if (refuse) { const code = refuse; refuse = ''; return send(400, { error: "Google Drive access wasn't ticked on Google's screen.", code }); }
                linked = true;
            }
            return send(200, driveOf());
        });
        // Google's sign-in script, answered here: what the page asked it for is kept, and the test answers as Google would
        await ctx.route('https://accounts.google.com/**', (route) => { gsi++; route.fulfill({ status: 200, contentType: 'text/javascript', body:
            'window.__gis = { inits: 0, requests: 0, cfg: null }; window.google = { accounts: { oauth2: { initCodeClient(cfg) { __gis.inits++; __gis.cfg = cfg; return { requestCode() { __gis.requests++; } }; } } } };' }); });
        const p2 = await ctx.newPage();
        p2.on('pageerror', e => fail(`page error (linking): ${e.message}`));
        await p2.goto(BASE, { waitUntil: 'load' }); await p2.waitForTimeout(800);
        await p2.addStyleTag({ content: '#ktLogin{display:none!important}' });   // a trainee's 🔔 open-your-tools prompt, never over the slide being measured
        await signIn(p2, 'Dana', last + 'x', 'B100926');
        const openSlide = (pg) => pg.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove();
            const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
            const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === 'd1m1-drive' && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'case');
            goToSlide(k); document.getElementById('lessonSlideWrap').__kept = true; return k; });
        // step 1 as it stands: its text, the button, the line under it; whether the slide is the one first drawn (the page not
        // rendered again, the deck not moved); type under 16px or lighter than bold; and how much of the slide is cut off
        const look = (pg) => pg.evaluate(async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            const s = document.querySelector('.drv-slide'), wrap = document.getElementById('lessonSlideWrap'); if (!s) return null;
            const li = [...s.querySelectorAll('.drv-s-steps > li')], one = li[0], btn = s.querySelector('[data-drv-link]'), open = s.querySelector('.drv-s-open'), build = s.querySelector('[data-drv-build]');
            const body = wrap && wrap.querySelector('.cfx-deck > .cfx-body'), box = body && (body.querySelector(':scope > .cfx-sheet') || body);
            const type = (min) => [...s.querySelectorAll('*')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => { const c = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 30), px: parseFloat(c.fontSize), w: Number(c.fontWeight), mine: !!e.closest('.drv-s-act, .drv-s-err') }; }).filter(x => x.px < 16 || x.w < (x.mine ? 700 : min));
            return { text: s.innerText, one: one ? one.innerText : '', done: !!(one && one.classList.contains('is-done')), n: one ? one.querySelector('.drv-s-n').textContent : '',
                btn: btn ? { text: btn.innerText.trim(), disabled: btn.disabled, inOne: !!(one && one.contains(btn)), logo: !!btn.querySelector('svg'), w: Math.round(btn.getBoundingClientRect().width) } : null,
                err: (s.querySelector('.drv-s-err') || {}).innerText || '', errInOne: !!(one && one.querySelector('.drv-s-err')),
                open: open ? { href: open.getAttribute('href'), target: open.target, rel: open.rel, text: open.innerText.trim(), inOne: !!(one && one.contains(open)) } : null,
                build: build ? { text: build.innerText.trim(), inTwo: !!(li[1] && li[1].contains(build)) } : null, img: s.querySelectorAll('img').length, xss: !!window.__xss,
                kept: !!(wrap && wrap.__kept), at: state.lessonSlide, panel: !!document.getElementById('cmDriveHost'),
                small: type(600), cut: Math.max(wrap ? wrap.scrollHeight - wrap.clientHeight : 0, box ? box.scrollHeight - box.clientHeight : 0),
                below: Math.round((document.getElementById('lessonStage') || wrap).getBoundingClientRect().bottom + window.scrollY - innerHeight) };
        });
        const sound = (v, what) => {   // (e) the type, and the fit at 1366x768
            if (v.small.length) fail(`${what}: the slide has type under 16px bold: ${JSON.stringify(v.small.slice(0, 5))}`);
            if (v.cut > 2) fail(`${what}: ${v.cut}px of the slide is cut off at 1366x768`);
            if (v.below > 1) fail(`${what}: the slide ends ${v.below}px below the screen at 1366x768`);
        };
        /* 5. 📐 the slide as it is sized at 1366x768: the smallest zoom under #lessonSlideWrap (1: nothing scaled down), text under
           16px once the zoom is counted (what is shown: not the inside of a closed list), what is cut off, the buttons that are
           not in plain view, the firm's folders Day 1's 🏷 card covers, and the lines the naming row takes */
        const FIT = async () => {
            if (document.fonts && document.fonts.ready) await document.fonts.ready;
            await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            const wrap = document.getElementById('lessonSlideWrap'); if (!wrap) return null;
            const zoomOf = (e) => { let z = 1; for (let n = e; n && n !== wrap.parentNode; n = n.parentNode) { const v = parseFloat(n.style && n.style.zoom); if (v) z *= v; } return z; };
            const shown = (e) => e.getClientRects().length > 0 && (!e.checkVisibility || e.checkVisibility({ contentVisibilityAuto: true, visibilityProperty: true }));
            const zooms = [...wrap.querySelectorAll('*')].map(e => parseFloat(e.style.zoom)).filter(z => z > 0 && z < 1);
            const tiny = [...wrap.querySelectorAll('*')].filter(e => shown(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
                .map(e => ({ t: e.textContent.trim().slice(0, 30), px: Math.round(parseFloat(getComputedStyle(e).fontSize) * zoomOf(e) * 10) / 10 })).filter(x => x.px < 16);
            const body = wrap.querySelector('.cfx-deck > .cfx-body'), box = body && (body.querySelector(':scope > .cfx-sheet') || body), wr = wrap.getBoundingClientRect();
            const plain = (b) => { const r = b.getBoundingClientRect(), top = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2);
                return r.width > 0 && r.top >= wr.top && r.bottom <= wr.bottom && r.left >= wr.left && r.right <= wr.right && (top === b || b.contains(top)); };
            const card = wrap.querySelector('.drv-nc-side'), cr = card && card.getBoundingClientRect(), row = wrap.querySelector('.drv-nc-s:not(.drv-nc-side) .drv-nc-r');
            return { zoom: zooms.length ? Math.min(...zooms) : 1, tiny, cut: Math.max(wrap.scrollHeight - wrap.clientHeight, box ? box.scrollHeight - box.clientHeight : 0),
                below: Math.round((wrap.closest('.lesson-stage') || wrap).getBoundingClientRect().bottom + window.scrollY - innerHeight),
                hidden: [...wrap.querySelectorAll('[data-drv-link], [data-drv-build]')].filter(b => !plain(b)).map(b => b.innerText.trim()),
                over: cr ? [...wrap.querySelectorAll('.drv-s-tree li b, .drv-s-root b')].filter(b => { const r = b.getBoundingClientRect(); return r.right > cr.left && r.left < cr.right && r.bottom > cr.top && r.top < cr.bottom; }).map(b => b.textContent) : [],
                lines: row ? new Set([...row.children].map(c => Math.round(c.getBoundingClientRect().top / 16))).size : 0,
                box: !!wrap.querySelector('.drv-nc'), fix: (wrap.querySelector('[data-drv-fix]') || {}).innerText || '' };
        };
        const sized = async (pg, what, o) => {
            const f = await pg.evaluate(FIT); o = o || {};
            if (!f) { fail(`${what}: no slide to measure`); return {}; }
            if (f.zoom < 1) fail(`${what}: the slide is scaled down at 1366x768 (zoom ${f.zoom} under #lessonSlideWrap): everything on it reads ${Math.round((1 - f.zoom) * 100)}% smaller`);
            if (!o.anyType && f.tiny.length) fail(`${what}: text under 16px at 1366x768: ${JSON.stringify(f.tiny.slice(0, 5))}`);
            if (f.cut > 2) fail(`${what}: ${f.cut}px of the slide is cut off at 1366x768`);
            if (f.below > 1) fail(`${what}: the slide ends ${f.below}px below the screen at 1366x768`);
            if (f.hidden.length) fail(`${what}: not in plain view on the slide: ${f.hidden.join(', ')}`);
            if (f.over.length) fail(`${what}: the 🏷 card covers part of the firm's standard: ${f.over.join(', ')}`);
            if (f.lines > 1) fail(`${what}: the 🏷 naming row takes ${f.lines} lines (it is one row, so it costs the slide no size)`);
            return f;
        };
        const openTask = (pg, n, view) => pg.evaluate(([n, view]) => { state.isAdmin = true; const d = DAYS.find(d => d.cf && d.cf.n === n); goto('day', d.id); state.dayViewMode = 'slides';
            const id = n === 1 ? 'd1m1-drive' : `d${n}-drive`, ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === id && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === view);
            if (k < 0) return false; goToSlide(k); return true; }, [n, view]);
        const gis = (pg) => pg.evaluate(() => window.__gis ? { inits: __gis.inits, requests: __gis.requests, cfg: __gis.cfg && { client_id: __gis.cfg.client_id, scope: __gis.cfg.scope, ux_mode: __gis.cfg.ux_mode } } : null);
        const writes = () => calls.filter(b => !['standard', 'status', undefined].includes(b.action)).map(b => b.action);

        // (a) a trainee: the button is in step 1, and Google's script was fetched when the slide was drawn
        const at = await openSlide(p2);
        await p2.waitForSelector('.drv-slide [data-drv-link]', { timeout: 10000 }).catch(() => {});
        await p2.waitForFunction(() => /09 Litigation & ADR/.test((document.querySelector('.drv-slide') || {}).innerText || '') && /Case ID/.test((document.querySelector('.drv-slide .drv-nc') || {}).innerText || '') && !!window.__gis, null, { timeout: 10000 }).catch(() => {});
        let v = await look(p2);
        if (!v || !v.btn) fail(`a trainee should have 🔗 Link my Google Drive on Day 1's slide: "${v ? v.one : 'no slide'}"`);
        else {
            if (!v.btn.inOne || !/^🔗 Link my Google Drive$/.test(v.btn.text) || v.btn.disabled) fail(`the button should be in step 1, reading 🔗 Link my Google Drive, ready to press: ${JSON.stringify(v.btn)}`);
            if (!v.btn.logo) fail("the button should carry the Google Drive logo");
            if (!/Link your Google Drive/.test(v.one) || /From 📂 My Backup Drive/.test(v.one) || !/button here/.test(v.one) || !/drive\.file only/.test(v.one) || !/nothing else/.test(v.one))
                fail(`step 1 should say to press the button here and that the platform asks for drive.file only: "${v.one}"`);
            if (v.done || v.n !== '1') fail('step 1 should not be ticked before the drive is linked');
            if (v.build) fail('📂 Build my folders should wait until the drive is linked');
            if (!gsi || !(await gis(p2))) fail("Google's sign-in script should be fetched when the slide is drawn, so the first press works");
            if (writes().length) fail(`drawing the slide should write nothing to /api/drive: ${writes()}`);
            sound(v, 'a trainee, not linked'); await sized(p2, "Day 1's slide, a trainee not linked");

            // (b) the first press starts Google's sign-in from the slide; the button reads Linking… until Google answers
            await p2.click('.drv-slide [data-drv-link]');
            let g = await gis(p2); v = await look(p2);
            if (!g || g.inits !== 1 || g.requests !== 1) fail(`pressing the button should call google.accounts.oauth2.initCodeClient(…).requestCode() once: ${JSON.stringify(g)}`);
            else if (g.cfg.ux_mode !== 'popup' || g.cfg.client_id !== 'ci-client.apps.googleusercontent.com' || !/auth\/drive\.file/.test(g.cfg.scope)) fail(`the sign-in should be the popup code flow, for the site's client and drive.file: ${JSON.stringify(g.cfg)}`);
            if (!v.btn || !/^Linking…$/.test(v.btn.text) || !v.btn.disabled) fail(`while linking, the button should read Linking… and be disabled: ${JSON.stringify(v.btn)}`);
            if (v.panel) fail('linking from the slide should not open the 📂 My Backup Drive panel');
            if (writes().length) fail(`nothing should be sent to /api/drive before Google hands a code back: ${writes()}`);
            // the trainee closes Google's window: a line in step 1, and the button works again
            await p2.evaluate(() => __gis.cfg.error_callback({ type: 'popup_closed' }));
            v = await look(p2);
            if (!v.errInOne || !/closed/.test(v.err)) fail(`a sign-in that was closed should be a line in step 1 of the slide: "${v.err}"`);
            if (!v.btn || v.btn.disabled || !/Link my Google Drive/.test(v.btn.text)) fail(`after a sign-in that didn't finish, the button should work again: ${JSON.stringify(v.btn)}`);
            sound(v, 'a trainee, after a sign-in that was closed'); await sized(p2, "Day 1's slide, after a sign-in that was closed");
            // the longest thing a failed sign-in says (two lines of step 1): the slide still isn't scaled down
            await p2.click('.drv-slide [data-drv-link]');
            await p2.evaluate(() => __gis.cfg.error_callback({ type: 'popup_failed_to_open' }));
            await sized(p2, "Day 1's slide, after a sign-in the browser blocked");
            // the Drive box left unticked on Google's screen: the Worker refuses it, and the slide says what to do
            refuse = 'DRIVE_SCOPE_MISSING';
            await p2.click('.drv-slide [data-drv-link]');
            await p2.evaluate(() => __gis.cfg.callback({ code: 'ci-code-unticked' }));
            await p2.waitForSelector('.drv-slide .drv-s-err', { timeout: 10000 }).catch(() => {});
            v = await look(p2);
            if (!v.errInOne || !/wasn't ticked/.test(v.err) || !v.btn || v.btn.disabled) fail(`a sign-in without Drive access should be a line in step 1, and the button should work again: "${v.err}" ${JSON.stringify(v.btn)}`);
            if (v.done) fail('a refused sign-in should not tick step 1');
            // and a full sign-in: the code Google hands back goes to the Worker as "connect"
            calls.length = 0;
            await p2.click('.drv-slide [data-drv-link]');
            await p2.evaluate(() => __gis.cfg.callback({ code: 'ci-code-123' }));
            await p2.waitForFunction(() => !!document.querySelector('.drv-slide .drv-s-steps > li.is-done'), null, { timeout: 10000 }).catch(() => {});
            const sent = calls.find(b => b.action === 'connect');
            if (!sent || sent.code !== 'ci-code-123') fail(`the code Google hands back should be sent to /api/drive as "connect": ${JSON.stringify(calls)}`);
            g = await gis(p2);
            if (g.requests !== 4) fail(`each press should start one sign-in: ${g.requests} for 4 presses`);

            // (c) linked: step 1 ticked, the email and Open my Drive ↗ in it, the button gone; step 2 offers 📂 Build my folders
            v = await look(p2);
            if (!v.done || v.n !== '✓') fail('once linked, step 1 should be ticked');
            if (v.btn) fail('once linked, 🔗 Link my Google Drive should be gone');
            if (v.err) fail(`once linked, the line about the earlier try should be gone: "${v.err}"`);
            if (!v.one.includes('Linked: ' + EMAIL)) fail(`once linked, step 1 should show the email: "${v.one}"`);
            if (v.img || v.xss) fail('the email is put on the slide unescaped');
            if (!v.open || v.open.href !== ROOT || v.open.target !== '_blank' || !/noopener/.test(v.open.rel) || !/noreferrer/.test(v.open.rel) || !/Open my Drive/.test(v.open.text) || !v.open.inOne) fail(`once linked, step 1 should link to the drive's folder in a new tab: ${JSON.stringify(v.open)}`);
            if (!v.build || !v.build.inTwo || !/Build my folders/.test(v.build.text)) fail(`once linked, step 2 should offer 📂 Build my folders: ${JSON.stringify(v.build)}`);
            if (!v.kept || v.at !== at) fail(`the slide should redraw itself in place: the page was rendered again or the deck moved (slide ${v.at}, was ${at})`);
            sound(v, 'a trainee, linked'); await sized(p2, "Day 1's slide, a trainee linked");
            if (v.build) {
                await p2.click('.drv-slide [data-drv-build]');
                if (!(await p2.locator('#cmDriveHost .drv-tree').count())) fail('📂 Build my folders should open the Backup Drive panel on the folders to build');
                await p2.evaluate(() => CMDrive.close());
            }
        }

        // (5) linked and built, then with names to fix; and each later day's task, as a trainee and as a trainer
        const asTrainee = (pg) => pg.evaluate(() => { state.isAdmin = false; return CMDrive.reload(); });
        linked = true; built = true; report = CLEAN;
        await asTrainee(p2); await openSlide(p2);
        await p2.waitForFunction(() => document.querySelectorAll('.drv-slide .drv-s-steps > li.is-done').length >= 3 && /Case ID/.test((document.querySelector('.drv-slide .drv-nc') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
        let f = await sized(p2, "Day 1's slide, a trainee linked and built");
        if (f.fix) fail(`with every name right, Day 1's slide should not say names are to fix: "${f.fix}"`);
        report = WRONG; await asTrainee(p2);
        await p2.waitForSelector('.drv-slide [data-drv-fix]', { timeout: 10000 }).catch(() => {});
        f = await sized(p2, "Day 1's slide, a trainee with names to fix");
        if (!/^✗ 4 names to fix · 📂 Open My Backup Drive$/.test((f.fix || '').trim())) fail(`with names wrong, Day 1's slide should carry "✗ 4 names to fix · 📂 Open My Backup Drive": "${f.fix}"`);
        for (const n of [2, 3, 4, 5]) {
            // a trainee (the day is opened as a trainer opens it, then drawn again as the trainee's own)
            report = CLEAN;
            if (!(await openTask(p2, n, 'task'))) { fail(`Day ${n} has no Your Task slide for Backup File Maintenance`); continue; }
            await asTrainee(p2);
            await p2.waitForFunction(() => /Case ID/.test((document.querySelector('#lessonSlideWrap .drv-nc') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
            f = await sized(p2, `Day ${n}'s task, a trainee`);
            if (!f.box) fail(`Day ${n}'s task has no 🏷 naming row for a trainee`);
            report = WRONG; await asTrainee(p2);
            await p2.waitForSelector('#lessonSlideWrap [data-drv-fix]', { timeout: 10000 }).catch(() => {});
            f = await sized(p2, `Day ${n}'s task, a trainee with names to fix`);
            if (!/^✗ 4 names to fix · 📂 Open My Backup Drive$/.test((f.fix || '').trim())) fail(`with names wrong, Day ${n}'s task should carry "✗ 4 names to fix · 📂 Open My Backup Drive": "${f.fix}"`);
            // a trainer
            await openTask(p2, n, 'task');
            await p2.waitForFunction(() => /Case ID/.test((document.querySelector('#lessonSlideWrap .drv-nc') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
            f = await sized(p2, `Day ${n}'s task, a trainer`);
            if (f.fix) fail(`a trainer's slide should not show a trainee's names to fix (Day ${n}): "${f.fix}"`);
        }
        // Day 1's own Your Task slide has no room for the row at full size: it is as it was (the convention is on Your Case), and not scaled down
        if (await openTask(p2, 1, 'task')) await sized(p2, "Day 1's Your Task slide", { anyType: true });
        report = null; built = false;
        await asTrainee(p2); await openSlide(p2);

        // (d) a trainer: the same button, as a sample. Pressing it asks nothing of Google and writes nothing to /api/drive
        const sample = async (pg, who) => {
            await pg.waitForSelector('.drv-slide [data-drv-link]', { timeout: 10000 }).catch(() => {});
            await pg.waitForFunction(() => /Case ID/.test((document.querySelector('.drv-slide .drv-nc') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
            const w = await look(pg);
            if (!w || !w.btn || !w.btn.inOne || !/^🔗 Link my Google Drive$/.test(w.btn.text) || w.btn.disabled || !w.btn.logo) { fail(`${who} should see the same 🔗 Link my Google Drive in step 1, as a sample: ${JSON.stringify(w && w.btn)}`); return; }
            if (w.done || /Linked:/.test(w.one) || w.build) fail(`${who} should not be shown a trainee's own link: "${w.one}"`);
            sound(w, who); await sized(pg, `Day 1's slide, ${who}`);
            await pg.waitForTimeout(900);   // the page's own first reads (the standard, a status) are done: what follows is the press's
            calls.length = 0; const g0 = gsi, i0 = ((await gis(pg)) || { inits: 0 }).inits;
            await pg.click('.drv-slide [data-drv-link]'); await pg.waitForTimeout(400);
            // said where it can be seen: the toast, or in the slides window (which shows nothing but the slide) that window's own hint
            const toast = await pg.evaluate(() => { const seen = (e) => !!e && e.getClientRects().length > 0 && getComputedStyle(e).visibility !== 'hidden';
                const t = document.getElementById('toast'), a = document.querySelector('.drv-aud-say'); return seen(t) && t.classList.contains('show') ? t.textContent : seen(a) ? a.textContent : ''; });
            if (!/Trainees link their own Google Drive/.test(toast)) fail(`${who} pressing the sample should be told, where it can be seen, that trainees link their own drive: "${toast}"`);
            if (calls.length) fail(`${who} pressing the sample sent ${calls.length} /api/drive request(s): ${JSON.stringify(calls)}`);
            if (gsi !== g0 || ((await gis(pg)) || { inits: 0 }).inits !== i0) fail(`${who} pressing the sample called Google`);
            const after = await look(pg);
            if (!after.btn || after.btn.disabled || after.panel) fail(`${who} pressing the sample should leave the slide as it was: ${JSON.stringify(after.btn)}`);
        };
        await p2.evaluate(() => { state.isAdmin = true; render(); });
        await sample(p2, 'a trainer');
        // 🖥 Presenter view: the slides window the trainer shares carries the sample too
        const popup = ctx.waitForEvent('page', { timeout: 10000 }).catch(() => null);
        await p2.evaluate(() => presenterStart());
        const aud = await popup;
        if (!aud) fail('🖥 Presenter view did not open its slides window');
        else { aud.on('pageerror', e => fail(`page error (slides window): ${e.message}`)); await aud.waitForLoadState('load'); await sample(aud, 'the slides window'); }
        await p2.evaluate(() => presenterEnd(true)).catch(() => {});
        await ctx.close();
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Day 1\'s case backup is the Backup Drive: the slide carries its four steps and the firm\'s standard, and the retired case folder stays gone.');
    console.log('🏷 The naming convention is on Day 1\'s slide, every Backup File Maintenance task and the Backup Drive panel, which lists each wrong name with the part that differs.');
    console.log('🔗 Step 1 of Day 1\'s slide links the drive: a trainee\'s press starts Google\'s sign-in and the code goes to the Worker; linked, it shows the email; a trainer\'s button is a sample.');
    console.log('📐 At 1366x768 none of the Backup File Maintenance slides is scaled down, in any state: no zoom under #lessonSlideWrap, no text under 16px, nothing cut off.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
