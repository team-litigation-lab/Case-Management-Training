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
import { spawn } from 'node:child_process';

const DIR = path.join(process.cwd(), '.github', 'scripts');
const mode = process.argv[2];
if (!['node', 'browser'].includes(mode)) { console.error('Usage: node .github/scripts/run-checks.mjs node|browser [baseUrl]'); process.exit(2); }
const MARK = /@check\s+(node|browser|browser-noarg)\b([^—\n]*?)\s*—\s*(.+?)\s*$/;

const checks = fs.readdirSync(DIR).filter((f) => /\.(c|m)?js$/.test(f) && f !== 'run-checks.mjs').sort().map((f) => {
  const head = fs.readFileSync(path.join(DIR, f), 'utf8').split('\n').slice(0, 15).join('\n');
  const m = head.split('\n').map((l) => l.match(MARK)).find(Boolean);
  return m ? { file: f, kind: m[1], args: m[2].trim().split(/\s+/).filter(Boolean), name: m[3] } : null;
}).filter(Boolean).filter((c) => (mode === 'node' ? c.kind === 'node' : c.kind !== 'node'));
if (!checks.length) { console.error(`No ${mode} checks found (a check declares itself with "// @check ${mode} — …").`); process.exit(1); }

// Browser checks run on WORKERS lanes at once (CHECK_WORKERS, default 3; 1 runs them one after another as before). Each lane
// has its own test server (its own in-memory store), so checks in different lanes never see each other's records; a lane
// runs its checks one at a time. The slowest checks start first. Each check's output is printed whole, in a group, as it
// ends. A base URL given on the command line means one server already running: then one lane.
const SLOW = ['fit.cjs', 'no-page-errors.cjs', 'flow-order.cjs', 'presenter.cjs', 'requests.cjs', 'smoke.cjs', 'one-screen.cjs', 'micro-frameworks.cjs'];
const given = process.argv[3] || '';
const WORKERS = mode === 'browser' && !given ? Math.max(1, Number(process.env.CHECK_WORKERS) || 3) : 1;
const servers = [], logs = [];
async function serverUp(port){
  for (let i = 0; i < 60; i++) { try { await fetch(`http://localhost:${port}/`); return true; } catch (e) { await new Promise((r) => setTimeout(r, 250)); } }
  return false;
}
if (mode === 'browser' && !given) {
  for (let i = 0; i < WORKERS; i++) {
    const port = 8787 + i, log = path.join(process.env.RUNNER_TEMP || '/tmp', `server-${port}.log`);
    logs.push(log);
    servers.push(spawn(process.execPath, [path.join(DIR, 'server.mjs'), String(port)], { stdio: ['ignore', fs.openSync(log, 'w'), fs.openSync(log, 'a')] }));
    if (!(await serverUp(port))) { console.error(`The test server on port ${port} did not start.`); process.exit(1); }
  }
}
const baseOf = (lane) => given || `http://localhost:${8787 + lane}/`;
if (mode === 'browser') {
  const rank = (c) => { const k = SLOW.indexOf(c.file); return k < 0 ? SLOW.length : k; };
  checks.sort((a, b) => rank(a) - rank(b) || a.file.localeCompare(b.file));
}
const failed = [];
function runOne(c, lane){
  return new Promise((resolve) => {
    const args = c.kind === 'browser' ? [baseOf(lane), ...c.args] : c.args, t = Date.now();
    const p = spawn(process.execPath, [path.join(DIR, c.file), ...args], { stdio: ['ignore', 'pipe', 'pipe'] });
    let buf = '';
    p.stdout.on('data', (d) => { buf += d; }); p.stderr.on('data', (d) => { buf += d; });
    p.on('close', (code) => {
      const ok = code === 0;
      process.stdout.write(`\n::group::${c.name}  (${c.file})\n${buf}::endgroup::\n`);
      console.log(`${ok ? '✓' : '✗'} ${c.name}  (${c.file}, ${((Date.now() - t) / 1000).toFixed(1)}s)`);
      if (!ok) {
        failed.push(c);
        console.log(`::error title=${c.file}::${c.name}`);
        const log = logs[lane];
        if (log && fs.existsSync(log)) console.log(`--- server log ---\n${fs.readFileSync(log, 'utf8').split('\n').slice(-60).join('\n')}`);
      }
      resolve();
    });
  });
}
const queue = checks.slice();
await Promise.all(Array.from({ length: WORKERS }, async (_, lane) => { for (let c; (c = queue.shift());) await runOne(c, lane); }));
servers.forEach((s) => s.kill());
console.log(`\n${checks.length - failed.length} of ${checks.length} ${mode} checks passed${WORKERS > 1 ? ` (${WORKERS} lanes)` : ''}.`);
if (failed.length) { console.log(`Failed:\n${failed.map((c) => `  ✗ ${c.name} (${c.file})`).join('\n')}`); process.exit(1); }
