// @check browser — 📖 Additional Reference opens in a panel over the slide, in the same window (no new tab), scrolls inside, and ✕ or Esc goes back
// 📖 Additional Reference (js/cm-case-flow.js cmCaseFlow.full): the block's full text, embedded in the deck: a panel over
// the slide it was opened from, by 📖 Reference in the block's title band. Checked on a lesson and an activity at 1366×768: no tab or window opens; the panel
// sits inside the slide and inside the screen; its text scrolls inside it (the page never scrolls); it carries the
// block's full text; ✕ Back to the slide and Esc close it, and moving to the next slide leaves no panel behind.
// Usage: node .github/scripts/reference-panel.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage(); let tabs = 0;
    ctx.on('page', () => { tabs++; });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    try {
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        await signIn(page, 'Rita', 'Reference', 'B100926');
        await page.addStyleTag({ content: '#ktLogin{display:none !important;}' });
        await page.evaluate(() => { state.isAdmin = true; goto('day', 11); }); await page.waitForTimeout(600);
        for (const kind of ['lesson', 'activity']) {
            const at = await page.evaluate(async (kind) => {
                const d = DAYS.find(x => x.id === 11), slides = buildDaySlides(d);
                const i = slides.findIndex(sl => sl.type === 'topic' && d.lessons[sl.lessonIndex].cf.block.kind === kind);
                state.dayViewMode = 'slides'; goToSlide(i); await new Promise(r => setTimeout(r, 700));
                return { i, title: d.lessons[slides[i].lessonIndex].cf.block.title };
            }, kind);
            await page.click('.cf-card .cfx-ref-open'); await page.waitForTimeout(500);
            const r = await page.evaluate(() => {
                const o = document.querySelector('.cfx-ref'); if (!o) return null;
                const card = document.querySelector('.cf-card'), b = o.querySelector('.cfx-ref-b'), ro = o.getBoundingClientRect(), rc = card.getBoundingClientRect();
                return { inCard: card.contains(o), inside: ro.top >= rc.top - 1 && ro.bottom <= rc.bottom + 1 && ro.bottom <= innerHeight + 1,
                    scrolls: b.scrollHeight > b.clientHeight ? getComputedStyle(b).overflowY : 'fits', pageScroll: document.scrollingElement.scrollHeight > innerHeight + 2,
                    text: b.textContent.length, head: o.querySelector('.cfx-ref-h').textContent };
            });
            const where = `${kind} (${at.title})`;
            if (!r) { fail(`${where}: 📖 Additional Reference opened no panel`); continue; }
            if (!r.inCard || !r.inside) fail(`${where}: the panel isn't over the slide, inside the screen: ${JSON.stringify(r)}`);
            if (r.scrolls !== 'fits' && r.scrolls !== 'auto' && r.scrolls !== 'scroll') fail(`${where}: the reference runs past the panel without scrolling inside it: ${JSON.stringify(r)}`);
            if (r.text < 300 || !/Additional Reference/.test(r.head)) fail(`${where}: the panel doesn't carry the block's full text: ${JSON.stringify(r)}`);
            if (kind === 'lesson') { await page.click('.cfx-ref-x'); }
            else { await page.keyboard.press('Escape'); }
            await page.waitForTimeout(300);
            if (await page.$('.cfx-ref')) fail(`${where}: ${kind === 'lesson' ? '✕ Back to the slide' : 'Esc'} didn't close the panel`);
            // open again, then move on: no panel is left on the next slide
            await page.click('.cf-card .cfx-ref-open'); await page.waitForTimeout(300);
            await page.evaluate(async (i) => { goToSlide(i + 1); await new Promise(r => setTimeout(r, 600)); }, at.i);
            if (await page.$('.cfx-ref')) fail(`${where}: moving to the next slide left the panel open`);
        }
        if (tabs) fail(`📖 Additional Reference opened ${tabs} new tab(s)/window(s): it should stay in the deck`);
    } catch (e) { fail(`the check stopped: ${e.message}`); }
    await browser.close();
    if (failures.length) { console.error('📖 Additional Reference check FAILED:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log('📖 Additional Reference opens over the slide in the same window (a lesson and an activity), scrolls inside, carries the full text, and closes with ✕, Esc or the next slide.');
})();
