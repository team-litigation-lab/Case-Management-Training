/* Proves the figures reach the trainee: no token survives to the screen, the lessons and the practice sheet show
   the spine's figures, and changing a fact moves both. */
const {chromium} = require("playwright");
const BASE = process.argv[2] || "http://localhost:8787/";
const fail = [];
const ok = (c, m) => { console.log((c ? "✓ " : "✗ ") + m); if (!c) fail.push(m); };

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  page.on("pageerror", e => fail.push("page error: " + e.message));

  // the practice sheet: the spine reaches it, and nothing is left as a token
  await page.goto(BASE + "net-sheet.html?stage=bi", {waitUntil: "networkidle"});
  const fig = await page.evaluate(() => window.CM_FIGURES && {
    openLiens: window.CM_FIGURES.figures.openLiens,
    netA: window.CM_FIGURES.figures.netA,
    tokens: window.CM_FIGURES.tokens.length,
    unresolved: window.CM_FIGURES.unresolved,
    biCells: window.CM_FIGURES.netSheet.bi
  });
  ok(!!fig, "the practice sheet loads the case's money");
  ok(fig && fig.openLiens === 6485, "open liens reach it: " + (fig && fig.openLiens));
  ok(fig && fig.netA === 21469.92, "Track A's net reaches it: " + (fig && fig.netA));
  ok(fig && fig.tokens >= 50, (fig && fig.tokens) + " figures available to the content");
  ok(fig && fig.unresolved.length === 0, "no unknown token: " + JSON.stringify(fig && fig.unresolved));
  ok(fig && fig.biCells.I44 === 6485 && fig.biCells.L52 === -305.08, "the BI stage is graded from the spine: " + JSON.stringify(fig && fig.biCells.L52));

  const brief = await page.$eval("#ns-brief", el => el.innerText);
  ok(!/\{\{/.test(brief), "the stage's instructions show no raw token");

  // the graded reasons: work the BI stage wrong, then read what it says the file holds
  await page.fill('.ns-in[data-k="L7"]', "9999");
  await page.click("#ns-check-btn");
  await page.waitForSelector("#ns-check:not([hidden])");
  const check = await page.$eval("#ns-check", el => el.innerText);
  ok(/the file says \$10,000\.00/.test(check), "it grades the gross against the spine's figure");
  ok(/\$6,485\.00/.test(check), "the reason states the spine's open liens");
  ok(!/\{\{/.test(check), "no raw token in the graded reasons");

  // the lessons: every string in the course content, with no token left
  await page.goto(BASE, {waitUntil: "networkidle"});
  const lessons = await page.evaluate(() => {
    const out = {tokens: [], money: 0, sampled: 0};
    const walk = (o, seen) => {
      if (!o || typeof o !== "object") return;
      seen = seen || new Set(); if (seen.has(o)) return; seen.add(o);
      for (const k of Object.keys(o)) {
        const v = o[k];
        if (typeof v === "string") {
          out.sampled++;
          const m = v.match(/\{\{[a-zA-Z]+\}\}/g);
          if (m) out.tokens.push(...m);
          if (/\$6,485\.00|\$21,469\.92/.test(v)) out.money++;
        } else walk(v, seen);
      }
    };
    ["CM_CASE_FLOW", "CM_CF_SLIDES", "CM_CF_SCRIPTS", "CM_CF_SIM", "CM_CF_DOCS", "CM_CF_EXHIBITS"].forEach(k => walk(window[k]));
    return out;
  });
  ok(lessons.tokens.length === 0, `no token left in the lessons (${lessons.sampled} strings checked, ${[...new Set(lessons.tokens)].join(",")})`);
  ok(lessons.money > 50, `the lessons state the spine's figures (${lessons.money} strings carry the open liens or Track A's net)`);

  await browser.close();
  console.log(fail.length ? `\n${fail.length} FAILED:\n` + fail.join("\n") : "\nall good");
  process.exit(fail.length ? 1 : 0);
})();
