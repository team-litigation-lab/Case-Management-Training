// @check browser — 👁 Trainee view shows no trainer-only box (Day 5's companion-case guide, the ring and inject buttons), and the wording a trainee reads is right: the Ready check, the Net Sheet's file name, the Practice page's day names
// 1. An admin in 👁 Trainee view (state.adminPreview, js/cm-updates.js setAdminViewMode) sees the portal as a trainee does:
//    Day 5's Full Application Practice slide has no "📁 Companion cases · Every trainee builds the case you assigned" box and
//    no 🧠 Brainstorm guide (js/cm-case-flow.js trainerOnly), the companion grader no "Trainer view" line; the same admin in
//    Admin view still gets them.
// 2. The Ready check (the day's last slide) says "Before the Knowledge Check", not "Before you check your work".
// 3. The LSH Net Sheet download has a clean name (documents/templates/LSH_Net_Sheet.xlsx, served), and nothing in the
//    Documents list still points at LSH_Net_Sheet_v2_FIXED.xlsx.
// 4. The 🧪 Practice page's day names are written the same way on all five days (each word capitalised, as Day 5's).
// Usage: node .github/scripts/trainee-view-wording.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  const r = await page.evaluate(async () => {
    const sleep = ms => new Promise(f => setTimeout(f, ms)), out = {};
    const d5 = DAYS.find(d => d.cf && d.cf.build) || DAYS.find(d => d.cf && d.cf.n === 5);
    const at = (d, type) => buildDaySlides(d).findIndex(s => s.type === type);
    const show = async (d, k) => { goto('day', d.id); state.dayViewMode = 'slides'; state.maxSlideReached = 9999; goToSlide(k); await sleep(120); return document.getElementById('lessonSlideWrap') || document.body; };
    const look = w => ({ guide: /Every trainee builds the case you assigned|🧠 Brainstorm guide/.test(w.textContent), ring: !!w.querySelector('.cfx-ringrow') });
    state.isAdmin = true; state.adminPreview = false;
    const kb = at(d5, 'companionBuild');
    out.admin = kb >= 0 ? look(await show(d5, kb)) : null;
    state.isAdmin = false; state.adminPreview = true;   // 👁 Trainee view, as setAdminViewMode('trainee') sets it
    out.preview = kb >= 0 ? look(await show(d5, kb)) : null;
    // a call block's slide (the ring button) in Trainee view
    out.ringPreview = 0;
    for (const d of DAYS.filter(x => x.cf)) { const ss = buildDaySlides(d);
      for (let k = 0; k < ss.length; k++) { if (ss[k].type !== 'topic') continue; const w = await show(d, k); if (w.querySelector('.cfx-ringrow')) out.ringPreview++; if (out.ringPreview) break; }
      if (out.ringPreview) break; }
    // the Ready check
    const d1 = DAYS.find(d => d.cf && d.cf.n === 1), kr = at(d1, 'readyCheck');
    out.ready = kr >= 0 ? (await show(d1, kr)).textContent.replace(/\s+/g, ' ') : '';
    state.adminPreview = false;
    // the Practice page
    out.names = [];
    for (const d of DAYS.filter(x => x.cf)) { state.cfPxDay = d.cf.n; goto('practice'); await sleep(60);
      const h = document.querySelector('.cf-px-dh h2'); out.names.push(h ? h.childNodes[0].textContent.trim() : ''); }
    return out;
  });
  if (!r.admin || !r.admin.guide) fail(`in Admin view, Day 5's build slide should show the trainer's companion-case guide: ${JSON.stringify(r.admin)}`);
  if (!r.preview) fail('Day 5 has no Full Application Practice slide');
  else if (r.preview.guide) fail('in 👁 Trainee view, Day 5\'s build slide shows the trainer-only companion-case guide (Every trainee builds the case you assigned · 🧠 Brainstorm guide)');
  if (r.ringPreview) fail('in 👁 Trainee view, a slide shows the trainer\'s 📞 Ring every trainee button');
  if (!/Before the Knowledge Check/.test(r.ready) || /Before you check your work/.test(r.ready)) fail(`the Ready check should say "Before the Knowledge Check": ${r.ready.slice(0, 200)}`);
  const file = await page.evaluate(async () => (await fetch('/documents/templates/LSH_Net_Sheet.xlsx', { method: 'GET' })).status);
  if (file !== 200) fail(`documents/templates/LSH_Net_Sheet.xlsx should be served (${file})`);
  const src = await page.evaluate(() => [...document.scripts].map(s => s.src).filter(Boolean));
  const docsJs = await page.evaluate(async () => (await fetch('/js/cm-documents.js')).text());
  if (/_FIXED|Net_Sheet_v2/.test(docsJs)) fail('js/cm-documents.js still names the Net Sheet LSH_Net_Sheet_v2_FIXED.xlsx');
  if (!src.length) fail('no scripts on the page');
  const cap = (t) => t.replace(/^Day \d+ · /, '').split(/[\s,]+/).filter(w => /[A-Za-z]/.test(w) && !/^(the|of|and|a|to)$/i.test(w)).every(w => /^[A-Z0-9]/.test(w));
  if (r.names.length !== 5 || r.names.some(n => !n)) fail(`the Practice page should name all five days: ${JSON.stringify(r.names)}`);
  else if (!r.names.every(cap)) fail(`the Practice page's day names should be written the same way (each word capitalised): ${JSON.stringify(r.names)}`);
  await browser.close();
  if (failures.length) { console.log('✗ Trainee view & wording:\n  ' + failures.join('\n  ')); process.exit(1); }
  console.log(`Trainee view shows no trainer-only box; the Ready check says "Before the Knowledge Check"; the Net Sheet downloads as LSH_Net_Sheet.xlsx; the Practice page names the days ${r.names.join(' / ')}.`);
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
