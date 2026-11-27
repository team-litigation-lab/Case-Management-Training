// @check browser — 💡 Tips (once 📖 Additional Reference) opens in a panel over the slide (an activity's: in the 🧪 Practice Lab), in the same window, scrolls inside, carries its hints, and ✕ or Esc goes back
// 📖 Additional Reference (js/cm-case-flow.js cmCaseFlow.full): the block's full text, embedded in the deck: a panel over
// the slide it was opened from, by 📖 Reference in the block's title band. Checked at 1366×768 on a lesson's slide and on an
// activity's Your Task in the 🧪 Practice Lab (js/cm-task-lab.js: the deck's card, ▶ Start): no tab or window opens; the panel
// sits inside the slide (a lesson's: inside the screen too; the lab page may scroll) or the lab's Your Task card; its text
// scrolls inside it; it carries the 💡 Hints (js/cm-tips-button.js: the lesson's key points; an activity's tools too), not
// the full text; ✕ Back to the slide and Esc close it, and moving on (the next slide; ← Back from the lab) leaves no panel behind.
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
                // an activity's Your Task is in the 🧪 Practice Lab: the deck's card, then its ▶ Start
                if (kind === 'activity') { const go = document.querySelector('#lessonSlideWrap .ctl-card .ctl-go'); if (go) go.click(); await new Promise(r => setTimeout(r, 600)); }
                return { i, title: d.lessons[slides[i].lessonIndex].cf.block.title, lab: kind === 'activity' ? !!document.querySelector('.ctl-page #lessonSlideWrap') : true };
            }, kind);
            if (!at.lab) { fail(`${kind} (${at.title}): ▶ Start on the deck's card did not open the 🧪 Practice Lab`); continue; }
            await page.click('.cf-card .cfx-ref-open'); await page.waitForTimeout(500);
            const r = await page.evaluate(() => {
                const o = document.querySelector('.cfx-ref'); if (!o) return null;
                const card = document.querySelector('.cf-card'), b = o.querySelector('.cfx-ref-b'), ro = o.getBoundingClientRect(), rc = card.getBoundingClientRect();
                return { inCard: card.contains(o), inside: ro.top >= rc.top - 1 && ro.bottom <= rc.bottom + 1 && (!!o.closest('.ctl-page') || ro.bottom <= innerHeight + 1),
                    scrolls: b.scrollHeight > b.clientHeight ? getComputedStyle(b).overflowY : 'fits', pageScroll: document.scrollingElement.scrollHeight > innerHeight + 2,
                    text: b.textContent.length, hints: !!b.querySelector('.cfx-tips-hints li'), tools: !!b.querySelector('.cfx-ref-tools'), head: o.querySelector('.cfx-ref-h').textContent, btn: (document.querySelector('.cf-card .cfx-ref-open') || {}).textContent || '' };
            });
            const where = `${kind} (${at.title})`;
            if (!r) { fail(`${where}: 💡 Tips opened no panel`); continue; }
            if (!r.inCard || !r.inside) fail(`${where}: the panel isn't over the slide, inside the screen: ${JSON.stringify(r)}`);
            if (r.scrolls !== 'fits' && r.scrolls !== 'auto' && r.scrolls !== 'scroll') fail(`${where}: the reference runs past the panel without scrolling inside it: ${JSON.stringify(r)}`);
            if (!/💡 Tips/.test(r.head) || !/💡 Tips/.test(r.btn) || !r.hints || (kind === 'activity' && !r.tools) || r.text < 80) fail(`${where}: the 💡 Tips panel should carry the slide's hints${kind === 'activity' ? ' and the task\'s tools' : ''}, under 💡 Tips: ${JSON.stringify(r)}`);
            if (kind === 'lesson') { await page.click('.cfx-ref-x'); }
            else { await page.keyboard.press('Escape'); }
            await page.waitForTimeout(300);
            if (await page.$('.cfx-ref')) fail(`${where}: ${kind === 'lesson' ? '✕ Back to the slide' : 'Esc'} didn't close the panel`);
            // open again, then move on (the next slide; from the lab, ← Back to the slide): no panel is left behind
            await page.click('.cf-card .cfx-ref-open'); await page.waitForTimeout(300);
            if (kind === 'activity') { await page.click('.ctl-page .ctl-back'); await page.waitForTimeout(600); }
            else await page.evaluate(async (i) => { goToSlide(i + 1); await new Promise(r => setTimeout(r, 600)); }, at.i);
            if (await page.$('.cfx-ref')) fail(`${where}: ${kind === 'activity' ? '← Back from the lab' : 'moving to the next slide'} left the panel open`);
        }
        if (tabs) fail(`📖 Additional Reference opened ${tabs} new tab(s)/window(s): it should stay in the deck`);
    } catch (e) { fail(`the check stopped: ${e.message}`); }
    await browser.close();
    if (failures.length) { console.error('💡 Tips check FAILED:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log('💡 Tips opens over the slide in the same window (a lesson, and an activity in the 🧪 Practice Lab), scrolls inside, carries its hints (and an activity\'s tools), and closes with ✕, Esc, the next slide or ← Back.');
})();
