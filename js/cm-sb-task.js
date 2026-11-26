/* ============================================================
   🎯 Your Task on a Skill Building activity: one column, one button for the tools, the rules one tap away

   The Case Flow draws the Your Task slide (js/cm-case-flow.js, slideBody "task"), a Skill Activity's one slide: 📂 Your
   Case in a line or two, the steps in full sentences, and one bar at its foot with three buttons: 🚀 Launch, 🧰 Tools ▾
   (what is done in another tool: the live call, the service confirmation, the Amendment Requests, the Notes & Action
   Plan, the Action Plan Editor, 📁 Source Files) and Submit →, which opens the AI Grader on the slide (js/cm-ai-grader.js).
   This file:
     • 🚀 Launch LSH CaseWorX & Google Drive: the one button at the top of the card. It opens the CMS beside the slide (the course's
       tool frame) and the trainee's own Backup Drive in a new tab, at their case folder once it is built (CMDrive.launch;
       Google Drive can't be framed). A trainee whose
       Drive isn't linked yet gets the 📂 Backup Drive panel, where it is linked. Anyone else gets Google Drive itself.
     • 📋 Rules & Naming Guide: the activity's purpose, principle and what to hand in, and on a Backup File Maintenance
       activity the firm's naming convention (its pattern, an example with 📋 Copy, its parts and the labels that go last),
       at the top of 📖 Reference, so the slide itself shows only what to do.
     • The layout's styles (one column; the foot bar; the Source Files list opening upward over the steps).
   ============================================================ */
