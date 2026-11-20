// @check node — fewer extra tasks: each day's side exercises at most the owner's plan; the 💡 Case Manager's guides sit on kept activities, fade day by day and never give away a figure, date or document id from the answer key
// The owner: "cut down on extra tasks so VAs can focus on their main skill builders and throw out guides from time to
// time for them to manage their cases accurately but not give away everything; just balance it so they're ready for
// their own case on Day 5." This holds the course to it:
//   · side exercises (every activity in CF.sequence that is neither the day's Skill Building, `main`, nor its Backup File
//     Maintenance, `drive`) are at most SIDES_MAX a day (5, 4, 4, 4 and Day 5's 3);
//   · a cut activity left the order but kept its block, `retired` (and `mergedInto` a main that is that day's Skill Building),
//     so old grades and saved places resolve;
//   · every guide (js/cm-case-guides.js) sits on an activity in the course's order, says what it withholds, opens
//     "💡 Case Manager's guide:", is one short paragraph, and carries no figure, date, document id or "N-day" count: none of
//     $ … , MM/DD, RS## or N-day, no number at all but "Day 1–4", and none of the money, dates, document ids or case
//     numbers in its activity's answer key (its checkpoints, its slide checks and steps, its rubric, its exhibit audit);
//   · they fade: Day 1 ≥ Day 2 ≥ Day 3 ≥ Day 4 ≥ Day 5, Day 1 has some, and Day 5's are only the build's pointer back to
//     the trainee's own Day 1–4 work (no guide on a Day 5 activity).
// Usage: node .github/scripts/case-guides.cjs   (no server, no browser needed)
'use strict';
const path = require('path'), fs = require('fs');
const ROOT = path.resolve(__dirname, '../..');
global.window = {};
require(path.join(ROOT, 'js/cm-case-flow-data.js'));
require(path.join(ROOT, 'js/cm-case-flow-slides.js'));
require(path.join(ROOT, 'js/cm-case-flow-exhibits.js'));
require(path.join(ROOT, 'js/cm-case-guides.js'));
const CF = window.CM_CASE_FLOW, SL = window.CM_CF_SLIDES || {}, EX = window.CM_CF_EXHIBITS || {}, { GUIDES, BUILD } = window.CM_CASE_GUIDES;
const SIDES_MAX = { 1: 5, 2: 4, 3: 4, 4: 4, 5: 3 };   // Day 1 keeps John Doe's voicemail (the course's only Listening Check and Notes & Action Plan) beside the plan's four
const fail = [], F = m => fail.push(m);
const BLOCK = {}; CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { BLOCK[b.id] = b; })));
const DAY = {}; CF.sequence.forEach(sd => sd.phases.forEach(ph => ph.blocks.forEach(id => { DAY[id] = sd.n; })));

// ── side exercises a day, and what a cut activity became
const sides = {};
CF.sequence.forEach(sd => {
  const ids = sd.phases.flatMap(ph => ph.blocks).filter(id => BLOCK[id] && BLOCK[id].kind === 'activity' && id !== sd.main && id !== sd.drive);
  sides[sd.n] = ids.length;
  if (ids.length > (SIDES_MAX[sd.n] || 0)) F(`Day ${sd.n}: ${ids.length} side exercises (${ids.join(', ')}); the owner's plan keeps at most ${SIDES_MAX[sd.n]}`);
});
const MAINS = new Set(CF.sequence.map(sd => sd.main).filter(Boolean));
Object.values(BLOCK).filter(b => b.kind === 'activity' && DAY[b.id] == null).forEach(b => {
  if (!b.retired) F(`${b.id}: out of the course's order without \`retired\` (say why it was cut, so its old grades still resolve)`);
  if (b.mergedInto && !MAINS.has(b.mergedInto)) F(`${b.id}: mergedInto ${b.mergedInto}, which is not a day's Skill Building`);
});

// ── the guides
const key = id => { const b = BLOCK[id] || {}, c = SL[id] || {}, a = (EX.audits || {})[id];
  return JSON.stringify([(b.act || {}).checkpoints, (b.act || {}).prompt, b.rubric, c.checks, c.steps, c.situation, c.grade, a]); };
