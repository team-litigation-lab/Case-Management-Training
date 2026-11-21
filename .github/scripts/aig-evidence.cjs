// @check browser — the AI Grader waits for the trainee's own evidence: a reference typed in 🧾 Log Your Work reaches the grade (never graded before it is logged, nor resubmitted before it can be corrected), and Day 5's companion build is graded on the trainee's account of it, against the companion case's own facts
// js/cm-ai-grader.js and js/cm-companion-grade.js, in a real browser, as a trainee with a case open in the CMS (which puts
// "My case in the CMS" on every activity's evidence, so the grader always has something to send):
//   · Day 1's first activity (d1m1-open, the one with the 🧾 Log Your Work box under the grader): opening its Submit asks
//     the AI nothing while no reference is logged; pressing Log it checks it by itself, with the reference in what is sent;
//   · ↻ Check again opens the form with the box editable and sends nothing; a reference typed there (Log it not pressed)
//     goes with Submit →;
//   · the companion build's panel has a box for the trainee's account and asks the AI nothing as it opens; Submit → sends
//     the account, with the companion case (not John Doe's) as the case line and no John Doe Backup Drive as evidence.
// The AI is answered by the test (callAIJson): the test server has no AI key.
// Usage: node .github/scripts/aig-evidence.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  // a case left open in the CMS (js/cm-cms-case.js remembers it)
  await page.addInitScript(() => { try { localStorage.setItem('cm-cms-case', JSON.stringify({ caseId: 'CMS-OPEN-1' })); } catch (e) {} });
  await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
  await signIn(page, 'Evie', 'Proof' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
  await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });

  const calls = [];
  await page.exposeFunction('__asked', (t) => { calls.push(t || ''); });
  await page.evaluate(() => { window.callAIJson = async (...a) => { window.__asked(JSON.stringify(a).slice(0, 60000));
    return { accuracyScore: 25, presenceScore: 22, riskScore: 15, efficiencyScore: 10, strengths: ['Good.'], blindspots: ['Fix it.'], growthSuggestions: ['Next.'] }; }; });

  // ---- 1. the reference in 🧾 Log Your Work ----
  await page.evaluate(() => { const R = cmCaseFlow.record(); if (R.work) delete R.work['d1m1-open']; });
  const go = () => page.evaluate(() => { const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
    const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === 'd1m1-open' && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'task');
    if (k < 0) return false; goToSlide(k); cmCaseFlow.mode('d1m1-open', 'check'); return true; });
  if (!await go()) fail('Day 1 has no Submit slide for d1m1-open');
  await sleep(1200);
  const s1 = await page.evaluate(() => ({ cms: window.CMCase && CMCase.id(), box: !!document.getElementById('cflog_d1m1-open'), ev: [...document.querySelectorAll('#app .aig-ev li')].map(x => x.textContent).join(' | ') }));
  if (s1.cms !== 'CMS-OPEN-1' || !/My case in the CMS/.test(s1.ev)) fail(`the test needs a case open in the CMS on the evidence: ${JSON.stringify(s1)}`);
  if (!s1.box) fail('d1m1-open\'s Submit should show the 🧾 Log Your Work box under the grader');
  if (calls.length) fail(`with no reference logged, opening Submit should not grade the work yet: asked ${calls.length} time(s)`);
  if (s1.box) {
    await page.fill('#cflog_d1m1-open', 'JD-55501');
    await page.click('#app .cfx-log button'); await sleep(1500);
    if (calls.length !== 1) fail(`logging the reference should check the work by itself, once: asked ${calls.length} time(s)`);
    else if (!/JD-55501/.test(calls[0])) fail('the reference logged should be in what is graded');
    const g = await page.evaluate(() => (CMAIGrader.result('d1m1-open') || {}).tries);
    if (g !== 1) fail(`the first attempt should be graded: tries ${g}`);
    // ↻ Check again: the form, the box editable, nothing sent yet
    await page.evaluate(() => CMAIGrader.again('d1m1-open')); await sleep(1000);
    const s2 = await page.evaluate(() => ({ box: !!document.getElementById('cflog_d1m1-open'), go: !!document.querySelector('#app .aig-go') }));
    if (calls.length !== 1) fail(`↻ Check again should let the reference be corrected before it is sent: asked ${calls.length} time(s)`);
    if (!s2.box || !s2.go) fail(`↻ Check again should show the 🧾 Log Your Work box and Submit →: ${JSON.stringify(s2)}`);
    if (s2.box && s2.go) {
      await page.fill('#cflog_d1m1-open', 'JD-77702');   // typed, Log it not pressed
      await page.click('#app .aig-go'); await sleep(1500);
      if (calls.length !== 2) fail(`Submit → should send the corrected work once: asked ${calls.length} time(s)`);
      else if (!/JD-77702/.test(calls[1])) fail('a reference typed in the box (Log it not pressed) should go with Submit →');
    }
  }

  // ---- 2. the companion build ----
  calls.length = 0;
  await page.evaluate(() => { const id = Object.keys(window.CM_COMPANION_CASES || {})[0]; state.assignedCase = id ? { id, title: CM_COMPANION_CASES[id].title } : null;
    if (window.CMDrive && typeof CMDrive.status === 'function') { const s0 = CMDrive.status; CMDrive.status = () => Object.assign({}, s0() || {}, { built: true }); } });
  const title = await page.evaluate(() => (state.assignedCase || {}).title || '');
  await page.evaluate(() => cmCompanionGrade.open()); await sleep(1200);
  const p = await page.evaluate(() => { const o = document.getElementById('cbgPanel'); return { panel: !!o, box: !!(o && o.querySelector('textarea')), go: !!(o && o.querySelector('.aig-go')) }; });
  if (!p.panel) fail('Submit my companion case should open its panel');
  if (calls.length) fail(`the companion panel should not hand the build in by itself as it opens: asked ${calls.length} time(s)`);
  if (!p.box || !p.go) fail(`the companion panel should have a box for what the trainee built and Submit →: ${JSON.stringify(p)}`);
  if (p.box && p.go) {
    await page.fill('#cbgPanel textarea', 'Conflict Check run on all four names; CMS Case ID TM-30117; folder Evie Proof - Tessa Marlowe v. Glen Oberly with nine subfolders.');
    await page.click('#cbgPanel .aig-go'); await sleep(1500);
    if (calls.length !== 1) fail(`Submit → should send the companion build once: asked ${calls.length} time(s)`);
    else {
      const t = calls[0];
      if (!/TM-30117/.test(t)) fail('the trainee\'s account of the build should be what is graded');
      if (!t.includes('Case: ' + title)) fail(`the case line should be the companion case's ("Case: ${title}")`);
      if (/Case: John Doe VS Robert Smith/.test(t)) fail('the companion build should not be graded against John Doe\'s case line');
      if (/Backup Drive/.test(t)) fail('John Doe\'s Backup Drive is no evidence of the companion folder');
    }
    const stored = await page.evaluate(async () => ((await storeGet('cf-companion-build')) || {}).text || '');
    if (!/TM-30117/.test(stored)) fail('the account should be saved in the trainee\'s record ("cf-companion-build")');
    const shown = await page.evaluate(() => !!document.querySelector('#cbgPanel .aig-score b'));
    if (!shown) fail('the companion panel should show the grade once it comes back');
  }
  await page.evaluate(() => cmCompanionGrade.close());

  await browser.close();
  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('The AI Grader waits for the trainee\'s evidence: the logged reference reaches the grade, Check again lets it be corrected, and the companion build is graded on the trainee\'s account against its own case.');
  console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
