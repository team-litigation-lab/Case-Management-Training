/* ============================================================
   🧠 Think it through: a deck page's example, worked on John Doe's file
   The owner's Canva pages and their narrated video keep the example they were made with. Day 2's Valuation Baseline
   pages (deck pages 23–24, lesson d3m2-l2) say a client "exhausts a $10,000 PIP limit in 48 hours (like John Doe did with
   his ER and EMS bills)", bills of "$41,400 in John's case" and "Dr. Sarah Spine": none of that is John Doe's file. The
   owner: "let it be something that tests trainees' critical thinking". So the narration says what the page says
   (.github/scripts/narration-captions.cjs), and the activity that practises those pages carries a 🧠 Think it through
   prompt beside its 💡 Tip: the trainee applies the page's method to John Doe's own figures and explains one consequence,
   in their own words. Nothing narrates John Doe's figures; they are in this prompt's answer key only.
   It is graded the way every Skill Building is (js/cm-ai-grader.js): registered as an extra activity in
   window.CM_AIG_EXTRA[<id>], with its own rubric (AI 60, trainer 40, as every activity's), its steps and its answer key.
   What the trainee writes is saved in their own record ("cf-think", a personal key) and is what the grader reads.
   Checked by .github/scripts/think-through.cjs; .github/scripts/day-decks.cjs reads THINK for the pages whose narration
   keeps another file's example because a challenge here sets it against John Doe's file.
   ============================================================ */
