// @check node — John Doe's money trail follows the Day 2 deck (PIP $10,000 gone in 48 hours on ER and EMS bills, $41,400 of bills, Dr. Sarah Spine's EMC) and adds up to the cent; no retired figure (PIP $5,000, Specials $16,401.40, …) comes back anywhere the course, its documents or its checks say it
// The owner: "Update John Doe's PIP to 10,000 and align the bills". The Day 2 deck pages 23–24 state his figures; the case
// file (curriculum/5-day-flow/case-file.md) follows them, and everything else follows the case file. Checked:
//   1. RETIRED: none of the old figures appears in the course's content: the case data, the drawn slides, scripts,
//      simulation and exhibits (sources and generated), the case documents, the curriculum, index.html, the add-on
//      scripts, the README and the checks. The Canva narration (build/videoslide/, js/cm-deck-slides.js) is the owner's
//      recording and is not checked here; build/day*.js is the old course's text, never served.
//   2. THE TRAIL: case-file.md carries each current figure, and the figures add up: the medical lines to $41,400.00, plus
//      wages to $42,984.00; PIP's two fee-schedule payments to $10,000.00; MedPay's five to $5,000.00; the paid-and-owed
//      column; the stack to $40,000; the Net Sheet to $20,359.92 and its two streams.
// Usage: node .github/scripts/john-doe-figures.cjs
'use strict';
const fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const fail = [];
const RETIRED = [
  [/\$?16,401\\?\.40/, 'the old total Specials ($16,401.40; now $42,984.00)'],
  [/\$?14,817\\?\.40/, 'the old audited medical Specials ($14,817.40; now $41,400.00)'],
  [/\$?15,002\\?\.40/, 'the old billed medical Specials ($15,002.40; now $41,585.00)'],
  [/\$?13,277\\?\.40/, 'the old paid-and-owed column ($13,277.40; now $23,277.40)'],
  [/\$?16,410\\?\.40/, 'the old planted Specials typo in the draft demand ($16,410.40; now $42,894.00)'],
  [/\$?12,965\\?\.00/, 'the old draft Lien Sheet total ($12,965.00; now $17,965.00)'],
  [/sixteen thousand four hundred one/i, 'the old total Specials in words'],
  [/\b(?:PIP|Personal Injury Protection)\b(?:(?!MedPay|Medical Payments|Part E|\$10,000)[^.\n"<]){0,30}\$5,000(?![\d,])(?!(?:\.00)? (?:of )?MedPay)/, 'PIP at the old $5,000 limit (now $10,000)'],
  [/\$5,000(?:\.00)?(?: of)? (?:Harbor Point )?PIP\b/, 'PIP at the old $5,000 limit (now $10,000)'],
  [/Riverton (?:file )?has no (?:Emergency Medical Condition \(EMC\) |EMC )rule|no EMC rule\b(?! (?:on|in) (?:a|the) Florida)/i, '"no EMC rule": Riverton uses it, and Dr. Sarah Spine documented John Doe\'s'],
  [/PIP (?:limit )?exhausted (?:on )?06\/26\/2026|PIP exhausted 06\/2026/, 'PIP exhausted 06/26/2026 (PIP ran out 03/04/2026; MedPay 06/26/2026)']
];
const SKIP = [/^build\/videoslide\//, /^js\/cm-deck-slides\.js$/, /^build\/day\d\.js$/, /^build\/case-flow\/slides\/deck-pages\.json$/, /^\.github\/scripts\/john-doe-figures\.cjs$/,
  /^build\/case-flow\/documents\/audit\.cjs$/, /^docs\/INVENTORY\.md$/, /^decks\//, /^documents\/(?!case-flow\/html\/)/, /node_modules/];
const FILES = [];
(function walk(dir) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), { withFileTypes: true })) {
    const rel = path.posix.join(dir, e.name);
    if (e.name.startsWith('.') && e.name !== '.github') continue;
    if (SKIP.some(re => re.test(rel))) continue;
    if (e.isDirectory()) walk(rel);
    else if (/\.(js|cjs|mjs|json|md|html)$/.test(e.name)) FILES.push(rel);
  }
})('');
let checked = 0;
for (const f of FILES) {
  const t = fs.readFileSync(path.join(ROOT, f), 'utf8'); if (!/John Doe|Harbor Point|Riverton|RS\d\d/.test(t) && !/^\.github\//.test(f)) continue;
  checked++;
  t.split('\n').forEach((line, i) => RETIRED.forEach(([re, why]) => { const m = line.match(re); if (m) fail.push(`${f}:${i + 1}: "${m[0]}" — ${why}`); }));
}

// 2. the money trail
const file = fs.readFileSync(path.join(ROOT, 'curriculum/5-day-flow/case-file.md'), 'utf8');
const cents = s => Math.round(Number(String(s).replace(/[$,]/g, '')) * 100);
const fmt = c => '$' + (c / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const sum = xs => xs.map(cents).reduce((a, b) => a + b, 0);
const need = (label, parts, total) => {
  if (sum(parts) !== cents(total)) fail.push(`the trail: ${label}: ${parts.join(' + ')} = ${fmt(sum(parts))}, not ${total}`);
  [total].concat(parts).forEach(x => { if (!file.includes(x)) fail.push(`the trail: case-file.md does not carry ${x} (${label})`); });
};
const BILLS = { ems: '$2,182.60', er: '$24,400.00', uc: '$685.00', lop: '$6,105.00', ortho1: '$640.00', ortho2: '$640.00', ortho3: '$640.00', mri: '$2,395.00', esi: '$3,400.00', rx: '$312.40' };
need('the audited medical Specials', Object.values(BILLS), '$41,400.00');
need('the billed medical Specials (with the duplicate)', ['$41,400.00', '$185.00'], '$41,585.00');
need('the total Specials', ['$41,400.00', '$1,584.00'], '$42,984.00');
need('PIP, the first 48 hours of care', ['$8,850.00', '$1,150.00'], '$10,000.00');
need('MedPay, in date order', ['$685.00', '$640.00', '$2,395.00', '$640.00', '$640.00'], '$5,000.00');
need('the hospital fee-schedule write-off', ['$8,850.00', '$15,550.00'], '$24,400.00');
need('the EMS fee-schedule write-off', ['$1,150.00', '$1,032.60'], '$2,182.60');
if (sum(['$10,000.00', '$5,000.00', '$1,860.00', '$6,105.00', '$312.40']) !== cents('$41,400.00') - cents('$1,540.00') - cents('$15,550.00') - cents('$1,032.60')) fail.push('the trail: the paid-and-owed column does not tie to the Specials less the write-offs');
need('the Track A net', ['$20,359.92', '$13,333.33', '$486.75', '$1,240.00', '$4,580.00'], '$40,000.00');
if (!/Recovery Stack — \$40,000/.test(file)) fail.push('the trail: the recovery stack is $40,000 (Day 1 deck p21): BI $10,000, Host UM $20,000, Relative UM $10,000');
if (!/PIP \$10,000; MedPay \$5,000/.test(file) || !/Dr\. Sarah Spine/.test(file) || !/\$2,500/.test(file)) fail.push('the trail: case-file.md should give Harbor Point PIP $10,000 (EMC by Dr. Sarah Spine; $2,500 without it) and MedPay $5,000');

if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`John Doe's figures: ${checked} files carry none of the ${RETIRED.length} retired figures; the money trail adds up (medical $41,400.00, Specials $42,984.00, PIP $10,000.00 in 48 hours, MedPay $5,000.00, net $20,359.92).`);
