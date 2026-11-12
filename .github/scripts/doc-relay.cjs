// 📤 Relaying a Portal simulator's document to the CMS (the relay at the end of js/cm-doc-filing.js).
//
// The LSH Training Portal's Medical Records Requests simulator produces the records and the itemized bill
// a provider sends back as real files, and files them into the trainee's case. Opened from a lesson it is a
// frame or a tab of this course, not of the CMS, so it cannot reach the CMS itself: this course passes the
// document on to the CMS beside the lesson, unchanged, and hands the CMS's answer straight back.
// Checks, in a browser: the Portal's document reaches the CMS with its name, category, type and its own
// bytes, and the CMS's "filed" answer comes back to the simulator; a refusal comes back with the CMS's own
// problems and nothing else invented; with no CMS beside the lesson the simulator is told so rather than
// left waiting; a document with no bytes is refused; and a page on any other site is not relayed at all.
// Nothing here decides a name: the convention is the CMS's (its course-bridge.js and caseFileName).
// This test plays both ends, so nothing leaves the machine.
// Usage: node .github/scripts/doc-relay.cjs   (needs `npm i playwright`)
const { chromium } = require('playwright');
const http = require('http');
const CASE_ID = 'LSH-2026-MVA-000041';
const NAME = `${CASE_ID}_Doe-John_Medical-Records_${(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; })()}.pdf`;

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

// The CMS beside the lesson: it records what it was sent and answers like course-bridge.js does.
// Its src carries "cms", which is how the relay finds it among the lesson's frames.
const cmsPage = `<!doctype html><title>CMS (test)</title><body><p>CMS</p><script>
  window.__got = [];
  addEventListener('message', (e) => { const m = e.data || {};
    if (m.lsh !== 'cms-doc-file') return;
    const bytes = m.bytes instanceof ArrayBuffer ? new Uint8Array(m.bytes) : null;
    window.__got.push({ name: m.name, category: m.category, mime: m.mime, summary: m.summary,
      size: bytes ? bytes.length : 0, head: bytes ? String.fromCharCode.apply(null, bytes.slice(0, 5)) : '' });
    if (m.category === 'Random Folder')
      return parent.postMessage({ lsh: 'cms-doc-filed', id: m.id, ok: false, problems: [], error: '"Random Folder" is not a Doc Hub category on this case.' }, '*');
    if (m.name !== ${JSON.stringify(NAME)})
      return parent.postMessage({ lsh: 'cms-doc-filed', id: m.id, ok: false, problems: ['The name should be "' + ${JSON.stringify(NAME)} + '".'] }, '*');
    parent.postMessage({ lsh: 'cms-doc-filed', id: m.id, ok: true, name: m.name, category: m.category, key: 'documents/' + m.name, saved: true }, '*');
  });
</script></body>`;

// The lesson: the real relay, the CMS framed beside it, and a stand-in for the Portal's simulator framed
// as the lesson's tool — a separate origin, so the relay's own origin check is the one being exercised.
const simPage = `<!doctype html><title>Simulator (test)</title><body><p>sim</p><script>
  window.ask = (msg) => new Promise((res) => {
    const id = 'r' + Math.random().toString(36).slice(2, 8);
    const on = (e) => { if (!e.data || e.data.lsh !== 'cms-doc-filed' || e.data.id !== id) return;
      removeEventListener('message', on); res(e.data); };
    addEventListener('message', on);
    const bytes = msg.bytes === null ? null : new TextEncoder().encode('%PDF-1.4 a produced records document').buffer;
    parent.postMessage(Object.assign({ lsh: 'cms-doc-file', id }, msg, bytes ? { bytes } : { bytes: new ArrayBuffer(0) }), '*');
    setTimeout(() => { removeEventListener('message', on); res({ timedOut: true }); }, 22000);
  });
</script></body>`;

const serve = (body) => http.createServer((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' }); res.end(body);
});

