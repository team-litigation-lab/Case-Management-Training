// @check node — The revised Day 2 deck's pages: every page js/cm-deck-pages.js puts on the Case Flow deck has its picture, and no Skill Building slide is among them
// js/cm-deck-pages.js lists the pages of the trainers' revised Day 2 deck, topic by topic. The deck's Skill Building
// pages (and the slides drawn in their place) are gone: the course keeps its own Skill Building. Checked: every page's
// picture is in decks/cf-deck/ (and no picture there is unused); no topic or page is a Skill Building one; the day is a
// Case Flow day.
// Usage: node .github/scripts/deck-pages.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fail = [];
global.window = {};
require(path.join(ROOT, 'js', 'cm-deck-pages.js'));
require(path.join(ROOT, 'js', 'cm-case-flow-data.js'));
const { DIR, DAY, DECK, src } = window.CM_DECK_PAGES || {};
if (!DECK || !DECK.length) fail.push('js/cm-deck-pages.js lists no pages');
if (!(window.CM_CASE_FLOW.sequence || []).some(d => d.n === DAY)) fail.push(`Day ${DAY} is not a Case Flow day`);
const used = new Set();
(DECK || []).forEach((g, k) => {
  if (/Skill Building/i.test(g.topic || '') || g.skill) fail.push(`${g.key}: a Skill Building slide on the deck (${g.topic}); the course keeps its own Skill Building`);
  (g.pages || []).forEach((p, i) => { if (/Skill Building|Challenge/i.test(p.title || '')) fail.push(`${g.key} page ${i + 1}: "${p.title}" is a Skill Building page`); });
  if (!g.topic || !(g.pages || []).length) fail.push(`${g.key}: no topic or no pages`);
  g.pages.forEach((p, i) => {
    const f = src(g, i); used.add(f);
    if (!p.title) fail.push(`${g.key} page ${i + 1}: no title`);
    if (!fs.existsSync(path.join(ROOT, f))) fail.push(`${g.key} page ${i + 1}: ${f} is missing`);
  });
});
const dir = path.join(ROOT, (DIR || '/decks/cf-deck/').replace(/^\//, ''));
if (fs.existsSync(dir)) fs.readdirSync(dir).forEach(f => { if (!used.has((DIR || '') + f)) fail.push(`decks/cf-deck/${f} is on no slide`); });
if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
const pages = DECK.reduce((a, g) => a + (g.pages || []).length, 0);
console.log(`deck pages: Day ${DAY}, ${pages} pages in ${DECK.length} topics, no Skill Building slide, every picture there`);
