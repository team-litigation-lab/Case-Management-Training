// 🚨 Case-file alerts reach the trainers (js/cm-progress-log.js, js/cm-audit-table.js, index.html loadAuditExtras, worker.js).
// "Alert trainers when trainee has a glaring challenge or error in setting up their case files." Checks:
// 1. the rules, on seeded progress: each of R1–R8 fires on its evidence and stays quiet just under its threshold
//    (2 attempts, 50%, one failed Knowledge Check, a CMS Case ID logged, a document filed, a fresh first attempt…);
// 2. the Worker: case-alerts:resolved (the trainers' ✓ Resolved marks) is admin-only both ways — a trainee can neither read
//    nor write it; an admin can;
// 3. Admin → 🛡 Admin Master Control → 👥 Trainee Audit: "Needs attention" has a "🚨 Case-file alerts" chip with the number
//    of trainees with an open alert; a flagged trainee's row says how many; the chip opens the alerts list (trainee, rule,
//    details, when, ✓ Resolved), with the rules written out; a trainee with a clean file is not in it;
// 4. ✓ Resolved is saved to case-alerts:resolved and takes the alert off the open list ("Show resolved" brings it back,
//    with who and when; ↩ Reopen undoes it); newer evidence of the same problem opens it again;
// 5. the admin top bar has a 🚨 badge with the number of open alerts, and it opens the list;
// 6. no request per trainee: the progress and the resolved marks come in the Trainee Audit's one get-many;
// 7. it reads at 14px or more, bold.
// Usage: node .github/scripts/case-file-alerts.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const path = require('path'); const { pathToFileURL } = require('url');
const BASE = process.argv[2] || 'http://localhost:8787/';
const SHOT = process.env.ALERTS_SHOT || '';
const failures = []; const fail = (m) => failures.push(m);
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
const BATCH = 'CA' + tag.toUpperCase();
const H = 3600000, ago = (h) => new Date(Date.now() - h * H).toISOString();

async function workerChecks() {
    const worker = (await import(pathToFileURL(path.join(process.cwd(), 'worker.js')).href)).default;
    const store = new Map([['cm:trainee:ana-cruz--b1', JSON.stringify({ id: 'ana-cruz--b1', name: 'Ana Cruz', batch: 'B1', approved: true })],
        ['cm:case-alerts:resolved', JSON.stringify({ 'ana-cruz--b1': { 'refused:RS03': { at: ago(1), by: 'Coach' } } })]]);
    const env = { MASTER_ADMIN_PASSWORD: 'ci-pass', SESSION_SECRET: 'ci-secret', PORTAL_ONLY: 'off',
        LSH_KV: { get: async (k) => store.has(k) ? store.get(k) : null, put: async (k, v) => store.set(k, v), delete: async (k) => store.delete(k), list: async ({ prefix = '' } = {}) => ({ keys: [...store.keys()].filter(k => k.startsWith(prefix)).map(name => ({ name })), list_complete: true }) } };
    const call = async (p, body, token) => {
        const res = await worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), env, { waitUntil() {} });
        return { status: res.status, body: await res.json().catch(() => null) };
    };
    const t = (await call('/api/auth/trainee', { name: 'Ana Cruz', batch: 'B1' })).body.token;
    const a = (await call('/api/auth/admin', { passphrase: 'ci-pass' })).body.token;
    if ((await call('/api/storage/get', { key: 'case-alerts:resolved' }, t)).status !== 403) fail('a trainee can read the trainers\' ✓ Resolved marks (case-alerts:resolved)');
    const many = await call('/api/storage/get-many', { keys: ['case-alerts:resolved'] }, t);
    if (many.body && many.body.values && many.body.values['case-alerts:resolved']) fail('a trainee can read case-alerts:resolved through get-many');
    const w = await call('/api/storage/set', { key: 'case-alerts:resolved', value: JSON.stringify({ 'ana-cruz--b1': { conflict: { at: ago(0), by: 'me' } } }) }, t);
    if (w.status !== 403 || /conflict/.test(store.get('cm:case-alerts:resolved'))) fail(`a trainee could mark their own alert resolved: ${JSON.stringify(w)}`);
    const aw = await call('/api/storage/set', { key: 'case-alerts:resolved', value: JSON.stringify({ x: { y: { at: ago(0), by: 'Coach' } } }) }, a);
    if (aw.status !== 200 || !/"by":"Coach"/.test(store.get('cm:case-alerts:resolved') || '')) fail(`an admin can't save the ✓ Resolved marks: ${JSON.stringify(aw)}`);
    const ar = await call('/api/storage/get', { key: 'case-alerts:resolved' }, a);
    if (ar.status !== 200 || !/Coach/.test((ar.body && ar.body.value) || '')) fail('an admin can\'t read the ✓ Resolved marks');
}

