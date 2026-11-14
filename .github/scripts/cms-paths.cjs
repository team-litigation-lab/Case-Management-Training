// @check node — Every "CMS → X → Y" a trainee reads names a real menu item of the CMS: X one of its tabs, header or sidebar items, Y a section of that tab (no "Case File → Risk Flags", "Financial Ledger → Trust", "Tasks → Escalate")
// The CMS is the practice CRM in team-litigation-lab/CaseManagementTraining (the frame 🚀 Launch opens). Its open case has
// these tabs (index.html .case-tabs), each with the sections below (its .section-head titles and the buttons that add to
// them); the case header carries the Case ID, the Case Status and ⚠ Add critical note; the sidebar 📝 New Intake, the Case
// Library and the calendars. The course's copy once named a CMS of its own ("CMS → Case File → Risk Flags", "CMS →
// Financial Ledger → Net Sheet → Lien Tracker", "CMS → Tasks → Escalate"): a trainee who looked for those found nothing.
// This reads every "CMS → …" in the Case Flow's sources (js/cm-case-flow-data.js and build/case-flow/**/*.json, from
// which the slides, the scripts, the exhibits and the simulations are built) and the generated slides, and fails one whose
// first step is not a real CMS item, or whose second step is not a section of that tab. What follows the path (its
// prose, "· Email Workspace", "(routed to …)") is not read. The trainer's scripts' "CMS › X › Y" are read the same way. When the CMS gains a tab or a section, add it here.
// Also: the CMS Case File grade's areas (js/cm-cms-file.js AREAS) are matched on these same names.
// Usage: node .github/scripts/cms-paths.cjs
const fs = require('fs');
const path = require('path');
const ROOT = process.cwd();
const failures = []; const fail = (m) => failures.push(m);
// the CMS's menu: tab → its sections (an empty list: the tab has one section, named as the tab)
const MENU = {
  'Profile': ['Identity', 'Emergency Contact', 'Authorized to Access Case', 'Employment Details', 'Primary Injury', 'Case Narrative', 'Social Media & Communications'],
  'Parties Involved': ['+ Passenger', '+ At-Fault Party', '+ Witness', '+ Other'],
  'Police Report': ['Police Report Details'],
  'Insurance': ['Health Insurance', 'Independent Subrogation Card', 'Property Damage Claim', 'Additional Insurance', 'PIP / UM/UIM Coverage Stack'],
  'Treatment': ['Medical Chronology', 'Provider Treatment Matrix', 'Other Treatment Notes', 'Total Medical Specials'],
  'Lost Wages': [],
  'Case Costs': [],
  'Demand': ['Demand Info', '+ Add Demand'],
  'Settlement (BI/UM)': ['BI Settlement', 'UM / UIM Settlement', 'Settlement Status', 'Settled With', 'Date Settled', 'Gross Settlement', 'Attorney Fee %', 'Case Costs', 'Medical Liens / Payoffs', 'Release Signed', 'Check Received / Disbursed', 'Offer & Counter History'],
  'ADR': ['ADR: Mediation & Arbitration'],
  'Litigation': ['Opposing Counsel', 'Discovery & Filing Tracker'],
  'Doc Hub': ['Documents', 'Intake Documents', 'Medical Records', 'Police Report', 'Case Files', 'Invoices', 'Bills', 'Property Damage', 'Litigation Documents', 'Others'],
  'Notes': ['Case Notes', '+ Add Case Note'],
  'Tasks': ['Action Item Log', '+ Add Task'],
  'Calendar': [], '📅 Calendar': [],
  'Time': [], '⏱ Time': [],
  'Liens': ['Outstanding Case Liens'],
  'Property Damage': ['Client Vehicle', 'Third Party Vehicle', 'Property Damage Photos'],
  // the case header and the sidebar
  'Case ID': [], 'Case Status': [], '⚠ Add critical note': [], '📄 Download Case Summary': [],
  '📝 New Intake': [], 'Case Library': [], '📅 Firm Calendar': [], "🗓 Attorney's Calendar": [], '📞 Call Simulator': []
};
// the same doc categories the course files into (js/cm-doc-filing.js CATEGORIES): the Doc Hub's sections must be them
const filing = fs.readFileSync(path.join(ROOT, 'js/cm-doc-filing.js'), 'utf8');
const cats = (/const CATEGORIES = (\[[^\]]*\])/.exec(filing) || [])[1];
if (!cats) fail('js/cm-doc-filing.js has no CATEGORIES');
else JSON.parse(cats).forEach((c) => { if (!MENU['Doc Hub'].includes(c)) fail(`the Doc Hub category "${c}" (js/cm-doc-filing.js) is not in this check's CMS menu`); });

