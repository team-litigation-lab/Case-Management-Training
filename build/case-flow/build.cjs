#!/usr/bin/env node
/* Regenerate everything the Case Flow's lesson data feeds, in the order the steps depend on each other.
   Edit a lesson, a Skill Activity or the practice case in js/cm-case-flow-data.js (or a slide, script or
   simulation spec under build/case-flow/), then run this once:

     node build/case-flow/build.cjs

   and the slides, trainer scripts, simulation and curriculum documents follow. CI runs the same thing and
   fails if it would have changed anything, so a lesson edit can never ship with its generated files behind.

   The order matters: the terms pass rewrites the SOURCES (the capitalization in build/case-flow/terms.json),
   so it goes first and the assemblers then read the corrected text. */
const { execFileSync } = require("child_process"), path = require("path");
const ROOT = path.resolve(__dirname, "../..");

const STEPS = [
  ["Defined terms, written into the sources", "build/case-flow/terms.cjs"],
  ["Slides", "build/case-flow/slides/assemble.cjs"],
  ["Trainer scripts", "build/case-flow/scripts/assemble.cjs"],
  ["Simulation", "build/case-flow/sim/assemble.cjs"],
  ["Curriculum documents", "build/case-flow/curriculum.cjs"]
];

const quiet = process.argv.includes("--quiet");
for (const [what, script] of STEPS) {
  let out;
  try { out = execFileSync(process.execPath, [path.join(ROOT, script)], { cwd: ROOT, encoding: "utf8" }); }
  catch (e) {
    process.stdout.write(e.stdout || ""); process.stderr.write(e.stderr || "");
    console.error(`\n${what} failed (${script}). Nothing further was regenerated: fix the error above and run again.`);
    process.exit(1);
  }
  if(!quiet) process.stdout.write(out);
}
if(!quiet) console.log("\nCase Flow rebuilt: slides, trainer scripts, simulation and curriculum documents are in step with the lesson data.");
