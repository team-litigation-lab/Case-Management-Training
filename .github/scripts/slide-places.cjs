// @check browser — A saved place follows its slide (On the Job and Milestone Steps are gone, Why It Matters opens The Theory, and a day is now all its lessons and then one Practice Lab, and six Day 1 lessons are drawn from the deck pages, and Meet Your Case left Day 1 for the Case Profile: a place saved in any older deck lands on the same slide of the same block, or on its lesson's deck page, never past the end; and since layout 7, a place is saved by slide key and follows its slide through any deck change)
// A trainee's place in a day is a slide position ("last-slide", "slide-progress", and the slide kept across the reload
// that brings in a new version). The Case Flow decks have changed twice: the lessons lost their On the Job slide (the
// Trigger ➔ Task ➔ Tool ➔ Checkpoint cards); and then, in one change, the 26 Milestone Steps slides went (their steps
// are in the trainer's talking points for The Rules) and Why It Matters became the opening line of The Theory in every
// lesson that has one. A position saved in an older deck would open a few slides too far on, and a trainee near the
// end would find the Knowledge Check open on slides never seen. js/cm-slide-places.js moves a saved place once.
// Then the ORDER of a day changed (layout 4): a day is ALL of its lessons, then ONE Practice Lab holding all of its
// Skill Activities, then the Ready check as its last slide (before, groups of lessons and their activities took turns,
// and Day 1's Ready check sat inside its last activity). No slide was added or removed, every one sits elsewhere.
// Then the trainers' deck pages came in (layout 5). Six lessons are drawn from the trainer's own deck pages
// (js/cm-deck-slides.js): such a lesson has another number of slides, so a place saved in one keeps its lesson and how
// far through it the trainee was (slide j of the m the lesson had becomes deck page ⌊j·n/m⌋ of its n), after it has
// been carried to today's order. And the revised Day 2 deck's pages are slides of their own on Day 2, between its
// last lesson and its Practice Lab (js/cm-deck-pages.js, type "deckPage"): they are in no older deck, so a place saved
// before them stays on its slide and never lands on one, and they count as seen only for a trainee who was past them.
// Then Day 1's four Skill Building pages went (layout 6): the last two deck pages of d1m1-l1 and of d1m4-tcare
// (GONE6); and Day 2's four Skill Building slides went from its deck pages, one after each topic's last page
// (GONE6_DECK). A place on one lands on its lesson's (or topic's) last page; every slide after them moved up.
// Then Meet John Doe left the lesson deck (layout 7): Day 1's Meet Your Case (d1m1-case) and the two introduction
// slides after it are gone (their facts are on the Case Profile, js/cm-case-profile.js), and one new slide after Day
// 1's last lesson (type "meetJohnDoe") sends the trainee there. A place on a slide that is gone lands on the slide
// before it (the Training Agenda); no older place lands on the new slide, and it counts as seen once passed.
// The layouts: 1, the deck with On the Job (what a place with no layout on it was saved in); 2, without On the Job,
// with the Milestone Steps slides and every Why It Matters slide; 3, without those, in the old order: the live deck
// before these changes; 4, today's order with every lesson on its own drawn slides and no deck page; 5, with the deck
// pages, the Skill Building pages and Meet Your Case; 6, without the Skill Building pages; 7, without Meet Your Case;
// 8, without the lesson cards the trainers' decks replaced (GONE8: a place on one lands on the slide before it). The decks of layouts
// 1, 2 and 3 are recorded below as data (OLD, OLD3), slide by slide, in the order they were; layout 4's is today's
// deck with each deck lesson's pages replaced by the slides OLD3 records for it, and without the deckPage slides;
// layout 6's is today's deck, and layout 5's is today's deck with the Skill Building pages put back (GONE6, GONE6_DECK).
// All three have Meet Your Case and its two slides put back (GONE7), and none has Meet John Doe's slide. Checked:
//   · the recorded decks are today's slides (each exactly once) plus the slides that are gone, and nothing else;
//   · a place in a lesson that is drawn from the deck now lands on that lesson's deck page ⌊j·n/m⌋, in every older
//     layout: its first slide on its first page, in order, never outside the lesson;
//   · every position of every day's deck, in all four older layouts, lands on the same slide of the same block where
//     it still exists; a Why It Matters slide that is gone on its lesson's The Theory, and a Milestone Steps slide on
//     its lesson's The Rules; an On the Job slide on its lesson's slide before it; never past the end of the day;
//   · the furthest slide reached becomes the furthest, in today's order, of the slides the trainee had seen: never
//     behind the place the trainee was on, no slide seen is locked again, and it is the day's last slide only for a
//     trainee who had reached the Ready check or the end of the old deck;
//   · a place saved in layout 3 inside the Practice Lab (Day 2, an activity's AI Grader slide) opens that same slide
//     in the one Practice Lab, moved once;
//   · a trainee on slide 40 of Day 1 (layout 1) lands on that lesson when the saved progress is read and the day
//     opened, after a real reload of the page too, and is moved once only; a place past the end lands on the last slide;
//     a place this page makes itself is never moved, and is saved with its layout on it;
//   · a place saved in layout 2 on a Why It Matters slide that is gone opens The Theory of that lesson, and one saved
//     on a Milestone Steps slide opens The Rules of that lesson, each moved once;
//   · the reload after an update: a slide kept by a page running either older deck is moved by that deck's map, one
//     kept by this code is not;
//   · copy left over from the old decks (a "job" or "steps" entry in the slides or the trainer scripts, a "slide": true
//     on a Milestone rail) draws nothing and breaks nothing.
// Layout 8 is the last numbered layout: from it on, a place is saved with its slide's KEY (js/cm-slide-keys.js), so a
// deck change needs no layout, no migration and no edit to this check. Checked (5), on whatever deck is live, without
// naming a slide or counting one: a place saved goes with its slide's key and the keys before it; read again after the
// deck changes in the page (a slide put in before it, its own slide taken out, its lesson moved before the block ahead
// of it), the place and the furthest slide reached follow their slides by key (a slide gone: the slide before it), the
// furthest never behind the place (also when only the furthest moved), and both are saved again with their keys; a
// place saved without keys, or since by a page that saves none, is a position in layout 8's deck: on a changed deck it
// opens the slide layout 8 had there (layout 7's record, js/cm-slide-keys7.js, without GONE8) and gets its keys; so does
// one another tab of such a page writes; a run of slides that takes every key a place was saved with leaves it on its
// index, never past the end; after a real reload, and after the reload of an update.
// The tests above of the older layouts describe moves into layout 7's deck, and js/cm-slide-places.js moves an older
// place into THAT deck, frozen in js/cm-slide-keys7.js (window.CM_SLIDE_KEYS7: each day's slide keys), then by key into
// layout 8's, never into today's: so every position of every older layout is checked against layout 7's deck rebuilt
// from that record, on any deck, the record itself against DECK7 (its keys, counted and hashed, taken when it was
// made), and the step into layout 8's deck by key. A place saved in layout 8 without keys (every place saved before
// keys, an older page, another device) is put on its slide of today's deck by the key layout 8 gave it (checked on a
// changed deck in 5). The tests that open a day in the page and look at the slide it lands on stand on a day only
// while its live deck is still layout 8's.
// Usage: node .github/scripts/slide-places.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
// Layout 1's deck of each Case Flow day, in order: '~type' is a slide outside any block; 'block view view …' is a block's
// run of slides ('job': On the Job; 'steps': Milestone Steps; 'why': Why It Matters). Layout 2's deck is the same
// without the 'job' slides.
const OLD = {
  1: ['~taskOverview', 'd1m1-case theory frame why rules model job dodont', '~caseMap', '~coverageMap', 'd1m1-role theory frame why rules model job', 'd1m1-upl theory why rules model steps dodont', 
    'd1m1-l1 map theory theory2 frame why rules model steps dodont', 'd1m4-l1 theory frame why rules model job dodont', '~practiceLab', 'd1m1-open task case check', 'd1m1-drive task case check', 
    'd1m3-l1 theory why rules model job dodont', 'd1m3-l2 theory frame why rules model job dodont', 'd1m3-a1 task case check', 'd1m3-a2 task case check', 'd1m3-a3 task case check', 
    'd1m2-l1 theory frame why rules model steps dodont', 'd1m2-l2 theory frame why rules model job dodont', 'd1m2-a1 task case check', 'd1m2-a2 task', '~readyCheck', 'd1m2-a2 case check'],
  2: ['~taskOverview', 'd2m1-l2 theory why rules steps', 'd2m1-afd theory why rules steps', 'd2m1-liab why rules job', 'd2m1-first why rules', 'd2m1-l1 map theory why rules job', '~practiceLab', 
    'd1m1-a1 task case check', 'd2m1-a1 task case check', 'd2m1-a2 task case check', 'd1m4-tplan theory why rules steps', 'd1m4-tmap theory why rules steps', 
    'd1m4-tcare map theory why rules steps', 'd1m4-l2 why rules steps', 'd1m4-a1 task case check', 'd1m4-a2 task case check', 'd2m1-cov theory theory2 frame why rules model steps dodont', 
    'd2m2-l1 why rules job', 'd2m2-eob theory theory2 frame why rules model job', 'd2m2-pip why rules steps', 'd1m4-emc why rules steps', 'd2m2-lop why doc rules job', 'd2m2-cost why rules job', 
    'd2m2-a1 task case check', 'd2m2-a3 task case check', 'd1m1-l2 why rules job', 'd1m1-a2 task case audit check', 'd2m2-sum theory why rules job', 'd2m2-l2 map theory why rules steps', 
    'd2m2-a2 task case check', 'd2-drive task case check', '~readyCheck'],
  3: ['~taskOverview', 'd2m3-l1 theory why rules steps', 'd2m3-l2 theory theory2 frame why rules model job', '~practiceLab', 'd2m3-a1 task case model check', 'd2m3-a2 task case model check', 
    'd2m3-cause theory why doc rules model steps', 'd2m4-l1 theory theory2 frame why rules model steps', 'd2m4-l2 theory why rules steps', 'd2m4-wage task case audit check', 
    'd2m4-a1 task case check', 'd2m4-a2 task case check', 'd3m1-l1 theory frame why doc rules model job dodont', 'd3m1-l2 theory why doc rules steps', 'd3m1-pkg theory why doc rules job', 
    'd3-drive task case check', 'd3m1-a1 task case grade audit check', 'd3m1-a2 task case grade check', 'd3m2-l1 theory why rules job', 'd3m2-umw theory why doc rules steps', 
    'd3m2-l2 theory why rules steps', 'd3m2-a1 task case check', 'd3m2-rel task case audit check', 'd3m2-exec task case check', 'd3m2-bins task case check', 'd3m2-a2 task case check', 
    'd3m2-umns task case check', '~readyCheck'],
  4: ['~taskOverview', 'd3m3-l1 theory frame why rules model steps dodont', 'd3m3-l2 theory frame why rules model steps', 'd3m3-l3 why doc rules job', '~practiceLab', 'd3m3-a1 task case check', 
    'd3m3-a2 task case check', 'd3m4-l1 theory frame why rules model job', 'd3m4-l2 theory why doc rules steps', 'd3m4-close theory why rules steps', 'd3m4-a1 task case check', 
    'd3m4-pal task case audit check', 'd3m4-a2 task case check', 'd4-drive task case check', 'd4m2-l1 theory why doc rules job', 'd4m2-um theory frame why rules model job dodont', 
    'd4m2-l2 theory frame why rules model steps dodont', 'd4m2-a3 task case check', 'd4m2-a1 task case check', 'd4m2-medcal task case check', 'd4m2-a2 task case check', 
    'd4m2-arbcal task case check', 'd4m3-l1 theory theory2 frame why doc rules model steps dodont', 'd4m3-l2 theory frame why rules model job dodont', 'd4m3-prior theory why rules job', 
    'd4m3-tx why rules job', 'd4m3-a1 task case grade audit check', 'd4m3-a2 task case grade audit check', '~readyCheck'],
  5: ['~taskOverview', 'd4m1-l1 why rules job', 'd4m1-l2 why rules job', 'd4m4-l1 why rules job', 'd4m4-l2 why rules job', 'd5m1-l1 why rules job', 'd5m1-l2 why rules job', 
    'd5m1-subp why rules job', 'd5m2-l1 why rules job', 'd5m3-l1 why rules job', 'd5m3-l2 why rules job', 'd5m4-l1 why rules job', 'd5m4-l2 why rules job', 'd5m5-l1 why rules job', 
    'd5m6-l1 why rules job', '~companionBuild', '~companionBuild2', '~readyCheck', '~extraPractice', 'd4m1-a1 task case check', 'd4m1-a2 task case check', 'd4m1-efile task case check', 
    'd4m4-a1 task case check', 'd4m4-a2 task case check', 'd5m1-a1 task case check', 'd5m1-a2 task case check', 'd5m2-a1 task case check', 'd5m3-a1 task case check', 'd5m3-a2 task case check', 
    'd5m4-a1 task case check', 'd5m4-a2 task case check', 'd5m5-a1 task case check', 'd5-drive task case check', 'd5m6-a1 task case check']
};
// Layout 3's deck (the same slides as today's, in the order they were before the lessons were put together), recorded
// from the deck itself before the order changed.
const OLD3 = {
  1: ['~taskOverview', 'd1m1-case theory frame rules model dodont', '~caseMap', '~coverageMap', 'd1m1-role theory frame rules model', 'd1m1-upl theory rules model dodont', 
    'd1m1-l1 map theory theory2 frame rules model dodont', 'd1m4-l1 theory frame rules model dodont', '~practiceLab', 'd1m1-open task case check', 'd1m1-drive task case check', 
    'd1m3-l1 theory rules model dodont', 'd1m3-l2 theory frame rules model dodont', 'd1m3-a1 task case check', 'd1m3-a2 task case check', 'd1m3-a3 task case check', 
    'd1m2-l1 theory frame rules model dodont', 'd1m2-l2 theory frame rules model dodont', 'd1m2-a1 task case check', 'd1m2-a2 task', '~readyCheck', 'd1m2-a2 case check'],
  2: ['~taskOverview', 'd2m1-l2 theory rules', 'd2m1-afd theory rules', 'd2m1-liab why rules', 'd2m1-first why rules', 'd2m1-l1 map theory rules', '~practiceLab', 'd1m1-a1 task case check', 
    'd2m1-a1 task case check', 'd2m1-a2 task case check', 'd1m4-tplan theory rules', 'd1m4-tmap theory rules', 'd1m4-tcare map theory rules', 'd1m4-l2 why rules', 'd1m4-a1 task case check', 
    'd1m4-a2 task case check', 'd2m1-cov theory theory2 frame rules model dodont', 'd2m2-l1 why rules', 'd2m2-eob theory theory2 frame rules model', 'd2m2-pip why rules', 'd1m4-emc why rules', 
    'd2m2-lop why doc rules', 'd2m2-cost why rules', 'd2m2-a1 task case check', 'd2m2-a3 task case check', 'd1m1-l2 why rules', 'd1m1-a2 task case audit check', 'd2m2-sum theory rules', 
    'd2m2-l2 map theory rules', 'd2m2-a2 task case check', 'd2-drive task case check', '~readyCheck'],
  3: ['~taskOverview', 'd2m3-l1 theory rules', 'd2m3-l2 theory theory2 frame rules model', '~practiceLab', 'd2m3-a1 task case model check', 'd2m3-a2 task case model check', 
    'd2m3-cause theory doc rules model', 'd2m4-l1 theory theory2 frame rules model', 'd2m4-l2 theory rules', 'd2m4-wage task case audit check', 'd2m4-a1 task case check', 
    'd2m4-a2 task case check', 'd3m1-l1 theory frame doc rules model dodont', 'd3m1-l2 theory doc rules', 'd3m1-pkg theory doc rules', 'd3-drive task case check', 
    'd3m1-a1 task case grade audit check', 'd3m1-a2 task case grade check', 'd3m2-l1 theory rules', 'd3m2-umw theory doc rules', 'd3m2-l2 theory rules', 'd3m2-a1 task case check', 
    'd3m2-rel task case audit check', 'd3m2-exec task case check', 'd3m2-bins task case check', 'd3m2-a2 task case check', 'd3m2-umns task case check', '~readyCheck'],
  4: ['~taskOverview', 'd3m3-l1 theory frame rules model dodont', 'd3m3-l2 theory frame rules model', 'd3m3-l3 why doc rules', '~practiceLab', 'd3m3-a1 task case check', 
    'd3m3-a2 task case check', 'd3m4-l1 theory frame rules model', 'd3m4-l2 theory doc rules', 'd3m4-close theory rules', 'd3m4-a1 task case check', 'd3m4-pal task case audit check', 
    'd3m4-a2 task case check', 'd4-drive task case check', 'd4m2-l1 theory doc rules', 'd4m2-um theory frame rules model dodont', 'd4m2-l2 theory frame rules model dodont', 
    'd4m2-a3 task case check', 'd4m2-a1 task case check', 'd4m2-medcal task case check', 'd4m2-a2 task case check', 'd4m2-arbcal task case check', 
    'd4m3-l1 theory theory2 frame doc rules model dodont', 'd4m3-l2 theory frame rules model dodont', 'd4m3-prior theory rules', 'd4m3-tx why rules', 'd4m3-a1 task case grade audit check', 
    'd4m3-a2 task case grade audit check', '~readyCheck'],
  5: ['~taskOverview', 'd4m1-l1 why rules', 'd4m1-l2 why rules', 'd4m4-l1 why rules', 'd4m4-l2 why rules', 'd5m1-l1 why rules', 'd5m1-l2 why rules', 'd5m1-subp why rules', 'd5m2-l1 why rules', 
    'd5m3-l1 why rules', 'd5m3-l2 why rules', 'd5m4-l1 why rules', 'd5m4-l2 why rules', 'd5m5-l1 why rules', 'd5m6-l1 why rules', '~companionBuild', '~companionBuild2', '~readyCheck', 
    '~extraPractice', 'd4m1-a1 task case check', 'd4m1-a2 task case check', 'd4m1-efile task case check', 'd4m4-a1 task case check', 'd4m4-a2 task case check', 'd5m1-a1 task case check', 
    'd5m1-a2 task case check', 'd5m2-a1 task case check', 'd5m3-a1 task case check', 'd5m3-a2 task case check', 'd5m4-a1 task case check', 'd5m4-a2 task case check', 'd5m5-a1 task case check', 
    'd5-drive task case check', 'd5m6-a1 task case check']
};
// Layout 5's Day 1 Skill Building pages, gone in layout 6: how many each lesson ended on (its last deck pages)
const GONE6 = { 'd1m1-l1': 2, 'd1m4-tcare': 2 };
// and Day 2's Skill Building slides on its deck pages (js/cm-deck-pages.js), one after each topic's last page
const GONE6_DECK = { predemand: 1, demand: 1, negotiation: 1, bisettlement: 1 };
// Layout 7 took Meet Your Case (d1m1-case) out of the deck, with the two introduction slides after it: by day, the
// slide they followed and their rows as layouts 3 to 6 had them (layouts 1 and 2 record them in OLD). Meet John Doe's
// slide after Day 1's last lesson ('~meetJohnDoe') is new in layout 7.
const GONE7 = { 1: { after: '~taskOverview', rows: ['d1m1-case theory frame rules model dodont', '~caseMap', '~coverageMap'] } };
// Layout 8 took the lesson cards the trainers' decks replaced out of the course (their rules are 💡 Tips on the
// activities that practised them, js/cm-lesson-tips.js): each sat right after the lesson named here in layouts 4 to 7
// (several after one lesson, in this order), and is in OLD and OLD3 for layouts 1 to 3. Layout 8's deck is layout 7's
// frozen record without their slides: an older place is moved into layout 7's deck (checked in 1), then by key into
// layout 8's (cmSlidePlaces.to8, checked against __to8 here): a place on one of them lands on the slide before it.
const GONE8 = { 'd1m1-upl': 'd1m1-role', 'd1m3-l1': 'd1m4-l1', 'd1m2-l2': 'd1m2-l1', 'd2m2-pip': 'd2m2-eob',
  'd3m1-pkg': 'd3m1-l2', 'd3m2-l1': 'd3m1-l2', 'd3m2-umw': 'd3m1-l2' };
