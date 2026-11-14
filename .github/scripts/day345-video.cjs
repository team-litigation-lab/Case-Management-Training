// @check browser — 🎬 Case Flow Days 3, 4 and 5's Video Presentations (🔒 until a trainer unlocks each in 🎬 Unlock Videos; then it plays with captions and a chapter per slide)
// The Day 3, 4 and 5 decks' narrated videos (build/videoslide/day3.json, day4.json, day5.json → js/cm-deck-slides.js, js/cm-day-video.js):
// 1. the files: each video and its captions are in the repository, under the site's 25 MB limit, one start time per slide,
//    no Skill Building page, and the narration is about John Doe VS Robert Smith (not the decks' other sample cases);
// 2. each day's card shows 🔒 Video to a trainee; Admin → 🔓 Open Lessons → 🎬 Unlock Videos has a tile for it;
// 3. ticking it saves settings:openvideos, and the trainee's card becomes ▶ Video within the once-a-minute check;
// 4. the viewer plays decks/dayN/dayN-narrated.mp4 with its captions, one chapter per slide, and a chapter seeks to its slide.
// Usage: node .github/scripts/day345-video.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const fs = require('fs'); const path = require('path');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const ROOT = path.join(__dirname, '../..');
const DAYS = [3, 4, 5].map(n => ({ n, id: 10 + n, spec: JSON.parse(fs.readFileSync(path.join(ROOT, `build/videoslide/day${n}.json`), 'utf8')) }));

function fileChecks({ n, id, spec }) {
    if (spec.day !== id || !spec.video) fail(`build/videoslide/day${n}.json should name day ${id} and its video`);
    if (spec.slides.some(s => /Skill Building/i.test(s.title))) fail(`a Skill Building page is in the Day ${n} video`);
    if (spec.video.starts.length !== spec.slides.length) fail(`day${n}.json: video.starts has ${spec.video.starts.length} times for ${spec.slides.length} slides`);
    for (const f of [spec.video.src, spec.video.captions]) if (!fs.existsSync(path.join(ROOT, f))) fail(`${f} is missing`);
    const mp4 = path.join(ROOT, spec.video.src);
    if (fs.existsSync(mp4) && fs.statSync(mp4).size > 25 * 1024 * 1024) fail(`${spec.video.src} is over 25 MB: Cloudflare won't serve it as a static asset`);
    const text = spec.slides.map(s => s.notes).join(' ');
    if (!/John Doe versus Robert Smith/.test(text)) fail(`the Day ${n} narration should name the course's case, John Doe versus Robert Smith`);
    for (const other of [/\bApex\b/, /Jordan Davies/, /Mr\. Jones/]) if (other.test(text)) fail(`the Day ${n} narration mentions ${other.source}, a sample case that isn't the course's`);
}

