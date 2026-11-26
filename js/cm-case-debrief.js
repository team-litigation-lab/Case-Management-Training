/* ============================================================
   🎬 THE CASE DEBRIEF: on Case Flow Day 5, and only there
   A narrated debrief of John Doe VS Robert Smith once the five days are done: the money trail, the traps planted in
   the documents, the mistakes files make and whose decision each one is, so a trainee finds what went wrong in their
   own file and fixes it at the source.
   · It is on Case Flow Day 5's card, beside ▶ Video: 🎬 Case Debrief opens it in a viewer over the page (✕ or Esc
     closes it). It is not on the Case Profile, nor on any other day.
   · The deck is build/debrief/debrief.json, drawn by build/debrief/render.cjs (decks/debrief/NN.webp) and recorded by
     build/videoslide/make_video.py (decks/debrief/debrief-narrated.mp4 and its .vtt); build/videoslide/deck-slides.cjs
     lists it in js/cm-deck-slides.js as CM_DEBRIEF_VIDEO, one chapter per slide.
   · 🔒 for a trainee until the trainer unlocks Case Flow Day 5's video (Admin → 🔓 Open Lessons → 🎬 Unlock Videos, for a
     batch, all batches or one trainee: js/cm-day-video.js's unlocked()): one unlock opens both. Until then the card says
     "🔒 Case Debrief", and the viewer says why and when it opens, giving nothing away. A trainer, and a trainer's
     👁 Trainee view, always has it open.
   · On the card it shares one row with ▶ Video: the two side by side (.cdb-pair).
   · The player, as the day videos' (js/cm-day-video.js): the captions in a strip under the picture (CC), speed 0.75× to
     2×, ⏪ / ⏩ 10 s, ⛶ Full screen, the slides beside it as chapters, and the trainee's place kept (personal key
     "case-debrief": "Resumed at m:ss · Start over"). The <video> outlives the page's redraws, so a redraw never stops
     it, and the portal doesn't reload itself for an update while it plays.
   · Until the video is recorded (no start times in debrief.json), the viewer steps through the slides and their script.
   Loads after js/cm-day-card-format.js and js/lsh-card-frame.js (its button goes under ▶ Video in the card's grid) and
   js/cm-deck-slides.js.
   ============================================================ */
