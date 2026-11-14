// @check browser — 🤖 the AI Grader on every Skill Building activity: its last slide takes the trainee's work (filled in from what the platform holds), grades it against the activity's rubric, shows the score with what went well and what to improve, keeps it, and puts it where trainers see activity scores; the old self-tick Check Your Work is gone
// js/cm-ai-grader.js. Every Case Flow activity ends on the AI Grader slide (view "check"): no self-tick boxes, no blurred
// answers, no "show the answers" button. On Day 1's first activity (d1m1-open), as a trainee: the box is filled in with the
// CMS Case ID they logged and the task's steps; sent untouched it isn't graded (nothing of their own yet); the AI not
// answering says so, keeps the work and offers Try again; answering, the slide shows the score, what went well and what to
// work on next, the grade is saved under the personal key "cf-ai-grades", and the work log (the Scorecard's 🧪 Skill
// Activities) has the attempt under the activity's name. The answer key stays shut while attempts are left (not beside
// "Improve it and resubmit"), and opens on 🔑 I'm done. A long prefill (a live call's transcript) keeps Submit on the
// screen at 1366×768 (the box scrolls inside). Logging out clears the grades, and a sign-in with none starts empty. The AI is answered by the test (callAIJson):
// the test server has no AI key.
// Usage: node .github/scripts/ai-grader.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  const last = 'Grade' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
  await signIn(page, 'Dana', last, 'B100926');

  // every activity ends on the AI Grader, labelled so
  const views = await page.evaluate(() => { const out = []; (window.CM_CASE_FLOW.days || []).forEach(d => d.modules.forEach(m => m.blocks.forEach(b => {
    if (b.kind !== 'activity') return; const vs = cmCaseFlow.viewsOf(b); if (vs[vs.length - 1] !== 'check' || !(b.rubric && (b.rubric.ai || []).length)) out.push(b.id); }))); return out; });
  if (views.length) fail(`activities that don't end on the AI Grader with an AI rubric: ${views.join(', ')}`);
  if (!await page.evaluate(() => typeof CMAIGrader === 'object' && PERSONAL_KEY_SET.has('cf-ai-grades'))) fail('the AI Grader should register its personal key "cf-ai-grades"');

  // a logged CMS Case ID, then the AI Grader slide of Day 1's first activity
  await page.evaluate(() => { const R = cmCaseFlow.record(); R.work = R.work || {}; R.work['d1m1-open'] = { ref: 'JD-24017', tool: 'cms', at: new Date().toISOString() };
    // a long live-call transcript in the prefill: the box must not push Submit off the slide
    CMAIGrader.all().calls['d1m1-open'] = { at: new Date().toISOString(), text: Array.from({ length: 40 }, (_, i) => (i % 2 ? 'John Doe: ' : 'Me: ') + 'This is line ' + (i + 1) + ' of a long call about the crash and the police report.').join('\n') }; });
  const go = () => page.evaluate(() => { const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
    const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === 'd1m1-open' && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'check');
    if (k < 0) return false; goToSlide(k); return true; });
  if (!await go()) fail('Day 1 has no AI Grader slide for d1m1-open');
  await page.waitForTimeout(500);
  const s = await page.evaluate(() => { const c = document.querySelector('#app .cf-card.cfx-check'); const box = c && c.querySelector('textarea.aig-box');
    return { card: !!c, label: c ? (c.querySelector('.cfx-what-v') || {}).textContent : '', legacy: c ? c.querySelectorAll('.cfx-tick, .cfx-reveal, .cfx-blank, input[type=checkbox]').length : -1,
      box: box ? box.value : null, go: !!(c && c.querySelector('.aig-go')), key: !!(c && c.querySelector('.aig-key')), pts: c ? /\bpoints\b/i.test(c.textContent) : true }; });
  if (!s.card) fail('the AI Grader slide is not drawn');
  if (!/AI Grader/.test(s.label || '')) fail(`the activity's last slide should be labelled AI Grader: "${s.label}"`);
  if (s.legacy) fail(`the old self-tick Check Your Work is still on the slide (${s.legacy} ticks or blurred answers)`);
  if (s.box == null || !/JD-24017/.test(s.box) || !/Conflict Check/.test(s.box)) fail(`the box should be filled in with the logged Case ID and the task's steps: ${JSON.stringify((s.box || '').slice(0, 300))}`);
  if (!s.go) fail('the slide has no Submit to AI Grader → button');
  if (s.key) fail('the answer key shows before the work is graded');
  if (s.pts) fail('a point counter shows before anything is submitted');
  if (!/Live call transcript/.test(s.box || '')) fail('the box should be filled in with the live call transcript');
  const reach = await page.evaluate(() => { const b = document.querySelector('#app .aig-go'); if (!b) return null; const r = b.getBoundingClientRect();
    const hit = document.elementFromPoint(r.left + r.width / 2, r.top + r.height / 2); return { bottom: Math.round(r.bottom), h: innerHeight, hit: !!hit && (hit === b || b.contains(hit)) }; });
  if (!reach || reach.bottom > reach.h || !reach.hit) fail(`with a long prefill, Submit to AI Grader should stay on the screen and clickable: ${JSON.stringify(reach)}`);

  // untouched: not sent
  let asked = 0;
  await page.exposeFunction('__asked', () => { asked++; });
  await page.evaluate(() => { window.callAIJson = async () => { window.__asked(); throw new Error('quota'); }; });
  await page.click('#app .aig-go'); await page.waitForTimeout(300);
  if (asked) fail('the box as filled in, with nothing of the trainee\'s own, was sent to the AI');
  const st0 = await page.locator('#app .aig-st').innerText();
  if (!/after each arrow/.test(st0)) fail(`an untouched box should ask the trainee to write what they did: "${st0}"`);

  // the trainee's own account; the AI not answering
  const work = 'I ran the Conflict Check on every party by full legal name and logged it as clear. I checked the intake against the Police Report and fixed the date of birth, citing the Declaration Page in Case Notes. I docketed the SOL for 02/06/2028 with reminders, mapped all six roles, filed the intake documents and sent Atty. Thorne a note of the corrections.';
  await page.fill('#app textarea.aig-box', work);
  await page.click('#app .aig-go'); await page.waitForTimeout(600);
  const st = await page.locator('#app .aig-st').innerText();
  if (!asked) fail('the trainee\'s work was not sent to the AI');
  if (!/couldn't be reached/.test(st) || !/Try again/.test(st)) fail(`the AI not answering should say so and offer Try again: "${st}"`);
  if (await page.evaluate(() => (CMAIGrader.all().blocks['d1m1-open'] || {}).draft) !== work) fail('the work should be kept when the AI does not answer');

  // Try again: the AI answers
  await page.evaluate(() => { window.callAIJson = async () => ({ accuracyScore: 28, presenceScore: 24, riskScore: 17, efficiencyScore: 12,
    strengths: ['You ran the Conflict Check before anything else.'], blindspots: ['Name which document proves each correction.'], growthSuggestions: ['Write the correction note in two lines.'] }); });
  await page.click('#app .aig-st button'); await page.waitForTimeout(1200);
  const r = await page.evaluate(() => { const c = document.querySelector('#app .cf-card.cfx-check');
    return { score: c && (c.querySelector('.aig-score b') || {}).textContent, text: c ? c.textContent : '', key: !!(c && c.querySelector('.aig-key li')),
      saved: CMAIGrader.result('d1m1-open'), log: (state.workLog || []).filter(e => e.kind === 'lab' && /Opening John Doe's File/.test(e.label || '')).map(e => e.score) }; });
  if (r.score !== '81') fail(`the slide should show the score 81: "${r.score}"`);
  if (!/What you did well/.test(r.text) || !/What to work on next/.test(r.text) || !/Conflict Check before anything else/.test(r.text)) fail('the slide should show what went well and what to work on next');
  if (r.key) fail('the answer key should stay shut while graded attempts are left (it could be copied into a resubmission)');
  if (!r.saved || r.saved.score !== 81 || r.saved.tries !== 1) fail(`the grade should be saved: ${JSON.stringify(r.saved)}`);
  if (!r.log.includes(81)) fail(`the graded attempt should be in the work log (the Scorecard's Skill Activities): ${JSON.stringify(r.log)}`);
  const stored = await page.evaluate(async () => { const v = await storeGet('cf-ai-grades'); return v && v.blocks && v.blocks['d1m1-open'] && v.blocks['d1m1-open'].score; });
  if (stored !== 81) fail(`the grade should be stored under "cf-ai-grades": ${stored}`);
  // resubmit mode: the form, still no key
  await page.evaluate(() => CMAIGrader.edit('d1m1-open')); await page.waitForTimeout(300);
  if (await page.evaluate(() => !!document.querySelector('#app .aig-key li'))) fail('the answer key shows beside the Improve-and-resubmit form');
  await page.evaluate(() => { CMAIGrader.all(); render(); });
  // 🔑 I'm done: the key opens and no more attempts
  await page.evaluate(() => { go = null; }).catch(() => {});
  await page.evaluate(async () => { await CMAIGrader.finish('d1m1-open'); }); await page.waitForTimeout(500);
  await go(); await page.waitForTimeout(400);
  const fin = await page.evaluate(() => ({ key: !!document.querySelector('#app .cf-card.cfx-check .aig-key li'), edit: /Improve it and resubmit/.test((document.querySelector('#app .cf-card.cfx-check') || {}).textContent || ''), done: !!(CMAIGrader.result('d1m1-open') || {}).done }));
  if (!fin.key || fin.edit || !fin.done) fail(`🔑 I'm done should open the answer key and end the attempts: ${JSON.stringify(fin)}`);
  // the CMS Case File reads the grade in place of the old ticks
  const cms = await page.evaluate(() => { if (!window.cmCmsFile) return null; const f = cmCmsFile.compute({ data: { 'case-flow': cmCaseFlow.record(), 'cf-ai-grades': CMAIGrader.all() }, rec: {}, cf: {} });
    return f.days.flatMap(d => d.areas.flatMap(a => a.items || [])).filter(i => i.block === 'd1m1-open').map(i => i.pct); });
  if (!cms || !cms.length || !cms.every(p => p === 81)) fail(`the CMS Case File should score d1m1-open's items at the AI grade: ${JSON.stringify(cms)}`);

  // a shared device: logging out clears the grades; the next sign-in with none starts empty
  await page.evaluate(async () => { await window.logout(); }); await page.waitForTimeout(400);
  const after = await page.evaluate(async () => ({ mem: Object.keys(CMAIGrader.all().blocks).length, stored: await storeGet('cf-ai-grades') }));
  if (after.mem || (after.stored && Object.keys(after.stored.blocks || {}).length)) fail(`logging out should clear the AI grades on this device: ${JSON.stringify(after)}`);

  await browser.close();
  if (failures.length) { console.log('✗ AI Grader:\n  ' + failures.join('\n  ')); process.exit(1); }
  console.log('AI Grader: every activity ends on it; filled in from the platform, graded against its rubric, the AI being down said plainly with Try again, the score and feedback shown, saved, and in the work log the Scorecard reads.');
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
