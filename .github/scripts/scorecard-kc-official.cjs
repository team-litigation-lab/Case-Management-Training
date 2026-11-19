// @check node — 🏅 A Knowledge Check's score and pass on the Scorecard and the Batch Sheet come only from trainee:<id> and its Case Flow summary; a score only the trainee's device holds is shown as unconfirmed and never counted
// js/cm-scorecard.js (kcBest, kcPassed, kcDevice, compute), run in Node with the page's globals stubbed:
//   1. a day the record scores: its best attempt, passed at 70 (on any of the record's attempts) or when it is done;
//   2. a day only progress:<id>.data["day-progress"] (or a work-log quiz entry) holds, even marked done: not passed, not
//      averaged, shown in the Knowledge Checks list as unconfirmed;
//   3. a device's score outside 0–100 is never shown.
// Usage: node .github/scripts/scorecard-kc-official.cjs   (no server, no browser needed)
const vm = require('vm'), fs = require('fs'), path = require('path');
const { reporter } = require('./worker-harness.cjs');
const R = reporter();
const win = { addEventListener() { } };
const ctx = { window: win, DAYS: [{ id: 11, cf: { n: 1 } }, { id: 12, cf: { n: 2 } }], document: { addEventListener() { }, getElementById() { return null; }, querySelector() { return null; }, createElement: () => ({ appendChild() { } }), head: { appendChild() { } }, body: { appendChild() { } } }, console, setTimeout, clearTimeout, state: {} };
win.window = win; vm.createContext(ctx);
// (the file's globals are the window's: it reads window.cmCreditKept and sets window.cmScorecard)
ctx.window = new Proxy(win, { get: (t, k) => k in t ? t[k] : ctx[k], set: (t, k, v) => { t[k] = v; return true; } });
vm.runInContext(fs.readFileSync(path.join(__dirname, '../../js/cm-scorecard.js'), 'utf8'), ctx);
const S = win.cmScorecard;
if (!S || !S.kcBest || !S.kcPassed || !S.kcDevice) { console.log('js/cm-scorecard.js should expose kcBest, kcPassed and kcDevice'); process.exit(1); }
const d11 = ctx.DAYS[0], d12 = ctx.DAYS[1];
const kcRow = (c) => S.compute(c).rows.find((r) => r.s.id === 'kc') || { items: [] };

// 1. the record's own
const rec = { rec: { dayProgress: { 11: { score: 55, done: false, history: [{ score: 80 }, { score: 55 }] } } }, cf: { days: {} }, data: {} };
R.check(S.kcBest(rec.rec.dayProgress[11], {}) === 80 && S.kcPassed(rec, d11) && S.compute(rec).done === 1, 'a day the record scores: its best attempt, passed on any attempt at 70');
const viaCf = { rec: { dayProgress: {} }, cf: { days: { 1: { kc: 74, passed: true } } }, data: {} };
R.check(S.kcPassed(viaCf, d11) && kcRow(viaCf).avg === 74, 'the Case Flow summary counts');

// 2. only the device's copy
const dev = { rec: { dayProgress: {} }, cf: { days: {} }, data: { 'day-progress': { 11: { score: 100, done: true, history: [{ score: 100, passed: true }] } }, 'work-log': [{ kind: 'quiz', dayId: 12, score: 77, at: '2026-09-02T10:00:00Z' }] } };
const row = kcRow(dev);
R.check(!S.kcPassed(dev, d11) && S.compute(dev).done === 0, `a day only the device holds, even "done", is not passed: ${S.compute(dev).done}`);
R.check(row.avg == null && S.compute(dev).graded === 0, `a device-only score is never averaged: ${row.avg}`);
R.check(row.items.length === 2 && row.items.every((x) => x.unconfirmed && /Unconfirmed/.test(x.note)) && row.items[0].pct === 100 && row.items[1].pct === 77, `device-only scores are shown, labelled unconfirmed: ${JSON.stringify(row.items)}`);
R.check(S.kcDevice(rec, d11) == null, 'a day the record scores has no unconfirmed score');

// 3. impossible device scores
const bad = { rec: { dayProgress: {} }, cf: { days: {} }, data: { 'day-progress': { 11: { score: 150, history: [{ score: 150 }] } } } };
R.check(S.kcDevice(bad, d11) == null && kcRow(bad).items.length === 0, 'a device score outside 0–100 is never shown');

R.done('🏅 Scorecard Knowledge Checks: score and pass from trainee:<id> and its Case Flow summary only; the device\'s own copy is shown unconfirmed, never counted.');
