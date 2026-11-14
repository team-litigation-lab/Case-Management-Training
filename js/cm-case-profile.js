/* ============================================================
   📇 The Case Profile: John Doe VS Robert Smith (the page was "📁 Case File")
   The client's profile page (view "clientprofile", drawn by js/cm-case-flow.js caseFlowProfile) gets:
   · a header card: the client, the case title, the date of loss, the claim's facts and the coverage, in one card;
   · 👋 Meet John Doe, the first tab, for trainees and trainers: who he is, what happened, who pays and in what order,
     the critical fact and the UPL line. It was a lesson ("Meet Your Case", d1m1-case) at the front of Day 1; the
     owner moved it out of the lesson deck and onto the client's profile;
   · 🗺 File Map: the file's life across the five days and the strategy against its coverage (the two
     introduction slides that sat after Meet Your Case);
   · on Day 1, one slide right after the last lesson (type "meetJohnDoe") that sends the trainee to Meet John Doe,
     with "← Back to Case Flow Day 1" to come back to the slide (state.cfReturn, as every page a slide opens).
   Nothing here gives away a day's answers: where John Doe sat, who ran the stop and the gap's dates are for the
   trainee to find in the documents, so they are named as things to find, not stated. Every date is read from
   CM_CASE_FLOW.case at render time, so it follows the trainee's case year (js/cm-case-dates.js).
   Loads after js/cm-case-flow.js (it fills cmCaseFlow.profileExt, which caseFlowProfile reads) and before
   js/cm-slide-places.js (which records how the Day 1 deck changed: layout 6).
   ============================================================ */
