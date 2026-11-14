/* ============================================================
   A saved place follows its slide when the deck changes.
   A trainee's place in a day is a slide position: "last-slide" (where they were: Continue and Resume open it),
   "slide-progress" (the furthest slide reached: what Next has unlocked, and what turns a day's card to Review) and,
   across the reload that brings in a new version, the slide kept in sessionStorage (index.html: applyUpdate /
   restoreAfterUpdate). The Case Flow lessons had an On the Job slide (their operational steps as rows of
   cards); it is gone, so every position after one moved up. A position saved in that deck is moved, once, to the
   same slide of today's: an On the Job slide itself becomes the lesson's slide before it (The Rules or See It):
   the same lesson, never further on than the trainee had been, never past the end of the day. (In 26 lessons a
   Milestone Steps slide took On the Job's place, position for position.)
   Then two more slides went, in one change (the deck called layout 3):
   · Milestone Steps, the slide 26 lessons had where On the Job had been: gone from every one of them (those lessons'
     steps are in the trainer's talking points for The Rules). A place on one becomes the lesson's The Rules slide;
     the furthest slide reached becomes the slide before it (The Rules or See It).
   · Why It Matters, in every lesson whose Theory slide now opens with it (js/cm-case-flow.js: whyView). A place on
     one becomes the lesson's The Theory slide (where its line now is); the furthest slide reached becomes the slide
     the trainee had already passed to get there (The Framework, or The Theory, Continued, or The Theory).
   Every position after a slide that is gone moved up; nothing the trainee had not seen is unlocked, nothing seen is
   locked again, and no place leaves its lesson or passes the end of the day.
   Then the day's ORDER changed (layout 4): a day is ALL of its lessons, then ONE Practice Lab that holds all of its
   Skill Activities, then 🎯 Ready for the Knowledge Check? as the last slide (Day 5: its lessons, the companion-case
   build, the optional extra practice, then the Ready check). Before, a day ran a group of lessons, their activities,
   the next group of lessons … so the same slide now sits at another position. No slide was added or taken away: the
   deck of layout 3 is recorded below (ORDER3: each day's blocks and its own slides, in the order they were), and a
   place saved in it lands on the same slide of the same block in today's deck. The furthest slide reached becomes
   the furthest of the slides the trainee had seen, as today's deck orders them: nothing seen is locked again, the
   place the trainee was on is always inside it, and it is the day's last slide only for a trainee who had reached
   the Ready check or the end.
   Then the trainers' deck pages came in (layout 5), two ways in one change:
   · six lessons show the trainer's own Canva deck pages in place of their drawn slides (js/cm-deck-slides.js,
     window.CM_DECK_SLIDES), so those lessons have a different number of slides, and every slide after one sits at
     another position. A place saved before is first carried to today's order (as above); then, where its lesson is
     now drawn from the deck, it keeps its lesson and how far through it the trainee was: slide j of the m the lesson
     had in the layout the place was saved in becomes deck page ⌊j·n/m⌋ of its n.
   · the revised Day 2 deck's pages and their Skill Building are slides of their own on Day 2, after its last lesson
     and before its Practice Lab (js/cm-deck-pages.js, slides of type "deckPage"). No older deck had them: a place
     saved before them stays on the slide it was on, and the pages count as seen for a trainee who was past them.
   The furthest slide reached is, as before, the furthest in today's order of the slides seen.
   Then Day 1's four Skill Building pages went (layout 6): they were from another case than John Doe VS Robert Smith.
   They were the last two deck pages of two lessons (GONE6); a place on one becomes the lesson's last page now, and
   every slide after them moved up.
   In the same change Day 2's four Skill Building slides went from its deck pages (js/cm-deck-pages.js), one after each
   topic's pages (GONE6_DECK): a place on one becomes that topic's last page, and every slide after it moved up.
   Then Meet John Doe left the lesson deck (layout 7): Day 1's first lesson, Meet Your Case (d1m1-case), and the two
   introduction slides after it (The Life of John Doe's File, Coverage vs. Injury) are gone; their facts are on the
   Case Profile now (js/cm-case-profile.js), and one new slide right after Day 1's last lesson ("meetJohnDoe") sends
   the trainee there. A place saved on one of the slides that are gone lands on the slide before them (the Training
   Agenda); every other place keeps its slide. The new slide is in no older deck: no older place lands on it, and it
   counts as seen for a trainee who was past it.
   Then the lesson cards the trainers' decks replaced left the course (layout 8): Day 1's UPL Line, Client Directions and
   Final Warning Letter, Day 2's PIP Strategy, Day 3's Demand Package, Adjuster Delay Tactics and UM Consent & Waiver
   (GONE8: each with the lesson it followed). Their rules are 💡 Tips on the activities that practised them
   (js/cm-lesson-tips.js). A place saved on one of their slides lands on the slide before them; every other place keeps
   its slide.
   The layouts: 1, the deck with On the Job (no layout on the saved place); 2, without On the Job (the deck with the
   Milestone Steps slides and every Why It Matters slide); 3, without those, in the old order; 4, in today's order,
   every lesson on its own drawn slides; 5, with the deck pages, Day 1's and Day 2's Skill Building pages and Meet
   Your Case; 6, without the Skill Building pages, still with Meet Your Case; 7, without Meet Your Case, still with the
   lesson cards the decks replaced; 8, today's. A place saved in any older
   layout is moved through every change in one go (a place saved in 5 loses the Skill Building pages and Meet Your
   Case together; one saved in 6, only Meet Your Case).
   Layout 8 is the last numbered layout; from now on places are saved by slide key: a deck change needs no migration
   and no edit here (js/cm-slide-keys.js). The records below (ORDER3, GONE6, GONE6_DECK, GONE, NEW7, GONE8) are frozen,
   and so is layout 7's deck itself (js/cm-slide-keys7.js, window.CM_SLIDE_KEYS7), and layout 8's with it (layout 7's
   without the lesson cards GONE8 names, keys8): an older place is moved into layout 7's deck (oldDeck), then by key
   into layout 8's (to8: a lesson card's slide on the slide before it), never into today's, so the moves stay right
   whatever later decks add, take away or reorder. A place moved here is a position in layout 8's deck;
   js/cm-slide-keys.js (from8) then puts it on the same slide of today's deck by its key.
   Each saved object carries the layout it was written in (cfLayout), so the move happens once, on whichever device
   or tab reads it first, and a place saved since is left alone. The reload after an update says which layout its
   slide was saved in the same way (lsh_resume_layout): a page still running the old deck doesn't, and is moved.
   ============================================================ */