(function(){
"use strict";
const THINK = [{
  id: "d2-think-valuation",
  activity: "d3m2-a1",            // Day 2's Skill Building that practises the Valuation Baseline pages (d3m2-l2)
  deck: {day: 2, pages: [23, 24]},
  n: 2,
  title: "Think It Through: the Valuation Baseline on John Doe's File",
  figures: "a $10,000 PIP limit exhausted in 48 hours on ER and EMS bills, $41,400 in medical bills, and an EMC finding by Dr. Sarah Spine",
  situation: "The slide's example uses a **$10,000 PIP limit gone in 48 hours**, **$41,400** in bills and **Dr. Sarah Spine's EMC finding**. Work them out on John Doe's file: what changes, and why?",
  steps: [
    "From John Doe's file (the Case Documents, the CMS → Insurance and Treatment tabs), find **his** PIP: the carrier, the limit, the first bill it paid and when it ran out; his audited Specials; and whether his state has an EMC rule.",
    "Apply the page's two tests, **speed of exhaustion** and **Specials as the anchor**, and its EMC point to those figures: say what each one shows on his file.",
    "Explain **one consequence** for the demand Atty. Thorne sends, in your own words: what the Case Manager hands him as the anchor, and why the page's example would mislead it."
  ],
  checks: [
    "Spots that the page's example (**$10,000 PIP in 48 hours**, **$41,400**, **Dr. Sarah Spine**, ER and EMS bills) is **not John Doe's file**",
    "His PIP: **Harbor Point, $5,000** (HP-26-7741), paid in date order from his **first visit, urgent care 02/20/2026**, exhausted **06/2026** by the 06/12/2026 MMI visit: about four months, not 48 hours, and no ER or EMS bills",
    "His Specials: **$16,401.40** audited ($14,817.40 medical after the duplicate is removed + $1,584.00 lost wages), the figure handed to Atty. Thorne as the anchor, not the PIP payments",
    "EMC: Riverton **has no EMC rule**, so nothing caps his $5,000 PIP at $2,500; on a Florida-rule file the finding is the physician's, never the Case Manager's to suggest",
    "**One consequence explained**: slow exhaustion is no high-severity signal on his file, so the demand rests on the audited $16,401.40 and the records; quoting the page's $41,400 or \"48 hours\" would hand Keystone a figure the file disproves",
    "Stays in role: gives Atty. Thorne the figures and the reasoning; **no opinion of what the claim is worth**"
  ],
  deliver: "John Doe's **own figures** set against the page's example, and **one consequence** explained",
  rubric: {
    ai: [
      ["Method applied", 20, "Both of the page's tests (speed of exhaustion; Specials as the anchor) and its EMC point are applied to John Doe's file, each saying what it shows there"],
      ["John Doe's figures", 15, "Harbor Point PIP $5,000, first bill urgent care 02/20/2026, exhausted 06/2026 by the MMI visit; Specials $16,401.40; Riverton has no EMC rule"],
      ["Consequence explained", 15, "One consequence for the demand, with its reason: the anchor is the audited $16,401.40 and the records, not PIP speed or the page's $41,400"],
      ["Role and UPL", 10, "The figures and reasoning go to Atty. Thorne; no valuation of the claim; the EMC finding is the physician's"]
    ],
    trainer: [
      ["Own reasoning", 25, "Explains the why in their own words at the debrief; not a recall of the page or the key"],
      ["Critical reading", 15, "Questions a teaching example before using it on a real file"]
    ]
  }
}];
window.CM_THINK = THINK;   // .github/scripts/think-through.cjs, .github/scripts/day-decks.cjs
if(typeof document === "undefined" || typeof state === "undefined") return;

const KEY = "cf-think";
if(typeof registerPersonalKeys === "function") registerPersonalKeys([KEY]);
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const hl = t => E(t).replace(/\*\*(.+?)\*\*/g, "<b>$1</b>");
let W = {}, loaded = false, saveT = null;
async function load(force){
  if((loaded && !force) || typeof storeGet !== "function") return; loaded = true;
  try{ const v = await storeGet(KEY); W = v && typeof v === "object" ? v : {}; }catch(e){}
}
load();
if(typeof loadAll === "function"){ const __loadAll = loadAll; loadAll = async function(){ const r = await __loadAll.apply(this, arguments); await load(true); return r; }; }
if(typeof window.logout === "function"){ const __logout = window.logout; window.logout = async function(){ const r = await __logout.apply(this, arguments); W = {}; return r; }; }
const save = () => { clearTimeout(saveT); saveT = setTimeout(() => { if(typeof storeSet === "function") storeSet(KEY, W); }, 600); };
const dayIdOf = n => { const d = (typeof DAYS !== "undefined" ? DAYS : []).find(x => x.cf && x.cf.n === n); return d ? d.id : n; };

window.CM_AIG_EXTRA = window.CM_AIG_EXTRA || {};
THINK.forEach(t => {
  window.CM_AIG_EXTRA[t.id] = {
    n: t.n,
    dayId: () => dayIdOf(t.n),
    b: {id: t.id, kind: "activity", title: t.title, rubric: t.rubric,
      act: {scenario: `The Canva page's example uses ${t.figures}. The trainee works the page's method on John Doe's own file and explains one consequence, in their own words.`,
        prompt: t.steps.map((s, i) => `${i + 1}. ${s.replace(/\*\*/g, "")}`).join(" "),
        tool: "Case Documents · CMS → Insurance → PIP / UM/UIM Coverage Stack · CMS → Treatment → Total Medical Specials",
        output: t.deliver.replace(/\*\*/g, ""),
        checkpoints: t.rubric.ai.map(x => `${x[0]}: ${x[2]}`)}},
    slide: {steps: t.steps, checks: t.checks, deliver: t.deliver, situation: t.situation},
    prefill: () => { const w = W[t.id]; return w && w.text && w.text.trim() ? [["My reasoning (typed by the trainee)", w.text]] : []; }
  };
});
const byActivity = id => THINK.filter(t => t.activity === id);

/* ---------- the panel over the slide ---------- */
function open(id){
  close();
  const t = THINK.find(x => x.id === id); if(!t) return;
  const w = W[id] || {};
  const o = document.createElement("div"); o.id = "cttPanel"; o.className = "ctt-modal"; o.setAttribute("role", "dialog"); o.setAttribute("aria-label", "Think it through");
  o.innerHTML = `<div class="ctt-box"><div class="ctt-h"><b>🧠 Think it through</b><span>${E(t.title.replace(/^Think It Through: /, ""))}</span>
      <button type="button" class="ctt-x" onclick="cmThink.close()" aria-label="Close">✕</button></div>
    <p class="ctt-q">${hl(t.situation)}</p>
    <ol class="ctt-steps">${t.steps.map(s => `<li>${hl(s)}</li>`).join("")}</ol>
    <label class="ctt-lab" for="ctt_${E(id)}">Your reasoning, in your own words</label>
    <textarea class="ctt-a" id="ctt_${E(id)}" rows="5" placeholder="His figures, what each test shows on his file, and one consequence for the demand" oninput="cmThink.draft('${E(id)}',this.value)">${E(w.text || "")}</textarea>
    <div class="ctt-g">${graderPart(id)}</div></div>`;
  o.addEventListener("click", e => { if(e.target === o) close(); });
  document.body.appendChild(o);
  document.addEventListener("keydown", esc, true);
}
// before it is graded: the trainee's own Submit (the grader's form would hand in a half-typed answer by itself); once
// graded: the grader's result, its ↻ Check again and 🔑 answer key (js/cm-ai-grader.js view)
function graderPart(id){
  if(!window.CMAIGrader) return `<p class="ctt-none">Submitting isn't available on this page right now. Your answer is saved.</p>`;
  if(CMAIGrader.result(id) && CMAIGrader.showing(id)) return CMAIGrader.view(id);
  return `<div class="ctt-row"><span class="aig-st" id="cfaig_st_${E(id)}" role="status" aria-live="polite"></span>
    <button type="button" class="btn ctt-go" onclick="cmThink.submit('${E(id)}')" title="Hand in your reasoning: it is scored and you see what to improve">Submit →</button></div>`;
}
async function submit(id){
  const el = document.getElementById("ctt_" + id), v = el ? el.value : (W[id] || {}).text;
  if(!String(v || "").trim()){ const s = document.getElementById("cfaig_st_" + id); if(s) s.textContent = "Write your reasoning first."; return; }
  W[id] = {text: String(v).slice(0, 6000), at: new Date().toISOString()};
  if(typeof storeSet === "function"){ clearTimeout(saveT); try{ await storeSet(KEY, W); }catch(e){} }
  if(window.CMAIGrader) await CMAIGrader.submit(id);
  const g = document.querySelector("#cttPanel .ctt-g"); if(g) g.innerHTML = graderPart(id);
}
function close(){ const o = document.getElementById("cttPanel"); if(o) o.remove(); document.removeEventListener("keydown", esc, true); }
function esc(e){ if(e.key === "Escape" && document.getElementById("cttPanel")){ e.stopPropagation(); close(); } }
function draft(id, v){ W[id] = {text: String(v || "").slice(0, 6000), at: new Date().toISOString()}; save(); }
// the grader repaints with render(): the panel's grader part follows (the trainee's text stays as typed)
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments);
    try{ const o = document.getElementById("cttPanel"), g = o && o.querySelector(".ctt-g"), id = o && (o.querySelector(".ctt-a") || {}).id;
      if(g && id) g.innerHTML = graderPart(id.replace(/^ctt_/, "")); }catch(e){}
    return r; };
}
window.cmThink = {THINK, open, close, draft, submit, text: id => (W[id] || {}).text || ""};

