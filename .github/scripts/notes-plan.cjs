// 📝 Notes & Action Plan (js/cm-case-flow.js, build/case-flow/exhibits/d1.json "notes").
//
// Day 1's voicemail activity (John Doe: Keystone asked to record him) is worked, not read: its Your Case slide
// carries the Notes & Action Plan where the document thumbnails were. The trainee transcribes the message
// (checked against what was said, then the transcript and the facts are the answer key), writes an action plan
// (graded against the steps it must hold, each with its answer key), then works the plan: the email to the
// adjuster (no direct contact, statements through the firm, nothing about his injuries) and to the treatment
// facility in the Email Simulator, and the check-in on the live call.
// Checks, in a browser: the slide shows the Notes & Action Plan and no thumbnails; a transcript too short is
// refused; a transcript is scored fact by fact and the answer key opens; a plan is graded step by step with its
// key; an email that mentions his neck to the adverse carrier is refused, one that leaves out the statement rule is
// refused with what is missing, a complete one is sent and answered; the work is on the trainee's record.
// Run: node .github/scripts/notes-plan.cjs [base-url]   (server: node .github/scripts/server.mjs)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const BLOCK = 'd1m3-a1';
const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

const TRANSCRIPT = "Hey, uh, this is John Doe. I signed with Mr. Thorne yesterday, for the car accident. Last night somebody from Keystone Mutual called me, the other guy's insurance. A lady, Dana I think. She was asking what happened and if she could record it. I said I'd think about it and she said she'd call me back today. I haven't gotten anything from you guys yet, no paperwork, nothing. My neck's still stiff, worse in the morning. Call my cell, 555 010 2288.";
const PLAN = [
    '1. Call John Doe back today on his cell, 555-010-2288. Check in on his stiff neck and whether he has been seen by a doctor yet; outline next steps.',
    '2. Instruct him: no Recorded Statement to Keystone; if Dana calls again he refers her to the firm. Have him repeat it back.',
    '3. Email Dana Whitfield at Keystone today: the firm represents John Doe, no direct contact, any statement request through the firm.',
    '4. Contact Riverton Urgent Care to coordinate his first visit, billing and records.',
    '5. Tell Atty. Thorne the same day and log the voicemail, the call and both emails in the CMS Communications Log.'
].join('\n');
const DANA_OK = "Ms. Whitfield,\n\nLSH Law Group represents John Doe for the collision of 02/06/2026 involving your insured, Robert Smith. Please do not contact Mr. Doe directly from today; all contact about this matter goes to our office. Any request for a recorded statement must be made to the firm, not to him. Atty. Elijah Thorne is counsel, and his letter of representation follows.\n\nCase Manager, LSH Law Group";
const DANA_NECK = DANA_OK.replace('Please do not', 'His neck is still stiff. Please do not');
const DANA_NOSTMT = DANA_OK.replace(' Any request for a recorded statement must be made to the firm, not to him.', ' We will be in touch.');
const UC_OK = "Hello,\n\nLSH Law Group represents John Doe, DOB 08/14/1991, injured in a motor vehicle accident on 02/06/2026. Could you confirm whether he has been seen at your clinic, and when he can be seen this week? Please send his records and bills to our office; his signed HIPAA authorization is attached.\n\nThank you,\nCase Manager, LSH Law Group";

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', e => failures.push('page error: ' + e.message));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Notes', 'Trainee', 'B100926');
    await page.evaluate(async () => { const r = (await storeGet('case-flow')) || {}; delete r.notes; if (r.listen) delete r.listen['d1m3-a1']; await storeSet('case-flow', r); });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    await page.evaluate(() => { state.isAdmin = true; });

    // 1. the Your Case slide: the Notes & Action Plan where the thumbnails were
    const caseSlide = await page.evaluate(async (block) => {
        const d = DAYS.find(x => x.cf && x.cf.n === 1); goto('day', d.id); state.dayViewMode = 'slides';
        const slides = buildDaySlides(d);
        for (let i = 0; i < slides.length; i++) { state.lessonSlide = i; render(); const w = document.getElementById('lessonSlideWrap'); if (w && w.querySelector('.cfx-np')) return { i, thumbs: w.querySelectorAll('.cfx-thumb').length, text: w.innerText }; }
        return null;
    }, BLOCK);
    check(!!caseSlide, 'the voicemail activity\'s Your Case slide carries the Notes & Action Plan');
    check(caseSlide && caseSlide.thumbs === 0, 'in place of the document thumbnails');
    check(caseSlide && /Transcribe/.test(caseSlide.text), 'and the voicemail offers to transcribe it');

    // 2. the transcript: too short is refused; a full one is scored and the key opens
    await page.evaluate((b) => cmCaseFlow.notes(b), BLOCK);
    await page.waitForSelector('#cf-np #npt_' + BLOCK);
    const short = await page.evaluate((b) => { document.getElementById('npt_' + b).value = 'John called about Keystone.'; cmCaseFlow.npTx(b); return document.getElementById('nptm_' + b).innerText; }, BLOCK);
    check(/more of it/i.test(short), `a transcript too short is refused: ${short}`);
    await page.evaluate((a) => { document.getElementById('npt_' + a.b).value = a.t; cmCaseFlow.npTx(a.b); }, { b: BLOCK, t: TRANSCRIPT });
    await page.waitForSelector('#cf-np .np-key');
    const tx = await page.evaluate(async (b) => { const r = ((await storeGet('case-flow')).notes || {})[b]; return { got: r.txGot, key: document.querySelector('#cf-np .np-key').innerText }; }, BLOCK);
    check(tx.got.every(Boolean), `a full transcript catches every fact (${tx.got.filter(Boolean).length}/${tx.got.length})`);
    check(/Answer key/.test(tx.key) && /five five five|Keystone Mutual/.test(tx.key), 'and the answer key shows what was said');

    // 3. the plan: graded step by step, with its key
    await page.evaluate((a) => { document.getElementById('npp_' + a.b).value = a.p; cmCaseFlow.npPlan(a.b); }, { b: BLOCK, p: PLAN });
    const plan = await page.evaluate(async (b) => ({ got: (await storeGet('case-flow')).notes[b].planGot, n: CM_CF_EXHIBITS.notes[b].plan.required.length, key: [...document.querySelectorAll('#cf-np .np-key')].pop().innerText }), BLOCK);
    check(plan.got.length === plan.n && plan.got.every(Boolean), `a complete plan holds every step (${plan.got.filter(Boolean).length}/${plan.n})`);
    const partialGot = await page.evaluate((b) => CM_CF_EXHIBITS.notes[b].plan.required.map(q => q.match.every(p => new RegExp(p, 'i').test('Call John back and tell him to get some rest.'))), BLOCK);
    check(partialGot.filter(Boolean).length < plan.n / 2, `a thin plan misses most of the steps (${partialGot.filter(Boolean).length}/${plan.n})`);
    check(/Answer key: the plan/.test(plan.key) && /Atty\. Thorne/.test(plan.key), 'and the plan\'s answer key opens');

    // 4. the email to the adjuster: refused with an injury detail, refused without the statement rule, then sent
    const send = (t, id) => page.evaluate((a) => { document.getElementById(`npm_${a.b}_${a.id}`).value = a.t; cmCaseFlow.npSend(a.b, a.id); const m = document.getElementById(`npmm_${a.b}_${a.id}`); return m ? m.innerText : ''; }, { b: BLOCK, id, t });
    const neck = await send(DANA_NECK, 'dana');
    check(/Not sent/.test(neck) && /injur/i.test(neck), `an email that tells the adverse carrier about his neck is refused: ${neck.replace(/\s+/g, ' ').slice(0, 110)}`);
    const nostmt = await send(DANA_NOSTMT, 'dana');
    check(/Not sent/.test(nostmt) && /Recorded Statement/.test(nostmt), `one that leaves out the statement rule is refused with what is missing: ${nostmt.replace(/\s+/g, ' ').slice(0, 110)}`);
    await send(DANA_OK, 'dana');
    const thread = await page.locator('#cf-np').innerText();
    check(/will not contact him directly/.test(thread), 'a complete email is sent, and Dana answers: no direct contact, statements through the firm');

    // 5. the treatment facility
    await send(UC_OK, 'provider');
    check(/no visit on file/i.test(await page.locator('#cf-np').innerText()), 'the facility is asked about his status and answers');
    check((await page.locator('#cf-np button:has-text("Take the call")').count()) === 1, 'and the check-in call is open to take');

    // 6. on the record, for the trainer
    const saved = await page.evaluate(async (b) => { await new Promise(r => setTimeout(r, 900)); const r = (await storeGet('case-flow')) || {}; const n = (r.notes || {})[b] || {}; return { tx: !!n.txAt, plan: !!n.planAt, dana: !!((n.mails || {}).dana || {}).sent, tries: ((n.mails || {}).dana || {}).tries }; }, BLOCK);
    check(saved.tx && saved.plan && saved.dana, 'the transcript, the plan and the emails are on the trainee\'s record');
    check(saved.tries === 2, `with the rejected attempts counted (${saved.tries})`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s).`); process.exit(1); }
    console.log('\nAll good: the voicemail is transcribed, the plan graded with its key, and the plan worked in the Email Simulator.');
})().catch(e => { console.error(e); process.exit(1); });
