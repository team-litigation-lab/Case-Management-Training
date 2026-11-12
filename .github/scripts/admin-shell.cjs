// The Admin screen in sections, the Foundational Training way (js/cm-admin-shell.js):
// 1. a row of section pills (🏅 Scorecard · 📊 Rankings · 🔗 Drive Links · 🛡 Admin Master Control · 🔓 Open Lessons), the open
//    section's tabs in a row under them, and a navy banner (.ft-banner) heading the section's content;
// 2. Admin opens on 🏅 Scorecard → 👥 Trainee Audit; every existing tab still opens with setAdminTab and lands in its section;
//    🏅 Scorecards (the #/scorecard page) and 🔓 Open Lessons are tabs here (Open Lessons draws renderAdminOpenLessons when loaded);
// 3. a tab another script adds later lands in its section, and an unknown one under 🛡 Admin Master Control;
// 4. ← / → move between the pills; a pill keeps the focus after it opens its section;
// 5. on a phone the pills fit (no sideways scroll of the page) and the type stays at least 14px;
// 6. a trainee never gets the Admin screen.
// Usage: node .github/scripts/admin-shell.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const PILLS = ['🏅 Scorecard', '📊 Rankings', '🔗 Drive Links', '🛡 Admin Master Control', '🔓 Open Lessons'];
const WHERE = { audit: '🏅 Scorecard', scorecards: '🏅 Scorecard', tfeedback: '🏅 Scorecard', rankings: '📊 Rankings', drivelinks: '🔗 Drive Links',
    sop: '🛡 Admin Master Control', openlessons: '🔓 Open Lessons', activities: '🔓 Open Lessons', fbstyle: '🔓 Open Lessons', studio: '🔓 Open Lessons' };

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
        const banner = document.querySelector('.cmsh-tabs ~ .ft-banner, .cmsh-tabs ~ div .ft-banner, .cmsh-tabs ~ .dsop-banner, .cmsh-tabs ~ div .dsop-banner');
        return { view: state.view, tab: state.adminTab || 'audit', screen: !!document.querySelector('.cmsh-screen'),
            pills: q('.cmsh-sec').map(b => b.textContent.replace(/\d+$/, '').trim()), active: q('.cmsh-sec.active').map(b => b.textContent.replace(/\d+$/, '').trim()),
            row: q('.cmsh-row .admin-tab-btn').map(b => ((b.getAttribute('onclick') || '').match(/setAdminTab\('([^']+)'\)/) || [])[1]),
            rowHidden: !!(document.querySelector('.cmsh-row') || {}).hidden, activeTab: q('.cmsh-row .admin-tab-btn.active').map(b => ((b.getAttribute('onclick') || '').match(/setAdminTab\('([^']+)'\)/) || [])[1]),
            oldGroups: q('.cf-admin-secs').length, strips: q('.admin-tabs').length,
            banner: banner ? banner.textContent.replace(/\s+/g, ' ').trim().slice(0, 120) : '', h1s: q('main h1').map(h => h.textContent.trim()), text: (document.querySelector('main') || document.body).innerText.slice(0, 4000) };
    }, tab);

    // 2. the default: 🏅 Scorecard → 👥 Trainee Audit
    const home = await open(null);
    if (home.view !== 'admin' || !home.screen) fail(`the Admin screen did not open in its panel: ${JSON.stringify({ view: home.view, screen: home.screen })}`);
    if (JSON.stringify(home.pills) !== JSON.stringify(PILLS)) fail(`the section pills should be ${PILLS.join(' · ')}: ${home.pills.join(' · ')}`);
    if (home.active[0] !== '🏅 Scorecard' || home.activeTab[0] !== 'audit') fail(`Admin should open on 🏅 Scorecard → Trainee Audit: ${home.active} / ${home.activeTab}`);
    if (home.oldGroups) fail('js/cm-case-flow.js grouped the tabs as well (its .cf-admin-secs is on the page)');
    if (home.strips !== 1) fail(`one tab strip, not ${home.strips}`);
    if (!/Trainee Audit/.test(home.banner)) fail(`the Trainee Audit has no navy banner over it: "${home.banner}"`);
    if (home.h1s.includes('Trainee Audit')) fail('the Trainee Audit title shows twice (the banner and the old heading)');

    // the Trainee Audit's certificate signatories stay inside the white panel at a laptop width
    await page.setViewportSize({ width: 1366, height: 768 }); await open(null);
    const fit = await page.evaluate(() => { const s = document.querySelector('.cmsh-screen'), g = document.querySelector('.cert-settings-grid');
        return s && g ? Math.max(0, ...[...g.children].map(c => c.getBoundingClientRect().right - s.getBoundingClientRect().right)) : 0; });
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
    }
    const ol = await open('openlessons');
    if (!/Open Lessons/.test(ol.banner) || !/on its way/.test(ol.text)) fail('🔓 Open Lessons shows no placeholder');
    await page.evaluate(() => { window.renderAdminOpenLessons = () => '<div class="card" id="olTest">OPEN LESSONS PAGE</div>'; });
    if (!(await open('openlessons')).text.includes('OPEN LESSONS PAGE')) fail('🔓 Open Lessons does not draw renderAdminOpenLessons() once it exists');
    await page.evaluate(() => { delete window.renderAdminOpenLessons; });
    const sc = await open('scorecards');
    if (!/Scorecards/.test(sc.banner)) fail(`🏅 Scorecards does not show the scorecards page: "${sc.banner}"`);

    // 3. a tab another script adds later (the ftAdminTab way): an unknown one lands under 🛡 Admin Master Control
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

    // 4. the keyboard: a pill opens its section and keeps the focus; → moves to the next pill
    await open(null);
    await page.click('.cmsh-sec[data-sec="rankings"]'); await page.waitForTimeout(200);
    const k = await page.evaluate(() => ({ tab: state.adminTab, focus: (document.activeElement || {}).dataset ? document.activeElement.dataset.sec : '' }));
    if (k.tab !== 'rankings' || k.focus !== 'rankings') fail(`the 📊 Rankings pill should open rankings and keep the focus: ${JSON.stringify(k)}`);
    await page.keyboard.press('ArrowRight');
    const next = await page.evaluate(() => document.activeElement && document.activeElement.dataset.sec);
    if (next !== 'drivelinks') fail(`→ should move to the 🔗 Drive Links pill: ${next}`);
    await page.keyboard.press('Enter'); await page.waitForTimeout(200);
    if (await page.evaluate(() => state.adminTab) !== 'drivelinks') fail('Enter on a pill should open its section');

    // 5. on a phone
    await page.setViewportSize({ width: 390, height: 844 });
    await open('activities');
    const phone = await page.evaluate(() => ({ over: document.documentElement.scrollWidth - window.innerWidth,
        small: [...document.querySelectorAll('.cmsh-sec, .cmsh-row .admin-tab-btn, .cmsh-banner .ft-banner-k, .cmsh-banner .ft-banner-sub')].map(e => [e.textContent.trim().slice(0, 20), parseFloat(getComputedStyle(e).fontSize)]).filter(x => x[1] < 14) }));
    if (phone.over > 1) fail(`on a phone the Admin screen scrolls sideways by ${phone.over}px`);
    if (phone.small.length) fail(`type under 14px on the Admin sections: ${JSON.stringify(phone.small)}`);

    await browser.close();
    if (failures.length) { console.error('Admin sections:\n - ' + failures.join('\n - ')); process.exit(1); }
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
