// @check node — A Backup Drive with something new is graded within the hour, with no one pressing Grade now: the hourly scheduled run picks only the drives whose trainee did something since it last looked, keeps to the run's budget and carries on the next hour; its 07:00 UTC firing is the nightly run
// worker.js scheduled → worker-drive-work.js (cronRun, driveWorkActive, activityOf), against an in-memory Google Drive:
//   1. two trainees link and build their drives: the next hourly firing grades both (their structure graded, the drive
//      looked at kept in cm:drivework-active), with nobody pressing anything;
//   2. a quiet hour (nothing new): no drive is picked, nothing of Google's is asked and nothing is written;
//   3. one trainee reaches Day 2 (their progress saved): the next hour grades that drive (Day 2 graded) and not the other;
//   4. a run with a small budget stops there, said, and the next hour picks up the drive it left;
//   5. which run a firing is: "0 * * * *" at 07:00 UTC and "0 7 * * *" are the nightly run (cm:drivework-run), any other
//      hour the hourly one; wrangler.json has the one hourly cron (Cloudflare's cron limit is per account).
// Usage: node .github/scripts/auto-grade-drive.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const SA = require('./drive-sa-fake.cjs');
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

/* ---------- an in-memory Google Drive: only what worker.js asks of it ---------- */
const FOLDER = 'application/vnd.google-apps.folder';
const files = new Map(); let next = 0, google = 0;
const make = (name, mimeType, parent) => { const id = 'g' + (++next); files.set(id, { name, mimeType, parents: parent ? [parent] : [], trashed: false }); return id; };
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (/googleapis\.com$/.test(u.host)) google++;
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT', expires_in: 3600 });
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  if (u.pathname === '/upload/drive/v3/files') {
    const text = Buffer.from(init.body).toString('latin1');
    const meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
    const id = make(meta.name, 'application/pdf', meta.parents[0]);
    Object.assign(files.get(id), { description: meta.description || '' });
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
  const ROOT = process.cwd();
  const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
  const W = await import(pathToFileURL(path.join(ROOT, 'worker-drive-work.js')).href);
  const store = new Map(); let puts = 0;
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', ...SA.saEnv(),
    LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => { puts++; store.set(k, v); }, delete: async (k) => store.delete(k),
      list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) } };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const at = (h) => Date.UTC(2026, 10, 20, h, 0, 0);
  const hourly = async (h = 10) => { await worker.scheduled({ cron: '0 * * * *', scheduledTime: at(h) }, env, { waitUntil: (p) => p }); return JSON.parse(store.get('cm:drivework-active') || 'null'); };
  const drive = (id) => JSON.parse(store.get('cm:drive:' + id) || 'null');
  const trainee = async (name) => {
    const a = await auth('/api/auth/trainee', { name, batch: 'B100926' });
    await call({ action: 'link', url: SA.folderUrl(make(name + ' Backups', FOLDER)) }, a.token);
    const std = (await call({ action: 'status' }, a.token)).body.drive;
    const built = await call({ action: 'setup', layout: std.standard }, a.token);
    if (!built.body || !built.body.built) { console.log('Could not build the drive: ' + JSON.stringify(built.body)); process.exit(1); }
    return a.id;
  };
  const ana = await trainee('Ana Cruz'), ben = await trainee('Ben Ortiz');
  [ana, ben].forEach((id) => { const r = drive(id); delete r.gradedAt; delete r.grades; store.set('cm:drive:' + id, JSON.stringify(r)); });

  // 1. linked and built: graded by the next hour, by itself
  const r1 = await hourly();
  if (!r1 || !r1.seen || !r1.seen[ana] || !r1.seen[ben]) fail(`the hourly run should grade both newly linked drives and keep that it looked: ${JSON.stringify(r1 && { picked: r1.picked, seen: r1.seen, stopped: r1.stopped, errors: r1.errors })}`);
  else if (!drive(ana).gradedAt || !drive(ben).gradedAt) fail(`both drives should be graded by the hourly run: ${JSON.stringify([drive(ana).gradedAt, drive(ben).gradedAt])}`);
  else ok(`a drive linked and built is graded by the next hourly run with no one pressing Grade now (${r1.picked.length} picked, ${r1.subrequests} subrequests)`);

  // 2. a quiet hour
  const g0 = google, p0 = puts, s0 = store.get('cm:drivework-active');
  const r2 = await hourly(11);
  if (google !== g0 || puts !== p0 || store.get('cm:drivework-active') !== s0) fail(`a quiet hour should ask Google nothing and write nothing: ${JSON.stringify({ google: google - g0, puts: puts - p0 })}`);
  else ok('a quiet hour (nothing new on any drive): no drive picked, nothing asked of Google, nothing written');

  // 3. Ana reaches Day 2: her drive is graded within the hour, Ben's is not
  await new Promise((r) => setTimeout(r, 5));
  store.set('cm:progress:' + ana, JSON.stringify({ traineeId: ana, savedAt: new Date().toISOString(), data: { 'day-progress': { 11: { score: 90, passed: true }, 12: { lastSlide: 3 } } } }));
  const benWas = drive(ben).gradedAt;
  const r3 = await hourly(12);
  if (!r3 || JSON.stringify(r3.picked) !== JSON.stringify([ana])) fail(`only the drive with something new should be picked: ${JSON.stringify(r3 && r3.picked)}`);
  else if (!(drive(ana).grades || {})[2]) fail(`Ana's Day 2, reached, should be graded by the hourly run: ${JSON.stringify(Object.keys(drive(ana).grades || {}))}`);
  else if (drive(ben).gradedAt !== benWas) fail("Ben's drive, with nothing new, should be left alone");
  else ok("a trainee who reaches Day 2 has it graded on their drive within the hour; the drive with nothing new is left alone");

  // 4. the budget: a run that can afford one drive grades it and stops; the next hour carries on with the other
  await new Promise((r) => setTimeout(r, 5)); const later = new Date().toISOString(); await new Promise((r) => setTimeout(r, 5));
  [ana, ben].forEach((id) => store.set('cm:progress:' + id, JSON.stringify({ traineeId: id, savedAt: later, data: { 'day-progress': { 11: { score: 90 } } } })));
  env.DRIVE_WORK_BUDGET = '2';
  const r4 = await hourly(13);
  const r5 = await hourly(14);
  delete env.DRIVE_WORK_BUDGET;
  const both = [...(r4.picked || []), ...(r5.picked || [])].sort();
  if (r4.due !== 2 || !(r4.picked.length < 2) || r4.stopped !== 'budget' || JSON.stringify(both) !== JSON.stringify([ana, ben].sort()) || r5.subrequests > 2) fail(`a run over its budget stops there and the next hour carries on: ${JSON.stringify({ r4: { due: r4.due, picked: r4.picked, stopped: r4.stopped, sub: r4.subrequests }, r5: { due: r5.due, picked: r5.picked, stopped: r5.stopped, sub: r5.subrequests } })}`);
  else ok(`within the run's budget (${r4.subrequests} and ${r5.subrequests} of 2 subrequests): it stops where its budget ends and the next hour picks up the drive it left`);

  // 5. which run a firing is
  const kinds = [W.cronRun({ cron: '0 * * * *', scheduledTime: at(7) }), W.cronRun({ cron: '0 7 * * *' }), W.cronRun({ cron: '0 * * * *', scheduledTime: at(15) })];
  if (JSON.stringify(kinds) !== '["nightly","nightly","active"]') fail(`07:00 UTC is the nightly run, the other hours the hourly one: ${JSON.stringify(kinds)}`);
  store.delete('cm:drivework-run');
  await worker.scheduled({ cron: '0 * * * *', scheduledTime: at(7) }, env, { waitUntil: (p) => p });
  if (!store.has('cm:drivework-run')) fail('the 07:00 UTC firing should be the nightly run (its cursor in cm:drivework-run)');
  const wr = JSON.parse(fs.readFileSync(path.join(ROOT, 'wrangler.json'), 'utf8')), crons = (wr.triggers || {}).crons || [];
  if (!crons.includes(W.HOURLY_CRON) || crons.length > 2) fail(`wrangler.json should run the Worker every hour, with no more crons than it needs: ${JSON.stringify(crons)}`);
  if (!failures.length) ok('"0 * * * *" at 07:00 UTC (and "0 7 * * *") is the nightly run, the other hours the hourly one; wrangler.json has the one hourly cron');

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nA Backup Drive with something new is graded within the hour, by itself: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
