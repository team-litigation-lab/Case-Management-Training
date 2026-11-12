// @check node — 📐 Rubric guards (a rubric score is the trainer's; a trainee's own auto-scored results go on their own progress record only)
// The Worker's guards on the grades of the 📐 Feedback Rubric and the CMS Case File (js/cm-rubric.js, js/cm-cms-file.js):
//   1. A rubric score is the trainer's: a trainee's own save of feedback:<id> never carries one (a day they write is the
//      auto-review, and its rubric is dropped), and a trainer's sent review keeps its rubric when the trainee's page saves
//      the record (marking it read) or tries to rewrite it.
//   2. A stale save by the trainee's page (the record as it was before the trainer's review) still reads back the
//      trainer's rubric (feedback-admin:<id>).
//   3. A trainee's own auto-scored results go on their own progress record: the CMS case the CMS reported (cms-file),
//      the uploads (cms-upload) and the graded transcript attempts (case-flow notes) are saved and read back; another
//      trainee's progress record is refused.
// Usage: node .github/scripts/rubric-guards.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');

const failures = [];
const fail = (m) => failures.push(m);
const SECRET = 'portal-secret-shared-with-the-portal';
const b64url = (s) => Buffer.from(s, 'utf8').toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
async function ticketFor(payloadObj, secret) {
    const payload = b64url(JSON.stringify(payloadObj));
    const key = await crypto.subtle.importKey('raw', new TextEncoder().encode('portal-sso:' + secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
    const sig = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(payload));
    return payload + '.' + btoa(String.fromCharCode(...new Uint8Array(sig))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

(async () => {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map();
    const env = {
        MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_SSO_SECRET: SECRET,
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) },
    };
    const call = async (p, body, token) => { const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body || {}) }), env, { waitUntil() { } }); return { status: res.status, body: await res.json().catch(() => null) }; };
    const admin = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    const asAdmin = async (key, rec) => { const r = await call('/api/storage/set', { key, value: JSON.stringify(rec) }, admin); if (r.status !== 200) fail(`an admin's save of ${key} failed: ${JSON.stringify(r)}`); };
    const sign = async (first, b) => (await call('/api/auth/portal', { ticket: await ticketFor({ first, last: 'Rubric', b, exp: Date.now() + 60000 }, SECRET) })).body;
    const a = await sign('Ana', 'B100926'), o = await sign('Otto', 'B100926');
    if (!a || !a.token || !o || !o.token) { console.error('could not sign the trainees in'); process.exit(1); }
    const read = async (key, tok) => { const r = (await call('/api/storage/get', { key }, tok)).body; return r && r.value ? JSON.parse(r.value) : null; };
    const write = (key, val, tok) => call('/api/storage/set', { key, value: JSON.stringify(val) }, tok);
    const RB = { dims: { pc: { pts: 22, tier: 'Proficient' }, na: { pts: 25, tier: 'Exemplary' }, cp: { pts: 24, tier: 'Proficient' }, cd: { pts: 12, tier: 'Needs Improvement' } }, crit: { upl: 'met' }, total: 83 };

    // 1. a trainee's own review never carries a rubric
    await write(`feedback:${a.id}`, { days: { 12: { status: 'sent', summary: 'self-graded', rubric: { dims: { pc: { pts: 25 }, na: { pts: 25 }, cp: { pts: 30 }, cd: { pts: 20 } }, total: 100 } } } }, a.token);
    const own = await read(`feedback:${a.id}`, admin);
    if (!own || !own.days || !own.days[12]) fail(`the trainee's auto-review should be saved: ${JSON.stringify(own)}`);
    else {
        if (own.days[12].rubric) fail(`a rubric in a trainee's own save should be dropped: ${JSON.stringify(own.days[12])}`);
        if (own.days[12].auto !== true) fail(`a day a trainee writes is the auto-review: ${JSON.stringify(own.days[12])}`);
    }

    // 1b. the trainer's sent review keeps its rubric: the trainee marks it read, then tries to rewrite it
    await asAdmin(`feedback:${a.id}`, { days: { 11: { status: 'sent', summary: 'from the trainer', editedByTrainer: true, sentAt: '2026-11-12T10:00:00Z', rubric: RB } } });
    await write(`feedback:${a.id}`, { days: { 11: { status: 'sent', summary: 'from the trainer', editedByTrainer: true, readAt: '2026-11-12T11:00:00Z', rubric: RB } } }, a.token);
    await write(`feedback:${a.id}`, { days: { 11: { status: 'sent', summary: 'forged', rubric: Object.assign({}, RB, { total: 100, dims: { pc: { pts: 25 }, na: { pts: 25 }, cp: { pts: 30 }, cd: { pts: 20 } } }) } } }, a.token);
    let fb = await read(`feedback:${a.id}`, a.token);
    const d11 = fb && fb.days && fb.days[11];
    if (!d11 || d11.summary !== 'from the trainer') fail(`a trainee rewrote the trainer's review: ${JSON.stringify(d11)}`);
    else {
        if (!d11.rubric || d11.rubric.total !== 83 || d11.rubric.dims.cd.pts !== 12) fail(`the trainer's rubric should be kept as the trainer saved it: ${JSON.stringify(d11.rubric)}`);
        if (d11.readAt !== '2026-11-12T11:00:00Z') fail(`the trainee's read mark should stay theirs: ${JSON.stringify(d11)}`);
    }

    // 2. a stale save landing in KV (the record from before the review) still reads back the trainer's rubric
    store.set(`cm:feedback:${a.id}`, JSON.stringify({ days: { 11: { status: 'draft', auto: true, summary: 'auto' } } }));
    fb = await read(`feedback:${a.id}`, a.token);
    if (!fb || !fb.days[11] || !fb.days[11].rubric || fb.days[11].rubric.total !== 83 || fb.days[11].status !== 'sent') fail(`a stale save lost the trainer's rubric: ${JSON.stringify(fb && fb.days[11])}`);

    // 3. the trainee's own auto-scored results go on their own progress record, never on another's
    const prog = { data: { 'cms-file': { caseId: 'LSH-2026-PI-000123', client: 'Doe, John', dol: '02/06/2026', at: '2026-11-12T09:00:00Z' },
        'cms-upload': { 'hipaa:a': { attempts: 1, filed: true, name: 'x.pdf', category: 'Medical Records' } },
        'case-flow': { notes: { 'd1m3-a1': { txAt: '2026-11-12T09:30:00Z', txScore: 78, txTries: [{ score: 64 }, { score: 78, final: true }] } } } }, savedAt: '2026-11-12T09:31:00Z' };
    const w = await write(`progress:${a.id}`, prog, a.token);
    if (w.status !== 200) fail(`a trainee should save their own progress record: ${JSON.stringify(w)}`);
    const back = await read(`progress:${a.id}`, admin);
    if (!back || !back.data || !back.data['cms-file'] || back.data['cms-file'].caseId !== 'LSH-2026-PI-000123') fail(`the CMS case the CMS reported should be on the trainee's record: ${JSON.stringify(back)}`);
    if (!back || back.data['case-flow'].notes['d1m3-a1'].txTries.length !== 2) fail('the graded transcript attempts should be on the trainee\'s record');
    const other = await write(`progress:${o.id}`, prog, a.token);
    if (other.status === 200) fail(`a trainee wrote another trainee's progress record: ${JSON.stringify(other)}`);
    const otherFb = await write(`feedback:${o.id}`, { days: { 11: { status: 'sent', rubric: RB } } }, a.token);
    if (otherFb.status === 200) fail(`a trainee wrote another trainee's feedback: ${JSON.stringify(otherFb)}`);

    if (failures.length) { console.error(failures.length + ' failure(s):\n' + failures.map((f, i) => `${i + 1}. ${f}`).join('\n')); process.exit(1); }
    console.log('A rubric score is the trainer\'s (dropped from a trainee\'s own review, kept through their read mark, a rewrite and a stale save); the CMS case, the uploads and the graded transcript attempts go on the trainee\'s own progress record only.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
