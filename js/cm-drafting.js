/* ============================================================
   📄 Drafting Tools hub (#/drafting)
   Links to the three drafting tools: LOR (js/cm-lor.js), HIPAA (js/cm-hipaa.js) and Med Provider
   (js/cm-medprov.js) — the Van Law Firm templates, formatted the way Foundational-Training's LOR
   Drafting Activity is. Loaded after all three, since it shows each tool's own card.
   ============================================================ */
(function(){
"use strict";

function renderPage(){
  if(!state.traineeId && !state.isAdmin && !state.adminPreview) return `<div class="card" style="padding:28px;">Sign in to open the Drafting Tools.</div>`;
  const cards = [window.cmLorCard, window.cmHipaaCard, window.cmMedprovCard].filter(Boolean).map(fn => fn()).join("");
  return `<div class="lor-hero"><p class="lor-eyebrow">📄 Resource Library</p><h1>Drafting Tools</h1>
      <p>Three standalone drafting activities in the firm's own letter templates — a HIPAA authorization form, a Letter of Representation, and a medical provider's lien and records-request letters. None of them touches the CMS; each one is downloaded and uploaded by hand.</p></div>
    <div class="drafting-cards">${cards}</div>`;
}

const __renderCmDrafting = window.render;
window.render = function(){
  if(state.view !== "drafting") return __renderCmDrafting.apply(this, arguments);
  if(!state.traineeId && !state.isAdmin && !state.adminPreview){ state.view = "dashboard"; return __renderCmDrafting.apply(this, arguments); }
  const app = document.getElementById("app");
  app.innerHTML = renderTopbar() + `<main class="main-lor">${renderPage()}</main>` + renderFooter();
  try{ afterRender(); }catch(err){}
};

(function(){ const s = document.createElement("style"); s.id = "cm-drafting"; s.textContent = `
.drafting-cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:16px;}
.fts-card{padding:18px;}
.fts-card h3{margin:0 0 6px;color:var(--navy);font-size:18px;}
.fts-card .fts-note{margin:0 0 10px;color:var(--ink-soft);font-size:13.5px;}
.fts-card .fss-case{margin:0 0 12px;font-size:13px;color:var(--navy);}
`; document.head.appendChild(s); })();
})();
