#!/usr/bin/env node
/* The 5-Day Case Management Flow's written blueprint and theory map, generated from
   js/cm-case-flow-data.js so they can never drift from the slides:

       node build/case-flow/blueprint.cjs           writes curriculum/5-day-flow/dayN.md + traceability.md
       node build/case-flow/blueprint.cjs --check   validates only; writes nothing

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

const RHYTHM = ["lesson", "activity", "lesson", "activity", "check"];
const KIND = {lesson: "Lesson", activity: "Skill Activity", check: "Knowledge Check"};
const money = n => "$" + Number(n).toLocaleString("en-US");
const md = s => String(s == null ? "" : s).replace(/\|/g, "\\|");
const stack = () => CF.case.stack.slice().sort((a, b) => a.order - b.order);

/* ---------- validation ---------- */
const errors = [];
const cited = new Map();   // "D1#18" → [block ids]
CF.days.forEach(day => {
  if(day.modules.length !== 4) errors.push(`Day ${day.n}: ${day.modules.length} modules, expected 4`);
  day.modules.forEach(mod => {
    const kinds = mod.blocks.map(b => b.kind);
    if(kinds.join(",") !== RHYTHM.join(",")) errors.push(`${mod.id}: rhythm is ${kinds.join(" → ")}`);
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
      o.push(`| | | | **${money(CF.case.total)}** | | | |`, "", `**Order of operations:** ${stack().map(l => l.tag).join(" → ")}. Demanding out of order forfeits the stack.`);
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
function blockMd(b, day, mod, k){
  const L = [`### ${day.n}.${mod.n}.${k + 1} ${md(b.title)}`, "",
    `> **${KIND[b.kind]}** · Day ${day.n} — ${day.phase} · Module ${mod.n}: ${md(mod.title)}  `,
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
    L.push(`Verified in this module's Knowledge Check (block ${day.n}.${mod.n}.5) and the day's auto-graded questions.`, "");
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
    "> Generated from `js/cm-case-flow-data.js` by `build/case-flow/blueprint.cjs`. Edit the data and regenerate; never edit this file by hand. Spec: `00-architecture.md`. Theory map: `traceability.md`.", "",
    "## Case continuity anchors", "", "| | |", "|---|---|",
    `| **Case** | ${c.style} (${c.no}) — ${c.type} |`, `| **Lead Counsel** | ${c.counsel} |`,
    `| **Date of loss** | ${c.dol} · **SOL** ${c.sol} (${c.solNote}) |`, `| **Client** | ${c.client.name} — ${c.client.position} |`,
    `| **Policy stack** | ${stack().map(l => `${money(l.limit)} ${l.tag}`).join(" / ")} = **${money(c.total)}** |`,
    `| **Health plan** | ${c.health.carrier} · ${c.health.memberId} · ${c.health.group} |`, `| **Critical fact** | ${c.critical} |`, "",
    "## This day's modules", ""];
  day.modules.forEach(m => {
    L.push(`**Module ${m.n} — ${m.title}**  `, m.about, "", ...m.blocks.map((b, i) => `${i + 1}. *${KIND[b.kind]}* — ${b.title}`), "");
  });
  L.push(`**End-of-day discussion (trainer):** ${day.discussion}`, "", "---", "");
  day.modules.forEach(mod => {
    L.push(`## Module ${mod.n} — ${mod.title}`, "", mod.about, "", `**Rhythm:** ${mod.blocks.map(b => KIND[b.kind]).join(" ➔ ")}`, "");
    mod.blocks.forEach((b, k) => L.push(blockMd(b, day, mod, k)));
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
    "Every topic of the existing *Case Management Training (5-Day)* course, and where its theory lives in the 5-Day Legal Case Management Flow. The theory is relocated into the new flow, not removed: a topic is **BUILT** once a block cites it, and **SCHEDULED** while the day it is planned for is still to be written. A topic that is neither would fail `build/case-flow/blueprint.cjs`, so nothing can be dropped silently.", "",
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
    "- **The $40,000 host-passenger stack** (Host UM and Relative UM behind a $10,000 BI) and its order of operations — the case facts this brief specifies.",
    "- **Recovery stack vs. payer order** as two separate questions (Module 1, Lesson 2), built on the Regulatory Triple-Check's payer order.",
    "- **The three-criteria skip-trace gate** (Module 2): the No Contact Protocol has the steps; the trigger rule is new.",
    "- **The five-band case plan** wrapping the Three-Pillar Plan (Module 4), and the review-loop states.", "");
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
console.log(`Case Flow: ${CF.days.length} of 5 days · ${blocks} blocks · rhythm, six components, 60/40 rubrics, quizzes and sources verified · ${Object.keys(LEGACY).length} existing topics, 0 unplaced`);
