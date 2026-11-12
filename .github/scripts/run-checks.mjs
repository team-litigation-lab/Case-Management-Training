// Runs every check in .github/scripts that declares itself, so adding a check means adding a file: checks.yml never
// changes (it used to list every check by hand, and every branch that added one collided on the end of that list).
//
// A check declares itself in its first 15 lines, on one line:
//   // @check node — What it checks                    (run as: node <file>)
//   // @check browser — What it checks                 (run as: node <file> <baseUrl>, against .github/scripts/server.mjs)
//   // @check browser 12 — What it checks              (extra arguments after the URL)
//   // @check browser-noarg — What it checks           (in the browser job, needs Playwright, no URL)
// smoke.cjs runs first in the browser job; the rest run in name order. Every check runs, even after one fails; the
// run fails if any did, with the server log under a failed browser check.
//
// Usage: node .github/scripts/run-checks.mjs node
//        node .github/scripts/run-checks.mjs browser [baseUrl]   (starts .github/scripts/server.mjs itself unless baseUrl is given)
import fs from 'node:fs';
import path from 'node:path';
import { spawn, spawnSync } from 'node:child_process';

const DIR = path.join(process.cwd(), '.github', 'scripts');
const mode = process.argv[2];
if (!['node', 'browser'].includes(mode)) { console.error('Usage: node .github/scripts/run-checks.mjs node|browser [baseUrl]'); process.exit(2); }
const MARK = /@check\s+(node|browser|browser-noarg)\b([^—\n]*?)\s*—\s*(.+?)\s*$/;

const checks = fs.readdirSync(DIR).filter((f) => /\.(c|m)?js$/.test(f) && f !== 'run-checks.mjs').sort().map((f) => {
  const head = fs.readFileSync(path.join(DIR, f), 'utf8').split('\n').slice(0, 15).join('\n');
  const m = head.split('\n').map((l) => l.match(MARK)).find(Boolean);
  return m ? { file: f, kind: m[1], args: m[2].trim().split(/\s+/).filter(Boolean), name: m[3] } : null;
}).filter(Boolean).filter((c) => (mode === 'node' ? c.kind === 'node' : c.kind !== 'node'));
if (mode === 'browser') checks.sort((a, b) => (b.file === 'smoke.cjs') - (a.file === 'smoke.cjs'));
if (!checks.length) { console.error(`No ${mode} checks found (a check declares itself with "// @check ${mode} — …").`); process.exit(1); }

let server = null, base = process.argv[3] || '';
const log = path.join(process.env.RUNNER_TEMP || '/tmp', 'server.log');
if (mode === 'browser' && !base) {
  base = 'http://localhost:8787/';
  server = spawn(process.execPath, [path.join(DIR, 'server.mjs'), '8787'], { stdio: ['ignore', fs.openSync(log, 'w'), fs.openSync(log, 'a')] });
  await new Promise((r) => setTimeout(r, 2000));
}

const failed = [];
for (const c of checks) {
  const args = c.kind === 'browser' ? [base, ...c.args] : c.args;
  console.log(`\n::group::${c.name}  (${c.file})`);
  const t = Date.now(), r = spawnSync(process.execPath, [path.join(DIR, c.file), ...args], { stdio: 'inherit' });
  console.log('::endgroup::');
  const ok = r.status === 0;
  console.log(`${ok ? '✓' : '✗'} ${c.name}  (${c.file}, ${((Date.now() - t) / 1000).toFixed(1)}s)`);
  if (!ok) {
    failed.push(c);
    console.log(`::error title=${c.file}::${c.name}`);
    if (server && fs.existsSync(log)) console.log(`--- server log ---\n${fs.readFileSync(log, 'utf8').split('\n').slice(-60).join('\n')}`);
  }
}
if (server) server.kill();
console.log(`\n${checks.length - failed.length} of ${checks.length} ${mode} checks passed.`);
if (failed.length) { console.log(`Failed:\n${failed.map((c) => `  ✗ ${c.name} (${c.file})`).join('\n')}`); process.exit(1); }
