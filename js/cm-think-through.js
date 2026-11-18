/* ============================================================
   🧠 Think it through: from a deck page's figures to a consequence on John Doe's file
   Day 2's Valuation Baseline pages (deck pages 23–24, lesson d3m2-l2) give John Doe's own figures: his $10,000 PIP limit
   exhausted in 48 hours with his ER and EMS bills, $41,400 of bills, and Dr. Sarah Spine's Emergency Medical Condition
   finding. The case file follows them (curriculum/5-day-flow/case-file.md). The challenge is critical thinking, not
   recall: the trainee reasons from those figures to what they cause on the file, for the BI adjuster's valuation, and for
   the LOP and the Payer Order that come next, in their own words.
   It is graded the way every Skill Building is (js/cm-ai-grader.js): registered as an extra activity in
   window.CM_AIG_EXTRA[<id>], with its own rubric (AI 60, trainer 40, as every activity's), its steps and its answer key.
   What the trainee writes is saved in their own record ("cf-think", a personal key) and is what the grader reads.
   Checked by .github/scripts/think-through.cjs.
   ============================================================ */
(function(){
"use strict";
const THINK = [{
  id: "d2-think-valuation",
  activity: "d3m2-a1",            // Day 2's Skill Building that practises the Valuation Baseline pages (d3m2-l2)
  deck: {day: 2, pages: [23, 24]},
  n: 2,
  title: "Think It Through: What John Doe's 48 Hours Did to His File",
  figures: "John Doe's $10,000 PIP limit exhausted in 48 hours on his ER and EMS bills, $41,400 in medical bills, and Dr. Sarah Spine's EMC finding",
  situation: "The slides say John Doe exhausted a **$10,000 PIP limit in 48 hours** with his ER and EMS bills, his bills total **$41,400**, and **Dr. Sarah Spine** documented an EMC. Reason from those facts: what do they **cause** on his file, for Keystone's valuation and for who pays the bills next?",
  steps: [
    "From John Doe's file (the Case Documents, RS31, RS97, RS98, and the CMS → Insurance and Treatment tabs), confirm the facts the slides state: what PIP paid, when it ran out, his audited bills, and the EMC record.",
    "Reason to the **BI adjuster's valuation**: what does a limit gone in 48 hours signal, and why is the $41,400 of bills, not the $10,000 PIP paid, the anchor Atty. Thorne hands Keystone?",
    "Reason to **what comes next**: with PIP gone on day two of care, who pays the urgent care, Lakeside and the MRI, and the chiropractic and PT, in the Payer Order? What would the file look like **without** Dr. Spine's EMC finding?"
  ],
  checks: [
    "Confirms the facts from the file: Harbor Point PIP **$10,000**, paid at the fee schedule to Riverton General ($8,850.00) and Riverton Fire EMS ($1,150.00) for **02/20–02/21/2026**, exhausted 03/04/2026; medical bills **$41,400.00** audited ($42,984.00 with wages); EMC by **Dr. Sarah Spine**, 02/20/2026 (RS97)",
    "**Valuation**: a limit spent in 48 hours on emergency care reads as a **high-severity** case, an answer to Keystone's \"14-day gap\" and \"minor\" arguments; the anchor is the **total value of the bills, $41,400.00**, because PIP's $10,000 is only what one payer paid (at a fee schedule) and understates the injury",
    "**Payer Order next**: PIP → **MedPay** ($5,000, paid urgent care, Lakeside and the MRI to 06/26/2026) → **Peach State** (Crescent's injection, $1,860.00) → **LOP** (Riverton Spine & Rehab's chiropractic and PT, $6,105.00 audited); Summit's LOP request declined because MedPay applied first",
    "**Without the EMC**: PIP stops at **$2,500**; the other **$7,500** of emergency bills falls to MedPay, which is then gone before the urgent care, Lakeside and the MRI, so those bills become Peach State and LOP **liens** against his net; that is why the finding is a negotiation lever",
    "Non-subrogation: Harbor Point has no reimbursement right (03/02/2026), so neither PIP nor MedPay is ever a lien and neither goes into the $40,000 gross",
    "Stays in role: gives Atty. Thorne the figures and the reasoning; **no opinion of what the claim is worth**; the EMC finding is the physician's, never the Case Manager's to ask for"
  ],
  deliver: "The slides' figures **confirmed from the file**, and their **consequences reasoned through**: the adjuster's valuation, the Payer Order after PIP, and the file without the EMC",
  rubric: {
    ai: [
      ["Facts confirmed from the file", 10, "PIP $10,000 exhausted 03/04/2026 on the ER and EMS bills of 02/20–02/21/2026; medical $41,400.00 ($42,984.00 with wages); Dr. Sarah Spine's EMC, each tied to its document"],
      ["Valuation reasoned", 20, "Explains why 48-hour exhaustion signals severity and why the $41,400.00 of bills, not PIP's $10,000, is the anchor, with the reason, not a restatement of the slide"],
      ["Consequence for the Payer Order", 20, "Works what PIP's early exhaustion sends down the line (MedPay, then Peach State, then the LOP) and what losing the EMC would turn into liens ($7,500 more past a $2,500 cap)"],
      ["Role and UPL", 10, "The figures and reasoning go to Atty. Thorne; no valuation of the claim; the EMC finding is the physician's"]
    ],
    trainer: [
      ["Own reasoning", 25, "Explains each cause and effect in their own words at the debrief; not a recall of the slide or the key"],
      ["Critical thinking", 15, "Follows a fact past the slide to what it changes on the file, and tests it with the no-EMC case"]
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
      act: {scenario: `The Canva pages give ${t.figures}. The trainee confirms them from the file and reasons, in their own words, to what they cause: the BI adjuster's valuation, the Payer Order after PIP, and the file without the EMC.`,
        prompt: t.steps.map((s, i) => `${i + 1}. ${s.replace(/\*\*/g, "")}`).join(" "),
        tool: "Case Documents · CMS → Insurance → PIP / UM/UIM Coverage Stack · CMS → Treatment → Total Medical Specials · CMS → Liens",
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
    <textarea class="ctt-a" id="ctt_${E(id)}" rows="5" placeholder="The facts from his file, what they signal to Keystone, and what they send down the Payer Order (and without the EMC)" oninput="cmThink.draft('${E(id)}',this.value)">${E(w.text || "")}</textarea>
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
