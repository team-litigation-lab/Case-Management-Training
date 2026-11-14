/* 🎬 A day's narrated video (as Foundational Training's ▶ Video Presentation on the lesson card): the day's Canva deck,
   read slide by slide by the narrator (build/videoslide makes it; js/cm-deck-slides.js lists it as CM_DAY_VIDEOS).
   • The day card shows ▶ Video (the Video Presentation) once the video is unlocked, 🔒 Video until then. A trainer always sees ▶.
   • settings:openvideos = {all: [dayIds], batches: {"<batch key>": [dayIds]}}: everyone reads it (worker.js PUBLIC_READ),
     only a trainer writes it: Admin → 🔓 Open Lessons → 🎬 Unlock Videos, for the batch picked there or for all batches.
   • The trainee's page reads it in its once-a-minute check, on the same request as the open days (cmOpenLessons.keys).
   • The viewer: the video with captions (CC) in a strip under the picture, and the slides as chapters down the side; a chapter
     jumps to its slide. It has ⛶ Full screen, a speed choice (0.75× to 2×), and opens where the trainee left off. */
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

/* ---------- the viewer ----------
   • ⛶ Full screen takes the whole player (the video, its caption strip and the slide list); Esc or the button leaves it.
   • The trainee's place in each video is kept (personal progress "day-video": every 5 s on this device, and to their
     account on pause, on close and at most once a minute while it plays); it opens there again: "Resumed at m:ss · Start over".
   • Speed 0.75× to 2×, and CC on or off, are remembered in the same entry.
   • Captions are drawn in a strip under the video, not over the slide: the track is kept "hidden" and its cues fill the
     strip, so every day's video (anything in CM_DAY_VIDEOS) looks the same. */
const PREF = "day-video", RATES = [0.75, 1, 1.25, 1.5, 1.75, 2];
if(typeof registerPersonalKeys === "function") registerPersonalKeys([PREF]);
let prefs = {pos: {}, rate: 1, cc: true, at: 0}, curId = null, lastLocal = 0, lastCloud = 0;
const clean = p => { p = p && typeof p === "object" ? p : {};
  return {pos: p.pos && typeof p.pos === "object" ? Object.assign({}, p.pos) : {}, rate: RATES.includes(Number(p.rate)) ? Number(p.rate) : 1, cc: p.cc !== false, at: Number(p.at) || 0}; };
