// @check browser — A Knowledge Check takes one attempt: the first score is recorded, a second submit is refused, no Retake
// Knowledge Checks are one attempt only (js/cm-kc-once.js):
//   1. a trainee's first submit is recorded (the score, one attempt in the history, saved to their record on the server);
//   2. a second submit, with every answer right, is refused: the score and the history don't change, and the page says
//      "One attempt only — your score is recorded.";
//   3. the results have no Retake Quiz button and no "retake" wording; ✓ Finish Training, 🔁 Retake and retakeQuiz show the
//      recorded result instead of a fresh quiz;
//   4. on the day card, 🔁 Retake stays but is locked ("Ask your trainer to reopen this check"); 👁 Review Score works;
//   5. a second device (nothing on it yet) can't take it again either: the record on the server is read before a submit;
//   6. a trainer is not limited.
// Usage: node .github/scripts/kc-once.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Una', 'Attempt', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    if (!(await page.evaluate(() => typeof state !== 'undefined' && !!state.traineeId && !state.isAdmin))) fail('sign-in did not complete');
    if (!(await page.evaluate(() => !!window.cmKcOnce))) fail('js/cm-kc-once.js is not loaded');

    // 1. the first attempt: 13 of 20 right (65%)
    const id = await page.evaluate(() => DAYS[0].id);
    const answer = (right) => page.evaluate(([id, right]) => { const d = DAYS.find(x => x.id === id); state.quizAnswers = {};
        d.quiz.forEach((q, i) => { state.quizAnswers[i] = i < right ? q.a : (q.a + 1) % q.opts.length; }); return d.quiz.length; }, [id, right]);
    await page.evaluate((id) => { state.progress = {}; finishTrainingForDay(id); }, id);
    await page.waitForTimeout(500);
    const n = await answer(13);
    await page.evaluate((id) => window.submitQuiz(id), id);
    await page.waitForTimeout(1500);
    const first = await page.evaluate((id) => state.progress[id], id);
    const want = Math.round(13 / n * 100);
    if (!first || first.score !== want || (first.history || []).length !== 1) fail(`the first attempt should be recorded (${want}%, one attempt): ${JSON.stringify(first)}`);

    // 3. the results: no Retake Quiz, no retake wording, and the rule said
    const res = await page.evaluate(() => ({ retake: !!document.querySelector('[onclick^="retakeQuiz"]'), text: (document.querySelector('#quizWrap') || document.body).innerText }));
    if (res.retake) fail('the results should have no Retake Quiz button');
    if (/\bretake\b/i.test(res.text)) fail(`the results should not invite a retake: "${(res.text.match(/.{0,60}retake.{0,60}/i) || [''])[0]}"`);
    if (!/One attempt only/.test(res.text)) fail('the results should say "One attempt only — your score is recorded."');

    // 2. a second submit, every answer right: refused
    await answer(n);
    await page.evaluate((id) => window.submitQuiz(id), id);
    await page.waitForTimeout(1200);
    const second = await page.evaluate((id) => ({ p: state.progress[id], text: document.body.innerText, submitted: state.quizSubmitted, score: state.lastScore }), id);
    if (!second.p || second.p.score !== want || (second.p.history || []).length !== 1) fail(`a second submit should be refused, the first score kept: ${JSON.stringify(second.p)}`);
    if (!second.submitted || second.score !== want) fail(`a refused submit should show the recorded result (${want}%): ${second.score}`);
    const onServer = await page.evaluate(async () => { const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'trainee:' + state.traineeId }) }).then(r => r.json()); return JSON.parse(r.value || '{}').dayProgress || {}; });
    const sp = onServer[id] || {};
    if (sp.score !== want || (sp.history || []).length !== 1) fail(`the trainee's record should hold the one attempt (${want}%): ${JSON.stringify(sp)}`);

    // 3b. ✓ Finish Training / Retake / retakeQuiz: the recorded result, never a fresh quiz
    for (const how of ['finishTrainingForDay', 'retakeQuiz']) {
        const r = await page.evaluate(([id, how]) => { state.quizSubmitted = false; state.quizAnswers = {}; if (how === 'retakeQuiz') { goto('day', id); state.dayViewMode = 'knowledgeCheck'; render(); } window[how](id); render();
            return { submitted: state.quizSubmitted, score: state.lastScore, game: !!document.querySelector('.cfg-card, .cfg-jb, .quiz-card .quiz-opts') }; }, [id, how]);
        await page.waitForTimeout(300);
        if (!r.submitted || r.score !== want || r.game) fail(`${how} should show the recorded ${want}%, not a fresh quiz: ${JSON.stringify(r)}`);
    }

    // 4. the day card: 🔁 Retake locked, 👁 Review Score open
    await page.evaluate(() => { goto('dashboard'); render(); });
    await page.waitForTimeout(500);
    const card = await page.evaluate((id) => { const c = document.getElementById('module-' + id); if (!c) return null;
        const b = [...c.querySelectorAll('button')], rt = b.find(x => /Retake/.test(x.textContent)), rs = b.find(x => /Review Score/.test(x.textContent));
        return { retake: rt ? { dis: rt.getAttribute('aria-disabled'), title: rt.title } : null, score: rs ? rs.getAttribute('aria-disabled') : 'missing' }; }, id);
    if (!card) fail('no day card for the first day');
    else {
        if (!card.retake || card.retake.dis !== 'true' || !/Ask your trainer to reopen this check/.test(card.retake.title)) fail(`🔁 Retake should stay on the card, locked, with "Ask your trainer to reopen this check": ${JSON.stringify(card.retake)}`);
        if (card.score === 'true' || card.score === 'missing') fail(`👁 Review Score should open the recorded score: ${card.score}`);
    }

    // 5. a second device: nothing on it, but the record has the attempt
    await page.evaluate(async (id) => { state.progress = {}; finishTrainingForDay(id); }, id);
    await page.waitForTimeout(400);
    await answer(n);
    await page.evaluate((id) => window.submitQuiz(id), id);
    await page.waitForTimeout(1200);
    const dev2 = await page.evaluate((id) => state.progress[id], id);
    if (!dev2 || dev2.score !== want || (dev2.history || []).length !== 1) fail(`a second device should be refused too (the record already has the attempt): ${JSON.stringify(dev2)}`);

    // 6. a trainer is not limited
    const tr = await page.evaluate((id) => { state.isAdmin = true; const t = cmKcOnce.taken(id); state.isAdmin = false; return t; }, id);
    if (tr) fail('a trainer should be able to take a check again');

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Knowledge Checks take one attempt: the first score is recorded (here and on the record), a second submit is refused on this device and on another, the results have no Retake, and the day card keeps 🔁 Retake locked.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
