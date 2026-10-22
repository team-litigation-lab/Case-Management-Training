#!/usr/bin/env node
/* Audits the rendered case documents against the case file: every PDF exists, carries the training footer,
   names no other case, uses the canonical identifiers, holds its document's required facts, and plants exactly
   the discrepancies SPEC.md lists (and only in the documents that list them).
     node build/case-flow/documents/audit.cjs       (needs pdftotext) */
const fs = require("fs"), path = require("path"), {execFileSync} = require("child_process");
const ROOT = path.resolve(__dirname, "../../..");
global.window = {};
require(path.join(ROOT, "js/cm-case-flow-docs.js"));
const DOCS = window.CM_CF_DOCS;
const fails = [], warn = [];
const text = {};
for (const d of DOCS) {
  const f = path.join(ROOT, "documents", d.file);
  const pdf = /\.docx$/.test(f) ? path.join(__dirname, ".tmp", d.id + ".pdf") : f;
  if (!fs.existsSync(f)) { fails.push(`${d.id}: ${d.file} missing`); continue; }
  if (!fs.existsSync(pdf)) { fails.push(`${d.id}: no PDF to read (${path.relative(ROOT, pdf)})`); continue; }
  text[d.id] = execFileSync("pdftotext", ["-layout", pdf, "-"]).toString().replace(/ /g, " ");
}
const has = (id, re) => re.test((text[id] || "").replace(/\s+/g, " "));
const T = id => (text[id] || "").replace(/\s+/g, " ");

// 1. every page carries the footer; no other case, no "blueprint"
const BANNED = [/\bApex\b/i, /Aggressive Casualty/i, /\bL4-L5\b/, /Metro General/i, /Jordan Davies/i, /\bblueprint\b/i, /\bElias\b/i, /Local Farm Mutual/i];
for (const [id, t] of Object.entries(text)) {
  const pages = t.split("\f").filter(p => p.trim());
  pages.forEach((p, i) => { if (!/SIMULATED DOCUMENT/.test(p) && !/\.docx$/.test(DOCS.find(d => d.id === id).file)) fails.push(`${id}: page ${i + 1} has no training footer`); });
  BANNED.forEach(re => { if (re.test(t)) fails.push(`${id}: mentions ${re}`); });
}

// 2. canonical identifiers wherever they appear (pattern → the only allowed value, and where a plant may differ)
const IDS = [
  [/RPD-\d\d-\d{6}/g, "RPD-26-018842", {RS01: "RPD-26-018824"}],
  [/KM-\d\d-\d{6}(?:-PD)?/g, ["KM-26-440871", "KM-26-440871-PD"]],
  [/HP-\d\d-\d{4}\b/g, "HP-26-7741"],
  [/CS-\d\d-\d{5}\b/g, "CS-26-20355"],
  [/KMI-PA-\d+/g, "KMI-PA-7731045"], [/HPA-\d+/g, "HPA-4402917"], [/CSM-AU-\d+/g, "CSM-AU-5580213"], [/BWA-\d+-\d+/g, "BWA-209-66184"],
  [/PSH-\d+/g, "PSH-55017742"], [/GRP-\d+/g, "GRP-41208"], [/\d\d-CV-\d+/g, "26-CV-04417"], [/RF-26-\d{4}-\d+/g, "RF-26-0206-114"],
  [/LSH-2026-MVA-\d+/g, "LSH-2026-MVA-770412"],
];
for (const [id] of Object.entries(text)) for (const [re, ok, plant] of IDS) {
  for (const m of T(id).match(re) || []) {
    const allowed = [].concat(ok, plant && plant[id] ? plant[id] : []);
    if (!allowed.includes(m)) fails.push(`${id}: identifier ${m} (expected ${[].concat(ok).join(" / ")})`);
  }
}
// DOB: 08/14/1991 everywhere; RS03 plants 08/14/1990
for (const [id] of Object.entries(text)) for (const m of T(id).match(/08\/14\/19\d\d/g) || []) if (m !== "08/14/1991" && !(id === "RS03" && m === "08/14/1990")) fails.push(`${id}: DOB ${m}`);
// the date of loss is 02/06/2026; RS16 plants 02/16/2026 as the "date of injury"
for (const [id] of Object.entries(text)) if (/date of (loss|injury|accident|collision)\W{0,3}(February 16|02\/16\/2026)/i.test(T(id)) && id !== "RS16") fails.push(`${id}: a date of loss of 02/16/2026`);

