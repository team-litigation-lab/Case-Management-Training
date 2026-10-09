/* ============================================================
   📄 Drafting Tools — HIPAA Drafting (#/hipaa)
   Loaded after js/cm-hipaa-data.js (the one authorization-form template).
   Formatted like the LOR and Med Provider Drafting tools: the firm's own wording, read block by
   block, with only the fill-in lines editable. Unlike those two, there is nothing to assign — every
   trainee drafts the same HIPAA authorization form, the firm's own template, straight away.

   A STANDALONE activity — nothing here opens or touches the CMS; see NO_CASE_FILE below. The
   acknowledgement date, signature and "Relationship to Patient" line are the client's to complete
   and sign, not the VA's, so they stay fixed, uneditable text — the trainee drafts the form up to
   the point it's ready to send the client for signature.

   Shared storage key (rules in worker.js):
     hipaa:<traineeId>   the trainee's own draft (they read and write their own)
   ============================================================ */
(function(){
"use strict";
if(!window.CM_HIPAA_TEMPLATE) return;

const TPL = window.CM_HIPAA_TEMPLATE;
const e = v => esc(String(v == null ? "" : v));
const isTrainee = () => !!state.traineeId && !state.isAdmin;
const adminOn = () => !!state.isAdmin && !state.adminPreview;
const NO_CASE_FILE = "Do <b>not</b> create a case file in the CMS for this activity, and do not link it to any case file. This is a standalone drafting exercise: draft the form here and download it.";

const H = {id:null, draft:null, loading:false, err:"", timer:null, saving:false, savedAt:null};
const blank = () => ({v:1, fields:{}, checks:{}, updatedAt:""});

async function load(id){
  H.loading = true; H.err = ""; H.id = id;
  try{
    const d = await sharedGet("hipaa:" + id);
    H.draft = (d && typeof d === "object") ? d : blank();
  }catch(err){ H.err = "Couldn’t load your drafting activity. Check your connection and try again."; }
  H.loading = false;
  if(state.view === "hipaa") render();
}
function paintSave(ok){
  const el = document.getElementById("hipaaSave");
  if(el) el.textContent = H.saving ? "Saving…" : (ok === false ? "⚠ Not saved. Check your connection." : (H.savedAt ? "All changes saved" : ""));
}
function queueSave(){
  if(!state.traineeId) return;
  H.draft.updatedAt = new Date().toISOString();
  clearTimeout(H.timer); H.saving = true; paintSave();
  H.timer = setTimeout(async () => {
    const ok = await sharedSet("hipaa:" + H.id, H.draft);
    H.saving = false; H.savedAt = ok === false ? null : new Date(); paintSave(ok);
  }, 900);
}

const letterDate = () => new Date().toLocaleDateString("en-US", {year:"numeric", month:"long", day:"numeric"});
const fileDate = () => { const d = new Date(), p = n => String(n).padStart(2, "0"); return `${p(d.getMonth() + 1)}.${p(d.getDate())}.${d.getFullYear()}`; };
function fileNameFor(){
  const who = String(state.certName || state.traineeName || "VA’s name").replace(/[\\/:*?"<>|]/g, "").trim();
  const provider = String((H.draft && H.draft.fields.f6) || "Provider or Facility Name").replace(/[\\/:*?"<>|]/g, "").trim();
  return `HIPAA – ${provider} ${fileDate()} (${who})`;
}

function fixed(run){
  let html = "";
  String(run.x).split(/(\t|\n)/).forEach(part => {
    if(part === "\t") html += `<span class="lorl-tab"></span>`;
    else if(part === "\n") html += "<br>";
    else if(part) html += e(part);
  });
  return run.b ? `<b>${html}</b>` : html;
}
function field(run){
  const v = H.draft.fields[run.f];
  const set = v != null && String(v).trim() !== "";
  const arg = `'${run.f}'`;
  if(run.k === "date")
    return `<span class="lorl-auto" title="Auto-generated: dated the day it is drafted">${e(letterDate())}</span>`;
  return `<input class="lorl-in${set ? " set" : ""}" value="${e(v || "")}" placeholder="${e(run.ph)}"
    size="${Math.max(12, Math.min(64, run.ph.length))}" aria-label="${e(run.ph)}" oninput="CMHipaa.set(${arg}, this.value)">`;
}
function renderLetter(){
  return `<div class="lorl">` + TPL.blocks.map(b => {
    if(b.t === "tbl")
      return `<table class="lorl-tbl"><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${e(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    const inner = b.runs.map(r => r.f ? field(r) : fixed(r)).join("");
    const cls = "lorl-p" + (b.n ? " lorl-num" : "") + (b.c ? " lorl-mid" : "");
    return `<p class="${cls}">${inner || "&nbsp;"}</p>`;
  }).join("") + `</div>`;
}
function letterLines(){
  return TPL.blocks.map(b => {
    if(b.t === "tbl") return b.rows.map(r => r.filter(Boolean).join("  ")).join("\n");
    let s = "", item = 0;
    b.runs.forEach(r => {
      if(r.f){
        if(r.k === "date") s += letterDate();
        else s += (H.draft.fields[r.f] || r.ph);
        return;
      }
      s += r.x;
    });
    if(b.n) s = "• " + s;
    return s.replace(/\t/g, "    ");
  });
}

function notice(){
  return `<div class="lor-warn" role="note"><span class="lor-warn-ic">⚠</span><div><b class="lor-warn-h">Standalone activity — no CMS case file.</b><p>${NO_CASE_FILE}</p></div></div>`;
}
function steps(){
  const list = [
    "Fill in the patient's identifying information and, at the top, their full legal name.",
    "Section I: enter the name of the provider or facility you are sending this authorization to.",
    "Section II: enter the date of the injury or accident (the records requested run from that date to present).",
    "Section V: the \"valid beginning on\" date is filled in for you and is always today; enter that same date again for \"expires 5 years from\".",
    "Leave the Date, Signature and Relationship to Patient lines at the bottom blank — the client completes and signs those, not you."];
  return `<details class="card lor-steps"><summary>📋 Instructions for this activity</summary><ol>${list.map(x => `<li>${x}</li>`).join("")}</ol></details>`;
}
function renderPage(){
  if(!state.traineeId && !state.isAdmin && !state.adminPreview) return `<div class="card" style="padding:28px;">Sign in to open the HIPAA Drafting tool.</div>`;
  if(adminOn()){
    if(!H.draft) H.draft = blank();
    return `<div class="lor-hero"><p class="lor-eyebrow">📄 Drafting Tools</p><h1>HIPAA Drafting</h1>
        <p>Every trainee drafts the same HIPAA authorization form, the firm's own template — there is nothing to assign.</p>
        <button class="btn btn-ghost btn-sm" type="button" onclick="goto('drafting')">← Back to Drafting Tools</button></div>
      ${notice()}
      <section class="card lor-preview"><h2>👁 The activity as a trainee sees it</h2>${steps()}
        <div class="card lor-paper">${renderLetter()}</div></section>`;
  }
  if(H.id !== state.traineeId && !H.loading) load(state.traineeId);
  if(H.err) return `<div class="card" style="padding:28px;">${e(H.err)} <button class="btn btn-ghost btn-sm" onclick="CMHipaa.reload()">Try again</button></div>`;
  if(!H.draft) return `<div class="card" style="padding:28px;">Loading your drafting activity…</div>`;
  const preview = (state.adminPreview && !state.traineeId)
    ? `<div class="card lor-preview-note">👁 <b>Trainee view</b> — this is the page as a trainee sees it. Nothing you type here is saved; a trainee drafts on their own account.</div>` : "";
  return `${preview}<div class="lor-hero"><p class="lor-eyebrow">📄 Drafting Tools</p><h1>HIPAA Drafting</h1>
      <p>Draft the HIPAA Compliant Authorization Form, in the firm's own template, ready for the client to sign.</p>
      <button class="btn btn-ghost btn-sm" type="button" onclick="goto('drafting')">← Back to Drafting Tools</button></div>
    ${notice()}${steps()}
    <section class="lor-ed"><div class="card lor-paper">${renderLetter()}</div>
      <div class="lor-actions">
        <button class="btn btn-navy" type="button" onclick="CMHipaa.pdf()">⬇ Download the form (PDF)</button>
        <button class="btn btn-ghost" type="button" onclick="CMHipaa.word()">⬇ Download as Word</button>
        <button class="btn btn-ghost btn-sm" type="button" onclick="CMHipaa.copyName()">📋 Copy the file name</button>
        <span class="lor-save" id="hipaaSave"></span></div>
      <p class="lor-muted lor-naming">File name: <code>${e(fileNameFor())}</code></p></section>`;
}

const pdfSafe = s => String(s == null ? "" : s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/[–—]/g, "-").replace(/[^\x00-\xff]/g, "").replace(/ {2,}/g, m => m);
async function makePdf(name, lines){
  if(typeof ensureJsPdf !== "function" || !(await ensureJsPdf())){ toast("Couldn’t load the PDF maker. Check your connection and try again."); return; }
  const {jsPDF} = window.jspdf, doc = new jsPDF({unit:"pt", format:"letter"});
  const M = 64, W = doc.internal.pageSize.getWidth() - M * 2, BOT = doc.internal.pageSize.getHeight() - M;
  let y = M;
  doc.setFont("times", "normal").setFontSize(11);
  lines.forEach(line => {
    const txt = pdfSafe(line);
    if(!txt.trim()){ y += 11; return; }
    doc.splitTextToSize(txt, W).forEach(row => {
      if(y > BOT){ doc.addPage(); y = M; }
      doc.text(row, M, y); y += 14;
    });
    y += 4;
  });
  doc.save(name.replace(/[\\/:*?"<>|]/g, "") + ".pdf");
}
function makeWord(name, lines){
  const body = lines.map(l => l.trim() ? `<p>${e(l).replace(/ {2,}/g, m => "&nbsp;".repeat(m.length))}</p>` : "<p>&nbsp;</p>").join("");
  const html = `<html xmlns:w="urn:schemas-microsoft-com:office:word"><head><meta charset="utf-8"><title>${e(name)}</title>
    <style>@page{margin:1in;} body{font-family:'Times New Roman',serif;font-size:11pt;} p{margin:0 0 6pt;}</style></head><body>${body}</body></html>`;
  const a = document.createElement("a");
  a.href = URL.createObjectURL(new Blob(["﻿" + html], {type:"application/msword"}));
  a.download = name.replace(/[\\/:*?"<>|]/g, "") + ".doc";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(a.href), 4000);
}

window.CMHipaa = {
  reload(){ H.id = null; H.draft = null; H.err = ""; render(); },
  set(f, v){ H.draft.fields[f] = v; H.draft.updatedAt = new Date().toISOString(); queueSave(); },
  copyName(){
    (navigator.clipboard ? navigator.clipboard.writeText(fileNameFor()) : Promise.reject())
      .then(() => toast("Copied the file name."), () => toast("Couldn’t copy. Select the name instead."));
  },
  async pdf(){ await makePdf(fileNameFor(), letterLines()); },
  word(){ makeWord(fileNameFor(), letterLines()); }
};

/* ---------- wiring into the engine ---------- */
const __renderCmHipaa = window.render;
window.render = function(){
  if(state.view !== "hipaa") return __renderCmHipaa.apply(this, arguments);
  if(!state.traineeId && !state.isAdmin && !state.adminPreview){ state.view = "dashboard"; return __renderCmHipaa.apply(this, arguments); }
  const app = document.getElementById("app");
  app.innerHTML = renderTopbar() + `<main class="main-lor">${renderPage()}</main>` + renderFooter();
  paintSave();
  try{ afterRender(); }catch(err){}
};
window.cmHipaaCard = function(){
  return `<div class="card fts-card"><h3>🔏 HIPAA Drafting</h3>
    <p class="fts-note">Draft the HIPAA Compliant Authorization Form, in the firm's own template, ready for the client to sign. A standalone activity — no CMS case file.</p>
    <div class="fts-tool-act"><button class="btn btn-navy btn-sm" type="button" onclick="goto('hipaa')">Open HIPAA Drafting</button></div></div>`;
};
})();