/* ---------- the button: beside the 💡 Tip on the activity that practises the pages (Your Task's 🧰 Tools menu) ---------- */
if(typeof renderDaySlideContent === "function"){
  const __content = renderDaySlideContent;
  renderDaySlideContent = function(d, slide){
    const html = __content.apply(this, arguments);
    const l = slide && slide.type === "topic" && slide.part === 1 && d && d.lessons && d.lessons[slide.lessonIndex];
    const ts = l && l.cf && l.cf.block ? byActivity(l.cf.block.id) : [];
    if(!ts.length || typeof html !== "string" || html.indexOf("ctt-btn") >= 0) return html;
    const btns = ts.map(t => { const r = window.CMAIGrader ? CMAIGrader.result(t.id) : null;
      return `<button type="button" class="ctt-btn" onclick="cmThink.open('${E(t.id)}')" title="Work the deck page's example on John Doe's own file">🧠 Think it through${r ? ` · ${E(r.score)}/100` : ""}</button>`; }).join("");
    const tip = html.search(/<button type="button" class="cm-lt-btn"[^>]*>[\s\S]*?<\/button>/), of = html.search(/<b class="cfx-of"[^>]*>[\s\S]*?<\/b>/);
    if(tip >= 0){ const end = html.indexOf("</button>", tip) + 9; return html.slice(0, end) + btns + html.slice(end); }
    if(of >= 0){ const end = html.indexOf("</b>", of) + 4; return html.slice(0, end) + btns + html.slice(end); }
    return html;
  };
}

