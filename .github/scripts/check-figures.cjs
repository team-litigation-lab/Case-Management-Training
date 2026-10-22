#!/usr/bin/env node
/* Holds the course's content to the case's money (build/case-flow/figures.cjs).
       node .github/scripts/check-figures.cjs
   Three things, and deliberately only three:

   1. The spine adds up. figures.cjs derives every total, net and share from the
      facts a document proves, and its own check proves the arithmetic.

   2. No file states a retired figure. Every figure the spine has superseded is
      listed in figures.cjs RETIRED with the reason, and a file that still
      carries one fails here with that reason. This is the check that matters:
      the course's money lives as typed strings in thirty-odd files, and what
      goes wrong in practice is not a wrong sum but a stale copy — a binder
      written against last month's file, a blanket rename that misses the
      glossary, a hand-written note nobody regenerates.

   3. The figures the Net Sheet grades are the spine's. js/cm-net-sheet.js is
      the one place a trainee's arithmetic is marked right or wrong, so each
      stage's `want:` is read out of the file and compared with what the spine
      computes for that cell.

   What it does NOT do: police every dollar in the course. Premiums, policy
   limits, PD figures, Bates ranges and page counts are facts of their own, and
   a document is free to state them. Extend RETIRED when a spine figure moves;
   that is what keeps the old value from coming back. */
"use strict";
const fs = require("fs");
const path = require("path");
const {spine, netSheet, check, RETIRED, money} = require("../../build/case-flow/figures.cjs");

const ROOT = path.resolve(__dirname, "../..");
const fails = [];

/* ---------- which files carry the course's content ---------- */
const DIRS = ["js", "build/case-flow", "documents/case-flow/html", "curriculum/5-day-flow", "build"];
const FILES = ["index.html", "README.md", "net-sheet.html", "case-doc.html"];
const EXT = /\.(js|cjs|mjs|json|html|md)$/;
const SKIP = /node_modules|\.git|build\/case-flow\/figures\.cjs|check-figures\.cjs/;
function walk(dir, out = []) {
  for (const e of fs.readdirSync(path.join(ROOT, dir), {withFileTypes: true})) {
    const rel = path.join(dir, e.name);
    if (SKIP.test(rel)) continue;
    if (e.isDirectory()) walk(rel, out);
    else if (EXT.test(e.name)) out.push(rel);
  }
  return out;
}
const content = [...new Set([...DIRS.flatMap(d => walk(d)), ...FILES])].filter(f => fs.existsSync(path.join(ROOT, f)));

/* ---------- 1 · the spine adds up ---------- */
const s = spine();
for (const f of check(s)) fails.push(`the case's money: ${f}`);

/* ---------- 2 · no file states a retired figure ---------- */
let retiredHits = 0;
for (const f of content) {
  const text = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const [fig, why] of RETIRED) {
    if (!text.includes(fig)) continue;
    const line = text.slice(0, text.indexOf(fig)).split("\n").length;
    fails.push(`${f}:${line}: ${fig} is retired — ${why}`);
    retiredHits++;
  }
}

/* ---------- 3 · the Net Sheet grades the spine's figures ---------- */
const NS = path.join(ROOT, "js/cm-net-sheet.js");
if (!fs.existsSync(NS)) fails.push("js/cm-net-sheet.js is missing: the Net Sheet's graded figures cannot be checked");
else {
  const src = fs.readFileSync(NS, "utf8");
  const want = netSheet(s);
  let checked = 0;
  for (const [stage, cells] of Object.entries(want)) {
    // the stage's own block, from its key to the next stage key or the end of STAGES
    const open = src.indexOf(`\n  ${stage}: {`);
    if (open < 0) { fails.push(`js/cm-net-sheet.js: no ${stage} stage, but the spine computes one`); continue; }
    const rest = src.slice(open + 1);
    const next = rest.search(/\n  [a-z]+: \{\n? *file:/);
    const block = next > 0 ? rest.slice(0, next) : rest;
    for (const [cell, value] of Object.entries(cells)) {
      const m = new RegExp(`\\{cell: "${cell}", want: (-?[0-9.]+)`).exec(block);
      if (!m) { fails.push(`js/cm-net-sheet.js ${stage}: no check on ${cell}, which the spine puts at ${money(value)}`); continue; }
      checked++;
      if (Math.abs(Number(m[1]) - value) >= 0.005)
        fails.push(`js/cm-net-sheet.js ${stage}: ${cell} is graded at ${money(Number(m[1]))}, the spine computes ${money(value)}`);
    }
  }
  if (checked < 20) fails.push(`js/cm-net-sheet.js: only ${checked} graded figures matched the spine; expected the five stages' checks`);
}

/* ---------- report ---------- */
if (fails.length) {
  console.error(`${fails.length} problem(s):\n${fails.map((f, i) => `${i + 1}. ${f}`).join("\n")}\n`);
  console.error("The case's money is declared once, in build/case-flow/figures.cjs: change a fact there, move the figure everywhere it is stated, and add the old value to RETIRED.");
  process.exit(1);
}
console.log(`The content states the case's money as declared: ${content.length} files checked against ${RETIRED.length} retired figures, the Net Sheet's five stages graded on the spine (gross ${money(s.gross)} · open liens ${money(s.liensAudited)} · Track A ${money(s.A.net)} · Track B ${money(s.B.net)}).`);
