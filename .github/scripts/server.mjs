// Local stand-in for Cloudflare: serves the site through worker.js with an
// in-memory KV store, so the smoke test runs without an account.
// Usage: node tests/server.mjs [port]   (run from the repository root)
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const PORT = Number(process.argv[2] || process.env.PORT || 8787);
const worker = (await import(pathToFileURL(path.join(ROOT, 'worker.js')).href)).default;
const store = new Map();
const KV = {
    get: async (k) => (store.has(k) ? store.get(k) : null),
    put: async (k, v) => { store.set(k, String(v)); },
    delete: async (k) => { store.delete(k); },
    list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true })
};
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.pdf': 'application/pdf', '.png': 'image/png', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.mp4': 'video/mp4', '.vtt': 'text/vtt' };
const ASSETS = {
    fetch: async (req) => {
        let p = decodeURIComponent(new URL(req.url).pathname);
        if (p.endsWith('/')) p += 'index.html';
        const f = path.join(ROOT, p);
        if (!f.startsWith(ROOT) || !fs.existsSync(f) || fs.statSync(f).isDirectory()) return new Response('Not found', { status: 404 });
        const type = TYPES[path.extname(f)] || 'application/octet-stream', buf = fs.readFileSync(f);
        // a byte range, as Cloudflare's assets answer one (a video seeks with it)
        const m = /^bytes=(\d+)-(\d*)$/.exec(req.headers.get('Range') || '');
        if (m && Number(m[1]) < buf.length) {
            const a = Number(m[1]), b = m[2] ? Math.min(Number(m[2]), buf.length - 1) : buf.length - 1;
            return new Response(buf.subarray(a, b + 1), { status: 206, headers: { 'Content-Type': type, 'Accept-Ranges': 'bytes', 'Content-Range': `bytes ${a}-${b}/${buf.length}` } });
        }
        return new Response(buf, { headers: { 'Content-Type': type, 'Accept-Ranges': 'bytes' } });
    }
};
const env = { LSH_KV: KV, ASSETS, SESSION_SECRET: 'ci-only-secret' };
http.createServer(async (req, res) => {
    const chunks = []; for await (const c of req) chunks.push(c);
    const r = new Request(`http://localhost:${PORT}${req.url}`, { method: req.method, headers: req.headers, body: ['GET', 'HEAD'].includes(req.method) ? undefined : Buffer.concat(chunks) });
    try {
        const out = await worker.fetch(r, env, { waitUntil() {} });
        res.writeHead(out.status, Object.fromEntries(out.headers)); res.end(Buffer.from(await out.arrayBuffer()));
    } catch (e) { res.writeHead(500); res.end(String(e && e.stack || e)); }
}).listen(PORT, () => console.log(`listening on ${PORT}`));
