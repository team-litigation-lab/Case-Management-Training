#!/usr/bin/env node
/* Merges the trainer scripts (build/case-flow/scripts/d1.json … d5.json, written to SCRIPTSPEC.md) into
   js/cm-case-flow-scripts.js (window.CM_CF_SCRIPTS), with the day slides' scripts (days.json: the Training Agenda, the
   Practice Lab, the End-of-Day Discussion) under CM_CF_SCRIPTS._days, and checks them: every slide of every Case Flow block has
   one, nothing else does, and each reads as something said out loud (45–230 words, no lists, labels, arrows or
   stage directions; one question to the room at most; {name} where a trainee is called on).
     node build/case-flow/scripts/assemble.cjs [--check]   (--check: validate only, write nothing) */
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../../..");
global.window = {};
require(path.join(ROOT, "js/cm-case-flow-data.js"));
require(path.join(ROOT, "js/cm-case-flow-slides.js"));
require(path.join(ROOT, "js/cm-case-flow-exhibits.js"));
const AUDITS = (global.window.CM_CF_EXHIBITS || {}).audits || {};
const CF = window.CM_CASE_FLOW, SLIDES = window.CM_CF_SLIDES;
const out = {}, errors = [];

// a block's slides, in order: the same as viewsOf() in js/cm-case-flow.js
const TH_PER = 4, KC_PER = 4;
function viewsOf(b){
  const vs = viewsIn(b), t = vs.indexOf("theory");
  return (SLIDES[b.id] || {}).theoryFirst && vs[0] === "why" && t > 0 ? ["theory", "why"].concat(vs.slice(1).filter(v => v !== "theory")) : vs;
}
function viewsIn(b){
  const t = (SLIDES[b.id] || {}).theory;
  const theory = !t ? [] : (t.concepts.length > TH_PER ? ["theory", "theory2"] : ["theory"]).concat(t.framework ? ["frame"] : []);
  const doc = (SLIDES[b.id] || {}).document ? ["doc"] : [];
  if(b.kind === "lesson" && b.brief) return ["why"].concat(doc, ["rules"]).concat((b.ops || []).length ? ["job"] : []);
  if(b.kind === "lesson" && b.compact) return ["why"].concat(doc, ((SLIDES[b.id] || {}).roadmap && !(SLIDES[b.id] || {}).roadmap.merge ? ["map"] : []), theory.slice(0, 1), ["rules"], (b.ops || []).length ? ["job"] : []);
  if(b.kind === "lesson") return ["why"].concat(doc, ((SLIDES[b.id] || {}).roadmap && !(SLIDES[b.id] || {}).roadmap.merge ? ["map"] : []), theory, ["rules"], b.show ? ["model"] : [], (b.ops || []).length ? ["job"] : [], (b.best || []).length && !b.noGame ? ["dodont"] : []);
  if(b.kind === "activity") return ["case"].concat((SLIDES[b.id] || {}).grade ? ["grade"] : [], ["task"], AUDITS[b.id] ? ["audit"] : [], b.show && !b.compact ? ["model"] : [], ["check"]);
  const qs = (SLIDES[b.id] || {}).questions || b.check.questions;
  return (qs.length > KC_PER ? ["questions", "questions2"] : ["questions"]).concat(["summary", "scale"]);
}

const wc = s => String(s).trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;
const BANNED = [/\{(?!name\})[^}]*\}|\{name(?!\})/, /➔|→|←/, /\*\*/, /\b(Tool|Output|Walk|Talk|Ask|Why):/, /Watch for this/i, /\bOpen with\b/i, /\bPoint (at|to) the\b/i, /\bWalk the (room|lifecycle|track|trainees)\b/i, /\bLet the room\b/i, /\bLand it\b/i, /^\s*[-•·]\s/m, /\bblueprint\b/i, /\bApex\b|Jordan Davies/];
const say = (id, f, s) => {
  if(typeof s !== "string" || !s.trim()) return errors.push(`${id}.${f}: missing`);
  const n = wc(s); if(n < 45 || n > 230) errors.push(`${id}.${f}: ${n} words (want 45–230)`);
  const hit = BANNED.find(r => r.test(s)); if(hit) errors.push(`${id}.${f}: reads like notes, not speech (${String(s.match(hit)[0]).trim()})`);
};
const ask = (id, f, s) => {
  if(s === undefined || s === "") return;
  if(typeof s !== "string" || !/\?\s*$/.test(s)) return errors.push(`${id}.${f}: want one question ending in "?"`);
  if(wc(s) > 35) errors.push(`${id}.${f}: ${wc(s)} words (max 35)`);
  const hit = BANNED.find(r => r.test(s)); if(hit) errors.push(`${id}.${f}: ${String(s.match(hit)[0]).trim()}`);
};

