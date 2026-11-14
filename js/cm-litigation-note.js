/* ============================================================
   ⚖️ The Litigation note: who the Case Manager is can change when a file goes to suit
   The owner's note, word for word (NOTE below), shown:
   · prominently at the start of the Litigation section: the first slide of its first lesson (d4m1-l1, Case Flow Day 5);
   · as a callout on the first slide of every litigation transition or file-handoff step (HANDOFF: the lesson From
     Pre-Lit to Litigation, and the Skill Activities that take the fork, move the file to Litigation status and task the
     Litigation Desk with the e-filing), and as a pop-up there the first time a trainee reaches each one ("Got it" puts
     it away for good; the callout on the slide stays). A trainer, Presenter view and the room's screen get no pop-up:
     the callout is on the slide, and Presenter view's notes say to read it aloud.
   The pop-up's "seen" marks are the trainee's progress ("litigation-note-seen", registered below, so they follow the
   trainee to another device). Nothing here changes a slide's content; the callout is added to the slide as drawn.
   ============================================================ */
(function(){
"use strict";
if(typeof state === "undefined" || typeof DAYS === "undefined" || !window.cmCaseFlow) return;
const NOTE = "Note: Case Managers handling Litigation and Pre-Litigation are sometimes different individuals. Always verify the assigned Case Manager in the CMS/Case Profile before transferring files, logging updates, or routing communications.";
const START = "d4m1-l1";
const HANDOFF = {"d4m1-l2": "From Pre-Lit to Litigation", "d4m1-a1": "Taking the litigation fork", "d4m1-a2": "Moving the file to Litigation status", "d4m1-efile": "Handing the filing to the Litigation Desk"};
const KEY = "litigation-note-seen";
if(typeof registerPersonalKeys === "function") registerPersonalKeys([KEY]);
const E = v => (typeof esc === "function" ? esc(v) : String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
const trainer = () => typeof isTrainer === "function" ? isTrainer() : !!state.isAdmin;
const audience = () => document.body.classList.contains("audience-mode");

// the note as HTML: the same words, with Litigation and Pre-Litigation in bold
const noteHtml = () => E(NOTE).replace(/^Note:/, "<b>Note:</b>").replace(/\b(Pre-Litigation|Litigation)\b/g, "<b>$1</b>");
const callout = (id, big) => `<div class="lgn-note${big ? " lgn-start" : ""}" role="note" data-lgn="${E(id)}"><span class="lgn-ic" aria-hidden="true">⚖️</span><p>${noteHtml()}</p></div>`;

/* the block a slide shows, when it is the first slide of the start or of a handoff step */
function blockOf(d, slide){
  if(!d || !d.cf || !slide || slide.type !== "topic" || (slide.part || 1) !== 1) return "";
  const l = d.lessons[slide.lessonIndex], id = l && l.cf && l.cf.block.id;
  return id && (id === START || HANDOFF[id]) ? id : "";
}
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    const html = __content.apply(this, arguments), id = blockOf(d, slide);
    if(!id || typeof html !== "string" || html.indexOf('data-lgn="') >= 0) return html;
    const box = callout(id, id === START), at = html.indexOf('<div class="cfx-body">');
    return at >= 0 ? html.slice(0, at + 22) + box + html.slice(at + 22) : box + html;
  };
}
if(typeof presenterCues === "function"){   // Presenter view: read the note aloud on these slides
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    const html = __cues.apply(this, arguments), id = blockOf(d, slide);
    return id ? `<div class="lgn-pv"><b>⚖️ Read this note aloud${id === START ? ": the Litigation section starts here" : ""}</b><span>${E(NOTE)}</span></div>` + (html || "") : html;
  };
}

