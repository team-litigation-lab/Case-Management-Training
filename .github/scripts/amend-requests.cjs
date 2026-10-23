// 📝 The pre-demand audit's Amendment Requests (js/cm-case-flow.js, build/case-flow/exhibits/d3.json "amendments").
//
// A Case Manager never fixes a provider's record. In Pre-Demand Case Auditing (d2m4-a1) the trainee screens the
// records and bills, finds the ones wrong at their source, and writes each provider a request — with Atty. Thorne's
// approval — to correct its own record or statement. The provider's answer brings the corrected copy, which opens
// once their trainer unlocks it, then everywhere the file uses it, and is filed in the CMS the firm's way. Each request ends in
// written feedback on the trainee's work, quoting what their own email did.
// Checks, in a browser: the corrected copies are shut to a trainee until their trainer unlocks them; a screening with a record
// uncalled is refused; a checked screening is scored, marks the wrong call and opens every request (a missed one
// marked so); a request that is too short, that asks the radiologist to change the findings, or that leaves out
// Atty. Thorne is refused with the reason and nothing is sent; a complete one brings the provider's answer, and the trainer's unlock opens
// the corrected copy; the copy is filed in the CMS under the convention (a wrong category refused first); the
// feedback quotes the trainee's own email and counts the refused attempts; the request that brings no corrected copy
// ends in a decision, scored; and all of it survives a reload.
// The CMS is answered by this test (at its real address), so nothing leaves the machine.
// Usage: node .github/scripts/amend-requests.cjs [baseUrl]   (needs `npm i playwright`; a local server on baseUrl)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const CMS = 'lshcasemanagementtraining-trainingcrm.pages.dev';
const CASE_ID = 'LSH-2026-MVA-000041';
const BLOCK = 'd2m4-a1';

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

