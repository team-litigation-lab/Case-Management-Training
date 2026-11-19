// @check browser — 🎬 The Case Debrief, the Case Profile's third tab: 🔒 for a trainee until Case Flow Day 5 is complete (saying why and when it opens, giving nothing away), open after it and always for a trainer; its slides and captions served, the player's controls (captions in a strip, CC, speed, ⛶ Full screen, the slides as chapters, the place kept across a redraw and a reload); one screen at 1366×768 and 1920×1080, type bold and 16px or more
// js/cm-case-debrief.js, with CM_DEBRIEF_VIDEO from build/debrief/debrief.json (build/videoslide/deck-slides.cjs):
// 1. the tab is the profile's third, after 👋 Meet John Doe and 🗺 File Map; CM_DEBRIEF_VIDEO has one chapter per slide of
//    debrief.json, each with its picture served (decks/debrief/NN.webp, a WebP);
// 2. a trainee whose Case Flow Day 5 is not complete sees "🎬 Case Debrief 🔒" and a locked tab that says why and when it
//    opens (a Day 5 Knowledge Check recorded below 70% is named, with the trainer who can reopen it), with no player, no
//    slide list and none of the deck's titles; once Day 5 is complete (state.progress[day].done) it opens; a trainer, and a
//    trainer's 👁 Trainee view, always sees it open;
// 3. before the video is recorded (no video.starts in debrief.json) the open tab steps through the slides and their script:
//    Next / Previous, a slide from the list, ← / →, and the slide is remembered (personal key "case-debrief");
// 4. the player: a <video> with controls and the captions track kept "hidden", its cues drawn in a black strip under the
//    picture; CC hides the strip (remembered), speed 0.75×–2× (remembered), a slide in the list seeks to its chapter, ⛶ Full
//    screen takes the stage, a redraw keeps the same <video>, the portal's update waits while it plays, and a reload
//    opens it where the trainee left off ("Resumed at 2:05 · Start over"). Once recorded, the video and its captions must be
//    served (a byte range of the .mp4, the .vtt); until then the player is tried on Case Flow Day 1's narrated video and
//    captions, the same kind of files. The open-source Chromium the checks run in can't play H.264: playback is tried only
//    where canPlayType says it can; times are set with currentTime;
// 5. every state, trainee and trainer, fits one screen at 1366×768 and 1920×1080 (the tab, the page and the window), with
//    every word in the tab bold and 16px or more.
// Usage: node .github/scripts/case-debrief.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const SPEC = JSON.parse(fs.readFileSync(path.join(__dirname, '..', '..', 'build/debrief/debrief.json'), 'utf8'));
const SIZES = [[1366, 768], [1920, 1080]];
const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