// three trainees: Faye has a file full of problems, Gus one (a Skill Activity at 49%), Hal a clean file
const T = {
    faye: { id: `faye-alert-${tag}--x`, name: `Faye Alert ${tag}`, batch: BATCH, approved: true, lastActive: ago(0.2) },
    gus: { id: `gus-alert-${tag}--x`, name: `Gus Alert ${tag}`, batch: BATCH, approved: true, lastActive: ago(1) },
    hal: { id: `hal-clean-${tag}--x`, name: `Hal Clean ${tag}`, batch: BATCH, approved: true, lastActive: ago(2) }
};
const DATA = {
    faye: {
        'doc-filing': {
            RS03: { attempts: 4, filed: false, problems: ['The date part must be YYYY-MM-DD.'], firstAt: ago(5), lastAt: ago(4) },
            RS01: { attempts: 1, filed: false, wrongCat: 1, lastWrongCat: 'Medical Records', expectedCat: 'Case Files', problems: ['The firm files this document under Case Files, not Medical Records. A document in the wrong category is a document nobody finds.'], firstAt: ago(3), lastAt: ago(3) },
            RS05: { attempts: 1, filed: false, problems: ['The Case ID part is missing.'], firstAt: ago(30), lastAt: ago(30) }
        },
        'drive-check': { missing: 2, list: ['01 Intake', '03 Medical Records'], at: ago(6) },
        'drive-setup': { score: 100, ok: true, attempts: 1, at: ago(40), firstAt: ago(40) },
        'case-flow': { v: 1, modules: {}, updatedAt: ago(2), reached: { 'd1m1-open': 3, 'd1m2-a1': 1 }, ticks: { 'd1m1-open': [false, true] }, tickAt: { 'd1m1-open': ago(7) } },
        'work-log': [{ kind: 'lab', dayId: 11, label: 'Day 11 · Opening John Doe\'s File in the CMS', score: 32, at: ago(8) }],
        'day-progress': { 11: { done: false, score: 60, date: ago(9), history: [{ score: 40, passed: false, date: ago(12) }, { score: 60, passed: false, date: ago(9) }] } }
    },
    gus: {
        'work-log': [{ kind: 'lab', dayId: 11, label: 'Day 11 · Multi-Channel Outreach Logging', score: 49, at: ago(2) }],
        'case-flow': { v: 1, modules: {}, reached: { 'd1m1-open': 2 }, ticks: { 'd1m1-open': [true] }, work: { 'd1m1-open': { ref: 'CM-0042', tool: 'cms', at: ago(3) } } },
        'drive-setup': { score: 100, ok: true, attempts: 1, at: ago(20) }
    },
    hal: {
        'doc-filing': { RS02: { attempts: 2, filed: true, name: 'CM-1_Doe-John_Intake_2026-02-09.pdf', category: 'Intake Documents', at: ago(4), firstAt: ago(4.1), lastAt: ago(4) } },
        'case-flow': { v: 1, modules: {}, reached: { 'd1m1-open': 5, 'd1m2-a1': 2 }, ticks: { 'd1m1-open': [true, true, true] }, work: { 'd1m1-open': { ref: 'CM-0043', tool: 'cms', at: ago(5) } } },
        'drive-setup': { score: 100, ok: true, attempts: 1, at: ago(20) },
        'drive-grades': { 2: { score: 90, passed: true, at: ago(3) } },
        'work-log': [{ kind: 'lab', dayId: 11, label: 'Day 11 · Multi-Channel Outreach Logging', score: 30, at: ago(9) }, { kind: 'lab', dayId: 11, label: 'Day 11 · Multi-Channel Outreach Logging', score: 70, at: ago(6) }],
        'day-progress': { 11: { done: true, score: 85, history: [{ score: 60, passed: false, date: ago(30) }, { score: 50, passed: false, date: ago(28) }, { score: 85, passed: true, date: ago(20) }] }, 12: { done: false, score: 65, history: [{ score: 65, passed: false, date: ago(2) }] } }
    }
};

