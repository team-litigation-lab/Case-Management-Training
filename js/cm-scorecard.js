/* 🏅 The Scorecard, set up the way Foundational Training's is (its js/lsh-program.js): every grading system's graded
   items, each system's average, and the overall, the average of the systems that have a score, so each counts the same.
   Foundational's task trackers and monitoring sheets have no place here; these are this course's own grading systems:
     ✍️ Knowledge Checks      each Case Flow day's quiz (70% passes)
     🧩 Learning Checks       each module's composite (AI × 0.60 + trainer × 0.40), the automated half until the trainer scores it
     📝 Takeaways             each day's Knowledge Check answers, AI-graded
     🧪 Skill Activities      each graded Skill Activity on John Doe's file (the work log)
     🗂 CMS Case File         John Doe's file in the CMS, graded day by day (js/cm-cms-file.js): the case as the CMS reports it,
                              each CMS activity's Check Your Work items by area, every document filed (doc-filing)
     📂 Backup Drive          Day 1's folder structure (drive-setup) and each later day's Backup File Maintenance, auto-graded from the drive (drive-grades)
     📊 Net Sheet Checks      each stage's Check my sheet on the LSH Net Sheet (net-sheet)
     🎙 Transcription         each voicemail transcript: every attempt graded (facts 60% + word accuracy 40%), the one handed in counts
     ✉️ Email Simulators      the Case Flow's Email Simulator sends (100% ÷ (refused drafts + 1)) and the Portal's email simulators
     🗓 Calendaring           the Portal's Calendaring Simulators
     🔎 Case Exercises        the exhibit audits, Listening Checks, records screening, judgement calls and action plans
     🛠 Skill Builders        each practice tool's best score
     🎯 Graded Calls          the best graded call on each Call Simulator line (callsim:<id>, written by the Portal)
     📞 Case Calls            each graded call on John Doe's file, its best; a missed injected call counts 0
     🧰 Portal Simulators     the best result on each other Training Portal simulator (simresults:<id>, written by the Portal)
     🎲 Random Tasks          each resolved random task's grade
     📐 Trainer Rubric        the trainer's rubric score on each day's sent review (feedback:<id>, the 📐 Feedback Rubric, js/cm-rubric.js)
   Each system names the rubric dimensions it feeds (dims) and how it is scored (how): the 📐 Feedback Rubric page maps them,
   and the card's 📐 Rubric profile averages them by dimension.
   Over them sits the client's 100-POINT MODEL (MODEL below): four weighted dimensions per Case Flow day, complexity
   multipliers, a 4-tier rubric, pass at 80% and a safety gate on the critical items.
   Both pages show it as Foundational's batch-sheet TRAINEE CARD (cardHtml), the standard format for all scorecards.
   • Trainee: 🏅 My Performance (#/scorecard), their own card; their grading systems under a toggle.
   • Trainer: 🏅 Scorecards (the same address), 🏅 Scores (a row per approved trainee, by batch; ⬇ Download is its CSV),
     then every trainee's card (🔎 picks one); a row of 🏅 Scores scrolls to its card.
   It only reads: trainee:<id> (its caseFlow summary, dayProgress and practiceProgress), progress:<id> (case-flow,
   work-log, task-log, doc-filing, net-sheet, case-folder, drive-setup), callsim:<id>, simresults:<id> and feedback:<id>
   (the trainer's Learning Check scores and each day's review with its rubric score), in one get-many. */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const num = v => typeof v === "number" && isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : null;
const pctTxt = p => p == null ? "—" : p + "%";
const tier = p => p == null ? "none" : p >= 85 ? "hi" : p >= 70 ? "ok" : "lo";
const isAdmin = () => typeof state !== "undefined" && !!state.isAdmin && !state.adminPreview;
const isTrainee = () => typeof state !== "undefined" && !!state.traineeId && !state.isAdmin;
const cfDays = () => (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d.cf);
const dayName = d => `Day ${d.cf.n}: ${String(d.title).replace(/^Case Flow Day \d+ · /, "")}`;
const fmt = at => { try{ return at ? new Date(at).toLocaleDateString(undefined, {month: "short", day: "numeric"}) : ""; }catch(e){ return ""; } };
function moduleNames(){
  const out = {};
  const CF = window.CM_CASE_FLOW; if(CF && CF.days) CF.days.forEach(d => (d.modules || []).forEach(m => { out[m.id] = {title: m.title, n: d.n}; }));
  return out;
}

const NS_STAGES = {recovery: "Track A · Settlement: the gross and the fee", bi: "Track A · BI settlement Net Sheet", um: "Track A · UM settlement Net Sheet",
  liens: "Track A · Lien negotiations", final: "Track A · Disbursement: the final Net Sheet", litigation: "Track B · Case won: the litigated Net Sheet"};