(function(){
"use strict";
const V = window.CM_DEBRIEF_VIDEO;
if(!V || !Array.isArray(V.chapters) || !V.chapters.length || typeof state === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const PREF = "case-debrief", RATES = [0.75, 1, 1.25, 1.5, 1.75, 2], CH = V.chapters;
if(typeof registerPersonalKeys === "function") registerPersonalKeys([PREF]);
const mmss = t => { t = Math.max(0, Math.floor(t)); return Math.floor(t / 60) + ":" + String(t % 60).padStart(2, "0"); };

/* ---------- who sees it ---------- */
const cfDays = () => (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d && d.cf).sort((a, b) => a.cf.n - b.cf.n);
const gate = () => { const ds = cfDays(); return ds.find(d => d.cf.n === Number(V.opensAfter || 5)) || ds[ds.length - 1] || null; };
const trainer = () => !!(state.isAdmin || state.adminPreview);
function isOpen(){ if(trainer()) return true; const g = gate(); return !!(g && window.cmDayVideo && typeof cmDayVideo.unlocked === "function" && cmDayVideo.unlocked(g.id)); }
const mode = () => !isOpen() ? "locked" : V.recorded ? "video" : "slides";
const gateN = () => { const g = gate(); return g ? g.cf.n : Number(V.opensAfter || 5); };

/* ---------- the trainee's place, speed and CC (as the day videos keep theirs) ---------- */
let prefs = {pos: 0, slide: 0, rate: 1, cc: true, at: 0}, loaded = false, reading = null, early = {}, lastLocal = 0, lastCloud = 0;
const clean = p => { p = p && typeof p === "object" ? p : {};
  return {pos: Math.max(0, Number(p.pos) || 0), slide: Math.min(CH.length - 1, Math.max(0, Number(p.slide) || 0)), rate: RATES.includes(Number(p.rate)) ? Number(p.rate) : 1, cc: p.cc !== false, at: Number(p.at) || 0}; };
const readLocal = () => { try{ return JSON.parse(localStorage.getItem("lsh_" + PREF) || "null"); }catch(e){ return null; } };
function readPrefs(){
  if(loaded) return Promise.resolve(prefs);
  return reading || (reading = (async () => {
    let a = null; try{ a = typeof storeGet === "function" ? await storeGet(PREF) : null; }catch(e){}
    const b = readLocal();   // the 5-second saves go straight to this device: whichever is newer
    prefs = Object.assign(clean(b && (!a || (b.at || 0) > (a.at || 0)) ? b : a), early); loaded = true; reading = null;
    if(Object.keys(early).length) saveCloud();
    return prefs;
  })());
}
function saveLocal(){ prefs.at = Date.now(); lastLocal = prefs.at; try{ localStorage.setItem("lsh_" + PREF, JSON.stringify(prefs)); }catch(e){} }
function saveCloud(){ saveLocal(); lastCloud = Date.now(); if(typeof storeSet === "function") Promise.resolve(storeSet(PREF, prefs)).catch(() => {}); }
function keepPlace(force){
  if(!player || !loaded) return;
  const t = player.currentTime || 0, d = player.duration;
  prefs.pos = t < 5 || (d > 0 && t > d - 10) ? 0 : Math.floor(t);
  if(force || Date.now() - lastCloud > 60000) saveCloud(); else if(Date.now() - lastLocal > 5000) saveLocal();
}

/* ---------- the viewer's content ---------- */
const tabEl = () => document.querySelector("#cdb-ov .cdb-tab");
function lockedHtml(){
  const n = gateN();
  return `<div class="cpx-tab cdb-tab cdb-locked" data-cpx="debrief">
    <section class="cdb-lock"><div class="cdb-lock-ic" aria-hidden="true">🔒</div><div>
      <h3>🎬 The Case Debrief opens when your trainer unlocks it</h3>
      <p><b>Why it's locked.</b> It's a narrated debrief of John Doe's whole file: the money trail, the traps planted in the documents, and the mistakes files make. It gives away the answers to every day's work, so it waits until your own file is done.</p>
      <p><b>When it opens.</b> Here, on Case Flow Day ${E(n)}'s card, when your trainer unlocks it with the day's ▶ Video, for your batch or for you. It opens within a minute of that.</p>
      <p class="cdb-lock-then"><b>Then:</b> open your CMS file, Net Sheet and Lien Tracker beside it and compare them, figure by figure.</p>
    </div></section></div>`;
}
const list = () => `<nav class="cdb-side" aria-label="The debrief's slides"><h4>Slides <small>${CH.length}</small></h4><ol class="cdb-list">${CH.map((c, i) =>
  `<li><button type="button" data-i="${i}" title="${E(c.page + ". " + c.title)}" onclick="cmCaseDebrief.seek(${i})"><span class="cdb-n">${E(c.page)}</span><span class="cdb-t">${E(c.title)}</span>${c.t != null ? `<span class="cdb-at">${mmss(c.t)}</span>` : ""}</button></li>`).join("")}</ol></nav>`;
const sub = () => trainer() ? `Trainees: 🔒 until you unlock Case Flow Day ${gateN()}'s video` : "John Doe VS Robert Smith";
function videoHtml(){
  return `<div class="cpx-tab cdb-tab cdb-video-mode" data-cpx="debrief">
    <div class="cdb-bar"><h3>🎬 Case Debrief <span>${E(sub())}</span></h3>
      <span class="cdb-resume" hidden>Resumed at <b></b> · <button type="button" onclick="cmCaseDebrief.startOver()">↺ Start over</button></span>
      <button type="button" class="cdb-ctl" onclick="cmCaseDebrief.skip(-10)" title="Back 10 seconds" aria-label="Back 10 seconds">⏪ 10s</button>
      <button type="button" class="cdb-ctl" onclick="cmCaseDebrief.skip(10)" title="Forward 10 seconds" aria-label="Forward 10 seconds">10s ⏩</button>
      <label class="cdb-ctl cdb-speed">Speed <select class="cdb-rate" aria-label="Playback speed" onchange="cmCaseDebrief.setRate(this.value)">${RATES.map(r => `<option value="${r}">${r}×</option>`).join("")}</select></label>
      ${V.captions ? `<button type="button" class="cdb-ctl cdb-ccbtn" aria-pressed="true" onclick="cmCaseDebrief.setCc(!cmCaseDebrief.prefs().cc)">CC</button>` : ""}
      <button type="button" class="cdb-ctl cdb-fs" aria-pressed="false" onclick="cmCaseDebrief.fullscreen()" title="Fill the screen with the video and its captions">⛶ Full screen</button></div>
    <div class="cdb-main"><div class="cdb-stage"><div class="cdb-vslot"></div>${V.captions ? `<div class="cdb-cc"></div>` : ""}</div>${list()}</div></div>`;
}
function slidesHtml(){
  return `<div class="cpx-tab cdb-tab cdb-slides-mode" data-cpx="debrief">
    <div class="cdb-bar"><h3>🎬 Case Debrief <span>${E(sub())}</span></h3>
      <span class="cdb-wait">🎙 The narrated video is on its way: step through the slides and their script</span>
      <button type="button" class="cdb-ctl" onclick="cmCaseDebrief.go(-1)" aria-label="Previous slide">‹ Previous</button>
      <span class="cdb-count" aria-live="polite"></span>
      <button type="button" class="cdb-ctl" onclick="cmCaseDebrief.go(1)" aria-label="Next slide">Next ›</button>
      <button type="button" class="cdb-ctl cdb-fs" aria-pressed="false" onclick="cmCaseDebrief.fullscreen()" title="Fill the screen with the slide and its script">⛶ Full screen</button></div>
    <div class="cdb-main"><div class="cdb-stage"><figure class="cdb-pic" title="Click for the next slide (← and → step too)" onclick="cmCaseDebrief.go(1)"><img alt=""></figure><div class="cdb-script"></div></div>${list()}</div></div>`;
}
function tabHtml(){ const m = mode(); return m === "locked" ? lockedHtml() : m === "video" ? videoHtml() : slidesHtml(); }

/* ---------- on Case Flow Day 5's card: 🎬 Case Debrief (🔒 for a trainee until the day is complete) ---------- */
const isGateDay = d => { const g = gate(); return !!(d && g && d.id === g.id); };
if(typeof moduleCard === "function"){
  const __card = moduleCard;
  moduleCard = window.moduleCard = function(d){
    const html = __card.apply(this, arguments);
    if(!isGateDay(d)) return html;
    const on = isOpen();
    const btn = `<button type="button" class="btn btn-ghost btn-sm cm-dcf-video cdb-btn cdb-pair${on ? "" : " cdb-btn-locked cm-dv-locked"}" onclick="event.stopPropagation(); cmCaseDebrief.open()"
      title="${on ? "The Case Debrief: the whole file talked through, its money trail, its traps and the mistakes to look for in your own file" : "The Case Debrief opens when your trainer unlocks it"}">${on ? "🎬 Case Debrief" : "🔒 Case Debrief"}</button>`;
    // beside ▶ Video, on one row of the card's grid (js/cm-day-card-format.js and js/lsh-card-frame.js have laid the card out by now)
    const t = document.createElement("template"); t.innerHTML = String(html).trim();
    const card = t.content.firstElementChild; if(!card) return html;
    const vid = card.querySelector(".cm-dv-btn, .cm-dcf-video");
    if(vid){ vid.classList.add("cdb-pair", "cdb-pair-l"); vid.insertAdjacentHTML("afterend", btn); }
    else (card.querySelector(".mc-grid") || card).insertAdjacentHTML("beforeend", btn);
    return card.outerHTML;
  };
}
/* the viewer, over the page */
function open(){
  close(true);
  const o = document.createElement("div");
  o.id = "cdb-ov"; o.className = "overlay cdb-ov"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Case Debrief");
  o.innerHTML = `<div class="cdb-ov-box"><button type="button" class="cdb-x" onclick="cmCaseDebrief.close()" aria-label="Close the Case Debrief">✕</button>${tabHtml()}</div>`;
  o.addEventListener("mousedown", ev => { if(ev.target === o) close(); });
  document.body.appendChild(o);
  cur = -1; mount();
}
function close(quiet){
  const o = document.getElementById("cdb-ov"); if(!o) return;
  if(player){ try{ player.pause(); }catch(e){} keepPlace(true); }
  if(fsEl()){ const f = document.exitFullscreen || document.webkitExitFullscreen; if(f){ try{ const p = f.call(document); if(p && p.catch) p.catch(() => {}); }catch(e){} } }
  o.remove();
}

/* ---------- the player: one <video>, kept across the page's redraws ---------- */
let player = null, cur = -1, resumed = null, nativeFs = false;
const track = () => player && player.textTracks && player.textTracks[0];
function makePlayer(){
  const v = document.createElement("video");
  v.className = "cdb-video"; v.controls = true; v.preload = "metadata"; v.playsInline = true;
  v.setAttribute("playsinline", ""); v.setAttribute("controlslist", "nofullscreen"); v.setAttribute("disablepictureinpicture", "");
  if(V.poster) v.poster = V.poster;
  if(V.captions){ const t = document.createElement("track"); t.kind = "captions"; t.srclang = "en"; t.label = "English"; t.src = V.captions; t.default = true; v.appendChild(t);
    t.addEventListener("load", () => { const tr = track(); if(tr && !nativeFs && tr.mode !== "hidden") tr.mode = "hidden"; showCc(); }); }
  v.src = V.src;
  v.addEventListener("timeupdate", () => { mark(); keepPlace(false); });
  v.addEventListener("seeked", () => { mark(); showCc(); if(loaded){ keepPlace(false); saveLocal(); } });
  v.addEventListener("play", () => { if(resumed != null && Math.abs((v.currentTime || 0) - resumed) > 2) hideResume(); });
  v.addEventListener("pause", () => keepPlace(true));
  v.addEventListener("ended", () => { if(loaded){ prefs.pos = 0; saveCloud(); } });
  v.addEventListener("loadedmetadata", () => rateUi());
  v.addEventListener("dblclick", ev => { ev.preventDefault(); fullscreen(); });
  const tl = v.textTracks;
  if(tl){
    const hook = tr => { if(tr && !tr.__cdbCue){ tr.__cdbCue = true; tr.addEventListener("cuechange", showCc); } };
    hook(tl[0]); tl.addEventListener("addtrack", () => hook(track()));
    // the browser's own CC menu: "showing" means captions wanted (in the strip), "disabled" means none
    tl.addEventListener("change", () => { const tr = track(); if(!tr) return;
      if(nativeFs){ if(tr.mode === "showing" && !prefs.cc) setCc(true); else if(tr.mode !== "showing" && prefs.cc) setCc(false); return; }
      if(tr.mode === "showing"){ tr.mode = "hidden"; if(!prefs.cc) setCc(true); }
      else if(tr.mode === "disabled"){ tr.mode = "hidden"; if(prefs.cc) setCc(false); } });
  }
  // iPhone: only the video itself goes full screen; its own captions show there, the strip again after
  v.addEventListener("webkitbeginfullscreen", () => { nativeFs = true; const tr = track(); if(tr && prefs.cc) tr.mode = "showing"; });
  v.addEventListener("webkitendfullscreen", () => { nativeFs = false; const tr = track(); if(tr) tr.mode = "hidden"; showCc(); });
  return v;
}
function chapterAt(t){ let i = 0; while(i + 1 < CH.length && CH[i + 1].t != null && CH[i + 1].t <= t + 0.05) i++; return i; }
function mark(force){
  const t = tabEl(); if(!t) return;
  const i = mode() === "video" ? (player ? chapterAt(player.currentTime || 0) : 0) : prefs.slide;
  if(i === cur && !force) return; cur = i;
  t.querySelectorAll(".cdb-list button").forEach(b => { if(Number(b.dataset.i) === i) b.setAttribute("aria-current", "true"); else b.removeAttribute("aria-current"); });
  const ol = t.querySelector(".cdb-list"), b = ol && ol.querySelector(`button[data-i="${i}"]`);
  if(ol && b){ const top = b.getBoundingClientRect().top - ol.getBoundingClientRect().top + ol.scrollTop, h = ol.clientHeight;   // the current slide in view, in the list only (never the page)
    if(top < ol.scrollTop || top + b.offsetHeight > ol.scrollTop + h) ol.scrollTop = Math.max(0, top - h / 3); }
}
const ccText = c => E(String(c.text || "").replace(/<[^>]*>/g, "")).replace(/\n/g, "<br>");
function showCc(){
  const t = tabEl(), box = t && t.querySelector(".cdb-cc"), tr = track(); if(!box) return;
  let cues = [];
  if(tr){ cues = tr.activeCues ? [...tr.activeCues] : [];
    if(!cues.length && tr.cues){ const at = player.currentTime; cues = [...tr.cues].filter(c => c.startTime <= at && c.endTime > at); } }   // before it plays, or just after a jump
  const html = cues.map(ccText).join("<br>");
  if(box.innerHTML !== html) box.innerHTML = html;
}
function rateUi(){
  if(player){ player.defaultPlaybackRate = prefs.rate; player.playbackRate = prefs.rate; }
  const s = document.querySelector(".cdb-tab .cdb-rate"); if(s && Number(s.value) !== prefs.rate) s.value = String(prefs.rate);
}
function ccUi(){
  const t = tabEl(); if(!t) return;
  t.classList.toggle("cdb-nocc", !prefs.cc || !t.querySelector(".cdb-cc"));
  const b = t.querySelector(".cdb-ccbtn"); if(b){ b.setAttribute("aria-pressed", prefs.cc ? "true" : "false"); b.title = prefs.cc ? "Hide the captions" : "Show the captions"; }
}
function hideResume(){ resumed = null; const n = document.querySelector(".cdb-tab .cdb-resume"); if(n) n.hidden = true; }
function resumeUi(){ const n = document.querySelector(".cdb-tab .cdb-resume"); if(!n) return;
  n.hidden = resumed == null; if(resumed != null) n.querySelector("b").textContent = mmss(resumed); }
function slideUi(){
  const t = tabEl(); if(!t) return;
  const i = prefs.slide, c = CH[i], img = t.querySelector(".cdb-pic img"), sc = t.querySelector(".cdb-script"), n = t.querySelector(".cdb-count");
  if(img && img.getAttribute("src") !== c.img){ img.src = c.img; img.alt = `Slide ${c.page}: ${c.title}`; }
  if(sc){ sc.innerHTML = `<b>${E(c.page)}. ${E(c.title)}</b> ${E(c.notes || "")}`; sc.scrollTop = 0; }
  if(n) n.textContent = `${i + 1} / ${CH.length}`;
  t.querySelectorAll(".cdb-bar .cdb-ctl[aria-label='Previous slide'], .cdb-bar .cdb-ctl[aria-label='Next slide']").forEach(b => {
    b.disabled = /Previous/.test(b.getAttribute("aria-label")) ? i <= 0 : i >= CH.length - 1; });
  mark(true);
}

/* after every redraw: the player back in its slot (or paused, its place kept, when the tab is gone) */
function mount(){
  const t = tabEl(), m = t ? mode() : null;
  if(m !== "video"){
    if(player && player.isConnected === false){ try{ player.pause(); }catch(e){} keepPlace(true); }
    if(m === "slides"){ slideUi(); if(!loaded) readPrefs().then(() => slideUi()); }
    return;
  }
  const slot = t.querySelector(".cdb-vslot"); if(!slot) return;
  const first = !player;
  if(first) player = makePlayer();
  if(player.parentNode !== slot) slot.appendChild(player);
  const tr = track(); if(tr && !nativeFs && tr.mode !== "hidden") tr.mode = "hidden";
  cur = -1; ccUi(); rateUi(); resumeUi(); mark(true); showCc();
  // where this trainee left off, with their speed and CC choice (read fresh: it may have come from another device)
  const resume = () => { if(prefs.pos >= 5 && player.currentTime < 1){ player.currentTime = prefs.pos; resumed = prefs.pos; resumeUi(); } };
  if(first && loaded) resume();
  else if(!loaded) readPrefs().then(() => { ccUi(); rateUi(); if(first) resume(); mark(true); showCc(); });
}
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ mount(); }catch(e){} return r; };
}

