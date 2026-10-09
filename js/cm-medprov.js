/* ============================================================
   📄 Drafting Tools — Med Provider Drafting (#/medprov)
   Loaded after js/cm-medprov-data.js (one entry per medical provider, plus the shared HITECH example).
   Formatted like the LOR Drafting tool (js/cm-lor.js): the firm's own templates, read block by block,
   with only what the firm highlighted in yellow editable.

   A STANDALONE activity — nothing here opens or touches the CMS; see NO_CASE_FILE below.
     • The trainer assigns one medical provider per trainee (Assign providers, admins only), out of
       the 32 the firm sent letters for. Until they do, the trainee sees what to ask for.
     • The trainee drafts whichever of the Lien Balance Verification and Medical LOR letters the
       firm sent for that provider — each one exactly as the firm wrote it for that provider,
       including the provider's own address block. Only the client's own details (date, DOB, SS No.,
       Date of Loss, initials) are editable; the provider's own "complete and return" blanks and the
       Unsworn Declaration a provider's custodian of records signs stay fixed, uneditable text.
     • A third tab, HITECH Records Request, is always available: the one HITECH example the firm
       sent (Apache Health Center) — a reference activity, not switched per assigned provider.
     • ⬇ Download gives the edited letter as a PDF or a Word file, named by the naming convention
       in each template.

   Shared storage keys (rules in worker.js):
     medprov:<traineeId>        the trainee's own drafts (they read and write their own)
     medprovassign:<traineeId>  the provider their trainer assigned (the trainee reads it, only admins write it)
   ============================================================ */