(async () => {
    const cms = serve(cmsPage), sim = serve(simPage);
    await new Promise(r => cms.listen(0, r)); await new Promise(r => sim.listen(0, r));
    const cmsUrl = `http://localhost:${cms.address().port}/index.html?cms=1`;
    const simUrl = `http://127.0.0.1:${sim.address().port}/sim.html`;

    const relay = require('fs').readFileSync(require('path').join(process.cwd(), 'js/cm-doc-filing.js'));
    const lesson = http.createServer((req, res) => {
        if (new URL(req.url, 'http://x').pathname === '/cm-doc-filing.js') {
            res.writeHead(200, { 'Content-Type': 'text/javascript' }); return res.end(relay);
        }
        res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end(`<!doctype html><title>Lesson</title><body style="margin:0">
        ${/noCms/.test(req.url) ? '' : `<iframe id="cms" src="${cmsUrl}" style="width:600px;height:200px"></iframe>`}
        <iframe id="sim" src="${simUrl}" style="width:600px;height:200px"></iframe>
        <script>window.state = {}; window.toastSaid = []; window.toast = (m) => window.toastSaid.push(m);</script>
        <script src="/cm-doc-filing.js"></script></body>`);
    });
    await new Promise(r => lesson.listen(0, r));
    const lessonUrl = `http://localhost:${lesson.address().port}/`;

    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1000, height: 700 } });
    page.on('pageerror', e => failures.push('page error: ' + e.message));
    const ask = (msg) => page.frames().find(f => f.url().startsWith('http://127.0.0.1')).evaluate(m => window.ask(m), msg);

    await page.goto(lessonUrl, { waitUntil: 'load' });
    await page.waitForFunction(() => !!(window.cmDocFiling && cmDocFiling.relayOrigins), null, { timeout: 15000 });
    const cmsFrame = () => page.frames().find(f => f.url().startsWith(cmsUrl.split('?')[0]));
    await cmsFrame().waitForFunction(() => Array.isArray(window.__got), null, { timeout: 15000 });

    // 1. the document itself reaches the CMS, and the answer comes back
    let out = await ask({ name: NAME, category: 'Medical Records', original: NAME, mime: 'application/pdf', summary: 'Certified medical records production - Metro Radiology (MRR-2026-00001)' });
    let got = await cmsFrame().evaluate(() => window.__got);
    check(got.length === 1 && got[0].name === NAME && got[0].category === 'Medical Records', `the document reaches the CMS with its name and category: ${JSON.stringify(got[0] || null)}`);
    check(!!got[0] && got[0].head === '%PDF-' && got[0].size > 10, 'with its own bytes, as the PDF it is');
    check(!!got[0] && got[0].mime === 'application/pdf' && /Metro Radiology/.test(got[0].summary || ''), 'and what it is, for the Doc Hub row');
    check(!!out && out.ok === true && out.name === NAME && out.category === 'Medical Records', `the CMS's answer comes back to the simulator: ${JSON.stringify(out)}`);
    check((await page.evaluate(() => window.toastSaid)).some(t => t.includes(NAME)), 'and the lesson says so');

    // 2. a refusal comes back as the CMS's own words, with nothing invented
    out = await ask({ name: 'medical records.pdf', category: 'Medical Records', original: NAME, mime: 'application/pdf' });
    check(!!out && out.ok === false && (out.problems || []).some(p => p.includes(NAME)), `a wrong name comes back refused, with what the CMS says: ${JSON.stringify(out)}`);
    out = await ask({ name: NAME, category: 'Random Folder', original: NAME, mime: 'application/pdf' });
    check(!!out && out.ok === false && /not a Doc Hub category/.test(out.error || ''), `so does a category the case does not have: ${JSON.stringify(out)}`);

    // 3. a document with no bytes is refused rather than filed empty
    out = await ask({ name: NAME, category: 'Medical Records', original: NAME, bytes: null });
    check(!!out && out.ok === false && /did not arrive/.test(out.error || ''), `a document that did not arrive is refused: ${JSON.stringify(out)}`);

    // 4. no CMS beside the lesson: the simulator is told, not left waiting
    await page.goto(lessonUrl + '?noCms=1', { waitUntil: 'load' });
    await page.waitForFunction(() => !!(window.cmDocFiling && cmDocFiling.relayOrigins), null, { timeout: 15000 });
    out = await ask({ name: NAME, category: 'Medical Records', original: NAME, mime: 'application/pdf' });
    check(!!out && out.ok === false && /isn't open beside this lesson/.test(out.error || ''), `with no CMS beside the lesson the simulator is told so: ${JSON.stringify(out)}`);

    // 5. only the Portal may ask
    const origins = await page.evaluate(() => cmDocFiling.relayOrigins());
    const ok = (o) => origins.some(src => new RegExp(src.replace(/^\/|\/$/g, '')).test(o));
    check(ok('https://cm-training-activity.pages.dev'), 'the LSH Training Portal may ask');
    check(ok('https://case-management-training.legalsupporthelp.workers.dev'), 'so may an LSH course Worker');
    check(!ok('https://evil.example.com') && !ok('https://cm-training-activity.pages.dev.evil.example'),
        'another site is refused, lookalike hosts included');
    check(!ok('https://pages.dev'), 'and so is the bare hosting domain');

    await browser.close(); cms.close(); sim.close(); lesson.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('\nAll good: a simulator\'s document reaches the CMS beside the lesson with its own bytes, the CMS\'s answer comes straight back, and nobody else may ask.');
})().catch(e => { console.error(e); process.exit(1); });
