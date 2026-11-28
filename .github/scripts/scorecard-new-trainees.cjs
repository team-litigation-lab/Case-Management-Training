// @check browser — 🏅 Scorecards picks up every new trainee and every new batch by itself: each approved trainee once, in their batch, while the page is open, whatever else is in the store
// The trainer's 🏅 Scorecards (Admin → 🏅 Scorecard, js/cm-scorecard.js loadAll) lists every trainee:<id> record and reads
// their grades. Nothing is registered by hand: a trainee the LSH Training Portal signs in gets an approved trainee:<id>
// record (worker.js /api/auth/portal), and from then on they must be on the Scorecard. Checked, as a trainer:
//   1. trainees registered in an existing batch and in a brand-new batch (its Batch ID typed in lower case with spaces and dashes, and day-first)
//      are each listed once, under their batch as it is shown everywhere (batchShow), and the new batch is in the picker;
//   2. a trainee not yet approved, a rejected one and an archived one are not listed;
//   3. with the page open, a trainee who registers next is listed on the next background read (once a minute), and so is
//      the Knowledge Check they then pass (their Day 1 score and Overall), with no ↻ Refresh;
//   4. a record the store lists but can't give back (deleted a moment ago: KV's list lags behind a delete; or one
//      unreadable record) never stops the page from taking in the others, on the first read or a background one.
// Usage: node .github/scripts/scorecard-new-trainees.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const OLD = 'B092526', NEW = 'b 11-28-26';   // an existing batch, and a new one (28 November 2026) as a trainee might type it
const T = (id, name, batch, extra) => Object.assign({ id, name, firstName: name.split(' ')[0], lastName: name.split(' ')[1], batch, registeredAt: new Date().toISOString(), approved: true }, extra || {});
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Nia', 'Seed', OLD);
    const seed = [
        T('ana-old--b092526', 'Ana Old', OLD), T('bo-old--b092526', 'Bo Old', OLD),
        T('cal-new--b112826', 'Cal New', 'B281126'), T('dia-new--b112826', 'Dia New', NEW),
        T('eli-wait--b112826', 'Eli Wait', NEW, { approved: false }), T('fay-no--b112826', 'Fay No', NEW, { approved: false, rejected: true }),
        T('gus-gone--b112826', 'Gus Gone', NEW, { archived: true })
    ];
    await page.evaluate(async (seed) => { document.querySelectorAll('#ktLogin, .kt-modal').forEach(o => o.remove());
        for (const r of seed) await sharedSet('trainee:' + r.id, r); }, seed);
    const shown = async () => page.evaluate(() => (cmScorecard.rows() || []).map(r => ({ id: r.id, name: r.name, batch: typeof batchShow === 'function' ? (batchShow(r.batch) || r.batch) : r.batch })));
    const want = (s, name, batch, L) => { const m = s.filter(r => r.name === name);
        if (m.length !== 1) return fail(`${L}: ${name} should be listed once on 🏅 Scorecards: ${m.length} time(s)`);
        if (batch && m[0].batch !== batch) fail(`${L}: ${name} should be under batch ${batch}: "${m[0].batch}"`); };

    // 1–2. the first read, as a trainer opens the page
    await page.evaluate(() => { state.isAdmin = true; state.adminData = null; delete state.adminTab; cmScorecard.refresh(); goto('admin'); });
    await page.waitForFunction(() => (cmScorecard.rows() || []).some(r => r.name === 'Dia New'), null, { timeout: 30000 }).catch(() => fail('🏅 Scorecards never listed the trainees'));
    const show = await page.evaluate((b) => typeof batchShow === 'function' ? (batchShow(b) || b) : b, NEW);
    let s = await shown();
    want(s, 'Ana Old', OLD, 'first read'); want(s, 'Bo Old', OLD, 'first read'); want(s, 'Cal New', show, 'first read'); want(s, 'Dia New', show, 'first read');
    ['Eli Wait', 'Fay No', 'Gus Gone'].forEach(n => { if (s.some(r => r.name === n)) fail(`${n} (not approved, rejected or archived) should not be on 🏅 Scorecards`); });
    const picker = await page.evaluate(() => [...document.querySelectorAll('.scx-bpick select option')].map(o => o.value));
    if (!picker.includes(show)) fail(`the batch picker should offer the new batch ${show}: ${JSON.stringify(picker)}`);
    if (picker.filter(v => v === show).length !== 1) fail(`the new batch should be in the picker once (its two spellings are one batch): ${JSON.stringify(picker)}`);

    // 3. with the page open: a new trainee registers, then passes Day 1's Knowledge Check
    await page.evaluate(async (r) => { await sharedSet('trainee:' + r.id, r); }, T('hal-late--b112826', 'Hal Late', NEW));
    await page.evaluate(() => cmScorecard.reload());
    await page.waitForFunction(() => (cmScorecard.rows() || []).some(r => r.name === 'Hal Late'), null, { timeout: 30000 }).catch(() => {});
    s = await shown(); want(s, 'Hal Late', show, 'a trainee who registered with the page open');
    await page.evaluate(async () => { const d1 = DAYS.find(d => d.cf && d.cf.n === 1), k = 'trainee:hal-late--b112826', r = await sharedGet(k);
        r.dayProgress = { [d1.id]: { score: 90, passed: true, done: true, date: new Date().toISOString(), history: [{ score: 90, passed: true, date: new Date().toISOString() }] } };
        await sharedSet(k, r); });
    await page.evaluate(() => cmScorecard.reload());
    const d1Of = () => page.evaluate(() => { const sec = document.querySelector('#scx-scores'); if (!sec) return null;
        const hs = [...sec.querySelectorAll('.gs-head th')].map(t => t.textContent.trim()), i = hs.indexOf('Day 1 %');
        const tr = [...sec.querySelectorAll('tbody tr')].find(x => /Hal Late/.test(x.cells[0].textContent)); return tr && i >= 0 ? tr.cells[i].innerText.trim() : null; });
    await page.evaluate(() => cmScorecard.batch(''));
    for (let i = 0; i < 40 && !/\d+%/.test((await d1Of()) || ''); i++) await page.waitForTimeout(500);
    const d1 = await d1Of();
    if (d1 == null) fail("Hal Late's row should be in 🏅 Scores once they registered");
    else if (!/\d+%/.test(d1)) fail(`Hal Late's passed Knowledge Check should reach their Day 1 cell without a ↻ Refresh: "${d1}"`);

    // 4. a key the store lists but can't give back, and an unreadable record: the rest are still taken in
    await page.evaluate(async () => {
        // (the test server's KV answers a deleted key at once; a key listed with no value is what KV's lagging list gives)
        await sharedSet('trainee:zed-ghost--b112826', 'not a record');
        // KV's list runs up to a minute behind a delete (a merged account, removed): it names a key that has no record any more
        if (!window.__listLag) { window.__listLag = true; const __l = window.sharedList;
            window.sharedList = sharedList = async (p) => { const k = await __l(p); return p === 'trainee:' ? k.concat(['trainee:gone-merged--b112826']) : k; }; }
        await sharedSet('trainee:ivy-next--b112826', { id: 'ivy-next--b112826', name: 'Ivy Next', firstName: 'Ivy', lastName: 'Next', batch: 'B112826', registeredAt: new Date().toISOString(), approved: true });
    });
    await page.evaluate(() => cmScorecard.reload());   // (one background read, awaited: no second chance)
    s = await shown(); want(s, 'Ivy Next', show, 'a background read with a listed key that has no record, and an unreadable one');
    if (s.some(r => /ghost/.test(r.id))) fail('an unreadable record should not become a row');
    await page.evaluate(() => { state.adminData = null; cmScorecard.refresh(); render(); });
    await page.waitForFunction(() => (cmScorecard.rows() || []).some(r => r.name === 'Ivy Next'), null, { timeout: 30000 }).catch(() => {});
    s = await shown(); want(s, 'Ivy Next', show, 'a first read with a listed key that has no record'); want(s, 'Ana Old', OLD, 'a first read with a listed key that has no record');

    await browser.close();
    if (failures.length) { console.log(failures.length + ' problem(s):'); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`🏅 Scorecards took in every new trainee by itself: an existing batch and a new one (typed "${NEW}" and day-first B281126, shown ${show}, in the picker once), nobody unapproved, rejected or archived, a trainee who registered with the page open and the Knowledge Check they then passed, and the rest of the store past an unreadable record.`);
})().catch(e => { console.error(e); process.exit(1); });
