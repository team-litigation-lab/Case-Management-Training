// @check browser — Presenter view on a slow connection: a slide drawn by an add-on script (Day 1's Backup Drive slide, js/cm-drive.js) is right in the slides window even when the presenter's slide arrives before that script has loaded
// The slides window draws the presenter's slide as soon as js/cm-case-flow.js has filled DAYS, but the add-on scripts after it
// (js/cm-drive.js draws Day 1's Backup File Maintenance "Your Case" slide) may not have run yet on a slow load. The slide was
// then drawn without them (the plain Your Case of an activity) and never drawn again, so the shared window showed the wrong
// slide until the trainer moved on (it failed drive-slide.cjs on busy CI runners, about 1 run in 10). This holds js/cm-drive.js
// back for 3 seconds in the slides window only, with the presenter on that slide, and checks the window ends up showing the
// Backup Drive slide (its 🔗 Link my Google Drive sample) without the presenter doing anything else.
// Usage: node .github/scripts/presenter-late-addon.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs `npm i playwright`)
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
    // Google Drive linking switched on for this site (the test server has no Google keys): the firm's standard comes back
    // from the Worker as it is, marked configured, so the slide carries its 🔗 Link my Google Drive (as drive-slide.cjs does)
    await ctx.route('**/api/drive', async (route) => {
        let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* no body */ }
        const res = await route.fetch(); let body = {}; try { body = await res.json(); } catch (e) { /* not JSON */ }
        if (b.action === 'standard') body.standard = Object.assign({}, body.standard || {}, { configured: true });
        else if (body.drive) body.drive.configured = true;
        route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
    });
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await signIn(page, 'Lateaddon', 'Test', 'B100926');
    // the presenter on Day 1's Backup Drive slide (Backup File Maintenance's Your Case), found by its key
    const at = await page.evaluate(() => {
        const kt = document.getElementById('ktLogin'); if (kt) kt.remove();
        state.isAdmin = true; goto('day', DAYS[0].id); state.dayViewMode = 'slides';
        const i = window.cmSlideKeys ? cmSlideKeys.keysOf(DAYS[0]).indexOf('d1m1-drive:case') : -1;
        if (i >= 0) { state.lessonSlide = i; state.maxSlideReached = 9999; }
        render(); return i;
    });
    if (at < 0) fail("Day 1 has no Backup Drive slide (d1m1-drive:case), so there is nothing to check");
    if (at >= 0 && !(await page.waitForSelector('.drv-slide [data-drv-link]', { state: 'attached', timeout: 10000 }).catch(() => null))) fail("the presenter's own tab doesn't show the Backup Drive slide");
    // the slides window (and only it) gets js/cm-drive.js 3 s late, as on a slow or busy connection
    let held = 0;
    await ctx.route('**/js/cm-drive.js*', async (r) => {
        let audience = true; try { audience = r.request().frame().page() !== page; } catch (e) {}
        if (audience) { held++; await sleep(3000); }
        r.fallback();
    });
    const popup = ctx.waitForEvent('page', { timeout: 10000 }).catch(() => null);
    await page.evaluate(() => presenterStart());
    const aud = await popup;
    if (!aud) fail('🖥 Presenter view did not open its slides window');
    else if (at >= 0) {
        aud.on('pageerror', e => fail(`slides window page error: ${e.message}`));
        await aud.waitForLoadState('load');
        if (!held) fail('the slides window did not load js/cm-drive.js, so the slow load was not tested');
        // the presenter does nothing more: the window must show the Backup Drive slide by itself
        const shown = await aud.waitForSelector('#audienceRoot .drv-slide [data-drv-link]', { state: 'attached', timeout: 15000 }).then(() => true).catch(() => false);
        if (!shown) {
            const what = await aud.evaluate(() => ((document.getElementById('audienceRoot') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 120)).catch(() => '');
            fail(`the slides window did not show the Backup Drive slide after js/cm-drive.js loaded late (it shows "${what}")`);
        }
        const want = await page.evaluate(() => state.lessonSlide);
        if (want !== at) fail(`the presenter's slide moved (${want}, not ${at}), so the window's slide can't be compared`);
    }
    await page.evaluate(() => presenterEnd(true)).catch(() => {});
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Presenter view on a slow load: the slides window shows Day 1\'s Backup Drive slide even when js/cm-drive.js loads after the presenter\'s slide arrives.');
})().catch(e => { console.error(e); process.exit(1); });
