// @check node — Every 🧠 Think it through challenge (js/cm-think-through.js) sits on a Skill Activity, taught on its deck's day, that practises the deck pages it is about; it is graded (AI 60, trainer 40, an answer key), and the narration of those pages never says John Doe's figures
// The owner's Canva pages keep the example they were made with, and their narration says what the page says
// (narration-captions.cjs). Where the example is not John Doe's file, a 🧠 Think it through challenge on the activity
// that practises the page has the trainee work the page's method on his own figures: his figures are in its answer key,
// never in the narrated notes. Checked for each challenge in window.CM_THINK:
//   · its activity is an activity in the course's order, taught on the deck's day, whose `practises` is the lesson whose
//     slides are those deck pages (build/videoslide/dayN.json `lessons`);
//   · it is registered with the AI Grader shape (rubric.ai 60, rubric.trainer 40, steps 2–3, an answer key, a question
//     that names the page's example) and index.html loads it;
//   · the narrated notes of those pages say none of the answer key's figures (his PIP carrier, his Specials).
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
  if (!/The slide's example uses .+ Work them out on John Doe's file: what changes, and why\?/.test(plain(t.situation))) fails.push(`${at}: the question does not set the slide's example against John Doe's file`);
  // his figures (in the key, not in the page's own example) are never narrated
  const theirs = new Set(money(t.situation).concat(money(t.figures)));
  const his = [...new Set(t.checks.flatMap(money))].filter((m) => !theirs.has(m));
  if (!his.length) fails.push(`${at}: the answer key gives no figure of John Doe's`);
  const words = (m) => { const n = Number(m.replace(/[$,]/g, '')); return n >= 1000 ? [m, m.replace(/\.00$/, '')] : [m]; };
  t.deck.pages.forEach((p) => {
    const s = spec.slides.find((x) => x.page === p);
    if (!s) return fails.push(`${at}: Day ${t.deck.day} page ${p} has no notes`);
    his.forEach((m) => { if (words(m).some((w) => s.notes.includes(w))) fails.push(`${at}: page ${p}'s narrated notes say ${m}, John Doe's figure from the answer key`); });
    if (/sixteen thousand four hundred|Harbor Point/.test(s.notes)) fails.push(`${at}: page ${p}'s narrated notes give John Doe's own PIP or Specials`);
  });
});
if (fails.length) { console.log(`✗ Think it through (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
console.log(`🧠 Think it through: ${THINK.length} challenge(s) (${THINK.map((t) => `Day ${t.deck.day} pages ${t.deck.pages.join('–')} on ${t.activity}`).join('; ')}), each on the activity that practises its pages, graded 60/40 with an answer key, John Doe's figures never narrated.`);
