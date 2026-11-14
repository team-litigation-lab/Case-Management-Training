/* ============================================================
   A saved place is saved by slide key, so a deck change needs no migration.
   A trainee's place in a day is a slide position: "last-slide" (where they were) and "slide-progress" (the furthest
   slide reached), both slide INDICES. An index is only right for the deck it was saved in: a slide added, taken away
   or moved before it, and the place opens on another slide. js/cm-slide-places.js moved places through numbered
   layouts (1 to 8), one per deck change; layout 8 was the last. From layout 8 on, every place is also saved by the
   identity of its slide, its KEY, here:
     · a lesson's or activity's slide: its block id and view ("d1m1-role:theory", "d2m1-l1:deck3");
     · one of the day's own slides: its type ("~taskOverview", "~practiceLab", "~readyCheck", "~meetJohnDoe" …), a
       revised deck page its deck and page ("~deckPage:demand:2");
     · a key that comes twice in a day gets "#2", "#3" … on its second, third … slide.
   With each place go the keys of the few slides before it ("slide-keys": {day: {last: {i, k}, far: {i, k}}}, k the
   slide's key then the keys before it, nearest first; i the index they were saved with). When the progress is read
   (start-up, sign-in, the copy restored from the account), a day whose saved index still matches its keys is put back
   on its slide by key in today's deck: a slide added before it or the blocks reordered, it follows its slide; its
   slide gone, it lands on the nearest slide before it that still exists (every slide it was saved with gone: the same
   index, never past the end, with keys afresh). The furthest slide reached is never below
   the place the trainee is on. A place saved without keys (an older page, another device, or keys that no longer
   match the index) was saved in layout 8's deck (js/cm-slide-places.js has moved it there if it was older): it is put
   on the same slide of today's deck by the key that position has in layout 8's frozen record (layout 7's,
   js/cm-slide-keys7.js, without the lesson cards that left in layout 8: cmSlidePlaces.keys8; from8: its slide gone,
   the nearest slide before it that is still there), and gets its keys. The reload after an update keeps its slide's
   keys too (lsh_resume_keys); one kept by a page that saved none is taken from layout 8 the same way.
   A deck change needs nothing here, nor in js/cm-slide-places.js. One that moves slides a place saved before it should
   not land on (js/cm-day-loop.js) gives its own rule in window.CM_SLIDE_KEY_RULES ({id, place(d, r, to, keys)}: r the
   saved keys or null, to where they land; it returns the index to use); the keys saved carry the ids of the rules in
   force (m), so a rule tells a place saved since it (its id in r.m) from one saved before (no keys, or not its id).
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
/* the keys saved with a place: its slide's, then the slides' before it, nearest first; and, when its block began
   further back than that, the slide before the block too (a later deck that drops the whole block, or the run of
   slides the place was in, still finds where the block was) */
