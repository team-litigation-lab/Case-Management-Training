// Course data checks (run by .github/workflows/checks.yml).
// Every case document and handout the portal links to must exist in documents/,
// document ids must be unique, and every document packet a Skill Builder opens
// must point at a real document.
import fs from 'fs';
import path from 'path';
import vm from 'vm';

const ROOT = path.resolve(process.argv[2] || '.');
const problems = [];
const ctx = { window: {} };
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(path.join(ROOT, 'js/cm-documents.js'), 'utf8'), ctx);
const { CM_DOCS = [], CM_HANDOUTS = [], CM_DOC_FOLDERS = [] } = ctx.window;

const seen = new Set();
const folders = new Set(CM_DOC_FOLDERS.map(f => f.id));
for (const d of CM_DOCS) {
    if (seen.has(d.id)) problems.push(`Duplicate document id ${d.id}`);
    seen.add(d.id);
    if (!d.file || !fs.existsSync(path.join(ROOT, 'documents', d.file))) problems.push(`${d.id} "${d.title}": documents/${d.file} is missing`);
    if (d.folder && !folders.has(d.folder)) problems.push(`${d.id}: unknown folder "${d.folder}"`);
}
for (const h of CM_HANDOUTS) {
    if (!h.file || !fs.existsSync(path.join(ROOT, 'documents', h.file))) problems.push(`Handout "${h.title}": documents/${h.file} is missing`);
}
// docPacket(["JD01", …]) and doc:"JD07" references in the tools
for (const f of fs.readdirSync(path.join(ROOT, 'js')).filter(f => f.endsWith('.js'))) {
    const src = fs.readFileSync(path.join(ROOT, 'js', f), 'utf8');
    for (const m of src.matchAll(/docPacket\(\[([^\]]*)\]/g)) {
        for (const id of m[1].match(/"([A-Z]+\d+)"/g) || []) {
            const k = id.replace(/"/g, '');
            if (!seen.has(k)) problems.push(`js/${f}: docPacket references ${k}, which isn't in CM_DOCS`);
        }
    }
    for (const m of src.matchAll(/\bdoc:"([A-Z]+\d+)"/g)) if (!seen.has(m[1])) problems.push(`js/${f}: doc:"${m[1]}" isn't in CM_DOCS`);
}

console.log(`Checked ${CM_DOCS.length} documents and ${CM_HANDOUTS.length} handouts.`);
if (problems.length) { console.log(`\n${problems.length} problem(s):\n`); problems.forEach((p, i) => console.log(`${i + 1}. ${p}`)); process.exit(1); }
console.log('All good.');
