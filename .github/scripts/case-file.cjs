// The Case File page: the facts are the trainer's, and the page fits one screen.
//
// The fact cards are the answer key — the audited specials, the fork, Track A's net sheet, how the suit
// ends — so a trainee never sees them: they build the file from the documents and their own work, and see
// their own timeline here. The page is tabs, not a column to scroll: the hero keeps its size and the open
// tab takes the rest of the screen, so nothing scrolls away on a laptop.
// Checks, in a browser at three screen sizes: a trainee gets no fact tabs and none of the answers; a
// trainer gets them, marked as theirs; and for both, on every tab, neither the window nor the page body
// scrolls.
// Usage: node .github/scripts/case-file.cjs [baseUrl]   (needs `npm i playwright`; a local server on baseUrl)
const { chromium } = require('playwright');
const signIn = require('./sign-in.cjs');
const BASE = process.argv[2] || 'http://localhost:8787/';
const SIZES = [[1366, 768], [1920, 1080], [1280, 720]];
// lines that only appear in the answer key
const ANSWERS = [/net to John Doe/i, /Track A: The File Settles/i, /after the audit/i, /Keystone tenders/i];
const sleep = ms => new Promise(r => setTimeout(r, ms));

const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };

(async () => {
    const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
    for (const [W, H] of SIZES) {
        const page = await browser.newPage({ viewport: { width: W, height: H } });
        page.on('pageerror', e => failures.push(`${W}x${H} page error: ${e.message}`));
        await page.goto(BASE, { waitUntil: 'load' }); await sleep(700);
        await signIn(page, 'Case', 'File', 'B100926');
        await page.evaluate(async () => {
            const key = 'trainee:' + state.traineeId;
            const r = await fetch('/api/storage/get', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key }) }).then(r => r.json());
            const rec = JSON.parse(r.value || '{}'); rec.approved = true;
            await fetch('/api/storage/set', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ key, value: JSON.stringify(rec) }) });
        });
        await page.reload({ waitUntil: 'load' }); await sleep(1400);

        // the trainee
        await page.evaluate(() => { state.isAdmin = false; state.adminPreview = false; state.cfFileTab = 'now'; goto('clientprofile'); });
        await sleep(400);
        const t = await page.evaluate(() => {
            const main = document.querySelector('#app > main');
            return { text: document.body.innerText, tabs: document.querySelectorAll('.cf-file-tab').length,
                cards: document.querySelectorAll('.cf-file-sec').length,
                window: document.documentElement.scrollHeight - innerHeight, body: main.scrollHeight - main.clientHeight };
        });
        check(t.cards === 0 && t.tabs === 0, `${W}x${H} a trainee gets no fact cards and no key tabs (cards ${t.cards}, tabs ${t.tabs})`);
        const leaked = ANSWERS.filter(re => re.test(t.text)).map(String);
        check(!leaked.length, `${W}x${H} and none of the answers are on the page${leaked.length ? ': ' + leaked.join(', ') : ''}`);
        check(t.window <= 2 && t.body <= 2, `${W}x${H} the trainee's Case File fits one screen (window+${t.window}, body+${t.body})`);

        // the trainer
        await page.evaluate(() => { state.isAdmin = true; render(); }); await sleep(400);
        const tabs = await page.evaluate(() => Array.from(document.querySelectorAll('.cf-file-tab')).map(b => b.textContent.trim()));
        check(tabs.length >= 6, `${W}x${H} a trainer gets the case in tabs: ${tabs.join(' · ')}`);
        check(await page.evaluate(() => { const k = Array.from(document.querySelectorAll('.cf-file-tab.key')); return k.length >= 5 && k.every(b => /trainer only/i.test(b.title)); }), `${W}x${H} and they are marked as the trainer's (dashed, "trainer only")`);
        const over = await page.evaluate(async () => {
            const bad = [];
            for (const b of Array.from(document.querySelectorAll('.cf-file-tab'))) {
                const label = b.textContent.trim();
                b.click(); await new Promise(r => setTimeout(r, 260));
                const main = document.querySelector('#app > main');
                const w = document.documentElement.scrollHeight - innerHeight, y = main.scrollHeight - main.clientHeight;
                const cols = document.querySelector('.cf-file-cols');
                const inner = cols ? cols.scrollHeight - cols.clientHeight : 0;
                if (w > 2 || y > 2 || inner > 2) bad.push(`${label} (window+${w}, body+${y}, facts+${inner})`);
            }
            return bad;
        });
        check(!over.length, `${W}x${H} every tab fits one screen${over.length ? ': ' + over.join('; ') : ''}`);
        await page.close();
    }
    await browser.close();
    if (failures.length) { console.error(`\n${failures.length} check(s) failed.`); process.exit(1); }
    console.log('\nAll good: the facts are the trainer\'s, and the Case File fits one screen.');
})().catch(e => { console.error(e); process.exit(1); });
