// 📤 Filing the case documents into the CMS, named the firm's way (js/cm-doc-filing.js).
//
// A Case Flow block's documents are filed into the trainee's own case in the CMS: the trainee picks the
// CMS category, writes the file name in the firm's convention, and the document itself is sent to the CMS
// open beside the lesson (its course-bridge.js files it; the CMS repo's course-bridge.cjs covers that side).
// Checks, in a browser: the panel lists the block's documents; nothing is sent while no case is open in the
// CMS; a document put in the wrong category is refused with where the firm files it, and nothing is sent;
// a wrong name is refused with what the CMS says is wrong, and nothing is filed; the right category and
// name file the document itself (the CMS receives the document's own bytes under that category), the row
// says so, the count moves, and the trainee's filing is still there after a reload.
// The CMS is answered by this test (at its real address), so nothing leaves the machine.
// Usage: node .github/scripts/doc-filing.cjs [baseUrl]   (needs `npm i playwright`; a local server on baseUrl)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const CMS = 'lshcasemanagementtraining-trainingcrm.pages.dev';
const CASE_ID = 'LSH-2026-MVA-000041';
const BLOCK = 'd1m1-open', DOC = 'RS01';          // Day 1's opening block: John Doe's intake documents
const RIGHT_CATEGORY = 'Case Files';              // what CM_CF_DOCS says for RS01

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