// in the page: open the Case Profile on the debrief tab, as a trainee or a trainer, and measure it
async function openTab(page, setup) {
    return page.evaluate(async (setup) => {
        const day5 = DAYS.find((d) => d.cf && d.cf.n === 5);
        state.isAdmin = setup.role === 'trainer'; state.adminPreview = setup.role === 'preview'; state.cfReturn = null;
        if (setup.progress !== undefined) { if (setup.progress) state.progress[day5.id] = setup.progress; else delete state.progress[day5.id]; }
        state.cfFileTab = 'debrief'; goto('clientprofile'); await new Promise((r) => setTimeout(r, 600));
        const t = document.querySelector('.cf-file-page .cdb-tab'), main = document.querySelector('#app > main');
        const tabs = [...document.querySelectorAll('.cf-file-tab')].map((b) => b.textContent.trim());
        const visible = (e) => e.getClientRects().length && getComputedStyle(e).visibility !== 'hidden';
        const words = t ? [...t.querySelectorAll('*')].filter((e) => visible(e) && [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim())) : [];
        const small = words.filter((e) => parseFloat(getComputedStyle(e).fontSize) < 16 || Number(getComputedStyle(e).fontWeight) < 600)
            .map((e) => `${e.tagName.toLowerCase()}.${e.className} ${getComputedStyle(e).fontSize}/${getComputedStyle(e).fontWeight} "${e.textContent.trim().slice(0, 30)}"`);
        return { mode: window.cmCaseDebrief ? cmCaseDebrief.mode() : null, tabs, on: (document.querySelector('.cf-file-tab.on') || {}).textContent || '',
            text: t ? t.innerText : '', locked: !!(t && t.classList.contains('cdb-locked')), video: !!(t && t.querySelector('video')), list: !!(t && t.querySelector('.cdb-list')),
            over: t ? t.scrollHeight - t.clientHeight : 99, win: document.documentElement.scrollHeight - innerHeight, body: main ? main.scrollHeight - main.clientHeight : 99,
            bottom: t ? Math.round(t.getBoundingClientRect().bottom - innerHeight) : 99, small };
    }, setup);
}
const fits = (r) => r.over <= 2 && r.win <= 2 && r.body <= 2 && r.bottom <= 1;

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    for (const [W, H] of SIZES) {
        const L = `${W}x${H}`;
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        page.on('pageerror', (e) => failures.push(`${L} page error: ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await sleep(700);
        const tag = String(Date.now()).slice(-6).replace(/\d/g, (d) => 'abcdefghij'[d]);
        await signIn(page, 'Debrief', 'Trainee' + tag, 'B100926');
        await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });

        // 1. the data, the pictures, the tab's place
        if (W === SIZES[0][0]) {
            const data = await page.evaluate(async () => {
                const V = window.CM_DEBRIEF_VIDEO; if (!V) return null;
                const pics = await Promise.all(V.chapters.map(async (c) => { const r = await fetch(c.img); return { img: c.img, ok: r.ok, type: r.headers.get('content-type') || '' }; }));
                return { recorded: V.recorded, src: V.src, captions: V.captions, chapters: V.chapters.map((c) => [c.page, c.title]), pics, keyed: PERSONAL_KEYS.includes('case-debrief') };
            });
            check(!!data, 'CM_DEBRIEF_VIDEO is on the page (js/cm-deck-slides.js)');
            if (data) {
                check(JSON.stringify(data.chapters) === JSON.stringify(SPEC.slides.map((s) => [s.page, s.title])), `one chapter per slide of build/debrief/debrief.json (${data.chapters.length} of ${SPEC.slides.length}), in order, with its title`);
                const bad = data.pics.filter((p) => !p.ok || !/image\/webp/.test(p.type));
                check(!bad.length, `every slide's picture is served as a WebP${bad.length ? ': ' + bad.map((p) => p.img).join(', ') : ''}`);
                check(data.src === SPEC.video.src && data.captions === SPEC.video.captions && /\/decks\/debrief\/debrief-narrated\.mp4$/.test(data.src) && /\/decks\/debrief\/debrief-narrated\.vtt$/.test(data.captions), `the tab plays decks/debrief/debrief-narrated.mp4 with decks/debrief/debrief-narrated.vtt (${data.src}, ${data.captions})`);
                check(data.keyed, '"case-debrief" is a personal progress key (registerPersonalKeys from js/cm-case-debrief.js)');
                if (data.recorded) {
                    const served = await page.evaluate(async ({ src, captions }) => {
                        const v = await fetch(src, { headers: { Range: 'bytes=0-1023' } }), c = await fetch(captions), body = await c.text();
                        return { v: v.status, vType: v.headers.get('content-type') || '', c: c.status, cType: c.headers.get('content-type') || '', webvtt: /^WEBVTT/.test(body) };
                    }, data);
                    check((served.v === 206 || served.v === 200) && /video\/mp4/.test(served.vType), `the debrief video is served, a byte range at a time (${served.v} ${served.vType})`);
                    check(served.c === 200 && served.webvtt && /text\/vtt/.test(served.cType), `its captions are served as WebVTT (${served.c} ${served.cType})`);
                } else console.log('(the debrief is not recorded yet: no video.starts in build/debrief/debrief.json, so the tab steps through the slides; debrief-narration.cjs says how to record it)');
            }
        }

        // 2. the lock: a trainee before Day 5 is complete
        let r = await openTab(page, { role: 'trainee', progress: null });
        check(r.tabs[0] && /Meet John Doe/.test(r.tabs[0]) && /File Map/.test(r.tabs[1] || '') && /Case Debrief/.test(r.tabs[2] || ''), `${L}: 🎬 Case Debrief is the profile's third tab (${JSON.stringify(r.tabs.slice(0, 4))})`);
        check(r.mode === 'locked' && /🔒/.test(r.on) && r.locked && !r.video && !r.list, `${L} trainee, Day 5 not complete: the tab is 🔒 and locked, no player and no slide list (mode ${r.mode}, tab "${r.on.trim()}")`);
        check(/Case Flow Day 5/.test(r.text) && /Why it's locked/i.test(r.text) && /When it opens/i.test(r.text) && /Knowledge Check/.test(r.text) && /70%/.test(r.text), `${L} trainee: the locked tab says why it is locked and when it opens`);
        const leaked = SPEC.slides.map((s) => s.title).filter((t) => r.text.includes(t));
        check(!leaked.length && !/\$\d/.test(r.text), `${L} trainee: the locked tab gives nothing away (no slide title, no figure)${leaked.length ? ': ' + leaked.join('; ') : ''}`);
        check(fits(r) && !r.small.length, `${L} trainee, locked: fits one screen, every word bold and 16px or more (tab+${r.over}, window+${r.win}, page+${r.body}${r.small.length ? '; small: ' + r.small.slice(0, 4).join(', ') : ''})`);
        r = await openTab(page, { role: 'trainee', progress: { score: 60, done: false, history: [{ score: 60, passed: false, date: new Date().toISOString() }] } });
        check(r.mode === 'locked' && /recorded at 60%/.test(r.text) && /trainer/i.test(r.text), `${L} trainee: a Day 5 Knowledge Check recorded below 70% keeps it locked, and the tab says so and who can reopen the check`);
        check(fits(r) && !r.small.length, `${L} trainee, below 70%: fits one screen, type bold and 16px or more (tab+${r.over}, window+${r.win}${r.small.length ? '; small: ' + r.small.slice(0, 4).join(', ') : ''})`);

        // the tab opens on Day 5 complete, and is always open for a trainer and a trainer's Trainee view
        r = await openTab(page, { role: 'trainee', progress: { score: 85, done: true, history: [{ score: 85, passed: true, date: new Date().toISOString() }] } });
        check(r.mode !== 'locked' && !/🔒/.test(r.on) && !r.locked && r.list, `${L} trainee, Day 5 complete: the tab opens (mode ${r.mode}, tab "${r.on.trim()}")`);
        check(fits(r) && !r.small.length, `${L} trainee, open: fits one screen, type bold and 16px or more (tab+${r.over}, window+${r.win}, page+${r.body}${r.small.length ? '; small: ' + r.small.slice(0, 4).join(', ') : ''})`);
        for (const role of ['trainer', 'preview']) {
            r = await openTab(page, { role, progress: null });
            check(r.mode !== 'locked' && !r.locked && r.list, `${L} ${role === 'trainer' ? 'trainer' : "trainer's 👁 Trainee view"}: the tab is open with no Day 5 (mode ${r.mode})`);
            check(fits(r) && !r.small.length, `${L} ${role}: fits one screen, type bold and 16px or more (tab+${r.over}, window+${r.win}, page+${r.body}${r.small.length ? '; small: ' + r.small.slice(0, 4).join(', ') : ''})`);
        }

        // 3. not recorded yet: the slides and their script
        if (r.mode === 'slides') {
            await page.evaluate(async () => { try { localStorage.removeItem('lsh_case-debrief'); } catch (e) {} await storeSet('case-debrief', null); });
            await openTab(page, { role: 'trainer' });
            const s1 = await page.evaluate(async () => {
                const t = document.querySelector('.cdb-tab'), img = t.querySelector('.cdb-pic img');
                for (let i = 0; i < 30 && !(img.complete && img.naturalWidth); i++) await new Promise((r) => setTimeout(r, 100));
                return { src: img.getAttribute('src'), w: img.naturalWidth, count: t.querySelector('.cdb-count').textContent, script: t.querySelector('.cdb-script').textContent,
                    prev: t.querySelector('[aria-label="Previous slide"]').disabled, cur: (t.querySelector('.cdb-list [aria-current=true]') || {}).dataset };
            });
            check(s1.src === '/decks/debrief/01.webp' && s1.w >= 1600 && s1.count === `1 / ${SPEC.slides.length}` && s1.script.includes(SPEC.slides[0].notes.slice(0, 60)) && s1.prev, `slides: the tab opens on slide 1, its picture and its script, ‹ Previous off (${JSON.stringify({ src: s1.src, w: s1.w, count: s1.count, prev: s1.prev })})`);
            await page.click('.cdb-tab [aria-label="Next slide"]'); await sleep(150);
            await page.click('.cdb-tab .cdb-list button[data-i="12"]'); await sleep(150);
            await page.keyboard.press('ArrowLeft'); await sleep(150);
            const s2 = await page.evaluate(() => { const t = document.querySelector('.cdb-tab');
                return { src: t.querySelector('.cdb-pic img').getAttribute('src'), count: t.querySelector('.cdb-count').textContent, script: t.querySelector('.cdb-script').textContent,
                    cur: (t.querySelector('.cdb-list [aria-current=true]') || {}).dataset || {}, kept: (JSON.parse(localStorage.getItem('lsh_case-debrief') || '{}')).slide }; });
            check(s2.src === '/decks/debrief/12.webp' && s2.count === `12 / ${SPEC.slides.length}` && s2.script.includes(SPEC.slides[11].title) && s2.cur.i === '11' && s2.kept === 11,
                `slides: Next, a slide from the list and ← step through them, the list marks the slide and it is remembered (${JSON.stringify(s2.cur)} ${s2.count}, kept ${s2.kept})`);
            await page.evaluate(() => render()); await sleep(200);
            const s3 = await page.evaluate(() => document.querySelector('.cdb-tab .cdb-count').textContent);
            check(s3 === `12 / ${SPEC.slides.length}`, `slides: a redraw keeps the slide (${s3})`);
        }

        // 4. the player. Recorded: the debrief's own video; not yet: Case Flow Day 1's narrated video and captions stand in
        //    (installed before the page's scripts run, so a reload keeps them)
        await page.addInitScript(() => {
            let v; Object.defineProperty(window, 'CM_DEBRIEF_VIDEO', { configurable: true, get: () => v, set: (x) => { v = x;
                if (x && !x.recorded) { const D = (window.CM_DAY_VIDEOS || {})[11]; if (D) { x.recorded = true; x.src = D.src; x.captions = D.captions; x.standIn = true;
                    x.chapters.forEach((c, i) => { c.t = D.chapters[i] ? D.chapters[i].t : i * 60; }); } } } });
        });
        await page.reload({ waitUntil: 'load' });
        await page.waitForFunction(() => typeof goto === 'function' && typeof state === 'object' && !!state.traineeId && !!window.cmCaseDebrief, null, { timeout: 20000 });
        await sleep(800);
        await page.evaluate(async () => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); try { localStorage.removeItem('lsh_case-debrief'); } catch (e) {} await storeSet('case-debrief', null); });
        r = await openTab(page, { role: 'trainer' });
        const standIn = await page.evaluate(() => !!CM_DEBRIEF_VIDEO.standIn);
        if (standIn && W === SIZES[0][0]) console.log("(the player is tried on Case Flow Day 1's narrated video and captions until the debrief is recorded)");
        check(r.mode === 'video' && r.video, `${L} the player: the open tab plays the video (mode ${r.mode})`);
        check(fits(r) && !r.small.length, `${L} the player: fits one screen, every word bold and 16px or more (tab+${r.over}, window+${r.win}, page+${r.body}${r.small.length ? '; small: ' + r.small.slice(0, 4).join(', ') : ''})`);
        const ui = await page.evaluate(() => {
            const t = document.querySelector('.cdb-tab'), v = t.querySelector('video'), cc = t.querySelector('.cdb-cc'), tr = v.querySelector('track');
            const vr = v.getBoundingClientRect(), cr = cc && cc.getBoundingClientRect(), f = cc && getComputedStyle(cc);
            return { src: v.getAttribute('src'), want: CM_DEBRIEF_VIDEO.src, controls: v.controls, inline: v.hasAttribute('playsinline'), nofs: (v.getAttribute('controlslist') || '').includes('nofullscreen'),
                track: tr && { kind: tr.kind, src: tr.getAttribute('src'), def: tr.default }, wantCc: CM_DEBRIEF_VIDEO.captions, mode: v.textTracks[0] && v.textTracks[0].mode,
                below: cr ? cr.top >= vr.bottom - 1 && cr.left >= vr.left - 1 && cr.right <= vr.right + 1 : false, ccH: cr ? Math.round(cr.height) : 0, ccBg: f && f.backgroundColor,
                rates: [...t.querySelectorAll('.cdb-rate option')].map((o) => Number(o.value)), fs: (t.querySelector('.cdb-fs') || {}).textContent || '', ccBtn: !!t.querySelector('.cdb-ccbtn'),
                skip: [...t.querySelectorAll('.cdb-bar button')].filter((b) => /10s/.test(b.textContent)).length, poster: v.getAttribute('poster') };
        });
        check(ui.src === ui.want && ui.controls && ui.inline && ui.nofs && ui.poster === '/decks/debrief/01.webp', `${L} the player: a <video> of ${ui.want} with controls, playsinline, no browser full screen (the strip goes with ours), slide 1 as its poster`);
        check(ui.track && ui.track.kind === 'captions' && ui.track.src === ui.wantCc && ui.track.def && ui.mode === 'hidden', `${L} the player: its captions track (${ui.wantCc}) is "hidden": drawn in the strip, never over the slide (${JSON.stringify(ui.track)} ${ui.mode})`);
        check(ui.below && ui.ccH >= 40 && ui.ccBg === 'rgb(0, 0, 0)', `${L} the player: the captions are a black strip under the picture (${JSON.stringify({ below: ui.below, h: ui.ccH, bg: ui.ccBg })})`);
        check(JSON.stringify(ui.rates) === '[0.75,1,1.25,1.5,1.75,2]' && /Full screen/.test(ui.fs) && ui.ccBtn && ui.skip === 2, `${L} the player: speed 0.75×–2×, CC, ⏪ / ⏩ 10s and ⛶ Full screen (${JSON.stringify({ rates: ui.rates, fs: ui.fs, skip: ui.skip })})`);

        // the strip shows the cue at the video's time (from the track's own cues: no playback needed)
        const cue = await page.evaluate(async () => {
            const v = document.querySelector('.cdb-tab video'), tr = v.textTracks[0];
            for (let i = 0; i < 50 && !(tr.cues && tr.cues.length); i++) await new Promise((r) => setTimeout(r, 100));
            if (!(tr.cues && tr.cues.length)) return { cues: 0 };
            const c = tr.cues[Math.min(3, tr.cues.length - 1)];
            v.currentTime = (c.startTime + c.endTime) / 2; tr.dispatchEvent(new Event('cuechange'));
            return { cues: tr.cues.length, want: c.text.replace(/<[^>]*>/g, '').replace(/\s+/g, ' ').trim(), got: document.querySelector('.cdb-tab .cdb-cc').textContent.replace(/\s+/g, ' ').trim() };
        });
        check(cue.cues > 0 && cue.got === cue.want, `${L} the player: the strip shows the caption at the video's time (${cue.cues} cues; "${(cue.got || '').slice(0, 40)}")`);

        // CC off (remembered), and on again; 2× (remembered)
        await page.click('.cdb-tab .cdb-ccbtn'); await sleep(150);
        const off = await page.evaluate(() => { const t = document.querySelector('.cdb-tab'); return { hidden: getComputedStyle(t.querySelector('.cdb-cc')).display === 'none', pressed: t.querySelector('.cdb-ccbtn').getAttribute('aria-pressed'), kept: JSON.parse(localStorage.getItem('lsh_case-debrief') || '{}').cc }; });
        check(off.hidden && off.pressed === 'false' && off.kept === false, `${L} the player: CC hides the strip and is remembered (${JSON.stringify(off)})`);
        await page.click('.cdb-tab .cdb-ccbtn'); await sleep(150);
        await page.selectOption('.cdb-tab .cdb-rate', '2'); await sleep(150);
        const rate = await page.evaluate(() => ({ rate: document.querySelector('.cdb-tab video').playbackRate, kept: JSON.parse(localStorage.getItem('lsh_case-debrief') || '{}').rate }));
        check(rate.rate === 2 && rate.kept === 2, `${L} the player: 2× plays at 2× and is remembered (${JSON.stringify(rate)})`);

        // a slide in the list seeks to its chapter, and the list marks it
        const ch = await page.evaluate(() => { cmCaseDebrief.seek(6); const c = CM_DEBRIEF_VIDEO.chapters[6], v = document.querySelector('.cdb-tab video');
            return { want: c.t, t: v.currentTime, cur: (document.querySelector('.cdb-tab .cdb-list [aria-current=true]') || {}).dataset || {} }; });
        check(Math.abs(ch.t - ch.want) <= 1 && ch.cur.i === '6', `${L} the player: slide 7 in the list seeks to its chapter (${ch.t.toFixed(1)}s of ${ch.want}s; marked ${ch.cur.i})`);

        // a redraw keeps the same <video> (it would stop a playing one), and the update waits while it plays
        const kept = await page.evaluate(() => { const a = cmCaseDebrief.player(); render(); const b = cmCaseDebrief.player();
            const v = document.querySelector('.cdb-tab video');
            Object.defineProperty(b, 'paused', { configurable: true, get: () => false }); const playing = updateIsSafe(); delete b.paused;
            return { same: a === b && v === b && b.isConnected, t: b.currentTime, playing }; });
        check(kept.same && Math.abs(kept.t - ch.want) <= 1, `${L} the player: a redraw of the page keeps the same <video>, at the same time (${JSON.stringify({ same: kept.same, t: kept.t })})`);
        check(kept.playing === false, `${L} the player: the portal's update never reloads the page while the debrief plays`);

        // full screen takes the stage (the video and its strip); Esc leaves it
        await page.click('.cdb-tab .cdb-fs'); await sleep(600);
        const fsOn = await page.evaluate(() => ({ el: document.fullscreenElement ? document.fullscreenElement.className : null, label: (document.querySelector('.cdb-tab .cdb-fs') || {}).textContent }));
        if (fsOn.el) {
            check(/cdb-stage/.test(fsOn.el) && /Exit full screen/.test(fsOn.label), `${L} the player: ⛶ Full screen takes the stage, the video and its captions (${fsOn.el}; "${fsOn.label}")`);
            await page.keyboard.press('Escape'); await sleep(600);
            const fsOff = await page.evaluate(() => ({ el: !!document.fullscreenElement, label: (document.querySelector('.cdb-tab .cdb-fs') || {}).textContent }));
            check(!fsOff.el && /^⛶ Full screen/.test(fsOff.label || ''), `${L} the player: Esc leaves full screen (${JSON.stringify(fsOff)})`);
        } else {
            const asked = await page.evaluate(() => { let who = null; const p = Element.prototype.requestFullscreen;
                Element.prototype.requestFullscreen = function () { who = this.className; return Promise.reject(new Error('test')); };
                try { cmCaseDebrief.fullscreen(); } finally { Element.prototype.requestFullscreen = p; } return who; });
            check(/cdb-stage/.test(asked || ''), `${L} the player: ⛶ Full screen asks for the stage, the video and its captions (${asked})`);
        }

        // the place is kept: leave the tab at 2:05, reload, and the debrief opens there
        await page.evaluate(async () => { document.querySelector('.cdb-tab video').currentTime = 125; cmCaseFlow.fileTab('meet'); await new Promise((r) => setTimeout(r, 300)); });
        const left = await page.evaluate(() => ({ pos: JSON.parse(localStorage.getItem('lsh_case-debrief') || '{}').pos, paused: cmCaseDebrief.player().paused }));
        check(left.pos === 125 && left.paused, `${L} the player: leaving the tab pauses it and keeps the place, 2:05 (${JSON.stringify(left)})`);
        await page.reload({ waitUntil: 'load' });
        await page.waitForFunction(() => typeof goto === 'function' && typeof state === 'object' && !!state.traineeId && !!window.cmCaseDebrief, null, { timeout: 20000 });
        await sleep(800);
        await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });
        await openTab(page, { role: 'trainer' }); await sleep(300);
        const back = await page.evaluate(() => { const n = document.querySelector('.cdb-tab .cdb-resume'), v = document.querySelector('.cdb-tab video');
            return { t: v ? Math.round(v.currentTime) : null, note: n && !n.hidden ? n.textContent.replace(/\s+/g, ' ').trim() : '', rate: v && v.playbackRate }; });
        check(back.t === 125 && /Resumed at 2:05/.test(back.note) && /Start over/.test(back.note) && back.rate === 2, `${L} the player: after a reload it opens at 2:05, "Resumed at 2:05 · Start over", at the speed chosen (${JSON.stringify(back)})`);
        await page.click('.cdb-tab .cdb-resume button'); await sleep(200);
        const over = await page.evaluate(() => ({ t: document.querySelector('.cdb-tab video').currentTime, note: document.querySelector('.cdb-tab .cdb-resume').hidden, pos: JSON.parse(localStorage.getItem('lsh_case-debrief') || '{}').pos }));
        check(over.t < 1 && over.note && over.pos === 0, `${L} the player: Start over goes back to 0:00 and forgets the place (${JSON.stringify(over)})`);

        // playback only where this browser can play the file (the open-source Chromium can't play H.264)
        const can = await page.evaluate(() => document.querySelector('.cdb-tab video').canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));
        if (can) {
            const played = await page.evaluate(async () => { const v = document.querySelector('.cdb-tab video'); v.muted = true;
                try { await v.play(); } catch (e) { return { err: String(e) }; } await new Promise((r) => setTimeout(r, 1500)); const t = v.currentTime; v.pause(); return { t }; });
            check(played.t > 0, `${L} the player: this browser plays it (${JSON.stringify(played)})`);
        } else if (W === SIZES[0][0]) console.log('(this Chromium cannot play H.264: playback not tried)');
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed:\n  ` + failures.join('\n  ')); process.exit(1); }
    console.log('\nAll good: the Case Debrief is the profile\'s third tab, 🔒 until Case Flow Day 5 is complete and open for a trainer, its slides and player work and keep the trainee\'s place, and it fits one screen at both sizes.');
})().catch((e) => { console.error(e); process.exit(1); });
