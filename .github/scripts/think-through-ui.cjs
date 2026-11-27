// @check browser — 🧠 Think it through works in the 🧪 Practice Lab: beside the 💡 Tip on the activity that practices the deck pages, it opens the question and a box for the trainee's own reasoning, and Submit grades it like every activity (the score stored under cf-ai-grades and in the work log)
// js/cm-think-through.js with js/cm-ai-grader.js, in a real browser, as a trainee:
//   · Day 2's Skill Activity d3m2-a1 (it practices the Valuation Baseline pages, Day 2 pages 23–24) has 🧠 Think it through in its
//     Your Task's tools in the 🧪 Practice Lab (in 📖 Reference, js/cm-task-card.js), next to the 💡 Tip; its deck card still fits one screen;
//   · the button opens a panel over the page: the question (what the slides' figures cause on John Doe's file), its 2–3 steps,
//     a box to write in, and Submit → (never "AI Grader"); nothing is handed in before the trainee presses Submit;
//   · submitted (the AI answered by the test, callAIJson: the test server has no AI key), the score shows in the panel, is
//     saved under "cf-ai-grades" blocks["d2-think-valuation"] with the trainee's own words as what was graded, and the
//     work log (the 🏅 Scorecard's 🧪 Skill Activities) has the attempt on Case Flow Day 2.
// Usage: node .github/scripts/think-through-ui.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const ID = 'd2-think-valuation', ACT = 'd3m2-a1';
const failures = []; const fail = (m) => failures.push(m);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', (e) => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await sleep(800);
  await signIn(page, 'Theo', 'Think' + String(Date.now()).slice(-6).replace(/\d/g, (d) => 'abcdefghij'[d]), 'B100926');
  await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });
  // Day 2 is opened as a trainer presents it (a new trainee's Day 2 is still locked); the panel is then worked as the trainee.
  // The deck has the activity's card; its Your Task is in the 🧪 Practice Lab (js/cm-task-lab.js)
  const card = () => page.evaluate((act) => { state.isAdmin = true; const d = DAYS.find((x) => x.cf && x.cf.n === 2); goto('day', d.id); state.dayViewMode = 'slides';
    const ss = buildDaySlides(d), k = ss.findIndex((s) => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === act);
    if (k < 0) return false; goToSlide(k); return true; }, ACT);
  const go = () => page.evaluate((act) => { state.isAdmin = true; return cmTaskLab.openView(act, 'task'); }, ACT);
  for (const [w, h] of [[1920, 1080], [1366, 768]]) {
    await page.setViewportSize({ width: w, height: h });
    if (!await card()) { fail(`Day 2 has no deck card for ${ACT}`); break; }
    await sleep(600);
    const c = await page.evaluate(() => { const wrap = document.getElementById('lessonSlideWrap'), stage = document.getElementById('lessonStage');
      return { card: !!(wrap && wrap.querySelector('.ctl-card .ctl-go')), over: wrap ? wrap.scrollHeight - wrap.clientHeight : -1, below: stage ? stage.getBoundingClientRect().bottom - innerHeight : 99, pages: state.slidePages || 1 }; });
    if (!c.card || c.over > 2 || c.below > 1 || c.pages !== 1) fail(`${w}×${h}: ${ACT}'s deck card (▶ Start in the Practice Lab) should fit one screen: ${JSON.stringify(c)}`);
    if (!await go()) { fail(`${ACT}'s Your Task does not open in the 🧪 Practice Lab`); break; }
    await sleep(600);
    const s = await page.evaluate(() => { const menu = document.querySelector('#app .ctl-page .cfx-tools-stash');
      const b = menu && menu.querySelector('.ctt-btn'), tip = menu && menu.querySelector('.cm-lt-btn');
      return { btn: !!b, text: b ? b.textContent : '', nextToTip: !!(b && tip && b.previousElementSibling === tip) }; });
    if (!s.btn || !/Think it through/.test(s.text)) fail(`${w}×${h}: ${ACT}'s Your Task in the 🧪 Practice Lab should carry 🧠 Think it through among its tools (📖 Reference): ${JSON.stringify(s)}`);
    else if (!s.nextToTip) fail(`${w}×${h}: 🧠 Think it through should sit next to the 💡 Tip`);
  }
  await page.evaluate(() => { window.callAIJson = async () => ({ accuracyScore: 26, presenceScore: 22, riskScore: 15, efficiencyScore: 11,
    strengths: ['You tied the 48-hour exhaustion to severity.'], blindspots: ['Work the file without the EMC.'], growthSuggestions: ['Lead with the anchor figure.'] }); });
  page.setDefaultTimeout(8000);
  await page.click('#app .cfx-ref-open').catch(() => {});
  await sleep(300);
  await page.click('.cfx-ref .cfx-ref-tools .ctt-btn').catch((e) => fail(`could not press 🧠 Think it through: ${e.message}`));
  await sleep(400);
  await page.evaluate(() => { state.isAdmin = false; });   // the trainee's own Submit
  const p = await page.evaluate((id) => { const o = document.getElementById('cttPanel');
    return { panel: !!o, q: o ? (o.querySelector('.ctt-q') || {}).textContent : '', steps: o ? o.querySelectorAll('.ctt-steps li').length : 0, box: !!(o && o.querySelector('textarea.ctt-a')),
      go: !!(o && o.querySelector('.ctt-go')), ai: /AI Grader/.test(o ? o.textContent : ''), graded: !!CMAIGrader.result(id) }; }, ID);
  if (!p.panel) fail('🧠 Think it through should open a panel over the 🧪 Practice Lab page');
  else {
    if (!/\$10,000 PIP limit in 48 hours.*\$41,400.*Dr\. Sarah Spine.*cause.*on his file/.test(p.q)) fail(`the question should ask what the slides' figures cause on John Doe's file: "${p.q}"`);
    if (p.steps < 2 || p.steps > 3) fail(`the challenge should have 2–3 steps: ${p.steps}`);
    if (!p.box) fail('the panel should have a box for the trainee\'s own reasoning');
    if (!p.go) fail('the panel should offer Submit →');
    if (p.ai) fail('the panel says "AI Grader": trainees only ever see Submit');
    if (p.graded) fail('nothing should be graded before the trainee presses Submit');
  }
  const mine = 'Harbor Point PIP paid Riverton General and the ambulance $10,000 at the fee schedule for 02/20-02/21/2026, gone by 03/04/2026: a high-severity signal against the gap. The anchor I hand Atty. Thorne is the $41,400.00 of bills, $42,984.00 with wages. Next came MedPay, then Peach State, then the LOP. Without Dr. Spine\'s EMC, PIP stops at $2,500 and $7,500 more becomes liens.';
  await page.fill('#cttPanel textarea.ctt-a', mine).catch(() => {});
  await page.click('#cttPanel .ctt-go').catch(() => {});
  await sleep(1800);
  const r = await page.evaluate(async (id) => { const o = document.getElementById('cttPanel'), st = await storeGet('cf-ai-grades'), th = await storeGet('cf-think');
    const rec = st && st.blocks && st.blocks[id];
    return { shown: o && (o.querySelector('.aig-score b') || {}).textContent, saved: CMAIGrader.result(id), stored: rec && rec.score, draft: (rec && rec.draft) || '', kept: th && th[id] && th[id].text,
      log: (state.workLog || []).filter((e) => e.kind === 'lab' && /Think It Through/.test(e.label || '')).map((e) => ({ s: e.score, l: e.label })) }; }, ID);
  const want = r.saved && r.saved.score;
  if (typeof want !== 'number') fail(`the reasoning should be graded: ${JSON.stringify(r).slice(0, 300)}`);
  else {
    if (String(r.shown) !== String(want)) fail(`the panel should show the score ${want}: ${r.shown}`);
    if (r.stored !== want) fail(`the grade should be stored under "cf-ai-grades" blocks["${ID}"]: ${r.stored}`);
    if (!r.draft.includes('$42,984.00')) fail('what was graded should be the trainee\'s own words');
    if (r.kept !== mine) fail('the trainee\'s reasoning should be kept in their record ("cf-think")');
    if (!r.log.some((x) => x.s === want && /Case Flow Day 2/.test(x.l))) fail(`the work log (the Scorecard's Skill Activities) should hold the attempt on Day 2: ${JSON.stringify(r.log)}`);
  }
  await page.evaluate(() => cmThink.close());
  await browser.close();
  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log(`🧠 Think it through: on ${ACT}'s Your Task in the 🧪 Practice Lab next to the 💡 Tip (its deck card still fits), the question against John Doe's file, the trainee's own reasoning graded ${want}/100, stored under cf-ai-grades and in the work log on Day 2.`);
  console.log('All good.');
})().catch((e) => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
