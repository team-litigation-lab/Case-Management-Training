// @check browser — ✍ Graded work: a trainer grades, overrides and comments a trainee's Drive work in 🔗 Trainee Drives; the trainee sees the final grade and the comment
// ✍ The written work on a trainee's Backup Drive (js/cm-drive-work.js), on the page. /api/drive is answered by the test
// (the test server has no service account, no AI and no trainee tokens; worker-drive-work.js is checked by drive-work.cjs).
//   1. A trainer: 🛡 Admin Master Control → 🔗 Trainee Drives has ✍ Graded work, a row per linked trainee; opening it reads
//      the trainee's grades ("workFor"): each day's structure grade, each activity's AI grade with its feedback, and the
//      files not matched. Typing a grade and a comment and pressing ✓ Save sends "override" with them; the row then shows
//      the trainer's grade. 🏅 Grade now sends "workGradeFor" and says what it did. Every file name and every line of a grade
//      is escaped (a name with markup in it stays text).
//   2. The 🏅 Scorecard's 📂 Backup Drive reads the final grades: the written work, and a day's override in place of its
//      auto grade, from the Worker's report only: a "trainer's grade" a trainee put in their own progress shows nowhere.
//   3. The trainee: 📂 My Backup Drive shows ✍ Your written work, graded: the trainer's grade with the AI's beside it, the
//      comment, the feedback as what your work shows / the standard / why it matters / your next step, and where each
//      activity's work goes. Nothing of it is kept in their progress (which they could write).
// Usage: node .github/scripts/drive-work-ui.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

const tag = String(Date.now()).slice(-6).replace(/\d/g, (d) => 'abcdefghij'[d]);
const TID = `ana-work-${tag}--s`, BATCH = 'B100926';
const XSS = 'memo <img src=x onerror="window.__xss=1">.gdoc';
const fix = { shows: 'Your memo names no date for <b>the reply</b>.', standard: 'Every routed item carries a dated next step.', why: "On John Doe's file a reply with no date is a reply nobody chases.", next: 'Add the reply date and docket it.' };
const item = (o) => Object.assign({ id: 'd3m2-rel', day: 3, title: 'Settlement Release Clause Review & Attorney Approval', file: XSS, url: 'https://docs.google.com/document/d/abc/edit', folder: '05 Insurance, Demands & Negotiation',
  by: 'title', home: '05 Insurance, Demands & Negotiation', wrongFolder: false, nameOk: true, auto: 82, final: 82, override: null,
  dims: [{ name: 'Problem spotting', points: 20, max: 25 }, { name: 'Amendments', points: 20, max: 20 }], strengths: ['You quoted each clause you changed.'], fix: [fix], gradedAt: '2026-11-14T07:10:00.000Z', truncated: false, chars: 4000, error: '' }, o || {});
