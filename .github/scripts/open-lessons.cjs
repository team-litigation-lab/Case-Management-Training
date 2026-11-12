// 🔓 Open Lessons (js/cm-open-lessons.js, as Foundational Training's): the trainer opens a Case Flow day for All batches
// or one batch (settings:opendays), or 👤 for one trainee (unlockedDays on their record).
// 1. the Worker: a trainee reads settings:opendays but can't write it, and can't set unlockedDays / unlockedDaysAt on their
//    own record (PROTECTED_TRAINEE_FIELDS);
// 2. in a browser: every form of one Batch ID is one key and a key saved in an older form is merged; the trainer's
//    🔓 Open Lessons (top bar and the Admin tab) opens a day for the batch with a tick and saves it; the trainee's page
//    picks it up in its once-a-minute check and the day card's Start opens; a day nobody opened shows 🔒 Start with the
//    reason; 👤 Open for one trainee saves unlockedDays and opens that day for that trainee alone; locking it again closes it.
// Usage: node .github/scripts/open-lessons.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const path = require('path'); const { pathToFileURL } = require('url');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

async function workerChecks() {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map([['cm:trainee:ana-cruz--b1', JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true })],
        ['cm:settings:opendays', JSON.stringify({ all: [11], batches: { b1: [12] } })]]);
    const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) } };
    const call = async (p, body, token) => { const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
    const t = (await call('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B1' })).body.token;
    const a = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    const read = await call('/api/storage/get', { key: 'settings:opendays' }, t);
    if (read.status !== 200 || !/"all":\[11\]/.test((read.body || {}).value || '')) fail(`a trainee can't read settings:opendays: ${JSON.stringify(read)}`);
    const many = await call('/api/storage/get-many', { keys: ['settings:opendays'] }, t);
    if (!many.body || !many.body.values || !many.body.values['settings:opendays']) fail(`a trainee's get-many doesn't return settings:opendays: ${JSON.stringify(many)}`);
    const w = await call('/api/storage/set', { key: 'settings:opendays', value: JSON.stringify({ all: [11, 12, 13, 14, 15] }) }, t);
    if (w.status !== 403 || /13/.test(store.get('cm:settings:opendays'))) fail(`a trainee could write settings:opendays: ${JSON.stringify(w)}`);
    await call('/api/storage/set', { key: 'trainee:ana-cruz--b1', value: JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true, unlockedDays: [12, 13, 14, 15], unlockedDaysAt: 'x' }) }, t);
    const own = JSON.parse(store.get('cm:trainee:ana-cruz--b1'));
    if ('unlockedDays' in own || 'unlockedDaysAt' in own) fail(`a trainee set unlockedDays on their own record: ${JSON.stringify(own)}`);
    const aw = await call('/api/storage/set', { key: 'settings:opendays', value: JSON.stringify({ all: [11, 12] }) }, a);
    if (aw.status !== 200 || !/12/.test(store.get('cm:settings:opendays'))) fail(`a trainer can't write settings:opendays: ${JSON.stringify(aw)}`);
}

