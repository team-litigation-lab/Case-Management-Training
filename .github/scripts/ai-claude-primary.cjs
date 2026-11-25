// @check node — 🤖 With ANTHROPIC_API_KEY set, Claude (claude-opus-5-5, or ANTHROPIC_MODEL) answers every AI request first, through the Anthropic SDK: a grading at effort medium with 16,000 max_tokens and no 40,000-character cut, a call's line at effort low with 4,000, server-side fallbacks on, never a thinking or sampling setting; a 529, a 500, a 400 or a refusal falls back to the gateway, then to the Gemini keys, with one Claude request each; the AI check says via anthropic, or that Claude failed and what answered; the key is never returned; without the key nothing changes
// worker-claude.js viaClaude, worker.js callGemini (its first lines) and /api/ai-check, js/cm-ai-check.js. The Worker runs in Node
// (worker-harness.cjs); Claude's API (https://api.anthropic.com/v1/messages, which the SDK calls with fetch), the Portal's gateway and
// Gemini are answered here, so what reaches each is read as sent.
// Usage: node .github/scripts/ai-claude-primary.cjs
'use strict';
const { harness } = require('./worker-harness.cjs');

const J = (o, status = 200, headers = {}) => new Response(JSON.stringify(o), { status, headers: Object.assign({ 'Content-Type': 'application/json' }, headers) });
const msg = (text, extra = {}) => Object.assign({
    id: 'msg_test', type: 'message', role: 'assistant', model: 'claude-opus-5-5', stop_reason: 'end_turn', stop_sequence: null, stop_details: null,
    content: [{ type: 'thinking', thinking: '', signature: 'sig' }, { type: 'text', text: text.slice(0, 10) }, { type: 'text', text: text.slice(10) }],
    usage: { input_tokens: 10, output_tokens: 20 }
}, extra);
const apiErr = (status, type, message) => J({ type: 'error', error: { type, message } }, status);

