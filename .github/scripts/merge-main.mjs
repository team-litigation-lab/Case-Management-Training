#!/usr/bin/env node
// Bring main into the current branch, and settle by itself what two branches used to collide on:
//   • every generated file (the assembled slides, trainer scripts, simulation, companion cases, exhibits, the deck
//     slides, the curriculum documents and docs/INVENTORY.md): never merged by hand, rebuilt from the merged sources;
//   • a hand-written ?v= version on a page's script or stylesheet (from a branch made before versions went automatic):
//     dropped, since the Worker stamps every one with its content fingerprint (worker.js stampAssets).
// Anything else that conflicts is a real conflict: it is listed, left for you, and nothing is committed.
// When everything is settled it rebuilds, runs the node checks and commits the merge. It never pushes. It stages only
// tracked changes and the generated files, so untracked scratch (.claude/worktrees, notes) is never committed.
//
// Usage (from the repository root, on your branch, with a clean working tree):
//   node .github/scripts/merge-main.mjs          merge origin/main (fetched first)
//   node .github/scripts/merge-main.mjs --ci     non-interactive (the auto-update workflow): never prompts; on real
//                                                conflicts prints "CONFLICTS: a,b,c" and exits 3
//   MERGE_MAIN_REF=<ref> node .github/scripts/merge-main.mjs    merge <ref> instead (fetched only when it is
//                                                origin/main; e.g. origin/<your-branch> after a rejected push, or the
//                                                exact commit of main the auto-update workflow pinned)
//   MERGE_MAIN_NAME=<name>                       what the merge commit calls the ref ("Merge <name> into <branch>")
// The merge is never a fast-forward (--no-ff), so there is always a merge commit to put the rebuilt files in; when the
// ref is already in the branch and only the rebuild changed something, that is committed on its own.
// Exit codes: 0 merged (or already up to date) · 1 a build or check failed · 2 the working tree has edits · 3 real conflicts.
//
// GENERATED and BUILD are also read by .github/scripts/merge-main-generated.mjs, which fails when a generator writes a
// file that is not listed here: a new generated file goes in GENERATED, its builder in BUILD.
import { execFileSync, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

// Every committed file a build writes. Hand-written files beside them (curriculum/5-day-flow/case-file.md,
// 00-architecture.md) are NOT here: a conflict in those is real.
export const GENERATED = [
  /^js\/cm-case-flow-(slides|scripts|sim|exhibits)\.js$/, /^js\/cm-companion-cases\.js$/, /^js\/cm-deck-slides\.js$/,
  /^curriculum\/5-day-flow\/(day\d+|traceability|document-inventory)\.md$/,
  /^docs\/INVENTORY\.md$/
];
// The builders, in the order they depend on each other. The exhibits come from the sources alone, and build.cjs (terms,
// slides, scripts, sim and curriculum) reads them; the document inventory reads the exhibits too; build/inventory.cjs
// lists every file, so it goes last.
export const BUILD = [
  'build/case-flow/exhibits/assemble.cjs', 'build/case-flow/cases/assemble.cjs', 'build/case-flow/build.cjs',
  'build/case-flow/documents/inventory.cjs', 'build/videoslide/deck-slides.cjs', 'build/inventory.cjs'
];
// Scripts under build/ that write files but are not rebuilt here, and why (merge-main-generated.mjs checks this list).
export const NOT_REBUILT = {
  'build/case-flow/terms.cjs': 'rewrites the sources themselves; run by build.cjs',
  'build/case-flow/slides/assemble.cjs': 'run by build.cjs',
  'build/case-flow/scripts/assemble.cjs': 'run by build.cjs',
  'build/case-flow/sim/assemble.cjs': 'run by build.cjs',
  'build/case-flow/curriculum.cjs': 'run by build.cjs',
  'build/case-flow/documents/render.cjs': 'PDFs and .docx: needs Playwright and LibreOffice, run locally; a conflict in one is real',
  'build/case-flow/documents/thumbs.py': 'image thumbnails: needs Python and Pillow, run locally',
  'build/videoslide/make_video.py': 'the narrated video: needs ffmpeg and Python, run locally',
  'build/videoslide/revoice.py': 'the narration audio: needs Python and a voice service, run locally',
  'build/case-flow/documents/handouts/render-handout.cjs': 'a handout PDF: needs Playwright, run locally',
  'build/lor/make_lor_data.py': 'js/cm-lor-data.js from the trainers\' .docx files: needs Python, run by hand; not committed here',
  'build/medprov/make_medprov_data.py': 'js/cm-medprov-data.js from the trainers\' .docx files: needs Python, run by hand; not committed here',
  'build/slide-keys7.cjs': 'js/cm-slide-keys7.js, layout 7\'s deck: a frozen record, written once and never again (it refuses to)'
};
export const isGenerated = (f) => GENERATED.some((re) => re.test(f));

function main(){
  const CI = process.argv.includes('--ci');
  const REF = process.env.MERGE_MAIN_REF || 'origin/main', NAME = process.env.MERGE_MAIN_NAME || REF;   // NAME: in the commit message
  // (INVENTORY_TRACKED_ONLY: docs/INVENTORY.md lists only what this commits, never untracked scratch; build/inventory.cjs)
  const env = { ...process.env, GIT_EDITOR: 'true', GIT_MERGE_AUTOEDIT: 'no', GIT_TERMINAL_PROMPT: '0', INVENTORY_TRACKED_ONLY: '1' };
  const git = (...a) => execFileSync('git', a, { encoding: 'utf8', env }).trim();
  const tryGit = (...a) => spawnSync('git', a, { encoding: 'utf8', env }).status === 0;
  const run = (cmd, args) => spawnSync(cmd, args, { stdio: 'inherit', env }).status === 0;
  const fail = (code, msg) => { console.error(msg); process.exit(code); };

  if (git('status', '--porcelain', '--untracked-files=no')) fail(2, 'Commit or stash your changes first: the working tree has edits.');
  if (REF === 'origin/main') { console.log('Fetching main…'); git('fetch', 'origin', 'main'); }
  const BRANCH = git('rev-parse', '--abbrev-ref', 'HEAD');
  console.log(`Merging ${REF}…`);
  // (the plain conflict style, whatever merge.conflictStyle says: a diff3/zdiff3 block's base section would hide a
  // script-list conflict from the settling below)
  const merge = spawnSync('git', ['-c', 'merge.conflictStyle=merge', 'merge', '--no-ff', '--no-edit', '--no-commit', REF], { encoding: 'utf8', env });
  process.stdout.write(merge.stdout || ''); process.stderr.write(merge.stderr || '');
  const conflicted = () => git('diff', '--name-only', '--diff-filter=U').split('\n').filter(Boolean);
  if (merge.status !== 0 && !conflicted().length) fail(1, `git merge ${REF} failed (above), and not on a conflict.`);

  // 1. generated files: take main's copy for now; the rebuild below writes the right one from the merged sources. One
  //    side deleted it (its generator retired, or the file renamed): it is removed, and the rebuild writes it again
  //    only if a builder still does (never a stale copy brought back)
  for (const f of conflicted().filter(isGenerated)) {
    const stages = new Set(git('ls-files', '-u', '--', f).split('\n').filter(Boolean).map((l) => l.split(/\s+/)[2]));
    if (stages.has('2') && stages.has('3') && tryGit('checkout', '--theirs', '--', f)) git('add', '--', f);
    else git('rm', '-q', '-f', '--ignore-unmatch', '--', f);
    console.log(`  ↻ ${f}: rebuilt from the merged sources`);
  }
  // 2. pages: a conflict made only of ?v= versions settles itself; versions are dropped everywhere
  const VER = /((?:src|href)\s*=\s*(["'])\/?(?:js|css)\/[^"'?#]+\.(?:m?js|css))\?v=[^"'#]*\2/g;
  for (const f of conflicted().filter((f) => /\.html?$/.test(f) && fs.existsSync(f))) {
    let s = fs.readFileSync(f, 'utf8').replace(VER, '$1$2');
    let real = false;
    s = s.replace(/^<<<<<<< [^\n]*\n([\s\S]*?)^=======\n([\s\S]*?)^>>>>>>> [^\n]*\n/gm, (all, ours, theirs) => {
      ours = ours.replace(/^\|{7}(?: [^\n]*)?\n[\s\S]*$/m, '');   // a base section, should one be there all the same
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
  const left = conflicted();
  if (left.length) {
    if (CI) { console.log(`CONFLICTS: ${left.join(',')}`); process.exit(3); }
    console.log(`\n${left.length} real conflict(s) to resolve by hand (nothing committed):\n${left.map((f) => '  • ' + f).join('\n')}`);
    console.log(`Resolve them, then rebuild (${BUILD.map((s) => `node ${s}`).join(' && ')}),\nrun node .github/scripts/run-checks.mjs node, and git commit.`);
    process.exit(3);
  }
  console.log('\nRebuilding the generated files…');
  for (const s of BUILD) if (fs.existsSync(s) && !run(process.execPath, [s])) fail(1, `${s} failed: fix it, then commit.`);
  // stage the merge: tracked changes, and any generated file a build newly wrote; never untracked scratch
  git('add', '-u');
  const fresh = git('ls-files', '-o', '--exclude-standard').split('\n').filter((f) => f && isGenerated(f));
  if (fresh.length){
    git('add', '--', ...fresh);
    // the inventory again, now that the newly written files are added (it lists only what git tracks here)
    if (BUILD.includes('build/inventory.cjs') && fs.existsSync('build/inventory.cjs')){
      if (!run(process.execPath, ['build/inventory.cjs'])) fail(1, 'build/inventory.cjs failed: fix it, then commit.');
      git('add', '-u');
    }
  }
  console.log('\nRunning the node checks…');
  if (!run(process.execPath, ['.github/scripts/run-checks.mjs', 'node'])) fail(1, '\nA check failed: fix it, then commit the merge (git commit).');
  const merging = tryGit('rev-parse', '-q', '--verify', 'MERGE_HEAD');
  if (!git('diff', '--cached', '--name-only') && !merging) { console.log(`Already up to date with ${REF}.`); process.exit(0); }
  // (git's own message names a remote-tracking ref "remote-tracking branch"; this says what was merged into what)
  git('commit', '-m', merging ? `Merge ${NAME} into ${BRANCH}` : `Rebuild the generated files after merging ${NAME}`);
  console.log(`\n✓ ${REF} merged and committed. Push when ready: git push`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
