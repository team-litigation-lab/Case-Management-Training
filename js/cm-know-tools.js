/* 🧰 Know Your Tools (as in Foundational Training): every tool the Case Flow uses, one at a time, before Day 1's work.
   • Its own page (#/knowtools), drawn like a deck slide: the tools on the left; the picked one's purpose, where it is,
     when the course uses it and a button that opens it; ← / → step through them; the last ends with ✅ End of Module.
   • A card on the dashboard, above the days.
   • 🔔 Every time a trainee logs in (once a session, on the dashboard): "Open your tools" — the four the work starts
     in, each with its button, so they are open beside the slides before the first one. */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
// id: the course's tool (cmCaseFlow.tool) or a page; daily: one of the four to open at every log-in
const TOOLS = [
  {id: "cms", icon: "🗂", name: "LSH Case Management System (CMS)", daily: true,
    what: "The firm's case management system and the file of record. John Doe's matter lives here: parties, the Conflict Check, insurance, the calendar, documents, case notes, tasks, liens and the financial ledger.",
    where: "🧰 Tools → CMS, the Practice Lab slide of each day, or 🗂 on any step that's worked in it. It opens beside the slide and keeps its session.",
    when: "Every day. Day 1 you open the matter; after that every activity ends in the CMS, and Check Your Work logs your CMS Case ID.",
    tip: "If it isn't in the CMS, it didn't happen."},
  {id: "call", icon: "☎", name: "LSH Ring Channel (the Call Simulator)", daily: true,
    what: "The training phone. Live calls with John Doe, Margaret Doe, the adjusters, providers' billing offices, defense counsel's paralegal and Atty. Thorne, voiced and graded.",
    where: "📞 Take the call on a Your Task slide, 🧰 Tools → Call Simulator, or the ring that comes in when your trainer injects a call.",
    when: "Every day's live calls, and any time your trainer rings you. Answer it: a missed call counts.",
    tip: "Facts and process, never value or strategy: that's Atty. Thorne's."},
  {id: "email", icon: "✉️", name: "Email Workspace", daily: true,
    what: "Your inbox and outbox on the file: letters of representation, requests, follow-ups and replies with carriers, providers and the client.",
    where: "✉️ on the steps worked in email, or 🧰 Tools → Email Workspace.",
    when: "Days 1–5: LORs, records requests, Amendment Requests, demands, consents and reductions all go out from here.",
    tip: "Claim number in the subject line, every time."},
  {id: "drive", icon: "📂", name: "My Backup Drive (Google Drive)", daily: true,
    what: "Your own Google Drive, linked to the platform, holding the firm's backup folders for John Doe's case: you build them by hand on Day 1, and every document you file in the CMS lands in its folder there too.",
    where: "📂 on the dashboard, and 📂 Backup Drive on the Backup File Maintenance steps.",
    when: "Linked and built on Day 1, graded; ✓ Check my drive whenever you file, every day after.",
    tip: "A folder that goes missing is a document the firm has lost: check the drive, and put it back."},
  {id: "docs", icon: "📁", name: "Case Documents", what: "Every document on John Doe's file: the intake sheet, the police report, records, bills, letters and pleadings, with dates current to your case.",
    where: "📁 Documents in the top bar, or 📁 Work From on a slide.", when: "Every activity works from its documents; ⬇ Download PDF saves one.", tip: "Quote the document, never your memory."},
  {id: "plan", icon: "📝", name: "Action Plan Editor", what: "Where you write the Case Plan, the Action Plan, the warning letters and the demand drafts, and route them to Atty. Thorne.",
    where: "📝 on the steps that use it.", when: "Day 1 onward: the Direction Packet, the Case Plan, the demand package.", tip: "Lead every note with the decision needed."},
  {id: "records", icon: "🩺", name: "ChartSwap (Medical Records Requests)", what: "The records platform: request medical records and itemized bills on a live HIPAA authorization.",
    where: "🩺 on the steps that need records.", when: "Days 2–4: treatment records, the pre-demand audit and the binders.", tip: "Check the authorization's expiry before you request."},
  {id: "efiling", icon: "🏛", name: "Court E-Filing", what: "The court's filing and docket system: file pleadings and docket every court date.",
    where: "🏛 on the litigation steps.", when: "Days 4–5: hard dates, the complaint, service and discovery.", tip: "Count every deadline from its source document."},
  {id: "netsheet", icon: "📊", name: "LSH Net Sheet", what: "The firm's Net Sheet: gross, fee, costs, liens and the client's net, with Check my sheet at each stage.",
    where: "📊 on the settlement and disbursement steps.", when: "Days 3–5: the BI and UM settlements, liens, the final and the litigated Net Sheet.", tip: "It reconciles to the cent, or it isn't done."},
  {id: "calendaring", icon: "🗓", name: "Calendaring Simulators", what: "Calendar the mediation, the arbitration and every date that hangs off them.",
    where: "🗓 on the calendaring steps.", when: "Day 4.", tip: "A date that doesn't add up never gets on the calendar."},
];
const isTrainee = () => typeof state !== "undefined" && !!state.traineeId && !state.isAdmin;
let at = 0;
function open(id){ try{ if(window.cmCaseFlow && cmCaseFlow.tool) cmCaseFlow.tool(id); }catch(e){} }

