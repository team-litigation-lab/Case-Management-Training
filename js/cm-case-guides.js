/* ============================================================
   💡 CASE MANAGER'S GUIDES: a nudge at the step where points are lost, never the answer
   The owner: "throw out guides from time to time for them to manage their cases accurately but not give away
   everything; just balance it so they're ready for their own case on Day 5." So a guide is one line, on the Skill
   Activity's Your Task, at the step the rubrics and the trainers' rows show trainees most often get wrong. It says WHAT
   to check or WHERE to look. It never carries a figure, a date, a name the trainee must find, a document id or the method
   the rubric grades (each guide's `withholds` says what it keeps back, for the trainer and the check).
   They fade as the week goes on: seven on Day 1, four on Day 2, two on Day 3, one on Day 4. Day 5's companion-case build
   gets one, a pointer back to the trainee's own Day 1–4 work on John Doe's file, and nothing about their own case.
   Each guide is a "💡 Case Manager's guide" pill beside the 💡 Tip in Your Task's 🧰 Tools menu (so the slide keeps its
   three buttons and fits its screen), and on the Day 5 build, beside step 1. The pill opens a small panel: each guide
   with the step it belongs to. ✕ or Esc closes it.
   Checked by .github/scripts/case-guides.cjs.
   ============================================================ */
