// @check browser — No page errors (every page and Admin tab, every slide and Knowledge Check, Presenter view; trainee and trainer, 1366x768)
// No page errors: opens every page of the course and every Admin tab, as a trainee and as a trainer, at 1366x768, and
// fails on any page error, console error or exception thrown while a page draws. Each day is opened on every slide and its
// Knowledge Check; the trainer also opens Presenter view's slides window, the roadmap and the
// Case File's tabs.
// Usage: node .github/scripts/no-page-errors.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const IGNORE = /Failed to load resource|ERR_|net::|favicon/;
const PAGES = ['dashboard', 'tasks', 'clientprofile', 'casedocs', 'practice', 'notes', 'handouts', 'activities', 'tools', 'cms', 'calls',
    'crisisroleplay', 'drafting', 'hipaa', 'scorecard', 'knowtools'];   // (#/lor and #/medprov open the Portal's drafting tool: they leave the page)
const TRAINER_PAGES = ['orientation', 'facilitatorguide', 'admin'];
const ADMIN_TABS = ['audit', 'scorecards', 'rubric', 'traineeaudit', 'companion', 'tfeedback', 'rtasks', 'settings', 'sop', 'studio', 'openlessons', 'activities', 'fbstyle'];

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    const failures = []; let where = 'start-up';
    const watch = (p, name) => {
        p.on('pageerror', e => failures.push(`[${name} · ${where}] page error: ${e.message}`));
        p.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) failures.push(`[${name} · ${where}] console error: ${m.text()}`); });
    };
    watch(page, 'main');
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Nope', 'Errors' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
    await page.evaluate(async () => {   // approve the trainee, as the admin screen does
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2000);
    await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });

    // one page: goto, a moment for its async loads, then drawn again; an exception thrown while drawing is a failure too
    const visit = async (label, fn, arg) => {
        where = label;
        if (process.env.DEBUG) console.log('…', label);
        const err = await page.evaluate(async ([src, arg]) => {
            try { await (0, eval)('(' + src + ')')(arg); await new Promise(r => setTimeout(r, 350)); render(); await new Promise(r => setTimeout(r, 150)); return ''; }
            catch (e) { return e && e.stack ? e.stack.split('\n').slice(0, 3).join(' | ') : String(e); }
        }, [fn.toString(), arg]);
        if (err) failures.push(`[main · ${label}] ${err}`);
    };
    const days = await page.evaluate(() => DAYS.map(d => d.id));
    const tools = await page.evaluate(() => (typeof PRACTICE_TOOLS !== 'undefined' ? PRACTICE_TOOLS : []).map(t => t.id));

    for (const role of ['trainee', 'trainer']) {
        if (role === 'trainer') await page.evaluate(() => { state.isAdmin = true; state.adminData = null; });
        else await page.evaluate(() => {   // every day open for the trainee, so each one can be drawn
            state.adminUnlockedDays = DAYS.map(d => d.id); });
        for (const v of PAGES.concat(role === 'trainer' ? TRAINER_PAGES : [])) await visit(`${role} page ${v}`, (v) => goto(v), v);
        for (const id of days) {
            await visit(`${role} Day ${id} first slide`, (id) => { goto('day', id); state.dayViewMode = 'slides'; state.lessonSlide = 0; render(); }, id);
            await visit(`${role} Day ${id} every slide`, async (id) => {
                const n = buildDaySlides(DAYS.find(d => d.id === id)).length, bad = [];
                for (let i = 0; i < n; i++) { state.lessonSlide = i; try { render(); } catch (e) { bad.push(`slide ${i}: ${e.message}`); } await new Promise(r => setTimeout(r, 40)); }
                if (bad.length) throw new Error(bad.join('; '));
            }, id);
            await visit(`${role} Day ${id} Knowledge Check`, () => { state.dayViewMode = 'knowledgeCheck'; render(); });
        }
        for (const id of tools) await visit(`${role} tool ${id}`, async (id) => {
            goto('tool', id); await new Promise(r => setTimeout(r, 120));
            (toolState.wizardLabels || []).forEach((_, i) => wizardGoTo(i));
        }, id);
        await visit(`${role} roadmap`, () => { goto('day', DAYS[0].id); state.dayViewMode = 'slides'; render(); if (typeof openRoadmap === 'function') openRoadmap(); });
        await visit(`${role} roadmap closed`, () => { document.querySelectorAll('.rm-overlay, .roadmap-overlay, [data-roadmap]').forEach(n => n.remove()); goto('dashboard'); });
        await visit(`${role} Case File tabs`, async () => {
            goto('clientprofile');
            for (const b of [...document.querySelectorAll('.cf-file-tabs button, .cf-file-tabs [role="tab"]')]) { b.click(); await new Promise(r => setTimeout(r, 80)); }
        });
        if (role === 'trainer') {
            for (const t of ADMIN_TABS) await visit(`trainer Admin tab ${t}`, async (t) => {
                goto('admin'); setAdminTab(t); await new Promise(r => setTimeout(r, 600));
            }, t);
            // the Trainee Audit's 🔓 Open Lessons chip stays in the Days column, clear of the sticky Actions column
            where = 'Trainee Audit layout';
            await page.evaluate(async () => { const id = 'nope-errors-chip--z';
                await sharedSet('trainee:' + id, { id, name: 'Chip Layout', batch: 'B100926', approved: true, lastActive: new Date().toISOString() });
                state.adminData = null; goto('admin'); setAdminTab('traineeaudit'); });
            await page.waitForFunction(() => document.querySelector('.at-row .cm-ol-chip'), null, { timeout: 15000 }).catch(() => failures.push('[Trainee Audit] no 🔓 Open Lessons chip in a row'));
            const over = await page.evaluate(() => [...document.querySelectorAll('.at-row')].map(tr => {
                const c = tr.querySelector('.cm-ol-chip'), a = tr.querySelector('.at-c-act'); if (!c || !a) return '';
                const cr = c.getBoundingClientRect(), td = c.closest('td').getBoundingClientRect(), ar = a.getBoundingClientRect();
                return cr.right > td.right + 1 || cr.right > ar.left + 1 ? `chip ${Math.round(cr.left)}–${Math.round(cr.right)}, Days ${Math.round(td.left)}–${Math.round(td.right)}, Actions from ${Math.round(ar.left)}` : '';
            }).filter(Boolean));
            if (over.length) failures.push(`[Trainee Audit at 1366px] the 🔓 Open Lessons chip runs out of the Days column into Actions: ${over[0]}`);
            // ✏️ Content Studio with no day chosen, or a day this course doesn't have (an older build's Day 1): it opens the first day
            await visit('trainer Content Studio, Day 1 of an older build', () => { goto('admin'); state.studioDay = 1; renderAdminStudio(); setAdminTab('studio'); });
            await visit('trainer Content Studio, no day chosen', () => { delete state.studioDay; renderAdminStudio(); });
            for (const id of days) await visit(`trainer Content Studio Day ${id}`, (id) => { goto('admin'); setAdminTab('studio'); if (typeof setStudioDay === 'function') setStudioDay(id); }, id);
        }
    }

    // Presenter view: the console and its slides window, as the trainer opens them in class
    where = 'Presenter view';
    await page.evaluate(() => { goto('day', DAYS[1] ? DAYS[1].id : DAYS[0].id); state.dayViewMode = 'slides'; state.lessonSlide = 2; render(); });
    await page.waitForTimeout(300);
    if (await page.evaluate(() => typeof presenterStart === 'function')) {
        const popup = ctx.waitForEvent('page', { timeout: 8000 }).catch(() => null);
        await page.evaluate(() => presenterStart());
        const aud = await popup;
        if (aud) {
            watch(aud, 'slides window');
            await aud.waitForLoadState('load'); await aud.waitForTimeout(1500);
            for (let i = 0; i < 3; i++) { await page.keyboard.press('ArrowRight'); await page.waitForTimeout(300); }
            await aud.close();
        } else failures.push('[Presenter view] the slides window did not open');
    } else failures.push('[Presenter view] presenterStart is missing');

    await browser.close();
    if (failures.length) { console.log(`${failures.length} failure(s):`); [...new Set(failures)].forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`No page errors: ${PAGES.length + TRAINER_PAGES.length} pages, ${days.length} days, ${tools.length} tools, ${ADMIN_TABS.length} Admin tabs, trainee and trainer, and Presenter view.`);
})().catch(e => { console.error(e); process.exit(1); });
