/* ============================================================
   LSH Case Management Training — the Training Tools hub (CMS, Docket, Records), the tool frame,
   Simulators, 📚 Knowledge Base and the Calendar Conflict Resolver.
   Loaded after the main portal script: anything assigned to window
   here replaces the portal function of the same name.
   ============================================================ */
(function(){
"use strict";

/* ---------------- styles ---------------- */
const st = document.createElement("style"); st.id = "cm-skillbuilders-css"; st.textContent = `
.cm-part h3{margin:0 0 6px;color:var(--navy);font-size:15.5px}
.cm-part .cm-intro{font-size:13px;color:var(--ink-soft);margin:0 0 12px;max-width:80ch}
.cm-scn{background:#F8F9FC;border-left:4px solid var(--navy);border-radius:10px;padding:12px 16px;margin:0 0 14px;font-size:13px;color:#37394A}
.cm-scn b{color:var(--navy)}
.cm-docs{border:1px dashed var(--line);border-radius:12px;padding:10px 14px;margin:0 0 14px;background:#FFFCF7}
.cm-docs-h{font-size:11.5px;font-weight:800;letter-spacing:.05em;text-transform:uppercase;color:var(--orange-deep);margin-bottom:6px}
.cm-doc-row{display:flex;align-items:center;justify-content:space-between;gap:10px;padding:6px 0;border-top:1px solid #F0EDE6;font-size:13px}
.cm-doc-row:first-of-type{border-top:none}
.cm-doc-row .t{font-weight:700;color:var(--ink)}.cm-doc-row .d{font-size:12px;color:var(--ink-soft);font-weight:500}
.cm-doc-row .btn{white-space:nowrap;flex-shrink:0}
.cm-doc-row > div:first-child{min-width:0;flex:1}
.cm-doc-row .cms{font-family:'IBM Plex Mono',monospace;font-size:10.5px;background:#EEF0F6;color:var(--navy);border-radius:999px;padding:2px 8px;white-space:nowrap}
.cm-table{width:100%;border-collapse:collapse;font-size:12.8px;margin:6px 0 10px}
.cm-table th,.cm-table td{border:1px solid var(--line);padding:7px 9px;text-align:left;vertical-align:top}
.cm-table th{background:#F3F4F9;color:var(--navy);font-size:12px}
.cm-table select,.cm-table input{font:inherit;font-size:12.5px;padding:5px 7px;border:1px solid var(--line);border-radius:7px;max-width:100%}
.cm-table tr.ok td{background:#EEF7F1}.cm-table tr.bad td{background:#FBEDEA}
.cm-why{display:block;font-size:11.5px;color:var(--ink-soft);margin-top:3px;font-weight:500}
.cm-res{margin-top:10px;font-size:13px}
.cm-check{display:flex;gap:9px;align-items:flex-start;padding:7px 10px;border:1px solid var(--line);border-radius:9px;margin-bottom:6px;font-size:13px;background:#fff;cursor:pointer}
.cm-check.ok{border-color:var(--success);background:#EEF7F1}.cm-check.bad{border-color:var(--danger);background:#FBEDEA}
.cm-calc{display:grid;grid-template-columns:minmax(0,1fr) 180px;gap:8px 12px;align-items:center;font-size:13px;margin:6px 0 10px}
.cm-calc input{font:inherit;padding:7px 9px;border:1px solid var(--line);border-radius:8px;width:100%}
.cm-calc input.ok{border-color:var(--success);background:#EEF7F1}.cm-calc input.bad{border-color:var(--danger);background:#FBEDEA}
.cm-ta{width:100%;min-height:130px;padding:10px 12px;border-radius:8px;border:1px solid var(--line);font-size:13px;font-family:inherit;resize:vertical}
.cm-cms{border:1.5px solid var(--navy);border-radius:12px;padding:12px 16px;margin:14px 0;background:#F4F6FB}
.cm-cms b{color:var(--navy)}
.cm-cms .row{display:flex;gap:8px;flex-wrap:wrap;align-items:center;margin-top:8px}
.cm-cms input{font:inherit;padding:7px 9px;border:1px solid var(--line);border-radius:8px;min-width:200px}
.cm-cms-from:not(:empty){font-size:11px;font-weight:700;color:#1F4E79;background:rgba(214,231,248,.75);border-radius:999px;padding:2px 8px;}
.cm-soon{font-size:10.5px;font-weight:700;text-transform:uppercase;letter-spacing:.04em;background:#FFF1DE;color:#9A5B00;border-radius:999px;padding:2px 8px;margin-left:6px}
.cm-tools{display:grid;grid-template-columns:repeat(auto-fit,minmax(250px,1fr));gap:14px;margin-bottom:16px}
.cm-tool{padding:16px 18px;display:flex;flex-direction:column;gap:8px}
.cm-tool.soon{opacity:.82}
.cm-tool p{margin:0;font-size:13px;color:var(--ink-soft)}
.cm-tool-h{display:flex;gap:12px;align-items:center}.cm-tool-h b{color:var(--navy);font-size:15px}
.cm-tool-ic{font-size:26px;width:46px;height:46px;border-radius:12px;background:#EEF0F6;display:flex;align-items:center;justify-content:center;flex-shrink:0}
.cm-badge{display:inline-block;font-size:11px;font-weight:700;border-radius:999px;padding:2px 9px;margin-top:3px}
.cm-badge.live{background:#E3F4EA;color:#1D6B3C}.cm-badge.soon{background:#FFF1DE;color:#9A5B00}
.cm-tool-act{display:flex;gap:8px;flex-wrap:wrap;margin-top:auto}
.cm-tool-url{font-family:'IBM Plex Mono',monospace;font-size:11px;color:var(--ink-soft);word-break:break-all}
.cl-lines-mini{display:flex;flex-wrap:wrap;gap:6px}.cl-lines-mini span{font-size:11.5px;background:#EEF0F6;color:var(--navy);border-radius:999px;padding:3px 9px}
.cm-tool-note{font-size:12.3px!important;margin-top:auto!important}
.cm-tool-admin{display:grid;grid-template-columns:90px minmax(0,1fr) 150px;gap:8px;align-items:center;margin-bottom:8px;font-size:13px}
.cm-tool-admin input,.cm-tool-admin select{font:inherit;padding:7px 9px;border:1px solid var(--line);border-radius:8px;min-width:0}
@media (max-width:600px){.cm-tool-admin{grid-template-columns:1fr}}
#cm-toolframe{position:fixed;left:0;right:0;bottom:0;top:0;z-index:9000;background:var(--paper,#F7F6F2);display:flex;flex-direction:column}
#cm-toolframe[hidden]{display:none}
.cm-tf-bar{display:flex;gap:10px;align-items:center;padding:6px 14px;background:#F3F4F9;border-bottom:1px solid var(--line);flex-wrap:wrap}
.cm-tf-name{flex:1;min-width:0;font-size:13px;font-weight:700;color:var(--navy);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.cm-tf-hint{font-size:11.5px;color:var(--ink-soft)}.cm-tf-hint b{color:var(--navy)}
.cm-tf-bar .btn-ghost{background:#fff}
/* the course's top bar (with its 🧰 Tools menu) stays above the tool frame: #app is its own
   stacking layer, so lift it and hide everything in it but the top bar while a tool is open.
   #app's own box still covers the page, so let clicks and scrolling pass through it to the tool. */
body.cm-tf-open #app{z-index:9001;pointer-events:none}
body.cm-tf-open #app > :not(.topbar):not(.view-mode-strip){visibility:hidden}
body.cm-tf-open #app > .topbar,body.cm-tf-open #app > .view-mode-strip{pointer-events:auto}
/* while a tool is open, only 🧰 Tools is highlighted in the nav */
body.cm-tf-open .nav > button.active{background:transparent;color:#D7DAEC}
.cm-tf-newtab{background:var(--orange)!important;border-color:var(--orange)!important}
.cm-tf-body{flex:1;position:relative}
.cm-tf-body iframe{position:absolute;inset:0;width:100%;height:100%;border:0;background:#fff}
body.cm-tf-open{overflow:hidden}
#cm-toolpill{position:fixed;right:18px;bottom:18px;z-index:8999;box-shadow:0 6px 22px rgba(0,0,0,.25);border-radius:999px}
#cm-toolpill[hidden]{display:none}
@media (max-width:760px){.cm-tf-hint,.cm-tf-long{display:none}}
/* Side by side: the tool on the right, the course (the slide, its steps, the case documents) still open and working
   on the left, for steps where the trainee works in a tool and reads the page at once. Drag the edge to resize. */
body.cm-tf-split #cm-toolframe{left:auto;width:var(--cm-tf-w,50vw);border-left:3px solid var(--orange,#DB8437);box-shadow:-10px 0 28px rgba(0,0,0,.2)}
body.cm-tf-split.cm-tf-open #app > *{pointer-events:auto}
body.cm-tf-split.cm-tf-open #app > :not(.topbar){box-sizing:border-box;width:auto!important;max-width:calc(100vw - var(--cm-tf-w,50vw))!important;margin-left:0!important;margin-right:0!important;overflow-x:clip;min-width:0}
body.cm-tf-split.cm-tf-open #app > :not(.topbar):not(.view-mode-strip){visibility:visible}
/* the slide takes the whole left side: its side column and the presenter figure step aside until the tool closes */
body.cm-tf-split.cm-tf-open #app main:has(#lessonStage){grid-template-columns:minmax(0,1fr)!important}
body.cm-tf-split.cm-tf-open #app main:has(#lessonStage) > :not(#lessonStage):not(:has(#lessonStage)){display:none!important}
body.cm-tf-split.cm-tf-open .stage-body{grid-template-columns:minmax(0,1fr)!important}
body.cm-tf-split.cm-tf-open .stage-body > :not(#lessonSlideWrap){display:none!important}
body.cm-tf-split.cm-tf-open{overflow:auto}
.cm-tf-drag{display:none;position:absolute;left:-7px;top:0;bottom:0;width:12px;cursor:col-resize;z-index:3}
body.cm-tf-split .cm-tf-drag{display:block}
body.cm-tf-dragging .cm-tf-body iframe{pointer-events:none}
body.cm-tf-split .cm-tf-hint,body.cm-tf-split .cm-tf-long{display:none}
.cm-tf-split-btn[aria-pressed="true"]{background:var(--navy)!important;color:#fff!important}
@media (max-width:900px){.cm-tf-split-btn,.cm-tf-pop{display:none!important}body.cm-tf-split #cm-toolframe{left:0;width:auto;border-left:0}body.cm-tf-split.cm-tf-open #app > :not(.topbar){max-width:none!important}body.cm-tf-split.cm-tf-open #app > :not(.topbar):not(.view-mode-strip){visibility:hidden}}
.cm-radio{display:flex;flex-direction:column;gap:6px;margin:6px 0 10px}
.cm-radio label{display:flex;gap:8px;align-items:flex-start;border:1px solid var(--line);border-radius:9px;padding:8px 10px;font-size:13px;background:#fff;cursor:pointer}
.cm-skill-cta{margin-top:14px;border:1.5px solid var(--orange);background:#FFF6EC;border-radius:12px;padding:12px 16px;display:flex;gap:12px;align-items:center;justify-content:space-between;flex-wrap:wrap}
.cm-skill-cta b{color:var(--navy);font-size:14px}.cm-skill-cta p{margin:2px 0 0;font-size:12.5px;color:#5A4A32}
.cm-lib-folder{margin-bottom:18px}
.cm-lib-folder h3{font-size:14px;color:var(--navy);margin:0 0 8px}
.cm-key{font-size:11.8px;color:#6B2E26;background:#FBEDEA;border-radius:7px;padding:5px 8px;margin-top:5px;font-weight:600}
.cm-filter{display:flex;gap:6px;flex-wrap:wrap;margin:0 0 16px}
.cm-lesson-visual{margin:12px 0 4px}
.svg-diagram-card .cm-lesson-visual{text-align:left}
/* Top-bar search: the input may shrink (the placeholder ends in "…" instead of spilling out of the box) */
@media(min-width:761px) and (max-width:1600px){.nav button{padding:7px 7px;font-size:12.5px}}
/* Top bar on laptops and desktops: nothing overlaps. The course title gives way first, as a whole: it shows in
   full or not at all (when it doesn't fit beside the logo it wraps below it, out of sight), never cut to "…";
   then the nav wraps its last buttons onto a second line. */
@media(min-width:1181px){
  .topbar .brand{flex:0 1 auto;min-width:74px;flex-wrap:wrap;height:46px;overflow:hidden}  /* the page header keeps its width; the nav wraps its last buttons first */
  .topbar .brand-text{flex:0 0 auto;overflow:visible}
  .topbar-right{min-width:auto}
  .topbar .nav{flex:0 1 auto;min-width:0;flex-wrap:wrap;column-gap:0;row-gap:4px}
  .topbar .nav>*+*{margin-left:2px}  /* margins, not column-gap: Chrome leaves the gap out of a wrapping row's width */
}
/* Tablets and phones: the full course name too (tablets: the search box has its own row; phones: the title alone,
   on a second line if it needs one, as index.html's phone styles intend) */
.topbar .brand-text b,.topbar .brand-text span{max-width:none;text-overflow:clip}
@media(min-width:761px) and (max-width:1180px){.topbar .brand{flex:0 0 auto}}
@media(max-width:760px){.topbar .brand-text span{display:none}.topbar .brand-text b{white-space:normal;line-height:1.2}}
/* CM has two more nav items than EA/PA: on laptop widths the search box is just its icon
   (on tablets it has its own row, full width).
   Clicking it opens the box over the start of the nav (the nav doesn't move); it stays open while
   results are showing. Nothing is clipped, so the results list can drop down. */
@media(min-width:1181px) and (max-width:1600px){
}
@media(max-width:700px){.cm-calc{grid-template-columns:1fr}.cm-doc-row{flex-wrap:wrap}}
`; document.head.appendChild(st);

/* ---------------- small helpers ---------------- */
const E = (s)=> (typeof esc==="function" ? esc(s) : String(s==null?"":s).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c])));
const money = (n)=> (n<0?"−":"") + "$" + Math.abs(Number(n)||0).toLocaleString("en-US",{minimumFractionDigits:2, maximumFractionDigits:2});
const cmState = ()=> (toolState.cm = toolState.cm || {});
const CM_UI = {};                                  // key -> config for the current tool
window.__cmUI = CM_UI;                             // read-only hook for automated answer-key tests
const toolOfKey = (key)=> key.split(":")[0];
const dayOfTool = (id)=> { const t = PRACTICE_TOOLS.find(x=>x.id===id); return t ? parseInt(String(t.relates).replace(/\D/g,""),10) : null; };
async function scorePart(key, score){ await bumpPracticeProgress(toolOfKey(key), score); if(score>=90 && typeof burstConfetti==="function") burstConfetti(); }
const part = (title, intro, inner)=> `<div class="cm-part"><h3>${E(title)}</h3>${intro?`<p class="cm-intro">${intro}</p>`:""}${inner}</div>`;
const scenario = (html)=> `<div class="cm-scn">${html}</div>`;