const readLocal = () => { try{ return JSON.parse(localStorage.getItem("lsh_" + PREF) || "null"); }catch(e){ return null; } };
async function readPrefs(){
  let a = null; try{ a = typeof storeGet === "function" ? await storeGet(PREF) : null; }catch(e){}
  const b = readLocal();   // the 5-second saves go straight to this device: take whichever is newer
  return clean(b && (!a || (b.at || 0) > (a.at || 0)) ? b : a);
}
function saveLocal(){ prefs.at = Date.now(); lastLocal = prefs.at; try{ localStorage.setItem("lsh_" + PREF, JSON.stringify(prefs)); }catch(e){} }
function saveCloud(){ saveLocal(); lastCloud = Date.now(); if(typeof storeSet === "function") Promise.resolve(storeSet(PREF, prefs)).catch(() => {}); }
const vEl = () => { const o = document.getElementById("cm-dv"); return o && o.querySelector("video"); };
function keepPlace(force){
  const v = vEl(); if(!v || curId == null) return;
  const t = v.currentTime || 0, d = v.duration;
  if(t < 5 || (d > 0 && t > d - 10)) delete prefs.pos[curId]; else prefs.pos[curId] = Math.floor(t);
  if(force || Date.now() - lastCloud > 60000) saveCloud(); else if(Date.now() - lastLocal > 5000) saveLocal();
}
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
const exitFs = () => { const f = document.exitFullscreen || document.webkitExitFullscreen; if(f){ try{ const p = f.call(document); if(p && p.catch) p.catch(() => {}); }catch(e){} } };
function fullscreen(){
  const o = document.getElementById("cm-dv"); if(!o) return;
  if(fsEl()){ exitFs(); return; }
  const box = o.querySelector(".cm-dv-box"), v = o.querySelector("video");
  const go = box.requestFullscreen || box.webkitRequestFullscreen;
  if(go){ try{ const p = go.call(box); if(p && p.catch) p.catch(() => { if(v.webkitEnterFullscreen) v.webkitEnterFullscreen(); }); }catch(e){} }
  else if(v.webkitEnterFullscreen) v.webkitEnterFullscreen();   // iPhone: only the video itself can go full screen
}
function onFs(){
  const o = document.getElementById("cm-dv"); if(!o) return;
  const f = fsEl(), on = !!f && o.contains(f), b = o.querySelector(".cm-dv-fs");
  o.classList.toggle("cm-dv-isfs", on);
  if(b){ b.textContent = on ? "🗗 Exit full screen" : "⛶ Full screen"; b.setAttribute("aria-pressed", on ? "true" : "false");
    b.title = on ? "Leave full screen (Esc)" : "Fill the screen with the video, its captions and the slide list"; }
}
document.addEventListener("fullscreenchange", onFs); document.addEventListener("webkitfullscreenchange", onFs);
function close(){
  const o = document.getElementById("cm-dv"); if(!o) return;
  const v = o.querySelector("video"); if(v){ try{ v.pause(); }catch(e){} keepPlace(true); }
  if(fsEl() && o.contains(fsEl())) exitFs();
  o.remove(); curId = null; document.removeEventListener("keydown", onKey, true);
}
function onKey(ev){
  if(ev.key !== "Escape") return;
  ev.stopPropagation();
  if(fsEl()){ exitFs(); return; }   // Esc first leaves full screen; a second Esc closes the viewer
  close();
}
const ccText = c => E(String(c.text || "").replace(/<[^>]*>/g, "")).replace(/\n/g, "<br>");
function showCc(){
  const o = document.getElementById("cm-dv"), v = o && o.querySelector("video"), box = o && o.querySelector(".cm-dv-cc"); if(!box) return;
  const tr = v.textTracks && v.textTracks[0]; let cues = [];
  if(tr){
    cues = tr.activeCues ? [...tr.activeCues] : [];
    if(!cues.length && tr.cues){ const t = v.currentTime; cues = [...tr.cues].filter(c => c.startTime <= t && c.endTime > t); }   // before it plays, or just after a jump
  }
  const html = cues.map(ccText).join("<br>");
  if(box.innerHTML !== html) box.innerHTML = html;
}
function ccUi(o){
  o.classList.toggle("cm-dv-nocc", !prefs.cc);
  const b = o.querySelector(".cm-dv-ccbtn"); if(b){ b.setAttribute("aria-pressed", prefs.cc ? "true" : "false"); b.title = prefs.cc ? "Hide the captions" : "Show the captions"; }
}
function setCc(on){
  prefs.cc = !!on; saveCloud();
  const o = document.getElementById("cm-dv"); if(o) ccUi(o);
}
function rateUi(o){
  const v = o.querySelector("video"); if(v){ v.defaultPlaybackRate = prefs.rate; v.playbackRate = prefs.rate; }
  const s = o.querySelector(".cm-dv-rate"); if(s && Number(s.value) !== prefs.rate) s.value = String(prefs.rate);
}
function setRate(r){
  r = Number(r); if(!RATES.includes(r)) return;
  prefs.rate = r; saveCloud();
  const o = document.getElementById("cm-dv"); if(o) rateUi(o);
}
function startOver(){
  const o = document.getElementById("cm-dv"), v = vEl(); if(!v) return;
  v.currentTime = 0; if(curId != null) delete prefs.pos[curId]; saveCloud();
  const n = o.querySelector(".cm-dv-resume"); if(n) n.hidden = true;
  if(o._mark) o._mark(); showCc();
  const p = v.play(); if(p && p.catch) p.catch(() => {});
}
function open(id){
  const vid = VIDEOS[id]; if(!vid) return;
  if(!unlocked(id)) return why();
  close();
  curId = Number(id);
  const o = document.createElement("div");
  o.id = "cm-dv"; o.className = "overlay cm-dv"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", vid.title + ": Video Presentation");
  o.innerHTML = `<div class="cm-dv-box">
    <div class="cm-dv-head"><h2>🎬 ${E(vid.title)} <span>Video Presentation</span></h2>
      <span class="cm-dv-resume" hidden>Resumed at <b></b> · <button type="button" onclick="cmDayVideo.startOver()">↺ Start over</button></span>
      <label class="cm-dv-ctl cm-dv-speed">Speed <select class="cm-dv-rate" aria-label="Playback speed" onchange="cmDayVideo.setRate(this.value)">${RATES.map(r => `<option value="${r}">${r}×</option>`).join("")}</select></label>
      <button type="button" class="cm-dv-ctl cm-dv-ccbtn" aria-pressed="true" onclick="cmDayVideo.setCc(!cmDayVideo.prefs().cc)">CC</button>
      <button type="button" class="cm-dv-ctl cm-dv-fs" aria-pressed="false" onclick="cmDayVideo.fullscreen()" title="Fill the screen with the video, its captions and the slide list">⛶ Full screen</button>
      <button type="button" class="cm-dv-x" onclick="cmDayVideo.close()" aria-label="Close the video">✕</button></div>
    <div class="cm-dv-main">
      <div class="cm-dv-stage"><video controls playsinline preload="metadata" controlslist="nofullscreen" disablepictureinpicture src="${E(vid.src)}">${vid.captions ? `<track kind="captions" srclang="en" label="English" src="${E(vid.captions)}" default>` : ""}</video>
        <div class="cm-dv-cc"></div></div>
      <nav class="cm-dv-chapters" aria-label="Slides"><h3>Slides</h3><ol>${vid.chapters.map((c, i) => `<li><button type="button" data-i="${i}" onclick="cmDayVideo.seek(${i})"><b>${c.page}</b><span>${E(c.title)}</span><i>${mmss(c.t)}</i></button></li>`).join("")}</ol></nav>
    </div></div>`;
  o.addEventListener("mousedown", ev => { if(ev.target === o) close(); });
  document.body.appendChild(o);
  ccUi(o); rateUi(o);
  const v = o.querySelector("video"), btns = [...o.querySelectorAll(".cm-dv-chapters button")];
  let cur = -1;
  const mark = o._mark = () => {
    let i = 0; while(i + 1 < vid.chapters.length && vid.chapters[i + 1].t <= v.currentTime + 0.05) i++;
    if(i === cur || !btns[i]) return; cur = i;
    btns.forEach((b, k) => b.classList.toggle("on", k === i));
    const b = btns[i], list = b.closest("ol").parentElement;
    if(b.offsetTop < list.scrollTop || b.offsetTop + b.offsetHeight > list.scrollTop + list.clientHeight) list.scrollTop = Math.max(0, b.offsetTop - list.clientHeight / 2);
  };
  v.addEventListener("timeupdate", () => { mark(); keepPlace(false); });
  v.addEventListener("seeked", () => { mark(); showCc(); });
  v.addEventListener("pause", () => keepPlace(true));
  v.addEventListener("ended", () => { if(curId != null){ delete prefs.pos[curId]; saveCloud(); } });
  v.addEventListener("loadedmetadata", () => rateUi(o));
  v.addEventListener("dblclick", ev => { ev.preventDefault(); fullscreen(); });
  // the captions: never drawn on the picture; the strip under it shows them
  const tr = v.textTracks && v.textTracks[0];
  if(tr){
    tr.mode = "hidden";
    tr.addEventListener("cuechange", showCc);
    const el = v.querySelector("track"); if(el) el.addEventListener("load", () => { if(tr.mode !== "hidden") tr.mode = "hidden"; showCc(); });
    // the browser's own CC menu: "showing" means the trainee wants captions (in the strip), "disabled" means none
    v.textTracks.addEventListener("change", () => {
      if(tr.mode === "showing"){ tr.mode = "hidden"; if(!prefs.cc) setCc(true); }
      else if(tr.mode === "disabled"){ tr.mode = "hidden"; if(prefs.cc) setCc(false); }
    });
  }
  document.addEventListener("keydown", onKey, true);
  o.querySelector(".cm-dv-x").focus();
  // where this trainee left off, with their speed and CC choice (read fresh: their progress may have come from another device)
  readPrefs().then(p => {
    if(!document.body.contains(o)) return;
    prefs = p; ccUi(o); rateUi(o);
    const at = Number(prefs.pos[id]) || 0;
    if(at >= 5 && v.currentTime < 1){
      v.currentTime = at;
      const n = o.querySelector(".cm-dv-resume"); n.querySelector("b").textContent = mmss(at); n.hidden = false;
    }
    mark(); showCc();
  });
}
function seek(i){
  const o = document.getElementById("cm-dv"), v = vEl(); if(!v || curId == null) return;
  const c = VIDEOS[curId] && VIDEOS[curId].chapters[i]; if(!c) return;
  v.currentTime = c.t + 0.05; if(o._mark) o._mark(); showCc();
  const n = o.querySelector(".cm-dv-resume"); if(n) n.hidden = true;
  const p = v.play(); if(p && p.catch) p.catch(() => {});
}
window.addEventListener("pagehide", () => keepPlace(true));
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

