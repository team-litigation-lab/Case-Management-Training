// @check node — Every place a sentence names in the CMS ("in CMS Case Notes", "the Litigation tab", "the Coverage Stack", "the Action Item Log") is a real tab or section of the CMS's menu (cms-paths.cjs MENU), or a named record that is not the CMS's (the Net Sheet's tabs, the case documents, the firm's own logs)
// cms-paths.cjs keeps every "CMS → X → Y" on the real menu. Prose named an imaginary CMS of its own beside it: "log it in
// the CMS Communications Log", "the Coverage Matrix", "the Pleadings Log", "CMS → Financial Ledger → Trust", "the CMS
// Task Log". A trainee who looked for those in the CMS found nothing. This reads the Case Flow's sources (the lesson data,
// build/case-flow/**/*.json except the Canva pages' own words, the case documents' HTML and their metadata, the deck
// notes, and the add-ons' trainee-facing copy) and checks three shapes of a name:
//   · "CMS X …"            (X capitalized: "the CMS Insurance tab", "CMS Case Notes"): X must start with a tab, a
//                          section or a menu item of the CMS (a section may be singular: "a CMS Case Note"), or be one of
//                          NOT_A_PLACE (titles that say "CMS" without naming a screen: "CMS Initialization");
//   · "the X tab"          X a CMS tab, or a tab of the LSH Net Sheet (NET_SHEET);
//   · "X Log / Ledger / Tracker / Matrix" (capitalized): a CMS section (the Action Item Log, the Discovery & Filing
//                          Tracker), a Net Sheet tab, or a record outside the CMS that the course names (RECORDS: the
//                          case documents' own titles, the binder's Negotiation Log, the firm's Trust Ledger).
// A new name is added to the right list here, on purpose: a CMS section to cms-paths.cjs MENU, anything else to RECORDS.
// All-caps words (a picture's labels, "CMS INITIALIZED") are not read.
// Usage: node .github/scripts/cms-prose.cjs
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');
const failures = []; const fail = (m) => failures.push(m);
// the CMS's menu, from cms-paths.cjs (one list for both checks)
const src = fs.readFileSync(path.join(__dirname, 'cms-paths.cjs'), 'utf8');
const MENU = new Function(src.slice(src.indexOf('const MENU = {'), src.indexOf('};', src.indexOf('const MENU = {')) + 2) + 'return MENU;')();
const strip = (t) => t.replace(/^[^\w]+/u, '').trim();
const TABS = new Set(Object.keys(MENU).map(strip));
const SECTIONS = new Set(Object.values(MENU).flat().map((s) => strip(s.replace(/^\+\s*/, ''))));
// a CMS field or page the menu above doesn't list, named in prose (the case's Date of Loss; the Training Library the frame opens)
const FIELDS = ['Date of Loss', 'Training Library'];
// a section is also named by its last words ("the Coverage Stack" is PIP / UM/UIM Coverage Stack)
const SHORT = [...SECTIONS].flatMap((x) => { const w = x.split(' '); return w.slice(1).map((_, k) => w.slice(k + 1).join(' ')).filter((t) => t.split(' ').length >= 2 && /^[A-Z]/.test(t)); });
const PLACES = [...TABS, ...SECTIONS, ...FIELDS, ...SHORT].sort((a, b) => b.length - a.length);
// the LSH Net Sheet (the course's own workbook, LSH_Net_Sheet.xlsx): its tabs and ledgers
const NET_SHEET = ['Recovery Ledger', 'Lien Tracker', 'Medical Provider Ledger', 'Master Financial Ledger', 'BI/UM Master Financial Ledger', 'Non-Medical Provider Ledger'];
// titles that say "CMS" but name no screen
const NOT_A_PLACE = ['CMS Initialization', 'CMS Countermeasures', 'CMS Intake Record', 'CMS Case Flow', 'CMS Case File', 'CMS Onboarding'];
// records outside the CMS that the course names: the case documents, the firm's and the providers' own ledgers and logs,
// the Canva pages' binder sections, the trainee's own logs
const RECORDS = ['PIP Log', 'Negotiation Log', 'Trust Ledger', 'Final Ledger', 'Final Itemized Ledger', 'Itemized Ledger', 'Itemized LOP Ledger', 'LOP Ledger',
  'Case Cost Ledger', 'Cost Ledger', 'PIP Ledger', 'PIP Payment Ledger', 'Payment Ledger', 'Rental Ledger', 'Patient Ledger', 'Medical Ledger', 'Reimbursement Ledger',
  'Lien Ledger', 'Negotiation Ledger', 'Exhaustion Ledger', 'Master Ledger', 'Trap Log', 'Bottleneck Log', 'Outreach Log', 'Client Outreach Log', 'Attendance Log',
  'Progress Log', 'Task Tracker', 'Trip Log', 'Close-Out Log', 'Discovery Log', 'Custody Log', 'Correspondence Log', 'Preservation Log', 'Rules Matrix', 'System Matrix', 'Out Log', 'Item Log', 'Call Log', 'Visit Log'];
