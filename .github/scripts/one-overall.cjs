// @check browser — One Overall score: a seeded trainee's Overall is the same number on their card, 🏅 Scores, the Batch Sheet (Scores, Score Card, Day by Day, their card) and their dashboard, with the best Knowledge Check kept
// A trainee used to have three overall scores (the Scores row's Total 66%, the card's Overall 50%, the Batch Sheet's 64%).
// Now ONE function makes it, cmScorecard.overall (js/cm-scorecard.js: the 100-point model's Final), and every surface calls
// it (js/cm-batch-sheet.js, js/cm-overall.js). This seeds one trainee's graded work through the page's own saves, then reads
// the Overall off every surface as a person sees it, and each Case Flow day's score off 🏅 Scores and 📅 Day by Day:
//   the trainee: 🏅 My Performance's Overall pill, the dashboard's 🏅 My Score Card and 🏅 My Scores;
//   the trainer: the trainee's card on 🏅 Scorecards and its 🏅 Scores row; the Batch Sheet's 🏅 Scores, 🏅 Score Card,
//   📅 Day by Day and the trainee's 🔎 card.
// Sub-scores are labelled as such (Daily compliance, the grading systems average), and a day's Knowledge Check counts its
// best attempt (the owner's rule), not its last.
// Usage: node .github/scripts/one-overall.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
const NAME = 'Olive One' + tag;

