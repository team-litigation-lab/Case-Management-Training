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
  const o = document.getElementById("se-over"); if(o) o.remove();
  const f = document.getElementById("se-inline"); if(!f) return paintNav();
  f.remove(); paintNav();
  const cu = document.getElementById("pvCues"); if(cu){ [...cu.children].forEach(x => { x.style.display = ""; }); cu.dataset.slide = ""; }
  if(typeof presenterRefresh === "function") try{ presenterRefresh(); }catch(e){}
}
// the notes become the editor, in place: the slide on the console stays in view
function open(){
  const slot = here(), cu = document.getElementById("pvCues"); if(!slot || document.getElementById("se-inline")) return;
  if(!cu) return openSplit(slot);
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
const formHtml = cur => `<label>🎙 Read aloud<textarea id="se-say" rows="12">${E(cur.say)}</textarea></label>
    <label>❓ Ask the room<textarea id="se-ask" rows="3">${E(cur.ask)}</textarea></label>
    <small>Write <code>{name}</code> where you call on a trainee: it becomes a first name from the batch you teach. Saved for every trainer.</small>
    <div class="se-msg" id="se-msg" aria-live="polite"></div>
    <div class="se-btns"><button type="button" class="btn btn-ghost btn-sm" onclick="cmScriptEditor.close()">Cancel</button>
      <button type="button" class="btn btn-navy btn-sm" onclick="cmScriptEditor.save()">Save speaker notes</button></div>`;
// outside Presenter view: a split screen, the slide on the left (as the room sees it, not editable), the notes on the right
function openSplit(slot){
  const d = slot.d, slides = buildDaySlides(d), idx = state.lessonSlide || 0;
  let slide = ""; try{ slide = renderDaySlideContent(d, slides[idx], idx); }catch(e){}
  const o = document.createElement("div");
  o.id = "se-over"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Edit Speaker Notes");
  o.innerHTML = `<div class="se-box"><div class="se-head"><b>✏️ Edit Speaker Notes</b><span>Step ${idx + 1} of ${slides.length} · ${E(typeof daySlideTitle === "function" ? daySlideTitle(d, slides[idx]) : "")}</span>
      <button type="button" class="se-x" aria-label="Close" onclick="cmScriptEditor.close()">✕</button></div>
    <div class="se-split"><div class="se-slide"><div class="se-slide-in">${slide}</div></div>
      <div class="se-form" id="se-inline" data-slot="${E(slot.id)}">${formHtml(current(slot))}</div></div></div>`;
  o.addEventListener("click", e => { if(e.target === o) close(); });
  document.body.appendChild(o); document.addEventListener("keydown", onKey);
  o.querySelectorAll(".se-slide input, .se-slide textarea, .se-slide select, .se-slide button").forEach(x => { x.disabled = true; x.tabIndex = -1; });
  o.querySelector("#se-say").focus();
}
// the site's top bar: ✏️ Edit Speaker Notes and the status of the slide on screen, for trainers on a day's slides
function paintNav(){
  const nav = document.querySelector(".topbar .nav"); if(!nav) return;
  let b = nav.querySelector(".nav-sn");
  const on = isAdmin() && !state.adminPreview && state.view === "day" && state.dayViewMode === "slides";
  if(!on){ if(b) b.remove(); return; }
  load();
  const slot = here(), status = !slot ? "no script" : edits[slot.id] ? "edited" : "original";
  if(!b){ b = document.createElement("button"); b.type = "button"; b.className = "nav-sn"; b.onclick = () => open(); nav.insertBefore(b, nav.firstChild); }
  // beside 📚 Guides: js/lsh-topbar.js gathers that menu just after the page draws, so the button follows it then too
  const place = () => { const g = document.querySelector('.topbar .lsh-grp[data-grp="guides"]'); if(g && b.isConnected && g.nextElementSibling !== b) g.insertAdjacentElement("afterend", b); };
  place(); setTimeout(place, 0); setTimeout(place, 120);
  b.disabled = !slot;
  b.title = slot ? "Edit this slide's speaker notes: saved for every trainer" : "This slide has no speaker notes to edit";
  b.innerHTML = `✏️ Edit Speaker Notes <span class="nav-sn-st${status === "edited" ? " on" : ""}">${status === "no script" ? "No script on this slide" : status === "edited" ? "Edited" : "Original"}</span>`;
}
if(!/[?&]audience=/.test(location.search) && typeof window.render === "function"){
  const __render = window.render;
  window.render = function(){ const r = __render.apply(this, arguments); try{ paintNav(); }catch(e){} return r; };
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
.se-inline{padding:4px 0 8px;}
.topbar .nav .nav-sn{background:#F0C08A;color:#1F2433;font-weight:800;border-radius:10px;}
.topbar .nav .nav-sn:disabled{opacity:.55;cursor:default;} .nav-sn-st{font-size:11px;font-weight:700;margin-left:4px;padding:1px 7px;border-radius:999px;background:rgba(255,255,255,.55);}
.nav-sn-st.on{background:#262B45;color:#F0C08A;}
#se-over{position:fixed;inset:0;z-index:2147483000;background:rgba(20,24,40,.55);display:flex;align-items:center;justify-content:center;padding:18px;}
.se-box{background:#fff;border-radius:14px;width:min(1400px,100%);height:min(860px,100%);display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,.3);overflow:hidden;}
.se-head{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #E2E6EF;font:600 14px 'Inter',sans-serif;color:#262B45;}
.se-head span{color:#5B6579;font-weight:500;flex:1;} .se-x{border:0;background:none;font-size:18px;cursor:pointer;color:#5B6579;}
.se-split{flex:1;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);min-height:0;}
.se-slide{overflow:auto;background:#F2F4F8;border-right:1px solid #E2E6EF;padding:14px;}
.se-slide-in{pointer-events:none;user-select:none;zoom:.8;}
#se-over .se-form{padding:16px;overflow:auto;}
@media(max-width:900px){.se-split{grid-template-columns:1fr;grid-template-rows:45% 55%;}}`;
document.head.appendChild(css);
window.cmScriptEditor = {open, close, save, load, edits: () => edits};
})();
