// @check browser — 🧑‍🏫 a trainer's own feedback on a graded Practice Lab activity: written in the feedback composer, saved to the trainee's feedback record, shown to the trainee under the grade
// js/cm-trainer-notes.js. As a trainee: an activity graded on the Submit slide shows no trainer note until one is in their
// feedback record (activities[<blockId>]), then "🧑‍🏫 Your trainer's feedback" with its words, and the grade's sections
// (the coach's note, what went well, what to work on, what could have been done better) have no "AI" label. As a trainer:
// the feedback composer (renderFeedbackAdmin) lists the trainee's graded activity with a box; Save writes
// feedback:<id>.activities[<blockId>] (keeping the record's days), and an empty box removes the note.
// Usage: node .github/scripts/trainer-notes.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  const last = 'Notes' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
  await signIn(page, 'Tina', last, 'B100926');
  if (!await page.evaluate(() => !!window.cmTrainerNotes)) fail('js/cm-trainer-notes.js is not loaded');

  // a graded activity, as the grader leaves it
  await page.evaluate(async () => {
    window.callAIJson = async () => ({ accuracyScore: 28, presenceScore: 24, riskScore: 17, efficiencyScore: 12, summary: 'A solid start on the file.',
      strengths: ['You ran the Conflict Check first.'], blindspots: ['Your note has no sources → Atty. Thorne cannot check it → Add the source after each fix.'],
      better: ['You could have checked each field against the Police Report before typing.'], growthSuggestions: ['Write the note in two lines.'] });
    const R = cmCaseFlow.record(); R.work = R.work || {}; R.work['d1m1-open'] = { ref: 'JD-24017', tool: 'cms', at: new Date().toISOString() };
  });
  const go = () => page.evaluate(() => { const d = DAYS.find(d => d.cf && d.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
    const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === 'd1m1-open' && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'task');
    if (k < 0) return false; goToSlide(k); cmCaseFlow.mode('d1m1-open', 'check'); return true; });
  if (!await go()) fail('Day 1 has no Submit slide for d1m1-open');
  await page.waitForTimeout(1500);
  const graded = await page.evaluate(() => { const c = document.querySelector('#app .cf-card.cfx-check'); return { text: c ? c.innerText : '', note: !!(c && c.querySelector('.tn-note')) }; });
  if (!/What you could have done better/.test(graded.text)) fail('the grade should have a "What you could have done better" section');
  if (!/Your coach's note/.test(graded.text)) fail('the grade should open with the coach\'s note');
  if (/\bAI\b/.test(graded.text)) fail(`the grade's feedback should carry no "AI" label: "${(graded.text.match(/.{0,40}\bAI\b.{0,40}/) || [''])[0]}"`);
  if (graded.note) fail('no trainer note should show before a trainer writes one');

  // the trainer's note in the trainee's record: it shows under the grade
  await page.evaluate(() => { state.myFeedbackRaw = { days: {}, activities: { 'd1m1-open': { comment: 'Good eye on the date of birth. Next time, name the source in the same line.', by: 'Coach Rivera', at: new Date().toISOString() } } }; render(); });
  await go(); await page.waitForTimeout(800);
  const shown = await page.evaluate(() => { const n = document.querySelector('#app .cf-card.cfx-check .tn-note'); return n ? n.innerText : ''; });
  if (!/Your trainer's feedback/.test(shown) || !/name the source in the same line/.test(shown) || !/Coach Rivera/.test(shown)) fail(`the trainee should see the trainer's note under the grade: "${shown}"`);

  // the trainer: the composer lists the graded activity; Save writes activities[<blockId>] and keeps the days
  const trainer = await page.evaluate(async () => {
    const id = state.traineeId, store = { ['feedback:' + id]: { days: { 11: { status: 'sent', text: 'Day 1 review' } } } }, wrote = [];
    const g0 = window.sharedGet, s0 = window.sharedSet;
    window.sharedGet = async (k) => JSON.parse(JSON.stringify(store[k] || null)); window.sharedSet = async (k, v) => { store[k] = JSON.parse(JSON.stringify(v)); wrote.push(k); return true; };
    state.isAdmin = true; state.adminPreview = false; state.traineeName = 'Coach Rivera';
    state.traineeWork = state.traineeWork || {};
    state.traineeWork[id] = { snap: { 'cf-ai-grades': CMAIGrader.all() }, feedback: JSON.parse(JSON.stringify(store['feedback:' + id])) };
    const rec = { id, name: 'Tina' };
    const html = renderFeedbackAdmin(rec);
    const box = document.createElement('div'); box.innerHTML = html; document.body.appendChild(box);
    const listed = /Practice Lab: your feedback on each graded activity/.test(html) && /Opening John Doe(&#39;|')s File in the CMS/.test(html);
    const ta = document.getElementById('tn_' + id.replace(/[^A-Za-z0-9_-]/g, '_') + '_d1m1-open');
    if (ta) ta.value = 'Strong start. Cite the Police Report for each fix.';
    await cmTrainerNotes.save(id, 'd1m1-open');
    const saved = store['feedback:' + id];
    if (ta) ta.value = '';
    await cmTrainerNotes.save(id, 'd1m1-open');
    const cleared = store['feedback:' + id];
    box.remove(); window.sharedGet = g0; window.sharedSet = s0; state.isAdmin = false;
    return { listed, box: !!ta, saved, cleared, wrote };
  });
  if (!trainer.listed) fail('the trainer\'s feedback composer should list the trainee\'s graded activity');
  if (!trainer.box) fail('each graded activity should have a box for the trainer\'s feedback');
  const n = trainer.saved && trainer.saved.activities && trainer.saved.activities['d1m1-open'];
  if (!n || n.comment !== 'Strong start. Cite the Police Report for each fix.' || n.by !== 'Coach Rivera' || !n.at) fail(`Save should write activities[d1m1-open] with the words, who and when: ${JSON.stringify(trainer.saved)}`);
  if (!trainer.saved || !trainer.saved.days || !trainer.saved.days[11]) fail('saving a note should keep the record\'s day reviews');
  if (trainer.cleared && trainer.cleared.activities && trainer.cleared.activities['d1m1-open']) fail('saving an empty box should remove the note');

  await browser.close();
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('🧑‍🏫 Trainer notes: the grade has a coach\'s note and "What you could have done better" with no AI label; a trainer\'s note is saved to the trainee\'s feedback record from the composer, removed when emptied, and shown to the trainee under the grade.');
})().catch(e => { console.error(e); process.exit(1); });
