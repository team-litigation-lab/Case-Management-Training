/* 💡 TIPS FROM THE LESSONS THE DECKS REPLACED
   The trainers' Canva decks (js/cm-deck-slides.js: a deck page is a lesson's slide) now teach most lessons. The drawn lesson
   cards that only repeated a deck's pages were taken out of the course's order (CF.sequence in js/cm-case-flow-data.js):
     Day 1  the UPL Line (d1m1-upl), Client Directions (d1m3-l1), the Final Warning Letter (d1m2-l2): the day keeps its
            three deck lessons plus two of its own, Property Damage (d1m3-l2) and the No Contact Protocol (d1m2-l1)
     Day 2  PIP Strategy (d2m2-pip: the deck's Valuation Baseline pages)
     Day 3  the Demand Package (d3m1-pkg), Adjuster Delay Tactics (d3m2-l1), the UM Consent & Waiver (d3m2-umw): Day 2's
            Demand, Settlement Negotiations and BI Settlement pages
     Then every drawn lesson whose topic a Canva page teaches (each block's `retired` names the pages): Coverage Verification
     (d2m1-l2), Coverages & Payer-First (d2m1-cov), Liability Investigation (d2m1-liab), Health Subrogation & the Triple-Check
     (d1m1-l2), the EMC Rule (d1m4-emc), the Treatment Phase Summary (d2m2-sum), A-C-T & Treatment Monitoring (d2m2-l2),
     Medical Excuse Notes (d2m3-l2), Strategy Briefing (d2m4-l2), Lien Negotiation Calls (d3m3-l3), Treatment to Demand
     (d4m3-tx), Non-Responsive Adjusters (d4m4-l1) and Escalation Workflows (d4m4-l2)
   Their rules are not lost: each one is a 💡 Tip pop-up on the Skill Activity that practised it (or, where the owner cut
   that activity as an extra task, on the kept activity that now does its work), on the activity's
   first slide, beside its "Practises:" line.
   The same goes for a lesson whose slides ARE the trainers' deck pages (js/cm-deck-slides.js, every day now): its own
   drawn slides are not shown, so its rules are a 💡 Tip on each activity that practises it (DECK_TIPS, read from the
   course's order, CF.sequence `practises`). The button opens a small panel (why it matters and the rules), and ✕ or Esc closes it.
   Checked by .github/scripts/lesson-tips.cjs. */
(function(){
"use strict";
const TIPS = {
  "d1m3-a1": ["d1m3-l1"], "d3-drive": ["d3m1-pkg"], "d3m2-a1": ["d3m2-l1"], "d3m2-rel": ["d3m2-umw"],
  // the drawn lessons whose topic is on the Canva decks' pages (the owner: no lesson repeats a deck), retired:
  "d2m2-a1": ["d2m2-pip", "d1m4-emc", "d1m1-l2", "d2m2-sum"],
  "d2m2-a2": ["d2m2-l2", "d1m1-upl", "d1m2-l2", "d1m4-tcare"], "d2m4-a2": ["d2m4-l2"], "d3m3-a2": ["d3m3-l3"],
  "d4m3-a1": ["d4m3-tx"], "d4m4-a2": ["d4m4-l2", "d4m4-l1"],
  // the side exercises the owner cut (fewer extra tasks): each Tip moved to the kept activity that now does that work
  "d1m1-open": ["d2m1-l2", "d2m1-cov", "d1m4-l1"], "d2m1-a1": ["d2m1-liab"], "d3m1-a1": ["d2m3-l2"],
  "d3m4-a1": ["d3m4-l2"]
};
const CF = window.CM_CASE_FLOW, DECK = window.CM_DECK_SLIDES || {};
const DECK_TIPS = {};
((CF && CF.sequence) || []).forEach(sd => (sd.phases || []).forEach(ph => Object.entries(ph.practises || {}).forEach(([a, l]) => { if(DECK[l]) DECK_TIPS[a] = (DECK_TIPS[a] || []).concat(l); })));
Object.entries(DECK_TIPS).forEach(([a, ls]) => { TIPS[a] = (TIPS[a] || []).concat(ls.filter(l => !(TIPS[a] || []).includes(l))); });
const blockOf = id => { for(const d of (CF && CF.days) || []) for(const m of d.modules || []) for(const b of m.blocks || []) if(b.id === id) return b; return null; };
window.CM_LESSON_TIPS = {TIPS, DECK_TIPS, blockOf};   // .github/scripts/lesson-tips.cjs
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
  if(at < 0) return window.cmCaseFlow && cmCaseFlow.modeOf && cmCaseFlow.modeOf(l.cf.block.id) ? html : html + `<div class="cm-lt-row">${btn}</div>`;   // (not on Your Task turned into its AI Grader or audit: its menu has it)
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
