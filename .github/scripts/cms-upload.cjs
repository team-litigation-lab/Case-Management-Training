// 📤 Uploading a drafted letter in the CMS (js/cm-cms-upload.js).
//
// The drafting activities (HIPAA, LOR, the medical provider's letters) no longer end at a download: the
// trainee uploads what they drafted into their client's case file in the CMS, under the right tab and named
// the firm's way, and is graded on both. Checks, in a browser: the panel is on the drafting page; nothing is
// uploaded while no case is open in the CMS; the wrong tab is refused with the tab the firm uses, and
// nothing is sent; the right tab with a wrong name is refused by the CMS, and nothing is filed; the right
// tab and name upload the drafted PDF itself (the CMS receives its bytes under that tab), the panel says
// so, the attempts are kept, and ⬇ Download PDF is still on the page beside it.
// The CMS is answered by this test (at its real address), so nothing leaves the machine.
// Usage: node .github/scripts/cms-upload.cjs [baseUrl]   (needs `npm i playwright`; a local server on baseUrl)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const CMS = 'lshcasemanagementtraining-trainingcrm.pages.dev';
const CASE_ID = 'LSH-2026-MVA-000041';
const DOC = 'hipaa';                 // the HIPAA authorization: the one activity with nothing to assign
const RIGHT_TAB = 'Case Files';      // what js/cm-cms-upload.js says the firm files it under

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

// The CMS as the course sees it: it answers which case is open, and files a document whose name follows
// the convention. (The convention is the CMS's; spelled out here so the course's half can be tested alone.)
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
    await signIn(page, 'Upload', 'Trainee', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.evaluate(() => { try { localStorage.removeItem('cm-cms-case'); } catch (e) {} state.cmsUploads = {}; });

    // the drafting page the letter is uploaded from
    const open = async () => await page.evaluate(async () => {
        goto('hipaa'); render();
        await new Promise(r => setTimeout(r, 120));
        const p = document.getElementById('cmu_hipaa');
        return p ? { panel: p.textContent.replace(/\s+/g, ' ').trim().slice(0, 400) } : null;
    });
    let panel = await open();
    check(!!panel, `the upload panel is on the drafting page: ${JSON.stringify(panel && panel.panel.slice(0, 90))}`);
    if (!panel) { await browser.close(); process.exit(1); }
    check(/Upload in the CMS/i.test(panel.panel), 'and it says to upload it in the CMS');
    check(await page.evaluate(() => /Download PDF/.test(document.body.textContent)), 'and ⬇ Download PDF is still on the page');

    /* fill the panel in and press Upload the way the button does (its onclick is this call), then read it back */
    const act = (tab, name) => page.evaluate(async (a) => {
        const wrap = document.getElementById('cmu_' + a.id);
        if (!wrap) return { missing: true };
        const cat = wrap.querySelector('.dfl-cat'), box = wrap.querySelector('.dfl-name');
        if (cat) cat.value = a.tab;
        if (box) box.value = a.name;
        await cmCmsUpload.upload(a.id, null);
        const now = document.getElementById('cmu_' + a.id);
        return { text: (now ? now.textContent : '').replace(/\s+/g, ' ').trim() };
    }, { id: DOC, tab, name });

    // 1. no case open in the CMS: the panel says so, and uploading sends nothing
    check(/Open your client's case file in the CMS first/i.test(panel.panel), 'with no case open the panel says to open one');
    let out = await act(RIGHT_TAB, 'anything.pdf');
    check(/No case is open in the CMS/i.test(out.text), `and uploading refuses until a case is open: ${out.text.slice(0, 120)}`);

    // open the CMS beside the lesson
    await page.evaluate(() => openTool('cms', 'split'));
    await page.waitForFunction((id) => window.CMCase && CMCase.id() === id, CASE_ID, { timeout: 15000 }).catch(() => {});
    check((await page.evaluate(() => window.CMCase && CMCase.id())) === CASE_ID, 'the case open in the CMS is read from it');
    panel = await open();   // redraw the page: the panel now knows the case
    check(/Filing into/.test(panel.panel), 'and the panel says which case it is filing into');
    const frame = page.frames().find(f => /trainingcrm/.test(f.url()));

    // 2. the wrong tab: refused with the tab the firm uses, and nothing is sent to the CMS
    out = await act('Medical Records', 'anything.pdf');
    check(/files this document under Case Files/i.test(out.text), `the wrong tab is refused with the right one: ${out.text.slice(0, 220)}`);
    check((await frame.evaluate(() => window.__filed.length)) === 0, 'and the document is not sent to the CMS at all');

    // 3. the right tab, a wrong name: the CMS refuses it, and nothing is filed
    out = await act(RIGHT_TAB, 'HIPAA Authorization.pdf');
    check(/The name should be/i.test(out.text), `a wrong name is refused with what the CMS expects: ${out.text.slice(0, 240)}`);
    check((await frame.evaluate(() => window.__filed.length)) === 0, 'and nothing is filed');

    // 4. the right tab and name: the drafted PDF itself is filed
    const name = await page.evaluate((args) => {
        const d = new Date(), day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return `${args.id}_Doe-John_${args.tab.replace(/[^A-Za-z0-9]+/g, '-')}_${day}.pdf`;
    }, { id: CASE_ID, tab: RIGHT_TAB });
    out = await act(RIGHT_TAB, name);
    check(/Filed in the CMS as/i.test(out.text), `the letter is filed: ${out.text.slice(0, 200)}`);
    const got = await frame.evaluate(() => window.__filed[0] || null);
    check(!!got && got.name === name, `the CMS received it under that name: ${JSON.stringify(got && got.name)}`);
    check(!!got && got.category === RIGHT_TAB, 'under the tab the trainee chose');
    check(!!got && got.bytes > 1000, `and the drafted document's own PDF, not a placeholder: ${got && got.bytes} bytes`);
    check(!!got && got.mime === 'application/pdf', 'sent as the PDF it is');
    check(/3 attempts/.test(out.text), `the attempts are kept for the trainer: ${(/(\d+) attempts/.exec(out.text) || [])[1] || 'none shown'}`);
    const health = await page.evaluate(() => cmCmsUpload.health());
    check(health && health.uploaded === 1 && health.firstTime === 0 && health.attempts === 3,
        `and the grade a trainer reads: ${JSON.stringify(health)}`);

    // 5. the trainee's upload is still there after a reload
    await page.waitForTimeout(500);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2000);
    const back = await open();
    check(/Filed in the CMS as/i.test(back ? back.panel : ''), `what was uploaded comes back after a reload: ${JSON.stringify(back && back.panel.slice(0, 120))}`);

    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: a drafted letter is uploaded in the CMS, under the right tab and the firm\'s convention.');
})().catch(e => { console.error(e); process.exit(1); });
