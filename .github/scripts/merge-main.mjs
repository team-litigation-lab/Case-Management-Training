#!/usr/bin/env node
// Bring main into the current branch, and settle by itself what two branches used to collide on:
//   • the generated files (the assembled slides, trainer scripts, simulation, companion cases, exhibits and curriculum
//     documents): never merged by hand, rebuilt from the merged sources;
//   • a hand-written ?v= version on a page's script or stylesheet (from a branch made before versions went automatic):
//     dropped, since the Worker stamps every one with its content fingerprint (worker.js stampAssets).
// Anything else that conflicts is a real conflict: it is listed, left for you, and nothing is committed.
// When everything is settled it rebuilds, runs the node checks and commits the merge. It never pushes.
//
// Usage (from the repository root, on your branch, with a clean working tree):
//   node .github/scripts/merge-main.mjs
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';

const git = (...a) => execFileSync('git', a, { encoding: 'utf8' }).trim();
const run = (cmd, args) => spawnSync(cmd, args, { stdio: 'inherit' }).status === 0;
const GENERATED = [
  /^js\/cm-case-flow-(slides|scripts|sim|exhibits)\.js$/, /^js\/cm-companion-cases\.js$/, /^curriculum\/5-day-flow\//
];
const BUILD = [
  ['build/case-flow/build.cjs'], ['build/case-flow/cases/assemble.cjs'], ['build/case-flow/exhibits/assemble.cjs']
];

if (git('status', '--porcelain', '--untracked-files=no')) { console.error('Commit or stash your changes first: the working tree has edits.'); process.exit(1); }
console.log('Fetching main…'); git('fetch', 'origin', 'main');
const merge = spawnSync('git', ['merge', '--no-edit', '--no-commit', 'origin/main'], { encoding: 'utf8' });
process.stdout.write(merge.stdout || '');
const conflicted = () => git('diff', '--name-only', '--diff-filter=U').split('\n').filter(Boolean);
let left = conflicted();

// 1. generated files: take main's copy for now; the rebuild below writes the right one from the merged sources
for (const f of left.filter((f) => GENERATED.some((re) => re.test(f)))) {
  git('checkout', '--theirs', '--', f); git('add', '--', f); console.log(`  ↻ ${f}: rebuilt from the merged sources`);
}
// 2. pages: a conflict made only of ?v= versions settles itself; versions are dropped everywhere
const VER = /((?:src|href)\s*=\s*(["'])\/?(?:js|css)\/[^"'?#]+\.(?:m?js|css))\?v=[^"'#]*\2/g;
for (const f of conflicted().filter((f) => /\.html?$/.test(f))) {
  let s = fs.readFileSync(f, 'utf8').replace(VER, '$1$2');
  let real = false;
  s = s.replace(/^<<<<<<< [^\n]*\n([\s\S]*?)^=======\n([\s\S]*?)^>>>>>>> [^\n]*\n/gm, (all, ours, theirs) => {
    if (ours === theirs) return ours;
    // both sides only list scripts/stylesheets: keep every line either side has, in order, once
    const tag = /^\s*<(script|link)\b[^>]*>(<\/script>)?\s*$|^\s*<!--.*-->\s*$/;
    const a = ours.split('\n').filter(Boolean), b = theirs.split('\n').filter(Boolean);
    if (![...a, ...b].every((l) => tag.test(l))) { real = true; return all; }
    const outl = [...a]; b.forEach((l, i) => { if (!outl.includes(l)) { const prev = b.slice(0, i).reverse().find((p) => outl.includes(p)); outl.splice(prev ? outl.indexOf(prev) + 1 : outl.length, 0, l); } });
    return outl.join('\n') + '\n';
  });
  fs.writeFileSync(f, s);
  if (!real) { git('add', '--', f); console.log(`  ✓ ${f}: script list settled, no hand-written versions`); }
}
left = conflicted();
if (left.length) {
  console.log(`\n${left.length} real conflict(s) to resolve by hand (nothing committed):\n${left.map((f) => '  • ' + f).join('\n')}`);
  console.log('Resolve them, then run: node build/case-flow/build.cjs && node .github/scripts/run-checks.mjs node && git commit');
  process.exit(1);
}
console.log('\nRebuilding the generated files…');
for (const [s] of BUILD) if (fs.existsSync(s) && !run(process.execPath, [s])) { console.error(`${s} failed: fix it, then commit.`); process.exit(1); }
git('add', '-A');
console.log('\nRunning the node checks…');
if (!run(process.execPath, ['.github/scripts/run-checks.mjs', 'node'])) { console.error('\nA check failed: fix it, then commit the merge (git commit).'); process.exit(1); }
const merging = spawnSync('git', ['rev-parse', '-q', '--verify', 'MERGE_HEAD']).status === 0;
if (!git('diff', '--cached', '--name-only') && !merging) { console.log('Already up to date with main.'); process.exit(0); }
git('commit', '--no-edit');
console.log('\n✓ main merged and committed. Push when ready: git push');