(function(){
"use strict";
const GUIDES = {
  // Day 1: the most help
  "d1m1-open": [
    {at: "The Conflict Check, before the matter is created",
      text: "💡 Case Manager's guide: before you click Create, ask who else the intake papers name besides the client, and how a reviewer will see later that you searched each of them first.",
      withholds: "The parties' names, the six roles, full-legal-name searching as the graded rule, and whether the check is clean"},
    {at: "Checking the draft intake record, field by field",
      text: "💡 Case Manager's guide: a colleague keyed this draft. For each field, find the paper that first recorded that fact. Where two papers disagree, ask which was made closest to the event, and cite it in your correction.",
      withholds: "Which fields are wrong (position, date of birth, report number), their correct values and which document is the primary record"},
    {at: "The Insurance checkpoint",
      text: "💡 Case Manager's guide: for each layer, ask what document confirms its limit today, and what kind of loss that coverage answers for. If nothing confirms it yet, say so on the record.",
      withholds: "The limits, the total, the order of operations, which adjuster is missing and that PIP sits outside the stack"}
  ],
  "d2m1-a1": [
    {at: "Addressing each letter",
      text: "💡 Case Manager's guide: every letter goes to a different carrier. Take its Attn line, insured and numbers from that carrier's own record, never from the letter before it. Then reread each one for what this carrier should not be told or asked.",
      withholds: "The adjusters, insureds, claim and member numbers, the name-only rule for the adverse carrier, the PD carve-out and why no UM letter asks for payment"}
  ],
  "d2m2-a1": [
    {at: "Before any LOP, and before answering a provider's payment question",
      text: "💡 Case Manager's guide: start from the Payer Order, not from the provider's request, and let the payer ledgers already on the file tell you what is still available. When a provider asks about money, check what the documents allow you to say before you answer.",
      withholds: "Which provider gets an LOP, which request is declined, the balances left and the wording of the reply"}
  ],
  "d2m2-a2": [
    {at: "Assess, and then the client's call",
      text: "💡 Case Manager's guide: your first move is to the file, not the phone. When he talks, write his words, not your label for them, and ask yourself who should hear each thing he tells you.",
      withholds: "The Step 1 review's contents, the missed dates, the notice ladder, the reason he went silent and the no-diagnosis / no-relay rule"}
  ],
  "d1m4-a2": [
    {at: "The risks band",
      text: "💡 Case Manager's guide: count any gap from the dates on the records, not from memory, and write only what the records show. Put the client's own account in his words, not yours, and leave what it means for the claim to Atty. Thorne.",
      withholds: "The gap's length, its start and end dates, his reasons and the consequences"}
  ],
  // Day 2: fewer
  "d3m1-a1": [
    {at: "The Specials audit",
      text: "💡 Case Manager's guide: line up each billed charge against a visit note, and each claimed shift against an off-work note and the employer's record. A charge no note supports comes off; a shift with no note isn't yours to drop: keep it and flag it to Atty. Thorne.",
      withholds: "The duplicate line, the audited medical total, the wage figure, which shifts lack a note and the Total Specials"},
    {at: "Answering the gap",
      text: "💡 Case Manager's guide: work from the call and interview notes already filed, not your memory of them. Give each reason its own dated document; where none exists, say so rather than stretching another one to fit.",
      withholds: "The reasons, which documents back them, the interruptions' dates and which reason stays “account only”"},
    {at: "Docketing the acceptance deadline",
      text: "💡 Case Manager's guide: the clock starts on an event the demand's own terms name. Find that event's proof in the file before you count. It isn't a document you sent.",
      withholds: "The triggering acknowledgement, its date and the deadline it produces"}
  ],
  "d2m3-a1": [
    {at: "The recorded call, when John Doe hesitates",
      text: "💡 Case Manager's guide: if he pauses, wait. Don't offer him a reason. Before you close, ask who he told and what he kept, because each reason will need a paper behind it.",
      withholds: "The four reasons and their dates, and which ones have a document"}
  ],
  // Day 3: fewer still
  "d3m4-a1": [
    {at: "Stage 1: the Lien Tracker's payables",
      text: "💡 Case Manager's guide: before a line goes on the payables, ask who already paid it and what the holder's own latest written figure says is still owed.",
      withholds: "Which lines are zero-balance, the reduced lien figures, the allocation and each stream's net"},
    {at: "Stage 3: queuing the disbursement",
      text: "💡 Case Manager's guide: list each condition and the document that proves it before you queue anything. A condition without its document isn't met yet.",
      withholds: "The conditions, the clearance and signing dates, the disbursement date and the final figures"}
  ],
  // Day 4: one
  "d4m3-a1": [
    {at: "Dates and delivery: calendaring the mediation",
      text: "💡 Case Manager's guide: verify the document that set the session against the order before you count anything off it. Then check every new date against what is already on the calendar before you save.",
      withholds: "The session date, the exchange and internal deadlines, the weekday adjustments, the fee share and any conflict"}
  ]
};
// Day 5: the companion-case build (js/cm-case-flow.js BUILD_STEPS), step 1, Read the file: only a pointer back
const BUILD = {day: 5, step: 1, at: "Step 1 of the build: reading the file",
  text: "💡 Case Manager's guide: you have done every one of these steps once, on John Doe's file. Open your own Day 1–4 work beside this case (your CMS matter, your case folder, your letters, your Case Plan) and use it as your checklist, not your answer.",
  withholds: "Everything about the trainee's own case: its parties, coverage, gap, payer order, deadlines and its Day 5 problem"};
window.CM_CASE_GUIDES = {GUIDES, BUILD};   // .github/scripts/case-guides.cjs
if(typeof document === "undefined" || typeof renderDaySlideContent !== "function") return;

const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const body = t => String(t).replace(/^💡 Case Manager's guide:\s*/, "");
function open(key){
  close();
  const list = key === "build" ? [BUILD] : (GUIDES[key] || []);
  if(!list.length) return;
  const box = document.createElement("div");
  box.className = "cm-cg-pop"; box.setAttribute("role", "dialog"); box.setAttribute("aria-label", "Case Manager's guide");
  box.innerHTML = `<button type="button" class="cm-cg-x" aria-label="Close" onclick="cmCaseGuides.close()">✕</button><h4>💡 Case Manager's guide</h4>`
    + list.map(g => `<section><b class="cm-cg-at">${E(g.at)}</b><p>${E(body(g.text))}</p></section>`).join("");
  document.body.appendChild(box);
}
function close(){ document.querySelectorAll(".cm-cg-pop").forEach(x => x.remove()); }
document.addEventListener("keydown", e => { if(e.key === "Escape") close(); });
window.cmCaseGuides = {GUIDES, BUILD, open, close};
const pill = key => `<button type="button" class="cm-cg-btn" onclick="cmCaseGuides.open('${E(key)}')" title="What to check, or where to look: never the answer">💡 Case Manager's guide</button>`;

const __content = renderDaySlideContent;
renderDaySlideContent = function(d, slide){
  const html = __content.apply(this, arguments);
  if(typeof html !== "string" || html.indexOf("cm-cg-btn") >= 0) return html;
  // the Day 5 build: inside step 1's heading (a block of its own: the pill rides on its line, so the slide keeps its height)
  if(slide && slide.type === "companionBuild" && d && d.cf && d.cf.n === BUILD.day){
    const at = html.search(/<b>1\. [^<]*<\/b>/);
    if(at < 0) return html;
    const end = html.indexOf("</b>", at);
    return html.slice(0, end) + pill("build") + html.slice(end);
  }
  // a Skill Activity's Your Task: beside its "Practices:" line, which heads the 🧰 Tools menu (js/cm-lesson-tips.js puts the
  // 💡 Tip there too); a slide without that line keeps its buttons as they are
  const l = slide && slide.type === "topic" && slide.part === 1 && d && d.lessons && d.lessons[slide.lessonIndex];
  const id = l && l.cf && l.cf.block && l.cf.block.id;
  if(!id || !GUIDES[id]) return html;
  const of = html.search(/<b class="cfx-of"[^>]*>[\s\S]*?<\/b>/);
  if(of < 0) return html;
  const end = html.indexOf("</b>", of) + 4;
  return html.slice(0, end) + pill(id) + html.slice(end);
};

const css = document.createElement("style");
css.id = "cm-case-guides";
css.textContent = `/* a small pill beside the Practices line and the 💡 Tip (the slide's own button rules would restyle it: hence !important) */
.cm-cg-btn{display:inline-flex !important;align-items:center;width:auto !important;min-width:0 !important;height:auto !important;margin:0 0 0 8px !important;vertical-align:middle;border:1px solid #DB8437 !important;background:#FFF3E8 !important;color:#7A3A0C !important;font-family:inherit;font-size:16px !important;font-weight:700 !important;line-height:1.1 !important;padding:4px 12px !important;border-radius:999px !important;cursor:pointer;box-shadow:none !important;white-space:nowrap}
.cm-cg-btn:hover{background:#FDE3CC !important}
.cm-cg-pop{position:fixed;right:22px;top:120px;z-index:1000;width:min(460px,calc(100vw - 32px));max-height:min(60vh,520px);overflow:auto;background:#fff;color:#1E2340;border:1px solid #F0C7A0;border-top:6px solid #DB8437;border-radius:12px;padding:14px 18px 12px;box-shadow:0 10px 30px rgba(30,35,64,.25);font-size:16px;font-weight:600;line-height:1.45}
.cm-cg-pop h4{margin:0 30px 8px 0;font-size:17px;font-weight:800;color:#1E2340}
.cm-cg-pop section+section{margin-top:10px;border-top:1px solid #F3E6D8;padding-top:8px}
.cm-cg-pop .cm-cg-at{display:block;font-size:16px;font-weight:800;color:#A4470F;margin-bottom:2px}
.cm-cg-pop p{margin:0}
.cm-cg-x{position:absolute;top:8px;right:10px;border:0;background:none;font-size:16px;cursor:pointer;color:#666}`;
document.head.appendChild(css);
})();
