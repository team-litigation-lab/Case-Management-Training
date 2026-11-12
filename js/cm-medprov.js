/* ============================================================
   📄 Drafting Tools — Med Provider Drafting
   The Lien Balance Verification and Medical LOR letters to a medical provider are drafted on the LSH Training
   Portal's shared Drafting tool (/simulators/drafting.html), signed in by js/lsh-tool-links.js, as LOR Drafting is
   (js/cm-lor.js). This file draws the tool's card for the Drafting Tools hub (js/cm-drafting.js) and answers the old
   #/medprov address by opening the Portal's tool.
   ============================================================ */
(function(){
"use strict";
const PORTAL_DRAFTING = "https://cm-training-activity.pages.dev/simulators/drafting.html";
// On window: the card's onclick is an inline attribute, which is read in global scope, not in
// this file's closure. Both drafting files define the same opener; either one will do.
window.lshOpenPortalDrafting = function(){
  if(typeof LSHToolLinks === "object" && LSHToolLinks.ticketed) LSHToolLinks.ticketed(PORTAL_DRAFTING).then(function(u){ location.href = u; });
  else location.href = PORTAL_DRAFTING;
};

/* ---------- wiring into the engine: an old #/medprov link or bookmark opens the Portal's tool, with the dashboard behind it ---------- */
const __renderCmMedprov = window.render;
window.render = function(){
  if(state.view !== "medprov") return __renderCmMedprov.apply(this, arguments);
  window.lshOpenPortalDrafting();
  state.view = "dashboard";
  return __renderCmMedprov.apply(this, arguments);
};

window.cmMedprovCard = function(){
  return `<div class="card fts-card"><h3>🏥 Med Provider Drafting</h3>
    <p class="fts-note">Draft the Lien Balance Verification and Medical LOR letters to your provider, in the firm's own templates, then download them. A standalone activity — no CMS case file. It opens on the Training Portal, where the download is the firm's own Word file with your answers written into it, the provider's letterhead and the Unsworn Declaration included.</p>
    <div class="fts-tool-act"><button class="btn btn-navy btn-sm" type="button" onclick="lshOpenPortalDrafting()">Open Med Provider Drafting &rarr;</button></div></div>`;
};

})();
