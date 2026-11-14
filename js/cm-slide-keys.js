/* ============================================================
   A saved place is saved by slide key, so a deck change needs no migration.
   A trainee's place in a day is a slide position: "last-slide" (where they were) and "slide-progress" (the furthest
   slide reached), both slide INDICES. An index is only right for the deck it was saved in: a slide added, taken away
   or moved before it, and the place opens on another slide. js/cm-slide-places.js moved places through numbered
   layouts (1 to 7), one per deck change; layout 7 was the last. From layout 7 on, every place is also saved by the
   identity of its slide, its KEY, here:
     · a lesson's or activity's slide: its block id and view ("d1m1-role:theory", "d2m1-l1:deck3");
     · one of the day's own slides: its type ("~taskOverview", "~practiceLab", "~readyCheck", "~meetJohnDoe" …), a
       revised deck page its deck and page ("~deckPage:demand:2");
     · a key that comes twice in a day gets "#2", "#3" … on its second, third … slide.
   With each place go the keys of the few slides before it ("slide-keys": {day: {last: {i, k}, far: {i, k}}}, k the
   slide's key then the keys before it, nearest first; i the index they were saved with). When the progress is read
   (start-up, sign-in, the copy restored from the account), a day whose saved index still matches its keys is put back
   on its slide by key in today's deck: a slide added before it or the blocks reordered, it follows its slide; its
   slide gone, it lands on the nearest slide before it that still exists. The furthest slide reached is never below
   the place the trainee is on. A place saved without keys (an older page, another device, or keys that no longer
   match the index) is taken as it is (js/cm-slide-places.js has moved it into layout 7 if it was older) and gets its
   keys. The reload after an update keeps its slide's keys too (lsh_resume_keys).
   A deck change needs nothing here, nor in js/cm-slide-places.js.
   ============================================================ */
