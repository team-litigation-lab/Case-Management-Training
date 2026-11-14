// @check browser — Every day card in Day 1's format: Start/Continue/Review, then 👁 Review Score | 🔁 Retake, then a bigger ▶ Video
// Every Case Flow day card ends in the same buttons, whatever the day's state (js/cm-day-card-format.js):
//   row 1  Start · Continue · Review              full width
//   row 2  👁 Review Score | 🔁 Retake             side by side
//   row 3  ▶ Video (🔒 Video until unlocked; "🔒 Video · coming soon" for a day with no video yet), full width and bigger
// and no ✓ Finish Training (the Knowledge Check opens from the day's last slide). Checked for a trainee, on a day not begun,
// a day passed and a day with no video, at 1366×768 and 1920×1080, with the cards inside the page's width.
// Usage: node .github/scripts/day-card-format.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Dee', 'Cardformat', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);

    const look = () => page.evaluate(async () => {
        goto('dashboard'); render();
        await new Promise(r => setTimeout(r, 300));
        return DAYS.filter(d => d.cf).map(d => {
            const c = document.getElementById('module-' + d.id); if (!c) return { id: d.id, missing: true };
            const g = c.querySelector('.mc-grid'), bs = g ? [...g.children].filter(x => x.tagName === 'BUTTON') : [];
            const box = x => x.getBoundingClientRect(), gw = g ? box(g).width : 0;
            return { id: d.id, n: d.cf.n, labels: bs.map(b => b.textContent.replace(/\s+/g, ' ').trim()), widths: bs.map(b => Math.round(box(b).width)), gw: Math.round(gw),
                tops: bs.map(b => Math.round(box(b).top)), fonts: bs.map(b => parseFloat(getComputedStyle(b).fontSize)), heights: bs.map(b => Math.round(box(b).height)),
                finish: /Finish Training/.test(c.textContent), right: Math.round(box(c).right) };
        });
    });
    const checkCards = (cards, when) => {
        cards.forEach(c => {
            if (c.missing) return fail(`${when}: no card for day ${c.id}`);
            const [start, score, retake, video] = c.labels;
            if (c.labels.length !== 4) return fail(`${when}, Case Flow Day ${c.n}: the card should have 4 buttons (Start, Review Score, Retake, Video): ${JSON.stringify(c.labels)}`);
            if (!/^(Start|Continue|Review|🔒 Start)$/.test(start)) fail(`${when}, Day ${c.n}: the first button should be Start, Continue or Review: "${start}"`);
            if (!/👁 Review Score/.test(score) || !/🔁 Retake/.test(retake)) fail(`${when}, Day ${c.n}: the second row should be 👁 Review Score | 🔁 Retake: ${JSON.stringify(c.labels)}`);
            if (!/Video/.test(video)) fail(`${when}, Day ${c.n}: the last button should be the Video: "${video}"`);
            if (c.finish) fail(`${when}, Day ${c.n}: ✓ Finish Training should be gone from the card`);
            if (c.tops[1] !== c.tops[2] || !(c.tops[1] > c.tops[0]) || !(c.tops[3] > c.tops[1])) fail(`${when}, Day ${c.n}: the rows should be Start / Review Score | Retake / Video: tops ${JSON.stringify(c.tops)}`);
            if (Math.abs(c.widths[0] - c.gw) > 2 || Math.abs(c.widths[3] - c.gw) > 2) fail(`${when}, Day ${c.n}: Start and Video should be full width (${c.gw}px): ${JSON.stringify(c.widths)}`);
            if (!(c.widths[1] < c.gw * 0.6 && c.widths[2] < c.gw * 0.6)) fail(`${when}, Day ${c.n}: Review Score and Retake should share a row: ${JSON.stringify(c.widths)}`);
            if (!(c.fonts[3] > c.fonts[1]) || !(c.heights[3] > c.heights[1])) fail(`${when}, Day ${c.n}: the Video should be bigger than the small buttons: fonts ${JSON.stringify(c.fonts)}, heights ${JSON.stringify(c.heights)}`);
        });
    };

    // a fresh trainee: nothing begun; every day has the same four buttons
    await page.evaluate(() => { state.progress = {}; state.slideProgress = {}; });
    const fresh = await look();
    checkCards(fresh, 'not begun');
    const videos = await page.evaluate(() => Object.keys(window.CM_DAY_VIDEOS || {}).map(Number));
    fresh.filter(c => !c.missing && !videos.includes(c.id)).forEach(c => { if (!/coming soon/i.test(c.labels[3] || '')) fail(`Case Flow Day ${c.n} has no video yet: it should show "🔒 Video · coming soon": "${c.labels[3]}"`); });

    // the first day passed: Review, with Review Score open and Retake locked
    await page.evaluate(() => { const d = DAYS.find(x => x.cf); state.progress = { [d.id]: { done: true, score: 90, date: new Date().toISOString(), history: [{ score: 90, passed: true }] } }; });
    const passed = await look();
    checkCards(passed, 'Day 1 passed');
    if (passed[0] && passed[0].labels[0] !== 'Review') fail(`a passed day should say Review: "${passed[0].labels[0]}"`);

    // 1920×1080: the same layout, the cards inside the page
    await page.setViewportSize({ width: 1920, height: 1080 }); await page.waitForTimeout(400);
    const big = await look();
    checkCards(big, '1920×1080');
    const over = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
    if (over > 2) fail(`the dashboard scrolls sideways by ${over}px`);
    await page.screenshot({ path: require('path').join(require('os').tmpdir(), 'day-card-format.png') }).catch(() => {});

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Every Case Flow day card has Day 1\'s format: Start/Continue/Review, 👁 Review Score | 🔁 Retake, and a full-width, bigger ▶ Video (🔒 Video · coming soon where there is none yet), with no ✓ Finish Training.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