const st = document.createElement("style"); st.id = "cm-think-through"; st.textContent = `
.ctt-btn{display:inline-flex !important;align-items:center;width:auto !important;min-width:0 !important;height:auto !important;margin:0 0 0 8px !important;vertical-align:middle;border:1px solid #1E2340 !important;background:#EEF0F7 !important;color:#1E2340 !important;font-family:inherit;font-size:16px !important;font-weight:700 !important;line-height:1.1 !important;padding:4px 12px !important;border-radius:999px !important;cursor:pointer;box-shadow:none !important}
.ctt-btn:hover{background:#DDE1EE !important}
.ctt-modal{position:fixed;inset:0;z-index:90;background:rgba(15,20,40,.55);display:flex;align-items:center;justify-content:center;padding:16px;}
.ctt-box{width:min(1000px,100%);max-height:92vh;overflow:auto;background:#fff;border-radius:16px;border-top:8px solid #DB8437;box-shadow:0 24px 60px -20px rgba(15,20,40,.6);padding:16px 20px 18px;color:#1E2340;}
.ctt-h{display:flex;flex-wrap:wrap;align-items:baseline;gap:4px 14px;margin-bottom:6px;}
.ctt-h b{font:800 20px/1.3 var(--font-ui,'Inter',sans-serif);} .ctt-h span{font:700 16px/1.3 var(--font-ui,'Inter',sans-serif);color:#A4470F;}
.ctt-x{margin-left:auto;border:1px solid #D6DAE5;background:#F6F7FB;border-radius:10px;width:36px;height:36px;font-size:16px;cursor:pointer;}
.ctt-q{margin:0 0 8px;font:700 17px/1.45 var(--font-ui,'Inter',sans-serif);}
.ctt-steps{margin:0 0 10px;padding-left:22px;font:700 16px/1.45 var(--font-ui,'Inter',sans-serif);} .ctt-steps li{margin:4px 0;}
.ctt-lab{display:block;font:800 16px/1.3 var(--font-ui,'Inter',sans-serif);margin:6px 0 4px;}
.ctt-a{width:100%;box-sizing:border-box;font:600 16px/1.45 var(--font-ui,'Inter',sans-serif);border:1px solid #C9CEDC;border-radius:10px;padding:8px 10px;resize:vertical;}
.ctt-g{margin-top:10px;} .ctt-row{display:flex;align-items:center;justify-content:flex-end;gap:12px;} .ctt-go{background:#DB8437;color:#fff;border:0;font:800 16px/1 'Inter',sans-serif;padding:10px 16px;border-radius:8px;cursor:pointer;} .ctt-none{font:700 16px/1.4 var(--font-ui,'Inter',sans-serif);color:#555;}
`;
document.head.appendChild(st);
})();
