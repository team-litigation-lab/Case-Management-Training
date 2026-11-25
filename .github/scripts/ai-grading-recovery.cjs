// @check browser — An AI grading that doesn't come back is never a silent blank: the AI Grader says why (in plain words and as the service gave it), keeps it on the activity without using an attempt, and the trainer's 📅 Day by Day lists it as handed in, not graded; a takeaway review that didn't complete is run again once a session for the days whose Knowledge Check is taken (never for a trainer), and its score reaches the day's 📝 Takeaways; and Admin → ⚙ Settings has 🤖 AI check, which says plainly whether AI grading works here and what to set where
// js/cm-ai-grader.js (whyNotGraded, failed), js/cm-takeaway-catchup.js and js/cm-batch-sheet.js (dayParts), signed in as a trainee:
//   1. cmWhyNotGraded names each failure the page meets: too long (413), the shared AI budget (429), the AI connection
//      refused (the gateway's "Not allowed."), too slow, an answer cut off (bad JSON), unreachable;
//   2. an AI Grader submission whose grading fails (the AI is made to answer 429, the shared budget) keeps the reason on
//      cf-ai-grades (failed: why, detail), gives no score and uses none of the 3 attempts; graded on the next try, it is cleared;
//   3. 📅 Day by Day (cmBatchSheet.dayParts) lists that activity as 🧪 "Handed in, not graded", with the reason;
//   4. a Case Flow day whose Knowledge Check is taken and whose written takeaway has no AI review is pending; the catch-up
//      reviews it (the AI made to answer 82%), the review lands on the trainee's case-flow record and the day's takeaway
//      score (state.progress[day].takeaway) is 82, nothing is pending then, a second run in the session does nothing, and a
//      trainer's run does nothing; a review that fails again stays pending, for the next session.
// The AI is the page's own callAIJson, answered here (the Worker's gateway is .github/scripts/ai-gateway-grading.cjs).
// Usage: node .github/scripts/ai-grading-recovery.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', (e) => failures.push(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(700);
    const tag = String(Date.now()).slice(-6).replace(/\d/g, (d) => 'abcdefghij'[d]);
    await signIn(page, 'Grading', 'Recovery' + tag, 'B100926');
    await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });

    // 1. the reasons
    const why = await page.evaluate(() => {
        const W = window.cmWhyNotGraded; if (!W) return null;
        const err = (status, message) => Object.assign(new Error(message), { status });
        return {
            long: W(err(413, 'AI service error 413: Portal AI gateway: Request is too long.')),
            budget: W(err(429, "AI service error 429: rate limit (shared AI budget): This call flow has used its share of today’s shared AI budget so the others keep theirs.")),
            refused: W(err(502, 'AI service error 502: Portal AI gateway: Not allowed.')),
            slow: W(new Error('Request timed out — the service took too long to respond.')),
            cut: W(new SyntaxError('Unexpected end of JSON input')),
            gone: W(err(502, 'AI service error 502: The shared AI gateway is unreachable: fetch failed'))
        };
    });
    check(!!why, 'window.cmWhyNotGraded is on the page (js/cm-ai-grader.js)');
    if (why) {
        check(/longer than the grader takes/.test(why.long), `a request too long reads as such: "${why.long}"`);
        check(/grading budget/.test(why.budget), `the shared AI budget reads as such: "${why.budget}"`);
        check(/connection was refused.*trainer/.test(why.refused), `the gateway refusing the site reads as "tell your trainer": "${why.refused}"`);
        check(/took too long/.test(why.slow), `a timeout reads as such: "${why.slow}"`);
        check(/incomplete/.test(why.cut), `an answer cut off reads as such: "${why.cut}"`);
        check(/couldn't be reached/.test(why.gone), `an unreachable gateway reads as such: "${why.gone}"`);
    }

    // 2. an AI Grader submission whose grading fails, then succeeds
    const aig = await page.evaluate(async () => {
        const CF = window.CM_CASE_FLOW, all = {};
        CF.days.forEach((d) => d.modules.forEach((m) => m.blocks.forEach((b) => { all[b.id] = b; })));
        const id = CF.sequence.find((s) => s.n === 1).phases.flatMap((p) => p.blocks).find((x) => (all[x] || {}).kind === 'activity');
        const real = window.callAIJson;
        const read = async () => (((await storeGet('cf-ai-grades')) || {}).blocks || {})[id] || {};
        window.callAIJson = async () => { throw Object.assign(new Error("AI service error 429: rate limit (shared AI budget): This call flow has used its share of today’s shared AI budget so the others keep theirs."), { status: 429 }); };
        await CMAIGrader.submit(id);
        const failed = await read();
        window.callAIJson = async () => ({ accuracyScore: 30, presenceScore: 25, riskScore: 17, efficiencyScore: 10, strengths: ['Logged it the same day'], blindspots: [], growthSuggestions: [] });
        await CMAIGrader.submit(id);
        const graded = await read();
        window.callAIJson = real;
        return { id, title: all[id].title, failed: { why: failed.failed && failed.failed.why, detail: failed.failed && failed.failed.detail, score: failed.score, tries: failed.tries || 0 },
            graded: { score: graded.score, tries: graded.tries || 0, failed: !!graded.failed } };
    });
    check(/grading budget/.test(aig.failed.why || '') && /429/.test(aig.failed.detail || ''), `a failed grading keeps its reason on the activity (${aig.id}): ${JSON.stringify(aig.failed)}`);
    check(aig.failed.score == null && aig.failed.tries === 0, `a failed grading gives no score and uses none of the 3 attempts: ${JSON.stringify(aig.failed)}`);
    check(aig.graded.score === 82 && aig.graded.tries === 1 && !aig.graded.failed, `graded on the next try, the reason is cleared: ${JSON.stringify(aig.graded)}`);

    // 3. the trainer's 📅 Day by Day lists an activity handed in but not graded
    const rows = await page.evaluate(({ id }) => {
        const d1 = DAYS.find((d) => d.cf && d.cf.n === 1);
        const parts = (blocks) => window.cmBatchSheet.dayParts({ id: 'probe', name: 'Probe', dayProgress: {}, caseFlow: { days: {} }, __extra: { data: { 'cf-ai-grades': { v: 1, blocks } } } }, d1)
            .filter((p) => p.grp === 'sa').map((p) => ({ name: p.name, pct: p.pct, status: p.status, why: p.why }));
        const failed = { draft: 'my work', failed: { at: new Date().toISOString(), why: 'the shared AI budget is busy or used up for now, so try again later', detail: 'AI service error 429: rate limit' } };
        return { failed: parts({ [id]: failed }), graded: parts({ [id]: Object.assign({}, failed, { score: 80 }) }) };
    }, aig);
    const row = rows.failed.find((r) => r.name.includes(aig.title));
    check(!!row && row.pct == null && /Handed in, not graded/.test(row.status) && /AI budget/.test(row.why), `📅 Day by Day lists the activity as handed in, not graded, with the reason: ${JSON.stringify(rows.failed)}`);
    check(!rows.graded.some((r) => /not graded/.test(r.status)), 'an activity that has its grade is not listed as not graded');

    // 4. the takeaway catch-up
    const tk = await page.evaluate(async () => {
        const d1 = DAYS.find((d) => d.cf && d.cf.n === 1), d2 = DAYS.find((d) => d.cf && d.cf.n === 2);
        const kcMod = (d) => { const all = d.lessons.filter((l) => l.cf && l.cf.block && l.cf.block.kind === 'check'); return all[all.length - 1].cf.mod.id; };
        const take = 'Verify the coverage stack in order, log every call the same day, and escalate the treatment gap to the attorney before it costs the claim.';
        const rec = (await storeGet('case-flow')) || { v: 1, modules: {} }; rec.modules = rec.modules || {};
        rec.modules[kcMod(d1)] = { answers: [take], scale: [] };
        await storeSet('case-flow', rec);
        const prog = Object.assign({}, state.progress, { [d1.id]: { done: true, score: 85, date: new Date().toISOString() } });
        await storeSet('day-progress', prog);
        await loadAll();
        const real = window.callAIJson, out = {};
        out.pendingBefore = (await cmTakeawayCatchup.pending()).map((d) => d.cf.n);
        // a trainer's run does nothing
        state.isAdmin = true; sessionStorage.removeItem('lsh_takeaway-catchup');
        out.trainerRan = await cmTakeawayCatchup.run(); state.isAdmin = false;
        window.callAIJson = async () => ({ accuracyScore: 30, presenceScore: 25, riskScore: 17, efficiencyScore: 10, strengths: [], blindspots: [], growthSuggestions: [] });
        sessionStorage.removeItem('lsh_takeaway-catchup');
        out.ran = await cmTakeawayCatchup.run();
        const after = await storeGet('case-flow');
        out.ai = ((after.modules[kcMod(d1)] || {}).ai || {}).score;
        out.takeaway = (state.progress[d1.id] || {}).takeaway;
        out.pendingAfter = (await cmTakeawayCatchup.pending()).map((d) => d.cf.n);
        out.again = await cmTakeawayCatchup.run();
        // a review that fails again stays pending, for the next session
        const rec2 = await storeGet('case-flow'); rec2.modules[kcMod(d2)] = { answers: [take], scale: [] }; await storeSet('case-flow', rec2);
        await storeSet('day-progress', Object.assign({}, state.progress, { [d2.id]: { done: true, score: 80, date: new Date().toISOString() } }));
        await loadAll();
        window.callAIJson = async () => { throw Object.assign(new Error('AI service error 502: Portal AI gateway: Not allowed.'), { status: 502 }); };
        sessionStorage.removeItem('lsh_takeaway-catchup');
        await cmTakeawayCatchup.run();
        out.stillPending = (await cmTakeawayCatchup.pending()).map((d) => d.cf.n);
        window.callAIJson = real;
        return out;
    });
    check(JSON.stringify(tk.pendingBefore) === '[1]', `Day 1, its Knowledge Check taken and its takeaway written but not reviewed, is pending: ${JSON.stringify(tk.pendingBefore)}`);
    check(tk.trainerRan === 0, `a trainer's run reviews nothing (${tk.trainerRan})`);
    check(tk.ran >= 1 && tk.ai === 82 && tk.takeaway === 82, `the catch-up reviews it: the review is on the case-flow record (${tk.ai}) and Day 1's takeaway score is 82 (${tk.takeaway})`);
    check(JSON.stringify(tk.pendingAfter) === '[]' && tk.again === 0, `then nothing is pending (${JSON.stringify(tk.pendingAfter)}) and a second run this session does nothing (${tk.again})`);
    check(JSON.stringify(tk.stillPending) === '[2]', `a review that fails again stays pending for the next session: ${JSON.stringify(tk.stillPending)}`);

    // 5. 🤖 the AI check on Admin → ⚙ Settings (this test server has no AI set up: it must say so, and what to set where)
    await page.evaluate(async () => { state.isAdmin = true; state.adminTab = 'settings'; goto('admin'); render(); await new Promise((r) => setTimeout(r, 300)); render(); });
    const card0 = await page.evaluate(() => { const c = document.getElementById('aiCheck'); return c ? { text: c.innerText, btn: !!c.querySelector('button') } : null; });
    check(!!card0 && card0.btn && /AI check/.test(card0.text), `Admin → ⚙ Settings shows 🤖 AI check with its button: ${JSON.stringify(card0)}`);
    if (card0) {
        await page.click('#aiCheck button');
        await page.waitForFunction(() => { const c = document.getElementById('aiCheck'); return c && /✅|❌/.test(c.innerText); }, null, { timeout: 20000 }).catch(() => {});
        const card1 = await page.evaluate(() => (document.getElementById('aiCheck') || {}).innerText || '');
        check(/❌ AI grading doesn't work right now: No AI is set up/.test(card1) && /AI_GATEWAY_SECRET/.test(card1), `run here, the AI check says no AI is set up and what to set: ${card1.replace(/\s+/g, ' ').slice(0, 300)}`);
    }

    await browser.close();
    if (failures.length) { console.log(`\n✗ AI grading recovery (${failures.length}):\n  ` + failures.join('\n  ')); process.exit(1); }
    console.log('\nAI grading recovery: a failed grading says why, keeps it without using an attempt and shows as handed in, not graded; an unreviewed takeaway is reviewed again once a session and its score reaches the day.');
})().catch((e) => { console.error(e); process.exit(1); });
