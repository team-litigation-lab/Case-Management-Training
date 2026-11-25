// @check browser — One Overall score: a seeded trainee's Overall is the same number on their card, 🏅 Scores, the one Admin → 🏅 Scorecard page (its table, the card, cmScorecard.overall), its ⬇ Download (Scores, Detailed Scores, Score Card) and their dashboard, with the best Knowledge Check kept
// A trainee used to have three overall scores (the Scores row's Total 66%, the card's Overall 50%, the Batch Sheet's 64%).
// Now ONE function makes it, cmScorecard.overall (js/cm-scorecard.js: the 100-point model's Final), and every surface calls
// it (js/cm-batch-sheet.js, js/cm-overall.js). This seeds one trainee's graded work through the page's own saves, then reads
// the Overall off every surface as a person sees it, and each Case Flow day's score off 🏅 Scores and 📅 Day by Day:
//   the trainee: 🏅 My Performance's Overall pill, the dashboard's 🏅 My Score Card and 🏅 My Scores;
//   the trainer: the trainee's card on 🏅 Scorecards and its 🏅 Scores row; the Batch Sheet's 🏅 Scores, 🏅 Score Card,
//   📅 Day by Day and the trainee's 🔎 card.
// Sub-scores are labelled as such (Daily compliance, the grading systems average), and a day's Knowledge Check counts its
// best attempt (the owner's rule), not its last.
// Usage: node .github/scripts/one-overall.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const CSV = require('./csv-sections.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
const NAME = 'Olive One' + tag;