/* ---------- the page ---------- */
function renderKnowTools(){
  at = Math.max(0, Math.min(TOOLS.length - 1, at));
  const t = TOOLS[at], last = at === TOOLS.length - 1;
  return `<div class="kt-page"><div class="kt-deck">
    <div class="kt-head"><h2>🧰 Know Your Tools</h2><p>Every tool the Case Flow uses, one at a time. Open each one as you go, and keep the four marked 🔔 open every time you log in.</p></div>
    <div class="kt-body">
      <ol class="kt-list">${TOOLS.map((x, i) => `<li><button type="button" class="${i === at ? "on" : ""}" onclick="cmKnowTools.go(${i})"><span>${x.icon}</span>${E(x.name)}${x.daily ? ` <em title="Open it every time you log in">🔔</em>` : ""}</button></li>`).join("")}</ol>
      <section class="kt-sheet">
        <p class="kt-k">Tool ${at + 1} of ${TOOLS.length}${t.daily ? " · 🔔 open it every time you log in" : ""}</p>
        <h3>${t.icon} ${E(t.name)}</h3>
        <dl><dt>What it's for</dt><dd>${E(t.what)}</dd><dt>Where you find it</dt><dd>${E(t.where)}</dd><dt>When you use it</dt><dd>${E(t.when)}</dd></dl>
        <p class="kt-tip">💡 ${E(t.tip)}</p>
        <div class="kt-btns"><button type="button" class="btn btn-navy" onclick="cmKnowTools.open('${t.id}')">Open ${E(t.name.replace(/ \(.*\)$/, ""))} ↗</button></div>
      </section>
    </div>
    <div class="kt-nav"><button type="button" class="btn btn-ghost" ${at ? "" : "disabled"} onclick="cmKnowTools.go(${at - 1})">← Previous</button><span>${at + 1} / ${TOOLS.length}</span>
      ${last ? `<button type="button" class="btn btn-primary" onclick="cmKnowTools.done()">✅ End of Module</button>` : `<button type="button" class="btn btn-primary" onclick="cmKnowTools.go(${at + 1})">Next tool →</button>`}</div>
  </div></div>`;
}
window.renderKnowTools = renderKnowTools;
document.addEventListener("keydown", e => {
  if(typeof state === "undefined" || state.view !== "knowtools" || /input|textarea|select/i.test((e.target && e.target.tagName) || "")) return;
  if(e.key === "ArrowRight" && at < TOOLS.length - 1){ at++; render(); } else if(e.key === "ArrowLeft" && at > 0){ at--; render(); }
});

