/* ============================================================
   🤖 The AI Grader: every Skill Building activity is handed in and scored here

   It takes the place of the old Check Your Work slide (self-ticks over blurred answers): the activity's last slide
   (view "check", labelled AI Grader in js/cm-case-flow.js) holds a box with what the trainee did, already filled in
   with what the platform holds for that activity, which they can edit:
     • the reference they logged (the CMS Case ID, an e-filing or request number) and the case open in the CMS,
     • the live call's transcript (kept here when the call ends: cmCaseFlow.callBack is wrapped),
     • the Notes & Action Plan (the voicemail transcript, the plan, the emails sent), the service email, the Listening
       Check's answers and the exhibit audit's notes,
     • every source document filed in the CMS (js/cm-doc-filing.js) and, on Backup File Maintenance, the Drive's own grade,
     • then each step of the task, with room to say what was done.
   Submit to AI Grader → sends it to runRubricEvaluation (index.html), the way the Knowledge Check takeaways are graded,
   with the activity's own rubric (rubric.ai in js/cm-case-flow-data.js), its scenario, instructions, expected output and
   checkpoints as the answer key. The result shows as a score, what went well and what to work on next. Up to MAX_TRIES
   graded attempts per activity; the last one counts. The answer key (the slide's checks) opens only once no attempt is
   left, or when the trainee chooses 🔑 I'm done (after which no more attempts), so it can't be copied into a resubmission.

   Saved in the trainee's own record, "cf-ai-grades" (registered here as a personal key, so it syncs with their progress):
     {v:1, blocks:{<blockId>:{draft, score, tier, strengths, gaps, growth, at, tries, done}}, calls:{<blockId>:{at, text}}}
   A sign-in that finds no grades for this trainee starts empty, and logging out clears them, so a shared device never
   carries one trainee's grades (or used attempts) into the next one's record.
   runRubricEvaluation also writes each graded attempt to the work log (index.html wrapEvaluators: kind "lab", labelled
   "Day <id> · … — Skill Building"), which is where the Scorecard's 🧪 Skill Activities and the trainer read activity scores;
   js/cm-cms-file.js reads the grade for the CMS Case File areas.
   The AI not answering (quota, network) is said plainly, the work stays saved, and Try again sends it once more.
   ============================================================ */
