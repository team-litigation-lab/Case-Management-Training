#!/usr/bin/env node
/* The course's defined terms (build/case-flow/terms.json), capitalized exactly as specified everywhere a trainee or a
   trainer reads them: "Mediation Binder", never "mediation binder" or "Mediation binder".
     node build/case-flow/terms.cjs          writes them into the sources (the Case Flow data, the documents manifest,
                                             the slide, script and simulation JSON, the case file); then reassemble
     node build/case-flow/terms.cjs --check  checks the course as it loads (exit 1 on any other spelling) */
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../..");
const TERMS = JSON.parse(fs.readFileSync(path.join(__dirname, "terms.json"), "utf8")).terms;
// longest first, so "Final Itemized Ledger" is matched before "Financial Ledger" could be, and "Master Financial Ledger" before "Financial Ledger"
const ORDER = TERMS.slice().sort((a, b) => b.length - a.length);
const esc = s => s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
// a whole term (or its plural), not part of a longer word or a hyphenated compound ("treatment-gap record" stays)
const rx = t => new RegExp(`(?<![\\w-])(${esc(t).replace(/ /g, "\\s+")})(s?)(?![\\w-])`, "gi");
const caps = w => /[A-Z]/.test(w) && w === w.toUpperCase();   // a label written in capitals ("PAYER ORDER") stays as it is
const fix = s => ORDER.reduce((x, t) => x.replace(rx(t), (m, w, pl) => caps(w) ? m : t + pl), s);

if(!process.argv.includes("--check")){
  const files = ["js/cm-case-flow-data.js", "js/cm-case-flow-docs.js", "curriculum/5-day-flow/case-file.md"]
    .concat(["slides", "scripts", "sim", "exhibits"].flatMap(d => fs.readdirSync(path.join(__dirname, d)).filter(f => f.endsWith(".json")).map(f => `build/case-flow/${d}/${f}`)));
  let total = 0;
  for (const f of files) {
    const p = path.join(ROOT, f), before = fs.readFileSync(p, "utf8"), after = fix(before);
    if(after !== before){ const n = ORDER.reduce((k, t) => k + [...before.matchAll(rx(t))].filter(m => m[1] !== t && !caps(m[1])).length, 0);
      fs.writeFileSync(p, after); total += n; console.log(`${f}: ${n} fixed`); }
  }
  console.log(`${total} term(s) recapitalized. Now reassemble: slides, scripts, sim and curriculum.`);
  process.exit(0);
}
// --check: every string the course loads
global.window = {};
["js/cm-case-flow-data.js", "js/cm-case-flow-slides.js", "js/cm-case-flow-scripts.js", "js/cm-case-flow-sim.js", "js/cm-case-flow-docs.js", "js/cm-case-flow-exhibits.js"].forEach(f => require(path.join(ROOT, f)));
const bad = [];
const walk = (o, at) => { if(typeof o === "string"){ for (const t of ORDER) for (const m of o.matchAll(rx(t))) if(m[1] !== t && !caps(m[1])) bad.push(`${at}: "${m[1]}${m[2]}" → "${t}${m[2]}"`); }
  else if(o && typeof o === "object") for (const [k, v] of Object.entries(o)) walk(v, at ? `${at}.${k}` : k); };
walk(window.CM_CASE_FLOW, "CM_CASE_FLOW"); walk(window.CM_CF_SLIDES, "CM_CF_SLIDES"); walk(window.CM_CF_SCRIPTS, "CM_CF_SCRIPTS");
walk(window.CM_CF_SIM, "CM_CF_SIM"); walk(window.CM_CF_DOCS, "CM_CF_DOCS"); walk(window.CM_CF_EXHIBITS, "CM_CF_EXHIBITS");
if(bad.length){ console.log(`${bad.length} defined term(s) not capitalized as specified (build/case-flow/terms.json):`); bad.slice(0, 40).forEach((b, i) => console.log(`${i + 1}. ${b}`)); console.log("Fix: node build/case-flow/terms.cjs, then reassemble."); process.exit(1); }
console.log(`Defined terms: all ${TERMS.length} capitalized as specified across the Case Flow, its slides, scripts, simulation, exhibit audits and documents`);
