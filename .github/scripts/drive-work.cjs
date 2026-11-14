// @check node — The trainee's written work on the Backup Drive is AI-graded nightly against its activity's rubric, and a trainer's override wins (in-memory Drive, stubbed AI)
// ✍ The written work on a trainee's Backup Drive, graded by the AI (worker-drive-work.js), against an in-memory Google
// Drive and a stubbed AI. The ways this goes wrong are quiet: a work matched to the wrong activity (or guessed), the
// course's own documents graded as the trainee's, an AI answer that zeroes a grade, a nightly run that grades the same
// file every night or never reaches the last trainee, an override the next run overwrites, another trainee's grades. So:
//   1. The activities are the course's: every WORK id is a Skill Building activity of js/cm-case-flow-data.js, on its day,
//      and the rubric the Worker reads from the data (through ASSETS) is the activity's own rubric.ai.
//   2. Matching: an activity's title in the heading (Day N narrows it), else two key terms of an activity kept in the file's
//      folder; anything else is listed "not matched" with why. The wrong folder is said, a name off the convention too.
//   3. Reading: a Google Doc (text/plain), a Sheet (text/csv), a PDF's text (Flate), a .docx; an image and a scanned PDF are
//      "not readable"; a long document is cut at 20,000 characters and the AI is told so.
//   4. Never graded: the platform's copies (filed documents, the drill, its description, a file the service account owns).
//   5. The AI's JSON is checked (every dimension, points within the maximum, a reason for each point off); a failed or
//      unusable answer keeps the last grade and is tried again on the next run.
//   6. Nightly (scheduled): a bounded batch, a cursor in KV, the next run carries on; a drive with nothing changed costs
//      one listing and no AI; the same unchanged file is never graded twice; wrangler.json has the cron.
//   7. A trainer's override (a day's structure grade and an activity's AI grade, with a comment) is the final grade the
//      trainee sees, survives the nightly run and every other write of the record, and can be cleared.
//   8. Permissions: a trainee reads only their own grades; another trainee's, Grade now and overrides are a trainer's; no
//      token or key in any answer.
// Usage: node .github/scripts/drive-work.cjs   (no server, no browser needed)
const fs = require('fs'); const path = require('path'); const zlib = require('zlib'); const { pathToFileURL } = require('url');
const SA = require('./drive-sa-fake.cjs');
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);
const ROOT = process.cwd();

/* ---------- an in-memory Google Drive: what worker.js and worker-drive-work.js ask of it ---------- */
const FOLDER = SA.FOLDER, DOC = 'application/vnd.google-apps.document', SHEET = 'application/vnd.google-apps.spreadsheet';
const files = new Map(); let next = 0, clock = Date.parse('2026-11-01T00:00:00Z');
const tick = () => new Date(clock += 60000).toISOString();
const make = (name, mimeType, parent, extra) => { const id = 'gw' + (++next) + 'Qx'; files.set(id, Object.assign({ name, mimeType, parents: parent ? [parent] : [], trashed: false, modifiedTime: tick(), owners: [{ emailAddress: 'ana@example.com' }] }, extra || {})); return id; };
const edit = (id, body) => { const f = files.get(id); if (body != null) f.body = body; f.modifiedTime = tick(); };
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const calls = { exported: [], ai: 0, list: 0 };
let aiMode = 'good', aiScoreOff = 5;
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
  const u = new URL(String(url)), method = init.method || 'GET';
  if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT-secret-token', expires_in: 3600 });
  if (u.host === 'generativelanguage.googleapis.com') return aiAnswer(JSON.parse(init.body));
  if (u.host !== 'www.googleapis.com') return realFetch(url, init);
  if (u.pathname === '/upload/drive/v3/files') {
    const text = Buffer.from(init.body).toString('latin1'), meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
    const id = make(meta.name, 'application/pdf', meta.parents[0], { description: meta.description || '', owners: [{ emailAddress: SA.saEnv().GDRIVE_SA_EMAIL }], body: '%PDF-1.4 a course document' });
    return reply({ id, webViewLink: 'https://drive/x' });
  }
  if (/\/permissions$/.test(u.pathname)) return reply({ id: 'p' });
  if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, b.mimeType, (b.parents || [])[0]) }); }
  if (u.pathname === '/drive/v3/files' && method === 'GET') {
    const q = u.searchParams.get('q') || '', parents = [...q.matchAll(/'([^']+)' in parents/g)].map((m) => m[1]);
    if (parents.length > 1) calls.list++;
    const single = parents.length <= 1 ? SA.qMatch(q) : null;
    const match = (f) => single ? single(f) : (!f.trashed && parents.includes((f.parents || [])[0]));
    return reply({ files: [...files].filter(([, f]) => match(f)).map(([id, f]) => ({ id, name: f.name, mimeType: f.mimeType, parents: f.parents, modifiedTime: f.modifiedTime, createdTime: f.modifiedTime, description: f.description, owners: f.owners, size: f.body ? String(Buffer.byteLength(f.body)) : undefined })) });
  }
  const ex = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)\/export$/);
  if (ex) { const f = files.get(ex[1]); calls.exported.push(ex[1]); if (!f) return reply({ error: { message: 'not found' } }, 404);
    const want = u.searchParams.get('mimeType'); if ((f.mimeType === DOC && want !== 'text/plain') || (f.mimeType === SHEET && want !== 'text/csv')) return reply({ error: { message: 'bad export' } }, 400);
    return new Response(f.body || '', { headers: { 'Content-Type': want } }); }
  const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
  if (m && u.searchParams.get('alt') === 'media') { const f = files.get(m[1]); calls.exported.push(m[1]); return f ? new Response(f.body) : reply({ error: { message: 'not found' } }, 404); }
  if (m) { const f = files.get(m[1]); return f ? reply(SA.fileMeta(m[1], f)) : reply({ error: { message: 'File not found' } }, 404); }
  return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};