const files = ['js/cm-case-flow-data.js', 'js/cm-case-flow-slides.js', 'js/cm-case-flow-scripts.js', 'js/cm-case-flow-exhibits.js', 'js/cm-case-flow-sim.js', 'js/cm-progress-log.js'];
const walk = (d) => fs.readdirSync(path.join(ROOT, d), { withFileTypes: true }).flatMap((e) => e.isDirectory() ? walk(path.join(d, e.name)) : /\.json$/.test(e.name) ? [path.join(d, e.name)] : []);
files.push(...walk('build/case-flow'));
const tabs = Object.keys(MENU).sort((a, b) => b.length - a.length);
let paths = 0; const seen = {};
for (const f of files) {
  const text = fs.readFileSync(path.join(ROOT, f), 'utf8'), lines = text.split('\n');
  lines.forEach((line, i) => {
    let k = -1;
    // (the trainer's scripts write the same path with ›: "CMS › Notes › Case Notes")
    const ln = line.replace(/CMS › /g, 'CMS → ').replace(/ › /g, ' → ');
    while ((k = ln.indexOf('CMS → ', k + 1)) >= 0) {
      const rest = ln.slice(k + 6).replace(/\*\*/g, '').replace(/\\n.*$/, '');
      paths++;
      const x = tabs.find((t) => rest.startsWith(t) && !/^[A-Za-z]/.test(rest.slice(t.length, t.length + 1)));
      const at = `${f}:${i + 1}`, shown = 'CMS → ' + rest.slice(0, 60).replace(/["\\].*$/, '');
      if (!x) { fail(`${at}: "${shown}" — "${rest.split(/ → |[·;,."\\)]/)[0].trim()}" is not a CMS tab or menu item`); continue; }
      const after = rest.slice(x.length);
      if (after.startsWith(' → ')) {
        const y = after.slice(3), secs = MENU[x].slice().sort((a, b) => b.length - a.length);
        const s = secs.find((t) => y.startsWith(t) && !/^[A-Za-z]/.test(y.slice(t.length, t.length + 1)));
        if (!s) fail(`${at}: "${shown}" — "${y.split(/ → |[·;,."\\)(]/)[0].trim()}" is not a section of the CMS's ${x} tab (${MENU[x].join(', ') || 'none'})`);
        else { seen[`${x} → ${s}`] = (seen[`${x} → ${s}`] || 0) + 1;
          if (y.slice(s.length).startsWith(' → ')) fail(`${at}: "${shown}" goes deeper than the CMS's menu (tab → section)`); }
      } else seen[x] = (seen[x] || 0) + 1;
    }
  });
}
if (paths < 100) fail(`only ${paths} "CMS → …" paths found: the sources moved?`);
// the CMS Case File grade's areas read the same names
const AREA = (() => { const s = fs.readFileSync(path.join(ROOT, 'js/cm-cms-file.js'), 'utf8'), a = s.indexOf('const AREAS = ['), b = s.indexOf('];', a); return new Function(s.slice(a, b + 2) + 'return AREAS;')(); })();
const areaOf = (p) => { const a = AREA.find((x) => x.re && x.re.test(p)); return a ? a.id : 'notes'; };
[['CMS → 📝 New Intake', 'parties'], ['CMS → Parties Involved', 'parties'], ['CMS → Insurance → PIP / UM/UIM Coverage Stack', 'ins'], ['CMS → Settlement (BI/UM) → Offer & Counter History', 'ins'],
 ['CMS → Calendar', 'cal'], ['CMS → Tasks → + Add Task', 'cal'], ['CMS → Notes → Case Notes', 'notes'], ['CMS → Treatment → Medical Chronology', 'notes'], ['CMS → Profile → Case Narrative', 'notes'],
 ['CMS → Treatment → Total Medical Specials', 'liens'], ['CMS → Settlement (BI/UM) → Check Received / Disbursed', 'liens'], ['CMS → Liens → Outstanding Case Liens', 'liens'], ['CMS → Case Costs', 'liens'],
 ['CMS → Litigation → Discovery & Filing Tracker', 'lit'], ['CMS → ADR', 'lit'], ['CMS → Doc Hub → Litigation Documents', 'docs'], ['CMS → Doc Hub → Others', 'docs']]
  .forEach(([p, want]) => { if (areaOf(p) !== want) fail(`js/cm-cms-file.js files "${p}" under the ${areaOf(p)} area; want ${want}`); });
if (failures.length) { console.log(`✗ CMS menu paths (${failures.length}):\n  ` + failures.slice(0, 80).join('\n  ')); process.exit(1); }
console.log(`CMS menu paths: all ${paths} "CMS → …" in the Case Flow's sources and built files name a real CMS tab or menu item, and every second step a section of that tab (${Object.keys(seen).length} distinct: ${Object.entries(seen).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, n]) => `${k} ${n}`).join(' · ')} …).`);
