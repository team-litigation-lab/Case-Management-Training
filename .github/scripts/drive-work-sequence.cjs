// @check node — ✍ Where your written work goes names only activities still on the days, and work for a merged activity is graded as its main's
// The owner cut and merged extra tasks so trainees focus on each day's Skill Building. worker-drive-work.js keeps every old
// WORK entry so earlier grades and trainer overrides still resolve, but:
//   1. workGuide (the trainee's "✍ Where your written work goes, and how to head it") offers a heading only for an
//      activity in CM_CASE_FLOW.sequence: never a cut or merged one;
//   2. every activity still taught that WORK lists is offered;
//   3. a file headed with a merged activity's title (a Policy Stack, a Specials audit, a wage worksheet, a disbursement)
//      is graded as the main that now holds that checkpoint (its mergedInto), with the main's rubric.
// Usage: node .github/scripts/drive-work-sequence.cjs
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const ROOT = process.cwd();
(async () => {
  const W = await import(pathToFileURL(path.join(ROOT, 'worker-drive-work.js')).href);
  const src = fs.readFileSync(path.join(ROOT, 'js/cm-case-flow-data.js'), 'utf8');
  global.window = {}; require(path.join(ROOT, 'js/cm-case-flow-data.js'));
  const CF = window.CM_CASE_FLOW, failures = [];
  const taught = new Set(); (CF.sequence || []).forEach(s => (s.phases || []).forEach(ph => (ph.blocks || []).forEach(b => taught.add(b))));
  const catalog = W.parseActivities(src), homes = {};
  Object.values(catalog).forEach(a => { homes[a.folder] = homes[a.folder] || `01 Clients/Doe-John/${a.folder}`; });
  const guide = W.workGuide(catalog, homes), offered = new Set(guide.map(g => g.id));
  guide.forEach(g => { if (!taught.has(g.id)) failures.push(`the ✍ guide offers "${g.heading}" (${g.id}), which is in no day's sequence`); });
  Object.values(catalog).forEach(a => { if (taught.has(a.id) && !offered.has(a.id)) failures.push(`${a.id} is taught and written work, but the ✍ guide doesn't offer it`); });
  let merged = 0;
  Object.values(catalog).filter(a => a.mergedInto).forEach(a => {
    merged++;
    if (!catalog[a.mergedInto]) { failures.push(`${a.id} is merged into ${a.mergedInto}, which WORK doesn't list: its work has nowhere to be graded`); return; }
    const m = W.matchWork(`Day ${a.day} ${a.title}`, `Day ${a.day} · ${a.title}\n` + 'notes '.repeat(20), homes[a.folder], catalog, homes);
    if (m.id !== a.mergedInto) failures.push(`a file headed "Day ${a.day} · ${a.title}" (merged into ${a.mergedInto}) is matched to ${m.id || m.why}`);
  });
  if (failures.length) { console.error('Written work follows the sequence: FAILED\n- ' + failures.join('\n- ')); process.exit(1); }
  console.log(`Written work follows the sequence: ${guide.length} headings offered, all taught; ${merged} merged activities' work graded as their mains'.`);
})().catch(e => { console.error(e); process.exit(1); });
