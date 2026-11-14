// @check node — The firm's file naming convention on the Backup Drive (one rule with the CMS filing; every name checked, each wrong one with the name it should have)
// 🏷 The firm's file naming convention on the Backup Drive (FILE_NAME_PATTERN, nameCheck, driveNaming in worker.js),
// against an in-memory Google Drive.
//
// A naming rule fails quietly in two directions: a name the CMS accepted is marked wrong on the drive (the trainee is
// punished for doing it right), or a name nobody would accept passes (the rule teaches nothing). And a second copy of
// the rule drifts: the filing panel says one pattern, the drive checks another. So:
//   1. One rule: the Worker's pattern is the one the filing panel, the upload panel, the document viewer and the README
//      state; its Types are the CMS's Doc Hub categories (CATEGORIES in js/cm-doc-filing.js); the client part is the
//      client folder's name; the page that draws the 🏷 box holds no copy of the pattern or the Types.
//   2. The check itself, name by name: what passes, what doesn't, the name it should have and the part pointed at.
//   3. On a drive: every file in the firm's folders is read in the grade's own two list calls (no request more), a
//      copy the CMS named passes, a hand rename, a copy that never went through the CMS, the colleague's invoice, a
//      missing or misspelled label and a retyped folder are each reported with folder, name, the name it should have
//      and the differing part; names that repeat by design keep one record each.
//   4. A file put in the linked folder by hand is listed (never charged); one outside it is never read; the page says so.
//   5. It counts: File names is a row of every graded day, 12 points, the same in the lesson's rubric (12 of the 60 the
//      Worker grades on Days 2, 3 and 4; 12 of the 48 it grades on Day 5).
//   6. It is the Worker's: a trainee can't send their own result, a trainer reads it in the report and the audit list
//      (counts only there), a presenter gets the rule without anybody's drive, and Disconnect keeps it.
//   7. Never marked down for a name the platform gave: a copy still under the name it was uploaded as, a drill laid or
//      a copy filed before names were graded, a label in the form the old grader accepted, are each LISTED with a
//      complete name to copy (scored:false) and leave the File names row whole; a copy filed since is charged.
//   8. One wrong name is charged once: on its own day, or on the latest started day when it belongs to none.
//   9. What is stored and sent is bounded: every string of the report cut to 200 characters, however long the name.
// Usage: node .github/scripts/drive-naming.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const ROOT = process.cwd();
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);
const SA = require('./drive-sa-fake.cjs');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ---------- an in-memory Google Drive: only what worker.js asks of it ----------
   The service account reads the trainee's linked folder, so a file they put there by hand is read too. */
const FOLDER = 'application/vnd.google-apps.folder';
const files = new Map(); let next = 0; const asked = [];
const make = (name, mimeType, parent, mine = true) => { const id = 'g' + (++next); files.set(id, { name, mimeType, parents: parent ? [parent] : [], trashed: false, mine, createdTime: '2026-07-01T15:00:00.000Z' }); return id; };
const byName = (name) => [...files].find(([, f]) => f.name === name && !f.trashed);
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT', expires_in: 3600 });   // the service account's token
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  asked.push(method + ' ' + u.pathname + (u.searchParams.get('q') ? '?q' : ''));
  if (u.pathname === '/upload/drive/v3/files') {
    const text = Buffer.from(init.body).toString('latin1');
    const meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
    return reply({ id: make(meta.name, 'application/pdf', meta.parents[0]), webViewLink: 'https://drive/x' });
  }
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const match = SA.qMatch(u.searchParams.get('q'));
    return reply({ files: [...files].filter(([, f]) => match(f)).map(([id, f]) => ({ id, name: f.name, mimeType: f.mimeType, parents: f.parents, createdTime: f.createdTime })) });
  }
  if (/^\/drive\/v3\/files\/[^/]+\/permissions$/.test(u.pathname)) return reply({ id: 'p' });
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m) { const f = files.get(m[1]); return f ? reply(SA.fileMeta(m[1], f)) : reply({ error: { message: 'File not found' } }, 404); }
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};

