// @check browser — ⚠ A Knowledge Check attempt the Worker couldn't record (saved with no picks, from a tab older than the Worker's scoring) is not dropped without a word: the trainee is told it couldn't be recorded and asked to take it again, the check opens again on that device, and the retake is saved
// js/cm-kc-rejected.js, on the Worker's answer {kcRejected: [day]} (worker-identity.js dateFirstAttempts; the Worker's side is
// kc-rejected-worker.cjs). The test server runs without an admin password, so the Worker stores what it is sent: its
// answer to the bare attempt's save, and what it stores, are given here (page.route) as the secure Worker's.
//   1. the device holds Day 1 as taken and passed at 85% with no picks (what the old submitQuiz saved) and syncs it;
//   2. the trainee sees #cm-kc-rejected: the day's Knowledge Check couldn't be recorded, take it again, with Take it now;
//      the device's attempt is kept aside (unrecorded: 85) and its score and pass are cleared;
//   3. Take it now opens the Knowledge Check (not the "already taken" result), and a submit with picks is saved to the
//      record with its picks at its own score.
// Usage: node .github/scripts/kc-rejected.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const letters = (n) => String(n).replace(/[0-9]/g, (d) => 'abcdefghij'[d]);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Rory', 'Bare' + letters(Date.now() % 100000), 'B111926');
    const record = () => page.evaluate(async () => {
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'trainee:' + state.traineeId }) }).then(r => r.json());
        return JSON.parse(r.value || '{}');
    });
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    const day = await page.evaluate(() => DAYS[0].id);
    let answered = 0;
    await page.route('**/api/storage/set', async (route) => {
        let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { }
        let v = null; try { v = JSON.parse(b.value || 'null'); } catch (e) { }
        const d = v && /^trainee:/.test(b.key || '') && v.dayProgress && v.dayProgress[day];
        const bare = d && Array.isArray(d.history) && d.history.length && !d.history.some((x) => x && Array.isArray(x.answers));
        if (!bare) return route.continue();
        // (stored as the secure Worker stores it: no score, pass or history for the day, only its kcRejected mark)
        const x = Object.assign({}, d); ['score', 'done', 'date', 'history'].forEach((f) => delete x[f]); x.kcRejected = { at: new Date().toISOString(), why: 'no-picks', claimed: d.score };
        v.dayProgress = Object.assign({}, v.dayProgress, { [day]: x });
        const res = await route.fetch({ postData: JSON.stringify(Object.assign({}, b, { value: JSON.stringify(v) })) }); const j = await res.json().catch(() => ({}));
        answered++;
        return route.fulfill({ status: res.status(), contentType: 'application/json', body: JSON.stringify(Object.assign({}, j, { ok: true, kcRejected: [day] })) });
    });

    // 1. the bare attempt, synced
    await page.evaluate(async (day) => {
        const at = new Date().toISOString();
        state.progress = state.progress || {};
        state.progress[day] = { score: 85, done: true, date: at, history: [{ score: 85, passed: true, date: at }] };
        await storeSet('day-progress', state.progress);
        await syncToLedger();
    }, day);
    await page.waitForTimeout(1200);
    if (!answered) fail('the bare attempt should have been saved to trainee:<id>');

    // 2. what the trainee is shown
    const shown = await page.evaluate((day) => ({ notice: (document.getElementById('cm-kc-rejected') || {}).innerText || '', p: state.progress[day] }), day);
    if (!/couldn.t be recorded/i.test(shown.notice) || !/take it again/i.test(shown.notice) || !/Take it now/.test(shown.notice) || !/Day 1/.test(shown.notice))
        fail(`the trainee should be told Day 1's Knowledge Check couldn't be recorded and asked to take it again: ${JSON.stringify(shown.notice)}`);
    if (!shown.p || shown.p.score != null || shown.p.done || !shown.p.unrecorded || shown.p.unrecorded.score !== 85)
        fail(`the device's attempt should be kept aside (unrecorded 85) and its score and pass cleared: ${JSON.stringify(shown.p)}`);

    // 3. Take it now, then a real submit
    await page.click('#cm-kc-rejected [data-go]', { timeout: 5000 }).catch(() => fail('the notice should offer Take it now'));
    await page.waitForTimeout(800);
    const o = await page.evaluate(() => ({ mode: state.dayViewMode, submitted: state.quizSubmitted, notice: !!document.getElementById('cm-kc-rejected') }));
    if (o.mode !== 'knowledgeCheck' || o.submitted || o.notice) fail(`Take it now should open the Knowledge Check, fresh: ${JSON.stringify(o)}`);
    const n = await page.evaluate((day) => { const d = DAYS.find(x => x.id === day); state.quizAnswers = {};
        d.quiz.forEach((q, i) => { state.quizAnswers[i] = i < 16 ? q.a : (q.a + 1) % q.opts.length; }); return d.quiz.length; }, day);
    await page.evaluate((day) => window.submitQuiz(day), day);
    await page.waitForTimeout(2500);
    const p = ((await record()).dayProgress || {})[day];
    const want = Math.round(16 / n * 100);
    if (!p || p.score !== want || !p.history || p.history.length !== 1 || !Array.isArray(p.history[0].answers) || p.history[0].answers.length !== n) fail(`the retake should be saved at its own score (${want}%) with its picks: ${JSON.stringify(p)}`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`kc-rejected: an attempt the Worker couldn't record: the trainee is told, the check reopens on the device, and the retake is saved with its picks (${want}%).`);
})().catch(e => { failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); console.error(e); process.exit(1); });
