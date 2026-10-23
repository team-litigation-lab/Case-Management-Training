// 🔍 The exhibit audit, the completed package and the Service Confirmation (js/cm-case-flow.js, js/cm-case-flow-exhibits.js).
//
// A Skill Activity that assembles or serves a document set audits the set itself: the trainee calls every
// item (keep · replace · pull · add · flag), hands it in, and only then sees what the file says about each
// one and the completed package. An activity that serves something also gets the Service Confirmation: the
// email that serves the demand on the adjuster, the adjuster's written acknowledgment, the
// follow-up that tests the UPL line, and the exchange converted into a memorandum, filed into the open case
// in the CMS under the firm's convention and backed up to Drive.
// Checks, in a browser: the audit slide is in the day's slides; the workbench lists every item with a call to
// make; a hand-in with an item uncalled is refused and nothing is revealed; a complete hand-in scores, marks
// the wrong call and reveals the completed set; an email that does not do the job is refused with what is
// missing; a complete one brings the acknowledgment; the wrong answer to the follow-up blocks the conversion
// and the right one allows it; the memorandum is built, filed into the CMS under the convention, and backed
// kept on the trainee's Backup Drive in its folder, with the retry for a drive built late; and all of it
// survives a reload and reaches the trainer.
// The CMS is answered by this test (at its real address), so nothing leaves the machine.
// Usage: node .github/scripts/exhibit-audit.cjs [baseUrl]   (needs `npm i playwright`; a local server on baseUrl)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const CMS = 'lshcasemanagementtraining-trainingcrm.pages.dev';
const CASE_ID = 'LSH-2026-MVA-000041';
const BLOCK = 'd3m1-a1';          // Case Flow Day 3: serving the BI Time-Limited Demand
const CATEGORY = 'Others';        // what the service confirmation's convert.category says

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

// The email a Case Manager would actually send: every element the activity requires.
const EMAIL = [
    'Ms. Whitfield,',
    '',
    "Atty. Elijah Thorne signed the Time-Limited Demand on John Doe's bodily injury claim today, and it is",
    'served on you with this email. The complete Demand Package is attached: the demand letter and Exhibits',
    'A through J, 81 pages.',
    '',
    'The acceptance window runs 30 days from your written acknowledgement of receipt, not from the date of',
    'the letter.',
    '',
    'Please confirm by reply the date you received this email and its attachment, and that the package is',
    'complete at 81 pages.',
    '',
    'Any question about the terms, the amount or an extension should go to Atty. Thorne directly; I will route',
    'anything that reaches me to him the same day.',
    '',
    'Case Manager, LSH Law Group'
].join('\n');

