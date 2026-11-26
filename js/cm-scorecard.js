/* 🏅 The Scorecard, set up the way Foundational Training's is (its js/lsh-program.js): every grading system's graded
   items, each system's average, and the overall, the average of the systems that have a score, so each counts the same.
   Foundational's task trackers and monitoring sheets have no place here; these are this course's own grading systems:
     ✍️ Knowledge Checks      each Case Flow day's quiz (70% passes)
     🧩 Learning Checks       each module's composite (Automated × 0.60 + trainer × 0.40), the automated half until the trainer scores it
     🧪 Skill Activities      each graded Skill Activity on John Doe's file, its latest attempt: the grader's
                              (cf-ai-grades, js/cm-ai-grader.js) and the older labs' (the work log), counted once
     🗂 CMS Case File         John Doe's file in the CMS, graded day by day (js/cm-cms-file.js): the case as the CMS reports it,
                              each CMS activity's Check Your Work items by area, every document filed (doc-filing)
     📂 Backup Drive          Day 1's folder structure and each later day's Backup File Maintenance, auto-graded from the drive:
                              the latest of the grade saved on the trainee's progress (drive-setup / drive-grades) and the
                              Worker's nightly grade of the drive (js/cm-drive-work.js scoreItems), a trainer's override winning
     📝 Action Plan           each Notes & Action Plan's action plan, checked against its required steps
     📊 Net Sheet Checks      each stage's Check my sheet on the LSH Net Sheet (net-sheet)
     🎙 Transcription         each voicemail transcript: every attempt graded (facts 60% + word accuracy 40%), the one handed in counts
     ✉️ Email Simulators      the Case Flow's Email Simulator sends (100% ÷ (refused drafts + 1)) and the Portal's email simulators
     🗓 Calendaring           the Portal's Calendaring Simulators
     🔎 Case Exercises        the exhibit audits, Listening Checks, records screening and judgement calls
     🛠 Skill Builders        each practice tool's best score
     🎯 Graded Calls          the best graded call on each Call Simulator line (callsim:<id>, written by the Portal)
     📞 Case Calls            each graded call on John Doe's file, its best; a missed injected call counts 0
     🧰 Portal Simulators     the best result on each other Training Portal simulator (simresults:<id>, written by the Portal)
     📐 Trainer Rubric        the trainer's rubric score on each day's sent review (feedback:<id>, the 📐 Feedback Rubric, js/cm-rubric.js)
   Each system names the rubric dimensions it feeds (dims) and how it is scored (how): the 📐 Feedback Rubric page maps them,
   and the card's 📐 Rubric profile averages them by dimension.
   Over them sits the client's 100-POINT MODEL (MODEL below): four weighted dimensions per Case Flow day, complexity
   multipliers, a 4-tier rubric, pass at 80% and a safety gate on the critical items.
   Both pages show it as Foundational's batch-sheet TRAINEE CARD (cardHtml), the standard format for all scorecards.
   • Trainee: 🏅 My Performance (#/scorecard), their own card; their grading systems under a toggle.
   • Trainer: 🏅 Scorecards (the same address, and Admin → 🏅 Scorecard, the one scores page, with the old 📋 Batch Sheet folded
     in by js/cm-batch-sheet.js): 🏅 Scores (a row per approved trainee, by batch: the days with their slides and work, a column
     per kind of work, the Overall and the Result), then every trainee's card (🔎 picks one) with its 💬 Feedback on Practical
     Activities; a row of 🏅 Scores scrolls to its card. ⬇ Download starts with 🏅 Scores and carries every table the page
     folds in; ⬇ Scores only is 🏅 Scores alone; ⚡ Run now (js/cm-run-now.js) holds the manual triggers.
   It only reads: trainee:<id> (its caseFlow summary, dayProgress and practiceProgress), progress:<id> (case-flow,
   work-log, cf-ai-grades, doc-filing, net-sheet, case-folder, drive-setup), callsim:<id>, simresults:<id> and feedback:<id>
   (the trainer's Learning Check scores and each day's review with its rubric score), in one get-many. */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const num = v => typeof v === "number" && isFinite(v) ? Math.max(0, Math.min(100, Math.round(v))) : null;
const pctTxt = p => p == null ? "—" : p + "%";
// a day's Knowledge Check: its BEST score (the owner's rule: a reset gives one more attempt and the best is kept), whichever
// record holds it: the day's progress (submitQuiz keeps the best), its attempt history, or the Case Flow summary
// 🛡 Only the trainee's record and its Case Flow summary count (trainee:<id>: the Worker holds the one-attempt rule there).
// The device's own copy (progress:<id>.data["day-progress"], the work log's quiz entries) is the trainee's to write: a check
// held only there is SHOWN, labelled unconfirmed (kcDevice), never counted for the score or the pass, until a trainer
// restores it to the record (🛠 Account Repair, which marks it kcUnverified).
const fin = x => typeof x === "number" && isFinite(x);
const kcScores = p => [p && p.score].concat(((p && p.history) || []).map(h => h && h.score));
// (the summary's kc counts only for a day the record holds no attempt of: where it does, the record's attempts are the score)
// 🛡 a Case Flow day's summary (caseFlow.days[n]) counts only when it is this day's: its id is the day's own (or it has none,
// a summary from before ids were kept). One that names another day's id is not this day's score or pass.
const cfDay = (c, d) => { const s = (((c.cf || {}).days) || {})[d.cf.n]; return s && typeof s === "object" && (s.id == null || String(s.id) === String(d.id)) ? s : {}; };
// 🧩 a day's Learning Checks with the trainer's score as feedback:<id> holds it (trainer-owned, read with the record): the
// summary's copy is the trainee's page's, put there only when that page last read it, so a trainer's 40% saved since
// would not show until the trainee's page saved again
const lcMods = (mods, fb) => { const T = (fb && fb.caseFlow) || {}, out = {};
  Object.entries(mods || {}).forEach(([id, s]) => { const x = T[id]; if(!s || typeof s !== "object" || !x || !fin(x.score)){ out[id] = s; return; }
    const a = fin(s.a) ? s.a : null; out[id] = Object.assign({}, s, {t: x.score, c: a != null ? Math.round(a * 0.6 + x.score * 0.4) : null}); });
  return out; };
const kcBest = (p, s) => { let v = kcScores(p).filter(fin); if(!v.length) v = [s && s.kc].filter(fin); return v.length ? Math.max.apply(null, v) : null; };
// the device's score for a day the record has none: the device's day progress, else the work log's quiz entries (unconfirmed)
const kcDevice = (c, d) => { const p = ((c.rec || {}).dayProgress || {})[d.id], s = cfDay(c, d);
  if(fin(kcBest(p, s))) return null;
  let v = kcScores((((c.data || {})["day-progress"]) || {})[d.id]).filter(fin);
  if(!v.length) v = ((c.data || {})["work-log"] || []).filter(e => e && e.kind === "quiz" && String(e.dayId) === String(d.id)).map(e => e.score).filter(fin);
  v = v.filter(x => x >= 0 && x <= 100); return v.length ? Math.max.apply(null, v) : null; };
// 🛡 a day passed stays passed: marked done on the record or its summary, or any of the record's attempts at 70% or more.
// (the record's "done" counts only with a recorded attempt: a day with no score is never passed by a "done" alone)
const kcPassed = (c, d) => { const p = ((c.rec || {}).dayProgress || {})[d.id] || {}, s = cfDay(c, d), has = kcScores(p).some(fin);
  if((p.done && has) || (!has && s.passed)) return true; const b = kcBest(p, s); return fin(b) && b >= 70; };
// 🛡 a Net Sheet stage is credited with its best stored result (js/cm-credit-kept.js keeps it best; .last is a lower, later check)
const nsBest = k => window.cmCreditKept ? cmCreditKept.nsBest(k) : k;
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
/* ---------- what a day's 🧪 Skill Activities and 📝 Action Plan are, read from where they are written ----------
   (one reading for every surface: the grading systems below, the model's day score, the trainee card, the Batch Sheet) */
// the Case Flow day a block is taught on (the sequence), else the day its id names (d3m2-… is Day 3)
let TAUGHT = null;
const taughtOf = id => {
  if(!TAUGHT){ TAUGHT = {}; (((window.CM_CASE_FLOW || {}).sequence) || []).forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(b => { TAUGHT[b] = sd.n; }))); }
  if(TAUGHT[id]) return TAUGHT[id];
  const m = /^d(\d)/.exec(String(id || "")); return m ? +m[1] : null;
};
// 🧾 an activity merged into another keeps its id on old records (d2m4-a1, merged into d3m1-a1, carries the same amendment
// set): a trainee who worked the set there and again where it now is holds two records of one exercise, counted once
let MERGED = null;
const mergedTo = id => { if(!MERGED && window.CM_CASE_FLOW){ MERGED = {}; (((window.CM_CASE_FLOW || {}).days) || []).forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if(b && b.mergedInto) MERGED[b.id] = b.mergedInto; }))); }
  return (MERGED && MERGED[id]) || id; };
const amendSets = R => { const g = {}; Object.entries((R && R.amend) || {}).forEach(([b, r]) => { if(!r || typeof r !== "object") return; const k = mergedTo(b); (g[k] = g[k] || []).push([b, r]); }); return Object.values(g); };
const blockOf = id => { const X = (window.CM_AIG_EXTRA || {})[id]; if(X && X.b) return {b: X.b, n: X.n || taughtOf(id)};
  let out = null; (((window.CM_CASE_FLOW || {}).days) || []).forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if(b.id === id) out = {b, n: taughtOf(id) || d.n}; })));
  return out; };
