/* 🗂 | 📁 ONE BUTTON PER TOOL (every activity's Your Task, every deck)
   Your Task had one 🚀 Launch LSH CaseWorX & Google Drive button that opened both at once (js/cm-sb-task.js
   CMSbTask.go). The owner: one button per tool, side by side:
   · 🗂 LSH CaseWorX: the CMS beside the slide, for this activity (cmCaseFlow.tool("cms", id): so 📤 Submit for grading
     shows in its window, js/cm-cms-submit.js);
   · 📁 Case Backup Files: the trainee's Backup Drive at their case folder (CMDrive.launch), or their linked folder, or
     the Backup Drive panel to link it first; a trainer gets Google Drive in a new tab.
   CMSbTask.go (both at once) stays, for anything that calls it. Overrides CMSbTask.launch; loads after js/cm-sb-task.js. */
(function(){
"use strict";
if(typeof window === "undefined" || !window.CMSbTask) return;
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const GDRIVE = "https://drive.google.com/drive/my-drive";
const trainee = () => typeof state === "object" && !!state.traineeId && !state.isAdmin && !state.adminPreview;
const openTab = url => { try{ window.open(url, "_blank", "noopener"); }catch(e){} };

CMSbTask.launch = function(blockId){
  const id = E(blockId);
  return `<span class="cfx-launch-pair" data-launch="${id}"><button type="button" class="btn cfx-launch cfx-launch-cms" onclick="CMSbTask.cms('${id}')" title="Open LSH CaseWorX beside this slide, for this task">🗂 LSH CaseWorX</button><button type="button" class="btn cfx-launch cfx-launch-drive" onclick="CMSbTask.drive('${id}')" title="Open your case's Backup Drive folder in a new tab">📁 Case Backup Files</button></span>`;
};
CMSbTask.cms = function(blockId){
  if(window.cmCaseFlow && typeof cmCaseFlow.tool === "function" && typeof window.openTool === "function") return cmCaseFlow.tool("cms", blockId);
  const h = typeof window.cmToolHref === "function" && cmToolHref("cms"); if(h) openTab(h);
};
/* the Drive inside the click itself, so the browser lets the new tab open (as CMSbTask.go) */
CMSbTask.drive = function(){
  const D = window.CMDrive && typeof CMDrive.status === "function" ? CMDrive.status() : null;
  if(!trainee()) return openTab(GDRIVE);
  if(D && D.connected && (D.caseUrl || D.rootUrl) && typeof CMDrive.launch === "function") return CMDrive.launch();
  if(D && /^https:\/\//.test(D.rootUrl || "")) return openTab(D.rootUrl);
  if(D && D.configured === false) return openTab(GDRIVE);
  if(window.CMDrive && typeof CMDrive.show === "function") CMDrive.show();
  if(typeof toast === "function") toast("Link your Google Drive first: paste your folder's link in the Backup Drive panel.");
};

const st = document.createElement("style"); st.id = "cm-tool-split"; st.textContent = `
.cfx-task1 .cfx-task-foot .cfx-launch-pair{display:inline-flex;align-items:center;gap:10px;flex-wrap:wrap;}
.cfx-task1 .cfx-task-foot .cfx-launch-pair .cfx-launch{margin:0 !important;}
`;
document.head.appendChild(st);
})();
