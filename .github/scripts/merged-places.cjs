// @check node — A place saved on a merged activity (d1m1-a1, d2m4-a1 …) lands on the Skill Building that now holds its work, not the slide before it
// js/cm-merged-places.js gives window.CM_SLIDE_KEY_RULES a rule (js/cm-slide-keys.js reads it): a saved place whose
// slide key belongs to a block with `mergedInto` (js/cm-case-flow-data.js), gone from today's deck, is put on the first
// slide of its main where the main is in the day. Checked on each day's deck as the sequence lays it out (a slide per
// block, keyed "<block>:task"): every merged block's place lands on its main; a cut block without mergedInto, a day's
// own slide and a slide still in the deck are left where js/cm-slide-keys.js put them.
// Usage: node .github/scripts/merged-places.cjs
const path = require('path');
const ROOT = process.cwd();
global.window = global;
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
require(path.join(ROOT, 'js/cm-merged-places.js'));
const CF = window.CM_CASE_FLOW, failures = [];
const rule = (window.CM_SLIDE_KEY_RULES || []).find(x => x && x.id === 'mergedPlaces');
if (!rule) { console.error('js/cm-merged-places.js gives no "mergedPlaces" rule in window.CM_SLIDE_KEY_RULES'); process.exit(1); }
const blocks = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { blocks[b.id] = b; })));
let n = 0;
(CF.sequence || []).forEach(s => {
  const ids = s.phases.flatMap(ph => ph.blocks), keys = ['~taskOverview'].concat(ids.map(id => id + ':task'), ['~practiceLab']);
  const merged = Object.values(blocks).filter(b => b.mergedInto && ids.includes(b.mergedInto));
  merged.forEach(b => {
    n++;
    const want = keys.indexOf(b.mergedInto + ':task'), got = rule.place({ id: 'day' + s.n }, { i: 3, k: [b.id + ':task', '~practiceLab'] }, 0, keys);
    if (got !== want) failures.push(`Day ${s.n}: a place saved on ${b.id} (merged into ${b.mergedInto}) lands on slide ${got} (${keys[got]}), not ${want} (${b.mergedInto})`);
  });
  const stay = keys.indexOf(ids[0] + ':task');
  if (rule.place({}, { i: stay, k: [ids[0] + ':task'] }, stay, keys) !== stay) failures.push(`Day ${s.n}: a place still in the deck was moved`);
  if (rule.place({}, { i: 0, k: ['~taskOverview'] }, 0, keys) !== 0) failures.push(`Day ${s.n}: a day's own slide was moved`);
  const cut = Object.values(blocks).find(b => b.retired && !b.mergedInto && b.kind === 'activity' && !ids.includes(b.id));
  if (cut && rule.place({}, { i: 2, k: [cut.id + ':task'] }, 2, keys) !== 2) failures.push(`Day ${s.n}: a place on ${cut.id} (cut, not merged) was moved off the nearest slide before it`);
});
if (!n) failures.push('no merged activity found: the check proves nothing');
if (failures.length) { console.error('Merged places: FAILED\n- ' + failures.join('\n- ')); process.exit(1); }
console.log(`Merged places: ${n} merged activities' saved places land on the Skill Building that holds their work.`);
