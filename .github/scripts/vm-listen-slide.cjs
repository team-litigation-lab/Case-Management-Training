// @check browser — 🎧 Listen is on the slide of every activity worked from a voicemail (in 📂 Your Case, not only under 🧰 Tools), and it opens that voicemail's player
// After the one-slide activities (#304) a voicemail was only under 🧰 Tools → 🎧 Listen. Every activity whose event is a
// voicemail (CM_CF_SIM.events[id].channel "voicemail", spoken, with a Listening Check) now carries "🎧 Listen to the
// voicemail" in its Your Task's 📂 Your Case sentence (js/cm-case-flow.js), so the slide's bar keeps its three buttons
// (🚀 Launch and its one button: slide-type.cjs). At 1366×768, as a trainee: the link is visible, bold and at least
// 16px, reachable from the keyboard (tabindex 0, Enter), and opens the 🎧 Listening Check for that voicemail, with its player.
// No speech engine is needed (CI's Chromium has no voices): only that the player opens is checked, not that it speaks.
// Usage: node .github/scripts/vm-listen-slide.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Vm', 'Listen' + String(Date.now()).slice(-5).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
  // (an activity cut with the extra tasks keeps its event, out of the course's order: only the ones the course teaches)
  const ids = await page.evaluate(() => { const taught = new Set(CM_CASE_FLOW.sequence.flatMap(s => s.phases.flatMap(p => p.blocks)));
    return Object.entries((window.CM_CF_SIM || {}).events || {}).filter(([k, e]) => taught.has(k) && e && e.channel === 'voicemail' && e.spoken && e.listen && e.listen.length).map(([k]) => k); });
  if (!ids.length) fail('no voicemail activity found (CM_CF_SIM.events with channel "voicemail")');
  for (const id of ids) {
    const at = await page.evaluate((id) => { const d = DAYS.find(x => x.cf && x.lessons.some(l => l.cf && l.cf.block.id === id)); if (!d) return null;
      state.isAdmin = false; state.maxSlideReached = 9999; goto('day', d.id); state.dayViewMode = 'slides';
      const ss = buildDaySlides(d), k = ss.findIndex(s => s.type === 'topic' && d.lessons[s.lessonIndex].cf.block.id === id && cmCaseFlow.viewsOf(d.lessons[s.lessonIndex].cf.block)[(s.part || 1) - 1] === 'task');
      if (k < 0) return null; goToSlide(k); return d.cf.n; }, id);
    if (!at) { fail(`${id}: no Your Task slide`); continue; }
    await page.waitForTimeout(400);
    const s = await page.evaluate((id) => { const w = document.getElementById('lessonSlideWrap'), a = w && w.querySelector(`.cfx-yc [data-vm-listen="${id}"]`);
      if (!a) return null; const cs = getComputedStyle(a), r = a.getBoundingClientRect();
      const zoom = (el) => { let z = 1; for (let n = el; n && n.style; n = n.parentElement) if (n.style.zoom) z *= Number(n.style.zoom) || 1; return z; };
      return { text: a.textContent.trim(), px: parseFloat(cs.fontSize) * zoom(a), w: parseInt(cs.fontWeight, 10), seen: r.width > 0 && r.height > 0 && r.bottom <= innerHeight && r.top >= 0, tab: a.tabIndex, href: a.getAttribute('href') }; }, id);
    if (!s) { fail(`Day ${at} ${id}: its Your Task slide has no 🎧 Listen in 📂 Your Case`); continue; }
    if (!/🎧 Listen/.test(s.text)) fail(`${id}: the link should say 🎧 Listen (${s.text})`);
    if (!s.seen) fail(`${id}: 🎧 Listen is not in view on the slide at 1366×768`);
    if (s.px < 15.95 || s.w < 600) fail(`${id}: 🎧 Listen is ${s.px.toFixed(1)}px, weight ${s.w} (want bold, at least 16px)`);
    if (s.tab !== 0 || s.href === '#') fail(`${id}: 🎧 Listen should be reachable from the keyboard and not a "#" link (tabindex ${s.tab}, href ${s.href})`);
    await page.focus(`#lessonSlideWrap .cfx-yc [data-vm-listen="${id}"]`); await page.keyboard.press('Enter'); await page.waitForTimeout(400);
    const o = await page.evaluate((id) => { const b = document.getElementById('cf-vm'); return { open: !!b && !b.hidden && !!b.getClientRects().length, mine: !!(b && b.querySelector(`[data-vm="${id}"]`)), player: !!(b && b.querySelector('.vmp[role="group"]')) }; }, id);
    if (!o.open || !o.mine || !o.player) fail(`${id}: 🎧 Listen should open the Listening Check for this voicemail, with its player: ${JSON.stringify(o)}`);
    await page.evaluate(() => { if (window.cmCaseFlow && cmCaseFlow.listenClose) cmCaseFlow.listenClose(); });
  }
  await browser.close();
  if (failures.length) { console.log('✗ 🎧 Listen on the slide:\n  ' + failures.join('\n  ')); process.exit(1); }
  console.log(`🎧 Listen is on the slide of every voicemail activity (${ids.join(', ')}): in Your Case, bold and 16px+, keyboard-reachable, and it opens the voicemail's Listening Check.`);
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
