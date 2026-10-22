/* The CMS is locked: these files do not change.
   Every file listed in .github/cms-lock.json is recorded by its SHA-256. This check reads each one and
   compares. A changed file, a missing file, or a listed file that is no longer there fails Checks and says
   which, so an edit to the CMS cannot land quietly on a branch or on main.

   The CMS modules are a graded surface — the case the course reads from the CMS, the filing of a document
   into it, and the record a trainer is shown. Trainees' saved filings are read back against exactly this
   behaviour, so a change here rewrites what past work means.

   Unlocking (a deliberate act, not a fix for a red check): change `locked` to false for that file in
   .github/cms-lock.json, in its own commit, with the reason in the commit message. Re-locking after an
   approved change: run `node .github/scripts/cms-locked.cjs --relock` to write the new hashes back. */
"use strict";
const fs = require("fs"), path = require("path"), crypto = require("crypto");

const ROOT = path.resolve(__dirname, "..", "..");
const MANIFEST = path.join(ROOT, ".github", "cms-lock.json");
const relock = process.argv.includes("--relock");

const sha = (p)=> crypto.createHash("sha256").update(fs.readFileSync(p)).digest("hex");

let man;
try{ man = JSON.parse(fs.readFileSync(MANIFEST, "utf8")); }
catch(e){ console.error(`✗ .github/cms-lock.json could not be read: ${e.message}`); process.exit(1); }

const files = man.files || {};
const names = Object.keys(files);
if(!names.length){ console.error("✗ .github/cms-lock.json lists no files. The CMS lock would check nothing."); process.exit(1); }

const problems = [], unlocked = [];
for(const rel of names){
  const entry = files[rel] || {};
  const abs = path.join(ROOT, rel);
  if(!fs.existsSync(abs)){ problems.push(`${rel} is listed as locked but is not in the repository. A locked file is not deleted either.`); continue; }
  if(entry.locked === false){ unlocked.push(rel); continue; }
  const now = sha(abs);
  if(relock){ entry.sha256 = now; continue; }
  if(now !== entry.sha256)
    problems.push(`${rel} has changed. The CMS is locked, so this file is frozen as it stands.\n`
      + `    recorded  ${entry.sha256}\n    on disk   ${now}\n`
      + `    If this change is wanted, unlock the file in .github/cms-lock.json in its own commit (see the header of this script).`);
}

if(relock){
  fs.writeFileSync(MANIFEST, JSON.stringify(man, null, 2) + "\n");
  console.log(`Re-locked ${names.length} file(s) in .github/cms-lock.json.`);
  process.exit(0);
}

unlocked.forEach(rel=> console.log(`• ${rel} is deliberately unlocked in .github/cms-lock.json — not checked.`));
if(problems.length){
  console.error("✗ The CMS is locked and something in it changed:\n");
  problems.forEach(p=> console.error(`  - ${p}`));
  process.exit(1);
}
console.log(`✓ The CMS is locked and unchanged (${names.length - unlocked.length} file(s) verified).`);
