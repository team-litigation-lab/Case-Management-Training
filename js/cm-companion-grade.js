/* ============================================================
   🤖 Day 5's companion-case build, AI graded
   The Full Application Practice (Day 5: the trainee builds the companion case their trainer assigned, js/cm-companion.js,
   on the steps of js/cm-case-flow.js BUILD_STEPS) is handed in to the AI Grader the way every Skill Building is
   (js/cm-ai-grader.js): it registers itself as an extra activity, "companion-build", in window.CM_AIG_EXTRA, with
   • a rubric made from the Day 1–4 deliverables the build applies (rubric.ai, the same format as an activity's, 60 of 100:
     the intake and the CMS, the backup file, the claims, the care plan, the decision-first note, the file complete; the
     trainer's 40 stay the trainer's review at the brainstorm, as before);
   • the build's own steps as the task, and an answer key of what a finished companion file holds;
   • what the trainee built, in their own words (the platform records none of the build: its CMS matter, folder, letters
     and note live in the tools), typed in the panel and saved in their own record ("cf-companion-build", a personal key),
     with the case assigned and the case open in the CMS; John Doe's Backup Drive is no evidence of the companion folder;
   • the companion case's own facts as the case the AI grades against (ctx), never John Doe's.
   The grade is stored and shown like any other AI grade: "cf-ai-grades" blocks["companion-build"] on the trainee's record,
   and the work log entry runRubricEvaluation writes ("Day <id> · Case Flow Day 5 · Build Your Companion Case — Skill
   Building"), which is what the 🏅 Scorecard's 🧪 Skill Activities and the trainer read.
   On the slide: the build's second slide ("the Second Half", step 7 Check your work) carries "Submit my companion case →" (trainees see Submit, never "AI Grader")
   on its ribbon (as a block's 📖 Additional Reference sits on its own), which opens the grader in a panel over the slide:
   the slide keeps its size. It is handed in with the panel's Submit → (never by itself as the panel opens: the account
   is still to be typed). Once graded, the button shows the score.
   ============================================================ */
