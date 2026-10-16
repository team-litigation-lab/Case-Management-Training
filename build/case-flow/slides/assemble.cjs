#!/usr/bin/env node
/* Merges the concise slide copy (build/case-flow/slides/d1.json … d5.json, and each lesson's theory from
   theory-d1.json … theory-d5.json, written to SLIDESPEC.md) into
   js/cm-case-flow-slides.js (window.CM_CF_SLIDES), and checks it against the curriculum and the spec:
   every block covered, the fields its kind needs, the word limits, one highlight per line, a known picture.
     node build/case-flow/slides/assemble.cjs [--check]   (--check: validate only, write nothing) */
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../../..");
global.window = {};
require(path.join(ROOT, "js/cm-case-flow-data.js"));
const CF = window.CM_CASE_FLOW;
require(path.join(ROOT, "js/cm-decks-data.js"));
const DECKS = window.CM_DECKS;
const CATALOG = fs.readFileSync(path.join(__dirname, "SLIDESPEC.md"), "utf8").split("## Image catalog")[1].split("\n").slice(1).join(" ").split("·").map(s => s.trim()).filter(Boolean);
const out = {}, errors = [];
const wc = s => String(s).replace(/\*\*/g, "").trim().split(/\s+/).filter(w => /[\p{L}\p{N}]/u.test(w)).length;   // a symbol alone (→, ·, …, &) is not a word
const marks = s => (String(s).match(/\*\*/g) || []).length / 2;
const line = (id, f, s, max, hl = [1, 1]) => {
  if(typeof s !== "string" || !s.trim()) return errors.push(`${id}.${f}: missing`);
  if(wc(s) > max) errors.push(`${id}.${f}: ${wc(s)} words (max ${max}): ${s}`);
  const m = marks(s); if(m < hl[0] || m > hl[1] || m % 1) errors.push(`${id}.${f}: ${m} highlights (want ${hl.join("–")}): ${s}`);
  if(/blueprint/i.test(s)) errors.push(`${id}.${f}: says "blueprint"`);
};
const list = (id, f, xs, n0, n1, max) => { if(!Array.isArray(xs) || xs.length < n0 || xs.length > n1) return errors.push(`${id}.${f}: ${Array.isArray(xs) ? xs.length : "no"} items (want ${n0}–${n1})`); xs.forEach((s, i) => line(id, `${f}[${i}]`, s, max)); };
// The Theory: each lesson's concepts from the original Canva decks (build/case-flow/slides/theory-dN.json)
const TH = {};
for (const day of CF.days) { const f = path.join(__dirname, `theory-d${day.n}.json`); if(fs.existsSync(f)) Object.assign(TH, JSON.parse(fs.readFileSync(f, "utf8"))); }
const theory = (b) => {
  const t = TH[b.id], id = b.id;
  if(!t) return errors.push(`${id}.theory: missing (theory-dN.json)`), null;
  line(id, "theory.lead", t.lead, 28);
  // 3–4 concepts on one slide; a deep topic (coverage, treatment) may carry 6–8, shown as The Theory and The Theory, Continued
  if(!Array.isArray(t.concepts) || t.concepts.length < 3 || t.concepts.length > 8 || t.concepts.length === 5) errors.push(`${id}.theory.concepts: want 3–4 (or 6–8 for a deep topic)`);
  else t.concepts.forEach((x, i) => {
    if(!x || typeof x.term !== "string" || !x.term.trim() || wc(x.term) > 5 || marks(x.term)) errors.push(`${id}.theory.concepts[${i}].term: want ≤ 5 words, no highlight`);
    line(id, `theory.concepts[${i}].text`, x && x.text, 20);
  });
  // pages are the original Canva decks' own pages ("D1#24" = Day 1 deck, page 24: decks/day1/24.webp, js/cm-decks-data.js),
  // not the lesson's `sources` (those number the earlier course's topics in build/dayN.js)
  if(!Array.isArray(t.pages) || t.pages.length > 2) errors.push(`${id}.theory.pages: want 0–2`);
  else {
    if(!t.pages.length && (b.sources || []).some(s => /^D\d#\d+$/.test(s))) errors.push(`${id}.theory.pages: show the deck page(s) its theory comes from`);
    t.pages.forEach(p => {
      const pg = (/^D(\d)#(\d+)$/.exec(p) || []), w = DECKS[pg[1]] && DECKS[pg[1]].pages[pg[2]];
      if(!w) errors.push(`${id}.theory.pages: ${p} isn't a page of the decks`);
      else if(/\bApex\b|Jordan Davies/i.test(w.w)) errors.push(`${id}.theory.pages: ${p} shows the archived Apex file's facts`);
      const [, d, n] = /^D(\d)#(\d+)$/.exec(p) || [];
      if(!d || !fs.existsSync(path.join(ROOT, `decks/day${d}/${String(n).padStart(2, "0")}.webp`))) errors.push(`${id}.theory.pages: no page image for ${p}`);
    });
  }
  return t;
};
for (const day of CF.days) {
  const f = path.join(__dirname, `d${day.n}.json`);
  if(!fs.existsSync(f)){ errors.push(`d${day.n}.json missing`); continue; }
  const j = JSON.parse(fs.readFileSync(f, "utf8"));
  for (const m of day.modules) for (const b of m.blocks) {
    const c = j[b.id]; if(!c){ errors.push(`${b.id}: no copy`); continue; }
    if(!CATALOG.includes(c.image)) errors.push(`${b.id}.image: "${c.image}" isn't in the catalog`);
    if(b.kind === "lesson"){
      line(b.id, "hook", c.hook, 16); list(b.id, "points", c.points, 3, 4, 12);
      if((b.tell.upl || []).length) line(b.id, "upl", c.upl, 14, [0, 1]);
      if((b.ops || []).length){ if(!Array.isArray(c.job) || !c.job.length || c.job.length > 3) errors.push(`${b.id}.job: want 1–3 rows`); else c.job.forEach((r, i) => { if(!Array.isArray(r) || r.length !== 4) errors.push(`${b.id}.job[${i}]: want 4 cells`); else r.forEach((x, k) => { if(wc(x) > 6) errors.push(`${b.id}.job[${i}][${k}]: ${wc(x)} words (max 6)`); }); }); }
      if((b.best || []).length){ list(b.id, "dos", c.dos, 2, 3, 10); list(b.id, "donts", c.donts, 2, 3, 10); }
      const t = theory(b); if(t) out[b.id] = Object.assign({}, c, {theory: t});
    } else if(b.kind === "activity"){
      line(b.id, "situation", c.situation, 32, [1, 2]); list(b.id, "steps", c.steps, 3, 5, 12); line(b.id, "deliver", c.deliver, 14); list(b.id, "checks", c.checks, 3, 5, 10);
      if(c.dos) list(b.id, "dos", c.dos, 1, 2, 10); if(c.donts) list(b.id, "donts", c.donts, 1, 2, 10);
    } else {
      list(b.id, "questions", c.questions, b.check.questions.length, b.check.questions.length, 18);
    }
    if(!out[b.id]) out[b.id] = c;
  }
}
const n = Object.keys(out).length;
if(errors.length){ console.log(`${errors.length} problem(s):`); errors.slice(0, 60).forEach((e, i) => console.log(`${i + 1}. ${e}`)); }
const OUT = path.join(ROOT, "js/cm-case-flow-slides.js"), text = `/* The Case Flow slides' concise copy (one idea per slide, the key phrase **highlighted**), assembled from
   build/case-flow/slides/dN.json by build/case-flow/slides/assemble.cjs. Written to build/case-flow/slides/SLIDESPEC.md.
   Do not edit here: edit the JSON and assemble again. */
window.CM_CF_SLIDES = ${JSON.stringify(out, null, 1)};
`;
if(process.argv.includes("--check")){
  if(!fs.existsSync(OUT) || fs.readFileSync(OUT, "utf8") !== text){ errors.push("js/cm-case-flow-slides.js is out of date: run node build/case-flow/slides/assemble.cjs"); console.log(errors[errors.length - 1]); }
  else if(!errors.length) console.log(`Case Flow slides: ${n} blocks of concise copy, in the spec's limits, js/cm-case-flow-slides.js in step`);
} else if(n){
  fs.writeFileSync(OUT, text);
  console.log(`wrote js/cm-case-flow-slides.js: ${n} blocks`);
}
process.exit(errors.length ? 1 : 0);
