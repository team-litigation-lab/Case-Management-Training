// @check node — 🎟 A Portal ticket the TicketLedger approved is still refused when a later use of it finds the ledger unreachable (the KV fallback knows of it): a system (r:"s"), admin or trainee ticket can't be replayed through a partial outage
// worker.js useTicketOnce: the ledger (a Durable Object per ticket) decides each use; when it can't be reached the KV mark
// sso-used:<sig> is the fallback. A use the ledger approved writes that mark too, so the fallback can refuse a replay.
//   1. four uses of one system ticket at once: exactly one signs in (the ledger is atomic);
//   2. for a system, an admin and a trainee ticket: the first use goes through the ledger (200), the replay finds the
//      ledger unreachable and is refused 401 "used", with no token;
//   3. the KV mark lives at least as long as a ticket can (TICKET_NONCE_TTL_S > the ticket's 10 minutes).
// Usage: node .github/scripts/ticket-ledger-fallback.cjs   (no server, no browser needed)
const path = require('path');
const { pathToFileURL } = require('url');
const { harness, reporter, ticketFor } = require('./worker-harness.cjs');
const R = reporter();
(async () => {
    const { TicketLedger } = await import(pathToFileURL(path.join(__dirname, '../../worker.js')).href);
    const inst = new Map(); let down = 0;
    const mk = () => {
        const data = new Map(); let chain = Promise.resolve();
        const state = { storage: { get: async (k) => data.get(k), put: async (k, v) => data.set(k, v), setAlarm: async () => { }, deleteAll: async () => data.clear() },
            blockConcurrencyWhile: (fn) => { const run = chain.then(fn); chain = run.catch(() => { }); return run; } };
        return new TicketLedger(state, {});
    };
    const TICKET_LEDGER = { idFromName: (n) => n, get: (id) => ({ fetch: async (u, o) => { if (down > 0) { down--; throw new Error('ledger unreachable (test)'); } if (!inst.has(id)) inst.set(id, mk()); return inst.get(id).fetch(new Request(u, o)); } }) };
    const h = await harness({ portalOnly: true });
    h.env.TICKET_LEDGER = TICKET_LEDGER;
    const ttls = [];
    const put = h.env.LSH_KV.put; h.env.LSH_KV.put = async (k, v, o) => { if (/^cm:sso-used:/.test(k)) ttls.push(o && o.expirationTtl); return put(k, v, o); };

    // 1. the ledger is atomic
    const sys = await ticketFor({ r: 's', exp: Date.now() + 60000 });
    const race = await Promise.all([1, 2, 3, 4].map(() => h.api('/api/auth/portal', { ticket: sys })));
    R.check(race.filter((r) => r.status === 200).length === 1, `four uses of one system ticket at once should sign in once: ${race.map((r) => r.status)}`);

    // 2. approved by the ledger, then replayed while it is unreachable
    const kinds = [
        ['system', { r: 's' }],
        ['admin', { r: 'a', n: 'Coach Ana' }],
        ['trainee', { first: 'Rae', last: 'Play', b: 'B100926' }]
    ];
    for (const [kind, payload] of kinds) {
        const tk = await ticketFor(Object.assign({ exp: Date.now() + 60000 }, payload));
        const first = await h.api('/api/auth/portal', { ticket: tk });
        R.check(first.status === 200 && first.body && first.body.token, `the ${kind} ticket's first use should sign in: ${JSON.stringify(first)}`);
        down = 1;
        const replay = await h.api('/api/auth/portal', { ticket: tk });
        R.check(down === 0, `the replay of the ${kind} ticket should have tried the ledger`);
        down = 0;
        R.check(replay.status === 401 && replay.body && replay.body.code === 'used' && !replay.body.token,
            `a replay of the ${kind} ticket while the ledger is unreachable should be refused (401 used): ${JSON.stringify(replay)}`);
    }

    // 3. the mark outlives the ticket
    R.check(ttls.length >= 3 && ttls.every((t) => typeof t === 'number' && t >= 600), `each KV mark should live at least the ticket's 10 minutes: ${JSON.stringify(ttls)}`);

    R.done('ticket-ledger-fallback: a ticket the ledger approved is refused when its replay falls back to KV (system, admin and trainee).');
})().catch((e) => { console.error(e); process.exit(1); });