(function(){
"use strict";
if(typeof document === "undefined" || typeof state === "undefined") return;
const ID = "companion-build";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const buildDay = () => (typeof DAYS !== "undefined" ? DAYS : []).find(d => d.cf && d.cf.build) || null;
const trainer = () => !!(state.isAdmin && !state.adminPreview);   // never in 👁 Trainee view: an admin there sees what a trainee sees

/* the rubric: the Day 1–4 deliverables a companion file is built from (AI 60, trainer 40, as every activity's) */
const RUBRIC = {
  ai: [
    ["Intake & the CMS (Day 1)", 12, "The Conflict Check on every party's full legal name before the matter is created; the parties, the insurance and the SOL calendared from the date of loss; the CMS Case ID logged"],
    ["The backup file (Day 1)", 8, "The case folder named to the standard ([Your Full Name] - [Case Name]) with the firm's nine numbered subfolders, the intake documents filed in place"],
    ["The claims set up (Day 1)", 12, "Every carrier has its Letter of Representation, a claim number and a verification status confirmed in writing; the PIP / UM/UIM Coverage Stack complete in the CMS: the recovery stack in the order this case's own coverage gives (liability first, then whichever UM/UIM layers apply to this client; none for a premises case with no auto coverage), PIP and MedPay tracked outside it"],
    ["The care plan (Day 1)", 10, "The Standard Treatment Map and the Three-Pillar Case Plan (Clinical, Functional, Subrogation Management); any treatment gap flagged with its exact dates; the Payer Order (PIP/MedPay, then private health insurance, then LOP) and whether an LOP is needed"],
    ["Decision first to Atty. Thorne (Days 1–2)", 10, "Case Notes say what is decided, what needs his call and the deadline it hangs on; facts only, no value, merits or strategy opinion (UPL)"],
    ["The file complete (Days 1–4; Day 3's Final Case Reconciliation habit)", 8, "Every document filed in the CMS and the case folder, each figure traceable to its source; nothing living only in an inbox; ready for the brainstorm"]
  ],
  trainer: [
    ["Professional judgment", 25, "At the brainstorm: knows what to do next on the file and what to route to Atty. Thorne"],
    ["UPL boundary", 15, "No value, merits or strategy opinion offered, even informally"]
  ]
};
const STEPS = ["Read the file: the client, the injuries, the coverage and the facts at intake.",
  "Open the matter in the CMS: the Conflict Check first, then the parties, the insurance and the SOL calendared from the date of loss.",
  "Build its case folder: [Your Full Name] - [Case Name], the firm's nine subfolders, the intake documents uploaded.",
  "Set up the claims: a Letter of Representation to every carrier, each claim's verification status, the PIP / UM/UIM Coverage Stack.",
  "Plan the care: the Standard Treatment Map, any treatment gap, the Payer Order, whether an LOP is needed.",
  "Note the decision to Atty. Thorne in Case Notes: what's decided, what needs his call, the deadline.",
  "Check your work: every document filed in the CMS and the folder, your CMS Case ID logged."];
const CHECKS = ["Conflict Check run on **every party's full legal name**, before the matter",
  "SOL **calendared from the date of loss**; CMS Case ID logged",
  "Case folder **named to the standard**, nine subfolders, intake documents in place",
  "**Every carrier** has an LOR, a claim number and a written verification status",
  "Standard Treatment Map with **any gap's exact dates**, the Payer Order and the LOP decision",
  "Decision-first note: **what's decided, what needs his call, by when**; no value or merits opinion"];
const KEY = "cf-companion-build";
if(typeof registerPersonalKeys === "function") registerPersonalKeys([KEY]);
let W = {}, loaded = false, saveT = null;   // {text, at}: the trainee's account of the build
async function load(force){
  if((loaded && !force) || typeof storeGet !== "function") return; loaded = true;
  try{ const v = await storeGet(KEY); W = v && typeof v === "object" ? v : {}; }catch(e){}
}
load();
if(typeof loadAll === "function"){ const __loadAll = loadAll; loadAll = async function(){ const r = await __loadAll.apply(this, arguments); await load(true); return r; }; }
if(typeof window.logout === "function"){ const __logout = window.logout; window.logout = async function(){ const r = await __logout.apply(this, arguments); W = {}; return r; }; }
const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { if(typeof storeSet === "function") storeSet(KEY, W); }, 600); };
const caseOf = () => { const a = state.assignedCase; return a && (window.CM_COMPANION_CASES || {})[a.id] ? Object.assign({id: a.id}, window.CM_COMPANION_CASES[a.id]) : null; };
window.CM_AIG_EXTRA = window.CM_AIG_EXTRA || {};
window.CM_AIG_EXTRA[ID] = {
  n: 5,
  dayId: () => (buildDay() || {}).id || 15,
  get b(){ const cc = caseOf();
    return {id: ID, kind: "activity", title: "Build Your Companion Case", rubric: RUBRIC,
      act: {scenario: cc ? `The trainee's companion case, ${cc.title} (${cc.theme}): ${cc.hook || ""}` : "The companion case the trainer assigned.",
        prompt: "Build the companion case end to end, the way John Doe's file was worked on Days 1–4: " + STEPS.map((s, i) => `${i + 1}. ${s}`).join(" "),
        tool: "CMS · Google Drive (the case folder) · Case Notes",
        output: "A companion file opened, filed and set up to the standard, with a decision-first note to Atty. Thorne",
        checkpoints: RUBRIC.ai.map(x => `${x[0]}: ${x[2]}`)}}; },
  slide: {steps: STEPS, checks: CHECKS, deliver: "A companion file **built to the standard**, Days 1–4 applied", situation: "Your companion case, built start to finish."},
  typed: true,
  prefill(){
    const cc = caseOf(), out = [];
    if(cc) out.push(["My companion case", `${cc.title} (${cc.theme})`]);
    if(W.text && String(W.text).trim()) out.push(["What I built (typed by the trainee)", W.text]);
    return out;
  },
  // the case the AI grades against: the companion file's own facts
  ctx(){
    const cc = caseOf(); if(!cc) return "";
    const facts = (cc.facts || []).join(" ");
    return `Case: ${cc.title}${cc.type ? ", " + cc.type : ""} (the trainee's companion case, not John Doe's). ${cc.client ? "Client: " + cc.client + " " : ""}`
      + `${cc.injuries ? "Injuries: " + cc.injuries + " " : ""}${cc.coverage ? "Coverage: " + cc.coverage + " " : ""}${facts ? "Facts at intake: " + facts : ""}`;
  }
};

