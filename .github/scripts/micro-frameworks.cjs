// @check browser — Micro-frameworks on the lessons (Milestone Steps, Rule vs. Exception, one CM Red Flag a slide with its owner; type ≥ 16px; no Trigger ➔ Task ➔ Tool ➔ Checkpoint cards or table and the word "Trigger" on no slide, title or 📖 Additional Reference; no Milestone Steps slide) and Why It Matters as the opening of The Theory
// The three micro-frameworks are on the slides: every lesson the revamp gives a Milestone Steps rail, a Rule vs.
// Exception callout or a CM Red Flag (build/case-flow/slides/dN.json: milestones, ruleEx, redFlag) draws it, on one of
// its own slides; no slide carries more than one Red Flag; every Red Flag names its owner; and the type on them stays
// bold and at least 16px on a laptop (1366x768), after any fit-to-screen scaling.
// The lessons' On the Job slide (rows of Trigger ➔ Task ➔ Tool ➔ Checkpoint cards) is gone: no lesson has that view
// and no slide of any day draws such a row; its table is gone from 📖 Additional Reference too, and the word "Trigger"
// is on no slide, in no slide title or heading (in any letter case) and in no 📖 Additional Reference panel of any day
// (a sentence may still say that a deadline or a coverage is triggered). So is the Milestone Steps slide 26 lessons had in its place: no lesson
// has that view either, and those lessons draw no rail (their steps are in the trainer's talking points for The
// Rules). A Milestone rail is drawn only on The Framework or The Rules, in the lessons SPEC gives one ("ms").
// Why It Matters is no slide of its own in a lesson that has The Theory: that slide opens with a "💡 Why it matters"
// line (the lesson's hook, or the copy's shorter whyLine where the hook would wrap: the full hook is then in the slide's
// talking points, which build/case-flow/scripts/assemble.cjs requires), above the theory's lead and every concept card,
// at full size on a laptop (no scaling, no type under 16px or lighter than bold, no card cut off, the line on one
// line). A lesson whose Theory carries its merged roadmap draws the roadmap's steps down the left and the theory beside
// them, to the same standard. The CM Red Flag that sat on Why It Matters is drawn once, at full size, on The Rules
// (under the points, or beside them in the picture's place), Do & Don't, The Theory, Continued or See It, with nothing
// beside it covered or cut off; where no slide of the lesson can take it at full size it is spoken, not drawn (SPOKEN
// below): no slide draws it and the trainer's talking points for The Rules carry a "Red flag" point. A lesson keeps
// its Why It Matters slide only where it has no Theory slide (a brief lesson); KEEPS, the list of lessons with a
// Theory slide that keep it, is empty, and a lesson that keeps the slide without being listed there fails.
// Usage: node .github/scripts/micro-frameworks.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
// the lessons the revamp specifies a framework for, by day (rf: CM Red Flag, rx: Rule vs. Exception, ms: a Milestone
// Steps rail, in the six lessons whose Framework or Rules slide holds one; the 26 that had a Milestone Steps slide of
// their own draw none now); Day 5's lessons are condensed: a Red Flag only
const SPEC = {
  'd1m1-role': 'rx rf', 'd1m1-upl': 'rx rf', 'd1m1-l1': 'rx rf', 'd1m4-l1': 'rx rf', 'd1m3-l1': 'rx rf',
  'd1m3-l2': 'rx rf', 'd1m2-l1': 'rx rf', 'd1m2-l2': 'ms rx rf',
  'd2m1-l2': 'rf', 'd2m1-cov': 'rx rf', 'd2m1-l1': 'rf', 'd2m1-afd': 'rf', 'd2m1-liab': 'rx rf', 'd2m1-first': 'ms rf',
  'd1m4-tplan': 'rf', 'd1m4-tmap': 'rx rf', 'd1m4-tcare': 'rx rf', 'd1m4-l2': 'rx rf', 'd2m2-l1': 'rf', 'd2m2-eob': 'rx rf',
  'd2m2-pip': 'rx rf', 'd1m4-emc': 'rx rf', 'd2m2-lop': 'rx rf', 'd2m2-cost': 'rx rf', 'd1m1-l2': 'ms rf', 'd2m2-sum': 'rf', 'd2m2-l2': 'rx rf',
  'd2m3-l1': 'rx rf', 'd2m3-l2': 'rx rf', 'd2m3-cause': 'rf', 'd2m4-l1': 'rx rf', 'd2m4-l2': 'rf', 'd3m1-l1': 'ms rx rf',
  'd3m1-l2': 'rf', 'd3m1-pkg': 'rf', 'd3m2-l1': 'rx rf', 'd3m2-umw': 'rx rf', 'd3m2-l2': 'rx rf',
  'd3m3-l1': 'rf rx', 'd3m3-l2': 'rx rf', 'd3m3-l3': 'ms rf', 'd3m4-l1': 'rx', 'd3m4-l2': 'rf', 'd3m4-close': 'rf',
  'd4m2-l1': 'rx rf', 'd4m2-um': 'rx rf', 'd4m2-l2': 'rx rf', 'd4m3-l1': 'rf', 'd4m3-l2': 'rx rf', 'd4m3-prior': 'rx', 'd4m3-tx': 'ms rf',
  'd4m1-l1': 'rf', 'd4m1-l2': 'rf', 'd5m1-l1': 'rf', 'd5m4-l2': 'rf', 'd5m3-l2': 'rf', 'd5m1-subp': 'rf', 'd5m2-l1': 'rf', 'd5m6-l1': 'rf'
};
// the lessons with a Theory slide that keep their Why It Matters slide, and why: none (a lesson not listed here must
// open The Theory with it; a lesson listed here that no longer needs the slide must come off the list)
const KEEPS = {};
// Red Flag spoken, not drawn: no slide of the lesson has room for it at full size on a laptop, so its text is in the
// trainer's talking points for The Rules. The copy says "spoken": true; the point must exist. Measured at 1366x768
// (the slide's card is 468px tall, the flag 126px) with the flag on each of the lesson's slides in turn: how far the
// slide then runs over (and the scale it would be shown at), how much taller its concept cards would need to be, or
// how much of the slide's own content the flag covers.
const SPOKEN = {
  'd1m1-role': 'The Rules (with Rule vs. Exception) runs over by 94px (0.8); The Framework by 109px (0.85); The Theory: each concept card 67px short; See It: the flag covers 28px of the board',
  'd1m4-tmap': 'The Rules (with Rule vs. Exception) runs over by 116px (0.8); The Theory: each concept card 67px short; the lesson has no other slide',
  'd1m4-tcare': 'The Rules (with Rule vs. Exception) runs over by 84px (0.85); The Roadmap by 15px (0.95); The Theory: each concept card 39px short',
  'd2m3-l1': 'The Rules (with Rule vs. Exception) runs over by 84px (0.85); The Theory (with its roadmap): the flag covers 88px of the cards; the lesson has no other slide',
  'd2m4-l1': 'The Rules (with Rule vs. Exception) runs over by 93px (0.85); The Framework by 125px (0.85); The Theory: each card 67px short; The Theory, Continued: 24px short; See It: the flag covers 51px of the table',
  'd3m2-l2': 'The Rules (with Rule vs. Exception) runs over by 75px (0.85); The Theory: each concept card 67px short; the lesson has no other slide',
  'd4m2-l1': 'The Rules (with Rule vs. Exception) runs over by 108px (0.85); The Theory: each concept card 39px short; The Document is scaled to 0.95 without it'
};
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const failures = [];
  page.on('pageerror', e => failures.push(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Micro', 'Frameworks', 'B100926');
  const r = await page.evaluate(async (SPEC) => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    state.isAdmin = true; { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }
    const seen = {}, out = [], count = { slides: 0, rails: 0, opens: 0, whySlides: 0, shortLines: 0, roads: 0, refs: 0 }, lessons = {}, spoken = {};
    const scripts = window.CM_CF_SCRIPTS || {};
    const plain = t => String(t || '').replace(/\*\*/g, '').replace(/\s+/g, ' ').trim();
    const zoomOf = el => { let z = 1; for (let n = el; n && n.style; n = n.parentElement) if (n.style.zoom) z *= Number(n.style.zoom) || 1; return z; };
    const near = (t, re) => { const m = re.exec(t); return m ? t.slice(Math.max(0, m.index - 30), m.index + 40).replace(/\s+/g, ' ') : ''; };
    const HEADS = 'h1, h2, h3, h4, h5, th, summary, .cfx-caption, .cfx-what-v, .cfx-modal-h b, .fp-label, .fp-title';
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
        // the word "Trigger" (the old framework's column, and the titles and headings that used it) is on no slide: not
        // in anything the slide holds, shown or folded away (the trainer's view, so the answers too), and in no letter
        // case in the slide's title or in a heading on it. An ordinary sentence may still say a deadline is triggered.
        { const tl = String(daySlideTitle(d, s) || ''), txt = wrap.textContent;
          if (/trigger/i.test(tl)) out.push(`Day ${d.id} slide ${i + 1}: its title uses the word "Trigger": ${tl}`);
          if (/Trigger/.test(txt)) out.push(`Day ${d.id} slide ${i + 1} (${tl}): shows "Trigger": …${near(txt, /Trigger/)}…`);
          const hd = [...wrap.querySelectorAll(HEADS)].find(x => /trigger/i.test(x.textContent));
          if (hd) out.push(`Day ${d.id} slide ${i + 1} (${tl}): a heading uses the word "trigger": ${hd.textContent.trim().slice(0, 90)}`); }
        if (s.type !== 'topic') continue;
        const b = d.lessons[s.lessonIndex].cf.block; if (b.kind !== 'lesson') continue;
        const where = `Day ${d.id} slide ${i + 1} (${b.id})`, view = cmCaseFlow.viewsOf(b)[s.part - 1];
        if (view === 'job' || view === 'steps' || !view) out.push(`${where}: ${view === 'job' ? 'an On the Job slide (the view is gone)' : view ? 'a Milestone Steps slide (the view is gone)' : 'a slide with no view'}`);
        // Why It Matters: the opening of The Theory, or a slide of its own (a lesson with no Theory slide, or one the check lists)
        const vs = cmCaseFlow.viewsOf(b), L = lessons[b.id] = lessons[b.id] || { theory: vs.includes('theory'), why: vs.includes('why'), opens: 0 };
        const cp = (window.CM_CF_SLIDES || {})[b.id] || {};
        if (cp.redFlag && cp.redFlag.spoken && !vs.includes('why')) spoken[b.id] = /^• Red flag\b/m.test(((scripts[b.id] || {}).rules || {}).say || '');
        if (view === 'why') count.whySlides++;
        if (view === 'why' && wrap.querySelector('.cfx-whyline')) out.push(`${where}: a Why It Matters slide that also draws the opening line of The Theory`);
        if (view !== 'theory' && wrap.querySelector('.cfx-whyline')) out.push(`${where}: the 💡 Why it matters line belongs on The Theory, not on ${view}`);
        if (view === 'theory' && !vs.includes('why')) {
          const band = wrap.querySelector('.cfx-whyline'), sheet = wrap.querySelector('.cfx-sheet'), copy = (window.CM_CF_SLIDES || {})[b.id] || {};
          if (!band) out.push(`${where}: The Theory doesn't open with its 💡 Why it matters line (and the lesson has no Why It Matters slide)`);
          else {
            L.opens++; count.opens++;
            if (!/why it matters/i.test((band.querySelector('.cfx-whyline-k') || {}).textContent || '')) out.push(`${where}: the opening line isn't labelled "Why it matters"`);
            const lineT = band.querySelector('.cfx-whyline-t'), wantLine = plain(copy.whyLine || copy.hook);
            if (plain((lineT || {}).textContent) !== wantLine) out.push(`${where}: the opening line should be the lesson's ${copy.whyLine ? 'whyLine' : 'hook'} ("${wantLine}"); it reads "${plain((lineT || {}).textContent)}"`);
            if (copy.whyLine) { count.shortLines++;   // a shorter line than the hook: the full hook is said on this slide (its talking points)
              if (!plain(((scripts[b.id] || {}).theory || {}).say).toLowerCase().includes(plain(copy.hook).replace(/\.$/, '').toLowerCase())) out.push(`${where}: the opening line is shorter than the hook, and the hook ("${plain(copy.hook)}") isn't in The Theory's talking points`); }
            if (lineT) { const rg = document.createRange(); rg.selectNodeContents(lineT); const rows = new Set([...rg.getClientRects()].map(r => Math.round(r.top / 4))).size;
              if (rows > 1) out.push(`${where}: the 💡 Why it matters line wraps onto ${rows} lines (one line: give the lesson a shorter whyLine)`); }
            // a merged roadmap: its steps down the left, none cut off
            const road = wrap.querySelector('.cfx-map-strip');
            if (road) { count.roads++;
              if (!wrap.querySelector('.cfx-th-road .cfx-th-cols')) out.push(`${where}: The Theory carries its roadmap and the opening line, but not the roadmap-beside-the-theory layout`);
              const rr = road.getBoundingClientRect(), n = (copy.roadmap || {}).steps ? copy.roadmap.steps.length : 0, lis = [...road.querySelectorAll(':scope > li')];
              if (lis.length !== n) out.push(`${where}: the roadmap shows ${lis.length} steps (want ${n})`);
              if (lis.some(li => li.getBoundingClientRect().bottom > rr.bottom + 1 || li.scrollWidth > li.clientWidth + 1) || road.scrollHeight > road.clientHeight + 1) out.push(`${where}: a step of the roadmap is cut off`); }
            const first = [...band.parentElement.children].find(c => c.getBoundingClientRect().height > 0);
            if (first !== band) out.push(`${where}: the 💡 Why it matters line should open the slide (it comes after ${first ? first.className : 'nothing'})`);
            if (!wrap.querySelector('.cfx-th-lead')) out.push(`${where}: The Theory lost its lead`);
            const cards = [...wrap.querySelectorAll('.cfx-th-c')], n = ((copy.theory || {}).concepts || []).length, want = n > 4 ? Math.ceil(n / 2) : n;
            if (cards.length !== want) out.push(`${where}: The Theory shows ${cards.length} concept cards (want ${want})`);
            // at full size on a laptop: nothing scaled, no type under 16px or lighter than bold, nothing cut off
            const scaled = [...wrap.querySelectorAll('[style*="zoom"]')].find(x => Number(x.style.zoom) < 1);
            if (scaled) out.push(`${where}: The Theory is scaled down to ${scaled.style.zoom} on a laptop (it should take its opening line at full size)`);
            for (const el of sheet.querySelectorAll('*')) {
              if (el.closest('svg') || !el.getClientRects().length || ![...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim())) continue;
              const cs = getComputedStyle(el), px = parseFloat(cs.fontSize) * zoomOf(el), w = parseInt(cs.fontWeight, 10);
              if (px < 15.95) { out.push(`${where}: on The Theory, "${el.textContent.trim().slice(0, 40)}" is ${px.toFixed(1)}px (want ≥ 16px)`); break; }
              if (w < 600) { out.push(`${where}: on The Theory, "${el.textContent.trim().slice(0, 40)}" is weight ${w} (want bold)`); break; }
            }
            const sb = sheet.getBoundingClientRect(), bb = band.getBoundingClientRect();
            if (bb.top < sb.top - 1 || bb.bottom > sb.bottom + 1 || bb.left < sb.left - 1 || bb.right > sb.right + 1 || band.scrollWidth > band.clientWidth + 1) out.push(`${where}: the 💡 Why it matters line is cut off`);
            cards.forEach(c => {   // a card keeps its own height: its title and text, with its padding, inside it and inside the slide
              const cs = getComputedStyle(c), kids = [...c.children].filter(k => !k.classList.contains('cfx-th-more'));
              const need = kids.reduce((a, k) => a + k.getBoundingClientRect().height, 0) + (kids.length - 1) * (parseFloat(cs.rowGap) || 0) + parseFloat(cs.paddingTop) + parseFloat(cs.paddingBottom);
              const r = c.getBoundingClientRect(), more = c.querySelector('.cfx-th-more'), title = c.querySelector(':scope > b');
              if (need > r.height + 1 || r.bottom > sb.bottom + 1) out.push(`${where}: the concept card "${(title || c).textContent.trim().slice(0, 30)}" is squeezed or cut off (${Math.round(need)}px of content in ${Math.round(r.height)}px)`);
              if (more && title) { const range = document.createRange(); range.selectNodeContents(title); const tr = range.getBoundingClientRect(), mr = more.getBoundingClientRect();
                if (tr.right > mr.left - 1 && tr.top < mr.bottom && tr.bottom > mr.top) out.push(`${where}: the card title "${title.textContent.trim().slice(0, 30)}" runs under its ＋ More button`); }
            });
          }
        }
        const rf = wrap.querySelectorAll('.cfx-rf'), rx = wrap.querySelectorAll('.cfx-rx'), ms = wrap.querySelectorAll('.cfx-ms');
        if (rf.length > 1) out.push(`${where}: ${rf.length} CM Red Flags on one slide (at most one)`);
        if (ms.length > 1) out.push(`${where}: ${ms.length} Milestone rails on one slide (one)`);
        const got = seen[b.id] = seen[b.id] || {};
        rf.forEach(x => {
          got.rf = (got.rf || 0) + 1; got.rfOn = view;
          // the Red Flag's slide: Why It Matters where the lesson keeps that slide; otherwise The Rules, Do & Don't, The Theory('s second slide) or See It, at full size
          if (vs.includes('why') ? view !== 'why' : !['rules', 'dodont', 'theory', 'theory2', 'model'].includes(view)) out.push(`${where}: the CM Red Flag is on ${view} (want ${vs.includes('why') ? 'Why It Matters, which this lesson keeps' : "The Rules, Do & Don't, The Theory or See It"})`);
          if (cp.redFlag && cp.redFlag.spoken && !vs.includes('why')) out.push(`${where}: the lesson's CM Red Flag is marked spoken, not drawn, and a slide draws it`);
          if (!vs.includes('why') && zoomOf(x) < 1) out.push(`${where}: the slide that took the CM Red Flag from Why It Matters (${view}) is scaled down to ${zoomOf(x)} on a laptop (it should hold it at full size)`);
          if (!vs.includes('why')) {   // and nothing on that slide is covered by the flag or pushed off the slide by it
            const rb = x.getBoundingClientRect(), sb = (wrap.querySelector('.cfx-sheet') || wrap).getBoundingClientRect();
            for (const el of (wrap.querySelector('.cfx-sheet') || wrap).querySelectorAll('*')) {
              // (the folded-away text of a closed In plain English box is not on the slide, so it cannot be pushed off it)
              if (x.contains(el) || el.contains(x) || el.closest('svg') || (el.closest('details:not([open])') && !el.closest('summary')) || !el.getClientRects().length || ![...el.childNodes].some(t => t.nodeType === 3 && t.textContent.trim())) continue;
              const r = el.getBoundingClientRect(), under = r.right > rb.left + 1 && r.left < rb.right - 1 ? Math.min(r.bottom, rb.bottom) - Math.max(r.top, rb.top) : 0;
              if (under > 4 || r.bottom > sb.bottom + 2) { out.push(`${where}: on ${view}, "${el.textContent.trim().slice(0, 30)}" is ${under > 4 ? 'covered by the CM Red Flag' : 'pushed off the slide'} (the slide has no room for the flag at full size)`); break; }
            }
          }
          const own = x.querySelector('.cfx-rf-own'), txt = own ? own.textContent.replace(/^Owner:\s*/, '').trim() : '';
          if (!txt) out.push(`${where}: a CM Red Flag with no owner`);
          if (x.getAttribute('role') !== 'note' || x.getAttribute('aria-label') !== 'CM Red Flag' || !x.querySelector('svg')) out.push(`${where}: the CM Red Flag needs role="note", its label and its flag icon`);
          if (x.querySelectorAll('dt').length !== 3) out.push(`${where}: the CM Red Flag wants You see / It costs / You do`);
        });
        rx.forEach(x => { got.rx = (got.rx || 0) + 1; if (!x.querySelector('.cfx-rx-rule p') || !x.querySelector('.cfx-rx-exc p') || !x.querySelector('.cfx-rx-conf')) out.push(`${where}: Rule vs. Exception wants a rule, an exception and a Confirm line`); });
        ms.forEach(x => { got.ms = (got.ms || 0) + 1; const n = x.querySelectorAll('ol > li').length; if (n < 3 || n > 6) out.push(`${where}: a Milestone rail of ${n} steps (3–6)`); });
        // a Milestone rail: on The Framework or The Rules only, and only in a lesson the spec gives one (never squeezed onto another slide)
        if (ms.length) {
          count.rails++;
          if (!['frame', 'rules'].includes(view)) out.push(`${where}: a Milestone rail on ${view} (The Framework or The Rules only)`);
          if (!/\bms\b/.test(SPEC[b.id] || '')) out.push(`${where}: draws a Milestone rail the spec doesn't give this lesson (the 26 lessons that had a Milestone Steps slide draw none)`);
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
      // 📖 Additional Reference of every lesson, activity and Knowledge Check of the day (the pop-up, as a trainer reads it:
      // the checkpoints open): no Trigger ➔ Task ➔ Tool ➔ Checkpoint section or table, and the word "Trigger" nowhere in it
      { const open = window.open; window.open = () => null;   // no new tab: the pop-up on this page
        try {
          d.lessons.forEach((l, li) => {
            cmCaseFlow.full(d.id, li);
            const m = document.querySelector('.cfx-ref, .cfx-modal'), id = l.cf.block.id;   // the panel over the slide (it was a pop-up)
            if (!m) { out.push(`${id}: 📖 Additional Reference did not open`); return; }
            const txt = m.textContent, hd = [...m.querySelectorAll(HEADS)].find(x => /trigger/i.test(x.textContent));
            if (/Trigger/.test(txt)) out.push(`${id}: 📖 Additional Reference shows "Trigger": …${near(txt, /Trigger/)}…`);
            if (hd) out.push(`${id}: a heading in 📖 Additional Reference uses the word "trigger": ${hd.textContent.trim().slice(0, 90)}`);
            if (/Verification checkpoint/i.test([...m.querySelectorAll('th')].map(x => x.textContent).join(' '))) out.push(`${id}: 📖 Additional Reference still draws the operational table`);
            count.refs++;
            if (cmCaseFlow.fullClose) cmCaseFlow.fullClose(); const x = m.querySelector('.cfx-modal-h button'); if (x) x.click(); if (m.isConnected) m.remove();
          });
        } finally { window.open = open; } }
    }
    return { seen, out, count, lessons, spoken };
  }, SPEC);
  failures.push(...r.out);
  // a lesson whose slides are the trainer's own Canva deck pages (js/cm-deck-slides.js) draws the deck, not these
  const deckLessons = new Set(Object.keys(await page.evaluate(() => window.CM_DECK_SLIDES || {})));
  // every lesson with a Theory slide opens it with why it matters, and has no Why It Matters slide, unless it is listed in KEEPS
  const merged = [], kept = [], briefs = [];
  for (const [id, L] of Object.entries(r.lessons)) {
    if (deckLessons.has(id)) continue;   // drawn from the trainer's deck pages: no Theory or Why It Matters slide of its own
    if (!L.theory) { briefs.push(id); if (!L.why) failures.push(`${id}: no Theory slide and no Why It Matters slide: its why it matters is nowhere`); if (KEEPS[id]) failures.push(`${id}: listed in KEEPS, but it has no Theory slide (it keeps Why It Matters anyway: take it off the list)`); continue; }
    if (L.why && !KEEPS[id]) failures.push(`${id}: has a Theory slide and still a Why It Matters slide (The Theory should open with it; or list the lesson in KEEPS with the reason)`);
    if (!L.why && KEEPS[id]) failures.push(`${id}: listed in KEEPS (${KEEPS[id]}), but its Why It Matters now opens The Theory: take it off the list`);
    if (!L.why && L.opens !== 1) failures.push(`${id}: The Theory should open with 💡 Why it matters once (drawn ${L.opens} times)`);
    (L.why ? kept : merged).push(id);
  }
  for (const id of Object.keys(KEEPS)) if (!r.lessons[id]) failures.push(`${id}: listed in KEEPS, and no such lesson is taught`);
  if (!merged.length) failures.push('no lesson opens The Theory with why it matters');
  if (kept.length) failures.push(`${kept.length} lesson(s) with a Theory slide keep a Why It Matters slide (${kept.join(', ')}): none should`);
  for (const [id, got] of Object.entries(r.seen)) if (got.rf > 1) failures.push(`${id}: its CM Red Flag is drawn on ${got.rf} slides (one)`);
  // Red Flag spoken, not drawn: the copy and the list agree, no slide draws it, and the talking point exists
  for (const id of Object.keys(SPOKEN)) {
    if (!(id in r.spoken)) failures.push(`${id}: listed as Red Flag spoken, not drawn, but its copy doesn't say "spoken": true (or it keeps a Why It Matters slide)`);
    else if (!r.spoken[id]) failures.push(`${id}: its CM Red Flag is spoken, not drawn, and the talking points for The Rules have no "Red flag" point`);
    if ((r.seen[id] || {}).rf) failures.push(`${id}: listed as Red Flag spoken, not drawn, and a slide draws it: take it off the list`);
    if (!/\brf\b/.test(SPEC[id] || '')) failures.push(`${id}: listed as Red Flag spoken, not drawn, but the spec gives it no Red Flag`);
  }
  for (const id of Object.keys(r.spoken)) if (!SPOKEN[id]) failures.push(`${id}: its copy says the CM Red Flag is spoken, not drawn; list it in SPOKEN with the measurements that forced it`);
  // a lesson the trainers' decks replaced (retired: out of the course, its rules a 💡 Tip, js/cm-lesson-tips.js) is on no slide
  const RETIRED = (() => { const sb = { window: {} }; require('vm').runInNewContext(require('fs').readFileSync(require('path').join(__dirname, '../../js/cm-case-flow-data.js'), 'utf8'), sb);
    return new Set(sb.window.CM_CASE_FLOW.days.flatMap(d => (d.modules || []).flatMap(m => m.blocks || [])).filter(b => b.retired).map(b => b.id)); })();
  let n = 0;
  for (const [id, want] of Object.entries(SPEC)) {
    if (deckLessons.has(id) || RETIRED.has(id)) continue;   // its micro-frameworks stay in 📖 Additional Reference; a retired lesson's are in its 💡 Tip
    const got = r.seen[id];
    if (!got) { failures.push(`${id}: not on any slide`); continue; }
    for (const k of want.split(' ')) { if (k === 'rf' && SPOKEN[id]) { n++; continue; }   // spoken, not drawn (checked above)
      if (!got[k]) failures.push(`${id}: its ${{ rf: 'CM Red Flag', rx: 'Rule vs. Exception', ms: 'Milestone Steps' }[k]} isn't drawn`); else n++; }
  }
  await browser.close();
  const railsWant = Object.entries(SPEC).filter(([id, v]) => /\bms\b/.test(v) && !RETIRED.has(id)).length;
  if (r.count.rails !== railsWant) failures.push(`${r.count.rails} Milestone rails are drawn; the spec gives ${railsWant} lessons one`);
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, 80).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  const homes = {}; Object.entries(r.seen).forEach(([id, g]) => { if (g.rfOn) homes[g.rfOn] = (homes[g.rfOn] || 0) + 1; });
  console.log(`Micro-frameworks: ${Object.keys(SPEC).length} lessons, ${n} frameworks (${Object.keys(SPOKEN).length} Red Flags spoken, not drawn: their point is in the talking points for The Rules; the rest drawn on their slides; ${r.count.rails} Milestone rails, on The Framework or The Rules; no lesson has a Milestone Steps slide), one Red Flag a slide at most, every Red Flag with its owner, type ≥ 16px and bold at 1366x768; none of the ${r.count.slides} slides draws a Trigger ➔ Task ➔ Tool ➔ Checkpoint row. Why It Matters: ${merged.length} lessons open The Theory with it (one line, at full size, no type under 16px, no card cut off; ${r.count.roads} with their roadmap beside the theory, ${r.count.shortLines} with a shorter line and the hook in the talking points) and have no such slide; ${kept.length} lessons with a Theory slide keep the slide and ${briefs.length} have no Theory slide; the Red Flag is drawn on ${Object.entries(homes).map(([v, k]) => `${v} ${k}`).join(', ')}; the word "Trigger" is on none of the ${r.count.slides} slides, in none of their titles or headings, and in none of the ${r.count.refs} 📖 Additional Reference panels`);
})();
