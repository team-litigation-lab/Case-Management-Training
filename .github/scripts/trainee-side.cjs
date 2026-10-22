// The admin side is not the trainee's (traineeSide in index.html).
// A signed-in trainee must never be offered an admin log-in, an admin view, or a trainer's notes —
// they see their own record and nothing else. The check runs with state.portalOnly FALSE, which is the
// case this guards: portalOnly comes from /api/auth/status, so a trainee whose status call failed
// (offline, or the daily request limit) used to be shown the 🛡 Admin button and its password box.
// Checks, as a signed-in trainee:
//   - no admin or trainer sign-in button anywhere on the page, on any of their pages;
//   - openAdmin() opens no password box;
//   - goto('admin') lands on their own dashboard, and nothing on it invites an admin sign-in;
//   - the Facilitator Guide is not offered in the navigation;
//   - their own score is theirs to see (Review Score on a passed day).
// And, as an admin: the Admin button and the admin view still work, so the rule only bars trainees.
// Usage: node .github/scripts/trainee-side.cjs [baseUrl]   (needs `npm i playwright` and a browser)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
// a trainee of this run's own, so saved drafts from an earlier run don't bleed in; letters only,
// because the sign-in refuses a name with digits in it
const uniq = () => Array.from({ length: 6 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join('');
const ADMIN_WORDS = /sign in as (an )?admin|admin access|admin password|sign in as trainer|🛡/i;

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const failures = []; const fail = (m) => failures.push(m);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Side', 'Trainee' + uniq(), 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        const rec = JSON.parse(r.value || '{}'); rec.approved = true; if (!rec.id) rec.id = state.traineeId;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);

    const out = await page.evaluate(async () => {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        const res = { pages: [] };
        // the case this guards: the status call didn't land, so the page doesn't know it is Portal-only
        state.portalOnly = false;
        res.isTrainee = !state.isAdmin && !!state.traineeId;
        for (const v of ['dashboard', 'practice', 'clientprofile', 'notes', 'handouts', 'tasks', 'facilitatorguide']) {
            goto(v); render(); await sleep(80);
            const buttons = [...document.querySelectorAll('button, a')].map(b => (b.textContent || '').replace(/\s+/g, ' ').trim());
            res.pages.push({ view: state.view, buttons: buttons.filter(t => /admin|trainer/i.test(t)) });
        }
        // the navigation a trainee is given
        goto('dashboard'); render(); await sleep(80);
        res.nav = [...document.querySelectorAll('.nav button')].map(b => (b.textContent || '').replace(/\s+/g, ' ').trim());
        // the password box
        const before = document.querySelectorAll('.overlay').length;
        openAdmin(); await sleep(150);
        res.overlays = document.querySelectorAll('.overlay').length - before;
        res.passBox = !!document.getElementById('adminPass');
        document.querySelectorAll('.overlay').forEach(o => o.remove());
        // the admin view
        goto('admin'); render(); await sleep(120);
        res.afterGotoAdmin = state.view;
        res.bodyText = (document.getElementById('app').innerText || '').slice(0, 4000);
        // their own score on a day they passed
        const d = DAYS[0];
        state.progress = {}; state.progress[d.id] = { done: true, score: 85, history: [{ score: 85, passed: true }] };
        goto('dashboard'); render(); await sleep(120);
        res.ownScore = !!document.querySelector(`#module-${d.id} button[onclick*="reviewMyScore"]`);
        return res;
    }).catch(e => ({ err: String(e) }));

    if (out.err) fail(`the trainee pass could not run: ${out.err}`);
    else {
        if (!out.isTrainee) fail('the test did not end up signed in as a trainee');
        out.pages.forEach(p => { if (p.buttons.length) fail(`"${p.view}" offers a trainee: ${p.buttons.join(' | ')}`); });
        if (out.nav.some(t => ADMIN_WORDS.test(t))) fail(`the navigation offers a trainee an admin way in: ${out.nav.join(' | ')}`);
        if (out.nav.some(t => /facilitator/i.test(t))) fail(`the navigation offers a trainee the Facilitator Guide: ${out.nav.join(' | ')}`);
        if (out.overlays > 0 || out.passBox) fail('openAdmin() showed a trainee the admin password box');
        if (out.afterGotoAdmin !== 'dashboard') fail(`goto('admin') left a trainee on "${out.afterGotoAdmin}", not their own dashboard`);
        if (ADMIN_WORDS.test(out.bodyText || '')) fail(`a trainee sent to the admin view is invited to sign in as an admin: ${(out.bodyText||'').slice(0,160)}`);
        if (!out.ownScore) fail("a trainee cannot see their own score on a day they passed");
    }

    // an admin still gets the admin side: the rule bars trainees, not trainers
    const asAdmin = await page.evaluate(async () => {
        const sleep = (ms) => new Promise(r => setTimeout(r, ms));
        state.isAdmin = true; state.portalOnly = false;
        goto('dashboard'); render(); await sleep(80);
        const nav = [...document.querySelectorAll('.nav button')].map(b => (b.textContent || '').replace(/\s+/g, ' ').trim());
        goto('admin'); render(); await sleep(120);
        return { nav, view: state.view, hasAdminButton: nav.some(t => /admin/i.test(t)) };
    });
    if (!asAdmin.hasAdminButton) fail(`an admin lost the Admin button: ${asAdmin.nav.join(' | ')}`);
    if (asAdmin.view !== 'admin') fail(`an admin can no longer open the admin view (landed on "${asAdmin.view}")`);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log("The admin side is not the trainee's: no admin or trainer sign-in anywhere on a trainee's pages, no password box, the admin view sends them to their own dashboard, no Facilitator Guide in their navigation, their own score is theirs to see — and an admin still has all of it.");
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
