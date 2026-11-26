// @check node — ✍️ The Worker scores a Knowledge Check attempt from its own picks (worker-kc-key.js), and the trainer's 40% and the Composite on trainee:<id>.caseFlow come only from a trainer's feedback:<id>, never from the trainee's browser
// worker-identity.js kcScore / scoredAttempt / officialCaseFlow, worker.js traineeWrite and trainerScoresToRecord. Checked on the Worker:
//   1. a first attempt sent with a forged score (100) and picks worth 40% is recorded at 40%, not passed, the sent score kept as `claimed`;
//   2. an attempt with no picks (a bare score), or fewer picks than the day's questions, is not recorded;
//   3. a trainer's published extra question (extraquiz:day<N>) is scored with the day's key; a pick past every question known is not scored;
//   4. a reset's one retake is scored from its own picks too (a forged 100 with picks worth 75 is 75);
//   5. the Case Flow summary's modules: a, t and c are worked out on the Worker; the t and c the device sends are dropped;
//   6. a trainer's save of feedback:<id>.caseFlow.<module>.score is the record's t at once, and c = a × 0.6 + t × 0.4;
//      a trainee's own write to feedback:<id> can't set it, and their next write to trainee:<id> can't change it;
//   7. worker-kc-key.js is the key the lesson data gives (build/case-flow/kc-key.cjs --check).
// Usage: node .github/scripts/kc-score.cjs   (no server, no browser needed)
const { execFileSync } = require('child_process');
const path = require('path');
const { harness, reporter } = require('./worker-harness.cjs');
const { picksFor, KC_KEY } = require('./kc-picks.cjs');
const R = reporter();
(async () => {
    // 7. the key is the lesson data's
    try { execFileSync(process.execPath, [path.join(__dirname, '../../build/case-flow/kc-key.cjs'), '--check'], { stdio: 'pipe' }); }
    catch (e) { R.fail(`worker-kc-key.js is not in step with the lesson data: ${String(e.stdout || e.message).trim()}`); }
    for (const d of ['11', '12', '13', '14', '15']) if (!KC_KEY[d] || KC_KEY[d].a.length !== 20 || KC_KEY[d].mod.length !== 20) R.fail(`Day ${d}'s key should hold its 20 questions: ${JSON.stringify(KC_KEY[d])}`);

    const h = await harness({ portalOnly: true });
    const s = await h.portal('Kay', 'Score', 'B111926', 'U-kay'), id = s.body && s.body.id, tok = s.body && s.body.token, key = 'trainee:' + id;
    if (s.status !== 200 || !tok) { console.log(`the trainee should sign in: ${JSON.stringify(s)}`); process.exit(1); }
    const save = async (patch) => { const cur = await h.get(key); return h.set(key, Object.assign({}, cur, patch), tok); };

    // 1. a forged score
    const forged = picksFor(11, 40);
    await save({ dayProgress: { 11: { score: 100, done: true, date: '2026-11-19T10:00:00.000Z', history: [{ score: 100, passed: true, date: '2026-11-19T10:00:00.000Z', answers: forged }] } } });
    let p = (await h.get(key)).dayProgress[11];
    R.check(p && p.score === 40 && p.done === false && p.history.length === 1 && p.history[0].score === 40 && p.history[0].passed === false && p.history[0].claimed === 100,
        `a forged first attempt should be recorded at the score its picks give (40), not passed, with the sent 100 as claimed: ${JSON.stringify(p)}`);
    // (and the one-attempt rule then holds that score)
    await save({ dayProgress: { 11: { score: 100, done: true, history: [{ score: 100, passed: true, answers: picksFor(11, 100) }] } } });
    p = (await h.get(key)).dayProgress[11];
    R.check(p.score === 40 && p.done === false && JSON.stringify(p.history[0].answers) === JSON.stringify(forged), `a second write should not replace the scored attempt: ${JSON.stringify(p)}`);

    // 2. no picks, too few picks
    await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 12: { score: 100, done: true, history: [{ score: 100, passed: true }] } }) });
    R.check(!(await h.get(key)).dayProgress[12] || (await h.get(key)).dayProgress[12].score == null, `an attempt with no picks should not be recorded: ${JSON.stringify((await h.get(key)).dayProgress[12])}`);
    await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 12: { score: 95, done: true, history: [{ score: 95, passed: true, answers: picksFor(12, 100).slice(0, 5) }] } }) });
    R.check(!(await h.get(key)).dayProgress[12] || (await h.get(key)).dayProgress[12].score == null, `an attempt with fewer picks than questions should not be recorded: ${JSON.stringify((await h.get(key)).dayProgress[12])}`);
    await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 12: { score: 5, done: false, history: [{ score: 5, passed: false, answers: picksFor(12, 85) }] } }) });
    p = (await h.get(key)).dayProgress[12];
    R.check(p && p.score === 85 && p.done === true && p.history[0].claimed === 5, `the picks decide the score both ways: ${JSON.stringify(p)}`);

    // 3. a trainer's published extra question (right option 2) joins the key; an unpublished one does not
    h.rawPut('extraquiz:day13', { questions: [{ q: 'Extra', opts: ['a', 'b', 'c', 'd'], a: 2, status: 'published' }, { q: 'Draft', opts: ['a', 'b', 'c', 'd'], a: 1, status: 'draft' }] });
    const x13 = picksFor(13, 50).concat([2]);   // 10 + 1 of 21
    await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 13: { score: 52, done: false, history: [{ score: 52, passed: false, answers: x13 }] } }) });
    p = (await h.get(key)).dayProgress[13];
    R.check(p && p.score === 52 && !p.history[0].claimed, `a published extra question should be scored with the day's key (11 of 21 = 52): ${JSON.stringify(p)}`);
    const x14 = picksFor(14, 50).concat([0]);   // a pick past every question known here: not scored
    await save({ dayProgress: Object.assign({}, (await h.get(key)).dayProgress, { 14: { score: 48, done: false, history: [{ score: 48, passed: false, answers: x14 }] } }) });
    p = (await h.get(key)).dayProgress[14];
    R.check(p && p.score === 50 && p.history[0].claimed === 48, `a pick past every known question should be left unscored, the attempt still recorded (10 of 20): ${JSON.stringify(p)}`);

    // 4. a reset's retake, forged
    R.check((await h.api('/api/kc-reset', { traineeId: id, dayId: 11 }, h.admin)).status === 200, 'the trainer should reset Day 11');
    const now = await h.get(key), h11 = now.dayProgress[11].history;
    await h.set(key, Object.assign({}, now, { dayProgress: Object.assign({}, now.dayProgress, { 11: { score: 100, done: true, history: h11.concat([{ score: 100, passed: true, date: new Date().toISOString(), answers: picksFor(11, 75) }]) } }) }), tok);
    p = (await h.get(key)).dayProgress[11];
    R.check(p.history.length === 2 && p.history[1].score === 75 && p.history[1].claimed === 100 && p.score === 75 && p.done === true, `a retake should be scored from its own picks (75): ${JSON.stringify(p)}`);

    // 5. the device's 40% and Composite are dropped; a is the Worker's
    const d1 = KC_KEY['11'], m1 = d1.mod[0];   // Day 11's first module: questions 0–3, all right in picksFor(11, 75) (the official attempt now)
    await save({ caseFlow: { at: new Date().toISOString(), days: { 1: { id: 11, modules: { [m1]: { a: 100, t: 100, c: 100, ai: 50 } } } } } });
    let mods = (await h.get(key)).caseFlow.days[1].modules;
    R.check(mods[m1] && mods[m1].t === null && mods[m1].c === null && mods[m1].a === 75 && mods[m1].ai === 50,
        `the device's t and c should be dropped, a worked out on the Worker (quiz 100, AI 50 → 75): ${JSON.stringify(mods[m1])}`);
    const other = d1.mod.find((m) => m !== m1);
    R.check(mods[other] && mods[other].t === null && typeof mods[other].a === 'number', `every module the day's Knowledge Check asks about should have its quiz share: ${JSON.stringify(mods)}`);

    // 6. the trainer's 40%: a trainer's save of feedback:<id> reaches the record at once; a trainee's can't set it
    const fbTrainee = await h.set('feedback:' + id, { days: {}, caseFlow: { [m1]: { score: 100 } } }, tok);
    R.check(fbTrainee.status === 200 && !((h.raw('feedback:' + id) || {}).caseFlow || {})[m1], `a trainee's write to feedback:<id> should not set a trainer score: ${JSON.stringify(h.raw('feedback:' + id))}`);
    mods = (await h.get(key)).caseFlow.days[1].modules;
    R.check(mods[m1].t === null, `a trainee's feedback write should not reach the 40%: ${JSON.stringify(mods[m1])}`);
    const fb = (await h.get('feedback:' + id)) || { days: {} };
    R.check((await h.set('feedback:' + id, Object.assign({}, fb, { caseFlow: { [m1]: { score: 80, comment: 'Good intake' } } }))).status === 200, 'the trainer should save the 40%');
    mods = (await h.get(key)).caseFlow.days[1].modules;
    R.check(mods[m1].t === 80 && mods[m1].c === Math.round(75 * 0.6 + 80 * 0.4), `the trainer's 40% should be on the record at once, and the Composite worked out: ${JSON.stringify(mods[m1])}`);
    await save({ caseFlow: { at: new Date().toISOString(), days: { 1: { id: 11, modules: { [m1]: { a: 100, t: 100, c: 100, ai: 50 } } } } } });
    mods = (await h.get(key)).caseFlow.days[1].modules;
    R.check(mods[m1].t === 80 && mods[m1].c === Math.round(75 * 0.6 + 80 * 0.4), `the trainee's next write should not change the 40% or the Composite: ${JSON.stringify(mods[m1])}`);
    // (a trainer's own write to the record is a trainer's: an admin token sets what it sends)
    const rec = await h.get(key);
    rec.caseFlow.days[1].modules[m1] = Object.assign({}, rec.caseFlow.days[1].modules[m1], { t: 90, c: 81 });
    await h.set(key, rec);
    R.check((await h.get(key)).caseFlow.days[1].modules[m1].t === 90, 'a trainer\'s write to the record should stand');

    R.done('KC scored on the Worker: a forged score is recorded at what its picks give (the sent one kept as claimed), a bare score or too few picks is not recorded, published extra questions and a reset\'s retake are scored too, and the Case Flow 40% and Composite come only from a trainer\'s feedback:<id>.');
})().catch((e) => { console.log(e.stack || e); process.exit(1); });