const blockOf = k => String(k).replace(/#\d+$/, "").replace(/:[^:]*$/, "");
function trail(keys, i){
  const t = keys.slice(Math.max(0, i - BACK), i + 1).reverse(), b = blockOf(keys[i]);
  let j = i; while(j > 0 && blockOf(keys[j - 1]) === b) j--;
  if(j - 1 >= 0 && j - 1 < i - BACK) t.push(keys[j - 1]);
  return t;
}
/* where a saved trail is in today's deck: its slide, or the nearest slide before it that still exists; -1 if none
   (the caller then keeps the place's index, put on the deck's last slide if it is past the end: see near) */
function resolve(keys, k){
  for(const x of k || []){ const i = keys.indexOf(x); if(i >= 0) return i; }
  return -1;
}
const num = i => typeof i === "number" && i >= 0 && isFinite(i);
/* a trail none of whose keys is in today's deck: the same index, never past the end */
const near = (keys, i) => Math.max(0, Math.min(i, keys.length - 1));
const keysValid = r => !!(r && typeof r === "object" && Array.isArray(r.k) && r.k.length && num(r.i));
/* a deck change's own rule for places saved before it (see the top): read when used, whatever file loads first */
const rules = () => Array.isArray(window.CM_SLIDE_KEY_RULES) ? window.CM_SLIDE_KEY_RULES.filter(x => x && x.id && typeof x.place === "function") : [];
const marks = () => rules().map(x => x.id);
function ruled(d, r, to, keys){
  for(const x of rules()){ try{ const t = x.place(d, r || null, to, keys); if(num(t) && t < keys.length) to = t; }catch(e){ console.warn("[slide-keys]", e); } }
  return to;
}
/* a position in layout 8's deck (a place saved without keys), in today's deck: its slide by the key layout 8's frozen
   record gives it, or the nearest slide before it that is still there (every slide before it is tried, nearest first) */
function from8(d, i, keys){
  const P = window.cmSlidePlaces, k8 = P && typeof P.keys8 === "function" ? P.keys8(d) : null;
  if(!num(i) || !Array.isArray(k8) || !k8.length) return i;
  keys = keys || keysOf(d);
  const to = resolve(keys, k8.slice(0, Math.min(i, k8.length - 1) + 1).reverse());
  return ruled(d, null, to >= 0 ? to : 0, keys);   // (saved before keys: before every rule)
}

/* record the keys of every place the page holds whose keys are missing or were saved for another index (skip(day id,
   field) true: not that one); true if any changed */
function record(skip){
  if(!state.slideKeys || typeof state.slideKeys !== "object") state.slideKeys = {};
  let changed = false;
  DAYS.forEach(d => {
    if(!cfDay(d)) return;
    let keys = null, rec = state.slideKeys[d.id];
    Object.keys(PART).forEach(field => {
      const part = PART[field], i = state[field] && state[field][d.id];
      if(!num(i)){ if(rec && rec[part]){ delete rec[part]; changed = true; } return; }
      if(rec && keysValid(rec[part]) && rec[part].i === i) return;
      if(skip && skip(d.id, field)) return;
      keys = keys || keysOf(d);
      if(!keys.length) return;
      rec = state.slideKeys[d.id] = rec && typeof rec === "object" ? rec : {};
      rec[part] = {i, k: trail(keys, Math.min(i, keys.length - 1)), m: marks()};
      changed = true;
    });
    if(rec && !Object.keys(rec).length){ delete state.slideKeys[d.id]; changed = true; }
  });
  return changed;
}
/* put every day's places back on their slides by key, in today's deck; which of the two saved objects changed (keys:
   some saved keys were written afresh) */
function follow(){
  const out = {lastSlide: false, slideProgress: false, keys: false}, all = state.slideKeys || {};
  DAYS.forEach(d => {
    if(!cfDay(d)) return;
    const rec = all[d.id] && typeof all[d.id] === "object" ? all[d.id] : null;
    let keys = null;
    Object.keys(PART).forEach(field => {
      const r = rec && rec[PART[field]], i = state[field] && state[field][d.id];
      if(!num(i)) return;
      keys = keys || keysOf(d);
      if(!keys.length) return;
      let to;
      if(keysValid(r) && r.i === i){
        to = keys[i] === r.k[0] ? i : resolve(keys, r.k);
        if(to < 0) to = near(keys, i);   // every slide of its trail gone: the same index (never past the end), with keys afresh
        to = ruled(d, r, to, keys);
        if(to === i && keys[i] === r.k[0]) return;   // still on its slide
        r.i = to; r.k = trail(keys, to); r.m = marks(); out.keys = true;
        if(to === i) return;
      } else {
        // saved without keys, or since by a page that saved none: a position in layout 8's deck (see from8)
        to = from8(d, i, keys); if(to === i) return;
        if(rec) delete rec[PART[field]];   // its old keys (another index) are not this place's: record() writes them afresh
      }
      state[field][d.id] = to; out[field] = true;
    });
    // the furthest slide reached is never below the place the trainee is on (whichever of the two moved, or neither)
    const last = state.lastSlide && state.lastSlide[d.id], far = state.slideProgress && state.slideProgress[d.id];
    if(num(last) && state.slideProgress && !(num(far) && far >= last)){ state.slideProgress[d.id] = last; out.slideProgress = true; }
  });
  return out;
}

let ready = false;   // no keys are recorded until the saved ones have been read (they would be written over)
let loading = false;   // a loadAll is reading the progress: what it saves is the saved progress, not a place the page made
/* places the page saved while the keys were being read: today's deck, recorded as soon as the saved keys are in */
const pending = new Map();   // "day id|field" -> the index saved
/* places another tab wrote (index.html's storage listener put them in state): whatever deck that tab ran, they are
   followed (settle), never given today's keys as they stand */
const foreign = new Set();   // "day id|field"
const id = (dayId, field) => dayId + "|" + field;
/* one at a time: two reads of the progress at once (sign-in and a restore from the account) would each take the
   other's moved place for one saved without keys, and move it twice */
let queue = Promise.resolve();
function settle(){ const run = queue.then(settleNow, settleNow); queue = run.catch(() => {}); return run; }
async function settleNow(){
  ready = false;
  try{
    const saved = await window.storeGet(KEY);
    state.slideKeys = saved && typeof saved === "object" && !Array.isArray(saved) ? saved : {};
    state.lastSlide = state.lastSlide && typeof state.lastSlide === "object" ? state.lastSlide : {};
    state.slideProgress = state.slideProgress && typeof state.slideProgress === "object" ? state.slideProgress : {};
    // a place the page saved meanwhile is on today's deck: its keys first, so follow() leaves it where it is
    const mine = new Set();
    pending.forEach((i, x) => { const [dayId, field] = x.split("|"); if(state[field][dayId] === i && !foreign.has(x)) mine.add(x); });
    pending.clear();
    if(mine.size) record((dayId, field) => !mine.has(id(dayId, field)));
    foreign.clear();
    const moved = follow();
    ready = true;
    // (saved through storeSet: js/cm-slide-places.js stamps them as today's layout, and the keys are recorded below)
    for(const field of ["slideProgress", "lastSlide"]) if(moved[field]) await window.storeSet(field === "lastSlide" ? "last-slide" : "slide-progress", state[field]);
    if(record() || moved.lastSlide || moved.slideProgress || moved.keys || mine.size) await __set(KEY, state.slideKeys);
  }catch(e){ ready = true; console.warn("[slide-keys]", e); }
}

/* every place the page saves gets its keys, saved with it */
const __set = window.storeSet;
if(typeof __set === "function"){
  window.storeSet = function(key, val){
    const r = __set.apply(this, arguments);
    try{
      const field = FIELD[key];
      if(field && val && val === state[field] && !state.cloudRestoring){
        if(ready){ if(record((dayId, f) => foreign.has(id(dayId, f)))) __set(KEY, state.slideKeys); }
        else if(!loading && state.view === "day" && state.dayId != null && num(val[state.dayId])) pending.set(id(state.dayId, field), val[state.dayId]);   // recorded after settle
      }
    }catch(e){ console.warn("[slide-keys]", e); }
    return r;
  };
}
/* the progress, read (start-up, sign-in, the copy from the account): the places follow their slides */
if(typeof window.loadAll === "function"){
  const __load = window.loadAll;
  window.loadAll = async function(){ ready = false; loading = true; try{ return await __load.apply(this, arguments); }finally{ loading = false; await settle(); } };
}
/* another tab's keys, as they arrive; and its places (index.html's listener has put them in state, js/cm-slide-places.js's
   has moved an older layout's into layout 8's deck): followed by key, or from layout 8 if that tab saved no keys */
window.addEventListener("storage", e => {
  if(!e.key || e.newValue === null) return;
  if(e.key === "lsh_" + KEY){
    try{ const v = JSON.parse(e.newValue); if(v && typeof v === "object") state.slideKeys = v; }catch(err){}
    return;
  }
  const field = FIELD[e.key.slice(4)];
  if(e.key.indexOf("lsh_") !== 0 || !field || !state[field] || typeof state[field] !== "object") return;
  const all = state.slideKeys || {};
  DAYS.forEach(d => {
    if(!cfDay(d) || !num(state[field][d.id])) return;
    const r = all[d.id] && all[d.id][PART[field]];
    if(!(keysValid(r) && r.i === state[field][d.id])) foreign.add(id(d.id, field));
  });
  settle();
});

/* the reload after an update: the slide it kept goes with its keys, and opens on that slide in the new deck */
if(typeof window.applyUpdate === "function"){
  const __apply = window.applyUpdate;
  window.applyUpdate = function(){
    try{
      const d = state.view === "day" ? DAYS.find(x => x.id === state.dayId) : null;
      if(d && cfDay(d) && num(state.lessonSlide)) sessionStorage.setItem(RESUME_KEYS, JSON.stringify({dayId: d.id, k: trail(keysOf(d), state.lessonSlide), m: marks()}));
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
        const keys = keysOf(d);
        let to = resolve(keys, kept.k);
        if(to < 0 && num(st.lessonSlide) && keys.length) to = near(keys, st.lessonSlide);   // every slide of its trail gone
        if(to >= 0) to = ruled(d, kept, to, keys);
        if(to >= 0){ st.lessonSlide = to; sessionStorage.setItem(RESUME, JSON.stringify(st)); }
      } else if(d && cfDay(d) && num(st.lessonSlide) && Number(sessionStorage.getItem("lsh_resume_layout")) >= 8){
        // kept by a page running layout 8's deck that saved no keys: from layout 8, by key (an older layout's slide is
        // moved by js/cm-slide-places.js, which runs after this and takes it on through from8 itself)
        st.lessonSlide = from8(d, st.lessonSlide); sessionStorage.setItem(RESUME, JSON.stringify(st));
      }
    }catch(e){ console.warn("[slide-keys]", e); }
    return __restore.apply(this, arguments);
  };
}

settle();   // what was loaded before this file ran (the first loadAll)
window.cmSlideKeys = {keyOf, keysOf, trail, resolve, from8, settle, BACK, ruled};   // .github/scripts/slide-places.cjs
})();