(function(){
"use strict";
if(typeof document === "undefined") return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const hl = t => E(t).replace(/\*\*(.+?)\*\*/g, '<mark class="cfx-hl">$1</mark>');
const trainee = () => typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;
const drive = () => window.CMDrive && typeof CMDrive.status === "function" ? CMDrive.status() : null;
const GDRIVE = "https://drive.google.com/drive/my-drive";
// the Backup File Maintenance activities: their guide carries the naming convention
const DRIVE_BLOCKS = {"d1m1-drive": 1, "d2-drive": 2, "d3-drive": 3, "d4-drive": 4, "d5-drive": 5};

function openTab(url){ try{ window.open(url, "_blank", "noopener"); }catch(e){} }
function openCms(blockId){
  if(window.cmCaseFlow && typeof cmCaseFlow.tool === "function" && typeof window.openTool === "function") return cmCaseFlow.tool("cms", blockId);
  const h = typeof window.cmToolHref === "function" && cmToolHref("cms");
  if(h) openTab(h);
}

window.CMSbTask = {
  /* the button, drawn at the top of the Your Task card */
  launch(blockId){
    return `<button type="button" class="btn cfx-launch" data-launch="${E(blockId)}" onclick="CMSbTask.go('${E(blockId)}')" title="Opens LSH CaseWorX beside this slide and your Google Drive folder in a new tab">🚀 Launch LSH CaseWorX &amp; Google Drive</button>`;
  },
  /* Drive first, inside the click itself, so the browser lets the new tab open; then the CMS beside the slide.
     A trainee with no linked Drive gets the Backup Drive panel (link it there) over the CMS. */
  go(blockId){
    const D = drive();
    let link = false;
    if(!trainee()) openTab(GDRIVE);
    // their linked Drive at the case folder (01 Clients/Doe-John) once it is built, else the linked folder: CMDrive.launch
    else if(D && D.connected && (D.caseUrl || D.rootUrl) && window.CMDrive && typeof CMDrive.launch === "function") CMDrive.launch();
    else if(D && /^https:\/\//.test(D.rootUrl || "")) openTab(D.rootUrl);
    else if(D && D.configured === false) openTab(GDRIVE);
    else link = true;
    openCms(blockId);
    if(link && window.CMDrive && typeof CMDrive.show === "function") CMDrive.show();
    if(link && typeof toast === "function") toast("Link your Google Drive first: paste your folder's link in the Backup Drive panel. The CMS is open beside the slide.");
  },
  guide
};

/* 📋 Rules & Naming Guide: what moved off the slide, at the top of 📖 Reference */
function guide(b){
  if(!b || b.kind !== "activity") return "";
  const c = (window.CM_CF_SLIDES || {})[b.id] || {}, day = DRIVE_BLOCKS[b.id];
  const row = (h, t) => t ? `<div><b>${h}</b><p>${hl(t)}</p></div>` : "";
  const rows = row("🎯 Purpose", c.purpose) + row("⚖️ Principle", c.principle) + row("📤 What to hand in", c.deliver);
  const naming = day && window.CMDrive && typeof CMDrive.namingBox === "function" ? CMDrive.namingBox({day}) : "";
  if(!rows && !naming) return "";
  return `<section class="cfx-guide" aria-label="Rules and Naming Guide"><h3>📋 Rules &amp; Naming Guide</h3>${rows ? `<div class="cfx-guide-g">${rows}</div>` : ""}${naming}</section>`;
}
if(window.cmCaseFlow && typeof cmCaseFlow.full === "function"){
  const __full = cmCaseFlow.full;
  cmCaseFlow.full = function(dayId, i){
    const r = __full.apply(this, arguments);
    try{
      const b = typeof cmCaseFlow.blockAt === "function" ? cmCaseFlow.blockAt(dayId, i) : null, html = guide(b);
      const body = html && document.querySelector(".cfx-ref .cfx-ref-b");
      if(body){ const strip = body.querySelector(".cf-strip"); if(strip) strip.insertAdjacentHTML("afterend", html); else body.insertAdjacentHTML("afterbegin", html); }
    }catch(e){}
    return r;
  };
}

const css = document.createElement("style");
css.id = "cm-sb-task-css";
css.textContent = `
.cfx .cfx-task.cfx-task1{display:flex;flex-direction:column;gap:8px;align-items:stretch;text-align:left;}
.cfx-task1 .cfx-task-bar{display:flex;flex-wrap:wrap;align-items:center;gap:8px 12px;}
.cfx-task1 .cfx-launch{background:#1E2340 !important;color:#fff !important;border:2px solid #DB8437 !important;font:800 18px/1.2 var(--font-ui) !important;padding:10px 18px !important;border-radius:12px !important;min-height:0 !important;height:auto !important;}
.cfx-task1 .cfx-launch:hover,.cfx-task1 .cfx-launch:focus-visible{background:#DB8437 !important;outline:none;}
.cfx-task1 .cfx-task-bar .cfx-plan-go{font:800 16px/1.2 var(--font-ui) !important;padding:8px 14px !important;min-height:0 !important;height:auto !important;}
.cfx-task1 .cfx-task-bar .cfx-of{margin-left:auto;font:800 16px/1.3 var(--font-ui);color:#A4470F;}
.cfx-task1 .cfx-more-tools{position:relative;}
.cfx-task1 .cfx-more-tools summary{cursor:pointer;font:800 16px/1.2 var(--font-ui);color:#1E2340;border:2px solid #C9D3EA;border-radius:12px;padding:8px 12px;list-style:none;}
.cfx-task1 .cfx-more-tools summary::-webkit-details-marker{display:none;}
.cfx-task1 .cfx-more-tools[open] .cfx-tools-in{position:absolute;z-index:6;top:calc(100% + 6px);left:0;display:flex;flex-wrap:wrap;gap:8px;min-width:260px;background:#fff;border:2px solid #C9D3EA;border-radius:12px;padding:10px;box-shadow:0 10px 24px rgba(14,18,40,.18);}
.cfx-task1 .cfx-more-tools .cfx-tool{font:800 16px/1.2 var(--font-ui);}
.cfx-task1 .cfx-steps{gap:10px;}
.cfx-task1 .cfx-steps li,.cfx-task1 .cfx-steps li > span{font:700 clamp(18px,2.5vh,22px)/1.38 var(--font-ui);}
.cfx-task1 .cfx-steps-long{gap:8px;} .cfx-task1 .cfx-steps-long li,.cfx-task1 .cfx-steps-long li > span{font:700 clamp(17px,2.3vh,21px)/1.3 var(--font-ui);}   /* a Skill Building's five or six steps, at full size on a laptop */
.cfx .cfx-task1 .cfx-steps-long li{grid-template-columns:34px 1fr;gap:10px;margin-bottom:0 !important;} .cfx .cfx-task1 .cfx-steps-long li::before{width:30px !important;height:30px !important;font-size:16px !important;}
.cfx-task1 .cfx-task-acts{display:flex;flex-wrap:wrap;gap:10px;}
.cfx-task1 .cfx-task-acts .cfx-call{flex:1 1 300px;display:grid;grid-template-columns:minmax(0,1fr) auto;align-items:center;gap:2px 12px;background:#262B45;border-radius:14px;padding:10px 14px;color:#fff;text-align:left;}
.cfx-task1 .cfx-task-acts .cfx-call b{grid-column:1;font:800 16px var(--font-ui);color:#F4B77A;}
.cfx-task1 .cfx-task-acts .cfx-call span{grid-column:1;color:#DDE2EE;font:700 16px/1.35 var(--font-ui);}
.cfx-task1 .cfx-task-acts .cfx-call em{color:#9BE0B4;font-style:normal;}
.cfx-task1 .cfx-task-acts .cfx-call small{display:block;font:700 16px/1.3 var(--font-ui);color:#C9CFE0;}
.cfx-task1 .cfx-task-acts .cfx-call .btn{grid-column:2;grid-row:1 / span 2;font-weight:800;}
.cfx-task1 .cfx-task-foot{display:flex;align-items:center;justify-content:space-between;gap:12px;margin-top:0;padding:6px 12px;background:#F6F7FB;border:2px solid #E3E6EF;border-radius:14px;}
.cfx-task1 .cfx-task-foot .cfx-docs{position:relative;background:none;border:0;padding:0;}
.cfx-task1 .cfx-task-foot .cfx-docs summary{cursor:pointer;font:800 17px/1.3 var(--font-ui);color:#1E2340;text-decoration:underline;text-underline-offset:3px;margin:0;}
.cfx-task1 .cfx-task-foot .cfx-docs-pop{position:absolute;z-index:6;bottom:calc(100% + 12px);left:0;width:min(680px,80vw);max-height:52vh;overflow:auto;background:#fff;border:2px solid #C9D3EA;border-radius:14px;padding:12px 14px;box-shadow:0 12px 28px rgba(14,18,40,.22);font-size:16px;}
.cfx-task1 .cfx-task-foot .cfx-docs.cfx-flash summary{animation:cfxFlash 1.2s ease-out;}
body .cfx .cfx-task1 .cfx-docs-pop button,body .cfx .cfx-task1 .cfx-docs-pop a,body .cfx .cfx-task1 .cfx-docs-pop select{font-size:16px !important;font-weight:700 !important;}
.cfx-task1 .cfx-grade-go{margin-left:auto;background:#DB8437 !important;color:#fff !important;border:0 !important;font:800 18px/1.2 var(--font-ui) !important;padding:11px 22px !important;border-radius:12px !important;min-height:0 !important;height:auto !important;box-shadow:0 4px 12px rgba(219,132,55,.35);}
.cfx-task1 .cfx-grade-go:hover,.cfx-task1 .cfx-grade-go:focus-visible{background:#1E2340 !important;outline:none;}
/* the one slide: 📂 Your Case in a line or two, and the bar's three buttons (Launch, 🧰 Tools ▾, Submit) */
.cfx-task1 .cfx-yc{display:flex;gap:12px;align-items:baseline;margin:0;padding:10px 16px;background:#1E2340;border-left:8px solid #DB8437;border-radius:12px;text-align:left;}
.cfx-task1 .cfx-yc-k{flex:none;font:800 16px/1.3 var(--font-ui);color:#1E2340;background:#DB8437;border-radius:999px;padding:3px 12px;white-space:nowrap;}
.cfx-task1 .cfx-yc-t{font:700 clamp(18px,2.4vh,21px)/1.38 var(--font-ui);color:#fff;}
.cfx-task1 .cfx-yc mark.cfx-hl{background:none;color:#FFC98F;padding:0;font-weight:800;}
.cfx-task1 .cfx-yc .cfx-vm-link{font:800 inherit;font-weight:800;color:#FFC98F;text-decoration:underline;text-underline-offset:3px;cursor:pointer;white-space:nowrap;}   /* 🎧 Listen, in the sentence (js/cm-case-flow.js) */
.cfx-task1 .cfx-yc .cfx-vm-link:hover,.cfx-task1 .cfx-yc .cfx-vm-link:focus-visible{color:#fff;outline:2px solid #DB8437;outline-offset:2px;border-radius:4px;}
.cfx-task1 .cfx-tools-pop .cfx-of-row{display:flex;flex-wrap:wrap;align-items:center;gap:8px;background:#FFF6EC;}
.cfx-task1 .cfx-tools-pop .cfx-of-row .cfx-of{font:800 16px/1.3 var(--font-ui);color:#A4470F;}
.cfx-task1 .cfx-tools-menu{position:relative;}
.cfx-task1 .cfx-tools-menu > summary{cursor:pointer;list-style:none;font:800 17px/1.2 var(--font-ui);color:#1E2340;background:#fff;border:2px solid #1E2340;border-radius:12px;padding:9px 14px;}
.cfx-task1 .cfx-tools-menu > summary::-webkit-details-marker{display:none;}
.cfx-task1 .cfx-tools-menu[open] > summary{background:#1E2340;color:#fff;}
.cfx-task1 .cfx-tools-pop{position:absolute;z-index:7;bottom:calc(100% + 8px);left:0;width:min(660px,78vw);max-height:min(340px,52vh);overflow:auto;flex-direction:column;flex-wrap:nowrap;background:#fff;border:2px solid #1E2340;border-radius:14px;padding:12px;box-shadow:0 14px 32px rgba(30,35,64,.28);}
.cfx-task1 .cfx-tools-pop .cfx-call{flex:none;}
.cfx .cfx-task1 .cfx-tools-pop .cfx-call span{font-size:16px !important;}   /* the menu's rows (a tool's status line, the live call, the Action Plan Editor) at the slides' 16px */
.cfx-task1 .cfx-tools-pop .cfx-tools-row .cfx-tools-in{display:flex;flex-wrap:wrap;gap:8px;}
.cfx-task1 .cfx-tools-pop .cfx-tools-row .cfx-tool{font:800 16px/1.2 var(--font-ui);}
.cfx-task1 .cfx-tools-pop .cfx-docs{position:static;background:#F6F7FB;border:2px solid #E3E6EF;border-radius:12px;padding:10px 14px;}
.cfx-task1 .cfx-tools-pop .cfx-docs summary{cursor:pointer;font:800 17px/1.3 var(--font-ui);color:#1E2340;}
.cfx-task1 .cfx-tools-pop .cfx-docs-pop{position:static;width:auto;max-height:none;overflow:visible;box-shadow:none;border:0;padding:8px 0 0;}
.cfx-task1 .cfx-tools-pop .cfx-inject{font:800 16px/1.2 var(--font-ui) !important;}
.cfx .cfx-mode-back{display:inline-flex;align-self:flex-start;margin:0 0 10px;font:800 16px/1.2 var(--font-ui) !important;color:#1E2340 !important;background:#fff !important;border:2px solid #1E2340 !important;border-radius:12px !important;padding:8px 14px !important;min-height:0 !important;height:auto !important;}
.cfx .cfx-mode-back:hover,.cfx .cfx-mode-back:focus-visible{background:#1E2340 !important;color:#fff !important;outline:none;}
.cfx-guide{margin:0 0 16px;padding:14px 16px;background:#F6F7FB;border:2px solid #E3E6EF;border-left:8px solid #DB8437;border-radius:14px;text-align:left;}
.cfx-guide h3{margin:0 0 10px;font:800 20px/1.2 var(--font-ui);color:#1E2340;}
.cfx-guide-g{display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:10px;margin-bottom:10px;}
.cfx-guide-g b{display:block;font:800 16px var(--font-ui);color:#1E2340;}
.cfx-guide-g p{margin:4px 0 0;font:600 16px/1.4 var(--font-ui);color:#141A2E;}
@media (max-width:760px){ .cfx-task1 .cfx-yc{flex-wrap:wrap;gap:6px 10px;} .cfx-task1 .cfx-yc-t{flex:1 1 100%;min-width:0;} .cfx-task1 .cfx-task-acts .cfx-call{grid-template-columns:minmax(0,1fr);} .cfx-task1 .cfx-task-acts .cfx-call .btn{grid-column:1;grid-row:auto;justify-self:start;max-width:100%;white-space:normal;} .cfx-task1 .cfx-task-foot{flex-wrap:wrap;} .cfx-task1 .cfx-grade-go{margin-left:0;width:100%;} .cfx-task1 .cfx-task-foot .cfx-of{margin-left:0;} .cfx-task1 .cfx-tools-pop{width:min(660px,92vw);} }
`;
document.head.appendChild(css);
/* the 🧰 Tools menu opens upward over the steps: on a slide the layout enlarges (cm-slide-layout.js zooms the task), a long
   menu reached past the card's top, under the deck's head bar, where its first row (Practices, 💡 Tip, 🧠 Think it through)
   could not be clicked. It is held inside the card: shorter, and it scrolls. */
function fitTools(menu){
  const pop = menu && menu.open && menu.querySelector(".cfx-tools-pop"); if(!pop) return;
  pop.style.maxHeight = ""; pop.style.left = ""; pop.style.width = "";
  const box = menu.closest(".cfx-body") || menu.closest(".cf-card"); if(!box) return;
  // and sideways: on a phone the menu, opening rightward from its button, ran past the card's right edge, which cut it off
  const bx = box.getBoundingClientRect(), r0 = pop.getBoundingClientRect(), k = r0.width / (pop.offsetWidth || r0.width) || 1;
  if(r0.width && r0.right > bx.right - 6){
    const w = Math.min(r0.width, bx.width - 12);
    if(w < r0.width) pop.style.width = Math.floor(w / k) + "px";
    pop.style.left = Math.floor((bx.right - 6 - w - menu.getBoundingClientRect().left) / k) + "px";
  }
  const lim = bx.top + 6, r = pop.getBoundingClientRect(), over = lim - r.top;
  if(over <= 0 || !pop.offsetHeight) return;
  const ratio = r.height / pop.offsetHeight || 1;   // the enlarged slide's zoom
  pop.style.maxHeight = Math.max(120, Math.floor((r.height - over) / ratio)) + "px";
}
document.addEventListener("toggle", e => { const m = e.target; if(m && m.classList && m.classList.contains("cfx-tools-menu")) requestAnimationFrame(() => fitTools(m)); }, true);
if(typeof window.afterRender === "function"){
  const __after = window.afterRender;
  window.afterRender = function(){ const r = __after.apply(this, arguments);
    try{ requestAnimationFrame(() => document.querySelectorAll(".cfx-tools-menu[open]").forEach(fitTools)); }catch(e){}
    return r; };
}
})();