let ov = null, dayOv = null;
const view = () => {
  const it = item(ov ? { final: ov.score, override: ov } : {});
  const structure = { 1: { auto: 100, final: 100 }, 2: { auto: 90, final: 90 }, 3: dayOv ? { auto: 70, final: dayOv.score, override: dayOv } : { auto: 70, final: 70 }, 4: { auto: null, final: null }, 5: { auto: null, final: null } };
  return { work: { items: [it], unmatched: [{ name: 'notes <script>x</script>', folder: '05 Insurance, Demands & Negotiation', why: 'No activity\'s title is in its name or first lines.', url: 'javascript:alert(1)' }], unreadable: [], older: [], days: {} },
    brief: { items: [{ a: it.id, d: 3, t: it.title, s: it.final, ai: 82, ov: !!ov, c: ov ? ov.comment : '' }], days: dayOv ? { 3: { s: dayOv.score, c: dayOv.comment } } : {}, n: 1, unmatched: 1 },
    structure, guide: [{ id: 'd3m2-rel', day: 3, title: it.title, folder: '01 Clients/Doe-John/05 Insurance, Demands & Negotiation', heading: 'Day 3 · ' + it.title }], linked: true, configured: true, ai: true, maxChars: 20000 };
};
const calls = [];
async function answer(route) {
  let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* no body */ }
  calls.push(b);
  const send = (body) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
  if (b.action === 'override') {
    const o = b.score == null ? null : { score: b.score, comment: b.comment, by: 'trainer', at: new Date().toISOString() };
    if (b.kind === 'day') dayOv = o; else ov = o;
    return send(Object.assign(view(), { saved: { kind: b.kind, key: b.key } }));
  }
  if (b.action === 'workGradeFor') return send(Object.assign(view(), { ran: { graded: 1, failed: 0, pending: 0, structure: true } }));
  if (b.action === 'work' || b.action === 'workFor') return send(view());
  if (b.action === 'reportAll') return send({ reports: { [TID]: { traineeId: TID, connected: true, folder: 'LSH Case Backups', email: 'ana@example.com', grades: {}, work: view().brief } } });
  if (b.action === 'status' || b.action === 'grade' || b.action === 'check') return send({ grades: {}, drive: { configured: true, connected: true, built: true, builtAt: '2026-11-12T10:00:00.000Z', standard: ['01 Clients'], why: {}, homes: {}, root: 'LSH Case Backups', lastMissing: [], saved: [], grades: {}, drills: [], setup: { score: 100, ok: true, attempts: 1 }, naming: null } });
  return send({ drive: null, grades: {} });
}

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
  page.on('pageerror', (e) => fail(`page error: ${e.message}`));
  page.on('dialog', (d) => d.dismiss());
  await page.route('**/api/drive', answer);
  await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
  if (!(await page.evaluate(() => !!window.cmDriveWork))) { console.log('js/cm-drive-work.js did not load'); process.exit(1); }

  /* 1: a trainer, 🔗 Trainee Drives → ✍ Graded work */
  await page.evaluate(async ([TID, BATCH]) => {
    const o = document.getElementById('ktLogin'); if (o) o.remove();
    await sharedSet('trainee:' + TID, { id: TID, name: 'Ana Work', batch: BATCH, approved: true, registeredAt: new Date().toISOString() });
    state.isAdmin = true; state.adminData = null; state.adminBatchFilter = cleanBatch(BATCH); state.adminTab = 'tdrives';
    goto('admin'); render();
  }, [TID, BATCH]);
  await page.waitForFunction((TID) => (state.adminData || []).some((r) => r.id === TID) && (state.driveReports || {})[TID], TID, { timeout: 15000 }).catch(() => {});
  await page.evaluate(() => render());
  await page.waitForSelector(`#cmdwAdm details[data-cmdw-id="${TID}"]`, { timeout: 10000 }).catch(() => {});
  const row = await page.evaluate((TID) => { const d = document.querySelector(`#cmdwAdm details[data-cmdw-id="${TID}"]`); return d ? d.innerText : ''; }, TID);
  if (!/Ana Work/.test(row) || !/1 graded · average 82%/.test(row) || !/Grade now/.test(row)) fail(`✍ Graded work should list the linked trainee with their graded work and 🏅 Grade now: "${row.slice(0, 300)}"`);
  await page.click(`#cmdwAdm details[data-cmdw-id="${TID}"] > summary b`);
  await page.waitForSelector(`#cmdwAdm details[data-cmdw-id="${TID}"] tr[data-cmdw-row="d3m2-rel"]`, { timeout: 10000 }).catch(() => {});
  const opened = await page.evaluate((TID) => { const d = document.querySelector(`#cmdwAdm details[data-cmdw-id="${TID}"]`); return d ? { text: d.innerText, html: d.innerHTML, img: !!d.querySelector('img'), js: !!d.querySelector('a[href^="javascript"]') } : null; }, TID);
  if (!opened || !calls.some((c) => c.action === 'workFor' && c.traineeId === TID)) fail('opening a trainee should read their grades ("workFor")');
  else {
    if (!/Day 3 · Backup File Maintenance/.test(opened.text) || !/Day 1 · the firm's folders/.test(opened.text)) fail(`each day's structure grade should be listed: "${opened.text.slice(0, 400)}"`);
    if (!/Day 3 · Settlement Release Clause Review/.test(opened.text) || !/82%/.test(opened.text)) fail('each activity\'s AI grade should be listed');
    if (!/not matched/i.test(opened.text) || !/notes <script>x<\/script>/.test(opened.text)) fail('the files not matched should be listed, their names as text');
    if (opened.img || opened.js || await page.evaluate(() => window.__xss)) fail('a file name with markup in it was drawn as markup (or a javascript: address linked)');
    if (!/&lt;img src=x/.test(opened.html)) fail('the file name should be escaped');
  }
  ok('🔗 Trainee Drives → ✍ Graded work: a row per linked trainee, each day\'s grade and each activity\'s AI grade, the files not matched, all escaped');

  // override an activity's grade, with a comment
  const sel = `#cmdwAdm tr[data-cmdw-row="d3m2-rel"]`;
  await page.fill(`${sel} .cmdw-score`, '74');
  await page.fill(`${sel} .cmdw-comment`, 'Atty. Thorne\'s approval is not on file.');
  await page.click(`${sel} button:has-text("Save")`);
  await page.waitForFunction(() => /Saved: the activity is 74%/.test((document.getElementById('cmdwAdm') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
  const sent = calls.filter((c) => c.action === 'override').pop();
  if (!sent || sent.traineeId !== TID || sent.kind !== 'work' || sent.key !== 'd3m2-rel' || sent.score !== 74 || !/approval is not on file/.test(sent.comment)) fail(`✓ Save should send the override with its grade and comment: ${JSON.stringify(sent)}`);
  const after = await page.evaluate((sel) => { const r = document.querySelector(sel); return r ? r.innerText : ''; }, sel);
  if (!/74%/.test(after) || !/trainer/.test(after)) fail(`after ✓ Save the row should show the trainer's grade: "${after.slice(0, 300)}"`);
  // override a day's structure grade
  const dsel = `#cmdwAdm tr[data-cmdw-day="3"]`;
  await page.fill(`${dsel} .cmdw-score`, '65'); await page.fill(`${dsel} .cmdw-comment`, 'Superseded versions left unlabeled.');
  await page.click(`${dsel} button:has-text("Save")`);
  await page.waitForTimeout(500);
  const dsent = calls.filter((c) => c.action === 'override').pop();
  if (!dsent || dsent.kind !== 'day' || dsent.key !== '3' || dsent.score !== 65) fail(`a day's override should be sent as kind "day": ${JSON.stringify(dsent)}`);
  // a grade out of range is refused on the page
  const n0 = calls.length;
  await page.fill(`${sel} .cmdw-score`, '140'); await page.click(`${sel} button:has-text("Save")`); await page.waitForTimeout(300);
  if (calls.length !== n0 || !/whole number from 0 to 100/.test(await page.evaluate(() => document.getElementById('cmdwAdm').innerText))) fail('a grade over 100 should be refused on the page, nothing sent');
  // 🏅 Grade now
  await page.click(`#cmdwAdm details[data-cmdw-id="${TID}"] [data-cmdw-now]`);
  await page.waitForFunction(() => /Graded 1 file/.test((document.getElementById('cmdwAdm') || {}).innerText || ''), null, { timeout: 10000 }).catch(() => {});
  if (!calls.some((c) => c.action === 'workGradeFor' && c.traineeId === TID)) fail('🏅 Grade now should send "workGradeFor" for the trainee');
  if (!/Graded 1 file/.test(await page.evaluate(() => document.getElementById('cmdwAdm').innerText))) fail('🏅 Grade now should say what it graded');
  ok('a trainer overrides an activity\'s and a day\'s grade with a comment (✓ Save), a grade out of range is refused, 🏅 Grade now runs the grading');

  /* 2: the 🏅 Scorecard reads the final grades */
  const sc = await page.evaluate((TID) => { const src = cmScorecard.sources.find((s) => s.id === 'bd'); return src.items({ rec: { id: TID }, data: { 'drive-grades': { 3: { score: 70, passed: true } } }, cf: { days: {} } }); }, TID);
  const d3 = sc.find((x) => x.name === 'Day 3: Backup File Maintenance'), w = sc.find((x) => /✍ Settlement Release/.test(x.name));
  if (!d3 || d3.pct !== 65 || !/trainer/i.test(d3.note)) fail(`the Scorecard's Day 3 should be the trainer's 65%: ${JSON.stringify(d3)}`);
  if (!w || w.pct !== 74 || !/AI 82%/.test(w.note)) fail(`the Scorecard should carry the written work's final grade, the AI's beside it: ${JSON.stringify(w)}`);
  const bs = await page.evaluate((TID) => { const out = [{ grp: 'bd', name: '📂 Backup File Maintenance', pct: 70 }]; cmDriveWork.dayParts({ id: TID }, 3, {}, out); return out; }, TID);
  if (bs[0].pct !== 65 || !bs.some((x) => /✍/.test(x.name) && x.pct === 74)) fail(`the Batch Sheet's day should carry the override and the written work: ${JSON.stringify(bs)}`);
  // a trainee's own progress can't carry a grade: a forged "trainer's grade" there is never read
  const forged = { items: [{ a: 'd3m1-a1', d: 3, t: 'Time-Limit Demand', s: 100, ov: true, c: 'Excellent' }], days: { 1: { s: 100, c: 'ok' }, 3: { s: 100, c: 'ok' } } };
  const fz = await page.evaluate((forged) => { const src = cmScorecard.sources.find((s) => s.id === 'bd'); const data = { 'drive-work': forged, 'drive-grades': { 3: { score: 40, passed: false } } };
    const items = src.items({ rec: { id: 'forger-zz' }, data, cf: { days: {} } }); const out = [{ grp: 'bd', name: '📂 Backup File Maintenance', pct: 40 }]; cmDriveWork.dayParts({ id: 'forger-zz' }, 3, data, out); return { items, out }; }, forged);
  if (JSON.stringify(fz).includes('Excellent') || fz.items.some((x) => /✍/.test(x.name) || x.pct === 100) || fz.out.length !== 1 || fz.out[0].pct !== 40) fail(`a grade the trainee wrote in their own progress must not show as the trainer's: ${JSON.stringify(fz)}`);
  ok('the 🏅 Scorecard and the 📋 Batch Sheet read the final grades (a day\'s override, the written work), from the Worker only, never the trainee\'s progress');

  /* 3: the trainee */
  const p2 = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  p2.on('pageerror', (e) => fail(`page error (trainee): ${e.message}`));
  await p2.route('**/api/drive', answer);
  await p2.goto(BASE, { waitUntil: 'load' }); await p2.waitForTimeout(800);
  await signIn(p2, 'Tia', 'Work' + tag, BATCH);
  await p2.addStyleTag({ content: '#ktLogin{display:none!important}' });
  await p2.evaluate(async () => { goto('dashboard'); render(); await CMDrive.reload(); cmDriveWork.open(); });
  await p2.waitForSelector('#cmDriveHost [data-cmdw-sec] .cmdw-item', { timeout: 10000 }).catch(() => {});
  const mine = await p2.evaluate(() => { const s = document.querySelector('#cmDriveHost [data-cmdw-sec]'); return s ? { text: s.innerText, img: !!s.querySelector('img') } : null; });
  if (!mine) fail('📂 My Backup Drive should show ✍ Your written work, graded');
  else {
    if (!/Your trainer's grade: 74%/.test(mine.text) || !/the AI's: 82%/.test(mine.text) || !/approval is not on file/.test(mine.text)) fail(`the trainee should see the trainer's grade, the AI's beside it, and the comment: "${mine.text.slice(0, 500)}"`);
    if (!/Day 3 · Backup File Maintenance: your trainer's grade 65%/.test(mine.text) || !/Superseded versions left unlabeled/.test(mine.text)) fail('the trainee should see a day\'s override and its comment');
    if (!/What your work shows/.test(mine.text) || !/The standard/.test(mine.text) || !/Why it matters/.test(mine.text) || !/Your next step/.test(mine.text)) fail('the feedback should teach: what your work shows, the standard, why it matters, your next step');
    if (!/Where your written work goes/.test(mine.text)) fail('the trainee should be told where each activity\'s work goes and how to head it');
    if (mine.img || !/<b>the reply<\/b>/.test(mine.text)) fail('a grade\'s text is drawn as text, never markup');
  }
  const kept = await p2.evaluate(async () => { try { return await storeGet('drive-work'); } catch (e) { return null; } });
  if (kept) fail(`the grades must not be kept in the trainee's progress, where the trainee could change them: ${JSON.stringify(kept)}`);
  if (await p2.evaluate(() => typeof PERSONAL_KEYS !== 'undefined' && PERSONAL_KEYS.includes('drive-work'))) fail('"drive-work" must not be a progress key of the trainee\'s');
  if (calls.some((c) => c.action === 'work' && c.traineeId)) fail('the trainee\'s page should ask for its own grades only');
  ok('the trainee sees the final grade, the AI\'s beside it, the trainer\'s comments, feedback that teaches, and where the work goes; none of it kept in their progress');

  await page.evaluate(async (TID) => { try { await sharedDelete('trainee:' + TID); } catch (e) {} }, TID);
  await browser.close();
  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('\n✍ Graded work on the Backup Drive, on the page: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
