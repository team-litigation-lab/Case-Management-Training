// @check browser — Logging out never loses work: a failed save keeps the device's data (backed up, uploaded to orphan:<id>:<ms>), a confirmed save clears every personal key, a merged account is sent back to the Portal unwiped
// js/cm-safe-logout.js wraps logout and forceRevokedLogout (index.html). Checked on the Worker, then in the browser with
// the server's answers faked by page.route:
//   W. the Worker lets a trainee write orphan:<own id>:<ms> once (never overwritten), never another trainee's, and a
//      merged-away account can still upload its backup; a trainee can't read orphan keys back;
//   1. Log out while the progress save fails: still signed in, every personal key still on the device, a backup
//      (lsh_orphan:<id>:<ms>) holds them, and it reached the server as orphan:<id>:<ms>;
//   2. Log out once the server answers: progress:<id> has the work, and every personal key is cleared, the ones add-ons
//      registered (registerPersonalKeys) included;
//   3. a merged account (its save refused with "This account was merged"): forceRevokedLogout wipes nothing, keeps a
//      backup and sends the trainee to the LSH Training Portal;
//   4. the Portal signing someone else in on this device while the save fails (logout({from: "portal"})): signed out,
//      nothing wiped; the next account signed in restores its own copy, and the earlier account's leftovers (backed up)
//      are cleared instead of being uploaded as theirs;
//   5. a server that will never take the save (403, not "merged"): Log out signs out, unwiped, the backup named;
//   6. a trainer's merge since the device restored (progress:<id>.mergedAt): the next start backs the device's copy up,
//      restores the merged one, and the saves then name the merge (mergedAt);
//   7. a merge while the page is open: the Worker's {mergePending} answer makes it restore the merged copy at once;
//   8. a backup of another trainee's work that can't be uploaded is cleared (its record kept) at the sign-in of a
//      different trainee after one upload was tried; the owner's own is never cleared;
//   and: an uploaded backup keeps only its record on the device; of those not uploaded, only the newest per account.
// Usage: node .github/scripts/safe-logout.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const { harness } = require('./worker-harness.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const PORTAL = 'https://cm-training-activity.pages.dev/';