// The CMS as the course sees it: it answers which case is open, and files a document whose name follows
// the convention. (The convention itself is the CMS's; here it is spelled out so the course's half can be
// tested on its own.) It records what it was sent, so the test can see the document really arrived.
const cmsPage = () => `<!doctype html><title>CMS (test)</title><body><p>CMS</p><script>
  window.__filed = [];
  const day = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
  const expected = (category, original) => {
    const type = String(category).replace(/[^A-Za-z0-9]+/g, '-');
    const ext = (/\\.([A-Za-z0-9]{1,8})$/.exec(original || '') || [])[1] || '';
    return ${JSON.stringify(CASE_ID)} + '_Doe-John_' + type + '_' + day() + (ext ? '.' + ext.toLowerCase() : '');
  };
  addEventListener('message', e => {
    const m = e.data || {};
    if (m.lsh === 'cms-case?') return parent.postMessage({lsh:'cms-case', caseId:${JSON.stringify(CASE_ID)}, client:'JOHN DOE', phase:'INTAKE', at:new Date().toISOString()}, '*');
    if (m.lsh === 'cms-doc-file') {
      const want = expected(m.category, m.original);
      if (m.name !== want) return parent.postMessage({lsh:'cms-doc-filed', id:m.id, ok:false, problems:['The name should be "' + want + '".']}, '*');
      window.__filed.push({name:m.name, category:m.category, original:m.original, bytes:(m.bytes && m.bytes.byteLength) || 0, mime:m.mime, summary:m.summary});
      return parent.postMessage({lsh:'cms-doc-filed', id:m.id, ok:true, name:m.name, category:m.category, key:'documents/'+m.name, saved:true}, '*');
    }
  });
</script></body>`;

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', e => failures.push('page error: ' + e.message));
    await page.route(`**://*${CMS}/**`, (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: cmsPage() }));

    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Filing', 'Trainee', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.evaluate(() => { try { localStorage.removeItem('cm-cms-case'); } catch (e) {} state.isAdmin = true; state.docFiling = {}; });

    // the block whose documents are filed
    const open = async () => await page.evaluate(async (block) => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const d = DAYS.find(x => x.cf && x.cf.n === 1);
        goto('day', d.id); state.dayViewMode = 'slides'; await sleep(60);
        const slides = buildDaySlides(d);
        for (let i = 0; i < slides.length; i++) {
            state.lessonSlide = i; render(); await sleep(0);
            const dfl = document.getElementById('dfl_' + block);
            if (dfl) { const det = dfl.closest('details'); if (det) det.open = true; return { slide: i, rows: dfl.querySelectorAll('.dfl-row').length }; }
        }
        return null;
    }, BLOCK);
    const panel = await open();
    check(panel && panel.rows === 6, `the block's documents are listed to file: ${JSON.stringify(panel)}`);
    if (!panel) { await browser.close(); process.exit(1); }

    const K = await page.evaluate((a) => (a.block + '__' + a.doc).replace(/\W/g, '_'), { block: BLOCK, doc: DOC });
    const R = `.dfl-row[data-k="${K}"]`;
    check(!!(await page.$(R)), `the document has a row of its own: ${K}`);

    /* fill the row in and press File it the way the button does (its onclick is this call), then read the row back */
    const act = (category, name) => page.evaluate(async (a) => {
        const row = document.querySelector(`.dfl-row[data-k="${a.k}"]`);
        if (!row) return { missing: true };
        const det = row.closest('details'); if (det) det.open = true;
        const cat = row.querySelector('.dfl-cat'), box = row.querySelector('.dfl-name');
        if (cat) cat.value = a.category;
        if (box) box.value = a.name;
        await cmDocFiling.file(a.block, a.doc, null);
        const now = document.querySelector(`.dfl-row[data-k="${a.k}"]`);
        return { text: (now ? now.textContent : '').replace(/\s+/g, ' ').trim(), panel: (document.getElementById('dfl_' + a.block) || {}).textContent || '' };
    }, { k: K, block: BLOCK, doc: DOC, category, name });

    // 1. no case open in the CMS: the panel says so, and filing sends nothing
    check(/Open your own case in the CMS first/i.test(await page.textContent('#dfl_' + BLOCK)), 'with no case open the panel says to open one');
    let out = await act(RIGHT_CATEGORY, 'anything.pdf');
    check(/No case is open in the CMS/i.test(out.text), `and filing refuses until a case is open: ${out.text.slice(0, 120)}`);

    // open the CMS beside the lesson
    await page.evaluate(() => openTool('cms', 'split'));
    await page.waitForFunction((id) => window.CMCase && CMCase.id() === id, CASE_ID, { timeout: 15000 }).catch(() => {});
    check((await page.evaluate(() => window.CMCase && CMCase.id())) === CASE_ID, 'the case open in the CMS is read from it');
    await open();   // redraw the slide: the panel now knows the case
    check(/Filing into/.test(await page.textContent('#dfl_' + BLOCK)), 'and the panel says which case it is filing into');
    const frame = page.frames().find(f => /trainingcrm/.test(f.url()));

    // 2. the wrong category: refused with where the firm files it, and nothing is sent to the CMS
    out = await act('Medical Records', 'anything.pdf');
    check(/files this document under Case Files/i.test(out.text), `the wrong category is refused with the right one: ${out.text.slice(0, 200)}`);
    check((await frame.evaluate(() => window.__filed.length)) === 0, 'and the document is not sent to the CMS at all');

    // 3. the right category, a wrong name: the CMS refuses it, and nothing is filed
    out = await act(RIGHT_CATEGORY, 'New Client Intake Sheet.pdf');
    check(/The name should be/i.test(out.text), `a wrong name is refused with what the CMS expects: ${out.text.slice(0, 220)}`);
    check((await frame.evaluate(() => window.__filed.length)) === 0, 'and nothing is filed');

    // 4. the right category and name: the document itself is filed
    const name = await page.evaluate((args) => {
        const d = new Date(), day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return `${args.id}_Doe-John_${args.cat.replace(/[^A-Za-z0-9]+/g, '-')}_${day}.pdf`;
    }, { id: CASE_ID, cat: RIGHT_CATEGORY });
    out = await act(RIGHT_CATEGORY, name);
    check(/Filed in the CMS as/i.test(out.text), `the document is filed: ${out.text.slice(0, 180)}`);
    const got = await frame.evaluate(() => window.__filed[0] || null);
    check(!!got && got.name === name, `the CMS received it under that name: ${JSON.stringify(got && got.name)}`);
    check(!!got && got.category === RIGHT_CATEGORY, 'under the category the trainee chose');
    check(!!got && got.bytes > 1000, `and the document's own file, not a placeholder: ${got && got.bytes} bytes`);
    check(!!got && got.mime === 'application/pdf', 'sent as the PDF it is');
    check(/3 attempts/.test(out.text), `the attempts are kept for the trainer: ${(/(\d+) attempts/.exec(out.text) || [])[1] || 'none shown'}`);
    check(/1 of 6 filed/.test(out.panel), `and the panel counts what is filed: ${(/(\d of \d filed[^·]*)/.exec(out.panel) || [])[1] || out.panel.slice(0, 80)}`);

    // 5. the trainee's filing is still there after a reload
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2000);
    await page.evaluate(() => { state.isAdmin = true; });
    const back = await open();
    check(/Filed in the CMS as/i.test(await page.textContent(R)), `what was filed comes back after a reload: ${JSON.stringify(back)}`);

    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: the documents are filed into the CMS, under the firm\'s convention.');
})().catch(e => { console.error(e); process.exit(1); });