/* ---------- the panel over the slide ---------- */
// before it is graded (or while it is checked again): the trainee's account and their own Submit; once graded: the
// grader's result, its ↻ Check again and 🔑 answer key (js/cm-ai-grader.js view). A trainer sees the grader's view.
function body(){
  const A = window.CMAIGrader;
  if(!A || typeof A.view !== "function") return `<p class="cbg-none">Submitting isn't available on this page right now.</p>`;
  if(A.showing(ID) || trainer()) return A.view(ID) || `<p class="cbg-none">Submitting isn't available on this page right now.</p>`;
  return `<label class="cbg-lab" for="cbg_text">What you built, step by step</label>
    <textarea class="cbg-a aig-box" id="cbg_text" rows="6" placeholder="The Conflict Check (each name, the result); the CMS Case ID, the parties and the SOL date; the folder's name and link; each carrier's LOR, claim number and verification; the Treatment Map, any gap's dates, the Payer Order and the LOP; your note to Atty. Thorne" oninput="cmCompanionGrade.draft(this.value)">${E(W.text || "")}</textarea>
    <div class="aig-row"><span class="aig-st" id="cfaig_st_${ID}" role="status" aria-live="polite"></span>
      <button type="button" class="btn aig-go" onclick="cmCompanionGrade.submit()" title="Hand in your companion case: it is scored and you see what to improve">Submit →</button></div>`;
}
function draft(v){ W = {text: String(v || "").slice(0, 8000), at: new Date().toISOString()}; save(); }
async function submit(){
  const el = document.getElementById("cbg_text"), v = el ? el.value : W.text;
  if(!String(v || "").trim()){ const s = document.getElementById("cfaig_st_" + ID); if(s) s.textContent = "Write what you built first: each step and where it is on the file."; return; }
  W = {text: String(v).slice(0, 8000), at: new Date().toISOString()};
  if(typeof storeSet === "function"){ clearTimeout(saveT); try{ await storeSet(KEY, W); }catch(e){} }
  if(window.CMAIGrader) await CMAIGrader.submit(ID);
  const b = document.querySelector("#cbgPanel .cbg-body"); if(b && (!window.CMAIGrader || CMAIGrader.showing(ID))) b.innerHTML = body();
}
function open(){
  close();
  const cc = caseOf();
  const o = document.createElement("div"); o.id = "cbgPanel"; o.className = "cbg-modal"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Submit your companion case");
  o.innerHTML = `<div class="cbg-box"><div class="cbg-h"><b>Submit · Build Your Companion Case</b><span>${cc ? E(cc.title) : trainer() ? "Trainer view: each trainee submits their own case" : "Your companion case"}</span>
      <button type="button" class="cbg-x" onclick="cmCompanionGrade.close()" aria-label="Close">✕</button></div>
    <p class="cbg-lead">Graded on what Days 1–4 taught, applied to your own case: the intake and the CMS, the backup file, the claims, the care plan and the decision-first note. Your trainer reviews it with you at the brainstorm too.</p>
    <div class="cbg-body">${body()}</div></div>`;
  o.addEventListener("click", e => { if(e.target === o) close(); });
  document.body.appendChild(o);
  document.addEventListener("keydown", esc, true);
  try{ const t = o.querySelector("textarea"); if(t && window.CMAIGrader) CMAIGrader.grow(t); }catch(e){}
}
function close(){ const o = document.getElementById("cbgPanel"); if(o) o.remove(); document.removeEventListener("keydown", esc, true); }
function esc(e){ if(e.key === "Escape" && document.getElementById("cbgPanel")){ e.stopPropagation(); close(); } }
// the grader repaints with render(): the panel follows (not while the trainee is typing in it)
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments);
    try{ const o = document.getElementById("cbgPanel"), b = o && o.querySelector(".cbg-body");
      const typing = document.activeElement && document.activeElement.tagName === "TEXTAREA" && b && b.contains(document.activeElement);
      if(b && !typing){ b.innerHTML = body(); const t = b.querySelector("textarea"); if(t && window.CMAIGrader) CMAIGrader.grow(t); } }catch(e){}
    return r; };
}
window.cmCompanionGrade = {ID, RUBRIC, KEY, open, close, draft, submit, text: () => W.text || "", result: () => window.CMAIGrader ? CMAIGrader.result(ID) : null};