// 3. required facts and plants, document by document
const NEED = {
  RS01: [/RPD-26-018824/, /08\/14\/1991/, /passenger/i, /02\/09\/2026/],
  RS02: [/neck and back/i, /2021/, /Birch Avenue Chiropractic/i],
  RS03: [/Driver/, /08\/14\/1990/],
  RS04: [/02\/06\/2028/, /02\/04\/2028/, /11\/05\/2027/, /work product/i],
  RS05: [/33/, /40%/, /02\/09\/2026|February 9, 2026/],
  RS06: [/02\/06\/2027|February 6, 2027/, /02\/06\/2026|February 6, 2026/],
  RS07: [/RPD-26-018842/, /2021 Ford Escape|2021 FORD ESCAPE|2021 Ford\s+Escape/i, /Calloway/i, /Garner/, /118 Larkspur/],
  RS08: [/Calloway/],
  RS09: [/02\/19\/2026|February 19, 2026/, /SHA-256/i, /grayscale/i],
  RS10: [/11 mph|11 MPH/i, /buckled/i],
  RS11: [/neck stiffness/i, /declined transport/i, /Medic 7/i],
  RS12: [/onset at MVA 02\/06\/2026, progressively worsening; numbness to right hand since 02\/18/],
  RS13: [/02\/23\/2026|February 23, 2026/, /low.back/i],
  RS14: [/04\/08\/2026/, /04\/21\/2026/, /06\/05\/2026/],
  RS15: [/03\/05\/2026/, /03\/27\/2026/, /Reyes/],
  RS16: [/no significant degenerative change at the adjacent levels/i, /02\/16\/2026/, /C5-C6/],
  RS17: [/05\/15\/2026/, /Haddad/],
  RS18: [/06\/12\/2026/, /\$3,400/],
  RS19: [/06\/19\/2026|June 19, 2026/, /more likely than not/i],
  RS20: [/2021/, /low.back/i],
  RS21: [/\$312\.40/, /\$38\.60/],
  RS22: [/\$685\.00/],
  RS23: [/\$6,290\.00/],
  RS24: [/\$1,920\.00/],
  RS25: [/\$2,395\.00/],
  RS26: [/\$3,400\.00/, /\$1,860\.00/, /\$1,540\.00/],
  RS27: [/\$10,000/, /\$25,000/, /03\/20\/2026|March 20, 2026/],
  RS28: [/\$20,000/, /\$5,000/, /03\/02\/2026|March 2, 2026/, /arbitrat/i],
  RS29: [/\$10,000/, /03\/09\/2026|March 9, 2026/, /Okafor/],
  RS30: [/03\/14\/2024|March 14, 2024/, /reject/i],
  RS31: [/\$5,000\.00/, /06\/26\/2026/],
  RS32: [/03\/19\/2026|March 19, 2026/, /\$42\.00/],
  RS33: [/\$16,410\.40/, /08\/19\/2026|August 19, 2026/, /full and final release of all claims/i],
  RS34: [/07\/22\/2026|July 22, 2026/],
  RS35: [/\$3,500/, /degenerative/i],
  RS36: [/08\/10\/2026|August 10, 2026/, /08\/12\/2026|August 12, 2026/],
  RS37: [/all other persons, firms, corporations and insurers/i],
  RS38: [/08\/24\/2026|August 24, 2026/, /08\/26\/2026|August 26, 2026/],
  RS39: [/\$8,000/, /\$6,000/, /\$20,000/],
  RS40: [/fully insured/i, /02\/27\/2026|February 27, 2026/],
  RS41: [/\$1,860\.00/, /\$1,240\.00/],
  RS42: [/\$4,580\.00/, /\$6,105\.00/],
  RS43: [/\$1,584\.00/, /\$22\.00/],
  RS44: [/\$486\.75/],
  RS45: [/\$6,940\.00/, /\$2,315\.00/, /\$9,255\.00/, /\$455\.00/],
  RS46: [/\$17,600\.00/, /52\.6/, /\$1,260\.00/],
  RS47: [/\$3,600\.00/],
  RS48: [/\$792\.00/, /all claims arising from the 02\/06\/2026 accident/i],
  RS49: [/08\/12\/2026|August 12, 2026/, /Holloway/],
  RS50: [/DRAFT/i],
  RS51: [/26-CV-04417/, /09\/24\/2026|September 24, 2026|24th day of September, 2026/],
  RS52: [/4410 Quarry Ridge/, /10\/14\/2026|October 14, 2026/],
  RS53: [/Mercer/, /seat ?belt/i, /comparative/i],
  RS54: [/December 31, 2026|12\/31\/2026/, /12\/01\/2026|December 1, 2026/],
  RS55: [/03\/15\/2027|March 15, 2027/, /09\/13\/2027|September 13, 2027/, /05\/28\/2027|May 28, 2027/],
  RS56: [/02\/18\/2027|February 18, 2027/, /10:00/],
  RS57: [/03\/18\/2027|March 18, 2027/, /03\/11\/2027|March 11, 2027/, /Benton/],
  RS58: [/06\/22\/2027|June 22, 2027/, /June 12, 2027|06\/12\/2027/, /Whitcomb/],
  RS59: [/\$10,000/, /UM/],
  RS60: [/01\/04\/2027|January 4, 2027|4th day of January, 2027/],
};
for (const [id, list] of Object.entries(NEED)) if (text[id] !== undefined) list.forEach(re => { if (!has(id, re)) fails.push(`${id}: missing ${re}`); });
// plants that must appear ONLY where planted
const ONLY = [[/\$16,410\.40/, ["RS33"]], [/all other persons, firms, corporations and insurers/i, ["RS37"]], [/neck and back/i, ["RS02"]], [/2021 Ford Escape/i, ["RS07"]]];
for (const [re, where] of ONLY) for (const id of Object.keys(text)) if (has(id, re) && !where.includes(id)) fails.push(`${id}: carries ${re}, which is planted only in ${where}`);