/* ---------- the grading systems: each returns its items, {name, pct, note, auto} ---------- */
const SOURCES = [
  {id: "kc", icon: "✍️", label: "Knowledge Checks", about: "Each Case Flow day's Knowledge Check. 70% passes the day.", dims: ["pc"], how: "Auto-scored quiz: the best score of the day's attempts.",
    items: c => cfDays().map(d => { const s = ((c.cf.days || {})[d.cf.n] || {}), p = (c.rec.dayProgress || {})[d.id] || {};
      const pct = num(s.kc != null ? s.kc : p.score); if(pct == null) return null;
      return {name: dayName(d), pct, note: pct >= 70 ? "Passed" : "Below 70%: not passed yet"}; })},
  {id: "lc", icon: "🧩", label: "Learning Checks", about: "Each module's Learning Check: AI × 0.60 + trainer × 0.40. Until the trainer scores it, the automated half counts.", dims: ["na", "cp"], how: "The AI review × 0.60 + the trainer's score × 0.40.",
    items: c => { const names = moduleNames(), out = [];
      Object.values(c.cf.days || {}).forEach(day => Object.entries(day.modules || {}).forEach(([id, s]) => {
        const pct = num(s.c != null ? s.c : s.a); if(pct == null) return;
        out.push({name: (names[id] ? `Day ${names[id].n}: ${names[id].title}` : id), pct, auto: s.c == null,
          note: s.c != null ? `Automated ${pctTxt(num(s.a))} · Trainer ${pctTxt(num(s.t))}` : "Automated only: awaiting the trainer's 40%"}); }));
      return out; }},
  {id: "tk", icon: "📝", label: "Takeaways", about: "Each day's Knowledge Check answers, in your own words, AI-graded.", dims: ["na", "cd"], how: "The AI review's total (Accuracy, Presence, Risk, Efficiency); Risk 0 is the UPL breach.",
    items: c => cfDays().map(d => { const s = (c.cf.days || {})[d.cf.n] || {}, p = (c.rec.dayProgress || {})[d.id] || {};
      const pct = num(s.takeaway != null ? s.takeaway : p.takeaway); return pct == null ? null : {name: dayName(d), pct}; })},
  {id: "sa", icon: "🧪", label: "Skill Activities", about: "Each graded Skill Activity on John Doe's file: the latest attempt of each.", dims: ["na", "cp", "cd"], how: "The AI rubric: Accuracy 35 + Presence 30 (plan quality), Risk 20, Efficiency 15.",
    items: c => { const seen = {}; (c.data["work-log"] || []).filter(e => e && e.kind === "lab" && typeof e.score === "number")
      .forEach(e => { const k = e.label || e.toolId || "Skill Activity"; if(!seen[k] || String(e.at || "") > String(seen[k].at || "")) seen[k] = e; });
      return Object.entries(seen).map(([k, e]) => ({name: k, pct: num(e.score), note: [e.tier, fmt(e.at)].filter(Boolean).join(" · ")})); }},
  {id: "cms", icon: "🗂", label: "CMS Case File", about: "John Doe's case file in the CMS, graded day by day against what a correct file holds by then: the case opened and verified, parties & Conflict Check, the insurance stack and claim numbers, the SOL and deadlines calendared, case notes and logs, liens, the litigation record, and every document filed under its category and named to convention.",
    dims: ["pc", "na", "cd"], how: "Per day, the average of its areas: Check Your Work items ticked 100% / not 0%; a document 100% first time right, then 100% ÷ attempts; the case as the CMS reports it; an entry missing when the day is passed 0.",
    items: c => { const f = window.cmCmsFile ? cmCmsFile.compute(c) : null; if(!f) return [];
      return f.days.filter(x => x.pct != null).map(x => ({name: `Day ${x.n}: the CMS case file`, pct: x.pct,
        note: x.areas.filter(a => a.pct != null).map(a => `${a.a.label} ${a.pct}%`).join(" · ") + (x.missing ? ` · ${x.missing} entr${x.missing === 1 ? "y" : "ies"} missing` : " · complete")})); }},
  {id: "bd", icon: "📂", label: "Backup Drive", about: "Your Backup Drive, graded automatically: Day 1's folder structure, then each day's Backup File Maintenance, read from your Drive itself (where each document is, whether every file is named by the firm's naming convention, what was moved and put back). File names are 12 of the 60 points graded each day. 70% passes.", dims: ["pc"], how: "Read from the Drive by the Worker: the share of the day's checks that pass.",
    items: c => { const out = [], s = c.data["drive-setup"], g = c.data["drive-grades"] || {};
      if(s && typeof s.score === "number") out.push({name: "Day 1: the firm's folders", pct: num(s.score), note: s.ok ? `Built on attempt ${s.attempts || 1}` : "Not built yet"});
      Object.keys(g).sort().forEach(n => { const x = g[n]; if(x && typeof x.score === "number") out.push({name: `Day ${n}: Backup File Maintenance`, pct: num(x.score), note: [x.passed ? "Passed" : "Below 70%: not passed yet", fmt(x.at)].filter(Boolean).join(" · ")}); });
      return out; }},
  {id: "ns", icon: "📊", label: "Net Sheet Checks", about: "Each stage of the LSH Net Sheet, checked automatically with Check my sheet: the share of its checks that passed.", dims: ["cp"], how: "Check my sheet: checks passed ÷ checks; the trust-money stages are critical.",
    items: c => { const out = [], files = (c.data["net-sheet"] && c.data["net-sheet"].files) || {};
      Object.values(files).forEach(f => Object.entries((f && f.checks) || {}).forEach(([stage, k]) => {
        if(!k || !k.total) return;
        out.push({name: NS_STAGES[stage] || stage, pct: Math.round(100 * k.passed / k.total), note: `${k.passed} of ${k.total} checks · ${fmt(k.at)}`}); }));
      return out; }},
  {id: "tx", icon: "🎙", label: "Transcription", about: "Each voicemail transcribed in the Notes & Action Plan: every attempt graded, the one handed in counts.",
    dims: ["cd"], how: "Facts caught against the answer key (60%) + word accuracy against what was said (40%); up to 3 graded attempts.",
    items: c => { const N = ((window.CM_CF_EXHIBITS || {}).notes) || {}, out = [];
      Object.entries(((c.data["case-flow"] || {}).notes) || {}).forEach(([b, r]) => { const n = N[b]; if(!n || !r || !n.transcribe) return;
        const tries = r.txTries || [], of = n.transcribe.facts.length, got = (r.txGot || []).filter(Boolean).length;
        const at = tries.map((a, i) => `#${i + 1} ${a.score}%`).join(", ");
        if(r.txAt) out.push({name: n.title.replace(/^Notes & Action Plan — /, "Transcript: "), pct: num(typeof r.txScore === "number" ? r.txScore : 100 * got / Math.max(1, of)),
          note: `${got} of ${of} facts${tries.length ? ` · ${tries[tries.length - 1].acc}% word accuracy · attempts ${at}` : ""} · handed in ${fmt(r.txAt)}`});
        else if(tries.length) out.push({name: n.title.replace(/^Notes & Action Plan — /, "Transcript: "), pct: num(tries[tries.length - 1].score), auto: true,
          note: `Not handed in yet · attempts ${at}`}); });
      return out; }},
  {id: "em", icon: "✉️", label: "Email Simulators", about: "Every email written in a simulator: the Case Flow's Email Simulator (the Notes & Action Plan's emails, the service confirmations, the amendment requests) and the Portal's Email Workspace and Email Replies.",
    dims: ["cd"], how: "Course emails: 100% when the first draft is accepted, then 100% ÷ (refused drafts + 1). Portal: the simulator's own grade, the best run.",
    items: c => { const out = [], R = c.data["case-flow"] || {}, EX = window.CM_CF_EXHIBITS || {}, sent = (name, x) => { if(x && x.sent) out.push({name, pct: Math.round(100 / ((x.tries || 0) + 1)), note: x.tries ? `Sent after ${x.tries} refused draft${x.tries === 1 ? "" : "s"}` : "First draft accepted"}); };
      const t = v => String(v || "").replace(/^Email Simulator — /, "");
      Object.entries(R.notes || {}).forEach(([b, r]) => { const n = (EX.notes || {})[b]; if(n && r) (n.emails || []).forEach(e => sent(t(e.title), (r.mails || {})[e.id])); });
      Object.entries(R.service || {}).forEach(([b, r]) => { const e = (EX.emails || {})[b]; if(e) sent(t(e.title) || b, r); });
      Object.entries(R.amend || {}).forEach(([b, r]) => Object.entries((r && r.req) || {}).forEach(([doc, x]) => sent(`Amendment request: ${doc}`, x)));
      Object.entries((c.sim && c.sim.best) || {}).filter(([k, b]) => simKind(k) === "email" && b && typeof b.score === "number").forEach(([k, b]) => out.push({name: k, pct: num(b.score), note: `Portal · ${b.count || 1} run${(b.count || 1) === 1 ? "" : "s"}`}));
      return out; }},
  {id: "cal", icon: "🗓", label: "Calendaring", about: "The Training Portal's Calendaring Simulators (the Litigation Week: the prep, debrief, client and expert calls placed around a deposition, a hearing and a mediation).",
    dims: ["pc", "cp"], how: "The simulator's automated review under the attorney's rules (the trainer's score where given): the best run.",
    items: c => { const out = [];
      Object.entries((c.sim && c.sim.best) || {}).filter(([k, b]) => simKind(k) === "calendar" && b && typeof b.score === "number").forEach(([k, b]) => out.push({name: k, pct: num(b.score), note: `Portal · ${b.count || 1} run${(b.count || 1) === 1 ? "" : "s"}`}));
      return out; }},
  {id: "cx", icon: "🔎", label: "Case Exercises", about: "The Case Flow's graded exercises on John Doe's file: the exhibit audits, the Listening Checks, the records screening, the judgement calls on served emails and the Notes & Action Plan's action plans.",
    dims: ["na", "cp"], how: "Each auto-checked against its answer key: the share called right (an audit's items, a Listening Check's facts, the records screened, the plan's required steps); a judgement call 100% or 0%.",
    items: c => (MODEL.evidence(c).items || []).filter(x => CX_GROUPS.has(x.group)).map(x => ({name: x.name, pct: num(x.pct), note: `Day ${x.day} · ${x.group.replace(/^\S+\s/, "")} · ${x.note}`}))},
  {id: "sb", icon: "🛠", label: "Skill Builders", about: "Each practice tool's best score (the Calendar Conflict Resolver).", dims: ["na", "cp"], how: "The practice tool's own grader: the best score of its runs.",
    items: c => Object.entries(c.rec.practiceProgress || {}).filter(([, v]) => v && typeof v.bestScore === "number" && v.bestScore > 0).map(([id, v]) => {
      const t = (typeof PRACTICE_TOOLS !== "undefined" ? PRACTICE_TOOLS : []).find(x => x.id === id);
      return {name: t ? t.title : id, pct: num(v.bestScore), note: `${v.runs || 1} attempt${(v.runs || 1) === 1 ? "" : "s"}`}; })},
  {id: "gc", icon: "🎯", label: "Graded Calls", about: "The best graded call on each Call Simulator line (☎ LSH Ring Channel).", dims: ["pc", "cd"], how: "The line's Mock Calls Metrics (the call and its required note), reported by the Portal: the best call.",
    items: c => Object.entries((c.callsim && c.callsim.best) || {}).filter(([, b]) => b && typeof b.score === "number").map(([k, b]) => ({
      name: b.line || k.replace(/^line:/, ""), pct: num(b.score), note: `${b.calls || 1} call${(b.calls || 1) === 1 ? "" : "s"}`}))},
  {id: "cc", icon: "📞", label: "Case Calls", about: "Each graded call on John Doe's file (Live Calls and the calls the trainer rings in), its best score; an injected call that was missed counts 0.", dims: ["pc", "na", "cd"], how: "The AI call rubric: BLUF, Risk & Privilege, Composure, A-C-T (25 each); a missed injected call 0.",
    items: c => { const best = {}, cf = c.data["case-flow"] || {};
      (c.data.roleplayHistory || []).filter(h => h && h.categoryId === "caseflow" && typeof h.score === "number").forEach(h => {
        const k = h.topicId || h.topicLabel; if(!best[k] || h.score > best[k].score) best[k] = {name: h.topicLabel || k, score: h.score, n: 0}; best[k].n++; });
      const out = Object.values(best).map(b => ({name: b.name, pct: num(b.score), note: `${b.n} call${b.n === 1 ? "" : "s"}`}));
      Object.values(cf.injects || {}).filter(x => x && x.outcome === "missed" && !best["cf-" + x.blockId])
        .forEach(x => out.push({name: `${x.who}: injected call`, pct: 0, note: `Missed · ${fmt(x.at)}`}));
      return out; }},
  {id: "ps", icon: "🧰", label: "Portal Simulators", about: "The best result on each other Training Portal simulator: Medical Records Requests, Court E-Filing, Demand Packets & Binders (the email and calendaring simulators have their own).", dims: ["pc", "na"], how: "The simulator's own grader, reported by the Portal: the best run.",
    items: c => Object.entries((c.sim && c.sim.best) || {}).filter(([k, b]) => simKind(k) === "other" && b && typeof b.score === "number").map(([k, b]) => ({
      name: k, pct: num(b.score), note: `${b.count || 1} run${(b.count || 1) === 1 ? "" : "s"}${b.at ? " · " + fmt(b.at) : ""}`}))},
  {id: "rt", icon: "🎲", label: "Random Tasks", about: "Each random task's grade: timeliness, priorities, the day's lesson, communication and risk. A task not resolved before its timer ended counts 0.", dims: ["pc", "cp"], how: "The AI grade of the resolution; resolved after its window or missed costs timeliness (missed = 0).",
    // (a missed task counts 0, as everywhere else in the course: the day's score, rankings and the Batch Sheet's Score Card)
    items: c => (c.data["task-log"] || []).filter(Boolean).map(e => {
      const missed = e.status === "missed" || ((e.status === "new" || e.status === "progress") && e.expiresAt && Date.now() > Date.parse(e.expiresAt));
      const name = (e.task && (e.task.title || e.task.name)) || (typeof e.task === "string" ? e.task.slice(0, 80) : "Random task");
      if(e.status === "resolved" && typeof e.score === "number") return {name, pct: num(e.score), note: fmt(e.submittedAt || e.resolvedAt || e.id)};
      return missed ? {name, pct: 0, note: "Missed: not resolved before the timer ended"} : null; }).filter(Boolean)},
  {id: "tr", icon: "📐", label: "Trainer Rubric", about: "The trainer's rubric score on each day's sent review: a tier and points in each of the four dimensions (📐 Feedback Rubric).",
    dims: ["pc", "na", "cp", "cd"], how: "The trainer's points out of 100 (25 / 25 / 30 / 20) on the Feedback Rubric's tiers; a critical item marked breached fails the safety gate.",
    items: c => Object.entries(((c.fb || {}).days) || {}).filter(([, v]) => window.cmRubric && cmRubric.counts(v)).map(([d, v]) => { const t = cmRubric.total(v.rubric), x = cmRubric.tierOf(t);
      return t == null ? null : {name: `Day ${dn(d) || d}: the trainer's rubric`, pct: num(t), note: [x && x.label, v.sentBy, fmt(v.sentAt)].filter(Boolean).join(" · ")}; }).filter(Boolean)}
];
// what a Portal simulator's result is: an email simulator, a calendaring simulator, or another
const simKind = k => /e-?mail|repl/i.test(k) ? "email" : /calend|calsim|litigation week/i.test(k) ? "calendar" : "other";
const CX_GROUPS = new Set(["🔎 Exhibit audits", "🎧 Listening Checks", "🧾 Records screening", "⚖️ Judgement calls", "📝 Action Plan"]);
const dn = v => { v = parseInt(v, 10); return v >= 11 && v <= 15 ? v - 10 : v >= 1 && v <= 5 ? v : null; };
function compute(c){
  const rows = SOURCES.map(s => {
    let items = []; try{ items = (s.items(c) || []).filter(x => x && x.pct != null); }catch(e){ items = []; }
    return {s, items, avg: items.length ? Math.round(items.reduce((n, x) => n + x.pct, 0) / items.length) : null};
  });
  const have = rows.filter(r => r.avg != null);
  const overall = have.length ? Math.round(have.reduce((n, r) => n + r.avg, 0) / have.length) : null;
  const done = cfDays().filter(d => (((c.rec.dayProgress || {})[d.id]) || {}).done || (((c.cf.days || {})[d.cf.n]) || {}).passed).length;
  return {rows, overall, systems: have.length, graded: have.reduce((n, r) => n + r.items.length, 0), done, total: cfDays().length};
}
const overallWhy = sc => sc.overall == null ? "Nothing graded yet" : `The average of ${sc.systems} grading system${sc.systems === 1 ? "" : "s"} = ${sc.overall}%`;
const HOW = "Each grading system's score is the average of its graded items; the overall score is the average of the grading systems that have a score, so each one counts the same.";
// a trainee's records as one context (the trainer's table and the trainee's own page read the same)
const ctxOf = (rec, prog, callsim, sim, fb) => ({rec: rec || {}, cf: (rec && rec.caseFlow) || {days: {}}, data: (prog && prog.data) || {}, callsim, sim, fb: fb || {}});

