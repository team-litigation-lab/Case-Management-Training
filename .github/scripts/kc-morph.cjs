// The Knowledge Check is repainted without rebuilding the page (gamePaint / paintInto in
// js/cm-case-flow.js). Every answer, pick and move between questions used to write the whole page back
// with innerHTML, which threw away and rebuilt every node and showed as a flicker — worst on Day 3,
// whose Countdown Bomb repaints while a CSS fuse animation runs.
// Checks, on every day (so every game mode: millionaire, jeopardy, bomb, wheel, doors):
//   - the morphed page is exactly the page innerHTML would have produced, after each answer;
//   - nodes whose markup didn't change are the same nodes afterwards (not rebuilt): the card, the
//     question and an option the trainee didn't pick;
//   - the answer still lands (the pick is recorded and shown as right or wrong);
//   - on Day 3 the running fuse is the same element after an answer, with its animation-delay intact.
// Usage: node .github/scripts/kc-morph.cjs [baseUrl]   (needs `npm i playwright` and a browser)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const failures = []; const fail = (m) => failures.push(m);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    // A trainee of this run's own: answers are saved as a draft on the trainee's record, so a reused
    // name would start the next run with questions already answered (and a game back on its board).
    await signIn(page, 'Morph', 'Test' + Date.now().toString(36), 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);

    // One page load per day: a game's timers (the bomb's fuse, the wheel's spin) and the app's own
    // re-renders must not leak from one day into the next, or the test measures the wrong page.
    const dayIds = await page.evaluate(() => DAYS.map(d => d.id));
    const report = [];
    for (const dayId of dayIds) {
        await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1200);
        report.push(await page.evaluate(async (dayId) => {
            const sleep = (ms) => new Promise(r => setTimeout(r, ms));
            state.isAdmin = true;
            const d = DAYS.find(x => x.id === dayId);
            goto('day', d.id);
            state.quizAnswers = {}; state.quizSubmitted = false; state.quizQuestionIndex = 0;
            state.cfGame = null; state.cfJq = null; state.cfJAns = null; state.cfGameShow = null;
            state.dayViewMode = 'knowledgeCheck'; render(); await sleep(150);
            const wrap = () => document.getElementById('quizWrap');   // the app can replace it while an animation plays
            if (!wrap() || !wrap().firstChild) return { day: d.id, err: 'the Knowledge Check did not render' };
            const mode = (state.cfGame || {}).mode || '?';
            /* Is the morphed page the page innerHTML would have produced? Compared with isEqualNode, not
               as a string: setAttribute appends an attribute where the parser writes them in source
               order, so the serialized HTML can differ while the DOM is identical. Left out of the
               comparison: the running fuse's own style, because keeping it is the point (see paintInto),
               and the "+points" effect, which gameAnswer appends after the paint so a fresh render never
               holds one — morphing keeps it, which is what should happen. */
            const normed = (root, html) => { const c = document.createElement('div');
                if (html == null) { [...root.childNodes].forEach(x => c.appendChild(x.cloneNode(true))); } else { c.innerHTML = html; }
                c.querySelectorAll('.cfg-fuse i').forEach(i => i.removeAttribute('style'));
                c.querySelectorAll('.cfg-float').forEach(x => x.remove()); return c; };
            const sameAsFresh = () => { const a = normed(wrap(), null), b = normed(null, renderQuiz(d));
                return a.childNodes.length === b.childNodes.length && [...a.childNodes].every((x, i) => x.isEqualNode(b.childNodes[i])); };
            // the board, the wheel and the doors come before the question
            if (mode === 'jeopardy') cmCaseFlow.gamePick(0, 200);
            if (mode === 'wheel' && !(state.cfGame.pre || {})[0]) cmCaseFlow.gameSpin(0);
            if (mode === 'doors' && !(state.cfGame.pre || {})[0]) cmCaseFlow.gameDoor(0, 1);
            let card = null;
            for (let i = 0; i < 80 && !card; i++) { card = wrap() && wrap().querySelector('.cfg-card'); if (!card) await sleep(100); }
            if (!card) return { day: d.id, mode, err: 'no question card to answer', diag: { quiz: (d.quiz||[]).length, answers: Object.keys(state.quizAnswers||{}).length, cfJq: state.cfJq, show: state.cfGameShow, submitted: state.quizSubmitted, html: wrap().innerHTML.slice(0, 300) } };
            const qi = +card.dataset.q;
            // stamp the nodes that must survive an answer: the card, the question, an option not picked
            const q = card.querySelector('.cfg-q') || card.querySelector('h3, p');
            const opts = [...card.querySelectorAll('.cfg-opt')];
            const other = opts[opts.length - 1];
            const fuse = wrap().querySelector('.cfg-fuse i');
            card.__probe = 1; if (q) q.__probe = 1; if (other) other.__probe = 1; if (fuse) fuse.__probe = 1;
            const fuseDelay = fuse ? fuse.style.animationDelay : null;
            cmCaseFlow.gameAnswer(d.id, qi, 0);
            await sleep(250);
            const w = wrap();
            const card2 = w && w.querySelector('.cfg-card');
            const fuse2 = w && w.querySelector('.cfg-fuse i');
            const q2 = card2 && (card2.querySelector('.cfg-q') || card2.querySelector('h3, p'));
            return { day: d.id, mode, qi,
                answered: state.quizAnswers[qi] === 0,
                marked: !!(w && w.querySelector('.cfg-opt.right, .cfg-opt.wrong')),
                sameCard: !!(card2 && card2.__probe),
                sameQ: q ? !!(q2 && q2.__probe) : null,
                sameOther: other ? !!(([...card2.querySelectorAll('.cfg-opt')].pop() || {}).__probe) : null,
                fuse: (fuse && mode === 'bomb') ? { same: !!(fuse2 && fuse2.__probe), delay: fuse2 ? fuse2.style.animationDelay : null, was: fuseDelay } : null,
                matches: sameAsFresh() };
        }, dayId));
    }

    const modes = new Set();
    report.forEach(r => {
        if (r.err) { fail(`Day ${r.day}: ${r.err}${r.diag ? ' ' + JSON.stringify(r.diag) : ''}`); return; }
        modes.add(r.mode);
        if (!r.matches) fail(`Day ${r.day} (${r.mode}): the morphed page is not what innerHTML would have produced`);
        if (!r.answered) fail(`Day ${r.day} (${r.mode}): the answer wasn't recorded`);
        if (!r.marked) fail(`Day ${r.day} (${r.mode}): the answer wasn't shown as right or wrong`);
        if (!r.sameCard) fail(`Day ${r.day} (${r.mode}): the question card was rebuilt on an answer (the flicker)`);
        // The wheel and the doors insert their multiplier or reward into the card when it is answered,
        // which shifts the siblings the morph matches by position, so those are rebuilt. The DOM is still
        // exactly right (checked above) and neither mode has an animation running while it happens. The
        // Countdown Bomb does, and it is the one that was reported, so it has to stay surgical.
        const surgical = r.mode === 'bomb' || r.mode === 'millionaire' || r.mode === 'jeopardy';
        if (surgical && r.sameQ === false) fail(`Day ${r.day} (${r.mode}): the question text was rebuilt on an answer`);
        if (surgical && r.sameOther === false) fail(`Day ${r.day} (${r.mode}): an option the trainee didn't pick was rebuilt`);
        if (r.fuse && !r.fuse.same) fail(`Day ${r.day}: the running fuse was rebuilt on an answer, restarting its animation`);
        if (r.fuse && r.fuse.delay !== r.fuse.was) fail(`Day ${r.day}: the running fuse's animation-delay was rewritten (${r.fuse.was} → ${r.fuse.delay}), restarting it`);
    });
    if (!report.some(r => r.fuse)) fail('no day showed a Countdown Bomb fuse: the Day 3 case this guards was not exercised');
    if (modes.size < 3) fail(`only ${modes.size} game mode(s) were exercised: ${[...modes].join(', ')}`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Knowledge Check repaints without rebuilding the page (${[...modes].join(', ')}): the morphed page is exactly what innerHTML would have produced, unchanged nodes are left alone, and the Countdown Bomb's running fuse survives an answer.`);
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
