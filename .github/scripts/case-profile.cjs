// @check browser — The Case Profile (was 📁 Case File): "John Doe VS Robert Smith", a header card, 👋 Meet John Doe on the profile and not in the lesson deck, and Day 1's slide that opens it with a way back
// The owner's requirements, checked in a real browser:
//   · the case title reads exactly "John Doe VS Robert Smith" (CM_CASE_FLOW.case.style) and no "Doe v. (Robert) Smith"
//     is left in what the course shows: the case data, the slides, the trainer scripts, the simulation, and the pages;
//   · the page and its top-bar tab are "Case Profile" (not "Case File"); its header card shows the client, the case
//     title, the date of loss, the claim and the coverage;
//   · 👋 Meet John Doe is the profile's first tab, the one a trainee lands on: the collision, the client, the team, who
//     pays in order, the critical fact and the UPL line, with no answer a trainee is meant to find in the documents
//     (where John Doe sat); the page fits one screen on a laptop and a large screen, every tab, trainee and trainer;
//   · Meet John Doe is not in the lesson deck: no block d1m1-case, no lesson titled Meet Your Case / Meet John Doe;
//     Day 1 opens its lessons with Case Management Fundamentals, and its one Meet John Doe slide sits right after the
//     last lesson, before the Practice Lab; its button "Open the Case Profile: Meet John Doe" opens the profile on
//     Meet John Doe, and "← Back to Case Flow Day 1" brings the trainee back to that slide.
// Usage: node .github/scripts/case-profile.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const SIZES = [[1366, 768], [1920, 1080]];
const TITLE = 'John Doe VS Robert Smith';
const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };
const sleep = ms => new Promise(r => setTimeout(r, ms));

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    for (const [W, H] of SIZES) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        page.on('pageerror', e => failures.push(`${W}x${H} page error: ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await sleep(700);
        await signIn(page, 'Case', 'Profile', 'B100926');
        await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });

        if (W === SIZES[0][0]) {
            // the title, everywhere the course carries it
            const t = await page.evaluate((TITLE) => {
                const re = /\bDoe v\.? (Robert )?Smith\b/;
                const left = ['CM_CASE_FLOW', 'CM_CF_SLIDES', 'CM_CF_SCRIPTS', 'CM_CF_SIM', 'CM_CF_DOCS'].filter(k => window[k] && re.test(JSON.stringify(window[k])));
                return { style: (window.CM_CASE_FLOW || {}).case && CM_CASE_FLOW.case.style, left };
            }, TITLE);
            check(t.style === TITLE, `the case style is "${TITLE}" (it is "${t.style}")`);
            check(!t.left.length, `no "Doe v. Smith" left in the course's data${t.left.length ? ': ' + t.left.join(', ') : ''}`);

            // the deck: Meet John Doe is not a lesson; Day 1's slide after the lessons opens the profile
            const deck = await page.evaluate(() => {
                state.isAdmin = false; state.adminPreview = false; state.adminUnlockedDays = DAYS.map(d => d.id);
                const d = DAYS.find(x => x.cf && x.cf.n === 1), s = buildDaySlides(d);
                const blocks = DAYS.filter(x => x.cf).flatMap(x => x.lessons.map(l => l.cf.block));
                const ids = s.map(sl => sl.type === 'topic' ? d.lessons[sl.lessonIndex].cf.block : null);
                const lastLesson = ids.map((b, k) => b && b.kind === 'lesson' ? k : -1).reduce((a, k) => Math.max(a, k), -1);
                const firstLesson = ids.find(b => b && b.kind === 'lesson');
                return { gone: blocks.some(b => b.id === 'd1m1-case'), meetLesson: blocks.filter(b => /^Meet (Your (Case|Client)|John Doe)/i.test(b.title)).map(b => b.id),
                    first: firstLesson && firstLesson.id, meet: s.findIndex(sl => sl.type === 'meetJohnDoe'), meets: s.filter(sl => sl.type === 'meetJohnDoe').length,
                    lab: s.findIndex(sl => sl.type === 'practiceLab'), lastLesson, dayId: d.id,
                    others: DAYS.filter(x => x.cf && x.cf.n !== 1).some(x => buildDaySlides(x).some(sl => sl.type === 'meetJohnDoe')) };
            });
            check(!deck.gone && !deck.meetLesson.length, `Meet John Doe is not a lesson (d1m1-case ${deck.gone ? 'still there' : 'gone'}${deck.meetLesson.length ? '; lessons: ' + deck.meetLesson.join(', ') : ''})`);
            check(deck.first === 'd1m1-role', `Day 1's lessons open with Case Management Fundamentals (d1m1-role): ${deck.first}`);
            check(deck.meets === 1 && deck.meet === deck.lastLesson + 1 && deck.lab === deck.meet + 1 && !deck.others, `Day 1 has one Meet John Doe slide, right after its last lesson and before the Practice Lab (slide ${deck.meet + 1}; last lesson ${deck.lastLesson + 1}; Practice Lab ${deck.lab + 1})`);
            const slide = await page.evaluate(async (deck) => {
                goto('day', deck.dayId); state.dayViewMode = 'slides'; state.lessonSlide = deck.meet; render(); await new Promise(r => setTimeout(r, 400));
                const w = document.getElementById('lessonSlideWrap'), btn = w && [...w.querySelectorAll('button')].find(b => /Open the Case Profile: Meet John Doe/.test(b.textContent));
                const stage = document.getElementById('lessonStage');
                return { btn: !!btn, over: w ? w.scrollHeight - w.clientHeight : -1, bottom: stage ? stage.getBoundingClientRect().bottom - innerHeight : 99,
                    small: w ? [...w.querySelectorAll('.cfx-sheet p, .cfx-sheet li, .cfx-sheet button')].filter(e => parseFloat(getComputedStyle(e).fontSize) < 16 || Number(getComputedStyle(e).fontWeight) < 600).length : -1 };
            }, deck);
            check(slide.btn, 'the Meet John Doe slide has the button "Open the Case Profile: Meet John Doe"');
            check(slide.over <= 2 && slide.bottom <= 1, `the Meet John Doe slide fits the screen (inside +${slide.over}, below +${Math.round(slide.bottom)})`);
            check(slide.small === 0, `its type is bold and at least 16px (${slide.small} smaller or lighter)`);
            await page.click('#lessonSlideWrap button:has-text("Open the Case Profile: Meet John Doe")');
            await sleep(500);
            const opened = await page.evaluate(() => ({ view: state.view, tab: (document.querySelector('.cf-file-tab.on') || {}).textContent || '', meet: !!document.querySelector('.cpx-meet'),
                pill: (() => { const p = document.getElementById('cf-return'); return p && !p.hidden ? p.textContent : ''; })() }));
            check(opened.view === 'clientprofile' && opened.meet && /Meet John Doe/.test(opened.tab), `the button opens the Case Profile on 👋 Meet John Doe (view ${opened.view}, tab "${opened.tab.trim()}")`);
            check(/Back to Case Flow Day 1/.test(opened.pill), `with "← Back to Case Flow Day 1" on the page ("${opened.pill}")`);
            await page.evaluate(() => cmCaseFlow.back()); await sleep(500);
            const backAt = await page.evaluate(() => ({ view: state.view, at: state.lessonSlide, type: (buildDaySlides(DAYS.find(x => x.id === state.dayId))[state.lessonSlide] || {}).type }));
            check(backAt.view === 'day' && backAt.at === deck.meet, `and back brings the trainee to the Meet John Doe slide (${backAt.view} slide ${backAt.at + 1}, ${backAt.type})`);
        }

        // the page: a trainee, then a trainer
        for (const role of ['trainee', 'trainer']) {
            const r = await page.evaluate(async (role) => {
                state.isAdmin = role === 'trainer'; state.adminPreview = false; state.cfFileTab = null; state.cfReturn = null;
                goto('clientprofile'); await new Promise(r => setTimeout(r, 500));
                const main = document.querySelector('#app > main'), hero = document.querySelector('.cf-file-hero');
                const tabs = [...document.querySelectorAll('.cf-file-tab')];
                const out = { first: tabs[0] ? tabs[0].textContent.trim() : '', on: (document.querySelector('.cf-file-tab.on') || {}).textContent || '',
                    h1: hero ? (hero.querySelector('h1') || {}).textContent || '' : '', head: hero ? hero.innerText : '', switch: (document.querySelector('.cf-file-switch .on') || {}).textContent || '',
                    bar: [...document.querySelectorAll('button')].filter(b => /goto\('clientprofile'\)/.test(b.getAttribute('onclick') || '') && b.offsetParent).map(b => b.textContent.trim()),
                    eyebrow: typeof PAGE_EYEBROWS !== 'undefined' ? PAGE_EYEBROWS.clientprofile : '', meet: (document.querySelector('.cpx-meet') || {}).innerText || '', over: [] };
                for (const b of tabs) { b.click(); await new Promise(r => setTimeout(r, 300));
                    const w = document.documentElement.scrollHeight - innerHeight, y = main.scrollHeight - main.clientHeight, t = document.querySelector('.cpx-tab, .cf-file-cols');
                    const inner = t ? t.scrollHeight - t.clientHeight : 0;
                    if (w > 2 || y > 2 || inner > 2) out.over.push(`${b.textContent.trim()} (window+${w}, body+${y}, tab+${inner}${t && t.style.fontSize ? " at " + t.style.fontSize : ""})`); }
                return out;
            }, role);
            const L = `${W}x${H} ${role}:`;
            check(/Meet John Doe/.test(r.first) && /Meet John Doe/.test(r.on), `${L} 👋 Meet John Doe is the first tab and the one the page opens on ("${r.first}", on "${r.on.trim()}")`);
            check(r.h1.includes(TITLE), `${L} the page's title is the case title ("${r.h1.trim()}")`);
            check(/Your Client/i.test(r.head) && /John Doe/.test(r.head) && /Date of loss/i.test(r.head) && /Coverage/i.test(r.head) && /\$40,000/.test(r.head) && /Claim/i.test(r.head), `${L} the header card shows the client, the date of loss, the claim and the coverage`);
            check(/Case Profile/.test(r.switch) && r.eyebrow === 'Case Profile' && r.bar.length > 0 && r.bar.every(t => /Case Profile/.test(t) && !/Case File/.test(t)), `${L} it is called "Case Profile", not "Case File" (switch "${r.switch}", eyebrow "${r.eyebrow}", top bar ${JSON.stringify(r.bar)})`);
            if (role === 'trainee') {
                const want = [/7:10 a\.m\./, /Maple Hollow Rd & Birch Ave/, /Atty\. Elijah Thorne/, /BI · \$10,000/i, /HOST UM · \$20,000/i, /REL UM · \$10,000/i, /Treatment Gap/, /UPL/];
                const missing = want.filter(re => !re.test(r.meet)).map(String);
                check(!missing.length, `${L} Meet John Doe carries the case's facts${missing.length ? '; missing ' + missing.join(', ') : ''}`);
                check(!/front[- ]seat passenger|front passenger|passenger seat/i.test(r.meet), `${L} and never says where John Doe sat (the trainee finds it in the Police Report)`);
            }
            check(!r.over.length, `${L} every tab fits one screen${r.over.length ? ': ' + r.over.join('; ') : ''}`);
        }
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: the Case Profile carries John Doe VS Robert Smith, its header card and Meet John Doe; the deck sends Day 1 there and back.');
})().catch(e => { console.error(e); process.exit(1); });
