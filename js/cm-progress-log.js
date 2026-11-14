/* ============================================================
   📒 MY PROGRESS LOG (trainee dashboard) and 🚨 CASE-FILE ALERTS (trainers)

   The client: "Trainee's Dashboard should not track progress of the deck utilization but instead show trainee's
   progress Log and Alert trainers when trainee has a glaring challenge or error in setting up their case files."

   1. 📒 My Progress Log — on the trainee's dashboard, under the day cards and the stats band (the day cards no longer
      show how much of the deck was clicked through: js/cm-updates.js). A dated, newest-first log of what the trainee
      actually DID and how it went, built only from what is already recorded on their progress (progress:<id>.data):
        work-log        Skill Activities and Learning Checks (graded), Knowledge Checks, roleplays, activities delivered
        task-log        random tasks: received, resolved (graded) or missed
        roleplayHistory roleplays not already in the work-log
        doc-filing      every document filed into the CMS (first time right, or after N attempts) and each refused one
        drive-setup / drive-grades / drive-check   the Backup Drive: Day 1's folders, each day's grade, each ✓ Check my drive
        case-flow       calls taken on John Doe's file, injected calls answered or missed, the CMS Case ID logged,
                        checkpoints ticked on a Skill Activity
        feedback        a trainer's day review and Learning Check scores (the trainee's own feedback:<id>, already loaded)
        callsim         graded calls from the Call Simulator (already loaded by js/graded-calls.js)
      Above the log, "⚠ Needs fixing": the trainee's own open case-file alerts (below), each with what to do.
      Nothing here asks the server anything: the log reads the trainee's own saved progress in this browser.

   2. 🚨 Case-file alerts — the same rules run over each trainee's progress, on the trainer's side, from the progress the
      Trainee Audit already loads in one get-many (loadAuditExtras in index.html); no request per trainee. They show:
        • Admin → 🛡 Admin Master Control → 👥 Trainee Audit: a "🚨 Case-file alerts" chip in "Needs attention" (the
          trainees with an open alert) that opens the alerts list: trainee, rule, details, when, and ✓ Resolved;
        • a 🚨 badge in the admin top bar with the number of open alerts (a click opens that list).
      ✓ Resolved is kept in ONE admin-only record, case-alerts:resolved ({<traineeId>: {<alert key>: {at, by}}}): the
      Worker lets no trainee read or write it (worker.js). It is read in the same get-many as the progress. An alert
      whose evidence is newer than its ✓ Resolved mark opens again (the trainee did it again).

   THE RULES (RULES below; each alert's text says which rule raised it and why):
     R1 refused     the same document refused 3 or more times by the CMS (doc-filing attempts ≥ 3). Open until it files.
                    Filed only on the 3rd attempt or later: kept as a 🟠 watch alert for the trainer.
     R2 wrongcat    a document put under the wrong CMS category (the firm files it elsewhere) and not filed right since;
                    or filed only after 2+ wrong-category tries.
     R3 drive       the Backup Drive: Day 1's folders not built (the graded setup failing), firm folders missing at the
                    last ✓ Check my drive, a day's Backup File Maintenance below 70%, or no Backup Drive at all once the
                    trainee has moved past Day 1's opening work.
     R4 caseid      no CMS Case ID logged after Day 1's opening activity ("Opening John Doe's File in the CMS"): the
                    trainee worked it and moved on, but logged no CMS Case ID and filed no document into a case.
     R5 lowskill    a Skill Activity's latest graded attempt below 50%.
     R6 conflict    the Conflict Check not done: Day 1's opening activity worked and moved past, its first checkpoint
                    ("Conflict Check documented before the matter was created") never ticked.
     R7 kcfail      a Knowledge Check failed twice or more (each below 70%) and still not passed.
     R8 stuck       stuck on a step for long: a document still unfiled 24 h after its first attempt, Day 1's folders still
                    not built 24 h after the first try, or a Knowledge Check not passed 48 h after the first attempt.
   ============================================================ */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const J = s => E(String(s == null ? "" : s).replace(/\\/g, "\\\\").replace(/'/g, "\\'"));
const T = {REFUSED: 3, WRONG_FILED: 2, LOW_SKILL: 50, KC_FAILS: 2, KC_PASS: 70, DRIVE_PASS: 70, STUCK_H: 24, KC_STUCK_H: 48};
const OPEN_ACT = "d1m1-open";   // Day 1's opening activity: Opening John Doe's File in the CMS (its 1st checkpoint is the Conflict Check)
const RULES = {
  refused:  {icon: "🔁", name: "Same document refused 3+ times", why: `The CMS refused the same document ${T.REFUSED} or more times (name or category).`},
  wrongcat: {icon: "🗂", name: "Filed under the wrong category", why: "A document was put under a CMS category the firm doesn't file it in."},
  drive:    {icon: "📂", name: "Backup Drive folders failing", why: "The Backup Drive's folders are not built, missing, or failing their check."},
  caseid:   {icon: "🆔", name: "No CMS Case ID after Day 1's opening", why: "Day 1's opening activity was worked and left without a CMS Case ID logged or any document filed into a case."},
  lowskill: {icon: "📉", name: `Skill Activity below ${T.LOW_SKILL}%`, why: `A Skill Activity's latest graded attempt scored under ${T.LOW_SKILL}%.`},
  conflict: {icon: "⚖️", name: "Conflict Check not done", why: "Day 1's opening activity was left without its first checkpoint, the Conflict Check, ticked."},
  kcfail:   {icon: "✍️", name: `Knowledge Check failed ${T.KC_FAILS}+ times`, why: `A Knowledge Check was failed ${T.KC_FAILS} or more times (under ${T.KC_PASS}%) and is not passed yet.`},
  stuck:    {icon: "⏳", name: "Stuck on a step", why: `The same step is still open ${T.STUCK_H} h or more after the first attempt (${T.KC_STUCK_H} h for a Knowledge Check).`}
};
/* What each item teaches. A trainee is not only told what is missing: they see the standard the firm holds the work to,
   why it matters on John Doe's file, the next step, and the lesson that teaches it (📖 Learn it opens its slide). */
const TEACH = {
  refused:  {standard: "Every document goes into the CMS under the firm's name: <Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.<ext>, the Type being the category it is filed under.",
             why: "A colleague covering John Doe's file finds the Police Report or a bill by its name alone. A name the CMS refuses is a document the file doesn't have yet.",
             learn: ["d1m1-drive", "task"]},
  wrongcat: {standard: "A document is filed under the category the firm keeps it in: records with Medical Records, bills with Bills, the retainer with Intake.",
             why: "Requests from Atty. Thorne and the adjuster are answered from the categories. A bill filed under Medical Records is a bill nobody counts in the specials.",
             learn: ["d1m1-drive", "task"]},
  drive:    {standard: "The Backup Drive holds the firm's folders exactly: named, numbered and nested as the standard on Day 1's slide, every one still there.",
             why: "The backup is the copy the firm works from when the CMS is down. A missing folder is a place a filed document can't land.",
             learn: ["d1m1-drive", "task"]},
  caseid:   {standard: "The matter is opened in the CMS and saved, so it has its Case ID, before any document is filed or any contact is logged.",
             why: "Every name, note and filing on John Doe's file carries that Case ID. Without it, nothing you do can be tied to his case.",
             learn: ["d1m1-open", "task"]},
  conflict: {standard: "The Conflict Check is run and documented on every party's full legal name before the matter is created.",
             why: "If the firm already acts for Robert Smith or his carrier, it cannot take John Doe's case. Checking after the matter exists is too late.",
             learn: ["d1m1-open", "task"]},
  lowskill: {standard: "A Skill Activity is graded against its rubric: every step done, in order, with the record the step asks for.",
             why: "Each activity is a piece of John Doe's case. A gap left here is a gap the next step of the case builds on.",
             learn: null},
  kcfail:   {standard: "A Knowledge Check is passed at 70%: the day's rules, in your own words, applied to John Doe's file.",
             why: "The Knowledge Check is the day's rules in use. A rule you can't apply in the check is one you'll miss on a live file.",
             learn: null},
  stuck:    {standard: "A step that is started is finished, or raised with your trainer, the same day.",
             why: "An unfinished step on a live case is a deadline or a document left waiting. Asking early is part of the job.",
             learn: null}
};


/* ---------- small helpers ---------- */
const ms = at => { const t = at ? Date.parse(at) : NaN; return isFinite(t) ? t : 0; };
const num = v => typeof v === "number" && isFinite(v) ? Math.round(v) : null;
const days = () => (typeof DAYS !== "undefined" ? DAYS : []);
const cfN = id => { const d = days().find(x => String(x.id) === String(id)); return d && d.cf ? d.cf.n : (Number(id) > 10 ? Number(id) - 10 : Number(id)); };
const dayName = id => `Case Flow Day ${cfN(id)}`;
const cfDayIds = () => { const ids = days().filter(d => d.cf).map(d => d.id); return ids.length ? ids : [11, 12, 13, 14, 15]; };
// "Day 11 · Case Flow Day 1 · X — CM Self-Summary" → "Case Flow Day 1 · X"; a bare "Day 11" → "Case Flow Day 1"
function label(s){
  let t = String(s || "").replace(/^Day \d+ · (?=Case Flow Day)/, "").replace(/ — CM Self-Summary$/, "");
  return t.replace(/\bDay (1[1-5])\b(?! ·? ?Case)/g, (m, id) => `Case Flow Day ${cfN(id)}`);
}
function docTitle(id){ try{ const d = typeof cmDoc === "function" ? cmDoc(id) : null; return (d && (d.title || d.name)) || id; }catch(e){ return id; } }
let BLOCKS = null;
function blocks(){
  if(BLOCKS) return BLOCKS;
  const out = {}, CF = window.CM_CASE_FLOW;
  if(CF && CF.days) CF.days.forEach(d => (d.modules || []).forEach(m => { out[m.id] = {title: m.title, n: d.n, mod: true};
    (m.blocks || []).forEach(b => { out[b.id] = {title: b.title, n: d.n, kind: b.kind, checks: (b.act && b.act.checkpoints) || []}; }); }));
  return (BLOCKS = out);
}
const blockTitle = id => (blocks()[id] && blocks()[id].title) || id;
const hoursSince = (at, now) => at ? (now - ms(at)) / 3600000 : 0;
const pctTone = (p, pass) => p == null ? "info" : p >= (pass || 70) ? "good" : p >= 50 ? "warn" : "bad";
const fails = h => (Array.isArray(h) ? h : []).filter(x => x && x.passed === false);

/* What the trainee touched in Case Flow (REC = their "case-flow" record) */
function touched(cf){
  const ids = new Set();
  ["reached", "ticks", "work", "listen", "notes", "calls", "audits", "service", "amend"].forEach(k => Object.keys((cf && cf[k]) || {}).forEach(id => ids.add(id)));
  Object.values((cf && cf.injects) || {}).forEach(x => x && x.blockId && ids.add(x.blockId));
  return ids;
}

/* ============================================================
   THE ALERTS: pure, over one trainee's progress data
   compute(data, {rec, now}) → [{key, rule, sev: "high"|"medium", title, detail, fix, at, fixable}]
   ============================================================ */
function compute(data, ctx){
  data = data || {}; ctx = ctx || {};
  const now = ctx.now || Date.now(), rec = ctx.rec || {};
  const out = [], add = a => { a.icon = RULES[a.rule].icon; a.ruleName = RULES[a.rule].name; out.push(a); };
  const dp = data["day-progress"] || rec.dayProgress || {};
  const cf = data["case-flow"] || {}, filing = data["doc-filing"] || {};
  const day1 = cfDayIds()[0];
  const kc1 = dp[day1] || null;
  const t = touched(cf);
  const openWorked = t.has(OPEN_ACT);
  const filedAny = Object.values(filing).some(r => r && r.filed);
  const triedAny = Object.values(filing).some(r => r && r.attempts > 0);
  const movedOn = [...t].some(id => id !== OPEN_ACT) || !!(kc1 && (typeof kc1.score === "number" || (kc1.history || []).length)) || triedAny;

  // R1 / R2 / R8 — each document, one alert at most
  Object.entries(filing).forEach(([id, r]) => {
    if(!r || !(r.attempts > 0)) return;
    const title = docTitle(id), last = (r.problems || [])[0] || "";
    const wrongM = /files this document under (.+?), not (.+?)\./.exec(last);
    const wrongNow = !r.filed && (!!wrongM || (r.wrongCat > 0 && r.lastWrongCat && /under/.test(last)));
    const expected = r.expectedCat || (wrongM && wrongM[1]) || "";
    const tried = r.lastWrongCat || (wrongM && wrongM[2]) || "";
    const at = r.lastAt || r.at || null;
    if(wrongNow){
      add({key: `wrongcat:${id}`, rule: "wrongcat", sev: "high", at, fixable: true, subject: id,
        title: `${title}: put under ${tried || "the wrong category"}`,
        detail: `R2: the CMS refused it because the firm files it under ${expected || "another category"}${r.attempts > 1 ? ` · ${r.attempts} attempts so far` : ""}. Not filed yet.`,
        fix: `File it again under ${expected || "the category the CMS named"}, with the name <Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.<ext>.`});
    } else if(r.attempts >= T.REFUSED){
      add({key: `refused:${id}`, rule: "refused", sev: r.filed ? "medium" : "high", at, fixable: !r.filed, subject: id,
        title: r.filed ? `${title}: filed only on attempt ${r.attempts}` : `${title}: refused ${r.attempts} times`,
        detail: r.filed ? `R1: the CMS refused it ${r.attempts - 1} times before it was filed as ${r.name || "named"}${r.category ? " under " + r.category : ""}.`
                        : `R1: ${r.attempts} attempts, none accepted.${last ? ` Last refusal: ${last}` : ""}`,
        fix: r.filed ? "Filed now. Before the next one, compare its name with the convention part by part." : "Read the CMS's reason, then rename it part by part: <Case ID>_<Last-First>_<Type>_<YYYY-MM-DD>.<ext>, the Type being its CMS category."});
    } else if(r.filed && (r.wrongCat || 0) >= T.WRONG_FILED){
      add({key: `wrongcat:${id}`, rule: "wrongcat", sev: "medium", at: r.at || at, fixable: false, subject: id,
        title: `${title}: wrong category ${r.wrongCat} times before it was filed`,
        detail: `R2: tried under ${r.lastWrongCat || "other categories"} before ${r.category || expected || "the right one"}.`, fix: ""});
    } else if(!r.filed && r.firstAt && hoursSince(r.firstAt, now) >= T.STUCK_H){
      add({key: `stuck:doc:${id}`, rule: "stuck", sev: "medium", at, fixable: true, subject: id,
        title: `${title}: still not filed after ${Math.floor(hoursSince(r.firstAt, now))} h`,
        detail: `R8: first tried ${new Date(r.firstAt).toLocaleString()}, ${r.attempts} attempt${r.attempts === 1 ? "" : "s"}.${last ? ` Last refusal: ${last}` : ""}`,
        fix: "Open the document's 📤 File in the CMS row and finish it, or ask your trainer what the CMS's message means."});
    }
  });

  // R3 — the Backup Drive (R8 when the setup has been failing for a day)
  const ds = data["drive-setup"], dc = data["drive-check"], dg = data["drive-grades"] || {};
  if(ds && ds.ok === false){
    const h = hoursSince(ds.firstAt, now), stuck = ds.firstAt && h >= T.STUCK_H;
    add({key: "drive:setup", rule: stuck ? "stuck" : "drive", sev: "high", at: ds.at, fixable: true,
      title: `Backup Drive folders not built${typeof ds.left === "number" ? `: ${ds.left} thing${ds.left === 1 ? "" : "s"} to fix` : ""}`,
      detail: `${stuck ? `R8: still failing ${Math.floor(h)} h after the first try` : "R3: the Day 1 folder structure fails its check"} · ${ds.attempts || 1} attempt${(ds.attempts || 1) === 1 ? "" : "s"}${typeof ds.score === "number" ? ` · ${ds.score}%` : ""}.`,
      fix: "Open Day 1's 📂 Backup Drive card, fix the folders it lists against the firm's structure, and submit again."});
  }
  if(dc && dc.missing > 0 && !(ds && ds.ok === false)){
    add({key: "drive:missing", rule: "drive", sev: "high", at: dc.at, fixable: true,
      title: `${dc.missing} firm folder${dc.missing === 1 ? "" : "s"} missing from the Backup Drive`,
      detail: `R3: at the last ✓ Check my drive${(dc.list || []).length ? `: ${(dc.list || []).slice(0, 4).join(", ")}${dc.list.length > 4 ? "…" : ""}` : ""}.`,
      fix: "On the 📂 Backup Drive card, press 🔁 Put back, then ✓ Check my drive again."});
  }
  Object.keys(dg).sort().forEach(n => { const g = dg[n]; if(!g || g.passed !== false || typeof g.score !== "number") return;
    add({key: `drive:day${n}`, rule: "drive", sev: g.score < 50 ? "high" : "medium", at: g.at, fixable: true,
      title: `Day ${n} Backup File Maintenance: ${g.score}%`, detail: `R3: below the ${T.DRIVE_PASS}% pass mark, graded from the Drive itself.`,
      fix: `Open Day ${n}'s Backup File Maintenance, move each document to its folder and name it the firm's way, then ✓ Check my drive.`}); });
  if(!ds && movedOn && (openWorked || t.has("d1m1-drive"))){
    add({key: "drive:none", rule: "drive", sev: "high", at: (kc1 && kc1.date) || cf.updatedAt || null, fixable: true,
      title: "No Backup Drive set up", detail: "R3: Day 1's opening work is done but the Backup Drive's folders were never submitted.",
      fix: "Do Day 1's 📂 Backup Drive: link your Google Drive folder, build the firm's folders and submit them."});
  }

  // R4 — the CMS Case ID after Day 1's opening activity
  const cmsRef = Object.values(cf.work || {}).some(w => w && w.tool === "cms" && String(w.ref || "").trim());
  if(openWorked && movedOn && !cmsRef && !filedAny){
    add({key: "caseid", rule: "caseid", sev: "high", at: cf.updatedAt || null, fixable: true,
      title: "No CMS Case ID logged", detail: `R4: "${blockTitle(OPEN_ACT)}" was worked and left without the case's CMS Case ID, and no document has been filed into a case.`,
      fix: `Open the case in the CMS (save it so it gets its Case ID), then on "${blockTitle(OPEN_ACT)}" press 🧾 Log it.`});
  }

  // R6 — the Conflict Check (the opening activity's first checkpoint)
  const ticks = ((cf.ticks || {})[OPEN_ACT]) || [], nChecks = (blocks()[OPEN_ACT] && blocks()[OPEN_ACT].checks.length) || 8;
  const othersTicked = ticks.slice(1).filter(Boolean).length;
  if(openWorked && !ticks[0] && (movedOn || othersTicked >= nChecks - 1)){
    add({key: "conflict", rule: "conflict", sev: "high", at: (cf.tickAt || {})[OPEN_ACT] || cf.updatedAt || null, fixable: true,
      title: "Conflict Check not documented", detail: `R6: "${blockTitle(OPEN_ACT)}" was left with its first checkpoint (Conflict Check documented before the matter was created) unticked${othersTicked ? `, ${othersTicked} other checkpoint${othersTicked === 1 ? "" : "s"} ticked` : ""}.`,
      fix: "In CMS → New Case, run and document the Conflict Check on every party's full legal name, then hand the activity in to the AI Grader."});
  }

  // R5 — a Skill Activity's latest graded attempt below 50%
  const latest = {};
  (data["work-log"] || []).filter(e => e && e.kind === "lab" && typeof e.score === "number" && !/Self-Summary/.test(e.label || "") && !/^Random Task/.test(e.label || ""))
    .forEach(e => { const k = e.label || e.toolId || "Skill Activity"; if(!latest[k] || ms(e.at) >= ms(latest[k].at)) latest[k] = e; });
  Object.entries(latest).forEach(([k, e]) => { if(e.score >= T.LOW_SKILL) return;
    add({key: `lowskill:${k}`, rule: "lowskill", block: e.blockId || e.block || null, sev: e.score < 30 ? "high" : "medium", at: e.at || null, fixable: true,
      title: `${label(k)}: ${e.score}%`, detail: `R5: the latest graded attempt is under ${T.LOW_SKILL}%${(e.gaps || []).length ? `. Gaps: ${(e.gaps || []).slice(0, 2).join("; ")}` : ""}.`,
      fix: "Re-read the activity's task and rubric, redo it and submit it again."}); });

  // R7 / R8 — the Knowledge Checks
  cfDayIds().forEach(id => {
    const p = dp[id]; if(!p || p.done) return;
    const f = fails(p.history), first = (p.history || []).map(h => h && h.date).filter(Boolean).sort()[0];
    if(f.length >= T.KC_FAILS){
      add({key: `kcfail:${id}`, rule: "kcfail", sev: f.length >= 3 ? "high" : "medium", at: (f[f.length - 1] || {}).date || p.date || null, fixable: true,
        title: `${dayName(id)} Knowledge Check failed ${f.length} times`, detail: `R7: scores ${f.map(h => h.score + "%").join(", ")}; ${T.KC_PASS}% passes. Best so far ${p.score}%.`,
        fix: `Review the questions you missed, then retake ${dayName(id)}'s Knowledge Check.`});
    } else if(first && hoursSince(first, now) >= T.KC_STUCK_H){
      add({key: `stuck:kc:${id}`, rule: "stuck", sev: "medium", at: p.date || first, fixable: true,
        title: `${dayName(id)} Knowledge Check not passed after ${Math.floor(hoursSince(first, now) / 24)} days`, detail: `R8: first taken ${new Date(first).toLocaleDateString()}; best ${p.score}%.`,
        fix: `Retake ${dayName(id)}'s Knowledge Check.`});
    }
  });
  return out.sort((a, b) => (a.sev === b.sev ? 0 : a.sev === "high" ? -1 : 1) || ms(b.at) - ms(a.at));
}

/* ============================================================
   THE LOG: pure, over one trainee's progress data
   entries(data, {feedback, feedbackRaw, gradedCalls}) → [{at, icon, title, detail, score, tone}] newest first
   ============================================================ */
function entries(data, ctx){
  data = data || {}; ctx = ctx || {};
  const L = [], add = e => { if(ms(e.at)) L.push(e); };
  const wl = Array.isArray(data["work-log"]) ? data["work-log"] : [];
  // graded work, Knowledge Checks, roleplays, activities delivered
  wl.forEach(e => {
    if(!e || !e.at) return;
    const s = num(e.score);
    if(e.kind === "lab"){
      if(/^Random Task/.test(e.label || "")) return;
      const lc = /Self-Summary/.test(e.label || "");
      add({at: e.at, icon: lc ? "🧩" : "🧪", kind: lc ? "lc" : "skill", title: `${lc ? "Learning Check" : "Skill Activity"}: ${label(e.label)}`, score: s, tone: pctTone(s),
        detail: [e.tier ? (typeof displayTier === "function" ? displayTier(e.tier) : e.tier) : "", (e.strengths || [])[0] ? `Strength: ${e.strengths[0]}` : "", (e.gaps || [])[0] ? `To work on: ${e.gaps[0]}` : ""].filter(Boolean).join(" · ")});
    } else if(e.kind === "quiz"){
      const passed = s != null && s >= T.KC_PASS;
      add({at: e.at, icon: "✍️", kind: "kc", title: `Knowledge Check: ${label(e.label || "Day " + e.dayId)}`, score: s, tone: passed ? "good" : "bad",
        detail: `${passed ? "Passed" : `Not passed yet (${T.KC_PASS}% passes)`}${e.total ? ` · ${e.correct}/${e.total} correct` : ""}${!passed && (e.missed || []).length ? ` · missed ${(e.missed || []).length}` : ""}`});
    } else if(e.kind === "roleplay"){
      add({at: e.at, icon: "🎭", kind: "call", title: label(e.label || "Roleplay"), score: s, tone: pctTone(s), detail: e.tier ? (typeof displayTier === "function" ? displayTier(e.tier) : e.tier) : ""});
    } else if(e.kind === "activity"){
      add({at: e.at, icon: "📦", kind: "activity", title: `Activity delivered: ${label(e.label).replace(/^Case Flow Day \d+ activity: |^Day \d+ activity: /, "")}`, tone: "good", detail: e.dayId ? dayName(e.dayId) : ""});
    }
  });
  // Knowledge Check attempts with no work-log line (older records)
  const quizAt = wl.filter(e => e && e.kind === "quiz").map(e => ms(e.at));
  Object.entries(data["day-progress"] || {}).forEach(([id, p]) => (p && p.history || []).forEach(h => {
    if(!h || !h.date || quizAt.some(t => Math.abs(t - ms(h.date)) < 120000)) return;
    add({at: h.date, icon: "✍️", kind: "kc", title: `Knowledge Check: ${dayName(id)}`, score: num(h.score), tone: h.passed ? "good" : "bad", detail: h.passed ? "Passed" : `Not passed yet (${T.KC_PASS}% passes)`});
  }));
  // roleplays not already in the work-log
  const rpAt = wl.filter(e => e && e.kind === "roleplay").map(e => ms(e.at));
  (data.roleplayHistory || []).forEach(r => { if(!r || !r.date || rpAt.some(t => Math.abs(t - ms(r.date)) < 180000)) return;
    add({at: r.date, icon: "🎭", kind: "call", title: `Roleplay: ${r.topicLabel || r.categoryLabel || "practice call"}`, score: num(r.score), tone: pctTone(num(r.score)), detail: r.categoryLabel || ""}); });
  // random tasks
  (data["task-log"] || []).forEach(x => {
    if(!x) return;
    const what = String(x.task || "").replace(/\s+/g, " ").slice(0, 90) + (String(x.task || "").length > 90 ? "…" : "");
    if(x.status === "resolved") add({at: x.submittedAt || x.receivedAt, icon: "🎲", kind: "task", title: `Random task resolved (${dayName(x.dayId)})`, score: num(x.score), tone: pctTone(num(x.score)), detail: what});
    else if(x.status === "missed") add({at: x.missedAt || x.expiresAt || x.receivedAt, icon: "🎲", kind: "task", title: `Random task missed (${dayName(x.dayId)})`, score: 0, tone: "bad", detail: what});
    else add({at: x.receivedAt, icon: "🎲", kind: "task", title: `Random task received (${dayName(x.dayId)})`, tone: "info", detail: `${x.status === "progress" ? "In progress" : "Not started"} · ${what}`});
  });
  // documents filed into the CMS
  Object.entries(data["doc-filing"] || {}).forEach(([id, r]) => {
    if(!r || !(r.attempts > 0)) return;
    if(r.filed) add({at: r.at || r.lastAt, icon: "📤", kind: "doc", title: `Filed: ${docTitle(id)}`, score: Math.round(100 / r.attempts), tone: r.attempts === 1 ? "good" : r.attempts >= T.REFUSED ? "bad" : "warn",
      detail: `${r.attempts === 1 ? "First time right" : `${r.attempts} attempts`} · ${r.name || ""}${r.category ? ` under ${r.category}` : ""}`});
    else add({at: r.lastAt || r.firstAt, icon: "📤", kind: "doc", title: `Filing refused: ${docTitle(id)}`, tone: "bad",
      detail: `${r.attempts} attempt${r.attempts === 1 ? "" : "s"}, not filed yet${(r.problems || [])[0] ? ` · ${r.problems[0]}` : ""}`});
  });
  // the Backup Drive
  const ds = data["drive-setup"];
  if(ds && ds.at) add({at: ds.at, icon: "📂", kind: "drive", title: ds.ok ? "Backup Drive: Day 1 folders built" : "Backup Drive: Day 1 folders not built yet", score: num(ds.score), tone: ds.ok ? "good" : "bad",
    detail: ds.ok ? `Built on attempt ${ds.attempts || 1}` : `${ds.left || 0} thing${ds.left === 1 ? "" : "s"} to fix · attempt ${ds.attempts || 1}`});
  Object.entries(data["drive-grades"] || {}).forEach(([n, g]) => { if(g && g.at && typeof g.score === "number")
    add({at: g.at, icon: "📂", kind: "drive", title: `Backup Drive check: Day ${n} Backup File Maintenance`, score: num(g.score), tone: g.passed ? "good" : "bad", detail: g.passed ? "Passed" : `Below ${T.DRIVE_PASS}%`}); });
  const dc = data["drive-check"];
  if(dc && dc.at) add({at: dc.at, icon: "📂", kind: "drive", title: dc.putBack ? "Backup Drive: missing folders put back" : "Backup Drive: ✓ Check my drive", tone: dc.missing ? "bad" : "good",
    detail: dc.missing ? `${dc.missing} folder${dc.missing === 1 ? "" : "s"} missing` : "Every firm folder in place"});
  // Case Flow: the CMS Case ID logged, calls, injected calls, checkpoints
  const cf = data["case-flow"] || {};
  Object.entries(cf.work || {}).forEach(([id, w]) => { if(w && w.at) add({at: w.at, icon: "🧾", kind: "case", title: w.tool === "cms" ? "CMS Case ID logged" : "Work logged", tone: "good", detail: `${w.ref || ""} · ${blockTitle(id)}`}); });
  Object.entries(cf.calls || {}).forEach(([id, c]) => { if(c && c.at) add({at: c.at, icon: "📞", kind: "call", title: `Call taken: ${blockTitle(id)}`, tone: "good", detail: c.lines ? `${c.lines} lines of conversation` : ""}); });
  Object.values(cf.injects || {}).forEach(x => { if(!x) return; const ans = x.outcome === "answered";
    add({at: x[x.outcome + "At"] || x.at, icon: "📞", kind: "call", title: `Incoming call ${ans ? "answered" : "missed"}${x.who ? `: ${x.who}` : ""}`, tone: ans ? "good" : "bad", detail: x.blockId ? blockTitle(x.blockId) : ""}); });
  Object.entries(cf.tickAt || {}).forEach(([id, at]) => { const ticks = (cf.ticks || {})[id] || [], n = (blocks()[id] && blocks()[id].checks.length) || ticks.length;
    const got = ticks.filter(Boolean).length; if(!got) return;
    add({at, icon: "☑️", kind: "case", title: `Checkpoints: ${blockTitle(id)}`, tone: got >= n ? "good" : "info", detail: `${got} of ${n} ticked${id === OPEN_ACT && !ticks[0] ? " · Conflict Check not ticked" : ""}`}); });
  // graded calls (Call Simulator)
  const gc = ctx.gradedCalls;
  if(gc && Array.isArray(gc.calls)) gc.calls.forEach(c => { if(c && (c.at || c.date) && typeof c.score === "number")
    add({at: c.at || c.date, icon: "☎️", kind: "call", title: `Graded call${c.line ? `: ${c.line}` : ""}`, score: num(c.score), tone: pctTone(num(c.score)), detail: c.caller || c.title || ""}); });
  // feedback received
  Object.entries(ctx.feedback || {}).forEach(([d, f]) => { if(f && f.sentAt)
    add({at: f.sentAt, icon: "💬", kind: "feedback", title: `Trainer feedback: ${dayName(d)}${f.rating ? ` · ${f.rating}` : ""}`, tone: f.rating === "Strong" ? "good" : f.rating === "Needs Support" ? "bad" : "info",
      detail: `From ${f.sentBy || "your trainer"}${f.readAt ? "" : " · not read yet"}`}); });
  Object.entries((ctx.feedbackRaw && ctx.feedbackRaw.caseFlow) || {}).forEach(([id, t]) => { if(t && t.at && typeof t.score === "number")
    add({at: t.at, icon: "💬", kind: "feedback", title: `Trainer scored your Learning Check: ${blockTitle(id)}`, score: num(t.score), tone: pctTone(num(t.score)), detail: t.comment ? String(t.comment).slice(0, 140) : ""}); });
  return L.sort((a, b) => ms(b.at) - ms(a.at));
}

/* ============================================================
   TRAINEE: the dashboard's 📒 My Progress Log
   ============================================================ */
const isTrainee = () => typeof state !== "undefined" && !!state.traineeId && !state.isAdmin;
const KEYS = ["work-log", "task-log", "roleplayHistory", "doc-filing", "drive-setup", "drive-grades", "drive-check", "case-flow", "day-progress"];
// The trainee's own saved progress, as this browser holds it (what storeSet wrote): no request
function ownData(){
  const d = {};
  KEYS.forEach(k => {
    let v; try{ if(typeof mem !== "undefined" && mem[k] !== undefined) v = mem[k]; }catch(e){}
    if(v === undefined){ try{ const raw = localStorage.getItem("lsh_" + k); if(raw !== null) v = JSON.parse(raw); }catch(e){} }
    if(v != null) d[k] = v;
  });
  if(state.docFiling && typeof state.docFiling === "object") d["doc-filing"] = state.docFiling;
  if(Array.isArray(state.workLog)) d["work-log"] = state.workLog;
  if(Array.isArray(state.taskLog)) d["task-log"] = state.taskLog;
  if(state.progress && Object.keys(state.progress).length) d["day-progress"] = state.progress;
  return d;
}
const fmtDay = at => { const t = new Date(at), today = new Date(); const y = new Date(); y.setDate(today.getDate() - 1);
  if(t.toDateString() === today.toDateString()) return "Today"; if(t.toDateString() === y.toDateString()) return "Yesterday";
  return t.toLocaleDateString(undefined, {weekday: "short", month: "short", day: "numeric", year: t.getFullYear() === today.getFullYear() ? undefined : "numeric"}); };
const fmtTime = at => new Date(at).toLocaleTimeString(undefined, {hour: "numeric", minute: "2-digit"});
const SHOW = 30;
function myLog(){
  const data = ownData();
  const list = entries(data, {feedback: state.myFeedback || {}, feedbackRaw: state.myFeedbackRaw || null, gradedCalls: state.gradedCalls || null});
  const fix = compute(data, {rec: {dayProgress: state.progress || {}}}).filter(a => a.fixable);
  return {list, fix};
}
/* 📖 Learn it: the slide that teaches the item, on its day (a low score: the activity's own task) */
function learnOf(a){
  const t = TEACH[a.rule] || {};
  if(t.learn) return t.learn;
  if(a.rule === "lowskill" && a.block) return [a.block, "task"];
  return null;
}
function lessonAt(id){ try{ for(const d of DAYS){ const l = (d.lessons || []).find(x => x.cf && x.cf.block.id === id); if(l) return {day: d, title: l.cf.block.title}; } }catch(e){} return null; }
function teachHtml(a, cls){
  const t = TEACH[a.rule] || {}, lr = learnOf(a), at = lr && lessonAt(lr[0]);
  const detail = String(a.detail || "").replace(/^R\d+:\s*/, "");   // the rule's code is for the trainer
  return `<b>${E(a.icon)} ${E(a.title)}</b>`
    + (detail ? `<span class="${cls}-d"><i>What your work shows:</i> ${E(detail)}</span>` : "")
    + (t.standard ? `<span class="${cls}-std"><i>📏 The standard:</i> ${E(t.standard)}</span>` : "")
    + (t.why ? `<span class="${cls}-why"><i>💡 Why it matters:</i> ${E(t.why)}</span>` : "")
    + (a.fix ? `<span class="${cls}-do"><i>🛠 Your next step:</i> ${E(a.fix)}</span>` : "")
    + (at ? `<button type="button" class="plog-learn" onclick="cmProgressLog.learn('${E(lr[0])}','${E(lr[1])}')">📖 Learn it: ${E(at.title)} →</button>` : "");
}
function learnGo(id, view){
  const at = lessonAt(id); if(!at) return;
  if(typeof closeMissing === "function") closeMissing();
  if(typeof goto === "function") goto("day", at.day.id);
  setTimeout(() => { state.dayViewMode = "slides"; if(typeof render === "function") render();
    setTimeout(() => { if(window.cmCaseFlow && cmCaseFlow.toView) cmCaseFlow.toView(id, view); }, 0); }, 0);
}
function needsHtml(fix){
  if(!fix.length) return "";
  return `<div class="plog-fix" role="region" aria-label="Needs fixing"><div class="plog-fix-h">⚠ Needs fixing <span>${fix.length}</span><small>Your trainer sees these too.</small></div>
    <ul>${fix.map(a => `<li class="sev-${a.sev}">${teachHtml(a, "plog-fix")}</li>`).join("")}</ul></div>`;
}
function rowHtml(e){
  return `<li class="plog-row tone-${e.tone || "info"}" data-at="${E(e.at)}" data-kind="${E(e.kind || "")}"><span class="plog-time">${E(fmtTime(e.at))}</span><span class="plog-ic" aria-hidden="true">${E(e.icon)}</span>
    <span class="plog-what"><b>${E(e.title)}</b>${e.detail ? `<small>${E(e.detail)}</small>` : ""}</span>${e.score != null ? `<span class="plog-score">${e.score}%</span>` : ""}</li>`;
}
function logHtml(){
  const {list, fix} = myLog();
  const shown = state.plogAll ? list : list.slice(0, SHOW);
  const groups = []; shown.forEach(e => { const k = fmtDay(e.at); const g = groups[groups.length - 1]; if(g && g.k === k) g.items.push(e); else groups.push({k, items: [e]}); });
  const counts = {doc: 0, good: 0}; list.forEach(e => { if(e.kind === "doc" && e.tone === "good") counts.doc++; });
  return `<section class="card plog" id="myProgressLog" aria-label="My Progress Log">
    <div class="plog-h"><h2>📒 My Progress Log</h2><div class="plog-sum"><span><b>${list.length}</b> logged</span>${counts.doc ? `<span><b>${counts.doc}</b> filed first time right</span>` : ""}${fix.length ? `<span class="bad"><b>${fix.length}</b> to fix</span>` : `<span class="ok">✓ nothing to fix</span>`}</div></div>
    ${needsHtml(fix)}
    ${list.length ? groups.map(g => `<div class="plog-day"><div class="plog-dh">${E(g.k)}</div><ul class="plog-list">${g.items.map(rowHtml).join("")}</ul></div>`).join("")
      : `<p class="plog-empty">Nothing logged yet. Each activity you deliver, document you file, Knowledge Check, call, drive check and random task shows up here with how it went.</p>`}
    ${list.length > SHOW ? `<button type="button" class="btn btn-ghost btn-sm plog-more" onclick="cmProgressLog.toggleAll()">${state.plogAll ? "Show the latest " + SHOW : `Show all ${list.length}`}</button>` : ""}
  </section>`;
}
if(typeof renderDashboard === "function"){
  const __dash = renderDashboard;
  renderDashboard = window.renderDashboard = function(){
    const html = __dash.apply(this, arguments);
    if(!isTrainee()) return html;
    let log = ""; try{ log = logHtml(); }catch(e){ console.warn("progress log", e); return html; }
    const t = document.createElement("template"); t.innerHTML = html;
    const main = t.content.querySelector(".dash-main"); if(!main) return html;
    main.insertAdjacentHTML("beforeend", log);
    return t.innerHTML;
  };
}
// The way to it is 📒 Progress Log in the trainee's top bar (next to 🏅 My Performance), not a button on the dashboard's
// banner: from any page it opens the dashboard at the log, with the number to fix on it.
function fixCount(){ try{ return myLog().fix.length; }catch(e){ return 0; } }
if(typeof renderTopbar === "function"){
  const __bar = renderTopbar;
  renderTopbar = window.renderTopbar = function(){
    const html = __bar.apply(this, arguments);
    if(!isTrainee() || state.adminPreview) return html;
    const fix = fixCount();
    const b = `<button type="button" class="plog-jump${fix ? " has-fix" : ""}" onclick="cmProgressLog.open(this)" title="${fix ? `You have ${fix} thing${fix === 1 ? "" : "s"} to fix: click to see what is missing` : "My Progress Log: what you did and how it went"}">📒 Progress Log${fix ? `<b>⚠ ${fix} to fix</b>` : ""}</button>`;
    const i = html.indexOf('class="nav-focus"'), s = i < 0 ? -1 : html.lastIndexOf("<button", i);
    if(s >= 0) return html.slice(0, s) + b + html.slice(s);
    const n = html.lastIndexOf("</nav>");
    return n < 0 ? html : html.slice(0, n) + b + html.slice(n);
  };
}

/* ============================================================
   TRAINERS: the alerts over every trainee (the Trainee Audit's progress, already loaded)
   ============================================================ */
const isAdmin = () => typeof state !== "undefined" && !!state.isAdmin && !state.adminPreview;
const resolvedOf = id => ((state.caseAlertsResolved || {})[id]) || {};
const isResolved = (id, a) => { const r = resolvedOf(id)[a.key]; return !!(r && (!a.at || ms(r.at) >= ms(a.at))); };
function forRec(rec){
  const x = state.auditExtra && state.auditExtra[rec.id]; if(!x) return [];
  return compute(x.data || {}, {rec}).map(a => Object.assign(a, {traineeId: rec.id}));
}
function openFor(rec){ return forRec(rec).filter(a => !isResolved(rec.id, a)); }
const live = r => r && r.approved === true && !r.archived && !r.rejected;
function allOpen(){ return (state.adminData || []).filter(live).reduce((n, r) => n + openFor(r).length, 0); }

function panelHtml(){
  const rows = (window.cmAudit && cmAudit.rows ? cmAudit.rows().map(x => x.rec) : (state.adminData || [])).filter(r => state.auditExtra && state.auditExtra[r.id]);
  const showRes = !!state.caseAlertsShowResolved;
  const items = []; rows.forEach(r => forRec(r).forEach(a => { const res = isResolved(r.id, a); if(!res || showRes) items.push({r, a, res}); }));
  const open = items.filter(i => !i.res).length;
  let resN = 0; rows.forEach(r => forRec(r).forEach(a => { if(isResolved(r.id, a)) resN++; }));
  items.sort((x, y) => (x.res - y.res) || (x.a.sev === y.a.sev ? 0 : x.a.sev === "high" ? -1 : 1) || ms(y.a.at) - ms(x.a.at));
  const when = at => at ? `${new Date(at).toLocaleDateString(undefined, {month: "short", day: "numeric"})} ${fmtTime(at)}` : "—";
  return `<div class="card cma" id="cmAlertsPanel" role="region" aria-label="Case-file alerts">
    <div class="cma-h"><h2>🚨 Case-file alerts <span>${open} open</span></h2>
      <div class="cma-tools"><label class="cma-res"><input type="checkbox" ${showRes ? "checked" : ""} onchange="cmCaseAlerts.showResolved(this.checked)"> Show resolved (${resN})</label>
      <button type="button" class="btn btn-sm btn-ghost" onclick="cmAudit.need('alerts')">✕ Close</button></div></div>
    <details class="cma-rules"><summary>How an alert is raised (8 rules, from each trainee's own recorded work)</summary><ol>${Object.entries(RULES).map(([k, r], i) => `<li><b>R${i + 1} ${E(r.icon)} ${E(r.name)}</b> ${E(r.why)}</li>`).join("")}</ol></details>
    ${items.length ? `<table class="cma-table"><thead><tr><th>Trainee</th><th>Rule</th><th>Details</th><th>When</th><th></th></tr></thead><tbody>${items.map(({r, a, res}) => {
      const rr = resolvedOf(r.id)[a.key];
      return `<tr class="sev-${a.sev}${res ? " is-res" : ""}" data-key="${E(a.key)}" data-id="${E(r.id)}">
        <td><button type="button" class="cma-who" onclick="cmAudit.detail('${J(r.id)}')">${E(r.name || r.id)}</button><div class="cma-dim">${E(typeof cleanBatch === "function" ? cleanBatch(r.batch) || "" : r.batch || "")}</div></td>
        <td><span class="cma-sev ${a.sev}">${a.sev === "high" ? "🔴 Urgent" : "🟠 Watch"}</span><div class="cma-rule">${E(a.icon)} ${E(a.ruleName)}</div></td>
        <td><b>${E(a.title)}</b><div class="cma-dim">${E(a.detail)}</div>${a.fix ? `<div class="cma-do">Trainee told: ${E(a.fix)}</div>` : ""}</td>
        <td class="cma-when">${E(when(a.at))}</td>
        <td class="cma-act">${res ? `<div class="cma-dim">✓ Resolved${rr && rr.by ? ` by ${E(rr.by)}` : ""}${rr && rr.at ? ` · ${E(when(rr.at))}` : ""}</div><button type="button" class="btn btn-sm btn-ghost" onclick="cmCaseAlerts.reopen('${J(r.id)}','${J(a.key)}')">↩ Reopen</button>`
          : `<button type="button" class="btn btn-sm btn-navy cma-ok" onclick="cmCaseAlerts.resolve('${J(r.id)}','${J(a.key)}', this)">✓ Resolved</button>`}</td></tr>`; }).join("")}</tbody></table>`
      : `<p class="cma-empty">${rows.length ? "No open case-file alerts for the trainees shown. ✓" : "Loading the trainees' progress…"}</p>`}
  </div>`;
}
function repaint(){
  const p = document.getElementById("cmAlertsPanel"); if(p && state.auditNeed === "alerts") p.outerHTML = panelHtml();
  const n = document.getElementById("atNeeds"); if(n && typeof renderAdminRows === "function"){ /* the chip counts follow */ }
  paintBadge();
}
async function setMark(id, key, mark, btn){
  if(!isAdmin()) return;
  if(btn){ btn.disabled = true; btn.textContent = "Saving…"; }
  // the latest record first, so two trainers marking at once don't undo each other
  let cur = null; try{ cur = await sharedGet("case-alerts:resolved"); }catch(e){}
  cur = cur && typeof cur === "object" ? cur : {};
  cur[id] = cur[id] || {};
  if(mark) cur[id][key] = mark; else delete cur[id][key];
  const ok = await sharedSet("case-alerts:resolved", cur);
  if(!ok){ if(typeof toast === "function") toast("Couldn't save: check your connection and try again."); if(btn){ btn.disabled = false; btn.textContent = "✓ Resolved"; } return; }
  state.caseAlertsResolved = cur;
  if(typeof toast === "function") toast(mark ? "Marked resolved. It opens again if the trainee repeats it." : "Reopened.");
  repaint();
  const wrap = document.getElementById("adminRowsWrap"); if(wrap && typeof renderAdminRows === "function") wrap.innerHTML = renderAdminRows();
}
function paintBadge(){
  const nav = document.querySelector(".topbar .nav, .topbar"); if(!nav) return;
  let b = document.getElementById("cmAlertsBadge");
  const n = isAdmin() && state.adminData ? allOpen() : 0;
  if(!n){ if(b) b.remove(); return; }
  if(!b){
    b = document.createElement("button"); b.type = "button"; b.id = "cmAlertsBadge"; b.className = "cma-badge";
    b.setAttribute("onclick", "cmCaseAlerts.open()");
    const admin = [...document.querySelectorAll(".topbar button")].find(x => /openAdmin\(\)/.test(x.getAttribute("onclick") || ""));
    if(admin) admin.after(b); else (document.querySelector(".topbar .nav") || nav).appendChild(b);
  }
  b.title = `${n} open case-file alert${n === 1 ? "" : "s"}: open the list (Trainee Audit)`;
  b.innerHTML = `🚨 Alerts<span class="nav-badge">${n}</span>`;
}
// the Trainee Audit: the list above the table while the 🚨 chip is on
if(typeof window.renderAuditBatchView === "function"){
  const __view = window.renderAuditBatchView;
  renderAuditBatchView = window.renderAuditBatchView = function(){
    const html = __view.apply(this, arguments);
    if(state.auditNeed !== "alerts") return html;
    const at = html.indexOf('<div class="at-scroll"'); if(at < 0) return html;
    return html.slice(0, at) + panelHtml() + html.slice(at);
  };
}
if(typeof window.renderAdminRows === "function"){
  const __rows = window.renderAdminRows;
  renderAdminRows = window.renderAdminRows = function(){
    const html = __rows.apply(this, arguments);
    setTimeout(repaint, 0);   // the progress just loaded: the list and the badge follow
    return html;
  };
}
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ paintBadge(); }catch(e){} return r; };
}

