// @check node — rankshare:<id> (a trainee's own row of the Rankings & Progress Report) is read by that trainee only and written by trainers only, and the shared row names no other trainee
// Usage: node .github/scripts/rankshare-access.mjs
import fs from 'fs'; import vm from 'vm';
const w = fs.readFileSync('worker.js', 'utf8'), fails = [];
const can = w.slice(w.indexOf('function canRead(tok, key)'), w.indexOf('function canRead(tok, key)') + 900);
if (!/key === `rankshare:\$\{tok\.id\}`/.test(can)) fails.push('canRead should let a trainee read their own rankshare:<id>');
if ((w.match(/rankshare:/g) || []).length !== 2) fails.push('rankshare: should appear only in canRead (and its note): traineeWrite must not know it, so a trainee can never write it');
// the shared rows: one per trainee, the batch only as its average
const src = fs.readFileSync('js/cm-rank-share.js', 'utf8'), i = src.indexOf('function rowsToShare'), j = src.indexOf('async function share');
const ctx = {}; vm.createContext(ctx); vm.runInContext('const fin = x => typeof x === "number" && isFinite(x);\n' + src.slice(i, j) + '\nthis.rowsToShare = rowsToShare;', ctx);
const cur = { ok: true, label: 'Batch B1', gen: [{ id: 'ann', pct: 90, dayS: [{ n: 1, S: 90 }, { n: 2, S: 80 }] }, { id: 'ben', pct: 70, dayS: [{ n: 1, S: 70 }, { n: 2, S: null }] }],
  snap: { rows: [{ rank: '1', name: 'Ann', overall: '90%', strength: 's', challenges: 'c', attrs: [] }, { rank: '2', name: 'Ben', overall: '70%', strength: 's2', challenges: 'c2', attrs: [] }] } };
const rows = ctx.rowsToShare(cur), ben = (rows.find(r => r[0] === 'ben') || [])[1];
if (rows.length !== 2 || !ben) fails.push(`one row per trainee: ${JSON.stringify(rows)}`);
else {
  if (ben.rank !== 2 || ben.of !== 2) fails.push(`Ben's rank of the ranked: ${ben.rank} of ${ben.of}`);
  if (JSON.stringify(ben.days) !== JSON.stringify([{ n: 1, me: 70, avg: 80 }, { n: 2, me: null, avg: 80 }])) fails.push(`Ben's days beside the batch average: ${JSON.stringify(ben.days)}`);
  if (/Ann/.test(JSON.stringify(ben))) fails.push('Ben\'s shared row names another trainee');
}
if (ctx.rowsToShare(Object.assign({}, cur, { label: 'All batches' })).length) fails.push('"All batches" is not one batch: nothing should be shared');
if (ctx.rowsToShare(Object.assign({}, cur, { ok: false })).length) fails.push('a report still collecting grades should share nothing');
if (fails.length) { console.error('Rank share check FAILED:\n- ' + fails.join('\n- ')); process.exit(1); }
console.log('Rank share check passed (a trainee reads only their own rankshare, never writes it; one row each, the batch as its average, no other name; nothing shared for All batches or a report still loading).');