/* ---------- the button on the build's second slide's ribbon ---------- */
function bar(){
  const r = window.CMAIGrader ? CMAIGrader.result(ID) : null;
  return `<button type="button" class="cbg-go" onclick="cmCompanionGrade.open()" title="Step 7 done? Hand your companion case in to be graded">${r ? `Graded: <b>${E(r.score)}/100</b>` : "Submit my companion case →"}</button>`;
}
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    const html = __content.apply(this, arguments);
    if(!(slide && slide.type === "companionBuild2" && d && d.cf && d.cf.build) || typeof html !== "string" || html.indexOf("cbg-go") >= 0) return html;
    return html.replace(/<div class="cfx-ribbon">(<span>[\s\S]*?<\/span>)<\/div>/, (m, span) => `<div class="cfx-ribbon cfx-ribbon-ref cbg-ribbon">${span}${bar()}</div>`);
  };
}

const st = document.createElement("style"); st.id = "cm-companion-grade"; st.textContent = `
.cbg-ribbon .cbg-go{flex:0 0 auto;font:800 16px/1 'Inter',sans-serif;padding:0 14px;border-radius:6px;border:2px solid #DB8437;background:#DB8437;color:#fff;cursor:pointer;white-space:nowrap;}
.cbg-ribbon .cbg-go b{color:#fff;}
.cbg-ribbon .cbg-go:hover,.cbg-ribbon .cbg-go:focus-visible{background:#1E2340;border-color:#1E2340;outline:none;}
.cbg-modal{position:fixed;inset:0;z-index:90;background:rgba(15,20,40,.55);display:flex;align-items:center;justify-content:center;padding:16px;}
.cbg-box{width:min(1100px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:16px;border-top:8px solid #DB8437;box-shadow:0 24px 60px -20px rgba(15,20,40,.6);padding:16px 20px 18px;}
.cbg-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin-bottom:6px;}
.cbg-h b{font:800 20px/1.3 var(--font-ui,'Inter',sans-serif);color:#1E2340;} .cbg-h span{font:700 16px/1.3 var(--font-ui,'Inter',sans-serif);color:#A4470F;}
.cbg-x{margin-left:auto;border:1px solid #D6DAE5;background:#F6F7FB;border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer;}
.cbg-lab{display:block;margin:0 0 6px;font:800 16px/1.3 var(--font-ui,'Inter',sans-serif);color:#1E2340;}
.cbg-lead{margin:0 0 12px;font:700 16px/1.4 var(--font-ui,'Inter',sans-serif);color:#2B3147;}
`;
document.head.appendChild(st);
})();