const cmsPage = () => `<!doctype html><title>CMS (test)</title><body><p>CMS</p><script>
  window.__filed = [];
  const day = () => { const d = new Date(); return d.getFullYear() + '-' + String(d.getMonth()+1).padStart(2,'0') + '-' + String(d.getDate()).padStart(2,'0'); };
  const expected = (category, original) => {
    const type = String(category).replace(/[^A-Za-z0-9]+/g, '-');
    const ext = (/\\.([A-Za-z0-9]{1,8})$/.exec(original || '') || [])[1] || '';
    return ${JSON.stringify(CASE_ID)} + '_Doe-John_' + type + '_' + day() + (ext ? '.' + ext.toLowerCase() : '');
  };
  addEventListener('message', e => {
    const m = e.data || {};
    if (m.lsh === 'cms-case?') return parent.postMessage({lsh:'cms-case', caseId:${JSON.stringify(CASE_ID)}, client:'JOHN DOE', phase:'DEMAND', at:new Date().toISOString()}, '*');
    if (m.lsh === 'cms-doc-file') {
      const want = expected(m.category, m.original);
      if (m.name !== want) return parent.postMessage({lsh:'cms-doc-filed', id:m.id, ok:false, problems:['The name should be "' + want + '".']}, '*');
      window.__filed.push({name:m.name, category:m.category, bytes:(m.bytes && m.bytes.byteLength) || 0});
      return parent.postMessage({lsh:'cms-doc-filed', id:m.id, ok:true, name:m.name, category:m.category, key:'documents/'+m.name, saved:true}, '*');
    }
  });
</script></body>`;

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
    page.on('pageerror', e => failures.push('page error: ' + e.message));
    await page.route(`**://*${CMS}/**`, (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: cmsPage() }));

    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Amend', 'Trainee', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    // the same trainee on every run: start their requests and their filing from nothing
    await page.evaluate(async () => {
        try { localStorage.removeItem('cm-cms-case'); } catch (e) {}
        const r = (await storeGet('case-flow')) || {}; delete r.amend; await storeSet('case-flow', r);
        const f = (await storeGet('doc-filing')) || {}; delete f.RS72; delete f.RS73; await storeSet('doc-filing', f);
        const t = state.traineeId && await sharedGet('trainee:' + state.traineeId); if (t) { t.unlockedCopies = []; await sharedSet('trainee:' + state.traineeId, t); }
        state.adminUnlockedCopies = []; await storeSet('admin-unlocked-copies', []);
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    const A = await page.evaluate((b) => CM_CF_EXHIBITS.amendments[b], BLOCK);
    check(!!A && A.requests.length === 3, `the pre-demand audit has its Amendment Requests: ${A && A.requests.map(q => q.doc).join(', ')}`);

    // 1. the corrected copies are shut to a trainee until their request is answered (trainers see them)
    const shut = await page.evaluate(() => ({ t71: cmDocAvailable(cmDoc('RS72')), t72: cmDocAvailable(cmDoc('RS73')), mri: cmDocAvailable(cmDoc('RS16')) }));
    check(!shut.t71 && !shut.t72, 'the corrected copies are shut to a trainee before their request');
    check(shut.mri, 'and the original record stays open');
    const trainerSees = await page.evaluate(() => { state.isAdmin = true; const v = cmDocAvailable(cmDoc('RS72')); state.isAdmin = false; return v; });
    check(trainerSees, 'a trainer sees the corrected copy always');

    // 2. the workspace opens on the screening; a screening with a record uncalled is refused
    await page.evaluate((b) => cmCaseFlow.amend(b), BLOCK);
    await page.waitForSelector('#cf-am .am-screen');
    const rows = await page.locator('#cf-am .am-screen tbody tr').count();
    check(rows === A.screen.length, `the screening lists all ${A.screen.length} records and bills (${rows})`);
    check(!(await page.$('#cf-am .am-req')), 'and no request is open before the screening is checked');
    await page.evaluate((b) => { cmCaseFlow.amMark(b, 'RS14', 'fit'); cmCaseFlow.amScreen(b); }, BLOCK);
    await page.waitForTimeout(300);
    check(!(await page.$('#cf-am .am-req')), 'a screening with records uncalled is refused');

    // 3. a checked screening is scored; one wrong call (RS23 called fit) is marked, and every request opens
    await page.evaluate(([b, A]) => { const asked = new Set(A.requests.map(q => q.doc));
        A.screen.forEach(s => cmCaseFlow.amMark(b, s.doc, asked.has(s.doc) && s.doc !== 'RS23' ? 'fix' : 'fit')); cmCaseFlow.amScreen(b); }, [BLOCK, A]);
    await page.waitForSelector('#cf-am .am-req');
    const scoreText = await page.locator('#cf-am').innerText();
    check(new RegExp(`Screening: ${A.screen.length - 1} of ${A.screen.length}`).test(scoreText), `the screening is scored: ${(scoreText.match(/Screening: \d+ of \d+/) || [''])[0]}`);
    check((await page.locator('#cf-am .am-screen tr.no').count()) === 1, 'the one wrong call is marked');
    check((await page.locator('#cf-am .am-req').count()) === 3, 'every request opens, the missed one included');
    check(/You missed this one/.test(scoreText), 'and the missed one says so');

    // 4. the MRI request: refused when too short, when it asks for the findings to change, when Atty. Thorne is left out
    const mri = A.requests.find(q => q.doc === 'RS16');
    const send = async (doc, text) => {
        await page.fill(`#amw_${BLOCK}_${doc}`, text);
        await page.evaluate(([b, d]) => cmCaseFlow.amSend(b, d), [BLOCK, doc]);
        await page.waitForTimeout(250);
        return page.evaluate(([b, d]) => { const m = document.getElementById(`amm_${b}_${d}`); return m ? m.innerText : ''; }, [BLOCK, doc]);
    };
    let said = await send('RS16', 'Please fix the date on the MRI.');
    check(/Not sent/.test(said), 'a request too short to do the job is refused');
    said = await send('RS16', mri.model + '\n\nWhile you are at it, please remove any reference to degenerative change from the impression.');
    check(/Not sent/.test(said) && /findings or impression/i.test(said), `a request that asks the radiologist to change the findings is refused, with why: ${said.replace(/\s+/g, ' ').slice(0, 120)}`);
    said = await send('RS16', mri.model.replace(/With Atty\. Elijah Thorne's approval, copied here, /, ''));
    check(/Not sent/.test(said) && /Thorne/.test(said), 'a request that leaves Atty. Thorne out is refused, with the hint');
    check(!(await page.evaluate(() => cmDocAvailable(cmDoc('RS72')))), 'nothing refused opens the corrected copy');
    await send('RS16', mri.model);
    const sentMri = await page.evaluate((b) => (CM_CASE_FLOW, true) && document.getElementById('cf-am').innerText, BLOCK);
    check(/Marisol Ortega/.test(sentMri) && /transcription error/.test(sentMri), 'a complete request brings the provider\'s answer');
    check(!(await page.evaluate(() => cmDocAvailable(cmDoc('RS72')))), 'an answered request does not open the corrected copy by itself');
    check(/opens once your trainer unlocks it/.test(sentMri), 'and the trainee is told their trainer unlocks it');
    await page.evaluate(async (ids) => { /* the trainer's unlock: saved on the trainee record, as Admin → Trainee Audit does */ const r = state.traineeId && await sharedGet('trainee:' + state.traineeId); if (r) { r.unlockedCopies = ids; await sharedSet('trainee:' + state.traineeId, r); } state.adminUnlockedCopies = ids; await storeSet('admin-unlocked-copies', ids); }, ['RS72']);
    check(await page.evaluate(() => cmDocAvailable(cmDoc('RS72'))), 'the corrected copy opens once the trainer unlocks it');
    check(/Sent on attempt 4/.test(sentMri) && /Attempt 2 refused: it asks for the findings/i.test(sentMri), 'the feedback counts the refused attempts and says why each was refused');
    check(/you wrote: “[^”]*02\/16\/2026/.test(sentMri), 'and quotes the trainee\'s own email for what it did');
    check(/The firm's model request/.test(sentMri) && /What this protects/.test(sentMri), 'with what the correction protects, and the firm\'s model to read theirs against');

    // 5. the corrected copy is filed in the CMS: a wrong category is refused, the convention files it
    await page.evaluate(() => openTool('cms', 'split'));
    await page.waitForFunction((id) => window.CMCase && CMCase.id() === id, CASE_ID, { timeout: 15000 }).catch(() => {});
    await page.evaluate((b) => { const o = document.getElementById('cf-am'); if (o) o.remove(); cmCaseFlow.amend(b); }, BLOCK);
    await page.waitForSelector('#cf-am .dfl-row');
    const row = page.locator('#cf-am .dfl-row').first();
    await row.locator('.dfl-cat').selectOption('Bills');
    await row.locator('.dfl-name').fill('x.pdf');
    await row.locator('button').click(); await page.waitForTimeout(400);
    check(/Medical Records, not Bills/.test(await row.innerText()), 'the corrected MRI filed under the wrong category is refused with where the firm files it');
    const day = await page.evaluate(() => { const d = new Date(); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; });
    const name = `${CASE_ID}_Doe-John_Medical-Records_${day}.pdf`;
    await row.locator('.dfl-cat').selectOption('Medical Records');
    await row.locator('.dfl-name').fill(name);
    await row.locator('button').click();
    await page.waitForFunction(() => /Filed in the CMS as/.test((document.querySelector('#cf-am .am-fb') || {}).innerText || ''), null, { timeout: 15000 }).catch(() => {});
    const fb = await page.locator('#cf-am .am-fb').first().innerText();
    check(new RegExp('Filed in the CMS as ' + name.replace(/\./g, '\\.')).test(fb), `the corrected copy is filed under the convention, and the feedback says so: ${name}`);
    check(/after 2 attempts/.test(fb), 'with the attempts the filing took');

    // 6. Crescent's corrected statement; and Riverton's answer, which brings no copy, ends in a decision
    await send('RS26', A.requests.find(q => q.doc === 'RS26').model);
    check(!(await page.evaluate(() => cmDocAvailable(cmDoc('RS73')))), 'Crescent\'s corrected $0.00 statement stays shut on its answer');
    await page.evaluate(async (ids) => { /* the trainer's unlock: saved on the trainee record, as Admin → Trainee Audit does */ const r = state.traineeId && await sharedGet('trainee:' + state.traineeId); if (r) { r.unlockedCopies = ids; await sharedSet('trainee:' + state.traineeId, r); } state.adminUnlockedCopies = ids; await storeSet('admin-unlocked-copies', ids); }, ['RS72', 'RS73']);
    check(await page.evaluate(() => cmDocAvailable(cmDoc('RS73'))), 'and opens once the trainer unlocks it');
    said = await send('RS23', A.requests.find(q => q.doc === 'RS23').model + '\n\nWould you accept less if we pay promptly?');
    check(/Not sent/.test(said) && /reduction/i.test(said), 'a correction request that slips in a reduction is refused');
    await send('RS23', A.requests.find(q => q.doc === 'RS23').model);
    const rr = A.requests.find(q => q.doc === 'RS23');
    check((await page.locator(`input[name="amch_${BLOCK}_RS23"]`).count()) === rr.next.choices.length, 'Riverton\'s answer brings no corrected copy, and a decision to make');
    const right = rr.next.choices.findIndex(c => c.ok), wrong = right === 0 ? 1 : 0;
    await page.evaluate(([b, k]) => cmCaseFlow.amChoose(b, 'RS23', k), [BLOCK, wrong]);
    await page.waitForTimeout(200);
    const after = await page.locator('#cf-am').innerText();
    check(/✕ You chose/.test(after), 'the wrong decision is scored as wrong, with why');
    check(/📋 Your feedback on this skill builder/.test(after) && /Requests: 3 of 3 sent/.test(after), 'once every request is sent, the whole skill builder is reported back');

    // 7. it all survives a reload
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(2200);
    const kept = await page.evaluate((b) => { const r = (window.cmCaseFlow && cmDocAvailable(cmDoc('RS72'))); return r; }, BLOCK);
    check(kept, 'after a reload the corrected copy is still open to the trainee');
    await page.evaluate((b) => cmCaseFlow.amend(b), BLOCK);
    await page.waitForSelector('#cf-am .am-req');
    check(/Sent on attempt 4/.test(await page.locator('#cf-am').innerText()), 'and the requests, the attempts and the feedback are kept');

    await browser.close();
    console.log(failures.length ? `\n${failures.length} check(s) failed` : '\nAmendment Requests: all checks pass');
    process.exit(failures.length ? 1 : 0);
})().catch(e => { console.error(e); process.exit(1); });