const files = ['js/cm-case-flow-data.js', 'js/cm-case-flow-docs.js'];
const walk = (d, re) => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name), re) : re.test(e.name) ? [path.join(d, e.name)] : []);
files.push(...walk('build/case-flow', /\.json$/).filter((f) => !/deck-pages\.json$|terms\.json$/.test(f)));   // (the Canva pages' own words are the owner's; terms.json is a spelling list)
files.push(...walk('documents/case-flow/html', /\.html$/), ...walk('build/videoslide', /^day\d\.json$/));
// the add-ons' copy: every js/ file but the generated ones (read through their sources above) and the data
const GENERATED = /cm-case-flow-(slides|scripts|sim|exhibits|data|docs)\.js$|cm-companion-cases\.js$|cm-deck-slides\.js$|cm-slide-keys7\.js$/;
files.push(...fs.readdirSync(path.join(ROOT, 'js')).filter((f) => /\.js$/.test(f) && !GENERATED.test(f)).map((f) => 'js/' + f));
const ADDON = (f) => /^js\//.test(f) && !/^js\/cm-case-flow-(data|docs)\.js$/.test(f);   // an add-on: its "the X tab" is the course's own page
const W = "[A-Z][A-Za-z&/()'’-]*";   // a capitalized word
const reCms = new RegExp(`\\bCMS(?:'s|’s)? ((?:${W}|📝|📅|⏱|⚠|🗓|📄|📞)(?: (?:${W}|&))*)`, 'gu');
const reTab = new RegExp(`\\b[Tt]he ((?:${W})(?: (?:${W}|&))*) tab\\b`, 'g');
const reLog = new RegExp(`\\b((?:(?:${W}|&) )*?${W}) (Log|Ledger|Tracker|Matrix)\\b`, 'g');
const startsPlace = (x) => PLACES.find((p) => (x === p || x === p + 's' || x.startsWith(p + ' ') || x.startsWith(p + "'") || p.startsWith(x + ' (')
  || (/s$/.test(p) && (x === p.slice(0, -1) || x.startsWith(p.slice(0, -1) + ' ')))));
let read = 0; const seen = {};
for (const f of files) {
  let text = fs.readFileSync(path.join(ROOT, f), 'utf8');
  if (/\.html$/.test(f)) text = text.replace(/&rarr;/g, '→').replace(/&amp;/g, '&').replace(/<[^>]+>/g, ' ');
  text.split('\n').forEach((line, i) => {
    const at = `${f}:${i + 1}`;
    // regexes and comments in code name the old words on purpose (the tool chips still recognise them)
    if (/\.js$/.test(f) && f !== 'js/cm-case-flow-data.js' && f !== 'js/cm-case-flow-docs.js' && (/^\s*(\/\/|\/?\*)/.test(line) || /re: \//.test(line))) return;
    let m;
    reCms.lastIndex = 0;
    while ((m = reCms.exec(line))) {
      const x = m[1].trim(); read++;
      if (/^[A-Z]{2,}\b/.test(x) && !TABS.has(x.split(' ')[0])) continue;   // all caps: a picture's label, or "CMS → …"'s own path
      if (NOT_A_PLACE.some((n) => ('CMS ' + x).startsWith(n))) continue;
      const rest = line.slice(m.index).replace(/^CMS(?:'s|’s)? /, '');   // ("the CMS Date of Loss": a lower-case word inside the name)
      const p = startsPlace(x.replace(/^(?:📝|📅|⏱|⚠|🗓|📄|📞) /u, '').replace(/\)+$/, '')) || PLACES.find((q) => rest.startsWith(q));
      if (!p) fail(`${at}: "CMS ${x.slice(0, 50)}" — not a tab or section of the CMS`); else seen[p] = (seen[p] || 0) + 1;
    }
    reTab.lastIndex = 0;
    while (!ADDON(f) && (m = reTab.exec(line))) {
      const x = m[1].replace(/^CMS(?:'s)? /, '').trim(); read++;
      if (TABS.has(x) || NET_SHEET.includes(x)) { seen[x] = (seen[x] || 0) + 1; continue; }
      fail(`${at}: "the ${x} tab" — the CMS has no ${x} tab (its tabs: ${[...TABS].filter((t) => MENU[t] && MENU[t].length).join(', ')} …)`);
    }
    reLog.lastIndex = 0;
    while ((m = reLog.exec(line))) {
      const name = `${m[1]} ${m[2]}`.replace(/^(?:The|A|An|In|On|To|From|Into|Each|Every|Our|His|Her|Its|Their|Your|John Doe's|Firm's|LSH|CMS|Net Sheet's|Sheet's) /, '').replace(/^(?:The|A|An) /, '');
      read++;
      const ok = (n) => SECTIONS.has(n) || NET_SHEET.includes(n) || RECORDS.includes(n);
      // the longest tail of the phrase that is a known name ("Riverton's Final Ledger" is a Final Ledger)
      const words = name.split(' '); let hit = null;
      for (let k = 0; k < words.length && !hit; k++) { const t = words.slice(k).join(' '); if (ok(t)) hit = t; }
      if (hit) { seen[hit] = (seen[hit] || 0) + 1; continue; }
      if (/^[A-Z]{2,}/.test(name)) continue;
      fail(`${at}: "${name}" — neither a section of the CMS (cms-paths.cjs MENU) nor a record the course names outside it (RECORDS)`);
    }
  });
}
if (read < 200) fail(`only ${read} names read: the sources moved?`);
if (failures.length) { console.log(`✗ CMS places in prose (${failures.length}):\n  ` + failures.slice(0, 120).join('\n  ')); process.exit(1); }
console.log(`CMS places in prose: all ${read} names of a CMS place in ${files.length} files (the lesson data, the slide, script, exhibit and simulation sources, the case documents, the deck notes and the add-ons) are a real tab or section of the CMS, a Net Sheet tab or a record outside the CMS (${Object.entries(seen).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => `${k} ${n}`).join(' · ')} …).`);
