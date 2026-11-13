/* ============================================================
   A day's two parts, plainly labelled wherever a day is listed.
   Every Case Flow day runs in one order (js/cm-case-flow.js buildDaySlides, CF.sequence in js/cm-case-flow-data.js):
       the Training Agenda → Part 1 · Lessons (ALL of the day's lessons, section by section)
       → Part 2 · Practice Lab (ONE lab that holds ALL of the day's Skill Activities, in the order their lessons were
         taught; on a build day, Day 5, the Full Application Practice and then its optional extra practice)
       → 🎯 Ready for the Knowledge Check? (the last slide) → the Knowledge Check.
   The Training Agenda and the day's Objectives page say so themselves (js/cm-case-flow.js). This file puts the same
   labels on the three lists the page already draws, without changing what they list or what a click does:
     · 🗺 Roadmap (index.html openRoadmap): a label above the day's first lesson, its first Skill Activity and its
       Learning Checks;
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
    if(sl.type === "practiceLab" || sl.type === "companionBuild") part = "lab";
    else if(sl.type === "readyCheck" || sl.type === "closing") part = "kc";
    else if(sl.type === "topic"){ const k = kindAt(d, sl.lessonIndex); if(k === "lesson" && part === "") part = "lessons"; else if(k === "activity" && part !== "kc") part = "lab"; }
    return part;
  });
}
const labelHtml = (cls, x) => `<b>${E(x[0])}</b><span>${E(x[1])}</span>`;

/* ---------- 🗺 Roadmap ---------- */
function labelRoadmap(){
  const o = document.getElementById("rmModal"); if(!o) return;
  [...o.querySelectorAll(".rmx-day")].forEach((sec, i) => {
    const d = DAYS[i]; if(!cf(d)) return;
    const lis = [...sec.querySelectorAll(".rmx-topics > li")].filter(li => !li.classList.contains("rmx-part"));
    if(lis.length !== d.lessons.length) return;   // not the list this file knows: leave it as it is
    const L = labels(d), first = {};
    d.lessons.forEach((l, li) => { const k = kindAt(d, li); if(first[k] == null) first[k] = li; });
    [["lesson", L.lessons], ["activity", L.lab], ["check", L.kc]].forEach(([k, x]) => {
      if(first[k] == null) return;
      const li = document.createElement("li"); li.className = "rmx-part rmx-part-" + k; li.setAttribute("role", "presentation"); li.innerHTML = labelHtml("", x);
      lis[first[k]].parentNode.insertBefore(li, lis[first[k]]);
    });
  });
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
/* the slide picker: the same labels */
.sm-groups .sm-part{margin:2px 0 8px;padding:6px 10px;border-radius:8px;background:#1E2340;color:#fff;display:flex;flex-wrap:wrap;align-items:baseline;gap:2px 10px;break-after:avoid;}
.sm-groups .sm-part b{font:800 15px/1.3 var(--font-ui,'Inter',sans-serif);} .sm-groups .sm-part span{font:600 13px/1.3 var(--font-ui,'Inter',sans-serif);color:#F4C89A;}
.sm-groups .sm-part-lab{background:#DB8437;} .sm-groups .sm-part-lab span{color:#fff;}
.sm-groups .sm-part-kc{background:#EEF0F6;color:#1E2340;} .sm-groups .sm-part-kc span{color:#4A5170;}
/* the Training Agenda: Part 1 · Lessons in the first two columns, Part 2 · Practice Lab and the Knowledge Check in the third */
.cfx-agenda .cfx-ag-list.cfx-ag-two{gap:8px 12px;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li{padding-top:5px;padding-bottom:5px;}
.cfx-agenda .cfx-ag-list.cfx-ag-two .cfx-ag-n{width:34px;height:34px;font-size:16px;}   /* the label row costs a row: the rows under it are a little tighter, the titles the same size */
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label{background:none !important;border:0 !important;border-bottom:2px solid #DB8437 !important;border-radius:0 !important;padding:0 2px 3px !important;display:flex;flex-wrap:wrap;align-items:baseline;justify-content:flex-start;gap:2px 12px;align-self:end;grid-row:1;grid-column:1 / span 2;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label b{display:inline;font:800 20px/1.25 'Poppins','Inter',sans-serif !important;color:#F4B77A;letter-spacing:.03em;text-transform:uppercase;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label span{font:700 17px/1.3 'Inter',sans-serif;color:#E8EBF3;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-label ~ li.cfx-ag-label{grid-column:3;}   /* Part 2: the third column */
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-lab{grid-column:3;grid-row:2;background:rgba(219,132,55,.24);border-color:#DB8437;}
.cfx-agenda .cfx-ag-list.cfx-ag-two li.cfx-ag-kc{grid-column:3;grid-row:3;}
`;
document.head.appendChild(css);
window.cmFlowParts = {partsOf, labels};   // .github/scripts/flow-order.cjs
})();
