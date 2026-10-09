// The CM page still builds from the EA/PA portal.
// build/build.py turns EA-PA-TRAINING's index.html into this course's. Its own anchor checks only
// run when somebody runs it, and nothing did: EA/PA drifted, every rebuild produced the wrong course,
// and nobody found out until a rebuild was attempted. This runs the build in Checks against EA/PA's
// current main, so an anchor that stops resolving is a red check here instead of a surprise later.
// The built page is written to a temp file (CM_BUILD_OUT); index.html is never touched.
// Usage: node .github/scripts/build-from-eapa.mjs <path to EA-PA-TRAINING/index.html>
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const src = process.argv[2];
if (!src || !fs.existsSync(src)) {
    console.error(`usage: node .github/scripts/build-from-eapa.mjs <EA-PA-TRAINING/index.html>\nnot found: ${src}`);
    process.exit(1);
}
const out = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'cm-build-')), 'index.html');
const before = fs.statSync('index.html').mtimeMs;

try {
    execFileSync('python3', ['build/build.py', src], { env: { ...process.env, CM_BUILD_OUT: out }, stdio: 'inherit' });
} catch (e) {
    console.error('\nbuild/build.py failed against EA/PA\'s current index.html (above).');
    console.error('An anchor it edits has moved. Update that edit in build/build.py and run it again:');
    console.error('  python3 build/build.py ../EA-PA-TRAINING/index.html');
    process.exit(1);
}
if (fs.statSync('index.html').mtimeMs !== before) {
    console.error('build/build.py wrote the repository\'s index.html even though CM_BUILD_OUT was set.');
    process.exit(1);
}

// A build that finishes can still be the wrong course, which is how this went unnoticed: with the
// failures suppressed it emitted EA/PA's ten days in CM styling. Check what came out.
const built = fs.readFileSync(out, 'utf8');
const page = fs.readFileSync('index.html', 'utf8');
const scripts = (s) => [...new Set([...s.matchAll(/<script src="\/js\/([^"?]+)/g)].map(m => m[1]))].sort();
const problems = [];

const want = scripts(page), got = scripts(built);
for (const f of want) if (!got.includes(f)) problems.push(`the built page doesn't load /js/${f}, which the committed page does`);
for (const f of got) if (!want.includes(f)) problems.push(`the built page loads /js/${f}, which the committed page doesn't`);

if (built.match(/const DAY(\d) = \{/g)?.length !== 5) problems.push(`expected the five CM days inlined, found ${built.match(/const DAY(\d) = \{/g)?.length ?? 0}`);
if (!built.includes('const DAYS = [DAY1, DAY2, DAY3, DAY4, DAY5];')) problems.push('the five-day DAYS list is missing');
if (!built.includes('John Doe')) problems.push('the built page has no John Doe case content: the CM day data did not go in');

// Within 15% of the committed page: a page far off that size is not this course.
const ratio = built.length / page.length;
if (ratio < 0.85 || ratio > 1.15) problems.push(`the built page is ${(ratio * 100).toFixed(0)}% of the committed page's size (${(built.length / 1e6).toFixed(2)} MB vs ${(page.length / 1e6).toFixed(2)} MB)`);

if (problems.length) {
    console.error(`\n${problems.length} problem(s) with the built page:`);
    problems.forEach((p, i) => console.error(`${i + 1}. ${p}`));
    process.exit(1);
}
console.log(`\nThe CM page still builds from the EA/PA portal: ${(built.length / 1e6).toFixed(2)} MB, the five CM days inlined, and the same ${got.length} scripts as the committed page.`);
