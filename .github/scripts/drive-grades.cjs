// 🏅 The Backup Drive, auto-graded as the trainee goes (driveGrade in worker.js), against an in-memory Google Drive.
//
// A grade that can't be earned, or one that a trainee gets without doing the work, fails quietly: nobody sees it
// until a trainer asks why. So a trainee is played through Days 2–5 here, doing each day's job half right and then
// right, and each day's grade has to follow what is actually on the drive:
//   1. The grader's lists are the course's: each day's documents are CF_PACKETS["dN-drive"], each document's folder
//      is its folder in CM_CF_DOCS (js/cm-case-flow-docs.js).
//   2. Day 2: the four documents in 03/04; the colleague's misfiled invoice (the drill, laid once) moved to 04; a check.
//   3. Day 3: backed up equals filed; current versions in their folders, the replaced ones renamed SUPERSEDED with a
//      date; the draft demand and exhibits labeled DRAFT.
//   4. Day 4: 06 Liens deleted, found by a check, put back, a clean check after; the day's papers in 06 and 07.
//   5. Day 5: the litigation file in 09; the final audit, which a client folder moved under 04 Closed Files fails.
//   6. A trainer grades a trainee from their saved progress; a trainee can't; Disconnect keeps the grades.
// Usage: node .github/scripts/drive-grades.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

/* ---------- an in-memory Google Drive: only what worker.js asks of it ---------- */
const FOLDER = 'application/vnd.google-apps.folder';
const files = new Map(); let next = 0;
const make = (name, mimeType, parent) => { const id = 'g' + (++next); files.set(id, { name, mimeType, parents: parent ? [parent] : [], trashed: false }); return id; };
const trash = (id) => { const f = files.get(id); f.trashed = true; [...files].filter(([, x]) => x.parents[0] === id).forEach(([k]) => trash(k)); };
const byName = (name) => [...files].find(([, f]) => f.name === name && !f.trashed);
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT', refresh_token: 'RT', expires_in: 3600, scope: 'openid email https://www.googleapis.com/auth/drive.file', id_token: 'x.' + Buffer.from('{"email":"ana@example.com"}').toString('base64url') + '.x' });
  if (u.href === 'https://oauth2.googleapis.com/revoke') return reply({});
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  if (u.pathname === '/upload/drive/v3/files') {
    const text = Buffer.from(init.body).toString('latin1');
    const meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
    return reply({ id: make(meta.name, 'application/pdf', meta.parents[0]), webViewLink: 'https://drive/x' });
  }
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const q = u.searchParams.get('q') || '', folders = /mimeType = /.test(q);
    return reply({ files: [...files].filter(([, f]) => !f.trashed && (f.mimeType === FOLDER) === folders).map(([id, f]) => ({ id, name: f.name, parents: f.parents })) });
  }
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m) { const f = files.get(m[1]); return f ? reply({ id: m[1], trashed: f.trashed }) : reply({ error: { message: 'File not found' } }, 404); }
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};

