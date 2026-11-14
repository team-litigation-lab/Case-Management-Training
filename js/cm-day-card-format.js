/* 🗂 EVERY DAY CARD IN DAY 1'S FORMAT
   Each Case Flow day card ends in the same buttons, in the same places, whatever the day's state:
       [ Start · Continue · Review ]          full width (the card's own button, as before)
       [ 👁 Review Score | 🔁 Retake ]         side by side
       [ ▶ Video ]                            full width, bigger than the small buttons
   • 👁 Review Score opens the recorded Knowledge Check result; with no score yet it says how to get one.
   • 🔁 Retake: Knowledge Checks take one attempt (js/cm-kc-once.js), so for a trainee it stays on the card but locked:
     "Ask your trainer about opening the next day". A trainer may retake freely.
   • ▶ Video is js/cm-day-video.js's button (▶ Video, or 🔒 Video until the trainer unlocks it). A day with no video yet
     shows "🔒 Video · coming soon".
   • ✓ Finish Training leaves the card: the Knowledge Check opens from the day's last slide.
   Loaded after js/cm-day-video.js (its button is already on the card) and before js/lsh-card-frame.js, which puts the
   buttons into the card's grid. The card's width and the top bar are not changed here. */
(function(){
"use strict";
if(typeof moduleCard !== "function") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const trainer = () => !!state.isAdmin && !state.adminPreview;
const RETAKE_LOCKED = "Ask your trainer about opening the next day";
const NO_SCORE = "No score yet: take the Knowledge Check at the end of the day's slides";
const SOON = "Video · coming soon";

const SAY = {noscore: NO_SCORE + ".", first: "Take the Knowledge Check first, at the end of the day's slides. It has one attempt.",
  locked: "One attempt only: your score is recorded. " + RETAKE_LOCKED + ".", soon: SOON + ": this day's video isn't ready yet."};
function why(k){ if(typeof toast === "function") toast(SAY[k] || ""); }
window.cmDayCard = {why};

function scoreBtn(d, prog){
  const has = prog && typeof prog.score === "number";
  return has
    ? `<button type="button" class="btn btn-ghost btn-sm cm-dcf-score" onclick="event.stopPropagation(); reviewMyScore(${d.id})" title="View your recorded score: nothing changes">👁 Review Score</button>`
    : `<button type="button" class="btn btn-ghost btn-sm cm-dcf-score cm-dcf-off" aria-disabled="true" onclick="event.stopPropagation(); cmDayCard.why('noscore')" title="${E(NO_SCORE)}">👁 Review Score</button>`;
}
function retakeBtn(d, prog){
  const has = prog && (typeof prog.score === "number" || (Array.isArray(prog.history) && prog.history.length));
  if(trainer()) return `<button type="button" class="btn btn-ghost btn-sm cm-dcf-retake" onclick="event.stopPropagation(); finishTrainingForDay(${d.id})" title="Take the Knowledge Check (trainers aren't limited to one attempt)">🔁 Retake</button>`;
  return `<button type="button" class="btn btn-ghost btn-sm cm-dcf-retake cm-dcf-off" aria-disabled="true" onclick="event.stopPropagation(); cmDayCard.why('${has ? "locked" : "first"}')" title="${E(has ? RETAKE_LOCKED : SAY.first)}">🔁 Retake</button>`;
}
const soonBtn = d => `<button type="button" class="btn btn-ghost btn-sm module-finish-btn cm-dcf-video cm-dcf-soon cm-dcf-off" aria-disabled="true" onclick="event.stopPropagation(); cmDayCard.why('soon')" title="${E(SOON)}">🔒 ${E(SOON)}</button>`;

const __card = moduleCard;
moduleCard = window.moduleCard = function(d){
  const html = __card.apply(this, arguments);
  if(!d || !d.cf) return html;
  const t = document.createElement("template"); t.innerHTML = String(html).trim();
  const card = t.content.firstElementChild; if(!card) return html;
  const start = card.querySelector(":scope > .module-start-btn"); if(!start) return html;
  const prog = (state.progress || {})[d.id] || null;
  // the video button, kept as js/cm-day-video.js made it (▶ Video or 🔒 Video); every other small button is rebuilt
  const vid = card.querySelector(".cm-dv-btn");
  if(vid) vid.remove();
  card.querySelectorAll(":scope > .module-review-row, :scope > .mc-row, :scope > .module-finish-btn").forEach(n => n.remove());
  start.insertAdjacentHTML("afterend", `<div class="module-review-row">${scoreBtn(d, prog)}${retakeBtn(d, prog)}</div>`);
  const row = card.querySelector(":scope > .module-review-row");
  if(vid){ vid.classList.add("cm-dcf-video"); vid.classList.add("module-finish-btn"); row.after(vid); }
  else row.insertAdjacentHTML("afterend", soonBtn(d));
  card.classList.add("mc-dcf");
  return card.outerHTML;
};

/* the grid lsh-card-frame.js builds: Start full width; Review Score | Retake; the Video full width and bigger.
   (Specific enough to beat js/cm-know-tools.js's three-in-a-row rule for .mc-n3.) */
const line = "#9CA3B8";
const st = document.createElement("style"); st.id = "cm-day-card-format"; st.textContent = `
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid{grid-template-columns:repeat(2,minmax(0,1fr)) !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.module-start-btn{grid-column:1 / -1 !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-score{grid-column:1 / 2 !important;border-right:1px solid ${line} !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-retake{grid-column:2 / 3 !important;border-right:0 !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video{grid-column:1 / -1 !important;border-right:0 !important;border-top:1px solid ${line} !important;
  font-size:16px !important;font-weight:800 !important;padding:13px 10px !important;letter-spacing:.01em;color:#1E2340 !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video:not(.cm-dv-locked):not(.cm-dcf-soon){background:#FFF4E8 !important;box-shadow:inset 4px 0 0 #DB8437 !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video:not(.cm-dv-locked):not(.cm-dcf-soon):hover{background:#1E2340 !important;color:#fff !important;}
html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-off{color:#5A6078 !important;background:#F7F8FB !important;cursor:help;}
@media(max-width:1600px){ html body .dash-main .module-card.mc-clean.mc-dcf.mc-dcf .mc-grid.mc-grid > button.cm-dcf-video{font-size:15px !important;padding:11px 8px !important;} }
`;
document.head.appendChild(st);
})();