(function(){
"use strict";
if(typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;
const LAYOUT = 8, STAMP = "cfLayout", RESUME = "lsh_resume_after_update", RESUME_LAYOUT = "lsh_resume_layout";
const build = buildDaySlides;   // as js/cm-case-flow.js and js/cm-deck-pages.js left it: a Case Flow block is one slide per view
const K7 = window.CM_SLIDE_KEYS7 || null;   // layout 7's deck, frozen (js/cm-slide-keys7.js)
const cfDay = d => !!(d && d.cf && Array.isArray(d.lessons));

/* Layout 3's deck, day by day (the deck before the lessons were put together and the Skill Activities into one
   Practice Lab): a block's id stands for its run of slides (its views, which did not change), "~type" for one of the
   day's own slides; "id/1" for a block's first slide alone, where another slide sat inside the block (Day 1's Ready
   check sat after the last activity's Your Task). Recorded from that deck; never edit it to match a later one. */
const ORDER3 = {
  1: "~taskOverview d1m1-case ~caseMap ~coverageMap d1m1-role d1m1-upl d1m1-l1 d1m4-l1 ~practiceLab d1m1-open d1m1-drive d1m3-l1 d1m3-l2 d1m3-a1 d1m3-a2 d1m3-a3 d1m2-l1 d1m2-l2 d1m2-a1 d1m2-a2/1 ~readyCheck d1m2-a2",
  2: "~taskOverview d2m1-l2 d2m1-afd d2m1-liab d2m1-first d2m1-l1 ~practiceLab d1m1-a1 d2m1-a1 d2m1-a2 d1m4-tplan d1m4-tmap d1m4-tcare d1m4-l2 d1m4-a1 d1m4-a2 d2m1-cov d2m2-l1 d2m2-eob d2m2-pip d1m4-emc d2m2-lop d2m2-cost d2m2-a1 d2m2-a3 d1m1-l2 d1m1-a2 d2m2-sum d2m2-l2 d2m2-a2 d2-drive ~readyCheck",
  3: "~taskOverview d2m3-l1 d2m3-l2 ~practiceLab d2m3-a1 d2m3-a2 d2m3-cause d2m4-l1 d2m4-l2 d2m4-wage d2m4-a1 d2m4-a2 d3m1-l1 d3m1-l2 d3m1-pkg d3-drive d3m1-a1 d3m1-a2 d3m2-l1 d3m2-umw d3m2-l2 d3m2-a1 d3m2-rel d3m2-exec d3m2-bins d3m2-a2 d3m2-umns ~readyCheck",
  4: "~taskOverview d3m3-l1 d3m3-l2 d3m3-l3 ~practiceLab d3m3-a1 d3m3-a2 d3m4-l1 d3m4-l2 d3m4-close d3m4-a1 d3m4-pal d3m4-a2 d4-drive d4m2-l1 d4m2-um d4m2-l2 d4m2-a3 d4m2-a1 d4m2-medcal d4m2-a2 d4m2-arbcal d4m3-l1 d4m3-l2 d4m3-prior d4m3-tx d4m3-a1 d4m3-a2 ~readyCheck",
  5: "~taskOverview d4m1-l1 d4m1-l2 d4m4-l1 d4m4-l2 d5m1-l1 d5m1-l2 d5m1-subp d5m2-l1 d5m3-l1 d5m3-l2 d5m4-l1 d5m4-l2 d5m5-l1 d5m6-l1 ~companionBuild ~companionBuild2 ~readyCheck ~extraPractice d4m1-a1 d4m1-a2 d4m1-efile d4m4-a1 d4m4-a2 d5m1-a1 d5m1-a2 d5m2-a1 d5m3-a1 d5m3-a2 d5m4-a1 d5m4-a2 d5m5-a1 d5-drive d5m6-a1"
};
/* layout 5's Skill Building pages, gone in layout 6: how many each lesson ended on (they were its last deck pages).
   A record of that deck; never edit it to match a later one. */
const GONE6 = {"d1m1-l1": 2, "d1m4-tcare": 2};
/* layout 5's Skill Building slides on Day 2's deck pages, gone in layout 6: how many followed each topic's last page. */
const GONE6_DECK = {"predemand": 1, "demand": 1, "negotiation": 1, "bisettlement": 1};
/* Layout 7: the blocks that left the deck, with the drawn slides they had in layouts 3 to 6 (layouts 1 and 2 add
   theirs as viewsWere does for any lesson), the day they sat on, the day's own slide they followed and the day's own
   slides that went with them (each "~type" in ORDER3 that today's deck no longer has lands on the slide before by
   itself). And the day's own slides that layout 7 added, in no older deck. */
const GONE = {"d1m1-case": {day: 1, after: "taskOverview", views: ["theory", "frame", "rules", "model", "dodont"], ops: true, with: ["caseMap", "coverageMap"]}};
const NEW7 = new Set(["meetJohnDoe"]);
/* Layout 8: the lesson cards the trainers' decks replaced left the course's order (their block keeps `retired`; its
   rules are a 💡 Tip, js/cm-lesson-tips.js). Each sat right after the lesson named here, in every layout from 4 to 7
   (several after one lesson sit in this order); in layouts 1 to 3 they are in ORDER3. A place on one lands on the
   slide before it. A record of the deck of layout 7; never edit it to match a later one. */
const GONE8 = {"d1m1-upl": "d1m1-role", "d1m3-l1": "d1m4-l1", "d1m2-l2": "d1m2-l1", "d2m2-pip": "d2m2-eob",
  "d3m1-pkg": "d3m1-l2", "d3m2-l1": "d3m1-l2", "d3m2-umw": "d3m1-l2"};
const goneRun = (id, from) => { const g = GONE[id]; return viewsWere({id, kind: "lesson", ops: g.ops ? [1] : []}, g.views.slice(), from).length; };
/* a lesson drawn from the trainer's deck pages in layout 7 (since layout 5): its slides before were its own drawn ones */
const deckLesson = b => !!(b && b.kind === "lesson" && Array.isArray(b.drawn));
/* Layout 7's deck of a day, rebuilt from its frozen record: its slides as buildDaySlides gave them ({type, lessonIndex,
   part} for a block's slide, {type: "deckPage", deck, page}, {type} for the day's own) and its blocks in order ({id,
   kind, ops, drawn, views}: lessonIndex counts these). A day with no record (one added since) is today's deck. */
function deck7(d){
  const row = K7 && K7.days && d.cf && K7.days[d.cf.n], lessons = [], slides = [];
  if(!row){
    const views = window.cmCaseFlow && window.cmCaseFlow.viewsOf, cf = window.cmCaseFlow || {};
    d.lessons.forEach(l => { const b = (l.cf && l.cf.block) || {};
      lessons.push({id: b.id, kind: b.kind, ops: b.ops || [], drawn: (window.CM_DECK_SLIDES || {})[b.id] && cf.drawnViewsOf ? cf.drawnViewsOf(b) : null, views: views && l.cf ? views(b) : []}); });
    return {slides: build(d), lessons};
  }
  const at = {};
  row.forEach(key => {
    const k = key.replace(/#\d+$/, "");
    if(k.indexOf("~deckPage:") === 0){ const p = k.split(":"); slides.push({type: "deckPage", deck: p[1], page: Number(p[2])}); return; }
    if(k[0] === "~"){ slides.push({type: k.slice(1)}); return; }
    const c = k.indexOf(":"), id = k.slice(0, c);
    if(!(id in at)){ const m = (K7.blocks || {})[id] || {}; at[id] = lessons.length; lessons.push({id, kind: m.kind, ops: m.ops ? [1] : [], drawn: m.drawn || null, views: []}); }
    const b = lessons[at[id]]; b.views.push(k.slice(c + 1));
    slides.push({type: "topic", lessonIndex: at[id], part: b.views.length});
  });
  return {slides, lessons};
}
/* the 26 lessons that had a Milestone Steps slide of their own in layouts 1 and 2 (the copy's "slide": true, which is
   gone with the slide: the list is the record of where those slides sat) */
const STEPS_WERE = new Set(("d1m1-upl d1m1-l1 d1m2-l1 d1m4-tplan d1m4-tmap d1m4-tcare d1m4-emc d1m4-l2 d2m1-l2 d2m1-afd d2m1-cov d2m2-l2 d2m2-pip "
  + "d2m3-l1 d2m3-cause d2m4-l1 d2m4-l2 d3m1-l2 d3m2-umw d3m2-l2 d3m3-l1 d3m3-l2 d3m4-l2 d3m4-close d4m2-l2 d4m3-l1").split(" "));
/* a lesson's slides as they were in an older layout, from the slides it has today */
/* lessons whose drawn slides changed after layout 4 although no layout counts them now: d1m1-role's Theory cards grew
   (Case Management Fundamentals: nine duties, seven steps) to two slides, The Theory, Continued; before, it had one */
const THEORY2_NEW = new Set(["d1m1-role"]);
function viewsWere(b, vs, from){
  const old = vs.filter(v => !(v === "theory2" && THEORY2_NEW.has(b.id) && from <= 4)), tail = () => old.includes("dodont") ? old.indexOf("dodont") : old.length;
  // layouts 1 and 2: Why It Matters was a slide of its own, after The Theory's slides
  if(from < 3 && !old.includes("why")) old.splice(Math.max(old.indexOf("theory"), old.indexOf("theory2"), old.indexOf("frame")) + 1, 0, "why");
  // layouts 1 and 2: Milestone Steps, after The Rules or See It, before Do & Don't
  if(from < 3 && STEPS_WERE.has(b.id)) old.splice(tail(), 0, "steps");
  // layout 1: On the Job sat there in every other lesson that had operational steps (ops) in its data
  if(from < 2 && (b.ops || []).length && !old.includes("steps")) old.splice(tail(), 0, "job");
  return old;
}
/* a block's run of slides as it was in layout `from`: for each, [today's slide for it, the slide of today's the
   trainee had passed to be there] */
function runWas(D, li, from){
  const deck = D.slides, b = D.lessons[li], vs = b.views, out = [];
  const part = p => deck.findIndex(x => x.type === "topic" && x.lessonIndex === li && x.part === p + 1);
  if(from < 5 && deckLesson(b)){
    // drawn from the deck now: the slides it had, spread over its deck pages in order (slide j of m: page ⌊j·n/m⌋ of n)
    const was = viewsWere(b, b.drawn.slice(), from), n = vs.length;
    was.forEach((v, j) => { const t = part(Math.min(n - 1, Math.floor(j * n / was.length))); out.push([t, t]); });
    return out;
  }
  const old = b.kind === "lesson" ? viewsWere(b, vs, from) : vs, at = v => part(vs.indexOf(v));
  vs.forEach((v, p) => {
    const k = part(p); out.push([k, k]);
    // the slides that followed this one in the old deck and are gone: Why It Matters is on The Theory now, the
    // Milestone Steps are spoken on The Rules; On the Job, the lesson's slide before it
    for(let j = old.indexOf(v) + 1; j > 0 && j < old.length && !vs.includes(old[j]); j++){
      const t = old[j] === "why" ? at("theory") : old[j] === "steps" ? at("rules") : -1;
      out.push(t >= 0 && t <= k ? [t, k] : [k, k]);
    }
  });
  // layout 5: the lesson ended on Skill Building pages that are gone; a place on one is on its last page now
  if(from === 5 && GONE6[b.id] && vs.length){ const last = part(vs.length - 1); for(let g = 0; g < GONE6[b.id]; g++) out.push([last, last]); }
  return out;
}
/* the day's deck as it was in layout `from`: for each of its positions, [layout 7's slide for it, layout 7's slide for
   "the furthest reached" when it was that position] (positions in layout 7's frozen deck, deck7) */
function oldDeck(d, from){
  const D = deck7(d), deck = D.slides, out = [];
  const row = from < 4 ? ORDER3[d.cf && d.cf.n] : null;
  if(row){
    // layouts 1 to 3: the old order, block by block ("id/1": the block's first slide alone, the rest at its next mention)
    const used = {}, typeAt = t => deck.findIndex(x => x.type === t);
    row.split(" ").forEach(tok => {
      if(tok[0] === "~"){ const k = typeAt(tok.slice(1)); out.push([k, k]); return; }
      const [id, n] = tok.split("/"), li = D.lessons.findIndex(b => b.id === id);
      if(li < 0 && GONE[id]){ for(let p = goneRun(id, from); p > 0; p--) out.push([-1, -1]); return; }   // left the deck (layout 7): lands on the slide before
      if(li < 0) return;
      const run = runWas(D, li, from), a = used[id] || 0, z = n ? Math.min(run.length, a + Number(n)) : run.length;
      for(let p = a; p < z; p++) out.push(run[p]);
      used[id] = z;
    });
  } else {
    // layout 4 (and a day whose order was never recorded): today's order, each block's run where its first slide is
    deck.forEach((sl, k) => {
      if(sl.type === "deckPage" && from < 5) return;   // the revised deck's pages came in with layout 5 (ORDER3 has none either)
      if(NEW7.has(sl.type) && from < 7) return;   // and Meet John Doe's slide with layout 7
      if(sl.type !== "topic"){
        out.push([k, k]);
        // the blocks that left the deck in layout 7 sat after this slide, with their own slides: each lands on the slide before
        if(from < 7) Object.keys(GONE).filter(id => GONE[id].day === (d.cf && d.cf.n) && GONE[id].after === sl.type)
          .forEach(id => { for(let p = goneRun(id, from) + GONE[id].with.length; p > 0; p--) out.push([-1, -1]); });
        // layout 5: the topic's Skill Building slide followed its last deck page; gone, a place on it lands on that page
        const n = sl.type === "deckPage" && from === 5 ? GONE6_DECK[sl.deck] || 0 : 0, nx = deck[k + 1];
        if(n && !(nx && nx.type === "deckPage" && nx.deck === sl.deck)) for(let g = 0; g < n; g++) out.push([-1, -1]);
        return;
      }
      if(sl.part === 1) runWas(D, sl.lessonIndex, from).forEach(x => out.push(x));
    });
  }
  // a slide that is gone lands on the one before it
  out.forEach((x, i) => { if(x[0] < 0){ const p = i ? out[i - 1] : [0, 0]; x[0] = p[0]; x[1] = p[1]; } });
  // the furthest slide reached: the furthest, in today's order, of every slide up to that position
  let far = 0; out.forEach(x => { far = Math.max(far, x[1], x[0]); x[1] = far; });
  return out;
}
/* layout 8's deck of a day, frozen, as slide keys: layout 7's record without the lesson cards GONE8 names (null for a
   day with no record) */
const blockKey = k => String(k).replace(/#\d+$/, "").split(":")[0];
function keys8(d){
  const row = K7 && K7.days && d && d.cf && K7.days[d.cf.n];
  return Array.isArray(row) ? row.filter(k => !GONE8[blockKey(k)]) : null;
}
/* a position in layout 7's deck, in layout 8's: its slide, or (a lesson card that left) the nearest slide before it */
function to8(d, j){
  const row = K7 && K7.days && d && d.cf && K7.days[d.cf.n], k8 = keys8(d);
  if(!Array.isArray(row) || !k8) return j;
  for(let t = Math.min(j, row.length - 1); t >= 0; t--){ const x = k8.indexOf(row[t]); if(x >= 0) return x; }
  return 0;
}
const layoutOf = from => { const n = Math.round(Number(from)) || 1; return n < 1 ? 1 : n; };
const placeMap7 = (d, from) => oldDeck(d, layoutOf(from)).map(x => x[0]);   // where each old position's slide is in layout 7's deck
const reachMap7 = (d, from) => oldDeck(d, layoutOf(from)).map(x => x[1]);   // how far each old position had reached, in layout 7's deck
const placeMap = (d, from) => placeMap7(d, from).map(j => to8(d, j));   // ... in layout 8's deck
const reachMap = (d, from) => reachMap7(d, from).map(j => to8(d, j));
/* a place saved in layout `from`, as a position in layout 8's deck (js/cm-slide-keys.js from8 takes it on to today's) */
function moved(d, i, from, far){
  if(layoutOf(from) >= LAYOUT) return Math.max(0, Math.round(Number(i) || 0));
  const m = far ? reachMap(d, from) : placeMap(d, from); if(!m.length) return 0;
  return m[Math.max(0, Math.min(Math.round(Number(i) || 0), m.length - 1))];
}

/* a saved object, moved once and stamped with today's layout; true when a place in it moved or was there to move */
const FIELD = {"last-slide": "lastSlide", "slide-progress": "slideProgress"};
const current = o => !o || typeof o !== "object" || o[STAMP] >= LAYOUT;
function settle(o, key){
  if(current(o)) return false;
  let had = false;
  DAYS.forEach(d => {
    const i = o[d.id]; if(!cfDay(d) || typeof i !== "number" || !(i > 0)) return;
    had = true; o[d.id] = moved(d, i, o[STAMP], key === "slide-progress");   // the layout it was saved in; no layout on it: the first
  });
  o[STAMP] = LAYOUT;
  return had;
}
/* Places are moved where they come in from storage, never in memory: what this page saves is already in today's
   layout. So: whatever was loaded before this file ran (the first loadAll), now; every later read of the two keys
   (sign-in, the copy restored from the account), as it is read; a place another tab of the old version wrote, as it
   arrives. And every place this page saves is stamped as it is written. */
const __get = window.storeGet, __set = window.storeSet;
if(typeof __get === "function" && typeof __set === "function"){
  window.storeGet = async function(key){
    const v = await __get.apply(this, arguments);
    try{ if(FIELD[key] && settle(v, key)) __set(key, v); }catch(e){ console.warn("[slide-places]", e); }
    return v;
  };
  window.storeSet = function(key, val){
    // the page's own place, saved: in today's layout by definition (a copy from the account is not: it is moved when it is read back)
    if(FIELD[key] && val && typeof val === "object" && val === state[FIELD[key]] && !current(val)) val[STAMP] = LAYOUT;
    return __set.apply(this, arguments);
  };
  window.addEventListener("storage", e => {   // (index.html's own listener, registered first, has put the other tab's value in state)
    const key = e.key && e.key.indexOf("lsh_") === 0 ? e.key.slice(4) : "";
    try{ if(FIELD[key] && e.newValue !== null && settle(state[FIELD[key]], key)) __set(key, state[FIELD[key]]); }catch(err){ console.warn("[slide-places]", err); }
  });
  try{ Object.keys(FIELD).forEach(key => { if(settle(state[FIELD[key]], key)) __set(key, state[FIELD[key]]); }); }catch(e){ console.warn("[slide-places]", e); }
}

/* the reload after an update: the slide it kept is in today's layout only if this code wrote it */
if(typeof window.applyUpdate === "function"){
  const __apply = window.applyUpdate;
  window.applyUpdate = function(){ try{ sessionStorage.setItem(RESUME_LAYOUT, String(LAYOUT)); }catch(e){} return __apply.apply(this, arguments); };
}
if(typeof window.restoreAfterUpdate === "function"){
  const __restore = window.restoreAfterUpdate;
  window.restoreAfterUpdate = function(){
    try{
      const wrote = Number(sessionStorage.getItem(RESUME_LAYOUT)) || 0; sessionStorage.removeItem(RESUME_LAYOUT);
      const st = JSON.parse(sessionStorage.getItem(RESUME) || "null"), d = st && st.view === "day" ? DAYS.find(x => x.id === st.dayId) : null;
      if(d && cfDay(d) && typeof st.lessonSlide === "number" && wrote < LAYOUT){
        st.lessonSlide = moved(d, st.lessonSlide, wrote);   // the layout the page that kept it was running (none said: the first)
        if(window.cmSlideKeys && typeof window.cmSlideKeys.from8 === "function") st.lessonSlide = window.cmSlideKeys.from8(d, st.lessonSlide);   // and on, by key, to today's deck
        sessionStorage.setItem(RESUME, JSON.stringify(st));
      }
    }catch(e){ console.warn("[slide-places]", e); }
    return __restore.apply(this, arguments);
  };
}
window.cmSlidePlaces = {LAYOUT, placeMap, reachMap, placeMap7, reachMap7, moved, deck7, keys8, to8, GONE8};   // .github/scripts/slide-places.cjs
})();
