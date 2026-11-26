// @check node — 👥 A merge stays whole after it: the restored snapshot holds the merged lists and best practice scores, an open page saves before it restores, a trainer's stale copy keeps the merge, the Case Flow summary can't outscore the record, and no merge or snapshot outgrows a save
// worker-account-repair.js, worker-identity.js and js/cm-safe-logout.js, in Node (the Worker's own routes, and the page
// script with its globals stubbed):
//   1. progress:<keep> holds the merged record's practice-progress (the best score of either account), completed-lab-
//      actions, submissions and roleplayHistory, so a device that restores it and syncs its record loses none of them;
//      a stale device's trainee save keeps the best practice score too;
//   2. a merge where no account had a progress snapshot still writes progress:<keep> with mergedAt (a device records the
//      merge it restored by it), and a device's save naming it is then written as it is;
//   3. before merged:<keep> is deleted or any merged:<other> written, backup:<keep>:<ts>:redirects holds them as they were
//      (an existing merged:<other> included), and a merge that stops puts that merged:<other> back;
//   4. a trainee's caseFlow.days[n].kc / passed never outscore the record's dayProgress (the Worker sets them), and the
//      Scorecard counts the record's attempts over the summary;
//   5. a day's first attempt on a trainee's write is dated by the Worker; an official attempt dated before its record's
//      registration is never the merge's official score;
//   6. a trainer's whole-record write from a copy read before the merge keeps mergedAt and the merge's joined lists;
//   7. a merge whose merged snapshot would be over the save limit is refused (dry run: tooLarge), nothing written;
//   8. a page open through a merge ({mergePending}) saves its own work before it restores, and restores nothing when
//      that save fails (its work backed up instead).
// Usage: node .github/scripts/merge-whole.cjs   (no server, no browser needed)
const vm = require('vm'), fs = require('fs'), path = require('path');
const { harness, reporter } = require('./worker-harness.cjs');
const { picksFor } = require('./kc-picks.cjs');   // (the Worker scores an attempt from its own picks, as the page sends them)
const R = reporter();
const T = (d, h = 10) => `2026-09-${String(d).padStart(2, '0')}T${String(h).padStart(2, '0')}:00:00.000Z`;
(async () => {
    const h = await harness({ portalOnly: true });
    const merge = (body) => h.api('/api/account-merge', body, h.admin);
    const preview = (body) => merge(Object.assign({}, body, { confirm: false }));
    const confirmed = async (body) => { const d = await preview(body); return { dry: d, done: await merge(Object.assign({}, body, { confirm: true, expectKeep: d.body && d.body.keep, expectDelete: d.body && d.body.keys && d.body.keys.delete, expectKc: d.body && d.body.expectKc })) }; };

    // ---------- 1. the snapshot carries the merged record's lists and best practice scores ----------
    const a = await h.portal('Pia', 'Whole', 'B090126'), A = a.body.id;
    const b = await h.portal('Piaa', 'Whole', 'B090126', 'U-pia'), B = b.body.id;   // (B carries the uid: kept)
    const ra = await h.get('trainee:' + A), rb = await h.get('trainee:' + B);
    Object.assign(rb, { registeredAt: T(1, 0), lastActive: T(5), practiceProgress: { X: { bestScore: 60, runs: 1 } }, submissions: [{ id: 's-b' }], completedLabActions: { 'lab-b': true } });
    Object.assign(ra, { registeredAt: T(1, 0), lastActive: T(4), practiceProgress: { X: { bestScore: 90, runs: 3 } }, submissions: [{ id: 's-a' }], roleplayHistory: [{ id: 'r-a' }], completedLabActions: { 'lab-a': true } });
    await h.set('trainee:' + A, ra); await h.set('trainee:' + B, rb);
    await h.set('progress:' + B, { traineeId: B, savedAt: T(5), data: { 'practice-progress': { X: { bestScore: 60, runs: 1 } }, submissions: [{ id: 's-b' }, { id: 's-b2' }], notes: 'B' } });
    await h.set('progress:' + A, { traineeId: A, savedAt: T(4), data: { notes: 'A' } });   // (A's snapshot lacks its lists)
    const m1 = await confirmed({ ids: [A, B] });
    R.check(m1.done.status === 200 && m1.done.body.keep === B, `the merge should keep ${B}: ${JSON.stringify(m1.done.body && (m1.done.body.error || m1.done.body.keep))}`);
    const pk = h.raw('progress:' + B), tk = h.raw('trainee:' + B), d1 = (pk && pk.data) || {};
    R.check(tk.practiceProgress.X.bestScore === 90 && d1['practice-progress'] && d1['practice-progress'].X.bestScore === 90, `the snapshot should hold the merged best practice score (90): ${JSON.stringify(d1['practice-progress'])}`);
    const ids = (l) => (Array.isArray(l) ? l : []).map((x) => x.id).sort().join(',');
    R.check(ids(d1.submissions) === 's-a,s-b,s-b2' && ids(d1.roleplayHistory) === 'r-a', `the snapshot should hold every account's submissions and roleplays: ${ids(d1.submissions)} / ${ids(d1.roleplayHistory)}`);
    R.check(d1['completed-lab-actions'] && d1['completed-lab-actions']['lab-a'] && d1['completed-lab-actions']['lab-b'], `the snapshot should hold both accounts' lab actions: ${JSON.stringify(d1['completed-lab-actions'])}`);
    // (a device restoring it, then syncing its record as index.html syncToLedger does, from the snapshot's values)
    const restored = Object.assign({}, tk, { practiceProgress: d1['practice-progress'], submissions: d1.submissions, roleplayHistory: d1.roleplayHistory, completedLabActions: d1['completed-lab-actions'], mergeSeen: tk.mergedAt });
    const s1 = await h.set('trainee:' + B, restored, b.body.token);
    const t1 = h.raw('trainee:' + B);
    R.check(s1.status === 200 && t1.practiceProgress.X.bestScore === 90 && ids(t1.submissions) === 's-a,s-b,s-b2' && t1.completedLabActions['lab-a'], `the record synced from the restored snapshot should lose nothing: ${JSON.stringify({ pp: t1.practiceProgress, s: ids(t1.submissions) })}`);
    // a stale device (it never restored the merge): its lower practice score doesn't win the fold
    const stale = Object.assign({}, tk, { practiceProgress: { X: { bestScore: 60, runs: 1 } } }); delete stale.mergedAt;
    await h.set('trainee:' + B, stale, b.body.token);
    R.check(h.raw('trainee:' + B).practiceProgress.X.bestScore === 90, `a stale device's save should keep the merged best practice score: ${JSON.stringify(h.raw('trainee:' + B).practiceProgress)}`);

    // ---------- 6. a trainer's whole-record write from a copy read before the merge ----------
    const pre = Object.assign({}, rb, { approved: true, submissions: [{ id: 's-b' }] }); delete pre.mergedAt;
    await h.set('trainee:' + B, pre);
    const t6 = await h.get('trainee:' + B);
    R.check(t6.mergedAt === tk.mergedAt && t6.approved === true, `a trainer's stale copy should keep the merge's mergedAt: ${JSON.stringify({ m: t6.mergedAt, want: tk.mergedAt })}`);
    R.check(ids(t6.submissions).includes('s-a') && t6.practiceProgress.X.bestScore === 90, `a trainer's stale copy should keep what the merge joined: ${ids(t6.submissions)} ${JSON.stringify(t6.practiceProgress)}`);
    const cur = Object.assign({}, t6, { submissions: [{ id: 'only' }] });
    await h.set('trainee:' + B, cur);
    R.check(ids((await h.get('trainee:' + B)).submissions) === 'only', 'a trainer\'s copy that names the merge is written as it is');

    // ---------- 2. no account had a progress snapshot ----------
    const c = await h.portal('Quin', 'Nosnap', 'B090126'), C = c.body.id;
    const d = await h.portal('Quinn', 'Nosnap', 'B090126', 'U-quin'), Dd = d.body.id;
    for (const [id, s] of [[C, 'q-c'], [Dd, 'q-d']]) { const r = await h.get('trainee:' + id); r.registeredAt = T(1, 0); r.submissions = [{ id: s }]; await h.set('trainee:' + id, r); }
    R.check(!h.has('progress:' + C) && !h.has('progress:' + Dd), 'the test needs two accounts without a snapshot');
    const m2 = await confirmed({ ids: [C, Dd] });
    const p2 = h.raw('progress:' + Dd), t2 = h.raw('trainee:' + Dd);
    R.check(m2.done.status === 200 && p2 && p2.mergedAt && p2.mergedAt === t2.mergedAt && ids(p2.data && p2.data.submissions) === 'q-c,q-d', `a merge with no snapshot should still write progress:<keep> with mergedAt and the merged lists: ${JSON.stringify(p2)}`);
    const w2 = await h.set('progress:' + Dd, { traineeId: Dd, savedAt: new Date().toISOString(), mergedAt: p2.mergedAt, data: { notes: 'restored' } }, d.body.token);
    R.check(w2.status === 200 && !(w2.body && w2.body.mergePending), `a save that names that merge should not be folded: ${JSON.stringify(w2.body)}`);

    // ---------- 3. the redirects backed up before they change ----------
    const e = await h.portal('Rae', 'Redir', 'B090126'), E = e.body.id;
    const f = await h.portal('Raee', 'Redir', 'B090126', 'U-rae'), F = f.body.id;
    for (const id of [E, F]) { const r = await h.get('trainee:' + id); r.registeredAt = T(1, 0); await h.set('trainee:' + id, r); }
    h.rawPut('merged:' + E, { into: 'somewhere-old', at: T(1), by: 'old merge' });   // (a stale redirect on a live record)
    h.rawPut('merged:' + F, { into: 'nowhere-live', at: T(1), by: 'old merge' });
    const ops = [];
    const KV = h.env.LSH_KV, put0 = KV.put, del0 = KV.delete;
    KV.put = async (k, v, o) => { ops.push(['put', k.slice(3)]); return put0(k, v, o); };
    KV.delete = async (k) => { ops.push(['del', k.slice(3)]); return del0(k); };
    h.failPut = (k) => k.startsWith('cm:backup:' + E + ':') && !k.includes(':redirects');   // (stops after the redirects)
    const m3 = await confirmed({ ids: [E, F] });
    h.failPut = null;
    const rk = ops.find((x) => x[0] === 'put' && /^backup:.*:redirects$/.test(x[1]));
    const first = ops.findIndex((x) => (x[0] === 'del' && x[1] === 'merged:' + F) || (x[0] === 'put' && x[1] === 'merged:' + E));
    R.check(m3.done.status === 500 && rk && ops.indexOf(rk) < first, `the redirects backup should be written before any redirect changes: ${JSON.stringify(ops.slice(0, 6))}`);
    const bk = rk && h.raw(rk[1]);
    R.check(bk && bk.keys && bk.keys['merged:' + E] && bk.keys['merged:' + F], `the redirects backup should hold merged:<keep> and merged:<other> as they were: ${JSON.stringify(bk && bk.keys)}`);
    R.check(h.raw('merged:' + E) && h.raw('merged:' + E).into === 'somewhere-old' && h.raw('merged:' + F) && h.raw('merged:' + F).into === 'nowhere-live', `a merge that stopped should put merged:<other> back as it was: ${JSON.stringify([h.raw('merged:' + E), h.raw('merged:' + F)])}`);
    KV.put = put0; KV.delete = del0;

    // ---------- 4. the Case Flow summary is the record's ----------
    const g = await h.portal('Sol', 'Summary', 'B090126', 'U-sol'), G = g.body.id;
    await h.set('trainee:' + G, { id: G, dayProgress: { 13: { score: 50, done: false, history: [{ score: 50, passed: false, answers: picksFor(13, 50) }] } }, caseFlow: { at: T(2), days: { 3: { id: 13, kc: 50, passed: false } } } }, g.body.token);
    await h.set('trainee:' + G, Object.assign({}, h.raw('trainee:' + G), { caseFlow: { at: T(3), days: { 3: { id: 13, kc: 95, passed: true }, 4: { id: 14, kc: 99, passed: true } } } }), g.body.token);
    const cf = h.raw('trainee:' + G).caseFlow.days;
    R.check(cf[3].kc === 50 && cf[3].passed === false, `a device's summary should never outscore the record's attempt: ${JSON.stringify(cf[3])}`);
    R.check(cf[4].kc == null && cf[4].passed === false, `a summary score for a day with no attempt on the record should not be taken: ${JSON.stringify(cf[4])}`);
    const fd = h.raw('trainee:' + G).dayProgress[13];
    R.check(fd.date && Math.abs(Date.parse(fd.date) - Date.now()) < 60000 && fd.history[0].date === fd.date, `a day's first attempt should be dated by the Worker: ${JSON.stringify(fd)}`);
    // (the Scorecard: the record's attempts count over an old summary that disagrees)
    const win = { addEventListener() { } };
    const ctx = { window: win, DAYS: [{ id: 13, cf: { n: 3 } }], document: { addEventListener() { }, getElementById() { return null; }, querySelector() { return null; }, createElement: () => ({ appendChild() { } }), head: { appendChild() { } }, body: { appendChild() { } } }, console, setTimeout, clearTimeout, state: {} };
    vm.createContext(ctx);
    ctx.window = new Proxy(win, { get: (t, k) => k in t ? t[k] : ctx[k], set: (t, k, v) => { t[k] = v; return true; } });
    vm.runInContext(fs.readFileSync(path.join(__dirname, '../../js/cm-scorecard.js'), 'utf8'), ctx);
    const S = win.cmScorecard, sc = { rec: { dayProgress: { 13: { score: 50, done: false, history: [{ score: 50 }] } } }, cf: { days: { 3: { id: 13, kc: 95, passed: true } } }, data: {} };
    R.check(S.kcBest(sc.rec.dayProgress[13], sc.cf.days[3]) === 50 && !S.kcPassed(sc, ctx.DAYS[0]), 'the Scorecard should take the record\'s attempts over the summary');

    // ---------- 5. an official attempt dated before its record registered ----------
    const i = await h.portal('Ty', 'Dated', 'B090126'), I = i.body.id;
    const j = await h.portal('Tyy', 'Dated', 'B090126', 'U-ty'), J = j.body.id;
    const ri = await h.get('trainee:' + I), rj = await h.get('trainee:' + J);
    Object.assign(ri, { registeredAt: T(1, 0), dayProgress: { 11: { score: 100, done: true, date: '2000-01-01T00:00:00.000Z', history: [{ score: 100, passed: true, date: '2000-01-01T00:00:00.000Z' }] } } });
    Object.assign(rj, { registeredAt: T(1, 0), dayProgress: { 11: { score: 45, done: false, date: T(3), history: [{ score: 45, passed: false, date: T(3) }] } } });
    await h.set('trainee:' + I, ri); await h.set('trainee:' + J, rj);   // (a trainer's write: the way a record written before dateFirstAttempts might hold it)
    const dry5 = await preview({ ids: [I, J] });
    const row = ((dry5.body && dry5.body.days) || []).find((x) => String(x.day) === '11') || {};
    R.check(row.recovered && row.recovered.score === 45 && !row.recovered.done && /before the trainee registered/.test(row.note || ''), `an official attempt dated before its record registered should not be the official score: ${JSON.stringify(row)}`);

    // ---------- 7. a merged snapshot over the save limit ----------
    const k = await h.portal('Uma', 'Big', 'B090126'), K = k.body.id;
    const l = await h.portal('Umaa', 'Big', 'B090126', 'U-uma'), L = l.body.id;
    for (const id of [K, L]) { const r = await h.get('trainee:' + id); r.registeredAt = T(1, 0); await h.set('trainee:' + id, r); }
    h.rawPut('progress:' + K, { traineeId: K, savedAt: T(2), data: { notes: 'k'.repeat(1100000) } });
    h.rawPut('progress:' + L, { traineeId: L, savedAt: T(2), data: { 'case-flow': 'l'.repeat(1000000) } });
    const before = JSON.stringify([...h.store.entries()].filter(([x]) => !x.startsWith('cm:backup:')));
    const m7 = await confirmed({ ids: [K, L] });
    R.check(m7.dry.body && m7.dry.body.tooLarge === true && m7.done.status === 409 && /over/.test(m7.done.body.error || ''), `a merge whose snapshot would be over the limit should be refused: ${m7.done.status} ${JSON.stringify(m7.done.body && m7.done.body.error)}`);
    R.check(JSON.stringify([...h.store.entries()].filter(([x]) => !x.startsWith('cm:backup:'))) === before && h.has('trainee:' + K) && !h.raw('trainee:' + L).mergedAt, 'a refused merge writes nothing');

    // ---------- 8. a page open through a merge saves before it restores ----------
    const run = async (saveOk) => {
        const calls = [], ls = new Map(), store = { notes: ['open-page work'] };
        const st = { traineeId: 'me', traineeName: 'Me', isAdmin: false, lastCloudSig: 'x' };
        const page = {
            state: st, console, JSON, Date, Promise, Object, Array, String, Number, Math, Set, Map, setTimeout, clearTimeout,
            PERSONAL_KEYS: ['notes'],
            localStorage: { getItem: (x) => ls.has(x) ? ls.get(x) : null, setItem: (x, v) => ls.set(x, String(v)), removeItem: (x) => ls.delete(x), key: (n) => [...ls.keys()][n], get length() { return ls.size; } },
            storeGet: async (x) => store[x] === undefined ? null : store[x], storeSet: async (x, v) => { store[x] = v; },
            certHash: (t) => String(t.length), toast() { }, render() { }, loadAll: async () => { calls.push('loadAll'); },
            sharedGetStrict: async () => ({ mergedAt: 'M1', savedAt: T(9), data: { notes: ['merged'] } }),
            addEventListener() { }
        };
        page.window = page;
        page.logout = async () => { }; page.forceRevokedLogout = async () => { };
        page.authFetch = async (url, payload) => { calls.push('fetch:' + payload.key); return { ok: true, status: 200, clone() { return { json: async () => (payload.key.startsWith('orphan:') ? { ok: true } : { ok: true, mergePending: 'M1' }) }; } }; };
        page.sharedSet = async () => true;
        page.cloudRestore = async () => { calls.push('cloudRestore'); return true; };
        page.cloudSaveNow = async () => { calls.push('cloudSaveNow:' + st.lastCloudSig); if (saveOk) ls.set('lsh_progress-saved-at', T(8)); return saveOk; };
        vm.createContext(page);
        vm.runInContext(fs.readFileSync(path.join(__dirname, '../../js/cm-safe-logout.js'), 'utf8'), page);
        await page.authFetch('/api/storage/set', { key: 'trainee:me', value: '{}' });
        for (let n = 0; n < 50 && !calls.includes(saveOk ? 'loadAll' : 'fetch:orphan'); n++) await new Promise((r) => setTimeout(r, 10));
        await new Promise((r) => setTimeout(r, 30));
        return { calls, backups: page.cmSafeLogout.backups() };
    };
    const ok8 = await run(true);
    const iSave = ok8.calls.indexOf('cloudSaveNow:null'), iRestore = ok8.calls.indexOf('cloudRestore');
    R.check(iSave >= 0 && iRestore > iSave, `a page open through a merge should save its own work (a real write) before it restores: ${ok8.calls.join(' → ')}`);
    const bad8 = await run(false);
    R.check(!bad8.calls.includes('cloudRestore') && bad8.backups.some((x) => x.reason === 'before-merged-restore'), `when that save fails nothing is restored, and the work is backed up: ${bad8.calls.join(' → ')}`);

    R.done('👥 Merge stays whole: the restored snapshot holds the merged lists and best practice scores, an open page saves before it restores, a trainer\'s stale copy keeps the merge, the Case Flow summary is the record\'s, first attempts are Worker-dated, and no merge outgrows a save.');
})().catch((e) => { console.error(e); process.exit(1); });
