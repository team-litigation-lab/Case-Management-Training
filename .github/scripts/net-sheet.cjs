// @check browser — 📊 the LSH Net Sheet ties out when filled from the case file: providers found by name in any row, a Non-Medical Provider Ledger (Riverton Drug, paid by John, owes nothing), costs typed as sums, and every miss says how to fix it
// net-sheet.html + js/cm-net-sheet.js, standalone (saved on this device). Track A's final sheet is filled from
// curriculum/5-day-flow/case-file.md with the ledger in an order of its own (the ledger starts blank, so a trainee's rows
// are theirs): Check my sheet passes every check at the liens and final stages and the net is $20,359.92. Then Riverton
// Drug is moved into the medical ledger: the checks miss, and each miss carries a 🛠 How to fix line. Track B's
// litigated sheet ties out at $14,713.75. Column G is the template's Med Pay (documents/templates/LSH_Net_Sheet.xlsx).
// Usage: node .github/scripts/net-sheet.cjs [baseUrl]   (with .github/scripts/server.mjs running; needs Playwright)
const { chromium } = require('playwright');
const BASE = process.argv[2] || 'http://localhost:8787/';
const failures = []; const fail = (m) => failures.push(m);
const A = {   // Track A, settled before suit
  C7: 'Keystone BI + Harbor Point UM + Cardinal State UM', L7: '40000', C11: '33⅓%',
  C12: 'Police Report', L12: '25', C18: 'Records and billing; MRI disc', L18: '214.75 + 25', C17: 'Certified mail; postage and copies', L17: '72 + 150',
  // the ledger in an order of its own: Peach State first, Riverton Spine & Rehab fourth
  B25: 'Health plan lien', C25: 'Peach State Health Plan', D25: '1860', L25: '1240',
  B26: 'Urgent care', C26: 'Riverton Urgent Care', D26: '685', G26: '685',
  B27: 'Orthopedics', C27: 'Lakeside Orthopedics', D27: '1920', G27: '1920',
  B28: 'Chiro / PT (LOP)', C28: 'Riverton Spine & Rehab', D28: '6290', H28: '185', L28: '4580',
  B29: 'MRI', C29: 'Summit Imaging Center', D29: '2395', G29: '2395',
  // the emergency care of the first 48 hours: PIP's $10,000 at the fee schedule, the rest written off (no balance billing)
  B30: 'Emergency room', C30: 'Riverton General Hospital', D30: '24400', E30: '8850', H30: '15550',
  B33: 'Ambulance (EMS)', C33: 'Riverton Fire EMS', D33: '2182.60', E33: '1150', H33: '1032.60',
  B31: 'Pain management', C31: 'Crescent Pain & Spine', D31: '3400', F31: '1860', H31: '1540',
  B61: 'Pharmacy', C61: 'Riverton Drug', D61: '312.40', F61: '312.40',
  B62: 'Counseling (EAP)', C62: 'Stonebridge EAP Services', D62: '0',
};
(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? { executablePath: process.env.CHROMIUM_PATH } : {});
  const page = await browser.newPage({ viewport: { width: 1366, height: 768 } });
  page.on('pageerror', e => fail(`page error: ${e.message}`));
  const open = async (stage) => { await page.goto(BASE + 'net-sheet.html?stage=' + stage, { waitUntil: 'load' }); await page.waitForSelector('#ns .ns-in'); };
  const fill = (cells) => page.evaluate((cells) => { Object.entries(cells).forEach(([k, v]) => { const el = document.querySelector(`#ns [data-k="${k}"]`); if (!el) throw new Error('no cell ' + k); el.value = v; el.dispatchEvent(new Event('input', { bubbles: true })); }); }, cells);
  const check = (stage) => page.evaluate((stage) => { const s = document.querySelector('#ns-stage'); s.value = stage; s.dispatchEvent(new Event('change')); CMNetSheet.check();
    const r = CMNetSheet.sheet.checks[stage]; return { passed: r.passed, total: r.total, miss: r.items.filter(x => !x.ok).map(x => x.cell + '=' + x.got), box: document.querySelector('#ns-check').innerText, net: CMNetSheet.calc().L52 }; }, stage);
  try {
    await page.goto(BASE + 'net-sheet.html', { waitUntil: 'load' }); await page.evaluate(() => localStorage.clear());
    await open('final');
    const heads = await page.evaluate(() => [...document.querySelectorAll('.ns-ledger:not(.ns-nonmed) th')].map(t => t.textContent));
    if (heads[5] !== 'Med Pay' || heads.filter(h => h === 'PIP' || h === 'PIP Payments').length !== 1) fail(`the ledger's columns should follow the firm template (PIP Payments, Health Payments, Med Pay): ${heads.join(' | ')}`);
    if (!await page.evaluate(() => /Non-Medical Provider Ledger/.test(document.querySelector('#ns').textContent))) fail('the sheet has no Non-Medical Provider Ledger');
    await fill(A);
    for (const st of ['recovery', 'liens', 'final']) { const r = await check(st); if (r.passed !== r.total) fail(`Track A filled from the case file should tie out at ${st}: ${r.passed}/${r.total}, missed ${r.miss.join(', ')}`); }
    const r = await check('final');
    if (Math.abs(r.net - 20359.92) > 0.005) fail(`the net to John Doe should be $20,359.92: ${r.net}`);
    if (!/ties out/.test(r.box)) fail(`a sheet that ties out should say so: ${r.box.slice(0, 200)}`);
    // Riverton Drug in the medical ledger instead: misses, each with how to fix it
    await fill({ B61: '', C61: '', D61: '', F61: '', B32: 'Pharmacy', C32: 'Riverton Drug', D32: '312.40' });
    const w = await check('final');
    if (w.passed === w.total) fail('Riverton Drug in the medical ledger (as a lien) should not tie out');
    const fixes = (w.box.match(/How to fix:/g) || []).length;
    if (fixes !== w.total - w.passed) fail(`every miss should say how to fix it: ${fixes} fix lines for ${w.total - w.passed} misses\n${w.box}`);
    if (!/Non-Medical Provider Ledger/.test(w.box)) fail(`the fix should say where Riverton Drug goes: ${w.box}`);
    if (/<code>|\bL52\b|\bI61\b/.test(w.box)) fail(`the check should name what is wrong in words, not cell codes: ${w.box.slice(0, 300)}`);
    // Track B, the litigated sheet
    await open('litigation');
    await fill(Object.assign({}, A, { C11: '40%', L25: '1116', L28: '4275', C13: 'Filing $218 + Allied Process $285', L13: '218 + 285', C14: 'Mediation + arbitration', L14: '1200 + 900', C16: 'Riverton Court Reporting', L16: '645.50', C19: 'Certified records', L19: '160' }));
    const b = await check('litigation');
    if (b.passed !== b.total || Math.abs(b.net - 14713.75) > 0.005) fail(`Track B filled from the case file should tie out at $14,713.75: ${b.passed}/${b.total}, net ${b.net}, missed ${b.miss.join(', ')}`);
  } finally { await browser.close(); }
  if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
  console.log('📊 Net Sheet: filled from the case file in any row order it ties out (Track A $20,359.92, Track B $14,713.75), Riverton Drug sits in the Non-Medical Provider Ledger owing nothing, and every miss says how to fix it.');
  console.log('All good.');
})().catch(e => { console.error(e); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); });
