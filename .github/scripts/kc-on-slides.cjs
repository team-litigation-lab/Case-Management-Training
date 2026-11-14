// @check node — Every Knowledge Check answer is taught on the slides (its key words are on the revised deck or the slide sources)
// The owner asked that the Knowledge Check questions come from the revised slides. For every question a Case Flow day's
// Knowledge Check asks (the 20 per day js/cm-case-flow.js takes from each module's quiz in js/cm-case-flow-data.js), the
// correct answer's key words (4+ letters, not common words) must mostly appear in what the slides show by that day: the
// revised deck's pages for Days 1…N (build/case-flow/slides/deck-pages.json) and the slide sources d1…dN.json and
// theory-d1…dN.json (a Day 2 check may ask what Day 1 taught; never what a later day teaches). A question whose
// answer the slides never teach fails here: rewrite it from a slide. (Lenient on purpose: at least 60% of the words.)
// And on the slides as they are SHOWN (the deck was decluttered: a lesson's slides are its deck pages, or at most three
// of its drawn slides): the answer's key words must also be in what the days so far put on screen: each lesson's deck
// pages (build/case-flow/slides/deck-pages.json, by the deck it comes from), the drawn slides a lesson still shows
// (The Theory, The Framework, The Document, The Rules … as js/cm-case-flow.js `lean` keeps them) and the 💡 Tips that
// carry a deck lesson's or a retired lesson's rules on its activities (js/cm-lesson-tips.js). A figure the trainee
// works out from the question (a total, a pro-rata share) is not looked for on screen; its words are.
// Usage: node .github/scripts/kc-on-slides.cjs
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd(), S = path.join(ROOT, 'build/case-flow/slides');
global.window = global;
require(path.join(ROOT, 'js/cm-deck-slides.js'));
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
require(path.join(ROOT, 'js/cm-lesson-tips.js'));
const CF = window.CM_CASE_FLOW, DK = window.CM_DECK_SLIDES || {}, TIPS = (window.CM_LESSON_TIPS || {}).TIPS || {};
const MIN = 0.6, QUIZ_N = 20;
const flat = o => typeof o === 'string' ? o + ' ' : Array.isArray(o) ? o.map(flat).join(' ') : o && typeof o === 'object' ? Object.values(o).map(flat).join(' ') : '';
const read = f => JSON.parse(fs.readFileSync(path.join(S, f), 'utf8'));
const norm = s => String(s).toLowerCase().replace(/\*\*/g, '').replace(/[’']/g, "'").replace(/[^a-z0-9%$.\/ -]+/g, ' ');
const deck = read('deck-pages.json');
const upTo = {};   // what the slides have taught by the end of day n
for (let n = 1, text = ''; n <= 5; n++) {
  text += flat(deck[n] || deck[String(n)] || {});
  for (const f of [`d${n}.json`, `theory-d${n}.json`]) if (fs.existsSync(path.join(S, f))) text += flat(read(f));
  upTo[n] = norm(text);
}
const STOP = new Set('that this from with which what when where their they them than then your into only every each does should have been will would could about also must case manager'.split(' '));
const words = s => [...new Set(norm(s).split(/[\s\/-]+/).map(w => w.replace(/^\.+|\.+$/g, '')).filter(w => w.length >= 4 && !STOP.has(w)))];

const failures = [];
const STORED = {}; CF.days.forEach(day => day.modules.forEach(mod => mod.blocks.forEach(b => { STORED[b.id] = { mod, block: b }; })));
let asked = 0;
(CF.sequence || []).forEach(seq => {
  const pools = [];
  seq.phases.forEach(ph => ph.blocks.forEach(id => { const at = STORED[id]; if (at && at.block.kind === 'check') pools.push((at.mod.quiz || []).map((q, i) => ({ q, mod: at.mod.id, i }))); }));
  const take = pools.map(() => 0); let left = Math.min(QUIZ_N, pools.reduce((a, p) => a + p.length, 0));
  for (let k = 0; left; k = (k + 1) % pools.length) if (take[k] < pools[k].length) { take[k]++; left--; }
  pools.flatMap((p, k) => p.slice(0, take[k])).forEach((x, n) => {
    asked++;
    const w = words(x.q.opts[x.q.a]); if (!w.length) return;
    const SLIDES = upTo[Math.min(5, seq.n)] || upTo[5], miss = w.filter(t => !SLIDES.includes(t));
    if ((w.length - miss.length) / w.length < MIN) failures.push(`Case Flow Day ${seq.n}, question ${n + 1} (${x.mod} quiz #${x.i + 1}): "${x.q.q}" — its answer "${x.q.opts[x.q.a]}" isn't on the slides (missing: ${miss.join(', ')})`);
  });
});
// what the slides SHOW, day by day
const COPY = {}, TH = {};
for (let n = 1; n <= 5; n++) { Object.assign(COPY, read(`d${n}.json`)); if (fs.existsSync(path.join(S, `theory-d${n}.json`))) Object.assign(TH, read(`theory-d${n}.json`)); }
const LEAN = ['theory', 'why', 'rules', 'doc', 'frame', 'theory2', 'model', 'map', 'dodont'];   // js/cm-case-flow.js lean: at most 3: The Theory, The Rules, the Red Flag's own slide, then in this order
const lean = (vs, b) => { if (vs.length <= 3) return vs; const rf = (COPY[b.id] || {}).redFlag || {}, home = !rf.spoken && rf.on;   // the Red Flag's own slide is kept third
  const k = new Set(LEAN.filter(v => vs.includes(v) && (v === 'theory' || v === 'why' || v === 'rules' || v === home)).concat(LEAN.filter(v => vs.includes(v))).slice(0, 3)); return vs.filter(v => k.has(v)); };
function viewsOf(b) {   // js/cm-case-flow.js viewsOf, for a drawn lesson
  const c = COPY[b.id] || {}, t = TH[b.id] || c.theory, map = c.roadmap && !c.roadmap.merge ? ['map'] : [];
  const th = !t ? [] : (t.concepts.length > 4 ? ['theory', 'theory2'] : ['theory']).concat(t.framework ? ['frame'] : []), doc = c.document ? ['doc'] : [], why = th.length && !c.whySlide ? [] : ['why'];
  return lean(b.brief ? ['why'].concat(doc, ['rules']) : b.compact ? map.concat(th.slice(0, 1), why, doc, ['rules']) : map.concat(th, why, doc, ['rules'], b.show ? ['model'] : [], (b.best || []).length && !b.noGame ? ['dodont'] : []), b);
}
const tipText = b => b && b.tell ? flat([b.tell.why, b.tell.rules]) : '';
function shown(b) {
  if (b.kind === 'activity') return (TIPS[b.id] || []).map(id => tipText((STORED[id] || {}).block)).join(' ');
  if (b.kind !== 'lesson') return '';
  if (DK[b.id]) return DK[b.id].map(p => flat(((deck[(p.img.match(/day(\d)/) || [])[1]] || {})[p.page]) || {})).join(' ');
  const c = COPY[b.id] || {}, t = TH[b.id] || c.theory || {}, vs = viewsOf(b), cs = t.concepts || [], half = Math.ceil(cs.length / 2);
  return [vs.includes('why') || vs.includes('theory') ? [c.hook, c.whyLine] : [], vs.includes('theory') ? [t.lead, cs.length > 4 ? cs.slice(0, half) : cs] : [],
    vs.includes('theory2') ? cs.slice(half) : [], vs.includes('frame') ? t.framework : [], vs.includes('doc') ? c.document : [], vs.includes('map') ? c.roadmap : [],
    vs.includes('rules') ? [c.points, c.upl, c.ruleEx, c.redFlag, c.milestones] : [], vs.includes('model') ? b.show : [], vs.includes('dodont') ? [c.dos, c.donts] : []].map(flat).join(' ');
}
const onScreen = {}; let seen = '';
(CF.sequence || []).slice().sort((a, b) => a.n - b.n).forEach(sd => { sd.phases.forEach(ph => ph.blocks.forEach(id => { if (STORED[id]) seen += shown(STORED[id].block) + ' '; })); onScreen[sd.n] = norm(seen); });
const figure = w => /^[$]?[0-9][0-9.,%]*$/.test(w);
(CF.sequence || []).forEach(seq => {
  const pools = [];
  seq.phases.forEach(ph => ph.blocks.forEach(id => { const at = STORED[id]; if (at && at.block.kind === 'check') pools.push((at.mod.quiz || []).map((q, i) => ({ q, mod: at.mod.id, i }))); }));
  const take = pools.map(() => 0); let left = Math.min(QUIZ_N, pools.reduce((a, p) => a + p.length, 0));
  for (let k = 0; left; k = (k + 1) % pools.length) if (take[k] < pools[k].length) { take[k]++; left--; }
  pools.flatMap((p, k) => p.slice(0, take[k])).forEach((x, n) => {
    const w = words(x.q.opts[x.q.a]).filter(t => !figure(t)); if (!w.length) return;
    const miss = w.filter(t => !onScreen[seq.n].includes(t));
    if ((w.length - miss.length) / w.length < MIN) failures.push(`Case Flow Day ${seq.n}, question ${n + 1} (${x.mod} quiz #${x.i + 1}): "${x.q.q}" — its answer "${x.q.opts[x.q.a]}" isn't on any slide shown by then (missing: ${miss.join(', ')})`);
  });
});
if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
console.log(`Every Knowledge Check answer is taught on the slides, and on the slides as shown (deck pages, the drawn slides kept, the 💡 Tips): ${asked} questions across ${(CF.sequence || []).length} days.`);
