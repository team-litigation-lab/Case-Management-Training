// Topic dividers: every topic opens with a divider slide (Day · section, Topic N of M, the title).
//   - every day has one divider per topic, straight before the topic's Part 1;
//   - every divider fits on one page at 1280x720 and shows its number and section;
//   - Presenter view's cue names the topic;
//   - a trainee's saved place (from before the dividers, and from before the topics were regrouped)
//     reopens on the same slide, and "furthest reached" moves with it.
// Usage: node .github/scripts/dividers.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs `npm i playwright`)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
    const failures = [], fail = (m) => failures.push(m);
    const sleep = (ms) => new Promise(r => setTimeout(r, ms));
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
    await page.fill('#loginFirstInput', 'Divider'); await page.fill('#loginLastInput', 'Test'); await page.fill('#loginBatchInput', 'CIDV');
    await page.click('#loginSubmitBtn'); await sleep(1200);
    await page.evaluate(async () => {   // approve the trainee, as the admin screen does
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await sleep(1500);

    // placement
    const placement = await page.evaluate(() => DAYS.map(d => {
        const s = buildDaySlides(d), bad = [];
        const divs = s.map((x, i) => [x, i]).filter(([x]) => x.type === 'divider');
        if (divs.length !== d.lessons.length) bad.push(`${divs.length} dividers for ${d.lessons.length} topics`);
        divs.forEach(([x, i]) => { const n = s[i + 1]; if (!n || n.type !== 'topic' || n.lessonIndex !== x.lessonIndex || n.part !== 1) bad.push(`divider ${x.lessonIndex + 1} isn't followed by its Part 1`); });
        return { day: d.id, topics: d.lessons.length, slides: s.length, bad };
    }));
    placement.forEach(p => p.bad.forEach(b => fail(`Day ${p.day}: ${b}`)));

    // every divider on one page, with its number and section, and a presenter cue
    const fit = await page.evaluate(async () => {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        state.isAdmin = true;
        const out = [];
        for (const d of DAYS) {
            goto('day', d.id); state.dayViewMode = 'slides'; await sleep(20);
            const s = buildDaySlides(d);
            for (let i = 0; i < s.length; i++) {
                if (s[i].type !== 'divider') continue;
                state.lessonSlide = i; render(); await sleep(5);
                const el = document.querySelector('#lessonSlideWrap .topic-divider');
                const l = d.lessons[s[i].lessonIndex], n = s[i].lessonIndex + 1;
                const text = el ? el.textContent.replace(/\s+/g, ' ') : '';
                const cue = presenterCues(d, s[i]);
                if (!el) out.push(`Day ${d.id} topic ${n}: no divider drawn`);
                else {
                    if (!text.includes(`Topic ${n} of ${d.lessons.length}`) || (l.section && !text.includes(l.section)) || !text.includes(l.h)) out.push(`Day ${d.id} topic ${n}: divider text "${text.slice(0, 120)}"`);
                    if ((state.slidePages || 1) !== 1) out.push(`Day ${d.id} topic ${n}: the divider needs ${state.slidePages} pages at 1280x720`);
                }
                if (!cue.includes(`Topic ${n} of ${d.lessons.length}`)) out.push(`Day ${d.id} topic ${n}: Presenter view has no cue for the divider`);
            }
        }
        state.isAdmin = false;
        return out;
    });
    fit.forEach(fail);

    // saved places move to the same slide
    const plan = await page.evaluate(async () => {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const keyOf = (dd, x) => x ? `${x.type}|${x.lessonIndex != null ? dd.lessons[x.lessonIndex].h : ''}|${x.part || ''}` : '';
        // Day 2: saved after the topics were regrouped, before the dividers
        const d2 = DAYS.find(d => d.id === 2), old2 = buildDaySlides(Object.assign({}, d2, { noDividers: true }));
        const last2 = old2.findIndex(x => x.type === 'topic' && x.lessonIndex === 4 && x.part === 2), far2 = last2 + 5;
        // Day 1: saved before the topics were regrouped (old order, no dividers)
        const d1 = DAYS.find(d => d.id === 1), byTitle = Object.fromEntries(d1.lessons.map(l => [l.h, l]));
        const oldLessons = DAY_OLD_ORDER[1].map(h => byTitle[h]).filter(Boolean).concat(d1.lessons.filter(l => !DAY_OLD_ORDER[1].includes(l.h)));
        const oldQC = (d1.quickChecks || []).map(q => Object.assign({}, q, { afterIndex: oldLessons.indexOf(d1.lessons[q.afterIndex]) }));
        const oldD1 = Object.assign({}, d1, { lessons: oldLessons, quickChecks: oldQC, noDividers: true });
        const old1 = buildDaySlides(oldD1);
        const last1 = old1.findIndex(x => x.type === 'topic' && oldLessons[x.lessonIndex].h === 'Case Acceptance Determination' && x.part === 2);
        await storeSet('last-slide', { 1: last1, 2: last2 });
        await storeSet('slide-progress', { 1: last1, 2: far2 });
        await storeSet('day-order-migrated', { 2: true, 3: true, 4: true, 5: true });
        await storeSet('dividers-migrated', {});
        await sleep(2500);   // let the cloud copy save too
        return { want: { 1: keyOf(oldD1, old1[last1]), 2: keyOf(Object.assign({}, d2, { noDividers: true }), old2[last2]), far2: keyOf(Object.assign({}, d2, { noDividers: true }), old2[far2]) }, last1, last2, far2 };
    });
    await page.reload({ waitUntil: 'load' }); await sleep(2000);
    const after = await page.evaluate(() => {
        const keyOf = (dd, x) => x ? `${x.type}|${x.lessonIndex != null ? dd.lessons[x.lessonIndex].h : ''}|${x.part || ''}` : '';
        const d1 = DAYS.find(d => d.id === 1), d2 = DAYS.find(d => d.id === 2), s1 = buildDaySlides(d1), s2 = buildDaySlides(d2);
        return { ls: state.lastSlide, sp: state.slideProgress, k1: keyOf(d1, s1[state.lastSlide[1]]), k2: keyOf(d2, s2[state.lastSlide[2]]), kfar2: keyOf(d2, s2[state.slideProgress[2]]), flags: state.dividersMigrated };
    });
    if (after.k2 !== plan.want[2]) fail(`Day 2's saved place (${plan.want[2]}, old slide ${plan.last2 + 1}) reopens on ${after.k2} (slide ${after.ls[2] + 1})`);
    if (after.kfar2 !== plan.want.far2) fail(`Day 2's "furthest reached" (${plan.want.far2}) moved to ${after.kfar2}`);
    if (after.k1 !== plan.want[1]) fail(`Day 1's saved place from before the regrouping (${plan.want[1]}) reopens on ${after.k1}`);
    if (!after.flags || ![1, 2, 3, 4, 5].every(d => after.flags[d])) fail(`the move isn't recorded as done: ${JSON.stringify(after.flags)}`);
    // it happens once: a second load leaves the places alone
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const again = await page.evaluate(() => ({ 1: state.lastSlide[1], 2: state.lastSlide[2] }));
    if (again[1] !== after.ls[1] || again[2] !== after.ls[2]) fail(`the saved places moved again on the next load (${JSON.stringify(after.ls)} → ${JSON.stringify(again)})`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.slice(0, 40).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Topic dividers test passed: ${placement.map(p => `Day ${p.day} ${p.topics} dividers / ${p.slides} slides`).join(', ')}.`);
})().catch(e => { console.error(e); process.exit(1); });
