// Smoke test: signs in as a trainee, renders every lesson slide and quiz of every
// day, every page and every practice tool (all parts), at desktop and phone width.
// Fails on any page error, console error or render exception.
// Usage: node tests/smoke.cjs [baseUrl]   (needs `npm i playwright` and a browser)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');   // the name + batch form is gone: trainees arrive from the Portal
const BASE = process.argv[2] || 'http://localhost:8787/';
const IGNORE = /Failed to load resource|ERR_|net::|favicon/;
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const failures = [];
    for (const vp of [{ width: 1360, height: 900, name: 'desktop' }, { width: 390, height: 844, name: 'phone' }]) {
        const page = await browser.newPage({ viewport: vp });
        page.on('pageerror', e => failures.push(`[${vp.name}] page error: ${e.message}`));
        page.on('console', m => { if (m.type() === 'error' && !IGNORE.test(m.text())) failures.push(`[${vp.name}] console error: ${m.text()}`); });
        await page.goto(BASE, { waitUntil: 'load' });
        await page.waitForTimeout(800);
        await signIn(page, 'Smoke', 'Test ' + vp.name, 'B100926');
        // approve the trainee (the storage API is the same one the admin screen uses)
        await page.evaluate(async () => {
            const key = 'trainee:' + state.traineeId;
            const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
            const rec = JSON.parse(r.value || '{}'); rec.approved = true;
            await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
        });
        await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
        if (!(await page.evaluate(() => typeof state !== 'undefined' && !!state.traineeId))) failures.push(`[${vp.name}] sign-in did not complete`);
        await page.evaluate(() => { state.isAdmin = true; });  // unlock every day and tool
        const report = await page.evaluate(async () => {
            const out = [], errs = [];
            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            for (const d of DAYS) {
                goto('day', d.id); state.dayViewMode = 'slides'; await sleep(30);
                const n = buildDaySlides(d).length;
                for (let i = 0; i < n; i++) { state.lessonSlide = i; try { render(); } catch (e) { errs.push(`Day ${d.id} slide ${i}: ${e.message}`); } }
                state.dayViewMode = 'knowledgeCheck'; try { render(); } catch (e) { errs.push(`Day ${d.id} knowledge check: ${e.message}`); }
                out.push(`Day ${d.id}: ${n} slides`);
            }
            for (const v of ['dashboard', 'practice', 'casedocs', 'clientprofile', 'handouts', 'tasks', 'crisisroleplay', 'notes', 'activities', 'tools', 'calls', 'orientation', 'facilitatorguide', 'admin']) {
                try { goto(v); await sleep(60); } catch (e) { errs.push(`page ${v}: ${e.message}`); }
            }
            for (const t of ['audit', 'activities', 'fbstyle']) {   // admin tabs (state.isAdmin is on)
                try { goto('admin'); setAdminTab(t); await sleep(400); render(); } catch (e) { errs.push(`admin tab ${t}: ${e.message}`); }
            }
            for (const t of (typeof PRACTICE_TOOLS !== 'undefined' ? PRACTICE_TOOLS : [])) {
                try { goto('tool', t.id); await sleep(150); (toolState.wizardLabels || []).forEach((_, i) => wizardGoTo(i)); out.push(`tool ${t.id}: ${(toolState.wizardLabels || []).length} parts`); }
                catch (e) { errs.push(`tool ${t.id}: ${e.message}`); }
            }
            return { out, errs };
        });
        report.errs.forEach(e => failures.push(`[${vp.name}] ${e}`));
        if (vp.name === 'desktop') console.log(report.out.join('\n'));
        try { await page.evaluate(() => goto('practice')); await page.waitForTimeout(200); } catch (e) { failures.push(`[${vp.name}] Practice page: ${e.message.split('\n')[0]}`); }
        if (await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1)) failures.push(`[${vp.name}] the page scrolls sideways`);
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('\nSmoke test passed.');
})().catch(e => { console.error(e); process.exit(1); });
