// @check node — A trainee's linked Google Drive opens at their case folders, for them and for a trainer (rootUrl/caseUrl, GDRIVE_TRAINER_EMAILS added to the folder without an email)
// 📁 Opening a trainee's Backup Drive: the trainee's own links, and a trainer's (Google answered by the test).
//
// The owner asked that a trainee's linked Drive be routed to their case file structure, so trainers can check the
// day-to-day output. The ways this breaks are quiet: the trainer's list (reportAll) carries no address to open, the
// address opens the root and not the case folder, or the trainers are never added to the folder and Google asks them
// to request access every time. So:
//   1. A linked folder: the trainee's status and a trainer's report (one trainee, and the list) carry rootUrl, the
//      linked LSH Case Backups folder; caseUrl waits until the structure is built.
//   2. Built: caseUrl is the case folder (01 Clients/Doe-John) the Worker made in it, in the status and both reports.
//   3. GDRIVE_TRAINER_EMAILS: each address (and a group:…) is added to the linked folder as a Commenter, never with a
//      Google email; an address that isn't one is skipped; a list changed later is added on the next ✓ Check (a trainer's
//      Check for the trainee too); a share Google refuses is tried again; an address taken off loses its access.
//   4. /version says whether GDRIVE_TRAINER_EMAILS is set (a count, never the addresses). Not linked: no address at all.
//   5. The page links them: js/cm-drive.js (📁 Open my Drive, 📁 My case folder, CMDrive.launch) and js/cm-drive-admin.js
//      (📁 Open Drive ↗ per trainee) use the Worker's rootUrl/caseUrl and only a drive.google.com address.
// Usage: node .github/scripts/drive-trainer-access.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const { pathToFileURL } = require('url');
const SA = require('./drive-sa-fake.cjs');
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

const FOLDER = SA.FOLDER;
const files = new Map(); let next = 0; const perms = [];
const granted = new Map();   // fid → Map(email → permission id): what Google holds
const refuse = new Set(); const deleted = [];   // addresses Google refuses to share with (403); permissions deleted
const make = (name, mimeType, parent, extra) => { const id = 'gd' + (++next) + 'xYz'; files.set(id, Object.assign({ name, mimeType, parents: parent ? [parent] : [], trashed: false }, extra || {})); return id; };
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT-sa', expires_in: 3600 });
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  const perm = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)\/permissions$/);
  if (perm && method === 'GET') return reply({ permissions: [...(granted.get(perm[1]) || new Map())].map(([emailAddress, id]) => ({ id, emailAddress })) });
  if (perm) { const body = JSON.parse(init.body); perms.push({ fid: perm[1], body, notify: u.searchParams.get('sendNotificationEmail') });
    if (refuse.has(body.emailAddress)) return reply({ error: { message: 'The user does not have sufficient permissions' } }, 403);
    const g = granted.get(perm[1]) || new Map(); granted.set(perm[1], g); const id = 'p' + (++next); g.set(body.emailAddress, id); return reply({ id }); }
  const permOne = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)\/permissions\/([^/]+)$/);
  if (permOne && method === 'DELETE') { const g = granted.get(permOne[1]) || new Map(); const e = [...g].find(([, id]) => id === permOne[2]); if (e) { g.delete(e[0]); deleted.push(e[0]); } return new Response(null, { status: 204 }); }
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const match = SA.qMatch(u.searchParams.get('q'));
    return reply({ files: [...files].filter(([, f]) => match(f)).map(([id, f]) => ({ id, name: f.name, mimeType: f.mimeType, parents: f.parents })) });
  }
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m) return files.has(m[1]) ? reply(SA.fileMeta(m[1], files.get(m[1]))) : reply({ error: { message: 'File not found' } }, 404);
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};

