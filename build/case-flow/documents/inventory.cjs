#!/usr/bin/env node
/* The document inventory: every case document of John Doe v. Robert Smith, how it reaches the file, the challenge it
   plants for the trainee, how they prove it, how they fix it, where in the course it is worked, and the corrected or
   finished copy it leads to — written to curriculum/5-day-flow/document-inventory.md from the manifest
   (js/cm-case-flow-docs.js), the activity packets, the lessons, the Amendment Requests (build/case-flow/exhibits)
   and build/case-flow/documents/challenges.json.
     node build/case-flow/documents/inventory.cjs           writes the inventory
     node build/case-flow/documents/inventory.cjs --check   checks the sync and that the written file is in step (CI)
   The checks: every planted document has a challenge and every challenge a planted document; each challenge is worked
   in an activity that has the document in its packet, taught on or after the day the document opens; the documents
   that prove it open by then (so the trainee can actually catch it); a challenge fixed by an Amendment Request has
   one, and its corrected copy is gated on it; every corrected copy names the record it corrects. */
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../../.."), CHECK = process.argv.includes("--check");
global.window = {};
require(path.join(ROOT, "js/cm-case-flow-data.js"));
require(path.join(ROOT, "js/cm-case-flow-docs.js"));
const CF = window.CM_CASE_FLOW, DOCS = window.CM_CF_DOCS, PACKETS = window.CM_CF_DOC_PACKETS, FOLDERS = window.CM_CF_DOC_FOLDERS;
const EX = JSON.parse(fs.readFileSync(path.join(ROOT, "build/case-flow/exhibits/d3.json"), "utf8"));
const CH = JSON.parse(fs.readFileSync(path.join(__dirname, "challenges.json"), "utf8"));
const OUT = path.join(ROOT, "curriculum/5-day-flow/document-inventory.md");

const errors = [];
const doc = id => DOCS.find(d => d.id === id);
const taughtOn = {}, titleOf = {};
CF.sequence.forEach(d => d.phases.forEach(ph => ph.blocks.forEach(id => { taughtOn[id] = d.n; })));
CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { titleOf[b.id] = b.title; })));
const usedIn = id => Object.entries(PACKETS).filter(([, ids]) => ids.includes(id)).map(([a]) => a)
  .sort((a, b) => (taughtOn[a] || 9) - (taughtOn[b] || 9) || a.localeCompare(b));
const planted = d => /^PLANTED/.test(d.key || "");
const amendments = Object.values(EX.amendments || {}).flatMap(a => a.requests);
const finished = {};   // a draft set and the finished set its audit reveals, from the exhibit audits
for (const f of ["d3.json", "d4.json"]){
  const j = JSON.parse(fs.readFileSync(path.join(ROOT, "build/case-flow/exhibits", f), "utf8"));
  Object.values(j.audits || {}).forEach(a => { finished[a.source] = a.reveal; });
}

// ---- the sync checks ----
for (const d of DOCS){
  const c = CH.challenges[d.id];
  if(planted(d) && !c) errors.push(`${d.id}: its key is PLANTED but challenges.json has no challenge for it (how does the trainee catch and fix it?)`);
  if(!planted(d) && c) errors.push(`${d.id}: challenges.json has a challenge, but its manifest key plants nothing`);
  if(!usedIn(d.id).length) errors.push(`${d.id}: no activity works from it (CM_CF_DOC_PACKETS)`);
  if(d.amends){
    const a = amendments.find(q => q.doc === d.amends);
    if(!doc(d.amends)) errors.push(`${d.id}: amends ${d.amends}, which is not a document`);
    if(!a || a.corrected !== d.id) errors.push(`${d.id}: a corrected copy of ${d.amends}, but no Amendment Request brings it back`);
    if(!d.unlock || !taughtOn[d.unlock]) errors.push(`${d.id}: a corrected copy needs unlock: the activity whose request opens it`);
  }
}
for (const [id, c] of Object.entries(CH.challenges)){
  const d = doc(id); if(!d){ errors.push(`challenges.json ${id}: not a document`); continue; }
  if(!CH.routes[c.route]) errors.push(`challenges.json ${id}: route "${c.route}" is not one of ${Object.keys(CH.routes).join(" · ")}`);
  if(!(c.in || []).length) errors.push(`challenges.json ${id}: no activity where it is worked`);
  const first = Math.min(...(c.in || []).map(a => taughtOn[a] || 9));
  (c.in || []).forEach(a => {
    if(!taughtOn[a]) errors.push(`challenges.json ${id}: "${a}" is not an activity the course teaches`);
    else if(!(PACKETS[a] || []).includes(id)) errors.push(`challenges.json ${id}: worked in ${a}, but ${a}'s packet does not hold ${id}`);
    else if(taughtOn[a] < d.day) errors.push(`challenges.json ${id}: worked in ${a} (Day ${taughtOn[a]}), before ${id} opens (Day ${d.day})`);
  });
  (c.proof || []).forEach(p => {
    const pd = doc(p);
    if(!pd) errors.push(`challenges.json ${id}: proof ${p} is not a document`);
    else if(pd.day > first) errors.push(`challenges.json ${id}: proved by ${p}, which opens on Day ${pd.day}, after the first activity that works it (Day ${first}); the trainee could not catch it there`);
  });
  if(c.route === "amend"){
    const a = amendments.find(q => q.doc === id);
    if(!a) errors.push(`challenges.json ${id}: fixed by an Amendment Request, but build/case-flow/exhibits has none for it`);
    else if((a.corrected || null) !== (c.corrected || null)) errors.push(`challenges.json ${id}: corrected copy ${c.corrected || "none"} here, ${a.corrected || "none"} in the Amendment Request`);
  }
  if(c.corrected && !doc(c.corrected)) errors.push(`challenges.json ${id}: corrected copy ${c.corrected} is not a document`);
  if(c.corrected && finished[id] && finished[id] !== c.corrected) errors.push(`challenges.json ${id}: corrected copy ${c.corrected}, but its audit reveals ${finished[id]}`);
}
amendments.forEach(q => { if(!CH.challenges[q.doc] || CH.challenges[q.doc].route !== "amend") errors.push(`${q.doc}: has an Amendment Request but its challenge is not routed "amend"`); });

