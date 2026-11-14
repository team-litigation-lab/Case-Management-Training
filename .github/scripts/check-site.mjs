// @check node — JavaScript syntax, local files, JSON
// Site checks run by .github/workflows/checks.yml (and by hand: `node .github/scripts/check-site.mjs`).
// Fails (exit 1) with a readable list when:
//   1. any .js / .mjs / .cjs file, or any inline <script> in an .html page, has a syntax error;
//   2. an .html page loads a local file (script src, link href, img src) that isn't in the repo;
//   3. a JSON file doesn't parse;
//   4. a page writes a version on a local script or stylesheet (src="/js/x.js?v=3"): the Worker stamps every one with its
//      content fingerprint as it serves the page (worker.js stampAssets), so versions are never written, or bumped, by hand.
// Run from the repository root. No dependencies.
import fs from 'fs';
import path from 'path';
import os from 'os';
import { execFileSync } from 'child_process';

const ROOT = path.resolve(process.argv[2] || '.');
const SKIP = /(^|\/)(node_modules|\.git|\.wrangler|dist|\.github|\.claude)(\/|$)/;
// Paths served by code (Pages Functions / the Worker), not by files.
const DYNAMIC = /^\/?(api|functions|kb-files)\//;
const problems = [];
let scripts = 0, pages = 0, refs = 0;

function walk(dir, out = []) {
    for (const name of fs.readdirSync(dir)) {
        const p = path.join(dir, name);
        const rel = path.relative(ROOT, p);
        if (SKIP.test(rel)) continue;
        const st = fs.statSync(p);
        if (st.isDirectory()) walk(p, out); else out.push(p);
    }
    return out;
}
const rel = (p) => path.relative(ROOT, p);

function syntax(file, label) {
    scripts++;
    try {
        execFileSync(process.execPath, ['--check', file], { stdio: ['ignore', 'pipe', 'pipe'] });
    } catch (e) {
        const msg = String(e.stderr || e.message).split('\n').filter(l => l.trim()).slice(0, 5).join('\n    ');
        problems.push(`Syntax error in ${label}\n    ${msg}`);
    }
}

function checkHtml(file) {
    pages++;
    const html = fs.readFileSync(file, 'utf8');
    const lineOf = (i) => html.slice(0, i).split('\n').length;
    // 1. inline scripts
    const re = /<script(\b[^>]*)>([\s\S]*?)<\/script>/gi;
    let m, n = 0;
    while ((m = re.exec(html))) {
        n++;
        const attrs = m[1];
        if (/\bsrc\s*=/.test(attrs) || !m[2].trim()) continue;
        const type = (attrs.match(/\btype\s*=\s*["']?([^"'\s>]+)/i) || [])[1];
        if (type && !/javascript|module/i.test(type)) continue;
        const tmp = path.join(os.tmpdir(), `lsh-check-${process.pid}-${n}.${type === 'module' ? 'mjs' : 'js'}`);
        fs.writeFileSync(tmp, m[2]);
        syntax(tmp, `${rel(file)} (inline <script> at line ${lineOf(m.index)})`);
        fs.unlinkSync(tmp);
    }
    // 4. no hand-written versions on local scripts and stylesheets (worker.js stampAssets adds them)
    const verRe = /\b(?:src|href)\s*=\s*["']\/?(?:js|css)\/[^"'?#]+\?v=[^"']*["']/gi;
    while ((m = verRe.exec(html))) problems.push(`${rel(file)} line ${lineOf(m.index)} writes a version by hand (${m[0]}): drop the "?v=…". The Worker adds each file's content fingerprint as it serves the page (worker.js stampAssets), so no branch edits, or collides on, version numbers.`);
    // 2. local references
    const refRe = /<(script|link|img|source|iframe)\b[^>]*?\b(src|href)\s*=\s*["']([^"'#?]+)[^"']*["']/gi;
    while ((m = refRe.exec(html))) {
        const url = m[3].trim();
        if (!url || /^(https?:|\/\/|data:|mailto:|tel:|javascript:|\$\{|blob:)/i.test(url)) continue;
        if (m[1].toLowerCase() === 'link' && !/\.(css|ico|png|svg|webmanifest|json)$/i.test(url)) continue;
        if (DYNAMIC.test(url.replace(/^\.\//, ''))) continue;
        refs++;
        const target = url.startsWith('/') ? path.join(ROOT, url) : path.join(path.dirname(file), url);
        if (!fs.existsSync(decodeURIComponent(target))) problems.push(`${rel(file)} line ${lineOf(m.index)} loads "${url}", which isn't in the repository`);
    }
}

for (const file of walk(ROOT)) {
    if (/\.(m?js|cjs)$/.test(file)) syntax(file, rel(file));
    else if (/\.html?$/.test(file)) checkHtml(file);
    else if (/\.json$/.test(file)) {
        try { JSON.parse(fs.readFileSync(file, 'utf8')); } catch (e) { problems.push(`${rel(file)} is not valid JSON: ${e.message}`); }
    }
}

console.log(`Checked ${scripts} scripts, ${pages} pages, ${refs} local file references.`);
if (problems.length) {
    console.log(`\n${problems.length} problem(s):\n`);
    problems.forEach((p, i) => console.log(`${i + 1}. ${p}\n`));
    process.exit(1);
}
console.log('All good.');