// 📝 the day's takeaway is the trainee's own writing and is not scored (the owner took the takeaway grades out of the
// scorecards): no grading system, no item in the 100-point model, no part of the Daily compliance. Its AI review (the
// work log's "… — CM Self-Summary" line) only says whether it gives the client legal advice: the UPL critical item.
// the Case Flow day of a work-log entry: its label's "Case Flow Day n", else its day id (11–15)
// one Skill Activity's key in the work log: "<day>|<title>" from "… Case Flow Day <n> · <title> — Skill Building"
// (a title is keyed without "AI" and "the": three call activities lost the "AI" in their titles, "… with AI John Doe" →
// "… with John Doe", and a line logged under the old title is the same activity)
const titleKey = t => String(t || "").replace(/\b(?:AI|the)\s+/g, "").replace(/\s+/g, " ").trim();
const labKey = e => { const m = /Case Flow Day (\d) · (.+?) — Skill Building\s*$/.exec(e.label || ""); return m ? `${m[1]}|${titleKey(m[2])}` : String(e.label || e.toolId || "Skill Activity"); };
const labDayOf = e => { const m = /Case Flow Day (\d)/.exec(e.label || ""); if(m) return +m[1]; const v = parseInt(e.dayId, 10); return v >= 11 && v <= 15 ? v - 10 : v >= 1 && v <= 5 ? v : null; };
// 🧪 each Skill Activity's latest attempt: the grader's (cf-ai-grades, js/cm-ai-grader.js: {blocks: {<id>: {score, at, …}}})
// and the work log's "lab" entries (index.html wrapEvaluators: every runRubricEvaluation, the older labs' and the grader's
// own attempts, "Day <id> · Case Flow Day <n> · <title> — Skill Building"). One activity is one key (its day and title),
// so an AI Grader attempt and its work-log line are counted once; the takeaway's review (— CM Self-Summary) is not scored.
function skillActs(c){
  const seen = {}, lines = {}, keep = (k, x) => { if(!seen[k] || String(x.at || "") >= String(seen[k].at || "")) seen[k] = Object.assign(x, {key: k}); };
  ((c.data || {})["work-log"] || []).forEach(e => { if(!e || e.kind !== "lab" || !fin(e.score) || /Self-Summary/.test(e.label || "")) return;
    const m = /Case Flow Day (\d) · (.+?) — Skill Building\s*$/.exec(e.label || ""), day = labDayOf(e), k = labKey(e);
    if(!lines[k] || String(e.at || "") >= String(lines[k].at || "")) lines[k] = e;
    keep(k, {name: m ? m[2].trim() : (typeof dayText === "function" ? dayText(e.label || e.toolId || "Skill Activity") : (e.label || e.toolId || "Skill Activity")),
      day, pct: num(e.score), at: e.at || "", tier: e.tier || "", subs: e.subs || null, best: e.strengths || [], improve: (e.gaps || []).concat(e.growth || []), from: "work log"}); });
  Object.entries((((c.data || {})["cf-ai-grades"]) || {}).blocks || {}).forEach(([id, r]) => { if(!r || !fin(r.score)) return;
    const f = blockOf(id), t = f && f.b && f.b.title ? String(f.b.title).trim() : id, day = (f && f.n) || taughtOf(id);
    const k = day ? `${day}|${titleKey(t)}` : "aig|" + id;
    // logged: this attempt is the work log's latest line of the activity (the grader writes that line as it grades, so the
    // two share the score, a few minutes apart at most). An older line is another attempt: this one counts by its total.
    const w = lines[k], ta = Date.parse(r.at || ""), wa = Date.parse((w && w.at) || "");
    const logged = !!w && (!(ta > 0) || !(wa > 0) || (Math.round(w.score) === Math.round(r.score) && Math.abs(ta - wa) < 15 * 60e3));
    // (its rubric parts, js/cm-ai-grader.js subs: Accuracy, Presence, Risk, Efficiency as shares of their maximums)
    const subs = r.subs && ["accuracy", "presence", "risk", "efficiency"].every(x => fin(r.subs[x])) ? {accuracy: num(r.subs.accuracy), presence: num(r.subs.presence), risk: num(r.subs.risk), efficiency: num(r.subs.efficiency)} : null;
    keep(k, {name: t, id, day, logged, pct: num(r.score), at: r.at || "", tier: r.tier || "", subs, best: r.strengths || [], improve: (r.gaps || []).concat(r.growth || []),
      tries: r.tries || 0, from: "the grader"}); });
  return Object.values(seen);
}
// 📝 each Notes & Action Plan's action plan, handed in (js/cm-case-flow.js npPlan: planGot = the required steps the plan holds,
// kept in case-flow notes[<block>]): the share of the required steps. (📝 Update Your Action Plan, the Action Plan Editor's
// note, is not graded by anything: it has no score to show.)
function actionPlans(c){
  const N = ((window.CM_CF_EXHIBITS || {}).notes) || {}, out = [];
  Object.entries((((c.data || {})["case-flow"]) || {}).notes || {}).forEach(([b, r]) => { const n = N[b], req = ((n && n.plan) || {}).required || [];
    if(!n || !r || !r.planAt || !req.length) return; const got = (r.planGot || []).filter(Boolean).length;
    out.push({name: String(n.title || "Action Plan").replace(/^Notes & Action Plan — /, ""), block: b, day: taughtOf(b), pct: num(100 * got / req.length), at: r.planAt,
      note: `${got} of ${req.length} required steps`, best: req.filter((q, i) => (r.planGot || [])[i]).map(q => q.label).slice(0, 4), improve: req.filter((q, i) => !(r.planGot || [])[i]).map(q => "Missing: " + q.label).slice(0, 4)}); });
  return out;
}
/* ---------- the grading systems: each returns its items, {name, pct, note, auto} (and their day where they have one) ---------- */
const SOURCES = [
  {id: "kc", icon: "✍️", label: "Knowledge Checks", about: "Each Case Flow day's Knowledge Check. 70% passes the day.", dims: ["pc"], how: "Auto-scored quiz: one attempt, and its score is the one recorded.",
    items: c => cfDays().map(d => { const s = cfDay(c, d), p = (c.rec.dayProgress || {})[d.id] || {};
      const pct = num(kcBest(p, s));
      // (a score only the trainee's device holds: shown, unconfirmed, not counted)
      if(pct == null){ const dv = num(kcDevice(c, d)); return dv == null ? null : {name: dayName(d), pct: dv, unconfirmed: true, note: "Unconfirmed: only on the trainee's device, not on their record (not counted). 🛠 Account Repair can restore it."}; }
      return {name: dayName(d), pct, note: (pct >= 70 ? "Passed (best score kept)" : "Below 70%: not passed yet") + (p.kcUnverified ? " · restored from the trainee's device" : "")}; })},
  {id: "lc", icon: "🧩", label: "Learning Checks", about: "Each module's Learning Check: Automated × 0.60 + trainer × 0.40. Until the trainer scores it, the automated half counts.", dims: ["na", "cp"], how: "The review × 0.60 + the trainer's score × 0.40.",
    items: c => { const names = moduleNames(), out = [];
      Object.values(c.cf.days || {}).forEach(day => Object.entries(lcMods(day && day.modules, c.fb)).forEach(([id, s]) => {
        const pct = num(s.c != null ? s.c : s.a); if(pct == null) return;
        out.push({name: (names[id] ? `Day ${names[id].n}: ${names[id].title}` : id), pct, auto: s.c == null,
          note: s.c != null ? `Automated ${pctTxt(num(s.a))} · Trainer ${pctTxt(num(s.t))}` : "Automated only: awaiting the trainer's 40%"}); }));
      return out; }},
  {id: "sa", icon: "🧪", label: "Skill Activities", about: "Each graded Skill Activity on John Doe's file (the grader), the latest attempt of each.", dims: ["na", "cp", "cd"], how: "The rubric: Accuracy 35 + Presence 30 (plan quality), Risk 20, Efficiency 15.",
    items: c => skillActs(c).map(x => Object.assign({}, x, {name: x.day ? `Day ${x.day}: ${x.name}` : x.name, note: [x.tier, x.from === "the grader" && x.tries ? `Graded · attempt ${x.tries}` : x.from, fmt(x.at)].filter(Boolean).join(" · ")}))},
  {id: "cms", icon: "🗂", label: "CMS Case File", about: "John Doe's case file in the CMS, graded day by day against what a correct file holds by then: the case opened and verified, parties & Conflict Check, the insurance stack and claim numbers, the SOL and deadlines calendared, case notes and logs, liens, the litigation record, and every document filed under its category and named to convention.",
    dims: ["pc", "na", "cd"], how: "Per day, the average of its areas: Check Your Work items ticked 100% / not 0%; a document 100% first time right, then 100% ÷ attempts; the case as the CMS reports it; an entry missing when the day is passed 0.",
    items: c => { const f = window.cmCmsFile ? cmCmsFile.compute(c) : null; if(!f) return [];
      return f.days.filter(x => x.pct != null).map(x => ({name: `Day ${x.n}: the CMS case file`, pct: x.pct,
        note: x.areas.filter(a => a.pct != null).map(a => `${a.a.label} ${a.pct}%`).join(" · ") + (x.missing ? ` · ${x.missing} entr${x.missing === 1 ? "y" : "ies"} missing` : " · complete")})); }},
  {id: "bd", icon: "📂", label: "Backup Drive", about: "Your Backup Drive, graded automatically: Day 1's folder structure, then each day's Backup File Maintenance, read from your Drive itself (where each document is, whether every file is named by the firm's naming convention, what was moved and put back). File names are 12 of the 60 points graded each day. 70% passes.", dims: ["pc"], how: "Read from the Drive by the Worker: the share of the day's checks that pass.",
    items: c => { const out = [], s = c.data["drive-setup"], g = c.data["drive-grades"] || {};
      if(s && typeof s.score === "number") out.push({name: "Day 1: the firm's folders", day: 1, pct: num(s.score), at: s.at || null, src: "saved", g: s, note: s.ok ? `Built on attempt ${s.attempts || 1}` : "Not built yet"});
      // (📂 built on the Training Portal's Backup Drive instead — /simulators/drive.html?program=CM, saved there as the "Backup Drive
      // Setup" simulator result, simresults:<id>: Day 1 from it, and not counted again under 🧰 Portal Simulators)
      else { const p = portalSetup(c); if(p) out.push({name: "Day 1: the firm's folders", day: 1, pct: num(p.score), at: p.at || null, src: "portal", note: `Built on the Training Portal's 📂 Backup Drive · best of ${p.count || 1} attempt${(p.count || 1) === 1 ? "" : "s"}${p.at ? " · " + fmt(p.at) : ""}`}); }
      // 🏷 the day's File names row is named in the note (js/cm-drive.js keeps it with the grade), so a lower score says why
      const names = x => { const m = x && x.names; if(!m || typeof m.got !== "number" || typeof m.max !== "number") return "";
        return `🏷 File names ${m.got}/${m.max}${m.wrong > 0 ? ` · ${m.wrong} name${m.wrong === 1 ? "" : "s"} wrong` : ""}`; };
      Object.keys(g).sort().forEach(n => { const x = g[n]; if(x && typeof x.score === "number") out.push({name: `Day ${n}: Backup File Maintenance`, day: +n, pct: num(x.score), at: x.at || null, src: "saved", g: x, note: [x.passed ? "Passed" : "Below 70%: not passed yet", names(x), fmt(x.at)].filter(Boolean).join(" · ")}); });
      return out; }},
  {id: "ap", icon: "📝", label: "Action Plan", about: "Each action plan written in the Notes & Action Plan (the voicemail's plan), checked against the steps it must hold.", dims: ["cp"], how: "Auto-checked against the answer key: the share of the required steps the plan holds.",
    items: c => actionPlans(c).map(x => Object.assign({}, x, {name: `Day ${x.day}: ${x.name}`, note: `${x.note} · ${fmt(x.at)}`}))},
  {id: "ns", icon: "📊", label: "Net Sheet Checks", about: "Each stage of the LSH Net Sheet, checked automatically with Check my sheet: the share of its checks that passed.", dims: ["cp"], how: "Check my sheet: checks passed ÷ checks; the trust-money stages are critical.",
    items: c => { const out = [], files = (c.data["net-sheet"] && c.data["net-sheet"].files) || {};
      Object.values(files).forEach(f => Object.entries((f && f.checks) || {}).forEach(([stage, k]) => {
        k = nsBest(k); if(!k || !k.total) return;
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
      amendSets(R).forEach(set => { const req = {};   // (one amendment set worked on two activities: each request's better email)
        set.forEach(([b, r]) => Object.entries(r.req || {}).forEach(([doc, x]) => { if(x && x.sent && (!req[doc] || (x.tries || 0) < (req[doc].tries || 0))) req[doc] = x; }));
        Object.entries(req).forEach(([doc, x]) => sent(`Amendment request: ${doc}`, x)); });
      Object.entries((c.sim && c.sim.best) || {}).filter(([k, b]) => simKind(k) === "email" && b && typeof b.score === "number").forEach(([k, b]) => out.push({name: k, pct: num(b.score), note: `Portal · ${b.count || 1} run${(b.count || 1) === 1 ? "" : "s"}`}));
      return out; }},
  {id: "cal", icon: "🗓", label: "Calendaring", about: "The Training Portal's Calendaring Sims (the Litigation Week: the prep, debrief, client and expert calls placed around a deposition, a hearing and a mediation).",
    dims: ["pc", "cp"], how: "The simulator's automated review under the attorney's rules (the trainer's score where given): the best run.",
    items: c => { const out = [];
      Object.entries((c.sim && c.sim.best) || {}).filter(([k, b]) => simKind(k) === "calendar" && b && typeof b.score === "number").forEach(([k, b]) => out.push({name: k, pct: num(b.score), note: `Portal · ${b.count || 1} run${(b.count || 1) === 1 ? "" : "s"}`}));
      return out; }},
  {id: "cx", icon: "🔎", label: "Case Exercises", about: "The Case Flow's graded exercises on John Doe's file: the exhibit audits, the Listening Checks, the records screening and the judgement calls on served emails (the action plans are 📝 Action Plan's).",
    dims: ["na"], how: "Each auto-checked against its answer key: the share called right (an audit's items, a Listening Check's facts, the records screened); a judgement call 100% or 0%.",
    items: c => (MODEL.evidence(c).items || []).filter(x => CX_GROUPS.has(x.group)).map(x => ({name: x.name, day: x.day, pct: num(x.pct), note: `Day ${x.day} · ${x.group.replace(/^\S+\s/, "")} · ${x.note}`}))},
  {id: "sb", icon: "🛠", label: "Skill Builders", about: "Each practice tool's best score (the Calendar Conflict Resolver).", dims: ["na", "cp"], how: "The practice tool's own grader: the best score of its runs.",
    items: c => Object.entries(c.rec.practiceProgress || {}).filter(([, v]) => v && typeof v.bestScore === "number" && v.bestScore > 0).map(([id, v]) => {
      const t = (typeof PRACTICE_TOOLS !== "undefined" ? PRACTICE_TOOLS : []).find(x => x.id === id);
      return {name: t ? t.title : id, pct: num(v.bestScore), note: `${v.runs || 1} attempt${(v.runs || 1) === 1 ? "" : "s"}`}; })},
  {id: "gc", icon: "🎯", label: "Graded Calls", about: "The best graded call on each Call Sim line (☎ LSH CommX).", dims: ["pc", "cd"], how: "Scored by the Call Sim on the Training Portal: the call itself and the note you write after it. Your best call on each line counts.",
    // a trainer's note on a line (js/cm-trainer-notes.js: feedback:<id>.activities["gc:<line key>"]) and, under the pass mark, what to do next
    items: c => Object.entries((c.callsim && c.callsim.best) || {}).filter(([, b]) => b && typeof b.score === "number").map(([k, b]) => {
      const n = (((c.fb || {}).activities) || {})["gc:" + k], p = num(b.score);
      return {name: b.line || k.replace(/^line:/, ""), pct: p, note: [`${b.calls || 1} call${(b.calls || 1) === 1 ? "" : "s"}, best counts`,
        p != null && p < 80 ? "What you could have done better: read this line's debrief in the Call Sim, practise the one thing it says to change, then take the line again" : "",
        n && n.comment ? `🧑‍🏫 Your trainer: "${String(n.comment).slice(0, 300)}"` : ""].filter(Boolean).join(" · ")}; })},
  {id: "cc", icon: "📞", label: "Case Calls", about: "Each graded call on John Doe's file (Live Calls and the calls the trainer rings in), its best score; an injected call that was missed counts 0.", dims: ["pc", "na", "cd"], how: "The call rubric: BLUF, Risk & Privilege, Composure, A-C-T (25 each); a missed injected call 0.",
    items: c => { const best = {}, cf = c.data["case-flow"] || {};
      (c.data.roleplayHistory || []).filter(h => h && h.categoryId === "caseflow" && typeof h.score === "number").forEach(h => {
        // (a better call replaces the best, and the calls counted before it still count)
        const k = h.topicId || h.topicLabel, n = best[k] ? best[k].n : 0; if(!best[k] || h.score > best[k].score) best[k] = {name: h.topicLabel || k, score: h.score, n}; best[k].n++; });
      const out = Object.values(best).map(b => ({name: b.name, pct: num(b.score), note: `${b.n} call${b.n === 1 ? "" : "s"}`}));
      Object.values(cf.injects || {}).filter(x => x && x.outcome === "missed" && !best["cf-" + x.blockId])
        .forEach(x => out.push({name: `${x.who}: injected call`, pct: 0, note: `Missed · ${fmt(x.at)}`}));
      return out; }},
  {id: "ps", icon: "🧰", label: "Portal Simulators", about: "The best result on each other Training Portal simulator: Medical Records Requests, Court E-Filing, Demand Packets & Binders (the email and calendaring simulators have their own).", dims: ["pc", "na"], how: "Scored by each simulator on the Training Portal. Your best run on each one counts.",
    // a trainer's note on a simulator (js/cm-trainer-notes.js: feedback:<id>.activities["ps:<simulator>"]) and, under the pass mark, what to do next
    items: c => Object.entries((c.sim && c.sim.best) || {}).filter(([k, b]) => simKind(k) === "other" && b && typeof b.score === "number").map(([k, b]) => {
      const n = (((c.fb || {}).activities) || {})["ps:" + k], p = num(b.score);
      return {name: k, pct: p, note: [`${b.count || 1} run${(b.count || 1) === 1 ? "" : "s"}, best counts${b.at ? " · " + fmt(b.at) : ""}`,
        p != null && p < 80 ? "What you could have done better: open this simulator's results on the Training Portal, fix the items it marked wrong, then run it again" : "",
        n && n.comment ? `🧑‍🏫 Your trainer: "${String(n.comment).slice(0, 300)}"` : ""].filter(Boolean).join(" · ")}; })},
  {id: "tr", icon: "📐", label: "Trainer Rubric", about: "The trainer's rubric score on each day's sent review: a tier and points in each of the four dimensions (📐 Feedback Rubric).",
    dims: ["pc", "na", "cp", "cd"], how: "The trainer's points out of 100 (25 / 25 / 30 / 20) on the Feedback Rubric's tiers; a critical item marked breached fails the safety gate.",
    items: c => Object.entries(((c.fb || {}).days) || {}).filter(([, v]) => window.cmRubric && cmRubric.counts(v)).map(([d, v]) => { const t = cmRubric.total(v.rubric), x = cmRubric.tierOf(t);
      return t == null ? null : {name: `Day ${dn(d) || d}: the trainer's rubric`, pct: num(t), note: [x && x.label, v.sentBy, fmt(v.sentAt)].filter(Boolean).join(" · ")}; }).filter(Boolean)}
];
/* ---------- a Case Flow day's columns, the one reading the trainee card, 🏅 Scores and the Batch Sheet's Score Card share ----------
   {sa, call, ap, bd}: the day's items of 🧪 Skill Activities, its graded calls (the work log's latest of
   each), 📝 Action Plan and 📂 Backup Drive (a passed day with no Backup Drive grade is one item at 0, as the model counts it) */
const srcItems = (c, id) => { const s = SOURCES.find(x => x.id === id); try{ return ((s && s.items(c)) || []).filter(x => x && x.pct != null); }catch(e){ return []; } };
const dayOfItem = x => x.day != null ? +x.day : (m => m ? +m[1] : null)(/^Day (\d)/.exec(x.name || ""));
function dayItems(c, d){
  const n = d.cf.n, of = id => srcItems(c, id).filter(x => dayOfItem(x) === n);
  const bd = of("bd").filter(x => !x.unconfirmed);
  if(!bd.length && kcPassed(c, d)) bd.push({name: `Day ${n}: ${n === 1 ? "the firm's folders" : "Backup File Maintenance"}`, day: n, pct: 0, missing: true, note: "Not done: the Backup Drive is required every day"});
  const latest = {}; ((c.data || {})["work-log"] || []).forEach(w => { if(!w || w.kind !== "roleplay" || !fin(w.score) || Number(w.dayId) !== Number(d.id)) return;
    const k = w.label || w.toolId || "Call"; if(!latest[k] || String(w.at || "") > String(latest[k].at || "")) latest[k] = w; });
  const call = Object.values(latest).map(w => ({name: String(w.label || "Call").replace(/^Roleplay — /, ""), day: n, pct: num(w.score), at: w.at || "", tier: w.tier || "", subs: w.subs || null,
    best: w.strengths || [], improve: (w.gaps || []).concat(w.growth || [])}));
  return {sa: of("sa"), call, ap: of("ap"), bd};
}
const avgPct = xs => { const v = xs.map(x => x.pct).filter(fin); return v.length ? Math.round(v.reduce((a, b) => a + b, 0) / v.length) : null; };
// what a Portal simulator's result is: an email simulator, a calendaring simulator, or another
// 📂 the Portal's Backup Drive (the firm's folders, Day 1): its best result, for 📂 Backup Drive when the course has no setup of its own
const PORTAL_SETUP = /^Backup Drive Setup$/i;
const portalSetup = c => { const b = Object.entries((c.sim && c.sim.best) || {}).find(([k, v]) => PORTAL_SETUP.test(k) && v && typeof v.score === "number"); return b ? b[1] : null; };
const simKind = k => /e-?mail|repl/i.test(k) ? "email" : /calend|calsim|litigation week/i.test(k) ? "calendar" : PORTAL_SETUP.test(k) ? "drive" : "other";
// (📝 Action Plan is its own grading system, ap: counted once, not also here)
const CX_GROUPS = new Set(["🔎 Exhibit audits", "🎧 Listening Checks", "🧾 Records screening", "⚖️ Judgement calls"]);
const dn = v => { v = parseInt(v, 10); return v >= 11 && v <= 15 ? v - 10 : v >= 1 && v <= 5 ? v : null; };
function compute(c){
  const rows = SOURCES.map(s => {
    let items = []; try{ items = (s.items(c) || []).filter(x => x && x.pct != null); }catch(e){ items = []; }
    const counted = items.filter(x => !x.unconfirmed);   // (an unconfirmed item is shown, never averaged)
    return {s, items, avg: counted.length ? Math.round(counted.reduce((n, x) => n + x.pct, 0) / counted.length) : null};
  });
  const have = rows.filter(r => r.avg != null);
  const overall = have.length ? Math.round(have.reduce((n, r) => n + r.avg, 0) / have.length) : null;
  const done = cfDays().filter(d => kcPassed(c, d)).length;
  return {rows, overall, systems: have.length, graded: have.reduce((n, r) => n + r.items.filter(x => !x.unconfirmed).length, 0), done, total: cfDays().length};
}
const overallWhy = sc => sc.overall == null ? "Nothing graded yet" : `Grading systems average (not the Overall): the average of ${sc.systems} grading system${sc.systems === 1 ? "" : "s"} = ${sc.overall}%`;
// how THE Overall is made, said the same on every surface
const overallTip = m => m.overall == null ? "Nothing scored yet" : `Overall = the 100-point model's Final: each Case Flow day's score (the four dimensions, 25/25/30/20), weighted by the day's complexity = ${m.overall}%`;
const HOW = "Each grading system's score is the average of its graded items; the grading systems average (not the Overall, which is the 100-point model's Final) is the average of the grading systems that have a score, so each one counts the same.";
// a trainee's records as one context (the trainer's table and the trainee's own page read the same)
const ctxOf = (rec, prog, callsim, sim, fb) => ({rec: rec || {}, cf: (rec && rec.caseFlow) || {days: {}}, data: (prog && prog.data) || {}, callsim, sim, fb: fb || {}});

/* ---------- 🏅 The client's 100-point model ----------
   Four dimensions, weighted: Procedural Compliance & Timeliness 25%, Needs Assessment & Risk Identification 25%,
   Care/Action Plan Quality 30%, Communication & Documentation 20%. Every number CM records feeds exactly one dimension
   (the grader's and the calls' sub-scores are split by what they measure), so nothing is counted twice.
   • A day's dimension score D(k,d) = the mean of its evidence groups (each group = the mean of its items that day).
   • The day score S(d) = Σ w(k)·D(k,d) ÷ Σ w(k) over the dimensions with evidence (a day missing one is provisional).
   • Complexity: Day 1 × 1.0 · Days 2–3 × 1.15 · Days 4–5 × 1.3; Final = Σ S(d)·mult(d) ÷ Σ mult(d) over the scored days.
   • The 4-tier rubric: Exemplary 90–100 · Proficient 80–89 · Developing 65–79 · Needs Improvement below 65 (the Feedback Rubric's tiers, js/cm-rubric.js).
   • Pass = Final ≥ 80% AND the safety gate at 100%: every critical item assessed so far met. A breach is
     "Needs Improvement · safety gate" whatever the score.
   The critical items are the ones CM's records can actually tell: UPL in the AI-reviewed takeaway (its Risk score 0 is
   the reviewer's UPL flag), the privilege items and the hard-date items of the exhibit audits, and the trust-money
   Net Sheet stages (the final disbursement and the litigated Net Sheet) balancing on every check.
   Not in the model (shown in the grading-systems table only): the Learning Check composite (its parts are counted; an AI
   Grader activity whose parts aren't kept counts its total, once); not scored at all: the takeaways (the owner took their
   grades out: only their UPL review stays, as a critical item), 🎲 the random
   tasks (the owner took them out of the scores), Skill Builders, the Call Simulator's and the Portal simulators' bests (not tied to a day or a
   dimension yet), and the Skill Scale self-ratings. */
// 📂 the Backup Drive grading system's items with their day (Day 1's folders, each Backup File Maintenance, the written work)
const backupItems = c => { let xs = []; try{ const s = SOURCES.find(x => x.id === "bd"); xs = (s && s.items(c)) || []; }catch(e){ xs = []; }
  return xs.filter(x => x && x.pct != null).map(x => { const m = /^Day (\d)/.exec(x.name || ""); return Object.assign({}, x, {day: m ? +m[1] : null}); }).filter(x => x.day); };
const MODEL = (function(){
  const DIMS = [
    {id: "pc", icon: "⏱", label: "Procedural Compliance & Timeliness", w: 0.25,
      feeds: "each day's Knowledge Check (best score) · CMS filing (100% first time right, then 100% ÷ attempts) · the day's Backup Drive (the latest of the saved and the Worker's nightly grade, a trainer's override winning) · timeliness (injected calls answered) · the call protocol (the grader's A-C-T score on graded calls)"},
    {id: "na", icon: "🔍", label: "Needs Assessment & Risk Identification", w: 0.25,
      feeds: "the exhibit audits (each item called right) · Listening Checks · the records screening for the amendment requests · the judgement call on each served email · the grader's Risk score on Skill Activities and calls"},
    {id: "cp", icon: "🗺", label: "Care/Action Plan Quality", w: 0.30,
      feeds: "work quality on Skill Activities (the grader's Accuracy and Presence, or the grader's total where only that is kept) · the trainer's Learning Check score · the Action Plan's required steps · each Net Sheet stage's checks"},
    {id: "cd", icon: "✉️", label: "Communication & Documentation", w: 0.20,
      feeds: "calls (the grader's BLUF and Composure scores) · emails and requests sent (100% when the first draft is accepted, then 100% ÷ (refused drafts + 1)) · voicemail transcripts (facts caught) · the grader's Efficiency score on Skill Activities"}];
  const MULT = {1: 1.0, 2: 1.15, 3: 1.15, 4: 1.3, 5: 1.3};
  // the tiers are the Feedback Rubric's (js/cm-rubric.js), the one rubric every graded piece of work is read in
  const TIERS = ((window.cmRubric && cmRubric.TIERS) || [{min: 90, n: 4, label: "Exemplary", band: "90–100%"}, {min: 80, n: 3, label: "Proficient", band: "80–89%"},
    {min: 65, n: 2, label: "Developing", band: "65–79%"}, {min: 0, n: 1, label: "Needs Improvement", band: "below 65%"}]).map(t => ({min: t.min, n: t.n, label: t.label, band: t.band}));
  const PASS = 80;
  const CRIT = [
    {id: "upl", label: "UPL: no legal advice",
     why: "Only a lawyer may give legal advice. Telling a client what the case is worth, or what a fact does to it, is practising law without a license: it can mislead the client and put the firm at risk.",
     better: "Share facts and the process only. When the client asks about value or consequences, say Atty. Thorne will answer, log the question and route it to him the same day.", how: "The review of each day's takeaway (CM Self-Summary) scores Risk 0 when the trainee gives the client legal advice: a 0 is a breach."},
    {id: "priv", label: "Privilege",
     why: "Privileged papers (an attorney memo, the Master Case Summary, a claim-specific HIPAA authorization, a confidential mediation statement) must never reach the other side: sending one can waive the protection.",
     better: "Before a set goes out, check every document for privileged material, pull it out and flag it to Atty. Thorne.", how: "The exhibit audits' privilege items (a privileged memo, the Master Case Summary, a claim-specific HIPAA authorization, a confidential mediation statement): each must be called right."},
    {id: "date", label: "Hard dates",
     why: "A missed court date, response window or lien deadline can end a claim or cost the client money, and it cannot be undone.",
     better: "Count each date from its trigger with the rule written beside it, calendar the earlier date when unsure, and have Atty. Thorne confirm.", how: "The exhibit audits' calendar items (a due date, a lien notice's response window): each must be called right."},
    {id: "trust", label: "Trust money",
     why: "Client money in trust must be right to the cent: a wrong figure or an early disbursement breaks trust-account rules and can harm the client.",
     better: "Check each figure against its document, make the ledger reach $0.00, and release nothing until Atty. Thorne approves.", how: "The Net Sheet's trust-money stages (the final disbursement and the litigated Net Sheet): every check must pass."}];
  const tierOf = v => v == null ? null : TIERS.find(t => v >= t.min);
  const mtone = v => v == null ? "" : v >= PASS ? "gs-hi" : v >= 65 ? "gs-mid" : "gs-lo";
  const mean = a => a.length ? a.reduce((n, x) => n + x, 0) / a.length : null;
  const taught = taughtOf;
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
    // ⏱ Procedural Compliance & Timeliness
    cfDays().forEach(d => { const p = dp[d.id] || {}, s = cfDay(c, d), kc = kcBest(p, s);
      if(typeof kc !== "number") return;
      add("pc", "✍️ Knowledge Check", d.cf.n, `Day ${d.cf.n} Knowledge Check`, kc, kc >= 70 ? "Passed (best score kept)" : "Below 70%: the day isn't passed yet"); });
    // 📂 the Backup Drive, required every day: Day 1's folders, each later day's Backup File Maintenance and the written work
    // on the drive (the 📂 Backup Drive grading system's own items, with a trainer's override); a passed day with no grade counts 0
    const bdItems = backupItems(c);
    bdItems.forEach(x => add("pc", "📂 Backup Drive", x.day, x.name.replace(/^Day \d+: /, ""), x.pct, x.note));
    cfDays().forEach(d => { const n = d.cf.n, p = dp[d.id] || {}, s = cfd[n] || {};
      if(kcPassed(c, d) && !bdItems.some(x => x.day === n)) add("pc", "📂 Backup Drive", n, n === 1 ? "The firm's folders" : "Backup File Maintenance", 0, "Not done: the Backup Drive is required every day"); });
    Object.entries(data["doc-filing"] || {}).forEach(([id, r]) => { if(!r || !(r.attempts > 0)) return; const doc = DOCS.find(x => x.id === id) || {};
      add("pc", "🗂 CMS filing", doc.day, doc.title || r.name || id, r.filed ? 100 / r.attempts : 0, r.filed ? (r.attempts === 1 ? "Filed first time right" : `Filed in ${r.attempts} attempts`) : "Not filed yet"); });
    // (🎲 random tasks are not in the model: their log and the Recent progress rows stay, unscored here)
    Object.values(R.injects || {}).forEach(x => { if(!x || !x.outcome) return;
      add("pc", "⏰ Timeliness", dn(x.dayId) || taught(x.blockId), `${x.who || "Injected"} call`, x.outcome === "answered" ? 100 : 0, x.outcome === "answered" ? "Injected call answered" : "Injected call missed"); });
    // the work log: the grader's sub-scores, split by what they measure (the latest of each activity)
    const latest = {}; (data["work-log"] || []).forEach(e => { if(!e || (e.kind !== "lab" && e.kind !== "roleplay")) return; const k = e.kind + "|" + (e.label || e.toolId || "");
      if(!latest[k] || String(e.at || "") >= String(latest[k].at || "")) latest[k] = e; });
    // (a Skill Activity whose latest attempt is a newer AI Grader grade than this line counts by that grade, below: skillActs)
    const sa = skillActs(c), newer = new Set(sa.filter(x => x.from === "the grader" && !x.logged).map(x => x.key));
    // (each part with the grader's own words beside it: under 70% the first gap it found, else the first thing done well)
    const said = (base, v, best, gaps) => { const t = (v < 70 ? (gaps || [])[0] : (best || [])[0] || (gaps || [])[0]); const w = String(t || "").replace(/\s+/g, " ").trim();
      return w ? `${base}: ${w.length > 170 ? w.slice(0, 169) + "…" : w}` : base; };
    Object.values(latest).forEach(e => { const day = labDay(e), s = e.subs || {}, name = String(e.label || "Activity").replace(/^Day \d+ · /, ""), why = (b, v) => said(b, v, e.strengths, e.gaps);
      if(e.kind === "lab" && !/Self-Summary/.test(e.label || "") && newer.has(labKey(e))) return;
      // (📝 the takeaway's review, — CM Self-Summary: not scored, only its UPL flag is read, as a critical item)
      if(e.kind === "lab" && /Self-Summary/.test(e.label || "")){
        if(typeof s.risk === "number") gate("upl", day, name, s.risk > 0, s.risk > 0 ? "No legal advice found" : "Breach: your written work gave the client legal advice (the case's value, its merits or a legal consequence)");
      } else if(e.kind === "lab"){
        if(typeof s.accuracy === "number" && typeof s.presence === "number") add("cp", "🧪 Work quality", day, name, (s.accuracy * 35 + s.presence * 30) / 65, why("The grader's Accuracy and Presence", (s.accuracy * 35 + s.presence * 30) / 65));
        else if(typeof e.score === "number") add("cp", "🧪 Work quality", day, name, e.score, "The review's total");
        if(typeof s.risk === "number") add("na", "⚠️ Risk identification", day, name, s.risk, why("The grader's Risk score", s.risk));
        if(typeof s.efficiency === "number") add("cd", "🗒 Documentation", day, name, s.efficiency, why("The grader's Efficiency score", s.efficiency));
      } else {
        if(typeof s.act === "number") add("pc", "📞 Call protocol", day, name, s.act, why("The grader's A-C-T score", s.act));
        if(typeof s.risk === "number") add("na", "⚠️ Risk identification", day, name, s.risk, why("The grader's Risk & Privilege score", s.risk));
        if(typeof s.bluf === "number" && typeof s.composure === "number") add("cd", "📞 Calls", day, name, (s.bluf + s.composure) / 2, why("The grader's BLUF and Composure", (s.bluf + s.composure) / 2));
      } });
    // 🧪 a Skill Activity whose latest attempt is an AI Grader grade (cf-ai-grades) with no work-log line of its own (its
    // sub-scores aren't kept): its total, once (skillActs: one activity is one key, its latest attempt)
    // (with its rubric parts kept, js/cm-ai-grader.js subs, it is split by what they measure, as a work-log line is)
    sa.forEach(x => { if(x.from !== "the grader" || x.logged) return; const s = x.subs;
      const xw = (b, v) => said(b, v, x.best, x.improve);
      if(!s){ add("cp", "🧪 Work quality", x.day, x.name, x.pct, xw("The grader's total", x.pct)); return; }
      add("cp", "🧪 Work quality", x.day, x.name, (s.accuracy * 35 + s.presence * 30) / 65, xw("The grader's Accuracy and Presence", (s.accuracy * 35 + s.presence * 30) / 65));
      add("na", "⚠️ Risk identification", x.day, x.name, s.risk, xw("The grader's Risk score", s.risk));
      add("cd", "🗒 Documentation", x.day, x.name, s.efficiency, xw("The grader's Efficiency score", s.efficiency)); });
    // 🔍 Needs Assessment: the exhibit audits handed in (their privilege and calendar items are critical)
    Object.entries(R.audits || {}).forEach(([b, r]) => { const a = (EX.audits || {})[b]; if(!a || !r || !r.at || !Array.isArray(a.items)) return;
      // 🛡 the score it was handed in with (js/cm-credit-kept.js), not one worked out again on a key changed since
      const marks = r.marks || [], ks = window.cmCreditKept && cmCreditKept.audit(b, r, a), right = ks ? ks.right : a.items.filter((it, i) => marks[i] === it.verdict).length, of = ks ? ks.of : a.items.length, day = taught(b);
      add("na", "🔎 Exhibit audits", day, a.title || b, 100 * right / of, `${right} of ${of} items called right`);
      a.items.forEach((it, i) => { if(it.kind !== "privilege" && it.kind !== "calendar") return; const ok = marks[i] === it.verdict;
        gate(it.kind === "privilege" ? "priv" : "date", day, `${a.title || b} · ${it.ref ? it.ref + ": " : ""}${it.what || "item " + (i + 1)}`, ok, ok ? `Called right (${it.verdict})` : `Breach: you called it "${marks[i] || "nothing"}"; it should be "${it.verdict}"`); }); });
    Object.entries(R.listen || {}).forEach(([b, r]) => { const e = (SIM.events || {})[b]; if(!r || !r.at || !e || !e.listen || !e.listen.length) return;
      add("na", "🎧 Listening Checks", taught(b), `Listening Check (${b})`, 100 * (r.score || 0) / e.listen.length, `${r.score || 0} of ${e.listen.length} caught`); });
    // (one amendment set worked on two activities, amendSets: its better screening and each request's better email)
    amendSets(R).forEach(set => { let scr = null; const req = {};
      set.forEach(([b, r]) => { const a = (EX.amendments || {})[b]; if(!a) return; const day = taught(b);
        if(r.screened && Array.isArray(a.screen) && a.screen.length){ const asked = new Set((a.requests || []).map(q => q.doc)), ks = window.cmCreditKept && cmCreditKept.screen(b, r, a);
          const ok = ks ? ks.right : a.screen.filter(s => ((r.marks || {})[s.doc] === "fix") === asked.has(s.doc)).length, of = ks ? ks.of : a.screen.length;
          if(!scr || 100 * ok / of > scr.v) scr = {v: 100 * ok / of, day, title: a.title || b, note: `${ok} of ${of} records called right`}; }
        Object.entries(r.req || {}).forEach(([doc, x]) => { const v = sentScore(x); if(v != null && (!req[doc] || v > req[doc].v)) req[doc] = {v, day, x}; }); });
      if(scr) add("na", "🧾 Records screening", scr.day, scr.title, scr.v, scr.note);
      Object.entries(req).forEach(([doc, q]) => add("cd", "✉️ Written communication", q.day, `Amendment request: ${doc}`, q.v, sentNote(q.x))); });
    Object.entries(R.service || {}).forEach(([b, r]) => { const e = (EX.emails || {})[b]; if(!e || !r) return; const day = taught(b), title = clean(e.title) || b;
      const jc = window.cmCreditKept ? cmCreditKept.choice(b, r, e) : (r.choice != null && e.press && e.press.choices && e.press.choices[r.choice] ? {ok: !!e.press.choices[r.choice].ok} : null);
      if(jc) add("na", "⚖️ Judgement calls", day, title, jc.ok ? 100 : 0, jc.ok ? "The right call" : "A call that costs the file");
      const v = sentScore(r); if(v != null) add("cd", "✉️ Written communication", day, title, v, sentNote(r)); });
    Object.entries(R.notes || {}).forEach(([b, r]) => { const n = (EX.notes || {})[b]; if(!n || !r) return; const day = taught(b);
      const facts = ((n.transcribe || {}).facts || []).length, req = ((n.plan || {}).required || []).length;
      if(r.txAt && facts) add("cd", "🗒 Documentation", day, "Voicemail transcript", typeof r.txScore === "number" ? r.txScore : 100 * (r.txGot || []).filter(Boolean).length / facts,
        `${(r.txGot || []).filter(Boolean).length} of ${facts} facts caught${(r.txTries || []).length ? ` · ${r.txTries[r.txTries.length - 1].acc}% word accuracy · ${r.txTries.length} graded attempt${r.txTries.length === 1 ? "" : "s"}` : ""}`);
      (n.emails || []).forEach(e => { const v = sentScore((r.mails || {})[e.id]); if(v != null) add("cd", "✉️ Written communication", day, clean(e.title), v, sentNote(r.mails[e.id])); }); });
    // 📝 the action plans (the 📝 Action Plan grading system's own items: counted here once)
    actionPlans(c).forEach(x => add("cp", "📝 Action Plan", x.day, x.name, x.pct, x.note));
    // 🗺 the trainer's Learning Check score (feedback:<id>, trainer-owned: the trainee cannot change it)
    Object.entries((c.fb && c.fb.caseFlow) || {}).forEach(([m, x]) => { if(!x || typeof x.score !== "number") return;
      add("cp", "🧑‍🏫 Trainer's Learning Check", modDay(m), (names[m] && names[m].title) || m, x.score, x.comment ? String(x.comment).slice(0, 160) : "Scored by the trainer"); });
    // 🗂 the CMS case file (js/cm-cms-file.js): the Check Your Work items of each CMS activity worked, by area, in the
    // dimension the area belongs to. Its documents are the 🗂 CMS filing above already, and an activity never worked is
    // the file grade's own (🗂 CMS Case File), so neither is counted twice here; nor is an item whose score is the activity's
    // AI Grader grade (fromAI), which counts once, under 🧪 Work quality.
    try{ if(window.cmCmsFile) cmCmsFile.compute(c).days.forEach(x => x.areas.forEach(a => { if(a.a.id === "docs" || a.a.id === "open") return;
      const its = a.items.filter(i => i.pct != null && !i.unworked && !i.fromAI); if(!its.length) return;
      add(a.a.dim, "🗂 CMS case file", x.n, `CMS file: ${a.a.label}`, mean(its.map(i => i.pct)), `${its.filter(i => i.pct === 100).length} of ${its.length} Check Your Work items in the file`); })); }catch(e){}
    // 📐 the trainer's rubric on a sent day review (feedback:<id>, trainer-owned): its points per dimension, its critical items
    Object.entries((c.fb && c.fb.days) || {}).forEach(([d, v]) => { if(!(window.cmRubric && cmRubric.counts(v))) return; const day = dn(d), rb = v.rubric;
      cmRubric.DIMS.forEach(k => { const x = rb.dims[k.id]; if(x && typeof x.pts === "number") add(k.id, "📐 Trainer rubric", day, `Trainer's rubric: ${k.label}`, 100 * Math.min(k.pts, x.pts) / k.pts, `${x.pts} of ${k.pts} points · ${cmRubric.tierOf(100 * x.pts / k.pts).label}`); });
      Object.entries(rb.crit || {}).forEach(([id, m]) => { if(m === "met" || m === "breach") gate(id, day, `Trainer's review, Day ${day}`, m === "met", m === "met" ? "Marked met by the trainer" : "Breach: your trainer marked this on the day's review"); }); });
    // (the day each stage is worked: lien negotiations (d3m3) and the final disbursement (d3m4) are Track A, Day 3)
    const NSD = {recovery: 3, bi: 3, um: 3, liens: 3, final: 3, litigation: 5};
    Object.values(((data["net-sheet"] || {}).files) || {}).forEach(f => Object.entries((f && f.checks) || {}).forEach(([st, k]) => { k = nsBest(k); if(!k || !k.total) return;
      add("cp", "📊 Net Sheet", NSD[st] || null, NS_STAGES[st] || st, 100 * k.passed / k.total, `${k.passed} of ${k.total} checks`);
      if(st === "final" || st === "litigation") gate("trust", NSD[st], NS_STAGES[st] || st, k.passed === k.total, k.passed === k.total ? "Every check passed" : `Breach: ${k.total - k.passed} trust-money check${k.total - k.passed === 1 ? "" : "s"} did not pass`); }));
    return {items, crit};
  }
  // Daily compliance (a sub-score, shown beside the Overall, not part of it): each day reached, its two scored deliverables
  // (Knowledge Check passed, the day's Backup Drive graded; the takeaway is not scored)
  function dayComp(c, d){
    const p = (c.rec.dayProgress || {})[d.id] || {}, s = cfDay(c, d), bd = backupItems(c).some(x => x.day === d.cf.n), kc = kcBest(p, s);
    if(!(fin(kc) || kcPassed(c, d) || bd)) return null;
    const parts = [{label: "✍️ Knowledge Check passed", v: kcPassed(c, d) ? 100 : 0}, {label: "📂 Backup Drive graded", v: bd ? 100 : 0}];
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
    // THE Overall: the 100-point model's Final, the one number every surface shows (the trainee card, 🏅 Scores, the Batch
    // Sheet, My Scores) and the one Pass is read on; the Daily compliance is a sub-score beside it (its parts are already graded in it)
    const overall = final;
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
  // (T.screenHide: columns kept in ⬇ Download but not drawn on screen; T.noRowNums: no row numbers — both for more room)
  const keep = T.head.map((h, i) => i).filter(i => !(T.screenHide || []).includes(T.head[i])), n = keep.length, rn = !T.noRowNums;
  return `<section class="bs-sec" id="scx-${T.id}"><h3 class="bs-h">${E(T.title)} <span>${T.rows.length} row${T.rows.length === 1 ? "" : "s"}</span></h3>${T.note ? `<p class="bs-note">${E(T.note)}</p>` : ""}${T.warn ? `<p class="bs-warn" role="alert">⚠ ${E(T.warn)}${window.cmRunNow ? `<button type="button" onclick="cmRunNow.run('ai')">🤖 Run the AI check</button>` : ""}</p>` : ""}${T.info ? `<p class="bs-info" role="status">${E(T.info)}</p>` : ""}
    <div class="gs-wrap"><table class="gs${rn ? "" : " gs-norn"}" role="grid"><thead>
      <tr class="gs-letters">${rn ? `<th class="gs-corner"></th>` : ""}${keep.map((i, k) => `<th class="${k === 0 ? "gs-frz" : ""}">${letter(k)}</th>`).join("")}</tr>
      <tr class="gs-head">${rn ? `<th class="gs-rn">1</th>` : ""}${keep.map((i, k) => `<th class="${k === 0 ? "gs-frz" : ""}">${E(T.head[i])}</th>`).join("")}</tr></thead>
      <tbody>${T.rows.map((r, ri) => `<tr${T.rowCls && T.rowCls[ri] ? ` class="${T.rowCls[ri]}"` : ""}${T.onRow && T.onRow[ri] ? ` onclick="${T.onRow[ri]}"` : ""}>${rn ? `<th class="gs-rn">${ri + 2}</th>` : ""}${keep.map((ci, k) => { const c = r[ci] || {}; return `<td tabindex="0" class="${c.cls || ""}${k === 0 ? " gs-frz" : ""}"${c.f ? ` title="${E(c.f)}"` : ""}>${c.html != null ? c.html : E(c.v)}</td>`; }).join("")}</tr>`).join("")}
      ${T.rows.length ? "" : `<tr class="gs-empty">${rn ? `<th class="gs-rn">2</th>` : ""}<td colspan="${n}" class="bs-none">${E(T.empty || "Nothing yet.")}</td></tr>`}</tbody></table></div>${T.foot ? `<p class="bs-note bs-foot">${E(T.foot)}</p>` : ""}${T.none ? `<p class="bs-none-line">${E(T.none)}</p>` : ""}</section>`;
}
// 🏅 Scores, as shown: a short row per trainee, easy to read: the days passed, each Case Flow day's score, the Knowledge
// Checks, the AI-graded activities, the Total (the 100-point model's Final) and the Result. Hover a cell for how it's made.
// The CSV (⬇ Download) keeps every column: scoresSheet(rows, me, true).
function dayKc(c, d){ const p = (c.rec.dayProgress || {})[d.id] || {}, s = cfDay(c, d); return num(kcBest(p, s)); }
function shortSheet(rows, me){
  // the trainer's: the one 🏅 Scores table, with the day cells, the kinds of work and the Lessons and Recent progress folded in
  // (js/cm-batch-sheet.js scoresSheet, the same rows, cmScorecard.overall's numbers)
  if(!me && window.cmBatchSheet && cmBatchSheet.scoresSheet){ const T = cmBatchSheet.scoresSheet(rows);
    return Object.assign(T, {rowCls: T.order.map(r => ALL.pick === r.id ? "gs-picked" : ""), onRow: T.order.map(r => `cmScorecard.pick('${E(r.id)}')`)}); }
  const mc = (v, f, extra) => ({v: v == null ? "" : v + "%", f, cls: "gs-num " + MODEL.mtone(v) + (extra ? " " + extra : "")});
  const avgOf = (r, id) => (r.sc.rows.find(x => x.s.id === id) || {}).avg;
  return {id: "scores", title: "🏅 Scores",
    note: me ? "" : "Click a trainee for their card. Hover a score to see how it is made.",
    head: ["Trainee"].concat(me ? [] : ["Batch"], ["Days passed"], cfDays().map(d => `Day ${d.cf.n} %`), ["✍️ Knowledge Checks %", "🧪 Activities (graded) %", "Overall %", "Result"]),
    rows: rows.map(r => { const m = r.m, kc = avgOf(r, "kc"), sa = avgOf(r, "sa");
      return [{v: r.name, f: r.name, cls: "gs-name"}].concat(me ? [] : [{v: batchOf(r.batch), f: r.batch, cls: "gs-batch"}],
        [{v: `${r.sc.done} / ${r.sc.total}`, f: `${r.sc.done} of the ${r.sc.total} Case Flow days passed (70% on the Knowledge Check passes a day)`, cls: "gs-num"}],
        cfDays().map(d => { const x = m.days.find(y => y.n === d.cf.n) || {}, k = dayKc(r.c, d);
          return mc(x.S, x.S == null ? `Day ${d.cf.n}: nothing scored yet` : `Day ${d.cf.n}: ${x.S}%${k == null ? "" : ` · Knowledge Check ${k}%`}`); }),
        [pcell(kc, kc == null ? "No Knowledge Check taken yet" : "The average of the days' Knowledge Checks (one attempt each)"),
         pcell(sa, sa == null ? "No activity graded yet" : "The average of the graded activities (the grader's score, latest attempt of each)"),
         mc(m.overall, overallTip(m), "gs-calc gs-bold"),
         {v: MODEL.STATUS[m.status], f: `Pass = Overall ≥ ${MODEL.PASS}% and the safety gate at 100%`, cls: m.status === "pass" ? "gs-hi" : m.status === "none" ? "" : m.status === "pending" ? "gs-mid" : "gs-lo"}]); }),
    rowCls: rows.map(r => !me && ALL.pick === r.id ? "gs-picked" : ""),
    onRow: me ? null : rows.map(r => `cmScorecard.pick('${E(r.id)}')`),
    empty: me ? "Collecting your grades…" : "No approved trainee in this batch yet."};
}
// 🏅 Scores in full (the CSV): the 100-point model (its four dimensions, the Final, the tier, the safety gate and the
// result), the Daily compliance and the Overall, then each grading system (blank: nothing graded yet) and their average
function scoresSheet(rows, me, full){
  if(!full) return shortSheet(rows, me);
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
       mc(m.overall, overallTip(m), "gs-calc gs-bold")],
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
    r.items.forEach(x => { rows.push([{v: "", f: r.s.label}, {v: x.name, f: x.name, cls: "gs-txt"}, {v: x.note || "", f: x.note || "", cls: "gs-txt gs-det"}, pcell(x.pct, `${x.name}: ${pctTxt(x.pct)}${x.auto ? " (automated only)" : ""}${x.unconfirmed ? " (unconfirmed: not counted)" : ""}`)]); cls.push(""); });
  });
  rows.push([{v: "Grading systems average", f: overallWhy(sc), cls: "gs-name"}, {v: overallWhy(sc), f: overallWhy(sc), cls: "gs-txt"}, {v: `${sc.graded} graded item${sc.graded === 1 ? "" : "s"}`, f: `${sc.graded} graded items`, cls: "gs-det"}, pcell(sc.overall, overallWhy(sc), "gs-calc gs-bold")]); cls.push("gs-total");
  return {id: "detail", title: `🔎 Grades in detail${who ? ": " + who : ""}`, note: "Each grading system's row has its average; its graded items are under it.",
    head: ["Grading system", "Item", "Detail", "Score"], rows, rowCls: cls};
}
// the page's header, as Foundational's (ftBanner): a navy band, the kicker, the title, the batch, the sheet's buttons in it
function sheetTop(title, sub, controls, right, below){   // below: HTML under the title (the Scorecards' trainee picker)
  return `<div class="ft-banner scx-banner"><div><p class="ft-banner-k">Legal Support Help · Case Management Training</p><h2>🏅 ${E(title)}</h2>${sub ? `<p class="ft-banner-sub">${sub}</p>` : ""}${below || ""}</div>
    ${right ? `<div class="ft-banner-right">${right}</div>` : ""}<div class="ft-banner-ctl"><span class="gs-menu">${controls}</span></div></div>`;
}

/* ---------- the trainee card, in Foundational Training's batch-sheet format (its js/ft-batch-sheet.js perTraineeHtml), the
   standard format for all scorecards: the name and the pills (Overall · Daily compliance) in a navy band, the
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
/* a safety-gate breach explained: what happened, why it is a gate, and what could have been done better */
function gateWhy(x, k){
  const happened = String(x.note || "").replace(/^Breach:\s*/, "");
  return `<span class="bs-gate-why">${happened ? `<span><b>What happened:</b> ${E(happened.charAt(0).toUpperCase() + happened.slice(1))}.</span>` : ""}${k.why ? `<span><b>Why it's a safety gate:</b> ${E(k.why)}</span>` : ""}${k.better ? `<span><b>What you could have done better:</b> ${E(k.better)}</span>` : ""}</span>`;
}
/* 🎯 Focus on, as a table: every safety-gate breach first, then the scores below the pass mark (lowest first), one row each:
   the item, its day, the dimension (or "safety gate"), its score and what to do about it. In a trainer's view of a card it is
   the first thing in 💬 Feedback on Practical Activities (js/cm-batch-sheet.js feedbackHtml), not a box of its own. */
function focusHtml(m){
  const P = MODEL.PASS, clip = (t, n) => (t = String(t || "").replace(/\s+/g, " ").trim()).length > n ? t.slice(0, n - 1) + "…" : t;
  const dimOf = id => MODEL.DIMS.find(k => k.id === id);
  const row = (cls, item, day, area, score, tone, detail) => `<tr class="${cls}"><th scope="row" class="bs-fo-i">${item}</th><td class="bs-fo-d">${day}</td><td class="bs-fo-a">${area}</td><td class="bs-fo-s"><b class="bs-sbox ${tone}">${score}</b></td><td class="bs-fo-x">${detail}</td></tr>`;
  const li = x => row("bs-fo-lo", E(clip(x.name, 90)), `Day ${x.day}`, E(dimOf(x.dim).label), `${x.pct}%`, "gs-lo", x.note ? E(clip(x.note, 180)) : "<i>—</i>");
  const gate = m.gate.breaches.map(x => { const k = MODEL.CRIT.find(c => c.id === x.id) || {};
    return row("bs-fo-gate", `⛔ ${E(clip(x.name, 110))}`, `Day ${x.day}`, `Safety gate · ${E(k.label || "")}`, "Breach", "gs-lo", gateWhy(x, k)); });
  if(!m.items.length && !gate.length) return "";
  const low = m.items.filter(x => x.pct < P).sort((a, b) => a.pct - b.pct), up = m.items.filter(x => x.pct >= P && x.pct < 90).sort((a, b) => a.pct - b.pct);
  const table = (rows, more) => `<div class="bs-fo-wrap"><table class="bs-fo-t"><thead><tr><th>Item</th><th>Day</th><th>Area</th><th>Score</th><th>What happened · what to do</th></tr></thead><tbody>${rows}</tbody></table></div>${more ? `<small>${more}</small>` : ""}`;
  if(gate.length || low.length) return `<div class="bs-in bs-in-lo"><b>🎯 Focus on</b> (below the pass mark of ${P}%${gate.length ? ", and every safety-gate breach" : ""}):${table(gate.slice(0, 4).join("") + low.slice(0, 4).map(li).join(""), low.length > 4 ? `and ${low.length - 4} more below ${P}% in the Day scores.` : "")}</div>`;
  if(up.length) return `<div class="bs-in bs-in-ok"><b>✓ Above the pass mark on every score.</b> To move up to Exemplary (90%+):${table(up.slice(0, 3).map(x => row("", E(clip(x.name, 90)), `Day ${x.day}`, E(dimOf(x.dim).label), `${x.pct}%`, "gs-mid", x.note ? E(clip(x.note, 180)) : "<i>—</i>")).join(""), "")}</div>`;
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
      `100% is required on the critical items: one breach means Needs Improvement whatever the score, because each protects the client or the firm from harm that can't be undone. <ul class="bs-pt-ul">${crit}</ul>`)}
    ${row("Final", mpct(m.final), MODEL.mtone(m.final),
      m.final == null ? "Nothing scored yet." : `Final = Σ(day score × multiplier) ÷ Σ multipliers = (${E(days)}) ÷ ${Math.round(m.msum * 100) / 100} = <b>${m.final}%</b>. Each day score is Σ(weight × dimension) over the dimensions with evidence that day. Complexity: Day 1 × 1.0 · Days 2–3 × 1.15 · Days 4–5 × 1.3.`, "bs-pt-final")}
    ${row("Tier &amp; result", m.tier ? `${m.tier.n} · ${E(m.tier.label)}` : "—", m.status === "pass" ? "gs-hi" : m.status === "none" ? "gs-na" : m.status === "pending" ? "gs-mid" : "gs-lo",
      `<b>${E(MODEL.STATUS[m.status])}.</b> Pass = Final ≥ ${MODEL.PASS}% and the safety gate at 100%. The rubric: ${T.map(t => `<b>${t.n} ${E(t.label)}</b> ${E(t.band)}`).join(" · ")}; a safety-gate breach is Needs Improvement whatever the score.`)}
  </tbody></table>`;
}
// a day's columns as the Batch Sheet's Score Card shows them (dayItems: the same items, the same averages)
function dayLine(x, c){
  const k = c ? dayKc(c, x.d) : null, I = c ? dayItems(c, x.d) : null, v = (l, xs) => { const a = xs ? avgPct(xs) : null; return a == null ? "" : `${l} <b>${a}%</b>`; };
  const bits = [k == null ? "✍️ Knowledge Check: not taken" : `✍️ Knowledge Check <b>${k}%</b>`, I ? v("🧪 Activities & calls", I.sa.concat(I.call)) : "",
    I ? v("📝 Action Plan", I.ap) : "", I ? v("📂 Backup Drive", I.bd) : "", x.comp ? `✅ Daily compliance <b>${x.comp.pct}%</b>` : ""].filter(Boolean);
  return `<div class="bs-pt-line">${bits.join(" · ")}</div>`;
}
function daysTable(m, c){
  const rows = m.days.map(x => {
    const parts = [];
    if(x.comp) x.comp.parts.forEach(p => parts.push({group: "✅ Daily compliance", groupV: x.comp.pct + "%", top: true, name: p.label, v: p.v ? "Done" : "Not yet", tone: p.v ? "gs-hi" : "gs-lo"}));
    x.dims.forEach(dm => { if(dm.v == null) return;
      parts.push({group: `${dm.k.icon} ${dm.k.label} · ${Math.round(dm.k.w * 100)}%`, groupV: dm.v + "%", top: true});
      dm.groups.forEach(gr => gr.items.forEach(it => parts.push({group: gr.name, groupV: gr.v + "%", name: it.name, v: it.pct + "%", tone: MODEL.mtone(it.pct), text: it.note}))); });
    if(x.crit.length) x.crit.forEach(cr => { const k = MODEL.CRIT.find(c => c.id === cr.id) || {};
      parts.push({group: "⛔ Safety gate: critical items", top: true, crit: true, name: cr.name, v: cr.met ? "Met" : "Breach", tone: cr.met ? "gs-hi" : "gs-lo",
        text: cr.met ? cr.note : [String(cr.note || "").replace(/^Breach:\s*/, "What happened: "), k.why ? "Why it's a safety gate: " + k.why : "", k.better ? "What you could have done better: " + k.better : ""].filter(Boolean).join(" ")}); });
    const label = `${E(dayName(x.d))}<small class="bs-pt-mult">× ${mx(x.mult)} complexity${x.provisional ? " · provisional: not every dimension has evidence yet" : ""}</small>`;
    const pt = partsTable(parts);
    return `<tr><td class="bs-pt-m">${label}</td><td class="bs-pt-v ${MODEL.mtone(x.S)}">${x.S == null ? "—" : x.S + "%"}</td><td class="bs-pt-f">${x.S == null && !pt ? `<span class="bs-none">Nothing scored on this day yet.</span>` : dayLine(x, c)}${pt ? `<details class="bs-pt-parts"><summary>▸ What makes up this score</summary>${pt}</details>` : ""}</td></tr>`; }).join("");
  return `<table class="bs-pt-t bs-pt-s-days"><colgroup><col class="bs-pt-c1"><col class="bs-pt-c2"><col></colgroup><tbody>
    <tr class="bs-pt-sec"><th colspan="3">📅 Day scores</th></tr>
    <tr><td class="bs-pt-m">Overall</td><td class="bs-pt-v ${MODEL.mtone(m.final)}">${mpct(m.final)}</td><td class="bs-pt-f">${m.scored.length ? `The ${m.scored.length} scored day${m.scored.length === 1 ? "" : "s"}, weighted by complexity` : "No day scored yet"}${m.comp != null ? ` · Daily compliance ${m.comp}% over ${m.compDays} day${m.compDays === 1 ? "" : "s"} reached` : ""}</td></tr>
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
/* The Scorecards hero names the trainee shown in a dropdown of every trainee shown (the batch picked), with their batch
   beside it: choosing a name shows that trainee's card. The page shows one trainee's card at a time. */
