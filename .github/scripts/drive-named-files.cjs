// @check node — A course document on the Backup Drive is known from the drive alone, never from the CMS: by its bytes first (Drive's md5Checksum against the course's own file, over any code in the name; copies anywhere one document; an empty file none), then its code or title, else by the firm's name (<Case ID>_<Last-First>_<Type>_<date>, the CMS's counters too) in its firm folder at any depth, only when its bytes can't be checked, steered by its SUPERSEDED/DRAFT label, the drive packets of the days reached first, the platform's own copies accounted for; a match by Type alone never starts a day, has its name charged, counts in Day 1's filing or hides written work
// worker-drive-found.js applyFound / typeOfName. Before, a file was known only by a code (RS01) or its title in its name,
// so trainees who named their files the way the course teaches (…_Medical-Records_2026-11-16.pdf) had every day after
// Day 1 at 0% on the Backup Drive although the documents were in their folders. The owner: the Backup Drive is graded on
// the drive links, not on the CMS (a separate grader), so nothing here reads the trainee's CMS filing.
// The whole Worker is run too (an in-memory Drive that keeps each file's bytes, the real course documents through ASSETS):
//   (1) a _SUPERSEDED-<date> file is the superseded version (RS26, RS94), an unlabeled one the current (RS73, RS95);
//   (2) Day 1's papers are Day 1's documents (never RS33/RS66/RS41/RS42), and a match by Type alone neither starts a day
//       nor has its name charged; (3) a file with a course document's bytes is that document whatever its name, and seven
//       copies of one file are one document; (4) a document the platform already copied is accounted for; (5) the CMS's
//       counters (2026-11-16-2, _2_DRAFT) are the convention; (6) the files are read in the order they were made;
//       (7) worker.js's naming notes say so; (3) with the course's files read, junk bytes named the firm's way are no
//       document; (3b) the bytes decide over a code, copies with codes are one document, an empty file is none;
//       (8) a trainee on Days 2–5 with every drive packet named the firm's way gets every packet row full; (9) one file
//       in two folders is one document; (10) a Type-only match is still written work; (11) nor counts in Day 1's
//       filing; (12) why a day is ungraded says so; (13) a course file that failed to read is read again later.
// Usage: node .github/scripts/drive-named-files.cjs
'use strict';
const path = require('path');
const { pathToFileURL } = require('url');
const fs = require('fs');
const nodeCrypto = require('crypto');
const SA = require('./drive-sa-fake.cjs');
const ROOT = path.join(__dirname, '../..');

/* ---------- the whole Worker against an in-memory Google Drive that keeps each file's bytes (md5Checksum, size) ---------- */
const FOLDER = SA.FOLDER, PDF = 'application/pdf';
const dfiles = new Map(); let next = 0, clock = Date.parse('2026-11-01T00:00:00Z');
const tick = () => new Date(clock += 60000).toISOString();
const make = (name, parent, body, extra) => { const id = 'gs' + String(++next).padStart(4, '0') + 'Qx'; const at = tick();
    dfiles.set(id, Object.assign({ name, mimeType: body == null ? FOLDER : PDF, parents: parent ? [parent] : [], trashed: false, modifiedTime: at, createdTime: at, body: body == null ? null : Buffer.from(body), owners: [{ emailAddress: 'ana@example.com' }] }, extra || {})); return id; };
