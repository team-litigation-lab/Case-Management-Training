/* 💡 TIPS IN PLACE OF 📖 REFERENCE (every Case Flow slide)
   The slide's band had a quiet "📖 Reference" button that opened the block's full text over the slide (cmCaseFlow.full:
   .cfx-ref, "📖 Additional Reference"). Trainees rarely opened it. It is now 💡 Tips: the same panel, offered as the hints
   a trainee reaches for when they are stuck, so the trainer can say "open 💡 Tips" and the room finds it at once:
   · the band's button reads 💡 Tips, in a warm sand fill that stands out on the navy band (it was navy on navy);
   · the panel's heading reads 💡 Tips, and its close button ✕ Back to the slide as before.
   Relabels the drawn slide (a light pass after each render), shortens the panel (below) and styles both. */
(function(){
"use strict";
if(typeof document === "undefined" || window.cmTipsButton) return;
const LABEL = "💡 Tips", TITLE = "Tips for this slide: hints and the details to think it through";
function fix(){
  document.querySelectorAll(".cfx-ref-open:not([data-tips])").forEach(b => { b.setAttribute("data-tips", "1"); b.textContent = LABEL; b.title = TITLE; });
  document.querySelectorAll(".cfx-ref .cfx-ref-h > b:not([data-tips])").forEach(h => {
    h.setAttribute("data-tips", "1");
    const t = h.firstChild; if(t && t.nodeType === 3) t.textContent = t.textContent.replace(/📖\s*Additional Reference/, LABEL);
  });
}
let queued = false;
new MutationObserver(() => { if(queued) return; queued = true; Promise.resolve().then(() => { queued = false; fix(); }); })
  .observe(document.documentElement, {childList: true, subtree: true});
/* the panel, shorter: what helps the trainee think, not the whole text
   · kept: 🧰 This task's tools (js/cm-task-card.js: the 💡 Tip, the call, the Source Files…), the litigation note
     (js/cm-litigation-note.js), and on a Backup File Maintenance task its 📋 Rules & Naming Guide (the naming
     convention the task is done with: js/cm-sb-task.js);
   · added: 💡 Hints, the lesson's own key points (an activity: the lesson it practises) and ⚠ Watch out, its don'ts;
     📖 In plain English, the slide's terms and what they mean (no button of their own on the band);
   · gone: the case chips and the block's full text (the trainer's talking points carry the full lesson). */
const E = t => String(t == null ? "" : t).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const hl = t => E(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
function lessonOf(b){
  if(!b) return null;
  if(b.kind !== "activity") return b.id;
  for(const sd of ((window.CM_CASE_FLOW || {}).sequence || [])) for(const ph of (sd.phases || [])) if((ph.practises || {})[b.id]) return ph.practises[b.id];
  return null;
}
function hintsHtml(b){
  const S = window.CM_CF_SLIDES || {}, id = lessonOf(b), c = (id && S[id]) || {};
  const pts = (c.points || []).slice(0, 4), outs = (c.donts || []).slice(0, 2);
  if(!pts.length && !outs.length) return "";
  return `<section class="cfx-tips-hints" aria-label="Hints"><h3>💡 Hints</h3>${pts.length ? `<ul>${pts.map(x => `<li>${hl(x)}</li>`).join("")}</ul>` : ""}
    ${outs.length ? `<p class="cfx-tips-k">⚠ Watch out</p><ul class="cfx-tips-out">${outs.map(x => `<li>${hl(x)}</li>`).join("")}</ul>` : ""}</section>`;
}
if(window.cmCaseFlow && typeof cmCaseFlow.full === "function"){
  const __full = cmCaseFlow.full;
  cmCaseFlow.full = function(dayId, i){
    const r = __full.apply(this, arguments);
    try{
      const body = document.querySelector(".cfx-ref .cfx-ref-b"); if(!body) return r;
      const b = typeof cmCaseFlow.blockAt === "function" ? cmCaseFlow.blockAt(dayId, i) : null;
      const tools = body.querySelector(".cfx-ref-tools"), note = body.querySelector(".lgn-note"), g = body.querySelector(".cfx-guide");
      // 📖 In plain English: the slide's terms (the hidden bar, js/cm-plain-pop.js; an activity's sits in its tools) as a section here
      const pd = document.querySelector("#lessonSlideWrap details.cfx-plain") || (tools && tools.querySelector("details.cfx-plain"));
      const terms = pd ? [...pd.querySelectorAll("dl > div")].map(d => [(d.querySelector("dt") || {}).textContent || "", (d.querySelector("dd") || {}).textContent || ""]).filter(x => x[0]) : [];
      if(tools) tools.querySelectorAll("details.cfx-plain").forEach(n => n.remove());
      const guide = g && g.querySelector("[data-drv-naming]") ? g : null;
      const keep = [tools, note, guide].filter(Boolean);
      body.innerHTML = "";
      if(note) body.appendChild(note);   // a litigation hand-off's note heads the panel, as it headed the full text
      if(tools) body.appendChild(tools);
      body.insertAdjacentHTML("beforeend", hintsHtml(b));
      if(terms.length) body.insertAdjacentHTML("beforeend", `<section class="cfx-tips-hints cfx-tips-plain" aria-label="In plain English"><h3>📖 In plain English</h3><dl>${terms.map(([t, m]) => `<div><dt>${E(t)}</dt><dd>${E(m)}</dd></div>`).join("")}</dl></section>`);
      if(guide) body.appendChild(guide);
      if(!keep.length && !body.children.length) body.innerHTML = `<p class="cfx-tips-none">No tips for this slide: work it from what the slide and your trainer say.</p>`;
      fix();
    }catch(e){}
    return r;
  };
}
window.cmTipsButton = {fix, LABEL, hintsHtml};
const st = document.createElement("style"); st.id = "cm-tips-button"; st.textContent = `
html body .cfx-ref-open.cfx-ref-open{background:linear-gradient(180deg,#F3D7AE 0%,#E2B677 100%) !important;color:#1E2340 !important;border:0 !important;
  box-shadow:0 0 0 2px rgba(246,227,198,.35),0 8px 16px -10px rgba(0,0,0,.7) !important;font-weight:800 !important;}
html body .cfx-ref-open.cfx-ref-open:hover, html body .cfx-ref-open.cfx-ref-open:focus-visible{background:#fff !important;color:#1E2340 !important;outline:2px solid #EBCB9C !important;outline-offset:2px;}
.cfx-ref .cfx-tips-hints{margin:0 0 14px;padding:14px 18px;background:#FFFBF4;border:1px solid #EBDDC7;border-radius:14px;text-align:left !important;}
.cfx-ref .cfx-tips-hints h3{margin:0 0 8px !important;font:800 19px/1.3 'Poppins','Inter',sans-serif !important;color:#1E2340 !important;text-align:left !important;}
.cfx-ref .cfx-tips-hints .cfx-tips-k{margin:12px 0 6px !important;font:800 17px/1.3 'Inter',sans-serif !important;color:#9A4E12 !important;text-align:left !important;}
.cfx-ref .cfx-tips-hints ul{margin:0 !important;padding:0 0 0 22px !important;display:flex;flex-direction:column;gap:4px;text-align:left !important;list-style:disc !important;}
.cfx-ref .cfx-tips-hints li{margin:0 !important;padding:0 !important;font:700 17px/1.45 'Inter',sans-serif !important;color:#1E2340 !important;text-align:left !important;}
.cfx-ref .cfx-tips-hints li::before{content:none !important;display:none !important;}
.cfx-ref .cfx-tips-hints li::marker{color:#C9A27A;}
.cfx-ref .cfx-tips-plain dl{margin:0;display:flex;flex-direction:column;gap:8px;}
.cfx-ref .cfx-tips-plain dt{font:800 17px/1.3 'Inter',sans-serif !important;color:#9A4E12 !important;text-align:left !important;}
.cfx-ref .cfx-tips-plain dd{margin:2px 0 0 !important;font:700 17px/1.45 'Inter',sans-serif !important;color:#1E2340 !important;text-align:left !important;}
.cfx-ref .cfx-tips-none{font:700 17px/1.5 'Inter',sans-serif;color:#3E4560;}
`;
document.head.appendChild(st);
})();
