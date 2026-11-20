// @check node — 🤖 The AI check shows a fingerprint of the gateway key this site sends (its length and SHA-256 prefix, never the key), the same one the page works out for a pasted value; a key the Portal refuses is said even when this Worker's own Gemini keys carry the grading
// worker-ai-key.js, worker.js /api/ai-check and callGemini, js/cm-ai-check.js print(). The owner set AI_GATEWAY_SECRET on both
// sides and the Portal still answered 401 "Not allowed.": neither Cloudflare page shows a secret once saved, so nobody could tell
// which side held the other value. The fingerprint settles it.
// Usage: node .github/scripts/ai-key-fingerprint.cjs
'use strict';
const crypto = require('crypto');
const { harness } = require('./worker-harness.cjs');

(async () => {
    const fails = [], fail = (m) => fails.push(m);
    const h = await harness({ portalOnly: true });
    const SECRET = 'gw-test-secret-1234';
    h.env.AI_GATEWAY_SECRET = '  ' + SECRET + '\n';   // pasted with spaces and a newline: the Portal trims, and so does the print
    h.env.PORTAL_URL = 'https://portal.test';
    const want = { len: SECRET.length, fp: crypto.createHash('sha256').update(SECRET).digest('hex').slice(0, 8) };
    let refuse = true, direct = 0;
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
        const u = String(url);
        if (u === 'https://portal.test/api/ai-gateway') return refuse
            ? new Response(JSON.stringify({ success: false, error: 'Not allowed.' }), { status: 401, headers: { 'Content-Type': 'application/json' } })
            : new Response(JSON.stringify({ success: true, text: '{"ok": true}', model: 'gw-model' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        if (/generativelanguage\.googleapis\.com/.test(u)) { direct++; return new Response(JSON.stringify({ candidates: [{ content: { parts: [{ text: '{"ok": true}' }] } }] }), { status: 200, headers: { 'Content-Type': 'application/json' } }); }
        return realFetch(url, init);
    };
    try {
        // 1. refused, no Gemini keys of its own: the check says so, with the fingerprint
        let c = await h.api('/api/ai-check', {}, h.admin);
        const b = c.body || {};
        if (b.ok !== false || !/AI_GATEWAY_SECRET must be the same/.test(b.error || '')) fail(`a refused key should still read as such: ${JSON.stringify(b)}`);
        if (!b.key || b.key.fp !== want.fp || b.key.len !== want.len) fail(`the check should show the trimmed key's fingerprint ${JSON.stringify(want)}: ${JSON.stringify(b.key)}`);
        if (JSON.stringify(b).includes(SECRET)) fail('the check must never return the key itself');
        // 2. refused, with this Worker's own Gemini key: grading carries on, and the check still says the gateway refused
        h.env.GEMINI_API_KEY = 'own-key';
        const g = await h.api('/api/claude', { model: 'gemini', feature: 'grading', max_tokens: 200, messages: [{ role: 'user', content: 'Return ONLY a JSON object' }] }, h.admin);
        if (g.status !== 200 || !direct) fail(`with its own Gemini key, a grading the gateway refuses should be graded with it: ${g.status} ${JSON.stringify(g.body).slice(0, 200)}`);
        c = await h.api('/api/ai-check', {}, h.admin);
        if (!c.body || c.body.ok !== false || c.body.fallback !== true || !/Not allowed \(401\)/.test(c.body.error || '')) fail(`the check should still say the gateway refused, and that the site's own keys carry on: ${JSON.stringify(c.body)}`);
        // 3. accepted: the check passes, the fingerprint still shown
        refuse = false; direct = 0;
        c = await h.api('/api/ai-check', {}, h.admin);
        if (!c.body || c.body.ok !== true || c.body.fallback || direct) fail(`an accepted key should pass through the gateway: ${JSON.stringify(c.body)} (direct ${direct})`);
        delete h.env.GEMINI_API_KEY;
    } finally { globalThis.fetch = realFetch; }
    // 4. the page's own print of a pasted value is the same fingerprint (js/cm-ai-check.js print)
    const src = require('fs').readFileSync(require('path').join(__dirname, '../../js/cm-ai-check.js'), 'utf8');
    const m = /async function print\(v\)\{[\s\S]*?\n\}/.exec(src);
    if (!m) fail('js/cm-ai-check.js should have print(v)');
    else {
        const print = new Function('crypto', 'TextEncoder', 'window', `${m[0]}; return print;`)(globalThis.crypto, TextEncoder, { crypto: globalThis.crypto });
        const p = await print(' ' + SECRET + ' ');
        if (!p || p.fp !== want.fp || p.len !== want.len) fail(`the page's fingerprint of a pasted value should match the Worker's: ${JSON.stringify(p)} vs ${JSON.stringify(want)}`);
    }
    if (fails.length) { console.log(`✗ AI key fingerprint (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
    console.log(`🔑 AI check: the gateway key's fingerprint (${want.fp} · ${want.len}) is shown, never the key, and matches the page's own print of a pasted value; a refused key is said even while this Worker's Gemini keys carry the grading.`);
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
