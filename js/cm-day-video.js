/* 🎬 A day's narrated video (as Foundational Training's ▶ Video Presentation on the lesson card): the day's Canva deck,
   read slide by slide by the narrator (build/videoslide makes it; js/cm-deck-slides.js lists it as CM_DAY_VIDEOS).
   • The day card shows ▶ Video (the Video Presentation) once the video is unlocked, 🔒 Video until then. A trainer always sees ▶.
   • settings:openvideos = {all: [dayIds], batches: {"<batch key>": [dayIds]}}: everyone reads it (worker.js PUBLIC_READ),
     only a trainer writes it: Admin → 🔓 Open Lessons → 🎬 Unlock Videos, for the batch picked there or for all batches.
   • The trainee's page reads it in its once-a-minute check, on the same request as the open days (cmOpenLessons.keys).
   • The viewer: the video with captions (CC), and the slides as chapters down the side; a chapter jumps to its slide. */
(function(){
"use strict";
const KEY = "settings:openvideos";
const VIDEOS = window.CM_DAY_VIDEOS || {};
const OL = window.cmOpenLessons;
if(!Object.keys(VIDEOS).length || !OL) return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const ids = () => Object.keys(VIDEOS).map(Number);
const nums = a => [...new Set((Array.isArray(a) ? a : []).map(Number).filter(n => VIDEOS[n]))].sort((x, y) => x - y);
const shape = x => { const o = {all: [], batches: {}}; if(!x || typeof x !== "object") return o;
  o.all = nums(x.all); Object.keys(x.batches || {}).forEach(k => { const c = OL.key(k) || k, v = nums([].concat(o.batches[c] || [], x.batches[k] || [])); if(v.length) o.batches[c] = v; }); return o; };
const trainer = () => !!state.isAdmin && !state.adminPreview;
const isTrainee = () => !!state.traineeId && !state.isAdmin && !state.adminPreview;
const say = m => { if(typeof toast === "function") toast(m); };
const dayName = id => { const d = (window.CM_CASE_FLOW_DAYS || []).find(x => x.id === Number(id)); return d && d.cf ? "Case Flow Day " + d.cf.n : "Day " + id; };
const mmss = t => { t = Math.max(0, Math.floor(t)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); };

state.cmOpenVideos = null;
function take(v){
  if(v == null && state.cmOpenVideos) return false;   // a server blip never locks a video again
  const next = shape(v), ch = JSON.stringify(next) !== JSON.stringify(state.cmOpenVideos);
  state.cmOpenVideos = next; return ch;
}
const redraw = () => { if(state.view === "dashboard" && !(typeof isTyping === "function" && isTyping()) && !document.querySelector(".overlay")) render(); };
let loading = null;
const load = () => loading || (loading = sharedGetMany([KEY]).then(([v]) => { loading = null; if(take(v)) redraw(); }).catch(() => { loading = null; }));
function unlocked(id){
  if(state.isAdmin || state.adminPreview) return true;
  if(state.cmOpenVideos === null){ if(isTrainee()) load(); return false; }
  const o = state.cmOpenVideos;
  return [].concat(o.all, o.batches[OL.key(state.traineeBatch)] || []).includes(Number(id));
}

/* ---------- the trainee's once-a-minute check: one more key on the request the open days ride on ---------- */
const __keys = OL.keys, __onKeys = OL.onKeys;
OL.keys = () => { const k = __keys(); return isTrainee() ? k.concat([KEY]) : k; };
OL.onKeys = vals => { const n = __keys().length; __onKeys(vals.slice(0, n)); if(isTrainee() && vals.length > n && take(vals[n])) redraw(); };

/* ---------- the day card: ▶ Video Presentation, or 🔒 Video until the trainer unlocks it ---------- */
if(typeof moduleCard === "function"){
  const __card = moduleCard;
  moduleCard = window.moduleCard = function(d){
    const html = __card.apply(this, arguments);
    if(!d || !VIDEOS[d.id]) return html;
    const btn = unlocked(d.id)
      ? `<button type="button" class="btn btn-ghost btn-sm module-finish-btn cm-dv-btn" onclick="event.stopPropagation(); cmDayVideo.open(${d.id})" title="Video Presentation: the day&#39;s slides, narrated">▶ Video</button>`
      : `<button type="button" class="btn btn-ghost btn-sm module-finish-btn cm-dv-btn cm-dv-locked" aria-disabled="true" onclick="event.stopPropagation(); cmDayVideo.why()" title="Opens when your trainer unlocks this video">🔒 Video</button>`;
    const i = html.lastIndexOf("</div>");
    return i < 0 ? html + btn : html.slice(0, i) + btn + html.slice(i);
  };
}

/* ---------- the viewer ---------- */
function close(){
  const o = document.getElementById("cm-dv"); if(!o) return;
  const v = o.querySelector("video"); if(v){ try{ v.pause(); }catch(e){} }
  o.remove(); document.removeEventListener("keydown", onKey, true);
}
function onKey(ev){ if(ev.key === "Escape"){ ev.stopPropagation(); close(); } }
function open(id){
  const vid = VIDEOS[id]; if(!vid) return;
  if(!unlocked(id)) return why();
  close();
  const o = document.createElement("div");
  o.id = "cm-dv"; o.className = "overlay cm-dv"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", vid.title + ": Video Presentation");
  o.innerHTML = `<div class="cm-dv-box">
    <div class="cm-dv-head"><h2>🎬 ${E(vid.title)} <span>Video Presentation</span></h2><button type="button" class="cm-dv-x" onclick="cmDayVideo.close()" aria-label="Close the video">✕</button></div>
    <div class="cm-dv-main">
      <div class="cm-dv-stage"><video controls playsinline preload="metadata" src="${E(vid.src)}">${vid.captions ? `<track kind="captions" srclang="en" label="English" src="${E(vid.captions)}" default>` : ""}</video></div>
      <nav class="cm-dv-chapters" aria-label="Slides"><h3>Slides</h3><ol>${vid.chapters.map((c, i) => `<li><button type="button" data-i="${i}" onclick="cmDayVideo.seek(${i})"><b>${c.page}</b><span>${E(c.title)}</span><i>${mmss(c.t)}</i></button></li>`).join("")}</ol></nav>
    </div></div>`;
  o.addEventListener("mousedown", ev => { if(ev.target === o) close(); });
  document.body.appendChild(o);
  const v = o.querySelector("video"), btns = [...o.querySelectorAll(".cm-dv-chapters button")];
  let cur = -1;
  v.addEventListener("timeupdate", () => {
    let i = 0; while(i + 1 < vid.chapters.length && vid.chapters[i + 1].t <= v.currentTime + 0.05) i++;
    if(i === cur) return; cur = i;
    btns.forEach((b, k) => b.classList.toggle("on", k === i));
    const b = btns[i], list = b.closest("ol").parentElement;
    if(b.offsetTop < list.scrollTop || b.offsetTop + b.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = Math.max(0, b.offsetTop - list.clientHeight / 2);
  });
  document.addEventListener("keydown", onKey, true);
  o.querySelector(".cm-dv-x").focus();
}
function seek(i){
  const o = document.getElementById("cm-dv"), v = o && o.querySelector("video"); if(!v) return;
  const id = Object.keys(VIDEOS).find(k => VIDEOS[k].src === v.getAttribute("src")), c = id && VIDEOS[id].chapters[i]; if(!c) return;
  v.currentTime = c.t + 0.05; const p = v.play(); if(p && p.catch) p.catch(() => {});
}
const why = () => say("🔒 Your trainer unlocks this video for your batch. It opens here within a minute of that.");

/* ---------- Admin → 🔓 Open Lessons → 🎬 Unlock Videos (for the batch picked on that page) ---------- */
let reading = false;
function ensure(){
  if(state.cmOpenVideos !== null || reading) return;
  reading = true;
  sharedGetStrict(KEY).then(v => { take(v); }).catch(() => { state.cmOvReadFailed = true; })
    .then(() => { reading = false; if(state.view === "admin" && state.adminTab === "openlessons" && !(typeof isTyping === "function" && isTyping())) render(); });
}
function adminCard(){
  ensure();
  const o = state.cmOpenVideos, sel = state.cmOdBatch || "__all";
  const name = sel === "__all" ? "all batches" : "batch " + ((typeof canonicalBatch === "function" && canonicalBatch(sel)) || sel.toUpperCase());
  if(!o) return `<div class="card ft-open-days cm-dv-admin"><h3>🎬 Unlock Videos</h3><p class="cm-ol-help">${state.cmOvReadFailed ? "Couldn't read which videos are unlocked. Check your connection and refresh." : "Reading which videos are unlocked…"}</p></div>`;
  const all = new Set(o.all), mine = new Set(sel === "__all" ? [] : o.batches[sel] || []);
  const tiles = ids().map(id => {
    const viaAll = sel !== "__all" && all.has(id), on = viaAll || (sel === "__all" ? all.has(id) : mine.has(id));
    return `<label class="cm-dv-day${on ? " on" : ""}${viaAll ? " via" : ""}"><input type="checkbox" ${on ? "checked" : ""} ${viaAll ? "disabled" : ""} onchange="cmDayVideo.toggle(${id}, this.checked)">
      <span><b>🎬 ${E(dayName(id))}</b>${E(VIDEOS[id].title)}<small>${on ? (viaAll || sel === "__all" ? "unlocked for all batches" : "unlocked for " + E(name)) : "locked: trainees see 🔒 Video"}</small></span></label>`;
  }).join("");
  return `<div class="card ft-open-days cm-dv-admin"><h3>🎬 Unlock Videos</h3>
    <p class="cm-ol-help">A day's narrated video stays locked for trainees (🔒 Video on the day card) until you tick it here, for the batch picked above (${E(name)}). You can always play it yourself: <button type="button" class="btn btn-ghost btn-sm" onclick="cmDayVideo.open(${ids()[0]})">▶ Preview</button></p>
    <div class="cm-dv-days">${tiles}</div></div>`;
}
if(typeof window.renderAdminOpenLessons === "function"){
  const __admin = window.renderAdminOpenLessons;
  window.renderAdminOpenLessons = function(){ const html = __admin.apply(this, arguments); return html && trainer() ? html + adminCard() : html; };
}
async function toggle(id, on){
  if(!trainer()) return;
  let cur;
  try{ cur = await sharedGetStrict(KEY); }catch(e){ say("Couldn't read the unlocked videos: nothing was changed. Check your connection and try again."); render(); return; }
  const o = shape(cur), sel = state.cmOdBatch || "__all";
  const list = new Set(sel === "__all" ? o.all : o.batches[sel] || []);
  if(on) list.add(Number(id)); else list.delete(Number(id));
  if(sel === "__all") o.all = nums([...list]);
  else { o.batches[sel] = nums([...list]); if(!o.batches[sel].length) delete o.batches[sel]; }
  if(!(await sharedSet(KEY, o))){ say("Not saved: check your connection and try again."); render(); return; }
  state.cmOpenVideos = o;
  const name = sel === "__all" ? "all batches" : "batch " + ((typeof canonicalBatch === "function" && canonicalBatch(sel)) || sel.toUpperCase());
  say(`${dayName(id)}'s video ${on ? "unlocked" : "locked"} for ${name}. Trainees see it within a minute.`);
  render();
}

window.cmDayVideo = {KEY, open, close, seek, why, toggle, unlocked, shape};

const css = document.createElement("style");
css.textContent = `
.cm-dv-btn{font-weight:700;}
.cm-dv-locked{opacity:.75;cursor:help;}
.cm-dv.overlay{position:fixed;inset:0;z-index:4000;display:flex;align-items:center;justify-content:center;background:rgba(15,18,36,.78);padding:16px;}
.cm-dv-box{background:#1E2340;color:#fff;border-radius:14px;width:min(1500px,100%);max-height:100%;display:flex;flex-direction:column;overflow:hidden;box-shadow:0 18px 60px rgba(0,0,0,.5);}
.cm-dv-head{display:flex;align-items:center;gap:12px;padding:12px 18px;border-bottom:3px solid #DB8437;}
.cm-dv-head h2{margin:0;flex:1;font:700 20px/1.25 'Poppins','Inter',sans-serif;color:#fff;}
.cm-dv-head h2 span{color:#F0B27A;font-size:16px;margin-left:8px;}
.cm-dv-x{font:700 18px/1 inherit;width:40px;height:40px;border-radius:50%;border:2px solid #fff;background:transparent;color:#fff;cursor:pointer;}
.cm-dv-x:hover,.cm-dv-x:focus-visible{background:#DB8437;border-color:#DB8437;outline:none;}
.cm-dv-main{display:grid;grid-template-columns:minmax(0,1fr) clamp(240px,24%,340px);min-height:0;flex:1;}
.cm-dv-stage{background:#000;display:flex;align-items:center;justify-content:center;min-height:0;}
.cm-dv-stage video{display:block;width:100%;max-height:calc(100vh - 110px);aspect-ratio:16/9;background:#000;}
.cm-dv-chapters{position:relative;overflow-y:auto;min-height:0;max-height:calc(100vh - 110px);background:#262C52;}
.cm-dv-chapters h3{position:sticky;top:0;margin:0;padding:10px 14px;background:#262C52;font:700 16px/1.2 'Poppins','Inter',sans-serif;color:#F0B27A;z-index:1;}
.cm-dv-chapters ol{list-style:none;margin:0;padding:0 8px 10px;}
.cm-dv-chapters button{display:grid;grid-template-columns:30px minmax(0,1fr) auto;gap:8px;align-items:baseline;width:100%;text-align:left;padding:8px;border:0;border-radius:8px;background:transparent;color:#fff;font:700 16px/1.3 'Inter',sans-serif;cursor:pointer;}
.cm-dv-chapters button b{color:#F0B27A;text-align:right;}
.cm-dv-chapters button i{font-style:normal;font-weight:600;font-size:14px;color:#C9CEE6;}
.cm-dv-chapters button:hover,.cm-dv-chapters button:focus-visible{background:#3B4A8C;outline:none;}
.cm-dv-chapters button.on{background:#DB8437;color:#1E2340;}
.cm-dv-chapters button.on b,.cm-dv-chapters button.on i{color:#1E2340;}
.cm-dv-admin{margin-top:0;}
.cm-dv-days{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:10px;}
.cm-dv-day{display:flex;gap:10px;align-items:flex-start;border:2px solid var(--line);border-radius:12px;padding:14px;font-size:15px;line-height:1.4;color:#262B45;background:#fff;cursor:pointer;min-height:64px;}
.cm-dv-day input[type=checkbox]{width:18px;height:18px;margin-top:2px;flex:0 0 auto;accent-color:#DB8437;}
.cm-dv-day.on{border-color:var(--orange);background:#FFF6EC;}
.cm-dv-day.via{cursor:default;}
.cm-dv-day b{display:block;color:var(--navy);font-weight:800;font-size:16px;}
.cm-dv-day small{display:block;margin-top:4px;font-size:14px;font-weight:700;color:#A4470F;}
@media (max-width:900px){ .cm-dv-main{grid-template-columns:minmax(0,1fr);} .cm-dv-chapters{max-height:34vh;} .cm-dv-stage video{max-height:52vh;} }
`;
document.head.appendChild(css);
})();
