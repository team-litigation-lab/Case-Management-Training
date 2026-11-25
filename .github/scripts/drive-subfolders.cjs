// @check node — Both Backup Drive graders read every folder and file under the linked folder at any depth, and a drive larger than one run is read on over the next runs and said (in-memory Drive, stubbed AI)
// 📂 The Backup Drive is the firm's backup file, so the graders read all of it (worker-drive-walk.js). The ways this
// goes wrong are quiet: a folder past some count dropped without a word, a memo in a subfolder the trainee made never
// seen, a case document filed one folder deeper marked "outside the structure", a drive cut short graded as whole.
//   1. A written document in a trainee's own subfolders of a firm folder (05 Insurance…/Day 3/Drafts) is found, matched
//      and graded, in that firm folder; one nested in the wrong firm folder is graded and told where it belongs; one
//      under no firm folder is listed as outside the firm's structure.
//   2. A case document two levels down a firm folder counts for filing in that folder (its name is read too); one two
//      levels down the wrong folder is still misplaced; a course document uploaded by hand deep in a folder is filed
//      there.
//   3. A drive of more than 80 folders is read to the end (the structure grader used to stop at 80), the folders
//      several to a query.
//   4. A drive larger than one run's request budget: the grades stay as they were, the trainer is told how many
//      folders weren't read and that the reading continues, the next run carries on from there (not from the start),
//      no graded work is dropped as gone meanwhile, and once the whole drive is read it is graded and said complete.
//      The same for "Grade now" (a trainer's) and the nightly run.
// Usage: node .github/scripts/drive-subfolders.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const SA = require('./drive-sa-fake.cjs');
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);
const ROOT = process.cwd();

/* ---------- an in-memory Google Drive (several parents to a query, as Drive answers them) ---------- */
const FOLDER = SA.FOLDER, DOC = 'application/vnd.google-apps.document';
const files = new Map(); let next = 0, clock = Date.parse('2026-11-01T00:00:00Z');
const tick = () => new Date(clock += 60000).toISOString();
const make = (name, mimeType, parent, extra) => { const id = 'gs' + String(++next).padStart(4, '0') + 'Qx'; files.set(id, Object.assign({ name, mimeType, parents: parent ? [parent] : [], trashed: false, modifiedTime: tick(), owners: [{ emailAddress: 'ana@example.com' }] }, extra || {})); return id; };
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const lists = [];   // the parents of every list query, in order
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT', expires_in: 3600 });
  if (u.host === 'generativelanguage.googleapis.com') return aiAnswer(JSON.parse(init.body));
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  if (u.pathname === '/upload/drive/v3/files') {
    const text = Buffer.from(init.body).toString('latin1'), meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
    return reply({ id: make(meta.name, 'application/pdf', meta.parents[0], { description: meta.description || '', owners: [{ emailAddress: SA.saEnv().GDRIVE_SA_EMAIL }], body: '%PDF-1.4' }), webViewLink: 'https://drive/x' });
  }
  if (/\/permissions$/.test(u.pathname)) return reply({ id: 'p' });
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const q = u.searchParams.get('q') || '', match = SA.qMatch(q);
    lists.push([...q.matchAll(/'([^']+)' in parents/g)].map((m) => m[1]));
    const all = [...files].filter(([, f]) => match(f)), at = Number(u.searchParams.get('pageToken') || 0), size = Math.min(Number(u.searchParams.get('pageSize')) || 100, 100);   // pages of 100: the walk must page
    return reply({ files: all.slice(at, at + size).map(([id, f]) => ({ id, name: f.name, mimeType: f.mimeType, parents: f.parents, modifiedTime: f.modifiedTime, createdTime: f.modifiedTime, description: f.description, owners: f.owners })),
      nextPageToken: at + size < all.length ? String(at + size) : undefined });
  }
  const ex = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)\/export$/);
  if (ex) { const f = files.get(ex[1]); return f ? new Response(f.body || '', { headers: { 'Content-Type': 'text/plain' } }) : reply({ error: { message: 'not found' } }, 404); }
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m && u.searchParams.get('alt') === 'media') { const f = files.get(m[1]); return f ? new Response(f.body || '') : reply({ error: { message: 'not found' } }, 404); }
  if (m) { const f = files.get(m[1]); return f ? reply(SA.fileMeta(m[1], f)) : reply({ error: { message: 'File not found' } }, 404); }
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};
/* the stubbed AI: full marks less 5 on the first dimension, in the rubric it was sent */
let aiCalls = 0;
function aiAnswer(body) {
  aiCalls++;
  const user = body.contents.map((c) => c.parts.map((p) => p.text).join('')).join('\n');
  const dims = [...user.matchAll(/^- (.+?) \((\d+) points\):/gm)].map((x) => ({ name: x[1], max: Number(x[2]) }));
  const pts = dims.map((d, i) => ({ name: d.name, points: i === 0 ? Math.max(0, d.max - 5) : d.max }));
  const got = pts.reduce((t, p) => t + p.points, 0), total = dims.reduce((t, d) => t + d.max, 0);
  const out = JSON.stringify({ score: Math.round(100 * got / total), dimensions: pts, strengths: ['Sourced.'], fix: [{ shows: 'No reply date.', standard: 'A dated next step.', why: 'Nobody chases it.', next: 'Add the date.' }] });
  return reply({ candidates: [{ content: { parts: [{ text: out }] }, finishReason: 'STOP' }] });
}
const words = (n) => Array.from({ length: n }, (_, i) => `Line ${i} of the work carries its source document and a dated next step for Atty. Thorne.`).join('\n');

