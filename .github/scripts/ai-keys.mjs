// The Gemini key pool in worker.js, with Gemini faked. Checks the things that keep a whole class
// using the AI features at once, and that a key out of credits never stops the course:
//   - every GEMINI_API_KEY secret is in the pool: GEMINI_API_KEY and any numbered one, above 9 too;
//   - keys take turns, so one key isn't spent first;
//   - a key that answers 429 (credits or rate limit used up) rests and the request moves to the
//     next key; later requests skip the resting key;
//   - a key Google rejects rests (a 401 included, and never passed on as a 401); a busy (503) key hands over; a missing model falls through;
//   - with every key out of credits the answer says so (429), not "no key configured" — and the Worker
//     tries the resting keys anyway rather than refusing, since the soonest may be back (geminiKeyOrder).
// Usage: node .github/scripts/ai-keys.mjs   (from the repository root)
import path from 'path';
import { pathToFileURL } from 'url';

const ROOT = process.cwd();
const WORKER = pathToFileURL(path.join(ROOT, 'worker.js')).href;
// Each scenario gets its own copy of the module, so the resting keys and whose turn it is start clean.
let load = 0;
const freshWorker = () => import(`${WORKER}?n=${++load}`);

const failures = [];
const check = (ok, msg) => { if (!ok) failures.push(msg); };

// A fake Gemini. behavior(key, model) → { status, json }
let calls = [], behavior = () => ({ status: 200, json: ok('hi') });
const ok = (text) => ({ candidates: [{ content: { parts: [{ text }] }, finishReason: 'STOP' }] });
globalThis.fetch = async (url, init) => {
    const u = String(url);
    const model = decodeURIComponent(u.match(/models\/([^:]+):/)[1]);
    const key = init.headers['x-goog-api-key'];
    calls.push({ key, model });
    const r = behavior(key, model);
    return new Response(JSON.stringify(r.json), { status: r.status, headers: { 'Content-Type': 'application/json' } });
};

// Open mode (no MASTER_ADMIN_PASSWORD), so the AI proxy answers without a session token.
// GEMINI_API_KEY14 is above the 9 the pool used to stop at.
const keysEnv = () => ({ GEMINI_API_KEY: 'k0', GEMINI_API_KEY1: 'k1', GEMINI_API_KEY14: 'k14' });
const POOLED = ['k0', 'k1', 'k14'];
const ask = (worker, env) => worker.default.fetch(
    new Request('https://cm.test/api/ai', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ messages: [{ role: 'user', content: 'hello' }], max_tokens: 200 }) }),
    env, { waitUntil() {}, passThroughOnException() {} });
const textOf = async (res) => { const b = await res.json(); return b && b.content ? b.content[0].text : ''; };

/* 1. every key is in the pool (numbers above 9 included) and they take turns */
{
    const worker = await freshWorker();
    calls = []; behavior = (key) => ({ status: 200, json: ok('from ' + key) });
    const env = keysEnv();
    for (let i = 0; i < 6; i++) await ask(worker, env);
    const used = calls.map(c => c.key);
    POOLED.forEach(k => check(used.includes(k), `${k} was never used: a numbered key above 9 is not in the pool`));
    check(POOLED.every(k => used.filter(x => x === k).length === 2), `keys didn't take turns evenly: ${used.join(',')}`);
}

/* 2. a key out of credits rests; the request moves on, and later requests skip it */
{
    const worker = await freshWorker();
    calls = [];
    behavior = (key) => key === 'k1'
        ? { status: 429, json: { error: { message: 'You exceeded your current quota (requests per day)' } } }
        : { status: 200, json: ok('from ' + key) };
    const env = keysEnv(), got = [];
    for (let i = 0; i < 6; i++) got.push(await textOf(await ask(worker, env)));
    check(got.every(t => t === 'from k0' || t === 'from k14'), `a key that was out of credits answered: ${got.join(' | ')}`);
    const tried = calls.filter(c => c.key === 'k1').length;
    check(tried === 1, `the key out of credits was tried ${tried} times (it should rest after 1)`);
}