/* ---------- 🏅 The client's 100-point model ----------
   Four dimensions, weighted: Procedural Compliance & Timeliness 25%, Needs Assessment & Risk Identification 25%,
   Care/Action Plan Quality 30%, Communication & Documentation 20%. Every number CM records feeds exactly one dimension
   (the AI's and the calls' sub-scores are split by what they measure), so nothing is counted twice.
   • A day's dimension score D(k,d) = the mean of its evidence groups (each group = the mean of its items that day).
   • The day score S(d) = Σ w(k)·D(k,d) ÷ Σ w(k) over the dimensions with evidence (a day missing one is provisional).
   • Complexity: Day 1 × 1.0 · Days 2–3 × 1.15 · Days 4–5 × 1.3; Final = Σ S(d)·mult(d) ÷ Σ mult(d) over the scored days.
   • The 4-tier rubric: Exemplary 90–100 · Proficient 80–89 · Developing 65–79 · Needs Improvement below 65 (the Feedback Rubric's tiers, js/cm-rubric.js).
   • Pass = Final ≥ 80% AND the safety gate at 100%: every critical item assessed so far met. A breach is
     "Needs Improvement · safety gate" whatever the score.
   The critical items are the ones CM's records can actually tell: UPL in the AI-reviewed takeaway (its Risk score 0 is
   the reviewer's UPL flag), the privilege items and the hard-date items of the exhibit audits, and the trust-money
   Net Sheet stages (the final disbursement and the litigated Net Sheet) balancing on every check.
   Not in the model (shown in the grading-systems table only): the Learning Check composite and the takeaway totals (their
   parts are counted), Skill Builders, the Call Simulator's and the Portal simulators' bests (not tied to a day or a
   dimension yet), and the Skill Scale self-ratings. */
const MODEL = (function(){
  const DIMS = [
    {id: "pc", icon: "⏱", label: "Procedural Compliance & Timeliness", w: 0.25,
      feeds: "each day's Knowledge Check (best score) · CMS filing (100% first time right, then 100% ÷ attempts) · the day's case-folder upload and the Day 1 Backup Drive set-up · timeliness (random tasks resolved inside their window, injected calls answered) · the call protocol (the AI's A-C-T score on graded calls)"},
    {id: "na", icon: "🔍", label: "Needs Assessment & Risk Identification", w: 0.25,
      feeds: "the exhibit audits (each item called right) · Listening Checks · the records screening for the amendment requests · the judgement call on each served email · the AI's Risk score on Skill Activities, takeaways and calls"},
    {id: "cp", icon: "🗺", label: "Care/Action Plan Quality", w: 0.30,
      feeds: "work quality on Skill Activities and takeaways (the AI's Accuracy and Presence) · the trainer's Learning Check score · the Action Plan's required steps · each Net Sheet stage's checks · each resolved random task's grade"},
    {id: "cd", icon: "✉️", label: "Communication & Documentation", w: 0.20,
      feeds: "calls (the AI's BLUF and Composure scores) · emails and requests sent (100% when the first draft is accepted, then 100% ÷ (refused drafts + 1)) · voicemail transcripts (facts caught) · the AI's Efficiency score on Skill Activities and takeaways"}];
  const MULT = {1: 1.0, 2: 1.15, 3: 1.15, 4: 1.3, 5: 1.3};
  // the tiers are the Feedback Rubric's (js/cm-rubric.js), the one rubric every graded piece of work is read in
  const TIERS = ((window.cmRubric && cmRubric.TIERS) || [{min: 90, n: 4, label: "Exemplary", band: "90–100%"}, {min: 80, n: 3, label: "Proficient", band: "80–89%"},
    {min: 65, n: 2, label: "Developing", band: "65–79%"}, {min: 0, n: 1, label: "Needs Improvement", band: "below 65%"}]).map(t => ({min: t.min, n: t.n, label: t.label, band: t.band}));
  const PASS = 80;
  const CRIT = [
    {id: "upl", label: "UPL: no legal advice", how: "The AI review of each day's takeaway (CM Self-Summary) scores Risk 0 when the trainee gives the client legal advice: a 0 is a breach."},
    {id: "priv", label: "Privilege", how: "The exhibit audits' privilege items (a privileged memo, the Master Case Summary, a claim-specific HIPAA authorization, a confidential mediation statement): each must be called right."},
    {id: "date", label: "Hard dates", how: "The exhibit audits' calendar items (a due date, a lien notice's response window): each must be called right."},
    {id: "trust", label: "Trust money", how: "The Net Sheet's trust-money stages (the final disbursement and the litigated Net Sheet): every check must pass."}];
  const tierOf = v => v == null ? null : TIERS.find(t => v >= t.min);
  const mtone = v => v == null ? "" : v >= PASS ? "gs-hi" : v >= 65 ? "gs-mid" : "gs-lo";
  const mean = a => a.length ? a.reduce((n, x) => n + x, 0) / a.length : null;
  let TAUGHT = null;
  const taught = id => {
    if(!TAUGHT){ TAUGHT = {}; (((window.CM_CASE_FLOW || {}).sequence) || []).forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(b => { TAUGHT[b] = sd.n; }))); }
    if(TAUGHT[id]) return TAUGHT[id];
    const m = /^d(\d)/.exec(String(id || "")); return m ? +m[1] : null;
  };
  const modDay = m => taught(m + "-kc");
  // a day id on a record: the DAYS id (11–15) or the Case Flow day (1–5)
  const dn = v => { v = parseInt(v, 10); return v >= 11 && v <= 15 ? v - 10 : v >= 1 && v <= 5 ? v : null; };
  const labDay = e => { const m = /Case Flow Day (\d)/.exec(e.label || ""); return m ? +m[1] : dn(e.dayId); };
  const sentScore = x => x && x.sent ? Math.round(100 / ((x.tries || 0) + 1)) : null;
  const sentNote = x => `Sent${x.tries ? ` after ${x.tries} refused draft${x.tries === 1 ? "" : "s"}` : ", first draft accepted"}`;
  const clean = t => String(t || "").replace(/^Email Simulator — /, "").replace(/\s+/g, " ").trim();

  function evidence(c){
    const items = [], crit = [];
    const add = (dim, group, day, name, pct, note) => { pct = num(pct); if(pct == null || !day) return; items.push({dim, group, day, name, pct, note: note || ""}); };
    const gate = (id, day, name, met, note) => { if(day) crit.push({id, day, name, met: !!met, note: note || ""}); };
    const dp = c.rec.dayProgress || {}, cfd = c.cf.days || {}, data = c.data || {}, R = data["case-flow"] || {};
    const EX = window.CM_CF_EXHIBITS || {}, SIM = window.CM_CF_SIM || {}, DOCS = window.CM_CF_DOCS || [], names = moduleNames();
    const ups = ((data["case-folder"] || {}).uploads) || {};
    // ⏱ Procedural Compliance & Timeliness
    cfDays().forEach(d => { const p = dp[d.id] || {}, s = cfd[d.cf.n] || {}, kc = typeof p.score === "number" ? p.score : s.kc;
      if(typeof kc !== "number") return;
      add("pc", "✍️ Knowledge Check", d.cf.n, `Day ${d.cf.n} Knowledge Check`, kc, kc >= 70 ? "Passed (best score)" : "Below 70%: the day isn't passed yet");
      add("pc", "📂 Case folder & backup", d.cf.n, "The day's case-folder upload", ups[d.id] ? 100 : 0, ups[d.id] ? "Uploaded" : "Not marked uploaded"); });
    const ds = data["drive-setup"]; if(ds && typeof ds.score === "number") add("pc", "📂 Case folder & backup", 1, "Backup Drive set-up", ds.score, `${ds.attempts || 1} attempt${(ds.attempts || 1) === 1 ? "" : "s"}`);
    Object.entries(data["doc-filing"] || {}).forEach(([id, r]) => { if(!r || !(r.attempts > 0)) return; const doc = DOCS.find(x => x.id === id) || {};
      add("pc", "🗂 CMS filing", doc.day, doc.title || r.name || id, r.filed ? 100 / r.attempts : 0, r.filed ? (r.attempts === 1 ? "Filed first time right" : `Filed in ${r.attempts} attempts`) : "Not filed yet"); });
    (data["task-log"] || []).forEach(e => { if(!e) return; const day = dn(e.dayId), name = (e.task && (e.task.title || e.task.name)) || (typeof e.task === "string" ? e.task.slice(0, 70) : "Random task");
      const late = e.expiresAt && Date.now() > new Date(e.expiresAt).getTime();
      if(e.status === "resolved"){ const onTime = !e.expiresAt || !e.submittedAt || e.submittedAt <= e.expiresAt;
        add("pc", "⏰ Timeliness", day, name, onTime ? 100 : 50, onTime ? "Resolved inside its window" : "Resolved after its window closed");
        if(typeof e.score === "number") add("cp", "🎲 Random task plan", day, name, e.score, e.tier || "Graded"); }
      else if(e.status === "missed" || ((e.status === "new" || e.status === "progress") && late)) add("pc", "⏰ Timeliness", day, name, 0, "Missed: the window closed"); });
    Object.values(R.injects || {}).forEach(x => { if(!x || !x.outcome) return;
      add("pc", "⏰ Timeliness", dn(x.dayId) || taught(x.blockId), `${x.who || "Injected"} call`, x.outcome === "answered" ? 100 : 0, x.outcome === "answered" ? "Injected call answered" : "Injected call missed"); });
    // the work log: the AI's sub-scores, split by what they measure (the latest of each activity)
    const latest = {}; (data["work-log"] || []).forEach(e => { if(!e || (e.kind !== "lab" && e.kind !== "roleplay")) return; const k = e.kind + "|" + (e.label || e.toolId || "");
      if(!latest[k] || String(e.at || "") >= String(latest[k].at || "")) latest[k] = e; });
    Object.values(latest).forEach(e => { const day = labDay(e), s = e.subs || {}, name = String(e.label || "Activity").replace(/^Day \d+ · /, "");
      if(e.kind === "lab"){
        if(typeof s.accuracy === "number" && typeof s.presence === "number") add("cp", "🧪 Work quality", day, name, (s.accuracy * 35 + s.presence * 30) / 65, "The AI's Accuracy and Presence");
        else if(typeof e.score === "number") add("cp", "🧪 Work quality", day, name, e.score, "The AI review's total");
        if(typeof s.risk === "number") add("na", "⚠️ Risk identification", day, name, s.risk, "The AI's Risk score");
        if(typeof s.efficiency === "number") add("cd", "🗒 Documentation", day, name, s.efficiency, "The AI's Efficiency score");
        if(/Self-Summary/.test(e.label || "") && typeof s.risk === "number")
          gate("upl", day, name, s.risk > 0, s.risk > 0 ? "No legal advice found" : "Breach: the AI review scored Risk 0 (legal advice to the client)");
      } else {
        if(typeof s.act === "number") add("pc", "📞 Call protocol", day, name, s.act, "The AI's A-C-T score");
        if(typeof s.risk === "number") add("na", "⚠️ Risk identification", day, name, s.risk, "The AI's Risk & Privilege score");
        if(typeof s.bluf === "number" && typeof s.composure === "number") add("cd", "📞 Calls", day, name, (s.bluf + s.composure) / 2, "The AI's BLUF and Composure");
      } });
    // 🔍 Needs Assessment: the exhibit audits handed in (their privilege and calendar items are critical)
    Object.entries(R.audits || {}).forEach(([b, r]) => { const a = (EX.audits || {})[b]; if(!a || !r || !r.at || !Array.isArray(a.items)) return;
      const marks = r.marks || [], right = a.items.filter((it, i) => marks[i] === it.verdict).length, day = taught(b);
      add("na", "🔎 Exhibit audits", day, a.title || b, 100 * right / a.items.length, `${right} of ${a.items.length} items called right`);
      a.items.forEach((it, i) => { if(it.kind !== "privilege" && it.kind !== "calendar") return; const ok = marks[i] === it.verdict;
        gate(it.kind === "privilege" ? "priv" : "date", day, `${a.title || b} · ${it.ref ? it.ref + ": " : ""}${it.what || "item " + (i + 1)}`, ok, ok ? `Called right (${it.verdict})` : `Breach: called "${marks[i] || "nothing"}", should be "${it.verdict}"`); }); });
    Object.entries(R.listen || {}).forEach(([b, r]) => { const e = (SIM.events || {})[b]; if(!r || !r.at || !e || !e.listen || !e.listen.length) return;
      add("na", "🎧 Listening Checks", taught(b), `Listening Check (${b})`, 100 * (r.score || 0) / e.listen.length, `${r.score || 0} of ${e.listen.length} caught`); });
    Object.entries(R.amend || {}).forEach(([b, r]) => { const a = (EX.amendments || {})[b]; if(!a || !r) return; const day = taught(b);
      if(r.screened && Array.isArray(a.screen) && a.screen.length){ const asked = new Set((a.requests || []).map(q => q.doc));
        const ok = a.screen.filter(s => ((r.marks || {})[s.doc] === "fix") === asked.has(s.doc)).length;
        add("na", "🧾 Records screening", day, a.title || b, 100 * ok / a.screen.length, `${ok} of ${a.screen.length} records called right`); }
      Object.entries(r.req || {}).forEach(([doc, x]) => { const v = sentScore(x); if(v != null) add("cd", "✉️ Written communication", day, `Amendment request: ${doc}`, v, sentNote(x)); }); });
    Object.entries(R.service || {}).forEach(([b, r]) => { const e = (EX.emails || {})[b]; if(!e || !r) return; const day = taught(b), title = clean(e.title) || b;
      if(r.choice != null && e.press && e.press.choices && e.press.choices[r.choice]) add("na", "⚖️ Judgement calls", day, title, e.press.choices[r.choice].ok ? 100 : 0, e.press.choices[r.choice].ok ? "The right call" : "A call that costs the file");
      const v = sentScore(r); if(v != null) add("cd", "✉️ Written communication", day, title, v, sentNote(r)); });
    Object.entries(R.notes || {}).forEach(([b, r]) => { const n = (EX.notes || {})[b]; if(!n || !r) return; const day = taught(b);
      const facts = ((n.transcribe || {}).facts || []).length, req = ((n.plan || {}).required || []).length;
      if(r.txAt && facts) add("cd", "🗒 Documentation", day, "Voicemail transcript", typeof r.txScore === "number" ? r.txScore : 100 * (r.txGot || []).filter(Boolean).length / facts,
        `${(r.txGot || []).filter(Boolean).length} of ${facts} facts caught${(r.txTries || []).length ? ` · ${r.txTries[r.txTries.length - 1].acc}% word accuracy · ${r.txTries.length} graded attempt${r.txTries.length === 1 ? "" : "s"}` : ""}`);
      if(r.planAt && req) add("cp", "📝 Action Plan", day, n.title || "Action Plan", 100 * (r.planGot || []).filter(Boolean).length / req, `${(r.planGot || []).filter(Boolean).length} of ${req} required steps`);
      (n.emails || []).forEach(e => { const v = sentScore((r.mails || {})[e.id]); if(v != null) add("cd", "✉️ Written communication", day, clean(e.title), v, sentNote(r.mails[e.id])); }); });
    // 🗺 the trainer's Learning Check score (feedback:<id>, trainer-owned: the trainee cannot change it)
    Object.entries((c.fb && c.fb.caseFlow) || {}).forEach(([m, x]) => { if(!x || typeof x.score !== "number") return;
      add("cp", "🧑‍🏫 Trainer's Learning Check", modDay(m), (names[m] && names[m].title) || m, x.score, x.comment ? String(x.comment).slice(0, 160) : "Scored by the trainer"); });
    // 🗂 the CMS case file (js/cm-cms-file.js): the Check Your Work items of each CMS activity worked, by area, in the
    // dimension the area belongs to. Its documents are the 🗂 CMS filing above already, and an activity never worked is
    // the file grade's own (🗂 CMS Case File), so neither is counted twice here.
    try{ if(window.cmCmsFile) cmCmsFile.compute(c).days.forEach(x => x.areas.forEach(a => { if(a.a.id === "docs" || a.a.id === "open") return;
      const its = a.items.filter(i => i.pct != null && !i.unworked); if(!its.length) return;
      add(a.a.dim, "🗂 CMS case file", x.n, `CMS file: ${a.a.label}`, mean(its.map(i => i.pct)), `${its.filter(i => i.pct === 100).length} of ${its.length} Check Your Work items in the file`); })); }catch(e){}
    // 📐 the trainer's rubric on a sent day review (feedback:<id>, trainer-owned): its points per dimension, its critical items
    Object.entries((c.fb && c.fb.days) || {}).forEach(([d, v]) => { if(!(window.cmRubric && cmRubric.counts(v))) return; const day = dn(d), rb = v.rubric;
      cmRubric.DIMS.forEach(k => { const x = rb.dims[k.id]; if(x && typeof x.pts === "number") add(k.id, "📐 Trainer rubric", day, `Trainer's rubric: ${k.label}`, 100 * Math.min(k.pts, x.pts) / k.pts, `${x.pts} of ${k.pts} points · ${cmRubric.tierOf(100 * x.pts / k.pts).label}`); });
      Object.entries(rb.crit || {}).forEach(([id, m]) => { if(m === "met" || m === "breach") gate(id, day, `Trainer's review, Day ${day}`, m === "met", m === "met" ? "Marked met by the trainer" : "Breach: marked by the trainer on the day's review"); }); });
    const NSD = {recovery: 3, bi: 3, um: 3, liens: 4, final: 4, litigation: 5};
    Object.values(((data["net-sheet"] || {}).files) || {}).forEach(f => Object.entries((f && f.checks) || {}).forEach(([st, k]) => { if(!k || !k.total) return;
      add("cp", "📊 Net Sheet", NSD[st] || null, NS_STAGES[st] || st, 100 * k.passed / k.total, `${k.passed} of ${k.total} checks`);
      if(st === "final" || st === "litigation") gate("trust", NSD[st], NS_STAGES[st] || st, k.passed === k.total, k.passed === k.total ? "Every check passed" : `Breach: ${k.total - k.passed} check${k.total - k.passed === 1 ? "" : "s"} failed`); }));
    return {items, crit};
  }
  // Daily compliance: each day reached, its three deliverables (Knowledge Check passed, takeaways graded, case folder uploaded)
  function dayComp(c, d){
    const p = (c.rec.dayProgress || {})[d.id] || {}, s = (c.cf.days || {})[d.cf.n] || {}, ups = ((c.data["case-folder"] || {}).uploads) || {};
    if(!(typeof p.score === "number" || p.done || typeof s.kc === "number" || ups[d.id])) return null;
    const tk = typeof p.takeaway === "number" || typeof s.takeaway === "number";
    const parts = [{label: "✍️ Knowledge Check passed", v: p.done || s.passed ? 100 : 0}, {label: "📝 Takeaways AI-graded", v: tk ? 100 : 0}, {label: "📂 Case folder uploaded", v: ups[d.id] ? 100 : 0}];
    return {pct: Math.round(mean(parts.map(x => x.v))), parts};
  }
  function compute(c){
    const ev = evidence(c);
    const days = cfDays().map(d => { const n = d.cf.n, its = ev.items.filter(x => x.day === n);
      const dims = DIMS.map(k => { const xs = its.filter(x => x.dim === k.id), groups = [];
        xs.forEach(x => { let g = groups.find(g => g.name === x.group); if(!g) groups.push(g = {name: x.group, items: []}); g.items.push(x); });
        groups.forEach(g => { g.v = Math.round(mean(g.items.map(x => x.pct))); });
        return {k, groups, v: groups.length ? Math.round(mean(groups.map(g => g.v))) : null}; });
      const have = dims.filter(x => x.v != null), ws = have.reduce((n, x) => n + x.k.w, 0);
      return {d, n, mult: MULT[n] || 1, dims, S: have.length ? Math.round(have.reduce((t, x) => t + x.k.w * x.v, 0) / ws) : null, provisional: have.length > 0 && have.length < DIMS.length,
        crit: ev.crit.filter(x => x.day === n), comp: dayComp(c, d)}; });
    const scored = days.filter(x => x.S != null), msum = scored.reduce((t, x) => t + x.mult, 0);
    const final = scored.length ? Math.round(scored.reduce((t, x) => t + x.S * x.mult, 0) / msum) : null;
    const dimv = DIMS.map((k, i) => { const ds = days.filter(x => x.dims[i].v != null), m = ds.reduce((t, x) => t + x.mult, 0);
      return {k, v: ds.length ? Math.round(ds.reduce((t, x) => t + x.dims[i].v * x.mult, 0) / m) : null, days: ds.length}; });
    const breaches = ev.crit.filter(x => !x.met), gate = {total: ev.crit.length, met: ev.crit.length - breaches.length, breaches, items: ev.crit,
      pct: ev.crit.length ? Math.round(100 * (ev.crit.length - breaches.length) / ev.crit.length) : null};
    const cv = days.map(x => x.comp).filter(Boolean).map(x => x.pct), comp = cv.length ? Math.round(mean(cv)) : null;
    const both = [final, comp].filter(v => v != null), overall = both.length ? Math.round(mean(both)) : null;
    const tier = breaches.length ? TIERS[3] : tierOf(final);
    const status = final == null ? "none" : breaches.length ? "gate" : final < PASS ? "below" : gate.total ? "pass" : "pending";
    return {items: ev.items, days, scored, final, msum, dims: dimv, gate, comp, compDays: cv.length, overall, tier, status, pass: status === "pass"};
  }
  const STATUS = {none: "Not scored yet", gate: "⛔ Safety gate breached", below: "Not yet: below 80%", pass: "✓ PASS", pending: "Pass pending: no critical item assessed yet"};
  return {DIMS, MULT, TIERS, PASS, CRIT, STATUS, compute, evidence, tierOf, mtone};
})();

