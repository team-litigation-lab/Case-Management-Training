// @check browser — An AI grading that didn't come back is sent again by itself, with no one pressing anything: when the course loads and when the trainee comes back to the tab, with backoff (1 min, 10 min, 1 h, then 6 h), a daily limit and none of the 3 attempts used; work handed in but never graded is graded too; never for a trainer
// js/cm-auto-grade.js over js/cm-ai-grader.js, signed in as a trainee, the AI being the page's own callAIJson, answered here:
//   1. the trainee hands in an activity once and its grading fails (the site's AI connection refused: AI_GATEWAY_SECRET);
//      within the first minute nothing is sent again (backoff), and nothing is asked of the AI;
//   2. the course loads again (loadAll, as a sign-in) a minute later: the grading is sent again by itself; it fails again,
//      and uses none of the 3 attempts; coming back to the tab at once sends nothing (the next wait is 10 minutes);
//   3. once the wait is over and the AI answers, coming back to the tab grades it: 82/100, attempt 1 of 3, the failure cleared;
//   4. the day's limit of failed retries reached, nothing is sent until the next day;
//   5. work handed in and never graded (a draft, no score, no failure) is graded on the next look;
//   6. a trainer's page sends nothing.
// Usage: node .github/scripts/auto-grade.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
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
    await signIn(page, 'Auto', 'Grade' + tag, 'B100926');
    await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });
    check(await page.evaluate(() => !!window.cmAutoGrade && !!window.CMAIGrader), 'window.cmAutoGrade is on the page (js/cm-auto-grade.js)');

    // the AI, answered here: refused (as the Portal refuses AI_GATEWAY_SECRET today), or a grade; every call counted
    await page.evaluate(() => {
        window.__ai = { calls: 0, mode: 'refuse' };
        window.callAIJson = async () => {
            window.__ai.calls++;
            if (window.__ai.mode === 'refuse') throw Object.assign(new Error('AI service error 502: Portal AI gateway: Not allowed.'), { status: 502 });
            return { accuracyScore: 30, presenceScore: 25, riskScore: 17, efficiencyScore: 10, strengths: ['Logged it the same day'], blindspots: [], growthSuggestions: [] };
        };
        const CF = window.CM_CASE_FLOW, all = {};
        CF.days.forEach((d) => d.modules.forEach((m) => m.blocks.forEach((b) => { all[b.id] = b; })));
        window.__acts = CF.sequence.flatMap((s) => s.phases.flatMap((p) => p.blocks)).filter((x, i, a) => (all[x] || {}).kind === 'activity' && a.indexOf(x) === i);
    });
    const rec = (i) => page.evaluate((i) => { const r = ((CMAIGrader.all() || {}).blocks || {})[window.__acts[i]] || {}; return { score: r.score, tries: r.tries || 0, failed: !!r.failed, why: r.failed && r.failed.why }; }, i);
    const calls = () => page.evaluate(() => window.__ai.calls);
    const back = () => page.evaluate(() => document.dispatchEvent(new Event('visibilitychange')));
    // what was kept, moved back in time (as if the minutes had passed): the activity's failure and the backoff's last failure
    const age = (i, mins) => page.evaluate(async ([i, mins]) => {
        const old = new Date(Date.now() - mins * 60000).toISOString();
        const G = JSON.parse(JSON.stringify(CMAIGrader.all())), r = G.blocks[window.__acts[i]];
        if (r && r.failed) r.failed.at = old;
        await storeSet('cf-ai-grades', G);
        const S = (await storeGet('cf-ai-regrade')) || null; if (S && S.last) { S.last = old; await storeSet('cf-ai-regrade', S); }
    }, [i, mins]);

    // 1. handed in once, the grading refused
    await page.evaluate(() => CMAIGrader.submit(window.__acts[0]));
    const r1 = await rec(0), c1 = await calls();
    check(r1.failed && r1.score == null && r1.tries === 0, `the grading that didn't come back is kept as failed, no attempt used: ${JSON.stringify(r1)}`);
    const early = await page.evaluate(() => cmAutoGrade.run('test'));
    check(early.why === 'backing off' && (await calls()) === c1, `within the first minute nothing is sent again: ${JSON.stringify(early)}`);

    // 2. the course loads again a minute later: sent again by itself (and refused again)
    await age(0, 2);
    await page.evaluate(() => loadAll());
    await page.waitForFunction((c) => window.__ai.calls > c, c1, { timeout: 15000 }).catch(() => {});
    const c2 = await calls(), r2 = await rec(0);
    check(c2 === c1 + 1, `when the course loads, the failed grading is sent again with no one pressing anything (${c2 - c1} call)`);
    check(r2.failed && r2.tries === 0, `a retry that fails uses none of the 3 attempts: ${JSON.stringify(r2)}`);
    const S2 = await page.evaluate(() => storeGet('cf-ai-regrade'));
    check(!!S2 && S2.n === 1 && S2.fails === 1, `the backoff is kept: ${JSON.stringify(S2)}`);
    await back(); await sleep(1500);
    check((await calls()) === c2, 'coming back to the tab at once sends nothing: the next wait is 10 minutes');

    // 3. the wait over, the AI answering: coming back to the tab grades it
    await age(0, 11);
    await page.evaluate(() => { window.__ai.mode = 'grade'; return loadAll(); });
    await sleep(200);
    await back();
    await page.waitForFunction((id) => { const r = ((CMAIGrader.all() || {}).blocks || {})[id] || {}; return typeof r.score === 'number'; }, await page.evaluate(() => window.__acts[0]), { timeout: 15000 }).catch(() => {});
    const r3 = await rec(0);
    check(r3.score === 82 && r3.tries === 1 && !r3.failed, `once the AI answers, it is graded by itself: 82/100, attempt 1 of 3, the failure cleared: ${JSON.stringify(r3)}`);
    const S3 = await page.evaluate(() => storeGet('cf-ai-regrade'));
    check(S3 && S3.n === 0, `a grade that comes back resets the backoff: ${JSON.stringify(S3)}`);

    // 4. the day's limit
    const lim = await page.evaluate(async () => {
        window.__ai.mode = 'refuse';
        const G = JSON.parse(JSON.stringify(CMAIGrader.all()));
        G.blocks[window.__acts[1]] = { tries: 0, draft: 'my work', failed: { at: new Date(Date.now() - 86400000 / 2).toISOString(), why: 'x', detail: 'x' } };
        await storeSet('cf-ai-grades', G);
        const S = await storeGet('cf-ai-regrade');
        await storeSet('cf-ai-regrade', Object.assign({}, S, { fails: cmAutoGrade.MAX_FAILS_DAY, n: 9, last: new Date(Date.now() - 86400000 / 2).toISOString() }));
        await loadAll(); const before = window.__ai.calls;
        await new Promise((r) => setTimeout(r, 300));
        const res = await cmAutoGrade.run('test');
        return { res, sent: window.__ai.calls - before };
    });
    check(lim.res.why === "today's retries used" && lim.sent === 0, `with the day's ${6} failed retries used, nothing is sent until tomorrow: ${JSON.stringify(lim)}`);

    // 5. handed in and never graded
    const un = await page.evaluate(async () => {
        window.__ai.mode = 'grade';
        const G = JSON.parse(JSON.stringify(CMAIGrader.all()));
        delete G.blocks[window.__acts[1]];
        G.blocks[window.__acts[2]] = { tries: 0, draft: 'From the platform:\nReference I logged (CMS): 26-0001' };
        await storeSet('cf-ai-grades', G);
        await storeSet('cf-ai-regrade', null);
        await loadAll();
        await new Promise((r) => setTimeout(r, 300));
        const pend = cmAutoGrade.pending().map((x) => x.id);
        const res = await cmAutoGrade.run('test');
        const r = CMAIGrader.all().blocks[window.__acts[2]];
        return { pend, res, score: r.score, tries: r.tries, id: window.__acts[2] };
    });
    check(un.pend.includes(un.id) && un.score === 82 && un.tries === 1, `work handed in and never graded is graded on the next look: ${JSON.stringify(un)}`);

    // 6. a trainer's page sends nothing
    const tr = await page.evaluate(async () => {
        const G = JSON.parse(JSON.stringify(CMAIGrader.all()));
        G.blocks[window.__acts[3]] = { tries: 0, draft: 'x', failed: { at: new Date(Date.now() - 3600000).toISOString(), why: 'x', detail: 'x' } };
        await storeSet('cf-ai-grades', G); await loadAll();
        state.isAdmin = true; const before = window.__ai.calls;
        const res = await cmAutoGrade.run('test');
        state.isAdmin = false;
        return { res, sent: window.__ai.calls - before };
    });
    check(tr.sent === 0 && tr.res.why === 'not here', `a trainer's page sends nothing: ${JSON.stringify(tr)}`);

    // 7. the trainer's Scorecard, open and in view, reads the drive reports and the records again by itself
    const sc = await page.evaluate(async () => {
        const was = { ld: window.loadDriveReports, rl: cmScorecard.reload, view: state.view, ad: state.adminData };
        const n = { ld: 0, rl: 0 };
        window.loadDriveReports = async () => { n.ld++; }; cmScorecard.reload = async () => { n.rl++; };
        state.isAdmin = true; state.view = 'scorecard'; state.adminData = [{ id: 'x' }];
        const ran = await cmAutoGrade.trainerTick(true);
        state.view = 'dashboard'; const off = await cmAutoGrade.trainerTick(true);
        Object.assign(state, { isAdmin: false, view: was.view, adminData: was.ad }); window.loadDriveReports = was.ld; cmScorecard.reload = was.rl;
        return { ran, off, n };
    });
    check(sc.ran && sc.n.ld === 1 && sc.n.rl === 1 && !sc.off, `the trainer's Scorecard reads the drive grades and the records again by itself (and nothing off the Scorecard): ${JSON.stringify(sc)}`);

    await browser.close();
    if (failures.length) { console.log(`\n✗ Auto-grade (${failures.length}):\n  ` + failures.join('\n  ')); process.exit(1); }
    console.log('\nAuto-grade: a failed AI grading is sent again by itself, with backoff and a daily limit, using none of the attempts; work never graded is graded; never on a trainer\'s page.');
})().catch((e) => { console.error(e); process.exit(1); });
