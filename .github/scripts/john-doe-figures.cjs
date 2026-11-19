// @check node — John Doe's money trail follows the Day 2 deck (PIP $10,000 gone in 48 hours on ER and EMS bills, $41,400 of bills, Dr. Sarah Spine's EMC) and adds up to the cent; no retired figure (PIP $5,000, Specials $16,401.40, …) comes back anywhere the course, its documents or its checks say it
// The owner: "Update John Doe's PIP to 10,000 and align the bills". The Day 2 deck pages 23–24 state his figures; the case
// file (curriculum/5-day-flow/case-file.md) follows them, and everything else follows the case file. Checked:
//   1. RETIRED: none of the old figures appears in the course's content: the case data, the drawn slides, scripts,
//      simulation and exhibits (sources and generated), the case documents, the curriculum, index.html, the add-on
//      scripts, the README and the checks. The narration (build/videoslide/day*.json and js/cm-deck-slides.js, built
//      from it) is checked too; build/day*.js is the old course's text, never served.
//   2. THE TRAIL: case-file.md carries each current figure, and the figures add up: the medical lines to $41,400.00, plus
//      wages to $42,984.00; PIP's two fee-schedule payments to $10,000.00; MedPay's five to $5,000.00; the paid-and-owed
//      column; the stack to $40,000; the Net Sheet to $20,359.92 and its two streams.
//   3. THE STORY: the facts the new figures changed are told one way everywhere: PIP paid only the ER and EMS (never the
//      MRI, imaging, Lakeside or specialists, which MedPay paid); the Payer Order has MedPay second (PIP → MedPay → Peach
//      State → LOP); the 14-day initial-care condition is Florida's, never Riverton's; the draft Lien Sheet is RS63's
//      C-9 line ($17,965.00, $10,000.00 over the $7,965.00 owed, with no Summit line); a scenario that says "every bill
//      is in" lists the ER and EMS bills; RS12's transfer is a red flag and its note is signed after the ambulance left.
//      Between the ED arrival (02/20/2026 10:49) and the discharge (02/21/2026 11:20), no case document but Riverton
//      General's own puts John anywhere (RS21's prescriptions were filled 02/21/2026 at 12:10 PM, after the discharge).
//   4. THE SUMS: every "$a + $b − $c = $d" written anywhere in the course adds up to the cent, and every Specials or
//      total-medical table in the case documents totals its own lines (RS33's planted $42,894.00 typo excepted).
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
  [/PIP (?:limit )?exhausted (?:on )?06\/26\/2026|PIP exhausted 06\/2026|\bPIP\b(?:(?!MedPay)[^.;|\n]){0,40}\bexhaust\w*(?:(?!MedPay)[^.;|\n]){0,12}06\/26\/2026/, 'PIP exhausted 06/26/2026 (PIP ran out 03/04/2026; MedPay 06/26/2026)'],
  [/\$?19,801\\?\.40/, 'the old planted UM-demand total ($19,801.40; the planted total is now $46,384.00 = $42,984.00 + $3,400.00 future medical)'],
  [/\$?(?:12,395|7,395)\\?\.00 overstat/, 'a Lien Sheet overstatement that counts a Summit line RS63 does not have (the draft is $17,965.00: $10,000.00 over)'],
  [/\$[1-9][\d,]*\.\d\d (?:of )?PIP (?:left|remaining)/, 'PIP money left after 03/04/2026 (the ER and EMS bills exhausted it; what was left later was MedPay)'],
  [/primary \(PIP\)|denied, PIP primary/, 'Summit denied as "PIP primary" (PIP was gone 03/04/2026; MedPay paid the MRI, so MedPay was primary)'],
  [/MedPay[^.;|\n]{0,40}first in the payer order/i, 'MedPay first in the Payer Order (PIP → MedPay → Peach State → LOP)'],
  [/\bPIP(?: \(Harbor Point\))?\s*(?:→|->|, then)\s*Peach State/, 'John Doe\'s Payer Order without MedPay (PIP → MedPay → Peach State → LOP)'],
  [/night the urgent care sent him/, 'the transfer at night (RS12/RS97: urgent care 09:05, ambulance 10:31, ED 10:49, EMC 13:40)'],
  [/PIP is spent on the emergency care/, 'PIP spent on 02/23/2026 (the bills reached Harbor Point 02/25/2026; PIP was exhausted 03/04/2026)']
];
const SKIP = [/^build\/videoslide\/(?!day\d\.json$)/, /^build\/day\d\.js$/, /^build\/case-flow\/slides\/deck-pages\.json$/, /^\.github\/scripts\/john-doe-figures\.cjs$/,
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
  t.split('\n').forEach((line, i) => { RETIRED.forEach(([re, why]) => { const m = line.match(re); if (m) fail.push(`${f}:${i + 1}: "${m[0]}" — ${why}`); }); });
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

// 3. the story the new figures tell
const SCAN = FILES.filter(f => !/^\.github\//.test(f));
const PIP_PAID = /\bPIP\b(?:(?!MedPay|Medical Payments)[^;.,•\n"<]){0,40}\b(?:paid|covered|went to|spent on)\b(?:(?!MedPay|Medical Payments)[^;.•\n"<]){0,40}\b(?:MRI|imaging|specialists|Lakeside|Summit|orthopedic)/;
const PAID_BY_PIP = /\b(?:MRI|Lakeside|Summit|orthopedic visits?|specialists)\b[^;.•\n"<]{0,40}\bpaid by (?:Harbor Point(?:'s)? )?PIP\b/;
const LISTS_SUMMIT = /Lien Sheet(?:[^.;•\n"]|\.\d){0,60}\b(?:lists?|listing|still lists)\b(?:[^.;•\n"]|\.\d){0,80}\bSummit\b/;
const OVERSTATED = /Lien Sheet[^"\n]{0,300}?(\$[\d,]+\.\d\d) overstatement|(\$[\d,]+\.\d\d) overstatement[^"\n]{0,200}Lien Sheet/;
for (const f of SCAN) {
  const t = fs.readFileSync(path.join(ROOT, f), 'utf8'); if (!/John Doe|Harbor Point|Riverton|RS\d\d/.test(t)) continue;
  t.split('\n').forEach((line, i) => {
    const at = `${f}:${i + 1}`;
    let m;
    if (!/narration/i.test(line) && ((m = line.match(PIP_PAID)) || (m = line.match(PAID_BY_PIP)))) fail.push(`${at}: "${m[0]}" — PIP paid only the ER ($8,850.00) and EMS ($1,150.00); MedPay paid urgent care, Lakeside and the MRI`);
    if ((m = line.match(LISTS_SUMMIT))) fail.push(`${at}: "${m[0]}" — the draft Lien Sheet (RS63 C-9) has no Summit line: PIP $10,000.00 + Peach State $1,860.00 + Riverton Spine & Rehab $6,105.00 = $17,965.00`);
    if ((m = line.match(OVERSTATED)) && (m[1] || m[2]) !== '$10,000.00') fail.push(`${at}: "${(m[1] || m[2])} overstatement" — the draft Lien Sheet is $17,965.00 against $7,965.00 owed: $10,000.00 over`);
    if (/[Ee]very bill is in/.test(line) && (line.match(/\$[\d,]+\.\d\d/g) || []).length >= 3) ['$685.00', '$2,182.60', '$24,400.00', '$640.00', '$2,395.00', '$3,400.00', '$312.40'].forEach(x => { if (!line.includes(x)) fail.push(`${at}: says every bill is in but leaves out ${x} (the bills total $41,585.00 billed)`); });
  });
}
// the 14-day initial-care condition is Florida's: a list that names Riverton's PIP, or any one line about Riverton, never states it bare
const FOURTEEN = /initial care|within 14 days|14th day|14-day (?:condition|deadline|rule)/i, FLORIDA = /Florida|Fla\. Stat|no 14-day|has no|none/i;
const walk14 = (v, where) => {
  if (Array.isArray(v)) {
    const strs = v.filter(x => typeof x === 'string');
    if (strs.some(s => /Riverton/.test(s) && /\bPIP\b/.test(s))) strs.forEach(s => { if (FOURTEEN.test(s) && !FLORIDA.test(s)) fail.push(`${where}: "${s.slice(0, 90)}" — sits in a list about Riverton's PIP; the 14-day initial-care condition is Florida's only (Riverton has none)`); });
    v.forEach((x, k) => walk14(x, `${where}[${k}]`));
  } else if (v && typeof v === 'object') Object.keys(v).forEach(k => walk14(v[k], `${where}.${k}`));
  else if (typeof v === 'string') v.split(/\n|•/).forEach(s => { if (/Riverton/.test(s) && FOURTEEN.test(s) && !FLORIDA.test(s) && !/payment within 14 days|release/i.test(s)) fail.push(`${where}: "${s.trim().slice(0, 90)}" — gives Riverton a 14-day initial-care condition; it is Florida's only`); });
};
['slides', 'scripts'].forEach(dir => fs.readdirSync(path.join(ROOT, 'build/case-flow', dir)).filter(n => /\.json$/.test(n) && n !== 'deck-pages.json').forEach(n => walk14(JSON.parse(fs.readFileSync(path.join(ROOT, 'build/case-flow', dir, n), 'utf8')), `build/case-flow/${dir}/${n}`)));
global.window = {}; require(path.join(ROOT, 'js', 'cm-case-flow-data.js')); walk14(window.CM_CASE_FLOW, 'js/cm-case-flow-data.js');
// the draft Lien Sheet is RS63's C-9 line, and RS70 and the Day 4 exhibit audit the same total
const html = id => fs.readFileSync(path.join(ROOT, 'documents/case-flow/html', id + '.html'), 'utf8');
const c9 = (html('RS63').match(/<td>C-9<\/td><td>Lien Sheet:([^<]*)</) || [])[1] || '';
const c9amts = c9.match(/\$[\d,]+\.\d\d/g) || [];
if (sum(c9amts) !== cents('$17,965.00')) fail.push(`RS63 C-9: the draft Lien Sheet's lines (${c9amts.join(' + ') || 'none found'}) do not total $17,965.00`);
if (!html('RS70').includes('Lien Sheet at $17,965.00')) fail.push('RS70: the draft Lien Sheet is $17,965.00 (RS63 C-9)');
if (!fs.readFileSync(path.join(ROOT, 'build/case-flow/exhibits/d4.json'), 'utf8').includes('audited from $17,965.00 to $7,965.00')) fail.push('build/case-flow/exhibits/d4.json: the Lien Sheet is audited from $17,965.00 (RS63 C-9) to $7,965.00');
// RS12: the transfer is the red flag, and the note is signed after the ambulance left; RS97 has him arrive after that
const rs12 = html('RS12');
if (/Transfer/.test(rs12) && /no red flags/i.test(rs12)) fail.push('RS12: a note that transfers him to the ED to rule out cord compression cannot also say "no red flags"');
if (/Transfer/.test(rs12) && /may work[;,]/i.test(rs12)) fail.push('RS12: no "may work" release on the day he goes to the ED by ambulance');
const hm = s => s ? +s.slice(0, 2) * 60 + +s.slice(3) : NaN;
const left = hm((rs12.match(/departed (\d\d:\d\d)/) || [])[1]), signed = hm((rs12.match(/signed 02\/20\/2026 (\d\d:\d\d)/) || [])[1]), arrived = hm((html('RS97').match(/Arrival<\/label><div class="v">02\/20\/2026 (\d\d:\d\d)/) || [])[1]);
if (!(signed > left)) fail.push('RS12: the note must be signed after the ambulance departed (it records the departure)');
if (!(arrived > left)) fail.push('RS97: the ED arrival must follow RS12\'s ambulance departure');

// John is in Riverton General from the ED arrival (02/20/2026 10:49, RS97) to his discharge (02/21/2026 11:20): no case
// document puts him anywhere else in between (a pharmacy receipt, a visit, a call). A document's own print or fax stamp
// is not his event; Riverton General's own records (and RS98, its bill) are where he was.
{
  const WIN_FROM = 10 * 60 + 49, WIN_TO = 1440 + 11 * 60 + 20;
  const STAMP = /\b02\/(20|21)(?:\/2026)?\b[^<\n]{0,40}?\b(\d{1,2}):(\d\d)(?:\s*([AaPp])\.?\s*[Mm]\b\.?)?/g;
  for (const n of fs.readdirSync(path.join(ROOT, 'documents/case-flow/html')).filter(n => /^RS\d+\.html$/.test(n))) {
    const id = n.slice(0, -5), doc = html(id);
    if (/RIVERTON GENERAL/i.test((doc.match(/class="lh-name"[^>]*>([^<]*)/) || [])[1] || '') || id === 'RS98') continue;
    doc.split('\n').forEach((line, i) => {
      for (const m of line.matchAll(STAMP)) {
        if (/print|fax|generat|export|run /i.test(line.slice(Math.max(0, m.index - 24), m.index))) continue;
        let h = +m[2]; const ap = (m[4] || '').toLowerCase();
        if (ap === 'p' && h < 12) h += 12; if (ap === 'a' && h === 12) h = 0;
        const at = (m[1] === '21' ? 1440 : 0) + h * 60 + +m[3];
        if (at > WIN_FROM && at < WIN_TO) fail.push(`${id}:${i + 1}: "${m[0]}" — John was in Riverton General from 02/20/2026 10:49 to 02/21/2026 11:20 (RS97); nothing else happens to him in between`);
      }
    });
  }
}

// 4. the sums
const AMT = '\\$\\d{1,3}(?:,\\d{3})*(?:\\.\\d\\d)?', EQ = new RegExp(`${AMT}(?:\\s*[+−–-]\\s*${AMT})+\\s*=\\s*${AMT}`, 'g');
let eqs = 0;
for (const f of SCAN) {
  fs.readFileSync(path.join(ROOT, f), 'utf8').split('\n').forEach((line, i) => {
    for (const m of line.matchAll(EQ)) {
      eqs++;
      const tok = m[0].match(new RegExp(`${AMT}|[+−–-](?=\\s*\\$)|=`, 'g'));
      let v = cents(tok[0]), sign = 1, k = 1;
      for (; tok[k] !== '='; k++) { if (/^[+−–-]$/.test(tok[k])) sign = tok[k] === '+' ? 1 : -1; else v += sign * cents(tok[k]); }
      if (v !== cents(tok[k + 1])) fail.push(`${f}:${i + 1}: "${m[0]}" — the left side is ${fmt(v)}`);
    }
  });
}
// a Specials or total-medical table in the case documents totals its own lines (RS33's planted typo is the one exception, and stays planted)
const PLANTED_TOTAL = { RS33: '$42,894.00' };
for (const n of fs.readdirSync(path.join(ROOT, 'documents/case-flow/html')).filter(n => /^RS\d+\.html$/.test(n))) {
  const id = n.slice(0, -5);
  for (const tb of html(id).match(/<table[\s\S]*?<\/table>/g) || []) {
    let run = [];
    for (const r of tb.match(/<tr[\s\S]*?<\/tr>/g) || []) {
      const amts = [...r.matchAll(/<td[^>]*class="num"[^>]*>\s*(−?\$[\d,]+\.\d\d)\s*</g)].map(x => x[1]);
      if (!/class="total"/.test(r)) { if (amts.length) run.push(amts[amts.length - 1]); continue; }
      if (/special|total medical/i.test(r) && amts.length && run.length > 1) {
        const total = amts[amts.length - 1], got = run.reduce((a, x) => a + (x[0] === '−' ? -cents(x.slice(1)) : cents(x)), 0);
        if (PLANTED_TOTAL[id]) { if (total !== PLANTED_TOTAL[id] || got !== cents('$42,984.00')) fail.push(`${id}: its planted Specials typo is ${PLANTED_TOTAL[id]} against lines of $42,984.00 (it shows ${total} against ${fmt(got)})`); }
        else if (got !== cents(total)) fail.push(`${id}: the table's lines (${run.join(' + ')}) come to ${fmt(got)}, but its total says ${total}`);
      }
      run = [];
    }
  }
}

if (fail.length) { console.log(`${fail.length} problem(s):`); fail.forEach((m, i) => console.log(`${i + 1}. ${m}`)); process.exit(1); }
console.log(`John Doe's figures: ${checked} files carry none of the ${RETIRED.length} retired figures; the story holds (PIP on the ER and EMS only, MedPay second, the 14-day condition Florida's, the Lien Sheet $17,965.00); ${eqs} written sums add up; the money trail adds up (medical $41,400.00, Specials $42,984.00, PIP $10,000.00 in 48 hours, MedPay $5,000.00, net $20,359.92).`);
