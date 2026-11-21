// @check node — A Backup Drive grade is the one the trainee earned: a cleared trainer override leaves the Scorecard's copy (and the trainer's page), every tab of a Google Sheet is read, a full stop or comma after a title doesn't stop a match, and half points aren't rounded up row by row
// worker-drive-progress.js, worker-drive-work.js and js/cm-drive-work.js, with an in-memory KV and stubbed Drive:
//   1. A trainer overrides Day 3 (no auto grade) and Day 1 (no setup), then clears both: the trainee's progress copy
//      (drive-grades / drive-setup, what the 🏅 Scorecard and 📋 Batch Sheet read) loses them, and a cleared override on a
//      day with an auto grade goes back to the auto grade with no `override` left on it. The "override" action itself
//      brings the progress copy up to date, set or cleared.
//   2. A Google Sheet is read from its .xlsx, every tab headed by its name (CSV holds the first tab only); if the .xlsx
//      can't be had, the first tab as CSV still is.
//   3. matchWork: an activity's title or key terms followed by "." or "," in ordinary prose still match; "$4,553.73" stays.
//   4. validateAiGrade: 14.5 of 15 on every row is not 100% with no fix item; 12.5 of 15 on four rows is 83%, not 87%.
//   5. The trainer's page (keepBrief): a cleared Day 4 override with no auto grade is gone from state.driveReports, and a
//      cleared Day 1 override no longer labels the auto score as the trainer's.
// Usage: node .github/scripts/drive-work-fair-grades.mjs
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import zlib from 'node:zlib'; import { pathToFileURL } from 'node:url';
const failures = []; const fail = (m) => failures.push(m);
const W = await import(pathToFileURL(path.resolve('worker-drive-work.js')).href);
const { driveToProgress } = await import(pathToFileURL(path.resolve('worker-drive-progress.js')).href);
const store = new Map(), kv = { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => { store.set(k, v); }, delete: async (k) => { store.delete(k); } };
const progress = (id) => JSON.parse(store.get(`progress:${id}`)).data;

/* 1. a cleared override leaves the progress copy (through the "override" action, as a trainer saves and clears) */
{
  const id = 'ana-cruz--b1', base = { rootId: 'R', linkedAt: 'x', grades: { 2: { score: 55, passed: false, at: '2026-11-03T05:00:00Z', rows: [] } } };
  store.set(`trainee:${id}`, '{}');
  store.set(`progress:${id}`, JSON.stringify({ data: { 'day-progress': { 12: {} } } }));
  const D = { json: (b, s) => ({ b, s }), kvOf: () => kv, driveRead: async () => W.withOverrides(JSON.parse(JSON.stringify(base)), await kv.get(W.OV_KEY(id))),
    driveToProgress: (env, who, rec) => driveToProgress(kv, who, rec, W.withDayOverrides, 70), DRIVE_DAY_DOCS: {}, DRIVE_HOMES: {}, driveLinked: () => true, driveConfigured: () => true,
    geminiKeyNames: () => [], gatewayOn: () => false };
  const act = (key, score) => W.driveWorkApi({}, D, { role: 'a' }, { action: 'override', traineeId: id, kind: 'day', key, score, comment: score == null ? '' : 'per review' });
  await act('3', 90); await act('1', 85); await act('2', 80);
  let d = progress(id);
  if (d['drive-grades']?.[3]?.score !== 90 || d['drive-setup']?.score !== 85 || d['drive-grades']?.[2]?.score !== 80) fail(`a trainer's override doesn't reach the progress copy when it is saved: ${JSON.stringify(d)}`);
  await act('3', null); await act('1', null); await act('2', null);
  d = progress(id);
  if (d['drive-grades']?.[3]) fail(`a cleared Day 3 override (no auto grade) still counts on the progress: ${JSON.stringify(d['drive-grades'][3])}`);
  if (d['drive-setup']) fail(`a cleared Day 1 override (no setup) still counts on the progress: ${JSON.stringify(d['drive-setup'])}`);
  if (d['drive-grades']?.[2]?.score !== 55 || d['drive-grades']?.[2]?.override) fail(`a cleared Day 2 override doesn't give way to the auto grade: ${JSON.stringify(d['drive-grades']?.[2])}`);
  if (!d['day-progress']) fail('the rest of the progress was lost');
  // a record from older code: the progress already holds the override copy, the override key is gone; a setup with an auto score
  store.set(`progress:${id}`, JSON.stringify({ data: { 'drive-grades': { 4: { score: 77, passed: true, at: 'x', issues: [], override: { score: 77 } } }, 'drive-setup': { score: 85, ok: true, attempts: 1, override: { score: 85 } } } }));
  await driveToProgress(kv, id, Object.assign({}, base, { setup: { score: 60, ok: false, attempts: 2 } }), W.withDayOverrides, 70);
  d = progress(id);
  if (d['drive-grades']?.[4] || d['drive-setup']?.score !== 60 || d['drive-setup']?.override) fail(`an override copy left by older code isn't put right on the next structure grade: ${JSON.stringify(d)}`);
}

