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
require(path.join(ROOT, "js/cm-case-flow-docs.js"));
const DOC_IDS = new Set((window.CM_CF_DOCS || []).map(x => x.id));
// the original Canva decks' page text (build-time reference only; the course never shows the decks)
const DECKS = JSON.parse(fs.readFileSync(path.join(__dirname, "deck-pages.json"), "utf8"));
const CATALOG = fs.readFileSync(path.join(__dirname, "SLIDESPEC.md"), "utf8").split("## Image catalog")[1].split("\n").slice(1).join(" ").split("·").map(s => s.trim()).filter(Boolean);
const out = {}, errors = [];
// the day each block is taught on (the sequence), which can differ from the day its data sits under
const TAUGHT = {};
(CF.sequence || []).forEach(sd => (sd.phases || []).forEach(ph => (ph.blocks || []).forEach(id => { TAUGHT[id] = sd.n; })));
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
    if(x && x.more !== undefined){   // ＋ More: the detail that doesn't fit on the card, in a pop-up card
      if(!Array.isArray(x.more) || x.more.length < 2 || x.more.length > 6) errors.push(`${id}.theory.concepts[${i}].more: want 2–6 lines`);
      else x.more.forEach((m, k) => line(id, `theory.concepts[${i}].more[${k}]`, m, 22, [0, 1]));
    }
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
      if(!Array.isArray(f.steps) || f.steps.length < 3 || f.steps.length > (f.kind === "flow" ? 7 : 6)) errors.push(`${id}.theory.framework.steps: want 3–${f.kind === "flow" ? 7 : 6}`);   // a flow may run to seven (the deck's General Process)
      else f.steps.forEach((x, i) => { cell(`steps[${i}].label`, x && x.label, 5); cell(`steps[${i}].text`, x && x.text, 16);
        if(x && x.more !== undefined){   // ＋ More on a step: its pop-up card, as on a concept
          if(!Array.isArray(x.more) || x.more.length < 2 || x.more.length > 6) errors.push(`${id}.theory.framework.steps[${i}].more: want 2–6 lines`);
          else x.more.forEach((m, k) => line(id, `theory.framework.steps[${i}].more[${k}]`, m, 22, [0, 1]));
        } });
    } else if(f) errors.push(`${id}.theory.framework.kind: want table, flow or list`);
    if(f && f.note !== undefined) cell("note", f.note, 22);
  }
  return t;
};
/* The three micro-frameworks (SLIDESPEC.md, "Micro-frameworks"): Milestone Steps (`milestones`), Rule vs. Exception
   (`ruleEx`) and the CM Red Flag (`redFlag`), drawn on the lesson's existing slides, so no slide is added. Every date
   on a Milestone chip is one the case file carries, every document id is a case document, and a Red Flag names its owner. */
