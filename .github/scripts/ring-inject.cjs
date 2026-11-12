// The injected call (js/cm-case-flow.js, cmCaseFlow.ring): the trainer rings every trainee's LSH Ring Channel.
// 1. the Worker: a trainee reads call-inject-day<N> (the trainer's shared record) but can't write it;
// 2. in a browser: the trainee's page rings on its own (any page, within the 15-second check); Decline is a missed call,
//    logged on their file and counted 0 on the Scorecard's 📞 Case Calls; a new ring answered opens the graded call;
//    a ring already answered or missed never rings again.
// Usage: node .github/scripts/ring-inject.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const path = require('path'); const { pathToFileURL } = require('url');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

async function workerChecks() {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map([['cm:trainee:ana-cruz--b1', JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true })], ['cm:call-inject-day1', JSON.stringify({ active: true, id: 'x', blockId: 'b', who: 'Margaret Doe' })]]);
    const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) } };
    const call = async (p, body, token) => { const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() {} }); return { status: res.status, body: await res.json().catch(() => null) }; };
    const t = (await call('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B1' })).body.token;
    const read = await call('/api/storage/get', { key: 'call-inject-day1' }, t);
    if (read.status !== 200 || !/Margaret Doe/.test((read.body || {}).value || '')) fail(`a trainee can't read the injected call: ${JSON.stringify(read)}`);
    const w = await call('/api/storage/set', { key: 'call-inject-day1', value: '{"active":false}' }, t);
    if (w.status !== 403 || /"active":false/.test(store.get('cm:call-inject-day1'))) fail(`a trainee could write the injected call: ${JSON.stringify(w)}`);
}

(async () => {
    await workerChecks();
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1360, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Rhea', 'Ring' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
    const id = await page.evaluate(() => state.traineeId);
    const rec = await page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || '{}'), 'trainee:' + id);
    rec.approved = true; await put('trainee:' + id, rec);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2500);
    await page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });
    // a day with a Live Call, and its block
    const target = await page.evaluate(() => { const S = window.CM_CF_SIM || {}; const blockId = Object.keys(S.calls || {})[0];
        const d = DAYS.find(d => d.cf && d.lessons.some(l => l.cf && l.cf.block.id === blockId)); return { dayId: d && d.id, blockId, who: S.calls[blockId].who }; });
    if (!target.dayId) { fail('no day has a Live Call to ring'); }
    const ringOnce = async (stamp) => {
        await put('call-inject-day' + target.dayId, { active: true, id: stamp, at: new Date().toISOString(), dayId: target.dayId, blockId: target.blockId, who: target.who });
        return page.waitForSelector('#cfRing', { timeout: 25000 }).then(() => true).catch(() => false);
    };
    // 1. it rings on a page that isn't the dashboard; Decline = a missed call
    await page.evaluate(() => goto('casedocs'));
    const s1 = new Date(Date.now() - 1000).toISOString();
    if (!(await ringOnce(s1))) fail('the injected call never rang the trainee');
    else {
        const txt = await page.locator('#cfRing').innerText();
        if (!txt.includes(target.who)) fail(`the ring should say who's calling (${target.who}): "${txt}"`);
        await page.click('#cfRing .cf-ring-no');
        const logged = await page.evaluate(async (s) => { const v = await storeGet('case-flow'); return v && v.injects && v.injects[s]; }, s1);
        if (!logged || logged.outcome !== 'missed') fail(`a declined call should be logged missed on the trainee's file: ${JSON.stringify(logged)}`);
        await page.waitForTimeout(20000);
        if (await page.locator('#cfRing').count()) fail('a call already declined rang again');
        const card = await page.evaluate(async () => { const v = await storeGet('case-flow');
            const src = cmScorecard.sources.find(s => s.id === 'cc'); return src ? src.items({ rec: {}, cf: {}, data: { 'case-flow': v, roleplayHistory: [] } }) : null; });
        if (!card || !card.some(x => x.pct === 0 && /Missed/.test(x.note))) fail(`the Scorecard's Case Calls should count the missed call as 0: ${JSON.stringify(card)}`);
    }
    // 2. a new ring, answered: the graded call opens
    if (!(await ringOnce(new Date().toISOString()))) fail('a second injected call never rang');
    else {
        await page.click('#cfRing .cf-ring-yes');
        await page.waitForTimeout(800);
        const v = await page.evaluate(() => ({ view: state.view, topic: state.rpSession && state.rpSession.topic.id }));
        if (v.view !== 'openroleplay' || v.topic !== 'cf-' + target.blockId) fail(`answering should open the graded call: ${JSON.stringify(v)}`);
    }
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('The injected call rings every trainee on any page: Decline (or no answer) is a missed call, logged on their file and counted 0 under 📞 Case Calls; Answer opens the graded call; a call handled never rings again. Trainees read the ring but can\'t write it.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
