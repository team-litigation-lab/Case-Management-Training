#!/usr/bin/env node
/* Assembles the Case Flow simulation (build/case-flow/sim/days12.json + days345.json, written to SIMSPEC.md)
   into js/cm-case-flow-sim.js (window.CM_CF_SIM), checking it against the course data first:
     node build/case-flow/sim/assemble.cjs           validate and write
     node build/case-flow/sim/assemble.cjs --check   validate, and fail if js/cm-case-flow-sim.js is out of step (CI) */
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../../.."), OUT = path.join(ROOT, "js/cm-case-flow-sim.js");
global.window = {};
require(path.join(ROOT, "js/cm-case-flow-data.js"));
require(path.join(ROOT, "js/cm-case-flow-docs.js"));
const CF = window.CM_CASE_FLOW, DOCS = new Set(window.CM_CF_DOCS.map(d => d.id));
const COPY = {};
for(let n = 1; n <= 5; n++) Object.assign(COPY, JSON.parse(fs.readFileSync(path.join(ROOT, `build/case-flow/slides/d${n}.json`), "utf8")));

const BLOCK = {}, ORDER = {}, DAY = {};
CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { BLOCK[b.id] = b; })));
let i = 0;
CF.sequence.forEach(d => d.phases.forEach(ph => ph.blocks.forEach(id => { ORDER[id] = i++; DAY[id] = d.n; })));
const ACTS = Object.keys(ORDER).filter(id => BLOCK[id].kind === "activity").sort((a, b) => ORDER[a] - ORDER[b]);

const errors = [], err = m => errors.push(m);
const wc = s => String(s || "").trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
const date = s => /^(0[1-9]|1[0-2])\/(0[1-9]|[12]\d|3[01])\/20\d\d$/.test(s || "");
const toTime = s => { const [m, d, y] = s.split("/").map(Number); return Date.UTC(y, m - 1, d); };
const text = (at, s, max) => { if(typeof s !== "string" || !s.trim()) return err(`${at}: missing`); if(wc(s) > max) err(`${at}: ${wc(s)} words (max ${max})`); if(/<\/?(a|b|i|p|br|div|span|strong|em|img|script|style|ul|ol|li|table)\b[^>]*>|blueprint/i.test(s)) err(`${at}: HTML or "blueprint"`); };
const CHANNELS = ["email", "call", "voicemail", "letter", "fax", "alert", "portal", "text", "memo"];
const ROLES = ["client", "family", "adjuster", "provider", "attorney", "counsel", "paralegal", "lienholder", "mediator"];

const parts = ["days12.json", "days345.json"].map(f => {
  const p = path.join(__dirname, f);
  if(!fs.existsSync(p)){ err(`${f} missing`); return {}; }
  return JSON.parse(fs.readFileSync(p, "utf8"));
});
const sim = {events: {}, calls: {}, fallout: [], timeline: []};
parts.forEach(x => { Object.assign(sim.events, x.events || {}); Object.assign(sim.calls, x.calls || {}); sim.fallout.push(...(x.fallout || [])); sim.timeline.push(...(x.timeline || [])); });

