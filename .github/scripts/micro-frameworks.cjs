// @check browser — Micro-frameworks on the lessons (Milestone Steps, Rule vs. Exception, one CM Red Flag a slide with its owner; type ≥ 16px; no Trigger ➔ Task ➔ Tool ➔ Checkpoint cards)
// The three micro-frameworks are on the slides: every lesson the revamp gives a Milestone Steps rail, a Rule vs.
// Exception callout or a CM Red Flag (build/case-flow/slides/dN.json: milestones, ruleEx, redFlag) draws it, on one of
// its own slides; no slide carries more than one Red Flag; every Red Flag names its owner; and the type on them stays
// bold and at least 16px on a laptop (1366x768), after any fit-to-screen scaling.
// The lessons' On the Job slide (rows of Trigger ➔ Task ➔ Tool ➔ Checkpoint cards) is gone: no lesson has that view
// and no slide of any day draws such a row. Milestone Steps, which sat on it, is on The Framework, See It, The Theory
// or The Rules where that slide has room, and otherwise on a slide of its own (the copy's "slide": true): the rail
// alone, never scaled down on a laptop.
// Usage: node .github/scripts/micro-frameworks.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
// the lessons the revamp specifies a framework for, by day (rf: CM Red Flag, rx: Rule vs. Exception, ms: Milestone Steps);
// Day 5's lessons are condensed: a Red Flag only
const SPEC = {
  'd1m1-case': 'rf', 'd1m1-role': 'rx rf', 'd1m1-upl': 'rx ms rf', 'd1m1-l1': 'ms rx rf', 'd1m4-l1': 'rx rf', 'd1m3-l1': 'rx rf',
  'd1m3-l2': 'rx rf', 'd1m2-l1': 'ms rx rf', 'd1m2-l2': 'ms rx rf',
  'd2m1-l2': 'ms rf', 'd2m1-cov': 'ms rx rf', 'd2m1-l1': 'rf', 'd2m1-afd': 'ms rf', 'd2m1-liab': 'rx rf', 'd2m1-first': 'ms rf',
  'd1m4-tplan': 'ms rf', 'd1m4-tmap': 'ms rx rf', 'd1m4-tcare': 'ms rx rf', 'd1m4-l2': 'ms rx rf', 'd2m2-l1': 'rf', 'd2m2-eob': 'rx rf',
  'd2m2-pip': 'ms rx rf', 'd1m4-emc': 'rx ms rf', 'd2m2-lop': 'rx rf', 'd2m2-cost': 'rx rf', 'd1m1-l2': 'ms rf', 'd2m2-sum': 'rf', 'd2m2-l2': 'ms rx rf',
  'd2m3-l1': 'ms rx rf', 'd2m3-l2': 'rx rf', 'd2m3-cause': 'ms rf', 'd2m4-l1': 'ms rx rf', 'd2m4-l2': 'ms rf', 'd3m1-l1': 'ms rx rf',
  'd3m1-l2': 'ms rf', 'd3m1-pkg': 'rf', 'd3m2-l1': 'rx rf', 'd3m2-umw': 'ms rx rf', 'd3m2-l2': 'rx ms rf',
  'd3m3-l1': 'rf ms rx', 'd3m3-l2': 'rx ms rf', 'd3m3-l3': 'ms rf', 'd3m4-l1': 'rx', 'd3m4-l2': 'ms rf', 'd3m4-close': 'ms rf',
  'd4m2-l1': 'rx rf', 'd4m2-um': 'rx rf', 'd4m2-l2': 'rx ms rf', 'd4m3-l1': 'ms rf', 'd4m3-l2': 'rx rf', 'd4m3-prior': 'rx', 'd4m3-tx': 'ms rf',
  'd4m1-l1': 'rf', 'd4m1-l2': 'rf', 'd5m1-l1': 'rf', 'd5m4-l2': 'rf', 'd5m3-l2': 'rf', 'd5m1-subp': 'rf', 'd5m2-l1': 'rf', 'd5m6-l1': 'rf'
};
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const failures = [];
  page.on('pageerror', e => failures.push(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Micro', 'Frameworks', 'B100926');
  const r = await page.evaluate(async () => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    state.isAdmin = true; { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }
    const seen = {}, out = [], count = { slides: 0, steps: 0 };
    const zoomOf = el => { let z = 1; for (let n = el; n && n.style; n = n.parentElement) if (n.style.zoom) z *= Number(n.style.zoom) || 1; return z; };
    for (const d of DAYS) {
      if (!d.lessons || !d.lessons.some(l => l.cf)) continue;
      goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = 0; render(); await sleep(40);
      const slides = buildDaySlides(d);
      for (let i = 0; i < slides.length; i++) {
        const s = slides[i];
        state.lessonSlide = i; state.slidePage = 0; render(); await sleep(10);
        const wrap = document.getElementById('lessonSlideWrap'); if (!wrap) continue;
        // no slide of any day draws the Trigger ➔ Task ➔ Tool ➔ Checkpoint cards
        count.slides++;
        if (wrap.querySelector('.cfx-flow, .cfx-step, .cfx-job') || /Trigger\s*(➔|→|>)\s*(Case Manager )?Task/i.test(wrap.textContent)
          || [...wrap.querySelectorAll('small, th, dt, b')].filter(x => /^(Trigger|Checkpoint)$/i.test(x.textContent.trim())).length > 1) out.push(`Day ${d.id} slide ${i + 1} (${s.type}): draws a Trigger ➔ Task ➔ Tool ➔ Checkpoint row`);
        if (s.type !== 'topic') continue;
        const b = d.lessons[s.lessonIndex].cf.block; if (b.kind !== 'lesson') continue;
        const where = `Day ${d.id} slide ${i + 1} (${b.id})`, view = cmCaseFlow.viewsOf(b)[s.part - 1];
        if (view === 'job' || !view) out.push(`${where}: ${view ? 'an On the Job slide (the view is gone)' : 'a slide with no view'}`);
        const rf = wrap.querySelectorAll('.cfx-rf'), rx = wrap.querySelectorAll('.cfx-rx'), ms = wrap.querySelectorAll('.cfx-ms');
        if (rf.length > 1) out.push(`${where}: ${rf.length} CM Red Flags on one slide (at most one)`);
        if (ms.length > 1) out.push(`${where}: ${ms.length} Milestone rails on one slide (one)`);
        const got = seen[b.id] = seen[b.id] || {};
        rf.forEach(x => {
          got.rf = (got.rf || 0) + 1;
          const own = x.querySelector('.cfx-rf-own'), txt = own ? own.textContent.replace(/^Owner:\s*/, '').trim() : '';
          if (!txt) out.push(`${where}: a CM Red Flag with no owner`);
          if (x.getAttribute('role') !== 'note' || x.getAttribute('aria-label') !== 'CM Red Flag' || !x.querySelector('svg')) out.push(`${where}: the CM Red Flag needs role="note", its label and its flag icon`);
          if (x.querySelectorAll('dt').length !== 3) out.push(`${where}: the CM Red Flag wants You see / It costs / You do`);
        });
        rx.forEach(x => { got.rx = (got.rx || 0) + 1; if (!x.querySelector('.cfx-rx-rule p') || !x.querySelector('.cfx-rx-exc p') || !x.querySelector('.cfx-rx-conf')) out.push(`${where}: Rule vs. Exception wants a rule, an exception and a Confirm line`); });
        ms.forEach(x => { got.ms = (got.ms || 0) + 1; const n = x.querySelectorAll('ol > li').length; if (n < 3 || n > 6) out.push(`${where}: a Milestone rail of ${n} steps (3–6)`); });
        // Milestone Steps on a slide of its own: the rail and nothing else, at full size on a laptop, no step cut off
        if (view === 'steps') {
          count.steps++;
          if (ms.length !== 1) out.push(`${where}: a Milestone Steps slide with ${ms.length} rails (one)`);
          else {
            if (zoomOf(ms[0]) < 1) out.push(`${where}: the Milestone Steps slide is scaled down to ${zoomOf(ms[0])} on a laptop (it should fit at full size)`);
            if ([...ms[0].querySelectorAll('ol > li')].some(li => li.scrollHeight > li.clientHeight + 1 || li.scrollWidth > li.clientWidth + 1)) out.push(`${where}: a step of the Milestone Steps slide is cut off`);
            if (wrap.querySelector('.cfx-sheet') && [...wrap.querySelector('.cfx-sheet').children].some(c => !c.contains(ms[0]))) out.push(`${where}: the Milestone Steps slide carries something besides its rail`);
          }
        }
        // the type on them: bold, and at least 16px once the slide is scaled to fit
        for (const box of [...rf, ...rx, ...ms]) {
          for (const el of box.querySelectorAll('dd, p, b, .cfx-ms-done, dt, .cfx-ms-chip')) {
            if (!el.textContent.trim()) continue;
            const cs = getComputedStyle(el), px = parseFloat(cs.fontSize) * zoomOf(el), w = parseInt(cs.fontWeight, 10);
            if (px < 15.95) { out.push(`${where}: "${el.textContent.trim().slice(0, 40)}" is ${px.toFixed(1)}px (want ≥ 16px)`); break; }
            if (w < 600) { out.push(`${where}: "${el.textContent.trim().slice(0, 40)}" is weight ${w} (want bold)`); break; }
          }
          const rb = box.getBoundingClientRect(), wb = wrap.getBoundingClientRect();
          if (rb.bottom > wb.bottom + 1 || rb.right > wb.right + 1) out.push(`${where}: a micro-framework runs off the slide`);
        }
      }
    }
    return { seen, out, count };
  });
  failures.push(...r.out);
  let n = 0;
  // a lesson whose slides are the trainer's own Canva deck pages (js/cm-deck-slides.js) draws the deck, then its
  // Milestone Steps: its Rule vs. Exception and CM Red Flag stay in 📖 Additional Reference
  const deckLessons = new Set(Object.keys(await page.evaluate(() => window.CM_DECK_SLIDES || {})));
  for (const [id, all] of Object.entries(SPEC)) {
    const want = deckLessons.has(id) ? all.split(' ').filter(k => k === 'ms').join(' ') : all;
    if (!want) continue;
    const got = r.seen[id];
    if (!got) { failures.push(`${id}: not on any slide`); continue; }
    for (const k of want.split(' ')) { if (!got[k]) failures.push(`${id}: its ${{ rf: 'CM Red Flag', rx: 'Rule vs. Exception', ms: 'Milestone Steps' }[k]} isn't drawn`); else n++; }
  }
  await browser.close();
  if (!r.count.steps) failures.push('no lesson has a Milestone Steps slide (the copy marks them "slide": true)');
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 80).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log(`Micro-frameworks: ${Object.keys(SPEC).length} lessons, ${n} frameworks drawn on their slides (${r.count.steps} Milestone Steps on a slide of their own, at full size), one Red Flag a slide at most, every Red Flag with its owner, type ≥ 16px and bold at 1366x768; none of the ${r.count.slides} slides draws a Trigger ➔ Task ➔ Tool ➔ Checkpoint row`);
})();
