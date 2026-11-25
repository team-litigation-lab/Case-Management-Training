// @check node — ⚠ A Knowledge Check attempt the Worker can't score (no picks, or too few) is never dropped without a word: the day is marked kcRejected on the record (no score, no pass) and the write answers {kcRejected: [day]}, so the page can reopen it; a scored retake clears the mark, and the trainee can't set the mark
// worker-identity.js dateFirstAttempts, worker.js traineeWrite. (js/cm-kc-rejected.js, what the trainee is shown: kc-rejected.cjs)
//   1. a bare attempt (score 85, passed, no picks): 200 {ok: true, kcRejected: [11]}; the record's day holds kcRejected
//      {why: "no-picks", claimed: 85} and no score, pass or history; the Case Flow summary has no kc for it;
//   2. too few picks (19 of 20): kcRejected [12], why "too-few-picks";
//   3. a later save with no attempt for the day keeps the mark (the trainer sees it); the next save with the day's picks is recorded at its own score, the mark gone, and the answer names no day;
//   4. a trainee's write that sets kcRejected on a day with no attempt doesn't keep it.
// Usage: node .github/scripts/kc-rejected-worker.cjs   (no server, no browser needed)
const { harness, reporter } = require('./worker-harness.cjs');
const { picksFor } = require('./kc-picks.cjs');
const R = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    const s = await h.portal('Bea', 'Bare', 'B111926', 'U-bea'), id = s.body && s.body.id, tok = s.body && s.body.token, key = 'trainee:' + id;
    if (s.status !== 200 || !tok) { console.log(`the trainee should sign in: ${JSON.stringify(s)}`); process.exit(1); }
    const save = async (patch) => { const cur = await h.get(key); return h.set(key, Object.assign({}, cur, patch), tok); };
    const at = new Date().toISOString();

    // 1. no picks
    let w = await save({ dayProgress: { 11: { score: 85, done: true, date: at, history: [{ score: 85, passed: true, date: at }] } }, caseFlow: { at, days: { 1: { id: 11, kc: 85, passed: true, modules: {} } } } });
    R.check(w.status === 200 && w.body && w.body.ok === true && JSON.stringify(w.body.kcRejected) === '[11]', `the write should answer {ok, kcRejected: [11]}: ${JSON.stringify(w)}`);
    let rec = await h.get(key), p = rec.dayProgress[11];
    R.check(p && p.score == null && !p.done && !(p.history && p.history.length) && p.kcRejected && p.kcRejected.why === 'no-picks' && p.kcRejected.claimed === 85,
        `the day should hold kcRejected (no-picks, claimed 85) and no score or pass: ${JSON.stringify(p)}`);
    const cf = rec.caseFlow && rec.caseFlow.days && rec.caseFlow.days[1];
    R.check(!cf || (cf.kc == null && !cf.passed), `the Case Flow summary should have no kc or pass for it: ${JSON.stringify(cf)}`);

    // 2. too few picks
    w = await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 12: { score: 95, done: true, history: [{ score: 95, passed: true, answers: picksFor(12, 100).slice(0, 19) }] } }) });
    p = (await h.get(key)).dayProgress[12];
    R.check(w.body && Array.isArray(w.body.kcRejected) && w.body.kcRejected.includes(12) && p && p.kcRejected && p.kcRejected.why === 'too-few-picks' && p.score == null,
        `19 of 20 picks should be kcRejected too-few-picks: ${JSON.stringify({ answer: w.body, p })}`);

    // (a later save whose day holds no attempt, as the page's does once it reopened the check, keeps the Worker's mark)
    await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 11: { unrecorded: { score: 85 } } }) });
    p = (await h.get(key)).dayProgress[11];
    R.check(p && p.kcRejected && p.kcRejected.claimed === 85 && p.score == null, `the mark should stay on the record until an attempt is recorded: ${JSON.stringify(p)}`);

    // 3. the retake with picks
    w = await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 11: { score: 80, done: true, date: at, history: [{ score: 80, passed: true, date: at, answers: picksFor(11, 80) }] } }) });
    p = (await h.get(key)).dayProgress[11];
    R.check(p && p.score === 80 && p.done === true && p.history.length === 1 && !p.kcRejected, `the retake should be recorded at 80, the mark gone: ${JSON.stringify(p)}`);
    R.check(!(w.body && Array.isArray(w.body.kcRejected) && w.body.kcRejected.includes(11)), `the answer should no longer name Day 11: ${JSON.stringify(w.body)}`);

    // 4. a trainee can't set the mark
    await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 13: { kcRejected: { why: 'forged' } } }) });
    p = (await h.get(key)).dayProgress[13];
    R.check(!p || !p.kcRejected, `a trainee's own kcRejected should not be kept: ${JSON.stringify(p)}`);

    R.done('kc-rejected-worker: an attempt the Worker cannot score is marked kcRejected and named in the answer, a scored retake clears it, and a trainee cannot set it.');
})().catch((e) => { console.log(e.stack || e); process.exit(1); });