function event(at, e, max){
  if(!e || typeof e !== "object") return err(`${at}: missing`);
  if(!date(e.date)) err(`${at}.date: "${e.date}" isn't MM/DD/YYYY`);
  if(!CHANNELS.includes(e.channel)) err(`${at}.channel: "${e.channel}"`);
  text(`${at}.from`, e.from, 14); text(`${at}.subject`, e.subject, 16); text(`${at}.body`, e.body, max);
  (e.attachments || []).forEach(a => { if(!DOCS.has(a)) err(`${at}.attachments: ${a} isn't a document`); });
  // what happened just before it (shown above it, smaller), and a snapshot of a CMS log as it stands (in place of the thumbnails)
  (e.before || []).forEach((x, j) => { if(x.before || x.log) err(`${at}.before[${j}]: no nesting`); event(`${at}.before[${j}]`, x, 60); if(date(x.date) && date(e.date) && toTime(x.date) > toTime(e.date)) err(`${at}.before[${j}]: after the event`); });
  if(e.log){
    const g = e.log; text(`${at}.log.title`, g.title, 12);
    if(!Array.isArray(g.head) || g.head.length < 2 || g.head.length > 5) err(`${at}.log.head: want 2–5 columns`);
    if(!Array.isArray(g.rows) || g.rows.length < 2 || g.rows.length > 10) err(`${at}.log.rows: want 2–10 rows`);
    else g.rows.forEach((r, j) => {
      if(!Array.isArray(r.cells) || r.cells.length !== (g.head || []).length) err(`${at}.log.rows[${j}]: one cell per column`);
      else { if(g.head[0] === "Date" && !date(r.cells[0])) err(`${at}.log.rows[${j}]: "${r.cells[0]}" isn't MM/DD/YYYY`); r.cells.forEach((x, k) => text(`${at}.log.rows[${j}][${k}]`, x, 14)); }
      if(r.mark && !["call", "email", "esc"].includes(r.mark)) err(`${at}.log.rows[${j}].mark: "${r.mark}" (call, email, esc)`);
    });
    if(g.note) text(`${at}.log.note`, g.note, 30);
  }
  // a voicemail is heard, not read: what the caller says, and the listening check on it
  if(e.channel === "voicemail" && (e.spoken || e.listen)){
    text(`${at}.spoken`, e.spoken, 160);
    if(!Array.isArray(e.listen) || e.listen.length < 3 || e.listen.length > 6) err(`${at}.listen: want 3–6 questions`);
    else e.listen.forEach((x, j) => {
      text(`${at}.listen[${j}].q`, x.q, 20); text(`${at}.listen[${j}].a`, x.a, 30);
      if(!Array.isArray(x.match) || !x.match.length) err(`${at}.listen[${j}].match: want 1+ patterns`);
      else x.match.forEach(m => { try{ const re = new RegExp(m, "i"); if(!re.test(x.a)) err(`${at}.listen[${j}].match /${m}/ doesn't match its own answer`); }catch(er){ err(`${at}.listen[${j}].match /${m}/: ${er.message}`); } });
    });
  }
}
// every activity: an event, in date order with the activities before it on its track
ACTS.forEach(id => event(`events.${id}`, sim.events[id], 60));
Object.keys(sim.events).forEach(id => { if(!ACTS.includes(id)) err(`events.${id}: not a Skill Activity`); });
// every Case Phase: at least one call
CF.sequence.forEach(d => d.phases.forEach(ph => {
  if(!ph.blocks.some(id => sim.calls[id])) err(`calls: Case Flow Day ${d.n} "${ph.title}" has no call`);
}));
Object.entries(sim.calls).forEach(([id, c]) => {
  const at = `calls.${id}`;
  if(!ACTS.includes(id)) err(`${at}: not a Skill Activity`);
  text(`${at}.who`, c.who, 8);
  if(!ROLES.includes(c.role)) err(`${at}.role: "${c.role}"`);
  text(`${at}.persona`, c.persona, 30); text(`${at}.context`, c.context, 90); text(`${at}.opening`, c.opening, 40); text(`${at}.line`, c.line, 20);
  if(!Array.isArray(c.goals) || c.goals.length < 3 || c.goals.length > 4) err(`${at}.goals: want 3–4`);
  else c.goals.forEach((g, j) => text(`${at}.goals[${j}]`, g, 14));
});
sim.fallout.forEach((f, j) => {
  const at = `fallout[${j}]`, a = f.if && f.if.activity, b = f.then && f.then.activity;
  if(!ACTS.includes(a) || !ACTS.includes(b)) return err(`${at}: ${a} → ${b} must both be Skill Activities`);
  if(ORDER[b] <= ORDER[a]) err(`${at}: ${b} isn't taught after ${a}`);
  const checks = (COPY[a] || {}).checks || [];
  if(!(f.if.check >= 0 && f.if.check < checks.length)) err(`${at}.if.check: ${f.if.check} (${a} has ${checks.length} checks)`);
  event(`${at}.then.event`, Object.assign({date: (sim.events[b] || {}).date || "01/01/2026"}, f.then.event), 45);
});
if(sim.timeline.length < 15 || sim.timeline.length > 34) err(`timeline: ${sim.timeline.length} milestones (want 15–34)`);
sim.timeline.forEach((t, j) => {
  if(!date(t.date)) err(`timeline[${j}].date`);
  text(`timeline[${j}].label`, t.label, 6);
  if(!["", "A", "B"].includes(t.track || "")) err(`timeline[${j}].track`);
  if(!["", "claims", "care"].includes(t.lane || "")) err(`timeline[${j}].lane: "${t.lane}" (claims, care or "")`);
  if(j && date(t.date) && date(sim.timeline[j - 1].date) && toTime(t.date) < toTime(sim.timeline[j - 1].date)) err(`timeline[${j}]: out of date order`);
});

if(errors.length){ console.log(`${errors.length} problem(s):`); errors.slice(0, 60).forEach((e, k) => console.log(`${k + 1}. ${e}`)); }
const out = `/* The Case Flow simulation: what lands on John Doe's file to start each Skill Activity (events), the live call
   in every Case Phase (calls), what a skipped step costs later (fallout) and the case's milestones (timeline).
   Assembled from build/case-flow/sim/*.json by build/case-flow/sim/assemble.cjs, written to SIMSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SIM = ${JSON.stringify(sim, null, 1)};
`;
if(process.argv.includes("--check")){
  if(!fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== out){ err("js/cm-case-flow-sim.js is out of date: run node build/case-flow/sim/assemble.cjs"); console.log(errors[errors.length - 1]); }
  else if(!errors.length) console.log(`Case Flow simulation: ${Object.keys(sim.events).length} events, ${Object.keys(sim.calls).length} calls, ${sim.fallout.length} fallout rules, ${sim.timeline.length} milestones; js/cm-case-flow-sim.js in step`);
} else if(!errors.length){
  fs.writeFileSync(OUT, out);
  console.log(`wrote js/cm-case-flow-sim.js: ${Object.keys(sim.events).length} events, ${Object.keys(sim.calls).length} calls, ${sim.fallout.length} fallout rules, ${sim.timeline.length} milestones`);
}
process.exit(errors.length ? 1 : 0);
