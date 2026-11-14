// @check browser — The Litigation note ("Case Managers handling Litigation and Pre-Litigation are sometimes different individuals…"): word for word at the start of the Litigation section and on every handoff step, a pop-up there once for a trainee, and the slides still fit
// The owner's note (js/cm-litigation-note.js), checked in a real browser on Case Flow Day 5:
//   · its exact words are on the first slide of the Litigation section (d4m1-l1) and on the first slide of every
//     litigation transition or file-handoff step (d4m1-l2 From Pre-Lit to Litigation, d4m1-a1 the fork, d4m1-a2 the
//     move to Litigation status, d4m1-efile the filing handed to the Litigation Desk), in bold type of at least 16px;
//   · a trainee reaching a handoff step gets it as a pop-up too; "Got it" puts it away, it does not come back on that
//     step (and it is saved as the trainee's progress, "litigation-note-seen"), while the callout stays on the slide;
//   · a trainer gets no pop-up, and Presenter view's notes say to read the note aloud;
//   · every one of those slides still fits one screen at 1366×768 and 1920×1080.
// Usage: node .github/scripts/litigation-note.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const NOTE = 'Note: Case Managers handling Litigation and Pre-Litigation are sometimes different individuals. Always verify the assigned Case Manager in the CMS/Case Profile before transferring files, logging updates, or routing communications.';
const BLOCKS = ['d4m1-l1', 'd4m1-l2', 'd4m1-a1', 'd4m1-a2', 'd4m1-efile'];
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
            const d = DAYS.find(x => x.cf && x.cf.n === 5), s = buildDaySlides(d);
            const i = s.findIndex(x => x.type === 'topic' && x.part === 1 && d.lessons[x.lessonIndex].cf.block.id === id);
            goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = i; render();
            await new Promise(r => setTimeout(r, 450));
            const w = document.getElementById('lessonSlideWrap'), stage = document.getElementById('lessonStage');
            const box = w && [...w.querySelectorAll('.lgn-note')].find(x => !x.closest('.np-mini')), p = box && box.querySelector('p');
            const pop = document.getElementById('lgnPop');
            const cs = p ? getComputedStyle(p) : null;
            return { i, text: box ? box.textContent.replace(/\s+/g, ' ').replace(/^\W+/, '').trim() : '', size: cs ? parseFloat(cs.fontSize) : 0, weight: cs ? Number(cs.fontWeight) : 0,
                pop: pop ? pop.textContent.replace(/\s+/g, ' ') : '', over: w ? w.scrollHeight - w.clientHeight : -1, below: stage ? stage.getBoundingClientRect().bottom - innerHeight : 99, pages: state.slidePages || 1 };
        }, { id, trainer });
        // a trainee who has seen nothing yet
        await page.evaluate(async () => { await storeSet('litigation-note-seen', {}); await cmLitigationNote.reload(); });
        for (const id of BLOCKS) {
            const t = await go(id, false);
            check(t.i >= 0, `${L} Day 5 has ${id}'s first slide`);
            check(t.text === NOTE, `${L} ${id}: the note is on the slide, word for word${t.text === NOTE ? '' : ` ("${t.text.slice(0, 90)}…")`}`);
            check(t.size >= 16 && t.weight >= 600, `${L} ${id}: in bold type of at least 16px (${t.size}px, weight ${t.weight})`);
            check(t.over <= 2 && t.below <= 1 && t.pages === 1, `${L} ${id}: the slide still fits one screen (inside +${t.over}, below +${Math.round(t.below)}, ${t.pages} page)`);
            if (id === 'd4m1-l1') { check(!t.pop, `${L} ${id}: the start of the section has the callout, no pop-up`); continue; }
            check(t.pop.includes(NOTE), `${L} ${id}: a trainee gets it as a pop-up too`);
            if (id === 'd4m1-a2') {
                await page.click('#lgnPop [data-lgn-ok]'); await sleep(300);
                const after = await page.evaluate(async () => ({ pop: !!document.getElementById('lgnPop'), saved: JSON.parse(localStorage.getItem('lsh_litigation-note-seen') || '{}'), key: PERSONAL_KEYS.includes('litigation-note-seen') }));
                check(!after.pop && after.saved['d4m1-a2'] > 0 && after.key, `${L} ${id}: "Got it" puts it away and saves it to the trainee's progress (${JSON.stringify(after)})`);
                const again = await go(id, false);
                check(!again.pop && again.text === NOTE, `${L} ${id}: back on the step, no pop-up again, and the callout is still on the slide`);
            }
            await page.evaluate(() => { const p = document.getElementById('lgnPop'); if (p) p.remove(); });
        }
        // a trainer: no pop-up; Presenter view says to read it aloud
        await page.evaluate(async () => { await storeSet('litigation-note-seen', {}); await cmLitigationNote.reload(); });
        const tr = await go('d4m1-a1', true);
        check(!tr.pop && tr.text === NOTE, `${L} a trainer gets the callout on the slide and no pop-up`);
        const cue = await page.evaluate(() => { const d = DAYS.find(x => x.cf && x.cf.n === 5), s = buildDaySlides(d); const sl = s.find(x => x.type === 'topic' && x.part === 1 && d.lessons[x.lessonIndex].cf.block.id === 'd4m1-l1');
            return typeof presenterCues === 'function' ? String(presenterCues(d, sl) || '') : ''; });
        check(/Read this note aloud/.test(cue) && cue.includes('verify the assigned Case Manager'), `${L} Presenter view's notes say to read the note aloud`);
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: the Litigation note is at the start of the section and on every handoff step, word for word.');
})().catch(e => { console.error(e); process.exit(1); });
