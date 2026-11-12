/* ============================================================
   A saved place follows its slide when the deck changes.
   A trainee's place in a day is a slide position: "last-slide" (where they were: Continue and Resume open it),
   "slide-progress" (the furthest slide reached: what Next has unlocked, and what turns a day's card to Review) and,
   across the reload that brings in a new version, the slide kept in sessionStorage (index.html: applyUpdate /
   restoreAfterUpdate). The Case Flow lessons had an On the Job slide (rows of Trigger ➔ Task ➔ Tool ➔ Checkpoint
   cards); it is gone, so every position after one moved up. A position saved in that deck is moved, once, to the
   same slide of today's: an On the Job slide itself becomes the lesson's Milestone Steps slide where that took its
   place, and otherwise the lesson's slide before it (The Rules or See It): the same lesson, never further on than
   the trainee had been, never past the end of the day.
   Each saved object carries the layout it was written in (cfLayout), so the move happens once, on whichever device
   or tab reads it first, and a place saved since is left alone. The reload after an update says which layout its
   slide was saved in the same way (lsh_resume_layout): a page still running the old deck doesn't, and is moved.
   ============================================================ */
(function(){
"use strict";
if(typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;
const LAYOUT = 2, STAMP = "cfLayout", RESUME = "lsh_resume_after_update", RESUME_LAYOUT = "lsh_resume_layout";
const build = buildDaySlides;   // as js/cm-case-flow.js left it: a Case Flow block is one slide per view
const cfDay = d => !!(d && d.cf && Array.isArray(d.lessons));

/* today's slide for each position of the day's deck as it was with the On the Job slides */
function placeMap(d){
  const views = window.cmCaseFlow && window.cmCaseFlow.viewsOf, map = [];
  build(d).forEach((sl, k) => {
    map.push(k);
    const l = sl.type === "topic" ? d.lessons[sl.lessonIndex] : null, b = l && l.cf && l.cf.block;
    if(!b || !views || b.kind !== "lesson" || !(b.ops || []).length) return;   // only a lesson with ops had the slide
    const vs = views(b);
    if(vs.includes("steps")) return;   // Milestone Steps sits where On the Job sat: nothing moved in this lesson
    const at = vs.includes("dodont") ? vs.indexOf("dodont") : vs.length;   // On the Job came after The Rules or See It, before Do & Don't
    if(sl.part === at) map.push(k);   // the On the Job slide itself: its lesson's slide before it
  });
  return map;
}
function moved(d, i){
  const m = placeMap(d); if(!m.length) return 0;
  return m[Math.max(0, Math.min(Math.round(Number(i) || 0), m.length - 1))];
}

/* a saved object, moved once and stamped with today's layout; true when a place in it moved or was there to move */
const FIELD = {"last-slide": "lastSlide", "slide-progress": "slideProgress"};
const current = o => !o || typeof o !== "object" || o[STAMP] >= LAYOUT;
function settle(o){
  if(current(o)) return false;
  let had = false;
  DAYS.forEach(d => {
    const i = o[d.id]; if(!cfDay(d) || typeof i !== "number" || !(i > 0)) return;
    had = true; o[d.id] = moved(d, i);
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
    try{ if(FIELD[key] && settle(v)) __set(key, v); }catch(e){ console.warn("[slide-places]", e); }
    return v;
  };
  window.storeSet = function(key, val){
    // the page's own place, saved: in today's layout by definition (a copy from the account is not: it is moved when it is read back)
    if(FIELD[key] && val && typeof val === "object" && val === state[FIELD[key]] && !current(val)) val[STAMP] = LAYOUT;
    return __set.apply(this, arguments);
  };
  window.addEventListener("storage", e => {   // (index.html's own listener, registered first, has put the other tab's value in state)
    const key = e.key && e.key.indexOf("lsh_") === 0 ? e.key.slice(4) : "";
    try{ if(FIELD[key] && e.newValue !== null && settle(state[FIELD[key]])) __set(key, state[FIELD[key]]); }catch(err){ console.warn("[slide-places]", err); }
  });
  try{ Object.keys(FIELD).forEach(key => { if(settle(state[FIELD[key]])) __set(key, state[FIELD[key]]); }); }catch(e){ console.warn("[slide-places]", e); }
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
        st.lessonSlide = moved(d, st.lessonSlide);
        sessionStorage.setItem(RESUME, JSON.stringify(st));
      }
    }catch(e){ console.warn("[slide-places]", e); }
    return __restore.apply(this, arguments);
  };
}
window.cmSlidePlaces = {LAYOUT, placeMap, moved};   // .github/scripts/slide-places.cjs
})();
