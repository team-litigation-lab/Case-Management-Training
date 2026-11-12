#!/usr/bin/env node
// Bring main into the current branch, and settle by itself what two branches used to collide on:
//   • the generated files (the assembled slides, trainer scripts, simulation, companion cases, exhibits and curriculum
//     documents): never merged by hand, rebuilt from the merged sources;
//   • a hand-written ?v= version on a page's script or stylesheet (from a branch made before versions went automatic):
//     dropped (CLAUDE.md: no ?v= on local scripts; the site is served max-age=0, must-revalidate with an ETag).
// Anything else that conflicts is a real conflict: it is listed, left for you, and nothing is committed.
// When everything is settled it rebuilds, runs check-site.mjs and commits the merge. It never pushes. (CLAUDE.md: before you
// push, merge origin/main into your branch; this does it.)
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
const REF = process.argv[2] || 'origin/main';   // (another branch to bring in, e.g. origin/some-branch; main by default)
console.log(`Fetching ${REF}…`); if (REF.startsWith('origin/')) git('fetch', 'origin', REF.slice('origin/'.length));
const before = git('rev-parse', 'HEAD');
// (diff3 markers carry the common ancestor too, so a line one side deleted is told apart from one the other side added)
const merge = spawnSync('git', ['-c', 'merge.conflictStyle=diff3', 'merge', '--no-edit', '--no-commit', REF], { encoding: 'utf8' });
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
  s = s.replace(/^<<<<<<< [^\n]*\n([\s\S]*?)^\|\|\|\|\|\|\| [^\n]*\n([\s\S]*?)^=======\n([\s\S]*?)^>>>>>>> [^\n]*\n/gm, (all, ours, base, theirs) => {
    if (ours === theirs) return ours;
    // both sides only change a list of scripts / stylesheets / comments: take every line either side added, and drop
    // every line either side deleted (relative to the common ancestor), keeping our order
    const tag = /^\s*<(script|link)\b[^>]*>(<\/script>)?\s*$|^\s*<!--.*-->\s*$/;
    const L = (t) => t.split('\n').filter(Boolean);
    const a = L(ours), b = L(theirs), o = L(base);
    if (![...a, ...b, ...o].every((l) => tag.test(l))) { real = true; return all; }
    const outl = a.filter((l) => !(o.includes(l) && !b.includes(l)));          // drop what they deleted
    b.forEach((l, i) => { if (o.includes(l) || outl.includes(l)) return;       // add what they added, after its neighbour
      const prev = b.slice(0, i).reverse().find((p) => outl.includes(p)); outl.splice(prev ? outl.indexOf(prev) + 1 : outl.length, 0, l); });
    return outl.join('\n') + '\n';
  });
  fs.writeFileSync(f, s);
  if (!real) { git('add', '--', f); console.log(`  ✓ ${f}: script list settled, no hand-written versions`); }
}
left = conflicted();
if (left.length) {
  console.log(`\n${left.length} real conflict(s) to resolve by hand (nothing committed):\n${left.map((f) => '  • ' + f).join('\n')}`);
  console.log('Resolve them, then run: node build/case-flow/build.cjs && node .github/scripts/check-site.mjs && git commit');
  process.exit(1);
}
console.log('\nRebuilding the generated files…');
for (const [s] of BUILD) if (fs.existsSync(s) && !run(process.execPath, [s])) { console.error(`${s} failed: fix it, then commit.`); process.exit(1); }
git('add', '-A');
console.log('\nChecking the site…');
if (!run(process.execPath, ['.github/scripts/check-site.mjs'])) { console.error('\nA check failed: fix it, then commit the merge (git commit).'); process.exit(1); }
const merging = spawnSync('git', ['rev-parse', '-q', '--verify', 'MERGE_HEAD']).status === 0;
if (!merging) {
  if (git('diff', '--cached', '--name-only')) { git('commit', '-m', 'Rebuild the generated files after bringing in main'); }
  console.log(git('rev-parse', 'HEAD') === before ? 'Already up to date with main.' : '✓ Fast-forwarded to main. Push when ready: git push');
  process.exit(0);
}
git('commit', '--no-edit');
console.log(`\n✓ ${REF} merged and committed. Push when ready: git push`);
