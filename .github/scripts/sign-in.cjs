// A trainee signs in, in the browser tests. The name + batch form is gone: trainees arrive from the LSH Training Portal
// with a ticket (js/portal-gate.js), and the test server has no Portal secret. So the test puts the form's three fields on
// the page, out of sight, and runs the page's own submitLogin(), which registers and signs the trainee in as the form did.
// Usage: const signIn = require('./sign-in.cjs'); await signIn(page, 'First', 'Last', 'BATCH');
// The page may reload itself once while signing in (js/cm-case-flow.js keepCaseYear / keepDolOffset: a trainee whose record is
// on another case year or Date of Loss offset is shown the page built on theirs), which ends the evaluate below with
// "Execution context was destroyed". That reload is the app working: wait for the page to come back signed in.
const reloaded = (e) => /Execution context was destroyed|navigation|Target closed/i.test(String(e && e.message || e));
module.exports = async function signIn(page, first, last, batch) {
    await page.waitForFunction(() => typeof submitLogin === 'function', null, { timeout: 15000 });
    try { await submitIn(page, first, last, batch); }
    catch (e) {
        if (!reloaded(e)) throw e;
        await page.waitForLoadState('load');
        await page.waitForFunction(() => typeof state === 'object' && !!state.traineeId, null, { timeout: 15000 });
    }
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
