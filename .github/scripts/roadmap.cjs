// @check browser — 🗺 Roadmap lists every day and its topics (in place of the day cards' ☰ Topics), Part 2 as the daily loop's steps in order, numbered as shown, and opens a reached topic
// 🗺 Roadmap (index.html openRoadmap, js/cm-flow-parts.js labelRoadmap): every day with its topics, as on Foundational
// Training, in place of each day card's ☰ Topics button. Checks, as a trainee part-way through Day 1:
//   - the day cards have no ☰ Topics button, and the dashboard has no 🗺 Roadmap pill (it opens from a slide);
//   - the roadmap lists every day, in order, with every one of its topics, numbered by day in the order they are SHOWN
//     (Day 3's 3.9 comes after 3.8: the Skill Building is numbered where it sits, not where the sequence lists it);
//   - Part 1 · Lessons is the day's lessons; Part 2 · 🔁 The Daily Loop is the loop's real steps, in order, each a row:
//     👋 Meet John Doe / 📇 Case Profile Check-In → 🎯 the Skill Building (Day 5: 🏗 Build Your Companion Case) →
//     📁 Backup File Maintenance (Required) → 📝 Update Your Action Plan → "Optional side exercises (N)", one collapsible
//     group holding every other activity → ✅ Ready for the Knowledge Check? → the ✍️ Learning Checks; the Part 2 band
//     names the Action Plan and the required Backup File Maintenance;
//   - a topic the trainee has reached opens its first slide; one not reached yet, or on a locked day, is 🔒 and doesn't;
//     a loop step row (the Action Plan) opens its own slide;
//   - opened from a slide, it marks the topic being taught ("● here");
//   - a trainer can open any topic;
//   - the pop-up fits the screen at 1366×768 and 1920×1080 (no sideways scroll, the box inside the window).
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
    if (await page.locator('.dash-roadmap-btn').count()) fail('the dashboard should not have the 🗺 Roadmap pill');
    await page.evaluate(() => openRoadmap());
    await page.waitForSelector('.rmx-day', { timeout: 5000 }).catch(() => fail('🗺 Roadmap didn\'t open'));
    const map = await page.evaluate(() => {
        const title = l => (l.cf && l.cf.block ? l.cf.block.title : String(l.h || '').replace(/^\d+\.\d+\s+/, ''));
        const days = [...document.querySelectorAll('.rmx-day')].map((s, i) => {
            const d = DAYS[i], ol = s.querySelector('.rmx-topics');
            const topics = [...s.querySelectorAll('.rmx-topic')].map(b => ({ num: b.querySelector('.rmx-tn').textContent, name: b.querySelector('.rmx-tt').textContent.trim(), enabled: !b.disabled }));
            // the rows of the day, top to bottom: P:label, S:step (its icon), T:topic (its lesson's kind and role), G:the side group
            const rows = [...ol.children].map(li => li.classList.contains('rmx-part') ? 'P:' + li.textContent.replace(/\s+/g, ' ').trim()
                : li.classList.contains('rmx-steprow') ? 'S:' + li.querySelector('.rmx-si').textContent.trim()
                : li.classList.contains('rmx-sides') ? `G:${li.querySelectorAll('.rmx-subtopics .rmx-topic').length}:${!!li.querySelector('details')}:${li.querySelector('summary').textContent.trim()}`
                : 'T:' + (/🎯 Skill Building/.test(li.textContent) ? 'main' : /📁 Required/.test(li.textContent) ? 'drive' : '') + ':' + li.querySelector('.rmx-tt').textContent.trim());
            const seq = (window.CM_CASE_FLOW.sequence || []).find(x => d.cf && x.n === d.cf.n) || {};
            const by = k => d.lessons.map((l, li) => li).filter(li => d.lessons[li].cf.block.kind === k);
            const acts = by('activity'), mi = d.lessons.findIndex(l => l.cf.block.id === seq.main), di = d.lessons.findIndex(l => l.cf.block.id === seq.drive);
            const order = by('lesson').concat(mi >= 0 ? [mi] : [], di >= 0 ? [di] : [], acts.filter(x => x !== mi && x !== di), by('check'));   // the order shown
            return { head: s.querySelector('.rmx-dayh').innerText, topics, rows, order, titles: order.map(li => title(d.lessons[li])),
                n: d.cf.n, count: d.lessons.length, build: !!d.cf.build, main: mi >= 0 ? title(d.lessons[mi]) : '', drive: di >= 0 ? title(d.lessons[di]) : '', sides: acts.length - (mi >= 0) - (di >= 0) };
        });
        const slides = buildDaySlides(DAYS[0]), firsts = {}; slides.forEach((x, k) => { if (x.lessonIndex != null && firsts[x.lessonIndex] == null) firsts[x.lessonIndex] = k; });
        return { days, firsts, plan1: slides.findIndex(x => x.type === 'actionPlan') };
    });
    if (map.days.length !== 5) fail(`the roadmap shows ${map.days.length} days, the course has 5`);
    map.days.forEach(d => { const L = `Day ${d.n}`;
        if (!new RegExp(`Day ${d.n}\\b`).test(d.head)) fail(`the roadmap's day should be Day ${d.n}: "${d.head}"`);
        if (d.topics.length !== d.count) fail(`${L}: ${d.topics.length} topics in the roadmap, ${d.count} in the day`);
        // numbered in the order shown, 1 to N, no gaps
        const nums = d.topics.map(t => t.num), want = d.topics.map((t, k) => `${d.n}.${k + 1}`);
        if (nums.join() !== want.join()) fail(`${L}'s topics should be numbered ${d.n}.1 to ${d.n}.${d.count} in the order shown: ${nums.join(' ')}`);
        // in the loop's order: the lessons, the Skill Building, the Backup File Maintenance, the side exercises, the Learning Checks
        d.topics.forEach((t, k) => { if (!t.name.startsWith(d.titles[k])) fail(`${L}: topic ${t.num} should be "${d.titles[k]}": "${t.name}"`); });
        // Part 1, then Part 2 as the loop's steps
        const r = d.rows, p1 = r.findIndex(x => /^P:Part 1/.test(x)), p2 = r.findIndex(x => /^P:Part 2/.test(x)), pk = r.findIndex(x => /^P:.*Knowledge Check/.test(x));
        if (p1 !== 0) fail(`${L}: "Part 1 · Lessons" should head the day's topics`);
        if (p2 < 0) { fail(`${L}: no "Part 2 · 🔁 The Daily Loop" band`); return; }
        if (r.slice(p1 + 1, p2).some(x => !/^T::/.test(x))) fail(`${L}: Part 1 should hold the lessons only: ${r.slice(p1 + 1, p2).join(' | ')}`);
        if (!/Action Plan/.test(r[p2]) || !/Backup File Maintenance \(required\)/.test(r[p2]) || !/Skill Building/.test(r[p2])) fail(`${L}: the Part 2 band should tell the loop, Skill Building → Backup File Maintenance (required) → Action Plan: "${r[p2]}"`);
        const loop = r.slice(p2 + 1, pk).map(x => x.replace(/^(T:(main|drive):|G:\d+:\w+:|S:)(.*)$/, (m, a, role, rest) => a.startsWith('T') ? role : a.startsWith('G') ? 'sides' : rest));
        const want2 = [d.n === 1 ? '👋' : '📇', d.build ? '🏗' : 'main', 'drive', '📝'].concat(d.sides ? ['sides'] : []);
        if (loop.join(' ') !== want2.join(' ')) fail(`${L}: Part 2 should run ${want2.join(' → ')}: ${loop.join(' → ')}`);
        const g = r.find(x => /^G:/.test(x));
        if (d.sides && !(g && g.split(':')[1] === String(d.sides) && g.split(':')[2] === 'true' && new RegExp(`Optional side exercises \\(${d.sides}\\)`).test(g))) fail(`${L}: the side exercises should be one collapsible group, "Optional side exercises (${d.sides})": ${g}`);
        if (r.slice(pk + 1)[0] !== 'S:✅' || r.slice(pk + 2).some(x => !/^T::/.test(x))) fail(`${L}: after the Knowledge Check band, ✅ Ready for the Knowledge Check? then the Learning Checks: ${r.slice(pk + 1).join(' | ')}`);
        if (!/✅ Ready check · ✍️ Knowledge Check/.test(r[pk] || '')) fail(`${L}: the last band should be ✅ Ready check · ✍️ Knowledge Check: ${r[pk]}`);
    });
    // reached (first slide ≤ 40) opens; not reached is locked; other days (locked for this trainee) are locked
    const d1 = map.days[0];
    if (d1) d1.order.forEach((li, k) => { const at = map.firsts[li], t = d1.topics[k]; if (!t) return;
        if (at != null && t.enabled !== (at <= 40)) fail(`Day 1 topic ${t.num} (first slide ${at + 1}) should be ${at <= 40 ? 'open' : '🔒'} for a trainee on slide 41`);
        if (at == null && t.enabled) fail(`Day 1 topic ${t.num} (a Learning Check) opens before the slides are done`); });
    if (map.days.slice(1).some(d => d.topics.some(t => t.enabled))) fail('a topic on a day the trainee hasn\'t opened is clickable');
    // a reached topic opens its first slide
    const k = d1 ? d1.order.map((li, k) => [li, k]).filter(([li]) => map.firsts[li] > 0 && map.firsts[li] <= 40).pop() : null;
    if (k) {
        const [li, shown] = k;
        await page.click(`.rmx-day >> nth=0 >> .rmx-topic >> nth=${shown}`); await page.waitForTimeout(700);
        const at = await page.evaluate(() => ({ view: state.view, day: state.dayId, slide: state.lessonSlide }));
        if (at.view !== 'day' || at.day !== (await page.evaluate(() => DAYS[0].id)) || at.slide !== map.firsts[li]) fail(`a topic should open its first slide (${map.firsts[li] + 1}): ${JSON.stringify(at)}`);
        // from the slides: the topic being taught is marked
        await page.click('.slide-nav .rm-next').catch(() => fail('no 🗺 Roadmap beside Next → on the slide'));
        await page.waitForTimeout(300);
        const here = await page.evaluate(() => { const o = document.querySelector('.rmx-topic.on .rmx-tn'); return o && o.textContent; });
        if (here !== d1.topics[shown].num) fail(`opened from a slide, the roadmap should mark topic ${d1.topics[shown].num} "● here": ${here}`);
        await page.evaluate(() => closeRoadmap());
    } else fail('no Day 1 topic reached by slide 41 to open');
    // a trainer: every topic and step opens; the Action Plan row opens the Action Plan slide
    await page.evaluate(() => { state.isAdmin = true; openRoadmap(); });
    const shut = await page.evaluate(() => document.querySelectorAll('.rmx-topic:disabled, .rmx-step:disabled').length);
    if (shut) fail(`a trainer should be able to open every topic and loop step: ${shut} are locked`);
    await page.evaluate(() => { const s = [...document.querySelectorAll('.rmx-day')][0]; s.querySelector('.rmx-step-plan .rmx-step').click(); });
    await page.waitForTimeout(500);
    const planAt = await page.evaluate(() => ({ view: state.view, slide: state.lessonSlide }));
    if (planAt.view !== 'day' || planAt.slide !== map.plan1) fail(`the 📝 Update Your Action Plan row should open its slide (${map.plan1 + 1}): ${JSON.stringify(planAt)}`);
    // a side exercise inside the closed group opens once the group is opened
    await page.evaluate(() => openRoadmap());
    const side = await page.evaluate(async () => { const g = [...document.querySelectorAll('.rmx-day')][0].querySelector('.rmx-sides details'); if (!g) return 'no group';
        const b = g.querySelector('.rmx-topic'), seen = () => b.checkVisibility ? b.checkVisibility() : b.getClientRects().length > 0; if (g.open) return 'open before anyone opens it'; if (seen()) return 'visible while the group is closed'; g.open = true; await new Promise(r => setTimeout(r, 50)); return seen() ? '' : 'not visible once the group is open'; });
    if (side) fail(`Day 1's side exercises group: ${side}`);
    // a Learning Check opens the day's Knowledge Check
    const kcAt = await page.evaluate(() => { const s = [...document.querySelectorAll('.rmx-day')][0], b = [...s.querySelectorAll('.rmx-topic')].pop(); b.click(); return b.innerText; });
    await page.waitForTimeout(500);
    const kcMode = await page.evaluate(() => state.dayViewMode);
    if (kcMode !== 'knowledgeCheck') fail(`a Learning Check topic ("${kcAt.replace(/\s+/g, ' ')}") should open the day's Knowledge Check: ${kcMode}`);
    // it fits the pop-up at a laptop's and a desktop's screen
    for (const [w, h] of [[1366, 768], [1920, 1080]]) {
        await page.setViewportSize({ width: w, height: h });
        await page.evaluate(() => { closeRoadmap(); openRoadmap(); });
        await page.waitForTimeout(250);
        const fit = await page.evaluate(() => { const b = document.querySelector('.rmx-box').getBoundingClientRect(), body = document.querySelector('.rmx-body');
            return { inside: b.top >= 0 && b.left >= 0 && b.bottom <= innerHeight + 1 && b.right <= innerWidth + 1, sideways: body.scrollWidth > body.clientWidth + 1,
                cut: [...document.querySelectorAll('.rmx-day')].some(s => s.scrollWidth > s.clientWidth + 1) }; });
        if (!fit.inside || fit.sideways || fit.cut) fail(`at ${w}×${h} the roadmap should fit its pop-up: ${JSON.stringify(fit)}`);
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('🗺 Roadmap lists every day and all its topics, numbered in the order shown; Part 2 is the daily loop\'s steps (Case Profile → Skill Building → required Backup File Maintenance → Action Plan → the optional side exercises, one collapsible group → Ready check and Learning Checks); it opens any topic a trainee has reached, locks the rest, marks the topic being taught, opens everything for a trainer and fits at 1366×768 and 1920×1080.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