(function(){
"use strict";
const CF = window.CM_CASE_FLOW;
if(!CF || !CF.case || !window.cmCaseFlow || typeof state === "undefined" || typeof DAYS === "undefined") return;
const E = v => (typeof esc === "function" ? esc(v) : String(v == null ? "" : v).replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
const money = n => "$" + Number(n).toLocaleString("en-US");
const layers = () => (CF.case.stack || []).slice().sort((a, b) => a.order - b.order);
const cfDayOf = id => DAYS.find(d => d.id === id && d.cf);
const trainer = () => typeof isTrainer === "function" ? isTrainer() : !!state.isAdmin;

/* ---------- the header card: the client and the claim at a glance ---------- */
function head(){
  const c = CF.case, ls = layers();
  const facts = [
    ["Date of loss", c.dol],
    ["Claim", `Motor vehicle collision · ${c.no}`],
    ["Coverage", `${money(c.total)}: ${ls.map(l => `${l.tag} ${money(l.limit)}`).join(" → ")}`],
    ["Health Plan", c.health && c.health.carrier],
    ["Lead Counsel", c.counsel],
    ["SOL", c.sol]
  ].filter(x => x[1]);
  return `<div class="cpx-head"><div class="cpx-who"><span class="cf-client-k">📌 Your Client</span><b>${E(c.client.name)}</b><span class="cpx-role">${E(c.client.role)}</span></div>
    <dl class="cpx-facts">${facts.map(([k, v]) => `<div><dt>${E(k)}</dt><dd>${E(v)}</dd></div>`).join("")}</dl></div>`;
}

/* ---------- 👋 Meet John Doe: the facts of the old Meet Your Case lesson, from the case data (CF.case: time, scene,
   client.job), the one source every page reads ---------- */
const back = () => state.cfReturn && state.cfReturn.view === "day"
  ? `<button type="button" class="btn btn-primary btn-sm cpx-back" onclick="cmCaseFlow.back()">← Back to Case Flow Day ${E(state.cfReturn.n)}</button>` : "";
function meet(){
  const c = CF.case, ls = layers(), max = Math.max(1, ...ls.map(l => l.limit));
  const pip = ls.find(l => /host/i.test(l.tag));
  const facts = [
    ["🚗", "The collision", `${c.dol}${c.time ? ", " + c.time : ""}${c.scene ? ", at " + c.scene : ""}. Who ran the stop, which vehicles were involved and who was cited: read the Police Report, don't assume.`],
    ["👤", "Your client", `${c.client.name}, born ${c.client.dob}${c.client.job ? ", " + c.client.job : ""}. Where he was sitting is a fact you find in the records.`],
    ["⚖️", "The team", `Lead Counsel: ${c.counsel}. Case Manager: you.`],
    ["🩺", "Health", `${c.health ? c.health.carrier : "The Health Plan"} asserted a reimbursement right on first notice.${pip ? ` ${pip.carrier.replace(/ Insurance$/, "")} carries $5,000 PIP on the Escape.` : ""}`],
    ["⚠️", "The critical fact", "Compare the EMS Run Report's date with the first treatment record. The days between them are a Treatment Gap: record the dates and, later, John Doe's own explanation. Never judge it."],
    ["📅", "The deadline", `The statute of limitations is docketed for ${c.sol}. Every deadline counts from the date of loss.`]
  ];
  const ladder = ls.map((l, i) => `<li><span class="cpx-o">${i + 1}</span><div class="cpx-bar" style="--w:${Math.round(l.limit / max * 100)}%"><b>${E(l.tag)} · ${money(l.limit)}</b><span>${E(l.carrier)}</span></div></li>`).join("");
  return `<div class="cpx-tab cpx-meet" data-cpx="meet">
    <section class="cpx-col"><h3>👋 Meet John Doe ${back()}</h3>
      <p class="cpx-lead">Every lesson, activity and Learning Check in this course works this one file. Know its facts cold: who, when, which policies, and what is at risk.</p>
      <ul class="cpx-list">${facts.map(([i, k, t]) => `<li><span aria-hidden="true">${i}</span><div><b>${E(k)}</b> ${E(t)}</div></li>`).join("")}</ul></section>
    <section class="cpx-col"><h3>🧱 Who Pays, in Order</h3>
      <ol class="cpx-ladder">${ladder}</ol>
      <p class="cpx-total">Total available: <b>${money(c.total)}</b></p>
      <p class="cpx-hint">His position in the vehicle decides which layers he can reach. Work it out from the Police Report and the policies before you name a carrier.</p>
      <p class="cpx-upl"><b>🛑 The UPL line</b> Share facts and explain the process. What the case is worth, or what the gap does to his claim, is ${E(c.counsel)}'s call.</p></section>
  </div>`;
}

/* ---------- 🗺 His File, Day by Day: the file's life and the strategy against its coverage (the same as js/cm-case-flow.js
   caseMap and coverageMap, the old Day 1 introduction slides, kept there: change both together) ---------- */
function fileMap(){
  const c = CF.case, ls = layers(), days = DAYS.filter(d => d.cf).sort((a, b) => a.cf.n - b.cf.n);
  const marks = {1: [`Loss ${c.dol}`, `SOL ${c.sol} docketed`, "Matter opened in the CMS"],
    2: [`Care starts ${c.treatmentStart}`, "The gap to explain", "LORs to every carrier"],
    3: ["Specials audited", "Demand served", `${money(c.total)} stack negotiated`],
    4: ["Liens reduced", "Net Sheet to the cent", "Mediation & Arbitration"],
    5: ["Impasse → suit", "Discovery & deposition", "Award, then close-out"]};
  const plan = [
    [`The stack caps the recovery at ${money(c.total)}`, "Plan the care and the records so the damages prove value through all three layers."],
    ls[0] ? [`${ls[0].tag} pays first: ${money(ls[0].limit)}`, `A tender at limits opens ${ls[1] ? ls[1].tag : "the next layer"}; UM consent to settle and the subrogation waiver come before any release.`] : null,
    c.health ? [`${c.health.carrier} pays care now, recovers later`, "Its lien comes out of the settlement, so plan the reduction early."] : null,
    ["The weak point, named on Day 1", "The gap before treatment. Document the reason now, before an adjuster uses it against value."]].filter(Boolean);
  return `<div class="cpx-tab cpx-map" data-cpx="map">
    <section class="cpx-col cpx-wide"><h3>🗺 The Life of John Doe's File ${back()}</h3>
      <ol class="cpx-track">${days.map(d => `<li><span class="cpx-n">${d.cf.n}</span><b>${E(String(d.title).replace(/^Case Flow Day \d+ · /, ""))}</b><ul>${(marks[d.cf.n] || []).map(m => `<li>${E(m)}</li>`).join("")}</ul></li>`).join("")}</ol></section>
    <section class="cpx-col"><h3>🧭 The Strategy Plan</h3>
      <ol class="cpx-plan">${plan.map(([h, t]) => `<li><b>${E(h)}</b><span>${E(t)}</span></li>`).join("")}</ol></section>
  </div>`;
}

window.cmCaseFlow.profileExt = {
  head,
  tabs: [
    {id: "meet", label: "👋 Meet John Doe", title: "Meet John Doe: your client, the collision, who pays and the critical fact", html: meet},
    {id: "map", label: "🗺 File Map", title: "The life of John Doe's file across the five days, and the strategy against his coverage", html: fileMap}
  ]
};

/* the tab's text at the largest size that still fits the screen (16px down to 12px) */
function fitTab(again){
  const t = document.querySelector(".cf-file-page .cpx-tab"); if(!t) return;
  // and again once the page around it has settled (the one-screen fit sizes it a frame later)
  if(!again){ requestAnimationFrame(() => fitTab(true)); clearTimeout(state.cpxFitLate); state.cpxFitLate = setTimeout(() => fitTab(true), 200); }
  let f = 16; t.style.fontSize = f + "px";
  while(t.scrollHeight > t.clientHeight + 1 && f > 12){ f -= 0.5; t.style.fontSize = f + "px"; }
  // whenever the room it has changes (the page's one-screen fit, a window resize), once more
  if(window.ResizeObserver && !t.__cpxRO){ let h = t.clientHeight; t.__cpxRO = new ResizeObserver(() => { if(Math.abs(t.clientHeight - h) > 1){ h = t.clientHeight; fitTab(true); } }); t.__cpxRO.observe(t); }
}
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ fitTab(); }catch(e){} return r; };
}
window.addEventListener("resize", () => { clearTimeout(state.cpxFitT); state.cpxFitT = setTimeout(() => { try{ fitTab(true); }catch(e){} }, 120); });