/* ---------- the controls ---------- */
function seek(i){
  i = Math.max(0, Math.min(CH.length - 1, Number(i) || 0));
  if(mode() === "slides"){ prefs.slide = i; if(loaded) saveCloud(); else early.slide = i; slideUi(); return; }
  if(!player || CH[i].t == null) return;
  player.currentTime = CH[i].t + 0.05; hideResume(); mark(); showCc(); if(loaded) keepPlace(true);
  const p = player.play(); if(p && p.catch) p.catch(() => {});
}
const go = d => seek((mode() === "slides" ? prefs.slide : Math.max(cur, 0)) + d);
function skip(sec){
  if(!player) return;
  const d = player.duration, to = Math.max(0, (player.currentTime || 0) + sec);
  player.currentTime = d > 0 ? Math.min(to, Math.max(0, d - 0.5)) : to;
  hideResume(); mark(); showCc(); if(loaded) keepPlace(true);
}
function setRate(r){ r = Number(r); if(!RATES.includes(r)) return; prefs.rate = r; if(loaded) saveCloud(); else early.rate = r; rateUi(); }
function setCc(on){ prefs.cc = !!on; if(loaded) saveCloud(); else early.cc = prefs.cc; ccUi(); }
function startOver(){
  if(!player) return;
  player.currentTime = 0; prefs.pos = 0; if(loaded) saveCloud(); hideResume(); mark(); showCc();
  const p = player.play(); if(p && p.catch) p.catch(() => {});
}
const fsEl = () => document.fullscreenElement || document.webkitFullscreenElement || null;
function fullscreen(){
  const t = tabEl(), box = t && t.querySelector(".cdb-stage"); if(!box) return;
  if(fsEl()){ const f = document.exitFullscreen || document.webkitExitFullscreen; if(f){ try{ const p = f.call(document); if(p && p.catch) p.catch(() => {}); }catch(e){} } return; }
  const goFs = box.requestFullscreen || box.webkitRequestFullscreen;
  if(goFs){ try{ const p = goFs.call(box); if(p && p.catch) p.catch(() => { if(player && player.webkitEnterFullscreen) player.webkitEnterFullscreen(); }); }catch(e){} }
  else if(player && player.webkitEnterFullscreen) player.webkitEnterFullscreen();
}
function onFs(){
  const t = tabEl(); if(!t) return;
  const on = !!fsEl() && t.contains(fsEl()), b = t.querySelector(".cdb-fs");
  t.classList.toggle("cdb-isfs", on);
  if(b){ b.textContent = on ? "🗗 Exit full screen" : "⛶ Full screen"; b.setAttribute("aria-pressed", on ? "true" : "false"); }
}
document.addEventListener("fullscreenchange", onFs); document.addEventListener("webkitfullscreenchange", onFs);
document.addEventListener("keydown", ev => {
  // Esc leaves our full screen (as the day videos' viewer does), wherever the browser hands the key to the page; out of it, Esc closes the viewer
  if(ev.key === "Escape" && fsEl() && tabEl() && tabEl().contains(fsEl())){ ev.preventDefault(); fullscreen(); return; }
  if(ev.key === "Escape" && document.getElementById("cdb-ov")){ ev.preventDefault(); close(); return; }
  // ← / → step through the slides while the slides are on screen (not while typing)
  if(mode() !== "slides" || !tabEl() || document.querySelector(".overlay:not(.cdb-ov)") || ev.altKey || ev.ctrlKey || ev.metaKey) return;
  const at = ev.target, typing = at && at.closest && at.closest("input, textarea, select, [contenteditable]");
  if(typing || (ev.key !== "ArrowLeft" && ev.key !== "ArrowRight")) return;
  ev.preventDefault(); go(ev.key === "ArrowLeft" ? -1 : 1);
});
window.addEventListener("pagehide", () => keepPlace(true));
document.addEventListener("visibilitychange", () => { if(document.visibilityState === "hidden") keepPlace(true); });
// the portal's own update never reloads the page under a debrief that is playing
if(typeof window.updateIsSafe === "function"){
  const __safe = window.updateIsSafe;
  window.updateIsSafe = function(){ if(player && player.isConnected && !player.paused && !player.ended) return false; return __safe.apply(this, arguments); };
}

