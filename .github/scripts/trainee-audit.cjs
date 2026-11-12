// The Trainee Audit is one table (js/cm-audit-table.js): Admin → 🛡 Admin Master Control → 👥 Trainee Audit (tab 'traineeaudit').
// 1. one row per trainee in #adminRowsWrap (renderAdminRows keeps its name), with the columns a trainer scans
//    (name & ID, batch, status, where they are and last active, Days 1–5, Knowledge Checks, lessons, Skill Builder,
//    random tasks, feedback & Focus, Drive), pending registrations pinned on top;
// 2. the row: the trainee's NAME opens / closes their detail (✍ Write feedback, 🎓 Certificate, 🏅 Scorecard head it);
//    ↺ Reset Attempts sits beside the name; the Actions are plain buttons: Approve / Reject for anyone waiting, Approve for
//    a rejected one, Revoke; no View / Hide Detail, ✍ Feedback, 🎓 Certificate, ⋯ or 📁 case picker in the row;
// 3. one filter bar: search by name or ID, Batch, Status (Archived / Rejected / All), Needs attention chips (their counts
//    follow the progress as it loads); 💬 Batch feedback stays put when the progress reloads; a column's header sorts it;
//    the old pieces (stat tiles, Pending Approvals panel, batch folder cards, the settings) are not on the page;
// 4. every action works: reset, reject, approve, revoke; ⬇ Download CSV gives the table;
// 5. 📁 Companion Cases is its own table (🛡 → 📁 Companion Cases): the case picker in each trainee's row saves the case;
// 6. it reads at 14px or more, bold, and a phone doesn't scroll the page sideways.
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
    const open = async (tab) => {
        await page.evaluate((tab) => { const o = document.getElementById('ktLogin'); if (o) o.remove(); state.isAdmin = true; state.adminData = null; state.adminTab = tab; goto('admin'); render(); }, tab || 'traineeaudit');
        await page.waitForSelector(tab === 'companion' ? '#ccTable' : '#adminRowsWrap .at-table', { timeout: 15000 });
    };
    const rows = () => page.evaluate(() => [...document.querySelectorAll('#adminRowsWrap .at-row')].map(r => r.dataset.id));
    const rec = (id) => page.evaluate((id) => sharedGet('trainee:' + id), id);
    const row = (id) => page.locator(`.at-row[data-id="${id}"]`);
    await open();
    if (!(await page.evaluate(() => document.querySelector('.cmsh-sec.active') && /Admin Master Control/.test(document.querySelector('.cmsh-sec.active').textContent)))) fail('👥 Trainee Audit should be under 🛡 Admin Master Control');
    // the batch, so other checks' trainees on the same server stay out of it
    await page.selectOption('#atBatch', A); await page.waitForSelector('#adminRowsWrap .at-table');
    await page.waitForTimeout(1500);   // the exact progress (auditExtras) loads

    // 1. one table, one row per current trainee, pending pinned on top
    let ids = await rows();
    if (ids.length !== 3 || ids[0] !== T.pend.id || !ids.includes(T.ok.id) || !ids.includes(T.zed.id)) fail(`Current should list the pending and the active trainees, pending first: ${JSON.stringify(ids)}`);
    const heads = await page.$$eval('.at-table thead th', ths => ths.map(t => t.textContent.replace(/[▲▼↕]/g, '').trim()));
    for (const h of ['Trainee', 'Batch', 'Status', 'Now · last active', 'Days 1–5', 'Knowledge Checks', 'Lessons', 'Skill Builder', 'Random tasks', 'Feedback · Focus', 'Drive', 'Actions'])
        if (!heads.some(x => x.includes(h))) fail(`the table has no "${h}" column: ${heads.join(' | ')}`);
    if (heads.some(x => /Companion/.test(x))) fail('the companion case is the 📁 Companion Cases table\'s, not a Trainee Audit column');
    const okRow = await row(T.ok.id).innerText();
    if (!/92%|74%/.test(okRow) || !/below 70%: Day 2/.test(okRow) || !/1\/5 passed/.test(okRow)) fail(`the row should show the Knowledge Checks and days, as Case Flow days: ${okRow.replace(/\s+/g, ' ')}`);
    if (!/Asked for more attempts/.test(okRow) || !/2 of 3 repeats used/.test(okRow)) fail(`the row should show the Skill Builder request and attempts used: ${okRow.replace(/\s+/g, ' ')}`);

    // 2. the row's buttons: the name, ↺ Reset beside it, plain Approve / Reject / Revoke in Actions, nothing else
    const shape = (id) => page.evaluate((id) => { const r = document.querySelector(`.at-row[data-id="${id}"]`); if (!r) return null;
        const t = b => b.textContent.trim();
        return { name: [...r.querySelectorAll('.at-c-name .at-who > button')].map(t), acts: [...r.querySelectorAll('.at-c-act button')].map(t),
            all: [...r.querySelectorAll('button, select')].map(b => b.tagName + ':' + t(b)), selects: r.querySelectorAll('select').length }; }, id);
    const z = await shape(T.zed.id), pnd = await shape(T.pend.id);
    if (!z || z.name.length !== 2 || !/Zed Ok/.test(z.name[0]) || !/^↺ Reset Attempts/.test(z.name[1])) fail(`an active row should have the name and ↺ Reset Attempts beside it: ${JSON.stringify(z && z.name)}`);
    if (!z || JSON.stringify(z.acts) !== '["Revoke"]') fail(`an active row's Actions should be Revoke alone: ${JSON.stringify(z && z.acts)}`);
    if (!pnd || JSON.stringify(pnd.acts) !== '["Approve","Reject","Revoke"]') fail(`a pending row's Actions should be Approve, Reject, Revoke: ${JSON.stringify(pnd && pnd.acts)}`);
    for (const x of [z, pnd]) if (x && (x.selects || x.all.some(b => /Detail|Feedback|Certificate|Assign|⋯|👁/.test(b)))) fail(`a row still has View / Hide Detail, Feedback, Certificate, ⋯ or a case picker: ${JSON.stringify(x.all)}`);
    if (await page.locator('.at-row select.cc-assign').count()) fail('the 📁 case picker is still in the Trainee Audit');

    // the old pieces are gone, the settings are on ⚙ Settings
    const page1 = await page.evaluate(() => ({
        stat: !!document.querySelector('.stat-row'), pendPanel: /Pending Approvals/.test(document.body.innerText), cards: !!document.querySelector('.batch-folder'),
        sub: !!document.querySelector('.bf-tabs'), oldSearch: !!document.getElementById('adminSearchInput'), strips: !!document.querySelector('.audit-strip'),
        sets: ['certTrainer', 'fbAutoDraft', 'surpriseTaskDaySelect'].filter(id => document.getElementById(id)),
        wraps: document.querySelectorAll('#adminRowsWrap').length, table: typeof renderAdminRows === 'function' && /class="at-table"/.test(renderAdminRows())
    }));
    if (page1.stat || page1.pendPanel || page1.cards || page1.sub || page1.oldSearch || page1.strips) fail(`old pieces still on the page: ${JSON.stringify(page1)}`);
    if (page1.sets.length) fail(`settings on the Trainee Audit (they are ⚙ Settings' and 🎲 Random Tasks'): ${page1.sets.join(', ')}`);
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

    // 4. the actions work: ↺ Reset beside the name, the name opens the detail (✍ feedback, 🎓 certificate), Reject, Approve, Revoke
    await row(T.ok.id).locator('.at-c-name button.at-reset').click(); await page.waitForTimeout(900);
    let r = await rec(T.ok.id); if (r.labAttemptsGlobal !== 0 || r.labResetRequestedAt) fail(`↺ Reset Attempts beside the name: ${JSON.stringify({ g: r.labAttemptsGlobal, a: r.labResetRequestedAt })}`);
    await row(T.ok.id).locator('.at-name').click(); await page.waitForTimeout(700);
    const det = await page.locator(`.at-row[data-id="${T.ok.id}"] + .at-detail-row`).innerText().catch(() => '');
    if (!/Corrected Copies|Day-by-Day/i.test(det)) fail(`the trainee's name should open their record under the row: "${det.slice(0, 120)}"`);
    for (const w of ['Write feedback', 'Certificate', 'Scorecard', 'Close detail']) if (!det.includes(w)) fail(`the detail should carry "${w}"`);
    await page.locator('.at-detail-tools button:has-text("Write feedback")').click(); await page.waitForTimeout(1500);
    if (!(await page.evaluate((id) => !!document.getElementById('fbComposer_' + cssId(id)), T.ok.id))) fail('✍ Write feedback in the detail did not open the feedback composer');
    await row(T.ok.id).locator('.at-name').click(); await page.waitForTimeout(500);
    if (await page.locator('.at-detail-row').count()) fail('a second click on the name should close the detail');
    await row(T.pend.id).locator('.at-c-act button', { hasText: 'Reject' }).click(); await page.waitForTimeout(1200);
    if (!(await rec(T.pend.id)).rejected) fail('Reject in the row\'s Actions didn\'t reject');
    await page.selectOption('#atStatus', 'rejected'); await page.waitForTimeout(300);
    await row(T.pend.id).locator('.at-c-act button', { hasText: 'Approve' }).click(); await page.waitForTimeout(1200);
    r = await rec(T.pend.id); if (r.approved !== true || r.rejected) fail('Approve in the row\'s Actions didn\'t approve a rejected trainee');
    await page.selectOption('#atStatus', 'current'); await page.waitForTimeout(300);
    // ⬇ Download CSV
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 5000 }).catch(() => null), page.click('button:has-text("Download CSV")')]);
    if (!dl) fail('⬇ Download CSV gave no file');
    else { const fs = require('fs'); const text = fs.readFileSync(await dl.path(), 'utf8'); if (!/Name,ID,Batch,Status/.test(text) || !text.includes(T.ok.id)) fail(`the CSV should be the table: ${text.slice(0, 160)}`); }
    await row(T.zed.id).locator('.at-c-act button', { hasText: 'Revoke' }).click(); await page.waitForTimeout(1500);
    if (await rec(T.zed.id)) fail('Revoke in the row\'s Actions didn\'t delete the registration');

    // 6. readable: 14px and up, bold
    const small = await page.evaluate(() => [...document.querySelectorAll('#cmAuditTable *, .at-head *')].filter(n => !n.closest('.at-detail-row') && n.childNodes.length && [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && n.offsetParent && (parseFloat(getComputedStyle(n).fontSize) < 14 || Number(getComputedStyle(n).fontWeight) < 600)).map(n => n.tagName + '.' + n.className + ': ' + n.textContent.trim().slice(0, 30) + ' ' + getComputedStyle(n).fontSize + '/' + getComputedStyle(n).fontWeight).slice(0, 5));
    if (small.length) fail(`text under 14px or not bold: ${JSON.stringify(small)}`);

    // 5. 📁 Companion Cases: its own table, the picker in each trainee's row
    await open('companion');
    await page.evaluate((a) => setAdminBatchFilter(cleanBatch(a)), A); await page.waitForSelector('#ccTable');
    const cc = await page.evaluate(() => ({ active: (document.querySelector('.cmsh-row .admin-tab-btn.active') || {}).textContent || '', rows: [...document.querySelectorAll('#ccTable tbody tr')].map(r => r.dataset.id),
        heads: [...document.querySelectorAll('#ccTable thead th')].map(t => t.textContent.trim()) }));
    if (!/Companion Cases/.test(cc.active)) fail(`📁 Companion Cases should be a tab of its own: "${cc.active}"`);
    if (!cc.rows.includes(T.ok.id) || !cc.rows.includes(T.pend.id) || cc.rows.includes(T.rej.id)) fail(`📁 Companion Cases should list the batch's current trainees: ${JSON.stringify(cc.rows)}`);
    if (!cc.heads.some(h => /Assign a case/.test(h)) || !cc.heads.some(h => /Companion case/.test(h))) fail(`📁 Companion Cases' columns: ${JSON.stringify(cc.heads)}`);
    const caseId = await page.evaluate(() => Object.keys(window.CM_COMPANION_CASES || {})[0]);
    if (!caseId) fail('no companion cases to assign');
    else {
        await page.locator(`#ccTable tr[data-id="${T.ok.id}"] select.cc-assign`).selectOption(caseId); await page.waitForTimeout(900);
        r = await rec(T.ok.id);
        if (!r.assignedCase || r.assignedCase.id !== caseId) fail(`📁 assigning from the Companion Cases table didn't save: ${JSON.stringify(r.assignedCase)}`);
        const cell = await page.locator(`#ccTable tr[data-id="${T.ok.id}"] .cc-adm-case`).innerText().catch(() => '');
        if (!cell.includes(r.assignedCase && r.assignedCase.title)) fail(`the Companion case column should name it: "${cell}"`);
    }
    const smallCc = await page.evaluate(() => [...document.querySelectorAll('.cc-adm *')].filter(n => [...n.childNodes].some(c => c.nodeType === 3 && c.textContent.trim()) && n.offsetParent && n.tagName !== 'OPTION' && parseFloat(getComputedStyle(n).fontSize) < 14).map(n => n.tagName + ': ' + n.textContent.trim().slice(0, 30)).slice(0, 5));
    if (smallCc.length) fail(`📁 Companion Cases text under 14px: ${JSON.stringify(smallCc)}`);

    // a phone: no sideways page (the tables scroll inside their boxes)
    await page.setViewportSize({ width: 390, height: 800 }); await page.waitForTimeout(400);
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail('on a phone 📁 Companion Cases scrolls the page sideways');
    await open();
    if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) fail('on a phone the page scrolls sideways (the table should scroll inside its box)');

    await page.evaluate(async (T) => { for (const r of Object.values(T)) await sharedDelete('trainee:' + r.id); }, T);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('The Trainee Audit is one table under 🛡 Admin Master Control: one row per trainee, pending on top, the name opens the detail (✍ feedback, 🎓 certificate), ↺ Reset beside the name, Approve / Reject / Revoke as plain buttons (each one works), filters and sortable columns; 📁 Companion Cases is its own table and its picker saves; the settings are on ⚙ Settings.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