(async () => {
    DAYS.forEach(fileChecks);
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.addInitScript(() => { window.EAPA_POLL = { approval: 3000 }; });   // the trainee's once-a-minute check, sped up
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const btn = (id) => page.evaluate((id) => { const x = document.querySelector(`#module-${id} .cm-dv-btn`); return x ? x.textContent.trim() : ''; }, id);
    const tile = (n, want) => page.evaluate(([n, want]) => {
        const t = [...document.querySelectorAll('.cm-dv-admin .cm-dv-day')].find(x => new RegExp(`Case Flow Day ${n}\\b`).test(x.innerText));
        if (!t) return false; const i = t.querySelector('input'); if (i.checked !== want) i.click(); return true; }, [n, want]);
    const asAdmin = () => page.evaluate(() => { const o = document.querySelector('.cm-dv-overlay, .overlay'); if (o) o.remove(); state.isAdmin = true; state.adminPreview = false; state.cmOpenVideos = null; state.adminData = null; cmOpenLessons.go(); });
    try {
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
        await signIn(page, 'Vida', 'Three' + tag, 'B100926');
        const tid = await page.evaluate(async () => {
            const k = 'trainee:' + state.traineeId, r = await sharedGet(k); r.approved = true;
            await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key: k, value: JSON.stringify(r) }) });
            const o = document.getElementById('ktLogin'); if (o) o.remove(); goto('dashboard'); return state.traineeId;
        });
        await page.addStyleTag({ content: '#ktLogin{display:none !important;}' });
        await page.waitForTimeout(1200);
        for (const { n, id } of DAYS) if (!/🔒 Video/.test(await btn(id))) fail(`a trainee should see 🔒 Video on Case Flow Day ${n} before it is unlocked: "${await btn(id)}"`);

        // the trainer ticks Case Flow Days 3, 4 and 5 in 🎬 Unlock Videos (all batches)
        await asAdmin(); await page.waitForTimeout(1500);
        for (const { n } of DAYS) { if (!(await tile(n, true))) fail(`🎬 Unlock Videos has no Case Flow Day ${n} tile`); await page.waitForTimeout(900); }
        const saved = await page.evaluate(() => sharedGet('settings:openvideos'));
        for (const { n, id } of DAYS) if (!saved || !(saved.all || []).includes(id)) fail(`ticking Case Flow Day ${n} should save it in settings:openvideos: ${JSON.stringify(saved)}`);

        await page.evaluate(async (tid) => { state.isAdmin = false; state.adminPreview = false; state.traineeId = tid; state.adminTab = null; state.cmOpenVideos = null; await syncToLedger(); goto('dashboard'); }, tid);
        await page.waitForTimeout(5000); await page.evaluate(() => render()); await page.waitForTimeout(500);
        for (const { n, id, spec } of DAYS) {
            if (!/▶ Video/.test(await btn(id))) { fail(`once unlocked, the trainee's Case Flow Day ${n} card should show ▶ Video: "${await btn(id)}"`); continue; }
            await page.evaluate(() => { const o = document.querySelector('.cm-dv-overlay, #cm-dv'); if (o) o.remove(); });
            await page.click(`#module-${id} .cm-dv-btn`); await page.waitForTimeout(2500);
            const v = await page.evaluate(async () => {
                const v = document.querySelector('video'); if (!v) return null;
                const ch = [...document.querySelectorAll('.cm-dv-chapters button')]; if (ch[5]) ch[5].click();
                await new Promise(r => setTimeout(r, 1200));
                return { h264: !!v.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'), src: v.currentSrc || v.getAttribute('src') || (v.querySelector('source') || {}).src || '', ready: v.readyState, dur: v.duration, t: v.currentTime, tracks: v.textTracks.length, chapters: ch.length };
            });
            if (!v) { fail(`▶ Video on Day ${n} should open the viewer with the video`); continue; }
            if (!new RegExp(`/decks/day${n}/day${n}-narrated\\.mp4$`).test(v.src)) fail(`the viewer should play decks/day${n}/day${n}-narrated.mp4: ${v.src}`);
            if (v.h264 && (v.ready < 1 || !(v.dur > 60))) fail(`the Day ${n} video doesn't load: readyState ${v.ready}, duration ${v.dur}`);   // CI's Chromium has no H.264 (CLAUDE.md)
            if (!v.tracks) fail(`the Day ${n} video has no captions track`);
            if (v.chapters !== spec.slides.length) fail(`the Day ${n} viewer should list ${spec.slides.length} slides as chapters: ${v.chapters}`);
            if (v.h264 && Math.abs(v.t - spec.video.starts[5]) > 3) fail(`the Day ${n} 6th chapter should seek to ${spec.video.starts[5]}s: ${v.t}`);
        }
        // leave the store as found: the trainer locks the three videos again (other checks share this server)
        await asAdmin(); await page.waitForTimeout(1500);
        for (const { n } of DAYS) { await tile(n, false); await page.waitForTimeout(900); }
        const after = await page.evaluate(() => sharedGet('settings:openvideos'));
        for (const { n, id } of DAYS) if (after && (after.all || []).includes(id)) fail(`locking Case Flow Day ${n} again should take it out of settings:openvideos: ${JSON.stringify(after)}`);
    } finally { await browser.close(); }
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`🎬 Case Flow Days 3, 4 and 5's videos: 🔒 until a trainer ticks each in 🎬 Unlock Videos, then ▶ Video plays it with captions and ${DAYS.map(d => d.spec.slides.length).join(', ')} chapters (no Skill Building pages, John Doe VS Robert Smith throughout).`);
    console.log('All good.');
})().catch(e => { console.error(e); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); });