/* ---------- the sheets, in Foundational's Batch Sheet format (its js/ft-batch-sheet.js and js/ft-overall.js): Google
   Sheets' look — column letters, row numbers, the first column frozen, each cell's working in its hover — so a scorecard
   reads the same in every LSH course ---------- */
const letter = i => { let t = ""; i++; while(i > 0){ const m = (i - 1) % 26; t = String.fromCharCode(65 + m) + t; i = Math.floor((i - 1) / 26); } return t; };
const tone = p => p == null ? "" : p >= 85 ? "gs-hi" : p >= 70 ? "gs-mid" : "gs-lo";
const pcell = (p, f, extra) => ({v: pctTxt(p) === "—" ? "" : pctTxt(p), f, cls: "gs-num " + tone(p) + (extra ? " " + extra : "")});
function sheetHtml(T){
  const n = T.head.length;
  return `<section class="bs-sec" id="scx-${T.id}"><h3 class="bs-h">${E(T.title)} <span>${T.rows.length} row${T.rows.length === 1 ? "" : "s"}</span></h3>${T.note ? `<p class="bs-note">${E(T.note)}</p>` : ""}
    <div class="gs-wrap"><table class="gs" role="grid"><thead>
      <tr class="gs-letters"><th class="gs-corner"></th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${letter(i)}</th>`).join("")}</tr>
      <tr class="gs-head"><th class="gs-rn">1</th>${T.head.map((h, i) => `<th class="${i === 0 ? "gs-frz" : ""}">${E(h)}</th>`).join("")}</tr></thead>
      <tbody>${T.rows.map((r, ri) => `<tr${T.rowCls && T.rowCls[ri] ? ` class="${T.rowCls[ri]}"` : ""}${T.onRow && T.onRow[ri] ? ` onclick="${T.onRow[ri]}"` : ""}><th class="gs-rn">${ri + 2}</th>${r.map((c, ci) => `<td tabindex="0" class="${c.cls || ""}${ci === 0 ? " gs-frz" : ""}"${c.f ? ` title="${E(c.f)}"` : ""}>${E(c.v)}</td>`).join("")}</tr>`).join("")}
      ${T.rows.length ? "" : `<tr class="gs-empty"><th class="gs-rn">2</th><td colspan="${n}" class="bs-none">${E(T.empty || "Nothing yet.")}</td></tr>`}</tbody></table></div></section>`;
}
// 🏅 Scores: a row per trainee: the 100-point model (its four dimensions, the Final, the tier, the safety gate and the
// result), the Daily compliance and the Overall, then each grading system (blank: nothing graded yet) and their average
function scoresSheet(rows, me){
  const mc = (v, f, extra) => ({v: v == null ? "" : v + "%", f, cls: "gs-num " + MODEL.mtone(v) + (extra ? " " + extra : "")});
  return {id: "scores", title: "🏅 Scores",
    note: me ? "Your 100-point model scores, then every grade the course gives you averaged per grading system (blank: nothing graded yet)."
      : "Each trainee's 100-point model (the four dimensions, the Final, the tier and the safety gate), the Daily compliance and the Overall, then every grading system's average (blank: nothing graded yet). Click a trainee for their card.",
    head: ["Trainee"].concat(me ? [] : ["Batch"], ["Days passed"], MODEL.DIMS.map(k => `${k.icon} ${k.label} (${Math.round(k.w * 100)}%)`),
      ["Final %", "Tier", "Safety gate", "Result", "Daily compliance %", "Overall %"], SOURCES.map(s => `${s.icon} ${s.label}`), ["Grading systems average %"]),
    rows: rows.map(r => { const m = r.m, g = m.gate;
      return [{v: r.name, f: r.name, cls: "gs-name"}].concat(me ? [] : [{v: batchOf(r.batch), f: r.batch, cls: "gs-batch"}],
      [{v: `${r.sc.done} / ${r.sc.total}`, f: `${r.sc.done} of the ${r.sc.total} Case Flow days passed (70% passes a day)`, cls: "gs-num"}],
      m.dims.map(x => mc(x.v, x.v == null ? `${x.k.label}: nothing scored yet` : `${x.k.label}: ${x.v}% across ${x.days} day${x.days === 1 ? "" : "s"}, weighted by complexity`)),
      [mc(m.final, m.final == null ? "Nothing scored yet" : `Final = Σ(day score × multiplier) ÷ Σ multipliers = ${m.final}%`, "gs-calc gs-bold"),
       {v: m.tier ? `${m.tier.n} ${m.tier.label}` : "", f: m.tier ? `${m.tier.label} (${m.tier.band})${g.breaches.length ? ": a safety-gate breach" : ""}` : "Not scored yet", cls: "gs-txt0"},
       {v: g.total ? (g.breaches.length ? `${g.met} / ${g.total}` : "100%") : "", csv: g.total ? `${g.met}/${g.total}` : "", f: g.total ? `${g.met} of ${g.total} critical items met` : "No critical item assessed yet", cls: "gs-num " + (g.total ? (g.breaches.length ? "gs-lo" : "gs-hi") : "")},
       {v: MODEL.STATUS[m.status], f: `Pass = Final ≥ ${MODEL.PASS}% and the safety gate at 100%`, cls: m.status === "pass" ? "gs-hi" : m.status === "none" ? "" : m.status === "pending" ? "gs-mid" : "gs-lo"},
       mc(m.comp, m.comp == null ? "No day reached yet" : `The average of ${m.compDays} day${m.compDays === 1 ? "" : "s"}' compliance = ${m.comp}%`),
       mc(m.overall, m.overall == null ? "Nothing scored yet" : `The average of the Final and the Daily compliance = ${m.overall}%`, "gs-calc gs-bold")],
      r.sc.rows.map(x => pcell(x.avg, x.avg == null ? `${x.s.label}: nothing graded yet` : `${x.s.label}: average of ${x.items.length} grade${x.items.length === 1 ? "" : "s"} = ${x.avg}%`)),
      [pcell(r.sc.overall, r.sc.overall == null ? "Nothing graded yet" : overallWhy(r.sc), "gs-calc")]); }),
    rowCls: rows.map(r => !me && ALL.pick === r.id ? "gs-picked" : ""),
    onRow: me ? null : rows.map(r => `cmScorecard.pick('${E(r.id)}')`),
    empty: me ? "Collecting your grades…" : "No approved trainee in this batch yet."};
}
// 🔎 Grades in detail: every graded item, by grading system (the system's own row carries its average)
function detailSheet(sc, who){
  const rows = [], cls = [];
  sc.rows.forEach(r => {
    rows.push([{v: `${r.s.icon} ${r.s.label}`, f: r.s.about, cls: "gs-name"}, {v: r.s.about, f: r.s.about, cls: "gs-txt"}, {v: "", f: `${r.items.length} graded item${r.items.length === 1 ? "" : "s"}`}, pcell(r.avg, r.avg == null ? "Nothing graded yet" : `The average of ${r.items.length} = ${r.avg}%`, "gs-calc gs-bold")]); cls.push("gs-sys");
    r.items.forEach(x => { rows.push([{v: "", f: r.s.label}, {v: x.name, f: x.name, cls: "gs-txt"}, {v: x.note || "", f: x.note || "", cls: "gs-txt gs-det"}, pcell(x.pct, `${x.name}: ${pctTxt(x.pct)}${x.auto ? " (automated only)" : ""}`)]); cls.push(""); });
  });
  rows.push([{v: "Overall", f: overallWhy(sc), cls: "gs-name"}, {v: overallWhy(sc), f: overallWhy(sc), cls: "gs-txt"}, {v: `${sc.graded} graded item${sc.graded === 1 ? "" : "s"}`, f: `${sc.graded} graded items`, cls: "gs-det"}, pcell(sc.overall, overallWhy(sc), "gs-calc gs-bold")]); cls.push("gs-total");
  return {id: "detail", title: `🔎 Grades in detail${who ? ": " + who : ""}`, note: "Each grading system's row has its average; its graded items are under it.",
    head: ["Grading system", "Item", "Detail", "Score"], rows, rowCls: cls};
}
// the page's header, as Foundational's (ftBanner): a navy band, the kicker, the title, the batch, the sheet's buttons in it
function sheetTop(title, sub, controls, right){
  return `<div class="ft-banner scx-banner"><div><p class="ft-banner-k">Legal Support Help · Case Management Training</p><h2>🏅 ${E(title)}</h2>${sub ? `<p class="ft-banner-sub">${sub}</p>` : ""}</div>
    ${right ? `<div class="ft-banner-right">${right}</div>` : ""}<div class="ft-banner-ctl"><span class="gs-menu">${controls}</span></div></div>`;
}

