// @check browser — A trainee's corrected Batch ID shows on their open page (read from their record, not the device's copy)
// A Batch ID corrected on the trainee's record (by the Portal's sign-in, worker.js, or a trainer) reaches a page that is
// already open: the next read of the record (each sync, the once-a-minute check) takes it (js/cm-batch-live.js), so
// 🏅 My Performance and the batch's open days and videos use the corrected one, and the record keeps it.
// Usage: node .github/scripts/batch-live.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Alex', 'Batchfix', 'B092526');
    const key = await page.evaluate(() => 'trainee:' + state.traineeId);
    const get = () => page.evaluate(async (key) => JSON.parse((await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json())).value || 'null'), key);
    const put = (v) => page.evaluate(([key, v]) => fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(v) }) }), [key, v]);
    const rec = await get(); rec.approved = true; await put(rec);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
    if ((await page.evaluate(() => state.traineeBatch)) !== 'B092526') fail('the page should start with the Batch ID the trainee signed in with');

    // the record is corrected elsewhere; the page reads its record again (as it does every minute)
    const r2 = await get(); r2.batch = 'B092626'; await put(r2);
    await page.evaluate(async () => { await syncToLedger(); });
    const after = await page.evaluate(async () => ({ batch: state.traineeBatch, saved: await storeGet('trainee-batch') }));
    if (after.batch !== 'B092626' || after.saved !== 'B092626') fail(`the open page should take the corrected Batch ID B092626: ${JSON.stringify(after)}`);
    const r3 = await get();
    if (!r3 || r3.batch !== 'B092626') fail(`the record should keep the corrected Batch ID (the page must not write the old one back): ${r3 && r3.batch}`);
    await page.evaluate(() => goto('scorecard'));
    await page.waitForTimeout(1200);
    const head = await page.evaluate(() => ((document.querySelector('.ft-banner-sub') || {}).textContent || ''));
    if (!/B092626/.test(head)) fail(`🏅 My Performance should show the corrected Batch ID: "${head}"`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('A corrected Batch ID on the trainee\'s record reaches their open page (and My Performance) on the next read, and is never written back over.');
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
