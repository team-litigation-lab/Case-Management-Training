// @check browser — Every link and button resolves: on every Case Flow slide, its 📖 Reference panel and the 🧪 Practice page, an in-app route exists, a /decks/ /documents/ /js/ file is served (200), a button's onclick calls a function that exists, and no href="#" is a dead end (an external link, Canva or Google, is a well-formed URL)
// The owner: "all links, features are working properly". A link that goes nowhere or a button whose function was renamed
// throws nothing a trainee sees until they press it, so every one is read here, at 1366×768, as a trainer sees the course
// (every day open, a slide's 🧰 Tools menu and folded boxes included, since they are in the page):
//   • <a href>: "#/view/id" must be a route the page opens (index.html parseRouteHash: a Case Flow day, a practice tool or
//     a route view); "#id" an element on the page; a same-site address (/decks/, /documents/, /js/ …) is fetched and must
//     answer 200; an external one must be a well-formed http(s) URL (CI cannot reach Canva or Google, so it is not
//     fetched); "#", "" or "javascript:" with nothing to do is a dead end;
//   • a button's or link's onclick: every function it calls (cmCaseFlow.labGo, goto, CMSbTask.go …) must exist, and a
//     same-site address it opens (window.open('/documents/…')) must be served.
// Usage: node .github/scripts/links.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
  const page = await ctx.newPage();
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  await signIn(page, 'Link', 'Walker' + String(Date.now()).slice(-5).replace(/\d/g, d => 'abcdefghij'[d]), 'B100926');
  await page.evaluate(() => { window.open = () => null; });
  const r = await page.evaluate(async () => {
    const sleep = ms => new Promise(f => setTimeout(f, ms));
    state.isAdmin = true; { const kt = document.getElementById('ktLogin'); if (kt) kt.remove(); }
    const items = [], seen = new Set();
    const collect = (root, where) => {
      if (!root) return;
      root.querySelectorAll('a, button, [onclick]').forEach(el => {
        const href = el.tagName === 'A' ? el.getAttribute('href') : null, oc = el.getAttribute('onclick') || '';
        const label = (el.textContent || el.getAttribute('aria-label') || el.title || '').trim().replace(/\s+/g, ' ').slice(0, 50);
        const key = `${href}|${oc}`; if (seen.has(key)) return; seen.add(key);
        items.push({ where, tag: el.tagName.toLowerCase(), href, oc, label, target: el.getAttribute('target') || '' });
      });
    };
    let slides = 0;
    for (const d of DAYS.filter(x => x.cf)) {
      goto('day', d.id); state.dayViewMode = 'slides'; state.maxSlideReached = 9999;
      const ss = buildDaySlides(d);
      for (let i = 0; i < ss.length; i++) {
        if (window.cmCaseFlow && cmCaseFlow.clearModes) cmCaseFlow.clearModes();
        state.lessonSlide = i; state.slidePage = 0; render(); await sleep(15); slides++;
        const s = ss[i], l = s.type === 'topic' ? d.lessons[s.lessonIndex] : null;
        const where = `Day ${d.cf.n} slide ${i + 1}${l && l.cf ? ` (${l.cf.block.id})` : ` (${s.type})`}`;
        collect(document.getElementById('lessonSlideWrap'), where);
        // a Skill Activity's Submit turns the slide into the AI Grader: its buttons too
        if (l && l.cf && l.cf.block.kind === 'activity' && cmCaseFlow.viewsOf(l.cf.block)[(s.part || 1) - 1] === 'task') { cmCaseFlow.mode(l.cf.block.id, 'check'); await sleep(15); collect(document.getElementById('lessonSlideWrap'), where + ' → Submit'); cmCaseFlow.clearModes(); render(); await sleep(10); }
        const ref = document.querySelector('#lessonSlideWrap .cfx-ref-open');
        if (ref) { ref.click(); await sleep(30); collect(document.querySelector('.cfx-ref'), where + ' 📖 Reference');
          const x = document.querySelector('.cfx-ref-x'); if (x) x.click(); else document.querySelectorAll('.cfx-ref').forEach(n => n.remove()); await sleep(10); }
      }
    }
    for (const d of DAYS.filter(x => x.cf)) { state.cfPxDay = d.cf.n; goto('practice'); await sleep(40); collect(document.querySelector('main') || document.getElementById('app'), `Practice page, Day ${d.cf.n}`); }
    // what each one points at
    const evalG = (0, eval);
    const fnOk = path => { try { return evalG(`typeof ${path}`) === 'function'; } catch (e) { return false; } };
    const defined = root => { try { return evalG(`typeof ${root}`) !== 'undefined'; } catch (e) { return false; } };
    const SKIP = new Set(['if', 'for', 'while', 'switch', 'return', 'function', 'typeof', 'new', 'catch', 'this', 'event', 'Math', 'JSON', 'String', 'Number', 'Object', 'Array', 'Boolean', 'Date', 'parseInt', 'parseFloat', 'isNaN', 'encodeURIComponent', 'decodeURIComponent', 'setTimeout', 'clearTimeout', 'requestAnimationFrame', 'alert', 'confirm', 'prompt']);
    const routeOk = h => { const m = String(h).match(/^#\/([a-z]+)(?:\/([^/?#]+))?/i); if (!m) return false; const v = m[1], id = m[2] ? decodeURIComponent(m[2]) : null;
      if (v === 'day') return DAYS.some(d => d.id === parseInt(id, 10)); if (v === 'tool') return PRACTICE_TOOLS.some(t => t.id === id); return routeViews().includes(v); };
    const out = { bad: [], fetch: [], ext: 0, routes: 0, calls: 0, items: items.length, slides };
    for (const it of items) {
      const at = `${it.where}: ${it.tag} "${it.label}"`;
      if (it.tag === 'a' && it.href != null) {
        const h = it.href.trim();
        if (h === '' || h === '#' || /^javascript:/i.test(h)) { if (!it.oc) out.bad.push(`${at}: href="${h}" is a dead end`); else if (h === '#' && !/preventDefault|return false/.test(it.oc)) out.bad.push(`${at}: href="#" jumps to the top of the page (its onclick does not stop it)`); }
        else if (/^#\//.test(h)) { out.routes++; if (!routeOk(h)) out.bad.push(`${at}: the route ${h} does not exist`); }
        else if (/^#/.test(h)) { if (!document.getElementById(h.slice(1))) out.bad.push(`${at}: ${h} is not on the page`); }
        else if (/^(mailto|tel):/i.test(h)) {}
        else { let u = null; try { u = new URL(h, location.href); } catch (e) {}
          if (!u || !/^https?:$/.test(u.protocol)) out.bad.push(`${at}: "${h}" is not a well-formed address`);
          else if (u.origin === location.origin) out.fetch.push({ at, url: u.pathname + u.search });
          else { out.ext++; if (!/\./.test(u.hostname)) out.bad.push(`${at}: "${h}" is not a well-formed address`); } }
      } else if (it.tag === 'a' && !it.oc) out.bad.push(`${at}: a link with no href and nothing to do`);
      if (it.oc) {
        const calls = [...it.oc.matchAll(/(^|[^\w$.'"`])([A-Za-z_$][\w$]*(?:\.[A-Za-z_$][\w$]*)*)\s*\(/g)].map(m => m[2]);
        for (const c of calls) { const root = c.split('.')[0]; if (SKIP.has(root) || /^(this|event|document|window\.event)\b/.test(c)) continue;
          if (c.split('.').length > 1 && ['document', 'window', 'location', 'history', 'navigator', 'console', 'localStorage', 'sessionStorage', 'state'].includes(root)) continue;
          out.calls++;
          if (!defined(root)) out.bad.push(`${at}: its onclick calls ${c}(), and ${root} does not exist`);
          else if (!fnOk(c)) out.bad.push(`${at}: its onclick calls ${c}(), which is not a function`); }
        [...it.oc.matchAll(/['"`]((?:https?:\/\/|\/)[^'"`\s]+)['"`]/g)].forEach(m => { let u = null; try { u = new URL(m[1], location.href); } catch (e) {}
          if (!u) out.bad.push(`${at}: its onclick opens "${m[1]}", not a well-formed address`); else if (u.origin === location.origin) out.fetch.push({ at, url: u.pathname + u.search }); else out.ext++; });
      }
    }
    // same-site files: each fetched once
    const urls = [...new Set(out.fetch.map(f => f.url))], status = {};
    await Promise.all(urls.map(async u => { try { const res = await fetch(u, { method: 'GET', headers: { Range: 'bytes=0-0' } }); status[u] = res.status; } catch (e) { status[u] = 0; } }));
    out.fetch.forEach(f => { const s = status[f.url]; if (![200, 206, 304].includes(s)) out.bad.push(`${f.at}: ${f.url} answers ${s}`); });
    out.files = urls.length;
    return out;
  });
  [...new Set(r.bad)].forEach(fail);
  await browser.close();
  if (failures.length) { console.log(`✗ Links and buttons (${failures.length}):\n  ` + failures.slice(0, 80).join('\n  ')); process.exit(1); }
  console.log(`Links and buttons: ${r.items} on ${r.slides} Case Flow slides, their 📖 Reference panels and the Practice page; ${r.routes} in-app routes exist, ${r.files} same-site files answer 200, ${r.calls} onclick calls name a function that exists, ${r.ext} external links are well-formed, and no "#" is a dead end.`);
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
