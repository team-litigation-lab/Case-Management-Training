#!/usr/bin/env node
// Wrote js/cm-slide-keys7.js, once: layout 7's deck (the last numbered layout of js/cm-slide-places.js), day by day,
// as slide keys (js/cm-slide-keys.js keysOf), with what the older layouts' moves need to know of each block (its kind,
// whether it had operational steps, and a deck lesson's own drawn slides). It is a record of that deck: it is not
// rebuilt when the deck changes (that would move every legacy place onto the wrong slide), so this refuses to write
// over it. Kept for how the record was made.
// Usage: node build/slide-keys7.cjs http://localhost:8787/   (with .github/scripts/server.mjs running; needs playwright)
const fs = require('fs'), path = require('path');
const OUT = path.join(__dirname, '..', 'js', 'cm-slide-keys7.js');
if (fs.existsSync(OUT)) { console.error('js/cm-slide-keys7.js is a frozen record of layout 7\'s deck: it is never written again.'); process.exit(1); }
const { chromium } = require('playwright');
const signIn = require('../.github/scripts/sign-in.cjs');
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage();
  await page.goto(process.argv[2] || 'http://localhost:8787/', { waitUntil: 'load' });
  await signIn(page, 'Slide', 'Keys', 'B100926');
  const rec = await page.evaluate(() => {
    const days = {}, blocks = {};
    DAYS.filter(d => d.cf && Array.isArray(d.lessons)).forEach(d => {
      days[d.cf.n] = cmSlideKeys.keysOf(d);
      d.lessons.forEach(l => { const b = l.cf && l.cf.block; if (!b) return;
        const deck = (window.CM_DECK_SLIDES || {})[b.id] && cmCaseFlow.drawnViewsOf;
        blocks[b.id] = Object.assign({ kind: b.kind }, (b.ops || []).length ? { ops: 1 } : {}, deck ? { drawn: cmCaseFlow.drawnViewsOf(b) } : {}); });
    });
    return { days, blocks };
  });
  await browser.close();
  const lines = ['/* ============================================================',
    '   Layout 7\'s deck, frozen: a record, never edit it (nor write it again) to match a later deck.',
    '   The last numbered layout of js/cm-slide-places.js, day by day (by Case Flow day number), as the keys of its slides',
    '   (js/cm-slide-keys.js keysOf), and of each block what the moves from the older layouts need: its kind, whether it',
    '   had operational steps (ops), and a lesson drawn from the trainer\'s deck pages: its own drawn slides (drawn).',
    '   A place saved in an older layout is moved into this deck (js/cm-slide-places.js); a place saved in it without',
    '   keys is put on the same slide of today\'s deck by its key (js/cm-slide-keys.js from7). Recorded by',
    '   build/slide-keys7.cjs from the deck on main when places began to be saved by key.',
    '   ============================================================ */',
    'window.CM_SLIDE_KEYS7 = {',
    '  days: {',
    ...Object.entries(rec.days).map(([n, k], i, a) => `    ${n}: ${JSON.stringify(k)}${i < a.length - 1 ? ',' : ''}`),
    '  },',
    '  blocks: {',
    ...Object.entries(rec.blocks).map(([id, b], i, a) => `    ${JSON.stringify(id)}: ${JSON.stringify(b)}${i < a.length - 1 ? ',' : ''}`),
    '  }',
    '};', ''];
  fs.writeFileSync(OUT, lines.join('\n'));
  console.log(`wrote js/cm-slide-keys7.js: ${Object.values(rec.days).map(k => k.length).join(' + ')} slides, ${Object.keys(rec.blocks).length} blocks`);
})().catch(e => { console.error(e); process.exit(1); });
