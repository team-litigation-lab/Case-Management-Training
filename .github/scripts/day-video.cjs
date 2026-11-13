// @check browser — 🎬 The Day 1 deck and its narrated video (deck pages are the lesson's slides with their notes in Presenter; the video is 🔒 until a trainer unlocks it)
// The trainer's Canva deck, embedded (build/videoslide → js/cm-deck-slides.js, js/cm-day-video.js):
// 1. the Worker: a trainee reads settings:openvideos but can't write it; a trainer can;
// 2. a lesson with deck pages shows one slide per page (an image that loads), and the page's speaker notes are its script;
// 3. Case Flow Day 1's card shows 🔒 Video to a trainee until the trainer ticks 🎬 Unlock Videos for their batch
//    (Admin → 🔓 Open Lessons); within the once-a-minute check it becomes ▶ Video;
// 4. the viewer plays the day's video with captions, lists every slide as a chapter, and a chapter seeks to its slide.
// Usage: node .github/scripts/day-video.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

async function workerChecks() {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map([['cm:trainee:ana-cruz--b1', JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true })],
        ['cm:settings:openvideos', JSON.stringify({ all: [], batches: { b1: [11] } })]]);
    const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) } };
    const call = async (p, body, token) => { const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env); let b = null; try { b = await res.json(); } catch (e) {} return { status: res.status, body: b }; };
    const t = (await call('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B1' })).body.token;
    const a = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    const read = await call('/api/storage/get', { key: 'settings:openvideos' }, t);
    if (read.status !== 200 || !/"b1":\[11\]/.test((read.body || {}).value || '')) fail(`a trainee can't read settings:openvideos: ${JSON.stringify(read)}`);
    const w = await call('/api/storage/set', { key: 'settings:openvideos', value: JSON.stringify({ all: [11] }) }, t);
    if (w.status !== 403 || /"all":\[11\]/.test(store.get('cm:settings:openvideos'))) fail(`a trainee could write settings:openvideos: ${JSON.stringify(w)}`);
    const aw = await call('/api/storage/set', { key: 'settings:openvideos', value: JSON.stringify({ all: [11], batches: {} }) }, a);
    if (aw.status !== 200 || !/"all":\[11\]/.test(store.get('cm:settings:openvideos'))) fail(`a trainer can't write settings:openvideos: ${JSON.stringify(aw)}`);
}

