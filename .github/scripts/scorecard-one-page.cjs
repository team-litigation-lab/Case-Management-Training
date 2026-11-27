// @check browser — The 🏅 Scorecard is one page in two parts: one 🏅 Scores table (all five days, one Overall from cmScorecard, the Lessons, Knowledge Checks and Recent progress folded into its cells) and each trainee's card with their feedback on practical activities per day; ⬇ Download starts with that table
// The owner, handing out scores: "I need all the scores consolidated in one table and then just the feedback on Practical
// activities per day", then "combine the two setups": js/cm-scorecard.js renderAll with js/cm-batch-sheet.js scoresSheet,
// feedbackHtml and csvTables. Three trainees' records are put on the server (one with graded work, one with a little, one
// with nothing), and the page is read as the trainer sees it:
//   1. Admin lands on 🏅 Scorecard → 🏅 Scorecards; the page has exactly two parts, in order: the 🏅 Scores table, then the
//      cards (each with 💬 Feedback on Practical Activities); no other table (Knowledge Checks, Grading systems, Lessons,
//      Recent progress, Score Card, Detailed Scores) and no 📋 Batch Sheet tab;
//   2. 🏅 Scores: Day 1 … Day 5 and every kind of work as columns; each row's Overall is cmScorecard.overall of that trainee's
//      records; sorted by the Overall, nothing scored last; Registered is "date · batch"; a day's cell holds its score, its
//      slides and a line of its work, and its hover lists that day's events with their scores, newest first (each Knowledge
//      Check attempt); ✍️ Knowledge Checks' hover gives each day's best, attempts and pass;
//   3. the card's feedback: Day 1 … Day 5 collapsible, shut at first; Day 1 opens to the seeded AI-graded activity with its
//      score, 🧾 why this score, ⭐ what you did great, ❌ what was wrong, 💡 what could have been done better and 🚩 red flag, in words;
//   4. ⬇ Download starts with 🏅 Scores, then ✍️ Knowledge Checks (a column per day), 📚 Lessons, 🧮 Grading systems (every
//      system's columns, a row per trainee), 🕒 Recent progress (every attempt with its score) and the feedback; ⬇ Scores
//      only is the one table;
//   5. at 1366×768 the page doesn't scroll sideways (the table does, its Trainee column sticky) and the cells stay readable.
// Usage: node .github/scripts/scorecard-one-page.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const CSV = require('./csv-sections.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const BATCH = 'B111526', ANN = 'ann-one--b111526', BEN = 'ben-one--b111526', CY = 'cy-none--b111526', DEE = 'dee-fail--b111526';
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Page', 'One', BATCH);
    const seed = await page.evaluate(async ([ANN, BEN, CY, BATCH, DEE]) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const [d1, d2] = DAYS.filter(d => d.cf), t = (m) => new Date(Date.now() - m * 60000).toISOString();
        let act = null; (window.CM_CASE_FLOW.days || []).forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if (!act && d.n === 1 && b.kind === 'activity' && b.act && !/-drive$/.test(b.id)) act = b; })));
        const doc = ((cmCmsFile.plan().days[1] || {}).docs || [])[0];
        const ann = { id: ANN, name: 'Ann One', batch: BATCH, approved: true, registeredAt: t(5000),
            dayProgress: { [d1.id]: { score: 90, passed: true, done: true, date: t(300), history: [{ score: 40, passed: false, date: t(400) }, { score: 90, passed: true, date: t(300) }] },
                [d2.id]: { score: 75, passed: true, done: true, date: t(200), history: [{ score: 75, passed: true, date: t(200) }] } } };
        const annData = { 'day-progress': ann.dayProgress, 'slide-progress': { [d1.id]: 4 }, 'drive-setup': { score: 100, ok: true, attempts: 1, at: t(350) },
            'drive-grades': { 2: { score: 88, passed: true, at: t(150) } },
            'cf-ai-grades': { v: 1, calls: {}, blocks: { [act.id]: { score: 72, tier: 'Proficient', subs: { accuracy: 80, presence: 70, risk: 60, efficiency: 50 }, strengths: ['Logged every channel with its time stamp'], gaps: ['The callback window was not set'], growth: ['Put the callback on the calendar'], at: t(320), tries: 1 } } },
            'doc-filing': doc ? { [doc.id]: { name: 'Doe - Intake.pdf', category: doc.cms || 'Intake', attempts: 1, filed: true, at: t(310) } } : {} };
        const ben = { id: BEN, name: 'Ben One', batch: BATCH, approved: true, registeredAt: t(4000), dayProgress: { [d1.id]: { score: 75, passed: true, done: true, date: t(100), history: [{ score: 75, passed: true, date: t(100) }] } } };
        const cy = { id: CY, name: 'Cy None', batch: BATCH, approved: true, registeredAt: t(3000) };
        const dee = { id: DEE, name: 'Dee Fail', batch: BATCH, approved: true, registeredAt: t(2000) };
        const deeData = { 'cf-ai-grades': { v: 1, calls: {}, blocks: { [act.id]: { draft: 'x', failed: { why: 'The AI gateway refused this site\'s key', at: t(50) }, tries: 0 } } } };
        for (const [r, data] of [[ann, annData], [ben, { 'day-progress': ben.dayProgress }], [cy, {}], [dee, deeData]]) { await sharedSet('trainee:' + r.id, r); await sharedSet('progress:' + r.id, { data }); }
        return { act: act.title, doc: !!doc };
    }, [ANN, BEN, CY, BATCH, DEE]);

    // 1. the page, as Admin opens it
    await page.evaluate(() => { state.isAdmin = true; state.adminData = null; delete state.adminTab; if (window.cmScorecard) cmScorecard.refresh(); goto('admin'); });
    await page.waitForSelector('.cmsh-screen #scx-scores', { timeout: 30000 }).catch(() => fail('Admin does not open on the 🏅 Scores table'));
    await page.evaluate((b) => cmScorecard.batch(typeof batchShow === 'function' ? (batchShow(b) || b) : b), BATCH);
    await page.waitForFunction(() => document.querySelectorAll('.cmsh-screen #scx-scores tbody tr').length === 4, null, { timeout: 20000 }).catch(() => fail('🏅 Scores never listed the batch\'s four trainees'));
    const L = await page.evaluate(() => {
        const s = document.querySelector('.cmsh-screen'), card = s.querySelector('.scx-card');
        const parts = card ? [...card.children].map(c => c.id || c.className) : [];
        const heads = [...s.querySelectorAll('h3')].filter(h => !h.closest('.bs-pt')).map(h => h.textContent.trim());
        const tabs = [...s.querySelectorAll('.cmsh-row .admin-tab-btn')].map(b => b.textContent.trim());
        const fbs = [...s.querySelectorAll('.bs-pt')].map(c => !!c.querySelector('.bs-fb'));
        return { tab: state.adminTab, parts, heads, tabs, fbs, text: s.innerText };
    });
    if (L.tab !== 'scorecards') fail(`Admin should land on 🏅 Scorecards: ${L.tab}`);
    if (JSON.stringify(L.parts) !== JSON.stringify(['scx-scores', 'bs-pts scx-pad'])) fail(`the page should be exactly two parts, 🏅 Scores then the cards: ${JSON.stringify(L.parts)}`);
    if (L.heads.length !== 1 || !/^🏅 Scores/.test(L.heads[0])) fail(`no table but 🏅 Scores on the page: ${JSON.stringify(L.heads)}`);
    if (!L.fbs.length || L.fbs.some(x => !x)) fail(`every card should carry its 💬 Feedback on Practical Activities: ${JSON.stringify(L.fbs)}`);
    if (L.tabs.some(x => /Batch Sheet/.test(x))) fail(`the 📋 Batch Sheet tab should be gone: ${JSON.stringify(L.tabs)}`);
    if (/Grading systems: every record|Recent progress|Detailed Scores|More detail|📚 Lessons/.test(L.text)) fail('the page still shows a table folded into 🏅 Scores (Grading systems, Recent progress, Detailed Scores, Lessons, More detail)');

    // 2. 🏅 Scores
    const S = await page.evaluate(async ([ANN, BEN, CY, DEE]) => {
        const sec = document.querySelector('.cmsh-screen #scx-scores'), hs = [...sec.querySelectorAll('.gs-head th')].map(t => t.textContent.trim());
        const rows = [...sec.querySelectorAll('tbody tr')].map(tr => [...tr.querySelectorAll('td')].map(td => ({ t: td.innerText.replace(/\s+/g, ' ').trim(), title: td.title || '', sticky: getComputedStyle(td).position, fs: Math.min(...[...td.querySelectorAll('small, b')].map(x => parseFloat(getComputedStyle(x).fontSize)).concat([parseFloat(getComputedStyle(td).fontSize)])) })));
        const ov = {}; for (const id of [ANN, BEN, CY, DEE]) { const [rec, prog, callsim, sim, fb] = await sharedGetMany(['trainee:' + id, 'progress:' + id, 'callsim:' + id, 'simresults:' + id, 'feedback:' + id]);
            const o = cmScorecard.overall({ rec, cf: rec.caseFlow || { days: {} }, data: (prog && prog.data) || {}, callsim, sim, fb: fb || {} }); ov[rec.name] = o ? o.pct : null; }
        return { hs, rows, ov, foot: (sec.querySelector('.bs-foot') || {}).textContent || '', none: (sec.querySelector('.bs-none-line') || {}).textContent || '', warn: !!sec.querySelector('.bs-warn') };
    }, [ANN, BEN, CY, DEE]);
    // (no row numbers on screen: the first header is the Trainee's)
    const H = S.hs, at = h => H.indexOf(h);
    // (Registered and Days passed: only in ⬇ Download, for room on screen)
    if (at('Registered') >= 0 || at('Days passed') >= 0) fail(`🏅 Scores on screen should have no Registered or Days passed column: ${JSON.stringify(H)}`);
    ['Trainee', 'Batch', 'Day 1 %', 'Day 2 %', 'Day 3 %', 'Day 4 %', 'Day 5 %', '✍️ Knowledge Checks %', '🧪 Practical activities %', '📂 Backup Drive %', 'Overall %', 'Result']
        .forEach(h => { if (at(h) < 0) fail(`🏅 Scores has no "${h}" column: ${JSON.stringify(H)}`); });
    // the takeaways are not scored; a column nobody in view has a result in is left out and named under the table
    if (H.some(h => /Takeaway/.test(h))) fail(`🏅 Scores should have no Takeaways column (the takeaways are not scored): ${JSON.stringify(H)}`);
    if (at('📝 Action Plan %') >= 0) fail(`📝 Action Plan has no result for anyone here: its column should be left out: ${JSON.stringify(H)}`);
    if (!/^No results yet: .*📝 Action Plan/.test(S.none)) fail(`the columns left out should be named on one line under the table: "${S.none}"`);
    S.rows.forEach(r => r.forEach((c, i) => { if (i > 0 && !c.t && !['Overall %', 'Result'].includes(H[i])) fail(`${r[0].t}'s "${H[i]}" is blank: an empty cell should say why`); }));
    const why = n => (S.rows.find(r => r[0].t === n) || [])[at('🧪 Practical activities %')];
    if (!why('Cy None') || why('Cy None').t !== 'not graded yet') fail(`a trainee with no graded activity should read "not graded yet": ${JSON.stringify(why('Cy None'))}`);
    if (!why('Dee Fail') || !/^grading failed: The AI gateway refused this site's key/.test(why('Dee Fail').t)) fail(`a trainee whose grading failed should read why: ${JSON.stringify(why('Dee Fail'))}`);
    if (S.warn) fail('AI grading is not down (Ann was graded): no warning should show');
    const names = S.rows.map(r => r[0].t);
    if (JSON.stringify(names) !== JSON.stringify(['Ann One', 'Ben One', 'Cy None', 'Dee Fail'].sort((a, b) => (S.ov[a] == null) - (S.ov[b] == null) || (S.ov[b] || 0) - (S.ov[a] || 0) || a.localeCompare(b))) || names.slice(2).join() !== 'Cy None,Dee Fail')
        fail(`🏅 Scores should be sorted by the Overall, nothing scored last: ${JSON.stringify(names)} (${JSON.stringify(S.ov)})`);
    S.rows.forEach(r => { const v = r[at('Overall %')].t, want = S.ov[r[0].t]; if ((want == null ? '' : want + '%') !== v) fail(`${r[0].t}'s Overall should be cmScorecard.overall (${want}): ${v}`); });
    const ann = S.rows.find(r => r[0].t === 'Ann One') || [];
    if (ann.length) {
        // (Registered is in ⬇ Download, not on screen)
        const d1 = ann[at('Day 1 %')];
        // (the score alone on screen: the day's slides and work are in the trainee's card, 📅 Day scores, js/cm-scorecard-tidy.js)
        if (d1.t !== '72%') fail(`Day 1's cell should show its score alone, 72%: "${d1.t}"`);
        const dayRow = await page.evaluate(() => { const r = [...document.querySelectorAll('.scx-page .bs-pt-s-days tr')].find(x => /^Day 1\b/.test(x.textContent.trim())); return r ? r.textContent.replace(/\s+/g, ' ') : ''; });
        if (!/📚 Slides \d+\/\d+|📚 Slides ✓/.test(dayRow) || !/Knowledge Check 90%/.test(dayRow)) fail(`the card's 📅 Day scores row for Day 1 should lead with its slides, then its work: "${dayRow.slice(0, 200)}"`);
        const a2 = d1.title.indexOf('attempt 2 · passed · 90%'), a1 = d1.title.indexOf('attempt 1 · 40%');
        if (a2 < 0 || a1 < 0 || a2 > a1 || !/Skill Activity|Backup Drive set up/.test(d1.title)) fail(`Day 1's hover should list the day's events with their scores, newest first: ${d1.title.slice(0, 600)}`);
        const d2 = ann[at('Day 2 %')]; if (!/Backup File Maintenance · Case Flow Day 2 · passed · 88%/.test(d2.title)) fail(`Day 2's hover should list its Backup File Maintenance with its score: ${d2.title.slice(0, 400)}`);
        const kc = ann[at('✍️ Knowledge Checks %')]; if (!/Day 1: best 90% of 2 attempts · passed/.test(kc.title) || !/Day 2: best 75% of 1 attempt · passed/.test(kc.title) || !/Day 3: not taken yet/.test(kc.title)) fail(`✍️ Knowledge Checks' hover should give each day's best, attempts and pass: ${kc.title}`);
        if (ann[at('🧪 Practical activities %')].t !== '72%') fail(`🧪 Practical activities should be the graded activity's 72%: ${ann[at('🧪 Practical activities %')].t}`);
        if (ann[0].sticky !== 'sticky') fail(`the Trainee column should stay in view (sticky): ${ann[0].sticky}`);
        if (Math.min(...ann.map(c => c.fs)) < 13.5) fail(`a 🏅 Scores cell's type is under 13.5px: ${Math.min(...ann.map(c => c.fs))}px`);
    } else fail('🏅 Scores has no row for Ann One');
    if (!/What each column measures/.test(S.foot)) fail(`a note under the table should say what each column measures: "${S.foot}"`);
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 2) fail(`at 1366×768 the page scrolls sideways by ${over}px (the table should scroll, not the page)`);

    // 3. the card's feedback on practical activities
    await page.evaluate((id) => cmScorecard.only(id), ANN); await page.waitForTimeout(400);
    const dom = ANN.replace(/[^A-Za-z0-9_-]/g, '_');
    const F0 = await page.evaluate((d) => { const f = document.querySelector('.cmsh-screen #bs-fb-' + d); return f ? [...f.querySelectorAll('details.bs-fb-day')].map(x => [(x.querySelector('summary b') || {}).textContent, x.open]) : null; }, dom);
    if (!F0 || F0.map(x => x[0]).join() !== 'Day 1,Day 2,Day 3,Day 4,Day 5') fail(`the feedback should have Day 1 … Day 5: ${JSON.stringify(F0)}`);
    else if (F0.some(x => x[1])) fail('the feedback\'s days should start shut');
    await page.click(`.cmsh-screen #bs-fb-${dom} details.bs-fb-day[data-day="1"] > summary`).catch(() => fail('Day 1 of the feedback could not be opened'));
    await page.waitForTimeout(200);
    const F1 = await page.evaluate((d) => { const x = document.querySelector('.cmsh-screen #bs-fb-' + d + ' details.bs-fb-day[data-day="1"]'); if (!x) return null;
        const it = [...x.querySelectorAll('.bs-fb-it')].find(i => /🧪/.test(i.querySelector('.bs-fb-n').textContent)); const t = (c) => it && it.querySelector(c) ? it.querySelector(c).innerText.replace(/\s+/g, ' ').trim() : '';
        const head = [...x.querySelectorAll('.bs-fb-t thead th')].map(h => h.textContent.trim());
        return { open: x.open, head, it: it ? it.innerText.replace(/\s+/g, ' ') : '', best: t('.bs-best'), imp: t('.bs-imp'), why: t('.bs-why'), better: t('.bs-better'), flag: t('.bs-flag'), sc: t('.bs-fb-sc') }; }, dom);
    if (!F1 || !F1.open) fail('Day 1 of the feedback did not open');
    else {
        const it = F1.it;
        // (one table a day, the standard "why this score" columns: Activity · Score · 🧾 why · ⭐ great · ❌ wrong · 💡 better · 🚩 red flag)
        if (F1.head.join('|') !== 'Activity|Score|🧾 Why this score|⭐ What you did great|❌ What was wrong|💡 What could have been done better|🚩 Red flag') fail(`the day's feedback table has the wrong columns: ${F1.head.join(' | ')}`);
        if (!it.includes(seed.act) || F1.sc !== '72%') fail(`Day 1 should list the graded activity with its score: "${it}" (${F1.sc})`);
        if (!/Logged every channel with its time stamp/.test(F1.best)) fail(`the activity should say what they did well: "${F1.best}"`);
        if (!/The callback window was not set/.test(F1.imp) || !/Put the callback on the calendar/.test(F1.imp)) fail(`the activity should say what was wrong: "${F1.imp}"`);
        if (!/Below the 80% pass mark/.test(F1.why)) fail(`🧾 Why this score should end with the pass mark: "${F1.why}"`);
        if (!F1.better) fail(`💡 What could have been done better should never be blank: "${F1.better}"`);
        if (!/Proficient/.test(F1.why)) fail(`the activity should say why it scored so: "${F1.why}"`);
        if (!/rubric: accuracy 80%, presence 70%, risk 60%, efficiency 50%/.test(F1.why)) fail(`the AI Grader's four rubric parts should be in the why: "${F1.why}"`);
        if (!/A date not set or missed/.test(F1.flag) || !/The callback window was not set/.test(F1.flag)) fail(`the unset callback should be a 🚩 red flag, saying why and quoting it: "${F1.flag}"`);
    }
    await page.evaluate(() => cmScorecard.only(''));

    // AI grading down: two trainees whose newest AI Grader attempt failed → the table points to 🤖 the AI check
    const down = await page.evaluate(async () => { const at = new Date().toISOString();
        const row = (id, name) => { const c = { rec: { id, name, batch: 'B111526', approved: true }, cf: { days: {} }, data: { 'cf-ai-grades': { blocks: { x1: { score: 60, at: '2026-01-01T00:00:00Z' }, x2: { failed: { why: 'No AI is set up', at } } } } }, fb: {} };
            return { id, name, batch: 'B111526', c, m: cmScorecard.model.compute(c), sc: cmScorecard.compute(c) }; };
        const rows = [row('x-a', 'X A'), row('x-b', 'X B')], A = window.cmAiCheck, keep = { res: A.state.res, run: A.run, latest: A.latest };
        // (a) not known yet: the AI check is asked once, quietly, and nothing alarming is said meanwhile
        // (no check kept: cmAiCheck.latest() answers nothing, so the page runs one; a check kept by another test on this
        //  server would otherwise answer first, js/cm-batch-sheet.js askAi)
        let asked = 0; A.state.res = null; A.latest = async () => null; A.run = async () => { asked++; return null; }; cmBatchSheet._askAiAgain();
        const T0 = cmBatchSheet.scoresSheet(rows); cmBatchSheet.scoresSheet(rows);   // drawn twice: asked once
        await new Promise((r) => setTimeout(r, 50));
        // (b) the check says it doesn't work: the warning; (c) it works again: a calm line, no warning
        A.state.res = { ok: false, error: 'No AI is set up' }; const T1 = cmBatchSheet.scoresSheet(rows);
        A.state.res = { ok: false, fallback: true }; const T2 = cmBatchSheet.scoresSheet(rows);
        A.state.res = { ok: true }; const T3 = cmBatchSheet.scoresSheet(rows);
        A.state.res = keep.res; A.run = keep.run; A.latest = keep.latest;
        return { asked, w0: T0.warn, w1: T1.warn, w2: T2.warn, i2: T2.info, w3: T3.warn, i3: T3.info }; });
    if (down.w0 || down.asked !== 1) fail(`before the AI check has answered, the table should ask it once and not say AI grading is down: ${JSON.stringify(down)}`);
    if (!/AI grading looks down.*No AI is set up.*AI check/.test(down.w1)) fail(`when every trainee's newest grading failed and the AI check fails, the table should point to 🤖 the AI check: "${down.w1}"`);
    if (down.w3 || !/AI grading works again.*2 trainees' last grading failed.*graded again by itself/.test(down.i3 || '')) fail(`once the AI check passes, the warning should give way to a calm line saying the failed gradings are redone by themselves: ${JSON.stringify(down)}`);
    if (down.w2 || !/works again/.test(down.i2 || '')) fail(`grading that carries on with the site's own keys (the gateway refusing) is working, not down: ${JSON.stringify(down)}`);

    // 4. ⬇ Download and ⬇ Scores only
    const file = await CSV.grab(page, () => cmScorecard.csv());
    if (!file) fail('⬇ Download gave no file');
    else {
        const T = CSV.parse(file), titles = T.map(x => x.title), by = t => T.find(x => x.title === t);
        const order = ['🏅 Scores', '✍️ Knowledge Checks', '📚 Lessons', '🧮 Grading systems: every record', '🕒 Recent progress', '💬 Feedback on Practical Activities'];
        if (JSON.stringify(titles.slice(0, order.length)) !== JSON.stringify(order)) fail(`⬇ Download should start with 🏅 Scores, then the folded tables in order: ${JSON.stringify(titles)}`);
        // (the page's columns, with Registered and Days passed, which only the download carries)
        const sc = by('🏅 Scores'); if (sc && JSON.stringify(sc.head.filter(h => h !== 'Registered' && h !== 'Days passed')) !== JSON.stringify(H) || (sc && !(sc.head.includes('Registered') && sc.head.includes('Days passed')))) fail(`⬇ Download's 🏅 Scores should be the table on the page, plus Registered and Days passed: ${JSON.stringify(sc && sc.head)}`);
        const ac = CSV.cellOf(sc, 'Overall %', 'Ann One'); if (ac.v !== (S.ov['Ann One'] + '%')) fail(`⬇ Download's Overall for Ann One: ${ac.err || ac.v}`);
        const kc = by('✍️ Knowledge Checks'); if (!kc || kc.head.filter(h => /^Day \d\./.test(h)).length !== 5) fail(`✍️ Knowledge Checks should have a column per Case Flow day: ${JSON.stringify(kc && kc.head)}`);
        const sys = by('🧮 Grading systems: every record'), nSys = await page.evaluate(() => cmScorecard.sources.length);
        if (!sys || sys.head.filter(h => h === 'Average').length !== nSys || sys.rows.map(r => r[0]).join() !== 'Ann One,Ben One,Cy None,Dee Fail')
            fail(`🧮 Grading systems should be every system's columns side by side, a row per trainee: ${JSON.stringify(sys && [sys.head.filter(h => h === 'Average').length, nSys, sys.rows.map(r => r[0])])}`);
        else { const r = sys.rows.find(x => x[0] === 'Ann One'); if (r[1] !== '83%') fail(`Ann One's Knowledge Check average (90 and 75) should be in her row: ${r.slice(0, 3)}`);
            // 🧪 Skill Activities: the AI Grader's grade with its four rubric parts (cf-ai-grades subs)
            const g = sys.groups || [], s0 = g.findIndex(x => /Skill Activities/.test(x)), sub = k => { const i = sys.head.indexOf(k, s0); return i < 0 ? null : r[i]; };
            if (s0 < 0 || ['Accuracy', 'Presence', 'Risk', 'Efficiency'].map(sub).join() !== '80%,70%,60%,50%') fail(`🧪 Skill Activities should show the AI Grader's four parts for Ann (80/70/60/50): ${['Accuracy', 'Presence', 'Risk', 'Efficiency'].map(sub)}`);
            const d = sys.rows.find(x => x[0] === 'Dee Fail'), si = sys.head.indexOf('Average', s0);
            if (!d || !/^grading failed: /.test(d[si])) fail(`Dee's 🧪 Skill Activities should say her grading failed: ${d && d[si]}`);
            const cy = sys.rows.find(x => x[0] === 'Cy None'); if (!cy || cy[si] !== 'not graded yet') fail(`Cy's 🧪 Skill Activities should say "not graded yet": ${cy && cy[si]}`); }
        const rec = (by('🕒 Recent progress') || { rows: [] }).rows.map(r => r.join(' | ')).join('\n');
        if (!/Ann One \| Day 1 \| Knowledge Check \| Day 1 · attempt 1 \| 40%/.test(rec) || !/Backup File Maintenance \| Case Flow Day 2 · passed \| 88%/.test(rec)) fail(`🕒 Recent progress should list each attempt and the Backup Drive with their scores: ${rec.slice(0, 600)}`);
        const fb = (by('💬 Feedback on Practical Activities') || { rows: [] }).rows.find(r => r[0] === 'Ann One' && r[2].includes(seed.act));
        // (Trainee · Day · Activity · Status · Score · 🧾 why this score · ⭐ great · ❌ wrong · 💡 better · 🚩 red flag: the page's columns)
        const fh = (by('💬 Feedback on Practical Activities') || {}).head || [];
        if (fh.join('|') !== 'Trainee|Day|Activity|Status|Score|🧾 Why this score|⭐ What you did great|❌ What was wrong|💡 What could have been done better|🚩 Red flag') fail(`⬇ Download's feedback should have the page's columns: ${fh.join(' | ')}`);
        if (!fb || fb[4] !== '72%' || !/Proficient/.test(fb[5]) || !/Logged every channel/.test(fb[6]) || !/callback window/.test(fb[7]) || !/A date not set or missed/.test(fb[9])) fail(`⬇ Download's feedback should carry the activity's did well, to improve, red flag and score: ${JSON.stringify(fb)}`);
    }
    const only = await CSV.grab(page, () => cmScorecard.csv(true));
    const O = only ? CSV.parse(only) : [];
    if (O.length !== 1 || O[0].head[0] !== 'Trainee' || O[0].rows.length !== 4 || O[0].head.some(h => /Takeaway/.test(h))) fail(`⬇ Scores only should be the 🏅 Scores table alone: ${JSON.stringify(O.map(x => [x.title, x.head.slice(0, 3), x.rows.length]))}`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`The 🏅 Scorecard is one page: 🏅 Scores (${H.length} columns, one Overall from cmScorecard, the days' work in their cells) and the cards with their feedback on practical activities per day; ⬇ Download starts with 🏅 Scores.`);
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