function whoPick(r){
  const rows = shownRows();
  return `<b class="bs-pt-who"><select aria-label="Trainee: choose a name to open their card" title="Choose a name to open that trainee's card" onchange="cmScorecard.only(this.value)">${rows.map(o => `<option value="${E(o.id)}" ${o.id === r.id ? "selected" : ""}>${E(o.name)}</option>`).join("")}</select></b>`;
}
function cardHtml(r, me){
  const m = r.m, why = {
    overall: overallTip(m),
    comp: m.comp == null ? "No day reached yet" : `Daily compliance (a sub-score, not the Overall): the average of ${m.compDays} day${m.compDays === 1 ? "" : "s"}' deliverables done (Knowledge Check passed, the Backup Drive graded) = ${m.comp}%`};
  const pills = [["Overall", m.overall, why.overall], ["Daily compliance", m.comp, why.comp]];
  const rtone = m.status === "pass" ? "gs-hi" : m.status === "pending" ? "gs-mid" : m.status === "none" ? "" : "gs-lo";
  const inFb = !me && !!(window.cmBatchSheet && cmBatchSheet.feedbackHtml);   // a trainer's view: 🎯 Focus on opens 💬 Feedback on Practical Activities
  return `<div class="bs-pt${!me && ALL.pick === r.id ? " bs-pt-on" : ""}" id="bs-pt-${domId(r.id)}" data-id="${E(r.id)}">
    <div class="bs-pt-h"><b class="bs-pt-name">${E(r.name)}</b>${!me && r.batch ? `<i>${E(batchOf(r.batch))}</i>` : ""}
      ${pills.map(([l, v, f]) => `<span class="bs-pt-k ${MODEL.mtone(v)}" title="${E(f)}">${E(l)} <b>${mpct(v)}</b></span>`).join("")}
      <span class="bs-pt-k bs-pt-r ${rtone}" title="Pass = Final ≥ ${MODEL.PASS}% and the safety gate at 100%">${m.tier ? E(m.tier.label) + " · " : ""}<b>${E(MODEL.STATUS[m.status])}</b></span></div>
    ${inFb ? "" : focusHtml(m)}
    <div class="bs-pt-wrap">${daysTable(m, r.c)}${!me && window.cmCompliance ? cmCompliance.html(r) : ""}${!me && window.cmSendProgress ? cmSendProgress.cardHtml(r) : ""}${inFb ? cmBatchSheet.feedbackHtml(r, focusHtml(m)) : ""}
      <details class="bs-pt-src bs-pt-how"><summary>▸ How this is scored (the 100-point model, the CMS case file, every graded item)</summary>
        ${modelTable(m)}${window.cmCmsFile ? cmCmsFile.html(cmCmsFile.compute(r.c), me) : ""}${window.cmRubric ? profileTable(r.sc) : ""}
        ${sheetHtml(Object.assign(detailSheet(r.sc, me ? "" : r.name), {id: "detail-" + domId(r.id)}))}
        <p class="sc-how">${E(HOW_MODEL)}</p></details>
    </div></div>`;
}
const HOW_MODEL = `How the score is worked out: the client's 100-point model. Four dimensions — Procedural Compliance & Timeliness 25%, Needs Assessment & Risk Identification 25%, Care/Action Plan Quality 30%, Communication & Documentation 20% — scored per Case Flow day from the work CM records (each number feeds one dimension), then weighted by the day's complexity (Day 1 × 1.0, Days 2–3 × 1.15, Days 4–5 × 1.3): Final = Σ(day score × multiplier) ÷ Σ multipliers. Tiers: Exemplary 90–100 · Proficient 80–89 · Developing 65–79 · Needs Improvement below 65 (the 📐 Feedback Rubric's tiers). Pass = Final ≥ 80% and 100% on the safety gate's critical items (UPL in the takeaway, the audits' privilege and hard-date items, the trust-money Net Sheet stages). Overall = the Final, the one score every page shows; the Daily compliance (each day's Knowledge Check passed, Backup Drive graded) is shown beside it as a sub-score. Not in the model: Skill Builders, the Call Simulator and Portal simulator bests, the Learning Check composites and the takeaways (not scored: only their UPL review is read, as a critical item), the random tasks, and the self-ratings.`;

