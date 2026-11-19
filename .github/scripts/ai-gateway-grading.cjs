// @check node — An AI grading reaches the Portal's AI gateway as a grading (its JSON request: the grading model, the day's review reserve, never held back by the CMS flow's share of the day) and never over the gateway's 40,000 characters (a long AI Grader submission is cut in the middle, its head and tail kept); a chat line stays a chat line; 🤖 the AI check (trainers only) says whether the gateway answers, and a refused key names AI_GATEWAY_SECRET
// worker.js viaGateway: the page's callAIJson sends feature "grading" (runRubricEvaluation: every Skill Activity, takeaway,
// random task and Think it through) or "trainer" (the trainer tools). Sent as plain chat, a grading went to the gateway's
// chat model with a chat line's 20 s, outside the review reserve, and was refused once live calls had used the CMS flow's
// share of the day; and a submission over 40,000 characters was refused outright (413): AI-graded scores stayed blank.
// The Worker runs in Node (worker-harness.cjs) with the gateway answered here, so what reaches it is read as sent.
// Usage: node .github/scripts/ai-gateway-grading.cjs
'use strict';
const { harness } = require('./worker-harness.cjs');

(async () => {
    const fails = [], fail = (m) => fails.push(m);
    const h = await harness({ portalOnly: true });
    h.env.AI_GATEWAY_SECRET = 'gw-test-secret';
    h.env.PORTAL_URL = 'https://portal.test';
    const sent = [], realFetch = globalThis.fetch;
    const answer = '{"accuracyScore":30,"presenceScore":25,"riskScore":18,"efficiencyScore":12,"strengths":[],"blindspots":[],"growthSuggestions":[]}';
    let refuse = false;   // the gateway refusing this site's key, as the Portal does when the secrets differ
    globalThis.fetch = async (url, init) => {
        if (String(url) === 'https://portal.test/api/ai-gateway') {
            sent.push({ body: JSON.parse(init.body), key: (init.headers || {})['X-Gateway-Key'] });
            if (refuse) return new Response(JSON.stringify({ success: false, error: 'Not allowed.' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
            return new Response(JSON.stringify({ success: true, text: answer, model: 'test-model' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        return realFetch(url, init);
    };
    const ask = async (feature, content) => {
        sent.length = 0;
        const r = await h.api('/api/claude', { model: 'gemini', feature, max_tokens: 900, messages: [{ role: 'user', content }] }, h.admin);
        return { r, s: sent[0] };
    };
    const chars = (b) => String(b.system || '').length + b.messages.reduce((a, m) => a + String(m.text || '').length, 0);
    try {
        // 1. a grading: the gateway's JSON request, as it is when it fits
        const small = "EXERCISE: Day 2 · a Skill Activity\nTRAINEE'S SUBMISSION:\nthe trainee's work\nReturn ONLY a JSON object";
        let { r, s } = await ask('grading', small);
        if (r.status !== 200 || !s) fail(`a grading should reach the gateway and come back: ${r.status} ${JSON.stringify(r.body).slice(0, 200)}`);
        else {
            if (s.body.json !== true) fail(`a grading should go as the gateway's JSON request (json: true), not as chat: ${JSON.stringify(s.body).slice(0, 200)}`);
            if (s.body.module !== 'cms' || s.key !== 'gw-test-secret') fail(`a grading should go as the "cms" flow with this Worker's gateway key: ${s.body.module} ${s.key}`);
            if (s.body.messages[0].text !== small) fail('a grading that fits should go word for word');
            const text = ((r.body.content || [])[0] || {}).text;
            if (text !== answer) fail(`the gateway's answer should come back as the page reads it: ${JSON.stringify(r.body).slice(0, 200)}`);
        }
        // 2. a trainer tool's review too
        ({ s } = await ask('trainer', 'Return ONLY a JSON object'));
        if (!s || s.body.json !== true) fail(`a trainer tool's review should go as the gateway's JSON request: ${s ? JSON.stringify(s.body).slice(0, 160) : 'nothing sent'}`);
        // 3. a live call's line stays a chat line
        ({ s } = await ask('chat', 'Hello, this is the adjuster.'));
        if (!s || s.body.json !== false || s.body.fast !== true) fail(`a live call's line should stay a fast chat request: ${s ? JSON.stringify(s.body).slice(0, 160) : 'nothing sent'}`);
        // 4. a submission over the gateway's 40,000 characters: cut in the middle, head and tail kept, and said
        const head = 'EXERCISE: Day 2 · Case Flow Day 2 · the head of the prompt', tail = 'Return ONLY a JSON object with this exact shape: the tail';
        const big = head + '\n' + 'the trainee\'s filed documents '.repeat(2200) + '\n' + tail;
        ({ r, s } = await ask('grading', big));
        if (!s) fail(`a ${big.length.toLocaleString('en-US')}-character grading should still reach the gateway (${r.status})`);
        else {
            const t = s.body.messages[0].text;
            if (chars(s.body) > 40000) fail(`a long grading should fit the gateway's 40,000 characters: ${chars(s.body)}`);
            if (!t.startsWith(head) || !t.endsWith(tail)) fail("the cut should keep the head (what is graded) and the tail (the rubric and the answer's shape)");
            if (!/characters left out here/.test(t)) fail('the cut should say that characters were left out');
            if (chars(s.body) < 30000) fail(`the cut should keep as much of the work as fits: ${chars(s.body)} characters sent`);
        }
        // 5. 🤖 the AI check (Admin → ⚙ Settings): a working gateway, a refused key, and trainers only
        let c = await h.api('/api/ai-check', {}, h.admin);
        if (c.status !== 200 || !c.body || c.body.ok !== true || c.body.via !== 'gateway' || c.body.host !== 'portal.test') fail(`the AI check should say a working gateway works: ${c.status} ${JSON.stringify(c.body)}`);
        else if (!sent[sent.length - 1] || sent[sent.length - 1].body.json !== true) fail('the AI check should send a grading as a trainee\'s is (a JSON request)');
        refuse = true;
        c = await h.api('/api/ai-check', {}, h.admin);
        if (!c.body || c.body.ok !== false || !/AI_GATEWAY_SECRET must be the same/.test(c.body.error || '')) fail(`a refused key should read as such, naming AI_GATEWAY_SECRET: ${JSON.stringify(c.body)}`);
        const g = await ask('grading', small);
        if (g.r.status !== 502 || !/Not allowed\..*AI_GATEWAY_SECRET must be the same/.test(((g.r.body || {}).error || {}).message || '')) fail(`a grading the gateway refuses should say whose key it is: ${g.r.status} ${JSON.stringify(g.r.body)}`);
        refuse = false;
        const t = await h.portal('Ai', 'Checker', 'B100926');
        const tt = t.body && t.body.token;
        if (!tt) fail(`a trainee's sign-in should give a token: ${JSON.stringify(t.body)}`);
        else { c = await h.api('/api/ai-check', {}, tt); if (c.status !== 403) fail(`a trainee shouldn't run the AI check: ${c.status} ${JSON.stringify(c.body)}`); }
    } finally { globalThis.fetch = realFetch; }
    if (fails.length) { console.log(`✗ AI gradings through the gateway (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
    console.log("AI gradings through the gateway: a grading and a trainer tool's review go as its JSON request (the grading model, the review reserve), a live call's line as a chat line, and a 66,000-character submission is cut to fit its 40,000, head and tail kept.");
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
