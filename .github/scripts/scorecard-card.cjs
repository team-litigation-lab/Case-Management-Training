// @check browser — The Scorecard as the trainee card (the 100-point model, its day multipliers, pass at 80% with the safety gate; the trainee's own card, every card for the trainer, the CSV)
// The Scorecard as Foundational's batch-sheet trainee card, with the client's 100-point model (js/cm-scorecard.js):
// 1. the model, from records of known shape: the four weights (25/25/30/20), the day multipliers (Day 1 × 1.0, Days 2–3
//    × 1.15, Days 4–5 × 1.3), Final = Σ(day score × multiplier) ÷ Σ multipliers, the tiers (90/80/65), pass at 80% only
//    with 100% on the safety gate, and a breach of a critical item (UPL in the takeaway, the trust-money Net Sheet)
//    failing the gate whatever the score;
//    The Overall IS the Final (one Overall on every page: cmScorecard.overall); the Daily compliance is a sub-score beside it.
// 2. the trainee's 🏅 My Performance: their own card: the name, the Overall / Daily compliance pills, the
//    🎯 Focus on box, the 100-point model (what feeds each dimension, the critical items), the Day scores, and the
//    grading-systems table under a toggle; no other trainee's card;
// 3. the trainer's 🏅 Scorecards: every approved trainee's card, the batch filter, the 🔎 one-trainee pick, the one 🏅 Scores
//    sheet on screen (days, a column per kind of work, Overall, Result: no column per grading system), and ⬇ Download a CSV
//    that starts with it and keeps every column (the model's too); the same page is Admin → 🏅 Scorecard → 🏅 Scorecards
//    (the old 📋 Batch Sheet folded into it), with no admin action on it.
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
        // (a Skill Activity's AI review, and the takeaway's: — CM Self-Summary, not scored, only its UPL flag read)
        const lab = (n, s) => ({ kind: 'lab', dayId: 10 + n, label: `Day ${10 + n} · Case Flow Day ${n} · Topic — Skill Building`, score: 70, at: '2026-11-0' + n + 'T10:00:00Z', subs: s });
        const tkLab = (n, s) => ({ kind: 'lab', dayId: 10 + n, label: `Day ${10 + n} · Case Flow Day ${n} · Topic — CM Self-Summary`, score: 70, at: '2026-11-0' + n + 'T11:00:00Z', subs: s });
        const rec = { dayProgress: { 11: { score: 100, done: true, takeaway: 80 } } };
        const data = (finalPassed) => ({ 'drive-setup': { score: 100, ok: true, attempts: 1 }, 'work-log': [lab(1, { accuracy: 80, presence: 80, risk: 60, efficiency: 40 }), tkLab(1, { accuracy: 80, presence: 80, risk: 60, efficiency: 40 })],
            'net-sheet': { files: { A: { checks: { final: { passed: finalPassed, total: 5 } } } } } });
        const a = S(rec, data(4)), b = S(rec, data(5));
        const c = S(rec, { 'drive-setup': { score: 100, ok: true, attempts: 1 }, 'work-log': [lab(1, { accuracy: 100, presence: 100, risk: 0, efficiency: 100 }), tkLab(1, { accuracy: 100, presence: 100, risk: 0, efficiency: 100 })] });
        // 📝 the takeaway is not scored (the owner took the takeaway grades out): its review and its grade on the record count nowhere
        const tk = S({ dayProgress: { 11: { score: 100, done: true, takeaway: 20 } } }, { 'drive-setup': { score: 100, ok: true, attempts: 1 }, 'work-log': [tkLab(1, { accuracy: 10, presence: 10, risk: 50, efficiency: 10 })] });
        // 🎲 a random task (resolved late, graded 0) is in no score: the model is the same with it
        const t = S(rec, Object.assign(data(5), { 'task-log': [{ dayId: 11, status: 'resolved', score: 0, submittedAt: '2026-11-02T10:00:00Z', expiresAt: '2026-11-01T10:00:00Z', task: { title: 'Late task' } }] }));
        return { weights: M.DIMS.map(k => k.w), mult: M.MULT, pass: M.PASS, tiers: M.TIERS.map(t => [t.min, t.label]), crit: M.CRIT.map(k => k.id),
            a: { days: a.days.map(d => d.S), final: a.final, status: a.status, tier: a.tier && a.tier.label, gate: [a.gate.met, a.gate.total], comp: a.comp, overall: a.overall },
            b: { final: b.final, status: b.status, tier: b.tier && b.tier.label, gate: [b.gate.met, b.gate.total], dims: b.dims.map(x => x.v) },
            c: { final: c.final, status: c.status, tier: c.tier && c.tier.label, breach: c.gate.breaches.map(x => x.id) },
            tk: { final: tk.final, groups: tk.items.map(x => x.group + ':' + x.name).filter(g => /Takeaway|Self-Summary/.test(g)), comp: tk.days[0].comp && tk.days[0].comp.parts.map(p => p.label), sys: cmScorecard.sources.some(x => x.id === 'tk'), gate: tk.gate.total },
            task: { final: t.final, days: t.days.map(d => d.S), groups: t.items.map(x => x.group).filter(g => /Random|Timeliness/.test(g)) }, rt: cmScorecard.sources.some(x => x.id === 'rt') };
    });
    if (JSON.stringify(unit.weights) !== '[0.25,0.25,0.3,0.2]') fail(`the dimension weights should be 25/25/30/20: ${unit.weights}`);
    if (JSON.stringify(unit.mult) !== '{"1":1,"2":1.15,"3":1.15,"4":1.3,"5":1.3}') fail(`the day multipliers should be 1.0 / 1.15 / 1.15 / 1.3 / 1.3: ${JSON.stringify(unit.mult)}`);
    if (unit.pass !== 80) fail(`the pass mark should be 80: ${unit.pass}`);
    if (JSON.stringify(unit.tiers) !== '[[90,"Exemplary"],[80,"Proficient"],[65,"Developing"],[0,"Needs Improvement"]]') fail(`the 4-tier rubric: ${JSON.stringify(unit.tiers)}`);
    if (JSON.stringify(unit.crit) !== '["upl","priv","date","trust"]') fail(`the critical items: ${unit.crit}`);
    // Day 1: PC (KC 100, the Backup Drive's folders 100) 100 · NA (risk) 60 · CP (accuracy/presence) 80 · CD (efficiency) 40 → 72; Day 4: CP 80 → 80
    if (unit.task.final !== unit.b.final || unit.task.groups.length || unit.rt) fail(`a random task should be in no score (the owner removed them): ${JSON.stringify(unit.task)} vs ${unit.b.final}, rt system ${unit.rt}`);
    if (JSON.stringify(unit.a.days) !== '[72,null,null,80,null]') fail(`day scores should be [72,-,-,80,-]: ${JSON.stringify(unit.a.days)}`);
    if (unit.a.final !== 77) fail(`Final should be (72×1.0 + 80×1.3) ÷ 2.3 = 77: ${unit.a.final}`);
    if (unit.a.status !== 'gate' || unit.a.tier !== 'Needs Improvement' || unit.a.gate.join() !== '1,2') fail(`a trust-money check failed should breach the gate (Needs Improvement): ${JSON.stringify(unit.a)}`);
    if (unit.a.comp !== 100 || unit.a.overall !== 77) fail(`Daily compliance (KC passed, the Backup Drive graded) 100 as a sub-score, and Overall = the Final, 77: ${JSON.stringify(unit.a)}`);
    if (unit.tk.final !== 100 || unit.tk.groups.length || unit.tk.sys || (unit.tk.comp || []).some(l => /Takeaway/.test(l)) || unit.tk.gate !== 1)
        fail(`a takeaway should count nowhere (no grading system, no model item, no Daily compliance part), its review only giving the UPL item: ${JSON.stringify(unit.tk)}`);
    if (unit.b.final !== 88 || unit.b.status !== 'pass' || unit.b.tier !== 'Proficient' || unit.b.gate.join() !== '2,2') fail(`(72 + 100×1.3) ÷ 2.3 = 88 with the gate met should pass, Proficient: ${JSON.stringify(unit.b)}`);
    if (unit.c.final !== 75 || unit.c.status !== 'gate' || unit.c.tier !== 'Needs Improvement' || unit.c.breach.join() !== 'upl') fail(`a takeaway with Risk 0 (UPL) should breach the gate whatever the score (75%, Developing on its own, is Needs Improvement): ${JSON.stringify(unit.c)}`);

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
        await storeSet('drive-setup', { score: 100, ok: true, attempts: 1, at: '2026-11-01T10:00:00Z' });
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
        ['Overall', 'Daily compliance'].forEach((l, i) => { if (!mine.pills[i] || !mine.pills[i].startsWith(l)) fail(`pill ${i + 1} should be ${l}: ${JSON.stringify(mine.pills)}`); });
        if (!mine.pills.some(p => /Safety gate/.test(p))) fail(`a takeaway with Risk 0 should show the safety gate breached on the card: ${JSON.stringify(mine.pills)}`);
        if (!/Focus on/.test(mine.focus) || !/below the pass mark of 80%/.test(mine.focus) || !/⛔/.test(mine.focus)) fail(`the Focus on box should list the breach and the scores below 80%: ${mine.focus.slice(0, 300)}`);
        ['Procedural Compliance & Timeliness', 'Needs Assessment & Risk Identification', 'Care/Action Plan Quality', 'Communication & Documentation', '25%', '30%', '20%', 'What feeds it', 'Safety gate', 'UPL', 'Privilege', 'Hard dates', 'Trust money', 'Exemplary', 'Proficient', 'Developing', 'Needs Improvement', '× 1.15', '1.3']
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
    // 🏅 Scores on screen is the one table (the owner: "all the scores consolidated in one table"): each day's score, a column
    // per kind of work, the Overall and the Result; no column per grading system; ⬇ Download keeps every column (checked below)
    ['Trainee', 'Batch', 'Registered', 'Days passed', 'Day 1 %', 'Day 2 %', 'Day 3 %', 'Day 4 %', 'Day 5 %', '✍️ Knowledge Checks %', 'Overall %', 'Result'].forEach(h => { if (!all.head.includes(h)) fail(`🏅 Scores should have a "${h}" column: ${JSON.stringify(all.head)}`); });
    if (all.head.some(h => /Takeaway/.test(h))) fail(`🏅 Scores should have no Takeaways column (not scored): ${JSON.stringify(all.head)}`);
    if (all.head.length > 17) fail(`🏅 Scores on screen should keep to its 16 columns at most (${all.head.length - 1}): ${JSON.stringify(all.head)}`);
    if (all.head.some(h => /Graded Calls|Case Calls|Net Sheet|Portal Simulators|Grading systems average|Final %/.test(h))) fail(`🏅 Scores on screen should have no column per grading system or model part (those are in ⬇ Download): ${JSON.stringify(all.head)}`);
    const tidy = await page.evaluate(() => ({ how: [...document.querySelectorAll('.sc-how')].filter(p => !p.closest('details')).length, model: [...document.querySelectorAll('.bs-pt-s-model')].filter(t => !t.closest('details.bs-pt-how')).length }));
    if (tidy.how || tidy.model) fail(`the long "how it is scored" text and the model table should sit under the card's "How this is scored" toggle: ${JSON.stringify(tidy)}`);
    // a network blip on the background reload (sharedList answers [], get-many nulls): the cards and state.adminData stay;
    // a reload that changes nothing leaves an open "How this is scored" open
    const blip = await page.evaluate(async () => {
        const before = document.querySelectorAll('.bs-pt').length, admin = (state.adminData || []).length;
        const d = document.querySelector('.bs-pt details'); if (d) d.open = true;
        const sl = window.sharedList; window.sharedList = async () => [];
        try { await cmScorecard.reload(); } finally { window.sharedList = sl; }
        const gm = window.sharedGetMany; window.sharedGetMany = async (ks) => (ks || []).map(() => null);
        try { await cmScorecard.reload(); } finally { window.sharedGetMany = gm; }
        const mid = { cards: document.querySelectorAll('.bs-pt').length, admin: (state.adminData || []).length };
        await cmScorecard.reload();
        const d2 = document.querySelector('.bs-pt details');
        return { before, admin, mid, open: !d || !!(d2 && d2.open) };
    });
    if (!blip.before || blip.mid.cards !== blip.before || blip.mid.admin !== blip.admin) fail(`a failed background reload should keep the cards and state.adminData: ${JSON.stringify(blip)}`);
    if (!blip.open) fail('a background reload should not close the <details> a trainer has open');
    await page.selectOption('select[onchange^="cmScorecard.only"]', id); await page.waitForTimeout(400);
    const one = await page.evaluate(() => document.querySelectorAll('.bs-pt').length);
    if (one !== 1) fail(`🔎 one trainee should show one card: ${one}`);
    // the card names its trainee in a dropdown of names: every trainee shown, this one selected; choosing a name opens that card
    const whoPick = await page.evaluate((id) => { const c = document.getElementById('bs-pt-' + id.replace(/[^A-Za-z0-9_-]/g, '_')), sel = c && c.querySelector('.bs-pt-h .bs-pt-who select');
        return sel ? { picked: sel.value, names: [...sel.options].map(o => o.textContent), ids: [...sel.options].map(o => o.value), size: parseFloat(getComputedStyle(sel).fontSize) } : null; }, id);
    if (!whoPick) fail('a trainer\'s card should name its trainee in a dropdown of names (.bs-pt-who select)');
    else {
        if (whoPick.picked !== id || !whoPick.names.some(n => /Cara Card/.test(n))) fail(`the card's dropdown should have this trainee selected and listed: ${JSON.stringify(whoPick).slice(0, 300)}`);
        if (whoPick.size < 20) fail(`the name in the card's dropdown should stay large (${whoPick.size}px)`);
        const other = whoPick.ids.find(v => v && v !== id);
        if (other) {
            await page.selectOption('#bs-pt-' + id.replace(/[^A-Za-z0-9_-]/g, '_') + ' .bs-pt-who select', other); await page.waitForTimeout(400);
            const now = await page.evaluate(() => [...document.querySelectorAll('.bs-pt')].map(c => c.dataset.id));
            if (now.length !== 1 || now[0] !== other) fail(`choosing a name in the card should open that trainee's card by itself: ${JSON.stringify(now)}`);
            await page.evaluate((id) => cmScorecard.only(id), id); await page.waitForTimeout(300);
        }
    }
    await page.selectOption('select[onchange^="cmScorecard.batch"]', { index: 0 }).catch(() => {});
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), page.evaluate(() => cmScorecard.csv())]);
    if (!dl) fail('⬇ Download gave no CSV');
    else {
        const txt = require('fs').readFileSync(await dl.path(), 'utf8');
        if (txt.charCodeAt(0) !== 0xFEFF) fail('the CSV should start with a BOM (Excel reads it as UTF-8)');
        const T = require('./csv-sections.cjs').parse(txt), full = T.find(x => x.title === '🏅 The 100-point model in full');
        if (!T[0] || T[0].title !== '🏅 Scores' || T[0].head.slice(0, 4).join() !== 'Trainee,Batch,Registered,Days passed') fail(`the CSV should start with the 🏅 Scores table: ${JSON.stringify(T[0] && [T[0].title, T[0].head.slice(0, 5)])}`);
        if (!full || !/"Trainee","Batch","Days passed",.*"Final %","Tier","Safety gate","Result","Daily compliance %","Overall %"/.test(full.head.map(h => `"${h}"`).join(','))) fail(`the CSV should keep the 100-point model in full: ${JSON.stringify(full && full.head.slice(0, 12))}`);
        if (!T[0] || !T[0].rows.some(r => r[0].includes('Cara Card')) || !full || !full.rows.some(r => r[0].includes('Cara Card'))) fail('the CSV should have the trainee\'s row');
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
