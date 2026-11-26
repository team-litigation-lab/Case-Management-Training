// @check node — 🎓 The registered full name: a Portal sign-in whose full name is now just the first + last name clears the old fullName, and a trainee's own certificate record is issued in the name the certificate shows (as a trainer's issue is)
// worker.js /api/auth/portal (fullName set, and cleared when the Portal's full equals the name), traineeWrite cert:LSH-CM-…
// (worker-cert-name.js certNameOf: fullName, else first + last, in settings:certificate.nameFormat's order), and the same
// certName as the page's js/cm-full-name.js (loaded here), so the PDF and both kinds of issued record say the same name.
// Usage: node .github/scripts/full-name-cert.cjs   (no server, no browser needed)
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { pathToFileURL } = require('url');
const { harness, reporter, ticketFor } = require('./worker-harness.cjs');
const R = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    const signIn = async (full) => h.api('/api/auth/portal', { ticket: await ticketFor({ first: 'Nina', last: 'New', b: 'B100926', u: 'U-nina', full, exp: Date.now() + 60000 }) });
    let r = await signIn('Nina Q. New'); const id = r.body && r.body.id, tok = r.body && r.body.token, key = 'trainee:' + id;
    R.check(r.status === 200 && (h.raw(key) || {}).fullName === 'Nina Q. New', `the first sign-in should keep the full name: ${JSON.stringify(h.raw(key))}`);
    r = await signIn('Nina New');
    R.check(r.status === 200 && !('fullName' in (h.raw(key) || {})) && !('fullName' in ((await h.get(key)) || {})), `a full name now the same as the name should clear fullName: ${JSON.stringify(await h.get(key))}`);
    r = await signIn('Nina Q. New');
    R.check((await h.get(key) || {}).fullName === 'Nina Q. New', 'a later full name should be kept again');

    // the trainee's own certificate record: the certificate's name
    await h.set(key, Object.assign({}, await h.get(key), { approved: true }));
    const issue = (certId) => h.api('/api/storage/set', { key: 'cert:' + certId, value: JSON.stringify({ certId, traineeId: id, name: 'Someone Else' }) }, tok);
    R.check((await issue('LSH-CM-2026-AAAAA1')).status === 200, 'the trainee should record their certificate');
    R.check((h.raw('cert:LSH-CM-2026-AAAAA1') || {}).name === 'New, Nina Q.', `a self-issued certificate should carry the certificate's name (Last, First): ${JSON.stringify(h.raw('cert:LSH-CM-2026-AAAAA1'))}`);
    h.rawPut('settings:certificate', { nameFormat: 'firstLast' });
    await issue('LSH-CM-2026-AAAAA2');
    R.check((h.raw('cert:LSH-CM-2026-AAAAA2') || {}).name === 'Nina Q. New', `in the First Last order: ${JSON.stringify(h.raw('cert:LSH-CM-2026-AAAAA2'))}`);
    h.rawPut('settings:certificate', { nameFormat: 'lastFirst' });
    await signIn('Nina New');
    await issue('LSH-CM-2026-AAAAA3');
    R.check((h.raw('cert:LSH-CM-2026-AAAAA3') || {}).name === 'New, Nina', `with no full name, the first and last name in the certificate's order: ${JSON.stringify(h.raw('cert:LSH-CM-2026-AAAAA3'))}`);

    // the Worker's certName is the page's
    const ctx = { window: { certData: () => ({}) }, state: {} }; ctx.window.window = ctx.window;
    vm.runInNewContext(`var window = this.window, state = this.state;\n${fs.readFileSync(path.join(__dirname, '../../js/cm-full-name.js'), 'utf8')}`, ctx);
    const page = ctx.window.cmFullName && ctx.window.cmFullName.certName;
    const { certName } = await import(pathToFileURL(path.join(__dirname, '../../worker-cert-name.js')).href);
    R.check(typeof page === 'function', 'js/cm-full-name.js should give window.cmFullName.certName');
    for (const [full, first, last] of [['John A. Doe Jr.', 'John', 'Doe'], ['Maria L. Santos', 'Maria', 'Santos'], ['Ana de la Cruz', 'Ana', 'Cruz'], ['Li Wei', 'Wei', 'Li'], ['Pat', 'Pat', '']]) {
        for (const fmt of ['lastFirst', 'firstLast']) if (page && page(full, first, last, fmt) !== certName(full, first, last, fmt)) R.check(false, `certName(${full}, ${fmt}): page ${page(full, first, last, fmt)} vs Worker ${certName(full, first, last, fmt)}`);
    }

    R.done("full-name-cert: the Portal's full name is kept and cleared as it changes, and a trainee's own certificate record carries the name the certificate shows.");
})().catch((e) => { console.error(e); process.exit(1); });