/* ---------- the dashboard: its card, above the days ---------- */
const seen = () => { try{ return localStorage.getItem("cm_knowtools_done") === "1"; }catch(e){ return false; } };
function card(){
  return `<div class="kt-card"><span class="kt-card-ic" aria-hidden="true">🧰</span><div><b>Know Your Tools</b><small>Every tool the course uses, and the four to open every time you log in.</small></div>
    <button type="button" class="btn ${seen() ? "btn-ghost" : "btn-primary"} btn-sm" onclick="goto('knowtools')">${seen() ? "Review" : "Start"}</button></div>`;
}
if(typeof window.renderDashboard === "function" || typeof renderDashboard === "function"){
  const __dash = renderDashboard;
  window.renderDashboard = renderDashboard = function(){
    const html = __dash.apply(this, arguments), at2 = html.indexOf('<div class="module-grid">');
    if(at2 < 0) return html;
    if(isTrainee()) setTimeout(loginPrompt, 400);
    return html.slice(0, at2) + card() + html.slice(at2);
  };
}

/* ---------- 🔔 at every log-in: open your tools ---------- */
function loginPrompt(){
  if(!isTrainee() || state.view !== "dashboard" || document.getElementById("ktLogin")) return;
  try{ if(sessionStorage.getItem("cm_tools_prompted") === "1") return; sessionStorage.setItem("cm_tools_prompted", "1"); }catch(e){ return; }
  const o = document.createElement("div"); o.id = "ktLogin"; o.className = "kt-modal"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Open your tools");
  o.innerHTML = `<div class="kt-box"><h3>🔔 Open your tools before you start</h3><p>Every time you log in, open these four and keep them open beside the slides. Your work, your calls and your case folder all happen in them.</p>
    <div class="kt-daily">${TOOLS.filter(t => t.daily).map(t => `<button type="button" class="btn btn-navy" onclick="cmKnowTools.open('${t.id}')">${t.icon} ${E(t.name.replace(/ \(.*\)$/, ""))}</button>`).join("")}</div>
    <div class="kt-box-foot"><button type="button" class="btn btn-ghost btn-sm" onclick="goto('knowtools');cmKnowTools.close()">🧰 What each one is for</button><button type="button" class="btn btn-primary" onclick="cmKnowTools.close()">They're open: let's start</button></div></div>`;
  o.addEventListener("click", e => { if(e.target === o) o.remove(); });
  document.body.appendChild(o);
}

window.cmKnowTools = {
  go(i){ at = i; render(); window.scrollTo(0, 0); },
  open,
  done(){ try{ localStorage.setItem("cm_knowtools_done", "1"); }catch(e){} goto("dashboard"); },
  close(){ const o = document.getElementById("ktLogin"); if(o) o.remove(); },
  tools: TOOLS
};