(function(){
"use strict";
if(typeof document === "undefined") return;
const KEY = "cf-ai-grades", MAX_TRIES = 3;
if(typeof registerPersonalKeys === "function") registerPersonalKeys([KEY]);
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const hl = t => E(t).replace(/\*\*(.+?)\*\*/g, '<mark class="cfx-hl">$1</mark>');
const plain = t => String(t || "").replace(/\*\*/g, "");
const CF = () => window.CM_CASE_FLOW || {days: []};
const SLIDES = () => window.CM_CF_SLIDES || {};
const isTrainer = () => typeof state === "object" && !!(state.isAdmin || state.adminPreview);
const audience = () => !!document.body && document.body.classList.contains("audience-mode");
const DRIVE_DAY = {"d1m1-drive": 1, "d2-drive": 2, "d3-drive": 3, "d4-drive": 4, "d5-drive": 5};

const fresh = () => ({v: 1, blocks: {}, calls: {}});
let G = fresh(), loaded = false;
const busy = {};   // blockId → grading now
const editing = {};   // blockId → the trainee chose to edit and resubmit
async function load(force){
  if((loaded && !force) || typeof storeGet !== "function") return;
  loaded = true;
  try{ const v = await storeGet(KEY); G = v && typeof v === "object" ? Object.assign(fresh(), v) : fresh(); }catch(e){}
}
const save = () => typeof storeSet === "function" ? storeSet(KEY, G) : Promise.resolve();
const recOf = id => (G.blocks[id] = G.blocks[id] || {tries: 0});
load().then(() => { if(document.querySelector("[data-aig]")) repaint(); });
// sign-in restores the trainee's progress from the cloud: read the grades again, so nothing older is saved over them
if(typeof loadAll === "function"){
  const __loadAll = loadAll;
  loadAll = async function(){ const r = await __loadAll.apply(this, arguments); await load(true); return r; };
}
// logging out leaves nothing of this trainee's grades on the device for the next one to sign in
if(typeof window.logout === "function"){
  const __logout = window.logout;
  window.logout = async function(){
    const r = await __logout.apply(this, arguments);
    G = fresh(); Object.keys(busy).forEach(k => delete busy[k]); Object.keys(editing).forEach(k => delete editing[k]);
    try{ if(typeof storeSet === "function") await storeSet(KEY, null); }catch(e){}
    return r;
  };
}

/* the block, the day it's taught on (the sequence) and that day's id in the app */
function find(id){
  let blk = null, day = null;
  (CF().days || []).forEach(d => (d.modules || []).forEach(m => (m.blocks || []).forEach(b => { if(b.id === id){ blk = b; day = d; } })));
  let n = day && day.n;
  (CF().sequence || []).forEach(sd => (sd.phases || []).forEach(ph => { if((ph.blocks || []).includes(id)) n = sd.n; }));
  const taught = (CF().days || []).find(d => d.n === n) || day;
  return blk ? {b: blk, n, dayId: taught ? taught.id : n} : null;
}

/* ---------- what the platform already holds for this activity ---------- */
function prefill(id){
  const f = find(id); if(!f) return "";
  const R = (window.cmCaseFlow && typeof cmCaseFlow.record === "function" && cmCaseFlow.record()) || {};
  const out = [], add = (h, t) => { t = String(t || "").trim(); if(t) out.push(`${h}: ${t.length > 2500 ? t.slice(0, 2500) + "…" : t}`); };
  const w = (R.work || {})[id]; if(w && w.ref) add(`Reference I logged (${w.tool || "CMS"})`, w.ref);
  const cms = window.CMCase && typeof CMCase.id === "function" ? CMCase.id() : ""; if(cms) add("My case in the CMS", cms);
  const call = G.calls[id];
  if(call && call.text) add("Live call transcript", call.text);
  else if((R.calls || {})[id]) add("Live call", `taken on ${new Date(R.calls[id].at).toLocaleDateString()}`);
  const np = (R.notes || {})[id];
  if(np){
    add("Voicemail transcript", np.tx);
    add("My action plan", np.plan);
    Object.entries(np.mails || {}).forEach(([k, m]) => { if(m && m.sent) add(`Email sent (${k})`, m.body); });
  }
  const sv = (R.service || {})[id];
  if(sv){ add("Service email", sv.body); if(sv.filed) add("Service confirmation filed", sv.filed.name); }
  const ls = (R.listen || {})[id]; if(ls && (ls.answers || []).some(Boolean)) add("Listening Check answers", ls.answers.filter(Boolean).join(" · "));
  const au = (R.audits || {})[id]; if(au && (au.notes || []).some(Boolean)) add("Audit notes", au.notes.filter(Boolean).join(" · "));
  const filing = (typeof state === "object" && state.docFiling) || {}, docs = (window.CM_CF_DOC_PACKETS || {})[id] || [];
  const filed = docs.map(d => filing[d]).filter(r => r && r.filed).map(r => `${r.name} (${r.category}${r.attempts > 1 ? `, ${r.attempts} tries` : ""})`);
  if(filed.length) add(`Filed in the CMS (${filed.length} of ${docs.length} source files)`, filed.join("; "));
  const day = DRIVE_DAY[id], D = day && window.CMDrive && typeof CMDrive.status === "function" ? CMDrive.status() : null;
  if(D){
    const g = (D.grades || {})[day];
    if(g && typeof g.score === "number") add("Backup Drive auto-grade", `${g.score}%${g.passed ? ", passed" : ", not passed yet"}`);
    else if(day === 1 && D.built) add("Backup Drive", "folders built" + (D.checkedAt ? ", checked with Check my drive" : ""));
  }
  const steps = (SLIDES()[id] || {}).steps || [];
  return (out.length ? `From the platform:\n${out.join("\n")}\n\n` : "")
    + `What I did, step by step (write after each arrow):\n${steps.map((s, i) => `${i + 1}. ${plain(s)}\n   → `).join("\n")}`;
}

/* ---------- the slide ---------- */
function resultHtml(id, r){
  const list = (xs, cls) => (xs || []).length ? `<ul class="${cls}">${xs.map(x => `<li>${E(x)}</li>`).join("")}</ul>` : "";
  const left = r.done ? 0 : MAX_TRIES - (r.tries || 0);
  return `<div class="aig-res" data-aig-result="${E(id)}">
      <div class="aig-score"><b>${E(r.score)}</b><span>/100</span>${r.tier ? `<em>${E(r.tier)}</em>` : ""}</div>
      <div class="aig-fb">
        ${(r.strengths || []).length ? `<h4>✅ What you did well</h4>${list(r.strengths, "aig-good")}` : ""}
        ${(r.gaps || []).concat(r.growth || []).length ? `<h4>🎯 What to work on next</h4>${list((r.gaps || []).concat(r.growth || []), "aig-next")}` : ""}
      </div>
      <div class="aig-row"><small>Graded ${E(new Date(r.at).toLocaleString())} · attempt ${E(r.tries)} of ${MAX_TRIES}. Your trainer sees this score on your Scorecard.</small>
        ${left > 0 && !isTrainer() ? `<button type="button" class="btn btn-ghost btn-sm" onclick="CMAIGrader.edit('${E(id)}')">✏️ Improve it and resubmit (${left} left)</button>
          <button type="button" class="btn btn-ghost btn-sm" onclick="CMAIGrader.finish('${E(id)}')" title="Keep this score and see the answer key. No more attempts after this.">🔑 I'm done: show the answer key</button>` : ""}</div>
    </div>`;
}
function view(id){
  const f = find(id); if(!f) return "";
  const r = G.blocks[id] || {}, graded = typeof r.score === "number", c = SLIDES()[id] || {};
  // the key opens on the final result only (no attempt left, or the trainee stopped): never beside a resubmission
  const final = graded && !editing[id] && (r.done || (r.tries || 0) >= MAX_TRIES);
  const showKey = final || (isTrainer() && !audience());
  const draft = typeof r.draft === "string" && r.draft.trim() ? r.draft : prefill(id);
  const box = graded && !editing[id] ? resultHtml(id, r)
    : `<div class="aig-form">
        <label class="aig-lab" for="cfaig_${E(id)}">Tell the grader what you did. We filled in what the platform already has: check it, add what's missing, then submit.</label>
        <textarea id="cfaig_${E(id)}" class="aig-box" rows="9" oninput="CMAIGrader.draft('${E(id)}',this.value);CMAIGrader.grow(this)" aria-label="What you did on this activity">${E(draft)}</textarea>
        <div class="aig-row"><span class="aig-st" id="cfaig_st_${E(id)}" role="status" aria-live="polite">${busy[id] ? "⏳ Grading… this takes a few seconds." : ""}</span>
          <button type="button" class="btn btn-ghost btn-sm" onclick="CMAIGrader.refill('${E(id)}')" title="Fill the box again from what the platform holds now">↺ Refill</button>
          <button type="button" class="btn aig-go" onclick="CMAIGrader.submit('${E(id)}')"${busy[id] ? " disabled" : ""}>Submit to AI Grader →</button></div>
      </div>`;
  const key = showKey && (c.checks || []).length ? `<aside class="aig-key"><h4>🔑 Answer key: what your file should hold</h4><ol>${c.checks.map(x => `<li>${hl(x)}</li>`).join("")}</ol>
      ${isTrainer() && !final && !audience() ? `<p class="aig-note">Trainer view: trainees see this once their last attempt is graded.</p>` : ""}</aside>` : "";
  return `<div class="aig${key ? " aig-2" : ""}" data-aig="${E(id)}"><div class="aig-main">${box}</div>${key}</div>`;
}

function repaint(){
  if(typeof render === "function"){ try{ render(); return; }catch(e){} }
}
function status(id, html){ const el = document.getElementById("cfaig_st_" + id); if(el) el.innerHTML = html; }

/* the box grows with what is in it, up to a cap (BOX_CAP of the window): past that it scrolls inside, so a long prefill
   (a live call's transcript, emails) never pushes Submit off a slide whose cards don't scroll */
const BOX_CAP = 0.38;
function grow(el){
  if(!el) return;
  const cap = Math.max(160, Math.round((window.innerHeight || 768) * BOX_CAP));
  el.style.height = "auto";
  el.style.height = Math.min(el.scrollHeight + 4, cap) + "px";
}
function growAll(){
  const xs = [...document.querySelectorAll("textarea.aig-box")]; if(!xs.length) return;
  xs.forEach(grow);
  if(typeof window.paginateLessonSlide === "function"){ try{ window.paginateLessonSlide(); }catch(e){} }
}
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments); try{ growAll(); }catch(e){} return r; };
}
// a slide drawn without a full render (Next / Previous inside a block) is grown too
let growQ = false;
const watchGrow = () => { const app = document.getElementById("app"); if(!app) return;
  new MutationObserver(() => { if(growQ || !document.querySelector("textarea.aig-box:not([data-grown])")) return; growQ = true;
    requestAnimationFrame(() => { growQ = false; document.querySelectorAll("textarea.aig-box").forEach(x => x.setAttribute("data-grown", "1")); try{ growAll(); }catch(e){} }); })
    .observe(app, {childList: true, subtree: true}); };
if(document.readyState === "loading") document.addEventListener("DOMContentLoaded", watchGrow); else watchGrow();
let draftT = null;
window.CMAIGrader = {
  KEY, MAX_TRIES,
  view,
  prefill,
  grow,
  result: id => { const r = G.blocks[id]; return r && typeof r.score === "number" ? r : null; },
  all: () => G,
  draft(id, v){ recOf(id).draft = String(v || "").slice(0, 12000); clearTimeout(draftT); draftT = setTimeout(save, 700); },
  refill(id){ const el = document.getElementById("cfaig_" + id); const t = prefill(id); if(el) el.value = t; recOf(id).draft = t; save(); },
  edit(id){ if((G.blocks[id] || {}).done) return; editing[id] = true; repaint(); },
  // the trainee keeps this score: no more attempts, and the answer key opens
  async finish(id){
    const r = G.blocks[id]; if(!r || typeof r.score !== "number") return;
    r.done = true; editing[id] = false; await save();
    if(window.cmCaseFlow && typeof cmCaseFlow.reveal === "function" && !isTrainer()) cmCaseFlow.reveal(id); else repaint();
  },
  async submit(id){
    const f = find(id); if(!f || busy[id]) return;
    const el = document.getElementById("cfaig_" + id), text = String(el ? el.value : (recOf(id).draft || "")).trim();
    const r = recOf(id); r.draft = text; await save();
    if(((r.tries || 0) >= MAX_TRIES || r.done) && !isTrainer()){ status(id, "You've used all " + MAX_TRIES + " graded attempts on this activity. Your last score counts."); return; }
    // the box as it was filled in, with nothing of the trainee's own: not sent (it would grade the task's own steps, or
    // only what the platform filled in)
    const stepLines = new Set(((SLIDES()[id] || {}).steps || []).map((s, i) => `${i + 1}. ${plain(s)}`));
    const filled = new Set(prefill(id).split("\n").map(l => l.trim()).filter(l => l && l !== "→"));
    const own = text.split("\n").filter(l => !stepLines.has(l.trim()) && !filled.has(l.trim()) && !/^(What I did, step by step|From the platform:)/.test(l.trim())).join(" ").replace(/→/g, " ");
    if(own.split(/\s+/).filter(w => /[A-Za-z]/.test(w)).length < 8){ status(id, "Write what you did after each arrow (→) first, then submit."); return; }
    if(typeof runRubricEvaluation !== "function"){
      status(id, `The AI Grader isn't available on this page right now. Your work is saved. <button type="button" class="btn btn-ghost btn-sm" onclick="CMAIGrader.submit('${E(id)}')">Try again</button>`);
      return;
    }
    busy[id] = true;
    const btn = document.querySelector(`[data-aig="${id}"] .aig-go`); if(btn) btn.disabled = true;
    status(id, "⏳ Grading… this takes a few seconds.");
    const {b, n, dayId} = f, cs = CF().case || {}, sl = SLIDES()[id] || {};
    const label = `Day ${dayId} · Case Flow Day ${n} · ${b.title} — Skill Building`;
    const ctx = `Case: ${cs.style || "John Doe VS Robert Smith"}${cs.type ? ", " + cs.type : ""}. ${cs.counsel ? "Lead Counsel " + cs.counsel + ". " : ""}${cs.dol ? "DOL " + cs.dol + "; " : ""}${cs.sol ? "SOL " + cs.sol + ". " : ""}\n`
      + `Activity (Case Flow Day ${n}): ${b.title}\nScenario: ${(!sl.side && (b.act || {}).scenario) || plain(sl.situation)}\n`
      // a side activity's task is only the slide's own steps (its "Assuming …"): the full activity's prompt and checkpoints
      // would grade work the slide never asked for, so its answer key is the slide's checks alone
      + `${sl.side ? "" : `What the trainee was asked to do: ${(b.act || {}).prompt || ""}\n`}Steps on the slide:\n${(sl.steps || []).map((s, i) => `${i + 1}. ${plain(s)}`).join("\n")}\n`
      + `Where it is done: ${(b.act || {}).tool || ""}\nExpected output: ${(!sl.side && (b.act || {}).output) || plain(sl.deliver)}\n`
      + `Answer key (what a correct file holds): ${(sl.side ? [] : ((b.act || {}).checkpoints || [])).concat((sl.checks || []).map(plain)).join(" | ")}`;
    const notes = `This is a Skill Building activity worked in the CMS and the course's tools; the submission is the trainee's account of what they did, with what the platform recorded. `
      + `Lines that start with a number are the task's own steps: grade what the trainee wrote after each arrow and the platform records, not the step text. `
      + `${sl.side ? "This is a short side activity: the task is only to log the entry in the CMS under the stated assumptions; do not mark down for leaving out work it did not ask for. " : ""}`
      + `Grade against this activity's rubric. AI criteria: ${(((b.rubric || {}).ai) || []).map(x => `${x[0]} (${x[1]}%): ${x[2]}`).join("; ")}. `
      + `UPL is a gate: if the trainee gives the client legal advice (case value, merits, legal consequences), score Risk Mitigation 0 and say so. `
      + `Write strengths and next steps as a coach teaching a new Case Manager: plain words, one concrete action each.`;
    try{
      const rep = await runRubricEvaluation(label, ctx, text, notes);
      Object.assign(r, {score: Math.round(rep.totalScore), tier: rep.gradeTier || "", strengths: (rep.strengths || []).slice(0, 3),
        gaps: (rep.blindspots || []).slice(0, 3), growth: (rep.growthSuggestions || []).slice(0, 2), at: new Date().toISOString(), tries: (r.tries || 0) + 1});
      busy[id] = false; editing[id] = false;
      await save();
      if(typeof toast === "function") toast(`AI Grader: ${r.score}/100. Your trainer sees it on your Scorecard.`);
      // the answer key opens once this was the last attempt (as it did when a trainee finished the old self-check)
      if(r.tries >= MAX_TRIES && window.cmCaseFlow && typeof cmCaseFlow.reveal === "function" && !isTrainer()) cmCaseFlow.reveal(id); else repaint();
    }catch(e){
      busy[id] = false;
      if(btn) btn.disabled = false;
      const again = `<button type="button" class="btn btn-ghost btn-sm" onclick="CMAIGrader.submit('${E(id)}')">Try again</button>`;
      status(id, e && e.invalidInput ? `${E(e.message || "Add more detail about what you did, then submit again.")}`
        : `The AI Grader couldn't be reached just now. Your work is saved. Wait a minute, then ${again}`);
    }
  }
};