const pctOf = (t) => { const m = /(\d+)%/.exec(String(t || '')); return m ? +m[1] : null; };

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    const get = (key) => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);

    // the best Knowledge Check counts: a day whose last attempt was 60 after an 85 is scored 85
    const best = await page.evaluate(() => { const d = DAYS.find(x => x.cf && x.cf.n === 1);
        const ev = cmScorecard.model.evidence({ rec: { dayProgress: { [d.id]: { score: 60, history: [{ score: 85 }, { score: 60 }] } } }, cf: { days: { 1: { kc: 60 } } }, data: {}, fb: {} });
        const kc = ev.items.find(x => x.group === '✍️ Knowledge Check'); return kc ? kc.pct : null; });
    if (best !== 85) fail(`a day's Knowledge Check should count its best attempt (85), not its last (60): ${best}`);

    // 1. the trainee's graded work, saved the way the page saves it
    await signIn(page, 'Olive', 'One' + tag, 'B121226');
    const id = await page.evaluate(() => state.traineeId);
    if (!id) { fail('the trainee did not sign in'); await browser.close(); console.log('✗ ' + failures.join('\n  ')); process.exit(1); }
    const DP = { 11: { score: 92, done: true, takeaway: 88, history: [{ score: 92, passed: true }] }, 12: { score: 78, done: true, history: [{ score: 64 }, { score: 78, passed: true }] }, 13: { score: 55, done: false } };
    await page.evaluate(async (DP) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        state.progress = JSON.parse(JSON.stringify(DP)); await storeSet('day-progress', state.progress);
        state.workLog = [
            { kind: 'lab', dayId: 11, label: 'Day 11 · Case Flow Day 1 · Intake — Skill Building', score: 82, at: '2026-11-01T10:00:00Z', subs: { accuracy: 85, presence: 80, risk: 75, efficiency: 70 } },
            { kind: 'lab', dayId: 12, label: 'Day 12 · Case Flow Day 2 · Claim Set Up — CM Self-Summary', score: 64, at: '2026-11-02T10:00:00Z', subs: { accuracy: 70, presence: 60, risk: 55, efficiency: 50 } }];
        await storeSet('work-log', state.workLog);
        await storeSet('drive-setup', { score: 100, ok: true, attempts: 1, at: '2026-11-01T11:00:00Z' });
        await storeSet('drive-grades', { 2: { score: 70, passed: true, at: '2026-11-02T11:00:00Z' } });
        // 🧪 a Skill Activity graded by the AI Grader (no work-log line), 📝 Day 1's takeaway graded on its module, and a
        // 🎲 random task (in no score): each surface still shows one Overall
        await storeSet('cf-ai-grades', { v: 1, calls: {}, blocks: { 'd1m2-a1': { score: 58, at: '2026-11-01T12:00:00Z', tries: 1 } } });
        const cf = (await storeGet('case-flow')) || {}; cf.modules = Object.assign({}, cf.modules, { d1m4: { answers: ['x'], scale: [], kc: [], ai: { score: 77, at: '2026-11-01T13:00:00Z' } } }); await storeSet('case-flow', cf);
        state.taskLog = [{ id: 'one-t1', dayId: 11, status: 'resolved', score: 5, task: { title: 'A random task' }, submittedAt: '2026-11-01T14:00:00Z' }]; await storeSet('task-log', state.taskLog);
        await cloudSaveNow(); await syncToLedger();
    }, DP);
    const rec = await get('trainee:' + id) || {};
    rec.approved = true; rec.name = rec.name || NAME; rec.dayProgress = Object.assign({}, DP, rec.dayProgress);
    await put('trainee:' + id, rec);
    const seen = {};

    // the trainee: My Performance, the dashboard's My Score Card and My Scores
    await page.evaluate(() => goto('scorecard'));
    await page.waitForSelector('.bs-pt .bs-pt-k', { timeout: 15000 }).catch(() => fail('My Performance shows no card'));
    await page.waitForTimeout(1200); await page.evaluate(() => goto('scorecard')); await page.waitForTimeout(600);
    const mine = await page.evaluate(() => [...document.querySelectorAll('.bs-pt .bs-pt-k')].map(x => x.textContent.replace(/\s+/g, ' ').trim()));
    const pill = mine.find(p => /^Overall\b/.test(p));
    seen['My Performance · Overall pill'] = pctOf(pill);
    if (!mine.some(p => /^Daily compliance\b/.test(p))) fail(`the card should show the Daily compliance as its own, labelled sub-score: ${JSON.stringify(mine)}`);
    if (mine.some(p => /^Scorecard\b/.test(p))) fail(`the card should not show a second "Scorecard" score beside the Overall: ${JSON.stringify(mine)}`);
    await page.evaluate(() => goto('dashboard')); await page.waitForTimeout(1500);
    const dash = await page.evaluate(() => { const c = document.querySelector('.rank-card'), m = document.querySelector('.my-sc-all');
        return { card: c ? c.dataset.overall || c.textContent : null, my: m ? m.textContent : null }; });
    if (dash.card != null) seen['Dashboard · My Score Card'] = pctOf(dash.card + '%');
    if (dash.my != null) { seen['Dashboard · My Scores'] = pctOf(dash.my); if (!/Overall/.test(dash.my)) fail(`My Scores should name its number the Overall: "${dash.my}"`); }

    // the trainer: the card and its 🏅 Scores row
    // (the trainer's Scorecards shows one trainee's card at a time: this one is picked, as a trainer picks a name in the hero)
    await page.evaluate((id) => { state.isAdmin = true; state.adminData = null; if (window.cmScorecard) { cmScorecard.refresh(); cmScorecard.only(id); } goto('scorecard'); }, id);
    const dom = id.replace(/[^A-Za-z0-9_-]/g, '_');
    await page.waitForFunction((d) => !!document.getElementById('bs-pt-' + d), dom, { timeout: 20000 }).catch(() => fail('the trainer\'s Scorecards shows no card for the trainee'));
    await page.evaluate((id) => cmScorecard.only(id), id); await page.waitForTimeout(500);
    const tc = await page.evaluate((d) => { const c = document.getElementById('bs-pt-' + d); return c ? [...c.querySelectorAll('.bs-pt-k')].map(x => x.textContent.replace(/\s+/g, ' ').trim()) : []; }, dom);
    seen['Scorecards · the card\'s Overall pill'] = pctOf(tc.find(p => /^Overall\b/.test(p)));
    const realName = await page.evaluate((d) => { const c = document.getElementById('bs-pt-' + d), s = c && document.querySelector('.scx-who-row .bs-pt-who select'); return s ? s.options[s.selectedIndex].textContent : ''; }, dom);
    const nm = realName || NAME;
    const cell = (sel, head) => page.evaluate(([sel, head, name]) => {
        const sec = document.querySelector(sel); if (!sec) return { err: `no ${sel}` };
        const hs = [...sec.querySelectorAll('.gs-head th')].map(t => t.textContent.trim()), i = hs.indexOf(head);
        if (i < 1) return { err: `${sel} has no "${head}" column: ${JSON.stringify(hs)}` };
        const tr = [...sec.querySelectorAll('tbody tr')].find(r => { const n = r.querySelector('td'); return n && n.textContent.includes(name); });
        if (!tr) return { err: `${sel} has no row for ${name}` };
        const td = tr.querySelectorAll('td')[i - 1] || {}; return { v: td.textContent || '', tip: td.title || '' };
    }, [sel, head, nm]);
    const scRow = await cell('#scx-scores', 'Overall %');
    if (scRow.err) fail('🏅 Scores: ' + scRow.err); else seen['Scorecards · 🏅 Scores row'] = pctOf(scRow.v);
    const scDays = {}; for (const n of [1, 2]) { const x = await cell('#scx-scores', `Day ${n} %`); scDays[n] = x.err ? x.err : pctOf(x.v); }

    // the one 🏅 Scorecard page (Admin → 🏅 Scorecard, where the Admin screen lands): its 🏅 Scores row and the trainee's card,
    // the Overall cmScorecard.overall gives for the row's own records, and ⬇ Download (its 🏅 Scores, 📅 Day 1–5: Detailed
    // Scores and 🏅 Score Card tables, the old Batch Sheet's, now in the file)
    await page.evaluate(() => { state.adminData = null; state.adminTab = ''; state.adminBatchFilter = ''; if (window.cmScorecard) cmScorecard.refresh(); goto('admin'); });
    await page.waitForSelector('.cmsh-screen #scx-scores', { timeout: 30000 }).catch(() => fail('Admin → 🏅 Scorecard shows no 🏅 Scores'));
    let bs = null;
    for (let i = 0; i < 40; i++) { bs = await cell('.cmsh-screen #scx-scores', 'Overall %'); if (!bs.err && pctOf(bs.v) != null) break; await page.waitForTimeout(500); await page.evaluate(() => { if (state.view === 'admin') render(); }); }
    if (bs.err) fail('Admin 🏅 Scorecard · 🏅 Scores: ' + bs.err); else seen['Admin 🏅 Scorecard · 🏅 Scores'] = pctOf(bs.v);
    const adDays = {}; for (const n of [1, 2]) { const x = await cell('.cmsh-screen #scx-scores', `Day ${n} %`); adDays[n] = x.err ? x.err : pctOf(x.v); if (adDays[n] !== scDays[n]) fail(`Day ${n}'s score should be the same on #/scorecard (${scDays[n]}) and Admin → 🏅 Scorecard (${adDays[n]})`); }
    const ov = await page.evaluate(async (id) => { const keys = ['trainee:' + id, 'progress:' + id, 'callsim:' + id, 'simresults:' + id, 'feedback:' + id];
        const [rec, prog, callsim, sim, fb] = await sharedGetMany(keys);
        const o = cmScorecard.overall({ rec, cf: rec.caseFlow || { days: {} }, data: (prog && prog.data) || {}, callsim, sim, fb: fb || {} }); return o ? o.pct : null; }, id);
    seen['cmScorecard.overall of the trainee\'s records'] = ov;
    await page.evaluate((id) => cmScorecard.only(id), id); await page.waitForTimeout(500);
    const acard = await page.evaluate((d) => { const c = document.querySelector('.cmsh-screen #bs-pt-' + d); return c ? [...c.querySelectorAll('.bs-pt-k')].map(x => x.textContent.replace(/\s+/g, ' ').trim()) : []; }, dom);
    seen['Admin 🏅 Scorecard · the card'] = pctOf(acard.find(p => /^Overall\b/.test(p)));
    await page.evaluate(() => cmScorecard.only(''));
    const file = await CSV.grab(page, () => cmScorecard.csv());
    if (!file) fail('⬇ Download gave no file');
    else {
        const T = CSV.parse(file), by = t => T.find(x => x.title === t);
        if (!T[0] || T[0].title !== '🏅 Scores') fail(`⬇ Download should start with the 🏅 Scores table: ${JSON.stringify(T.map(x => x.title))}`);
        const a = CSV.cellOf(T[0], 'Overall %', nm); if (a.err) fail('⬇ Download · 🏅 Scores: ' + a.err); else seen['⬇ Download · 🏅 Scores'] = pctOf(a.v);
        const dt = T.find(x => x.title.startsWith('📅 Day 1–5: Detailed Scores')), d = CSV.cellOf(dt, 'Overall', nm); if (d.err) fail('⬇ Download · 📅 Day 1–5: Detailed Scores: ' + d.err); else seen['⬇ Download · 📅 Day 1–5: Detailed Scores'] = pctOf(d.v);
        for (const n of [1, 2]) { const h = dt && dt.head.find(x => x.startsWith(`Day ${n}.`)); const x = h ? CSV.cellOf(dt, h, nm) : { err: 'no column' };
            if (x.err || pctOf(x.v) !== scDays[n]) fail(`Day ${n}'s score should be the same on 🏅 Scores (${scDays[n]}) and the Detailed Scores (${x.err || x.v})`); }
        const s1 = T.find(x => /^🏅 Score Card · Day 1/.test(x.title)), s = CSV.cellOf(s1, 'Overall', nm); if (s.err) fail('⬇ Download · 🏅 Score Card: ' + s.err); else seen['⬇ Download · 🏅 Score Card'] = pctOf(s.v);
        const gsa = by('🏅 The 100-point model in full'); if (!gsa || !gsa.head.includes('Grading systems average %')) fail('⬇ Download should keep the grading systems average as its own, labelled column');
    }

    const vals = Object.values(seen);
    if (vals.some(v => v == null)) fail(`every surface should show an Overall: ${JSON.stringify(seen)}`);
    if (new Set(vals).size !== 1) fail(`the Overall should be one number everywhere: ${JSON.stringify(seen)}`);
    if (Object.keys(seen).length < 11) fail(`expected the Overall on 11 surfaces, read ${Object.keys(seen).length}: ${JSON.stringify(seen)}`);
    await browser.close();
    if (failures.length) { console.log('✗ One Overall score:\n  ' + failures.join('\n  ')); process.exit(1); }
    console.log(`One Overall score: ${vals[0]}% on all ${vals.length} surfaces (${Object.keys(seen).join('; ')}); the days agree on 🏅 Scores, Admin → 🏅 Scorecard and the Detailed Scores; the best Knowledge Check counts.`);
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
