#!/usr/bin/env node
/* The 5-Day Case Management Flow's curriculum spec and theory map, generated from
   js/cm-case-flow-data.js so they can never drift from the slides:

       node build/case-flow/curriculum.cjs           writes curriculum/5-day-flow/dayN.md + traceability.md
       node build/case-flow/curriculum.cjs --check   validates only; writes nothing

   Validation (exit 1 on any breach): every module runs Lesson → Activity → Lesson →
   Activity → Knowledge Check; every block has all six components; every rubric is
   60 AI / 40 trainer; every quiz question is well formed; every block names its
   sources; every "D<day>#<topic>" source names a real topic in build/day<day>.js; and
   every one of the course's existing topics is either used by a block or planned for
   a day (none silently dropped). */

const fs = require("fs");
const path = require("path");

const ROOT = path.resolve(__dirname, "../..");
const OUT = path.join(ROOT, "curriculum/5-day-flow");
const CHECK_ONLY = process.argv.includes("--check");

global.window = {};
require(path.join(ROOT, "js/cm-case-flow-data.js"));
const CF = global.window.CM_CASE_FLOW;

/* the existing course's topics, D1#1 … D5#35 */
const LEGACY = {};
for(let n = 1; n <= 5; n++){
  const src = fs.readFileSync(path.join(ROOT, `build/day${n}.js`), "utf8") + `\n;module.exports = DAY${n};`;
  const m = {exports: {}}; new Function("module", "exports", src)(m, m.exports);
  m.exports.lessons.forEach((l, i) => { LEGACY[`D${n}#${i + 1}`] = {day: n, i: i + 1, h: l.h, title: m.exports.title}; });
}

const KIND = {lesson: "Lesson", activity: "Skill Activity", check: "Knowledge Check"};
const money = n => "$" + Number(n).toLocaleString("en-US");
const md = s => String(s == null ? "" : s).replace(/\|/g, "\\|");
const stack = () => CF.case.stack.slice().sort((a, b) => a.order - b.order);

