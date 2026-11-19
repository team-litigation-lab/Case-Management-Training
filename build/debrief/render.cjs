#!/usr/bin/env node
// Draws the Case Debrief deck (build/debrief/debrief.json) as slides in the course's look: LSH navy #1E2340 and orange
// #DB8437, bold League Spartan, the logo and the outlined title of the Case Flow slides. Each slide is laid out as a
// 1920×1080 page in Chromium (Playwright), shrunk to fit if it must (never below the layout's floor) and checked: a slide
// whose text still overflows, or runs off the page, stops the build. It writes
//   decks/debrief/NN.webp           each slide at 1600×900, like decks/dayN/NN.webp (served to the 🎬 Case Debrief tab)
//   build/debrief/out/debrief.pdf   one 1920×1080 page per slide: the --deck make_video.py records the narration over
//   build/debrief/out/png/NN.png    each slide at 1920×1080, to look at (build/debrief/out/ is not committed)
// Usage: node build/debrief/render.cjs                (every slide)
//        node build/debrief/render.cjs --only 9-13    (a few, to preview: the PDF is written only for the whole deck)
// The font is League Spartan from Google Fonts (the site's own, js/cm-font.js); without the network the build stops,
// unless --fallback-font draws it in Inter (a preview only: the deck changes look).
const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const ROOT = path.join(__dirname, '..', '..');
const SPEC = JSON.parse(fs.readFileSync(path.join(__dirname, 'debrief.json'), 'utf8'));
const DECK = path.join(ROOT, 'decks', 'debrief');
const OUT = path.join(__dirname, 'out');
const args = process.argv.slice(2);
const only = (() => { const i = args.indexOf('--only'); if (i < 0) return null; const [a, b] = String(args[i + 1] || '').split('-').map(Number); return [a, b || a]; })();
const FALLBACK = args.includes('--fallback-font');
const W = 1920, H = 1080, WEBP = [1600, 900];

const esc = (s) => String(s == null ? '' : s).replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);
// money in orange, so the trail reads at a glance (a figure is never split across lines)
const rich = (s) => esc(s).replace(/\$[\d,]+(?:\.\d\d)?(?:[–-]\$[\d,]+(?:\.\d\d)?)?/g, (m) => `<span class="amt">${m}</span>`);
const LOGO = fs.readFileSync(path.join(ROOT, 'logo.svg'), 'utf8').replace(/<title>[\s\S]*?<\/title>/, '').replace(/^<svg /, '<svg class="logo-svg" ');
const ORNAMENT = `<svg viewBox="0 0 240 240" fill="none" stroke-linecap="round"><path d="M30 34V204H200" stroke="#DB8437" stroke-width="4"/><path d="M14 74V160M74 226H160" stroke="#8E97C4" stroke-width="3"/><circle cx="30" cy="34" r="7" fill="#DB8437"/><circle cx="200" cy="204" r="5" fill="#8E97C4"/></svg>`;

