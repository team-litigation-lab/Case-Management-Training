/* ============================================================
   A saved place follows its slide when the deck changes.
   A trainee's place in a day is a slide position: "last-slide" (where they were: Continue and Resume open it),
   "slide-progress" (the furthest slide reached: what Next has unlocked, and what turns a day's card to Review) and,
   across the reload that brings in a new version, the slide kept in sessionStorage (index.html: applyUpdate /
   restoreAfterUpdate). The Case Flow lessons had an On the Job slide (rows of Trigger ➔ Task ➔ Tool ➔ Checkpoint
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
   Then Day 1 was put in the order of the revised Day 1 deck (layout 4): Client Directions and the voicemail before the file
   is opened in the CMS (the voicemail comes in the morning the retainer is signed), and Case Management Fundamentals
   gained The Theory, Continued. A place on a slide that moved follows it to where it is now.
   The layouts: 1, the deck with On the Job (no layout on the saved place); 2, without On the Job (the deck with the
   Milestone Steps slides and every Why It Matters slide); 3, before Day 1 was reordered; 4, today's. A place saved in 1 is moved through every
   change in one go.
   Each saved object carries the layout it was written in (cfLayout), so the move happens once, on whichever device
   or tab reads it first, and a place saved since is left alone. The reload after an update says which layout its
   slide was saved in the same way (lsh_resume_layout): a page still running the old deck doesn't, and is moved.
   ============================================================ */
