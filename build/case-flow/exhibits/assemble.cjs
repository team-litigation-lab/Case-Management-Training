#!/usr/bin/env node
/* The Case Flow's exhibit audits, completed-package reveals and service-confirmation emails:
   build/case-flow/exhibits/dN.json → js/cm-case-flow-exhibits.js (window.CM_CF_EXHIBITS), and the checks
   EXHIBITSPEC.md sets out.
     node build/case-flow/exhibits/assemble.cjs           writes js/cm-case-flow-exhibits.js
     node build/case-flow/exhibits/assemble.cjs --check    validates only; writes nothing (CI) */
const fs = require("fs"), path = require("path");
const ROOT = path.resolve(__dirname, "../../.."), HERE = __dirname;
const CHECK = process.argv.includes("--check");

global.window = {};
require(path.join(ROOT, "js/cm-case-flow-data.js"));
require(path.join(ROOT, "js/cm-case-flow-docs.js"));
const CF = global.window.CM_CASE_FLOW, DOCS = global.window.CM_CF_DOCS, PACKETS = global.window.CM_CF_DOC_PACKETS;
const FOLDERS = new Set((global.window.CM_CF_DOC_FOLDERS || []).map(f => f.id));

const errors = [];
const BLOCKS = {};
CF.days.forEach(d => d.modules.forEach(m => m.blocks.forEach(b => { BLOCKS[b.id] = b; })));
// an activity's day is the day the course teaches it, not the module it is stored in
const taughtOn = {};
(CF.sequence || []).forEach(d => d.phases.forEach(ph => ph.blocks.forEach(id => { taughtOn[id] = d.n; })));
const docOf = id => DOCS.find(d => d.id === id);
const words = s => String(s || "").trim().split(/\s+/).filter(Boolean).length;
const VERDICTS = ["keep", "replace", "pull", "add", "flag"];
const KINDS = ["loophole", "gap", "privilege", "qc", "arithmetic", "calendar"];
const DATE = /^\d{2}\/\d{2}\/\d{4}$/;

function cap(at, s, max, what){
  if(!s || !String(s).trim()){ errors.push(`${at}: missing ${what}`); return; }
  if(words(s) > max) errors.push(`${at}: ${words(s)} words, at most ${max} (${what})`);
  if(/[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}]/u.test(s)) errors.push(`${at}: no emoji`);
  if(/<[a-z/]/i.test(s)) errors.push(`${at}: no HTML`);
  if(/blueprint/i.test(s)) errors.push(`${at}: says "blueprint"; the program never uses the word`);
}
function proof(at, ids, day){
  if(!Array.isArray(ids) || !ids.length || ids.length > 4){ errors.push(`${at}: proof needs 1–4 document ids`); return; }
  ids.forEach(id => {
    const d = docOf(id);
    if(!d){ errors.push(`${at}: proof ${id} is not a document in js/cm-case-flow-docs.js`); return; }
    if(d.day > day) errors.push(`${at}: proof ${id} opens on Day ${d.day}, after this activity (Day ${day})`);
  });
}

/* ---------- the audits follow the lessons and the practice case ----------
   Nothing in an audit is a fact of its own: every figure, date and name in it is a restatement of the case
   file, the lesson data, the document manifest or the documents the item cites. So each one has to be found
   in one of those, and a lesson or case-file change that leaves a figure behind fails here, naming the item
   — instead of sitting in the course as an audit that teaches the wrong number.

   What counts as a source for an item: curriculum/5-day-flow/case-file.md, the lesson data, the document
   manifest, and the text of the documents that audit works from (its draft set, its finished set, and every
   document the item itself cites as proof). Dates of the drafts' own assembly live in those documents, which
   is why they resolve too. */