/* ⚠ What you're missing: with something to fix, 📒 Progress Log opens a list under the top bar of each thing to fix and
   what to do about it (the log's own "⚠ Needs fixing"), with a way to the whole log. Trainees only. */
function closeMissing(){ const p = document.getElementById("plogMissing"); if(p) p.remove(); document.removeEventListener("mousedown", outside, true); document.removeEventListener("keydown", onKey, true); }
function outside(e){ const p = document.getElementById("plogMissing"); if(p && !p.contains(e.target) && !e.target.closest(".plog-jump")) closeMissing(); }
function onKey(e){ if(e.key === "Escape") closeMissing(); }
function openMissing(btn){
  if(document.getElementById("plogMissing")){ closeMissing(); return; }
  const fix = myLog().fix; if(!fix.length) return window.cmProgressLog.jump();
  const box = document.createElement("div"); box.id = "plogMissing"; box.className = "plog-missing"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "What you need to fix");
  box.innerHTML = `<div class="plog-missing-h"><b>⚠ ${fix.length} thing${fix.length === 1 ? "" : "s"} to fix</b><button type="button" aria-label="Close" onclick="cmProgressLog.close()">✕</button></div>
    <p class="plog-missing-sub">For each one: what your work shows, the standard the firm holds it to, why it matters on John Doe's file, your next step, and the lesson that teaches it. Your trainer sees these too.</p>
    <ol>${fix.map(a => `<li class="sev-${a.sev}">${teachHtml(a, "plog-missing")}</li>`).join("")}</ol>
    <button type="button" class="btn btn-navy btn-sm" onclick="cmProgressLog.close(); cmProgressLog.jump()">📒 Open my Progress Log</button>`;
  document.body.appendChild(box);
  const r = btn.getBoundingClientRect(), w = box.offsetWidth;
  box.style.left = Math.max(8, Math.min(window.innerWidth - w - 8, r.right - w)) + "px";
  box.style.top = (r.bottom + 8) + "px";
  setTimeout(() => { document.addEventListener("mousedown", outside, true); document.addEventListener("keydown", onKey, true); }, 0);
}

