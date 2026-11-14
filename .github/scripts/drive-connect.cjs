// @check node — Linking a trainee's Google Drive folder (shared with the service account and pasted, as Foundational links a Drive; every refusal says why; Google answered by the test)
// 📂 Linking a trainee's Google Drive (/api/drive "link" in worker.js), with Google answered by the test.
//
// The Backup Drive links the way the Foundations training links a trainee's Drive: no Google sign-in. The trainee
// shares a folder of their own with the program's service account as Editor and pastes its link. The ways this
// breaks are ones a trainee can't read: a link that "links" and then fails on every folder, or a refusal that doesn't
// say what to do. So:
//   1. /version says whether the Backup Drive is switched on, and names what is missing (never a value).
//   2. A link that isn't a folder's, a folder not shared with the account, one shared as Viewer and a file are each
//      refused with what to do, and nothing is kept.
//   3. A shared folder links: its name and owner shown, the address to share with given to the page, GDRIVE_SA_SUBJECT
//      added to the folder (no email), and no token anywhere.
//   4. A trainee linked by the old Google sign-in is asked to link again (relink) and keeps the Day 1 grade; linking
//      then makes the structure they already passed in the folder, without typing it again.
//   5. A folder later unshared is reported by ✓ Check, and 🔁 Put back says to link it again; the grade stays.
//   6. The firm's structure (action "standard") is readable by a presenter (an admin) as well as a trainee.
// Usage: node .github/scripts/drive-connect.cjs   (no server, no browser needed)
const path = require('path'); const { pathToFileURL } = require('url');
const SA = require('./drive-sa-fake.cjs');
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

/* an in-memory Google Drive: only what worker.js asks of it */
const FOLDER = SA.FOLDER;
const files = new Map(); let next = 0; const shared = []; const tokens = [];
const make = (name, mimeType, parent, extra) => { const id = 'gd' + (++next) + 'xYz'; files.set(id, Object.assign({ name, mimeType, parents: parent ? [parent] : [], trashed: false }, extra || {})); return id; };
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (u.href === 'https://oauth2.googleapis.com/token') {
    const jwt = new URLSearchParams(init.body).get('assertion') || '';
    tokens.push(JSON.parse(Buffer.from(jwt.split('.')[1] || '', 'base64url').toString() || '{}'));
    return reply({ access_token: 'AT-sa', expires_in: 3600 });
  }
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  // a folder the account isn't on reads as not found, as Google answers
  const visible = (id) => files.has(id) && !files.get(id).hidden;
  const perm = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)\/permissions$/);
  if (perm) { shared.push([perm[1], JSON.parse(init.body)]); return reply({ id: 'p' }); }
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const match = SA.qMatch(u.searchParams.get('q')), par = ((u.searchParams.get('q') || '').match(/'([^']+)' in parents/) || [])[1];
    if (par && !visible(par)) return reply({ error: { message: 'File not found' } }, 404);
    return reply({ files: [...files].filter(([, f]) => match(f)).map(([id, f]) => ({ id, name: f.name, mimeType: f.mimeType, parents: f.parents })) });
  }
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m) return visible(m[1]) ? reply(SA.fileMeta(m[1], files.get(m[1]))) : reply({ error: { message: 'File not found' } }, 404);
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};