const pctOf = (t) => { const m = /(\d+)%/.exec(String(t || '')); return m ? +m[1] : null; };

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    const get = (key) => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);

    // the best Knowledge Check counts: a day whose last attempt was 60 after an 85 is scored 85
    const best = await page.evaluate(() => { const d = DAYS.find(x => x.cf && x.cf.n === 1);
        const ev = cmScorecard.model.evidence({ rec: { dayProgress: { [d.id]: { score: 60, history: [{ score: 85 }, { score: 60 }] } } }, cf: { days: { 1: { kc: 60 } } }, data: {}, fb: {} });
        const kc = ev.items.find(x => x.group === '✍️ Knowledge Check'); return kc ? kc.pct : null; });
    if (best !== 85) fail(`a day's Knowledge Check should count its best attempt (85), not its last (60): ${best}`);

    // 1. the trainee's graded work, saved the way the page saves it
    await signIn(page, 'Olive', 'One' + tag, 'B121226');
    const id = await page.evaluate(() => state.traineeId);
    if (!id) { fail('the trainee did not sign in'); await browser.close(); console.log('✗ ' + failures.join('\n  ')); process.exit(1); }
    const DP = { 11: { score: 92, done: true, takeaway: 88, history: [{ score: 92, passed: true }] }, 12: { score: 78, done: true, history: [{ score: 64 }, { score: 78, passed: true }] }, 13: { score: 55, done: false } };
    await page.evaluate(async (DP) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        state.progress = JSON.parse(JSON.stringify(DP)); await storeSet('day-progress', state.progress);
        state.workLog = [
            { kind: 'lab', dayId: 11, label: 'Day 11 · Case Flow Day 1 · Intake — Skill Building', score: 82, at: '2026-11-01T10:00:00Z', subs: { accuracy: 85, presence: 80, risk: 75, efficiency: 70 } },
            { kind: 'lab', dayId: 12, label: 'Day 12 · Case Flow Day 2 · Claim Set Up — CM Self-Summary', score: 64, at: '2026-11-02T10:00:00Z', subs: { accuracy: 70, presence: 60, risk: 55, efficiency: 50 } }];
        await storeSet('work-log', state.workLog);
        await storeSet('drive-setup', { score: 100, ok: true, attempts: 1, at: '2026-11-01T11:00:00Z' });
        await storeSet('drive-grades', { 2: { score: 70, passed: true, at: '2026-11-02T11:00:00Z' } });
        await cloudSaveNow(); await syncToLedger();
    }, DP);
    const rec = await get('trainee:' + id) || {};
    rec.approved = true; rec.name = rec.name || NAME; rec.dayProgress = Object.assign({}, DP, rec.dayProgress);
    await put('trainee:' + id, rec);
    const seen = {};

    // the trainee: My Performance, the dashboard's My Score Card and My Scores
    await page.evaluate(() => goto('scorecard'));
    await page.waitForSelector('.bs-pt .bs-pt-k', { timeout: 15000 }).catch(() => fail('My Performance shows no card'));
    await page.waitForTimeout(1200); await page.evaluate(() => goto('scorecard')); await page.waitForTimeout(600);
    const mine = await page.evaluate(() => [...document.querySelectorAll('.bs-pt .bs-pt-k')].map(x => x.textContent.replace(/\s+/g, ' ').trim()));
    const pill = mine.find(p => /^Overall\b/.test(p));
    seen['My Performance · Overall pill'] = pctOf(pill);
    if (!mine.some(p => /^Daily compliance\b/.test(p))) fail(`the card should show the Daily compliance as its own, labelled sub-score: ${JSON.stringify(mine)}`);
    if (mine.some(p => /^Scorecard\b/.test(p))) fail(`the card should not show a second "Scorecard" score beside the Overall: ${JSON.stringify(mine)}`);
    await page.evaluate(() => goto('dashboard')); await page.waitForTimeout(1500);
    const dash = await page.evaluate(() => { const c = document.querySelector('.rank-card'), m = document.querySelector('.my-sc-all');
        return { card: c ? c.dataset.overall || c.textContent : null, my: m ? m.textContent : null }; });
    if (dash.card != null) seen['Dashboard · My Score Card'] = pctOf(dash.card + '%');
    if (dash.my != null) { seen['Dashboard · My Scores'] = pctOf(dash.my); if (!/Overall/.test(dash.my)) fail(`My Scores should name its number the Overall: "${dash.my}"`); }

    // the trainer: the card and its 🏅 Scores row
    await page.evaluate(() => { state.isAdmin = true; state.adminData = null; if (window.cmScorecard) cmScorecard.refresh(); goto('scorecard'); });
    const dom = id.replace(/[^A-Za-z0-9_-]/g, '_');
    await page.waitForFunction((d) => !!document.getElementById('bs-pt-' + d), dom, { timeout: 20000 }).catch(() => fail('the trainer\'s Scorecards shows no card for the trainee'));
    await page.evaluate((id) => cmScorecard.only(id), id); await page.waitForTimeout(500);
    const tc = await page.evaluate((d) => { const c = document.getElementById('bs-pt-' + d); return c ? [...c.querySelectorAll('.bs-pt-k')].map(x => x.textContent.replace(/\s+/g, ' ').trim()) : []; }, dom);
    seen['Scorecards · the card\'s Overall pill'] = pctOf(tc.find(p => /^Overall\b/.test(p)));
    const realName = await page.evaluate((d) => { const c = document.getElementById('bs-pt-' + d), s = c && c.querySelector('.bs-pt-who select'); return s ? s.options[s.selectedIndex].textContent : ''; }, dom);
    const nm = realName || NAME;
    const cell = (sel, head) => page.evaluate(([sel, head, name]) => {
        const sec = document.querySelector(sel); if (!sec) return { err: `no ${sel}` };
        const hs = [...sec.querySelectorAll('.gs-head th')].map(t => t.textContent.trim()), i = hs.indexOf(head);
        if (i < 1) return { err: `${sel} has no "${head}" column: ${JSON.stringify(hs)}` };
        const tr = [...sec.querySelectorAll('tbody tr')].find(r => { const n = r.querySelector('td'); return n && n.textContent.includes(name); });
        if (!tr) return { err: `${sel} has no row for ${name}` };
        const td = tr.querySelectorAll('td')[i - 1] || {}; return { v: td.textContent || '', tip: td.title || '' };
    }, [sel, head, nm]);
    const scRow = await cell('#scx-scores', 'Overall %');
    if (scRow.err) fail('🏅 Scores: ' + scRow.err); else seen['Scorecards · 🏅 Scores row'] = pctOf(scRow.v);
    const scDays = {}; for (const n of [1, 2]) { const x = await cell('#scx-scores', `Day ${n} %`); scDays[n] = x.err ? x.err : pctOf(x.v); }

    // the Batch Sheet: 🏅 Scores, 🏅 Score Card, 📅 Day by Day, the trainee's card
    // (🏅 Scores and the 🏅 Score Card are under the sheet's ▸ More detail fold: opened, as a trainer opens it)
    await page.evaluate(() => { state.adminData = null; state.adminBatchFilter = ''; if (window.cmBatchSheet && cmBatchSheet.more) cmBatchSheet.more(true); goto('admin'); setAdminTab('audit'); });
    await page.waitForSelector('#bs-scores', { timeout: 30000 }).catch(() => fail('the Batch Sheet shows no 🏅 Scores'));
    let bs = null;
    for (let i = 0; i < 40; i++) { bs = await cell('#bs-scores', 'Overall %'); if (!bs.err && pctOf(bs.v) != null) break; await page.waitForTimeout(500); await page.evaluate(() => { if (state.view === 'admin') render(); }); }
    if (bs.err) fail('Batch Sheet 🏅 Scores: ' + bs.err); else seen['Batch Sheet · 🏅 Scores'] = pctOf(bs.v);
    const gsa = await cell('#bs-scores', 'Grading systems average %');
    if (gsa.err) fail('the Batch Sheet should label the grading systems average as its own column: ' + gsa.err);
    const sc = await page.evaluate(() => { const s = document.querySelector('[id^="bs-scorecard"]'); return s ? '#' + s.id : null; });
    if (!sc) fail('the Batch Sheet shows no 🏅 Score Card'); else { const x = await cell(sc, 'Overall'); if (x.err) fail('Score Card: ' + x.err); else seen['Batch Sheet · 🏅 Score Card'] = pctOf(x.v); }
    const dd = await cell('#bs-days', 'Overall');
    if (dd.err) fail('Day by Day: ' + dd.err); else seen['Batch Sheet · 📅 Day by Day'] = pctOf(dd.v);
    const ddDays = await page.evaluate(() => { const sec = document.querySelector('#bs-days'); return sec ? [...sec.querySelectorAll('.gs-head th')].map(t => t.textContent.trim()) : []; });
    for (const n of [1, 2]) { const h = ddDays.find(t => t.startsWith(`Day ${n}.`)); if (!h) { fail(`Day by Day has no Day ${n} column`); continue; }
        const x = await cell('#bs-days', h); const v = x.err ? x.err : pctOf(x.v);
        if (v !== scDays[n]) fail(`Day ${n}'s score should be the same on 🏅 Scores (${scDays[n]}) and 📅 Day by Day (${v})`); }
    const tcard = await page.evaluate((nm) => { const d = [...document.querySelectorAll('details.bs-ds-tr')].find(x => x.textContent.includes(nm)); const em = d && d.querySelector('summary em'); return em ? em.textContent : null; }, nm);
    if (tcard == null) fail('the Batch Sheet has no 🔎 card for the trainee'); else seen['Batch Sheet · the trainee\'s 🔎 card'] = pctOf(tcard);

    const vals = Object.values(seen);
    if (vals.some(v => v == null)) fail(`every surface should show an Overall: ${JSON.stringify(seen)}`);
    if (new Set(vals).size !== 1) fail(`the Overall should be one number everywhere: ${JSON.stringify(seen)}`);
    if (Object.keys(seen).length < 8) fail(`expected the Overall on 8 surfaces, read ${Object.keys(seen).length}: ${JSON.stringify(seen)}`);
    await browser.close();
    if (failures.length) { console.log('✗ One Overall score:\n  ' + failures.join('\n  ')); process.exit(1); }
    console.log(`One Overall score: ${vals[0]}% on all ${vals.length} surfaces (${Object.keys(seen).join('; ')}); the days agree on 🏅 Scores and 📅 Day by Day; the best Knowledge Check counts.`);
})().catch(e => { console.log('✗ ' + (e && e.stack || e)); process.exit(1); });
