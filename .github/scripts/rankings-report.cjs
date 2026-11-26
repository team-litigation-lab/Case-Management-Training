// @check browser — 🏆 Rankings & Progress Report: ranked by the batch score (every day the batch reached, a missed day 0), the stars, N/A, a red flag and the endorsement tiers right; fits 1366 wide; an edit persists and ↺ Regenerate restores it; Copy/Download make a PNG; a share link opens with no sign-in and holds only the table
// Admin → 🏅 Scorecard → 🏆 Rankings & Progress Report (js/cm-rankings.js), with five made-up trainees of one batch:
//   Ann (high everywhere, the UPL item met) · Ben (mid 80s) · Cy (70s) · Dee (high, but a UPL breach) · Eve (nothing yet)
// 1. the rows are in Overall order and the Overall is cmScorecard.overall's; the tiers: Ann Highly Endorsed, Ben Endorsed,
//    Cy Endorsed with Coaching, Dee and Eve Not Yet; Dee's Red Flag names the safety gate, Eve's says no output and far behind;
//    Ann's and Ben's say "None."; Eve's attributes are N/A (insufficient data), Ann's are ★★★★★;
// 2. the table fits a 1366×768 window (no sideways scroll of the page or the sheet);
// 3. a click on a Strength cell edits it; the edit is saved in rankings:<batch> and is there after a reload; ↺ Regenerate
//    puts the generated text back (and drops the edit);
// 4. 📋 Copy as image and ⬇ Download PNG make a PNG (its signature), ⬇ CSV has a row per trainee;
// 5. 🔗 Share link: the snapshot holds only the table's fields; report.html?s=<token> in a new, signed-out browser shows the
//    table with its footer; after Revoke it says the link is not found.
// Usage: node .github/scripts/rankings-report.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]).toUpperCase();
const BATCH = 'B112026';
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 }, acceptDownloads: true });
    const page = await ctx.newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Rank', 'Report' + tag, BATCH);
    const setup = async () => page.evaluate(async ({ BATCH, tag }) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        const cf = DAYS.filter(d => d.cf), now = new Date().toISOString();
        // a trainee who worked `upto` days: each day's Knowledge Check, Backup Drive and one AI-graded Skill Activity at `s`
        const mk = (key, name, s, upto, upl, extra) => {
            const dp = {}, wl = [], dg = {};
            cf.slice(0, upto).forEach(d => {
                dp[d.id] = { score: s, done: s >= 70, date: now, history: [{ score: s, passed: s >= 70, date: now }] };
                dg[d.cf.n] = { score: s, passed: s >= 70, at: now };
                wl.push({ kind: 'lab', label: `Day ${d.id} · Case Flow Day ${d.cf.n} · Demand Package ${d.cf.n} — Skill Building`, dayId: d.id, score: s, at: now,
                    subs: { accuracy: s, presence: s, risk: s, efficiency: s }, strengths: [`${name} wrote a clear, complete package on Day ${d.cf.n}.`], gaps: [`${name} should check the dates twice.`] });
            });
            if (upl != null) wl.push({ kind: 'lab', label: `Day ${cf[0].id} · Case Flow Day 1 · Takeaway — CM Self-Summary`, dayId: cf[0].id, score: s, at: now, subs: { accuracy: s, presence: s, risk: upl, efficiency: s } });
            return Object.assign({ id: `${key}-${tag.toLowerCase()}--${BATCH.toLowerCase()}`, name: `${name} ${tag}`, batch: BATCH, approved: true, registeredAt: now, dayProgress: dp,
                __extra: { data: { 'work-log': wl, 'drive-grades': dg }, fb: {}, fbRec: {} } }, extra || {});
        };
        state.isAdmin = true;
        state.adminData = [mk('cy', 'Cy Coach', 72, 5, 80), mk('eve', 'Eve New', 0, 0, null), mk('ann', 'Ann Top', 96, 5, 95, { nickname: 'Annie' }), mk('dee', 'Dee Flag', 94, 5, 0), mk('ben', 'Ben Mid', 84, 5, 85), mk('fay', 'Fay Once', 98, 1, 95)];   // Fay: one day, top marks
        state.adminBatchFilter = ''; if (window.cmRankings) cmRankings.reset();
        state.adminTab = 'rankreport'; goto('admin'); render();
        for (let i = 0; i < 40 && !document.querySelector('#rkSheet .rk-row'); i++) await new Promise(r => setTimeout(r, 250));
        await new Promise(r => setTimeout(r, 1200)); render(); await new Promise(r => setTimeout(r, 300));
    }, { BATCH, tag });
    await setup();
    const r = await page.evaluate(() => {
        const rows = [...document.querySelectorAll('#rkSheet .rk-row')].map(tr => {
            const td = [...tr.children].map(x => x.innerText.trim());
            return { rank: td[0], name: td[1], overall: td[2], strength: td[3], challenges: td[4], attrs: td[5], flag: td[6], end: td[7], prog: td[8] };
        });
        const title = (document.querySelector('#rkSheet .rk-title') || {}).innerText || '';
        const ov = Object.fromEntries(state.adminData.map(x => [x.name.split(' ')[0], (() => { const e = x.__extra; return cmScorecard.overall({ rec: x, cf: x.caseFlow || { days: {} }, data: e.data, fb: e.fbRec }).pct; })()]));
        const sheet = document.getElementById('rkSheet'), tb = document.querySelector('#rkSheet .rk-table');
        const pill = [...document.querySelectorAll('.cmsh-row .admin-tab-btn')].map(b => b.textContent.trim());
        const toolbarInSheet = !!(sheet && sheet.querySelector('.rk-bar, select, .rk-share'));
        return { rows, title, ov, pill, toolbarInSheet,
            fit: { doc: document.documentElement.scrollWidth, win: innerWidth, sheet: sheet ? Math.ceil(sheet.getBoundingClientRect().right) : 0, tw: tb ? tb.scrollWidth : 0, tcw: tb ? tb.clientWidth : 0 } };
    });
    const first = n => (n || '').split(' ')[0];
    const order = r.rows.map(x => first(x.name));
    if (!r.pill.some(t => /Rankings & Progress Report/.test(t))) fail(`🏆 Rankings & Progress Report should be a tab under 🏅 Scorecard: ${JSON.stringify(r.pill)}`);
    if (!/^TRAINEE RANKINGS & PROGRESS REPORT – .+ – CM TRAINING/.test(r.title)) fail(`the title: ${r.title}`);
    if (!r.title.includes(BATCH)) fail(`the title should name the batch ${BATCH}: ${r.title}`);
    if (r.toolbarInSheet) fail('the toolbar should be outside the table that is captured');
    if (r.rows.length !== 6) fail(`6 trainees expected: ${JSON.stringify(order)}`);
    // the five who worked every day the batch reached are in Overall order (their batch score is their Overall); Fay, one day
    // at 98%, ranks below all of them (a missed day counts 0: the owner, "only attended 1 day of training and yet he ranks 1")
    const full = Object.entries(r.ov).filter(([n]) => n !== 'Fay'), want = full.sort((a, b) => (b[1] == null ? -1 : b[1]) - (a[1] == null ? -1 : a[1])).map(x => x[0]);
    want.splice(want.indexOf('Eve'), 0, 'Fay');
    if (JSON.stringify(order) !== JSON.stringify(want)) fail(`rows should be in batch-score order ${JSON.stringify(want)} (Overall ${JSON.stringify(r.ov)}): ${JSON.stringify(order)}`);
    if (r.rows.map(x => x.rank).join(',') !== '1,2,3,4,5,6') fail(`ranks: ${r.rows.map(x => x.rank)}`);
    const by = Object.fromEntries(r.rows.map(x => [first(x.name), x]));
    Object.entries(r.ov).forEach(([n, v]) => { if (n !== 'Fay' && by[n] && v != null && !by[n].overall.startsWith(v + '%')) fail(`${n}'s batch score, every day worked, should be cmScorecard.overall's ${v}%: ${by[n].overall}`); });
    if (by.Fay && (!new RegExp(`${r.ov.Fay}% on the 1 day scored, of 5`).test(by.Fay.overall) || parseInt(by.Fay.overall, 10) >= 40)) fail(`Fay's cell should show a low batch score and her ${r.ov.Fay}% Overall on the 1 day scored, of 5: ${by.Fay.overall}`);
    if (by.Fay && !/Far behind the batch/.test(by.Fay.flag)) fail(`Fay should be flagged far behind: ${by.Fay.flag}`);
    if (by.Ann && !/"Annie"/.test(by.Ann.name)) fail(`the nickname in quotes: ${by.Ann && by.Ann.name}`);
    if (by.Ann && !/PASS/.test(by.Ann.overall)) fail(`Ann passes: ${by.Ann.overall}`);
    if (by.Ann && !/^Highly Endorsed/.test(by.Ann.end)) fail(`Ann: Highly Endorsed: ${by.Ann.end}`);
    if (by.Ben && !/^Endorsed for Case Manager/.test(by.Ben.end)) fail(`Ben: Endorsed: ${by.Ben.end}`);
    if (by.Cy && !/^Endorsed with Coaching/.test(by.Cy.end)) fail(`Cy: Endorsed with Coaching: ${by.Cy.end}`);
    if (by.Dee && !/^Not Yet Endorsed/.test(by.Dee.end)) fail(`Dee (UPL breach): Not Yet Endorsed: ${by.Dee.end}`);
    if (by.Eve && !/^Not Yet Endorsed/.test(by.Eve.end)) fail(`Eve (nothing): Not Yet Endorsed: ${by.Eve.end}`);
    if (by.Dee && !/Safety gate breached/i.test(by.Dee.flag)) fail(`Dee's Red Flag should name the safety gate: ${by.Dee.flag}`);
    if (by.Dee && !/safety gate/i.test(by.Dee.overall)) fail(`Dee's Result should say safety gate: ${by.Dee.overall}`);
    if (by.Eve && !(/No graded output/.test(by.Eve.flag) && /Far behind/.test(by.Eve.flag))) fail(`Eve's Red Flag: no output, far behind: ${by.Eve.flag}`);
    ['Ann', 'Ben'].forEach(n => { if (by[n] && !/^None\./.test(by[n].flag)) fail(`${n}'s Red Flag should be None.: ${by[n].flag}`); });
    if (by.Eve && (by.Eve.attrs.match(/N\/A \(insufficient data\)/g) || []).length !== 3) fail(`Eve's three attributes should be N/A (insufficient data): ${by.Eve.attrs}`);
    if (by.Ann && (by.Ann.attrs.match(/★★★★★/g) || []).length !== 3) fail(`Ann's attributes should be ★★★★★: ${by.Ann.attrs}`);
    if (by.Cy && !/★★★☆☆/.test(by.Cy.attrs)) fail(`Cy's attributes should be ★★★☆☆ (70s): ${by.Cy.attrs}`);
    // (Strength and Challenges are a general summary: the dimensions and the habits, no activity, day, score or AI quote)
    if (by.Ann && !/^Strong in /.test(by.Ann.strength)) fail(`Ann's Strength should name her strong dimensions in general terms: ${by.Ann.strength}`);
    if (by.Cy && !/Needs work on/.test(by.Cy.challenges)) fail(`Cy's Challenges should name the weak dimensions: ${by.Cy.challenges}`);
    Object.entries(by).forEach(([n, x]) => { const t = `${x.strength} ${x.challenges}`;
      if (/\bDay \d|\d+%|AI review|"/.test(t)) fail(`${n}'s Strength and Challenges should be a general summary, with no day, score or quote: ${t}`);
      if (/\bDay \d|\(\d+ days?/.test(x.flag)) fail(`${n}'s Red Flag should be general, with no day or activity: ${x.flag}`); });
    if (by.Dee && !/legal advice/.test(by.Dee.flag)) fail(`Dee's Red Flag should say in general terms what the breach was: ${by.Dee.flag}`);
    if (by.Ann && !(/Until Day 5/.test(by.Ann.prog) && /Days passed 5\/5/.test(by.Ann.prog))) fail(`Ann's progress: ${by.Ann.prog}`);
    if (by.Eve && !/Days passed 0\/5/.test(by.Eve.prog)) fail(`Eve's progress: ${by.Eve.prog}`);
    if (r.fit.doc > r.fit.win || r.fit.sheet > r.fit.win || r.fit.tw > r.fit.tcw + 1) fail(`the table should fit 1366 wide: ${JSON.stringify(r.fit)}`);

    // 3. an edit, kept after a reload; ↺ Regenerate
    const cell = page.locator('#rkSheet .rk-row').first().locator('.rk-ed[data-f="strength"]');
    const gen = (await cell.innerText()).trim();
    await cell.click(); await page.keyboard.press('Control+A'); await page.keyboard.type('Edited by the trainer: outstanding demand package.');
    await page.keyboard.press('Enter'); await page.waitForTimeout(1200);
    const saved = await page.evaluate(async (BATCH) => { const v = await sharedGet('rankings:' + BATCH); return v && v.edits ? JSON.stringify(v.edits) : ''; }, BATCH);
    if (!/Edited by the trainer/.test(saved)) fail(`the edit should be saved in rankings:${BATCH}: ${saved}`);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    await setup();
    const after = await page.evaluate(() => { const c = document.querySelector('#rkSheet .rk-row .rk-ed[data-f="strength"]'); return { t: c ? c.innerText.trim() : '', regen: !!document.querySelector('#rkSheet .rk-row .rk-regen') }; });
    if (after.t !== 'Edited by the trainer: outstanding demand package.') fail(`the edit should be there after a reload: ${after.t}`);
    if (!after.regen) fail('an edited cell should offer ↺ Regenerate');
    await page.locator('#rkSheet .rk-regen').first().click(); await page.waitForTimeout(1200);
    const back = await page.evaluate(async (BATCH) => { const c = document.querySelector('#rkSheet .rk-row .rk-ed[data-f="strength"]'); const v = await sharedGet('rankings:' + BATCH);
        return { t: c ? c.innerText.trim() : '', edits: JSON.stringify((v && v.edits) || {}) }; }, BATCH);
    if (back.t !== gen) fail(`↺ Regenerate should put the generated text back: ${back.t.slice(0, 120)} (was ${gen.slice(0, 120)})`);
    if (/Edited by the trainer/.test(back.edits)) fail(`↺ Regenerate should drop the edit: ${back.edits}`);

    // 4. the PNG and the CSV
    const png = await page.evaluate(async () => {
        const sig = async b => b ? [...new Uint8Array(await b.slice(0, 8).arrayBuffer())].join(',') : '';
        const a = await cmRankings.pngBlob(); const d = await cmRankings.download(); const c = await cmRankings.copy();
        const bm = await createImageBitmap(a);
        const csv = cmRankings.csvText(cmRankings.current().snap);
        return { a: await sig(a), d: await sig(d), c: await sig(c), type: a.type, size: a.size, w: bm.width, h: bm.height, csvRows: csv.split('\r\n').length };
    });
    const PNG = '137,80,78,71,13,10,26,10';
    if (png.a !== PNG || png.type !== 'image/png' || !(png.size > 2000)) fail(`Copy as image should make a PNG: ${JSON.stringify(png)}`);
    if (png.d !== PNG) fail(`⬇ Download PNG should make a PNG: ${png.d}`);
    if (png.c !== PNG) fail(`📋 Copy as image should make a PNG (clipboard or its download): ${png.c}`);
    if (!(png.w > 1000 && png.h > 300)) fail(`the PNG should be the table at 2×: ${png.w}×${png.h}`);
    if (png.csvRows !== 3 + 6) fail(`⬇ CSV: the title, the date, the header and a row per trainee: ${png.csvRows} lines`);

    // 5. 🔗 a share link
    await page.evaluate(() => { window.__rkNoConfirm = true; });
    const sh = await page.evaluate(async () => { const snap = cmRankings.snapshot(); const r = await cmRankings.share();
        const stored = await (await fetch('/api/share/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: r && r.token }) })).json();
        return { r, keys: Object.keys(snap), rowKeys: [...new Set(snap.rows.flatMap(x => Object.keys(x)))], json: JSON.stringify(snap), stored: JSON.stringify(stored), ids: state.adminData.map(x => x.id) }; });
    if (!sh.r || !/^[a-f0-9]{32}$/.test(sh.r.token || '')) fail(`🔗 Share link should give a 128-bit token: ${JSON.stringify(sh.r)}`);
    const ROW = ['rank', 'name', 'overall', 'result', 'strength', 'challenges', 'attrs', 'redflag', 'endorsement', 'tier', 'progress', 'passed'];
    if (JSON.stringify(sh.keys) !== JSON.stringify(['title', 'batch', 'date', 'rows'])) fail(`the snapshot: only title, batch, date, rows: ${sh.keys}`);
    if (sh.rowKeys.some(k => !ROW.includes(k))) fail(`the snapshot's rows hold more than the table: ${sh.rowKeys}`);
    if (sh.ids.some(id => sh.json.includes(id) || sh.stored.includes(id))) fail('the snapshot should hold no trainee id');
    await page.waitForTimeout(800);
    const listed = await page.evaluate(() => document.querySelectorAll('.rk-links li').length);
    if (listed < 1) fail('the shared link should be listed under the toolbar');
    // a new browser, signed out
    const anon = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const ap = await anon.newPage(); ap.on('pageerror', e => fail(`shared page error: ${e.message}`));
    const resp = await ap.goto(new URL('report.html?s=' + sh.r.token, BASE).href, { waitUntil: 'load' }); await ap.waitForTimeout(1200);
    const pub = await ap.evaluate(() => ({ rows: document.querySelectorAll('#rkSheet .rk-row').length, foot: (document.querySelector('#rkSheet .rk-foot') || {}).textContent || '',
        edit: document.querySelectorAll('.rk-ed, .rk-regen').length, copy: [...document.querySelectorAll('button')].map(b => b.textContent).join('|'), fit: document.documentElement.scrollWidth <= innerWidth }));
    if (resp && (resp.headers()['x-robots-tag'] || '').indexOf('noindex') < 0) fail(`report.html should be served noindex: ${JSON.stringify(resp.headers())}`);
    if (pub.rows !== 6) fail(`the shared page should show the 6 rows with no sign-in: ${pub.rows}`);
    if (!/^Shared by LSH · snapshot of .+ · confidential$/.test(pub.foot.trim())) fail(`the shared page's footer: ${pub.foot}`);
    if (pub.edit) fail('the shared page is read-only');
    if (!/Copy as image/.test(pub.copy) || !/Download PNG/.test(pub.copy)) fail(`the shared page offers Copy as image / Download PNG: ${pub.copy}`);
    if (!pub.fit) fail('the shared page should fit 1366 wide');
    const apng = await ap.evaluate(async () => { const b = await cmRankings.pngBlob(); return b && b.type; });
    if (apng !== 'image/png') fail(`the shared page's PNG: ${apng}`);
    // revoked: not found
    await page.evaluate(async t => cmRankings.revoke(t), sh.r.token);
    await ap.reload({ waitUntil: 'load' }); await ap.waitForTimeout(1000);
    const gone = await ap.evaluate(() => ({ rows: document.querySelectorAll('#rkSheet .rk-row').length, t: document.body.innerText }));
    if (gone.rows || !/Link not found/.test(gone.t)) fail(`a revoked link should say not found: ${gone.t.slice(0, 200)}`);
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`The Rankings & Progress Report: ${order.join(' > ')}; tiers, stars, N/A and red flags right; fits 1366; edit kept and regenerated; PNG and CSV made; a share link opens signed out and 404s once revoked.`);
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