(async () => {
  const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
  const store = new Map();
  const kv = { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
    list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) };
  const base = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', LSH_KV: kv,
    ASSETS: { fetch: async () => new Response('<script>APP_BUILD = "ci"</script>', { headers: { 'Content-Type': 'text/html' } }) } };
  const on = Object.assign({}, base, SA.saEnv(), { GDRIVE_SA_SUBJECT: 'backups@lsh.example' });
  const call = async (env, p, body, token, method = 'POST') => {
    const res = await worker.fetch(new Request('http://x' + p, { method, headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: method === 'POST' ? JSON.stringify(body || {}) : undefined }), env, { waitUntil() {} });
    const text = await res.text(); let json = null; try { json = JSON.parse(text); } catch (e) { /* text */ }
    return { status: res.status, body: json, text };
  };

  /* 1: /version */
  const vOff = (await call(base, '/version', null, null, 'GET')).text, vOn = (await call(on, '/version', null, null, 'GET')).text;
  if (!/Backup Drive \(Google\): OFF \(missing GDRIVE_SA_EMAIL and GDRIVE_SA_KEY\)/.test(vOff)) fail(`/version should say the Backup Drive is off and what is missing: ${vOff}`);
  if (!/Backup Drive \(Google\): ON .*GDRIVE_SA_SUBJECT is set/.test(vOn)) fail(`/version should say the Backup Drive is on: ${vOn}`);
  if (/PRIVATE KEY|lsh-backup@/.test(vOn)) fail('/version shows a value');
  ok('/version says whether the Backup Drive is switched on, and what is missing');

  const t = (await call(on, '/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' })).body.token;
  if (!t) { console.log('Could not sign a trainee in.'); process.exit(1); }
  const st0 = (await call(on, '/api/drive', { action: 'status' }, t)).body;
  if (!st0 || !st0.drive || st0.drive.configured !== true || st0.drive.connected || st0.drive.shareWith !== on.GDRIVE_SA_EMAIL) fail(`a trainee should see the Backup Drive on, not linked, with the address to share with: ${JSON.stringify(st0 && st0.drive && { c: st0.drive.configured, s: st0.drive.shareWith })}`);
  const driveRec = () => { const k = [...store.keys()].find((k) => k.startsWith('cm:drive:')); return k ? JSON.parse(store.get(k)) : null; };

  /* 2: links that can't be linked, each told why */
  const notShared = make('LSH Case Backups', FOLDER, '', { hidden: true });
  const viewer = make('LSH Case Backups', FOLDER, '', { canEdit: false });
  const aFile = make('notes.pdf', 'application/pdf', '');
  const tries = [
    ['a document link', 'https://docs.google.com/document/d/1AbCdEf/edit', 'DRIVE_LINK_BAD', /folder link/],
    ['a folder not shared with the account', SA.folderUrl(notShared), 'DRIVE_NOT_SHARED', new RegExp(`share it with ${on.GDRIVE_SA_EMAIL.replace(/\./g, '\\.')} as Editor`)],
    ['a folder shared as Viewer', SA.folderUrl(viewer), 'DRIVE_NOT_SHARED', /Viewer/],
    ['a file', SA.folderUrl(aFile), 'DRIVE_LINK_BAD', /file, not a folder/],
  ];
  for (const [what, url, code, says] of tries) {
    const r = await call(on, '/api/drive', { action: 'link', url }, t);
    if (r.status !== 400 || r.body.code !== code || !says.test(r.body.error || '')) fail(`${what} should be refused with ${code} and what to do: ${JSON.stringify(r.body)}`);
  }
  if (driveRec() && driveRec().rootId) fail('a link that was refused was kept');
  ok('a document link, an unshared folder, a Viewer share and a file are each refused with what to do, and nothing is kept');

  /* 3: a shared folder links */
  const root = make('LSH Case Backups', FOLDER, '');
  let r = await call(on, '/api/drive', { action: 'link', url: SA.folderUrl(root) + '?usp=sharing' }, t);
  if (r.status !== 200 || !r.body.drive.connected || r.body.drive.folderName !== 'LSH Case Backups' || r.body.drive.email !== 'ana@example.com' || !r.body.drive.rootUrl.includes(root)) fail(`a shared folder should link, with its name and owner: ${JSON.stringify(r.body && r.body.drive && { c: r.body.drive.connected, n: r.body.drive.folderName })}`);
  if (!shared.some(([fid, p]) => fid === root && p.emailAddress === on.GDRIVE_SA_SUBJECT && p.role === 'writer')) fail('GDRIVE_SA_SUBJECT should be added to the linked folder as an Editor, so copies written as that user land in it');
  if (/AT-sa|PRIVATE KEY|"refresh"|"access"/.test(JSON.stringify(r.body) + JSON.stringify(driveRec()))) fail('a token reached the page or the record');
  if (!tokens.length || tokens.some((c) => c.iss !== on.GDRIVE_SA_EMAIL || c.scope !== 'https://www.googleapis.com/auth/drive')) fail(`the Worker should sign in as the service account: ${JSON.stringify(tokens)}`);
  ok('a shared folder links with its name and owner; the subject is added to it; no token reaches the page or the record');

  /* 4: a trainee linked by the old Google sign-in: asked to link again, the Day 1 grade kept and its structure made */
  const k = [...store.keys()].find((k) => k.startsWith('cm:drive:'));
  store.set(k, JSON.stringify({ email: 'ana@example.com', refresh: 'sealed.old', access: 'sealed.old', exp: 0, rootId: root, folders: {}, connectedAt: '2026-02-09T00:00:00Z',
    setup: { attempts: 2, ok: true, score: 100, problems: [] }, tries: [{ ok: false }, { ok: true }], builtAt: '2026-02-09T00:00:00Z' }));
  const st1 = (await call(on, '/api/drive', { action: 'status' }, t)).body.drive;
  if (st1.connected || !st1.relink || !st1.setup || st1.setup.score !== 100) fail(`a record from the old sign-in should be asked to link again, its grade kept: ${JSON.stringify({ c: st1.connected, r: st1.relink })}`);
  r = await call(on, '/api/drive', { action: 'link', url: SA.folderUrl(root) }, t);
  const rec = driveRec();
  if (r.status !== 200 || !r.body.drive.connected || !r.body.drive.built || !r.body.built) fail(`linking again should make the structure already passed: ${JSON.stringify(r.body && { b: r.body.built, d: r.body.drive && r.body.drive.built })}`);
  if (!rec || rec.refresh || rec.access || rec.setup.score !== 100 || Object.keys(rec.folders || {}).length !== st1.standard.length) fail('the old tokens should go, the grade stay, and every folder be made');
  // a folder of the standard's name already in its place is taken, not made twice
  const count = () => [...files.values()].filter((f) => f.mimeType === FOLDER && !f.trashed).length, before = count();
  await call(on, '/api/drive', { action: 'link', url: SA.folderUrl(root) }, t);
  await call(on, '/api/drive', { action: 'rebuild' }, t);
  if (count() !== before) fail(`linking and building again should not double the folders: ${before} → ${count()}`);
  ok('a trainee from the old sign-in links again and keeps the Day 1 grade; their structure is made once');

  /* 5: the folder later unshared */
  files.get(root).hidden = true;
  r = await call(on, '/api/drive', { action: 'check' }, t);
  if (r.status !== 200 || !r.body.verified || !r.body.verified.rootGone) fail(`✓ Check should report a folder the platform can no longer open: ${JSON.stringify(r.body && r.body.verified)}`);
  r = await call(on, '/api/drive', { action: 'rebuild' }, t);
  if (r.body.code !== 'DRIVE_RECONNECT' || !/shared with the platform as Editor/.test(r.body.error || '')) fail(`🔁 Put back should say to share or link the folder again: ${JSON.stringify(r.body)}`);
  if (!driveRec().setup || driveRec().setup.score !== 100) fail('a folder unshared wiped the Day 1 grade');
  files.get(root).hidden = false;
  r = await call(on, '/api/drive', { action: 'disconnect' }, t);
  if (r.body.drive.connected || !driveRec().setup || driveRec().setup.score !== 100) fail('Unlink should drop the link and keep the grade');
  ok('a folder unshared later is reported and asked to be linked again; unlinking keeps the grade');

  /* 6: the firm's structure, for Day 1's slide */
  const st = (await call(on, '/api/drive', { action: 'standard' }, t)).body;
  if (!st || !st.standard || !(st.standard.standard || []).length || st.standard.configured !== true) fail(`a trainee should read the firm's structure: ${JSON.stringify(st)}`);
  const a = (await call(on, '/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
  const sa = (await call(on, '/api/drive', { action: 'standard' }, a)).body;
  if (!sa || !sa.standard || !(sa.standard.standard || []).length) fail(`a presenter (admin) should read the firm's structure: ${JSON.stringify(sa)}`);
  if (/email|refresh|access/.test(JSON.stringify(sa))) fail('the structure carries something of a trainee\'s drive');
  ok('the firm\'s structure is readable by a trainee and a presenter, and carries nobody\'s drive');

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nLinking a Google Drive folder: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
