/* ✏️ Edit Speaker Notes (trainers): the slides aren't edited, the trainer's script for each slide is. In Presenter view
   the top bar carries ✏️ Edit Speaker Notes for the slide on screen, with its status (Original, Edited, or no script on
   this slide); it turns the notes into the editor in place (read aloud, then the question for the room), beside the
   slide the room sees. A lesson slide's script and the day's own scripts (the Training Agenda, the Practice Lab) can be
   edited. Saved edits are shared by every trainer (the admin-only shared record scripts:edits) and read everywhere a
   script is: Presenter view and the Speaker Notes PDF. */
(function(){
"use strict";
const KEY = "scripts:edits";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
let edits = {}, loaded = false, loading = false;
// the course's own script under each edit, for laying a newer save over it:
// a lesson slide "<day>::<lesson title>::p<n>" → its SLIDE_SCRIPTS part; a day script "<day>::_<agenda|lab>" → {say, ask}
const ORIG = {};
const DAY_KEYS = {taskOverview: "agenda", practiceLab: "lab"};
const isAdmin = () => typeof state !== "undefined" && !!state.isAdmin;
const dayOf = id => (typeof DAYS !== "undefined" ? DAYS : []).find(x => String(x.id) === String(id));
const dayScripts = d => { const all = (window.CM_CF_SCRIPTS = window.CM_CF_SCRIPTS || {}); all._days = all._days || {}; return (all._days[d.cf.n] = all._days[d.cf.n] || {}); };
function slotOf(id){   // where an edit lives in the course's scripts
  let m = /^(.*)::_(agenda|lab)$/.exec(id);
  if(m){ const d = dayOf(m[1]); return d && d.cf ? {get: () => dayScripts(d)[m[2]], set: v => { dayScripts(d)[m[2]] = v; }, day: true} : null; }
  m = /^(.*)::(p\d+)$/.exec(id); if(!m) return null;
  const S = window.SLIDE_SCRIPTS = window.SLIDE_SCRIPTS || {};
  return {get: () => (S[m[1]] || {})[m[2]], set: v => { (S[m[1]] = S[m[1]] || {})[m[2]] = v; }, day: false};
}
function apply(){
  // put back anything edited before (another trainer's newer save), then lay the edits over
  Object.keys(ORIG).forEach(id => { const s = slotOf(id); if(s) s.set(ORIG[id]); if(!edits[id]) delete ORIG[id]; });
  Object.keys(edits).forEach(id => {
    const s = slotOf(id), e = edits[id]; if(!s || !e) return;
    const cur = s.get();
    if(!(id in ORIG)) ORIG[id] = cur;
    s.set(s.day ? Object.assign({}, cur, {say: e.say || "", ask: e.ask || ""})
      : {why: "", talk: e.say || "", walk: [], ask: e.ask || "", scenario: (cur && cur.scenario) || ""});
  });
}
async function load(){
  if(loaded || loading || !isAdmin() || typeof sharedGet !== "function") return;
  loading = true;
  try{ const v = await sharedGet(KEY); edits = (v && typeof v === "object") ? v : {}; }catch(e){ edits = {}; }
  loading = false; loaded = true; apply();
  const cu = document.getElementById("pvCues"); if(cu) cu.dataset.slide = "";
  if(typeof presenterRefresh === "function") try{ presenterRefresh(); }catch(e){}
}
// the script behind the slide on screen: a lesson slide's part, or the day's agenda / lab script; null when it has none
function slotFor(d, slide){
  if(!d || !slide) return null;
  if(slide.type === "topic"){ const l = d.lessons[slide.lessonIndex]; return l ? {id: `${d.id}::${l.h}::p${slide.part || 1}`, d, l, part: slide.part || 1} : null; }
  const k = DAY_KEYS[slide.type];
  return k && d.cf && dayScripts(d)[k] ? {id: `${d.id}::_${k}`, d, k} : null;
}
const flat = x => [x.why, String(x.talk || "").replace(/\s*\n+\s*/g, " "), (x.walk || []).join(" ")].filter(Boolean).join(" ");
// the script as written (with its {name} calls still in it), for the editor
function current(slot){
  if(edits[slot.id]) return {say: edits[slot.id].say || "", ask: edits[slot.id].ask || ""};
  if(slot.k){ const x = dayScripts(slot.d)[slot.k] || {}; return {say: x.say || "", ask: x.ask || ""}; }
  const h = ((window.SLIDE_SCRIPTS || {})[`${slot.d.id}::${slot.l.h}`] || {})["p" + slot.part];
  const x = h || (typeof slideScript === "function" ? slideScript(slot.d, slot.l, slot.part) : {}) || {};
  return {say: flat(x), ask: x.ask || ""};
}
function here(){
  const d = typeof DAYS !== "undefined" && DAYS.find(x => x.id === state.dayId); if(!d) return null;
  const slides = typeof buildDaySlides === "function" ? buildDaySlides(d) : [];
  return slotFor(d, slides[state.lessonSlide || 0]);
}
// the top bar's button and status, for the slide on screen
function paintBar(){
  if(!isAdmin() || !state.presenting) return;
  const bar = document.querySelector(".pv-actions"); if(!bar) return;
  load();
  let b = document.getElementById("seBar");
  if(!b){ b = document.createElement("span"); b.id = "seBar"; b.className = "se-bar"; bar.insertBefore(b, bar.firstChild); }
  const slot = here(), editing = !!document.getElementById("se-inline");
  const status = !slot ? "No script on this slide" : edits[slot.id] ? "✏️ Edited" : "Original";
  const key = (slot ? slot.id : "-") + "|" + status + "|" + editing;
  if(b.dataset.key === key) return;
  b.dataset.key = key;
  b.innerHTML = `<button type="button" class="btn btn-navy btn-sm" ${slot && !editing ? "" : "disabled"} onclick="cmScriptEditor.open()" title="${slot ? "Edit this slide's speaker notes: saved for every trainer" : "This slide has no speaker notes to edit"}">✏️ Edit Speaker Notes</button><span class="se-status${slot && edits[slot.id] ? " on" : ""}">${status}</span>`;
}
if(typeof window.presenterRefresh === "function"){
  const __refresh = window.presenterRefresh;
  window.presenterRefresh = function(){
    // the notes stay the editor while it is open: a refresh mid-edit would wipe what the trainer is typing
    if(document.getElementById("se-inline")){ paintBar(); return; }
    const r = __refresh.apply(this, arguments); paintBar(); return r;
  };
}
function onKey(e){ if(e.key === "Escape") close(); }
function close(){
  document.removeEventListener("keydown", onKey);
  const f = document.getElementById("se-inline"); if(!f) return;
  f.remove();
  const cu = document.getElementById("pvCues"); if(cu){ [...cu.children].forEach(x => { x.style.display = ""; }); cu.dataset.slide = ""; }
  if(typeof presenterRefresh === "function") try{ presenterRefresh(); }catch(e){}
}
// the notes become the editor, in place: the slide on the console stays in view
function open(){
  const slot = here(), cu = document.getElementById("pvCues"); if(!slot || !cu || document.getElementById("se-inline")) return;
  const cur = current(slot);
  const f = document.createElement("div");
  f.id = "se-inline"; f.className = "se-form se-inline"; f.dataset.slot = slot.id;
  f.innerHTML = `<label>🎙 Read aloud<textarea id="se-say" rows="12">${E(cur.say)}</textarea></label>
    <label>❓ Ask the room<textarea id="se-ask" rows="3">${E(cur.ask)}</textarea></label>
    <small>Write <code>{name}</code> where you call on a trainee: it becomes a first name from the batch you teach. Saved for every trainer.</small>
    <div class="se-msg" id="se-msg" aria-live="polite"></div>
    <div class="se-btns"><button type="button" class="btn btn-ghost btn-sm" onclick="cmScriptEditor.close()">Cancel</button>
      <button type="button" class="btn btn-navy btn-sm" onclick="cmScriptEditor.save()">Save speaker notes</button></div>`;
  [...cu.children].forEach(x => { x.style.display = "none"; });
  cu.insertBefore(f, cu.firstChild); cu.parentElement.scrollTop = 0;
  // bring the editor into view: on a small screen the notes sit below the slide, or behind the slides window
  f.scrollIntoView({behavior: "smooth", block: "start"});
  document.addEventListener("keydown", onKey);
  paintBar();
  f.querySelector("#se-say").focus();
}
async function save(){
  const f = document.getElementById("se-inline"); if(!f) return;
  const id = f.dataset.slot, msg = document.getElementById("se-msg");
  const say = document.getElementById("se-say").value.trim(), ask = document.getElementById("se-ask").value.trim();
  if(!say){ msg.className = "se-msg bad"; msg.textContent = "The speaker notes can't be empty."; return; }
  // the newest shared copy first, so two trainers editing different slides don't undo each other
  let all = edits; try{ const v = await sharedGet(KEY); if(v && typeof v === "object") all = v; }catch(e){}
  all = Object.assign({}, all, {[id]: {say, ask, by: state.adminName || "", at: new Date().toISOString()}});
  if(!(await sharedSet(KEY, all))){ msg.className = "se-msg bad"; msg.textContent = "Not saved: check your connection and try again."; return; }
  edits = all; apply(); close();
  if(typeof toast === "function") toast("Speaker notes saved for every trainer.");
}
const css = document.createElement("style");
css.textContent = `.se-bar{display:inline-flex;align-items:center;gap:8px;margin-right:4px;}
.se-status{font:700 11.5px 'Inter',sans-serif;color:#C9D0E0;} .se-status.on{color:#FFC98F;}
.se-form{display:flex;flex-direction:column;gap:10px;}
.se-form label{display:flex;flex-direction:column;gap:6px;font:700 13px 'Inter',sans-serif;color:#262B45;}
.se-form textarea{font:500 15px/1.55 'Inter',sans-serif;border:1px solid #CBD2E0;border-radius:10px;padding:10px 12px;resize:vertical;}
.se-form small{color:#5B6579;font-size:12px;} .se-msg.bad{color:#B42318;font-weight:600;font-size:13px;}
.se-btns{display:flex;justify-content:flex-end;gap:8px;}
.se-inline{padding:4px 0 8px;}`;
document.head.appendChild(css);
window.cmScriptEditor = {open, close, save, load, edits: () => edits};
})();
