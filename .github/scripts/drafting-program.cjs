// @check node — ✉️ LOR Drafting and 🏥 Med Provider Drafting open the Portal's shared Drafting tool with ?program=CM (Med Provider on its own tab), in a new tab, signed in, so their results reach this course's Scorecard
// The Portal's simulators know which course a result counts for only from the link's ?program= (simulators/sim.js), and
// js/cm-lor.js / js/cm-medprov.js built their own address without it, so a Drafting result could miss cm:simresults:<id>
// or be filed under another program. Checked by running both files (and the 🧰 Tools menu's picker) with the page stubbed:
//   1. the LOR card's opener asks js/lsh-tool-links.js to open drafting.html?program=CM in a new tab (it adds the ticket);
//   2. the Med Provider card's opener asks for drafting.html?program=CM&tab=prov;
//   3. the old #/lor and #/medprov addresses open the same;
//   4. the 🧰 Tools menu's ✉️ LOR Drafting and 🏥 Med Provider Drafting open the same two.
// Usage: node .github/scripts/drafting-program.cjs   (no server, no browser needed)
const vm = require('vm'), fs = require('fs'), path = require('path');
const ROOT = path.join(__dirname, '../..');
const failures = [], fail = (m) => failures.push(m);
const LOR = 'https://cm-training-activity.pages.dev/simulators/drafting.html?program=CM';
const PROV = 'https://cm-training-activity.pages.dev/simulators/drafting.html?program=CM&tab=prov';

function run(files) {
    const opened = [], navs = [];
    const win = {
        render() { }, esc: (s) => String(s), state: { view: 'dashboard' },
        LSHToolLinks: { open: (u, t) => { opened.push([u, t || '_blank']); return {}; }, ticketed: (u) => Promise.resolve(u) },
        location: { set href(u) { navs.push(u); }, get href() { return 'https://cm.example/'; } },
        open: (u, t) => { opened.push([u, t]); return {}; },
        goto() { }, document: { getElementById: () => null, addEventListener() { }, createElement: () => ({ setAttribute() { } }), head: { appendChild() { } }, body: { appendChild() { } } }, addEventListener() { }, console, setTimeout, clearTimeout
    };
    win.window = win;
    vm.createContext(win);
    for (const f of files) vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), win, { filename: f });
    return { win, opened, navs };
}
(async () => {
    // 1–3, each file on its own and both together (either can load last: each keeps its own address)
    for (const files of [['js/cm-lor.js'], ['js/cm-medprov.js'], ['js/cm-lor.js', 'js/cm-medprov.js'], ['js/cm-medprov.js', 'js/cm-lor.js']]) {
        const { win, opened, navs } = run(files);
        const has = (f) => files.includes(f);
        if (typeof win.lshOpenPortalDrafting !== 'function') { fail(`${files.join(' + ')}: lshOpenPortalDrafting is not defined`); continue; }
        win.lshOpenPortalDrafting(); win.lshOpenPortalDrafting('prov');
        await new Promise((r) => setImmediate(r));
        const urls = opened.map((o) => o[0]);
        if (JSON.stringify(urls) !== JSON.stringify([LOR, PROV])) fail(`${files.join(' + ')}: the openers should open ${LOR} and ${PROV}, not ${JSON.stringify(urls)}`);
        if (opened.some((o) => o[1] !== '_blank')) fail(`${files.join(' + ')}: Drafting should open in a new tab, as every other tool does: ${JSON.stringify(opened)}`);
        if (navs.length) fail(`${files.join(' + ')}: the course tab should stay on the course: ${JSON.stringify(navs)}`);
        // 3. the old addresses
        opened.length = 0;
        if (has('js/cm-lor.js')) { win.state.view = 'lor'; win.render(); }
        if (has('js/cm-medprov.js')) { win.state.view = 'medprov'; win.render(); }
        const want = [].concat(has('js/cm-lor.js') ? [LOR] : [], has('js/cm-medprov.js') ? [PROV] : []);
        // (the render wrappers run in load order, last loaded first)
        if (JSON.stringify(opened.map((o) => o[0]).sort()) !== JSON.stringify(want.sort())) fail(`${files.join(' + ')}: #/lor and #/medprov should open ${JSON.stringify(want)}: ${JSON.stringify(opened)}`);
    }
    // the cards
    const { win } = run(['js/cm-lor.js', 'js/cm-medprov.js']);
    const medCard = typeof win.cmMedprovCard === 'function' ? win.cmMedprovCard() : fs.readFileSync(path.join(ROOT, 'js/cm-medprov.js'), 'utf8');
    if (!/onclick="lshOpenPortalDrafting\('prov'\)"/.test(medCard)) fail('the Med Provider Drafting card should open the Drafting tool on its Med Provider tab');
    // 4. the 🧰 Tools menu
    const sb = fs.readFileSync(path.join(ROOT, 'js/cm-skillbuilders.js'), 'utf8');
    const pick = (sb.match(/window\.cmPickDraft = function\(view\)\{[\s\S]*?\n\};/) || [])[0];
    const menu = (sb.match(/const drafting = (\[\[[^\n]*\]\]);/) || [])[1];
    if (!pick || !menu) fail('the 🧰 Tools menu\'s Drafting picker was not found in js/cm-skillbuilders.js');
    else {
        const entries = new Function('return ' + menu)();
        const viewOf = (re) => (entries.find((e) => re.test(e[1])) || [])[0];
        const calls = [];
        const ctx = { window: {}, document: { getElementById: () => null }, state: {}, lshOpenPortalDrafting: (t) => calls.push(t || ''), goto: (v) => calls.push('goto:' + v) };
        vm.createContext(ctx); vm.runInContext(pick, ctx);
        ctx.window.cmPickDraft(viewOf(/LOR Drafting/)); ctx.window.cmPickDraft(viewOf(/Med Provider/));
        if (JSON.stringify(calls) !== JSON.stringify(['', 'prov'])) fail(`the Tools menu should open LOR Drafting and Med Provider Drafting (its tab): ${JSON.stringify(calls)}`);
    }
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('LOR Drafting and Med Provider Drafting open drafting.html?program=CM (Med Provider: &tab=prov) in a new tab, from their cards, their old addresses and the Tools menu.');
})().catch((e) => { console.log(e.stack || e); process.exit(1); });