(function(){
"use strict";
if(typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;
const LAYOUT = 4, STAMP = "cfLayout", RESUME = "lsh_resume_after_update", RESUME_LAYOUT = "lsh_resume_layout";
const build = buildDaySlides;   // as js/cm-case-flow.js left it: a Case Flow block is one slide per view
const cfDay = d => !!(d && d.cf && Array.isArray(d.lessons));

/* the 26 lessons that had a Milestone Steps slide of their own in layouts 1 and 2 (the copy's "slide": true, which is
   gone with the slide: the list is the record of where those slides sat) */
const STEPS_WERE = new Set(("d1m1-upl d1m1-l1 d1m2-l1 d1m4-tplan d1m4-tmap d1m4-tcare d1m4-emc d1m4-l2 d2m1-l2 d2m1-afd d2m1-cov d2m2-l2 d2m2-pip "
  + "d2m3-l1 d2m3-cause d2m4-l1 d2m4-l2 d3m1-l2 d3m2-umw d3m2-l2 d3m3-l1 d3m3-l2 d3m4-l2 d3m4-close d4m2-l2 d4m3-l1").split(" "));
/* layout 3's Day 1: its blocks in their order then, and the slides layout 4 added */
const D1_WAS = ["d1m1-case", "d1m1-role", "d1m1-upl", "d1m1-l1", "d1m4-l1", "d1m1-open", "d1m1-drive", "d1m3-l1", "d1m3-l2", "d1m3-a1", "d1m3-a2", "d1m3-a3",
  "d1m2-l1", "d1m2-l2", "d1m2-a1", "d1m2-a2"];
const NEW_IN_4 = {"d1m1-role": ["theory2"]};
const keyOf = (d, sl) => { if(sl.type !== "topic") return "~" + sl.type; const b = d.lessons[sl.lessonIndex].cf.block, vs = window.cmCaseFlow ? window.cmCaseFlow.viewsOf(b) : []; return b.id + " " + vs[sl.part - 1]; };
/* a day's deck as it was in layout 3 (today's slides, in that order, without the ones layout 4 added); every other day
   is as it is today */
function deck3(d){
  const now = build(d);
  if(!d.cf || d.cf.n !== 1 || !window.cmCaseFlow) return now;
  const used = new Set(), out = [], take = sl => { used.add(sl); out.push(sl); };
  const idOf = sl => sl.type === "topic" ? d.lessons[sl.lessonIndex].cf.block.id : "";
  const first = now.findIndex(sl => sl.type === "topic");
  now.slice(0, first).filter(sl => !["practiceLab", "caseMap", "coverageMap", "readyCheck"].includes(sl.type)).forEach(take);
  let lab = false, lastAct = -1;
  D1_WAS.forEach(id => {
    const mine = now.filter(sl => idOf(sl) === id && !((NEW_IN_4[id] || []).includes(keyOf(d, sl).split(" ")[1])));
    if(!mine.length) return;
    const act = d.lessons[mine[0].lessonIndex].cf.block.kind === "activity";
    if(act && !lab){ lab = true; const pl = now.find(sl => sl.type === "practiceLab"); if(pl) take(pl); }
    mine.forEach(take);
    if(id === "d1m1-case") now.filter(sl => sl.type === "caseMap" || sl.type === "coverageMap").forEach(take);
    if(act) lastAct = out.length;
  });
  const rc = now.find(sl => sl.type === "readyCheck");
  // layout 3 put the module's key concepts after the last Skill Activity's task slide, as today's deck does
  if(rc){ const at = now.indexOf(rc), before = now[at - 1], k = before ? out.indexOf(before) : -1; used.add(rc); out.splice(k >= 0 ? k + 1 : lastAct, 0, rc); }
  now.forEach(sl => { if(!used.has(sl) && !(sl.type === "topic" && (NEW_IN_4[idOf(sl)] || []).includes(keyOf(d, sl).split(" ")[1]))) out.push(sl); });
  return out;
}
/* a lesson's slides as they were in an older layout, from the slides it has today */
function viewsWere(b, vs, from){
  const old = vs.slice(), tail = () => old.includes("dodont") ? old.indexOf("dodont") : old.length;
  // layouts 1 and 2: Why It Matters was a slide of its own, after The Theory's slides
  if(from < 3 && !old.includes("why")) old.splice(Math.max(old.indexOf("theory"), old.indexOf("theory2"), old.indexOf("frame")) + 1, 0, "why");
  // layouts 1 and 2: Milestone Steps, after The Rules or See It, before Do & Don't
  if(from < 3 && STEPS_WERE.has(b.id)) old.splice(tail(), 0, "steps");
  // layout 1: On the Job sat there in every other lesson that had its Trigger ➔ Task ➔ Tool ➔ Checkpoint rows
  if(from < 2 && (b.ops || []).length && !old.includes("steps")) old.splice(tail(), 0, "job");
  return old;
}
/* the day's deck as it was in layout `from`: for each of its positions, [today's slide for it, today's slide for
   "the furthest reached" when it was that position] */
function oldDeck(d, from){
  const views = window.cmCaseFlow && window.cmCaseFlow.viewsOf, out = [], deck = from < 4 ? deck3(d) : build(d);
  deck.forEach((sl, k) => {
    out.push([k, k]);
    const l = sl.type === "topic" ? d.lessons[sl.lessonIndex] : null, b = l && l.cf && l.cf.block;
    if(!b || !views || b.kind !== "lesson") return;   // only a lesson had any of these slides
    const vs = views(b), old = viewsWere(b, vs, from);
    const at = v => deck.findIndex(x => x.type === "topic" && x.lessonIndex === sl.lessonIndex && vs[x.part - 1] === v);
    // the slides that followed this one in the old deck and are gone: Why It Matters is on The Theory now, the
    // Milestone Steps are spoken on The Rules; On the Job, the lesson's slide before it
    for(let j = old.indexOf(vs[sl.part - 1]) + 1; j > 0 && j < old.length && !vs.includes(old[j]); j++){
      const t = old[j] === "why" ? at("theory") : old[j] === "steps" ? at("rules") : -1;
      out.push(t >= 0 && t <= k ? [t, k] : [k, k]);
    }
  });
  // positions in layout 3's deck, to the same slide in today's (Day 1 was reordered in layout 4)
  if(from < 4){
    const now = build(d), at = new Map(now.map((sl, k) => [keyOf(d, sl), k])), last = now.length - 1;
    const to = k => { const v = at.get(keyOf(d, deck[k])); return v === undefined ? Math.min(k, last) : v; };
    return out.map(([p, r]) => [to(p), to(r)]);
  }
  return out;
}
const layoutOf = from => { const n = Math.round(Number(from)) || 1; return n < 1 ? 1 : n; };
const placeMap = (d, from) => oldDeck(d, layoutOf(from)).map(x => x[0]);   // where each old position's slide is today
const reachMap = (d, from) => oldDeck(d, layoutOf(from)).map(x => x[1]);   // how far each old position had reached, in today's deck
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
        sessionStorage.setItem(RESUME, JSON.stringify(st));
      }
    }catch(e){ console.warn("[slide-places]", e); }
    return __restore.apply(this, arguments);
  };
}
window.cmSlidePlaces = {LAYOUT, placeMap, reachMap, moved, deck3};   // .github/scripts/slide-places.cjs
})();
