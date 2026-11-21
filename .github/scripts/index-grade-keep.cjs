// @check node — Grades in index.html land where they belong: a Knowledge Check keeps the day's random-task scores, a JSON grade with a note after it still parses, a Case Flow call is logged on its own day, a task graded across its expiry isn't also missed, and deleting calendar blocks doesn't resolve conflicts
// Each part runs the real code from index.html (cut out by name) in a sandbox with the page's helpers stubbed:
//   1. submitQuiz merges the attempt onto the day: surpriseTaskScores / surpriseTaskScore written by a random task stay.
//   2. callAIJson reads {…} followed by a sentence (or a closing ``` and a note) on the first call, instead of failing twice.
//   3. the roleplay wrapper files a Case Flow call (state.rpSession.cf.dayId) on that day, not on nextDayId().
//   4. a random task whose window ends while its resolution is with the grader is resolved once: no 0 beside its score.
//   5. the Calendar Conflict Resolver: deleting every block scores 0, not 100; with nothing deleted the score is the
//      old count (starting conflicts less the ones left).
// Usage: node .github/scripts/index-grade-keep.cjs   (no server, no browser; INDEX_FILE=<path> runs it on another copy)
const fs = require('fs'), path = require('path'), vm = require('vm');
const SRC = fs.readFileSync(process.env.INDEX_FILE || path.join(__dirname, '..', '..', 'index.html'), 'utf8');
const failures = [];
const check = (ok, m) => { if (!ok) failures.push(m); };

// a top-level declaration from index.html: from its first line to the first line at column 0 that closes it
function cut(startsWith, closer = '}') {
    const i = SRC.indexOf('\n' + startsWith);
    if (i < 0) throw new Error('not found in index.html: ' + startsWith);
    const j = SRC.indexOf('\n' + closer, i + 1);
    return SRC.slice(i + 1, SRC.indexOf('\n', j + 1));
}
const optional = (line) => { const i = SRC.indexOf('\n' + line); return i < 0 ? '' : SRC.slice(i + 1, SRC.indexOf('\n', i + 1)); };
const run = (code, ctx) => { vm.createContext(ctx); vm.runInContext(code, ctx); return ctx; };
const el = () => ({ innerHTML: '', textContent: '', disabled: false, scrollIntoView() {} });
const doc = { getElementById: () => el(), querySelector: () => null, querySelectorAll: () => [] };

