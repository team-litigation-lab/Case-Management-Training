// @check browser — 🎬 The day video player: ⛶ Full screen, speed 0.75×–2× (remembered), resume where you left off, captions in a strip under the picture
// For every day in CM_DAY_VIDEOS (Day 1, Day 2 and any day added later), the viewer (js/cm-day-video.js):
// 1. has a ⛶ Full screen button that takes the whole player (video, caption strip, slide list) full screen; Esc leaves full
//    screen first and only a second Esc closes the viewer;
// 2. has a speed choice 0.75×, 1×, 1.25×, 1.5×, 1.75×, 2× that sets the video's speed and is remembered next time;
// 3. keeps the trainee's place (personal progress key "day-video"): closed at 2:05, it opens at 2:05 with
//    "Resumed at 2:05 · Start over"; Start over goes back to 0:00; the chapters still jump to their slide;
// 4. draws the captions in a black strip under the video, not over the slide: the track is "hidden" and its cue text fills
//    the strip; CC turns the strip off and on, and that is remembered; a long caption at phone width isn't cut off; a video
//    with no captions file has no strip and no CC button;
// 5. closing the viewer before the trainee's saved places were read saves nothing over them.
// The open-source Chromium the checks run in can't play H.264: nothing here needs playback. Times are set with currentTime
// (before the video loads, that is where it will start) and the strip is filled from the track's own cues.
// Usage: node .github/scripts/day-video-player.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    let days = [];
    try {
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
        await signIn(page, 'Vida', 'Player' + tag, 'B100926');
        await page.addStyleTag({ content: '#ktLogin{display:none !important;}' });
        days = await page.evaluate(() => {
            // the trainer has unlocked every video for this trainee (on this page only: nothing is written to the server)
            const ids = Object.keys(window.CM_DAY_VIDEOS || {}).map(Number);
            state.cmOpenVideos = { all: ids, batches: {} };
            return ids;
        });
        if (days.length < 2) fail(`CM_DAY_VIDEOS should list at least Day 1 and Day 2's videos: ${JSON.stringify(days)}`);
        const reg = await page.evaluate(() => PERSONAL_KEYS.includes('day-video'));
        if (!reg) fail('"day-video" is not a personal progress key (registerPersonalKeys from js/cm-day-video.js)');

        for (const id of days) {
            const name = `day ${id}`;
            const open = async () => { await page.evaluate((id) => { cmDayVideo.close(); cmDayVideo.open(id); }, id); await page.waitForTimeout(500); };
            await page.evaluate(() => { try { localStorage.removeItem('lsh_day-video'); } catch (e) {} });
            await page.evaluate(() => storeSet('day-video', null));
            await open();

            // the controls, and the caption strip under the picture
            const ui = await page.evaluate(() => {
                const o = document.getElementById('cm-dv'); if (!o) return null;
                const v = o.querySelector('video'), cc = o.querySelector('.cm-dv-cc'), fs = o.querySelector('.cm-dv-fs'), rate = o.querySelector('.cm-dv-rate');
                const vr = v.getBoundingClientRect(), cr = cc && cc.getBoundingClientRect(), br = o.querySelector('.cm-dv-box').getBoundingClientRect();
                const font = cc && getComputedStyle(cc);
                return { fs: fs && fs.textContent.trim(), rates: rate ? [...rate.options].map(x => Number(x.value)) : [], cc: !!cc, ccBtn: !!o.querySelector('.cm-dv-ccbtn'),
                    below: cr ? cr.top >= vr.bottom - 1 && cr.left >= vr.left - 1 && cr.right <= vr.right + 1 : false, ccH: cr ? Math.round(cr.height) : 0,
                    ccBg: font && font.backgroundColor, ccFont: font ? [Number(font.fontWeight), parseFloat(font.fontSize)] : [], ctlFont: fs ? [Number(getComputedStyle(fs).fontWeight), parseFloat(getComputedStyle(fs).fontSize)] : [],
                    mode: v.textTracks[0] && v.textTracks[0].mode, fits: br.bottom <= innerHeight + 1 && cr && cr.bottom <= innerHeight + 1,
                    nativeFs: (v.getAttribute('controlslist') || '').includes('nofullscreen') };
            });
            if (!ui) { fail(`${name}: the viewer didn't open`); continue; }
            if (!/Full screen/.test(ui.fs || '')) fail(`${name}: no ⛶ Full screen button: ${JSON.stringify(ui)}`);
            if (JSON.stringify(ui.rates) !== '[0.75,1,1.25,1.5,1.75,2]') fail(`${name}: the speed choice should be 0.75× to 2×: ${JSON.stringify(ui.rates)}`);
            if (!ui.cc || !ui.below || ui.ccH < 40) fail(`${name}: the captions should be a strip under the video, not over the slide: ${JSON.stringify(ui)}`);
            if (ui.ccBg !== 'rgb(0, 0, 0)') fail(`${name}: the caption strip should be on the black bar: ${ui.ccBg}`);
            if (ui.ccFont[0] < 700 || ui.ccFont[1] < 16 || ui.ctlFont[0] < 700 || ui.ctlFont[1] < 16) fail(`${name}: the captions and controls should be bold and at least 16px: ${JSON.stringify(ui)}`);
            if (ui.mode !== 'hidden') fail(`${name}: the browser still draws the captions over the slide (track mode "${ui.mode}", should be "hidden")`);
            if (!ui.nativeFs) fail(`${name}: the browser's own full-screen button would leave the caption strip behind (controlslist="nofullscreen")`);
            if (!ui.fits) fail(`${name}: the viewer and its caption strip don't fit the screen at 1366×768: ${JSON.stringify(ui)}`);

            // the strip shows the cue at the video's time (filled from the track: no playback needed)
            const cue = await page.evaluate(async () => {
                const v = document.querySelector('#cm-dv video'), tr = v.textTracks[0];
                for (let i = 0; i < 40 && !(tr.cues && tr.cues.length); i++) await new Promise(r => setTimeout(r, 100));
                if (!(tr.cues && tr.cues.length)) return { cues: 0 };
                const c = tr.cues[Math.min(3, tr.cues.length - 1)];
                v.currentTime = (c.startTime + c.endTime) / 2; tr.dispatchEvent(new Event('cuechange'));
                return { cues: tr.cues.length, want: c.text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), got: document.querySelector('#cm-dv .cm-dv-cc').textContent.replace(/\s+/g, ' ').trim() };
            });
            if (!cue.cues) fail(`${name}: the captions track has no cues`);
            else if (!cue.got || cue.got !== cue.want) fail(`${name}: the caption strip should show the cue at the video's time: ${JSON.stringify(cue)}`);

            // CC off and on again, remembered
            await page.click('#cm-dv .cm-dv-ccbtn'); await page.waitForTimeout(150);
            const off = await page.evaluate(() => { const o = document.getElementById('cm-dv'), cc = o.querySelector('.cm-dv-cc'); return { hidden: getComputedStyle(cc).display === 'none', saved: JSON.parse(localStorage.getItem('lsh_day-video') || '{}').cc, pressed: o.querySelector('.cm-dv-ccbtn').getAttribute('aria-pressed') }; });
            if (!off.hidden || off.saved !== false || off.pressed !== 'false') fail(`${name}: CC should hide the caption strip and remember it: ${JSON.stringify(off)}`);
            await open();
            if (!(await page.evaluate(() => document.getElementById('cm-dv').classList.contains('cm-dv-nocc')))) fail(`${name}: CC off wasn't remembered when the video opened again`);
            await page.click('#cm-dv .cm-dv-ccbtn'); await page.waitForTimeout(150);

            // speed: 2×, remembered
            await page.selectOption('#cm-dv .cm-dv-rate', '2'); await page.waitForTimeout(150);
            const r1 = await page.evaluate(() => document.querySelector('#cm-dv video').playbackRate);
            if (r1 !== 2) fail(`${name}: choosing 2× should play at 2×: ${r1}`);
            await open();
            const r2 = await page.evaluate(() => ({ rate: document.querySelector('#cm-dv video').playbackRate, shown: document.querySelector('#cm-dv .cm-dv-rate').value }));
            if (r2.rate !== 2 || r2.shown !== '2') fail(`${name}: 2× wasn't remembered when the video opened again: ${JSON.stringify(r2)}`);
            await page.selectOption('#cm-dv .cm-dv-rate', '1');

            // resume: close at 2:05, open again at 2:05 (first forget the place the caption test left, 0:15 or so)
            await page.evaluate(async () => { cmDayVideo.close(); localStorage.removeItem('lsh_day-video'); await storeSet('day-video', null); });
            await open();
            const fresh = await page.evaluate(() => ({ t: document.querySelector('#cm-dv video').currentTime, note: !document.querySelector('#cm-dv .cm-dv-resume').hidden }));
            if (fresh.t > 1 || fresh.note) fail(`${name}: a video never watched should start at 0:00 with no "Resumed" note: ${JSON.stringify(fresh)}`);
            await page.evaluate(() => { document.querySelector('#cm-dv video').currentTime = 125; cmDayVideo.close(); });
            const kept = await page.evaluate((id) => ({ local: (JSON.parse(localStorage.getItem('lsh_day-video') || '{}').pos || {})[id] }), id);
            if (kept.local !== 125) fail(`${name}: closing the video should keep the place (2:05): ${JSON.stringify(kept)}`);
            await open();
            const back = await page.evaluate(() => { const n = document.querySelector('#cm-dv .cm-dv-resume'); return { t: Math.round(document.querySelector('#cm-dv video').currentTime), note: n.hidden ? '' : n.textContent.replace(/\s+/g, ' ').trim() }; });
            if (back.t !== 125 || !/Resumed at 2:05/.test(back.note) || !/Start over/.test(back.note)) fail(`${name}: opening it again should resume at 2:05 with "Resumed at 2:05 · Start over": ${JSON.stringify(back)}`);
            // a chapter still jumps to its slide (any time can be reached)
            const ch = await page.evaluate((id) => { const c = CM_DAY_VIDEOS[id].chapters[4]; cmDayVideo.seek(4); return { want: c.t, t: document.querySelector('#cm-dv video').currentTime, note: document.querySelector('#cm-dv .cm-dv-resume').hidden }; }, id);
            if (Math.abs(ch.t - ch.want) > 1 || !ch.note) fail(`${name}: a chapter should jump to its slide: ${JSON.stringify(ch)}`);
            await page.evaluate(() => { document.querySelector('#cm-dv video').currentTime = 125; cmDayVideo.close(); });
            await open();
            await page.click('#cm-dv .cm-dv-resume button'); await page.waitForTimeout(200);
            const over = await page.evaluate((id) => ({ t: document.querySelector('#cm-dv video').currentTime, note: document.querySelector('#cm-dv .cm-dv-resume').hidden, pos: (JSON.parse(localStorage.getItem('lsh_day-video') || '{}').pos || {})[id] }), id);
            if (over.t > 1 || !over.note || over.pos !== undefined) fail(`${name}: Start over should go back to 0:00 and forget the place: ${JSON.stringify(over)}`);
            // the place reaches the trainee's account copy of their progress (storeSet on close)
            await page.evaluate(() => { document.querySelector('#cm-dv video').currentTime = 61; cmDayVideo.close(); });
            await page.waitForTimeout(200);
            const stored = await page.evaluate(async (id) => ((await storeGet('day-video')) || { pos: {} }).pos[id], id);
            if (stored !== 61) fail(`${name}: the place should be saved to the trainee's progress: ${stored}`);

            // full screen: the whole player; Esc leaves full screen, then closes
            await open();
            await page.click('#cm-dv .cm-dv-fs'); await page.waitForTimeout(600);
            let fs = await page.evaluate(() => ({ el: document.fullscreenElement ? document.fullscreenElement.className : null, label: document.querySelector('#cm-dv .cm-dv-fs').textContent, pressed: document.querySelector('#cm-dv .cm-dv-fs').getAttribute('aria-pressed') }));
            if (fs.el) {
                if (!/cm-dv-box/.test(fs.el)) fail(`${name}: full screen should take the whole player, not ${fs.el}`);
                if (!/Exit full screen/.test(fs.label) || fs.pressed !== 'true') fail(`${name}: in full screen the button should read "Exit full screen": ${JSON.stringify(fs)}`);
                const inFs = await page.evaluate(() => { const cc = document.querySelector('#cm-dv .cm-dv-cc').getBoundingClientRect(), v = document.querySelector('#cm-dv video').getBoundingClientRect(); return cc.top >= v.bottom - 1 && cc.bottom <= innerHeight + 1; });
                if (!inFs) fail(`${name}: in full screen the caption strip should sit under the video, on screen`);
                await page.keyboard.press('Escape'); await page.waitForTimeout(600);
                fs = await page.evaluate(() => ({ el: !!document.fullscreenElement, open: !!document.getElementById('cm-dv'), label: (document.querySelector('#cm-dv .cm-dv-fs') || {}).textContent }));
                if (fs.el || !fs.open || !/^⛶ Full screen/.test(fs.label || '')) fail(`${name}: Esc should leave full screen and keep the viewer open: ${JSON.stringify(fs)}`);
            } else {
                // a browser that won't go full screen here: the button still asks for the whole player
                const asked = await page.evaluate(() => { let who = null; const p = Element.prototype.requestFullscreen;
                    Element.prototype.requestFullscreen = function () { who = this.className; return Promise.reject(new Error('test')); };
                    try { cmDayVideo.fullscreen(); } finally { Element.prototype.requestFullscreen = p; } return who; });
                if (!/cm-dv-box/.test(asked || '')) fail(`${name}: ⛶ Full screen should ask for the whole player: ${asked}`);
                console.log(`(${name}: this browser didn't go full screen; the button asked for the whole player)`);
            }
            await page.keyboard.press('Escape'); await page.waitForTimeout(300);
            if (await page.$('#cm-dv')) fail(`${name}: Esc should close the viewer`);
        }

        // the bigger screen: the viewer and its caption strip still fit
        await page.setViewportSize({ width: 1920, height: 1080 });
        await page.evaluate((id) => cmDayVideo.open(id), days[0]); await page.waitForTimeout(400);
        const big = await page.evaluate(() => { const cc = document.querySelector('#cm-dv .cm-dv-cc').getBoundingClientRect(); return cc.bottom <= innerHeight + 1 && document.querySelector('#cm-dv .cm-dv-box').getBoundingClientRect().bottom <= innerHeight + 1; });
        if (!big) fail('the viewer and its caption strip don\'t fit the screen at 1920×1080');
        await page.evaluate(() => { cmDayVideo.close(); try { localStorage.removeItem('lsh_day-video'); } catch (e) {} });
        await page.setViewportSize({ width: 1366, height: 768 });

        // 5. closed before the trainee's saved places were read: nothing is saved over them
        const early = await page.evaluate(async (id) => {
            const saved = { pos: { [id]: 300, 99: 42 }, rate: 1.5, cc: true, at: Date.now() };
            await storeSet('day-video', saved); localStorage.setItem('lsh_day-video', JSON.stringify(saved));
            const sg = window.storeGet; window.storeGet = async (k) => { await new Promise(r => setTimeout(r, 400)); return sg(k); };
            try { cmDayVideo.open(id); const v = document.querySelector('#cm-dv video'); v.currentTime = 10; v.dispatchEvent(new Event('timeupdate')); cmDayVideo.close(); await new Promise(r => setTimeout(r, 600)); }
            finally { window.storeGet = sg; }
            const now = (await storeGet('day-video')) || {}, loc = JSON.parse(localStorage.getItem('lsh_day-video') || '{}');
            return { cloud: (now.pos || {})[99], local: (loc.pos || {})[99], rate: now.rate };
        }, days[0]);
        if (early.cloud !== 42 || early.local !== 42 || early.rate !== 1.5) fail(`closing the viewer before the saved places were read should save nothing over them: ${JSON.stringify(early)}`);

        // 6. a long caption at phone width: the strip grows, nothing is cut off
        await page.setViewportSize({ width: 390, height: 840 });
        await page.evaluate((id) => cmDayVideo.open(id), days[0]); await page.waitForTimeout(400);
        const wrap = await page.evaluate(() => { const cc = document.querySelector('#cm-dv .cm-dv-cc'); cc.innerHTML = 'The Case Manager logs the Conflict Check before the matter is ever created in the CMS.<br>Second line'; return { sh: cc.scrollHeight, ch: cc.clientHeight }; });
        if (wrap.sh > wrap.ch + 1) fail(`a long caption at phone width is cut off (${wrap.sh}px of text in a ${wrap.ch}px strip)`);
        await page.evaluate(() => cmDayVideo.close());
        await page.setViewportSize({ width: 1366, height: 768 });

        // 7. a video with no captions file: no caption strip and no CC button
        const nocc = await page.evaluate((id) => {
            const V = window.CM_DAY_VIDEOS, keep = state.cmOpenVideos; V[98] = Object.assign({}, V[id], { captions: '' }); state.cmOpenVideos = { all: (keep.all || []).concat([98]), batches: {} };
            try { cmDayVideo.open(98); const o = document.getElementById('cm-dv'); return o ? { cc: !!o.querySelector('.cm-dv-cc'), btn: !!o.querySelector('.cm-dv-ccbtn'), track: !!o.querySelector('track') } : null; }
            finally { cmDayVideo.close(); delete V[98]; state.cmOpenVideos = keep; }
        }, days[0]);
        if (!nocc || nocc.cc || nocc.btn || nocc.track) fail(`a video with no captions should have no caption strip and no CC button: ${JSON.stringify(nocc)}`);
        await page.evaluate(async () => { localStorage.removeItem('lsh_day-video'); await storeSet('day-video', null); });
    } catch (e) { fail(`the check stopped: ${e.message}`); }
    await browser.close();
    if (failures.length) { console.error('🎬 Day video player check FAILED:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log(`🎬 Day video player (${days.length} days' videos): ⛶ Full screen takes the whole player and Esc leaves it, speed 0.75×–2× is remembered, the trainee resumes where they left off (with Start over), and the captions sit in a strip under the video.`);
})();
