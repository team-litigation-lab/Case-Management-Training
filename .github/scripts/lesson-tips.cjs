// @check node — every 💡 Tip (js/cm-lesson-tips.js) sits on an activity still in the course and quotes a lesson that is not
'use strict';
// The lesson cards the trainers' decks replaced are out of CF.sequence; their rules are Tip pop-ups on the activity
// that practised them. A lesson taught by the trainers' deck pages (js/cm-deck-slides.js) shows its rules nowhere else
// either: every activity that practises it carries them as a Tip. Each tip must name an activity the course still teaches and a lesson the course no longer does
// (a tip repeating a lesson that is still taught is noise), and that lesson must still have its rules to show.
const path = require('path'), root = path.join(__dirname, '..', '..');
global.window = global;
require(path.join(root, 'js/cm-deck-slides.js'));
require(path.join(root, 'js/cm-case-flow-data.js'));
require(path.join(root, 'js/cm-lesson-tips.js'));
const CF = window.CM_CASE_FLOW, DECK = window.CM_DECK_SLIDES || {}, {TIPS, blockOf} = window.CM_LESSON_TIPS;
const inSeq = new Set(CF.sequence.flatMap(d => d.phases.flatMap(p => p.blocks)));
const fails = [];
for (const [act, lessons] of Object.entries(TIPS)) {
  const a = blockOf(act);
  if (!a || a.kind !== 'activity') fails.push(`${act}: not an activity`);
  else if (!inSeq.has(act)) fails.push(`${act}: the activity is not in the course's order any more`);
  for (const id of lessons) {
    const b = blockOf(id);
    if (!b || b.kind !== 'lesson') fails.push(`${act}: ${id} is not a lesson`);
    else if (inSeq.has(id) && !DECK[id]) fails.push(`${act}: ${id} is still taught on its own slides, so its tip repeats it`);
    else if (!b.tell || !(b.tell.rules || []).length) fails.push(`${act}: ${id} has no rules to show`);
  }
}
// every lesson the decks replaced has a tip somewhere
const GONE = ['d1m1-upl', 'd1m3-l1', 'd1m2-l2', 'd2m2-pip', 'd3m1-pkg', 'd3m2-l1', 'd3m2-umw'];
// and every lesson retired since (each block's own `retired`): none leaves the course without a Tip
CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { if (b.kind === 'lesson' && b.retired && !GONE.includes(b.id)) GONE.push(b.id); })));
const tipped = new Set(Object.values(TIPS).flat());
// a lesson whose slides are the trainers' deck pages shows none of its own rules: each activity that practises it carries them
CF.sequence.forEach(sd => sd.phases.forEach(ph => Object.entries(ph.practises || {}).forEach(([a, l]) => {
  if (DECK[l] && !(TIPS[a] || []).includes(l)) fails.push(`${a}: practises ${l}, whose slides are deck pages, with no Tip carrying ${l}'s rules`); })));
GONE.forEach(id => { if (!tipped.has(id)) fails.push(`${id}: taken out of the course with no Tip carrying its rules`); });
if (fails.length) { console.error('lesson-tips: FAIL\n  ' + fails.join('\n  ')); process.exit(1); }
console.log(`lesson-tips: ${Object.keys(TIPS).length} activities carry the rules of ${tipped.size} replaced lessons`);