(async () => {
    await workerChecks();
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    const log = [];
    page.on('request', r => { const u = new URL(r.url()); if (u.pathname.startsWith('/api/')) { let key = ''; try { const b = JSON.parse(r.postData() || '{}'); key = b.key || (b.keys ? b.keys.join(',') : ''); } catch (e) {} log.push({ at: Date.now(), path: u.pathname, key }); } });
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(1200);

    // ---- 1. the rules on their own (the same code the trainee's log and the admin list run)
    const rules = await page.evaluate(({ DATA, H }) => {
        const ago = (h) => new Date(Date.now() - h * H).toISOString();
        const keys = (data) => cmCaseAlerts.compute(data, {}).map(a => a.key).sort();
        const lab = (score, h) => ({ kind: 'lab', dayId: 11, label: 'Day 11 · X', score, at: ago(h) });
        return {
            faye: cmCaseAlerts.compute(DATA.faye, {}).map(a => ({ key: a.key, rule: a.rule, sev: a.sev, title: a.title, detail: a.detail, fix: a.fix })),
            gus: keys(DATA.gus), hal: keys(DATA.hal),
            twoTries: keys({ 'doc-filing': { RS03: { attempts: 2, filed: false, firstAt: ago(1) } } }),
            threeFiled: cmCaseAlerts.compute({ 'doc-filing': { RS03: { attempts: 3, filed: true, name: 'n', at: ago(1) } } }, {}).map(a => a.key + ':' + a.sev + ':' + a.fixable),
            fifty: keys({ 'work-log': [lab(50, 1)] }), fortyNine: keys({ 'work-log': [lab(49, 1)] }),
            selfSummary: keys({ 'work-log': [{ kind: 'lab', label: 'Day 11 · Case Flow Day 1 · KC — CM Self-Summary', score: 20, at: ago(1) }] }),
            oneFail: keys({ 'day-progress': { 11: { done: false, score: 60, history: [{ score: 60, passed: false, date: ago(1) }] } } }),
            stuckKc: keys({ 'day-progress': { 11: { done: false, score: 60, history: [{ score: 60, passed: false, date: ago(50) }] } } }),
            notWorked: keys({ 'case-flow': { reached: {} }, 'day-progress': { 11: { done: true, score: 90, history: [{ score: 90, passed: true, date: ago(1) }] } } }),
            openOnly: keys({ 'case-flow': { reached: { 'd1m1-open': 1 } } }),
            caseIdMissing: keys({ 'case-flow': { reached: { 'd1m1-open': 3, 'd1m2-a1': 1 }, ticks: { 'd1m1-open': [true] } }, 'drive-setup': { ok: true } }),
            driveNone: keys({ 'case-flow': { reached: { 'd1m1-open': 3, 'd1m2-a1': 1 }, ticks: { 'd1m1-open': [true] }, work: { 'd1m1-open': { ref: 'CM-1', tool: 'cms' } } } }),
            driveFail: keys({ 'drive-setup': { ok: false, score: 40, attempts: 1, at: ago(1), firstAt: ago(1), left: 2 } }),
            driveStuck: keys({ 'drive-setup': { ok: false, score: 40, attempts: 3, at: ago(1), firstAt: ago(30), left: 2 } })
        };
    }, { DATA, H });
    const fk = rules.faye.map(a => a.key);
    [['refused:RS03', 'R1: the same document refused 4 times'], ['wrongcat:RS01', 'R2: a document under the wrong category'], ['drive:missing', 'R3: Backup Drive folders missing'],
     ['caseid', 'R4: no CMS Case ID after Day 1\'s opening activity'], ['lowskill:Day 11 · Opening John Doe\'s File in the CMS', 'R5: a Skill Activity at 32%'], ['conflict', 'R6: the Conflict Check not ticked'],
     ['kcfail:11', 'R7: a Knowledge Check failed twice'], ['stuck:doc:RS05', 'R8: a document unfiled 30 h after its first try']]
        .forEach(([k, what]) => { if (!fk.includes(k)) fail(`${what} should raise "${k}": ${JSON.stringify(fk)}`); });
    if (rules.faye.some(a => !/^R\d: /.test(a.detail))) fail('every alert\'s details should name the rule that raised it (R1–R8)');
    if (rules.faye.some(a => a.fix && a.fix.length < 15)) fail('every open alert should say what to do');
    if (JSON.stringify(rules.gus) !== JSON.stringify(['lowskill:Day 11 · Multi-Channel Outreach Logging'])) fail(`Gus should have only his 49% Skill Activity: ${JSON.stringify(rules.gus)}`);
    if (rules.hal.length) fail(`a clean file (filed on attempt 2, a low score redone to 70%, a Knowledge Check passed after 2 fails, one fresh fail) should raise nothing: ${JSON.stringify(rules.hal)}`);
    if (rules.twoTries.length) fail(`2 refused attempts is under the R1 threshold: ${JSON.stringify(rules.twoTries)}`);
    if (JSON.stringify(rules.threeFiled) !== JSON.stringify(['refused:RS03:medium:false'])) fail(`a document filed only on attempt 3 should be a 🟠 watch alert, nothing for the trainee to fix: ${JSON.stringify(rules.threeFiled)}`);
    if (rules.fifty.length || rules.fortyNine.length !== 1) fail(`R5 is below 50%: 50% → ${JSON.stringify(rules.fifty)}, 49% → ${JSON.stringify(rules.fortyNine)}`);
    if (rules.selfSummary.length) fail('a Learning Check (CM Self-Summary) is not a Skill Activity for R5');
    if (rules.oneFail.length) fail(`one failed Knowledge Check is not R7: ${JSON.stringify(rules.oneFail)}`);
    if (JSON.stringify(rules.stuckKc) !== JSON.stringify(['stuck:kc:11'])) fail(`a Knowledge Check not passed 50 h after the first try is R8: ${JSON.stringify(rules.stuckKc)}`);
    if (rules.notWorked.length) fail(`no opening activity worked: no case-file alert yet: ${JSON.stringify(rules.notWorked)}`);
    if (rules.openOnly.length) fail(`the opening activity in progress (not moved on) raises nothing yet: ${JSON.stringify(rules.openOnly)}`);
    if (!rules.caseIdMissing.includes('caseid') || rules.caseIdMissing.includes('conflict')) fail(`moved on with no CMS Case ID and the Conflict Check ticked: only R4: ${JSON.stringify(rules.caseIdMissing)}`);
    if (!rules.driveNone.includes('drive:none')) fail(`moved past Day 1's opening with no Backup Drive should be R3: ${JSON.stringify(rules.driveNone)}`);
    if (JSON.stringify(rules.driveFail) !== JSON.stringify(['drive:setup'])) fail(`Day 1's folders failing their check is R3: ${JSON.stringify(rules.driveFail)}`);
    const stuckRule = await page.evaluate(({ H }) => cmCaseAlerts.compute({ 'drive-setup': { ok: false, attempts: 3, at: new Date(Date.now() - H).toISOString(), firstAt: new Date(Date.now() - 30 * H).toISOString(), left: 2 } }, {})[0].rule, { H });
    if (stuckRule !== 'stuck') fail(`Day 1's folders still failing 30 h after the first try is R8 (stuck): ${stuckRule}`);

    // ---- seed the three trainees (their records and their progress) and open the Trainee Audit
    await page.evaluate(async ({ T, DATA }) => {
        for (const [k, r] of Object.entries(T)) { await sharedSet('trainee:' + r.id, r); await sharedSet('progress:' + r.id, { traineeId: r.id, savedAt: new Date().toISOString(), data: DATA[k] }); }
        await sharedSet('case-alerts:resolved', {});
    }, { T, DATA });
    await page.evaluate((batch) => { const o = document.getElementById('ktLogin'); if (o) o.remove(); state.isAdmin = true; state.adminData = null; state.adminTab = 'traineeaudit'; state.adminBatchFilter = ''; goto('admin'); render(); }, BATCH);
    await page.waitForSelector('#adminRowsWrap .at-table', { timeout: 15000 });
    await page.selectOption('#atBatch', BATCH); await page.waitForSelector('#adminRowsWrap .at-table');
    await page.waitForFunction((id) => !!(state.auditExtra && state.auditExtra[id]), T.hal.id, { timeout: 15000 });
    await page.waitForTimeout(500);

    // ---- 6. no request per trainee: the progress and the resolved marks in one get-many
    await page.waitForFunction(() => !state.auditExtraLoading, null, { timeout: 15000 });
    let t0 = Date.now();
    const n = await page.evaluate(async () => { await loadAuditExtras(true); return state.adminData.length; });
    const reqs = log.filter(x => x.at >= t0 && x.path.startsWith('/api/storage/'));
    if (reqs.length !== Math.ceil((3 * n + 1) / 100) || reqs.some(x => x.path !== '/api/storage/get-many')) fail(`the alerts for ${n} trainees took ${reqs.length} requests (expected ${Math.ceil((3 * n + 1) / 100)} get-many): ${JSON.stringify(reqs.map(x => x.path))}`);
    if (!reqs.some(x => /case-alerts:resolved/.test(x.key))) fail('the ✓ Resolved marks should come in the Trainee Audit\'s get-many');

    // ---- 3. the chip, the row flag, the list
    await page.evaluate(() => { const w = document.getElementById('adminRowsWrap'); w.innerHTML = renderAdminRows(); });
    await page.waitForTimeout(200);
    const chip = await page.evaluate(() => { const c = [...document.querySelectorAll('#atNeeds .at-chip')].find(b => /Case-file alerts/.test(b.textContent)); return c ? c.textContent.replace(/\s+/g, ' ').trim() : null; });
    if (!chip || !/🚨 Case-file alerts 2$/.test(chip)) fail(`"Needs attention" should have "🚨 Case-file alerts 2" (Faye and Gus): ${chip}`);
    const flag = await page.locator(`.at-row[data-id="${T.faye.id}"] .at-alerts`).innerText().catch(() => '');
    if (!/🚨 8 case-file alerts/.test(flag)) fail(`Faye's row should say she has 8 case-file alerts: "${flag}"`);
    if (await page.locator(`.at-row[data-id="${T.hal.id}"] .at-alerts`).count()) fail('a trainee with a clean file has no alert flag');
    await page.click('#atNeeds .at-chip:has-text("Case-file alerts")');
    await page.waitForSelector('#cmAlertsPanel .cma-table', { timeout: 5000 });
    const list = await page.evaluate(() => ({
        rows: [...document.querySelectorAll('#cmAlertsPanel tbody tr')].map(tr => ({ id: tr.dataset.id, key: tr.dataset.key, cells: [...tr.children].map(td => td.innerText.replace(/\s+/g, ' ').trim()) })),
        head: [...document.querySelectorAll('#cmAlertsPanel thead th')].map(t => t.textContent.trim()),
        rules: (document.querySelector('#cmAlertsPanel .cma-rules') || {}).textContent || '',
        h: (document.querySelector('#cmAlertsPanel h2') || {}).textContent || '',
        tableRows: [...document.querySelectorAll('#adminRowsWrap .at-row')].map(r => r.dataset.id),
        style: (() => { const c = getComputedStyle(document.querySelector('#cmAlertsPanel tbody td')); const b = getComputedStyle(document.querySelector('#cmAlertsPanel tbody td b')); return { size: parseFloat(c.fontSize), weight: parseInt(c.fontWeight, 10), bsize: parseFloat(b.fontSize), bweight: parseInt(b.fontWeight, 10) }; })()
    }));
    if (list.rows.length !== 9) fail(`the list should have Faye's 8 alerts and Gus's 1: ${list.rows.length} ${JSON.stringify(list.rows.map(r => r.key))}`);
    if (list.rows.some(r => r.id === T.hal.id)) fail('a trainee with a clean file is in the alerts list');
    for (const h of ['Trainee', 'Rule', 'Details', 'When']) if (!list.head.includes(h)) fail(`the alerts list has no "${h}" column: ${list.head.join(' | ')}`);
    const fr = list.rows.find(r => r.key === 'refused:RS03');
    if (!fr || !fr.cells[0].includes(T.faye.name) || !/Urgent/.test(fr.cells[1]) || !/Same document refused 3\+ times/.test(fr.cells[1]) || !/refused 4 times/.test(fr.cells[2]) || !/R1: 4 attempts/.test(fr.cells[2]) || !/\d/.test(fr.cells[3]) || !/✓ Resolved/.test(fr.cells[4]))
        fail(`an alert row should show the trainee, the rule, the details, when, and ✓ Resolved: ${JSON.stringify(fr)}`);
    for (const r of ['Same document refused', 'wrong category', 'Backup Drive', 'CMS Case ID', 'Skill Activity below 50%', 'Conflict Check', 'Knowledge Check failed', 'Stuck on a step'])
        if (!list.rules.includes(r)) fail(`the list should write out the rule "${r}"`);
    if (!/9 open/.test(list.h)) fail(`the list's heading should count 9 open: ${list.h}`);
    if (list.tableRows.length !== 2 || list.tableRows.includes(T.hal.id)) fail(`with the chip on, the table shows only the trainees with alerts: ${JSON.stringify(list.tableRows)}`);
    if (list.style.size < 14 || list.style.weight < 600 || list.style.bsize < 14 || list.style.bweight < 700) fail(`the alerts list reads at 14px+ and bold: ${JSON.stringify(list.style)}`);

    // ---- 5. the top-bar badge
    const badge = await page.evaluate(() => { const b = document.getElementById('cmAlertsBadge'); return b ? { text: b.innerText.replace(/\s+/g, ' ').trim(), n: cmCaseAlerts.allOpen() } : null; });
    if (!badge || !new RegExp(`🚨 Alerts ?${badge.n}$`).test(badge.text) || badge.n < 9) fail(`the admin top bar should show 🚨 Alerts with every open alert (at least 9): ${JSON.stringify(badge)}`);
    if (SHOT) { await page.evaluate(() => { const p = document.getElementById('cmAlertsPanel'); if (p) p.scrollIntoView({ block: 'start' }); const m = document.querySelector('main'); if (m) m.scrollTop -= 60; }); await page.waitForTimeout(300); await page.screenshot({ path: SHOT }); }

    // ---- 4. ✓ Resolved, Show resolved, Reopen, and newer evidence opening it again
    await page.click(`#cmAlertsPanel tr[data-key="refused:RS03"] .cma-ok`);
    await page.waitForFunction(() => !document.querySelector('#cmAlertsPanel tr[data-key="refused:RS03"]'), null, { timeout: 8000 }).catch(() => fail('✓ Resolved did not take the alert off the open list'));
    const saved = await page.evaluate((id) => sharedGet('case-alerts:resolved').then(v => v && v[id] && v[id]['refused:RS03']), T.faye.id);
    if (!saved || !saved.at || !saved.by) fail(`✓ Resolved should be saved to case-alerts:resolved with when and by whom: ${JSON.stringify(saved)}`);
    const after = await page.evaluate((id) => ({ open: cmCaseAlerts.openFor(state.adminData.find(r => r.id === id)).length, h: document.querySelector('#cmAlertsPanel h2').textContent, badge: (document.getElementById('cmAlertsBadge') || {}).innerText || '' }), T.faye.id);
    if (after.open !== 7 || !/8 open/.test(after.h)) fail(`after ✓ Resolved Faye has 7 open alerts and the list 8: ${JSON.stringify(after)}`);
    await page.check('#cmAlertsPanel .cma-res input');
    const res = await page.locator('#cmAlertsPanel tr[data-key="refused:RS03"]').innerText().catch(() => '');
    if (!/✓ Resolved by/.test(res) || !/Reopen/.test(res)) fail(`"Show resolved" should list it as resolved, by whom, with ↩ Reopen: "${res.replace(/\s+/g, ' ')}"`);
    await page.click('#cmAlertsPanel tr[data-key="refused:RS03"] button:has-text("Reopen")');
    await page.waitForFunction((id) => cmCaseAlerts.openFor(state.adminData.find(r => r.id === id)).length === 8, T.faye.id, { timeout: 8000 }).catch(() => fail('↩ Reopen did not open the alert again'));
    // resolved, then the trainee is refused again: the alert opens again
    const reopened = await page.evaluate(async (id) => {
        await cmCaseAlerts.resolve(id, 'refused:RS03');
        const rec = state.adminData.find(r => r.id === id), before = cmCaseAlerts.openFor(rec).some(a => a.key === 'refused:RS03');
        const r = state.auditExtra[id].data['doc-filing'].RS03; r.attempts = 5; r.lastAt = new Date(Date.now() + 1000).toISOString();
        return { before, after: cmCaseAlerts.openFor(rec).some(a => a.key === 'refused:RS03') };
    }, T.faye.id);
    if (reopened.before || !reopened.after) fail(`a resolved alert opens again when the trainee repeats it: ${JSON.stringify(reopened)}`);

    // the badge opens the list from another admin tab
    await page.evaluate(() => { state.auditNeed = ''; setAdminTab('audit'); });
    await page.waitForTimeout(400);
    await page.evaluate(() => { const b = document.getElementById('cmAlertsBadge'); if (b) b.click(); });
    await page.waitForSelector('#cmAlertsPanel', { timeout: 8000 }).catch(() => fail('the 🚨 badge did not open the alerts list'));
    if ((await page.evaluate(() => state.adminTab)) !== 'traineeaudit') fail('the 🚨 badge should open the Trainee Audit');

    await page.evaluate(async () => { await sharedSet('case-alerts:resolved', {}); });
    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('🚨 Case-file alerts: R1–R8 fire on their evidence and not below it; trainers see them in the Trainee Audit (chip, row flag, list with trainee, rule, details, when, ✓ Resolved) and the top-bar badge; ✓ Resolved is admin-only and rides the existing get-many.');
    console.log('All good.');
})().catch(e => { console.error(e); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); });