/* 2. every tab of a Google Sheet */
const zip = (entries) => {
  const locals = [], cens = []; let off = 0;
  Object.entries(entries).forEach(([n, text]) => {
    const name = Buffer.from(n), raw = Buffer.from(text), data = zlib.deflateRawSync(raw);
    const l = Buffer.alloc(30); l.writeUInt32LE(0x04034b50, 0); l.writeUInt16LE(20, 4); l.writeUInt16LE(8, 8); l.writeUInt32LE(data.length, 18); l.writeUInt32LE(raw.length, 22); l.writeUInt16LE(name.length, 26);
    const c = Buffer.alloc(46); c.writeUInt32LE(0x02014b50, 0); c.writeUInt16LE(20, 6); c.writeUInt16LE(8, 10); c.writeUInt32LE(data.length, 20); c.writeUInt32LE(raw.length, 24); c.writeUInt16LE(name.length, 28); c.writeUInt32LE(off, 42);
    locals.push(l, name, data); cens.push(c, name); off += 30 + name.length + data.length;
  });
  const cen = Buffer.concat(cens), e = Buffer.alloc(22); e.writeUInt32LE(0x06054b50, 0); e.writeUInt16LE(cens.length / 2, 8); e.writeUInt16LE(cens.length / 2, 10); e.writeUInt32LE(cen.length, 12); e.writeUInt32LE(off, 16);
  return Buffer.concat([...locals, cen, e]);
};
const NS = 'xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"';
const xlsx = zip({
  'xl/workbook.xml': `<workbook ${NS}><sheets><sheet name="Recovery Ledger" sheetId="1" r:id="rId1"/><sheet name="Lien Tracker" sheetId="2" r:id="rId2"/></sheets></workbook>`,
  'xl/_rels/workbook.xml.rels': '<Relationships><Relationship Id="rId1" Type="x" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Type="x" Target="worksheets/sheet2.xml"/></Relationships>',
  'xl/sharedStrings.xml': '<sst><si><t>Stream</t></si><si><t>Net</t></si><si><t>BI, stream 1</t></si><si><r><t>Medicare</t></r><r><t xml:space="preserve"> &amp; Medicaid</t></r></si><si><t>Paid on</t></si></sst>',
  'xl/styles.xml': '<styleSheet><numFmts count="1"><numFmt numFmtId="164" formatCode="mm/dd/yyyy"/></numFmts><cellXfs count="2"><xf numFmtId="0"/><xf numFmtId="164"/></cellXfs></styleSheet>',
  'xl/worksheets/sheet1.xml': `<worksheet ${NS}><sheetData><row r="1"><c r="A1" t="s"><v>0</v></c><c r="B1" t="s"><v>1</v></c></row><row r="2"><c r="A2" t="s"><v>2</v></c><c r="B2"><f>C2-D2</f><v>4553.73</v></c></row></sheetData></worksheet>`,
  'xl/worksheets/sheet2.xml': `<worksheet ${NS}><sheetData><row r="1"><c r="A1" t="s"><v>3</v></c><c r="C1" t="s"><v>4</v></c></row><row r="3"><c r="A3" t="inlineStr"><is><t>Balance zero</t></is></c><c r="B3"><v>1200.5</v></c><c r="C3" s="1"><v>46329</v></c></row></sheetData></worksheet>`,
});
const txt = W.xlsxText ? await W.xlsxText(new Uint8Array(xlsx)) : "(no xlsxText)";
const want = '## Recovery Ledger\nStream,Net\n"BI, stream 1",4553.73\n\n## Lien Tracker\nMedicare & Medicaid,,Paid on\n\nBalance zero,1200.5,2026-11-03';
if (txt !== want) fail(`a Sheet's .xlsx isn't read as every tab, headed by its name:\n${txt}`);
{
  const realFetch = globalThis.fetch, asked = [];
  const sheet = { id: 'S1', name: 'Day 3 Net Sheet', mimeType: 'application/vnd.google-apps.spreadsheet' };
  const D = { saToken: async () => 'tok' };
  const pad = '\nThe lien tracker carries each lienholder, the amount claimed, the reduction asked for and the date it was paid.';
  const bigX = zip(Object.assign({}, Object.fromEntries(['xl/workbook.xml', 'xl/_rels/workbook.xml.rels', 'xl/sharedStrings.xml', 'xl/styles.xml', 'xl/worksheets/sheet1.xml'].map((k) => [k, ''])), {
    'xl/workbook.xml': `<workbook ${NS}><sheets><sheet name="Recovery Ledger" sheetId="1" r:id="rId1"/><sheet name="Lien Tracker" sheetId="2" r:id="rId2"/></sheets></workbook>`,
    'xl/_rels/workbook.xml.rels': '<Relationships><Relationship Id="rId1" Target="worksheets/sheet1.xml"/><Relationship Id="rId2" Target="/xl/worksheets/sheet2.xml"/></Relationships>',
    'xl/worksheets/sheet1.xml': '<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>Stream gross and net for every stream of recovery</t></is></c></row></sheetData></worksheet>',
    'xl/worksheets/sheet2.xml': `<worksheet><sheetData><row r="1"><c r="A1" t="inlineStr"><is><t>LIEN TRACKER${pad}</t></is></c></row></sheetData></worksheet>` }));
  let xlsxOk = true;
  globalThis.fetch = async (u) => { asked.push(String(u)); const url = new URL(String(u));
    if (url.searchParams.get('mimeType') === 'text/csv') return new Response('Stream gross and net for every stream of recovery, first tab only, as CSV');
    return xlsxOk ? new Response(bigX) : new Response('{"error":{"message":"bad export"}}', { status: 400 }); };
  try {
    const r = await W.exportText({}, D, sheet);
    if (!r.text || !/## Lien Tracker\n"?LIEN TRACKER/.test(r.text) || !/## Recovery Ledger/.test(r.text)) fail(`a Google Sheet's second tab isn't read: ${JSON.stringify(r)}`);
    if (asked.length !== 1 || !/mimeType=application%2Fvnd\.openxmlformats-officedocument\.spreadsheetml\.sheet/.test(asked[0])) fail(`a Google Sheet isn't exported once, as .xlsx: ${asked}`);
    xlsxOk = false; asked.length = 0;
    const c = await W.exportText({}, D, sheet);
    if (!c.text || !/first tab only/.test(c.text) || asked.length !== 2) fail(`a Sheet whose .xlsx can't be had isn't read as CSV instead: ${JSON.stringify(c)} ${asked}`);
  } finally { globalThis.fetch = realFetch; }
}

/* 3. a full stop or comma after a title or a key term */
{
  const catalog = W.parseActivities(fs.readFileSync('js/cm-case-flow-data.js', 'utf8'));
  const C = '01 Clients/Doe-John', INS = `${C}/05 Insurance, Demands & Negotiation`, SET = `${C}/07 Wages & Costs`;
  const homes = { insurance: INS, liens: `${C}/06 Liens & Reimbursement`, litigation: `${C}/09 Litigation & ADR`, settlement: SET, medical: `${C}/03 Medical Records`, intake: `${C}/01 Intake & Retainer`, bills: `${C}/04 Bills & Invoices`, property: `${C}/08 Property Damage`, police: `${C}/02 Police, Witness & Video` };
  const M = (name, head, p) => W.matchWork(name, head, p, catalog, homes);
  const a = M('memo', 'Settlement Release Clause Review & Attorney Approval.\nThe release is reviewed.', `${C}/09 Litigation & ADR`);
  if (a.id !== 'd3m2-rel' || a.by !== 'title') fail(`a heading that ends in a full stop doesn't match its title: ${JSON.stringify(a)}`);
  const b = M('memo', 'Notes\nI reviewed the release clause, then the limited release.', INS);
  if (b.id !== 'd3m2-rel') fail(`key terms followed by "," and "." don't match: ${JSON.stringify(b)}`);
  const c = M('memo', 'Notes\nThis is the UM settlement net sheet, stream 2.', SET), c0 = M('memo', 'Notes\nThis is the UM settlement net sheet stream 2 here', SET);
  if (c.id !== c0.id || JSON.stringify(c) !== JSON.stringify(c0)) fail(`a sentence's punctuation changes the match: ${JSON.stringify(c)} vs ${JSON.stringify(c0)}`);
  const n = M('memo', 'Notes\nThe net is $4,553.73. Paid.', SET), n0 = M('memo', 'Notes\nThe net is $4,553.73 Paid', SET);
  if (JSON.stringify(n) !== JSON.stringify(n0)) fail('an amount ending a sentence is read differently from the amount');
}

/* 4. half points */
{
  const rubric = [['Stream arithmetic', 15], ['Lien Tracker', 15], ['Cost verification', 15], ['Disbursement gate', 15]];
  const ans = (p, fix) => JSON.stringify({ score: 80, dimensions: rubric.map(([name]) => ({ name, points: p })), strengths: ['Clear.'], fix: fix ? [{ shows: 'a', standard: 'b', why: 'c', next: 'd' }] : [] });
  const v1 = W.validateAiGrade(ans(14.5, false), rubric);
  if (v1.ok) fail(`half a point off every row with no fix item is taken as ${v1.grade.score}%`);
  const v2 = W.validateAiGrade(ans(12.5, true), rubric);
  if (!v2.ok || v2.grade.score !== 83) fail(`12.5 of 15 on four rows isn't 83%: ${JSON.stringify(v2.grade || v2)}`);
  const v3 = W.validateAiGrade(ans(15, false), rubric);
  if (!v3.ok || v3.grade.score !== 100) fail('full marks with no fix item is no longer 100%');
  const v4 = W.validateAiGrade(ans(12, true), rubric);
  if (!v4.ok || v4.grade.score !== 80 || v4.grade.dims[0].points !== 12) fail(`whole points aren't graded as before: ${JSON.stringify(v4.grade || v4)}`);
}

/* 5. the trainer's page after a clear */
{
  const id = 'ben-ortiz--b1';
  let reply = null;
  const win = { addEventListener() {}, requestAnimationFrame: null }; win.window = win;
  const doc = new Proxy({ readyState: 'loading', addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, head: { appendChild() {} }, body: null,
    createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, classList: { add() {} } }) }, { get: (t, k) => k in t ? t[k] : () => null });
  const state = { isAdmin: true, view: 'scorecard', driveReports: { [id]: { setupScore: 85, grades: { 4: { score: 80, passed: true, override: { score: 80, comment: 'x' } } }, overrides: { days: { 1: { score: 85, comment: 'y' }, 4: { score: 80, comment: 'x' } } } } } };
  const ctx = vm.createContext(Object.assign(win, { console, document: doc, state, localStorage: { getItem: () => null, setItem() {} }, setTimeout, clearTimeout,
    fetch: async () => new Response(JSON.stringify(reply)) }));
  try { vm.runInContext(fs.readFileSync('js/cm-drive-work.js', 'utf8'), ctx, { filename: 'cm-drive-work.js' }); } catch (e) { fail(`js/cm-drive-work.js didn't load: ${e.message}`); }
  const S = (o1, o4) => ({ 1: { auto: 60, final: o1 ? o1.score : 60, override: o1 }, 2: { auto: null, final: null, override: null }, 3: { auto: null, final: null, override: null }, 4: { auto: null, final: o4 ? o4.score : null, override: o4 }, 5: { auto: null, final: null, override: null } });
  const brief = { at: null, n: 0, unmatched: 0, items: [], days: {} };
  const DW = ctx.cmDriveWork;
  if (DW) {
    reply = { work: { items: [] }, brief, structure: S(null, null), saved: { kind: 'day', key: '4', cleared: true } };
    await DW.clear(id, 'day', '4');
    const night = DW.nightlyFor({ rec: { id } }) || {};
    if (night.grades && night.grades[4]) fail(`a cleared Day 4 override with no auto grade still counts on the trainer's page: ${JSON.stringify(night.grades[4])}`);
    if (night.setup && night.setup.override) fail(`a cleared Day 1 override still labels the auto score as the trainer's: ${JSON.stringify(night.setup)}`);
    if (!night.setup || night.setup.score !== 60) fail(`Day 1's auto score isn't the one counted after the clear: ${JSON.stringify(night.setup)}`);
    reply = { work: { items: [] }, brief, structure: S({ score: 90, comment: 'z' }, null), saved: { kind: 'day', key: '1', cleared: false } };
    state.driveReports[id].overrides = null;
    DW.draft(`${id}|day|1`, 'score', '90');
    await DW.save(id, 'day', '1');
    const n2 = DW.nightlyFor({ rec: { id } }) || {};
    if (!n2.setup || n2.setup.score !== 90 || !n2.setup.override) fail(`a Day 1 override just saved isn't the trainer's on the trainer's page: ${JSON.stringify(n2.setup)}`);
  } else fail('window.cmDriveWork is not there');
}

if (failures.length) { console.error('Drive work fair grades check FAILED:\n- ' + failures.join('\n- ')); process.exit(1); }
console.log('Drive work fair grades check passed (a cleared override leaves the progress copy and the trainer\'s page, every tab of a Sheet is read, punctuation after a title or term still matches, half points are not rounded up).');
