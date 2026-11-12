// 📂 The trainee's Backup Drive: the firm's folder structure, its grading, and where a filed document lands.
//
// The ways this breaks are all quiet ones — a folder with no rule written down, a document folder with
// nowhere to go on the drive, a grade that never leaves the trainee's browser, a second copy of the
// structure in the page that drifts from the Worker's. None of them throws in a browser; the trainee just
// gets a grade that can't be earned, or a trainer sees nothing. So they are checked here.
//
// What this checks:
//   1. The firm's structure is a tree: every folder has its rule (FOLDER_WHY), every parent comes before
//      its children, and nothing is described that isn't in it.
//   2. It is the case file this course already teaches: every folder in CM_CF_DOC_FOLDERS has a home on
//      the drive (DRIVE_HOMES), each home is a real folder of the structure, and no home is invented.
//   3. Google is asked for drive.file and nothing wider.
//   4. The Day 1 grading passes the firm's own structure and refuses a missing, differently spelled,
//      invented or misordered folder — and is not thrown by a stray slash or trailing space.
//   5. Both grades reach the trainee's account (PERSONAL_KEYS), the page carries no copy of the structure
//      or its grading, and a filed document's copy is sent by its own folder id.
// Usage: node .github/scripts/cm-drive.cjs   (no server, no browser needed)
const fs = require('fs');
const path = require('path');

const ROOT = process.cwd();
const failures = [];
const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

const html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const worker = fs.readFileSync(path.join(ROOT, 'worker.js'), 'utf8');
const drive = fs.readFileSync(path.join(ROOT, 'js/cm-drive.js'), 'utf8');
const filing = fs.readFileSync(path.join(ROOT, 'js/cm-doc-filing.js'), 'utf8');
const docs = fs.readFileSync(path.join(ROOT, 'js/cm-case-flow-docs.js'), 'utf8');

/* ---------- the Worker's side: the structure and the grading ---------- */
const wBlock = worker.slice(worker.indexOf('const DRIVE_ROOT ='), worker.indexOf('/* ---------- 🕘 automatic Time In'));
if (!wBlock.includes('function gradeLayout')) { console.log('Could not find the Backup Drive rules in worker.js'); process.exit(1); }
const W = {};
try {
  new Function('out', 'const enc = new TextEncoder(); const adminPass = () => "x";\n' + wBlock +
    '\nout.FOLDER_STANDARD = FOLDER_STANDARD; out.FOLDER_WHY = FOLDER_WHY; out.DRIVE_HOMES = DRIVE_HOMES; out.gradeLayout = gradeLayout; out.DRIVE_SCOPES = DRIVE_SCOPES;')(W);
} catch (e) { console.log('The Backup Drive rules could not be read: ' + e.message); process.exit(1); }
const { FOLDER_STANDARD, FOLDER_WHY, DRIVE_HOMES, gradeLayout, DRIVE_SCOPES } = W;

/* ---------- 1: a tree, with a rule for every folder ---------- */
FOLDER_STANDARD.forEach((p, i) => {
  if (!FOLDER_WHY[p]) fail(`"${p}" has no rule written down (FOLDER_WHY), so a trainee who misses it is told nothing.`);
  const cut = p.lastIndexOf('/');
  if (cut < 0) return;
  const parent = p.slice(0, cut);
  const at = FOLDER_STANDARD.indexOf(parent);
  if (at < 0) fail(`"${p}" has no parent folder in the structure.`);
  else if (at > i) fail(`"${p}" comes before its parent "${parent}": the structure has to be made top down.`);
});
Object.keys(FOLDER_WHY).forEach((p) => { if (!FOLDER_STANDARD.includes(p)) fail(`FOLDER_WHY describes "${p}", which isn't in the structure.`); });
ok(`the firm's structure: ${FOLDER_STANDARD.length} folders, every one with its rule, every parent before its children`);

/* ---------- 2: it is the case file this course teaches ---------- */
const FOLDERS = [];
{
  const block = docs.slice(docs.indexOf('window.CM_CF_DOC_FOLDERS'), docs.indexOf('window.CM_CF_DOCS'));
  const re = /\{\s*id:\s*"([^"]+)"/g;
  let m; while ((m = re.exec(block))) FOLDERS.push(m[1]);
}
if (!FOLDERS.length) fail('Could not read CM_CF_DOC_FOLDERS from js/cm-case-flow-docs.js.');
FOLDERS.forEach((id) => {
  const home = DRIVE_HOMES[id];
  if (!home) fail(`The case file's "${id}" folder has no home on the backup drive (DRIVE_HOMES), so a document filed from it has nowhere to go.`);
  else if (!FOLDER_STANDARD.includes(home)) fail(`"${id}" is mapped to "${home}", which isn't a folder in the firm's structure.`);
});
Object.keys(DRIVE_HOMES).forEach((id) => {
  if (!FOLDERS.includes(id)) fail(`DRIVE_HOMES maps "${id}", which isn't one of the case file's folders.`);
});
ok(`every one of the case file's ${FOLDERS.length} folders has its folder on the drive`);

