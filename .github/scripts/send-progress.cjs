// @check browser — 📤 Send progress: the trainer sends a trainee their progress with a note from the 🏅 Scorecard card (or the 📤 on their row), the trainee finds it new in 📒 My Progress Log and opens it, and the trainer's card then reads "Read <date>"
// js/cm-send-progress.js, with the trainee's graded work saved the way the page saves it:
//   1. the trainer: the card's 📤 Send progress (and the 📤 on the trainee's row of 🏅 Scores, the name cell still just the
//      name) opens a preview of the trainee's progress (the Overall as 🏅 Scores shows it, the days, the practical
//      activities with what they did well and what to improve, what is missing) and the trainer's feedback; Send writes
//      it into feedback:<id>.reports, and the card says "Sent <date> · Not read yet";
//   2. the trainee: a toast, and 📬 Progress from your trainer at the top of 📒 My Progress Log, "1 new", the trainer's note
//      and day note and the snapshot; opening it marks it read (their own progress-reports-read);
//   3. the trainer: the card says "Sent <date> · Read <date>".
// Usage: node .github/scripts/send-progress.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const get = (key) => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    const put = (key, value) => page.evaluate(([key, value]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(value) }) }), [key, value]);
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Sam', 'Send' + tag, 'B111826');
    const id = await page.evaluate(() => state.traineeId);
    const act = await page.evaluate(async () => { const o = document.getElementById('ktLogin'); if (o) o.remove();
        let a = null; (window.CM_CASE_FLOW.days || []).forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if (!a && d.n === 1 && b.kind === 'activity' && b.act && !/-drive$/.test(b.id)) a = b; })));
        const d1 = DAYS.find(x => x.cf && x.cf.n === 1);
        state.progress = { [d1.id]: { score: 90, done: true, history: [{ score: 90, passed: true }] } }; await storeSet('day-progress', state.progress);
        await storeSet('cf-ai-grades', { v: 1, calls: {}, blocks: { [a.id]: { score: 76, tier: 'Proficient', subs: { accuracy: 80, presence: 76, risk: 70, efficiency: 73 }, strengths: ['Every channel logged with its time'], gaps: ['No callback set'], growth: [], at: new Date().toISOString(), tries: 1 } } });
        await cloudSaveNow(); return a.title; });
    const rec = await get('trainee:' + id) || {}; rec.approved = true; rec.dayProgress = Object.assign({}, rec.dayProgress, await page.evaluate(() => state.progress)); await put('trainee:' + id, rec);
    const NOTE = 'Strong start, Sam: set the callback next time.', DAYNOTE = 'Day 1: your intake notes were clear.';
    const dom = id.replace(/[^A-Za-z0-9_-]/g, '_');
    const toTrainer = async () => { await page.evaluate(() => { state.isAdmin = true; state.adminData = null; delete state.adminTab; cmScorecard.refresh(); goto('admin'); });
        await page.waitForSelector('.cmsh-screen #scx-scores', { timeout: 30000 }); await page.evaluate((b) => cmScorecard.batch(typeof batchShow === 'function' ? (batchShow(b) || b) : b), 'B111826');
        await page.evaluate((id) => cmScorecard.only(id), id); await page.waitForSelector(`#bs-pt-${dom} .sp-card`, { timeout: 20000 }).catch(() => fail('the trainee\'s card has no 📤 Send progress')); };

    // 1. the trainer sends it
    await toTrainer();
    const row = await page.evaluate((nm) => { const tr = [...document.querySelectorAll('.cmsh-screen #scx-scores tbody tr')].find(x => /Sam Send/.test((x.querySelector('td') || {}).textContent || ''));
        const td = tr && tr.querySelector('td'); return td ? { text: td.textContent, btn: !!td.querySelector('button.sp-row'), ov: [...tr.querySelectorAll('td')].map(x => x.textContent) } : null; });
    if (!row || !row.btn) fail('the trainee\'s row of 🏅 Scores should have its 📤'); else if (!/^Sam Send\w*$/.test(row.text)) fail(`the name cell should still read just the name: "${row.text}"`);
    const ovTable = await page.evaluate(() => { const s = document.querySelector('.cmsh-screen #scx-scores'), hs = [...s.querySelectorAll('.gs-head th')].map(t => t.textContent.trim()), i = hs.indexOf('Overall %');
        const tr = [...s.querySelectorAll('tbody tr')].find(x => /Sam Send/.test(x.querySelector('td').textContent)); return tr.querySelectorAll('td')[i].textContent; });
    const clear = () => page.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); });
    await clear(); await page.click(`#bs-pt-${dom} .sp-go`);
    await page.waitForSelector('#spRoot .sp-panel', { timeout: 5000 }).catch(() => fail('📤 Send progress opened no panel'));
    const pv = await page.evaluate(() => (document.querySelector('#spRoot .sp-panel') || {}).innerText || '');
    if (!pv.includes('Overall ' + ovTable)) fail(`the preview's Overall should be 🏅 Scores' ${ovTable}: ${pv.slice(0, 300)}`);
    if (!/Day 1/.test(pv) || !/Missing or failed|Nothing missing/.test(pv)) fail(`the preview should show the days and what is missing: ${pv.slice(0, 500)}`);
    await page.evaluate(() => document.querySelectorAll('#spRoot details').forEach(d => { d.open = true; }));
    const pv2 = await page.evaluate(() => document.querySelector('#spRoot .sp-panel').innerText);
    if (!pv2.includes('Every channel logged with its time') || !pv2.includes('No callback set')) fail(`the preview should carry each practical activity's feedback: ${pv2.slice(0, 600)}`);
    await clear(); await page.fill('#spNote', NOTE); await page.fill('#spDay1', DAYNOTE);
    await clear(); await page.click('#spSend'); await page.waitForTimeout(800);
    const fb = await get('feedback:' + id) || {}, rep = (fb.reports || [])[0];
    if (!rep || rep.note !== NOTE || !rep.dayNotes || rep.dayNotes[1] !== DAYNOTE) fail(`the report should be in feedback:<id>.reports with the note and the day note: ${JSON.stringify(fb.reports)}`);
    else if (rep.snapshot.overall + '%' !== ovTable) fail(`the report's Overall should be 🏅 Scores' ${ovTable}: ${rep.snapshot.overall}`);
    if (await page.$('#spRoot .sp-panel')) fail('the panel should close once sent');
    const card1 = await page.evaluate((d) => (document.querySelector(`#bs-pt-${d} .sp-card`) || {}).innerText || '', dom);
    if (!/Sent .* · Not read yet/.test(card1)) fail(`the card should say it was sent and not read yet: "${card1}"`);

    // 2. the trainee
    await page.evaluate(async () => { state.isAdmin = false; state.adminData = null; await loadMyFeedbackCore(); goto('dashboard'); render(); });
    await page.waitForTimeout(800);
    const toastT = await page.evaluate(() => (document.getElementById('toast') || {}).textContent || '');
    if (!/📬 Your trainer sent you your progress/.test(toastT)) fail(`the trainee should get a toast: "${toastT}"`);
    const inbox = await page.evaluate(() => { const b = document.getElementById('spInbox'), log = document.getElementById('myProgressLog');
        return b ? { text: b.innerText, inLog: !!(log && log.contains(b)), first: log && log.querySelector('.plog-h + #spInbox') === b, badge: (b.querySelector('h3 .sp-badge') || {}).textContent || '' } : null; });
    if (!inbox) fail('📒 My Progress Log has no 📬 Progress from your trainer');
    else { if (!inbox.inLog || !inbox.first) fail('📬 Progress from your trainer should open 📒 My Progress Log');
        if (inbox.badge !== '1 new') fail(`the report should be marked new: "${inbox.badge}"`); }
    await clear(); await page.click('#spInbox details.sp-rep > summary'); await page.waitForTimeout(1500);
    const opened = await page.evaluate(() => { const b = document.querySelector('#spInbox details.sp-rep'); if (b) b.querySelectorAll('details').forEach(d => { d.open = true; }); return b ? { text: b.innerText, isNew: b.classList.contains('new'), badge: !!document.querySelector('#spInbox h3 .sp-badge') } : null; });
    if (!opened || !opened.text.includes(NOTE) || !opened.text.includes(DAYNOTE) || !opened.text.includes('Every channel logged with its time')) fail(`the trainee should read the trainer's note, their day note and the snapshot: ${opened && opened.text.slice(0, 600)}`);
    if (!opened || opened.isNew || opened.badge) fail('opening the report should mark it read');
    const prog = await get('progress:' + id) || {}, rd = ((prog.data || {})['progress-reports-read'] || {})[rep && rep.id];
    if (!rd) fail(`the read mark should be saved on the trainee's own progress: ${JSON.stringify((prog.data || {})['progress-reports-read'])}`);

    // 3. the trainer sees it read
    await toTrainer();
    let card2 = '';
    for (let i = 0; i < 20; i++) { card2 = await page.evaluate((d) => (document.querySelector(`#bs-pt-${d} .sp-card`) || {}).innerText || '', dom); if (/· Read /.test(card2)) break; await page.waitForTimeout(500); await page.evaluate(() => cmScorecard.reload()); }
    if (!/Sent .* · Read /.test(card2)) fail(`the trainer's card should say the report was read: "${card2}"`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('📤 Send progress: the trainer sends the snapshot with a note, the trainee finds it new in 📒 My Progress Log and opens it, and the trainer\'s card reads "Read <date>".');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
