// @check node — The Backup Drive's grades reach the Scorecard: the Worker copies each day's grade onto the trainee's progress (a trainee who never reopened their drive still shows it), a page's older save doesn't put an older grade back, and Day 1 built on the Training Portal's Backup Drive counts as the firm's folders
// worker-drive-progress.js (driveToProgress, keepNewerDriveGrades) and js/cm-scorecard.js (📂 Backup Drive's items):
//   1. a drive record with Day 2 and Day 3 grades (and a trainer's override on Day 3) and its Day 1 setup → progress
//      .data["drive-grades"] and ["drive-setup"], in the page's own form; nothing written when nothing changed;
//   2. a page saving a progress copy with an older Day 2 grade: the newer stored one is kept;
//   3. the Scorecard's 📂 Backup Drive: Day 1 from the Portal's "Backup Drive Setup" result when the course has no setup
//      of its own, and that result not counted again under 🧰 Portal Simulators.
// Usage: node .github/scripts/drive-to-progress.mjs
import fs from 'node:fs'; import vm from 'node:vm'; import path from 'node:path'; import { pathToFileURL } from 'node:url';
const failures = []; const fail = (m) => failures.push(m);
const { driveToProgress, keepNewerDriveGrades } = await import(pathToFileURL(path.resolve('worker-drive-progress.js')).href);
const { withDayOverrides } = await import(pathToFileURL(path.resolve('worker-drive-work.js')).href);
const store = new Map(), kv = { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => { store.set(k, v); } };
const id = 'ana-cruz--b103026';
store.set(`progress:${id}`, JSON.stringify({ data: { 'day-progress': { 12: {} } } }));
// (a trainer's override on Day 3 lives in the drive record's overrides, as worker-drive-work.js keeps them)
const rec = { rootId: 'R', linkedAt: 'x', setup: { score: 100, ok: true, attempts: 2, at: '2026-11-02T10:00:00Z' },
  grades: { 2: { score: 85, passed: true, at: '2026-11-03T05:00:00Z', rows: [{ label: 'File names', got: 10, max: 12, notes: ['Rename INTAKE - DMV'] }, { label: 'Documents backed up', got: 20, max: 20, notes: [] }] },
    3: { score: 40, passed: false, at: '2026-11-04T05:00:00Z', rows: [] } } };
// 1.
let wrote = await driveToProgress(kv, id, rec, withDayOverrides, 70);
let p = JSON.parse(store.get(`progress:${id}`)), dg = p.data['drive-grades'] || {}, ds = p.data['drive-setup'] || {};
if (!wrote || dg[2]?.score !== 85 || dg[2]?.passed !== true || dg[2]?.names?.got !== 10 || dg[2]?.issues?.[0] !== 'Rename INTAKE - DMV' || dg[3]?.score !== 40) fail(`the day grades aren't on the progress in the page's form: ${JSON.stringify(dg)}`);
if (ds.score !== 100 || ds.ok !== true || ds.attempts !== 2) fail(`the Day 1 setup isn't on the progress: ${JSON.stringify(ds)}`);
if (!p.data['day-progress']) fail('the rest of the progress was lost');
wrote = await driveToProgress(kv, id, rec, withDayOverrides, 70);
if (wrote) fail('the progress was written again with nothing changed');
if (await driveToProgress(kv, 'nobody', rec, withDayOverrides, 70)) fail('a progress record was made for a trainee with none');
// 2.
const page = { data: { 'day-progress': { 12: {}, 13: {} }, 'drive-grades': { 2: { score: 50, at: '2026-11-01T00:00:00Z' } } } };
const kept = keepNewerDriveGrades(p, page);
if (kept.data['drive-grades'][2].score !== 85 || kept.data['drive-grades'][3]?.score !== 40 || !kept.data['day-progress'][13]) fail(`a page's older save put an older grade back: ${JSON.stringify(kept.data['drive-grades'])}`);
const newer = keepNewerDriveGrades(p, { data: { 'drive-grades': { 2: { score: 90, at: '2026-11-05T00:00:00Z' } } } });
if (newer.data['drive-grades'][2].score !== 90) fail('a newer grade from the page was not kept');
// 3. the Scorecard
const win = { addEventListener() {}, FT_RUBRICS: null }; win.window = win;
const ctx = vm.createContext(Object.assign(win, { console, document: new Proxy({ addEventListener() {}, querySelector: () => null, querySelectorAll: () => [], getElementById: () => null, head: { appendChild() {} }, body: { appendChild() {}, classList: { add() {}, remove() {}, toggle() {} } }, createElement: () => ({ style: {}, setAttribute() {}, appendChild() {}, classList: { add() {} } }) }, { get: (t, k) => k in t ? t[k] : () => null }), state: {}, localStorage: { getItem: () => null, setItem() {} }, setTimeout, clearTimeout }));
try { vm.runInContext(fs.readFileSync('js/cm-scorecard.js', 'utf8'), ctx, { filename: 'cm-scorecard.js' }); } catch (e) { fail(`js/cm-scorecard.js didn't load: ${e.message}`); }
const S = ctx.cmScorecard && ctx.cmScorecard.sources;
if (S) {
  const bd = S.find(x => x.id === 'bd'), other = S.find(x => x.items && /Portal Simulators/.test(x.label || ''));
  const c = { data: {}, sim: { best: { 'Backup Drive Setup': { score: 94, count: 2, at: '2026-11-02T10:00:00Z' }, 'Medical Records Requests': { score: 70, count: 1 } } } };
  const items = bd.items(c);
  if (items.length !== 1 || items[0].pct !== 94 || !/Training Portal/.test(items[0].note)) fail(`📂 Backup Drive doesn't take Day 1 from the Portal's Backup Drive: ${JSON.stringify(items)}`);
  const own = bd.items({ data: { 'drive-setup': { score: 60, ok: false } }, sim: c.sim });
  if (own.length !== 1 || own[0].pct !== 60) fail(`the course's own Day 1 setup isn't the one counted when there is one: ${JSON.stringify(own)}`);
  if (other) { const o = other.items(c).map(x => x.name);
    if (o.includes('Backup Drive Setup') || !o.includes('Medical Records Requests')) fail(`🧰 Portal Simulators still counts the Backup Drive Setup: ${o}`); }
  else fail('no 🧰 Portal Simulators source found');
} else fail('window.cmScorecard.sources is not there');
if (failures.length) { console.error('Drive to progress check FAILED:\n- ' + failures.join('\n- ')); process.exit(1); }
console.log('Drive to progress check passed (each day\'s grade and the Day 1 setup copied onto the progress in the page\'s form, once; a page\'s older save keeps the newer grade; Day 1 from the Portal\'s Backup Drive on the Scorecard, not counted twice).');