(async () => {
  const W = fs.readFileSync(path.join(process.cwd(), 'worker.js'), 'utf8');
  const docs = fs.readFileSync(path.join(process.cwd(), 'js/cm-case-flow-docs.js'), 'utf8');

  /* 1: the grader's lists are the course's */
  const DAY_DOCS = new Function(W.slice(W.indexOf('const DRIVE_DAY_DOCS ='), W.indexOf('const DRIVE_DOC =')) + '; return DRIVE_DAY_DOCS;')();
  const DOC = new Function(W.slice(W.indexOf('const DRIVE_DOC ='), W.indexOf('const DRIVE_PASS')) + '; return DRIVE_DOC;')();
  for (const n of [2, 3, 4, 5]) {
    const m = docs.match(new RegExp(`"d${n}-drive":\\s*(\\[[^\\]]*\\])`));
    const packet = m ? JSON.parse(m[1]) : null;
    if (!packet || JSON.stringify(packet.slice().sort()) !== JSON.stringify(DAY_DOCS[n].slice().sort())) fail(`Day ${n}'s graded documents ${JSON.stringify(DAY_DOCS[n])} aren't the activity's documents ${JSON.stringify(packet)}`);
  }
  Object.entries(DOC).forEach(([id, [folder]]) => {
    const m = docs.match(new RegExp(`\\{[^{}]*id:\\s*"${id}"[^{}]*\\}`)), f = m && (m[0].match(/folder:\s*"([^"]+)"/) || [])[1];
    if (f !== folder) fail(`${id} is graded against the "${folder}" folder, but the course files it in "${f}"`);
  });
  ok("the grader's documents and folders are the course's");

  /* the Worker, a trainee with a built drive */
  const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
  const store = new Map();
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', GOOGLE_CLIENT_ID: 'cid', GOOGLE_CLIENT_SECRET: 'cs',
    LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
      list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) } };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const t = (await auth('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' })).token;
  const tid = (await auth('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' })).id;
  await call({ action: 'connect', code: 'c' }, t);
  const std = (await call({ action: 'status' }, t)).body.drive;
  const built = await call({ action: 'setup', layout: std.standard }, t);
  if (!built.body || !built.body.built) { console.log('Could not build the drive: ' + JSON.stringify(built.body)); process.exit(1); }
  const folderId = (p) => { const rec = JSON.parse(store.get('drive:' + tid)); return rec.folders[p]; };
  const C = '01 Clients/Doe-John';
  const filed = [];
  const put = async (docId, kind, name) => { const r = await call({ action: 'put', docFolder: kind, name: name || `DOE-01_Doe-John_${docId}_2026-07-01.pdf`, b64: Buffer.from('%PDF-1.4 ' + docId).toString('base64url'), docId }, t); if (r.status !== 200) fail(`filing ${docId} failed: ${JSON.stringify(r.body)}`); filed.push(docId); return r.body; };
  const grade = async () => (await call({ action: 'grade', filed }, t)).body;
  const check = () => call({ action: 'check' }, t);
  const moveTo = (fileName, folderPath) => { const f = byName(fileName); f[1].parents = [folderId(folderPath)]; };
  const rename = (fileName, to) => { byName(fileName)[1].name = to; };
  const row = (g, label) => (g.rows || []).find((r) => r.label === label) || {};

  // nothing started: nothing graded
  let g = await grade();
  if (Object.keys(g.grades || {}).length) fail(`a day nobody has started was graded: ${JSON.stringify(g.grades)}`);

  /* 2: Day 2 */
  for (const [d, k] of [['RS12', 'medical'], ['RS13', 'medical'], ['RS15', 'medical'], ['RS25', 'bills']]) await put(d, k);
  const d1 = await call({ action: 'drill', day: 2 }, t), d2 = await call({ action: 'drill', day: 2 }, t);
  const drills = [...files.values()].filter((f) => /colleague/.test(f.name));
  if (d1.status !== 200 || d2.status !== 200 || drills.length !== 1) fail(`the Day 2 drill should lay one misfiled invoice, once: ${drills.length} laid`);
  if (drills[0] && drills[0].parents[0] !== folderId(`${C}/03 Medical Records`)) fail('the misfiled invoice should be in 03 Medical Records');
  moveTo('DOE-01_Doe-John_RS13_2026-07-01.pdf', `${C}/04 Bills & Invoices`);
  g = (await grade()).grades[2];
  if (!g || g.score >= 70 || row(g, 'Misfile corrected').got !== 0 || row(g, 'Drive confirmed').got !== 0 || row(g, 'Documents backed up').got >= 25) fail(`Day 2 with a record in the bills folder, the misfile left and no check should be low: ${JSON.stringify(g)}`);
  if (!JSON.stringify(g.rows).includes('belongs in 03 Medical Records')) fail('Day 2 should say where the misplaced evaluation belongs');
  moveTo('DOE-01_Doe-John_RS13_2026-07-01.pdf', `${C}/03 Medical Records`);
  moveTo(drills[0].name, `${C}/04 Bills & Invoices`);
  await check();
  g = (await grade()).grades[2];
  if (!g || g.score !== 100 || !g.passed) fail(`Day 2 done right should be 100%: ${JSON.stringify(g)}`);
  ok('Day 2: the documents in 03 and 04, the colleague\'s misfile moved (laid once), a clean check');

  /* 3: Day 3 */
  await put('RS72', 'medical'); await put('RS73', 'bills'); await put('RS95', 'settlement');
  await put('RS26', 'bills', 'DOE-01_Doe-John_Statement_SUPERSEDED_2026-07-10.pdf');
  await put('RS94', 'settlement', 'DOE-01_Doe-John_WageWorksheet_2026-06-23.pdf');
  await put('RS33', 'insurance', 'DOE-01_Doe-John_Demand_DRAFT_2026-07-20.pdf');
  await put('RS66', 'insurance', 'DOE-01_Doe-John_Exhibits_2026-07-20.pdf');
  filed.push('RS16');   // filed in the CMS, never reached the drive
  await check();
  g = (await grade()).grades[3];
  const n3 = JSON.stringify(g && g.rows);
  if (!g || g.score >= 100 || row(g, 'Backup matches the CMS').got >= 25 || row(g, 'Superseded versions').got >= 20 || row(g, 'Demand Package placed').got >= 15
    || !/not on the drive/.test(n3) || !/SUPERSEDED/.test(n3) || !/label it DRAFT/.test(n3)) fail(`Day 3 with a document not backed up, an unlabeled superseded worksheet and an unlabeled draft should lose points on each row and say why: ${n3}`);
  await put('RS16', 'medical'); filed.pop();
  rename('DOE-01_Doe-John_WageWorksheet_2026-06-23.pdf', 'DOE-01_Doe-John_WageWorksheet_SUPERSEDED_2026-07-01.pdf');
  rename('DOE-01_Doe-John_Exhibits_2026-07-20.pdf', 'DOE-01_Doe-John_Exhibits_DRAFT_2026-07-20.pdf');
  await check();
  g = (await grade()).grades[3];
  if (!g || g.score !== 100) fail(`Day 3 done right should be 100%, renamed in Drive and all: ${JSON.stringify(g)}`);
  ok('Day 3: backed up equals filed, superseded versions renamed with their date, drafts labeled — read from the names in Drive');

  /* 4: Day 4 */
  trash(folderId(`${C}/06 Liens & Reimbursement`));
  await check();
  g = (await grade()).grades[4];
  if (!g || row(g, 'Missing folder found').got !== 15 || row(g, 'Folder restored').got !== 0) fail(`Day 4 after the deletion and a check: found, not restored yet: ${JSON.stringify(g)}`);
  await call({ action: 'rebuild' }, t);
  await check();
  for (const [d, k] of [['RS41', 'liens'], ['RS42', 'liens'], ['RS84', 'liens'], ['RS85', 'liens'], ['RS86', 'liens'], ['RS44', 'settlement'], ['RS74', 'settlement']]) await put(d, k);
  g = (await grade()).grades[4];
  if (!g || g.score !== 100) fail(`Day 4 done right should be 100%: ${JSON.stringify(g)}`);
  ok('Day 4: 06 Liens deleted, found by a check, put back and checked clean; the lien papers and the ledger in place');

  /* 5: Day 5 */
  for (const d of ['RS51', 'RS52', 'RS53', 'RS55', 'RS59', 'RS69', 'RS70']) await put(d, 'litigation');
  await check();
  g = (await grade()).grades[5];
  if (!g || g.score !== 100) fail(`Day 5 done right should be 100%: ${JSON.stringify(g)}`);
  byName('Doe-John')[1].parents = [folderId('04 Closed Files')];
  g = (await grade()).grades[5];
  if (!g || row(g, 'Final audit').got > 22 || !/leave the client folder where it is/.test(JSON.stringify(g.rows))) fail(`Day 5 with the client folder moved under 04 Closed Files should lose the final audit: ${JSON.stringify(g)}`);
  byName('Doe-John')[1].parents = [folderId('01 Clients')];
  ok('Day 5: the litigation file in 09, and the final audit, which a client folder moved to Closed Files fails');

  /* 6: a trainer, a trainee, Disconnect */
  store.set('cm:progress:' + tid, JSON.stringify({ traineeId: tid, data: { 'doc-filing': Object.fromEntries(filed.map((d) => [d, { filed: true }])) } }));
  const admin = (await auth('/api/auth/admin', { passphrase: 'ci-pass' })).token;
  const gf = await call({ action: 'gradeFor', traineeId: tid }, admin);
  if (gf.status !== 200 || !gf.body.report || !gf.body.report.grades || gf.body.report.grades[5].score !== 100) fail(`a trainer should grade a trainee from their progress: ${JSON.stringify(gf.body).slice(0, 300)}`);
  if ((await call({ action: 'gradeFor', traineeId: tid }, t)).status !== 403) fail("a trainee could grade through the trainer's action");
  if (/"RT"|"AT"/.test(JSON.stringify(gf.body))) fail('the report carries a token');
  await call({ action: 'disconnect' }, t);
  const after = (await call({ action: 'report', traineeId: tid }, admin)).body.report;
  if (!after || !after.grades || !after.grades[2]) fail('Disconnect dropped the trainee\'s grades');
  ok("a trainer grades from the trainee's saved progress; a trainee can't; Disconnect keeps the grades");

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nThe Backup Drive is graded from the Drive itself, day by day: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
