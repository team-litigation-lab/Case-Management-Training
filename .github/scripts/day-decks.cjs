// @check node — The Day 2, 3, 4 and 5 decks are lessons, as Day 1's: every teaching page is one lesson's slide, with its picture and talking points; no page is shown beside the lessons, and none is a Skill Building, title, agenda or Thank You page
// The trainers' decks teach the course the way Day 1's does: build/videoslide/dayN.json `lessons` names the deck pages
// that ARE a lesson's slides (js/cm-deck-slides.js window.CM_DECK_SLIDES, drawn by js/cm-case-flow.js viewsOf), on
// the day the course teaches that lesson. No deck page is shown on its own beside the lessons any more (the old
// "onDeck" topics, js/cm-day-decks.js and js/cm-deck-pages.js, are gone: they repeated the drawn lessons). Checked, for
// Days 2 to 5:
//   · no `onDeck` in the notes and nothing in window.CM_DAY_DECKS;
//   · every page of the deck that teaches (all but its title, Training Agenda and Thank You pages) is the slide of
//     exactly one lesson, a lesson the course still teaches (in CF.sequence, not retired), in rising page order;
//   · no lesson's page is a Skill Building, title, agenda or Thank You page;
//   · each page has its picture in decks/dayN/ and talking points (40 words or more) that name no other practice file
//     (the old file's Dr. Sarah Spine, Apex, Jordan Davies, Mr. Jones), and no picture in decks/dayN/ is on no slide.
// Usage: node .github/scripts/day-decks.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fail = [];
global.window = {};
require(path.join(ROOT, 'js', 'cm-deck-slides.js'));
require(path.join(ROOT, 'js', 'cm-case-flow-data.js'));
const CF = window.CM_CASE_FLOW, DECK = window.CM_DECK_SLIDES || {};
const taught = new Set(CF.sequence.flatMap(d => d.phases.flatMap(p => p.blocks)));
const STORED = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { STORED[b.id] = b; })));
if (Object.values(window.CM_DAY_DECKS || {}).some(g => g && g.length)) fail.push('window.CM_DAY_DECKS still puts deck pages beside the lessons');
const NOT_TEACHING = /^Thank You|^Training Agenda|^Case Management Training/i;
const counts = {};
for (const n of [2, 3, 4, 5]) {
  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, `build/videoslide/day${n}.json`), 'utf8'));
  if (spec.onDeck) fail.push(`day${n}.json: "onDeck" shows deck pages beside the lessons; name the lesson each page teaches in "lessons"`);
  const on = {}, used = new Set();
  for (const [id, pages] of Object.entries(spec.lessons || {})) {
    const b = STORED[id];
    if (!b || b.kind !== 'lesson') fail.push(`day${n}.json: ${id} is not a lesson`);
    else if (!taught.has(id) || b.retired) fail.push(`day${n}.json: ${id} is not taught (retired or out of the course's order)`);
    if (pages.some((p, i) => i && p <= pages[i - 1])) fail.push(`day${n}.json: ${id}'s pages are not in the deck's order`);
    const drawn = DECK[id] || [];
    if (drawn.length !== pages.length) fail.push(`${id}: js/cm-deck-slides.js has ${drawn.length} of its ${pages.length} pages (run node build/videoslide/deck-slides.cjs)`);
    pages.forEach(p => {
      if (on[p]) fail.push(`day${n}.json: page ${p} is the slide of ${on[p]} and ${id}`); on[p] = id;
      const s = spec.slides.find(x => x.page === p), x = drawn.find(y => y.page === p);
      if (!s) return fail.push(`${id}: page ${p} has no notes in day${n}.json`);
      if (/Skill Building|Critical Thinking|Final Net Challenge/i.test(s.title) || NOT_TEACHING.test(s.title)) fail.push(`${id}: page ${p} "${s.title}" isn't a teaching page`);
      if (!s.notes || s.notes.split(/\s+/).length < 40) fail.push(`${id}: page ${p} has no talking points`);
      if (/\bApex\b|Jordan Davies|Mr\. Jones|Sarah Spine/.test(s.notes)) fail.push(`${id}: page ${p}'s talking points name another practice file`);
      const img = (x && x.img) || `/decks/day${n}/${String(p).padStart(2, '0')}.webp`; used.add(path.basename(img));
      if (!fs.existsSync(path.join(ROOT, img.replace(/^\//, '')))) fail.push(`${id}: ${img} is missing`);
    });
  }
  spec.slides.forEach(s => { if (!NOT_TEACHING.test(s.title) && !on[s.page]) fail.push(`day${n}.json: page ${s.page} "${s.title}" teaches, but is no lesson's slide`); });
  const dir = path.join(ROOT, `decks/day${n}`);
  if (fs.existsSync(dir)) fs.readdirSync(dir).filter(f => /\.webp$/.test(f)).forEach(f => { if (!used.has(f)) fail.push(`decks/day${n}/${f} is on no slide`); });
  counts[n] = Object.keys(on).length;
}
if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`🖼 The Day 2-5 decks are lessons, as Day 1's: ${[2, 3, 4, 5].map(n => `Day ${n} ${counts[n]} pages`).join(', ')}, each one lesson's slide with its picture and talking points; nothing shown beside the lessons.`);
