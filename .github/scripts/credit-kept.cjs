// @check browser — Credit kept: a Net Sheet stage that tied out stays tied out ("tied out on <date>"), the Scorecard reads the best stored result, case exercises keep the score they were handed in with, a passed day stays passed
// js/cm-credit-kept.js, with js/cm-net-sheet.js and js/cm-scorecard.js:
//   1. the Net Sheet (net-sheet.html): a stage that tied out, checked again on a blank sheet, keeps its tie-out as the
//      result (the lower check is kept as .last and shown line by line), the box says "tied out on <date>", and Start
//      over clears the cells but never the results;
//   2. the course page: a save of the sheet with a lower result for a stage (an older copy in another tab) keeps the
//      stored best; the Scorecard credits a stage with its best stored result (the result or its .last);
//   3. case exercises: the records screening handed in before RS97 and RS98 were added is scored on the 11 records it
//      was done against; a score stamped when handed in ({kept}) is the one read, whatever the answer key says since;
//      saving the Case Flow record stamps the exhibit audits, the screening and the judgement calls once;
//   4. a Knowledge Check passed on any attempt keeps the day passed (kcPassed).
// Usage: node .github/scripts/credit-kept.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    page.on('dialog', d => d.accept());

    // 1. the Net Sheet: a tie-out stays
    await page.goto(BASE + 'net-sheet.html?stage=recovery', { waitUntil: 'load' });
    await page.waitForSelector('#ns .ns-in');
    const tiedAt = '2026-11-10T15:00:00.000Z';
    await page.evaluate((tiedAt) => {
        const n = CMNetSheet.STAGES.recovery.checks.length;
        localStorage.setItem('lsh_net-sheet', JSON.stringify({ v: 2, blankLedger: 1, files: { A: { cells: {}, checks: { recovery: { passed: n, total: n, at: tiedAt, items: CMNetSheet.STAGES.recovery.checks.map(c => ({ cell: c.cell, ok: true, got: c.want })) } } } } }));
    }, tiedAt);
    await page.reload({ waitUntil: 'load' }); await page.waitForSelector('#ns .ns-in');
    if (!(await page.evaluate(() => !!window.cmCreditKept))) fail('net-sheet.html should load js/cm-credit-kept.js');
    await page.evaluate(() => { const s = document.querySelector('#ns-stage'); s.value = 'recovery'; s.dispatchEvent(new Event('change')); CMNetSheet.check(); });
    await page.waitForTimeout(500);
    const n1 = await page.evaluate(() => { const r = CMNetSheet.sheet.checks.recovery; return { passed: r.passed, total: r.total, tiedAt: r.tiedAt, last: r.last && { passed: r.last.passed, total: r.last.total }, box: document.querySelector('#ns-check').innerText }; });
    if (n1.passed !== n1.total) fail(`a stage that tied out should stay tied out after a lower check: ${n1.passed}/${n1.total}`);
    if (n1.tiedAt !== tiedAt) fail(`the stage should keep when it tied out (${tiedAt}): ${n1.tiedAt}`);
    if (!n1.last || n1.last.passed >= n1.total) fail(`the lower check should be kept as .last: ${JSON.stringify(n1.last)}`);
    if (!/tied out on/i.test(n1.box)) fail(`the check box should say "tied out on <date>": "${n1.box.slice(0, 160)}"`);
    if (!/tie out/.test(n1.box) || !/✗/.test(n1.box)) fail('the box should still show the latest check line by line');
    await page.evaluate(() => document.querySelector('#ns-reset').click());
    await page.waitForTimeout(500);
    const n2 = await page.evaluate(() => { const r = (CMNetSheet.sheet.checks || {}).recovery; const saved = JSON.parse(localStorage.getItem('lsh_net-sheet')); return { r: r && r.passed === r.total, saved: ((saved.files.A.checks || {}).recovery || {}).passed, hidden: document.querySelector('#ns-check').hidden }; });
    if (!n2.r || !n2.saved) fail('Start over should clear the cells, never a stage\'s results');
    if (!n2.hidden) fail('after Start over, the earlier check should not be shown against the blank sheet (until the next Check my sheet)');

    // 2. the course page: a lower save keeps the best; the Scorecard reads the best stored result
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Cora', 'Kept', 'B100926');
    if (!(await page.evaluate(() => !!window.cmCreditKept))) fail('index.html should load js/cm-credit-kept.js');
    const ns = await page.evaluate(async () => {
        await storeSet('net-sheet', { v: 2, files: { A: { cells: {}, checks: { final: { passed: 6, total: 6, at: '2026-11-10T15:00:00.000Z', items: [] } } } } });
        await storeSet('net-sheet', { v: 2, files: { A: { cells: { L7: 5 }, checks: { final: { passed: 2, total: 6, at: '2026-11-12T15:00:00.000Z', items: [] } } } } });   // an older copy, a lower result
        const v = await storeGet('net-sheet'), k = v.files.A.checks.final;
        const S = window.cmScorecard, item = (c) => ((S.compute(c).rows.find(r => r.s.id === 'ns') || { items: [] }).items[0] || {}).pct;
        const ctx = (k) => ({ rec: {}, cf: { days: {} }, data: { 'net-sheet': { files: { A: { checks: { final: k } } } } } });
        return { kept: k.passed + '/' + k.total, tiedAt: k.tiedAt, cells: v.files.A.cells.L7, last: k.last && k.last.passed,
            best: item(ctx({ passed: 3, total: 6, at: '2026-11-12', last: { passed: 6, total: 6, at: '2026-11-11' } })), plain: item(ctx(k)) };
    });
    if (ns.kept !== '6/6' || !ns.tiedAt) fail(`a save with a lower result should keep the stored tie-out: ${JSON.stringify(ns)}`);
    if (ns.cells !== 5) fail('the save itself (the cells) should go ahead');
    if (ns.last !== 2) fail('the lower result should be kept as .last');
    if (ns.best !== 100 || ns.plain !== 100) fail(`the Scorecard should credit a stage with its best stored result: ${ns.best}, ${ns.plain}`);

    // 3. case exercises: the answer key the work was done against, and the stamp
    const cx = await page.evaluate(async () => {
        const K = window.cmCreditKept, EX = window.CM_CF_EXHIBITS, a = EX.amendments['d2m4-a1'];
        const marks = {}; a.requests.forEach(q => { marks[q.doc] = 'fix'; }); marks.RS14 = 'fix';   // one wrong call
        const before = K.screen('d2m4-a1', { screened: '2026-11-17T12:00:00.000Z', marks }), after = K.screen('d2m4-a1', { screened: '2026-11-19T12:00:00.000Z', marks });
        const stamped = K.screen('d2m4-a1', { screened: '2026-11-19T12:00:00.000Z', marks, kept: { right: 9, of: 9, at: 'x' } });
        // the Scorecard reads it so
        const day = (b) => 2, ctx = { rec: {}, cf: { days: {} }, data: { 'case-flow': { amend: { 'd2m4-a1': { screened: '2026-11-17T12:00:00.000Z', marks, req: {} } } } } };
        const ev = window.cmScorecard.model.evidence(ctx).items.filter(x => x.group === '🧾 Records screening').map(x => x.note);
        // the stamp, saved with the Case Flow record
        const ab = Object.keys(EX.audits)[0], au = EX.audits[ab], eb = Object.keys(EX.emails).find(b => EX.emails[b].press && EX.emails[b].press.choices);
        const rec = { v: 1, modules: {}, audits: { [ab]: { marks: au.items.map(it => it.verdict), notes: [], at: new Date().toISOString() } }, amend: { 'd2m4-a1': { screened: '2026-11-17T12:00:00.000Z', marks, req: {} } },
            service: { [eb]: { choice: EX.emails[eb].press.choices.findIndex(c => c.ok), sent: null } } };
        await storeSet('case-flow', rec);
        const saved = await storeGet('case-flow');
        // the key changes afterwards: the stamped score stands
        const was = au.items[0].verdict; au.items[0].verdict = was === 'ok' ? 'fix' : 'ok';
        const auditAfter = K.audit(ab, saved.audits[ab]); au.items[0].verdict = was;
        return { before, after, stamped, ev, stamps: { audit: saved.audits[ab].kept, screen: saved.amend['d2m4-a1'].kept, choice: saved.service[eb].kept }, auditAfter, items: au.items.length };
    });
    if (cx.before.of !== 11 || cx.before.right !== 10) fail(`a screening handed in before RS97/RS98 were added is scored on its 11 records (10 right): ${JSON.stringify(cx.before)}`);
    if (cx.after.of !== 13) fail(`a screening handed in since is scored on the 13 records: ${JSON.stringify(cx.after)}`);
    if (cx.stamped.of !== 9 || !cx.stamped.kept) fail('a stamped score is the one read');
    if (!cx.ev.length || !/10 of 11/.test(cx.ev[0])) fail(`the Scorecard should read the screening on its own key (10 of 11): ${JSON.stringify(cx.ev)}`);
    if (!cx.stamps.audit || cx.stamps.audit.right !== cx.items || !cx.stamps.screen || cx.stamps.screen.of !== 11 || !cx.stamps.choice || cx.stamps.choice.ok !== true) fail(`saving the Case Flow record should stamp each score once: ${JSON.stringify(cx.stamps)}`);
    if (!cx.auditAfter || cx.auditAfter.right !== cx.items) fail(`an audit's stamped score stands after its key changes: ${JSON.stringify(cx.auditAfter)}`);

    // 4. a day passed on any attempt stays passed
    const kc = await page.evaluate(() => { const d = DAYS.find(x => x.cf), S = window.cmScorecard;
        const c = { rec: { dayProgress: { [d.id]: { score: 55, done: false, history: [{ score: 80 }, { score: 55 }] } } }, cf: { days: {} }, data: {} };
        return { passed: S.kcPassed(c, d), done: S.compute(c).done, best: S.kcBest(c.rec.dayProgress[d.id], {}, c, d) }; });
    if (!kc.passed || kc.done !== 1 || kc.best !== 80) fail(`a day passed on any attempt stays passed, its best score kept: ${JSON.stringify(kc)}`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Credit kept: a Net Sheet stage that tied out stays tied out, the Scorecard reads the best result, case exercises keep the score they were handed in with, a passed day stays passed.');
})().catch(e => { console.error(e); process.exit(1); });
