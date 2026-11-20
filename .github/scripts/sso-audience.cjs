// @check node — 🎯 A Portal ticket is for one program and works once: SSO_REQUIRE_AUDIENCE=1 refuses one with no p, the used-ticket mark outlives the ticket, this course's tool tickets (p "tool", each its own) never sign anyone in here, and the full registered name is the certificate's
// Platform QA 2026-11-19, CM finding 1 (sso.cjs holds the rollout's rules: another program's p refused, no p taken, each ticket once).
//   1. SSO_REQUIRE_AUDIENCE = "1" ends the rollout: a trainee's, a trainer's or the Sign-in check's ticket with no p is refused
//      (401 audience, nothing written); this program's own (p "CM TRAINING") still signs in, once.
//   2. The KV mark of a used ticket (sso-used:<sig>) lives at least as long as a ticket can (PORTAL_TICKET_MAX_MS, 10 minutes).
//   3. /api/auth/tool-ticket, for a trainee and for a trainer: p "tool" and a random j (two tickets are never one ticket),
//      and u (the trainee's Portal account id) when the record holds portalUid, which the Portal signs a trainee in by;
//      posted back to /api/auth/portal it is refused (401 audience), with or without SSO_REQUIRE_AUDIENCE.
//   4. The ticket's full name is kept as fullName (the ID unchanged), and the trainee's own write can't change or drop it.
//   5. js/cm-full-name.js: the certificate shows that full name, in the trainers' chosen order, for the trainee and a trainer.
// Usage: node .github/scripts/sso-audience.cjs
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const { harness, reporter, ticketFor } = require('./worker-harness.cjs');

const R = reporter();
const soon = () => Date.now() + 60000;
const decode = (t) => JSON.parse(Buffer.from(String(t).split('.')[0].replace(/-/g, '+').replace(/_/g, '/'), 'base64').toString('utf8'));