/* ---------- the trainee card, in Foundational Training's batch-sheet format (its js/ft-batch-sheet.js perTraineeHtml), the
   standard format for all scorecards: the name and the pills (Overall · Scorecard · Daily compliance) in a navy band, the
   🎯 Focus on box, then tables of label · value · how. Here: the 100-point model, the Day scores (each day's evidence
   by dimension, its Daily compliance and its critical items), and the grading systems behind it under a toggle. ---------- */
const domId = id => String(id || "").replace(/[^A-Za-z0-9_-]/g, "_");
const mpct = v => v == null ? "—" : v + "%";
const mx = v => Number.isInteger(v) ? v.toFixed(1) : String(v);   // a day multiplier as the client writes it: 1.0, 1.15, 1.3
function partsTable(ps){
  let g = null, h = "";
  ps.forEach(p => {
    if(p.group !== g){ g = p.group; h += `<tr class="bs-parts-g${p.top ? " bs-parts-top" : ""}"><th colspan="3">${E(g)}${p.groupV != null ? ` <span class="bs-parts-gv">${E(p.groupV)}</span>` : ""}</th></tr>`; }
    if(p.name == null) return;
    h += `<tr${p.crit ? ` class="bs-parts-c"` : ""}><td class="bs-parts-n">${E(p.name)}</td><td class="bs-parts-v"><b class="bs-sbox ${p.tone || ""}">${E(p.v)}</b></td><td class="bs-parts-t">${E(p.text || "")}</td></tr>`;
  });
  return h ? `<table class="bs-parts"><tbody>${h}</tbody></table>` : "";
}
function focusHtml(m){
  const P = MODEL.PASS, clip = (t, n) => (t = String(t || "").replace(/\s+/g, " ").trim()).length > n ? t.slice(0, n - 1) + "…" : t;
  const dimOf = id => MODEL.DIMS.find(k => k.id === id);
  const li = x => `<li><b>${E(clip(x.name, 90))}</b> <span class="bs-in-s">Day ${x.day} · ${E(dimOf(x.dim).label)} · ${x.pct}%</span>${x.note ? ` — ${E(clip(x.note, 180))}` : ""}</li>`;
  const gate = m.gate.breaches.map(x => `<li><b>⛔ ${E(clip(x.name, 110))}</b> <span class="bs-in-s">Day ${x.day} · critical item · ${E((MODEL.CRIT.find(k => k.id === x.id) || {}).label || "")}</span> — ${E(clip(x.note, 180))}</li>`);
  if(!m.items.length && !gate.length) return "";
  const low = m.items.filter(x => x.pct < P).sort((a, b) => a.pct - b.pct), up = m.items.filter(x => x.pct >= P && x.pct < 90).sort((a, b) => a.pct - b.pct);
  if(gate.length || low.length) return `<div class="bs-in bs-in-lo"><b>🎯 Focus on</b> (below the pass mark of ${P}%${gate.length ? ", and every safety-gate breach" : ""}):<ul>${gate.slice(0, 4).join("")}${low.slice(0, 4).map(li).join("")}</ul>${low.length > 4 ? `<small>and ${low.length - 4} more below ${P}% in the Day scores.</small>` : ""}</div>`;
  if(up.length) return `<div class="bs-in bs-in-ok"><b>✓ Above the pass mark on every score.</b> To move up to Exemplary (90%+):<ul>${up.slice(0, 3).map(li).join("")}</ul></div>`;
  return `<div class="bs-in bs-in-hi"><b>🎉 Exemplary:</b> every score so far is 90% or more (${m.items.length} scored). Keep it up!</div>`;
}
function modelTable(m){
  const T = MODEL.TIERS, row = (label, v, tone, how, cls) => `<tr${cls ? ` class="${cls}"` : ""}><td class="bs-pt-m">${label}</td><td class="bs-pt-v ${tone}">${v}</td><td class="bs-pt-f">${how}</td></tr>`;
  const g = m.gate, gv = g.total ? (g.breaches.length ? `${g.met} / ${g.total}` : "100%") : "—";
  const crit = MODEL.CRIT.map(k => { const xs = g.items.filter(x => x.id === k.id), bad = xs.filter(x => !x.met).length;
    return `<li><b>${E(k.label)}</b> <span class="bs-in-s">${xs.length ? (bad ? `${bad} breach${bad === 1 ? "" : "es"} of ${xs.length}` : `${xs.length} met`) : "not assessed yet"}</span> — ${E(k.how)}</li>`; }).join("");
  const days = m.scored.map(x => `Day ${x.n} ${x.S}% × ${mx(x.mult)}`).join(" + ");
  return `<table class="bs-pt-t bs-pt-s-model"><colgroup><col class="bs-pt-c1"><col class="bs-pt-c2"><col></colgroup><tbody>
    <tr class="bs-pt-sec"><th colspan="3">🏅 The 100-point model</th></tr>
    ${m.dims.map(x => row(`${x.k.icon} ${E(x.k.label)} <span class="bs-pt-w">${Math.round(x.k.w * 100)}%</span>`, mpct(x.v), MODEL.mtone(x.v),
      `<span class="bs-pt-feeds"><b>What feeds it:</b> ${E(x.k.feeds)}.</span>${x.v == null ? " Nothing scored yet." : ` Weighted across ${x.days} day${x.days === 1 ? "" : "s"} by complexity.`}`)).join("")}
    ${row("⛔ Safety gate", gv, g.total ? (g.breaches.length ? "gs-lo" : "gs-hi") : "gs-na",
      `100% is required on the critical items: <ul class="bs-pt-ul">${crit}</ul>`)}
    ${row("Final", mpct(m.final), MODEL.mtone(m.final),
      m.final == null ? "Nothing scored yet." : `Final = Σ(day score × multiplier) ÷ Σ multipliers = (${E(days)}) ÷ ${Math.round(m.msum * 100) / 100} = <b>${m.final}%</b>. Each day score is Σ(weight × dimension) over the dimensions with evidence that day. Complexity: Day 1 × 1.0 · Days 2–3 × 1.15 · Days 4–5 × 1.3.`, "bs-pt-final")}
    ${row("Tier &amp; result", m.tier ? `${m.tier.n} · ${E(m.tier.label)}` : "—", m.status === "pass" ? "gs-hi" : m.status === "none" ? "gs-na" : m.status === "pending" ? "gs-mid" : "gs-lo",
      `<b>${E(MODEL.STATUS[m.status])}.</b> Pass = Final ≥ ${MODEL.PASS}% and the safety gate at 100%. The rubric: ${T.map(t => `<b>${t.n} ${E(t.label)}</b> ${E(t.band)}`).join(" · ")}; a safety-gate breach is Needs Improvement whatever the score.`)}
  </tbody></table>`;
}
function daysTable(m){
  const rows = m.days.map(x => {
    const parts = [];
    if(x.comp) x.comp.parts.forEach(p => parts.push({group: "✅ Daily compliance", groupV: x.comp.pct + "%", top: true, name: p.label, v: p.v ? "Done" : "Not yet", tone: p.v ? "gs-hi" : "gs-lo"}));
    x.dims.forEach(dm => { if(dm.v == null) return;
      parts.push({group: `${dm.k.icon} ${dm.k.label} · ${Math.round(dm.k.w * 100)}%`, groupV: dm.v + "%", top: true});
      dm.groups.forEach(gr => gr.items.forEach(it => parts.push({group: gr.name, groupV: gr.v + "%", name: it.name, v: it.pct + "%", tone: MODEL.mtone(it.pct), text: it.note}))); });
    if(x.crit.length) x.crit.forEach(cr => parts.push({group: "⛔ Safety gate: critical items", top: true, crit: true, name: cr.name, v: cr.met ? "Met" : "Breach", tone: cr.met ? "gs-hi" : "gs-lo", text: cr.note}));
    const label = `${E(dayName(x.d))}<small class="bs-pt-mult">× ${mx(x.mult)} complexity${x.provisional ? " · provisional: not every dimension has evidence yet" : ""}</small>`;
    return `<tr><td class="bs-pt-m">${label}</td><td class="bs-pt-v ${MODEL.mtone(x.S)}">${x.S == null ? "—" : x.S + "%"}</td><td class="bs-pt-f">${partsTable(parts) || `<span class="bs-none">Nothing scored on this day yet.</span>`}</td></tr>`; }).join("");
  return `<table class="bs-pt-t bs-pt-s-days"><colgroup><col class="bs-pt-c1"><col class="bs-pt-c2"><col></colgroup><tbody>
    <tr class="bs-pt-sec"><th colspan="3">📅 Day scores</th></tr>
    <tr><td class="bs-pt-m">Final</td><td class="bs-pt-v ${MODEL.mtone(m.final)}">${mpct(m.final)}</td><td class="bs-pt-f">${m.scored.length ? `The ${m.scored.length} scored day${m.scored.length === 1 ? "" : "s"}, weighted by complexity` : "No day scored yet"}${m.comp != null ? ` · Daily compliance ${m.comp}% over ${m.compDays} day${m.compDays === 1 ? "" : "s"} reached` : ""}</td></tr>
    ${rows}</tbody></table>`;
}
/* 📐 the rubric profile: every grading system's average, in the dimensions it feeds (SOURCES dims, the 📐 Feedback Rubric's
   map), so each dimension reads all of the trainee's graded work, automated and the trainer's */