/* ================================================================
   TRAINING TOOLS HUB — the portal embeds every LSH training platform.
   Each tool can be opened inside the portal (a persistent frame that
   keeps its session while you move around the lessons) or on its own
   in a new tab. Admins set each tool's address and status for everyone
   (shared key settings:tools).
   ================================================================ */
const CM_TOOL_DEFAULTS = [
  {id:"cms", icon:"🗂", name:"LSH Case Management System", short:"CMS", status:"live",
   url:"https://lshcasemanagementtraining-trainingcrm.pages.dev",
   desc:"Where the case work actually happens: start the case, key the intake facts, upload each document by category, and log Tasks, Notes, Liens, Chronology and the Financial Ledger.",
   evidence:"CMS Case ID", idHint:"CMS Case ID (e.g. LSH-2026-PI-000123)"},
  {id:"docket", icon:"⚖️", name:"Docket System (LSH Training Portal)", short:"Docket", status:"live",
   url:"https://cm-training-activity.pages.dev/simulators/docket.html", portalSim:true,
   desc:"Law-firm docketing: court notices and mail arrive in an inbox. Put what belongs on the court docket there and calendar every deadline it triggers, with a responsible attorney and reminders. The John Doe assignment uses this course's counting rules; a federal case teaches FRCP 6.",
   evidence:"Docket reference", idHint:"Docket reference (e.g. DKT-DOE-1234)"},
  {id:"records", icon:"🗂", name:"Medical Records Requests (LSH Training Portal)", short:"Records", status:"live",
   url:"https://cm-training-activity.pages.dev/simulators/records.html", portalSim:true,
   desc:"A medical records request platform on the John Doe file: fix the HIPAA authorization, request records and itemized bills from the right departments, handle rejections, fees and follow-ups, and review and log what comes back before the attorney's date.",
   evidence:"Request number", idHint:"Request number (e.g. MRR-2026-00012)"},
  {id:"efiling", icon:"🏛", name:"Court E-Filing (LSH Training Portal)", short:"E-Filing", status:"live",
   url:"https://cm-training-activity.pages.dev/simulators/efiling.html", portalSim:true,
   desc:"File with the court: a federal filing through electronic case filing, and state filings through an e-filing provider (including John Doe's First Amended Complaint). Fix each document first, then handle service and fees, and see whether the clerk accepts it.",
   evidence:"Filing reference", idHint:"Filing reference (e.g. ENV-88213407)"},
  // Shared simulators on the LSH Training Portal (used by every program). The course
  // opens them with ?program=CM and the trainee's name and batch, so results carry them.
  // The Call Simulator is ☎ LSH Ring Channel's (the training phone): the Main Portal's /simulators/call.html opens it
  // signed in (→ /api/launch?tool=ringchannel&to=calls), &program=CM says the course the call counts in, and &line= and
  // &mode=graded the line and its graded call. It opens in its own tab (the Portal's sign-in cookie, like the
  // Calendaring Simulators), and a graded call is reported to the Portal's /api/call-results, so it still counts here.
  {id:"calls", icon:"📞", name:"Call Simulator (☎ LSH Ring Channel)", short:"Call Simulator", status:"live",
   url:"https://cm-training-activity.pages.dev/simulators/call.html", portalSim:true,
   desc:"Live practice calls on the training phone, spoken aloud: the phone rings on the line the step names, you answer with a headset and use its own keys (mute, hold, transfer) and 🔎 Case lookup. Each call ends with the note it requires, and both are scored on the line's Mock Calls Metrics. Take a graded call, practice with an 🤖 AI caller, or answer a trainer-led mock call on the same phone.",
   evidence:"Score", idHint:"Score (e.g. 82%)"},
  {id:"email", icon:"✉️", name:"Email Workspace (LSH Training Portal)", short:"Email Workspace", status:"live",
   url:"https://cm-training-activity.pages.dev/simulators/email.html", portalSim:true,
   desc:"A Gmail-style practice inbox with the CM inbox: create labels, clear the inbox with one decision per email, reply, forward and report phishing. Graded on filing, security, triage and writing.",
   evidence:"Score", idHint:"Score"},
  {id:"replies", icon:"📨", name:"Email Replies (LSH Training Portal)", short:"Email Replies", status:"live",
   url:"https://cm-training-activity.pages.dev/simulators/email-replies.html", portalSim:true,
   desc:"One email at a time from the John Doe file: the client, the adjuster, a lienholder, defense counsel, your attorney, plus a phishing attempt. Reply on the portal, or have it sent to your own inbox and reply from there. Scored with a model reply.",
   evidence:"Score", idHint:"Score"},
  {id:"calendaring", icon:"🗓", name:"Calendaring Simulators (LSH Training Portal)", short:"Calendaring", status:"live",
   url:"https://cm-training-activity.pages.dev/simulators/calsim.html?track=litigation", portalSim:true,
   desc:"The Litigation Week: a deposition, a hearing and a mediation are fixed, and the prep, debrief, client and expert calls have to fall in the right order around them. Build it on the calendar, run the automated review under the attorney's rules, then submit it for your trainer's score and feedback. It opens in its own tab on the Training Portal.",
   evidence:"Score", idHint:"Score"}
];
function cmTool(id){
  const d = CM_TOOL_DEFAULTS.find(t=>t.id===id); if(!d) return null;
  const o = ((state.toolSettings||{})[id])||{};
  let url = String(o.url!=null ? o.url : d.url || "").trim().replace(/\/+$/,"");
  if(id==="calendaring" && /\/simulators\/calendar\.html$/i.test(url)) url = d.url;   // a saved address from before the Calendaring Simulators moved
  if(id==="calls" && /calls=1|trainingcrm\.pages\.dev/i.test(url)) url = d.url;      // a saved address from before the Call Simulator moved to ☎ LSH Ring Channel
  // A Portal simulator always opens its own page: a saved address on the Portal that names another page (Email Replies saved
  // as the Email Workspace, a simulators hub address, a page that has moved) goes to the tool's own simulator instead.
  if(d.portalSim && /cm-training-activity\.pages\.dev/i.test(url)){
    const own = d.url.replace(/^https:\/\/[^/]+/, "").split("?")[0], saved = url.replace(/^https:\/\/[^/]+/, "").split("?")[0];
    if(saved !== own) url = d.url;
  }
  const status = o.status || d.status;
  return Object.assign({}, d, {url, status, live: status==="live" && /^https:\/\//i.test(url)});
}
window.cmTool = cmTool;
function toolHref(t){
  if(t.id!=="cms" && !t.portalSim && !t.cmsHosted) return t.url;
  // The CMS serves every LSH program: ?program=cm opens it in the CM context (its Training Library filter and the tag on saved cases),
  // and from=cm lets a registered trainee in with just their name (no CMS account). The Call Simulator in the CMS takes program=CM.
  const q = new URLSearchParams(t.id==="cms" ? {program:"cm", from:"cm"} : t.cmsHosted ? {program:"CM", from:"cm"} : {program:"CM"});
  const name = String(state.certName || state.traineeName || "").trim(), batch = String(state.traineeBatch || "").trim();
  if(name && !state.isAdmin) q.set("name", name);
  if(batch && !state.isAdmin) q.set("batch", batch);
  return t.url + (t.url.includes("?") ? "&" : "?") + q.toString();
}
window.cmCmsUrl = function(){ return cmTool("cms").url; };
async function loadToolSettings(){
  try{ const s = await sharedGet("settings:tools"); if(s && typeof s==="object") state.toolSettings = s.tools || s; }catch(e){}
}

/* ---- the persistent in-portal frame (lives outside #app, so render() never reloads it) ---- */
const frames = {};                  // tool id → iframe
let frameShell = null, currentFrame = null;
let currentAct = null;              // the Practice Lab activity the tool was opened for (js/cm-lab.js), if any: its Return pill
function ensureShell(){
  if(frameShell) return frameShell;
  frameShell = document.createElement("div");
  frameShell.id = "cm-toolframe"; frameShell.hidden = true;
  // The tool list lives in the course's top bar (🧰 Tools menu); the frame opens under it,
  // so the course navigation stays on screen while a tool is open.
  frameShell.innerHTML = `<div class="cm-tf-bar"><span class="cm-tf-name"></span>
    <span class="cm-tf-hint">Sign-in won't stay? Use <b>New tab</b>.</span>
    <button class="btn btn-ghost btn-sm cm-tf-split-btn" onclick="cmToolSplit()" aria-pressed="false" title="Keep the course open beside the tool">⧉ Side by side</button>
    <button class="btn btn-ghost btn-sm cm-tf-pop" onclick="cmToolPop()" title="Open the tool in its own window, on your second screen if you have one">🖥 Second screen</button>
    <button class="btn btn-navy btn-sm cm-tf-newtab" onclick="openTool(null,'tab')">New tab ↗</button>
    <button class="btn btn-ghost btn-sm" onclick="closeToolFrame()">✕ Close<span class="cm-tf-long"> and back to training</span></button></div>
    <div class="cm-tf-body"></div><div class="cm-tf-drag" title="Drag to resize"></div>`;
  document.body.appendChild(frameShell);
  dragEdge(frameShell.querySelector(".cm-tf-drag"));
  const pill = document.createElement("button");
  pill.id = "cm-toolpill"; pill.hidden = true; pill.className = "btn btn-navy";
  pill.onclick = ()=> openTool(currentFrame, null, null, currentAct);
  document.body.appendChild(pill);
  // Esc closes a full-page tool; side by side, the trainee is working in both, so it stays (✕ Close closes it)
  document.addEventListener("keydown", e=>{ if(e.key==="Escape" && !frameShell.hidden && !document.body.classList.contains("cm-tf-split")) closeToolFrame(); });
  window.addEventListener("resize", placeFrame);
  // the top bar is never covered: the frame starts under it, and moves when the bar's height changes
  try{ const tb = document.querySelector(".topbar"); if(tb && "ResizeObserver" in window) new ResizeObserver(placeFrame).observe(tb); }catch(e){}
  return frameShell;
}
/* ---- side by side and the second screen ---- */
const panes = {};                   // frame id → {name, icon, url} for a page opened in the frame (not a training platform)
const lsGet = (k, d)=>{ try{ const v = localStorage.getItem(k); return v === null ? d : v; }catch(e){ return d; } };
const lsSet = (k, v)=>{ try{ localStorage.setItem(k, v); }catch(e){} };
const canSplit = ()=> window.innerWidth > 900;
function applySplitWidth(){ const f = Math.min(0.72, Math.max(0.3, parseFloat(lsGet("cm-tf-w", "0.5")) || 0.5)); document.body.style.setProperty("--cm-tf-w", Math.round(f * 100) + "vw"); }
function setSplit(on){
  on = !!on && canSplit();
  applySplitWidth();
  document.body.classList.toggle("cm-tf-split", on);
  if(frameShell) paintShell();
  window.dispatchEvent(new Event("resize"));   // the slide on the left fits its new width
}
window.cmToolSplit = function(on){
  const next = on === undefined ? !document.body.classList.contains("cm-tf-split") : !!on;
  lsSet("cm-tf-split", next ? "1" : "0"); setSplit(next);
};
function dragEdge(h){
  if(!h) return;
  h.addEventListener("pointerdown", e=>{
    e.preventDefault(); h.setPointerCapture(e.pointerId); document.body.classList.add("cm-tf-dragging");
    const move = ev=>{ lsSet("cm-tf-w", String(Math.min(0.72, Math.max(0.3, 1 - ev.clientX / window.innerWidth)))); applySplitWidth(); };
    const up = ()=>{ h.removeEventListener("pointermove", move); h.removeEventListener("pointerup", up); document.body.classList.remove("cm-tf-dragging"); window.dispatchEvent(new Event("resize")); };
    h.addEventListener("pointermove", move); h.addEventListener("pointerup", up);
  });
}
/* the tool (or page) in its own window: on another screen when the browser can say where one is (Window Management
   API, after the trainee allows it), else beside this window. The course stays here, the tool goes there. */
window.cmToolPop = async function(){
  const id = currentFrame; if(!id) return;
  const pg = panes[id], t = cmTool(id), href = pg ? pg.url : (t ? toolHref(t) : ""); if(!href) return;
  let place = {left: window.screenX + window.outerWidth, top: window.screenY, width: Math.round(screen.availWidth / 2), height: screen.availHeight};
  try{
    if("getScreenDetails" in window){
      const sd = await window.getScreenDetails(), other = sd.screens.find(s=> s !== sd.currentScreen);
      if(other) place = {left: other.availLeft, top: other.availTop, width: other.availWidth, height: other.availHeight};
    }
  }catch(e){ /* not allowed or not supported: beside this window */ }
  const w = window.open(href, "lsh-tool-" + id, `popup,left=${place.left},top=${place.top},width=${place.width},height=${place.height}`);
  if(!w){ if(typeof toast==="function") toast("Your browser blocked the new window. Allow pop-ups for this site, or use New tab."); return; }
  closeToolFrame();
  if(typeof toast==="function") toast(`${pg ? pg.name : t.short} is open in its own window${place.left >= window.screenX + window.outerWidth ? "" : ""}: move it to your second screen.`);
};
/* a course page (a case document) in the same frame, beside the slide */
window.openPane = function(key, url, name, icon, mode){
  if(mode === "tab"){ window.open(url, "_blank", "noopener"); return; }
  ensureShell();
  panes[key] = {name, icon: icon || "📄", url};
  if(!frames[key] || frames[key].dataset.src !== url){
    if(frames[key]) frames[key].remove();
    const f = document.createElement("iframe");
    f.dataset.src = url; f.dataset.base = url; f.title = name; f.src = url;
    frameShell.querySelector(".cm-tf-body").appendChild(f); frames[key] = f;
  }
  currentFrame = key; currentAct = null;
  setSplit(mode === "split" || (mode !== "full" && lsGet("cm-tf-split", "0") === "1"));
  paintShell();
  frameShell.hidden = false; document.body.classList.add("cm-tf-open");
  placeFrame();
  document.getElementById("cm-toolpill").hidden = true;
  if(typeof render==="function") repaintToolsMenu();
};
// Start the frame just under the course's top bar.
function placeFrame(){
  if(!frameShell || frameShell.hidden) return;
  const tb = document.querySelector(".topbar");
  const top = tb ? Math.max(0, Math.round(tb.getBoundingClientRect().bottom)) : 0;
  frameShell.style.top = top + "px";
}
function paintShell(){
  const t = cmTool(currentFrame);
  const pg = panes[currentFrame];
  frameShell.querySelector(".cm-tf-name").textContent = pg ? `${pg.icon} ${pg.name}` : t ? `${t.icon} ${t.name.replace(/ \((LSH Training Portal|LSH CMS|☎ LSH Ring Channel)\)$/,"")}` : "";
  const sb = frameShell.querySelector(".cm-tf-split-btn"); if(sb) sb.setAttribute("aria-pressed", document.body.classList.contains("cm-tf-split") ? "true" : "false");
  Object.entries(frames).forEach(([id,f])=>{ f.style.display = id===currentFrame ? "block" : "none"; });
}
// "↩ Return to …" shows only on the Practice pages, and only while the activity it came from isn't finished.
function syncPill(){
  const pill = document.getElementById("cm-toolpill"); if(!pill) return;
  const t = cmTool(currentFrame), open = frameShell && !frameShell.hidden;
  const pending = !!currentAct && !(window.cmLabDone && cmLabDone(currentAct));
  pill.hidden = !(t && !open && pending && ["practice","tool"].includes(state.view));
  if(!pill.hidden) pill.textContent = `${t.icon} Return to ${t.short}`;
}
window.cmFrameSyncPill = syncPill;
// extra: an optional query string for this opening, e.g. "mock=MC-04" opens that CMS Training Library case.
// act: the Practice Lab activity the tool is opened for (js/cm-lab.js): the Return pill shows while it isn't submitted.
window.openTool = function(id, mode, extra, act){
  id = id || currentFrame || "cms";
  const t = cmTool(id);
  if(!t){ return; }
  if(!t.live){ toast(`${t.icon} ${t.name} is coming soon. For now, log this step as a Task in the CMS.`); return; }
  let href = toolHref(t);
  if(extra) href += (href.includes("?") ? "&" : "?") + extra;
  // The CMS in a tab: signed in with a fresh ticket (no log-in page, as in the frame), and kept reachable (no noopener), so
  // "File it in the CMS" and the open-case lookup (js/cm-doc-filing.js, js/cm-cms-case.js) work with a CMS tab too.
  if(mode==="tab" && id==="cms"){
    const w = window.open("", "_blank");
    if(!w){ window.open(href, "_blank", "noopener"); return; }
    (window.__cmsTabs = window.__cmsTabs || []).push(w);
    const go = (u)=>{ try{ w.location.href = u; }catch(e){} setTimeout(()=>{ if(window.CMCase) CMCase.ask(); }, 2500); };
    if(window.LSHToolLinks) LSHToolLinks.ticketed(href).then(go, ()=>go(href)); else go(href);
    return;
  }
  if(mode==="tab" || id==="calendaring" || id==="calls"){ window.open(href, "_blank", "noopener"); return; }   // the Calendaring Simulators and the Call Simulator (☎ LSH Ring Channel, through the Portal) use the Portal's sign-in cookie, which a frame doesn't send
  ensureShell();
  currentAct = act || null;
  // reopening a tool without a new address keeps it as it was (its session and the page it's on)
  if(!frames[id] || (extra && frames[id].dataset.src !== href) || (!extra && frames[id].dataset.base !== toolHref(t))){
    if(frames[id]) frames[id].remove();
    const f = document.createElement("iframe");
    f.dataset.src = href; f.dataset.base = toolHref(t); f.title = t.name;
    // microphone: the Call Simulator listens when trainees answer by voice
    f.setAttribute("allow", "microphone; autoplay; clipboard-read; clipboard-write; fullscreen");
    f.setAttribute("referrerpolicy", "no-referrer-when-downgrade");
    // the CMS opens signed in, with no log-in page: a trainee's address gets a fresh ticket (js/lsh-tool-links.js)
    if(window.LSHToolLinks) LSHToolLinks.ticketed(href).then(u=>{ if(f.dataset.src === href) f.src = u; }); else f.src = href;
    frameShell.querySelector(".cm-tf-body").appendChild(f);
    frames[id] = f;
  }
  currentFrame = id;
  setSplit(mode === "split" || (mode !== "full" && lsGet("cm-tf-split", "0") === "1"));
  paintShell();
  frameShell.hidden = false; document.body.classList.add("cm-tf-open");
  if(!document.body.classList.contains("cm-tf-split")) window.scrollTo(0, 0);
  placeFrame();
  document.getElementById("cm-toolpill").hidden = true;
  if(typeof render==="function") repaintToolsMenu();
};
window.closeToolFrame = function(){
  if(!frameShell) return;
  frameShell.hidden = true; document.body.classList.remove("cm-tf-open");
  if(document.body.classList.contains("cm-tf-split")){ document.body.classList.remove("cm-tf-split"); window.dispatchEvent(new Event("resize")); }
  repaintToolsMenu();
  const t = cmTool(currentFrame), pill = document.getElementById("cm-toolpill");
  syncPill();
};
window.openCms = function(mode){ openTool("cms", mode); };

/* Tool step: the trainee does the work in a training platform, then logs the ID here.
   A tool that isn't live yet falls back to a CMS Task so no step is ever blocked. */
/* The Case ID of the case open in the CMS (js/cm-cms-case.js). The CMS is integrated with the course, so a
   step that logs CMS work starts with the open case's ID instead of asking the trainee to copy it across. */
function cmsCaseId(platform){ return platform === "cms" && window.CMCase ? CMCase.id() : ""; }

function toolStep(toolId, key, what){
  if(window.cmLabStepHTML) return cmLabStepHTML(key, toolId, what);   // the step, done in the tool and submitted for review (js/cm-lab.js)
  const t = cmTool(toolId), saved = ((state.cmsLog||{})[key]||{}), k = key.replace(/\W/g,"_");
  const fallback = !t.live && toolId!=="cms";
  return `<div class="cm-cms"><b>${t.icon} Do this in the ${E(t.name)}</b>${t.live?"":` <span class="cm-soon">coming soon</span>`}
    <p style="font-size:12.8px;margin:6px 0 0;color:#37394A">${what}</p>
    ${fallback?`<p style="font-size:12.3px;margin:6px 0 0;color:var(--ink-soft)">Until the ${E(t.short)} platform is live, add this as a <b>Task</b> in the CMS case and log your CMS Case ID below.</p>`:""}
    <div class="row">
      ${t.live?`<button class="btn btn-navy btn-sm" onclick="openTool('${toolId}')">Open ${E(t.short)}</button><button class="btn btn-ghost btn-sm" onclick="openTool('${toolId}','tab')" title="Open in a new tab">↗</button>`
              :`<button class="btn btn-navy btn-sm" onclick="openTool('cms')">Open CMS</button>`}
      <input id="cmsId_${k}" placeholder="${E(fallback?cmTool("cms").idHint:t.idHint)}" value="${E(saved.caseId||cmsCaseId(fallback?"cms":toolId))}"${(fallback||toolId==="cms")?' data-cms-id="1"':""}>${(fallback||toolId==="cms")?`<span class="cm-cms-from" data-cms-note>${cmsCaseId("cms")?"from the CMS":""}</span>`:""}
      <button class="btn btn-ghost btn-sm" onclick="cmLogCms('${key}','${fallback?"cms":toolId}')">Log my work</button>
      <span id="cmsLogged_${k}" style="font-size:12px;color:var(--success)">${saved.at?`✓ Logged ${fmtDate(saved.at)}`:""}</span>
    </div></div>`;
}
const cmsStep = (key, what)=> toolStep("cms", key, what);
window.cmToolStep = toolStep;
window.cmLogCms = async function(key, platform){
  const el = document.getElementById("cmsId_"+key.replace(/\W/g,"_"));
  const t = cmTool(platform||"cms");
  const v = ((el && el.value || "").trim()) || cmsCaseId(t.id);   // nothing typed: the case open in the CMS
  if(el && v && el.value.trim() !== v) el.value = v;
  if(v.length < 3){ toast(`Enter the ${t.evidence} the ${t.short} gave you when you saved.`); return; }
  state.cmsLog = state.cmsLog || {};
  state.cmsLog[key] = {caseId:v, at:new Date().toISOString(), tool:toolOfKey(key), platform:t.id};
  await storeSet("cms-log", state.cmsLog);
  const s = document.getElementById("cmsLogged_"+key.replace(/\W/g,"_")); if(s) s.textContent = "✓ Logged just now";
  toast(`Logged. Your trainer can check it in the ${t.short}.`);
};


/* ---------------- building block: date and number checker (the calendar tool's Part D) ---------------- */
function calc(key, fields, afterCheck){
  CM_UI[key] = {type:"calc", fields, afterCheck};
  const st = cmState()[key] = cmState()[key] || {};
  return `<div class="cm-calc">${fields.map((f,i)=>`<label for="calc_${key.replace(/\W/g,"_")}_${i}">${f.label}</label>
      <input id="calc_${key.replace(/\W/g,"_")}_${i}" type="${f.type||"number"}" step="0.01" value="${E(st[i]==null?"":st[i])}" oninput="cmSet('${key}',${i},this.value)" placeholder="${f.type==="date"?"":"0.00"}">`).join("")}</div>
    <button class="btn btn-ghost btn-sm" onclick="cmCheckCalc('${key}')">Check my numbers</button><div class="cm-res" id="res_${key.replace(/\W/g,"_")}"></div>`;
}
window.cmCheckCalc = async function(key){
  const cfg = CM_UI[key], s = cmState()[key]||{}, k = key.replace(/\W/g,"_");
  let ok = 0; const notes = [];
  cfg.fields.forEach((f,i)=>{
    const el = document.getElementById(`calc_${k}_${i}`); const raw = el ? el.value : s[i];
    let good;
    if(f.type==="date") good = raw===f.answer;
    else { const v = parseFloat(String(raw).replace(/[$,\s]/g,"")); good = !isNaN(v) && Math.abs(v - f.answer) <= (f.tol==null?1:f.tol); }
    if(good) ok++; else notes.push(`<li><b>${f.label.replace(/<[^>]+>/g,"")}:</b> expected ${f.type==="date"?f.answer:money(f.answer)}${f.hint?` — ${f.hint}`:""}</li>`);
    if(el){ el.classList.toggle("ok",good); el.classList.toggle("bad",!good); }
  });
  const score = Math.round(ok/cfg.fields.length*100);
  document.getElementById("res_"+k).innerHTML = `<b style="color:${score>=80?"var(--success)":"var(--danger)"}">${ok}/${cfg.fields.length} correct (${score}%)</b>${notes.length?`<ul style="margin:6px 0 0;padding-left:18px">${notes.join("")}</ul>`:""}${cfg.afterCheck?`<div style="margin-top:8px">${cfg.afterCheck}</div>`:""}`;
  await scorePart(key, score);
};

window.cmSet = function(key, i, v){ const s = cmState()[key] = cmState()[key] || {}; s[i] = v; };

/* ---------- the retained Calendar tool, re-built for a CM docket ---------- */
const _origCalBody = window.renderCalendarBody;
window.renderCalendarBody = function(body){
  const savedBrief = document.getElementById("calPromptInput") ? document.getElementById("calPromptInput").value : "";
  _origCalBody(body);               // builds the week grid (Part A) with the CM docket events
  const screens = body.querySelectorAll(".wizard-screen");
  if(screens.length < 4) return;
  // Part B: docket briefing for the handling attorney (written by the trainee)
  screens[1].innerHTML = part("Weekly Docket Briefing for the Handling Attorney",
    "Using your resolved week, write the BLUF briefing the attorney reads on Monday: hard deadlines first (brief deadline, SOL filing, RFA responses, strike list), what moved and why, what needs a decision.",
    `<textarea id="calPromptInput" class="cm-ta" style="min-height:170px" placeholder="BLUF: … &#10;Hard deadlines this week: … &#10;Moved: … &#10;Decisions needed: …"></textarea>
     <button class="btn btn-navy btn-sm" style="margin-top:10px" onclick="checkCalendarPrompt(this)">Review</button><div id="calPromptResult" style="margin-top:10px"></div>`);
  screens[2].innerHTML = part("Proactive Case Manager Tasks",
    "A strong Case Manager spots what is missing from the calendar: warning alerts before hard dates, 30-day client pulses, subpoena audits, payoff-letter follow-ups. Generate an AI read of your current week.",
    `<button class="btn btn-orange btn-sm" onclick="generateProactiveTasks()">Generate proactive tasks</button><div id="proactiveResult" style="margin-top:14px"></div>`);
  // dates as the trainee's case year has them (js/cm-case-dates.js rolls the file forward)
  const cd = iso => window.CM_CASE_DATES ? CM_CASE_DATES.text(iso) : iso;
  screens[3].innerHTML = part("Hard-Code the Scheduling Order Dates",
    "John Doe v. Robert Smith is in suit, and the Court's Scheduling Order (RS55, entered 12/10/2026) sets the dates that govern it. Read it and enter each deadline.",
    `<p class="cm-intro"><a href="case-doc.html?id=RS55" onclick="return window.cmCaseFlow && cmCaseFlow.doc ? cmCaseFlow.doc(event,'RS55') : true">📄 RS55 · Scheduling Order</a></p>` + calc("calendar:sched", [
      {type:"date", label:"Plaintiff's expert disclosure due", answer:cd("2027-03-15")},
      {type:"date", label:"Mediation completed by", answer:cd("2027-03-31")},
      {type:"date", label:"Defendant's expert disclosure due", answer:cd("2027-04-15")},
      {type:"date", label:"Close of discovery (expert depositions included)", answer:cd("2027-05-28")},
      {type:"date", label:"Pretrial conference (9:00 a.m., Courtroom 4A)", answer:cd("2027-08-12")},
      {type:"date", label:"Jury trial calendar term begins", answer:cd("2027-09-13")}
    ]) + toolStep("docket", "calendar:docket", "Enter the six Scheduling Order deadlines on the firm docket: the two expert disclosures, mediation, the close of discovery, the pretrial conference (9:00 a.m.) and the trial term. Add a warning alert before each one, and the proposed pretrial order seven days before the conference."));
  const labs = ["Calendar Conflict Resolver","Docket Briefing for the Attorney","Proactive CM Tasks","Hard-Code the Scheduling Order Dates"];
  toolState.wizardLabels = labs;
  body.querySelectorAll(".wizard-dot").forEach((d,i)=>{ if(labs[i]) d.title = labs[i]; });
  const pl = document.getElementById("wizardPartLabel"); const idx = toolState.wizardIndex||0;
  if(pl) pl.textContent = `Part ${idx+1} of 4 — ${labs[idx]}`;
  if(savedBrief){ const t = document.getElementById("calPromptInput"); if(t) t.value = savedBrief; }
};
window.checkCalendarPrompt = async function(btn){
  const text = (document.getElementById("calPromptInput")||{}).value || "";
  const out = document.getElementById("calPromptResult");
  if(text.trim().length < 40){ toast("Write your briefing first."); return; }
  if(!(await useLabAttempt(4, "calendarBriefing"))) return;
  if(btn){ btn.disabled = true; }
  out.innerHTML = `<div class="ai-loading">Reviewing your docket briefing…</div>`;
  const week = calMergedEvents().sort((a,b)=>DAY_ORDER.indexOf(a.day)-DAY_ORDER.indexOf(b.day)||a.s-b.s).map(e=>`${typeof calDayDate==="function" ? calDayDate(e.day) : e.day} ${fmtHr(e.s)}–${fmtHr(e.e)} ${e.t} (${e.p}, ${e.type})`).join("\n");
  try{
    const report = await runRubricEvaluation("Weekly docket briefing for the handling attorney", `THE TRAINEE'S RESOLVED WEEK:\n${week}`, text,
      "BLUF first; hard legal deadlines (arbitration brief deadline, SOL complaint filing, RFA response review, strike list, case plan filing) listed first with dates/times; conflicts resolved without moving hard deadlines, depositions or the mediation; what moved and why; decisions needed from the attorney; concise.");
    out.innerHTML = renderEvaluationReport(report, 4); toolState.calPromptReport = `${report.totalScore}%`;
    await bumpPracticeProgress("calendar", report.totalScore);
  }catch(e){ out.innerHTML = renderAiErrorBlock(e, "Couldn't review the briefing"); }
  if(btn){ btn.disabled = false; }
};
window.generateProactiveTasks = async function(){
  const out = document.getElementById("proactiveResult");
  out.innerHTML = `<div class="ai-loading">Reading your calendar…</div>`;
  const week = calMergedEvents().map(e=>`${typeof calDayDate==="function" ? calDayDate(e.day) : e.day} ${fmtHr(e.s)} ${e.t} (${e.type})`).join("\n");
  try{
    const txt = await callAIText(`You are a senior personal-injury Case Manager coaching a trainee. Here is the trainee's week:\n${week}\n\nList 6 specific proactive tasks that are MISSING from this calendar (e.g., 30/14/7-day alerts before hard dates, preservation letters, payoff-letter follow-ups, 30-day client pulses, subpoena audits, W-9 requests, deposition prep packets). One line each: the task, the day to schedule it, and why. Plain text, numbered.`, 600);
    out.innerHTML = `<div class="card" style="padding:14px 18px;white-space:pre-wrap;font-size:13px">${E(txt)}</div>`;
  }catch(e){ out.innerHTML = renderAiErrorBlock(e, "Couldn't generate tasks"); }
};


/* ================================================================
   LESSON CARDS — render the slide's table/process/compare visual
   on Part 1 of each topic.
   ================================================================ */
const _origLessonCard = window.renderLessonCard;
window.renderLessonCard = function(l, i, d, unused, part){
  if(!l || !l.fourPart || !l.layout) return _origLessonCard(l, i, d, unused, part);
  let extra = l.layout ? `<div class="cm-lesson-visual">${renderLessonVisual(l)}</div>` : "";
  return _origLessonCard(Object.assign({}, l, {svgDiagram: extra}), i, d, unused, part);
};

/* ================================================================
   VIEWS: Training Tools · Simulators · 📚 Knowledge Base (the Case Documents and the Case File are the Case Flow's: js/cm-case-flow.js)
   ================================================================ */
window.renderTrainingTools = function(){
  const log = Object.entries(state.cmsLog||{});
  const toolTitle = (id)=> (PRACTICE_TOOLS.find(t=>t.id===id)||{}).title || id;
  const tools = CM_TOOL_DEFAULTS.map(d=>cmTool(d.id));
  return `<p class="eyebrow">Training Tools</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">🧰 LSH Training Tools</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 16px">This portal is your home base. The platforms you'll use on the job are built in here: open one <b>inside the portal</b> and it stays signed in while you go back and forth between lessons and Skill Builders. You can also open it on its own in a new tab. Skill Builders tell you exactly what to do in each tool, then ask for the ID it gives you so your trainer can review your work.</p>
    <div class="cm-tools">${tools.map(t=>`<div class="card cm-tool${t.live?"":" soon"}">
      <div class="cm-tool-h"><span class="cm-tool-ic">${t.icon}</span><div><b>${E(t.name)}</b><div><span class="cm-badge ${t.live?"live":"soon"}">${t.live?"● Live":"Coming soon"}</span></div></div></div>
      <p>${E(t.desc)}</p>
      ${t.live?`<div class="cm-tool-act"><button class="btn btn-primary btn-sm" onclick="openTool('${t.id}')">Open in portal</button><button class="btn btn-ghost btn-sm" onclick="openTool('${t.id}','tab')">New tab ↗</button></div>
        <div class="cm-tool-url">${E(t.url.replace(/^https:\/\//,""))}</div>`
      :`<p class="cm-tool-note">Until it's live, Skill Activity steps for this tool are logged as <b>Tasks</b> in the CMS.</p>`}
    </div>`).join("")}</div>
    <div class="card" style="padding:16px 20px;margin-bottom:16px"><b style="color:var(--navy)">How the portal and the tools work together</b>
      <ol style="font-size:13px;margin:8px 0 0;padding-left:20px"><li>Learn it in the day's lessons here.</li><li>Open the day's Skill Activity. It gives you the case documents and the task.</li><li>Do the file work in the tool. In the CMS: <b>Start a New Case</b>, key the facts, upload each document under the <b>CMS category</b> shown in 📁 Documents (Medical · Police · Case Files · Invoices · Bills · PD · Litigation · Others), and add Tasks, Notes, Liens and Chronology. Then <b>Save Case</b> to get your permanent Case ID.</li><li>Come back and log that ID in the Skill Activity's Check Your Work. Your trainer reviews your file in the tool.</li></ol>
      <p style="font-size:12.3px;color:var(--ink-soft);margin:10px 0 0">Signed in, but the tool asks you to sign in again inside the portal? Some browsers block sign-in inside an embedded page. Use <b>New tab ↗</b>. Your training portal stays open here.</p></div>
    <div class="card" style="padding:16px 20px;margin-bottom:16px"><b style="color:var(--navy)">My tool work log</b>
      ${log.length ? `<table class="cm-table"><thead><tr><th>Activity</th><th>Tool</th><th>ID</th><th>Logged</th></tr></thead><tbody>${log.map(([k,v])=>`<tr><td>${E(toolTitle(v.tool||k.split(":")[0]))}</td><td>${E((cmTool(v.platform||"cms")||{}).short||"CMS")}</td><td><b>${E(v.caseId)}</b></td><td>${fmtDate(v.at)}</td></tr>`).join("")}</tbody></table>` : `<p style="font-size:13px;color:var(--ink-soft);margin:6px 0 0">Nothing logged yet. Skill Builders will ask for your Case ID.</p>`}</div>
    ${state.isAdmin ? `<div class="card" style="padding:16px 20px;border-left:4px solid var(--orange)"><b style="color:var(--navy)">Admin: tool addresses</b>
      <p style="font-size:12.8px;color:var(--ink-soft);margin:4px 0 10px">Saved for every trainee. Switch a tool to <b>Live</b> once its address works. Each tool also stays reachable on its own at its address.</p>
      ${tools.map(t=>`<div class="cm-tool-admin"><span>${t.icon} <b>${E(t.short)}</b></span>
        <input id="toolUrl_${t.id}" value="${E(t.url)}" placeholder="https://…">
        <select id="toolStatus_${t.id}"><option value="live"${t.status==="live"?" selected":""}>Live</option><option value="coming"${t.status!=="live"?" selected":""}>Coming soon</option></select></div>`).join("")}
      <button class="btn btn-navy btn-sm" style="margin-top:8px" onclick="saveToolSettings()">Save tool settings</button></div>` : ""}`;
};
window.renderCmsSimulator = window.renderTrainingTools;

/* 🛠 Simulators: the shared simulators on the LSH Training Portal (calls, email workspace, email replies, calendaring), opened for CM. */
window.renderCallSimulator = function(){
  const calls = cmTool("calls"), mail = cmTool("email"), replies = cmTool("replies"), cal = cmTool("calendaring"), dk = cmTool("docket"), rec = cmTool("records"), ef = cmTool("efiling");
  const lines = [["☎","Reception & Front Desk","5 calls"],["📥","Intake Calls","5 calls"],["🤝","Client Communication","5 calls"],["⚖","Attorney Reporting","5 calls"],["🛡","Adjusters & Carriers","4 calls"],["🏥","Providers & Records","3 calls"]];
  const card = (t, extra)=> `<div class="card cm-tool${t.live?"":" soon"}">
      <div class="cm-tool-h"><span class="cm-tool-ic">${t.icon}</span><div><b>${E(t.name.replace(/ \((LSH Training Portal|LSH CMS)\)$/,""))}</b><div><span class="cm-badge ${t.live?"live":"soon"}">${t.live?(t.cmsHosted?"● Live in the LSH CMS":t.id==="calls"?"● Live on ☎ LSH Ring Channel":"● Live on the LSH Training Portal"):"Coming soon"}</span></div></div></div>
      <p>${E(t.desc)}</p>${extra||""}
      ${t.live?`<div class="cm-tool-act"><button class="btn btn-primary btn-sm" onclick="openTool('${t.id}')">Open here</button><button class="btn btn-ghost btn-sm" onclick="openTool('${t.id}','tab')">New tab ↗</button></div>`:""}
    </div>`;
  return `<p class="eyebrow">Simulators</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">🛠 Simulators</h1>
    <p style="color:var(--ink-soft);font-size:14px;max-width:80ch;margin:0 0 16px">The <b>Call Simulator</b> is in the LSH CMS (it opens already signed in, on the Case Management lines; pick a line below for its graded calls). Email, calendar, docketing, medical records and court e-filing practice live on the <b>LSH Training Portal</b>, shared by every program. They open here already set to <b>Case Management</b> and carrying your name and batch, so your scores reach your trainer. On calls the caller speaks: answer by voice (Chrome or Edge, allow the microphone) or by typing. Most calls end with the note the call requires, graded with the call.</p>
    <div class="cm-tools">${card(calls, `<div class="cl-lines-mini">${lines.map(([i,l,n])=>`<span role="button" tabindex="0" style="cursor:pointer" title="Open this line's graded calls" onclick="openTool('calls',null,'line=${encodeURIComponent(l)}&mode=graded')">${i} ${E(l)} · ${n}</span>`).join("")}</div>`)}${card(mail)}${card(replies)}${card(cal, state.isAdmin ? `<p style="font-size:12.5px;margin:6px 0 0"><button class="btn btn-navy btn-sm" onclick="openTool('calendaring','tab','view=scores')">📊 Calendar Scores (Litigation Week) ↗</button> Grade and give feedback there; scores also show on the Portal's Progress page under this program.</p>` : "")}${card(dk)}${card(rec)}${card(ef)}</div>
    <div class="card" style="padding:14px 18px;font-size:12.8px;color:var(--ink-soft)">Want more? Live Roleplay (🔥) has every call on John Doe v. Robert Smith, and the Calendar Conflict Resolver (Case Flow Day 4) has the John Doe docket and the Court's Scheduling Order.${state.isAdmin?` <b>Admin:</b> results appear on the Training Portal's Simulators page when you're signed in there as admin. Addresses are set in 🧰 Tools.`:""}</div>`;
};
window.saveToolSettings = async function(){
  const out = {};
  for(const d of CM_TOOL_DEFAULTS){
    const url = ((document.getElementById("toolUrl_"+d.id)||{}).value||"").trim().replace(/\/+$/,"");
    const status = (document.getElementById("toolStatus_"+d.id)||{}).value || d.status;
    if(url && !/^https:\/\/[^\s]+$/i.test(url)){ toast(`${d.short}: enter the full https:// address.`); return; }
    if(status==="live" && !url){ toast(`${d.short}: add its address before switching it to Live.`); return; }
    out[d.id] = {url, status};
  }
  state.toolSettings = out;
  await sharedSet("settings:tools", {tools:out, at:new Date().toISOString()});
  toast("Tool settings saved for everyone."); render();
};

window.renderHandouts = function(){   // 📚 Knowledge Base: the handouts are in the LSH Knowledge Base now, not on this page
  const tpl = CM_DOCS.filter(d=>d.folder==="templates");
  return `<p class="eyebrow">Reference Library</p>
    <h1 style="color:var(--navy);font-size:26px;margin:6px 0 8px">📚 Knowledge Base</h1>
    <div class="card" style="padding:16px 18px;margin-bottom:14px">
      <p style="margin:0 0 10px;font-size:14px;max-width:78ch">The Case Management handouts and reference documents are in the <b>LSH Knowledge Base</b>, in the <b>Case Management</b> collection, filed by training day (<i>CM Training · Day 1</i> to <i>Day 5</i>). Search it for anything else the team knows.</p>
      <a class="btn btn-primary" href="${E(CM_KB_URL)}" target="_blank" rel="noopener">Open the Knowledge Base ↗</a>
      ${state.isAdmin ? `<p style="margin:12px 0 0;font-size:13px;color:var(--ink-soft);max-width:78ch"><b>Trainers:</b> to add a document, open the Knowledge Base, go to Case Management and press <b>+ Add to Case Management</b>. Type the day's section name (for example <i>CM Training · Day 2 · Claim Set Up &amp; Treatment</i>) and upload the file or write the page. An admin's entry goes live at once.</p>` : ""}
    </div>
    <div class="card" style="padding:14px 18px"><h3 style="font-size:14px;color:var(--navy);margin:0 0 6px">📝 Templates & blank forms</h3>
      ${tpl.map(d=>`<div class="cm-doc-row"><div><span class="t">${E(d.title)}</span><div class="d">${E(d.desc)}</div></div><a class="btn btn-ghost btn-sm" href="${cmDocUrl(d)}" target="_blank" rel="noopener">${/\.(docx|xlsx)$/i.test(d.file)?"Download":"Open"}</a></div>`).join("")}</div>`;
};

window.clientAvatarSvg = function(){ return `<div class="client-photo-img" style="display:flex;align-items:center;justify-content:center;font-size:42px;background:#EEF0F6">📂</div>`; };

/* ---- 🧰 Tools menu in the course's top bar (rendered by renderTopbar in cm-updates.js) ---- */
window.cmToolsMenuHTML = function(){
  const tools = CM_TOOL_DEFAULTS.map(d=>cmTool(d.id)).filter(t=>t.live);
  const open = currentFrame && frameShell && !frameShell.hidden;
  // 📄 Drafting Tools live in this menu too (no top-bar button of their own): the hub and its three drafting exercises
  // (each opens as its hub card does: HIPAA here; LOR and Med Provider on the Portal's shared Drafting tool)
  const drafting = [["drafting", "📄 All Drafting Tools"], ["hipaa", "🩺 HIPAA Drafting"], ["portal", "✉️ LOR Drafting"], ["portal", "🏥 Med Provider Drafting"]];
  const onDraft = !open && ["drafting", "lor", "hipaa", "medprov"].includes(state.view);
  return `<div class="nav-tools" id="navTools">
    <button type="button" class="${open||onDraft?"active":""}" aria-haspopup="true" onclick="cmToggleToolsMenu(event)">🧰 Tools ▾</button>
    <div class="nav-tools-menu" role="menu">${tools.map(t=>`<button type="button" role="menuitem" class="${open && t.id===currentFrame?"on":""}" onclick="cmPickTool('${t.id}')">${t.icon} ${E(t.short)}</button>`).join("")}
      <div class="nav-tools-sep" role="presentation">Drafting Tools</div>
      ${drafting.map(([v, label])=>`<button type="button" role="menuitem" class="${!open && state.view===v?"on":""}" onclick="cmPickDraft('${v}')">${label}</button>`).join("")}
      <button type="button" class="more" onclick="cmPickTool(null)">All tools, sign-in help &amp; my work log</button></div></div>`;
};
window.cmPickDraft = function(view){
  const n = document.getElementById("navTools"); if(n) n.classList.remove("open");
  if(state.mobileNavOpen && typeof toggleMobileNav==="function") toggleMobileNav();
  if(view === "portal" && typeof lshOpenPortalDrafting === "function") lshOpenPortalDrafting(); else goto(view === "portal" ? "drafting" : view);
};
window.cmToggleToolsMenu = function(e){ if(e) e.stopPropagation(); const n = document.getElementById("navTools"); if(n) n.classList.toggle("open"); };
window.cmPickTool = function(id){
  const n = document.getElementById("navTools"); if(n) n.classList.remove("open");
  if(state.mobileNavOpen && typeof toggleMobileNav==="function") toggleMobileNav();
  if(id) openTool(id); else goto("tools");
};
document.addEventListener("click", e=>{ const n = document.getElementById("navTools"); if(n && !n.contains(e.target)) n.classList.remove("open"); });
function repaintToolsMenu(){
  const n = document.getElementById("navTools"); if(!n) return;
  const wasOpen = n.classList.contains("open");
  n.outerHTML = cmToolsMenuHTML();
  if(wasOpen){ const m = document.getElementById("navTools"); if(m) m.classList.add("open"); }
}
// Going anywhere in the course closes the tool (its session is kept; "Return to …" reopens it).
const _gotoForFrame = window.goto;
window.goto = function(){ if(frameShell && !frameShell.hidden) closeToolFrame(); return _gotoForFrame.apply(this, arguments); };
// A re-render can change the top bar's height.
const _renderForFrame = window.render;
window.render = function(){ const r = _renderForFrame.apply(this, arguments); placeFrame(); syncPill(); return r; };


/* ---------- startup ---------- */
const _origRender = window.render;
window.addEventListener("load", ()=>{
  setTimeout(async ()=>{
    try{ state.cmsLog = (await storeGet("cms-log")) || state.cmsLog || {}; }catch(e){}
    await loadToolSettings(); if(typeof render==="function" && (state.view==="tools"||state.view==="cms")) render();
  }, 300);
});
})();
