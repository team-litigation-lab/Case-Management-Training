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
//   4. What drive.file hides stays out of the report, and the page is told to say so.
//   5. It counts: File names is a row of every graded day, 12 of the 60 points, the same in the lesson's rubric.
//   6. It is the Worker's: a trainee can't send their own result, a trainer reads it in the report and the audit list,
//      a presenter gets the rule without anybody's drive, and Disconnect keeps it.
// Usage: node .github/scripts/drive-naming.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const ROOT = process.cwd();
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');

/* ---------- an in-memory Google Drive: only what worker.js asks of it ----------
   `mine: false` is a file the trainee put there by hand: under drive.file Google doesn't show it to this platform. */
const FOLDER = 'application/vnd.google-apps.folder';
const files = new Map(); let next = 0; const asked = [];
const make = (name, mimeType, parent, mine = true) => { const id = 'g' + (++next); files.set(id, { name, mimeType, parents: parent ? [parent] : [], trashed: false, mine, createdTime: '2026-07-01T15:00:00.000Z' }); return id; };
const byName = (name) => [...files].find(([, f]) => f.name === name && !f.trashed);
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT', refresh_token: 'RT', expires_in: 3600, scope: 'openid email https://www.googleapis.com/auth/drive.file', id_token: 'x.' + Buffer.from('{"email":"ana@example.com"}').toString('base64url') + '.x' });
  if (u.href === 'https://oauth2.googleapis.com/revoke') return reply({});
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  asked.push(method + ' ' + u.pathname + (u.searchParams.get('q') ? '?q' : ''));
  if (u.pathname === '/upload/drive/v3/files') {
    const text = Buffer.from(init.body).toString('latin1');
    const meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
    return reply({ id: make(meta.name, 'application/pdf', meta.parents[0]), webViewLink: 'https://drive/x' });
  }
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const q = u.searchParams.get('q') || '', folders = /mimeType = /.test(q);
    return reply({ files: [...files].filter(([, f]) => !f.trashed && f.mine && (f.mimeType === FOLDER) === folders).map(([id, f]) => ({ id, name: f.name, parents: f.parents, createdTime: f.createdTime })) });
  }
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m) { const f = files.get(m[1]); return f ? reply({ id: m[1], trashed: f.trashed }) : reply({ error: { message: 'File not found' } }, 404); }
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};

