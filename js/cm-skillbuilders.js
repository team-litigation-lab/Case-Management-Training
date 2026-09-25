/* ============================================================
   LSH Case Management Training — Skill Builders, Case Documents,
   the Training Tools hub (CMS, Docket, Records), Handouts and Case File.
   Loaded after the main portal script: anything assigned to window
   here replaces the portal function of the same name.
   ============================================================ */
(function(){
"use strict";

/* ---------------- styles ---------------- */
const st = document.createElement("style"); st.id = "cm-skillbuilders-css"; st.textContent = `
.cm-part h3{margin:0 0 6px;color:var(--navy);font-size:15.5px}
.cm-part .cm-intro{font-size:13px;color:var(--ink-soft);margin:0 0 12px;max-width:80ch}
.cm-scn{background:#F8F9FC;border-left:4px solid var(--navy);border-radius:10px;padding:12px 16px;margin:0 0 14px;font-size:13px;color:#37394A}
.cm-scn b{color:var(--navy)}
.cm-docs{border:1px dashed var(--line);border-radius:12px;padding:10px 14px;margin:0 0 14px;background:#FFFCF7}
.cm-docs-h{font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--orange-deep);margin-bottom:6px}
.cm-doc-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px solid #F0EDE6;font-size:13px}
.cm-doc-row:first-of-type{border-top:none}
.cm-doc-row .t{font-weight:700;color:var(--ink)}.cm-doc-row .d{font-size:12px;color:var(--ink-soft);font-weight:500}
.cm-doc-row .btn{white-space:nowrap;flex-shrink:0}
.cm-doc-row > div:first-child{min-width:0;flex:1}
.cm-doc-row .cms{font-family:'IBM Plex Mono',monospace;font-size:10.5px;background:#EEF0F6;color:var(--navy);border-radius:999px;padding:2px 8px;white-space:nowrap}
.cm-table{width:100%;border-collapse:collapse;font-size:12.8px;margin:6px 0 10px}
.cm-table th,.cm-table td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top}
.cm-table th{background:#F3F4F9;color:var(--navy);font-size:12px}
.cm-table select,.cm-table input{font:inherit;font-size:12.5px;padding:5px 7px;border:1px solid var(--line);border-radius:7px;max-width:100%}
.cm-table tr.ok td{background:#EEF7F1}.cm-table tr.bad td{background:#FBEDEA}
.cm-why{display:block;font-size:11.5px;color:var(--ink-soft);margin-top:3px;font-weight:500}
.cm-res{margin-top:10px;font-size:13px}
.cm-check{display:flex;gap:9px;align-items:flex-start;padding:7px 10px;border:1px solid var(--line);border-radius:9px;margin-bottom:6px;font-size:13px;background:#fff;cursor:pointer}
.cm-check.ok{border-color:var(--success);background:#EEF7F1}.cm-check.bad{border-color:var(--danger);background:#FBEDEA}
.cm-calc{display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:8px 12px;align-items:center;font-size:13px;margin:6px 0 10px}
.cm-calc input{font:inherit;padding:7px 9px;border:1px solid var(--line);border-radius:8px;width:100%}
.cm-calc input.ok{border-color:var(--success);background:#EEF7F1}.cm-calc input.bad{border-color:var(--danger);background:#FBEDEA}
.cm-ta{width:100%;min-height:130px;padding:10px 12px;border-radius:8px;border:1px solid var(--line);font-size:13px;font-family:inherit;resize:vertical}
.cm-cms{border:1.5px solid var(--navy);border-radius:12px;padding:12px 16px;margin:14px 0;background:#F4F6FB}
.cm-cms b{color:var(--navy)}
.cm-cms .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
.cm-cms input{font:inherit;padding:7px 9px;border:1px solid var(--line);border-radius:8px;min-width:200px}
.cm-soon{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;background:#FFF1DE;color:#9A5B00;border-radius:999px;padding:2px 8px;margin-left:6px}
.cm-tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-bottom:16px}
.cm-tool{padding:16px 18px;display:flex;flex-direction:column;gap:8px}
.cm-tool.soon{opacity:.82}
.cm-tool p{margin:0;font-size:13px;color:var(--ink-soft)}
.cm-tool-h{display:flex;gap:12px;align-items:center}.cm-tool-h b{color:var(--navy);font-size:15px}
.cm-tool-ic{font-size:26px;width:46px;height:46px;border-radius:12px;background:#EEF0F6;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cm-badge{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:2px 9px;margin-top:3px}
.cm-badge.live{background:#E3F4EA;color:#1D6B3C}.cm-badge.soon{background:#FFF1DE;color:#9A5B00}
.cm-tool-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto}
.cm-tool-url{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink-soft);word-break:break-all}
.cm-tool-note{font-size:12.3px!important;margin-top:auto!important}
.cm-tool-admin{display:grid;grid-template-columns:90px minmax(0,1fr) 150px;gap:8px;align-items:center;margin-bottom:8px;font-size:13px}
.cm-tool-admin input,.cm-tool-admin select{font:inherit;padding:7px 9px;border:1px solid var(--line);border-radius:8px;min-width:0}
@media (max-width:600px){.cm-tool-admin{grid-template-columns:1fr}}
#cm-toolframe{position:fixed;inset:0;z-index:9000;background:var(--paper,#F7F6F2);display:flex;flex-direction:column}
#cm-toolframe[hidden]{display:none}
.cm-tf-bar{display:flex;gap:8px;align-items:center;padding:8px 12px;background:var(--navy);flex-wrap:wrap}
.cm-tf-bar .btn-ghost{background:#fff}
.cm-tf-tabs{display:flex;gap:6px;flex:1;min-width:0;overflow-x:auto}
.cm-tf-tab{font:inherit;font-size:13px;font-weight:600;border:1px solid rgba(255,255,255,.35);background:transparent;color:#fff;border-radius:8px;padding:6px 12px;cursor:pointer;white-space:nowrap}
.cm-tf-tab.on{background:#fff;color:var(--navy)}
.cm-tf-hint{font-size:11.5px;color:rgba(255,255,255,.8)}.cm-tf-hint b{color:#fff}
.cm-tf-newtab{background:var(--orange)!important;border-color:var(--orange)!important}
.cm-tf-body{flex:1;position:relative}
.cm-tf-body iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
body.cm-tf-open{overflow:hidden}
#cm-toolpill{position:fixed;right:18px;bottom:18px;z-index:8999;box-shadow:0 6px 22px rgba(0,0,0,.25);border-radius:999px}
#cm-toolpill[hidden]{display:none}
@media (max-width:760px){.cm-tf-hint,.cm-tf-long{display:none}}
.cm-radio{display:flex;flex-direction:column;gap:6px;margin:6px 0 10px}
.cm-radio label{display:flex;gap:8px;align-items:flex-start;border:1px solid var(--line);border-radius:9px;padding:8px 10px;font-size:13px;background:#fff;cursor:pointer}
.cm-skill-cta{margin-top:14px;border:1.5px solid var(--orange);background:#FFF6EC;border-radius:12px;padding:12px 16px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.cm-skill-cta b{color:var(--navy);font-size:14px}.cm-skill-cta p{margin:2px 0 0;font-size:12.5px;color:#5A4A32}
.cm-lib-folder{margin-bottom:18px}
.cm-lib-folder h3{font-size:14px;color:var(--navy);margin:0 0 8px}
.cm-key{font-size:11.8px;color:#6B2E26;background:#FBEDEA;border-radius:7px;padding:5px 8px;margin-top:5px;font-weight:600}
.cm-filter{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 16px}
.cm-lesson-visual{margin:12px 0 4px}
.svg-diagram-card .cm-lesson-visual{text-align:left}
/* CM has two more nav items than EA/PA: on laptop widths collapse the search box to its icon (expands on focus) */
@media(min-width:761px) and (max-width:1600px){
  .topbar-search{flex:0 0 38px !important;min-width:38px !important;max-width:38px !important;overflow:hidden;transition:max-width .2s ease,flex-basis .2s ease}
  .topbar-search:focus-within{flex-basis:230px !important;max-width:230px !important}
  .nav button{padding:7px 7px;font-size:12.5px}
}
@media(max-width:700px){.cm-calc{grid-template-columns:1fr}.cm-doc-row{flex-wrap:wrap}}
`; document.head.appendChild(st);

/* ---------------- small helpers ---------------- */
const E = (s)=> (typeof esc==="function" ? esc(s) : String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
const money = (n)=> (n<0?"−":"") + "$" + Math.abs(Number(n)||0).toLocaleString("en-US",{minimumFractionDigits:2, maximumFractionDigits:2});
const cmState = ()=> (toolState.cm = toolState.cm || {});
const CM_UI = {};                                  // key -> config for the current tool
window.__cmUI = CM_UI;                             // read-only hook for automated answer-key tests
const toolOfKey = (key)=> key.split(":")[0];
const dayOfTool = (id)=> { const t = PRACTICE_TOOLS.find(x=>x.id===id); return t ? parseInt(String(t.relates).replace(/\D/g,""),10) : null; };
async function scorePart(key, score){ await bumpPracticeProgress(toolOfKey(key), score); if(score>=90 && typeof burstConfetti==="function") burstConfetti(); }
const part = (title, intro, inner)=> `<div class="cm-part"><h3>${E(title)}</h3>${intro?`<p class="cm-intro">${intro}</p>`:""}${inner}</div>`;
const scenario = (html)=> `<div class="cm-scn">${html}</div>`;

/* ================================================================
   TRAINING TOOLS HUB — the portal embeds every LSH training platform.
   Each tool can be opened inside the portal (a persistent frame that
   keeps its session while you move around the lessons) or on its own
   in a new tab. Admins set each tool's address and status for everyone
   (shared key settings:tools).
   ================================================================ */
const CM_TOOL_DEFAULTS = [
  {id:"cms", icon:"🗂", name:"LSH Case Management System", short:"CMS", status:"live",
   url:"https://cm-training-activity.pages.dev",
   desc:"Where the case work actually happens: start the case, key the intake facts, upload each document by category, and log Tasks, Notes, Liens, Chronology and the Financial Ledger.",
   evidence:"CMS Case ID", idHint:"CMS Case ID (e.g. LSH-2026-PI-000123)"},
  {id:"docket", icon:"📅", name:"Docket Entry System", short:"Docket", status:"coming", url:"",
   desc:"Enter court and ADR deadlines, hearings and depositions on the firm docket: the deadline chain, reminder alerts and the attorney's calendar.",
   evidence:"Docket entry ID", idHint:"Docket entry ID (or your CMS Case ID)"},
  {id:"chartswap", icon:"📨", name:"Medical Records Request Platform", short:"Records", status:"coming", url:"",
   desc:"A ChartSwap-style records portal: request medical records and itemized bills from providers, attach the signed HIPAA, track fulfilment and fees.",
   evidence:"Records request ID", idHint:"Request ID (or your CMS Case ID)"}
];
function cmTool(id){
  const d = CM_TOOL_DEFAULTS.find(t=>t.id===id); if(!d) return null;
  const o = ((state.toolSettings||{})[id])||{};
  const url = String(o.url!=null ? o.url : d.url || "").trim().replace(/\/+$/,"");
  const status = o.status || d.status;
  return Object.assign({}, d, {url, status, live: status==="live" && /^https:\/\//i.test(url)});
}
window.cmTool = cmTool;
window.cmCmsUrl = function(){ return cmTool("cms").url; };
async function loadToolSettings(){
  try{ const s = await sharedGet("settings:tools"); if(s && typeof s==="object") state.toolSettings = s.tools || s; }catch(e){}
}

/* ---- the persistent in-portal frame (lives outside #app, so render() never reloads it) ---- */
const frames = {};                  // tool id → iframe
let frameShell = null, currentFrame = null;
function ensureShell(){
  if(frameShell) return frameShell;
  frameShell = document.createElement("div");
  frameShell.id = "cm-toolframe"; frameShell.hidden = true;
  frameShell.innerHTML = `<div class="cm-tf-bar"><button class="btn btn-ghost btn-sm" onclick="closeToolFrame()">← Back<span class="cm-tf-long"> to training</span></button>
    <div class="cm-tf-tabs"></div>
    <span class="cm-tf-hint">Sign-in won't stay? Use <b>Open in new tab</b>.</span>
    <button class="btn btn-navy btn-sm cm-tf-newtab" onclick="openTool(null,'tab')">New tab ↗</button></div>
    <div class="cm-tf-body"></div>`;
  document.body.appendChild(frameShell);
  const pill = document.createElement("button");
  pill.id = "cm-toolpill"; pill.hidden = true; pill.className = "btn btn-navy";
  pill.onclick = ()=> openTool(currentFrame);
  document.body.appendChild(pill);
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !frameShell.hidden) closeToolFrame(); });
  return frameShell;
}
function paintShell(){
  const tabs = frameShell.querySelector(".cm-tf-tabs");
  tabs.innerHTML = CM_TOOL_DEFAULTS.map(d=>cmTool(d.id)).filter(t=>t.live).map(t=>
    `<button class="cm-tf-tab${t.id===currentFrame?" on":""}" onclick="openTool('${t.id}')">${t.icon} ${E(t.short)}</button>`).join("");
  Object.entries(frames).forEach(([id,f])=>{ f.style.display = id===currentFrame ? "block" : "none"; });
}
window.openTool = function(id, mode){
  id = id || currentFrame || "cms";
  const t = cmTool(id);
  if(!t){ return; }
  if(!t.live){ toast(`${t.icon} ${t.name} is coming soon. For now, log this step as a Task in the CMS.`); return; }
  if(mode==="tab"){ window.open(t.url, "_blank", "noopener"); return; }
  ensureShell();
  if(!frames[id] || frames[id].dataset.src !== t.url){
    if(frames[id]) frames[id].remove();
    const f = document.createElement("iframe");
    f.src = t.url; f.dataset.src = t.url; f.title = t.name;
    f.setAttribute("allow", "clipboard-read; clipboard-write; fullscreen");
    f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    frameShell.querySelector(".cm-tf-body").appendChild(f);
    frames[id] = f;
  }
  currentFrame = id; paintShell();
  frameShell.hidden = false; document.body.classList.add("cm-tf-open");
  document.getElementById("cm-toolpill").hidden = true;
};
window.closeToolFrame = function(){
  if(!frameShell) return;
  frameShell.hidden = true; document.body.classList.remove("cm-tf-open");
  const t = cmTool(currentFrame), pill = document.getElementById("cm-toolpill");
  if(t && pill){ pill.textContent = `${t.icon} Return to ${t.short}`; pill.hidden = false; }
};
window.openCms = function(mode){ openTool("cms", mode); };

/* Tool step: the trainee does the work in a training platform, then logs the ID here.
   A tool that isn't live yet falls back to a CMS Task so no step is ever blocked. */
function toolStep(toolId, key, what){
  const t = cmTool(toolId), saved = ((state.cmsLog||{})[key]||{}), k = key.replace(/\W/g,"_");
  const fallback = !t.live && toolId!=="cms";
  return `<div class="cm-cms"><b>${t.icon} Do this in the ${E(t.name)}</b>${t.live?"":` <span class="cm-soon">coming soon</span>`}
    <p style="font-size:12.8px;margin:6px 0 0;color:#37394A">${what}</p>
    ${fallback?`<p style="font-size:12.3px;margin:6px 0 0;color:var(--ink-soft)">Until the ${E(t.short)} platform is live, add this as a <b>Task</b> in the CMS case and log your CMS Case ID below.</p>`:""}
    <div class="row">
      ${t.live?`<button class="btn btn-navy btn-sm" onclick="openTool('${toolId}')">Open ${E(t.short)}</button><button class="btn btn-ghost btn-sm" onclick="openTool('${toolId}','tab')" title="Open in a new tab">↗</button>`
              :`<button class="btn btn-navy btn-sm" onclick="openTool('cms')">Open CMS</button>`}
      <input id="cmsId_${k}" placeholder="${E(fallback?cmTool("cms").idHint:t.idHint)}" value="${E(saved.caseId||"")}">
      <button class="btn btn-ghost btn-sm" onclick="cmLogCms('${key}','${fallback?"cms":toolId}')">Log my work</button>
      <span id="cmsLogged_${k}" style="font-size:12px;color:var(--success)">${saved.at?`✓ Logged ${fmtDate(saved.at)}`:""}</span>
    </div></div>`;
}
const cmsStep = (key, what)=> toolStep("cms", key, what);
window.cmLogCms = async function(key, platform){
  const el = document.getElementById("cmsId_"+key.replace(/\W/g,"_"));
  const v = (el && el.value || "").trim();
  const t = cmTool(platform||"cms");
  if(v.length < 3){ toast(`Enter the ${t.evidence} the ${t.short} gave you when you saved.`); return; }
  state.cmsLog = state.cmsLog || {};
  state.cmsLog[key] = {caseId:v, at:new Date().toISOString(), tool:toolOfKey(key), platform:t.id};
  await storeSet("cms-log", state.cmsLog);
  const s = document.getElementById("cmsLogged_"+key.replace(/\W/g,"_")); if(s) s.textContent = "✓ Logged just now";
  toast(`Logged. Your trainer can check it in the ${t.short}.`);
};

/* A document packet: the exact files a Skill Builder part is built on. */
function docPacket(ids, title){
  const docs = ids.map(id=>cmDoc(id)).filter(Boolean);
  if(!docs.length) return "";
  return `<div class="cm-docs"><div class="cm-docs-h">📁 ${E(title||"Source documents for this part")}</div>
    ${docs.map(d=>`<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span><div class="d">${E(d.desc)}</div>${state.isAdmin && d.key ? `<div class="cm-key">🔑 Trainer key: ${E(d.key)}</div>` : ""}</div>
      <div style="display:flex;gap:6px;align-items:center"><span class="cms" title="CMS upload category">CMS: ${E(d.cms)}</span><a class="btn btn-ghost btn-sm" href="${cmDocUrl(d)}" target="_blank" rel="noopener">Open</a></div></div>`).join("")}
  </div>`;
}
window.cmDocPacket = docPacket;

/* ---------------- building block: flag table ---------------- */
function flagTable(key, rows, options){
  CM_UI[key] = {type:"flags", rows, options};
  const st = cmState()[key] = cmState()[key] || {};
  return `<table class="cm-table" id="tbl_${key.replace(/\W/g,"_")}"><thead><tr><th>Item</th><th>What the documents show</th><th style="width:170px">Your call</th></tr></thead><tbody>
    ${rows.map((r,i)=>`<tr id="row_${key.replace(/\W/g,"_")}_${i}"><td><b>${E(r.item)}</b></td><td>${E(r.shows)}<span class="cm-why" id="why_${key.replace(/\W/g,"_")}_${i}"></span></td>
      <td><select onchange="cmSet('${key}',${i},this.value)"><option value="">— choose —</option>${options.map(o=>`<option ${st[i]===o?"selected":""}>${E(o)}</option>`).join("")}</select></td></tr>`).join("")}
  </tbody></table><button class="btn btn-ghost btn-sm" onclick="cmCheckFlags('${key}')">Check my calls</button><div class="cm-res" id="res_${key.replace(/\W/g,"_")}"></div>`;
}
window.cmSet = function(key, i, v){ const s = cmState()[key] = cmState()[key] || {}; s[i] = v; };
window.cmCheckFlags = async function(key){
  const cfg = CM_UI[key], s = cmState()[key]||{}, k = key.replace(/\W/g,"_");
  if(cfg.rows.some((_,i)=>!s[i])){ toast("Make a call on every row first."); return; }
  let ok = 0;
  cfg.rows.forEach((r,i)=>{ const good = s[i]===r.answer; if(good) ok++;
    const tr = document.getElementById(`row_${k}_${i}`); if(tr){ tr.classList.toggle("ok",good); tr.classList.toggle("bad",!good); }
    const w = document.getElementById(`why_${k}_${i}`); if(w) w.textContent = (good?"✓ ":"✗ Correct call: "+r.answer+" — ") + r.why; });
  const score = Math.round(ok/cfg.rows.length*100);
  document.getElementById("res_"+k).innerHTML = `<b style="color:${score>=80?"var(--success)":"var(--danger)"}">${ok}/${cfg.rows.length} correct (${score}%)</b>`;
  await scorePart(key, score);
};

/* ---------------- building block: sorter (assign each item to a zone) ---------------- */
function sorter(key, items, zones, colLabel){
  CM_UI[key] = {type:"sort", items, zones};
  const st = cmState()[key] = cmState()[key] || {};
  return `<table class="cm-table" id="tbl_${key.replace(/\W/g,"_")}"><thead><tr><th>${E(colLabel||"Document / item")}</th><th style="width:240px">Where does it go?</th></tr></thead><tbody>
    ${items.map((it,i)=>{ const d = it.doc ? cmDoc(it.doc) : null; return `<tr id="row_${key.replace(/\W/g,"_")}_${i}"><td><b>${E(it.t)}</b>${d?` <a href="${cmDocUrl(d)}" target="_blank" rel="noopener" style="font-size:12px">open ↗</a>`:""}<span class="cm-why" id="why_${key.replace(/\W/g,"_")}_${i}"></span></td>
      <td><select onchange="cmSet('${key}',${i},this.value)"><option value="">— choose —</option>${zones.map(z=>`<option ${st[i]===z?"selected":""}>${E(z)}</option>`).join("")}</select></td></tr>`; }).join("")}
  </tbody></table><button class="btn btn-ghost btn-sm" onclick="cmCheckSort('${key}')">Check my sort</button><div class="cm-res" id="res_${key.replace(/\W/g,"_")}"></div>`;
}
window.cmCheckSort = async function(key){
  const cfg = CM_UI[key], s = cmState()[key]||{}, k = key.replace(/\W/g,"_");
  if(cfg.items.some((_,i)=>!s[i])){ toast("Place every item first."); return; }
  let ok = 0;
  cfg.items.forEach((it,i)=>{ const good = s[i]===it.z; if(good) ok++;
    const tr = document.getElementById(`row_${k}_${i}`); if(tr){ tr.classList.toggle("ok",good); tr.classList.toggle("bad",!good); }
    const w = document.getElementById(`why_${k}_${i}`); if(w) w.textContent = (good?"✓ ":"✗ Goes to: "+it.z+" — ") + (it.why||""); });
  const score = Math.round(ok/cfg.items.length*100);
  document.getElementById("res_"+k).innerHTML = `<b style="color:${score>=80?"var(--success)":"var(--danger)"}">${ok}/${cfg.items.length} placed correctly (${score}%)</b>`;
  await scorePart(key, score);
};

/* ---------------- building block: checklist (select all that apply) ---------------- */
function checklist(key, items, btnLabel){
  CM_UI[key] = {type:"check", items};
  const st = cmState()[key] = cmState()[key] || {};
  return `<div id="chk_${key.replace(/\W/g,"_")}">${items.map((it,i)=>`<label class="cm-check" id="row_${key.replace(/\W/g,"_")}_${i}"><input type="checkbox" ${st[i]?"checked":""} onchange="cmSet('${key}',${i},this.checked)"><span>${E(it.t)}<span class="cm-why" id="why_${key.replace(/\W/g,"_")}_${i}"></span></span></label>`).join("")}</div>
    <button class="btn btn-ghost btn-sm" onclick="cmCheckList('${key}')">${E(btnLabel||"Check my selections")}</button><div class="cm-res" id="res_${key.replace(/\W/g,"_")}"></div>`;
}
window.cmCheckList = async function(key){
  const cfg = CM_UI[key], s = cmState()[key]||{}, k = key.replace(/\W/g,"_");
  let ok = 0;
  cfg.items.forEach((it,i)=>{ const picked = !!s[i], good = picked===!!it.ok; if(good) ok++;
    const row = document.getElementById(`row_${k}_${i}`); if(row){ row.classList.toggle("ok", good); row.classList.toggle("bad", !good); }
    const w = document.getElementById(`why_${k}_${i}`); if(w) w.textContent = (it.ok?"Should be selected — ":"Should NOT be selected — ") + (it.why||""); });
  const score = Math.round(ok/cfg.items.length*100);
  document.getElementById("res_"+k).innerHTML = `<b style="color:${score>=80?"var(--success)":"var(--danger)"}">${ok}/${cfg.items.length} right (${score}%)</b>`;
  await scorePart(key, score);
};

/* ---------------- building block: calculator ---------------- */
function calc(key, fields, afterCheck){
  CM_UI[key] = {type:"calc", fields, afterCheck};
  const st = cmState()[key] = cmState()[key] || {};
  return `<div class="cm-calc">${fields.map((f,i)=>`<label for="calc_${key.replace(/\W/g,"_")}_${i}">${f.label}</label>
      <input id="calc_${key.replace(/\W/g,"_")}_${i}" type="${f.type||"number"}" step="0.01" value="${E(st[i]==null?"":st[i])}" oninput="cmSet('${key}',${i},this.value)" placeholder="${f.type==="date"?"":"0.00"}">`).join("")}</div>
    <button class="btn btn-ghost btn-sm" onclick="cmCheckCalc('${key}')">Check my numbers</button><div class="cm-res" id="res_${key.replace(/\W/g,"_")}"></div>`;
}
window.cmCheckCalc = async function(key){
  const cfg = CM_UI[key], s = cmState()[key]||{}, k = key.replace(/\W/g,"_");
  let ok = 0; const notes = [];
  cfg.fields.forEach((f,i)=>{
    const el = document.getElementById(`calc_${k}_${i}`); const raw = el ? el.value : s[i];
    let good;
    if(f.type==="date") good = raw===f.answer;
    else { const v = parseFloat(String(raw).replace(/[$,\s]/g,"")); good = !isNaN(v) && Math.abs(v - f.answer) <= (f.tol==null?1:f.tol); }
    if(good) ok++; else notes.push(`<li><b>${f.label.replace(/<[^>]+>/g,"")}:</b> expected ${f.type==="date"?f.answer:money(f.answer)}${f.hint?` — ${f.hint}`:""}</li>`);
    if(el){ el.classList.toggle("ok",good); el.classList.toggle("bad",!good); }
  });
  const score = Math.round(ok/cfg.fields.length*100);
  document.getElementById("res_"+k).innerHTML = `<b style="color:${score>=80?"var(--success)":"var(--danger)"}">${ok}/${cfg.fields.length} correct (${score}%)</b>${notes.length?`<ul style="margin:6px 0 0;padding-left:18px">${notes.join("")}</ul>`:""}${cfg.afterCheck?`<div style="margin-top:8px">${cfg.afterCheck}</div>`:""}`;
  await scorePart(key, score);
};

/* ---------------- building block: single choice ---------------- */
function choice(key, opts){
  CM_UI[key] = {type:"choice", opts};
  const st = cmState()[key] = cmState()[key] || {};
  return `<div class="cm-radio">${opts.map((o,i)=>`<label><input type="radio" name="rad_${key.replace(/\W/g,"_")}" ${st.v===i?"checked":""} onchange="cmSetChoice('${key}',${i})"><span>${o}</span></label>`).join("")}</div>`;
}
window.cmSetChoice = function(key, i){ (cmState()[key] = cmState()[key]||{}).v = i; };
const choiceText = (key)=>{ const c = CM_UI[key], s = cmState()[key]; return c && s && s.v!=null ? c.opts[s.v].replace(/<[^>]+>/g,"") : "(no option selected)"; };

/* ---------------- building block: AI-graded writing ---------------- */
function aiTask(key, cfg){
  CM_UI[key] = Object.assign({type:"ai"}, cfg);
  return `<label style="font-size:12.8px;font-weight:700;color:var(--navy);display:block;margin:4px 0 5px">${E(cfg.label)}</label>
    <textarea class="cm-ta" id="ta_${key.replace(/\W/g,"_")}" style="min-height:${cfg.rows||150}px" placeholder="${E(cfg.placeholder||"Write it exactly as you would send or file it…")}"></textarea>
    <button class="btn btn-navy btn-sm" style="margin-top:8px" onclick="cmGrade('${key}', this)">Get AI review</button>
    <div id="ai_${key.replace(/\W/g,"_")}" style="margin-top:10px"></div>`;
}
window.cmGrade = async function(key, btn){
  const cfg = CM_UI[key], k = key.replace(/\W/g,"_");
  const ta = document.getElementById("ta_"+k); const text = (ta && ta.value || "").trim();
  const out = document.getElementById("ai_"+k);
  if(text.length < 40){ toast("Write out your full answer first."); return; }
  const tool = toolOfKey(key), day = dayOfTool(tool);
  if(!(await useLabAttempt(day, key))) return;
  if(btn){ btn.disabled = true; btn.textContent = "Reviewing…"; }
  out.innerHTML = `<div class="ai-loading">Reviewing your work against the case documents…</div>`;
  const extra = typeof cfg.extra==="function" ? cfg.extra() : "";
  try{
    const report = await runRubricEvaluation(cfg.exercise || cfg.label,
      `CASE FILE (John Doe v. Apex Delivery Services):\n${CLIENT_DOSSIER_MD}\n\nEXERCISE CONTEXT:\n${cfg.context}${extra?`\n\nTRAINEE'S EARLIER SELECTIONS:\n${extra}`:""}`,
      text, cfg.criteria);
    out.innerHTML = renderEvaluationReport(report, day);
    await bumpPracticeProgress(tool, report.totalScore);
  }catch(e){ out.innerHTML = renderAiErrorBlock(e, "Couldn't review this yet"); }
  if(btn){ btn.disabled = false; btn.textContent = "Get AI review"; }
};

/* ================================================================
   THE SKILL BUILDERS
   ================================================================ */
const TOOLS = {};

/* ---------- DAY 1 · Intake Decision Challenge ---------- */
TOOLS.cmIntake1 = ()=>[
  {label:"Intake Packet Audit", html: part("A. Intake Packet Audit",
    "You are the gatekeeper of case quality. Open every document in the packet and make a call on each item: is it complete and consistent, or does it need action before activation?",
    scenario(`<b>Scenario:</b> John Doe's intake packet for <b>John Doe v. Apex Delivery Services</b> just landed in your queue (retainer signed 02/15/2026). Before the case is activated you must verify it the way a Case Manager would — against the police report and the medical and billing records, not against the intake's own summary.`)
    + docPacket(["JD01","JD02","JD03","JD05","JD06","JD07","JD13","JD24","JD27","JD28"], "Intake packet")
    + flagTable("cmIntake1:flags", [
      {item:"Date of loss", shows:"02/14/2026 on the intake sheet, police report, retainer and HIPAA form.", answer:"OK", why:"Consistent across every source."},
      {item:"Client date of birth", shows:"08/14/1980 on intake, retainer and HIPAA · 02/14/1980 on every provider bill and the MRI report.", answer:"Inconsistent", why:"Providers must correct their records or billing/records requests and the demand will be challenged."},
      {item:"Occupation", shows:"CMS intake record says “Nurse” · wage verification and discharge summary say “Senior Logistics Manager”.", answer:"Inconsistent", why:"Lost-wage and earning-capacity claims depend on the correct job."},
      {item:"Police report number", shows:"Intake sheet: 2026-0214-AX (Sgt. Vance #1104) · CMS intake: “REPORT NUMBER 1104”.", answer:"Inconsistent", why:"1104 is the officer's badge number — the CMS entry is wrong."},
      {item:"HIPAA authorization", shows:"Claim-specific form naming the 02/14/2026 incident — signature and date lines blank.", answer:"Missing", why:"Unsigned authorizations get records requests rejected."},
      {item:"Retainer agreement", shows:"Signed 02/15/2026 · 33⅓% pre-suit / 40% post-suit · authority to resolve prior counsel's lien.", answer:"OK", why:"Executed and complete."},
      {item:"Defendant & driver identity", shows:"Apex Delivery Services (owner, Aggressive Casualty AC-99120-XCV) and driver Robert W. Smith on report, intake and dec page.", answer:"OK", why:"Consistent — use both names for the conflict check."},
      {item:"Passenger Jane Doe (spouse)", shows:"Front-seat passenger, minor neck/back pain, refused EMS; no intake, retainer or conflict check documented.", answer:"Needs follow-up", why:"A potential second claimant — conflict check and attorney review before the firm represents both."},
      {item:"Prior counsel", shows:"Barry Slow (The Fast Settlement Firm) terminated; lien PENDING — $1,200 costs + quantum meruit.", answer:"Needs follow-up", why:"Acknowledge and calendar the lien now; it must be resolved before any disbursement."},
      {item:"Health insurance", shows:"CMS intake: BCBS ERISA, Group BC-441-A · lien notice from “Global Health Blue-Shield” for the same dates of service.", answer:"Inconsistent", why:"Two different plan names — verify which plan actually paid before anyone negotiates a lien."},
      {item:"Coverage verification", shows:"Aggressive Casualty $1,000,000 CSL dec page and Local Farm Mutual UM $250k/$500k dec page both on file.", answer:"OK", why:"Coverage confirmed in writing."},
      {item:"Other medical history", shows:"2018 L4-L5 lumbar strain (resolved) and chronic migraines diagnosed 2021 — no 2021 records requested.", answer:"Needs follow-up", why:"Request prior records now; the brain MRI will draw a migraine argument."}
    ], ["OK","Missing","Inconsistent","Needs follow-up"]))},
  {label:"Decision & Documentation", html: part("B. Accept, Escalate or Decline",
    "Make the acceptance determination the way the slides teach it: verified facts, intake completeness, firm criteria. Then document the reason and the next steps for the intake team and the client.",
    choice("cmIntake1:decision", ["✅ <b>Accept</b> for case opening", "⚠️ <b>Escalate</b> for attorney / senior review", "❌ <b>Decline</b> due to eligibility or risk factors"])
    + aiTask("cmIntake1:decisionMemo", {
      label:"Your decision memo (reason + next steps to the intake team and the client)",
      exercise:"Intake Decision Challenge — acceptance determination",
      extra: ()=>"Decision selected: " + choiceText("cmIntake1:decision"),
      context:"The trainee audited John Doe's intake packet: DOB mismatch (08/14/1980 vs 02/14/1980 on bills/MRI), occupation mismatch (Nurse vs Senior Logistics Manager), police report number entered as the badge number, unsigned HIPAA authorization, spouse passenger with no intake/conflict check, prior counsel lien pending ($1,200 + QM), two different health-plan names, chronic migraines 2021 not requested. Liability is strong (Smith cited twice; Doe turning on a green arrow), coverage verified ($1M CSL; UM $250k/$500k), injuries severe and objective, SOL 02/14/2028.",
      criteria:"A strong answer ACCEPTS (or accepts conditionally) because liability, coverage and damages are strong — OR escalates narrowly for the passenger-spouse conflict question — and in either case lists the specific conditions/corrections before activation (conflict check on Apex, Robert W. Smith and Jane Doe; signed HIPAA; provider DOB corrections; CMS occupation and report-number fixes; acknowledgment of Barry Slow's lien; verify health plan identity; request 2021 migraine and 2018 records). DECLINE is a significant accuracy error. Next steps must be clear and assigned (intake team vs client). Penalize vague reasons or promising the client a case value."
    }))},
  {label:"Applied Case Manager Actions", html: part("C. Applied Case Manager Actions",
    "The slide's four steps: identify where intake slowed, find the root cause, implement immediate actions, and prevent it happening again.",
    aiTask("cmIntake1:rootCause", {
      label:"Your root-cause analysis and prevention plan",
      exercise:"Applied Case Manager Actions — intake bottleneck root cause",
      context:"Intake problems found: data entered into the CMS inconsistently (occupation, report number); provider records carry a different DOB; HIPAA sent unsigned; passenger not screened; prior counsel lien discovered late; two health-plan names. Bottleneck categories from the lesson: incomplete client information, delayed follow-up, conflict check delays, intake form errors, eligibility uncertainty, communication gaps.",
      criteria:"Must (1) name the specific slow points, (2) identify real root causes (e.g., no source-document verification step, no signature checklist, no passenger/household screening question, no single source of truth), (3) give immediate actions with owners and dates, (4) give prevention measures (checklists, CMS required fields, handoff rule). Generic advice without reference to the John Doe documents should score low on Accuracy."
    })) + cmsStep("cmIntake1:cms", "Create John Doe's case in the CMS with the corrected facts (DOB 08/14/1980, occupation Senior Logistics Manager, Police Report 2026-0214-AX). Upload the intake packet under <b>Case Files</b> and the police report under <b>Police</b>. Optional: fill in the <b>Blank PI Client Intake Form</b> from 📁 Case Documents → Templates and upload it too.") + toolStep("chartswap", "cmIntake1:records", "Request John's prior records flagged at intake (the 2021 migraine records and the 2018 records). Attach the claim-specific HIPAA authorization, which must be <b>signed</b> first, and give the provider the correct DOB, 08/14/1980.")}
];

/* ---------- DAY 1 · Treatment Phase ---------- */
TOOLS.cmTreatment1 = ()=>[
  {label:"Red Flags & Variance", html: part("A. Red Flags & Variance Analysis",
    "Classify what each treatment record is telling you. The right bucket decides your next move (A-C-T protocol, escalation ladder, or simply documenting it).",
    docPacket(["JD09","JD14","JD15","JD16","JD17","JD18","JD13","JD22"], "Treatment records")
    + sorter("cmTreatment1:flags", [
      {t:"ER discharge (02/14): “Strict Bed Rest” for 14 days, referral to Ortho/Neuro.", z:"No flag — document it", why:"A documented medical order — not a treatment gap. Note it in the chronology so nobody calls it one."},
      {t:"Chiro visit #12 (03/25): pain 8/10, “progress plateauing due to structural disc protrusion.”", z:"Clinical variance", why:"Conservative care has plateaued — the map says pivot to a specialist, don't keep adjusting."},
      {t:"PT session #6 (03/31): foot drop observed, left hallux extension 3/5.", z:"Medical danger (A-C-T now)", why:"A progressive neurological deficit — call the provider now."},
      {t:"PT session #5: TENS unit and light stretching only; patient stops after 15 minutes of radicular pain.", z:"Clinical variance", why:"Passive care without functional gain — part of the plateau pattern."},
      {t:"Chiro visit #14 (04/02): patient requests a 14-day “rest” phase for mental exhaustion; follow-ups then missed.", z:"Psychosocial variance / Yellow flag", why:"The start of the dissociative withdrawal — intervene, document, and get a psych evaluation."},
      {t:"Neuropsych (04/18): PTSD with Acute Dissociative Withdrawal; anxiety when viewing facial scars.", z:"Psychosocial variance / Yellow flag", why:"Yellow flag that explains the gap — and a treatment need of its own."},
      {t:"Carrier delays authorizing the neurosurgical / ESI referral for three weeks.", z:"Systemic variance", why:"Authorization delay — climb the escalation ladder (peer-to-peer → Notice of Delay → LOP)."},
      {t:"Adjuster obtains the 2018 workplace L4-L5 strain record.", z:"Legal danger (document & tell attorney)", why:"The pre-existing argument is coming — build the aggravation case."},
      {t:"MRI report lists a referring physician “Dr. Aris Thorne” and DOB 02/14/1980.", z:"Legal danger (document & tell attorney)", why:"Record integrity problem — get the provider to correct it before it reaches the adjuster."}
    ], ["Medical danger (A-C-T now)","Clinical variance","Psychosocial variance / Yellow flag","Systemic variance","Legal danger (document & tell attorney)","No flag — document it"], "Record finding"))},
  {label:"Eggshell Plaintiff Memo", html: part("B. Prove Aggravation — the Eggshell Plaintiff Memo",
    "Aggressive Casualty says the L4-L5 herniation is a pre-existing degenerative condition from 2018 and is stalling the surgical referral. Write the memo the handling attorney will use.",
    docPacket(["JD22","JD13","JD17","JD15","JD23"], "Use these records")
    + aiTask("cmTreatment1:eggshell", {label:"Aggravation memo to the handling attorney", exercise:"Eggshell Plaintiff aggravation memo",
      context:"2018: L4-L5 strain lifting crates, PT x4 weeks, resolved 09/15/2018 at MMI, no restrictions, no MRI. ~8 years asymptomatic. 2026: T-bone with mechanical extrication; MRI 03/15/2026 5mm L4-L5 protrusion impinging the left L5 root (chronology says 3mm/03/10 — discrepancy); chiro plateau; foot drop 3/5; EMG 04/20 active L5 denervation; later microdiscectomy and 5% WPI. Carrier stalling referral citing pre-existing degeneration.",
      criteria:"Must disclose rather than hide the 2018 record; establish the pre-morbid baseline (resolved, no restrictions, ~8 years asymptomatic); show objective change (MRI impingement, foot drop, EMG denervation); state the Eggshell Plaintiff rule correctly (recovery for the increase in disability); recommend concrete next steps (escalation ladder for the referral, request 2018 discharge note, treating-physician causation opinion); flag the 3mm/5mm MRI discrepancy. No legal opinions inside medical notes."}))},
  {label:"The Transportation Wall", html: part("C. Flash-Simulation — The Transportation Wall",
    "John is 4 weeks into a 12-week intensive chiropractic program and doing great. He calls: his replacement car's transmission just died. “It's a 45-minute drive. I might as well just quit the program and try again next year when I have money saved.”",
    choice("cmTreatment1:option", ["<b>Option A — The Problem Solver:</b> look up bus routes, call a local non-profit for ride vouchers, email John the schedule.", "<b>Option B — The Empowerer:</b> ask John what transportation exists in his neighborhood and brainstorm ride options for tomorrow together.", "<b>Option C — The Clinical Pivot:</b> contact the clinic to arrange temporary telehealth / a home program while the car issue is solved."])
    + aiTask("cmTreatment1:girp", {label:"Your approach + the GIRP note you'd put in the file", exercise:"Transportation Wall — approach and GIRP note",
      extra: ()=>"Option chosen: " + choiceText("cmTreatment1:option"),
      context:"Client threatens to quit a 12-week chiro program at week 4 because his car broke down and the clinic is 45 minutes away. Lessons: facilitation, warm handoff, empowerment vs mission creep, treatment gaps weaken the claim, GIRP documentation (Goal, Intervention, Response, Plan).",
      criteria:"Must justify the option (combining options is acceptable if reasoned), prevent a treatment gap concretely (warm handoff, ride resource, telehealth/home program, clinic scheduling), educate John on why consistent treatment matters without legal advice, and include a correct 4-part GIRP note with a dated plan. Penalize accepting the dropout or promising outcomes."})
    + `<div style="margin-top:18px">${renderCrisisRoleplaySection("cmTreatment1", "Live call — rehearse it with the AI playing John")}</div>`
    + cmsStep("cmTreatment1:cms", "In John's CMS case, add your GIRP note, update the treatment timeline (including the 04/01–04/15 gap and its documented cause), and upload the PT / chiro / neuropsych records under <b>Medical</b>."))}
];

/* ---------- DAY 2 · Pre-Demand & Demand Audit ---------- */
TOOLS.cmPreDemand2 = ()=>[
  {label:"Kill the “Low-Speed” Argument", html: part("A. Audit Challenge 1 — “This was a low-speed impact”",
    "Aggressive Casualty emails: <i>“This was a low-speed impact; your client's injuries are exaggerated.”</i> Select the details that <b>objectively</b> disprove it.",
    docPacket(["JD01","JD07","JD08","JD04","JD11"], "Evidence")
    + checklist("cmPreDemand2:lowspeed", [
      {t:"Mechanical extrication — Jaws of Life required; extricated at 15:05 (EMS + police report).", ok:true, why:"Objective, third-party documented force of impact."},
      {t:"Heavy T-bone intrusion at the driver-side B-pillar; Tesla Model Y declared a total loss ($42,500).", ok:true, why:"Property damage that matches a high-energy mechanism."},
      {t:"Airbag deployment and side-window glass driven into John's face (3 tempered-glass shards removed).", ok:true, why:"Physical evidence of violent intrusion."},
      {t:"Level 1 Trauma activation; EMS: GCS 14, BP 168/104, pulse 112, 10/10 pain.", ok:true, why:"Objective vitals and trauma triage."},
      {t:"John says he was terrified and the crash felt like “the worst thing ever.”", ok:false, why:"Subjective — true, but it doesn't objectively disprove speed."},
      {t:"The F-150 stayed functional with only bull-bar impact.", ok:false, why:"That's the defense's point — it helps them, not you."},
      {t:"John had a 2018 lumbar strain.", ok:false, why:"Irrelevant to impact speed (and a separate argument)."},
      {t:"The adjuster was rude on the phone.", ok:false, why:"Not evidence."}
    ]))},
  {label:"Reframe the 14-Day Gap", html: part("B. Audit Challenge 2 — Reframe the 14-day gap",
    "The adjuster wants to deny because John stopped treating 04/01–04/15. Write the demand-letter paragraph that turns the gap into evidence of severity.",
    docPacket(["JD18","JD15","JD17","JD11","JD09"], "Use these records")
    + aiTask("cmPreDemand2:gap", {label:"Your demand-letter paragraph on the treatment gap", exercise:"Reframing the 14-day gap in the demand",
      context:"Gap 04/01–04/15/2026. Before it: chiro visit #14 (04/02) patient requested a rest phase for mental exhaustion; PT note says patient entered clinical withdrawal. Neuropsych (Dr. Mindy Health, 04/18): PTSD with Acute Dissociative Withdrawal triggered after suture removal when he saw his facial disfigurement. Separately, the ER ordered 14 days of strict bed rest 02/14–02/28 (not a gap). Symptoms were consistent before and after (radiculopathy, foot drop, EMG denervation 04/20).",
      criteria:"Must acknowledge the gap plainly, give the documented clinical cause (cite the neuropsych evaluation and dates), connect it to the severity of the disfigurement (increasing value), show consistency of complaints before and after, and not confuse the ER bed-rest order with a gap. Apologetic or evasive tone scores low."}))},
  {label:"Real-Time Demand Audit", html: part("C. Real-Time Demand Audit — the specials table",
    "Your demand specialist's draft (Email 1 of the email exchange) is about to go out. Audit each line against the actual bills, records and PIP log. Anything the adjuster can attack is a defect.",
    docPacket(["JD29","JD24","JD25","JD26","JD13","JD19","JD32"], "Audit the demand against these")
    + flagTable("cmPreDemand2:demand", [
      {item:"“Metro Center Fire Dept — heavy mechanical extrication — $1,850”", shows:"EMS billing: A0427 ALS transport $1,850 + supplies $350 = $2,200 (Metro Center EMS), paid in full by PIP.", answer:"Defect", why:"Wrong provider and wrong amount — the fire department didn't bill; EMS total is $2,200 (PIP-paid)."},
      {item:"“Metro General Hospital — ER facility, Level 1 & lab — $12,400”", shows:"ER billing statement $12,700; PIP paid $7,800; hospital separately asserts a $45,000 lien.", answer:"Defect", why:"Amount doesn't match the bill, and the lien conflict is unaddressed."},
      {item:"“Specialist Surgeon Group — facial suture & plastic reconstruction — $3,200”", shows:"No bill on file from this group; the ER bill already includes CPT 13132 complex laceration repair $1,950.", answer:"Defect", why:"Unsupported — request the itemized bill or remove it."},
      {item:"“Metropolis Radiology — MRI spinal mapping — $2,100”", shows:"Metro Radiology & Imaging invoice: lumbar MRI $2,450 + $450, brain MRI $2,100 = $5,000.", answer:"Defect", why:"Wrong entity, and $2,100 is the BRAIN MRI — invites the 2021 migraine argument."},
      {item:"“City Chiropractic & Rehab — to date — $8,400”", shows:"Chiro statement on file totals $320 (two visits); records show at least 14 visits.", answer:"Defect", why:"Unverified figure — get the complete ledger with a final balance."},
      {item:"“Verified lost wages — $15,900 (W-2 supported)”", shows:"Exhibit G: payroll records + Dr. Spine's return-to-work restriction note attached.", answer:"OK", why:"Both employer proof and the doctor's disability note are there."},
      {item:"“Future care (5-yr) — $57,000 (Dr. Spine)”", shows:"The adjuster notes the packet shows $15,000 on page 2 and $57,000 on page 18.", answer:"Defect", why:"Internal inconsistency — reconcile to one supported life-care figure."},
      {item:"Narrative: “March 10, 2026 MRI revealed a 3mm herniation at L4-L5”", shows:"MRI report dated 03/15/2026: 5mm protrusion impinging the left L5 root.", answer:"Defect", why:"Wrong date and size — undermines credibility."},
      {item:"Narrative: EMG 04/20/2026 — active denervation, left L5", shows:"Matches the medical chronology exhibit.", answer:"OK", why:"Accurate and objective."},
      {item:"Narrative: 14-day gap explained by Dr. Mindy Health's PTSD evaluation", shows:"Neuropsych eval 04/18/2026 on file.", answer:"OK", why:"Documented and front-loaded — correct."},
      {item:"Specials omitted from the table", shows:"Dr. Spine EMC $1,200, surgeon's fee, independent anesthesiologist (Dr. Vapor), surgical facility ($6,150 per lien), PT $560.", answer:"Defect", why:"Missing specials lower the Colossus-style valuation — add them with bills."},
      {item:"Policy limits check before sending", shows:"Aggressive Casualty dec page: $1,000,000 CSL, PD denied.", answer:"OK", why:"Limits verified — the $250,000 demand is inside limits."}
    ], ["OK","Defect"])
    + aiTask("cmPreDemand2:tasks", {label:"Assign the fixes (who does what, by when, which document)", exercise:"Demand audit — task assignment", rows:140,
      context:"Defects found in the draft demand's specials and narrative (wrong EMS/ER/MRI/chiro amounts and entities, unsupported plastic-surgery line, future-care inconsistency, MRI date/size, omitted surgeon/anesthesia/facility/PT/EMC bills, hospital lien conflict).",
      criteria:"Each task must name the defect, the owner (demand specialist, records team, CM), the exact document to obtain or correct, and a due date that keeps the 30-day policy-limit clock safe. Tasks should be logged in the CMS. Vague 'fix the numbers' scores low."})
    + cmsStep("cmPreDemand2:cms", "Log each demand fix as a <b>Task</b> in John's CMS case (the <b>+ Add Task</b> button), and upload the corrected bills under <b>Bills</b> / <b>Invoices</b>.") + toolStep("chartswap", "cmPreDemand2:records", "Request the itemized bills and records for every special missing from the demand draft (Dr. Spine EMC, the surgeon's fee, anesthesiologist Dr. Vapor, the surgical facility, PT), so each figure in the demand has a bill behind it."))}
];

/* ---------- DAY 2 · Negotiation Math & BI Settlement ---------- */
TOOLS.cmNegotiate2 = ()=>[
  {label:"The Math Check", html: part("A. The Integrity Audit — accept or reject $45,000?",
    "Aggressive Casualty's counteroffer (Email 2, 05/22/2026) is $45,000 “full and final.” Run the net math before you say a word. Use the retainer's fee tier (the suit hasn't been filed at this point: 33⅓%) and the lien letters exactly as asserted.",
    docPacket(["JD29","JD05","JD31","JD30","JD24","JD26","TPL2"], "Ledger sources")
    + scenario(`<b>Billed balances still open after PIP</b> (from the statements): ER $12,700 − $7,800 PIP = $4,900 · Dr. Spine $1,200 · MRI $5,000 · Chiro $320 · PT $560.`)
    + calc("cmNegotiate2:math", [
      {label:"Attorney fee at 33⅓% of $45,000", answer:15000, tol:1},
      {label:"<b>Scenario 1 — liens as asserted:</b> net to client after the fee, prior counsel ($1,200), Metro General ($45,000), BlueCross ERISA ($20,000) and Global Health ($11,200)", answer:-47400, tol:2, hint:"45,000 − 15,000 − 1,200 − 45,000 − 20,000 − 11,200"},
      {label:"<b>Scenario 2 — conservative:</b> total open billed balances after PIP", answer:11980, tol:1, hint:"4,900 + 1,200 + 5,000 + 320 + 560"},
      {label:"Scenario 2 net: $45,000 − fee − prior counsel − open balances − BlueCross ERISA $20,000", answer:-3180, tol:2},
      {label:"Dr. Spine's 5-year future care projection left unfunded by this offer", answer:57000, tol:1}
    ], `<b>Conclusion:</b> in every realistic scenario the client nets <b>less than zero</b> and his $57,000 of future care is unfunded — the offer cannot be accepted. Next: break the adjuster.`))},
  {label:"Break the Adjuster", html: part("B. The Rebuttal — push toward $180,000–$220,000",
    "The adjuster holds a $75,000 ceiling and relies on three arguments: the 2018 record, the 14-day gap, and collateral source (“Global Health only paid $11,200”). Write the reply that cracks them.",
    docPacket(["JD29","JD22","JD18","JD20","JD21","JD30"], "Your ammunition")
    + aiTask("cmNegotiate2:rebuttal", {label:"Your rebuttal email to Aggressive Casualty", exercise:"Settlement rebuttal — Eggshell Plaintiff & Trauma-Induced Dissociative Withdrawal",
      context:"Adjuster: 2018 'chronic' back pain with no MRI; gap = recovery; collateral source — only $11,200 paid; $45,000 offer. Facts: 2018 resolved at MMI 09/15/2018 with no restrictions, ~8 years asymptomatic; EMG active L5 denervation; microdiscectomy; 5% WPI; permanent light duty; can't lift his 2-year-old; facial disfigurement; PTSD/dissociative withdrawal explains gap; $1M CSL; demand $250,000; ceiling $75,000; target $180k–$220k.",
      criteria:"Strong answers use the Anchor technique (no apology), deploy the Eggshell Plaintiff doctrine correctly, reframe the gap as trauma-induced dissociative withdrawal with the dated evaluation, answer collateral source (paid amounts ≠ value; future care and general damages), reference permanency/earning capacity, set a firm deadline, and avoid bidding against themselves. Never promise the client anything; no misstatements of fact (e.g., wrong MRI size)."})
    + `<div style="margin-top:18px">${renderCrisisRoleplaySection("cmNegotiate2", "Live negotiation — rehearse it with the AI playing the adjuster")}</div>`)},
  {label:"The Pincer & the Release", html: part("C. Caught in an Operational Pincer — and the release they sent",
    "Before John signs, Dr. Ron's report confirms permanent nerve damage (5% WPI). The adjuster emails: <i>“I need the signed release in 5 minutes, or I'm revoking the $100,000 policy-limits tender permanently.”</i> Apex is out of business; the $1,000,000 CSL is the only asset. The release they sent is in your packet.",
    docPacket(["JD33","JD27","JD28","TPL5","TPL4"], "Release audit")
    + checklist("cmNegotiate2:release", [
      {t:"The release covers “hidden, progressive or unknown” future injuries — a global release of everything.", ok:true, why:"Overbroad for a client with new permanency findings."},
      {t:"§II makes the client AND his legal counsel personally liable to defend Apex and pay any lien judgment.", ok:true, why:"Unacceptable personal-liability indemnity."},
      {t:"§III waives all UM/UIM rights — destroying the Local Farm Mutual $250k/$500k claim.", ok:true, why:"Never sign away UM without the carrier's consent and a reason."},
      {t:"The lien ledger lists only the $11,200 Global Health lien — Metro General, BlueCross ERISA and prior counsel are missing.", ok:true, why:"Understated liens + indemnity = the client pays later."},
      {t:"“Completely disregarding any ongoing clinical therapies” — future care is extinguished.", ok:true, why:"Conflicts with the $57,000 future-care need."},
      {t:"The release includes a non-admission of liability clause.", ok:false, why:"Standard and acceptable."},
      {t:"The release requires notarization.", ok:false, why:"Normal for high-value BI releases."}
    ], "Check my release audit")
    + aiTask("cmNegotiate2:pincer", {label:"Your step-by-step action plan (script for John · malpractice mitigation · response to the 5-minute threat)", exercise:"BI settlement pincer — action plan", rows:180,
      context:"Facts: liability clear (red light, citations); permanent nerve damage + 5% WPI arrived before signature; client furious; adjuster threatens to revoke a $100,000 tender in 5 minutes; Apex is out of business, only asset is the $1,000,000 CSL policy; team had anchored to a conservative target; the proposed release is defective (global, personal indemnity for counsel, UM waiver, understated liens).",
      criteria:"Required: (1) a calm, plain-language de-escalation script for John that doesn't give legal advice and explains why he must not sign now; (2) a malpractice-mitigation plan — stop signature, document everything, notify the handling attorney immediately, re-evaluate against the $1M CSL, protect UM with a consent-to-settle/waiver request; (3) a response to the 5-minute threat — put the new permanency evidence in writing with a reasonable time-limited policy-limits demand and invoke the insurer's good-faith duty (a unilateral 5-minute ultimatum on new permanency evidence creates bad-faith/excess exposure for a $1M policy), and refuse the defective release in favor of a proper BI-only release. Signing now, or ignoring UM, scores low."}))}
];

/* ---------- DAY 3 · UM & Lien Reduction ---------- */
TOOLS.cmLien3 = ()=>{
  const buckets = [
    {k:"A", name:"Prior counsel — Barry Slow (quantum meruit)", asserted:1200, floor:400, arg:"Pay documented costs; challenge clerical hours (intake, ordering the police report) as overhead — quantum meruit covers only legal work that benefited the case", args:["Pay documented costs; challenge clerical hours (intake, ordering the police report) as overhead — quantum meruit covers only legal work that benefited the case","Common Fund Doctrine — prior counsel shares our fee","Made Whole Doctrine — prior counsel recovers nothing","Pay it in full — prior counsel liens can't be negotiated"]},
    {k:"B", name:"BlueCross Recovery Services — ERISA self-funded plan", asserted:20000, floor:0, arg:"Demand itemization and remove duplicates/unrelated charges (the only itemized payments total $11,200); ERISA plan terms override Made Whole/Common Fund, so negotiate a written reduction", args:["Demand itemization and remove duplicates/unrelated charges (the only itemized payments total $11,200); ERISA plan terms override Made Whole/Common Fund, so negotiate a written reduction","Made Whole Doctrine — the client isn't made whole, so BlueCross gets $0","Common Fund Doctrine — automatic one-third reduction","Comparative fault — reduce by the client's share of fault"]},
    {k:"C", name:"Metro General Hospital — statutory hospital lien", asserted:45000, floor:0, arg:"Billing audit: the hospital's own statement is $12,700, PIP paid $7,800 and the health plan paid its contract rate — it can't double-recover face value; strip the lien to the verified balance", args:["Billing audit: the hospital's own statement is $12,700, PIP paid $7,800 and the health plan paid its contract rate — it can't double-recover face value; strip the lien to the verified balance","Quantum meruit","Comparative fault","Accept the $45,000 — statutory liens can't be reduced"]}
  ];
  toolState.cmLienBuckets = buckets;
  return [
  {label:"UM Bad-Faith Scenario", html: part("A. Skill Building — The Bad-Faith Arbitrage & the Permanent Deficit",
    "Hypothetical variation: John is hit by a completely uninsured driver. You pursue his UM coverage (use a $100,000 UM limit for this exercise — his real Local Farm Mutual dec page shows $250,000/$500,000). The adjuster offers $42,000 “verbally, right now” or they force arbitration. Dr. Ron's report just arrived: acute L4-L5 herniation, 5% WPI, permanent nerve damage caused by the crash.",
    docPacket(["JD28","JD20","JD21","JD22","TPL4"], "Documents")
    + aiTask("cmLien3:um", {label:"Your step-by-step action plan", exercise:"UM settlement — bad-faith arbitrage", rows:170,
      context:"First-party UM claim; adjuster demands verbal acceptance of $42,000 immediately; new permanency evidence (5% WPI, permanent nerve damage); prior 2018 strain resolved; 14-day gap explained by PTSD.",
      criteria:"Must refuse verbal acceptance under pressure, serve the new permanency report with a formal time-limited policy-limits demand, document the carrier's conduct for a first-party bad-faith claim, explain the offset/gap valuation, protect the client (no legal advice from the CM; attorney decides), and log everything in the CMS. Accepting $42,000 scores low."}))},
  {label:"The Final Net Challenge", html: part("B. The “Doe v. Apex” Final Net Challenge — find at least $3,000",
    "Hypothetical <b>$50,000 gross</b> settlement for Apex's commercial van, no UM. Fee 33⅓%. Start from the lien letters <b>exactly as asserted</b>, pick the right argument for each bucket, and set the reduced amount you can defend. The net updates live.",
    docPacket(["JD31","JD30","JD24","JD26","JD02","TPL2"], "Lien letters & ledgers")
    + `<table class="cm-table"><thead><tr><th>Bucket</th><th>Asserted</th><th>Your argument</th><th style="width:140px">Reduced amount</th></tr></thead><tbody>
      ${buckets.map((b,i)=>`<tr id="lienrow_${i}"><td><b>${b.k}. ${E(b.name)}</b><span class="cm-why" id="lienwhy_${i}"></span></td><td>${money(b.asserted)}</td>
        <td><select id="lienarg_${i}" onchange="cmLienCalc()"><option value="">— choose —</option>${b.args.slice().sort().map(a=>`<option>${E(a)}</option>`).join("")}</select></td>
        <td><input id="lienamt_${i}" type="number" step="0.01" value="${b.asserted}" oninput="cmLienCalc()" style="width:120px"></td></tr>`).join("")}
      </tbody></table>
      <div class="cm-scn" id="lienNet"></div>
      <button class="btn btn-ghost btn-sm" onclick="cmLienCheck()">Check my reductions</button><div class="cm-res" id="lienRes"></div>`)},
  {label:"Zero-Recovery Letter", html: part("C. Draft the “Zero-Recovery” letter to BlueCross",
    "Read BlueCross's notice carefully before you write: it says the plan is self-funded under ERISA and rejects Made Whole and Common Fund unless agreed in writing. A letter that only argues Made Whole will fail.",
    docPacket(["JD31","JD30","JD03"], "Read first")
    + aiTask("cmLien3:letter", {label:"Your letter to BlueCross Recovery Services", exercise:"Zero-Recovery / lien reduction letter — ERISA plan", rows:190,
      context:"BlueCross notice (03/10/2026): self-funded ERISA plan, first-priority reimbursement, no made-whole, no common fund, $20,000 'to date'. Separate 'Global Health Blue-Shield' statutory lien itemizes $11,200 for ER $4,200, MRI $850, surgical facility $6,150. Client's plan: BCBS ERISA Group BC-441-A. Gross settlement (exercise) $50,000; client has permanent injuries and $57,000 future care.",
      criteria:"Top answers: request the plan document (SPD) and itemized payment ledger; confirm whether the plan is truly self-funded (if insured, state law and Made Whole/Common Fund may apply); challenge the $20,000 vs the $11,200 itemization and possible duplication with the Global Health lien; strip unrelated charges; propose a specific reduced figure with hardship/procurement-cost reasoning; ask for written agreement and a final payoff letter before disbursement; professional tone. Relying only on Made Whole without addressing ERISA should score low on Accuracy."})
    + `<div style="margin-top:18px">${renderCrisisRoleplaySection("cmLien3", "Live lien negotiation — the AI plays the lienholder")}</div>`
    + cmsStep("cmLien3:cms", "Upload the lien letters under <b>Others</b> in John's CMS case, add a <b>Lien Entry</b> for each lienholder with the asserted and negotiated amounts, and attach your net sheet (use <b>LSH Net Sheet v2</b> from 📁 Case Documents → Templates).")) }
  ];
};
window.cmLienCalc = function(){
  const b = toolState.cmLienBuckets||[]; const gross = 50000, fee = gross/3;
  let asserted = 0, reduced = 0;
  b.forEach((x,i)=>{ asserted += x.asserted; const v = parseFloat((document.getElementById("lienamt_"+i)||{}).value); reduced += isNaN(v)?x.asserted:v; });
  const before = gross - fee - asserted, after = gross - fee - reduced;
  const el = document.getElementById("lienNet");
  if(el) el.innerHTML = `Gross ${money(gross)} − fee ${money(fee)} − liens → <b>net before ${money(before)}</b> · <b>net after your reductions ${money(after)}</b> · <b style="color:${after-before>=3000?"var(--success)":"var(--danger)"}">found ${money(after-before)}</b>`;
  return {before, after, gain:after-before};
};
window.cmLienCheck = async function(){
  const b = toolState.cmLienBuckets||[]; let ok = 0; const n = b.length*2 + 1;
  b.forEach((x,i)=>{
    const arg = (document.getElementById("lienarg_"+i)||{}).value, amt = parseFloat((document.getElementById("lienamt_"+i)||{}).value);
    const argOk = arg===x.arg, amtOk = !isNaN(amt) && amt < x.asserted && amt >= x.floor;
    ok += (argOk?1:0) + (amtOk?1:0);
    const row = document.getElementById("lienrow_"+i); if(row){ row.classList.toggle("ok", argOk&&amtOk); row.classList.toggle("bad", !(argOk&&amtOk)); }
    const w = document.getElementById("lienwhy_"+i);
    if(w) w.textContent = (argOk?"✓ Right argument. ":"✗ Better argument: "+x.arg+". ") + (amtOk?"":(amt>=x.asserted?"Reduce it — you left it at the asserted amount.":"Below a defensible floor (documented costs must still be paid)."));
  });
  const r = cmLienCalc(); if(r.gain >= 3000) ok++;
  const score = Math.round(ok/n*100);
  document.getElementById("lienRes").innerHTML = `<b style="color:${score>=80?"var(--success)":"var(--danger)"}">${score}%</b> — you found ${money(r.gain)} for the client${r.gain>=3000?" ✓":" (target: at least $3,000)"}.
    <p style="font-size:12.5px;color:var(--ink-soft);margin:6px 0 0">Trainer reference: the deck's SOP targets were A → $600, B → reduce by $3,100, C → reduce by $2,500. With the real lien letters the biggest gain is Metro General's $45,000 claim against a $12,700 bill that PIP and the health plan have already paid in part.</p>`;
  await scorePart("cmLien3:net", score);
};

/* ---------- DAY 3 · Disbursement & Closing ---------- */
TOOLS.cmClosing3 = ()=>[
  {label:"Reconcile the $150,000", html: part("A. Reconcile the gross settlement against every lien and cost",
    "John's case settled for <b>$150,000</b> after the First Amended Complaint was filed. Read the retainer before you calculate: the fee tier changed when suit was filed, and §4 deducts costs <i>before</i> the fee is calculated.",
    docPacket(["JD05","JD35","TPL3","TPL2"], "Rules & templates")
    + scenario(`<b>Advanced case costs (receipts on file):</b> filing fee & summons $435 · process server $150 · mediation share $1,200 · medical records $265 · postage $40.<br>
      <b>Final payoff letters received:</b> Metro General $4,900 · BlueCross ERISA $9,500 · Dr. Sarah Spine (LOP) $6,000 · Metro Radiology & Imaging $3,500 · City Chiropractic (LOP, reduced) $2,400 · Metro Physical Therapy $1,100 · Barry Slow (agreed) $600.`)
    + calc("cmClosing3:recon", [
      {label:"Total advanced case costs", answer:2090, tol:1},
      {label:"Attorney fee (retainer tier after suit is filed, on gross − costs)", answer:59164, tol:2, hint:"40% × (150,000 − 2,090). If you used 33⅓%, check the retainer — suit was filed."},
      {label:"Total liens per final payoff letters", answer:28000, tol:1},
      {label:"Net to client", answer:60746, tol:3, hint:"150,000 − 2,090 − 59,164 − 28,000"}
    ]))},
  {label:"Audit-Ready?", html: part("B. Is the file “Audit Ready”? Final Case Reconciliation Checklist",
    "Before a case is marked Archived, all four document sets must be present. Here is the file inventory — select every item that <b>blocks archiving</b> until it's fixed.",
    checklist("cmClosing3:audit", [
      {t:"Signed, notarized BI release (ID matched to claimant).", ok:false, why:"Present and valid."},
      {t:"Client-signed settlement statement.", ok:false, why:"Present."},
      {t:"City Chiropractic was paid $2,400 — no signed Satisfaction of Lien in the file.", ok:true, why:"Without it the provider can still send John to collections."},
      {t:"Bank confirmation (transaction ID) missing for the Metro Physical Therapy payment.", ok:true, why:"Every payment needs a transaction ID for the money trail."},
      {t:"No signed Acknowledgment of Receipt from John for his net check.", ok:true, why:"Proof of delivery is one of the four sets."},
      {t:"No Duplication-of-Benefits statement from John.", ok:true, why:"Compliance & identity set."},
      {t:"Suit was filed — no Stipulation / Dismissal with Prejudice on file.", ok:true, why:"The settlement isn't over until the court is notified."},
      {t:"Internal closing memo not written.", ok:true, why:"Explains how it started vs how it ended."},
      {t:"Current W-9 from the firm on file.", ok:false, why:"Present."},
      {t:"Zero-balance report: approved budget − total disbursed = $0.00.", ok:false, why:"Present — the math closes."}
    ], "Check my audit"))},
  {label:"Closing Letter & Plot Twist", html: part("C. Closing letter — then the plot twist",
    "Write John's closing letter. Then: after it's sent, a <b>$1,200 statement from Riverview Radiology Imaging Center</b> arrives for 06/02/2026 imaging referred by Dr. Spine — not on your ledger. John is furious.",
    docPacket(["JD42","JD33","TPL3"], "Plot twist documents")
    + aiTask("cmClosing3:letter", {label:"Your closing letter to John", exercise:"Case closing letter", rows:150,
      context:"Gross $150,000; costs $2,090; fee 40% on net of costs $59,164; liens $28,000; net $60,746. Case closed with dismissal pending.",
      criteria:"Plain-language summary of gross → net with each deduction, confirmation that listed liens are satisfied (and what documents prove it), what happens next (dismissal, records retention), who to contact, warm professional tone, no new legal advice."})
    + aiTask("cmClosing3:twist", {label:"The $1,200 bill: your next steps and who is accountable", exercise:"Post-closing lien surprise", rows:150,
      context:"Riverview Radiology $1,200, DOS 06/02/2026 (post-op x-ray and C-spine CT), referred by Dr. Spine, first statement 08/04/2026, no insurance billed. The signed release's lien/indemnity clause makes the claimant responsible for medical liens. The CM's final records sweep missed this provider.",
      criteria:"Verify the bill is accident-related and correct (DOS, CPT, referral, DOB); own the missed sweep with the client honestly; explain that under the release's lien/indemnity clause the obligation stays with the claimant, while the firm helps resolve it (bill health insurance/PIP-MedPay if available, negotiate a reduction or a write-off citing the settlement, check whether anything remains in trust); inform the attorney; prevent recurrence (final sweep of all referrals before disbursement). Blaming the client or saying 'not our problem' scores low."})
    + cmsStep("cmClosing3:cms", "In the CMS: update John's <b>Financial Ledger</b>, upload the closing letter under <b>Case Files</b> and the late bill under <b>Bills</b>, then mark the case phase accordingly."))}
];

/* ---------- DAY 4 · Mediation ---------- */
TOOLS.cmMediation4 = ()=>[
  {label:"Mediation Logistics", html: part("A. Mediation Protocols — logistics calls",
    "Opposing counsel suggests “a quick Zoom mediation next Tuesday.” Select every action a Case Manager should take.",
    checklist("cmMediation4:logistics", [
      {t:"Collect 3–4 workable windows from John, the handling attorney and opposing counsel before contacting the mediator's office.", ok:true, why:"Unified availability."},
      {t:"Check whether John needs an interpreter.", ok:true, why:"Part of the scenario checklist."},
      {t:"Protect a 2-hour pre-mediation buffer for the handling attorney.", ok:true, why:"Prep time before the session."},
      {t:"Set up private Zoom breakout rooms ahead of time.", ok:true, why:"Protects confidential strategy."},
      {t:"Launch Zoom 15 minutes early to brief John on what to expect.", ok:true, why:"Client prep."},
      {t:"Accept opposing counsel's date immediately to show good faith.", ok:false, why:"Check calendars and prep first."},
      {t:"Email our Confidential Mediation Brief to defense counsel so they can prepare.", ok:false, why:"Confidential — it goes to the mediator, not the defense."},
      {t:"If opposing counsel rejects every window, log it in the CMS and escalate to the attorney for an attorney-to-attorney call.", ok:true, why:"The trainer's Q&A answer."}
    ]))},
  {label:"Build the Binder", html: part("B. Build the 6-section Mediation Binder",
    "Place each document in its section — or keep it out. Two items look useful but must never go into a binder the mediator sees.",
    docPacket(["JD37","JD35","JD34","JD36","JD07","JD23","JD24","JD32","JD20","JD29","TPL5","JD04","JD33"], "Available documents")
    + sorter("cmMediation4:binder", [
      {t:"Case CM Snapshot Sheet (you prepare it: parties, file #s, counsel contacts)", z:"1. Executive Summary & Admin", why:"First page the attorney sees."},
      {t:"Stipulated Order (mediation deadline 06/18) / fee split", doc:"JD37", z:"1. Executive Summary & Admin", why:"Mediation order/agreement + schedule."},
      {t:"Our Confidential Mediation Brief", z:"2. Mediation Briefs", why:"Our arguments and settlement position."},
      {t:"Opposing Counsel's Mediation Brief", z:"2. Mediation Briefs", why:"Side-by-side for rebuttals."},
      {t:"First Amended Complaint (operative)", doc:"JD35", z:"3. Core Pleadings", why:"The active complaint."},
      {t:"Answer & Affirmative Defenses", doc:"JD36", z:"3. Core Pleadings", why:"Shows what the defense actually pleaded (no seatbelt defense)."},
      {t:"Original Complaint (06/01)", doc:"JD34", z:"Keep out of the binder", why:"Superseded — remove to prevent confusion."},
      {t:"Police Report 2026-0214-AX + color scene photos", doc:"JD07", z:"4. Key Evidence & Liability", why:"The smoking guns."},
      {t:"Medical chronology + provider bills (verified ledger)", doc:"JD24", z:"5. Damages, Financials & Experts", why:"Justifies the number."},
      {t:"Lost wage verification ($15,900)", doc:"JD32", z:"5. Damages, Financials & Experts", why:"Proof of financial loss."},
      {t:"Dr. Neil Ron permanency report (5% WPI)", doc:"JD20", z:"5. Damages, Financials & Experts", why:"Expert/medical opinion."},
      {t:"Negotiation log (demand $250k → counter $45k → rejected)", doc:"JD29", z:"6. Settlement History & Drafts", why:"Prevents baseline confusion."},
      {t:"Standard Safe Settlement Release (draft terms)", doc:"TPL5", z:"6. Settlement History & Drafts", why:"Ready for signatures if a deal is reached."},
      {t:"Master Case Summary — Internal Attorney Summary, Do Not Distribute", doc:"JD04", z:"Keep out of the binder", why:"Attorney work product — never in a binder the mediator or client copy could expose."},
      {t:"Aggressive Casualty's proposed global release", doc:"JD33", z:"Keep out of the binder", why:"Defective — don't hand the defense a draft we've rejected."}
    ], ["1. Executive Summary & Admin","2. Mediation Briefs","3. Core Pleadings","4. Key Evidence & Liability","5. Damages, Financials & Experts","6. Settlement History & Drafts","Keep out of the binder"]))},
  {label:"Pre-Mediation Audit", html: part("C. The LSH Critical Thinking Challenge — Pre-Mediation Audit",
    "It's June 18, 2026 — hours before the hard mediation completion deadline. The lead attorney is in court. Solve the two landmines.",
    scenario(`<b>Problem 1:</b> Jane Vance calls: <i>“Your medical ledger is completely unverified. We won't extend a real offer while your damages are unsubstantiated.”</i><br><b>Problem 2:</b> Metro General asserts a <b>$45,000</b> hospital lien; BlueCross Recovery Services asserts a <b>$20,000</b> ERISA subrogation lien — and a “Global Health Blue-Shield” notice itemizes <b>$11,200</b> paid for ER, MRI and the surgical facility.`)
    + docPacket(["JD24","JD25","JD26","JD31","JD30","JD29"], "Audit these")
    + aiTask("cmMediation4:audit", {label:"Your audit memo to the handling attorney (both landmines)", exercise:"Pre-mediation audit — two landmines", rows:190,
      context:"Bills: EMS $2,200 (PIP), ER $12,700 (PIP $7,800), EMC $1,200, MRI $5,000, chiro/PT partial. Liens: Metro General $45,000 (ER $18,500 / radiology $12,400 / surgical $14,100); BlueCross ERISA $20,000 'to date'; Global Health $11,200 (ER $4,200, MRI $850, facility $6,150). Demand specials table contains unverified/incorrect lines.",
      criteria:"Problem 1: pull certified itemized ledgers from every provider, reconcile against the PIP log and liens, fix the demand's wrong lines, and place verified proof in Section 5 (mark anything pending as 'Pending Final Verification' and tell the attorney). Problem 2: cross-reference EOBs — where the health plan paid Metro General at contract rate, the hospital cannot double-recover face value; strip/reduce the $45,000 lien to the verified balance; resolve whether BlueCross and Global Health are the same interest before logging one subrogation lien in Tab/Section 6. Clear BLUF memo, specific numbers."})
    + cmsStep("cmMediation4:cms", "Upload your assembled mediation binder (one OCR'd PDF, 6 numbered tabs) to John's CMS case under <b>Litigation</b>, and add a note for attorney approval. Use the <b>Mediation Binder QC Checklist</b> handout before you submit."))}
];

/* ---------- DAY 4 · Arbitration ---------- */
TOOLS.cmArbitration4 = ()=>[
  {label:"Sort the Scrambled File", html: part("A. The Arbitration Audit & 6-Tab Binder Build",
    "The previous Case Manager never logged the master schedule — the formal hearing is in 48 hours (06/20/2026). Sort the scrambled documents into the six tabs. Anything that fails trial-ready QC stays out.",
    docPacket(["JD37","JD38","JD41","JD34","JD35","JD36","JD07","JD40","JD13","JD24","JD12","JD22","JD20","JD32","JD31","JD04"], "The scrambled file")
    + sorter("cmArbitration4:tabs", [
      {t:"Plaintiff's Arbitration Brief — DRAFT v3", doc:"JD41", z:"Tab 1 — Arbitration Submissions", why:"Belongs in Tab 1 — but it must be finalized first (Sections III–IV are incomplete)."},
      {t:"AAA Arbitrator Fee Statement", doc:"JD38", z:"Tab 1 — Arbitration Submissions", why:"Fee disclosures — and QC shows our $4,800 deposit is outstanding."},
      {t:"Stipulated Arbitration & Scheduling Order", doc:"JD37", z:"Tab 1 — Arbitration Submissions", why:"Governing order."},
      {t:"First Amended Complaint (operative)", doc:"JD35", z:"Tab 2 — Core Pleadings", why:"The active complaint."},
      {t:"Original Complaint (superseded)", doc:"JD34", z:"Exclude — QC fail", why:"Old complaints must be removed."},
      {t:"Answer & Affirmative Defenses", doc:"JD36", z:"Tab 2 — Core Pleadings", why:"Defense framework."},
      {t:"Police Report 2026-0214-AX (unredacted)", doc:"JD07", z:"Tab 3 — Liability & Biomechanical", why:"Liability proof."},
      {t:"Scene photos — grayscale fax copy", doc:"JD40", z:"Exclude — QC fail", why:"Grayscale can be excluded — get the high-resolution color originals."},
      {t:"MRI Lumbar Report (5mm L4-L5)", doc:"JD13", z:"Tab 4 — Medical Damages", why:"Diagnostic imaging."},
      {t:"Provider bills / consolidated ledger", doc:"JD24", z:"Tab 4 — Medical Damages", why:"Verify dollar-for-dollar against invoices."},
      {t:"EMC Attestation — Dr. Spine", doc:"JD12", z:"Tab 4 — Medical Damages", why:"Medical necessity."},
      {t:"2018 Workplace Strain Record (resolved at MMI)", doc:"JD22", z:"Tab 5 — Prior Medical Shield", why:"Proactive disclosure of the prior injury."},
      {t:"Dr. Neil Ron — permanency / causation (5% WPI)", doc:"JD20", z:"Tab 5 — Prior Medical Shield", why:"Expert opinion paired with the prior record."},
      {t:"Lost wage verification", doc:"JD32", z:"Tab 6 — Economic Loss & Liens", why:"Economic loss."},
      {t:"Lien letters (Metro General, BlueCross, prior counsel)", doc:"JD31", z:"Tab 6 — Economic Loss & Liens", why:"Audited lien payout sheet — after stripping the double recovery."},
      {t:"Master Case Summary — Internal Attorney Summary", doc:"JD04", z:"Exclude — QC fail", why:"Work product never goes to the arbitrator."}
    ], ["Tab 1 — Arbitration Submissions","Tab 2 — Core Pleadings","Tab 3 — Liability & Biomechanical","Tab 4 — Medical Damages","Tab 5 — Prior Medical Shield","Tab 6 — Economic Loss & Liens","Exclude — QC fail"]))},
  {label:"Quality Control", html: part("B. Trial-ready QC — what must be fixed before the brief is filed?",
    "Select every issue that has to be fixed before the 06/18/2026 5:00 PM brief deadline.",
    checklist("cmArbitration4:qc", [
      {t:"Claimant's $4,800 arbitrator deposit is outstanding (due 06/16).", ok:true, why:"The hearing won't proceed — route to accounting now."},
      {t:"Brief Sections III (defenses) and IV (damages) are incomplete.", ok:true, why:"Must be finished and attorney-approved."},
      {t:"Scene photos only exist as a grayscale fax.", ok:true, why:"Get color originals or risk exclusion."},
      {t:"The superseded original complaint was in the file.", ok:true, why:"Remove it."},
      {t:"MRI described as “3mm / 03/10” in the chronology and demand but “5mm / 03/15” in the report.", ok:true, why:"Fix before it's used to impeach."},
      {t:"Provider bills show DOB 02/14/1980.", ok:true, why:"Request corrected records/bills."},
      {t:"Metro General's $45,000 lien listed at face value in Tab 6.", ok:true, why:"Strip the double recovery before the audited payout sheet goes in."},
      {t:"The police report doesn't list an independent witness.", ok:false, why:"A fact, not a QC defect — the citations carry liability."},
      {t:"The arbitrator is a retired judge.", ok:false, why:"Not an issue."}
    ], "Check my QC"))},
  {label:"Defeat the Pre-Existing Defense", html: part("C. The PI Critical Thinking Audit — write the Prior Medical Shield",
    "Jane Vance's Pre-Hearing Statement: <i>“Plaintiff has a documented 2018 lumbar strain. Because Plaintiff's counsel has failed to provide a baseline pre-accident MRI, the Arbitrator must conclude the current L4–L5 protrusions are a continuation of a pre-existing degenerative condition.”</i>",
    docPacket(["JD02","JD22","JD13","JD20","JD23"], "Pull the facts from these")
    + aiTask("cmArbitration4:shield", {label:"Your Section III draft for the Arbitration Brief (for attorney review)", exercise:"Arbitration brief — prior medical shield", rows:190,
      context:"2018: 08/12 L4-L5 strain, PT x4 weeks, 09/15 discharged at MMI, symptoms resolved, no restrictions, no MRI. Intake supplement: asymptomatic 7 yrs (other records ~8 yrs). 2026: acute 5mm L4-L5 protrusion impinging the L5 root; EMG active denervation; microdiscectomy; Dr. Ron: chronic axonal damage sustained during entrapment, 5% WPI.",
      criteria:"Must cite the explicit 2018 discharge facts (resolved in 4 weeks, MMI, no restrictions, no further treatment for ~8 years), pair them with the post-crash MRI/EMG/permanency findings, argue aggravation/Eggshell Plaintiff, explain why the absent 2018 MRI doesn't prove degeneration (no symptoms, no treatment, acute findings), and keep to case-manager drafting for attorney review (no UPL). Mislabeled dates or sizes lower Accuracy."})
    + cmsStep("cmArbitration4:cms", "Upload your finished 6-tab arbitration binder (OCR'd, color exhibits) to John's CMS case under <b>Litigation</b>, and add Tasks for every open QC item with owners and times."))}
];

/* ---------- DAY 5 · Litigation deadlines, file architecture & deposition prep ---------- */
TOOLS.cmLitigation5 = ()=>[
  {label:"Deadline Calculator", html: part("A. Master Timeline & Deadline Calculations",
    "Exclude the trigger day, include the last day. Add 3 days for mail (or e-service where your local rule allows it). If the last day lands on a weekend, it rolls to the next court day. Enter each deadline.",
    docPacket(["JD39","JD35","JD37","JD04"], "Source documents")
    + calc("cmLitigation5:dates", [
      {type:"date", label:"Defendant's RFAs served by U.S. Mail on 06/12/2026 — 30 days + 3 for mail", answer:"2026-07-15", hint:"06/12 + 33 days = Wed 07/15/2026"},
      {type:"date", label:"First Amended Complaint filed 06/10/2026 — 90-day service window", answer:"2026-09-08", hint:"Tue 09/08/2026"},
      {type:"date", label:"Defendant hand-served 06/15/2026 — federal Answer deadline (21 days)", answer:"2026-07-06", hint:"Mon 07/06/2026"},
      {type:"date", label:"Motion to Compel e-served 07/01/2026 — 14-day response + 3 (local e-service rule)", answer:"2026-07-20", hint:"Day 17 is Sat 07/18 → rolls to Mon 07/20/2026"},
      {type:"date", label:"Statute of Limitations for the 02/14/2026 collision (2 years, per the Master Case Summary)", answer:"2028-02-14", hint:"Mon 02/14/2028"}
    ]) + toolStep("docket", "cmLitigation5:docket", "Docket every deadline you just calculated: the RFA responses, the service deadline, the Answer, the Motion to Compel response and the SOL (02/14/2028). Give each one a 7-day and a 48-hour warning alert, and assign the handling attorney."))},
  {label:"File Architecture", html: part("B. Litigation File Architecture — route incoming documents",
    "Every litigated file uses the same five sub-folders under <b>[DOE, JOHN - CASE FILE]</b>. Route each incoming document within 48 hours.",
    sorter("cmLitigation5:folders", [
      {t:"Complaint_Filed_Stamped.pdf (First Amended Complaint)", z:"01_PLEADINGS"},
      {t:"Summons_Issued.pdf", z:"01_PLEADINGS"},
      {t:"Answer_and_Affirmative_Defenses.pdf", z:"01_PLEADINGS"},
      {t:"Affidavit_of_Service_Executed.pdf (Smith)", z:"02_SERVICE_DOCS"},
      {t:"ROGS_Sent.pdf (our interrogatories to Apex)", z:"03_DISCOVERY_PLAINTIFF_TO_DEFENDANT"},
      {t:"RFP_Sent.pdf", z:"03_DISCOVERY_PLAINTIFF_TO_DEFENDANT"},
      {t:"Def_RFAs_Received.pdf — 🔥 alert the attorney within the hour", z:"04_DISCOVERY_DEFENDANT_TO_PLAINTIFF", why:"RFAs are a structural fire."},
      {t:"Final_Verified_Responses_Served.pdf", z:"04_DISCOVERY_DEFENDANT_TO_PLAINTIFF"},
      {t:"Subpoena_Hospital_Records.pdf (Metro General)", z:"05_SUBPOENAS"},
      {t:"Proof_of_Subpoena_Service.pdf", z:"05_SUBPOENAS"}
    ], ["01_PLEADINGS","02_SERVICE_DOCS","03_DISCOVERY_PLAINTIFF_TO_DEFENDANT","04_DISCOVERY_DEFENDANT_TO_PLAINTIFF","05_SUBPOENAS"]))},
  {label:"KPI Docket Audit", html: part("C. Weekly KPI audit of your litigation docket",
    "Select every item that violates a litigation KPI.",
    checklist("cmLitigation5:kpi", [
      {t:"Rivera: complaint filed 3 days ago — no process server assigned yet.", ok:true, why:"Service Check: server assigned within 48 hours of filing."},
      {t:"Martinez: discovery responses due in 5 days — draft not yet sent to the attorney.", ok:true, why:"Discovery Countdown: drafts to the attorney 7 days before the deadline."},
      {t:"Okafor: client last contacted 41 days ago (nothing new in court).", ok:true, why:"30-Day Client Pulse."},
      {t:"Doe: RFAs received at 8:40 AM; attorney alerted at 9:05 AM.", ok:false, why:"Correct — within the hour."},
      {t:"Doe: Metro General subpoena outstanding; last reviewed 12 days ago.", ok:true, why:"Subpoena Audit every 10 days."},
      {t:"Doe: defense got a one-week extension by phone — no confirming email.", ok:true, why:"Document all extensions in writing."},
      {t:"Doe: Smith not served 16 days after the server got the packet — no skip trace run.", ok:true, why:"14-Day Service Milestone."},
      {t:"Martinez: responses handed to the attorney with every blank filled and a signature-ready verification page.", ok:false, why:"The “Clean” Discovery Check — correct."}
    ], "Check my audit"))},
  {label:"Deposition Prep", html: part("D. Preparing John for his deposition",
    "Run the pre-deposition audit, then rehearse. The AI plays John (nervous) — or the defense attorney trying the “Is That All?” and silent traps.",
    docPacket(["JD22","JD02","JD39","JD18"], "Pre-deposition audit: landmines")
    + renderCrisisRoleplaySection("cmLitigation5", "Live deposition prep")
    + cmsStep("cmLitigation5:cms", "In John's CMS case: log the calculated deadlines as <b>Tasks</b>, add the deposition date, note the prep session in <b>Case Notes</b>, and upload the pleadings under <b>Litigation</b>."))}
];

/* ---------- DAY 5 · Jordan Davies ---------- */
TOOLS.cmJordan5 = ()=>[
  {label:"Phase 1 — Find the Coverage", html: part("Phase 1 — Find all the coverage",
    "$50,000 in bills and an at-fault driver with a $10,000 BI policy. Review every dec page — check household addresses and resident-relative definitions.",
    docPacket(["JDV01","JDV03","JDV04","JDV05","JDV06","JDV07"], "Jordan Davies — coverage file")
    + flagTable("cmJordan5:coverage", [
      {item:"State General Auto — Kevin Brandt (at-fault) BI", shows:"$10,000 per person / $20,000 per accident.", answer:"Applies", why:"The underlying BI policy — tender it only after UIM consent."},
      {item:"Coastal Mutual — Jordan (named insured) UIM", shows:"$25,000 / $50,000, non-stacked (1 vehicle).", answer:"Applies", why:"His own policy."},
      {item:"Allied Mutual — Linda Davies (mother) UIM", shows:"$100,000 / $300,000 per vehicle, stacking on 2 vehicles; ‘family member’ = relative resident of the household. Jordan lives at her address.", answer:"Applies", why:"Resident relative → first-class insured; stacked up to $200,000 per person."},
      {item:"Summit Auto — Marcus Davies (brother) UIM", shows:"$50,000 / $100,000; Marcus lives at 88 Pinecrest Rd, Lakeside.", answer:"Does not apply", why:"Jordan isn't a resident of Marcus's household."},
      {item:"Coastal Mutual PIP", shows:"$10,000 — exhausted per the billing summary.", answer:"Medical only / exhausted", why:"First-party no-fault — already used."},
      {item:"Coastal MedPay", shows:"$5,000.", answer:"Medical only / available", why:"Use it for co-pays and gap bills."}
    ], ["Applies","Does not apply","Medical only / exhausted","Medical only / available"])
    + calc("cmJordan5:total", [
      {label:"Total potential BI + UIM recovery pool (per person)", answer:235000, tol:1, hint:"$10,000 + $25,000 + $200,000 (Allied stacked) — Summit excluded"}
    ]))},
  {label:"Phase 2 — The Call", html: part("Phase 2 — Get Jordan back into treatment",
    "Jordan stopped PT on 04/13 (“I can't afford it”). Dr. Nand ordered 6 more weeks and a shoulder surgery re-evaluation. Validate his fears, explain how a Letter of Protection (medical lien) works, and why stopping against medical advice gives the insurer an excuse to devalue his case — without giving legal advice.",
    docPacket(["JDV07","JDV01"], "Before you call")
    + renderCrisisRoleplaySection("cmJordan5", "Live call — the AI plays Jordan"))},
  {label:"Phase 3 — Fight the 50/50", html: part("Phase 3 — Fight the 50/50 liability split",
    "State General says Jordan ran the red light — based only on their insured's statement. Build your action plan: what evidence you request (today), and which carriers you place on notice to protect the UIM claims.",
    docPacket(["JDV02","JDV08","JDV04","JDV05"], "Liability file")
    + aiTask("cmJordan5:plan", {label:"Your action plan (evidence requests + notice letters + CMS documentation)", exercise:"Jordan Davies — liability dispute action plan", rows:190,
      context:"Police report: no citations, officer didn't witness, signal timing undetermined; unnamed bus driver 'Maria, Route 9' left before a statement; City DOT camera on NE mast; Quick-Fuel gas station CCTV on SW corner; vehicle totaled and towed. Adverse carrier letter: 50% fault on insured's statement only; $10k BI. Coverage: Coastal Mutual UIM $25k (Jordan), Allied Mutual UIM $100k x2 stacked (mother, resident relative), Summit (brother, not resident) doesn't apply.",
      criteria:"Must include immediate evidence preservation (spoliation/preservation letters to Quick-Fuel and City DOT — CCTV is often overwritten in ~30 days), locating the bus-driver witness through the transit authority (Route 9 schedule), 911/CAD audio, signal-timing charts, vehicle EDR data from the towed Accord, scene photos/PD estimate; a written dispute to State General citing the lack of independent evidence; notice letters to Coastal Mutual and Allied Mutual (not Summit) protecting UIM and requesting consent before any BI tender; LOP coordination for treatment; every step logged in the CMS with dates. Missing the Allied notice or including Summit lowers Accuracy."})
    + cmsStep("cmJordan5:cms", "Create Jordan Davies' case in the CMS (a separate file from John Doe). Upload the dec pages and police report, add Tasks for every evidence request and notice letter, and record the coverage stack."))}
];

/* ---------- the retained Calendar tool, re-built for a CM docket ---------- */
const _origCalBody = window.renderCalendarBody;
window.renderCalendarBody = function(body){
  const savedBrief = document.getElementById("calPromptInput") ? document.getElementById("calPromptInput").value : "";
  _origCalBody(body);               // builds the week grid (Part A) with the CM docket events
  const screens = body.querySelectorAll(".wizard-screen");
  if(screens.length < 4) return;
  // Part B: docket briefing for the handling attorney (written by the trainee)
  screens[1].innerHTML = part("Weekly Docket Briefing for the Handling Attorney",
    "Using your resolved week, write the BLUF briefing the attorney reads on Monday: hard deadlines first (brief deadline, SOL filing, RFA responses, strike list), what moved and why, what needs a decision.",
    `<textarea id="calPromptInput" class="cm-ta" style="min-height:170px" placeholder="BLUF: … &#10;Hard deadlines this week: … &#10;Moved: … &#10;Decisions needed: …"></textarea>
     <button class="btn btn-navy btn-sm" style="margin-top:10px" onclick="checkCalendarPrompt(this)">Get AI review</button><div id="calPromptResult" style="margin-top:10px"></div>`);
  screens[2].innerHTML = part("Proactive Case Manager Tasks",
    "A strong Case Manager spots what is missing from the calendar: warning alerts before hard dates, 30-day client pulses, subpoena audits, payoff-letter follow-ups. Generate an AI read of your current week.",
    `<button class="btn btn-orange btn-sm" onclick="generateProactiveTasks()">Generate proactive tasks</button><div id="proactiveResult" style="margin-top:14px"></div>`);
  screens[3].innerHTML = part("Hard-Code the John Doe Arbitration Dates",
    "The previous Case Manager never logged the master schedule. Read the Scheduling Order and enter the dates.",
    docPacket(["JD37","JD38"], "Scheduling Order") + calc("calendar:sched", [
      {type:"date", label:"Arbitrator strike list due", answer:"2026-06-08"},
      {type:"date", label:"Arbitrator retainer deposit due (ours is outstanding)", answer:"2026-06-16"},
      {type:"date", label:"Exhibit & witness lists exchanged", answer:"2026-06-17"},
      {type:"date", label:"Arbitration Brief deadline (5:00 PM)", answer:"2026-06-18"},
      {type:"date", label:"Arbitration Hearing (9:00 AM)", answer:"2026-06-20"}
    ]) + toolStep("docket", "calendar:docket", "Enter the five Scheduling Order dates on the firm docket with their times: the strike list, the retainer deposit, the exhibit and witness list exchange, the brief (5:00 PM) and the hearing (9:00 AM). Add a warning alert before each one."));
  const labs = ["Calendar Conflict Resolver","Docket Briefing for the Attorney","Proactive CM Tasks","Hard-Code the Arbitration Dates"];
  toolState.wizardLabels = labs;
  body.querySelectorAll(".wizard-dot").forEach((d,i)=>{ if(labs[i]) d.title = labs[i]; });
  const pl = document.getElementById("wizardPartLabel"); const idx = toolState.wizardIndex||0;
  if(pl) pl.textContent = `Part ${idx+1} of 4 — ${labs[idx]}`;
  if(savedBrief){ const t = document.getElementById("calPromptInput"); if(t) t.value = savedBrief; }
};
window.checkCalendarPrompt = async function(btn){
  const text = (document.getElementById("calPromptInput")||{}).value || "";
  const out = document.getElementById("calPromptResult");
  if(text.trim().length < 40){ toast("Write your briefing first."); return; }
  if(!(await useLabAttempt(4, "calendarBriefing"))) return;
  if(btn){ btn.disabled = true; }
  out.innerHTML = `<div class="ai-loading">Reviewing your docket briefing…</div>`;
  const week = calMergedEvents().sort((a,b)=>DAY_ORDER.indexOf(a.day)-DAY_ORDER.indexOf(b.day)||a.s-b.s).map(e=>`${e.day} ${fmtHr(e.s)}–${fmtHr(e.e)} ${e.t} (${e.p}, ${e.type})`).join("\n");
  try{
    const report = await runRubricEvaluation("Weekly docket briefing for the handling attorney", `THE TRAINEE'S RESOLVED WEEK:\n${week}`, text,
      "BLUF first; hard legal deadlines (arbitration brief deadline, SOL complaint filing, RFA response review, strike list, case plan filing) listed first with dates/times; conflicts resolved without moving hard deadlines, depositions or the mediation; what moved and why; decisions needed from the attorney; concise.");
    out.innerHTML = renderEvaluationReport(report, 4); toolState.calPromptReport = `${report.totalScore}%`;
    await bumpPracticeProgress("calendar", report.totalScore);
  }catch(e){ out.innerHTML = renderAiErrorBlock(e, "Couldn't review the briefing"); }
  if(btn){ btn.disabled = false; }
};
window.generateProactiveTasks = async function(){
  const out = document.getElementById("proactiveResult");
  out.innerHTML = `<div class="ai-loading">Reading your calendar…</div>`;
  const week = calMergedEvents().map(e=>`${e.day} ${fmtHr(e.s)} ${e.t} (${e.type})`).join("\n");
  try{
    const txt = await callAIText(`You are a senior personal-injury Case Manager coaching a trainee. Here is the trainee's week:\n${week}\n\nList 6 specific proactive tasks that are MISSING from this calendar (e.g., 30/14/7-day alerts before hard dates, preservation letters, payoff-letter follow-ups, 30-day client pulses, subpoena audits, W-9 requests, deposition prep packets). One line each: the task, the day to schedule it, and why. Plain text, numbered.`, 600);
    out.innerHTML = `<div class="card" style="padding:14px 18px;white-space:pre-wrap;font-size:13px">${E(txt)}</div>`;
  }catch(e){ out.innerHTML = renderAiErrorBlock(e, "Couldn't generate tasks"); }
};

/* ---------- tool dispatch ---------- */
const _origInitTool = window.initTool;
window.initTool = function(id){
  const body = document.getElementById("toolBody"); if(!body) return;
  if(TOOLS[id]){
    toolState.wizardIndex = toolState.wizardIndex || 0;
    const t = PRACTICE_TOOLS.find(x=>x.id===id);
    const parts = TOOLS[id]();
    body.innerHTML = renderToolWizard(dayOfTool(id), parts);
    if(id==="cmLien3") setTimeout(()=>window.cmLienCalc && cmLienCalc(), 0);
    if(document.getElementById("crChatWindow")) { try{ crRenderChatWindow(); }catch(e){} }
    return;
  }
  return _origInitTool(id);
};
/* the roleplay section needs toolState.cr set up before the wizard renders */
const _origRenderCr = window.renderCrisisRoleplaySection;
window.renderCrisisRoleplaySection = function(setKey, label){
  const sc = CRISIS_SCENARIO_SETS[setKey];
  if(sc && (!toolState.cr || toolState.cr.setKey!==setKey)){
    const opening = sc[0].script.split("\n")[0].replace(/^OPENING LINE[^:]*:\s*/,"").replace(/^"|"$/g,"");
    toolState.cr = {setKey, activeScenario: sc[0].id, chatHistory:[{role:"client", text: opening}]};
  }
  return _origRenderCr(setKey, label);
};
/* roleplay replies in Case-Manager terms */
window.crSendChat = async function(){
  const input = document.getElementById("crChatInput");
  const text = input.value.trim(); if(!text) return;
  if(!(await useLabAttempt(toolIdToDayId(toolState.cr.setKey), "crSendChat_"+toolState.cr.setKey))) return;
  toolState.cr.chatHistory.push({role:"ea", text}); input.value = ""; crRenderChatWindow();
  toolState.cr.chatHistory.push({role:"client", text:"…thinking…", pending:true}); crRenderChatWindow();
  const s = crCurrentScenario();
  const transcript = toolState.cr.chatHistory.filter(m=>!m.pending).map(m=>(m.role==="client"?"CALLER: ":"CASE MANAGER: ")+m.text).join("\n");
  const prompt = `You are roleplaying the other party in a personal-injury Case Management training call (the client, an insurance adjuster, a lienholder, opposing counsel or a family member — stay consistent with whoever spoke first). Stay fully in character; no meta-commentary.

CASE BACKGROUND:
${CLIENT_DOSSIER_MD}

SCENARIO: ${s.title}
${s.setup}
${s.stakes}
Pressure beats to work in naturally: ${s.script}

CONVERSATION SO FAR:
${transcript}

Reply with the next line only — 1-3 sentences, realistic, emotionally true to the character. If the Case Manager is clear, empathetic and specific, you may soften. If they are vague, over-promise, or give legal advice, push back.`;
  try{ const reply = await callAIText(prompt, 220);
    toolState.cr.chatHistory = toolState.cr.chatHistory.filter(m=>!m.pending); toolState.cr.chatHistory.push({role:"client", text: reply.trim().replace(/^["“]+|["”]+$/g,"")});
  }catch(e){ toolState.cr.chatHistory = toolState.cr.chatHistory.filter(m=>!m.pending); toolState.cr.chatHistory.push({role:"client", text:"[Connection issue — try sending again.]"}); }
  crRenderChatWindow();
};

/* ================================================================
   LESSON CARDS — render the slide's table/process/compare visual
   and the Skill Builder call-to-action on Part 1 of each topic.
   ================================================================ */
const _origLessonCard = window.renderLessonCard;
window.renderLessonCard = function(l, i, d, unused, part){
  if(!l || !l.fourPart || (!l.layout && !l.skill)) return _origLessonCard(l, i, d, unused, part);
  let extra = l.layout ? `<div class="cm-lesson-visual">${renderLessonVisual(l)}</div>` : "";
  if(l.skill){
    const t = PRACTICE_TOOLS.find(x=>x.id===l.skill.tool);
    if(t) extra += `<div class="cm-skill-cta"><div><b>🧪 Skill Builder: ${E(t.title)}</b><p>Practice this with the real case documents${l.skill.cms?" and log your work in the CMS":""}.</p></div>
      <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-navy btn-sm" onclick="goto('tool','${t.id}')">Open Skill Builder</button>${l.skill.cms?`<button class="btn btn-ghost btn-sm" onclick="openCms()">Open CMS</button>`:""}</div></div>`;
  }
  return _origLessonCard(Object.assign({}, l, {svgDiagram: extra}), i, d, unused, part);
};

/* ================================================================
   VIEWS: Case Documents · Training Tools · Handouts · Case File
   ================================================================ */
window.renderCaseDocuments = function(){
  const f = state.docFilter || "all";
  const docs = CM_DOCS.filter(d=> f==="all" || (f==="jd" ? d.folder!=="jordan-davies" && d.folder!=="templates" : f==="jdv" ? d.folder==="jordan-davies" : d.folder===f));
  const byFolder = CM_DOC_FOLDERS.filter(fo=>fo.id!=="handouts").map(fo=>({fo, items:docs.filter(d=>d.folder===fo.id)})).filter(x=>x.items.length);
  return `<p class="eyebrow">Case Documents</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📁 Case Document Library</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:78ch;margin:0 0 14px">Real case handling runs on paperwork. These are the working files for <b>John Doe v. Apex Delivery Services</b> (Days 1–4) and <b>Jordan Davies</b> (Day 5). Every Skill Builder points to the exact documents it uses. Each file shows the <b>CMS upload category</b> to use when you add it to your case in the CMS. They are simulated training documents — and some contain deliberate errors you are expected to catch.</p>
    <div class="cm-filter">${[["all","All"],["jd","John Doe"],["jdv","Jordan Davies"],["templates","Templates"]].map(([k,lab])=>`<button class="btn btn-sm ${f===k?"btn-navy":"btn-ghost"}" onclick="state.docFilter='${k}';render()">${lab}</button>`).join("")}
      <button class="btn btn-sm btn-ghost" onclick="openCms()">🗂 Open CMS</button></div>
    ${state.isAdmin ? `<div class="card" style="padding:12px 16px;margin-bottom:16px;border-left:4px solid var(--danger);font-size:12.8px">🔑 <b>Trainer view:</b> the red notes under each document are the audit key — planted discrepancies and what a strong trainee should catch. Trainees don't see them.</div>` : ""}
    ${byFolder.map(({fo,items})=>`<div class="card cm-lib-folder" style="padding:14px 18px"><h3>${fo.icon} ${E(fo.label)} <span style="font-weight:500;color:var(--ink-soft);font-size:12px">(${items.length})</span></h3>
      ${items.map(d=>`<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span> <span style="font-size:11px;color:var(--ink-soft)">· Day ${d.day}</span><div class="d">${E(d.desc)}</div>${state.isAdmin && d.key ? `<div class="cm-key">🔑 ${E(d.key)}</div>` : ""}</div>
        <div style="display:flex;gap:6px;align-items:center"><span class="cms">CMS: ${E(d.cms)}</span><a class="btn btn-ghost btn-sm" href="${cmDocUrl(d)}" target="_blank" rel="noopener">${/\.(docx|xlsx)$/i.test(d.file)?"Download":"Open"}</a></div></div>`).join("")}</div>`).join("")}`;
};

window.renderTrainingTools = function(){
  const log = Object.entries(state.cmsLog||{});
  const toolTitle = (id)=> (PRACTICE_TOOLS.find(t=>t.id===id)||{}).title || id;
  const tools = CM_TOOL_DEFAULTS.map(d=>cmTool(d.id));
  return `<p class="eyebrow">Training Tools</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">🧰 LSH Training Tools</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 16px">This portal is your home base. The platforms you'll use on the job are built in here: open one <b>inside the portal</b> and it stays signed in while you go back and forth between lessons and Skill Builders. You can also open it on its own in a new tab. Skill Builders tell you exactly what to do in each tool, then ask for the ID it gives you so your trainer can review your work.</p>
    <div class="cm-tools">${tools.map(t=>`<div class="card cm-tool${t.live?"":" soon"}">
      <div class="cm-tool-h"><span class="cm-tool-ic">${t.icon}</span><div><b>${E(t.name)}</b><div><span class="cm-badge ${t.live?"live":"soon"}">${t.live?"● Live":"Coming soon"}</span></div></div></div>
      <p>${E(t.desc)}</p>
      ${t.live?`<div class="cm-tool-act"><button class="btn btn-primary btn-sm" onclick="openTool('${t.id}')">Open in portal</button><button class="btn btn-ghost btn-sm" onclick="openTool('${t.id}','tab')">New tab ↗</button></div>
        <div class="cm-tool-url">${E(t.url.replace(/^https:\/\//,""))}</div>`
      :`<p class="cm-tool-note">Until it's live, Skill Builder steps for this tool are logged as <b>Tasks</b> in the CMS.</p>`}
    </div>`).join("")}</div>
    <div class="card" style="padding:16px 20px;margin-bottom:16px"><b style="color:var(--navy)">How the portal and the tools work together</b>
      <ol style="font-size:13px;margin:8px 0 0;padding-left:20px"><li>Learn it in the day's lessons here.</li><li>Open the Skill Builder. It gives you the case documents and the exercise.</li><li>Do the file work in the tool. In the CMS: <b>Start a New Case</b>, key the facts, upload each document under the <b>CMS category</b> shown in 📁 Documents (Medical · Police · Case Files · Invoices · Bills · PD · Litigation · Others), and add Tasks, Notes, Liens and Chronology. Then <b>Save Case</b> to get your permanent Case ID.</li><li>Come back and log that ID in the Skill Builder. Your trainer reviews your file in the tool.</li></ol>
      <p style="font-size:12.3px;color:var(--ink-soft);margin:10px 0 0">Signed in, but the tool asks you to sign in again inside the portal? Some browsers block sign-in inside an embedded page. Use <b>New tab ↗</b>. Your training portal stays open here.</p></div>
    <div class="card" style="padding:16px 20px;margin-bottom:16px"><b style="color:var(--navy)">My tool work log</b>
      ${log.length ? `<table class="cm-table"><thead><tr><th>Skill Builder</th><th>Tool</th><th>ID</th><th>Logged</th></tr></thead><tbody>${log.map(([k,v])=>`<tr><td>${E(toolTitle(v.tool||k.split(":")[0]))}</td><td>${E((cmTool(v.platform||"cms")||{}).short||"CMS")}</td><td><b>${E(v.caseId)}</b></td><td>${fmtDate(v.at)}</td></tr>`).join("")}</tbody></table>` : `<p style="font-size:13px;color:var(--ink-soft);margin:6px 0 0">Nothing logged yet. Skill Builders will ask for your Case ID.</p>`}</div>
    ${state.isAdmin ? `<div class="card" style="padding:16px 20px;border-left:4px solid var(--orange)"><b style="color:var(--navy)">Admin: tool addresses</b>
      <p style="font-size:12.8px;color:var(--ink-soft);margin:4px 0 10px">Saved for every trainee. Switch a tool to <b>Live</b> once its address works. Each tool also stays reachable on its own at its address.</p>
      ${tools.map(t=>`<div class="cm-tool-admin"><span>${t.icon} <b>${E(t.short)}</b></span>
        <input id="toolUrl_${t.id}" value="${E(t.url)}" placeholder="https://…">
        <select id="toolStatus_${t.id}"><option value="live"${t.status==="live"?" selected":""}>Live</option><option value="coming"${t.status!=="live"?" selected":""}>Coming soon</option></select></div>`).join("")}
      <button class="btn btn-navy btn-sm" style="margin-top:8px" onclick="saveToolSettings()">Save tool settings</button></div>` : ""}`;
};
window.renderCmsSimulator = window.renderTrainingTools;
window.saveToolSettings = async function(){
  const out = {};
  for(const d of CM_TOOL_DEFAULTS){
    const url = ((document.getElementById("toolUrl_"+d.id)||{}).value||"").trim().replace(/\/+$/,"");
    const status = (document.getElementById("toolStatus_"+d.id)||{}).value || d.status;
    if(url && !/^https:\/\/[^\s]+$/i.test(url)){ toast(`${d.short}: enter the full https:// address.`); return; }
    if(status==="live" && !url){ toast(`${d.short}: add its address before switching it to Live.`); return; }
    out[d.id] = {url, status};
  }
  state.toolSettings = out;
  await sharedSet("settings:tools", {tools:out, at:new Date().toISOString()});
  toast("Tool settings saved for everyone."); render();
};

window.renderHandouts = function(){
  const byDay = [1,2,3,4,5].map(n=>({n, items:CM_HANDOUTS.filter(h=>h.day===n)}));
  const tpl = CM_DOCS.filter(d=>d.folder==="templates");
  return `<p class="eyebrow">Reference Library</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📚 Handouts & Templates</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:78ch;margin:0 0 16px">The LSH Case Management handout repository, organized by training day, plus the working templates you'll use in the Skill Builders.</p>
    ${byDay.map(({n,items})=>`<div class="card" style="padding:14px 18px;margin-bottom:14px"><h3 style="font-size:14px;color:var(--navy);margin:0 0 6px">Day ${n} — ${E((DAYS.find(d=>d.id===n)||{}).title||"")}</h3>
      ${items.map(h=>`<div class="cm-doc-row"><span class="t">${E(h.title)}</span><a class="btn btn-ghost btn-sm" href="documents/${h.file.split("/").map(encodeURIComponent).join("/")}" target="_blank" rel="noopener">${/\.docx$/i.test(h.file)?"Download":"Open"}</a></div>`).join("")}</div>`).join("")}
    <div class="card" style="padding:14px 18px"><h3 style="font-size:14px;color:var(--navy);margin:0 0 6px">📝 Templates & blank forms</h3>
      ${tpl.map(d=>`<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span><div class="d">${E(d.desc)}</div></div><a class="btn btn-ghost btn-sm" href="${cmDocUrl(d)}" target="_blank" rel="noopener">${/\.(docx|xlsx)$/i.test(d.file)?"Download":"Open"}</a></div>`).join("")}</div>`;
};

window.renderClientProfile = function(){
  return `<h1 style="color:var(--navy);font-size:28px;margin:0 0 10px">📂 Case File: John Doe v. Apex Delivery Services</h1>
    <p>The working case for Days 1–4 (Day 5 adds the Jordan Davies file). Every fact below comes from the documents in 📁 Case Documents — when a Skill Builder asks you to verify something, verify it against the document, not this summary.</p>
    <div class="client-intro-banner"><div class="cib-tag">📌 Read This First</div><h2>One case, from intake to closing</h2>
      <p>Like a real caseload, the file grows as you go: intake and treatment records on Day 1, the demand and negotiation on Day 2, liens and disbursement on Day 3, mediation and arbitration on Day 4, and litigation on Day 5. The same documents keep coming back — the discrepancies you catch early are the ones that decide the case later.</p>
      <div style="display:flex;gap:8px;flex-wrap:wrap;margin-top:8px"><button class="btn btn-navy btn-sm" onclick="goto('casedocs')">📁 Open the Case Documents</button><button class="btn btn-ghost btn-sm" onclick="openCms()">🗂 Open the CMS</button></div></div>
    <div class="profile-grid">${CLIENT_PROFILE_DOC.map(sec=>`<div class="card profile-section"><h3>${E(sec.section)}</h3><ul>${sec.items.map(i=>`<li>${E(i)}</li>`).join("")}</ul></div>`).join("")}</div>`;
};
window.clientAvatarSvg = function(){ return `<div class="client-photo-img" style="display:flex;align-items:center;justify-content:center;font-size:42px;background:#EEF0F6">📂</div>`; };

/* Day 1 "meet the client" slide → meet the case */
window.renderMeetClientSlide = function(){
  return `<div class="card meet-client-card"><div class="mc-tag">📂 Meet the Case</div><h3>John Doe v. Apex Delivery Services</h3>
    <p>Valentine's Day, 2026, 2:35 PM. John was turning left on a green arrow at 4th Ave &amp; Main St when an Apex delivery F-150 ran the red light and hit his driver-side door. He was cut out of his Tesla with the Jaws of Life, with a 12cm facial laceration and back pain radiating into his left leg. His wife Jane was in the passenger seat.</p>
    <p>For the next five days you'll handle this file the way a Case Manager does — from the intake packet to the closing letter. Start by opening the intake documents.</p>
    ${docPacket(["JD01","JD07","JD05"], "Start here")}
    <div style="display:flex;gap:8px;flex-wrap:wrap"><button class="btn btn-navy btn-sm" onclick="goto('clientprofile')">Read the Case File</button><button class="btn btn-ghost btn-sm" onclick="goto('casedocs')">📁 All documents</button></div></div>`;
};

/* ---------- startup ---------- */
const _origRender = window.render;
window.addEventListener("load", ()=>{
  setTimeout(async ()=>{
    try{ state.cmsLog = (await storeGet("cms-log")) || state.cmsLog || {}; }catch(e){}
    await loadToolSettings(); if(typeof render==="function" && (state.view==="tools"||state.view==="cms")) render();
  }, 300);
});
})();
