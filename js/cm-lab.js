/* ============================================================
   LSH Case Management Training — 🧪 PRACTICE LAB: the work done in the CMS, reviewed
   Every Practice Lab activity (Days 1–5) sends the trainee to do the work in the CMS (or the
   LSH Training Portal tool it runs on, then the CMS) on the matching case, with the activity's
   steps in a panel beside the tool, and takes the result back here for review:
     • Submit for review: the ID the tool gave (CMS Case ID, request number, score), what was
       done and the steps ticked. Saved in the trainee's progress ("lab-subs", synced to the
       cloud like the rest), so it follows them across devices.
     • Automatic review, straight away: rule-based (the ID's format, the steps, the items the
       instructions name). The Net Sheet Ledger, the closing letter and the settlement documents
       (js/cm-practice.js) bring their own checks.
     • Trainer review: on 🧪 Practice an admin opens any trainee's Practice Lab and gives each
       activity (and each submission) a score, a rating and a comment. Saved in
       labreview:<trainee id>, which the trainee reads but can never write (worker.js), and shown
       beside their submission, on the activity's page and on its Practice card.
   Loaded after cm-skillbuilders.js (uses window.__cmKit and its tool frame) and before
   cm-practice.js (which defines its activities with cmLabDefine).
   ============================================================ */