/* the stubbed AI: it reads the rubric from the prompt and answers as told (aiMode) */
const prompts = [];
function aiAnswer(body) {
  calls.ai++;
  const user = body.contents.map((c) => c.parts.map((p) => p.text).join('')).join('\n'); prompts.push({ user, system: (body.systemInstruction || { parts: [{ text: '' }] }).parts[0].text });
  if (aiMode === 'error') return reply({ error: { message: 'model overloaded' } }, 503);
  const dims = [...user.matchAll(/^- (.+?) \((\d+) points\):/gm)].map((m) => ({ name: m[1], max: Number(m[2]) }));
  let out;
  if (aiMode === 'garbage') out = 'I think this work is pretty good, about 80 out of 100.';
  else if (aiMode === 'missing') out = JSON.stringify({ score: 70, dimensions: dims.slice(1).map((d) => ({ name: d.name, points: d.max })), strengths: [], fix: [] });
  else if (aiMode === 'over') out = JSON.stringify({ score: 100, dimensions: dims.map((d) => ({ name: d.name, points: d.max + 5 })), strengths: [], fix: [] });
  else {
    const pts = dims.map((d, i) => ({ name: d.name, points: i === 0 ? Math.max(0, d.max - aiScoreOff) : d.max }));
    const got = pts.reduce((t, p) => t + p.points, 0), total = dims.reduce((t, d) => t + d.max, 0);
    out = '```json\n' + JSON.stringify({ score: Math.round(100 * got / total), dimensions: pts, strengths: ['You sourced every date to its document.'],
      fix: aiScoreOff ? [{ shows: 'Your memo names no deadline for the reply.', standard: 'Every routed item carries a dated next step.', why: "On John Doe's file a reply with no date is a reply nobody chases.", next: 'Add the reply date and docket it.' }] : [] }) + '\n```';
  }
  return reply({ candidates: [{ content: { parts: [{ text: out }] }, finishReason: 'STOP' }] });
}
/* a PDF with one Flate-compressed content stream, and a .docx (a zip holding word/document.xml) */
function pdfOf(lines) {
  const content = 'BT /F1 12 Tf 72 720 Td ' + lines.map((l, i) => (i ? '0 -16 Td ' : '') + '(' + l.replace(/[()\\]/g, '\\$&') + ') Tj').join(' ') + ' ET';
  const z = zlib.deflateSync(Buffer.from(content, 'latin1'));
  return Buffer.concat([Buffer.from('%PDF-1.4\n1 0 obj\n<< /Length ' + z.length + ' /Filter /FlateDecode >>\nstream\n', 'latin1'), z, Buffer.from('\nendstream\nendobj\n%%EOF\n', 'latin1')]);
}
function docxOf(paras) {
  const xml = Buffer.from('<?xml version="1.0"?><w:document><w:body>' + paras.map((p) => `<w:p><w:r><w:t>${p.replace(/&/g, '&amp;')}</w:t></w:r></w:p>`).join('') + '</w:body></w:document>');
  const data = zlib.deflateRawSync(xml), name = Buffer.from('word/document.xml');
  const local = Buffer.alloc(30); local.writeUInt32LE(0x04034b50, 0); local.writeUInt16LE(8, 8); local.writeUInt32LE(data.length, 18); local.writeUInt32LE(xml.length, 22); local.writeUInt16LE(name.length, 26);
  const cen = Buffer.alloc(46); cen.writeUInt32LE(0x02014b50, 0); cen.writeUInt16LE(8, 10); cen.writeUInt32LE(data.length, 20); cen.writeUInt32LE(xml.length, 24); cen.writeUInt16LE(name.length, 28); cen.writeUInt32LE(0, 42);
  const off = 30 + name.length + data.length, eocd = Buffer.alloc(22); eocd.writeUInt32LE(0x06054b50, 0); eocd.writeUInt16LE(1, 8); eocd.writeUInt16LE(1, 10); eocd.writeUInt32LE(46 + name.length, 12); eocd.writeUInt32LE(off, 16);
  return Buffer.concat([local, name, data, cen, name, eocd]);
}
const words = (n) => Array.from({ length: n }, (_, i) => `The routed item ${i} carries its source document and a dated next step for Atty. Thorne.`).join('\n');