(async () => {
  const W = read('worker.js'), filing = read('js/cm-doc-filing.js'), drivePage = read('js/cm-drive.js'), flow = read('js/cm-case-flow.js'), docs = read('js/cm-case-flow-docs.js');

  /* ---------- 1: one rule ---------- */
  const block = W.slice(W.indexOf('const DRIVE_ROOT ='), W.indexOf('/* ---------- 🕘 automatic Time In'));
  const R = {};
  try {
    new Function('out', 'const enc = new TextEncoder(); const adminPass = () => "x";\n' + block +
      '\nObject.assign(out, { FILE_NAME_PATTERN, FILE_CATEGORIES, FILE_TYPES, NAME_CLIENT, CLIENT_FOLDER, NAME_PARTS, NAME_LABELS, LABEL_DOCS, SUPERSEDED_BY, DRILL_TYPE, NAMING_POINTS, NAMING_OF, DRIVE_DOC, nameCheck, nameHint, nameAsFiled, namingRule, fileType });')(R);
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
    // the CMS's word stands: a Type or a client the Worker would not have guessed, on a name the CMS filed
    ['LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf' }],
    ['LSH-2026-MVA-000041_Doe-Jon_Bills_2026-11-12.docx', { filed: 'LSH-2026-MVA-000041_Doe-Jon_Bills_2026-11-12.docx' }],
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
    ['LSH-2026-MVA-000041_Doe-John_Release-Review_2026-11-12.pdf', { caseId: CASE }, 3, 'LSH-2026-MVA-000041_Doe-John_<Type>_2026-11-12.pdf', /CMS category/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_11-12-2026.pdf', { caseId: CASE, date: '2026-11-12' }, 4, F, /part 4.*year first/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-02-31.pdf', { caseId: CASE, date: '2026-11-12' }, 4, F, /part 4/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-13.pdf', { filed: F }, 4, F, /filed on 2026-11-12/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12.PDF', { filed: F }, 99, F, /extension.*lower case/],
    ['LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-12', { filed: F }, 99, F, /lost its extension/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf' }, 0, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf', /a copy keeps that name/],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2.pdf', label: 'DRAFT' }, 6, 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_2_DRAFT.pdf', /add _DRAFT/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_2.pdf', { caseId: CASE }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', /"2" shouldn't be there/],
    ['LSH-2026-MVA-000041 Doe-John Medical-Records 2026-11-12.pdf', { filed: F }, 0, F, /1 piece between underscores/],
    ['Copy of ' + F, { filed: F }, 1, F, /part 1/],
    ['RS_12_Urgent_Care_Note.pdf', { caseId: CASE, date: '2026-11-12', type: 'Medical-Records' }, 1, F, /5 of its parts differ/],
    ['Summit-Imaging_Invoice_filed-here-by-a-colleague.pdf', { caseId: CASE, date: '2026-11-12', type: 'Invoices' }, 0, 'LSH-2026-MVA-000041_Doe-John_Invoices_2026-11-12.pdf', /3 pieces between underscores/],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', label: 'DRAFT' }, 5, 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_DRAFT.pdf', /add _DRAFT after the date/],
    ['LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_draft.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12.pdf', label: 'DRAFT' }, 5, 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-12_DRAFT.pdf', /part 5.*"draft" should be "DRAFT"/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-<YYYY-MM-DD>.pdf', /date of the version that replaced it/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-07-10-2026.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-<YYYY-MM-DD>.pdf', /part 5/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_DRAFT.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', label: 'SUPERSEDED' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_SUPERSEDED-<YYYY-MM-DD>.pdf', /part 5/],
    ['LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12_FINAL.pdf', { filed: 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf' }, 5, 'LSH-2026-MVA-000041_Doe-John_Bills_2026-11-12.pdf', /"FINAL" shouldn't be there/],
  ];
  bad.forEach(([n, c, part, want, says]) => {
    const r = chk(n, c), h = R.nameHint(r);
    if (r.ok) return fail(`"${n}" should not pass`);
    if (r.issues[0].n !== part) fail(`"${n}": the part pointed at should be ${part}, not ${r.issues[0].n} (${h})`);
    if (r.want !== want) fail(`"${n}" should be "${want}", not "${r.want}"`);
    if (!says.test(h)) fail(`"${n}": the hint should say ${says}: "${h}"`);
  });
  ok(`the check, name by name: ${good.length} names that pass, ${bad.length} that don't, each with the name it should have and the part pointed at`);

  /* ---------- the Worker, a trainee with a built drive ---------- */
  const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
  const store = new Map();
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', GOOGLE_CLIENT_ID: 'cid', GOOGLE_CLIENT_SECRET: 'cs',
    LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
      list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) } };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const { token: t, id: tid } = await auth('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' });
  const admin = (await auth('/api/auth/admin', { passphrase: 'ci-pass' })).token;
  await call({ action: 'connect', code: 'c' }, t);
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
  // the names are read before any later day starts, in the grade's own two list calls
  asked.length = 0;
  let rep = await naming();
  if (asked.length !== 2 || !asked.every((a) => a === 'GET /drive/v3/files?q')) fail(`reading the names should cost the grade's two list calls and nothing more: ${JSON.stringify(asked)}`);
  if (!rep || rep.checked !== 3 || rep.named !== 3 || rep.wrong !== 0 || (rep.list || []).length) fail(`three documents the CMS named should all pass, read on Day 1: ${JSON.stringify(rep)}`);
  if ((await grade()).drive.naming.caseId !== CASE) fail('the trainee\'s Case ID should be read from their filed copies');
  asked.length = 0; await call({ action: 'check' }, t);
  if (asked.length !== 17) fail(`✓ Check my drive should still cost 17 folder reads: ${asked.length}`);
  ok('names the CMS filed pass, read on Day 1 in the two list calls the grade already makes; names that repeat keep a record each');

  // a hand rename in Drive
  fileOf('RS06').name = `${CASE}_John-Doe_Police-Report_${DAY}.pdf`;
  rep = await naming();
  let x = wrongOf(rep, `${CASE}_John-Doe_Police-Report_${DAY}.pdf`);
  if (rep.wrong !== 1 || !x || x.folder !== '02 Police, Witness & Video' || x.want !== nameOf('Police-Report') || x.n !== 2 || x.got !== 'John-Doe' || x.should !== 'Doe-John' || !/part 2/.test(x.hint)) fail(`a name turned round by hand should come back with its folder, the name it should have and part 2 pointed at: ${JSON.stringify(rep)}`);
  // moved out of its folder as well: still read, with where it is now
  fileOf('RS06').parents = [folderId('03 Templates')];
  x = wrongOf(await naming(), `${CASE}_John-Doe_Police-Report_${DAY}.pdf`);
  if (!x || x.folder !== '03 Templates') fail(`a renamed copy moved to another folder should be reported where it is now: ${JSON.stringify(x)}`);
  fileOf('RS06').parents = [folderId(`${C}/02 Police, Witness & Video`)]; fileOf('RS06').name = nameOf('Police-Report');
  // a copy that never went through the CMS (an old ☁️ Add to GDrive name)
  await put('RS09', 'insurance', 'RS_09_GEICO_Declarations_Page.pdf');
  rep = await naming(); x = wrongOf(rep, 'RS_09_GEICO_Declarations_Page.pdf');
  if (rep.wrong !== 1 || !x || !x.want.startsWith(`${CASE}_Doe-John_`) || !x.want.endsWith(`_${DAY}.pdf`) || x.folder !== '05 Insurance, Demands & Negotiation') fail(`a copy under its manifest name should be reported with the firm's name for it: ${JSON.stringify(x)}`);
  fileOf('RS09').name = nameOf('Others');
  // a folder retyped in Drive
  files.get(folderId(`${C}/03 Medical Records`)).name = '03 Medical records';
  rep = await naming(); x = (rep.list || []).find((y) => y.kind === 'folder');
  if (rep.wrong !== 1 || !x || x.name !== '03 Medical records' || x.want !== '03 Medical Records' || x.folder !== 'Doe-John') fail(`a folder retyped in Drive should be reported against the standard's name: ${JSON.stringify(rep)}`);
  files.get(folderId(`${C}/03 Medical Records`)).name = '03 Medical Records';
  if ((await naming()).wrong !== 0) fail('with every name put right the report should be clean again');
  ok('a hand rename, a moved copy, a copy the CMS never named and a retyped folder are each reported with folder, name, the name it should have and the differing part');

  /* ---------- 4: what drive.file hides, and what isn't this drive's ---------- */
  make('scan0001.pdf', 'application/pdf', folderId(`${C}/03 Medical Records`), false);    // uploaded by hand: Google doesn't show it
  make('Notes from another LSH site.pdf', 'application/pdf', make('Some other app folder', FOLDER, ''));   // visible, but not in this drive
  rep = await naming();
  if (rep.wrong !== 0 || rep.checked !== 4) fail(`a file uploaded by hand (invisible under drive.file) and a file outside the firm's folders should stay out of the report: ${JSON.stringify(rep)}`);
  const rule = (await call({ action: 'status' }, t)).body.drive.naming;
  if (!/by hand/.test(rule.blind || '') || !/drive\.file/.test(rule.blind || '') || !/wherever you have moved or renamed/.test(rule.sees || '')) fail(`the page should be told what the check reads and what it can't see: ${JSON.stringify([rule.sees, rule.blind])}`);
  if (!/\.sees/.test(drivePage) || !/\.blind/.test(drivePage)) fail('js/cm-drive.js should show what the check reads and what it can\'t see');
  ok("a file uploaded by hand stays invisible (drive.file) and the page is told to say so; another app's files aren't this drive's");

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
  if (!x || x.want !== nameOf('Others', '2026-07-03').replace('.pdf', '_DRAFT.pdf') || x.n !== 5) fail(`the draft demand should be asked for its DRAFT label, as the last part: ${JSON.stringify(x)}`);
  await put('RS73', 'bills', nameOf('Bills', '2026-07-04'));
  x = wrongOf(await naming(), nameOf('Bills', '2026-07-02'));
  if (!x || !/_SUPERSEDED-<YYYY-MM-DD>\.pdf$/.test(x.want)) fail(`once the corrected statement is on the drive, the one it replaced should be asked for SUPERSEDED and a date: ${JSON.stringify(x)}`);
  fileOf('RS26').name = nameOf('Bills', '2026-07-02').replace('.pdf', '_SUPERSEDED.pdf');
  if (!wrongOf(await naming(), fileOf('RS26').name)) fail('SUPERSEDED with no replacing date should not pass (the name\'s own filing date is not it)');
  fileOf('RS26').name = nameOf('Bills', '2026-07-02').replace('.pdf', '_SUPERSEDED-2026-07-10.pdf');
  fileOf('RS33').name = nameOf('Others', '2026-07-03').replace('.pdf', '_DRAFT.pdf');
  rep = await naming();
  if (rep.wrong !== 0) fail(`with the labels as the last part every name should pass: ${JSON.stringify(rep.list)}`);
  const grades = (await grade()).grades;
  [2, 3].forEach((n) => { const r = row(grades[n] || {}, 'File names'); if (r.max !== 12 || r.got !== 12) fail(`Day ${n}'s File names row should be 12 of 12 with every name right: ${JSON.stringify(r)}`); });
  if (rule.points !== 12 || rule.of !== 60 || R.NAMING_POINTS !== 12 || R.NAMING_OF !== 60) fail(`the page should be told the weight (12 of 60): ${rule.points} of ${rule.of}`);
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
    ai.forEach(([label, pts]) => { if (wrows[label] !== undefined && wrows[label] !== pts) fail(`Day ${n}: "${label}" is ${pts} points in the lesson and ${wrows[label]} in the Worker`); });
  }
  ok('it counts: File names is 12 of the 60 points on every graded day, in the Worker and in the lesson\'s rubric; the colleague\'s invoice and the labels are part of it');

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
  if (!all || !all.naming || all.naming.wrong !== 1) fail('the audit list (reportAll, no Google request) should carry the wrong names');
  if (/"RT"|"AT"/.test(JSON.stringify(gf.body) + JSON.stringify(all))) fail('the report carries a token');
  if (!/rep\.naming/.test(read('js/cm-audit-table.js')) || !/renderDriveNaming\(rep\)/.test(read('index.html'))) fail('the Trainee Audit and the trainer\'s Backup Drive report should show the wrong names');
  const pres = (await call({ action: 'standard' }, admin)).body.standard;
  if (!pres.naming || pres.naming.pattern !== PATTERN || pres.naming.caseId !== '' || pres.naming.report !== undefined) fail(`a presenter should get the rule and nobody's drive: ${JSON.stringify(pres.naming).slice(0, 200)}`);
  await call({ action: 'disconnect' }, t);
  const after = (await call({ action: 'report', traineeId: tid }, admin)).body.report;
  if (!after || !after.naming || after.naming.wrong !== 1) fail('Disconnect dropped the last check of the names');
  ok("the result is the Worker's: a trainee can't send one, a trainer reads each wrong name, a presenter gets the rule only, Disconnect keeps it");

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nEvery name on the Backup Drive is read against the firm\'s one naming convention: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
