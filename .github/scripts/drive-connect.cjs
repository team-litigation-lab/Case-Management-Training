// 📂 Linking a trainee's Google Drive (/api/drive "connect" in worker.js), with Google answered by the test.
//
// The ways this breaks are ones a trainee can't read: a sign-in with the Drive box unticked that "connects" and then
// fails on every folder, or an account that said yes before and gets a refusal they can't get past. So:
//   1. /version says whether the Backup Drive is switched on, and names what is missing (never a value).
//   2. A sign-in without drive.file is refused (DRIVE_SCOPE_MISSING), nothing is kept, and the grant is given back.
//   3. A sign-in with no refresh token is refused (DRIVE_CONSENT_AGAIN) and the old grant is given back, so the
//      next Connect is a first consent and brings one; that next Connect then links.
//   4. A full sign-in links, with the email, and the page is never sent a token.
//   5. Google taking the link back (invalid_grant) drops the link but keeps the Day 1 grade.
//   6. The firm's structure (action "standard") is readable by a presenter (an admin) as well as a trainee.
// Usage: node .github/scripts/drive-connect.cjs   (no server, no browser needed)
const path = require('path'); const { pathToFileURL } = require('url');
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

const FILE = 'https://www.googleapis.com/auth/drive.file';
const b64u = (o) => Buffer.from(JSON.stringify(o)).toString('base64url');
const idToken = (email) => `${b64u({ alg: 'none' })}.${b64u({ email })}.x`;

let google = null;            // what the token endpoint answers next
const revoked = [];
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = String(url);
  if (u === 'https://oauth2.googleapis.com/token') {
    const p = new URLSearchParams(init.body);
    const out = typeof google === 'function' ? google(p) : google;
    return new Response(JSON.stringify(out.body), { status: out.status || 200, headers: { 'Content-Type': 'application/json' } });
  }
  if (u === 'https://oauth2.googleapis.com/revoke') { revoked.push(new URLSearchParams(init.body).get('token')); return new Response('{}'); }
  if (u.startsWith('https://www.googleapis.com/')) return new Response(JSON.stringify({ error: { message: 'not in this test' } }), { status: 500 });
  return realFetch(url, init);
};