const SOURCE_TEXT = (() => {
  const read = f => { try{ return fs.readFileSync(path.join(ROOT, f), "utf8"); }catch(e){ return ""; } };
  return read("curriculum/5-day-flow/case-file.md") + read("js/cm-case-flow-data.js") + read("js/cm-case-flow-docs.js");
})();
const docText = (() => {
  const cache = {};
  return id => {
    if(cache[id] != null) return cache[id];
    const d = docOf(id);
    let t = d ? `${d.title} ${d.desc} ${d.key}` : "";
    try{ t += fs.readFileSync(path.join(ROOT, "documents/case-flow/html", id + ".html"), "utf8"); }catch(e){}
    return (cache[id] = t);
  };
})();
// the same figure written either way, and the ways a date is written in the documents
const norm = t => String(t).replace(/&[a-z]+;/g, " ").replace(/<[^>]+>/g, " ").replace(/\s+/g, " ");
const MONEY = /\$[\d,]+(?:\.\d\d)?/g, DATE_IN = /\b\d{2}\/\d{2}\/\d{4}\b/g;
// The names too, not only the numbers: a carrier, a coverage or a party the course has stopped calling by that
// name is the drift that reads worst to a trainee. A name is satisfied if the phrase is in the sources, or the
// phrase without its first word is (so a sentence opening "Request the Final Itemized Ledger" is not a finding),
// or every capitalised word in it appears somewhere in them.
const NAME = /\b([A-Z][a-zA-Z'’]+(?:\s+(?:&|of|the|and)\s+|\s+)(?:[A-Z][a-zA-Z'’]+)(?:\s+[A-Z][a-zA-Z'’]+)*)/g;
const CAPWORD = /[A-Z][a-zA-Z'’]*/g;
function unsourced(text, pool){
  const t = String(text || ""), missing = [];
  for (const re of [MONEY, DATE_IN]) for (const m of t.match(re) || []) if(!pool.includes(m)) missing.push(m);
  for (const m of t.match(NAME) || []){
    if(pool.includes(m)) continue;
    const tail = m.split(/\s+/).slice(1).join(" ");
    if(tail && pool.includes(tail)) continue;
    const unknown = (m.match(CAPWORD) || []).filter(w => !pool.includes(w));
    if(unknown.length) missing.push(`"${unknown.join('", "')}" (in "${m}")`);
  }
  return [...new Set(missing)];
}

const out = {audits: {}, emails: {}};
const AUDIT_OF = out.audits;   // an activity's audit, for the confirmation on the same activity
for (const f of fs.readdirSync(HERE).filter(f => /^d\d\.json$/.test(f)).sort()){
  let part;
  try{ part = JSON.parse(fs.readFileSync(path.join(HERE, f), "utf8")); }
  catch(e){ errors.push(`${f}: not valid JSON (${e.message})`); continue; }
  for (const k of Object.keys(part)) if(!["audits", "emails"].includes(k)) errors.push(`${f}: unknown key "${k}"`);

  for (const [id, a] of Object.entries(part.audits || {})){
    const at = `${f} audits.${id}`, b = BLOCKS[id], day = taughtOn[id] || (b && b.day);
    if(!b || b.kind !== "activity"){ errors.push(`${at}: not a Skill Activity in js/cm-case-flow-data.js`); continue; }
    if(out.audits[id]) errors.push(`${at}: a second audit for the same activity`);
    cap(`${at}.title`, a.title, 9, "title");
    cap(`${at}.kicker`, a.kicker, 16, "kicker");
    cap(`${at}.intro`, a.intro, 55, "intro");
    cap(`${at}.revealNote`, a.revealNote, 45, "revealNote");
    if(!DATE.test(a.due || "")) errors.push(`${at}.due: "${a.due}" is not MM/DD/YYYY`);
    // the draft set is in the activity's packet; the completed set is the answer, so it is not
    const packet = PACKETS[id] || [];
    if(!docOf(a.source)) errors.push(`${at}.source: ${a.source} is not a document`);
    else if(!packet.includes(a.source)) errors.push(`${at}.source: ${a.source} is not in this activity's CM_CF_DOC_PACKETS packet`);
    if(!docOf(a.reveal)) errors.push(`${at}.reveal: ${a.reveal} is not a document`);
    else{
      if(packet.includes(a.reveal)) errors.push(`${at}.reveal: ${a.reveal} is in the activity's packet; the completed set is the answer and must not be`);
      if(docOf(a.reveal).day > day) errors.push(`${at}.reveal: ${a.reveal} opens on Day ${docOf(a.reveal).day}, after this activity (Day ${day})`);
    }
    if(!a.columns || !a.columns.ref || !a.columns.as) errors.push(`${at}.columns: needs ref and as headings`);
    else{ cap(`${at}.columns.ref`, a.columns.ref, 4, "ref heading"); cap(`${at}.columns.as`, a.columns.as, 7, "as heading"); }
    const items = a.items || [];
    if(items.length < 12 || items.length > 18) errors.push(`${at}.items: ${items.length} items, expected 12–18`);
    items.forEach((it, i) => {
      const w = `${at}.items[${i}]`;
      if(!it.ref) errors.push(`${w}: missing ref`);
      cap(`${w}.what`, it.what, 14, "what");
      cap(`${w}.as`, it.as, 26, "as");
      cap(`${w}.issue`, it.issue, 44, "issue");
      cap(`${w}.fix`, it.fix, 36, "fix");
      if(!VERDICTS.includes(it.verdict)) errors.push(`${w}.verdict: "${it.verdict}" is not one of ${VERDICTS.join(" · ")}`);
      if(!KINDS.includes(it.kind)) errors.push(`${w}.kind: "${it.kind}" is not one of ${KINDS.join(" · ")}`);
      proof(`${w}.proof`, it.proof, day);
    });
    // a trainee who marks everything wrong has audited nothing; the attorney's call is a verdict of its own
    const by = v => items.filter(x => x.verdict === v).length;
    if(by("keep") < 3) errors.push(`${at}.items: ${by("keep")} "keep" items, at least 3 (an audit is not a list of faults)`);
    if(!by("flag")) errors.push(`${at}.items: no "flag" item (the attorney's call is part of the audit)`);
    if(!by("add")) errors.push(`${at}.items: no "add" item (an audit finds what is missing too)`);
    // every figure and date in this audit, against the sources it is drawn from
    {
      const cited = new Set([a.source, a.reveal].concat(items.flatMap(it => it.proof || [])));
      const pool = norm(SOURCE_TEXT + [...cited].map(docText).join(" "));
      items.forEach((it, i) => {
        const gone = unsourced([it.what, it.as, it.issue, it.fix].join(" "), pool);
        if(gone.length) errors.push(`${at}.items[${i}] "${it.what}": ${gone.join(", ")} is in no source this item draws on (the case file, the lesson data, the manifest, or ${(it.proof || []).concat([a.source]).join(" / ")}). A lesson or case-file change has left it behind.`);
      });
      const goneIntro = unsourced(`${a.intro} ${a.revealNote} ${(a.revealPoints || []).join(" ")}`, pool);
      if(goneIntro.length) errors.push(`${at}: ${goneIntro.join(", ")} is in no source this audit draws on. A lesson or case-file change has left it behind.`);
    }
    const pts = a.revealPoints || [];
    if(pts.length < 4 || pts.length > 6) errors.push(`${at}.revealPoints: ${pts.length}, expected 4–6`);
    pts.forEach((p, i) => cap(`${at}.revealPoints[${i}]`, p, 24, "reveal point"));
    out.audits[id] = a;
  }

  for (const [id, e] of Object.entries(part.emails || {})){
    const at = `${f} emails.${id}`, b = BLOCKS[id], day = taughtOn[id] || (b && b.day);
    if(!b || b.kind !== "activity"){ errors.push(`${at}: not a Skill Activity in js/cm-case-flow-data.js`); continue; }
    if(out.emails[id]) errors.push(`${at}: a second email for the same activity`);
    cap(`${at}.title`, e.title, 11, "title");
    cap(`${at}.kicker`, e.kicker, 16, "kicker");
    cap(`${at}.brief`, e.brief, 50, "brief");
    ["to", "subject", "attachment"].forEach(k => { if(!e[k]) errors.push(`${at}.${k}: missing`); });
    if(!docOf(e.model)) errors.push(`${at}.model: ${e.model} is not a document`);
    else if((PACKETS[id] || []).includes(e.model)) errors.push(`${at}.model: ${e.model} is in the activity's packet; the model is the answer and must not be`);
    else if(docOf(e.model).day > day) errors.push(`${at}.model: ${e.model} opens on Day ${docOf(e.model).day}, after this activity (Day ${day})`);
    const m = e.mail || {};
    if(!DATE.test(m.sent || "")) errors.push(`${at}.mail.sent: "${m.sent}" is not MM/DD/YYYY`);
    if(!DATE.test(m.receipt || "")) errors.push(`${at}.mail.receipt: "${m.receipt}" is not MM/DD/YYYY`);
    if(!m.channel || !m.proof) errors.push(`${at}.mail: needs channel and proof`);
    const req = e.required || [];
    if(req.length < 4 || req.length > 6) errors.push(`${at}.required: ${req.length}, expected 4–6`);
    const seen = new Set();
    req.forEach((r, i) => {
      const w = `${at}.required[${i}]`;
      if(!r.id) errors.push(`${w}: missing id`); else if(seen.has(r.id)) errors.push(`${w}: duplicate id "${r.id}"`); else seen.add(r.id);
      cap(`${w}.label`, r.label, 14, "label");
      cap(`${w}.hint`, r.hint, 20, "hint");
      if(!Array.isArray(r.match) || !r.match.length) errors.push(`${w}.match: needs at least one pattern`);
      (r.match || []).forEach((p, j) => { try{ new RegExp(p, "i"); }catch(err){ errors.push(`${w}.match[${j}]: not a valid regular expression (${err.message})`); } });
    });
    const rep = e.reply || {};
    if(!DATE.test(rep.date || "")) errors.push(`${at}.reply.date: "${rep.date}" is not MM/DD/YYYY`);
    ["from", "time", "subject"].forEach(k => { if(!rep[k]) errors.push(`${at}.reply.${k}: missing`); });
    cap(`${at}.reply.body`, rep.body, 130, "reply body");
    const pr = e.press || {};
    if(!DATE.test(pr.date || "")) errors.push(`${at}.press.date: "${pr.date}" is not MM/DD/YYYY`);
    cap(`${at}.press.body`, pr.body, 90, "press body");
    const ch = pr.choices || [];
    if(ch.length < 2 || ch.length > 4) errors.push(`${at}.press.choices: ${ch.length}, expected 2–4`);
    if(ch.filter(c => c.ok).length !== 1) errors.push(`${at}.press.choices: exactly one choice is ok`);
    ch.forEach((c, i) => { cap(`${at}.press.choices[${i}].label`, c.label, 24, "choice"); cap(`${at}.press.choices[${i}].why`, c.why, 30, "why"); });
    const c = e.convert || {};
    cap(`${at}.convert.title`, c.title, 12, "convert title");
    if(!c.category || !c.type) errors.push(`${at}.convert: needs category and type`);
    // the Backup Drive folder the filing keeps a copy in (js/cm-drive.js lays the drive out from these)
    if(!FOLDERS.has(c.folder)) errors.push(`${at}.convert.folder: "${c.folder}" is not a CM_CF_DOC_FOLDERS id (${[...FOLDERS].join(" · ")})`);
    if(!(c.sections || []).length) errors.push(`${at}.convert.sections: none`);
    (c.sections || []).forEach((s, i) => cap(`${at}.convert.sections[${i}].h`, s.h, 10, "section heading"));
    const est = c.establishes || [];
    if(est.length < 3 || est.length > 6) errors.push(`${at}.convert.establishes: ${est.length}, expected 3–6`);
    est.forEach((x, i) => cap(`${at}.convert.establishes[${i}]`, x, 30, "establishes"));
    {
      const pool = norm(SOURCE_TEXT + docText(e.model) + (AUDIT_OF[id] ? docText(AUDIT_OF[id].source) + docText(AUDIT_OF[id].reveal) : ""));
      const where = {brief: e.brief, "reply.body": (e.reply || {}).body, "press.body": (e.press || {}).body,
        "convert.sections": ((e.convert || {}).sections || []).flatMap(x => [x.h].concat(x.lines || [])).join(" "),
        "convert.establishes": ((e.convert || {}).establishes || []).join(" "),
        required: (e.required || []).map(q => q.label).join(" ")};
      for (const [k, v] of Object.entries(where)){
        const gone = unsourced(v, pool);
        if(gone.length) errors.push(`${at}.${k}: ${gone.join(", ")} is in no source this confirmation draws on (the case file, the lesson data, the manifest or ${e.model}). A lesson or case-file change has left it behind.`);
      }
    }
    out.emails[id] = e;
  }
}
if(!Object.keys(out.audits).length) errors.push("no audits found in build/case-flow/exhibits/dN.json");

const text = `/* The Case Flow's exhibit audits, completed-package reveals and service-confirmation emails.
   Assembled from build/case-flow/exhibits/*.json by build/case-flow/exhibits/assemble.cjs, written to EXHIBITSPEC.md.
   Do not edit here: edit the JSON and assemble again. */\nwindow.CM_CF_EXHIBITS = ${JSON.stringify(out, null, 1)};\n`;
const OUT = path.join(ROOT, "js/cm-case-flow-exhibits.js");

if(errors.length){
  console.log(`${errors.length} problem(s) in build/case-flow/exhibits (EXHIBITSPEC.md):`);
  errors.slice(0, 40).forEach((e, i) => console.log(`${i + 1}. ${e}`));
  if(errors.length > 40) console.log(`… and ${errors.length - 40} more`);
  process.exit(1);
}
const nItems = Object.values(out.audits).reduce((n, a) => n + a.items.length, 0);
if(CHECK){
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if(have !== text){ console.log("js/cm-case-flow-exhibits.js is out of step with build/case-flow/exhibits/*.json.\nRun: node build/case-flow/exhibits/assemble.cjs"); process.exit(1); }
  console.log(`Exhibit audits: ${Object.keys(out.audits).length} audits, ${nItems} items, ${Object.keys(out.emails).length} service confirmation(s), js/cm-case-flow-exhibits.js in step`);
}else{
  fs.writeFileSync(OUT, text);
  console.log(`wrote js/cm-case-flow-exhibits.js: ${Object.keys(out.audits).length} audits, ${nItems} items, ${Object.keys(out.emails).length} service confirmation(s)`);
}
