// @check browser — 🧭 every Skill Building slide has the movable Work here card (🗂 Open the CMS, 📂 the trainee's Drive folder); a lesson slide doesn't, and a card dragged stays where it was put
// js/cm-sb-dock.js: on Day 1's "Skill Building: Does PD Touch Our Case?" (d1m3-a3) the card is on screen with the CMS and
// the Drive; on a lesson slide it is gone; dragged by its handle it moves and is still there after the next slide; – folds it
// to a pill and the pill brings it back; Open the CMS opens the CMS beside the slide. Type is bold and at least 16px.
// Usage: node .github/scripts/sb-dock.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    const last = 'Dock' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
    await signIn(page, 'Dana', last, 'B100926');

    const go = (id, view) => page.evaluate(([id, view]) => { const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
        const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === id && (!view || cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === view));
        if (k < 0) return false; goToSlide(k); return true; }, [id, view]);
    const shown = () => page.evaluate(() => { const d = document.getElementById('cm-sb-dock'); return !!d && !d.hidden && d.getBoundingClientRect().width > 0; });

    if (!await go('d1m3-a3', 'case')) fail("Day 1 has no slide for Skill Building: Does PD Touch Our Case? (d1m3-a3)");
    await page.waitForTimeout(500);
    if (!await shown()) fail('the Work here card is not on the Skill Building slide');
    const t = await page.locator('#cm-sb-dock').innerText().catch(() => '');
    if (!/Open the CMS/.test(t)) fail(`the card has no 🗂 Open the CMS: "${t}"`);
    if (!/Drive/.test(t)) fail(`the card has no 📂 Drive link: "${t}"`);
    const small = await page.evaluate(() => [...document.querySelectorAll('#cm-sb-dock button, #cm-sb-dock a')].map(e => { const c = getComputedStyle(e); return [e.textContent.trim(), parseFloat(c.fontSize), Number(c.fontWeight)]; }).filter(x => x[1] < 16 || x[2] < 700));
    if (small.length) fail(`the card's buttons are under 16px bold: ${JSON.stringify(small)}`);

    // drag it by its handle
    const g = await page.locator('#cm-sb-dock .sbd-grip').boundingBox();
    await page.mouse.move(g.x + 10, g.y + 6); await page.mouse.down(); await page.mouse.move(200, 220, { steps: 6 }); await page.mouse.up();
    const at = await page.locator('#cm-sb-dock').boundingBox();
    if (Math.abs(at.x - 190) > 30 || Math.abs(at.y - 214) > 30) fail(`dragging the card didn't move it: ${JSON.stringify(at)}`);

    // a lesson slide: gone; back on the Skill Building: where it was put
    await go('d1m3-l2'); await page.waitForTimeout(400);
    if (await shown()) fail('the Work here card is on a lesson slide');
    await go('d1m3-a3'); await page.waitForTimeout(400);
    const again = await page.locator('#cm-sb-dock').boundingBox();
    if (!again || Math.abs(again.x - at.x) > 2 || Math.abs(again.y - at.y) > 2) fail(`the card didn't stay where it was put: ${JSON.stringify(again)} vs ${JSON.stringify(at)}`);

    // fold and unfold
    await page.click('#cm-sb-dock .sbd-x');
    if (!/CMS · 📂 Drive/.test(await page.locator('#cm-sb-dock').innerText())) fail('– should fold the card to a pill');
    await page.click('#cm-sb-dock .sbd-pill');
    if (!await page.locator('#cm-sb-dock .sbd-cms').count()) fail('the pill should bring the card back');

    // Open the CMS: beside the slide
    await page.click('#cm-sb-dock .sbd-cms'); await page.waitForTimeout(400);
    if (!await page.evaluate(() => { const f = document.getElementById('cm-toolframe'); return !!f && !f.hidden; })) fail('🗂 Open the CMS did not open the CMS frame');

    await browser.close();
    if (failures.length) { console.log('✗ Work here card:\n  ' + failures.join('\n  ')); process.exit(1); }
    console.log('Work here card: on every Skill Building slide with the CMS and the Drive, off the lessons, movable, foldable, and Open the CMS opens it beside the slide.');
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
