// @check browser — A saved place follows its slide (the lessons' On the Job slide is gone: a place saved before lands on the same lesson, never past the end)
// A trainee's place in a day is a slide position ("last-slide", "slide-progress", and the slide kept across the reload
// that brings in a new version). The Case Flow lessons lost their On the Job slide (the Trigger ➔ Task ➔ Tool ➔
// Checkpoint cards), so a position saved in that deck would open a few slides too far on, and a trainee near the end
// would find the Knowledge Check open on slides never seen. js/cm-slide-places.js moves a saved place once. Checked:
//   · every position of every day's old deck (rebuilt here from today's: On the Job back where it sat) lands on the
//     same lesson, on the same slide where it still exists, on Milestone Steps or the slide before where it was On
//     the Job, never further on than the slide after it would have been, and the last slide stays the last;
//   · a trainee on slide 40 of Day 1 lands on that lesson when the saved progress is read and the day opened, after a
//     real reload of the page too, and is moved once only; a place past the end lands on the last slide; a place
//     this page makes itself is never moved, and is saved with its layout on it;
//   · the reload after an update: a slide kept by a page still running the old deck is moved, one kept by this
//     code is not;
//   · copy left over from the old deck (a "job" entry in the slides or the trainer scripts) draws nothing and breaks nothing.
// Usage: node .github/scripts/slide-places.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const failures = [], fail = m => failures.push(m);
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Slide', 'Places', 'B100926');
  // the old deck of a day, rebuilt from today's: each slide's lesson and view, On the Job back after The Rules or See It
  const ORACLE = `window.__oldDeck = d => { const out = [];
    buildDaySlides(d).forEach((sl, k) => {
      const b = sl.type === 'topic' ? d.lessons[sl.lessonIndex].cf.block : null, vs = b ? cmCaseFlow.viewsOf(b) : [], v = b ? vs[sl.part - 1] : sl.type;
      const had = b && b.kind === 'lesson' && (b.ops || []).length > 0;
      out.push({ now: k, li: b ? sl.lessonIndex : -1, view: had && v === 'steps' ? 'job' : v, id: b ? b.id : sl.type });
      if (had && !vs.includes('steps') && sl.part === (vs.includes('dodont') ? vs.indexOf('dodont') : vs.length)) out.push({ now: -1, before: k, li: sl.lessonIndex, view: 'job', id: b.id });
    });
    return out; };`;
  const setup = async () => { await page.evaluate(ORACLE); await page.evaluate(() => { state.isAdmin = true; const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }); };
  await setup();

  // 1. every position of every day's old deck
  const maps = await page.evaluate(() => {
    const out = [], days = [];
    if (!window.cmSlidePlaces) return { out: ['js/cm-slide-places.js is not loaded'], days };
    for (const d of DAYS) {
      if (!d.cf) continue;
      const old = __oldDeck(d), now = buildDaySlides(d), map = cmSlidePlaces.placeMap(d), gone = old.filter(x => x.view === 'job' && x.now < 0).length, kept = old.filter(x => x.view === 'job' && x.now >= 0).length;
      days.push({ n: d.cf.n, was: old.length, now: now.length, gone, kept });
      if (map.length !== old.length) { out.push(`Day ${d.cf.n}: the place map covers ${map.length} positions, the old deck had ${old.length}`); continue; }
      old.forEach((x, i) => {
        const to = map[i], sl = now[to], where = `Day ${d.cf.n} old slide ${i + 1} (${x.id} ${x.view})`;
        if (!sl) return out.push(`${where}: lands on no slide (${to})`);
        if (i && to < map[i - 1]) out.push(`${where}: lands before the slide ahead of it`);
        if (x.now >= 0) { if (to !== x.now) out.push(`${where}: that slide is now ${x.now + 1}, the place lands on ${to + 1}`); }
        else { if (to !== x.before) out.push(`${where}: an On the Job slide lands on ${to + 1}, its lesson's slide before it is ${x.before + 1}`);
          if (sl.type !== 'topic' || sl.lessonIndex !== x.li) out.push(`${where}: lands outside its lesson`); }
      });
      if (map[map.length - 1] !== now.length - 1) out.push(`Day ${d.cf.n}: the old deck's last slide doesn't land on today's last`);
      if (now.some((sl, k) => sl.type === 'topic' && cmCaseFlow.viewsOf(d.lessons[sl.lessonIndex].cf.block)[sl.part - 1] === 'job')) out.push(`Day ${d.cf.n}: a lesson still has an On the Job slide`);
    }
    return { out, days };
  });
  maps.out.forEach(fail);
  if (!maps.days.length) fail('no Case Flow day found');
  if (maps.days.length && !maps.days.some(x => x.gone > 0)) fail('no day lost a slide: the old deck is rebuilt wrongly, or the On the Job slides are back');

  // 2. slide 40 of Day 1, saved in the old deck: opened, reloaded, opened again
  const put = (at) => page.evaluate(async (at) => {
    const d = DAYS.find(x => x.cf && x.cf.n === 1), old = __oldDeck(d);
    const i = at === 'last' ? old.length - 1 : at === 'far' ? 9999 : at;
    // in storage as the old code left them: positions in the old deck, no layout on them
    localStorage.setItem('lsh_last-slide', JSON.stringify({ [d.id]: i })); localStorage.setItem('lsh_slide-progress', JSON.stringify({ [d.id]: i }));
    if (!window.__noLoad) { await loadAll(); state.isAdmin = true; }   // the page reads its saved progress, as at start-up and at sign-in
    const o = old[Math.min(i, old.length - 1)], want = o.now >= 0 ? o.now : o.before;
    return { dayId: d.id, i, was: `${o.id} ${o.view}`, li: o.li, want, total: buildDaySlides(d).length, oldTotal: old.length };
  }, at);
  const open = (dayId) => page.evaluate((dayId) => {
    goto('day', dayId); state.dayViewMode = 'slides'; render();
    const d = DAYS.find(x => x.id === dayId), sl = buildDaySlides(d)[state.lessonSlide], b = sl && sl.type === 'topic' ? d.lessons[sl.lessonIndex].cf.block : null;
    return { at: state.lessonSlide, li: sl && sl.lessonIndex != null ? sl.lessonIndex : -1, is: b ? `${b.id} ${cmCaseFlow.viewsOf(b)[sl.part - 1]}` : sl ? sl.type : 'nothing',
      last: state.lastSlide[dayId], far: state.slideProgress[dayId], stamped: [state.lastSlide.cfLayout, state.slideProgress.cfLayout], drawn: !!document.getElementById('lessonSlideWrap'),
      stored: ['last-slide', 'slide-progress'].map(k => { const o = JSON.parse(localStorage.getItem('lsh_' + k) || '{}'); return `${o[dayId]}/${o.cfLayout}`; }).join(' ') };
  }, dayId);
  const s40 = await put(39), got = await open(s40.dayId);
  if (!got.drawn) fail('Day 1 did not open on a slide');
  if (got.at !== s40.want || got.li !== s40.li) fail(`a trainee on slide 40 of Day 1 (${s40.was}) should land on slide ${s40.want + 1} of the same lesson; landed on ${got.at + 1} (${got.is})`);
  if (got.last !== s40.want || got.far !== s40.want) fail(`the saved places should both be ${s40.want} after the move: last-slide ${got.last}, slide-progress ${got.far}`);
  if (got.stamped[0] !== 2 || got.stamped[1] !== 2) fail(`the moved places should carry the layout they are now in (cfLayout 2): ${got.stamped}`);
  if (got.stored !== `${s40.want}/2 ${s40.want}/2`) fail(`the moved places should be saved again, with their layout (${s40.want}/2 each): ${got.stored}`);
  await page.evaluate(async () => { await loadAll(); state.isAdmin = true; });
  const again = await open(s40.dayId);
  if (again.at !== s40.want || again.far !== s40.want) fail(`reading the saved progress a second time moved the place again: slide ${again.at + 1}, furthest ${again.far + 1}, was ${s40.want + 1}`);
  // a real reload, the place in storage as the old code left it
  await page.evaluate(() => { window.__noLoad = true; }); await put(39);
  await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
  await page.waitForFunction(() => typeof state !== 'undefined' && !!state.traineeId && !!window.cmSlidePlaces, null, { timeout: 15000 }).catch(() => fail('the trainee was not signed in after the reload'));
  await setup();
  const re = await open(s40.dayId);
  if (re.at !== s40.want || re.li !== s40.li) fail(`after a reload, slide 40 of Day 1 (${s40.was}) should open on slide ${s40.want + 1}; opened on ${re.at + 1} (${re.is})`);
  if (re.stamped[0] !== 2 || re.stamped[1] !== 2) fail(`after a reload the places should carry cfLayout 2: ${re.stamped}`);
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
  if (own.stored !== `${own.last}/2` || own.reread !== own.last) fail(`a place saved by this page should carry its layout and read back unmoved (${own.last}/2): saved ${own.stored}, read back ${own.reread}`);
  // never past the end
  for (const at of ['last', 'far']) {
    const p = await put(at), g = await open(p.dayId);
    if (g.at !== p.total - 1 || g.far !== p.total - 1) fail(`a place at ${at === 'last' ? 'the old deck\'s last slide' : 'slide 10000'} should land on today's last slide (${p.total}): slide ${g.at + 1}, furthest ${g.far + 1}`);
  }

  // 3. the reload after an update: the slide it kept
  const resume = async (layout) => page.evaluate(async ({ layout }) => {
    const d = DAYS.find(x => x.cf && x.cf.n === 1), old = __oldDeck(d), o = old[39], want = o.now >= 0 ? o.now : o.before;
    state.lastSlide = { [d.id]: 0, cfLayout: 2 }; state.slideProgress = { [d.id]: old.length, cfLayout: 2 };
    goto('dashboard');
    sessionStorage.setItem('lsh_resume_after_update', JSON.stringify({ view: 'day', dayId: d.id, lessonSlide: 39 }));
    if (layout) sessionStorage.setItem('lsh_resume_layout', String(layout)); else sessionStorage.removeItem('lsh_resume_layout');
    restoreAfterUpdate(); await new Promise(r => setTimeout(r, 450));
    return { at: state.lessonSlide, want, view: state.view, left: sessionStorage.getItem('lsh_resume_layout') };
  }, { layout });
  const fromOld = await resume(0);
  if (fromOld.view !== 'day' || fromOld.at !== fromOld.want) fail(`an update from the old deck on slide 40 should reopen slide ${fromOld.want + 1}: reopened ${fromOld.at + 1} (${fromOld.view})`);
  const fromNew = await resume(2);
  if (fromNew.at !== 39) fail(`an update between two versions of today's deck should reopen the same slide (40): reopened ${fromNew.at + 1}`);
  if (fromNew.left !== null) fail('the layout the update saved its slide in should be cleared once read');
  const stamps = await page.evaluate(() => typeof applyUpdate === 'function' && /RESUME_LAYOUT/.test(String(applyUpdate)));
  if (!stamps) fail('applyUpdate should say which layout it saved its slide in (js/cm-slide-places.js wraps it)');

  // 4. copy left over from the old deck draws nothing and breaks nothing
  const stale = await page.evaluate(async () => {
    const d = DAYS.find(x => x.cf && x.cf.n === 1), li = d.lessons.findIndex(l => l.cf.block.kind === 'lesson' && (l.cf.block.ops || []).length), b = d.lessons[li].cf.block;
    (window.CM_CF_SLIDES[b.id] = window.CM_CF_SLIDES[b.id] || {}).job = [['Trigger', 'Task', 'Tool', 'Checkpoint']];
    (window.CM_CF_SCRIPTS[b.id] = window.CM_CF_SCRIPTS[b.id] || {}).job = { say: 'left over' };
    goto('day', d.id); state.dayViewMode = 'slides'; const out = [];
    buildDaySlides(d).forEach((sl, k) => { if (sl.type !== 'topic' || sl.lessonIndex !== li) return;
      state.lessonSlide = k; render();
      const w = document.getElementById('lessonSlideWrap');
      if (!w || !w.querySelector('.cfx-sheet, .cfx-body')) out.push(`${b.id} slide ${k + 1}: nothing drawn`);
      else if (w.querySelector('.cfx-flow, .cfx-step') || /Trigger\s*(➔|→)\s*Task/i.test(w.textContent)) out.push(`${b.id} slide ${k + 1}: draws a Trigger ➔ Task ➔ Tool ➔ Checkpoint row`); });
    delete window.CM_CF_SLIDES[b.id].job; delete window.CM_CF_SCRIPTS[b.id].job;
    return out;
  });
  stale.forEach(fail);

  await browser.close();
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 60).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log(`A saved place follows its slide: ${maps.days.map(x => `Day ${x.n} ${x.was}→${x.now} slides`).join(', ')} (${maps.days.reduce((a, x) => a + x.gone, 0)} On the Job slides gone, ${maps.days.reduce((a, x) => a + x.kept, 0)} now Milestone Steps); every old position lands on its own lesson and never past the end; slide 40 of Day 1 (${s40.was}) opens on slide ${s40.want + 1}, after a reload and after an update too, and is moved once.`);
})().catch(e => { console.error(e); process.exit(1); });