const reply = (o, status = 200) => new Response(JSON.stringify(o), { status, headers: { 'Content-Type': 'application/json' } });
const md5 = (b) => nodeCrypto.createHash('md5').update(b).digest('hex');
const realFetch = global.fetch;
global.fetch = async (url, init = {}) => {
    const u = new URL(String(url)), method = init.method || 'GET';
    if (u.href === 'https://oauth2.googleapis.com/token') return reply({ access_token: 'AT', expires_in: 3600 });
    if (u.host !== 'www.googleapis.com') return realFetch(url, init);
    if (u.pathname === '/upload/drive/v3/files') {
        const raw = Buffer.from(init.body), text = raw.toString('latin1'), meta = JSON.parse(text.split('\r\n\r\n')[1].split('\r\n--')[0]);
        const head = text.indexOf('\r\n\r\n', text.indexOf('\r\n\r\n') + 4) + 4, tail = text.lastIndexOf('\r\n--');
        return reply({ id: make(meta.name, meta.parents[0], raw.subarray(head, tail), { description: meta.description || '', owners: [{ emailAddress: SA.saEnv().GDRIVE_SA_EMAIL }] }), webViewLink: 'https://drive/x' });
    }
    if (/\/permissions$/.test(u.pathname)) return reply({ id: 'p' });
    if (u.pathname === '/drive/v3/files' && method === 'POST') { const b = JSON.parse(init.body); return reply({ id: make(b.name, (b.parents || [])[0]) }); }
    if (u.pathname === '/drive/v3/files' && method === 'GET') {
        const match = SA.qMatch(u.searchParams.get('q') || '');
        return reply({ files: [...dfiles].filter(([, f]) => match(f)).map(([id, f]) => Object.assign({ id, name: f.name, mimeType: f.mimeType, parents: f.parents, modifiedTime: f.modifiedTime, createdTime: f.createdTime, owners: f.owners },
            f.body ? { size: String(f.body.length), md5Checksum: md5(f.body) } : {})) });
    }
    const m = u.pathname.match(/^\/drive\/v3\/files\/([^/]+)$/);
    if (m && method === 'DELETE') { dfiles.delete(m[1]); return new Response(null, { status: 204 }); }
    if (m) { const f = dfiles.get(m[1]); return f ? reply(SA.fileMeta(m[1], f)) : reply({ error: { message: 'File not found' } }, 404); }
    return reply({ error: { message: 'not in this test: ' + u.pathname } }, 500);
};
/* the course's own files, as the Worker's ASSETS serves them (from this checkout) */
// (docsOn false: the course's documents can't be read, so nothing is known by its bytes and a file named the firm's way is read by its Type)
let docsOn = true;
const ASSETS = { fetch: async (req) => { const p = path.join(ROOT, decodeURIComponent(new URL(req.url).pathname)); if (!docsOn && /\/documents\//.test(p)) return new Response('Not found', { status: 404 }); return fs.existsSync(p) ? new Response(fs.readFileSync(p)) : new Response('Not found', { status: 404 }); } };
const DOC_SRC = fs.readFileSync(path.join(ROOT, 'js/cm-case-flow-docs.js'), 'utf8');
const docBytes = (id) => fs.readFileSync(path.join(ROOT, 'documents', new RegExp(`\\{id:"${id}",\\s*folder:"[a-z]+",\\s*file:"([^"]+)"`).exec(DOC_SRC)[1]));

async function endToEnd(M, fail) {
    const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
    const store = new Map();
    const kv = { get: async (k) => (store.has(k) ? store.get(k) : null), put: async (k, v) => { store.set(k, v); }, delete: async (k) => { store.delete(k); },
        list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter((k) => k.startsWith(prefix)).sort().map((name) => ({ name })), list_complete: true }) };
    const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off', LSH_KV: kv, ASSETS, ...SA.saEnv() };
    const call = async (body, token) => { const res = await worker.fetch(new Request('http://x/api/drive', { method: 'POST', headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + token }, body: JSON.stringify(body) }), env, { waitUntil() {} }); const text = await res.text(); let j = null; try { j = JSON.parse(text); } catch (e) {} return { status: res.status, body: j, text }; };
    const auth = async (b) => (await (await worker.fetch(new Request('http://x/api/auth/trainee', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }), env, { waitUntil() {} })).json());
    // the course's documents through ASSETS, as the Worker reads them (courseDocs), from js/cm-case-flow-docs.js itself
    M._resetDocs();
    const docs = await M.courseDocs({ ASSETS }, {});
    if (Object.keys(docs).length < 90 || !docs.RS51 || !/^case-flow\/litigation\//.test(docs.RS51.file)) { fail(`the course's documents should be read from js/cm-case-flow-docs.js, with their files: ${Object.keys(docs).length}`); }
    // (3) the course's files can't be read (no ASSETS), or this runtime has no MD5: nothing breaks, nothing is matched by content
    if (!M.courseHashes) fail('(3) worker-drive-found.js should hash the course\'s own files (courseHashes)');
    else if (Object.keys(await M.courseHashes({}, {}, docs)).length) fail('(3) with no course files to read there should be no content hashes');
    M._resetDocs();
    // Workers' crypto.subtle.digest knows "MD5"; Node's doesn't, so it is given here
    const sub = globalThis.crypto.subtle, digest = sub.digest.bind(sub);
    sub.digest = async (alg, data) => (String((alg && alg.name) || alg).toUpperCase() === 'MD5'
        ? (() => { const b = nodeCrypto.createHash('md5').update(Buffer.from(data.buffer ? new Uint8Array(data.buffer, data.byteOffset, data.byteLength) : new Uint8Array(data))).digest(); return b.buffer.slice(b.byteOffset, b.byteOffset + b.length); })()
        : digest(alg, data));
    /* 13: one course file that couldn't be read is tried again (after HASH_RETRY_MS), never left unknown for the life of the Worker */
    {
        M._resetDocs();
        const docs13 = await M.courseDocs({ ASSETS }, {});
        let flaky = true;
        const FL = { fetch: async (req) => { if (flaky && /RS_51_/.test(decodeURIComponent(new URL(req.url).pathname))) throw new Error('a transient asset error'); return ASSETS.fetch(req); } };
        const want = md5(docBytes('RS51')), now = Date.now, t0 = now();
        const first = await M.courseHashes({ ASSETS: FL }, {}, docs13);
        flaky = false;
        Date.now = () => t0 + 11 * 60 * 1000;
        let again;
        try { again = await M.courseHashes({ ASSETS: FL }, {}, docs13); } finally { Date.now = now; }
        if (first[want]) fail('(13) the Complaint\'s file failed to read, so it should not be known yet');
        if (!(again[want] || []).includes('RS51')) fail('(13) once the asset reads again, the Complaint should be known by its bytes: a partial reading is retried');
        if (Object.values(again).flat().length !== Object.values(first).flat().length + 1) fail('(13) the retry should add the one document that was missing, and keep the rest');
        M._resetDocs();
    }
    let n = 0;
    const readable = (on) => { docsOn = on; M._resetDocs(); };
    // `reached`: the Case Flow days the trainee's progress has reached (day-progress); `build` false: the firm's folders made by hand
    const trainee = async (reached = [], build = true) => {
        const a = await auth({ name: `Ana Cruz${'z'.repeat(++n)}`, batch: 'B100926' }), t = a.token, tid = a.id;
        store.set('cm:trainee:' + tid, JSON.stringify({ id: tid, name: 'Ana Cruz', batch: 'B100926', approved: true }));
        if (reached.length) store.set('cm:progress:' + tid, JSON.stringify({ data: { 'day-progress': Object.fromEntries(reached.map((d) => [10 + d, { done: true }])) } }));
        const root = make('LSH Case Backups', '');
        await call({ action: 'link', url: SA.folderUrl(root) }, t);
        const std = (await call({ action: 'status' }, t)).body.drive.standard;
        const hand = {};
        if (build) {
            const built = await call({ action: 'setup', layout: std }, t);
            if (!built.body || !built.body.built) throw new Error('Could not build the drive: ' + built.text.slice(0, 300));
        } else std.forEach((p) => { const up = p.includes('/') ? p.slice(0, p.lastIndexOf('/')) : ''; hand[p] = make(p.split('/').pop(), up ? hand[up] : root); });
        const rec = () => JSON.parse(store.get('cm:drive:' + tid));
        const C = '01 Clients/Doe-John', dir = (k) => (build ? rec().folders : hand)[`${C}/${k}`];
        const grade = async () => (await call({ action: 'grade', filed: [] }, t)).body;
        const by = () => { const o = {}; (rec().handFiled || []).forEach((h) => { o[h.id] = h; }); return o; };
        return { t, tid, rec, dir, grade, by };
    };
    const row = (g, n, label) => ((g && g.grades && g.grades[n] && g.grades[n].rows) || []).find((r) => r.label === label);
    const CN = (type, date, label) => `LSH-2026-MVA-000041_Doe-John_${type}_${date}${label ? '_' + label : ''}.pdf`;
    const BILLS = '04 Bills & Invoices', INS = '05 Insurance, Demands & Negotiation', LIENS = '06 Liens & Reimbursement', WAGES = '07 Wages & Costs', MED = '03 Medical Records', LIT = '09 Litigation & ADR';

    /* 1: a SUPERSEDED or DRAFT label steers which version a convention file is; an unlabeled one is the current version
       (1, 2, 4, 5, 8: the course's own files can't be read, so no file is known by its bytes and a name is read by its Type) */
    readable(false);
    {
        const T = await trainee();
        ['RS22', 'RS23', 'RS24', 'RS98'].forEach((d) => make(`${d} bill.pdf`, T.dir(BILLS), 'bill ' + d));
        make('RS64 wage record.pdf', T.dir(WAGES), 'wage RS64');
        const cur = make(CN('Bills', '2026-07-10'), T.dir(BILLS), 'crescent current');                                  // made first, the lower Drive id
        const old = make(CN('Bills', '2026-07-01', 'SUPERSEDED-2026-07-10'), T.dir(BILLS), 'crescent old');
        const fin = make(CN('Case-Files', '2026-07-01'), T.dir(WAGES), 'wage final');
        const ws = make(CN('Case-Files', '2026-06-23', 'SUPERSEDED-2026-07-01'), T.dir(WAGES), 'wage worksheet');
        await T.grade();
        const h = T.by(), id = (x) => (h[x] || {}).docId;
        if (id(old) !== 'RS26' || id(cur) !== 'RS73') fail(`(1) in 04 the _SUPERSEDED Bills file should be Crescent's 07/01 statement (RS26) and the unlabeled one the corrected statement (RS73): ${id(old)}, ${id(cur)}`);
        if (id(ws) !== 'RS94' || id(fin) !== 'RS95') fail(`(1) in 07 the _SUPERSEDED Case-Files file should be the 06/23 worksheet (RS94) and the unlabeled one the final record (RS95): ${id(ws)}, ${id(fin)}`);
    }

    /* 2: Day 1's papers named the firm's way are Day 1's documents, never a later day's; a match by Type alone never starts a day nor has its name charged */
    {
        const T = await trainee();
        const i1 = make(CN('Others', '2026-11-02'), T.dir(INS), 'ins one'), i2 = make(CN('Others', '2026-11-03'), T.dir(INS), 'ins two');
        const l1 = make(CN('Others', '2026-11-02'), T.dir(LIENS), 'lien one'), l2 = make(CN('Others', '2026-11-03'), T.dir(LIENS), 'lien two');
        const inv = make('LSH-2026-MVA-000041_Doe-John_Invoices_2026-11-02.PDF', T.dir(BILLS), 'summit invoice');      // only RS25 is an invoice: a graded Day 2 document
        const g = await T.grade();
        const h = T.by(), id = (x) => (h[x] || {}).docId;
        const late = [i1, i2, l1, l2].map(id).filter((d) => ['RS33', 'RS66', 'RS41', 'RS42'].includes(d));
        if (late.length) fail(`(2) Day 1's papers named the firm's way should be Day 1's documents, not ${late.join(', ')}: ${[i1, i2, l1, l2].map(id)}`);
        if ([i1, i2, l1, l2].map(id).join() !== 'RS28,RS29,RS40,RS90') fail(`(2) the earliest-opened documents should be accounted for first: ${[i1, i2, l1, l2].map(id)}`);
        if (id(inv) !== 'RS25' || (h[inv] || {}).by !== 'type') fail(`(2) the Invoices file in 04 should be read as Summit's invoice, by its Type only: ${JSON.stringify(h[inv])}`);
        const started = Object.keys((g && g.grades) || {});
        if (started.length) fail(`(2) a document known by its Type and folder alone should not start a day: Day ${started.join(', ')} graded`);
        const listed = ((T.rec().naming || {}).list || []).find((x) => /_Invoices_2026-11-02\.PDF$/.test(x.name));
        if (!listed || listed.scored !== false) fail(`(2) the name of a document known by its Type alone should be listed, never charged: ${JSON.stringify(listed)}`);
    }

    /* 3: a file is known by its bytes, from the drive alone; copies of one file are one document; with the course's files
       read, a file whose bytes are none of them is no course document, whatever it is called (finding: 15 junk files
       named the firm's way filled Day 5's litigation file) */
    readable(true);
    {
        const T = await trainee();
        const scan = make('scan0001.pdf', T.dir(LIT), docBytes('RS51'));                                                 // the Complaint, named nothing of the course's
        const a53 = [1, 2, 3].map((k) => make(CN('Litigation-Documents', `2026-11-0${k}`), T.dir(LIT), docBytes('RS53')));
        const same = [1, 2, 3, 4, 5, 6, 7].map((k) => make(CN('Litigation-Documents', `2026-11-1${k}`), T.dir(LIT), 'one pleading, seven copies'));
        const g = await T.grade();
        const h = T.by();
        if ((h[scan] || {}).docId !== 'RS51' || h[scan].by !== 'content') fail(`(3) a file with the course's own Complaint's bytes should be the Complaint (RS51), by its content: ${JSON.stringify(h[scan])}`);
        if (a53.some((x) => (h[x] || {}).docId !== 'RS53' || h[x].by !== 'content')) fail(`(3) three copies of the Answer's bytes should each be the Answer (RS53): ${a53.map((x) => JSON.stringify(h[x]))}`);
        const junk = same.filter((x) => h[x]).map((x) => h[x].docId);
        if (junk.length) fail(`(3) with the course's files read, files whose bytes are none of them are no course document, whatever their name: ${junk}`);
        if (!(g && g.grades && g.grades[5])) fail('(3) a document known by its content (the Complaint) is certain, and starts Day 5');
        const lit = row(g, 5, 'Litigation file backed up');
        if (!lit || lit.got !== Math.floor(16 * 2 / 7)) fail(`(3) only the Complaint and the Answer are on the drive: ${JSON.stringify(lit && { got: lit.got, max: lit.max })}`);
        const many = Array.from({ length: 15 }, (_, k) => make(CN('Litigation-Documents', `2026-11-${10 + k}`), T.dir(LIT), 'junk ' + k));   // one byte apart each: no checksum collapses them
        const g2 = await T.grade(), h2 = T.by();
        if (many.some((x) => h2[x]) || (row(g2, 5, 'Litigation file backed up') || {}).got !== lit.got) fail(`(3) fifteen different files named the firm's way, none the course's bytes, should earn nothing: ${many.filter((x) => h2[x]).map((x) => h2[x].docId)}`);
    }

    /* 3b: renamed copies of one course file are that one file's document, whatever code each name carries; copies of one
       file with codes in their names are one document; an empty file is no document */
    {
        const T = await trainee();
        const codes = ['RS51', 'RS52', 'RS53', 'RS56', 'RS60', 'RS49', 'RS50'];
        const ren = codes.map((c) => make(`${c} pleading.pdf`, T.dir(LIT), docBytes('RS51')));
        const twin = ['RS55', 'RS59'].map((c) => make(`${c} order.pdf`, T.dir(LIT), 'one order, two names'));
        const empty = ['RS69', 'RS70', 'RS44'].map((c) => make(`${c}.pdf`, T.dir(c === 'RS44' ? WAGES : LIT), ''));
        const g = await T.grade(), h = T.by();
        const ids = ren.map((x) => (h[x] || {}).docId);
        if (ids.some((d) => d !== 'RS51')) fail(`(3b) seven renamed copies of the Complaint's bytes should all be the Complaint (RS51), never the code each name carries: ${ids}`);
        const tw = [...new Set(twin.map((x) => (h[x] || {}).docId))];
        if (tw.length !== 1 || tw[0] !== 'RS55') fail(`(3b) two files of the same bytes named RS55 and RS59 should be one document (RS55): ${tw}`);
        if (empty.some((x) => h[x])) fail(`(3b) an empty file is no document, whatever its name: ${empty.filter((x) => h[x]).map((x) => h[x].docId)}`);
        if (g && g.grades && g.grades[4]) fail('(3b) an empty RS44.pdf should not start Day 4');
        const lit = row(g, 5, 'Litigation file backed up');
        if (!lit || lit.got !== Math.floor(16 * 2 / 7)) fail(`(3b) only the Complaint and one order are in 09: ${JSON.stringify(lit && { got: lit.got, max: lit.max })}`);
    }
    {
        const T = await trainee();
        ['RS51', 'RS52', 'RS53'].map((c) => make(`${c}.pdf`, T.dir(LIT), ''));
        const g = await T.grade();
        if (g && g.grades && g.grades[5]) fail('(3b) empty files named RS51, RS52 and RS53 should not start Day 5');
    }
    readable(false);

    /* 4: a document the platform already copied there is accounted for: a hand file is the next one */
    {
        const T = await trainee();
        const r = await call({ action: 'put', docFolder: 'medical', name: CN('Medical-Records', '2026-11-02'), b64: Buffer.from('%PDF-1.4 platform RS12').toString('base64url'), docId: 'RS12' }, T.t);
        if (r.status !== 200) fail(`(4) the platform's copy of RS12 couldn't be filed: ${r.text.slice(0, 200)}`);
        const hand = make(CN('Medical-Records', '2026-11-03'), T.dir(MED), 'a hand upload');
        await T.grade();
        if ((T.by()[hand] || {}).docId !== 'RS13') fail(`(4) with RS12 already copied by the platform, a Medical-Records file filed by hand should be RS13: ${JSON.stringify(T.by()[hand])}`);
    }

    /* 5: the CMS's counter names (-2 on the date, _2 after it before a label) are the firm's names */
    {
        const T = await trainee();
        const c1 = make('LSH-2026-MVA-000041_Doe-John_Medical-Records_2026-11-16-2.pdf', T.dir(MED), 'counter one');
        const c2 = make('LSH-2026-MVA-000041_Doe-John_Others_2026-11-16_2_DRAFT.pdf', T.dir(INS), 'counter two');
        await T.grade();
        const h = T.by();
        if (!h[c1] || docs[h[c1].docId].folder !== 'medical') fail(`(5) a CMS counter on the date (2026-11-16-2) is the convention: ${JSON.stringify(h[c1])}`);
        if ((h[c2] || {}).docId !== 'RS33') fail(`(5) a CMS counter after the date before _DRAFT is the convention, and the draft is the draft demand (RS33): ${JSON.stringify(h[c2])}`);
    }

    /* 8: a trainee who has reached Days 2–5 backs up every drive packet's document, named the firm's way: each file is its
       packet document (never an earlier-opened one the course never asks to back up), and every packet row is full */
    {
        const T = await trainee([2, 3, 4, 5]);
        const PACK = { 1: ['RS05', 'RS07', 'RS06'], 2: ['RS12', 'RS13', 'RS15', 'RS25'], 3: ['RS72', 'RS16', 'RS73', 'RS26', 'RS95', 'RS94', 'RS33', 'RS66'], 4: ['RS41', 'RS42', 'RS84', 'RS85', 'RS86', 'RS44', 'RS74'], 5: ['RS51', 'RS52', 'RS53', 'RS55', 'RS59', 'RS69', 'RS70'] };
        const LONG = { Medical: 'Medical Records', Police: 'Police Report', PD: 'Property Damage', Litigation: 'Litigation Documents', Intake: 'Intake Documents' };
        const HOME = { intake: '01 Intake & Retainer', police: '02 Police, Witness & Video', medical: MED, bills: BILLS, insurance: INS, liens: LIENS, settlement: WAGES, property: '08 Property Damage', litigation: LIT };
        const fileOf = {};
        for (const n of [1, 2, 3, 4, 5]) for (const d of PACK[n]) {
            const label = d === 'RS33' || d === 'RS66' ? 'DRAFT' : d === 'RS26' || d === 'RS94' ? `SUPERSEDED-2026-11-1${n}` : '';
            fileOf[d] = make(CN((LONG[docs[d].cms] || docs[d].cms).replace(/[^A-Za-z0-9]+/g, '-'), `2026-11-1${n}`, label), T.dir(HOME[docs[d].folder]), 'a scan of ' + d);
        }
        const g = await T.grade(), h = T.by();
        const wrong = Object.entries(fileOf).filter(([d, x]) => (h[x] || {}).docId !== d).map(([d, x]) => `${d}→${(h[x] || {}).docId}`);
        if (wrong.length) fail(`(8) each drive packet file named the firm's way should be its packet document: ${wrong.join(' ')}`);
        [[2, 'Documents backed up'], [3, 'Superseded versions'], [4, 'Papers backed up'], [5, 'Litigation file backed up']].forEach(([n, label]) => {
            const r = row(g, n, label);
            if (!r || r.got !== r.max) fail(`(8) Day ${n} "${label}" should be full with every packet document in its folder: ${JSON.stringify(r && { got: r.got, max: r.max, notes: r.notes })}`);
        });
    }

    /* 9: one file copied into two firm folders is one document (the same bytes anywhere in the drive) */
    {
        const T = await trainee();
        const a = make(CN('Others', '2026-11-02'), T.dir(INS), 'one letter'), b = make(CN('Others', '2026-11-02'), T.dir(LIENS), 'one letter');
        await T.grade();
        const h = T.by();
        if (!h[a] || !h[b] || h[a].docId !== h[b].docId) fail(`(9) one file in 05 and 06 should be one document: ${(h[a] || {}).docId}, ${(h[b] || {}).docId}`);
    }

    /* 10: a convention-named file of the trainee's own written work known only by its Type is still read as written work */
    {
        const T = await trainee();
        const text = 'Time-Limited Demand. BI demand package with proof of delivery to the carrier.';
        const conv = make(CN('Others', '2026-11-20').replace(/\.pdf$/, '.txt'), T.dir(INS), text, { mimeType: 'text/plain' });
        await T.grade();
        if ((T.by()[conv] || {}).by !== 'type') fail(`(10) the convention-named text file in 05 should be read by its Type here: ${JSON.stringify(T.by()[conv])}`);
        // (the nightly run works through every trainee within a budget, on from where it stopped: run it until it reaches this one)
        for (let k = 0; k < 12 && !store.get('cm:drivework:' + T.tid); k++) await worker.scheduled({}, env, { waitUntil() {} });
        const W = JSON.parse(store.get('cm:drivework:' + T.tid) || 'null');
        if (!(W && W.files && W.files[conv])) fail('(10) a file known only by its Type and folder should still reach the written-work grader');
    }

    /* 11: Day 1 graded from a structure made by hand: a match by Type alone adds nothing to the filing and has no name charged */
    {
        const T = await trainee([], false);
        make('LSH-2026-MVA-000041_Doe-John_others_2026-10-05.pdf', T.dir(INS), 'any paper at all');
        await T.grade();
        const r = T.rec(), fs1 = r.foundSetup || {};
        if (!(r.handFiled || []).some((x) => x.by === 'type')) fail(`(11) the convention-named file should be read by its Type: ${JSON.stringify(r.handFiled)}`);
        if ((fs1.filing || []).length || (fs1.problems || []).some((p) => /🏷/.test(p))) fail(`(11) Day 1's filing should not count a match by Type alone, nor charge its name: ${JSON.stringify({ filing: fs1.filing, problems: fs1.problems })}`);
    }

    /* 12: why a day has no grade says when its only files are known by their Type alone */
    {
        const T = await trainee();
        make('LSH-2026-MVA-000041_Doe-John_Invoices_2026-11-02.pdf', T.dir(BILLS), 'summit invoice');
        await T.grade();
        const why = M.whyUngraded(2, T.rec(), { 2: ['RS12', 'RS13', 'RS15', 'RS25'] });
        if (!/Type and folder alone/.test(why) || /none of its documents/.test(why)) fail(`(12) Day 2's reason should say its only file (RS25) is known by its Type alone: ${why}`);
    }
    readable(true);
    sub.digest = digest;
}