(function(){
"use strict";
const K = window.__cmKit;
if(!K){ console.warn("cm-lab: cm-skillbuilders.js must load first"); return; }
const {E, toolOfKey, dayOfTool} = K;
const DEFS = {};                                   // key → the activity (see cmLabDefine)
const kid = (key)=> String(key).replace(/\W/g,"_");
const plain = (html)=> String(html||"").replace(/<[^>]+>/g,"").replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/\s+/g," ").trim();
const trainee = ()=> !!(state.traineeId && !state.isAdmin);
const RATINGS = ["Exceeds expectations","Meets expectations","Needs work","Redo it"];

/* ---------------- the activities ----------------
   cmLabDefine(key, {title, day, tool, extra, html, steps:[{t, open:{tool, extra}} | {t, rp:{categoryId, topicId}}],
                     keys:[...], caseRef:"jd"|"jdv", review(sub)→{score, notes, ok}, renderData(data)→html}) */
window.cmLabDefine = function(key, def){ DEFS[key] = Object.assign({key}, DEFS[key]||{}, def); return DEFS[key]; };
window.cmLabDef = (key)=> DEFS[key] || null;

/* ---------------- the trainee's submissions ("lab-subs") ---------------- */
const subs = ()=> (state.labSubs = state.labSubs || {});
window.cmLabSub = (key)=> subs()[key] || null;
// Done: submitted here, or (from before) logged in the old tool work log.
window.cmLabDone = (key)=> !!(subs()[key] || (state.cmsLog||{})[key] || (DEFS[key] && DEFS[key].legacy && (state.cmsLog||{})[DEFS[key].legacy]));
async function loadSubs(){ try{ const v = await storeGet("lab-subs"); state.labSubs = (v && typeof v==="object") ? v : {}; }catch(e){ state.labSubs = state.labSubs || {}; } }
// the engine reloads everything after a cloud restore: the submissions with it
if(typeof loadAll === "function" && !loadAll.__lab){
  const __loadAll = loadAll;
  window.loadAll = async function(){ const r = await __loadAll.apply(this, arguments); await loadSubs(); return r; };
  window.loadAll.__lab = true;
}
window.addEventListener("load", ()=> setTimeout(loadSubs, 300));

/* ---------------- automatic review ---------------- */
const ID_RULES = {
  cms:{re:/^LSH-\d{4}-[A-Z]{2,5}-\d{3,}$/i, ex:"LSH-2026-PI-000123"},
  docket:{re:/^DKT-[A-Z0-9-]{3,}$/i, ex:"DKT-DOE-1234"},
  records:{re:/^MRR-\d{4}-\d{3,}$/i, ex:"MRR-2026-00012"},
  efiling:{re:/^(ENV|EFL|CMECF)-?[A-Z0-9-]{4,}$/i, ex:"ENV-88213407"},
  score:{re:/^\d{1,3}(\.\d+)?\s*%?$/, ex:"82%"}
};
const idRule = (tool)=> ID_RULES[tool] || ID_RULES.score;
// the items an activity names in bold ("upload under <b>Case Files</b>") are what a complete summary mentions
const boldItems = (html)=> [...String(html||"").matchAll(/<b>([^<]{3,60})<\/b>/g)].map(m=>m[1].trim()).filter((v,i,a)=>a.indexOf(v)===i).slice(0, 8);
const mentions = (text, item)=>{ const t = String(text||"").toLowerCase(); const words = String(item).toLowerCase().match(/[a-z0-9$]{4,}/g) || [String(item).toLowerCase()]; return words.some(w=>t.includes(w)); };
function defaultReview(def, sub){
  const notes = [], ok = [];
  const rule = idRule(def.tool);
  const steps = def.steps || [], done = steps.filter((_,i)=>sub.steps && sub.steps[i]).length;
  const keys = def.keys || boldItems(def.html + " " + steps.map(s=>s.t).join(" "));
  const hit = keys.filter(k=>mentions(sub.summary, k));
  let score = 0;
  if(rule.re.test(String(sub.evidence||"").trim())){ score += 30; ok.push(`${def.tool==="cms"?"CMS Case ID":"Result"} recorded: ${sub.evidence}`); }
  else notes.push(`The ${def.tool==="cms"?"CMS Case ID":"result"} "${sub.evidence||""}" isn't in the tool's format (e.g. ${rule.ex}). Copy it exactly from the tool.`);
  if(steps.length){ score += Math.round(40*done/steps.length); if(done < steps.length) notes.push(`Steps not confirmed yet: ${steps.map((s,i)=>sub.steps && sub.steps[i] ? null : `${i+1}`).filter(Boolean).join(", ")}.`); else ok.push("Every step confirmed."); }
  else score += 20;
  const len = String(sub.summary||"").trim().length;
  if(len >= 80){ score += 10; } else notes.push("Describe what you did in the tool in a few sentences (what you entered, uploaded, logged).");
  score += Math.round((steps.length ? 20 : 40) * (keys.length ? hit.length/keys.length : 1));
  const missed = keys.filter(k=>!hit.includes(k));
  if(missed.length) notes.push(`Your summary doesn't mention: ${missed.join(" · ")}.`); else if(keys.length) ok.push("Your summary covers every item the activity names.");
  return {score: Math.max(0, Math.min(100, score)), notes, ok};
}
function autoReview(key, sub){
  const def = DEFS[key] || {key, tool:"cms"};
  try{ return (def.review || ((s)=>defaultReview(def, s)))(sub); }catch(e){ return {score:null, notes:["The automatic review couldn't run: your trainer will review it."], ok:[]}; }
}
window.cmLabAutoReview = autoReview;

// Saves a submission (a new attempt) with its automatic review; mirrors the ID into the tool work log.
window.cmLabSave = async function(key, patch){
  const def = DEFS[key] || {};
  const prev = subs()[key] || {};
  const sub = Object.assign({key, title: def.title || key, day: def.day || null, tool: def.tool || null}, patch, {at:new Date().toISOString(), attempts:(prev.attempts||0)+1});
  sub.auto = autoReview(key, sub);
  subs()[key] = sub;
  await storeSet("lab-subs", state.labSubs);
  if(sub.evidence && (def.tool && def.tool !== "none")){
    state.cmsLog = state.cmsLog || {};
    state.cmsLog[key] = {caseId: sub.evidence, at: sub.at, tool: def.parentTool || toolOfKey(key), platform: def.tool, title: def.title};
    await storeSet("cms-log", state.cmsLog);
  }
  return sub;
};

/* ---------------- trainer reviews (labreview:<trainee id>, read-only for the trainee) ---------------- */
let revLoading = null;
function loadMyReviews(force){
  if(!trainee() || revLoading || typeof sharedGet !== "function") return;
  const r = state.labReviews;
  if(!force && r && Date.now() - r.at < 2*60*1000) return;   // every Worker request counts: at most every 2 minutes
  revLoading = sharedGet("labreview:" + state.traineeId).then(v=>{
    revLoading = null;
    const items = (v && v.items) || {}, was = JSON.stringify((state.labReviews||{}).items || {});
    state.labReviews = {items, at: Date.now()};
    if(was !== JSON.stringify(items) && window.cmFrameRepaintSide) cmFrameRepaintSide(true);
    if(was !== JSON.stringify(items) && ["practice","tool"].includes(state.view) && !(typeof isTyping==="function" && isTyping())) render();
  }).catch(()=>{ revLoading = null; });
}
const myReview = (key)=> ((state.labReviews||{}).items||{})[key] || null;
window.cmLabReview = myReview;
const band = (n)=> n>=85 ? "good" : n>=70 ? "mid" : "low";   // the Case File checkpoint score colours
function reviewBoxHTML(rv, label){
  if(!rv) return "";
  return `<div class="cm-scn" style="margin:10px 0 0"><b>💬 ${E(label||"Trainer review")}</b>${rv.score!=null && rv.score!=="" ? ` <span class="cmm-score ${band(rv.score)}">${E(rv.score)}/100</span>` : ""}${rv.rating?` <span class="px-tag">${E(rv.rating)}</span>`:""}
    ${rv.comment ? `<div style="margin-top:6px">${E(rv.comment).replace(/\n/g,"<br>")}</div>` : ""}<span class="cm-why">${E(rv.by||"Your trainer")}${rv.at?` · ${fmtDate(rv.at)}`:""}</span></div>`;
}
window.cmLabReviewBox = (key, label)=> reviewBoxHTML(myReview(key), label);
function autoBoxHTML(sub){
  if(!sub || !sub.auto) return "";
  const a = sub.auto, sc = a.score;
  const items = (a.ok||[]).map(x=>`<li>✓ ${E(x)}</li>`).concat((a.notes||[]).map(x=>`<li>✗ ${E(x)}</li>`));
  return `<div class="cm-scn" style="margin:10px 0 0"><b>🤖 Automatic review</b>${sc!=null?` <span class="cmm-score ${band(sc)}">${sc}/100</span>`:""} <span class="cm-why" style="display:inline">submitted ${fmtDate(sub.at)}${sub.attempts>1?` · attempt ${sub.attempts}`:""}</span>
    ${items.length?`<ul style="margin:6px 0 0;padding-left:18px;list-style:none">${items.join("")}</ul>`:""}</div>`;
}
window.cmLabAutoBox = (key)=> autoBoxHTML(subs()[key]);
// What the trainee sees under a submission: the automatic review, then the trainer's.
window.cmLabResultHTML = (key)=> `<div id="labres_${kid(key)}">${autoBoxHTML(subs()[key])}${reviewBoxHTML(myReview(key))}</div>`;

/* ---------------- the submission form (beside the tool, and inline on a Skill Builder) ---------------- */
function caseLine(def){
  const log = state.cmsLog || {}, s = subs();
  const pick = (keys)=> keys.map(k=>(s[k] && s[k].evidence) || (log[k] && log[k].caseId)).find(v=>v && ID_RULES.cms.re.test(v));
  if(def.caseRef === "jd"){ const id = pick(["px1:cms-build","cmIntake1:cms"]); return `<p class="cm-intro" style="margin:8px 0">📂 Your John Doe case: ${id ? `<b>${E(id)}</b> (search it in the CMS)` : `<i>build it first: Day 1 · Build John Doe's case in the CMS</i>`}</p>`; }
  if(def.caseRef === "jdv"){ const id = pick(["px5:cms-jordan","cmJordan5:cms"]); return `<p class="cm-intro" style="margin:8px 0">📂 Your Jordan Davies case: ${id ? `<b>${E(id)}</b>` : `<i>you create it in this activity</i>`}</p>`; }
  return "";
}
function formHTML(key, where){
  const def = DEFS[key] || {}, s = subs()[key] || {}, k = where + "_" + kid(key);
  const t = def.tool && window.cmTool ? cmTool(def.tool) : null;
  const evLabel = def.evidenceLabel || (t ? t.idHint : "The ID the tool gave you");
  const steps = def.steps || [];
  const lab = (t)=> `<label style="font-size:12.8px;font-weight:700;color:var(--navy);display:block;margin:10px 0 5px">${t}</label>`;
  return `<div id="${k}" style="margin-top:10px">
    ${steps.map((st,i)=>`<label class="cm-check"><input type="checkbox" style="min-width:0;flex:0 0 auto" id="${k}_s${i}" ${s.steps && s.steps[i]?"checked":""}><span style="font-weight:500">${i+1}. ${st.t}${stepAction(key, st)}</span></label>`).join("")}
    ${lab(E(evLabel))}<input id="${k}_ev" style="width:100%;box-sizing:border-box" value="${E(s.evidence || ((state.cmsLog||{})[key]||{}).caseId || "")}" placeholder="${E(evLabel)}">
    ${lab("What you did in the tool")}<textarea class="cm-ta" id="${k}_sum" style="min-height:${where==="lp"?110:80}px" placeholder="What you entered, uploaded and logged, e.g. Created the case with the corrected DOB, uploaded the police report under Police, added Tasks for…">${E(s.summary||"")}</textarea>
    <div><button class="btn btn-navy btn-sm" style="margin-top:8px" onclick="cmLabSubmit('${key}','${where}', this)">${s.at ? "Submit again for review" : "Submit for review"}</button></div>
  </div>`;
}
function stepAction(key, st){
  if(st.rp) return ` <button class="btn btn-ghost btn-sm" onclick="cmLabRoleplay('${st.rp.categoryId}','${st.rp.topicId}')">▶ Start the call</button>`;
  if(st.open){ const t = window.cmTool ? cmTool(st.open.tool) : null; if(!t) return "";
    return ` <button class="btn btn-ghost btn-sm" onclick="cmLabGo('${key}','${st.open.tool}','${E(st.open.extra||"")}')">${t.icon} Open ${E(t.short)}${st.open.tool==="calendaring"?" ↗":""}</button>`; }
  return "";
}
window.cmLabSubmit = async function(key, where, btn){
  const k = where + "_" + kid(key), def = DEFS[key] || {};
  const ev = ((document.getElementById(k+"_ev")||{}).value || "").trim(), sum = ((document.getElementById(k+"_sum")||{}).value || "").trim();
  const steps = {}; (def.steps||[]).forEach((_,i)=>{ const c = document.getElementById(`${k}_s${i}`); if(c && c.checked) steps[i] = true; });
  if(ev.length < 2){ toast("Enter the ID (or score) the tool gave you first."); return; }
  if(sum.length < 20){ toast("Describe what you did in the tool first."); return; }
  if(btn){ btn.disabled = true; btn.textContent = "Reviewing…"; }
  const sub = await cmLabSave(key, {evidence: ev, summary: sum, steps});
  toast(`Submitted. Automatic review: ${sub.auto.score}/100. Your trainer reviews it too.`);
  paintResults(key);
  if(btn){ btn.disabled = false; btn.textContent = "Submit again for review"; }
};
// every place this activity's result shows (the panel, the inline step, the Practice card) is brought up to date
function paintResults(key){
  document.querySelectorAll(`#labres_${kid(key)}`).forEach(el=>{ el.outerHTML = cmLabResultHTML(key); });
  if(window.cmFrameRepaintSide) cmFrameRepaintSide(true);
  if(window.cmFrameSyncPill) cmFrameSyncPill();
}
window.cmLabPaintResults = paintResults;

/* ---------------- beside the tool: the steps panel in the tool frame (js/cm-skillbuilders.js) ---------------- */
window.cmLabPanelHTML = function(key){
  const def = DEFS[key]; if(!def) return "";
  return `<div class="cm-part"><p class="eyebrow">${def.day?`Day ${def.day} · `:""}Practice Lab</p><h3>${E(def.title)}</h3>
    ${caseLine(def)}
    ${def.html ? `<p class="cm-intro">${def.html}</p>` : ""}
    <div class="cm-cms">${formHTML(key, "lp")}</div>
    ${cmLabResultHTML(key)}</div>`;
};
// Open an activity: its tool in the frame (or the CMS, for a tool that opens in its own tab) with the steps beside it.
window.cmLabOpen = function(key){
  const def = DEFS[key]; if(!def){ return; }
  let tool = def.tool || "cms", extra = def.extra || null;
  const t = window.cmTool ? cmTool(tool) : null;
  if(!t || !t.live || tool === "calendaring"){ tool = "cms"; extra = def.cmsExtra || null; }
  openTool(tool, null, extra, key);
};
// A step's own button: another tool (or another line of the Call Simulator), same activity, steps still beside it.
window.cmLabGo = function(key, tool, extra){
  if(tool === "calendaring"){ openTool("calendaring", "tab", extra || null); return; }
  openTool(tool, null, extra || null, key);
};
window.cmLabRoleplay = function(categoryId, topicId){
  if(window.closeToolFrame) closeToolFrame();
  if(window.pxRoleplay) pxRoleplay(categoryId, topicId); else goto("crisisroleplay");
};

/* ---------------- on a Skill Builder: the "Do this in the …" step (toolStep in js/cm-skillbuilders.js) ---------------- */
window.cmLabStepHTML = function(key, toolId, what){
  const t0 = cmTool(toolId), fallback = !t0.live && toolId !== "cms", t = fallback ? cmTool("cms") : t0;
  const tool = PRACTICE_TOOLS.find(x=>x.id===toolOfKey(key));
  cmLabDefine(key, {title: `${tool ? tool.title + " · " : ""}${t0.short}`, day: dayOfTool(toolOfKey(key)), tool: t.id, parentTool: toolOfKey(key),
    html: what + (fallback ? `<p>Until the ${E(t0.short)} platform is live, add this as a <b>Task</b> in the CMS case.</p>` : ""), caseRef: /Jordan/i.test(what) ? "jdv" : (toolId === "cms" ? "jd" : "")});
  return `<div class="cm-cms lab-step"><b>${t0.icon} Do this in the ${E(t0.name)}</b>${t0.live?"":` <span class="cm-soon">coming soon</span>`}
    <p style="font-size:12.8px;margin:6px 0 0;color:#37394A">${what}</p>
    ${fallback?`<p style="font-size:12.3px;margin:6px 0 0;color:var(--ink-soft)">Until the ${E(t0.short)} platform is live, add this as a <b>Task</b> in the CMS case.</p>`:""}
    <div class="row"><button class="btn btn-navy btn-sm" onclick="cmLabOpen('${key}')">Open ${E(t.short)} beside these steps</button><button class="btn btn-ghost btn-sm" onclick="openTool('${t.id}','tab')" title="Open in a new tab">↗</button></div>
    ${formHTML(key, "li")}
    ${cmLabResultHTML(key)}</div>`;
};

/* ---------------- the trainee's reviews: loaded on the Practice pages; the activity page shows its own ---------------- */
const __labAfterRender = window.afterRender;
window.afterRender = function(){
  const r = __labAfterRender.apply(this, arguments);
  if(["practice","tool"].includes(state.view)) loadMyReviews(false);
  return r;
};
if(typeof window.toolHead === "function"){
  const __head = window.toolHead;
  window.toolHead = function(t){
    const html = __head.apply(this, arguments), rv = myReview(t.id);
    return rv ? html.replace(`<div class="card tool-shell lab-shell">`, `${reviewBoxHTML(rv, "Trainer review of this activity")}<div class="card tool-shell lab-shell">`) : html;
  };
}

/* ================================================================
   FOR TRAINERS: review any trainee's Practice Lab (on 🧪 Practice)
   ================================================================ */
window.cmLabTrainerHTML = function(){
  if(!state.isAdmin) return "";
  const L = state.labAdmin || {}, t = L.trainee;
  return `<div class="card cmm-sec cmm-trainer"><h2>🔑 For Trainers: review a trainee's Practice Lab</h2>
    <p class="cmm-lead">Open a trainee's submissions, then give each activity a score, a rating and a comment. They see it beside their work.</p>
    <div class="cmm-tr"><button class="btn btn-ghost btn-sm" onclick="cmLabAdminLoad()">${L.list?"↻ Refresh":"Load trainees"}</button>
      ${L.list ? `<select onchange="cmLabAdminPick(this.value)"><option value="">Choose a trainee…</option>${L.list.map(r=>`<option value="${E(r.id)}" ${t&&t.id===r.id?"selected":""}>${E(r.name)}${r.batch?" · "+E(r.batch):""}</option>`).join("")}</select>` : ""}
      ${t ? `<button class="btn btn-ghost btn-sm" onclick="cmLabAdminPick('')">Close</button>` : ""}</div>
    ${t ? (t.loading ? `<p>Loading…</p>` : adminTraineeHTML(t)) : ""}</div>`;
};
window.cmLabAdminLoad = async function(){
  try{
    const keys = await sharedList("trainee:");
    const recs = (await sharedGetMany(keys)).filter(r=>r && !r.archived && r.approved !== false);
    state.labAdmin = Object.assign({}, state.labAdmin, {list: recs.map(r=>({id:r.id, name:r.name||"Trainee", batch:r.batch||""})).sort((a,b)=>a.name.localeCompare(b.name))});
  }catch(e){ toast("Couldn't load trainees: " + ((e&&e.message)||e)); }
  render();
};
window.cmLabAdminPick = async function(id){
  state.labAdmin = state.labAdmin || {};
  if(!id){ state.labAdmin.trainee = null; render(); return; }
  const r = (state.labAdmin.list||[]).find(x=>x.id===id) || {id, name:id};
  state.labAdmin.trainee = {id, name:r.name, loading:true}; render();
  let snap = null, rev = null;
  try{ [snap, rev] = await sharedGetMany(["progress:"+id, "labreview:"+id]); }catch(e){}
  const data = (snap && snap.data) || {};
  state.labAdmin.trainee = {id, name:r.name, subs:data["lab-subs"]||{}, log:data["cms-log"]||{}, drafts:data["lab-drafts"]||{}, pp:data["practice-progress"]||{}, rp:data.roleplayHistory||[], reviews:(rev && rev.items)||{}};
  render();
};
// What the activity list holds for one trainee: the Practice page's items, day by day (js/cm-practice.js: cmPracticePlan).
function adminTraineeHTML(t){
  const plan = typeof window.cmPracticePlan === "function" ? cmPracticePlan() : [];
  const subsOf = (prefix)=> Object.keys(t.subs).filter(k=>k===prefix || k.indexOf(prefix+":")===0);
  const written = (toolId)=> Object.entries(t.drafts[toolId]||{}).filter(([k,v])=>/^ta_/.test(k) && typeof v==="string" && v.trim().length>20);
  let empty = 0;
  const rows = plan.map(day=>day.items.map(it=>{
    const keys = (it.tool ? subsOf(it.id) : [it.id]).filter(k=>t.subs[k]);
    const p = it.tool ? t.pp[it.id] : null;
    const w = it.tool ? written(it.id) : [];
    const rps = it.rp ? t.rp.filter(x=>x.topicId===it.rp.topicId) : [];
    const legacy = Object.entries(t.log).filter(([k])=>it.tool ? k.indexOf(it.id+":")===0 && !t.subs[k] : (it.legacy && k===it.legacy));
    const has = keys.length || p || w.length || rps.length || legacy.length;
    const reviewed = t.reviews[it.id] || keys.some(k=>t.reviews[k]);
    if(!has && !reviewed){ empty++; return ""; }
    return `<details class="cmm-twrow"${state.labAdminOpen===it.id?" open":""}><summary><span class="cmm-day">Day ${day.day}</span> <b>${E(it.title)}</b> <span class="cmm-hint">${E(it.cat)}</span>
        ${p?`<span class="cmm-score ${band(p.bestScore)}">best ${p.bestScore}%</span>`:""}${keys.length?`<span class="px-tag">${keys.length} submitted</span>`:""}${reviewed?`<span class="px-tag done">Reviewed</span>`:""}${has?"":`<span class="cmm-todo">Nothing yet</span>`}</summary>
      ${rps.length?`<p class="cmm-hint">Live roleplay: ${rps.length} call${rps.length===1?"":"s"}, best ${Math.max(...rps.map(x=>x.score||0))}%.</p>`:""}
      ${w.map(([k,v])=>`<p class="cmm-hint" style="margin:8px 0 4px">✍ ${E(k.replace(/^ta_/,"").replace(/^[^_]+_/,""))}</p><div class="cmm-ans">${E(v)}</div>`).join("")}
      ${legacy.map(([k,v])=>`<p class="cmm-hint">Logged before reviews: ${E((cmTool(v.platform||"cms")||{}).short||"CMS")} ${E(v.caseId)} · ${fmtDate(v.at)}</p>`).join("")}
      ${keys.map(k=>subAdminHTML(t, k, !!it.tool)).join("")}
      ${reviewFormHTML(t, it.id, it.tool ? "Overall review of this activity" : "Your review")}</details>`;
  }).join("")).join("");
  return `<p><b>${E(t.name)}</b>: ${Object.keys(t.subs).length} submission${Object.keys(t.subs).length===1?"":"s"}, ${Object.keys(t.reviews).length} reviewed.</p>${rows}${empty?`<p class="cmm-hint">${empty} more activit${empty===1?"y has":"ies have"} nothing to review yet.</p>`:""}`;
}
function subAdminHTML(t, key, ownForm){
  const s = t.subs[key], def = DEFS[key] || {};
  const steps = def.steps || [];
  const data = s.data && def.renderData ? def.renderData(s.data, s) : "";
  return `<div style="border-top:1px dashed var(--line);margin-top:8px;padding-top:8px"><b>📤 ${E(def.title || s.title || key)}</b> <span class="cmm-hint">${fmtDate(s.at)}${s.attempts>1?` · attempt ${s.attempts}`:""}</span>
    ${s.evidence?`<p class="cmm-hint">${E(def.tool==="cms"?"CMS Case ID":"Result")}: <b>${E(s.evidence)}</b>${steps.length?` · steps confirmed ${steps.filter((_,i)=>s.steps&&s.steps[i]).length} of ${steps.length}`:""}</p>`:""}
    ${s.summary?`<div class="cmm-ans">${E(s.summary)}</div>`:""}
    ${s.text?`<div class="cmm-ans">${E(s.text)}</div>`:""}
    ${data}
    ${autoBoxHTML(s)}
    ${ownForm ? reviewFormHTML(t, key, "Your review of this submission") : ""}</div>`;
}
function reviewFormHTML(t, key, label){
  const rv = t.reviews[key] || {}, k = kid(key);
  return `<div class="cm-cms"><b>${E(label)}</b>${rv.at?` <span class="cmm-hint">saved ${fmtDate(rv.at)}</span>`:""}
    <div class="row"><input type="number" min="0" max="100" id="lrs_${k}" value="${E(rv.score!=null?rv.score:"")}" placeholder="Score 0–100" style="min-width:120px;width:120px">
      <select id="lrr_${k}" style="font:inherit;padding:7px 9px;border:1px solid var(--line);border-radius:8px"><option value="">Rating —</option>${RATINGS.map(r=>`<option ${rv.rating===r?"selected":""}>${r}</option>`).join("")}</select></div>
    <textarea class="cm-ta" id="lrc_${k}" style="min-height:80px;margin-top:8px" placeholder="Your comment: what's strong, what to fix, what to do next…">${E(rv.comment||"")}</textarea>
    <button class="btn btn-navy btn-sm" style="margin-top:8px" onclick="cmLabAdminSave('${key}', this)">Save review</button></div>`;
}
window.cmLabAdminSave = async function(key, btn){
  const t = (state.labAdmin||{}).trainee; if(!t || !t.id) return;
  const k = kid(key), v = (id)=> ((document.getElementById(id)||{}).value || "").trim();
  const score = v("lrs_"+k), rating = v("lrr_"+k), comment = v("lrc_"+k);
  if(score !== "" && !(Number(score) >= 0 && Number(score) <= 100)){ toast("Score: a number from 0 to 100."); return; }
  if(!score && !rating && !comment){ toast("Add a score, a rating or a comment first."); return; }
  if(btn){ btn.disabled = true; btn.textContent = "Saving…"; }
  // read the record again first, so two trainers reviewing the same trainee don't overwrite each other
  let cur = null; try{ cur = await sharedGet("labreview:"+t.id); }catch(e){}
  const rec = (cur && cur.items) ? cur : {items:{}};
  rec.items[key] = {score: score === "" ? null : Number(score), rating, comment: comment.slice(0, 4000), by: "Your trainer", at: new Date().toISOString()};
  rec.updatedAt = new Date().toISOString();
  const ok = await sharedSet("labreview:"+t.id, rec);
  t.reviews = rec.items;
  state.labAdminOpen = (cmPracticePlan().flatMap(d=>d.items).find(it=>it.id===key || key.indexOf(it.id+":")===0) || {}).id || null;
  toast(ok ? "Review saved: the trainee sees it beside their work." : "Couldn't save the review — check your connection.");
  render();
};

})();