(async () => {
    await workerChecks();
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    await page.addInitScript(() => { window.EAPA_POLL = { approval: 3000 }; });   // the trainee's once-a-minute check, sped up
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    const cards = () => page.evaluate(() => Object.fromEntries([11, 12, 13, 14, 15].map(id => { const b = document.querySelector(`#module-${id} .module-start-btn`);
        return [id, !b ? 'none' : (b.disabled || b.getAttribute('aria-disabled') === 'true') ? 'locked' : 'open']; })));
    const asTrainee = async (tid) => { await page.evaluate(async (tid) => { state.isAdmin = false; state.adminPreview = false; state.traineeId = tid; state.adminTab = null; await syncToLedger(); goto('dashboard'); }, tid); await page.waitForTimeout(800); };
    const asTrainer = async () => { await page.evaluate(async () => { state.isAdmin = true; state.adminPreview = false; state.cmOpenDays = null; state.adminData = null; goto('admin'); }); await page.waitForTimeout(800); };
    try {
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
        await signIn(page, 'Opal', 'Lesson' + tag, 'B100926');
        const tid = await page.evaluate(() => state.traineeId);
        const rec = await page.evaluate(async (k) => sharedGet(k), 'trainee:' + tid);
        rec.approved = true; await put('trainee:' + tid, rec);
        await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });
        await page.addStyleTag({ content: '#ktLogin{display:none !important;}' });   // the tools sign-in pop-up isn't part of this test
        // a second trainee in the same batch, to see 👤 opens for one trainee only
        await put('trainee:other-one--b100926', { id: 'other-one--b100926', name: 'Other One', batch: 'B100926', approved: true });

        // the batch key: every form of one batch is one key; an older key is merged on read
        const keys = await page.evaluate(() => ['B100926', 'B10092026', 'b10092026-lshtrainee-004', ' b 10-09-26 '].map(cmOpenLessons.key));
        if (new Set(keys).size !== 1 || keys[0] !== 'b100926') fail(`one batch read as different keys: ${JSON.stringify(keys)}`);
        const merged = await page.evaluate(() => cmOpenLessons.shape({ all: ['11'], batches: { b100926: [12], 'B10092026-LSHTRAINEE-004': [13] } }));
        if (JSON.stringify(merged) !== JSON.stringify({ all: [11], batches: { b100926: [12, 13] } })) fail(`an older batch key wasn't merged: ${JSON.stringify(merged)}`);

        // nothing opened yet: Day 1 open, Days 2–5 locked, with the reason on 🔒 Start
        await page.evaluate(() => goto('dashboard')); await page.waitForTimeout(800);
        let c = await cards();
        if (c[11] !== 'open' || c[12] !== 'locked' || c[15] !== 'locked') fail(`before the trainer opens anything: ${JSON.stringify(c)}`);
        const lockBtn = await page.evaluate(() => { const b = document.querySelector('#module-12 .module-start-btn'); return b ? { t: b.textContent.trim(), title: b.title } : null; });
        if (!lockBtn || !/🔒/.test(lockBtn.t) || !/trainer opens Case Flow Day 2/.test(lockBtn.title)) fail(`a locked day's Start doesn't say why: ${JSON.stringify(lockBtn)}`);

        // the trainer: 🔓 Open Lessons in the top bar, then the tab; tick Case Flow Day 2 for batch B100926
        await asTrainer();
        const bar = await page.evaluate(() => [...document.querySelectorAll('.topbar button')].some(x => /Open Lessons/.test(x.textContent)));
        if (!bar) fail("no 🔓 Open Lessons button in the trainer's top bar");
        await page.evaluate(() => cmOpenLessons.go('b100926', '')); await page.waitForTimeout(1500);
        const ui = await page.evaluate(() => ({ html: typeof renderAdminOpenLessons === 'function', tiles: document.querySelectorAll('.ft-open-days > .ft-od-days .ft-od-day input').length,
            batch: (document.getElementById('ftOdBatch') || {}).value, tab: !!document.querySelector(".admin-tab-btn.active[onclick*='openlessons']") }));
        if (!ui.html || ui.tiles !== 5 || ui.batch !== 'b100926') fail(`Admin → 🔓 Open Lessons doesn't show the five Case Flow days for the batch: ${JSON.stringify(ui)}`);
        if (!ui.tab) fail('the 🔓 Open Lessons tab isn\'t on the Admin tab row');
        await page.locator('.ft-open-days > .ft-od-days .ft-od-day input').nth(1).check(); await page.waitForTimeout(1200);
        const saved = await page.evaluate(() => sharedGet('settings:opendays'));
        if (JSON.stringify(saved && saved.batches) !== JSON.stringify({ b100926: [12] })) fail(`ticking Case Flow Day 2 for the batch didn't save it: ${JSON.stringify(saved)}`);

        // the trainee's page picks it up in its once-a-minute check (no reload)
        await asTrainee(tid);
        await page.waitForFunction(() => dayUnlocked(12), null, { timeout: 15000 }).catch(() => {});
        await page.evaluate(() => goto('dashboard')); await page.waitForTimeout(500);
        c = await cards();
        if (c[12] !== 'open') fail(`Case Flow Day 2, opened for the batch, is still locked for its trainee: ${JSON.stringify(c)}`);
        if (c[13] !== 'locked') fail(`a day nobody opened shows open: ${JSON.stringify(c)}`);
        const otherBatch = await page.evaluate(() => { const b = state.traineeBatch; state.traineeBatch = 'B010126'; const r = dayUnlocked(12); state.traineeBatch = b; return r; });
        if (otherBatch) fail('a day opened for one batch opened for another batch');

        // 👤 the trainer opens Case Flow Day 4 for this trainee alone
        await asTrainer();
        await page.evaluate((tid) => cmOpenLessons.go('b100926', tid), tid); await page.waitForTimeout(1500);
        const one = await page.evaluate(() => { const p = document.querySelector('.ft-od-one'); return p ? { boxes: p.querySelectorAll('input[type=checkbox]').length, sel: (document.getElementById('ftOdTrainee') || {}).value } : null; });
        if (!one || one.boxes !== 5 || one.sel !== tid) fail(`👤 Open for one trainee isn't on 🔓 Open Lessons: ${JSON.stringify(one)}`);
        await page.locator('.ft-od-one .ft-od-day input').nth(3).check(); await page.waitForTimeout(1200);
        const r2 = await page.evaluate((k) => sharedGet(k), 'trainee:' + tid);
        if (JSON.stringify(r2 && r2.unlockedDays) !== '[14]' || !r2.unlockedDaysAt) fail(`Case Flow Day 4 wasn't saved on the trainee's record: ${JSON.stringify(r2 && r2.unlockedDays)}`);
        const chip = await page.evaluate(() => { state.adminTab = 'audit'; render(); return true; });
        await page.waitForTimeout(1500);
        const chipTxt = await page.evaluate(() => [...document.querySelectorAll('.cm-ol-chip')].map(x => x.textContent.trim()));
        if (chip && !chipTxt.some(t => /Opened for them: CF Day 4/.test(t))) fail(`the Trainee Audit row has no 🔓 chip naming the day opened for them: ${JSON.stringify(chipTxt)}`);

        await asTrainee(tid);
        c = await cards();
        if (c[14] !== 'open') fail(`Case Flow Day 4, opened for this trainee, is locked for them: ${JSON.stringify(c)}`);
        const others = await page.evaluate(() => { const u = state.adminUnlockedDays; state.adminUnlockedDays = []; const r = dayUnlocked(14); state.adminUnlockedDays = u; return r; });
        if (others) fail('a day opened for one trainee opened for the rest of the batch');

        // the trainer locks Case Flow Day 2 again: the trainee (who hasn't started it) sees it close
        await asTrainer();
        await page.evaluate(() => cmOpenLessons.go('b100926', '')); await page.waitForTimeout(1500);
        await page.locator('.ft-open-days > .ft-od-days .ft-od-day input').nth(1).uncheck(); await page.waitForTimeout(1200);
        await asTrainee(tid);
        await page.evaluate(() => { state.slideProgress = Object.assign({}, state.slideProgress, { 12: 0 }); });
        await page.waitForFunction(() => !dayUnlocked(12), null, { timeout: 15000 }).catch(() => {});
        if (await page.evaluate(() => dayUnlocked(12))) fail('Case Flow Day 2, locked again by the trainer, is still open for a trainee who never started it');

        // a trainee can't write the open days (the page's own sharedSet goes through the same Worker rules; checked above)
    } catch (e) { fail('test crashed: ' + (e && e.stack || e)); }
    await browser.close();
    if (failures.length) { console.error('Open Lessons check FAILED:\n- ' + failures.join('\n- ')); process.exit(1); }
    console.log('All good. Open Lessons: a trainee reads settings:opendays but can\'t write it or their unlockedDays; one key per batch, older keys merged; the trainer\'s 🔓 Open Lessons (top bar, Admin tab) opens a Case Flow day for a batch and the trainee\'s card opens within the minute check; 🔒 Start says why; 👤 Open for one trainee opens a day for that trainee alone; locking it again closes it.');
})();
