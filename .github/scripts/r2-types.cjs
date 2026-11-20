// @check node — Every file the R2 upload sends (decks/, documents/) has its content type in .github/scripts/r2-sync.mjs, so none goes up as application/octet-stream (a caption track or a stylesheet sent as that doesn't load)
// r2-sync.mjs uploads each changed file under the folders .github/workflows/r2-docs.yml names (DIRS) with the content type
// its TYPES table gives its extension, and application/octet-stream when the table has none; the Worker (docFromR2) then
// serves the object with the type it was stored with. A browser refuses a <track> (captions) or a stylesheet sent as
// application/octet-stream, so a file type added to those folders needs its line in TYPES. (While the repository has no
// CLOUDFLARE_API_TOKEN, nothing is uploaded and the Worker serves these files from its static assets, typed by extension.)
// Usage: node .github/scripts/r2-types.cjs
'use strict';
const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..', '..');

const src = fs.readFileSync(path.join(ROOT, '.github/scripts/r2-sync.mjs'), 'utf8');
const table = /const TYPES = \{([\s\S]*?)\n\};/.exec(src);
if (!table) { console.log('✗ .github/scripts/r2-sync.mjs: its TYPES table (extension → content type) was not found'); process.exit(1); }
const types = new Map([...table[1].matchAll(/(\w+):\s*'([^']+)'/g)].map((m) => [m[1].toLowerCase(), m[2]]));

const wf = fs.readFileSync(path.join(ROOT, '.github/workflows/r2-docs.yml'), 'utf8');
const dirs = ((/^\s*DIRS:\s*(.+)$/m.exec(wf) || [])[1] || 'decks documents').trim().split(/\s+/);
const walk = (d) => fs.existsSync(d) ? fs.readdirSync(d, { withFileTypes: true }).flatMap((e) => e.name.startsWith('.') ? []
  : e.isDirectory() ? walk(path.join(d, e.name)) : [path.join(d, e.name)]) : [];

const failures = [], seen = new Map();
for (const dir of dirs) for (const f of walk(path.join(ROOT, dir))) {
  const rel = path.relative(ROOT, f).split(path.sep).join('/'), ext = (/\.([A-Za-z0-9]+)$/.exec(rel) || [])[1];
  const key = ext ? ext.toLowerCase() : '(no extension)';
  seen.set(key, (seen.get(key) || 0) + 1);
  if (!ext || !types.has(key)) failures.push(`${rel}: r2-sync.mjs has no content type for .${key}, so it would go up as application/octet-stream (add ${key}: '<type>' to its TYPES)`);
}
// the two a browser is strict about
if (!/^text\/vtt\b/.test(types.get('vtt') || '')) failures.push(`r2-sync.mjs: .vtt (captions) must go up as text/vtt, not ${types.get('vtt') || 'application/octet-stream'}`);
if (!/^text\/css\b/.test(types.get('css') || '')) failures.push(`r2-sync.mjs: .css must go up as text/css, not ${types.get('css') || 'application/octet-stream'}`);

if (failures.length) { console.log(`✗ R2 upload types (${failures.length}):\n  ` + failures.slice(0, 20).join('\n  ') + (failures.length > 20 ? `\n  … and ${failures.length - 20} more` : '')); process.exit(1); }
console.log(`R2 upload types: every file under ${dirs.join(', ')} has its content type (${[...seen].map(([k, n]) => `${n} .${k}`).join(', ')}); captions go up as text/vtt and stylesheets as text/css.`);
