#!/usr/bin/env node
/* Writes js/cm-figures.js from build/case-flow/figures.cjs, so the lessons and the practice case state the
   case's money by token and the figure arrives at run time:

       node build/case-flow/figures/assemble.cjs            write js/cm-figures.js
       node build/case-flow/figures/assemble.cjs --check     validate only (CI): the file is in step

   The generated module is to money what js/cm-case-dates.js is to dates: loaded after the Case Flow content and
   before js/cm-case-flow.js, it walks every string in CM_CASE_FLOW, CM_CF_SLIDES, CM_CF_SIM, CM_CF_DOCS,
   CM_CF_SCRIPTS and CM_CF_EXHIBITS and substitutes {{token}} in place. case-doc.html and net-sheet.html load it
   too, so a case document and the practice sheet read from the same spine. */
"use strict";
const fs = require("fs");
const path = require("path");
const {spine, netSheet, tokens, PCT_TOKENS, money, check} = require("../figures.cjs");

const ROOT = path.resolve(__dirname, "../../..");
const OUT = path.join(ROOT, "js/cm-figures.js");
const CHECK = process.argv.includes("--check");

const s = spine();
const fails = check(s);
if (fails.length) { console.error(`The case's money does not add up, so nothing was written:\n${fails.map((f, i) => `${i + 1}. ${f}`).join("\n")}`); process.exit(1); }

const T = tokens(s), P = PCT_TOKENS(s), NS = netSheet(s);
const json = o => JSON.stringify(o, null, 2).replace(/\n/g, "\n  ");

const file = `/* John Doe v. Robert Smith — the case's money, in the course. GENERATED, do not edit.
     node build/case-flow/figures/assemble.cjs       (from build/case-flow/figures.cjs)

   The money is declared once, in build/case-flow/figures.cjs: only the facts a document proves are written down
   (a charge, a payment, a limit, a fee tier, an accepted reduction) and every total, net, share and split is
   derived. This carries the derived figures into the program, so a lesson, a slide, a trainer script, an exhibit
   audit, a case document and the practice sheet never state a figure twice.

   How the content uses it: write {{openLiens}} where you mean the open liens, {{netA}} for Track A's net to the
   client, {{payoffA}} for the accepted LOP payoff, and so on (CM_FIGURES.tokens lists them all). Loaded after the
   Case Flow content and before js/cm-case-flow.js, this walks every string in CM_CASE_FLOW, CM_CF_SLIDES,
   CM_CF_SIM, CM_CF_DOCS, CM_CF_SCRIPTS and CM_CF_EXHIBITS and substitutes the figure in place — exactly as
   js/cm-case-dates.js rewrites the dates. A token that is not known is left alone and reported in the console, so
   a typo shows up rather than printing a blank.

   A figure that is a fact of its own — a premium, a policy limit, the Property Damage schedule, a page count —
   is written out in the content as before. This is for the spine: what the file recovers, what comes off it, and
   what reaches John Doe. */
(function(){
  "use strict";
  const money = n => (n < 0 ? "\\u2013" : "") + "$" + Math.abs(n).toLocaleString("en-US", {minimumFractionDigits: 2, maximumFractionDigits: 2});
  const F = ${json(T)};
  const PCT = ${json(P)};
  /* the figures the practice sheet grades, by stage and cell (js/cm-net-sheet.js builds its checks from these) */
  const NET_SHEET = ${json(NS)};

  const TOKEN = /\\{\\{([a-zA-Z]+)\\}\\}/g;
  const unknown = new Set();
  /* one string: {{token}} → its figure; {{tokenPct}} → its percentage */
  function text(str){
    if(typeof str !== "string" || str.indexOf("{{") < 0) return str;
    return str.replace(TOKEN, (whole, name) => {
      if(Object.prototype.hasOwnProperty.call(F, name)) return money(F[name]);
      if(Object.prototype.hasOwnProperty.call(PCT, name)) return PCT[name] + "%";
      unknown.add(name);
      return whole;
    });
  }
  /* every string in a structure, in place (ids, file paths and image names are left alone, as the dates do) */
  const KEEP = new Set(["id", "file", "folder", "image", "kind", "cms", "tool"]);
  function apply(o, seen){
    if(!o || typeof o !== "object") return o;
    seen = seen || new Set(); if(seen.has(o)) return o; seen.add(o);
    for(const key of Object.keys(o)){
      const v = o[key];
      if(typeof v === "string"){ if(!KEEP.has(key)) o[key] = text(v); }
      else if(v && typeof v === "object") apply(v, seen);
    }
    return o;
  }
  window.CM_FIGURES = {
    money, text, apply, figures: F, pct: PCT, netSheet: NET_SHEET,
    get tokens(){ return Object.keys(F).concat(Object.keys(PCT)).sort(); },
    get unresolved(){ return [...unknown]; }
  };
  ["CM_CASE_FLOW", "CM_CF_SLIDES", "CM_CF_SIM", "CM_CF_DOCS", "CM_CF_SCRIPTS", "CM_CF_EXHIBITS"].forEach(k => { if(window[k]) apply(window[k]); });
  if(unknown.size) console.warn("[cm-figures] no such figure: " + [...unknown].join(", ") + " — see build/case-flow/figures.cjs");
})();
`;

if (CHECK) {
  const have = fs.existsSync(OUT) ? fs.readFileSync(OUT, "utf8") : "";
  if (have !== file) {
    console.error("js/cm-figures.js is out of step with build/case-flow/figures.cjs.\nRun: node build/case-flow/figures/assemble.cjs");
    process.exit(1);
  }
  console.log(`The case's money in the program: ${Object.keys(T).length + Object.keys(P).length} tokens, the practice sheet's five stages, js/cm-figures.js in step (gross ${money(s.gross)} · open liens ${money(s.liensAudited)} · Track A ${money(s.A.net)} · Track B ${money(s.B.net)}).`);
} else {
  fs.writeFileSync(OUT, file);
  console.log(`wrote js/cm-figures.js: ${Object.keys(T).length + Object.keys(P).length} tokens, ${Object.keys(NS).length} practice-sheet stages`);
}
