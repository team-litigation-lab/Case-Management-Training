// Checks the Case Flow's date roll-forward (js/cm-case-dates.js) against every word of the case: the course
// content (data, slides, simulation, document list) and the 60 case documents (documents/case-flow/html/).
// For the base year and each future year the case can move to:
//   · every weekday written beside a date is that date's weekday (deadline drills, the Sunday SOL);
//   · the SOL is still exactly DOL + 2 years; Labor Day and Memorial Day are still those holidays;
//   · moved far ahead, no date is left behind (a date form the roll-forward doesn't know fails here);
//   · the year switch date is the end of Day 1's case events.
//     node .github/scripts/check-case-dates.mjs
import fs from "node:fs";
import path from "node:path";
import vm from "node:vm";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "../..");
const ctx = {window: {}, location: {search: ""}, URLSearchParams,
  sessionStorage: {getItem: () => null, setItem() {}, removeItem() {}}, localStorage: {getItem: () => null, setItem() {}}};
vm.createContext(ctx);
for (const f of ["cm-case-flow-docs.js", "cm-case-flow-slides.js", "cm-case-flow-scripts.js", "cm-case-flow-sim.js", "cm-case-flow-data.js", "cm-case-dates.js"])
  vm.runInContext(fs.readFileSync(path.join(ROOT, "js", f), "utf8"), ctx, {filename: f});
const W = ctx.window, D = W.CM_CASE_DATES;
const fails = [];

// every string of the course content, and every case document
const strings = [];
const walk = (o, at) => { if (typeof o === "string") strings.push([at, o]); else if (o && typeof o === "object") for (const [k, v] of Object.entries(o)) if (!["id", "file", "folder", "image", "kind", "cms", "tool"].includes(k)) walk(v, at + "." + k); };
for (const k of ["CM_CASE_FLOW", "CM_CF_SLIDES", "CM_CF_SIM", "CM_CF_DOCS", "CM_CF_SCRIPTS"]) walk(W[k], k);
const HTML = path.join(ROOT, "documents/case-flow/html");
for (const f of fs.readdirSync(HTML).filter(f => /^RS\d\d\.html$/.test(f))) strings.push([f, fs.readFileSync(path.join(HTML, f), "utf8")]);
if (strings.filter(([a]) => /^RS/.test(a)).length !== W.CM_CF_DOCS.length) fails.push(`documents/case-flow/html has ${strings.filter(([a]) => /^RS/.test(a)).length} documents; the manifest lists ${W.CM_CF_DOCS.length}`);

const plain = s => s.replace(/<[^>]+>/g, " ").replace(/&nbsp;/g, " ").replace(/&amp;/g, "&").replace(/\s+/g, " ");
const WD = ["sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday"];
const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const wd = w => WD.findIndex(x => x.startsWith(w.toLowerCase().slice(0, 3)));
const dow = (y, m, d) => new Date(Date.UTC(y, m - 1, d)).getUTCDay();
const DATE = "(\\d{1,2})/(\\d{1,2})/(\\d{4})|(January|February|March|April|May|June|July|August|September|October|November|December) (\\d{1,2}),? (\\d{4})";
const DAYW = "(Sunday|Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sun|Mon|Tue|Tues|Wed|Thu|Thur|Thurs|Fri|Sat)";
const before = new RegExp(`\\b${DAYW},? (?:${DATE})`, "gi");
const after = new RegExp(`(?:${DATE}),? \\(?(?:is |was |falls on |lands on |reads )?an? ${DAYW}\\b`, "gi");
function weekdays(s, where, label) {
  const t = plain(s); let m;
  const check = (w, mm, dd, yy, mon, md, my, at) => {
    const [y, mo, d] = mm ? [+yy, +mm, +dd] : [+my, MONTHS.indexOf(mon.toLowerCase()) + 1, +md];
    if (dow(y, mo, d) !== wd(w)) fails.push(`${label}: ${where}: "${t.slice(Math.max(0, at - 10), at + 60)}" — ${String(mo).padStart(2, "0")}/${String(d).padStart(2, "0")}/${y} is a ${WD[dow(y, mo, d)]}`);
  };
  while ((m = before.exec(t))) check(m[1], m[2], m[3], m[4], m[5], m[6], m[7], m.index);
  while ((m = after.exec(t))) check(m[7], m[1], m[2], m[3], m[4], m[5], m[6], m.index);
}
const parse = s => { const [m, d, y] = s.split("/").map(Number); return [y, m, d]; };

