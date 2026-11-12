// The Trainee Audit is one table (js/cm-audit-table.js): Admin → 🛡 Admin Master Control → Trainee Audit.
// 1. one row per trainee in #adminRowsWrap (renderAdminRows keeps its name), with the columns a trainer scans
//    (name & ID, batch, status, where they are and last active, Days 1–5, Knowledge Checks, lessons, Skill Builder,
//    random tasks, feedback & Focus, Drive, companion case), pending registrations pinned on top with Approve / Reject;
// 2. the old scattered pieces are gone: the stat tiles, the Pending Approvals panel, the batch folder cards and
//    sub-tabs, the old filter bar and the row's loose buttons (View Detail, ✍ Feedback, 🎓 Certificate, ↺ Reset, Revoke);
//    the settings (signatories, feedback auto-draft, 🎲 Random Task Injection) are folded into one ⚙ section, still there;
// 3. one filter bar: search by name or ID, Batch, Status (Archived / Rejected / All), Needs attention chips (their counts
//    follow the progress as it loads); 💬 Batch feedback stays put when the progress reloads; a column's header sorts it;
// 4. ⋯ holds every action and each one works: assign a companion case (js/cm-companion.js's picker), reset Skill Builder
//    attempts, archive and restore the trainee, reject, approve, revoke; 👁 Detail opens the full record under the row;
//    ⬇ Download CSV gives the table;
// 5. it reads at 14px or more (the detail panel under a row is the existing one), and a phone doesn't scroll the page sideways.
// Usage: node .github/scripts/trainee-audit.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
const A = 'TA' + tag.toUpperCase(), B = 'TB' + tag.toUpperCase();
const now = new Date().toISOString();
const T = {
    pend: { id: `pia-pend-${tag}--a`, name: `Pia Pend ${tag}`, batch: A, registeredAt: now },
    ok: { id: `oscar-ok-${tag}--a`, name: `Oscar Ok ${tag}`, batch: A, approved: true, lastActive: now, labAttemptsGlobal: 2, labResetRequestedAt: now,
        dayProgress: { 11: { done: true, score: 92 }, 12: { done: false, score: 55 } } },
    zed: { id: `zed-ok-${tag}--a`, name: `Zed Ok ${tag}`, batch: A, approved: true },
    rej: { id: `rita-rej-${tag}--a`, name: `Rita Rej ${tag}`, batch: A, rejected: true, approved: false },
    old: { id: `olga-arch-${tag}--b`, name: `Olga Arch ${tag}`, batch: B, approved: true, archived: true }
};

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 }, acceptDownloads: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    page.on('dialog', d => d.accept());
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(1200);
    await page.evaluate(async (T) => { for (const r of Object.values(T)) await sharedSet('trainee:' + r.id, r); }, T);
    const open = async () => {
        await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); state.isAdmin = true; state.adminData = null; state.adminTab = 'audit'; goto('admin'); render(); });
        await page.waitForSelector('#adminRowsWrap .at-table', { timeout: 15000 });
    };
    const rows = () => page.evaluate(() => [...document.querySelectorAll('#adminRowsWrap .at-row')].map(r => r.dataset.id));
    const rec = (id) => page.evaluate((id) => sharedGet('trainee:' + id), id);
    await open();
    // the batch, so other checks' trainees on the same server stay out of it
    await page.selectOption('#atBatch', A); await page.waitForSelector('#adminRowsWrap .at-table');
    await page.waitForTimeout(1500);   // the exact progress (auditExtras) loads

    // 1. one table, one row per current trainee, pending pinned on top
    let ids = await rows();
    if (ids.length !== 3 || ids[0] !== T.pend.id || !ids.includes(T.ok.id) || !ids.includes(T.zed.id)) fail(`Current should list the pending and the active trainees, pending first: ${JSON.stringify(ids)}`);
    const heads = await page.$$eval('.at-table thead th', ths => ths.map(t => t.textContent.replace(/[▲▼↕]/g, '').trim()));
    for (const h of ['Trainee', 'Batch', 'Status', 'Now · last active', 'Days 1–5', 'Knowledge Checks', 'Lessons', 'Skill Builder', 'Random tasks', 'Feedback · Focus', 'Drive', 'Companion case', 'Actions'])
        if (!heads.some(x => x.includes(h))) fail(`the table has no "${h}" column: ${heads.join(' | ')}`);
    const okRow = await page.locator(`.at-row[data-id="${T.ok.id}"]`).innerText();
    if (!/92%|74%/.test(okRow) || !/below 70%: Day 2/.test(okRow) || !/1\/5 passed/.test(okRow)) fail(`the row should show the Knowledge Checks and days, as Case Flow days: ${okRow.replace(/\s+/g, ' ')}`);
    if (!/Asked/.test(okRow) || !/2 of 3 repeats used/.test(okRow)) fail(`the row should show the Skill Builder request and attempts used: ${okRow.replace(/\s+/g, ' ')}`);
    const pendRow = page.locator(`.at-row[data-id="${T.pend.id}"]`);
    if ((await pendRow.locator('button', { hasText: 'Approve' }).count()) !== 1 || (await pendRow.locator('button', { hasText: 'Reject' }).count()) !== 1) fail('a pending row should carry Approve and Reject in its Status cell');
    const btnTexts = await page.$$eval(`.at-row[data-id="${T.zed.id}"] button`, bs => bs.map(b => b.textContent.trim()));
    if (btnTexts.length > 3) fail(`an active row should have only its name, 👁 Detail and ⋯: ${JSON.stringify(btnTexts)}`);
    if (btnTexts.some(t => /Feedback|Certificate|Reset|Revoke/.test(t))) fail(`the row still has loose buttons: ${JSON.stringify(btnTexts)}`);

    // 2. the old pieces are gone, the settings are kept in one fold
    const page1 = await page.evaluate(() => ({
        stat: !!document.querySelector('.stat-row'), pendPanel: /Pending Approvals/.test(document.body.innerText), cards: !!document.querySelector('.batch-folder'),
        sub: !!document.querySelector('.bf-tabs'), oldSearch: !!document.getElementById('adminSearchInput'), strips: !!document.querySelector('.audit-strip'),
        sets: ['certTrainer', 'certNameFmt', 'fbAutoDraft', 'surpriseTaskDaySelect', 'surpriseTaskDuration'].filter(id => !(document.getElementById(id) && document.getElementById(id).closest('#atSettings'))),
        wraps: document.querySelectorAll('#adminRowsWrap').length, table: typeof renderAdminRows === 'function' && /class="at-table"/.test(renderAdminRows())
    }));
    if (page1.stat || page1.pendPanel || page1.cards || page1.sub || page1.oldSearch || page1.strips) fail(`old pieces still on the page: ${JSON.stringify(page1)}`);
    if (page1.sets.length) fail(`settings missing from the ⚙ fold: ${page1.sets.join(', ')}`);
    if (page1.wraps !== 1 || !page1.table) fail(`renderAdminRows should draw the table into the one #adminRowsWrap: ${JSON.stringify(page1)}`);

    // the "Needs attention" counts follow the progress that loads after the page is drawn (a partial redraw)
    await page.evaluate(() => { state.auditExtra = {}; render(); }); await page.waitForTimeout(1800);
    if (!(await page.locator('.at-chip:has-text("Below 70%")').count())) fail('the "📉 Below 70%" chip should appear once the progress loads, without a full redraw');
    // 💬 Batch feedback stays the batch's feedback when the progress reloads (it isn't swapped for the old registry rows)
    await page.click('button:has-text("Batch feedback")'); await page.waitForSelector('.at-fb');
    await page.evaluate(() => loadAuditExtras(true)); await page.waitForTimeout(1200);
    if (await page.locator('.at-fb .audit-row').count()) fail('the 💬 Batch feedback panel turned into the old registry rows after the progress reloaded');
    await page.click('.at-fb button:has-text("Close")'); await page.waitForTimeout(200);

    // 3. filters and sorting
    await page.fill('#atSearch', T.zed.id); await page.waitForTimeout(200);
    ids = await rows(); if (ids.length !== 1 || ids[0] !== T.zed.id) fail(`search by ID: ${JSON.stringify(ids)}`);
    if (await page.evaluate(() => document.activeElement && document.activeElement.id) !== 'atSearch') fail('typing in the search lost its place');
    await page.fill('#atSearch', ''); await page.waitForTimeout(200);
    await page.click('.at-chip:has-text("Asked for attempts")'); await page.waitForSelector('#adminRowsWrap .at-table');
    ids = await rows(); if (ids.length !== 1 || ids[0] !== T.ok.id) fail(`the 🙋 chip should show who asked for attempts: ${JSON.stringify(ids)}`);
    await page.click('.at-chip:has-text("Asked for attempts")');
    await page.selectOption('#atStatus', 'rejected'); await page.waitForTimeout(200);
    ids = await rows(); if (ids.length !== 1 || ids[0] !== T.rej.id) fail(`Status: Rejected: ${JSON.stringify(ids)}`);
    await page.selectOption('#atBatch', B); await page.selectOption('#atStatus', 'archived'); await page.waitForTimeout(200);
    ids = await rows(); if (ids.length !== 1 || ids[0] !== T.old.id) fail(`Status: Archived in the other batch: ${JSON.stringify(ids)}`);
    if (!(await page.locator('button:has-text("Restore batch")').count())) fail('a batch with archived trainees should offer ↩ Restore batch');
    await page.selectOption('#atBatch', A); await page.selectOption('#atStatus', 'current'); await page.waitForTimeout(200);
    await page.click('.at-sort:has-text("Trainee")'); await page.waitForTimeout(150);
    ids = await rows(); if (ids.join() !== [T.pend.id, T.ok.id, T.zed.id].join()) fail(`sorted by name A–Z (pending stays on top): ${JSON.stringify(ids)}`);
    await page.click('.at-sort:has-text("Trainee")'); await page.waitForTimeout(150);
    ids = await rows(); if (ids.join() !== [T.pend.id, T.zed.id, T.ok.id].join()) fail(`sorted by name Z–A: ${JSON.stringify(ids)}`);

    // 4. ⋯: every action, and they work
    const menu = async (id) => { await page.click(`.at-row[data-id="${id}"] .at-more`); await page.waitForSelector('#atMenu'); return page.locator('#atMenu'); };
    let m = await menu(T.ok.id);
    const mt = await m.innerText();
    for (const w of ['View detail', 'Write feedback', 'Certificate', 'Scorecard', 'Reset Skill Builder attempts', 'Check Backup Drive', 'Archive trainee', 'Reject registration', 'Revoke', 'corrected copies'])
        if (!mt.includes(w)) fail(`the ⋯ menu has no "${w}"`);
    const caseId = await page.evaluate(() => Object.keys(window.CM_COMPANION_CASES || {})[0]);
    if (!caseId) fail('no companion cases to assign');
    else {
        await m.locator('select.cc-assign').selectOption(caseId); await page.waitForTimeout(800);
        const r = await rec(T.ok.id);
        if (!r.assignedCase || r.assignedCase.id !== caseId) fail(`📁 assign from ⋯ didn't save: ${JSON.stringify(r.assignedCase)}`);
        const cell = await page.locator(`.at-row[data-id="${T.ok.id}"] .at-case`).innerText().catch(() => '');
        if (!cell.includes(r.assignedCase && r.assignedCase.title)) fail(`the Companion case column should name it: "${cell}"`);
    }
    m = await menu(T.ok.id); await m.locator('button', { hasText: 'Reset Skill Builder attempts' }).click(); await page.waitForTimeout(800);
    let r = await rec(T.ok.id); if (r.labAttemptsGlobal !== 0 || r.labResetRequestedAt) fail(`↺ Reset from ⋯: ${JSON.stringify({ g: r.labAttemptsGlobal, a: r.labResetRequestedAt })}`);
    m = await menu(T.zed.id); await m.locator('button', { hasText: 'Archive trainee' }).click(); await page.waitForTimeout(800);
    if (!(await rec(T.zed.id)).archived) fail('📦 Archive trainee didn\'t archive');
    if ((await rows()).includes(T.zed.id)) fail('an archived trainee is still in Current');
    await page.selectOption('#atStatus', 'archived'); await page.waitForTimeout(200);
    m = await menu(T.zed.id); await m.locator('button', { hasText: 'Restore trainee' }).click(); await page.waitForTimeout(800);
    if ((await rec(T.zed.id)).archived) fail('↩ Restore trainee didn\'t restore');
    await page.selectOption('#atStatus', 'current'); await page.waitForTimeout(200);
    await page.locator(`.at-row[data-id="${T.pend.id}"] button`, { hasText: 'Approve' }).click(); await page.waitForTimeout(1200);
    if ((await rec(T.pend.id)).approved !== true) fail('Approve in the Status cell didn\'t approve');
    m = await menu(T.pend.id); await m.locator('button', { hasText: 'Reject registration' }).click(); await page.waitForTimeout(1200);
    if (!(await rec(T.pend.id)).rejected) fail('Reject from ⋯ didn\'t reject');
    await page.selectOption('#atStatus', 'rejected'); await page.waitForTimeout(200);
    m = await menu(T.pend.id); await m.locator('button', { hasText: 'Approve' }).click(); await page.waitForTimeout(1200);
    r = await rec(T.pend.id); if (r.approved !== true || r.rejected) fail('Approve from ⋯ didn\'t approve a rejected trainee');
    await page.keyboard.press('Escape');
    await page.selectOption('#atStatus', 'current'); await page.waitForTimeout(200);
    // 👁 Detail: the full record under the row; Escape closes the menu
    await page.locator(`.at-row[data-id="${T.ok.id}"] .at-acts .btn`).first().click(); await page.waitForTimeout(600);
    const det = await page.locator(`.at-row[data-id="${T.ok.id}"] + .at-detail-row`).innerText().catch(() => '');
    if (!/Corrected Copies|Day-by-Day/i.test(det)) fail(`👁 Detail should open the trainee's record under the row: "${det.slice(0, 120)}"`);
    m = await menu(T.ok.id); await page.keyboard.press('Escape'); await page.waitForTimeout(100);
    if (await page.locator('#atMenu').count()) fail('Escape should close the ⋯ menu');
    // ⬇ Download CSV
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('button:has-text("Download CSV")')]);
    if (!dl) fail('⬇ Download CSV gave no file');
    else { const fs = require('fs'); const text = fs.readFileSync(await dl.path(), 'utf8'); if (!/Name,ID,Batch,Status/.test(text) || !text.includes(T.ok.id)) fail(`the CSV should be the table: ${text.slice(0, 160)}`); }
    // 🗑 Revoke & delete, set apart at the bottom of ⋯
    m = await menu(T.zed.id); await m.locator('button', { hasText: 'Revoke' }).click(); await page.waitForTimeout(1500);
    if (await rec(T.zed.id)) fail('🗑 Revoke from ⋯ didn\'t delete the registration');

    // 5. readable, and no sideways page on a phone
    const small = await page.evaluate(() => [...document.querySelectorAll('#cmAuditTable *, .at-head *')].filter(n => !n.closest('.at-detail-row') && n.childNodes.length && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && n.offsetParent && parseFloat(getComputedStyle(n).fontSize) < 14).map(n => n.tagName + '.' + n.className + ': ' + n.textContent.trim().slice(0, 30)).slice(0, 5));
    if (small.length) fail(`text under 14px: ${JSON.stringify(small)}`);
    await page.setViewportSize({ width: 390, height: 800 }); await page.waitForTimeout(400);
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail('on a phone the page scrolls sideways (the table should scroll inside its box)');

    await page.evaluate(async (T) => { for (const r of Object.values(T)) await sharedDelete('trainee:' + r.id); }, T);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('The Trainee Audit is one table: one row per trainee, pending on top with Approve / Reject, filters and sortable columns at the top, every action in ⋯ (and each one works), the settings in one fold, the old tiles, panels, cards and loose buttons gone.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
