// @check node — Every case document's current file is listed by its bytes in worker-drive-versions.js (the versions the Backup Drive grader accepts), the list is in step with build/case-flow/documents/versions.cjs, and no version main lists is dropped
// A trainee who backed up a document before it was re-rendered still has that document (worker-drive-found.js
// withVersions): this keeps the list the grader reads whole. It needs no git history (CI's checkout is shallow): today's
// files are on disk, and the earlier versions are committed data, so a version once listed can only be lost by an edit
// to worker-drive-versions.js, which (3) catches against main when main is in reach.
// Usage: node .github/scripts/doc-versions.cjs
'use strict';
const fs = require('fs'), path = require('path'), crypto = require('crypto'), { spawnSync } = require('child_process');
const { pathToFileURL } = require('url');
const ROOT = path.join(__dirname, '../..');
global.window = {};
require(path.join(ROOT, 'js/cm-case-flow-docs.js'));
const DOCS = window.CM_CF_DOCS;
const parse = (src) => { const m = /DOC_VERSIONS = (\{[\s\S]*?\n\});/.exec(src || ''); return m ? JSON.parse(m[1]) : null; };

(async () => {
  const fails = [], fail = (m) => fails.push(m);
  const { DOC_VERSIONS: V } = await import(pathToFileURL(path.join(ROOT, 'worker-drive-versions.js')).href);
  // 1. today's file of every document is one of its versions (a file under a kilobyte is no document, and isn't listed)
  let n = 0;
  for (const d of DOCS) {
    const f = path.join(ROOT, 'documents', d.file || '');
    if (!d.file || !fs.existsSync(f)) { fail(`${d.id}: its file documents/${d.file} is not in this checkout`); continue; }
    const b = fs.readFileSync(f);
    if (b.length < 1024) continue;
    n++;
    const h = crypto.createHash('md5').update(b).digest('hex');
    if (!(V[d.id] || []).includes(h)) fail(`${d.id}: today's file (${d.file}, md5 ${h}) is not listed in worker-drive-versions.js: run node build/case-flow/build.cjs and commit it`);
  }
  Object.entries(V).forEach(([id, hs]) => { if (!Array.isArray(hs) || hs.some((h) => !/^[0-9a-f]{32}$/.test(h))) fail(`${id}: its versions should be MD5s in hex: ${JSON.stringify(hs)}`); });
  // 2. in step with its builder (which only adds)
  const r = spawnSync(process.execPath, [path.join(ROOT, 'build/case-flow/documents/versions.cjs'), '--check'], { cwd: ROOT, encoding: 'utf8' });
  if (r.status !== 0) fail((r.stderr || r.stdout || 'versions.cjs --check failed').trim());
  // 3. the list only grows: every version main lists is still listed (when main is in reach; CI's shallow checkout skips it)
  const main = spawnSync('git', ['show', 'origin/main:worker-drive-versions.js'], { cwd: ROOT, encoding: 'utf8' });
  const was = main.status === 0 ? parse(main.stdout) : null;
  if (was) Object.entries(was).forEach(([id, hs]) => { const gone = hs.filter((h) => !(V[id] || []).includes(h)); if (gone.length) fail(`${id}: ${gone.length} version(s) main lists are gone from worker-drive-versions.js (${gone.join(', ')}): a version once served stays accepted`); });
  // 4. RS12 was re-rendered on 2026-11-18: the version before is still accepted
  if (!((V.RS12 || []).length >= 2)) fail(`RS12 should list its version from before its 2026-11-18 re-render: ${JSON.stringify(V.RS12)}`);
  if (fails.length) { console.log(`✗ Document versions (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
  console.log(`Document versions: today's file of each of ${n} documents is listed, with ${Object.values(V).flat().length} versions in all${was ? ', none of main\'s dropped' : ''}.`);
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
