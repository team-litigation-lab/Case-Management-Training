/* 📂 The case folder, the Foundational Training way: the trainer sends each trainee a Google Drive link, and the trainee
   builds their case file in it to the firm's Standard Operating Procedure, on Day 1, then keeps it current every day.

   The SOP (word for word, the firm's):
     1. Create the Main Case Folder · name format: [Your Full Name] - [Case Name or Number]
     2. Set Up Firm Subfolders · the standard LSH Law Firm folder directory
     3. Connect to the Platform · link the root case folder (and any required subfolders) to the firm platform
     4. Maintain & Upload Case Documents · new filings, correspondence and evidence, continuously

   • The deck: Day 1's Backup File Maintenance slide "Your Case" shows the SOP and a sample of the folder structure.
   • The trainee: 📂 My Case Folder on the dashboard: the trainer's link, the folder name to use, the link to their main case
     folder (step 3, kept on their file as "case-folder"), and each day's ✓ Uploaded today: the daily deliverable.
   • The trainer: Admin → 📂 Drive Links: the batch's TRAINING RESOURCES link (settings:drive) and each trainee's folder
     link (trainee:<id>.driveLink, which only a trainer writes), with each trainee's connected folder and daily uploads.
   Google is never called: the folders live in the firm's shared Drive, and the links are what the platform keeps. */
