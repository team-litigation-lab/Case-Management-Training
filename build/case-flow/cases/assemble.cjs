#!/usr/bin/env node
/* Merges the companion cases (build/case-flow/cases/cases.json, written to CASESPEC.md) into
   js/cm-companion-cases.js (window.CM_COMPANION_CASES) and checks them: ten cases, c01–c10, each with
   every field and all five days, no calendar years, and none of John Doe's names.
     node build/case-flow/cases/assemble.cjs [--check]   (--check: validate only, write nothing) */
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../../.."), SRC = path.join(__dirname, "cases.json"), OUT = path.join(ROOT, "js/cm-companion-cases.js");
const errors = [], err = m => errors.push(m);
const wc = s => String(s).trim().split(/\s+/).filter(Boolean).length;
// names that belong to John Doe's file: a companion case invents its own
const TAKEN = ["John Doe", "Robert Smith", "Keystone", "Harbor Point", "Cardinal State", "Dana Whitfield", "Marcus Bell", "Teresa Okafor", "Riverton Spine", "Peach State", "Bluewater", "Margaret Doe", "Ruth Calloway", "Apex", "Jordan Davies"];
// --part <file>: check one writer's share of the cases only (no ten-case rule, nothing written)
const PART = process.argv.includes("--part") ? process.argv[process.argv.indexOf("--part") + 1] : null;
let cases = {};
try { cases = JSON.parse(fs.readFileSync(PART ? path.resolve(PART) : SRC, "utf8")); } catch (e) { err(`${PART || "cases.json"}: ${e.message}`); }
const ids = Object.keys(cases), want = Array.from({length: 10}, (_, i) => "c" + String(i + 1).padStart(2, "0"));
if (!PART && ids.join() !== want.join()) err(`want cases ${want.join(", ")} in order (have ${ids.join(", ") || "none"})`);
const str = (id, f, v, lo, hi) => { if (typeof v !== "string" || !v.trim()) return err(`${id}.${f}: missing`); const n = wc(v); if (n < lo || n > hi) err(`${id}.${f}: ${n} words (want ${lo}–${hi})`); };
const list = (id, f, v, lo, hi, wlo, whi) => { if (!Array.isArray(v) || v.length < lo || v.length > hi) return err(`${id}.${f}: want ${lo}–${hi} items`); v.forEach((x, i) => str(id, `${f}[${i}]`, x, wlo, whi)); };
for (const id of ids) {
  const c = cases[id];
  str(id, "title", c.title, 3, 10); str(id, "theme", c.theme, 1, 8); str(id, "hook", c.hook, 8, 45); str(id, "type", c.type, 2, 16);
  str(id, "client", c.client, 10, 60); list(id, "facts", c.facts, 3, 6, 5, 40); str(id, "coverage", c.coverage, 8, 60); str(id, "injuries", c.injuries, 8, 60);
  if (!/ v\. /.test(c.title || "")) err(`${id}.title: want "Client v. Defendant"`);
  const days = c.days || {};
  if (Object.keys(days).join() !== "1,2,3,4,5") err(`${id}.days: want 1–5`);
  for (const n of ["1", "2", "3", "4", "5"]) {
    const d = days[n] || {}, k = `${id}.days.${n}`;
    str(k, "title", d.title, 2, 10); str(k, "situation", d.situation, 25, 110); str(k, "task", d.task, 8, 50);
    list(k, "attorneyAsks", d.attorneyAsks, 2, 3, 5, 35); list(k, "strongAnswer", d.strongAnswer, 3, 5, 4, 40);
    str(k, "attorneysCall", d.attorneysCall, 6, 45); str(k, "watchFor", d.watchFor, 6, 40);
    (d.attorneyAsks || []).forEach((q, i) => { if (!/\?\s*$/.test(q)) err(`${k}.attorneyAsks[${i}]: want a question ending in "?"`); });
  }
  const all = JSON.stringify(c);
  const yr = all.match(/\b(19|20)\d\d\b/); if (yr) err(`${id}: a calendar year (${yr[0]}): use relative dates`);
  TAKEN.forEach(t => { if (all.includes(t)) err(`${id}: "${t}" belongs to John Doe's file`); });
  if (!all.includes("Thorne")) err(`${id}: Atty. Thorne never appears`);
}
// the same client or defendant twice would confuse the trainer's assignment list
const titles = ids.map(id => cases[id].title); titles.forEach((t, i) => { if (titles.indexOf(t) !== i) err(`${ids[i]}: the same title as ${ids[titles.indexOf(t)]}`); });
const text = `/* The companion cases: a second, shorter file a trainer assigns each trainee (Admin → Trainee Audit → 📁 Case), with a
   new problem each Case Flow day and the trainer's guide for that day's Attorney–CM brainstorm. Assembled from
   build/case-flow/cases/cases.json by build/case-flow/cases/assemble.cjs, written to build/case-flow/cases/CASESPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_COMPANION_CASES = ${JSON.stringify(cases, null, 1)};
`;
if (errors.length) { console.log(`${errors.length} problem(s):`); errors.slice(0, process.env.ALL ? Infinity : 60).forEach((e, i) => console.log(`${i + 1}. ${e}`)); }
if (PART) { if (!errors.length) console.log(`${PART}: ${ids.length} case(s), no problems`); process.exit(errors.length ? 1 : 0); }
if (process.argv.includes("--check")) {
  if (!fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== text) { errors.push("out of date"); console.log("js/cm-companion-cases.js is out of date: run node build/case-flow/cases/assemble.cjs"); }
  else if (!errors.length) console.log(`Companion cases: ${ids.length} cases × 5 days, js/cm-companion-cases.js in step`);
} else if (!errors.length) { fs.writeFileSync(OUT, text); console.log(`wrote js/cm-companion-cases.js: ${ids.length} cases`); }
process.exit(errors.length ? 1 : 0);