(async () => {
  const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
  const store = new Map();
  const kv = { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
    list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).map((name) => ({ name })), list_complete: true }) };
  const base = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', LSH_KV: kv,
    ASSETS: { fetch: async () => new Response('<script>APP_BUILD = "ci"</script>', { headers: { 'Content-Type': 'text/html' } }) } };
  const on = Object.assign({}, base, { GOOGLE_CLIENT_ID: 'ci-client.apps.googleusercontent.com', GOOGLE_CLIENT_SECRET: 'ci-secret-value' });
  const call = async (env, p, body, token, method = 'POST') => {
    const res = await worker.fetch(new Request('http://x' + p, { method, headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: method === 'POST' ? JSON.stringify(body || {}) : undefined }), env, { waitUntil() {} });
    const text = await res.text(); let json = null; try { json = JSON.parse(text); } catch (e) { /* text */ }
    return { status: res.status, body: json, text };
  };

  /* 1: /version */
  const vOff = (await call(base, '/version', null, null, 'GET')).text, vOn = (await call(on, '/version', null, null, 'GET')).text;
  if (!/Backup Drive \(Google\): OFF \(missing GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET\)/.test(vOff)) fail(`/version should say the Backup Drive is off and what is missing: ${vOff}`);
  if (!/Backup Drive \(Google\): ON/.test(vOn)) fail(`/version should say the Backup Drive is on: ${vOn}`);
  if (vOn.includes('ci-secret-value')) fail('/version shows the Google client secret');
  ok('/version says whether the Backup Drive is switched on, and what is missing');

  const t = (await call(on, '/api/auth/trainee', { name: 'Ana Cruz', batch: 'B100926' })).body.token;
  if (!t) { console.log('Could not sign a trainee in.'); process.exit(1); }
  const id = (await call(on, '/api/drive', { action: 'status' }, t)).body;
  if (!id || !id.drive || id.drive.configured !== true) fail(`a trainee should see the Backup Drive switched on: ${JSON.stringify(id)}`);
  const driveRec = () => { const k = [...store.keys()].find((k) => k.startsWith('cm:drive:')); return k ? JSON.parse(store.get(k)) : null; };

  /* 2: the Drive box unticked */
  revoked.length = 0;
  google = { body: { access_token: 'AT-noscope', refresh_token: 'RT-noscope', expires_in: 3600, scope: 'openid https://www.googleapis.com/auth/userinfo.email', id_token: idToken('ana@example.com') } };
  let r = await call(on, '/api/drive', { action: 'connect', code: 'c1' }, t);
  if (r.status !== 400 || r.body.code !== 'DRIVE_SCOPE_MISSING') fail(`a sign-in without drive.file should be refused with DRIVE_SCOPE_MISSING: ${JSON.stringify(r)}`);
  if (driveRec() && driveRec().refresh) fail('a sign-in without drive.file was kept as a link');
  if (!revoked.includes('RT-noscope')) fail('a sign-in without drive.file should be given back to Google, so the next Connect asks again');
  ok('a sign-in with the Drive box unticked is refused, kept nowhere, and given back');

  /* 3: an account that said yes before: no refresh token */
  revoked.length = 0;
  google = { body: { access_token: 'AT-old', expires_in: 3600, scope: `openid email ${FILE}`, id_token: idToken('ana@example.com') } };
  r = await call(on, '/api/drive', { action: 'connect', code: 'c2' }, t);
  if (r.status !== 400 || r.body.code !== 'DRIVE_CONSENT_AGAIN') fail(`a sign-in with no refresh token should ask for one more Connect (DRIVE_CONSENT_AGAIN): ${JSON.stringify(r)}`);
  if (!revoked.includes('AT-old')) fail('the old grant should be given back, so the next Connect brings a refresh token');
  if (/third-party access/.test((r.body && r.body.error) || '')) fail('the trainee is still sent to clean up their Google account by hand');
  ok('an account that said yes before is asked to press Connect once more, with the old grant cleared');

  /* 4: the full sign-in */
  google = (p) => p.get('grant_type') === 'authorization_code'
    ? { body: { access_token: 'AT-good', refresh_token: 'RT-good', expires_in: 3600, scope: `${FILE} openid https://www.googleapis.com/auth/userinfo.email`, id_token: idToken('ana@example.com') } }
    : { status: 400, body: { error: 'invalid_grant' } };
  r = await call(on, '/api/drive', { action: 'connect', code: 'c3' }, t);
  if (r.status !== 200 || !r.body.drive || !r.body.drive.connected || r.body.drive.email !== 'ana@example.com') fail(`a full sign-in should link the drive with its email: ${JSON.stringify(r)}`);
  if (/AT-good|RT-good/.test(JSON.stringify(r.body))) fail('the page was sent a Google token');
  const rec = driveRec();
  if (!rec || !rec.refresh || /RT-good/.test(JSON.stringify(rec))) fail('the refresh token should be kept, sealed');
  ok('a full sign-in links the drive; the tokens are sealed and never sent to the page');

  /* 5: Google takes the link back: the Day 1 grade stays */
  const k = [...store.keys()].find((k) => k.startsWith('cm:drive:'));
  store.set(k, JSON.stringify(Object.assign(driveRec(), { exp: 0, setup: { attempts: 2, ok: true, score: 100, problems: [] }, tries: [{ ok: false }, { ok: true }], builtAt: '2026-02-09T00:00:00Z', rootId: 'R' })));
  r = await call(on, '/api/drive', { action: 'check' }, t);
  if (!r.body || r.body.code !== 'DRIVE_RECONNECT') fail(`a link Google took back should ask to connect again: ${JSON.stringify(r)}`);
  const after = driveRec();
  if (!after || !after.setup || after.setup.score !== 100) fail('a link Google took back wiped the trainee\'s Day 1 grade');
  if (after && after.refresh) fail('a link Google took back is still held');
  ok('a link Google takes back asks to connect again and keeps the Day 1 grade');

  /* 6: the firm's structure, for Day 1's slide */
  const st = (await call(on, '/api/drive', { action: 'standard' }, t)).body;
  if (!st || !st.standard || !(st.standard.standard || []).length || st.standard.configured !== true) fail(`a trainee should read the firm's structure: ${JSON.stringify(st)}`);
  const a = (await call(on, '/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
  const sa = (await call(on, '/api/drive', { action: 'standard' }, a)).body;
  if (!sa || !sa.standard || !(sa.standard.standard || []).length) fail(`a presenter (admin) should read the firm's structure: ${JSON.stringify(sa)}`);
  if (/email|refresh|access/.test(JSON.stringify(sa))) fail('the structure carries something of a trainee\'s drive');
  ok('the firm\'s structure is readable by a trainee and a presenter, and carries nobody\'s drive');

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nLinking a Google Drive: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