window.cmProgressLog = {
  learn: learnGo,
  entries, compute, RULES, T, ownData,
  html: logHtml,
  open: openMissing, close: closeMissing,
  jump(){
    const go = smooth => { const el = document.getElementById("myProgressLog"); if(el) el.scrollIntoView({behavior: smooth ? "smooth" : "auto", block: "start"}); return !!el; };
    if(state.view === "dashboard") return go(true);
    // from another page: open the dashboard, then go to the log once it is drawn (the page may draw it twice)
    if(typeof goto === "function") goto("dashboard");
    [80, 300, 700].forEach(ms => setTimeout(() => { if(state.view === "dashboard") go(false); }, ms));
  },
  toggleAll(){ state.plogAll = !state.plogAll; const el = document.getElementById("myProgressLog"); if(el) el.outerHTML = logHtml(); }
};
window.cmCaseAlerts = {
  RULES, T, compute, forRec, openFor, allOpen, panel: panelHtml, paintBadge,
  resolve: (id, key, btn) => setMark(id, key, {at: new Date().toISOString(), by: state.traineeName || "Trainer"}, btn),
  reopen: (id, key) => setMark(id, key, null),
  showResolved(on){ state.caseAlertsShowResolved = !!on; repaint(); },
  open(){ state.adminTab = "traineeaudit"; state.auditNeed = "alerts"; if(state.view === "admin") render(); else if(typeof goto === "function") goto("admin"); setTimeout(() => { const p = document.getElementById("cmAlertsPanel"); if(p) p.scrollIntoView({block: "start"}); }, 80); }
};

