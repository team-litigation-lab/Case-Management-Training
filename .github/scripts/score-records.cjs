// @check node — 🏅 Scores read right from the records already stored: a pre-rule Knowledge Check keeps its best, a device-only check stays unconfirmed on My Performance, the trainer's 40% shows at once, Track A's Net Sheet is Day 3's, calls are all counted, a failed reload keeps the scores shown, a merged amendment set counts once
// js/cm-kc-once.js and js/cm-scorecard.js, run in Node with the page's globals stubbed (the course data is the real one):
//   1. a record from before the one-attempt rule (several attempts, the best kept as its score): its official result is
//      that kept best, and a retake after a trainer's reset never lowers the score or un-passes the day on the device;
//   2. 🏅 My Performance: a Knowledge Check only this device holds (not on trainee:<id>) is not passed and not counted
//      once the record is read, but shown unconfirmed, as the trainer's Scorecard shows it;
//   3. the trainer's Learning Check score (feedback:<id>.caseFlow) makes the composite as soon as it is saved, not when
//      the trainee's page next writes its summary;
//   4. the lien negotiations and the final disbursement Net Sheet (and its Trust-money gate) are Day 3's (Track A);
//   5. 📞 Case Calls: every call on a topic is counted, not only those from the best one on;
//   6. a background reload whose second get-many failed (null for every key) keeps the rows shown;
//   7. the amendment set worked on d2m4-a1 (merged into d3m1-a1) and again on d3m1-a1 counts once, the better of the two.
// Usage: node .github/scripts/score-records.cjs   (no server, no browser needed)
const vm = require('vm'), fs = require('fs'), path = require('path');
const { reporter } = require('./worker-harness.cjs');
const R = reporter();
const read = (f) => fs.readFileSync(path.join(__dirname, '../..', f), 'utf8');
const doc = { addEventListener() { }, getElementById() { return null; }, querySelector() { return null; }, querySelectorAll() { return []; }, createElement: () => ({ appendChild() { } }), head: { appendChild() { } }, body: { appendChild() { } }, visibilityState: 'hidden' };
function sandbox(extra) {
  const win = { addEventListener() { } };
  const ctx = Object.assign({ window: win, document: doc, console, setTimeout, clearTimeout, setInterval() { }, Promise, state: {} }, extra || {});
  win.window = win; vm.createContext(ctx);
  ctx.window = new Proxy(win, { get: (t, k) => k in t ? t[k] : ctx[k], set: (t, k, v) => { t[k] = v; return true; } });
  return { ctx, win };
}