const CASE_FILE = fs.readFileSync(path.join(ROOT, "curriculum/5-day-flow/case-file.md"), "utf8");
const DATA_TEXT = fs.readFileSync(path.join(ROOT, "js/cm-case-flow-data.js"), "utf8");
const OWNERS = /^(Atty\. Thorne|Case Manager)$/;
const onFileDate = d => { const [m, dd] = d.split("/"); return CASE_FILE.includes(d) || DATA_TEXT.includes(d) || CASE_FILE.includes(`${m}/${dd}`) || DATA_TEXT.includes(`${m}/${dd}`); };
const microFrameworks = (b, c) => {
  const id = b.id, opt = (f, s, max) => line(id, f, s, max, [0, 1]);
  if(c.redFlag !== undefined){
    const r = c.redFlag || {};
    opt("redFlag.see", r.see, 18); opt("redFlag.costs", r.costs, 18); opt("redFlag.do", r.do, 15);
    if(typeof r.owner !== "string" || !OWNERS.test(r.owner)) errors.push(`${id}.redFlag.owner: name the owner (Atty. Thorne or Case Manager), got ${JSON.stringify(r.owner)}`);
    // the slide that draws it where the lesson has no Why It Matters slide: The Rules unless `on` names another with room for it at full size
    if(r.on !== undefined && !["theory", "theory2", "frame", "map", "model", "rules", "dodont"].includes(r.on)) errors.push(`${id}.redFlag.on: theory, theory2, frame, map, model, rules or dodont (the slide with room for it at full size on a laptop), or omit for The Rules`);
    // no slide of the lesson has room for it at full size: it is spoken, in the talking points for The Rules (scripts/assemble.cjs requires the point), not drawn
    if(r.spoken !== undefined && r.spoken !== true) errors.push(`${id}.redFlag.spoken: true (no slide of the lesson has room for the Red Flag at full size on a laptop: it is in the trainer's talking points for The Rules) or omit`);
    if(r.spoken && (r.on !== undefined || b.brief || c.whySlide)) errors.push(`${id}.redFlag.spoken: a Red Flag is drawn ("on", or a lesson that keeps its Why It Matters slide) or spoken, not both`);
    // beside the points on The Rules, with four two-line points: they are drawn at the size they take beside a Rule vs. Exception box
    if(r.tight !== undefined && r.tight !== true) errors.push(`${id}.redFlag.tight: true (The Rules draws its points a size smaller so the Red Flag fits beside them at full size) or omit`);
    if(r.tight && (r.spoken || c.ruleEx || (r.on !== undefined && r.on !== "rules") || b.brief || c.whySlide)) errors.push(`${id}.redFlag.tight: only where the Red Flag is drawn beside the points on The Rules`);
    if(r.on === "frame" && (b.compact || !(TH[id] || {}).framework)) errors.push(`${id}.redFlag.on: the lesson has no The Framework slide`);
    if(r.on === "map" && !(c.roadmap && !c.roadmap.merge)) errors.push(`${id}.redFlag.on: the lesson has no The Roadmap slide`);
    if(r.on === "model" && (b.compact || !b.show)) errors.push(`${id}.redFlag.on: the lesson has no See It slide`);
    if(r.on !== undefined && (b.brief || c.whySlide)) errors.push(`${id}.redFlag.on: the lesson keeps its Why It Matters slide, and the Red Flag is drawn there; take "on" out`);
    if(r.on === "theory2" && (b.compact || ((TH[id] || {}).concepts || []).length <= 4)) errors.push(`${id}.redFlag.on: the lesson has no The Theory, Continued slide`);
    if(r.on === "dodont" && (b.compact || b.noGame || !(b.best || []).length)) errors.push(`${id}.redFlag.on: the lesson has no Do & Don't slide`);
  }
  if(c.ruleEx !== undefined){
    const x = c.ruleEx || {};
    opt("ruleEx.rule", x.rule, 25); opt("ruleEx.exception", x.exception, 25);
    if(x.onFile !== undefined) opt("ruleEx.onFile", x.onFile, 20);
    opt("ruleEx.confirm", x.confirm, 8);
    if(typeof x.confirm === "string" && !/Atty\. Thorne|statute|Stat\./.test(x.confirm)) errors.push(`${id}.ruleEx.confirm: name Atty. Thorne or the governing statute`);
    if(x.contrast !== undefined && x.contrast !== true) errors.push(`${id}.ruleEx.contrast: true or omit`);
  }
  if(c.milestones !== undefined){
    const m = c.milestones || {};
    if(typeof m.title !== "string" || !m.title.trim() || wc(m.title) > 8 || marks(m.title)) errors.push(`${id}.milestones.title: want ≤ 8 words, no highlight`);
    if(m.start !== undefined && !(Number.isInteger(m.start) && m.start > 1)) errors.push(`${id}.milestones.start: a whole number above 1`);
    if(m.note !== undefined) opt("milestones.note", m.note, 16);
    // drawn on The Framework, or on The Rules of a lesson without one, and only where that slide holds the rail at full size on a laptop
    if(m.slide !== undefined) errors.push(`${id}.milestones.slide: no lesson has a Milestone Steps slide any more; take the rail out of the copy (its steps go in the trainer's talking points for The Rules) unless The Framework or The Rules has room for it`);
    if(!Array.isArray(m.steps) || m.steps.length < 3 || m.steps.length > 6) errors.push(`${id}.milestones.steps: want 3–6`);
    else m.steps.forEach((s, i) => {
      const f = `milestones.steps[${i}]`;
      if(!s || typeof s.label !== "string" || !s.label.trim() || wc(s.label) > 4 || marks(s.label)) errors.push(`${id}.${f}.label: want ≤ 4 words, no highlight`);
      opt(`${f}.done`, s && s.done, 12);
      if(s && s.chip !== undefined){   // a date (MM/DD/YYYY, or a range ending in one) or a document / claim id
        const dates = String(s.chip).match(/\d{2}\/\d{2}\/\d{4}/g) || [], rs = /^RS\d+$/.test(s.chip);
        if(rs){ if(!DOC_IDS.has(s.chip)) errors.push(`${id}.${f}.chip: "${s.chip}" isn't a case document`); }
        else if(dates.length) dates.forEach(d => { if(!onFileDate(d)) errors.push(`${id}.${f}.chip: ${d} isn't a date on the case file`); });
        else if(!/^[A-Z]{2,}-[A-Z0-9-]+$/.test(s.chip) || !CASE_FILE.includes(s.chip)) errors.push(`${id}.${f}.chip: want a date (MM/DD/YYYY) or a document or claim id on the case file`);
      }
    });
  }
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
      if(c.job !== undefined) errors.push(`${b.id}.job: no lesson has an On the Job slide any more; take its copy out`);
      if(c.roadmap !== undefined){   // a complex lesson's roadmap: 3–6 steps, shown before anything is taught or tested
        const r = c.roadmap;
        if(!r || typeof r.title !== "string" || !r.title.trim() || wc(r.title) > 8 || marks(r.title)) errors.push(`${b.id}.roadmap.title: want ≤ 8 words, no highlight`);
        if(!r || !Array.isArray(r.steps) || r.steps.length < 3 || r.steps.length > 6) errors.push(`${b.id}.roadmap.steps: want 3–6`);
        else r.steps.forEach((x, i) => {
          if(!x || typeof x.label !== "string" || !x.label.trim() || wc(x.label) > 5 || marks(x.label)) errors.push(`${b.id}.roadmap.steps[${i}].label: want ≤ 5 words, no highlight`);
          if(!x || typeof x.text !== "string" || !x.text.trim() || wc(x.text) > 12 || marks(x.text) > 1 || marks(x.text) % 1) errors.push(`${b.id}.roadmap.steps[${i}].text: want ≤ 12 words, at most one highlight`);
        });
      }
      if(c.document !== undefined){   // The Document: a legal or medical document broken down before any task asks the trainee to work with it
        const d = c.document || {};
        if(typeof d.name !== "string" || !d.name.trim() || wc(d.name) > 6 || marks(d.name)) errors.push(`${b.id}.document.name: want ≤ 6 words, no highlight`);
        if(d.doc !== undefined && !DOC_IDS.has(d.doc)) errors.push(`${b.id}.document.doc: "${d.doc}" isn't a case document (js/cm-case-flow-docs.js)`);
        for (const f of ["definition", "purpose", "evidence"]) line(b.id, `document.${f}`, d[f], 24);
        list(b.id, "document.handling", d.handling, 2, 4, 12);
      }
      // Why It Matters opens The Theory (no slide of its own); "whySlide": true keeps the slide in a lesson whose Theory or Rules slide has no room
      if(c.whySlide !== undefined && c.whySlide !== true) errors.push(`${b.id}.whySlide: true (the lesson keeps its Why It Matters slide: its Theory slide has no room for the opening line, or no slide has room for its Red Flag, at full size on a laptop) or omit`);
      if(c.whySlide && b.brief) errors.push(`${b.id}.whySlide: a brief lesson has no Theory slide and always keeps Why It Matters; take it out`);
      if(/^\*\*[^*]+?[.!?:]\*\*\s+\S/.test(String(c.hook || "")) && !b.brief && !c.whySlide) errors.push(`${b.id}.hook: a hook that opens The Theory is one sentence (only its bold first sentence would be drawn)`);
      // the opening line of The Theory where the hook would wrap: one sentence, at most 14 words (the full hook is then in the theory's talking points)
      if(c.whyLine !== undefined){
        line(b.id, "whyLine", c.whyLine, 14);
        if(b.brief || c.whySlide) errors.push(`${b.id}.whyLine: the lesson keeps its Why It Matters slide, which shows the hook; take "whyLine" out`);
        if(/[.!?]\s+\S/.test(String(c.whyLine).replace(/\*\*/g, "").replace(/\b(Atty|Dr|Hon|Esq|Ret|v|vs)\./g, "$1"))) errors.push(`${b.id}.whyLine: one sentence`);
      }
      microFrameworks(b, c);
      if((b.best || []).length){ list(b.id, "dos", c.dos, 2, 3, 10); list(b.id, "donts", c.donts, 2, 3, 10); }
      const t = theory(b); if(t) out[b.id] = Object.assign({}, c, {theory: t});
    } else if(b.kind === "activity"){
      line(b.id, "situation", c.situation, 32, [1, 2]); line(b.id, "deliver", c.deliver, 14); list(b.id, "checks", c.checks, 3, 5, 10);
      /* Your Task's steps: one numbered block of full, plain sentences that say where each step is done (no "X of Y" shorthand),
         at most one highlight each. Day 1 is fully guided (4–6 steps); the days after give less (Days 4–5: 3–4 steps).
         A side skill builder ("side": true) is short: its situation states the assumption ("Assuming …") and it has 2–3 steps. */
      const taught = TAUGHT[b.id] || 0, side = c.side === true;
      if(c.side !== undefined && c.side !== true) errors.push(`${b.id}.side: true (a short side skill builder) or omit`);
      if(side && !/^Assuming\b/.test(String(c.situation || ""))) errors.push(`${b.id}.situation: a side skill builder opens with its assumption ("Assuming …")`);
      // "ownerSteps": true keeps the steps the course owner wrote word for word (Day 3's Backup File Maintenance, a side exercise with five)
      if(c.ownerSteps !== undefined && (c.ownerSteps !== true || !side)) errors.push(`${b.id}.ownerSteps: true, on a side skill builder whose steps the owner wrote, or omit`);
      const [s0, s1] = side ? (c.ownerSteps ? [2, 5] : [2, 3]) : taught === 1 ? [4, 6] : taught >= 4 ? [3, 4] : [3, 5];
      if(!Array.isArray(c.steps) || c.steps.length < s0 || c.steps.length > s1) errors.push(`${b.id}.steps: ${Array.isArray(c.steps) ? c.steps.length : "no"} steps (want ${s0}–${s1} on Day ${taught}${side ? ", a side skill builder" : ""})`);
      else c.steps.forEach((s, i) => { line(b.id, `steps[${i}]`, s, 32, [0, 1]);
        if(!/[.?!]$/.test(String(s).replace(/\*\*/g, "").trim())) errors.push(`${b.id}.steps[${i}]: write it as a full sentence, ending in a full stop: ${s}`);
        if(/\bX of Y\b/.test(s)) errors.push(`${b.id}.steps[${i}]: no shorthand ("X of Y"): ${s}`); });
      if(c.purpose !== undefined) line(b.id, "purpose", c.purpose, 14); if(c.principle !== undefined) line(b.id, "principle", c.principle, 12);
      if(c.dos) list(b.id, "dos", c.dos, 1, 2, 10); if(c.donts) list(b.id, "donts", c.donts, 1, 2, 10);
      if(c.grade !== undefined){   // the Grade-A Standard slide before Your Task: a packet or binder's guidelines, inclusions and steps
        const g = c.grade || {};
        if(typeof g.title !== "string" || !g.title.trim() || wc(g.title) > 8 || marks(g.title)) errors.push(`${b.id}.grade.title: want ≤ 8 words, no highlight`);
        list(b.id, "grade.guide", g.guide, 3, 4, 12); list(b.id, "grade.include", g.include, 5, 8, 10); list(b.id, "grade.steps", g.steps, 4, 6, 13);
      }
    } else {
      list(b.id, "questions", c.questions, b.check.questions.length, b.check.questions.length, 18);
    }
    if(!out[b.id]) out[b.id] = c;
  }
}
const n = Object.keys(out).length;
if(errors.length){ console.log(`${errors.length} problem(s):`); errors.slice(0, 60).forEach((e, i) => console.log(`${i + 1}. ${e}`)); }
const OUT = path.join(ROOT, "js/cm-case-flow-slides.js"), text = `/* The Case Flow slides' concise copy (one idea per slide, the key phrase **highlighted**), assembled from
   build/case-flow/slides/dN.json (and theory-dN.json) by build/case-flow/slides/assemble.cjs. Written to build/case-flow/slides/SLIDESPEC.md.
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