const TOKENS = s => {   // the figures, dates, document ids and case numbers in an answer key
  const out = new Set(), add = re => { let m; const g = new RegExp(re.source, 'g'); while ((m = g.exec(s))) out.add(m[0]); };
  add(/\$\s?\d[\d,]*(?:\.\d+)?/); add(/\b\d{1,2}\/\d{1,2}(?:\/\d{2,4})?\b/); add(/\bRS\d+\b/); add(/\b[A-Z]{2,5}-\d{2}-[\dA-Z-]+\b/); add(/\b\d+(?:\.\d+)?%/);
  add(/\b\d+-day\b/i); add(/\b\d{3,}\b/);
  return [...out];
};
const BANNED = /\$|\d{1,2}\/\d{1,2}|\bRS\d+|\d+-day/i;
const NUMBER = s => s.replace(/\bDays? 1–4\b/g, '').match(/\d/);
const words = s => String(s).trim().split(/\s+/).length;
function guide(at, g, keyText){
  if (!g || typeof g.text !== 'string' || !g.text.startsWith("💡 Case Manager's guide: ")) return F(`${at}: a guide opens "💡 Case Manager's guide: "`);
  if (!g.at || !String(g.at).trim()) F(`${at}: name the step it belongs to (at)`);
  if (!g.withholds || !String(g.withholds).trim()) F(`${at}: say what it withholds (the answer it must not give)`);
  if (words(g.text) > 50) F(`${at}: ${words(g.text)} words; a guide is a short nudge (at most 50)`);
  if (BANNED.test(g.text)) F(`${at}: carries a figure, date, document id or day count: "${g.text.match(BANNED)[0]}"`);
  if (NUMBER(g.text)) F(`${at}: carries a number ("${NUMBER(g.text)[0]}"): a guide says what to check or where to look, never the figure`);
  if (keyText) TOKENS(keyText).forEach(t => { if (g.text.includes(t)) F(`${at}: gives away "${t}", from its activity's answer key`); });
}
const perDay = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
Object.entries(GUIDES).forEach(([id, list]) => {
  const b = BLOCK[id];
  if (!b || b.kind !== 'activity') return F(`guide on ${id}: not a Skill Activity`);
  if (DAY[id] == null) return F(`guide on ${id}: the activity is not in the course's order (cut or retired)`);
  if (!Array.isArray(list) || !list.length) return F(`guide on ${id}: no guides`);
  if (DAY[id] === 5) F(`guide on ${id}: Day 5's only guide is the build's pointer back to the trainee's Day 1–4 work`);
  const k = key(id);
  list.forEach((g, i) => guide(`${id} guide ${i + 1}`, g, k));
  perDay[DAY[id]] += list.length;
});
if (!BUILD || BUILD.day !== 5 || BUILD.step !== 1) F('the Day 5 build guide: on Day 5, at the build\'s step 1 (Read the file)');
else {
  guide('the Day 5 build guide', BUILD, null);
  if (!/Day 1–4/.test(BUILD.text) || !/John Doe/.test(BUILD.text)) F('the Day 5 build guide: point back to the trainee\'s own Day 1–4 work on John Doe\'s file, nothing about their own case');
  perDay[5] += 1;
}
const src = fs.readFileSync(path.join(ROOT, 'js/cm-case-flow.js'), 'utf8');
if (!/\[\d+, "Read the file"/.test(src)) F('js/cm-case-flow.js BUILD_STEPS: step 1 is no longer "Read the file"; move the Day 5 guide to the step that opens the build');
if (!perDay[1]) F('Day 1 has no guide; it is the day with the most help');
for (let n = 2; n <= 5; n++) if (perDay[n] > perDay[n - 1]) F(`guides don't fade: Day ${n} has ${perDay[n]}, more than Day ${n - 1}'s ${perDay[n - 1]}`);

if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`Fewer extra tasks: side exercises a day ${[1, 2, 3, 4, 5].map(n => sides[n]).join(' / ')} (at most ${[1, 2, 3, 4, 5].map(n => SIDES_MAX[n]).join(' / ')}); Case Manager's guides fade ${[1, 2, 3, 4, 5].map(n => perDay[n]).join(' → ')}, each on a kept activity, none giving away a figure, date or document id.`);
