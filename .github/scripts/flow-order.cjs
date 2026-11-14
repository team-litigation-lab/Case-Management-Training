// @check browser — A day is all its lessons, then the daily loop (Case Profile, one Skill Building, Action Plan, one Practice Lab of optional side exercises), then the Knowledge Check; every block's slides in one fixed order; Next is always the next slide and the last slide's button opens the Knowledge Check
// The order nobody gets lost in (js/cm-case-flow.js buildDaySlides, CF.sequence in js/cm-case-flow-data.js). Checked on
// all five days, slide by slide, in a real browser:
//   · the deck opens with the Training Agenda and ends on 🎯 Ready for the Knowledge Check?;
//   · no lesson slide after the day's first practice slide (the daily loop's Case Profile slide, js/cm-day-loop.js: Day 1's
//     👋 Meet John Doe, later days' 📇 Case Profile Check-In), and no Skill Activity slide before it; exactly one Practice
//     Lab slide (the optional side exercises) on a day with a Skill Building (Day 5's are behind Optional Extra Practice);
//   · a block's slides sit together, in the one fixed order: a lesson is The Roadmap → The Theory → The Theory,
//     Continued → The Framework → The Document → The Rules → See It → Do & Don't (a lesson with no Theory slide opens
//     with Why It Matters instead); an activity is Your Task → Your Case → The Grade-A Standard → Audit → See It →
//     the AI Grader; and what each slide draws is that view of that block (its label and its block's title);
//   · a lesson drawn from the trainer's own deck pages (js/cm-deck-slides.js, window.CM_DECK_SLIDES) is a lesson like
//     any other, before the Practice Lab: its slides are its deck pages and nothing else, together, in the deck's
//     order (rising page numbers), each labelled with its page's title in the band and in the slide picker;
//   · the day's one Skill Building (CF.sequence `main`) comes first of the activities; the Practice Lab's opening slide
//     lists every other activity (the side exercises), in the deck's order, each with the lesson it practises
//     ("Practises: 2.3 Liability Investigation"); that lesson is taught before the practice; the side exercises follow
//     the order of the lessons' sections; and each activity's own first slide names its lesson the same way;
//   · Next, clicked on every slide as a trainee and again as a trainer, goes to the very next slide and nowhere else
//     (it used to open the Action Plan Editor after an activity drafted there); the last slide has no Next: its button
//     reads "Continue to Knowledge Check" and opens the Knowledge Check;
//   · in Presenter view the forward button does the same, and on the last slide it reads "Continue to Knowledge Check";
//   · an activity drafted in the Action Plan Editor has a plain 📝 Open the Action Plan Editor button on its Your Task;
//     it opens the editor, and Back returns to the slide the trainee left;
//   · Day 5's ⏭ on Optional Extra Practice goes to the Ready check (and says so);
//   · the two parts (Part 1 · Lessons, Part 2 · 🔁 The Daily Loop) are labelled on the Training Agenda, the Roadmap and
//     the slide picker.
// Usage: node .github/scripts/flow-order.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const LESSON = ['map', 'theory', 'theory2', 'frame', 'why', 'doc', 'rules', 'model', 'dodont'];
const ACTIVITY = ['task', 'case', 'grade', 'audit', 'model', 'check'];
const LABEL = { map: 'The Roadmap', theory: 'The Theory', theory2: 'The Theory, Continued', frame: 'The Framework', why: 'Why It Matters', doc: 'The Document', rules: 'The Rules', model: 'See It', dodont: "Do & Don't",
  task: 'Your Task', case: 'Your Case', grade: 'The Grade-A Standard', audit: 'Audit & the Finished Set', check: 'AI Grader' };
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const failures = [], fail = m => failures.push(m);
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Flow', 'Order', 'B100926');
  await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });

  // 1. the order of every day's deck, and of every block's slides
  const decks = await page.evaluate(async ({ LESSON, ACTIVITY, LABEL: LABELS }) => {
    const LABEL = LABELS;
    state.isAdmin = true;
    const out = [], days = [], norm = s => String(s || '').replace(/\s+/g, ' ').trim().toLowerCase();
    for (const d of DAYS.filter(x => x.cf)) {
      const n = d.cf.n, deck = buildDaySlides(d), L = `Day ${n}`;
      const at = deck.map(sl => { const l = sl.type === 'topic' ? d.lessons[sl.lessonIndex] : null, b = l && l.cf.block; return b ? { id: b.id, kind: b.kind, view: cmCaseFlow.viewsOf(b)[sl.part - 1], l, b, part: sl.part } : { type: sl.type }; });
      if (!at.length || at[0].type !== 'taskOverview') out.push(`${L}: the deck should open with the Training Agenda (it opens with ${at[0] ? at[0].type || at[0].id : 'nothing'})`);
      if (at[at.length - 1].type !== 'readyCheck') out.push(`${L}: the deck should end on 🎯 Ready for the Knowledge Check? (it ends on ${at[at.length - 1].type || at[at.length - 1].id + ' ' + at[at.length - 1].view})`);
      // the practice starts with the daily loop's Case Profile slide (js/cm-day-loop.js)
      const lab = at.findIndex(x => x.type === 'meetJohnDoe' || x.type === 'profileCheck');
      if (lab < 0) out.push(`${L}: no Case Profile slide after the lessons (the daily loop's step 2)`);
      if (at.filter(x => x.type === 'practiceLab').length !== (d.cf.build ? 0 : 1)) out.push(`${L}: ${at.filter(x => x.type === 'practiceLab').length} Practice Lab slides; a day has one, of its side exercises (a build day none: they are its Optional Extra Practice)`);
      at.forEach((x, k) => {
        if (x.kind === 'lesson' && lab >= 0 && k > lab) out.push(`${L} slide ${k + 1}: a lesson slide (${x.id} ${x.view}) after the day's first practice slide (slide ${lab + 1})`);
        if (x.kind === 'activity' && (lab < 0 || k < lab)) out.push(`${L} slide ${k + 1}: a Skill Activity slide (${x.id} ${x.view}) before the Practice Lab`);
        if (x.kind === 'check') out.push(`${L} slide ${k + 1}: a Learning Check (${x.id}) is a slide; it belongs to the day's Knowledge Check page`);
      });
      if (d.cf.build && at.findIndex(x => x.type === 'extraPractice') < at.findIndex(x => x.type === 'companionBuild2')) out.push(`${L}: the optional extra practice should follow the build`);
      // every block: its slides together, once, in the fixed order
      const runs = []; at.forEach((x, k) => { if (!x.id) return; const r = runs[runs.length - 1]; if (r && r.id === x.id && r.to === k - 1) { r.to = k; r.views.push(x.view); } else runs.push({ id: x.id, kind: x.kind, from: k, to: k, views: [x.view], b: x.b }); });
      const seen = {};
      runs.forEach(r => {
        if (seen[r.id]) out.push(`${L}: ${r.id}'s slides are split (slides ${seen[r.id].from + 1}–${seen[r.id].to + 1} and again from ${r.from + 1}): another slide sits inside the block`);
        seen[r.id] = r;
        const pages = r.kind === 'lesson' ? (window.CM_DECK_SLIDES || {})[r.id] : null;
        if (pages) {   // drawn from the trainer's deck: its pages, all of them, in the deck's order
          if (r.views.join(' ') !== pages.map(p => 'deck' + p.page).join(' ')) out.push(`${L}: ${r.id} is drawn from the deck and runs ${r.views.join(' → ')}; its deck pages are ${pages.map(p => 'deck' + p.page).join(' → ')}`);
          if (pages.some((p, i) => i && p.page <= pages[i - 1].page)) out.push(`${L}: ${r.id}'s deck pages are not in the deck's order (${pages.map(p => p.page).join(', ')})`);
          if (pages.some(p => !String(p.title || '').trim() || !p.img)) out.push(`${L}: ${r.id} has a deck page with no title (the band that names the slide) or no picture`);
          if (r.views.join(' ') !== cmCaseFlow.viewsOf(r.b).join(' ')) out.push(`${L}: ${r.id} shows ${r.views.join(' ')}; the block's slides are ${cmCaseFlow.viewsOf(r.b).join(' ')}`);
          return;
        }
        const order = r.kind === 'lesson' ? LESSON : ACTIVITY, pos = r.views.map(v => order.indexOf(v));
        if (pos.some(p => p < 0) || pos.some((p, i) => i && p <= pos[i - 1])) out.push(`${L}: ${r.id} (${r.kind}) runs ${r.views.join(' → ')}; the fixed order is ${order.join(' → ')}`);
        if (r.views.join(' ') !== cmCaseFlow.viewsOf(r.b).join(' ')) out.push(`${L}: ${r.id} shows ${r.views.join(' ')}; the block's slides are ${cmCaseFlow.viewsOf(r.b).join(' ')}`);
        if (r.kind === 'lesson') {
          if (r.views.includes('why') && r.views.includes('theory')) out.push(`${L}: ${r.id} has both The Theory and a Why It Matters slide`);
          if (r.views.includes('why') && r.views[r.views.includes('map') ? 1 : 0] !== 'why') out.push(`${L}: ${r.id}: Why It Matters should open a lesson with no Theory slide (${r.views.join(' → ')})`);
          if (r.views[r.views.length - 1] !== (r.views.includes('dodont') ? 'dodont' : r.views.includes('model') ? 'model' : 'rules')) out.push(`${L}: ${r.id} should end on The Rules, See It or Do & Don't (${r.views.join(' → ')})`);
        } else if (r.views[0] !== 'task' || r.views[1] !== 'case' || r.views[r.views.length - 1] !== 'check') out.push(`${L}: ${r.id} should run Your Task → Your Case → … → AI Grader (${r.views.join(' → ')})`);
      });
      d.lessons.forEach(l => { if (l.cf.block.kind !== 'check' && !seen[l.cf.block.id]) out.push(`${L}: ${l.cf.block.id} (${l.cf.block.kind}) has no slide in the deck`); });
      // the lessons in the order the sequence lists them, the activities too
      // (the activities: the day's one Skill Building first, then the side exercises in the sequence's order)
      const main = (CM_CASE_FLOW.sequence.find(s => s.n === n) || {}).main || '';
      const ord = kind => runs.filter(r => r.kind === kind).map(r => r.id).join(' '), seq = kind => d.lessons.filter(l => l.cf.block.kind === kind).map(l => l.cf.block.id).sort((a, b) => kind === 'activity' ? (b === main) - (a === main) : 0).join(' ');
      if (ord('lesson') !== seq('lesson')) out.push(`${L}: the lessons are not in the order the course teaches them`);
      if (ord('activity') !== seq('activity')) out.push(`${L}: the Skill Activities are not the day's Skill Building and then the side exercises in the sequence's order`);
      // what each slide draws: that view of that block
      goto('day', d.id); state.dayViewMode = 'slides'; render();
      for (let k = 0; k < deck.length; k++) {
        state.lessonSlide = k; render(); await new Promise(r => setTimeout(r, 4));
        const w = document.getElementById('lessonSlideWrap'), x = at[k];
        if (!w) { out.push(`${L} slide ${k + 1}: nothing drawn`); continue; }
        if (x.id) {
          const dp = x.kind === 'lesson' && ((window.CM_DECK_SLIDES || {})[x.id] || []).find(p => 'deck' + p.page === x.view), LABEL = dp ? Object.assign({}, LABELS, { [x.view]: dp.title }) : LABELS;
          if (dp && !w.querySelector('.cfx-deckpage img[src="' + dp.img + '"]')) out.push(`${L} slide ${k + 1} (${x.id} ${x.view}): the slide doesn't draw its deck page (${dp.img})`);
          if (dp && w.querySelectorAll('.cfx-title').length !== 1) out.push(`${L} slide ${k + 1} (${x.id} ${x.view}): a deck page should have one band that names it; it has ${w.querySelectorAll('.cfx-title').length}`);
          const pill = norm((w.querySelector('.cfx-title') || {}).textContent), text = norm(w.textContent);
          if (!pill.includes(norm(LABEL[x.view]))) out.push(`${L} slide ${k + 1} (${x.id} ${x.view}): the slide drawn is labelled "${pill}", not ${LABEL[x.view]}`);
          if (!text.includes(norm(x.b.title).slice(0, 40))) out.push(`${L} slide ${k + 1} (${x.id} ${x.view}): the slide drawn doesn't carry its block's title (${x.b.title})`);
          const title = String(daySlideTitle(d, deck[k]));
          if (!title.includes(LABEL[x.view]) || !title.includes(x.l.h)) out.push(`${L} slide ${k + 1}: its name in the slide picker is "${title}", not ${x.l.h} — ${LABEL[x.view]}`);
        }
      }
      // the Practice Lab's opening slide: every activity, in order, with the lesson it practises
      const acts = runs.filter(r => r.kind === 'activity'), lessonRuns = runs.filter(r => r.kind === 'lesson'), sideRuns = acts.filter(r => r.id !== main);
      const sectionOf = id => { let s = -1, prev = null, got = -1; d.lessons.forEach(l => { if (l.cf.block.kind !== 'lesson') return; if (l.cf.heading !== prev) { s++; prev = l.cf.heading; } if (l.cf.block.id === id) got = s; }); return got; };
      let far = -1;
      acts.forEach(r => { const l = d.lessons.find(x => x.cf.block.id === r.id), of = l.cf.of;
        if (!of || of.cf.block.kind !== 'lesson') return out.push(`${L}: ${r.id} names no lesson it practises`);
        const lr = lessonRuns.find(x => x.id === of.cf.block.id);
        if (!lr || lr.from > r.from) out.push(`${L}: ${r.id} practises ${of.cf.block.id}, which is not taught before it`);
        const s = sectionOf(of.cf.block.id); if (r.id !== main && s < far) out.push(`${L}: ${r.id} practises a lesson (${of.cf.block.id}) of a section taught before the lessons of the activity ahead of it: the lab follows the lessons' order`); if (r.id !== main) far = Math.max(far, s);
        // its own first slide says it
        state.lessonSlide = r.from; render();
        const line = norm((document.querySelector('#lessonSlideWrap .cfx-of') /* in the Practice Lab line; under the steps on a Backup File Maintenance task */ || {}).textContent), num = of.h.split(' ')[0];
        if (!line.startsWith('practises: ' + num + ' ') || !norm(of.cf.block.title).startsWith(line.slice(('practises: ' + num + ' ').length).slice(0, 12))) out.push(`${L}: ${r.id}'s Your Task should say "Practises: ${num} ${of.cf.block.title.slice(0, 30)}…"; it says "${line}"`);
      });
      const labAt = at.findIndex(x => x.type === 'practiceLab');
      if (!d.cf.build && labAt >= 0) {
        state.lessonSlide = labAt; render();
        const rows = [...document.querySelectorAll('#lessonSlideWrap .cfx-lab-list > li')].map(li => ({ t: norm((li.querySelector('.t') || {}).textContent), of: norm((li.querySelector('.of') || {}).textContent) }));
        if (rows.length !== sideRuns.length) out.push(`${L}: the Practice Lab slide lists ${rows.length} side exercises; the day has ${sideRuns.length}`);
        rows.forEach((row, i) => { const r = sideRuns[i]; if (!r) return; const l = d.lessons.find(x => x.cf.block.id === r.id), of = l.cf.of;
          if (!norm(r.b.title).startsWith(row.t.slice(0, 12))) out.push(`${L}: the Practice Lab's row ${i + 1} is "${row.t}"; the deck's activity ${i + 1} is ${r.b.title}`);
          if (of && !row.of.startsWith('practises: ' + of.h.split(' ')[0] + ' ')) out.push(`${L}: the Practice Lab's row ${i + 1} (${r.id}) should say "Practises: ${of.h.split(' ')[0]} …"; it says "${row.of}"`); });
        const z = [...document.querySelectorAll('#lessonSlideWrap *')].filter(e => e.style && e.style.zoom && Number(e.style.zoom) < 1).length;
        if (z) out.push(`${L}: the Practice Lab slide is scaled down to fit a 1366×768 screen`);
        const small = [...document.querySelectorAll('#lessonSlideWrap .cfx-lab-list *, #lessonSlideWrap .cfx-lab-tools *')].filter(e => !e.children.length && e.textContent.trim() && parseFloat(getComputedStyle(e).fontSize) < 16).length;
        if (small) out.push(`${L}: the Practice Lab slide has type under 16px`);
      }
      // the Training Agenda says the two parts
      state.lessonSlide = 0; render();
      const labels = [...document.querySelectorAll('#lessonSlideWrap .cfx-ag-label b')].map(e => norm(e.textContent));
      if (labels.length !== 2 || !/part 1.*lessons/.test(labels[0]) || !/part 2.*daily loop/.test(labels[1])) out.push(`${L}: the Training Agenda should label "Part 1 · Lessons" and "Part 2 · 🔁 The Daily Loop": ${JSON.stringify(labels)}`);
      days.push({ n, id: d.id, slides: deck.length, lessons: lessonRuns.length, lessonSlides: lessonRuns.reduce((a, r) => a + r.views.length, 0), acts: acts.length, actSlides: acts.reduce((a, r) => a + r.views.length, 0), lab,
        plan: acts.filter(r => /^\s*Action Plan Editor/i.test((r.b.act && r.b.act.tool) || '')).map(r => ({ id: r.id, from: r.from, to: r.to })) });
    }
    return { out, days };
  }, { LESSON, ACTIVITY, LABEL });
  decks.out.forEach(fail);
  if (decks.days.length !== 5) fail(`${decks.days.length} Case Flow days found; the course has five`);

  // 2. Next on every slide, as a trainee and as a trainer; the last slide's button
  for (const admin of [false, true]) {
    const who = admin ? 'trainer' : 'trainee';
    const r = await page.evaluate(async ({ admin }) => {
      state.isAdmin = admin; const out = [];
      // a trainee has every day open here: each is one they have started (js/cm-open-lessons.js: a day a trainee has started
      // is never locked again), set as each day is opened so the page's once-a-minute refresh cannot close it mid-run
      const started = d => { if (!admin) { state.slideProgress = state.slideProgress || {}; state.slideProgress[d.id] = Math.max(1, state.slideProgress[d.id] || 0); } };
      for (const d of DAYS.filter(x => x.cf)) {
        const total = buildDaySlides(d).length, L = `Day ${d.cf.n}`;
        started(d); goto('day', d.id);
        if (state.view !== 'day' || state.dayId !== d.id) { out.push(`${L}: the day did not open (${state.view})`); continue; } state.dayViewMode = 'slides'; state.maxSlideReached = 9999; render();
        for (let k = 0; k < total; k++) {
          state.dayViewMode = 'slides'; state.lessonSlide = k; state.slidePage = 0; render(); await new Promise(r => setTimeout(r, 3));
          const nav = document.querySelector('.slide-nav'), next = nav && nav.querySelector('button[onclick^="nextSlide"]'), kc = nav && nav.querySelector('button[onclick^="goToKnowledgeCheckWithInterstitial"]');
          if (k < total - 1) {
            if (!next || !/^Next/.test(next.textContent.trim())) { out.push(`${L} slide ${k + 1}: no Next button`); continue; }
            if (kc) out.push(`${L} slide ${k + 1}: a Continue to Knowledge Check button before the last slide`);
            for (let p = 0; p < 6 && state.lessonSlide === k && state.view === 'day'; p++) { next.click(); await new Promise(r => setTimeout(r, 2)); if ((state.slidePages || 1) <= 1) break; }
            if (state.view !== 'day' || state.dayId !== d.id || state.dayViewMode !== 'slides' || state.lessonSlide !== k + 1) { out.push(`${L} slide ${k + 1}: Next should open slide ${k + 2}; it went to ${state.view}${state.view === 'day' ? ' slide ' + (state.lessonSlide + 1) + ' (' + state.dayViewMode + ')' : ''}`); started(d); goto('day', d.id); state.dayViewMode = 'slides'; }
          } else {
            if (next) out.push(`${L}: the last slide still has a Next button`);
            if (!kc || !/^Continue to Knowledge Check/.test(kc.textContent.trim())) { out.push(`${L}: the last slide has no "Continue to Knowledge Check" button`); continue; }
            kc.click(); await new Promise(r => setTimeout(r, 30));
            if (state.view !== 'day' || state.dayId !== d.id || state.dayViewMode !== 'knowledgeCheck') out.push(`${L}: Continue to Knowledge Check should open the Knowledge Check; it went to ${state.view} (${state.dayViewMode})`);
          }
        }
      }
      return out;
    }, { admin });
    r.forEach(m => fail(`as a ${who}: ${m}`));
  }

  // 3. the Action Plan Editor is a plain button on the activity's Your Task; Back returns to the slide
  const plans = decks.days.flatMap(d => d.plan.map(p => Object.assign({ n: d.n, dayId: d.id }, p)));
  if (!plans.length) fail('no Skill Activity is drafted in the Action Plan Editor (the check wants one to stand on)');
  for (const p of plans) {
    const r = await page.evaluate(async (p) => {
      state.isAdmin = false; state.slideProgress = state.slideProgress || {}; state.slideProgress[p.dayId] = Math.max(1, state.slideProgress[p.dayId] || 0); goto('day', p.dayId);
      if (state.view !== 'day' || state.dayId !== p.dayId) return { err: 'the day did not open for the trainee' }; state.dayViewMode = 'slides'; state.maxSlideReached = 9999; state.lessonSlide = p.from; render(); await new Promise(r => setTimeout(r, 30));
      const btn = [...document.querySelectorAll('#lessonSlideWrap button')].find(b => /Open the Action Plan Editor/.test(b.textContent));
      if (!btn) return { err: 'its Your Task has no "📝 Open the Action Plan Editor" button' };
      btn.click(); await new Promise(r => setTimeout(r, 60));
      const there = state.view, back = [...document.querySelectorAll('button')].find(b => /Back to Case Flow Day/.test(b.textContent) && b.offsetParent !== null);
      const onward = [...document.querySelectorAll('button')].filter(b => /^Next:/.test(b.textContent.trim()) && b.offsetParent !== null).length;
      if (back) back.click(); await new Promise(r => setTimeout(r, 120));
      return { there, back: !!back, onward, view: state.view, slide: state.lessonSlide, mode: state.dayViewMode };
    }, p);
    if (r.err) { fail(`Day ${p.n} ${p.id}: ${r.err}`); continue; }
    if (r.there !== 'notes') fail(`Day ${p.n} ${p.id}: 📝 Open the Action Plan Editor should open the Notes & Action Plan page; it opened ${r.there}`);
    if (!r.back) fail(`Day ${p.n} ${p.id}: the Action Plan Editor has no "← Back to Case Flow Day ${p.n}" button`);
    if (r.onward) fail(`Day ${p.n} ${p.id}: the Action Plan Editor still has a "Next: …" button that carries on past the slide`);
    if (r.view !== 'day' || r.slide !== p.from || r.mode !== 'slides') fail(`Day ${p.n} ${p.id}: Back from the editor should return to the slide the trainee left (${p.from + 1}); it went to ${r.view} slide ${r.slide + 1} (${r.mode})`);
  }

  // 4. Day 5's ⏭ on Optional Extra Practice goes to the Ready check, and says so
  const skip = await page.evaluate(async () => {
    const d = DAYS.find(x => x.cf && x.cf.build); if (!d) return null;
    const deck = buildDaySlides(d), ex = deck.findIndex(x => x.type === 'extraPractice'), ready = deck.findIndex(x => x.type === 'readyCheck');
    state.isAdmin = false; state.slideProgress = state.slideProgress || {}; state.slideProgress[d.id] = Math.max(1, state.slideProgress[d.id] || 0); goto('day', d.id);
    if (state.view !== 'day' || state.dayId !== d.id) return { err: 'the day did not open for the trainee' }; state.dayViewMode = 'slides'; state.maxSlideReached = ex; state.lessonSlide = ex; render(); await new Promise(r => setTimeout(r, 30));
    const btn = document.querySelector('#lessonSlideWrap .cfx-ex-go button'); if (!btn) return { err: 'no ⏭ button on Optional Extra Practice' };
    const label = btn.textContent.trim(); btn.click(); await new Promise(r => setTimeout(r, 60));
    return { label, at: state.lessonSlide, ready, view: state.view, mode: state.dayViewMode, last: deck.length - 1, reached: state.maxSlideReached };
  });
  if (!skip) fail('no build day (Day 5) found');
  else if (skip.err) fail(`Day 5: ${skip.err}`);
  else {
    if (!/Ready for the Knowledge Check/.test(skip.label) || /Skip to the Knowledge Check/.test(skip.label)) fail(`Day 5: the ⏭ button on Optional Extra Practice should say it goes to the Ready check: "${skip.label}"`);
    if (skip.view !== 'day' || skip.mode !== 'slides' || skip.at !== skip.ready || skip.ready !== skip.last) fail(`Day 5: ⏭ should open the Ready check, the last slide (${skip.last + 1}); it opened ${skip.view} slide ${skip.at + 1} (${skip.mode})`);
    if (skip.reached < skip.ready) fail('Day 5: skipping the optional practice should count the Ready check as reached');
  }

  // 5. the two parts on the Roadmap and the slide picker
  const lists = await page.evaluate(async () => {
    state.isAdmin = true; const d = DAYS.find(x => x.cf && x.cf.n === 2); goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = 0; render();
    openRoadmap(); await new Promise(r => setTimeout(r, 80));
    const rm = [...document.querySelectorAll('#rmModal .rmx-day')].map(sec => { const lis = [...sec.querySelectorAll('.rmx-topics > li')];
      return lis.map((li, i) => li.classList.contains('rmx-part') ? 'P:' + li.textContent.replace(/\s+/g, ' ').trim() : (li.querySelector('.rmx-tt em') ? 'A' : 'L')).join('|'); });
    closeRoadmap();
    openSlideMap(); await new Promise(r => setTimeout(r, 80));
    const sm = [...document.querySelectorAll('#slideMap .sm-part')].map(e => e.textContent.replace(/\s+/g, ' ').trim());
    const firstLab = (() => { const p = document.querySelector('#slideMap .sm-part-lab'), sec = p && p.closest('section'); return sec ? sec.textContent.replace(/\s+/g, ' ') : ''; })();
    closeSlideMap();
    return { rm, sm, firstLab };
  });
  lists.rm.forEach((row, i) => {
    const parts = row.split('|'), p1 = parts.findIndex(x => /^P:Part 1/.test(x)), p2 = parts.findIndex(x => /^P:Part 2/.test(x));
    if (p1 !== 0) fail(`Roadmap, Day ${i + 1}: "Part 1 · Lessons" should head the day's topics`);
    if (p2 < 0) fail(`Roadmap, Day ${i + 1}: no "Part 2 · 🔁 The Daily Loop" label`);
    else if (parts.slice(p1 + 1, p2).some(x => x !== 'L') || parts[p2 + 1] !== 'A') fail(`Roadmap, Day ${i + 1}: "Part 2" should sit after the last lesson and before the first Skill Activity`);
  });
  if (lists.sm.length !== 3 || !/^Part 1.*Lessons/.test(lists.sm[0]) || !/^Part 2.*Daily Loop/.test(lists.sm[1]) || !/Knowledge Check/.test(lists.sm[2])) fail(`the slide picker of Day 2 should label Part 1 · Lessons, Part 2 · 🔁 The Daily Loop and the Knowledge Check: ${JSON.stringify(lists.sm)}`);
  if (!/Case Profile/.test(lists.firstLab)) fail('the slide picker\'s "Part 2 · 🔁 The Daily Loop" label should sit above the Case Profile slide, the loop\'s first');

  // 6. Presenter view: the forward button after an activity drafted in the editor, and on the last slide
  const pv = await page.evaluate(async (plans) => {
    state.isAdmin = true; const out = [], d2 = plans[0], sleep = ms => new Promise(r => setTimeout(r, ms));
    if (typeof presenterStart !== 'function') return ['Presenter view is not on the page'];
    goto('day', d2.dayId); state.dayViewMode = 'slides'; state.lessonSlide = d2.to; render();
    presenterStart(); await sleep(400);
    if (!state.presenting) return ['Presenter view did not start'];
    for (const p of plans) {
      if (p.dayId !== state.dayId) continue;
      presenterJump(p.to); await sleep(80); const btn = document.querySelector('button[onclick="presenterStep(1)"]');
      if (!btn || !/^Next/.test(btn.textContent.trim())) { out.push(`Presenter view, Day ${p.n} slide ${p.to + 1}: the forward button should read Next (${btn ? btn.textContent.trim() : 'none'})`); continue; }
      btn.click(); await sleep(60);
      if (!state.presenting || state.view !== 'day' || state.lessonSlide !== p.to + 1) out.push(`Presenter view, Day ${p.n}: Next on the last slide of ${p.id} should show slide ${p.to + 2}; it went to ${state.view} slide ${state.lessonSlide + 1}${state.presenting ? '' : ' and ended the presentation'}`);
    }
    if (state.presenting) {
      const d = DAYS.find(x => x.id === state.dayId), last = buildDaySlides(d).length - 1;
      presenterJump(last); await sleep(200); const btn = document.querySelector('button[onclick="presenterStep(1)"]');
      if (!btn || !/^Continue to Knowledge Check/.test(btn.textContent.trim())) out.push(`Presenter view: on the day's last slide the forward button should read "Continue to Knowledge Check →" (it reads "${btn ? btn.textContent.trim() : 'nothing'}")`);
      if (btn) { btn.click(); await sleep(300);
        if (state.presenting || state.view !== 'day' || state.dayViewMode !== 'knowledgeCheck') out.push(`Presenter view: the last slide's button should end the presentation and open the Knowledge Check (${state.view}, ${state.dayViewMode}, presenting ${state.presenting})`); }
      if (state.presenting && typeof presenterEnd === 'function') presenterEnd(true);
    }
    return out;
  }, plans.filter(p => p.n === (plans[0] || {}).n));
  pv.forEach(fail);

  await browser.close();
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 60).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log(`The order of the five days: ${decks.days.map(d => `Day ${d.n} ${d.lessons} lessons (${d.lessonSlides} slides) then ${d.acts} activities (${d.actSlides} slides) of ${d.slides}`).join('; ')}. No lesson after the first practice slide, no activity before it; every block's slides together in the fixed order; Next on every slide opens the next one for a trainee and a trainer (${decks.days.reduce((a, d) => a + d.slides - 1, 0)} clicks each) and the last slide's button opens the Knowledge Check, in Presenter view too; the ${plans.length} activities drafted in the Action Plan Editor open it from a button and come back to their slide.`);
})().catch(e => { console.error(e); process.exit(1); });
