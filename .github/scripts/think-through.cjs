// @check node — Every 🧠 Think it through challenge (js/cm-think-through.js) sits on a Skill Activity, taught on its deck's day, that practises the deck pages it is about; it is graded (AI 60, trainer 40, an answer key that reasons past the slide), and its figures are the ones the case file and those pages agree on
// Day 2's Valuation Baseline pages give John Doe's own figures (his $10,000 PIP gone in 48 hours on ER and EMS bills,
// $41,400 of bills, Dr. Sarah Spine's EMC), and the case file follows them. The challenge is critical thinking: the
// trainee reasons from those figures to their consequences on his file. Checked for each challenge in window.CM_THINK:
//   · its activity is an activity in the course's order, taught on the deck's day, whose `practises` is the lesson whose
//     slides are those deck pages (build/videoslide/dayN.json `lessons`);
//   · it is registered with the AI Grader shape (rubric.ai 60, rubric.trainer 40, steps 2–3, an answer key of 4+ items)
//     and index.html loads it;
//   · it asks for consequences, not a comparison: the question asks what the figures cause on his file; the key reasons
//     to the adjuster's valuation, the Payer Order after PIP (MedPay, Peach State, the LOP) and the file without the EMC;
//   · every figure the pages narrate ($10,000, $41,400, Dr. Sarah Spine) is the case file's: case-file.md carries each one,
//     and the key's own figures ($8,850.00, $1,150.00, $41,400.00, $42,984.00, $2,500, $7,500) are in the case file too.
// Usage: node .github/scripts/think-through.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fails = [];
global.window = {};
require(path.join(ROOT, 'js', 'cm-case-flow-data.js'));
require(path.join(ROOT, 'js', 'cm-think-through.js'));
const CF = window.CM_CASE_FLOW, THINK = window.CM_THINK || [];
const block = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { block[b.id] = b; })));
const dayOf = {}, prac = {}; CF.sequence.forEach(d => d.phases.forEach(p => { p.blocks.forEach(id => { dayOf[id] = d.n; }); Object.assign(prac, p.practises || {}); }));
if (!THINK.length) fails.push('js/cm-think-through.js has no challenge (window.CM_THINK)');
if (!/<script src="\/js\/cm-think-through\.js"><\/script>/.test(fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8'))) fails.push('index.html does not load js/cm-think-through.js');
const sum = (xs) => (xs || []).reduce((n, x) => n + x[1], 0);
const plain = (t) => String(t || '').replace(/\*\*/g, '');
const money = (t) => (plain(t).match(/\$[\d,]+\.\d\d/g) || []);
THINK.forEach((t) => {
  const a = block[t.activity], at = `${t.id} (on ${t.activity})`;
  if (!a || a.kind !== 'activity') return fails.push(`${at}: not an activity`);
  if (dayOf[t.activity] !== t.deck.day || t.n !== t.deck.day) fails.push(`${at}: taught on Day ${dayOf[t.activity]}, the deck pages are Day ${t.deck.day}'s`);
  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, `build/videoslide/day${t.deck.day}.json`), 'utf8'));
  const lesson = Object.keys(spec.lessons || {}).find((l) => t.deck.pages.every((p) => spec.lessons[l].includes(p)));
  if (!lesson) fails.push(`${at}: pages ${t.deck.pages.join(', ')} are not one lesson's slides on Day ${t.deck.day}`);
  else if (prac[t.activity] !== lesson) fails.push(`${at}: the activity practises ${prac[t.activity]}, not ${lesson} (the lesson whose slides the pages are)`);
  const r = t.rubric || {};
  if (sum(r.ai) !== 60 || sum(r.trainer) !== 40) fails.push(`${at}: rubric AI ${sum(r.ai)} / trainer ${sum(r.trainer)}; the course's rule is 60 / 40`);
  if (!(t.steps || []).length || t.steps.length > 3) fails.push(`${at}: ${(t.steps || []).length} steps (2–3)`);
  if ((t.checks || []).length < 3) fails.push(`${at}: an answer key of ${(t.checks || []).length} items`);
  const q = plain(t.situation), key = plain((t.checks || []).join(' '));
  if (!/what do they \*?\*?cause\*?\*? on his file|cause on his file/i.test(q) || !/valuation/i.test(q) || !/pays the bills next|Payer Order/i.test(q)) fails.push(`${at}: the question should ask what the slides' figures cause on his file: the valuation and who pays next`);
  if ((t.checks || []).length < 4) fails.push(`${at}: the answer key should reason through at least four points`);
  [[/high-severity|severity/i, 'the severity signal'], [/\$41,400\.00/, 'the $41,400.00 anchor'], [/MedPay[\s\S]*Peach State[\s\S]*LOP/, 'the Payer Order after PIP'],
   [/\$2,500[\s\S]{0,80}\$7,500|without the EMC/i, 'the file without the EMC']].forEach(([re, what]) => { if (!re.test(key)) fails.push(`${at}: the answer key never reasons to ${what}`); });
  if (/not John Doe's file|isn't John Doe's|page's example/i.test(q + key)) fails.push(`${at}: the slides' figures are John Doe's now; the challenge still treats them as another file's`);
  const file = fs.readFileSync(path.join(ROOT, 'curriculum/5-day-flow/case-file.md'), 'utf8');
  ['$10,000', '$41,400.00', '$42,984.00', '$8,850.00', '$1,150.00', '$2,500', 'Sarah Spine'].forEach((f) => { if (!file.includes(f)) fails.push(`${at}: the case file (case-file.md) does not carry ${f}`); });
  t.deck.pages.forEach((p) => {
    const s = spec.slides.find((x) => x.page === p);
    if (!s) return fails.push(`${at}: Day ${t.deck.day} page ${p} has no notes`);
    if (!/John Doe/.test(s.notes)) fails.push(`${at}: Day ${t.deck.day} page ${p}'s notes no longer name John Doe's file`);
  });
});
if (fails.length) { console.log(`✗ Think it through (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
console.log(`🧠 Think it through: ${THINK.length} challenge(s) (${THINK.map((t) => `Day ${t.deck.day} pages ${t.deck.pages.join('–')} on ${t.activity}`).join('; ')}), each on the activity that practises its pages, graded 60/40, its key reasoning from the slides' figures (the case file's) to their consequences.`);