/* ---------- 🏅 My Performance: the trainee's own card ---------- */
const MINE = {id: null, at: 0, loading: null, recs: null, dev: {}};
// the records this device keeps (storeGet): after a reload index.html's mem holds only what is saved since, so these are read too
const DEVICE_KEYS = ["case-flow", "net-sheet", "case-folder", "drive-setup", "drive-grades", "doc-filing", "cms-file", "cms-upload", "cf-ai-grades", "day-progress"];
function loadMine(force){
  if(!isTrainee() || MINE.loading) return;
  const id = state.traineeId;
  if(!force && MINE.id === id && Date.now() - MINE.at < 60000) return;
  MINE.at = Date.now();
  const dev = typeof storeGet === "function" ? Promise.all(DEVICE_KEYS.map(k => Promise.resolve(storeGet(k)).catch(() => null))) : Promise.resolve([]);
  MINE.loading = Promise.all([sharedGetMany(["trainee:" + id, "progress:" + id, "callsim:" + id, "simresults:" + id, "feedback:" + id]), dev])
    .then(([v, d]) => { if(state.traineeId === id){ MINE.id = id; MINE.recs = v || []; MINE.dev = {}; DEVICE_KEYS.forEach((k, i) => { if(d[i] && typeof d[i] === "object") MINE.dev[k] = d[i]; }); } })
    .catch(() => {}).then(() => { MINE.loading = null; if((state.view === "scorecard" || state.view === "dashboard") && typeof render === "function") render(); });
}
function myCtx(){
  const [rec, prog, callsim, sim, fb] = MINE.recs || [];
  const c = ctxOf(rec, prog, callsim, sim, fb);
  // what's on this device is the freshest: the live summary, the practice bests and the logs
  try{ if(window.cmCaseFlow && cmCaseFlow.scoreSummary) c.cf = cmCaseFlow.scoreSummary(); }catch(e){}
  // ✍️ the Knowledge Checks count from the record, as the trainer's view counts them; a score only this device holds is
  // shown unconfirmed (kcDevice reads it from the device's day-progress, below). Until the record is read, the device's.
  const mine = MINE.id === state.traineeId && rec;
  // (so once the record is read, the live summary's kc and pass are replaced by the record's summary's, as the trainer's
  // view reads them: a check only this device holds then has no score here, and kcDevice shows it unconfirmed)
  if(mine && c.cf && c.cf.days && c.cf !== rec.caseFlow){ const rd = ((rec.caseFlow || {}).days) || {};
    c.cf = Object.assign({}, c.cf, {days: Object.assign({}, c.cf.days)});
    Object.keys(c.cf.days).forEach(n => { const s = c.cf.days[n]; if(!s || typeof s !== "object") return;
      const r = rd[n] && typeof rd[n] === "object" && (rd[n].id == null || s.id == null || String(rd[n].id) === String(s.id)) ? rd[n] : {};
      c.cf.days[n] = Object.assign({}, s, {kc: fin(r.kc) ? r.kc : null, passed: !!r.passed}); }); }
  c.rec =Object.assign({}, c.rec, {dayProgress: (mine ? rec.dayProgress : state.progress) || c.rec.dayProgress || {}, practiceProgress: state.practiceProgress || c.rec.practiceProgress || {}});
  if(Array.isArray(state.taskLog)) c.data = Object.assign({}, c.data, {"task-log": state.taskLog});
  if(Array.isArray(state.workLog)) c.data = Object.assign({}, c.data, {"work-log": state.workLog});
  c.data = Object.assign({}, c.data, MINE.dev || {});
  if(state.docFiling && typeof state.docFiling === "object") c.data = Object.assign({}, c.data, {"doc-filing": state.docFiling});
  if(state.progress && typeof state.progress === "object") c.data = Object.assign({}, c.data, {"day-progress": state.progress});
  // and what this device saved since (storeSet keeps it in index.html's mem): the Case Flow record, the Net Sheet, the folder
  try{ DEVICE_KEYS.forEach(k => { if(typeof mem !== "undefined" && mem[k] && typeof mem[k] === "object") c.data = Object.assign({}, c.data, {[k]: mem[k]}); }); }catch(e){}
  // a Knowledge Check on this device that the record doesn't hold yet: read the record again soon (its save may be on its way)
  try{ if(mine && Date.now() - MINE.at > 8000 && cfDays().some(d => kcDevice(c, d) != null)) loadMine(true); }catch(e){}
  return c;
}
const rowOf = (id, name, batch, c) => ({id, name, batch: batch || "", c, sc: compute(c), m: MODEL.compute(c)});
function renderMine(){
  // 📐 the Feedback Rubric, opened from My Performance
  if(state.scxRubric && window.cmRubric) return cmRubric.pageHtml({back: "state.scxRubric=false;render()"});
  loadMine(MINE.id !== state.traineeId);
  const loaded = MINE.id === state.traineeId, name = state.traineeName || "Me";
  const r = rowOf(state.traineeId, name, state.traineeBatch, myCtx());
  // (what the trainer's 🏅 Scorecard shows of this trainee, and only this trainee: the ✅ passing score, their row of 🏅 Scores,
  // their card with its 💬 feedback on practical activities, and 📊 the batch's progress as the trainer last shared it)
  const mineTop = loaded ? passHtml(r) + myScoresHtml(r) : "";
  const mineFb = loaded && window.cmBatchSheet && cmBatchSheet.feedbackHtml ? `<div class="scx-pad">${cmBatchSheet.feedbackHtml(r)}</div>` : "";
  const mineBatch = loaded && window.cmRankShare ? cmRankShare.traineeHtml() : "";
  return `<div class="scx-page scx-wide">${sheetTop("My Scorecard", `${E(name)}${state.traineeBatch ? ` · Batch <b>${E(batchOf(state.traineeBatch))}</b>` : ""}`, `${window.cmRubric ? `<button onclick="state.scxRubric=true;render()">📐 Feedback Rubric</button>` : ""}<button onclick="window.print()">🖨 Print</button>`, loaded ? `<span>${E(MODEL.STATUS[r.m.status])}</span><span>${r.sc.done} / ${r.sc.total} days passed</span>` : "")}
    <div class="card gs-card scx-card">
    ${mineTop}${loaded ? `<div class="bs-pts">${cardHtml(r, true)}</div>${mineFb}` : `<p class="bs-none scx-pad">Collecting your grades…</p>`}${mineBatch}</div></div>`;
}
/* ✅ the passing score: the Overall on a bar with the pass mark (MODEL.PASS) drawn on it, then each day's score against it */
function passHtml(r){
  const P = MODEL.PASS, m = r.m || MODEL.compute(r.c), v = m.overall, pctW = x => Math.max(0, Math.min(100, x == null ? 0 : x));
  const st = m.status, ok = st === "pass", msg = v == null ? "Nothing scored yet: your Overall appears with your first graded work."
    : ok ? `You're above the passing score: ${v}% (pass is ${P}%).` : st === "gate" ? `Your Overall is ${v}%, but a safety-gate item was missed: a pass needs every critical item right as well as ${P}%.`
    : v >= P ? `${v}%: at the passing score; the pass is confirmed once every critical item has been checked.` : `${v}%: ${P - v} point${P - v === 1 ? "" : "s"} to go to the passing score of ${P}%.`;
  const days = (m.days || []).filter(x => x.S != null);
  return `<section class="scx-pass scx-pad" aria-label="Passing score">
    <div class="scx-pass-h"><b>✅ Passing score: ${P}%</b><span class="scx-pass-st ${ok ? "gs-hi" : v == null ? "" : "gs-lo"}">${E(MODEL.STATUS[st] || "")}</span></div>
    <div class="scx-bar" role="img" aria-label="Your Overall ${v == null ? "not scored yet" : v + "%"}, the passing score ${P}%">
      <div class="scx-bar-fill ${MODEL.mtone(v)}" style="width:${pctW(v)}%"></div><div class="scx-bar-pass" style="left:${P}%"><span>Pass ${P}%</span></div>
      ${v == null ? "" : `<div class="scx-bar-me" style="left:${pctW(v)}%"><span>You ${v}%</span></div>`}</div>
    <p class="scx-pass-msg">${E(msg)}</p>
    ${days.length ? `<div class="scx-pass-days">${days.map(x => `<span class="${x.S >= P ? "gs-hi" : "gs-lo"}">Day ${E(x.n)} <b>${x.S}%</b> ${x.S >= P ? "✓" : "below " + P + "%"}</span>`).join("")}</div>` : ""}
  </section>`;
}
/* 🏅 their row of the trainer's 🏅 Scores table: the same columns and cells, this trainee only */
function myScoresHtml(r){
  if(!window.cmBatchSheet || !cmBatchSheet.scoresSheet) return "";
  try{ const T = Object.assign({}, cmBatchSheet.scoresSheet([r]), {title: "🏅 My Scores", note: "Your row of your trainer's 🏅 Scores table. Hover a day for each thing you did that day, with its score.", onRow: null, warn: "", info: ""});
    return `<div class="scx-pad">${sheetHtml(T)}</div>`; }catch(e){ return ""; }
}