/* ---------- 3: drive.file and nothing wider ---------- */
if (!/drive\.file/.test(DRIVE_SCOPES) || /drive\.readonly|auth\/drive(['" ]|$)/.test(DRIVE_SCOPES))
  fail('The Backup Drive asks Google for more than drive.file: it may only see the folders and files it makes.');
ok('Google is asked for drive.file only');

/* ---------- 4: the Day 1 grading ---------- */
const right = gradeLayout(FOLDER_STANDARD.slice());
if (!right.ok || right.score !== 100) fail(`The firm's own structure doesn't pass its own grading (${right.score}%): ${right.problems.join(' ')}`);

const cases = {
  'a missing folder': FOLDER_STANDARD.filter((p) => p !== '03 Templates'),
  'a different spelling': FOLDER_STANDARD.map((p) => (p === '04 Closed Files' ? '04 closed files' : p)),
  'an invented folder': FOLDER_STANDARD.concat(['05 Misc']),
  'the right folders in the wrong order': (() => {
    const a = FOLDER_STANDARD.slice();
    const i = a.indexOf('03 Templates'), j = a.indexOf('04 Closed Files');
    [a[i], a[j]] = [a[j], a[i]];
    return a;
  })(),
  'nothing at all': [],
};
Object.entries(cases).forEach(([what, layout]) => {
  const g = gradeLayout(layout);
  if (g.ok) fail(`${what} was accepted: the structure would be built wrong in the trainee's Drive.`);
  else if (!g.problems.length) fail(`${what} was refused with nothing to read.`);
});
// a trainee who types the right thing with stray spaces or a leading slash is not punished for whitespace
const sloppy = gradeLayout(FOLDER_STANDARD.map((p) => '/' + p + ' '));
if (!sloppy.ok) fail(`A right structure typed with a stray slash or trailing space was refused: ${sloppy.problems.join(' ')}`);
ok("Day 1 grading: the firm's structure passes, and a missing, misspelled, invented or misordered folder does not");

/* ---------- 5: the grades reach the account, and the page keeps no second copy ----------
   storeSet only syncs a key that is in PERSONAL_KEYS. Left out, a grade lives in one browser: the
   trainee loses it on another device and no trainer ever sees it, which makes grading pointless. */
const personal = html.slice(html.indexOf('const PERSONAL_KEYS = ['), html.indexOf('const PERSONAL_KEY_SET'));
['doc-filing', 'drive-setup'].forEach((k) => {
  if (!personal.includes(`"${k}"`)) fail(`"${k}" isn't in PERSONAL_KEYS, so the grade never leaves the trainee's browser.`);
});
// the page draws the structure from what the Worker sends (D.standard): a second copy is one that drifts
const driveCode = drive.replace(/\/\*[\s\S]*?\*\//g, '');
FOLDER_STANDARD.forEach((p) => {
  if (driveCode.includes(p)) fail(`js/cm-drive.js has "${p}" written into it: the firm's structure belongs to the Worker alone.`);
});
if (/function gradeLayout|FOLDER_STANDARD\s*=/.test(driveCode)) fail('js/cm-drive.js grades the layout itself: the grading belongs to the Worker alone.');
if (!/action:"setup"/.test(driveCode)) fail('js/cm-drive.js no longer sends the layout to the Worker to be graded.');
// a filed document's copy goes by its own folder id, so nothing here has to guess where it belongs
if (!/CMDrive\.saveFiled\(d\.folder,/.test(filing)) fail("js/cm-doc-filing.js no longer sends a filed document's copy to the backup drive by its own folder id.");
if (!/const forDrive = bytes\.slice\(0\)/.test(filing)) fail('js/cm-doc-filing.js hands its only copy of the bytes to the CMS, so nothing is left to keep on the drive.');
if (!html.includes('/js/cm-drive.js?v=')) fail("index.html doesn't load js/cm-drive.js.");
if (!/\$\{window\.CMDrive \? CMDrive\.slot\(\) : ""\}/.test(html)) fail('The dashboard no longer shows the Backup Drive card.');
if (!/function renderAdminFilingPanel\(/.test(html) || !/\$\{renderAdminFilingPanel\(rec\)\}/.test(html))
  fail("A trainer can no longer see the filing and Backup Drive grades in the trainee's row.");
ok("both grades ride the trainee's progress to their account, and the structure lives only on the Worker");

if (failures.length) {
  console.log('\n' + failures.length + ' problem' + (failures.length === 1 ? '' : 's') + ':');
  failures.forEach((f) => console.log(' - ' + f));
  process.exit(1);
}
console.log('\nThe Backup Drive: all good.');
