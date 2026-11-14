// @check browser — A trainer's 🔁 Reset Knowledge Check (Trainee Audit → a trainee's detail) gives the trainee one new attempt: Retake unlocks once, the best score is kept, every reset is logged
// js/cm-kc-reset.js, with js/cm-kc-once.js and worker.js keepKcAttempts (kcRetake), in a real browser:
//   1. a trainee takes Case Flow Day 1's Knowledge Check (65%); 🔁 Retake on the day card is locked, its tooltip "Ask
//      your trainer to reset this check";
//   2. the trainer opens the trainee's detail in 👥 Trainee Audit: "🔁 Reset Knowledge Check" on Day 1 (none on a day
//      with no attempt); pressing it writes trainee:<id>.kcReset[day] {at, by, log} and the detail shows "⏳ Reopened"
//      and the log line (who, when);
//   3. the trainee's page picks it up: 🔁 Retake unlocks, the check opens fresh, the new attempt (90%) is recorded on the
//      server (two attempts, score 90, done);
//   4. once used, the check is closed again: a third submit is refused, 🔁 Retake locked; the trainer may reset again;
//   5. a second reset and a lower score (40%) keep the best score (90%); the log holds both resets.
// Usage: node .github/scripts/kc-reset.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    // the trainee
    const tc = await browser.newContext({ viewport: { width: 1366, height: 768 } }), tp = await tc.newPage();
    tp.on('pageerror', e => fail(`trainee page error: ${e.message}`));
    await tp.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    const last = 'Reset' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
    await signIn(tp, 'Kira', last, 'B100926');
    await tp.evaluate(async () => { const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) }); });
    await tp.reload({ waitUntil: 'load' }); await sleep(1500);
    const tid = await tp.evaluate(() => state.traineeId), id = await tp.evaluate(() => DAYS[0].id);
    if (!(await tp.evaluate(() => !!window.cmKcReset))) fail('js/cm-kc-reset.js is not loaded');
    const answer = (right) => tp.evaluate(([id, right]) => { const d = DAYS.find(x => x.id === id); state.quizAnswers = {};
        d.quiz.forEach((q, i) => { state.quizAnswers[i] = i < right ? q.a : (q.a + 1) % q.opts.length; }); return d.quiz.length; }, [id, right]);
    const serverDay = () => tp.evaluate(async (id) => { const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'trainee:' + state.traineeId }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); return { p: (rec.dayProgress || {})[id] || null, reset: rec.kcReset || null }; }, id);
    const retake = () => tp.evaluate((id) => { goto('dashboard'); render(); const c = document.getElementById('module-' + id); const b = c && [...c.querySelectorAll('button')].find(x => /Retake/.test(x.textContent));
        return b ? { locked: b.getAttribute('aria-disabled') === 'true', title: b.title } : null; }, id);
    const submit = async (right) => { const n = await answer(right); await tp.evaluate((id) => window.submitQuiz(id), id); await sleep(1500); return n; };

    // 1. the first attempt: 13 of 20
    await tp.evaluate((id) => { state.progress = {}; finishTrainingForDay(id); }, id); await sleep(500);
    const n = await submit(13), want1 = Math.round(13 / n * 100), want2 = Math.round(18 / n * 100);
    let s = await serverDay();
    if (!s.p || s.p.score !== want1 || s.p.history.length !== 1) fail(`the first attempt should be on the record (${want1}%): ${JSON.stringify(s.p)}`);
    let rt = await retake();
    if (!rt || !rt.locked || rt.title !== 'Ask your trainer to reset this check') fail(`🔁 Retake should be locked, "Ask your trainer to reset this check": ${JSON.stringify(rt)}`);

    // 2. the trainer's 🔁 Reset Knowledge Check, in the trainee's detail
    const ac = await browser.newContext({ viewport: { width: 1440, height: 900 } }), ap = await ac.newPage();
    ap.on('pageerror', e => fail(`trainer page error: ${e.message}`));
    ap.on('dialog', d => d.accept());
    await ap.goto(BASE, { waitUntil: 'load' }); await sleep(1000);
    const detail = async () => {
        await ap.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); state.isAdmin = true; state.adminData = null; state.adminTab = 'traineeaudit'; goto('admin'); render(); });
        await ap.waitForSelector('#adminRowsWrap .at-table', { timeout: 15000 }); await sleep(1200);
        await ap.evaluate((tid) => { state.adminExpandedId = null; cmAudit.toggle(tid); }, tid); await sleep(400);
        return ap.evaluate((id) => { const p = document.querySelector('.kcr-panel'); if (!p) return null;
            const row = [...p.querySelectorAll('.kcr-row')].find(r => r.querySelector('.kcr-h > b').textContent === 'Case Flow Day ' + DAYS.find(x => x.id === id).cf.n);
            return { text: p.innerText, btn: !!p.querySelector(`[data-kcr-day="${id}"]`), btns: p.querySelectorAll('.kcr-btn').length, wait: !!(row && row.querySelector('.kcr-wait')), log: row ? [...row.querySelectorAll('.kcr-log li')].map(x => x.textContent) : [] }; }, id);
    };
    let d = await detail();
    if (!d) fail('the trainee\'s detail has no 🔁 Knowledge Check resets panel');
    else {
        if (!d.btn || d.btns !== 1) fail(`🔁 Reset Knowledge Check should be on Day 1 only (the one day with an attempt): ${d.btns} buttons`);
        await ap.click(`.kcr-panel [data-kcr-day="${id}"]`); await sleep(1200);
        d = await detail();
        if (!d.wait || d.btn) fail(`after the reset the detail should say ⏳ Reopened, with no second reset until it is used: ${d.text}`);
        if (d.log.length !== 1 || !/🔁 Reset .+ by /.test(d.log[0])) fail(`the reset should be logged, who and when: ${JSON.stringify(d.log)}`);
    }
    s = await serverDay();
    if (!s.reset || !s.reset[id] || !s.reset[id].at || !s.reset[id].by || (s.reset[id].log || []).length !== 1) fail(`kcReset should be on the trainee's record: ${JSON.stringify(s.reset)}`);

    // 3. the trainee: Retake unlocks once, a fresh check, the new attempt recorded
    await tp.reload({ waitUntil: 'load' }); await sleep(1800);
    rt = await retake();
    if (!rt || rt.locked) fail(`after a reset 🔁 Retake should unlock: ${JSON.stringify(rt)}`);
    const fresh = await tp.evaluate((id) => { finishTrainingForDay(id); render(); return { submitted: state.quizSubmitted, mode: state.dayViewMode }; }, id);
    await sleep(600);
    if (fresh.submitted || fresh.mode !== 'knowledgeCheck') fail(`the reopened check should open fresh, not on the recorded result: ${JSON.stringify(fresh)}`);
    await submit(18);
    s = await serverDay();
    if (!s.p || s.p.history.length !== 2 || s.p.score !== want2 || !s.p.done) fail(`the new attempt (${want2}%) should be recorded, the best score kept: ${JSON.stringify(s.p)}`);
    const local = await tp.evaluate((id) => state.progress[id].score, id);
    if (local !== want2) fail(`the trainee's page should show the best score (${want2}%): ${local}`);

    // 4. used: a third submit refused, Retake locked again; the trainer may reset again
    await tp.evaluate((id) => { finishTrainingForDay(id); }, id); await sleep(400);
    await submit(20);
    s = await serverDay();
    if (s.p.history.length !== 2 || s.p.score !== want2) fail(`a used reset should allow no third attempt: ${JSON.stringify(s.p)}`);
    rt = await retake();
    if (!rt || !rt.locked) fail(`once used, 🔁 Retake should be locked again: ${JSON.stringify(rt)}`);
    d = await detail();
    if (!d || !d.btn || d.wait) fail(`once the new attempt is in, the trainer may reset again: ${d && d.text}`);

    // 5. a second reset and a lower score: the best score stays
    await ap.click(`.kcr-panel [data-kcr-day="${id}"]`); await sleep(1200);
    await tp.reload({ waitUntil: 'load' }); await sleep(1800);
    await tp.evaluate((id) => { finishTrainingForDay(id); }, id); await sleep(500);
    await submit(8);
    s = await serverDay();
    if (s.p.history.length !== 3 || s.p.score !== want2 || !s.p.done) fail(`a lower retake should keep the best score (${want2}%): ${JSON.stringify(s.p)}`);
    d = await detail();
    if (!d || d.log.length !== 2) fail(`the log should hold both resets: ${JSON.stringify(d && d.log)}`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`🔁 Reset Knowledge Check: locked Retake asks for the trainer; the trainer's reset (logged, who and when) gives one new attempt; the best score is kept (${want1}% → ${want2}%, a later ${Math.round(8 / n * 100)}% leaves ${want2}%); a used reset reopens nothing.`);
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
