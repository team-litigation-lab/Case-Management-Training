// @check browser — 🎬 Case Flow Day 2's Video Presentation (🔒 until a trainer unlocks it in 🎬 Unlock Videos; then it plays with captions and a chapter per slide)
// The Day 2 deck's narrated video (build/videoslide/day2.json → js/cm-deck-slides.js, js/cm-day-video.js):
// 1. Case Flow Day 2's card shows 🔒 Video to a trainee; Admin → 🔓 Open Lessons → 🎬 Unlock Videos has a Day 2 tile;
// 2. ticking it saves settings:openvideos, and the trainee's card becomes ▶ Video within the once-a-minute check;
// 3. the viewer plays decks/day2/day2-narrated.mp4 with its captions, one chapter per slide in the video (the Skill
//    Building pages are not in it), and a chapter seeks to its slide.
// Usage: node .github/scripts/day2-video.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const DAY = 12;   // Case Flow Day 2
const spec = JSON.parse(fs.readFileSync(path.join(__dirname, '../../build/videoslide/day2.json'), 'utf8'));

(async () => {
    if (spec.day !== DAY || !spec.video) fail(`build/videoslide/day2.json should name day ${DAY} and its video`);
    const inVideo = spec.slides.length;
    if (spec.slides.some(s => /^Skill Building/i.test(s.title))) fail('a Skill Building page is in the Day 2 video');
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.addInitScript(() => { window.EAPA_POLL = { approval: 3000 }; });   // the trainee's once-a-minute check, sped up
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const btn = () => page.evaluate((id) => { const x = document.querySelector(`#module-${id} .cm-dv-btn`); return x ? x.textContent.trim() : ''; }, DAY);
    try {
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
        await signIn(page, 'Vida', 'Two' + tag, 'B100926');
        const tid = await page.evaluate(async () => {
            const k = 'trainee:' + state.traineeId, r = await sharedGet(k); r.approved = true;
            await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: k, value: JSON.stringify(r) }) });
            const o = document.getElementById('ktLogin'); if (o) o.remove(); goto('dashboard'); return state.traineeId;
        });
        await page.addStyleTag({ content: '#ktLogin{display:none !important;}' });
        await page.waitForTimeout(1200);
        if (!/🔒 Video/.test(await btn())) fail(`a trainee should see 🔒 Video on Case Flow Day 2 before it is unlocked: "${await btn()}"`);

        // the trainer ticks Case Flow Day 2 in 🎬 Unlock Videos (all batches)
        await page.evaluate(() => { state.isAdmin = true; state.adminPreview = false; state.cmOpenVideos = null; state.adminData = null; cmOpenLessons.go(); });
        await page.waitForTimeout(1500);
        const ticked = await page.evaluate(() => { const t = [...document.querySelectorAll('.cm-dv-admin .cm-dv-day')].find(x => /Case Flow Day 2/.test(x.innerText));
            if (!t) return false; const i = t.querySelector('input'); if (!i.checked) i.click(); return true; });
        if (!ticked) fail('🎬 Unlock Videos has no Case Flow Day 2 tile');
        await page.waitForTimeout(1200);
        const saved = await page.evaluate(() => sharedGet('settings:openvideos'));
        if (!saved || !(saved.all || []).includes(12)) fail(`ticking Case Flow Day 2 should save it in settings:openvideos: ${JSON.stringify(saved)}`);

        await page.evaluate(async (tid) => { state.isAdmin = false; state.adminPreview = false; state.traineeId = tid; state.adminTab = null; state.cmOpenVideos = null; await syncToLedger(); goto('dashboard'); }, tid);
        await page.waitForTimeout(5000); await page.evaluate(() => render()); await page.waitForTimeout(500);
        if (!/▶ Video/.test(await btn())) fail(`once unlocked, the trainee's Case Flow Day 2 card should show ▶ Video: "${await btn()}"`);
        else {
            await page.click(`#module-${DAY} .cm-dv-btn`); await page.waitForTimeout(2500);
            const v = await page.evaluate(async () => {
                const v = document.querySelector('video'); if (!v) return null;
                const ch = [...document.querySelectorAll('.cm-dv-chapters button')]; if (ch[5]) ch[5].click();
                await new Promise(r => setTimeout(r, 1200));
                return { h264: !!v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'), src: v.currentSrc || v.getAttribute('src') || (v.querySelector('source') || {}).src || '', ready: v.readyState, dur: v.duration, t: v.currentTime, tracks: v.textTracks.length, cc: !!document.querySelector('#cm-dv .cm-dv-cc') && (v.textTracks[0] || {}).mode === 'hidden', chapters: ch.length };
            });
            if (!v) fail('▶ Video should open the viewer with the video');
            else {
                if (!/\/decks\/day2\/day2-narrated\.mp4$/.test(v.src)) fail(`the viewer should play decks/day2/day2-narrated.mp4: ${v.src}`);
                if (v.h264 && (v.ready < 1 || !(v.dur > 60))) fail(`the Day 2 video doesn't load: readyState ${v.ready}, duration ${v.dur}`);   // CI's Chromium has no H.264: playback is checked only where the browser can play it (CLAUDE.md)
                if (!v.tracks) fail('the Day 2 video has no captions track');
                else if (!v.cc) fail('the Day 2 captions should be in the strip under the video (the track hidden), as on Day 1');
                if (v.chapters !== inVideo) fail(`the viewer should list ${inVideo} slides as chapters: ${v.chapters}`);
                if (Math.abs(v.t - spec.video.starts[5]) > 3) fail(`the 6th chapter should seek to ${spec.video.starts[5]}s: ${v.t}`);
            }
        }
        // leave the store as found: the trainer locks Day 2's video again (other checks share this server)
        await page.evaluate(() => { const o = document.querySelector('.cm-dv-overlay, .overlay'); if (o) o.remove(); state.isAdmin = true; state.adminPreview = false; state.cmOpenVideos = null; cmOpenLessons.go(); });
        await page.waitForTimeout(1500);
        await page.evaluate(() => { const t = [...document.querySelectorAll('.cm-dv-admin .cm-dv-day')].find(x => /Case Flow Day 2/.test(x.innerText)); const i = t && t.querySelector('input'); if (i && i.checked) i.click(); });
        await page.waitForTimeout(1200);
        const after = await page.evaluate(() => sharedGet('settings:openvideos'));
        if (after && (after.all || []).includes(12)) fail(`locking Case Flow Day 2 again should take it out of settings:openvideos: ${JSON.stringify(after)}`);
    } finally { await browser.close(); }
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`🎬 Case Flow Day 2's video: 🔒 until a trainer ticks it in 🎬 Unlock Videos, then ▶ Video plays decks/day2/day2-narrated.mp4 with captions and ${inVideo} chapters (no Skill Building pages).`);
    console.log('All good.');
})().catch(e => { console.error(e); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); });