(async () => {
    await workerChecks();
    // the files the page points at are in the repository
    const notes = JSON.parse(fs.readFileSync(path.join(process.cwd(), 'build/videoslide/day1.json'), 'utf8'));
    for (const f of [notes.video.src, notes.video.captions]) if (!fs.existsSync(path.join(process.cwd(), f))) fail(`${f} is missing`);
    if (fs.statSync(path.join(process.cwd(), notes.video.src)).size > 25 * 1024 * 1024) fail(`${notes.video.src} is over 25 MB: Cloudflare won't serve it as a static asset`);

    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    await page.addInitScript(() => { window.EAPA_POLL = { approval: 3000 }; });   // the trainee's once-a-minute check, sped up
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    const videoBtn = () => page.evaluate(() => { const b = document.querySelector('#module-11 .cm-dv-btn'); return b ? b.textContent.trim() : null; });
    try {
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
        // a batch of this run's own, so a second run on the same server starts with the video locked
        const BATCH = 'B' + String(1 + Date.now() % 12).padStart(2, '0') + String(1 + Math.floor(Date.now() / 12) % 28).padStart(2, '0') + String(30 + Math.floor(Date.now() / 336) % 60), BKEY = BATCH.toLowerCase();
        await signIn(page, 'Vida', 'Deck' + tag, BATCH);
        const tid = await page.evaluate(() => state.traineeId);
        const rec = await page.evaluate(async (k) => sharedGet(k), 'trainee:' + tid);
        rec.approved = true; await put('trainee:' + tid, rec);
        await page.addStyleTag({ content: '#ktLogin{display:none !important;}' });

        // 2. the deck pages are the lesson's slides, with their notes as the script
        const deck = await page.evaluate(() => {
            const out = { lessons: 0, slides: 0, bad: [] };
            Object.entries(window.CM_DECK_SLIDES).forEach(([id, pages]) => {
                // (the course teaches the treatment lessons on Case Flow Day 2: their deck pages go where the lesson is)
                const d = DAYS.find(x => x.lessons.some(y => y.cf && y.cf.block.id === id)); if (!d) { out.bad.push(id + ': no such lesson'); return; }
                const l = d.lessons.find(x => x.cf && x.cf.block.id === id);
                const vs = cmCaseFlow.viewsOf(l.cf.block); out.lessons++; out.slides += vs.length;
                const want = pages.map(p => 'deck' + p.page).join();   // the deck pages, then at most the lesson's Milestone Steps
                if (vs.join() !== want && vs.join() !== want + ',steps') out.bad.push(id + ': views ' + vs.join());
                const sc = window.SLIDE_SCRIPTS[`${d.id}::${l.h}`] || {};
                pages.forEach((p, j) => { if (((sc['p' + (j + 1)] || {}).talk || '') !== p.notes) out.bad.push(`${id} page ${p.page}: its speaker notes aren't the slide's script`); });
            });
            return out;
        });
        if (deck.bad.length || deck.lessons < 6 || deck.slides < 53) fail(`deck slides: ${JSON.stringify(deck)}`);
        await page.evaluate(() => { goto('day', 11); }); await page.waitForTimeout(600);
        const shown = await page.evaluate(async () => {
            const d = DAYS.find(x => x.id === 11), li = d.lessons.findIndex(x => x.cf && x.cf.block.id === 'd1m1-role');
            const i = buildDaySlides(d).findIndex(sl => sl.type === 'topic' && sl.lessonIndex === li && sl.part === 4);
            state.dayViewMode = 'slides'; state.maxSlide = Object.assign({}, state.maxSlide, { 11: 999 }); goToSlide(i);
            await new Promise(r => setTimeout(r, 900));
            const img = document.querySelector('.cfx-deckpage img'), card = document.querySelector('.cf-card');
            const r = img && img.getBoundingClientRect();
            return img ? { src: img.getAttribute('src'), ok: img.complete && img.naturalWidth > 0, w: Math.round(r.width), bottom: Math.round(r.bottom), vh: innerHeight, pill: (card.querySelector('.cfx-pill') || {}).textContent } : null;
        });
        if (!shown || shown.src !== '/decks/day1/04.webp' || !shown.ok) fail(`the deck page isn't on the slide: ${JSON.stringify(shown)}`);
        else if (shown.w < 700 || shown.bottom > shown.vh) fail(`the deck page doesn't fit one screen at a readable size: ${JSON.stringify(shown)}`);
        if (shown && !/The General Process/.test(shown.pill || '')) fail(`the slide isn't named after its deck page: ${JSON.stringify(shown)}`);

        // 3. locked for the trainee until the trainer unlocks it for the batch
        await page.evaluate(() => goto('dashboard')); await page.waitForTimeout(900);
        let b = await videoBtn();
        if (!b || !/🔒/.test(b)) fail(`before the trainer unlocks it, the Day 1 card shows: ${JSON.stringify(b)}`);
        await page.evaluate(() => cmDayVideo.open(11)); await page.waitForTimeout(200);
        if (await page.$('#cm-dv')) fail('a locked video opened for a trainee');
        await page.evaluate((k) => { state.isAdmin = true; state.adminPreview = false; state.cmOpenVideos = null; state.adminData = null; cmOpenLessons.go(k); }, BKEY); await page.waitForTimeout(1200);
        const tile = await page.$('.cm-dv-admin .cm-dv-day input');
        if (!tile) fail('Admin → 🔓 Open Lessons has no 🎬 Unlock Videos tile');
        else { await tile.check(); await page.waitForTimeout(900); }
        const saved = await page.evaluate(async () => sharedGet('settings:openvideos'));
        if (!saved || JSON.stringify(saved.all) !== '[]' || JSON.stringify((saved.batches || {})[BKEY]) !== '[11]') fail(`ticking the tile saved: ${JSON.stringify(saved)}`);
        await page.evaluate(async (tid) => { state.isAdmin = false; state.adminPreview = false; state.traineeId = tid; state.adminTab = null; state.cmOpenVideos = { all: [], batches: {} }; await syncToLedger(); goto('dashboard'); }, tid);
        await page.waitForFunction(() => { const x = document.querySelector('#module-11 .cm-dv-btn'); return x && /▶/.test(x.textContent); }, null, { timeout: 15000 }).catch(() => {});
        b = await videoBtn();
        if (!b || !/▶ Video/.test(b)) fail(`after the trainer unlocked it, the trainee's Day 1 card shows: ${JSON.stringify(b)}`);

        // 4. the viewer
        await page.click('#module-11 .cm-dv-btn'); await page.waitForTimeout(1500);
        const v = await page.evaluate(async () => {
            const o = document.getElementById('cm-dv'); if (!o) return null;
            const vid = o.querySelector('video'), n = o.querySelectorAll('.cm-dv-chapters button').length;
            cmDayVideo.seek(16); await new Promise(r => setTimeout(r, 1200));
            const on = o.querySelector('.cm-dv-chapters button.on');
            const h264 = !!vid.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"');   // Chrome and Edge, as trainees use; the open-source Chromium the checks run in has no H.264
            const head = await fetch(vid.getAttribute('src'), { headers: { Range: 'bytes=0-1023' } }).then(async r => { const b = await r.arrayBuffer(), total = Number(((r.headers.get('content-range') || '').split('/')[1])) || Number(r.headers.get('content-length')) || b.byteLength;
                return { status: r.status === 206 ? 200 : r.status, type: r.headers.get('content-type') || '', size: total }; }).catch(e => ({ status: 0, err: String(e) }));
            return { h264, head, src: vid.getAttribute('src'), track: !!vid.querySelector('track[kind=captions]'), ready: vid.readyState, dur: Math.round(vid.duration || 0), n, t: Math.round(vid.currentTime), on: on ? on.textContent : null, box: o.querySelector('.cm-dv-box').getBoundingClientRect().bottom <= innerHeight + 1 };
        });
        if (!v || v.n !== 54 || !v.track) fail(`the viewer: ${JSON.stringify(v)}`);
        else {
            // the file is served whole, as a video, whatever browser runs the check
            if (v.head.status !== 200 || !/video\/mp4/.test(v.head.type) || v.head.size < 1e6) fail(`the video file isn't served as an mp4: ${JSON.stringify(v.head)}`);
            if (v.h264) {   // a browser that plays H.264 (Chrome, Edge): it loads, and a chapter seeks to its slide and lights up
                if (v.ready < 1 || v.dur < 1800) fail(`the video didn't load: ${JSON.stringify(v)}`);
                if (Math.abs(v.t - notes.video.starts[16]) > 3 || !/Tools for Case Planning/.test(v.on || '')) fail(`a chapter didn't jump to its slide: ${JSON.stringify(v)}`);
            } else {        // open-source Chromium can't decode it: the chapter still moves the video to its slide's time
                if (Math.abs(v.t - notes.video.starts[16]) > 3) fail(`a chapter didn't move the video to its slide: ${JSON.stringify(v)}`);
                console.log('(this browser has no H.264, as the open-source Chromium in CI: playback itself was not checked, the file, the captions and the chapters were)');
            }
            if (!v.box) fail('the viewer is taller than the screen at 1366×768');
        }
        await page.keyboard.press('Escape'); await page.waitForTimeout(200);
        if (await page.$('#cm-dv')) fail("Esc didn't close the viewer");
    } catch (e) { fail(`the check stopped: ${e.message}`); }
    await browser.close();
    if (failures.length) { console.error('🎬 Day video check FAILED:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log('🎬 Day 1 deck and video: 53 deck pages are the lessons\' slides with their notes as scripts, the video is locked until a trainer unlocks it for the batch, and the viewer plays it with captions and 54 slide chapters.');
})();
