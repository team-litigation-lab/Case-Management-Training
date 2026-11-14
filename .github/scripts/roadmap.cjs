// @check browser — 🗺 Roadmap lists every day and its topics (in place of the day cards' ☰ Topics), and opens a reached topic
// 🗺 Roadmap (index.html openRoadmap): every day with its topics, as on Foundational Training, in place of each day
// card's ☰ Topics button. Checks, as a trainee part-way through Day 1:
//   - the day cards have no ☰ Topics button, and the dashboard has no 🗺 Roadmap pill (it opens from a slide);
//   - the roadmap lists every day, in order, with every one of its topics, numbered by day (Day 2's are 2.1, 2.2 …);
//   - a topic the trainee has reached opens its first slide; one not reached yet, or on a locked day, is 🔒 and doesn't;
//   - opened from a slide, it marks the topic being taught ("● here");
//   - a trainer can open any topic.
// Usage: node .github/scripts/roadmap.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Rory', 'Map' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
    await page.evaluate(async () => { const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) }); });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    // part-way through Day 1 (its first 40 slides)
    await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); state.slideProgress = Object.assign({}, state.slideProgress, { [DAYS[0].id]: 40 }); goto('dashboard'); render(); });
    await page.waitForTimeout(400);
    if (await page.locator('.module-topics-btn').count()) fail('a day card still has its ☰ Topics button (the roadmap lists the topics now)');
    // the dashboard has no 🗺 Roadmap pill (it opens from 🗺 Roadmap beside Next → on a slide, and the trainer's side)
    if (await page.locator('.dash-roadmap-btn').count()) fail('the dashboard should not have the 🗺 Roadmap pill');
    await page.evaluate(() => openRoadmap());
    await page.waitForSelector('.rmx-day', { timeout: 5000 }).catch(() => fail('🗺 Roadmap didn\'t open'));
    const map = await page.evaluate(() => {
        const days = [...document.querySelectorAll('.rmx-day')].map(s => ({ head: s.querySelector('.rmx-dayh').innerText, nums: [...s.querySelectorAll('li:not(.rmx-dk) .rmx-tn')].map(x => x.textContent),
            // (📑 Deck pages, js/cm-day-decks.js, are the day's deck topics: not lessons of the day)
            names: [...s.querySelectorAll('li:not(.rmx-dk) .rmx-tt')].map(x => x.textContent.trim()), enabled: [...s.querySelectorAll('li:not(.rmx-dk) .rmx-topic')].map(b => !b.disabled) }));
        const want = DAYS.map((d, i) => ({ n: (d.cf && d.cf.n) || i + 1, count: d.lessons.length, first: d.lessons[0] && (d.lessons[0].cf ? d.lessons[0].cf.block.title : d.lessons[0].h) }));
        const slides = buildDaySlides(DAYS[0]), firsts = {}; slides.forEach((x, k) => { if (x.lessonIndex != null && firsts[x.lessonIndex] == null) firsts[x.lessonIndex] = k; });
        return { days, want, firsts };
    });
    if (map.days.length !== map.want.length) fail(`the roadmap shows ${map.days.length} days, the course has ${map.want.length}`);
    map.want.forEach((w, i) => { const d = map.days[i]; if (!d) return;
        if (!new RegExp(`Day ${w.n}\\b`).test(d.head)) fail(`the roadmap's day ${i + 1} should be Day ${w.n}: "${d.head}"`);
        if (d.names.length !== w.count) fail(`Day ${w.n}: ${d.names.length} topics in the roadmap, ${w.count} in the day`);
        if (d.nums[0] !== `${w.n}.1` || d.nums[d.nums.length - 1] !== `${w.n}.${w.count}`) fail(`Day ${w.n}'s topics should be numbered ${w.n}.1 to ${w.n}.${w.count}: ${d.nums[0]} … ${d.nums[d.nums.length - 1]}`);
        if (!d.names[0].startsWith(w.first)) fail(`Day ${w.n}'s first topic should be "${w.first}": "${d.names[0]}"`); });
    // reached (first slide ≤ 40) opens; not reached is locked; other days (locked for this trainee) are locked
    const d1 = map.days[0];
    if (d1) Object.entries(map.firsts).forEach(([li, k]) => { const want = k <= 40; if (d1.enabled[li] !== want) fail(`Day 1 topic ${Number(li) + 1} (first slide ${k + 1}) should be ${want ? 'open' : '🔒'} for a trainee on slide 41`); });
    // a Learning Check (no slide of its own, asked in the Knowledge Check) stays 🔒 until the deck is seen
    if (d1) d1.enabled.forEach((on, li) => { if (map.firsts[li] == null && on) fail(`Day 1 topic ${li + 1} (a Learning Check) opens before the slides are done`); });
    if (map.days.slice(1).some(d => d.enabled.some(Boolean))) fail('a topic on a day the trainee hasn\'t opened is clickable');
    // a reached topic opens its first slide
    const li = Number(Object.entries(map.firsts).filter(([, k]) => k > 0 && k <= 40).pop()[0]);
    await page.click(`.rmx-day >> nth=0 >> .rmx-topic >> nth=${li}`); await page.waitForTimeout(700);
    const at = await page.evaluate(() => ({ view: state.view, day: state.dayId, slide: state.lessonSlide }));
    if (at.view !== 'day' || at.day !== (await page.evaluate(() => DAYS[0].id)) || at.slide !== map.firsts[li]) fail(`a topic should open its first slide (${map.firsts[li] + 1}): ${JSON.stringify(at)}`);
    // from the slides: the topic being taught is marked
    await page.click('.slide-nav .rm-next').catch(() => fail('no 🗺 Roadmap beside Next → on the slide'));
    await page.waitForTimeout(300);
    const here = await page.evaluate(() => { const o = document.querySelector('.rmx-topic.on .rmx-tn'); return o && o.textContent; });
    if (here !== `1.${li + 1}`) fail(`opened from a slide, the roadmap should mark topic 1.${li + 1} "● here": ${here}`);
    await page.evaluate(() => closeRoadmap());
    // a trainer: every topic opens
    await page.evaluate(() => { state.isAdmin = true; openRoadmap(); });
    const shut = await page.evaluate(() => document.querySelectorAll('.rmx-topic:disabled').length);
    if (shut) fail(`a trainer should be able to open every topic: ${shut} are locked`);
    // a Learning Check opens the day's Knowledge Check
    const kcAt = await page.evaluate(() => { const s = [...document.querySelectorAll('.rmx-day')][0], b = [...s.querySelectorAll('.rmx-topic')].pop(); b.click(); return b.innerText; });
    await page.waitForTimeout(500);
    const kcMode = await page.evaluate(() => state.dayViewMode);
    if (kcMode !== 'knowledgeCheck') fail(`a Learning Check topic ("${kcAt.replace(/\s+/g, ' ')}") should open the day's Knowledge Check: ${kcMode}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('🗺 Roadmap lists every day and all its topics (numbered by day), opens any topic a trainee has reached at its first slide, locks the rest, marks the topic being taught, and opens everything for a trainer; the day cards have no ☰ Topics button.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
