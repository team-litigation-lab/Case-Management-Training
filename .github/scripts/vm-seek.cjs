// @check browser — The voicemail has a real player (play / pause, ⏪ 5s, ⏩ 5s, a seek bar, elapsed / total, ↺ Start over) on its Your Case slide, in the Listening Check and in the Notes & Action Plan
// 📳 The voicemail player (js/cm-case-flow.js: vmPlan, vmPlayer, cmCaseFlow.vmPlay / vmSeek / vmSkip / vmOver).
//
// A voicemail is not a sound file: the browser's speech engine speaks it. The engine can't seek inside what it is
// saying, so the message is spoken phrase by phrase on a timeline, and a place on the bar starts at the phrase that
// holds it. A trainee transcribing word for word goes back to one part of the message instead of the whole minute.
// This test puts a speech engine and an audio context of its own in the page (they record what is spoken and whether
// the line hiss is running, and fire the engine's start and end when the test says), then checks, at 1366x768:
//  1. Day 1's voicemail Your Case slide shows the player, wide and first: nothing on the slide is under 16px or less
//     than bold, the slide is not scaled down, nothing is cut off, and no words of the message are on it;
//  2. ▶ Play speaks the first phrase (the voicemail box's own voice), then the caller's first words;
//  3. ⏸ Pause keeps the place and ▶ resumes at the same phrase; ↺ Start over goes back to 0:00;
//  4. stopped, a seek to about half way speaks nothing; ▶ then speaks the phrase at that time, not the beginning;
//  5. ⏪ 5s goes back to an earlier phrase and speaks from there; ⏩ 5s goes on to a later one;
//  6. the elapsed label and the bar agree, in every player, and the time moves while it plays;
//  7. "Played N×" goes up by one for each play started from a stopped state, and not on a seek, ⏪ / ⏩ or a
//     pause and resume; the count is what is kept on the trainee's record;
//  8. the Notes & Action Plan and the Listening Check show the same player in the same state, and repaint with it;
//  9. the hiss never runs twice and never after a pause or the end; a hidden tab pauses; the end of the message stops;
// 10. Day 2's voicemail slide has the player too, at full size.
// Usage: node .github/scripts/vm-seek.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const BLOCK = 'd1m3-a1';
const failures = [];
const check = (ok, msg) => { console.log(`${ok ? '  ok  ' : '  FAIL'} ${msg}`); if (!ok) failures.push(msg); };