const years = [D.base, 2029, 2030, 2033, 2034, 2037, 2038, 2041];
for (const Y of years) {
  const S = D.shiftFor(Y);
  if (S == null) { fails.push(`${Y} should be a year the case can move to`); continue; }
  for (const [where, s] of strings) weekdays(D.text(s, S), where, `case year ${Y}`);
  const [dy, dm, dd] = parse(D.text("02/06/2026", S)), [sy, sm, sd] = parse(D.text("02/06/2028", S));
  if (!(sy === dy + 2 && sm === dm && sd === dd)) fails.push(`case year ${Y}: SOL ${D.text("02/06/2028", S)} isn't DOL ${D.text("02/06/2026", S)} + 2 years`);
  if (dow(dy, dm, dd) !== 5 || dy !== Y) fails.push(`case year ${Y}: the collision ${D.text("02/06/2026", S)} isn't a Friday in ${Y}`);
  const [ly, lm, ld] = parse(D.text("09/07/2026", S)), [my, mm, md] = parse(D.text("05/31/2027", S));
  if (!(lm === 9 && ld <= 7 && dow(ly, lm, ld) === 1)) fails.push(`case year ${Y}: Labor Day 09/07/2026 → ${D.text("09/07/2026", S)}, not the first Monday of September`);
  if (!(mm === 5 && md >= 25 && dow(my, mm, md) === 1)) fails.push(`case year ${Y}: Memorial Day 05/31/2027 → ${D.text("05/31/2027", S)}, not the last Monday of May`);
}
for (const Y of [2027, 2028, 2031, 2032]) if (D.shiftFor(Y) != null) fails.push(`${Y} must not be a case year: the two-year SOL would cross 02/29`);

// moved ten thousand years ahead every year has five digits, so a four-digit year left is a date not moved
const FAR = 12029, SF = D.shiftFor(FAR), left = new Map();
for (const [where, s] of strings) {
  const t = plain(D.text(s, SF)), r = /\b(19\d\d|20\d\d)\b/g; let m;
  while ((m = r.exec(t))) { if (/^\s*[×x]\s*\d/.test(t.slice(m.index + 4)) || /\b(?!LSH)[A-Z]{2,4}-$/.test(t.slice(0, m.index))) continue; const c = t.slice(Math.max(0, m.index - 40), m.index + 30); left.set(c, where); }
}
for (const [c, where] of left) fails.push(`a date wasn't moved (${where}): "…${c}…"`);

// the year switch: once the case's Day 1 events (through 02/11) are past
const day1 = new Set((W.CM_CASE_FLOW.sequence.find(d => d.n === 1) || {phases: []}).phases.flatMap(p => p.blocks));
const last = Object.entries(W.CM_CF_SIM.events).filter(([id]) => day1.has(id)).map(([, e]) => parse(e.date)).sort((a, b) => Date.UTC(...a) - Date.UTC(...b)).pop();
if (!last || last.join("-") !== "2026-2-11") fails.push(`Day 1's last case event is ${last && last.join("-")}; js/cm-case-dates.js switches years after 02/11/2026: update BASE_DAY1_END`);
if (D.freshYear(new Date(Date.UTC(2029, 2, 12))) !== 2029 || D.freshYear(new Date(Date.UTC(2029, 0, 15))) !== 2026 || D.freshYear(new Date(Date.UTC(2031, 5, 1))) !== 2030)
  fails.push("freshYear picks the wrong case year");

if (fails.length) { console.log(`${fails.length} problem(s):`); fails.slice(0, 80).forEach((f, i) => console.log(`${i + 1}. ${f}`)); process.exit(1); }
console.log(`Case dates: ${strings.length} texts roll forward cleanly to ${years.join(", ")} (weekdays, SOL, holidays) and nothing is left behind.`);
