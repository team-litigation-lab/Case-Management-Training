// @check browser — ✍️ The Knowledge Check the page builds is the key the Worker scores with (worker-kc-key.js): every day's questions, right options and modules, and a real submit is recorded at the page's own score with nothing flagged
// The Worker scores a trainee's attempt from its own picks (worker-identity.js kcScore). This holds the page to it:
//   1. for each Case Flow day, the page's quiz (DAYS[i].quiz, without a trainer's extra questions) has the key's right
//      options in the key's order, and DAYS[i].cf.quizMod is the key's modules;
//   2. a trainee's own submit (13 of 20 right) is recorded on trainee:<id> at 65% with its picks, and no `claimed` (the
//      score the page worked out is the Worker's);
//   3. the Case Flow summary on the record has the Worker's modules: no 40% (t) or Composite (c) the page set.
// Usage: node .github/scripts/kc-key-page.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const { KC_KEY } = require('./kc-picks.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Kim', 'Keyed', 'B111926');

    // 1. the page's quizzes are the key
    const days = await page.evaluate(() => DAYS.map(d => ({ id: d.id, a: d.quiz.filter(q => !q.__extra).map(q => q.a), mod: (d.cf && d.cf.quizMod) || [] })));
    if (days.length !== Object.keys(KC_KEY).length) fail(`the page has ${days.length} days, the key ${Object.keys(KC_KEY).length}`);
    days.forEach(d => {
        const k = KC_KEY[String(d.id)];
        if (!k) { fail(`Day ${d.id} has no key: run node build/case-flow/build.cjs`); return; }
        if (JSON.stringify(k.a) !== JSON.stringify(d.a)) fail(`Day ${d.id}: the page's right options ${JSON.stringify(d.a)} aren't the key's ${JSON.stringify(k.a)}`);
        if (JSON.stringify(k.mod) !== JSON.stringify(d.mod.slice(0, k.mod.length))) fail(`Day ${d.id}: the page's modules ${JSON.stringify(d.mod)} aren't the key's ${JSON.stringify(k.mod)}`);
    });

    // 2. a real submit
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    const id = await page.evaluate(() => DAYS[0].id);
    await page.evaluate((id) => { state.progress = {}; finishTrainingForDay(id); }, id);
    await page.waitForTimeout(500);
    const n = await page.evaluate((id) => { const d = DAYS.find(x => x.id === id); state.quizAnswers = {};
        d.quiz.forEach((q, i) => { state.quizAnswers[i] = i < 13 ? q.a : (q.a + 1) % q.opts.length; }); return d.quiz.length; }, id);
    await page.evaluate((id) => window.submitQuiz(id), id);
    await page.waitForTimeout(2500);
    const rec = await page.evaluate(async () => {
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'trainee:' + state.traineeId }) }).then(r => r.json());
        return JSON.parse(r.value || '{}');
    });
    const p = (rec.dayProgress || {})[id], want = Math.round(13 / n * 100);
    if (!p || p.score !== want || !p.history || p.history.length !== 1) fail(`the submit should be recorded on the server at ${want}%: ${JSON.stringify(p)}`);
    else {
        if (!Array.isArray(p.history[0].answers) || p.history[0].answers.length !== n) fail(`the attempt should carry its ${n} picks: ${JSON.stringify(p.history[0])}`);
        if ('claimed' in p.history[0]) fail(`the page's score and the Worker's should agree (nothing claimed): ${JSON.stringify(p.history[0])}`);
    }

    // 3. the summary's modules are the Worker's
    await page.waitForTimeout(1500);
    const cf = await page.evaluate(async () => {
        if (window.cmCaseFlow && typeof window.cmCaseFlow.saveSummary === 'function') await window.cmCaseFlow.saveSummary();
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'trainee:' + state.traineeId }) }).then(r => r.json());
        return (JSON.parse(r.value || '{}').caseFlow || null);
    });
    if (cf && cf.days) Object.values(cf.days).forEach(d => Object.entries((d && d.modules) || {}).forEach(([m, s]) => {
        if (s && (s.t != null || s.c != null)) fail(`module ${m} has a 40% or Composite no trainer gave: ${JSON.stringify(s)}`);
    }));

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`The page's Knowledge Checks are the Worker's key (${days.length} days), and a submit is recorded at the page's own score (${want}%) with its picks, nothing claimed.`);
})().catch(e => { console.error(e); process.exit(1); });
