// @check browser — 🎯 Your Task on a Skill Building activity: one column, one 🚀 Launch CMS & Google Drive button (no per-step tool pills, no floating CMS · Drive card), steps in full sentences, one foot bar (📁 Source Files · Submit to AI Grader →), the rules in 📖 Reference
// js/cm-sb-task.js and the Your Task slide in js/cm-case-flow.js. On Day 3's Backup File Maintenance (d3-drive) and Day 1's
// "Does PD Touch Our Case?" (d1m3-a3): no Purpose/Principle sidebar, no 🏷 naming bar or _DRAFT/_SUPERSEDED labels and no
// points badge on the slide; no ↗ pills beside the steps and no #cm-sb-dock card; the steps are the owner's five sentences;
// the foot bar's Source Files opens its list, and Submit to AI Grader goes to the AI Grader slide. 📖 Reference opens with the
// 📋 Rules & Naming Guide (Purpose, Principle, the naming convention and its 📋 Copy). Launch opens the CMS beside the slide and,
// for a trainee with no linked Drive, the Backup Drive panel to link it. Type is bold and at least 16px; the slide fits 1366×768.
// Usage: node .github/scripts/sb-task.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const D3 = [
  'Compare the files in your Backup Drive against the CMS to see what is missing.',
  'Upload any missing filed documents from the CMS into your Backup Drive.',
  'Keep the newest version in the main folder, and rename any older version with _SUPERSEDED-[Date].',
  'Move the draft demand and packet into folder 05 Insurance.',
  'Run the Check My Drive audit tool and record your completion.'
];

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  const last = 'Task' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
  await signIn(page, 'Dana', last, 'B100926');
  // the Drive tab is opened with window.open: counted, not opened
  await page.evaluate(() => { window.__opened = []; window.open = (u) => { window.__opened.push(String(u)); return null; }; });

  // Day 3 is opened as a trainer presents it (a new trainee's Day 3 is still locked); Day 1 as the trainee
  const go = (n, id, view) => page.evaluate(([n, id, view]) => { state.isAdmin = n > 1; const d = DAYS.find(d => d.cf && d.cf.n === n); goto('day', d.id); state.dayViewMode = 'slides';
    const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === id && (!view || cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === view));
    if (k < 0) return false; goToSlide(k); return true; }, [n, id, view]);

  for (const [n, id] of [[3, 'd3-drive'], [1, 'd1m3-a3']]) {
    if (!await go(n, id, 'task')) { fail(`Day ${n} has no Your Task slide for ${id}`); continue; }
    await page.waitForTimeout(600);
    const s = await page.evaluate(() => {
      const c = document.querySelector('#app .cf-card.cfx-task'), q = sel => c ? c.querySelectorAll(sel).length : -1;
      const steps = c ? [...c.querySelectorAll('.cfx-steps li')].map(li => li.textContent.replace(/\s+/g, ' ').trim()) : [];
      const small = c ? [...c.querySelectorAll('.cfx-task1 button, .cfx-task1 summary, .cfx-steps li span, .cfx-task1 .cfx-call span')].filter(e => e.getClientRects().length)
        .map(e => { const st = getComputedStyle(e); return [e.textContent.trim().slice(0, 40), parseFloat(st.fontSize), Number(st.fontWeight)]; }).filter(x => x[1] < 16 || x[2] < 700) : [];
      const card = c && c.getBoundingClientRect(), foot = c && c.querySelector('.cfx-task-foot'), fr = foot && foot.getBoundingClientRect();
      return { card: !!c, oneCol: q('.cfx-task.cfx-task1'), side: q('.cfx-side, .cfx-why'), pills: q('.cfx-at'), naming: q('[data-drv-naming], .drv-nc-lb, .drv-nc-pts'),
        deliver: q('.cfx-deliver'), launch: q('.cfx-launch'), launchTop: c && c.querySelector('.cfx-task-bar .cfx-launch') ? 1 : 0, steps, small,
        foot: !!foot, footText: foot ? foot.textContent.replace(/\s+/g, ' ').trim() : '', pts: c ? /points/i.test(c.textContent) : true,
        dock: !!document.getElementById('cm-sb-dock'), footInside: !!(fr && card && fr.bottom <= Math.min(card.bottom, innerHeight) + 1) };
    });
    if (!s.card) { fail(`${id}: the Your Task slide isn't drawn`); continue; }
    if (s.oneCol !== 1) fail(`${id}: Your Task should be one column (.cfx-task1)`);
    if (s.side) fail(`${id}: the Purpose / Principle sidebar is still on the slide`);
    if (s.pills) fail(`${id}: ${s.pills} per-step tool pill(s) (CMS ↗, Backup Drive ↗) are still beside the steps`);
    if (s.naming) fail(`${id}: the naming convention (bar, _DRAFT/_SUPERSEDED labels or points) is still on the slide`);
    if (s.deliver) fail(`${id}: the old 📤 Deliver box is still on the slide`);
    if (s.dock) fail(`${id}: the floating CMS · Drive card (#cm-sb-dock) is still on the page`);
    if (s.launch !== 1 || !s.launchTop) fail(`${id}: want one 🚀 Launch CMS & Google Drive button at the top of the card, found ${s.launch}`);
    if (s.pts) fail(`${id}: a point counter shows before anything is submitted`);
    if (!s.foot || !/Submit →/.test(s.footText) || /AI Grader/.test(s.footText)) fail(`${id}: the foot bar should end in Submit → (never "AI Grader"): "${s.footText}"`);
    if (!s.footInside) fail(`${id}: the foot bar is not on screen at 1366×768`);
    if (s.small.length) fail(`${id}: type under 16px bold: ${JSON.stringify(s.small)}`);
    if (s.steps.some(t => /\bX of Y\b/.test(t) || !/[.?!]$/.test(t))) fail(`${id}: every step should be a full sentence: ${JSON.stringify(s.steps)}`);
    if (id === 'd3-drive') {
      if (JSON.stringify(s.steps) !== JSON.stringify(D3)) fail(`d3-drive's steps should be the owner's five: ${JSON.stringify(s.steps)}`);
      if (!/Source Files \(\d+ Documents?\)/.test(s.footText)) fail(`d3-drive: the foot bar should open with 📁 Source Files (N Documents): "${s.footText}"`);
      // Source Files opens its list
      await page.click('#app .cfx-task-foot .cfx-docs summary');
      if (!await page.evaluate(() => { const p = document.querySelector('#app .cfx-task-foot .cfx-docs[open] .cfx-docs-pop'); return !!p && p.getBoundingClientRect().height > 20; })) fail('d3-drive: 📁 Source Files does not open its list');
      await page.click('#app .cfx-task-foot .cfx-docs summary');

      // 📖 Reference: the Rules & Naming Guide
      await page.click('#app .cfx-ref-open'); await page.waitForTimeout(300);
      const ref = await page.evaluate(() => { const r = document.querySelector('.cfx-ref .cfx-guide'); return r ? { t: r.textContent, copy: !!r.querySelector('.drv-nc-copy, [data-drv-naming]') } : null; });
      if (!ref) fail('d3-drive: 📖 Reference has no 📋 Rules & Naming Guide');
      else {
        if (!/Purpose/.test(ref.t) || !/Principle/.test(ref.t)) fail(`d3-drive: the guide should hold the Purpose and the Principle: "${ref.t.slice(0, 160)}"`);
        if (!ref.copy) fail('d3-drive: the guide should hold the naming convention (its 📋 Copy example)');
      }
      await page.evaluate(() => cmCaseFlow.fullClose());

      // 🚀 Launch, as a trainer: the CMS beside the slide and Google Drive in a new tab
      await page.click('#app .cfx-launch'); await page.waitForTimeout(600);
      const l = await page.evaluate(() => { const f = document.getElementById('cm-toolframe'); return { cms: !!f && !f.hidden, opened: window.__opened.slice() }; });
      if (!l.cms) fail('🚀 Launch did not open the CMS beside the slide');
      if (!l.opened.some(u => /^https:\/\/drive\.google\.com\//.test(u))) fail(`🚀 Launch did not open Google Drive in a new tab: ${JSON.stringify(l.opened)}`);
      await page.evaluate(() => { if (typeof closeToolFrame === 'function') closeToolFrame(); });

      // Submit to AI Grader →: the AI Grader slide
      await go(3, 'd3-drive', 'task'); await page.waitForTimeout(400);
      await page.click('#app .cfx-grade-go'); await page.waitForTimeout(500);
      if (!await page.evaluate(() => !!document.querySelector('#app .cf-card.cfx-check [data-aig]'))) fail('Submit to AI Grader → did not go to the AI Grader slide');
    } else {
      // 🚀 Launch, as a trainee with no linked Drive: the CMS beside the slide and the Backup Drive panel to link it
      await page.evaluate(() => { window.__opened = []; });
      await page.click('#app .cfx-launch'); await page.waitForTimeout(800);
      const l = await page.evaluate(() => { const f = document.getElementById('cm-toolframe'), h = document.getElementById('cmDriveHost');
        return { cms: !!f && !f.hidden, panel: !!h && !!h.getClientRects().length && /Drive/.test(h.textContent || ''), opened: window.__opened.slice() }; });
      if (!l.cms) fail('🚀 Launch (a trainee) did not open the CMS beside the slide');
      if (!l.panel) fail(`🚀 Launch (a trainee with no linked Drive) did not open the Backup Drive panel to link it: ${JSON.stringify(l)}`);
      await page.evaluate(() => { if (window.CMDrive && CMDrive.close) CMDrive.close(); });
      // 🚀 Launch, with a linked and built Drive: the Drive opens at the trainee's case folder (CMDrive.launch)
      const at = await page.evaluate(() => { const st = CMDrive.status; const CASE = 'https://drive.google.com/drive/folders/ci-case';
        CMDrive.status = () => ({ configured: true, connected: true, built: true, rootUrl: 'https://drive.google.com/drive/folders/ci-root', caseUrl: CASE });
        const la = CMDrive.launch; let used = false; CMDrive.launch = function () { used = true; window.open(CASE, '_blank', 'noopener'); return true; };
        window.__opened = []; try { CMSbTask.go('d1m3-a3'); } finally { CMDrive.status = st; CMDrive.launch = la; }
        return { used, opened: window.__opened.slice() }; });
      if (!at.used || !at.opened.includes('https://drive.google.com/drive/folders/ci-case')) fail(`🚀 Launch with a linked Drive should open it at the case folder through CMDrive.launch: ${JSON.stringify(at)}`);
    }
  }

  await browser.close();
  if (failures.length) { console.log('✗ Your Task slide:\n  ' + failures.join('\n  ')); process.exit(1); }
  console.log('Your Task slide: one column, one Launch CMS & Google Drive button, steps in full sentences, the rules in Reference, one foot bar with Source Files and Submit.');
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
