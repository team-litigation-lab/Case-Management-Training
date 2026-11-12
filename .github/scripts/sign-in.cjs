// A trainee signs in, in the browser tests. The name + batch form is gone: trainees arrive from the LSH Training Portal
// with a ticket (js/portal-gate.js), and the test server has no Portal secret. So the test puts the form's three fields on
// the page, out of sight, and runs the page's own submitLogin(), which registers and signs the trainee in as the form did.
// Usage: const signIn = require('./sign-in.cjs'); await signIn(page, 'First', 'Last', 'BATCH');
//
// A page can reload itself once while a returning trainee signs in (js/cm-case-flow.js keepCaseYear / keepDolOffset: it
// moves to the trainee's case year or Date of Loss offset; or it takes a new version). That ends the evaluate below with
// "Execution context was destroyed". The reload is the app working: once it is back, a trainee it kept signed in is done;
// otherwise the sign-in is simply done again on the reloaded page. What navigated, and to where, is printed so a reload
// nobody expected is seen in the log.
const reloaded = (e) => /Execution context was destroyed|navigation|Target closed/i.test(String(e && e.message || e));
module.exports = async function signIn(page, first, last, batch) {
    const navs = [], onReq = (r) => { try { if (r.isNavigationRequest() && r.frame() === page.mainFrame()) navs.push(r.url()); } catch (e) {} };
    page.on('request', onReq);
    try {
        for (let attempt = 1; ; attempt++) {
            await page.waitForFunction(() => typeof submitLogin === 'function', null, { timeout: 15000 });
            try { await submitIn(page, first, last, batch); break; }
            catch (e) {
                if (attempt >= 2 || !reloaded(e)) throw e;
                await page.waitForLoadState('load').catch(() => {});
                await page.waitForTimeout(800);
                const why = await page.evaluate(() => { const o = {}; try { for (let i = 0; i < sessionStorage.length; i++) { const k = sessionStorage.key(i); if (/reload|resume|update|year|dol/i.test(k)) o[k] = String(sessionStorage.getItem(k)).slice(0, 120); } } catch (x) {} return o; }).catch(() => ({}));
                const kept = await page.evaluate(() => typeof state === 'object' && !!state.traineeId).catch(() => false);
                console.log(`sign-in: the page navigated while ${first} ${last} signed in (to ${navs.join(', ') || page.url()}; ${JSON.stringify(why)}); ${kept ? 'still signed in after the reload' : 'signing in again on the reloaded page'}`);
                if (kept) break;
            }
        }
    } finally { page.off('request', onReq); }
    await page.waitForTimeout(1200);
};
async function submitIn(page, first, last, batch) {
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
}