(async () => {
  const W = await import(pathToFileURL(path.join(ROOT, 'worker-drive-work.js')).href);
  const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
  const src = fs.readFileSync(path.join(ROOT, 'js/cm-case-flow-data.js'), 'utf8');

  /* 1: the activities are the course's */
  global.window = {}; new Function('window', src)(global.window);
  const where = {};
  window.CM_CASE_FLOW.days.forEach((d) => { const walk = (o) => { if (Array.isArray(o)) o.forEach(walk); else if (o && typeof o === 'object') { if (o.kind === 'activity' && o.id) where[o.id] = { day: d.n, o }; else Object.values(o).forEach(walk); } }; walk(d); });
  const catalog = W.parseActivities(src);
  W.WORK.forEach(([id, day, folder]) => {
    const w = where[id], a = catalog[id];
    if (!w) return fail(`${id} is not a Skill Building activity of the course`);
    if (w.day !== day) fail(`${id} is listed on Day ${day}, but the course has it on Day ${w.day}`);
    if (!a || a.title !== w.o.title || JSON.stringify(a.rubric) !== JSON.stringify(w.o.rubric.ai) || a.prompt !== w.o.act.prompt || a.output !== w.o.act.output) fail(`${id}: what the Worker reads from the course data is not the activity's own title, task and rubric.ai`);
    if (!['intake', 'police', 'medical', 'bills', 'insurance', 'liens', 'settlement', 'property', 'litigation'].includes(folder)) fail(`${id} is kept in "${folder}", which is no folder of the firm's`);
    if (/-drive$/.test(id)) fail(`${id} is a Backup File Maintenance activity: the structure grade covers it`);
  });
  ok(`the ${W.WORK.length} written activities are the course's own, on their days, each graded against its own rubric.ai`);

  /* the Worker, with the Backup Drive and an AI key */
  const store = new Map();
  const kv = { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k),
    list: async ({ prefix = '', cursor } = {}) => { const all = [...store.keys()].filter((k) => k.startsWith(prefix)).sort(), at = Number(cursor || 0), page = all.slice(at, at + 2);   // pages of 2: the run must page
      return { keys: page.map((name) => ({ name })), list_complete: at + 2 >= all.length, cursor: String(at + 2) }; } };
  const ASSETS = { fetch: async (req) => { const p = path.join(ROOT, decodeURIComponent(new URL(req.url).pathname)); return fs.existsSync(p) ? new Response(fs.readFileSync(p)) : new Response('Not found', { status: 404 }); } };
  const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', GEMINI_API_KEY: 'AIza-test-key-secret', LSH_KV: kv, ASSETS, ...SA.saEnv() };
  const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); const text = await res.text(); let j = null; try { j = JSON.parse(text); } catch (e) {} return { status: res.status, body: j, text }; };
  const auth = async (p, b) => (await (await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
  const admin = (await auth('/api/auth/admin', { passphrase: 'ci-pass' })).token;
  const people = {};
  for (const [first, last] of [['Ana', 'Cruz'], ['Ben', 'Lim'], ['Cara', 'Diaz']]) {
    const a = await auth('/api/auth/trainee', { name: `${first} ${last}`, batch: 'B100926' });
    const root = make('LSH Case Backups', FOLDER, '');
    await call({ action: 'link', url: SA.folderUrl(root) }, a.token);
    const std = (await call({ action: 'status' }, a.token)).body.drive.standard;
    const b = await call({ action: 'setup', layout: std }, a.token);
    if (!b.body || !b.body.built) { console.log('Could not build a drive: ' + b.text.slice(0, 300)); process.exit(1); }
    people[first] = { token: a.token, id: a.id, root };
    store.set("cm:trainee:" + a.id, JSON.stringify({ id: a.id, name: `${first} ${last}`, batch: "B100926", approved: true }));
  }
  const folder = (who, p) => JSON.parse(store.get('cm:drive:' + people[who].id)).folders[p];
  const C = '01 Clients/Doe-John', INS = `${C}/05 Insurance, Demands & Negotiation`, LIT = `${C}/09 Litigation & ADR`, LIENS = `${C}/06 Liens & Reimbursement`, MED = `${C}/03 Medical Records`;
  const workOf = async (who) => (await call({ action: 'work' }, people[who].token)).body;
  const item = (v, id) => (v.work.items || []).find((x) => x.id === id);
  const nightly = async () => { await worker.scheduled({ cron: '0 7 * * *' }, env, { waitUntil: (p) => p }); return JSON.parse(store.get('cm:drivework-run')); };
  await nightly();   // nothing written yet: a run costs a listing per drive and grades nothing

  /* 2–4: Ana's drive: work matched by its title, by its key terms, and not matched; files that can't be read; the platform's own */
  const REL = 'Settlement Release Clause Review & Attorney Approval';
  const rel = make('LSH-2026-MVA-000041_Doe-John_Others_2026-11-01', DOC, folder('Ana', INS), { body: `Day 3 · ${REL}\nMemorandum to Atty. Thorne\n` + words(40) });
  const reductionPdf = make('reduction.pdf', 'application/pdf', folder('Ana', LIENS), { body: pdfOf(['Peach State reduction request, for Atty. Thorne\'s signature', 'The Lien Tracker clears every absent claimant; the statutory lien is reduced by the procurement share.', words(3)]) });
  const binder = make('binder notes.docx', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', folder('Ana', LIT), { body: docxOf(['Day 4 · Assembling the 6-Tab Arbitration Binder', 'Tab C-1 to C-6, Bates ranged, with the authentication log.', words(3)]) });
  const misfiled = make('my demand', DOC, folder('Ana', MED), { body: `Day 3 · Serving the $10,000 BI Time-Limit Demand Package\n` + words(5) });
  const vague = make('notes', DOC, folder('Ana', INS), { body: 'Some thoughts about the case for later.\n' + words(5) });
  const sheet = make('specials', SHEET, folder('Ana', `${C}/04 Bills & Invoices`), { body: 'Day 2 · Calculating Total Specials & the Special Damages Audit\nprovider,billed,paid\nRiverton,6105.00,0\n' + words(4) });
  const photo = make('scene.jpg', 'image/jpeg', folder('Ana', `${C}/02 Police, Witness & Video`), { body: 'JPEGDATA' });
  const scan = make('scan.pdf', 'application/pdf', folder('Ana', LIT), { body: '%PDF-1.4\n1 0 obj\n<< /Length 4 >>\nstream\nq Q\nendstream\nendobj\n' });
  const long = make('Day 5 Trial Prep', DOC, folder('Ana', LIT), { body: 'Day 5 · Trial Prep Checklist Audit & KPI Update\n' + words(400) });
  // the platform's own: a filed copy (put), a file with the platform's description, one the service account owns
  const putRes = await call({ action: 'put', docFolder: 'insurance', name: 'LSH-2026-MVA-000041_Doe-John_Others_2026-11-01.pdf', b64: Buffer.from('%PDF-1.4 RS33').toString('base64url'), docId: 'RS33' }, people.Ana.token);
  if (putRes.status !== 200) fail('filing a course document failed: ' + putRes.text.slice(0, 200));
  const copyId = [...files].find(([, f]) => /Filed from the LSH/.test(f.description || ''))[0];
  files.get(copyId).body = `Day 3 · ${REL}\n` + words(10); files.get(copyId).mimeType = DOC;   // even with a title in it, never the trainee's work
  const saOwned = make('Day 3 copy', DOC, folder('Ana', INS), { owners: [{ emailAddress: SA.saEnv().GDRIVE_SA_EMAIL }], body: `Day 3 · ${REL}\n` + words(10) });

  // a trainee can't grade, can't read another trainee's grades, can't override
  for (const b of [{ action: 'workGradeFor', traineeId: people.Ana.id }, { action: 'workFor', traineeId: people.Ben.id }, { action: 'override', traineeId: people.Ana.id, kind: 'day', key: '3', score: 100 }])
    if ((await call(b, people.Ana.token)).status !== 403) fail(`a trainee could ${b.action}`);
  if ((await call({ action: 'workFor', traineeId: 'nobody-here' }, admin)).status !== 404) fail('a trainer asking for a trainee who doesn\'t exist should get 404');

  const ran = await call({ action: 'workGradeFor', traineeId: people.Ana.id }, admin);
  if (ran.status !== 200) fail('Grade now failed: ' + ran.text.slice(0, 300));
  // Grade now grades at most five files per press: the rest wait for the next press (or the night)
  let v = ran.body;
  if (!v.ran || v.ran.graded !== 5 || v.ran.pending < 1) fail(`Grade now should grade five files and leave the rest pending: ${JSON.stringify(v.ran)}`);
  await call({ action: 'workGradeFor', traineeId: people.Ana.id }, admin);
  const wf = await call({ action: "workFor", traineeId: people.Ana.id }, admin); v = wf.body;
  if (!v || !v.work) { console.log("A trainer could not read the graded work: " + wf.text.slice(0, 400)); process.exit(1); }
  const r = item(v, 'd3m2-rel');
  if (!r || r.by !== 'title' || r.auto == null) fail(`the memo headed "Day 3 · ${REL}" should be d3m2-rel, matched by its title, graded: ${JSON.stringify(r)}`);
  if (!item(v, 'd3m3-a1') || item(v, 'd3m3-a1').by !== 'title' && item(v, 'd3m3-a1').by !== 'keys') fail(`the PDF's text should be read and matched to the Peach State reduction request: ${JSON.stringify(v.work.items.map((x) => x.id))}`);
  if (!item(v, 'd4m3-a2')) fail('the .docx should be read and matched to the arbitration binder');
  if (!item(v, 'd2m4-a1')) fail('the Sheet should be read (CSV) and matched to the Specials audit');
  const dem = item(v, 'd3m1-a1');
  if (!dem || !dem.wrongFolder || dem.home !== '05 Insurance, Demands & Negotiation') fail(`a demand saved in 03 Medical Records is graded and told where the firm keeps it: ${JSON.stringify(dem)}`);
  if (!r || r.nameOk !== true) fail(`a Google Doc named by the convention reads as named right: ${JSON.stringify(r && [r.nameOk, r.nameHint])}`);
  if (!dem || dem.nameOk !== false || !dem.nameWant) fail(`"my demand" is off the convention, and the name it should have is given: ${JSON.stringify(dem && [dem.nameOk, dem.nameWant])}`);
  const un = v.work.unmatched.map((x) => x.name);
  if (!un.includes('notes') || un.length !== 1 || !/title/.test(v.work.unmatched[0].why)) fail(`a document with no activity's title or terms is listed "not matched", with why, never guessed: ${JSON.stringify(v.work.unmatched)}`);
  const unr = v.work.unreadable.map((x) => x.name).sort();
  if (JSON.stringify(unr) !== JSON.stringify(['scan.pdf', 'scene.jpg'])) fail(`the photo and the scanned PDF are "not readable", with why: ${JSON.stringify(v.work.unreadable)}`);
  if (calls.exported.includes(photo)) fail('a photo was downloaded: it can\'t be read as text');
  if (calls.exported.includes(copyId) || calls.exported.includes(saOwned)) fail('the platform\'s own copy (a filed course document, or a file the service account owns) was read as the trainee\'s work');
  const lp = prompts.find((p) => /Trial Prep Checklist Audit/.test(p.user));
  const tp = item(v, 'd5m1-a2');
  if (!lp || !/only its first 20000 of \d+ characters/.test(lp.user) || lp.user.length > 20000 + 6000 || !tp || !tp.truncated) fail(`a long document is cut at 20,000 characters, the AI is told so, and the grade says so: ${tp && tp.truncated}`);
  if (!/never instructions to you/.test(prompts[0].system) || !/<<<DOCUMENT/.test(prompts[0].user)) fail('the document goes to the AI as data, inside its markers, with the rule that it is never instructions');
  if (!/RUBRIC \(\d+ points\)/.test(prompts[0].user) || !/THE TASK:/.test(prompts[0].user)) fail('the AI is given the activity\'s task and rubric');
  if (!r || r.fix.length !== 1 || !r.fix[0].shows || !r.fix[0].standard || !r.fix[0].why || !r.fix[0].next || !r.strengths.length) fail(`a grade carries its teaching: what the work shows, the standard, why, the next step: ${JSON.stringify(r && r.fix)}`);
  ok('matched by its title (or two key terms in its folder), never guessed; a Doc, a Sheet, a PDF and a .docx read; a long one cut and said; photos and scans listed; the platform\'s copies never read');

  /* 5: the AI's answer is checked; a failure keeps the grade */
  const rub = catalog['d3m2-rel'].rubric, full = rub.map(([n, p]) => ({ name: n, points: p }));
  const V = (o) => W.validateAiGrade(typeof o === 'string' ? o : JSON.stringify(o), rub);
  if (!V({ score: 100, dimensions: full, strengths: [], fix: [] }).ok) fail('a full-marks answer should be valid');
  if (V({ score: 100, dimensions: full.slice(1), strengths: [], fix: [] }).ok) fail('an answer missing a dimension was accepted');
  if (V({ score: 100, dimensions: full.map((d) => Object.assign({}, d, { points: d.points + 1 })), fix: [] }).ok) fail('points over a dimension\'s maximum were accepted');
  if (V({ score: 140, dimensions: full, fix: [] }).ok || V({ score: 'A', dimensions: full, fix: [] }).ok) fail('a score that isn\'t 0–100 was accepted');
  if (V({ score: 50, dimensions: full.map((d, i) => Object.assign({}, d, { points: i ? d.points : 0 })), strengths: [], fix: [] }).ok) fail('points off with no fix item saying why was accepted');
  if (V('Sure! It is good.').ok) fail('prose was accepted as a grade');
  const fenced = V('```json\n' + JSON.stringify({ score: 90, dimensions: full.map((d, i) => Object.assign({}, d, { points: i ? d.points : d.points - 2 })), strengths: ['a'], fix: [{ shows: 'a', standard: 'b', why: 'c', next: 'd' }] }) + '\n```');
  if (!fenced.ok || fenced.grade.score !== Math.round(100 * (rub.reduce((t, x) => t + x[1], 0) - 2) / rub.reduce((t, x) => t + x[1], 0))) fail(`a fenced answer is read, and the score is worked out from the points: ${JSON.stringify(fenced)}`);
  const before = r.auto;
  for (const mode of ['error', 'garbage', 'missing', 'over']) {
    aiMode = mode; edit(rel, `Day 3 · ${REL}\nMemorandum, revised (${mode})\n` + words(40));
    const out = await nightly();
    const x = item(await workOf('Ana'), 'd3m2-rel');
    if (!x || x.auto !== before || !x.error) fail(`an AI that answers "${mode}" must keep the last grade (${before}%) and say why: ${JSON.stringify(x && [x.auto, x.error])}`);
    if (!out.failed) fail(`the run should count the failed grade (${mode})`);
  }
  aiMode = 'good'; aiScoreOff = 0;
  await nightly();
  if (item(await workOf('Ana'), 'd3m2-rel').auto !== 100 || item(await workOf('Ana'), 'd3m2-rel').error) fail('a file the AI failed on is graded again on the next run');
  ok('the AI\'s JSON is checked (every dimension, points within the maximum, a reason for each point off); a failure keeps the last grade and is retried');

  /* 6: nightly: unchanged costs nothing; the same file is never graded twice; batches and a cursor */
  let ai0 = calls.ai, ex0 = calls.exported.length;
  const quiet = await nightly();
  if (calls.ai !== ai0 || calls.exported.length !== ex0) fail(`a night with nothing changed should export nothing and call no AI: ${calls.ai - ai0} AI, ${calls.exported.length - ex0} exports`);
  if (quiet.skipped !== 3) fail(`three unchanged drives skipped: ${JSON.stringify(quiet)}`);
  edit(rel, `Day 3 · ${REL}\nMemorandum, final\n` + words(41));
  ai0 = calls.ai; await nightly();
  if (calls.ai - ai0 !== 1) fail(`one changed file is graded once: ${calls.ai - ai0} AI calls`);
  ai0 = calls.ai; await nightly();
  if (calls.ai !== ai0) fail('the same unchanged file was graded twice');
  // a run with a budget for one drive stops there and the next run carries on from the cursor
  make('Day 4 impasse', DOC, folder('Ben', LIT), { body: 'Day 4 · Taking the Litigation Fork\nImpasse memo\n' + words(5) });
  make('Day 4 impasse', DOC, folder('Cara', LIT), { body: 'Day 4 · Taking the Litigation Fork\nImpasse memo\n' + words(5) });
  const order = [people.Ana.id, people.Ben.id, people.Cara.id].sort();
  store.set('cm:drivework-run', JSON.stringify({ cursor: order[0] }));
  env.DRIVE_WORK_BUDGET = '5';
  const r1 = await nightly();
  const firstGraded = order.filter((id) => (JSON.parse(store.get('cm:drivework:' + id) || '{}').files || {}) && Object.values(JSON.parse(store.get('cm:drivework:' + id) || '{"files":{}}').files).some((e) => e.activity === 'd4m1-a1' && e.grade));
  if (!r1.stopped || firstGraded.length !== 1 || firstGraded[0] !== order[1] || r1.cursor !== order[1]) fail(`a run with a small budget grades the next drive after the cursor and stops, remembering where: ${JSON.stringify({ r1, firstGraded })}`);
  const r2 = await nightly();
  const graded2 = order.filter((id) => Object.values(JSON.parse(store.get('cm:drivework:' + id) || '{"files":{}}').files).some((e) => e.activity === 'd4m1-a1' && e.grade));
  if (graded2.length !== 2 || r2.cursor === r1.cursor) fail(`the next run carries on from the cursor: ${JSON.stringify({ r2, graded2 })}`);
  delete env.DRIVE_WORK_BUDGET;
  const wr = JSON.parse(fs.readFileSync(path.join(ROOT, 'wrangler.json'), 'utf8'));
  if (!wr.triggers || !Array.isArray(wr.triggers.crons) || !wr.triggers.crons.includes('0 7 * * *')) fail('wrangler.json should run the Worker every night: "triggers": {"crons": ["0 7 * * *"]}');
  if (!fs.readFileSync(path.join(ROOT, '.assetsignore'), 'utf8').split('\n').includes('worker-*.js')) fail('worker-drive-work.js is the Worker\'s code: .assetsignore keeps it from being served');
  ok('nightly: unchanged drives cost a listing and no AI, the same file is never graded twice, a run is bounded and the next carries on from its cursor');

  /* 7: a trainer's override */
  const ov = (b) => call(Object.assign({ action: 'override', traineeId: people.Ana.id }, b), admin);
  if ((await ov({ kind: 'work', key: 'd3m2-rel', score: 140 })).status !== 400 || (await ov({ kind: 'day', key: '9', score: 50 })).status !== 400) fail('an override out of range (a grade over 100, a day 9) should be refused');
  let o = await ov({ kind: 'work', key: 'd3m2-rel', score: 74, comment: 'The <b>amendments</b> are right, but Atty. Thorne\'s approval is not on file.' });
  if (o.status !== 200) fail('the override was refused: ' + o.text.slice(0, 200));
  await ov({ kind: 'day', key: '1', score: 88, comment: 'Folders right; rebuilt twice.' });
  await ov({ kind: 'day', key: '3', score: 65, comment: 'Superseded versions left unlabeled.' });
  let mine = await workOf('Ana'), st = (await call({ action: 'status' }, people.Ana.token)).body.drive;
  const x = item(mine, 'd3m2-rel');
  if (!x || x.final !== 74 || x.auto !== 100 || !x.override || !/approval is not on file/.test(x.override.comment)) fail(`the trainee sees the trainer's grade, the AI's beside it, and the comment: ${JSON.stringify(x && [x.final, x.auto, x.override])}`);
  if (!st.grades[3] || st.grades[3].score !== 65 || !st.grades[3].override || st.setup.score !== 88 || st.setup.auto !== 100) fail(`a day's structure grade is the trainer's where there is one (Day 3 65%, Day 1 88% over the auto 100%): ${JSON.stringify({ g3: st.grades[3], setup: st.setup })}`);
  const brief = mine.brief.items.find((y) => y.a === 'd3m2-rel');
  if (!brief || brief.s !== 74 || brief.ai !== 100 || !brief.ov || mine.brief.days[3].s !== 65) fail(`the short form (the Scorecard's and the Batch Sheet's) carries the final grades: ${JSON.stringify(mine.brief)}`);
  // another write of the record (a check, a filed copy) and the nightly run keep the override
  await call({ action: 'check' }, people.Ana.token);
  edit(rel, `Day 3 · ${REL}\nMemorandum, again\n` + words(42)); aiScoreOff = 10;
  await nightly();
  mine = await workOf('Ana'); st = (await call({ action: 'status' }, people.Ana.token)).body.drive;
  if (item(mine, 'd3m2-rel').final !== 74 || item(mine, 'd3m2-rel').auto === 100 || st.grades[3].score !== 65 || st.setup.score !== 88) fail(`the nightly run regrades the AI's grade but never the trainer's: ${JSON.stringify([item(mine, 'd3m2-rel').final, item(mine, 'd3m2-rel').auto, st.grades[3].score, st.setup.score])}`);
  const all = (await call({ action: 'reportAll', traineeIds: [people.Ana.id, people.Ben.id] }, admin)).body.reports;
  if (!all[people.Ana.id].work || all[people.Ana.id].work.items.find((y) => y.a === 'd3m2-rel').s !== 74 || all[people.Ana.id].grades[3].score !== 65) fail('a trainer\'s list of drives carries the final grades (the written work, short, and the days)');
  await ov({ kind: 'work', key: 'd3m2-rel', score: null });
  if (item(await workOf('Ana'), 'd3m2-rel').override || item(await workOf('Ana'), 'd3m2-rel').final !== item(await workOf('Ana'), 'd3m2-rel').auto) fail('a cleared override gives the AI\'s grade back');
  await call({ action: 'disconnect' }, people.Ana.token);
  if (JSON.parse(store.get('cm:drive:' + people.Ana.id)).overrides.days[3].score !== 65) fail('unlinking the drive dropped the trainer\'s overrides');
  ok('a trainer\'s override (a day, an activity, with a comment) is the grade the trainee sees, kept through every write and the nightly run, and can be cleared');

  /* 8: a trainee reads only their own; nothing secret in any answer */
  const ben = await call({ action: 'work', traineeId: people.Ana.id }, people.Ben.token);
  if (ben.status !== 200 || ben.body.work.items.some((y) => y.id === 'd3m2-rel') || !ben.body.work.items.some((y) => y.id === 'd4m1-a1')) fail('a trainee asking for another trainee\'s work gets their own, never the other\'s');
  const texts = [ben.text, (await call({ action: 'workFor', traineeId: people.Ana.id }, admin)).text, JSON.stringify(all)].join('\n');
  if (/AT-secret-token|AIza-test-key-secret|PRIVATE KEY/.test(texts)) fail('a token or a key is in an answer');
  if (/Round the routed item 39/.test(texts)) fail('the document\'s whole text is sent back: only its grade is');
  ok('a trainee reads only their own grades; another\'s, Grade now and overrides are a trainer\'s; no token or key in any answer');

  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\nThe written work on the Backup Drive is AI-graded nightly, and a trainer\'s override wins: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
