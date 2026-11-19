// @check node — Every side exercise's speaker notes tell its own short exercise: the steps on Your Task, the "Assuming …" scenario on Your Case, Submit and the one thing to watch for on the Submit slide
// The trainer's talking points (build/case-flow/scripts/dN.json → js/cm-case-flow-scripts.js) for every side exercise of
// the daily loop (every activity that is neither the day's Skill Building, CF.sequence `main`, nor its required Backup
// File Maintenance, `drive`), checked against its slide copy (js/cm-case-flow-slides.js):
//   · Your Task (task): says it is a short skill activity (never "optional"), and names each of its steps in order ("Step 1: …");
//   · Your Case (case): the scenario is the copy's own assumption ("Assuming …"), not the long scenario it replaced;
//   · Submit (check): says what Submit grades (never "AI Grader": trainers and trainees see Submit), what it looks
//     for (the copy's checks) and "the one thing to watch for" (the copy's first don't);
//   · the day's Skill Building and Backup File Maintenance keep their full notes (not the short side form).
// Usage: node .github/scripts/side-notes.cjs   (no server, no browser needed)
const path = require('path');
const ROOT = path.resolve(__dirname, '../..');
global.window = {};
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
require(path.join(ROOT, 'js/cm-case-flow-slides.js'));
require(path.join(ROOT, 'js/cm-case-flow-scripts.js'));
const CF = window.CM_CASE_FLOW, SL = window.CM_CF_SLIDES, SC = window.CM_CF_SCRIPTS;
const plain = s => String(s || '').replace(/\*\*/g, '').replace(/\s*→\s*/g, ' › ').replace(/\s+/g, ' ').trim();
const norm = s => plain(s).replace(/(\d{2}\/\d{2}(?:\/\d{4})?) › (\d{2}\/\d{2}(?:\/\d{4})?)/g, '$1 to $2').replace(/[•\n]/g, ' ').replace(/[.;:,]/g, '').replace(/\s+/g, ' ').toLowerCase().trim();
const KIND = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { KIND[b.id] = b.kind; })));
const failures = [], fail = m => failures.push(m);
let n = 0;
CF.sequence.forEach(sd => {
  const ids = sd.phases.flatMap(ph => ph.blocks);
  ids.forEach(id => {
    const c = SL[id], s = SC[id] || {};
    if (!c || KIND[id] !== 'activity') return;   // activities only
    if (id === sd.main || id === sd.drive) {
      if (/Optional side exercise|Skill activity, a few minutes/i.test(Object.values(s).map(x => x.say).join(' '))) fail(`${id}: the day's ${id === sd.main ? 'Skill Building' : 'Backup File Maintenance'} is not a side exercise; its notes say so`);
      return;
    }
    if (!c.side) return;
    n++;
    const task = norm((s.task || {}).say), kase = norm((s.case || {}).say), check = norm((s.check || {}).say);
    if (!/skill activity a few minutes/.test(task) || /optional/.test(task)) fail(`${id}: Your Task's notes should say it is a short skill activity (never "optional")`);
    let at = 0;
    (c.steps || []).forEach((st, i) => { const k = task.indexOf(`step ${i + 1}`); if (k < at) fail(`${id}: Your Task's notes should name step ${i + 1}, in order`); at = Math.max(at, k);
      const head = norm(st).split(' ').slice(0, 5).join(' '); if (!task.includes(head)) fail(`${id}: Your Task's notes should carry step ${i + 1} ("${head} …")`); });
    const sit = norm(c.situation).split(' ').slice(0, 10).join(' ');
    if (!/^assuming/.test(kase) || !kase.includes(sit)) fail(`${id}: Your Case's notes should open on the copy's assumption ("${sit} …"): "${kase.slice(0, 80)}"`);
    if (!/^submit they submit the entry/.test(check) || /ai grader/.test(check)) fail(`${id}: the Submit slide's notes should open on Submit (never "AI Grader"): "${check.slice(0, 60)}"`);
    (c.checks || []).forEach(x => { const h = norm(x).split(' ').slice(0, 3).join(' '); if (!check.includes(h)) fail(`${id}: the Submit slide's notes should say what it looks for ("${h} …")`); });
    if ((c.donts || []).length && !check.includes('the one thing to watch for ' + norm(c.donts[0]).split(' ').slice(0, 3).join(' '))) fail(`${id}: the Submit slide's notes should name the one thing to watch for (the copy's first don't)`);
  });
});
if (n < 15) fail(`only ${n} side exercises found; the course keeps about twenty (four a day, three on Day 5)`);   // fifty until the owner cut the extra tasks
if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 40).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
console.log(`Speaker notes: all ${n} side exercises tell their own short exercise (the steps, the "Assuming …" scenario, Submit and the one thing to watch for); the Skill Building and the Backup File Maintenance keep their full notes.`);
