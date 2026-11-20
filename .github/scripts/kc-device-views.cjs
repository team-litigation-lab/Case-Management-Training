// @check browser — 🛡 A Knowledge Check score only the trainee's device holds (progress:<id> day-progress, which the trainee writes as they like) is never shown as a score or a pass in the trainer's views: 👥 Trainee Audit, the trainee's work evidence and the Batch Sheet's 🕒 Recent progress take it from the Worker-scored record and label the device's copy unconfirmed
// index.html auditSummary / dayEvidence / evidenceText, js/cm-batch-sheet.js recentTable. Run on the page with no server data:
//   1. a record with no Knowledge Check and a device copy that says Day 1 was 100% and passed: auditSummary has no score
//      and no pass for the day (deviceScore 100, unconfirmed), the work evidence says unconfirmed, and 🕒 Recent progress
//      lists the attempt as unconfirmed and not passed;
//   2. a record whose Worker-scored attempt is 40% and a device copy that says 100%: every view shows 40%, not passed.
// Usage: node .github/scripts/kc-device-views.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(1500);
    const out = await page.evaluate(() => {
        const day = DAYS[0].id, at = new Date().toISOString();
        const forged = { 'day-progress': { [day]: { score: 100, done: true, date: at, history: [{ score: 100, passed: true, date: at }] } } };
        const look = (rec) => {
            state.auditExtra = state.auditExtra || {};
            state.auditExtra[rec.id] = { at: Date.now(), data: forged, fb: {}, fbRec: {}, focus: [] };
            const a = auditSummary(rec), d = a.days.find(x => x.id === day);
            const ev = evidenceText(dayEvidence(rec, { snap: forged }, day));
            const rt = window.cmBatchSheet && cmBatchSheet.recentTable ? cmBatchSheet.recentTable([Object.assign({}, rec, { __extra: { data: forged } })]) : null;
            const kc = rt ? rt.rows.map(r => r.map(c => String(c.v)).join(' | ')).filter(t => /Knowledge Check/.test(t)) : null;
            return { d, kcPassed: a.kcPassed, ev: (ev.match(/Knowledge Check[^\n]*/) || [''])[0], kc };
        };
        const bare = look({ id: 'dev-only--b111926', name: 'Dev Only', batch: 'B111926', approved: true });
        const scored = look({ id: 'dev-forged--b111926', name: 'Dev Forged', batch: 'B111926', approved: true,
            dayProgress: { [day]: { score: 40, done: false, date: at, history: [{ score: 40, passed: false, date: at, answers: [], claimed: 100 }] } } });
        return { bare, scored };
    });
    const { bare, scored } = out;
    // 1
    if (!bare.d || bare.d.score !== null || bare.d.passed || bare.d.deviceScore !== 100) fail(`a score only the device holds should not be the audit's score or pass (deviceScore 100): ${JSON.stringify(bare.d)}`);
    if (bare.kcPassed !== 0) fail(`no day should count as passed from the device's copy: kcPassed ${bare.kcPassed}`);
    if (!/unconfirmed/i.test(bare.ev) || /passed\)/.test(bare.ev)) fail(`the work evidence should call the device's score unconfirmed: ${bare.ev}`);
    if (!bare.kc) fail('js/cm-batch-sheet.js should expose cmBatchSheet.recentTable');
    else if (!bare.kc.length || bare.kc.some(t => !/unconfirmed/i.test(t) || /passed/.test(t))) fail(`🕒 Recent progress should list the device's attempt as unconfirmed and not passed: ${JSON.stringify(bare.kc)}`);
    // 2
    if (!scored.d || scored.d.score !== 40 || scored.d.passed) fail(`the audit should show the record's 40%, not passed: ${JSON.stringify(scored.d)}`);
    if (!/40%/.test(scored.ev) || /100%/.test(scored.ev) || /unconfirmed/i.test(scored.ev)) fail(`the work evidence should show the record's 40%: ${scored.ev}`);
    if (scored.kc && (!scored.kc.length || scored.kc.some(t => /100%|passed|unconfirmed/i.test(t)) || !scored.kc.some(t => /40/.test(t)))) fail(`🕒 Recent progress should list the record's 40% attempt: ${JSON.stringify(scored.kc)}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log("kc-device-views: a KC score only the device holds is unconfirmed in the Trainee Audit, the work evidence and 🕒 Recent progress; the Worker-scored record's score is the one shown.");
})().catch((e) => { console.error(e); process.exit(1); });