(async () => {
  const W = read('worker.js'), filing = read('js/cm-doc-filing.js'), drivePage = read('js/cm-drive.js'), flow = read('js/cm-case-flow.js'), docs = read('js/cm-case-flow-docs.js');

  /* ---------- 1: one rule ---------- */
  const block = W.slice(W.indexOf('const DRIVE_ROOT ='), W.indexOf('/* ---------- 🕘 automatic Time In'));
  const R = {};
  try {
    new Function('out', 'const enc = new TextEncoder(); const adminPass = () => "x";\n' + block +
      '\nObject.assign(out, { FILE_NAME_PATTERN, FILE_CATEGORIES, FILE_TYPES, NAME_CLIENT, CLIENT_FOLDER, NAME_PARTS, NAME_LABELS, LABEL_DOCS, SUPERSEDED_BY, DRILL_TYPE, NAMING_POINTS, NAMING_OF, DRIVE_DOC, DRIVE_HOME_CATEGORY, DRIVE_HOMES, FILE_EXTS, NAMING_OF_DAY, NAME_RULE, nameCheck, nameHint, nameAsFiled, namingRule, fileType, supersededDate, driveCaseId });')(R);
  } catch (e) { console.log('The naming rule could not be read from worker.js: ' + e.message); process.exit(1); }
  const PATTERN = '<Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.<ext>';
  if (R.FILE_NAME_PATTERN !== PATTERN) fail(`the Worker's pattern is "${R.FILE_NAME_PATTERN}", not the firm's "${PATTERN}"`);
  const asHtml = PATTERN.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  [['js/cm-doc-filing.js', filing, [PATTERN, asHtml]], ['js/cm-cms-upload.js', read('js/cm-cms-upload.js'), [PATTERN, asHtml]], ['case-doc.html', read('case-doc.html'), [asHtml]], ['README.md', read('README.md'), [PATTERN]]]
    .forEach(([f, text, wants]) => wants.forEach((w) => { if (!text.includes(w)) fail(`${f} no longer states the convention as the Worker checks it (${w})`); }));
  const cats = (filing.match(/const CATEGORIES = (\[[^\]]*\]);/) || [])[1];
  if (!cats || JSON.stringify(JSON.parse(cats)) !== JSON.stringify(R.FILE_CATEGORIES)) fail(`the Worker's categories ${JSON.stringify(R.FILE_CATEGORIES)} aren't the filing panel's ${cats}`);
  if (JSON.stringify(R.FILE_TYPES) !== JSON.stringify(R.FILE_CATEGORIES.map((c) => c.replace(/ /g, '-')))) fail(`a Type should be its category with the words joined by a hyphen: ${JSON.stringify(R.FILE_TYPES)}`);
  if (R.NAME_CLIENT !== R.CLIENT_FOLDER.split('/').pop() || R.NAME_CLIENT !== 'Doe-John') fail(`the client part should be the client folder's own name: "${R.NAME_CLIENT}"`);
  const rs25 = (docs.match(/\{[^{}]*id:\s*"RS25"[^{}]*\}/) || [''])[0], rs25cms = (rs25.match(/cms:\s*"([^"]+)"/) || [])[1];
  if (R.fileType(rs25cms) !== R.DRILL_TYPE) fail(`the colleague's file is Summit Imaging's invoice (RS25, filed under ${rs25cms}), but the drill's Type is ${R.DRILL_TYPE}`);
  Object.keys(R.LABEL_DOCS).concat(Object.values(R.SUPERSEDED_BY)).forEach((d) => { if (!R.DRIVE_DOC[d]) fail(`${d} carries a label but isn't one of the graded documents`); });
  Object.keys(R.SUPERSEDED_BY).forEach((d) => { if (R.LABEL_DOCS[d] !== 'SUPERSEDED') fail(`${d} is replaced by ${R.SUPERSEDED_BY[d]} but isn't labeled SUPERSEDED`); });
  // a copy of a document the Worker doesn't grade gets its Type from the folder it was filed to: the category most of
  // that course folder's documents are filed under (the filing panel's own long names), for every folder with a home
  const LONG = new Function('return ' + (filing.match(/const LONG = (\{[\s\S]*?\});/) || [])[1])();
  const perFolder = {};
  [...docs.matchAll(/\{id:"[A-Z0-9]+",\s*folder:"([a-z]+)",[^{}]*?cms:"([^"]+)"/g)].forEach((m) => { const c = LONG[m[2]] || m[2]; (perFolder[m[1]] = perFolder[m[1]] || {})[c] = ((perFolder[m[1]] || {})[c] || 0) + 1; });
  Object.keys(R.DRIVE_HOMES).forEach((kind) => {
    const top = Object.entries(perFolder[kind] || {}).sort((a, b) => b[1] - a[1])[0];
    if (!top || R.DRIVE_HOME_CATEGORY[kind] !== top[0] || !R.FILE_CATEGORIES.includes(R.DRIVE_HOME_CATEGORY[kind])) fail(`a copy filed to "${kind}" is suggested the Type of "${R.DRIVE_HOME_CATEGORY[kind]}", but most of that folder's documents are filed under "${top && top[0]}"`);
  });
  // the page draws the rule, it doesn't keep one
  if (/Case ID>_|&lt;Case ID&gt;_/.test(drivePage)) fail('js/cm-drive.js carries its own copy of the pattern; it should draw the Worker\'s (naming.pattern)');
  R.FILE_TYPES.filter((t) => t.includes('-')).forEach((t) => { if (drivePage.includes(t)) fail(`js/cm-drive.js carries the Type "${t}"; the Types come from the Worker (naming.types)`); });
  if (!/namingBox\(\{day/.test(drivePage) || !/CMDrive\.namingBox\(\{day: Number\(b\.id\.charAt\(1\)\)/.test(flow)) fail('the 🏷 box should be on the Backup Drive panel and card and on every Backup File Maintenance task');
  if (/keepOnDrive\(d\.folder, d\.file\.split/.test(flow)) fail('☁️ Add to GDrive still uploads the document under its manifest name, not the firm\'s');
  ok("one rule: the Worker's pattern, Types and client part are the filing panel's and the client folder's, and the page draws them");

  /* ---------- 2: the check, name by name ---------- */
  const F = 'LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.pdf', CASE = 'LSH-2026-MVA-000041';
  const chk = (name, ctx) => R.nameCheck(name, ctx || {});
  const good = [
    [F, { filed: F }], [F, {}], [F, { caseId: CASE }],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_DRAFT.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', label: 'DRAFT' }],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-2026-07-10.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED' }],
    // the CMS's word stands: a Type the Worker would not have guessed, on a name the CMS filed for this case and client
    ['LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf' }],
    ['LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf', caseId: CASE }],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.docx', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.docx' }],
    // the extension as the CMS left it, whatever its case (the real CMS's caseFileName isn't in this repository: the lenient reading)
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.PDF', { filed: 'LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.PDF' }],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.PDF', { filed: F }],
    // a counter the CMS wrote on the date rather than after it
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12-2.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12-2.pdf' }],
    // a document type a case file holds, on a name the CMS did not file
    ['LSH-2026-MVA-000041_Doe-John_Case-Files_2026-11-12.docx', { caseId: CASE }], ['LSH-2026-MVA-000041_Doe-John_Property-Damage_2026-11-12.jpg', { caseId: CASE }],
    // and so does anything the CMS itself put after the date (a counter on a second document of one Type and day), with a label after it
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf' }],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2_DRAFT.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2.pdf', label: 'DRAFT' }],
  ];
  good.forEach(([n, c]) => { const r = chk(n, c); if (!r.ok) fail(`"${n}" should pass: ${R.nameHint(r)}`); });
  // [name, ctx, the part pointed at, the name it should have, what the hint must say]
  const bad = [
    ['LSH-2026-MVA-000041_John-Doe_Medical-Records_2026-11-12.pdf', { filed: F }, 2, F, /part 2.*Last-First.*"John-Doe" should be "Doe-John".*Last name first/],
    ['LSH-2026-MVA-000041_doe-john_Medical-Records_2026-11-12.pdf', { caseId: CASE }, 2, F, /Capitals/],
    ['LSH-2026-MVA-000099_Doe-John_Medical-Records_2026-11-12.pdf', { caseId: CASE }, 1, F, /part 1.*Case ID.*LSH-2026-MVA-000041/],
    ['LSH-2026-MVA-000041_Doe-John_medical records_2026-11-12.pdf', { caseId: CASE }, 3, F, /part 3.*Type.*"medical records" should be "Medical-Records"/],
    // a Type that is no category: the name to copy is whole when the document's category is known, and empty (never a placeholder) when it isn't
    ['LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf', { caseId: CASE, type: 'Others' }, 3, 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', /part 3.*"Release-Review" should be "Others".*CMS category/],
    ['LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf', { caseId: CASE }, 3, '', /CMS categories.*Medical-Records.*Others\.$/],
    // "as filed" is the CMS's word only for this trainee's own case and client: anything else sent to `put` is read part by part
    ['LSH-2026-MVA-000099_Doe-John_Bills_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000099_Doe-John_Bills_2026-11-12.pdf', caseId: CASE }, 1, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', /part 1.*Case ID/],
    ['LSH-2026-MVA-000041_Doe-Jon_Bills_2026-11-12.docx', { filed: 'LSH-2026-MVA-000041_Doe-Jon_Bills_2026-11-12.docx' }, 2, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.docx', /part 2.*"Doe-Jon" should be "Doe-John"/],
    ['x_y_z_2000-01-01.pdf', { filed: 'x_y_z_2000-01-01.pdf', caseId: CASE, type: 'Medical-Records', date: '2026-11-12' }, 1, F, /4 parts of this name differ.*part 1.*then part 2/],
    ['lsh-1_Doe-John_Bills_2026-11-12.pdf', { filed: 'lsh-1_Doe-John_Bills_2026-11-12.pdf' }, 1, '', /part 1.*isn't one/],
    // dates: a real day, 2020 to next year, the label's date included
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_0001-01-01.pdf', { caseId: CASE, date: '2026-11-12' }, 4, F, /part 4/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_9999-12-31.pdf', { caseId: CASE, date: '2026-11-12' }, 4, F, /part 4/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2019-12-31.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Medical-Records_2019-12-31.pdf', caseId: CASE, date: '2026-11-12' }, 4, F, /part 4/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-1999-07-10.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED', supDate: '2026-07-10' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-2026-07-10.pdf', /part 5/],
    // extensions: a document's, in lower case, on a name the CMS did not file
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.PDF', { caseId: CASE }, 99, F, /extension.*lower case/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.exe', { caseId: CASE }, 99, F, /isn't a document's extension/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.js', { caseId: CASE, ext: 'docx' }, 99, F.replace('.pdf', '.docx'), /isn't a document's extension/],
    // two parts differ: the hint names the second as well, and every one is in `issues`
    ['LSH-2026-MVA-000041_Doe-John_medical records_2026-11-12.PDF', { caseId: CASE }, 3, F, /part 3.*"medical records" should be "Medical-Records".*Also the extension.*"\.PDF" should be "\.pdf"/],
    ['A'.repeat(30000) + '.pdf', { caseId: CASE, type: 'Bills', date: '2026-11-12' }, 0, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', /longer than 200 characters/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_11-12-2026.pdf', { caseId: CASE, date: '2026-11-12' }, 4, F, /part 4.*year first/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-02-31.pdf', { caseId: CASE, date: '2026-11-12' }, 4, F, /part 4/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-13.pdf', { filed: F }, 4, F, /"2026-11-13" should be "2026-11-12".*filed on that day/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12', { filed: F }, 99, F, /lost its extension/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf' }, 0, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf', /a copy keeps that name/],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2.pdf', label: 'DRAFT' }, 6, 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2_DRAFT.pdf', /add _DRAFT/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf', { caseId: CASE }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', /"2" shouldn't be there/],
    ['LSH-2026-MVA-000041 Doe-John Medical-Records 2026-11-12.pdf', { filed: F }, 0, F, /1 piece between underscores/],
    ['Copy of ' + F, { filed: F }, 1, F, /part 1/],
    ['RS_12_Urgent_Care_Note.pdf', { caseId: CASE, date: '2026-11-12', type: 'Medical-Records' }, 1, F, /5 parts of this name differ.*part 1 \(Case ID\): "RS" should be "LSH-2026-MVA-000041"; then part 2/],
    ['Summit-Imaging_Invoice_filed-here-by-a-colleague.pdf', { caseId: CASE, date: '2026-11-12', type: 'Invoices' }, 0, 'LSH-2026-MVA-000041_Doe-John_Invoices_2026-11-12.pdf', /3 pieces between underscores/],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', label: 'DRAFT' }, 5, 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_DRAFT.pdf', /add _DRAFT after the date/],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_draft.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', label: 'DRAFT' }, 5, 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_DRAFT.pdf', /part 5.*"draft" should be "DRAFT"/],
    // SUPERSEDED: the name to copy carries the replacing version's date (never a placeholder), and is empty when nobody can know it
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED', supDate: '2026-07-10' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-2026-07-10.pdf', /"SUPERSEDED" should be "SUPERSEDED-2026-07-10".*date of the version that replaced it/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED', supDate: '2026-07-10' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-2026-07-10.pdf', /add _SUPERSEDED-2026-07-10 after the date/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED_2026-07-10.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED', supDate: '2026-07-10' }, 0, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-2026-07-10.pdf', /one piece, last: _SUPERSEDED-2026-07-10, with a hyphen before the date/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-07-10-2026.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED', supDate: '2026-07-10' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-2026-07-10.pdf', /part 5/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_DRAFT.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED', supDate: '2026-07-10' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-2026-07-10.pdf', /part 5/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED' }, 5, '', /date of the version that replaced it/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_FINAL.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', /"FINAL" shouldn't be there/],
  ];
  bad.forEach(([n, c, part, want, says]) => {
    const r = chk(n, c), h = R.nameHint(r);
    if (r.ok) return fail(`"${n}" should not pass`);
    if (r.issues[0].n !== part) fail(`"${n}": the part pointed at should be ${part}, not ${r.issues[0].n} (${h})`);
    if (r.want !== want) fail(`"${n}" should be "${want}", not "${r.want}"`);
    if (!says.test(h)) fail(`"${n.slice(0, 90)}": the hint should say ${says}: "${h}"`);
    // the name to copy is whole or empty, never a pattern with a hole in it; the hint fits its 200 characters without being cut
    if (/[<>]/.test(r.want)) fail(`"${n.slice(0, 90)}": the name it should have still holds a placeholder: "${r.want}"`);
    if (h.length > 200 || /…$/.test(h)) fail(`"${n.slice(0, 90)}": the hint should fit 200 characters whole: (${h.length}) "${h}"`);
    if (r.issues.some((i) => typeof i.n !== 'number' || !i.part || typeof i.got !== 'string' || typeof i.should !== 'string')) fail(`"${n.slice(0, 90)}": every differing part should come back as {n, part, got, should}: ${JSON.stringify(r.issues).slice(0, 300)}`);
  });
  // every differing part is listed, in reading order
  const two = chk('LSH-2026-MVA-000041_Doe-John_medical records_2026-11-12.PDF', { caseId: CASE });
  if (JSON.stringify(two.issues.map((i) => [i.n, i.part, i.got, i.should])) !== JSON.stringify([[3, 'Type', 'medical records', 'Medical-Records'], [99, 'ext', 'PDF', 'pdf']])) fail(`both differing parts should be listed: ${JSON.stringify(two.issues)}`);
  const five = chk('RS_12_Urgent_Care_Note.pdf', { caseId: CASE, date: '2026-11-12', type: 'Medical-Records' });
  if (five.issues.length !== 5 || five.issues.map((i) => i.n).join() !== '1,2,3,4,5') fail(`all five differing parts should be listed: ${JSON.stringify(five.issues)}`);
  // the Superseded row's own reading of a date (Day 3), bounded the same way
  [['a_SUPERSEDED-2026-07-10.pdf', '2026-07-10'], ['a SUPERSEDED 7-10-2026.pdf', '2026-07-10'], ['a_superseded_07.10.26.pdf', '2026-07-10'], ['a_SUPERSEDED_20260710.pdf', '2026-07-10'], ['a_SUPERSEDED-15-07-2026.pdf', '2026-07-15'],
    ['a_SUPERSEDED-1-1-11.pdf', ''], ['a_SUPERSEDED-2026-02-31.pdf', ''], ['a_SUPERSEDED-9999-12-31.pdf', ''], ['a_2026-07-10_SUPERSEDED.pdf', '']]
    .forEach(([n, d]) => { if (R.supersededDate(n) !== d) fail(`"${n}": the date beside SUPERSEDED should read "${d}", not "${R.supersededDate(n)}"`); });
  if (!R.FILE_EXTS.includes('pdf') || !R.FILE_EXTS.includes('docx') || R.FILE_EXTS.some((e) => /^(exe|js|bat|cmd|sh|msi|scr|com|vbs|ps1|jar|dll|zip|html?)$/.test(e) || e !== e.toLowerCase())) fail(`the extensions a case file holds should be documents, in lower case: ${R.FILE_EXTS.join(' ')}`);
  [...docs.matchAll(/file:"[^"]*\.([A-Za-z0-9]+)"/g)].forEach((m) => { if (!R.FILE_EXTS.includes(m[1].toLowerCase())) fail(`the course files a .${m[1]}, which the naming check would refuse`); });
  ok(`the check, name by name: ${good.length} names that pass, ${bad.length} that don't, each with the name it should have and the part pointed at`);

  /* ---------- the Worker, a trainee with a built drive ---------- */
  const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
  const store = new Map();
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', ...SA.saEnv(),
    LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
      list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) } };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const { token: t, id: tid } = await auth('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' });
  const admin = (await auth('/api/auth/admin', { passphrase: 'ci-pass' })).token;
  await call({ action: 'link', url: SA.folderUrl(make('LSH Case Backups', FOLDER, '')) }, t);
  const std = (await call({ action: 'status' }, t)).body.drive;
  const built = await call({ action: 'setup', layout: std.standard }, t);
  if (!built.body || !built.body.built) { console.log('Could not build the drive: ' + JSON.stringify(built.body)); process.exit(1); }
  const rec = () => JSON.parse(store.get('cm:drive:' + tid));
  const folderId = (p) => rec().folders[p];
  const C = '01 Clients/Doe-John', DAY = '2026-07-01';
  const nameOf = (type, day) => `${CASE}_Doe-John_${type}_${day || DAY}.pdf`;
  const filed = [];
  const put = async (docId, kind, name) => { const r = await call({ action: 'put', docFolder: kind, name, b64: Buffer.from('%PDF-1.4 ' + docId).toString('base64url'), docId }, t); if (r.status !== 200) fail(`filing ${docId} failed: ${JSON.stringify(r.body)}`); if (docId && !filed.includes(docId)) filed.push(docId); return r.body; };
  const grade = async () => (await call({ action: 'grade', filed }, t)).body;
  const naming = async () => (await grade()).drive.naming.report;
  const fileOf = (docId) => { const s = rec().saved.filter((x) => x.docId === docId).pop(); return files.get(s.id); };
  const wrongOf = (rep, name) => (rep.list || []).find((x) => x.name === name);
  const edit = (id, fn) => { const r = JSON.parse(store.get('cm:drive:' + id)); fn(r); store.set('cm:drive:' + id, JSON.stringify(r)); };
  const row = (g, label) => (g.rows || []).find((r) => r.label === label) || {};

  /* ---------- 3: on a drive ---------- */
  // the page is told the rule with the status, before anything is checked
  const N0 = std.naming;
  if (!N0 || N0.pattern !== PATTERN || N0.client !== 'Doe-John' || N0.types['Medical Records'] !== 'Medical-Records' || (N0.labels || []).length !== 2 || (N0.parts || []).length !== 5 || N0.report !== null) fail(`the status should carry the rule and no report yet: ${JSON.stringify(N0).slice(0, 300)}`);
  // Day 1's documents: two of one Type on one day share a name, by the firm's own rule, and each keeps its record
  await put('RS05', 'intake', nameOf('Case-Files')); await put('RS07', 'intake', nameOf('Case-Files')); await put('RS06', 'police', nameOf('Police-Report'));
  if (rec().saved.length !== 3) fail(`two documents filed under one name should keep a record each: ${rec().saved.length} of 3 kept`);
  await put('RS05', 'intake', nameOf('Case-Files'));   // the same document, filed again under the same name: its record is replaced, not doubled
  if (rec().saved.filter((s) => s.docId === 'RS05').length !== 1) fail('a document filed again under the same name should replace its own record');
  byName(nameOf('Case-Files'))[1].trashed = true;       // (the first RS05 copy, replaced by the second)
  // the names are read before any later day starts, in the grade's own list calls: one per folder of the linked folder
  asked.length = 0;
  let rep = await naming();
  const tree = 1 + Object.keys(rec().folders).length;
  if (asked.length !== tree || !asked.every((a) => a === 'GET /drive/v3/files?q')) fail(`reading the names should cost the grade's list calls (one per folder, ${tree}) and nothing more: ${JSON.stringify(asked)}`);
  if (!rep || rep.checked !== 3 || rep.named !== 3 || rep.wrong !== 0 || (rep.list || []).length) fail(`three documents the CMS named should all pass, read on Day 1: ${JSON.stringify(rep)}`);
  if ((await grade()).drive.naming.caseId !== CASE) fail('the trainee\'s Case ID should be read from their filed copies');
  asked.length = 0; await call({ action: 'check' }, t);
  if (asked.length !== 17) fail(`✓ Check my drive should still cost 17 folder reads: ${asked.length}`);
  ok('names the CMS filed pass, read on Day 1 in the list calls the grade already makes; names that repeat keep a record each');

  // a hand rename in Drive
  fileOf('RS06').name = `${CASE}_John-Doe_Police-Report_${DAY}.pdf`;
  rep = await naming();
  let x = wrongOf(rep, `${CASE}_John-Doe_Police-Report_${DAY}.pdf`);
  const i0 = (x && x.issues && x.issues[0]) || {};
  if (rep.wrong !== 1 || rep.wrongFiles !== 1 || rep.wrongFolders !== 0 || !x || x.kind !== 'file' || x.scored !== true || x.folder !== '02 Police, Witness & Video' || x.want !== nameOf('Police-Report') || x.issues.length !== 1 || i0.n !== 2 || i0.part !== 'Last-First' || i0.got !== 'John-Doe' || i0.should !== 'Doe-John' || !/part 2/.test(x.hint)) fail(`a name turned round by hand should come back with its folder, the name it should have and part 2 pointed at: ${JSON.stringify(rep)}`);
  // moved out of its folder as well: still read, with where it is now
  fileOf('RS06').parents = [folderId('03 Templates')];
  x = wrongOf(await naming(), `${CASE}_John-Doe_Police-Report_${DAY}.pdf`);
  if (!x || x.folder !== '03 Templates') fail(`a renamed copy moved to another folder should be reported where it is now: ${JSON.stringify(x)}`);
  fileOf('RS06').parents = [folderId(`${C}/02 Police, Witness & Video`)]; fileOf('RS06').name = nameOf('Police-Report');
  // a copy that never went through the CMS (an old ☁️ Add to GDrive name)
  await put('RS09', 'insurance', 'RS_09_GEICO_Declarations_Page.pdf');
  rep = await naming(); x = wrongOf(rep, 'RS_09_GEICO_Declarations_Page.pdf');
  // …is the platform's own name: listed with the whole name to copy (its Type from the folder it was filed to), and not charged
  if (rep.wrong !== 1 || rep.unscored !== 1 || !x || x.want !== nameOf('Others') || x.scored !== false || x.folder !== '05 Insurance, Demands & Negotiation' || !/platform uploaded it under/.test(x.hint)) fail(`a copy under its manifest name should be listed, not charged, with the firm's whole name for it: ${JSON.stringify(x)}`);
  fileOf('RS09').name = nameOf('Others');
  // a folder retyped in Drive
  files.get(folderId(`${C}/03 Medical Records`)).name = '03 Medical records';
  rep = await naming(); x = (rep.list || []).find((y) => y.kind === 'folder');
  if (rep.wrong !== 1 || rep.wrongFolders !== 1 || rep.wrongFiles !== 0 || rep.checked !== 4 || rep.named !== 4 || !x || x.name !== '03 Medical records' || x.want !== '03 Medical Records' || x.folder !== 'Doe-John' || x.scored !== true || (x.issues[0] || {}).part !== 'folder' || x.issues[0].should !== '03 Medical Records') fail(`a folder retyped in Drive should be reported against the standard's name, counted apart from the files: ${JSON.stringify(rep)}`);
  // files and folders are counted apart, and the counts add up: checked = named + wrongFiles, wrong = wrongFiles + wrongFolders
  fileOf('RS06').name = 'police report.pdf';
  rep = await naming();
  if (rep.checked !== 4 || rep.named !== 3 || rep.wrongFiles !== 1 || rep.wrongFolders !== 1 || rep.wrong !== 2 || rep.checked !== rep.named + rep.wrongFiles) fail(`one wrong file and one wrong folder should read 4 files checked, 3 named, 1 file and 1 folder wrong: ${JSON.stringify(rep).slice(0, 300)}`);
  fileOf('RS06').name = nameOf('Police-Report');
  // a structure built before names were graded carries no stamp: its retyped folder is listed, not charged
  edit(tid, (r) => { delete r.nameRule; });
  x = ((await naming()).list || []).find((y) => y.kind === 'folder');
  if (!x || x.scored !== false) fail(`a folder retyped in a structure built before names were graded should be listed and not charged: ${JSON.stringify(x)}`);
  edit(tid, (r) => { r.nameRule = R.NAME_RULE; });
  files.get(folderId(`${C}/03 Medical Records`)).name = '03 Medical Records';
  if ((await naming()).wrong !== 0) fail('with every name put right the report should be clean again');
  ok('a hand rename, a moved copy, a copy the CMS never named and a retyped folder are each reported with folder, name, the name it should have and the differing part');

  // "the CMS named it" is the CMS's word only for this trainee's case and client: what else is sent to `put` isn't named the firm's way
  await put('RS10', 'police', 'x_y_z_2000-01-01.pdf'); await put('RS11', 'police', `LSH-2026-MVA-000099_Doe-John_Police-Report_${DAY}.pdf`);
  rep = await naming();
  const pad = wrongOf(rep, 'x_y_z_2000-01-01.pdf'), other = wrongOf(rep, `LSH-2026-MVA-000099_Doe-John_Police-Report_${DAY}.pdf`);
  if (rep.named !== 4 || rep.checked !== 6 || !pad || pad.scored !== false || pad.want !== nameOf('Police-Report') || !other || other.scored !== false || other.want !== nameOf('Police-Report') || (other.issues[0] || {}).part !== 'Case ID')
    fail(`a name sent to "put" that isn't this trainee's case in the firm's shape should not count as named (and, being the name it was uploaded under, not be charged either): ${JSON.stringify(rep).slice(0, 600)}`);
  if ((await grade()).drive.naming.caseId !== CASE) fail('one copy under another Case ID should not change the trainee\'s own');
  byName('x_y_z_2000-01-01.pdf')[1].trashed = true; byName(`LSH-2026-MVA-000099_Doe-John_Police-Report_${DAY}.pdf`)[1].trashed = true;
  // the extension as the CMS left it
  await put('RS08', 'police', nameOf('Police-Report').replace('.pdf', '.PDF'));
  if ((rep = await naming()).wrong !== 0 || rep.checked !== 5) fail(`a copy filed with an upper-case extension keeps it: ${JSON.stringify(rep.list)}`);
  byName(nameOf('Police-Report').replace('.pdf', '.PDF'))[1].trashed = true;
  // a copy whose record was replaced (the same document filed again under the same name) is still read as it was filed
  await put('RS04', 'intake', nameOf('Release-Review')); const firstId = rec().saved.find((s) => s.docId === 'RS04').id;
  await put('RS04', 'intake', nameOf('Release-Review'));
  const again = rec().saved.filter((s) => s.docId === 'RS04');
  if (again.length !== 1 || again[0].id === firstId || !(again[0].was || []).includes(firstId)) fail(`a record replaced by the same document filed again should keep the replaced copy's Drive id: ${JSON.stringify(again)}`);
  rep = await naming();
  if (rep.wrong !== 0 || rep.checked !== 6 || rep.named !== 6) fail(`the copy a newer one replaced should still read as filed (a Type only the CMS knows): ${JSON.stringify(rep).slice(0, 400)}`);
  // …and a copy whose record is gone altogether is read by its own name, and never charged
  edit(tid, (r) => { r.saved = r.saved.filter((s) => s.docId !== 'RS04'); });
  rep = await naming();
  if (rep.wrong !== 0 || rep.checked !== 6) fail(`a copy whose record was lost should read by its own name: ${JSON.stringify(rep.list)}`);
  files.get(firstId).name = 'release review.pdf';
  x = wrongOf(await naming(), 'release review.pdf');
  if (!x || x.scored !== false || x.want !== nameOf('Case-Files')) fail(`a renamed copy nobody has a record of should be listed with a whole name and not charged: ${JSON.stringify(x)}`);
  [...files].filter(([, f]) => f.parents[0] === folderId(`${C}/01 Intake & Retainer`) && /release|Release/.test(f.name)).forEach(([, f]) => { f.trashed = true; });
  ok('"as filed" is this trainee\'s case and client only; an extension as the CMS left it stands; a copy whose record was replaced or lost is still read as filed');

  /* ---------- 4: a file put in by hand, and what isn't this drive's ---------- */
  const scan = make('scan0001.pdf', 'application/pdf', folderId(`${C}/03 Medical Records`));    // uploaded by hand into the linked folder: read, never charged
  make('Notes from another LSH site.pdf', 'application/pdf', make('Some other app folder', FOLDER, ''));   // outside the linked folder: never read
  rep = await naming();
  x = wrongOf(rep, 'scan0001.pdf');
  if (rep.wrong !== 1 || rep.checked !== 5 || !x || x.scored !== false || x.folder !== '03 Medical Records') fail(`a file uploaded by hand should be listed, not charged, and a file outside the linked folder never read: ${JSON.stringify(rep)}`);
  files.get(scan).trashed = true;
  const rule = (await call({ action: 'status' }, t)).body.drive.naming;
  if (!/outside your Backup Drive folder/.test(rule.blind || '') || !/wherever in it you have moved or renamed/.test(rule.sees || '')) fail(`the page should be told what the check reads and what it can't see: ${JSON.stringify([rule.sees, rule.blind])}`);
  if (!/\.sees/.test(drivePage) || !/\.blind/.test(drivePage)) fail('js/cm-drive.js should show what the check reads and what it can\'t see');
  ok("a file put in the linked folder by hand is listed and never charged; a file outside the linked folder isn't this drive's");

  /* ---------- 5: it counts ---------- */
  // Day 2: the colleague's invoice arrives named off the convention
  for (const [d, k] of [['RS12', 'medical'], ['RS13', 'medical'], ['RS15', 'medical']]) await put(d, k, nameOf('Medical-Records'));
  await put('RS25', 'bills', nameOf('Invoices'));
  await call({ action: 'drill', day: 2 }, t);
  const drill = [...files.values()].find((f) => /colleague/.test(f.name));
  drill.parents = [folderId(`${C}/04 Bills & Invoices`)];
  await call({ action: 'check' }, t);
  let g = (await grade()).grades[2];
  x = wrongOf((await grade()).drive.naming.report, drill.name);
  if (!g || row(g, 'File names').max !== R.NAMING_POINTS || row(g, 'File names').got !== Math.floor(12 * 8 / 9) || g.score === 100 || !x || x.want !== nameOf('Invoices') || x.folder !== '04 Bills & Invoices')
    fail(`Day 2 with the colleague's invoice moved but not renamed should lose File names points and name the file: ${JSON.stringify(g)} ${JSON.stringify(x)}`);
  if (!row(g, 'File names').notes.length || !/should be named/.test(row(g, 'File names').notes[0])) fail(`the File names row should say what is wrong in one line: ${JSON.stringify(row(g, 'File names'))}`);
  drill.name = nameOf('Invoices');
  g = (await grade()).grades[2];
  if (!g || g.score !== 100 || row(g, 'File names').got !== 12 || g.rows.reduce((s, r) => s + r.max, 0) !== R.NAMING_OF) fail(`Day 2 with every name right should be 100% of ${R.NAMING_OF} points: ${JSON.stringify(g)}`);
  // Day 3: the labels. A superseded version needs its label once the version that replaced it is on the drive
  await put('RS26', 'bills', nameOf('Bills', '2026-07-02')); await put('RS33', 'insurance', nameOf('Others', '2026-07-03'));
  rep = await naming();
  if (wrongOf(rep, nameOf('Bills', '2026-07-02'))) fail('Crescent\'s 07/01 statement isn\'t superseded until the corrected one is on the drive');
  x = wrongOf(rep, nameOf('Others', '2026-07-03'));
  if (!x || x.want !== nameOf('Others', '2026-07-03').replace('.pdf', '_DRAFT.pdf') || x.issues[0].n !== 5 || x.issues[0].part !== 'label') fail(`the draft demand should be asked for its DRAFT label, as the last part: ${JSON.stringify(x)}`);
  await put('RS73', 'bills', nameOf('Bills', '2026-07-04'));
  x = wrongOf(await naming(), nameOf('Bills', '2026-07-02'));
  // the date to copy is the replacing version's own (the date in the name of the corrected statement's copy)
  if (!x || x.want !== nameOf('Bills', '2026-07-02').replace('.pdf', '_SUPERSEDED-2026-07-04.pdf') || !/add _SUPERSEDED-2026-07-04 after the date/.test(x.hint)) fail(`once the corrected statement is on the drive, the one it replaced should be asked for SUPERSEDED and that version's date, whole: ${JSON.stringify(x)}`);
  fileOf('RS26').name = nameOf('Bills', '2026-07-02').replace('.pdf', '_SUPERSEDED.pdf');
  if (!wrongOf(await naming(), fileOf('RS26').name)) fail('SUPERSEDED with no replacing date should not pass (the name\'s own filing date is not it)');
  fileOf('RS26').name = nameOf('Bills', '2026-07-02').replace('.pdf', '_SUPERSEDED-2026-07-10.pdf');
  fileOf('RS33').name = nameOf('Others', '2026-07-03').replace('.pdf', '_DRAFT.pdf');
  rep = await naming();
  if (rep.wrong !== 0) fail(`with the labels as the last part every name should pass: ${JSON.stringify(rep.list)}`);
  const grades = (await grade()).grades;
  [2, 3].forEach((n) => { const r = row(grades[n] || {}, 'File names'); if (r.max !== 12 || r.got !== 12) fail(`Day ${n}'s File names row should be 12 of 12 with every name right: ${JSON.stringify(r)}`); });
  if (rule.points !== 12 || rule.of !== 60 || R.NAMING_POINTS !== 12 || R.NAMING_OF !== 60) fail(`the page should be told the weight (12 of 60): ${rule.points} of ${rule.of}`);
  // …and the truth about Day 5, where the Worker grades 48 of the rubric's 60 automated points (the closing checklist is the trainee's Case Notes)
  if (JSON.stringify(rule.ofDay) !== JSON.stringify({ 2: 60, 3: 60, 4: 60, 5: 48 })) fail(`the page should be told what the Worker grades each day (60, 60, 60, 48): ${JSON.stringify(rule.ofDay)}`);
  [2, 3].forEach((n) => { const t = grades[n].rows.reduce((s, r) => s + r.max, 0); if (t !== rule.ofDay[n]) fail(`Day ${n}'s rows total ${t}, not the ${rule.ofDay[n]} the Worker states`); });
  // each day's grade carries its File names row by itself, and says first what is wrong with the names
  [2, 3].forEach((n) => { const g2 = grades[n]; if (!g2.names || g2.names.got !== 12 || g2.names.max !== 12 || g2.names.wrong !== 0 || !Array.isArray(g2.issues) || g2.issues.some((i) => /🏷/.test(i))) fail(`Day ${n}'s grade should carry names {got:12, max:12, wrong:0} and no 🏷 issue: ${JSON.stringify([g2.names, g2.issues])}`); });
  if (!/N\.points/.test(drivePage) || !/N\.of/.test(drivePage)) fail('js/cm-drive.js should state the weight the Worker gives the names');
  // the lesson's rubric says the same: each day's automated rows total 60, File names 12 of them, every row the Worker's weight
  const data = read('js/cm-case-flow-data.js');
  const wrows = {};
  [...W.matchAll(/grade(?:Row|Parts)\("([^"]+)", (\d+|NAMING_POINTS),/g)].forEach((m) => { wrows[m[1]] = m[2] === 'NAMING_POINTS' ? R.NAMING_POINTS : Number(m[2]); });
  for (const n of [2, 3, 4, 5]) {
    const line = data.split('\n').find((l) => l.includes(`"id":"d${n}-drive"`)) || '';
    const ai = JSON.parse(((line.match(/"rubric":\{"ai":(\[\[.*?\]\]),"trainer"/) || [])[1]) || '[]');
    const fn = ai.find((r) => r[0] === 'File names');
    if (!fn || fn[1] !== R.NAMING_POINTS) fail(`Day ${n}'s rubric should carry File names for ${R.NAMING_POINTS} points: ${JSON.stringify(ai.map((r) => [r[0], r[1]]))}`);
    if (ai.reduce((s, r) => s + r[1], 0) !== R.NAMING_OF) fail(`Day ${n}'s automated rubric rows should total ${R.NAMING_OF}`);
    // what the Worker says it grades that day is the rubric's rows it has a row for
    const graded = ai.filter(([label]) => wrows[label] !== undefined).reduce((s, r) => s + r[1], 0);
    if (graded !== R.NAMING_OF_DAY[n]) fail(`Day ${n}: the Worker grades ${graded} of the rubric's points, but states ${R.NAMING_OF_DAY[n]}`);
    ai.forEach(([label, pts]) => { if (wrows[label] !== undefined && wrows[label] !== pts) fail(`Day ${n}: "${label}" is ${pts} points in the lesson and ${wrows[label]} in the Worker`); });
  }
  ok('it counts: File names is 12 points on every graded day (of 60, and of the 48 the Worker grades on Day 5), in the Worker and in the lesson\'s rubric; the colleague\'s invoice and the labels are part of it');

  /* ---------- 8: one wrong name is charged once ---------- */
  const names = async () => { const G = (await grade()).grades; return Object.fromEntries(Object.entries(G).map(([n, g2]) => [n, g2.names])); };
  // a Day 3 document misnamed: Day 3's row, and not Day 2's
  fileOf('RS73').name = 'crescent corrected.pdf';
  let nm = await names();
  if (nm[2].got !== 12 || nm[2].wrong !== 0 || nm[3].wrong !== 1 || nm[3].got >= 12) fail(`a misnamed Day 3 document should lower Day 3's File names and leave Day 2's whole: ${JSON.stringify(nm)}`);
  fileOf('RS73').name = nameOf('Bills', '2026-07-04');
  // a Day 1 document (it belongs to no graded day) and a retyped folder: the latest started day, and only that one
  fileOf('RS06').name = 'police report.pdf'; files.get(folderId('03 Templates')).name = '03 templates';
  nm = await names();
  if (nm[2].wrong !== 0 || nm[2].got !== 12 || nm[3].wrong !== 2) fail(`a misnamed Day 1 document and a retyped folder should count on the latest started day only: ${JSON.stringify(nm)}`);
  // Day 5 starts: they move to Day 5, and a misnamed Day 5 file lowers Day 5 alone
  for (const d of ['RS51', 'RS52']) await put(d, 'litigation', nameOf('Litigation-Documents', '2026-07-05'));
  fileOf('RS52').name = 'service papers.pdf';
  const G5 = (await grade()).grades;
  nm = Object.fromEntries(Object.entries(G5).map(([n, g2]) => [n, g2.names]));
  if (nm[2].wrong !== 0 || nm[3].wrong !== 0 || nm[2].got !== 12 || nm[3].got !== 12 || nm[5].wrong !== 3 || nm[5].got >= 12) fail(`a misnamed Day 5 file must not lower Days 2 and 3, and names tied to no day move to the latest: ${JSON.stringify(nm)}`);
  rep = (await grade()).drive.naming.report;
  if (Object.values(nm).reduce((s, v) => s + v.wrong, 0) !== rep.wrong - rep.unscored) fail(`every charged name should be charged on exactly one day: ${JSON.stringify(nm)} against ${rep.wrong} wrong, ${rep.unscored} not charged`);
  if (G5[5].rows.reduce((s, r) => s + r.max, 0) !== 48 || G5[5].names.max !== 12) fail(`on Day 5 the names are 12 of the 48 points the Worker grades: ${JSON.stringify(G5[5].rows.map((r) => [r.label, r.max]))}`);
  // the 🏷 note comes first in the day's issues, however many other notes there are
  if (!/^🏷/.test(G5[5].issues[0]) || G5[5].issues.length < 4 || G5[5].issues.slice(1).some((i) => /^🏷/.test(i))) fail(`the 🏷 File names note should be the first of the day's issues: ${JSON.stringify(G5[5].issues)}`);
  fileOf('RS52').name = nameOf('Litigation-Documents', '2026-07-05'); fileOf('RS06').name = nameOf('Police-Report'); files.get(folderId('03 Templates')).name = '03 Templates';
  if ((await naming()).wrong !== 0) fail('with every name put right the report should be clean again');
  ok('one wrong name is charged once: on its own day, or on the latest started day when it belongs to none; the 🏷 note leads the day\'s issues');

  /* ---------- 9: what is stored and sent is bounded ---------- */
  fileOf('RS51').name = 'Z'.repeat(30000) + '.pdf';
  const big = await call({ action: 'grade', filed }, t);
  const strings = []; (function walk(v) { if (typeof v === 'string') strings.push(v); else if (v && typeof v === 'object') Object.values(v).forEach(walk); })(big.body.drive.naming.report);
  if (strings.some((v) => v.length > 200)) fail(`a string of the naming report is longer than 200 characters: ${Math.max(...strings.map((v) => v.length))}`);
  if (JSON.stringify(big.body).length > 60000 || store.get('cm:drive:' + tid).length > 40000) fail(`one file renamed to 30,000 characters should not swell what is sent (${JSON.stringify(big.body).length}) or stored (${store.get('cm:drive:' + tid).length})`);
  x = big.body.drive.naming.report.list[0];
  if (!x || x.name.length !== 200 || x.want !== nameOf('Litigation-Documents', '2026-07-05')) fail(`a name too long to keep should still be listed, cut, with the name it should have: ${JSON.stringify(x).slice(0, 300)}`);
  fileOf('RS51').name = nameOf('Litigation-Documents', '2026-07-05');
  ok('a Drive name of any length is stored and sent cut to 200 characters');

  /* ---------- 6: the Worker's, a trainer's, a presenter's ---------- */
  fileOf('RS12').name = 'urgent care note.pdf';
  const forged = await call({ action: 'grade', filed, naming: { checked: 99, named: 99, wrong: 0, list: [] }, grades: { 2: { score: 100, passed: true } } }, t);
  if (forged.body.drive.naming.report.wrong !== 1 || forged.body.grades[2].score === 100) fail('a trainee could send their own naming result or grade with the request');
  if ((await call({ action: 'gradeFor', traineeId: tid }, t)).status !== 403) fail("a trainee could grade through the trainer's action");
  store.set('cm:progress:' + tid, JSON.stringify({ traineeId: tid, data: { 'doc-filing': Object.fromEntries(filed.map((d) => [d, { filed: true }])) } }));
  const gf = await call({ action: 'gradeFor', traineeId: tid }, admin);
  const rn = gf.body.report && gf.body.report.naming;
  if (gf.status !== 200 || !rn || rn.wrong !== 1 || rn.list[0].name !== 'urgent care note.pdf' || rn.list[0].folder !== '03 Medical Records' || rn.list[0].want !== nameOf('Medical-Records')) fail(`a trainer should read each wrongly named file in the report: ${JSON.stringify(rn)}`);
  const all = (await call({ action: 'reportAll', traineeIds: [tid] }, admin)).body.reports[tid];
  if (!all || !all.naming || all.naming.wrong !== 1 || all.naming.wrongFiles !== 1 || all.naming.checked !== rn.checked || !all.naming.at) fail('the audit list (reportAll, no Google request) should carry how many names are wrong');
  if (all.naming.list !== undefined || Object.keys(all.naming).some((k) => !['at', 'checked', 'named', 'wrong', 'wrongFiles', 'wrongFolders', 'unscored'].includes(k))) fail(`the audit list should carry the counts and the time only, not each name: ${JSON.stringify(Object.keys(all.naming))}`);
  if (/"RT"|"AT"/.test(JSON.stringify(gf.body) + JSON.stringify(all))) fail('the report carries a token');
  if (!/rep\.naming/.test(read('js/cm-audit-table.js')) || !/renderDriveNaming\(rep\)/.test(read('index.html'))) fail('the Trainee Audit and the trainer\'s Backup Drive report should show the wrong names');
  const pres = (await call({ action: 'standard' }, admin)).body.standard;
  if (!pres.naming || pres.naming.pattern !== PATTERN || pres.naming.caseId !== '' || pres.naming.report !== undefined) fail(`a presenter should get the rule and nobody's drive: ${JSON.stringify(pres.naming).slice(0, 200)}`);
  await call({ action: 'disconnect' }, t);
  const after = (await call({ action: 'report', traineeId: tid }, admin)).body.report;
  if (!after || !after.naming || after.naming.wrong !== 1) fail('Unlinking dropped the last check of the names');
  ok("the result is the Worker's: a trainee can't send one, a trainer reads each wrong name, a presenter gets the rule only, unlinking keeps it");

  /* ---------- 7: never marked down for a name the platform gave, or for a rule that came afterwards ---------- */
  // A trainee from before names were graded, as main left their record: copies under the manifest names the old
  // ☁️ Add to GDrive uploaded, the colleague's invoice moved and not renamed (Day 2 as it was taught), labels the way
  // the old grader accepted them, and no stamp on anything.
  const { token: t2, id: id2 } = await auth('/api/auth/trainee', { name: 'Ben Old', batch: 'B100926' });
  await call({ action: 'link', url: SA.folderUrl(make('LSH Case Backups', FOLDER, '')) }, t2);
  await call({ action: 'setup', layout: std.standard }, t2);
  const filed2 = [];
  const put2 = async (docId, kind, name) => { const r = await call({ action: 'put', docFolder: kind, name, b64: Buffer.from('%PDF-1.4 ' + docId).toString('base64url'), docId }, t2); if (r.status !== 200) fail(`filing ${docId} failed: ${JSON.stringify(r.body)}`); filed2.push(docId); };
  const grade2 = async () => (await call({ action: 'grade', filed: filed2 }, t2)).body;
  const rec2 = () => JSON.parse(store.get('cm:drive:' + id2));
  const file2 = (docId) => files.get(rec2().saved.filter((s) => s.docId === docId).pop().id);
  const unstamp = () => edit(id2, (r) => { delete r.nameRule; r.saved.forEach((s) => { delete s.rule; }); Object.values(r.drills || {}).forEach((d) => { delete d.rule; }); });
  const CASE2 = 'LSH-2026-MVA-000077', name2 = (type, day) => `${CASE2}_Doe-John_${type}_${day || DAY}.pdf`;
  for (const [d, k, n] of [['RS12', 'medical', 'RS_12_Urgent_Care_Note.pdf'], ['RS13', 'medical', 'RS_13_Spine_Rehab_Initial_Eval_and_LOP.pdf'], ['RS15', 'medical', 'RS_15_Lakeside_Orthopedics_Consult_and_Followup.pdf'], ['RS25', 'bills', 'RS_25_Summit_Imaging_Invoice.pdf']]) await put2(d, k, n);
  await call({ action: 'drill', day: 2 }, t2);
  const drill2 = [...files].filter(([, f]) => /colleague/.test(f.name) && !f.trashed).pop()[1];
  drill2.parents = [rec2().folders[`${C}/04 Bills & Invoices`]];
  await call({ action: 'check' }, t2);
  unstamp();
  let o = await grade2(), g2 = o.grades[2], r2 = o.drive.naming.report;
  if (!g2 || g2.score !== 100 || g2.names.got !== 12 || g2.names.wrong !== 0 || g2.issues.length) fail(`Day 2 done as it was taught before (manifest names, the invoice moved and not renamed) should still be 100%: ${JSON.stringify(g2)}`);
  if (r2.wrong !== 5 || r2.unscored !== 5 || r2.named !== 0 || r2.list.length !== 5 || r2.list.some((y) => y.scored !== false)) fail(`those five names should still be listed for the trainee to rename, none of them charged: ${JSON.stringify(r2).slice(0, 500)}`);
  // no copy of theirs was ever filed in the CMS, so nobody knows their Case ID: the name to copy is empty, not a pattern with a hole
  if (r2.list.some((y) => y.want !== '')) fail(`with no Case ID known the name to copy should be empty: ${JSON.stringify(r2.list.map((y) => y.want))}`);
  // once one copy carries it, every name to copy is whole: the Type is the document's own CMS category
  await put2('RS05', 'intake', name2('Case-Files')); unstamp();
  o = await grade2(); r2 = o.drive.naming.report;
  const wantOf = (n) => (wrongOf(r2, n) || {}).want;
  if (wantOf('RS_12_Urgent_Care_Note.pdf') !== name2('Medical-Records') || wantOf('RS_25_Summit_Imaging_Invoice.pdf') !== name2('Invoices') || wantOf(drill2.name) !== name2('Invoices') || r2.list.some((y) => !y.want || /[<>]/.test(y.want)))
    fail(`each listed name should come with a whole name to copy, its Type the document's CMS category: ${JSON.stringify(r2.list.map((y) => [y.name, y.want]))}`);
  if (o.grades[2].score !== 100 || r2.named !== 1 || r2.unscored !== 5) fail(`Day 2 should still be 100% with those names listed: ${JSON.stringify(o.grades[2])}`);
  // labels the way the old grader accepted them (the old CI's own fixtures), on copies filed before
  await put2('RS26', 'bills', name2('Bills', '2026-07-02')); await put2('RS73', 'bills', name2('Bills', '2026-07-04')); await put2('RS33', 'insurance', name2('Others', '2026-07-03')); await put2('RS66', 'insurance', 'RS_66_Demand_Exhibit_Packet_DRAFT.pdf');
  unstamp();
  file2('RS26').name = name2('Bills', '2026-07-02').replace('.pdf', '_SUPERSEDED_2026-07-10.pdf');
  file2('RS33').name = `${CASE2}_Doe-John_Others_DRAFT_2026-07-03.pdf`;
  o = await grade2(); r2 = o.drive.naming.report;
  const sup = wrongOf(r2, file2('RS26').name), dr = wrongOf(r2, file2('RS33').name), ex = wrongOf(r2, 'RS_66_Demand_Exhibit_Packet_DRAFT.pdf');
  if (!sup || sup.scored !== false || sup.want !== name2('Bills', '2026-07-02').replace('.pdf', '_SUPERSEDED-2026-07-10.pdf')) fail(`a label the old way (_SUPERSEDED_<date>) on a copy filed before should be listed, not charged, with the date it already carries: ${JSON.stringify(sup)}`);
  if (!dr || dr.scored !== false || dr.want !== name2('Others', '2026-07-03').replace('.pdf', '_DRAFT.pdf')) fail(`_DRAFT in the old position on a copy filed before should be listed, not charged: ${JSON.stringify(dr)}`);
  if (!ex || ex.scored !== false || ex.want !== name2('Others').replace('.pdf', '_DRAFT.pdf')) fail(`the exhibit packet under its manifest name should be listed with its whole name, label included: ${JSON.stringify(ex)}`);
  if (o.grades[3].names.got !== 12 || o.grades[3].names.wrong !== 0 || o.grades[2].score !== 100) fail(`none of that should lower a day: ${JSON.stringify([o.grades[2].names, o.grades[3].names])}`);
  // what the same trainee files from now on is charged like anybody's
  await put2('RS72', 'medical', name2('Medical-Records', '2026-07-05'));
  if (rec2().saved.find((s) => s.docId === 'RS72').rule !== R.NAME_RULE) fail('a copy filed now should carry the stamp that its name is graded');
  file2('RS72').name = 'mri addendum.pdf';
  o = await grade2();
  const late = wrongOf(o.drive.naming.report, 'mri addendum.pdf');
  if (!late || late.scored !== true || o.grades[3].names.wrong !== 1 || o.grades[3].names.got >= 12 || !/^🏷/.test(o.grades[3].issues[0])) fail(`a copy filed since, renamed off the convention, should be charged: ${JSON.stringify([late, o.grades[3].names])}`);
  if (o.grades[2].score !== 100) fail('…and Day 2, already passed, should not move');
  ok('never marked down for a name the platform gave or a rule that came afterwards: listed with a whole name to copy, the row left whole; a copy filed since is charged');

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nEvery name on the Backup Drive is read against the firm\'s one naming convention: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
