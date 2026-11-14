// @check node — Every Knowledge Check answer is taught on the slides (its key words are on the revised deck or the slide sources)
// The owner asked that the Knowledge Check questions come from the revised slides. For every question a Case Flow day's
// Knowledge Check asks (the 20 per day js/cm-case-flow.js takes from each module's quiz in js/cm-case-flow-data.js), the
// correct answer's key words (4+ letters, not common words) must mostly appear in what the slides show by that day: the
// revised deck's pages for Days 1…N (build/case-flow/slides/deck-pages.json) and the slide sources d1…dN.json and
// theory-d1…dN.json (a Day 2 check may ask what Day 1 taught; never what a later day teaches). A question whose
// answer the slides never teach fails here: rewrite it from a slide. (Lenient on purpose: at least 60% of the words.)
// Usage: node .github/scripts/kc-on-slides.cjs
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd(), S = path.join(ROOT, 'build/case-flow/slides');
global.window = global;
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
const CF = window.CM_CASE_FLOW;
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
if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
console.log(`Every Knowledge Check answer is taught on the slides: ${asked} questions across ${(CF.sequence || []).length} days.`);
