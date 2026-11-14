// @check browser — Every Case Flow day runs the daily loop: lessons → Case Profile (Day 1: Meet John Doe & Intake) → ONE Skill Building → Update Your Action Plan → optional side exercises → Knowledge Check
// The owner's standard flow (js/cm-day-loop.js, CF.sequence `main` in js/cm-case-flow-data.js), walked on all five days
// in a real browser:
//   · the deck runs the loop's steps in order and never goes back: the Training Agenda, ALL the lessons (Day 2's deck
//     pages with them), ONE Case Profile slide (Day 1: 👋 Meet John Doe; Days 2–5: 📇 Case Profile Check-In), the ONE
//     Skill Building (all of the day's `main` activity's slides, together, ending on the AI Grader; Day 5: the Full
//     Application Practice's two slides), ONE 📝 Update Your Action Plan slide, then the side exercises behind one
//     Practice Lab slide, then 🎯 Ready for the Knowledge Check? as the last slide;
//   · every activity that is not the day's Skill Building is a side exercise: "side": true in its copy, a situation that
//     opens with its assumption ("Assuming …"), two or three steps; its slides say OPTIONAL SIDE EXERCISE on their top
//     line, the Skill Building's say THE DAY'S SKILL BUILDING; the Practice Lab slide lists exactly the side exercises
//     and its ⏭ goes to the Ready check;
//   · the Skill Building's Your Task has 🚀 Launch CMS & Google Drive and its last slide submits to the AI Grader;
//   · the Case Profile slide's button opens the Case Profile (Day 1 on 👋 Meet John Doe, later on 📅 The Case So Far) and
//     the Action Plan slide's opens My Notes & Action Plan; "← Back to Case Flow Day N" returns to the slide;
//   · progressive autonomy: Day 1's Action Plan slide is numbered, step by step (at least five steps); each later day
//     has fewer prompts than Day 1 and never more than the day before;
//   · the Training Agenda shows the loop (Part 2 · 🔁 The Daily Loop: the Case Profile, the Skill Building, the Action
//     Plan, then the Knowledge Check) and the day fits its four hours (js/cm-case-flow-schedule.js);
//   · nothing on the loop's own slides is under 16px or scaled down at 1366×768.
// Usage: node .github/scripts/day-loop.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const failures = [], fail = m => failures.push(m);
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Day', 'Loop', 'B100926');
  await page.evaluate(() => { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); });

  // 1. the order of every day's deck, and what each loop slide draws
  const r = await page.evaluate(async () => {
    const out = [], days = [], sleep = ms => new Promise(res => setTimeout(res, ms)), norm = s => String(s || '').replace(/\s+/g, ' ').trim();
    if (!window.cmDayLoop) return { out: ['js/cm-day-loop.js is not loaded'], days };
    const CF = window.CM_CASE_FLOW, SL = window.CM_CF_SLIDES || {};
    const RANK = { 0: 0, 1: 1, 2: 2, 3: 3, 4: 4, side: 4.5, 5: 5 };
    for (const d of DAYS.filter(x => x.cf)) {
      state.isAdmin = true;
      const n = d.cf.n, L = `Day ${n}`, deck = buildDaySlides(d), seq = CF.sequence.find(s => s.n === n), main = seq.main || '';
      const steps = deck.map(sl => cmDayLoop.stepOf(d, sl));
      const label = (sl, k) => `${k + 1} ${sl.type === 'topic' ? d.lessons[sl.lessonIndex].cf.block.id + ':' + cmCaseFlow.viewsOf(d.lessons[sl.lessonIndex].cf.block)[sl.part - 1] : sl.type}`;
      if (deck[0].type !== 'taskOverview') out.push(`${L}: the deck should open with the Training Agenda (${deck[0].type})`);
      if (deck[deck.length - 1].type !== 'readyCheck') out.push(`${L}: the deck should end on the Ready check (${label(deck[deck.length - 1], deck.length - 1)})`);
      steps.forEach((s, k) => { if (k && RANK[s] < RANK[steps[k - 1]]) out.push(`${L}: slide ${label(deck[k], k)} (step ${s}) comes after a slide of step ${steps[k - 1]}: the loop never goes back`); });
      [1, 2, 3, 4, 5].forEach(s => { if (!steps.includes(s)) out.push(`${L}: no slide of step ${s} of the loop`); });
      const two = deck.filter((sl, k) => steps[k] === 2), want2 = n === 1 ? 'meetJohnDoe' : 'profileCheck';
      if (two.length !== 1 || two[0].type !== want2) out.push(`${L}: step 2 should be one ${want2} slide (${two.map(x => x.type).join(', ') || 'none'})`);
      if (deck.filter(sl => sl.type === 'actionPlan').length !== 1) out.push(`${L}: one Update Your Action Plan slide, not ${deck.filter(sl => sl.type === 'actionPlan').length}`);
      // the one Skill Building
      const sb = deck.map((sl, k) => [sl, k]).filter(([, k]) => steps[k] === 3);
      if (d.cf.build) {
        if (main) out.push(`${L}: a build day's Skill Building is its Full Application Practice; the sequence names main ${main}`);
        if (sb.map(([sl]) => sl.type).join(' ') !== 'companionBuild companionBuild2') out.push(`${L}: the Skill Building should be the Full Application Practice's two slides (${sb.map(([sl, k]) => label(sl, k)).join(', ')})`);
      } else {
        const li = d.lessons.findIndex(l => l.cf.block.id === main), b = li >= 0 && d.lessons[li].cf.block;
        if (!b || b.kind !== 'activity') out.push(`${L}: the sequence's main (${main}) is not an activity of the day`);
        else {
          const vs = cmCaseFlow.viewsOf(b), got = sb.map(([sl]) => sl.type === 'topic' && sl.lessonIndex === li ? vs[sl.part - 1] : sl.type);
          if (got.join(' ') !== vs.join(' ')) out.push(`${L}: the Skill Building should be all of ${main}'s slides, together (${got.join(' → ')}; its slides are ${vs.join(' → ')})`);
          if (vs[vs.length - 1] !== 'check') out.push(`${L}: ${main} should end on the AI Grader`);
          if (SL[main] && SL[main].side) out.push(`${L}: the Skill Building ${main} is marked a side exercise`);
        }
      }
      // the side exercises: every other activity, behind one Practice Lab slide
      const sideActs = d.lessons.filter(l => l.cf.block.kind === 'activity' && l.cf.block.id !== main);
      sideActs.forEach(l => { const c = SL[l.cf.block.id] || {};
        if (c.side !== true) out.push(`${L}: ${l.cf.block.id} is not the day's Skill Building, so it should be a side exercise ("side": true)`);
        if (!/^Assuming\b/.test(String(c.situation || ''))) out.push(`${L}: side exercise ${l.cf.block.id} should open with its assumption ("Assuming …")`);
        if (!(c.steps || []).length || c.steps.length > (c.ownerSteps ? 5 : 3)) out.push(`${L}: side exercise ${l.cf.block.id} has ${(c.steps || []).length} steps (want 2–3; the owner's own, ownerSteps, up to 5)`); });
      const heads = deck.filter((sl, k) => steps[k] === 'side' && sl.type !== 'topic');
      if (sideActs.length && heads.length !== 1) out.push(`${L}: the side exercises should sit behind one Practice Lab slide (${heads.length})`);
      const sideIds = [...new Set(deck.filter((sl, k) => steps[k] === 'side' && sl.type === 'topic').map(sl => d.lessons[sl.lessonIndex].cf.block.id))];
      if (sideIds.join(' ') !== sideActs.map(l => l.cf.block.id).join(' ')) out.push(`${L}: the side exercises' slides (${sideIds.join(', ')}) should be every other activity, in the sequence's order (${sideActs.map(l => l.cf.block.id).join(', ')})`);
      // the schedule
      const sc = cmCaseFlow.schedule(d);
      if (!sc.loop || !sc.fits) out.push(`${L}: the day's schedule should run the loop and fit four hours (loop ${sc.loop}, ${sc.total} minutes)`);
      if (sc.lessonMin > 66) out.push(`${L}: ${sc.lessonMin} minutes of lessons, over the 30%`);

      // what the slides draw
      state.isAdmin = false; state.slideProgress = state.slideProgress || {}; state.slideProgress[d.id] = deck.length;   // a trainee who has reached the whole day (Back returns to any slide of it)
      goto('day', d.id); if (state.view !== 'day') { out.push(`${L}: the day did not open`); continue; }
      state.dayViewMode = 'slides'; state.maxSlideReached = 9999;
      const show = async k => { state.lessonSlide = k; render(); await sleep(40); return document.getElementById('lessonSlideWrap'); };
      const tiny = w => [...w.querySelectorAll('.dl-slide *, .dl-side *')].filter(e => !e.children.length && e.textContent.trim() && e.offsetParent !== null && parseFloat(getComputedStyle(e).fontSize) < 16).map(e => e.textContent.trim().slice(0, 30));
      const zoomed = w => [...w.querySelectorAll('*')].some(e => e.style && e.style.zoom && Number(e.style.zoom) < 1);
      // the agenda
      let w = await show(0);
      const ag = [...w.querySelectorAll('.cfx-ag-label b')].map(e => norm(e.textContent)), agRows = [...w.querySelectorAll('.cfx-ag-lab b')].map(e => norm(e.textContent));
      if (ag.length !== 2 || !/Part 2 · 🔁 The Daily Loop/.test(ag[1])) out.push(`${L}: the Training Agenda should label Part 2 · 🔁 The Daily Loop (${JSON.stringify(ag)})`);
      if (agRows.length !== 3 || !/Case Profile|Meet John Doe/.test(agRows[0]) || !/Skill Building/.test(agRows[1]) || !/Action Plan/.test(agRows[2])) out.push(`${L}: the agenda's loop should read Case Profile, Skill Building, Action Plan (${JSON.stringify(agRows)})`);
      // step 2 and its way back
      const k2 = deck.findIndex(sl => sl.type === want2);
      if (k2 >= 0) {
        w = await show(k2);
        const btn = [...w.querySelectorAll('button')].find(b => /Open the Case Profile/.test(b.textContent));
        if (!btn) out.push(`${L}: the Case Profile slide has no "Open the Case Profile" button`);
        else {
          if (tiny(w).length) out.push(`${L}: type under 16px on the Case Profile slide: ${tiny(w).join(' | ')}`);
          if (zoomed(w)) out.push(`${L}: the Case Profile slide is scaled down at 1366×768`);
          btn.click(); await sleep(80);
          if (state.view !== 'clientprofile' || state.cfFileTab !== (n === 1 ? 'meet' : 'now')) out.push(`${L}: the Case Profile slide's button should open the Case Profile on ${n === 1 ? 'Meet John Doe' : 'The Case So Far'} (${state.view}, ${state.cfFileTab})`);
          const back = [...document.querySelectorAll('button')].find(b => /Back to Case Flow Day/.test(b.textContent) && !b.hidden && b.getClientRects().length > 0);
          if (!back) out.push(`${L}: the Case Profile has no "← Back to Case Flow Day ${n}"`); else { back.click(); await sleep(80); }
          if (state.view !== 'day' || state.lessonSlide !== k2) out.push(`${L}: Back from the Case Profile should return to slide ${k2 + 1} (${state.view} ${state.lessonSlide + 1})`);
          goto('day', d.id); state.dayViewMode = 'slides';
        }
      }
      // step 4
      const k4 = deck.findIndex(sl => sl.type === 'actionPlan'); let planSteps = 0, guided = false;
      if (k4 >= 0) {
        w = await show(k4);
        planSteps = w.querySelectorAll('.dl-plan > li').length; guided = !!w.querySelector('ol.dl-plan-guided');
        if (tiny(w).length) out.push(`${L}: type under 16px on the Action Plan slide: ${tiny(w).join(' | ')}`);
        if (zoomed(w)) out.push(`${L}: the Action Plan slide is scaled down at 1366×768`);
        const btn = [...w.querySelectorAll('button')].find(b => /Open my Action Plan/.test(b.textContent));
        if (!btn) out.push(`${L}: the Action Plan slide has no "📝 Open my Action Plan" button`);
        else {
          btn.click(); await sleep(80);
          if (state.view !== 'notes') out.push(`${L}: 📝 Open my Action Plan should open My Notes & Action Plan (${state.view})`);
          const back = [...document.querySelectorAll('button')].find(b => /Back to Case Flow Day/.test(b.textContent) && !b.hidden && b.getClientRects().length > 0);
          if (!back) out.push(`${L}: the Action Plan page has no "← Back to Case Flow Day ${n}"`); else { back.click(); await sleep(80); }
          if (state.view !== 'day' || state.lessonSlide !== k4) out.push(`${L}: Back from the Action Plan should return to slide ${k4 + 1} (${state.view} ${state.lessonSlide + 1})`);
          goto('day', d.id); state.dayViewMode = 'slides';
        }
      }
      // the Skill Building's top line, its Launch button and its AI Grader; a side exercise's top line
      const sbK = sb.length ? sb[0][1] : -1;
      if (!d.cf.build && sbK >= 0) {
        w = await show(sbK);
        if (!/THE DAY'S SKILL BUILDING/.test(norm((w.querySelector('.topic-separator') || {}).textContent))) out.push(`${L}: the Skill Building's top line should say THE DAY'S SKILL BUILDING`);
        if (!w.querySelector('[data-launch]')) out.push(`${L}: the Skill Building's Your Task has no 🚀 Launch CMS & Google Drive`);
        w = await show(sb[sb.length - 1][1]);
        if (!/Submit to AI Grader/.test(w.textContent)) out.push(`${L}: the Skill Building's last slide has no "Submit to AI Grader"`);
      }
      const sideK = deck.findIndex((sl, k) => steps[k] === 'side' && sl.type === 'topic');
      if (sideK >= 0) { w = await show(sideK); if (!/OPTIONAL SIDE EXERCISE/.test(norm((w.querySelector('.topic-separator') || {}).textContent))) out.push(`${L}: a side exercise's top line should say OPTIONAL SIDE EXERCISE`); }
      // the Practice Lab slide of side exercises, and its ⏭
      const kl = deck.findIndex((sl, k) => steps[k] === 'side' && sl.type !== 'topic');
      if (kl >= 0) {
        w = await show(kl);
        if (!d.cf.build) {
          const rows = w.querySelectorAll('.cfx-lab-list > li').length;
          if (rows !== sideActs.length) out.push(`${L}: the Practice Lab slide lists ${rows} side exercises; the day has ${sideActs.length}`);
          if (!/Optional/i.test(w.textContent)) out.push(`${L}: the Practice Lab slide should say the side exercises are optional`);
          if (tiny(w).length) out.push(`${L}: type under 16px on the Practice Lab slide: ${tiny(w).join(' | ')}`);
        }
        const skip = [...w.querySelectorAll('button')].find(b => /Ready for the Knowledge Check/.test(b.textContent));
        if (!skip) out.push(`${L}: the side exercises' slide has no ⏭ to the Ready check`);
        else { skip.click(); await sleep(60); if (state.lessonSlide !== deck.length - 1) out.push(`${L}: ⏭ should go to the Ready check (slide ${deck.length}); it went to ${state.lessonSlide + 1}`); }
      }
      days.push({ n, slides: deck.length, main: main || 'Full Application Practice', sides: sideActs.length, planSteps, guided,
        order: ['agenda', `${steps.filter(s => s === 1).length} lesson slides`, two.map(x => x.type).join(''), `${sb.length} Skill Building slides`, 'actionPlan', `${steps.filter(s => s === 'side').length} side slides`, 'readyCheck'].join(' → ') });
    }
    return { out, days };
  });
  r.out.forEach(fail);
  // progressive autonomy: Day 1 step by step; then fewer prompts, never more than the day before
  const ds = r.days.sort((a, b) => a.n - b.n);
  if (ds.length !== 5) fail(`${ds.length} Case Flow days found; the course has five`);
  if (ds[0] && (!ds[0].guided || ds[0].planSteps < 5)) fail(`Day 1's Action Plan slide should be numbered, step by step, at least five steps (${ds[0].planSteps}, numbered ${ds[0].guided})`);
  ds.slice(1).forEach((x, i) => { if (x.guided) fail(`Day ${x.n}'s Action Plan slide should not be the step-by-step one`); if (!(x.planSteps < ds[0].planSteps) || x.planSteps > ds[i].planSteps || !x.planSteps) fail(`Day ${x.n}'s Action Plan slide has ${x.planSteps} prompts: fewer than Day 1's and no more than the day before`); });
  await browser.close();
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 60).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  ds.forEach(x => console.log(`Day ${x.n}: ${x.order} (Skill Building: ${x.main}; ${x.sides} optional side exercises; Action Plan ${x.guided ? 'step by step, ' : ''}${x.planSteps} prompt${x.planSteps === 1 ? '' : 's'})`));
  console.log('Every day runs the loop: lessons → Case Profile → one Skill Building → Action Plan → optional side exercises → Knowledge Check.');
})().catch(e => { console.error(e); process.exit(1); });