(async () => {
    // 1. a Knowledge Check after a random task on the same day
    {
        const ctx = run(cut('async function submitQuiz(dayId){'), {
            state: { progress: { 11: { surpriseTaskScores: [85], surpriseTaskScore: 85, surpriseTaskAnsweredAt: 't1' } }, quizAnswers: { 0: 1, 1: 0 } },
            DAYS: [{ id: 11, quiz: [{ q: 'a', a: 1 }, { q: 'b', a: 1 }] }],
            logWork() {}, storeSet: async () => {}, syncToLedger: async () => {}, autoReviewDay() {}, renderQuiz: () => '', renderAnswerFeedback() {},
            burstConfetti() {}, toast() {}, setTimeout() {}, document: doc, Date, Math, Object
        });
        await ctx.submitQuiz(11);
        const p = ctx.state.progress[11];
        check(p && p.score === 50 && Array.isArray(p.history) && p.history.length === 1, `the Knowledge Check should be recorded: ${JSON.stringify(p)}`);
        check(p && Array.isArray(p.surpriseTaskScores) && p.surpriseTaskScores[0] === 85 && p.surpriseTaskScore === 85 && p.surpriseTaskAnsweredAt === 't1',
            `the Knowledge Check should keep the day's random-task score: ${JSON.stringify(p)}`);
    }

    // 2. a JSON grade with a note after it
    {
        let reply = '', calls = 0;
        const ctx = run(cut('async function callAIJson('), { callAIText: async () => { calls++; return reply; }, JSON });
        const cases = [
            ['{"accuracyScore":30,"note":"a } in a string"}', 30],
            ['{"accuracyScore":30}\n\nNote: accuracy was docked for the SOL date.', 30],
            ['```json\n{"accuracyScore":30}\n```\nHope this helps {sic}.', 30],
            ['Here is the grade:\n{"accuracyScore":30}\nThanks.', 30],
            ['Here you go: {"accuracyScore":30,}', 30]
        ];
        for (const [text, want] of cases) {
            reply = text; calls = 0;
            let got, err;
            try { got = await ctx.callAIJson('p', 100, 1000, 'f'); } catch (e) { err = e; }
            check(got && got.accuracyScore === want && calls === 1, `callAIJson should parse ${JSON.stringify(text)} on one call: ${err ? err.message : JSON.stringify(got)} (${calls} calls)`);
        }
        reply = '[{"a":1},{"a":2}]\nDone.'; calls = 0;
        const a2 = await ctx.callAIJson('p', 100, 1000, 'f').catch(() => null);
        check(Array.isArray(a2) && a2.length === 2, `an array followed by a note should parse: ${JSON.stringify(a2)}`);
        reply = '{"accuracyScore":30'; calls = 0;
        let threw = false; try { await ctx.callAIJson('p', 100, 1000, 'f'); } catch (e) { threw = true; }
        check(threw && calls === 2, 'a cut-off reply should still fail (and be retried once)');
    }

    // 3. a Case Flow call is logged on its own day
    {
        const logged = [];
        const ctx = run(cut('(function wrapEvaluators(){', '})();'), {
            runRubricEvaluation: async () => ({}), runRoleplayRubricEvaluation: async () => ({ totalScore: 80, gradeTier: 'Proficient', actProtocolScore: 20 }),
            logWork: (e) => logged.push(e), nextDayId: () => 13, workDayFromContext: () => 13, autoReviewDay() {}, setTimeout() {}, state: {}, String, Math
        });
        await ctx.runRoleplayRubricEvaluation({ topic: { label: 'Margaret Doe: Multi-Channel Outreach Logging' }, cf: { dayId: 11, blockId: 'd1m2-a1' } }, 'CALLER: hi');
        await ctx.runRoleplayRubricEvaluation({ topic: { label: 'Open roleplay' } }, 'CALLER: hi');
        check(logged[0] && logged[0].dayId === 11, `a Day 1 Case Flow call should be logged on Day 1 (11): ${logged[0] && logged[0].dayId}`);
        check(logged[1] && logged[1].dayId === 13, `a roleplay outside Case Flow should keep the trainee's current day: ${logged[1] && logged[1].dayId}`);
    }

    // 4. a random task whose window ends while it is being graded
    {
        const t0 = Date.now();
        const entry = { id: 'g1', dayId: 11, task: 'Call the adjuster', receivedAt: new Date(t0 - 29 * 60000).toISOString(), expiresAt: new Date(t0 + 40).toISOString(), status: 'progress', response: 'I would call the adjuster first and confirm the claim number.' };
        const log = [entry], work = [];
        const ctx = {
            state: { progress: {} }, DAYS: [{ id: 11, title: 'Day 1' }], taskLog: () => log, saveTaskLog: async () => {}, storeSet: async () => {}, syncToLedger() {},
            logWork: (e) => work.push(e), dayNo: () => 1, cssId: (s) => s, toast() {}, render: () => ctx.refreshTaskStatuses(), renderEvaluationReport: () => '', renderAiErrorBlock: () => '',
            burstConfetti() {}, document: doc, setTimeout, Date, Math, Object,
            // the grade takes longer than the time left; the page redraws (the 1-second ticker) while it waits
            runRubricEvaluation: async () => { await new Promise(r => setTimeout(r, 120)); ctx.render(); return { totalScore: 85, gradeTier: 'Proficient' }; }
        };
        run([optional('const __tkGrading = new Set();'), cut('function refreshTaskStatuses(){'), cut('async function submitTask(id){')].join('\n'), ctx);
        await ctx.submitTask('g1');
        const p = ctx.state.progress[11] || {};
        check(entry.status === 'resolved' && entry.score === 85, `the task should be resolved with its grade: ${entry.status} ${entry.score}`);
        check(JSON.stringify(p.surpriseTaskScores) === '[85]' && p.surpriseTaskScore === 85, `the day should hold the one score, not a 0 beside it: ${JSON.stringify(p)}`);
        check(!work.some(w => /missed/.test(w.label || '')), `no "missed" line should be logged for a task submitted in time: ${JSON.stringify(work.map(w => w.label))}`);
        // a task left open past its window is still missed
        const late = { id: 'g2', dayId: 12, receivedAt: new Date(t0 - 60000).toISOString(), expiresAt: new Date(t0 - 1000).toISOString(), status: 'progress' };
        log.push(late); ctx.refreshTaskStatuses();
        check(late.status === 'missed' && JSON.stringify((ctx.state.progress[12] || {}).surpriseTaskScores) === '[0]', `an expired open task should still be missed: ${late.status}`);
    }

    // 5. the Calendar Conflict Resolver
    {
        let saved = null;
        const ctx = {
            toolState: { calEdits: {}, calCustomEvents: [] }, document: doc, bumpPracticeProgress: async (id, s) => { saved = s; }, burstConfetti() {},
            DAY_ORDER: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'], calDayDate: (d) => d, fmtHr: (h) => String(h), Object, Math, Set
        };
        run([cut('const CAL_EVENTS = [', '];'), cut('function calMergedEvents(){'), cut('function calFindConflicts(events){'),
            optional('function calPlanScore(events){') ? cut('function calPlanScore(events){') : '', cut('async function submitCalendar(){'),
            'toolState.calBaseline = calFindConflicts(CAL_EVENTS).length;'].join('\n'), ctx);
        const base = ctx.toolState.calBaseline;
        await ctx.submitCalendar();
        check(saved === 0, `an untouched week should score 0: ${saved}`);
        // move the Team Case Standup (Mon 9:30) to a free Mon slot: one conflict fixed, nothing deleted (the old count)
        ctx.toolState.calEdits = { 1: { day: 'Mon', s: 12.5, e: 13.5 } };
        await ctx.submitCalendar();
        check(saved === Math.round(1 / base * 100), `moving one block off its clash should resolve one conflict: ${saved}`);
        // delete everything
        ctx.toolState.calEdits = {}; vm.runInContext('CAL_EVENTS.forEach((e,i)=>{ toolState.calEdits[i] = {deleted:true}; })', ctx);
        await ctx.submitCalendar();
        check(saved === 0, `deleting every block should not resolve any conflict: ${saved}%`);
    }

    if (failures.length) { console.log(`\n${failures.length} failure(s):`); failures.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
    console.log('index grades: a Knowledge Check keeps the day\'s task scores, JSON grades with a note parse, Case Flow calls log on their day, a task graded at expiry is resolved once, deleted calendar blocks resolve nothing');
})().catch((e) => { console.log('index-grade-keep failed: ' + (e && e.stack || e)); process.exit(1); });
