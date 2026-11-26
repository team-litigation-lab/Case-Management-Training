// @check node — 👥 a merge finishes by itself: once its redirect has settled, the Worker's hourly run removes the other account (the trainer's page usually does it first), only while the merge still keeps the same account
// worker-account-repair.js finishPendingMerges, called from worker.js scheduled(). The owner: "When we merge automatically
// remove … the trainee itself in the incorrect account." A confirmed merge leaves the other account's keys until its
// redirect is SETTLE_MS old (a save elsewhere may not be visible yet); then:
//   1. an hourly run before that leaves them (the redirect is too new);
//   2. an hourly run after it deletes trainee:<other> and the rest of its copied keys, keeps the kept account and its work,
//      and the score tables have one account;
//   3. a merge whose kept account is gone is left for a trainer (nothing deleted).
// Usage: node .github/scripts/account-merge-finish.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');
const { harness, reporter } = require('./worker-harness.cjs');
const R = reporter();
(async () => {
    const worker = (await import(pathToFileURL(path.join(__dirname, '../../worker.js')).href)).default;
    const h = await harness({ portalOnly: true });
    const merge = (body) => h.api('/api/account-merge', body, h.admin);
    const hourly = () => worker.scheduled({ cron: '0 * * * *', scheduledTime: Date.now() }, h.env, { waitUntil() {} });

    // the same trainee in two batches: the older account (B111226) and the one her Portal profile opens now (B092526)
    const old = (await h.portal('Alexa', 'Robletto', 'B111226')).body.id;
    const cur = (await h.portal('Alexa', 'Robletto', 'B092526')).body.id;
    R.check(old && cur && old !== cur, `two accounts: ${old} ${cur}`);
    const recCur = await h.get('trainee:' + cur);
    await h.set('trainee:' + cur, Object.assign(recCur, { dayProgress: { 11: { score: 90, done: true, date: new Date().toISOString(), history: [{ score: 90, passed: true, date: new Date().toISOString() }] } } }));

    const dry = await merge({ ids: [cur, old] });
    R.check(dry.status === 200 && dry.body.keep === cur, `the dry run keeps the account her Portal opens now: ${JSON.stringify(dry.body && dry.body.keep)}`);
    const done = await merge({ ids: [cur, old], confirm: true, expectKeep: dry.body.keep, expectDelete: dry.body.keys.delete, expectKc: dry.body.expectKc });
    R.check(done.status === 200 && done.body.ok && done.body.pendingDelete.length > 0, `the first run leaves the other account's keys for now: ${JSON.stringify(done.body && done.body.pendingDelete)}`);
    R.check(h.has('trainee:' + old), 'trainee:<other> is still there after the first run');

    // 1. too soon: the hourly run leaves it
    await hourly();
    R.check(h.has('trainee:' + old), 'an hourly run before the redirect has settled leaves the other account');

    // 2. settled: the hourly run finishes the merge
    h.rawPut('merged:' + old, Object.assign(h.raw('merged:' + old), { at: new Date(Date.now() - 3 * 60000).toISOString() }));
    await hourly();
    R.check(!h.has('trainee:' + old), 'once the redirect has settled, the hourly run removes the other account');
    R.check(h.has('trainee:' + cur) && (h.raw('trainee:' + cur).dayProgress || {})[11], 'the kept account and its work stay');
    R.check((h.raw('merged:' + old) || {}).into === cur, 'the old sign-in still leads to the kept account');
    R.check(h.ids('backup:' + old).length > 0, 'the other account was backed up before anything was deleted');

    // 3. a merge whose kept account is gone (removed by a trainer since) is left alone: nothing of the other is deleted
    const a = (await h.portal('Ben', 'Two', 'B111226')).body.id;
    const b = (await h.portal('Ben', 'Two', 'B092526')).body.id;
    const d2 = await merge({ ids: [b, a] });
    await merge({ ids: [b, a], confirm: true, expectKeep: d2.body.keep, expectDelete: d2.body.keys.delete, expectKc: d2.body.expectKc });
    const kept = d2.body.keep, other = kept === b ? a : b;
    h.rawPut('merged:' + other, Object.assign(h.raw('merged:' + other), { at: new Date(Date.now() - 3 * 60000).toISOString() }));
    h.store.delete('cm:trainee:' + kept);
    await hourly();
    R.check(h.has('trainee:' + other), 'a merge whose kept account is gone deletes nothing of the other account');

    R.done('👥 A merge finishes by itself: the hourly run removes the other account once its redirect has settled, keeps the kept account and its backup, and leaves a merge whose kept account is gone for a trainer.');
})().catch((e) => { console.log('account-merge-finish failed: ' + (e && e.stack || e)); process.exit(1); });
