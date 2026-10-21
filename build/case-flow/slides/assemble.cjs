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
// the original Canva decks' page text (build-time reference only; the course never shows the decks)
const DECKS = JSON.parse(fs.readFileSync(path.join(__dirname, "deck-pages.json"), "utf8"));
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
  // pages are the original Canva decks' own pages ("D1#24" = Day 1 deck, page 24, in deck-pages.json),
  // not the lesson's `sources` (those number the earlier course's topics in build/dayN.js)
  if(!Array.isArray(t.pages) || t.pages.length > 2) errors.push(`${id}.theory.pages: want 0–2`);
  else {
    if(!t.pages.length && (b.sources || []).some(s => /^D\d#\d+$/.test(s))) errors.push(`${id}.theory.pages: show the deck page(s) its theory comes from`);
    t.pages.forEach(p => {
      const pg = (/^D(\d)#(\d+)$/.exec(p) || []), w = DECKS[pg[1]] && DECKS[pg[1]][pg[2]];
      if(!w) errors.push(`${id}.theory.pages: ${p} isn't a page of the decks`);
      else if(/\bApex\b|Jordan Davies/i.test(w.w)) errors.push(`${id}.theory.pages: ${p} shows the old Apex file's facts`);
    });
  }
  // The Framework: the deck page's own structure (its table, flowchart or checklist), rebuilt in the course's design
  const f = t.framework;
  if(f !== undefined){
    if(!f || typeof f.title !== "string" || !f.title.trim() || wc(f.title) > 8 || marks(f.title)) errors.push(`${id}.theory.framework.title: want ≤ 8 words, no highlight`);
    const cell = (k, x, max) => { if(typeof x !== "string" || !x.trim()) errors.push(`${id}.theory.framework.${k}: empty`); else if(wc(x) > max) errors.push(`${id}.theory.framework.${k}: ${wc(x)} words (max ${max}): ${x}`); else if(marks(x) % 1 || marks(x) > 1) errors.push(`${id}.theory.framework.${k}: at most one highlight`); };
    if(f && f.kind === "table"){
      if(!Array.isArray(f.head) || f.head.length < 2 || f.head.length > 4) errors.push(`${id}.theory.framework.head: want 2–4 columns`);
      else f.head.forEach((x, i) => cell(`head[${i}]`, x, 4));
      if(!Array.isArray(f.rows) || f.rows.length < 2 || f.rows.length > 6) errors.push(`${id}.theory.framework.rows: want 2–6`);
      else f.rows.forEach((r, i) => { if(!Array.isArray(r) || r.length !== (f.head || []).length) errors.push(`${id}.theory.framework.rows[${i}]: want ${(f.head || []).length} cells`); else r.forEach((x, j) => cell(`rows[${i}][${j}]`, x, 12)); });
    } else if(f && (f.kind === "flow" || f.kind === "list")){
      if(!Array.isArray(f.steps) || f.steps.length < 3 || f.steps.length > 6) errors.push(`${id}.theory.framework.steps: want 3–6`);
      else f.steps.forEach((x, i) => { cell(`steps[${i}].label`, x && x.label, 5); cell(`steps[${i}].text`, x && x.text, 16); });
    } else if(f) errors.push(`${id}.theory.framework.kind: want table, flow or list`);
    if(f && f.note !== undefined) cell("note", f.note, 22);
  }
  return t;
};
// 3 Clues, 1 Rule: the Do & Don't slide's game (build/case-flow/slides/clues-dN.json): three clues for each Do and
// each Don't, widest first, that never say the rule's key words or give the verdict away
const CL = {};
for (const day of CF.days) { const f = path.join(__dirname, `clues-d${day.n}.json`); if(fs.existsSync(f)) Object.assign(CL, JSON.parse(fs.readFileSync(f, "utf8"))); }
const VERDICT = /\b(do|don't|dont|never|always|should|must|avoid|mistakes?|wrong|right|good|bad|pitfalls?)\b/i;
const clues = (b, c) => {
  const k = CL[b.id], id = b.id; if(!k) return errors.push(`${id}.clues: missing (clues-dN.json)`), null;
  for (const side of ["dos", "donts"]) {
    const items = c[side] || [], set = k[side];
    if(!Array.isArray(set) || set.length !== items.length){ errors.push(`${id}.clues.${side}: want ${items.length} sets of clues`); continue; }
    set.forEach((three, i) => {
      if(!Array.isArray(three) || three.length !== 3) return errors.push(`${id}.clues.${side}[${i}]: want 3 clues`);
      const key = ((String(items[i]).match(/\*\*(.+?)\*\*/) || [])[1] || "").toLowerCase(), keyWords = key.split(/[^\p{L}]+/u).filter(w => w.length >= 5);
      three.forEach((x, j) => {
        const f = `clues.${side}[${i}][${j}]`;
        if(typeof x !== "string" || !x.trim()) return errors.push(`${id}.${f}: missing`);
        if(wc(x) < 5 || wc(x) > 14) errors.push(`${id}.${f}: ${wc(x)} words (want 5–14): ${x}`);
        if(marks(x)) errors.push(`${id}.${f}: no highlight in a clue`);
        if(VERDICT.test(x)) errors.push(`${id}.${f}: gives the verdict away ("${x.match(VERDICT)[0]}"): ${x}`);
        const lw = x.toLowerCase(), hit = keyWords.find(w => new RegExp(`\\b${w}`, "i").test(lw));
        if((key && lw.includes(key)) || hit) errors.push(`${id}.${f}: says the rule's key words ("${hit || key}"): ${x}`);
        if(/\bApex\b|Jordan Davies/i.test(x)) errors.push(`${id}.${f}: the old Apex file`);
      });
    });
  }
  return k;
};
// the copy files, merged (a block's copy stays in its file when the block moves to another module or day)
const j = {};
for (const day of CF.days) {
  const f = path.join(__dirname, `d${day.n}.json`);
  if(!fs.existsSync(f)){ errors.push(`d${day.n}.json missing`); continue; }
  for (const [id, c] of Object.entries(JSON.parse(fs.readFileSync(f, "utf8")))) { if(j[id]) errors.push(`${id}: copy in two files`); j[id] = c; }
}
for (const day of CF.days) {
  for (const m of day.modules) for (const b of m.blocks) {
    const c = j[b.id]; if(!c){ errors.push(`${b.id}: no copy`); continue; }
    if(!CATALOG.includes(c.image)) errors.push(`${b.id}.image: "${c.image}" isn't in the catalog`);
    if(b.kind === "lesson"){
      line(b.id, "hook", c.hook, 16); list(b.id, "points", c.points, 3, 4, 12);
      if((b.tell.upl || []).length) line(b.id, "upl", c.upl, 14, [0, 1]);
      if((b.ops || []).length){ if(!Array.isArray(c.job) || !c.job.length || c.job.length > 3) errors.push(`${b.id}.job: want 1–3 rows`); else c.job.forEach((r, i) => { if(!Array.isArray(r) || r.length !== 4) errors.push(`${b.id}.job[${i}]: want 4 cells`); else r.forEach((x, k) => { if(wc(x) > 6) errors.push(`${b.id}.job[${i}][${k}]: ${wc(x)} words (max 6)`); }); }); }
      if(c.roadmap !== undefined){   // a complex lesson's roadmap: 3–6 steps, shown before anything is taught or tested
        const r = c.roadmap;
        if(!r || typeof r.title !== "string" || !r.title.trim() || wc(r.title) > 8 || marks(r.title)) errors.push(`${b.id}.roadmap.title: want ≤ 8 words, no highlight`);
        if(!r || !Array.isArray(r.steps) || r.steps.length < 3 || r.steps.length > 6) errors.push(`${b.id}.roadmap.steps: want 3–6`);
        else r.steps.forEach((x, i) => {
          if(!x || typeof x.label !== "string" || !x.label.trim() || wc(x.label) > 5 || marks(x.label)) errors.push(`${b.id}.roadmap.steps[${i}].label: want ≤ 5 words, no highlight`);
          if(!x || typeof x.text !== "string" || !x.text.trim() || wc(x.text) > 12 || marks(x.text) > 1 || marks(x.text) % 1) errors.push(`${b.id}.roadmap.steps[${i}].text: want ≤ 12 words, at most one highlight`);
        });
      }
      let k = null;
      if((b.best || []).length){ list(b.id, "dos", c.dos, 2, 3, 10); list(b.id, "donts", c.donts, 2, 3, 10); k = clues(b, c); }
      const t = theory(b); if(t) out[b.id] = Object.assign({}, c, {theory: t}, k ? {clues: k} : {});
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
   build/case-flow/slides/dN.json (theory-dN.json, clues-dN.json) by build/case-flow/slides/assemble.cjs. Written to build/case-flow/slides/SLIDESPEC.md.
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