const CSS = `
@page{size:${W}px ${H}px;margin:0;}
*{box-sizing:border-box;}
html,body{margin:0;padding:0;background:#1E2340;}
body{font-family:'League Spartan',${FALLBACK ? "'Inter'," : ''}sans-serif;-webkit-font-smoothing:antialiased;}
.slide{position:relative;width:${W}px;height:${H}px;overflow:hidden;display:flex;flex-direction:column;padding:48px 84px 0;color:#fff;
  background:radial-gradient(1200px 700px at 100% 0%,rgba(219,132,55,.16),rgba(219,132,55,0) 60%),radial-gradient(900px 600px at 0% 100%,rgba(142,151,196,.16),rgba(142,151,196,0) 60%),#1E2340;}
.deco{position:absolute;width:240px;height:240px;pointer-events:none;}
.deco.tr{top:-6px;right:-6px;transform:rotate(180deg);} .deco.bl{bottom:58px;left:-6px;}
.head{position:relative;display:flex;align-items:center;gap:36px;flex:none;padding-right:150px;}
.logo{flex:none;display:flex;align-items:center;justify-content:center;width:178px;height:118px;background:#fff;border-radius:20px;box-shadow:0 10px 26px rgba(0,0,0,.28);}
.logo-svg{width:150px;height:auto;display:block;}
.titles{min-width:0;flex:1 1 auto;}
.kicker{display:flex;align-items:center;gap:14px;font-weight:800;font-size:26px;letter-spacing:.16em;text-transform:uppercase;color:#F4B77A;margin:0 0 8px;}
.kicker::before{content:"";width:44px;height:6px;border-radius:3px;background:#DB8437;flex:none;}
h1{margin:0;font-weight:800;font-size:64px;line-height:1.08;color:#fff;letter-spacing:.005em;-webkit-text-stroke:7px #DB8437;paint-order:stroke fill;text-shadow:0 5px 0 rgba(0,0,0,.2);padding-left:4px;}
.rule{flex:none;height:5px;margin:26px 0 28px;border-radius:3px;background:linear-gradient(90deg,#DB8437 0 260px,rgba(255,255,255,.88) 260px);}
.body{position:relative;flex:1 1 auto;min-height:0;display:flex;flex-direction:column;justify-content:center;}
.fit{font-size:var(--fs,40px);font-weight:700;line-height:1.24;}
.amt{color:#F4B77A;white-space:nowrap;}
.foot{flex:none;height:76px;display:flex;align-items:center;justify-content:space-between;margin-top:22px;border-top:2px solid rgba(255,255,255,.14);
  font-weight:800;font-size:24px;letter-spacing:.14em;text-transform:uppercase;color:#AEB6CC;}
.pg{letter-spacing:.06em;color:#1E2340;background:#F4B77A;border-radius:999px;padding:6px 18px 4px;}

/* bullets: numbered rows */
.rows{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.42em;}
.rows li{display:flex;align-items:center;gap:.6em;padding:.36em .7em .32em .42em;border-radius:18px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.1);border-left:8px solid #DB8437;}
.num{flex:none;display:flex;align-items:center;justify-content:center;width:1.6em;height:1.6em;border-radius:50%;background:#DB8437;color:#fff;font-weight:800;font-size:.8em;padding-top:.08em;}
.tag{flex:none;font-weight:800;font-size:.72em;letter-spacing:.06em;color:#1E2340;background:#F4B77A;border-radius:10px;padding:.18em .45em .1em;}
.txt{min-width:0;}

/* trail: a timeline down the left */
.trail{list-style:none;margin:0 0 0 .3em;padding:0 0 0 1.5em;position:relative;display:flex;flex-direction:column;gap:.5em;}
.trail::before{content:"";position:absolute;left:.45em;top:.55em;bottom:.55em;width:8px;border-radius:4px;background:linear-gradient(#DB8437,#F4B77A);}
.trail li{position:relative;padding:.3em .7em .26em;border-radius:16px;background:rgba(255,255,255,.06);border:2px solid rgba(255,255,255,.1);}
.trail li::before{content:"";position:absolute;left:-1.36em;top:.42em;width:.78em;height:.78em;border-radius:50%;background:#fff;border:7px solid #DB8437;box-sizing:border-box;}
.when{display:inline-block;font-weight:800;color:#1E2340;background:#fff;border-radius:10px;padding:.08em .38em 0;margin-right:.35em;font-size:.86em;}

/* split: two cards, the second one white */
.split{display:grid;grid-template-columns:1fr 1fr;gap:44px;align-items:stretch;}
.card{border-radius:24px;padding:.75em .9em .8em;display:flex;flex-direction:column;}
.card.dark{background:rgba(255,255,255,.07);border:2px solid rgba(255,255,255,.18);}
.card.light{background:#fff;color:#1E2340;box-shadow:0 14px 34px rgba(0,0,0,.28);}
.card h2{margin:0 0 .5em;padding-bottom:.32em;font-weight:800;font-size:1.02em;line-height:1.15;border-bottom:5px solid #DB8437;}
.card.dark h2{color:#F4B77A;} .card.light h2{color:#1E2340;}
.card ul{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.48em;}
.card li{position:relative;padding-left:1.05em;}
.card li::before{content:"";position:absolute;left:0;top:.36em;width:.5em;height:.5em;border-radius:4px;background:#DB8437;}
.card.light .amt{color:#B4561A;}

/* the Litigation note (js/cm-litigation-note.js's words), under a slide's body */
.lnote{display:flex;align-items:flex-start;gap:.55em;margin-top:.85em;padding:.55em .8em .5em .6em;border-radius:20px;font-size:.8em;line-height:1.26;
  background:rgba(219,132,55,.13);border:2px solid rgba(219,132,55,.6);border-left:10px solid #DB8437;}
.lnote-i{flex:none;font-size:1.3em;line-height:1;margin-top:.02em;}
.lnote b{font-weight:800;color:#F4B77A;}

/* table: a white sheet */
.sheet{background:#fff;border-radius:24px;overflow:hidden;box-shadow:0 14px 34px rgba(0,0,0,.3);}
table{width:100%;border-collapse:collapse;color:#1E2340;}
th{background:#262B45;color:#fff;font-weight:800;font-size:.74em;letter-spacing:.08em;text-transform:uppercase;text-align:left;padding:.62em .7em .52em;border-bottom:6px solid #DB8437;}
td{padding:.42em .7em .34em;font-weight:700;border-top:2px solid #E3E6EF;vertical-align:middle;}
tr:nth-child(even) td{background:#F4F6FA;}
td:first-child{font-weight:800;}
th.n,td.n{text-align:right;font-variant-numeric:tabular-nums;white-space:nowrap;padding-left:1.3em;}
th.n + th:not(.n),td.n + td:not(.n){padding-left:1.3em;}
tr.total td{background:#FFF1E2 !important;font-weight:800;border-top:4px solid #1E2340;}
tr.total td:first-child{box-shadow:inset 10px 0 0 #DB8437;}
.box{display:inline-block;width:.78em;height:.78em;border:5px solid #1E2340;border-radius:6px;margin-right:.45em;vertical-align:-.08em;}
.sheet .amt{color:inherit;}

/* title: the debrief's opening and closing */
.L-title .head{padding-right:0;}
.hero{display:flex;flex-direction:column;align-items:center;text-align:center;gap:.5em;}
.hero h1{font-size:100px;line-height:1.04;-webkit-text-stroke:9px #DB8437;}
.hero .sub{font-weight:800;font-size:54px;color:#F4B77A;letter-spacing:.02em;margin-top:-.1em;}
.hero .kick{font-weight:800;font-size:28px;letter-spacing:.2em;text-transform:uppercase;color:#fff;border:3px solid #DB8437;border-radius:999px;padding:.32em 1em .22em;}
.cards{display:grid;grid-template-columns:repeat(3,1fr);gap:36px;margin-top:.9em;width:100%;}
.cards div{position:relative;background:#fff;color:#1E2340;border-radius:22px;padding:1.2em .8em .9em;font-weight:800;line-height:1.2;box-shadow:0 14px 30px rgba(0,0,0,.3);border-top:10px solid #DB8437;}
.cards .num{position:absolute;top:-.95em;left:50%;transform:translateX(-50%);border:6px solid #1E2340;width:1.9em;height:1.9em;}
`;