// ---- the inventory ----
const cell = s => String(s || "").replace(/\|/g, "\\|").replace(/\s+/g, " ").trim();
const keyText = d => planted(d) ? d.key.replace(/^PLANTED:?\s*/, "") : "";
const acts = ids => ids.map(a => `${a} (D${taughtOn[a] || "?"})`).join(", ");
let md = `# John Doe v. Robert Smith — the document inventory

Generated by \`build/case-flow/documents/inventory.cjs\` from the manifest (\`js/cm-case-flow-docs.js\`), the activity
packets, the exhibit audits and Amendment Requests (\`build/case-flow/exhibits/\`) and
\`build/case-flow/documents/challenges.json\`. Do not edit here: edit those and run the script. CI fails when a planted
document has no route to being caught and fixed, when the documents that prove it open too late for the activity that
works it, or when a corrected copy has no request behind it.

**${DOCS.length} documents** · **${DOCS.filter(planted).length} plant a challenge** · **${DOCS.filter(d => d.amends).length} corrected copies** come back from the trainee's Amendment Requests · D*n* = the Case Flow day.

## How the trainee fixes a challenge

| Route | What the trainee does |
|---|---|
${Object.entries(CH.routes).map(([k, v]) => `| \`${k}\` | ${cell(v)} |`).join("\n")}

## The challenges, in the order the course reaches them

| Doc | The challenge | How it is caught (proof) | Fix | Worked in | Leads to |
|---|---|---|---|---|---|
${Object.entries(CH.challenges).sort((a, b) => Math.min(...a[1].in.map(x => taughtOn[x] || 9)) - Math.min(...b[1].in.map(x => taughtOn[x] || 9)) || a[0].localeCompare(b[0])).map(([id, c]) =>
  `| ${id} ${cell(doc(id).title)} | ${cell(c.spot)} | ${c.proof.map(p => `${p} (D${doc(p).day})`).join(", ")} | \`${c.route}\` | ${acts(c.in)} | ${c.corrected ? `${c.corrected} ${cell(doc(c.corrected).title)}` : "—"} |`).join("\n")}

## Amendment Requests (Pre-Demand Case Auditing, d2m4-a1)

The trainee screens the records and bills, finds those wrong at their source, and writes each provider a request with
Atty. Thorne's approval. A request that leaves out what the provider needs, or asks for what it must not, is refused
with the reason; a complete one brings the provider's answer and the corrected copy, which opens to the trainee
(Documents page, later packets) and is filed in the CMS. Each request ends in written feedback.

| Record | Wrong at the source | Request to | Answer | Corrected copy |
|---|---|---|---|---|
${amendments.map(q => `| ${q.doc} | ${cell(q.wrong)} | ${cell(q.to.replace(/\s*<.*>/, ""))} | ${q.reply.date} | ${q.corrected ? `${q.corrected} (opens when the request is sent)` : `none before the demand; then: ${cell(q.next.q)}`} |`).join("\n")}

## Every document

| Doc | Title | Folder | Opens | CMS | How it reaches the file | Challenge | Worked in |
|---|---|---|---|---|---|---|---|
${DOCS.slice().sort((a, b) => a.id.localeCompare(b.id)).map(d => `| ${d.id} | ${cell(d.title)} | ${cell((FOLDERS.find(f => f.id === d.folder) || {}).label)} | D${d.day}${d.unlock ? ` (after ${d.unlock}'s request)` : ""} | ${cell(d.cms)} | ${cell((CH.obtainedOverride || {})[d.id] || CH.obtained[d.folder])} | ${planted(d) ? cell(keyText(d)).slice(0, 160) + (keyText(d).length > 160 ? "…" : "") : (d.amends ? `Corrects ${d.amends}` : "—")} | ${acts(usedIn(d.id))} |`).join("\n")}

## Open sync items (need a decision before they are changed)

${(CH.open || []).map(x => `- ${x}`).join("\n")}
`;

if(errors.length){
  console.log(`${errors.length} problem(s) in the document inventory:`);
  errors.forEach((e, i) => console.log(`${i + 1}. ${e}`));
  process.exit(1);
}
if(CHECK){
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if(have !== md){ console.log("curriculum/5-day-flow/document-inventory.md is out of step.\nRun: node build/case-flow/documents/inventory.cjs"); process.exit(1); }
  console.log(`Document inventory: ${DOCS.length} documents, ${Object.keys(CH.challenges).length} challenges each caught and fixed in the course, ${DOCS.filter(d => d.amends).length} corrected copies; curriculum/5-day-flow/document-inventory.md in step`);
}else{
  fs.writeFileSync(OUT, md);
  console.log(`wrote curriculum/5-day-flow/document-inventory.md: ${DOCS.length} documents, ${Object.keys(CH.challenges).length} challenges`);
}
