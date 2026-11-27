/* ⚡ INJECT: A TRAINER'S BUTTON ON THE SLIDE, AND A POP-UP ON EVERY TRAINEE'S DECK (every Skill Activity with an inject)
   The ⚡ Inject list (js/cm-case-flow.js cmCaseFlow.inject: the activity's live call and its fallout, an email, a call or
   a CMS alert to deliver mid-task) sat in the activity's tools, under 💡 Tips, and only the call could reach the trainees
   (📞 Ring every trainee: call-inject-day<N>). Now:
   · the trainer (never a trainee, never the audience's view) has ⚡ Inject on the slide's band, beside 💡 Tips, on an
     activity that has something to inject; it opens the same list, and the Tips panel no longer carries it;
   · each fallout in the list has 📣 Send to every trainee: it lands on every trainee's deck as a pop-up, "⚡ Just landed
     on your desk", with its channel, sender, subject and message (task-inject-day<N>, a shared record everyone reads:
     worker.js PUBLIC_READ; only a trainer writes it). A trainee sees each one once (this device remembers it), within a
     minute of it being sent, while it is fresh (15 minutes). The call keeps its 📞 Ring every trainee.
   · the trainee's page reads it in its once-a-minute check, on the same request as the open days (cmOpenLessons.keys). */