(async () => {
    // W. the Worker's allowance for orphan:<own id>:<ms>
    const h = await harness({ portalOnly: true });
    const a = await h.portal('Orla', 'Phan', 'B100926', 'U-orla'), b = await h.portal('Bea', 'Other', 'B100926', 'U-bea');
    const key = `orphan:${a.body.id}:${Date.now()}`;
    const w1 = await h.set(key, { traineeId: a.body.id, data: { notes: ['x'] } }, a.body.token);
    if (w1.status !== 200) fail(`a trainee should write their own orphan backup: ${JSON.stringify(w1)}`);
    const w2 = await h.set(key, { traineeId: a.body.id, data: {} }, a.body.token);
    if (w2.status === 200 || (h.raw(key) || {}).data.notes == null) fail('an orphan backup should never be overwritten');
    const w3 = await h.set(`orphan:${b.body.id}:${Date.now()}`, { x: 1 }, a.body.token);
    if (w3.status === 200) fail("a trainee should not write another trainee's orphan key");
    const w4 = await h.set(`orphan:${a.body.id}:12`, { x: 1 }, a.body.token);
    if (w4.status === 200) fail('an orphan key is orphan:<id>:<13-digit ms>');
    const r1 = await h.api('/api/storage/get', { key }, a.body.token);
    if (r1.status === 200 && r1.body && r1.body.value) fail('a trainee should not read an orphan backup back');
    h.rawPut(`merged:${a.body.id}`, { into: b.body.id, at: new Date().toISOString(), by: 'test' });
    const w5 = await h.set(`orphan:${a.body.id}:${Date.now() + 5}`, { traineeId: a.body.id, data: {} }, a.body.token);
    if (w5.status !== 200) fail(`a merged-away account should still upload its backup: ${JSON.stringify(w5)}`);
    const w6 = await h.set(`progress:${a.body.id}`, { data: {} }, a.body.token);
    if (w6.status !== 403) fail('a merged-away account\'s other writes stay refused');

    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
    const page = await ctx.newPage();
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await ctx.route(PORTAL + '**', (r) => r.fulfill({ status: 200, contentType: 'text/html', body: '<!doctype html><title>Portal</title><p>LSH Training Portal</p>' }));
    const api = (p, body) => page.evaluate(async ([p, body]) => (await fetch(p, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json(), [p, body]);
    const approve = async () => { const k = 'trainee:' + await page.evaluate(() => state.traineeId); const r = await api('/api/storage/get', { key: k }); const rec = JSON.parse(r.value || '{}'); rec.approved = true; await api('/api/storage/set', { key: k, value: JSON.stringify(rec) }); };
    const serverGet = async (k) => { const r = await api('/api/storage/get', { key: k }); return r && r.value ? JSON.parse(r.value) : null; };
    const enter = async (first, last) => {
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        await signIn(page, first, last, 'B100926'); await approve();
        await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);
        if (!(await page.evaluate(() => typeof state !== 'undefined' && !!state.traineeId))) fail(`${first} ${last}: sign-in did not complete`);
    };
    // the server refuses (or can't take) the trainee's progress save
    let saveMode = 'ok';
    await page.route('**/api/storage/set', async (route) => {
        let body = {}; try { body = JSON.parse(route.request().postData() || '{}'); } catch (e) {}
        if (/^progress:/.test(body.key || '') && saveMode === '503') return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable"}' });
        if (saveMode === 'all-down' && /^(progress|orphan):/.test(body.key || '')) return route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable"}' });
        if (/^progress:/.test(body.key || '') && saveMode === 'offboarded') return route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: 'Your access to this program has ended.', code: 'access-offboarded' }) });
        if (/^progress:/.test(body.key || '') && saveMode === 'merged') return route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: 'This account was merged into your current one. Open the program again from the LSH Training Portal.' }) });
        return route.continue();
    });
    const local = () => page.evaluate(async () => { const o = {}; for (const k of PERSONAL_KEYS) { const v = await storeGet(k); if (v !== null && v !== undefined && !(Array.isArray(v) && !v.length) && !(typeof v === 'object' && !Array.isArray(v) && !Object.keys(v).length) && v !== '' && v !== 0) o[k] = v; } return o; });
    const put = () => page.evaluate(async () => {
        const reg = PERSONAL_KEYS.slice(PERSONAL_KEYS.indexOf('drive-check') + 1);   // the keys add-ons registered
        await storeSet('notes', [{ id: 1, text: 'my unsaved note ' + state.traineeId }]);
        await storeSet('net-sheet', { v: 2, files: { A: { cells: { L7: 1 }, checks: {} } } });
        await storeSet('quick-check-answers', { q1: 'b' });
        if (reg[0]) await storeSet(reg[0], { mine: state.traineeId });
        return reg;
    });

    // 1. Log out while the save fails: kept
    await enter('Sam', 'Keep');
    const sam = await page.evaluate(() => state.traineeId);
    const reg = await put();
    if (!reg.length) fail('no add-on registered a personal key (registerPersonalKeys): the check needs one');
    saveMode = '503';
    await page.evaluate(() => logout().catch(() => {}));
    await page.waitForTimeout(800);
    const s1 = await page.evaluate(() => ({ id: state.traineeId, last: window.cmSafeLogout && cmSafeLogout.lastResult, backups: window.cmSafeLogout ? cmSafeLogout.backups().map(b => ({ id: b.traineeId, keys: Object.keys(b.data || {}), up: b.uploaded, sig: b.sig })) : [] }));
    const l1 = await local();
    if (s1.id !== sam) fail(`a logout whose save failed should leave the trainee signed in: ${JSON.stringify(s1.id)}`);
    if (!l1.notes || !l1['net-sheet'] || (reg[0] && !l1[reg[0]])) fail(`a logout whose save failed should wipe nothing: ${Object.keys(l1).join(', ')}`);
    const bk = s1.backups.filter(b => b.id === sam).pop();
    if (!bk || !bk.sig) fail(`a backup of the device's work should be kept: ${JSON.stringify(s1.backups)}`);
    if (!bk || !/^orphan:/.test(bk.up || '')) fail(`the backup should be uploaded to orphan:<id>:<ms>: ${JSON.stringify(bk)}`);
    else {
        const o = await serverGet(bk.up); if (!o || !o.data || !o.data.notes || !o.data['net-sheet']) fail(`the server should hold the orphan backup ${bk.up}: ${JSON.stringify(o)}`);
        if (bk.keys.length) fail('once the server has a backup, the device should keep its record, not a second copy of the work');
    }
    // the same work again: no second backup; one not uploaded: only the newest per account stays on the device
    await page.evaluate(() => cmSafeLogout.keep(state.traineeId, 'test'));
    if ((await page.evaluate(() => cmSafeLogout.backups().filter(b => b.traineeId === state.traineeId).length)) !== 1) fail('the same work should not be backed up twice');
    saveMode = 'all-down';
    for (const n of [1, 2, 3]) await page.evaluate(async (n) => { await storeSet('notes', [{ id: n, text: 'draft ' + n }]); await cmSafeLogout.keep(state.traineeId, 'test'); }, n);
    const pend = await page.evaluate(() => cmSafeLogout.backups().filter(b => b.traineeId === state.traineeId && !b.uploaded).map(b => b.data && b.data.notes && b.data.notes[0].id));
    if (pend.length !== 1 || pend[0] !== 3) fail(`of the backups not uploaded, only the newest should stay: ${JSON.stringify(pend)}`);
    saveMode = '503';
    await page.evaluate(() => cmSafeLogout.uploadPending());
    await page.evaluate(async () => { await storeSet('notes', [{ id: 1, text: 'my unsaved note ' + state.traineeId }]); });

    // 2. Log out once the server answers: saved, then every personal key cleared
    saveMode = 'ok';
    await page.evaluate(() => logout());
    await page.waitForTimeout(800);
    const s2 = await page.evaluate(() => ({ id: state.traineeId, view: state.view, last: cmSafeLogout.lastResult }));
    const l2 = await local();
    if (s2.id) fail('a logout after a confirmed save should sign out');
    const prog = await serverGet('progress:' + sam);
    if (!prog || !prog.data || !prog.data.notes) fail('progress:<id> should hold the work before the device is wiped');
    if (Object.keys(l2).length) fail(`a logout after a confirmed save should clear every personal key, registered ones too: left ${Object.keys(l2).join(', ')}`);
    if (!(await page.evaluate(() => cmSafeLogout.backups().length))) fail('the backups should stay on the device');

    // 3. a merged account: forceRevokedLogout keeps everything and sends the trainee to the Portal
    await enter('Mia', 'Merged');
    const mia = await page.evaluate(() => state.traineeId);
    await put();
    saveMode = 'merged';
    const nav = page.waitForURL(PORTAL + '**', { timeout: 12000 }).then(() => true, () => false);
    await page.evaluate(() => { forceRevokedLogout(); });
    await page.waitForTimeout(600);
    const s3 = await page.evaluate(() => ({ id: state.traineeId, last: cmSafeLogout.lastResult, notes: JSON.parse(localStorage.getItem('lsh_notes') || 'null'), backup: Object.keys(localStorage).filter(k => k.startsWith('lsh_orphan:' + state.traineeId + ':')).length }));
    if (!s3.notes || !s3.notes.length) fail('a merged account should wipe nothing');
    if (!s3.backup) fail('a merged account should keep a backup');
    if (!s3.last || s3.last.how !== 'merged-kept') fail(`the merged account should be noticed: ${JSON.stringify(s3.last)}`);
    if (!(await nav)) fail('a merged account should be sent back to the LSH Training Portal');
    if (s3.id !== mia) fail('a merged account is sent to the Portal, not signed out here');
    saveMode = 'ok';
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(1500);
    await page.evaluate(() => logout());   // (the test's own reset: the server answers again, so this one wipes)
    await page.waitForTimeout(500);

    // 4. the Portal signs someone else in while the save fails: signed out unwiped; the next account doesn't inherit
    await enter('Pia', 'Shared');
    const pia = await page.evaluate(() => state.traineeId);
    await put();
    saveMode = '503';
    await page.evaluate(() => logout({ from: 'portal' }));
    await page.waitForTimeout(800);
    const s4 = await page.evaluate(() => ({ id: state.traineeId, last: cmSafeLogout.lastResult, notes: JSON.parse(localStorage.getItem('lsh_notes') || 'null') }));
    if (s4.id) fail(`the Portal's sign-out should sign out even when the save fails: ${s4.id}`);
    if (!s4.notes || !/Pia|pia/.test(JSON.stringify(s4.notes))) fail(`the Portal's sign-out after a failed save should wipe nothing: ${JSON.stringify(s4)}`);
    saveMode = 'ok';
    await signIn(page, 'Quinn', 'Next', 'B100926');
    await page.waitForTimeout(800);
    const s5 = await page.evaluate(async () => ({ id: state.traineeId, notes: await storeGet('notes'), ns: await storeGet('net-sheet') }));
    if (!s5.id || s5.id === pia) fail(`the next trainee should be signed in: ${s5.id}`);
    if (JSON.stringify(s5.notes || '').includes(pia) || (s5.ns && s5.ns.files && s5.ns.files.A && s5.ns.files.A.cells && s5.ns.files.A.cells.L7 === 1)) fail('the next trainee should not inherit the earlier account\'s work');
    if (!(await page.evaluate((pia) => cmSafeLogout.backups().some(b => b.traineeId === pia && ((b.data && b.data.notes) || b.uploaded)), pia))) fail("the earlier account's work should stay in its backup");
    await page.evaluate(() => cloudSaveNow());
    const q = await serverGet('progress:' + s5.id);
    if (q && JSON.stringify(q.data || {}).includes(pia)) fail("the next trainee's progress should not carry the earlier account's work");

    // 5. a server that will never take the save (403 access-offboarded): Log out signs out, the device unwiped, backed up
    await page.evaluate(() => logout());   // (Quinn's own, saved)
    await page.waitForTimeout(500);
    await enter('Ray', 'Refused');
    const ray = await page.evaluate(() => state.traineeId);
    await put();
    saveMode = 'offboarded';
    await page.evaluate(() => logout().catch(() => {}));
    await page.waitForTimeout(800);
    const s6 = await page.evaluate(() => ({ id: state.traineeId, last: cmSafeLogout.lastResult, notes: JSON.parse(localStorage.getItem('lsh_notes') || 'null'), kept: JSON.parse(localStorage.getItem('lsh_kept-for') || 'null') }));
    if (s6.id || !s6.last || !s6.last.refused) fail(`a refused save should sign out on Log out (not loop on "log out again"): ${JSON.stringify(s6.last)}`);
    if (!s6.notes || !s6.notes.length || !s6.kept || s6.kept.id !== ray || !s6.kept.sig) fail(`a refused account's work should stay on the device, its backup named: ${JSON.stringify(s6)}`);
    saveMode = 'ok';

    // 6. 👥 a merge since this device restored: the merged copy is restored at the next start, the device's own copy backed
    //    up first, and its saves then name the merge (mergedAt / mergeSeen)
    await enter('Ivy', 'Merge' + Date.now().toString(36).replace(/[0-9]/g, ''));   // (a name of its own: the server may hold an earlier run's)
    const ivy = await page.evaluate(() => state.traineeId);
    await page.evaluate(async () => { await storeSet('notes', [{ id: 9, text: 'unsaved on the old tab' }]); await cloudSaveNow(); });
    const merged = await serverGet('progress:' + ivy);
    const at = new Date(Date.now() + 1000).toISOString();
    await api('/api/storage/set', { key: 'progress:' + ivy, value: JSON.stringify(Object.assign({}, merged, { savedAt: at, mergedAt: at, data: Object.assign({}, merged.data, { 'net-sheet': { v: 2, files: { A: { cells: { L9: 5 }, checks: {} } } } }) })) });
    // (no save between the merge and the reload: the test server is in open mode, where every write is a trainer's, so the
    //  Worker's afterMerge for a stale device, checked in account-repair.cjs, doesn't apply here)
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1800);
    const s7 = await page.evaluate(async (ivy) => ({ seen: JSON.parse(localStorage.getItem('lsh_merge-seen') || 'null'), ns: await storeGet('net-sheet'), before: cmSafeLogout.backups().filter(b => b.traineeId === ivy && b.reason === 'before-merged-restore').length }), ivy);
    if (!s7.seen || s7.seen.id !== ivy || s7.seen.at !== at) fail(`the device should note the merge it restored: ${JSON.stringify(s7.seen)}`);
    if (!s7.ns || !s7.ns.files || !s7.ns.files.A || s7.ns.files.A.cells.L9 !== 5) fail('the merged snapshot should be restored at the next start');
    if (!s7.before) fail("the device's own copy should be backed up before the merged one is restored over it");
    const sent = [];
    page.on('request', (r) => { if (r.url().endsWith('/api/storage/set')) { try { const b = JSON.parse(r.postData() || '{}'); if (b.key === 'progress:' + ivy) sent.push(JSON.parse(b.value)); } catch (e) {} } });
    await page.evaluate(async () => { await storeSet('notes', [{ id: 11, text: 'after' }]); state.lastCloudSig = null; await cloudSaveNow(); });
    if (!sent.length || sent[sent.length - 1].mergedAt !== at) fail(`the next save should name the merge it restored: ${JSON.stringify(sent.map(x => x.mergedAt))}`);

    // 7. 👥 a merge while this page is open: the Worker answers its save with {mergePending} (worker-identity.js), and the
    //    page restores the merged copy at once (its own copy backed up first), its saves then naming that merge
    const at2 = new Date(Date.now() + 3000).toISOString(), m2 = await serverGet('progress:' + ivy);
    await api('/api/storage/set', { key: 'progress:' + ivy, value: JSON.stringify(Object.assign({}, m2, { savedAt: at2, mergedAt: at2, data: Object.assign({}, m2.data, { 'net-sheet': { v: 2, files: { A: { cells: { L9: 7 }, checks: {} } } } }) })) });
    const pending = async (route) => { let q = {}; try { q = JSON.parse(route.request().postData() || '{}'); } catch (e) {}
        if (q.key === 'progress:' + ivy) return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ ok: true, mergePending: at2 }) });
        return route.continue(); };
    await page.route('**/api/storage/set', pending);
    await page.evaluate(async () => { await storeSet('notes', [{ id: 12, text: 'open through the merge' }]); state.lastCloudSig = null; await cloudSaveNow(); });
    await page.waitForTimeout(1500);
    await page.unroute('**/api/storage/set', pending);
    const s8 = await page.evaluate(async (ivy) => ({ seen: JSON.parse(localStorage.getItem('lsh_merge-seen') || 'null'), ns: await storeGet('net-sheet'),
        kept: cmSafeLogout.backups().some(b => b.traineeId === ivy && b.reason === 'before-merged-restore' && (JSON.stringify(b.data || {}).includes('open through the merge') || b.uploaded)) }), ivy);
    if (!s8.seen || s8.seen.at !== at2) fail(`a page open through a merge should restore it on the Worker's {mergePending}: ${JSON.stringify(s8.seen)}`);
    if (!s8.ns || !s8.ns.files || !s8.ns.files.A || s8.ns.files.A.cells.L9 !== 7) fail(`the merged copy should be on the page once restored: ${JSON.stringify(s8.ns)}`);
    if (!s8.kept) fail("the open page's own copy should be backed up before the merged one is restored over it");

    // 8. a backup of ANOTHER trainee's work that can't be uploaded is tried once per trainee's sign-in, then cleared (its
    //    record kept) at a different trainee's; the owner's own backup is never cleared
    const ms = Date.now() - 5000;
    await page.evaluate(([ms, ivy]) => {
        const put = (k, v) => localStorage.setItem('lsh_orphan:' + k, JSON.stringify(v));
        put('other-a:' + ms, { traineeId: 'other-a', at: new Date(ms).toISOString(), reason: 'handover', sig: 'a', data: { notes: ['other a'] }, uploaded: '', triedBy: 'someone-before' });
        put('other-b:' + (ms + 1), { traineeId: 'other-b', at: new Date(ms + 1).toISOString(), reason: 'handover', sig: 'b', data: { notes: ['other b'] }, uploaded: '' });
        put(ivy + ':' + (ms + 2), { traineeId: ivy, at: new Date(ms + 2).toISOString(), reason: 'logout-unsaved', sig: 'c', data: { notes: ['mine'] }, uploaded: '', triedBy: 'someone-before' });
    }, [ms, ivy]);
    const refuse = (route) => { let q = {}; try { q = JSON.parse(route.request().postData() || '{}'); } catch (e) {}
        return /^orphan:/.test(q.key || '') ? route.fulfill({ status: 503, contentType: 'application/json', body: '{"error":"unavailable"}' }) : route.continue(); };
    await page.route('**/api/storage/set', refuse);
    await page.evaluate(() => cmSafeLogout.uploadPending());
    await page.unroute('**/api/storage/set', refuse);
    const s9 = await page.evaluate(([ms, ivy]) => { const g = (k) => JSON.parse(localStorage.getItem('lsh_orphan:' + k) || 'null');
        return { a: g('other-a:' + ms), b: g('other-b:' + (ms + 1)), mine: g(ivy + ':' + (ms + 2)) }; }, [ms, ivy]);
    if (!s9.a || s9.a.data || !s9.a.cleared) fail(`another trainee's backup already tried under an earlier sign-in should be cleared now (its record kept): ${JSON.stringify(s9.a)}`);
    if (!s9.b || !s9.b.data || s9.b.triedBy !== ivy) fail(`another trainee's backup tried for the first time should be kept, noted as tried: ${JSON.stringify(s9.b)}`);
    if (!s9.mine || !s9.mine.data) fail('the signed-in trainee\'s own backup should never be cleared');

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('Safe logout: a failed save keeps the work (backed up, uploaded to orphan:<id>:<ms>); a confirmed save clears every personal key; a merged account is sent back to the Portal unwiped; the next trainee on the device inherits nothing.');
})().catch(e => { console.error(e); process.exit(1); });