/* the live call's transcript is kept for the grader when the call ends (state.rpSession is cleared on the way back) */
if(window.cmCaseFlow && typeof cmCaseFlow.callBack === "function"){
  const __back = cmCaseFlow.callBack;
  cmCaseFlow.callBack = function(){
    try{
      const s = typeof state === "object" && state.rpSession, cf = s && s.cf;
      if(cf && cf.blockId && (s.chatHistory || []).length){
        const who = (s.persona && s.persona.label) || "Caller";
        const text = s.chatHistory.filter(m => m && !m.pending).map(m => `${m.role === "ea" || m.role === "user" ? "Me" : who}: ${String(m.text || m.content || "").trim()}`).filter(x => !/:\s*$/.test(x)).join("\n");
        if(text){ G.calls[cf.blockId] = {at: new Date().toISOString(), text: text.slice(-6000)}; save(); }
      }
    }catch(e){}
    return __back.apply(this, arguments);
  };
}

const css = document.createElement("style");
css.id = "cm-ai-grader-css";
css.textContent = `
.aig{display:grid;grid-template-columns:minmax(0,1fr);gap:16px;text-align:left;}
.aig.aig-2{grid-template-columns:minmax(0,1.35fr) minmax(0,1fr);}
.aig-lab{display:block;margin:0 0 8px;font:800 18px/1.35 var(--font-ui);color:#1E2340;}
.aig-box{width:100%;box-sizing:border-box;min-height:120px;max-height:38vh;overflow-y:auto;resize:none;padding:12px 14px;border:2px solid #C9D3EA;border-radius:12px;font:600 16px/1.45 var(--font-ui);color:#141A2E;background:#fff;}
.aig-box:focus{outline:3px solid #DB8437;outline-offset:1px;border-color:#DB8437;}
.aig-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;margin-top:10px;}
.aig-row small{font:700 16px/1.35 var(--font-ui);color:#4A5068;}
.aig-st{flex:1 1 220px;font:700 16px/1.35 var(--font-ui);color:#A4470F;}
.aig .aig-go{background:#DB8437 !important;color:#fff !important;border:0 !important;font:800 18px/1.2 var(--font-ui) !important;padding:11px 22px !important;border-radius:12px !important;height:auto !important;min-height:0 !important;}
.aig .aig-go[disabled]{opacity:.6;cursor:wait;}
.aig .aig-go:hover:not([disabled]),.aig .aig-go:focus-visible{background:#1E2340 !important;outline:none;}
.aig-res{display:grid;grid-template-columns:auto minmax(0,1fr);gap:12px 18px;align-items:start;background:#F6F7FB;border:2px solid #E3E6EF;border-left:8px solid #DB8437;border-radius:14px;padding:14px 16px;}
.aig-res .aig-row{grid-column:1 / -1;margin-top:0;}
.aig-score{display:flex;flex-direction:column;align-items:center;justify-content:center;min-width:120px;padding:12px;background:#1E2340;color:#fff;border-radius:14px;}
.aig-score b{font:800 46px/1 var(--font-ui);}
.aig-score span{font:800 16px var(--font-ui);color:#F3C99E;}
.aig-score em{margin-top:6px;font:800 16px var(--font-ui);font-style:normal;color:#fff;background:#DB8437;border-radius:999px;padding:3px 10px;text-align:center;}
.aig-fb{max-height:38vh;overflow:auto;}
.aig-fb h4,.aig-key h4{margin:0 0 6px;font:800 17px/1.3 var(--font-ui);color:#1E2340;}
.aig-fb ul{margin:0 0 10px;padding-left:20px;}
.aig-fb li,.aig-key li{font:700 16px/1.4 var(--font-ui);color:#141A2E;margin:0 0 4px;}
.aig-key{background:#fff;border:2px solid #E3E6EF;border-radius:14px;padding:12px 14px;max-height:52vh;overflow:auto;}
.aig-key ol{margin:0;padding-left:22px;}
.aig-note{margin:8px 0 0;font:700 16px/1.35 var(--font-ui);color:#4A5068;}
@media (max-width:760px){ .aig.aig-2{grid-template-columns:minmax(0,1fr);} .aig-res{grid-template-columns:minmax(0,1fr);} }
`;
document.head.appendChild(css);
})();
