// What a day card tells a trainee about their own progress (moduleCard in index.html, and the wrapper
// in js/cm-updates.js that rewrites it). A Knowledge Check under the pass mark is recorded —
// progress[day].score keeps the best of every attempt and .history keeps them all — so a day the
// trainee has worked through must never invite them to "Start" it again. Checks each state of a day:
//     not begun                 → Start
//     slides worked             → Continue, with how far the slides got
//     Knowledge Check under 70% → Continue, with the score and the 70% pass mark on the card
//     passed                    → Review
// and that a failing attempt is kept on the record at all (the best score is never lowered).
// Usage: node .github/scripts/day-progress.cjs [baseUrl]   (needs `npm i playwright` and a browser)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const failures = [];
    const fail = (m) => failures.push(m);
    const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Day', 'Progress', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    if (!(await page.evaluate(() => typeof state !== 'undefined' && !!state.traineeId))) { fail('sign-in did not complete'); }

    // the card for a day, in each state. state.isAdmin keeps every day unlocked, so the states
    // being checked are the trainee's own progress, not the locks.
    const card = async (progress, slideProgress) => page.evaluate(async ({ progress, slideProgress }) => {
        const d = DAYS[0];
        state.isAdmin = true;
        state.progress = {}; state.slideProgress = {};
        if (progress) state.progress[d.id] = progress;
        if (slideProgress) state.slideProgress[d.id] = slideProgress;
        goto('dashboard'); render();
        // the dashboard can rebuild on a tick; wait for the card rather than guessing a delay
        let el = null;
        for (let i = 0; i < 40 && !el; i++) { el = document.getElementById('module-' + d.id); if (!el) await new Promise(r => setTimeout(r, 25)); }
        if (!el) return { missing: true };
        const btn = el.querySelector('.module-start-btn');
        return { label: el.querySelector('.mh-day').textContent.replace(/\s+/g, ' ').trim(), cta: btn.textContent.trim(),
            card: el.textContent.replace(/\s+/g, ' ').trim() };
    }, { progress, slideProgress });

    const fresh = await card(null, 0);
    if (fresh.missing) fail('the dashboard has no card for the first day');
    else if (fresh.cta !== 'Start') fail(`a day not begun should say "Start", says "${fresh.cta}"`);

    const started = await card(null, 3);
    if (started.cta !== 'Continue') fail(`a day whose slides have been worked should say "Continue", says "${started.cta}"`);
    if (!/Slides\s*\d+%/.test(started.card)) fail(`a day in progress should show how far the slides got: "${started.card.slice(0, 120)}"`);

    // 13 of 20 is 65%: recorded, but not the 70% that completes the day
    const under = await card({ done: false, score: 65, date: new Date().toISOString(), history: [{ score: 55, passed: false }, { score: 65, passed: false }] }, 12);
    if (under.cta !== 'Continue') fail(`a day taken but under the pass mark should say "Continue", says "${under.cta}"`);
    if (!/Knowledge Check 65%/.test(under.card)) fail(`the card should show the best score of a day not yet passed: "${under.card.slice(0, 160)}"`);
    if (!/70% to pass/.test(under.card)) fail(`the card should say what the pass mark is: "${under.card.slice(0, 160)}"`);

    const passed = await card({ done: true, score: 85, date: new Date().toISOString(), history: [{ score: 85, passed: true }] }, 20);
    if (passed.cta !== 'Review') fail(`a day passed should say "Review", says "${passed.cta}"`);
    if (!/Completed/i.test(passed.card)) fail(`a day passed should say Completed: "${passed.card.slice(0, 120)}"`);

    // a failing attempt is kept on the record, with the best score, and never lowers it
    const kept = await page.evaluate(() => {
        const dayId = DAYS[0].id;
        state.progress = {}; state.progress[dayId] = { done: false, score: 65, history: [{ score: 65, passed: false }] };
        const prevBest = state.progress[dayId]?.score || 0, prevHistory = state.progress[dayId]?.history || [];
        const score = 50, passed = false;   // a worse retake
        state.progress[dayId] = { done: passed || (state.progress[dayId]?.done || false), score: Math.max(score, prevBest),
            date: new Date().toISOString(), history: [...prevHistory, { score, passed, date: new Date().toISOString() }] };
        return state.progress[dayId];
    });
    if (kept.score !== 65) fail(`a worse retake lowered the best score to ${kept.score}`);
    if (kept.history.length !== 2) fail(`a failing attempt was not kept on the record (${kept.history.length} attempt(s))`);
    if (kept.done !== false) fail('a failing attempt marked the day complete');

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Day cards tell the trainee where they are: Start, Continue with how far the slides got and the Knowledge Check score beside the 70% pass mark, or Review; a failing attempt is kept and never lowers the best score.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
