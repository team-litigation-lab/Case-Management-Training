// @check browser — 🎬 Video Presentation: a trainee plays any part at any time (⏪ 10s / 10s ⏩, ← / →, the Slide picker) and, going back to the video, it opens where they left off, never from the start
// The owner: "allow playing any part of the video at any time the trainees scroll or go back to it so they need not restart
// the video over again". This opens Case Flow Day 1's narrated video, jumps to a slide with the header's Slide picker, goes
// back 10 s with ⏪ and 10 s more with the ← key, closes the viewer and opens it again: the video must be at that place,
// saying "Resumed at". The header (Slide, ⏪, ⏩, Speed, CC, Full screen) must fit a laptop screen.
// CI's open-source Chromium can't decode H.264 (CLAUDE.md): there the video's time is still moved and kept, which is what this
// checks; where the browser can play it, the time must also be right after metadata loads.
// Usage: node .github/scripts/video-place.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs `npm i playwright`)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    const failures = [], fail = (m) => failures.push(m);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await signIn(page, 'Videoplace', 'Test', 'B100926');
    await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); state.isAdmin = true; render(); });
    await sleep(400);
    const open = async () => { await page.evaluate(() => cmDayVideo.open(DAYS[0].id)); await page.waitForFunction(() => !!document.querySelector('#cm-dv video'), null, { timeout: 8000 }).catch(() => fail('the viewer did not open')); await sleep(1500); };
    const now = () => page.evaluate(() => { const v = document.querySelector('#cm-dv video'); return v ? Math.round(v.currentTime) : -1; });

    await open();
    // the header fits a laptop, with ⏪ 10s and 10s ⏩ in it
    const head = await page.evaluate(() => { const h = document.querySelector('.cm-dv-head'), sk = [...document.querySelectorAll('.cm-dv-skip')].map(b => b.textContent.trim());
        return { fits: h.scrollWidth <= h.clientWidth + 1, skip: sk, right: Math.max(...[...h.children].map(c => c.getBoundingClientRect().right)), w: innerWidth }; });
    if (head.skip.length !== 2 || !/⏪/.test(head.skip[0]) || !/⏩/.test(head.skip[1])) fail(`the header should have ⏪ 10s and 10s ⏩: ${JSON.stringify(head.skip)}`);
    if (!head.fits || head.right > head.w) fail(`the viewer's header doesn't fit 1366×768: ${JSON.stringify(head)}`);

    // jump to slide 17 with the Slide picker, then ⏪ 10s, then the ← key
    await page.evaluate(() => { const p = document.querySelector('.cm-dv-slide'); p.value = '16'; p.dispatchEvent(new Event('change', { bubbles: true })); return null; });
    await sleep(600);
    const atSlide = await now();
    if (atSlide < 60) fail(`the Slide picker didn't move the video to slide 17 (it is at ${atSlide}s)`);
    await page.click('.cm-dv-skip >> nth=0'); await sleep(400);
    const back1 = await now();
    if (Math.abs(back1 - (atSlide - 10)) > 1) fail(`⏪ 10s should go back 10 seconds: ${atSlide}s → ${back1}s`);
    await page.evaluate(() => { if (document.activeElement) document.activeElement.blur(); });
    await page.keyboard.press('ArrowLeft'); await sleep(400);
    const back2 = await now();
    if (Math.abs(back2 - (back1 - 10)) > 1) fail(`the ← key should go back 10 seconds: ${back1}s → ${back2}s`);
    await page.click('.cm-dv-skip >> nth=1'); await sleep(400);
    const fwd = await now();
    if (Math.abs(fwd - (back2 + 10)) > 1) fail(`10s ⏩ should go forward 10 seconds: ${back2}s → ${fwd}s`);
    // the place is on this device straight away (before any 5-second save)
    const kept = await page.evaluate(() => { try { return (JSON.parse(localStorage.getItem('lsh_day-video') || '{}').pos || {})[DAYS[0].id]; } catch (e) { return null; } });
    if (Math.abs((kept || 0) - fwd) > 1) fail(`the place should be kept as soon as the trainee moves (${fwd}s), not at the next save: ${kept}`);

    // close, go back to it: it opens there, not at the start
    await page.keyboard.press('Escape'); await sleep(400);
    if (await page.$('#cm-dv')) fail("Esc didn't close the viewer");
    await open();
    const again = await now(), note = await page.evaluate(() => { const n = document.querySelector('.cm-dv-resume'); return n && !n.hidden ? n.innerText : ''; });
    if (Math.abs(again - fwd) > 1) fail(`going back to the video should open where the trainee left off (${fwd}s), not at ${again}s`);
    if (!/Resumed at/.test(note)) fail(`reopened, the viewer should say "Resumed at …": "${note}"`);
    await page.evaluate(() => cmDayVideo.close());
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`🎬 Any part, any time: the Slide picker jumped to ${atSlide}s, ⏪ 10s and ← went back to ${back2}s, 10s ⏩ to ${fwd}s; closed and opened again, the video was at ${again}s ("Resumed at"). The header fits 1366×768.`);
})().catch(e => { console.error(e); process.exit(1); });
