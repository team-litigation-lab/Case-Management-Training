// @check browser — A Case Flow module's scores stay right: a lower retake keeps the best quiz share, each module counts on one day, the trainer sees the BI/UM Net Sheets, a call answered in one window isn't logged missed by another
// js/cm-case-flow.js, in a real browser, with a signed-in trainee:
//   1. after a trainer's reset (js/cm-kc-reset.js), a lower retake of Day 1's Knowledge Check keeps every module's quiz
//      share from the best attempt (the day keeps its best score, so its modules' Automated half must too); a better
//      retake replaces them;
//   2. cmCaseFlow.scoreSummary() files each module under the one day whose Knowledge Check scores it (its quiz
//      questions), never under the day before where its first lessons are taught;
//   3. the trainer's Case Flow panel shows each Net Sheet stage a module checks: d3m2's settlement, BI and UM sheets,
//      each read from its own file (A, BI, UM);
//   4. the same injected call rings in two windows: answered in one, then declined (or timed out) in the other, it stays
//      answered on the trainee's file; a ring the other window already answered doesn't ring again.
// Usage: node .github/scripts/cf-record-guards.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } }), page = await ctx.newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await signIn(page, 'Gale', 'Guard' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
    await page.evaluate(async () => { const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) }); });
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });
    if (!(await page.evaluate(() => !!state.traineeId && !state.isAdmin))) fail('sign-in did not complete');

    // 1. the best attempt's quiz shares are kept
    const id = await page.evaluate(() => DAYS.find(d => d.cf).id);
    // wrongFrom: the questions from this one on are answered wrong
    const submit = async (wrongFrom) => { await page.evaluate(async ([id, wrongFrom]) => { const d = DAYS.find(x => x.id === id); state.quizAnswers = {};
        d.quiz.forEach((q, i) => { state.quizAnswers[i] = i < wrongFrom ? q.a : (q.a + 1) % q.opts.length; });
        await window.submitQuiz(id); }, [id, wrongFrom]); await sleep(800); };
    const shares = () => page.evaluate(async (id) => { const d = DAYS.find(x => x.id === id), v = await storeGet('case-flow') || {}, o = {};
        [...new Set(d.cf.quizMod)].forEach(m => { o[m] = (((v.modules || {})[m] || {}).quiz || {}).pct; }); return {o, score: (state.progress[id] || {}).score}; }, id);
    await page.evaluate((id) => { state.progress = {}; finishTrainingForDay(id); }, id); await sleep(500);
    await submit(20);   // every answer right
    const s1 = await shares();
    if (s1.score !== 100 || Object.values(s1.o).some(p => p !== 100)) fail(`the first attempt (all right) should give 100% and every module share 100%: ${JSON.stringify(s1)}`);
    // the trainer's reset: the check is open again for one attempt
    await page.evaluate(() => { const R = window.cmKcReset; window.__reopen = R.reopened; R.reopened = () => true; });
    await submit(10);   // half right: the first modules' questions right, the rest wrong
    const s2 = await shares();
    if (s2.score !== 100) fail(`the day should keep its best score (100%) after a lower retake: ${JSON.stringify(s2)}`);
    const dropped = Object.entries(s2.o).filter(([m, p]) => p !== 100);
    if (dropped.length) fail(`a lower retake after a reset lowered module quiz shares the day's best attempt earned: ${JSON.stringify(dropped)}`);
    // a fresh day record (no best yet), a lower attempt, then a better one: the better one's shares replace it
    await page.evaluate((id) => { delete state.progress[id]; }, id);
    await submit(10); const s3 = await shares();
    if (!Object.values(s3.o).some(p => p < 100)) fail(`a first attempt with half wrong should set lower module shares: ${JSON.stringify(s3)}`);
    await submit(20); const s4 = await shares();
    if (Object.values(s4.o).some(p => p !== 100)) fail(`a better retake should replace the module shares: ${JSON.stringify(s4)}`);
    await page.evaluate(() => { window.cmKcReset.reopened = window.__reopen; });

    // 2. each module counts on the day its Knowledge Check scores it
    const filed = await page.evaluate(async () => {
        const v = await storeGet('case-flow') || {modules: {}}; v.modules = v.modules || {};
        DAYS.filter(d => d.cf).forEach(d => d.lessons.forEach(l => { if (l.cf) { const m = v.modules[l.cf.mod.id] = v.modules[l.cf.mod.id] || {answers: [], scale: []}; m.ai = m.ai || {score: 80}; } }));
        await storeSet('case-flow', v); if (typeof loadAll === 'function') await loadAll().catch(() => {});
        const s = cmCaseFlow.scoreSummary(), bad = [], seen = {};
        DAYS.filter(d => d.cf).forEach(d => { const want = [...new Set(d.cf.quizMod)].sort(), got = Object.keys(((s.days || {})[d.cf.n] || {}).modules || {}).sort();
            got.forEach(m => { (seen[m] = seen[m] || []).push(d.cf.n); if (!want.includes(m)) bad.push(`Day ${d.cf.n} has ${m}, which its Knowledge Check doesn't score`); });
            want.forEach(m => { if (!got.includes(m)) bad.push(`Day ${d.cf.n} is missing ${m}, which its Knowledge Check scores`); }); });
        Object.entries(seen).forEach(([m, ns]) => { if (ns.length > 1) bad.push(`${m} counts on Days ${ns.join(' and ')}`); });
        return bad;
    });
    filed.forEach(fail);

    // 3. the trainer's panel shows the BI and UM Net Sheets
    const ns = await page.evaluate(() => {
        const at = new Date().toISOString(), chk = (passed) => ({passed, total: 2, at, items: []});
        const was = {isAdmin: state.isAdmin, tw: state.traineeWork};
        state.isAdmin = true;
        state.traineeWork = {'ns-guard': {snap: {'case-flow': {modules: {}}, 'net-sheet': {v: 2, files: {A: {checks: {recovery: chk(2)}}, BI: {checks: {bi: chk(1)}}, UM: {checks: {um: chk(0)}}}}}, feedback: {days: {}}}};
        let html = '';
        try { html = renderFeedbackAdmin({id: 'ns-guard', name: 'NS Guard', batch: 'B1'}); } catch (e) { html = 'ERR ' + e.message; }
        state.isAdmin = was.isAdmin; state.traineeWork = was.tw;
        return [...html.matchAll(/📊 Net Sheet \(([^)]*)\):<\/b> (\d)\/2/g)].map(m => m[1] + ' ' + m[2]);
    });
    for (const want of ['Track A · settlement 2', 'Track A · Stream 1 BI 1', 'Track A · Stream 2 UM 0'])
        if (!ns.includes(want)) fail(`the trainer's Case Flow panel should show the Net Sheet "${want}/2": ${JSON.stringify(ns)}`);

    // 4. one call, two windows
    const page2 = await ctx.newPage();
    page2.on('pageerror', e => fail(`second window page error: ${e.message}`));
    await page.reload({ waitUntil: 'load' }); await page2.goto(BASE, { waitUntil: 'load' }); await sleep(2500);
    for (const p of [page, page2]) await p.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });
    const target = await page.evaluate(() => { const S = window.CM_CF_SIM || {}; const blockId = Object.keys(S.calls || {})[0];
        const d = DAYS.find(d => d.cf && d.lessons.some(l => l.cf && l.cf.block.id === blockId)); return { dayId: d && d.id, blockId, who: (S.calls[blockId] || {}).who }; });
    const r = { active: true, id: new Date(Date.now() - 1000).toISOString(), at: new Date().toISOString(), dayId: target.dayId, blockId: target.blockId, who: target.who };
    const ring = (p, r) => p.evaluate(async (r) => { await cmCaseFlow.onRing([r]); return !!document.getElementById('cfRing'); }, r);
    if (!(await ring(page, r)) || !(await ring(page2, r))) fail('the injected call should ring in both windows');
    else {
        await page.click('#cfRing .cf-ring-yes'); await sleep(500);
        await page2.click('#cfRing .cf-ring-no'); await sleep(800);
        const logged = await page.evaluate(async (s) => { const v = await storeGet('case-flow'); return v && v.injects && v.injects[s]; }, r.id);
        if (!logged || logged.outcome !== 'answered') fail(`a call answered in one window should stay answered when the other window declines it: ${JSON.stringify(logged)}`);
        // a second ring: answered in the first window, then the second window's check sees it and doesn't ring
        const r2 = Object.assign({}, r, { id: new Date(Date.now() - 500).toISOString() });
        if (await ring(page, r2)) { await page.click('#cfRing .cf-ring-yes'); await sleep(500); }
        await page.evaluate(() => { const o = document.querySelector('.cfx-modal, .cf-call'); if (o) o.remove(); });
        if (await ring(page2, r2)) fail('a call the other window already answered should not ring again');
    }
    await browser.close();
    if (failures.length) { console.error('FAIL\n- ' + failures.join('\n- ')); process.exit(1); }
    console.log('cf-record-guards: OK');
})().catch(e => { console.error(e); process.exit(1); });
