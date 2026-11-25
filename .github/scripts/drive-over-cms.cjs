// @check browser — 🚀 Launch LSH CaseWorks & Google Drive, for a trainee with no linked Drive: the Backup Drive panel shows OVER the CMS frame (not hidden behind it), and so does what the toast says
// js/cm-sb-task.js go() opens the CMS frame (#cm-toolframe, z-index 9000, and the lifted #app at 9001: js/cm-skillbuilders.js),
// then CMDrive.show(). The panel (.drv-wrap, js/cm-drive.js) used to sit at 4000, under the frame, so the trainee saw the CMS
// and was told to "paste your folder's link in the Backup Drive panel" they could not see. This clicks Launch on Day 1's
// Case Plan Your Task slide (d1m4-a2; the PD sort it used was cut with the extra tasks) as a new trainee and asks the browser which element is on top at the panel's
// centre and at the toast's: both must be the panel / the toast, at 1366×768.
// Usage: node .github/scripts/drive-over-cms.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  const last = 'Over' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
  await signIn(page, 'Dana', last, 'B100926');
  await page.evaluate(() => { window.open = () => null; });
  const found = await page.evaluate(() => { const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
    const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === 'd1m4-a2' && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'task');
    if (k < 0) return false; goToSlide(k); return true; });
  if (!found) fail('Day 1 has no Your Task slide for d1m4-a2');
  else {
    await page.waitForTimeout(600);
    await page.click('#app .cfx-launch'); await page.waitForTimeout(900);
    const r = await page.evaluate(() => {
      const f = document.getElementById('cm-toolframe'), w = document.querySelector('#cmDriveHost .drv-wrap'), t = document.getElementById('toast');
      const top = (el) => { if (!el || !el.getClientRects().length) return 'not shown'; const b = el.getBoundingClientRect();
        const at = document.elementFromPoint(b.left + b.width / 2, b.top + Math.min(b.height / 2, 30));
        return at && (el === at || el.contains(at)) ? 'on top' : `under ${at ? (at.id ? '#' + at.id : at.tagName.toLowerCase() + (at.className && typeof at.className === 'string' ? '.' + at.className.split(' ')[0] : '')) : 'nothing'}`; };
      const box = w && (w.firstElementChild || w);
      // a toast never takes a click (pointer-events:none), so the browser's hit test skips it: let it be hit, just for the test
      let said = 'not shown'; if (t && t.classList.contains('show')) { const pe = t.style.pointerEvents; t.style.pointerEvents = 'auto'; said = top(t); t.style.pointerEvents = pe; }
      return { cms: !!f && !f.hidden, panel: top(box), toast: said };
    });
    if (!r.cms) fail('🚀 Launch did not open the CMS beside the slide');
    if (r.panel !== 'on top') fail(`the Backup Drive panel is ${r.panel}: it must show over the CMS frame`);
    if (r.toast !== 'on top') fail(`the "Link your Google Drive first" toast is ${r.toast}: it must show over the CMS frame and the panel`);
  }
  await browser.close();
  if (failures.length) { console.log('✗ Drive panel over the CMS:\n  ' + failures.join('\n  ')); process.exit(1); }
  console.log('🚀 Launch LSH CaseWorks & Google Drive (no linked Drive): the CMS opens, and the Backup Drive panel and its toast show over it.');
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