// the page's speech engine and audio, as the test's own: what is spoken is recorded, start and end are fired on demand
const STUB = () => {
    const T = { said: [], now: null, hiss: 0, hissMax: 0 }; window.__vmTest = T;
    window.SpeechSynthesisUtterance = class { constructor(t) { this.text = t; } };
    const engine = {
        getVoices: () => [{ lang: 'en-US', name: 'Test David' }, { lang: 'en-US', name: 'Test Samantha' }],
        speak(u) { T.said.push(u.text); T.now = u; },
        cancel() { const u = T.now; T.now = null; if (u && u.onerror) u.onerror({ error: 'interrupted' }); },
        pause() {}, resume() {}, addEventListener() {}, removeEventListener() {},
    };
    Object.defineProperty(window, 'speechSynthesis', { value: engine, configurable: true });
    T.start = () => { if (T.now && T.now.onstart) T.now.onstart({}); };
    T.end = () => { const u = T.now; T.now = null; if (u && u.onend) u.onend({}); };
    const node = () => ({ connect() {}, start() {}, stop() {}, frequency: {}, gain: {}, Q: {} });
    window.AudioContext = window.webkitAudioContext = class {
        constructor() { this.state = 'running'; this.sampleRate = 8000; this.currentTime = 0; this.destination = {}; }
        resume() { return Promise.resolve(); }
        createBuffer(c, n) { return { getChannelData: () => new Float32Array(n) }; }
        createOscillator() { return node(); } createGain() { return node(); } createBiquadFilter() { return node(); }
        createBufferSource() { return Object.assign(node(), { start() { T.hiss++; T.hissMax = Math.max(T.hissMax, T.hiss); }, stop() { T.hiss--; } }); }
    };
};

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => check(false, 'page error: ' + e.message));
    await page.addInitScript(STUB);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    // a trainee of this run's own: nothing played yet, nothing on their record
    await signIn(page, 'Seek', 'Vm' + String(Date.now()).slice(-7).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
    await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });

    const toCase = (n, block) => page.evaluate(([n, block]) => { const d = DAYS.find(d => d.cf && d.cf.n === n); goto('day', d.id); state.dayViewMode = 'slides';
        const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === block && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'case');
        if (k < 0) return false; goToSlide(k); return true; }, [n, block]);
    // the slide: its player, its type, its size
    const slideOf = (block) => page.evaluate((block) => {
        const w = document.getElementById('lessonSlideWrap'), card = w && w.querySelector(`[data-vm="${block}"]`); if (!card) return null;
        const has = s => !!card.querySelector(s), vis = e => e.getClientRects().length > 0;
        const small = [...w.querySelectorAll('*')].filter(e => vis(e) && [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim()))
            .map(e => { const c = getComputedStyle(e); return { t: e.textContent.trim().slice(0, 28), px: parseFloat(c.fontSize), w: Number(c.fontWeight) }; }).filter(x => x.px < 16 || x.w < 700);
        const zoom = [...w.querySelectorAll('*')].map(e => e.style.zoom).filter(z => z && Number(z) < 1);
        const body = w.querySelector('.cfx-body') || w, wr = w.getBoundingClientRect(), cr = card.getBoundingClientRect();
        const under = [...w.querySelectorAll('.cfx-np,.cfx-thumb')].map(e => e.getBoundingClientRect());
        const said = String((CM_CF_SIM.events[block] || {}).spoken || '').split(/(?<=[.?!,])\s+/).filter(x => x.split(/\s+/).length >= 4), text = w.innerText.replace(/\s+/g, ' ');
        return { parts: { play: has('.vmp .vmp-play'), back: has('.vmp .vmp-back'), fwd: has('.vmp .vmp-fwd'), bar: has('.vmp input[type=range].vmp-seek'), time: (card.querySelector('.vmp-time') || {}).innerText || '', over: has('.vmp .vmp-over'), ticks: card.querySelectorAll('.vmp-ticks i').length },
            head: card.innerText.replace(/\s+/g, ' '), small, zoom, cut: body.scrollHeight > body.clientHeight + 2 || cr.bottom > wr.bottom + 1 || under.some(r => r.bottom > wr.bottom + 1),
            wide: cr.width / wr.width, first: under.every(r => r.top >= cr.bottom - 1), under: under.length, words: said.filter(x => text.includes(x)) };
    }, block);
    // every player on the page: its button, its label, its bar, its status
    const players = () => page.evaluate((b) => [...document.querySelectorAll(`[data-vm="${b}"]`)].filter(e => e.getClientRects().length).map(e => ({
        where: e.closest('#cf-np') ? 'notes' : e.closest('#cf-vm') ? 'check' : 'slide', btn: e.querySelector('.vmp-play').textContent.trim(), el: e.querySelector('.vmp-el').textContent,
        time: e.querySelector('.vmp-time').innerText, bar: Number(e.querySelector('.vmp-seek').value), max: Number(e.querySelector('.vmp-seek').max), st: e.querySelector('.cfx-vm-st').textContent })), BLOCK);
    const T = () => page.evaluate(() => { const t = window.__vmTest; return { said: t.said.slice(), n: t.said.length, last: t.said[t.said.length - 1] || '', speaking: !!t.now, hiss: t.hiss, hissMax: t.hissMax }; });
    const fire = (what) => page.evaluate((what) => window.__vmTest[what](), what);
    const seek = (where, t) => page.evaluate(([where, t]) => { const el = document.querySelector(`${where} .vmp-seek`); el.value = String(t); el.dispatchEvent(new Event('input', { bubbles: true })); }, [where, t]);
    const plays = async () => { const m = /played (\d+)×/i.exec((await players())[0].st); return m ? Number(m[1]) : 0; };
    const clock = s => `${Math.floor(s / 60)}:${String(Math.floor(s) % 60).padStart(2, '0')}`;
    const secs = t => { const [m, s] = t.split(':').map(Number); return m * 60 + s; };
    // where a spoken phrase sits in the message, 0 to 1 (-1: not the caller's words)
    const spoken = (await page.evaluate((b) => CM_CF_SIM.events[b].spoken, BLOCK)).replace(/\.\.\./g, ',');
    const placeOf = (phrase) => { const i = spoken.indexOf(phrase); return i < 0 ? -1 : i / spoken.length; };
    const SLIDE = '#lessonSlideWrap', wait = (ms) => page.waitForTimeout(ms);

    // 1. the slide
    check(await toCase(1, BLOCK), "Day 1 has the voicemail activity's Your Case slide"); await wait(900);
    const s1 = await slideOf(BLOCK);
    check(!!s1, 'the slide carries the voicemail');
    if (!s1) { await browser.close(); console.log(`\n${failures.length} failure(s).`); process.exit(1); }
    check(s1.parts.play && s1.parts.back && s1.parts.fwd && s1.parts.bar && s1.parts.over, `it is a player: ▶ Play, ⏪ 5s, ⏩ 5s, a seek bar, ↺ Start over (${JSON.stringify(s1.parts)})`);
    check(/^0:00 \/ \d:\d\d$/.test(s1.parts.time.trim()), `with the elapsed and total time as m:ss ("${s1.parts.time.trim()}")`);
    check(s1.parts.ticks > 8, `and a mark on the bar at each phrase (${s1.parts.ticks})`);
    check(/Northgate Distribution/.test(s1.head) && /02\/10\/2026/.test(s1.head) && /8:47/.test(s1.head) && /Not played yet/.test(s1.head), 'it says who the message is from, its date and time, and that it has not been played');
    check(s1.wide > 0.9 && s1.first && s1.under === 1, `the voicemail is first, across the slide, with the Notes & Action Plan under it (${Math.round(s1.wide * 100)}% wide)`);
    check(!s1.small.length, `nothing on the slide is under 16px or less than bold: ${JSON.stringify(s1.small.slice(0, 4))}`);
    check(!s1.zoom.length && !s1.cut, `the slide fits 1366x768 at full size (zoom ${s1.zoom.join(',') || 'none'}, cut off: ${s1.cut})`);
    check(!s1.words.length, `no words of the message are on the slide: ${JSON.stringify(s1.words.slice(0, 2))}`);
    const total = secs(s1.parts.time.split('/')[1].trim());

    // 2. play: the voicemail box, then the caller from his first words
    await page.click(`${SLIDE} .vmp-play`); await wait(250);
    let t = await T(), p = await players();
    check(t.n === 1 && /^You have one new message/.test(t.said[0]), `▶ Play speaks the first phrase: "${(t.said[0] || '').slice(0, 40)}"`);
    check(/Pause/.test(p[0].btn) && /Playing/.test(p[0].st), `the button is ⏸ Pause and it says it is playing ("${p[0].btn}", "${p[0].st}")`);
    check(await plays() === 1, `that is one play (${await plays()})`);
    await fire('start'); await fire('end'); await wait(1300);   // the tone
    t = await T();
    check(t.n === 2 && spoken.startsWith(t.last) && t.last.split(/\s+/).length <= 12, `then the caller, from his first words, in a short phrase: "${t.last}"`);
    check(t.hiss === 1, `over one line hiss (${t.hiss})`);
    await fire('start'); await wait(700);
    p = await players();
    check(p[0].bar > 5 && p[0].el === clock(p[0].bar), `the time moves while it plays, and the label and the bar agree (${p[0].el}, bar ${p[0].bar})`);

    // 3. pause keeps the place; play goes on from the same phrase; Start over
    const before = t.last;
    await page.click(`${SLIDE} .vmp-play`); await wait(200);
    t = await T(); p = await players();
    const kept = p[0].bar;
    check(/Play/.test(p[0].btn) && /Paused at/.test(p[0].st) && !t.speaking && t.hiss === 0, `⏸ Pause stops the voice and the hiss ("${p[0].btn}", "${p[0].st}", hiss ${t.hiss})`);
    await wait(500);
    check((await players())[0].bar === kept && kept > 5, `and keeps the place (${kept}s)`);
    await page.click(`${SLIDE} .vmp-play`); await wait(250);
    t = await T();
    check(t.n === 3 && t.last === before, `▶ goes on from the same phrase: "${t.last}"`);
    check(await plays() === 1, `a pause and resume is the same play (${await plays()})`);
    await page.click(`${SLIDE} .vmp-play`); await wait(150);   // pause
    await page.click(`${SLIDE} .vmp-over`); await wait(150);
    p = await players();
    check(p[0].el === '0:00' && p[0].bar === 0 && /Played 1×/.test(p[0].st), `↺ Start over goes back to 0:00 (${p[0].el}, "${p[0].st}")`);

    // 4. stopped: a seek to about half way is silent; play speaks the phrase there, not the beginning
    const half = Math.round(total / 2), n0 = (await T()).n;
    await seek(SLIDE, half); await wait(350);
    t = await T(); p = await players();
    check(t.n === n0 && !t.speaking, 'a seek while it is stopped speaks nothing');
    check(p[0].el === clock(half) && Math.abs(p[0].bar - half) < 0.2 && await plays() === 1, `the place moves to ${clock(half)} and it is not a play (${p[0].el}, bar ${p[0].bar}, played ${await plays()}×)`);
    await page.click(`${SLIDE} .vmp-play`); await wait(250);
    t = await T(); p = await players();
    const mid = placeOf(t.last);
    check(t.n === n0 + 1 && mid > 0.25 && mid < 0.65, `▶ then speaks the phrase at that time, not the beginning: "${t.last}" (${Math.round(mid * 100)}% into the message)`);
    check(secs(p[0].el) <= half && secs(p[0].el) >= half - 6 && p[0].el === clock(p[0].bar), `the clock is set to the start of that phrase (${p[0].el}), label and bar together`);
    check(await plays() === 2, `a play started from stopped is counted (${await plays()})`);
    await fire('start');

    // 5. ⏪ 5s and ⏩ 5s, while it plays
    const at0 = p[0].bar;
    await page.click(`${SLIDE} .vmp-back`); await wait(350);
    t = await T(); p = await players();
    const back = placeOf(t.last);
    check(back >= 0 && back < mid && p[0].bar < at0 && p[0].bar >= at0 - 10, `⏪ 5s goes back and speaks from there: "${t.last}" (${at0.toFixed(1)}s to ${p[0].bar.toFixed(1)}s)`);
    check(/Pause/.test(p[0].btn) && t.speaking, 'and keeps playing');
    await fire('start');
    await page.click(`${SLIDE} .vmp-fwd`); await wait(350);
    t = await T(); p = await players();
    check(placeOf(t.last) > back && p[0].bar > at0 - 10, `⏩ 5s goes on to a later phrase: "${t.last}"`);
    // a seek while it plays: it jumps and keeps playing
    await seek(SLIDE, 12); await wait(350);
    t = await T(); p = await players();
    check(t.speaking && /Pause/.test(p[0].btn) && placeOf(t.last) >= 0 && placeOf(t.last) < 0.3 && secs(p[0].el) <= 12, `a seek while it plays jumps and keeps playing: "${t.last}" at ${p[0].el}`);
    check(await plays() === 2 && t.hiss === 1 && t.hissMax === 1, `none of that is a new play, and the hiss never runs twice (played ${await plays()}×, hiss ${t.hiss}, most at once ${t.hissMax})`);

    // 8. the Notes & Action Plan and the Listening Check: the same player, in the same state
    await fire('start');
    await page.evaluate((b) => cmCaseFlow.notes(b), BLOCK); await page.waitForSelector('#cf-np .vmp'); await wait(300);
    p = await players();
    const notes = p.find(x => x.where === 'notes'), slide = p.find(x => x.where === 'slide');
    check(!!notes && /Pause/.test(notes.btn) && notes.time.trim() === slide.time.trim() && notes.max === total, `the Notes & Action Plan has the player, playing, at the same time as the slide (${notes && notes.time.trim()})`);
    check(p.every(x => x.el === clock(x.bar)), `the label and the bar agree in every player: ${p.map(x => `${x.where} ${x.el}/${x.bar}`).join(', ')}`);
    await seek('#cf-np', half); await wait(350);
    t = await T(); p = await players();
    check(placeOf(t.last) > 0.25 && p.every(x => x.el === p[0].el && secs(x.el) > 12), `its bar seeks, and the slide's player follows: "${t.last}" (${p.map(x => x.el).join(', ')})`);
    await page.click('#cf-np .vmp-play'); await wait(200);
    p = await players();
    check(p.length === 2 && p.every(x => /Play/.test(x.btn) && /Paused at/.test(x.st)), `paused there, both say so (${p.map(x => x.btn).join(', ')})`);
    check(await page.locator('#cf-np button[onclick*="vmPlay"]').count() === 1, 'and it is the only play button there (the old play-from-the-top button is gone)');
    await page.keyboard.press('Escape'); await wait(400);
    await page.evaluate((b) => cmCaseFlow.listen(b), BLOCK); await page.waitForSelector('#cf-vm .vmp'); await wait(200);
    p = await players();
    const lc = p.find(x => x.where === 'check');
    check(!!lc && /Play/.test(lc.btn) && /Paused at/.test(lc.st) && lc.el === p.find(x => x.where === 'slide').el, `the Listening Check has the player, paused at the same place (${lc && lc.el})`);
    const n1 = (await T()).n;
    await page.click('#cf-vm .vmp-play'); await wait(250);
    t = await T(); p = await players();
    check(t.n === n1 + 1 && placeOf(t.last) > 0.25 && p.every(x => /Pause/.test(x.btn)), `▶ there resumes from the place, in both (${p.map(x => x.btn).join(', ')})`);
    check(await plays() === 2, `still the same play (${await plays()})`);

    // 9. a hidden tab pauses; the end of the message stops; the hiss is off
    await page.evaluate(() => { Object.defineProperty(document, 'hidden', { get: () => true, configurable: true }); document.dispatchEvent(new Event('visibilitychange')); });
    await wait(200);
    t = await T(); p = await players();
    check(!t.speaking && t.hiss === 0 && p.every(x => /Play/.test(x.btn)), 'a hidden tab pauses it');
    await page.evaluate(() => { delete document.hidden; document.dispatchEvent(new Event('visibilitychange')); });
    await page.click('#cf-vm .vmp-play'); await wait(250);
    await seek('#cf-vm', total - 0.3); await wait(350);
    t = await T();
    check(/^End of message/.test(t.last), `a seek to the end speaks the end of the message: "${t.last}"`);
    await fire('start'); await fire('end'); await wait(250);
    t = await T(); p = await players();
    check(!t.speaking && t.hiss === 0 && p.every(x => /Play/.test(x.btn) && x.el === '0:00' && /Played 2×/.test(x.st)), `at the end it stops, back at 0:00, played 2× (${p.map(x => `${x.el} "${x.st}"`).join(', ')})`);
    await page.click('#cf-vm .vmp-play'); await wait(250);
    check(await plays() === 3, `and the next ▶ is a new play (${await plays()})`);
    await page.click('#cf-vm .vmp-play'); await wait(150);
    await page.evaluate(() => cmCaseFlow.listenClose());
    const kept2 = await page.evaluate(async (b) => { await new Promise(r => setTimeout(r, 900)); return (((await storeGet('case-flow')) || {}).listen || {})[b]; }, BLOCK);
    check(kept2 && kept2.plays === 3, `the count is what is on the trainee's record (${kept2 && kept2.plays})`);

    // 10. Day 2's voicemail, as a trainer presents it
    await page.evaluate(() => { state.isAdmin = true; });
    check(await toCase(2, 'd2m2-a3'), "Day 2 has its voicemail activity's Your Case slide"); await wait(1200);
    const s2 = await slideOf('d2m2-a3');
    check(!!s2 && s2.parts.play && s2.parts.bar && s2.parts.back && s2.parts.over, 'with the player');
    check(!!s2 && !s2.small.length, `nothing on it under 16px or less than bold: ${JSON.stringify(s2 ? s2.small.slice(0, 4) : [])}`);
    check(!!s2 && !s2.zoom.length && !s2.cut && s2.first, `and it fits 1366x768 at full size, the voicemail first (zoom ${s2 ? s2.zoom.join(',') || 'none' : '?'}, cut off: ${s2 && s2.cut})`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s).`); process.exit(1); }
    console.log('\nAll good: the voicemail plays, pauses, goes back 5 seconds and seeks to a place, in all three players, and a play is counted once.');
})().catch(e => { console.error(e); process.exit(1); });