/* ---------- 🏅 Scorecards: every approved trainee's card, for the trainer ---------- */
const ALL = {rows: null, loading: false, batch: "", pick: "", only: "", at: 0, seen: new Set()};   // (seen: the keys the last read found)
// The trainee records are read fresh every time (not the Admin screen's copy, which can be minutes old), so a change made
// to a trainee's record, such as a corrected Batch ID, shows here on the next load; an open page reloads them once a minute.
const FRESH_MS = 60000;
// sharedList and sharedGetMany don't throw on a network blip (they answer [] or null), so a read with no keys, or fewer
// records than keys, is a failed read: the rows already shown and state.adminData (the Admin screen's, Open Lessons' and
// the Batch Sheet's copy) stay as they were; state.adminData is only ever set from a complete read. A background reload
// that changed nothing doesn't redraw, and one that did keeps every open <details> open.
// a read that never answers is given up on (LOAD_MS), and a load still running after STUCK_MS is started again
const LOAD_MS = 45000, STUCK_MS = 60000;
const inTime = (p, ms, why) => Promise.race([p, new Promise((res, rej) => setTimeout(() => rej(new Error(why || "timed out")), ms))]);
async function loadAll(){
  ALL.loading = true; ALL.at = Date.now(); ALL.failed = false;
  const had = ALL.rows, bg = !!(had && had.length);
  let rows = null;
  try{
    let people = null;
    try{
      const keys = await inTime(sharedList("trainee:"), LOAD_MS, "list"), got = keys.length ? await inTime(sharedGetMany(keys), LOAD_MS, "records") : [];
      const recs = (got || []).filter(Boolean);
      if(keys.length && recs.length === keys.length){ people = recs; state.adminData = recs; }
      else if(!bg && !keys.length && !(state.adminData || []).length) people = [];   // nobody yet
      else people = bg ? null : (recs.length ? recs : state.adminData);
    }catch(e){ people = bg ? null : state.adminData; }
    if(!people) throw new Error("no records");
    // (the one rule of every score table, js/cm-merged-away.js: approved, not rejected, not archived, not merged into another
    // live account, so a merge waiting to finish isn't a second card)
    const MA = window.cmMergedAway; if(MA){ try{ await inTime(MA.ready(), 15000, "merges"); }catch(e){} }
    people = MA ? MA.scored(people) : people.filter(r => r && r.approved === true && !r.rejected && !r.archived);
    const want = []; people.forEach(r => want.push("progress:" + r.id, "callsim:" + r.id, "simresults:" + r.id, "feedback:" + r.id));
    const vals = await inTime(sharedGetMany(want), LOAD_MS * 2, "grades");
    // a failed get-many answers null for every key of its 100-key request, as if none were there: in a background reload, a
    // request that read nothing where the last read found something failed, so the rows shown stay
    if(bg && (!Array.isArray(vals) || vals.length !== want.length)) throw new Error("short read");
    if(bg) for(let i = 0; i < want.length; i += 100) if(vals.slice(i, i + 100).every(v => v == null) && want.slice(i, i + 100).some(k => ALL.seen.has(k))) throw new Error("failed read");
    ALL.seen = new Set(want.filter((k, i) => vals[i] != null));
    rows = people.map((r, i) => rowOf(r.id, r.name || r.id, r.batch, ctxOf(r, vals[i * 4], vals[i * 4 + 1], vals[i * 4 + 2], vals[i * 4 + 3])))
      .sort((a, b) => a.batch.localeCompare(b.batch) || a.name.localeCompare(b.name));
  }catch(e){ rows = null; }
  ALL.loading = false;
  // what the page would show for these rows (the sheet and the cards)
  const sig = rs => { try{ return sheetHtml(scoresSheet(rs, false)) + rs.map(r => cardHtml(r, false)).join(""); }catch(e){ return String(Math.random()); } };
  if(!rows){ if(!had){ ALL.failed = true; redrawPage(); } return; }   // a first read that failed: said so, with ↻ Try again; a failed background read: what is shown stays
  else if(had && sig(rows) === sig(had)){ ALL.rows = rows; return; }   // nothing changed: no redraw
  else ALL.rows = rows;
  // redrawn wherever the page is showing: #/scorecard, or Admin's 🏅 Scorecards, which is also where Admin opens (no
  // adminTab yet, or an old tab name such as "audit": js/cm-admin-shell.js tabOf) and where "Collecting…" may be on screen
  redrawPage();
}
function redrawPage(){
  const onPage = state.view === "scorecard" || (state.view === "admin" && (!state.adminTab || ["scorecards", "audit", "batchsheet"].includes(state.adminTab)))
    || !!document.querySelector(".scx-page");
  if(onPage && typeof render === "function" && !(typeof isTyping === "function" && isTyping())){
    const open = [...document.querySelectorAll(".scx-page details[open] > summary")].map(s => s.textContent);
    render();
    if(open.length) document.querySelectorAll(".scx-page details > summary").forEach(s => { if(open.includes(s.textContent)) s.parentElement.open = true; });
  }
}
const batchOf = b => typeof batchShow === "function" ? (batchShow(b) || b) : typeof cleanBatch === "function" ? (cleanBatch(b) || b) : b;
const shownRows = () => (ALL.rows || []).filter(r => !ALL.batch || batchOf(r.batch) === ALL.batch);
function renderAll(){
  if(ALL.rows && !ALL.loading && Date.now() - ALL.at > FRESH_MS && !(typeof isTyping === "function" && isTyping())) loadAll();   // in the background: the rows shown stay until the fresh ones come
  if(ALL.loading && Date.now() - ALL.at > STUCK_MS) ALL.loading = false;   // a load that never finished: start it again
  if(!ALL.rows && ALL.failed && !ALL.loading) return `<div class="scx-page scx-wide"><div class="card gs-card scx-card"><p class="bs-none scx-pad">The grades couldn't be collected just now (the connection didn't answer). <button type="button" class="btn btn-navy btn-sm" onclick="cmScorecard.refresh()">↻ Try again</button></p></div></div>`;
  if(!ALL.rows){ if(!ALL.loading) loadAll(); return `<div class="scx-page scx-wide"><div class="card gs-card scx-card"><p class="bs-none scx-pad">Collecting every trainee's grades…</p></div></div>`; }
  const batches = [...new Set(ALL.rows.map(r => batchOf(r.batch)).filter(Boolean))].sort();
  const rows = shownRows(), passed = rows.filter(r => r.m.pass).length;
  // one trainee at a time: the one picked in the hero (or a 🏅 Scores row), else the first trainee shown
  const on = rows.find(r => r.id === ALL.only) || rows.find(r => r.id === ALL.pick) || rows[0] || null, cards = on ? [on] : [];
  const who = on ? `<span class="scx-who">${whoPick(on)}${on.batch ? `<i>${E(batchOf(on.batch))}</i>` : ""}</span>` : "";
  return `<div class="scx-page scx-wide">${sheetTop("Scorecards", ALL.batch ? `Batch <b>${E(ALL.batch)}</b>` : "All batches", `<label class="scx-bpick">Batch <select onchange="cmScorecard.batch(this.value)"><option value="">All batches</option>${batches.map(b => `<option ${b === ALL.batch ? "selected" : ""}>${E(b)}</option>`).join("")}</select></label><button onclick="cmScorecard.csv()">⬇ Download</button><button onclick="cmScorecard.csv(true)" title="Only the 🏅 Scores table">⬇ Scores only</button><button onclick="cmScorecard.refresh()">↻ Refresh</button>${window.cmRunNow ? cmRunNow.html("banner") : ""}`, `<span>${rows.length} trainee${rows.length === 1 ? "" : "s"}</span><span>${passed} passing</span>`, who ? `<div class="scx-who-row">${who}</div>` : "")}
    <div class="card gs-card scx-card">
    ${sheetHtml(scoresSheet(rows, false))}
    ${cards.length ? `<div class="bs-pts scx-pad">${cards.map(r => cardHtml(r, false)).join("")}</div>` : ""}</div></div>`;
}
function csv(only){
  // ⬇ Download: the 🏅 Scores table first, then everything the page folds in (js/cm-batch-sheet.js csvTables) and the
  // 100-point model in full; ⬇ Scores only: the 🏅 Scores table alone
  if(window.cmBatchSheet && cmBatchSheet.csvTables){ const rows = shownRows(), all = cmBatchSheet.csvTables(rows, [Object.assign(scoresSheet(rows, false, true), {title: "🏅 The 100-point model in full"})], r => !ALL.batch || batchOf(r.batch) === ALL.batch);
    return cmBatchSheet.download(only ? all.slice(0, 1) : all, `Scorecard${only ? " scores" : ""}${ALL.batch ? " - " + ALL.batch : ""}.csv`); }
  const rows = shownRows(), T = scoresSheet(rows, false, true);
  const q = v => { const t = String(v == null ? "" : v); return `"${(/^[=+\-@\t\r]/.test(t) ? "'" + t : t).replace(/"/g, '""')}"`; };
  const lines = [T.head.map(q).join(",")].concat(T.rows.map(r => r.map(c => q(c.csv != null ? c.csv : c.v)).join(",")));
  const a = document.createElement("a"); a.href = URL.createObjectURL(new Blob(["﻿" + lines.join("\r\n")], {type: "text/csv"}));
  a.download = `Scorecards${ALL.batch ? " - " + ALL.batch : ""}.csv`; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500);
}

