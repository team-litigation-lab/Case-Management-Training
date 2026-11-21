// @check node — The CMS Case File grade (js/cm-cms-file.js) grades only what a trainee can do: an ungraded activity is still to do, the AI grade wins over old ticks, documents are due when a taught activity offers them
// Nothing writes Check Your Work ticks any more (the AI Grader took their place), and a document can only be filed from a
// taught activity's 📤 panel (CM_CF_DOC_PACKETS of a block in CM_CASE_FLOW.sequence). Checks:
//  1. an activity worked (its CMS Case ID logged) whose AI grading failed or is still running is "Still to do" while the
//     day is open, not 0 on every item; once the day closes it counts 0 as unworked (so the 100-point model doesn't count it)
//  2. an AI Grader score beats ticks left from the old self-check on the same activity
//  3. a trainee with every taught activity graded 100 and every document a taught activity offers filed first time gets
//     100 on every day and on the file; a document only in a cut activity's packet is never missing, and a document is
//     never due before the day that first offers it
// Usage: node .github/scripts/cms-file-grading.cjs
const path = require('path');
const ROOT = process.cwd();
global.window = global;
global.addEventListener = () => {};
global.document = { createElement: () => ({}), head: { appendChild() {} } };
for (const f of ['js/cm-case-flow-data.js', 'js/cm-case-flow-slides.js', 'js/cm-case-flow-docs.js']) require(path.join(ROOT, f));
const CF = window.CM_CASE_FLOW, PK = window.CM_CF_DOC_PACKETS || {};
global.DAYS = (CF.sequence || []).map(s => ({ id: 'cf-day-' + s.n, title: 'Case Flow Day ' + s.n, cf: { n: s.n } }));
require(path.join(ROOT, 'js/cm-cms-file.js'));
const F = window.cmCmsFile;
const failures = [];
const OPEN = 'd1m1-open';
const items = (res, n, id) => [].concat(...res.days.find(d => d.n === n).areas.map(a => a.items)).filter(i => i.block === id);
const P = F.plan();
const actDay = Object.entries(P.days).find(([, d]) => d.acts.some(a => a.id === OPEN));
if (!actDay) failures.push(`${OPEN} is not in the CMS Case File plan`);
else {
  const n = Number(actDay[0]), dayId = 'cf-day-' + n;
  const base = { 'case-flow': { work: { [OPEN]: { ref: 'LSH-0001', tool: 'cms' } } }, 'cms-file': { caseId: 'LSH-0001', client: 'John Doe', dol: '2025-01-01' } };
  // 1. worked, grading failed
  const failed = Object.assign({}, base, { 'cf-ai-grades': { blocks: { [OPEN]: { tries: 1, failed: { why: 'busy' } } } } });
  let its = items(F.compute({ rec: { dayProgress: {} }, cf: { days: {} }, data: failed }), n, OPEN);
  if (!its.length || its.some(i => i.pct != null || !i.pending)) failures.push(`${OPEN} worked with its AI grading failed, day open: its items are ${JSON.stringify(its.map(i => i.pct))}, not all "Still to do"`);
  its = items(F.compute({ rec: { dayProgress: { [dayId]: { done: true } } }, cf: { days: {} }, data: failed }), n, OPEN);
  if (!its.length || its.some(i => i.pct !== 0 || !i.unworked)) failures.push(`${OPEN} worked but never graded, day closed: its items should count 0 as unworked, got ${JSON.stringify(its.map(i => [i.pct, !!i.unworked]))}`);
  // 2. old ticks + newer AI grade
  const k = (P.days[n].acts.find(a => a.id === OPEN).checks || []).length;
  const ticked = Object.assign({}, base, { 'case-flow': Object.assign({}, base['case-flow'], { ticks: { [OPEN]: [true].concat(Array(Math.max(0, k - 1)).fill(false)) } }), 'cf-ai-grades': { blocks: { [OPEN]: { score: 92 } } } });
  its = items(F.compute({ rec: { dayProgress: {} }, cf: { days: {} }, data: ticked }), n, OPEN);
  if (!its.length || its.some(i => i.pct !== 92 || !i.fromAI)) failures.push(`${OPEN} with old ticks and an AI grade of 92: its items are ${JSON.stringify(its.map(i => i.pct))}, not the AI grade`);
}
// 3. a perfect trainee
const taught = {}; (CF.sequence || []).forEach(s => (s.phases || []).forEach(ph => (ph.blocks || []).forEach(b => { taught[b] = s.n; })));
const offered = {}; Object.entries(PK).forEach(([b, ids]) => { if (taught[b]) (ids || []).forEach(id => { offered[id] = Math.min(offered[id] || Infinity, taught[b]); }); });
const ai = {}, filing = {};
Object.values(P.days).forEach(d => d.acts.forEach(a => { if (!a.old) ai[a.id] = { score: 100 }; }));
Object.keys(offered).forEach(id => { filing[id] = { filed: true, attempts: 1, name: 'x', category: 'y' }; });
Object.entries(P.days).forEach(([n, d]) => d.docs.forEach(x => { if (!x.old && offered[x.id] > Number(n)) failures.push(`${x.id} is due on Day ${n}, but no taught activity offers it before Day ${offered[x.id]}`); }));
const perfect = { 'case-flow': { work: { [OPEN]: { ref: 'LSH-0001', tool: 'cms' } } }, 'cms-file': { caseId: 'LSH-0001', client: 'John Doe', dol: '2025-01-01' }, 'cf-ai-grades': { blocks: ai }, 'doc-filing': filing };
const all = Object.fromEntries(DAYS.map(d => [d.id, { done: true }]));
const res = F.compute({ rec: { dayProgress: all }, cf: { days: {} }, data: perfect });
res.days.forEach(d => { if (d.pct != null && d.pct !== 100) failures.push(`a perfect trainee gets Day ${d.n} ${d.pct}% (${d.areas.filter(a => a.pct !== 100).map(a => `${a.a.id} ${a.pct}%: ${a.items.filter(i => i.pct !== 100).map(i => i.doc || i.block).join(', ')}`).join('; ')})`); });
if (res.pct !== 100) failures.push(`a perfect trainee's CMS Case File is ${res.pct}%, not 100%`);
// day 1 closed, nothing later: every Day 1 document is one Day 1 offers
const d1 = F.compute({ rec: { dayProgress: { 'cf-day-1': { done: true } } }, cf: { days: {} }, data: perfect }).days.find(d => d.n === 1);
const d1docs = (d1.areas.find(a => a.a.id === 'docs') || { items: [] }).items.filter(i => i.pct !== 100);
if (d1docs.length) failures.push(`a perfect trainee with Day 1 closed is missing ${d1docs.length} Day 1 documents: ${d1docs.map(i => i.doc).join(', ')}`);

if (failures.length) { console.error('CMS Case File grading: FAILED\n- ' + failures.join('\n- ')); process.exit(1); }
console.log(`CMS Case File grading: ungraded work is still to do, AI grades beat old ticks, a perfect trainee gets 100% (${Object.keys(offered).length} documents a taught activity offers).`);
