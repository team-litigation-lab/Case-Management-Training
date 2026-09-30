// Topic dividers: every topic opens with a divider slide (Day · section, Topic N of M, the title).
//   - every day has one divider per topic, straight before the topic's Part 1;
//   - every divider fits on one page at 1280x720 and shows its number and section;
//   - Presenter view's cue names the topic;
//   - a trainee's saved place from before the lessons were the decks' pages reopens on the page that
//     covers the same topic, "furthest reached" and Quick Check answers move with it, once.
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

    // saved places (from before the lessons were the decks' pages) move to the page that covers the same topic
    const plan = await page.evaluate(async () => {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const oldOf = d => Object.assign({}, d, {lessons: d.oldLessons, quickChecks: d.oldQuickChecks});
        cmDeckSetOff(true);
        const d1 = DAYS.find(d => d.id === 1), d2 = DAYS.find(d => d.id === 2);
        const old1 = buildDaySlides(oldOf(d1)), old2 = buildDaySlides(oldOf(d2));
        cmDeckSetOff(false);
        const at = (d, x) => buildDaySlides(d).findIndex(y => cmDeckPage(d, y) === d.cmDeck.pageOf[x.lessonIndex][x.type === 'topic' ? x.part : 1]);
        const last2 = old2.findIndex(x => x.type === 'topic' && x.lessonIndex === 4 && x.part === 2);
        const far2 = old2.findIndex((x, i) => i >= last2 + 5 && x.type === 'topic');
        const last1 = old1.findIndex(x => x.type === 'topic' && d1.oldLessons[x.lessonIndex].h === 'Case Acceptance Determination' && x.part === 2);
        // a Quick Check answer, keyed by the old topic position
        const q0 = d1.oldQuickChecks[0], nq0 = d1.quickChecks[0];
        await storeSet('day-order-migrated', { 1: true, 2: true, 3: true, 4: true, 5: true });
        await storeSet('dividers-migrated', { 1: true, 2: true, 3: true, 4: true, 5: true });
        await storeSet('last-slide', { 1: last1, 2: last2 });
        await storeSet('slide-progress', { 1: last1, 2: far2 });
        await storeSet('quick-check-answers', { [`1_${q0.afterIndex}_0`]: { picked: 2, checked: true } });
        await sleep(2500);   // let the cloud copy save too
        return { want: { 1: at(d1, old1[last1]), 2: at(d2, old2[last2]), far2: at(d2, old2[far2]), qa: `1_${nq0.afterIndex}_0` }, last1, last2, far2, oldQa: `1_${q0.afterIndex}_0` };
    });
    await page.reload({ waitUntil: 'load' }); await sleep(2000);
    const after = await page.evaluate(() => ({ ls: state.lastSlide, sp: state.slideProgress, qa: state.qcAnswers || {} }));
    if (after.ls[2] !== plan.want[2]) fail(`Day 2's saved place (old slide ${plan.last2 + 1}) reopens on slide ${after.ls[2] + 1}, not ${plan.want[2] + 1} (the page that covers it)`);
    if (after.sp[2] !== plan.want.far2) fail(`Day 2's "furthest reached" (old slide ${plan.far2 + 1}) moved to slide ${after.sp[2] + 1}, not ${plan.want.far2 + 1}`);
    if (after.ls[1] !== plan.want[1]) fail(`Day 1's saved place ("Case Acceptance Determination") reopens on slide ${after.ls[1] + 1}, not ${plan.want[1] + 1}`);
    if (!after.ls._cmDecks || !after.sp._cmDecks) fail(`the move isn't recorded as done`);
    if (!after.qa[plan.want.qa] || after.qa[plan.want.qa].picked !== 2 || (plan.oldQa !== plan.want.qa && after.qa[plan.oldQa])) fail(`the Quick Check answer didn't move from ${plan.oldQa} to ${plan.want.qa}: ${JSON.stringify(after.qa)}`);
    // it happens once: a second load leaves the places alone
    await page.reload({ waitUntil: 'load' }); await sleep(1500);
    const again = await page.evaluate(() => ({ 1: state.lastSlide[1], 2: state.lastSlide[2] }));
    if (again[1] !== after.ls[1] || again[2] !== after.ls[2]) fail(`the saved places moved again on the next load (${JSON.stringify(after.ls)} → ${JSON.stringify(again)})`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.slice(0, 40).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Topic dividers test passed: ${placement.map(p => `Day ${p.day} ${p.topics} dividers / ${p.slides} slides`).join(', ')}.`);
})().catch(e => { console.error(e); process.exit(1); });
