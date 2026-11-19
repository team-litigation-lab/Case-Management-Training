// @check browser — 🛠 Account Repair (its own Admin section): finds two accounts of one trainee, a redirected sign-in and a Knowledge Check missing from the record; its dry runs change nothing; a confirmed merge keeps every attempt and the Portal's current id, and the 🏅 Scorecard shows the recovered KC
// js/cm-account-repair.js with worker-account-repair.js (/api/account-merge, /api/kc-restore), in a real browser:
//   1. seeded on the server: Ann Lee… (B250926, the older account: Day 1 at 60%, and a Day 2 KC at 85% only in its work-log)
//      and Anne Lee… (B092526, the Portal's current name and id: Day 1 at 90%, Day 3 at 75%); Cara Solo… (Day 1 at 88% only in
//      her progress snapshot); a redirect into an account that no longer exists; a Portal name whose id was redirected;
//   2. 🛠 Account Repair is its own section pill; it lists Ann and Anne as one person (B250926 and B092526 are one batch),
//      flags the broken redirect as locked out and the redirected Portal name, and flags the missing KCs;
//   3. 🔍 Preview merge shows the dry-run table (day, record value, recovered value, source) and changes no key;
//   4. before the merge, Anne's 🏅 Scorecard card has no Day 2 Knowledge Check;
//   5. ✔ Merge: the kept id is Anne's (the Portal's current one); Day 1 keeps both attempts (60 and 90), Day 2 (85) and
//      Day 3 (75) are on it; Ann's record stays until the merge is run again once merged:<Ann> → Anne is 2 minutes old,
//      and is gone then; backups of both are kept; in between, Ann's sign-in reads "Merge not finished" (not "Locked out"),
//      with 🔁 Finish the merge (its dry run in 👥, Merge into Anne, nothing changed before the confirm) and no 🔓 Remove
//      redirect, and the 👥 card says the merge has run once;
//   6. Anne's 🏅 Scorecard card shows the Day 2 Knowledge Check at 85%;
//   7. Restore missing KC scores for Cara: the dry run changes nothing; confirmed, trainee:<Cara> has Day 1 at 88% and a backup;
//   8. a merged:<id> left on a live record is flagged, and 🔓 Remove redirect deletes it (backed up) once confirmed;
//   9. the 📋 Batch Sheet's 👥 Merge goes through the Worker (cmAccountRepair.mergeIds): dry run, confirm, that merge.
// Usage: node .github/scripts/account-repair-ui.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const sleep = ms => new Promise(r => setTimeout(r, ms));
const T = (d, h = 10) => `2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00.000Z`;
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } }), page = await ctx.newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    let dialogs = 'fail';   // (steps 8 and 9 confirm the Worker's dry run in a native dialog)
    page.on('dialog', d => { if (dialogs === 'accept') return d.accept(); fail(`a native dialog opened: ${d.message()}`); d.dismiss(); });
    await page.goto(BASE, { waitUntil: 'load' }); await sleep(1000);
    await page.waitForFunction(() => !!window.cmAccountRepair && typeof DAYS !== 'undefined', null, { timeout: 15000 }).catch(() => fail('js/cm-account-repair.js is not loaded'));
    const sfx = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
    const A = `ann-lee${sfx}--b250926`, B = `anne-lee${sfx}--b092526`, C = `cara-solo${sfx}--b101526`, D = `bob-ray${sfx}--b100926`, Dnow = `bob-ray${sfx}--b110926`;
    const UID = 'U-' + sfx;
    const days = await page.evaluate(() => DAYS.filter(d => d.cf).slice(0, 3).map(d => ({ id: d.id, n: d.cf.n })));
    const [d1, d2, d3] = days.map(d => d.id);
    const kc = (score, date) => ({ score, done: score >= 70, date, history: [{ score, passed: score >= 70, date }] });

    // 1. the records, as the server holds them (open mode: this page may write any key)
    const recA = { id: A, name: `Ann Lee${sfx}`, batch: 'B250926', approved: true, registeredAt: T(1), lastActive: T(5), dayProgress: { [d1]: kc(60, T(2)) } };
    const recB = { id: B, name: `Anne Lee${sfx}`, batch: 'B092526', approved: true, portalUid: UID, registeredAt: T(6), lastActive: T(8), dayProgress: { [d1]: kc(90, T(7)), [d3]: kc(75, T(8)) } };
    const recC = { id: C, name: `Cara Solo${sfx}`, batch: 'B101526', approved: true, registeredAt: T(3), lastActive: T(4), dayProgress: {} };
    const recD = { id: D, name: `Bob Ray${sfx}`, batch: 'B100926', approved: true, portalUid: UID + 'b', registeredAt: T(2), lastActive: T(3), dayProgress: {} };
    const seed = {
        ['trainee:' + A]: recA, ['progress:' + A]: { traineeId: A, savedAt: T(5), data: { 'day-progress': recA.dayProgress, 'work-log': [{ kind: 'quiz', dayId: d2, score: 85, at: T(4) }] } },
        ['trainee:' + B]: recB, ['progress:' + B]: { traineeId: B, savedAt: T(8), data: { 'day-progress': recB.dayProgress } },
        ['uid:' + UID]: { id: B, name: `Anne Lee${sfx}`, batch: 'B092526', at: T(8) },
        ['trainee:' + C]: recC, ['progress:' + C]: { traineeId: C, savedAt: T(4), data: { 'day-progress': { [d1]: kc(88, T(4)) } } },
        ['trainee:' + D]: recD, ['uid:' + UID + 'b']: { id: D, name: `Bob Ray${sfx}`, batch: 'B110926', at: T(3) },
        [`merged:${Dnow}`]: { into: D, at: T(3), by: 'portal-batch' },
        [`merged:old-gone${sfx}`]: { into: `nobody${sfx}`, at: T(3), by: 'portal-batch' },
        // a redirect the old Batch Sheet merge left on a live record (it never deleted merged:<keep>)
        [`trainee:eve-lock${sfx}--b100926`]: { id: `eve-lock${sfx}--b100926`, name: `Eve Lock${sfx}`, batch: 'B100926', approved: true, registeredAt: T(2), lastActive: T(3), dayProgress: {} },
        [`merged:eve-lock${sfx}--b100926`]: { into: `gone${sfx}`, at: T(3) },
        // two accounts the 📋 Batch Sheet's 👥 Merge merges through the Worker
        [`trainee:fay-two${sfx}--b100926`]: { id: `fay-two${sfx}--b100926`, name: `Fay Two${sfx}`, batch: 'B100926', approved: true, registeredAt: T(2), lastActive: T(3), dayProgress: { [d1]: kc(50, T(2)) } },
        [`trainee:fay-two${sfx}--b100926x`]: { id: `fay-two${sfx}--b100926x`, name: `Fay Two${sfx}`, batch: 'B100926x', approved: true, registeredAt: T(4), lastActive: T(5), dayProgress: { [d1]: kc(80, T(4)) } }
    };
    await page.evaluate(async (seed) => { for (const [key, v] of Object.entries(seed)) {
        const r = await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(v) }) });
        if (!r.ok) throw new Error('seed ' + key + ' ' + r.status); } }, seed);
    // every key of this test's, as stored (others' checks run beside it on the same server)
    const mine = () => page.evaluate(async (sfx) => {
        const post = (p, b) => fetch(p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json());
        const keys = ((await post('/api/storage/list', { prefix: '' })).keys || []).filter(k => k.includes(sfx)).sort();
        const out = {};
        for (let i = 0; i < keys.length; i += 100) Object.assign(out, (await post('/api/storage/get-many', { keys: keys.slice(i, i + 100) })).values || {});
        return out;
    }, sfx);
    const get = async (key) => { const all = await mine(); return all[key] != null ? JSON.parse(all[key]) : null; };
    // (a merge deletes the other account's keys only when run again once its redirect is 2 minutes old: worker-account-repair.js
    // SETTLE_MS. The test makes the redirect old, then runs the merge again through cmAccountRepair.mergeIds)
    const settle = (id) => page.evaluate(async (id) => {
        const post = (p, b) => fetch(p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(b) }).then(r => r.json());
        const m = JSON.parse((await post('/api/storage/get', { key: 'merged:' + id })).value || '{}');
        await post('/api/storage/set', { key: 'merged:' + id, value: JSON.stringify(Object.assign(m, { at: new Date(Date.now() - 3 * 60000).toISOString() })) });
    }, id);
    const finish = async (ids, keep) => { await settle(ids[1]); dialogs = 'accept'; const r = await page.evaluate(([ids, keep]) => cmAccountRepair.mergeIds(ids, keep), [ids, keep]); dialogs = 'fail'; return r; };

    const open = (tab) => page.evaluate(async (tab) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        state.isAdmin = true; state.adminTab = tab; goto('admin'); render(); await new Promise(r => setTimeout(r, 300)); render();
    }, tab);
    const repair = async () => {
        await open('accountrepair');
        await page.evaluate(() => { cmAccountRepair.state.at = 0; cmAccountRepair.load(); });
        await page.waitForFunction(() => !!document.querySelector('#carDupes') && !cmAccountRepair.state.loading, null, { timeout: 20000 }).catch(() => fail('🛠 Account Repair never drew its lists'));
        await sleep(200);
    };

    // 2. the panel finds them
    await repair();
    const found = await page.evaluate(([A, B, C, D, Dnow, sfx]) => {
        const pills = [...document.querySelectorAll('.cmsh-sec')].map(b => b.textContent.replace(/\d+$/, '').trim());
        const active = [...document.querySelectorAll('.cmsh-sec.active')].map(b => b.textContent.trim());
        const g = [...document.querySelectorAll('[data-group]')].find(x => x.getAttribute('data-group').split('|').includes(A));
        const locked = [...document.querySelectorAll('[data-locked]')].map(r => ({ from: r.getAttribute('data-locked'), text: r.innerText }));
        const kcs = [...document.querySelectorAll('[data-kc]')].map(x => ({ id: x.getAttribute('data-kc'), text: x.innerText }));
        return { pills, active, group: g ? g.getAttribute('data-group') : null, groupText: g ? g.innerText : '', banner: (document.querySelector('.cmsh-banner') || {}).textContent || '',
            gone: locked.find(x => x.from === 'old-gone' + sfx), redirected: locked.find(x => x.from === Dnow), kcA: kcs.find(x => x.id === A), kcB: kcs.find(x => x.id === B), kcC: kcs.find(x => x.id === C), kcD: kcs.find(x => x.id === D) };
    }, [A, B, C, D, Dnow, sfx]);
    if (!found.pills.includes('🛠 Account Repair')) fail(`🛠 Account Repair should be an Admin section pill: ${found.pills.join(' · ')}`);
    if (!/Account Repair/.test(found.active.join(' '))) fail(`🛠 Account Repair should be the open section: ${found.active}`);
    if (!/Account Repair/.test(found.banner)) fail(`the page should have the navy banner "🛠 Account Repair": "${found.banner}"`);
    if (found.group !== [A, B].sort().join('|')) fail(`Ann (B250926) and Anne (B092526) should be one person's two accounts: ${found.group}`);
    else if (!/first initial and last name/.test(found.groupText)) fail(`the group should say why (the same first initial and last name in an equivalent batch): ${found.groupText.slice(0, 300)}`);
    if (!found.gone || !/Locked out/.test(found.gone.text)) fail(`a redirect into an account that no longer exists should be flagged locked out: ${JSON.stringify(found.gone)}`);
    if (!found.redirected || !/Redirected/.test(found.redirected.text) || !found.redirected.text.includes(D)) fail(`the Portal's current name (Bob, B110926) built a redirected id: it should be flagged: ${JSON.stringify(found.redirected)}`);
    if (!found.kcA || !/85%/.test(found.kcA.text) || !/work-log/.test(found.kcA.text)) fail(`Ann's Day 2 KC (85%, in the work-log only) should be flagged missing: ${JSON.stringify(found.kcA)}`);
    if (!found.kcC || !/88%/.test(found.kcC.text) || !/progress snapshot/.test(found.kcC.text)) fail(`Cara's Day 1 KC (88%, in the snapshot only) should be flagged missing: ${JSON.stringify(found.kcC)}`);
    if (found.kcB || found.kcD) fail('an account whose record has every KC it took should not be flagged');

    // 3. the dry run changes nothing
    const before = JSON.stringify(await mine());
    await page.click(`[data-group="${[A, B].sort().join('|')}"] [data-ar="preview"]`);
    await page.waitForSelector('[data-dry]', { timeout: 15000 }).catch(() => fail('🔍 Preview merge showed no dry run'));
    const dry = await page.evaluate(() => { const d = document.querySelector('[data-dry]'); if (!d) return null;
        return { text: d.innerText, head: [...d.querySelectorAll('.car-days th')].map(t => t.textContent), rows: [...d.querySelectorAll('.car-days tbody tr')].map(r => [...r.cells].map(c => c.innerText)), btn: (d.querySelector('[data-ar="merge"]') || {}).textContent || '' }; });
    if (dry) {
        if (JSON.stringify(dry.head) !== JSON.stringify(['Day', 'Record value', 'Recovered value', 'Source'])) fail(`the dry-run table's columns: ${dry.head}`);
        if (!/nothing has been changed/i.test(dry.text) || !/back up/.test(dry.text) || !/only then delete/.test(dry.text)) fail(`the dry run should say plainly what a merge will do: ${dry.text.slice(0, 600)}`);
        if (!dry.btn.includes(B)) fail(`the merge should keep Anne's id (the Portal's current one, ${B}): "${dry.btn}"`);
        const r2 = dry.rows.find(r => /Day 2/.test(r[0]));
        if (!r2 || r2[1] !== '—' || !/85%/.test(r2[2]) || !/work-log:/.test(r2[3])) fail(`Day 2's row: — on the record, 85% recovered from Ann's work-log: ${JSON.stringify(r2)}`);
        const r1 = dry.rows.find(r => /Day 1/.test(r[0]));
        if (!r1 || !/90%/.test(r1[1]) || !/2 attempts/.test(r1[2])) fail(`Day 1's row: the kept record's 90%, both attempts recovered: ${JSON.stringify(r1)}`);
    }
    await sleep(300);
    if (JSON.stringify(await mine()) !== before) fail('the dry run changed a record');

    // 4. before the merge, Anne's scorecard has no Day 2 Knowledge Check
    const card = async (id) => {
        await open('scorecards');
        await page.evaluate((id) => { cmScorecard.refresh(); cmScorecard.only(id); }, id);
        await page.waitForFunction(() => !!document.querySelector('.bs-pt'), null, { timeout: 20000 }).catch(() => fail('🏅 Scorecards never drew a card'));
        await sleep(300);
        return page.evaluate(() => [...document.querySelectorAll('.bs-pt')].map(x => x.innerText).join('\n'));
    };
    const n2 = days[1].n;
    // the card's 📅 Day scores: Day 2's part, up to Day 3's ("✍️ Knowledge Check 85%")
    const day2 = (t) => { const i = t.indexOf(`Day ${n2}: `), j = t.indexOf(`Day ${days[2].n}: `, i + 1); return i < 0 ? '' : t.slice(i, j > i ? j : undefined); };
    const has2 = (t) => /Knowledge Check 85%/.test(day2(t));
    let cardB = await card(B);
    if (!/Knowledge Check/.test(cardB)) fail(`Anne's card should show her Knowledge Checks: ${cardB.slice(0, 400)}`);
    if (/Knowledge Check/.test(day2(cardB))) fail(`before the merge Anne's card should have no Day ${n2} Knowledge Check`);

    // 5. the confirmed merge
    await repair();
    await page.click(`[data-group="${[A, B].sort().join('|')}"] [data-ar="preview"]`);
    await page.waitForSelector('[data-dry] [data-ar="merge"]', { timeout: 15000 }).catch(() => {});
    await page.click('[data-dry] [data-ar="merge"]');
    await page.waitForFunction(() => /Merged /.test([...document.querySelectorAll('.car-msg')].map(m => m.textContent).join(' ')) || !!document.querySelector('.car-msg.no'), null, { timeout: 20000 }).catch(() => fail('✔ Merge gave no answer'));
    const msg = await page.evaluate(() => [...document.querySelectorAll('.car-msg')].map(m => m.textContent).join(' | '));
    if (!msg.includes(`Merged ${A} into ${B}`)) fail(`the merge should keep ${B}: ${msg}`);
    const after = await mine();
    const rb = after['trainee:' + B] ? JSON.parse(after['trainee:' + B]) : {};
    const dp = rb.dayProgress || {};
    if (!dp[d1] || (dp[d1].history || []).map(h => h.score).join(',') !== '60,90' || dp[d1].done !== true) fail(`Day 1 should keep both attempts (60, 90), passed: ${JSON.stringify(dp[d1])}`);
    if (!dp[d2] || dp[d2].score !== 85 || dp[d2].done !== true) fail(`Day 2 (85%, from Ann's work-log) should be on the kept record: ${JSON.stringify(dp[d2])}`);
    if (!dp[d3] || dp[d3].score !== 75) fail(`Day 3 (75%) should stay: ${JSON.stringify(dp[d3])}`);
    if (rb.portalUid !== UID || !(rb.mergedFrom || []).includes(A)) fail(`the kept record should keep the Portal id and list ${A} in mergedFrom: ${JSON.stringify({ uid: rb.portalUid, from: rb.mergedFrom })}`);
    if (after['trainee:' + A] == null || !/run this merge again/i.test(msg)) fail(`the merged-away record should stay until the merge is run again after its redirect settles: ${msg}`);
    if (!after['merged:' + A] || JSON.parse(after['merged:' + A]).into !== B) fail(`merged:${A} should send Ann's sign-in to ${B}`);
    if (!after['uid:' + UID] || JSON.parse(after['uid:' + UID]).id !== B) fail(`uid:${UID} should open ${B}`);
    if (!Object.keys(after).some(k => k.startsWith(`backup:${A}:`)) || !Object.keys(after).some(k => k.startsWith(`backup:${B}:`))) fail(`backups of both accounts should be kept: ${Object.keys(after).filter(k => k.startsWith('backup:'))}`);
    const pb = after['progress:' + B] ? JSON.parse(after['progress:' + B]) : {};
    if (!(Date.parse(pb.savedAt || '') > Date.parse(T(8)))) fail(`progress:${B}.savedAt should be the server's now, so the kept device restores it: ${pb.savedAt}`);

    // 5b. the merge has run once: Ann's sign-in is a merge to finish, never a lock-out whose redirect is removed
    await repair();
    const AB = [A, B].sort().join('|');
    const pend = await page.evaluate(([A, AB]) => {
        const row = document.querySelector(`[data-locked="${A}"]`), g = document.querySelector(`[data-group="${AB}"]`);
        return { text: row ? row.innerText : '', finish: !!(row && row.querySelector('[data-ar="finish"]')), remove: !!(row && row.querySelector('[data-ar="unredirect"]')), hint: g ? (g.querySelector(`[data-pending="${A}"]`) || {}).textContent || '' : '' };
    }, [A, AB]);
    if (!/Merge not finished/.test(pend.text) || /Locked out/.test(pend.text) || !pend.finish || pend.remove) fail(`a merge that has run once should read "Merge not finished", with 🔁 Finish the merge and no 🔓 Remove redirect: ${JSON.stringify(pend)}`);
    if (!pend.hint.includes(B)) fail(`the 👥 card of ${A} and ${B} should say the merge into ${B} has run once and how to finish it: "${pend.hint}"`);
    if (pend.finish) {
        const beforeFinish = JSON.stringify(await mine());
        await page.click(`[data-locked="${A}"] [data-ar="finish"]`);
        await page.waitForSelector(`[data-dry="${AB}"] [data-ar="merge"]`, { timeout: 15000 }).catch(() => fail('🔁 Finish the merge showed no dry run in 👥'));
        const finishBtn = await page.evaluate((AB) => { const b = document.querySelector(`[data-dry="${AB}"] [data-ar="merge"]`); return b ? b.textContent : ''; }, AB);
        if (!finishBtn.includes(B)) fail(`🔁 Finish the merge should offer ✔ Merge into ${B}: "${finishBtn}"`);
        await sleep(300);
        if (JSON.stringify(await mine()) !== beforeFinish) fail('🔁 Finish the merge changed a record before its confirm');
    }

    const fin = await finish([B, A], B);
    if (!fin.ok || (await get('trainee:' + A)) != null) fail(`run again once the redirect settled, the merge should delete the merged-away record: ${JSON.stringify(fin)}`);
    // 6. the scorecard shows the KC
    cardB = await card(B);
    if (!has2(cardB)) fail(`after the merge Anne's card should show the Day ${n2} Knowledge Check at 85%: ${cardB.slice(0, 1500)}`);

    // 7. Restore missing KC scores for Cara
    await repair();
    const left = await page.evaluate(([A, C]) => ({ a: !!document.querySelector(`[data-kc="${A}"]`), c: !!document.querySelector(`[data-kc="${C}"]`), g: [...document.querySelectorAll('[data-group]')].some(x => x.getAttribute('data-group').split('|').includes(A)) }), [A, C]);
    if (left.a || left.g) fail('after the merge Ann should be neither a duplicate nor a missing KC any more');
    if (!left.c) fail('Cara should still be flagged before her restore');
    const beforeC = JSON.stringify(await mine());
    await page.click(`[data-kc="${C}"] [data-ar="kcpreview"]`);
    await page.waitForSelector(`[data-kcdry="${C}"]`, { timeout: 15000 }).catch(() => fail('Restore missing KC scores showed no dry run'));
    const kd = await page.evaluate((C) => { const d = document.querySelector(`[data-kcdry="${C}"]`); return d ? { text: d.innerText, rows: [...d.querySelectorAll('tbody tr')].map(r => [...r.cells].map(c => c.innerText)) } : null; }, C);
    if (kd && (!kd.rows.length || !/88%/.test(kd.rows[0][2]) || !/progress:/.test(kd.rows[0][3]) || !/back up/.test(kd.text))) fail(`Cara's dry run: Day 1 at 88% from her snapshot, and what it will do: ${JSON.stringify(kd)}`);
    await sleep(300);
    if (JSON.stringify(await mine()) !== beforeC) fail('the KC restore dry run changed a record');
    await page.click(`[data-kcdry="${C}"] [data-ar="kcrestore"]`);
    await page.waitForFunction(() => /Restored/.test([...document.querySelectorAll('.car-msg')].map(m => m.textContent).join(' ')), null, { timeout: 15000 }).catch(() => fail('✔ Restore gave no answer'));
    const rc = await get('trainee:' + C);
    if (!rc || !rc.dayProgress[d1] || rc.dayProgress[d1].score !== 88 || rc.dayProgress[d1].done !== true) fail(`trainee:${C} should have Day 1 at 88%: ${JSON.stringify(rc && rc.dayProgress)}`);
    if (!Object.keys(await mine()).some(k => k.startsWith(`backup:${C}:`))) fail('the restore should back the record up first');

    // 8. 🔓 a redirect left on a live record: flagged, and removed (backed up) only once confirmed
    const E = `eve-lock${sfx}--b100926`;
    await repair();
    if (!(await page.$(`[data-locked="${E}"] [data-ar="unredirect"]`))) fail(`merged:${E} on a live record should be flagged with 🔓 Remove redirect`);
    else {
        dialogs = 'accept';
        await page.click(`[data-locked="${E}"] [data-ar="unredirect"]`);
        await page.waitForFunction((E) => [...document.querySelectorAll('.car-msg')].some(m => m.textContent.includes('Removed merged:' + E)), E, { timeout: 15000 }).catch(() => fail('🔓 Remove redirect gave no answer'));
        const ae = await mine();
        if (ae['merged:' + E] != null || !Object.keys(ae).some(k => k.startsWith(`backup:${E}:`))) fail(`merged:${E} should be removed, backed up first: ${Object.keys(ae).filter(k => k.includes('eve-lock'))}`);
        dialogs = 'fail';
    }
    // 9. the 📋 Batch Sheet's 👥 Merge goes through the Worker (cmAccountRepair.mergeIds): its dry run, then exactly that merge
    const F1 = `fay-two${sfx}--b100926`, F2 = `fay-two${sfx}--b100926x`;
    if (!(await page.evaluate(() => window.cmBatchSheet && String(cmBatchSheet.dupMerge).includes('mergeIds')))) fail("the Batch Sheet's 👥 Merge should go through cmAccountRepair.mergeIds");
    dialogs = 'accept';
    const mr = await page.evaluate(([F1, F2]) => cmAccountRepair.mergeIds([F1, F2], F1), [F1, F2]);
    dialogs = 'fail';
    if (mr.ok) await finish([F1, F2], F1);
    const af = await mine();
    const f1 = af['trainee:' + F1] ? JSON.parse(af['trainee:' + F1]) : {};
    if (!mr.ok || af['trainee:' + F2] != null || !af['merged:' + F2] || ((f1.dayProgress || {})[d1] || {}).done !== true || !Object.keys(af).some(k => k.startsWith(`backup:${F2}:`))) fail(`mergeIds should merge on the Worker, keeping the pass and a backup: ${JSON.stringify(mr)} ${JSON.stringify((f1.dayProgress || {})[d1])}`);

    await browser.close();
    if (failures.length) { console.error('🛠 Account Repair:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log('🛠 Account Repair: finds the duplicates, the redirected sign-ins and the missing KCs; dry runs change nothing; the merge keeps every attempt and the Portal\'s id; the Scorecard shows the KC.');
})().catch(e => { console.error(e); process.exit(1); });
