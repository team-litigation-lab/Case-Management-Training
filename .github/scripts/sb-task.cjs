// @check browser — 🎯 Your Task on a Skill Building activity, in the 🧪 Practice Lab: one column, one instruction card (📂 Your Case, ✅ What to do, steps in full sentences), one foot bar (🚀 Launch LSH CaseWorX & Google Drive · Submit →; the task's tools, 📁 Source Files among them, in 📖 Reference; no per-step tool pills, no floating CMS · Drive card), the rules in 📖 Reference
// js/cm-sb-task.js and the Your Task in js/cm-case-flow.js, drawn on the 🧪 Practice Lab page (js/cm-task-lab.js: the deck keeps
// one card per activity, its ▶ Start in the Practice Lab opens the lab). On Day 3's Backup File Maintenance (d3-drive) and Day 1's
// the Case Plan (d1m4-a2; the PD sort it used was cut with the extra tasks): no Purpose/Principle sidebar, no 🏷 naming bar or _DRAFT/_SUPERSEDED labels and no
// points badge on the page; no ↗ pills beside the steps and no #cm-sb-dock card; the steps are the owner's five sentences;
// the task's tools (js/cm-task-card.js: off the bar, in 📖 Reference under 🧰 This task's tools) hold the Source Files, which open their list, and Submit → turns the Your Task into the AI Grader. 📖 Reference opens with the
// 📋 Rules & Naming Guide (Purpose, Principle, the naming convention and its 📋 Copy). Launch opens the CMS beside the lab and,
// for a trainee with no linked Drive, the Backup Drive panel to link it. Type is bold and at least 16px; the foot bar sits in
// the Your Task card (the lab page may scroll); the deck's card fits 1366×768 and its ▶ Start opens the lab.
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

  // Day 3 is opened as a trainer presents it (a new trainee's Day 3 is still locked); Day 1 as the trainee.
  // The deck has one card for the activity; its ▶ Start in the Practice Lab opens the Your Task on the 🧪 Practice page
  const deckCard = (n, id) => page.evaluate(([n, id]) => { state.isAdmin = n > 1; const d = DAYS.find(d => d.cf && d.cf.n === n); goto('day', d.id); state.dayViewMode = 'slides';
    const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === id);
    if (k < 0) return false; goToSlide(k); return true; }, [n, id]);
  const go = async (n, id, view) => {
    if (!await deckCard(n, id)) return false;
    await page.waitForTimeout(400);
    if (!view || view === 'task') {
      const c = await page.evaluate(() => { const c = document.querySelector('#lessonSlideWrap .ctl-card'), w = document.getElementById('lessonSlideWrap'), stage = document.getElementById('lessonStage');
        return c ? { go: !!c.querySelector('.ctl-go'), over: w.scrollHeight - w.clientHeight, below: stage ? stage.getBoundingClientRect().bottom - innerHeight : 99 } : null; });
      if (!c || !c.go) { fail(`${id}: the deck's card has no ▶ Start in the Practice Lab`); return page.evaluate(([n, id]) => { state.isAdmin = n > 1; return cmTaskLab.openView(id, 'task'); }, [n, id]); }
      if (c.over > 2 || c.below > 1) fail(`${id}: the deck's card does not fit 1366×768: ${JSON.stringify(c)}`);
      await page.click('#lessonSlideWrap .ctl-card .ctl-go'); await page.waitForTimeout(300);
      return page.evaluate(() => state.view === 'practice' && !!state.taskLab && !!document.querySelector('.ctl-page #lessonSlideWrap'));
    }
    return page.evaluate(([n, id, view]) => { state.isAdmin = n > 1; return cmTaskLab.openView(id, view); }, [n, id, view]);
  };

  for (const [n, id] of [[3, 'd3-drive'], [1, 'd1m4-a2']]) {
    if (!await go(n, id, 'task')) { fail(`Day ${n}: ▶ Start did not open ${id}'s Your Task in the 🧪 Practice Lab`); continue; }
    await page.waitForTimeout(600);
    const s = await page.evaluate(() => {
      const c = document.querySelector('#app .ctl-page .cf-card.cfx-task'), q = sel => c ? c.querySelectorAll(sel).length : -1;
      const steps = c ? [...c.querySelectorAll('.cfx-steps li')].map(li => li.textContent.replace(/\s+/g, ' ').trim()) : [];
      const small = c ? [...c.querySelectorAll('.cfx-task1 button, .cfx-task1 summary, .cfx-steps li span, .cfx-task1 .cfx-call span')].filter(e => e.getClientRects().length)
        .map(e => { const st = getComputedStyle(e); return [e.textContent.trim().slice(0, 40), parseFloat(st.fontSize), Number(st.fontWeight)]; }).filter(x => x[1] < 16 || x[2] < 700) : [];
      const card = c && c.getBoundingClientRect(), foot = c && c.querySelector('.cfx-task-foot'), fr = foot && foot.getBoundingClientRect();
      return { card: !!c, oneCol: q('.cfx-task.cfx-task1'), side: q('.cfx-side, .cfx-why'), pills: q('.cfx-at'), naming: q('[data-drv-naming], .drv-nc-lb, .drv-nc-pts'),
        deliver: q('.cfx-deliver'), launch: q('.cfx-launch'), launchTop: c && c.querySelector('.cfx-task-foot .cfx-launch') ? 1 : 0, tools: c && !c.querySelector('.cfx-task-foot .cfx-tools-menu') && c.querySelector('.cfx-tools-stash[hidden] .cfx-tools-pop') ? 1 : 0, brief: c && c.querySelector('.cfx-brief .cfx-yc') && c.querySelector('.cfx-brief ol.cfx-steps') ? 1 : 0, stash: c ? ((c.querySelector('.cfx-tools-stash') || {}).textContent || '').replace(/\s+/g, ' ') : '', steps, small,
        foot: !!foot, footText: foot ? foot.textContent.replace(/\s+/g, ' ').trim() : '', pts: c ? /points/i.test(c.textContent) : true,
        dock: !!document.getElementById('cm-sb-dock'), footInside: !!(fr && card && fr.bottom <= card.bottom + 1 && fr.top >= card.top - 1) };
    });
    if (!s.card) { fail(`${id}: the Your Task isn't drawn in the 🧪 Practice Lab`); continue; }
    if (s.oneCol !== 1) fail(`${id}: Your Task should be one column (.cfx-task1)`);
    if (s.side) fail(`${id}: the Purpose / Principle sidebar is still on the page`);
    if (s.pills) fail(`${id}: ${s.pills} per-step tool pill(s) (CMS ↗, Backup Drive ↗) are still beside the steps`);
    if (s.naming) fail(`${id}: the naming convention (bar, _DRAFT/_SUPERSEDED labels or points) is still on the page`);
    if (s.deliver) fail(`${id}: the old 📤 Deliver box is still on the page`);
    if (s.dock) fail(`${id}: the floating CMS · Drive card (#cm-sb-dock) is still on the page`);
    if (s.launch !== 2 || !s.launchTop) fail(`${id}: want two tool buttons in the foot bar, 🗂 LSH CaseWorX and 📁 Case Backup Files (js/cm-tool-split.js), found ${s.launch}`);
    if (!s.tools) fail(`${id}: the task's other tools and its Source Files should be off the foot bar, kept for 📖 Reference (.cfx-tools-stash)`);
    if (!s.brief) fail(`${id}: 📂 Your Case and the steps should be one instruction card (.cfx-brief)`);
    if (s.pts) fail(`${id}: a point counter shows before anything is submitted`);
    if (!s.foot || /Submit/.test(s.footText) || /AI Grader/.test(s.footText)) fail(`${id}: the foot bar should hold 🚀 Launch and no Submit (it is in CaseWorX's window, js/cm-cms-submit.js) nor "AI Grader": "${s.footText}"`);
    if (!s.footInside) fail(`${id}: the foot bar is not inside the Your Task card`);
    if (s.small.length) fail(`${id}: type under 16px bold: ${JSON.stringify(s.small)}`);
    if (s.steps.some(t => /\bX of Y\b/.test(t) || !/[.?!]$/.test(t))) fail(`${id}: every step should be a full sentence: ${JSON.stringify(s.steps)}`);
    if (id === 'd3-drive') {
      if (JSON.stringify(s.steps) !== JSON.stringify(D3)) fail(`d3-drive's steps should be the owner's five: ${JSON.stringify(s.steps)}`);
      if (!/Source Files \(\d+ Documents?\)/.test(s.stash)) fail(`d3-drive: the task's tools should hold 📁 Source Files (N Documents): "${s.stash.slice(0, 200)}"`);
      // Source Files opens its list, from 📖 Reference's 🧰 This task's tools
      await page.click('#app .cfx-ref-open'); await page.waitForTimeout(300);
      await page.click('.cfx-ref .cfx-ref-tools .cfx-docs summary');
      if (!await page.evaluate(() => { const p = document.querySelector('.cfx-ref .cfx-ref-tools .cfx-docs[open] .cfx-docs-pop'); return !!p && p.getBoundingClientRect().height > 20; })) fail('d3-drive: 📁 Source Files (in 📖 Reference) does not open its list');
      await page.evaluate(() => cmCaseFlow.fullClose());

      // 📖 Reference: the Rules & Naming Guide
      await page.click('#app .cfx-ref-open'); await page.waitForTimeout(300);
      const ref = await page.evaluate(() => { const r = document.querySelector('.cfx-ref .cfx-guide'); return r ? { t: r.textContent, copy: !!r.querySelector('.drv-nc-copy, [data-drv-naming]') } : null; });
      if (!ref) fail('d3-drive: 📖 Reference has no 📋 Rules & Naming Guide');
      else {
        if (!/Purpose/.test(ref.t) || !/Principle/.test(ref.t)) fail(`d3-drive: the guide should hold the Purpose and the Principle: "${ref.t.slice(0, 160)}"`);
        if (!ref.copy) fail('d3-drive: the guide should hold the naming convention (its 📋 Copy example)');
      }
      await page.evaluate(() => cmCaseFlow.fullClose());

      // 🗂 LSH CaseWorX and 📁 Case Backup Files, as a trainer: the CMS beside the lab, and Google Drive in a new tab
      await page.click('#app .cfx-launch-cms'); await page.waitForTimeout(600); await page.click('#app .cfx-launch-drive'); await page.waitForTimeout(300);
      const l = await page.evaluate(() => { const f = document.getElementById('cm-toolframe'); return { cms: !!f && !f.hidden, opened: window.__opened.slice() }; });
      if (!l.cms) fail('🚀 Launch did not open the CMS beside the lab');
      if (!l.opened.some(u => /^https:\/\/drive\.google\.com\//.test(u))) fail(`🚀 Launch did not open Google Drive in a new tab: ${JSON.stringify(l.opened)}`);
      await page.evaluate(() => { if (typeof closeToolFrame === 'function') closeToolFrame(); });

      // 📤 Submit for grading, in the CaseWorX window an activity's 🚀 Launch opened (js/cm-cms-submit.js): the slide turns
      // in the lab into the AI Grader beside it; CaseWorX opened any other way has no Submit
      await go(3, 'd3-drive', 'task'); await page.waitForTimeout(400);
      await page.evaluate(() => cmCaseFlow.tool('cms', 'd3-drive')); await page.waitForTimeout(600);
      if (!await page.$('#cm-toolframe .cm-tf-submit')) fail('the CaseWorX window an activity opened has no 📤 Submit for grading');
      else { await page.click('#cm-toolframe .cm-tf-submit'); await page.waitForTimeout(600);
        if (!await page.evaluate(() => !!document.querySelector('#app .ctl-page .cf-card.cfx-check [data-aig]'))) fail('📤 Submit for grading did not open the AI Grader in the 🧪 Practice Lab'); }
      await page.evaluate(() => { closeToolFrame(); openTool('cms', 'split'); }); await page.waitForTimeout(400);
      if (await page.$('#cm-toolframe .cm-tf-submit')) fail('CaseWorX opened from the 🧰 Tools menu (no activity) shows 📤 Submit for grading');
      await page.evaluate(() => { closeToolFrame(); cmCaseFlow.clearModes && cmCaseFlow.clearModes(); });
    } else {
      // 🚀 Launch, as a trainee with no linked Drive: the CMS beside the lab and the Backup Drive panel to link it
      await page.evaluate(() => { window.__opened = []; });
      await page.click('#app .cfx-launch-cms'); await page.waitForTimeout(600); await page.click('#app .cfx-launch-drive'); await page.waitForTimeout(500);
      const l = await page.evaluate(() => { const f = document.getElementById('cm-toolframe'), h = document.getElementById('cmDriveHost');
        return { cms: !!f && !f.hidden, panel: !!h && !!h.getClientRects().length && /Drive/.test(h.textContent || ''), opened: window.__opened.slice() }; });
      if (!l.cms) fail('🚀 Launch (a trainee) did not open the CMS beside the lab');
      if (!l.panel) fail(`🚀 Launch (a trainee with no linked Drive) did not open the Backup Drive panel to link it: ${JSON.stringify(l)}`);
      await page.evaluate(() => { if (window.CMDrive && CMDrive.close) CMDrive.close(); });
      // 🚀 Launch, with a linked and built Drive: the Drive opens at the trainee's case folder (CMDrive.launch)
      const at = await page.evaluate(() => { const st = CMDrive.status; const CASE = 'https://drive.google.com/drive/folders/ci-case';
        CMDrive.status = () => ({ configured: true, connected: true, built: true, rootUrl: 'https://drive.google.com/drive/folders/ci-root', caseUrl: CASE });
        const la = CMDrive.launch; let used = false; CMDrive.launch = function () { used = true; window.open(CASE, '_blank', 'noopener'); return true; };
        window.__opened = []; try { CMSbTask.go('d1m4-a2'); } finally { CMDrive.status = st; CMDrive.launch = la; }
        return { used, opened: window.__opened.slice() }; });
      if (!at.used || !at.opened.includes('https://drive.google.com/drive/folders/ci-case')) fail(`🚀 Launch with a linked Drive should open it at the case folder through CMDrive.launch: ${JSON.stringify(at)}`);
    }
  }

  await browser.close();
  if (failures.length) { console.log('✗ Your Task in the 🧪 Practice Lab:\n  ' + failures.join('\n  ')); process.exit(1); }
  console.log('Your Task in the 🧪 Practice Lab (▶ Start from the deck\'s card): one column, steps in full sentences, the rules in Reference, one instruction card, one foot bar: Launch LSH CaseWorX & Google Drive (📤 Submit for grading is in the CaseWorX window it opens, and opens the AI Grader in the lab); the tools of the task (with the Source Files) in Reference.');
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
