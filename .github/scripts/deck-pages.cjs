// @check node — The revised deck's pages: every page js/cm-deck-pages.js puts on the Case Flow deck has its picture, and each topic opens on a real block
// js/cm-deck-pages.js lists the pages of the trainers' revised deck, topic by topic, each topic placed before the first
// slide of a Case Flow block. Checked: every page's picture is in decks/cf-deck/ (and no picture there is unused), every
// `before` names a block of the course's sequence, and no two topics open on the same block.
// Usage: node .github/scripts/deck-pages.cjs
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fail = [];
global.window = {};
require(path.join(ROOT, 'js', 'cm-deck-pages.js'));
require(path.join(ROOT, 'js', 'cm-case-flow-data.js'));
const { DIR, DECK, src } = window.CM_DECK_PAGES || {};
if (!DECK || !DECK.length) fail.push('js/cm-deck-pages.js lists no pages');
const seq = new Set();
(window.CM_CASE_FLOW.sequence || []).forEach(d => (d.phases || []).forEach(p => (p.blocks || []).forEach(id => seq.add(id))));
const used = new Set(), opens = new Map();
(DECK || []).forEach(g => {
  if (!seq.has(g.before)) fail.push(`${g.key}: opens on "${g.before}", which is not a block of the course's sequence`);
  if (opens.has(g.before)) fail.push(`${g.key} and ${opens.get(g.before)} both open on ${g.before}`); opens.set(g.before, g.key);
  if (!g.topic || !g.pages.length) fail.push(`${g.key}: no topic or no pages`);
  g.pages.forEach((p, i) => {
    const f = src(g, i); used.add(f);
    if (!p.title) fail.push(`${g.key} page ${i + 1}: no title`);
    if (!fs.existsSync(path.join(ROOT, f))) fail.push(`${g.key} page ${i + 1}: ${f} is missing`);
  });
});
const dir = path.join(ROOT, (DIR || '/decks/cf-deck/').replace(/^\//, ''));
if (fs.existsSync(dir)) fs.readdirSync(dir).forEach(f => { if (!used.has((DIR || '') + f)) fail.push(`decks/cf-deck/${f} is on no slide`); });
if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`deck pages: ${(DECK || []).reduce((a, g) => a + g.pages.length, 0)} pages in ${(DECK || []).length} topics, every picture there`);
