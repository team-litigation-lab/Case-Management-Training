#!/usr/bin/env node
/* Renders the John Doe v. Robert Smith case documents: documents/case-flow/html/RSNN.html (an HTML fragment) →
   the PDF the manifest names, under documents/case-flow/, with documents/case-flow/html/doc.css and the training footer on every page; RS03 (the editable CMS
   record) also goes to .docx through LibreOffice. The manifest is js/cm-case-flow-docs.js (window.CM_CF_DOCS).
     node build/case-flow/documents/render.cjs            render every document that has a source
     node build/case-flow/documents/render.cjs RS01 RS07  render only these
   Needs Playwright (NODE_PATH) and, for .docx, LibreOffice (soffice). Run it locally; CI only checks the files exist. */
const fs = require("fs"), path = require("path"), {execFileSync} = require("child_process");
const ROOT = path.resolve(__dirname, "../../.."), HERE = __dirname, SRC = path.join(ROOT, "documents/case-flow/html");
const {chromium} = require("playwright");
global.window = {};
require(path.join(ROOT, "js/cm-case-flow-docs.js"));
const DOCS = window.CM_CF_DOCS;
const css = fs.readFileSync(path.join(SRC, "doc.css"), "utf8");
/* The case's money is declared once (build/case-flow/figures.cjs): a document writes {{openLiens}} and the figure
   arrives here, the same way js/cm-figures.js substitutes it in the course and in case-doc.html. */
const FIG = require("../figures.cjs");
const FIGS = FIG.tokens(), FIGPCT = FIG.PCT_TOKENS(FIG.spine());
const figures = s => String(s).replace(/\{\{([a-zA-Z]+)\}\}/g, (whole, name) =>
  Object.prototype.hasOwnProperty.call(FIGS, name) ? FIG.money(FIGS[name])
  : Object.prototype.hasOwnProperty.call(FIGPCT, name) ? FIGPCT[name] + "%"
  : (console.warn(`[render] ${name} is not a figure the spine computes`), whole));
const want = process.argv.slice(2);
const footer = id => `<div style="width:100%;font:7px Arial,sans-serif;color:#555;padding:0 0.75in;display:flex;justify-content:space-between;">
  <span>LSH CASE MANAGEMENT TRAINING — SIMULATED DOCUMENT — FICTIONAL PARTIES — NOT A REAL RECORD · John Doe v. Robert Smith · ${id}</span>
  <span>page <span class="pageNumber"></span> of <span class="totalPages"></span></span></div>`;

(async () => {
  const browser = await chromium.launch(process.env.CHROMIUM_PATH ? {executablePath: process.env.CHROMIUM_PATH} : {});
  const page = await browser.newPage();
  let n = 0;
  for (const d of DOCS) {
    if (want.length && !want.includes(d.id)) continue;
    const src = path.join(SRC, d.id + ".html");
    if (!fs.existsSync(src)) { if (want.length) console.log(`${d.id}: no source (${path.relative(ROOT, src)})`); continue; }
    const body = figures(fs.readFileSync(src, "utf8"));
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>${d.id} ${d.title}</title><style>${css}</style></head><body>${body}</body></html>`;
    const out = path.join(ROOT, "documents", d.file.replace(/\.docx$/, ".pdf"));
    fs.mkdirSync(path.dirname(out), {recursive: true});
    await page.setContent(html, {waitUntil: "load"});
    const pdfOut = /\.docx$/.test(d.file) ? path.join(HERE, ".tmp", d.id + ".pdf") : out;
    fs.mkdirSync(path.dirname(pdfOut), {recursive: true});
    await page.pdf({path: pdfOut, format: "Letter", printBackground: true, displayHeaderFooter: true,
      headerTemplate: "<span></span>", footerTemplate: footer(d.id), margin: {top: "0.7in", bottom: "0.85in", left: "0.75in", right: "0.75in"}});
    if (/\.docx$/.test(d.file)) {   // the editable record: HTML → .docx with LibreOffice
      const tmp = path.join(HERE, ".tmp"), h = path.join(tmp, d.id + ".html");
      fs.writeFileSync(h, html);
      execFileSync("soffice", ["--headless", "--convert-to", "docx:MS Word 2007 XML", "--outdir", tmp, h], {stdio: "ignore"});
      const docxOut = path.join(ROOT, "documents", d.file);
      fs.mkdirSync(path.dirname(docxOut), {recursive: true});
      fs.copyFileSync(path.join(tmp, d.id + ".docx"), docxOut);
    }
    n++; console.log(`${d.id} → documents/${d.file}`);
  }
  await browser.close();
  console.log(`${n} document(s) rendered`);
})().catch(e => { console.error(e); process.exit(1); });