const LAYOUT = 8, OLDER = [1, 2, 3, 4, 5, 6, 7];
// Layout 7's deck, day by day: its slides' keys (js/cm-slide-keys.js keysOf), counted and hashed. The older layouts'
// records describe moves into this deck; a day whose deck has changed since is checked only for what holds for any
// deck, and by the slide-key tests (5). A record of that deck: never edit it to match a later one.
const DECK7 = { 1: '74:1d3nxnu', 2: '135:1c0ub5w', 3: '89:1en7hyz', 4: '97:1v90938', 5: '78:it84tj' };
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const failures = [], fail = m => failures.push(m);
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Slide', 'Places', 'B100926');
  // the deck of a day in an older layout, from the record: each slide's block and view, and where it should land in
  // today's deck (place: where that slide is now; reach: the furthest slide it stands for), worked out here from the
  // record and today's deck alone, never from js/cm-slide-places.js
  const ORACLE = `window.__deck7 = d => { const R = window.CM_SLIDE_KEYS7 || {}, row = (R.days || {})[d.cf.n] || [], meta = R.blocks || {}, lessons = [], slides = [], at = new Map();
      row.forEach(key => { const k = key.replace(/#[0-9]+$/, '');
        if (k.indexOf('~deckPage:') === 0) { const p = k.split(':'); slides.push({ type: 'deckPage', deck: p[1], page: +p[2] }); }
        else if (k[0] === '~') slides.push({ type: k.slice(1) });
        else { const c = k.indexOf(':'), id = k.slice(0, c);
          if (!at.has(id)) { at.set(id, lessons.length); lessons.push({ id, views: [], drawn: (meta[id] || {}).drawn || null }); }
          const L = lessons[at.get(id)]; L.views.push(k.slice(c + 1)); slides.push({ type: 'topic', lessonIndex: at.get(id), part: L.views.length }); } });
      return { slides, lessons }; };
    window.__OLD = ${JSON.stringify(OLD)}; window.__OLD3 = ${JSON.stringify(OLD3)}; window.__GONE6 = ${JSON.stringify(GONE6)}; window.__GONE6_DECK = ${JSON.stringify(GONE6_DECK)}; window.__GONE7 = ${JSON.stringify(GONE7)}; window.__GONE8 = ${JSON.stringify(GONE8)};
    // layout 8's deck as keys: layout 7's record without the slides of the lesson cards GONE8 names; and a position in
    // layout 7's deck, in layout 8's (its slide, or the nearest one before it that is still there)
    window.__k7 = d => ((window.CM_SLIDE_KEYS7 || {}).days || {})[d.cf.n] || [];
    window.__keys8 = d => __k7(d).filter(k => !__GONE8[k.replace(/#[0-9]+$/, '').split(':')[0]]);
    window.__to8 = (d, j) => { const k7 = __k7(d), k8 = __keys8(d); if (!k7.length) return j; for (let t = Math.min(j, k7.length - 1); t >= 0; t--) { const x = k8.indexOf(k7[t]); if (x >= 0) return x; } return 0; };
    window.__oldDeck = (d, layout, live) => { if (live) return __live(d, __oldDeck(d, layout)); const out = [], bad = [], seen = new Set();
      // layout 7's deck, from its frozen record (js/cm-slide-keys7.js): the deck every older place is moved into
      const F = __deck7(d), now = F.slides.map(sl => { const b = sl.type === 'topic' ? F.lessons[sl.lessonIndex] : null; return b ? { id: b.id, view: b.views[sl.part - 1], li: sl.lessonIndex } : { id: '~' + sl.type, view: sl.type === 'deckPage' ? sl.deck + ':' + sl.page : '', li: -1 }; });
      // layouts 4 to 6: today's order. Layout 4: a lesson drawn from the deck now on the slides layout 3 records for it,
      // and no deck page. Layout 5: the Skill Building pages that went in layout 6, back where they sat ('~sb' rows:
      // after the last deck page of a lesson in GONE6, after the last page of a topic in GONE6_DECK). All three: the
      // rows that left the deck in layout 7 (Meet Your Case and its two slides), back where they sat, and without Meet
      // John Doe's slide, which layout 7 added
      const DECKS = Object.fromEntries(F.lessons.filter(b => b.drawn).map(b => [b.id, true])), rec3 = id => (window.__OLD3[d.cf.n] || []).find(r => r.split(' ')[0] === id);
      const gone = window.__GONE7[d.cf.n] || { after: '', rows: [] }, goneIds = new Set(gone.rows.map(r => r.split(' ')[0]));
      const rows = layout >= 4 ? now.reduce((a, x, k) => {
          if (x.id === '~meetJohnDoe' && layout < 7) return a;
          const nx = now[k + 1], sb = n => { for (let g = 0; g < n; g++) a.push('~sb ' + x.id); };
          if (x.id === '~deckPage') { if (layout >= 5) a.push(x.id + ' ' + x.view);
            const topic = x.view.split(':')[0];
            if (layout === 5 && window.__GONE6_DECK[topic] && !(nx && nx.id === '~deckPage' && nx.view.split(':')[0] === topic)) sb(window.__GONE6_DECK[topic]);
            return a; }
          if (layout === 5 && window.__GONE6[x.id] && !(nx && nx.id === x.id)) {   // the lesson's last page: its Skill Building pages followed it
            if (a.length && a[a.length - 1].split(' ')[0] === x.id && now[k - 1].id === x.id) a[a.length - 1] += ' ' + x.view; else a.push(x.id + ' ' + x.view);
            sb(window.__GONE6[x.id]); return a; }
          if (DECKS[x.id] && layout < 5) { if (!k || now[k - 1].id !== x.id) a.push(rec3(x.id) || x.id); }
          else if (x.id[0] === '~') { a.push(x.id); if (x.id === gone.after && layout < 7) gone.rows.forEach(r => a.push(r)); }
          else if (a.length && a[a.length - 1].split(' ')[0] === x.id && now[k - 1].id === x.id) a[a.length - 1] += ' ' + x.view; else a.push(x.id + ' ' + x.view); return a; }, [])
        : (layout >= 3 ? window.__OLD3 : window.__OLD)[d.cf.n] || [];
      rows.forEach(row => { const [id, ...views] = row.split(' ');
        // a Skill Building page that went in layout 6: lands on the slide before it (its lesson's or topic's last page)
        if (id === '~sb') { const prev = out[out.length - 1]; out.push({ id: id + ' ' + views[0], view: '', li: prev.li, place: prev.place, own: prev.own, kept: false, sb: true }); return; }
        // a row that left the deck in layout 7: each of its slides lands on the slide before it
        if (goneIds.has(id)) { (id[0] === '~' ? [''] : views).forEach(view => { if (view === 'job' && layout > 1) return;
          if (now.some(x => x.id === id)) bad.push(id + ' is gone in the record of layout 7 and still in the deck');
          const prev = out[out.length - 1]; out.push({ id, view, li: -1, place: prev ? prev.place : 0, own: prev ? prev.own : 0, kept: false, gone: true }); }); return; }
        // a lesson drawn from the trainer's deck now (layout 5): its old slides spread over its deck pages, in order
        if (DECKS[id]) { const was = views.filter(v => !(v === 'job' && layout > 1)), first = now.findIndex(x => x.id === id), n = now.filter(x => x.id === id).length;
          if (first < 0 || !n || !was.length || now.slice(first, first + n).some(x => x.id !== id)) { bad.push(id + ': its deck pages are not together in the deck, or the record has no slide for it'); return; }
          for (let q = 0; q < n; q++) { if (seen.has(first + q)) bad.push(id + ' is in the record twice'); seen.add(first + q); }
          was.forEach((view, j) => { const t = first + Math.min(n - 1, Math.floor(j * n / was.length)); out.push({ id, view, li: now[first].li, place: t, own: t, kept: false, deck: true, j, m: was.length, n, first }); });
          return; }
        (id[0] === '~' ? [views[0] || ''] : views).forEach(view => {
          if (view === 'job' && layout > 1) return;
          const k = now.findIndex(x => x.id === id && x.view === view);   // the same slide of the same block, wherever today's order puts it
          if (k >= 0 && layout < 3 && view === 'why' && now.some(x => x.id === id && x.view === 'theory')) bad.push(id + ' still has a Why It Matters slide beside its Theory');
          if (k >= 0) { if (seen.has(k)) bad.push(id + ' ' + view + ' is in the record twice'); seen.add(k); out.push({ id, view, li: now[k].li, place: k, own: k, kept: true }); return; }
          const prev = out[out.length - 1];
          if (layout >= 3 || (view !== 'job' && view !== 'why' && view !== 'steps') || !prev || prev.id !== id) { bad.push(id + ' ' + view + ' is in the record of layout ' + layout + ' and not in the deck'); return; }
          const th = now.findIndex(x => x.id === id && x.view === 'theory'), ru = now.findIndex(x => x.id === id && x.view === 'rules');
          if (view === 'why' && th < 0) { bad.push(id + ': Why It Matters is gone from a lesson with no Theory slide'); return; }
          if (view === 'steps' && ru < 0) { bad.push(id + ': Milestone Steps is gone from a lesson with no The Rules slide'); return; }
          out.push({ id, view, li: prev.li, place: view === 'why' ? th : view === 'steps' ? ru : prev.own, own: prev.own, kept: false });   // own: the slide the trainee had passed to get there
        }); });
      // (the revised deck's pages, js/cm-deck-pages.js, are in no deck before layout 5; Meet John Doe's slide in none before layout 7)
      now.forEach((x, k) => { if (!seen.has(k) && !(x.id === '~deckPage' && layout < 5) && x.id !== '~meetJohnDoe') bad.push('slide ' + (k + 1) + ' of the deck (' + x.id + ' ' + x.view + ') is not in the record of layout ' + layout); });
      // the furthest slide reached, at each old position: the furthest, in today's order, of everything up to it
      let far = 0; out.forEach(x => { far = Math.max(far, x.own, x.place); x.reach = far; });
      out.bad = bad; return out; };
    // the same positions where the page puts them, in layout 8's deck (today's while the live deck is layout 8's, deck8):
    // place, reach, own and first by __to8, and the lesson by its block in today's day
    window.__live = (d, old) => { const F = __deck7(d), out = old.map(x => Object.assign({}, x, { place: __to8(d, x.place), reach: __to8(d, x.reach), own: __to8(d, x.own),
        first: x.first == null ? x.first : __to8(d, x.first), li: x.li < 0 ? -1 : d.lessons.findIndex(l => l.cf && l.cf.block.id === F.lessons[x.li].id) }));
      out.bad = old.bad; return out; };`;
  await page.evaluate(ORACLE);
  // the frozen record of layout 7's deck (js/cm-slide-keys7.js) is that deck, slide for slide (DECK7); and which days'
  // live decks are still layout 7's: the tests that open a day in the page stand on those only
  const rec7 = await page.evaluate((DECK7) => {
    const h = s => { let x = 5381; for (let i = 0; i < s.length; i++) x = (x * 33 + s.charCodeAt(i)) >>> 0; return x.toString(36); }, o = {}, bad = [], R = window.CM_SLIDE_KEYS7;
    if (!R || !R.days || !R.blocks) return { o, bad: ["js/cm-slide-keys7.js (window.CM_SLIDE_KEYS7, layout 7's deck) is not loaded"] };
    Object.keys(DECK7).forEach(n => { const k = R.days[n] || []; if (DECK7[n] !== k.length + ':' + h(k.join(' '))) bad.push(`js/cm-slide-keys7.js: Day ${n} is not layout 7's deck (${k.length} keys; DECK7 says ${DECK7[n]}): the record is frozen, never edit it`); });
    // (and which days' live decks are layout 8's: layout 7's record without the lesson cards GONE8 names)
    const o8 = {};
    DAYS.filter(d => d.cf).forEach(d => { const k = window.cmSlideKeys ? cmSlideKeys.keysOf(d) : []; o[d.cf.n] = !!k.length && DECK7[d.cf.n] === k.length + ':' + h(k.join(' '));
      o8[d.cf.n] = !!k.length && (R.days[d.cf.n] || []).length > 0 && k.join(' ') === __keys8(d).join(' '); });
    return { o, o8, bad }; }, DECK7);
  rec7.bad.forEach(fail);
  const all7 = !rec7.bad.length;   // all7: the records of the older layouts describe the frozen deck
  // deck8: the days whose live deck is layout 8's, the last numbered layout: the tests that open a day stand on those
  const deck8 = rec7.o8;
  const setup = async () => { await page.evaluate(ORACLE); await page.evaluate(() => { state.isAdmin = true; const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }); };
  await setup();

  // 1. every position of every day's deck, in all three older layouts
  // (in layout 7's deck, rebuilt from its frozen record: the moves are into that deck, whatever today's deck is)
  const maps = await page.evaluate(() => {
    const out = [], days = [];
    if (!window.cmSlidePlaces) return { out: ['js/cm-slide-places.js is not loaded'], days };
    for (const d of DAYS) {
      if (!d.cf) continue;
      const F = __deck7(d), now = F.slides, row = { n: d.cf.n, now: now.length, meetN: now.filter(sl => sl.type === 'meetJohnDoe').length };
      row.pages = now.filter(sl => sl.type === 'deckPage').length; row.pageFirst = now.findIndex(sl => sl.type === 'deckPage'); row.pageLast = row.pageFirst + row.pages - 1;
      if (row.pages && now.slice(row.pageFirst, row.pageLast + 1).some(sl => sl.type !== 'deckPage')) out.push(`Day ${d.cf.n}: the revised deck's pages are not together in the deck`);
      for (const layout of [1, 2, 3, 4, 5, 6, 7]) {   // every older layout (OLDER, in the page), into layout 7's deck
        const old = __oldDeck(d, layout), place = cmSlidePlaces.placeMap7(d, layout), reach = cmSlidePlaces.reachMap7(d, layout), L = `Day ${d.cf.n}, layout ${layout}`;
        old.bad.forEach(m => out.push(`${L}: ${m}`));
        row['was' + layout] = old.length; row['moved' + layout] = old.filter((x, i) => x.place !== i).length; row['job' + layout] = old.filter(x => x.view === 'job' && !x.kept).length; row['why' + layout] = old.filter(x => x.view === 'why' && !x.kept).length; row['steps' + layout] = old.filter(x => x.view === 'steps' && !x.kept).length;
        row['gone' + layout] = old.filter(x => x.gone).length; row['sb' + layout] = old.filter(x => x.sb).length;
        if (place.length !== old.length || reach.length !== old.length) { out.push(`${L}: the place map covers ${place.length} positions (the furthest-reached map ${reach.length}), the deck had ${old.length}`); continue; }
        old.forEach((x, i) => {
          const to = place[i], far = reach[i], sl = now[to], fs = now[far], where = `${L} slide ${i + 1} (${x.id} ${x.view || 'slide'})`;
          if (!sl || !fs) return out.push(`${where}: lands on no slide (${to}, furthest ${far})`);
          if (to !== x.place) out.push(`${where}: ${x.kept ? 'that slide is now' : x.view === 'why' ? "its lesson's The Theory is slide" : x.view === 'steps' ? "its lesson's The Rules is slide" : "its lesson's slide before it is"} ${x.place + 1}, the place lands on ${to + 1}`);
          if (far !== x.reach) out.push(`${where}: as the furthest slide reached it should be ${x.reach + 1} (the furthest of the slides seen), it lands on ${far + 1}`);
          if (i && far < reach[i - 1]) out.push(`${where}: its furthest-reached slide lands before that of the slide ahead of it`);
          if (to > far) out.push(`${where}: the place lands further on than the furthest slide reached`);
          if (to > now.length - 1 || far > now.length - 1) out.push(`${where}: lands past the end of the day`);
          if (x.li >= 0 && (sl.type !== 'topic' || sl.lessonIndex !== x.li)) out.push(`${where}: lands outside its block`);
          if (x.li < 0 && x.kept && '~' + sl.type !== x.id) out.push(`${where}: lands on another of the day's own slides (${sl.type})`);
          if (x.kept && sl.type === 'topic' && (F.lessons[sl.lessonIndex].id !== x.id || F.lessons[sl.lessonIndex].views[sl.part - 1] !== x.view)) out.push(`${where}: lands on another slide (${F.lessons[sl.lessonIndex].id} ${F.lessons[sl.lessonIndex].views[sl.part - 1]})`);
          // the whole deck counts as seen only for a trainee who had reached the Ready check, or the old deck's end
          if (far === now.length - 1 && i < old.length - 1 && !old.slice(0, i + 1).some(o => o.id === '~readyCheck')) out.push(`${where}: its furthest-reached slide is the day's last, and the trainee had seen neither the Ready check nor the end`);
          if (!x.kept && !x.deck && !x.gone && x.view === 'why' && F.lessons[x.li].views[sl.part - 1] !== 'theory') out.push(`${where}: a Why It Matters slide that is gone should land on The Theory`);
          if (!x.kept && !x.deck && !x.gone && x.view === 'steps' && F.lessons[x.li].views[sl.part - 1] !== 'rules') out.push(`${where}: a Milestone Steps slide should land on The Rules`);
          // the revised deck's pages are new: no older place opens one, and they count as seen only from a slide past them
          if (layout < 5 && sl.type === 'deckPage') out.push(`${where}: lands on one of the revised deck's pages, which no older deck had`);
          if (layout < 5 && row.pages && fs.type === 'deckPage') out.push(`${where}: its furthest-reached slide is one of the revised deck's pages`);
          // layout 7: a slide that left the deck (Meet Your Case and its two slides) lands on the slide before it; Meet
          // John Doe's slide is new, so no older place opens it or stops on it as the furthest reached. And layout 6's:
          // a Skill Building page of layout 5 lands on the slide before it, its lesson's (or topic's) last page
          if ((x.gone || x.sb) && to !== (i ? place[i - 1] : 0)) out.push(`${where}: left the deck in layout ${x.sb ? 6 : 7}, so it should land on the slide before it (${(i ? place[i - 1] : 0) + 1}); it lands on ${to + 1}`);
          if (layout < 7 && (sl.type === 'meetJohnDoe' || fs.type === 'meetJohnDoe')) out.push(`${where}: lands on Meet John Doe's slide, which no older deck had`);
          if (layout < 5 && row.pages && (far > row.pageLast) !== (far >= row.pageFirst)) out.push(`${where}: its furthest-reached slide is inside the revised deck's pages`);
          // a lesson drawn from the deck now: page ⌊j·n/m⌋ of its own pages, the first slide on the first page, in order
          if (x.deck) { const b = F.lessons[x.li], pages = b.views.filter(v => /^deck[0-9]+$/.test(v)), v = sl.type === 'topic' ? b.views[sl.part - 1] : '';
            if (v !== pages[Math.min(x.n - 1, Math.floor(x.j * x.n / x.m))]) out.push(`${where}: slide ${x.j + 1} of the ${x.m} the lesson had should open deck page ${pages[Math.min(x.n - 1, Math.floor(x.j * x.n / x.m))]} of its ${x.n}; it opens ${v || sl.type}`);
            if (x.j === 0 && to !== x.first) out.push(`${where}: the lesson's first slide should open its first deck page`);
            if (x.j && old[i - 1].deck && old[i - 1].id === x.id && to < place[i - 1]) out.push(`${where}: lands before the slide ahead of it in the same lesson`);
            if (pages.length !== x.n || x.n !== b.views.length) out.push(`${where}: the lesson has ${b.views.length} slides and ${pages.length} deck pages`);
            row.deck = (row.deck || 0) + 1; }
          if (x.kept && (x.view === 'steps' || x.view === 'job')) out.push(`${where}: the deck still has a ${x.view === 'steps' ? 'Milestone Steps' : 'On the Job'} slide`);
        });
        if (reach[reach.length - 1] !== now.length - 1) out.push(`${L}: a trainee who had reached the deck's last slide has not reached today's last`);
        if (place[place.length - 1] !== old[old.length - 1].place) out.push(`${L}: the deck's last slide doesn't land on the same slide`);
      }
      row.deckLessons = F.lessons.filter(b => b.drawn).map(b => ({ id: b.id, n: b.views.length, m: b.drawn.filter(v => !(v === 'theory2' && b.id === 'd1m1-role')).length }));   // d1m1-role's The Theory, Continued is newer than layout 4 (js/cm-slide-places.js THEORY2_NEW)
      const live = buildDaySlides(d).filter(sl => sl.type === 'topic').map(sl => cmCaseFlow.viewsOf(d.lessons[sl.lessonIndex].cf.block)[sl.part - 1]);
      if (live.includes('job')) out.push(`Day ${d.cf.n}: a lesson still has an On the Job slide`);
      if (live.includes('steps')) out.push(`Day ${d.cf.n}: a lesson still has a Milestone Steps slide`);
      days.push(row);
    }
    return { out, days, layout: cmSlidePlaces.LAYOUT };
  });
  maps.out.forEach(fail);
  if (maps.layout !== LAYOUT) fail(`js/cm-slide-places.js is at layout ${maps.layout}; this check describes layout ${LAYOUT}`);
  if (!maps.days.length) fail('no Case Flow day found');
  if (all7) {   // counts over the whole course's records: while every day is still layout 7's deck
  if (maps.days.length && !maps.days.some(x => x.n === 1 && x.gone6 === 7 && x.gone5 === 7 && x.gone1 === 9 && x.meetN === 1)) fail(`Day 1 should have lost Meet Your Case (5 slides in layouts 3 to 6, 7 in layout 1) and its two introduction slides, and gained Meet John Doe's slide: ${JSON.stringify(maps.days.filter(x => x.n === 1).map(x => ({ gone1: x.gone1, gone5: x.gone5, gone6: x.gone6, meet: x.meetN })))}`);
  if (maps.days.length && maps.days.some(x => x.n !== 1 && (x.meetN || x.gone6))) fail('only Day 1 changed in layout 7');
  // layout 6: the 8 Skill Building slides (Day 1's d1m1-l1 2, Day 2's d1m4-tcare 2 and its deck topics' 4), in layout 5's record only
  if (maps.days.length && (maps.days.reduce((a, x) => a + x.sb5, 0) !== 8 || maps.days.some(x => x.sb6 || x.sb4))) fail(`layout 5's record should hold the 8 Skill Building slides that went in layout 6, and no other layout's: ${JSON.stringify(maps.days.map(x => ({ n: x.n, sb4: x.sb4, sb5: x.sb5, sb6: x.sb6 })))}`);
  if (maps.days.length && !maps.days.some(x => x.job1 > 0)) fail('no day lost an On the Job slide: the record is wrong, or the slides are back');
  if (maps.days.length && maps.days.reduce((a, x) => a + x.why2, 0) !== 41) fail(`the record should hold the 41 Why It Matters slides of the lessons with a Theory slide, all gone (each opens The Theory now): ${maps.days.reduce((a, x) => a + x.why2, 0)} are gone`);
  }
  maps.days.forEach(x => { if (!(x.moved3 > 0)) fail(`Day ${x.n}: no position of layout 3 moved: the record of layout 3 is today's order, or the order did not change`);
    if (x.was3 !== x.was4) fail(`Day ${x.n}: layout 3 had ${x.was3} slides and layout 4 ${x.was4}: the reordering should neither add nor remove a slide`);
    // layout 5: only the lessons drawn from the deck changed their number of slides
    const diff = x.deckLessons.reduce((a, l) => a + l.n - l.m, 0);
    if (x.now - x.was4 !== diff + x.pages + x.meetN - x.gone4) fail(`Day ${x.n}: layout 4 had ${x.was4} slides and today's deck has ${x.now}; the lessons drawn from the deck account for ${diff}, the revised deck's pages for ${x.pages}, Meet John Doe's slide for ${x.meetN} and the slides that left in layout 6 for -${x.gone4}`);
    // layout 6: only the Skill Building slides left; layout 7: only Meet Your Case and its two slides left, and Meet John Doe's slide came in
    if (x.now - x.was5 !== x.meetN - x.gone5 - x.sb5) fail(`Day ${x.n}: layout 5 had ${x.was5} slides and today's deck has ${x.now}; Meet John Doe's slide accounts for ${x.meetN}, the slides that left in layout 7 for -${x.gone5} and the Skill Building slides for -${x.sb5}`);
    if (x.now - x.was6 !== x.meetN - x.gone6) fail(`Day ${x.n}: layout 6 had ${x.was6} slides and today's deck has ${x.now}; Meet John Doe's slide accounts for ${x.meetN} and the slides that left for -${x.gone6}`);
    // layout 7 is the frozen deck itself: every position stays where it is
    if (x.now !== x.was7 || x.moved7 || x.gone7 || x.sb7) fail(`Day ${x.n}: layout 7's record has ${x.was7} slides (${x.moved7} moved), its frozen deck ${x.now}: they should be the same deck`);
    if (x.deckLessons.some(l => l.m < 1 || l.n < 1)) fail(`Day ${x.n}: a lesson drawn from the deck has no drawn slides on record, or no deck page: ${JSON.stringify(x.deckLessons)}`);
    if (x.deckLessons.length && !(x.deck > 0)) fail(`Day ${x.n}: no position of an older layout stood in a lesson drawn from the deck`); });
  if (all7 && maps.days.length && !maps.days.some(x => x.deckLessons.length)) fail('no lesson is drawn from the deck (window.CM_DECK_SLIDES): layout 5 describes nothing');
  // layout 5 → 6: today's deck, with the Skill Building pages two Day 1 lessons ended on and the one after each of Day 2's
  // deck topics; a place on one lands on the lesson's (or topic's) last page now, every other on the same slide, and the furthest reached is the furthest seen.
  // (Merged with layout 7, a place saved in layout 5 also crosses Meet Your Case leaving Day 1: so layout 5's deck here
  // also has GONE7's rows back after the Training Agenda, each landing on it, and not Meet John Doe's slide, which no
  // layout before 7 had. Every Day 1 index after the Training Agenda shifts by those 7 slides; nothing else changes.)
  const six = await page.evaluate(([GONE6, GONE6_DECK, GONE7]) => {
    const out = [], counts = {};
    for (const d of DAYS) {
      if (!d.cf) continue;
      const F = __deck7(d), now = F.slides, old = [];   // layout 7's deck, from its frozen record
      const g7 = GONE7[d.cf.n], g7n = g7 ? g7.rows.reduce((a, r) => a + (r[0] === '~' ? 1 : r.split(' ').length - 1), 0) : 0;
      now.forEach((sl, k) => { if (sl.type === 'meetJohnDoe') return; old.push({ place: k, gone: false });
        if (g7 && '~' + sl.type === g7.after) for (let g = 0; g < g7n; g++) old.push({ place: k, gone: true, id: 'd1m1-case' });
        const b = sl.type === 'topic' ? F.lessons[sl.lessonIndex] : null, nx = now[k + 1];
        if (b && GONE6[b.id] && !(nx && nx.type === 'topic' && nx.lessonIndex === sl.lessonIndex)) for (let g = 0; g < GONE6[b.id]; g++) old.push({ place: k, gone: true, id: b.id });
        if (sl.type === 'deckPage' && GONE6_DECK[sl.deck] && !(nx && nx.type === 'deckPage' && nx.deck === sl.deck)) for (let g = 0; g < GONE6_DECK[sl.deck]; g++) old.push({ place: k, gone: true, id: sl.deck }); });
      let far = 0; old.forEach(x => { far = Math.max(far, x.place); x.reach = far; });
      const place = cmSlidePlaces.placeMap7(d, 5), reach = cmSlidePlaces.reachMap7(d, 5);
      counts[d.cf.n] = old.length - now.length - g7n + now.filter(sl => sl.type === 'meetJohnDoe').length;   // the Skill Building slides alone
      if (place.length !== old.length) { out.push(`Day ${d.cf.n}, layout 5: the place map covers ${place.length} positions, the deck had ${old.length}`); continue; }
      old.forEach((x, i) => { if (place[i] !== x.place) out.push(`Day ${d.cf.n}, layout 5 slide ${i + 1}${x.gone ? ` (a Skill Building slide of ${x.id})` : ''}: should land on ${x.place + 1}, lands on ${place[i] + 1}`);
        if (reach[i] !== x.reach) out.push(`Day ${d.cf.n}, layout 5 slide ${i + 1}: the furthest reached should be ${x.reach + 1}, is ${reach[i] + 1}`); });
    }
    return { out, counts };
  }, [GONE6, GONE6_DECK, GONE7]);
  six.out.forEach(fail);
  if (all7 && Object.values(six.counts).reduce((a, n) => a + n, 0) !== 8) fail(`layout 5 had the Day 1 deck's 4 Skill Building pages (d1m4-tcare is taught on Day 2) and Day 2's 4 Skill Building slides; the record finds ${JSON.stringify(six.counts)} slides gone`);
  if (all7 && maps.days.length && maps.days.reduce((a, x) => a + x.steps2, 0) !== 26) fail(`the record should hold the 26 Milestone Steps slides of the live deck, all gone: it holds ${maps.days.reduce((a, x) => a + x.steps2, 0)} that are gone`);

  // layout 7 → 8: the lesson cards the decks replaced (GONE8) are on Days 1, 2 and 3 only, layout 8's deck is layout 7's
  // without their slides and nothing else, and every older layout's place map is its map into layout 7's deck taken on
  // by key (a lesson card's slide on the slide before it, every other slide on itself)
  const eight = await page.evaluate((OLDER) => {
    const out = [], days = {};
    for (const d of DAYS.filter(x => x.cf)) {
      const k7 = __k7(d), k8 = __keys8(d), P = cmSlidePlaces;
      if (!k7.length) continue;
      days[d.cf.n] = k7.length - k8.length;
      if (typeof P.to8 !== 'function' || typeof P.keys8 !== 'function') { out.push('js/cm-slide-places.js has no to8/keys8 (layout 8)'); break; }
      if (P.keys8(d).join(' ') !== k8.join(' ')) out.push(`Day ${d.cf.n}: layout 8's deck (cmSlidePlaces.keys8) is not layout 7's without the lesson cards GONE8 names`);
      k7.forEach((key, j) => { const to = P.to8(d, j), want = __to8(d, j), gone = !!__GONE8[key.replace(/#[0-9]+$/, '').split(':')[0]];
        if (to !== want) out.push(`Day ${d.cf.n}, layout 7 slide ${j + 1} (${key}): should be slide ${want + 1} of layout 8's deck, is ${to + 1}`);
        else if (!gone && k8[to] !== key) out.push(`Day ${d.cf.n}, layout 7 slide ${j + 1} (${key}): lands on another slide of layout 8's deck (${k8[to]})`);
        else if (gone && j && to !== __to8(d, j - 1)) out.push(`Day ${d.cf.n}, layout 7 slide ${j + 1} (${key}), a lesson card that left: should land on the slide before it`); });
      for (const layout of OLDER) { const p7 = P.placeMap7(d, layout), r7 = P.reachMap7(d, layout), p = P.placeMap(d, layout), r = P.reachMap(d, layout);
        if (p.some((x, i) => x !== __to8(d, p7[i])) || r.some((x, i) => x !== __to8(d, r7[i]))) out.push(`Day ${d.cf.n}, layout ${layout}: the place map is not its map into layout 7's deck taken on into layout 8's`); }
    }
    Object.keys(__GONE8).forEach(id => { if (!Object.keys(days).some(n => __k7(DAYS.find(x => x.cf && x.cf.n === +n)).some(k => k.split(':')[0] === id))) out.push(`${id} (GONE8) is in no day of layout 7's deck`); });
    return { out, days };
  }, OLDER);
  eight.out.forEach(fail);
  if (all7 && Object.keys(eight.days).filter(n => eight.days[n] > 0).join() !== '1,2,3') fail(`layout 8 should take lessons out of Days 1, 2 and 3 only: ${JSON.stringify(eight.days)}`);

  // 2. slide 40 of Day 1, saved in layout 1 (no layout on it): opened, reloaded, opened again
  const put = (at, layout, n) => page.evaluate(async ({ at, layout, n }) => {
    const d = DAYS.find(x => x.cf && x.cf.n === (n || 1)), old = __oldDeck(d, layout || 1, true);
    const i = typeof at === 'string' && / /.test(at) ? old.findIndex(x => x.id + ' ' + x.view === at) : at === 'last' ? old.length - 1 : at === 'far' ? 9999 : at === 'why' ? old.findIndex(x => x.view === 'why' && !x.kept && !x.deck && !__GONE8[x.id] && x.place !== x.reach) : at === 'steps' ? old.findIndex(x => x.view === 'steps' && !x.kept && !x.deck && !__GONE8[x.id] && x.place !== x.reach) : at;   // (not in a lesson card that left in layout 8)
    // in storage as the old code left them: positions in the old deck, with the layout that code stamped (the first stamped none)
    const saved = o => JSON.stringify(layout > 1 ? Object.assign(o, { cfLayout: layout }) : o);
    localStorage.setItem('lsh_last-slide', saved({ [d.id]: i })); localStorage.setItem('lsh_slide-progress', saved({ [d.id]: i }));
    if (!window.__noLoad) { await loadAll(); state.isAdmin = true; }   // the page reads its saved progress, as at start-up and at sign-in
    const o = old[Math.min(i, old.length - 1)];
    return { dayId: d.id, i, was: `${o.id} ${o.view}`, li: o.li, want: o.place, far: o.reach, total: buildDaySlides(d).length, oldTotal: old.length };
  }, { at, layout, n });
  const open = (dayId) => page.evaluate((dayId) => {
    goto('day', dayId); state.dayViewMode = 'slides'; render();
    const d = DAYS.find(x => x.id === dayId), sl = buildDaySlides(d)[state.lessonSlide], b = sl && sl.type === 'topic' ? d.lessons[sl.lessonIndex].cf.block : null;
    return { at: state.lessonSlide, li: sl && sl.lessonIndex != null ? sl.lessonIndex : -1, is: b ? `${b.id} ${cmCaseFlow.viewsOf(b)[sl.part - 1]}` : sl ? sl.type : 'nothing',
      last: state.lastSlide[dayId], far: state.slideProgress[dayId], stamped: [state.lastSlide.cfLayout, state.slideProgress.cfLayout], drawn: !!document.getElementById('lessonSlideWrap'),
      why: !!document.querySelector('#lessonSlideWrap .cfx-whyline'),
      stored: ['last-slide', 'slide-progress'].map(k => { const o = JSON.parse(localStorage.getItem('lsh_' + k) || '{}'); return `${o[dayId]}/${o.cfLayout}`; }).join(' ') };
  }, dayId);
  // (the tests of the older layouts that stand on one day's slides run while that day's live deck is layout 8's, deck8)
  let s40 = null, meet6 = null, lab3 = null, inLab = null, w2 = null, why2 = null, st2 = null, steps2 = null;
  if (deck8[1]) {
    s40 = await put(39); const got = await open(s40.dayId);
    if (!got.drawn) fail('Day 1 did not open on a slide');
    if (got.at !== s40.want || got.li !== s40.li) fail(`a trainee on slide 40 of Day 1 (${s40.was}) should land on slide ${s40.want + 1} of the same lesson; landed on ${got.at + 1} (${got.is})`);
    if (got.last !== s40.want || got.far !== s40.far) fail(`the saved places should be ${s40.want} (last-slide) and ${s40.far} (slide-progress) after the move: last-slide ${got.last}, slide-progress ${got.far}`);
    if (got.stamped[0] !== LAYOUT || got.stamped[1] !== LAYOUT) fail(`the moved places should carry the layout they are now in (cfLayout ${LAYOUT}): ${got.stamped}`);
    if (got.stored !== `${s40.want}/${LAYOUT} ${s40.far}/${LAYOUT}`) fail(`the moved places should be saved again, with their layout (${s40.want}/${LAYOUT} ${s40.far}/${LAYOUT}): ${got.stored}`);
    await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
    const again = await open(s40.dayId);
    if (again.at !== s40.want || again.far !== s40.far) fail(`reading the saved progress a second time moved the place again: slide ${again.at + 1}, furthest ${again.far + 1}, was ${s40.want + 1} and ${s40.far + 1}`);
    // a real reload, the place in storage as the old code left it
    await page.evaluate(() => { window.__noLoad = true; }); await put(39);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.waitForFunction(() => typeof state !== 'undefined' && !!state.traineeId && !!window.cmSlidePlaces, null, { timeout: 15000 }).catch(() => fail('the trainee was not signed in after the reload'));
    await setup();
    const re = await open(s40.dayId);
    if (re.at !== s40.want || re.li !== s40.li) fail(`after a reload, slide 40 of Day 1 (${s40.was}) should open on slide ${s40.want + 1}; opened on ${re.at + 1} (${re.is})`);
    if (re.stamped[0] !== LAYOUT || re.stamped[1] !== LAYOUT) fail(`after a reload the places should carry cfLayout ${LAYOUT}: ${re.stamped}`);
  }
  // a place this page makes itself is in today's deck already: never moved, and saved with its layout on it
  const own = await page.evaluate(async () => {
    const d = DAYS.find(x => x.cf && x.cf.n === 1), last = buildDaySlides(d).length - 1;
    state.lastSlide = { [d.id]: last }; state.slideProgress = { [d.id]: last };
    goto('dashboard'); render(); goto('day', d.id); state.dayViewMode = 'slides'; render();
    const at = state.lessonSlide, far = state.slideProgress[d.id];
    await storeSet('slide-progress', state.slideProgress);
    const o = JSON.parse(localStorage.getItem('lsh_slide-progress') || '{}');
    await loadAll(); state.isAdmin = true;
    return { last, at, far, stored: `${o[d.id]}/${o.cfLayout}`, reread: state.slideProgress[d.id] };
  });
  if (own.at !== own.last || own.far !== own.last) fail(`a place made on this page (the last slide, ${own.last + 1}) was moved: slide ${own.at + 1}, furthest ${own.far + 1}`);
  if (own.stored !== `${own.last}/${LAYOUT}` || own.reread !== own.last) fail(`a place saved by this page should carry its layout and read back unmoved (${own.last}/${LAYOUT}): saved ${own.stored}, read back ${own.reread}`);
  if (deck8[1]) {
    // never past the end, from any older layout: the old deck's last slide (Day 1's was the last activity's Check Your
    // Work; the Ready check is last now) opens on that same slide, with the whole deck reached
    for (const layout of OLDER) for (const at of ['last', 'far']) {
      const p = await put(at, layout), g = await open(p.dayId);
      if (g.at !== p.want || g.far !== p.total - 1 || g.at > p.total - 1) fail(`a place at ${at === 'last' ? "the deck's last slide" : 'slide 10000'} (${p.was}), saved in layout ${layout}, should open that slide (${p.want + 1}) with the whole deck reached (${p.total}): slide ${g.at + 1}, furthest ${g.far + 1}`);
    }
    // layout 7: a place saved in layout 5 or 6 (both still had it) on Meet Your Case (gone from the deck) opens the
    // Training Agenda, the slide before it, with nothing further unlocked; one saved on the Practice Lab opens the
    // Practice Lab, with Meet John Doe's slide (new, just before it) counted as seen. (Layout 5 is main's deck before its
    // layout 6 took the Skill Building pages out; a place saved in it crosses both changes.)
    for (const from of [5, 6]) {
      const pc = await put('d1m1-case rules', from), gc = await open(pc.dayId);
      if (pc.i < 0) fail(`layout ${from} of Day 1 has no Meet Your Case The Rules slide (the check wants one to stand on)`);
      else {
        if (gc.at !== 0 || gc.is !== 'taskOverview' || gc.far !== 0) fail(`a trainee on ${pc.was} (layout ${from} slide ${pc.i + 1}), which left the deck, should open the Training Agenda (slide 1) with nothing further reached; opened ${gc.at + 1} (${gc.is}), furthest ${gc.far + 1}`);
        if (gc.stored !== `0/${LAYOUT} 0/${LAYOUT}`) fail(`the places moved off Meet Your Case should be saved with cfLayout ${LAYOUT}: ${gc.stored}`);
      }
      const lab5 = await page.evaluate((from) => { const d = DAYS.find(x => x.cf && x.cf.n === 1), old = __oldDeck(d, from), now = buildDaySlides(d);
        return { i: old.findIndex(x => x.id === '~practiceLab'), lab: now.findIndex(sl => sl.type === 'practiceLab'), meet: now.findIndex(sl => sl.type === 'meetJohnDoe') }; }, from);
      if (lab5.i < 0 || lab5.meet < 0 || lab5.meet !== lab5.lab - 1) fail(`Day 1: Meet John Doe's slide should sit right before the Practice Lab (Meet John Doe ${lab5.meet + 1}, Practice Lab ${lab5.lab + 1})`);
      else {
        const pl = await put(lab5.i, from), gl = await open(pl.dayId);
        if (lab5.i === lab5.lab) fail(`the Practice Lab sits where it sat in layout ${from}: the check proves nothing about layout 7`);
        if (gl.at !== lab5.lab || gl.is !== 'practiceLab') fail(`a trainee on the Practice Lab in layout ${from} (slide ${lab5.i + 1}) should open it, now slide ${lab5.lab + 1}; opened ${gl.at + 1} (${gl.is})`);
        if (!(gl.far >= lab5.lab)) fail(`for a trainee on the Practice Lab, Meet John Doe's slide before it counts as seen: furthest ${gl.far + 1}, Meet John Doe is ${lab5.meet + 1}`);
        if (from === 5) meet6 = { from: lab5.i + 1, to: gl.at + 1, caseTo: gc.at + 1 };
      }
    }
  }
  // layout 8: a place saved in layout 7 on a lesson the decks replaced (Day 1's UPL Line, after Case Management
  // Fundamentals) opens the slide before it, Fundamentals' last page, with nothing further reached
  if (deck8[1]) { const pu = await put('d1m1-upl rules', 7), gu = await open(pu.dayId);
    const before = await page.evaluate(() => { const d = DAYS.find(x => x.cf && x.cf.n === 1), now = buildDaySlides(d), li = d.lessons.findIndex(l => l.cf && l.cf.block.id === 'd1m1-role');
      return now.map((sl, k) => sl.type === 'topic' && sl.lessonIndex === li ? k : -1).filter(k => k >= 0).pop(); });
    if (pu.i < 0) fail("layout 7 of Day 1 has no UPL Line The Rules slide (the check wants one to stand on)");
    else if (gu.at !== before || !/^d1m1-role /.test(gu.is) || gu.far !== before) fail(`a trainee on ${pu.was} (layout 7 slide ${pu.i + 1}), a lesson the decks replaced, should open Case Management Fundamentals' last page (slide ${before + 1}) with nothing further reached; opened ${gu.at + 1} (${gu.is}), furthest ${gu.far + 1}`);
    else if (gu.stored !== `${before}/${LAYOUT} ${before}/${LAYOUT}`) fail(`the places moved off the UPL Line should be saved with cfLayout ${LAYOUT}: ${gu.stored}`); }
  // a place saved in layout 3 (the deck before the lessons were put together) in the Practice Lab: Day 2, the first
  // activity's AI Grader slide (once Check Your Work), which sat after five lessons and now sits after all twenty
  if (deck8[2]) {
    lab3 = await put('d1m1-a1 check', 3, 2);
    if (lab3.i < 0) fail('Day 2 of layout 3 has no d1m1-a1 AI Grader slide (the check wants one to stand on)');
    else {
      inLab = await open(lab3.dayId);
      if (lab3.want === lab3.i) fail(`Day 2's d1m1-a1 AI Grader slide sits where it sat in layout 3 (slide ${lab3.i + 1}): the check proves nothing about the reordering`);
      if (inLab.at !== lab3.want || inLab.is !== 'd1m1-a1 check') fail(`a trainee on ${lab3.was} (layout 3 slide ${lab3.i + 1} of Day 2) should open that same slide, now slide ${lab3.want + 1}; opened ${inLab.at + 1} (${inLab.is})`);
      if (inLab.far !== lab3.far || inLab.far < inLab.at) fail(`the furthest slide reached, saved on ${lab3.was} in layout 3, should be slide ${lab3.far + 1}; it is ${inLab.far + 1}`);
      if (inLab.stored !== `${lab3.want}/${LAYOUT} ${lab3.far}/${LAYOUT}`) fail(`the places moved from layout 3 should be saved with cfLayout ${LAYOUT} (${lab3.want}/${LAYOUT} ${lab3.far}/${LAYOUT}): ${inLab.stored}`);
      await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
      const twice = await open(lab3.dayId);
      if (twice.at !== lab3.want || twice.far !== lab3.far) fail(`a place moved from layout 3 was moved again when read a second time: slide ${twice.at + 1}, furthest ${twice.far + 1}`);
    }
    // a place saved inside a lesson that is drawn from the deck now (layout 5), in the old order (3) and in today's (4):
    // it opens that lesson's deck page ⌊j·n/m⌋, moved once
  }
  let inDeck = null;
  for (const layout of [3, 4]) {
    const pick = await page.evaluate(([layout, deck8]) => { for (const d of DAYS.filter(x => x.cf && deck8[x.cf.n])) { const old = __oldDeck(d, layout, true), x = old.filter(o => o.deck && o.j === o.m - 1 && o.m > 1)[0]; if (x) return { n: d.cf.n, at: x.id + ' ' + x.view, j: x.j, m: x.m, pages: x.n, first: x.first }; } return null; }, [layout, deck8]);
    if (!pick && !all7) continue;
    if (!pick) { fail(`no lesson drawn from the deck had more than one slide in layout ${layout} (the check wants one to stand on)`); continue; }
    const p = await put(pick.at, layout, pick.n), g = await open(p.dayId), want = pick.first + Math.min(pick.pages - 1, Math.floor(pick.j * pick.pages / pick.m));
    if (p.want !== want) fail(`the record puts ${p.was} (layout ${layout}) on slide ${p.want + 1}; page ⌊j·n/m⌋ of its lesson is slide ${want + 1}`);
    if (g.at !== want || g.li !== p.li || !new RegExp('^' + pick.at.split(' ')[0] + ' deck\\d+$').test(g.is)) fail(`a trainee on ${p.was} (slide ${pick.j + 1} of ${pick.m}, layout ${layout}) should open deck page ${Math.min(pick.pages - 1, Math.floor(pick.j * pick.pages / pick.m)) + 1} of that lesson's ${pick.pages} (slide ${want + 1}); opened ${g.at + 1} (${g.is})`);
    if (g.far !== p.far || g.far < g.at) fail(`the furthest slide reached, saved on ${p.was} in layout ${layout}, should be slide ${p.far + 1}; it is ${g.far + 1}`);
    if (g.stored !== `${p.want}/${LAYOUT} ${p.far}/${LAYOUT}`) fail(`the places moved into a deck lesson from layout ${layout} should be saved with cfLayout ${LAYOUT} (${p.want}/${LAYOUT} ${p.far}/${LAYOUT}): ${g.stored}`);
    await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
    const twice = await open(p.dayId);
    if (twice.at !== p.want || twice.far !== p.far) fail(`a place moved into a deck lesson from layout ${layout} was moved again when read a second time: slide ${twice.at + 1}, furthest ${twice.far + 1}`);
    inDeck = { was: p.was, layout, to: g.is, slide: want + 1 };
  }
  // the revised deck's pages (js/cm-deck-pages.js): a place saved in layout 4 on the slide after them (the Practice
  // Lab) opens that slide, further on by their number, with the pages counted as seen; one saved on the slide before
  // them stays put, and the pages are still ahead of the trainee
  let overPages = null;
  const pg = await page.evaluate((deck8) => { for (const d of DAYS.filter(x => x.cf && deck8[x.cf.n])) { const now = buildDaySlides(d), a = now.findIndex(sl => sl.type === 'deckPage'); if (a > 0) { const n = now.filter(sl => sl.type === 'deckPage').length, old = __oldDeck(d, 4, true);
    return { n: d.cf.n, first: a, pages: n, after: old.findIndex(o => o.place === a + n), before: old.map(o => o.place).lastIndexOf(a - 1), afterIs: now[a + n] ? now[a + n].type : 'the end' }; } } return null; }, deck8);
  if (!pg && all7) fail("no day has the revised deck's pages (js/cm-deck-pages.js): layout 5 describes none");
  else if (!pg) { /* the day with the revised deck's pages is no longer layout 7's deck */ }
  else if (pg.after < 0 || pg.before < 0) fail(`Day ${pg.n}: layout 4 has no slide just before or just after the revised deck's pages (the check wants both to stand on)`);
  else {
    const pa = await put(pg.after, 4, pg.n), ga = await open(pa.dayId);
    if (ga.at !== pg.first + pg.pages || ga.at !== pa.want) fail(`a trainee on the slide after Day ${pg.n}'s lessons in layout 4 (${pa.was}, slide ${pg.after + 1}) should open that same slide, now slide ${pg.first + pg.pages + 1} (past the ${pg.pages} deck pages); opened ${ga.at + 1} (${ga.is})`);
    if (ga.far !== pa.far || ga.far < pg.first + pg.pages) fail(`for a trainee past the revised deck's pages they count as seen: the furthest slide reached should be ${pa.far + 1}; it is ${ga.far + 1}`);
    if (ga.stored !== `${pa.want}/${LAYOUT} ${pa.far}/${LAYOUT}`) fail(`a place moved past the revised deck's pages should be saved with cfLayout ${LAYOUT}: ${ga.stored}`);
    await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
    const twice = await open(pa.dayId);
    if (twice.at !== pa.want || twice.far !== pa.far) fail(`a place moved past the revised deck's pages was moved again when read a second time: slide ${twice.at + 1}, furthest ${twice.far + 1}`);
    const pb = await put(pg.before, 4, pg.n), gb = await open(pb.dayId);
    if (gb.at !== pg.first - 1 || gb.far !== pg.first - 1) fail(`a trainee on the last slide before the revised deck's pages in layout 4 (${pb.was}) should stay on it (slide ${pg.first}) with the pages still ahead; opened ${gb.at + 1}, furthest ${gb.far + 1}`);
    overPages = { n: pg.n, pages: pg.pages, was: pa.was || pg.afterIs, from: pg.after + 1, to: ga.at + 1 };
  }
  if (deck8[1]) {
    // a place saved in layout 2 (this deck, before Why It Matters opened The Theory) on a Why It Matters slide that is gone
    w2 = await put('why', 2);
    if (w2.i < 0) fail('Day 1 has no lesson whose Why It Matters slide is gone and sat after a second theory slide (the check wants one to stand on)');
    else {
      why2 = await open(w2.dayId);
      if (why2.at !== w2.want || !/ theory$/.test(why2.is) || why2.li !== w2.li) fail(`a trainee on a Why It Matters slide that is gone (${w2.was}, layout 2 slide ${w2.i + 1}) should open that lesson's The Theory (slide ${w2.want + 1}); opened ${why2.at + 1} (${why2.is})`);
      if (!why2.why) fail(`The Theory that a Why It Matters place lands on (${why2.is}) should open with its 💡 Why it matters line`);
      if (why2.far !== w2.far) fail(`the furthest slide reached, saved on that Why It Matters slide, should be slide ${w2.far + 1} (the one passed to get there); it is ${why2.far + 1}`);
      if (why2.stored !== `${w2.want}/${LAYOUT} ${w2.far}/${LAYOUT}`) fail(`the places moved from layout 2 should be saved with cfLayout ${LAYOUT} (${w2.want}/${LAYOUT} ${w2.far}/${LAYOUT}): ${why2.stored}`);
      await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
      const twice = await open(w2.dayId);
      if (twice.at !== w2.want || twice.far !== w2.far) fail(`a place moved from layout 2 was moved again when read a second time: slide ${twice.at + 1}, furthest ${twice.far + 1}`);
    }

    // a place saved in layout 2 on a Milestone Steps slide (all gone): The Rules of that lesson, where its steps are now spoken
    st2 = await put('steps', 2);
    if (st2.i < 0) fail('Day 1 has no lesson whose Milestone Steps slide sat after a See It slide (the check wants one to stand on)');
    else {
      steps2 = await open(st2.dayId);
      if (steps2.at !== st2.want || !/ rules$/.test(steps2.is) || steps2.li !== st2.li) fail(`a trainee on a Milestone Steps slide (${st2.was}, layout 2 slide ${st2.i + 1}) should open that lesson's The Rules (slide ${st2.want + 1}); opened ${steps2.at + 1} (${steps2.is})`);
      if (steps2.far !== st2.far) fail(`the furthest slide reached, saved on that Milestone Steps slide, should be slide ${st2.far + 1} (the one before it); it is ${steps2.far + 1}`);
      if (steps2.stored !== `${st2.want}/${LAYOUT} ${st2.far}/${LAYOUT}`) fail(`the places moved from a Milestone Steps slide should be saved with cfLayout ${LAYOUT} (${st2.want}/${LAYOUT} ${st2.far}/${LAYOUT}): ${steps2.stored}`);
      await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
      const twice = await open(st2.dayId);
      if (twice.at !== st2.want || twice.far !== st2.far) fail(`a place moved from a Milestone Steps slide was moved again when read a second time: slide ${twice.at + 1}, furthest ${twice.far + 1}`);
    }
  }

  // 3. the reload after an update: the slide it kept
  if (deck8[1]) {
    const resume = async (layout) => page.evaluate(async ({ layout, LAYOUT }) => {
      const d = DAYS.find(x => x.cf && x.cf.n === 1), old = __oldDeck(d, layout || 1, true), o = old[39], want = layout >= LAYOUT ? 39 : o.place;
      state.lastSlide = { [d.id]: 0, cfLayout: LAYOUT }; state.slideProgress = { [d.id]: old.length, cfLayout: LAYOUT };
      goto('dashboard');
      sessionStorage.setItem('lsh_resume_after_update', JSON.stringify({ view: 'day', dayId: d.id, lessonSlide: 39 }));
      if (layout) sessionStorage.setItem('lsh_resume_layout', String(layout)); else sessionStorage.removeItem('lsh_resume_layout');
      restoreAfterUpdate(); await new Promise(r => setTimeout(r, 450));
      return { at: state.lessonSlide, want, view: state.view, left: sessionStorage.getItem('lsh_resume_layout') };
    }, { layout, LAYOUT });
    const fromOld = await resume(0);
    if (fromOld.view !== 'day' || fromOld.at !== fromOld.want) fail(`an update from the first deck on slide 40 should reopen slide ${fromOld.want + 1}: reopened ${fromOld.at + 1} (${fromOld.view})`);
    const from2 = await resume(2);
    if (from2.view !== 'day' || from2.at !== from2.want) fail(`an update from layout 2 on slide 40 should reopen slide ${from2.want + 1}: reopened ${from2.at + 1} (${from2.view})`);
    if (fromOld.want === 39 && from2.want === 39) fail('slide 40 of Day 1 sits where it sat in both older decks: the check proves nothing about the update (pick another slide)');
    const from3 = await resume(3);
    if (from3.view !== 'day' || from3.at !== from3.want) fail(`an update from layout 3 on slide 40 should reopen slide ${from3.want + 1}: reopened ${from3.at + 1} (${from3.view})`);
    if (from3.want === 39) fail('slide 40 of Day 1 sits where it sat in layout 3: the check proves nothing about an update across the reordering (pick another slide)');
    const from4 = await resume(4);
    if (from4.view !== 'day' || from4.at !== from4.want) fail(`an update from layout 4 on slide 40 should reopen slide ${from4.want + 1}: reopened ${from4.at + 1} (${from4.view})`);
    if (from4.want === 39) fail('slide 40 of Day 1 sits where it sat in layout 4: the check proves nothing about an update across the deck pages (pick another slide)');
    const from5 = await resume(5);
    if (from5.view !== 'day' || from5.at !== from5.want) fail(`an update from layout 5 on slide 40 should reopen slide ${from5.want + 1}: reopened ${from5.at + 1} (${from5.view})`);
    if (from5.want === 39) fail('slide 40 of Day 1 sits where it sat in layout 5: the check proves nothing about an update across Meet Your Case leaving the deck (pick another slide)');
    const from6 = await resume(6);
    if (from6.view !== 'day' || from6.at !== from6.want) fail(`an update from layout 6 on slide 40 should reopen slide ${from6.want + 1}: reopened ${from6.at + 1} (${from6.view})`);
    if (from6.want === 39) fail('slide 40 of Day 1 sits where it sat in layout 6: the check proves nothing about an update across Meet Your Case leaving the deck (pick another slide)');
    const from7 = await resume(7);
    if (from7.view !== 'day' || from7.at !== from7.want) fail(`an update from layout 7 on slide 40 should reopen slide ${from7.want + 1}: reopened ${from7.at + 1} (${from7.view})`);
    const fromNew = await resume(LAYOUT);
    if (fromNew.at !== 39) fail(`an update between two versions of today's deck should reopen the same slide (40): reopened ${fromNew.at + 1}`);
    if (fromNew.left !== null) fail('the layout the update saved its slide in should be cleared once read');
  }

  // 4. copy left over from the old deck draws nothing and breaks nothing
  const stale = await page.evaluate(async () => {
    const d = DAYS.find(x => x.cf && x.cf.n === 1), li = d.lessons.findIndex(l => l.cf.block.kind === 'lesson' && (l.cf.block.ops || []).length), b = d.lessons[li].cf.block;
    const copy = window.CM_CF_SLIDES[b.id] = window.CM_CF_SLIDES[b.id] || {}, had = copy.milestones, n0 = cmCaseFlow.viewsOf(b).length;
    copy.job = [['Trigger', 'Task', 'Tool', 'Checkpoint']];
    if (!had) copy.milestones = { slide: true, title: 'Left over', steps: [1, 2, 3].map(k => ({ label: 'Step ' + k, done: 'left over' })) }; else copy.milestones = Object.assign({}, had, { slide: true });
    (window.CM_CF_SCRIPTS[b.id] = window.CM_CF_SCRIPTS[b.id] || {}).job = { say: 'left over' }; window.CM_CF_SCRIPTS[b.id].steps = { say: 'left over' };
    goto('day', d.id); state.dayViewMode = 'slides'; const out = [];
    if (cmCaseFlow.viewsOf(b).length !== n0 || cmCaseFlow.viewsOf(b).includes('steps')) out.push(`${b.id}: a left-over "slide": true on its Milestone rail gives it a slide again`);
    buildDaySlides(d).forEach((sl, k) => { if (sl.type !== 'topic' || sl.lessonIndex !== li) return;
      state.lessonSlide = k; render();
      const w = document.getElementById('lessonSlideWrap');
      if (!w || !w.querySelector('.cfx-sheet, .cfx-body')) out.push(`${b.id} slide ${k + 1}: nothing drawn`);
      else if (w.querySelector('.cfx-flow, .cfx-step') || /Trigger\s*(➔|→)\s*Task/i.test(w.textContent)) out.push(`${b.id} slide ${k + 1}: draws a Trigger ➔ Task ➔ Tool ➔ Checkpoint row`);
      else if (w.querySelector('.cfx-ms-own')) out.push(`${b.id} slide ${k + 1}: draws a Milestone Steps slide`); });
    delete copy.job; if (had) copy.milestones = had; else delete copy.milestones; delete window.CM_CF_SCRIPTS[b.id].job; delete window.CM_CF_SCRIPTS[b.id].steps;
    return out;
  });
  stale.forEach(fail);

  // 5. places saved by slide key (js/cm-slide-keys.js): a deck change needs no layout. A place is saved on today's deck;
  // then the deck changes in the page (a slide put in before it, the slide itself taken out, the blocks reordered) and
  // the saved progress is read again, as at start-up and sign-in: the place and the furthest slide reached follow their
  // slides by key. Nothing here names a slide or counts a deck: it holds for whatever deck a later branch makes.
  const keyed = await page.evaluate(async () => {
    const out = [], log = [];
    if (!window.cmSlideKeys) return { out: ['js/cm-slide-keys.js is not loaded'], log };
    const K = cmSlideKeys, base = buildDaySlides, stored = k => JSON.parse(localStorage.getItem('lsh_' + k) || 'null');
    // a lesson of two slides or more right after another block's slide, a few slides into its day
    let d = null, a = -1;
    for (const x of DAYS.filter(x => x.cf)) {
      const sl = buildDaySlides(x), k = sl.findIndex((s, i) => i > 3 && s.type === 'topic' && s.part === 1 && sl[i + 1] && sl[i + 1].type === 'topic' && sl[i + 1].lessonIndex === s.lessonIndex && sl[i - 1].type === 'topic' && sl[i - 1].lessonIndex !== s.lessonIndex);
      if (k > 0) { d = x; a = k; break; }
    }
    if (!d) return { out: ['no Case Flow day has a lesson of two slides right after another block (the check wants one to stand on)'], log };
    const keys0 = K.keysOf(d), placeKey = keys0[a], farKey = keys0[a + 1], beforeKey = keys0[a - 1];
    DAYS.filter(x => x.cf).forEach(x => { const k = K.keysOf(x); if (new Set(k).size !== k.length) out.push(`Day ${x.cf.n}: two slides have the same key`); });
    if (!PERSONAL_KEYS.includes('slide-keys')) out.push('"slide-keys" is not a personal progress key (registerPersonalKeys): it would not reach the account');
    // the place, saved as the page saves it
    state.lastSlide = Object.assign(state.lastSlide || {}, { [d.id]: a }); state.slideProgress = Object.assign(state.slideProgress || {}, { [d.id]: a + 1 });
    await storeSet('slide-progress', state.slideProgress); await storeSet('last-slide', state.lastSlide);
    const rec = (stored('slide-keys') || {})[d.id];
    if (!rec || !rec.last || rec.last.k[0] !== placeKey || rec.last.i !== a || !rec.far || rec.far.k[0] !== farKey || rec.far.i !== a + 1) out.push(`saving a place should save its slide's key with it ("slide-keys"): ${JSON.stringify(rec)}`);
    else if (rec.last.k[1] !== beforeKey) out.push(`the keys saved with a place should go on with the slides before it (${beforeKey} first): ${JSON.stringify(rec.last.k)}`);
    // the progress read again on a changed deck: where the place and the furthest slide reached should be
    const read = async (what, deck, want) => {
      buildDaySlides = deck;
      try {
        await loadAll(); state.isAdmin = true;
        const now = K.keysOf(d), w = want(now), last = state.lastSlide[d.id], far = state.slideProgress[d.id], o = stored('last-slide') || {}, r = (stored('slide-keys') || {})[d.id] || {};
        log.push(`${what}: ${last + 1}/${far + 1}`);
        if (w.last < 0 || w.far < 0) out.push(`${what}: the check found no slide to expect (${JSON.stringify(w)})`);
        if (last !== w.last) out.push(`${what}: the place should be on slide ${w.last + 1} (${now[w.last]}); it is on ${last + 1} (${now[last]})`);
        if (far !== w.far) out.push(`${what}: the furthest slide reached should be ${w.far + 1} (${now[w.far]}); it is ${far + 1} (${now[far]})`);
        if (!(far >= last)) out.push(`${what}: the furthest slide reached (${far + 1}) is behind the place (${last + 1})`);
        if (resumeSlideFor(d.id) !== last) out.push(`${what}: Continue should open slide ${last + 1}; it opens ${resumeSlideFor(d.id) + 1}`);
        if (o[d.id] !== last || o.cfLayout !== 8) out.push(`${what}: the place should be saved where it is now, as layout 8 (${last}/8): ${o[d.id]}/${o.cfLayout}`);
        if (!r.last || r.last.i !== last || r.last.k[0] !== now[last]) out.push(`${what}: the place's keys should be saved for where it is now: ${JSON.stringify(r.last)}`);
        return { last, far, lastKey: now[last], farKey: now[far] };
      } finally { buildDaySlides = base; }
    };
    const runOf = (s, li) => { const at = s.map((x, i) => x.type === 'topic' && x.lessonIndex === li ? i : -1).filter(i => i >= 0); return [at[0], at[at.length - 1]]; };
    const put = (last, far) => { state.lastSlide[d.id] = last; state.slideProgress[d.id] = far; return Promise.all([storeSet('slide-progress', state.slideProgress), storeSet('last-slide', state.lastSlide)]); };
    // a slide put in before it: the place and the furthest reached are one slide further on
    const ins = await read('a slide put in before the place', x => { const s = base(x); if (x === d) s.splice(1, 0, { type: 'keyCheckNew' }); return s; },
      now => ({ last: now.indexOf(placeKey), far: now.indexOf(farKey) }));
    if (ins.last !== a + 1) out.push(`a slide put in before the place should move it one slide on (to ${a + 2}): ${ins.last + 1}`);
    // the place's own slide taken out: it lands on the slide before it; the furthest reached stays on its slide
    await put(a, a + 1);
    await read("the place's own slide taken out", x => base(x).filter(sl => !(x === d && K.keyOf(d, sl) === placeKey)),
      now => ({ last: now.indexOf(beforeKey), far: now.indexOf(farKey) }));
    // ... and back: the place stays on the slide it landed on (it was saved there)
    await read('the slide back', base, now => ({ last: now.indexOf(beforeKey), far: now.indexOf(farKey) }));
    // the furthest reached taken out with the place: it lands on the slide before it, never behind the place
    await put(a, a);
    await read('the place, also the furthest reached, taken out', x => base(x).filter(sl => !(x === d && K.keyOf(d, sl) === placeKey)),
      now => ({ last: now.indexOf(beforeKey), far: now.indexOf(beforeKey) }));
    // the place's lesson moved before the block ahead of it: both follow their slides
    await put(a, a + 1);
    const li = base(d)[a].lessonIndex, lj = base(d)[a - 1].lessonIndex;
    const swap = await read('the blocks reordered', x => { const s = base(x); if (x !== d) return s;
        const [a0, a1] = runOf(s, li), [b0, b1] = runOf(s, lj); if (b1 + 1 !== a0) return s;
        return s.slice(0, b0).concat(s.slice(a0, a1 + 1), s.slice(b0, b1 + 1), s.slice(a1 + 1)); },
      now => ({ last: now.indexOf(placeKey), far: now.indexOf(farKey) }));
    if (!(swap.last < a)) out.push(`with its lesson moved before the block ahead of it, the place should be further back than slide ${a + 1}: ${swap.last + 1}`);
    await read('the blocks back in order', base, now => ({ last: now.indexOf(placeKey), far: now.indexOf(farKey) }));
    // the furthest reached moved back before the place by key, the place not moved: the furthest is put on the place
    // (a slide before the place taken out, and the furthest's slide moved to the front: the place's index is the same)
    await put(a, a + 1);
    await read('the furthest moved before the place', x => { const s = base(x); if (x !== d) return s;
        const f = s.find(sl => K.keyOf(d, sl) === farKey), t = s.filter((sl, i) => i !== 2 && sl !== f); t.splice(1, 0, f); return t; },
      now => ({ last: now.indexOf(placeKey), far: now.indexOf(placeKey) }));
    await read('the furthest back in order', base, now => ({ last: now.indexOf(placeKey), far: now.indexOf(placeKey) }));
    // a run of BACK+1 slides ending at the place taken out (every key it was saved with gone, its block's start too): the
    // place keeps its index, never past the end, and gets keys afresh; the furthest reached is never behind it
    await put(a, a + 1);
    const gone = new Set(keys0.slice(Math.max(0, a - K.BACK), a + 1));
    const run = await read(`a run of ${K.BACK + 1} slides ending at the place taken out`, x => base(x).filter(sl => !(x === d && gone.has(K.keyOf(d, sl)))),
      now => ({ last: Math.min(a, now.length - 1), far: Math.max(now.indexOf(farKey), Math.min(a, now.length - 1)) }));
    await read('the run back', base, now => ({ last: now.indexOf(run.lastKey), far: now.indexOf(run.farKey) }));
    // a place saved without keys (every place saved before keys, an older page, another device) is a position in layout
    // 7's deck (js/cm-slide-keys7.js): on a changed deck it opens the slide that position had in layout 7 (that slide
    // gone: the nearest slide before it that is still there), and gets its keys
    const k7 = __keys8(d);   // layout 8's deck: layout 7's record (js/cm-slide-keys7.js) without the lesson cards GONE8 names
    if (!k7.length) out.push(`Day ${d.cf.n} has no record in js/cm-slide-keys7.js (layout 7's deck, and so layout 8's)`);
    const at7 = (now, i) => { for (let j = Math.min(i, k7.length - 1); j >= 0; j--) { const t = now.indexOf(k7[j]); if (t >= 0) return t; } return 0; };
    const keyless = (last, far) => { localStorage.setItem('lsh_last-slide', JSON.stringify({ [d.id]: last, cfLayout: 8 })); localStorage.setItem('lsh_slide-progress', JSON.stringify({ [d.id]: far, cfLayout: 8 })); };
    const L7 = Math.min(a - 1, k7.length - 1), F7 = Math.min(a + 1, k7.length - 1), changed = x => { const s = base(x); if (x !== d) return s;
      const t = s.filter(sl => K.keyOf(d, sl) !== k7[F7]); t.splice(1, 0, { type: 'keyCheckNew' }); return t; };
    await storeSet('slide-keys', null); keyless(L7, F7);
    await read('a place saved without keys, on the deck it was saved in', base, now => ({ last: at7(now, L7), far: Math.max(at7(now, F7), at7(now, L7)) }));
    await storeSet('slide-keys', null); keyless(L7, F7);
    const moved7 = await read('a place saved without keys, on a changed deck', changed, now => ({ last: at7(now, L7), far: Math.max(at7(now, F7), at7(now, L7)) }));
    if (k7.length && moved7.last === L7) out.push(`a place saved without keys (layout 8 slide ${L7 + 1}) with a slide put in before it should move one slide on: it stayed on ${moved7.last + 1}`);
    // ... and back: it stays on its slide, by the keys it was given
    await read('a place saved without keys, the deck back', base, now => ({ last: now.indexOf(moved7.lastKey), far: now.indexOf(moved7.farKey) }));
    // keys saved for another index (another device saved the place since, with no keys) are not followed: that place
    // is a layout-7 position too, while the furthest reached, saved with its keys, still follows its slide
    await put(a, a + 1); localStorage.setItem('lsh_last-slide', JSON.stringify({ [d.id]: L7, cfLayout: 8 }));
    await read('a place saved since without keys', x => { const s = base(x); if (x === d) s.splice(1, 0, { type: 'keyCheckNew' }); return s; }, now => ({ last: at7(now, L7), far: Math.max(now.indexOf(farKey), at7(now, L7)) }));
    // a place another tab of the previous page (no keys, layout 7) writes while this page runs a changed deck: it is taken
    // on from layout 7 as it arrives, and a save this page makes next never gives it today's keys as it stands
    await put(a, a + 1);
    buildDaySlides = x => { const s = base(x); if (x === d) s.splice(1, 0, { type: 'keyCheckNew' }); return s; };
    try {
      await loadAll(); state.isAdmin = true;
      const v = JSON.stringify({ [d.id]: L7, cfLayout: 8 });
      localStorage.setItem('lsh_last-slide', v);
      window.dispatchEvent(new StorageEvent('storage', { key: 'lsh_last-slide', newValue: v }));
      await storeSet('slide-progress', state.slideProgress);   // the page's next save, as the settle runs
      await K.settle();
      const now = K.keysOf(d), w = at7(now, L7), last = state.lastSlide[d.id], r = (stored('slide-keys') || {})[d.id] || {};
      log.push(`another tab's place without keys: ${last + 1}`);
      if (last !== w) out.push(`a place another tab wrote without keys (layout 8 slide ${L7 + 1}) should open slide ${w + 1} (${now[w]}) of the changed deck: ${last + 1} (${now[last]})`);
      if (!r.last || r.last.i !== last || r.last.k[0] !== now[last]) out.push(`another tab's place, taken on from layout 7, should get the keys of where it is now: ${JSON.stringify(r.last)}`);
    } finally { buildDaySlides = base; }
    await put(a, a + 1); await loadAll(); state.isAdmin = true;
    return { out, log, dayId: d.id, n: d.cf.n, a, keys: keys0.length, placeKey };
  });
  keyed.out.forEach(m => fail(`slide keys: ${m}`));
  // a real reload: a place saved by key on a deck where its slide sat one slide back (as before a deck change) opens on its slide
  let reloaded = null, updated = null;
  if (keyed.dayId != null && !keyed.out.length) {
    await page.evaluate(({ dayId, a }) => {
      const d = DAYS.find(x => x.id === dayId), t = cmSlideKeys.trail(cmSlideKeys.keysOf(d), a);
      localStorage.setItem('lsh_last-slide', JSON.stringify({ [dayId]: a - 1, cfLayout: 8 })); localStorage.setItem('lsh_slide-progress', JSON.stringify({ [dayId]: a - 1, cfLayout: 8 }));
      localStorage.setItem('lsh_slide-keys', JSON.stringify({ [dayId]: { last: { i: a - 1, k: t }, far: { i: a - 1, k: t } } }));
    }, keyed);
    await page.reload({ waitUntil: 'load' });
    reloaded = await page.waitForFunction(({ dayId, a }) => typeof state !== 'undefined' && !!state.traineeId && !!window.cmSlideKeys && state.lastSlide && state.lastSlide[dayId] === a && state.slideProgress[dayId] === a, keyed, { timeout: 15000 }).then(() => keyed.a + 1).catch(() => null);
    if (!reloaded) fail(`slide keys: after a reload, a place saved by key on slide ${keyed.a} of a deck where its slide (${keyed.placeKey}) sat there should open on slide ${keyed.a + 1}: ${await page.evaluate((dayId) => typeof state === 'undefined' ? 'no page' : `${state.lastSlide && state.lastSlide[dayId]}/${state.slideProgress && state.slideProgress[dayId]}`, keyed.dayId).catch(e => e.message)}`);
    // the reload after an update: the slide it kept goes with its keys and its layout, and opens again
    const kept = await page.evaluate(({ dayId, a }) => {
      state.isAdmin = true; goto('day', dayId); state.dayViewMode = 'slides'; state.lessonSlide = a; render();
      applyUpdate();   // (its wrappers keep what they keep at once; the reload follows the cloud save)
      return { layout: sessionStorage.getItem('lsh_resume_layout'), keys: JSON.parse(sessionStorage.getItem('lsh_resume_keys') || 'null') };
    }, keyed).catch(e => ({ error: e.message }));
    if (kept.layout !== String(LAYOUT)) fail(`slide keys: applyUpdate should say its slide was saved in layout ${LAYOUT} (js/cm-slide-places.js): ${JSON.stringify(kept)}`);
    if (!kept.keys || kept.keys.dayId !== keyed.dayId || !Array.isArray(kept.keys.k) || kept.keys.k[0] !== keyed.placeKey) fail(`slide keys: applyUpdate should keep its slide's keys (lsh_resume_keys, ${keyed.placeKey} first): ${JSON.stringify(kept.keys)}`);
    await page.waitForNavigation({ waitUntil: 'load', timeout: 15000 }).catch(() => {});
    updated = await page.waitForFunction(({ dayId, a }) => typeof state !== 'undefined' && state.view === 'day' && state.dayId === dayId && state.lessonSlide === a && !sessionStorage.getItem('lsh_resume_keys'), keyed, { timeout: 15000 }).then(() => keyed.a + 1).catch(() => null);
    if (!updated) fail(`slide keys: the reload after an update should reopen slide ${keyed.a + 1} of Day ${keyed.n}: ${await page.evaluate(() => typeof state === 'undefined' ? 'no page' : `${state.view} ${state.dayId} ${state.lessonSlide}`).catch(e => e.message)}`);
  }

  await browser.close();
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 60).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  const sum = k => maps.days.reduce((a, x) => a + x[k], 0);
  console.log(`A saved place follows its slide by key (js/cm-slide-keys.js): on Day ${keyed.n} (${keyed.keys} slides, the place on ${keyed.placeKey}) ${keyed.log.join('; ')}${reloaded ? `; after a reload too (slide ${reloaded})` : ''}${updated ? `; and after an update (slide ${updated})` : ''}.`);
  if (Object.keys(DECK7).some(n => !deck8[n])) console.log(`The live decks of Day ${Object.keys(DECK7).filter(n => !deck8[n]).join(', Day ')} have changed since layout 8: the older layouts' moves were checked against layout 7's frozen deck (js/cm-slide-keys7.js) and layout 8's made from it; the tests that open those days on a given slide stood aside.`);
  if (all7 && s40) console.log(`A saved place follows its slide: ${maps.days.map(x => `Day ${x.n} ${x.was1}→${x.was2}→${x.was3}→${x.was4}→${x.was5}→${x.was6}→${x.now} slides`).join(', ')} (layout 1→2→3→4→5→6→7: ${sum('job1')} On the Job slides gone, then ${sum('steps2')} Milestone Steps slides gone and ${sum('why2')} Why It Matters slides now the opening of The Theory, then every day reordered to all its lessons and one Practice Lab: ${sum('moved3')} of layout 3's ${sum('was3')} positions sit elsewhere, then ${maps.days.reduce((a, x) => a + x.deckLessons.length, 0)} lessons drawn from the trainer's deck pages: a place in one opens page ⌊j·n/m⌋ of its lesson, and ${sum('pages')} pages of the revised deck as slides of their own, which no older place opens, then ${sum('sb5')} Skill Building slides gone, then Meet Your Case and its two slides out of Day 1 for Meet John Doe on the Case Profile${meet6 ? ` (a place on Meet Your Case opens slide ${meet6.caseTo}; the Practice Lab, slide ${meet6.from} in layout 5, opens as ${meet6.to})` : ""}); every position of all six older decks lands on the same slide of its own block and never past the end; slide 40 of Day 1 (${s40.was}) opens on slide ${s40.want + 1}, after a reload and after an update too, and is moved once${inDeck ? `; ${inDeck.was} (layout ${inDeck.layout}) opens ${inDeck.to}, slide ${inDeck.slide}` : ''}${overPages ? `; the slide after Day ${overPages.n}'s ${overPages.pages} deck pages (layout 4 slide ${overPages.from}) opens as slide ${overPages.to}` : ''}${inLab ? `; a layout-3 place in Day 2's lab (${lab3.was}, slide ${lab3.i + 1}) opens the same slide, now ${lab3.want + 1}` : ''}${why2 ? `; a Why It Matters place (${w2.was}) opens The Theory, slide ${w2.want + 1}` : ''}${steps2 ? `; a Milestone Steps place (${st2.was}) opens The Rules, slide ${st2.want + 1}` : ''}.`);
})().catch(e => { console.error(e); process.exit(1); });
