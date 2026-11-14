// @check node — The Day 3, 4 and 5 decks' pages on Case Flow Days 3–5: every page has its picture and talking points, and none is a Skill Building, title, agenda or Thank You page
// js/cm-deck-slides.js (window.CM_DAY_DECKS, from build/videoslide/dayN.json "onDeck") lists the pages js/cm-day-decks.js
// puts on Case Flow Days 3, 4 and 5, topic by topic. Checked: each day is a Case Flow day; every page is in the deck's
// notes, has its picture in decks/dayN/ and talking points that name John Doe VS Robert Smith's file or follow from it;
// no page is a Skill Building, title, agenda or Thank You page; no page is on the day twice; and no picture in
// decks/day3-5 is on no slide.
// Usage: node .github/scripts/day-decks.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fail = [];
global.window = {};
require(path.join(ROOT, 'js', 'cm-deck-slides.js'));
require(path.join(ROOT, 'js', 'cm-case-flow-data.js'));
const DECKS = window.CM_DAY_DECKS || {};
const days = (window.CM_CASE_FLOW.sequence || []).map(d => d.n);
for (const n of [3, 4, 5]) {
  const groups = DECKS[n];
  if (!groups || !groups.length) { fail.push(`Day ${n}: no deck pages in CM_DAY_DECKS`); continue; }
  if (!days.includes(n)) fail.push(`Day ${n} is not a Case Flow day`);
  const spec = JSON.parse(fs.readFileSync(path.join(ROOT, `build/videoslide/day${n}.json`), 'utf8'));
  const seen = new Set(), used = new Set();
  groups.forEach(g => {
    if (!g.topic || !g.pages.length) fail.push(`${g.key}: no topic or no pages`);
    if (/Skill Building/i.test(g.topic)) fail.push(`${g.key}: a Skill Building topic`);
    g.pages.forEach(p => {
      if (seen.has(p.page)) fail.push(`Day ${n} page ${p.page} is on the day twice`); seen.add(p.page);
      if (/Skill Building|Critical Thinking|Final Net Challenge|^Thank You|Training Agenda|^Case Management Training/i.test(p.title)) fail.push(`${g.key}: page ${p.page} "${p.title}" isn't a teaching page`);
      if (!spec.slides.some(s => s.page === p.page)) fail.push(`${g.key}: page ${p.page} has no notes in day${n}.json`);
      if (!p.notes || p.notes.split(/\s+/).length < 40) fail.push(`${g.key}: page ${p.page} has no talking points`);
      if (/\bApex\b|Jordan Davies|Mr\. Jones/.test(p.notes)) fail.push(`${g.key}: page ${p.page}'s talking points name another practice file`);
      const f = p.img.replace(/^\//, ''); used.add(path.basename(f));
      if (!fs.existsSync(path.join(ROOT, f))) fail.push(`${g.key}: ${p.img} is missing`);
    });
  });
  const dir = path.join(ROOT, `decks/day${n}`);
  if (fs.existsSync(dir)) fs.readdirSync(dir).filter(f => /\.webp$/.test(f)).forEach(f => { if (!used.has(f)) fail.push(`decks/day${n}/${f} is on no slide`); });
}
if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
const count = n => (DECKS[n] || []).reduce((a, g) => a + g.pages.length, 0);
console.log(`🖼 The Day 3, 4 and 5 decks on Case Flow Days 3–5: ${count(3)}, ${count(4)} and ${count(5)} pages, topic by topic, each with its picture and its John Doe VS Robert Smith talking points; no Skill Building, title, agenda or Thank You page.`);
