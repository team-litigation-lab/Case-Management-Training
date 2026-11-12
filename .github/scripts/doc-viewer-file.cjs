// ⬇ Download PDF, the document viewer's one action (case-doc.html).
//
// A trainee reading a case document beside the slide has one button on the viewer's bar: ⬇ Download PDF, which saves
// the document (dates current to their case year) as a PDF under its own name. Filing into the CMS and the Backup
// Drive copy are done from the lesson's 📤 panel, not from the viewer (checked by doc-filing.cjs).
// Checks, in a browser: the document opens in the viewer beside the slide; the bar offers Download PDF and nothing
// else of the old three (no Add to GDrive, no File in the CMS); pressing it downloads a real PDF named for the document.
// Usage: node .github/scripts/doc-viewer-file.cjs [baseUrl]   (needs `npm i playwright`; a local server on baseUrl)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const CMS = 'lshcasemanagementtraining-trainingcrm.pages.dev';
const CASE_ID = 'LSH-2026-MVA-000041';
const DOC = 'RS16';

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

// The CMS in a tab: it answers whichever window asked (e.source), as the CMS's course-bridge does for a tab.
const cmsPage = () => `<!doctype html><title>CMS (test)</title><body><p>CMS</p><script>
  window.__filed = [];
  const day = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
  const expected = (category, original) => {
    const type = String(category).replace(/[^A-Za-z0-9]+/g, '-');
    const ext = (/\\.([A-Za-z0-9]{1,8})$/.exec(original || '') || [])[1] || '';
    return ${JSON.stringify(CASE_ID)} + '_Doe-John_' + type + '_' + day() + (ext ? '.' + ext.toLowerCase() : '');
  };
  addEventListener('message', e => {
    const m = e.data || {}, back = (x) => (e.source || opener || parent).postMessage(x, '*');
    if (m.lsh === 'cms-case?') return back({lsh:'cms-case', caseId:${JSON.stringify(CASE_ID)}, client:'JOHN DOE', phase:'DEMAND', at:new Date().toISOString()});
    if (m.lsh === 'cms-doc-file') {
      const want = expected(m.category, m.original);
      if (m.name !== want) return back({lsh:'cms-doc-filed', id:m.id, ok:false, problems:['The name should be "' + want + '".']});
      window.__filed.push({name:m.name, category:m.category, bytes:(m.bytes && m.bytes.byteLength) || 0, head: m.bytes ? String.fromCharCode.apply(null, new Uint8Array(m.bytes).slice(0, 5)) : ''});
      return back({lsh:'cms-doc-filed', id:m.id, ok:true, name:m.name, category:m.category, key:'documents/'+m.name, saved:true});
    }
  });
</script></body>`;

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 } });
    await ctx.route(`**://*${CMS}/**`, (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: cmsPage() }));
    const page = await ctx.newPage();
    page.on('pageerror', e => failures.push('page error: ' + e.message));

    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Viewer', 'Trainee', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    // the same trainee every run: no CMS case remembered, this document not yet filed
    await page.evaluate(async (doc) => {
        try { localStorage.removeItem('cm-cms-case'); } catch (e) {}
        const f = (await storeGet('doc-filing')) || {}; delete f[doc]; await storeSet('doc-filing', f);
    }, DOC);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    check(!(await page.evaluate(() => window.cmDocFiling.cmsReachable())), 'no CMS is open beside the lesson to begin with');

    // the viewer, opened beside the slide as the course opens a case document
    await page.evaluate((doc) => cmCaseFlow.doc(null, doc), DOC);
    const frameEl = await page.waitForSelector(`iframe[src*="case-doc.html?id=${DOC}"], iframe[data-src*="case-doc.html?id=${DOC}"]`, { timeout: 15000 }).catch(() => null);
    check(!!frameEl, 'the document opens in the viewer beside the slide');
    if (!frameEl) return finish();
    const viewer = await frameEl.contentFrame();
    await viewer.waitForSelector('#pdf:not([hidden])', { timeout: 15000 });
    const bar = await viewer.evaluate(() => [...document.querySelectorAll('.cdv-bar button')].filter(b => !b.hidden && b.offsetParent).map(b => b.textContent.trim()));
    check(bar.includes('⬇ Download PDF'), `the bar offers Download PDF: ${bar.join(' · ')}`);
    check(!bar.some(t => /GDrive|File in the CMS|Open PDF/.test(t)), `and nothing else of the old three (no Add to GDrive, no File in the CMS): ${bar.join(' · ')}`);
    const [dl] = await Promise.all([page.waitForEvent('download', { timeout: 60000 }).catch(() => null), viewer.click('#pdf')]);
    check(!!dl, 'pressing it downloads the document');
    if (dl) {
        const name = dl.suggestedFilename();
        check(/^RS16 .*\.pdf$/.test(name), `as a PDF named for the document: ${name}`);
        const path = await dl.path().catch(() => null), fs = require('fs');
        const headBytes = path ? fs.readFileSync(path).slice(0, 5).toString() : '';
        check(headBytes === '%PDF-', `a real PDF (${headBytes || 'no file'})`);
    }

    finish();
    async function finish() {
        await browser.close();
        console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nThe document viewer offers Download PDF only, and it downloads the PDF: all checks pass');
        process.exit(failures.length ? 1 : 0);
    }
})().catch(e => { console.error(e); process.exit(1); });
