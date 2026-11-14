/* ============================================================
   The trainers' Day 3, 4 and 5 decks, page by page, on Case Flow Days 3, 4 and 5.
   Each deck (Day 3: lien negotiations and disbursement; Day 4: mediation and arbitration; Day 5: litigation and
   property damage) is shown as its own pages (decks/dayN/NN.webp), topic by topic, after the day's own lessons and
   before its Practice Lab, the way js/cm-deck-pages.js shows the Day 2 deck. Only the teaching pages: no title,
   agenda or Thank You page, and none of the decks' Skill Building pages (they were from another practice file; the
   course keeps its own Skill Building, on John Doe's file in the CMS).
   🖥 Presenter view shows the page's talking points: the narration of the day's video, which discusses the page and
   ties it to John Doe VS Robert Smith (where the page shows another example, it says so and gives the file's facts).
   The pages come from build/videoslide/dayN.json ("onDeck") through js/cm-deck-slides.js (window.CM_DAY_DECKS).
   Slides are of type "deckPage" (deck "dN-topic", page i), so the daily loop keeps them with the lessons
   (js/cm-day-loop.js) and a saved place follows its slide by key (js/cm-slide-keys.js): no migration.
   Checked by .github/scripts/day-decks.cjs.
   ============================================================ */
(function(){
"use strict";
const DECKS = window.CM_DAY_DECKS || {};
if(typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;

const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"}[c]));
const all = Object.values(DECKS).flat();
const pageOf = sl => { const g = sl && sl.type === "deckPage" && all.find(x => x.key === sl.deck); return g && g.pages[sl.page] ? {g, p: g.pages[sl.page]} : null; };
const slidesOf = n => (DECKS[n] || []).flatMap(g => g.pages.map((p, i) => ({type: "deckPage", deck: g.key, page: i})));

/* the pages go after the day's own lessons, before its Practice Lab (none: before Ready for the Knowledge Check) */
const __build = buildDaySlides;
buildDaySlides = function(d){
  const s = __build.apply(this, arguments);
  if(!d || !d.cf || !DECKS[d.cf.n] || !Array.isArray(s)) return s;
  const lab = s.findIndex(x => x.type === "practiceLab"), at = lab >= 0 ? lab : s.findIndex(x => x.type === "readyCheck");
  s.splice(at >= 0 ? at : s.length, 0, ...slidesOf(d.cf.n));
  return s;
};

if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    const x = pageOf(slide); if(!x) return __content.apply(this, arguments);
    return `<div class="cfx-deck cfx-dpk"><div class="cfx-dp" data-deck="${E(x.g.key)}"><img src="${E(x.p.img)}" alt="${E(x.g.topic + ": " + x.p.title)}" decoding="async"></div></div>`;
  };
}
if(typeof daySlideTitle === "function"){
  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){ const x = pageOf(slide); return x ? `${x.g.topic} — ${x.p.title}` : __title.apply(this, arguments); };
}
if(typeof presenterCues === "function"){   // Presenter view: what the page is, where it sits, and its talking points
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    const x = pageOf(slide); if(!x) return __cues.apply(this, arguments);
    return `<h3>${E(x.g.topic)}: ${E(x.p.title)}</h3><p>Deck page ${slide.page + 1} of ${x.g.pages.length} for this topic (page ${x.p.page} of the deck).</p>`
      + `<div class="pn-on pn-cue cm-dd-talk"><b>Talking points — John Doe VS Robert Smith</b><p>${E(x.p.notes)}</p></div>`;
  };
}

/* the page itself is laid out by js/cm-deck-pages.js's rules (cfx-dpk, cfx-dp); these stand in if it isn't loaded */
const css = document.createElement("style");
css.textContent = `.cfx-dpk{justify-content:center !important;align-items:center}
.cfx-dp{display:flex;align-items:center;justify-content:center;width:100%;height:100%;min-height:0}
.cfx-dp img{display:block;max-width:100%;max-height:100%;width:auto;height:auto;aspect-ratio:16/9;object-fit:contain;border-radius:10px;box-shadow:0 4px 18px rgba(30,35,64,.18)}
.cm-dd-talk p{white-space:normal;line-height:1.5}`;
document.head.appendChild(css);
window.cmDayDecks = {pageOf, slidesOf};   // .github/scripts/day-decks.cjs
})();
