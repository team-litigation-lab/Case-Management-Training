// @check browser — Every Case Flow slide's text is bold and at least 16px on a laptop (after any fit-to-screen scaling), and a Skill Activity's slide shows at most 3 buttons
// The owner: practice slides as minimal as they can be, and no slide that overwhelms or strains the eye. CLAUDE.md: type
// on the slides is bold and at least 16px on a laptop. At 1366x768, as a trainer sees them (every day open, the trainer's
// ⚡ Inject drawn), every slide of every Case Flow day is walked, and with it each Skill Activity's Your Task turned into
// the 🤖 AI Grader (Submit), the grader's result once a grade comes back (after an attempt, and the final one with its
// answer key, as the trainee sees them) and a side exercise's document audit: every piece of text on the slide (in #lessonSlideWrap,
// shown: not inside a closed menu or a folded box) is at least 16px once the slide is scaled to fit and weighs 600 or
// more. A Trainer's deck page is a picture (no text to measure). On a Skill Activity's slide at most 3 buttons are in
// view (🚀 Launch and Submit →: the rest of its tools are in 📖 Reference, js/cm-task-card.js).
// Usage: node .github/scripts/slide-type.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const MIN_PX = 16, MIN_WEIGHT = 600, MAX_BUTTONS = 3;
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  const failures = [];
  page.on('pageerror', e => failures.push(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Slide', 'Type', 'B100926');
  const r = await page.evaluate(async ({ MIN_PX, MIN_WEIGHT, MAX_BUTTONS, ALL }) => {
    const sleep = ms => new Promise(r => setTimeout(r, ms));
    state.isAdmin = true; { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }
    { const st = document.createElement('style'); st.textContent = '*,*::before,*::after{animation:none !important;transition:none !important;}'; document.head.appendChild(st); }
    const zoomOf = el => { let z = 1; for (let n = el; n && n.style; n = n.parentElement) if (n.style.zoom) z *= Number(n.style.zoom) || 1; return z; };
    // shown: laid out, not hidden, not inside a closed <details> (its summary is shown), not clipped away as screen-reader text
    const shown = el => { if (!el.getClientRects().length) return false;
      for (let x = el; x && x !== document.body; x = x.parentElement) { const cs = getComputedStyle(x);
        if (cs.display === 'none' || cs.visibility === 'hidden' || +cs.opacity === 0 || x.getAttribute('aria-hidden') === 'true' || x.hidden) return false;
        if (x.tagName === 'DETAILS' && !x.open && !(el.closest('summary') && el.closest('summary').parentElement === x)) return false; }
      const r = el.getBoundingClientRect(); return r.width > 1 && r.height > 1; };
    const out = [], count = { slides: 0, modes: 0, texts: 0, acts: 0, results: 0 };
    const measure = (where, act) => {
      const wrap = document.getElementById('lessonSlideWrap'); if (!wrap) return;
      for (const el of wrap.querySelectorAll('*')) {
        if (el.closest('svg') || el.closest('.cm-lt-pop') || ![...el.childNodes].some(x => x.nodeType === 3 && x.textContent.trim()) || !shown(el)) continue;
        count.texts++;
        const cs = getComputedStyle(el), px = parseFloat(cs.fontSize) * zoomOf(el), w = parseInt(cs.fontWeight, 10), t = el.textContent.trim().replace(/\s+/g, ' ').slice(0, 40);
        const cls = ALL ? ` [${el.tagName.toLowerCase()}.${String(el.className || '').split(' ').join('.')}]` : '';   // SLIDE_TYPE_ALL=1: every one, with its class
        if (px < MIN_PX - 0.05) { out.push(`${where}: "${t}" is ${px.toFixed(1)}px (want ≥ ${MIN_PX}px)${cls}`); if (ALL) continue; break; }
        if (w < MIN_WEIGHT) { out.push(`${where}: "${t}" is weight ${w} (want bold, ≥ ${MIN_WEIGHT})${cls}`); if (ALL) continue; break; }
      }
      if (act) {
        const body = wrap.querySelector('.cfx-body') || wrap;
        const bs = [...body.querySelectorAll('button, a.btn, summary')].filter(shown);
        if (bs.length > MAX_BUTTONS) out.push(`${where}: ${bs.length} buttons in view (at most ${MAX_BUTTONS}): ${bs.map(b => b.textContent.trim().replace(/\s+/g, ' ').slice(0, 18)).join(' | ')}`);
      }
    };
    for (const d of DAYS) {
      if (!d.lessons || !d.lessons.some(l => l.cf)) continue;
      goto('day', d.id); state.dayViewMode = 'slides'; state.lessonSlide = 0; render(); await sleep(40);
      const slides = buildDaySlides(d);
      for (let i = 0; i < slides.length; i++) {
        const s = slides[i], l = s.type === 'topic' ? d.lessons[s.lessonIndex] : null, b = l && l.cf ? l.cf.block : null;
        const at = `Day ${d.id} slide ${i + 1} (${b ? b.id + ' ' + cmCaseFlow.viewsOf(b)[s.part - 1] : s.type})`;
        cmCaseFlow.clearModes(); state.lessonSlide = i; state.slidePage = 0; render(); await sleep(30);
        count.slides++; measure(at, b && b.kind === 'activity'); if (b && b.kind === 'activity') count.acts++;
        // a Skill Activity's Your Task: its Submit (the AI Grader) and a side exercise's audit open on the same slide
        if (b && b.kind === 'activity' && cmCaseFlow.viewsOf(b)[s.part - 1] === 'task') {
          const modes = ['check'].concat((window.CM_CF_EXHIBITS || {}).audits && CM_CF_EXHIBITS.audits[b.id] && !cmCaseFlow.viewsOf(b).includes('audit') ? ['audit'] : []);
          for (const m of modes) { cmCaseFlow.mode(b.id, m); await sleep(30); count.modes++; measure(`${at} → ${m}`, true); }
          // …and the AI Grader's result, once a grade comes back: as the trainee sees it after an attempt (the score, what went
          // well, what to work on, ↻ Check again and 🔑 I'm done), then the final one with the answer key beside it
          const G = window.CMAIGrader && CMAIGrader.all ? CMAIGrader.all() : null;
          if (G && G.blocks && !G.blocks[b.id]) {
            const long = 'a full sentence of feedback the grader writes about this file, as long as a real one usually runs';
            for (const [k, rec] of [['graded', { tries: 1 }], ['final', { tries: CMAIGrader.MAX_TRIES || 3, done: true }]]) {
              G.blocks[b.id] = Object.assign({ score: 72, tier: 'Developing', at: new Date().toISOString(), strengths: ['Strength: ' + long, 'Strength: ' + long],
                gaps: ['Gap: ' + long, 'Gap: ' + long], growth: ['Next: ' + long] }, rec);
              // the trainee's result (a trainer sees no ↻ / 🔑 buttons), on any day: every day open, every slide reached
              const was = state.isAdmin, du = window.dayUnlocked, mx = state.maxSlideReached; state.isAdmin = false; window.dayUnlocked = () => true; state.maxSlideReached = 9999;
              cmCaseFlow.clearModes(); cmCaseFlow.mode(b.id, 'check'); await sleep(30); count.modes++; count.results++;
              if (!document.querySelector(`#lessonSlideWrap [data-aig-result="${b.id}"]`)) out.push(`${at} → the AI Grader's ${k} result did not show`);
              measure(`${at} → AI Grader result (${k})`, true);
              state.isAdmin = was; window.dayUnlocked = du; state.maxSlideReached = mx; cmCaseFlow.clearModes();
            }
            delete G.blocks[b.id];
          }
          cmCaseFlow.clearModes();
        }
      }
    }
    return { out, count };
  }, { MIN_PX, MIN_WEIGHT, MAX_BUTTONS, ALL: !!process.env.SLIDE_TYPE_ALL });
  failures.push(...r.out);
  await browser.close();
  if (failures.length) { console.log(`${failures.length} problem(s):`); failures.slice(0, process.env.SLIDE_TYPE_ALL ? 2000 : 80).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log(`Slide type: ${r.count.slides} Case Flow slides and ${r.count.modes} AI Grader, grader result (${r.count.results}) and audit views at 1366x768, ${r.count.texts} pieces of text, every one bold and at least ${MIN_PX}px after fit-to-screen scaling; each of the ${r.count.acts} Skill Activity slides shows at most ${MAX_BUTTONS} buttons.`);
})();