(function(){
"use strict";
if(typeof state === "undefined" || typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;
const KEY = "slide-keys", BACK = 5, RESUME = "lsh_resume_after_update", RESUME_KEYS = "lsh_resume_keys";
const FIELD = {"last-slide": "lastSlide", "slide-progress": "slideProgress"}, PART = {lastSlide: "last", slideProgress: "far"};
if(typeof registerPersonalKeys === "function") registerPersonalKeys([KEY]);
const cfDay = d => !!(d && d.cf && Array.isArray(d.lessons));
const viewsOf = b => (window.cmCaseFlow && typeof window.cmCaseFlow.viewsOf === "function" ? window.cmCaseFlow.viewsOf(b) : []) || [];

/* a slide's identity in its day */
function keyOf(d, sl){
  if(!sl) return "";
  if(sl.type === "topic"){
    const l = d.lessons[sl.lessonIndex], b = l && l.cf && l.cf.block;
    return b ? b.id + ":" + (viewsOf(b)[sl.part - 1] || "part" + sl.part) : "topic:" + sl.lessonIndex + ":" + sl.part;
  }
  if(sl.type === "deckPage") return "~deckPage:" + sl.deck + ":" + sl.page;
  return "~" + sl.type;
}
/* today's deck of a day, slide by slide, by key (unique in the day) */
function keysOf(d){
  const n = {};
  return buildDaySlides(d).map(sl => { const k = keyOf(d, sl); n[k] = (n[k] || 0) + 1; return n[k] > 1 ? k + "#" + n[k] : k; });
}
/* the keys saved with a place: its slide's, then the slides' before it, nearest first */
const trail = (keys, i) => keys.slice(Math.max(0, i - BACK), i + 1).reverse();
/* where a saved trail is in today's deck: its slide, or the nearest slide before it that still exists; -1 if none */
function resolve(keys, k){
  for(const x of k || []){ const i = keys.indexOf(x); if(i >= 0) return i; }
  return -1;
}
const num = i => typeof i === "number" && i >= 0 && isFinite(i);
const keysValid = r => !!(r && typeof r === "object" && Array.isArray(r.k) && r.k.length && num(r.i));

/* record the keys of every place the page holds whose keys are missing or were saved for another index; true if any changed */
function record(){
  if(!state.slideKeys || typeof state.slideKeys !== "object") state.slideKeys = {};
  let changed = false;
  DAYS.forEach(d => {
    if(!cfDay(d)) return;
    let keys = null, rec = state.slideKeys[d.id];
    Object.keys(PART).forEach(field => {
      const part = PART[field], i = state[field] && state[field][d.id];
      if(!num(i)){ if(rec && rec[part]){ delete rec[part]; changed = true; } return; }
      if(rec && keysValid(rec[part]) && rec[part].i === i) return;
      keys = keys || keysOf(d);
      if(!keys.length) return;
      rec = state.slideKeys[d.id] = rec && typeof rec === "object" ? rec : {};
      rec[part] = {i, k: trail(keys, Math.min(i, keys.length - 1))};
      changed = true;
    });
    if(rec && !Object.keys(rec).length){ delete state.slideKeys[d.id]; changed = true; }
  });
  return changed;
}
/* put every day's places back on their slides by key, in today's deck; which of the two saved objects changed */
function follow(){
  const out = {lastSlide: false, slideProgress: false}, all = state.slideKeys || {};
  DAYS.forEach(d => {
    const rec = all[d.id]; if(!cfDay(d) || !rec || typeof rec !== "object") return;
    let keys = null;
    Object.keys(PART).forEach(field => {
      const r = rec[PART[field]], i = state[field] && state[field][d.id];
      if(!keysValid(r) || r.i !== i) return;   // saved without keys, or since by a page that saved none: taken as it is
      keys = keys || keysOf(d);
      if(keys[i] === r.k[0]) return;   // still on its slide
      const to = resolve(keys, r.k); if(to < 0) return;
      state[field][d.id] = to; r.i = to; r.k = trail(keys, to); out[field] = true;
    });
    // the furthest slide reached is never below the place the trainee is on
    const last = state.lastSlide && state.lastSlide[d.id];
    if(out.lastSlide && num(last) && state.slideProgress && !((state.slideProgress[d.id] || 0) >= last)){ state.slideProgress[d.id] = last; out.slideProgress = true; }
  });
  return out;
}

let ready = false;   // no keys are recorded until the saved ones have been read (they would be written over)
async function settle(){
  ready = false;
  try{
    const saved = await window.storeGet(KEY);
    state.slideKeys = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    state.lastSlide = state.lastSlide && typeof state.lastSlide === "object" ? state.lastSlide : {};
    state.slideProgress = state.slideProgress && typeof state.slideProgress === "object" ? state.slideProgress : {};
    const moved = follow();
    ready = true;
    // (saved through storeSet: js/cm-slide-places.js stamps them as today's layout, and the keys are recorded below)
    for(const field of ["slideProgress", "lastSlide"]) if(moved[field]) await window.storeSet(field === "lastSlide" ? "last-slide" : "slide-progress", state[field]);
    if(record() || moved.lastSlide || moved.slideProgress) await __set(KEY, state.slideKeys);
  }catch(e){ ready = true; console.warn("[slide-keys]", e); }
}

/* every place the page saves gets its keys, saved with it */
const __set = window.storeSet;
if(typeof __set === "function"){
  window.storeSet = function(key, val){
    const r = __set.apply(this, arguments);
    try{ if(ready && FIELD[key] && val && val === state[FIELD[key]] && !state.cloudRestoring && record()) __set(KEY, state.slideKeys); }catch(e){ console.warn("[slide-keys]", e); }
    return r;
  };
}
/* the progress, read (start-up, sign-in, the copy from the account): the places follow their slides */
if(typeof window.loadAll === "function"){
  const __load = window.loadAll;
  window.loadAll = async function(){ ready = false; try{ return await __load.apply(this, arguments); }finally{ await settle(); } };
}
/* another tab's keys, as they arrive */
window.addEventListener("storage", e => {
  if(e.key !== "lsh_" + KEY || e.newValue === null) return;
  try{ const v = JSON.parse(e.newValue); if(v && typeof v === "object") state.slideKeys = v; }catch(err){}
});

/* the reload after an update: the slide it kept goes with its keys, and opens on that slide in the new deck */
if(typeof window.applyUpdate === "function"){
  const __apply = window.applyUpdate;
  window.applyUpdate = function(){
    try{
      const d = state.view === "day" ? DAYS.find(x => x.id === state.dayId) : null;
      if(d && cfDay(d) && num(state.lessonSlide)) sessionStorage.setItem(RESUME_KEYS, JSON.stringify({dayId: d.id, k: trail(keysOf(d), state.lessonSlide)}));
      else sessionStorage.removeItem(RESUME_KEYS);
    }catch(e){}
    return __apply.apply(this, arguments);
  };
}
if(typeof window.restoreAfterUpdate === "function"){
  const __restore = window.restoreAfterUpdate;
  window.restoreAfterUpdate = function(){
    try{
      const kept = JSON.parse(sessionStorage.getItem(RESUME_KEYS) || "null"); sessionStorage.removeItem(RESUME_KEYS);
      const st = JSON.parse(sessionStorage.getItem(RESUME) || "null"), d = st && st.view === "day" ? DAYS.find(x => x.id === st.dayId) : null;
      if(d && cfDay(d) && kept && kept.dayId === d.id && Array.isArray(kept.k)){
        const to = resolve(keysOf(d), kept.k);
        if(to >= 0){ st.lessonSlide = to; sessionStorage.setItem(RESUME, JSON.stringify(st)); }
      }
    }catch(e){ console.warn("[slide-keys]", e); }
    return __restore.apply(this, arguments);
  };
}

settle();   // what was loaded before this file ran (the first loadAll)
window.cmSlideKeys = {keyOf, keysOf, trail, resolve, settle, BACK};   // .github/scripts/slide-places.cjs
})();