window.cmCaseDebrief = {isOpen, mode, gate, open, close, seek, go, skip, setRate, setCc, startOver, fullscreen, showCc, mount, PREF, RATES,
  prefs: () => prefs, player: () => player};

/* ---------- the look: the course's navy and orange, type bold and 16px or more ---------- */
if(!document.getElementById("cdb-css")){
  const st = document.createElement("style"); st.id = "cdb-css";
  st.textContent = `
/* the viewer: the whole window, less a margin; ✕ in its corner */
.cdb-ov{position:fixed;inset:0;z-index:1000;display:flex;align-items:center;justify-content:center;padding:16px;background:rgba(15,19,38,.72);}
.cdb-ov-box{position:relative;width:min(1600px,100%);height:min(940px,100%);display:flex;flex-direction:column;background:#F7F8FB;border-radius:16px;box-shadow:0 18px 48px rgba(0,0,0,.4);overflow:hidden;}
.cdb-x{position:absolute;top:10px;right:12px;z-index:2;width:40px;height:40px;border:2px solid #1E2340;border-radius:50%;background:#fff;color:#1E2340;font:800 18px/1 'Inter',sans-serif;cursor:pointer;}
.cdb-x:hover,.cdb-x:focus-visible{background:#DB8437;border-color:#DB8437;color:#fff;outline:none;}
.cdb-ov .cdb-tab{flex:1 1 auto;min-height:0;display:flex;flex-direction:column;gap:10px;padding:12px 64px 14px 16px;font-size:16px;overflow:hidden;}
.cdb-btn-locked{opacity:.85;}
/* Day 5's card: ▶ Video and 🎬 Case Debrief share one row, half each (beats js/cm-day-card-format.js's full-width Video) */
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video.cdb-pair{grid-column:auto / span 1 !important;white-space:nowrap;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video.cdb-pair-l{grid-column:1 / 2 !important;border-right:1px solid #9CA3B8 !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video.cdb-pair:not(.cdb-pair-l){grid-column:2 / 3 !important;}
.cdb-tab, .cdb-tab *{font-weight:700;}
.cdb-bar{flex:none;display:flex;align-items:center;flex-wrap:wrap;gap:8px 10px;min-width:0;}
.cdb-bar h3{flex:1 1 auto;min-width:0;margin:0;display:flex;align-items:baseline;gap:10px;font:800 20px/1.2 'Fraunces',serif;color:#1E2340;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.cdb-bar h3 span{font:700 16px/1.2 'Inter',sans-serif;color:#A4470F;overflow:hidden;text-overflow:ellipsis;}
.cdb-ctl{display:inline-flex;align-items:center;gap:6px;height:36px;padding:0 12px;border:2px solid #1E2340;border-radius:18px;background:#fff;color:#1E2340;font:700 16px/1 'Inter',sans-serif;cursor:pointer;white-space:nowrap;}
button.cdb-ctl:hover,button.cdb-ctl:focus-visible{background:#DB8437;border-color:#DB8437;color:#fff;outline:none;}
button.cdb-ctl:disabled{opacity:.45;cursor:default;background:#fff;border-color:#1E2340;color:#1E2340;}
.cdb-ctl:focus-within{border-color:#DB8437;}
.cdb-ccbtn[aria-pressed=true]{background:#1E2340;color:#fff;}
.cdb-rate{font:700 16px/1 'Inter',sans-serif;color:#1E2340;background:#F1F3F8;border:0;border-radius:6px;padding:3px 4px;cursor:pointer;}
.cdb-resume{display:inline-flex;align-items:center;gap:6px;font:700 16px/1.2 'Inter',sans-serif;color:#A4470F;white-space:nowrap;}
.cdb-resume[hidden]{display:none;}
.cdb-resume b{color:#1E2340;}
.cdb-resume button{font:700 16px/1 'Inter',sans-serif;color:#1E2340;background:transparent;border:0;border-bottom:2px solid #DB8437;padding:2px 0;cursor:pointer;}
.cdb-wait{font:700 16px/1.2 'Inter',sans-serif;color:#A4470F;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;min-width:0;}
.cdb-count{font:700 16px/1 'Inter',sans-serif;color:#1E2340;min-width:4.2em;text-align:center;}
.cdb-main{flex:1 1 auto;min-height:0;display:grid;grid-template-columns:minmax(0,1fr) clamp(250px,24vw,360px);grid-template-rows:minmax(0,1fr);gap:12px;}
.cdb-stage{min-height:0;min-width:0;display:flex;flex-direction:column;background:#000;border-radius:12px;overflow:hidden;box-shadow:0 6px 18px rgba(30,35,64,.25);}
.cdb-vslot{flex:1 1 0;min-height:0;display:flex;}
.cdb-video{display:block;width:100%;height:100%;min-height:0;object-fit:contain;background:#000;}
.cdb-video::cue{color:transparent;background:transparent;}
.cdb-cc{flex:none;box-sizing:border-box;min-height:58px;display:flex;align-items:center;justify-content:center;padding:6px 16px;background:#000;color:#fff;text-align:center;font:700 18px/1.3 'Inter',sans-serif;overflow:hidden;}
.cdb-nocc .cdb-cc{display:none;}
.cdb-pic{flex:1 1 0;min-height:0;margin:0;display:flex;align-items:center;justify-content:center;background:#000;cursor:pointer;}
.cdb-pic img{display:block;max-width:100%;max-height:100%;object-fit:contain;}
.cdb-script{flex:none;max-height:34%;overflow:auto;padding:8px 16px 10px;background:#141A33;color:#fff;font:700 16px/1.45 'Inter',sans-serif;}
.cdb-script b{color:#F4B77A;}
.cdb-side{min-height:0;display:flex;flex-direction:column;border:1px solid #D7DCE7;border-radius:12px;background:#fff;overflow:hidden;}
.cdb-side h4{flex:none;margin:0;padding:8px 12px;font:800 16px/1.2 'Inter',sans-serif;color:#fff;background:#1E2340;border-bottom:3px solid #DB8437;display:flex;justify-content:space-between;}
.cdb-side h4 small{font:700 16px/1.2 'Inter',sans-serif;color:#F4B77A;}
.cdb-list{flex:1 1 auto;min-height:0;overflow:auto;list-style:none;margin:0;padding:4px;}
.cdb-list li::before{content:none !important;}
.cdb-list button{width:100%;display:flex;align-items:flex-start;gap:8px;text-align:left;padding:6px 8px;border:0;border-radius:8px;background:transparent;color:#1E2340;font:700 16px/1.25 'Inter',sans-serif;cursor:pointer;}
.cdb-list button:hover,.cdb-list button:focus-visible{background:#FFF1E2;outline:none;}
.cdb-list button[aria-current=true]{background:#1E2340;color:#fff;}
.cdb-n{flex:none;min-width:1.7em;text-align:center;border-radius:6px;background:#DB8437;color:#fff;font:800 16px/1.5 'Inter',sans-serif;}
.cdb-t{flex:1 1 auto;min-width:0;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;}
.cdb-at{flex:none;font:700 16px/1.25 'IBM Plex Mono',monospace;color:#6A7088;}
.cdb-list button[aria-current=true] .cdb-at{color:#F4B77A;}
.cdb-stage:fullscreen{border-radius:0;width:100%;height:100%;}
.cdb-stage:-webkit-full-screen{border-radius:0;width:100%;height:100%;}
.cdb-isfs .cdb-cc{min-height:76px;font-size:22px;}
.cdb-isfs .cdb-script{font-size:20px;max-height:30%;}
/* locked: why, and when it opens */
.cdb-locked{justify-content:center;}
.cdb-lock{display:flex;gap:18px;align-items:flex-start;max-width:980px;margin:0 auto;padding:16px 22px;border:2px solid #DB8437;border-radius:14px;background:#FFF8F0;}
.cdb-lock-ic{flex:none;font-size:40px;line-height:1;}
.cdb-lock h3{margin:0 0 .5em;display:flex;align-items:center;flex-wrap:wrap;gap:10px;font:800 20px/1.25 'Fraunces',serif;color:#1E2340;}
.cdb-lock p{margin:0 0 .5em;font:700 16px/1.45 'Inter',sans-serif;color:#2B3147;}
.cdb-lock p b{color:#A4470F;}
.cdb-lock .cdb-lock-then{margin:0;padding-top:.45em;border-top:1px solid #F0D2B4;}
@media (max-width:1500px){ .cdb-bar h3 span{display:none;} }
@media (max-width:900px){
  .cdb-ov{padding:0;} .cdb-ov-box{border-radius:0;height:100%;}
  .cdb-ov .cdb-tab{overflow:auto;padding-right:16px;padding-top:58px;}
  .cdb-main{grid-template-columns:minmax(0,1fr);grid-template-rows:auto auto;}
  .cdb-vslot,.cdb-pic{flex:none;aspect-ratio:16/9;}
  .cdb-side{max-height:300px;}
  .cdb-wait{white-space:normal;}
}`;
  document.head.appendChild(st);
}
})();
