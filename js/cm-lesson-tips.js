/* 💡 TIPS FROM THE LESSONS THE DECKS REPLACED
   The trainers' Canva decks (js/cm-deck-slides.js, js/cm-deck-pages.js) now teach most of Days 1 and 2. The drawn lesson
   cards that only repeated a deck's pages were taken out of the course's order (CF.sequence in js/cm-case-flow-data.js):
     Day 1  the UPL Line (d1m1-upl), Client Directions (d1m3-l1), the Final Warning Letter (d1m2-l2): the day keeps its
            three deck lessons plus two of its own, Property Damage (d1m3-l2) and the No Contact Protocol (d1m2-l1)
     Day 2  PIP Strategy (d2m2-pip: the deck's Valuation Baseline pages)
     Day 3  the Demand Package (d3m1-pkg), Adjuster Delay Tactics (d3m2-l1), the UM Consent & Waiver (d3m2-umw): Day 2's
            Demand, Settlement Negotiations and BI Settlement pages
   Their rules are not lost: each one is a 💡 Tip pop-up on the Skill Activity that practised it, on the activity's
   first slide, beside its "Practises:" line. The button opens a small panel (why it matters and the rules), and ✕ or Esc closes it.
   Checked by .github/scripts/lesson-tips.cjs. */
(function(){
"use strict";
const TIPS = {
  "d1m2-a1": ["d1m1-upl"], "d1m3-a1": ["d1m3-l1"], "d1m3-a2": ["d1m3-l1"], "d1m2-a2": ["d1m2-l2"],
  "d2m2-a1": ["d2m2-pip"],
  "d3-drive": ["d3m1-pkg"], "d3m2-a1": ["d3m2-l1"], "d3m2-rel": ["d3m2-umw"], "d3m2-exec": ["d3m2-umw"]
};
const CF = window.CM_CASE_FLOW;
const blockOf = id => { for(const d of (CF && CF.days) || []) for(const m of d.modules || []) for(const b of m.blocks || []) if(b.id === id) return b; return null; };
window.CM_LESSON_TIPS = {TIPS, blockOf};   // .github/scripts/lesson-tips.cjs
if(typeof renderDaySlideContent !== "function" || !CF) return;

const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
function panel(ids){
  return ids.map(blockOf).filter(Boolean).map(b => `<section><h4>💡 ${E(b.title)}</h4>${b.tell && b.tell.why ? `<p class="cm-lt-why">${E(b.tell.why)}</p>` : ""}`
    + `<ul>${((b.tell && b.tell.rules) || []).map(r => `<li>${E(r)}</li>`).join("")}</ul></section>`).join("");
}
function open(btn){
  close();
  const ids = String(btn.getAttribute("data-tips") || "").split(",").filter(Boolean);
  const box = document.createElement("div");
  box.className = "cm-lt-pop"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Tips");
  box.innerHTML = `<button type="button" class="cm-lt-x" aria-label="Close" onclick="cmLessonTips.close()">✕</button>${panel(ids)}`;
  document.body.appendChild(box);
}
function close(){ document.querySelectorAll(".cm-lt-pop").forEach(x => x.remove()); }
document.addEventListener("keydown", e => { if(e.key === "Escape") close(); });
window.cmLessonTips = {open, close};

const __content = renderDaySlideContent;
renderDaySlideContent = function(d, slide){
  const html = __content.apply(this, arguments);
  const l = slide && slide.type === "topic" && slide.part === 1 && d && d.lessons && d.lessons[slide.lessonIndex];
  const ids = l && l.cf && l.cf.block && TIPS[l.cf.block.id];
  if(!ids || typeof html !== "string") return html;
  const btn = `<button type="button" class="cm-lt-btn" data-tips="${E(ids.join(","))}" onclick="cmLessonTips.open(this)" title="Tips from the lesson">💡 Tip</button>`;
  // beside the activity's "Practises: …" line (in the flow of the slide, so it covers nothing); a slide without one: at its end
  const at = html.search(/<b class="cfx-of"[^>]*>[\s\S]*?<\/b>/);
  if(at < 0) return html + `<div class="cm-lt-row">${btn}</div>`;
  const end = html.indexOf("</b>", at) + 4;
  return html.slice(0, end) + btn + html.slice(end);
};

const css = document.createElement("style");
css.textContent = `/* a small pill beside the Practises line (the slide's own button rules would restyle it: hence !important) */
.cm-lt-btn{display:inline-flex !important;align-items:center;width:auto !important;min-width:0 !important;height:auto !important;margin:0 0 0 8px !important;vertical-align:middle;border:1px solid #f0c94a !important;background:#fff8dc !important;color:#5b4500 !important;font-family:inherit;font-size:16px !important;font-weight:700 !important;line-height:1.1 !important;padding:4px 12px !important;border-radius:999px !important;cursor:pointer;box-shadow:none !important}
.cm-lt-row{display:flex;justify-content:flex-end;margin-top:6px}
.cm-lt-btn:hover{background:#ffefb0 !important}
.cm-lt-pop{position:fixed;right:22px;top:120px;z-index:1000;width:min(440px,calc(100vw - 32px));max-height:min(60vh,520px);overflow:auto;background:#fff;color:#1e2340;border:1px solid #e3d6a3;border-radius:12px;padding:16px 18px 12px;box-shadow:0 10px 30px rgba(30,35,64,.25);font-size:14px;line-height:1.45}
.cm-lt-pop h4{margin:0 26px 6px 0;font-size:15px}.cm-lt-pop section+section{margin-top:12px;border-top:1px solid #eee;padding-top:10px}
.cm-lt-pop .cm-lt-why{margin:0 0 6px;color:#4a4f6a}.cm-lt-pop ul{margin:0;padding-left:18px}.cm-lt-pop li{margin:3px 0}
.cm-lt-x{position:absolute;top:8px;right:10px;border:0;background:none;font-size:16px;cursor:pointer;color:#666}`;
document.head.appendChild(css);
})();
