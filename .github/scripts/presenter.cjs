// Presenter view test: the slides window (the one shared in Google Meet) must never flicker.
// Opens Presenter view as a trainer, then watches the slides window's content being replaced.
//   - Next: the slide is drawn once, with no entrance animation (no blank first frames);
//   - the console re-drawing (its live copy reconnects): the slides window is NOT drawn again;
//   - a long slide's next page: shown in place, not drawn again;
//   - the slides window resized: laid out again, still without animation;
//   - the slides window never reloads itself for an update.
// Usage: node .github/scripts/presenter.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs `npm i playwright`)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1360, height: 900 } });
    const page = await ctx.newPage();
    const failures = [], fail = (m) => failures.push(m);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    page.on('pageerror', e => fail(`console tab page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await page.fill('#loginFirstInput', 'Presenter'); await page.fill('#loginLastInput', 'Test'); await page.fill('#loginBatchInput', 'CIPV');
    await page.click('#loginSubmitBtn'); await sleep(1200);
    await page.evaluate(async () => {   // approve the trainee, as the admin screen does
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    await page.evaluate(() => { state.isAdmin = true; goto('day', 1); state.dayViewMode = 'slides'; state.lessonSlide = 2; render(); });
    await sleep(400);
    const popup = ctx.waitForEvent('page');
    await page.evaluate(() => presenterStart());
    const aud = await popup; await aud.waitForLoadState('load');
    aud.on('pageerror', e => fail(`slides window page error: ${e.message}`));
    await sleep(2500);
    // count every time the slides window's content is replaced, and the messages it hears
    await aud.evaluate(() => {
        window.__pv = { draws: 0, msgs: [] };
        new MutationObserver(ms => { if (ms.some(m => m.addedNodes.length)) window.__pv.draws++; }).observe(document.getElementById('audienceRoot'), { childList: true });
        const bc = new BroadcastChannel('lsh-present-v1'); bc.onmessage = e => window.__pv.msgs.push((e.data || {}).type);
    });
    const take = () => aud.evaluate(() => { const r = { draws: window.__pv.draws, msgs: window.__pv.msgs.slice() }; window.__pv.draws = 0; window.__pv.msgs = []; return r; });
    const animations = () => aud.evaluate(() => {
        const wrap = document.getElementById('lessonSlideWrap'); if (!wrap) return ['no slide'];
        return [wrap, ...wrap.children].map(el => getComputedStyle(el).animationName).filter(n => n && n !== 'none');
    });

    // Next: drawn once, cut straight in
    await page.evaluate(() => presenterStep(1)); await sleep(700);
    let r = await take();
    if (r.draws !== 1) fail(`Next drew the slides window ${r.draws} times (expected 1)`);
    let anim = await animations();
    if (anim.length) fail(`the slides window still animates slides in (${anim.join(', ')}): its blank first frames flicker in Meet`);

    // the console re-drawing reloads its live copy, which says hello: the shared window must not redraw
    await page.evaluate(() => render()); await sleep(2500);
    r = await take();
    if (!r.msgs.includes('hello') || !r.msgs.includes('show')) fail(`the console's live copy didn't reconnect as expected (${r.msgs.join(', ')})`);
    if (r.draws !== 0) fail(`the console re-drawing made the slides window redraw the same slide ${r.draws} time(s): that's the flicker`);

    // a long slide split into pages: the next page is shown in place
    const total = await page.evaluate(() => buildDaySlides(DAYS.find(d => d.id === state.dayId)).length);
    let paged = -1;
    for (let i = 0; i < total && paged < 0; i++) {
        await page.evaluate((i) => presenterJump(i), i); await sleep(250);
        if ((await aud.evaluate(() => state.slidePages || 1)) > 1) paged = i;
    }
    if (paged < 0) fail('no slide in Day 1 is long enough to split into pages at this window size (the page test was skipped)');
    else {
        await take();
        await page.evaluate(() => presenterStep(1)); await sleep(600);
        r = await take();
        const badge = await aud.evaluate(() => ((document.querySelector('#lessonSlideWrap .pg-badge') || {}).textContent || ''));
        if (r.draws !== 0) fail(`the next page of slide ${paged + 1} redrew the whole slide ${r.draws} time(s) (expected in place)`);
        if (!/^PAGE 2 \//.test(badge)) fail(`the next page of slide ${paged + 1} isn't showing (badge "${badge}")`);
        if ((await page.evaluate(() => state.presentPage)) !== 1) fail('the console didn\'t hear that page 2 is on screen');
        anim = await animations();
        if (anim.length) fail(`the page change animates (${anim.join(', ')})`);
        await page.evaluate(() => presenterStep(-1)); await sleep(600);
        r = await take();
        const back = await aud.evaluate(() => ((document.querySelector('#lessonSlideWrap .pg-badge') || {}).textContent || ''));
        if (r.draws !== 0 || !/^PAGE 1 \//.test(back)) fail(`Previous didn't go back to page 1 in place (${r.draws} redraws, badge "${back}")`);
    }

    // the slides window resized (e.g. full screen): laid out again, without animation
    await aud.setViewportSize({ width: 1100, height: 700 }); await sleep(800);
    r = await take();
    if (r.draws !== 1) fail(`resizing the slides window drew it ${r.draws} times (expected 1, to lay it out again)`);
    anim = await animations();
    if (anim.length) fail(`after a resize the slide animates in (${anim.join(', ')})`);

    // a new version of the course never reloads the shared window mid-class
    if (await aud.evaluate(() => updateIsSafe())) fail('the slides window would reload itself for an update in the middle of a presentation');

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Presenter view test passed (page test on slide ${paged + 1}).`);
})().catch(e => { console.error(e); process.exit(1); });