/* ---------- the page, its address and its top-bar button ---------- */
// (👁 a trainer's Trainee view opens the trainee's own page, not the Dashboard with its day cards: a preview has no trainee's
// records, so it shows what a trainee sees there)
function renderPreview(){
  return `<div class="scx-page scx-wide">${sheetTop("My Scorecard", "👁 Trainee view: a preview", "")}
    <div class="card gs-card scx-card"><div class="scx-pad"><p class="bs-note">This is a trainee's 🏅 Scorecard. Each trainee sees only their own: ✅ the passing score (80%) with their Overall and each day against it, 🏅 My Scores (their row of your 🏅 Scores table), their card with 💬 Feedback on Practical Activities, and 📊 My Batch's Progress (their rank and each day beside the batch average, as the Rankings &amp; Progress Report last shared it). A preview has no trainee's records, so there is nothing to score here.</p></div></div></div>`;
}
window.renderScorecardPage = () => isAdmin() ? renderAll() : isTrainee() ? renderMine() : state.adminPreview ? renderPreview() : (typeof renderDashboard === "function" ? renderDashboard() : "");
window.addEventListener("focus", () => { if(isTrainee() && state.view === "scorecard") loadMine(); });
window.cmScorecard = {
  batch(b){ ALL.batch = b || ""; ALL.pick = ""; ALL.only = ""; render(); },
  only(id){ ALL.only = id || ""; ALL.pick = id || ""; render(); },
  refresh(){ ALL.rows = null; ALL.failed = false; state.adminData = null; render(); },
  // something the cards read changed (e.g. the Drive reports came in): read again in the background, keeping the cards
  // on screen until the fresh ones come (clearing them blanked the trainer's page mid-read)
  invalidate(){ if(ALL.rows) ALL.at = 0; else ALL.rows = null; },
  reload: () => loadAll(),   // the background reload, now (the once-a-minute one)
  rows: () => ALL.rows || [], shown: () => shownRows(),   // the trainees read, and the ones the batch picked shows (js/cm-send-progress.js)
  // a row of 🏅 Scores: that trainee's card (shown if only another one was), scrolled to
  pick(id){ ALL.pick = id; ALL.only = id; render();
    setTimeout(() => { const d = document.getElementById("bs-pt-" + domId(id)); if(d) d.scrollIntoView({behavior: "smooth", block: "start"}); }, 30); },
  csv, compute, sources: SOURCES, model: MODEL, simKind, kcBest, kcPassed, kcDevice, cfDay, lcMods, dayItems, skillActs, actionPlans,
  // ⭐ THE overall score, the one shared function: every surface that shows a trainee's Overall or a day's score calls it
  // (the trainee card, 🏅 Scores, the Batch Sheet's Scores, Score Card, Day by Day and cards, the trainee's My Scores)
  overall: c => { const m = MODEL.compute(c); return {pct: m.overall, comp: m.comp, status: m.status, why: overallTip(m),
    days: m.days.map(x => ({n: x.n, id: x.d.id, S: x.S, items: x.dims.reduce((t, k) => t + k.groups.reduce((u, g) => u + g.items.length, 0), 0)})), m}; },
  overallTip,
  // the signed-in trainee's Overall, from the same records as their 🏅 My Performance card (the dashboard's 🏅 My Scores shows it)
  myCtx,   // the trainee's own records, as 🏅 My Performance and the dashboard's 🏅 My Scores read them
  myOverall(){ try{ loadMine(MINE.id !== state.traineeId); }catch(e){} return window.cmScorecard.overall(myCtx()); },
  // the 100-point model for one trainee's records: trainee:<id>, progress:<id>.data, feedback:<id>
  score: (rec, data, fb) => MODEL.compute(ctxOf(rec, {data: data || {}}, null, null, fb))
};

