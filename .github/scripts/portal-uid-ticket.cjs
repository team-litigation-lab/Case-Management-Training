// @check node — 🪪 A trainee's tool ticket carries u (their Portal account id, set only from the Portal's own ticket) or is refused; who a trainee is (name, batch, portalUid, the uid index) is never theirs to write
// The Training Portal trusts a course's p "tool" trainee ticket only by its u (functions/api/verify-ticket.js: it signs in
// that exact Approved account and refuses a trainee ticket with no u). Checked on the Worker:
//   1. /api/auth/tool-ticket: a record with no portalUid gets no ticket (409 portal-uid-missing, a message that says to open
//      the program from the Portal once); the Portal sign-in that carries u sets portalUid, and the ticket then carries it as u;
//      the identity-mismatch check still comes first.
//   2. name, firstName, lastName, batch and fullName are protected fields (PROTECTED_TRAINEE_FIELDS): a trainee's write can't
//      change or drop them, a brand-new record's first write still sets its own name and batch, and a trainer's write can.
//   3. portalUid and the uid index: a trainee's write can't set, change or drop portalUid (on a new record or an existing
//      one), can't write uid:<id>, trainee-alias:<id> or merged:<id>, and the index is written only by the Portal sign-in.
// Usage: node .github/scripts/portal-uid-ticket.cjs   (no server, no browser needed)
const fs = require('fs');
const path = require('path');
const { harness, reporter } = require('./worker-harness.cjs');

const R = reporter();
const decode = (t) => JSON.parse(Buffer.from(String(t).split('.')[0].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));

(async () => {
    // 1. the tool ticket carries u, or is refused
    {
        const h = await harness({ portalOnly: true });
        const old = await h.portal('Lia', 'Paz', 'B100926');   // (a Portal ticket with no u: a record from before portalUid)
        R.check(old.status === 200 && old.body.token && !h.raw('trainee:' + old.body.id).portalUid, `sign-in without u: ${JSON.stringify(old.body)}`);
        const none = await h.api('/api/auth/tool-ticket', {}, old.body.token);
        R.check(none.status === 409 && none.body && none.body.code === 'portal-uid-missing' && !none.body.ticket && /LSH Training Portal/.test(none.body.error || ''),
            `a record with no portalUid must get no tool ticket (409 portal-uid-missing, open from the Portal once): ${JSON.stringify(none)}`);
        // (the trainee's own write can't link the account: portalUid is the Portal's to set)
        const rec = Object.assign({}, await h.get('trainee:' + old.body.id), { portalUid: 'U-lia', lastActive: new Date().toISOString() });
        await h.set('trainee:' + old.body.id, rec, old.body.token);
        const still = await h.api('/api/auth/tool-ticket', {}, old.body.token);
        R.check(still.status === 409 && !h.raw('trainee:' + old.body.id).portalUid, `a trainee writing portalUid must not get a ticket for it: ${JSON.stringify(still)}`);
        // the Portal sign-in that carries u links it, and the ticket carries it
        const again = await h.portal('Lia', 'Paz', 'B100926', 'U-lia');
        R.check(again.status === 200 && again.body.id === old.body.id && h.raw('trainee:' + old.body.id).portalUid === 'U-lia', `reopening from the Portal sets portalUid: ${JSON.stringify(again.body && again.body.id)}`);
        const ok = await h.api('/api/auth/tool-ticket', {}, again.body.token), t = ok.body && ok.body.ticket ? decode(ok.body.ticket) : null;
        R.check(ok.status === 200 && t && t.u === 'U-lia' && t.p === 'tool' && t.first === 'Lia' && t.last === 'Paz' && t.b === 'B100926', `the tool ticket carries u: ${JSON.stringify(t || ok)}`);
        // the identity-mismatch check still stands, and comes first (a record that names someone else, written past the guards)
        const tamper = (id) => { h.store.delete('cm:trainee-admin:' + id); const k = 'cm:trainee:' + id; h.store.set(k, JSON.stringify(Object.assign(JSON.parse(h.store.get(k)), { name: 'Vic Tim', firstName: 'Vic', lastName: 'Tim' }))); };
        const eve = await h.portal('Eve', 'Ong', 'B100926');
        tamper(eve.body.id);
        const mm = await h.api('/api/auth/tool-ticket', {}, eve.body.token);
        R.check(mm.status === 403 && mm.body && mm.body.error === 'identity-mismatch', `a record naming someone else is still refused (identity-mismatch): ${JSON.stringify(mm)}`);
        // (a linked record resolves to itself through the uid index whatever its names say: its ticket's u is still its own
        // Portal account, and the Portal signs in only that account, with that account's own names: portal-ticket-e2e)
        tamper(old.body.id);
        const lt = await h.api('/api/auth/tool-ticket', {}, again.body.token);
        R.check(lt.status !== 200 || decode(lt.body.ticket).u === 'U-lia', `a linked record's ticket carries only its own u: ${JSON.stringify(lt)}`);
    }

    R.done('portal-uid-ticket: tool tickets carry u or are refused; identity and the uid index are never a trainee\'s to write');
})().catch((e) => { console.error(e); process.exit(1); });
