/* ============================================================
   The revised Day 2 deck's pages, on Case Flow Day 2, topic by topic.
   The trainers' revised Day 2 deck (Pre-Demand Case Auditing, the Demand, Settlement Negotiations and the BI
   Settlement) is shown page by page, as the page itself (decks/cf-deck/*.webp, rendered from the PDFs), after Day 2's
   own lessons and before its Practice Lab (a day is all its lessons, then one Practice Lab, then Ready for the
   Knowledge Check: the pages teach, so they close the lessons): each topic's pages, then its Skill Building, then
   the next topic. The deck's one Skill Building page (the Demand Phase Challenge) is the Demand
   topic's; the other three topics' Skill Building is drawn here (`skill`), on John Doe's file.
   (Day 3 still teaches the same topics as lessons, with their Skill Activities in the CMS.)
   A page that names the old practice file's facts (Apex Delivery, Dr. Sarah Spine, the $41,400 in specials, a PIP
   limit gone in 48 hours) carries `old`: the Presenter view tells the trainer what John Doe v. Robert Smith says.
   Saved places in a day move with the pages (js/cm-slide-places.js, layout 5).
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
  {key: "predemand-skill", topic: "Skill Building: Pre-Demand Case Auditing", skill: {
    title: "Audit Challenge: John Doe's File",
    lead: "Before any demand goes out, the file must give the defense zero easy outs.",
    steps: ["Open John Doe's file in the CMS beside the Police Report.",
      "Check the Trinity: the narrative, the evidence and the damages tell one story.",
      "Run the Defense-Eye audit: list every weak spot, the 14-day treatment gap first.",
      "Mark each item verified, missing or conflicting, with the document that shows it."],
    deliver: "A one-page Summary Memo in Case Notes for Atty. Thorne: findings and open items.",
    note: "Ten minutes, in pairs, then the room compares weak spots. Facts only: what a weak spot does to the claim's value is Atty. Thorne's call."}},
  {key: "demand", topic: "Demand", pages: [
    {title: "The Legal & Procedural Foundation"},
    {title: "The Policy Limit Mindset"},
    {title: "Treatment Gaps in the Demand Phase"},
    {title: "The Demand Packet Checklist"},
    {title: "Quality Control: the Final Scrub"},
    {title: "Negotiating the First Call"},
    {title: "Best Practices"}]},
  {key: "demand-skill", topic: "Skill Building: Demand", pages: [
    {title: "Demand Phase Challenge: Real-Time Demand Audit", old: "The page names the old practice file, John Doe v. Apex Delivery. Run the audit on John Doe v. Robert Smith's file in the CMS instead: the Big Four, the Final Scrub, and the 14-day gap explained in the timeline."}]},
  {key: "negotiation", topic: "Settlement Negotiations", pages: [
    {title: "The Pitch: the Negotiation Battle Map"},
    {title: "The Valuation Baseline: the Set-Off"},
    {title: "The Valuation Baseline: PIP as a Valuation Baseline", old: "The page's example (a $10,000 PIP limit gone in 48 hours, $41,400 in specials) is the old practice file's. Use John Doe v. Robert Smith's own PIP history and Specials from the CMS."},
    {title: "The Valuation Baseline: the EMC and the Benefit Ceiling", old: "The page names Dr. Sarah Spine, from the old practice file. On John Doe v. Robert Smith, take the EMC finding and its provider from the CMS."},
    {title: "The Valuation Baseline: Subrogation vs. Non-Subrogation"},
    {title: "The Valuation Baseline: Strategic Exhaustion"},
    {title: "Negotiations Initiated: the First Call"},
    {title: "The Bracketing Technique"},
    {title: "Common Adjuster Stall Tactics"},
    {title: "Close the Deal: the Final-Final"},
    {title: "The Never Rule"}]},
  {key: "negotiation-skill", topic: "Skill Building: Settlement Negotiations", skill: {
    title: "Build the Negotiation Battle Map",
    lead: "Walk into the first call with the file's numbers, drivers and rebuttals already written down.",
    steps: ["List the Net Sheet items: liens, costs and fees the settlement must cover.",
      "Name three value drivers from John Doe's records that would move a jury.",
      "Write the adjuster's two strongest pushbacks, the 14-day gap first, with a factual rebuttal.",
      "Draft a rebuttal line for each stall: authority, more records, low impact."],
    deliver: "The Battle Map in Case Notes, routed to Atty. Thorne before any call.",
    note: "Ten minutes, then two trainees role-play the first call from their maps. The Case Manager prepares; Atty. Thorne sets every number and approves every offer."}},
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
    {title: "Finalized Settlement: Final Lien Mitigation"}]},
  {key: "bisettlement-skill", topic: "Skill Building: BI Settlement", skill: {
    title: "Before the $10,000 BI Release Is Signed",
    lead: "John Doe's file has two UM layers behind Keystone's $10,000: the release must not cost him them.",
    steps: ["List what must be in hand before the BI release: both UM carriers' consent and waiver.",
      "Read the release's scope: Bodily Injury only, nothing that waives PIP or Property Damage.",
      "List every lienholder and the payoff letter you still need from each.",
      "Add the W-9 and the receipts behind every case cost on the Net Sheet."],
    deliver: "A closing checklist in Case Notes: each item done, requested or missing, with its date.",
    note: "Ten minutes, then the room builds one checklist together. Whether to sign stays Atty. Thorne's decision; the Case Manager makes sure nothing is missing."}}
];
const src = (g, i) => `${DIR}${g.key}-${String(i + 1).padStart(2, "0")}.webp`;
window.CM_DECK_PAGES = {DIR, DAY, DECK, src};   // .github/scripts/deck-pages.cjs
if(typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;

const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const pageOf = sl => { const g = sl && sl.type === "deckPage" && DECK.find(x => x.key === sl.deck); return g && (g.skill ? sl.page === 0 : g.pages[sl.page]) ? {g, p: g.skill || g.pages[sl.page]} : null; };
const slidesOf = () => DECK.flatMap(g => (g.skill ? [g.skill] : g.pages).map((p, i) => ({type: "deckPage", deck: g.key, page: i})));

/* the pages go after the day's own lessons, before its Practice Lab (a deck with none: before Ready for the Knowledge Check) */
const __build = buildDaySlides;
buildDaySlides = function(d){
  const s = __build.apply(this, arguments);
  if(!d || !d.cf || d.cf.n !== DAY || !Array.isArray(s)) return s;
  const lab = s.findIndex(x => x.type === "practiceLab"), at = lab >= 0 ? lab : s.findIndex(x => x.type === "readyCheck");
  s.splice(at >= 0 ? at : s.length, 0, ...slidesOf());
  return s;
};

