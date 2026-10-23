/* ✏️ Script editor (trainers): the slides aren't edited, the trainer's script for each slide is. In Presenter view,
   ✏️ Edit script under the notes turns them into the editor in place (read aloud, then the question for the room),
   beside the slide the room sees. Saved edits are shared by every trainer (the admin-only shared record scripts:edits)
   and read everywhere a script is: Presenter view and the Speaker Notes PDF. */
(function(){
"use strict";
const KEY = "scripts:edits";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
let edits = {}, loaded = false, loading = false;
const ORIG = {};   // the course's own script, under each edit: "<day>::<lesson title>::p<n>" → {why, talk, walk, ask, scenario}
const slotOf = id => { const m = /^(.*)::(p\d+)$/.exec(id); return m && {key: m[1], p: m[2]}; };
const isAdmin = () => typeof state !== "undefined" && !!state.isAdmin;
function apply(){
  const S = window.SLIDE_SCRIPTS = window.SLIDE_SCRIPTS || {};
  // put back anything edited before (another trainer's newer save), then lay the edits over
  Object.keys(ORIG).forEach(id => { const s = slotOf(id); (S[s.key] = S[s.key] || {})[s.p] = ORIG[id]; if(!edits[id]) delete ORIG[id]; });
  Object.keys(edits).forEach(id => {
    const s = slotOf(id), e = edits[id]; if(!s || !e) return;
    const cur = (S[s.key] = S[s.key] || {})[s.p];
    if(!(id in ORIG)) ORIG[id] = cur;
    S[s.key][s.p] = {why: "", talk: e.say || "", walk: [], ask: e.ask || "", scenario: (cur && cur.scenario) || ""};
  });
}
async function load(){
  if(loaded || loading || !isAdmin() || typeof sharedGet !== "function") return;
  loading = true;
  try{ const v = await sharedGet(KEY); edits = (v && typeof v === "object") ? v : {}; }catch(e){ edits = {}; }
  loading = false; loaded = true; apply();
  if(Object.keys(edits).length && typeof render === "function") render();
}
// the script as written (with its {name} calls still in it), for the editor
function current(d, l, part){
  const id = `${d.id}::${l.h}::p${part}`;
  if(edits[id]) return {say: edits[id].say || "", ask: edits[id].ask || "", edited: true};
  const h = ((window.SLIDE_SCRIPTS || {})[`${d.id}::${l.h}`] || {})["p" + part];
  if(h) return {say: [h.why, String(h.talk || "").replace(/\s*\n+\s*/g, " "), (h.walk || []).join(" ")].filter(Boolean).join(" "), ask: h.ask || "", edited: false};
  const s = typeof slideScript === "function" ? slideScript(d, l, part) : {};
  return {say: [s.why, String(s.talk || "").replace(/\s*\n+\s*/g, " "), (s.walk || []).join(" ")].filter(Boolean).join(" "), ask: s.ask || "", edited: false};
}
if(typeof window.renderPresenterNote === "function"){
  const __note = window.renderPresenterNote;
  window.renderPresenterNote = function(d, l, part){
    const h = __note.apply(this, arguments);
    if(!isAdmin() || !d || !l || !(typeof state !== "undefined" && state.presenting)) return h;   // edited in Presenter view only
    load();
    const i = (d.lessons || []).indexOf(l); if(i < 0) return h;
    const ed = !!edits[`${d.id}::${l.h}::p${part || 1}`];
    // at the top of the notes, where the trainer looks first (under a long script it scrolled out of sight)
    return `<div class="se-row">${ed ? `<span class="se-tag">✏️ Edited</span>` : ""}<button type="button" class="btn btn-navy btn-sm se-edit" onclick="cmScriptEditor.open(${JSON.stringify(d.id)},${i},${part || 1},this)">✏️ Edit script</button></div>` + h;
  };
}
function close(){
  const o = document.getElementById("se-over"); if(o) o.remove(); document.removeEventListener("keydown", onKey);
  // the in-place editor in Presenter view's notes goes back to the script
  const f = document.getElementById("se-inline"); if(f){ f.remove(); const cu = document.getElementById("pvCues"); if(cu) cu.dataset.slide = ""; if(typeof presenterRefresh === "function") try{ presenterRefresh(); }catch(e){} }
}
function onKey(e){ if(e.key === "Escape") close(); }
// Presenter view: the script is edited in place in the notes, so the slide on the console stays in view
function openInline(d, l, li, part, btn){
  const cur = current(d, l, part), row = btn.closest(".se-row"), note = row && row.nextElementSibling;
  if(!row) return false;
  const f = document.createElement("div");
  f.id = "se-inline"; f.className = "se-form se-inline";
  f.innerHTML = `<label>🎙 Read aloud<textarea id="se-say" rows="10">${E(cur.say)}</textarea></label>
    <label>❓ Ask the room<textarea id="se-ask" rows="3">${E(cur.ask)}</textarea></label>
    <small>Write <code>{name}</code> where you call on a trainee. Saved for every trainer.</small>
    <div class="se-msg" id="se-msg" aria-live="polite"></div>
    <div class="se-btns"><button type="button" class="btn btn-ghost btn-sm" onclick="cmScriptEditor.close()">Cancel</button>
      <button type="button" class="btn btn-navy btn-sm" onclick="cmScriptEditor.save(${JSON.stringify(d.id)},${li},${part})">Save script</button></div>`;
  if(note && note.classList.contains("pn")) note.style.display = "none";
  row.style.display = "none"; row.insertAdjacentElement("afterend", f);
  document.addEventListener("keydown", onKey);
  f.querySelector("#se-say").focus();
  return true;
}
function open(dayId, li, part, btn){
  const d = (typeof DAYS !== "undefined" ? DAYS : []).find(x => String(x.id) === String(dayId)), l = d && d.lessons[li]; if(!l) return;
  close();
  if(btn && btn.closest("#pvCues") && openInline(d, l, li, part, btn)) return;
  const cur = current(d, l, part);
  let slide = "";
  try{ slide = typeof renderDaySlideContent === "function" ? renderDaySlideContent(d, {type: "topic", lessonIndex: li, part}, 0) : ""; }catch(e){ slide = ""; }
  const n = l.cf && window.cmCaseFlow && cmCaseFlow.viewsOf ? cmCaseFlow.viewsOf(l.cf.block).length : (l.singleSlide ? 1 : 2);
  const o = document.createElement("div");
  o.id = "se-over"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Edit the script");
  o.innerHTML = `<div class="se-box">
    <div class="se-head"><b>✏️ Edit script</b><span>${E(l.h)} · slide ${part} of ${n}</span><button type="button" class="se-x" aria-label="Close" onclick="cmScriptEditor.close()">✕</button></div>
    <div class="se-split">
      <div class="se-slide" aria-label="The slide (not editable)"><div class="se-slide-in">${slide || `<p class="se-none">No preview for this slide.</p>`}</div></div>
      <div class="se-form">
        <label>🎙 Read aloud<textarea id="se-say" rows="12">${E(cur.say)}</textarea></label>
        <label>❓ Ask the room<textarea id="se-ask" rows="3">${E(cur.ask)}</textarea></label>
        <small>Write <code>{name}</code> where you call on a trainee: it becomes a first name from the batch you teach. Saved for every trainer.</small>
        <div class="se-msg" id="se-msg" aria-live="polite"></div>
        <div class="se-btns">
          <button type="button" class="btn btn-ghost btn-sm" onclick="cmScriptEditor.close()">Cancel</button>
          <button type="button" class="btn btn-navy btn-sm" onclick="cmScriptEditor.save(${JSON.stringify(d.id)},${li},${part})">Save script</button></div>
      </div>
    </div></div>`;
  o.addEventListener("click", e => { if(e.target === o) close(); });
  document.body.appendChild(o); document.addEventListener("keydown", onKey);
  // the slide stays a picture of the slide: nothing in it is clicked or typed into here
  o.querySelectorAll(".se-slide input, .se-slide textarea, .se-slide select, .se-slide button").forEach(x => { x.disabled = true; x.tabIndex = -1; });
  o.querySelector("#se-say").focus();
}
async function store(dayId, li, part, val){
  const d = DAYS.find(x => String(x.id) === String(dayId)), l = d.lessons[li], id = `${d.id}::${l.h}::p${part}`;
  const msg = document.getElementById("se-msg");
  // the newest shared copy first, so two trainers editing different slides don't undo each other
  let all = edits; try{ const v = await sharedGet(KEY); if(v && typeof v === "object") all = v; }catch(e){}
  all = Object.assign({}, all);
  if(val) all[id] = val; else delete all[id];
  const ok = await sharedSet(KEY, all);
  if(!ok){ if(msg){ msg.className = "se-msg bad"; msg.textContent = "Not saved: check your connection and try again."; } return; }
  edits = all; apply(); close();
  if(typeof toast === "function") toast("Script saved for every trainer.");
  // Presenter view keeps its notes until the slide changes: redraw them now
  const cu = document.getElementById("pvCues"); if(cu) cu.dataset.slide = "";
  if(typeof render === "function") render();
  if(typeof presenterRefresh === "function") try{ presenterRefresh(); }catch(e){}
}
function save(dayId, li, part){
  const say = document.getElementById("se-say").value.trim(), ask = document.getElementById("se-ask").value.trim();
  if(!say){ const m = document.getElementById("se-msg"); m.className = "se-msg bad"; m.textContent = "The script can't be empty."; return; }
  return store(dayId, li, part, {say, ask, by: (typeof state !== "undefined" && state.adminName) || "", at: new Date().toISOString()});
}
const css = document.createElement("style");
css.textContent = `.se-row{display:flex;justify-content:flex-end;align-items:center;gap:8px;margin:2px 0 8px;}
.se-tag{font:700 11px 'Inter',sans-serif;color:#B5651F;background:#FFF3E3;border-radius:999px;padding:2px 8px;}
#se-over{position:fixed;inset:0;z-index:2147483000;background:rgba(20,24,40,.55);display:flex;align-items:center;justify-content:center;padding:18px;}
.se-box{background:#fff;border-radius:14px;width:min(1400px,100%);height:min(860px,100%);display:flex;flex-direction:column;box-shadow:0 20px 50px rgba(0,0,0,.3);overflow:hidden;}
.se-head{display:flex;align-items:center;gap:12px;padding:12px 16px;border-bottom:1px solid #E2E6EF;font:600 14px 'Inter',sans-serif;color:#262B45;}
.se-head span{color:#5B6579;font-weight:500;flex:1;} .se-x{border:0;background:none;font-size:18px;cursor:pointer;color:#5B6579;}
.se-split{flex:1;display:grid;grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);min-height:0;}
.se-slide{overflow:auto;background:#F2F4F8;border-right:1px solid #E2E6EF;padding:14px;}
.se-slide-in{pointer-events:none;user-select:none;zoom:.8;} .se-none{color:#5B6579;}
.se-form{display:flex;flex-direction:column;gap:10px;padding:16px;overflow:auto;}
.se-form label{display:flex;flex-direction:column;gap:6px;font:700 13px 'Inter',sans-serif;color:#262B45;}
.se-form textarea{font:500 14.5px/1.55 'Inter',sans-serif;border:1px solid #CBD2E0;border-radius:10px;padding:10px 12px;resize:vertical;}
.se-form small{color:#5B6579;font-size:12px;} .se-msg.bad{color:#B42318;font-weight:600;font-size:13px;}
.se-btns{display:flex;justify-content:flex-end;gap:8px;margin-top:auto;}
.se-inline{padding:4px 0 8px;} .se-inline textarea{font-size:15px;}
@media(max-width:900px){.se-split{grid-template-columns:1fr;grid-template-rows:45% 55%;}.se-slide{border-right:0;border-bottom:1px solid #E2E6EF;}}`;
document.head.appendChild(css);
window.cmScriptEditor = {open, close, save, load, edits: () => edits};
})();