/* ---------- look: LSH navy and orange, bold, 14px and up ---------- */
const st = document.createElement("style"); st.id = "cm-progress-log"; st.textContent = `
/* a day card with a 💬 Trainer feedback button and a Knowledge Check line is short of height on a laptop: its icon gives
   way so the theme stays readable instead of being cut mid-line */
@media (max-height:900px){ .dash-main .module-card.mc-clean .module-body:has(.fb-open) .module-icon{display:none;} }
.dash-main .module-card.mc-clean .mc-progress{font-weight:700;}
/* 📒 Progress Log in the top bar: a nav button like its neighbours, the number to fix as a small orange count */
.plog-jump{display:inline-flex;align-items:center;gap:6px;}
.plog-jump b{background:#DB8437;color:#241304;border-radius:999px;padding:1px 8px;font-size:12px;font-weight:800;line-height:1.5;}
.plog-missing{position:fixed;z-index:9000;width:min(460px,calc(100vw - 16px));max-height:min(70vh,560px);overflow:auto;background:#fff;color:#1E2340;border:2px solid #DB8437;border-radius:14px;box-shadow:0 18px 40px rgba(20,24,48,.35);padding:14px 16px;font-weight:700;}
.plog-missing-h{display:flex;align-items:center;justify-content:space-between;gap:10px;font-size:18px;}
.plog-missing-h b{color:#B4581A;}
.plog-missing-h button{border:0;background:transparent;font-size:18px;cursor:pointer;color:#1E2340;}
.plog-missing-sub{margin:4px 0 10px;font-size:14px;color:#3c4160;}
.plog-missing ol{margin:0 0 12px;padding-left:20px;display:flex;flex-direction:column;gap:10px;}
.plog-missing li{font-size:15px;line-height:1.35;}
.plog-missing li b{display:block;font-weight:800;}
.plog-missing li span{display:block;font-size:14px;color:#3c4160;}
.plog-missing li.sev-high::marker{color:#C0392B;}
.plog-missing .plog-missing-do{color:#1E2340;}
.plog-missing li > span, .plog-fix li > span{display:block;margin-top:4px;}
.plog-missing-std, .plog-fix-std{color:#1E2340;font-weight:700;} .plog-missing-why, .plog-fix-why{color:#2E3245;font-weight:600;}
.plog-missing li i, .plog-fix li i{font-style:normal;color:#B4581A;font-weight:800;}
.plog-learn{display:inline-block;margin-top:8px;border:2px solid #1E2340;background:#fff;color:#1E2340;border-radius:8px;padding:5px 12px;font:800 14px 'Inter',sans-serif;cursor:pointer;}
.plog-learn:hover{border-color:#DB8437;color:#B4581A;}

.plog-missing .plog-missing-do i{font-style:normal;color:#B4581A;font-weight:800;}
.plog{margin-top:18px;padding:18px 20px !important;font-family:'Inter',system-ui,sans-serif;color:#141A2E;background:#fff !important;scroll-margin-top:12px;}
.plog-h{display:flex;flex-wrap:wrap;gap:8px 16px;align-items:center;justify-content:space-between;border-bottom:3px solid #DB8437;padding-bottom:10px;margin-bottom:12px;}
.plog-h h2{margin:0;font:800 22px 'Inter',system-ui,sans-serif;color:#1E2340;}
.plog-sum{display:flex;flex-wrap:wrap;gap:8px;}
.plog-sum span{font-size:14px;font-weight:700;background:#F1F2F7;border:1px solid #DCE0EA;color:#1E2340;border-radius:999px;padding:4px 12px;}
.plog-sum span.bad{background:#FFF1E2;border-color:#DB8437;color:#7A3F0E;} .plog-sum span.ok{background:#E3F1E8;border-color:#B9DCC6;color:#24563A;}
.plog-fix{border:2px solid #DB8437;background:#FFF7EE;border-radius:12px;padding:12px 14px;margin-bottom:14px;}
.plog-fix-h{font:800 17px 'Inter',system-ui,sans-serif;color:#7A3F0E;display:flex;align-items:center;gap:10px;flex-wrap:wrap;}
.plog-fix-h span{background:#DB8437;color:#241304;border-radius:999px;padding:0 10px;font-size:15px;}
.plog-fix-h small{font-size:14px;font-weight:600;color:#5A3A1A;}
.plog-fix ul{list-style:none;margin:8px 0 0;padding:0;display:grid;gap:8px;}
.plog-fix li{background:#fff;border-left:5px solid #DB8437;border-radius:8px;padding:9px 12px;display:flex;flex-direction:column;gap:3px;font-size:14px;}
.plog-fix li.sev-high{border-left-color:#B3261E;}
.plog-fix li b{font-size:15px;color:#1E2340;}
.plog-fix-d{color:#2E3245;font-weight:600;} .plog-fix-do{color:#1E2340;font-weight:700;} .plog-fix-do i{font-style:normal;color:#B5651F;}
.plog-day{margin-top:10px;}
.plog-dh{font:800 14px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#B5651F;padding:4px 0;border-bottom:1px solid #E4E7EF;}
.plog-list{list-style:none;margin:0;padding:0;}
.plog-row{display:grid;grid-template-columns:78px 30px minmax(0,1fr) auto;gap:10px;align-items:center;padding:9px 6px;border-bottom:1px solid #EEF0F5;font-size:14px;}
.plog-time{font-weight:700;color:#4A5070;font-size:14px;}
.plog-ic{font-size:18px;text-align:center;}
.plog-what b{display:block;font-size:15px;font-weight:800;color:#1E2340;overflow-wrap:anywhere;}
.plog-what small{display:block;font-size:14px;font-weight:600;color:#2E3245;margin-top:2px;overflow-wrap:anywhere;}
.plog-score{font:800 15px 'Inter',system-ui,sans-serif;border-radius:999px;padding:3px 11px;background:#F1F2F7;color:#1E2340;min-width:52px;text-align:center;}
.plog-row.tone-good .plog-score{background:#E3F1E8;color:#24563A;} .plog-row.tone-warn .plog-score{background:#FFE7CF;color:#7A3F0E;} .plog-row.tone-bad .plog-score{background:#F8E1DE;color:#9B3A30;}
.plog-row.tone-bad{box-shadow:inset 4px 0 0 #B3261E;} .plog-row.tone-warn{box-shadow:inset 4px 0 0 #DB8437;} .plog-row.tone-good{box-shadow:inset 4px 0 0 #3E8A5E;}
.plog-empty{font-size:15px;font-weight:600;color:#2E3245;}
.plog-more{margin-top:10px;font-size:14px !important;font-weight:700;}
@media (max-width:760px){ .plog-row{grid-template-columns:58px 24px minmax(0,1fr);} .plog-score{grid-column:3;justify-self:start;} }
.cma{margin:0 !important;border-radius:0 !important;padding:14px 16px !important;font-family:'Inter',system-ui,sans-serif;border-top:3px solid #DB8437 !important;}
.cma-h{display:flex;flex-wrap:wrap;gap:8px 14px;align-items:center;justify-content:space-between;}
.cma-h h2{margin:0;font:800 20px 'Inter',system-ui,sans-serif;color:#1E2340;}
.cma-h h2 span{background:#B3261E;color:#fff;border-radius:999px;padding:2px 12px;font-size:15px;margin-left:6px;}
.cma-tools{display:flex;gap:10px;align-items:center;}
.cma-res{font-size:14px;font-weight:700;color:#1E2340;display:flex;gap:6px;align-items:center;}
.cma-rules{margin:8px 0 10px;font-size:14px;color:#2E3245;} .cma-rules summary{cursor:pointer;font-weight:800;color:#B5651F;}
.cma-rules ol{margin:6px 0 0;padding-left:20px;display:grid;gap:3px;} .cma-rules b{color:#1E2340;}
.cma-table{width:100%;border-collapse:separate;border-spacing:0;font-size:14px;}
.cma-table th{background:#262B45;color:#fff;text-align:left;padding:9px 10px;font-weight:800;border-bottom:2px solid #DB8437;}
.cma-table td{padding:10px;border-bottom:1px solid #E4E7EF;vertical-align:top;font-weight:600;color:#141A2E;}
.cma-table tr.sev-high td:first-child{box-shadow:inset 5px 0 0 #B3261E;} .cma-table tr.sev-medium td:first-child{box-shadow:inset 5px 0 0 #DB8437;}
.cma-table tr.is-res td{opacity:.62;}
.cma-table td b{color:#1E2340;font-size:15px;}
.cma-who{all:unset;cursor:pointer;font:800 15px 'Inter',system-ui,sans-serif;color:#1E2340;text-decoration:underline;text-decoration-color:#DB8437;text-underline-offset:3px;}
.cma-dim{color:#2E3245;font-size:14px;font-weight:600;margin-top:2px;}
.cma-do{color:#7A3F0E;font-size:14px;font-weight:700;margin-top:4px;}
.cma-sev{display:inline-block;border-radius:999px;padding:2px 10px;font-weight:800;font-size:14px;white-space:nowrap;}
.cma-sev.high{background:#F8E1DE;color:#9B3A30;} .cma-sev.medium{background:#FFE7CF;color:#7A3F0E;}
.cma-rule{font-weight:800;color:#1E2340;margin-top:4px;}
.cma-table td:first-child{min-width:170px;} .cma-table td:nth-child(2){min-width:200px;} .cma-table td:nth-child(3){min-width:320px;}
.cma-when{white-space:nowrap;} .cma-act{white-space:nowrap;text-align:right;}
.cma-act .btn{font-size:14px !important;font-weight:800;}
.cma-ok{background:#DB8437 !important;background-image:none !important;color:#241304 !important;border-color:#DB8437 !important;}
.cma-empty{font-size:15px;font-weight:700;color:#24563A;}
.cma-badge{font:800 14px 'Inter',system-ui,sans-serif !important;background:#B3261E !important;color:#fff !important;border-radius:999px !important;padding:6px 12px !important;border:0;cursor:pointer;}
.cma-badge .nav-badge{background:#fff !important;color:#B3261E !important;margin-left:6px;}
`;
document.head.appendChild(st);
})();