// one file per Case Flow day as taught (a block sits in the day its Case Phase is taught on), merged
const J = {};
for (const day of CF.days) {
  const f = path.join(__dirname, `d${day.n}.json`);
  if(!fs.existsSync(f)){ errors.push(`scripts d${day.n}.json missing`); continue; }
  for (const [id, c] of Object.entries(JSON.parse(fs.readFileSync(f, "utf8")))) { if(J[id]) errors.push(`${id}: in two files`); J[id] = c; }
}
const seen = new Set();
for (const day of CF.days) for (const m of day.modules) for (const b of m.blocks) {
  seen.add(b.id);
  const c = J[b.id]; if(!c){ errors.push(`${b.id}: no script`); continue; }
  const vs = viewsOf(b);
  for (const v of vs) { const x = c[v]; if(!x){ errors.push(`${b.id}.${v}: no script for this slide`); continue; } say(b.id, `${v}.say`, x.say); ask(b.id, `${v}.ask`, x.ask); }
  // a brief or compact (condensed) block keeps its full scripts, unused, so it can be taught in full again
  for (const v of Object.keys(c)) if(!vs.includes(v) && !b.brief && !b.compact) errors.push(`${b.id}.${v}: the block has no such slide`);
  out[b.id] = Object.fromEntries(vs.filter(v => c[v]).map(v => [v, c[v].ask ? {say: c[v].say.trim(), ask: c[v].ask.trim()} : {say: c[v].say.trim()}]));
}
for (const id of Object.keys(J)) if(!seen.has(id)) errors.push(`${id}: no such block`);
const n = Object.values(out).reduce((a, x) => a + Object.keys(x).length, 0), nBlocks = Object.keys(out).length;
// the day's own slides, outside any block (days.json): the opening Training Agenda, the Practice Lab, and the
// End-of-Day Discussion before the Knowledge Check. Under "_days", by Case Flow day, so the case dates roll in them too.
const DAYF = path.join(__dirname, "days.json"), SLOTS = ["agenda", "lab", "wrap"];
if(fs.existsSync(DAYF)){
  const days = JSON.parse(fs.readFileSync(DAYF, "utf8")); out._days = {};
  for (const [k, c] of Object.entries(days)) {
    if(!CF.days.some(d => String(d.n) === k)){ errors.push(`days.json ${k}: no such Case Flow day`); continue; }
    for (const v of Object.keys(c)) if(!SLOTS.includes(v)) errors.push(`days.json ${k}.${v}: want one of ${SLOTS.join(", ")}`);
    out._days[k] = Object.fromEntries(SLOTS.filter(v => c[v]).map(v => { say(`day ${k}`, `${v}.say`, c[v].say); ask(`day ${k}`, `${v}.ask`, c[v].ask);
      return [v, c[v].ask ? {say: c[v].say.trim(), ask: c[v].ask.trim()} : {say: c[v].say.trim()}]; }));
  }
}
if(errors.length){ console.log(`${errors.length} problem(s):`); errors.slice(0, 60).forEach((e, i) => console.log(`${i + 1}. ${e}`)); }
const OUT = path.join(ROOT, "js/cm-case-flow-scripts.js"), text = `/* The trainer's scripts: what the trainer says on each Case Flow slide (Presenter view's "Script — read aloud",
   and the day's Trainer Speaker Notes), assembled from build/case-flow/scripts/dN.json by
   build/case-flow/scripts/assemble.cjs. Written to build/case-flow/scripts/SCRIPTSPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SCRIPTS = ${JSON.stringify(out, null, 1)};
`;
if(process.argv.includes("--check")){
  if(!fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== text){ errors.push("js/cm-case-flow-scripts.js is out of date: run node build/case-flow/scripts/assemble.cjs"); console.log(errors[errors.length - 1]); }
  else if(!errors.length) console.log(`Trainer scripts: ${n} slides across ${nBlocks} blocks${out._days ? ` and the day slides of Day ${Object.keys(out._days).join(", ")}` : ""}, every one spoken, js/cm-case-flow-scripts.js in step`);
} else if(n){
  fs.writeFileSync(OUT, text);
  console.log(`wrote js/cm-case-flow-scripts.js: ${n} slides, ${nBlocks} blocks`);
}
process.exit(errors.length ? 1 : 0);
