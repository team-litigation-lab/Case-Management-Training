// @check browser — A saved place follows its slide (On the Job and Milestone Steps are gone, Why It Matters opens The Theory, and a day is now all its lessons and then one Practice Lab, and six Day 1 lessons are drawn from the deck pages: a place saved in any older deck lands on the same slide of the same block, or on its lesson's deck page, never past the end)
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
// The layouts: 1, the deck with On the Job (what a place with no layout on it was saved in); 2, without On the Job,
// with the Milestone Steps slides and every Why It Matters slide; 3, without those, in the old order: the live deck
// before these changes; 4, today's order with every lesson on its own drawn slides and no deck page; 5, today's. The decks of layouts
// 1, 2 and 3 are recorded below as data (OLD, OLD3), slide by slide, in the order they were; layout 4's is today's
// deck with each deck lesson's pages replaced by the slides OLD3 records for it, and without the deckPage slides. Checked:
//   · the recorded decks are today's slides (each exactly once) plus the slides that are gone, and nothing else;
//   · a place in a lesson that is drawn from the deck now lands on that lesson's deck page ⌊j·n/m⌋, in every older
//     layout: its first slide on its first page, in order, never outside the lesson;
//   · every position of every day's deck, in all four older layouts, lands on the same slide of the same block where
//     it still exists; a Why It Matters slide that is gone on its lesson's The Theory, and a Milestone Steps slide on
//     its lesson's The Rules; an On the Job slide on its lesson's slide before it; never past the end of the day;
//   · the furthest slide reached becomes the furthest, in today's order, of the slides the trainee had seen: never
//     behind the place the trainee was on, no slide seen is locked again, and it is the day's last slide only for a
//     trainee who had reached the Ready check or the end of the old deck;
//   · a place saved in layout 3 inside the Practice Lab (Day 2, an activity's Check Your Work) opens that same slide
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
const LAYOUT = 5;
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
  const ORACLE = `window.__OLD = ${JSON.stringify(OLD)}; window.__OLD3 = ${JSON.stringify(OLD3)};
    window.__oldDeck = (d, layout) => { const out = [], bad = [], seen = new Set();
      const now = buildDaySlides(d).map(sl => { const b = sl.type === 'topic' ? d.lessons[sl.lessonIndex].cf.block : null; return b ? { id: b.id, view: cmCaseFlow.viewsOf(b)[sl.part - 1], li: sl.lessonIndex } : { id: '~' + sl.type, view: '', li: -1 }; });
      // layout 4: today's order, a lesson drawn from the deck now on the slides layout 3 records for it
      const DECKS = window.CM_DECK_SLIDES || {}, rec3 = id => (window.__OLD3[d.cf.n] || []).find(r => r.split(' ')[0] === id);
      const rows = layout >= 4 ? now.reduce((a, x, k) => { if (x.id === '~deckPage') return a; if (DECKS[x.id]) { if (!k || now[k - 1].id !== x.id) a.push(rec3(x.id) || x.id); } else if (x.id[0] === '~') a.push(x.id); else if (a.length && a[a.length - 1].split(' ')[0] === x.id && now[k - 1].id === x.id) a[a.length - 1] += ' ' + x.view; else a.push(x.id + ' ' + x.view); return a; }, [])
        : (layout >= 3 ? window.__OLD3 : window.__OLD)[d.cf.n] || [];
      rows.forEach(row => { const [id, ...views] = row.split(' ');
        // a lesson drawn from the trainer's deck now (layout 5): its old slides spread over its deck pages, in order
        if (DECKS[id]) { const was = views.filter(v => !(v === 'job' && layout > 1)), first = now.findIndex(x => x.id === id), n = now.filter(x => x.id === id).length;
          if (first < 0 || !n || !was.length || now.slice(first, first + n).some(x => x.id !== id)) { bad.push(id + ': its deck pages are not together in the deck, or the record has no slide for it'); return; }
          for (let q = 0; q < n; q++) { if (seen.has(first + q)) bad.push(id + ' is in the record twice'); seen.add(first + q); }
          was.forEach((view, j) => { const t = first + Math.min(n - 1, Math.floor(j * n / was.length)); out.push({ id, view, li: now[first].li, place: t, own: t, kept: false, deck: true, j, m: was.length, n, first }); });
          return; }
        (id[0] === '~' ? [''] : views).forEach(view => {
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
      // (the revised deck's pages, js/cm-deck-pages.js, are in no older deck: layout 5 added them)
      now.forEach((x, k) => { if (!seen.has(k) && x.id !== '~deckPage') bad.push('slide ' + (k + 1) + ' of the deck (' + x.id + ' ' + x.view + ') is not in the record of layout ' + layout); });
      // the furthest slide reached, at each old position: the furthest, in today's order, of everything up to it
      let far = 0; out.forEach(x => { far = Math.max(far, x.own, x.place); x.reach = far; });
      out.bad = bad; return out; };`;
  const setup = async () => { await page.evaluate(ORACLE); await page.evaluate(() => { state.isAdmin = true; const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }); };
  await setup();

  // 1. every position of every day's deck, in all three older layouts
  const maps = await page.evaluate(() => {
    const out = [], days = [];
    if (!window.cmSlidePlaces) return { out: ['js/cm-slide-places.js is not loaded'], days };
    for (const d of DAYS) {
      if (!d.cf) continue;
      const now = buildDaySlides(d), row = { n: d.cf.n, now: now.length };
      row.pages = now.filter(sl => sl.type === 'deckPage').length; row.pageFirst = now.findIndex(sl => sl.type === 'deckPage'); row.pageLast = row.pageFirst + row.pages - 1;
      if (row.pages && now.slice(row.pageFirst, row.pageLast + 1).some(sl => sl.type !== 'deckPage')) out.push(`Day ${d.cf.n}: the revised deck's pages are not together in the deck`);
      for (const layout of [1, 2, 3, 4]) {
        const old = __oldDeck(d, layout), place = cmSlidePlaces.placeMap(d, layout), reach = cmSlidePlaces.reachMap(d, layout), L = `Day ${d.cf.n}, layout ${layout}`;
        old.bad.forEach(m => out.push(`${L}: ${m}`));
        row['was' + layout] = old.length; row['moved' + layout] = old.filter((x, i) => x.place !== i).length; row['job' + layout] = old.filter(x => x.view === 'job' && !x.kept).length; row['why' + layout] = old.filter(x => x.view === 'why' && !x.kept).length; row['steps' + layout] = old.filter(x => x.view === 'steps' && !x.kept).length;
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
          if (x.kept && sl.type === 'topic' && (d.lessons[sl.lessonIndex].cf.block.id !== x.id || cmCaseFlow.viewsOf(d.lessons[sl.lessonIndex].cf.block)[sl.part - 1] !== x.view)) out.push(`${where}: lands on another slide (${d.lessons[sl.lessonIndex].cf.block.id} ${cmCaseFlow.viewsOf(d.lessons[sl.lessonIndex].cf.block)[sl.part - 1]})`);
          // the whole deck counts as seen only for a trainee who had reached the Ready check, or the old deck's end
          if (far === now.length - 1 && i < old.length - 1 && !old.slice(0, i + 1).some(o => o.id === '~readyCheck')) out.push(`${where}: its furthest-reached slide is the day's last, and the trainee had seen neither the Ready check nor the end`);
          if (!x.kept && !x.deck && x.view === 'why' && cmCaseFlow.viewsOf(d.lessons[x.li].cf.block)[sl.part - 1] !== 'theory') out.push(`${where}: a Why It Matters slide that is gone should land on The Theory`);
          if (!x.kept && !x.deck && x.view === 'steps' && cmCaseFlow.viewsOf(d.lessons[x.li].cf.block)[sl.part - 1] !== 'rules') out.push(`${where}: a Milestone Steps slide should land on The Rules`);
          // the revised deck's pages are new: no older place opens one, and they count as seen only from a slide past them
          if (sl.type === 'deckPage') out.push(`${where}: lands on one of the revised deck's pages, which no older deck had`);
          if (row.pages && fs.type === 'deckPage') out.push(`${where}: its furthest-reached slide is one of the revised deck's pages`);
          if (row.pages && (far > row.pageLast) !== (far >= row.pageFirst)) out.push(`${where}: its furthest-reached slide is inside the revised deck's pages`);
          // a lesson drawn from the deck now: page ⌊j·n/m⌋ of its own pages, the first slide on the first page, in order
          if (x.deck) { const b = d.lessons[x.li].cf.block, pages = (window.CM_DECK_SLIDES[x.id] || []).map(p => 'deck' + p.page), v = sl.type === 'topic' ? cmCaseFlow.viewsOf(b)[sl.part - 1] : '';
            if (v !== pages[Math.min(x.n - 1, Math.floor(x.j * x.n / x.m))]) out.push(`${where}: slide ${x.j + 1} of the ${x.m} the lesson had should open deck page ${pages[Math.min(x.n - 1, Math.floor(x.j * x.n / x.m))]} of its ${x.n}; it opens ${v || sl.type}`);
            if (x.j === 0 && to !== x.first) out.push(`${where}: the lesson's first slide should open its first deck page`);
            if (x.j && old[i - 1].deck && old[i - 1].id === x.id && to < place[i - 1]) out.push(`${where}: lands before the slide ahead of it in the same lesson`);
            if (pages.length !== x.n || x.n !== cmCaseFlow.viewsOf(b).length) out.push(`${where}: the lesson has ${cmCaseFlow.viewsOf(b).length} slides and ${pages.length} deck pages`);
            row.deck = (row.deck || 0) + 1; }
          if (x.kept && (x.view === 'steps' || x.view === 'job')) out.push(`${where}: the deck still has a ${x.view === 'steps' ? 'Milestone Steps' : 'On the Job'} slide`);
        });
        if (reach[reach.length - 1] !== now.length - 1) out.push(`${L}: a trainee who had reached the deck's last slide has not reached today's last`);
        if (place[place.length - 1] !== old[old.length - 1].place) out.push(`${L}: the deck's last slide doesn't land on the same slide`);
      }
      row.deckLessons = d.lessons.filter(l => l.cf && (window.CM_DECK_SLIDES || {})[l.cf.block.id]).map(l => ({ id: l.cf.block.id, n: cmCaseFlow.viewsOf(l.cf.block).length, m: cmCaseFlow.drawnViewsOf ? cmCaseFlow.drawnViewsOf(l.cf.block).length : -1 }));
      const views = now.filter(sl => sl.type === 'topic').map(sl => cmCaseFlow.viewsOf(d.lessons[sl.lessonIndex].cf.block)[sl.part - 1]);
      if (views.includes('job')) out.push(`Day ${d.cf.n}: a lesson still has an On the Job slide`);
      if (views.includes('steps')) out.push(`Day ${d.cf.n}: a lesson still has a Milestone Steps slide`);
      days.push(row);
    }
    return { out, days, layout: cmSlidePlaces.LAYOUT };
  });
  maps.out.forEach(fail);
  if (maps.layout !== LAYOUT) fail(`js/cm-slide-places.js is at layout ${maps.layout}; this check describes layout ${LAYOUT}`);
  if (!maps.days.length) fail('no Case Flow day found');
  if (maps.days.length && !maps.days.some(x => x.job1 > 0)) fail('no day lost an On the Job slide: the record is wrong, or the slides are back');
  if (maps.days.length && maps.days.reduce((a, x) => a + x.why2, 0) !== 41) fail(`the record should hold the 41 Why It Matters slides of the lessons with a Theory slide, all gone (each opens The Theory now): ${maps.days.reduce((a, x) => a + x.why2, 0)} are gone`);
  maps.days.forEach(x => { if (!(x.moved3 > 0)) fail(`Day ${x.n}: no position of layout 3 moved: the record of layout 3 is today's order, or the order did not change`);
    if (x.was3 !== x.was4) fail(`Day ${x.n}: layout 3 had ${x.was3} slides and layout 4 ${x.was4}: the reordering should neither add nor remove a slide`);
    // layout 5: only the lessons drawn from the deck changed their number of slides
    const diff = x.deckLessons.reduce((a, l) => a + l.n - l.m, 0);
    if (x.now - x.was4 !== diff + x.pages) fail(`Day ${x.n}: layout 4 had ${x.was4} slides and today's deck has ${x.now}; the lessons drawn from the deck account for ${diff} and the revised deck's pages for ${x.pages}`);
    if (x.deckLessons.some(l => l.m < 1 || l.n < 1)) fail(`Day ${x.n}: a lesson drawn from the deck has no drawn slides on record, or no deck page: ${JSON.stringify(x.deckLessons)}`);
    if (x.deckLessons.length && !(x.deck > 0)) fail(`Day ${x.n}: no position of an older layout stood in a lesson drawn from the deck`); });
  if (maps.days.length && !maps.days.some(x => x.deckLessons.length)) fail('no lesson is drawn from the deck (window.CM_DECK_SLIDES): layout 5 describes nothing');
  if (maps.days.length && maps.days.reduce((a, x) => a + x.steps2, 0) !== 26) fail(`the record should hold the 26 Milestone Steps slides of the live deck, all gone: it holds ${maps.days.reduce((a, x) => a + x.steps2, 0)} that are gone`);

  // 2. slide 40 of Day 1, saved in layout 1 (no layout on it): opened, reloaded, opened again
  const put = (at, layout, n) => page.evaluate(async ({ at, layout, n }) => {
    const d = DAYS.find(x => x.cf && x.cf.n === (n || 1)), old = __oldDeck(d, layout || 1);
    const i = typeof at === 'string' && / /.test(at) ? old.findIndex(x => x.id + ' ' + x.view === at) : at === 'last' ? old.length - 1 : at === 'far' ? 9999 : at === 'why' ? old.findIndex(x => x.view === 'why' && !x.kept && !x.deck && x.place !== x.reach) : at === 'steps' ? old.findIndex(x => x.view === 'steps' && !x.kept && !x.deck && x.place !== x.reach) : at;
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
  const s40 = await put(39), got = await open(s40.dayId);
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
  // never past the end, from any older layout: the old deck's last slide (Day 1's was the last activity's Check Your
  // Work; the Ready check is last now) opens on that same slide, with the whole deck reached
  for (const layout of [1, 2, 3, 4]) for (const at of ['last', 'far']) {
    const p = await put(at, layout), g = await open(p.dayId);
    if (g.at !== p.want || g.far !== p.total - 1 || g.at > p.total - 1) fail(`a place at ${at === 'last' ? "the deck's last slide" : 'slide 10000'} (${p.was}), saved in layout ${layout}, should open that slide (${p.want + 1}) with the whole deck reached (${p.total}): slide ${g.at + 1}, furthest ${g.far + 1}`);
  }
  // a place saved in layout 3 (the deck before the lessons were put together) in the Practice Lab: Day 2, the first
  // activity's Check Your Work, which sat after five lessons and now sits after all twenty
  const lab3 = await put('d1m1-a1 check', 3, 2);
  let inLab = null;
  if (lab3.i < 0) fail('Day 2 of layout 3 has no d1m1-a1 Check Your Work slide (the check wants one to stand on)');
  else {
    inLab = await open(lab3.dayId);
    if (lab3.want === lab3.i) fail(`Day 2's d1m1-a1 Check Your Work sits where it sat in layout 3 (slide ${lab3.i + 1}): the check proves nothing about the reordering`);
    if (inLab.at !== lab3.want || inLab.is !== 'd1m1-a1 check') fail(`a trainee on ${lab3.was} (layout 3 slide ${lab3.i + 1} of Day 2) should open that same slide, now slide ${lab3.want + 1}; opened ${inLab.at + 1} (${inLab.is})`);
    if (inLab.far !== lab3.far || inLab.far < inLab.at) fail(`the furthest slide reached, saved on ${lab3.was} in layout 3, should be slide ${lab3.far + 1}; it is ${inLab.far + 1}`);
    if (inLab.stored !== `${lab3.want}/${LAYOUT} ${lab3.far}/${LAYOUT}`) fail(`the places moved from layout 3 should be saved with cfLayout ${LAYOUT} (${lab3.want}/${LAYOUT} ${lab3.far}/${LAYOUT}): ${inLab.stored}`);
    await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
    const twice = await open(lab3.dayId);
    if (twice.at !== lab3.want || twice.far !== lab3.far) fail(`a place moved from layout 3 was moved again when read a second time: slide ${twice.at + 1}, furthest ${twice.far + 1}`);
  }
  // a place saved inside a lesson that is drawn from the deck now (layout 5), in the old order (3) and in today's (4):
  // it opens that lesson's deck page ⌊j·n/m⌋, moved once
  let inDeck = null;
  for (const layout of [3, 4]) {
    const pick = await page.evaluate((layout) => { for (const d of DAYS.filter(x => x.cf)) { const old = __oldDeck(d, layout), x = old.filter(o => o.deck && o.j === o.m - 1 && o.m > 1)[0]; if (x) return { n: d.cf.n, at: x.id + ' ' + x.view, j: x.j, m: x.m, pages: x.n, first: x.first }; } return null; }, layout);
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
  const pg = await page.evaluate(() => { for (const d of DAYS.filter(x => x.cf)) { const now = buildDaySlides(d), a = now.findIndex(sl => sl.type === 'deckPage'); if (a > 0) { const n = now.filter(sl => sl.type === 'deckPage').length, old = __oldDeck(d, 4);
    return { n: d.cf.n, first: a, pages: n, after: old.findIndex(o => o.place === a + n), before: old.map(o => o.place).lastIndexOf(a - 1), afterIs: now[a + n] ? now[a + n].type : 'the end' }; } } return null; });
  if (!pg) fail("no day has the revised deck's pages (js/cm-deck-pages.js): layout 5 describes none");
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
  // a place saved in layout 2 (this deck, before Why It Matters opened The Theory) on a Why It Matters slide that is gone
  const w2 = await put('why', 2);
  let why2 = null;
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
  const st2 = await put('steps', 2);
  let steps2 = null;
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

  // 3. the reload after an update: the slide it kept
  const resume = async (layout) => page.evaluate(async ({ layout, LAYOUT }) => {
    const d = DAYS.find(x => x.cf && x.cf.n === 1), old = __oldDeck(d, layout || 1), o = old[39], want = layout >= LAYOUT ? 39 : o.place;
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
  const fromNew = await resume(LAYOUT);
  if (fromNew.at !== 39) fail(`an update between two versions of today's deck should reopen the same slide (40): reopened ${fromNew.at + 1}`);
  if (fromNew.left !== null) fail('the layout the update saved its slide in should be cleared once read');
  const stamps = await page.evaluate(() => typeof applyUpdate === 'function' && /RESUME_LAYOUT/.test(String(applyUpdate)));
  if (!stamps) fail('applyUpdate should say which layout it saved its slide in (js/cm-slide-places.js wraps it)');

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

  await browser.close();
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 60).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  const sum = k => maps.days.reduce((a, x) => a + x[k], 0);
  console.log(`A saved place follows its slide: ${maps.days.map(x => `Day ${x.n} ${x.was1}→${x.was2}→${x.was3}→${x.was4}→${x.now} slides`).join(', ')} (layout 1→2→3→4→5: ${sum('job1')} On the Job slides gone, then ${sum('steps2')} Milestone Steps slides gone and ${sum('why2')} Why It Matters slides now the opening of The Theory, then every day reordered to all its lessons and one Practice Lab: ${sum('moved3')} of layout 3's ${sum('was3')} positions sit elsewhere, then ${maps.days.reduce((a, x) => a + x.deckLessons.length, 0)} lessons drawn from the trainer's deck pages: a place in one opens page ⌊j·n/m⌋ of its lesson, and ${sum('pages')} pages of the revised deck as slides of their own, which no older place opens); every position of all four older decks lands on the same slide of its own block and never past the end; slide 40 of Day 1 (${s40.was}) opens on slide ${s40.want + 1}, after a reload and after an update too, and is moved once${inDeck ? `; ${inDeck.was} (layout ${inDeck.layout}) opens ${inDeck.to}, slide ${inDeck.slide}` : ''}${overPages ? `; the slide after Day ${overPages.n}'s ${overPages.pages} deck pages (layout 4 slide ${overPages.from}) opens as slide ${overPages.to}` : ''}${inLab ? `; a layout-3 place in Day 2's lab (${lab3.was}, slide ${lab3.i + 1}) opens the same slide, now ${lab3.want + 1}` : ''}${why2 ? `; a Why It Matters place (${w2.was}) opens The Theory, slide ${w2.want + 1}` : ''}${steps2 ? `; a Milestone Steps place (${st2.was}) opens The Rules, slide ${st2.want + 1}` : ''}.`);
})().catch(e => { console.error(e); process.exit(1); });
