/* ============================================================
   The revised Day 2 deck's pages, on Case Flow Day 2, topic by topic.
   The trainers' revised Day 2 deck (Pre-Demand Case Auditing, the Demand, Settlement Negotiations and the BI
   Settlement) is shown page by page, as the page itself (decks/cf-deck/*.webp, rendered from the PDFs), after Day 2's
   own lessons and before its Practice Lab (a day is all its lessons, then one Practice Lab, then Ready for the
   Knowledge Check: the pages teach, so they close the lessons), topic by topic.
   No Skill Building slides here: the deck's Skill Building pages (and the slides drawn in their place) are gone, so a
   day's Skill Building is the course's own (its Practice Lab and Skill Activities, on John Doe's file in the CMS).
   (Day 3 still teaches the same topics as lessons, with their Skill Activities in the CMS.)
   A page that names the old practice file's facts (Apex Delivery, Dr. Sarah Spine, the $41,400 in specials, a PIP
   limit gone in 48 hours) carries `old`: the Presenter view tells the trainer what John Doe VS Robert Smith says.
   Saved places in a day move with the pages (js/cm-slide-places.js: layout 5, and layout 6 for the Skill Building gone).
   Checked by .github/scripts/deck-pages.cjs (every page's file is there) and .github/scripts/fit.cjs (each page fits).
   ============================================================ */
(function(){
"use strict";
const DIR = "/decks/cf-deck/", DAY = 2;
const DECK = [
  {key: "predemand", topic: "Pre-Demand Case Auditing", pages: [
    {title: "Core Objectives"},
    {title: "The Auditing Checklist: the Trinity of Case Alignment"},
    {title: "Master Audit Checklist: Financial & Lien Verification"},
    {title: "Master Audit Checklist: Liability Proof"},
    {title: "Master Audit Checklist: Property Damage Deep Dive"},
    {title: "Master Audit Checklist: Medical & Billing Audit"},
    {title: "The Defense-Eye Audit: Red Flag Detection"},
    {title: "Final Package Readiness"}]},
  {key: "demand", topic: "Demand", pages: [
    {title: "The Legal & Procedural Foundation"},
    {title: "The Policy Limit Mindset"},
    {title: "Treatment Gaps in the Demand Phase"},
    {title: "The Demand Packet Checklist"},
    {title: "Quality Control: the Final Scrub"},
    {title: "Negotiating the First Call"},
    {title: "Best Practices"}]},
  {key: "negotiation", topic: "Settlement Negotiations", pages: [
    {title: "The Pitch: the Negotiation Battle Map"},
    {title: "The Valuation Baseline: the Set-Off"},
    {title: "The Valuation Baseline: PIP as a Valuation Baseline", old: "The page's example (a $10,000 PIP limit gone in 48 hours, $41,400 in specials) is the old practice file's. Use John Doe VS Robert Smith's own PIP history and Specials from the CMS."},
    {title: "The Valuation Baseline: the EMC and the Benefit Ceiling", old: "The page names Dr. Sarah Spine, from the old practice file. On John Doe VS Robert Smith, take the EMC finding and its provider from the CMS."},
    {title: "The Valuation Baseline: Subrogation vs. Non-Subrogation"},
    {title: "The Valuation Baseline: Strategic Exhaustion"},
    {title: "Negotiations Initiated: the First Call"},
    {title: "The Bracketing Technique"},
    {title: "Common Adjuster Stall Tactics"},
    {title: "Close the Deal: the Final-Final"},
    {title: "The Never Rule"}]},
  {key: "bisettlement", topic: "BI Settlement", pages: [
    {title: "The UM/UIM Safety Check"},
    {title: "The Legal & Strategic Foundation"},
    {title: "The Execution: the Release of All Claims"},
    {title: "The Execution: the Settlement Disclosure Statement"},
    {title: "The Execution: Lien Payoff Letters"},
    {title: "The Execution: the Settlement Statement"},
    {title: "The Execution: the Dismissal"},
    {title: "The Execution: the W-9 and the Post-Settlement Documents"},
    {title: "Finalized Settlement: Administrative Document Control"},
    {title: "Finalized Settlement: Final Lien Mitigation"}]}
];
const src = (g, i) => `${DIR}${g.key}-${String(i + 1).padStart(2, "0")}.webp`;
window.CM_DECK_PAGES = {DIR, DAY, DECK, src};   // .github/scripts/deck-pages.cjs
if(typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;

const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const pageOf = sl => { const g = sl && sl.type === "deckPage" && DECK.find(x => x.key === sl.deck); return g && g.pages[sl.page] ? {g, p: g.pages[sl.page]} : null; };
const slidesOf = () => DECK.flatMap(g => g.pages.map((p, i) => ({type: "deckPage", deck: g.key, page: i})));

/* the pages go after the day's own lessons, before its Practice Lab (a deck with none: before Ready for the Knowledge Check) */
const __build = buildDaySlides;
buildDaySlides = function(d){
  const s = __build.apply(this, arguments);
  if(!d || !d.cf || d.cf.n !== DAY || !Array.isArray(s)) return s;
  const lab = s.findIndex(x => x.type === "practiceLab"), at = lab >= 0 ? lab : s.findIndex(x => x.type === "readyCheck");
  s.splice(at >= 0 ? at : s.length, 0, ...slidesOf());
  return s;
};

if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    const x = pageOf(slide); if(!x) return __content.apply(this, arguments);
    return `<div class="cfx-deck cfx-dpk"><div class="cfx-dp" data-deck="${E(x.g.key)}"><img src="${E(src(x.g, slide.page))}" alt="${E(x.g.topic + ": " + x.p.title)}" decoding="async"></div></div>`;
  };
}
if(typeof daySlideTitle === "function"){
  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){ const x = pageOf(slide); return x ? `${x.g.topic} — ${x.p.title}` : __title.apply(this, arguments); };
}
if(typeof presenterCues === "function"){   // Presenter view: what the page is, where it sits, and any old-file facts on it
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    const x = pageOf(slide); if(!x) return __cues.apply(this, arguments);
    return `<h3>${E(x.g.topic)}: ${E(x.p.title)}</h3><p>Deck page ${slide.page + 1} of ${x.g.pages.length} for this topic. Walk the room through the page.</p>`
      + (x.p.old ? `<div class="pn-on pn-cue"><b>Trainer note — not read aloud</b><p>${E(x.p.old)}</p></div>` : "");
  };
}

const css = document.createElement("style");
css.textContent = `/* in the Case Flow stage card (the class cfx-deck), full width and centred, the presenter beside it */
.cfx-dpk{justify-content:center !important;align-items:center}
.cfx-dp{display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:0}
.cfx-dp img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;aspect-ratio:16/9;object-fit:contain;border-radius:10px;box-shadow:0 4px 18px rgba(30,35,64,.18)}`;
document.head.appendChild(css);
})();
