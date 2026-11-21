// @check node — The Backup Drive's Day 4 drill is kept for good (forty more checks don't undo it), and Day 5's final audit gives nothing for an empty drive
// worker.js liensDrill / gradeDay, against an in-memory Google Drive:
//   1. Day 4 done right (06 Liens deleted, found by a check, put back, a clean check after) stays 100% after 45 more
//      ✓ Check my drive runs: checkLog keeps only its last 40 entries, and the drill is graded from what is kept for good;
//   2. a record written before the drill was kept: its drill is taken from its logs before they are cut, or, once they
//      were cut, from the full marks of its Day 4 grade; never lowered by the next grade;
//   3. Day 5 reached on a built drive with nothing filed and nothing on it: the final audit's empty parts earn nothing
//      (only the client folder in place and a clean check), and a label's document missing from the drive is said.
// Usage: node .github/scripts/drive-drill-kept.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const SA = require('./drive-sa-fake.cjs');
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
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT', expires_in: 3600 });   // the service account's token
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  if (u.pathname === '/upload/drive/v3/files') {
    const text = Buffer.from(init.body).toString('latin1');
    const meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
    const id = make(meta.name, 'application/pdf', meta.parents[0]);
    Object.assign(files.get(id), { description: meta.description || '', text });
    return reply({ id, webViewLink: 'https://drive/x' });
  }
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const match = SA.qMatch(u.searchParams.get('q'));
    return reply({ files: [...files].filter(([, f]) => match(f)).map(([id, f]) => ({ id, name: f.name, mimeType: f.mimeType, parents: f.parents })) });
  }
  if (/^\/drive\/v3\/files\/[^/]+\/permissions$/.test(u.pathname)) return reply({ id: 'p' });
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m) { const f = files.get(m[1]); return f ? reply(SA.fileMeta(m[1], f)) : reply({ error: { message: 'File not found' } }, 404); }
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};

(async () => {
  const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
  const store = new Map();
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', ...SA.saEnv(),
    LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
      list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) } };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const row = (g, label) => ((g && g.rows) || []).find((r) => r.label === label) || {};
  const trainee = async (name) => {
    const a = await auth('/api/auth/trainee', { name, batch: 'B100926' });
    const t = a.token, tid = a.id;
    await call({ action: 'link', url: SA.folderUrl(make('LSH Case Backups ' + name, FOLDER)) }, t);
    const std = (await call({ action: 'status' }, t)).body.drive;
    const built = await call({ action: 'setup', layout: std.standard }, t);
    if (!built.body || !built.body.built) { console.log('Could not build the drive: ' + JSON.stringify(built.body)); process.exit(1); }
    const key = 'cm:drive:' + tid, rec = () => JSON.parse(store.get(key)), setRec = (r) => store.set(key, JSON.stringify(r));
    const filed = [];
    const put = async (docId, kind) => { const r = await call({ action: 'put', docFolder: kind, name: `DOE-01_Doe-John_${docId}_2026-07-01.pdf`, b64: Buffer.from('%PDF-1.4 ' + docId).toString('base64url'), docId }, t); if (r.status !== 200) fail(`filing ${docId} failed: ${JSON.stringify(r.body)}`); filed.push(docId); };
    return { t, tid, rec, setRec, filed, put, check: () => call({ action: 'check' }, t), grade: async () => (await call({ action: 'grade', filed }, t)).body };
  };
  const C = '01 Clients/Doe-John', LIENS = `${C}/06 Liens & Reimbursement`;
  const drillDone = (g) => g && row(g, 'Missing folder found').got === 12 && row(g, 'Folder restored').got === 16;

  /* 1: the drill, then forty-five more checks */
  const A = await trainee('Ana Cruz');
  trash(A.rec().folders[LIENS]);
  await A.check();
  await call({ action: 'rebuild' }, A.t);
  await A.check();
  for (const [d, k] of [['RS41', 'liens'], ['RS42', 'liens'], ['RS84', 'liens'], ['RS85', 'liens'], ['RS86', 'liens'], ['RS44', 'settlement'], ['RS74', 'settlement']]) await A.put(d, k);
  let g = (await A.grade()).grades[4];
  if (!drillDone(g)) fail(`Day 4 done right should have the drill's full marks: ${JSON.stringify(g && g.rows)}`);
  const snap = A.rec();
  for (let i = 0; i < 45; i++) await A.check();
  if (A.rec().checkLog.some((c) => (c.missing || []).length)) fail('this check needs the drill\'s entries to have been cut from checkLog');
  g = (await A.grade()).grades[4];
  if (!drillDone(g) || g.score !== 100) fail(`Day 4 done right should stay 100% after 45 more checks: ${g && g.score}% ${JSON.stringify(g && g.rows.slice(0, 2))}`);
  ok('Day 4\'s drill outlasts the check log: 100% after 45 more ✓ Check my drive runs');

  /* 2: records written before the drill was kept */
  const old = JSON.parse(JSON.stringify(snap)); delete old.liensDrill;
  A.setRec(old);
  for (let i = 0; i < 45; i++) await A.check();
  g = (await A.grade()).grades[4];
  if (!drillDone(g)) fail(`a record from before (its drill only in its logs) should keep the drill through 45 more checks: ${JSON.stringify(g && g.rows.slice(0, 2))}`);
  const cut = JSON.parse(JSON.stringify(snap)); delete cut.liensDrill;
  cut.checkLog = cut.checkLog.filter((c) => !(c.missing || []).length); cut.restoreLog = [];
  A.setRec(cut);
  g = (await A.grade()).grades[4];
  if (!drillDone(g)) fail(`a record whose logs were already cut should keep the drill its Day 4 grade gave it full marks for: ${JSON.stringify(g && g.rows.slice(0, 2))}`);
  const none = JSON.parse(JSON.stringify(cut)); delete none.grades;
  A.setRec(none);
  g = (await A.grade()).grades[4];
  if (g && (row(g, 'Missing folder found').got || row(g, 'Folder restored').got)) fail(`with no drill anywhere in the record, Day 4's drill should not be credited: ${JSON.stringify(g.rows.slice(0, 2))}`);
  ok('a record from before keeps its drill: from its logs before they are cut, or from its Day 4 grade once they were');

  /* 3: Day 5 reached, nothing done */
  const B = await trainee('Bo Diaz');
  store.set('cm:progress:' + B.tid, JSON.stringify({ traineeId: B.tid, data: { 'day-progress': { 15: {} } } }));
  g = (await B.grade()).grades[5];
  const audit = row(g, 'Final audit');
  if (!g || audit.got > 2) fail(`Day 5 with nothing filed or on the drive and no check should earn next to nothing on the final audit: ${JSON.stringify(audit)}`);
  await B.check();
  g = (await B.grade()).grades[5];
  const a2 = row(g, 'Final audit'), notes = JSON.stringify(a2.notes || []);
  if (!g || a2.got > 5 || !/Nothing is filed in the CMS yet/.test(notes) || !/No course document is on the drive yet/.test(notes) || !/isn't on the drive to be labeled DRAFT/.test(notes)) fail(`Day 5 with only a clean check should get only the client folder's part of the final audit (5 of 20), and say why: ${JSON.stringify(a2)}`);
  ok('Day 5\'s final audit gives nothing for an empty drive: nothing filed, nothing on the drive, the labels\' documents missing');

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nThe Day 4 drill is kept and Day 5\'s audit is earned: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
