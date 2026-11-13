// @check browser — No slide hides or scrolls any of its text (laptop and large screen, every slide of every day)
// fit.cjs measures the slide frame. This looks inside it: a table or card whose box hides what doesn't fit (overflow
// hidden) can cut its last rows off with the frame itself still the right height ("John Doe's file at a glance" lost its
// Critical fact row that way at 1366x768). Every piece of text on every slide of every day must be inside every box it
// sits in, and no box inside a slide may scroll: one screen, nothing cut off, no scrolling.
// Usage: node .github/scripts/slide-clip.cjs [baseUrl] [days]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const ONLY = process.argv[3] ? process.argv[3].split(',').map(Number) : null;
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const summary = [];
    for (const [W, H] of [[1366, 768], [1920, 1080]]) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        page.on('pageerror', e => fail(`${W}x${H} page error: ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        await signIn(page, 'Clip', 'Screen', 'B100926');
        const r = await page.evaluate(async (only) => {
            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            const out = []; let slides = 0;
            state.isAdmin = true; { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }
            const shown = (el) => { for (let x = el; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x); if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || x.getAttribute('aria-hidden') === 'true' || x.hidden) return false; if (x.tagName === 'DETAILS' && !x.open && x !== el) return false; } return true; };
            const name = (el) => (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 2).join('.') : el.tagName.toLowerCase());
            const check = (where) => {
                const wrap = document.getElementById('lessonSlideWrap'); if (!wrap) return;
                const seen = new Set();
                // a box inside the slide that scrolls
                for (const el of wrap.querySelectorAll('*')) {
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
            for (const d of DAYS) {
                if (only && !only.includes(d.id)) continue;
                goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = 0; render(); await sleep(60);
                const ss = buildDaySlides(d);
                for (let i = 0; i < ss.length; i++) {
                    state.lessonSlide = i; state.slidePage = 0; render(); await sleep(30);
                    await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))); await sleep(350);   // the rows' entrance animation
                    slides++;
                    const n = state.slidePages || 1;
                    for (let p = 0; p < n; p++) { if (p) { showSlidePage(p); await sleep(300); } check(`Day ${d.id} slide ${i + 1} (${ss[i].type})${n > 1 ? ` page ${p + 1}` : ''}`); }
                }
            }
            return { out, slides };
        }, ONLY);
        r.out.forEach(m => fail(`${W}x${H} ${m}`));
        summary.push(`${W}x${H}: ${r.slides} slides`);
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`No slide hides or scrolls its text: ${summary.join('; ')}.`);
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