(function(){
"use strict";
const E = s => String(s == null ? "" : s).replace(/[&<>"']/g, c => ({"&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"})[c]);
const CASE = "Doe v. Smith";
const RES_PATH = "Shared with me › TRAINING RESOURCES › CM Training › CM Training Case Filing Structure (LSH Academy)";
const SOP = [
  ["Create the Main Case Folder", "Name format: <code>[Your Full Name] - [Case Name or Number]</code>"],
  ["Set Up Firm Subfolders", "Organize internal files using the standard LSH Law Firm folder directory."],
  ["Connect to the Platform", "Link the root case folder (and any required subfolders) to the firm platform."],
  ["Maintain &amp; Upload Case Documents", "Continuously upload new filings, correspondence, and evidence to keep the digital case record up to date."]
];
// the firm's subfolders, as the Backup Drive standard has them (FOLDER_STANDARD in worker.js), in the order the case runs
const SUBS = [
  ["01 Intake & Retainer", "intake sheet, retainer, authorizations"],
  ["02 Police, Witness & Video", "the crash report, statements, footage"],
  ["03 Medical Records", "what the providers wrote"],
  ["04 Bills & Invoices", "what the care cost"],
  ["05 Insurance, Demands & Negotiation", "coverage, the demand, offers"],
  ["06 Liens & Reimbursement", "liens, reductions, payoffs"],
  ["07 Wages & Costs", "lost wages, the cost ledger"],
  ["08 Property Damage", "the vehicle, the rental, PD"],
  ["09 Litigation & ADR", "pleadings, mediation, arbitration"]
];
const isTrainee = () => typeof state !== "undefined" && !!state.traineeId && !state.isAdmin;
const fullName = () => (typeof state !== "undefined" && (state.traineeName || "")).trim() || "Your Full Name";
const folderName = n => `${n || fullName()} - ${CASE}`;
const okLink = u => /^https:\/\/(drive|docs)\.google\.com\//i.test(String(u || "").trim());
const say = m => { if(typeof toast === "function") toast(m); };

/* ---------- the deck: the SOP and the folder structure, side by side ---------- */
function tree(name){
  return `<div class="dsop-tree"><div class="dsop-root">📁 <b>${E(name)}</b><small>Main Case Folder</small></div>
    <ul>${SUBS.map(([f, what]) => `<li>📁 <b>${E(f)}</b><small>${E(what)}</small></li>`).join("")}</ul></div>`;
}
function sopList(){
  return `<ol class="dsop-steps">${SOP.map(([h, t], i) => `<li><span class="dsop-n">${i + 1}</span><div><b>${h}</b><span>${t}</span></div></li>`).join("")}</ol>`;
}
function slide(){
  return `<div class="dsop-slide"><div class="dsop-col"><h3>📋 Standard Operating Procedure</h3>${sopList()}
      <p class="dsop-where">📍 Your trainer sends your folder link. The sample structure is in <b>${E(RES_PATH)}</b>.</p></div>
    <div class="dsop-col"><h3>🗂 Folder structure sample</h3>${tree(isTrainee() ? folderName() : "Jane Cruz - " + CASE)}</div></div>`;
}

/* ---------- the trainee's own: 📂 My Case Folder ---------- */
const MY = {link: null, res: null, loaded: false};
async function loadMine(){
  if(MY.loaded || !isTrainee()) return; MY.loaded = true;
  try{
    const [me, s, mine] = await Promise.all([sharedGet("trainee:" + state.traineeId).catch(() => null), sharedGet("settings:drive").catch(() => null),
      typeof storeGet === "function" ? storeGet("case-folder").catch(() => null) : null]);
    MY.link = (me && me.driveLink) || ""; MY.res = (s && s.resources) || ""; MY.cf = mine || {};
  }catch(e){}
  if(state.view === "dashboard" && typeof render === "function") render();
}
function cfDays(){ return (typeof DAYS !== "undefined" ? DAYS : []).filter(d => d.cf); }
function card(){
  loadMine();
  const c = MY.cf || {}, ups = c.uploads || {}, today = cfDays().find(d => d.id === state.dayId) || cfDays()[0];
  const steps = [!!MY.link, !!c.link, !!c.subfolders, Object.keys(ups).length > 0];
  return `<div class="dsop-card"><div class="dsop-card-h"><span aria-hidden="true">📂</span><div><b>My Case Folder</b><small>Built on Day 1 to the firm's SOP, kept current every day: it's part of each day's deliverables.</small></div>
      <button type="button" class="btn btn-ghost btn-sm" onclick="cmDriveSop.show()">📋 The SOP</button></div>
    <div class="dsop-card-b">
      <div class="dsop-row"><span class="dsop-k">${steps[0] ? "✅" : "⏳"} Your folder link</span>${MY.link ? `<a class="btn btn-navy btn-sm" href="${E(MY.link)}" target="_blank" rel="noopener">Open my Drive folder ↗</a>` : `<em>Your trainer will send it here.</em>`}${MY.res ? `<a class="btn btn-ghost btn-sm" href="${E(MY.res)}" target="_blank" rel="noopener">TRAINING RESOURCES ↗</a>` : ""}</div>
      <div class="dsop-row"><span class="dsop-k">1 · Name it exactly</span><code class="dsop-name">${E(folderName())}</code><button type="button" class="btn btn-ghost btn-sm" onclick="cmDriveSop.copy()">Copy</button></div>
      <div class="dsop-row"><span class="dsop-k">${steps[2] ? "✅" : "2 ·"} Firm subfolders</span><label class="dsop-chk"><input type="checkbox" ${c.subfolders ? "checked" : ""} onchange="cmDriveSop.sub(this.checked)"> All nine made, named and numbered as the SOP has them</label></div>
      <div class="dsop-row"><span class="dsop-k">${steps[1] ? "✅" : "3 ·"} Connect it</span><input id="dsopLink" class="dsop-in" type="url" placeholder="Paste the link to your Main Case Folder" value="${E(c.link || "")}"><button type="button" class="btn btn-primary btn-sm" onclick="cmDriveSop.connect()">${c.link ? "Update" : "Connect"}</button>${c.link ? `<a class="btn btn-ghost btn-sm" href="${E(c.link)}" target="_blank" rel="noopener">Open ↗</a>` : ""}</div>
      <div class="dsop-row"><span class="dsop-k">4 · Uploaded today</span><span class="dsop-days">${cfDays().map(d => `<button type="button" class="dsop-day${ups[d.id] ? " on" : ""}" title="${ups[d.id] ? "Uploaded " + E(new Date(ups[d.id]).toLocaleString()) : "Mark today's documents uploaded"}" onclick="cmDriveSop.upload(${d.id})">${ups[d.id] ? "✓ " : ""}Day ${d.cf.n}</button>`).join("")}</span></div>
    </div></div>`;
}
async function saveCf(c){
  MY.cf = c; c.updatedAt = new Date().toISOString();
  try{ if(typeof storeSet === "function") await storeSet("case-folder", c); }catch(e){}
  if(typeof render === "function") render();
}
if(typeof renderDashboard === "function"){
  const __dash = renderDashboard;
  window.renderDashboard = renderDashboard = function(){
    const html = __dash.apply(this, arguments);
    if(!isTrainee()) return html;
    const at = html.indexOf('<div class="module-grid">'); if(at < 0) return html;
    return html.slice(0, at) + card() + html.slice(at);
  };
}

/* ---------- the SOP, any time ---------- */
function show(){
  if(document.getElementById("dsopModal")) return;
  const o = document.createElement("div"); o.id = "dsopModal"; o.className = "dsop-modal"; o.setAttribute("role", "dialog"); o.setAttribute("aria-modal", "true"); o.setAttribute("aria-label", "Case folder SOP");
  o.innerHTML = `<div class="dsop-box"><div class="dsop-box-h"><b>📂 Your Case Folder: the Standard Operating Procedure</b><button type="button" class="btn btn-ghost btn-sm" onclick="cmDriveSop.close()">Close ✕</button></div>${slide()}</div>`;
  o.addEventListener("click", e => { if(e.target === o) o.remove(); });
  document.body.appendChild(o);
}

/* ---------- the trainer's: Admin → 📂 Drive Links ---------- */
const AD = {rows: null, loading: false, res: "", batch: ""};
async function loadAdmin(){
  if(AD.loading) return; AD.loading = true;
  try{
    let people = state.adminData;
    if(!people){ const keys = await sharedList("trainee:"); people = (await sharedGetMany(keys)).filter(Boolean); state.adminData = people; }
    people = people.filter(r => r && r.approved === true && !r.archived);
    const [s, ...progs] = await sharedGetMany(["settings:drive"].concat(people.map(r => "progress:" + r.id)));
    AD.res = (s && s.resources) || "";
    AD.rows = people.map((r, i) => ({rec: r, cf: ((progs[i] || {}).data || {})["case-folder"] || {}}))
      .sort((a, b) => String(a.rec.batch || "").localeCompare(String(b.rec.batch || "")) || String(a.rec.name || "").localeCompare(String(b.rec.name || "")));
  }catch(e){ AD.rows = []; }
  AD.loading = false;
  if(state.view === "admin" && typeof render === "function") render();
}
function renderAdminDriveLinks(){
  if(!AD.rows){ loadAdmin(); return `<div class="card" style="padding:30px;text-align:center;color:var(--ink-soft)">Loading the trainees' folders…</div>`; }
  const days = cfDays(), batches = [...new Set(AD.rows.map(r => r.rec.batch || ""))].filter(Boolean).sort();
  const rows = AD.rows.filter(r => !AD.batch || r.rec.batch === AD.batch);
  return `<div class="dsop-admin">
    <div class="dsop-banner"><div><p>Drive Links</p><h2>📂 Case Folders, the firm's SOP</h2><span>Send each trainee the Drive folder they build their case file in. They name it <code>[Full Name] - ${E(CASE)}</code>, set up the firm's subfolders, connect it here and upload every day.</span></div>
      <button type="button" class="btn btn-ghost btn-sm" onclick="cmDriveSop.refresh()">↻ Refresh</button></div>
    <div class="card dsop-res"><b>TRAINING RESOURCES folder</b><small>${E(RES_PATH)}: every trainee sees this link on their My Case Folder card.</small>
      <div class="dsop-row"><input id="dsopRes" class="dsop-in" type="url" placeholder="https://drive.google.com/drive/folders/…" value="${E(AD.res)}"><button type="button" class="btn btn-primary btn-sm" onclick="cmDriveSop.saveRes()">Save</button></div></div>
    <div class="card dsop-tablecard"><div class="dsop-row"><label>Batch <select onchange="cmDriveSop.batch(this.value)"><option value="">All batches</option>${batches.map(b => `<option ${b === AD.batch ? "selected" : ""}>${E(b)}</option>`).join("")}</select></label><span>${rows.length} trainee${rows.length === 1 ? "" : "s"} · ${rows.filter(r => r.rec.driveLink).length} sent</span></div>
    <div class="dsop-tw"><table class="dsop-table"><thead><tr><th>Trainee</th><th>Batch</th><th>Folder link you send</th><th>Their Main Case Folder</th><th>Subfolders</th>${days.map(d => `<th>Day ${d.cf.n}</th>`).join("")}</tr></thead>
    <tbody>${rows.map(r => { const id = r.rec.id, c = r.cf, ups = c.uploads || {};
      return `<tr><td><b>${E(r.rec.name || id)}</b></td><td>${E(r.rec.batch || "")}</td>
        <td><div class="dsop-cell"><input class="dsop-in" type="url" id="dl-${E(id)}" value="${E(r.rec.driveLink || "")}" placeholder="Paste the folder link"><button type="button" class="btn btn-primary btn-sm" onclick="cmDriveSop.send('${E(id)}')">${r.rec.driveLink ? "Update" : "Send"}</button></div></td>
        <td>${c.link ? `<a href="${E(c.link)}" target="_blank" rel="noopener">Open ↗</a>` : `<span class="dsop-no">Not connected</span>`}</td>
        <td>${c.subfolders ? "✅" : "—"}</td>${days.map(d => `<td title="${ups[d.id] ? E(new Date(ups[d.id]).toLocaleString()) : ""}">${ups[d.id] ? "✅" : "—"}</td>`).join("")}</tr>`; }).join("") || `<tr><td colspan="${5 + days.length}">No approved trainees yet.</td></tr>`}</tbody></table></div></div></div>`;
}
window.renderAdminDriveLinks = renderAdminDriveLinks;

window.cmDriveSop = {
  slide, show, close(){ const o = document.getElementById("dsopModal"); if(o) o.remove(); },
  copy(){ const t = folderName(); try{ navigator.clipboard.writeText(t); say("Copied: " + t); }catch(e){ say(t); } },
  sub(on){ saveCf(Object.assign({}, MY.cf, {subfolders: on ? new Date().toISOString() : null})); },
  connect(){ const v = (document.getElementById("dsopLink") || {}).value || "";
    if(!okLink(v)) return say("Paste the Google Drive link to your Main Case Folder (it starts with https://drive.google.com/).");
    saveCf(Object.assign({}, MY.cf, {link: v.trim(), connectedAt: new Date().toISOString()})); say("📂 Your case folder is connected."); },
  upload(dayId){ const c = Object.assign({}, MY.cf), ups = Object.assign({}, c.uploads || {});
    if(!c.link) return say("Connect your Main Case Folder first (step 3).");
    if(ups[dayId]) delete ups[dayId]; else ups[dayId] = new Date().toISOString();
    c.uploads = ups; saveCf(c); },
  async send(id){
    const v = ((document.getElementById("dl-" + id) || {}).value || "").trim();
    if(v && !okLink(v)) return say("That isn't a Google Drive link.");
    const row = (AD.rows || []).find(r => r.rec.id === id); if(!row) return;
    try{ const cur = await sharedGet("trainee:" + id) || row.rec; cur.driveLink = v; cur.driveLinkAt = new Date().toISOString(); await sharedSet("trainee:" + id, cur); row.rec = cur; say(v ? `📂 Sent to ${cur.name || id}.` : "Link removed."); }
    catch(e){ say("Couldn't save the link. Try again."); }
    render();
  },
  async saveRes(){ const v = ((document.getElementById("dsopRes") || {}).value || "").trim();
    if(v && !okLink(v)) return say("That isn't a Google Drive link.");
    try{ await sharedSet("settings:drive", {resources: v, at: new Date().toISOString()}); AD.res = v; say("Saved: every trainee sees it now."); }catch(e){ say("Couldn't save. Try again."); } },
  batch(b){ AD.batch = b; render(); },
  refresh(){ AD.rows = null; state.adminData = null; render(); },
  name: folderName, SOP, SUBS
};

const css = document.createElement("style"); css.id = "cm-drive-sop";
css.textContent = `
.dsop-slide{display:grid;grid-template-columns:minmax(0,1.15fr) minmax(0,1fr);gap:18px;}
.dsop-col{background:#fff;border:1px solid #DDE1EA;border-radius:14px;padding:14px 18px;color:#141A2E;}
.dsop-col h3{margin:0 0 10px;font:800 20px 'Poppins','Inter',sans-serif;color:#1E2340;}
.dsop-steps{list-style:none;margin:0;padding:0;display:flex;flex-direction:column;gap:10px;}
.dsop-steps li{display:flex;gap:12px;align-items:flex-start;} .dsop-n{flex:0 0 32px;height:32px;border-radius:50%;background:#1E2340;color:#F6C08F;display:flex;align-items:center;justify-content:center;font:800 16px 'Inter',sans-serif;}
.dsop-steps b{display:block;font:800 18px 'Inter',sans-serif;color:#1E2340;} .dsop-steps span{display:block;font:600 16.5px/1.45 'Inter',sans-serif;}
.dsop-steps code,.dsop-name,.dsop-banner code{background:#FFF4E6;border:1px solid #F0C9A0;border-radius:6px;padding:1px 6px;font:700 15px 'IBM Plex Mono',monospace;color:#8E3A0B;}
.dsop-where{margin:12px 0 0;padding:8px 12px;border-left:4px solid #DB8437;background:#FFF8F0;font:600 14px/1.45 'Inter',sans-serif;}
.dsop-tree{font:600 15.5px 'Inter',sans-serif;} .dsop-root{display:flex;align-items:baseline;gap:8px;flex-wrap:wrap;padding:8px 10px;border-radius:10px;background:#1E2340;color:#fff;}
.dsop-root small{color:#F6C08F;font:800 11.5px 'Inter',sans-serif;letter-spacing:.08em;text-transform:uppercase;}
.dsop-tree ul{list-style:none;margin:6px 0 0 18px;padding:0 0 0 14px;border-left:3px solid #DB8437;display:flex;flex-direction:column;gap:3px;}
.dsop-tree li{display:flex;gap:8px;align-items:baseline;flex-wrap:wrap;padding:3px 0;} .dsop-tree li b{color:#1E2340;} .dsop-tree li small{color:#4A5068;font:600 13px 'Inter',sans-serif;}
.dsop-card{margin:0 0 14px;border-radius:14px;background:var(--surface-glass,rgba(255,255,255,.8));backdrop-filter:blur(10px);border:1px solid #E3E6EE;border-left:5px solid #DB8437;padding:12px 16px;}
.dsop-card-h{display:flex;align-items:center;gap:12px;} .dsop-card-h > span{font-size:26px;} .dsop-card-h > div{flex:1;display:flex;flex-direction:column;} .dsop-card-h b{font:800 17px 'Inter',sans-serif;color:#1E2340;} .dsop-card-h small{font:600 13.5px 'Inter',sans-serif;color:#3C4258;}
.dsop-card-b{display:flex;flex-direction:column;gap:6px;margin-top:8px;}
.dsop-row{display:flex;align-items:center;gap:10px;flex-wrap:wrap;} .dsop-k{min-width:150px;font:800 13.5px 'Inter',sans-serif;color:#1E2340;}
.dsop-in{flex:1;min-width:220px;padding:7px 10px;border:1px solid #C9CEDC;border-radius:8px;font:600 14px 'Inter',sans-serif;}
.dsop-chk{font:600 14px 'Inter',sans-serif;display:flex;gap:6px;align-items:center;}
.dsop-days{display:flex;gap:6px;flex-wrap:wrap;} .dsop-day{border:1px solid #C9CEDC;background:#fff;border-radius:999px;padding:4px 12px;font:700 13px 'Inter',sans-serif;cursor:pointer;color:#1E2340;}
.dsop-day.on{background:#1E8E4F;border-color:#1E8E4F;color:#fff;}
.dsop-modal{position:fixed;inset:0;z-index:2147482400;background:rgba(15,20,40,.6);display:flex;align-items:center;justify-content:center;padding:16px;}
.dsop-box{background:#F5F6FA;border-radius:18px;padding:16px 18px;max-width:1100px;width:100%;max-height:92vh;overflow:auto;border-top:6px solid #DB8437;}
.dsop-box-h{display:flex;justify-content:space-between;align-items:center;gap:10px;margin-bottom:12px;font:800 18px 'Inter',sans-serif;color:#1E2340;}
.dsop-banner{display:flex;justify-content:space-between;align-items:flex-start;gap:12px;background:linear-gradient(135deg,#1F2440,#2B3158);color:#fff;border-radius:16px;padding:18px 22px;margin-bottom:14px;}
.dsop-banner p{margin:0;font:800 12px 'Inter',sans-serif;letter-spacing:.1em;text-transform:uppercase;color:#F6C08F;} .dsop-banner h2{margin:4px 0;font:800 24px 'Poppins','Inter',sans-serif;color:#fff;} .dsop-banner span{font:600 14.5px/1.5 'Inter',sans-serif;color:#E3E7F1;}
.dsop-res{padding:14px 16px;margin-bottom:14px;display:flex;flex-direction:column;gap:6px;} .dsop-res b{font:800 15px 'Inter',sans-serif;color:#1E2340;} .dsop-res small{font:600 13px 'Inter',sans-serif;color:#4A5068;}
.dsop-tablecard{padding:14px 16px;} .dsop-tw{overflow-x:auto;margin-top:10px;}
.dsop-table{width:100%;border-collapse:collapse;font:600 14px 'Inter',sans-serif;} .dsop-table th{background:#1E2340;color:#fff;text-align:left;padding:9px 10px;font:800 13px 'Inter',sans-serif;white-space:nowrap;}
.dsop-table td{padding:8px 10px;border-bottom:1px solid #E3E6EE;vertical-align:middle;} .dsop-table tr:nth-child(even) td{background:#F7F8FB;}
.dsop-cell{display:flex;gap:6px;min-width:320px;} .dsop-no{color:#A4470F;font-weight:700;}
@media(max-width:860px){ .dsop-slide{grid-template-columns:1fr;} .dsop-k{min-width:0;width:100%;} }`;
document.head.appendChild(css);
})();
