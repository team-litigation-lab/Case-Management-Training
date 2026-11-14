// @check browser — The Admin screen in sections, as Foundational (section pills, their tabs, a navy banner; opens on Scorecard → Batch Sheet, scores only; every admin action in Admin Master Control)
// The Admin screen in sections, the Foundational Training way (js/cm-admin-shell.js):
// 1. a row of section pills in Foundational's order, only the ones this course has (🏅 Scorecard · 🛡 Admin Master Control ·
//    🔓 Open Lessons), the open section's tabs in a row under them, and a navy banner (.ft-banner) heading the content;
// 2. Admin opens on 🏅 Scorecard → 📋 Batch Sheet; every tab opens with setAdminTab and lands in its section;
// 3. 🏅 Scorecard shows only scores (the 📋 Batch Sheet and the 🏅 Scorecards cards): no approving, rejecting, resetting,
//    revoking, assigning, feedback, certificates, archiving or settings there; all of those are in 🛡 Admin Master Control
//    (👥 Trainee Audit, 📁 Companion Cases, ⚙ Settings, 🎲 Random Tasks);
// 4. a tab another script adds later lands under 🛡 Admin Master Control;
// 5. ← / → move between the pills; a pill keeps the focus after it opens its section;
// 6. on a phone the pills fit (no sideways scroll of the page) and the type stays at least 14px; a trainee never gets Admin.
// Usage: node .github/scripts/admin-shell.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const PILLS = ['🏅 Scorecard', '🛡 Admin Master Control', '🔓 Open Lessons'];
const SC = '🏅 Scorecard', AMC = '🛡 Admin Master Control', OL = '🔓 Open Lessons';
const WHERE = { audit: SC, scorecards: SC, rubric: SC, traineeaudit: AMC, companion: AMC, tfeedback: AMC, rtasks: AMC, settings: AMC, sop: AMC, studio: AMC, tdrives: AMC,
    openlessons: OL, activities: OL, fbstyle: OL };
