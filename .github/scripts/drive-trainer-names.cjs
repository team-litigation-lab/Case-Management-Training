// @check browser — A trainer's Backup Drive view reads the names as the Worker sends them: only the names a grade is lower for are an issue, and each wrong name is read from the trainee's own report when their detail opens
// The Worker (worker.js, driveNaming) and the trainer's page have to agree on three things:
// 1. `wrong` counts every name to rename, and `unscored` of them cost no points (a copy the platform named itself, anything
//    made before names were graded). The 📂 Drive chip, the Trainee Audit's Drive cell and "Developing" speak of the
//    charged ones only (wrong − unscored): a trainee with nothing but unscored names stays "Structure ✓" and Proficient,
//    and their names are "to rename (not counted in the grade)", not in red.
// 2. The list of trainees (reportAll) carries the counts and the time only. Each wrong name is in the trainee's own
//    report: the page reads it once when a detail with names to list is drawn, keeps it while the list of trainees speaks
//    of the same check of the drive, and reads it again only after a newer check. When it can't be read the row says
//    🏅 Grade now lists each name, and the page doesn't keep asking.
// 3. A list entry is {kind, folder, name, want, hint, scored, issues:[{n, part, got, should}]}: every differing piece is
//    marked, a copy that isn't scored is tagged, an empty `want` shows no "should be".
// (/api/drive is answered by the test, in the shapes worker.js sends: the test server has no Google keys.)
// Usage: node .github/scripts/drive-trainer-names.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Dana', 'Names' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');

    const CASE = 'LSH-2026-MVA-000041';
    const LIST = [
        { kind: 'file', folder: '03 Medical Records', name: `${CASE}_Doe-John_medical records_2026-11-10.PDF`, want: `${CASE}_Doe-John_Medical-Records_2026-11-10.pdf`, scored: true,
          issues: [{ n: 3, part: 'Type', got: 'medical records', should: 'Medical-Records' }, { n: 99, part: 'ext', got: 'PDF', should: 'pdf' }], hint: 'Look at part 3 (Type): "medical records" should be "Medical-Records". Also the extension: ".PDF" should be ".pdf".' },
        { kind: 'file', folder: '01 Intake & Retainer', name: 'RS_05_Retainer_Agreement.pdf', want: '', scored: false,
          issues: [{ n: 1, part: 'Case ID', got: 'RS', should: '' }, { n: 2, part: 'Last-First', got: '05', should: 'Doe-John' }], hint: 'This copy still has the name the platform uploaded it under. Rename it as shown.' },
        // a counter the CMS put after the date, lost in the rename: the label is the fifth piece of the name as it is, the sixth of the name it should have
        { kind: 'file', folder: '05 Insurance, Demands & Negotiation', name: `${CASE}_Doe-John_Others_2026-11-12_draft.pdf`, want: `${CASE}_Doe-John_Others_2026-11-12_2_DRAFT.pdf`, scored: true,
          issues: [{ n: 5, part: 'label', got: 'draft', should: 'DRAFT' }], hint: 'Look at part 5 (the label): "draft" should be "DRAFT".' },
        { kind: 'folder', folder: 'LSH Case Backups/01 Clients', name: 'doe john', want: 'Doe-John', scored: true, issues: [{ n: 0, part: 'folder', got: 'doe john', should: 'Doe-John' }], hint: 'A folder keeps the name the firm gave it.' }];
    const base = { connected: true, email: 'dana@example.com', builtAt: '2026-11-12T10:00:00.000Z', checkedAt: '2026-11-12T11:00:00.000Z', missing: [], attempts: 1, passed: true, tries: [{ ok: true, n: 0 }], problems: [], restored: 0, copies: 2, perFolder: {}, standard: 20, grades: {} };
    // what the Worker keeps of each trainee's names: the counts (reportAll sends these and the time) and the list (their own report)
    const AT = { t1: '2026-11-12T12:30:00.000Z' };
    const counts = {
        t1: () => ({ at: AT.t1, checked: 6, named: 3, wrong: 4, wrongFiles: 3, wrongFolders: 1, unscored: 1 }),   // three charged, one not
        t2: () => ({ at: '2026-11-12T12:31:00.000Z', checked: 5, named: 3, wrong: 2, wrongFiles: 2, wrongFolders: 0, unscored: 2 }),   // nothing charged
        t3: () => ({ at: '2026-11-12T12:32:00.000Z', checked: 4, named: 3, wrong: 1, wrongFiles: 1, wrongFolders: 0, unscored: 0 }),   // its own report can't be read
        t4: () => ({ at: '2026-11-12T12:33:00.000Z', checked: 5, named: 5, wrong: 0, wrongFiles: 0, wrongFolders: 0, unscored: 0 }) };
    const lists = { t1: LIST, t2: [LIST[1], Object.assign({}, LIST[1], { name: 'RS_06_Fee_Agreement.pdf' })], t4: [] };
    const asked = [];
    await page.route('**/api/drive', (route) => {
        let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* no body */ }
        asked.push(`${b.action}:${b.traineeId || ''}`);
        const send = (status, body) => route.fulfill({ status, contentType: 'application/json', body: JSON.stringify(body) });
        if (b.action === 'reportAll') return send(200, { reports: Object.fromEntries((b.traineeIds || []).filter(id => counts[id]).map(id => [id, Object.assign({}, base, { naming: counts[id]() })])) });
        if (b.action === 'report' && lists[b.traineeId]) return send(200, { report: Object.assign({}, base, { naming: Object.assign(counts[b.traineeId](), { list: lists[b.traineeId] }) }) });
        return send(500, { error: 'down' });
    });
    const reports = (id) => asked.filter(a => a === `report:${id}`).length;
    const text = (html) => page.evaluate((html) => { const d = document.createElement('div'); d.innerHTML = html; document.body.appendChild(d); const t = d.innerText; d.remove(); return t; }, html);

    await page.evaluate(async () => { state.isAdmin = true; state.driveReports = {}; state.driveReportsAt = 0;
        state.adminData = ['t1', 't2', 't3', 't4'].map((id, i) => ({ id, name: `Trainee ${i + 1}`, firstName: 'Trainee', lastName: String(i + 1), batch: 'B100926', approved: true }));
        await loadDriveReports(true); });

    /* ---------- 1. only the names a grade is lower for are an issue ---------- */
    const one = await page.evaluate(() => ({ chips: ['t1', 't2', 't3', 't4'].map(id => renderDriveChip({ id })), rows: renderAdminRows(),
        comp: ['t1', 't2'].map(id => driveCompetency(state.driveReports[id], 2)), naming: ['t1', 't2'].map(id => renderDriveNaming(state.driveReports[id])) }));
    const chips = await Promise.all(one.chips.map(text)) /* (a pill is drawn in capitals) */, rows = await text(one.rows), naming = await Promise.all(one.naming.map(text));
    if (!/🏷 3 names wrong/i.test(chips[0])) fail(`the chip should count the names the Worker charges (4 wrong, 1 of them unscored: "🏷 3 names wrong"): "${chips[0]}"`);
    if (!/Structure ✓/i.test(chips[1]) || /wrong/i.test(chips[1])) fail(`a trainee whose wrong names are all unscored should read "Structure ✓" on the chip: "${chips[1]}"`);
    if (!/🏷 1 name wrong/i.test(chips[2]) || !/Structure ✓/i.test(chips[3])) fail(`the chip should read "🏷 1 name wrong" and "Structure ✓": ${JSON.stringify(chips.slice(2))}`);
    if (!/🏷 3 names wrong/.test(rows) || /🏷 4 names wrong|🏷 2 names wrong/.test(rows)) fail(`the Trainee Audit's Drive cell should count the charged names only: "${rows.replace(/\s+/g, ' ').slice(0, 400)}"`);
    if ((rows.match(/names ✓/g) || []).length !== 1) fail(`"Structure ✓ · names ✓" is for a drive with no name to rename (one of the four here): "${rows.replace(/\s+/g, ' ').slice(0, 600)}"`);
    if (one.comp[0].level !== 'Developing' || !/3 names not the firm's way/.test(one.comp[0].why)) fail(`three charged names are why a trainee is Developing: ${JSON.stringify(one.comp[0])}`);
    if (one.comp[1].level !== 'Proficient' || /every file named the firm's way/.test(one.comp[1].why)) fail(`names that aren't charged don't make a trainee Developing, and "every file named the firm's way" isn't said of them: ${JSON.stringify(one.comp[1])}`);
    if (!/3 files and 1 folder named wrong \(1 not counted in the grade\)/.test(naming[0]) || !/3 of 6 files right/.test(naming[0])) fail(`the report's line should count files and folders apart, and say how many aren't charged: "${naming[0].slice(0, 200)}"`);
    if (!/2 files to rename \(not counted in the grade\)/.test(naming[1]) || /named wrong/.test(naming[1]) || !/color:var\(--ink-soft\);">2 files to rename/.test(one.naming[1])) fail(`names that aren't charged are to rename, and not in red: "${naming[1].slice(0, 200)}"`);

    /* ---------- 2. each name is read from the trainee's own report ---------- */
    if (!/reading each name/.test(naming[0]) || /drv-adm-names/.test(one.naming[0])) fail(`the list of trainees carries no names: the row should say they are being read: "${naming[0].slice(0, 200)}"`);
    if (reports('t1')) fail('no detail is open yet: no trainee\'s own report should have been asked for');
    // a detail's Backup Drive panel is drawn: its names are asked for, once
    await page.evaluate(() => { renderAdminDrivePanel({ id: 't1' }); renderAdminDrivePanel({ id: 't1' }); });
    await page.waitForFunction(() => Array.isArray(((state.driveReports.t1 || {}).naming || {}).list), null, { timeout: 8000 }).catch(() => {});
    await page.evaluate(() => loadDriveNames('t1'));
    if (reports('t1') !== 1) fail(`the trainee's own report should be read once when their detail is drawn: ${reports('t1')} request(s)`);
    const two = await page.evaluate(() => { const d = document.createElement('div'); d.innerHTML = renderDriveNaming(state.driveReports.t1);
        return { html: d.innerHTML, items: [...d.querySelectorAll('.drv-adm-names li')].map(li => ({ t: li.textContent, bad: [...li.querySelectorAll('.drv-nr-bad')].map(e => e.textContent), good: [...li.querySelectorAll('.drv-nr-good')].map(e => e.textContent), free: !!li.querySelector('.drv-adm-free') })) }; });
    if (two.items.length !== 4 || /reading each name/.test(two.html)) fail(`the four wrong names should be listed once the report is read: ${two.items.length}`);
    else {
        const [a, b, c, d] = two.items;
        if (a.bad.join('|') !== 'medical records|PDF' || a.good.join('|') !== 'Medical-Records|pdf') fail(`every differing piece (the Worker's issues[]) should be marked in both names: ${JSON.stringify([a.bad, a.good])}`);
        if (!b.free || a.free || c.free || d.free) fail(`only the copy the Worker doesn't score should be tagged "not counted in the grade": ${JSON.stringify(two.items.map(x => x.free))}`);
        if (b.bad.join('|') !== 'RS|05' || b.good.length || /should be/.test(b.t.replace(/should be "[^"]*"/g, ''))) fail(`a name the Worker can't complete (want "") has its pieces marked and no "should be" line: ${JSON.stringify(b)}`);
        if (c.bad.join() !== 'draft' || c.good.join() !== 'DRAFT') fail(`the label is marked where it stands in each name (a counter after the date comes before it in one of them): ${JSON.stringify([c.bad, c.good])}`);
        if (d.bad.join() !== 'doe john' || d.good.join() !== 'Doe-John') fail(`a folder's name is marked whole: ${JSON.stringify([d.bad, d.good])}`);
    }
    // the list of trainees is read again (it is, every minute): the names stay while it speaks of the same check
    await page.evaluate(async () => { await loadDriveReports(true); await loadDriveNames('t1'); });
    const kept = await page.evaluate(() => (state.driveReports.t1.naming.list || []).length);
    if (kept !== 4 || reports('t1') !== 1) fail(`the names should stay when the list of trainees is read again for the same check of the drive: ${kept} kept, ${reports('t1')} request(s)`);
    // the drive was checked since: the names are read again
    AT.t1 = '2026-11-12T14:00:00.000Z';
    await page.evaluate(async () => { await loadDriveReports(true); await loadDriveNames('t1'); });
    const again = await page.evaluate(() => ({ n: (state.driveReports.t1.naming.list || []).length, at: state.driveReports.t1.naming.at }));
    if (again.n !== 4 || again.at !== AT.t1 || reports('t1') !== 2) fail(`after a newer check of the drive the names should be read again, once: ${JSON.stringify(again)}, ${reports('t1')} request(s)`);
    // a report that can't be read: said in the row, and not asked for over and over
    await page.evaluate(async () => { await loadDriveNames('t3'); await loadDriveNames('t3'); });
    const three = await text(await page.evaluate(() => renderDriveNaming(state.driveReports.t3)));
    if (!/1 file named wrong/.test(three) || !/Grade now lists each name/.test(three) || /reading each name/.test(three)) fail(`when the trainee's own report can't be read, the row should say 🏅 Grade now lists each name: "${three.slice(0, 200)}"`);
    if (reports('t3') !== 1) fail(`a report that failed should not be asked for again for the same check: ${reports('t3')} request(s)`);
    // a drive with every name right asks for nothing
    await page.evaluate(() => loadDriveNames('t4'));
    if (reports('t4')) fail('a drive with no wrong name has no list to read: its report should not be asked for');

    await page.evaluate(() => { state.isAdmin = false; state.adminData = null; state.driveReports = {}; });
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log("All good: a trainer's Backup Drive view counts the names the Worker charges, and reads each wrong name from the trainee's own report, once.");
})().catch(e => { console.error(e); process.exit(1); });