(async () => {
  const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
  const store = new Map();
  const kv = { get: async (k) => (store.has(k) ? store.get(k) : null), put: async (k, v) => { store.set(k, v); }, delete: async (k) => { store.delete(k); },
    list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).sort().map((name) => ({ name })), list_complete: true }) };
  const ASSETS = { fetch: async (req) => { const p = path.join(ROOT, decodeURIComponent(new URL(req.url).pathname)); return fs.existsSync(p) ? new Response(fs.readFileSync(p)) : new Response('Not found', { status: 404 }); } };
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', GEMINI_API_KEY: 'AIza-test-key', LSH_KV: kv, ASSETS, ...SA.saEnv() };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); const text = await res.text(); let j = null; try { j = JSON.parse(text); } catch (e) {} return { status: res.status, body: j, text }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const admin = (await auth('/api/auth/admin', { passphrase: 'ci-pass' })).token;
  const a = await auth('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' }), t = a.token, tid = a.id;
  store.set('cm:trainee:' + tid, JSON.stringify({ id: tid, name: 'Ana Cruz', batch: 'B100926', approved: true }));
  const root = make('LSH Case Backups', FOLDER, '');
  await call({ action: 'link', url: SA.folderUrl(root) }, t);
  const std = (await call({ action: 'status' }, t)).body.drive.standard;
  const built = await call({ action: 'setup', layout: std }, t);
  if (!built.body || !built.body.built) { console.log('Could not build the drive: ' + built.text.slice(0, 300)); process.exit(1); }
  const rec = () => JSON.parse(store.get('cm:drive:' + tid));
  const fid = (p) => rec().folders[p];
  const C = '01 Clients/Doe-John', INS = `${C}/05 Insurance, Demands & Negotiation`, MED = `${C}/03 Medical Records`, BILLS = `${C}/04 Bills & Invoices`, LIENS = `${C}/06 Liens & Reimbursement`, LIT = `${C}/09 Litigation & ADR`;
  const sub = (parent, ...names) => names.reduce((p, n) => make(n, FOLDER, p), parent);   // a chain of the trainee's own folders
  const filed = [];
  const put = async (docId, kind) => { const name = `LSH-2026-MVA-000041_Doe-John_${docId}_2026-07-01.pdf`; const r = await call({ action: 'put', docFolder: kind, name, b64: Buffer.from('%PDF-1.4 ' + docId).toString('base64url'), docId }, t); if (r.status !== 200) fail(`filing ${docId} failed: ${r.text.slice(0, 200)}`); filed.push(docId); return [...files].find(([, f]) => f.name === name && !f.trashed)[0]; };
  const grade = async () => (await call({ action: 'grade', filed }, t)).body;
  const gradeNow = async () => (await call({ action: 'workGradeFor', traineeId: tid }, admin)).body;
  const workFor = async () => (await call({ action: 'workFor', traineeId: tid }, admin)).body;
  const report = async () => (await call({ action: 'report', traineeId: tid }, admin)).body.report;
  const item = (v, id) => ((v && v.work && v.work.items) || []).find((x) => x.id === id);
  const row = (g, label) => ((g && g.rows) || []).find((r) => r.label === label) || {};
  const nightly = async () => { await worker.scheduled({ cron: '0 7 * * *' }, env, { waitUntil: (p) => p }); return JSON.parse(store.get('cm:drivework-run')); };

  /* 1: written work in the trainee's own subfolders */
  const REL = 'Settlement Release Clause Review & Attorney Approval', DEM = 'Serving the $10,000 BI Time-Limit Demand Package';
  make('LSH-2026-MVA-000041_Doe-John_Others_2026-11-01', DOC, sub(fid(INS), 'Day 3', 'Drafts'), { body: `Day 3 · ${REL}\nMemorandum to Atty. Thorne\n` + words(30) });
  make('my demand', DOC, sub(fid(MED), 'Old', 'Keep'), { body: `Day 3 · ${DEM}\n` + words(5) });
  make('reduction memo', DOC, sub(fid(LIENS), 'Peach State'), { body: 'Peach State reduction request, for Atty. Thorne\nThe statutory lien is reduced by the procurement share; the Lien Tracker updated.\n' + words(3) });
  make('scratch notes', DOC, sub(root, 'Scratch', 'Week 1'), { body: 'Peach State reduction request, the statutory lien.\n' + words(3) });
  let v = await gradeNow();
  if (!v || !v.ran) { console.log('Grade now failed: ' + JSON.stringify(v).slice(0, 300)); process.exit(1); }
  v = await workFor();
  const r = item(v, 'd3m2-rel'), dem = item(v, 'd3m1-a1'), red = item(v, 'd3m3-a1');
  if (!r || r.by !== 'title' || r.auto == null || r.wrongFolder || r.home !== '05 Insurance, Demands & Negotiation') fail(`the memo in 05 Insurance…/Day 3/Drafts is found, matched by its title and graded, in its firm folder: ${JSON.stringify(r)}`);
  if (r && !/Day 3\/Drafts/.test(r.folder)) fail(`the trainer is shown the subfolders it is in: ${r.folder}`);
  if (!dem || !dem.wrongFolder || dem.home !== '05 Insurance, Demands & Negotiation' || !/^03 Medical Records/.test(dem.folder)) fail(`a demand in 03 Medical Records/Old/Keep is graded and told it belongs in 05: ${JSON.stringify(dem)}`);
  if (!red || red.by !== 'keys' || red.wrongFolder) fail(`a memo in 06 Liens…/Peach State matches by its key terms, in 06 Liens: ${JSON.stringify(red)}`);
  const scratch = ((v && v.work && v.work.unmatched) || []).find((x) => x.name === 'scratch notes');
  if (!scratch || !/outside the firm's folders/.test(scratch.folder + ' ' + scratch.why)) fail(`a file under no firm folder is listed as outside the firm's structure: ${JSON.stringify(v && v.work && v.work.unmatched)}`);
  ok('a written document in the trainee\'s own subfolders is found, matched and graded in the firm folder above it; nested in the wrong one it is told where it belongs; under none it is outside the structure');

  /* 2: a case document two levels deep counts for filing */
  // (the trainee has reached Day 2: its documents open on Day 1, so they never start Day 2 by themselves)
  store.set('cm:progress:' + tid, JSON.stringify({ data: { 'day-progress': { 12: { done: false } } } }));
  const rs12 = await put('RS12', 'medical'); await put('RS13', 'medical'); await put('RS15', 'medical'); const rs25 = await put('RS25', 'bills');
  files.get(rs12).parents = [sub(fid(MED), 'Riverton Urgent Care', '2026')];   // two levels down its own folder
  files.get(rs25).parents = [sub(fid(MED), 'Misc', 'Old')];                    // two levels down the wrong one
  const hand = make('RS41 Peach State reduction acceptance.pdf', 'application/pdf', sub(fid(LIENS), 'Box', 'Inner'), { body: '%PDF-1.4' });   // filed by hand, deep
  let g = await grade();
  const d2 = g && g.grades && g.grades[2], back = row(d2, 'Documents backed up');
  if (!d2 || (back.notes || []).some((x) => /Riverton Urgent Care/.test(x))) fail(`RS12 two levels down 03 Medical Records counts as filed there: ${JSON.stringify(back)}`);
  if (!(back.notes || []).some((x) => /Summit Imaging's invoice is in 03 Medical Records; it belongs in 04 Bills & Invoices/.test(x))) fail(`RS25 two levels down 03 Medical Records is still misplaced, and says where it belongs: ${JSON.stringify(back.notes)}`);
  const N = g && g.drive && g.drive.naming && g.drive.naming.report;
  if (!N || N.checked < 4) fail(`the names of the documents filed deeper are read too: ${JSON.stringify(N && { checked: N.checked })}`);
  const hf = (rec().handFiled || []).find((h) => h.id === hand);
  if (!hf || hf.path !== LIENS || hf.home !== LIENS) fail(`a course document uploaded by hand into 06 Liens…/Box/Inner is filed in 06 Liens: ${JSON.stringify(hf)}`);
  if (!rec().walk || !rec().walk.complete) fail(`a drive read to the end says so: ${JSON.stringify(rec().walk)}`);
  ok('a case document two levels down its folder counts for filing (its name read too); two levels down the wrong folder it is still misplaced; one uploaded by hand deep in 06 Liens is filed there');

  /* 3: more than 80 folders, read to the end */
  const archive = sub(fid(LIT), 'Archive');
  const boxes = Array.from({ length: 120 }, (_, i) => make(`Box ${String(i + 1).padStart(3, '0')}`, FOLDER, archive));
  make('binder notes', DOC, boxes[116], { body: 'Day 4 · Assembling the 6-Tab Arbitration Binder\nTabs C-1 to C-6, Bates ranged, with the authentication log.\n' + words(3) });
  const deepHand = make('RS51 Complaint.pdf', 'application/pdf', boxes[118], { body: '%PDF-1.4' });
  lists.length = 0;
  v = await gradeNow();
  const folderCount = Object.values(rec().walk || {}).length ? rec().walk.folders : 0;
  if (!rec().walk || !rec().walk.complete || folderCount < 136) fail(`a drive of ${folderCount} folders is read to the end: ${JSON.stringify(rec().walk)}`);
  if (!item(await workFor(), 'd4m3-a2')) fail('the binder notes in 09 Litigation & ADR/Archive/Box 117 (folder 140 or so of the drive) are found and graded');
  const dh = (rec().handFiled || []).find((h) => h.id === deepHand);
  if (!dh || dh.path !== LIT) fail(`RS51 in 09 Litigation & ADR/Archive/Box 119 is found and filed in 09: ${JSON.stringify(dh)}`);
  if (!lists.length || lists.length > 12 || !lists.some((ps) => ps.length > 1)) fail(`the folders are read several to a query, not one by one: ${lists.length} queries`);
  ok(`a drive of ${folderCount} folders is read to the end (past the 80 the structure grader stopped at), several folders to a query (${lists.length} queries)`);

  /* 4: a drive larger than one run's budget: said, kept, carried on */
  const deeper = sub(boxes[5], 'Level A', 'Level B', 'Level C');   // three more levels: more queries than the budget allows
  const lastDoc = make('RS52 service papers.pdf', 'application/pdf', deeper, { body: '%PDF-1.4' });
  const before = JSON.stringify(rec().grades);
  env.DRIVE_WALK_QUERIES = '2';
  lists.length = 0;
  g = await grade();
  const w1 = rec().walk;
  if (!w1 || w1.complete || w1.reason !== 'budget' || !(w1.unread > 0)) fail(`a reading cut short by the budget says so: ${JSON.stringify(w1)}`);
  if (JSON.stringify(rec().grades) !== before) fail('a drive read only in part must not be graded as if it were whole: the last grades stand');
  if (!store.has('cm:drivewalk:' + tid)) fail('where the reading stopped is kept, for the next run to carry on');
  const rep1 = await report();
  if (!rep1 || !/\d+ folders? not read this run.*continued next run/.test(rep1.walkNote || '')) fail(`the trainer's report says how many folders weren't read and that the reading continues: ${rep1 && rep1.walkNote}`);
  if (!/not read this run/.test(((await workFor()) || {}).walkNote || '')) fail('the trainer\'s graded-work view says the drive was read only in part');
  if (!item(await workFor(), 'd3m2-rel')) fail('graded work must not be dropped as gone while part of the drive is unread');
  // the next run carries on from where this one stopped (it doesn't read the top of the drive again)
  let rounds = 0, resumed = false;
  while (rec().walk && !rec().walk.complete && rounds++ < 10) {
    lists.length = 0;
    g = await grade();
    if (lists.some((ps) => ps.includes(root))) fail('a reading carried on started again from the top folder');
    if (rec().walk.resumed) resumed = true;
  }
  if (!rec().walk || !rec().walk.complete || !resumed) fail(`the reading is carried on over the next runs until the whole drive is read: ${JSON.stringify(rec().walk)} after ${rounds} more`);
  if (store.has('cm:drivewalk:' + tid)) fail('a reading finished leaves nothing to carry on');
  if (!(rec().handFiled || []).some((h) => h.id === lastDoc && h.path === LIT)) fail('the document in the folders read last is found once the reading ends: ' + JSON.stringify([(rec().handFiled || []).map((h) => h.docId + ':' + h.path), rec().walk]));
  if (!rec().gradedAt || JSON.stringify(rec().grades) === before && !g.grades) fail('once the whole drive is read it is graded');
  if (((await report()) || {}).walkNote) fail('a drive read to the end carries no "not read" note');
  ok(`"Grade now" on a drive larger than its budget: the grades stand, the trainer is told what wasn't read, the next ${rounds} run(s) carry on from there, and the whole drive is graded when read`);

  // the nightly run: the same walk, within the run's budget; the run stops on this drive and the next carries on with it
  delete env.DRIVE_WALK_QUERIES;
  make('Day 5 trial prep', DOC, sub(deeper, 'Level D', 'Level E', 'Level F'), { body: 'Day 5 · Trial Prep Checklist Audit & KPI Update\n' + words(5) });
  env.DRIVE_WORK_BUDGET = '4';
  const n1 = await nightly();
  if (n1.stopped !== 'budget' || !rec().walk || rec().walk.complete || !store.has('cm:drivewalk:' + tid)) fail(`a nightly run over its budget stops on this drive, said and kept: ${JSON.stringify({ n1, walk: rec().walk })}`);
  if (!item(await workFor(), 'd3m2-rel') || !item(await workFor(), 'd4m3-a2')) fail('the nightly run read in part drops no graded work as gone');
  let nights = 0;
  while (rec().walk && !rec().walk.complete && nights++ < 12) { const nn = await nightly(); if (nn.passedOver.length) fail(`a drive read on a little each night is never passed over: ${JSON.stringify(nn)}`); }
  delete env.DRIVE_WORK_BUDGET;
  await nightly();
  if (!rec().walk || !rec().walk.complete || store.has('cm:drivewalk:' + tid)) fail(`the nightly run carries the reading on until the whole drive is read: ${JSON.stringify(rec().walk)}`);
  if (!item(await workFor(), 'd5m1-a2')) fail('the work in the deepest folder is graded once the nightly reading reaches it');
  ok(`the nightly run reads the same way: over its budget it stops on the drive, says so and keeps every grade; the next ${nights} night(s) carry on until the whole drive is read`);

  /* the walk by itself: a ceiling, a loop of folders, never out of the linked folder */
  const Wk = await import(pathToFileURL(path.join(ROOT, 'worker-drive-walk.js')).href);
  const fake = (tree) => ({ kv: null, driveMessage: () => 'error', drive: async (e, i, rc, m, url) => { const q = decodeURIComponent(url.split('q=')[1].split('&')[0]); const ps = [...q.matchAll(/'([^']+)' in parents/g)].map((x) => x[1]);
    return { ok: true, data: { files: Object.entries(tree).filter(([, f]) => [].concat(f.p).some((p) => ps.includes(p))).map(([id, f]) => ({ id, name: id, mimeType: f.d ? FOLDER : 'text/plain', parents: [].concat(f.p) })) } }; } });
  const loop = { A: { p: ['R', 'B'], d: 1 }, B: { p: 'A', d: 1 }, x: { p: 'B' } };   // A is in the linked folder and in its own subfolder B
  const L = await Wk.walkDrive({}, fake(loop), 'u', { rootId: 'R', folders: { out: 'OUTSIDE' } });
  if (!L.walk.complete || !L.files.x || !L.folders.A || !L.folders.B) fail(`a walk ends and finds every file: ${JSON.stringify(L.walk)}`);
  const outside = { OUTSIDE: { p: 'Elsewhere', d: 1 }, o1: { p: 'OUTSIDE' }, od: { p: 'OUTSIDE', d: 1 }, o2: { p: 'od' } };
  const O = await Wk.walkDrive({}, fake(Object.assign({ A: { p: 'R', d: 1 } }, outside)), 'u', { rootId: 'R', folders: { '01 Clients': 'OUTSIDE' } });
  if (O.files.o1 || O.files.o2 || O.folders.OUTSIDE) fail('a firm folder id of the record\'s that is not in the linked folder is never read as part of it');
  const big = {}; for (let i = 0; i < Wk.WALK_MAX_FOLDERS + 50; i++) big['f' + i] = { p: 'R', d: 1 };
  const B = await Wk.walkDrive({ DRIVE_WALK_QUERIES: '500' }, fake(big), 'u', { rootId: 'R', folders: {} });
  if (B.walk.complete || B.walk.reason !== 'ceiling' || B.walk.over < 40 || !/weren't read/.test(Wk.walkNote(B.walk))) fail(`a drive past the folder ceiling is said, never complete: ${JSON.stringify(B.walk)}`);
  ok(`the walk ends on a loop of folders, never reads outside the linked folder, and a drive past ${Wk.WALK_MAX_FOLDERS} folders is said, never presented as complete`);

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nThe Backup Drive is read to the end, at any depth: all good.');
})().catch((e) => { failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); console.error(e); process.exit(1); });