(async () => {
  // 1. js/cm-kc-once.js: a record from before the rule
  {
    const { ctx, win } = sandbox({ DAYS: [{ id: 11, cf: { n: 1 }, quiz: new Array(20).fill({}) }] });
    let n2 = 2;
    // (a trainer's reset with n = 2: the attempts since are those after the record's two)
    win.cmKcReset = { reopened: () => n2 != null && ctx.state.progress[11].history.length === n2, since: (p) => n2 != null ? p.history.slice(n2) : [], take() { } };
    ctx.storeSet = async () => { }; ctx.render = () => { }; ctx.toast = () => { };
    ctx.submitQuiz = async function (id) {   // the page's submitQuiz: the attempt added, the best kept
      const p = ctx.state.progress[id], score = 60;
      ctx.state.progress[id] = { done: score >= 70 || p.done, score: Math.max(score, p.score || 0), history: p.history.concat([{ score, passed: score >= 70, date: '2026-11-20T10:00:00Z' }]) };
    };
    win.submitQuiz = ctx.submitQuiz;
    ctx.state.progress = { 11: { score: 90, done: true, history: [{ score: 50, passed: false, date: '2026-08-01T10:00:00Z' }, { score: 90, passed: true, date: '2026-08-02T10:00:00Z' }] } };
    n2 = null;
    vm.runInContext(read('js/cm-kc-once.js'), ctx);
    const O = win.cmKcOnce;
    const o = O.official(11);
    R.check(o && o.score === 90 && o.passed, `a pre-rule record with attempts 50 then 90 (score 90 kept): its recorded result is 90%, passed: ${JSON.stringify(o)}`);
    n2 = 2;
    await win.submitQuiz(11);
    const p = ctx.state.progress[11];
    R.check(p.score === 90 && p.done === true, `a retake at 60 after a trainer's reset keeps 90% and the pass on the device (the Worker keeps 90 too): ${p.score} / ${p.done}`);
    // a single-attempt record (the rule's own) keeps its first attempt
    ctx.state.progress[11] = { score: 75, done: true, history: [{ score: 75, passed: true }] }; n2 = null;
    R.check(O.official(11).score === 75, 'a one-attempt record: its one attempt');
  }

  // js/cm-scorecard.js, with the real course data
  const { ctx, win } = sandbox({ DAYS: [1, 2, 3, 4, 5].map((n) => ({ id: 10 + n, cf: { n }, title: `Case Flow Day ${n} · Day ${n}` })) });
  vm.runInContext(read('js/cm-case-flow-data.js'), ctx);
  vm.runInContext(read('js/cm-case-flow-exhibits.js'), ctx);
  vm.runInContext(read('js/cm-scorecard.js'), ctx);
  const S = win.cmScorecard, d11 = ctx.DAYS[0];
  const src = (id) => S.sources.find((x) => x.id === id);
  const base = () => ({ rec: { dayProgress: {} }, cf: { days: {} }, data: {}, fb: {} });

  // 2. My Performance: a check only the device holds
  {
    const rec = { id: 't1', approved: true, dayProgress: {}, caseFlow: { days: { 1: { id: 11, kc: null, passed: false, modules: {} } } } };
    ctx.state = { traineeId: 't1', isAdmin: false, progress: { 11: { score: 85, done: true, history: [{ score: 85, passed: true }] } }, view: 'x' };
    ctx.sharedGetMany = async (keys) => keys.map((k) => k === 'trainee:t1' ? rec : null);
    ctx.cmCaseFlow = win.cmCaseFlow = { scoreSummary: () => ({ days: { 1: { id: 11, kc: 85, passed: true, modules: {} } } }) };
    S.myOverall();
    await new Promise((r) => setTimeout(r, 20));
    const c = S.myCtx();
    R.check(!S.kcPassed(c, d11), 'My Performance: a check only the device holds is not passed once the record is read');
    R.check(S.kcDevice(c, d11) === 85, `and it is shown unconfirmed (kcDevice): ${S.kcDevice(c, d11)}`);
    const row = S.compute(c).rows.find((r) => r.s.id === 'kc') || { items: [] };
    R.check(row.avg == null && row.items.length && row.items[0].unconfirmed, `and never averaged: ${JSON.stringify(row.items)}`);
    delete win.cmCaseFlow; delete ctx.cmCaseFlow;
  }

  // 3. the trainer's 40%
  {
    const c = base(); c.cf = { days: { 1: { id: 11, modules: { d1m1: { a: 80, t: null, c: null } } } } }; c.fb = { caseFlow: { d1m1: { score: 90, at: '2026-11-20T10:00:00Z' } } };
    const it = src('lc').items(c)[0] || {};
    R.check(it.pct === 84 && it.auto === false, `a trainer's 90 on an automated 80 makes 84 at once: ${JSON.stringify(it)}`);
    const none = base(); none.cf = c.cf;
    R.check((src('lc').items(none)[0] || {}).pct === 80, 'with no trainer score the automated half counts');
    R.check(/S\.lcMods\(cfd\.modules, ctx\.fb\)/.test(read('js/cm-batch-sheet.js')), 'the Batch Sheet\'s Learning Check rows read the trainer\'s score the same way (cmScorecard.lcMods)');
  }

  // 4. Track A's Net Sheet on Day 3
  {
    const c = base(); c.data = { 'net-sheet': { files: { a: { checks: { liens: { passed: 3, total: 4 }, final: { passed: 3, total: 4 } } } } } };
    const ev = S.model.evidence(c), ns = ev.items.filter((x) => x.group === '📊 Net Sheet'), tr = ev.crit.filter((x) => x.id === 'trust');
    R.check(ns.length === 2 && ns.every((x) => x.day === 3), `the lien and final Net Sheets are Day 3's: ${ns.map((x) => x.day)}`);
    R.check(tr.length === 1 && tr[0].day === 3, `and the final disbursement's Trust-money gate: Day ${tr[0] && tr[0].day}`);
  }

  // 5. every call counted
  {
    const c = base(); c.data = { roleplayHistory: [60, 70, 80].map((score) => ({ categoryId: 'caseflow', topicId: 'cf-x', topicLabel: 'Call X', score })) };
    const it = src('cc').items(c)[0] || {};
    R.check(it.pct === 80 && it.note === '3 calls', `three calls at 60, 70, 80: best 80, "3 calls": ${JSON.stringify(it)}`);
  }

  // 6. a failed background reload
  {
    ctx.state = { isAdmin: true, view: 'x' };
    const recs = [{ id: 'a', name: 'A', batch: 'B1', approved: true, dayProgress: { 11: { score: 90, done: true, history: [{ score: 90 }] } }, caseFlow: { days: {} } }];
    const prog = { data: { 'drive-setup': { score: 100, ok: true } } };
    let fail = false;
    ctx.sharedList = async () => ['trainee:a'];
    ctx.sharedGetMany = async (keys) => keys.map((k) => k === 'trainee:a' ? recs[0] : fail ? null : k === 'progress:a' ? prog : null);
    await S.reload();
    const before = JSON.stringify(S.rows().map((r) => r.m.overall));
    fail = true; await S.reload();
    const after = JSON.stringify(S.rows().map((r) => r.m.overall));
    R.check(S.rows().length === 1 && before === after, `a reload whose get-many failed keeps the scores shown: ${before} → ${after}`);
    R.check(S.rows()[0] && S.rows()[0].c.data['drive-setup'], 'and the Backup Drive the good read found');
  }

  // 7. one amendment set on two activities
  {
    const A = (win.CM_CF_EXHIBITS || {}).amendments || {};
    R.check(A['d2m4-a1'] && A['d3m1-a1'], 'the amendment set is under d2m4-a1 and d3m1-a1');
    const a = A['d3m1-a1'], asked = new Set(a.requests.map((q) => q.doc)), marks = {};
    a.screen.forEach((s) => { marks[s.doc] = asked.has(s.doc) ? 'fix' : 'ok'; });
    const half = Object.assign({}, marks); a.screen.slice(0, 4).forEach((s) => { half[s.doc] = half[s.doc] === 'fix' ? 'ok' : 'fix'; });
    const doc0 = a.requests[0].doc;
    const c = base(); c.data = { 'case-flow': { amend: {
      'd2m4-a1': { screened: true, marks: half, req: { [doc0]: { sent: true, tries: 2 } } },
      'd3m1-a1': { screened: true, marks, req: { [doc0]: { sent: true, tries: 0 } } } } } };
    const ev = S.model.evidence(c).items, scr = ev.filter((x) => x.group === '🧾 Records screening'), req = ev.filter((x) => x.name === `Amendment request: ${doc0}`);
    R.check(scr.length === 1 && scr[0].pct === 100, `the records screening counts once, the better: ${scr.map((x) => x.pct)}`);
    R.check(req.length === 1 && req[0].pct === 100, `each amendment request counts once, the better email: ${req.map((x) => x.pct)}`);
    const em = src('em').items(c).filter((x) => x.name === `Amendment request: ${doc0}`);
    R.check(em.length === 1 && em[0].pct === 100, `and once in the Email Simulators: ${em.map((x) => x.pct)}`);
    const one = base(); one.data = { 'case-flow': { amend: { 'd2m4-a1': c.data['case-flow'].amend['d2m4-a1'] } } };
    R.check(S.model.evidence(one).items.filter((x) => x.group === '🧾 Records screening').length === 1, 'a set worked on d2m4-a1 alone still counts');
  }

  R.done('🏅 Scores read right from the records already stored.');
})().catch((e) => { console.log('score-records crashed:', e && e.stack || e); process.exit(1); });