(async () => {
    // 1. no p, with SSO_REQUIRE_AUDIENCE = "1"
    {
        const h = await harness({ portalOnly: true });
        h.env.SSO_REQUIRE_AUDIENCE = '1';
        for (const [kind, t] of [['trainee', { first: 'Nia', last: 'Ross', b: 'B100926' }], ['trainer', { r: 'a', n: 'Coach Ana' }], ['Sign-in check', { r: 's' }]]) {
            const res = await h.api('/api/auth/portal', { ticket: await ticketFor(Object.assign({}, t, { p: undefined, exp: soon() })) });
            R.check(res.status === 401 && res.body && res.body.code === 'audience' && !res.body.token, `with SSO_REQUIRE_AUDIENCE=1 a ${kind} ticket with no p must be refused (401 audience): ${JSON.stringify(res)}`);
        }
        R.check(!h.ids('trainee:').some((k) => /nia-ross/.test(k)), 'a refused ticket must not create a trainee record');
        const own = await ticketFor({ first: 'Nia', last: 'Ross', b: 'B100926', exp: soon() });
        const ok = await h.api('/api/auth/portal', { ticket: own });
        R.check(ok.status === 200 && ok.body && ok.body.token, `this program's own ticket must still sign in with SSO_REQUIRE_AUDIENCE=1: ${JSON.stringify(ok)}`);
        const again = await h.api('/api/auth/portal', { ticket: own });
        R.check(again.status === 401 && again.body && again.body.code === 'used', `…and only once: ${JSON.stringify(again)}`);
        const at = await ticketFor({ r: 'a', n: 'Coach Ana', exp: soon() });
        const a1 = await h.api('/api/auth/portal', { ticket: at }), a2 = await h.api('/api/auth/portal', { ticket: at });
        R.check(a1.status === 200 && a1.body.admin && a2.status === 401 && a2.body.code === 'used', `a trainer's ticket for this program signs in once: ${a1.status} then ${a2.status}`);
        h.env.SSO_REQUIRE_AUDIENCE = '0';
        const np = await h.api('/api/auth/portal', { ticket: await ticketFor({ first: 'Nia', last: 'Ross', b: 'B100926', p: undefined, exp: soon() }) });
        R.check(np.status === 200, `SSO_REQUIRE_AUDIENCE other than "1" leaves the rollout on (a ticket with no p signs in): ${np.status}`);
    }

    // 2. the used-ticket mark outlives the ticket
    {
        const h = await harness({ portalOnly: true });
        const ttls = [];
        const put = h.env.LSH_KV.put;
        h.env.LSH_KV.put = async (k, v, o) => { if (/sso-used:/.test(k)) ttls.push(o && o.expirationTtl); return put(k, v, o); };
        for (const t of [{ first: 'Ola', last: 'Diaz', b: 'B100926' }, { r: 'a', n: 'Coach Ana' }, { r: 's' }]) await h.api('/api/auth/portal', { ticket: await ticketFor(Object.assign({}, t, { exp: soon() })) });
        R.check(ttls.length === 3 && ttls.every((s) => Number.isFinite(s) && s >= 600), `every ticket's used mark must live at least as long as a ticket can (600 s): ${JSON.stringify(ttls)}`);
    }

    // 3. this course's own tool tickets
    {
        const h = await harness({ portalOnly: true });
        const me = await h.portal('Pia', 'Chen', 'B100926');
        R.check(me.status === 200 && me.body.token, `sign-in for the tool-ticket test: ${JSON.stringify(me.body)}`);
        const a = await h.api('/api/auth/tool-ticket', {}, me.body.token), b = await h.api('/api/auth/tool-ticket', {}, me.body.token);
        const adm = await h.api('/api/auth/tool-ticket', {}, h.admin);
        for (const [who, r] of [['trainee', a], ['trainee (again)', b], ['trainer', adm]]) {
            const t = r.body && r.body.ticket ? decode(r.body.ticket) : null;
            R.check(r.status === 200 && t && t.p === 'tool' && typeof t.j === 'string' && t.j.length >= 6, `a ${who}'s tool ticket must carry p "tool" and a random j: ${JSON.stringify(t || r)}`);
        }
        R.check(a.body.ticket !== b.body.ticket, 'two tool tickets must never be the same ticket');
        R.check(!('u' in decode(a.body.ticket)), `a record with no Portal id gives a tool ticket with no u: ${JSON.stringify(decode(a.body.ticket))}`);
        // (a record that holds the Portal's id for the trainee: its tool ticket carries it as u, the Portal signs a trainee in by it)
        const withU = await h.portal('Uma', 'Uid', 'B100926', 'U-77');
        const tu = await h.api('/api/auth/tool-ticket', {}, withU.body.token), tt = tu.body && tu.body.ticket ? decode(tu.body.ticket) : null;
        R.check(h.raw('trainee:' + withU.body.id).portalUid === 'U-77' && tt && tt.u === 'U-77' && tt.p === 'tool', `a tool ticket for a record with portalUid must carry it as u: ${JSON.stringify(tt || tu)}`);
        for (const strict of ['', '1']) {
            h.env.SSO_REQUIRE_AUDIENCE = strict;
            for (const [who, r] of [['trainee', strict ? b : a], ['trainer', adm]]) {
                const back = await h.api('/api/auth/portal', { ticket: r.body.ticket });
                R.check(back.status === 401 && back.body && back.body.code === 'audience' && !back.body.token, `a ${who}'s tool ticket must not sign anyone in here (SSO_REQUIRE_AUDIENCE="${strict}"): ${JSON.stringify(back)}`);
            }
        }
    }

    // 4. the full registered name
    {
        const h = await harness({ portalOnly: true });
        const s = await h.api('/api/auth/portal', { ticket: await ticketFor({ first: 'Maria', last: 'Santos', b: 'B100926', full: 'Maria  L. Santos', exp: soon() }) });
        R.check(s.status === 200 && s.body.id === 'maria-santos--b100926' && s.body.fullName === 'Maria L. Santos', `the full name is kept, the ID is first + last + batch: ${JSON.stringify(s.body && { id: s.body.id, fullName: s.body.fullName })}`);
        R.check(h.raw('trainee:maria-santos--b100926').fullName === 'Maria L. Santos', 'trainee:<id> holds fullName');
        const rec = Object.assign({}, await h.get('trainee:maria-santos--b100926'), { fullName: 'Dr. Maria Santos PhD', lastActive: new Date().toISOString() });
        const w = await h.set('trainee:maria-santos--b100926', rec, s.body.token);
        R.check(w.status === 200, `the trainee's own write: ${JSON.stringify(w)}`);
        R.check((await h.get('trainee:maria-santos--b100926')).fullName === 'Maria L. Santos', 'a trainee must not change the full name the Portal registered');
        const drop = Object.assign({}, await h.get('trainee:maria-santos--b100926')); delete drop.fullName;
        await h.set('trainee:maria-santos--b100926', drop, s.body.token);
        R.check((await h.get('trainee:maria-santos--b100926')).fullName === 'Maria L. Santos', 'a trainee\'s write without fullName must not drop it');
    }

    // 5. the certificate (js/cm-full-name.js on a stand-in certData)
    {
        const src = fs.readFileSync(path.join(__dirname, '../../js/cm-full-name.js'), 'utf8');
        const ctx = { state: { traineeId: 'maria-santos--b100926', regName: { first: 'Maria', last: 'Santos' }, certSettings: { nameFormat: 'lastFirst' }, adminData: [{ id: 'john-doe--b100926', firstName: 'John', lastName: 'Doe', fullName: 'John A. Doe Jr.' }] } };
        ctx.window = ctx;
        ctx.certData = (s) => ({ name: s ? `${s.lastName}, ${s.firstName}` : 'Santos, Maria', confirmedName: true });
        ctx.sharedGet = async (k) => (k === 'trainee:maria-santos--b100926' ? { id: 'maria-santos--b100926', lastName: 'Santos', fullName: 'Maria L. Santos' } : null);
        const shown = [];
        ctx.openCertificate = async (s) => { shown.push(ctx.certData(s).name); };
        ctx.downloadCertificatePdf = async (id) => { shown.push(ctx.certData(id ? { traineeId: id, firstName: 'John', lastName: 'Doe' } : undefined).name); };
        vm.createContext(ctx);
        vm.runInContext(src, ctx, { filename: 'cm-full-name.js' });
        const f = ctx.cmFullName && ctx.cmFullName.certName;
        R.check(typeof f === 'function', 'js/cm-full-name.js exposes cmFullName.certName');
        if (f) {
            for (const [full, first, last, fmt, want] of [
                ['Maria L. Santos', 'Maria', 'Santos', 'lastFirst', 'Santos, Maria L.'],
                ['Maria L. Santos', 'Maria', 'Santos', 'firstLast', 'Maria L. Santos'],
                ['John A. Doe Jr.', 'John', 'Doe', 'lastFirst', 'Doe, John A. Jr.'],
                ['Ana Maria de la Cruz', 'Ana Maria', 'de la Cruz', 'lastFirst', 'de la Cruz, Ana Maria'],
                ['Lei Abutment', 'Lei', 'Abut', 'lastFirst', 'Lei Abutment'],
                ['', 'Lei', 'Abut', 'lastFirst', '']
            ]) R.check(f(full, first, last, fmt) === want, `certName(${JSON.stringify(full)}, …, ${fmt}) should be ${JSON.stringify(want)}, got ${JSON.stringify(f(full, first, last, fmt))}`);
        }
        await ctx.openCertificate();
        await ctx.openCertificate({ traineeId: 'john-doe--b100926', firstName: 'John', lastName: 'Doe' });
        await ctx.downloadCertificatePdf('john-doe--b100926');
        ctx.state.certSettings.nameFormat = 'firstLast';
        await ctx.downloadCertificatePdf(null);
        R.check(JSON.stringify(shown) === JSON.stringify(['Santos, Maria L.', 'Doe, John A. Jr.', 'Doe, John A. Jr.', 'Maria L. Santos']), `the certificate shows the registered full name (trainee and trainer): ${JSON.stringify(shown)}`);
        ctx.state.adminData = [{ id: 'kim-lee--b100926', firstName: 'Kim', lastName: 'Lee' }];
        R.check(ctx.certData({ traineeId: 'kim-lee--b100926', firstName: 'Kim', lastName: 'Lee' }).name === 'Lee, Kim', 'a record with no full name keeps the certificate\'s own name');
    }

    R.done('Portal tickets: SSO_REQUIRE_AUDIENCE=1 refuses one with no p, a used mark outlives a ticket, this course\'s tool tickets (p "tool", each its own) sign nobody in here, and the full registered name is kept and is the certificate\'s.');
})().catch((e) => { console.error(e); process.exit(1); });
