/* ============================================================
   📄 Drafting Tools — LOR Drafting
   The LOR Drafting activity lives on the LSH Training Portal, as one shared tool that both this course and Standard
   Foundational Training open: /simulators/drafting.html. The Portal fills the firm's own .docx and hands that file
   back, so the download carries the letterhead and logo. js/lsh-tool-links.js puts the signed ticket on the link, so a
   trainee lands there already signed in. This file draws the tool's card (the Drafting Tools hub, js/cm-drafting.js,
   and the Claim Set Up step's 🛠 LOR Drafting, js/cm-case-flow.js), answers the old #/lor address by opening the
   Portal's tool, and holds the drafting page's styles, which 🔏 HIPAA Drafting (js/cm-hipaa.js) shares.
   ============================================================ */
(function(){
"use strict";
const e = v => esc(String(v == null ? "" : v));
const adminOn = () => !!state.isAdmin && !state.adminPreview;
// every trainee drafts on John Doe VS Robert Smith, the Case Flow's own file, its date of loss in their case year (js/cm-case-dates.js)
const JD_DOL = () => { const D = window.CM_CASE_DATES, s = D && D.dol ? D.dol() : "02/06/2026", [m, d, y] = s.split("/").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-US", {year:"numeric", month:"long", day:"numeric", timeZone:"UTC"}); };

const PORTAL_DRAFTING = "https://cm-training-activity.pages.dev/simulators/drafting.html";
// On window: the card's onclick is an inline attribute, which is read in global scope, not in
// this file's closure. Both drafting files define the same opener; either one will do.
window.lshOpenPortalDrafting = function(){
  if(typeof LSHToolLinks === "object" && LSHToolLinks.ticketed) LSHToolLinks.ticketed(PORTAL_DRAFTING).then(function(u){ location.href = u; });
  else location.href = PORTAL_DRAFTING;
};

/* ---------- wiring into the engine: an old #/lor link or bookmark opens the Portal's tool, with the dashboard behind it ---------- */
const __renderCmLor = window.render;
window.render = function(){
  if(state.view !== "lor") return __renderCmLor.apply(this, arguments);
  window.lshOpenPortalDrafting();
  state.view = "dashboard";
  return __renderCmLor.apply(this, arguments);
};

window.cmLorCard = function(){
  const note = `${adminOn() ? "Every trainee's case" : "Your case"}: <b>${e(`John Doe VS Robert Smith · ${JD_DOL()}`)}</b>.`;
  return `<div class="card fts-card"><h3>📄 LOR Drafting</h3>
    <p class="fts-note">Draft the Letter of Representation for the 1P and the 3P carrier on John Doe VS Robert Smith (the Case Flow's Claim Set Up step), in the firm's own templates, then download them. It opens on the Training Portal, where the download is the firm's own Word file with your answers written into it — letterhead and logo included, ready to upload to SA.</p>
    <p class="fss-case">${note}</p>
    <div class="fts-tool-act"><button class="btn btn-navy btn-sm" type="button" onclick="lshOpenPortalDrafting()">Open LOR Drafting &rarr;</button></div></div>`;
};

(function(){ const s = document.createElement("style"); s.id = "cm-lor"; s.textContent = `
main.main-lor{max-width:1440px;margin:0 auto;padding:24px 24px 48px;}
.lor-preview-note{padding:10px 14px;margin:0 0 14px;background:#EEF2FF;border:1px solid #C7D2FE;color:#3730A3;font-size:13.5px;}
.lor-hero h1{margin:0 0 6px;color:var(--navy);font-size:28px;}
.lor-hero p{margin:0 0 16px;color:var(--ink-soft);font-size:16px;max-width:900px;}
.lor-eyebrow{margin:0 0 2px;font-size:12px;font-weight:800;letter-spacing:.06em;text-transform:uppercase;color:var(--orange-deep);}
.lor-muted{color:var(--ink-soft);font-size:13.5px;}
.lor-warn{display:flex;gap:12px;align-items:flex-start;background:#FFF7ED;border:1px solid #FDBA74;border-left:5px solid #F97316;border-radius:12px;padding:14px 16px;margin:0 0 16px;}
.lor-warn-ic{font-size:19px;line-height:1.2;}
.lor-warn-h{color:#9A3412;display:block;margin-bottom:2px;}
.lor-warn p b{color:#7C2D12;}
.lor-warn p{margin:0;font-size:15px;color:#7C2D12;}
.lor-obj{padding:14px 18px;margin-bottom:16px;background:#F7F8FB;}
.lor-obj b{color:var(--navy);} .lor-obj p{margin:4px 0 0;font-size:15px;color:var(--ink-soft);font-style:italic;}
.lor-wait{padding:24px;} .lor-wait b{color:var(--navy);} .lor-wait p{margin:6px 0 0;color:var(--ink-soft);font-size:13.5px;}
.lor-case{padding:18px;margin-bottom:20px;}
.lor-case-h{display:flex;gap:12px;align-items:flex-start;justify-content:space-between;flex-wrap:wrap;}
.lor-case-h h2{margin:0;color:var(--navy);font-size:19px;}
.lor-notes-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,320px),1fr));gap:14px;margin-top:12px;}
.lor-notes{background:#F7F8FB;border:1px solid #E6E8F0;border-radius:12px;padding:12px 14px;}
.lor-notes-h{font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--orange-deep);margin-bottom:8px;}
.lor-notes dl{margin:0;} .lor-notes dl > div{display:flex;gap:8px;padding:3px 0;border-bottom:1px solid #EDEFF5;}
.lor-notes dl > div:last-child{border-bottom:0;}
.lor-notes dt{flex:0 0 46%;font-size:14px;color:var(--ink-soft);}
.lor-notes dd{margin:0;flex:1 1 auto;min-width:0;font-size:14px;font-weight:600;color:var(--navy);overflow-wrap:anywhere;}
.lor-tabs{margin-bottom:14px;}
.lor-ed-h{margin:0 0 10px;color:var(--navy);font-size:20px;}
.lor-steps{padding:12px 16px;margin-bottom:14px;}
.lor-steps summary{cursor:pointer;font-weight:700;color:var(--navy);}
.lor-steps ol{margin:10px 0 6px;padding-left:20px;} .lor-steps li{font-size:15px;margin-bottom:5px;}
.lor-steps code,.lor-naming code{font-family:'IBM Plex Mono',ui-monospace,monospace;font-size:12px;background:#F1F5F9;border-radius:5px;padding:2px 6px;overflow-wrap:anywhere;}
/* the letter itself: the firm's page, with only the highlighted parts editable */
.lor-paper{padding:44px 56px;background:#fff;}
.lorl{font-family:Arial,Helvetica,sans-serif;font-size:16px;line-height:1.55;color:#111;}
.lorl-p{margin:0 0 9px;text-align:justify;}
.lorl-mid{text-align:center;font-weight:700;}
.lorl-num{display:list-item;list-style:decimal;margin-left:26px;text-align:justify;}
.lorl-tab{display:inline-block;width:34px;}
.lorl-tbl{border-collapse:collapse;margin:6px 0;} .lorl-tbl td{padding:2px 8px 2px 0;font-size:16px;}
.lorl-in,.lorl-ta{font:inherit;color:#0B3B8C;font-weight:700;background:#FEF9C3;border:0;border-bottom:1.5px solid #EAB308;border-radius:3px 3px 0 0;padding:1px 5px;max-width:100%;}
.lorl-in:focus,.lorl-ta:focus{outline:2px solid #F97316;outline-offset:1px;background:#FFFBEB;}
.lorl-in::placeholder,.lorl-ta::placeholder{color:#8A7B2F;font-weight:500;font-style:italic;}
.lorl-in.set,.lorl-ta.set{background:#ECFDF5;border-bottom-color:#34D399;}
.lorl-manual{color:#111;}
.lorl-ta{display:block;width:100%;margin:4px 0;line-height:1.5;resize:vertical;text-align:left;}
.lorl-auto{background:#E0E7FF;border-bottom:1.5px dashed #6366F1;border-radius:3px 3px 0 0;padding:1px 5px;font-weight:700;color:#312E81;}
.lorl-box{font:inherit;font-size:17px;line-height:1;background:none;border:0;color:#111;cursor:pointer;padding:0 2px;border-radius:4px;}
.lorl-box:hover{background:#FEF3C7;} .lorl-box.on{color:#047857;} .lorl-box:focus-visible{outline:2px solid #F97316;}
.lor-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin:14px 0 6px;}
.lor-save{font-size:12.5px;color:var(--ink-soft);}
.lor-naming{margin:0;}
/* a trainer's preview of a Drafting Tool (js/cm-hipaa.js) */
.lor-preview{padding:18px;margin-bottom:18px;}
.lor-preview h2{margin:0 0 4px;color:var(--navy);font-size:19px;}
.lor-preview select{font:inherit;font-size:13px;padding:5px 8px;border:1px solid #D7DBE7;border-radius:8px;background:#fff;max-width:100%;}
@media(max-width:620px){ .lor-paper{padding:20px 16px;} }
`; document.head.appendChild(s); })();
})();