(function(){
"use strict";
if(typeof window === "undefined" || typeof document === "undefined" || !window.cmCaseFlow) return;
const OL = window.cmOpenLessons;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const SIM = () => window.CM_CF_SIM || {};
const KEY = id => "task-inject-day" + id, FRESH = 15 * 60 * 1000, SEEN = "lsh_inject_seen";
const trainer = () => typeof state === "object" && !!state.isAdmin && !state.adminPreview;
const isTrainee = () => typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;
const days = () => (typeof DAYS !== "undefined" && Array.isArray(DAYS) ? DAYS : []).filter(d => d && d.cf);
const say = m => { if(typeof toast === "function") toast(m); };
const falloutOf = bid => (SIM().fallout || []).filter(f => f.then && f.then.activity === bid).map(f => f.then.event || {});
const hasInject = b => !!(b && b.kind === "activity" && ((SIM().calls || {})[b.id] || falloutOf(b.id).length));
const ICON = {email: "✉", call: "📞", alert: "🔔", voicemail: "📳", text: "💬", letter: "📄", fax: "📠"};

/* the slide the trainer is on */
function here(){
  if(typeof state !== "object" || state.view !== "day") return null;
  const d = days().find(x => x.id === state.dayId); if(!d || typeof buildDaySlides !== "function") return null;
  const sl = buildDaySlides(d)[state.lessonSlide]; if(!sl || sl.lessonIndex == null) return null;
  const l = d.lessons[sl.lessonIndex]; return l && l.cf ? {d, i: sl.lessonIndex, b: l.cf.block} : null;
}

/* ⚡ Inject on the band, for the trainer */
function band(){
  const ref = document.querySelector("#lessonSlideWrap .cfx-ref-open"); if(!ref) return;
  const had = ref.parentElement.querySelector(".cfx-inject-open"), h = trainer() ? here() : null;
  if(!h || !hasInject(h.b)){ if(had) had.remove(); return; }
  if(had && had.dataset.block === h.b.id) return;
  if(had) had.remove();
  const btn = document.createElement("button"); btn.type = "button"; btn.className = "cfx-inject-open"; btn.dataset.block = h.b.id;
  btn.textContent = "⚡ Inject"; btn.title = "Trainer only: a real-time task to land on every trainee's deck while they work this one";
  btn.addEventListener("click", ev => { ev.stopPropagation(); cmCaseFlow.inject(h.d.id, h.i); });
  ref.insertAdjacentElement("beforebegin", btn);
}
let queued = false;
new MutationObserver(() => { if(queued) return; queued = true; Promise.resolve().then(() => { queued = false; try{ band(); }catch(e){} }); })
  .observe(document.documentElement, {childList: true, subtree: true});

/* the list: 📣 Send to every trainee on each fallout */
const __inject = cmCaseFlow.inject;
cmCaseFlow.inject = function(dayId, i){
  const r = __inject.apply(this, arguments);
  try{
    const d = days().find(x => x.id === Number(dayId)), l = d && d.lessons[i], b = l && l.cf && l.cf.block;
    const m = document.querySelector(".cfx-inject-m"), items = m ? [...m.querySelectorAll("ul > li")] : [];
    const evs = b ? falloutOf(b.id) : [], off = b && (SIM().calls || {})[b.id] ? 1 : 0;
    evs.forEach((ev, k) => { const li = items[off + k]; if(!li || li.querySelector(".cfx-inject-send")) return;
      const s = document.createElement("button"); s.type = "button"; s.className = "btn btn-sm cfx-inject-send"; s.textContent = "📣 Send to every trainee";
      s.addEventListener("click", () => send(d.id, b.id, ev, s)); li.appendChild(s); });
  }catch(e){}
  return r;
};
async function send(dayId, blockId, ev, btn){
  if(!trainer() || typeof sharedSet !== "function") return;
  const now = new Date().toISOString();
  const rec = {active: true, id: now, at: now, dayId, blockId, channel: ev.channel || "", from: ev.from || "", subject: ev.subject || "", body: ev.body || ""};
  let ok = false; try{ ok = await sharedSet(KEY(dayId), rec); }catch(e){}
  if(!ok){ say("Not sent: check the connection and try again."); return; }
  if(btn){ btn.textContent = "✓ Sent to every trainee"; btn.disabled = true; }
  say(`⚡ Sent to every trainee: ${ev.subject || ev.from || "the inject"}. It lands on their deck within a minute.`);
}

/* the trainee's deck: the pop-up */
const seen = () => { try{ return JSON.parse(localStorage.getItem(SEEN) || "[]"); }catch(e){ return []; } };
const markSeen = id => { try{ const s = seen(); s.push(id); localStorage.setItem(SEEN, JSON.stringify(s.slice(-50))); }catch(e){} };
function onRecs(recs){
  if(!isTrainee() || document.getElementById("cfx-inject-pop")) return;
  const done = seen();
  const live = (recs || []).filter(r => r && r.active && r.id && !done.includes(r.id) && Date.now() - new Date(r.at).getTime() < FRESH)
    .sort((a, b) => String(b.at).localeCompare(String(a.at)))[0];
  if(live) pop(live);
}
function pop(r){
  markSeen(r.id);
  const o = document.createElement("div"); o.id = "cfx-inject-pop"; o.className = "cfx-inject-pop"; o.setAttribute("role", "alertdialog"); o.setAttribute("aria-label", "Just landed on your desk");
  o.innerHTML = `<div class="cip-box"><p class="cip-k">⚡ Just landed on your desk</p>
    <h3>${ICON[r.channel] || "⚡"} ${E(r.channel ? r.channel[0].toUpperCase() + r.channel.slice(1) : "Task")}${r.from ? ` from <b>${E(r.from)}</b>` : ""}</h3>
    ${r.subject ? `<p class="cip-s">${E(r.subject)}</p>` : ""}${r.body ? `<p class="cip-b">${E(r.body)}</p>` : ""}
    <p class="cip-n">Handle it now, the way it would land on a real desk, then carry on with your task.</p>
    <button type="button" class="btn cip-ok">Got it</button></div>`;
  const close = () => { o.remove(); document.removeEventListener("keydown", esc, true); };
  const esc = ev => { if(ev.key === "Escape"){ ev.stopPropagation(); close(); } };
  o.querySelector(".cip-ok").addEventListener("click", close);
  document.addEventListener("keydown", esc, true);
  document.body.appendChild(o);
  try{ if(navigator.vibrate) navigator.vibrate([200, 100, 200]); }catch(e){}
}
if(OL && typeof OL.keys === "function"){
  const __keys = OL.keys, __onKeys = OL.onKeys;
  const mine = () => isTrainee() ? days().map(d => KEY(d.id)) : [];
  OL.keys = () => __keys().concat(mine());
  OL.onKeys = vals => { const n = __keys().length; __onKeys(vals.slice(0, n)); if(vals.length > n) try{ onRecs(vals.slice(n)); }catch(e){} };
}
window.cmInjectPop = {send, pop, onRecs, KEY};

const st = document.createElement("style"); st.id = "cm-inject-pop"; st.textContent = `
html body .cfx-ribbon-ref .cfx-inject-open{flex:0 0 auto;font:800 16px/1 'Inter',sans-serif;padding:0 14px;margin-right:8px;border-radius:12px;border:2px solid #C9A27A;background:#1E2340;color:#F3D7AE;cursor:pointer;white-space:nowrap;align-self:stretch;}
html body .cfx-ribbon-ref .cfx-inject-open:hover,html body .cfx-ribbon-ref .cfx-inject-open:focus-visible{background:#F3D7AE;color:#1E2340;outline:none;}
.cfx-inject-m .cfx-inject-send{margin-top:8px;display:inline-flex;background:#1E2340 !important;color:#fff !important;border:0 !important;font-weight:800 !important;}
.cfx-inject-m .cfx-inject-send:disabled{background:#15803d !important;opacity:1;}
.cfx-inject-pop{position:fixed;inset:0;z-index:4200;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,19,38,.6);}
.cfx-inject-pop .cip-box{width:min(620px,100%);background:#fff;border-radius:16px;border-top:6px solid #C9A27A;padding:20px 24px;box-shadow:0 18px 48px rgba(0,0,0,.4);text-align:left;}
.cfx-inject-pop .cip-k{margin:0 0 6px;font:800 15px/1.2 'Inter',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#9A4E12;}
.cfx-inject-pop h3{margin:0 0 8px;font:800 21px/1.3 'Poppins','Inter',sans-serif;color:#1E2340;}
.cfx-inject-pop .cip-s{margin:0 0 6px;font:800 18px/1.4 'Inter',sans-serif;color:#1E2340;}
.cfx-inject-pop .cip-b{margin:0 0 10px;font:700 17px/1.5 'Inter',sans-serif;color:#2B3147;}
.cfx-inject-pop .cip-n{margin:0 0 14px;font:700 16px/1.4 'Inter',sans-serif;color:#4A5068;}
.cfx-inject-pop .cip-ok{background:#1E2340 !important;color:#fff !important;border:0 !important;font:800 17px/1 'Inter',sans-serif !important;padding:12px 24px !important;border-radius:10px !important;}
`;
document.head.appendChild(st);
})();