(function(){
"use strict";
if(!window.CM_MEDPROV_PROVIDERS || !window.CM_MEDPROV_HITECH) return;

const PROVIDERS = window.CM_MEDPROV_PROVIDERS, HITECH = window.CM_MEDPROV_HITECH;
const KIND_LABEL = {lienbv:"Lien Balance Verification", medlor:"Medical LOR with Unsworn Declaration", hitech:"HITECH Records Request"};
const e = v => esc(String(v == null ? "" : v));
const isTrainee = () => !!state.traineeId && !state.isAdmin;
const adminOn = () => !!state.isAdmin && !state.adminPreview;
const NO_CASE_FILE = "Do <b>not</b> create a case file in the CMS for this activity, and do not link it to any case file. This is a standalone drafting exercise: draft the letters here and download them.";

const providerOf = id => PROVIDERS.find(p => p.id === id) || null;
// Every kind this provider has a real letter for, plus the shared HITECH example, in a fixed order.
function kindsFor(provider){
  const ks = ["lienbv", "medlor"].filter(k => provider && provider.letters[k]);
  ks.push("hitech");
  return ks;
}
function templateFor(provider, kind){
  if(kind === "hitech") return HITECH;
  const blocks = provider && provider.letters[kind];
  return blocks ? {id:kind, title:KIND_LABEL[kind], naming:providerNaming(provider, kind), blocks} : null;
}
function providerNaming(provider, kind){
  return `MED – ${provider.name} - ${kind === "lienbv" ? "Lien BV" : "MedLOR"} mm.dd.yyyy (VA's name)`;
}

/* ---------- the trainee's drafts and the provider their trainer assigned ---------- */
const L = {id:null, draft:null, assign:null, loading:false, err:"", timer:null, saving:false, savedAt:null, tab:null};
const blank = () => ({v:1, letters:{}, updatedAt:""});
function letter(kind){ const ls = L.draft.letters; return ls[kind] || (ls[kind] = {fields:{}, checks:{}, updatedAt:""}); }

async function load(id){
  L.loading = true; L.err = ""; L.id = id;
  try{
    const [d, a] = await Promise.all([sharedGet("medprov:" + id), sharedGet("medprovassign:" + id)]);
    L.draft = (d && typeof d === "object") ? d : blank();
    if(!L.draft.letters) L.draft.letters = {};
    L.assign = (a && typeof a === "object") ? a : null;
  }catch(err){ L.err = "Couldn’t load your drafting activity. Check your connection and try again."; }
  L.loading = false;
  if(state.view === "medprov") render();
}
function paintSave(ok){
  const el = document.getElementById("mpSave");
  if(el) el.textContent = L.saving ? "Saving…" : (ok === false ? "⚠ Not saved. Check your connection." : (L.savedAt ? "All changes saved" : ""));
}
function queueSave(){
  if(!state.traineeId) return;
  L.draft.updatedAt = new Date().toISOString();
  clearTimeout(L.timer); L.saving = true; paintSave();
  L.timer = setTimeout(async () => {
    const ok = await sharedSet("medprov:" + L.id, L.draft);
    L.saving = false; L.savedAt = ok === false ? null : new Date(); paintSave(ok);
  }, 900);
}

/* ---------- the assigned provider ---------- */
function myProvider(){
  if(adminOn()) return providerOf(state.medprovPreviewProvider) || PROVIDERS[0];
  const id = L.assign && L.assign.provider;
  return id ? providerOf(id) : null;
}

/* ---------- the letter's date: auto-generated, always today ---------- */
const letterDate = () => new Date().toLocaleDateString("en-US", {year:"numeric", month:"long", day:"numeric"});
const fileDate = () => { const d = new Date(), p = n => String(n).padStart(2, "0"); return `${p(d.getMonth() + 1)}.${p(d.getDate())}.${d.getFullYear()}`; };
function fileNameFor(tpl, provider){
  const who = String(state.certName || state.traineeName || "VA’s name").replace(/[\\/:*?"<>|]/g, "").trim();
  return tpl.naming.replace("mm.dd.yyyy", fileDate()).replace("(VA's name)", `(${who})`);
}

/* ---------- the letter, as the firm wrote it (shared with the LOR tool's convention) ---------- */
function fixed(run, ctx){
  let html = "";
  String(run.x).split(/(\t|\n|☐)/).forEach(part => {
    if(part === "\t") html += `<span class="mpl-tab"></span>`;
    else if(part === "\n") html += "<br>";
    else if(part === "☐") html += box(ctx);
    else if(part) html += e(part);
  });
  return run.b ? `<b>${html}</b>` : html;
}
function box(ctx){
  const id = "cb" + (ctx.box++), on = !!ctx.L.checks[id];
  return `<button type="button" role="checkbox" aria-checked="${on}" class="mpl-box${on ? " on" : ""}" title="Tick this"
    onclick="CMMedprov.tick('${ctx.kind}','${id}')">${on ? "☒" : "☐"}</button>`;
}
function field(run, ctx){
  const v = ctx.L.fields[run.f];
  const set = v != null && String(v).trim() !== "";
  const arg = `'${ctx.kind}','${run.f}'`;
  if(run.k === "date")
    return `<span class="mpl-auto" title="Auto-generated: the letter is dated the day it is drafted">${e(letterDate())}</span>`;
  if(run.k === "manual")
    return `<input class="mpl-in mpl-manual" value="${e(v != null ? v : run.ph)}" size="${Math.max(18, run.ph.length)}"
      aria-label="Sent via" oninput="CMMedprov.set(${arg}, this.value)">`;
  if(run.k === "long")
    return `<textarea class="mpl-ta${set ? " set" : ""}" rows="5" placeholder="${e(run.ph)}" aria-label="Highlighted paragraph to review"
      oninput="CMMedprov.set(${arg}, this.value); CMMedprov.grow(this)">${e(v || "")}</textarea>`;
  return `<input class="mpl-in${set ? " set" : ""}" value="${e(v || "")}" placeholder="${e(run.ph)}"
    size="${Math.max(12, Math.min(64, run.ph.length))}" aria-label="${e(run.ph)}" oninput="CMMedprov.set(${arg}, this.value)">`;
}
function renderLetter(kind, tpl){
  const ctx = {kind, L: letter(kind), box: 0};
  return `<div class="mpl">` + tpl.blocks.map(b => {
    if(b.t === "tbl")
      return `<table class="mpl-tbl"><tbody>${b.rows.map(r => `<tr>${r.map(c => `<td>${e(c)}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
    const inner = b.runs.map(r => r.f ? field(r, ctx) : fixed(r, ctx)).join("");
    const cls = "mpl-p" + (b.n ? " mpl-num" : "") + (b.c ? " mpl-mid" : "");
    return `<p class="${cls}">${inner || "&nbsp;"}</p>`;
  }).join("") + `</div>`;
}
function letterLines(kind, tpl){
  const d = letter(kind); let n = 0, item = 0;
  return tpl.blocks.map(b => {
    if(b.t === "tbl") return b.rows.map(r => r.filter(Boolean).join("  ")).join("\n");
    let s = "";
    b.runs.forEach(r => {
      if(r.f){
        if(r.k === "date") s += letterDate();
        else if(r.k === "manual") s += (d.fields[r.f] != null ? d.fields[r.f] : r.ph);
        else s += (d.fields[r.f] || r.ph);
        return;
      }
      s += String(r.x).replace(/☐/g, () => (d.checks["cb" + (n++)] ? "[X]" : "[  ]"));
    });
    if(b.n) s = (++item) + ". " + s;
    else item = 0;
    return s.replace(/\t/g, "    ").replace(/ /g, " ");
  });
}

/* ---------- the page ---------- */
function notice(){
  return `<div class="lor-warn" role="note"><span class="lor-warn-ic">⚠</span><div><b class="lor-warn-h">Standalone activity — no CMS case file.</b><p>${NO_CASE_FILE}</p></div></div>`;
}
function kindSteps(kind){
  if(kind === "lienbv") return ["Fill in the client's date of birth, Social Security number and date of loss from your case notes.", "The provider's name, address and lien-holder details are the firm's own and stay exactly as sent — you are not drafting those.", "The date is filled in for you and is always today.", "The bottom section (treatment dates, charges, balance) is what the provider fills in and returns — leave it blank."];
  if(kind === "medlor") return ["Fill in every highlighted field from your case notes: date of birth, date of loss, the dates of service you are requesting, and your initials.", "The provider's name, address and billing contact are the firm's own and stay exactly as sent.", "The Unsworn Declaration of Custodian of Records at the end is completed and signed by the provider, not by you — it is included so you can see what you are asking them to certify."];
  return ["This is a reference example (Apache Health Center) — the firm sent one HITECH Request, not one per provider, so it isn't switched when a different provider is assigned.", "Fill in the dates of service you are requesting.", "Both Unsworn Declarations are completed and signed by the provider's own staff, not by you."];
}
function editor(provider){
  const kinds = kindsFor(provider);
  if(!L.tab || !kinds.includes(L.tab)) L.tab = kinds[0];
  const tpl = templateFor(provider, L.tab);
  const tabs = kinds.map(k => `<button type="button" class="${L.tab === k ? "on" : ""}" onclick="CMMedprov.tab('${k}')">${e(KIND_LABEL[k])}</button>`).join("");
  return `<section class="lor-ed"><div class="lsh-subtabs lor-tabs" role="tablist">${tabs}</div>
    <h2 class="lor-ed-h">${e(tpl.title)}</h2>
    <details class="card lor-steps"><summary>📋 Instructions for this letter</summary><ol>${kindSteps(L.tab).map(x => `<li>${x}</li>`).join("")}</ol></details>
    <div class="card lor-paper">${renderLetter(L.tab, tpl)}</div>
    <div class="lor-actions">
      <button class="btn btn-navy" type="button" onclick="CMMedprov.pdf('${L.tab}')">⬇ Download the letter (PDF)</button>
      <button class="btn btn-ghost" type="button" onclick="CMMedprov.word('${L.tab}')">⬇ Download as Word</button>
      <button class="btn btn-ghost btn-sm" type="button" onclick="CMMedprov.copyName('${L.tab}')">📋 Copy the file name</button>
      <span class="lor-save" id="mpSave"></span></div>
    <p class="lor-muted lor-naming">File name: <code>${e(fileNameFor(tpl, provider))}</code></p></section>`;
}
function providerCard(provider){
  if(!provider) return `<div class="card lor-wait"><b>Your trainer hasn’t assigned your provider yet.</b><p>One provider is handed out per trainee. Ask your trainer to assign yours; your letters open here as soon as they do.</p></div>`;
  const kinds = kindsFor(provider);
  return `<section class="card lor-case"><div class="lor-case-h"><div><p class="lor-eyebrow">Your assigned provider</p><h2>${e(provider.name)}</h2></div></div>
    <p class="lor-muted">This provider has letters to draft: ${kinds.map(k => e(KIND_LABEL[k])).join(", ")}.</p></section>`;
}
function renderPage(){
  if(!state.traineeId && !state.isAdmin && !state.adminPreview) return `<div class="card" style="padding:28px;">Sign in to open the Med Provider Drafting tool.</div>`;
  if(adminOn()) return renderAdmin();
  if(L.id !== state.traineeId && !L.loading) load(state.traineeId);
  if(L.err) return `<div class="card" style="padding:28px;">${e(L.err)} <button class="btn btn-ghost btn-sm" onclick="CMMedprov.reload()">Try again</button></div>`;
  if(!L.draft) return `<div class="card" style="padding:28px;">Loading your drafting activity…</div>`;
  const provider = myProvider();
  const preview = (state.adminPreview && !state.traineeId)
    ? `<div class="card lor-preview-note">👁 <b>Trainee view</b> — this is the page as a trainee sees it. Nothing you type here is saved; a trainee drafts on their own account.</div>` : "";
  return `${preview}<div class="lor-hero"><p class="lor-eyebrow">📄 Drafting Tools</p><h1>Med Provider Drafting</h1>
      <p>Draft the lien balance verification and medical LOR letters to your assigned provider, in the firm's own templates.</p>
      <button class="btn btn-ghost btn-sm" type="button" onclick="goto('drafting')">← Back to Drafting Tools</button></div>
    ${notice()}${providerCard(provider)}${provider ? editor(provider) : ""}`;
}

/* ---------- the trainer: who gets which provider ---------- */
const A = {rows:null, loading:false};
async function loadAdmin(){
  A.loading = true;
  try{
    const keys = (await sharedList("trainee:")) || [];
    const ids = keys.map(k => String(k).replace(/^trainee:/, ""));
    const people = await sharedGetMany(ids.map(id => "trainee:" + id));
    const rows = ids.map((id, i) => ({id, rec: people[i] || {}})).filter(x => x.rec && !x.rec.archived && x.rec.approved)
      .map(x => ({id:x.id, name:x.rec.name || x.id, batch:x.rec.batch || ""}));
    const assigns = await sharedGetMany(rows.map(x => "medprovassign:" + x.id));
    rows.forEach((x, i) => { x.a = assigns[i] || null; });
    A.rows = rows.sort((a, b) => (a.name || "").localeCompare(b.name || ""));
  }catch(err){ A.rows = []; }
  A.loading = false;
  if(state.view === "medprov") render();
}
function renderAdmin(){
  if(!A.rows && !A.loading) loadAdmin();
  const opts = id => PROVIDERS.map(p => `<option value="${e(p.id)}"${id === p.id ? " selected" : ""}>${e(p.name)}</option>`).join("");
  const groups = {}; (A.rows || []).forEach(x => { (groups[x.batch] = groups[x.batch] || []).push(x); });
  const keys = Object.keys(groups).sort((a, b) => (a === "") - (b === "") || b.localeCompare(a, undefined, {numeric:true}));
  return `<div class="lor-hero"><p class="lor-eyebrow">📄 Drafting Tools</p><h1>Med Provider Drafting</h1>
      <p>Hand each trainee one of the ${PROVIDERS.length} providers. They draft that provider's letters on this page and download them.</p>
      <button class="btn btn-ghost btn-sm" type="button" onclick="goto('drafting')">← Back to Drafting Tools</button></div>
    ${notice()}
    <section class="card lor-assign"><h2>🧑‍🏫 Assign providers</h2>
      <p class="lor-muted">One provider per trainee. A trainee sees that provider's letters as soon as you assign one; changing it keeps whatever they have already drafted.</p>
      ${!A.rows ? `<p class="lor-muted">Loading the trainees…</p>` : !A.rows.length ? `<p class="lor-muted">No approved trainee yet.</p>`
        : keys.map(b => `<div class="lor-batch"><b>📁 ${e(b ? "Batch " + b : "No batch set")}</b>
          ${groups[b].map(x => `<div class="lor-arow"><span class="lor-aname">${e(x.name)}</span>
            <select aria-label="Provider for ${e(x.name)}" onchange="CMMedprov.assign('${e(x.id)}', this.value, this)"><option value="">— not assigned —</option>${opts(x.a && x.a.provider)}</select>
            <span class="lor-astate">${x.a && x.a.provider ? `assigned${x.a.at ? " " + e(new Date(x.a.at).toLocaleDateString()) : ""}` : ""}</span></div>`).join("")}</div>`).join("")}
      <div style="margin-top:12px;"><button class="btn btn-ghost btn-sm" type="button" onclick="CMMedprov.refreshAdmin()">Refresh</button></div></section>
    <section class="card lor-preview"><h2>👁 The activity as a trainee sees it</h2>
      <p class="lor-muted">Pick a provider to read its letters.</p>
      <select aria-label="Preview a provider" onchange="CMMedprov.preview(this.value)">${opts((myProvider()||{}).id)}</select>
      ${providerCard(myProvider())}</section>`;
}

/* ---------- downloads (shared PDF/Word helpers, same convention as the LOR tool) ---------- */
const pdfSafe = s => String(s == null ? "" : s).replace(/[‘’]/g, "'").replace(/[“”]/g, '"')
  .replace(/[–—]/g, "-").replace(/☐/g, "[  ]").replace(/☒|☑/g, "[X]")
  .replace(/[^\x00-\xff]/g, "").replace(/ {2,}/g, m => m);
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

window.CMMedprov = {
  reload(){ L.id = null; L.draft = null; L.err = ""; render(); },
  refreshAdmin(){ A.rows = null; render(); },
  tab(k){ L.tab = k; render(); window.scrollTo(0, 0); },
  preview(v){ state.medprovPreviewProvider = v || PROVIDERS[0].id; render(); },
  grow(el){ el.style.height = "auto"; el.style.height = Math.min(520, el.scrollHeight + 2) + "px"; },
  set(kind, f, v){ letter(kind).fields[f] = v; letter(kind).updatedAt = new Date().toISOString(); queueSave(); },
  tick(kind, id){ const d = letter(kind); d.checks[id] = !d.checks[id]; queueSave(); render(); },
  copyName(kind){
    const tpl = templateFor(myProvider(), kind);
    const name = fileNameFor(tpl, myProvider());
    (navigator.clipboard ? navigator.clipboard.writeText(name) : Promise.reject())
      .then(() => toast("Copied the file name."), () => toast("Couldn’t copy. Select the name instead."));
  },
  async pdf(kind){
    const provider = myProvider(), tpl = templateFor(provider, kind);
    await makePdf(fileNameFor(tpl, provider), letterLines(kind, tpl));
  },
  word(kind){
    const provider = myProvider(), tpl = templateFor(provider, kind);
    makeWord(fileNameFor(tpl, provider), letterLines(kind, tpl));
  },
  async assign(id, v, el){
    el.disabled = true;
    try{
      const rec = v ? {provider:v, at:new Date().toISOString(), by:"trainer"} : {provider:null, at:new Date().toISOString(), by:"trainer"};
      if(await sharedSet("medprovassign:" + id, rec) === false) throw new Error("save");
      const row = (A.rows || []).find(x => x.id === id); if(row) row.a = rec;
      toast(v ? "✓ Provider assigned." : "Provider cleared.");
    }catch(err){ toast("Couldn’t save the assignment. Check your connection."); }
    el.disabled = false; render();
  }
};

/* ---------- wiring into the engine ---------- */
const __renderCmMedprov = window.render;
window.render = function(){
  if(state.view !== "medprov") return __renderCmMedprov.apply(this, arguments);
  if(!state.traineeId && !state.isAdmin && !state.adminPreview){ state.view = "dashboard"; return __renderCmMedprov.apply(this, arguments); }
  const app = document.getElementById("app");
  app.innerHTML = renderTopbar() + `<main class="main-lor">${renderPage()}</main>` + renderFooter();
  paintSave();
  try{ afterRender(); }catch(err){}
  document.querySelectorAll(".mpl-ta").forEach(CMMedprov.grow);
};
window.cmMedprovCard = function(){
  if(isTrainee() && L.id !== state.traineeId && !L.loading) load(state.traineeId);
  const provider = isTrainee() ? myProvider() : null;
  const note = adminOn() ? "Assign each trainee a provider." : provider ? `Your provider: <b>${e(provider.name)}</b>.` : "Waiting for your trainer to assign your provider.";
  return `<div class="card fts-card"><h3>🏥 Med Provider Drafting</h3>
    <p class="fts-note">Draft the Lien Balance Verification and Medical LOR letters to your assigned provider, in the firm's own templates, then download them. A standalone activity — no CMS case file.</p>
    <p class="fss-case">${note}</p>
    <div class="fts-tool-act"><button class="btn btn-navy btn-sm" type="button" onclick="goto('medprov')">Open Med Provider Drafting</button></div></div>`;
};

(function(){ const s = document.createElement("style"); s.id = "cm-medprov"; s.textContent = `
.mpl{font-family:Arial,Helvetica,sans-serif;font-size:13.5px;line-height:1.5;color:#111;}
.mpl-p{margin:0 0 9px;text-align:justify;}
.mpl-mid{text-align:center;font-weight:700;}
.mpl-num{display:list-item;list-style:decimal;margin-left:26px;text-align:justify;}
.mpl-tab{display:inline-block;width:34px;}
.mpl-tbl{border-collapse:collapse;margin:6px 0;} .mpl-tbl td{padding:2px 8px 2px 0;font-size:13.5px;}
.mpl-in,.mpl-ta{font:inherit;color:#0B3B8C;font-weight:700;background:#FEF9C3;border:0;border-bottom:1.5px solid #EAB308;border-radius:3px 3px 0 0;padding:1px 5px;max-width:100%;}
.mpl-in:focus,.mpl-ta:focus{outline:2px solid #F97316;outline-offset:1px;background:#FFFBEB;}
.mpl-in::placeholder,.mpl-ta::placeholder{color:#8A7B2F;font-weight:500;font-style:italic;}
.mpl-in.set,.mpl-ta.set{background:#ECFDF5;border-bottom-color:#34D399;}
.mpl-manual{color:#111;}
.mpl-ta{display:block;width:100%;margin:4px 0;line-height:1.5;resize:vertical;text-align:left;}
.mpl-auto{background:#E0E7FF;border-bottom:1.5px dashed #6366F1;border-radius:3px 3px 0 0;padding:1px 5px;font-weight:700;color:#312E81;}
.mpl-box{font:inherit;font-size:17px;line-height:1;background:none;border:0;color:#111;cursor:pointer;padding:0 2px;border-radius:4px;}
.mpl-box:hover{background:#FEF3C7;} .mpl-box.on{color:#047857;} .mpl-box:focus-visible{outline:2px solid #F97316;}
`; document.head.appendChild(s); })();
})();
