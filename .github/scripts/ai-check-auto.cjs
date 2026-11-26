// @check node — 🤖 The AI check runs by itself every 2 hours (the Worker's cron, even UTC hours) and keeps its result; ⚙ Settings reads the latest without running it again (no AI call); a trainer's Run it now runs it, is kept as theirs and counted in the day's checks
// worker.js aiCheckRun / aiCheckSave / aiCheckLatest, the scheduled() handler and /api/ai-check ({latest: true} or a run).
// The Worker runs in Node (worker-harness.cjs) with the Portal's AI gateway answered here, so every AI call is counted.
// Usage: node .github/scripts/ai-check-auto.cjs
'use strict';
const path = require('path');
const { pathToFileURL } = require('url');
const { harness } = require('./worker-harness.cjs');

(async () => {
    const fails = [], fail = (m) => fails.push(m);
    const worker = (await import(pathToFileURL(path.join(__dirname, '../../worker.js')).href)).default;
    const h = await harness({ portalOnly: true });
    h.env.AI_GATEWAY_SECRET = 'gw-test-secret';
    h.env.PORTAL_URL = 'https://portal.test';
    let calls = 0;
    const realFetch = globalThis.fetch;
    globalThis.fetch = async (url, init) => {
        if (String(url) === 'https://portal.test/api/ai-gateway') {
            calls++;
            return new Response(JSON.stringify({ success: true, text: '{"ok": true}', model: 'test-model' }), { status: 200, headers: { 'Content-Type': 'application/json' } });
        }
        if (/googleapis|accounts\.google/.test(String(url))) return new Response('{}', { status: 404 });   // the Drive work the cron also does: nothing linked here
        return realFetch(url, init);
    };
    const tick = async (iso) => {
        const waits = [];
        await worker.scheduled({ scheduledTime: Date.parse(iso), cron: '0 * * * *' }, h.env, { waitUntil: (p) => waits.push(p) });
        await Promise.all(waits);
    };
    try {
        // nothing kept yet
        let r = await h.api('/api/ai-check', { latest: true }, h.admin);
        if (r.status !== 200 || (r.body && r.body.last)) fail(`before any check, the latest is empty: ${r.status} ${JSON.stringify(r.body)}`);
        // a firing with no scheduledTime (the Drive checks call scheduled() so) or of the nightly cron: never the check
        await worker.scheduled({ cron: '0 7 * * *' }, h.env, { waitUntil: (p) => p });
        await worker.scheduled({ cron: '0 * * * *' }, h.env, { waitUntil: (p) => p });
        if (calls !== 0) fail(`a firing without the hourly cron's scheduledTime should run no AI check (${calls} AI calls)`);
        // an odd hour: no check
        await tick('2026-11-26T03:00:00Z');
        if (calls !== 0) fail(`an odd-hour tick should run no AI check (${calls} AI calls)`);
        // an even hour: the check runs and is kept, as automatic
        await tick('2026-11-26T04:00:00Z');
        if (calls !== 1) fail(`an even-hour tick should run the AI check once (${calls} AI calls)`);
        const before = calls;
        r = await h.api('/api/ai-check', { latest: true }, h.admin);
        const last = r.body && r.body.last;
        if (!last || last.ok !== true || last.by !== 'auto' || !last.at) fail(`the automatic check should be kept, ok and by "auto": ${JSON.stringify(r.body)}`);
        if (calls !== before) fail('reading the latest result must not run the check again');
        // a trainer's Run it now: runs, kept as the trainer's, the day has 2 checks
        r = await h.api('/api/ai-check', {}, h.admin);
        if (calls !== before + 1 || !r.body || r.body.ok !== true || r.body.by !== 'trainer') fail(`Run it now should run the check and keep it as the trainer's: ${JSON.stringify(r.body)}`);
        const runs = ((r.body && r.body.day) || {}).runs || [];
        if (runs.length !== 2 || runs[0].by !== 'auto' || runs[1].by !== 'trainer') fail(`the day should list both checks, the automatic one first: ${JSON.stringify(r.body && r.body.day)}`);
        // a trainee can't read or run it
        const t = await h.portal('Ai', 'Auto', 'B100926');
        const c = await h.api('/api/ai-check', { latest: true }, t.body && t.body.token);
        if (c.status !== 403) fail(`a trainee shouldn't read the AI check: ${c.status}`);
    } finally { globalThis.fetch = realFetch; }
    if (fails.length) { console.log(`✗ The AI check by itself every 2 hours (${fails.length}):\n  ` + fails.join('\n  ')); process.exit(1); }
    console.log('The AI check: the cron runs it on the even hours and keeps the result, reading the latest runs nothing, a trainer\'s Run it now is kept as theirs and counted in the day.');
})().catch((e) => { console.log('✗ ' + ((e && e.stack) || e)); process.exit(1); });
