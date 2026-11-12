// The Scorecard as Foundational's batch-sheet trainee card, with the client's 100-point model (js/cm-scorecard.js):
// 1. the model, from records of known shape: the four weights (25/25/30/20), the day multipliers (Day 1 × 1.0, Days 2–3
//    × 1.15, Days 4–5 × 1.3), Final = Σ(day score × multiplier) ÷ Σ multipliers, the tiers (90/80/65), pass at 80% only
//    with 100% on the safety gate, and a breach of a critical item (UPL in the takeaway, the trust-money Net Sheet)
//    failing the gate whatever the score;
// 2. the trainee's 🏅 My Performance: their own card: the name, the Overall / Scorecard / Daily compliance pills, the
//    🎯 Focus on box, the 100-point model (what feeds each dimension, the critical items), the Day scores, and the
//    grading-systems table under a toggle; no other trainee's card;
// 3. the trainer's 🏅 Scorecards: every approved trainee's card, the batch filter, the 🔎 one-trainee pick, and
//    ⬇ Download still a CSV of the scores table (with the model's columns); the same cards are Admin → 🏅 Scorecard →
//    🏅 Scorecards (beside the 📋 Batch Sheet), with no admin action on them.
// Usage: node .github/scripts/scorecard-card.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 }, acceptDownloads: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    const get = (key) => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);

    // 1. the model
    const unit = await page.evaluate(() => {
        const M = cmScorecard.model, S = cmScorecard.score;
        const lab = (n, s) => ({ kind: 'lab', dayId: 10 + n, label: `Day ${10 + n} · Case Flow Day ${n} · Topic — CM Self-Summary`, score: 70, at: '2026-11-0' + n + 'T10:00:00Z', subs: s });
        const rec = { dayProgress: { 11: { score: 100, done: true, takeaway: 80 } } };
        const data = (finalPassed) => ({ 'case-folder': { uploads: { 11: true } }, 'work-log': [lab(1, { accuracy: 80, presence: 80, risk: 60, efficiency: 40 })],
            'net-sheet': { files: { A: { checks: { final: { passed: finalPassed, total: 5 } } } } } });
        const a = S(rec, data(4)), b = S(rec, data(5));
        const c = S(rec, { 'case-folder': { uploads: { 11: true } }, 'work-log': [lab(1, { accuracy: 100, presence: 100, risk: 0, efficiency: 100 })] });
        return { weights: M.DIMS.map(k => k.w), mult: M.MULT, pass: M.PASS, tiers: M.TIERS.map(t => [t.min, t.label]), crit: M.CRIT.map(k => k.id),
            a: { days: a.days.map(d => d.S), final: a.final, status: a.status, tier: a.tier && a.tier.label, gate: [a.gate.met, a.gate.total], comp: a.comp, overall: a.overall },
            b: { final: b.final, status: b.status, tier: b.tier && b.tier.label, gate: [b.gate.met, b.gate.total], dims: b.dims.map(x => x.v) },
            c: { final: c.final, status: c.status, tier: c.tier && c.tier.label, breach: c.gate.breaches.map(x => x.id) } };
    });
    if (JSON.stringify(unit.weights) !== '[0.25,0.25,0.3,0.2]') fail(`the dimension weights should be 25/25/30/20: ${unit.weights}`);
    if (JSON.stringify(unit.mult) !== '{"1":1,"2":1.15,"3":1.15,"4":1.3,"5":1.3}') fail(`the day multipliers should be 1.0 / 1.15 / 1.15 / 1.3 / 1.3: ${JSON.stringify(unit.mult)}`);
    if (unit.pass !== 80) fail(`the pass mark should be 80: ${unit.pass}`);
    if (JSON.stringify(unit.tiers) !== '[[90,"Exemplary"],[80,"Proficient"],[65,"Developing"],[0,"Unsatisfactory"]]') fail(`the 4-tier rubric: ${JSON.stringify(unit.tiers)}`);
    if (JSON.stringify(unit.crit) !== '["upl","priv","date","trust"]') fail(`the critical items: ${unit.crit}`);
    // Day 1: PC (KC 100, upload 100) 100 · NA (risk) 60 · CP (accuracy/presence) 80 · CD (efficiency) 40 → 72; Day 4: CP 80 → 80
    if (JSON.stringify(unit.a.days) !== '[72,null,null,80,null]') fail(`day scores should be [72,-,-,80,-]: ${JSON.stringify(unit.a.days)}`);
    if (unit.a.final !== 77) fail(`Final should be (72×1.0 + 80×1.3) ÷ 2.3 = 77: ${unit.a.final}`);
    if (unit.a.status !== 'gate' || unit.a.tier !== 'Unsatisfactory' || unit.a.gate.join() !== '1,2') fail(`a trust-money check failed should breach the gate (Unsatisfactory): ${JSON.stringify(unit.a)}`);
    if (unit.a.comp !== 100 || unit.a.overall !== 89) fail(`Daily compliance (KC passed, takeaways graded, uploaded) 100 and Overall = avg(77, 100) = 89: ${JSON.stringify(unit.a)}`);
    if (unit.b.final !== 88 || unit.b.status !== 'pass' || unit.b.tier !== 'Proficient' || unit.b.gate.join() !== '2,2') fail(`(72 + 100×1.3) ÷ 2.3 = 88 with the gate met should pass, Proficient: ${JSON.stringify(unit.b)}`);
    if (unit.c.final !== 75 || unit.c.status !== 'gate' || unit.c.tier !== 'Unsatisfactory' || unit.c.breach.join() !== 'upl') fail(`a takeaway with Risk 0 (UPL) should breach the gate whatever the score (75%, Developing on its own, is Unsatisfactory): ${JSON.stringify(unit.c)}`);

    // 2. a trainee with graded work: their own card
    await signIn(page, 'Cara', 'Card' + tag, 'B100926');
    const id = await page.evaluate(() => state.traineeId);
    if (!id) { fail('the trainee did not sign in'); }
    // the trainee's device holds their work (the live state wins on their own page); it is saved to the server, as the
    // page saves it, for the trainer's view
    await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        state.progress = { 11: { score: 92, done: true, takeaway: 88 }, 12: { score: 55, done: false } }; await storeSet('day-progress', state.progress);
        state.workLog = [{ kind: 'lab', dayId: 12, label: 'Day 12 · Case Flow Day 2 · Claim Set Up — CM Self-Summary', score: 60, at: '2026-11-02T10:00:00Z', subs: { accuracy: 70, presence: 60, risk: 0, efficiency: 50 } }];
        await storeSet('work-log', state.workLog);
        await storeSet('case-folder', { uploads: { 11: true } });
        await storeSet('net-sheet', { files: { A: { checks: { final: { passed: 6, total: 6 } } } } });
        await cloudSaveNow(); await syncToLedger();
    });
    const rec = await get('trainee:' + id) || {};
    rec.approved = true; rec.dayProgress = Object.assign({ 11: { score: 92, done: true, takeaway: 88 }, 12: { score: 55, done: false } }, rec.dayProgress);
    await put('trainee:' + id, rec);
    await put('feedback:' + id, { caseFlow: { d1m1: { score: 86, comment: 'Clear plan', at: '2026-11-01T12:00:00Z' } } });
    await page.evaluate(() => goto('scorecard'));
    await page.waitForSelector('.bs-pt', { timeout: 15000 }).catch(() => fail('My Performance shows no trainee card'));
    await page.waitForTimeout(800);
    const mine = await page.evaluate(() => {
        const cards = [...document.querySelectorAll('.bs-pt')], c = cards[0]; if (!c) return null;
        return { n: cards.length, name: c.querySelector('.bs-pt-h > b').textContent, pills: [...c.querySelectorAll('.bs-pt-k')].map(x => x.textContent.replace(/\s+/g, ' ').trim()),
            focus: (c.querySelector('.bs-in') || {}).textContent || '', model: (c.querySelector('.bs-pt-s-model') || {}).textContent || '',
            days: [...c.querySelectorAll('.bs-pt-s-days > tbody > tr > td.bs-pt-m')].map(x => x.textContent), src: !!c.querySelector('details.bs-pt-src #scx-detail-' + state.traineeId.replace(/[^A-Za-z0-9_-]/g, '_')),
            fonts: [...c.querySelectorAll('.bs-pt-f, .bs-parts td, .bs-pt-k, .bs-in')].map(x => parseFloat(getComputedStyle(x).fontSize)).filter(v => v < 14).length,
            admin: !!document.querySelector('[onclick^="cmScorecard.only"], [onchange^="cmScorecard.only"]') };
    });
    if (!mine) fail('My Performance: no card');
    else {
        if (mine.n !== 1) fail(`the trainee should see only their own card: ${mine.n}`);
        if (!/Cara Card/.test(mine.name)) fail(`the card should carry the trainee's name: ${mine.name}`);
        ['Overall', 'Scorecard', 'Daily compliance'].forEach((l, i) => { if (!mine.pills[i] || !mine.pills[i].startsWith(l)) fail(`pill ${i + 1} should be ${l}: ${JSON.stringify(mine.pills)}`); });
        if (!mine.pills.some(p => /Safety gate/.test(p))) fail(`a takeaway with Risk 0 should show the safety gate breached on the card: ${JSON.stringify(mine.pills)}`);
        if (!/Focus on/.test(mine.focus) || !/below the pass mark of 80%/.test(mine.focus) || !/⛔/.test(mine.focus)) fail(`the Focus on box should list the breach and the scores below 80%: ${mine.focus.slice(0, 300)}`);
        ['Procedural Compliance & Timeliness', 'Needs Assessment & Risk Identification', 'Care/Action Plan Quality', 'Communication & Documentation', '25%', '30%', '20%', 'What feeds it', 'Safety gate', 'UPL', 'Privilege', 'Hard dates', 'Trust money', 'Exemplary', 'Proficient', 'Developing', 'Unsatisfactory', '× 1.15', '1.3']
            .forEach(w => { if (!mine.model.includes(w) && !mine.days.join(' ').includes(w)) fail(`the card's 100-point model should say "${w}"`); });
        if (mine.days.length !== 6 || !/Day 1/.test(mine.days[1]) || !/Day 5/.test(mine.days[5])) fail(`Day scores should have the Final and Days 1–5: ${JSON.stringify(mine.days)}`);
        if (!mine.src) fail('the grading-systems table should be under the card, in a toggle');
        if (mine.fonts) fail(`${mine.fonts} card text element(s) under 14px`);
        if (mine.admin) fail('the trainee should not get the trainer\'s trainee picker');
    }

    // 3. the trainer: every trainee's card, the batch filter, one trainee, the CSV
    await page.evaluate(() => { state.isAdmin = true; state.adminData = null; if (window.cmScorecard) cmScorecard.refresh(); goto('scorecard'); });
    await page.waitForFunction((id) => !!document.getElementById('bs-pt-' + id.replace(/[^A-Za-z0-9_-]/g, '_')), id, { timeout: 20000 }).catch(() => fail('the trainer\'s Scorecards shows no card for the trainee'));
    const all = await page.evaluate((id) => ({ cards: document.querySelectorAll('.bs-pt').length, batch: !!document.querySelector('select[onchange^="cmScorecard.batch"]'),
        who: [...document.querySelectorAll('select[onchange^="cmScorecard.only"] option')].map(o => o.value), head: [...document.querySelectorAll('#scx-scores .gs-head th')].map(t => t.textContent) }), id);
    if (!all.batch) fail('the trainer\'s Scorecards lost its batch filter');
    if (!all.who.includes(id)) fail('the 🔎 pick should list the trainee');
    ['Final %', 'Tier', 'Safety gate', 'Result', 'Daily compliance %', 'Overall %', '✍️ Knowledge Checks'].forEach(h => { if (!all.head.includes(h)) fail(`🏅 Scores should have a "${h}" column: ${JSON.stringify(all.head)}`); });
    await page.selectOption('select[onchange^="cmScorecard.only"]', id); await page.waitForTimeout(400);
    const one = await page.evaluate(() => document.querySelectorAll('.bs-pt').length);
    if (one !== 1) fail(`🔎 one trainee should show one card: ${one}`);
    await page.selectOption('select[onchange^="cmScorecard.batch"]', { index: 0 }).catch(() => {});
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), page.evaluate(() => cmScorecard.csv())]);
    if (!dl) fail('⬇ Download gave no CSV');
    else {
        const txt = require('fs').readFileSync(await dl.path(), 'utf8');
        if (txt.charCodeAt(0) !== 0xFEFF) fail('the CSV should start with a BOM (Excel reads it as UTF-8)');
        const lines = txt.replace(/^﻿/, '').split('\r\n');
        if (!/"Trainee","Batch","Days passed",.*"Final %","Tier","Safety gate","Result","Daily compliance %","Overall %"/.test(lines[0])) fail(`the CSV header: ${lines[0].slice(0, 300)}`);
        if (!lines.some(l => l.includes('Cara Card'))) fail('the CSV should have the trainee\'s row');
    }
    // the same cards in Admin → 🏅 Scorecard → 🏅 Scorecards, scores only
    await page.evaluate(() => { cmScorecard.only(''); state.adminTab = 'scorecards'; goto('admin'); });
    await page.waitForFunction((id) => !!document.querySelector('.cmsh-screen #bs-pt-' + id.replace(/[^A-Za-z0-9_-]/g, '_')), id, { timeout: 20000 }).catch(() => fail('Admin → 🏅 Scorecards shows no card for the trainee'));
    const inAdmin = await page.evaluate(() => ({ sec: ((document.querySelector('.cmsh-sec.active') || {}).textContent || ''), tab: ((document.querySelector('.cmsh-row .admin-tab-btn.active') || {}).textContent || ''),
        acts: /approveTrainee\(|resetTraineeLabAttempts\(|confirmRevokeTrainee\(|cmCompanion\.assign\(|openFeedbackFor\(|adminOpenCertificate\(/.test((document.querySelector('.cmsh-screen') || {}).innerHTML || '') }));
    if (!/Scorecard/.test(inAdmin.sec) || !/Scorecards/.test(inAdmin.tab)) fail(`the cards should be Admin → 🏅 Scorecard → 🏅 Scorecards: ${JSON.stringify(inAdmin)}`);
    if (inAdmin.acts) fail('Admin → 🏅 Scorecards carries an admin action (they are 🛡 Admin Master Control\'s)');
    await page.screenshot({ path: require('path').join(require('os').tmpdir(), 'scorecard-card.png'), fullPage: false }).catch(() => {});
    // phone width: the page keeps its width
    await page.setViewportSize({ width: 390, height: 840 }); await page.waitForTimeout(400);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 2) fail(`at phone width the page scrolls sideways by ${over}px`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('The 100-point model scores 25/25/30/20 per day, weights the days 1.0 / 1.15 / 1.3, passes at 80% only with the safety gate met, and a critical breach fails it; the trainee sees their own card (pills, Focus on, the model, the Day scores, the grading systems in a toggle); the trainer sees every card with the batch filter, one trainee, and the CSV.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
