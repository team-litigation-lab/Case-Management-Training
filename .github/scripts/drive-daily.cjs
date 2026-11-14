// @check node — The Backup Drive is scored every day: each day a trainee has reached is graded (nothing on the drive yet scores 0), every night too, in four measures (compliance, attention to detail, organization, naming convention)
// worker.js gradeDay (DRIVE_DIMS, daysReached) and worker-drive-work.js (the nightly run), against an in-memory Google Drive:
//   1. a trainee who has reached Case Flow Days 2 and 3 (their saved "day-progress") but put nothing of them on the drive
//      gets both days graded, at what they earned, with what to fix; Day 4, not reached, is not graded;
//   2. each day's grade carries its four measures, each a percentage: compliance, attention to detail, organization and
//      naming convention (the rows of the day that show each one);
//   3. the nightly run grades a linked drive with no help from the trainee's page, and a trainer's report has the grades
//      and their measures (the Scorecard reads them, js/cm-batch-sheet.js).
// Usage: node .github/scripts/drive-daily.cjs   (no server, no browser needed)
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
  const W = fs.readFileSync(path.join(process.cwd(), 'worker.js'), 'utf8');
  const docs = fs.readFileSync(path.join(process.cwd(), 'js/cm-case-flow-docs.js'), 'utf8');

  /* the Worker, a trainee with a built drive */
  const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
  const store = new Map();
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', ...SA.saEnv(),
    LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
      list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) } };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const t = (await auth('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' })).token;
  const tid = (await auth('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' })).id;
  await call({ action: 'link', url: SA.folderUrl(make('LSH Case Backups', FOLDER)) }, t);
  const std = (await call({ action: 'status' }, t)).body.drive;
  const built = await call({ action: 'setup', layout: std.standard }, t);
  if (!built.body || !built.body.built) { console.log('Could not build the drive: ' + JSON.stringify(built.body)); process.exit(1); }
  // 1. Days 2 and 3 reached, nothing of them on the drive
  store.set('cm:progress:' + tid, JSON.stringify({ traineeId: tid, data: { 'day-progress': { 11: { score: 90, passed: true }, 12: { lastSlide: 3 }, 13: { lastSlide: 1 } } } }));
  const g = (await call({ action: 'grade', filed: [] }, t)).body || {};
  const grades = g.grades || (g.drive || {}).grades || {};
  if (!grades[2] || !grades[3]) fail(`Days 2 and 3, reached, should be graded with nothing on the drive yet: ${JSON.stringify(Object.keys(grades))}`);
  else {
    if (!(grades[2].score < 70) || !(grades[2].issues || []).length) fail(`Day 2 with nothing on the drive should score low and say what to fix: ${JSON.stringify({ s: grades[2].score, i: grades[2].issues })}`);
    ok(`Days 2 and 3 reached with nothing on the drive: graded ${grades[2].score}% and ${grades[3].score}%, with what to fix`);
  }
  if (grades[4]) fail('Day 4, not reached and not started, should not be graded');
  // 2. the four measures
  const WANT = { 2: ['compliance', 'detail', 'organization', 'naming'], 3: ['compliance', 'detail', 'naming'], };
  Object.entries(WANT).forEach(([n, ks]) => { const d = (grades[n] || {}).dims || {};
    ks.forEach((k) => { if (typeof d[k] !== 'number' || d[k] < 0 || d[k] > 100) fail(`Day ${n}'s grade should carry its ${k} measure as a percentage: ${JSON.stringify(d)}`); }); });
  if (!failures.length) ok('each day carries compliance, attention to detail, organization and naming convention');
  // 3. the nightly run, with no help from the page: the grade is dropped, and the run puts it back
  const key = [...store.keys()].find((k) => k.startsWith('cm:drive:'));
  const rec = JSON.parse(store.get(key)); delete rec.grades; delete rec.gradedAt; store.set(key, JSON.stringify(rec));
  await worker.scheduled({ cron: '0 7 * * *' }, env, { waitUntil() {} });
  const after = JSON.parse(store.get(key));
  if (!after.grades || !after.grades[2] || !after.grades[2].dims) fail(`the nightly run should grade the reached days by itself: ${JSON.stringify(Object.keys(after.grades || {}))}`);
  else ok('the nightly run grades a reached day by itself, with its measures');
  const adminT = (await auth('/api/auth/admin', { passphrase: 'ci-pass' })).token;
  const rep = (await call({ action: 'reportAll', traineeIds: [tid] }, adminT)).body || {};
  const r2 = (((rep.reports || {})[tid] || {}).grades || {})[2];
  if (!r2 || !r2.dims) fail(`a trainer's report should have the day's grade and its measures: ${JSON.stringify(r2)}`);
  else ok("a trainer's report carries the nightly grades and their measures (the Scorecard reads them)");
  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nThe Backup Drive is scored every day, in four measures: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