function head(s) {
  return `<header class="head"><div class="logo">${LOGO}</div>${s.layout === 'title' ? '' : `<div class="titles"><div class="kicker">${esc(s.kicker)}</div><h1>${esc(s.title)}</h1></div>`}</header>`;
}
function bodyOf(s) {
  const L = s.layout;
  if (L === 'title') {
    const [a, ...b] = String(s.title).split(': '), rest = b.join(': ');
    const main = rest && a.toLowerCase() === String(s.kicker).toLowerCase() ? rest : a, sub = rest && main === a ? rest : '';
    return { fs: 38, min: 30, html: `<div class="hero"><div class="kick">${esc(s.kicker)}</div><h1>${esc(main)}</h1>${sub ? `<div class="sub">${esc(sub)}</div>` : ''}
      <div class="cards">${s.bullets.map((x, i) => `<div><span class="num">${i + 1}</span>${rich(x)}</div>`).join('')}</div></div>` };
  }
  if (L === 'bullets') return { fs: 40, min: 30, html: `<ol class="rows">${s.bullets.map((x, i) => { const m = /^(RS\d+):\s*/.exec(x);
    const rest = m ? x.slice(m[0].length) : x, txt = m ? rest.charAt(0).toUpperCase() + rest.slice(1) : rest;   // "RS33" as a tag, the sentence after it
    return `<li><span class="num">${i + 1}</span>${m ? `<span class="tag">${m[1]}</span>` : ''}<span class="txt">${rich(txt)}</span></li>`; }).join('')}</ol>` };
  if (L === 'trail') return { fs: 40, min: 30, html: `<ol class="trail">${s.bullets.map((x) => { const m = /^(\d\d\/\d\d\/\d{4}):\s*/.exec(x);
    return `<li>${m ? `<span class="when">${m[1]}</span>` : ''}${rich(m ? x.slice(m[0].length) : x)}</li>`; }).join('')}</ol>` };
  if (L === 'split') return { fs: 36, min: 28, html: `<div class="split">${[['dark', s.left], ['light', s.right]].map(([k, c]) =>
    `<section class="card ${k}"><h2>${esc(c.heading)}</h2><ul>${c.bullets.map((x) => `<li>${rich(x)}</li>`).join('')}</ul></section>`).join('')}</div>` };
  if (L === 'table') {
    const t = s.table, num = (v) => /^[−-]?\$[\d,]+(?:\.\d\d)?$|^\d+%$|^—$/.test(String(v).trim());   // a figure, alone in its cell
    // a column of figures (most of its cells) is right-aligned, a word in it too ("Narrative")
    const cols = t.head.map((_, j) => { const v = t.rows.map((r) => String(r[j] || '').trim()).filter(Boolean); return j > 0 && v.filter(num).length * 2 > v.length; });
    const TOTAL = /^(Gross recovery|Total Specials|Paid and owed|Net to John Doe)$/;
    const check = t.head[0] === 'Check';
    return { fs: 34, min: 26, html: `<div class="sheet"><table><thead><tr>${t.head.map((h, j) => `<th${cols[j] ? ' class="n"' : ''}>${esc(h)}</th>`).join('')}</tr></thead>
      <tbody>${t.rows.map((r) => `<tr${TOTAL.test(r[0]) ? ' class="total"' : ''}>${r.map((c, j) => `<td${cols[j] ? ' class="n"' : ''}>${j === 0 && check ? '<span class="box"></span>' : ''}${rich(c)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` };
  }
  throw new Error(`slide ${s.page}: unknown layout "${L}"`);
}
// a slide's "note": the Litigation note, word for word, as the site shows it (Note:, Litigation and Pre-Litigation stand out)
const noteBox = (s) => s.note ? `<div class="lnote"><span class="lnote-i">⚖️</span><span>${esc(s.note).replace(/^Note:/, '<b>Note:</b>').replace(/\b(Pre-Litigation|Litigation)\b/g, '<b>$1</b>')}</span></div>` : '';
function slideHtml(s, n) {
  const b = bodyOf(s);
  return { fs: b.fs, min: b.min, html: `<div class="slide L-${s.layout}"><div class="deco tr">${ORNAMENT}</div><div class="deco bl">${ORNAMENT}</div>${head(s)}<div class="rule"></div>
    <main class="body"><div class="fit" style="--fs:${b.fs}px">${b.html}${noteBox(s)}</div></main>
    <footer class="foot"><span>Case Debrief · John Doe VS Robert Smith</span><span class="pg">${String(s.page).padStart(2, '0')} / ${String(n).padStart(2, '0')}</span></footer></div>` };
}

// in the page: shrink the body's type until it fits (never below its floor), the title until it takes two lines at most,
// then report anything that still overflows or leaves the slide
function fitAndMeasure([fs0, min]) {
  const slide = document.querySelector('.slide'), body = slide.querySelector('.body'), fit = slide.querySelector('.fit'), h1 = slide.querySelector('.titles h1');
  const over = () => fit.scrollHeight > body.clientHeight + 1 || fit.scrollWidth > body.clientWidth + 1 || fit.getBoundingClientRect().height > body.clientHeight + 1;
  if (h1) { let t = 64; h1.style.fontSize = t + 'px';
    const lines = () => Math.round(h1.getBoundingClientRect().height / (parseFloat(getComputedStyle(h1).lineHeight) || t * 1.08));
    while ((lines() > 2 || h1.scrollWidth > h1.clientWidth + 1) && t > 46) { t -= 2; h1.style.fontSize = t + 'px'; } }
  let f = fs0; fit.style.setProperty('--fs', f + 'px');
  while (over() && f > min) { f -= 1; fit.style.setProperty('--fs', f + 'px'); }
  const problems = [];
  if (over()) problems.push(`the body overflows at its smallest type (${f}px): ${fit.scrollHeight} > ${body.clientHeight}`);
  const sr = slide.getBoundingClientRect();
  for (const el of slide.querySelectorAll('h1,h2,li,td,th,.cards div,.sub,.kick,.kicker,.lnote,.foot span')) {
    const r = el.getBoundingClientRect();
    if (r.width && (r.left < sr.left - 1 || r.right > sr.right + 1 || r.top < sr.top - 1 || r.bottom > sr.bottom + 1)) problems.push(`"${el.textContent.trim().slice(0, 40)}" runs off the slide`);
    if (el.scrollWidth > el.clientWidth + 2 && getComputedStyle(el).overflow !== 'visible') problems.push(`"${el.textContent.trim().slice(0, 40)}" is cut off`);
  }
  if (h1 && Math.round(h1.getBoundingClientRect().height / parseFloat(getComputedStyle(h1).lineHeight)) > 2) problems.push('the title takes more than two lines');
  const small = [...slide.querySelectorAll('.fit *')].filter((e) => e.childNodes.length && [...e.childNodes].some((c) => c.nodeType === 3 && c.textContent.trim()))
    .map((e) => parseFloat(getComputedStyle(e).fontSize)).reduce((a, x) => Math.min(a, x), 999);
  return { fs: f, title: h1 ? parseFloat(h1.style.fontSize) : null, smallest: small, problems };
}

(async () => {
  const slides = SPEC.slides.filter((s) => !only || (s.page >= only[0] && s.page <= only[1]));
  if (!slides.length) throw new Error('no slides to draw');
  fs.mkdirSync(DECK, { recursive: true }); fs.mkdirSync(path.join(OUT, 'png'), { recursive: true });
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: W, height: H } });
  await page.setContent(`<!doctype html><html><head><meta charset="utf-8"><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=League+Spartan:wght@600;700;800;900&display=block"><style>${CSS}</style></head><body></body></html>`, { waitUntil: 'load' }).catch(() => {});
  const fontOk = await page.evaluate(async () => { try { await document.fonts.load('800 64px "League Spartan"'); await document.fonts.load('700 40px "League Spartan"'); } catch (e) {} return document.fonts.check('800 64px "League Spartan"'); });
  if (!fontOk && !FALLBACK) throw new Error('League Spartan did not load from Google Fonts (no network?): run again online, or with --fallback-font for a preview in Inter');
  const conv = await browser.newPage();
  const pngs = [];
  let failed = 0;
  for (const s of slides) {
    const { fs: fs0, min, html } = slideHtml(s, SPEC.slides.length);
    await page.evaluate((h) => { document.body.innerHTML = h; }, html);
    await page.evaluate(() => document.fonts.ready);
    const m = await page.evaluate(fitAndMeasure, [fs0, min]);
    const nn = String(s.page).padStart(2, '0');
    if (m.problems.length) { failed++; console.log(`✗ ${nn} ${s.title}\n    ${m.problems.join('\n    ')}`); }
    else console.log(`✓ ${nn} ${s.title}  (type ${m.fs}px, title ${m.title || 100}px, smallest ${m.smallest}px)`);
    // let the text settle before the picture (taken at once, a re-fitted slide's glyphs can still be rasterizing, and two
    // builds of the same deck would differ by a few pixels)
    await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => requestAnimationFrame(r))));
    await page.waitForTimeout(400);
    const png = await page.screenshot({ type: 'png', clip: { x: 0, y: 0, width: W, height: H } });
    fs.writeFileSync(path.join(OUT, 'png', `${nn}.png`), png);
    pngs.push(png);
    // 1600×900 WebP, like decks/dayN (Chromium's own encoder: no extra tools)
    const webp = await conv.evaluate(async ([b64, w, h]) => {
      const img = new Image(); img.src = 'data:image/png;base64,' + b64; await img.decode();
      const c = document.createElement('canvas'); c.width = w; c.height = h;
      const g = c.getContext('2d'); g.imageSmoothingEnabled = true; g.imageSmoothingQuality = 'high'; g.drawImage(img, 0, 0, w, h);
      return c.toDataURL('image/webp', 0.9);
    }, [png.toString('base64'), ...WEBP]);
    if (!/^data:image\/webp;base64,/.test(webp)) throw new Error('this Chromium cannot encode WebP');
    fs.writeFileSync(path.join(DECK, `${nn}.webp`), Buffer.from(webp.split(',')[1], 'base64'));
  }
  if (!only) {
    // the PDF for make_video.py: one 1920×1080 page per slide, in page order (the pictures as drawn, so the video shows
    // exactly what the tab's pictures show)
    await page.setContent(`<!doctype html><html><head><style>@page{size:${W}px ${H}px;margin:0;}html,body{margin:0;padding:0;}div{width:${W}px;height:${H}px;page-break-after:always;break-after:page;overflow:hidden;}div:last-child{page-break-after:auto;break-after:auto;}img{display:block;width:${W}px;height:${H}px;}</style></head><body>${pngs.map((p) => `<div><img src="data:image/png;base64,${p.toString('base64')}"></div>`).join('')}</body></html>`, { waitUntil: 'load' });
    await page.pdf({ path: path.join(OUT, 'debrief.pdf'), width: `${W}px`, height: `${H}px`, printBackground: true, margin: { top: 0, right: 0, bottom: 0, left: 0 }, preferCSSPageSize: true });
    const pages = (fs.readFileSync(path.join(OUT, 'debrief.pdf'), 'latin1').match(/\/Type\s*\/Page(?!s)/g) || []).length;
    if (pages !== slides.length) { failed++; console.log(`✗ build/debrief/out/debrief.pdf has ${pages} pages, not ${slides.length}`); }
    // a picture left from a slide that is gone
    for (const f of fs.readdirSync(DECK).filter((f) => /^\d\d\.webp$/.test(f))) if (!SPEC.slides.some((s) => String(s.page).padStart(2, '0') + '.webp' === f)) { fs.rmSync(path.join(DECK, f)); console.log(`removed decks/debrief/${f} (no slide ${f.slice(0, 2)} any more)`); }
  }
  await browser.close();
  if (!fontOk) console.log('⚠ drawn in the fallback font (Inter): a preview, not the deck');
  console.log(`${slides.length - failed} of ${slides.length} slides fit · decks/debrief/NN.webp${only ? '' : ' · build/debrief/out/debrief.pdf'}`);
  if (failed) process.exit(1);
})().catch((e) => { console.error(e.message || e); process.exit(1); });
