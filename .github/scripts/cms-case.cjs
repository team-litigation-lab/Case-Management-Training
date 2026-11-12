// "Log Your Work" takes the CMS Case ID from the CMS.
//
// The CMS is integrated with this course, so a step whose work is done in the CMS no longer asks the
// trainee to copy the Case ID out of the case header: the course asks the CMS which case is open
// (js/cm-cms-case.js; the CMS answers from its course-bridge.js) and fills the box in, marked "from the CMS".
// Checks, in a browser: with no CMS open the box is empty and typed as before; once the CMS is open beside
// the lesson the box carries the open case's ID; a case saved in the CMS afterwards updates it; what the
// trainee typed is never overwritten; logging with an empty box logs the open case; and only the CMS can
// tell this course a Case ID.
// The CMS itself is answered by this test (its real address, served from here), so nothing leaves the machine.
// Usage: node .github/scripts/cms-case.cjs [baseUrl]   (needs `npm i playwright`; a local server on baseUrl)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const CMS = 'lshcasemanagementtraining-trainingcrm.pages.dev';

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

// the CMS, as far as the course can tell: it answers the course's question with whatever case the test opened
const cmsPage = (caseId) => `<!doctype html><title>CMS (test)</title><body><p>CMS</p><script>
  window.__case = ${JSON.stringify(caseId)};
  window.__tellParent = () => parent.postMessage({lsh:'cms-case', caseId: window.__case, client:'John Doe', phase:'INTAKE', at:new Date().toISOString()}, '*');
  addEventListener('message', e => { if (e.data && e.data.lsh === 'cms-case?') window.__tellParent(); });
</script></body>`;

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => failures.push('page error: ' + e.message));
    let caseId = 'LSH-2026-MVA-000041';
    await page.route(`**://*${CMS}/**`, (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: cmsPage(caseId) }));

    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Case', 'Id', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.evaluate(() => { try { localStorage.removeItem('cm-cms-case'); } catch (e) {} state.isAdmin = true; });

    // a Case Flow lesson with a 🧾 Log Your Work row for CMS work
    const found = await page.evaluate(async () => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const d = DAYS.find(x => x.cf && x.cf.n === 1);
        goto('day', d.id); state.dayViewMode = 'slides'; await sleep(60);
        const n = buildDaySlides(d).length;
        for (let i = 0; i < n; i++) {
            state.lessonSlide = i; render(); await sleep(0);
            const el = document.querySelector('.cfx-log input[data-cms-id]');
            if (el) return { slide: i, id: el.id };
        }
        return null;
    });
    check(!!found, `a step logs its work in the CMS: ${JSON.stringify(found)}`);
    if (!found) { await browser.close(); process.exit(1); }

    // 1. no CMS open, nothing remembered: the box is empty, as before
    check((await page.inputValue('#' + found.id)) === '', 'with no CMS open the box is empty, and is typed as before');

    // 2. the CMS open beside the lesson: the box carries the case that is open there
    await page.evaluate(() => openTool('cms', 'split'));
    await page.waitForFunction(() => window.CMCase && CMCase.id() === 'LSH-2026-MVA-000041', null, { timeout: 15000 }).catch(() => {});
    check((await page.evaluate(() => window.CMCase && CMCase.id())) === caseId, 'the course reads the open case from the CMS');
    await page.evaluate(() => { if (window.CMCase) CMCase.fill(); });
    check((await page.inputValue('#' + found.id)) === caseId, `the box is filled with it: "${await page.inputValue('#' + found.id)}"`);
    check(/from the CMS/.test(await page.textContent('.cfx-log')), 'and it says the ID came from the CMS');

    // 3. a case saved in the CMS afterwards: the CMS says so on its own, and the box follows it
    caseId = 'LSH-2026-PRL-000042';
    const cmsFrame = page.frames().find(f => /trainingcrm/.test(f.url()));
    check(!!cmsFrame, 'the CMS is framed beside the lesson');
    await cmsFrame.evaluate((id) => { window.__case = id; window.__tellParent(); }, caseId);
    await page.waitForFunction((id) => window.CMCase && CMCase.id() === id, caseId, { timeout: 10000 }).catch(() => {});
    check((await page.evaluate(() => CMCase.id())) === caseId, `a case saved in the CMS afterwards updates it: ${await page.evaluate(() => CMCase.id())}`);
    check((await page.inputValue('#' + found.id)) === caseId, 'and the box that was filled from the CMS follows it');

    // 4. what the trainee typed is never overwritten
    await page.fill('#' + found.id, 'LSH-2026-PI-999999');
    await page.evaluate(() => { CMCase.fill(); });
    check((await page.inputValue('#' + found.id)) === 'LSH-2026-PI-999999', 'what the trainee typed is left alone');

    // 5. logging with an empty box logs the case open in the CMS
    const logged = await page.evaluate(async (sel) => {
        document.querySelector(sel).value = '';
        const btn = document.querySelector('.cfx-log .btn'); btn.click();
        await new Promise(r => setTimeout(r, 300));
        return { box: document.querySelector(sel).value, rec: JSON.parse(localStorage.getItem('cm-cms-case') || '{}') };
    }, '#' + found.id);
    check(logged.box === caseId, `logging an empty box logs the open case: "${logged.box}"`);

    // 6. only the CMS can tell this course a Case ID
    const spoofed = await page.evaluate(async () => {
        const before = CMCase.id();
        window.postMessage({ lsh: 'cms-case', caseId: 'LSH-2026-XX-000666', client: 'Someone Else' }, '*');   // this page talking to itself, not the CMS frame
        await new Promise(r => setTimeout(r, 300));
        return { before, after: CMCase.id() };
    });
    check(spoofed.after === spoofed.before, `a Case ID from anywhere but the CMS is ignored: ${JSON.stringify(spoofed)}`);

    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: the CMS Case ID comes from the CMS.');
})().catch(e => { console.error(e); process.exit(1); });
