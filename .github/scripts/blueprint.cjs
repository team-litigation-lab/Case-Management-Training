// Blueprint test for a course portal (js/lsh-blueprint.js, js/lsh-blueprint-course.js and the
// course's js/blueprint-content.js), against .github/scripts/server.mjs. jsPDF is served from
// node_modules in place of cdnjs; /version is answered by the test so the deployment can change.
// Checks:
// - a trainee has no Trainer blueprint (it doesn't open, and Orientation isn't theirs);
// - a trainer's 🧭 Orientation has the Trainee / Trainer blueprint tabs; 🛠 Trainer blueprint opens the
//   trainer deck with both tabs, ◀ ▶ and the keys go through every slide, each fits on a laptop and on a
//   phone, Esc closes it, and the Trainee tab goes back to Orientation;
// - the numbering: the cover, then 1 to N (N slides, not counting the cover), the same everywhere. The counter
//   under the slides reads "Cover · N slides" on the cover and "k / N" on slide k, the slide's footer "k / N",
//   the contents buttons ★, 1 … N; the last slide reads "N / N", never N+1;
// - ⬇ Download PDF saves the Trainer blueprint: a page a slide, stamped with the build and the deployment,
//   its page footers "Cover", then "1 / N" … "N / N" (never "N+1 / N+1");
// - the Trainee blueprint (/blueprint.pdf) is republished after every deploy: once for a new deployment
//   id, not again for the same one, and again when the deployment changes with APP_BUILD left as it was.
// Usage: node .github/scripts/blueprint.cjs [baseUrl]   (with server.mjs running; needs `npm i playwright jspdf@4.2.1`)
const { chromium } = require('playwright');
const fs = require('fs'); const path = require('path'); const zlib = require('zlib');
const BASE = process.argv[2] || 'http://localhost:8787/';
const JSPDF = fs.readFileSync(path.join(path.dirname(require.resolve('jspdf')), 'jspdf.umd.min.js'));
const failures = []; const fail = (m) => failures.push(m);
function inspect(buf) {
    let raw = buf.toString('latin1'), at = 0; const parts = [raw];
    while ((at = raw.indexOf('stream', at)) >= 0) {
        const start = raw.indexOf('\n', at) + 1, end = raw.indexOf('endstream', start);
        if (start <= 0 || end < 0) break;
        try { parts.push(zlib.inflateSync(buf.subarray(start, end)).toString('latin1')); } catch (e) { /* not a Flate stream */ }
        at = end + 9;
    }
    raw = parts.join('\n');
    const text = (raw.match(/\((?:\\.|[^\\)])*\)\s*Tj/g) || []).map(s => s.replace(/\)\s*Tj$/, '').slice(1).replace(/\\(.)/g, '$1')).join('\n');
    return { pdf: parts[0].startsWith('%PDF'), pages: (raw.match(/\/Type \/Page\b(?!s)/g) || []).length, text };
}
let deployment = 'dep-aaaa1111-first';
async function open(browser, viewport, admin) {
    const context = await browser.newContext({ viewport, acceptDownloads: true });
    const page = await context.newPage();
    page.on('pageerror', e => fail(`${viewport.width}px: page error: ${e.message}`));
    await page.route(/cdnjs\.cloudflare\.com\/ajax\/libs\/jspdf\/4\.2\.1\/jspdf\.umd\.min\.js/, r => r.fulfill({ contentType: 'text/javascript', body: JSPDF }));
    await page.route(/\/version$/, r => r.fulfill({ contentType: 'text/plain', body: `Portal build deployed: test\nDeployment: ${deployment}\n` }));
    await page.goto(BASE, { waitUntil: 'load' }); await page.waitForTimeout(800);
    await page.fill('#loginFirstInput', 'Blue'); await page.fill('#loginLastInput', admin ? 'Trainer' : 'Print'); await page.fill('#loginBatchInput', 'CIBP');
    await page.click('#loginSubmitBtn'); await page.waitForTimeout(1200);
    if (admin) await page.evaluate(() => { state.isAdmin = true; goto('orientation'); render(); });
    await page.waitForTimeout(300);
    return page;
}
async function walk(page, label) {
    return page.evaluate(async (label) => {
        const out = [];
        // the cover and the slides (the counter has no "/" on the cover, so the count comes from the deck itself)
        const n = LSHBlueprint.decks()[LSHBlueprint.current().deck].slides.length, total = n + 1;
        const tooFar = new RegExp(`\\b${total}\\b`);
        const count = () => document.getElementById('lbp-count').textContent.trim();
        for (let i = 0; i < total; i++) {
            LSHBlueprint.go(i, true); await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
            const name = i === 0 ? `${label} cover` : `${label} slide ${i}`;
            const slide = document.getElementById('lbp-slide'), card = slide.firstElementChild;
            if (!card) { out.push(`${name}: nothing drawn`); continue; }
            const over = [card, ...card.querySelectorAll('.lbp-main, .lbp-points, .lbp-side, .lbp-contents')].filter(e => e.scrollHeight - e.clientHeight > 2 || e.scrollWidth - e.clientWidth > 2);
            if (over.length) out.push(`${name}: cut off (${over.map(e => e.className).join(', ')})`);
            const sr = slide.getBoundingClientRect(), stage = document.getElementById('lbp-stage').getBoundingClientRect();
            if (sr.left < stage.left - 1 || sr.right > stage.right + 1 || sr.top < stage.top - 1 || sr.bottom > stage.bottom + 1) out.push(`${name}: bigger than the screen`);
            if ([...card.querySelectorAll('.lbp-foot, .lbp-points li:last-child, .lbp-tip')].some(e => e.getBoundingClientRect().bottom > sr.bottom + 1)) out.push(`${name}: runs past the bottom of the slide`);
            // the numbering: the cover, then 1 to n on the counter, the slide's footer and its kicker
            const c = count(), foot = card.querySelector('.lbp-foot span:last-child'), kicker = card.querySelector('.lbp-kicker');
            if (i === 0) {
                if (c !== `Cover · ${n} slides`) out.push(`${name}: the counter under the slides reads "${c}", it should read "Cover · ${n} slides"`);
            } else {
                if (c !== `${i} / ${n}`) out.push(`${name}: the counter under the slides reads "${c}", it should read "${i} / ${n}"`);
                if (!foot || foot.textContent.trim() !== `${i} / ${n}`) out.push(`${name}: the slide's footer reads "${foot ? foot.textContent.trim() : ''}", it should read "${i} / ${n}"`);
                if (!kicker || !kicker.textContent.includes(`${i} of ${n}`)) out.push(`${name}: the slide's header reads "${kicker ? kicker.textContent.trim() : ''}", it should say "${i} of ${n}"`);
            }
            if (tooFar.test(c) || (foot && tooFar.test(foot.textContent))) out.push(`${name}: shows the number ${total}, but the deck has only ${n} slides (the cover isn't a numbered slide)`);
        }
        // the contents buttons are ★, 1 … n, and the last slide reads n / n, the same number as the last button
        const buttons = [...document.querySelectorAll('#lbp-toc button')].map(b => b.textContent.trim());
        if (buttons.join(',') !== ['★'].concat(Array.from({ length: n }, (x, k) => String(k + 1))).join(',')) out.push(`${label}: the contents buttons read ${buttons.join(', ')}, they should be ★, then 1 to ${n}`);
        if (count() !== `${n} / ${n}` || buttons[buttons.length - 1] !== String(n)) out.push(`${label}: the last slide's counter reads "${count()}" and the last contents button "${buttons[buttons.length - 1]}", both should be ${n}`);
        return { out, total, n };
    }, label);
}
(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});

    // ---- a trainee ----
    let page = await open(browser, { width: 1366, height: 768 }, false);
    const t = await page.evaluate(() => ({ opened: LSHBlueprint.open('trainer'), isOpen: LSHBlueprint.isOpen(), tabs: !!document.querySelector('.lbp-or-tabs') }));
    if (t.opened || t.isOpen || t.tabs) fail(`a trainee could reach the Trainer blueprint: ${JSON.stringify(t)}`);
    await page.context().close();

    // ---- a trainer, on a laptop ----
    page = await open(browser, { width: 1366, height: 768 }, true);
    const tabs = await page.evaluate(() => [...document.querySelectorAll('.lbp-or-tabs button')].map(b => b.textContent.trim()));
    if (tabs.join('|') !== '🧭 Trainee blueprint|🛠 Trainer blueprint') fail(`Orientation's blueprint tabs: ${tabs.join('|')}`);
    await page.click('#lbp-or-trainer'); await page.waitForTimeout(400);
    const a = await page.evaluate(() => ({ open: LSHBlueprint.isOpen(), deck: document.getElementById('lbp-slide').dataset.deck, tabs: [...document.querySelectorAll('#lbp-tabs button')].filter(b => b.offsetParent).map(b => b.textContent.trim()), sub: document.getElementById('lbp-sub').textContent, build: APP_BUILD }));
    if (!a.open || a.deck !== 'trainer' || a.tabs.join() !== 'Trainer blueprint,Trainee blueprint') fail(`🛠 Trainer blueprint didn't open the trainer deck with both tabs: ${JSON.stringify(a)}`);
    if (!a.sub.includes(`build ${a.build}`) || !a.sub.includes('deploy dep-aaaa')) fail(`the Trainer blueprint's header doesn't show the build and deployment: ${a.sub}`);
    await page.keyboard.press('ArrowRight'); await page.keyboard.press('ArrowRight');
    if (!(await page.textContent('#lbp-count')).startsWith('2 /')) fail(`← → didn't move through the trainer deck (two presses from the cover should show slide 2, the counter reads "${await page.textContent('#lbp-count')}")`);
    const w = await walk(page, 'trainer 1366px'); w.out.forEach(fail);
    const [dl] = await Promise.all([page.waitForEvent('download'), page.click('#lbp-pdf-btn')]);
    const pdf = inspect(fs.readFileSync(await dl.path()));
    if (!/_Blueprint_Trainer\.pdf$/.test(dl.suggestedFilename()) || !pdf.pdf || pdf.pages !== w.total) fail(`the Trainer blueprint PDF: ${dl.suggestedFilename()}, ${pdf.pages} pages for the cover and ${w.n} slides`);
    if (!pdf.text.includes(`build ${a.build}`) || !pdf.text.includes('deploy dep-aaaa')) fail('the Trainer blueprint PDF isn\'t stamped with the build and the deployment');
    const unnumbered = Array.from({ length: w.n }, (x, k) => `${k + 1} / ${w.n}`).filter(x => !pdf.text.includes(x));
    if (!/^Cover$/m.test(pdf.text) || unnumbered.length) fail(`the Trainer blueprint PDF's page footers should read Cover, then 1 / ${w.n} to ${w.n} / ${w.n}${unnumbered.length ? ` (missing: ${unnumbered.join(', ')})` : ''}`);
    if (pdf.text.includes(`${w.total} / ${w.total}`)) fail(`the Trainer blueprint PDF shows "${w.total} / ${w.total}", but it has only ${w.n} slides after the cover`);
    const titles = await page.evaluate(() => LSHBlueprint.decks().trainer.slides.map(s => s.title.replace(/[^\x00-\xff]/g, '').trim()));
    const missing = titles.filter(x => !pdf.text.includes(x)); if (missing.length) fail(`the Trainer blueprint PDF is missing: ${missing.join(' | ')}`);
    if (/chartswap|casepeer/i.test(pdf.text)) fail('the Trainer blueprint names another product');
    await page.click('#lbp-tabs button[data-deck="trainee"]'); await page.waitForTimeout(300);
    const back = await page.evaluate(() => ({ open: LSHBlueprint.isOpen(), view: state.view }));
    if (back.open || back.view !== 'orientation') fail(`the Trainee blueprint tab should go back to Orientation: ${JSON.stringify(back)}`);
    await page.click('#lbp-or-trainer'); await page.keyboard.press('Escape');
    if (await page.evaluate(() => LSHBlueprint.isOpen())) fail('Esc didn\'t close the Trainer blueprint');

    // ---- the Trainee blueprint is republished after every deploy ----
    const pub = await page.evaluate(async () => {
        const sets = [];
        const realSet = window.sharedSet;
        window.sharedSet = async (k, v) => { if (k === 'blueprint:pdf') sets.push(v.deploy || ''); return realSet(k, v); };
        window.buildOrientationPdfDoc = async () => ({ output: () => 'data:application/pdf;base64,JVBERi0xLjQK' });
        const run = async () => { lshBlueprintDeployment.reset(); state.blueprintJob = false; await autoPublishBlueprint(); return sets.length; };
        const r = { first: await run(), same: await run() };
        return r;
    });
    if (pub.first !== 1 || pub.same !== 1) fail(`the blueprint should publish once for a deploy and not again: ${JSON.stringify(pub)}`);
    deployment = 'dep-bbbb2222-second';
    const pub2 = await page.evaluate(async () => { lshBlueprintDeployment.reset(); state.blueprintJob = false; await autoPublishBlueprint(); return (await sharedGet('blueprint:meta')) || {}; });
    if (pub2.deploy !== 'dep-bbbb2222-second') fail(`a new deploy (same APP_BUILD) didn't republish the blueprint: ${JSON.stringify(pub2)}`);
    const served = await page.evaluate(async () => { const r = await fetch('/blueprint.pdf'); return { status: r.status, type: r.headers.get('content-type') }; });
    if (served.status !== 200 || !/pdf/.test(served.type || '')) fail(`/blueprint.pdf after publishing: ${JSON.stringify(served)}`);
    await page.context().close();

    // ---- a trainer, on a phone ----
    page = await open(browser, { width: 390, height: 844 }, true);
    await page.evaluate(() => LSHBlueprint.open('trainer'));
    (await walk(page, 'trainer 390px')).out.forEach(fail);

    await browser.close();
    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log(`Blueprint test passed (Trainer blueprint: the cover and ${w.n} slides, numbered Cover then 1 to ${w.n} on the page and in its PDF, build and deployment stamped; trainees can't open it; the Trainee blueprint republished once per deploy).`);
})().catch(e => { console.error(e); process.exit(1); });
