// @check browser — Every slide fits on one screen and no slide hides or scrolls any of its text (laptop and large screen, every page of every day)
// Every slide fits on one screen: on the lesson page, the slide and its Previous / Next bar end inside the
// window (no scrolling), nothing inside the slide frame is cut off or scrolls, and no slide is split onto a
// second page (a long one is scaled to fit) — every slide of every day, on a laptop and on a large screen. On a desktop the slide takes the page's width with
// ⛶ Full screen in its Previous / Next bar; on a narrower window (under 1000px) the controls stay above it, and the slide still never scrolls inside
// (the page itself may: the site's top bar alone wraps to three rows there).
// It also looks inside the frame (was slide-clip.cjs): every piece of text on a slide is inside every box it sits in, and no
// box inside a slide scrolls (a text box the trainee types in may, past its cap). Animations are switched off for the walk, so nothing has to wait for a row to slide in.
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
            { const st = document.createElement('style'); st.textContent = '*,*::before,*::after{animation:none !important;transition:none !important;}'; document.head.appendChild(st); }   // no entrance animation to wait for
            const shown = (el) => { for (let x = el; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || x.getAttribute('aria-hidden') === 'true' || x.hidden) return false; if (x.tagName === 'DETAILS' && !x.open && x !== el) return false; } return true; };
            const name = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : el.tagName.toLowerCase());
            const clipCheck = (where) => {
                const wrap = document.getElementById('lessonSlideWrap'); if (!wrap) return;
                const seen = new Set();
                // a box inside the slide that scrolls
                for (const el of wrap.querySelectorAll('*')) {
                    // (a box the trainee types in, such as the AI Grader's, scrolls past its cap like any text box, so
                    // a long prefill never pushes Submit off the slide: it is the trainee's own text, not the slide's)
                    if (el.tagName === 'TEXTAREA') continue;
                    const cs = getComputedStyle(el);
                    if (/(auto|scroll)/.test(cs.overflowY) && el.scrollHeight - el.clientHeight > 3 && el.clientHeight > 0 && shown(el)) {
                        const k = 'scroll' + name(el); if (!seen.has(k)) { seen.add(k); out.push(`${where}: ${name(el)} scrolls (${el.scrollHeight - el.clientHeight}px more than it shows)`); }
                    }
                }
                // text cut off by a box it sits in
                const walker = document.createTreeWalker(wrap, NodeFilter.SHOW_TEXT, { acceptNode: (n) => n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT });
                for (let n; (n = walker.nextNode());) {
                    const el = n.parentElement; if (!el || !shown(el)) continue;
                    const rg = document.createRange(); rg.selectNodeContents(n); let rr = rg.getBoundingClientRect(); if (!rr.width || !rr.height) continue;
                    // a caption held to two lines with an ellipsis hides its own tail on purpose: measure what it shows
                    if (/(hidden|clip)/.test(getComputedStyle(el).overflowY)) { const e = el.getBoundingClientRect(); rr = { top: Math.max(rr.top, e.top), bottom: Math.min(rr.bottom, e.bottom) }; }
                    for (let x = el.parentElement; x && x !== wrap.parentElement; x = x.parentElement) {
                        const cs = getComputedStyle(x); if (!/(hidden|clip|auto|scroll)/.test(cs.overflowY + cs.overflowX)) continue;
                        const b = x.getBoundingClientRect();
                        if (rr.bottom > b.bottom + 3 || rr.top < b.top - 3) {
                            const k = 'clip' + name(x) + n.textContent.trim().slice(0, 30);
                            if (!seen.has(k)) { seen.add(k); out.push(`${where}: "${n.textContent.trim().slice(0, 50)}" is cut off by ${name(x)} (${Math.round(Math.max(rr.bottom - b.bottom, b.top - rr.top))}px)`); }
                            break;
                        }
                    }
                }
            };
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
                        clipCheck(where);
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