/* ---------- the pop-up: once per handoff step, for a trainee ---------- */
let seen = null;
const loadSeen = () => typeof storeGet === "function" ? storeGet(KEY).then(v => { seen = v && typeof v === "object" ? v : {}; }).catch(() => { seen = {}; }) : Promise.resolve(seen = {});
loadSeen();
function popClose(){ const p = document.getElementById("lgnPop"); if(p) p.remove(); }
function pop(id){
  if(document.getElementById("lgnPop")) return;
  const o = document.createElement("div"); o.id = "lgnPop"; o.className = "lgn-pop"; o.setAttribute("role", "alertdialog"); o.setAttribute("aria-label", "Litigation note"); o.dataset.block = id;
  o.innerHTML = `<div class="lgn-pop-h"><b>⚖️ Before you hand off this file</b><span>${E(id === START ? "The Litigation section" : HANDOFF[id] || "Litigation")}</span></div>
    <p>${noteHtml()}</p>
    <div class="lgn-pop-go"><button type="button" class="btn btn-primary btn-sm" data-lgn-ok>Got it</button></div>`;
  o.querySelector("[data-lgn-ok]").addEventListener("click", () => {
    seen = seen || {}; seen[id] = Date.now();
    if(typeof storeSet === "function") storeSet(KEY, seen);
    popClose();
  });
  document.body.appendChild(o);
}
function sync(){
  // the slide on screen (not the trainer's miniature of the next one)
  const box = [...document.querySelectorAll("#lessonSlideWrap .lgn-note[data-lgn]")].find(x => !x.closest(".np-mini")), id = box && box.getAttribute("data-lgn");
  const p = document.getElementById("lgnPop");
  if(p && p.dataset.block !== id) popClose();
  if(!id || id === START || trainer() || state.presenting || audience()) return;   // the start has its callout; the pop-ups are the handoff steps'
  if(seen === null){ loadSeen().then(sync); return; }
  if(!seen[id]) pop(id);
}
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ sync(); }catch(e){} return r; };
}
window.cmLitigationNote = {NOTE, START, HANDOFF: Object.keys(HANDOFF), show: id => pop(id || START), reload: loadSeen};

/* ---------- the look: navy and orange, bold, at least 16px on the slide ---------- */
if(!document.getElementById("lgn-css")){
  const st = document.createElement("style"); st.id = "lgn-css";
  st.textContent = `
.lgn-note{display:flex;gap:10px;align-items:center;margin:0 0 8px;padding:6px 14px;background:#FFF4E8;border:2px solid #DB8437;border-left:8px solid #DB8437;border-radius:10px;text-align:left;}
.lgn-note .lgn-ic{font-size:20px;line-height:1;flex:0 0 auto;}
.lgn-note p{margin:0;font:700 16px/1.32 'Inter',sans-serif;color:#1E2340;}
.lgn-note p b{color:#A4470F;}
.lgn-note.lgn-start{background:#1E2340;border-color:#DB8437;}
.lgn-note.lgn-start p{color:#fff;}
.lgn-note.lgn-start p b{color:#F4B77A;}
.lgn-pop{position:fixed;top:84px;right:18px;z-index:80;width:min(420px,calc(100vw - 36px));background:#fff;border:2px solid #DB8437;border-top:8px solid #1E2340;border-radius:12px;box-shadow:0 14px 36px rgba(20,26,46,.28);padding:12px 16px;}
.lgn-pop-h{display:flex;flex-direction:column;gap:2px;margin-bottom:6px;}
.lgn-pop-h b{font:800 17px 'Inter',sans-serif;color:#1E2340;}
.lgn-pop-h span{font:700 12.5px 'IBM Plex Mono',monospace;letter-spacing:.04em;text-transform:uppercase;color:#A4470F;}
.lgn-pop p{margin:0 0 10px;font:700 16px/1.45 'Inter',sans-serif;color:#1E2340;}
.lgn-pop p b{color:#A4470F;}
.lgn-pop-go{display:flex;justify-content:flex-end;}
.lgn-pv{display:flex;flex-direction:column;gap:4px;margin:0 0 10px;padding:8px 12px;background:#FFF4E8;border-left:5px solid #DB8437;border-radius:6px;color:#1E2340;font-size:14px;}
.lgn-pv b{color:#A4470F;}`;
  document.head.appendChild(st);
}
})();
