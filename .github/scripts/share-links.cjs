// @check node — 🔗 Shared report links (worker-share.js): a trainer's link reads with no sign-in, holds only the table's fields; expired, revoked and unknown links are 404; a trainee can't make or overwrite one; share: is never listed
// The 🏆 Rankings & Progress Report's public, read-only links (js/cm-rankings.js share, report.html), on the Worker:
//   1. /api/share/save (a trainer): a 32-hex token; /api/share/get with no Authorization answers its snapshot,
//      no-store and noindex; the snapshot keeps only the table's fields (an id, an email, a raw record sent along is dropped);
//   2. an unknown token, a malformed one, an expired link and a revoked link: 404;
//   3. a trainee's token: /api/share/save, /api/share/revoke and /api/share/list are 403, /api/storage/set of share:<token>
//      is refused (a new one and an existing one), and the stored link is unchanged; a trainer's plain storage/set of a
//      share: key is refused too (a link is written only through the whitelist);
//   4. /api/storage/list refuses the share: prefix, and a listing of everything leaves share: keys out;
//   5. Update snapshot keeps the token and the expiry; 7 / 30 / 90 / 0 days; 0 is no expiry; any other is a 400.
// Usage: node .github/scripts/share-links.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');
const { harness, reporter } = require('./worker-harness.cjs');
const { fail, check, done } = reporter();
(async () => {
    const h = await harness({ portalOnly: true });
    const worker = (await import(pathToFileURL(path.join(__dirname, '../../worker.js')).href)).default;
    const raw = async (p, body, token) => worker.fetch(new Request('http://x' + p, { method: 'POST', headers: Object.assign({ 'Content-Type': 'application/json' }, token ? { Authorization: 'Bearer ' + token } : {}), body: JSON.stringify(body) }), h.env, { waitUntil() { } });
    const row = (n) => ({ rank: String(n), name: `Trainee ${n}`, overall: '90%', result: 'PASS', strength: 'Good.', challenges: 'Some.', attrs: [{ label: 'Case Analysis & Problem Solving', stars: '★★★★★', secret: 'x' }],
        redflag: 'None.', endorsement: 'Highly Endorsed for Case Manager Roles.', tier: 'high', progress: 'Until Day 5', passed: 'Days passed 5/5',
        id: 'ann-lee--b090126', email: 'ann@example.com', dayProgress: { 11: { score: 90 } } });
    const snap = { title: 'TRAINEE RANKINGS & PROGRESS REPORT – B090126 – CM TRAINING', batch: 'B090126', date: 'November 20, 2026', rows: [row(1), row(2)], raw: { trainees: ['ann-lee--b090126'] }, by: 'someone' };

    // 1. made by a trainer, read with no sign-in
    const made = await h.api('/api/share/save', { snapshot: snap, days: 30 }, h.admin);
    const T = made.body && made.body.token;
    check(made.status === 200 && /^[a-f0-9]{32}$/.test(T || ''), `a trainer's share should give a 32-hex token: ${JSON.stringify(made)}`);
    const res = await raw('/api/share/get', { token: T });
    const got = await res.json().catch(() => null);
    check(res.status === 200 && got && got.snapshot && got.snapshot.rows.length === 2, `the link should read with no sign-in: ${res.status} ${JSON.stringify(got).slice(0, 200)}`);
    check(/no-store/.test(res.headers.get('Cache-Control') || ''), `served no-store: ${res.headers.get('Cache-Control')}`);
    check(/noindex/.test(res.headers.get('X-Robots-Tag') || ''), `served noindex: ${res.headers.get('X-Robots-Tag')}`);
    const ROW = ['rank', 'name', 'overall', 'result', 'strength', 'challenges', 'attrs', 'redflag', 'endorsement', 'tier', 'progress', 'passed'];
    const s = got && got.snapshot;
    if (s) {
        check(JSON.stringify(Object.keys(s)) === JSON.stringify(['title', 'batch', 'date', 'rows']), `the snapshot: only title, batch, date, rows: ${Object.keys(s)}`);
        check(s.rows.every(r => JSON.stringify(Object.keys(r)) === JSON.stringify(ROW)), `each row: only the table's fields: ${Object.keys(s.rows[0])}`);
        check(s.rows.every(r => r.attrs.every(a => JSON.stringify(Object.keys(a)) === JSON.stringify(['label', 'stars']))), `each attribute: only label and stars: ${JSON.stringify(s.rows[0].attrs)}`);
    }
    const stored = JSON.stringify(h.raw('share:' + T));
    ['ann-lee--b090126', 'ann@example.com', 'dayProgress', 'secret', 'someone'].forEach(x => check(!stored.includes(x) && !JSON.stringify(got).includes(x), `"${x}" should be neither stored nor served`));
    check(!('by' in (got || {})), 'the public answer should not say who made the link');

    // 2. 404s
    for (const [why, t] of [['unknown', 'f'.repeat(32)], ['malformed', '../trainee:x'], ['empty', '']]) {
        const r = await raw('/api/share/get', { token: t }); check(r.status === 404, `${why} token: 404, got ${r.status}`);
    }
    h.rawPut('share:' + 'a'.repeat(32), { v: 1, createdAt: '2026-01-01T00:00:00Z', expiresAt: '2026-01-08T00:00:00Z', revoked: false, snapshot: snap });
    check((await raw('/api/share/get', { token: 'a'.repeat(32) })).status === 404, 'an expired link: 404');
    const second = (await h.api('/api/share/save', { snapshot: snap, days: 7 }, h.admin)).body.token;
    check((await h.api('/api/share/revoke', { token: second }, h.admin)).status === 200, 'a trainer revokes a link');
    check((await raw('/api/share/get', { token: second })).status === 404, 'a revoked link: 404');
    check((await h.api('/api/share/save', { snapshot: snap, token: second }, h.admin)).status === 404, 'a revoked link cannot be brought back by Update snapshot');

    // 3. a trainee
    const t = await h.portal('Tia', 'Nee', 'B090126'); const tt = t.body && t.body.token;
    check(!!tt, `a trainee token for the test: ${JSON.stringify(t.body).slice(0, 120)}`);
    const before = JSON.stringify(h.raw('share:' + T));
    check((await h.api('/api/share/save', { snapshot: snap }, tt)).status === 403, 'a trainee cannot make a link');
    check((await h.api('/api/share/save', { snapshot: snap, token: T }, tt)).status === 403, 'a trainee cannot update a link');
    check((await h.api('/api/share/revoke', { token: T }, tt)).status === 403, 'a trainee cannot revoke a link');
    check((await h.api('/api/share/list', {}, tt)).status === 403, 'a trainee cannot list the links');
    const ow = await h.set('share:' + T, { snapshot: { title: 'hacked', rows: [] }, expiresAt: null }, tt);
    check(ow.status === 403, `a trainee cannot overwrite share:<token> with storage/set: ${ow.status}`);
    const nw = await h.set('share:' + 'b'.repeat(32), { snapshot: snap, expiresAt: null }, tt);
    check(nw.status === 403 && !h.has('share:' + 'b'.repeat(32)), `a trainee cannot write a new share: key: ${nw.status}`);
    check(JSON.stringify(h.raw('share:' + T)) === before, 'the link is unchanged after the trainee tried');
    const tg = await h.api('/api/storage/get', { key: 'share:' + T }, tt);
    check(tg.status === 403, `a trainee cannot read share: through storage/get: ${tg.status}`);
    const as = await h.set('share:' + 'c'.repeat(32), { snapshot: snap }, h.admin);
    check(as.status === 403 && !h.has('share:' + 'c'.repeat(32)), `a plain storage/set of a share: key is refused to a trainer too: ${as.status}`);
    check((await h.api('/api/share/get', { token: T })).status === 200, 'no sign-in needed to read (no Authorization)');

    // 4. never listed
    const lp = await h.api('/api/storage/list', { prefix: 'share:' }, h.admin);
    check(lp.status === 403, `listing share: is refused: ${lp.status} ${JSON.stringify(lp.body)}`);
    const la = await h.api('/api/storage/list', { prefix: '' }, h.admin);
    check(la.status === 200 && Array.isArray(la.body.keys) && la.body.keys.length > 0 && !la.body.keys.some(k => /^share:/.test(k)), `a listing of everything leaves share: out: ${JSON.stringify(la.body).slice(0, 200)}`);
    check(JSON.stringify((await h.api('/api/storage/list', { prefix: 'sh' }, h.admin)).body.keys || []).indexOf('share:') < 0, 'a listing of "sh" leaves share: out');
    const ll = await h.api('/api/share/list', {}, h.admin);
    check(ll.status === 200 && ll.body.links.some(x => x.token === T && x.live) && ll.body.links.every(x => !('snapshot' in x)), `a trainer's own list of links (no snapshots): ${JSON.stringify(ll.body).slice(0, 200)}`);

    // 5. update keeps the token and the expiry; the expiry choices
    const exp = h.raw('share:' + T).expiresAt;
    const up = await h.api('/api/share/save', { snapshot: Object.assign({}, snap, { rows: [row(1)] }), token: T }, h.admin);
    check(up.status === 200 && up.body.token === T && h.raw('share:' + T).expiresAt === exp && h.raw('share:' + T).snapshot.rows.length === 1, `Update snapshot keeps the URL and expiry: ${JSON.stringify(up.body)}`);
    const d30 = Date.parse(exp) - Date.now(); check(d30 > 29.9 * 864e5 && d30 <= 30 * 864e5, `30 days: ${exp}`);
    const never = await h.api('/api/share/save', { snapshot: snap, days: 0 }, h.admin);
    check(never.status === 200 && never.body.expiresAt === null && (await raw('/api/share/get', { token: never.body.token })).status === 200, `0 days: no expiry: ${JSON.stringify(never.body)}`);
    check((await h.api('/api/share/save', { snapshot: snap, days: 365 }, h.admin)).status === 400, '365 days is not a choice');
    check((await h.api('/api/share/save', { snapshot: { rows: [] } }, h.admin)).status === 400, 'an empty table is not shared');
    done('Shared report links: read with no sign-in (no-store, noindex), only the table\'s fields; expired, revoked and unknown links 404; a trainee can\'t make, change or read one; share: never listed.');
})().catch(e => { console.error(e); fail(String(e)); process.exit(1); });
