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
const {spine, netSheet, check, RETIRED, money, tokens, PCT_TOKENS} = require("../../build/case-flow/figures.cjs");

const ROOT = path.resolve(__dirname, "../..");
const fails = [];

/* ---------- which files carry the course's content ---------- */
const DIRS = ["js", "build/case-flow", "documents/case-flow/html", "curriculum/5-day-flow", "build"];
const FILES = ["index.html", "README.md", "net-sheet.html", "case-doc.html"];
const EXT = /\.(js|cjs|mjs|json|html|md)$/;
// the machinery itself is not content: the spine, its generator and this check all name figures and tokens on purpose
const SKIP = /node_modules|\.git|build\/case-flow\/figures|check-figures\.cjs/;
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

/* ---------- 3 · the practice sheet grades the spine's figures, and states none of its own ---------- */
/* js/cm-net-sheet.js no longer types what a cell should hold: it looks the figure up in js/cm-figures.js, which
   build/case-flow/figures/assemble.cjs writes from the spine. So what is checked here is that the two agree about
   WHICH cells are graded — nothing graded that the spine does not compute, nothing computed that is not graded —
   and that no typed figure has crept back in. */
const NS = path.join(ROOT, "js/cm-net-sheet.js");
if (!fs.existsSync(NS)) fails.push("js/cm-net-sheet.js is missing: the practice sheet's graded figures cannot be checked");
else {
  const src = fs.readFileSync(NS, "utf8");
  const want = netSheet(s);
  if (/\{cell: "[A-Z]\d+", want:/.test(src))
    fails.push("js/cm-net-sheet.js: a check types its own figure (`want:`); the practice sheet must take it from js/cm-figures.js");
  for (const [stage, cells] of Object.entries(want)) {
    const open = src.indexOf(`\n  ${stage}: {`);
    if (open < 0) { fails.push(`js/cm-net-sheet.js: no ${stage} stage, but the spine computes one`); continue; }
    const rest = src.slice(open + 1);
    const next = rest.search(/\n  [a-z]+: \{\n? *file:/);
    const block = next > 0 ? rest.slice(0, next) : rest;
    const graded = new Set([...block.matchAll(/\{cell: "([A-Z]\d+)"/g)].map(m => m[1]));
    for (const cell of Object.keys(cells))
      if (!graded.has(cell)) fails.push(`js/cm-net-sheet.js ${stage}: ${cell} is not graded, but the spine computes it at ${money(cells[cell])}`);
    for (const cell of graded)
      if (!(cell in cells)) fails.push(`js/cm-net-sheet.js ${stage}: ${cell} is graded, but the spine computes no figure for it`);
  }
}

/* ---------- 4 · js/cm-figures.js is in step with the spine ---------- */
const GEN = path.join(ROOT, "js/cm-figures.js");
if (!fs.existsSync(GEN)) fails.push("js/cm-figures.js is missing: run node build/case-flow/figures/assemble.cjs");
else {
  const gen = fs.readFileSync(GEN, "utf8");
  for (const [name, value] of Object.entries(tokens(s))) {
    const m = new RegExp(`"${name}": (-?[0-9.]+)`).exec(gen);
    if (!m) fails.push(`js/cm-figures.js: no ${name}; run node build/case-flow/figures/assemble.cjs`);
    else if (Math.abs(Number(m[1]) - value) >= 0.005)
      fails.push(`js/cm-figures.js: ${name} is ${money(Number(m[1]))}, the spine computes ${money(value)}; run node build/case-flow/figures/assemble.cjs`);
  }
}

/* ---------- 5 · every token the content writes is one the spine knows ---------- */
const known = new Set([...Object.keys(tokens(s)), ...Object.keys(PCT_TOKENS(s))]);
for (const f of content) {
  if (f === "js/cm-figures.js" || f === "README.md") continue;
  const text = fs.readFileSync(path.join(ROOT, f), "utf8");
  for (const m of text.matchAll(/\{\{([a-zA-Z]+)\}\}/g))
    if (!known.has(m[1])) fails.push(`${f}: {{${m[1]}}} is not a figure the spine computes (build/case-flow/figures.cjs tokens())`);
}

/* ---------- report ---------- */
if (fails.length) {
  console.error(`${fails.length} problem(s):\n${fails.map((f, i) => `${i + 1}. ${f}`).join("\n")}\n`);
  console.error("The case's money is declared once, in build/case-flow/figures.cjs: change a fact there, move the figure everywhere it is stated, and add the old value to RETIRED.");
  process.exit(1);
}
console.log(`The content states the case's money as declared: ${content.length} files checked against ${RETIRED.length} retired figures, the Net Sheet's five stages graded on the spine (gross ${money(s.gross)} · open liens ${money(s.liensAudited)} · Track A ${money(s.A.net)} · Track B ${money(s.B.net)}).`);
