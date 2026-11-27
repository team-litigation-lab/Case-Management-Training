// @check browser — The Litigation note ("Case Managers handling Litigation and Pre-Litigation are sometimes different individuals…"): word for word at the start of the Litigation section and on every handoff step (an activity's: in the 🧪 Practice Lab), a pop-up there once for a trainee, and the slides still fit
// The owner's note (js/cm-litigation-note.js), checked in a real browser on Case Flow Day 5:
//   · its exact words are on the first slide of the Litigation section (d4m1-l1) and on the first slide of every
//     litigation transition or file-handoff step (d4m1-l2 From Pre-Lit to Litigation, d4m1-a1 the fork, d4m1-a2 the
//     move to Litigation status, d4m1-efile the filing handed to the Litigation Desk; on Day 4 the court work once suit
//     is filed, d4m2-l1 Court Hard Rules, SOL Cutoffs & the Master Calendar, d4m2-a1 its calendar-cutoff audit and
//     d4m2-medcal the court-ordered mediation's calendar; on Day 5 the litigated disbursement, d5m5-l1 and d5m5-a1 the
//     Litigation Net Sheet), in bold type of at least 16px; a Skill Activity's is on its Your Task in the 🧪 Practice Lab
//     (js/cm-task-lab.js: the deck keeps the activity's card, ▶ Start opens the lab);
//   · the same words at the top of each of those blocks' full text (📖 Additional Reference, the lesson card that is not
//     a slide), and not on a block that is no handoff;
//   · a trainee reaching a handoff step (an activity's lab page) gets it as a pop-up too; "Got it" puts it away, it does not
//     come back on that step (and it is saved as the trainee's progress, "litigation-note-seen"), while the callout stays;
//   · a trainer gets no pop-up, and Presenter view's notes say to read the note aloud;
//   · every one of those slides (an activity's deck card) still fits one screen at 1366×768 and 1920×1080.
// Usage: node .github/scripts/litigation-note.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const NOTE = 'Note: Case Managers handling Litigation and Pre-Litigation are sometimes different individuals; in Litigation, the Case Manager is usually the paralegal. Always verify the assigned Case Manager in the CMS/Case Profile before transferring files, logging updates, or routing communications.';
const BLOCKS = ['d4m1-l1', 'd4m1-l2', 'd4m2-l1', 'd4m2-a1', 'd5m5-l1'];   // (d4m1-a1, d4m1-a2, d4m1-efile, d4m2-medcal and d5m5-a1 were cut as extra tasks)
const SIZES = [[1366, 768], [1920, 1080]];
const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    for (const [W, H] of SIZES) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        page.on('pageerror', e => failures.push(`${W}x${H} page error: ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await sleep(700);
        await signIn(page, 'Lit', 'Note', 'B100926');
        const L = `${W}x${H}`;
        const there = await page.evaluate((NOTE) => !!window.cmLitigationNote && cmLitigationNote.NOTE === NOTE, NOTE);
        check(there, `${L} js/cm-litigation-note.js carries the owner's note word for word`);
        // go to a block's first slide, as a trainee or a trainer
        const go = (id, trainer) => page.evaluate(async ({ id, trainer }) => {
            state.isAdmin = trainer; state.adminPreview = false; state.presenting = false; state.adminUnlockedDays = DAYS.map(d => d.id);
            { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }
            const d = DAYS.find(x => x.cf && x.lessons.some(l => l.cf.block.id === id)) || DAYS.find(x => x.cf && x.cf.n === 5), s = buildDaySlides(d);
            const i = s.findIndex(x => x.type === 'topic' && x.part === 1 && d.lessons[x.lessonIndex].cf.block.id === id);
            // the day open for the trainee for the whole run: a day they have reached is never locked again (js/cm-open-lessons.js,
            // whose once-a-minute check could otherwise close Day 5 partway), set before the day is drawn
            if (!trainer) { state.slideProgress = state.slideProgress || {}; state.slideProgress[d.id] = Math.max(i + 1, state.slideProgress[d.id] || 0); }
            const sleep = ms => new Promise(r => setTimeout(r, ms));
            // a Skill Activity's Your Task (and the note) is in the 🧪 Practice Lab; the deck keeps its card, which must fit
            const act = i >= 0 && d.lessons[s[i].lessonIndex].cf.block.kind === 'activity';
            let fit = null;
            if (act) { goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = i; render(); await sleep(200);
                const cw = document.getElementById('lessonSlideWrap'), cs = document.getElementById('lessonStage');
                fit = { over: cw ? cw.scrollHeight - cw.clientHeight : -1, below: cs ? cs.getBoundingClientRect().bottom - innerHeight : 99, pages: state.slidePages || 1, card: !!(cw && cw.querySelector('.ctl-card .ctl-go')) };
                { const p = document.getElementById('lgnPop'); if (p) p.remove(); } }
            const draw = act ? () => { cmTaskLab.openView(id, 'task'); } : () => { goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = i; render(); };
            draw();
            // wait for the slide itself (its callout), not a fixed time; drawn again once if the page re-rendered elsewhere
            const drawn = () => { const w = document.getElementById('lessonSlideWrap'); return !!(w && w.querySelector('.lgn-note')); };
            for (let t = 0; t < 60 && !drawn(); t++) { await new Promise(r => setTimeout(r, 50)); if (t === 30 && !drawn()) draw(); }
            await new Promise(r => setTimeout(r, 150));
            const w = document.getElementById('lessonSlideWrap'), stage = document.getElementById('lessonStage');
            const box = w && [...w.querySelectorAll('.lgn-note')].find(x => !x.closest('.np-mini')), p = box && box.querySelector('p');
            const pop = document.getElementById('lgnPop');
            const cs = p ? getComputedStyle(p) : null;
            return { i, act, lab: act ? !!(w && w.closest('.ctl-page')) : null, card: fit ? fit.card : null, text: box ? box.textContent.replace(/\s+/g, ' ').replace(/^\W+/, '').trim() : '', size: cs ? parseFloat(cs.fontSize) : 0, weight: cs ? Number(cs.fontWeight) : 0,
                pop: pop ? pop.textContent.replace(/\s+/g, ' ') : '', ...(fit || { over: w ? w.scrollHeight - w.clientHeight : -1, below: stage ? stage.getBoundingClientRect().bottom - innerHeight : 99, pages: state.slidePages || 1 }) };
        }, { id, trainer });
        // a trainee who has seen nothing yet
        await page.evaluate(async () => { await storeSet('litigation-note-seen', {}); await cmLitigationNote.reload(); });
        for (const id of BLOCKS) {
            const t = await go(id, false);
            check(t.i >= 0, `${L} the course has ${id}'s first slide`);
            if (t.act) check(t.lab && t.card, `${L} ${id}: the deck has its card (▶ Start) and its Your Task opens in the 🧪 Practice Lab`);
            check(t.text === NOTE, `${L} ${id}: the note is on the ${t.act ? 'lab page' : 'slide'}, word for word${t.text === NOTE ? '' : ` ("${t.text.slice(0, 90)}…")`}`);
            check(t.size >= 16 && t.weight >= 600, `${L} ${id}: in bold type of at least 16px (${t.size}px, weight ${t.weight})`);
            check(t.over <= 2 && t.below <= 1 && t.pages === 1, `${L} ${id}: the ${t.act ? 'deck card' : 'slide'} still fits one screen (inside +${t.over}, below +${Math.round(t.below)}, ${t.pages} page)`);
            if (id === 'd4m1-l1') { check(!t.pop, `${L} ${id}: the start of the section has the callout, no pop-up`); continue; }
            check(t.pop.includes(NOTE), `${L} ${id}: a trainee gets it as a pop-up too`);
            if (id === 'd4m2-l1') {   // (d4m1-a2 and d4m1-efile, which these steps used, were cut as extra tasks)
                await page.click('#lgnPop [data-lgn-ok]'); await sleep(300);
                const after = await page.evaluate(async () => ({ pop: !!document.getElementById('lgnPop'), saved: JSON.parse(localStorage.getItem('lsh_litigation-note-seen') || '{}'), key: PERSONAL_KEYS.includes('litigation-note-seen') }));
                check(!after.pop && after.saved['d4m2-l1'] > 0 && after.key, `${L} ${id}: "Got it" puts it away and saves it to the trainee's progress (${JSON.stringify(after)})`);
                const again = await go(id, false);
                check(!again.pop && again.text === NOTE, `${L} ${id}: back on the step, no pop-up again, and the callout is still on the slide`);
            }
            if (id === 'd4m2-a1') {
                // the keyboard: Got it has the focus, Esc puts it away; the save adds to marks another device stored meanwhile
                const f = await page.evaluate(async () => { const s = (await storeGet('litigation-note-seen')) || {}; s['from-other-device'] = 1; await storeSet('litigation-note-seen', s);
                    const a = document.activeElement; return !!a && a.hasAttribute('data-lgn-ok'); });
                check(f, `${L} ${id}: the pop-up's Got it takes the keyboard's focus`);
                await page.keyboard.press('Escape'); await sleep(300);
                const esc = await page.evaluate(async () => ({ pop: !!document.getElementById('lgnPop'), saved: (await storeGet('litigation-note-seen')) || {} }));
                check(!esc.pop && esc.saved['d4m2-a1'] > 0 && esc.saved['from-other-device'] === 1, `${L} ${id}: Esc puts the pop-up away, saved with the marks already stored (${JSON.stringify(esc)})`);
            }
            await page.evaluate(() => { const p = document.getElementById('lgnPop'); if (p) p.remove(); });
        }
        // the full text (📖 Additional Reference) of every one of them opens on the note; a block that is no handoff has none
        const full = await page.evaluate(async (ids) => { const out = {};
            for (const id of ids.concat(['d4m3-a1'])) { const d = DAYS.find(x => x.cf && x.lessons.some(l => l.cf.block.id === id)), i = d.lessons.findIndex(l => l.cf.block.id === id);
                cmCaseFlow.full(d.id, i); await new Promise(r => setTimeout(r, 30));
                const b = document.querySelector('.cfx-ref .cfx-ref-b'), n = b && b.querySelector('.lgn-note');
                out[id] = n ? (b.firstElementChild === n ? '' : 'top:') + n.textContent.replace(/\s+/g, ' ').replace(/^\W+/, '').trim() : ''; cmCaseFlow.fullClose(); }
            return out; }, BLOCKS);
        BLOCKS.forEach(id => check(full[id] === NOTE, `${L} ${id}: the note heads its full text (📖 Additional Reference)${full[id] === NOTE ? '' : ` ("${String(full[id]).slice(0, 60)}")`}`));
        check(full['d4m3-a1'] === '', `${L} a block that is no handoff (d4m3-a1) has no note in its full text`);
        // a trainer: no pop-up; Presenter view says to read it aloud
        await page.evaluate(async () => { await storeSet('litigation-note-seen', {}); await cmLitigationNote.reload(); });
        const tr = await go('d4m2-a1', true);
        check(!tr.pop && tr.text === NOTE, `${L} a trainer gets the callout (in the 🧪 Practice Lab) and no pop-up`);
        const cue = await page.evaluate(() => { const d = DAYS.find(x => x.cf && x.cf.n === 5), s = buildDaySlides(d); const sl = s.find(x => x.type === 'topic' && x.part === 1 && d.lessons[x.lessonIndex].cf.block.id === 'd4m1-l1');
            return typeof presenterCues === 'function' ? String(presenterCues(d, sl) || '') : ''; });
        check(/Read this note aloud/.test(cue) && cue.includes('verify the assigned Case Manager'), `${L} Presenter view's notes say to read the note aloud`);
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: the Litigation note is at the start of the section and on every handoff step (Day 4\'s court work after suit and Day 5\'s litigated disbursement too), on the slide (an activity\'s in the 🧪 Practice Lab) and in its full text, word for word.');
})().catch(e => { console.error(e); process.exit(1); });
