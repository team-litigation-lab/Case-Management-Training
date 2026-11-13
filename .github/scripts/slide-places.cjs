// @check browser — A saved place follows its slide (On the Job and Milestone Steps are gone, and Why It Matters opens The Theory: a place saved in either older deck lands on the same lesson, never past the end)
// A trainee's place in a day is a slide position ("last-slide", "slide-progress", and the slide kept across the reload
// that brings in a new version). The Case Flow decks have changed twice: the lessons lost their On the Job slide (the
// Trigger ➔ Task ➔ Tool ➔ Checkpoint cards); and then, in one change, the 26 Milestone Steps slides went (their steps
// are in the trainer's talking points for The Rules) and Why It Matters became the opening line of The Theory in every
// lesson that has one. A position saved in an older deck would open a few slides too far on, and a trainee near the
// end would find the Knowledge Check open on slides never seen. js/cm-slide-places.js moves a saved place once.
// The layouts: 1, the deck with On the Job (what a place with no layout on it was saved in); 2, without On the Job:
// the deck with the Milestone Steps slides and every Why It Matters slide; 3, without the revised deck's pages
// (js/cm-deck-pages.js); 4, today's. The decks of layouts 1 and 2 are recorded below as data (OLD), slide by slide;
// layout 3's is the same without the slides layout 3 had dropped, and every layout's lacks the deck's pages. Checked:
//   · the recorded decks are today's deck plus the slides that are gone, and nothing else;
//   · every position of every day's deck, in both older layouts, lands on the same lesson: on the same slide where it
//     still exists; a Why It Matters slide that is gone on its lesson's The Theory, and a Milestone Steps slide on its
//     lesson's The Rules (each, as the furthest slide reached, on the slide the trainee had passed to get there); an On
//     the Job slide on its lesson's slide before it; never further on than the slide after it would have been, and
//     the last slide stays the last;
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
const LAYOUT = 4;
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
  const ORACLE = `window.__OLD = ${JSON.stringify(OLD)};
    window.__oldDeck = (d, layout) => { const out = [], bad = [];
      // the revised deck's pages (layout 4) are in no older deck: the record is matched against the rest, at their positions today
      const now = buildDaySlides(d).map((sl, at) => { const b = sl.type === 'topic' ? d.lessons[sl.lessonIndex].cf.block : null; return b ? { id: b.id, view: cmCaseFlow.viewsOf(b)[sl.part - 1], li: sl.lessonIndex, at } : { id: '~' + sl.type, view: '', li: -1, at }; }).filter(x => x.id !== '~deckPage');
      let k = 0;
      (window.__OLD[d.cf.n] || []).forEach(row => { const [id, ...views] = row.split(' ');
        (id[0] === '~' ? [''] : views).forEach(view => {
          if (view === 'job' && layout > 1) return;
          const n = now[k], here = n && n.id === id && n.view === view;
          if (here) { out.push({ id, view, li: n.li, place: n.at, reach: n.at, kept: true }); k++; return; }
          if ((view === 'why' || view === 'steps') && layout > 2) return;   // layout 3 had neither
          const prev = out[out.length - 1];
          if ((view !== 'job' && view !== 'why' && view !== 'steps') || !prev || prev.id !== id) { bad.push(id + ' ' + view + ' is in the record and not in the deck (slide ' + (k + 1) + ' is ' + (n ? n.id + ' ' + n.view : 'the end') + ')'); return; }
          const th0 = now.find(x => x.id === id && x.view === 'theory'), ru0 = now.find(x => x.id === id && x.view === 'rules'), th = th0 ? th0.at : -1, ru = ru0 ? ru0.at : -1;
          if (view === 'why' && th < 0) { bad.push(id + ': Why It Matters is gone from a lesson with no Theory slide'); return; }
          if (view === 'steps' && ru < 0) { bad.push(id + ': Milestone Steps is gone from a lesson with no The Rules slide'); return; }
          out.push({ id, view, li: prev.li, place: view === 'why' ? th : view === 'steps' ? ru : prev.reach, reach: prev.reach, kept: false });
        }); });
      if (k !== now.length) bad.push('the record ends at slide ' + k + ' of ' + now.length + ' (slide ' + (k + 1) + ' is ' + (now[k] ? now[k].id + ' ' + now[k].view : '?') + ')');
      out.bad = bad; return out; };`;
  const setup = async () => { await page.evaluate(ORACLE); await page.evaluate(() => { state.isAdmin = true; const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }); };
  await setup();

  // 1. every position of every day's deck, in both older layouts
  const maps = await page.evaluate(() => {
    const out = [], days = [];
    if (!window.cmSlidePlaces) return { out: ['js/cm-slide-places.js is not loaded'], days };
    for (const d of DAYS) {
      if (!d.cf) continue;
      const now = buildDaySlides(d), row = { n: d.cf.n, now: now.length };
      for (const layout of [1, 2, 3]) {
        const old = __oldDeck(d, layout), place = cmSlidePlaces.placeMap(d, layout), reach = cmSlidePlaces.reachMap(d, layout), L = `Day ${d.cf.n}, layout ${layout}`;
        old.bad.forEach(m => out.push(`${L}: ${m}`));
        row['was' + layout] = old.length; row['job' + layout] = old.filter(x => x.view === 'job' && !x.kept).length; row['why' + layout] = old.filter(x => x.view === 'why' && !x.kept).length; row['steps' + layout] = old.filter(x => x.view === 'steps' && !x.kept).length;
        if (place.length !== old.length || reach.length !== old.length) { out.push(`${L}: the place map covers ${place.length} positions (the furthest-reached map ${reach.length}), the deck had ${old.length}`); continue; }
        old.forEach((x, i) => {
          const to = place[i], far = reach[i], sl = now[to], fs = now[far], where = `${L} slide ${i + 1} (${x.id} ${x.view || 'slide'})`;
          if (!sl || !fs) return out.push(`${where}: lands on no slide (${to}, furthest ${far})`);
          if (to !== x.place) out.push(`${where}: ${x.kept ? 'that slide is now' : x.view === 'why' ? "its lesson's The Theory is slide" : x.view === 'steps' ? "its lesson's The Rules is slide" : "its lesson's slide before it is"} ${x.place + 1}, the place lands on ${to + 1}`);
          if (far !== x.reach) out.push(`${where}: as the furthest slide reached it should be ${x.reach + 1}, it lands on ${far + 1}`);
          if (i && far < reach[i - 1]) out.push(`${where}: its furthest-reached slide lands before that of the slide ahead of it`);
          if (to > far) out.push(`${where}: the place lands further on than the furthest slide reached`);
          if (x.li >= 0 && (sl.type !== 'topic' || sl.lessonIndex !== x.li || fs.type !== 'topic' || fs.lessonIndex !== x.li)) out.push(`${where}: lands outside its lesson`);
          if (!x.kept && x.view === 'why' && cmCaseFlow.viewsOf(d.lessons[x.li].cf.block)[sl.part - 1] !== 'theory') out.push(`${where}: a Why It Matters slide that is gone should land on The Theory`);
          if (!x.kept && x.view === 'steps' && cmCaseFlow.viewsOf(d.lessons[x.li].cf.block)[sl.part - 1] !== 'rules') out.push(`${where}: a Milestone Steps slide should land on The Rules`);
          if (x.kept && (x.view === 'steps' || x.view === 'job')) out.push(`${where}: the deck still has a ${x.view === 'steps' ? 'Milestone Steps' : 'On the Job'} slide`);
        });
        if (place[place.length - 1] !== now.length - 1 || reach[reach.length - 1] !== now.length - 1) out.push(`${L}: the deck's last slide doesn't land on today's last`);
      }
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
  if (maps.days.length && maps.days.reduce((a, x) => a + x.steps2, 0) !== 26) fail(`the record should hold the 26 Milestone Steps slides of the live deck, all gone: it holds ${maps.days.reduce((a, x) => a + x.steps2, 0)} that are gone`);

  // 2. slide 40 of Day 1, saved in layout 1 (no layout on it): opened, reloaded, opened again
  const put = (at, layout) => page.evaluate(async ({ at, layout }) => {
    const d = DAYS.find(x => x.cf && x.cf.n === 1), old = __oldDeck(d, layout || 1);
    const i = at === 'last' ? old.length - 1 : at === 'far' ? 9999 : at === 'why' ? old.findIndex(x => x.view === 'why' && !x.kept && x.place !== x.reach) : at === 'steps' ? old.findIndex(x => x.view === 'steps' && !x.kept && x.place !== x.reach) : at;
    // in storage as the old code left them: positions in the old deck, with the layout that code stamped (the first stamped none)
    const saved = o => JSON.stringify(layout > 1 ? Object.assign(o, { cfLayout: layout }) : o);
    localStorage.setItem('lsh_last-slide', saved({ [d.id]: i })); localStorage.setItem('lsh_slide-progress', saved({ [d.id]: i }));
    if (!window.__noLoad) { await loadAll(); state.isAdmin = true; }   // the page reads its saved progress, as at start-up and at sign-in
    const o = old[Math.min(i, old.length - 1)];
    return { dayId: d.id, i, was: `${o.id} ${o.view}`, li: o.li, want: o.place, far: o.reach, total: buildDaySlides(d).length, oldTotal: old.length };
  }, { at, layout });
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
  // never past the end, from either older layout
  for (const layout of [1, 2]) for (const at of ['last', 'far']) {
    const p = await put(at, layout), g = await open(p.dayId);
    if (g.at !== p.total - 1 || g.far !== p.total - 1) fail(`a place at ${at === 'last' ? "the deck's last slide" : 'slide 10000'}, saved in layout ${layout}, should land on today's last slide (${p.total}): slide ${g.at + 1}, furthest ${g.far + 1}`);
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
  console.log(`A saved place follows its slide: ${maps.days.map(x => `Day ${x.n} ${x.was1}→${x.was2}→${x.now} slides`).join(', ')} (layout 1→2→3: ${sum('job1')} On the Job slides gone, then ${sum('steps2')} Milestone Steps slides gone and ${sum('why2')} Why It Matters slides now the opening of The Theory); every position of both older decks lands on its own lesson and never past the end; slide 40 of Day 1 (${s40.was}) opens on slide ${s40.want + 1}, after a reload and after an update too, and is moved once${why2 ? `; a Why It Matters place (${w2.was}) opens The Theory, slide ${w2.want + 1}` : ''}${steps2 ? `; a Milestone Steps place (${st2.was}) opens The Rules, slide ${st2.want + 1}` : ''}.`);
})().catch(e => { console.error(e); process.exit(1); });