window.cmDayVideo = {KEY, PREF, RATES, open, close, seek, why, toggle, unlocked, shape, fullscreen, setRate, setCc, startOver, showCc, prefs: () => prefs};

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
.cm-dv-stage{background:#000;display:flex;flex-direction:column;align-items:center;justify-content:center;min-height:0;}
.cm-dv-stage video{display:block;width:100%;max-height:calc(100vh - 110px - 76px);aspect-ratio:16/9;background:#000;}
.cm-dv-stage video::cue{color:transparent;background:transparent;}
.cm-dv-cc{box-sizing:border-box;width:100%;height:76px;flex:0 0 76px;display:flex;align-items:center;justify-content:center;padding:6px 18px;background:#000;color:#fff;text-align:center;font:700 19px/1.3 'Inter',sans-serif;overflow:hidden;}
.cm-dv-nocc .cm-dv-cc{display:none;}
.cm-dv-nocc .cm-dv-stage video{max-height:calc(100vh - 110px);}
.cm-dv-head h2{min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
.cm-dv-ctl{display:inline-flex;align-items:center;gap:6px;height:40px;padding:0 12px;border:2px solid #fff;border-radius:20px;background:transparent;color:#fff;font:700 16px/1 'Inter',sans-serif;cursor:pointer;white-space:nowrap;}
.cm-dv-ctl:hover,.cm-dv-ctl:focus-visible,.cm-dv-ctl:focus-within{border-color:#DB8437;outline:none;}
button.cm-dv-ctl:hover,button.cm-dv-ctl:focus-visible{background:#DB8437;}
.cm-dv-ccbtn[aria-pressed=true]{background:#fff;color:#1E2340;}
.cm-dv-rate{font:700 16px/1 'Inter',sans-serif;color:#1E2340;background:#fff;border:0;border-radius:6px;padding:4px 6px;cursor:pointer;}
.cm-dv-resume{display:inline-flex;align-items:center;gap:6px;font:700 16px/1.2 'Inter',sans-serif;color:#F0B27A;white-space:nowrap;}
.cm-dv-resume[hidden]{display:none;}
.cm-dv-resume b{color:#fff;}
.cm-dv-resume button{font:700 16px/1 'Inter',sans-serif;color:#fff;background:transparent;border:0;border-bottom:2px solid #DB8437;padding:2px 0;cursor:pointer;}
.cm-dv-box:fullscreen{width:100%;height:100%;max-height:none;border-radius:0;}
.cm-dv-box:-webkit-full-screen{width:100%;height:100%;max-height:none;border-radius:0;}
.cm-dv-isfs .cm-dv-stage video{max-height:calc(100vh - 70px - 76px);}
.cm-dv-isfs.cm-dv-nocc .cm-dv-stage video{max-height:calc(100vh - 70px);}
.cm-dv-isfs .cm-dv-chapters{max-height:calc(100vh - 70px);}
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
@media (max-width:900px){ .cm-dv-main{grid-template-columns:minmax(0,1fr);} .cm-dv-chapters{max-height:34vh;} .cm-dv-stage video{max-height:52vh;}
  .cm-dv-head{flex-wrap:wrap;} .cm-dv-head h2{flex-basis:100%;order:-1;white-space:normal;} .cm-dv-cc{height:64px;flex-basis:64px;font-size:16px;} }
`;
document.head.appendChild(css);
})();