const css = document.createElement("style"); css.id = "cm-scorecard";
css.textContent = `
/* ✅ the trainee's passing score (renderMine passHtml) */
.scx-pass{margin:4px 0 12px;}
.scx-pass-h{display:flex;flex-wrap:wrap;gap:10px;align-items:center;justify-content:space-between;font:800 18px Arial,sans-serif;color:#1E2340;}
.scx-pass-st{padding:3px 12px;border-radius:999px;background:#EEF0F6;font:800 15px Arial,sans-serif;}
.scx-pass-st.gs-hi{background:#E6F4EA;color:#0B5D1E;} .scx-pass-st.gs-lo{background:#FCE8E6;color:#A50E0E;}
.scx-bar{position:relative;height:26px;margin:30px 0 8px;background:#EEF0F6;border-radius:13px;border:1px solid #C9CEDD;}
.scx-bar-fill{position:absolute;left:0;top:0;bottom:0;border-radius:13px;background:#9AA3B5;}
.scx-bar-fill.gs-hi{background:#1d7a46;} .scx-bar-fill.gs-mid{background:#DB8437;} .scx-bar-fill.gs-lo{background:#B42318;}
.scx-bar-pass{position:absolute;top:-8px;bottom:-8px;width:0;border-left:3px dashed #1E2340;}
.scx-bar-pass span,.scx-bar-me span{position:absolute;top:-24px;transform:translateX(-50%);white-space:nowrap;font:800 14px Arial,sans-serif;color:#1E2340;}
.scx-bar-me{position:absolute;top:0;bottom:0;width:0;}
.scx-bar-me span{top:30px;color:#2E3450;}
.scx-pass-msg{margin:22px 0 6px;font:700 16px Arial,sans-serif;color:#2E3450;}
.scx-pass-days{display:flex;flex-wrap:wrap;gap:8px;} .scx-pass-days span{padding:4px 10px;border-radius:8px;font:700 15px Arial,sans-serif;background:#F1F3F4;}
.scx-pass-days span.gs-hi{background:#E6F4EA;color:#0B5D1E;} .scx-pass-days span.gs-lo{background:#FCE8E6;color:#A50E0E;}
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
.scx-card .gs.gs-norn .gs-frz{left:0;}
.scx-card .gs-letters .gs-frz,.scx-card .gs-head .gs-frz{z-index:4;background:#F8F9FA;}
.scx-card .gs td{font-weight:700;color:#141A2E;} .scx-card .gs td.gs-name{font-weight:800;min-width:200px;}
.scx-card td.gs-batch{font:700 14px 'IBM Plex Mono',monospace;color:#2E3450;}
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
.bs-pt-who select{font:800 24px 'Poppins','Inter',Arial,sans-serif;color:#fff;background:#2B3560;border:2px solid rgba(255,255,255,.6);border-radius:10px;padding:4px 12px;max-width:min(520px,80vw);cursor:pointer;}
.scx-who-row{margin:10px 0 2px;} .scx-who{display:inline-flex;align-items:center;gap:12px;flex-wrap:wrap;} .scx-who i{font:800 16px Arial,sans-serif;font-style:normal;color:#F6C08F;letter-spacing:.04em;}
.bs-gate-why{display:block;margin:4px 0 2px;} .bs-gate-why span{display:block;margin:2px 0;} .bs-gate-why b{color:#1E2340;}
.bs-pt-who select:hover,.bs-pt-who select:focus{border-color:#DB8437;outline:none;} .bs-pt-who option{color:#1E2340;background:#fff;font-weight:700;font-size:16px;}
.bs-pt-k{display:inline-flex;align-items:baseline;gap:7px;padding:5px 14px;border-radius:999px;background:#fff;border:2px solid #C9D1E6;color:#1E2340 !important;font:700 16px 'Poppins','Inter',Arial,sans-serif;}
.bs-pt-k b{font-size:22px;color:#1E2340;} .bs-pt-k.bs-pt-r b{font-size:17px;}
.bs-pt-k.gs-hi{background:#E6F4EA;border-color:#1E8E3E;} .bs-pt-k.gs-hi b{color:#0B5D1E;}
.bs-pt-k.gs-mid{background:#FFF4E0;border-color:#E8A400;} .bs-pt-k.gs-mid b{color:#7A4B00;}
.bs-pt-k.gs-lo{background:#FDE8E8;border-color:#D93025;} .bs-pt-k.gs-lo b{color:#A50E0E;}
.bs-pt .bs-in{margin:10px 12px;padding:10px 14px;border-radius:10px;font:500 15.5px/1.5 'Inter',Arial,sans-serif;color:#1E2340;} .bs-in ul{margin:6px 0 0;padding-left:20px;} .bs-in li{margin:3px 0;}
.bs-in-s{color:#475569;font-weight:700;font-size:14px;} .bs-in small{font-size:14px;color:#3C4043;}
/* 🎯 Focus on as a table */
.bs-fo-wrap{overflow-x:auto;margin-top:8px;border:1px solid #F0C9C9;border-radius:8px;background:#fff;} .bs-in-ok .bs-fo-wrap{border-color:#F5D49A;}
.bs-fo-t{width:100%;border-collapse:collapse;font:600 14.5px/1.45 'Inter',Arial,sans-serif;color:#2E3450;}
.bs-fo-t thead th{background:#262B45;color:#fff;font:800 14px Arial,sans-serif;text-align:left;padding:7px 10px;border-bottom:2px solid #DB8437;white-space:nowrap;}
.bs-fo-t td,.bs-fo-t tbody th{padding:7px 10px;border-top:1px solid #EEE3E3;vertical-align:top;text-align:left;}
.bs-fo-t .bs-fo-i{font:800 15px Arial,sans-serif;color:#141A2E;min-width:200px;max-width:320px;} .bs-fo-t .bs-fo-d,.bs-fo-t .bs-fo-s{white-space:nowrap;}
.bs-fo-t .bs-fo-a{min-width:140px;color:#475569;font-weight:700;} .bs-fo-t .bs-fo-x{min-width:280px;}
.bs-fo-t tr.bs-fo-gate th,.bs-fo-t tr.bs-fo-gate td{background:#FFF4F4;} .bs-fo-t .bs-gate-why{margin:0;}
.bs-fb > .bs-in{margin:6px 0 10px;}
.bs-in-lo{background:#FDECEC;border:1px solid #F5B5B5;} .bs-in-ok{background:#FFF7E6;border:1px solid #F5D49A;} .bs-in-hi{background:#E8F6EC;border:1px solid #A7DDB6;}
.bs-pt-wrap{overflow-x:auto;padding:4px 10px 12px;}
.bs-pt-t{border-collapse:collapse;width:100%;table-layout:fixed;font:16.5px/1.45 'Inter',Arial,sans-serif;color:#1F2433;} .bs-pt-t + .bs-pt-t{margin-top:14px;}
.bs-pt-t th,.bs-pt-t td{border:1px solid #9AA3B5;padding:8px 10px;text-align:left;vertical-align:top;}
.bs-pt-t col.bs-pt-c1{width:240px;} .bs-pt-t col.bs-pt-c2{width:132px;}
.bs-pt-sec th{background:#1E2340;color:#fff;font:800 17px 'Poppins','Inter',Arial,sans-serif;}
.bs-pt-m{font-weight:800;color:#1E2340;} .bs-pt-s-model td.bs-pt-m{text-align:center;vertical-align:middle;}   /* (🏅 The 100-point model: each dimension centred in its cell) */ .bs-pt-w{display:inline-block;margin-left:4px;padding:0 7px;border-radius:999px;background:#FDF0E4;color:#A4470F;font-size:14px;font-weight:800;}
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
/* the short 🏅 Scores sheet fits the page at 1366 wide: narrower score columns */
.scx-card #scx-scores .gs-letters th,.scx-card #scx-scores .gs-head th{min-width:74px;} .scx-card #scx-scores .gs-head th{font-size:14.5px;}
.scx-card #scx-scores td.gs-name{min-width:170px;}
.bs-pt-line{font:600 15px Arial,sans-serif;color:#1E2340;line-height:1.5;} .bs-pt-line b{font-weight:800;}
.bs-pt-parts{margin-top:4px;} .bs-pt-parts > summary{cursor:pointer;font:700 14px Arial,sans-serif;color:#46508A;list-style:none;} .bs-pt-parts > summary::-webkit-details-marker{display:none;}
.bs-pt-how .bs-pt-t{margin-top:10px;}
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
