// @check browser — 🔗 Link my Google Drive is always there for a trainee (says to ask the trainer when linking isn't switched on), its steps are clear, and a linked Drive opens at the case folders for the trainee and the trainer
// The owner said trainees had "no option to link their Google Drive": the card stayed away until the Worker had its
// Google keys. Now:
//   1. Not switched on (the test server has no Google keys): the dashboard card 🔗 Link my Google Drive is there and says
//      "isn't switched on … ask your trainer"; its button opens the panel, which says the same and shows the four steps to come.
//      CMDrive.show() and CMDrive.launch() (what a Skill Building activity's button calls) open that panel too.
//   2. Switched on, not linked (/api/drive answered by the test): the card's button reads 🔗 Link my Google Drive; the panel
//      shows four numbered steps (make the folder, Share as Editor with the address shown + 📋 Copy, copy its link, paste
//      and Link) and the box for the link.
//   3. Linked and built: the card and the panel link 📁 Open my Drive ↗ (the LSH Case Backups folder) and 📁 My case folder ↗
//      (01 Clients/Doe-John) in a new tab, never an address that isn't Google Drive's; CMDrive.launch() opens the case folder.
//   4. A trainer: 🔗 Trainee Drives and the Trainee Audit's drive panel give each linked trainee 📁 Open Drive ↗ and 📁 Case
//      folder ↗ from the Worker's report; a trainee not linked gets none.
// Type on the card and in the panel's steps is at least 13px; nothing throws.
// Usage: node .github/scripts/drive-link-option.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const ok = (m) => console.log('ok  ' + m);

