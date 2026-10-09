// Every page fits one screen (js/lsh-one-screen.js): on a laptop and on a large screen the window itself
// never scrolls — the top bar and the footer line keep their place and the page's body takes the height
// between them. A page with more in it than fits (Case Documents, the Practice Lab, the Training Tools, a
// handout, the Facilitator Guide) scrolls inside that body, so the bottom of its content is still
// reachable. A lesson page doesn't scroll at all: the slide is sized to the room left (fitSlideFrame in
// js/cm-updates.js, checked slide by slide in fit.cjs). The page's own window.scrollTo() and window.scrollY
// — used to send a page back to the top and to keep an admin table's place across a redraw — work on the
// page body. On a window too small for the layout (under 1001 x 480: a phone, a tiny window) the page
// scrolls as it always did, and this check only makes sure nothing is cut off.
// Usage: node .github/scripts/one-screen.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs `npm i playwright`)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
const SIZES = [[1366, 768], [1920, 1080], [1280, 720], [900, 800]];
const PAGES = ['dashboard', 'practice', 'tasks', 'handouts', 'notes', 'clientprofile', 'crisisroleplay',
    'casedocs', 'tools', 'calls', 'activities', 'facilitatorguide', 'orientation', 'admin'];
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const failures = [], fail = (m) => failures.push(m), summary = [];
    for (const [W, H] of SIZES) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        page.on('pageerror', e => fail(`${W}x${H} page error: ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
        await page.fill('#loginFirstInput', 'One'); await page.fill('#loginLastInput', 'Screen'); await page.fill('#loginBatchInput', 'B100926');
        await page.click('#loginSubmitBtn'); await sleep(1200);
        const r = await page.evaluate(async (views) => {
            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            const out = [], counts = { pages: 0, scrolling: 0 };
            state.isAdmin = true;   // every page and every day open, as the trainer sees them
            const one = document.body.classList.contains('one-screen');
            const body = () => document.querySelector('#app > main');
            const check = async (where, isLesson) => {
                counts.pages++;
                const m = body(), de = document.documentElement;
                if (!m) { out.push(`${where}: no page drawn`); return; }
                const inner = m.scrollHeight - m.clientHeight;
                if (one) {
                    const over = de.scrollHeight - innerHeight;
                    if (over > 2) out.push(`${where}: the page is ${over}px taller than the screen (the window scrolls)`);
                    const foot = document.querySelector('.footer-note');
                    if (foot && foot.getBoundingClientRect().bottom > innerHeight + 1) out.push(`${where}: the footer line is off the screen`);
                    if (isLesson && inner > 2) out.push(`${where}: ${inner}px of the lesson page is off the page body (it should fit without scrolling)`);
                    if (inner > 2) {
                        counts.scrolling++;
                        m.scrollTop = 1e7; await sleep(0);
                        if (m.scrollHeight - m.clientHeight - m.scrollTop > 2) out.push(`${where}: the bottom of the page can't be reached`);
                        if (window.scrollY !== m.scrollTop) out.push(`${where}: window.scrollY reads ${window.scrollY}, the page body is at ${m.scrollTop}`);
                        window.scrollTo({ top: 0 }); await sleep(0);
                        if (m.scrollTop !== 0) out.push(`${where}: window.scrollTo({top:0}) left the page at ${m.scrollTop}`);
                    }
                } else if (m.clientHeight < m.scrollHeight - 2 && getComputedStyle(m).overflowY !== 'visible') {
                    out.push(`${where}: the page body is cut off on a window too small for the one-screen layout`);
                }
            };
            for (const v of views) {
                try { goto(v); } catch (e) { state.view = v; render(); }
                await sleep(260);
                await check(`page ${v}`, false);
            }
            // a lesson page: the slide and its Previous / Next bar, with nothing to scroll
            for (const d of DAYS) {
                goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = 1; state.slidePage = 0; render();
                await sleep(320);
                await check(`day ${d.id}`, true);
            }
            return { out, counts, one };
        }, PAGES);
        r.out.forEach(m => fail(`${W}x${H} ${m}`));
        summary.push(`${W}x${H}: ${r.counts.pages} pages${r.one ? `, ${r.counts.scrolling} scrolling inside` : ' (page scroll kept)'}`);
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.slice(0, 60).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Every page fits one screen. ${summary.join('; ')}.`);
})().catch(e => { console.error(e); process.exit(1); });
