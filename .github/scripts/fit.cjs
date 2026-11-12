// @check browser — Every slide fits on one screen (laptop and large screen, every page of every day)
// Every slide fits on one screen: on the lesson page, the slide and its Previous / Next bar end inside the
// window (no scrolling), nothing inside the slide frame is cut off or scrolls, and no slide is split onto a
// second page (a long one is scaled to fit) — every slide of every day, on a laptop and on a large screen. On a desktop the slide takes the page's width with
// ⛶ Full screen in its Previous / Next bar; on a narrower window (under 1000px) the controls stay above it, and the slide still never scrolls inside
// (the page itself may: the site's top bar alone wraps to three rows there).
// Usage: node .github/scripts/fit.cjs [baseUrl] [days]   (with .github/scripts/server.mjs running; needs `npm i playwright`;
//        days: e.g. 1,4,7 — default every day)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');   // the name + batch form is gone: trainees arrive from the Portal
const BASE = process.argv[2] || 'http://localhost:8787/';
const ONLY = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const SIZES = [[1366, 768], [1920, 1080]];
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const failures = [], fail = (m) => failures.push(m), summary = [];
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    for (const [W, H] of SIZES) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        page.on('pageerror', e => fail(`${W}x${H} page error: ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
        await signIn(page, 'Fit', 'Screen', 'B100926');
        const r = await page.evaluate(async (only) => {
            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            const out = [], counts = { slides: 0, pages: 0, shrunk: 0, pv: 0 };
            state.isAdmin = true;   // every day open, as the trainer sees it
            { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }   // a trainee's 🔔 open-your-tools prompt (signed in as one first)
            const loaded = async () => {   // pictures in the slide have loaded, and the slide was laid out again
                const imgs = [...document.querySelectorAll('#lessonSlideWrap img')].filter(i => !i.complete);
                if (imgs.length) { await Promise.all(imgs.map(i => new Promise(res => { i.addEventListener('load', res, { once: true }); i.addEventListener('error', res, { once: true }); setTimeout(res, 3000); }))); await sleep(260); }
            };
            for (const d of DAYS) {
                if (only && !only.includes(d.id)) continue;
                goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = 0; render(); await sleep(60);
                const slides = buildDaySlides(d);
                for (let i = 0; i < slides.length; i++) {
                    state.lessonSlide = i; state.slidePage = 0; render(); await sleep(8); await loaded();
                    window.scrollTo(0, 0); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
                    const n = state.slidePages || 1; counts.slides++;
                    if (n > 1) out.push(`Day ${d.id} slide ${i + 1} (${slides[i].type}): split onto ${n} pages (a slide is scaled to fit one screen)`);
                    for (let p = 0; p < n; p++) {
                        if (p) { showSlidePage(p); await sleep(5); }
                        counts.pages++;
                        const wrap = document.getElementById('lessonSlideWrap'), stage = document.getElementById('lessonStage');
                        const where = `Day ${d.id} slide ${i + 1} (${slides[i].type})${n > 1 ? ` page ${p + 1}/${n}` : ''}`;
                        if (!wrap || !stage) { out.push(`${where}: no slide drawn`); continue; }
                        const bottom = stage.getBoundingClientRect().bottom + window.scrollY;
                        if (bottom > innerHeight + 1) out.push(`${where}: the slide and its Previous / Next bar end ${Math.round(bottom - innerHeight)}px below the screen`);
                        const over = wrap.scrollHeight - wrap.clientHeight;
                        if (over > 2) out.push(`${where}: ${over}px of the slide is cut off (it scrolls inside the frame)`);
                        if ([...wrap.children].some(c => c.style.zoom && Number(c.style.zoom) < 1)) counts.shrunk++;
                        // the trainer's 🖥 Presenter view (the speaker notes beside the slide) is in the footer card of every slide: shown, on screen, not covered
                        if (!p) {
                            const pv = stage.querySelector('.slide-nav .nav-pv'), rb = pv && pv.getBoundingClientRect();
                            const top = rb && document.elementFromPoint(rb.left + rb.width / 2, rb.top + rb.height / 2);
                            if (!pv) out.push(`${where}: no 🖥 Presenter view in the footer card`);
                            else if (!rb.width || rb.bottom > innerHeight + 1 || rb.right > innerWidth + 1) out.push(`${where}: 🖥 Presenter view isn't on the screen`);
                            else if (top !== pv && !pv.contains(top)) out.push(`${where}: 🖥 Presenter view is covered by ${top ? top.className || top.tagName : 'nothing'}`);
                            else counts.pv++;
                        }
                    }
                }
                // a desktop: the slide takes the page's width (no column beside it), ⛶ Full screen in its Previous / Next bar
                const stage = document.getElementById('lessonStage'), main = document.querySelector('main');
                if (stage && main && innerWidth >= 1000) {
                    const free = main.clientWidth - (parseFloat(getComputedStyle(main).paddingLeft) || 0) - (parseFloat(getComputedStyle(main).paddingRight) || 0);
                    if (stage.getBoundingClientRect().width < free - 4) out.push(`Day ${d.id}: the slide doesn't take the page's width (${Math.round(stage.getBoundingClientRect().width)} of ${Math.round(free)}px)`);
                    if (!stage.querySelector('.slide-nav .nav-fs')) out.push(`Day ${d.id}: no ⛶ Full screen in the Previous / Next bar`);
                }
            }
            return { out, counts };
        }, ONLY);
        r.out.forEach(m => fail(`${W}x${H} ${m}`));
        summary.push(`${W}x${H}: ${r.counts.slides} slides, ${r.counts.pages} pages, ${r.counts.shrunk} scaled down, 🖥 Presenter view on ${r.counts.pv}`);
        await page.close();
    }
    // a narrower window keeps the controls above the slide, and nothing in the slide is cut off
    const page = await browser.newPage({ viewport: { width: 900, height: 800 } });
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await signIn(page, 'Fit', 'Narrow', 'B100926');
    const narrow = await page.evaluate(async (day) => {
        state.isAdmin = true; goto('day', day || DAYS[0].id); state.dayViewMode = 'slides'; state.lessonSlide = 1; render();
        await new Promise(r => setTimeout(r, 300)); window.scrollTo(0, 0);
        const top = document.querySelector('.ls-top').getBoundingClientRect(), stage = document.getElementById('lessonStage').getBoundingClientRect();
        const wrap = document.getElementById('lessonSlideWrap');
        return { above: top.bottom <= stage.top + 1, over: wrap.scrollHeight - wrap.clientHeight };
    }, ONLY ? ONLY[0] : 0);   // 0: the course's first day
    if (!narrow.above) fail('900x800: the lesson controls should stay above the slide on a narrower window');
    if (narrow.over > 2) fail(`900x800: ${narrow.over}px of the slide is cut off (it scrolls inside the frame)`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.slice(0, 60).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Every slide fits on one screen. ${summary.join('; ')}.`);
})().catch(e => { console.error(e); process.exit(1); });