/* 3. a rejected key rests too; a busy key hands over; a missing model falls through to the next */
{
    const worker = await freshWorker();
    calls = [];
    let firstModel = null;
    behavior = (key, model) => {
        if (!firstModel) firstModel = model;
        if (key === 'k0') return { status: 400, json: { error: { message: 'API key not valid.' } } };
        if (key === 'k14') return { status: 503, json: { error: { message: 'overloaded' } } };
        return model === firstModel ? { status: 404, json: { error: { message: 'not found' } } } : { status: 200, json: ok('k1 on ' + model) };
    };
    const env = keysEnv();
    const text = await textOf(await ask(worker, env));
    check(/^k1 on /.test(text), `a rejected key, a busy key and a missing model should still get an answer, got: ${text || '(none)'}`);
    // The pool starts on a different key each time, so a rejected key may not be reached at all;
    // what must never happen is Google being asked twice with a key it has already rejected.
    check(calls.filter(c => c.key === 'k0').length <= 1, `a rejected key was tried ${calls.filter(c => c.key === 'k0').length} times (it should rest after the first)`);
}

/* 4. every key out of credits: a rate-limit answer, not "no key configured" */
{
    const worker = await freshWorker();
    calls = [];
    behavior = () => ({ status: 429, json: { error: { message: 'You exceeded your current quota (requests per day)' } } });
    const env = keysEnv();
    const res = await ask(worker, env);
    const body = await res.json();
    check(res.status === 429, `every key out of credits should answer 429, got ${res.status}`);
    check(/rate limit/i.test((body.error && body.error.message) || ''), `the answer should say it is a rate limit, got: ${JSON.stringify(body.error)}`);
    // the next request doesn't call Google again while every key rests
    // With every key resting the Worker tries them anyway rather than refusing: a rest is a guess and the
    // soonest key may be back (geminiKeyOrder: "all resting: try them anyway").
    const before = calls.length;
    const again = await ask(worker, env);
    check(calls.length > before, 'with every key resting the Worker should still try, not refuse out of hand');
    check(again.status === 429, `the retry should still answer 429, got ${again.status}`);
}

/* 5. Google refusing a key with 401 (UNAUTHENTICATED) is a key problem, never the trainee's session: the key rests,
      the next one answers, and if every key is refused the Worker answers 502 — a 401 from this Worker always means
      "Sign-in required", and the page would tell a signed-in trainee their session had expired */
{
    const worker = await freshWorker();
    calls = [];
    behavior = (key) => key === 'k0'
        ? { status: 401, json: { error: { message: 'Request had invalid authentication credentials.', status: 'UNAUTHENTICATED' } } }
        : { status: 200, json: ok('from ' + key) };
    const env = keysEnv(), got = [];
    for (let i = 0; i < 6; i++) { const r = await ask(worker, env); check(r.status === 200, `a key refused with 401 should hand over to the next, got ${r.status}`); got.push(await textOf(r)); }
    check(got.every(t => t === 'from k1' || t === 'from k14'), `the refused key answered: ${got.join(' | ')}`);
    check(calls.filter(c => c.key === 'k0').length <= 1, 'a key refused with 401 should rest after the first try');
    const all = await freshWorker();
    behavior = () => ({ status: 401, json: { error: { message: 'Request had invalid authentication credentials.' } } });
    const res = await ask(all, keysEnv());
    check(res.status === 502, `every key refused should answer 502 (an AI key problem), not ${res.status}: a 401 reads as "your session has expired"`);
}

/* 6. no keys at all: the configuration message */
{
    const worker = await freshWorker();
    const res = await ask(worker, {});
    const body = await res.json();
    check(res.status === 500 && /No AI key is configured/i.test(body.error || ''), `with no keys set the answer should say so, got ${res.status} ${JSON.stringify(body.error)}`);
}

if (failures.length) { console.error('Gemini key pool:\n - ' + failures.join('\n - ')); process.exit(1); }
console.log('Checked the Gemini key pool: every numbered key is used, keys take turns, and a key out of credits rests while the next takes over.');
console.log('All good.');
