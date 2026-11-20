// @check browser — ☁ A saved copy this device couldn't read is never saved over: two failed reads at sign-in on a new computer leave the server's notes, Net Sheet and filing as they were, the trainee is told nothing is saved until it loads (Try again), and once a read succeeds the saved work is restored and saving starts again
// Platform QA 2026-11-19, CM finding 2 (js/cm-restore-guard.js; cloudRestore / cloudSaveNow in index.html). The server's
// answers are faked with page.route on the second computer only:
//   1. Computer A: a trainee saves notes, a Net Sheet and a document filing (a sign-in with no saved copy yet saves at once).
//   2. Computer B: every read of progress:<id> fails (500) until step 3. After the sign-in and well past the 4-second save:
//      progress:<id> on the server is unchanged, state.cloudUnread is the id, cloudSaveNow() refuses, the save status
//      and the #cm-unread notice say the work couldn't be loaded and nothing is saved until it loads, with Try again.
//      A note written on B meanwhile doesn't reach the server either.
//   3. Try again (the reads answer now): the notice goes, B holds A's notes, saving is on again, the server keeps A's
//      work, and the note written on B meanwhile is backed up (orphan:<id>:<ms>) rather than lost.
//   4. Computer C: one failed read is absorbed (js/cm-safe-logout.js reads once more): restored, no notice.
//   5. Computer D: two failed reads and no click: the read is tried again by itself and the work restored.
// Usage: node .github/scripts/restore-fail.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const letters = (n) => String(n).replace(/[0-9]/g, (d) => 'abcdefghij'[d]);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const first = 'Rhea', last = 'Restore' + letters(Date.now() % 100000);
    const computer = async (failReads) => {
        const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
        const page = await ctx.newPage();
        page.on('pageerror', (e) => fail(`page error: ${e.message}`));
        const left = { n: failReads };
        await ctx.route('**/api/storage/get', async (route) => {
            let body = {}; try { body = JSON.parse(route.request().postData() || '{}'); } catch (e) { }
            if (/^progress:/.test(body.key || '') && left.n > 0) { left.n--; return route.fulfill({ status: 500, contentType: 'application/json', body: '{"error":"test: the read failed"}' }); }
            return route.continue();
        });
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        return { ctx, page, left };
    };
    const api = (page, p, body) => page.evaluate(async ([p, body]) => (await fetch(p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json(), [p, body]);

    // 1. computer A
    const A = await computer(0);
    await signIn(A.page, first, last, 'B100926');
    const id = await A.page.evaluate(() => state.traineeId);
    if (!id) { console.log('the sign-in on computer A did not complete'); process.exit(1); }
    await A.page.evaluate(async () => { const k = 'trainee:' + state.traineeId; const r = await sharedGet(k); r.approved = true; await sharedSet(k, r); });
    const savedA = await A.page.evaluate(async () => {
        await storeSet('notes', [{ id: 1, text: 'computer A note' }]);
        await storeSet('net-sheet', { v: 2, files: { A: { cells: { L7: 41400 }, checks: {} } } });
        await storeSet('doc-filing', { filed: ['LOR to Allstate'] });
        return cloudSaveNow();
    });
    if (!savedA) fail('computer A: the save should go through (a sign-in with no saved copy yet is a read that succeeded)');
    const server = async () => { const r = await api(A.page, '/api/storage/get', { key: 'progress:' + id }); const v = r && r.value ? JSON.parse(r.value) : null; return v && v.data ? v.data : {}; };
    const want = JSON.stringify((await server()).notes);
    if (!/computer A note/.test(want)) fail(`computer A's notes should be on the server: ${want}`);
    const same = async (label) => {
        const d = await server();
        if (JSON.stringify(d.notes) !== want || !d['net-sheet'] || !d['doc-filing']) fail(`${label}: the server's notes, Net Sheet and filing must be as computer A saved them: ${JSON.stringify({ notes: d.notes, netSheet: !!d['net-sheet'], docFiling: !!d['doc-filing'] })}`);
    };

    // 2. computer B: the reads fail (the sign-in's two, then the retries') until Try again
    const B = await computer(1000);
    await signIn(B.page, first, last, 'B100926');
    await B.page.waitForTimeout(6500);
    await same('computer B, two failed reads');
    const b1 = await B.page.evaluate(async () => ({ id: state.traineeId, unread: state.cloudUnread, status: saveStatusText(), notice: (document.getElementById('cm-unread') || {}).innerText || '', save: await cloudSaveNow() }));
    if (b1.id !== id || b1.unread !== id) fail(`computer B: the failed read should be remembered (state.cloudUnread): ${JSON.stringify(b1)}`);
    if (b1.save !== false) fail('computer B: cloudSaveNow() must refuse while the saved copy is unread');
    if (!/Couldn.t load your saved work/.test(b1.status) || !/not saving until it loads/.test(b1.status)) fail(`computer B: the save status should say the work couldn't be loaded and nothing is saved: ${b1.status}`);
    if (!/couldn.t load your saved work/i.test(b1.notice) || !/nothing is being saved/i.test(b1.notice) || !/Try again/.test(b1.notice)) fail(`computer B: the notice should say so, with Try again: ${JSON.stringify(b1.notice)}`);
    await B.page.evaluate(() => storeSet('notes', [{ id: 9, text: 'written on computer B while unread' }]));
    await B.page.waitForTimeout(5000);
    await same('computer B, a note written while unread');

    // 3. Try again, the reads answering now
    if (B.left.n > 998) fail(`computer B: the sign-in should have tried the read twice: ${1000 - B.left.n} read(s)`);
    B.left.n = 0;
    await B.page.click('#cm-unread button', { timeout: 5000 });
    await B.page.waitForFunction(() => !document.getElementById('cm-unread') && state.cloudUnread !== state.traineeId, null, { timeout: 20000 }).catch(() => fail('computer B: Try again should load the saved work and end the notice'));
    await B.page.waitForTimeout(5500);
    const b2 = await B.page.evaluate(async () => ({ notes: await storeGet('notes'), status: saveStatusText(), save: await cloudSaveNow() }));
    if (JSON.stringify(b2.notes) !== want) fail(`computer B: after Try again it should hold computer A's notes: ${JSON.stringify(b2.notes)}`);
    if (!b2.save || !/saved to your account/i.test(b2.status)) fail(`computer B: saving should be on again: ${JSON.stringify(b2)}`);
    await same('computer B, after Try again');
    const orphans = (await api(A.page, '/api/storage/list', { prefix: `orphan:${id}:` })).keys || [];
    const backed = await Promise.all(orphans.map((k) => api(A.page, '/api/storage/get', { key: typeof k === 'string' ? k : k.name })));
    if (!backed.some((r) => r && /written on computer B while unread/.test(r.value || ''))) fail(`computer B's note written while unread should be backed up (orphan:${id}:<ms>), not lost: ${orphans.length} backup(s)`);

    // 4. computer C: one failed read
    const C = await computer(1);
    await signIn(C.page, first, last, 'B100926');
    await C.page.waitForTimeout(1500);
    const c1 = await C.page.evaluate(async () => ({ notes: await storeGet('notes'), unread: state.cloudUnread === state.traineeId, notice: !!document.getElementById('cm-unread') }));
    if (JSON.stringify(c1.notes) !== want || c1.unread || c1.notice) fail(`computer C: one failed read should be absorbed (restored, no notice): ${JSON.stringify(c1)}`);

    // 5. computer D: two failed reads, then the read is tried again by itself
    const D = await computer(2);
    await signIn(D.page, first, last, 'B100926');
    if (!(await D.page.evaluate(() => state.cloudUnread === state.traineeId))) fail('computer D: two failed reads should leave the copy unread');
    await D.page.waitForFunction(() => state.cloudUnread !== state.traineeId && !document.getElementById('cm-unread'), null, { timeout: 30000 }).catch(() => fail('computer D: the read should be tried again by itself (about 15 s)'));
    const d1 = await D.page.evaluate(() => storeGet('notes'));
    if (JSON.stringify(d1) !== want) fail(`computer D: the retried read should restore the saved work: ${JSON.stringify(d1)}`);
    await same('computer D');

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('A saved copy that could not be read is never saved over: the trainee is told nothing is saved until it loads, Try again (or the retry) restores it, and work done meanwhile is backed up.');
})().catch((e) => { failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); console.error(e); process.exit(1); });
