// @check node — voicemail answer keys grade a correct answer right: the number as heard, a "no" not taken for a "yes", audit kinds
// The voicemails read John Doe's cell aloud ("five five five, oh one oh, two two eight eight"), and the trainee is
// told to take the message down word for word. So a fact or a Listening Check answer that wants the call-back
// number must take it as it was said (spelled out, or split "22 88"), not only as the digits "2288": a perfect
// transcript is graded 100%, not 90%. "Does he still want the injection?" is answered by a yes: an answer that
// says he no longer wants it is not caught because it holds the word "want". And an exhibit audit's "privilege"
// item is a Privilege safety gate on the Scorecard (js/cm-scorecard.js), so only a privileged document carries it.
// The grading itself (npHit, txWords, txAccuracy, npTxGrade) is lifted from js/cm-case-flow.js, so this runs the
// live code on the built data (js/cm-case-flow-sim.js, js/cm-case-flow-exhibits.js).
// Run: node .github/scripts/vm-answer-keys.cjs [repo-root]
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = path.resolve(process.argv[2] || '.');
const failures = [];
const check = (ok, m) => { console.log((ok ? 'PASS ' : 'FAIL ') + m); if (!ok) failures.push(m); };
const ctx = { window: {} };
vm.createContext(ctx);
['js/cm-case-flow-sim.js', 'js/cm-case-flow-exhibits.js'].forEach(f => vm.runInContext(fs.readFileSync(path.join(ROOT, f), 'utf8'), ctx));
const SIM = ctx.window.CM_CF_SIM, EX = ctx.window.CM_CF_EXHIBITS;

// the grading code, as the page runs it
const src = fs.readFileSync(path.join(ROOT, 'js/cm-case-flow.js'), 'utf8');
const cut = (from, to) => { const a = src.indexOf(from), b = src.indexOf(to, a); if (a < 0 || b < 0) throw new Error('js/cm-case-flow.js: cannot find ' + from); return src.slice(a, b); };
const grade = new Function('SIM', 'EX', [
    'const notesOf = id => EX.notes[id] || null;',
    cut('const npHit =', '\n'),
    cut('const TX_FILL =', '// the transcript\'s grade'),
    'return {npHit, npTxGrade};'].join('\n'))(SIM, EX);
// a Listening Check answer is caught when every pattern is found in it (js/cm-case-flow.js listenCheck)
const caught = (x, a) => x.match.every(m => { try { return new RegExp(m, 'i').test(a); } catch (e) { return false; } });

// 🎙 the transcript: the voicemail word for word scores 100, and the call-back number is caught however it's written
const said = SIM.events['d1m3-a1'].spoken;
const tx = grade.npTxGrade('d1m3-a1', said);
check(tx.score === 100 && tx.got.every(Boolean), `d1m3-a1: the voicemail typed word for word scores 100% with every fact caught (got ${tx.score}%, ${tx.facts}/${tx.of})`);
const NUMBER = ['555-010-2288', '(555) 010-2288', '555 010 22 88', '5550102288', 'five five five, oh one oh, two two eight eight', '555 010 two two eight eight', 'double two double eight'];
const fact = EX.notes['d1m3-a1'].transcribe.facts[0];
NUMBER.forEach(n => check(grade.npHit(fact.match, 'John Doe, call his cell ' + n), `d1m3-a1 transcript: the call-back number written "${n}" is caught`));
check(!grade.npHit(fact.match, 'John Doe, call his cell 555-010-3950'), 'd1m3-a1 transcript: the work line (3950) is not taken for the cell');

// 🎧 the Listening Checks' call-back-number question
['d1m3-a1', 'd2m2-a3'].forEach(b => {
    const q = SIM.events[b].listen[0];
    NUMBER.forEach(n => check(caught(q, 'John Doe, his cell ' + n), `${b} Listening Check Q1: "${n}" is caught`));
    check(!caught(q, 'John Doe, the work line 555-010-3950'), `${b} Listening Check Q1: the wrong number is not caught`);
});

// 🎧 "Does he still want the injection?": a yes is caught, a no is not
const q4 = SIM.events['d2m2-a3'].listen.find(x => /still want the injection/i.test(x.q));
check(!!q4, 'd2m2-a3: the Listening Check asks whether he still wants the injection');
if (q4) {
    ['Yes', 'Yes, just not at Millbrook', 'Yes, he still wants the shot, not there', 'He still wants it', 'He wants it, but somewhere closer', 'yeah he does',
        // a later "doesn't want" about the place, and words ending in -nt (patient, client), are no negation of the answer
        "Yes, he still wants it, but he doesn't want to go to Millbrook", 'Yes - he wants the injection, he just doesn’t want it at Millbrook',
        'Still wants it; does not want Millbrook', 'The patient still wants the injection', 'Client still wants it', 'Yes, the client wants it'].forEach(a =>
        check(caught(q4, a), `d2m2-a3 Q4: "${a}" is caught`));
    ["No, he doesn't want it anymore", 'No', 'He does not want it', 'He doesn’t want it now', 'He no longer wants it', 'not anymore', 'nope', 'He never wants it'].forEach(a =>
        check(!caught(q4, a), `d2m2-a3 Q4: "${a}" is not caught`));
}

// 🛡 an audit item is a Privilege gate only when it is a privileged document
const PRIV = /privileg|summary|hipaa|authori[sz]ation|mediation statement|work.product|memo/i;
Object.entries(EX.audits || {}).forEach(([b, a]) => (a.items || []).forEach((it, i) => {
    if (it.kind === 'privilege') check(PRIV.test([it.what, it.as, it.issue].join(' ')), `${b} item ${i + 1} ("${it.what}"): a Privilege gate names privileged material`);
}));
const d3 = (EX.audits['d3m1-a1'] || {}).items || [];
const task = d3.find(it => /dated, assigned CMS task/.test(it.what || ''));
check(task && task.kind !== 'privilege', 'd3m1-a1: "Each deficiency as a dated, assigned CMS task" is not a Privilege gate');

if (failures.length) { console.log(`\n${failures.length} failure(s)`); process.exit(1); }
console.log('\nvm-answer-keys: all passed');
