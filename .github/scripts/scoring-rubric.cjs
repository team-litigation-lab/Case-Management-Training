// @check browser — 📐 The Feedback Rubric, the CMS Case File grade, graded transcription and every simulator on the scorecard (the composer's rubric counts once sent; the Batch Sheet and its CSV carry every system)
// 📐 The Feedback Rubric, the CMS Case File grade, graded transcription and every simulator on the scorecard
// (js/cm-rubric.js, js/cm-cms-file.js, js/cm-case-flow.js Notes & Action Plan, js/cm-scorecard.js SOURCES, js/cm-batch-sheet.js):
// 1. the rubric: four dimensions 25 / 25 / 30 / 20 points, four tiers (Exemplary 90 · Proficient 80 · Developing 65 ·
//    Needs Improvement), each tier's point band in each dimension, a descriptor for every cell, the four critical items;
//    the scorecard's tiers are the rubric's; a total is the points' share; only a trainer's sent review counts;
// 2. every grading system names the dimensions it feeds and how it is scored, and the course's simulators are all there
//    (Transcription, Email Simulators, Calendaring, Case Exercises, the CMS Case File, the Trainer Rubric beside the calls,
//    the Net Sheet, the Skill Builders, the Portal simulators, the random tasks and the case calls);
// 3. transcription: word accuracy against what was said (numbers said or typed as digits, fillers ignored); every
//    attempt is graded and kept, the answer key stays shut until it is handed in, the one handed in is the grade and it
//    is on 🎙 Transcription;
// 4. the CMS Case File: Day 1's file graded from the case the CMS reported, Check Your Work ticks by area and the
//    documents filed; an activity not worked is still to do while the day is open and 0 once it is passed; the CMS's
//    report is kept on the trainee's own record;
// 5. the trainee: 🏅 My Performance shows the CMS Case File (what is missing, answers hidden) and the 📐 Rubric profile,
//    and opens the 📐 Feedback Rubric; text 14px or more;
// 6. the trainer: Admin → 🏅 Scorecard → 📐 Feedback Rubric; ✍ Write feedback scores each dimension with the tiers'
//    descriptors, saves the rubric on the day's review, and once sent it counts on the scorecard (📐 Trainer Rubric, the
//    day's dimensions, a breach marked fails the safety gate); the Batch Sheet's 🏅 Scores and its CSV carry every system.
// Usage: node .github/scripts/scoring-rubric.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) fail(m); };
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
const BLOCK = 'd1m3-a1';
const PARAPHRASE = 'John Doe called. Someone from an insurance company phoned him last night and wanted to ask about the accident. He is not sure what to do about it and wants advice. He says he has not heard from us. Call him back.';

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    const get = (key) => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);

    // 1. the rubric
    const R = await page.evaluate(() => {
        const X = cmRubric;
        return { dims: X.DIMS.map(d => [d.id, d.pts, d.w]), tiers: X.TIERS.map(t => [t.min, t.label]), crit: X.CRIT.map(k => k.id),
            bands: X.DIMS.map(d => X.TIERS.map(t => X.band(d, t).join('-')).join(' ')),
            desc: X.DIMS.every(d => X.TIERS.every(t => String(d.desc[t.id] || '').length > 60)),
            model: cmScorecard.model.TIERS.map(t => [t.min, t.label]),
            total: X.total({ dims: { pc: { pts: 22 }, na: { pts: 25 }, cp: { pts: 24 }, cd: { pts: 12 } } }), part: X.total({ dims: { cp: { pts: 15 } } }), none: X.total({ dims: {} }),
            tierOf: [95, 85, 70, 40].map(v => X.tierOf(v).label),
            counts: [X.counts({ status: 'sent', editedByTrainer: true, rubric: { dims: {} } }), X.counts({ status: 'sent', auto: true, rubric: { dims: {} } }), X.counts({ status: 'draft', editedByTrainer: true, rubric: { dims: {} } }), X.counts({ status: 'sent', editedByTrainer: true })] };
    });
    check(JSON.stringify(R.dims) === '[["pc",25,0.25],["na",25,0.25],["cp",30,0.3],["cd",20,0.2]]', `the four dimensions are 25 / 25 / 30 / 20 points (${JSON.stringify(R.dims)})`);
    check(JSON.stringify(R.tiers) === '[[90,"Exemplary"],[80,"Proficient"],[65,"Developing"],[0,"Needs Improvement"]]', `the four tiers: ${JSON.stringify(R.tiers)}`);
    check(JSON.stringify(R.model) === JSON.stringify(R.tiers), 'the 100-point model reads in the rubric\'s own tiers');
    check(JSON.stringify(R.crit) === '["upl","priv","date","trust"]', `the critical items: ${R.crit}`);
    check(R.bands.join(' | ') === '23-25 20-22 17-19 0-16 | 23-25 20-22 17-19 0-16 | 27-30 24-26 20-23 0-19 | 18-20 16-17 13-15 0-12', `each tier's point band per dimension: ${R.bands.join(' | ')}`);
    check(R.desc, 'every dimension has a descriptor for every tier');
    check(R.total === 83 && R.part === 50 && R.none === null, `a total is the points' share of the dimensions scored (83, 50, none): ${R.total}, ${R.part}, ${R.none}`);
    check(R.tierOf.join() === 'Exemplary,Proficient,Developing,Needs Improvement', `scores read in the tiers: ${R.tierOf}`);
    check(R.counts.join() === 'true,false,false,false', `only a trainer's sent review with a rubric counts (not a trainee's auto-review, not a draft): ${R.counts}`);

    // 2. every grading system, mapped to the rubric
    const S = await page.evaluate(() => cmScorecard.sources.map(s => ({ id: s.id, label: s.label, dims: s.dims || [], how: s.how || '' })));
    ['kc', 'lc', 'tk', 'sa', 'cms', 'bd', 'ns', 'tx', 'em', 'cal', 'cx', 'sb', 'gc', 'cc', 'ps', 'rt', 'tr'].forEach(id => check(S.some(s => s.id === id), `the scorecard has the ${id} grading system`));
    check(S.every(s => s.dims.length && s.dims.every(d => ['pc', 'na', 'cp', 'cd'].includes(d)) && s.how.length > 20), 'every grading system names the dimensions it feeds and how it is scored');
    check((S.find(s => s.id === 'cms') || {}).label === 'CMS Case File' && (S.find(s => s.id === 'tx') || {}).label === 'Transcription' && (S.find(s => s.id === 'tr') || {}).label === 'Trainer Rubric', 'the CMS Case File, Transcription and the Trainer Rubric are grading systems');
    // the Portal's simulators are split by kind: email, calendaring, the others
    const split = await page.evaluate(() => { const sc = cmScorecard.compute({ rec: {}, cf: { days: {} }, data: {}, sim: { best: { 'Email Replies': { score: 70 }, 'Calendaring: Litigation Week': { score: 90 }, 'Court E-Filing': { score: 80 } } } });
        const of = id => (sc.rows.find(r => r.s.id === id) || {}).items.map(i => i.name).join(); return { em: of('em'), cal: of('cal'), ps: of('ps') }; });
    check(split.em === 'Email Replies' && split.cal === 'Calendaring: Litigation Week' && split.ps === 'Court E-Filing', `the Portal's simulators count once each, by kind: ${JSON.stringify(split)}`);

    // 3. transcription: the grader, then every attempt in the workspace
    const acc = await page.evaluate(() => { const said = CM_CF_SIM.events['d1m3-a1'].spoken, G = cmCaseFlow.txGrade;
        return { same: G(said, said), digits: G('call my cell, five five five, oh one oh, two two eight eight', 'call my cell 555-010-2288'), fill: G('so, uh, last night', 'so last night'), off: G(said, 'Completely different words about a dog and a park on a sunny afternoon here.') }; });
    check(acc.same === 100 && acc.digits === 100 && acc.fill === 100, `word accuracy: the message itself 100%, numbers said or typed as digits alike, fillers ignored (${JSON.stringify(acc)})`);
    check(acc.off < 15, `a transcript of something else scores near 0: ${acc.off}`);
    await signIn(page, 'Rubric', 'Scorer' + tag, 'B100926');
    const id = await page.evaluate(() => state.traineeId);
    check(!!id, 'a trainee signs in');
    await page.evaluate(async () => { const o = document.getElementById('ktLogin'); if (o) o.remove(); const r = (await storeGet('case-flow')) || {}; delete r.notes; await storeSet('case-flow', r); });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });
    // (the voicemail plays through the browser's speech voices, which a test browser may not have: the trainer's view
    // skips the play-first rule, as .github/scripts/notes-plan.cjs does, and grades the same)
    await page.evaluate((b) => { state.isAdmin = true; cmCaseFlow.notes(b); }, BLOCK);
    await page.waitForSelector('#cf-np #npt_' + BLOCK);
    const tA = await page.evaluate(async (a) => { const el = document.getElementById('npt_' + a.b); if (el && !document.querySelector('#cf-np .np-grade')) { el.value = a.t; cmCaseFlow.npTx(a.b); }
        await new Promise(r => setTimeout(r, 300)); const n = ((await storeGet('case-flow')).notes || {})[a.b] || {};
        return { tries: n.txTries || [], txAt: n.txAt || null, key: !!document.querySelector('#cf-np .np-key'), grade: (document.querySelector('#cf-np .np-grade') || {}).innerText || '' }; }, { b: BLOCK, t: PARAPHRASE });
    check(tA.tries.length === 1 && tA.tries[0].score < 90 && !tA.txAt, `a first attempt below 90% is graded and kept, not handed in: ${JSON.stringify(tA.tries.map(x => x.score))}`);
    check(!tA.key && /Attempt 1 of 3/.test(tA.grade) && /word accuracy/.test(tA.grade), `the answer key stays shut and the attempt's grade shows: ${tA.grade.slice(0, 160)}`);
    const a1 = tA.tries[0] || {};
    check(a1.score === Math.round(0.6 * (100 * a1.facts / a1.of) + 0.4 * a1.acc), `an attempt's grade = facts 60% + word accuracy 40%: ${JSON.stringify(a1)}`);
    // a second, better attempt: graded too; then handed in, the key opens and that attempt is the grade
    const better = await page.evaluate(() => CM_CF_SIM.events['d1m3-a1'].spoken.replace(/My neck's still stiff\. It's worse in the morning\. /, ''));
    const tB = await page.evaluate(async (a) => { const el = document.getElementById('npt_' + a.b); el.value = a.t; cmCaseFlow.npTx(a.b);
        await new Promise(r => setTimeout(r, 300)); const n = ((await storeGet('case-flow')).notes || {})[a.b] || {};
        if (!n.txAt) cmCaseFlow.npTxHand(a.b);
        await new Promise(r => setTimeout(r, 300)); const m = ((await storeGet('case-flow')).notes || {})[a.b] || {};
        return { tries: m.txTries || [], txAt: m.txAt, score: m.txScore, key: !!document.querySelector('#cf-np .np-key'), grade: (document.querySelector('#cf-np .np-grade') || {}).innerText || '' }; }, { b: BLOCK, t: better });
    check(tB.tries.length === 2 && !!tB.txAt && tB.score === tB.tries[1].score && tB.tries[1].final, `the second attempt is graded, handed in and is the transcript's grade: ${JSON.stringify(tB.tries.map(x => x.score))} → ${tB.score}`);
    check(tB.key && /Attempt 1: .*Attempt 2:/s.test(tB.grade), 'the answer key opens with every attempt listed');
    await page.evaluate(() => { const m = document.getElementById('cf-np'); if (m) m.querySelector('.cfx-modal-h button').click(); state.isAdmin = false; });

    // 4. the CMS Case File: the rubric, then a day of work graded
    const plan = await page.evaluate(() => { const P = cmCmsFile.plan(); return Object.fromEntries(Object.entries(P.days).map(([n, d]) => [n, { acts: d.acts.length, docs: d.docs.length, areas: [...new Set(d.acts.map(a => a.area))] }])); });
    check(Object.keys(plan).length === 5 && Object.values(plan).every(d => d.acts > 0 && d.docs > 0), `every Case Flow day has CMS activities and case documents to grade: ${JSON.stringify(plan)}`);
    check(plan[1].areas.includes('parties') && plan[2].areas.includes('ins') && Object.values(plan).some(d => d.areas.includes('cal')) && Object.values(plan).some(d => d.areas.includes('notes')), 'the areas include Parties & Conflict Check, the insurance stack, the calendar and the case notes');
    await page.evaluate(async () => {
        const r = (await storeGet('case-flow')) || {};
        r.ticks = { 'd1m1-open': [true, true, true, true, false] }; r.revealed = { 'd1m1-open': true };
        r.work = { 'd1m1-open': { ref: 'LSH-2026-PI-000777', tool: 'cms', at: new Date().toISOString() } };
        await storeSet('case-flow', r);
        state.docFiling = { RS01: { attempts: 1, filed: true, name: 'LSH-2026-PI-000777_Doe-John_Case-Files_2026-02-09.pdf', category: 'Case Files' }, RS02: { attempts: 2, filed: true, name: 'x', category: 'Case Files' } };
        await storeSet('doc-filing', state.docFiling);
        await cmCmsFile.keep({ caseId: 'LSH-2026-PI-000777', client: 'Doe, John', dol: '02/06/2026', phase: 'Intake' });
    });
    const F = await page.evaluate(async () => { const data = { 'case-flow': await storeGet('case-flow'), 'doc-filing': state.docFiling, 'cms-file': await storeGet('cms-file') };
        const open = cmCmsFile.compute({ rec: { dayProgress: {} }, cf: { days: {} }, data }), shut = cmCmsFile.compute({ rec: { dayProgress: { 11: { score: 90, done: true } } }, cf: { days: {} }, data });
        const d = x => { const y = x.days[0]; return { pct: y.pct, areas: Object.fromEntries(y.areas.map(a => [a.a.id, a.pct])), pend: y.areas.reduce((n, a) => n + a.items.filter(i => i.pending).length, 0) }; };
        return { open: d(open), shut: d(shut), kept: data['cms-file'], personal: PERSONAL_KEYS.includes('cms-file') && PERSONAL_KEYS.includes('cms-upload') }; });
    check(F.kept && F.kept.caseId === 'LSH-2026-PI-000777' && F.kept.client === 'Doe, John' && F.personal, 'the case the CMS reported is kept on the trainee\'s own record (cms-file, synced with their progress)');
    check(F.open.areas.open === 100, `Day 1's case opened & verified: the ID logged, the CMS's case, the client, the DOL, the IDs matching = 100%: ${JSON.stringify(F.open.areas)}`);
    check(F.open.areas.parties === 80, `Parties & Conflict Check: 4 of 5 Check Your Work items ticked = 80%: ${F.open.areas.parties}`);
    check(F.open.areas.docs === 75 && F.open.pend > 0, `documents: first time right 100%, two attempts 50% = 75%, the rest still to do while the day is open: ${F.open.areas.docs}, ${F.open.pend} to do`);
    check(F.shut.pend === 0 && F.shut.pct < F.open.pct && F.shut.areas.docs < 75, `once the day is passed, what was never done counts 0: ${F.open.pct}% → ${F.shut.pct}%`);

    // 5. the trainee's own card: the CMS Case File, the rubric profile, the rubric itself
    await page.evaluate(async () => { state.progress = { 11: { score: 90, done: true, takeaway: 85 } }; await storeSet('day-progress', state.progress); await cloudSaveNow(); goto('scorecard'); });
    // (the CMS Case File, the rubric profile and the grading systems sit under the card's "▸ How this is scored" toggle: opened here)
    await page.waitForSelector('.bs-pt details.bs-pt-how', { timeout: 15000 }).catch(() => {});
    await page.evaluate(() => document.querySelectorAll('.bs-pt details.bs-pt-how').forEach(d => { d.open = true; }));
    await page.waitForSelector('.bs-pt .cmf-sec', { timeout: 15000 }).catch(() => fail('My Performance shows no CMS Case File section'));
    await page.waitForTimeout(600);
    const mine = await page.evaluate(() => { const c = document.querySelector('.bs-pt'); if (!c) return null;
        const cm = c.querySelector('.cmf-sec'), pr = c.querySelector('.bs-pt-s-profile'), det = c.querySelector('details.bs-pt-src');
        return { cms: cm ? cm.innerText : '', profile: pr ? pr.innerText : '', systems: det ? det.textContent : '',
            masked: !!(cm && /▢▢▢/.test(cm.innerText)), rubricBtn: !!document.querySelector('.ft-banner-ctl button[onclick*="scxRubric"]'),
            small: [...c.querySelectorAll('.cmf-sec td, .cmf-sec li, .cmf-day summary, .bs-pt-s-profile td')].filter(x => x.offsetParent && parseFloat(getComputedStyle(x).fontSize) < 14).length }; });
    if (!mine) fail('My Performance: no card');
    else {
        check(/CMS Case File/.test(mine.cms) && /Day 1/.test(mine.cms) && /missing/.test(mine.cms), 'the card shows the CMS Case File, day by day, with what the file is missing');
        check(mine.masked, 'the Check Your Work answers of an activity not finished stay hidden from the trainee');
        check(/Rubric profile/.test(mine.profile) && /Procedural Compliance/.test(mine.profile) && /CMS Case File/.test(mine.profile) && /Transcription/.test(mine.profile), 'the 📐 Rubric profile places every graded system in its dimensions');
        check(/Transcription/.test(mine.systems) && /CMS Case File/.test(mine.systems), 'the grading systems table lists Transcription and the CMS Case File');
        check(mine.rubricBtn, 'My Performance opens the 📐 Feedback Rubric');
        check(mine.small === 0, `no CMS file or rubric profile text under 14px (${mine.small})`);
    }
    await page.evaluate(() => { state.scxRubric = true; render(); });
    const tr = await page.evaluate(() => ({ grid: document.querySelectorAll('.rbp-grid tbody tr').length, cells: document.querySelectorAll('.rbp-grid tbody td').length, map: document.querySelectorAll('.rbp-map tbody tr').length, n: cmScorecard.sources.length,
        crit: (document.querySelectorAll('.rbp-sec')[1] || {}).innerText || '', back: !!document.querySelector('.ft-banner-ctl button[onclick*="scxRubric=false"]'),
        small: [...document.querySelectorAll('.rbp-page td, .rbp-page th, .rbp-page p, .rbp-page li')].filter(x => parseFloat(getComputedStyle(x).fontSize) < 14).length }));
    check(tr.grid === 4 && tr.cells === 16 && tr.map === tr.n, `the trainee's 📐 Feedback Rubric: 4 dimensions × 4 tiers, every grading system mapped (${tr.grid}, ${tr.cells}, ${tr.map}/${tr.n})`);
    check(/UPL/.test(tr.crit) && /Trust money/.test(tr.crit) && tr.back, 'with the critical items and the way back to My Performance');
    check(tr.small === 0, `no rubric text under 14px (${tr.small})`);
    // the mapping table's dimension headers read whole (one line each, never broken mid-word) and the table fits its frame
    const hd = await page.evaluate(() => { const w = document.querySelector('.rbp-map').closest('.rbp-wrap');
        return { wrapped: [...document.querySelectorAll('.rbp-map thead th.rbp-dc small')].filter(x => x.getBoundingClientRect().height > parseFloat(getComputedStyle(x).fontSize) * 1.9).map(x => x.textContent), over: w ? w.scrollWidth - w.clientWidth : 0 }; });
    check(hd.wrapped.length === 0, `the rubric's dimension headers are not broken across lines (${hd.wrapped.join(', ')})`);
    check(hd.over <= 1, `the grading-system table fits its frame at this width (${hd.over}px over)`);
    await page.evaluate(() => { state.scxRubric = false; });

    // 6. the trainer
    const rec = await get('trainee:' + id) || {}; rec.approved = true; await put('trainee:' + id, rec);
    await page.evaluate(() => { state.isAdmin = true; state.adminData = null; goto('admin'); setAdminTab('rubric'); });
    await page.waitForSelector('.rbp-grid', { timeout: 15000 }).catch(() => fail('Admin → 🏅 Scorecard → 📐 Feedback Rubric shows no rubric'));
    const adm = await page.evaluate(() => ({ tabs: [...document.querySelectorAll('.cmsh-row .admin-tab-btn')].map(b => b.textContent.trim()), sec: (document.querySelector('.cmsh-sec.active') || {}).textContent || '' }));
    check(/Scorecard/.test(adm.sec) && adm.tabs.includes('📐 Feedback Rubric') && adm.tabs.includes('📋 Batch Sheet'), `the 📐 Feedback Rubric is a tab of the 🏅 Scorecard section: ${JSON.stringify(adm.tabs)}`);
    await page.evaluate(() => setAdminTab('traineeaudit'));
    await page.waitForFunction(() => typeof openFeedbackFor === 'function' && (state.adminData || []).length > 0, null, { timeout: 15000 }).catch(() => {});
    await page.evaluate((id) => openFeedbackFor(id), id);
    const sid = await page.evaluate((id) => cssId(id), id);
    await page.waitForSelector(`#rbc_${sid}`, { timeout: 15000 }).catch(() => fail('✍ Write feedback has no rubric scoring'));
    const comp = await page.evaluate(async (a) => {
        const day = document.getElementById(`fbc_${a.sid}_day`); day.value = '11'; fbcLoad(a.id);
        cmRubric.pick(a.sid, 'pc', 'pr'); cmRubric.pick(a.sid, 'na', 'ex'); cmRubric.pick(a.sid, 'cp', 'dv'); cmRubric.pick(a.sid, 'cd', 'ni');
        document.getElementById(`rbc_${a.sid}_cp`).value = '21'; cmRubric.input(a.sid);
        const desc = document.getElementById(`rbcd_${a.sid}_cd`).innerText, total = document.getElementById(`rbct_${a.sid}`).innerText;
        document.getElementById(`rbcc_${a.sid}_upl`).value = 'met'; document.getElementById(`rbcc_${a.sid}_trust`).value = 'breach'; cmRubric.input(a.sid);
        document.getElementById(`fbc_${a.sid}_summary`).value = 'Solid day; the trust money needs care.';
        const small = [...document.querySelectorAll(`#rbc_${a.sid} b, #rbc_${a.sid} p, #rbc_${a.sid} span, #rbc_${a.sid} small, #rbc_${a.sid} label, #rbc_${a.sid} select, #rbc_${a.sid} input`)].filter(x => x.offsetParent && parseFloat(getComputedStyle(x).fontSize) < 14).length;
        await fbcSave(a.id, true);
        return { desc, total, small, on: [...document.querySelectorAll(`#rbc_${a.sid} .rbc-t.on`)].map(b => b.textContent.trim()) };
    }, { id, sid });
    check(/Needs Improvement:/.test(comp.desc), `picking a tier shows its descriptor: ${comp.desc.slice(0, 80)}`);
    check(/22 \/ 25|Total/.test(comp.total) && /80 \/ 100|= 80%/.test(comp.total), `the composer totals the points: 22 + 25 + 21 + 12 = 80 of 100: ${comp.total}`);
    check(comp.small === 0, `no composer rubric text under 14px (${comp.small})`);
    const saved = await get('feedback:' + id);
    const d11 = saved && saved.days && saved.days[11];
    check(d11 && d11.status === 'sent' && d11.rubric && d11.rubric.total === 80 && d11.rubric.dims.cp.pts === 21 && d11.rubric.crit.trust === 'breach', `the rubric is saved on the day's sent review: ${JSON.stringify(d11 && d11.rubric)}`);
    const sc = await page.evaluate(async (id) => { const fb = JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: 'feedback:' + id }) }).then(r => r.json())).value);
        const m = cmScorecard.score({ dayProgress: { 11: { score: 90, done: true } } }, {}, fb), s = cmScorecard.compute({ rec: {}, cf: { days: {} }, data: {}, fb });
        return { tr: (s.rows.find(r => r.s.id === 'tr') || {}).avg, groups: m.items.filter(x => x.group === '📐 Trainer rubric').map(x => [x.dim, Math.round(x.pct)]), breach: m.gate.breaches.map(x => x.id), status: m.status }; }, id);
    check(sc.tr === 80, `📐 Trainer Rubric on the scorecard: 80%: ${sc.tr}`);
    check(JSON.stringify(sc.groups) === '[["pc",88],["na",100],["cp",70],["cd",60]]', `each dimension's points count in the day's 100-point model: ${JSON.stringify(sc.groups)}`);
    check(sc.breach.includes('trust') && sc.status === 'gate', `a critical item the trainer marks breached fails the safety gate: ${JSON.stringify(sc)}`);
    // the trainer's Scorecards card and the Batch Sheet carry it
    await page.evaluate(() => { cmScorecard.refresh(); goto('scorecard'); });
    await page.waitForFunction((id) => !!document.getElementById('bs-pt-' + id.replace(/[^A-Za-z0-9_-]/g, '_')), id, { timeout: 20000 }).catch(() => fail('the trainer\'s Scorecards shows no card for the trainee'));
    const card = await page.evaluate((id) => { const c = document.getElementById('bs-pt-' + id.replace(/[^A-Za-z0-9_-]/g, '_')); if (c) c.querySelectorAll('details').forEach(d => { d.open = true; }); return c ? c.innerText : ''; }, id);
    check(/Trainer's rubric/.test(card) && /CMS Case File/.test(card) && !/▢▢▢/.test(card), 'the trainer\'s card shows the trainer rubric in the day\'s dimensions and the CMS Case File with its answers');
    await page.evaluate(() => { goto('admin'); setAdminTab('audit'); });
    await page.waitForSelector('#bs-scores', { timeout: 30000 }).catch(() => fail('the Batch Sheet shows no 🏅 Scores'));
    const bs = await page.evaluate(() => [...document.querySelectorAll('#bs-scores .gs-head th')].map(t => t.textContent));
    ['🗂 CMS Case File', '🎙 Transcription', '✉️ Email Simulators', '🗓 Calendaring', '🔎 Case Exercises', '📐 Trainer Rubric', '🎯 Graded Calls', '📞 Case Calls', '📊 Net Sheet Checks', '🛠 Skill Builders', '🧰 Portal Simulators', '🎲 Random Tasks']
        .forEach(h => check(bs.includes(h), `the Batch Sheet's 🏅 Scores has a "${h}" column`));
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 8000 }).catch(() => null), page.evaluate(() => cmBatchSheet.csv())]);
    if (!dl) fail('the Batch Sheet\'s ⬇ Download gave no CSV');
    else { const txt = require('fs').readFileSync(await dl.path(), 'utf8'); check(/"🗂 CMS Case File"/.test(txt) && /"🎙 Transcription"/.test(txt) && /"📐 Trainer Rubric"/.test(txt) && /"🗂 CMS file"/.test(txt), 'the CSV carries the new grading systems and the Score Card\'s CMS file column'); }

    await browser.close();
    if (failures.length) { console.error(failures.length + ' failure(s):\n' + failures.map((f, i) => `${i + 1}. ${f}`).join('\n')); process.exit(1); }
    console.log('One Feedback Rubric (4 dimensions, 4 tiers with point bands and descriptors, the critical items) maps every grading system; transcription attempts are graded; the CMS Case File is graded day by day; the trainer\'s rubric score counts on the scorecard; the trainee card, the Batch Sheet and its CSV carry them.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
