// @check browser — Each score is read where it is written: the nightly Drive grade, the AI Grader's Skill Activities and the Action Plan show with the same numbers (the takeaway, not scored, nowhere) on the Score Card, the trainee's feedback, 🏅 Scores and the trainee's own card; Random tasks are gone
// The owner, handing out scores: "Remove the Random tasks scores and provide scoring for the other two [📝 Takeaways,
// 🧪 Activities & calls]", "I also need scoring for the action plan", and of 📂 Backup Drive "I do not understand why their
// scores do not show up". Each was blank because the scorecard read a copy the grade is not always written to:
//   📂 the Worker's nightly grade of the drive lives on the drive record (driveReport / driveStatus), the trainee's progress
//      only has it when their own page graded the drive: the latest of the two counts, a trainer's override winning;
//   📝 the takeaway is graded on the day's Knowledge Check module (case-flow modules[id].ai), the day's copy only sometimes;
//   🧪 the Case Flow's Skill Activities are graded by the AI Grader (cf-ai-grades), one activity counted once with its log line;
//   📝 the action plan (Notes & Action Plan, case-flow notes[block].planGot) is its own column, not inside Case Exercises.
// This seeds one trainee's work through the page's own saves (and answers /api/drive as the Worker would: the trainee's
// drive status with its nightly grades, the trainer's report of every drive), then reads each number off
//   the trainee: 🏅 My Performance's day rows and the dashboard's 🏅 My Scores;
//   the trainer: the trainee's card on 🏅 Scorecards; the one Admin → 🏅 Scorecard page: its 🏅 Scores row, the card's
//   💬 Feedback on Practical Activities and ⬇ Download's 🏅 Score Card (Day 1, Day 2); and checks 🎲 Random tasks is in none of
//   them (nor in the day score), while ⬇ Download's Recent progress still lists it.
// It also checks each grade counts once in the day score (a Skill Activity by its latest attempt; a CMS activity's AI Grader
// grade under 🧪 only, not again as a 🗂 CMS case file item) and that My Scores reads the same records after a reload.
// Usage: node .github/scripts/score-sources.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const CSV = require('./csv-sections.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);

