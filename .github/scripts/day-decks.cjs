// @check node — Every Canva deck page, Days 1-5, is on the platform on its own day: each page of Day N's deck (title and agenda pages too; a closing Thank You page is in the notes and the video but on no slide) is one Case Flow Day N lesson's slide, with its picture and talking points; nothing beside the lessons, no picture unused
// The trainers' Canva decks teach the course: build/videoslide/dayN.json `lessons` names the deck pages that ARE a
// lesson's slides (js/cm-deck-slides.js window.CM_DECK_SLIDES, drawn by js/cm-case-flow.js viewsOf), and Day N's
// deck is taught on Case Flow Day N (the narrated videos and the day titles follow the decks). The owner: nothing of
// the Canva slides is removed, so every page is on the platform, its title and Training Agenda pages too. The one
// exception, the owner's own: a deck's closing "Thank You!" page, now that the decks run back to back, is on no slide.
// No deck page is shown on its own beside the lessons (the old "onDeck" topics are gone). Checked, for Days 1 to 5:
//   · no `onDeck` in the notes and nothing in window.CM_DAY_DECKS;
//   · EVERY page of the deck's notes is the slide of exactly one lesson, a lesson the course still teaches (in
//     CF.sequence, not retired) ON THAT CASE FLOW DAY, in rising page order;
//   · each page has its picture in decks/dayN/ and talking points (40 words or more; a title, agenda or Thank You page
//     at least a line) that name no other practice file (Apex, Jordan Davies, Mr. Jones), on any page, with no exemption:
//     Dr. Sarah Spine is John Doe's own emergency physician now (Day 2 p24; curriculum/5-day-flow/case-file.md), so a
//     page that names her must name John Doe's file too, and the case file must carry her;
//   · every picture in decks/dayN/ is a page in the notes and on a slide: no page is left off.
// Usage: node .github/scripts/day-decks.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fail = [];
global.window = {};
require(path.join(ROOT, 'js', 'cm-deck-slides.js'));
require(path.join(ROOT, 'js', 'cm-case-flow-data.js'));
const CASE_FILE = fs.readFileSync(path.join(ROOT, 'curriculum/5-day-flow/case-file.md'), 'utf8');
const CF = window.CM_CASE_FLOW, DECK = window.CM_DECK_SLIDES || {};
const taught = new Set(CF.sequence.flatMap(d => d.phases.flatMap(p => p.blocks)));
const dayOf = {}; CF.sequence.forEach(d => d.phases.forEach(p => p.blocks.forEach(id => { dayOf[id] = d.n; })));
const STORED = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { STORED[b.id] = b; })));
if (Object.values(window.CM_DAY_DECKS || {}).some(g => g && g.length)) fail.push('window.CM_DAY_DECKS still puts deck pages beside the lessons');
const NOT_TEACHING = /^Thank You|^Training Agenda|^Case Management Training/i;
const THANKS = /^\s*thank you!?\s*$/i;   // a deck's closing page: no lesson's slide (build/videoslide/deck-slides.cjs)
const counts = {};
for (const n of [1, 2, 3, 4, 5]) {
  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, `build/videoslide/day${n}.json`), 'utf8'));
  if (spec.onDeck) fail.push(`day${n}.json: "onDeck" shows deck pages beside the lessons; name the lesson each page teaches in "lessons"`);
  const on = {}, used = new Set();
  for (const [id, pages] of Object.entries(spec.lessons || {})) {
    const b = STORED[id];
    if (!b || b.kind !== 'lesson') fail.push(`day${n}.json: ${id} is not a lesson`);
    else if (!taught.has(id) || b.retired) fail.push(`day${n}.json: ${id} is not taught (retired or out of the course's order)`);
    else if (dayOf[id] !== n) fail.push(`day${n}.json: ${id} is taught on Case Flow Day ${dayOf[id]}; Day ${n}'s deck is taught on Day ${n}`);
    if (pages.some((p, i) => i && p <= pages[i - 1])) fail.push(`day${n}.json: ${id}'s pages are not in the deck's order`);
    const drawn = DECK[id] || [];
    // the one exception the owner made: a deck's closing "Thank You!" page is in the notes and the video, but on no slide
    const shown = pages.filter(p => !THANKS.test((spec.slides.find(x => x.page === p) || {}).title || ''));
    if (drawn.length !== shown.length || drawn.some(x => !shown.includes(x.page))) fail.push(`${id}: js/cm-deck-slides.js has ${drawn.length} of its ${shown.length} pages (every page but a closing Thank You; run node build/videoslide/deck-slides.cjs)`);
    pages.forEach(p => {
      if (on[p]) fail.push(`day${n}.json: page ${p} is the slide of ${on[p]} and ${id}`); on[p] = id;
      const s = spec.slides.find(x => x.page === p), x = drawn.find(y => y.page === p);
      if (!s) return fail.push(`${id}: page ${p} has no notes in day${n}.json`);
      if (!s.notes || s.notes.split(/\s+/).length < (NOT_TEACHING.test(s.title) ? 8 : 40)) fail.push(`${id}: page ${p} has no talking points`);
      if (/\bApex\b|Jordan Davies|Mr\. Jones/.test(s.notes)) fail.push(`${id}: page ${p}'s talking points name another practice file`);
      if (/Sarah Spine/.test(s.notes) && (!/John Doe/.test(s.notes) || !/Dr\. Sarah Spine/.test(CASE_FILE))) fail.push(`${id}: page ${p} names Dr. Sarah Spine, John Doe's emergency physician, without his file (or the case file has lost her)`);
      const img = (x && x.img) || `/decks/day${n}/${String(p).padStart(2, '0')}.webp`; used.add(path.basename(img));
      if (!fs.existsSync(path.join(ROOT, img.replace(/^\//, '')))) fail.push(`${id}: ${img} is missing`);
    });
  }
  spec.slides.forEach(s => { if (!on[s.page]) fail.push(`day${n}.json: page ${s.page} "${s.title}" is no lesson's slide: every Canva page stays on the platform`); });
  const dir = path.join(ROOT, `decks/day${n}`);
  if (fs.existsSync(dir)) fs.readdirSync(dir).filter(f => /\.webp$/.test(f)).forEach(f => { if (!used.has(f)) fail.push(`decks/day${n}/${f} is on no slide (every Canva page stays on the platform: give it its notes and a lesson)`); });
  counts[n] = Object.keys(on).length;
}
if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`🖼 Every Canva deck page is on its own day: ${[1, 2, 3, 4, 5].map(n => `Day ${n} ${counts[n]} pages`).join(', ')}, each one lesson's slide with its picture and talking points; nothing beside the lessons, no picture unused.`);
