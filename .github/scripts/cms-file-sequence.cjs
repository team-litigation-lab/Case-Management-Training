// @check node — The CMS Case File grade (js/cm-cms-file.js) asks only for activities still on the days: a cut or merged activity nobody worked is never "missing"
// The owner cut and merged extra tasks so trainees focus on each day's Skill Building. The CMS Case File grade builds its
// rubric from every activity block in js/cm-case-flow-data.js, the retired ones included (kept so old grades resolve).
// Checks: every activity in cmCmsFile.plan() is in CM_CASE_FLOW.sequence or is marked old (retired or mergedInto, not
// taught); and with all five days closed and nothing worked, no item of an old activity is listed (not as 0, not as
// "Still to do"), while every activity still taught is.
// Usage: node .github/scripts/cms-file-sequence.cjs
const path = require('path');
const ROOT = process.cwd();
global.window = global;
global.addEventListener = () => {};
global.document = { createElement: () => ({}), head: { appendChild() {} } };
for (const f of ['js/cm-case-flow-data.js', 'js/cm-case-flow-slides.js', 'js/cm-case-flow-docs.js']) require(path.join(ROOT, f));
const CF = window.CM_CASE_FLOW;
global.DAYS = (CF.sequence || []).map(s => ({ id: 'cf-day-' + s.n, title: 'Case Flow Day ' + s.n, cf: { n: s.n } }));
require(path.join(ROOT, 'js/cm-cms-file.js'));
const F = window.cmCmsFile;

const failures = [];
const taught = new Set(); (CF.sequence || []).forEach(s => (s.phases || []).forEach(ph => (ph.blocks || []).forEach(b => taught.add(b))));
const P = F.plan();
let live = 0, old = 0;
Object.values(P.days).forEach(d => d.acts.forEach(a => {
  if (taught.has(a.id)) { live++; if (a.old) failures.push(`${a.id} is taught but marked old`); }
  else { old++; if (!a.old) failures.push(`${a.id} is in the CMS Case File plan but in no day's sequence, and not marked old (retired or merged)`); }
}));

const dayProgress = Object.fromEntries(DAYS.map(d => [d.id, { done: true, score: 80 }]));
const res = F.compute({ rec: { dayProgress }, cf: { days: {} }, data: {} });
const listed = new Set();
res.days.forEach(d => d.areas.forEach(ar => ar.items.forEach(i => { if (i.block) listed.add(i.block); })));
Object.values(P.days).forEach(d => d.acts.forEach(a => {
  if (a.old && listed.has(a.id)) failures.push(`${a.id} (cut or merged, never worked) is listed as missing work on the CMS Case File`);
  if (!a.old && !listed.has(a.id)) failures.push(`${a.id} (taught) is not on the CMS Case File`);
}));

if (failures.length) { console.error('CMS Case File follows the sequence: FAILED\n- ' + failures.join('\n- ')); process.exit(1); }
console.log(`CMS Case File follows the sequence: ${live} taught activities graded, ${old} cut or merged ones kept only for work done on them before.`);
