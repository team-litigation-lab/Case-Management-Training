// A trainee signs in, in the browser tests. The name + batch form is gone: trainees arrive from the LSH Training Portal
// with a ticket (js/portal-gate.js), and the test server has no Portal secret. So the test puts the form's three fields on
// the page, out of sight, and runs the page's own submitLogin(), which registers and signs the trainee in as the form did.
// Usage: const signIn = require('./sign-in.cjs'); await signIn(page, 'First', 'Last', 'BATCH');
module.exports = async function signIn(page, first, last, batch) {
    // A page can reload itself once while a returning trainee signs in (it moves to the trainee's case year or Date of
    // Loss offset, or takes a new version). The sign-in is then simply done again on the reloaded page; what navigated,
    // and to where, is printed so a reload nobody expected is seen in the log.
    const navs = [], onReq = (r) => { try { if (r.isNavigationRequest() && r.frame() === page.mainFrame()) navs.push(r.url()); } catch (e) {} };
    page.on('request', onReq);
    try {
        for (let attempt = 1; ; attempt++) {
            await page.waitForFunction(() => typeof submitLogin === 'function', null, { timeout: 15000 });
            try {
                await page.evaluate(async ([first, last, batch]) => {
                    const box = document.createElement('div');
                    box.style.cssText = 'position:fixed;left:-9999px;top:0';
                    box.innerHTML = '<input id="loginFirstInput"><input id="loginLastInput"><input id="loginBatchInput">';
                    document.body.appendChild(box);
                    document.getElementById('loginFirstInput').value = first;
                    document.getElementById('loginLastInput').value = last;
                    document.getElementById('loginBatchInput').value = batch;
                    try { await submitLogin(); } finally { box.remove(); }
                }, [first, last, batch]);
                break;
            } catch (e) {
                if (attempt >= 2 || !/Execution context was destroyed|navigation/i.test(String(e && e.message))) throw e;
                await page.waitForLoadState('load').catch(() => {});
                await page.waitForTimeout(800);
                const why = await page.evaluate(() => { const o = {}; try { for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); if (/reload|resume|update|year|dol/i.test(k)) o[k] = String(sessionStorage.getItem(k)).slice(0, 120); } } catch (x) {} return o; }).catch(() => ({}));
                console.log(`sign-in: the page navigated while ${first} ${last} signed in (to ${navs.join(', ') || page.url()}; ${JSON.stringify(why)}); signing in again on the reloaded page`);
            }
        }
    } finally { page.off('request', onReq); }
    await page.waitForTimeout(1200);
};