/* Open the Case Profile on Meet John Doe, with the way back to the slide the trainee left */
window.cmCaseFlow.meetJohnDoe = function(){
  const d = cfDayOf(state.dayId);
  if(d && state.view === "day") state.cfReturn = {dayId: d.id, n: d.cf.n, slide: typeof state.lessonSlide === "number" ? state.lessonSlide : null, view: "day"};
  state.cfFileTab = "meet";
  if(typeof goto === "function") goto("clientprofile");
  window.scrollTo(0, 0);
};

/* ---------- Day 1: the slide after the lessons that sends the trainee to Meet John Doe ---------- */
const TYPE = "meetJohnDoe";
if(typeof buildDaySlides === "function"){
  const __build = buildDaySlides;
  buildDaySlides = function(d){
    const s = __build.apply(this, arguments);
    if(!d || !d.cf || d.cf.n !== 1 || s.some(sl => sl.type === TYPE)) return s;
    // right after the day's last lesson: before the Practice Lab (or, without one, after the last lesson slide)
    let at = s.findIndex(sl => sl.type === "practiceLab");
    if(at < 0){ s.forEach((sl, k) => { if(sl.type === "topic" && d.lessons[sl.lessonIndex] && d.lessons[sl.lessonIndex].cf.block.kind === "lesson") at = k + 1; }); }
    if(at > 0) s.splice(at, 0, {type: TYPE});
    return s;
  };
}
function meetSlide(d){
  const c = CF.case;
  return `<div class="topic-separator cfx-sepline">CASE FLOW DAY ${d.cf.n} &middot; MEET JOHN DOE</div>
    <div class="card lesson-card cf-card cfx cfx-deck cpx-slide">
      <div class="cfx-deck-head"><h2 class="cfx-deck-title">👋 Meet John Doe</h2></div>
      <div class="cfx-ribbon"><span>Lessons done · next, meet your client on his Case Profile</span></div>
      <div class="cfx-body"><div class="cfx-sheet">
        <p class="cpx-s-lead">You've finished today's lessons. Before the Practice Lab, meet your client, <b>${E(c.client.name)}</b>, on his Case Profile: <b>${E(c.style)}</b>.</p>
        <ul class="cpx-s-list">
          <li><span aria-hidden="true">🚗</span>What happened, and where to check it</li>
          <li><span aria-hidden="true">🧱</span>Who pays, and in what order: ${money(c.total)}</li>
          <li><span aria-hidden="true">⚠️</span>The critical fact to find in the records</li>
        </ul>
        <div class="cpx-s-go"><button type="button" class="btn btn-primary cpx-s-btn" onclick="cmCaseFlow.meetJohnDoe()">📇 Open the Case Profile: Meet John Doe</button>
          <span>Then “← Back to Case Flow Day ${d.cf.n}” brings you back here.</span></div>
      </div></div>
    </div>`;
}
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){ return slide && slide.type === TYPE && d && d.cf ? meetSlide(d) : __content.apply(this, arguments); };
}
if(typeof daySlideTitle === "function"){
  const __title = daySlideTitle;
  daySlideTitle = function(d, slide){ return slide && slide.type === TYPE && d && d.cf ? "Meet John Doe: the Case Profile" : __title.apply(this, arguments); };
}
if(typeof presenterCues === "function"){   // Presenter view: what to do on the slide
  const __cues = presenterCues;
  presenterCues = function(d, slide){
    if(!(slide && slide.type === TYPE && d && d.cf)) return __cues.apply(this, arguments);
    return `<h3>Meet John Doe</h3><div class="pn"><div class="script-block"><div class="script-head"><span>🗒 Talking points</span></div>
      <p class="script-say script-pt">• The lessons are done: now meet the client, on his Case Profile, not on a slide</p>
      <p class="script-say script-pt">• Open 📇 Case Profile → 👋 Meet John Doe on the shared screen and walk it: the collision, the team, who pays in order, the critical fact</p>
      <p class="script-say script-pt">• Say the stack out loud in order, twice: BI, Host UM, Relative UM</p>
      <p class="script-say script-pt">• Where he sat, who ran the stop and the gap's dates: they find them in the documents, in the Practice Lab</p>
      <p class="script-say script-ask">Which fact on his profile would you want confirmed by a document before your first call, and why?</p></div></div>`;
  };
}