// 4. RS23: 34 lines of $185.00 and 05/04/2026 twice; RS14: 33 attended visits
if (text.RS23 !== undefined) {
  const lines = (text.RS23.match(/\$?185\.00/g) || []).length, may4 = (text.RS23.match(/^\s*\d+\s+05\/04\/2026/gm) || []).length;   // ledger lines whose date of service is 05/04/2026
  if (lines < 34) fails.push(`RS23: ${lines} $185.00 lines (expected 34)`);
  if (may4 !== 2) fails.push(`RS23: ${may4} ledger lines for DOS 05/04/2026 (expected 2: the planted duplicate)`);
}

// John Doe is the front-seat PASSENGER of Kevin Alvarez's Escape (Unit 2): no document may make him a driver or an
// operator of a vehicle in the crash, put him behind the wheel, or call the Escape his. He owns no vehicle: the parked,
// unoccupied Civic is his mother Margaret Doe's, and its property-damage claim and rental are hers, never his.
const NOT_DRIVER = [
  /John (?:A\. )?Doe,? (?:was )?(?:the )?(?:driver|operator)\b/i, /\bdriver:? John (?:A\. )?Doe\b/i, /\boperator:? John (?:A\. )?Doe\b/i,
  /John (?:A\. )?Doe (?:was )?driving\b/i, /\bDoe'?s? (?:Ford )?Escape\b/i, /John (?:A\. )?Doe,? (?:the )?(?:rear|back)[- ]seat/i
];
for (const [id, t] of Object.entries(text)) {
  const flat = t.replace(/\s+/g, " ");
  NOT_DRIVER.forEach(re => { const m = flat.match(re); if (m) fails.push(`${id}: “${m[0]}”: John Doe was the Escape's front-seat passenger, never a driver`); });
}
if (text.RS07 !== undefined && !has("RS07", /front[- ]seat passenger|front passenger/i)) fails.push("RS07: the Police Report should place John Doe in the Escape's front passenger seat");
const NOT_OWNER = [
  /\b(?:John(?: A\.)?|client'?s|plaintiff'?s) (?:own |parked )?(?:2019 )?(?:Honda )?Civic\b/i, /\bhis (?:own |parked )?(?:2019 )?(?:Honda )?Civic\b/i,
  /\bowner:? John (?:A\. )?Doe\b/i, /\bDOE, John\b[^.]{0,40}\bCivic\b/i, /\b(?:Owner \/ claimant|Renter|Releasor)[^.:]{0,20}:? ?John (?:A\. )?Doe\b/i,
  /\bJohn (?:A\. )?Doe'?s? rental\b/i, /\bhis rental\b/i, /\bdamage to his property\b/i, /\bPlaintiff'?s property[- ]damage\b/i
];
for (const [id, t] of Object.entries(text)) {
  const flat = t.replace(/\s+/g, " ");
  NOT_OWNER.forEach(re => { const m = flat.match(re); if (m) fails.push(`${id}: “${m[0]}”: the Civic is Margaret Doe's; John Doe has no property-damage or rental claim`); });
}
if (text.RS07 !== undefined && !has("RS07", /DOE, Margaret/)) fails.push("RS07: the Police Report should list Margaret Doe as the parked Civic's owner");

console.log(`Audited ${Object.keys(text).length} of ${DOCS.length} documents.`);
warn.forEach(w => console.log("warn: " + w));
if (fails.length) { console.log(`\n${fails.length} problem(s):`); fails.forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
console.log("All documents pass.");
