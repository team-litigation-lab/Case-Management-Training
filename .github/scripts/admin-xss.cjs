// What a trainee writes never runs in a trainer's page. Trainees write their own records (feedback on the program,
// files they submitted), and trainers read them in the Admin area, where the trainer's session token lives. This
// plants hostile records the way an old, never-cleaned record could look (the local server stores writes as sent),
// renders the trainer's views, and checks nothing injected runs and the cards still read right:
//   - Admin → Trainee Feedback: an id, status, day, time and ratings that try to break out of their attributes, an
//     onclick and the stars ("★".repeat of a rating outside 1 to 5 used to throw and blank the page);
//   - the trainee's detail (Trainee Audit): a submitted file whose data URL tries to break out of its download link.
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
        await set(key, rec);
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
    const ran = await page.evaluate(() => window.__xss);
    if (ran) fail(`a trainee's text ran in the trainer's page (through ${ran})`);
    await browser.close();
    if (failures.length) { console.log(`${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log("What a trainee writes never runs in a trainer's page: Trainee Feedback and the trainee's submitted files render hostile records as plain text.");
})().catch(e => { console.error(e); process.exit(1); });