function profile(sc){
  return MODEL.DIMS.map(k => { const from = sc.rows.filter(x => x.avg != null && (x.s.dims || []).includes(k.id));
    return {k, from, v: from.length ? Math.round(from.reduce((n, x) => n + x.avg, 0) / from.length) : null}; });
}
function profileTable(sc){
  const P = profile(sc);
  return `<table class="bs-pt-t bs-pt-s-profile"><colgroup><col class="bs-pt-c1"><col class="bs-pt-c2"><col></colgroup><tbody>
    <tr class="bs-pt-sec"><th colspan="3">📐 Rubric profile: every grading system, by dimension</th></tr>
    ${P.map(x => { const t = MODEL.tierOf(x.v);
      return `<tr><td class="bs-pt-m">${x.k.icon} ${E(x.k.label)}</td><td class="bs-pt-v ${MODEL.mtone(x.v)}">${mpct(x.v)}${t ? `<small class="bs-pt-tier">${E(t.label)}</small>` : ""}</td>
        <td class="bs-pt-f">${x.from.length ? `The average of ${x.from.length} grading system${x.from.length === 1 ? "" : "s"}: ${x.from.map(f => `${f.s.icon} ${E(f.s.label)} <b>${f.avg}%</b>`).join(" · ")}` : "No grading system that feeds it has a score yet."}</td></tr>`; }).join("")}
    <tr><td colspan="3" class="bs-pt-f"><a href="#" onclick="cmRubric.open();return false" class="bs-pt-rlink">📐 Open the Feedback Rubric</a>: the tiers, each dimension's descriptors, the critical items and which grading system feeds which dimension.</td></tr>
  </tbody></table>`;
}
function cardHtml(r, me){
  const m = r.m, why = {
    overall: m.overall == null ? "Nothing scored yet" : `Overall = the average of the Scorecard ${mpct(m.final)} and the Daily compliance ${mpct(m.comp)} = ${m.overall}%`,
    final: m.final == null ? "Nothing scored yet" : `Scorecard = the 100-point model's Final: the four dimensions (25/25/30/20) per day, weighted by complexity = ${m.final}%`,
    comp: m.comp == null ? "No day reached yet" : `The average of ${m.compDays} day${m.compDays === 1 ? "" : "s"}' compliance (Knowledge Check passed, takeaways graded, case folder uploaded) = ${m.comp}%`};
  const pills = [["Overall", m.overall, why.overall], ["Scorecard", m.final, why.final], ["Daily compliance", m.comp, why.comp]];
  const rtone = m.status === "pass" ? "gs-hi" : m.status === "pending" ? "gs-mid" : m.status === "none" ? "" : "gs-lo";
  return `<div class="bs-pt${!me && ALL.pick === r.id ? " bs-pt-on" : ""}" id="bs-pt-${domId(r.id)}" data-id="${E(r.id)}">
    <div class="bs-pt-h"><b>${E(r.name)}</b>${!me && r.batch ? `<i>${E(batchOf(r.batch))}</i>` : ""}
      ${pills.map(([l, v, f]) => `<span class="bs-pt-k ${MODEL.mtone(v)}" title="${E(f)}">${E(l)} <b>${mpct(v)}</b></span>`).join("")}
      <span class="bs-pt-k bs-pt-r ${rtone}" title="Pass = Final ≥ ${MODEL.PASS}% and the safety gate at 100%">${m.tier ? E(m.tier.label) + " · " : ""}<b>${E(MODEL.STATUS[m.status])}</b></span></div>
    ${focusHtml(m)}
    <div class="bs-pt-wrap">${modelTable(m)}${window.cmCmsFile ? cmCmsFile.html(cmCmsFile.compute(r.c), me) : ""}${window.cmRubric ? profileTable(r.sc) : ""}${daysTable(m)}
      <details class="bs-pt-src"><summary>▸ The grading systems behind it (every graded item, as recorded)</summary>${sheetHtml(Object.assign(detailSheet(r.sc, me ? "" : r.name), {id: "detail-" + domId(r.id)}))}</details>
    </div></div>`;
}
const HOW_MODEL = `How the score is worked out: the client's 100-point model. Four dimensions — Procedural Compliance & Timeliness 25%, Needs Assessment & Risk Identification 25%, Care/Action Plan Quality 30%, Communication & Documentation 20% — scored per Case Flow day from the work CM records (each number feeds one dimension), then weighted by the day's complexity (Day 1 × 1.0, Days 2–3 × 1.15, Days 4–5 × 1.3): Final = Σ(day score × multiplier) ÷ Σ multipliers. Tiers: Exemplary 90–100 · Proficient 80–89 · Developing 65–79 · Needs Improvement below 65 (the 📐 Feedback Rubric's tiers). Pass = Final ≥ 80% and 100% on the safety gate's critical items (UPL in the takeaway, the audits' privilege and hard-date items, the trust-money Net Sheet stages). Overall = the average of the Scorecard (Final) and the Daily compliance. Not in the model: Skill Builders, the Call Simulator and Portal simulator bests, the Learning Check composites and takeaway totals (their parts are counted), and the self-ratings.`;

