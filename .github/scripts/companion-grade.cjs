// @check browser — Day 5's companion-case build is AI graded: a rubric of the Day 1–4 deliverables, a 🤖 Submit bar on the build's second slide, the grade stored and on the Scorecard like any other
// js/cm-companion-grade.js with js/cm-ai-grader.js, in a real browser, as a trainee with a companion case assigned:
//   · "companion-build" is registered with the AI Grader, its rubric in the activities' format (rubric.ai, 60 of 100, each
//     dimension one of the Day 1–4 deliverables; the trainer's 40);
//   · the Full Application Practice's second slide (companionBuild2) carries "Submit my companion case →" (never "AI Grader") on its ribbon, and the slide
//     still fits one screen at 1366×768 and 1920×1080;
//   · the bar opens the grader over the slide: a box for what the trainee built (the platform records none of the build),
//     handed in with Submit → (never by itself as it opens: .github/scripts/aig-evidence.cjs);
//   · submitted (the AI answered by the test, callAIJson: the test server has no AI key), the score shows in the panel and
//     on the button, is saved under "cf-ai-grades" blocks["companion-build"], and the work log (the 🏅 Scorecard's 🧪 Skill
//     Activities) has the attempt under "Build Your Companion Case", on Day 5.
// Usage: node .github/scripts/companion-grade.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const sleep = ms => new Promise(r => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
  await signIn(page, 'Cora', 'Build' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
  await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove();
    const id = Object.keys(window.CM_COMPANION_CASES || {})[0]; state.assignedCase = id ? { id, title: CM_COMPANION_CASES[id].title } : null; });

  // the rubric
  const rb = await page.evaluate(() => { const x = (window.CM_AIG_EXTRA || {})['companion-build']; if (!x) return null; const r = x.b.rubric;
    return { ai: r.ai, trainer: r.trainer, sumAi: r.ai.reduce((a, y) => a + y[1], 0), sumTr: r.trainer.reduce((a, y) => a + y[1], 0), steps: x.slide.steps.length }; });
  if (!rb) fail('the companion build is not registered with the AI Grader (CM_AIG_EXTRA["companion-build"])');
  else {
    if (rb.sumAi !== 60 || rb.sumTr !== 40) fail(`the rubric should be 60 AI / 40 trainer, as an activity's: ${rb.sumAi} / ${rb.sumTr}`);
    if (!rb.ai.every(y => Array.isArray(y) && y.length === 3 && typeof y[0] === 'string' && typeof y[1] === 'number' && typeof y[2] === 'string')) fail('rubric.ai should be [dimension, points, criteria] rows');
    [1, 2, 3, 4].forEach(n => { if (!rb.ai.some(y => new RegExp(`Day[s]? [^)]*${n}`).test(y[0]))) fail(`the rubric should grade a Day ${n} deliverable`); });
    if (rb.steps !== 7) fail(`the task should be the build's seven steps: ${rb.steps}`);
  }

  // the bar on the build's second slide, and the slide still fits
  const go = () => page.evaluate(() => { const d = DAYS.find(x => x.cf && x.cf.build), s = buildDaySlides(d), k = s.findIndex(x => x.type === 'companionBuild2');
    state.slideProgress = Object.assign({}, state.slideProgress, { [d.id]: s.length }); state.maxSlideReached = 9999;
    goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = k; render(); return k; });
  for (const [w, h] of [[1920, 1080], [1366, 768]]) {
    await page.setViewportSize({ width: w, height: h });
    const k = await go(); await sleep(500);
    const fit = await page.evaluate(() => { const wrap = document.getElementById('lessonSlideWrap'), stage = document.getElementById('lessonStage'), bar = wrap && wrap.querySelector('.cbg-go');
      const r = bar && bar.getBoundingClientRect();
      return { bar: !!bar, text: bar ? bar.textContent : '', over: wrap ? wrap.scrollHeight - wrap.clientHeight : -1, below: stage ? stage.getBoundingClientRect().bottom - innerHeight : 99, barBelow: r ? r.bottom - innerHeight : 99, pages: state.slidePages || 1,
        zoom: [...(wrap || document.body).querySelectorAll('*')].filter(e => e.style && e.style.zoom && Number(e.style.zoom) < 1).map(e => e.className + ':' + e.style.zoom).join(' ') }; });
    if (k < 0) fail('Day 5 has no Full Application Practice second slide');
    if (!fit.bar || !/Submit my companion case/.test(fit.text) || /AI Grader/.test(fit.text)) fail(`${w}×${h}: the build's second slide should carry "Submit my companion case →" (never "AI Grader"): "${fit.text}"`);
    if (fit.over > 2 || fit.below > 1 || fit.barBelow > 1 || fit.pages !== 1 || fit.zoom) fail(`${w}×${h}: the build's second slide should still fit one screen: ${JSON.stringify(fit)}`);
  }

  // open the grader: the trainee's account of the build in its box, handed in with Submit → (the AI answered by the test)
  await page.evaluate(() => { window.callAIJson = async () => ({ accuracyScore: 27, presenceScore: 23, riskScore: 16, efficiencyScore: 11,
    strengths: ['You ran the Conflict Check on every party first.'], blindspots: ['Name the gap\'s exact dates.'], growthSuggestions: ['Put the deadline in the note\'s first line.'] }); });
  await page.click('#lessonSlideWrap .cbg-go'); await sleep(400);
  const box = await page.evaluate(() => { const p = document.getElementById('cbgPanel');
    return { panel: !!p, box: !!(p && p.querySelector('textarea')), ev: p ? [...p.querySelectorAll('.aig-ev li')].map(x => x.textContent) : [], sent: ((CMAIGrader.all().blocks['companion-build'] || {}).draft) || '', go: !!(p && (p.querySelector('.aig-go') || p.querySelector('.aig-res'))) }; });
  if (!box.panel) fail('Submit my companion case → should open the grader over the slide');
  const said = await page.evaluate(() => /AI Grader/.test((document.getElementById('cbgPanel') || {}).textContent || ''));
  if (said) fail('the companion case\'s Submit panel says "AI Grader": trainees only ever see Submit');
  if (!box.box) fail('the companion case\'s Submit should have a box for what the trainee built');
  if (!box.go) fail('the panel should offer Submit →');
  await page.fill('#cbgPanel textarea', 'Conflict Check run on every party; the matter opened in the CMS; the folder built with its nine subfolders.').catch(() => {});
  await page.click('#cbgPanel .aig-go').catch(() => {}); await sleep(1500);
  const sent = await page.evaluate(() => ((CMAIGrader.all().blocks['companion-build'] || {}).draft) || '');
  if (!/My companion case/.test(sent)) fail(`what is sent should name the companion case first: ${sent.slice(0, 120)}`);
  const res = await page.evaluate(async () => { const p = document.getElementById('cbgPanel'), st = await storeGet('cf-ai-grades');
    return { shown: p && (p.querySelector('.aig-score b') || {}).textContent, saved: CMAIGrader.result('companion-build'), stored: st && st.blocks && st.blocks['companion-build'] && st.blocks['companion-build'].score,
      status: p && (p.querySelector('.aig-st') || {}).textContent,
      log: (state.workLog || []).filter(e => e.kind === 'lab' && /Build Your Companion Case/.test(e.label || '')).map(e => ({ s: e.score, l: e.label })) }; });
  const want = res.saved && res.saved.score;
  if (!res.saved || typeof want !== 'number') fail(`the companion build should be graded: ${JSON.stringify(res)}`);
  else {
    if (String(res.shown) !== String(want)) fail(`the panel should show the score ${want}: ${res.shown}`);
    if (res.stored !== want) fail(`the grade should be stored under "cf-ai-grades" blocks["companion-build"]: ${res.stored}`);
    if (!res.log.some(x => x.s === want && /Case Flow Day 5/.test(x.l))) fail(`the work log (the Scorecard's Skill Activities) should hold the attempt on Day 5: ${JSON.stringify(res.log)}`);
  }
  await page.evaluate(() => cmCompanionGrade.close());
  await go(); await sleep(400);
  const barNow = await page.evaluate(() => (document.querySelector('#lessonSlideWrap .cbg-go') || {}).textContent || '');
  if (want != null && !new RegExp(`${want}/100`).test(barNow)) fail(`the button should show the score once graded: "${barNow}"`);

  await browser.close();
  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log(`Day 5's companion build is AI graded on a rubric of the Day 1–4 deliverables (60 AI / 40 trainer): Submit on the build's second slide (which still fits), ${want}/100 shown, stored under cf-ai-grades and in the work log for the Scorecard.`);
  console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
