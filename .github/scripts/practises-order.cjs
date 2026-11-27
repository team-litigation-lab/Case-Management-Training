// @check node — Every Skill Activity practices a lesson the course still teaches, on its own day before it or on an earlier day (never a later one), and the lesson's skill is on its slides (its deck pages, or its drawn slides)
// Each day's deck is taught on its own day (Day N's Canva deck on Case Flow Day N), so an activity can practice a
// lesson taught a day or more before it (Day 3's demand Skill Building practices Day 2's BI Demand deck pages). Checked,
// for every activity in CF.sequence (the day's Skill Building, Backup File Maintenance and the side exercises):
//   · its `practises` names a lesson block that is not retired and is in the course's order;
//   · that lesson is taught before it on the same day, or on an earlier day: never on a later one;
//   · the lesson has slides: its deck pages (js/cm-deck-slides.js) or its own drawn slides' copy (build/case-flow/slides);
//   · a lesson whose slides are deck pages has its rules on the activity as a 💡 Tip (js/cm-lesson-tips.js), since the
//     drawn slides the activity was written against are not shown.
// Usage: node .github/scripts/practises-order.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
global.window = global;
require(path.join(ROOT, 'js/cm-deck-slides.js'));
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
require(path.join(ROOT, 'js/cm-case-flow-slides.js'));
require(path.join(ROOT, 'js/cm-lesson-tips.js'));
const CF = window.CM_CASE_FLOW, DECK = window.CM_DECK_SLIDES || {}, COPY = window.CM_CF_SLIDES || {}, TIPS = (window.CM_LESSON_TIPS || {}).TIPS || {};
const STORED = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { STORED[b.id] = b; })));
const at = {}; CF.sequence.forEach(sd => sd.phases.forEach(ph => ph.blocks.forEach((id, k) => { at[id] = { day: sd.n, k }; })));
const fail = []; let n = 0, cross = 0;
CF.sequence.forEach(sd => sd.phases.forEach(ph => ph.blocks.forEach((id, k) => {
  const b = STORED[id]; if (!b || b.kind !== 'activity') return;
  n++;
  const of = (ph.practises || {})[id], l = STORED[of], where = at[of];
  if (!of) return fail.push(`Day ${sd.n}: ${id} names no lesson it practices`);
  if (!l || l.kind !== 'lesson') return fail.push(`Day ${sd.n}: ${id} practices ${of}, which is not a lesson`);
  if (l.retired || !where) return fail.push(`Day ${sd.n}: ${id} practices ${of}, which the course no longer teaches`);
  if (where.day > sd.n) fail.push(`Day ${sd.n}: ${id} practices ${of}, taught later, on Day ${where.day}`);
  if (where.day === sd.n && where.k > k) fail.push(`Day ${sd.n}: ${id} practices ${of}, taught after it`);
  if (where.day < sd.n) cross++;
  const c = COPY[of] || {};
  if (!DECK[of] && !(c.points || []).length && !c.theory) fail.push(`Day ${sd.n}: ${id} practices ${of}, which has no slides to teach it`);
  if (DECK[of] && !(TIPS[id] || []).includes(of)) fail.push(`Day ${sd.n}: ${id} practices ${of}, a deck lesson, without its rules as a 💡 Tip`);
})));
if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`Every Skill Activity practices a lesson taught before it: ${n} activities, ${cross} on a lesson of an earlier day (a deck taught on its own day).`);
