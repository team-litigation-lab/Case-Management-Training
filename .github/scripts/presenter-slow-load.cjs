// @check browser — Presenter view on a slow connection: the slides window shows the presenter's slide even when the presenter answers before the page has finished loading
// The slides window says "hello" from js/cm-updates.js, which loads before js/cm-case-flow.js fills DAYS, and the presenter
// answers at once with the slide to show. On a slow load that answer can arrive between two scripts, before the day exists.
// It used to be dropped, and the window then sat on "Waiting for the presenter…" until the trainer changed slides (it failed
// drive-slide.cjs on busy CI runners). This holds js/cm-case-flow.js back for 3 seconds in the slides window only, then checks
// that the window shows the presenter's slide without the presenter doing anything else.
// Usage: node .github/scripts/presenter-slow-load.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs `npm i playwright`)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
    const page = await ctx.newPage();
    const failures = [], fail = (m) => failures.push(m);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    page.on('pageerror', e => fail(`console tab page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await signIn(page, 'Slowload', 'Test', 'B100926');
    await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); state.isAdmin = true; goto('day', DAYS[0].id); state.dayViewMode = 'slides'; state.lessonSlide = 5; render(); });
    await sleep(500);
    // the slides window (and only it) gets js/cm-case-flow.js 3 s late, as on a slow or busy connection
    let held = 0;
    await ctx.route('**/js/cm-case-flow.js*', async (r) => {
        let audience = true; try { audience = r.request().frame().page() !== page; } catch (e) {}
        if (audience) { held++; await sleep(3000); }
        r.fallback();
    });
    const popup = ctx.waitForEvent('page', { timeout: 10000 }).catch(() => null);
    await page.evaluate(() => presenterStart());
    const aud = await popup;
    if (!aud) { fail('🖥 Presenter view did not open its slides window'); }
    else {
        aud.on('pageerror', e => fail(`slides window page error: ${e.message}`));
        await aud.waitForLoadState('load');
        if (!held) fail('the slides window did not load js/cm-case-flow.js, so the slow load was not tested');
        // the presenter does nothing more: the window must show slide 5 by itself
        const shown = await aud.waitForFunction(() => !!document.querySelector('#audienceRoot #lessonSlideWrap') && state.lessonSlide === 5, null, { timeout: 15000 }).then(() => true).catch(() => false);
        if (!shown) {
            const what = await aud.evaluate(() => ((document.getElementById('audienceRoot') || {}).innerText || '').slice(0, 80)).catch(() => '');
            fail(`the slides window did not show the presenter's slide after a slow load (it shows "${what}")`);
        }
        const want = await page.evaluate(() => state.lessonSlide);
        if (want !== 5) fail(`the presenter's slide moved (${want}), so the window's slide can't be compared`);
    }
    await page.evaluate(() => presenterEnd(true)).catch(() => {});
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Presenter view on a slow load: the slides window shows the presenter\'s slide even when the answer to its hello arrives before the course\'s days are loaded.');
})().catch(e => { console.error(e); process.exit(1); });
