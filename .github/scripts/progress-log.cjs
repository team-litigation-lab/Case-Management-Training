// 📒 My Progress Log on the trainee's dashboard (js/cm-progress-log.js), in place of deck utilization.
// The client: "Trainee's Dashboard should not track progress of the deck utilization but instead show trainee's progress
// Log and Alert trainers when trainee has a glaring challenge or error in setting up their case files". Checks, with seeded
// progress (the trainee's own work-log, task-log, roleplayHistory, doc-filing, drive-setup / drive-grades / drive-check,
// case-flow, day-progress, and a trainer's feedback):
// 1. no deck utilization on the dashboard: no "Slides N%" on a day card, no slide percentage anywhere on it; the day cards
//    keep the Knowledge Check score (it unlocks the days) and their Start / Continue / Review buttons;
// 2. the log: one card, "📒 My Progress Log", dated groups, newest first; each kind of recorded work is in it with how it
//    went (Skill Activity score, Learning Check, Knowledge Check passed / not, activity delivered, documents filed first time
//    right or after N attempts, a refused filing, random task resolved and missed, roleplay, Backup Drive grades and checks,
//    a call taken, an injected call missed, the CMS Case ID logged, checkpoints, trainer feedback);
// 3. "⚠ Needs fixing": the trainee's own open case-file alerts, each with what to do; a document filed is not in it;
// 4. a real filing under the wrong category (cmDocFiling.fileDoc) is recorded (wrongCat, firstAt / lastAt) and shows up
//    as a Needs fixing item;
// 5. bold, 14px and up, LSH navy / orange; a link at the top of the dashboard jumps to it;
// 6. drawing it asks the server nothing (the trainee page adds no requests).
// Usage: node .github/scripts/progress-log.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const SHOT = process.env.PLOG_SHOT || '';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const api = [];
    page.on('request', r => { const u = new URL(r.url()); if (u.pathname.startsWith('/api/')) api.push({ at: Date.now(), path: u.pathname }); });
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Pat', 'Log', 'B111226');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
        // a case open in the CMS (js/cm-cms-case.js remembers the last one), so a filing gets as far as its category check
        localStorage.setItem('cm-cms-case', JSON.stringify({ caseId: 'CM-2026-0042', client: 'John Doe', at: new Date().toISOString() }));
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    if (!(await page.evaluate(() => typeof state !== 'undefined' && !!state.traineeId && !state.isAdmin && !!window.cmProgressLog))) { fail('the trainee is not signed in, or js/cm-progress-log.js did not load'); }

    // ---- 4. a real filing under the wrong category is kept on the record
    const filed = await page.evaluate(async () => {
        const out = await cmDocFiling.fileDoc('RS01', 'Medical Records', 'CM-2026-0042_Doe-John_Intake_2026-02-09.pdf');
        return { out, rec: cmDocFiling.record('RS01') };
    });
    if (filed.out.ok) fail('a filing under the wrong category was accepted');
    if (!filed.rec || filed.rec.wrongCat !== 1 || filed.rec.lastWrongCat !== 'Medical Records' || !filed.rec.expectedCat || !filed.rec.firstAt || !filed.rec.lastAt)
        fail(`a wrong-category filing should be recorded (wrongCat 1, the category tried and expected, first and last attempt times): ${JSON.stringify(filed.rec)}`);

    // ---- seed the rest of the trainee's recorded work
    const H = 3600000, at = (h) => new Date(Date.now() - h * H).toISOString();
    await page.evaluate(async ({ s }) => {
        const at = (h) => new Date(Date.now() - h * 3600000).toISOString();
        const d1 = DAYS.filter(d => d.cf)[0].id, d2 = DAYS.filter(d => d.cf)[1].id;
        const workLog = [
            { kind: 'activity', dayId: d1, label: `Day ${d1} activity: Opening the file`, at: at(30) },
            { kind: 'lab', dayId: d1, label: `Day ${d1} · Opening John Doe's File in the CMS`, score: 82, tier: 'Proficient', strengths: ['Sourced every correction'], at: at(29) },
            { kind: 'lab', dayId: d1, label: `Day ${d1} · Multi-Channel Outreach Logging`, score: 38, tier: 'Not Yet — Keep Building', gaps: ['No time frame given'], at: at(28) },
            { kind: 'lab', dayId: d1, label: `Day ${d1} · Case Flow Day 1 · CM Fundamentals Knowledge Check — CM Self-Summary`, score: 74, at: at(27) },
            { kind: 'quiz', dayId: d1, label: `Day ${d1} Knowledge Check`, score: 50, correct: 10, total: 20, missed: ['q'], at: at(26) },
            { kind: 'quiz', dayId: d1, label: `Day ${d1} Knowledge Check`, score: 65, correct: 13, total: 20, missed: ['q'], at: at(3) },
            { kind: 'roleplay', dayId: d1, label: 'Roleplay — Angry client', score: 71, tier: 'Proficient', at: at(5) }
        ];
        state.workLog = workLog; await storeSet('work-log', workLog);
        state.taskLog = [
            { id: at(20), dayId: d1, task: 'Adjuster asks for the recorded statement today', receivedAt: at(20), status: 'resolved', submittedAt: at(19.5), score: 77 },
            { id: at(10), dayId: d1, task: 'Client wants an update before 3 PM', receivedAt: at(10), status: 'missed', missedAt: at(9) }
        ]; await storeSet('task-log', state.taskLog);
        state.docFiling = Object.assign(state.docFiling || {}, {
            RS02: { attempts: 1, filed: true, name: 'CM-2026-0042_Doe-John_Intake_2026-02-09.pdf', category: 'Intake Documents', at: at(25), firstAt: at(25), lastAt: at(25) },
            RS05: { attempts: 2, filed: true, name: 'CM-2026-0042_Doe-John_CaseFiles_2026-02-09.pdf', category: 'Case Files', at: at(24), firstAt: at(24.2), lastAt: at(24) },
            RS03: { attempts: 3, filed: false, problems: ['The date part must be YYYY-MM-DD.'], firstAt: at(23), lastAt: at(22) }
        }); await storeSet('doc-filing', state.docFiling);
        await storeSet('drive-setup', { score: 60, ok: false, attempts: 2, at: at(21), firstAt: at(40), left: 3 });
        await storeSet('drive-grades', { 2: { score: 55, passed: false, at: at(8) } });
        await storeSet('drive-check', { missing: 0, list: [], at: at(7) });
        await storeSet('case-flow', { v: 1, modules: {}, updatedAt: at(2), reached: { 'd1m1-open': 4, 'd1m2-a1': 2 }, ticks: { 'd1m1-open': [false, true, true] }, tickAt: { 'd1m1-open': at(28.5) },
            calls: { 'd1m2-a1': { at: at(6), lines: 12 } }, injects: { x1: { blockId: 'd1m2-a1', dayId: d1, who: 'Keystone Mutual adjuster', at: at(4), outcome: 'missed', missedAt: at(4) } } });
        state.progress = state.progress || {};
        state.progress[d1] = { done: false, score: 65, date: at(3), history: [{ score: 50, passed: false, date: at(26) }, { score: 65, passed: false, date: at(3) }] };
        await storeSet('day-progress', state.progress);
        state.roleplayHistory = [{ categoryLabel: 'Client calls', topicLabel: 'Angry client', score: 71, date: at(5) }];
        state.myFeedback = { [d1]: { status: 'sent', sentAt: at(1), rating: 'Developing', sentBy: 'Coach Rivera' } };
        void d2; void s;
    }, { s: 0 });

    const t0 = Date.now();
    const view = await page.evaluate(async () => {
        const k = document.getElementById('ktLogin'); if (k) k.remove();
        goto('dashboard'); render();
        await new Promise(r => setTimeout(r, 300));
        const el = document.getElementById('myProgressLog');
        const dash = document.querySelector('.dash-main');
        const rows = el ? [...el.querySelectorAll('.plog-row')].map(r => ({ at: r.dataset.at, kind: r.dataset.kind, text: r.innerText.replace(/\s+/g, ' ').trim() })) : [];
        const fix = el ? [...el.querySelectorAll('.plog-fix li')].map(li => li.innerText.replace(/\s+/g, ' ').trim()) : [];
        const st = (sel) => { const n = el && el.querySelector(sel); if (!n) return null; const c = getComputedStyle(n); return { size: parseFloat(c.fontSize), weight: parseInt(c.fontWeight, 10), color: c.color }; };
        const cards = [...document.querySelectorAll('.module-card')].map(c => ({ cta: (c.querySelector('.module-start-btn') || {}).textContent, text: c.innerText.replace(/\s+/g, ' ') }));
        return { has: !!el, rows, fix, title: el && el.querySelector('h2').textContent, days: el ? [...el.querySelectorAll('.plog-dh')].map(x => x.textContent) : [],
            dashText: dash ? dash.innerText : '', cards, jump: !!document.querySelector('.plog-jump'), jumpText: (document.querySelector('.plog-jump') || {}).innerText || '',
            sTitle: st('.plog-what b'), sDetail: st('.plog-what small'), sTime: st('.plog-time'), sFix: st('.plog-fix-do'), sDay: st('.plog-dh'), sH: st('h2'),
            inMain: !!(el && el.closest('.dash-main')) };
    });
    // 6. drawing the dashboard and its log asked the server nothing
    await page.waitForTimeout(400);
    const during = api.filter(x => x.at >= t0 && x.at <= t0 + 300);
    if (during.length > 2) fail(`drawing the dashboard and the Progress Log sent ${during.length} requests: ${JSON.stringify(during.map(x => x.path))}`);
    const again = Date.now();
    await page.evaluate(() => { for (let i = 0; i < 5; i++) render(); });
    await page.waitForTimeout(300);
    const rerender = api.filter(x => x.at >= again);
    if (rerender.length) fail(`re-drawing the dashboard 5 times sent ${rerender.length} requests: ${JSON.stringify(rerender.map(x => x.path))}`);

    // 1. no deck utilization
    if (/Slides\s*\d+\s*%/i.test(view.dashText)) fail(`the dashboard still shows deck utilization ("Slides N%"): ${view.dashText.match(/Slides\s*\d+\s*%/i)[0]}`);
    if (view.cards.some(c => /\bslides?\b[^.]{0,20}\d+\s*%/i.test(c.text))) fail('a day card shows a slide percentage');
    const c1 = view.cards[0] || {};
    if (!/Knowledge Check 65%/.test(c1.text || '') || !/70% to pass/.test(c1.text || '')) fail(`the first day card should keep its Knowledge Check score and the pass mark: ${String(c1.text).slice(0, 160)}`);
    if (!/^(Continue|Review)$/.test(String(c1.cta || '').trim())) fail(`a day taken but not passed should say Continue (or Review), says "${c1.cta}"`);

    // 2. the log
    if (!view.has) fail('the dashboard has no 📒 My Progress Log');
    if (!view.inMain) fail('the Progress Log should sit in the dashboard\'s main column');
    if (!/📒 My Progress Log/.test(view.title || '')) fail(`the log's title: ${view.title}`);
    const times = view.rows.map(r => Date.parse(r.at));
    if (times.some((t, i) => i && t > times[i - 1])) fail('the log is not newest first');
    if (view.days.length < 2 || !/Today/.test(view.days[0])) fail(`the log should be dated (Today first, then earlier days): ${JSON.stringify(view.days)}`);
    const txt = view.rows.map(r => r.text).join('\n');
    const want = [
        [/Skill Activity: .*Opening John Doe's File in the CMS.*82%/, 'a Skill Activity with its score'],
        [/Learning Check: .*CM Fundamentals Knowledge Check.*74%/, 'a Learning Check with its score'],
        [/Knowledge Check: .*Case Flow Day 1.*Not passed yet.*65%/, 'a Knowledge Check, not passed, with its score'],
        [/Activity delivered: Opening the file/, 'an activity delivered'],
        [/Filed: .*First time right/, 'a document filed first time right'],
        [/Filed: .*2 attempts/, 'a document filed after 2 attempts'],
        [/Filing refused: .*3 attempts, not filed yet/, 'a refused filing with its attempts'],
        [/Filing refused: New Client Intake Sheet/, 'the wrong-category filing just made'],
        [/Random task resolved.*77%/, 'a random task resolved with its grade'],
        [/Random task missed/, 'a random task missed'],
        [/Roleplay — Angry client.*71%/, 'a roleplay with its score'],
        [/Backup Drive: Day 1 folders not built yet.*60%/, 'the Backup Drive setup'],
        [/Backup Drive check: Day 2 Backup File Maintenance.*55%/, 'a Backup Drive grade'],
        [/Backup Drive: ✓ Check my drive.*Every firm folder in place/, 'a drive check'],
        [/Call taken: Multi-Channel Outreach Logging/, 'a call taken on the case'],
        [/Incoming call missed: Keystone Mutual adjuster/, 'an injected call missed'],
        [/Checkpoints: Opening John Doe's File in the CMS.*Conflict Check not ticked/, 'the checkpoints ticked'],
        [/Trainer feedback: Case Flow Day 1 · Developing/, 'feedback received']
    ];
    want.forEach(([re, what]) => { if (!re.test(txt)) fail(`the log should show ${what}`); });
    if ((txt.match(/Roleplay/g) || []).length !== 1) fail('a roleplay in both the work-log and roleplayHistory should be logged once');

    // 3. Needs fixing: the trainee's own open alerts, each with what to do
    const fixTxt = view.fix.join('\n');
    if (!view.fix.length) fail('the log has no "⚠ Needs fixing" items');
    [[/refused 3 times/, 'the document refused 3 times (R1)'], [/New Client Intake Sheet: put under Medical Records/, 'the wrong category (R2)'],
     [/Backup Drive folders not built/, 'the Backup Drive (R3/R8)'], [/Day 2 Backup File Maintenance: 55%/, 'the day\'s drive grade (R3)'],
     [/Conflict Check not documented/, 'the Conflict Check (R6)'], [/Knowledge Check failed 2 times/, 'the Knowledge Check failed twice (R7)'],
     [/Multi-Channel Outreach Logging.*38%/, 'the Skill Activity below 50% (R5)']]
        .forEach(([re, what]) => { if (!re.test(fixTxt)) fail(`Needs fixing should list ${what}: ${fixTxt.slice(0, 400)}`); });
    if (view.fix.some(f => !/What to do:/.test(f))) fail('every Needs fixing item should say what to do');
    if (/First time right|CaseFiles_2026/.test(fixTxt)) fail('a document already filed is not something to fix');
    if (/No CMS Case ID/.test(fixTxt)) fail('a trainee who filed documents into a case has a CMS Case ID (R4 should not fire)');
    if (!view.jump || !/⚠ \d+ to fix/.test(view.jumpText)) fail(`the dashboard's top should link to the log with the number to fix: "${view.jumpText}"`);

    // 5. bold, 14px and up
    [['title', view.sTitle], ['detail', view.sDetail], ['time', view.sTime], ['what to do', view.sFix], ['day heading', view.sDay]].forEach(([n, s]) => {
        if (!s) { fail(`no ${n} in the log`); return; }
        if (s.size < 14) fail(`the log's ${n} is ${s.size}px (14px or more)`);
        if (s.weight < 600) fail(`the log's ${n} is not bold (${s.weight})`);
    });
    if (view.sTitle && view.sTitle.color !== 'rgb(30, 35, 64)') fail(`the log's titles should be LSH navy: ${view.sTitle.color}`);
    if (view.sDay && view.sDay.color !== 'rgb(181, 101, 31)') fail(`the log's dates should be LSH orange: ${view.sDay.color}`);

    // the rules agree with the page: a fresh trainee has nothing logged and nothing to fix
    const empty = await page.evaluate(() => ({ e: cmProgressLog.entries({}, {}).length, a: cmProgressLog.compute({}, {}).length }));
    if (empty.e || empty.a) fail(`an empty record should log nothing and alert nothing: ${JSON.stringify(empty)}`);

    if (SHOT) {
        await page.evaluate(() => { const m = document.querySelector('main'); if (m) m.scrollTop = 0; });
        await page.screenshot({ path: SHOT + '-top.png' });
        await page.evaluate(() => cmProgressLog.jump()); await page.waitForTimeout(700);
        await page.screenshot({ path: SHOT + '-log.png' });
        await page.evaluate(() => { const m = document.querySelector('main'); if (m) m.scrollTop += 560; }); await page.waitForTimeout(300);
        await page.screenshot({ path: SHOT + '-log2.png' });
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`📒 My Progress Log: no deck utilization on the dashboard; ${view.rows.length} entries, dated, newest first (activities, filings, Knowledge Checks, calls, drive checks, tasks, feedback); ${view.fix.length} "Needs fixing" items with what to do; bold 14px+; no requests.`);
    console.log('All good.');
})().catch(e => { console.error(e); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); });
