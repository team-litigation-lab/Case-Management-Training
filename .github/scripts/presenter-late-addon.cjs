// @check browser — Presenter view on a slow connection: a slide drawn by an add-on script (Day 1's Backup File Maintenance card, js/cm-task-lab.js) is right in the slides window even when the presenter's slide arrives before that script has loaded
// The slides window draws the presenter's slide as soon as js/cm-case-flow.js has filled DAYS, but the add-on scripts after it
// may not have run yet on a slow load. The slide was then drawn without them and never drawn again, so the shared window
// showed the wrong slide until the trainer moved on (it failed drive-slide.cjs on busy CI runners, about 1 run in 10).
// The add-on slide this used was Day 1's Backup Drive "Your Case" (js/cm-drive.js); that page is in the 🧪 Practice Lab now,
// and the deck carries the activity's card instead, drawn by js/cm-task-lab.js (without it the deck shows the activity's
// plain Your Task). This holds js/cm-task-lab.js back for 3 seconds in the slides window only, with the presenter on
// Day 1's Backup File Maintenance card, and checks the window ends up showing that card (its ▶ Start in the Practice Lab)
// without the presenter doing anything else.
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
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await signIn(page, 'Lateaddon', 'Test', 'B100926');
    // the presenter on Day 1's Backup File Maintenance card (its one deck slide), found by its key
    const at = await page.evaluate(() => {
        const kt = document.getElementById('ktLogin'); if (kt) kt.remove();
        state.isAdmin = true; goto('day', DAYS[0].id); state.dayViewMode = 'slides';
        const i = window.cmSlideKeys ? cmSlideKeys.keysOf(DAYS[0]).indexOf('d1m1-drive:task') : -1;
        if (i >= 0) { state.lessonSlide = i; state.maxSlideReached = 9999; }
        render(); return i;
    });
    const CARD = '.ctl-card[data-ctl="d1m1-drive"] .ctl-go';
    if (at < 0) fail("Day 1 has no Backup File Maintenance card (d1m1-drive:task), so there is nothing to check");
    if (at >= 0 && !(await page.waitForSelector(CARD, { state: 'attached', timeout: 10000 }).catch(() => null))) fail("the presenter's own tab doesn't show the Backup File Maintenance card");
    // the slides window (and only it) gets js/cm-task-lab.js 3 s late, as on a slow or busy connection
    let held = 0;
    await ctx.route('**/js/cm-task-lab.js*', async (r) => {
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
        if (!held) fail('the slides window did not load js/cm-task-lab.js, so the slow load was not tested');
        // the presenter does nothing more: the window must show the card by itself
        const shown = await aud.waitForSelector('#audienceRoot ' + CARD, { state: 'attached', timeout: 15000 }).then(() => true).catch(() => false);
        if (!shown) {
            const what = await aud.evaluate(() => ((document.getElementById('audienceRoot') || {}).innerText || '').replace(/\s+/g, ' ').slice(0, 120)).catch(() => '');
            fail(`the slides window did not show the Backup File Maintenance card after js/cm-task-lab.js loaded late (it shows "${what}")`);
        }
        const want = await page.evaluate(() => state.lessonSlide);
        if (want !== at) fail(`the presenter's slide moved (${want}, not ${at}), so the window's slide can't be compared`);
    }
    await page.evaluate(() => presenterEnd(true)).catch(() => {});
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Presenter view on a slow load: the slides window shows Day 1\'s Backup File Maintenance card even when js/cm-task-lab.js loads after the presenter\'s slide arrives.');
})().catch(e => { console.error(e); process.exit(1); });