// what a trainer DOES: never on the 🏅 Scorecard pages
const ACTIONS = /approveTrainee\(|rejectTrainee\(|resetTraineeLabAttempts\(|confirmRevokeTrainee\(|cmAudit\.revoke\(|cmCompanion\.assign\(|openFeedbackFor\(|adminOpenCertificate\(|confirmArchiveBatch\(|confirmUnarchiveBatch\(|adminLogout\(|saveCertSettings\(|saveFeedbackSettings\(|injectSurpriseTask\(|dupMerge\(|cm-ol-chip/;
const tag = String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
const BATCH = 'SH' + tag.toUpperCase();
const SEED = [{ id: `pat-pend-${tag}--s`, name: `Pat Pend ${tag}`, batch: BATCH, registeredAt: new Date().toISOString() },
    { id: `ann-ok-${tag}--s`, name: `Ann Ok ${tag}`, batch: BATCH, approved: true, lastActive: new Date().toISOString(), labAttemptsGlobal: 1, dayProgress: { 11: { done: true, score: 90 } } }];

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    const last = 'Shell' + String(Date.now()).slice(-6).replace(/\d/g, d => 'abcdefghij'[d]);
    await signIn(page, 'Sana', last, 'B100926');

    // 6. as a trainee first: goto('admin') is their dashboard, with no section pills
    const asTrainee = await page.evaluate(async () => { goto('admin'); render(); await new Promise(r => setTimeout(r, 200)); return { view: state.view, pills: document.querySelectorAll('.cmsh-sec').length }; });
    if (asTrainee.view === 'admin' || asTrainee.pills) fail(`a trainee reached the Admin screen: ${JSON.stringify(asTrainee)}`);

    const open = (tab) => page.evaluate(async (tab) => {
        const o = document.getElementById('ktLogin'); if (o) o.remove();
        state.isAdmin = true; if (tab) state.adminTab = tab; else delete state.adminTab;
        goto('admin'); render(); await new Promise(r => setTimeout(r, 400)); render();
        const q = (s) => [...document.querySelectorAll(s)];
        const banner = document.querySelector('.cmsh-tabs ~ .ft-banner, .cmsh-tabs ~ div .ft-banner, .cmsh-tabs ~ .dsop-banner, .cmsh-tabs ~ div .dsop-banner, .cmsh-tabs ~ .cm-ol-banner, .cmsh-tabs ~ div .cm-ol-banner');
            const banners = document.querySelectorAll('main .ft-banner, main .dsop-banner, main .cm-ol-banner').length;   // one banner: a page's own, or the shell's
        return { view: state.view, tab: state.adminTab || 'audit', screen: !!document.querySelector('.cmsh-screen'),
            pills: q('.cmsh-sec').map(b => b.textContent.replace(/\d+$/, '').trim()), active: q('.cmsh-sec.active').map(b => b.textContent.replace(/\d+$/, '').trim()),
            row: q('.cmsh-row .admin-tab-btn').map(b => ((b.getAttribute('onclick') || '').match(/setAdminTab\('([^']+)'\)/) || [])[1]),
            rowHidden: !!(document.querySelector('.cmsh-row') || {}).hidden, activeTab: q('.cmsh-row .admin-tab-btn.active').map(b => ((b.getAttribute('onclick') || '').match(/setAdminTab\('([^']+)'\)/) || [])[1]),
            oldGroups: q('.cf-admin-secs').length, strips: q('.admin-tabs').length,
            banners, banner: banner ? banner.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : '', h1s: q('main h1').map(h => h.textContent.trim()), text: (document.querySelector('main') || document.body).innerText.slice(0, 4000) };
    }, tab);

    await page.evaluate(async (SEED) => { for (const r of SEED) await sharedSet('trainee:' + r.id, r); }, SEED);
    await page.evaluate((b) => { state.adminData = null; state.adminBatchFilter = cleanBatch(b); }, BATCH);

    // 2. the default: 🏅 Scorecard → 📋 Batch Sheet
    const home = await open(null);
    if (home.view !== 'admin' || !home.screen) fail(`the Admin screen did not open in its panel: ${JSON.stringify({ view: home.view, screen: home.screen })}`);
    if (JSON.stringify(home.pills) !== JSON.stringify(PILLS)) fail(`the section pills should be ${PILLS.join(' · ')}: ${home.pills.join(' · ')}`);
    if (home.active[0] !== SC || home.activeTab[0] !== 'audit') fail(`Admin should open on 🏅 Scorecard → 📋 Batch Sheet: ${home.active} / ${home.activeTab}`);
    if (home.oldGroups) fail('js/cm-case-flow.js grouped the tabs as well (its .cf-admin-secs is on the page)');
    if (home.strips !== 1) fail(`one tab strip, not ${home.strips}`);
    if (!/Batch Sheet/.test(home.banner)) fail(`the Batch Sheet has no navy banner over it: "${home.banner}"`);

    // 3. 🏅 Scorecard: scores only (the sheet, once the batch's progress has loaded, and the cards)
    const scoresOnly = async (tab, ready) => {
        await open(tab);
        await page.waitForFunction(ready, null, { timeout: 20000 }).catch(() => fail(`${tab}: the scores never drew`));
        return page.evaluate(() => { const s = document.querySelector('.cmsh-screen'); return { html: s ? s.innerHTML : '', text: s ? s.innerText : '' }; });
    };
    const sheet = await scoresOnly('audit', () => !!document.querySelector('#bs-scores') && /Ann Ok/.test(document.querySelector('#bsSheet').innerText));
    const m1 = ACTIONS.exec(sheet.html); if (m1) fail(`the 📋 Batch Sheet still carries an admin action: ${m1[0]}`);
    if (/View Detail|Hide Detail|Assign a case|Certificate signatories|Archive this batch|Log out/.test(sheet.text)) fail('the 📋 Batch Sheet still shows admin controls (detail, assign, settings, archive, log out)');
    if (!/Score Card/.test(sheet.text) || !/Scores/.test(sheet.text)) fail('the 📋 Batch Sheet lost its score tables');
    const cards = await scoresOnly('scorecards', () => !!document.querySelector('.bs-pt'));
    const m2 = ACTIONS.exec(cards.html); if (m2) fail(`🏅 Scorecards carries an admin action: ${m2[0]}`);
    if (!/Safety gate|100-point|Final/.test(cards.text)) fail('🏅 Scorecards should show the trainee cards with the 100-point model');

    // ... and they are all in 🛡 Admin Master Control
    const where = async (tab, sel) => { await open(tab); await page.waitForTimeout(600); return page.evaluate((sel) => sel.filter(x => !document.querySelector('.cmsh-screen ' + x)), sel); };
    let miss = await where('traineeaudit', [`.at-row button[onclick^="approveTrainee"]`, `.at-row button[onclick^="rejectTrainee"]`, `.at-row button[onclick^="resetTraineeLabAttempts"]`, `.at-row button[onclick^="cmAudit.revoke"]`, `button[onclick^="confirmArchiveBatch"]`, `button[onclick^="adminLogout"]`]);
    if (miss.length) fail(`👥 Trainee Audit is missing: ${miss.join(', ')}`);
    miss = await where('companion', ['select.cc-assign']); if (miss.length) fail(`📁 Companion Cases has no case picker: ${miss}`);
    miss = await where('settings', ['#certTrainer', '#certNameFmt', '#fbAutoDraft', 'button[onclick^="saveCertSettings"]']); if (miss.length) fail(`⚙ Settings is missing: ${miss.join(', ')}`);
    miss = await where('rtasks', ['#surpriseTaskDaySelect', 'button[onclick^="injectSurpriseTask"]']); if (miss.length) fail(`🎲 Random Tasks is missing: ${miss.join(', ')}`);

    // the certificate signatories stay inside the white panel at a laptop width
    await page.setViewportSize({ width: 1366, height: 768 }); await open('settings');
    const fit = await page.evaluate(() => { const s = document.querySelector('.cmsh-screen'), g = document.querySelector('.cert-settings-grid');
        return s && g ? Math.max(0, ...[...g.children].map(c => c.getBoundingClientRect().right - s.getBoundingClientRect().right)) : -1; });
    if (fit < 0) fail('⚙ Settings has no certificate signatories');
    if (fit > 1) fail(`at 1366px the certificate signatory inputs stick out of the Admin panel by ${Math.round(fit)}px`);
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1–2. every tab, in its section, with its banner
    for (const [tab, sec] of Object.entries(WHERE)) {
        const r = await open(tab);
        if (r.active[0] !== sec) fail(`${tab} should open under ${sec}: ${r.active}`);
        if (r.activeTab[0] !== tab) fail(`${tab} is not the active tab in its row: ${r.activeTab}`);
        const mates = Object.keys(WHERE).filter(t => WHERE[t] === sec);
        if (JSON.stringify([...r.row].sort()) !== JSON.stringify([...mates].sort())) fail(`${sec}'s tabs should be ${mates.join(', ')}: ${r.row.join(', ')}`);
        if (r.rowHidden !== (mates.length < 2)) fail(`${sec}: the tab row should be ${mates.length < 2 ? 'hidden (one tab)' : 'shown'}`);
        if (!r.banner) fail(`${tab}: no navy banner heads the content`);
        if (r.banners > 1) fail(`${tab}: ${r.banners} banners head the content (one: the page's own or the shell's)`);
    }
    const ol = await open('openlessons');
    if (!/Open Lessons/.test(ol.banner + ol.text) || !(await page.$('.cmsh-screen .ft-open-days'))) fail('🔓 Open Lessons does not draw its page (renderAdminOpenLessons)');
    const sc = await open('scorecards');
    if (!/Scorecards/.test(sc.banner)) fail(`🏅 Scorecards does not show the scorecards page: "${sc.banner}"`);

    // 4. a tab another script adds later (the ftAdminTab way): an unknown one lands under 🛡 Admin Master Control
    await page.evaluate(() => {
        const inner = window.renderAdmin;
        window.renderAdmin = function () {
            const out = inner.apply(this, arguments);
            const end = out.indexOf('</div>', out.indexOf('admin-tabs'));
            const btn = `<button class="admin-tab-btn ${state.adminTab === 'zzlater' ? 'active' : ''}" onclick="setAdminTab('zzlater')">🧪 Later tab</button>`;
            return end > 0 ? out.slice(0, end) + btn + out.slice(end) + (state.adminTab === 'zzlater' ? '<div id="zzBody">LATER BODY</div>' : '') : out;
        };
        window.dispatchEvent(new Event('load'));   // the shell wraps again, outermost
    });
    const later = await open('zzlater');
    if (later.active[0] !== '🛡 Admin Master Control' || !later.row.includes('zzlater') || !(await page.$('#zzBody'))) fail(`a tab added later should land under 🛡 Admin Master Control: ${JSON.stringify({ active: later.active, row: later.row })}`);
    const back = await open('sop');
    if (!back.row.includes('zzlater') || back.strips !== 1) fail(`the later tab is missing from Admin Master Control's row, or the strip doubled: ${back.row} (${back.strips} strips)`);

    // 5. the keyboard: a pill opens its section and keeps the focus; → moves to the next pill
    await open(null);
    await page.click('.cmsh-sec[data-sec="admin"]'); await page.waitForTimeout(200);
    const k = await page.evaluate(() => ({ tab: state.adminTab, focus: (document.activeElement || {}).dataset ? document.activeElement.dataset.sec : '' }));
    if (k.tab !== 'traineeaudit' || k.focus !== 'admin') fail(`the 🛡 Admin Master Control pill should open 👥 Trainee Audit and keep the focus: ${JSON.stringify(k)}`);
    await page.keyboard.press('ArrowRight');
    const next = await page.evaluate(() => document.activeElement && document.activeElement.dataset.sec);
    if (next !== 'open') fail(`→ should move to the 🔓 Open Lessons pill: ${next}`);
    await page.keyboard.press('Enter'); await page.waitForTimeout(200);
    if (await page.evaluate(() => state.adminTab) !== 'openlessons') fail('Enter on a pill should open its section');

    // 6. on a phone
    await page.setViewportSize({ width: 390, height: 844 });
    await open('activities');
    const phone = await page.evaluate(() => ({ over: document.documentElement.scrollWidth - window.innerWidth,
        small: [...document.querySelectorAll('.cmsh-sec, .cmsh-row .admin-tab-btn, .cmsh-banner .ft-banner-k, .cmsh-banner .ft-banner-sub')].map(e => [e.textContent.trim().slice(0, 20), parseFloat(getComputedStyle(e).fontSize)]).filter(x => x[1] < 14) }));
    if (phone.over > 1) fail(`on a phone the Admin screen scrolls sideways by ${phone.over}px`);
    if (phone.small.length) fail(`type under 14px on the Admin sections: ${JSON.stringify(phone.small)}`);

    await page.evaluate(async (SEED) => { for (const r of SEED) await sharedDelete('trainee:' + r.id); }, SEED);
    await browser.close();
    if (failures.length) { console.error('Admin sections:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
