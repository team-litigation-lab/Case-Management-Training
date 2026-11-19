// @check browser — A Knowledge Check submitted while trainee:<id> can't be written or read reaches the record once the server answers, and the Scorecard shows a check the record lacks as unconfirmed, never counted
// js/cm-ledger-retry.js wraps syncToLedger, the only way a Knowledge Check reaches trainee:<id> (what the trainer's
// 🏅 Scorecard and 📋 Batch Sheet read). Checked in the browser, the server's answers faked with page.route:
//   1. the record's write fails (503): the submit still records the score on the device, the sync is left pending and the
//      save status says the server hasn't got it ("Couldn't reach the server");
//   2. the record's READ fails (503) on the retry: still pending, nothing written (a failed read is never "no record");
//   3. the server answers again: the next retry (the tab coming back into view, the device back online) writes the score
//      to trainee:<id>, the pending flag clears and the save status is back to saved;
//   4. a refused write (403) is also retried, never taken for saved; one refused because the account was merged into
//      another ("This account was merged …") is not retried (the server will never take it);
//   5. the Scorecard (js/cm-scorecard.js kcBest / kcPassed / kcDevice) shows a check held only in
//      progress:<id>.data["day-progress"], or only in the work log's quiz entries, labelled unconfirmed and NOT counted
//      (the trainee writes those; only trainee:<id> and its Case Flow summary count), and a day passed on any of the
//      record's attempts stays passed.
// Usage: node .github/scripts/kc-ledger-retry.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Lea', 'Retry', 'B100926');
    const approve = () => page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await approve();
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    if (!(await page.evaluate(() => typeof state !== 'undefined' && !!state.traineeId && !state.isAdmin))) fail('sign-in did not complete');
    if (!(await page.evaluate(() => !!window.cmLedgerRetry))) fail('js/cm-ledger-retry.js is not loaded');
    const tid = await page.evaluate(() => state.traineeId), recKey = 'trainee:' + tid;
    const onServer = () => page.evaluate(async (key) => { const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json()); return JSON.parse(r.value || '{}'); }, recKey);

    // the server's answers for the trainee's record, as the test wants them
    let mode = { set: 'ok', get: 'ok' };
    await page.route('**/api/storage/*', async (route) => {
        const req = route.request(), url = req.url();
        let body = {}; try { body = JSON.parse(req.postData() || '{}'); } catch (e) {}
        if (body.key === recKey && /\/set$/.test(url) && mode.set !== 'ok') return route.fulfill({ status: mode.set === '503' ? 503 : 403, contentType: 'application/json', body: JSON.stringify({ error: mode.set === 'merged' ? 'This account was merged into your current one. Open the program again from the LSH Training Portal.' : mode.set === '403' ? 'Not allowed' : 'unavailable' }) });
        if (body.key === recKey && /\/get$/.test(url) && mode.get !== 'ok' && !req.headers()['x-test']) return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable"}' });
        return route.continue();
    });

    // 1. the write fails: the score is on the device, the sync pending, the status says so
    const id = await page.evaluate(() => DAYS[0].id);
    await page.evaluate((id) => { state.progress = {}; finishTrainingForDay(id); }, id);
    await page.waitForTimeout(500);
    const n = await page.evaluate((id) => { const d = DAYS.find(x => x.id === id); state.quizAnswers = {}; d.quiz.forEach((q, i) => { state.quizAnswers[i] = i < Math.ceil(d.quiz.length * 0.85) ? q.a : (q.a + 1) % q.opts.length; }); return d.quiz.length; }, id);
    const want = Math.round(Math.ceil(n * 0.85) / n * 100);
    mode = { set: '503', get: 'ok' };
    await page.evaluate((id) => window.submitQuiz(id), id);
    await page.waitForTimeout(1500);
    await page.evaluate(() => cloudSaveNow());   // the progress save goes through (its "Saving…" is over); the record's sync still hasn't
    await page.waitForTimeout(500);
    const s1 = await page.evaluate((id) => ({ local: state.progress[id], pending: window.cmLedgerRetry.pending, status: (document.getElementById('saveStatus') || {}).innerText || saveStatusText() }), id);
    if (!s1.local || s1.local.score !== want) fail(`the score should be recorded on the device (${want}%): ${JSON.stringify(s1.local)}`);
    if (!s1.pending) fail('a sync whose write failed should be left pending');
    if (!/Couldn't reach the server/.test(s1.status)) fail(`the save status should say the server hasn't got it: "${s1.status}"`);
    if (((await onServer()).dayProgress || {})[id]) fail('the record should not have the score yet (its write failed)');

    // 2. the read fails on the retry: still pending, nothing written
    mode = { set: 'ok', get: '503' };
    await page.evaluate(() => window.dispatchEvent(new Event('online')));
    await page.waitForTimeout(1500);
    if (!(await page.evaluate(() => !!window.cmLedgerRetry.pending))) fail('a retry whose read failed should stay pending (a failed read is not "no record")');
    if (((await onServer()).dayProgress || {})[id]) fail('nothing should be written after a failed read');

    // 3. the server answers: the next retry writes the score, the status is saved again
    mode = { set: 'ok', get: 'ok' };
    await page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    await page.waitForTimeout(1500);
    const s3 = await page.evaluate(() => ({ pending: window.cmLedgerRetry.pending, status: saveStatusText() }));
    const rec3 = await onServer();
    if (s3.pending) fail(`once the server answers, the sync should go through: ${JSON.stringify(s3.pending)}`);
    if (!rec3.dayProgress || !rec3.dayProgress[id] || rec3.dayProgress[id].score !== want) fail(`trainee:<id> should hold the score (${want}%) once the server answers: ${JSON.stringify((rec3.dayProgress || {})[id])}`);
    if (/Couldn't reach the server/.test(s3.status)) fail(`the save status should be back to saved: "${s3.status}"`);

    // 4. a refused write (403) is retried too, never taken for saved
    mode = { set: '403', get: 'ok' };
    await page.evaluate(async () => { state.progress[DAYS[0].id].takeawayNote = 'changed ' + Date.now(); await syncToLedger(); });
    if (!(await page.evaluate(() => !!window.cmLedgerRetry.pending))) fail('a refused write should leave the sync pending');
    mode = { set: 'ok', get: 'ok' };
    await page.evaluate(() => window.cmLedgerRetry.retry());
    await page.waitForTimeout(800);
    if (await page.evaluate(() => !!window.cmLedgerRetry.pending)) fail('the retry after a refused write should go through once the server takes it');
    // 4b. a write refused because the account was merged into another is never retried: the server won't take it again
    mode = { set: 'merged', get: 'ok' };
    await page.evaluate(async () => { state.progress[DAYS[0].id].takeawayNote = 'merged ' + Date.now(); await syncToLedger(); });
    const s4 = await page.evaluate(() => ({ pending: window.cmLedgerRetry.pending, stopped: window.cmLedgerRetry.stopped }));
    if (s4.pending || !s4.stopped || s4.stopped.why !== 'merged') fail(`a write refused for a merged account should stop the retries: ${JSON.stringify(s4)}`);
    mode = { set: 'ok', get: 'ok' };
    await page.unroute('**/api/storage/*');

    // 5. the Scorecard reads a check the record lacks: the device's day progress, then the work log
    const sc = await page.evaluate(() => {
        const d = DAYS.find(x => x.cf), S = window.cmScorecard, items = (c) => (S.compute(c).rows.find(r => r.s.id === 'kc') || { items: [] }).items;
        const fromDp = { rec: { dayProgress: {} }, cf: { days: {} }, data: { 'day-progress': { [d.id]: { score: 85, done: true, history: [{ score: 85 }] } } } };
        const fromLog = { rec: { dayProgress: {} }, cf: { days: {} }, data: { 'work-log': [{ kind: 'quiz', dayId: d.id, score: 77, at: new Date().toISOString() }] } };
        const passedOnce = { rec: { dayProgress: { [d.id]: { score: 60, done: false, history: [{ score: 90 }, { score: 60 }] } } }, cf: { days: {} }, data: {} };
        const row = (c) => S.compute(c).rows.find(r => r.s.id === 'kc') || {};
        return { dp: items(fromDp).map(x => x.pct), dpUn: items(fromDp).every(x => x.unconfirmed), dpAvg: row(fromDp).avg, log: items(fromLog).map(x => x.pct), logUn: items(fromLog).every(x => x.unconfirmed),
            done: S.compute(fromDp).done, passed: S.kcPassed(passedOnce, d), doneOnce: S.compute(passedOnce).done };
    });
    if (sc.dp[0] !== 85 || !sc.dpUn) fail(`the Scorecard should show a check held only in progress:<id>'s day progress (85%), labelled unconfirmed: ${JSON.stringify(sc)}`);
    if (sc.done !== 0 || sc.dpAvg != null) fail(`a check only the device holds is never counted (not passed, not averaged): ${JSON.stringify(sc)}`);
    if (sc.log[0] !== 77 || !sc.logUn) fail(`the Scorecard should show a check held only in the work log (77%), unconfirmed: ${JSON.stringify(sc.log)}`);
    if (!sc.passed || sc.doneOnce !== 1) fail('a day passed on any attempt (90%) stays passed even if the record\'s latest score is 60%');

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Knowledge Check ledger retry: a failed write or read is retried, never taken for "no record"; the score reaches trainee:<id> once the server answers; the Scorecard shows a check only the day progress or the work log holds as unconfirmed, never counted; a merged account\'s refused write is not retried.');
})().catch(e => { console.error(e); process.exit(1); });