/* ---------- validation ---------- */
const errors = [];
const cited = new Map();   // "D1#18" → [block ids]
// The case profile (the Case File page): every section opens with a day (`opens`) or once a day is passed (`passed`)
(CF.profile || []).forEach((sec, i) => {
  const n = sec.opens || sec.passed, at = `profile[${i}] "${sec.title || ""}"`;
  if(!sec.title || !(sec.items || []).length) errors.push(`${at}: needs a title and items`);
  if(!!sec.opens === !!sec.passed || !CF.days.some(d => d.n === n)) errors.push(`${at}: needs exactly one of opens / passed, naming a Case Flow day`);
  if(/blueprint/i.test(JSON.stringify(sec))) errors.push(`${at}: says "blueprint"; the program never uses the word`);
});
if(!(CF.profile || []).some(x => x.opens === 1)) errors.push("profile: nothing opens on Case Flow Day 1");
CF.days.forEach(day => {
  // four modules a day; Day 5 has a fifth, the Track B close-out (the award, the liens and the litigated Net Sheet)
  if(day.modules.length !== (day.n === 5 ? 5 : 4)) errors.push(`Day ${day.n}: ${day.modules.length} modules, expected ${day.n === 5 ? 5 : 4}`);
  ["title", "phase", "objective", "gate", "discussion"].forEach(k => { if(!day[k]) errors.push(`Day ${day.n}: missing ${k}`); });
  if(!(day.fileState || []).length) errors.push(`Day ${day.n}: missing fileState (where the file stands as the day opens)`);
  if(/blueprint/i.test(JSON.stringify(day))) errors.push(`Day ${day.n}: says "blueprint"; the program never uses the word`);
  day.modules.forEach(mod => {
    const kinds = mod.blocks.map(b => b.kind);
    // a module is a unit of scoring: its lessons and activities, then exactly one Knowledge Check, last
    if(!kinds.includes("lesson") || !kinds.includes("activity") || kinds.filter(k => k === "check").length !== 1 || kinds[kinds.length - 1] !== "check")
      errors.push(`${mod.id}: needs lessons and activities, then exactly one Knowledge Check, last (it is ${kinds.join(" → ")})`);
    if(!(mod.quiz || []).length) errors.push(`${mod.id}: no quiz questions`);
    (mod.quiz || []).forEach((q, i) => {
      if(!q.q || !Array.isArray(q.opts) || q.opts.length < 2 || !(q.a >= 0 && q.a < q.opts.length) || !q.r)
        errors.push(`${mod.id} quiz ${i + 1}: needs q, opts, a (a valid index) and r`);
    });
    mod.blocks.forEach(b => {
      const w = b.id;
      if(!b.title || !b.topic) errors.push(`${w}: missing title/topic`);
      if(!b.visual) errors.push(`${w}: missing visual layout description`);
      if(!(b.notes || []).length) errors.push(`${w}: missing speaker notes`);
      if(!(b.best || []).length) errors.push(`${w}: missing best practices`);
      if(!(b.sources || []).length) errors.push(`${w}: names no sources`);
      (b.sources || []).forEach(s => {
        const m = String(s).match(/^D(\d)#(\d+)$/);
        if(m){
          if(!LEGACY[s]) errors.push(`${w}: source ${s} is not a topic in build/day${m[1]}.js`);
          cited.set(s, (cited.get(s) || []).concat(b.id));
        }
      });
      if(!b.rubric || !b.rubric.ai || !b.rubric.trainer){ errors.push(`${w}: missing rubric`); return; }
      const ai = b.rubric.ai.reduce((s, r) => s + r[1], 0), tr = b.rubric.trainer.reduce((s, r) => s + r[1], 0);
      if(ai !== 60) errors.push(`${w}: AI weights total ${ai}, expected 60`);
      if(tr !== 40) errors.push(`${w}: trainer weights total ${tr}, expected 40`);
      if(b.kind === "lesson" && !(b.tell && b.tell.why && (b.tell.rules || []).length && b.show)) errors.push(`${w}: lesson needs tell.why, tell.rules and a show model`);
      if(b.kind === "activity" && !(b.act && b.act.prompt && (b.act.checkpoints || []).length)) errors.push(`${w}: activity needs act.prompt and act.checkpoints`);
      if(b.kind === "check" && !(b.check && (b.check.questions || []).length && (b.check.summary || []).length && (b.check.scale || []).length)) errors.push(`${w}: check needs questions, summary and scale`);
      if(/<[a-z][^>]*>/i.test(JSON.stringify(b))) errors.push(`${w}: contains HTML; this course's renderers escape text, so it would show as code`);
    });
  });
});
/* The sequence: each day's Case Phases, each taught as its lessons → its activities → its Learning Check.
   Every block exactly once, and each module's Knowledge Check no earlier than the blocks it checks. */
const STORED = {};
CF.days.forEach(day => day.modules.forEach(mod => mod.blocks.forEach(b => { STORED[b.id] = {day, mod, b}; })));
const TAUGHT = {};   // block id → [day n, phase index, position]
if(!Array.isArray(CF.sequence)) errors.push("sequence: missing (the order the course teaches the blocks)");
else {
  if(CF.sequence.map(d => d.n).join(",") !== CF.days.map(d => d.n).join(",")) errors.push("sequence: needs one entry per Case Flow day, in order");
  CF.sequence.forEach(sd => (sd.phases || []).forEach((ph, pi) => {
    const at = `sequence Day ${sd.n} phase ${pi + 1} "${ph.title || ""}"`;
    if(!ph.title || !(ph.blocks || []).length) errors.push(`${at}: needs a title and blocks`);
    const rank = {lesson: 0, activity: 1, check: 2};
    let last = -1;
    (ph.blocks || []).forEach((id, k) => {
      const x = STORED[id];
      if(!x) return errors.push(`${at}: ${id} is not a block`);
      if(TAUGHT[id]) errors.push(`${at}: ${id} is already taught on Day ${TAUGHT[id][0]}`);
      TAUGHT[id] = [sd.n, pi, k];
      if(rank[x.b.kind] < last) errors.push(`${at}: ${id} (${x.b.kind}) comes after a later part; a phase runs lessons → activities → Learning Check`);
      last = Math.max(last, rank[x.b.kind]);
    });
    if(!(ph.blocks || []).some(id => STORED[id] && STORED[id].b.kind === "check")) errors.push(`${at}: ends without a Learning Check`);
  }));
  Object.keys(STORED).forEach(id => { if(!TAUGHT[id]) errors.push(`sequence: ${id} is never taught`); });
  const before = (a, b) => a[0] - b[0] || a[1] - b[1] || a[2] - b[2];
  CF.days.forEach(day => day.modules.forEach(mod => {
    const kc = mod.blocks.find(b => b.kind === "check"), t = kc && TAUGHT[kc.id];
    if(t) mod.blocks.forEach(b => { if(b !== kc && TAUGHT[b.id] && before(TAUGHT[b.id], t) > 0) errors.push(`sequence: ${kc.id} is taught before ${b.id}, which it checks`); });
  }));
}
const planFor = key => {
  const {day, i} = LEGACY[key];
  return (CF.plan || []).filter(p => p.from === `D${day}` && i >= p.topics[0] && i <= p.topics[1]);
};
const unplaced = Object.keys(LEGACY).filter(k => !cited.has(k) && !planFor(k).length);
unplaced.forEach(k => errors.push(`${k} "${LEGACY[k].h}" is neither used by a block nor planned for a day`));
/* A topic planned only for days that are already written, yet cited by no block, is theory
   that was dropped on the way in: the plan said it belongs there and the day doesn't carry it. */
const written = new Set(CF.days.map(d => d.n));
const daysIn = to => [...String(to).matchAll(/Day (\d)/g)].map(m => Number(m[1]));
Object.keys(LEGACY).forEach(k => {
  if(cited.has(k)) return;
  const targets = planFor(k).flatMap(p => daysIn(p.to));
  if(targets.length && targets.every(n => written.has(n)))
    errors.push(`${k} "${LEGACY[k].h}" is planned for Case Flow Day ${[...new Set(targets)].join(" and ")}, which is written, but no block uses it`);
});

if(errors.length){
  console.error("Case Flow curriculum check failed:\n" + errors.map(e => "  • " + e).join("\n"));
  process.exit(1);
}

/* ---------- Show Them, as markdown ---------- */
function showMd(s){
  if(!s) return "";
  const o = [];
  if(s.caption) o.push(`*${md(s.caption)}*\n`);
  switch(s.type){
    case "process": o.push(s.steps.map(([l, d], i) => `${i + 1}. **${md(l)}** — ${md(d)}`).join("\n")); break;
    case "threebox": o.push(s.items.map(([l, d], i) => `${i + 1}. **${md(l)}** — ${md(d)}`).join("\n")); break;
    case "table":
      o.push(`| ${s.head.map(md).join(" | ")} |`, `|${s.head.map(() => "---").join("|")}|`, ...s.rows.map(r => `| ${r.map(md).join(" | ")} |`));
      break;
    case "compare": {
      o.push(`| ${s.boxes.map(b => md(b.head)).join(" | ")} |`, `|${s.boxes.map(() => "---").join("|")}|`);
      const n = Math.max(...s.boxes.map(b => b.items.length));
      for(let i = 0; i < n; i++) o.push(`| ${s.boxes.map(b => md(b.items[i] || "")).join(" | ")} |`);
      break;
    }
    case "split": {
      o.push("| ✅ Do | ❌ Don't |", "|---|---|");
      const n = Math.max(s.do.length, s.dont.length);
      for(let i = 0; i < n; i++) o.push(`| ${md(s.do[i] || "")} | ${md(s.dont[i] || "")} |`);
      break;
    }
    case "stack":
      o.push("| # | Layer | Party | Limit | Carrier | Claim | Adjuster |", "|---|---|---|---|---|---|---|");
      stack().forEach(l => o.push(`| ${l.order} | **${l.tag}** — ${md(l.name)} | ${l.party} | ${money(l.limit)} | ${md(l.carrier)} | ${l.claim} | ${md(l.adjuster)} |`));
      o.push(`| | | | **${money(CF.case.total)}** | | | |`, "", `**Order of operations:** ${stack().map(l => l.tag).join(" → ")}. UM pays only after BI is exhausted, and releasing BI without the UM carriers\' consent can forfeit the stack.`);
      break;
  }
  return o.join("\n");
}
const opsMd = ops => !(ops || []).length ? "" : ["| Trigger Event | ➔ Case Manager Task | ➔ Tool/Interface | ➔ Verification Checkpoint |", "|---|---|---|---|", ...ops.map(r => `| ${r.map(md).join(" | ")} |`)].join("\n");
const rubricMd = r => ["| Channel | Weight | Dimension | What is graded |", "|---|---|---|---|",
  ...r.ai.map(([d, p, c]) => `| 🤖 AI | **${p}%** | ${md(d)} | ${md(c)} |`),
  ...r.trainer.map(([d, p, c]) => `| 🧑‍🏫 Trainer | **${p}%** | ${md(d)} | ${md(c)} |`),
  "", "**Composite** = AI × 0.60 + Trainer × 0.40. **UPL is a gate, not a weighting:** giving the client legal advice fails the block's UPL criterion whatever the composite."].join("\n");
const srcMd = s => s.map(x => LEGACY[x] ? `\`${x}\` ${md(LEGACY[x].h)}` : md(x)).join(" · ");

/* ---------- a block ---------- */
function blockMd(b, day, phase, k, mod){
  const kc = mod.blocks.find(x => x.kind === "check");
  const L = [`### ${day.n}.${phase.n}.${k + 1} ${md(b.title)}`, "",
    `> **${KIND[b.kind]}** · Day ${day.n} — ${day.phase} · Case Phase ${phase.n}: ${md(phase.title)} · scored with ${md(kc.title)} (\`${mod.id}\`)  `,
    `> **Topic:** ${md(b.topic)}  `,
    `> **Continuity:** ${CF.case.style} · ${CF.case.counsel} · ${stack().map(l => money(l.limit) + " " + l.tag).join(" / ")} · ${CF.case.gapDays}-Day Gap  `,
    `> **Theory extracted from:** ${srcMd(b.sources)}`, "",
    "#### 1 · Visual Layout Description", "", b.visual, ""];
  if(b.kind === "lesson"){
    L.push("#### 2 · Slide Body — Tell Them", "", `*Why:* ${b.tell.why}`, "", ...b.tell.rules.map((r, i) => `${i + 1}. ${r}`), "");
    (b.tell.upl || []).forEach(u => L.push(`> ⚠️ **UPL boundary.** ${u}`, ""));
    L.push("#### 2 · Slide Body — Show Them", "", showMd(b.show), "");
  }
  if(b.kind === "activity"){
    L.push("#### 2 · Slide Body — Let Them", "", `**Scenario.** ${b.act.scenario}`, "", `**Execution prompt.** ${b.act.prompt}`, "",
      "| | |", "|---|---|", `| **Tool / interface** | ${md(b.act.tool)} |`, `| **Expected output** | ${md(b.act.output)} |`, "");
    if(b.show) L.push("**Show Them — reference model**", "", showMd(b.show), "");
    L.push("**Verification checkpoints**", "", ...b.act.checkpoints.map(c => `- [ ] ${c}`), "");
  }
  if(b.kind === "check"){
    L.push("#### 2 · Slide Body — Knowledge verification", "", ...b.check.questions.map((q, i) => `${i + 1}. ${q}`), "");
  }
  if((b.ops || []).length) L.push("**Operational mapping**", "", opsMd(b.ops), "");
  L.push("**Best practices & pitfalls**", "", ...b.best.map(x => `- ${/^pitfall:/i.test(x) ? "⚠️ " + x : x}`), "");
  L.push("#### 3 · Knowledge Check & CM Summary", "");
  if(b.kind === "check"){
    L.push("**Case Manager Self-Summary**", "", ...b.check.summary.map(s => `- ${s}`), "",
      "**Skill Scale — self-rate 1–5**", "", `| Competency | ${CF.scale.map(([n]) => n).join(" | ")} |`, `|---|${CF.scale.map(() => "---").join("|")}|`,
      ...b.check.scale.map(c => `| ${md(c)} | ${CF.scale.map(() => "○").join(" | ")} |`), "", CF.scale.map(([n, t]) => `**${n}** ${t}`).join(" · "), "",
      `**Auto-graded share of the day's Knowledge Check** (${mod.quiz.length} questions):`, "",
      ...mod.quiz.map((q, i) => `${i + 1}. ${q.q}  \n   ${q.opts.map((o, j) => j === q.a ? `**✓ ${o}**` : o).join(" · ")}  \n   *${q.r}*`), "");
  }else{
    L.push(`Verified in ${md(kc.title)} (taught on Case Flow Day ${TAUGHT[kc.id][0]}) and that day's auto-graded questions.`, "");
  }
  L.push("#### 4 · Assessment Criteria (AI + Trainer Rubric)", "", rubricMd(b.rubric), "",
    "#### 5 · Speaker Notes", "", ...b.notes.map(n => `- ${n}`), "", "---", "");
  return L.join("\n");
}

/* ---------- a day ---------- */
function dayMd(day){
  const c = CF.case, L = [
    `# Case Flow Day ${day.n} — ${day.title.replace(/^Case Flow Day \d+ · /, "")}`, "",
    `**Phase:** ${day.phase} · **Focus case:** ${c.style} · **Lead Counsel:** ${c.counsel}`, "",
    `**Objective.** ${day.objective}`, "", `**Gate to the next day.** ${day.gate}`, "",
    "**The file as this day opens.**", "", ...(day.fileState || []).map(x => `- ${x}`), "",
    "> Generated from `js/cm-case-flow-data.js` by `build/case-flow/curriculum.cjs`. Edit the data and regenerate; never edit this file by hand. Spec: `00-architecture.md`. Theory map: `traceability.md`.", "",
    "## Case continuity anchors", "", "| | |", "|---|---|",
    `| **Case** | ${c.style} (${c.no}) — ${c.type} |`, `| **Lead Counsel** | ${c.counsel} |`,
    `| **Date of loss** | ${c.dol} · **SOL** ${c.sol} (${c.solNote}) |`, `| **Client** | ${c.client.name} — ${c.client.position} |`,
    `| **Policy stack** | ${stack().map(l => `${money(l.limit)} ${l.tag}`).join(" / ")} = **${money(c.total)}** |`,
    `| **Health plan** | ${c.health.carrier} · ${c.health.memberId} · ${c.health.group} |`, `| **Critical fact** | ${c.critical} |`, "",
    "## This day's Case Phases", "",
    "Each Case Phase is taught as one uninterrupted discussion of its lessons, then its Skill Activities and real-time practice on John Doe's file in the CMS, then its Learning Check.", ""];
  const phases = CF.sequence.find(x => x.n === day.n).phases.map((ph, i) => ({n: i + 1, title: ph.title, blocks: ph.blocks.map(id => STORED[id])}));
  phases.forEach(ph => {
    L.push(`**Case Phase ${ph.n} — ${ph.title}**`, "", ...ph.blocks.map((x, i) => `${i + 1}. *${KIND[x.b.kind]}* — ${x.b.title}`), "");
  });
  L.push(`**End-of-day discussion (trainer):** ${day.discussion}`, "", "---", "");
  phases.forEach(ph => {
    L.push(`## Case Phase ${ph.n} — ${ph.title}`, "", `**Order:** ${ph.blocks.map(x => KIND[x.b.kind]).join(" ➔ ")}`, "");
    ph.blocks.forEach((x, k) => L.push(blockMd(x.b, day, ph, k, x.mod)));
  });
  return L.join("\n");
}

/* ---------- the theory traceability map ---------- */
function traceMd(){
  const built = new Set(CF.days.map(d => d.n));
  const rows = Object.entries(LEGACY).map(([k, t]) => {
    const used = cited.get(k);
    const plan = planFor(k);
    const status = used ? "✅ BUILT" : "🗓 SCHEDULED";
    const where = used ? used.join(", ") : plan.map(p => p.to).join("; ");
    return {k, t, status, where};
  });
  const n = s => rows.filter(r => r.status === s).length;
  const lsh = [...new Set(CF.days.flatMap(d => d.modules.flatMap(m => m.blocks.flatMap(b => b.sources.filter(s => !/^D\d#\d+$/.test(s))))))];
  const L = ["# Theory Traceability Map", "",
    "Every topic of the existing *Case Management Training (5-Day)* course, and where its theory lives in the 5-Day Legal Case Management Flow. The theory is relocated into the new flow, not removed: a topic is **BUILT** once a block cites it, and **SCHEDULED** while the day it is planned for is still to be written. A topic that is neither would fail `build/case-flow/curriculum.cjs`, so nothing can be dropped silently.", "",
    "> Generated from `js/cm-case-flow-data.js` (block `sources` and the `plan`) against `build/day1.js`–`day5.js`. Do not edit by hand.", "",
    `**${rows.length} topics** · ✅ ${n("✅ BUILT")} built · 🗓 ${n("🗓 SCHEDULED")} scheduled · ❌ 0 unplaced · Case Flow days written: ${[...built].sort().join(", ")} of 5`, ""];
  for(let d = 1; d <= 5; d++){
    const rs = rows.filter(r => r.t.day === d);
    L.push(`## Existing Day ${d} — ${rs[0].t.title}`, "", "| # | Topic | Status | Where it lives now |", "|---|---|---|---|",
      ...rs.map(r => `| \`${r.k}\` | ${md(r.t.h)} | ${r.status} | ${md(r.where)} |`), "");
  }
  L.push("## Firm doctrine from outside this course", "",
    "Theory the course does not carry, taken from the LSH firm curriculum and cited on the blocks that use it:", "",
    ...lsh.map(s => `- ${s}`), "",
    "## Newly authored", "",
    "Where neither source had the theory, it was written for this flow and is marked here so it can be reviewed:", "",
    ...(CF.authored || []).map(([what, where]) => `- **${md(what)}** — ${md(where)}`), "");
  return L.join("\n");
}

/* ---------- write ---------- */
const blocks = CF.days.reduce((s, d) => s + d.modules.reduce((t, m) => t + m.blocks.length, 0), 0);
if(!CHECK_ONLY){
  fs.mkdirSync(OUT, {recursive: true});
  CF.days.forEach(day => {
    const f = path.join(OUT, `day${day.n}.md`);
    fs.writeFileSync(f, dayMd(day));
    console.log(`wrote ${path.relative(ROOT, f)}`);
  });
  fs.writeFileSync(path.join(OUT, "traceability.md"), traceMd());
  console.log("wrote curriculum/5-day-flow/traceability.md");
}
console.log(`Case Flow: ${CF.days.length} of 5 days · ${blocks} blocks · sequence, six components, 60/40 rubrics, quizzes and sources verified · ${Object.keys(LEGACY).length} existing topics, 0 unplaced`);