// The CMS as the course sees it: which case is open, filing a document whose name follows the convention,
// The Backup Drive is the course's own (js/cm-drive.js, graded on Day 1); here it is stood in for, so
// this test covers that the filing hands the memorandum to it in the right folder, not Google itself.
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
      window.__filed.push({name:m.name, category:m.category, bytes:(m.bytes && m.bytes.byteLength) || 0, mime:m.mime, summary:m.summary});
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
    await signIn(page, 'Audit', 'Trainee', 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    await page.evaluate(() => { try { localStorage.removeItem('cm-cms-case'); } catch (e) {} state.isAdmin = true; });
    // this trainee's name is the same on every run, so start their audit and their email from nothing
    await page.evaluate(async () => {
        const r = (await storeGet('case-flow')) || {};
        delete r.audits; delete r.service;
        await storeSet('case-flow', r);
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    await page.evaluate(() => { state.isAdmin = true; });

    // 1. the audit is a slide of the activity, in the day the course teaches it
    const slide = await page.evaluate(async (block) => {
        const sleep = ms => new Promise(r => setTimeout(r, ms));
        const d = DAYS.find(x => x.cf && x.cf.n === 3);
        goto('day', d.id); state.dayViewMode = 'slides'; await sleep(80);
        const slides = buildDaySlides(d);
        for (let i = 0; i < slides.length; i++) {
            state.lessonSlide = i; render(); await sleep(0);
            const aud = document.querySelector('.cfx-aud');
            if (aud) return { slide: i, of: slides.length, text: aud.textContent.replace(/\s+/g, ' ').trim().slice(0, 200) };
        }
        return null;
    }, BLOCK);
    check(!!slide, `the audit is one of Case Flow Day 3's slides: ${JSON.stringify(slide && slide.slide)} of ${slide && slide.of}`);
    check(!!slide && /Exhibit Packet Audit/.test(slide.text), `and it names the set being audited: ${slide && slide.text.slice(0, 90)}`);
    check(!!slide && !/FINAL as served/.test(slide.text), 'and does not give the completed package away before the audit is handed in');

    const bench = async () => { await page.evaluate((b) => cmCaseFlow.audit(b), BLOCK); await page.waitForSelector('#cf-bench .ab-table'); };
    const benchText = () => page.evaluate(() => document.getElementById('cf-bench').textContent.replace(/\s+/g, ' ').trim());

    // 2. the workbench: every item of the set, with a call to make and a note to write
    await bench();
    const n = await page.evaluate((b) => CM_CF_EXHIBITS.audits[b].items.length, BLOCK);
    check((await page.locator('#cf-bench .ab-table tbody tr').count()) === n, `the workbench lists all ${n} items of the set`);
    check((await page.locator('#cf-bench .ab-sel').count()) === n, 'each one with a call to make');
    check((await page.locator('#cf-bench .ab-note').count()) === n, 'and a note to write');
    check(!/would have cost/i.test(await benchText()), 'and says nothing yet about what each item would cost');

    // 3. a hand-in with an item uncalled is refused, and nothing is revealed
    await page.evaluate((b) => { CM_CF_EXHIBITS.audits[b].items.forEach((it, i) => { if (i) cmCaseFlow.auditMark(b, i, it.verdict); }); cmCaseFlow.auditHandIn(b); }, BLOCK);
    await page.waitForTimeout(400);
    check(!(await page.$('#cf-bench .ab-rev')), 'a hand-in with an item uncalled is refused, and the completed package stays shut');

    // 4. a complete hand-in scores it, marks the wrong call and reveals the completed set
    await page.evaluate((b) => { cmCaseFlow.auditMark(b, 0, 'keep'); cmCaseFlow.auditNote(b, 0, 'called this one wrong on purpose'); cmCaseFlow.auditHandIn(b); }, BLOCK);
    await page.waitForSelector('#cf-bench .ab-rev');
    check((await page.locator('#cf-bench .ab-sc').innerText()).trim() === `${n - 1} of ${n} correct`, `the audit is scored: ${(await page.locator('#cf-bench .ab-sc').innerText()).trim()}`);
    check((await page.locator('#cf-bench .ab-table tr.no').count()) === 1, 'the one wrong call is marked, and the rest are not');
    check(!(await page.$('#cf-bench .ab-sel')), 'the calls are closed once it is handed in');
    const revealed = await page.locator('#cf-bench .ab-rev').innerText();
    check(/FINAL as served/.test(revealed), `and the completed package is revealed: ${revealed.replace(/\s+/g, ' ').slice(0, 110)}`);
    check(/16,401\.40/.test(revealed), 'with the figures the finished set carries, to mark the audit against');
    check(/would have cost|Fix:/.test(await benchText()), 'and every item now says what it would have cost, and the fix');
    await page.evaluate(() => document.getElementById('cf-bench').remove());
    await page.waitForTimeout(600);

    // the completed package is carried forward into the activities that come after
    const forward = await page.evaluate(() => {
        const rev = CM_CF_EXHIBITS.audits['d3m1-a1'].reveal;
        return Object.entries(CM_CF_DOC_PACKETS).filter(([, ids]) => ids.includes(rev)).map(([id]) => id);
    });
    check(forward.length >= 6 && !forward.includes(BLOCK), `the completed Demand Package is carried into ${forward.length} later activities, and not into its own: ${forward.slice(0, 4).join(', ')}…`);

    // 5. the Service Confirmation: an email that does not do the job is refused with what is missing
    await page.evaluate((t) => { window.__E = t; }, EMAIL);
    await page.evaluate((b) => cmCaseFlow.service(b), BLOCK);
    await page.waitForSelector('#cf-sv .sv-write');
    check(!/certified mail|return receipt/i.test(await page.locator('#cf-sv').innerText()) && (await page.locator('#cf-sv .sv-step').first().innerText()).includes('serves the demand'), 'the demand is served by the email itself, with no certified mailing step before it');
    const short = await page.evaluate((b) => { document.querySelector('#cf-sv .sv-write').value = 'Got it, thanks.'; cmCaseFlow.svSend(b); return document.querySelector('#cf-sv .sv-msg').innerText; }, BLOCK);
    check(/Not sent/.test(short), `an email too short to do the job is refused: ${short.replace(/\s+/g, ' ').slice(0, 80)}`);
    const partial = await page.evaluate((b) => {
        document.querySelector('#cf-sv .sv-write').value = window.__E.replace(/30 days/, 'soon').replace(/81 pages/g, 'the full set');
        cmCaseFlow.svSend(b); return document.querySelector('#cf-sv .sv-msg').innerText;
    }, BLOCK);
    check(/Not sent/.test(partial) && /30 days|page count|receipt/i.test(partial), `and one that leaves out what the clock runs from is refused with what is missing: ${partial.replace(/\s+/g, ' ').slice(0, 120)}`);
    check(!(await page.$('#cf-sv .sv-sentmail')), 'nothing is sent while it is incomplete');

    // 6. a complete email brings the adjuster's acknowledgment
    await page.evaluate((b) => { document.querySelector('#cf-sv .sv-write').value = window.__E; cmCaseFlow.svSend(b); }, BLOCK);
    await page.waitForSelector('#cf-sv .sv-sentmail');
    const thread = await page.locator('#cf-sv').innerText();
    check(/Confirming receipt/.test(thread), 'a complete email brings her written acknowledgment');
    check(/07\/22\/2026|07\/2\d\/20\d\d/.test(thread), 'which fixes the date the acceptance window runs from, from the carrier itself');

    // 7. the follow-up tests the UPL line: the wrong answer blocks the conversion, the right one allows it
    const convertBtn = page.locator('#cf-sv button:has-text("Convert the thread")');
    check(await convertBtn.isDisabled(), 'the conversion waits until the follow-up is answered');
    const wrong = await page.evaluate((b) => CM_CF_EXHIBITS.emails[b].press.choices.findIndex(c => !c.ok), BLOCK);
    const right = await page.evaluate((b) => CM_CF_EXHIBITS.emails[b].press.choices.findIndex(c => c.ok), BLOCK);
    await page.evaluate((a) => cmCaseFlow.svChoose(a.b, a.i), { b: BLOCK, i: wrong });
    await page.waitForSelector('#cf-sv .sv-ch.no');
    check(await convertBtn.isDisabled(), 'an answer that moves a deadline the attorney set does not let the work go on');
    check((await page.locator('#cf-sv .sv-ch.ok').count()) === 1, 'and the answer that routes it to Atty. Thorne is shown instead');
    // The answer is final once given, as it should be. To reach the step that follows it, put the right answer
    // on the record directly and reload, which also proves the whole exchange survives a reload.
    await page.evaluate(() => { const o = document.getElementById('cf-sv'); if (o) o.remove(); });
    await page.evaluate(async (a) => {
        const r = (await storeGet('case-flow')) || {};
        if (r.service && r.service[a.b]) { r.service[a.b].choice = a.i; await storeSet('case-flow', r); }
    }, { b: BLOCK, i: right });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    await page.evaluate(() => { state.isAdmin = true; });
    await page.evaluate((b) => cmCaseFlow.service(b), BLOCK);
    await page.waitForSelector('#cf-sv .sv-step');
    check(/Confirming receipt/.test(await page.locator('#cf-sv').innerText()), 'the sent email and her acknowledgment are still there after a reload');
    check(!(await page.locator('#cf-sv button:has-text("Convert the thread")').isDisabled()), 'and with the follow-up answered correctly the exchange can be converted');

    // 8. the exchange becomes a document, filed into the CMS under the convention, and kept on the Drive.
    // The Backup Drive is stood in for, so what is covered is that the filing hands the document over in the
    // right folder, not Google itself. It has to go in after the reload above, or js/cm-drive.js is the one in
    // place when the document is filed; the stub marks itself so that mistake fails here instead of quietly
    // weakening what follows.
    const standInForDrive = () => page.evaluate(() => {
        window.__drive = null;
        window.CMDrive = { __stub: true, saveFiled: async (folder, name) => { window.__drive = { folder, name }; return { ok: true, folder: `LSH Case Backups / 01 Clients / Doe-John / 05 ${folder}` }; } };
    });
    await standInForDrive();
    await page.evaluate(() => openTool('cms', 'split'));
    await page.waitForFunction((id) => window.CMCase && CMCase.id() === id, CASE_ID, { timeout: 15000 }).catch(() => {});
    check((await page.evaluate(() => window.CMCase && CMCase.id())) === CASE_ID, 'the case open in the CMS is read from it');
    check((await page.locator('#cf-sv').count()) === 1, 'the workspace does not open a second copy of itself over the first');
    await page.evaluate((b) => cmCaseFlow.service(b), BLOCK);
    check((await page.locator('#cf-sv').count()) === 1, 'and pressing the button again does not either');
    await page.evaluate((b) => cmCaseFlow.svConvert(b), BLOCK);
    await page.waitForSelector('#cf-sv .sv-ok', { timeout: 20000 });
    check(/page[s]? built/.test(await page.locator('#cf-sv').innerText()), 'the thread is converted into a memorandum');
    const frame = page.frames().find(f => /trainingcrm/.test(f.url()));
    // a name that does not follow the convention files nothing
    await page.evaluate((b) => { document.getElementById('svn_' + b).value = 'service email.pdf'; return cmCaseFlow.svFile(b); }, BLOCK);
    await page.waitForTimeout(600);
    check(/The name should be/.test(await page.locator('#cf-sv').innerText()), 'a name that does not follow the firm\'s convention is refused by the CMS');
    check((await frame.evaluate(() => window.__filed.length)) === 0, 'and nothing is filed');
    const name = await page.evaluate((a) => {
        const d = new Date(), day = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        return `${a.id}_Doe-John_${a.cat.replace(/[^A-Za-z0-9]+/g, '-')}_${day}.pdf`;
    }, { id: CASE_ID, cat: CATEGORY });
    await page.evaluate((a) => { document.getElementById('svn_' + a.b).value = a.name; return cmCaseFlow.svFile(a.b); }, { b: BLOCK, name });
    await page.waitForTimeout(900);
    const filed = await frame.evaluate(() => window.__filed[0] || null);
    check(!!filed && filed.name === name, `the memorandum is filed in the CMS under the convention: ${JSON.stringify(filed && filed.name)}`);
    check(!!filed && filed.category === CATEGORY, `under the category the activity files it in: ${filed && filed.category}`);
    check(!!filed && filed.bytes > 1000, `as a real PDF, not a placeholder: ${filed && filed.bytes} bytes`);
    check(!!filed && filed.mime === 'application/pdf', 'sent as the PDF it is');
    check(await page.evaluate(() => !!(window.CMDrive && window.CMDrive.__stub)), 'the Backup Drive under test is the stand-in, so what follows means what it says');
    const kept = await page.evaluate(() => window.__drive || null);
    check(!!kept && kept.name === name, `the same filing keeps a copy on the trainee's Backup Drive, under the name the CMS gave it: ${kept && kept.name}`);
    check(!!kept && kept.folder === 'insurance', `in the folder this kind of document belongs in, not one the trainee picks: ${kept && kept.folder}`);
    // the step's own words: "Backup Drive" appears in every state of it, the not-kept state included, so the
    // done marker is what is checked — and that the not-kept wording is gone.
    const driveStep = await page.locator('#cf-sv .sv-step').nth(5).innerText();
    check(/✓ Kept on your Backup Drive under/.test(driveStep), `the step says the copy was kept, and names the folder: ${driveStep.replace(/\s+/g, ' ').slice(0, 110)}`);
    // the step's standing note explains what happens when a drive isn't built, so the absence to check is the
    // offer to do it, not that wording
    check(!/Keep it on my Backup Drive|File it in the CMS first/.test(driveStep), 'and no longer offers to do it by hand');

    // 8b. the retry, for a trainee who files before building their drive: the copy is made from the document
    // they already built, and the step only turns green when the drive actually takes it.
    await page.evaluate(async (b) => {
        const r = (await storeGet('case-flow')) || {};
        if (r.service && r.service[b]) { delete r.service[b].drive; r.service[b].driveWhy = 'no-drive'; await storeSet('case-flow', r); }
    }, BLOCK);
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    await page.evaluate(() => { state.isAdmin = true; });
    await page.evaluate((b) => cmCaseFlow.service(b), BLOCK);
    await page.waitForSelector('#cf-sv .sv-step');
    const notKept = await page.locator('#cf-sv .sv-step').nth(5).innerText();
    check(/Keep it on my Backup Drive/.test(notKept) && !/✓ Kept on your Backup Drive/.test(notKept),
        `a filing that never reached the drive offers to do it, after a reload: ${notKept.replace(/\s+/g, ' ').slice(0, 100)}`);
    // with no drive at all, the retry refuses and says what to do rather than reporting success
    await page.evaluate(() => { delete window.CMDrive; });
    await page.evaluate((b) => cmCaseFlow.svDrive(b), BLOCK);
    await page.waitForTimeout(600);
    check(!/✓ Kept on your Backup Drive/.test(await page.locator('#cf-sv').innerText()), 'the retry does not claim success when there is no drive to take it');
    await standInForDrive();
    await page.evaluate((b) => cmCaseFlow.svDrive(b), BLOCK);
    await page.waitForTimeout(900);
    const late = await page.evaluate(() => window.__drive || null);
    check(!!late && late.folder === 'insurance' && late.name === name, `and once the drive is built the copy is made, same folder, same name: ${JSON.stringify(late)}`);
    check(/✓ Kept on your Backup Drive under/.test(await page.locator('#cf-sv .sv-step').nth(5).innerText()), 'and the step turns green only then');

    // 9. all of it reaches the trainer
    const trainer = await page.evaluate(async () => {
        const r = (await storeGet('case-flow')) || {};
        const a = (r.audits || {})['d3m1-a1'] || {}, s = (r.service || {})['d3m1-a1'] || {};
        return { marks: (a.marks || []).filter(Boolean).length, handedIn: !!a.at, note: (a.notes || [])[0] || '',
                 tries: s.tries || 0, body: (s.body || '').length, choice: s.choice, filed: (s.filed || {}).name || '', drive: !!s.drive };
    });
    check(trainer.handedIn && trainer.marks === n, `the trainee's audit is on their record: ${trainer.marks} calls, handed in`);
    check(/wrong on purpose/.test(trainer.note), 'with the notes they wrote');
    check(trainer.tries === 2 && trainer.body > 400, `their email and its rejected attempts are too: ${trainer.tries} refused, ${trainer.body} characters sent`);
    check(trainer.choice === right && !!trainer.filed && trainer.drive, `and the answer they gave, what they filed and the Backup Drive copy: ${trainer.filed}`);

    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: the set is audited, the completed package is revealed and carried forward, and the service confirmation is filed and kept on the Backup Drive.');
})().catch(e => { console.error(e); process.exit(1); });
