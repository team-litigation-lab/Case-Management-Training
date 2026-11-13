// @check node — The revised Day 2 deck's pages: every page js/cm-deck-pages.js puts on the Case Flow deck has its picture, and every topic ends on its Skill Building
// js/cm-deck-pages.js lists the pages of the trainers' revised Day 2 deck, topic by topic, each topic followed by its
// Skill Building (a page of the deck, or a slide drawn from `skill`). Checked: every page's picture is in
// decks/cf-deck/ (and no picture there is unused); a drawn Skill Building has its title, lead, 3–5 steps, what to
// deliver and the trainer's note; the topics alternate, topic then its Skill Building; the day is a Case Flow day.
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
  const sb = /^Skill Building: /.test(g.topic || '');
  if (sb !== (k % 2 === 1)) fail.push(`${g.key}: the topics should alternate, each topic then its Skill Building (${g.topic})`);
  if (sb && DECK[k - 1] && g.topic !== 'Skill Building: ' + DECK[k - 1].topic) fail.push(`${g.key}: "${g.topic}" follows "${DECK[k - 1].topic}"`);
  if (g.skill) {
    const s = g.skill;
    if (!s.title || !s.lead || !s.deliver || !s.note) fail.push(`${g.key}: a drawn Skill Building needs its title, lead, deliver and note`);
    if (!Array.isArray(s.steps) || s.steps.length < 3 || s.steps.length > 5) fail.push(`${g.key}: 3–5 steps`);
    return;
  }
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
const pages = DECK.reduce((a, g) => a + (g.pages || []).length, 0), drawn = DECK.filter(g => g.skill).length;
console.log(`deck pages: Day ${DAY}, ${pages} pages and ${drawn} drawn Skill Building slides in ${DECK.length / 2} topics, every picture there`);
