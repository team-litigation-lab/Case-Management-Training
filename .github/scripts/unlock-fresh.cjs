// @check browser — 🔓 "Unlock up to Day N" writes onto the trainee's record as it is after the trainer confirms: work the trainee saved while the confirm box was open is kept
// index.html adminUnlockDays used to read trainee:<id>, wait on confirm(), then write back the copy it had read, so the
// Case Flow summary, practice progress, submissions and lab actions the trainee saved in between were rolled back. Now
// the name comes from the roster on screen, the record is read (strictly) only after OK, and the unlock is written onto it:
//   1. a save that lands while the confirm box is open is still on the record after the unlock, with the unlock;
//   2. Cancel writes nothing;
//   3. a record that can't be read after OK is not written (the trainer is told to refresh).
// Usage: node .github/scripts/unlock-fresh.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Una', 'Unlock', 'B111926');
    const r = await page.evaluate(async () => {
        const id = state.traineeId, key = 'trainee:' + id;
        const get = async () => { const x = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json()); return JSON.parse(x.value || 'null'); };
        const base = Object.assign({}, await get(), { approved: true, practiceProgress: { before: true } });
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(base) }) });
        state.adminData = [Object.assign({}, base)];
        const out = {};
        // 1. the trainee saves while the box is open (a synchronous request, so it lands before the box closes)
        const realConfirm = window.confirm;
        window.confirm = () => {
            const x = new XMLHttpRequest(); x.open('POST', '/api/storage/set', false); x.setRequestHeader('Content-Type', 'application/json');
            x.send(JSON.stringify({ key, value: JSON.stringify(Object.assign({}, base, { practiceProgress: { before: true, during: true }, caseFlow: { at: new Date().toISOString(), days: { 1: { id: 11, kc: null } } } })) }));
            return true;
        };
        await adminUnlockDays(id, String(DAYS[2].id));
        const a = await get();
        out.one = { during: !!(a.practiceProgress && a.practiceProgress.during), caseFlow: !!a.caseFlow, unlocked: a.unlockedDays, at: !!a.unlockedDaysAt };
        // 2. Cancel
        const before2 = JSON.stringify(await get());
        window.confirm = () => false;
        await adminUnlockDays(id, String(DAYS[3].id));
        out.cancel = JSON.stringify(await get()) === before2;
        // 3. a read that fails after OK
        window.confirm = () => true;
        const realFetch = window.fetch, toasts = [];
        const realToast = window.toast; window.toast = (m) => { toasts.push(String(m)); };
        try { toast = window.toast; } catch (e) { }
        window.fetch = function (u, o) { if (/\/api\/storage\/get$/.test(String(u))) return Promise.resolve(new Response('{"error":"down"}', { status: 500 })); return realFetch.apply(this, arguments); };
        const realStorage = window.storage; window.storage = undefined;
        await adminUnlockDays(id, String(DAYS[4].id));
        window.fetch = realFetch; window.storage = realStorage; window.toast = realToast; try { toast = realToast; } catch (e) { }
        window.confirm = realConfirm;
        out.failed = { same: JSON.stringify(await get()) === before2, told: toasts.some(t => /refresh/i.test(t)) };
        return out;
    });
    if (!r.one.during || !r.one.caseFlow) fail(`the trainee's save made while the confirm box was open should be kept: ${JSON.stringify(r.one)}`);
    if (!Array.isArray(r.one.unlocked) || !r.one.unlocked.length || !r.one.at) fail(`the unlock should be written: ${JSON.stringify(r.one)}`);
    if (!r.cancel) fail('Cancel should write nothing');
    if (!r.failed.same) fail('a record that could not be read after OK should not be written');
    if (!r.failed.told) fail('the trainer should be told to refresh when the record could not be read');
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('🔓 Unlock up to Day N reads the record after the trainer confirms: a save made while the box was open is kept, Cancel writes nothing, and a failed read writes nothing.');
})().catch(e => { console.error(e); process.exit(1); });
