// @check browser — What a trainee writes never runs in a trainer's page (Trainee Feedback, a trainee's submitted files)
// What a trainee writes never runs in a trainer's page. Trainees write their own records (feedback on the program,
// files they submitted), and trainers read them in the Admin area, where the trainer's session token lives. This
// plants hostile records the way an old, never-cleaned record could look (the local server stores writes as sent),
// renders the trainer's views, and checks nothing injected runs and the cards still read right:
//   - Admin → Trainee Feedback: an id, status, day, time and ratings that try to break out of their attributes, an
//     onclick and the stars ("★".repeat of a rating outside 1 to 5 used to throw and blank the page);
//   - the trainee's detail (Trainee Audit): a submitted file whose data URL tries to break out of its download link;
//   - the Trainee Audit table and detail: Skill Builder runs and scores, a day's score, the Backup Drive set-up, filing
//     attempts and an amendment request's log, all sent as markup where numbers and ids belong;
//   - the Batch Sheet: a review the trainee wrote for themselves as "sent" is not shown as the trainer's remark.
// The Worker's own clean-up of new feedback is checked in worker-guards.cjs.
// Usage: node .github/scripts/admin-xss.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    page.on('dialog', d => { fail(`a dialog opened: ${d.message()}`); d.dismiss(); });
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Xavi', 'Probe' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
    const fid = 'xssprobe' + Date.now().toString(36);
    await page.evaluate(async (fid) => {
        const set = (key, value) => fetch('/api/storage/set', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, typeof authHeaders === 'function' ? authHeaders() : {}), body: JSON.stringify({ key, value: JSON.stringify(value) }) });
        await set('tfeedback:' + fid, { id: "x');window.__xss='onclick';//", status: 'new" onmouseover="window.__xss=\'status\'" x="', dayId: '<img src=x onerror="window.__xss=\'day\'">',
            at: '<img src=x onerror="window.__xss=\'at\'">', ratings: { platform: 7, lessons: -3, facilitator: '<b>', practice: 4 }, name: 'Probe <img src=x onerror="window.__xss=\'name\'">',
            good: '<img src=x onerror="window.__xss=\'good\'">', improve: '', facilitator: '' });
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, typeof authHeaders === 'function' ? authHeaders() : {}), body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}');
        rec.approved = true;
        rec.submissions = [{ stored: true, fileName: 'notes.pdf', toolTitle: 'Probe', fileSize: 12, submittedAt: '2026-01-01T00:00:00Z', dataUrl: '"><img src=x onerror="window.__xss=\'dataUrl\'">' },
            { stored: true, fileName: 'js.pdf', toolTitle: 'Probe', fileSize: 12, submittedAt: '2026-01-01T00:00:00Z', dataUrl: 'javascript:window.__xss=\'jsurl\'' },
            { stored: true, fileName: 'ok.pdf', toolTitle: 'Probe', fileSize: 12, submittedAt: '2026-01-01T00:00:00Z', dataUrl: 'data:application/pdf;base64,JVBERi0xLjQK' }];
        // numbers a trainee's page keeps, sent as markup instead: Skill Builder runs and best scores, a day's score
        const X = (t) => `<img src=x onerror="window.__xss='${t}'">`;
        rec.practiceProgress = { anytool: { runs: X('pp.runs'), bestScore: X('pp.best') } };
        const cfDays = DAYS.filter(d => d.cf).map(d => d.id);
        rec.dayProgress = Object.fromEntries(cfDays.map(d => [d, { done: true, score: X('dp.score') }]));
        await set(key, rec);
        // the trainee's progress record (free-form, theirs to write): the Backup Drive set-up, filed documents, and the
        // log of a refused amendment request
        const EXH = window.CM_CF_EXHIBITS || {}, amend = {}, filing = { probe: { filed: true, name: 'Probe.pdf', attempts: X('df.attempts') } };
        Object.entries(EXH.amendments || {}).forEach(([a, x]) => { const req = {};
            (x.requests || []).forEach(q => { req[q.doc] = { sent: true, tries: 2, choice: 0, body: 'x', log: [{ tripped: [X('am.tripped')], missing: [X('am.missing')] }] }; });
            amend[a] = { screened: true, marks: {}, req }; });
        await set('progress:' + state.traineeId, { savedAt: '2026-01-04T00:00:00Z', data: { 'drive-setup': { score: X('ds.score'), attempts: X('ds.attempts') }, 'doc-filing': filing, 'case-flow': { v: 1, modules: {}, amend } } });
        // a review the trainee wrote for themselves as "sent" (the Worker stores what a trainee writes as the auto-review)
        await set('feedback:' + state.traineeId, { days: { [cfDays[0]]: { status: 'sent', auto: true, rating: 'Strong', summary: 'FORGED-BY-TRAINEE outstanding' } } });
    }, fid);

    // Admin → Trainee Feedback
    await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); state.isAdmin = true; state.tfbAdmin = null; goto('admin'); state.adminTab = 'tfeedback'; render(); });
    await page.waitForTimeout(1500);
    const card = page.locator('.tfb-item', { hasText: 'Probe' }).first();
    if (!(await card.count())) fail('the planted feedback card should still be drawn (not blank the page)');
    else {
        await card.hover(); await card.locator('.tfb-item-head').hover();
        const info = await card.evaluate((c) => ({ cls: c.className, head: c.querySelector('.tfb-item-head').innerText, stars: [...c.querySelectorAll('.tfb-item-ratings b')].map(b => b.textContent), imgs: c.querySelectorAll('img').length }));
        if (info.imgs) fail(`the feedback card drew ${info.imgs} injected <img> element(s)`);
        if (!/^card tfb-item new$/.test(info.cls.trim())) fail(`a status outside new / acknowledged / actioned should read as new, not break the class: "${info.cls}"`);
        if (!/Program overall/.test(info.head)) fail(`a day that isn't a number should read "Program overall": ${info.head}`);
        if (info.stars.some(s => s.length !== 5)) fail(`every rating should draw five stars, clamped to 1–5: ${JSON.stringify(info.stars)}`);
        const ack = card.locator('button', { hasText: 'Mark acknowledged' });
        if (await ack.count()) { await ack.click(); await page.waitForTimeout(500); }
        else fail('the card should offer Mark acknowledged');
    }
    // the trainee's detail: their submitted files
    const html = await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, typeof authHeaders === 'function' ? authHeaders() : {}), body: JSON.stringify({ key }) }).then(r => r.json());
        const box = document.createElement('div'); box.id = 'xss-detail'; document.body.appendChild(box);
        box.innerHTML = renderAdminDetail(JSON.parse(r.value || '{}'));
        return { imgs: box.querySelectorAll('img').length, links: [...box.querySelectorAll('a[download]')].map(a => ({ href: a.getAttribute('href').slice(0, 40), name: a.getAttribute('download') })) };
    });
    await page.waitForTimeout(300);
    if (html.imgs) fail(`the trainee's detail drew ${html.imgs} injected <img> element(s)`);
    if (html.links.some(l => !/^data:/.test(l.href))) fail(`a download link should only ever be a data: URL: ${JSON.stringify(html.links)}`);
    if (!html.links.some(l => l.name === 'ok.pdf')) fail(`a real stored file should still be offered for download: ${JSON.stringify(html.links)}`);
    // the Trainee Audit table (drawn for every trainee as soon as the tab opens), then this trainee's detail with its
    // Day-by-Day, Skill Builders, Document Filing & Backup Drive and Case Flow trainer panels
    const tid = await page.evaluate(() => state.traineeId);
    const injected = () => page.evaluate(() => [...document.querySelectorAll('img')].filter(i => i.getAttribute('src') === 'x').length);
    await page.evaluate(() => { const b = document.getElementById('xss-detail'); if (b) b.remove(); state.adminData = null; goto('admin'); state.adminTab = 'traineeaudit'; render(); });
    await page.waitForTimeout(3500);
    if (!(await page.locator(`tr[data-id="${tid}"]`).count())) fail("the Trainee Audit should list the planted trainee");
    if (await injected()) fail(`the Trainee Audit table drew ${await injected()} injected <img> element(s) from a trainee's Skill Builder numbers`);
    await page.evaluate((id) => { state.adminExpandedId = id; render(); }, tid);
    await page.waitForTimeout(3500);
    await page.evaluate(() => { render(); document.querySelectorAll('details').forEach(d => { d.open = true; }); }); await page.waitForTimeout(1200);
    const panels = await page.evaluate(() => ({ work: document.querySelectorAll('.cf-tr-work').length, text: document.body.innerText }));
    if (!/Drive set up at/.test(panels.text)) fail("the trainee's detail should show the Backup Drive set-up line");
    if (!/tripped/.test(panels.text)) fail("the Case Flow trainer panel should show the amendment request's refused attempt");
    if (await injected()) fail(`the trainee's detail drew ${await injected()} injected <img> element(s) (scores, runs, Drive set-up, filing attempts or the amendment log)`);
    // the Batch Sheet: a review the trainee wrote for themselves never reads as the trainer's remark
    await page.evaluate(() => { state.adminExpandedId = null; state.adminTab = 'audit'; render(); });
    await page.waitForTimeout(3500);
    const forged = await page.evaluate(() => [...document.querySelectorAll('td')].filter(td => /FORGED/.test(td.title || '') || /FORGED/.test(td.textContent)).map(td => `${td.textContent} | ${td.title}`.slice(0, 120)));
    if (forged.length) fail(`the Batch Sheet shows a review the trainee wrote as the trainer's remark: ${JSON.stringify(forged.slice(0, 2))}`);
    if (await injected()) fail(`the Batch Sheet drew ${await injected()} injected <img> element(s)`);
    const ran = await page.evaluate(() => window.__xss);
    if (ran) fail(`a trainee's text ran in the trainer's page (through ${ran})`);
    await browser.close();
    if (failures.length) { console.log(`${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log("What a trainee writes never runs in a trainer's page: Trainee Feedback and the trainee's submitted files render hostile records as plain text.");
})().catch(e => { console.error(e); process.exit(1); });
