// @check browser — 🏅 My Scores' day detail (the trainee's dashboard) is the standard "why this score" table: Activity · Score · 🧾 Why this score · ⭐ What you did great · ❌ What was wrong · 💡 What could have been done better · 🚩 Red flag, with the Knowledge Check's questions right and missed, the grader's growth under 💡, and no blank cell
// js/cm-batch-sheet.js myScoreCardHtml lays each graded item of the opened day (dayParts: the Knowledge Check, Learning
// Checks, Skill Activities and calls, Action Plan, Backup Drive, CMS file, the trainer's feedback) out with fbRowHtml, the
// same row as 💬 Feedback on Practical Activities on the Scorecard.
// Usage: node .github/scripts/my-scores-detail.cjs [baseUrl] [screenshot.png]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/', SHOT = process.argv[3] || '';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1600, height: 1400 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Mia', 'Detail', 'B112026');
    const D = await page.evaluate(async () => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const d1 = DAYS.filter(d => d.cf)[0], t = (m) => new Date(Date.now() - m * 60000).toISOString();
        let act = null; (window.CM_CASE_FLOW.days || []).forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if (!act && d.n === 1 && b.kind === 'activity' && b.act && !/-drive$/.test(b.id)) act = b; })));
        const rec = { id: state.traineeId, name: 'Mia Detail', approved: true, dayProgress: { [d1.id]: { score: 80, passed: true, done: true, history: [{ score: 60 }, { score: 80 }] } } };
        const data = { 'work-log': [{ kind: 'quiz', dayId: d1.id, correct: 8, total: 10, missed: ['Which date starts the statute of limitations?', 'Who may give the client legal advice?'], at: t(300) }],
            'cf-ai-grades': { v: 1, calls: {}, blocks: { [act.id]: { score: 72, tier: 'Developing', subs: { accuracy: 80, presence: 70, risk: 60, efficiency: 50 }, strengths: ['Logged every channel with its time stamp'], gaps: ['The callback window was not set'], growth: ['Put the callback on the calendar before closing the call'], at: t(200), tries: 1 } } } };
        const ctx = { rec, cf: { days: {} }, data, fb: {} };
        cmScorecard.myCtx = () => ctx;
        goto('dashboard'); await new Promise(r => setTimeout(r, 800));
        cmBatchSheet.myOpen(d1.id); await new Promise(r => setTimeout(r, 400));
        const det = document.querySelector('.my-sc-detail'); if (!det) return { err: 'no day detail under 🏅 My Scores' };
        det.scrollIntoView();
        const head = [...det.querySelectorAll('thead th')].map(h => h.textContent.trim());
        const row = (re) => { const it = [...det.querySelectorAll('.bs-fb-it')].find(i => re.test(i.querySelector('.bs-fb-n').textContent)); if (!it) return null;
            const c = (s) => (it.querySelector(s) || {}).innerText || ''; return { sc: c('.bs-fb-sc'), why: c('.bs-why'), great: c('.bs-best'), wrong: c('.bs-imp'), better: c('.bs-better'), flag: c('.bs-flag') }; };
        const blank = [...det.querySelectorAll('.bs-fb-it td')].filter(td => !td.innerText.trim()).length;
        return { head, kc: row(/Knowledge Check/), sa: row(/🧪/), blank };
    });
    if (D.err) fail(D.err);
    else {
        if (D.head.join('|') !== 'Activity|Score|🧾 Why this score|⭐ What you did great|❌ What was wrong|💡 What could have been done better|🚩 Red flag') fail(`🏅 My Scores' day detail has the wrong columns: ${D.head.join(' | ')}`);
        if (!D.kc) fail('the day detail should list the Knowledge Check');
        else {
            if (D.kc.sc !== '80%' || !/best of 2 attempts/.test(D.kc.why) || !/70% passes/.test(D.kc.why)) fail(`the Knowledge Check's why should give the best of the attempts and the 70% pass mark: ${JSON.stringify(D.kc)}`);
            if (!/8 of 10 questions right/.test(D.kc.great)) fail(`the Knowledge Check's ⭐ should say how many questions were right: "${D.kc.great}"`);
            if (!/Missed: Which date starts the statute/.test(D.kc.wrong)) fail(`the Knowledge Check's ❌ should list the questions missed: "${D.kc.wrong}"`);
            if (D.kc.flag.trim() !== 'None') fail(`a Knowledge Check question missed is no 🚩 red flag: "${D.kc.flag}"`);
            if (!/Re-read the slides on the questions missed, then retake/.test(D.kc.better)) fail(`the Knowledge Check's 💡 should say to re-read the slides and retake: "${D.kc.better}"`);
        }
        if (!D.sa) fail('the day detail should list the graded Skill Activity');
        else {
            if (!/The callback window was not set/.test(D.sa.wrong) || /Put the callback/.test(D.sa.wrong)) fail(`the grader's gap is ❌ and its growth isn't: "${D.sa.wrong}"`);
            if (!/Put the callback on the calendar/.test(D.sa.better)) fail(`the grader's growth suggestion should be 💡: "${D.sa.better}"`);
            if (!/A date not set or missed/.test(D.sa.flag)) fail(`the unset callback should be a 🚩 red flag: "${D.sa.flag}"`);
        }
        if (D.blank) fail(`${D.blank} cell(s) of the day detail are blank`);
    }
    if (SHOT) { await page.evaluate(() => document.querySelectorAll('#ktLogin, .kt-modal').forEach(x => x.remove())); const el = await page.$('.my-sc-detail'); if (el) await el.screenshot({ path: SHOT }); }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('🏅 My Scores\' day detail is the "why this score" table: the Knowledge Check\'s questions right and missed with re-read and retake, the grader\'s gap under ❌ and growth under 💡, a red flag, no blank cell.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