const css = document.createElement("style"); css.id = "cm-know-tools";
css.textContent = `
main:has(.kt-page){max-width:min(2200px, 97vw) !important;padding:18px 20px 24px !important;}
.kt-page{max-width:none;margin:0 auto;}
.kt-deck{background:linear-gradient(135deg,#1F2440,#2B3158 60%,#353C68);border-radius:20px;padding:20px 22px;color:#fff;}
.kt-body{display:grid;grid-template-columns:minmax(280px,400px) minmax(0,1fr);gap:18px;}
.kt-list{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:5px;}
.kt-list button{width:100%;text-align:left;display:flex;align-items:center;gap:10px;border:1px solid rgba(255,255,255,.22);background:rgba(255,255,255,.07);color:#fff;border-radius:10px;padding:8px 14px;font:800 18px/1.2 'Inter',sans-serif;cursor:pointer;}
.kt-list button > span{font-size:20px;}
.kt-list button.on{background:#F6C08F;color:#141A2E;border-color:#F6C08F;} .kt-list em{font-style:normal;margin-left:auto;}
.kt-sheet{background:#fff;color:#141A2E;border-radius:16px;padding:26px 32px;}
.kt-k{margin:0;font:800 15px 'Inter',sans-serif;letter-spacing:.08em;text-transform:uppercase;color:#A4470F;}
.kt-sheet h3{margin:8px 0 20px;font:800 38px 'Poppins','Inter',sans-serif;color:#1E2340;}
.kt-sheet dl{display:grid;grid-template-columns:240px 1fr;gap:16px 22px;margin:0 0 22px;}
.kt-sheet dt{font:800 22px/1.4 'Inter',sans-serif;color:#1E2340;} .kt-sheet dd{margin:0;font:700 23px/1.5 'Inter',sans-serif;}
.kt-tip{margin:0 0 22px;padding:14px 20px;border-left:5px solid #DB8437;background:#FFF4E6;border-radius:0 10px 10px 0;font:700 21px/1.45 'Inter',sans-serif;}
.kt-btns .btn{font-size:19px;padding:13px 22px;}
.kt-head h2{margin:0;font:800 36px 'Poppins','Inter',sans-serif;color:#F6C08F;} .kt-head p{margin:4px 0 16px;font:600 19px/1.5 'Inter',sans-serif;color:#E3E7F1;}
.kt-nav .btn{font-size:16px;padding:10px 20px;}
.kt-nav{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:14px;background:rgba(255,255,255,.92);border-radius:14px;padding:10px 14px;color:#141A2E;font:700 16px 'IBM Plex Mono',monospace;}
.kt-card{display:flex;align-items:center;gap:20px;margin:0 0 16px;padding:22px 28px;min-height:104px;border-radius:16px;background:rgba(255,255,255,.94);backdrop-filter:blur(10px);border:1px solid #D6DAE5;border-left:7px solid #1E2340;box-shadow:0 10px 24px -16px rgba(38,43,69,.4);}
.kt-card-ic{font-size:42px;line-height:1;} .kt-card > div{flex:1;min-width:0;display:flex;flex-direction:column;gap:4px;} .kt-card b{font:800 24px 'Poppins','Inter',sans-serif;color:#141A2E;} .kt-card small{font:600 16.5px/1.45 'Inter',sans-serif;color:#2A3048;}
.kt-card .btn{padding:12px 30px;font-size:17px;font-weight:800;border-radius:12px;}
@media(max-width:700px){ .kt-card{flex-wrap:wrap;padding:18px;} .kt-card .btn{width:100%;} }
/* Contrast on the dashboard: the day cards and the scores band were 30–60% glass over the photo, so
   their grey labels washed out. They take a near-solid sheet and the full ink; the photo still shows
   around them. (Prefixed html body to sit above js/lsh-card-frame.js, which loads after this file.) */
html body .dash-main .module-card.mc-clean{background:rgba(255,255,255,.93) !important;}
html body .dash-main .module-card.mc-clean .module-head{background:#F4F5F9 !important;}
html body .dash-main .module-card.mc-clean .mh-title{color:#141A2E !important;font-size:15.5px !important;}
html body .dash-main .module-card.mc-clean .module-theme{color:#141A2E !important;}
html body .dash-main .module-card.mc-clean .mc-progress{color:#2A3048 !important;font-size:13px !important;font-weight:600;}
html body .dash-main .module-card.mc-clean .mc-progress b{color:#141A2E !important;}
html body .dash-main .module-card.mc-clean .mc-grid > .module-start-btn{background:#E9EBF2 !important;color:#141A2E !important;}
html body .dash-main .module-card.mc-clean .mc-grid > .module-start-btn:not(:disabled):hover,html body .dash-main .module-card.mc-clean:hover .mc-grid > .module-start-btn:not(:disabled){background:#353B57 !important;color:#fff !important;}
html body .dash-main .module-card.mc-clean .mc-grid > button:not(.module-start-btn){background:#fff !important;color:#2A3048 !important;font-weight:700 !important;}
html body .dash-main .module-card.mc-clean .mc-grid > button:not(.module-start-btn):not(:disabled):hover{background:#F3F4F8 !important;color:#141A2E !important;}
html body .dash-main .module-card.mc-clean .mc-grid > button:disabled,html body .dash-main .module-card.mc-clean .mc-grid > .module-start-btn:disabled{opacity:1 !important;background:#F7F8FB !important;color:#5A6078 !important;}
html body .dash-main .module-card.mc-clean .mc-grid .module-topics-btn span{color:#4A5070 !important;}
html body .dash-main > .dash-side{background:rgba(255,255,255,.92) !important;border-color:#D6DAE5 !important;}
html body .dash-main > .dash-side .card{background:#fff !important;border-color:#D6DAE5 !important;}
html body .dash-main > .dash-side .tfb-dash{background:#FFF4E6 !important;border-color:#F0C9A3 !important;}
html body .dash-main > .dash-side .stat .num{color:#141A2E !important;}
html body .dash-main > .dash-side .stat .lbl,html body .dash-main > .dash-side .card .sub,html body .dash-main > .dash-side .stat .lbl span{color:#2A3048 !important;}
/* one footer on every day card: a passed day's three small buttons (Topics, Review Score, Retake) share one row,
   like the two (Topics, Finish Training) on the others, so the Review rows line up */
html body .dash-main .module-card.mc-clean .mc-grid.mc-n3{grid-template-columns:repeat(3,minmax(0,1fr));}
html body .dash-main .module-card.mc-clean .mc-grid.mc-n3 > .module-start-btn{grid-column:1 / -1;}
html body .dash-main .module-card.mc-clean .mc-grid.mc-n3 > button:not(.module-start-btn){grid-column:span 1 !important;}
html body .dash-main .module-card.mc-clean .mc-grid.mc-n3 > button:not(.module-start-btn):not(:last-child){border-right:1px solid #9CA3B8 !important;}
html body .dash-main .module-card.mc-clean .mc-progress-empty{visibility:hidden;}
@media(min-width:761px){
  html body .dash-side-inner > .card.stat{padding:8px 12px;}
  html body .dash-side .stat .num{font-size:19px;}
  html body .dash-side .stat .lbl{font-size:10.5px;font-weight:700;}
  html body .dash-side .stat .lbl span{font-size:10.5px;font-weight:500 !important;}
  html body .dash-side .tfb-dash .sub,html body .dash-side .rank-card .sub,html body .dash-side .comp-card .sub,html body .dash-side .cert-dash .sub{font-size:11.5px;}
}
/* Blue: the Know Your Tools card and the scores band, in the course's navy with white text */
html body .kt-card{background:linear-gradient(135deg,#1E2340 0%,#343C66 100%) !important;border-color:#2C335A !important;border-left-color:#DB8437 !important;}
html body .kt-card b{color:#fff !important;} html body .kt-card small{color:#D9DCEA !important;}
html body .dash-main > .dash-side{background:linear-gradient(135deg,#1E2340 0%,#343C66 100%) !important;border-color:#2C335A !important;}
html body .dash-main > .dash-side .card{background:rgba(255,255,255,.08) !important;border-color:rgba(255,255,255,.18) !important;color:#fff !important;}
html body .dash-main > .dash-side .stat .num, html body .dash-main > .dash-side .card .num{color:#fff !important;}
html body .dash-main > .dash-side .stat .lbl, html body .dash-main > .dash-side .card .sub, html body .dash-main > .dash-side .stat .lbl span, html body .dash-main > .dash-side .card .lbl{color:#C9CCDD !important;}
html body .dash-main > .dash-side .tfb-dash{background:rgba(219,132,55,.22) !important;border-color:rgba(240,192,138,.55) !important;}
.kt-modal{position:fixed;inset:0;z-index:2147482500;background:rgba(15,20,40,.6);display:flex;align-items:center;justify-content:center;padding:16px;}
.kt-box{background:#fff;color:#141A2E;border-radius:18px;padding:24px 26px;max-width:720px;width:100%;border-top:6px solid #DB8437;}
.kt-box h3{margin:0 0 6px;font:800 24px 'Poppins','Inter',sans-serif;color:#1E2340;} .kt-box p{margin:0 0 14px;font:600 16px/1.5 'Inter',sans-serif;}
.kt-daily{display:grid;grid-template-columns:1fr 1fr;gap:10px;margin:0 0 16px;} .kt-daily .btn{padding:12px;font-size:15.5px;}
.kt-box-foot{display:flex;justify-content:space-between;gap:10px;flex-wrap:wrap;}
@media(max-width:800px){ .kt-body{grid-template-columns:1fr;} .kt-sheet dl{grid-template-columns:1fr;} .kt-daily{grid-template-columns:1fr;} }`;
document.head.appendChild(css);
})();
