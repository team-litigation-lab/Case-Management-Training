// @check node — A day is shown as Day 1 … Day 5 (the Case Flow day), never by its internal id ("Day 11", "Opened | Day 15", "Random Task — Day 14"): every "Day ${…id}" on a page goes through dayNo / dayText
// The course's days are DAYS 11–15 inside (js/cm-case-flow.js); people know them as Case Flow Days 1–5. index.html's
// dayNo(id) and dayText(label) turn the one into the other. A stored label keeps the id on purpose (index.html
// workDayFromContext files a graded attempt by it, and the Scorecard keeps an activity's latest attempt under it), so the
// lines that WRITE a label (logWork({… label: `Day ${dayId} …`}), the AI grader's and the Self-Summary's `const label =`)
// are allowed; everything else that prints "Day ${d.id}", "Day ${dayId}", "Day ${e.dayId}" … must not.
// Also checked: dayNo / dayText themselves (11 → 1, a label's "Day 11 · Case Flow Day 1 · " → "Day 1 · "), and that the
// pages that show a stored label (the Batch Sheet, the Scorecard) pass it through dayText.
// Usage: node .github/scripts/day-names.cjs
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const failures = []; const fail = (m) => failures.push(m);
const GENERATED = new Set(['cm-case-flow-slides.js', 'cm-case-flow-scripts.js', 'cm-case-flow-sim.js', 'cm-case-flow-exhibits.js', 'cm-companion-cases.js']);
const files = ['index.html'].concat(fs.readdirSync(path.join(ROOT, 'js')).filter((f) => /\.js$/.test(f) && !GENERATED.has(f)).map((f) => 'js/' + f));
// "Day ${x}" where x is a day's id (d.id, dayId, e.dayId, t.dayId, lv.dayId, id, d.id+1 …), not already a Case Flow number
const RAW = /\bDay ?\$\{\s*((?:[a-z]+\.)?(?:dayId|id)(?:\s*\+\s*1)?)\s*\}/g;
const ALLOWED = (line) => /logWork\(/.test(line) || /const label = `Day \$\{dayId\} · Case Flow Day/.test(line)
  || /^\s*const dayLabel = d => d\.cf \?/.test(line) || /d\.cf \? `Case Flow Day/.test(line) || /new RegExp\(`\\\\bDay \$\{d\.id\}/.test(line)
  || /d\.cf \? "" : `Day \$\{d\.id\} — `/.test(line);
for (const f of files) {
  const lines = fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n');
  lines.forEach((l, i) => { if (/^\s*(\/\/|\*|\/\*)/.test(l) || ALLOWED(l)) return;
    let m; RAW.lastIndex = 0;
    while ((m = RAW.exec(l))) fail(`${f}:${i + 1}: "Day \${${m[1]}}" shows a day's internal id; use dayNo(${m[1]}) (or the day's cf.n): ${l.trim().slice(0, 140)}`); });
}
// dayNo and dayText, as index.html defines them, against the course's five days
const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const src = ['dayNo', 'dayText'].map((n) => { const m = new RegExp(`function ${n}\\(.*\\n`).exec(html); return m ? m[0] : ''; }).join('');
if (!/function dayNo/.test(src) || !/function dayText/.test(src)) fail('index.html should define dayNo(id) and dayText(label) next to DAYS');
else {
  const DAYS = [11, 12, 13, 14, 15].map((id, i) => ({ id, cf: { n: i + 1 } }));
  const api = new Function('DAYS', src + 'return {dayNo, dayText};')(DAYS);
  const want = [[api.dayNo(11), 1], [api.dayNo('15'), 5], [api.dayNo(3), 3],
    [api.dayText('Day 11 · Case Flow Day 1 · Opening John Doe\'s File — Skill Building'), 'Day 1 · Opening John Doe\'s File — Skill Building'],
    [api.dayText('Random Task · Day 14 (missed)'), 'Random Task · Day 4 (missed)'], [api.dayText('Day 12 Knowledge Check'), 'Day 2 Knowledge Check'],
    [api.dayText('Case Flow Day 3 · a note'), 'Case Flow Day 3 · a note']];
  want.forEach(([got, exp]) => { if (got !== exp) fail(`dayNo/dayText: got ${JSON.stringify(got)}, want ${JSON.stringify(exp)}`); });
}
// where a stored label is shown, it is shown through dayText
const bs = fs.readFileSync(path.join(ROOT, 'js/cm-batch-sheet.js'), 'utf8'), sc = fs.readFileSync(path.join(ROOT, 'js/cm-scorecard.js'), 'utf8');
if (!/"Practice", shown\(w\.label\)/.test(bs)) fail('the Batch Sheet\'s 🕒 Recent progress should show a work-log label through dayText (shown)');
if (!/"Opened", lv\.view === "day" \? `Day \$\{typeof dayNo === "function" \? dayNo\(lv\.dayId\)/.test(bs)) fail('the Batch Sheet\'s "Opened" row should name the Case Flow day, not its id');
if (!/clip\(shown\((w\.label|String\(x\.name\))/.test(bs)) fail('the Batch Sheet\'s day cards should show an activity\'s label through dayText');
if (!/name: m \? m\[2\]\.trim\(\) : \(typeof dayText === "function" \? dayText\(e\.label/.test(sc)) fail('the Scorecard\'s 🧪 Skill Activities should show each label through dayText');
if (failures.length) { console.log('✗ Day names:\n  ' + failures.join('\n  ')); process.exit(1); }
console.log(`Day names: no page shows a day's internal id (${files.length} files read); dayNo/dayText turn 11–15 into Days 1–5; stored labels keep the id and are shown through dayText.`);