(async () => {
    try { require.resolve('@anthropic-ai/sdk', { paths: [require('path').join(__dirname, '../..')] }); }
    catch (e) { console.log('✗ @anthropic-ai/sdk is not installed: run npm ci (package-lock.json) first.'); process.exit(1); }
    const fails = [], fail = (m) => fails.push(m);
    const h = await harness({ portalOnly: true });
    const KEY = 'sk-ant-test-key-never-returned-0123456789';
    h.env.PORTAL_URL = 'https://portal.test';
    const answer = '{"accuracyScore":30,"presenceScore":25,"riskScore":18,"efficiencyScore":12,"strengths":[],"blindspots":[],"growthSuggestions":[]}';
    let claudeAnswer = () => J(msg(answer)), gatewayRefuses = false;
    const claude = [], gateway = [], gemini = [];
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url, init = {}) => {
        const u = String(url && url.url ? url.url : url);
        if (u.startsWith('https://api.anthropic.com/v1/messages')) {
            const hd = new Headers(init.headers);
            claude.push({ url: u, body: JSON.parse(init.body), beta: hd.get('anthropic-beta') || '', key: hd.get('x-api-key') || String(hd.get('authorization') || '').replace(/^Bearer /, '') });   // the SDK sends the key as a bearer token
            return claudeAnswer();
        }
        if (u === 'https://portal.test/api/ai-gateway') {
            gateway.push(JSON.parse(init.body));
            return gatewayRefuses ? J({ success: false, error: 'Not allowed.' }, 401) : J({ success: true, text: answer, model: 'gw-model' });
        }
        if (/generativelanguage\.googleapis\.com/.test(u)) { gemini.push(u); return J({ candidates: [{ content: { parts: [{ text: answer }] } }] }); }
        return realFetch(url, init);
    };
    const logged = [], quiet = { error: console.error, warn: console.warn };
    console.error = (...a) => logged.push(['error', a.join(' ')]); console.warn = (...a) => logged.push(['warn', a.join(' ')]);
    const reset = () => { claude.length = 0; gateway.length = 0; gemini.length = 0; logged.length = 0; };
    const seen = [];   // every body the page got back, to be sure the key is in none of them
    const ask = async (feature, content, extra = {}) => {
        reset();
        const r = await h.api('/api/claude', Object.assign({ model: 'gemini', feature, max_tokens: 900, messages: [{ role: 'user', content }] }, extra), h.admin);
        seen.push(JSON.stringify(r.body)); return r;
    };
    const check = async () => { const c = await h.api('/api/ai-check', {}, h.admin); seen.push(JSON.stringify(c.body)); return c.body || {}; };
    const textOf = (r) => ((r.body && r.body.content) || []).map((b) => b.text || '').join('\n').trim();
    try {
        // 0. without ANTHROPIC_API_KEY nothing changes: the gateway answers, Claude is never called
        h.env.AI_GATEWAY_SECRET = 'gw-test-secret';
        let r = await ask('grading', 'Return ONLY a JSON object');
        if (claude.length || gateway.length !== 1 || r.body.provider !== 'gemini-gateway') fail(`without ANTHROPIC_API_KEY a grading should go to the gateway as before: claude ${claude.length}, gateway ${gateway.length}, ${JSON.stringify(r.body).slice(0, 160)}`);
        let c = await check();
        if (c.via !== 'gateway' || c.ok !== true || 'claude' in c) fail(`without ANTHROPIC_API_KEY the AI check should be as before: ${JSON.stringify(c)}`);

        h.env.ANTHROPIC_API_KEY = '  ' + KEY + '\n';
        // 1. a grading goes to Claude: the model, effort medium, 16,000 max_tokens, fallbacks on, nothing Opus 5.5 refuses
        const sys = 'You are the course grader.';
        r = await ask('grading', "EXERCISE: Day 2\nTRAINEE'S SUBMISSION:\nthe work\nReturn ONLY a JSON object", { system: sys });
        const s = claude[0];
        if (claude.length !== 1 || gateway.length || gemini.length) fail(`a grading should go to Claude alone: claude ${claude.length}, gateway ${gateway.length}, gemini ${gemini.length}`);
        if (s) {
            const b = s.body;
            if (b.model !== 'claude-opus-5-5') fail(`the default model should be claude-opus-5-5: ${b.model}`);
            if (!b.output_config || b.output_config.effort !== 'medium') fail(`a grading should go at effort medium: ${JSON.stringify(b.output_config)}`);
            if (!(b.max_tokens >= 16000)) fail(`a grading's max_tokens should leave room for thinking (at least 16,000), not the page's 900: ${b.max_tokens}`);
            if (b.fallbacks !== 'default' || !/server-side-fallback-2026-07-01/.test(s.beta)) fail(`server-side fallbacks should be on ("default", beta server-side-fallback-2026-07-01): ${JSON.stringify(b.fallbacks)} / ${s.beta}`);
            for (const k of ['thinking', 'temperature', 'top_p', 'top_k', 'stream']) if (k in b) fail(`Opus 5.5 should get no ${k} setting: ${JSON.stringify(b[k])}`);
            if (b.system !== sys) fail(`the page's system prompt should reach Claude: ${JSON.stringify(b.system)}`);
            if (!Array.isArray(b.messages) || b.messages.length !== 1 || b.messages[0].role !== 'user' || !/Return ONLY a JSON object/.test(b.messages[0].content)) fail(`the trainee's message should reach Claude: ${JSON.stringify(b.messages).slice(0, 200)}`);
            if (s.key !== KEY) fail('the SDK should send the trimmed ANTHROPIC_API_KEY');
        }
        const rb = r.body || {};
        if (r.status !== 200 || rb.provider !== 'anthropic' || rb.stop_reason !== 'end_turn' || rb.model !== 'claude-opus-5-5') fail(`Claude's answer should come back in the page's shape: ${r.status} ${JSON.stringify(rb).slice(0, 240)}`);
        if (!Array.isArray(rb.content) || rb.content.length !== 1 || rb.content[0].type !== 'text' || rb.content[0].text !== answer) fail(`the text blocks should be joined into one, the thinking block skipped: ${JSON.stringify(rb.content)}`);
        try { JSON.parse(textOf(r)); } catch (e) { fail(`the page's callAIJson should read the grading as JSON: ${textOf(r).slice(0, 120)}`); }
        // a trainer tool's review is a review too
        await ask('trainer', 'Return ONLY a JSON object');
        if (!claude[0] || claude[0].body.output_config.effort !== 'medium') fail(`a trainer tool's review should go at effort medium: ${claude[0] && JSON.stringify(claude[0].body.output_config)}`);
        // no gateway cut: Claude reads 1M tokens
        const big = 'EXERCISE head\n' + "the trainee's filed documents ".repeat(2200) + '\nReturn ONLY a JSON object';
        await ask('grading', big);
        if (!claude[0] || claude[0].body.messages[0].content !== big) fail(`a ${big.length.toLocaleString('en-US')}-character grading should reach Claude whole, not cut to the gateway's 40,000`);

        // 2. a live call's line: effort low, 4,000 max_tokens
        for (const f of ['chat', 'call']) {
            await ask(f, 'Hello, this is the adjuster.');
            const b = claude[0] && claude[0].body;
            if (!b || b.output_config.effort !== 'low' || b.max_tokens !== 4000) fail(`a ${f} line should go at effort low with 4,000 max_tokens: ${b && JSON.stringify({ e: b.output_config, m: b.max_tokens })}`);
        }
        // ANTHROPIC_MODEL overrides the model
        h.env.ANTHROPIC_MODEL = 'claude-sonnet-5-5';
        await ask('grading', 'Return ONLY a JSON object');
        if (!claude[0] || claude[0].body.model !== 'claude-sonnet-5-5') fail(`ANTHROPIC_MODEL should choose the model: ${claude[0] && claude[0].body.model}`);
        delete h.env.ANTHROPIC_MODEL;

        // 3. a 529 falls back to the gateway; one Claude request, never retried
        claudeAnswer = () => apiErr(529, 'overloaded_error', 'Overloaded');
        r = await ask('grading', 'Return ONLY a JSON object');
        if (claude.length !== 1) fail(`a 529 should cost one Claude request, never a retry: ${claude.length}`);
        if (r.status !== 200 || r.body.provider !== 'gemini-gateway' || gateway.length !== 1) fail(`a 529 from Claude should fall back to the gateway: ${r.status} ${JSON.stringify(r.body).slice(0, 160)}`);
        c = await check();
        if (c.ok !== true || c.via !== 'gateway' || !c.claude || !/overloaded/i.test(c.claude.reason || '') || c.claude.status !== 529) fail(`the AI check should say Claude was overloaded and the gateway answered: ${JSON.stringify(c)}`);
        // a 500, with the gateway refusing this site's key: the Gemini keys answer
        claudeAnswer = () => apiErr(500, 'api_error', 'Internal server error');
        gatewayRefuses = true; h.env.GEMINI_API_KEY = 'own-gemini-key';
        r = await ask('grading', 'Return ONLY a JSON object');
        if (claude.length !== 1 || gateway.length !== 1 || !gemini.length || r.status !== 200 || r.body.provider !== 'gemini') fail(`a 500 from Claude with the gateway refusing should be graded with the Gemini keys: claude ${claude.length}, gateway ${gateway.length}, gemini ${gemini.length}, ${r.status} ${JSON.stringify(r.body).slice(0, 160)}`);
        c = await check();
        if (c.ok !== false || c.fallback !== true || !/Not allowed \(401\)/.test(c.error || '') || !c.key || !c.claude || c.claude.status !== 500) fail(`the AI check should keep the gateway's refusal and fingerprint, and say Claude failed: ${JSON.stringify(c)}`);
        gatewayRefuses = false; delete h.env.GEMINI_API_KEY;

        // 4. a refusal is a failure: the next route answers
        claudeAnswer = () => J(Object.assign(msg(''), { content: [], stop_reason: 'refusal', stop_details: { type: 'refusal', category: 'cyber', explanation: 'x' } }));
        r = await ask('grading', 'Return ONLY a JSON object');
        if (claude.length !== 1 || r.status !== 200 || r.body.provider !== 'gemini-gateway') fail(`a refusal should fall back to the gateway: ${r.status} ${JSON.stringify(r.body).slice(0, 160)}`);
        c = await check();
        if (!c.claude || !/refusal/.test(c.claude.reason || '')) fail(`the AI check should say Claude declined: ${JSON.stringify(c)}`);

        // 5. a 400 is our bug: logged, and the grading still goes on
        claudeAnswer = () => apiErr(400, 'invalid_request_error', 'messages: field required');
        r = await ask('grading', 'Return ONLY a JSON object');
        if (r.status !== 200 || r.body.provider !== 'gemini-gateway') fail(`a 400 from Claude should fall back too: ${r.status} ${JSON.stringify(r.body).slice(0, 160)}`);
        if (!logged.some(([lv, m]) => lv === 'error' && /400/.test(m))) fail(`a 400 from Claude should be logged as an error: ${JSON.stringify(logged)}`);
        // a refused key, a 429 and a network failure fall back the same way
        for (const [name, fn] of [['a 401', () => apiErr(401, 'authentication_error', 'invalid x-api-key')], ['a 429', () => apiErr(429, 'rate_limit_error', 'Rate limited')], ['a network failure', () => { throw new TypeError('fetch failed'); }]]) {
            claudeAnswer = fn;
            r = await ask('grading', 'Return ONLY a JSON object');
            if (claude.length !== 1 || r.status !== 200 || r.body.provider !== 'gemini-gateway') fail(`${name} from Claude should fall back to the gateway with one Claude request: claude ${claude.length}, ${r.status} ${JSON.stringify(r.body).slice(0, 160)}`);
        }

        // 6. Claude alone, failing: the page is told Claude didn't answer (a 502 it retries; 429 stays 429)
        delete h.env.AI_GATEWAY_SECRET;
        claudeAnswer = () => apiErr(529, 'overloaded_error', 'Overloaded');
        r = await ask('grading', 'Return ONLY a JSON object');
        if (r.status !== 502 || !/Claude didn't answer: overloaded/.test(((r.body || {}).error || {}).message || '')) fail(`with Claude alone, a 529 should reach the page as a 502 naming Claude: ${r.status} ${JSON.stringify(r.body)}`);
        claudeAnswer = () => apiErr(429, 'rate_limit_error', 'Rate limited');
        r = await ask('chat', 'Hello');
        if (r.status !== 429) fail(`with Claude alone, a 429 should stay a 429: ${r.status}`);
        c = await check();
        if (c.ok !== false || !/Claude didn't answer/.test(c.error || '')) fail(`the AI check with Claude alone, failing, should say so: ${JSON.stringify(c)}`);
        // Claude alone, answering: the AI check says via anthropic, with the model
        claudeAnswer = () => J(msg('{"ok": true}'));
        c = await check();
        if (c.ok !== true || c.via !== 'anthropic' || c.model !== 'claude-opus-5-5' || c.claude || c.key) fail(`the AI check should say Claude answered (via anthropic, the model): ${JSON.stringify(c)}`);
        h.env.AI_GATEWAY_SECRET = 'gw-test-secret';
        c = await check();
        if (c.ok !== true || c.via !== 'anthropic' || c.fallback) fail(`with the gateway set up too, the AI check should still say Claude answered: ${JSON.stringify(c)}`);

        // 7. the page's words for it (js/cm-ai-check.js summary, which ⚡ Run now reuses)
        const src = require('fs').readFileSync(require('path').join(__dirname, '../../js/cm-ai-check.js'), 'utf8');
        const grab = (name) => { const m = src.match(new RegExp(`(?:function ${name}\\(r\\)\\{[\\s\\S]*?\\n\\}|const ${name} = [^\\n]+)`)); return m ? m[0] : ''; };
        const summary = new Function(`${grab('works')}\n${grab('claudeNote')}\n${grab('summary')}\nreturn summary;`)();
        const said = summary({ ok: true, via: 'anthropic', model: 'claude-opus-5-5', ms: 2300 });
        if (said !== '✅ AI grading works: Claude (claude-opus-5-5) answered in 2.3 s.') fail(`the AI check should read "✅ AI grading works: Claude (model) answered in N s": ${said}`);
        const fellBack = summary({ ok: true, via: 'gateway', host: 'portal.test', model: 'gw-model', ms: 1000, claude: { model: 'claude-opus-5-5', status: 529, reason: 'overloaded (529): Overloaded' } });
        if (!/gateway \(portal\.test\) answered/.test(fellBack) || !/Claude \(claude-opus-5-5\) didn't answer: overloaded/.test(fellBack)) fail(`when Claude failed, the AI check should say what answered and that Claude didn't: ${fellBack}`);

        // 8. the key is never returned
        if (seen.some((b) => b.includes(KEY) || b.includes(KEY.slice(0, 20)))) fail('ANTHROPIC_API_KEY must never be returned to the page');
    } finally { globalThis.fetch = realFetch; console.error = quiet.error; console.warn = quiet.warn; }
    if (fails.length) { console.log(`✗ Claude as the primary AI (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
    console.log('Claude as the primary AI: gradings at effort medium (16,000 max_tokens, no cut), call lines at effort low (4,000), fallbacks on; a 529, 500, 400, 401, 429, network failure or refusal falls back to the gateway, then to the Gemini keys, with one Claude request; the AI check says via anthropic or why Claude failed; the key is never returned; without it nothing changes.');
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