/* ---------- the look ---------- */
if(!document.getElementById("cpx-css")){
  const st = document.createElement("style"); st.id = "cpx-css";
  st.textContent = `
.cf-file-hero .cpx-head{display:flex;flex-wrap:wrap;align-items:center;gap:6px 18px;margin:8px 0 2px;}
.cpx-who{display:flex;align-items:baseline;gap:4px 10px;flex-wrap:wrap;}
.cpx-who b{font:700 22px 'Fraunces',Georgia,serif;color:#fff;}
.cpx-who .cpx-role{color:#C9CFE0;font:600 13px var(--font-ui,'Inter',sans-serif);}
.cpx-facts{display:flex;flex-wrap:wrap;gap:6px;margin:0;}
/* on the trainer's fact tabs the columns carry the facts: the header's chips would only push them off a laptop screen */
.cf-file-page:has(.cf-file-cols) .cpx-facts{display:none;}
.cpx-facts > div{background:rgba(255,255,255,.1);border:1px solid rgba(255,255,255,.22);border-radius:10px;padding:3px 10px;}
.cpx-facts dt{font:700 10.5px 'IBM Plex Mono',monospace;letter-spacing:.06em;text-transform:uppercase;color:#F4B77A;}
.cpx-facts dd{margin:0;font:700 13.5px/1.3 var(--font-ui,'Inter',sans-serif);color:#fff;}
.cf-file-page .cpx-tab{flex:1 1 auto;min-height:0;overflow:auto;display:grid;grid-template-columns:minmax(0,1.2fr) minmax(0,1fr);gap:14px;font-size:16px;
  padding:12px 16px;border:1px solid #D7DCE7;border-radius:12px;background:rgba(255,255,255,.75);}
.cpx-map{grid-template-columns:minmax(0,1.6fr) minmax(0,1fr) !important;}
.cpx-col{min-width:0;}
.cpx-col h3{display:flex;align-items:center;gap:10px;flex-wrap:wrap;margin:0 0 .45em;font:700 1.25em 'Fraunces',serif;color:#1E2340;}
.cpx-back{font-size:13px !important;}
.cpx-lead{margin:0 0 .55em;font-weight:600;color:#2B3147;line-height:1.45;}
.cpx-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:.45em;}
.cpx-list li{display:flex;gap:.6em;align-items:flex-start;line-height:1.4;color:#1E2340;}
.cpx-list li > span{flex:0 0 auto;}
.cpx-list b{color:#1E2340;}
.cpx-ladder{list-style:none;margin:0 0 .5em;padding:0;display:flex;flex-direction:column;gap:.45em;}
.cpx-ladder li{display:flex;align-items:center;gap:.6em;}
.cpx-o{flex:0 0 auto;width:1.7em;height:1.7em;border-radius:50%;background:#DB8437;color:#fff;font-weight:800;display:flex;align-items:center;justify-content:center;}
.cpx-bar{flex:1 1 auto;min-width:0;position:relative;padding:.35em .7em;border-radius:8px;background:#EEF0F5;overflow:hidden;}
.cpx-bar::before{content:"";position:absolute;inset:0 auto 0 0;width:var(--w);background:linear-gradient(90deg,#1E2340,#3A4170);opacity:.14;}
.cpx-bar b{position:relative;display:block;color:#1E2340;}
.cpx-bar span{position:relative;font-size:.88em;color:#4A5068;font-weight:600;}
.cpx-total{margin:0 0 .5em;font-weight:600;color:#2B3147;} .cpx-total b{color:#A4470F;font-size:1.15em;}
.cpx-hint{margin:0 0 .6em;line-height:1.4;color:#2B3147;}
.cpx-upl{margin:0;padding:.55em .8em;border-left:4px solid #DB8437;background:#FFF6EC;border-radius:6px;line-height:1.4;color:#1E2340;}
.cpx-upl b{display:block;color:#A4470F;}
.cpx-track{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(5,minmax(0,1fr));gap:8px;}
.cpx-track > li{border:1px solid #D7DCE7;border-top:4px solid #1E2340;border-radius:10px;padding:.5em .6em;background:#fff;}
.cpx-track > li > b{display:block;color:#1E2340;line-height:1.3;margin:.2em 0 .3em;}
.cpx-track ul{margin:0;padding-left:1.1em;font-size:.9em;color:#2B3147;line-height:1.35;}
.cpx-n{display:inline-flex;width:1.6em;height:1.6em;border-radius:50%;background:#DB8437;color:#fff;font-weight:800;align-items:center;justify-content:center;}
.cpx-plan{margin:0;padding-left:1.3em;display:flex;flex-direction:column;gap:.5em;line-height:1.4;color:#2B3147;}
.cpx-plan b{display:block;color:#1E2340;}
@media (max-width: 900px){ .cf-file-page .cpx-tab, .cpx-map{grid-template-columns:1fr !important;} .cpx-track{grid-template-columns:1fr 1fr;} }
/* the Day 1 slide that sends the trainee to Meet John Doe */
.cpx-slide .cfx-sheet{text-align:left;display:flex;flex-direction:column;gap:clamp(12px,2.2vh,22px);}
.cpx-s-lead{margin:0;font:700 clamp(20px,3vh,28px)/1.45 'Inter',sans-serif;color:#1E2340;}
.cpx-s-list{list-style:none;margin:0;padding:0;display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px;}
.cpx-s-list li{display:flex;gap:10px;align-items:flex-start;border:1.5px solid #DDE1EA;border-left:5px solid #DB8437;background:#fff;border-radius:10px;padding:12px 14px;font:700 clamp(17px,2.4vh,22px)/1.35 'Inter',sans-serif;color:#1E2340;}
.cpx-s-list li::before, .cpx-list li::before, .cpx-ladder li::before, .cpx-track > li::before{content:none !important;display:none !important;}
.cpx-s-go{display:flex;align-items:center;gap:16px;flex-wrap:wrap;}
.cpx-s-go .cpx-s-btn{font:800 clamp(18px,2.6vh,24px) 'Inter',sans-serif;padding:14px 26px;background:#DB8437 !important;border-color:#DB8437 !important;color:#fff !important;}
.cpx-s-go span{font:700 17px 'Inter',sans-serif;color:#4A5068;}`;
  document.head.appendChild(st);
}
})();