/* ---------- 🏅 My Performance: the trainee's own card ---------- */
const MINE = {id: null, at: 0, loading: null, recs: null};
function loadMine(force){
  if(!isTrainee() || MINE.loading) return;
  const id = state.traineeId;
  if(!force && MINE.id === id && Date.now() - MINE.at < 60000) return;
  MINE.at = Date.now();
  MINE.loading = sharedGetMany(["trainee:" + id, "progress:" + id, "callsim:" + id, "simresults:" + id, "feedback:" + id]).then(v => { if(state.traineeId === id){ MINE.id = id; MINE.recs = v || []; } })
    .catch(() => {}).then(() => { MINE.loading = null; if(state.view === "scorecard" && typeof render === "function") render(); });
}
function myCtx(){
  const [rec, prog, callsim, sim, fb] = MINE.recs || [];
  const c = ctxOf(rec, prog, callsim, sim, fb);
  // what's on this device is the freshest: the live summary, the day progress, the practice bests and the logs
  try{ if(window.cmCaseFlow && cmCaseFlow.scoreSummary) c.cf = cmCaseFlow.scoreSummary(); }catch(e){}
  c.rec = Object.assign({}, c.rec, {dayProgress: state.progress || c.rec.dayProgress || {}, practiceProgress: state.practiceProgress || c.rec.practiceProgress || {}});
  if(Array.isArray(state.taskLog)) c.data = Object.assign({}, c.data, {"task-log": state.taskLog});
  if(Array.isArray(state.workLog)) c.data = Object.assign({}, c.data, {"work-log": state.workLog});
  if(state.docFiling && typeof state.docFiling === "object") c.data = Object.assign({}, c.data, {"doc-filing": state.docFiling});
  // and what this device saved since (storeSet keeps it in index.html's mem): the Case Flow record, the Net Sheet, the folder
  try{ ["case-flow", "net-sheet", "case-folder", "drive-setup", "drive-grades", "cms-file", "cms-upload"].forEach(k => { if(typeof mem !== "undefined" && mem[k] && typeof mem[k] === "object") c.data = Object.assign({}, c.data, {[k]: mem[k]}); }); }catch(e){}
  return c;
}
const rowOf = (id, name, batch, c) => ({id, name, batch: batch || "", c, sc: compute(c), m: MODEL.compute(c)});
function renderMine(){
  // 📐 the Feedback Rubric, opened from My Performance
  if(state.scxRubric && window.cmRubric) return cmRubric.pageHtml({back: "state.scxRubric=false;render()"});
  loadMine(MINE.id !== state.traineeId);
  const loaded = MINE.id === state.traineeId, name = state.traineeName || "Me";
  const r = rowOf(state.traineeId, name, state.traineeBatch, myCtx());
  return `<div class="scx-page scx-wide">${sheetTop("My Performance", `${E(name)}${state.traineeBatch ? ` · Batch <b>${E(batchOf(state.traineeBatch))}</b>` : ""}`, `${window.cmRubric ? `<button onclick="state.scxRubric=true;render()">📐 Feedback Rubric</button>` : ""}<button onclick="window.print()">🖨 Print</button>`, loaded ? `<span>${E(MODEL.STATUS[r.m.status])}</span><span>${r.sc.done} / ${r.sc.total} days passed</span>` : "")}
    <div class="card gs-card scx-card">
    ${loaded ? `<div class="bs-pts">${cardHtml(r, true)}</div><details class="bs-pt-src scx-pad"><summary>▸ My row in the scores table</summary>${sheetHtml(scoresSheet([r], true))}</details>` : `<p class="bs-none scx-pad">Collecting your grades…</p>`}
    <p class="sc-how">${E(HOW_MODEL)}</p></div></div>`;
}

/* ---------- 🏅 Scorecards: every approved trainee's card, for the trainer ---------- */
const ALL = {rows: null, loading: false, batch: "", pick: "", only: ""};
async function loadAll(){
  ALL.loading = true;
  try{
    let people = state.adminData;
    if(!people){ const keys = await sharedList("trainee:"); people = (await sharedGetMany(keys)).filter(Boolean); state.adminData = people; }
    people = people.filter(r => r && r.approved === true && !r.archived);
    const want = []; people.forEach(r => want.push("progress:" + r.id, "callsim:" + r.id, "simresults:" + r.id, "feedback:" + r.id));
    const vals = await sharedGetMany(want);
    ALL.rows = people.map((r, i) => rowOf(r.id, r.name || r.id, r.batch, ctxOf(r, vals[i * 4], vals[i * 4 + 1], vals[i * 4 + 2], vals[i * 4 + 3])))
      .sort((a, b) => a.batch.localeCompare(b.batch) || a.name.localeCompare(b.name));
  }catch(e){ ALL.rows = []; }
  ALL.loading = false;
  if(state.view === "scorecard" && typeof render === "function") render();
}
const batchOf = b => typeof batchShow === "function" ? (batchShow(b) || b) : typeof cleanBatch === "function" ? (cleanBatch(b) || b) : b;
const shownRows = () => (ALL.rows || []).filter(r => !ALL.batch || batchOf(r.batch) === ALL.batch);
function renderAll(){
  if(!ALL.rows){ if(!ALL.loading) loadAll(); return `<div class="scx-page scx-wide"><div class="card gs-card scx-card"><p class="bs-none scx-pad">Collecting every trainee's grades…</p></div></div>`; }
  const batches = [...new Set(ALL.rows.map(r => batchOf(r.batch)).filter(Boolean))].sort();
  const rows = shownRows(), cards = ALL.only ? rows.filter(r => r.id === ALL.only) : rows, passed = rows.filter(r => r.m.pass).length;
  const who = `<label class="scx-bpick">🔎 <select onchange="cmScorecard.only(this.value)" aria-label="Show one trainee's card"><option value="">Every trainee's card</option>${rows.map(r => `<option value="${E(r.id)}" ${r.id === ALL.only ? "selected" : ""}>${E(r.name)}</option>`).join("")}</select></label>`;
  return `<div class="scx-page scx-wide">${sheetTop("Scorecards", ALL.batch ? `Batch <b>${E(ALL.batch)}</b>` : "All batches", `<label class="scx-bpick">Batch <select onchange="cmScorecard.batch(this.value)"><option value="">All batches</option>${batches.map(b => `<option ${b === ALL.batch ? "selected" : ""}>${E(b)}</option>`).join("")}</select></label>${who}<button onclick="cmScorecard.csv()">⬇ Download</button><button onclick="window.print()">🖨 Print</button><button onclick="cmScorecard.refresh()">↻ Refresh</button>`, `<span>${rows.length} trainee${rows.length === 1 ? "" : "s"}</span><span>${passed} passing</span>`)}
    <div class="card gs-card scx-card">
    ${sheetHtml(scoresSheet(rows, false))}
    ${cards.length ? `<div class="bs-pts scx-pad">${cards.map(r => cardHtml(r, false)).join("")}</div>` : ""}
    <p class="sc-how">${E(HOW_MODEL)}</p></div></div>`;
}
function csv(){
  const rows = shownRows(), T = scoresSheet(rows, false);
  const q = v => { const t = String(v == null ? "" : v); return `"${(/^[=+\-@\t\r]/.test(t) ? "'" + t : t).replace(/"/g, '""')}"`; };
  const lines = [T.head.map(q).join(",")].concat(T.rows.map(r => r.map(c => q(c.csv != null ? c.csv : c.v)).join(",")));
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], {type: "text/csv"}));
  a.download = `Scorecards${ALL.batch ? " - " + ALL.batch : ""}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- the page, its address and its top-bar button ---------- */
window.renderScorecardPage = () => isAdmin() ? renderAll() : isTrainee() ? renderMine() : (typeof renderDashboard === "function" ? renderDashboard() : "");
window.addEventListener("focus", () => { if(isTrainee() && state.view === "scorecard") loadMine(); });
window.cmScorecard = {
  batch(b){ ALL.batch = b || ""; ALL.pick = ""; ALL.only = ""; render(); },
  only(id){ ALL.only = id || ""; ALL.pick = id || ""; render(); },
  refresh(){ ALL.rows = null; state.adminData = null; render(); },
  invalidate(){ ALL.rows = null; },
  // a row of 🏅 Scores: that trainee's card (shown if only another one was), scrolled to
  pick(id){ ALL.pick = id; if(ALL.only && ALL.only !== id) ALL.only = id; render();
    setTimeout(() => { const d = document.getElementById("bs-pt-" + domId(id)); if(d) d.scrollIntoView({behavior: "smooth", block: "start"}); }, 30); },
  csv, compute, sources: SOURCES, model: MODEL,
  // the 100-point model for one trainee's records: trainee:<id>, progress:<id>.data, feedback:<id>
  score: (rec, data, fb) => MODEL.compute(ctxOf(rec, {data: data || {}}, null, null, fb))
};

const css = document.createElement("style"); css.id = "cm-scorecard";
css.textContent = `
/* Foundational Training's Batch Sheet, the standard for scorecards (its js/ft-overall.js and js/ft-batch-sheet.js): the navy
   banner, Google Sheets' grid, and its contrast — bold dark text, bigger type, visible gridlines, tinted scores */
