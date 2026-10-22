// One tools access per Practice Lab session (caseFlowPractice in js/cm-case-flow.js).
// A day's activities are worked in the same few platforms, so a set of tool buttons on every activity
// row was the same two or three buttons repeated down the page, and opening one from the wrong row
// landed the trainee on the wrong step.
// Checks, for every day of the Case Flow:
//   - the day offers its tools once, in one row, and each tool appears in it exactly once;
//   - the row holds every distinct tool the day's activities are worked in, no more;
//   - no activity row carries tool buttons of its own any more, while each still names its tool;
//   - each tool in the row opens on the first activity of that day worked in it;
//   - a locked day offers no tools at all;
//   - the negotiating and communicating practice (EMAIL_NEED in js/cm-case-flow.js): every activity it
//     names exists in the Case Flow, every scenario it names is one the Portal serves, a named activity
//     is offered Email Replies among its tools and opens it on that scenario, and an activity that is
//     not named is unaffected.
// Usage: node .github/scripts/practice-tools.cjs [baseUrl]   (needs `npm i playwright` and a browser)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
// a trainee of this run's own, so saved drafts from an earlier run don't bleed in; letters only,
// because the sign-in refuses a name with digits in it
const uniq = () => Array.from({ length: 6 }, () => 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)]).join('');

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    const failures = []; const fail = (m) => failures.push(m);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    page.on('pageerror', e => fail(`page error: ${e.message}`));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await signIn(page, 'Lab', 'Trainee' + uniq(), 'B100926');
    await page.evaluate(async () => {
        const key = 'trainee:' + state.traineeId;
        const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
        // keep the record's own id: writing {approved:true} over a record that hasn't been saved yet
        // leaves an id-less trainee behind, which the Admin page then has to cope with
        const rec = JSON.parse(r.value || '{}'); rec.approved = true; if (!rec.id) rec.id = state.traineeId;
        await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
    });
    await page.reload({ waitUntil: 'load' }); await page.waitForTimeout(1500);

    const report = await page.evaluate(async () => {
        const out = [], sleep = (ms) => new Promise(r => setTimeout(r, ms));
        state.isAdmin = true;                       // every day open, so each day's tools can be read
        for (const d of DAYS) {
            goto('practice'); cmCaseFlow.pxDay(d.cf.n); await sleep(140);
            const day = document.querySelector('.px-day');
            if (!day) { out.push({ day: d.cf.n, err: 'the day did not render on the Practice page' }); continue; }
            const row = day.querySelector('.cf-px-toolrow');
            const inRow = row ? [...row.querySelectorAll('[data-tool]')].map(b => b.dataset.tool) : [];
            // what the day's activities are actually worked in
            const wanted = new Set();
            const firstFor = {};
            d.lessons.forEach((l) => { if (l.cf.block.kind !== 'activity') return;
                (window.cmCaseFlowTest ? window.cmCaseFlowTest.blockTools(l.cf.block) : []).forEach(id => {
                    wanted.add(id); if (firstFor[id] === undefined) firstFor[id] = l.cf.block.id; }); });
            out.push({ day: d.cf.n, rows: day.querySelectorAll('.cf-px-act').length,
                inRow, wanted: [...wanted], firstFor,
                onActs: [...day.querySelectorAll('.cf-px-act [data-tool]')].length,
                namesTool: [...day.querySelectorAll('.cf-px-act .cf-px-meta')].every(m => /🛠/.test(m.textContent)),
                opensOn: row ? [...row.querySelectorAll('[data-tool]')].map(b => (b.getAttribute('onclick').match(/'([^']*)'\s*\)$/) || [])[1]) : [] });
        }
        // a locked day offers nothing
        state.isAdmin = false; state.progress = {}; state.slideProgress = {}; state.adminUnlockedDays = [];
        const lockedN = (DAYS[DAYS.length - 1] || {}).cf.n;
        goto('practice'); cmCaseFlow.pxDay(lockedN); await sleep(140);
        const lockedDay = document.querySelector('.px-day');
        out.push({ locked: true, day: lockedN, tools: lockedDay ? lockedDay.querySelectorAll('.cf-px-toolrow [data-tool]').length : -1 });
        return out;
    });

    /* The negotiating / communicating practice. The scenarios live in the Training Portal
       (simulators/reply-packs/emails.json); their ids are listed here so this repo's check fails loudly
       if a mapping names one the Portal doesn't serve. Keep in step when the Portal's pack changes. */
    const PORTAL_SCENARIOS = ['cm_client_net', 'cm_adjuster_statement', 'cm_hospital_lien', 'cm_records_dob',
        'cm_extension', 'cm_spouse', 'cm_attorney_status', 'cm_lop_provider', 'all_wire_phish',
        'all_web_inquiry', 'cm_client_bills_collections'];
    const need = await page.evaluate(() => {
        const T = window.cmCaseFlowTest;
        if (!T || !T.EMAIL_NEED) return { err: 'cmCaseFlowTest.EMAIL_NEED is not exposed' };
        const blocks = {};
        DAYS.forEach(d => d.lessons.forEach(l => { blocks[l.cf.block.id] = l.cf.block; }));
        const rows = Object.keys(T.EMAIL_NEED).map(id => {
            const b = blocks[id];
            return { id, scenario: T.EMAIL_NEED[id], exists: !!b, kind: b && b.kind,
                tools: b ? T.blockTools(b) : [], target: T.emailTarget('replies', id) };
        });
        // an activity with no entry is unaffected
        const plain = Object.values(blocks).find(b => b.kind === 'activity' && !T.EMAIL_NEED[b.id]);
        return { rows, plain: plain ? { id: plain.id, tools: T.blockTools(plain), target: T.emailTarget('replies', plain.id) } : null,
            workspace: T.emailTarget('email', (rows[0] || {}).id) };
    });
    if (need.err) fail(need.err);
    else {
        need.rows.forEach(r => {
            if (!r.exists) fail(`the negotiating / communicating practice names "${r.id}", which is not a block in the Case Flow any more`);
            else if (r.kind !== 'activity') fail(`"${r.id}" is a ${r.kind}, not an activity: practice belongs on an activity`);
            if (!PORTAL_SCENARIOS.includes(r.scenario)) fail(`"${r.id}" asks for the scenario "${r.scenario}", which the Portal doesn't serve`);
            if (r.exists && !r.tools.includes('replies')) fail(`"${r.id}" has practice to do but isn't offered Email Replies among its tools`);
            if (r.target !== 'email=' + r.scenario) fail(`"${r.id}" opens Email Replies on "${r.target}", not its own scenario`);
        });
        if (!need.rows.length) fail('no negotiating or communicating practice is mapped at all');
        const kinds = new Set(need.rows.map(r => r.scenario));
        if (kinds.size < 6) fail(`only ${kinds.size} different scenarios are used: the practice should cover both negotiating and communicating`);
        if (need.plain) {
            if (need.plain.tools.includes('replies')) fail(`"${need.plain.id}" has no practice mapped but is offered Email Replies anyway`);
            if (need.plain.target !== '') fail(`"${need.plain.id}" has no practice mapped but targets "${need.plain.target}"`);
        }
        if (need.workspace !== 'inbox=1') fail(`the Email Workspace should open the trainee's own inbox (got "${need.workspace}")`);
    }

    report.forEach(r => {
        if (r.err) { fail(`Day ${r.day}: ${r.err}`); return; }
        if (r.locked) { if (r.tools !== 0) fail(`a locked day offers ${r.tools} tool(s); it should offer none`); return; }
        if (!r.rows) { fail(`Day ${r.day}: no activities on the Practice page`); return; }
        if (r.onActs) fail(`Day ${r.day}: ${r.onActs} tool button(s) still sit on the activity rows; the session's tools belong in one row`);
        if (!r.namesTool) fail(`Day ${r.day}: an activity row no longer names the tool it is worked in`);
        if (!r.inRow.length) fail(`Day ${r.day}: the session has no tools row`);
        if (new Set(r.inRow).size !== r.inRow.length) fail(`Day ${r.day}: a tool appears more than once in the session's row (${r.inRow.join(', ')})`);
        // every tool the day needs, and nothing it doesn't (a tool with no live address is left out)
        const missing = r.wanted.filter(id => !r.inRow.includes(id));
        const extra = r.inRow.filter(id => !r.wanted.includes(id));
        if (extra.length) fail(`Day ${r.day}: the session's row offers a tool the day doesn't use: ${extra.join(', ')}`);
        if (r.wanted.length && missing.length === r.wanted.length) fail(`Day ${r.day}: none of the day's tools are in its row (wanted ${r.wanted.join(', ')})`);
        // each opens on the first activity of the day worked in it
        r.inRow.forEach((id, i) => { const want = r.firstFor[id];
            if (want && r.opensOn[i] !== want) fail(`Day ${r.day}: ${id} opens on "${r.opensOn[i]}", not the day's first activity worked in it ("${want}")`); });
    });

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log("The Practice Lab offers its tools once per session: one row per day holding each of the day's tools once, opening on the first activity worked in it, with no tool buttons left on the activity rows and a locked day offering none.");
    console.log(`Negotiating and communicating practice: ${need.rows ? need.rows.length : 0} activities each open their own Email Replies scenario.`);
    console.log('All good.');
})().catch(e => { console.error(e); process.exit(1); });