function skillSlide(g){
  const k = g.skill;
  return `<div class="cfx-deck cfx-dpk"><div class="cfx-dsk"><div class="cfx-dsk-band"><span>🧩 ${E(g.topic)}</span><span>John Doe v. Robert Smith</span></div>
    <h2>${E(k.title)}</h2><p class="cfx-dsk-lead">${E(k.lead)}</p>
    <ol>${k.steps.map(x => `<li>${E(x)}</li>`).join("")}</ol>
    <p class="cfx-dsk-out"><b>Deliver</b>${E(k.deliver)}</p></div></div>`;
}
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    const x = pageOf(slide); if(!x) return __content.apply(this, arguments);
    if(x.g.skill) return skillSlide(x.g);
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
    if(x.g.skill) return `<h3>${E(x.g.topic)}: ${E(x.p.title)}</h3><p>${E(x.p.lead)}</p><div class="pn-on pn-cue"><b>Trainer note — not read aloud</b><p>${E(x.p.note)}</p></div>`;
    const sb = /^Skill Building/.test(x.g.topic);
    return `<h3>${E(x.g.topic)}: ${E(x.p.title)}</h3><p>Deck page ${slide.page + 1} of ${x.g.pages.length} for this topic. ${sb ? "Set the room the challenge on John Doe's file; ten minutes, then compare what each pair found." : "Walk the room through the page; the topic's Skill Building follows its last page."}</p>`
      + (x.p.old ? `<div class="pn-on pn-cue"><b>Trainer note — not read aloud</b><p>${E(x.p.old)}</p></div>` : "");
  };
}

const css = document.createElement("style");
css.textContent = `/* in the Case Flow stage card (the class cfx-deck), full width and centred, the presenter beside it */
.cfx-dpk{justify-content:center !important;align-items:center}
.cfx-dp{display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:0}
.cfx-dp img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;aspect-ratio:16/9;object-fit:contain;border-radius:10px;box-shadow:0 4px 18px rgba(30,35,64,.18)}
.cfx-dsk{display:flex;flex-direction:column;align-items:stretch;justify-content:center;gap:9px;width:100%;box-sizing:border-box;flex:1 1 auto;background:#FFFDF8;border-radius:16px;padding:20px 26px;box-shadow:0 6px 22px rgba(0,0,0,.18);text-align:left;color:#1E2340;font-weight:700}
.cfx-dsk-band{display:flex;justify-content:space-between;gap:12px;flex-wrap:wrap;background:#1E2340;color:#fff;border-radius:10px;padding:8px 16px;font-size:17px}
.cfx-dsk-band span:first-child{color:#DB8437}
.cfx-dsk h2{margin:2px 0 0;font-size:26px;font-weight:800;color:#1E2340}
.cfx-dsk-lead{margin:0;font-size:18px;color:#1E2340}
.cfx-dsk ol{margin:0;padding:0;list-style:none;counter-reset:dsk;display:flex;flex-direction:column;gap:6px}
.cfx-dsk li{counter-increment:dsk;display:flex;gap:12px;align-items:flex-start;font-size:17px;line-height:1.3;background:#fff;border:2px solid #E8E2D6;border-radius:10px;padding:7px 12px}
.cfx-dsk li::before{content:counter(dsk);flex:none;width:26px;height:26px;border-radius:50%;background:#DB8437;color:#fff;display:flex;align-items:center;justify-content:center;font-size:16px}
.cfx-dsk-out{margin:0;font-size:17px;background:#FBEBDD;border-left:6px solid #DB8437;border-radius:8px;padding:8px 14px}
.cfx-dsk .cfx-dsk-lead,.cfx-dsk .cfx-dsk-out{text-align:left!important;margin:0!important;max-width:none!important;align-self:stretch}
.cfx-dsk-out b{display:block;font-size:16px;text-transform:uppercase;letter-spacing:.06em;color:#B4621F;margin-bottom:2px}`;
document.head.appendChild(css);
})();
