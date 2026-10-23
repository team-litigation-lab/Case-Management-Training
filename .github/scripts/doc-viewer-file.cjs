// 📤 File in the CMS, from the document viewer (case-doc.html; js/cm-doc-filing.js fileDoc and adoptCmsTab).
//
// A trainee reading a case document beside the slide files it into their case in the CMS from the viewer's own bar,
// beside 📄 Open PDF and ☁️ Add to GDrive. The course page that opened the viewer does the filing, the same way the 📤 panel does: the
// category check, the CMS's name check, the attempt on the trainee's record. With no CMS open, the CMS opens in a new
// tab from the trainee's press, signed in (the Portal ticket), and the document files once the CMS says which case
// is open.
// Checks, in a browser: the button is beside Download PDF; a wrong category is refused with where the firm files it and
// nothing reaches the CMS; with no CMS open, File it opens the CMS in a new tab at the CMS's address, and the document
// is filed there under the convention, as the original PDF; the viewer says so; and the filing is on the trainee's
// record, so the 📤 panel shows it filed too.
// The CMS is answered by this test (at its real address), so nothing leaves the machine.
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
    await viewer.waitForSelector('#cms:not([hidden])', { timeout: 15000 });
    const bar = await viewer.evaluate(() => [...document.querySelectorAll('.cdv-bar button')].filter(b => !b.hidden).map(b => b.textContent.trim()));
    check(bar.includes('📄 Open PDF') && bar.includes('☁️ Add to GDrive (Back up files)') && bar.includes('📤 File in the CMS'), `Open PDF, Add to GDrive and File in the CMS sit together: ${bar.join(' · ')}`);

    await viewer.click('#cms');
    const cats = await viewer.evaluate(() => [...document.querySelectorAll('#fcat option')].map(o => o.value).filter(Boolean));
    check(cats.includes('Medical Records') && cats.length >= 8, `it offers the CMS's categories: ${cats.length}`);
    check(/opens it in a new tab, signed in/.test(await viewer.innerText('#fmsg')), 'and says the CMS will open in a new tab, signed in');

    // a wrong category: refused, with where the firm files it, before any CMS is opened
    const day = await page.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
    const name = `${CASE_ID}_Doe-John_Medical-Records_${day}.pdf`;
    await viewer.selectOption('#fcat', 'Bills');
    await viewer.fill('#fname', name);
    const tabPromise = ctx.waitForEvent('page', { timeout: 20000 }).catch(() => null);
    await viewer.click('#fgo');
    // with no CMS open, the press opens it in a new tab, signed in, at the CMS's address
    const tab = await tabPromise;
    check(!!tab, 'with no CMS open, File it opens the CMS in a new tab');
    if (tab) { await tab.waitForURL(u => String(u).includes(CMS), { timeout: 15000 }).catch(() => {}); check(tab.url().includes(CMS), `at the CMS's address: ${tab.url().replace(/ticket=[^&]+/, 'ticket=…').slice(0, 110)}`); }
    await viewer.waitForFunction(() => /Not filed|Filed in the CMS/.test(document.getElementById('fmsg').innerText), null, { timeout: 30000 }).catch(() => {});
    check(/Medical Records, not Bills/.test(await viewer.innerText('#fmsg')), 'the wrong category is refused with where the firm files it');
    check(tab ? (await tab.evaluate(() => window.__filed.length)) === 0 : false, 'and nothing reaches the CMS');

    // the right category: filed in the CMS tab, under the convention, as the original PDF
    await viewer.selectOption('#fcat', 'Medical Records');
    await viewer.click('#fgo');
    await viewer.waitForFunction(() => /Filed in the CMS as|Not filed/.test(document.getElementById('fmsg').innerText), null, { timeout: 30000 }).catch(() => {});
    const said = await viewer.innerText('#fmsg');
    check(new RegExp('Filed in the CMS as ' + name.replace(/\./g, '\\.')).test(said), `the viewer says it is filed: ${said.replace(/\s+/g, ' ').slice(0, 120)}`);
    const filed = tab ? await tab.evaluate(() => window.__filed[0] || null) : null;
    check(!!filed && filed.name === name && filed.category === 'Medical Records', `filed in the CMS tab under the convention: ${filed && filed.name}`);
    check(!!filed && filed.head === '%PDF-' && filed.bytes > 1000, `as the document's own PDF: ${filed && filed.bytes} bytes`);
    check(/2 attempts/.test(said), 'with the attempts it took');
    const rec = await page.evaluate((doc) => cmDocFiling.record(doc), DOC);
    check(!!rec && rec.filed && rec.name === name && rec.attempts === 2, 'and it is on the trainee\'s record, as a filing from the 📤 panel would be');

    finish();
    async function finish() {
        await browser.close();
        console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nFile in the CMS from the document viewer: all checks pass');
        process.exit(failures.length ? 1 : 0);
    }
})().catch(e => { console.error(e); process.exit(1); });