const SHARE = 'lsh-backup@ci-project.iam.gserviceaccount.com';
const ROOT = 'https://drive.google.com/drive/folders/ci-root', CASE = 'https://drive.google.com/drive/folders/ci-case';

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const last = 'Link' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
    const dashboard = (pg) => pg.evaluate(() => { const o = document.getElementById('ktLogin'); if (o) o.remove(); goto('dashboard'); render(); });
    const cardOf = (pg) => pg.evaluate(() => { const c = document.querySelector('#drvCardSlot .drv-card'); if (!c) return null;
        const btn = c.querySelector('button'), a = (sel) => { const e = c.querySelector(sel); return e ? { href: e.getAttribute('href'), target: e.target, rel: e.rel, text: e.innerText.trim() } : null; };
        return { text: c.innerText, off: c.hasAttribute('data-drv-off'), btn: btn ? btn.innerText.trim() : '', open: a('[data-drv-open]'), kase: a('[data-drv-case]'),
            small: [...c.querySelectorAll('*')].filter(e => [...e.childNodes].some(n => n.nodeType === 3 && n.textContent.trim())).map(e => ({ t: e.textContent.trim().slice(0, 30), px: parseFloat(getComputedStyle(e).fontSize) })).filter(x => x.px < 12.5) }; });
    const panelOf = (pg) => pg.evaluate(() => { const h = document.getElementById('cmDriveHost'); if (!h) return null;
        const a = (sel) => { const e = h.querySelector(sel); return e ? { href: e.getAttribute('href'), target: e.target, text: e.innerText.trim() } : null; };
        return { text: h.innerText, steps: [...h.querySelectorAll('[data-drv-steps] > li')].map(li => li.innerText), sa: (h.querySelector('.drv-sa') || {}).textContent || '',
            copy: (h.querySelector('[data-drv-steps] [data-copy]') || { dataset: {} }).dataset.copy || '', input: !!h.querySelector('#drvLinkUrl'), off: !!h.querySelector('[data-drv-off]'),
            open: a('[data-drv-open]'), kase: a('[data-drv-case]') }; });

    /* ---------- 1. not switched on: the real test server, no Google keys ---------- */
    {
        const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
        page.on('pageerror', e => fail(`page error (not switched on): ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        await page.addStyleTag({ content: '#ktLogin{display:none!important}' });   // a trainee's open-your-tools prompt, never over the card
        await signIn(page, 'Lina', last, 'B100926');
        await dashboard(page);
        await page.waitForSelector('#drvCardSlot .drv-card', { timeout: 10000 }).catch(() => {});
        const c = await cardOf(page);
        if (!c) fail('a trainee should always have the 🔗 Link my Google Drive card on the dashboard, even when linking is not switched on');
        else {
            if (!/Link my Google Drive/.test(c.text) || !/isn't switched on/.test(c.text) || !/ask your trainer/.test(c.text)) fail(`the card should say linking isn't switched on yet and to ask the trainer: "${c.text.slice(0, 300)}"`);
            if (!/^🔗 Link my Google Drive$/.test(c.btn)) fail(`the card's button should read 🔗 Link my Google Drive: "${c.btn}"`);
            if (c.small.length) fail(`the card has type under 13px: ${JSON.stringify(c.small.slice(0, 4))}`);
            await page.click('#drvCardSlot .drv-card button');
            await page.waitForTimeout(200);
            const P = await panelOf(page);
            if (!P) fail('the card\'s button should open the panel');
            else {
                if (!P.off || !/isn't switched on/.test(P.text) || !/ask your trainer/.test(P.text)) fail(`the panel should say linking isn't switched on yet, ask your trainer: "${P.text.slice(0, 300)}"`);
                if (P.steps.length !== 4 || !/LSH Case Backups/.test(P.steps[0]) || !/Editor/.test(P.steps[1]) || !/link/i.test(P.steps[2]) || !/Link my folder/.test(P.steps[3])) fail(`the panel should show the four linking steps to come: ${JSON.stringify(P.steps)}`);
                if (P.input) fail('with linking not switched on there should be no box to paste a link into');
            }
            await page.evaluate(() => CMDrive.close());
        }
        const api = await page.evaluate(() => ({ show: typeof (window.CMDrive || {}).show, launch: typeof (window.CMDrive || {}).launch }));
        if (api.show !== 'function' || api.launch !== 'function') fail(`CMDrive.show and CMDrive.launch should be functions (a Skill Building activity's button calls them): ${JSON.stringify(api)}`);
        else {
            const opened = await page.evaluate(() => { const r = CMDrive.launch(); const on = !!document.getElementById('cmDriveHost'); CMDrive.close(); return { r, on }; });
            if (opened.r || !opened.on) fail(`not linked, CMDrive.launch() should open the panel, not a tab: ${JSON.stringify(opened)}`);
        }
        await page.close();
        ok('not switched on: the card is there, says to ask the trainer, and opens the panel with the four steps to come');
    }

    /* ---------- 1b. switched on, but the Worker doesn't take this page for a trainee (DRIVE_NOT_A_TRAINEE) ---------- */
    {
        const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
        await ctx.route('**/api/drive', (route) => { let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* no body */ }
            if (b.action === 'standard') return route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify({ standard: { configured: true, root: 'LSH Case Backups', standard: [], why: {}, naming: null } }) });
            return route.fulfill({ status: 403, contentType: 'application/json', body: JSON.stringify({ error: 'Sign in as a trainee to use the Backup Drive.', code: 'DRIVE_NOT_A_TRAINEE' }) }); });
        const page = await ctx.newPage();
        page.on('pageerror', e => fail(`page error (not a trainee): ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        await page.addStyleTag({ content: '#ktLogin{display:none!important}' });
        await signIn(page, 'Lina', last + 'n', 'B100926');
        await page.evaluate(() => CMDrive.reload());
        await dashboard(page); await page.waitForTimeout(600); await dashboard(page);
        await page.waitForSelector('#drvCardSlot .drv-card', { timeout: 10000 }).catch(() => {});
        const c = await cardOf(page);
        if (!c || !/Sign in as a trainee/.test(c.text) || /isn't switched on/.test(c.text)) fail(`switched on, a page the Worker doesn't take for a trainee should be told to sign in as a trainee, not that linking is off: "${c && c.text.slice(0, 200)}"`);
        await ctx.close();
        ok('not taken for a trainee: the card says to sign in as a trainee, not that linking is off');
    }

    /* ---------- 2 + 3. switched on: /api/drive answered by the test ---------- */
    {
        const ctx = await browser.newContext({ viewport: { width: 1366, height: 768 } });
        let linked = false, built = false, caseUrl = CASE;
        const driveOf = () => ({ drive: { configured: true, shareWith: SHARE, standard: ['01 Clients', '01 Clients/Doe-John'], why: {}, homes: {}, root: 'LSH Case Backups',
            connected: linked, email: linked ? 'lina@example.com' : '', folderName: linked ? 'LSH Case Backups' : '', rootUrl: linked ? ROOT : '', caseUrl: linked && built ? caseUrl : '',
            built, builtAt: built ? '2026-11-12T10:00:00.000Z' : null, checkedAt: null, lastMissing: [], setup: built ? { attempts: 1, ok: true, score: 100, problems: [] } : null,
            saved: [], grades: {}, gradedAt: null, drills: ['2'], naming: { report: null } } });
        await ctx.route('**/api/drive', (route) => {
            let b = {}; try { b = JSON.parse(route.request().postData() || '{}'); } catch (e) { /* no body */ }
            const send = (body) => route.fulfill({ status: 200, contentType: 'application/json', body: JSON.stringify(body) });
            if (b.action === 'standard') return send({ standard: { configured: true, root: 'LSH Case Backups', standard: [], why: {}, naming: null } });
            if (b.action === 'grade') return send(Object.assign(driveOf(), { grades: {} }));
            return send(driveOf());
        });
        const page = await ctx.newPage();
        page.on('pageerror', e => fail(`page error (switched on): ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
        await page.addStyleTag({ content: '#ktLogin{display:none!important}' });
        await signIn(page, 'Lina', last + 'x', 'B100926');
        await page.evaluate(() => CMDrive.reload());
        await dashboard(page);
        await page.waitForSelector('#drvCardSlot .drv-card', { timeout: 10000 }).catch(() => {});
        let c = await cardOf(page);
        if (!c || c.off || !/^🔗 Link my Google Drive$/.test(c.btn)) fail(`switched on and not linked, the card's button should read 🔗 Link my Google Drive: ${JSON.stringify(c && { off: c.off, btn: c.btn })}`);
        if (c && (c.open || c.kase)) fail('not linked, the card should link no Drive');
        await page.evaluate(() => CMDrive.show());
        let P = await panelOf(page);
        if (!P || P.steps.length !== 4) fail(`the panel should show four numbered linking steps: ${JSON.stringify(P && P.steps)}`);
        else {
            if (!/new folder named LSH Case Backups/.test(P.steps[0])) fail(`step 1 should say to make the LSH Case Backups folder: "${P.steps[0]}"`);
            if (!/Share/.test(P.steps[1]) || !/as Editor/.test(P.steps[1]) || P.sa !== SHARE || P.copy !== SHARE) fail(`step 2 should say to share it as Editor with the address shown, with 📋 Copy: ${JSON.stringify({ s: P.steps[1], sa: P.sa, copy: P.copy })}`);
            if (!/copy its link/.test(P.steps[2])) fail(`step 3 should say to copy the folder's link: "${P.steps[2]}"`);
            if (!/Paste the link/.test(P.steps[3]) || !/Link my folder/.test(P.steps[3])) fail(`step 4 should say to paste the link and press Link: "${P.steps[3]}"`);
            if (!P.input) fail('the panel should have the box for the folder\'s link');
        }
        await page.evaluate(() => CMDrive.close());

        // linked and built
        linked = true; built = true;
        await page.evaluate(() => CMDrive.reload());
        await dashboard(page);
        await page.waitForFunction(() => !!document.querySelector('#drvCardSlot [data-drv-case]'), null, { timeout: 10000 }).catch(() => {});
        c = await cardOf(page);
        const good = (a, href, what) => { if (!a || a.href !== href || a.target !== '_blank' || !/noopener/.test(a.rel || 'noopener')) fail(`${what} should open ${href} in a new tab: ${JSON.stringify(a)}`); };
        good(c && c.open, ROOT, 'the card\'s 📁 Open my Drive'); good(c && c.kase, CASE, 'the card\'s 📁 My case folder');
        await page.evaluate(() => CMDrive.show());
        P = await panelOf(page);
        good(P && P.open, ROOT, 'the panel\'s 📁 Open my Drive'); good(P && P.kase, CASE, 'the panel\'s 📁 My case folder');
        await page.evaluate(() => CMDrive.close());
        const launched = await page.evaluate(() => { const was = window.open; let to = null; window.open = (u) => { to = u; return null; }; const r = CMDrive.launch(); window.open = was; const on = !!document.getElementById('cmDriveHost'); return { r, to, on }; });
        if (!launched.r || launched.to !== CASE || launched.on) fail(`linked, CMDrive.launch() should open the case folder in a new tab: ${JSON.stringify(launched)}`);
        // an address that isn't Google Drive's is never linked
        caseUrl = 'javascript:alert(1)';
        await page.evaluate(() => CMDrive.reload());
        await dashboard(page);
        await page.waitForTimeout(300);
        c = await cardOf(page);
        if (!c || c.kase) fail(`a case folder address that isn't Google Drive's should not be linked: ${JSON.stringify(c && c.kase)}`);
        ok('switched on: four clear steps with the address to share with; linked, the card, the panel and CMDrive.launch() open the Drive and the case folder');

        /* ---------- 4. a trainer ---------- */
        const T = await page.evaluate(([ROOT, CASE]) => {
            state.isAdmin = true;
            state.driveReports = { 'ci-t1': { connected: true, folder: 'LSH Case Backups', email: 'ana@example.com', rootUrl: ROOT, caseUrl: CASE }, 'ci-t2': { connected: false }, 'ci-t3': { connected: true, rootUrl: 'https://evil.example/x' } };
            state.driveReportsAt = Date.now();
            const panelHtml = (id) => { const d = document.createElement('div'); d.innerHTML = renderAdminDrivePanel({ id, name: id }); const a = (s) => { const e = d.querySelector(s); return e ? { href: e.getAttribute('href'), target: e.target, text: e.innerText.trim() } : null; }; return { open: a('[data-cmda-open]'), kase: a('[data-cmda-case]') }; };
            const out = { one: panelHtml('ci-t1'), two: panelHtml('ci-t2'), three: panelHtml('ci-t3') };
            const was = { data: state.adminData, tab: state.adminTab };
            state.adminData = [{ id: 'ci-t1', name: 'Ana Cruz', approved: true, batch: 'B100926' }, { id: 'ci-t2', name: 'Ben Lee', approved: true, batch: 'B100926' }];
            state.adminTab = 'tdrives';
            try { const d = document.createElement('div'); d.innerHTML = renderAdmin(); const rows = [...d.querySelectorAll('.cmda-t tbody tr')];
                out.tab = rows.map(r => ({ name: (r.querySelector('td b') || {}).textContent || '', open: (r.querySelector('[data-cmda-open]') || { getAttribute: () => '' }).getAttribute('href'), kase: (r.querySelector('[data-cmda-case]') || { getAttribute: () => '' }).getAttribute('href') }));
            } catch (e) { out.tabErr = e.message; }
            state.adminData = was.data; state.adminTab = was.tab; state.isAdmin = false;
            return out; }, [ROOT, CASE]);
        if (!T.one.open || T.one.open.href !== ROOT || T.one.open.target !== '_blank' || !/Open Drive/.test(T.one.open.text)) fail(`the Trainee Audit's drive panel should give a linked trainee 📁 Open Drive ↗: ${JSON.stringify(T.one)}`);
        if (!T.one.kase || T.one.kase.href !== CASE) fail(`the Trainee Audit's drive panel should give 📁 Case folder ↗: ${JSON.stringify(T.one)}`);
        if (T.two.open || T.two.kase) fail('a trainee not linked should have no 📁 Open Drive');
        if (T.three.open) fail('an address that isn\'t Google Drive\'s should not be linked for a trainer');
        if (T.tabErr) fail(`🔗 Trainee Drives couldn't be drawn: ${T.tabErr}`);
        else {
            const ana = (T.tab || []).find(r => /Ana Cruz/.test(r.name)), ben = (T.tab || []).find(r => /Ben Lee/.test(r.name));
            if (!ana || ana.open !== ROOT || ana.kase !== CASE) fail(`🔗 Trainee Drives should give a linked trainee 📁 Open Drive ↗ and 📁 Case folder ↗ on their row: ${JSON.stringify(T.tab)}`);
            if (!ben || ben.open) fail(`🔗 Trainee Drives should give a trainee not linked no 📁 Open Drive: ${JSON.stringify(T.tab)}`);
        }
        ok('a trainer: 🔗 Trainee Drives and the Trainee Audit\'s drive panel open each linked trainee\'s Drive and case folder');
        await ctx.close();
    }

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('\n🔗 Link my Google Drive: always there, clear steps, and a linked Drive opens at the case folders: all good.');
})().catch((e) => { console.error(e); process.exit(1); });
