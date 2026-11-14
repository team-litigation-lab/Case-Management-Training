/* ============================================================
   A day's two parts, plainly labelled wherever a day is listed.
   Every Case Flow day runs in one order (js/cm-case-flow.js buildDaySlides, CF.sequence in js/cm-case-flow-data.js):
       the Training Agenda → Part 1 · Lessons (ALL of the day's lessons, section by section)
       → Part 2 · 🔁 The Daily Loop (js/cm-day-loop.js): 📇 the Case Profile (Day 1: 👋 Meet John Doe and his Intake) →
         the day's ONE Skill Building (Day 5: the Full Application Practice) → 📁 Backup File Maintenance (required)
         → 📝 Update Your Action Plan → the
         optional side exercises, in one short 🧪 Practice Lab
       → 🎯 Ready for the Knowledge Check? (the last slide) → the Knowledge Check.
   The Training Agenda and the day's Objectives page say so themselves (js/cm-case-flow.js). This file puts the same
   labels on the three lists the page already draws, without changing what they list or what a click does:
     · 🗺 Roadmap (index.html openRoadmap): a label above the day's first lesson, and Part 2 drawn as the loop's own
       steps in order (the Case Profile, the Skill Building, the required Backup File Maintenance, the Action Plan, the
       optional side exercises in one collapsible group, the Ready check and the Learning Checks), numbered as shown;
     · the slide picker (index.html openSlideMap, "Step 12 of 83 ▾"): a label above the first lesson's slides, above
       the Practice Lab slide and above the Ready check;
     · Presenter view's "Jump to a slide" list (js/cm-updates.js, #pvJump): the same three groups; and its forward
       button, which on the day's last slide ends the presentation and opens the Knowledge Check (js/cm-case-flow.js),
       reads "Continue to Knowledge Check →" there instead of "Next →".
   It also carries the styles of the Training Agenda's two part labels.
   ============================================================ */
