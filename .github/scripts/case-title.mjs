// @check node — The case title reads "John Doe VS Robert Smith" everywhere a trainee sees it (no "John Doe v. Robert Smith" or "Doe v. Smith" in the pages, the scripts or the Case Flow sources)
// The owner's rule: the case's name is written exactly "John Doe VS Robert Smith". Checked in what the course draws
// from: index.html, case-doc.html, net-sheet.html, every js/ file and the Case Flow sources the build turns into the
// slides, the trainer scripts and the simulation (build/case-flow/slides, scripts, sim), the case documents as a trainee
// reads them (documents/case-flow/html, shown by case-doc.html), the training handouts (build/case-flow/documents/handouts)
// and the footer the renderer stamps on every case-document PDF (build/case-flow/documents/render.cjs). The generated
// files follow their sources (node build/case-flow/build.cjs), and the case data's own style must be the title.
// Left alone on purpose: the old practice files' names ("John Doe v. Apex …", "Doe v. Keystone"), the other matter
// "John Doe v. Harbor Point & Cardinal State", and the pleadings' court captions, which are set out on their own lines
// ("JOHN DOE, / Plaintiff, / v. / ROBERT SMITH,") as filed and are not what this looks for.
//     node .github/scripts/case-title.mjs
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const TITLE = "John Doe VS Robert Smith";
const OLD = /\b(?:John )?Doe\s+v\.?\s+(?:Robert\s+)?Smith\b|\bJOHN DOE v\.? ROBERT SMITH\b/g;
const files = ["index.html", "case-doc.html", "net-sheet.html"]
  .concat(fs.readdirSync(path.join(ROOT, "js")).filter(f => f.endsWith(".js")).map(f => "js/" + f))
  .concat(["slides", "scripts", "sim"].flatMap(d => { const dir = path.join(ROOT, "build/case-flow", d);
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => f.endsWith(".json")).map(f => `build/case-flow/${d}/${f}`) : []; }))
  .concat([["documents/case-flow/html", /\.(html|css)$/], ["build/case-flow/documents/handouts", /\.html$/]].flatMap(([d, re]) => { const dir = path.join(ROOT, d);
    return fs.existsSync(dir) ? fs.readdirSync(dir).filter(f => re.test(f)).map(f => `${d}/${f}`) : []; }))
  .concat(["build/case-flow/documents/render.cjs"]);
const errors = [];
for (const f of files) {
  const p = path.join(ROOT, f); if (!fs.existsSync(p)) continue;
  fs.readFileSync(p, "utf8").split("\n").forEach((line, i) => {
    for (const m of line.matchAll(OLD)) errors.push(`${f}:${i + 1}: "${m[0]}" should read "${TITLE}"`);
  });
}
// the case data's own style, which every page that names the case reads
const data = fs.readFileSync(path.join(ROOT, "js/cm-case-flow-data.js"), "utf8");
const style = /\bstyle:\s*"([^"]*)"/.exec(data);
if (!style || style[1] !== TITLE) errors.push(`js/cm-case-flow-data.js: case.style is "${style ? style[1] : "missing"}"; it should be "${TITLE}"`);
if (errors.length) {
  console.error(`${errors.length} place(s) with the old case title:`);
  errors.slice(0, 80).forEach(e => console.error("  " + e));
  process.exit(1);
}
console.log(`The case title reads "${TITLE}" in ${files.length} files.`);