// what the trainee has done, and what each surface should then show
// (dated in the last few days: 🕒 Recent progress shows the last 14)
const T0 = Math.floor(Date.now() / 864e5) * 864e5 - 5 * 864e5;
const AT = (d, h) => new Date(T0 + d * 864e5 + h * 36e5).toISOString();
const DRIVE = { setup: { score: 90, ok: true, attempts: 1, at: AT(2, 3) }, grades: { 2: { score: 76, passed: true, at: AT(3, 3), issues: [] } } };
// (📝 the takeaways are written and AI-reviewed but not scored: the owner took their grades out of the scorecards, so no
// surface shows one: null)
const WANT = { 1: { tk: null, sa: 68, ap: 50, bd: 90 }, 2: { tk: null, bd: 76 } };
const SYS = { '📝 Takeaways': null, '🧪 Skill Activities': 68, '📝 Action Plan': 50, '📂 Backup Drive': 83 };
const pctOf = (t) => { const m = /(\d+)%/.exec(String(t || '')); return m ? +m[1] : null; };

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    // /api/drive as the Worker answers it (the test server has no service account): the trainee's own drive status and
    // "work" carry the nightly grades; a trainer's reportAll carries every drive's
    await page.route('**/api/drive', async (route) => {
        let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) {}
        const send = (o) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(o) });
        const drive = { configured: true, connected: true, built: false, standard: ['01 Clients'], why: {}, homes: {}, root: 'LSH Case Backups', lastMissing: [], saved: [], drills: [], naming: null,
            setup: DRIVE.setup, grades: DRIVE.grades };
        if (b.action === 'reportAll') return send({ reports: Object.fromEntries((b.traineeIds || []).map(id => [id, { traineeId: id, connected: true, setupScore: DRIVE.setup.score, tries: [{ at: DRIVE.setup.at, ok: true }], grades: DRIVE.grades, copies: 0 }])) });
        if (b.action === 'work') return send({ work: { items: [], unmatched: [], unreadable: [] }, brief: { items: [], days: {}, n: 0, unmatched: 0 },
            structure: { 1: { auto: 90, final: 90, at: DRIVE.setup.at }, 2: { auto: 76, final: 76, at: DRIVE.grades[2].at }, 3: { auto: null, final: null }, 4: { auto: null, final: null }, 5: { auto: null, final: null } }, guide: [] });
        return send({ drive, grades: DRIVE.grades });
    });
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    const get = (key) => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);

    await signIn(page, 'Sora', 'Source' + tag, 'B121226');
    const id = await page.evaluate(() => state.traineeId);
    if (!id) { fail('the trainee did not sign in'); await browser.close(); console.log('✗ ' + failures.join('\n  ')); process.exit(1); }
    const DP = { 11: { score: 90, done: true, history: [{ score: 90, passed: true }] }, 12: { score: 80, done: true, takeaway: 66, history: [{ score: 80, passed: true }] } };
    await page.evaluate(async ([DP, AT0, AT1, AT2]) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        state.progress = JSON.parse(JSON.stringify(DP)); await storeSet('day-progress', state.progress);
        // 📝 Day 1's takeaway, graded on its Knowledge Check module (js/cm-case-flow.js review); 📝 the voicemail's action plan,
        // 3 of its 6 required steps (npPlan)
        const cf = (await storeGet('case-flow')) || {};
        cf.modules = Object.assign({}, cf.modules, { d1m4: { answers: ['What I learned today on the file'], scale: [], kc: [], ai: { score: 84, tier: 'Proficient', strengths: ['Named the SOL'], gaps: ['Say who is told'], growth: [], at: AT0 } } });
        cf.notes = Object.assign({}, cf.notes, { 'd1m3-a1': { tx: 'voicemail', txAt: AT0, txGot: [], plan: 'my plan', planAt: AT0, planGot: [true, true, true, false, false, false], mails: {} } });
        await storeSet('case-flow', cf);
        // 🧪 two Skill Activities graded by the AI Grader; the second also has an older line in the work log (one activity, counted once)
        await storeSet('cf-ai-grades', { v: 1, calls: {}, blocks: { 'd1m2-a1': { score: 72, tier: 'Developing', strengths: ['Logged every channel'], gaps: ['Date each attempt'], growth: [], at: AT1, tries: 1 },
            'd1m2-a2': { score: 64, tier: 'Developing', strengths: [], gaps: [], growth: [], at: AT2, tries: 2 } } });
        state.workLog = [{ kind: 'lab', dayId: 11, label: 'Day 11 · Case Flow Day 1 · Final Warning Letter Drafting — Skill Building', score: 40, at: AT1, subs: { accuracy: 40, presence: 40, risk: 40, efficiency: 40 } }];
        await storeSet('work-log', state.workLog);
        // 📂 an older grade saved on the progress (Day 1's folders at 40%): the Worker's later nightly 90% counts
        await storeSet('drive-setup', { score: 40, ok: false, attempts: 1, at: AT0.replace(/T.*/, 'T00:00:00.000Z') });
        // 🎲 a resolved random task on Day 1, graded 10%: no score anywhere, still in Recent progress
        state.taskLog = [{ id: 'tsrc1', dayId: 11, status: 'resolved', score: 10, tier: 'Needs work', task: { title: 'Call the carrier back' }, submittedAt: AT1, expiresAt: AT2 }];
        await storeSet('task-log', state.taskLog);
        await cloudSaveNow(); await syncToLedger();
    }, [DP, AT(1, 9), AT(1, 10), AT(1, 11)]);
    const rec = await get('trainee:' + id) || {};
    rec.approved = true; rec.dayProgress = Object.assign({}, DP, rec.dayProgress);
    await put('trainee:' + id, rec);

    const seen = [];   // [surface, day, column, value]
    const want = (surface, n, col, v) => { seen.push([surface, n, col, v]); if (v !== WANT[n][col]) fail(`${surface} · Day ${n} · ${col}: ${v} (should be ${WANT[n][col]})`); };
    const LINE = { tk: /📝 Takeaway (\d+)%/, sa: /🧪 Activities & calls (\d+)%/, ap: /📝 Action Plan (\d+)%/, bd: /📂 Backup Drive (\d+)%/ };
    const lines = (sel) => page.evaluate((sel) => { const c = document.querySelector(sel); if (!c) return null;
        return [...c.querySelectorAll('.bs-pt-s-days tr')].map(tr => [(tr.querySelector('.bs-pt-m') || {}).textContent || '', ((tr.querySelector('.bs-pt-line') || {}).textContent || '').replace(/\s+/g, ' ')]); }, sel);
    const fromLines = (surface, ls) => { if (!ls) { fail(`${surface}: no card`); return; }
        for (const n of [1, 2]) { const l = (ls.find(([h]) => h.startsWith(`Day ${n}:`)) || [])[1] || '';
            for (const col of Object.keys(WANT[n])) { const m = LINE[col].exec(l); want(surface, n, col, m ? +m[1] : null); }
            if (/Random/.test(l)) fail(`${surface} · Day ${n} should name no random task: ${l}`); } };

    // 1. the trainee: 🏅 My Performance, then the dashboard's 🏅 My Scores
    await page.evaluate(() => goto('scorecard'));
    await page.waitForSelector('.bs-pt .bs-pt-line', { timeout: 15000 }).catch(() => fail('My Performance shows no day rows'));
    for (let i = 0; i < 20; i++) { const ls = await lines('.bs-pt'); const l = ls && (ls.find(([h]) => h.startsWith('Day 1:')) || [])[1]; if (l && /📂 Backup Drive 90%/.test(l)) break; await page.waitForTimeout(500); await page.evaluate(() => goto('scorecard')); }
    fromLines('My Performance', await lines('.bs-pt'));
    // the model: no random-task item, the right items in the day score
    const model = await page.evaluate(() => { const m = cmScorecard.myOverall().m; return { groups: [...new Set(m.items.map(x => x.group))], bd1: (m.items.find(x => x.group === '📂 Backup Drive' && x.day === 1) || {}).pct, ap: m.items.filter(x => x.group === '📝 Action Plan').map(x => x.pct) }; });
    if (model.groups.some(g => /Random|Timeliness/.test(g))) fail(`the 100-point model should hold no random task: ${JSON.stringify(model.groups)}`);
    if (model.groups.some(g => /Takeaway/.test(g))) fail(`the 100-point model should hold no takeaway (not scored): ${JSON.stringify(model.groups)}`);
    if (model.bd1 !== 90) fail(`the day score should count the Worker's nightly 90% for Day 1's folders (later than the 40% saved): ${model.bd1}`);
    if (JSON.stringify(model.ap) !== '[50]') fail(`the action plan should count once in the model: ${JSON.stringify(model.ap)}`);
    // 🧪 the day score counts each Skill Activity's latest attempt, as the 🧪 column shows it: Final Warning Letter Drafting's
    // AI Grader grade (64, the later attempt), not its older work-log line (40)
    const wq = await page.evaluate(() => cmScorecard.myOverall().m.items.filter(x => x.day === 1 && /Final Warning Letter/.test(x.name)).map(x => [x.group, Math.round(x.pct)]));
    if (JSON.stringify(wq) !== JSON.stringify([['🧪 Work quality', 64]])) fail(`the day score should count Final Warning Letter Drafting's latest attempt (the AI Grader's 64) once, as the 🧪 column does: ${JSON.stringify(wq)}`);
    // 🗂 an AI Grader grade of a CMS activity counts once in the day score (🧪 Work quality), not again as a 🗂 CMS case file item
    const cmsAI = await page.evaluate(() => { const m = cmScorecard.score({ id: 'probe', dayProgress: {}, caseFlow: { days: {} } }, { 'cf-ai-grades': { v: 1, blocks: { 'd1m1-open': { score: 60, at: new Date().toISOString(), tries: 1 } } } }, {});
        return m.items.filter(x => x.day === 1 && Math.round(x.pct) === 60).map(x => x.group); });
    if (JSON.stringify(cmsAI) !== JSON.stringify(['🧪 Work quality'])) fail(`one AI Grader grade of a CMS activity should count once, under 🧪 Work quality: ${JSON.stringify(cmsAI)}`);

    // (after a reload index.html's mem holds only what is saved since: My Scores reads the device's store and the cloud record too)
    await page.evaluate(() => { delete mem['case-flow']; delete mem['cf-ai-grades']; delete mem['doc-filing']; delete mem['cms-file']; });
    await page.evaluate(() => goto('dashboard')); await page.waitForTimeout(1200); await page.evaluate(() => render()); await page.waitForTimeout(400);
    const my = await page.evaluate(() => { const t = document.querySelector('.my-sc-t'); if (!t) return null;
        const hs = [...t.querySelectorAll('thead th')].map(x => x.textContent.trim());
        return { hs, rows: [...t.querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')].map(td => td.textContent.trim())) }; });
    if (!my) fail('the dashboard shows no 🏅 My Scores');
    else {
        if (my.hs.some(h => /Random/.test(h))) fail(`🏅 My Scores should have no Random tasks column: ${JSON.stringify(my.hs)}`);
        const COL = { tk: '📝 Takeaways', sa: '🧪 Activities & calls', ap: '📝 Action Plan', bd: '📂 Backup Drive' };
        for (const n of [1, 2]) { const row = my.rows.find(r => r[0].startsWith(`Day ${n}`)) || [];
            for (const col of Object.keys(WANT[n])) { const i = my.hs.indexOf(COL[col]); want('My Scores', n, col, i < 0 ? null : pctOf(row[i])); } }
    }
    const myCms = my ? pctOf(((my.rows.find(r => r[0].startsWith('Day 1')) || [])[my.hs.indexOf('🗂 CMS file')])) : null;

    // 2. the trainer: the trainee's card on 🏅 Scorecards
    // (the trainer's Scorecards shows one trainee's card at a time: this one is picked, as a trainer picks a name in the hero)
    await page.evaluate((id) => { state.isAdmin = true; state.adminData = null; if (window.cmScorecard) { cmScorecard.refresh(); cmScorecard.only(id); } goto('scorecard'); }, id);
    const dom = id.replace(/[^A-Za-z0-9_-]/g, '_');
    await page.waitForFunction((d) => !!document.getElementById('bs-pt-' + d), dom, { timeout: 20000 }).catch(() => fail('the trainer\'s Scorecards shows no card for the trainee'));
    for (let i = 0; i < 30; i++) { const ls = await lines('#bs-pt-' + dom); const l = ls && (ls.find(([h]) => h.startsWith('Day 1:')) || [])[1]; if (l && /📂 Backup Drive 90%/.test(l)) break; await page.waitForTimeout(500); await page.evaluate(() => { cmScorecard.reload(); }); }
    fromLines('Scorecards card', await lines('#bs-pt-' + dom));

    // 3. the one Admin → 🏅 Scorecard page: its 🏅 Scores row (a column per kind of work), the trainee's card with its
    // 💬 Feedback on Practical Activities, and ⬇ Download's 🏅 Score Card (Day 1, Day 2) and 🕒 Recent progress
    await page.evaluate(() => { state.adminData = null; state.adminTab = ''; if (window.cmScorecard) cmScorecard.refresh(); goto('admin'); });
    await page.waitForSelector('.cmsh-screen #scx-scores', { timeout: 30000 }).catch(() => fail('Admin → 🏅 Scorecard shows no 🏅 Scores'));
    const nm = await page.evaluate((id) => { const r = (state.adminData || []).find(x => x.id === id); return r ? (typeof cleanName === 'function' ? cleanName(r.name) : r.name) : ''; }, id);
    const SCC = { tk: '📝 Takeaways', sa: '🧪 Activities & calls', ap: '📝 Action Plan', bd: '📂 Backup Drive' };
    let file = null, T = [];
    for (let i = 0; i < 40; i++) {
        file = await CSV.grab(page, () => cmScorecard.csv()); T = file ? CSV.parse(file) : [];
        const s1 = T.find(x => /^🏅 Score Card · Day 1/.test(x.title)), c = CSV.cellOf(s1, '📂 Backup Drive', nm);
        if (!c.err && pctOf(c.v) === 90) break; await page.waitForTimeout(500); await page.evaluate(() => { cmScorecard.reload(); });
    }
    if (!file) fail('⬇ Download gave no file');
    for (const n of [1, 2]) {
        const x = T.find(y => new RegExp(`^🏅 Score Card · Day ${n}\\b`).test(y.title));
        if (!x || !x.rows.some(r => r[0].includes(nm))) { fail(`⬇ Download's 🏅 Score Card · Day ${n} has no row for the trainee`); continue; }
        if (x.head.some(h => /Random/.test(h))) fail(`the 🏅 Score Card should have no Random tasks column: ${JSON.stringify(x.head)}`);
        for (const col of Object.keys(WANT[n])) { const c = CSV.cellOf(x, SCC[col], nm); want('Score Card', n, col, c.err ? null : pctOf(c.v)); }
        if (n === 1) { const c = CSV.cellOf(x, '🗂 CMS file', nm), v = c.err ? null : pctOf(c.v); if (v !== myCms) fail(`🗂 CMS file · Day 1: the trainee's My Scores shows ${myCms}, the trainer's Score Card ${v}`); }
    }
    const foot = await page.evaluate(() => (document.querySelector('.cmsh-screen #scx-scores .bs-foot') || {}).textContent || '');
    if (!/What each column measures/.test(foot) || !/Action Plan = /.test(foot) || !/Backup Drive = /.test(foot) || !/Practical activities = /.test(foot) || /Takeaway/.test(foot) || /Random/.test(foot))
        fail(`the note under 🏅 Scores should say what each column measures: ${foot}`);
    await page.evaluate((id) => cmScorecard.only(id), id); await page.waitForTimeout(500);
    const detail = await page.evaluate((d) => { const c = document.querySelector('.cmsh-screen #bs-fb-' + d); if (!c) return null;
        return [...c.querySelectorAll('details.bs-fb-day')].map(day => [(day.querySelector('summary b') || {}).textContent || '', [...day.querySelectorAll('.bs-fb-it')].map(it => [(it.querySelector('.bs-fb-n') || {}).textContent || '', (it.querySelector('.bs-fb-sc b') || {}).textContent || ''])]); }, dom);
    if (!detail) fail('the trainee\'s card has no 💬 Feedback on Practical Activities');
    else {
        const ITEM = { sa: /^🧪 /, ap: /^📝 Action Plan/, bd: /^📂 Backup/ };
        for (const n of [1, 2]) { const its = (detail.find(([h]) => h === `Day ${n}`) || [])[1] || [];
            if (its.some(([t]) => /Random task/.test(t))) fail(`the trainee's feedback should list no random task: ${JSON.stringify(its)}`);
            for (const col of Object.keys(WANT[n]).filter(k => ITEM[k])) { const v = its.filter(([t]) => ITEM[col].test(t)).map(([, p]) => pctOf(p)).filter(x => x != null);
                want('the card\'s 💬 Feedback on Practical Activities', n, col, v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null); }
            if (n === 1 && its.filter(([t]) => /^🧪 /.test(t)).length !== 2) fail(`Day 1 has two Skill Activities, each counted once (an AI Grader grade and its work-log line are one): ${JSON.stringify(its)}`); }
    }
    await page.evaluate(() => cmScorecard.only(''));
    const scores = await page.evaluate((nm) => { const s = document.querySelector('.cmsh-screen #scx-scores'); if (!s) return null; const hs = [...s.querySelectorAll('.gs-head th')].map(t => t.textContent.trim());
        const tr = [...s.querySelectorAll('tbody tr')].find(r => { const c = r.querySelector('td'); return c && c.textContent.includes(nm); }); return { hs, cells: tr ? [...tr.querySelectorAll('td')].map(td => td.textContent.trim()) : null }; }, nm);
    if (!scores || !scores.cells) fail('🏅 Scores has no row for the trainee');
    else {
        if (scores.hs.some(h => /Random/.test(h))) fail(`🏅 Scores should have no Random Tasks column: ${JSON.stringify(scores.hs)}`);
        // (🧪 Practical activities: the Skill Activities and the case calls, none here, so the Skill Activities' 68%)
        const COL = { '📝 Takeaways': '📝 Takeaways %', '🧪 Skill Activities': '🧪 Practical activities %', '📝 Action Plan': '📝 Action Plan %', '📂 Backup Drive': '📂 Backup Drive %' };
        for (const [h, v] of Object.entries(SYS)) { const i = scores.hs.indexOf(COL[h]); const got = i < 1 ? null : pctOf(scores.cells[i - 1]); if (got !== v) fail(`🏅 Scores · ${COL[h]}: ${got} (should be ${v})`); }
    }
    const recent = (T.find(x => x.title === '🕒 Recent progress') || { rows: [] }).rows.map(r => r.join(' ')).join('\n');
    if (!/Random task resolved/.test(recent)) fail('🕒 Recent progress (⬇ Download) should still list the random task');

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Every score read where it is written, the same on ${new Set(seen.map(x => x[0])).size} surfaces: no takeaway score; Day 1 Skill Activities 68%, Action Plan 50%, Backup Drive 90% (the nightly grade); Day 2 Backup Drive 76%; 🏅 Scores ${JSON.stringify(SYS)}; no Random tasks score anywhere.`);
    console.log('All good.');
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
