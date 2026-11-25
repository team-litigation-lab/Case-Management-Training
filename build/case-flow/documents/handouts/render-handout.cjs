#!/usr/bin/env node
/* Renders the Operational Conflict Resolution training handout:
   build/case-flow/documents/handouts/OPERATIONAL_CONFLICT_RESOLUTION_INTAKE_PLANNING_TREATMENT.html (styled with documents/case-flow/html/doc.css)
   → documents/handouts/OPERATIONAL_CONFLICT_RESOLUTION_INTAKE_PLANNING_TREATMENT.pdf
     NODE_PATH=<playwright node_modules> CHROMIUM_PATH=<chrome> node build/case-flow/documents/handouts/render-handout.cjs */
const path = require("path"), {pathToFileURL} = require("url");
const {chromium} = require("playwright");
const ROOT = path.resolve(__dirname, "../../../..");
const NAME = "OPERATIONAL_CONFLICT_RESOLUTION_INTAKE_PLANNING_TREATMENT";
const src = path.join(__dirname, NAME + ".html");
const out = path.join(ROOT, "documents/handouts", NAME + ".pdf");
const footer = `<div style="width:100%;font:7.5px Arial,sans-serif;color:#555;padding:0 0.75in;text-align:center;">
  LSH Case Management Training · Training handout · page <span class="pageNumber"></span> of <span class="totalPages"></span></div>`;

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {});
  const page = await browser.newPage();
  await page.goto(pathToFileURL(src).href, {waitUntil: "load"});
  await page.pdf({path: out, format: "Letter", printBackground: true, displayHeaderFooter: true,
    headerTemplate: "<span></span>", footerTemplate: footer,
    margin: {top: "0.75in", bottom: "0.85in", left: "0.75in", right: "0.75in"}});
  await browser.close();
  console.log("→ " + path.relative(ROOT, out));
})().catch(e => { console.error(e); process.exit(1); });
