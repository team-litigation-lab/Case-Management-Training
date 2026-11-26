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

    // 2. who the trainee is: protected fields, set by a brand-new record's first write, then a trainer's only
    {
        const src = fs.readFileSync(path.join(__dirname, '../../worker.js'), 'utf8');
        const line = (src.match(/^const PROTECTED_TRAINEE_FIELDS = (\[.*\]);$/m) || [])[1];
        const prot = line ? JSON.parse(line) : [];
        for (const f of ['name', 'firstName', 'lastName', 'batch', 'fullName', 'portalUid']) R.check(prot.includes(f), `PROTECTED_TRAINEE_FIELDS must hold ${f}: ${line}`);
        const h = await harness();   // (no single sign-on: a trainee's session can start before their record exists)
        const s = await h.api('/api/auth/trainee', { name: 'Rey Sol', batch: 'B100926' });
        R.check(s.status === 200 && s.body.token && !s.body.existing, `a new trainee's session: ${JSON.stringify(s.body)}`);
        const id = s.body.id;
        await h.set('trainee:' + id, { id, name: 'Rey Sol', firstName: 'Rey', lastName: 'Sol', batch: 'B100926', fullName: 'Rey A. Sol', approved: true, portalUid: 'U-forged' }, s.body.token);
        const first = h.raw('trainee:' + id) || {};
        R.check(first.name === 'Rey Sol' && first.firstName === 'Rey' && first.lastName === 'Sol' && first.batch === 'B100926' && first.fullName === 'Rey A. Sol', `a brand-new record's first write sets its own name and batch: ${JSON.stringify(first)}`);
        R.check(first.approved === false && !('portalUid' in first), `…but never approval or a Portal id: ${JSON.stringify(first)}`);
        await h.set('trainee:' + id, Object.assign({}, first, { name: 'Vic Tim', firstName: 'Vic', lastName: 'Tim', batch: 'B010126', fullName: 'Vic Tim' }), s.body.token);
        const kept = h.raw('trainee:' + id) || {};
        R.check(kept.name === 'Rey Sol' && kept.firstName === 'Rey' && kept.lastName === 'Sol' && kept.batch === 'B100926' && kept.fullName === 'Rey A. Sol', `a trainee's later write can't change who they are: ${JSON.stringify(kept)}`);
        const dropped = Object.assign({}, kept); ['name', 'firstName', 'lastName', 'batch', 'fullName'].forEach((f) => delete dropped[f]);
        await h.set('trainee:' + id, dropped, s.body.token);
        const still = h.raw('trainee:' + id) || {};
        R.check(still.name === 'Rey Sol' && still.batch === 'B100926' && still.fullName === 'Rey A. Sol', `…or drop it: ${JSON.stringify(still)}`);
        // a trainer's write still can
        const w = await h.set('trainee:' + id, Object.assign({}, await h.get('trainee:' + id), { name: 'Rey Solis', lastName: 'Solis', fullName: 'Rey A. Solis' }));
        const fixed = await h.get('trainee:' + id);
        R.check(w.status === 200 && fixed.name === 'Rey Solis' && fixed.lastName === 'Solis' && fixed.fullName === 'Rey A. Solis', `a trainer's write still corrects the name: ${JSON.stringify(fixed)}`);
        await h.set('trainee:' + id, Object.assign({}, fixed, { name: 'Rey Sol', lastName: 'Sol' }), s.body.token);
        R.check((await h.get('trainee:' + id)).lastName === 'Solis', 'the trainer\'s correction stands against the trainee\'s next write');
    }

    // 3. portalUid and the uid index are the Portal's to set, never a trainee's
    {
        const h = await harness({ portalOnly: true });
        const me = await h.portal('Kim', 'Ray', 'B100926', 'U-kim');
        const id = me.body.id, tok = me.body.token;
        const idx = JSON.stringify(h.raw('uid:U-kim'));
        R.check(h.raw('trainee:' + id).portalUid === 'U-kim' && (h.raw('uid:U-kim') || {}).id === id, `the Portal sign-in sets portalUid and the uid index: ${idx}`);
        const victim = await h.portal('Vic', 'Tim', 'B100926', 'U-vic');
        const vidx = JSON.stringify(h.raw('uid:U-vic'));
        // the record's own portalUid can't be changed or dropped by the trainee's write
        const rec = await h.get('trainee:' + id);
        await h.set('trainee:' + id, Object.assign({}, rec, { portalUid: 'U-vic' }), tok);
        R.check(h.raw('trainee:' + id).portalUid === 'U-kim', `a trainee's write can't change portalUid: ${h.raw('trainee:' + id).portalUid}`);
        const noUid = Object.assign({}, rec); delete noUid.portalUid;
        await h.set('trainee:' + id, noUid, tok);
        R.check(h.raw('trainee:' + id).portalUid === 'U-kim' && (await h.get('trainee:' + id)).portalUid === 'U-kim', 'a trainee\'s write can\'t drop portalUid');
        // nor write the index, an alias, a merge redirect or the trainer's own copy of the record
        for (const [key, v] of [['uid:U-vic', { id, name: 'Vic Tim', batch: 'B100926' }], ['uid:U-kim', { id: victim.body.id }], ['uid:U-new', { id }],
            ['trainee-alias:' + victim.body.id, id], ['merged:' + victim.body.id, { into: id }], ['merged:' + id, { into: victim.body.id }], ['trainee-admin:' + id, { portalUid: 'U-vic' }]]) {
            const w = await h.api('/api/storage/set', { key, value: JSON.stringify(v) }, tok);
            R.check(w.status === 403, `a trainee must not write ${key}: ${JSON.stringify(w)}`);
        }
        R.check(JSON.stringify(h.raw('uid:U-kim')) === idx && JSON.stringify(h.raw('uid:U-vic')) === vidx && !h.has('uid:U-new') && !h.has('trainee-alias:' + victim.body.id) && !h.has('merged:' + victim.body.id) && !h.has('merged:' + id),
            'the uid index, aliases and merge redirects are as the Portal sign-ins left them');
        R.check(h.raw('trainee-admin:' + id).portalUid === 'U-kim', 'the trainer\'s own copy keeps the Portal id');
        // the tool ticket still names only this trainee's Portal account
        const t = await h.api('/api/auth/tool-ticket', {}, tok);
        R.check(t.status === 200 && decode(t.body.ticket).u === 'U-kim', `the tool ticket's u is the Portal-set one: ${JSON.stringify(t)}`);
        // a brand-new record's first write can't bring a Portal id with it (no single sign-on: the session starts first)
        const o = await harness();
        const s = await o.api('/api/auth/trainee', { name: 'New Bie', batch: 'B100926' });
        await o.set('trainee:' + s.body.id, { id: s.body.id, name: 'New Bie', firstName: 'New', lastName: 'Bie', batch: 'B100926', portalUid: 'U-vic' }, s.body.token);
        R.check(!('portalUid' in (o.raw('trainee:' + s.body.id) || {})) && !o.ids('uid:').length, `a first write can't set portalUid or the index: ${JSON.stringify(o.raw('trainee:' + s.body.id))}`);
    }

    R.done('portal-uid-ticket: tool tickets carry u or are refused; identity and the uid index are never a trainee\'s to write');
})().catch((e) => { console.error(e); process.exit(1); });
