// @check browser — ⚡ Run now: every manual trigger a trainer has sits in one menu on the Admin header and the 🏅 Scorecard banner; each item calls the same function as its own button, says what came back (the AI check's error too), fits at 1366×768 and is never shown to a trainee
// The owner: "Also put all manual triggers on the header." js/cm-run-now.js, in a real browser:
//   1. a trainee: no ⚡ Run now anywhere (cmRunNow.html() is empty, no .cmrn on their pages);
//   2. the trainer: ⚡ Run now on the Admin header of every admin page (🏅 Scorecards, 👥 Trainee Audit, ⚙ Settings) and on
//      the 🏅 Scorecard banner; it lists every trigger, and each names a function that its own button in the course calls
//      (onclick="<fn>(…)" in the page's source);
//   3. each item, with that function stubbed, calls it (the one-trainee items with the trainee picked in the menu; 🌙 every
//      Backup Drive once per linked trainee) and says the result in the menu and the toast: the AI check's own error;
//   4. at 1366×768 the open menu is inside the window.
// Usage: node .github/scripts/run-now.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const fs = require('fs'), path = require('path');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const ROOT = path.join(__dirname, '..', '..');
const SRC = ['index.html'].concat(fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js') && f !== 'cm-run-now.js').map(f => 'js/' + f)).map(f => fs.readFileSync(path.join(ROOT, f), 'utf8')).join('\n');
const WANT = { ai: 'cmAiCheck.run', studio: 'studioTestAI', drives: 'cmDriveWork.gradeNow', refresh: 'cmScorecard.refresh', tfb: 'loadTraineeFeedbackAdmin', subs: 'daLoadReview', drafts: 'daDraftAll',
    work: 'cmDriveWork.gradeNow', days: 'driveGradeFor', check: 'driveCheckFor', twork: 'loadTraineeWork' };
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Run', 'Now', 'B111626');

    // 1. a trainee
    const tr = await page.evaluate(async () => { const o = document.getElementById('ktLogin'); if (o) o.remove();
        const out = { html: window.cmRunNow ? cmRunNow.html() : 'no cmRunNow' };
        for (const v of ['dashboard', 'scorecard', 'admin']) { goto(v); render(); await new Promise(r => setTimeout(r, 300)); out[v] = document.querySelectorAll('.cmrn').length; }
        return out; });
    if (tr.html !== '' || tr.dashboard || tr.scorecard || tr.admin) fail(`a trainee should never see ⚡ Run now: ${JSON.stringify(tr)}`);

    // 2. the trainer: on every admin page's header, and on the 🏅 Scorecard banner
    await page.evaluate(async () => { state.isAdmin = true; state.adminData = null; delete state.adminTab; if (window.cmScorecard) cmScorecard.refresh(); goto('admin'); });
    await page.waitForSelector('.cmsh-screen #scx-scores', { timeout: 30000 }).catch(() => fail('Admin did not open on 🏅 Scorecards'));
    const where = {};
    for (const tab of ['scorecards', 'traineeaudit', 'settings']) {
        where[tab] = await page.evaluate(async (tab) => { setAdminTab(tab); await new Promise(r => setTimeout(r, 400));
            return { header: !!document.querySelector('.cmsh-tabs .cmrn'), banner: !!document.querySelector('.scx-banner .cmrn') }; }, tab);
        if (!where[tab].header) fail(`⚡ Run now is not on the Admin header of ${tab}`);
    }
    if (!where.scorecards.banner) fail('⚡ Run now is not on the 🏅 Scorecard banner (beside ⬇ Download and ↻ Refresh)');
    await page.evaluate(() => setAdminTab('scorecards'));
    const list = await page.evaluate(() => cmRunNow.list());
    for (const [id, fn] of Object.entries(WANT)) { const t = list.find(x => x.id === id); if (!t || t.fn !== fn) fail(`⚡ Run now should have ${id} calling ${fn}: ${JSON.stringify(t)}`); }
    for (const t of list) { const re = new RegExp(`onclick=\\\\?"[^"]*\\b${t.fn.replace(/\./g, '\\.')}\\(`); if (!re.test(SRC)) fail(`${t.label}: no button in the course calls ${t.fn}, so ⚡ Run now isn't calling its real function`); }
    const shown = await page.evaluate(() => [...document.querySelectorAll('.cmsh-tabs .cmrn [data-run]')].map(b => b.dataset.run));
    if (JSON.stringify(shown.sort()) !== JSON.stringify(list.map(x => x.id).sort())) fail(`the header menu should show every trigger: ${JSON.stringify(shown)}`);

    // 3. each item calls its function (stubbed here) and says what came back
    const R = await page.evaluate(async () => {
        const calls = []; const keep = {};
        const ppl = (state.adminData || []).filter(r => r && r.approved === true && !r.archived).slice(0, 2);
        const [a, b] = ppl.map(r => r.id);
        keep.dw = window.cmDriveWork; keep.reps = state.driveReports; keep.at = state.driveReportsAt;
        const msg = {};
        window.cmDriveWork = Object.assign({}, keep.dw, { gradeNow: async (id) => { calls.push(['cmDriveWork.gradeNow', id]); msg[id] = id === b ? { ok: false, text: 'The Drive could not be read' } : { ok: true, text: 'Graded 2 written files.' }; }, state: () => ({ msg }) });
        state.driveReports = { [a]: { connected: true }, [b]: { connected: true } }; state.driveReportsAt = Date.now();
        const stub = (name, f) => { keep[name] = window[name]; window[name] = async (...x) => { calls.push([name, ...x]); return f ? f(...x) : undefined; }; };
        keep.ai = window.cmAiCheck; window.cmAiCheck = { run: async () => { calls.push(['cmAiCheck.run']); return { ok: false, error: "The AI gateway refused this site's key (403)." }; }, state: {} };
        keep.sc = window.cmScorecard.refresh; cmScorecard.refresh = () => { calls.push(['cmScorecard.refresh']); };
        stub('studioTestAI', () => { state.studioMsg = '✅ AI connection works (0.4s).'; });
        stub('loadTraineeFeedbackAdmin', () => { state.tfbAdmin = { items: [1, 2] }; });
        stub('daLoadReview'); stub('daDraftAll');
        stub('driveGradeFor', (id) => { state.driveReports[id] = Object.assign({}, state.driveReports[id], { checkErr: 'Backup Drive isn\'t switched on for this site.' }); });
        stub('driveCheckFor', (id) => { state.driveReports[id] = Object.assign({}, state.driveReports[id], { checkErr: '', missing: ['01 Intake'] }); });
        stub('loadTraineeWork');
        const out = {};
        document.querySelector('.cmsh-tabs .cmrn').open = true;
        const press = async (id) => { calls.length = 0; document.querySelector(`.cmsh-tabs .cmrn [data-run="${id}"]`).click(); for (let i = 0; i < 40 && cmRunNow.state.busy; i++) await new Promise(r => setTimeout(r, 50));
            await new Promise(r => setTimeout(r, 50));
            out[id] = { calls: calls.map(c => c.join(' ')), st: (document.querySelector('.cmsh-tabs .cmrn-st') || {}).textContent || '', toast: (document.getElementById('toast') || {}).textContent || '' }; };
        for (const id of ['ai', 'studio', 'drives', 'refresh', 'tfb', 'subs', 'drafts']) await press(id);
        const sel = document.querySelector('.cmsh-tabs .cmrn select'); sel.value = b; sel.dispatchEvent(new Event('change'));
        for (const id of ['work', 'days', 'check', 'twork']) await press(id);
        // put back what was stubbed
        window.cmDriveWork = keep.dw; state.driveReports = keep.reps; state.driveReportsAt = keep.at; window.cmAiCheck = keep.ai; cmScorecard.refresh = keep.sc;
        ['studioTestAI', 'loadTraineeFeedbackAdmin', 'daLoadReview', 'daDraftAll', 'driveGradeFor', 'driveCheckFor', 'loadTraineeWork'].forEach(n => { window[n] = keep[n]; });
        return { out, a, b };
    });
    const O = R.out, exp = (id, calls, st, toast) => { const o = O[id] || {};
        // (🌙 every drive: one call per linked trainee, in the order of their names)
        if (JSON.stringify(id === 'drives' ? [...(o.calls || [])].sort() : o.calls) !== JSON.stringify(id === 'drives' ? [...calls].sort() : calls)) fail(`${id} should call ${JSON.stringify(calls)}: ${JSON.stringify(o.calls)}`);
        if (!st.test(o.st)) fail(`${id} should say what came back in the menu: "${o.st}"`);
        if (toast && !st.test(o.toast)) fail(`${id} should say it in the toast too: "${o.toast}"`); };
    exp('ai', ['cmAiCheck.run'], /❌ AI grading doesn't work right now: The AI gateway refused this site's key \(403\)\./, true);
    exp('studio', ['studioTestAI'], /✅ AI connection works/, true);
    exp('drives', [`cmDriveWork.gradeNow ${R.a}`, `cmDriveWork.gradeNow ${R.b}`], /❌ 1 of 2 Backup Drives graded; 1 couldn't be: .*The Drive could not be read/, true);
    exp('refresh', ['cmScorecard.refresh'], /Reading every trainee's records again/, true);
    exp('tfb', ['loadTraineeFeedbackAdmin'], /2 entries/, true);
    exp('subs', ['daLoadReview'], /read again/, true);
    exp('drafts', ['daLoadReview', 'daDraftAll'], /Drafting finished/, false);
    exp('work', [`cmDriveWork.gradeNow ${R.b}`], /❌ .*The Drive could not be read/, true);
    exp('days', [`driveGradeFor ${R.b}`], /❌ .*Backup Drive isn't switched on/, true);
    exp('check', [`driveCheckFor ${R.b}`], /✓ .*1 folder missing/, true);
    exp('twork', [`loadTraineeWork ${R.b} true`], /work read again/, true);

    // 4. it fits at 1366×768
    const fit = await page.evaluate(async () => { setAdminTab('scorecards'); await new Promise(r => setTimeout(r, 300));
        const out = {}; for (const w of ['.cmsh-tabs', '.scx-banner']) { const d = document.querySelector(w + ' .cmrn'); if (!d) continue; d.querySelector('summary').click(); await new Promise(r => setTimeout(r, 150));
            const p = d.querySelector('.cmrn-pop').getBoundingClientRect(); out[w] = { l: Math.round(p.left), r: Math.round(p.right), t: Math.round(p.top), b: Math.round(p.bottom), w: innerWidth, h: innerHeight }; d.open = false; }
        return out; });
    Object.entries(fit).forEach(([w, p]) => { if (p.l < 0 || p.r > p.w || p.t < 0 || p.b > p.h) fail(`at 1366×768 the open ⚡ Run now (${w}) is outside the window: ${JSON.stringify(p)}`); });
    if (Object.keys(fit).length !== 2) fail(`both ⚡ Run now menus should open: ${JSON.stringify(fit)}`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`⚡ Run now: ${list.length} triggers on the Admin header and the 🏅 Scorecard banner, each calling its own button's function and saying what came back; trainers only; it fits at 1366×768.`);
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