(function(){
"use strict";
if(typeof DAYS === "undefined" || typeof buildDaySlides !== "function") return;
const cf = d => !!(d && d.cf && Array.isArray(d.lessons));
const kindAt = (d, li) => { const l = d.lessons[li]; return l && l.cf && l.cf.block ? l.cf.block.kind : ""; };
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const count = (d, kind) => d.lessons.filter(l => l.cf && l.cf.block.kind === kind).length;
/* the three labels of a day: [icon + name, what it holds] */
function labels(d){
  const nL = count(d, "lesson"), nA = count(d, "activity"), build = !!d.cf.build;
  const loop = window.cmDayLoop ? window.cmDayLoop.agendaRows(d, {build}) : null;   // the daily loop: the same words as the Training Agenda
  if(loop) return {lessons: ["Part 1 · 📘 Lessons", `${nL} lesson${nL === 1 ? "" : "s"}, all together`], lab: [loop.label, loop.sub], kc: ["🎯 Knowledge Check", "after the Ready check, the day's last slide"]};
  return {
    lessons: ["Part 1 · 📘 Lessons", `${nL} lesson${nL === 1 ? "" : "s"}, all together`],
    lab: build ? ["Part 2 · 🏗 Full Application Practice", `build your companion case; then ${nA} optional extra activities`]
      : ["Part 2 · 🧪 Practice Lab", `all ${nA} Skill Activit${nA === 1 ? "y" : "ies"}, in one place`],
    kc: ["🎯 Knowledge Check", "after the Ready check, the day's last slide"]
  };
}
/* the part each slide of a day's deck is in: "" (the Training Agenda), "lessons", "lab", "kc" */
function partsOf(d){
  let part = "";
  return buildDaySlides(d).map(sl => {
    if(sl.type === "practiceLab" || sl.type === "companionBuild" || sl.type === "meetJohnDoe" || sl.type === "profileCheck" || sl.type === "actionPlan") part = part === "kc" ? part : "lab";
    else if(sl.type === "readyCheck" || sl.type === "closing") part = "kc";
    else if(sl.type === "topic"){ const k = kindAt(d, sl.lessonIndex); if(k === "lesson" && part === "") part = "lessons"; else if(k === "activity" && part !== "kc") part = "lab"; }
    return part;
  });
}
const labelHtml = (cls, x) => `<b>${E(x[0])}</b><span>${E(x[1])}</span>`;

/* ---------- 🗺 Roadmap ----------
   Part 1 · Lessons: the day's lessons, as index.html lists them. Part 2 · 🔁 The Daily Loop: the loop's real steps, in
   the deck's order, each one a row that opens its slide:
     👋 Meet John Doe (Day 1) / 📇 Case Profile Check-In → 🎯 the Skill Building (the day's `main` activity; Day 5 the
     🏗 Full Application Practice) → 📁 Backup File Maintenance (REQUIRED) → 📝 Update Your Action Plan → 🧪 Optional
     side exercises (N), one collapsible group → ✅ Ready for the Knowledge Check? and the ✍️ Learning Checks.
   The day's topics are numbered in the order they are shown (the Skill Building first of the activities, wherever the
   sequence lists it), so 3.9 always comes after 3.8. A loop step that is not a topic (the Case Profile, the build, the
   Action Plan, the Ready check) has an icon in place of a number. */
const stepHtml = (cls, icon, title, k, ok, on, why) => `<li class="rmx-steprow ${cls}"><button type="button" class="rmx-step${on ? " on" : ""}" ${ok ? `data-slide="${k}"` : "disabled"} title="${E(title)}${ok ? "" : " (" + why + ")"}"><span class="rmx-si" aria-hidden="true">${icon}</span><span class="rmx-tt">${E(title)}</span>${on ? `<span class="rmx-here">● here</span>` : ok ? "" : `<span class="rmx-lock">🔒</span>`}</button></li>`;
function labelRoadmap(){
  const o = document.getElementById("rmModal"); if(!o) return;
  const loop = window.cmDayLoop;
  [...o.querySelectorAll(".rmx-day")].forEach((sec, i) => {
    const d = DAYS[i]; if(!cf(d)) return;
    const ol = sec.querySelector(".rmx-topics"); if(!ol) return;
    const lis = [...ol.children].filter(li => !li.classList.contains("rmx-part") && !li.classList.contains("rmx-steprow") && !li.classList.contains("rmx-sides"));
    if(lis.length !== d.lessons.length) return;   // not the list this file knows: leave it as it is
    const L = labels(d), n = d.cf.n;
    const part = (k, x) => { const li = document.createElement("li"); li.className = "rmx-part rmx-part-" + k; li.setAttribute("role", "presentation"); li.innerHTML = labelHtml("", x); return li; };
    const byKind = k => d.lessons.map((l, li) => li).filter(li => kindAt(d, li) === k);
    const lessonsI = byKind("lesson"), actsI = byKind("activity"), checksI = byKind("check");
    const mid = loop && loop.mainId ? loop.mainId(d) : "", did = loop && loop.driveId ? loop.driveId(d) : "";
    if(!(loop && (mid || d.cf.build))){   // a day without the loop: the three labels, as before
      [[lessonsI[0], L.lessons, "lesson"], [actsI[0], L.lab, "activity"], [checksI[0], L.kc, "check"]].forEach(([li, x, k]) => { if(li != null) ol.insertBefore(part(k, x), lis[li]); });
      return;
    }
    // where the trainee may go: the rule index.html's own rows follow (a slide reached, a trainer, or a day done)
    const deck = buildDaySlides(d), p = state.progress[d.id] || {}, open = !sec.querySelector(".rmx-dayh:disabled");
    const sp = (state.slideProgress || {})[d.id];
    const reached = state.isAdmin || p.done ? Infinity : Math.max(typeof sp === "number" ? sp : 0, d.id === state.dayId ? (state.maxSlideReached || 0) : 0);
    const here = state.view === "day" && state.dayId === d.id ? (state.lessonSlide || 0) : -1;
    const at = types => deck.findIndex(sl => types.includes(sl.type));
    const row = (cls, icon, title, k) => { if(k < 0) return null;
      const t = document.createElement("template"); t.innerHTML = stepHtml(cls, icon, title, k, open && k <= reached, here === k, open ? "reach it in the slides first" : "opens when this day does").trim(); return t.content.firstChild; };
    // the topic rows: the Skill Building and the Backup File Maintenance marked; the side exercises' group says what they are
    const tag = (li, html) => { (lis[li].querySelector(".rmx-tt") || lis[li]).insertAdjacentHTML("beforeend", html); };
    lis.forEach(li => li.querySelectorAll(".dl-rm-tag").forEach(x => x.remove()));
    const mi = mid ? d.lessons.findIndex(l => l.cf.block.id === mid) : -1, di = did ? d.lessons.findIndex(l => l.cf.block.id === did) : -1;
    if(mi >= 0) tag(mi, `<small class="dl-rm-tag dl-rm-main">🎯 Skill Building</small>`);
    if(di >= 0){ const opt = lis[di].querySelector(".rmx-opt"); if(opt) opt.remove(); tag(di, `<small class="dl-rm-tag dl-rm-req">📁 Required</small>`); }
    const sidesI = actsI.filter(li => li !== mi && li !== di);
    // Part 2, in the loop's order
    const out = [part("activity", L.lab),
      row("rmx-step-profile", n === 1 ? "👋" : "📇", n === 1 ? "Meet John Doe: his Case Profile" : "Case Profile Check-In", at(["meetJohnDoe", "profileCheck"])),
      mi >= 0 ? lis[mi] : d.cf.build ? row("rmx-step-build", "🏗", "Skill Building: Build Your Companion Case", at(["companionBuild"])) : null,
      di >= 0 ? lis[di] : null,
      row("rmx-step-plan", "📝", n === 5 ? "Close Out Your Action Plan" : "Update Your Action Plan", at(["actionPlan"]))];
    if(sidesI.length){
      const g = document.createElement("li"); g.className = "rmx-sides";
      const inside = sidesI.some(li => lis[li].querySelector(".rmx-topic.on"));
      g.innerHTML = `<details${inside ? " open" : ""}><summary><span class="rmx-si" aria-hidden="true">🧪</span><span>Optional side exercises (${sidesI.length})</span></summary><ol class="rmx-subtopics"></ol></details>`;
      const sub = g.querySelector(".rmx-subtopics"); sidesI.forEach(li => sub.appendChild(lis[li]));
      out.push(g);
    }
    out.push(part("check", ["✅ Ready check · ✍️ Knowledge Check", "the day's last slide, then the check"]), row("rmx-step-ready", "✅", "Ready for the Knowledge Check?", at(["readyCheck"])));
    checksI.forEach(li => out.push(lis[li]));
    if(lessonsI.length) ol.insertBefore(part("lesson", L.lessons), lis[lessonsI[0]]);
    out.filter(Boolean).forEach(x => ol.appendChild(x));   // after the lessons, in the loop's order
    // numbered in the order shown
    let k = 0; [...ol.querySelectorAll(".rmx-tn")].forEach(x => { x.textContent = `${n}.${++k}`; });
    // a step row opens its slide (roadmapGo: in Presenter view the slides window follows)
    ol.querySelectorAll(".rmx-step[data-slide]").forEach(b => { b.onclick = () => window.roadmapGo(d.id, Number(b.dataset.slide)); });
  });
  // the row being taught, in view (index.html scrolled to it before the rows moved)
  const body = o.querySelector(".rmx-body"), mark = o.querySelector(".rmx-topic.on, .rmx-step.on") || o.querySelector(".rmx-day.here");
  if(body && mark){ const det = mark.closest("details"); if(det) det.open = true;
    body.scrollTop = Math.max(0, mark.getBoundingClientRect().top - body.getBoundingClientRect().top + body.scrollTop - body.clientHeight / 3); }
}
/* ---------- the slide picker ---------- */
function labelSlideMap(){
  const o = document.getElementById("slideMap"), d = DAYS.find(x => x.id === state.dayId); if(!o || !cf(d)) return;
  const parts = partsOf(d), L = labels(d), secs = [...o.querySelectorAll(".sm-groups > section")];
  let at = 0, last = "";
  secs.forEach(sec => {
    const n = sec.querySelectorAll(".sm-item").length, part = parts[at] || ""; at += n;
    if(!part || part === last) return; last = part;
    const h = document.createElement("p"); h.className = "sm-part sm-part-" + part; h.innerHTML = labelHtml("", L[part]);
    sec.insertBefore(h, sec.firstChild);
  });
}
/* ---------- Presenter view: on the day's last slide the forward button opens the Knowledge Check, and says so ---------- */
function labelNext(){
  const d = DAYS.find(x => x.id === state.dayId), btn = document.querySelector('button[onclick="presenterStep(1)"]'); if(!btn || !cf(d)) return;
  const last = (state.lessonSlide || 0) >= buildDaySlides(d).length - 1 && (state.presentPage || 0) >= (state.presentPages || 1) - 1;
  const want = last ? "Continue to Knowledge Check →" : "Next →";
  if(btn.textContent !== want){ btn.textContent = want; btn.title = last ? "Ends the presentation and opens the day's Knowledge Check" : ""; }
}
/* ---------- Presenter view's "Jump to a slide" ---------- */
function labelJump(){
  const sel = document.getElementById("pvJump"), d = DAYS.find(x => x.id === state.dayId);
  if(!sel || !cf(d) || sel.querySelector("optgroup")) return;
  const parts = partsOf(d), L = labels(d), opts = [...sel.options]; if(opts.length !== parts.length) return;
  const val = sel.value; let group = null, last = null;
  opts.forEach((op, i) => {
    if(parts[i] !== last){ last = parts[i]; group = document.createElement("optgroup"); group.label = parts[i] ? `${L[parts[i]][0]}: ${L[parts[i]][1]}` : "Opening"; sel.appendChild(group); }
    group.appendChild(op);
  });
  sel.value = val;
}
const wrap = (name, after) => { const f = window[name]; if(typeof f !== "function") return;
  window[name] = function(){ const r = f.apply(this, arguments); try{ after(); }catch(e){ console.warn("[flow-parts]", e); } return r; }; };
wrap("openRoadmap", labelRoadmap);
wrap("openSlideMap", labelSlideMap);
/* the Presenter console is drawn by render(): its list is grouped once it is on the page */
if(typeof MutationObserver === "function"){
  let queued = false;
  new MutationObserver(() => { if(queued || !state.presenting) return; queued = true;
    requestAnimationFrame(() => { queued = false; try{ labelJump(); labelNext(); }catch(e){ console.warn("[flow-parts]", e); } }); })
    .observe(document.body, {childList: true, subtree: true});
}

const css = document.createElement("style");
css.textContent = `
/* the Roadmap: a day's two parts, above its first lesson and its first Skill Activity */
.rmx-topics > li.rmx-part{margin:8px 0 2px;padding:4px 8px;border-radius:7px;background:#1E2340;color:#fff;display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 8px;}
.rmx-topics > li.rmx-part:first-child{margin-top:2px;}
.rmx-topics > li.rmx-part b{font:800 13px/1.3 'Inter',sans-serif;letter-spacing:.02em;}
.rmx-topics > li.rmx-part span{font:600 12px/1.3 'Inter',sans-serif;color:#F4C89A;}
.rmx-topics > li.rmx-part-activity{background:#DB8437;} .rmx-topics > li.rmx-part-activity span{color:#fff;}
.rmx-topics > li.rmx-part-check{background:#EEF0F6;color:#1E2340;} .rmx-topics > li.rmx-part-check span{color:#4A5170;}
.rmx-topics .dl-rm-tag{margin-left:6px;padding:1px 6px;border-radius:6px;background:#EEF0F6;color:#4A5170;font:700 11px/1.3 'Inter',sans-serif;white-space:nowrap;}
.rmx-topics .dl-rm-tag.dl-rm-main{background:#DB8437;color:#fff;}
.rmx-topics .dl-rm-tag.dl-rm-req{background:#1E2340;color:#fff;}
/* the Roadmap's loop steps that are not topics (the Case Profile, the build, the Action Plan, the Ready check), and the side exercises' group */
.rmx-step{display:flex;align-items:flex-start;gap:6px;width:100%;text-align:left;border:0;background:transparent;border-radius:7px;padding:4px 6px;font:700 13px/1.35 'Inter',sans-serif;color:#1E2340;cursor:pointer;}
.rmx-step:hover:not(:disabled){background:#EEF0F6;} .rmx-step.on{background:#FDF0E4;color:#8E3A0B;font-weight:800;} .rmx-step:disabled{cursor:not-allowed;color:#9AA0B4;}
.rmx-si{flex:0 0 32px;font-size:13px;line-height:1.35;}
.rmx-sides details{margin:1px 0;border:1px dashed #C9CEDC;border-radius:8px;background:#fff;}
.rmx-sides summary{display:flex;align-items:center;gap:6px;padding:4px 6px;font:700 13px/1.35 'Inter',sans-serif;color:#4A5170;cursor:pointer;list-style:none;}
.rmx-sides summary::-webkit-details-marker{display:none;}
.rmx-sides summary::after{content:"▸";margin-left:auto;color:#8A90A6;} .rmx-sides details[open] summary::after{content:"▾";}
.rmx-subtopics{list-style:none;margin:0;padding:0 2px 4px;display:flex;flex-direction:column;gap:1px;}
/* the slide picker: the same labels */
.sm-groups .sm-part{margin:2px 0 8px;padding:6px 10px;border-radius:8px;background:#1E2340;color:#fff;display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;break-after:avoid;}
.sm-groups .sm-part b{font:800 15px/1.3 var(--font-ui,'Inter',sans-serif);} .sm-groups .sm-part span{font:600 13px/1.3 var(--font-ui,'Inter',sans-serif);color:#F4C89A;}
.sm-groups .sm-part-lab{background:#DB8437;} .sm-groups .sm-part-lab span{color:#fff;}
.sm-groups .sm-part-kc{background:#EEF0F6;color:#1E2340;} .sm-groups .sm-part-kc span{color:#4A5170;}
/* the Training Agenda: Part 1 · Lessons in the first two columns, Part 2 · Practice Lab and the Knowledge Check in the third */
.cfx-agenda .cfx-ag-list.cfx-ag-two{gap:6px 12px;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li{padding-top:5px;padding-bottom:5px;}
.cfx-agenda .cfx-ag-list.cfx-ag-two .cfx-ag-n{width:34px;height:34px;font-size:16px;}   /* the label row costs a row: the rows under it are a little tighter, the titles the same size */
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label{background:none !important;border:0 !important;border-bottom:2px solid #DB8437 !important;border-radius:0 !important;padding:0 2px 3px !important;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:flex-start;gap:2px 12px;align-self:end;grid-row:1;grid-column:1 / span 2;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label b{display:inline;font:800 18px/1.2 'Poppins','Inter',sans-serif !important;color:#F4B77A;letter-spacing:.03em;text-transform:uppercase;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label span{font:700 16px/1.2 'Inter',sans-serif;color:#E8EBF3;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label ~ li.cfx-ag-label{grid-column:3;}   /* Part 2: the third column */
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-lab{grid-column:3;background:rgba(219,132,55,.24);border-color:#DB8437;}   /* the daily loop's steps, one under another */
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-kc{grid-column:3;}
`;
document.head.appendChild(css);
window.cmFlowParts = {partsOf, labels};   // .github/scripts/flow-order.cjs
})();