(async () => {
  const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
  const store = new Map();
  const kv = { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
    list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) };
  const base = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', LSH_KV: kv,
    ASSETS: { fetch: async () => new Response('<script>APP_BUILD = "ci"</script>', { headers: { 'Content-Type': 'text/html' } }) } };
  const env = Object.assign({}, base, SA.saEnv(), { GDRIVE_SA_SUBJECT: 'backups@lsh.example', GDRIVE_TRAINER_EMAILS: 'Coach.One@lsh.example, group:trainers@lsh.example; not-an-address' });
  const call = async (e, p, body, token, method = 'POST') => {
    const res = await worker.fetch(new Request('http://x' + p, { method, headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: method === 'POST' ? JSON.stringify(body || {}) : undefined }), e, { waitUntil() {} });
    const text = await res.text(); let json = null; try { json = JSON.parse(text); } catch (x) { /* text */ }
    return { status: res.status, body: json, text };
  };

  /* 4a: /version */
  const v = (await call(env, '/version', null, null, 'GET')).text, vNo = (await call(Object.assign({}, env, { GDRIVE_TRAINER_EMAILS: '' }), '/version', null, null, 'GET')).text;
  if (!/GDRIVE_TRAINER_EMAILS: 2 trainer address/.test(v)) fail(`/version should count the trainer addresses: ${v}`);
  if (!/GDRIVE_TRAINER_EMAILS not set/.test(vNo)) fail(`/version should say GDRIVE_TRAINER_EMAILS isn't set: ${vNo}`);
  if (/coach\.one|trainers@/i.test(v)) fail('/version shows a trainer address');
  ok('/version says whether GDRIVE_TRAINER_EMAILS is set, as a count');

  const t = (await call(env, '/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' })).body.token;
  const a = (await call(env, '/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
  if (!t || !a) { console.log('Could not sign a trainee and a trainer in.'); process.exit(1); }
  const st0 = (await call(env, '/api/drive', { action: 'status' }, t)).body.drive;
  if (st0.rootUrl || st0.caseUrl) fail(`not linked, the status should carry no Drive address: ${JSON.stringify({ r: st0.rootUrl, c: st0.caseUrl })}`);

  /* 1 + 3: linked */
  const root = make('LSH Case Backups', FOLDER, '');
  const linked = await call(env, '/api/drive', { action: 'link', url: SA.folderUrl(root) }, t);
  if (linked.status !== 200 || !linked.body.drive.connected) { console.log('Could not link: ' + linked.text); process.exit(1); }
  const traineeId = [...store.keys()].find((k) => k.startsWith('cm:drive:')).slice('cm:drive:'.length);
  const want = 'https://drive.google.com/drive/folders/' + root;
  if (linked.body.drive.rootUrl !== want || linked.body.drive.caseUrl) fail(`linked, the status should open the LSH Case Backups folder, no case folder before it is built: ${JSON.stringify({ r: linked.body.drive.rootUrl, c: linked.body.drive.caseUrl })}`);
  const reportOf = async () => ({ one: (await call(env, '/api/drive', { action: 'report', traineeId }, a)).body.report, all: (await call(env, '/api/drive', { action: 'reportAll', traineeIds: [traineeId] }, a)).body.reports[traineeId] });
  let R = await reportOf();
  if (!R.one || R.one.rootUrl !== want || !R.all || R.all.rootUrl !== want) fail(`a trainer's report (one trainee, and the list) should carry the folder's address: ${JSON.stringify({ one: R.one && R.one.rootUrl, all: R.all && R.all.rootUrl })}`);
  ok('linked: the trainee\'s status and a trainer\'s report (one and the list) open the linked folder; no case folder before it is built');

  const onRoot = perms.filter((p) => p.fid === root);
  const coach = onRoot.find((p) => p.body.emailAddress === 'coach.one@lsh.example'), group = onRoot.find((p) => p.body.emailAddress === 'trainers@lsh.example');
  if (!coach || coach.body.role !== 'commenter' || coach.body.type !== 'user') fail(`a trainer's address should be added to the folder as a Commenter: ${JSON.stringify(onRoot)}`);
  if (!group || group.body.type !== 'group' || group.body.role !== 'commenter') fail(`group:… should be added as a group: ${JSON.stringify(onRoot)}`);
  if (onRoot.some((p) => /not-an-address/.test(p.body.emailAddress || ''))) fail('something that is not an address was shared with');
  if (onRoot.some((p) => p.notify !== 'false')) fail(`no Google email should be sent when a folder is shared: ${JSON.stringify(onRoot.map((p) => p.notify))}`);
  ok('GDRIVE_TRAINER_EMAILS: each trainer (and a group) is added to the linked folder as a Commenter, with no email');

  /* 2: built — the case folder */
  const setup = await call(env, '/api/drive', { action: 'setup', layout: st0.standard }, t);
  if (setup.status !== 200 || !setup.body.graded || !setup.body.graded.ok) fail(`the firm's own standard should pass and be built: ${setup.text.slice(0, 300)}`);
  const recNow = JSON.parse(store.get([...store.keys()].find((k) => k.startsWith('cm:drive:'))));
  const caseId = (recNow.folders || {})['01 Clients/Doe-John'];
  const wantCase = 'https://drive.google.com/drive/folders/' + caseId;
  if (!caseId || files.get(caseId).name !== 'Doe-John') fail('the case folder was not made');
  const st1 = (await call(env, '/api/drive', { action: 'status' }, t)).body.drive;
  if (st1.caseUrl !== wantCase || st1.rootUrl !== want) fail(`built, the status should open the case folder (01 Clients/Doe-John): ${JSON.stringify({ c: st1.caseUrl, want: wantCase })}`);
  R = await reportOf();
  if (R.one.caseUrl !== wantCase || R.all.caseUrl !== wantCase) fail(`built, a trainer's report should open the case folder: ${JSON.stringify({ one: R.one.caseUrl, all: R.all.caseUrl })}`);
  ok('built: the trainee and a trainer open the case folder (01 Clients/Doe-John) the Worker made');

  /* 3b: a trainer added to the list later is added on the next ✓ Check, once */
  const env2 = Object.assign({}, env, { GDRIVE_TRAINER_EMAILS: env.GDRIVE_TRAINER_EMAILS + ', coach.two@lsh.example' });
  const before = perms.length;
  await call(env2, '/api/drive', { action: 'check' }, t);
  if (!perms.slice(before).some((p) => p.fid === root && p.body.emailAddress === 'coach.two@lsh.example' && p.body.role === 'commenter')) fail('a trainer added to GDRIVE_TRAINER_EMAILS later should be added on the next ✓ Check');
  const after = perms.length;
  await call(env2, '/api/drive', { action: 'check' }, t);
  if (perms.length !== after) fail('the trainers should be added once, not on every ✓ Check');
  ok('a trainer added to the list later is added on the next ✓ Check, once');

  /* 3c: Google refuses a share: it isn't recorded as shared, and the next ✓ Check tries it again */
  const env3 = Object.assign({}, env2, { GDRIVE_TRAINER_EMAILS: env2.GDRIVE_TRAINER_EMAILS + ', coach.three@lsh.example' });
  refuse.add('coach.three@lsh.example');
  await call(env3, '/api/drive', { action: 'check' }, t);
  const recOf = () => JSON.parse(store.get([...store.keys()].find((k) => k.startsWith('cm:drive:'))));
  if (/coach\.three/.test(recOf().trainers || '')) fail(`a share Google refused should not be recorded as done: ${recOf().trainers}`);
  refuse.clear(); const b3 = perms.length;
  await call(env3, '/api/drive', { action: 'check' }, t);
  if (!perms.slice(b3).some((p) => p.body.emailAddress === 'coach.three@lsh.example') || !/coach\.three/.test(recOf().trainers || '')) fail('a refused share should be tried again on the next ✓ Check');
  ok('a share Google refuses is not recorded, and the next ✓ Check tries it again');

  /* 3d: a trainer taken off the list loses their access to the folder */
  const env4 = Object.assign({}, env3, { GDRIVE_TRAINER_EMAILS: env3.GDRIVE_TRAINER_EMAILS.replace(', coach.two@lsh.example', '') });
  await call(env4, '/api/drive', { action: 'check' }, t);
  if (!deleted.includes('coach.two@lsh.example') || (granted.get(root) || new Map()).has('coach.two@lsh.example')) fail(`a trainer taken off GDRIVE_TRAINER_EMAILS should lose access to the folder: ${JSON.stringify(deleted)}`);
  if (/coach\.two/.test(recOf().trainers || '')) fail('the record should no longer list a trainer taken off');
  ok('a trainer taken off the list has their access to the folder taken away');

  /* 3e: a trainer's Check for a trainee shares the folder too (a folder linked before the list was set) */
  const env5 = Object.assign({}, env4, { GDRIVE_TRAINER_EMAILS: env4.GDRIVE_TRAINER_EMAILS + ', coach.four@lsh.example' }); const b5 = perms.length;
  await call(env5, '/api/drive', { action: 'checkFor', traineeId }, a);
  if (!perms.slice(b5).some((p) => p.body.emailAddress === 'coach.four@lsh.example')) fail('a trainer\'s Check for a trainee should share the folder with the current trainer list');
  ok('a trainer\'s Check for a trainee shares the folder with the trainers');

  /* 5: the page */
  const drive = fs.readFileSync(path.join(process.cwd(), 'js/cm-drive.js'), 'utf8'), admin = fs.readFileSync(path.join(process.cwd(), 'js/cm-drive-admin.js'), 'utf8');
  if (!/caseUrl/.test(drive) || !/rootUrl/.test(drive) || !/launch/.test(drive) || !/drive\\\.google\\\.com/.test(drive)) fail('js/cm-drive.js should link the Worker\'s rootUrl and caseUrl (drive.google.com only) and export CMDrive.launch');
  if (!/📁 Open Drive/.test(admin) || !/rep\.rootUrl/.test(admin) || !/rep\.caseUrl/.test(admin) || !/drive\\\.google\\\.com/.test(admin)) fail('js/cm-drive-admin.js should give a trainer 📁 Open Drive ↗ from the report\'s rootUrl and caseUrl (drive.google.com only)');
  ok('the trainee\'s page and the trainer\'s Trainee Drives link the Worker\'s addresses');

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nOpening a trainee\'s Backup Drive: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