.scx-page{max-width:none;margin:0 auto;padding:4px 0 24px;}
.ft-banner{display:flex;justify-content:space-between;align-items:flex-end;gap:14px;flex-wrap:wrap;padding:16px 18px;border-radius:12px;background:linear-gradient(135deg,#1E2340,#33406B);color:#fff;margin:0 0 12px;}
.ft-banner h2{margin:2px 0 !important;font:800 26px 'Fraunces',Georgia,serif !important;color:#fff !important;}
.ft-banner .ft-banner-k{margin:0 !important;font:800 14px Arial,sans-serif !important;letter-spacing:.08em;text-transform:uppercase;color:#F6C08F !important;}
.ft-banner .ft-banner-sub{margin:2px 0 0 !important;color:#E8ECF7 !important;font:600 15px Arial,sans-serif !important;} .ft-banner .ft-banner-sub b{color:#fff !important;}
.ft-banner-right{display:flex;gap:8px;flex-wrap:wrap;align-items:center;}
.ft-banner-right span{font:800 13px Arial,sans-serif;padding:4px 11px;border-radius:999px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.35);color:#fff;}
.ft-banner-ctl{flex-basis:100%;margin-top:6px;}
.scx-banner .gs-menu{display:flex;flex-wrap:wrap;gap:6px;align-items:center;}
.scx-banner .gs-menu button{border:2px solid #fff;background:#fff;color:#1E2340;font:800 13px Arial,sans-serif;padding:5px 10px;border-radius:7px;cursor:pointer;white-space:nowrap;box-shadow:0 1px 0 rgba(0,0,0,.06);}
.scx-banner .gs-menu button:hover{background:#EEF1F8;}
.scx-bpick{display:inline-flex;align-items:center;gap:6px;font:800 15px Arial,sans-serif;color:#fff;margin-right:6px;}
.scx-bpick select{font:800 15px Arial,sans-serif;padding:5px 9px;border:2px solid #fff;border-radius:7px;background:#E8EDFB;color:#1E2340;}
.gs-card.scx-card{padding:0;overflow:hidden;font-family:Arial,'Roboto',sans-serif;background:#fff;border:1px solid #E1E3E1;border-radius:12px;}
.scx-card .bs-sec{padding:14px 14px 6px;border-top:1px solid #E1E3E1;} .scx-card .bs-sec:first-child{border-top:0;}
.scx-card .bs-h{margin:0 0 2px;font:800 21px Arial,sans-serif;color:#141A2E;} .scx-card .bs-h span{font:400 13px Arial,sans-serif;color:#5F6368;margin-left:6px;}
.scx-card .bs-note{margin:0 0 8px;font:600 14.5px Arial,sans-serif;color:#2E3450;} .scx-pad{padding:14px;} .bs-none{color:#5F6368;font-style:italic;}
.scx-card .gs-wrap{overflow:auto;max-height:70vh;background:#fff;border:1px solid #9AA3B5;border-radius:4px;}
.scx-card .gs{border-collapse:separate;border-spacing:0;font:16px Arial,sans-serif;color:#141A2E;}
.scx-card .gs th,.scx-card .gs td{border-right:1px solid #AEB6C6;border-bottom:1px solid #AEB6C6;padding:7px 11px;white-space:nowrap;height:30px;}
.scx-card .gs thead{position:sticky;top:0;z-index:3;}
.scx-card .gs-letters th{background:#F8F9FA;color:#5F6368;font-weight:400;font-size:12px;text-align:center;min-width:90px;height:22px;padding:2px 8px;}
.scx-card .gs-head th{background:#F8F9FA;font:800 15.5px Arial,sans-serif;color:#141A2E;text-align:center;white-space:normal;min-width:110px;max-width:220px;line-height:1.25;}
.scx-card .gs-corner,.scx-card .gs-rn{position:sticky;left:0;z-index:4;background:#F8F9FA !important;color:#5F6368;font-weight:400 !important;font-size:12px;text-align:center;width:40px;min-width:40px !important;}
.scx-card thead .gs-corner,.scx-card thead .gs-rn{z-index:5;}
.scx-card .gs .gs-frz{position:sticky;left:41px;z-index:2;background:#fff;box-shadow:2px 0 0 #9AA3B5;}
.scx-card .gs-letters .gs-frz,.scx-card .gs-head .gs-frz{z-index:4;background:#F8F9FA;}
.scx-card .gs td{font-weight:700;color:#141A2E;} .scx-card .gs td.gs-name{font-weight:800;min-width:200px;}
.scx-card td.gs-batch{font:700 13px 'IBM Plex Mono',monospace;color:#2E3450;}
.scx-card .gs-num{text-align:right;} .scx-card .gs-rank{text-align:center;font-weight:800;color:#B5651F;}
.scx-card .gs-calc{background:#F1F3F4;} .scx-card .gs-bold{font-weight:800;}
.scx-card td.gs-hi{color:#0B5D1E;background:#E6F4EA;} .scx-card td.gs-mid{color:#7A4B00;background:#FFF4E0;} .scx-card td.gs-lo{color:#A50E0E;background:#FDE8E8;}
.scx-card .gs-txt{white-space:normal !important;min-width:260px;max-width:520px;} .scx-card td.gs-det{color:#3C4043;font-weight:600;}
.scx-card .gs td{cursor:cell;outline:none;} .scx-card .gs td:focus{box-shadow:inset 0 0 0 2px #1A73E8;}
.scx-card tr[onclick] td{cursor:pointer;} .scx-card tr[onclick]:hover td:not(.gs-hi):not(.gs-mid):not(.gs-lo){background:#F1F6FE;}
.scx-card tr.gs-picked td.gs-name{background:#E8F0FE;box-shadow:inset 4px 0 0 #1A73E8,2px 0 0 #9AA3B5;}
/* (a grading system's row: a band across the table, its items indented under it; the overall a navy band, as Foundational's) */
.scx-card tr.gs-sys td{background:#E8ECF6;color:#1E2340;font-weight:800;border-top:2px solid #AEB6C6;} .scx-card tr.gs-sys td.gs-hi,.scx-card tr.gs-sys td.gs-mid,.scx-card tr.gs-sys td.gs-lo{border-top:2px solid #AEB6C6;}
.scx-card tr:not(.gs-sys):not(.gs-total) td.gs-frz{background:#F8FAFD;}
.scx-card tr.gs-sys td.gs-hi{color:#0B5D1E;background:#CFEBD8;} .scx-card tr.gs-sys td.gs-mid{color:#7A4B00;background:#FFE7BF;} .scx-card tr.gs-sys td.gs-lo{color:#A50E0E;background:#F9D0D0;}
.scx-card tr.gs-total td{background:#1E2340 !important;color:#fff !important;font-weight:800;} .scx-card tr.gs-total td:last-child{color:#FDE68A !important;}
.scx-card .sc-how{margin:10px 14px 14px;font:600 13.5px Arial,sans-serif;color:#2E3450;}
@media(max-width:640px){ .ft-banner h2{font-size:22px !important;} }
@media print{ .topbar,.tfb-fab,footer,.ft-banner-ctl{display:none !important;} .scx-card .gs-wrap{max-height:none;overflow:visible;} .ft-banner{-webkit-print-color-adjust:exact;print-color-adjust:exact;} }
/* the trainee card: Foundational's Batch Sheet card (its js/ft-batch-sheet.js .bs-pt*, .bs-in*, .bs-parts*, .bs-sbox), in the
   course's type (Poppins for the band and the pills, Inter for the tables) */
.bs-pt .gs-hi{color:#137333;} .bs-pt .gs-mid{color:#B06000;} .bs-pt .gs-lo{color:#C5221F;}
.bs-pts{display:flex;flex-direction:column;gap:14px;}
.bs-pt{border:1px solid #DDE1EC;border-radius:12px;background:#fff;scroll-margin-top:80px;} .bs-pt.bs-pt-on{box-shadow:0 0 0 3px #DB8437;}
.bs-pt-h{display:flex;flex-wrap:wrap;justify-content:center;align-items:center;gap:10px 14px;padding:14px 16px;background:linear-gradient(135deg,#1E2340,#33406B);color:#fff;border-radius:11px 11px 0 0;font:600 18px 'Poppins','Inter',Arial,sans-serif;}
.bs-pt-h > b{color:#fff;font:800 24px 'Poppins','Inter',Arial,sans-serif;margin-right:6px;} .bs-pt-h > i{color:#FFD9A8;font-style:normal;font-weight:700;font-size:15px;}
.bs-pt-k{display:inline-flex;align-items:baseline;gap:7px;padding:5px 14px;border-radius:999px;background:#fff;border:2px solid #C9D1E6;color:#1E2340 !important;font:700 16px 'Poppins','Inter',Arial,sans-serif;}
.bs-pt-k b{font-size:22px;color:#1E2340;} .bs-pt-k.bs-pt-r b{font-size:17px;}
.bs-pt-k.gs-hi{background:#E6F4EA;border-color:#1E8E3E;} .bs-pt-k.gs-hi b{color:#0B5D1E;}
.bs-pt-k.gs-mid{background:#FFF4E0;border-color:#E8A400;} .bs-pt-k.gs-mid b{color:#7A4B00;}
.bs-pt-k.gs-lo{background:#FDE8E8;border-color:#D93025;} .bs-pt-k.gs-lo b{color:#A50E0E;}
.bs-pt .bs-in{margin:10px 12px;padding:10px 14px;border-radius:10px;font:500 15.5px/1.5 'Inter',Arial,sans-serif;color:#1E2340;} .bs-in ul{margin:6px 0 0;padding-left:20px;} .bs-in li{margin:3px 0;}
.bs-in-s{color:#475569;font-weight:700;font-size:14px;} .bs-in small{font-size:14px;color:#3C4043;}
.bs-in-lo{background:#FDECEC;border:1px solid #F5B5B5;} .bs-in-ok{background:#FFF7E6;border:1px solid #F5D49A;} .bs-in-hi{background:#E8F6EC;border:1px solid #A7DDB6;}
.bs-pt-wrap{overflow-x:auto;padding:4px 10px 12px;}
.bs-pt-t{border-collapse:collapse;width:100%;table-layout:fixed;font:16.5px/1.45 'Inter',Arial,sans-serif;color:#1F2433;} .bs-pt-t + .bs-pt-t{margin-top:14px;}
.bs-pt-t th,.bs-pt-t td{border:1px solid #9AA3B5;padding:8px 10px;text-align:left;vertical-align:top;}
.bs-pt-t col.bs-pt-c1{width:240px;} .bs-pt-t col.bs-pt-c2{width:132px;}
.bs-pt-sec th{background:#1E2340;color:#fff;font:800 17px 'Poppins','Inter',Arial,sans-serif;}
.bs-pt-m{font-weight:800;color:#1E2340;} .bs-pt-w{display:inline-block;margin-left:4px;padding:0 7px;border-radius:999px;background:#FDF0E4;color:#A4470F;font-size:14px;font-weight:800;}
.bs-pt-mult{display:block;margin-top:3px;font:600 14px 'Inter',Arial,sans-serif;color:#475569;}
.bs-pt-v{font-weight:800;font-size:18.5px;} .bs-pt-v.gs-hi{background:#E6F4EA;color:#0B5D1E;} .bs-pt-v.gs-mid{background:#FFF4E0;color:#7A4B00;} .bs-pt-v.gs-lo{background:#FDE8E8;color:#A50E0E;}
.bs-pt .gs-na{color:#5F6368 !important;background:#F1F3F4 !important;}
.bs-pt-f{font-weight:500;color:#1F2433;font-size:15.5px;} .bs-pt-f b{color:#1E2340;} .bs-pt-feeds{display:block;}
.bs-pt-ul{margin:4px 0 0;padding-left:20px;} .bs-pt-ul li{margin:2px 0;}
.bs-pt-t tr.bs-pt-final td{border-top:3px solid #1E2340;}
.bs-parts{width:100%;border-collapse:collapse;font:14px/1.4 'Inter',Arial,sans-serif;}
.bs-pt .bs-parts th,.bs-pt .bs-parts td{border:1px solid #AEB6C6;padding:5px 8px;vertical-align:top;}
.bs-parts tr.bs-parts-g th{background:#E8ECF6;color:#1E2340;text-align:left;font:800 14px 'Inter',Arial,sans-serif;letter-spacing:.02em;padding:6px 10px;border-top:2px solid #AEB6C6;}
.bs-parts tr.bs-parts-g.bs-parts-top th{background:#1E2340;color:#fff;font-size:14.5px;padding:7px 10px;}
.bs-parts tr.bs-parts-g .bs-parts-gv{float:right;font-weight:800;color:#1E2340;} .bs-parts tr.bs-parts-g.bs-parts-top .bs-parts-gv{color:#FDE68A;}
.bs-parts tr.bs-parts-c td{background:#F8FAFD;}
.bs-parts-n{width:38%;font-weight:600;color:#1F2433;} .bs-parts-v{width:96px;white-space:nowrap;} .bs-parts-t{color:#3C4043;}
.bs-sbox{display:inline-block;min-width:44px;text-align:center;border:1px solid #DADCE0;border-radius:6px;padding:2px 5px;font:700 14px 'Inter',Arial,sans-serif;background:#F8F9FA;color:#202124;}
.bs-sbox.gs-hi{background:#E6F4EA;border-color:#B7DFC2;color:#137333;} .bs-sbox.gs-mid{background:#FEF7E0;border-color:#F3DC8F;color:#8A5A00;} .bs-sbox.gs-lo{background:#FCE8E6;border-color:#F5C2BC;color:#B3261E;}
.bs-pt-src{margin-top:14px;} .bs-pt-src > summary{cursor:pointer;font:800 15.5px 'Poppins','Inter',Arial,sans-serif;color:#1E2340;padding:8px 12px;border:2px solid #C9D1E6;border-radius:8px;background:#F4F6FB;list-style:none;}
.bs-pt-src > summary::-webkit-details-marker{display:none;} .bs-pt-src[open] > summary{border-color:#DB8437;}
.bs-pt-src .bs-sec{padding:10px 0 0 !important;border-top:0 !important;}
.scx-card .gs td.gs-txt0{white-space:nowrap;}
.bs-pt-tier{display:block;font:800 14px 'Inter',Arial,sans-serif;margin-top:2px;} .bs-pt-rlink{font-weight:800;color:#B5651F;}
@media (max-width:760px){ .bs-pt-t col.bs-pt-c1{width:120px;} .bs-pt-t col.bs-pt-c2{width:76px;} .bs-pt-t{font-size:15px;} .bs-pt-h > b{font-size:20px;}
  .bs-parts tr{display:block;border-top:1px solid #EEF0F4;padding:4px 0;} .bs-parts td,.bs-parts th{display:block;width:auto !important;border:0 !important;padding:2px 8px;} }
@media print{ .bs-pt-h,.bs-pt-k,.bs-in,.bs-pt-sec th,.bs-pt-v,.bs-parts-g th,.bs-sbox{-webkit-print-color-adjust:exact;print-color-adjust:exact;} .bs-pt{break-inside:auto;} .bs-pt-src{display:none;} }
`;
document.head.appendChild(css);
})();