(async () => {
    const M = await import(pathToFileURL(path.join(__dirname, '../../worker-drive-found.js')).href);
    const fails = [], fail = (m) => fails.push(m);
    const HOMES = { medical: '01 Clients/Doe-John/03 Medical Records', bills: '01 Clients/Doe-John/04 Bills & Invoices', liens: '01 Clients/Doe-John/06 Liens & Settlement' };
    const docs = {
        RS12: { folder: 'medical', title: 'Riverton Urgent Care Visit Note', cms: 'Medical' },
        RS13: { folder: 'medical', title: 'Riverton Spine and Rehab Evaluation', cms: 'Medical' },
        RS15: { folder: 'medical', title: 'Lakeside Orthopedics Consult', cms: 'Medical' },
        RS16: { folder: 'medical', title: 'Cervical MRI Report', cms: 'Medical' },
        RS25: { folder: 'bills', title: 'Summit Imaging Invoice', cms: 'Invoices' },
        RS41: { folder: 'liens', title: 'Peach State Reduction Acceptance', cms: 'Others' },
        RS42: { folder: 'liens', title: 'Riverton Spine Payoff Letter', cms: 'Others' }
    };
    let kvRead = 0;
    const D = { DRIVE_HOMES: HOMES, FOLDER_STANDARD: [], CLIENT_FOLDER: '01 Clients/Doe-John', DRIVE_DAY_DOCS: { 2: ['RS12', 'RS13', 'RS15', 'RS25'], 3: ['RS16'], 4: ['RS41', 'RS42'] },
        fileType: (t) => String(t || '').trim().replace(/[^A-Za-z0-9]+/g, '-').replace(/^-+|-+$/g, ''),   // worker.js fileType
        kvOf: () => ({ get: async () => { kvRead++; return null; } }) };

    if (M.typeOfName('LSH-2026-MVA-000098_Doe-John_Medical-Records_2026-11-16.pdf.pdf') !== 'medicalrecords') fail('the Type should be read from a convention name, ".pdf.pdf" too');
    if (M.typeOfName('visit note final.pdf') !== '') fail('a name outside the convention has no Type');
    if (M.typeOfName('A_B_Others_16-11-2026.pdf') !== '') fail('a date not written year first is not the convention');

    const FOLDERS = { fMed: { name: '03 Medical Records', parent: 'root' }, fBill: { name: '04 Bills & Invoices', parent: 'root' }, fLien: { name: '06 Liens & Settlement', parent: 'root' },
        fDay: { name: 'Day 2', parent: 'fMed' }, fDr: { name: 'Drafts', parent: 'fDay' }, fScr: { name: 'Scratch', parent: 'root' } };
    const rec = { builtAt: '2026-11-12', rootId: 'root', folders: { [HOMES.medical]: 'fMed', [HOMES.bills]: 'fBill', [HOMES.liens]: 'fLien' } };
    const N = (t, d) => `LSH-2026-MVA-000098_Doe-John_${t}_${d}.pdf`;
    const listing = { folders: FOLDERS, files: {
        a1: { name: N('Medical-Records', '2026-11-16'), parent: 'fMed', mimeType: 'application/pdf' },
        a2: { name: N('Medical-Records', '2026-11-16') + '.pdf', parent: 'fMed', mimeType: 'application/pdf' },
        a3: { name: N('medical-records', '2026-11-17'), parent: 'fDr', mimeType: 'application/pdf' },      // two folders down 03
        a4: { name: 'LSH-2026-MVA-000098_Doe-John_RS15-Lakeside-Consult_2026-11-12.pdf', parent: 'fBill', mimeType: 'application/pdf' },   // a code: RS15, in the wrong folder
        a5: { name: N('Invoices', '2026-11-16'), parent: 'fBill', mimeType: 'application/pdf' },
        a6: { name: N('Others', '2026-11-18'), parent: 'fMed', mimeType: 'application/pdf' },             // Others in 03: no Others belongs there
        a7: { name: N('Medical-Records', '2026-11-18'), parent: 'fScr', mimeType: 'application/pdf' },    // outside the firm's folders
        a8: { name: N('Others', '2026-11-19'), parent: 'fLien', mimeType: 'application/pdf' },
        a9: { name: 'notes', parent: 'fMed', mimeType: 'application/vnd.google-apps.document' }
    } };
    M.applyFound(rec, listing, docs, D);
    const got = Object.fromEntries((rec.handFiled || []).map((h) => [h.id, h.docId]));
    if (got.a4 !== 'RS15') fail(`a code in the name should still win, wherever it is: ${JSON.stringify(got)}`);
    const med = [got.a1, got.a2, got.a3].sort().join();
    if (med !== 'RS12,RS13,RS16') fail(`three Medical-Records files in 03 (one two folders down) should be three medical documents, never the one a code already took (RS15): ${med}`);
    if (got.a1 !== 'RS12' || got.a2 !== 'RS13') fail(`the earliest graded day's documents should be accounted for first, one file each: ${JSON.stringify(got)}`);
    if (got.a5 !== 'RS25') fail(`an Invoices file in 04 should be the invoice: ${JSON.stringify(got)}`);
    if (got.a6) fail(`a convention name in a folder no document of its Type belongs in should not be guessed at: ${got.a6}`);
    if (got.a7) fail(`a file outside the firm's folders should not be guessed at: ${got.a7}`);
    if (got.a8 !== 'RS41') fail(`an Others file in 06 should be the first lien document: ${JSON.stringify(got)}`);
    if (got.a9) fail('a Google Doc is written work, never a course document');
    const deep = (rec.handFiled || []).find((h) => h.id === 'a3');
    if (!deep || deep.path !== HOMES.medical || deep.home !== HOMES.medical) fail(`the file two folders down 03 should be read in 03, its home: ${JSON.stringify(deep)}`);
    const wrong = (rec.handFiled || []).find((h) => h.id === 'a4');
    if (!wrong || wrong.path !== HOMES.bills || wrong.home !== HOMES.medical) fail(`the coded file in 04 should be read in 04, its home 03 (the wrong-folder note): ${JSON.stringify(wrong)}`);

    // the platform's own copies are never the trainee's filing
    const rec2 = { builtAt: '2026-11-12', rootId: 'root', folders: rec.folders, saved: [{ id: 'p1', docId: 'RS12' }] };
    M.applyFound(rec2, { folders: FOLDERS, files: { p1: { name: N('Medical-Records', '2026-11-12'), parent: 'fMed', mimeType: 'application/pdf' } } }, docs, D);
    if ((rec2.handFiled || []).length) fail(`the platform's own copy should not be counted as filed by hand: ${JSON.stringify(rec2.handFiled)}`);

    // the drive alone: nothing reads the trainee's records (the CMS is a separate grader)
    const listed = { folders: FOLDERS, files: { z1: { name: N('Invoices', '2026-11-16'), parent: 'fBill', mimeType: 'application/pdf' } } };
    const rec3 = { builtAt: '2026-11-12', rootId: 'root', folders: rec.folders };
    await M.driveFind({}, Object.assign({}, D, { DRIVE_DOC: { RS25: ['bills', 'Summit Imaging Invoice', 'Invoices'] }, driveList: async () => listed }), 't1', rec3);
    if (kvRead) fail(`grading the drive read ${kvRead} stored record(s): the Backup Drive is graded from the drive alone`);
    if (((rec3.handFiled || [])[0] || {}).docId !== 'RS25') fail(`driveFind should recognise the convention-named invoice: ${JSON.stringify(rec3.handFiled)}`);

    // 6. the files in the order they were made (then the date in the name, then the Drive id), never in the Drive id's order alone
    const rec6 = { builtAt: '2026-11-12', rootId: 'root', folders: rec.folders };
    M.applyFound(rec6, { folders: FOLDERS, files: {
        b1: { name: N('Medical-Records', '2026-11-18'), parent: 'fMed', mimeType: 'application/pdf', created: '2026-11-18T10:00:00Z' },
        b2: { name: N('Medical-Records', '2026-11-16'), parent: 'fMed', mimeType: 'application/pdf', created: '2026-11-16T10:00:00Z' },
        b3: { name: N('Medical-Records', '2026-11-17'), parent: 'fMed', mimeType: 'application/pdf' },
        b4: { name: N('Medical-Records', '2026-11-15'), parent: 'fMed', mimeType: 'application/pdf' } } }, docs, D);
    const got6 = Object.fromEntries((rec6.handFiled || []).map((h) => [h.id, h.docId]));
    if (got6.b4 !== 'RS12' || got6.b3 !== 'RS13' || got6.b2 !== 'RS15' || got6.b1 !== 'RS16') fail(`(6) convention files are matched in the order they were made, then the date in their name, never by Drive id: ${JSON.stringify(got6)}`);

    // 7. worker.js says what a file filed by hand is known by, and what isn't charged
    const wsrc = fs.readFileSync(path.join(ROOT, 'worker.js'), 'utf8');
    if (!/its bytes the course's own file/.test(wsrc) || !/`by: "type"`\) is listed, never charged, and never starts a day/.test(wsrc)) fail('(7) worker.js\'s naming notes should say a hand-filed document is known by its code, title or bytes, and one known by its Type only is never charged');

    await endToEnd(M, fail);

    if (fails.length) { console.log(`✗ Backup Drive files known by the firm's names (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
    console.log('Backup Drive: a document backed up under the firm\'s name is known from the drive alone, by its Type and its firm folder at any depth, one file each; a code still wins, its bytes are as certain, a label steers the version, earlier days come first, copies are one document, and a match by Type alone is never charged nor starts a day. Nothing reads the CMS.');
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
